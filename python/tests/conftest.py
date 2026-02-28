from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from siza_ml.app import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
