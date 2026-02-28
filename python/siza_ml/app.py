from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .data_ingestion import router as ingestion_router
from .embeddings import router as embeddings_router
from .embeddings import warmup
from .health import router as health_router
from .metrics import router as metrics_router
from .prompt_enhancer import router as prompt_router
from .quality_scorer import router as quality_router
from .training import router as training_router
from .vector_store import router as vector_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("siza_ml")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting siza-ml sidecar on %s:%d", settings.host, settings.port)
    warmup()
    yield
    logger.info("Shutting down siza-ml sidecar")


app = FastAPI(
    title="siza-ml",
    description="Python ML sidecar for siza-gen",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(embeddings_router)
app.include_router(vector_router)
app.include_router(quality_router)
app.include_router(prompt_router)
app.include_router(training_router)
app.include_router(ingestion_router)
app.include_router(metrics_router)
