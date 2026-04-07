// LLM Providers
export * from './llm/index.js';

// ML / AI
export * from './ml/index.js';

// Generators
export { GeneratorFactory, generateComponent } from './generators/generator-factory.js';
export type { GeneratorConstructor } from './generators/generator-factory.js';
export { BaseGenerator, type ComponentLibrary } from './generators/base-generator.js';
export { DEFAULT_DESIGN_CONTEXT } from './generators/default-design-context.js';
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
  IComponentA11y,
  IComponentQuality,
  IComponentResponsive,
  IComponentSeo,
} from './registry/component-registry/types.js';

// Backend Registry
export { initializeBackendRegistry, searchBackendSnippets } from './registry/backend-registry/index.js';
export type {
  BackendCategory,
  BackendFramework,
  IBackendSnippet,
  BackendPattern,
  IBackendQuality,
} from './registry/backend-registry/types.js';

// Database
export { getDatabase, closeDatabase } from './registry/database/store.js';

// Registry Presets, Design References & Component Libraries
export * from './registry/index.js';
export {
  COMPONENT_LIBRARIES,
  getComponentLibrariesForFramework,
  getRecommendedLibrary,
} from './registry/component-libraries.js';

// Template Compositions
export {
  findBestComposition,
  composePageFromTemplate,
  registerComposition,
  getComposition,
  clearCompositions,
  getAllCompositions,
} from './registry/template-compositions/index.js';
export type {
  IFindOptions,
  IComposedPage,
  IComposedSection,
  IComposeOptions,
  IPageComposition,
  IPageSection,
} from './registry/template-compositions/index.js';

// Template Packs
export { registerPack, getPack, getAllPacks, searchPacks } from './registry/template-packs/index.js';
export type { ITemplatePack } from './registry/template-packs/types.js';

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
export type { AnimationCategory, AnimationPurpose } from './registry/micro-interactions/index.js';
export type { IMicroInteraction } from './registry/component-registry/types.js';

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
export { designContextStore, DEFAULT_CONTEXT, DesignContextStore } from './design-context.js';

// Brand Identity Transform
export { brandToDesignContext, type BrandIdentityInput } from './brand-identity-transform.js';

// Component Libraries
export {
  getAvailableComponentLibraries,
  setupComponentLibraryProject,
  generateComponentFromLibrary,
  getComponentLibrary,
  getAvailableComponentsForLibrary,
  getAvailablePatternsForLibrary,
  type ComponentLibraryIntegration,
  type ComponentLibrarySetupOptions,
} from './component-libraries/index.js';

// Shared Types
export type {
  Framework,
  IGeneratedFile,
  IDesignContext,
  Architecture,
  StateManagement,
  PageTemplateType,
  ImageType,
  ComponentLibraryId,
  IScreenElement,
  ITransition,
  IFigmaVariable,
  IAccessibilityIssue,
  IAccessibilityReport,
  IScrapedPage,
  IImageAnalysis,
  IDesignAnalysisResult,
  IComponentLibrary,
  IFigmaDesignToken,
  ITailwindMapping,
  IPatternMatch,
  AccessibilitySeverity,
  IAnimationPreset,
  IButtonVariant,
  IColorSystem,
  IFontPairing,
  IIconLibrary,
  IInspirationSource,
  ILayoutPattern,
  ISpacingSystem,
} from './types.js';

// Config & Logger
export { loadConfig, getConfig, safeJSONParse, configSchema, type Config } from './config.js';
export { createLogger, logger } from './logger.js';

// Context Assembler
export { assembleContext } from './context/index.js';
export type { IContextAssemblerParams, IAssembledContext, IContextMetadata } from './context/index.js';

// Utils
export * from './utils/index.js';
