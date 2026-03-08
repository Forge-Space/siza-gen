# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2026-03-08

### Added

- **AI benchmark suite** — Golden prompt dataset (20 prompts × 5 complexity
  tiers), benchmark harness for all 4 LLM providers, trait evaluator, cost
  calculator, console + JSON reporter, and `npm run bench` / `bench:dry` scripts
- **Benchmark evaluator** — Trait matching (ARIA, responsive, dark mode,
  semantic HTML, error handling, keyboard nav), per-provider cost calculation,
  Pearson correlation for scoring accuracy, enhancement effectiveness analysis
- **10 LangUI-inspired AI component patterns** — ai-token-usage, ai-prompt-input,
  ai-error-retry, ai-model-comparison, ai-conversation-sidebar, ai-response-rating,
  ai-loading-skeleton, ai-prompt-templates, ai-settings-panel, ai-token-counter
  (528 total snippets)
- 34 benchmark tests (503 total across 25 suites)

## [0.9.0] - 2026-03-08

### Added

- **Hybrid semantic+keyword search** — `semanticSearch()` now accepts optional
  `queryText` and `alpha` parameters for BM25-like keyword fusion. Final score =
  `alpha * vectorSim + (1-alpha) * keywordScore`. Reduces false positives on
  short queries
- **`keywordScore()` and `tokenizeQuery()`** — Exported utilities for BM25-like
  keyword overlap scoring in the embedding store
- **16 component snippets** — 8 AI chat molecules (streaming message, code
  block, message actions, context pill, model selector, welcome screen, markdown
  message, conversation branch) + 8 data display molecules (metric card,
  comparison table, activity feed, progress tracker, key-value list, badge grid,
  changelog entry, tree view)
- **AI security review CI** — `anthropics/claude-code-security-review` GitHub
  Action via org reusable workflow (Sonnet 4.6, non-blocking)
- 8 unit tests for hybrid search, keywordScore, and tokenizeQuery

### Changed

- All 4 `semanticSearch()` callers (prompt-enhancer, quality-scorer,
  style-recommender, embedding-store) updated to pass `queryText` for hybrid
  scoring
- Candidate pool widened to `topK * 2` with relaxed threshold before hybrid
  re-ranking

---

## [0.8.1] - 2026-03-07

### Fixed

- **lite entry type declarations** — `dist/lite.d.ts` was missing from npm
  package due to tsup parallel build race condition. The first entry's
  `clean: true` deleted lite's DTS output mid-build. Fix: pre-build clean via
  `rm -rf dist` with `clean: false` on all entries

---

## [0.8.0] - 2026-03-06

### Added

- **Lightweight entry point** (`@forgespace/siza-gen/lite`): Cloudflare
  Workers-compatible export with zero native dependencies (43 KB vs 1.87 MB full
  bundle)
- `assembleContext()` in lite entry — 5 composable sections (role,
  quality-rules, framework, library, a11y) without registry/database
  dependencies
- Re-exports: `brandToDesignContext`, `designContextStore`, `DEFAULT_CONTEXT`,
  and key types
- Dual tsup build: `src/index.ts` (node22) + `src/lite.ts` (es2022, platform
  neutral)
- 11 unit tests for lite entry point

## [0.7.1] - 2026-03-06

### Changed

- **brand-identity-transform**: WCAG relative luminance (sRGB linearization) for
  foreground contrast instead of BT.601
- **brand-identity-transform**: Hex normalization — 3-char (#f00) and 8-char
  (#rrggbbaa) supported; invalid hex throws clear error
- **brand-identity-transform**: branding-mcp radii mapping — `xl`->lg,
  `circle`->9999px, `none`->0

### Added

- **brand-identity-transform**: Validation for missing `colors.primary.hex` with
  structured error
- 6 new unit tests: empty neutral fallback, 3-char/8-char hex, invalid hex,
  missing primary, radii key mapping

## [0.7.0] — 2026-03-01

### Added

- **Context Assembler**: New `assembleContext()` function that builds rich,
  budget-aware system prompts (~4K tokens) from curated registry data
- 6 composable section builders: role/persona, anti-generic quality rules,
  framework conventions, component library patterns, WCAG AA accessibility
  checklist, and few-shot examples from the 502-snippet registry
- Token budget management — fixed sections get priority, examples fill remaining
  budget with automatic truncation
- 17 new unit tests for context assembly with budget, search, and truncation
  scenarios

## [0.6.0] — 2026-03-01

### Changed

- **ESLint 9 → 10**: New recommended rules (`preserve-caught-error`,
  `no-useless-assignment`), config lookup from file directory
- **Jest 29 → 30**: 40% faster test execution (5s → 2.8s), stricter type
  inference, glob v10
- **Husky 8 → 9**: Simplified `prepare` script (`husky` instead of
  `husky install`)
- **globals 16 → 17**, **lint-staged → 16**, **@types/jest → 30**

### Fixed

- Added `{ cause: err }` to 4 catch-rethrow blocks for error chain preservation
  (ESLint `preserve-caught-error` rule): `anthropic.ts`, `ollama.ts`,
  `openai.ts`, `embeddings.ts`
- Fixed useless initial assignment in `template-compositions/index.ts`

## [0.5.0] — 2026-02-28

### Added

- Python ML sidecar (FastAPI) at `python/siza_ml/`
  - Sentence-transformers embeddings (all-MiniLM-L6-v2, 384-dim)
  - FAISS CPU vector index with persist/rebuild
  - LLM-based quality scoring via Ollama with heuristic fallback
  - LLM-based prompt enhancement via Ollama with rule fallback
  - LoRA fine-tuning via PEFT (TinyLlama base, rank-8, CPU-only)
  - HuggingFace dataset ingestion pipeline
  - Axe-core accessibility rule ingestion
  - ML observability metrics (latency, scores, training progress)
  - Health/readiness probes with memory stats
- TypeScript sidecar client (`src/ml/sidecar-client.ts`)
  - HTTP client for all sidecar endpoints with base64 vector wire format
  - 30-second availability cache, 5s/10s request timeouts
  - Graceful fallback on sidecar unavailability
- Sidecar delegation in ML modules
  - Embeddings: sidecar → Transformers.js fallback
  - Quality scoring: sidecar → local LLM → heuristic chain
  - Prompt enhancement: sidecar → local LLM → rules chain
  - Training: sidecar PEFT → child_process fallback
- Python CI workflow (`.github/workflows/python-ci.yml`)
- Docker support for sidecar (`python/Dockerfile`, python:3.12-slim)
- Ingestion scripts: `seed:rules`, `ingest:hf`
- 41 Python tests, 12 new TypeScript tests (424 total)

## [0.4.0] — 2026-02-28

### Added

- Multi-provider LLM abstraction layer (`src/llm/`)
  - `ILLMProvider` interface with `generate()` and `isAvailable()` methods
  - `OllamaProvider`: local inference via Ollama API (default: llama3.2:3b)
  - `OpenAIProvider`: OpenAI-compatible chat completions (GPT-4o-mini default)
  - `AnthropicProvider`: Claude Messages API (claude-sonnet-4 default)
  - Gemini support via OpenAI-compatible adapter
  - `createProvider()` factory for config-driven instantiation
  - `createProviderWithFallback()` with automatic Ollama detection
  - `detectOllama()` utility for checking local availability
- LLM integration in ML modules
  - `setPromptEnhancerLLM()` / `getPromptEnhancerLLM()` for model-backed prompt
    enhancement
  - `setQualityScorerLLM()` / `getQualityScorerLLM()` for model-backed quality
    scoring
  - Automatic fallback to rule-based enhancement when no LLM available
- 35 unit tests for all providers, factory, and fallback logic

## [0.3.0] — 2026-02-28

### Added

- `brandToDesignContext()` transform: converts branding-mcp BrandIdentity JSON
  to `Partial<IDesignContext>` for cross-repo brand integration
- `BrandIdentityInput` type for decoupled brand token consumption
- Automatic foreground color computation via perceived brightness
- Maps colors, typography, spacing, shadows, and border radii from brand tokens

## [0.2.0] — 2026-02-27

### Added

- MIT LICENSE file
- npm publish configuration (`publishConfig.access: "public"`)
- GitHub Actions publish workflow (triggers on release, includes npm provenance)

### Changed

- Exclude source maps from published tarball (327 KB compressed, was 749 KB)

## [0.1.1] — 2026-02-25

### Fixed

- Redirect Pino logger to stderr to prevent stdout contamination in MCP stdio
  transport
- Complete public API exports for siza-mcp integration

## [0.1.0] — 2026-02-25

### Added

- **AI/ML subsystem**: Sentence embeddings (all-MiniLM-L6-v2), quality scoring,
  prompt enhancement, style recommendation, training pipeline
- **Framework generators**: React, Vue, Angular, Svelte, HTML with generator
  factory pattern
- **Component registry**: 502 curated snippets (357 component + 85 animation +
  60 backend)
- **Feedback system**: Self-learning loop, pattern promotion, feedback-boosted
  search, prompt classifier
- **Quality validation**: Anti-generic rules, diversity tracking, semantic token
  enforcement
- **Template compositions**: 15 pre-built page compositions with quality gating
  (threshold >= 5)
- **Template packs**: SaaS dashboard, startup landing, AI chat app
- **Scaffold templates**: 5 project scaffolds (next-saas, next-app, express-api,
  fullstack-mono, react-spa) + 3 state management patterns
- **Artifact storage**: Generated artifact store with learning loop
- **Icon systems**: 6 library adapters (lucide, heroicons, phosphor, tabler,
  font-awesome, radix)
- **Component libraries**: shadcn, radix, headlessui, material integration
  patterns
- **Utilities**: JSX transformation, string helpers, style conversion
- **CI**: Lint, type-check, build, test, security audit
- **Tests**: 343 tests across 17 suites

### Architecture

Extracted from [siza-mcp](https://github.com/Forge-Space/ui-mcp) to enable
direct consumption by siza-desktop, siza webapp, CLI tools, and any future
consumer without MCP protocol overhead.
