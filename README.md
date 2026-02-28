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

## Development

```bash
npm install
npm run build
npm test
npm run lint
```

## License

MIT
