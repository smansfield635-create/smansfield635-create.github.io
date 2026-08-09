import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { classifyNewsRole, fibonacciBandForDepth, resolveDevelopmentalCoordinate, resolveCorpus } from './developmental-coordinate-resolver.v1.mjs';
import { runDevelopmentalCoordinateBenchmark } from './developmental-coordinate-benchmark.v1.mjs';

const readJson = relative => JSON.parse(fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8'));
const protocol = readJson('./developmental-coordinate-protocol.v1.json');
const corpus = readJson('./developmental-coordinate-retrospective-fixtures.v1.json');

const tests = [];
const test = (name, fn) => {
  try { const details = fn(); tests.push({ name, result: 'PASS', details: details ?? null }); }
  catch (error) { tests.push({ name, result: 'FAIL', error: error.message }); }
};
const eq = (actual, expected, label) => { if (actual !== expected) throw new Error(`${label}:${actual}!=${expected}`); };

test('NEWS role mapping is deterministic', () => {
  eq(classifyNewsRole('INTAKE_PROBE_BOUNDARY', protocol), 'NORTH', 'north');
  eq(classifyNewsRole('CONSTRUCTION_EXPANSION', protocol), 'EAST', 'east');
  eq(classifyNewsRole('VALIDATION_CHALLENGE_REPAIR', protocol), 'WEST', 'west');
  eq(classifyNewsRole('RESTITUTION_CLOSURE_STABILIZATION', protocol), 'SOUTH', 'south');
  eq(classifyNewsRole('REFERENCE_NO_DISPLACEMENT', protocol), 'CENTER', 'center');
});

test('unknown NEWS function fails closed', () => {
  let failed = false;
  try { classifyNewsRole('POST_HOC_MADE_UP_ROLE', protocol); } catch { failed = true; }
  eq(failed, true, 'unknown_role_rejected');
});

test('Fibonacci band is monotonic and not local chronology', () => {
  const depths = [1,2,3,4,5,6,8,9,13,14,21];
  const numeric = depths.map(depth => Number(fibonacciBandForDepth(depth, protocol).slice(1)));
  for (let i = 1; i < numeric.length; i += 1) if (numeric[i] < numeric[i-1]) throw new Error('non_monotonic_fibonacci_band');
  eq(fibonacciBandForDepth(4, protocol), 'F5', 'depth4');
});

test('same input yields byte-identical coordinate', () => {
  const event = corpus.events.find(item => item.pr === 834);
  const a = JSON.stringify(resolveDevelopmentalCoordinate(event, protocol));
  const b = JSON.stringify(resolveDevelopmentalCoordinate(event, protocol));
  eq(a, b, 'determinism');
});

test('historical #834 #838 #840 outcomes are immutable', () => {
  const receipts = resolveCorpus(corpus.events, protocol);
  const byPr = new Map(receipts.map(receipt => [receipt.sourcePr, receipt]));
  eq(byPr.get(834).historicalOutcome, 'VALID_THEN_SUPERSEDED', 'pr834');
  eq(byPr.get(838).historicalOutcome, 'VALID_THEN_SUPERSEDED', 'pr838');
  eq(byPr.get(840).historicalOutcome, 'VALID_CLOSURE', 'pr840');
});

test('contradictions survive successful coordinate resolution', () => {
  const event = corpus.events.find(item => item.pr === 834);
  const receipt = resolveDevelopmentalCoordinate(event, protocol);
  eq(receipt.residuePresent, true, 'residue');
  eq(receipt.contradictions[0], event.contradictions[0], 'contradiction');
});

test('coordinate creates no authority and no gate override', () => {
  for (const receipt of resolveCorpus(corpus.events, protocol)) {
    eq(receipt.preservation.authorityCreated, false, 'authority');
    eq(receipt.preservation.carryForwardAuthority, 'NONE', 'carry_forward');
    eq(receipt.preservation.gateOverrides.length, 0, 'gate_overrides');
    eq(receipt.preservation.sourceMutationPerformed, false, 'mutation');
  }
});

test('retrospective kill gate is measured and passes only on frozen thresholds', () => {
  const benchmark = runDevelopmentalCoordinateBenchmark({ protocol, corpus });
  eq(benchmark.result, 'PASS_SHADOW_KILL_GATE', 'benchmark');
  return {
    aggregateAdvantage: benchmark.queryFootprint.aggregateAdvantage,
    compositeOverhead: benchmark.overhead.compositeOverhead,
    newsIncrementalStructuralAdvantage: benchmark.ablation.newsVsGenericPrimaryFunctionToken.incrementalStructuralAdvantage,
    fibonacciIncrementalStructuralAdvantage: benchmark.ablation.fibonacciVsLinearSynchronizationDepth.incrementalStructuralAdvantage
  };
});

test('NEWS and Fibonacci ablations do not receive unearned credit', () => {
  const benchmark = runDevelopmentalCoordinateBenchmark({ protocol, corpus });
  eq(benchmark.ablation.newsVsGenericPrimaryFunctionToken.incrementalStructuralAdvantage, 0, 'news_ablation');
  eq(benchmark.ablation.fibonacciVsLinearSynchronizationDepth.incrementalStructuralAdvantage, 0, 'fibonacci_ablation');
});

const failed = tests.filter(testResult => testResult.result === 'FAIL');
const benchmark = runDevelopmentalCoordinateBenchmark({ protocol, corpus });
const receipt = {
  schema: 'DEVELOPMENTAL_COORDINATE_SELF_TEST_RECEIPT_v1',
  result: failed.length ? 'FAIL' : 'PASS',
  totalCount: tests.length,
  passedCount: tests.length - failed.length,
  failedCount: failed.length,
  tests,
  benchmarkSummary: {
    result: benchmark.result,
    aggregateAdvantage: benchmark.queryFootprint.aggregateAdvantage,
    compositeOverhead: benchmark.overhead.compositeOverhead,
    historicalOutcomeDriftCount: benchmark.preservation.historicalOutcomeDriftCount,
    contradictionLossCount: benchmark.preservation.contradictionLossCount,
    falseCarryForwardCount: benchmark.preservation.falseCarryForwardCount,
    gateOverrideCount: benchmark.preservation.gateOverrideCount,
    authorityInflationCount: benchmark.preservation.authorityInflationCount,
    newsIncrementalStructuralAdvantage: benchmark.ablation.newsVsGenericPrimaryFunctionToken.incrementalStructuralAdvantage,
    fibonacciIncrementalStructuralAdvantage: benchmark.ablation.fibonacciVsLinearSynchronizationDepth.incrementalStructuralAdvantage,
    compactEvidenceSha256: benchmark.compactEvidenceSha256
  },
  authorityBoundary: protocol.authorityBoundary
};

export function runDevelopmentalCoordinateSelfTest() { return receipt; }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outIndex = process.argv.indexOf('--output');
  if (outIndex >= 0) fs.writeFileSync(process.argv[outIndex + 1], JSON.stringify(receipt, null, 2) + '\n');
  else process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
  if (failed.length) process.exitCode = 1;
}
