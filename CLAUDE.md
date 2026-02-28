# Siza Gen (@forgespace/siza-gen)

## Project

- AI generation engine for multi-framework code generation
- Published to npm as `@forgespace/siza-gen`
- GitHub: Forge-Space/siza-gen, default branch: `main`
- Consumed by siza-mcp (MCP wrapper) and siza desktop

## Architecture

```
src/
├── index.ts              (public API barrel)
├── ml/                   (embeddings, quality scoring, training pipeline)
├── generators/           (react, vue, angular, svelte, html)
├── registry/             (502 component + backend + animation snippets)
│   ├── component-registry/  (atoms, molecules, organisms)
│   ├── backend-registry/    (API routes, middleware, architecture)
│   └── micro-interactions/  (85 animation snippets)
├── feedback/             (self-learning, pattern promotion)
├── quality/              (anti-generic rules, diversity tracking)
├── artifacts/            (generated artifact storage, learning loop)
├── utils/                (JSX, string utilities)
├── types.ts              (shared interfaces)
├── config.ts             (configuration)
└── logger.ts             (pino, stderr output)
```

## Stack

- TypeScript, Node 22, Jest ESM, tsup, pino
- `NODE_OPTIONS=--experimental-vm-modules` required for Jest

## Build/Test

```bash
npm run build             # tsup bundled build
npm test                  # Jest ESM (343 tests, 17 suites)
npm run typecheck         # tsc --noEmit
npm run validate          # lint + format + typecheck + test
npm run validate:snippets # Batch validate all registry snippets
npm run registry:stats    # Report snippet counts by category
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
