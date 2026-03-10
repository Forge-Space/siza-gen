import type { LLMProviderType } from '../llm/types.js';

export type ComplexityTier = 'simple' | 'medium' | 'complex' | 'a11y-focused' | 'ai-specific';

export interface IExpectedTraits {
  hasAria: boolean;
  hasResponsive: boolean;
  hasDarkMode: boolean;
  hasSemanticHtml: boolean;
  hasErrorHandling: boolean;
  hasKeyboardNav: boolean;
}

export interface IGoldenPrompt {
  id: string;
  prompt: string;
  componentType: string;
  complexity: ComplexityTier;
  expectedTraits: IExpectedTraits;
  minAcceptableScore: number;
}

export interface IScoringBreakdown {
  heuristic: number;
  llm: number | null;
  blended: number | null;
  rag: number | null;
}

export interface ITraitMatchResult {
  matched: number;
  total: number;
  rate: number;
  details: Record<keyof IExpectedTraits, boolean>;
}

export interface IBenchmarkResult {
  promptId: string;
  provider: LLMProviderType;
  model: string;
  generatedCode: string;
  scores: IScoringBreakdown;
  traitMatch: ITraitMatchResult;
  latencyMs: number;
  tokensUsed: number;
  costUsd: number;
  error?: string;
}

export interface IEnhancementResult {
  promptId: string;
  provider: LLMProviderType;
  original: string;
  enhanced: string;
  enhancementSource: 'rules' | 'llm' | 'rules+llm';
  scoreBeforeEnhancement: number;
  scoreAfterEnhancement: number;
  scoreDelta: number;
  latencyMs: number;
}

export interface IProviderMetrics {
  provider: LLMProviderType;
  model: string;
  generationCount: number;
  avgScore: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  avgCostUsd: number;
  totalCostUsd: number;
  traitMatchRate: number;
  errorRate: number;
  grade: string;
}

export interface IScoringAccuracy {
  heuristicVsLlmCorrelation: number;
  heuristicAvgDelta: number;
  llmAvgDelta: number;
  ragImpactAvgDelta: number;
}

export interface IEnhancementEffectiveness {
  rulesOnlyAvgDelta: number;
  llmOnlyAvgDelta: number;
  combinedAvgDelta: number;
  enhancementRate: number;
}

export interface IBenchmarkReport {
  metadata: {
    date: string;
    sizaGenVersion: string;
    promptCount: number;
    providerCount: number;
    totalGenerations: number;
    durationMs: number;
  };
  results: IBenchmarkResult[];
  providerMetrics: IProviderMetrics[];
  scoringAccuracy: IScoringAccuracy;
  enhancementEffectiveness: IEnhancementEffectiveness;
  enhancementResults: IEnhancementResult[];
}
