from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter
from pydantic import BaseModel

from .config import settings

router = APIRouter(tags=["prompt"])
logger = logging.getLogger("siza_ml.prompt_enhancer")

ENHANCE_PROMPT = """Improve this UI generation prompt. Keep the intent but add specificity about layout, styling, and accessibility.
Respond with ONLY the improved prompt text, nothing else.

Original: {prompt}
{context_lines}"""


class EnhanceRequest(BaseModel):
    prompt: str
    component_type: str | None = None
    framework: str | None = None
    style: str | None = None
    mood: str | None = None
    industry: str | None = None


class EnhanceResponse(BaseModel):
    enhanced: str
    additions: list[str]
    source: str


@router.post("/enhance", response_model=EnhanceResponse)
async def enhance_prompt(req: EnhanceRequest) -> EnhanceResponse:
    try:
        return await _enhance_with_ollama(req)
    except Exception as e:
        logger.debug("Ollama enhancement failed: %s, using rules", e)
        return _enhance_with_rules(req)


async def _enhance_with_ollama(req: EnhanceRequest) -> EnhanceResponse:
    context_parts = []
    if req.component_type:
        context_parts.append(f"Component: {req.component_type}")
    if req.framework:
        context_parts.append(f"Framework: {req.framework}")
    if req.style:
        context_parts.append(f"Style: {req.style}")
    if req.mood:
        context_parts.append(f"Mood: {req.mood}")
    if req.industry:
        context_parts.append(f"Industry: {req.industry}")

    prompt = ENHANCE_PROMPT.format(
        prompt=req.prompt,
        context_lines="\n".join(context_parts),
    )

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            f"{settings.ollama_url}/api/generate",
            json={
                "model": "qwen2.5-coder:1.5b",
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.5, "num_predict": 256},
            },
        )
        resp.raise_for_status()
        data = resp.json()

    enhanced = data.get("response", "").strip()
    if len(enhanced) < len(req.prompt) * 0.5:
        raise ValueError("Enhanced prompt too short")

    return EnhanceResponse(
        enhanced=enhanced,
        additions=["llm-enhanced"],
        source="ollama",
    )


def _enhance_with_rules(req: EnhanceRequest) -> EnhanceResponse:
    enhanced = req.prompt.strip()
    additions: list[str] = []
    lower = enhanced.lower()

    if req.framework and req.framework.lower() not in lower:
        enhanced += f" using {req.framework}"
        additions.append("framework")

    a11y_keywords = ["accessible", "a11y", "aria", "screen reader", "wcag"]
    if not any(k in lower for k in a11y_keywords):
        enhanced += ". Include ARIA labels and keyboard navigation support"
        additions.append("accessibility")

    responsive_keywords = ["responsive", "mobile", "breakpoint"]
    if not any(k in lower for k in responsive_keywords):
        enhanced += ". Make it responsive across mobile, tablet, and desktop"
        additions.append("responsive")

    vague_map = {
        "nice": "polished and visually refined",
        "cool": "modern with subtle animations",
        "simple": "clean and minimal with clear visual hierarchy",
        "basic": "straightforward with essential elements",
    }
    for vague, specific in vague_map.items():
        if vague in lower:
            enhanced = enhanced.replace(vague, specific)
            additions.append(f"expanded:{vague}")

    return EnhanceResponse(
        enhanced=enhanced,
        additions=additions,
        source="rules",
    )
