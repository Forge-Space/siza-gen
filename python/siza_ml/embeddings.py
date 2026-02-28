from __future__ import annotations

import base64
import logging
import struct

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .config import settings
from .health import set_model_loaded

router = APIRouter(tags=["embeddings"])
logger = logging.getLogger("siza_ml.embeddings")

_model = None


def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        logger.info("Loading model: %s", settings.model_name)
        _model = SentenceTransformer(
            settings.model_name,
            cache_folder=settings.cache_dir,
        )
        set_model_loaded(True)
        logger.info(
            "Model loaded: %s (%dd)", settings.model_name, _model.get_sentence_embedding_dimension()
        )
    return _model


def encode_vector_b64(vec: np.ndarray) -> str:
    return base64.b64encode(vec.astype(np.float32).tobytes()).decode("ascii")


def decode_vector_b64(b64: str, dims: int) -> np.ndarray:
    raw = base64.b64decode(b64)
    return np.array(struct.unpack(f"{dims}f", raw), dtype=np.float32)


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    vector: str
    dimensions: int


class EmbedBatchRequest(BaseModel):
    texts: list[str]


class EmbedBatchResponse(BaseModel):
    vectors: list[str]
    dimensions: int
    count: int


@router.post("/embed", response_model=EmbedResponse)
async def embed_single(req: EmbedRequest) -> EmbedResponse:
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty")

    model = _get_model()
    vec = model.encode(req.text, normalize_embeddings=True)
    return EmbedResponse(
        vector=encode_vector_b64(vec),
        dimensions=len(vec),
    )


@router.post("/embed/batch", response_model=EmbedBatchResponse)
async def embed_batch(req: EmbedBatchRequest) -> EmbedBatchResponse:
    if not req.texts:
        raise HTTPException(status_code=400, detail="Texts list must not be empty")

    model = _get_model()
    vecs = model.encode(
        req.texts,
        normalize_embeddings=True,
        batch_size=settings.batch_size,
    )

    encoded = [encode_vector_b64(v) for v in vecs]
    return EmbedBatchResponse(
        vectors=encoded,
        dimensions=vecs.shape[1],
        count=len(encoded),
    )


def warmup() -> None:
    logger.info("Warming up embedding model...")
    _get_model()
    logger.info("Model warm-up complete")
