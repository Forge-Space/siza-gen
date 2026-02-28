from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_name: str = "all-MiniLM-L6-v2"
    cache_dir: str = str(Path.cwd() / ".uiforge" / "models")
    host: str = "0.0.0.0"
    port: int = 8100
    batch_size: int = 32
    embedding_dimensions: int = 384
    ollama_url: str = "http://localhost:11434"
    data_dir: str = str(Path.cwd() / ".uiforge")

    model_config = {"env_prefix": "SIZA_ML_"}


settings = Settings()
