# @forgespace/siza-gen

The AI generation engine behind [Siza](https://forgespace.co) — multi-framework
code generation with a 502-snippet component registry and ML-powered quality
scoring.

[![npm version](https://img.shields.io/npm/v/@forgespace/siza-gen.svg)](https://www.npmjs.com/package/@forgespace/siza-gen)
[![npm downloads](https://img.shields.io/npm/dm/@forgespace/siza-gen.svg)](https://www.npmjs.com/package/@forgespace/siza-gen)
[![CI](https://img.shields.io/github/actions/workflow/status/Forge-Space/siza-gen/ci.yml?label=CI)](https://github.com/Forge-Space/siza-gen/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

Part of the [Forge Space](https://github.com/Forge-Space) ecosystem.

## Why siza-gen

Most AI code generators produce generic, repetitive output. siza-gen solves this
with:

- **502 curated snippets** — real-world component patterns (not templates),
  ranked by quality
- **Anti-generic rules** — actively prevents the "looks like AI generated it"
  problem
- **ML quality scoring** — embeddings + heuristics score every generated
  component
- **Self-learning feedback** — usage patterns promote better snippets over time
- **Multi-framework output** — same prompt generates React, Vue, Angular,
  Svelte, or HTML

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

// Initialize the 502-snippet registry
await initializeRegistry();

// Search for component patterns
const results = searchComponents('hero section with CTA');

// Generate framework-specific code
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

## Development

```bash
npm install && npm run build
npm test                  # 412 tests, 20 suites
npm run validate          # lint + format + typecheck + test
npm run registry:stats    # Report snippet counts
```

## License

MIT
