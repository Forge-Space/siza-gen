from __future__ import annotations

import base64
import logging
import struct
from pathlib import Path

import faiss
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .config import settings

router = APIRouter(prefix="/vector", tags=["vector"])
logger = logging.getLogger("siza_ml.vector_store")

_index: faiss.IndexFlatIP | None = None
_id_map: list[str] = []
_metadata_map: dict[str, dict[str, str]] = {}

INDEX_PATH = Path(settings.data_dir) / "faiss.index"
IDS_PATH = Path(settings.data_dir) / "faiss_ids.txt"


def _get_index() -> faiss.IndexFlatIP:
    global _index
    if _index is None:
        _index = faiss.IndexFlatIP(settings.embedding_dimensions)
        _load_persisted()
    return _index


def _load_persisted() -> None:
    global _index, _id_map
    if INDEX_PATH.exists() and IDS_PATH.exists():
        try:
            _index = faiss.read_index(str(INDEX_PATH))
            _id_map = IDS_PATH.read_text().strip().split("\n")
            logger.info("Loaded FAISS index: %d vectors", _index.ntotal)
        except Exception:
            logger.warning("Failed to load persisted index, starting fresh")
            _index = faiss.IndexFlatIP(settings.embedding_dimensions)
            _id_map = []


def _persist() -> None:
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    faiss.write_index(_get_index(), str(INDEX_PATH))
    IDS_PATH.write_text("\n".join(_id_map))


def _decode_vector(b64: str) -> np.ndarray:
    raw = base64.b64decode(b64)
    dims = len(raw) // 4
    return np.array(struct.unpack(f"{dims}f", raw), dtype=np.float32)


class VectorEntry(BaseModel):
    id: str
    vector: str
    metadata: dict[str, str] | None = None


class IndexRequest(BaseModel):
    entries: list[VectorEntry]


class IndexResponse(BaseModel):
    indexed: int


class SearchRequest(BaseModel):
    vector: str
    top_k: int = 5


class SearchResult(BaseModel):
    id: str
    distance: float
    metadata: dict[str, str] | None = None


class StatsResponse(BaseModel):
    total_vectors: int
    dimensions: int


@router.post("/index", response_model=IndexResponse)
async def index_vectors(req: IndexRequest) -> IndexResponse:
    if not req.entries:
        raise HTTPException(status_code=400, detail="Entries must not be empty")

    idx = _get_index()
    vecs = []
    for entry in req.entries:
        vec = _decode_vector(entry.vector)
        vecs.append(vec)
        _id_map.append(entry.id)
        if entry.metadata:
            _metadata_map[entry.id] = entry.metadata

    matrix = np.stack(vecs).astype(np.float32)
    faiss.normalize_L2(matrix)
    idx.add(matrix)
    _persist()

    return IndexResponse(indexed=len(req.entries))


@router.post("/search", response_model=list[SearchResult])
async def search_vectors(req: SearchRequest) -> list[SearchResult]:
    idx = _get_index()
    if idx.ntotal == 0:
        return []

    vec = _decode_vector(req.vector).reshape(1, -1).astype(np.float32)
    faiss.normalize_L2(vec)

    k = min(req.top_k, idx.ntotal)
    distances, indices = idx.search(vec, k)

    results = []
    for dist, i in zip(distances[0], indices[0], strict=True):
        if i < 0 or i >= len(_id_map):
            continue
        entry_id = _id_map[i]
        results.append(
            SearchResult(
                id=entry_id,
                distance=float(dist),
                metadata=_metadata_map.get(entry_id),
            )
        )
    return results


@router.post("/rebuild", response_model=IndexResponse)
async def rebuild_index() -> IndexResponse:
    global _index, _id_map, _metadata_map
    _index = faiss.IndexFlatIP(settings.embedding_dimensions)
    _id_map = []
    _metadata_map = {}
    _persist()
    return IndexResponse(indexed=0)


@router.get("/stats", response_model=StatsResponse)
async def vector_stats() -> StatsResponse:
    idx = _get_index()
    return StatsResponse(
        total_vectors=idx.ntotal,
        dimensions=settings.embedding_dimensions,
    )
