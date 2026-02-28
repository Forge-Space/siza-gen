from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter
from pydantic import BaseModel

from .config import settings

router = APIRouter(tags=["quality"])
logger = logging.getLogger("siza_ml.quality_scorer")

SCORING_PROMPT = """Rate this generated UI code on a scale of 0-10.
Evaluate these factors: security, accessibility, semantic HTML,
responsiveness, code structure, and prompt alignment.

Respond with ONLY a JSON object:
{{"score": N, "confidence": 0.8, "factors": {{"security": N, "accessibility": N, "semantics": N, "responsive": N, "structure": N}}}}

User prompt: {prompt}
Component: {component_type}
Framework: {framework}

```
{code}
```"""


class ScoreRequest(BaseModel):
    prompt: str
    code: str
    component_type: str | None = None
    framework: str | None = None


class ScoreResponse(BaseModel):
    score: float
    confidence: float
    factors: dict[str, float]
    source: str


@router.post("/score", response_model=ScoreResponse)
async def score_quality(req: ScoreRequest) -> ScoreResponse:
    try:
        return await _score_with_ollama(req)
    except Exception as e:
        logger.debug("Ollama scoring failed: %s, using heuristics", e)
        return _score_with_heuristics(req)


async def _score_with_ollama(req: ScoreRequest) -> ScoreResponse:
    prompt = SCORING_PROMPT.format(
        prompt=req.prompt[:200],
        component_type=req.component_type or "unknown",
        framework=req.framework or "unknown",
        code=req.code[:2000],
    )

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            f"{settings.ollama_url}/api/generate",
            json={
                "model": "qwen2.5-coder:1.5b",
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.1, "num_predict": 128},
            },
        )
        resp.raise_for_status()
        data = resp.json()

    import json
    import re

    text = data.get("response", "")
    match = re.search(r"\{[^}]*\"score\"[^}]*\}", text)
    if match:
        parsed = json.loads(match.group())
        score = max(0, min(10, float(parsed.get("score", 5))))
        factors = parsed.get("factors", {})
        return ScoreResponse(
            score=round(score, 1),
            confidence=0.8,
            factors={k: float(v) for k, v in factors.items()},
            source="ollama",
        )
    raise ValueError("Could not parse LLM score response")


def _score_with_heuristics(req: ScoreRequest) -> ScoreResponse:
    code = req.code
    factors: dict[str, float] = {}

    length = len(code)
    if length < 50:
        factors["length"] = 0.0
    elif length < 200:
        factors["length"] = 5.0
    elif length < 5000:
        factors["length"] = 10.0
    else:
        factors["length"] = 7.0

    a11y_markers = ["aria-", "role=", "alt=", "tabIndex", "sr-only", "<label", "htmlFor"]
    a11y_count = sum(1 for m in a11y_markers if m in code)
    factors["accessibility"] = round(a11y_count / len(a11y_markers) * 10, 1)

    semantic_tags = ["<header", "<main", "<nav", "<section", "<article", "<footer"]
    sem_count = sum(1 for t in semantic_tags if t in code)
    factors["semantics"] = round(min(1.0, sem_count / 3) * 10, 1)

    responsive_markers = ["sm:", "md:", "lg:", "xl:", "@media"]
    resp_count = sum(1 for m in responsive_markers if m in code)
    factors["responsive"] = round(resp_count / len(responsive_markers) * 10, 1)

    structure_markers = ["export ", "function ", "return (", "import "]
    struct_count = sum(1 for m in structure_markers if m in code)
    factors["structure"] = round(struct_count / len(structure_markers) * 10, 1)

    total = sum(factors.values())
    score = round(total / max(1, len(factors)), 1)

    return ScoreResponse(
        score=score,
        confidence=0.5,
        factors=factors,
        source="heuristic",
    )
