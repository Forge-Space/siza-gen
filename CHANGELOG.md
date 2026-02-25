# Changelog

All notable changes to this project will be documented in
this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Redirect Pino logger to stderr to prevent stdout contamination in MCP stdio transport

## [0.1.0] — 2026-02-25

### Added

- **AI/ML subsystem**: Sentence embeddings
  (all-MiniLM-L6-v2), quality scoring, prompt enhancement,
  style recommendation, training pipeline
- **Framework generators**: React, Vue, Angular, Svelte,
  HTML with generator factory pattern
- **Component registry**: 502 curated snippets (357
  component + 85 animation + 60 backend)
- **Feedback system**: Self-learning loop, pattern
  promotion, feedback-boosted search, prompt classifier
- **Quality validation**: Anti-generic rules, diversity
  tracking, semantic token enforcement
- **Template compositions**: 15 pre-built page compositions
  with quality gating (threshold >= 5)
- **Template packs**: SaaS dashboard, startup landing, AI
  chat app
- **Scaffold templates**: 5 project scaffolds (next-saas,
  next-app, express-api, fullstack-mono, react-spa) + 3
  state management patterns
- **Artifact storage**: Generated artifact store with
  learning loop
- **Icon systems**: 6 library adapters (lucide, heroicons,
  phosphor, tabler, font-awesome, radix)
- **Component libraries**: shadcn, radix, headlessui,
  material integration patterns
- **Utilities**: JSX transformation, string helpers, style
  conversion
- **CI**: Lint, type-check, build, test, security audit
- **Tests**: 343 tests across 17 suites

### Architecture

Extracted from
[siza-mcp](https://github.com/Forge-Space/ui-mcp) to
enable direct consumption by siza-desktop, siza webapp,
CLI tools, and any future consumer without MCP protocol
overhead.
