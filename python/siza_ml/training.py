from __future__ import annotations

import json
import logging
import threading
import uuid
from dataclasses import dataclass, field
from enum import StrEnum
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .config import settings

router = APIRouter(prefix="/train", tags=["training"])
logger = logging.getLogger("siza_ml.training")


class JobStatus(StrEnum):
    QUEUED = "queued"
    PREPARING = "preparing"
    TRAINING = "training"
    COMPLETE = "complete"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class TrainingJob:
    job_id: str
    adapter_type: str
    data_path: str
    status: JobStatus = JobStatus.QUEUED
    progress: float = 0.0
    error: str | None = None
    config: dict = field(default_factory=dict)
    _cancel_flag: bool = False


_jobs: dict[str, TrainingJob] = {}
_threads: dict[str, threading.Thread] = {}


class TrainStartRequest(BaseModel):
    adapter_type: str
    data_path: str
    config: dict | None = None


class TrainStartResponse(BaseModel):
    job_id: str
    status: str


class TrainStatusResponse(BaseModel):
    job_id: str
    adapter_type: str
    status: str
    progress: float
    error: str | None = None


class TrainSummaryResponse(BaseModel):
    jobs: list[TrainStatusResponse]
    active_count: int


@router.post("/start", response_model=TrainStartResponse)
async def start_training(req: TrainStartRequest) -> TrainStartResponse:
    data_path = Path(req.data_path)
    if not data_path.exists():
        raise HTTPException(status_code=400, detail=f"Data file not found: {req.data_path}")

    job_id = str(uuid.uuid4())[:8]
    config = req.config or {}
    job = TrainingJob(
        job_id=job_id,
        adapter_type=req.adapter_type,
        data_path=req.data_path,
        config=config,
    )
    _jobs[job_id] = job

    thread = threading.Thread(target=_run_training, args=(job,), daemon=True)
    _threads[job_id] = thread
    thread.start()

    return TrainStartResponse(job_id=job_id, status=job.status.value)


@router.get("/status/{job_id}", response_model=TrainStatusResponse)
async def get_status(job_id: str) -> TrainStatusResponse:
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    return _job_to_response(job)


@router.post("/cancel/{job_id}")
async def cancel_training(job_id: str) -> dict:
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")

    job._cancel_flag = True
    job.status = JobStatus.CANCELLED
    return {"cancelled": True}


@router.get("/summary", response_model=TrainSummaryResponse)
async def training_summary() -> TrainSummaryResponse:
    jobs = [_job_to_response(j) for j in _jobs.values()]
    active = sum(1 for j in _jobs.values() if j.status in (JobStatus.QUEUED, JobStatus.TRAINING))
    return TrainSummaryResponse(jobs=jobs, active_count=active)


def _job_to_response(job: TrainingJob) -> TrainStatusResponse:
    return TrainStatusResponse(
        job_id=job.job_id,
        adapter_type=job.adapter_type,
        status=job.status.value,
        progress=job.progress,
        error=job.error,
    )


def _run_training(job: TrainingJob) -> None:
    try:
        job.status = JobStatus.PREPARING
        job.progress = 5.0

        data = _load_training_data(job.data_path)
        if not data:
            job.status = JobStatus.FAILED
            job.error = "No valid training data found"
            return

        if job._cancel_flag:
            return

        job.status = JobStatus.TRAINING
        job.progress = 10.0

        rank = job.config.get("rank", 8)
        epochs = job.config.get("epochs", 3)
        lr = job.config.get("learning_rate", 1e-4)
        batch_size = job.config.get("batch_size", 4)

        adapter_dir = Path(settings.data_dir) / "adapters" / job.adapter_type
        adapter_dir.mkdir(parents=True, exist_ok=True)

        _train_lora(
            job=job,
            data=data,
            output_dir=adapter_dir,
            rank=rank,
            epochs=epochs,
            lr=lr,
            batch_size=batch_size,
        )

        if not job._cancel_flag:
            job.status = JobStatus.COMPLETE
            job.progress = 100.0
            logger.info("Training complete: %s -> %s", job.job_id, adapter_dir)

    except Exception as e:
        logger.error("Training failed: %s", e)
        job.status = JobStatus.FAILED
        job.error = str(e)


def _load_training_data(path: str) -> list[dict]:
    data = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                if "prompt" in entry and "code" in entry:
                    data.append(entry)
            except json.JSONDecodeError:
                continue
    return data


def _train_lora(
    job: TrainingJob,
    data: list[dict],
    output_dir: Path,
    rank: int,
    epochs: int,
    lr: float,
    batch_size: int,
) -> None:
    try:
        from peft import LoraConfig, TaskType, get_peft_model
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ImportError:
        logger.warning("PEFT/transformers not available, saving data only")
        _save_training_data(data, output_dir)
        return

    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    logger.info("Loading base model: %s", model_name)

    try:
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            cache_dir=settings.cache_dir,
        )
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token

        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            cache_dir=settings.cache_dir,
            low_cpu_mem_usage=True,
        )
    except Exception as e:
        logger.warning("Model load failed: %s, saving data only", e)
        _save_training_data(data, output_dir)
        return

    if job._cancel_flag:
        return

    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=rank,
        lora_alpha=rank * 2,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj"],
    )
    model = get_peft_model(model, lora_config)

    job.progress = 20.0

    total_steps = epochs * (len(data) // batch_size + 1)
    step = 0

    for epoch in range(epochs):
        if job._cancel_flag:
            return

        for i in range(0, len(data), batch_size):
            if job._cancel_flag:
                return

            batch = data[i : i + batch_size]
            texts = [f"### Prompt: {d['prompt']}\n### Code:\n{d['code']}" for d in batch]

            inputs = tokenizer(
                texts,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512,
            )
            inputs["labels"] = inputs["input_ids"].clone()

            outputs = model(**inputs)
            loss = outputs.loss
            loss.backward()

            step += 1
            job.progress = 20.0 + (step / max(1, total_steps)) * 75.0

        logger.info("Epoch %d/%d complete, loss=%.4f", epoch + 1, epochs, loss.item())

    model.save_pretrained(str(output_dir))
    tokenizer.save_pretrained(str(output_dir))
    logger.info("Adapter saved to %s", output_dir)


def _save_training_data(data: list[dict], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    data_file = output_dir / "training_data.jsonl"
    with open(data_file, "w") as f:
        for entry in data:
            f.write(json.dumps(entry) + "\n")
    logger.info("Training data saved to %s (%d examples)", data_file, len(data))
