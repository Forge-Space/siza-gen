from __future__ import annotations

import psutil
from fastapi import APIRouter

router = APIRouter(tags=["health"])

_model_loaded = False


def set_model_loaded(loaded: bool) -> None:
    global _model_loaded
    _model_loaded = loaded


def is_model_loaded() -> bool:
    return _model_loaded


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/ready")
async def ready() -> dict:
    mem = psutil.virtual_memory()
    return {
        "ready": _model_loaded,
        "model_loaded": _model_loaded,
        "memory_available_mb": round(mem.available / 1024 / 1024),
        "memory_percent": mem.percent,
    }
