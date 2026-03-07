import { searchComponents } from '../../registry/component-registry/index.js';
import type {
  MoodTag,
  IndustryTag,
  VisualStyleId,
  IComponentSnippet,
} from '../../registry/component-registry/types.js';

interface IExamplesSectionParams {
  componentType?: string;
  mood?: MoodTag;
  industry?: IndustryTag;
  visualStyle?: VisualStyleId;
  maxExamples: number;
  tokenBudget: number;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function formatSnippet(snippet: IComponentSnippet): string {
  const meta: string[] = [];
  if (snippet.quality?.antiGeneric?.length) {
    meta.push(`Design: ${snippet.quality.antiGeneric.join(', ')}`);
  }
  if (snippet.quality?.craftDetails?.length) {
    meta.push(`Craft: ${snippet.quality.craftDetails.join(', ')}`);
  }
  if (snippet.quality?.inspirationSource) {
    meta.push(`Inspired by: ${snippet.quality.inspirationSource}`);
  }
  const header = `// ${snippet.name} (${snippet.type}/${snippet.variant})`;
  const annotations = meta.length ? `// ${meta.join(' | ')}` : '';
  const code = snippet.jsx.length > 1200 ? `${snippet.jsx.slice(0, 1200)}\n// ... (truncated)` : snippet.jsx;
  return [header, annotations, code].filter(Boolean).join('\n');
}

export function buildExamplesSection(params: IExamplesSectionParams): string {
  const results = searchComponents({
    type: params.componentType,
    mood: params.mood,
    industry: params.industry,
    style: params.visualStyle,
  });

  if (results.length === 0) return '';

  const examples: string[] = [];
  let usedTokens = 0;
  const headerTokens = estimateTokens('Reference examples (match this quality level):\n');
  usedTokens += headerTokens;

  for (const result of results.slice(0, params.maxExamples)) {
    const formatted = formatSnippet(result.snippet);
    const cost = estimateTokens(formatted);
    if (usedTokens + cost > params.tokenBudget) break;
    examples.push(formatted);
    usedTokens += cost;
  }

  if (examples.length === 0) return '';

  return `Reference examples (match this quality level):\n${examples.join('\n\n')}`;
}
