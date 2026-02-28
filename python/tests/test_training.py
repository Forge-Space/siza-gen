from __future__ import annotations

import json
import tempfile
from unittest.mock import MagicMock, patch

import numpy as np
import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app
from siza_ml.training import _load_training_data


@pytest.fixture(autouse=True)
def mock_model():
    fake = MagicMock()
    fake.get_sentence_embedding_dimension.return_value = 384
    fake.encode = lambda text, **kw: np.random.randn(384).astype(np.float32)
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


@pytest.fixture
def training_data_file():
    with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
        for i in range(5):
            entry = {
                "prompt": f"Create component {i}",
                "code": f"function C{i}() {{ return <div>{i}</div> }}",
            }
            f.write(json.dumps(entry) + "\n")
        return f.name


class TestLoadTrainingData:
    def test_loads_valid_jsonl(self, training_data_file):
        data = _load_training_data(training_data_file)
        assert len(data) == 5
        assert "prompt" in data[0]
        assert "code" in data[0]

    def test_skips_invalid_lines(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
            f.write('{"prompt": "a", "code": "b"}\n')
            f.write("not json\n")
            f.write('{"no_prompt": true}\n')
            f.write('{"prompt": "c", "code": "d"}\n')
            name = f.name
        data = _load_training_data(name)
        assert len(data) == 2


class TestTrainEndpoints:
    async def test_start_training(self, client, training_data_file):
        with patch("siza_ml.training._run_training"):
            resp = await client.post(
                "/train/start",
                json={
                    "adapter_type": "quality-scorer",
                    "data_path": training_data_file,
                },
            )
        assert resp.status_code == 200
        data = resp.json()
        assert "job_id" in data
        assert data["status"] == "queued"

    async def test_start_missing_file(self, client):
        resp = await client.post(
            "/train/start",
            json={
                "adapter_type": "quality-scorer",
                "data_path": "/nonexistent/file.jsonl",
            },
        )
        assert resp.status_code == 400

    async def test_get_status(self, client, training_data_file):
        with patch("siza_ml.training._run_training"):
            start_resp = await client.post(
                "/train/start",
                json={
                    "adapter_type": "quality-scorer",
                    "data_path": training_data_file,
                },
            )
        job_id = start_resp.json()["job_id"]

        resp = await client.get(f"/train/status/{job_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["job_id"] == job_id
        assert data["adapter_type"] == "quality-scorer"

    async def test_cancel_training(self, client, training_data_file):
        with patch("siza_ml.training._run_training"):
            start_resp = await client.post(
                "/train/start",
                json={
                    "adapter_type": "quality-scorer",
                    "data_path": training_data_file,
                },
            )
        job_id = start_resp.json()["job_id"]

        resp = await client.post(f"/train/cancel/{job_id}")
        assert resp.status_code == 200
        assert resp.json()["cancelled"] is True

    async def test_status_not_found(self, client):
        resp = await client.get("/train/status/nonexistent")
        assert resp.status_code == 404

    async def test_training_summary(self, client, training_data_file):
        with patch("siza_ml.training._run_training"):
            await client.post(
                "/train/start",
                json={
                    "adapter_type": "quality-scorer",
                    "data_path": training_data_file,
                },
            )
        resp = await client.get("/train/summary")
        assert resp.status_code == 200
        data = resp.json()
        assert "jobs" in data
        assert len(data["jobs"]) >= 1
