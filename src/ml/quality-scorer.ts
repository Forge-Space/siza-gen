/**
 * Quality scorer — predicts whether generated code will be accepted by the user.
 *
 * Uses the sidecar model when available, otherwise falls back to
 * heuristic scoring based on code structure analysis.
 *
 * Score range: 0-10 (0 = likely rejected, 10 = likely accepted).
 */

import { createLogger } from '../logger.js';
import type { ILLMProvider } from '../llm/types.js';
import { embed } from './embeddings.js';
import { semanticSearch, getEmbeddingCount } from './embedding-store.js';
import { getDatabase } from '../registry/database/store.js';
import { isSidecarAvailable, sidecarScoreQuality } from './sidecar-client.js';

const logger = createLogger('quality-scorer');

let llmProvider: ILLMProvider | null = null;

export function setQualityScorerLLM(provider: ILLMProvider | null): void {
  llmProvider = provider;
}

export function getQualityScorerLLM(): ILLMProvider | null {
  return llmProvider;
}

/** Quality score result. */
export interface IQualityScore {
  /** Score from 0-10. */
  score: number;
  /** Confidence in the score (0-1). */
  confidence: number;
  /** Whether the score came from the model or heuristics. */
  source: 'model' | 'heuristic';
  /** Breakdown of heuristic factors (when source is 'heuristic'). */
  factors?: Record<string, number>;
  /** Inference latency in ms. */
  latencyMs: number;
}

/**
 * Score the quality of generated code.
 *
 * When the sidecar model is loaded, uses it for prediction.
 * Otherwise, applies structural heuristics.
 */
// Configurable weights for quality scoring factors
export const QUALITY_WEIGHTS = {
  length: 1.0,
  accessibility: 1.5,
  semanticHTML: 1.2,
  styling: 1.0,
  responsiveness: 1.3,
  completeness: 1.4,
};

export async function scoreQuality(
  prompt: string,
  generatedCode: string,
  params?: {
    componentType?: string;
    framework?: string;
    style?: string;
  }
): Promise<IQualityScore> {
  const start = Date.now();
  const heuristic = scoreWithHeuristics(prompt, generatedCode, params, start);

  try {
    if (await isSidecarAvailable()) {
      const result = await sidecarScoreQuality(
        prompt, generatedCode, params?.componentType, params?.framework
      );
      return blendScores(heuristic, {
        score: result.score,
        confidence: result.confidence,
        source: 'model',
        latencyMs: Date.now() - start,
      }, start);
    }
  } catch (err) {
    logger.debug({ error: (err as Error).message }, 'Sidecar scoring failed');
  }

  if (!llmProvider) return heuristic;

  try {
    const llmScore = await scoreWithLLM(prompt, generatedCode, params, start);
    return blendScores(heuristic, llmScore, start);
  } catch (err) {
    logger.debug({ error: (err as Error).message }, 'LLM scoring failed, using heuristic');
    return heuristic;
  }
}

const LLM_SCORE_TIMEOUT_MS = 10_000;
const LLM_WEIGHT = 0.6;
const HEURISTIC_WEIGHT = 0.4;

async function scoreWithLLM(
  prompt: string,
  generatedCode: string,
  params:
    | {
        componentType?: string;
        framework?: string;
        style?: string;
      }
    | undefined,
  start: number
): Promise<IQualityScore> {
  const codeSnippet = generatedCode.slice(0, 2000);
  const evalPrompt = [
    'Rate this generated UI code on a scale of 0-10.',
    'Evaluate: security, accessibility, semantic HTML,',
    'responsiveness, code structure, and prompt alignment.',
    'Respond with ONLY a JSON object:',
    '{"score":N,"reasoning":"brief"}',
    '',
    `User prompt: ${prompt.slice(0, 200)}`,
    `Component: ${params?.componentType ?? 'unknown'}`,
    `Framework: ${params?.framework ?? 'unknown'}`,
    '',
    '```',
    codeSnippet,
    '```',
  ].join('\n');

  const result = await llmProvider!.generate(evalPrompt, {
    maxTokens: 64,
    temperature: 0.1,
    timeoutMs: LLM_SCORE_TIMEOUT_MS,
  });

  const parsed = parseLLMScore(result.text);
  if (parsed === null) {
    throw new Error('LLM score unparseable');
  }

  return {
    score: parsed,
    confidence: 0.8,
    source: 'model',
    latencyMs: Date.now() - start,
  };
}

function parseLLMScore(text: string): number | null {
  const jsonMatch = text.match(/\{[^}]*"score"\s*:\s*([\d.]+)/);
  if (jsonMatch) {
    const val = parseFloat(jsonMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      return Math.round(val * 10) / 10;
    }
  }

  const numMatch = text.trim().match(/^(\d+\.?\d*)$/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      return Math.round(val * 10) / 10;
    }
  }

  return null;
}

function blendScores(heuristic: IQualityScore, llm: IQualityScore, start: number): IQualityScore {
  const blended = LLM_WEIGHT * llm.score + HEURISTIC_WEIGHT * heuristic.score;

  return {
    score: Math.round(blended * 10) / 10,
    confidence: Math.min(0.9, LLM_WEIGHT * llm.confidence + HEURISTIC_WEIGHT * heuristic.confidence),
    source: 'model',
    factors: {
      ...heuristic.factors,
      llmScore: llm.score,
      heuristicScore: heuristic.score,
    },
    latencyMs: Date.now() - start,
  };
}

/**
 * Score using structural heuristics.
 * Analyzes code structure, accessibility markers, and completeness.
 */
function scoreWithHeuristics(
  prompt: string,
  generatedCode: string,
  params: { componentType?: string; framework?: string; style?: string } | undefined,
  start: number
): IQualityScore {
  const factors: Record<string, number> = {};
  let total = 0;
  let maxPossible = 0;

  // Factor 1: Code length (too short = incomplete, too long = bloated)
  const len = generatedCode.length;
  if (len < 50) {
    factors.length = 0;
  } else if (len < 200) {
    factors.length = 0.5;
  } else if (len < 5000) {
    factors.length = 1.0;
  } else {
    factors.length = 0.7;
  }
  total += factors.length;
  maxPossible += 1;

  // Factor 2: Accessibility markers
  const a11yMarkers = [/aria-/i, /role=/i, /alt=/i, /tabIndex/i, /sr-only/i, /<label/i, /htmlFor/i];
  const a11yScore = a11yMarkers.filter((r) => r.test(generatedCode)).length / a11yMarkers.length;
  factors.accessibility = a11yScore;
  total += a11yScore;
  maxPossible += 1;

  // Factor 3: Semantic HTML
  const semanticTags = ['<header', '<main', '<nav', '<section', '<article', '<footer', '<aside'];
  const semanticCount = semanticTags.filter((t) => generatedCode.includes(t)).length;
  factors.semanticHtml = Math.min(1.0, semanticCount / 3);
  total += factors.semanticHtml;
  maxPossible += 1;

  // Factor 4: Tailwind usage (if expected)
  if (generatedCode.includes('className') || generatedCode.includes('class=')) {
    const tailwindPatterns = [/\bflex\b/, /\bgrid\b/, /\bp-\d/, /\bm-\d/, /\btext-/, /\bbg-/, /\brounded/];
    const twScore = tailwindPatterns.filter((r) => r.test(generatedCode)).length / tailwindPatterns.length;
    factors.tailwind = twScore;
    total += twScore;
    maxPossible += 1;
  }

  // Factor 5: Component structure (exports, props)
  const structureMarkers = [/export\s+(default\s+)?function/, /interface\s+\w+Props/, /return\s*\(/, /import\s+/];
  const structScore = structureMarkers.filter((r) => r.test(generatedCode)).length / structureMarkers.length;
  factors.structure = structScore;
  total += structScore;
  maxPossible += 1;

  // Factor 6: Responsive design
  const responsiveMarkers = [/\bsm:/, /\bmd:/, /\blg:/, /\bxl:/, /@media/];
  const respScore = responsiveMarkers.filter((r) => r.test(generatedCode)).length / responsiveMarkers.length;
  factors.responsive = respScore;
  total += respScore;
  maxPossible += 1;

  // Factor 7: Dark mode support
  if (generatedCode.includes('dark:')) {
    factors.darkMode = 1.0;
  } else {
    factors.darkMode = 0;
  }
  total += factors.darkMode;
  maxPossible += 1;

  // Factor 8: Prompt alignment — check if component type appears in code
  if (params?.componentType) {
    const typeInCode = generatedCode.toLowerCase().includes(params.componentType.toLowerCase());
    factors.promptAlignment = typeInCode ? 1.0 : 0.3;
  } else {
    factors.promptAlignment = 0.5;
  }
  total += factors.promptAlignment;
  maxPossible += 1;

  const normalizedScore = maxPossible > 0 ? (total / maxPossible) * 10 : 5;

  return {
    score: Math.round(normalizedScore * 10) / 10,
    confidence: 0.5,
    source: 'heuristic',
    factors,
    latencyMs: Date.now() - start,
  };
}

/**
 * Enhanced quality scoring with RAG-based a11y compliance checks.
 * Retrieves relevant axe-core rules and checks violations against them.
 */
export async function scoreQualityWithRAG(
  prompt: string,
  generatedCode: string,
  params?: { componentType?: string; framework?: string; style?: string }
): Promise<IQualityScore> {
  const start = Date.now();

  const baseScore = await scoreQuality(prompt, generatedCode, params);

  try {
    const db = getDatabase();
    const ruleCount = getEmbeddingCount('rule', db);

    if (ruleCount === 0) return baseScore;

    const codeSnippet = generatedCode.slice(0, 500);
    const queryVector = await embed(codeSnippet);
    const relevantRules = semanticSearch(queryVector, 'rule', db, 10, 0.3);

    if (relevantRules.length === 0) return baseScore;

    let violations = 0;
    const checkedRules: string[] = [];

    for (const rule of relevantRules) {
      const ruleId = rule.text.match(/a11y rule ([^:]+)/)?.[1] ?? '';
      checkedRules.push(ruleId);

      if (ruleId === 'image-alt' && /<img/i.test(generatedCode) && !/alt=/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'button-name' && /<button[^>]*>\s*<\/button>/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'label' && /<input/i.test(generatedCode) && !/aria-label|<label/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'color-contrast' && /text-gray-[23]00/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'html-has-lang' && /<html/i.test(generatedCode) && !/lang=/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'heading-order') {
        const headings = [...generatedCode.matchAll(/<h([1-6])/gi)].map((m) => parseInt(m[1], 10));
        for (let i = 1; i < headings.length; i++) {
          if (headings[i] > headings[i - 1] + 1) {
            violations++;
            break;
          }
        }
      }
      if (ruleId === 'link-name' && /<a[^>]*>\s*<\/a>/i.test(generatedCode)) {
        violations++;
      }
      if (ruleId === 'tabindex' && /tabindex=["'][1-9]/i.test(generatedCode)) {
        violations++;
      }
    }

    const ragDeduction = Math.min(3, violations * 0.5);
    const ragScore = Math.max(0, baseScore.score - ragDeduction);
    const ragConfidence = Math.min(0.85, baseScore.confidence + 0.2);

    const ragFactors = {
      ...baseScore.factors,
      ragA11yCompliance: Math.max(0, 1 - violations / Math.max(1, relevantRules.length)),
      ragRulesChecked: relevantRules.length,
      ragViolations: violations,
    };

    return {
      score: Math.round(ragScore * 10) / 10,
      confidence: ragConfidence,
      source: 'heuristic',
      factors: ragFactors,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    logger.warn({ error: (err as Error).message }, 'RAG quality scoring failed');
    return baseScore;
  }
}

/**
 * Quick check: is the code likely acceptable? (score >= 6)
 */
export async function isLikelyAccepted(
  prompt: string,
  generatedCode: string,
  params?: { componentType?: string; framework?: string; style?: string }
): Promise<boolean> {
  const result = await scoreQuality(prompt, generatedCode, params);
  return result.score >= 6;
}
