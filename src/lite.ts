import type { MoodTag, IndustryTag, VisualStyleId } from './registry/component-registry/types.js';
import { buildRoleSection } from './context/sections/role-section.js';
import { buildQualityRulesSection } from './context/sections/quality-rules-section.js';
import { buildFrameworkSection } from './context/sections/framework-section.js';
import { buildLibrarySection } from './context/sections/library-section.js';
import { buildA11ySection } from './context/sections/a11y-section.js';

export interface IContextAssemblerParams {
  framework: string;
  componentType?: string;
  componentLibrary?: string;
  mood?: MoodTag;
  industry?: IndustryTag;
  visualStyle?: VisualStyleId;
  tokenBudget?: number;
  maxExamples?: number;
}

export interface IAssembledContext {
  systemPrompt: string;
  tokenEstimate: number;
  examplesIncluded: number;
  sectionsIncluded: string[];
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function assembleContext(
  params: IContextAssemblerParams
): IAssembledContext {
  const budget = params.tokenBudget ?? 4000;
  const sections: Array<{ name: string; text: string }> = [];
  let usedTokens = 0;

  const builders: Array<{ name: string; build: () => string }> = [
    { name: 'role', build: () => buildRoleSection(params.framework) },
    { name: 'quality-rules', build: buildQualityRulesSection },
    {
      name: 'framework',
      build: () => buildFrameworkSection(params.framework),
    },
    {
      name: 'library',
      build: () => buildLibrarySection(params.componentLibrary),
    },
    { name: 'a11y', build: buildA11ySection },
  ];

  for (const builder of builders) {
    const text = builder.build();
    if (!text) continue;
    const cost = estimateTokens(text);
    if (usedTokens + cost > budget) continue;
    sections.push({ name: builder.name, text });
    usedTokens += cost;
  }

  const systemPrompt = sections.map((s) => s.text).join('\n\n');

  return {
    systemPrompt,
    tokenEstimate: estimateTokens(systemPrompt),
    examplesIncluded: 0,
    sectionsIncluded: sections.map((s) => s.name),
  };
}

export { brandToDesignContext, type BrandIdentityInput } from './brand-identity-transform.js';

export { designContextStore, DEFAULT_CONTEXT } from './design-context.js';

export type {
  Framework,
  IDesignContext,
  Architecture,
  StateManagement,
  ComponentLibraryId,
} from './types.js';

export type {
  MoodTag,
  IndustryTag,
  VisualStyleId,
} from './registry/component-registry/types.js';
