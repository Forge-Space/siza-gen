from __future__ import annotations

from unittest.mock import MagicMock, patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app
from siza_ml.data_ingestion import _bundled_axe_rules, _looks_like_ui_code

DIMS = 384


@pytest.fixture(autouse=True)
def mock_model():
    fake = MagicMock()
    fake.get_sentence_embedding_dimension.return_value = DIMS
    fake.encode = lambda texts, **kw: np.random.randn(
        len(texts) if isinstance(texts, list) else 1, DIMS
    ).astype(np.float32)
    with (
        patch("siza_ml.embeddings._model", fake),
        patch("siza_ml.embeddings._get_model", return_value=fake),
        patch("siza_ml.data_ingestion._get_model", return_value=fake),
    ):
        yield


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestAxeCoreIngestion:
    async def test_ingest_bundled_rules(self, client):
        with patch("siza_ml.data_ingestion._load_axe_rules", return_value=_bundled_axe_rules()):
            resp = await client.post("/ingest/axe-core", json={})
        assert resp.status_code == 200
        data = resp.json()
        assert data["count"] == 10
        assert len(data["entries"]) == 10
        assert data["entries"][0]["entry_type"] == "rule"
        assert data["entries"][0]["id"].startswith("axe-")

    async def test_ingest_empty_rules(self, client):
        with patch("siza_ml.data_ingestion._load_axe_rules", return_value=[]):
            resp = await client.post("/ingest/axe-core", json={})
        assert resp.status_code == 400


class TestBundledRules:
    def test_has_critical_rules(self):
        rules = _bundled_axe_rules()
        ids = {r["id"] for r in rules}
        assert "image-alt" in ids
        assert "button-name" in ids
        assert "label" in ids
        assert "color-contrast" in ids

    def test_rules_have_required_fields(self):
        for rule in _bundled_axe_rules():
            assert "id" in rule
            assert "description" in rule
            assert "tags" in rule


class TestUICodeDetection:
    def test_react_component(self):
        code = "export default function Button({ onClick }) { return (<button onClick={onClick}>Click</button>) }"
        assert _looks_like_ui_code(code) is True

    def test_non_ui_code(self):
        code = "const x = 1 + 2; console.log(x);"
        assert _looks_like_ui_code(code) is False

    def test_html_template(self):
        code = '<div className="container"><form><input type="text" /></form></div>'
        assert _looks_like_ui_code(code) is True
