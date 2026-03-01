import type { MoodTag, IndustryTag, VisualStyleId } from '../registry/component-registry/types.js';
import { buildRoleSection } from './sections/role-section.js';
import { buildQualityRulesSection } from './sections/quality-rules-section.js';
import { buildFrameworkSection } from './sections/framework-section.js';
import { buildLibrarySection } from './sections/library-section.js';
import { buildA11ySection } from './sections/a11y-section.js';
import { buildExamplesSection } from './sections/examples-section.js';

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

export function assembleContext(params: IContextAssemblerParams): IAssembledContext {
  const budget = params.tokenBudget ?? 4000;
  const maxExamples = params.maxExamples ?? 3;
  const sections: Array<{ name: string; text: string }> = [];
  let usedTokens = 0;

  const fixedBuilders: Array<{
    name: string;
    build: () => string;
  }> = [
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

  for (const builder of fixedBuilders) {
    const text = builder.build();
    if (!text) continue;
    const cost = estimateTokens(text);
    if (usedTokens + cost > budget) continue;
    sections.push({ name: builder.name, text });
    usedTokens += cost;
  }

  const remainingBudget = budget - usedTokens;
  let examplesIncluded = 0;

  if (remainingBudget > 100) {
    const examplesText = buildExamplesSection({
      componentType: params.componentType,
      mood: params.mood,
      industry: params.industry,
      visualStyle: params.visualStyle,
      maxExamples,
      tokenBudget: remainingBudget,
    });
    if (examplesText) {
      sections.push({ name: 'examples', text: examplesText });
      const exampleMatches = examplesText.match(/^\/\/ .+ \(.+\)$/gm);
      examplesIncluded = exampleMatches?.length ?? 0;
    }
  }

  const systemPrompt = sections.map((s) => s.text).join('\n\n');

  return {
    systemPrompt,
    tokenEstimate: estimateTokens(systemPrompt),
    examplesIncluded,
    sectionsIncluded: sections.map((s) => s.name),
  };
}
