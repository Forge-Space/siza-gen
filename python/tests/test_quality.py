from __future__ import annotations

from unittest.mock import MagicMock, patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app

DIMS = 384

SAMPLE_CODE = """
export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-primary text-foreground rounded-md
        hover:opacity-90 focus:outline-none focus:ring-2"
      role="button"
      aria-label="Action button"
    >
      {children}
    </button>
  );
}
"""


@pytest.fixture(autouse=True)
def mock_model():
    fake = MagicMock()
    fake.get_sentence_embedding_dimension.return_value = DIMS
    fake.encode = lambda text, **kw: np.random.randn(DIMS).astype(np.float32)
    with patch("siza_ml.embeddings._model", fake):
        with patch("siza_ml.embeddings._get_model", return_value=fake):
            yield


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestScoreEndpoint:
    async def test_heuristic_scoring(self, client):
        resp = await client.post(
            "/score",
            json={
                "prompt": "Create a button component",
                "code": SAMPLE_CODE,
                "component_type": "button",
                "framework": "react",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert 0 <= data["score"] <= 10
        assert data["source"] in ("heuristic", "ollama")
        assert "factors" in data

    async def test_empty_code_gets_low_score(self, client):
        resp = await client.post(
            "/score",
            json={"prompt": "button", "code": "x"},
        )
        assert resp.status_code == 200
        assert resp.json()["score"] <= 5

    async def test_score_without_optional_params(self, client):
        resp = await client.post(
            "/score",
            json={"prompt": "button", "code": SAMPLE_CODE},
        )
        assert resp.status_code == 200


class TestEnhanceEndpoint:
    async def test_rule_enhancement(self, client):
        resp = await client.post(
            "/enhance",
            json={
                "prompt": "make a nice button",
                "component_type": "button",
                "framework": "react",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["enhanced"]) > len("make a nice button")
        assert data["source"] in ("rules", "ollama")
        assert len(data["additions"]) > 0

    async def test_accessibility_added(self, client):
        resp = await client.post(
            "/enhance",
            json={"prompt": "create a form"},
        )
        data = resp.json()
        assert "aria" in data["enhanced"].lower() or "accessibility" in data["additions"]

    async def test_responsive_added(self, client):
        resp = await client.post(
            "/enhance",
            json={"prompt": "create a card"},
        )
        data = resp.json()
        assert "responsive" in data["enhanced"].lower() or "responsive" in data["additions"]
