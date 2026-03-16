import {
  recordGeneration,
  isDuplicateConsecutive,
  suggestDiverseVariant,
  clearHistory,
} from '../quality/diversity-tracker.js';
import type { IComponentSnippet } from '../registry/component-registry/types.js';

function makeSnippet(id: string, type: string, variant: string): IComponentSnippet {
  return {
    id,
    name: id,
    category: 'atom',
    type,
    variant,
    tags: [],
    mood: [],
    industry: [],
    visualStyles: [],
    jsx: '<div />',
    tailwindClasses: {},
    a11y: {
      roles: [],
      ariaAttributes: [],
      keyboardNav: 'none',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: false,
    },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: { antiGeneric: [], inspirationSource: '', craftDetails: [] },
  };
}

beforeEach(() => {
  clearHistory();
});

describe('clearHistory', () => {
  it('empties the history', () => {
    recordGeneration(makeSnippet('a', 'hero', 'centered'));
    clearHistory();
    expect(isDuplicateConsecutive('hero', 'centered')).toBe(false);
  });
});

describe('recordGeneration', () => {
  it('records a snippet into history', () => {
    const snippet = makeSnippet('btn-1', 'button', 'primary');
    recordGeneration(snippet);
    expect(isDuplicateConsecutive('button', 'primary')).toBe(true);
  });

  it('caps history at 50 entries', () => {
    for (let i = 0; i < 55; i++) {
      recordGeneration(makeSnippet(`s-${i}`, 'card', `v${i}`));
    }
    // After 55 pushes with cap 50, the 51st item was shifted out
    // The last item should be v54
    expect(isDuplicateConsecutive('card', 'v54')).toBe(true);
    // First items were dropped — suggest should see only the last 50
    const available = Array.from({ length: 55 }, (_, i) => `v${i}`);
    const suggestion = suggestDiverseVariant('card', available);
    // v0–v4 were shifted out, so v0 should be "unused" and returned first
    expect(suggestion).toBe('v0');
  });
});

describe('isDuplicateConsecutive', () => {
  it('returns false when history is empty', () => {
    expect(isDuplicateConsecutive('button', 'primary')).toBe(false);
  });

  it('returns true when last entry matches type and variant', () => {
    recordGeneration(makeSnippet('a', 'hero', 'split'));
    expect(isDuplicateConsecutive('hero', 'split')).toBe(true);
  });

  it('returns false when type does not match', () => {
    recordGeneration(makeSnippet('a', 'hero', 'split'));
    expect(isDuplicateConsecutive('card', 'split')).toBe(false);
  });

  it('returns false when variant does not match', () => {
    recordGeneration(makeSnippet('a', 'hero', 'split'));
    expect(isDuplicateConsecutive('hero', 'centered')).toBe(false);
  });

  it('only checks the last entry, not earlier ones', () => {
    recordGeneration(makeSnippet('a', 'hero', 'centered'));
    recordGeneration(makeSnippet('b', 'hero', 'split'));
    expect(isDuplicateConsecutive('hero', 'centered')).toBe(false);
    expect(isDuplicateConsecutive('hero', 'split')).toBe(true);
  });
});

describe('suggestDiverseVariant', () => {
  it('returns first unused variant', () => {
    recordGeneration(makeSnippet('a', 'hero', 'centered'));
    recordGeneration(makeSnippet('b', 'hero', 'split'));
    const suggestion = suggestDiverseVariant('hero', ['centered', 'split', 'fullscreen']);
    expect(suggestion).toBe('fullscreen');
  });

  it('returns first available when all variants are used', () => {
    recordGeneration(makeSnippet('a', 'hero', 'centered'));
    recordGeneration(makeSnippet('b', 'hero', 'split'));
    const suggestion = suggestDiverseVariant('hero', ['centered', 'split']);
    expect(suggestion).toBe('centered');
  });

  it('returns first variant when history is empty for that type', () => {
    const suggestion = suggestDiverseVariant('hero', ['centered', 'split']);
    expect(suggestion).toBe('centered');
  });

  it('ignores records of different types', () => {
    recordGeneration(makeSnippet('a', 'card', 'pricing'));
    const suggestion = suggestDiverseVariant('hero', ['centered', 'split']);
    expect(suggestion).toBe('centered');
  });

  it('returns undefined for empty available list', () => {
    expect(suggestDiverseVariant('hero', [])).toBeUndefined();
  });
});
