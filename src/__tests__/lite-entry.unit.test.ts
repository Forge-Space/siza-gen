import {
  assembleContext,
  brandToDesignContext,
  designContextStore,
  DEFAULT_CONTEXT,
} from '../lite.js';
import type {
  IContextAssemblerParams,
  IAssembledContext,
} from '../lite.js';

describe('lite entry point', () => {
  describe('assembleContext', () => {
    it('includes all fixed sections for standard budget', () => {
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

    it('never includes examples section', () => {
      const result = assembleContext({
        framework: 'react',
        componentType: 'button',
        tokenBudget: 8000,
        maxExamples: 10,
      });

      expect(result.sectionsIncluded).not.toContain('examples');
      expect(result.examplesIncluded).toBe(0);
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

    it('omits library section when componentLibrary is undefined', () => {
      const result = assembleContext({
        framework: 'react',
        tokenBudget: 4000,
      });

      expect(result.sectionsIncluded).not.toContain('library');
    });

    it('respects tight token budget', () => {
      const result = assembleContext({
        framework: 'react',
        componentLibrary: 'shadcn',
        tokenBudget: 500,
      });

      expect(result.tokenEstimate).toBeLessThanOrEqual(500);
      expect(result.sectionsIncluded.length).toBeGreaterThanOrEqual(1);
    });

    it('defaults tokenBudget to 4000', () => {
      const result = assembleContext({ framework: 'react' });
      expect(result.tokenEstimate).toBeLessThanOrEqual(4000);
    });

    it('handles all supported frameworks', () => {
      for (const fw of ['react', 'vue', 'angular', 'svelte', 'html']) {
        const result = assembleContext({ framework: fw, tokenBudget: 4000 });
        expect(result.sectionsIncluded).toContain('framework');
      }
    });

    it('token estimate matches re-estimation', () => {
      const result = assembleContext({
        framework: 'react',
        componentLibrary: 'shadcn',
        tokenBudget: 4000,
      });

      const reEstimate = Math.ceil(result.systemPrompt.length / 4);
      expect(result.tokenEstimate).toBe(reEstimate);
    });
  });

  describe('re-exports', () => {
    it('exports brandToDesignContext function', () => {
      expect(typeof brandToDesignContext).toBe('function');
    });

    it('exports designContextStore', () => {
      expect(designContextStore).toBeDefined();
      expect(typeof designContextStore.get).toBe('function');
    });

    it('exports DEFAULT_CONTEXT', () => {
      expect(DEFAULT_CONTEXT).toBeDefined();
    });
  });
});
