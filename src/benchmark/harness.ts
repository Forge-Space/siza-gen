import { createLogger } from '../logger.js';
import type { ILLMProvider, ILLMResponse } from '../llm/types.js';
import type {
  IGoldenPrompt,
  IBenchmarkResult,
  IEnhancementResult,
  IScoringBreakdown,
} from './types.js';
import {
  evaluateTraits,
  calculateCost,
} from './evaluator.js';
import {
  scoreQuality,
  scoreQualityWithRAG,
} from '../ml/quality-scorer.js';
import {
  enhancePrompt,
  enhancePromptWithRAG,
} from '../ml/prompt-enhancer.js';

const logger = createLogger('benchmark');

export interface IBenchmarkOptions {
  timeoutMs?: number;
  maxRetries?: number;
  delayBetweenMs?: number;
  skipScoring?: boolean;
  skipEnhancement?: boolean;
}

const DEFAULT_OPTIONS: Required<IBenchmarkOptions> = {
  timeoutMs: 60_000,
  maxRetries: 1,
  delayBetweenMs: 500,
  skipScoring: false,
  skipEnhancement: false,
};

export class BenchmarkHarness {
  private providers: ILLMProvider[];
  private options: Required<IBenchmarkOptions>;

  constructor(
    providers: ILLMProvider[],
    options?: IBenchmarkOptions,
  ) {
    this.providers = providers;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async runGenerationBenchmark(
    prompts: IGoldenPrompt[],
  ): Promise<IBenchmarkResult[]> {
    const results: IBenchmarkResult[] = [];

    for (const provider of this.providers) {
      const available = await provider.isAvailable();
      if (!available) {
        logger.warn({ provider: provider.type }, 'Provider unavailable, skipping');
        continue;
      }

      for (const prompt of prompts) {
        const result = await this.generateSingle(provider, prompt);
        results.push(result);

        if (this.options.delayBetweenMs > 0) {
          await delay(this.options.delayBetweenMs);
        }
      }
    }

    return results;
  }

  async runScoringBenchmark(
    results: IBenchmarkResult[],
  ): Promise<IBenchmarkResult[]> {
    const scored: IBenchmarkResult[] = [];

    for (const result of results) {
      if (result.error) {
        scored.push(result);
        continue;
      }

      const scores = await this.scoreResult(result);
      scored.push({ ...result, scores });
    }

    return scored;
  }

  async runEnhancementBenchmark(
    prompts: IGoldenPrompt[],
    generationProvider: ILLMProvider,
  ): Promise<IEnhancementResult[]> {
    const results: IEnhancementResult[] = [];
    const available = await generationProvider.isAvailable();
    if (!available) return results;

    for (const prompt of prompts) {
      for (const mode of ['rules', 'llm', 'rules+llm'] as const) {
        const result = await this.enhanceSingle(
          prompt,
          generationProvider,
          mode,
        );
        if (result) results.push(result);
      }
    }

    return results;
  }

  async runAll(
    prompts: IGoldenPrompt[],
  ): Promise<{
    results: IBenchmarkResult[];
    enhancementResults: IEnhancementResult[];
  }> {
    logger.info(
      {
        providers: this.providers.map((p) => p.type),
        prompts: prompts.length,
      },
      'Starting benchmark suite',
    );

    let results = await this.runGenerationBenchmark(prompts);

    if (!this.options.skipScoring) {
      results = await this.runScoringBenchmark(results);
    }

    let enhancementResults: IEnhancementResult[] = [];
    if (
      !this.options.skipEnhancement &&
      this.providers.length > 0
    ) {
      enhancementResults = await this.runEnhancementBenchmark(
        prompts,
        this.providers[0],
      );
    }

    logger.info(
      {
        totalResults: results.length,
        enhancements: enhancementResults.length,
      },
      'Benchmark suite complete',
    );

    return { results, enhancementResults };
  }

  private async generateSingle(
    provider: ILLMProvider,
    prompt: IGoldenPrompt,
  ): Promise<IBenchmarkResult> {
    const systemPrompt =
      'You are a React/TypeScript UI component generator. ' +
      'Generate a single complete functional component using ' +
      'Tailwind CSS. Output ONLY the code, no explanations.';

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const response: ILLMResponse = await provider.generate(
          prompt.prompt,
          {
            systemPrompt,
            maxTokens: 2048,
            temperature: 0.3,
            timeoutMs: this.options.timeoutMs,
          },
        );

        const traitMatch = evaluateTraits(
          response.text,
          prompt.expectedTraits,
        );

        const tokensUsed = response.tokensUsed ?? 0;

        return {
          promptId: prompt.id,
          provider: provider.type,
          model: response.model,
          generatedCode: response.text,
          scores: emptyScores(),
          traitMatch,
          latencyMs: response.latencyMs,
          tokensUsed,
          costUsd: calculateCost(provider.type, tokensUsed),
        };
      } catch (err) {
        if (attempt === this.options.maxRetries) {
          return errorResult(
            prompt.id,
            provider,
            err instanceof Error ? err.message : String(err),
          );
        }
        logger.warn(
          { attempt, provider: provider.type, promptId: prompt.id },
          'Generation failed, retrying',
        );
        await delay(1000);
      }
    }

    return errorResult(prompt.id, provider, 'Max retries exceeded');
  }

  private async scoreResult(
    result: IBenchmarkResult,
  ): Promise<IScoringBreakdown> {
    const params = { componentType: 'component', framework: 'react' };

    try {
      const heuristic = await scoreQuality(
        result.promptId,
        result.generatedCode,
        params,
      );

      let ragScore: number | null = null;
      try {
        const rag = await scoreQualityWithRAG(
          result.promptId,
          result.generatedCode,
          params,
        );
        ragScore = rag.score;
      } catch {
        // RAG scoring requires embeddings — skip if unavailable
      }

      return {
        heuristic: heuristic.score,
        llm:
          heuristic.source === 'model' ? heuristic.score : null,
        blended: heuristic.score,
        rag: ragScore,
      };
    } catch {
      return emptyScores();
    }
  }

  private async enhanceSingle(
    prompt: IGoldenPrompt,
    provider: ILLMProvider,
    mode: 'rules' | 'llm' | 'rules+llm',
  ): Promise<IEnhancementResult | null> {
    try {
      const start = Date.now();
      let enhanced: string;

      if (mode === 'rules') {
        const result = await enhancePrompt(prompt.prompt, {
          componentType: prompt.componentType,
          framework: 'react',
        });
        enhanced = result.enhanced;
      } else if (mode === 'llm') {
        const result = await enhancePromptWithRAG(
          prompt.prompt,
          {
            componentType: prompt.componentType,
            framework: 'react',
          },
        );
        enhanced = result.enhanced;
      } else {
        const rulesResult = await enhancePrompt(prompt.prompt, {
          componentType: prompt.componentType,
          framework: 'react',
        });
        const ragResult = await enhancePromptWithRAG(
          rulesResult.enhanced,
          {
            componentType: prompt.componentType,
            framework: 'react',
          },
        );
        enhanced = ragResult.enhanced;
      }

      const beforeResponse = await provider.generate(
        prompt.prompt,
        {
          systemPrompt:
            'Generate a React/TypeScript component with Tailwind CSS.',
          maxTokens: 2048,
        },
      );
      const beforeScore = await scoreQuality(
        prompt.prompt,
        beforeResponse.text,
      );

      const afterResponse = await provider.generate(enhanced, {
        systemPrompt:
          'Generate a React/TypeScript component with Tailwind CSS.',
        maxTokens: 2048,
      });
      const afterScore = await scoreQuality(
        enhanced,
        afterResponse.text,
      );

      return {
        promptId: prompt.id,
        provider: provider.type,
        original: prompt.prompt,
        enhanced,
        enhancementSource: mode,
        scoreBeforeEnhancement: beforeScore.score,
        scoreAfterEnhancement: afterScore.score,
        scoreDelta: afterScore.score - beforeScore.score,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      logger.warn(
        { promptId: prompt.id, mode, error: String(err) },
        'Enhancement benchmark failed',
      );
      return null;
    }
  }
}

function emptyScores(): IScoringBreakdown {
  return { heuristic: 0, llm: null, blended: null, rag: null };
}

function errorResult(
  promptId: string,
  provider: ILLMProvider,
  error: string,
): IBenchmarkResult {
  return {
    promptId,
    provider: provider.type,
    model: provider.model,
    generatedCode: '',
    scores: emptyScores(),
    traitMatch: {
      matched: 0,
      total: 0,
      rate: 0,
      details: {
        hasAria: false,
        hasResponsive: false,
        hasDarkMode: false,
        hasSemanticHtml: false,
        hasErrorHandling: false,
        hasKeyboardNav: false,
      },
    },
    latencyMs: 0,
    tokensUsed: 0,
    costUsd: 0,
    error,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
