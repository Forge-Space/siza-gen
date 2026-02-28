from __future__ import annotations

import base64
from unittest.mock import patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app

DIMS = 384


def make_vector_b64(dims: int = DIMS) -> str:
    vec = np.random.randn(dims).astype(np.float32)
    return base64.b64encode(vec.tobytes()).decode("ascii")


@pytest.fixture(autouse=True)
def reset_index():
    import siza_ml.vector_store as vs

    vs._index = None
    vs._id_map = []
    vs._metadata_map = {}
    with patch.object(vs, "_persist"):
        yield


@pytest.fixture(autouse=True)
def mock_model():
    from unittest.mock import MagicMock

    fake = MagicMock()
    fake.get_sentence_embedding_dimension.return_value = DIMS
    fake.encode = lambda text, **kw: np.random.randn(DIMS).astype(np.float32)
    with (
        patch("siza_ml.embeddings._model", fake),
        patch("siza_ml.embeddings._get_model", return_value=fake),
    ):
        yield


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestVectorIndex:
    async def test_index_vectors(self, client):
        entries = [
            {"id": "a", "vector": make_vector_b64()},
            {"id": "b", "vector": make_vector_b64()},
        ]
        resp = await client.post("/vector/index", json={"entries": entries})
        assert resp.status_code == 200
        assert resp.json()["indexed"] == 2

    async def test_index_empty_rejected(self, client):
        resp = await client.post("/vector/index", json={"entries": []})
        assert resp.status_code == 400


class TestVectorSearch:
    async def test_search_returns_results(self, client):
        entries = [
            {"id": "x", "vector": make_vector_b64()},
            {"id": "y", "vector": make_vector_b64()},
        ]
        await client.post("/vector/index", json={"entries": entries})

        resp = await client.post(
            "/vector/search",
            json={"vector": make_vector_b64(), "top_k": 2},
        )
        assert resp.status_code == 200
        results = resp.json()
        assert len(results) == 2
        assert "id" in results[0]
        assert "distance" in results[0]

    async def test_search_empty_index(self, client):
        resp = await client.post(
            "/vector/search",
            json={"vector": make_vector_b64(), "top_k": 5},
        )
        assert resp.status_code == 200
        assert resp.json() == []


class TestVectorStats:
    async def test_stats_empty(self, client):
        resp = await client.get("/vector/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_vectors"] == 0
        assert data["dimensions"] == DIMS

    async def test_stats_after_index(self, client):
        entries = [{"id": "z", "vector": make_vector_b64()}]
        await client.post("/vector/index", json={"entries": entries})
        resp = await client.get("/vector/stats")
        assert resp.json()["total_vectors"] == 1


class TestVectorRebuild:
    async def test_rebuild_clears_index(self, client):
        entries = [{"id": "a", "vector": make_vector_b64()}]
        await client.post("/vector/index", json={"entries": entries})
        resp = await client.post("/vector/rebuild")
        assert resp.status_code == 200
        assert resp.json()["indexed"] == 0
        stats = await client.get("/vector/stats")
        assert stats.json()["total_vectors"] == 0
