import { BenchmarkHarness } from '../benchmark/harness.js';
import type { ILLMProvider, ILLMResponse } from '../llm/types.js';
import type { IGoldenPrompt } from '../benchmark/types.js';

function createMockProvider(
  type: 'anthropic' | 'openai' | 'ollama' | 'gemini',
  opts?: { available?: boolean; failOnGenerate?: boolean },
): ILLMProvider {
  const available = opts?.available ?? true;
  const failOnGenerate = opts?.failOnGenerate ?? false;

  return {
    type,
    model: `${type}-test-model`,
    async isAvailable() {
      return available;
    },
    async generate(prompt: string): Promise<ILLMResponse> {
      if (failOnGenerate) {
        throw new Error(`${type} generation failed`);
      }
      return {
        text:
          '<nav aria-label="main">\n' +
          '  <div className="sm:flex dark:bg-gray-900">\n' +
          '    <button onKeyDown={handleKey} tabIndex={0}>\n' +
          '      {error && <span>Error occurred</span>}\n' +
          '    </button>\n' +
          '  </div>\n' +
          '</nav>',
        model: `${type}-test-model`,
        provider: type,
        tokensUsed: 500,
        latencyMs: 1000,
      };
    },
  };
}

const testPrompt: IGoldenPrompt = {
  id: 'test-01',
  prompt: 'A button with loading state',
  componentType: 'button',
  complexity: 'simple',
  expectedTraits: {
    hasAria: true,
    hasResponsive: true,
    hasDarkMode: false,
    hasSemanticHtml: true,
    hasErrorHandling: false,
    hasKeyboardNav: false,
  },
  minAcceptableScore: 6,
};

describe('BenchmarkHarness', () => {
  describe('runGenerationBenchmark', () => {
    it('generates results for each provider × prompt', async () => {
      const harness = new BenchmarkHarness(
        [
          createMockProvider('anthropic'),
          createMockProvider('openai'),
        ],
        { delayBetweenMs: 0, skipScoring: true },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].provider).toBe('anthropic');
      expect(results[1].provider).toBe('openai');
    });

    it('skips unavailable providers', async () => {
      const harness = new BenchmarkHarness(
        [
          createMockProvider('anthropic', { available: false }),
          createMockProvider('openai'),
        ],
        { delayBetweenMs: 0 },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results).toHaveLength(1);
      expect(results[0].provider).toBe('openai');
    });

    it('records error on generation failure', async () => {
      const harness = new BenchmarkHarness(
        [
          createMockProvider('anthropic', {
            failOnGenerate: true,
          }),
        ],
        { delayBetweenMs: 0, maxRetries: 0 },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results).toHaveLength(1);
      expect(results[0].error).toContain('generation failed');
      expect(results[0].generatedCode).toBe('');
    });

    it('evaluates trait matches on generated code', async () => {
      const harness = new BenchmarkHarness(
        [createMockProvider('anthropic')],
        { delayBetweenMs: 0 },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results[0].traitMatch.details.hasAria).toBe(true);
      expect(results[0].traitMatch.details.hasResponsive).toBe(
        true,
      );
      expect(results[0].traitMatch.details.hasSemanticHtml).toBe(
        true,
      );
    });

    it('calculates cost based on tokens', async () => {
      const harness = new BenchmarkHarness(
        [createMockProvider('anthropic')],
        { delayBetweenMs: 0 },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results[0].tokensUsed).toBe(500);
      expect(results[0].costUsd).toBeGreaterThan(0);
    });

    it('captures latency from provider response', async () => {
      const harness = new BenchmarkHarness(
        [createMockProvider('openai')],
        { delayBetweenMs: 0 },
      );

      const results = await harness.runGenerationBenchmark([
        testPrompt,
      ]);

      expect(results[0].latencyMs).toBe(1000);
    });
  });

  describe('runAll', () => {
    it('returns both generation and enhancement results', async () => {
      const harness = new BenchmarkHarness(
        [createMockProvider('anthropic')],
        {
          delayBetweenMs: 0,
          skipScoring: true,
          skipEnhancement: true,
        },
      );

      const { results, enhancementResults } =
        await harness.runAll([testPrompt]);

      expect(results.length).toBeGreaterThan(0);
      expect(enhancementResults).toEqual([]);
    });

    it('handles zero providers gracefully', async () => {
      const harness = new BenchmarkHarness([], {
        delayBetweenMs: 0,
        skipScoring: true,
        skipEnhancement: true,
      });

      const { results } = await harness.runAll([testPrompt]);
      expect(results).toHaveLength(0);
    });
  });
});

describe('goldenPrompts', () => {
  it('exports 20 prompts', async () => {
    const { goldenPrompts } = await import(
      '../benchmark/golden-prompts.js'
    );
    expect(goldenPrompts).toHaveLength(20);
  });

  it('has unique IDs', async () => {
    const { goldenPrompts } = await import(
      '../benchmark/golden-prompts.js'
    );
    const ids = goldenPrompts.map(
      (p: IGoldenPrompt) => p.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers all 5 complexity tiers', async () => {
    const { goldenPrompts } = await import(
      '../benchmark/golden-prompts.js'
    );
    const tiers = new Set(
      goldenPrompts.map((p: IGoldenPrompt) => p.complexity),
    );
    expect(tiers.size).toBe(5);
  });

  it('has 4 prompts per tier', async () => {
    const { goldenPrompts } = await import(
      '../benchmark/golden-prompts.js'
    );
    const counts = new Map<string, number>();
    for (const p of goldenPrompts) {
      counts.set(
        p.complexity,
        (counts.get(p.complexity) ?? 0) + 1,
      );
    }
    for (const [, count] of counts) {
      expect(count).toBe(4);
    }
  });
});
