# Siza Gen (@forgespace/siza-gen)

## Project

- AI generation engine for multi-framework code generation
- Published to npm as `@forgespace/siza-gen`
- GitHub: Forge-Space/siza-gen, default branch: `main`
- Consumed by siza-mcp (MCP wrapper) and siza desktop

## Architecture

```
src/                          (TypeScript — orchestration layer)
├── index.ts              (public API barrel)
├── ml/                   (embeddings, quality scoring, training pipeline)
│   ├── sidecar-client.ts (HTTP client for Python sidecar)
│   ├── embeddings.ts     (Transformers.js fallback + sidecar delegation)
│   ├── quality-scorer.ts (heuristic + sidecar + LLM scoring chain)
│   ├── prompt-enhancer.ts(rules + sidecar + LLM enhancement chain)
│   └── training-pipeline.ts (orchestration → sidecar /train)
├── generators/           (react, vue, angular, svelte, html)
├── registry/             (502 component + backend + animation snippets)
├── feedback/             (self-learning, pattern promotion)
├── quality/              (anti-generic rules, diversity tracking)
├── artifacts/            (generated artifact storage, learning loop)
├── utils/                (JSX, string utilities)
├── types.ts              (shared interfaces)
├── config.ts             (configuration)
└── logger.ts             (pino, stderr output)

python/                       (Python ML sidecar — optional)
├── siza_ml/
│   ├── app.py            (FastAPI application)
│   ├── embeddings.py     (sentence-transformers)
│   ├── vector_store.py   (FAISS index)
│   ├── quality_scorer.py (LLM-based scoring via Ollama)
│   ├── prompt_enhancer.py(LLM-based enhancement)
│   ├── training.py       (LoRA fine-tuning via PEFT)
│   ├── data_ingestion.py (HuggingFace + axe-core ingestion)
│   └── metrics.py        (ML observability)
├── tests/                (41 pytest tests)
└── Dockerfile
```

## Stack

- TypeScript, Node 22, Jest ESM, tsup, pino
- Python 3.12+, FastAPI, sentence-transformers, FAISS, PEFT
- `NODE_OPTIONS=--experimental-vm-modules` required for Jest

## Build/Test

```bash
npm run build             # tsup bundled build
npm test                  # Jest ESM (424 tests, 21 suites)
npm run typecheck         # tsc --noEmit
npm run validate          # lint + format + typecheck + test
npm run sidecar:test      # Python tests (41 tests)
npm run sidecar:start     # Launch Python ML sidecar on :8100
```

## Conventions

- Functions <50 lines, complexity <10, line width <100
- Conventional commits: feat, fix, refactor, chore, docs
- All exports go through src/index.ts barrel
- Logger uses `pino.destination(2)` (stderr) to avoid MCP stdio corruption

## Gotchas

- `npm run build` required before `npm test` — quality tests load from built JS
- `.uiforge/rag.sqlite` caches registry data — delete when changing snippets
- `fail()` unavailable in Jest ESM — use `throw new Error()`
- Subagents use invalid enum values for MoodTag/IndustryTag — run `tsc --noEmit`
  after
- Pino must output to stderr (fd 2), never stdout
