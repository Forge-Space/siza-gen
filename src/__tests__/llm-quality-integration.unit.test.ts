import { jest } from '@jest/globals';
import { scoreQuality, setQualityScorerLLM, getQualityScorerLLM } from '../ml/quality-scorer.js';
import { enhancePrompt, setPromptEnhancerLLM, getPromptEnhancerLLM } from '../ml/prompt-enhancer.js';
import type { ILLMProvider, ILLMResponse } from '../llm/types.js';

type MockFn = ReturnType<typeof jest.fn>;

function createMockProvider(response: string, overrides?: Partial<ILLMResponse>): ILLMProvider & { generate: MockFn } {
  return {
    type: 'ollama',
    model: 'test-model',
    generate: jest.fn<ILLMProvider['generate']>().mockResolvedValue({
      text: response,
      model: 'test-model',
      provider: 'ollama',
      latencyMs: 10,
      ...overrides,
    }),
    isAvailable: jest.fn<ILLMProvider['isAvailable']>().mockResolvedValue(true),
  };
}

function createFailingProvider(error: string): ILLMProvider {
  return {
    type: 'ollama',
    model: 'test-model',
    generate: jest.fn<ILLMProvider['generate']>().mockRejectedValue(new Error(error)),
    isAvailable: jest.fn<ILLMProvider['isAvailable']>().mockResolvedValue(false),
  };
}

const SAMPLE_CODE = `
export default function HeroSection() {
  return (
    <section className="flex flex-col items-center p-8 md:p-16">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-muted-foreground mt-4">
        Build something amazing
      </p>
      <button
        className="mt-6 rounded-lg bg-primary px-6 py-3"
        aria-label="Get started"
      >
        Get Started
      </button>
    </section>
  );
}
`;

// ── Quality Scorer LLM Integration ────────────────────────

describe('Quality Scorer — LLM Integration', () => {
  afterEach(() => {
    setQualityScorerLLM(null);
  });

  it('setQualityScorerLLM/getQualityScorerLLM work', () => {
    expect(getQualityScorerLLM()).toBeNull();
    const mock = createMockProvider('{"score":8}');
    setQualityScorerLLM(mock);
    expect(getQualityScorerLLM()).toBe(mock);
    setQualityScorerLLM(null);
    expect(getQualityScorerLLM()).toBeNull();
  });

  it('returns heuristic-only when no LLM configured', async () => {
    const result = await scoreQuality('Create a hero section', SAMPLE_CODE);
    expect(result.source).toBe('heuristic');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it('blends LLM and heuristic scores (60/40)', async () => {
    const mock = createMockProvider('{"score":9,"reasoning":"good"}');
    setQualityScorerLLM(mock);

    const result = await scoreQuality('Create a hero section', SAMPLE_CODE, {
      componentType: 'hero',
      framework: 'react',
    });

    expect(result.source).toBe('model');
    expect(result.factors?.llmScore).toBe(9);
    expect(result.factors?.heuristicScore).toBeDefined();
    expect(mock.generate).toHaveBeenCalledTimes(1);

    const h = result.factors!.heuristicScore as number;
    const expected = Math.round((0.6 * 9 + 0.4 * h) * 10) / 10;
    expect(result.score).toBeCloseTo(expected, 1);
  });

  it('falls back to heuristic on LLM error', async () => {
    const mock = createFailingProvider('connection refused');
    setQualityScorerLLM(mock);

    const result = await scoreQuality('Create a button', SAMPLE_CODE);

    expect(result.source).toBe('heuristic');
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('falls back on unparseable LLM response', async () => {
    const mock = createMockProvider('I think the code looks great!');
    setQualityScorerLLM(mock);

    const result = await scoreQuality('Create a button', SAMPLE_CODE);

    expect(result.source).toBe('heuristic');
  });

  it('handles score-only response (no JSON)', async () => {
    const mock = createMockProvider('7');
    setQualityScorerLLM(mock);

    const result = await scoreQuality('Create a hero', SAMPLE_CODE);

    expect(result.source).toBe('model');
    expect(result.factors?.llmScore).toBe(7);
  });

  it('clamps scores to 0-10 range', async () => {
    const mock = createMockProvider('{"score":15}');
    setQualityScorerLLM(mock);

    const result = await scoreQuality('test', SAMPLE_CODE);
    expect(result.source).toBe('heuristic');
  });

  it('passes code snippet to LLM (truncated)', async () => {
    const mock = createMockProvider('{"score":8}');
    setQualityScorerLLM(mock);

    const longCode = 'x'.repeat(5000);
    await scoreQuality('test', longCode);

    const callArgs = (mock.generate as MockFn).mock.calls[0]![0] as string;
    expect(callArgs.length).toBeLessThan(5000);
  });
});

// ── Prompt Enhancer LLM Integration ───────────────────────

describe('Prompt Enhancer — LLM Integration', () => {
  afterEach(() => {
    setPromptEnhancerLLM(null);
  });

  it('setPromptEnhancerLLM/getPromptEnhancerLLM work', () => {
    expect(getPromptEnhancerLLM()).toBeNull();
    const mock = createMockProvider('improved prompt');
    setPromptEnhancerLLM(mock);
    expect(getPromptEnhancerLLM()).toBe(mock);
  });

  it('returns rule-based when no LLM configured', async () => {
    const result = await enhancePrompt('Create a button');
    expect(result.source).toBe('rules');
    expect(result.enhanced).toContain('ARIA');
    expect(result.enhanced).toContain('responsive');
  });

  it('uses LLM for enhancement when configured', async () => {
    const mock = createMockProvider(
      'Create a polished, accessible button component with ' +
        'hover states, ARIA labels, keyboard focus ring, ' +
        'and responsive sizing across breakpoints'
    );
    setPromptEnhancerLLM(mock);

    const result = await enhancePrompt('Create a button', {
      framework: 'react',
      componentType: 'button',
    });

    expect(result.source).toBe('model');
    expect(result.additions).toContain('llm-enhanced');
    expect(mock.generate).toHaveBeenCalledTimes(1);
  });

  it('falls back to rules on LLM error', async () => {
    const mock = createFailingProvider('timeout');
    setPromptEnhancerLLM(mock);

    const result = await enhancePrompt('Create a card');
    expect(result.source).toBe('rules');
    expect(result.enhanced.length).toBeGreaterThan(0);
  });

  it('falls back when LLM returns too-short response', async () => {
    const mock = createMockProvider('ok');
    setPromptEnhancerLLM(mock);

    const result = await enhancePrompt('Create a detailed navigation sidebar with collapsible sections');
    expect(result.source).toBe('rules');
  });

  it('merges a11y hints from rules into LLM output', async () => {
    const mock = createMockProvider('Create a clean navigation menu with smooth transitions');
    setPromptEnhancerLLM(mock);

    const result = await enhancePrompt('Create a nav');
    expect(result.source).toBe('model');
    expect(
      result.enhanced.toLowerCase().includes('aria') ||
        result.enhanced.toLowerCase().includes('keyboard') ||
        result.enhanced.toLowerCase().includes('accessible')
    ).toBe(true);
  });

  it('merges responsive hint when LLM omits it', async () => {
    const mock = createMockProvider('Create an accessible hero section with ARIA labels');
    setPromptEnhancerLLM(mock);

    const result = await enhancePrompt('Create a hero');
    expect(result.source).toBe('model');
    expect(
      result.enhanced.toLowerCase().includes('responsive') || result.enhanced.toLowerCase().includes('mobile')
    ).toBe(true);
  });

  it('passes context fields to LLM prompt', async () => {
    const mock = createMockProvider('A detailed form component with proper validation and labels');
    setPromptEnhancerLLM(mock);

    await enhancePrompt('Create a form', {
      framework: 'react',
      componentType: 'form',
      mood: 'professional',
      industry: 'fintech',
    });

    const callPrompt = (mock.generate as MockFn).mock.calls[0]![0] as string;
    expect(callPrompt).toContain('react');
    expect(callPrompt).toContain('form');
    expect(callPrompt).toContain('professional');
    expect(callPrompt).toContain('fintech');
  });

  it('preserves original prompt in result', async () => {
    const mock = createMockProvider('Enhanced version of the original request');
    setPromptEnhancerLLM(mock);

    const original = 'Build a pricing table';
    const result = await enhancePrompt(original);

    expect(result.original).toBe(original);
  });
});
