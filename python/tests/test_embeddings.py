from __future__ import annotations

import base64
from unittest.mock import MagicMock, patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app
from siza_ml.embeddings import decode_vector_b64, encode_vector_b64

DIMS = 384


def make_fake_model():
    model = MagicMock()
    model.get_sentence_embedding_dimension.return_value = DIMS

    def fake_encode(text_or_texts, **kwargs):
        if isinstance(text_or_texts, list):
            return np.random.randn(len(text_or_texts), DIMS).astype(np.float32)
        return np.random.randn(DIMS).astype(np.float32)

    model.encode = fake_encode
    return model


@pytest.fixture(autouse=True)
def mock_model():
    fake = make_fake_model()
    with (
        patch("siza_ml.embeddings._model", fake),
        patch("siza_ml.embeddings._get_model", return_value=fake),
    ):
        yield fake


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestEncoding:
    def test_encode_decode_roundtrip(self):
        vec = np.random.randn(DIMS).astype(np.float32)
        b64 = encode_vector_b64(vec)
        decoded = decode_vector_b64(b64, DIMS)
        np.testing.assert_array_almost_equal(vec, decoded)

    def test_encode_produces_base64(self):
        vec = np.zeros(DIMS, dtype=np.float32)
        b64 = encode_vector_b64(vec)
        raw = base64.b64decode(b64)
        assert len(raw) == DIMS * 4


class TestEmbedEndpoint:
    async def test_embed_returns_correct_dimensions(self, client):
        resp = await client.post("/embed", json={"text": "hello world"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["dimensions"] == DIMS
        raw = base64.b64decode(data["vector"])
        assert len(raw) == DIMS * 4

    async def test_embed_empty_text_rejected(self, client):
        resp = await client.post("/embed", json={"text": "  "})
        assert resp.status_code == 400

    async def test_embed_missing_text_rejected(self, client):
        resp = await client.post("/embed", json={})
        assert resp.status_code == 422


class TestBatchEndpoint:
    async def test_batch_returns_multiple_vectors(self, client):
        resp = await client.post(
            "/embed/batch",
            json={"texts": ["hello", "world", "test"]},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["count"] == 3
        assert len(data["vectors"]) == 3
        assert data["dimensions"] == DIMS

    async def test_batch_empty_list_rejected(self, client):
        resp = await client.post("/embed/batch", json={"texts": []})
        assert resp.status_code == 400


class TestHealthEndpoints:
    async def test_health(self, client):
        resp = await client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"

    async def test_ready(self, client):
        resp = await client.get("/ready")
        assert resp.status_code == 200
        data = resp.json()
        assert "ready" in data
        assert "memory_available_mb" in data
