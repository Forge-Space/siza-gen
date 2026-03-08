export { goldenPrompts } from './golden-prompts.js';
export { BenchmarkHarness } from './harness.js';
export type { IBenchmarkOptions } from './harness.js';
export {
  evaluateTraits,
  calculateCost,
  compareProviders,
  analyzeScoringAccuracy,
  analyzeEnhancementEffectiveness,
} from './evaluator.js';
export {
  generateReport,
  formatConsole,
  formatJSON,
} from './reporter.js';
export type {
  IGoldenPrompt,
  IBenchmarkResult,
  IBenchmarkReport,
  IProviderMetrics,
  IScoringAccuracy,
  IEnhancementEffectiveness,
  IEnhancementResult,
  ITraitMatchResult,
  IExpectedTraits,
  IScoringBreakdown,
  ComplexityTier,
} from './types.js';
