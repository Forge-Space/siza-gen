import {
  evaluateTraits,
  calculateCost,
  compareProviders,
  analyzeScoringAccuracy,
  analyzeEnhancementEffectiveness,
} from '../benchmark/evaluator.js';
import type { IExpectedTraits, IBenchmarkResult, IEnhancementResult } from '../benchmark/types.js';

describe('evaluateTraits', () => {
  const allFalse: IExpectedTraits = {
    hasAria: false,
    hasResponsive: false,
    hasDarkMode: false,
    hasSemanticHtml: false,
    hasErrorHandling: false,
    hasKeyboardNav: false,
  };

  it('returns 100% match when no traits expected', () => {
    const result = evaluateTraits('<div>Hello</div>', allFalse);
    expect(result.rate).toBe(1);
    expect(result.total).toBe(0);
  });

  it('detects ARIA attributes', () => {
    const code = '<button aria-label="Close" role="dialog">';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasAria: true,
    });
    expect(result.details.hasAria).toBe(true);
    expect(result.matched).toBe(1);
  });

  it('detects responsive classes', () => {
    const code = '<div className="sm:flex md:grid lg:hidden">';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasResponsive: true,
    });
    expect(result.details.hasResponsive).toBe(true);
  });

  it('detects dark mode', () => {
    const code = '<div className="bg-white dark:bg-gray-900">';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasDarkMode: true,
    });
    expect(result.details.hasDarkMode).toBe(true);
  });

  it('detects semantic HTML elements', () => {
    const code = '<nav><header><main><section></section></main></header></nav>';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasSemanticHtml: true,
    });
    expect(result.details.hasSemanticHtml).toBe(true);
  });

  it('detects error handling patterns', () => {
    const code = 'try { fetch() } catch (error) { setError(error) }';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasErrorHandling: true,
    });
    expect(result.details.hasErrorHandling).toBe(true);
  });

  it('detects keyboard navigation', () => {
    const code = '<input onKeyDown={handleKeyDown} tabIndex={0} />';
    const result = evaluateTraits(code, {
      ...allFalse,
      hasKeyboardNav: true,
    });
    expect(result.details.hasKeyboardNav).toBe(true);
  });

  it('reports missing traits correctly', () => {
    const code = '<div>plain div</div>';
    const result = evaluateTraits(code, {
      hasAria: true,
      hasResponsive: true,
      hasDarkMode: true,
      hasSemanticHtml: false,
      hasErrorHandling: false,
      hasKeyboardNav: false,
    });
    expect(result.matched).toBe(0);
    expect(result.total).toBe(3);
    expect(result.rate).toBe(0);
  });

  it('calculates partial match rate', () => {
    const code = '<nav aria-label="main"><div className="sm:flex">Hello</div></nav>';
    const result = evaluateTraits(code, {
      hasAria: true,
      hasResponsive: true,
      hasDarkMode: true,
      hasSemanticHtml: true,
      hasErrorHandling: false,
      hasKeyboardNav: false,
    });
    expect(result.matched).toBe(3);
    expect(result.total).toBe(4);
    expect(result.rate).toBe(0.75);
  });
});

describe('calculateCost', () => {
  it('returns 0 for Ollama', () => {
    expect(calculateCost('ollama', 1000)).toBe(0);
  });

  it('calculates Anthropic costs correctly', () => {
    const cost = calculateCost('anthropic', 1000, 0.7);
    const expected = (300 / 1_000_000) * 3.0 + (700 / 1_000_000) * 15.0;
    expect(cost).toBeCloseTo(expected, 6);
  });

  it('calculates OpenAI costs correctly', () => {
    const cost = calculateCost('openai', 1000, 0.7);
    const expected = (300 / 1_000_000) * 0.15 + (700 / 1_000_000) * 0.6;
    expect(cost).toBeCloseTo(expected, 6);
  });

  it('calculates Gemini costs correctly', () => {
    const cost = calculateCost('gemini', 1000, 0.7);
    const expected = (300 / 1_000_000) * 0.075 + (700 / 1_000_000) * 0.3;
    expect(cost).toBeCloseTo(expected, 6);
  });

  it('handles zero tokens', () => {
    expect(calculateCost('anthropic', 0)).toBe(0);
  });
});

describe('compareProviders', () => {
  const makeResult = (provider: 'anthropic' | 'openai', score: number, latency: number): IBenchmarkResult => ({
    promptId: 'test-01',
    provider,
    model: provider === 'anthropic' ? 'claude-sonnet' : 'gpt-4o-mini',
    generatedCode: '<div>code</div>',
    scores: {
      heuristic: score,
      llm: score + 0.5,
      blended: score,
      rag: null,
    },
    traitMatch: {
      matched: 3,
      total: 4,
      rate: 0.75,
      details: {
        hasAria: true,
        hasResponsive: true,
        hasDarkMode: false,
        hasSemanticHtml: true,
        hasErrorHandling: false,
        hasKeyboardNav: false,
      },
    },
    latencyMs: latency,
    tokensUsed: 500,
    costUsd: 0.01,
  });

  it('sorts providers by avgScore descending', () => {
    const results = [makeResult('openai', 6.5, 1000), makeResult('anthropic', 7.8, 2000)];
    const metrics = compareProviders(results);
    expect(metrics[0].provider).toBe('anthropic');
    expect(metrics[1].provider).toBe('openai');
  });

  it('calculates error rate correctly', () => {
    const results: IBenchmarkResult[] = [
      makeResult('anthropic', 7, 2000),
      { ...makeResult('anthropic', 0, 0), error: 'timeout' },
    ];
    const metrics = compareProviders(results);
    expect(metrics[0].errorRate).toBe(0.5);
  });

  it('assigns grade based on score', () => {
    const results = [makeResult('anthropic', 8.5, 2000)];
    const metrics = compareProviders(results);
    expect(metrics[0].grade).toBe('A');
  });
});

describe('analyzeScoringAccuracy', () => {
  it('calculates correlation for identical scores', () => {
    const results: IBenchmarkResult[] = [1, 2, 3, 4, 5].map((i) => ({
      promptId: `test-${i}`,
      provider: 'anthropic' as const,
      model: 'claude',
      generatedCode: '',
      scores: { heuristic: i * 2, llm: i * 2, blended: i * 2, rag: null },
      traitMatch: {
        matched: 0,
        total: 0,
        rate: 1,
        details: {
          hasAria: false,
          hasResponsive: false,
          hasDarkMode: false,
          hasSemanticHtml: false,
          hasErrorHandling: false,
          hasKeyboardNav: false,
        },
      },
      latencyMs: 100,
      tokensUsed: 100,
      costUsd: 0,
    }));
    const accuracy = analyzeScoringAccuracy(results);
    expect(accuracy.heuristicVsLlmCorrelation).toBeCloseTo(1.0, 3);
  });

  it('returns 0 correlation when no LLM scores', () => {
    const results: IBenchmarkResult[] = [
      {
        promptId: 'test',
        provider: 'ollama',
        model: 'llama',
        generatedCode: '',
        scores: { heuristic: 5, llm: null, blended: null, rag: null },
        traitMatch: {
          matched: 0,
          total: 0,
          rate: 1,
          details: {
            hasAria: false,
            hasResponsive: false,
            hasDarkMode: false,
            hasSemanticHtml: false,
            hasErrorHandling: false,
            hasKeyboardNav: false,
          },
        },
        latencyMs: 100,
        tokensUsed: 100,
        costUsd: 0,
      },
    ];
    const accuracy = analyzeScoringAccuracy(results);
    expect(accuracy.heuristicVsLlmCorrelation).toBe(0);
  });
});

describe('analyzeEnhancementEffectiveness', () => {
  const makeEnhResult = (source: 'rules' | 'llm' | 'rules+llm', delta: number): IEnhancementResult => ({
    promptId: 'test',
    provider: 'anthropic',
    original: 'make a button',
    enhanced: 'make a button with ARIA labels and responsive design',
    enhancementSource: source,
    scoreBeforeEnhancement: 5,
    scoreAfterEnhancement: 5 + delta,
    scoreDelta: delta,
    latencyMs: 100,
  });

  it('calculates avg delta by source', () => {
    const results = [
      makeEnhResult('rules', 0.5),
      makeEnhResult('rules', 1.0),
      makeEnhResult('llm', 1.5),
      makeEnhResult('rules+llm', 2.0),
    ];
    const eff = analyzeEnhancementEffectiveness(results);
    expect(eff.rulesOnlyAvgDelta).toBeCloseTo(0.75, 2);
    expect(eff.llmOnlyAvgDelta).toBeCloseTo(1.5, 2);
    expect(eff.combinedAvgDelta).toBeCloseTo(2.0, 2);
  });

  it('calculates positive enhancement rate', () => {
    const results = [makeEnhResult('rules', 0.5), makeEnhResult('rules', -0.5), makeEnhResult('llm', 1.0)];
    const eff = analyzeEnhancementEffectiveness(results);
    expect(eff.enhancementRate).toBeCloseTo(2 / 3, 2);
  });

  it('handles empty results', () => {
    const eff = analyzeEnhancementEffectiveness([]);
    expect(eff.rulesOnlyAvgDelta).toBe(0);
    expect(eff.enhancementRate).toBe(0);
  });
});
