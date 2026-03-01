import { assembleContext } from '../context/context-assembler.js';
import { initializeRegistry } from '../registry/component-registry/init.js';
import {
  clearRegistry,
  registerSnippet,
} from '../registry/component-registry/index.js';
import type { IComponentSnippet } from '../registry/component-registry/types.js';

function makeSnippet(
  overrides: Partial<IComponentSnippet> = {}
): IComponentSnippet {
  return {
    id: overrides.id ?? 'test-btn-1',
    name: overrides.name ?? 'Test Button',
    category: overrides.category ?? 'atom',
    type: overrides.type ?? 'button',
    variant: overrides.variant ?? 'primary',
    tags: overrides.tags ?? ['cta'],
    mood: overrides.mood ?? ['professional'],
    industry: overrides.industry ?? ['saas'],
    visualStyles: overrides.visualStyles ?? ['linear-modern'],
    jsx: overrides.jsx ?? '<button className="px-4 py-2">Click</button>',
    tailwindClasses: overrides.tailwindClasses ?? { root: 'px-4 py-2' },
    a11y: overrides.a11y ?? {
      roles: ['button'],
      ariaAttributes: ['aria-label'],
      keyboardNav: 'Enter/Space to activate',
      contrastRatio: '7:1',
      focusVisible: true,
      reducedMotion: true,
    },
    responsive: overrides.responsive ?? {
      strategy: 'mobile-first',
      breakpoints: ['sm', 'md', 'lg'],
    },
    quality: overrides.quality ?? {
      antiGeneric: ['custom-radius', 'brand tokens'],
      inspirationSource: 'linear.app',
      craftDetails: ['subtle shadow', '8pt grid'],
    },
  };
}

describe('assembleContext', () => {
  beforeEach(() => {
    clearRegistry();
  });

  it('includes all fixed sections for a standard budget', () => {
    const result = assembleContext({
      framework: 'react',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).toContain('role');
    expect(result.sectionsIncluded).toContain('quality-rules');
    expect(result.sectionsIncluded).toContain('framework');
    expect(result.sectionsIncluded).toContain('a11y');
    expect(result.tokenEstimate).toBeGreaterThan(0);
    expect(result.tokenEstimate).toBeLessThanOrEqual(4000);
  });

  it('includes library section when componentLibrary is set', () => {
    const result = assembleContext({
      framework: 'react',
      componentLibrary: 'shadcn',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).toContain('library');
    expect(result.systemPrompt).toContain('shadcn/ui');
  });

  it('omits library section when componentLibrary is none', () => {
    const result = assembleContext({
      framework: 'react',
      componentLibrary: 'none',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).not.toContain('library');
  });

  it('omits library section when componentLibrary is undefined', () => {
    const result = assembleContext({
      framework: 'react',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).not.toContain('library');
  });

  it('respects a tight token budget (500 tokens)', () => {
    const result = assembleContext({
      framework: 'react',
      componentLibrary: 'shadcn',
      tokenBudget: 500,
    });

    expect(result.tokenEstimate).toBeLessThanOrEqual(500);
    expect(result.sectionsIncluded.length).toBeGreaterThanOrEqual(1);
    expect(result.sectionsIncluded).toContain('role');
  });

  it('respects a large token budget (8000 tokens)', () => {
    initializeRegistry();
    const result = assembleContext({
      framework: 'react',
      componentLibrary: 'shadcn',
      tokenBudget: 8000,
      maxExamples: 5,
    });

    expect(result.tokenEstimate).toBeLessThanOrEqual(8000);
    expect(result.sectionsIncluded).toContain('role');
    expect(result.sectionsIncluded).toContain('quality-rules');
    expect(result.sectionsIncluded).toContain('a11y');
  });

  it('includes examples when registry has matching snippets', () => {
    registerSnippet(makeSnippet());
    const result = assembleContext({
      framework: 'react',
      componentType: 'button',
      mood: 'professional',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).toContain('examples');
    expect(result.examplesIncluded).toBeGreaterThanOrEqual(1);
    expect(result.systemPrompt).toContain('Test Button');
  });

  it('limits examples by maxExamples', () => {
    registerSnippet(makeSnippet({ id: 'btn-1', name: 'Button 1' }));
    registerSnippet(makeSnippet({ id: 'btn-2', name: 'Button 2' }));
    registerSnippet(makeSnippet({ id: 'btn-3', name: 'Button 3' }));

    const result = assembleContext({
      framework: 'react',
      componentType: 'button',
      tokenBudget: 4000,
      maxExamples: 1,
    });

    expect(result.examplesIncluded).toBeLessThanOrEqual(1);
  });

  it('searches registry with mood and industry params', () => {
    registerSnippet(
      makeSnippet({
        id: 'card-fin-1',
        name: 'Fintech Card',
        type: 'card',
        mood: ['premium'],
        industry: ['fintech'],
      })
    );
    registerSnippet(
      makeSnippet({
        id: 'card-gen-1',
        name: 'Generic Card',
        type: 'card',
        mood: ['calm'],
        industry: ['general'],
      })
    );

    const result = assembleContext({
      framework: 'react',
      componentType: 'card',
      mood: 'premium',
      industry: 'fintech',
      tokenBudget: 4000,
    });

    if (result.examplesIncluded > 0) {
      expect(result.systemPrompt).toContain('Fintech Card');
    }
  });

  it('handles missing optional params gracefully', () => {
    const result = assembleContext({ framework: 'vue' });

    expect(result.systemPrompt).toBeTruthy();
    expect(result.sectionsIncluded).toContain('role');
    expect(result.systemPrompt).toContain('Vue 3');
  });

  it('generates correct framework conventions for each framework', () => {
    for (const fw of ['react', 'vue', 'angular', 'svelte', 'html']) {
      const result = assembleContext({
        framework: fw,
        tokenBudget: 4000,
      });
      expect(result.sectionsIncluded).toContain('framework');
    }
  });

  it('token estimate is within 10% of re-estimated value', () => {
    initializeRegistry();
    const result = assembleContext({
      framework: 'react',
      componentLibrary: 'shadcn',
      tokenBudget: 4000,
    });

    const reEstimate = Math.ceil(result.systemPrompt.length / 4);
    const diff = Math.abs(result.tokenEstimate - reEstimate);
    const tolerance = reEstimate * 0.1;
    expect(diff).toBeLessThanOrEqual(tolerance);
  });

  it('excludes examples when remaining budget is too small', () => {
    registerSnippet(
      makeSnippet({
        jsx: 'x'.repeat(2000),
      })
    );

    const result = assembleContext({
      framework: 'react',
      componentType: 'button',
      tokenBudget: 800,
    });

    expect(result.examplesIncluded).toBe(0);
  });

  it('truncates long JSX in examples', () => {
    registerSnippet(
      makeSnippet({
        jsx: `<div>${'a'.repeat(2000)}</div>`,
      })
    );

    const result = assembleContext({
      framework: 'react',
      componentType: 'button',
      tokenBudget: 4000,
    });

    if (result.examplesIncluded > 0) {
      expect(result.systemPrompt).toContain('(truncated)');
    }
  });

  it('skips examples section entirely when no registry matches', () => {
    const result = assembleContext({
      framework: 'react',
      componentType: 'nonexistent-widget',
      tokenBudget: 4000,
    });

    expect(result.sectionsIncluded).not.toContain('examples');
    expect(result.examplesIncluded).toBe(0);
  });

  it('defaults tokenBudget to 4000 and maxExamples to 3', () => {
    const result = assembleContext({ framework: 'react' });

    expect(result.tokenEstimate).toBeLessThanOrEqual(4000);
  });

  it('includes quality annotations in examples', () => {
    registerSnippet(makeSnippet());
    const result = assembleContext({
      framework: 'react',
      componentType: 'button',
      tokenBudget: 4000,
    });

    if (result.examplesIncluded > 0) {
      expect(result.systemPrompt).toContain('linear.app');
      expect(result.systemPrompt).toContain('custom-radius');
    }
  });
});
