# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
