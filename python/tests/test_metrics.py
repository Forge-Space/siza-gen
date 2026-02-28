from __future__ import annotations

import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app


@pytest.fixture(autouse=True)
def mock_model():
    fake = MagicMock()
    fake.get_sentence_embedding_dimension.return_value = 384
    fake.encode = lambda text, **kw: np.random.randn(384).astype(np.float32)
    with patch("siza_ml.embeddings._model", fake):
        with patch("siza_ml.embeddings._get_model", return_value=fake):
            yield


@pytest.fixture(autouse=True)
def temp_metrics_file():
    with tempfile.TemporaryDirectory() as td:
        metrics_path = Path(td) / "metrics.jsonl"
        with patch("siza_ml.metrics.METRICS_FILE", metrics_path):
            yield metrics_path


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestMetricsRecord:
    async def test_record_metric(self, client):
        resp = await client.post(
            "/metrics/record",
            json={"event": "embed_latency", "value": 42.5, "unit": "ms"},
        )
        assert resp.status_code == 200
        assert resp.json()["recorded"] is True

    async def test_record_with_metadata(self, client):
        resp = await client.post(
            "/metrics/record",
            json={
                "event": "score_latency",
                "value": 100.0,
                "metadata": {"source": "heuristic"},
            },
        )
        assert resp.status_code == 200


class TestMetricsReport:
    async def test_empty_report(self, client):
        resp = await client.get("/metrics/report")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_records"] == 0
        assert data["summaries"] == []

    async def test_report_with_data(self, client):
        for val in [10, 20, 30, 40, 50]:
            await client.post(
                "/metrics/record",
                json={"event": "test_event", "value": val},
            )

        resp = await client.get("/metrics/report")
        data = resp.json()
        assert data["total_records"] == 5
        assert len(data["summaries"]) == 1
        summary = data["summaries"][0]
        assert summary["event"] == "test_event"
        assert summary["count"] == 5
        assert summary["avg"] == 30.0
        assert summary["min"] == 10.0
        assert summary["max"] == 50.0
