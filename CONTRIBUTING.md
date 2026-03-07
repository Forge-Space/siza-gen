# Contributing to Siza Gen

Thank you for contributing to Siza Gen, the context assembly engine for
AI-driven UI generation. This guide covers everything you need to know to submit
high-quality contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Requirements](#development-requirements)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)

---

## Code of Conduct

All contributors are expected to be respectful, constructive, and professional.
Harassment or exclusionary behavior will not be tolerated.

---

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/Forge-Space/siza-gen.git
cd siza-gen
npm install
```

### 2. Create a feature branch

```bash
git checkout -b feat/my-feature
# or
git checkout -b fix/issue-description
```

Branch naming conventions:

- `feat/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### 3. Validate your environment

```bash
npm run lint
npm run build
npm test
```

---

## Development Requirements

### Code Standards

- **TypeScript only** - All new code must be TypeScript
- **Function size** - Keep functions under 50 lines
- **Cyclomatic complexity** - Maximum complexity of 10 per function
- **Line width** - Maximum 100 characters per line
- **No comments** - Write self-documenting code unless clarification is
  absolutely necessary

### Testing

- **Minimum 80% test coverage** for all new code
- Test business logic and user-facing behavior
- Focus on edge cases, error conditions, and integration flows
- Use realistic test data reflecting actual usage

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- snippet-registry.test.ts
```

### Quality Gates

Before opening a PR, ensure:

```bash
npm run lint          # ESLint passes
npm run build         # TypeScript compilation succeeds
npm test              # All tests pass
```

---

## Submitting Changes

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add lite entry point for zero-native-dep export
fix: resolve duplicate import in registry loader
refactor: simplify context assembler logic
chore: bump dependencies to latest versions
docs: update README with lite usage examples
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `chore`, `ci`, `style`

### Checklist before opening a PR

- [ ] Code follows TypeScript standards (functions <50 lines, complexity <10)
- [ ] Tests added for new functionality with ≥80% coverage
- [ ] All tests pass: `npm test`
- [ ] Lint checks pass: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] CHANGELOG.md updated under `[Unreleased]` section
- [ ] README.md updated if public API changed
- [ ] Commit messages follow conventional commit format

### Opening the Pull Request

1. Push your branch: `git push origin feat/my-feature`
2. Open a PR against `main`
3. Fill in the PR template with:
   - Summary of changes
   - Test plan
   - Breaking changes (if any)
4. Request a review from a maintainer

---

## Review Process

1. **Automated CI** runs lint, type-check, build, tests, and security scans
2. **Maintainer review** checks code quality, test coverage, and documentation
3. **Approval** requires CI passing + at least 1 maintainer approval
4. **Merge** is done by a maintainer using squash merge

Typical review turnaround: 2–5 business days.

---

## Questions?

Open a [GitHub Discussion](https://github.com/Forge-Space/siza-gen/discussions)
or file an [issue](https://github.com/Forge-Space/siza-gen/issues).
