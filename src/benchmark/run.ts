/* eslint-disable no-console */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createProvider } from '../llm/provider-factory.js';
import type { ILLMProvider, LLMProviderType } from '../llm/types.js';
import { setQualityScorerLLM } from '../ml/quality-scorer.js';
import { setPromptEnhancerLLM } from '../ml/prompt-enhancer.js';
import { goldenPrompts } from './golden-prompts.js';
import { BenchmarkHarness } from './harness.js';
import { compareProviders, analyzeScoringAccuracy, analyzeEnhancementEffectiveness } from './evaluator.js';
import { generateReport, formatConsole, formatJSON } from './reporter.js';

const isDryRun = process.argv.includes('--dry-run');

async function main(): Promise<void> {
  const pkg = JSON.parse(readFileSync(join(import.meta.dirname ?? '.', '../../package.json'), 'utf-8'));

  console.log(`\nSiza-Gen AI Benchmark Suite v${pkg.version}`);
  console.log(`Prompts: ${goldenPrompts.length}`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}\n`);

  const providers = await discoverProviders();

  if (isDryRun) {
    const n = Math.max(providers.length, 4);
    console.log(`Providers found: ${providers.length} (${providers.map((p) => p.type).join(', ') || 'none'})`);
    console.log(`\nDry run — would generate:`);
    console.log(`  ${goldenPrompts.length} prompts x ${n} providers = ${goldenPrompts.length * n} generations`);
    console.log(`  ${goldenPrompts.length * n * 4} scoring operations`);
    console.log(`  ${goldenPrompts.length * 3} enhancement comparisons`);
    process.exit(0);
  }

  if (providers.length === 0) {
    console.error('No providers available. Set API keys or start Ollama.');
    process.exit(1);
  }

  console.log(`Providers: ${providers.map((p) => `${p.type}/${p.model}`).join(', ')}`);

  if (providers.length > 0) {
    setQualityScorerLLM(providers[0]);
    setPromptEnhancerLLM(providers[0]);
  }

  const harness = new BenchmarkHarness(providers, {
    timeoutMs: 60_000,
    delayBetweenMs: 500,
  });

  const start = Date.now();
  const { results, enhancementResults } = await harness.runAll(goldenPrompts);
  const durationMs = Date.now() - start;

  const providerMetrics = compareProviders(results);
  const scoringAccuracy = analyzeScoringAccuracy(results);
  const enhancementEffectiveness = analyzeEnhancementEffectiveness(enhancementResults);

  const report = generateReport(
    results,
    providerMetrics,
    scoringAccuracy,
    enhancementEffectiveness,
    enhancementResults,
    durationMs,
    pkg.version
  );

  console.log(formatConsole(report));

  mkdirSync('benchmarks', { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const outPath = `benchmarks/report-${date}.json`;
  writeFileSync(outPath, formatJSON(report));
  console.log(`Full report: ${outPath}`);
}

async function discoverProviders(): Promise<ILLMProvider[]> {
  const configs: {
    type: LLMProviderType;
    envKey: string;
    model: string;
  }[] = [
    {
      type: 'anthropic',
      envKey: 'ANTHROPIC_API_KEY',
      model: 'claude-sonnet-4-20250514',
    },
    {
      type: 'openai',
      envKey: 'OPENAI_API_KEY',
      model: 'gpt-4o-mini',
    },
    {
      type: 'gemini',
      envKey: 'GEMINI_API_KEY',
      model: 'gemini-2.0-flash',
    },
    { type: 'ollama', envKey: '', model: 'llama3.2:3b' },
  ];

  const providers: ILLMProvider[] = [];

  for (const cfg of configs) {
    if (cfg.envKey && !process.env[cfg.envKey]) {
      console.log(`  Skip ${cfg.type}: no ${cfg.envKey}`);
      continue;
    }

    try {
      const provider = createProvider({
        provider: cfg.type,
        model: cfg.model,
        apiKey: cfg.envKey ? process.env[cfg.envKey] : undefined,
        baseUrl: cfg.type === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/openai' : undefined,
      });

      if (await provider.isAvailable()) {
        providers.push(provider);
        console.log(`  Found ${cfg.type}/${cfg.model}`);
      } else {
        console.log(`  Skip ${cfg.type}: not available`);
      }
    } catch {
      console.log(`  Skip ${cfg.type}: initialization failed`);
    }
  }

  return providers;
}

main().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
