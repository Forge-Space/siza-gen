"""TurboQuant KV cache compression hook for sentence-transformers.

Patches transformer attention layers to compress K/V tensors during
the forward pass using TurboQuant (PolarQuant + QJL). Reduces peak
memory for long documents and large batches.

TurboQuant reference: https://github.com/TheTom/turboquant_plus
"""

from __future__ import annotations

import logging
from contextlib import contextmanager
from dataclasses import dataclass
from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer

logger = logging.getLogger("siza_ml.turbo_cache")

_turboquant_available: bool | None = None


def _check_turboquant() -> bool:
    global _turboquant_available
    if _turboquant_available is None:
        try:
            import turboquant  # noqa: F401

            _turboquant_available = True
        except ImportError:
            _turboquant_available = False
            logger.debug("turboquant not installed — KV cache compression disabled")
    return _turboquant_available


@dataclass
class TurboConfig:
    k_bits: int = 3
    v_bits: int = 3
    min_seq_len: int = 64
    seed: int = 42


_DEFAULT = TurboConfig()


class _AttentionHook:
    """Registers on a single attention layer and compresses KV mid-forward."""

    def __init__(self, head_dim: int, cfg: TurboConfig) -> None:
        from turboquant.kv_cache import KVCacheCompressor

        self._cmp = KVCacheCompressor(
            head_dim=head_dim,
            k_bits=cfg.k_bits,
            v_bits=cfg.v_bits,
            seed=cfg.seed,
        )
        self._min_seq = cfg.min_seq_len
        self._handle = None

    def _hook(self, module, args, output):
        try:
            import torch

            attn_out, attn_weights = output if isinstance(output, tuple) else (output, None)

            # Extract K/V from module cache if present (BertAttention stores them)
            k = getattr(module, "_turbo_k", None)
            v = getattr(module, "_turbo_v", None)
            if k is None or v is None:
                return output

            seq_len = k.shape[-2]
            if seq_len < self._min_seq:
                return output

            # Convert to numpy: (batch, heads, seq, head_dim) → compress each batch item
            k_np = k.detach().cpu().float().numpy()
            v_np = v.detach().cpu().float().numpy()

            k_hat_list, v_hat_list = [], []
            for b in range(k_np.shape[0]):
                compressed = self._cmp.compress(
                    k_np[b : b + 1],
                    v_np[b : b + 1],
                )
                k_hat, v_hat = self._cmp.decompress(compressed)
                k_hat_list.append(k_hat)
                v_hat_list.append(v_hat)

            k_hat_np = np.concatenate(k_hat_list, axis=0)
            v_hat_np = np.concatenate(v_hat_list, axis=0)

            module._turbo_k = torch.from_numpy(k_hat_np).to(k.device, k.dtype)
            module._turbo_v = torch.from_numpy(v_hat_np).to(v.device, v.dtype)

        except Exception as exc:
            logger.debug("TurboQuant hook error (ignored): %s", exc)

        return output

    def register(self, module) -> None:
        self._handle = module.register_forward_hook(self._hook)

    def remove(self) -> None:
        if self._handle is not None:
            self._handle.remove()
            self._handle = None


def _patch_kv_capture(module) -> list:
    """Inject pre-hooks to capture K/V before attention computation."""

    handles = []

    def _pre_hook(mod, args):
        if hasattr(mod, "key") and hasattr(mod, "value"):
            try:
                hidden = args[0] if args else None
                if hidden is not None and hasattr(mod, "transpose_for_scores"):
                    mod._turbo_k = mod.transpose_for_scores(mod.key(hidden))
                    mod._turbo_v = mod.transpose_for_scores(mod.value(hidden))
            except Exception:
                pass

    for child in module.modules():
        if child.__class__.__name__ in ("BertSelfAttention", "RobertaSelfAttention"):
            handles.append(child.register_forward_pre_hook(_pre_hook))

    return handles


@contextmanager
def turbo_attention(model: SentenceTransformer, cfg: TurboConfig = _DEFAULT):
    """Context manager: compress KV cache for all attention layers during encode.

    Usage:
        with turbo_attention(model):
            vecs = model.encode(texts, batch_size=32)
    """
    if not _check_turboquant():
        yield
        return

    try:
        auto_model = model._modules.get("0")
        transformer = getattr(auto_model, "auto_model", None) if auto_model else None
        if transformer is None:
            yield
            return

        try:
            sample = next(transformer.parameters())
            _, head_dim = sample.shape[0], 64
            # Infer head_dim from first BertSelfAttention
            for child in transformer.modules():
                if child.__class__.__name__ in ("BertSelfAttention", "RobertaSelfAttention"):
                    head_dim = child.attention_head_size
                    break
        except StopIteration:
            yield
            return

        hooks: list[_AttentionHook] = []
        pre_handles = _patch_kv_capture(transformer)

        for child in transformer.modules():
            if child.__class__.__name__ in ("BertSelfAttention", "RobertaSelfAttention"):
                hook = _AttentionHook(head_dim=head_dim, cfg=cfg)
                hook.register(child)
                hooks.append(hook)

        logger.debug(
            "TurboQuant: patched %d attention layers (k=%dbit v=%dbit)",
            len(hooks),
            cfg.k_bits,
            cfg.v_bits,
        )

        try:
            yield
        finally:
            for hook in hooks:
                hook.remove()
            for h in pre_handles:
                h.remove()
            logger.debug("TurboQuant: hooks removed")

    except Exception as exc:
        logger.warning("TurboQuant setup failed, running without compression: %s", exc)
        yield
