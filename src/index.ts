// ML / AI
export * from './ml/index.js';

// Generators
export { GeneratorFactory } from './generators/generator-factory.js';
export { BaseGenerator } from './generators/base-generator.js';
export { ReactGenerator } from './generators/react-generator.js';
export { VueGenerator } from './generators/vue-generator.js';
export { AngularGenerator } from './generators/angular-generator.js';
export { SvelteGenerator } from './generators/svelte-generator.js';
export { HtmlGenerator } from './generators/html-generator.js';

// Component Registry
export {
  registerSnippet,
  clearRegistry,
  registerSnippets,
  getSnippetById,
  getRegistrySize,
  getAllSnippets,
  searchComponents,
  getVariants,
  getAvailableTypes,
  getByCategory,
  getByMood,
  getByIndustry,
  applyVisualStyle,
  injectAnimations,
  composeSection,
  getBestMatch,
  getBestMatchWithFeedback,
  triggerPatternPromotion,
} from './registry/component-registry/index.js';

export { initializeRegistry } from './registry/component-registry/init.js';

export type {
  IComponentSnippet,
  IComponentQuery,
  ISearchResult,
  ComponentCategory,
  MoodTag,
  IndustryTag,
  VisualStyleId,
} from './registry/component-registry/types.js';

// Backend Registry
export { initializeBackendRegistry, searchBackendSnippets } from './registry/backend-registry/index.js';

// Template Compositions
export {
  findBestComposition,
  composePageFromTemplate,
  registerComposition,
  getComposition,
  clearCompositions,
  getAllCompositions,
} from './registry/template-compositions/index.js';

// Template Packs
export { registerPack, getPack, getAllPacks, searchPacks } from './registry/template-packs/index.js';

// Micro-interactions
export {
  registerInteraction,
  registerInteractions,
  getMicroInteraction,
  getInteractionsByCategory,
  getAllInteractions,
  clearAllMicroInteractions,
  initializeInteractions,
} from './registry/micro-interactions/index.js';

// Scaffold Templates
export * from './registry/scaffold-templates/index.js';

// Feedback
export {
  recordGeneration,
  recordExplicitFeedback,
  getAggregateScore,
  getFeedbackCount,
  getFeedbackStats,
  exportTrainingData,
  clearSessionCache,
} from './feedback/feedback-tracker.js';

export { feedbackBoostedSearch, getFeedbackBoost } from './feedback/feedback-boosted-search.js';

export {
  ensurePatternsTable,
  recordPattern,
  getPromotablePatternsFromDb,
  promotePattern,
  runPromotionCycle,
  getPatternStats,
} from './feedback/pattern-promotion.js';

export { classifyPromptPair, classifyPromptText } from './feedback/prompt-classifier.js';
export { extractSkeleton, hashSkeleton, fingerprint, isPromotable } from './feedback/pattern-detector.js';

export type {
  IGeneration,
  IFeedback,
  ICodePattern,
  IImplicitSignal,
  IExplicitFeedbackInput,
  IPromptClassification,
} from './feedback/types.js';

// Quality
export { validateSnippet, validateSnippetStrict, type IValidationResult } from './quality/anti-generic-rules.js';
export {
  recordGeneration as recordDiversityGeneration,
  isDuplicateConsecutive,
  suggestDiverseVariant,
  clearHistory as clearDiversityHistory,
} from './quality/diversity-tracker.js';

// Artifacts
export * from './artifacts/index.js';

// Design Context
export { designContextStore, DEFAULT_CONTEXT } from './design-context.js';

// Shared Types
export type {
  Framework,
  IGeneratedFile,
  IDesignContext,
  Architecture,
  StateManagement,
} from './types.js';

// Config & Logger
export { loadConfig, getConfig, safeJSONParse, type Config } from './config.js';
export { createLogger } from './logger.js';

// Utils
export * from './utils/index.js';
