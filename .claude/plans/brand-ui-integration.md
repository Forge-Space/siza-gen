# Cross-Repo: Brand Identity → UI Generation Integration

## Enhancement Summary

**Deepened on:** 2026-03-03 **Status:** Implementation complete (siza-gen
v0.7.0, siza-mcp + ui-mcp have `brand_identity`) **Sections enhanced:**
Architecture, Field Mapping, Cross-Repo, Risk Matrix, Post-Implementation

### Key Improvements

1. WCAG luminance formula (sRGB linearization) for foreground contrast
2. Hex normalization for 3-char (`#f00`) and 8-char hex; document supported
   format
3. Extract `deepMergeContext` to shared module in siza-mcp
4. Add tests: empty neutral, malformed hex, invalid brand structure
5. Forge-cross-repo: siza-gen first, then siza-mcp; use
   `feat/brand-ui-integration` branch

### Post-Implementation Enhancements (Phase 4)

- [ ] Switch `brand-identity-transform.ts` to WCAG luminance
- [ ] Add `normalizeHex()` or document 6-char hex only
- [ ] Extract `design-context-merge.ts` in siza-mcp
- [ ] Add `borders.radii` mapping for `xl`, `circle`, `none`

---

## Forge-Cross-Repo Coordination

| Step | Repo     | Branch                      | Order                |
| ---- | -------- | --------------------------- | -------------------- |
| 1    | siza-gen | `feat/brand-ui-integration` | First (leaf)         |
| 2    | siza-mcp | `feat/brand-ui-integration` | After siza-gen ships |
| 3    | ui-mcp   | (optional)                  | Parity with siza-mcp |

**Change order:** siza-gen → siza-mcp (bottom-up). branding-mcp is already
v0.4.0.

**Quick commands:**

```bash
# Create matching branches
git -C siza-gen checkout -b feat/brand-ui-integration
git -C siza-mcp checkout -b feat/brand-ui-integration

# Build all
(cd siza-gen && npm run build && npm test)
(cd siza-mcp && npm install && npm run build && npm test)
```

---

## Context

branding-mcp v0.4.0 generates complete `BrandIdentity` objects (colors,
typography, spacing, shadows, borders, gradients). siza-gen's generators consume
`IDesignContext` via a global `designContextStore`. This plan bridges the two: a
transform utility in siza-gen converts BrandIdentity → Partial<IDesignContext>,
and siza-mcp tools get a `brand_identity` parameter to inject brand tokens into
generation.

**Repos affected:** siza-gen (v0.2.0 → v0.3.0), siza-mcp (v0.9.1 → v0.10.0)

## Pre-Conditions

- [ ] branding-mcp v0.4.0 released (done)
- [ ] siza-gen main clean, tests passing (343 tests)
- [ ] siza-mcp main clean, tests passing (394 tests)

## Architecture After Implementation

```
branding-mcp                    siza-gen                        siza-mcp
┌──────────────┐               ┌──────────────────┐            ┌──────────────────┐
│ BrandIdentity│──JSON string──│ brandToDesignCtx()│            │ 5 MCP tools      │
│ (colors,     │               │ transforms to     │            │ + brand_identity  │
│  typography, │               │ Partial<IDesign   │            │   optional param  │
│  spacing,    │               │   Context>        │            │                   │
│  shadows,    │               ├──────────────────┤            │ withBrandContext() │
│  borders,    │               │ designContextStore│◄──update───│ scoped application│
│  gradients)  │               │   .update(partial)│            │ + auto-restore    │
└──────────────┘               └──────────────────┘            └──────────────────┘
```

**Flow:** User calls `generate_ui_component` with `brand_identity` JSON →
siza-mcp parses → calls siza-gen `brandToDesignContext()` → scoped
`designContextStore.update()` → generation runs with brand tokens → context
restored.

## Field Mapping: BrandIdentity → IDesignContext

| BrandIdentity field                   | IDesignContext field                 | Transform                       |
| ------------------------------------- | ------------------------------------ | ------------------------------- |
| `colors.primary.hex`                  | `colorPalette.primary`               | Direct                          |
| computed                              | `colorPalette.primaryForeground`     | `#fff` or `#000` by luminance   |
| `colors.secondary.hex`                | `colorPalette.secondary`             | Direct                          |
| computed                              | `colorPalette.secondaryForeground`   | `#fff` or `#000` by luminance   |
| `colors.accent.hex`                   | `colorPalette.accent`                | Direct                          |
| computed                              | `colorPalette.accentForeground`      | `#fff` or `#000` by luminance   |
| `colors.neutral[last]`                | `colorPalette.background`            | Lightest neutral                |
| `colors.neutral[0]`                   | `colorPalette.foreground`            | Darkest neutral                 |
| `colors.neutral[mid]`                 | `colorPalette.muted`                 | Middle neutral                  |
| computed                              | `colorPalette.mutedForeground`       | Darkest neutral                 |
| `colors.neutral[mid-light]`           | `colorPalette.border`                | Light-mid neutral               |
| `colors.semantic.error.hex`           | `colorPalette.destructive`           | Direct                          |
| computed                              | `colorPalette.destructiveForeground` | `#fff` or `#000` by luminance   |
| `typography.bodyFont`                 | `typography.fontFamily`              | Direct                          |
| `typography.headingFont`              | `typography.headingFont`             | Direct                          |
| `typography.steps`                    | `typography.fontSize`                | Map step names → size keys      |
| `typography.steps[].weight`           | `typography.fontWeight`              | Extract unique weights          |
| `typography.steps[].lineHeight`       | `typography.lineHeight`              | Categorize tight/normal/relaxed |
| `spacing.unit`                        | `spacing.unit`                       | Direct                          |
| `spacing.values`                      | `spacing.scale`                      | Parse rem strings → numbers     |
| `borders?.radii.{sm,md,lg,full}`      | `borderRadius.{sm,md,lg,full}`       | Direct (matching keys)          |
| `shadows?.levels.{sm,md,lg}.cssValue` | `shadows.{sm,md,lg}`                 | Extract cssValue                |

---

## Phase 1: BrandIdentity → IDesignContext Transform (siza-gen) — 1h

**Goal:** Add `brandToDesignContext()` utility that converts BrandIdentity JSON
into `Partial<IDesignContext>`.

### Step 1: Define Input Type

Create `src/brand-identity-transform.ts` with a lightweight `BrandIdentityInput`
interface. This mirrors branding-mcp's `BrandIdentity` but only includes fields
we consume. No dependency on branding-mcp.

```typescript
export interface BrandIdentityInput {
  colors: {
    primary: { hex: string };
    secondary: { hex: string };
    accent: { hex: string };
    neutral: Array<{ hex: string }>;
    semantic: {
      success: { hex: string };
      warning: { hex: string };
      error: { hex: string };
      info: { hex: string };
    };
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    steps: Array<{
      name: string;
      size: string;
      lineHeight: string;
      weight: number;
    }>;
  };
  spacing: {
    unit: number;
    values: Record<string, string>;
  };
  shadows?: {
    levels: Record<string, { cssValue: string }>;
  };
  borders?: {
    radii: Record<string, string>;
  };
}
```

### Step 2: Implement Transform

In the same file, implement:

```typescript
export function brandToDesignContext(
  brand: BrandIdentityInput
): Partial<IDesignContext>;
```

Key helpers (all <15 lines):

- `contrastForeground(hex: string): string` — returns `#ffffff` or `#000000`
  based on relative luminance. Prefer WCAG formula (sRGB linearization +
  `0.2126*R + 0.7152*G + 0.0722*B`) for consistency with branding-mcp; plan
  originally used BT.601 (`0.299/0.587/0.114`) which does not guarantee WCAG
  4.5:1 contrast
- `hexToRgb(hex: string): [number, number, number]` — parse hex to RGB tuple
- `mapTypographySteps(steps)` — maps step names to fontSize keys (`xs` through
  `3xl`)
- `extractLineHeights(steps)` — categorize into tight (<1.3), normal (1.3-1.6),
  relaxed (>1.6)
- `parseSpacingScale(values)` — parse rem/px strings to numeric array

### Step 3: Export

Add to `src/index.ts`:

```typescript
export {
  brandToDesignContext,
  type BrandIdentityInput,
} from './brand-identity-transform.js';
```

### Files

| Action | File                                                  |
| ------ | ----------------------------------------------------- |
| Create | `src/brand-identity-transform.ts` (~80 lines)         |
| Create | `src/__tests__/brand-identity-transform.unit.test.ts` |
| Modify | `src/index.ts` (add export)                           |

### Tests (~15 tests)

- Full transform produces all required IDesignContext fields
- Foreground colors are white for dark backgrounds, black for light
- Typography steps map correctly to fontSize keys
- Spacing values parsed from rem strings
- Optional shadows mapped when present
- Optional borders mapped when present
- Missing optional fields result in undefined (not included in partial)
- Neutral array with different lengths (edge case: <5 neutrals)
- Empty neutral array (fallback to `#888888` or validate)
- Primary/secondary/accent hex values pass through unchanged
- Invalid/malformed hex (3-char, 8-char, non-hex) — document supported format

### Verification

- [ ] `npm run build` succeeds
- [ ] `npm test` passes (343 + ~15 = ~358 tests)
- [ ] `npm run typecheck` clean
- [ ] Transform output can be passed to `designContextStore.update()` without
      error

### Anti-Patterns

- Don't import from branding-mcp — define input type locally
- Don't use `hexToHsl` from branding-mcp — implement minimal luminance check
  inline

---

## Phase 2: Brand Identity Param in siza-mcp Tools — 1.5h

**Goal:** Add optional `brand_identity` parameter to all 5 generation tools with
scoped context application.

### Step 1: Bump siza-gen Dependency

After Phase 1 ships siza-gen v0.3.0 to npm:

- Update `package.json`: `"@forgespace/siza-gen": "^0.3.0"`
- Run `npm install`

### Step 2: Create Shared Helper

Create `src/lib/brand-context.ts` in siza-mcp:

```typescript
import {
  brandToDesignContext,
  designContextStore,
  type BrandIdentityInput,
} from '@forgespace/siza-gen';

export async function withBrandContext<T>(
  brandJson: string | undefined,
  fn: () => Promise<T>
): Promise<T> {
  if (!brandJson) return fn();

  const previous = designContextStore.get();
  try {
    const brand: BrandIdentityInput = JSON.parse(brandJson);
    const partial = brandToDesignContext(brand);
    designContextStore.update(partial);
    return await fn();
  } finally {
    designContextStore.set(previous);
  }
}
```

This ensures:

- No-op when `brand_identity` is not provided (backward compat)
- Context restored after generation (even on error)
- Deep merge preserves default values for unmapped fields

### Step 3: Add Parameter to 5 Tools

Add to each tool's Zod schema:

```typescript
brand_identity: z.string()
  .optional()
  .describe(
    'JSON string from branding-mcp generate_brand_identity tool. ' +
    'Overrides design context with brand colors, typography, and spacing.'
  ),
```

**Tools to modify:**

1. `src/tools/generate-component.ts` — `generate_ui_component`
2. `src/tools/generate-page.ts` — `generate_page_template`
3. `src/tools/scaffold-app.ts` — `scaffold_full_application`
4. `src/tools/generate-image.ts` — `generate_design_image`
5. `src/tools/generate-prototype.ts` — `generate_prototype`

Wrap each tool's handler body with `withBrandContext()`:

```typescript
async ({ brand_identity, ...params }) => {
  return withBrandContext(brand_identity, async () => {
    // existing handler logic unchanged
  });
};
```

For tools 4 and 5 that already accept `design_context`, the order is:

1. Apply `brand_identity` (broad brand tokens)
2. Apply `design_context` (specific overrides — existing behavior)

This means `brand_identity` is applied first (in `withBrandContext`), then the
existing `design_context` merge runs as before.

### Files

| Action | File                                  |
| ------ | ------------------------------------- |
| Create | `src/lib/brand-context.ts`            |
| Create | `src/__tests__/brand-context.test.ts` |
| Modify | `src/tools/generate-component.ts`     |
| Modify | `src/tools/generate-page.ts`          |
| Modify | `src/tools/scaffold-app.ts`           |
| Modify | `src/tools/generate-image.ts`         |
| Modify | `src/tools/generate-prototype.ts`     |

### Tests (~12 tests)

- `withBrandContext` with undefined brand_identity is no-op
- `withBrandContext` updates design context during execution
- `withBrandContext` restores previous context after execution
- `withBrandContext` restores context on error
- Invalid JSON string returns structured error (wrap JSON.parse in try/catch;
  `finally` still restores)
- `generate_ui_component` accepts brand_identity param (schema validation)
- `generate_page_template` accepts brand_identity param
- `scaffold_full_application` accepts brand_identity param
- Brand identity colors appear in generated component output
- Brand + design_context: design_context overrides brand values

### Verification

- [ ] `npm run build` succeeds
- [ ] `npm test` passes (394 + ~12 = ~406 tests)
- [ ] `npm run typecheck` clean
- [ ] Manual test: call `generate_ui_component` with brand_identity JSON from
      branding-mcp

### Anti-Patterns

- Don't modify global designContextStore without restore — always use
  `withBrandContext` wrapper
- Don't parse brand_identity inside individual tools — use the shared helper
- Don't duplicate restore in catch blocks — `finally` already restores; if you
  catch JSON.parse for structured errors, let `finally` handle restore
- `npm run build` required before `npm test` in siza-mcp

---

## Phase 3: Ship — 30min

### siza-gen (v0.2.0 → v0.3.0)

1. `npm run validate` (all tests green)
2. Update CHANGELOG.md:

   ```markdown
   ## [0.3.0] — 2026-02-28

   ### Added

   - `brandToDesignContext()`: Transform branding-mcp BrandIdentity to
     IDesignContext
   - `BrandIdentityInput` type for cross-repo brand integration
   ```

3. Update README.md (new export in API section)
4. Version bump in package.json: 0.2.0 → 0.3.0
5. Commit: `feat: Add BrandIdentity to IDesignContext transform`
6. Push, create PR, merge
7. npm publish triggers via GitHub Actions

### siza-mcp (v0.9.1 → v0.10.0)

1. Update `@forgespace/siza-gen` dependency to `^0.3.0`
2. `npm install && npm run build && npm test`
3. Update CHANGELOG.md:

   ```markdown
   ## [0.10.0] — 2026-02-28

   ### Added

   - `brand_identity` parameter on all 5 generation tools
   - Brand token injection from branding-mcp output
   ```

4. Update README.md (new param in tool docs)
5. Version bump: 0.9.1 → 0.10.0
6. Commit: `feat: Add brand_identity parameter for cross-repo brand integration`
7. Push, create PR, merge

### Verification

- [ ] siza-gen: `npm run validate` passes, published to npm
- [ ] siza-mcp: `npm run validate` passes
- [ ] No TypeScript errors in either repo
- [ ] Cross-repo workflow works: branding-mcp → JSON → siza-mcp → branded
      component

## Key Gotchas

- `npm run build` required before `npm test` in both siza-gen and siza-mcp
- siza-mcp PostToolUse hooks may revert Edit/Write — use python3 via Bash for
  bulk edits
- siza-gen `.uiforge/rag.sqlite` cache — delete if test results are stale
- Subagents produce invalid enum values — run `tsc --noEmit` after any subagent
  file creation
- siza-gen npm publish: CI workflow triggers on version bump merge to main
- Global designContextStore is a singleton — `withBrandContext` MUST restore
  previous state
- Concurrent requests in MCP server share the singleton — acceptable for v1
  (single-user MCP), but note for future session-scoped stores
- **Concurrent requests**: If two tools run with different `brand_identity` at
  once, the store ends up with whichever request finishes last. Document as
  known limitation for v1; plan session-scoped stores for multi-session.

## Research Insights: Architecture

**Flow**: branding-mcp → siza-gen brandToDesignContext → siza-mcp
withBrandContext is sound. JSON string decouples repos; no circular deps.

**Restore correctness**: `designContextStore.get()` returns a deep clone;
`set(previous)` in `finally` runs even when `fn()`, `JSON.parse()`, or
`brandToDesignContext()` throws. Restore is correct.

**Concurrency**: Last-finishing request wins; acceptable for v1 single-user.

## Research Insights: Cross-Repo Dependency Graph

**Clarification**: The phrase "siza-gen → siza-mcp → branding-mcp" describes
**release order** (bottom-up), not package dependency direction.

| Repo         | Package Deps           | Role in Flow                                               |
| ------------ | ---------------------- | ---------------------------------------------------------- |
| siza-gen     | None (leaf)            | Provides `brandToDesignContext()`, `designContextStore`    |
| siza-mcp     | `@forgespace/siza-gen` | Consumes transform; applies brand via `withBrandContext()` |
| branding-mcp | None (leaf)            | Produces BrandIdentity JSON; user passes to siza-mcp       |

**Data flow**: branding-mcp output → user → siza-mcp `brand_identity` param →
siza-gen `brandToDesignContext()` → `designContextStore.update()`.

**Verdict**: Flow is correct. siza-gen and branding-mcp are independent leaves;
siza-mcp is the integration point. JSON boundary ensures no circular deps.

## Research Insights: Pattern Compliance Assessment

| Convention              | Status | Notes                                                                                                                                          |
| ----------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Bottom-up release order | ✓      | siza-gen v0.3.0 ships first; siza-mcp v0.10.0 consumes                                                                                         |
| JSON boundary           | ✓      | `brand_identity` is string; no shared types across repos                                                                                       |
| No circular deps        | ✓      | siza-gen has no dep on branding-mcp; branding-mcp has no dep on siza-gen                                                                       |
| Forge Space chain       | ⚠      | chain-release uses siza-gen → core → siza-mcp → siza → mcp-gateway → branding-mcp; this plan only touches siza-gen and siza-mcp                |
| ui-mcp parity           | ⚠      | Plan targets siza-mcp; ui-mcp also uses `designContextStore` and has `brand-context.ts` — consider same `brand_identity` param for consistency |

## Research Insights: Risk Matrix

| Risk                         | Likelihood | Impact | Mitigation                                                                                            |
| ---------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------- |
| Singleton designContextStore | —          | Medium | Documented; `withBrandContext` restore is correct                                                     |
| Concurrent requests          | Low (v1)   | Medium | Last-finisher wins; acceptable for single-user MCP; plan session-scoped stores for multi-session      |
| Version coupling             | Medium     | Low    | branding-mcp BrandIdentity schema changes require manual sync of `BrandIdentityInput`; no runtime dep |
| JSON.parse throws            | Low        | Low    | `finally` restores; wrap in try/catch for structured error if needed                                  |
| Empty neutral array          | Low        | Medium | Document fallback `#888888` or validate input                                                         |

## Research Insights: Recommendations for the Plan

1. **ui-mcp alignment**: If ui-mcp is in scope, add `brand_identity` to its
   generation tools for parity with siza-mcp.
2. **Concurrency doc**: Add to README/CHANGELOG: "Concurrent tool calls with
   different `brand_identity` may interleave; last-finishing request's restore
   wins. Single-user MCP assumed for v1."
3. **Schema drift**: Document in siza-gen README that `BrandIdentityInput`
   mirrors branding-mcp's `BrandIdentity`; schema changes require coordinated
   release.
4. **Version bounds**: Use `^0.3.0` for siza-gen in siza-mcp to allow
   patch/minor updates without breaking.

## Research Insights: Field Mapping

| Gap                   | Severity | Action                                                                                        |
| --------------------- | -------- | --------------------------------------------------------------------------------------------- |
| typography.fontWeight | Medium   | Plan says "Extract unique weights"; impl hardcodes. Consider extracting from steps.           |
| hexToRgb              | Medium   | Does not handle 3-char hex (`#f00`), 8-char, or malformed. Add validation or document format. |
| empty neutral array   | High     | `pickNeutral([], 0)` falls back to `#888888`; validate or document.                           |
| borders.radii         | Low      | branding-mcp has `xl`, `circle`, `none`; add mapping for `xl`→`lg`, `circle`→`9999px`.        |

**WCAG**: Current luminance formula (BT.601) does not guarantee 4.5:1 contrast.
Use WCAG relative luminance (sRGB linearization + 0.2126/0.7152/0.0722) to align
with branding-mcp and accessibility tooling. Document: "Foreground selection
uses luminance heuristic; does not guarantee WCAG 4.5:1."

## Research Insights: Implementation Risks

- **fn() throws**: `finally` runs before error propagates; restore is correct.
- **JSON.parse throws**: Same; restore happens. If structured error response
  needed, wrap in try/catch and return controlled error; `finally` still
  restores.
- **Anti-pattern**: If catching JSON.parse, do not duplicate restore in catch;
  `finally` already handles it.

## What's Out of Scope

- BrandStyle → VisualStyleId mapping (branding-mcp's 8 styles ≠ siza-gen's 10
  visual styles — separate feature)
- Gradient token injection (IDesignContext has no gradient field — would need
  type extension)
- Motion/animation token injection (same — IDesignContext has no motion field)
- Session-scoped design contexts (needed for multi-user, but singleton is fine
  for v1)
- branding-mcp as direct dependency of siza-gen (keep decoupled via JSON string
  interface)

---

## Phase 4: Post-Implementation Improvements — 1h

**Goal:** Apply code-architect and architecture-strategist recommendations.

### 4.1 WCAG Luminance (siza-gen)

In `src/brand-identity-transform.ts`, replace BT.601 with WCAG relative
luminance:

```typescript
function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * linearize(r / 255) +
    0.7152 * linearize(g / 255) +
    0.0722 * linearize(b / 255)
  );
}
function contrastForeground(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return relativeLuminance(r, g, b) > 0.5 ? '#000000' : '#ffffff';
}
```

Document: "Foreground selection uses luminance heuristic; does not guarantee
WCAG 4.5:1."

### 4.2 Hex Normalization (siza-gen)

Add `normalizeHex(hex: string): string` to handle `#rgb` → `#rrggbb`. Use before
`hexToRgb`, or document supported format (6-char only).

### 4.3 Extract deepMergeContext (siza-mcp)

Create `src/lib/design-context-merge.ts` and use from `generate-design-image.ts`
and `generate-prototype.ts`.

### 4.4 borders.radii Mapping (siza-gen)

Add mapping for branding-mcp keys: `xl`→`lg`, `circle`→`9999px`, `none`→`0`.

### 4.5 Additional Tests

- Empty neutral array fallback
- Malformed hex (3-char, 8-char, non-hex)
- Invalid brand structure (missing `colors.primary`)
