import type { LLMProviderType } from '../llm/types.js';
import type {
  IExpectedTraits,
  ITraitMatchResult,
  IBenchmarkResult,
  IProviderMetrics,
  IScoringAccuracy,
  IEnhancementResult,
  IEnhancementEffectiveness,
} from './types.js';

const PRICING: Record<
  LLMProviderType,
  { inputPer1M: number; outputPer1M: number }
> = {
  anthropic: { inputPer1M: 3.0, outputPer1M: 15.0 },
  openai: { inputPer1M: 0.15, outputPer1M: 0.6 },
  gemini: { inputPer1M: 0.075, outputPer1M: 0.3 },
  ollama: { inputPer1M: 0, outputPer1M: 0 },
};

export function evaluateTraits(
  code: string,
  expected: IExpectedTraits,
): ITraitMatchResult {
  const lower = code.toLowerCase();

  const checks: Record<keyof IExpectedTraits, boolean> = {
    hasAria: !expected.hasAria || /aria-|role=/.test(lower),
    hasResponsive:
      !expected.hasResponsive ||
      /\b(sm:|md:|lg:|xl:|@media)/.test(code),
    hasDarkMode:
      !expected.hasDarkMode || /dark:/.test(code),
    hasSemanticHtml:
      !expected.hasSemanticHtml ||
      /<(nav|main|header|footer|section|article|aside|form)\b/.test(
        lower,
      ),
    hasErrorHandling:
      !expected.hasErrorHandling ||
      /(error|catch|try|validation|invalid)/i.test(code),
    hasKeyboardNav:
      !expected.hasKeyboardNav ||
      /(onkeydown|onkeyup|tabindex|focus|keyboard|hotkey)/i.test(
        code,
      ),
  };

  const expectedKeys = (
    Object.keys(expected) as (keyof IExpectedTraits)[]
  ).filter((k) => expected[k]);

  const matched = expectedKeys.filter((k) => checks[k]).length;

  return {
    matched,
    total: expectedKeys.length,
    rate: expectedKeys.length > 0 ? matched / expectedKeys.length : 1,
    details: checks,
  };
}

export function calculateCost(
  provider: LLMProviderType,
  tokensUsed: number,
  outputRatio = 0.7,
): number {
  const pricing = PRICING[provider];
  const inputTokens = tokensUsed * (1 - outputRatio);
  const outputTokens = tokensUsed * outputRatio;
  return (
    (inputTokens / 1_000_000) * pricing.inputPer1M +
    (outputTokens / 1_000_000) * pricing.outputPer1M
  );
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function gradeFromScore(score: number): string {
  if (score >= 9) return 'A+';
  if (score >= 8) return 'A';
  if (score >= 7.5) return 'A-';
  if (score >= 7) return 'B+';
  if (score >= 6.5) return 'B';
  if (score >= 6) return 'B-';
  if (score >= 5.5) return 'C+';
  if (score >= 5) return 'C';
  if (score >= 4) return 'D';
  return 'F';
}

export function compareProviders(
  results: IBenchmarkResult[],
): IProviderMetrics[] {
  const grouped = new Map<LLMProviderType, IBenchmarkResult[]>();
  for (const r of results) {
    const list = grouped.get(r.provider) ?? [];
    list.push(r);
    grouped.set(r.provider, list);
  }

  const metrics: IProviderMetrics[] = [];
  for (const [provider, items] of grouped) {
    const successful = items.filter((r) => !r.error);
    const scores = successful.map(
      (r) => r.scores.blended ?? r.scores.heuristic,
    );
    const latencies = successful
      .map((r) => r.latencyMs)
      .sort((a, b) => a - b);
    const costs = successful.map((r) => r.costUsd);
    const traitRates = successful.map((r) => r.traitMatch.rate);

    const avg = (arr: number[]) =>
      arr.length > 0
        ? arr.reduce((a, b) => a + b, 0) / arr.length
        : 0;

    const avgScore = avg(scores);

    metrics.push({
      provider,
      model: items[0]?.model ?? 'unknown',
      generationCount: items.length,
      avgScore,
      avgLatencyMs: avg(latencies),
      p50LatencyMs: percentile(latencies, 50),
      p95LatencyMs: percentile(latencies, 95),
      avgCostUsd: avg(costs),
      totalCostUsd: costs.reduce((a, b) => a + b, 0),
      traitMatchRate: avg(traitRates),
      errorRate:
        items.length > 0
          ? items.filter((r) => r.error).length / items.length
          : 0,
      grade: gradeFromScore(avgScore),
    });
  }

  return metrics.sort((a, b) => b.avgScore - a.avgScore);
}

export function analyzeScoringAccuracy(
  results: IBenchmarkResult[],
): IScoringAccuracy {
  const withLlm = results.filter((r) => r.scores.llm !== null);
  const withRag = results.filter((r) => r.scores.rag !== null);

  const heuristicScores = withLlm.map((r) => r.scores.heuristic);
  const llmScores = withLlm.map((r) => r.scores.llm!);

  return {
    heuristicVsLlmCorrelation: pearsonCorrelation(
      heuristicScores,
      llmScores,
    ),
    heuristicAvgDelta: avgDelta(
      heuristicScores,
      llmScores,
    ),
    llmAvgDelta: avgDelta(llmScores, heuristicScores),
    ragImpactAvgDelta:
      withRag.length > 0
        ? avg(
            withRag.map(
              (r) => (r.scores.rag ?? 0) - r.scores.heuristic,
            ),
          )
        : 0,
  };
}

export function analyzeEnhancementEffectiveness(
  enhResults: IEnhancementResult[],
): IEnhancementEffectiveness {
  const bySource = (s: string) =>
    enhResults.filter((r) => r.enhancementSource === s);

  const avgDeltaForSource = (s: string) => {
    const items = bySource(s);
    return items.length > 0
      ? avg(items.map((r) => r.scoreDelta))
      : 0;
  };

  return {
    rulesOnlyAvgDelta: avgDeltaForSource('rules'),
    llmOnlyAvgDelta: avgDeltaForSource('llm'),
    combinedAvgDelta: avgDeltaForSource('rules+llm'),
    enhancementRate:
      enhResults.length > 0
        ? enhResults.filter((r) => r.scoreDelta > 0).length /
          enhResults.length
        : 0,
  };
}

function avg(arr: number[]): number {
  return arr.length > 0
    ? arr.reduce((a, b) => a + b, 0) / arr.length
    : 0;
}

function avgDelta(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  return avg(a.map((v, i) => v - b[i]));
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return 0;

  const mx = avg(x);
  const my = avg(y);

  let num = 0;
  let dx2 = 0;
  let dy2 = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }

  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}
