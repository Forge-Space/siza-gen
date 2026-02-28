from __future__ import annotations

import json
import logging
import time
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

from .config import settings

router = APIRouter(prefix="/metrics", tags=["metrics"])
logger = logging.getLogger("siza_ml.metrics")

METRICS_FILE = Path(settings.data_dir) / "metrics.jsonl"


class MetricRecord(BaseModel):
    event: str
    value: float
    unit: str = "ms"
    metadata: dict[str, str] | None = None


class MetricRecordResponse(BaseModel):
    recorded: bool


class MetricSummary(BaseModel):
    event: str
    count: int
    avg: float
    min: float
    max: float
    p95: float


class MetricsReportResponse(BaseModel):
    summaries: list[MetricSummary]
    total_records: int


@router.post("/record", response_model=MetricRecordResponse)
async def record_metric(req: MetricRecord) -> MetricRecordResponse:
    METRICS_FILE.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "event": req.event,
        "value": req.value,
        "unit": req.unit,
        "metadata": req.metadata or {},
        "timestamp": time.time(),
    }
    with open(METRICS_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return MetricRecordResponse(recorded=True)


@router.get("/report", response_model=MetricsReportResponse)
async def metrics_report() -> MetricsReportResponse:
    if not METRICS_FILE.exists():
        return MetricsReportResponse(summaries=[], total_records=0)

    events: dict[str, list[float]] = {}
    total = 0

    with open(METRICS_FILE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                event = entry["event"]
                value = float(entry["value"])
                events.setdefault(event, []).append(value)
                total += 1
            except (json.JSONDecodeError, KeyError, ValueError):
                continue

    summaries = []
    for event, values in sorted(events.items()):
        values.sort()
        n = len(values)
        p95_idx = min(n - 1, int(n * 0.95))
        summaries.append(
            MetricSummary(
                event=event,
                count=n,
                avg=round(sum(values) / n, 2),
                min=round(values[0], 2),
                max=round(values[-1], 2),
                p95=round(values[p95_idx], 2),
            )
        )

    return MetricsReportResponse(summaries=summaries, total_records=total)
