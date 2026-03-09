import type {
  IBenchmarkResult,
  IProviderMetrics,
  IScoringAccuracy,
  IEnhancementEffectiveness,
  IEnhancementResult,
  IBenchmarkReport,
} from './types.js';

export function generateReport(
  results: IBenchmarkResult[],
  providerMetrics: IProviderMetrics[],
  scoringAccuracy: IScoringAccuracy,
  enhancementEffectiveness: IEnhancementEffectiveness,
  enhancementResults: IEnhancementResult[],
  durationMs: number,
  version: string
): IBenchmarkReport {
  const providers = new Set(results.map((r) => r.provider));

  return {
    metadata: {
      date: new Date().toISOString(),
      sizaGenVersion: version,
      promptCount: new Set(results.map((r) => r.promptId)).size,
      providerCount: providers.size,
      totalGenerations: results.length,
      durationMs,
    },
    results,
    providerMetrics,
    scoringAccuracy,
    enhancementEffectiveness,
    enhancementResults,
  };
}

export function formatConsole(report: IBenchmarkReport): string {
  const lines: string[] = [];
  const hr = '─'.repeat(72);

  lines.push('');
  lines.push(`  AI BENCHMARK REPORT — ${report.metadata.date}`);
  lines.push(`  siza-gen ${report.metadata.sizaGenVersion}`);
  lines.push(hr);
  lines.push('');

  // Provider comparison table
  lines.push('  PROVIDER COMPARISON');
  lines.push(
    '  ' +
      pad('Provider', 12) +
      pad('Score', 8) +
      pad('Latency', 10) +
      pad('Cost/gen', 10) +
      pad('Traits', 8) +
      pad('Errors', 8) +
      'Grade'
  );
  lines.push('  ' + '─'.repeat(68));

  for (const m of report.providerMetrics) {
    lines.push(
      '  ' +
        pad(m.provider, 12) +
        pad(m.avgScore.toFixed(1), 8) +
        pad(formatMs(m.avgLatencyMs), 10) +
        pad(formatCost(m.avgCostUsd), 10) +
        pad(formatPct(m.traitMatchRate), 8) +
        pad(formatPct(m.errorRate), 8) +
        m.grade
    );
  }

  lines.push('');

  // Latency percentiles
  lines.push('  LATENCY PERCENTILES');
  lines.push('  ' + pad('Provider', 12) + pad('p50', 10) + pad('p95', 10));
  lines.push('  ' + '─'.repeat(32));
  for (const m of report.providerMetrics) {
    lines.push('  ' + pad(m.provider, 12) + pad(formatMs(m.p50LatencyMs), 10) + pad(formatMs(m.p95LatencyMs), 10));
  }

  lines.push('');

  // Scoring accuracy
  lines.push('  SCORING ACCURACY');
  const sa = report.scoringAccuracy;
  lines.push(`  Heuristic vs LLM correlation: ${sa.heuristicVsLlmCorrelation.toFixed(3)}`);
  lines.push(`  Heuristic avg delta: ${sa.heuristicAvgDelta.toFixed(2)}`);
  lines.push(`  RAG impact avg delta: ${sa.ragImpactAvgDelta.toFixed(2)}`);

  lines.push('');

  // Enhancement effectiveness
  lines.push('  PROMPT ENHANCEMENT EFFECTIVENESS');
  const ee = report.enhancementEffectiveness;
  lines.push(`  Rules-only avg delta: ${ee.rulesOnlyAvgDelta >= 0 ? '+' : ''}${ee.rulesOnlyAvgDelta.toFixed(2)}`);
  lines.push(`  LLM-only avg delta: ${ee.llmOnlyAvgDelta >= 0 ? '+' : ''}${ee.llmOnlyAvgDelta.toFixed(2)}`);
  lines.push(`  Combined avg delta: ${ee.combinedAvgDelta >= 0 ? '+' : ''}${ee.combinedAvgDelta.toFixed(2)}`);
  lines.push(`  Enhancement positive rate: ${formatPct(ee.enhancementRate)}`);

  lines.push('');

  // Summary
  lines.push('  SUMMARY');
  lines.push(`  Total generations: ${report.metadata.totalGenerations}`);
  lines.push(`  Duration: ${(report.metadata.durationMs / 1000).toFixed(1)}s`);
  const totalCost = report.providerMetrics.reduce((s, m) => s + m.totalCostUsd, 0);
  lines.push(`  Total cost: $${totalCost.toFixed(4)}`);

  if (report.providerMetrics.length > 0) {
    const best = report.providerMetrics[0];
    lines.push(`  Best provider: ${best.provider} (${best.grade}, ${best.avgScore.toFixed(1)}/10)`);
  }

  lines.push(hr);
  lines.push('');

  return lines.join('\n');
}

export function formatJSON(report: IBenchmarkReport): string {
  return JSON.stringify(report, null, 2);
}

function pad(s: string, width: number): string {
  return s.padEnd(width);
}

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

function formatCost(usd: number): string {
  return usd === 0 ? 'free' : `$${usd.toFixed(4)}`;
}

function formatPct(ratio: number): string {
  return `${(ratio * 100).toFixed(0)}%`;
}
