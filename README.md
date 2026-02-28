# @forgespace/siza-gen

Siza AI generation engine — multi-framework code generation, component registry,
and ML-powered quality scoring.

## Overview

`@forgespace/siza-gen` is the AI brain extracted from
[siza-mcp](https://github.com/Forge-Space/ui-mcp). It provides:

- **Framework generators** — React, Vue, Angular, Svelte, HTML
- **Component registry** — 502 curated snippets (357 component + 85 animation +
  60 backend)
- **ML quality scoring** — Embeddings, quality validation, anti-generic rules
- **Feedback system** — Self-learning, pattern promotion, feedback-boosted
  search
- **Template compositions** — Pre-built page templates with quality gating
- **Brand integration** — Transform branding-mcp tokens into design context
- **LLM providers** — Ollama, OpenAI, Anthropic, Gemini with auto-fallback

## Installation

```bash
npm install @forgespace/siza-gen
```

## Usage

```typescript
import {
  searchComponents,
  initializeRegistry,
  GeneratorFactory,
} from '@forgespace/siza-gen';

await initializeRegistry();
const results = searchComponents('hero section');
const generator = GeneratorFactory.create('react');
```

## What's inside

| Module        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `generators/` | React, Vue, Angular, Svelte, HTML code generators                 |
| `registry/`   | 502 snippets — 357 component + 85 animation + 60 backend          |
| `ml/`         | Embeddings (all-MiniLM-L6-v2), quality scoring, training pipeline |
| `feedback/`   | Self-learning loop, pattern promotion, feedback-boosted search    |
| `quality/`    | Anti-generic rules, diversity tracking                            |
| `artifacts/`  | Generated artifact storage and learning loop                      |

## LLM Providers

Built-in multi-provider support with auto-fallback:

```typescript
import { createProviderWithFallback } from '@forgespace/siza-gen';

// Tries Ollama first (local), falls back to OpenAI/Anthropic/Gemini
const provider = await createProviderWithFallback();
```

Supports: **Ollama** (local), **OpenAI**, **Anthropic**, **Gemini** (via OpenAI
adapter).

## Brand Integration

Transform [branding-mcp](https://github.com/Forge-Space/branding-mcp) tokens
into design context:

```typescript
import { brandToDesignContext } from '@forgespace/siza-gen';

const designContext = brandToDesignContext(brandIdentity);
```

## Python ML Sidecar

An optional Python FastAPI sidecar handles compute-intensive ML operations.
When unavailable, the system gracefully degrades to Transformers.js and
heuristics.

```bash
cd python && pip install -e ".[dev]"
python -m uvicorn siza_ml.app:app --port 8100
```

Or via npm:

```bash
npm run sidecar:start     # Launch Python sidecar
npm run sidecar:test      # Run Python tests (41 tests)
```

| Endpoint             | Description                            |
| -------------------- | -------------------------------------- |
| `POST /embed`        | Sentence-transformer embeddings        |
| `POST /embed/batch`  | Batch embeddings                       |
| `POST /vector/search`| FAISS k-NN similarity search           |
| `POST /score`        | LLM-based quality scoring              |
| `POST /enhance`      | LLM-based prompt enhancement           |
| `POST /train/start`  | LoRA fine-tuning via PEFT              |
| `GET /health`        | Liveness check                         |
| `GET /metrics/report`| ML observability metrics               |

**Fallback chain**: Python sidecar → Transformers.js/local LLM → heuristics.

## Development

```bash
npm install && npm run build
npm test                  # 424 tests, 21 suites
npm run validate          # lint + format + typecheck + test
npm run registry:stats    # Report snippet counts
```

## License

MIT
