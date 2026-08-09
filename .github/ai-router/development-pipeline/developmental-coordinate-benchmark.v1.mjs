import fs from 'node:fs';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { resolveCorpus } from './developmental-coordinate-resolver.v1.mjs';

const readJson = relative => JSON.parse(fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8'));
const defaultProtocol = readJson('./developmental-coordinate-protocol.v1.json');
const defaultCorpus = readJson('./developmental-coordinate-retrospective-fixtures.v1.json');

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const improvement = (raw, coordinate) => raw <= 0 ? 0 : 1 - coordinate / raw;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function footprintFor(events, key) {
  const counts = events.map(event => event.rawFootprints?.[key]?.length).filter(Number.isFinite);
  if (counts.length !== events.length) throw new Error(`MISSING_RAW_FOOTPRINT:${key}`);
  return mean(counts);
}

export function runDevelopmentalCoordinateBenchmark({ protocol = defaultProtocol, corpus = defaultCorpus } = {}) {
  const events = corpus.events;
  const primary = events.filter(event => event.benchmarkPrimary === true);
  if (primary.length < 3) throw new Error('INSUFFICIENT_PRIMARY_BENCHMARK_FIXTURES');

  const start = performance.now();
  const receipts = resolveCorpus(events, protocol);
  const resolverRuntimeMs = performance.now() - start;

  const receiptById = new Map(receipts.map(receipt => [receipt.eventId, receipt]));
  let historicalOutcomeDriftCount = 0;
  let contradictionLossCount = 0;
  let falseCarryForwardCount = 0;
  let gateOverrideCount = 0;
  let authorityInflationCount = 0;

  for (const event of events) {
    const receipt = receiptById.get(event.eventId);
    if (!receipt || receipt.historicalOutcome !== event.historicalOutcome) historicalOutcomeDriftCount += 1;
    const sourceContradictions = Array.isArray(event.contradictions) ? event.contradictions : [];
    if (JSON.stringify(receipt?.contradictions ?? []) !== JSON.stringify(sourceContradictions)) contradictionLossCount += 1;
    if (receipt?.preservation?.carryForwardAuthority !== 'NONE') falseCarryForwardCount += 1;
    gateOverrideCount += receipt?.preservation?.gateOverrides?.length ?? 0;
    if (receipt?.preservation?.authorityCreated !== false) authorityInflationCount += 1;
  }

  const q = protocol.benchmark.coordinateQueryFootprints;
  const raw = {
    stateReconstruction: footprintFor(primary, 'stateReconstruction'),
    localization: footprintFor(primary, 'localization'),
    reopening: footprintFor(primary, 'reopening'),
    nextDecision: footprintFor(primary, 'nextDecision')
  };
  const gains = {
    stateReconstruction: improvement(raw.stateReconstruction, q.stateReconstruction),
    localization: improvement(raw.localization, q.localization),
    reopening: improvement(raw.reopening, q.reopening),
    nextDecision: improvement(raw.nextDecision, q.nextDecision)
  };
  const aggregateAdvantage = mean(Object.values(gains));

  const ablation = {
    newsVsGenericPrimaryFunctionToken: {
      newsFieldCount: 1,
      genericFieldCount: 1,
      incrementalStructuralAdvantage: 0,
      result: 'NO_UNIQUE_STRUCTURAL_ADVANTAGE_PROVEN'
    },
    fibonacciVsLinearSynchronizationDepth: {
      fibonacciFieldCount: 1,
      linearDepthFieldCount: 1,
      incrementalStructuralAdvantage: 0,
      result: 'NO_UNIQUE_STRUCTURAL_ADVANTAGE_PROVEN'
    }
  };

  const compactEvidence = {
    s: 'DEVELOPMENTAL_COORDINATE_BENCHMARK_COMPACT_v1',
    n: primary.length,
    g: Object.fromEntries(Object.entries(gains).map(([key, value]) => [key, Number(value.toFixed(6))])),
    a: Number(aggregateAdvantage.toFixed(6)),
    h: historicalOutcomeDriftCount,
    c: contradictionLossCount,
    f: falseCarryForwardCount,
    o: gateOverrideCount,
    u: authorityInflationCount
  };
  const compactEvidenceJson = JSON.stringify(compactEvidence);
  const compactEvidenceBytes = Buffer.byteLength(compactEvidenceJson, 'utf8');
  const baseline = protocol.benchmark.overheadBaseline;
  const runtimeRatio = resolverRuntimeMs / baseline.pipelineRuntimeMs;
  const evidenceRatio = compactEvidenceBytes / baseline.artifactArchiveBytes;
  const compositeOverhead = 0.5 * runtimeRatio + 0.5 * evidenceRatio;

  const thresholds = protocol.benchmark.killThresholds;
  const checks = {
    stateReconstruction: gains.stateReconstruction >= thresholds.stateReconstructionImprovement,
    localization: gains.localization >= thresholds.localizationImprovement,
    reopening: gains.reopening >= thresholds.reopeningImprovement,
    nextDecision: gains.nextDecision >= thresholds.nextDecisionImprovement,
    aggregateAdvantage: aggregateAdvantage >= thresholds.aggregateAdvantage,
    historicalOutcomePreserved: historicalOutcomeDriftCount === 0,
    falseCarryForward: falseCarryForwardCount === thresholds.falseCarryForwardCount,
    gateOverrides: gateOverrideCount === thresholds.gateOverrideCount,
    authorityInflation: authorityInflationCount === thresholds.authorityInflationCount,
    contradictionPreservation: contradictionLossCount === thresholds.contradictionLossCount,
    overhead: compositeOverhead <= thresholds.maxCompositeOverhead
  };

  const passed = Object.values(checks).every(Boolean);
  const trajectory = [834, 838, 840].map(pr => {
    const event = events.find(candidate => candidate.pr === pr);
    const receipt = receiptById.get(event.eventId);
    return { pr, generation: event.generation, historicalOutcome: receipt.historicalOutcome, lifecycle: receipt.coordinate.L };
  });

  return {
    schema: 'DEVELOPMENTAL_COORDINATE_BENCHMARK_RECEIPT_v1',
    result: passed ? 'PASS_SHADOW_KILL_GATE' : 'FAIL_SHADOW_KILL_GATE',
    corpus: { totalEvents: events.length, primaryEvents: primary.length, trajectory },
    queryFootprint: { rawAverage: raw, coordinate: q, improvements: gains, aggregateAdvantage },
    preservation: { historicalOutcomeDriftCount, contradictionLossCount, falseCarryForwardCount, gateOverrideCount, authorityInflationCount },
    overhead: { resolverRuntimeMs, compactEvidenceBytes, baselinePipelineRuntimeMs: baseline.pipelineRuntimeMs, baselineArtifactArchiveBytes: baseline.artifactArchiveBytes, runtimeRatio, evidenceRatio, compositeOverhead },
    ablation,
    checks,
    compactEvidenceSha256: sha256(compactEvidenceJson),
    interpretationBoundary: 'FOOTPRINT_GAINS_ARE_RETROSPECTIVE_POST_MATERIALIZATION_QUERY_COMPRESSION; THEY_ARE_NOT_YET_LIVE_TIME_SAVINGS. NEWS_AND_FIBONACCI_UNIQUE_INCREMENTAL_VALUE_IS_NOT_PROVEN_BY_THIS_CORPUS.'
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(runDevelopmentalCoordinateBenchmark(), null, 2) + '\n');
}
