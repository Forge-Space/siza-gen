<div align="center">
  <a href="https://forgespace.co">
    <img src="https://brand.forgespace.co/logos/wordmark.svg" alt="Forge Space" height="48">
  </a>
  <h1>@forgespace/siza-gen</h1>
  <p>Siza AI generation engine — multi-framework code generation, component registry, and ML-powered quality scoring.</p>
</div>

[![npm version](https://img.shields.io/npm/v/@forgespace/siza-gen)](https://www.npmjs.com/package/@forgespace/siza-gen)
[![CI](https://github.com/Forge-Space/siza-gen/actions/workflows/ci.yml/badge.svg)](https://github.com/Forge-Space/siza-gen/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-green)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

## Overview

`@forgespace/siza-gen` is the AI brain extracted from
[ui-mcp](https://github.com/Forge-Space/ui-mcp). It provides:

- **Framework generators** — React, Vue, Angular, Svelte, HTML
- **Component registry** — 540+ curated snippets (component, animation, backend,
  dashboard, settings) with AI chat and data display molecules
- **ML quality scoring** — Hybrid semantic+keyword search, embeddings, quality
  validation, anti-generic rules
- **Feedback system** — Self-learning, pattern promotion, feedback-boosted
  search
- **Template compositions** — Pre-built page templates with quality gating
- **Brand integration** — Transform branding-mcp tokens into design context
- **LLM providers** — Ollama, OpenAI, Anthropic, Gemini with auto-fallback

## Installation

```bash
npm install @forgespace/siza-gen
```

## Lightweight Entry (`/lite`)

A zero-native-dependency entry point for edge runtimes (Cloudflare Workers,
Deno, Bun). Provides context assembly without the registry/database/ML stack.

```typescript
import { assembleContext } from '@forgespace/siza-gen/lite';

const ctx = assembleContext({
  framework: 'react',
  componentLibrary: 'shadcn',
  tokenBudget: 4000,
});
// ctx.systemPrompt — ready to use as LLM system prompt
```

**43 KB** vs 1.87 MB full bundle. Includes `brandToDesignContext`,
`designContextStore`, and all core types.

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

| Module        | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| `generators/` | React, Vue, Angular, Svelte, HTML code generators                  |
| `registry/`   | 540+ snippets — component, animation, backend, dashboard, settings |
| `ml/`         | Embeddings (all-MiniLM-L6-v2), quality scoring, training pipeline  |
| `feedback/`   | Self-learning loop, pattern promotion, feedback-boosted search     |
| `quality/`    | Anti-generic rules, diversity tracking                             |
| `artifacts/`  | Generated artifact storage and learning loop                       |

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

An optional Python FastAPI sidecar handles compute-intensive ML operations. When
unavailable, the system gracefully degrades to Transformers.js and heuristics.

```bash
cd python && pip install -e ".[dev]"
python -m uvicorn siza_ml.app:app --port 8100
```

Or via npm:

```bash
npm run sidecar:start     # Launch Python sidecar
npm run sidecar:test      # Run Python tests (41 tests)
```

| Endpoint              | Description                     |
| --------------------- | ------------------------------- |
| `POST /embed`         | Sentence-transformer embeddings |
| `POST /embed/batch`   | Batch embeddings                |
| `POST /vector/search` | FAISS k-NN similarity search    |
| `POST /score`         | LLM-based quality scoring       |
| `POST /enhance`       | LLM-based prompt enhancement    |
| `POST /train/start`   | LoRA fine-tuning via PEFT       |
| `GET /health`         | Liveness check                  |
| `GET /metrics/report` | ML observability metrics        |

**Fallback chain**: Python sidecar → Transformers.js/local LLM → heuristics.

## Development

```bash
npm install && npm run build
npm test                  # 573 tests, 26 suites
npm run validate          # lint + format + typecheck + test
npm run format            # apply repo-wide Prettier formatting
npm run registry:stats    # Report snippet counts
```

## Distribution

- **npm** — published as
  [`@forgespace/siza-gen`](https://www.npmjs.com/package/@forgespace/siza-gen)
- **GitHub** — source, issues, and releases live at
  [Forge-Space/siza-gen](https://github.com/Forge-Space/siza-gen)
- **Docs and ecosystem context** — start from
  [docs.forgespace.co/docs](https://docs.forgespace.co/docs)

### SonarCloud duplication configuration

`sonar-project.properties` includes targeted CPD exclusions for
`src/registry/component-registry/molecules/ai-patterns.ts` and
`src/registry/component-registry/molecules/data-display.ts`. These files contain
intentional registry template repetition and are excluded from duplication
quality-gate calculations only.

## AI Benchmarks

Run the benchmark suite to compare LLM providers on generation quality, scoring
accuracy, prompt enhancement effectiveness, and cost:

```bash
npm run bench:dry    # Preview plan without API calls
npm run bench        # Run full benchmark (requires API keys or Ollama)
```

Set provider API keys as environment variables:

```bash
export ANTHROPIC_API_KEY=sk-...
export OPENAI_API_KEY=sk-...
export GEMINI_API_KEY=...
```

Results are saved to `benchmarks/report-{date}.json` with a console summary.

## Community

- [GitHub Discussions](https://github.com/orgs/Forge-Space/discussions)
- [Issue tracker](https://github.com/Forge-Space/siza-gen/issues)

## GitHub Workflow

This repository follows the shared Forge Space GitHub work-management baseline:

- Discussions for ideas, RFCs, Q&A, and announcements
- Issues for actionable delivery work
- Projects for roadmap visibility and cross-repo reporting

See [Forge-Space/.github `GOVERNANCE.md`](https://github.com/Forge-Space/.github/blob/main/GOVERNANCE.md)
for the org-wide contract.

## License

MIT
