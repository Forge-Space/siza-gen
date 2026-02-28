from __future__ import annotations

import json
import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .embeddings import _get_model, encode_vector_b64

router = APIRouter(prefix="/ingest", tags=["ingestion"])
logger = logging.getLogger("siza_ml.data_ingestion")

AXE_CORE_RULES_URL = "https://raw.githubusercontent.com/dequelabs/axe-core/develop/lib/rules.json"


class IngestEntry(BaseModel):
    id: str
    text: str
    vector: str
    entry_type: str
    metadata: dict[str, str] | None = None


class IngestResponse(BaseModel):
    entries: list[IngestEntry]
    count: int


class AxeCoreRequest(BaseModel):
    rules_path: str | None = None


class HuggingFaceRequest(BaseModel):
    dataset_name: str = "bigcode/starcoderdata"
    split: str = "train"
    max_examples: int = 200
    min_tokens: int = 50
    filter_language: str = "javascript"


@router.post("/axe-core", response_model=IngestResponse)
async def ingest_axe_core(req: AxeCoreRequest) -> IngestResponse:
    rules = _load_axe_rules(req.rules_path)
    if not rules:
        raise HTTPException(status_code=400, detail="No axe-core rules found")

    model = _get_model()
    entries = []

    texts = []
    rule_data = []
    for rule in rules:
        rule_id = rule.get("id", "")
        description = rule.get("description", "")
        help_text = rule.get("help", "")
        tags = rule.get("tags", [])
        impact = rule.get("metadata", {}).get("impact", "moderate")

        text = (
            f"a11y rule {rule_id}: {description}. "
            f"{help_text}. "
            f"Impact: {impact}. Tags: {', '.join(tags)}"
        )
        texts.append(text)
        rule_data.append(
            {
                "id": rule_id,
                "text": text,
                "tags": tags,
                "impact": impact,
            }
        )

    if not texts:
        return IngestResponse(entries=[], count=0)

    vecs = model.encode(texts, normalize_embeddings=True, batch_size=32)

    for rd, vec in zip(rule_data, vecs, strict=True):
        entries.append(
            IngestEntry(
                id=f"axe-{rd['id']}",
                text=rd["text"],
                vector=encode_vector_b64(vec),
                entry_type="rule",
                metadata={
                    "impact": rd["impact"],
                    "tags": ",".join(rd["tags"]),
                },
            )
        )

    logger.info("Ingested %d axe-core rules", len(entries))
    return IngestResponse(entries=entries, count=len(entries))


@router.post("/huggingface", response_model=IngestResponse)
async def ingest_huggingface(req: HuggingFaceRequest) -> IngestResponse:
    try:
        from datasets import load_dataset
    except ImportError as exc:
        raise HTTPException(
            status_code=500,
            detail="datasets library not available",
        ) from exc

    try:
        ds = load_dataset(
            req.dataset_name,
            data_dir=req.filter_language,
            split=req.split,
            streaming=True,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load dataset: {e}") from e

    model = _get_model()
    entries = []
    texts = []
    ids = []

    for i, example in enumerate(ds):
        if len(entries) + len(texts) >= req.max_examples:
            break

        content = example.get("content", "")
        if len(content.split()) < req.min_tokens:
            continue

        snippet = content[:2000]
        if not _looks_like_ui_code(snippet):
            continue

        texts.append(snippet)
        ids.append(f"hf-{req.dataset_name.replace('/', '-')}-{i}")

        if len(texts) >= 32:
            vecs = model.encode(texts, normalize_embeddings=True)
            for entry_id, text, vec in zip(ids, texts, vecs, strict=True):
                entries.append(
                    IngestEntry(
                        id=entry_id,
                        text=text,
                        vector=encode_vector_b64(vec),
                        entry_type="example",
                    )
                )
            texts = []
            ids = []

    if texts:
        vecs = model.encode(texts, normalize_embeddings=True)
        for entry_id, text, vec in zip(ids, texts, vecs, strict=True):
            entries.append(
                IngestEntry(
                    id=entry_id,
                    text=text,
                    vector=encode_vector_b64(vec),
                    entry_type="example",
                )
            )

    logger.info("Ingested %d examples from %s", len(entries), req.dataset_name)
    return IngestResponse(entries=entries, count=len(entries))


def _load_axe_rules(rules_path: str | None) -> list[dict]:
    if rules_path:
        p = Path(rules_path)
        if p.exists():
            return json.loads(p.read_text())

    try:
        import httpx

        resp = httpx.get(AXE_CORE_RULES_URL, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.warning("Failed to fetch axe-core rules: %s", e)
        return _bundled_axe_rules()


def _bundled_axe_rules() -> list[dict]:
    return [
        {
            "id": "image-alt",
            "description": "Images must have alternate text",
            "help": "Ensure img elements have alt text",
            "tags": ["wcag2a", "cat.text-alternatives"],
            "metadata": {"impact": "critical"},
        },
        {
            "id": "button-name",
            "description": "Buttons must have discernible text",
            "help": "Ensure buttons have an accessible name",
            "tags": ["wcag2a", "cat.name-role-value"],
            "metadata": {"impact": "critical"},
        },
        {
            "id": "label",
            "description": "Form elements must have labels",
            "help": "Ensure form inputs have associated labels",
            "tags": ["wcag2a", "cat.forms"],
            "metadata": {"impact": "critical"},
        },
        {
            "id": "color-contrast",
            "description": "Elements must have sufficient color contrast",
            "help": "Ensure contrast ratio of at least 4.5:1",
            "tags": ["wcag2aa", "cat.color"],
            "metadata": {"impact": "serious"},
        },
        {
            "id": "heading-order",
            "description": "Heading levels should increase by one",
            "help": "Ensure headings are in sequential order",
            "tags": ["best-practice", "cat.semantics"],
            "metadata": {"impact": "moderate"},
        },
        {
            "id": "link-name",
            "description": "Links must have discernible text",
            "help": "Ensure links have an accessible name",
            "tags": ["wcag2a", "cat.name-role-value"],
            "metadata": {"impact": "serious"},
        },
        {
            "id": "tabindex",
            "description": "tabindex values should not be greater than 0",
            "help": "Elements should not have positive tabindex",
            "tags": ["best-practice", "cat.keyboard"],
            "metadata": {"impact": "serious"},
        },
        {
            "id": "html-has-lang",
            "description": "html element must have a lang attribute",
            "help": "Ensure html has a valid lang attribute",
            "tags": ["wcag2a", "cat.language"],
            "metadata": {"impact": "serious"},
        },
        {
            "id": "landmark-one-main",
            "description": "Document should have one main landmark",
            "help": "Ensure page has a main landmark",
            "tags": ["best-practice", "cat.semantics"],
            "metadata": {"impact": "moderate"},
        },
        {
            "id": "aria-roles",
            "description": "ARIA roles must conform to valid values",
            "help": "Ensure role attribute has a valid value",
            "tags": ["wcag2a", "cat.aria"],
            "metadata": {"impact": "critical"},
        },
    ]


def _looks_like_ui_code(code: str) -> bool:
    ui_indicators = [
        "className",
        "onClick",
        "onChange",
        "render",
        "<div",
        "<button",
        "<input",
        "<form",
        "useState",
        "useEffect",
        "component",
        "export default",
        "return (",
    ]
    return sum(1 for ind in ui_indicators if ind in code) >= 2
