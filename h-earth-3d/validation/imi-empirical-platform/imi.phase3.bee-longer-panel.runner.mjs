import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';
import { runStudy, spearman } from '../../tools/imi-empirical-platform/imi-core-and-empirical-portfolio-engine.v1.mjs';

const require = createRequire(import.meta.url);
const route = require('../../tools/imi-empirical-platform/routes/usda-honey-bee-refresh-2026-route.v1.json');
const manifest = require('../../tools/imi-empirical-platform/generalizability/imi-phase3-parallel-external-tests-manifest.v1.json');
const track = manifest.tracks.find((entry) => entry.track === 'BEE_LONGER_PANEL_AND_ROUTE_DISCRIMINATION');

const HISTORICAL_SOURCE = Object.freeze(track.sources.find((entry) => entry.release === '2025-08-01'));
const CURRENT_SOURCE = Object.freeze(track.sources.find((entry) => entry.release === '2026-08-03'));
const HISTORICAL_QUARTERS = Object.freeze([
  { key: '2024_Q1', label: 'January-March 2024', lossAnchor: 'States and United States: January 1, 2024 and January-March 2024' },
  { key: '2024_Q2', label: 'April-June 2024', lossAnchor: 'States and United States: April 1, 2024 and April-June 2024' },
  { key: '2024_Q3', label: 'July-September 2024', lossAnchor: 'States and United States: July 1, 2024 and July-September 2024' },
  { key: '2024_Q4', label: 'October-December 2024', lossAnchor: 'States and United States: October 1, 2024 and October-December 2024' },
  { key: '2025_Q1', label: 'January-March 2025', lossAnchor: 'States and United States: January 1, 2025 and January-March 2025' },
  { key: '2025_Q2', label: 'April-June 2025', lossAnchor: 'States and United States: April 1, 2025 and April-June 2025' }
]);
const CURRENT_OVERLAP_QUARTERS = Object.freeze([
  { key: '2025_Q1', label: 'January-March 2025', lossAnchor: 'States and United States: January 1, 2025 and January-March 2025' },
  { key: '2025_Q2', label: 'April-June 2025', lossAnchor: 'States and United States: April 1, 2025 and April-June 2025' }
]);

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
const outputDir = argValue('--output-dir', '/tmp/imi-phase3-bee-longer-panel');
const clock = () => new Date(argValue('--clock', '2026-08-05T17:45:00.000Z'));

function parseReportValue(token, { percent = false } = {}) {
  const clean = String(token ?? '').trim();
  if (!clean || clean === '(X)') return null;
  if (clean === '-') return 0;
  if (clean === '(Z)') return percent ? 0.25 : 0;
  const parsed = Number(clean.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}
function normalizeState(raw) {
  return String(raw).replace(/\.+$/g, '').replace(/\s+\d+\/?\s*$/g, '').replace(/\s+/g, ' ').trim();
}
function parseRowLine(line) {
  const match = line.match(/^\s*([A-Za-z][A-Za-z\s]+(?:\s\d+\/)?|Other States\s\d+\/|United States)\s*\.*:\s*(.+)$/);
  if (!match) return null;
  return { state: normalizeState(match[1]), tokens: match[2].trim().split(/\s+/).filter(Boolean) };
}
function parseLossTables(text, quarters) {
  const byQuarter = new Map(quarters.map((quarter) => [quarter.key, new Map()]));
  let active = null;
  for (const line of text.split(/\r?\n/)) {
    for (const quarter of quarters) if (line.includes(quarter.lossAnchor)) active = quarter.key;
    if (!active) continue;
    if (line.startsWith('Colony Health Stressors')) { active = null; continue; }
    const parsed = parseRowLine(line);
    if (!parsed) continue;
    const [coloniesAtStart, maximumColonies, lostColonies, percentLost, addedColonies, renovatedColonies, percentRenovated] = parsed.tokens;
    const record = {
      state: parsed.state,
      colonies_at_start: parseReportValue(coloniesAtStart),
      maximum_colonies: parseReportValue(maximumColonies),
      lost_colonies: parseReportValue(lostColonies),
      percent_lost: parseReportValue(percentLost, { percent: true }),
      added_colonies: parseReportValue(addedColonies),
      renovated_colonies: parseReportValue(renovatedColonies),
      percent_renovated: parseReportValue(percentRenovated, { percent: true })
    };
    if (record.state && record.percent_lost !== null) byQuarter.get(active)?.set(record.state, record);
  }
  return byQuarter;
}
function parseStressTables(text, quarters) {
  const byQuarter = new Map(quarters.map((quarter) => [quarter.key, new Map()]));
  let active = null;
  for (const line of text.split(/\r?\n/)) {
    const stressMatch = line.match(/Colony Health Stressors with Five or More Colonies - States and United States: (.+)$/);
    if (stressMatch) {
      active = quarters.find((quarter) => quarter.label === stressMatch[1])?.key ?? null;
      continue;
    }
    if (!active) continue;
    if (line.startsWith('Colonies Lost with Colony Collapse')) { active = null; continue; }
    const parsed = parseRowLine(line);
    if (!parsed || parsed.tokens.length < 6) continue;
    const [varroa, otherPests, disease, pesticide, other, unknown] = parsed.tokens;
    const record = {
      state: parsed.state,
      varroa_percent: parseReportValue(varroa, { percent: true }),
      other_pests_percent: parseReportValue(otherPests, { percent: true }),
      disease_percent: parseReportValue(disease, { percent: true }),
      pesticide_percent: parseReportValue(pesticide, { percent: true }),
      other_percent: parseReportValue(other, { percent: true }),
      unknown_percent: parseReportValue(unknown, { percent: true })
    };
    if (record.state && record.varroa_percent !== null) byQuarter.get(active)?.set(record.state, record);
  }
  return byQuarter;
}
function eligibleStates(stressByQuarter, lossByQuarter) {
  const requiredStress = ['2024_Q1', '2024_Q2', '2024_Q3', '2024_Q4'];
  const requiredLoss = ['2024_Q1', '2024_Q2', '2024_Q3', '2024_Q4', '2025_Q1'];
  const candidates = new Set(stressByQuarter.get(requiredStress[0])?.keys() || []);
  return [...candidates].filter((state) => {
    if (state === 'United States' || state === 'Other States') return false;
    return requiredStress.every((key) => stressByQuarter.get(key)?.has(state)) && requiredLoss.every((key) => lossByQuarter.get(key)?.has(state));
  }).sort();
}
function buildHeldOutRows(stressByQuarter, lossByQuarter, states) {
  const transitions = [
    ['2024_Q1', '2024_Q2'],
    ['2024_Q2', '2024_Q3'],
    ['2024_Q3', '2024_Q4'],
    ['2024_Q4', '2025_Q1']
  ];
  const rows = [];
  for (const [quarter, nextQuarter] of transitions) {
    for (const state of states) {
      const stress = stressByQuarter.get(quarter).get(state);
      const currentLoss = lossByQuarter.get(quarter).get(state);
      const nextLoss = lossByQuarter.get(nextQuarter).get(state);
      rows.push({
        case_id: `${state.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}__${quarter}`,
        state,
        quarter,
        next_quarter: nextQuarter,
        varroa_constraint: stress.varroa_percent / 100,
        other_pests_constraint: stress.other_pests_percent / 100,
        disease_constraint: stress.disease_percent / 100,
        pesticide_constraint: stress.pesticide_percent / 100,
        other_stressor_constraint_sensitivity: stress.other_percent / 100,
        unknown_stressor_percent: stress.unknown_percent,
        current_loss_rate: currentLoss.percent_lost / 100,
        next_loss_rate: nextLoss.percent_lost / 100,
        current_percent_lost: currentLoss.percent_lost,
        next_percent_lost: nextLoss.percent_lost
      });
    }
  }
  return rows;
}
function quantile(values, q) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const index = (sorted.length - 1) * q;
  const lo = Math.floor(index), hi = Math.ceil(index);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
}
function lcg(seed = 256) {
  let state = seed >>> 0;
  return () => ((state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 0x100000000);
}
function clusteredBootstrap(rows, caseResults, replicates) {
  const byState = new Map();
  rows.forEach((row, index) => {
    if (!byState.has(row.state)) byState.set(row.state, []);
    byState.get(row.state).push(index);
  });
  const states = [...byState.keys()].sort();
  const random = lcg(451);
  const imiRhos = [], csRhos = [];
  for (let r = 0; r < replicates; r += 1) {
    const indices = [];
    for (let i = 0; i < states.length; i += 1) {
      const selected = states[Math.floor(random() * states.length)];
      indices.push(...byState.get(selected));
    }
    const outcomes = indices.map((index) => rows[index].next_loss_rate);
    imiRhos.push(spearman(indices.map((index) => caseResults[index].imi), outcomes));
    csRhos.push(spearman(indices.map((index) => caseResults[index].cs), outcomes));
  }
  const alpha = 1 - track.thresholds.bootstrapConfidence;
  return {
    replicates,
    clustering: 'STATE_WITH_ALL_FOUR_TRANSITIONS_RETAINED_PER_RESAMPLED_STATE',
    imi: { lower: quantile(imiRhos, alpha / 2), upper: quantile(imiRhos, 1 - alpha / 2) },
    cs: { lower: quantile(csRhos, alpha / 2), upper: quantile(csRhos, 1 - alpha / 2) }
  };
}
function compareOverlap(historicalLoss, historicalStress, currentLoss, currentStress) {
  const diagnostics = [];
  for (const quarter of ['2025_Q1', '2025_Q2']) {
    const states = new Set([...(historicalLoss.get(quarter)?.keys() || []), ...(currentLoss.get(quarter)?.keys() || [])]);
    for (const state of states) {
      if (state === 'United States' || state === 'Other States') continue;
      const oldLoss = historicalLoss.get(quarter)?.get(state) || null;
      const newLoss = currentLoss.get(quarter)?.get(state) || null;
      const oldStress = historicalStress.get(quarter)?.get(state) || null;
      const newStress = currentStress.get(quarter)?.get(state) || null;
      if (canonicalDigest({ oldLoss, oldStress }) !== canonicalDigest({ oldLoss: newLoss, oldStress: newStress })) {
        diagnostics.push({ quarter, state, historical: { loss: oldLoss, stress: oldStress }, current: { loss: newLoss, stress: newStress } });
      }
    }
  }
  return diagnostics;
}

await mkdir(outputDir, { recursive: true });
const [historicalResponse, currentResponse] = await Promise.all([fetch(HISTORICAL_SOURCE.url), fetch(CURRENT_SOURCE.url)]);
if (!historicalResponse.ok) throw new Error(`BEE_HISTORICAL_SOURCE_FETCH_FAILED:${historicalResponse.status}`);
if (!currentResponse.ok) throw new Error(`BEE_CURRENT_SOURCE_FETCH_FAILED:${currentResponse.status}`);
const [historicalText, currentText] = await Promise.all([historicalResponse.text(), currentResponse.text()]);
if (!historicalText.includes('Released August 1, 2025')) throw new Error('BEE_HISTORICAL_RELEASE_IDENTITY_MISMATCH');
if (!currentText.includes('Released August 3, 2026')) throw new Error('BEE_CURRENT_RELEASE_IDENTITY_MISMATCH');

const historicalLoss = parseLossTables(historicalText, HISTORICAL_QUARTERS);
const historicalStress = parseStressTables(historicalText, HISTORICAL_QUARTERS);
const currentLoss = parseLossTables(currentText, CURRENT_OVERLAP_QUARTERS);
const currentStress = parseStressTables(currentText, CURRENT_OVERLAP_QUARTERS);
const states = eligibleStates(historicalStress, historicalLoss);
if (states.length < 20) throw new Error(`BEE_PHASE3_STATE_MINIMUM_NOT_MET:${states.length}`);
const rows = buildHeldOutRows(historicalStress, historicalLoss, states);
if (rows.length < states.length * 3) throw new Error(`BEE_PHASE3_TRANSITION_MINIMUM_NOT_MET:${rows.length}`);
const overlapRevisionDiagnostics = compareOverlap(historicalLoss, historicalStress, currentLoss, currentStress);

const sourceIdentity = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_BEE_LONGER_PANEL_SOURCE_IDENTITY_v1',
  observedAt: clock().toISOString(),
  historicalSource: {
    ...HISTORICAL_SOURCE,
    bytes: Buffer.byteLength(historicalText, 'utf8'),
    digest: canonicalDigest(historicalText)
  },
  currentOverlapSource: {
    ...CURRENT_SOURCE,
    bytes: Buffer.byteLength(currentText, 'utf8'),
    digest: canonicalDigest(currentText)
  },
  heldOutQuarterRange: '2024_Q1_THROUGH_2025_Q1_OUTCOME',
  heldOutTransitionCount: 4,
  primaryStateCount: states.length,
  heldOutRowCount: rows.length,
  transformedRowsDigest: canonicalDigest(rows),
  overlapRevisionDiagnosticCount: overlapRevisionDiagnostics.length
});

const studyRun = runStudy({
  studyMeta: {
    studyId: 'IMI_PHASE_3_BEE_LONGER_HISTORICAL_PANEL_2024_v1',
    studyVersion: '1.0.0-frozen-phase3',
    validationClass: 'HELD_OUT_HISTORICAL_TEMPORAL_REPLICATION_NOT_FINAL_VALIDATION',
    backupStatus: 'GITHUB_ACTIONS_ARTIFACT_AND_PR_BRANCH_RECORD',
    notes: [
      'The frozen 2026 bee route is executed on nonoverlapping 2024 state-quarter transitions from the August 2025 USDA report.',
      'The outcome is next-quarter state-level percent colony loss.',
      'The August 2026 report is used only for overlap revision diagnostics, not route retuning.'
    ]
  },
  datasetMeta: {
    datasetId: 'USDA_NASS_HONEY_BEE_COLONIES_AUGUST_2025_HELD_OUT_2024_PANEL',
    datasetVersion: HISTORICAL_SOURCE.release,
    datasetFingerprint: sourceIdentity.transformedRowsDigest
  },
  routeSpec: route,
  rows,
  clock
});

const valid = studyRun.caseResults.filter((result) => result.status === 'VALID');
if (valid.length !== rows.length) throw new Error(`BEE_PHASE3_VALID_CASE_MISMATCH:${valid.length}:${rows.length}`);
const outcomes = rows.map((row) => row.next_loss_rate);
const imi = valid.map((result) => result.imi);
const cs = valid.map((result) => result.cs);
const additiveSeverity = valid.map((result) => 1 - result.additiveMean);
const wmiSeverity = valid.map((result) => 1 - result.wmi);
const meanAbsoluteImiAdditiveDifference = valid.reduce((sum, result) => sum + Math.abs(result.imi - result.additiveMean), 0) / valid.length;
const bootstrap = clusteredBootstrap(rows, valid, track.thresholds.bootstrapReplicates);
const weakestFactorCounts = studyRun.receipt.summary.weakestFactorCounts;
const weakestFactorClassCount = Object.keys(weakestFactorCounts).length;
const rhoImi = spearman(imi, outcomes);
const rhoCs = spearman(cs, outcomes);
const h2Supported = meanAbsoluteImiAdditiveDifference >= track.thresholds.noncompensatoryMeanAbsoluteDifference;
const h4Supported = Number.isFinite(rhoImi) && rhoImi < 0 && bootstrap.imi.upper < 0;
const phase4Candidate = h4Supported && weakestFactorClassCount > 1;

const summary = deepFreeze({
  schemaVersion: 'IMI_PHASE_3_BEE_LONGER_PANEL_SUMMARY_v1',
  result: 'PASS_CLOSED_PHASE_3_BEE_LONGER_PANEL_EXECUTED_WITH_FINDINGS_RETAINED',
  sourceIdentity,
  routeId: route.routeId,
  routeDigest: canonicalDigest(route),
  evaluatedCases: rows.length,
  validCases: valid.length,
  unevaluableCases: studyRun.receipt.summary.unevaluableCases,
  hardCollapseCases: studyRun.receipt.summary.hardCollapseCases,
  weakestFactorCounts,
  weakestFactorClassCount,
  varroaDominanceClassification: weakestFactorCounts.VARROA_AVAILABILITY === valid.length
    ? 'PERSISTS_IN_NONOVERLAPPING_HISTORICAL_PANEL_CAUSE_UNRESOLVED'
    : 'DOES_NOT_FULLY_PERSIST_IN_NONOVERLAPPING_HISTORICAL_PANEL',
  comparatorResults: {
    meanAbsoluteImiAdditiveDifference,
    materialityThreshold: track.thresholds.noncompensatoryMeanAbsoluteDifference,
    h2NoncompensatoryDifferentiationSupported: h2Supported,
    spearmanIMIWithNextLoss: rhoImi,
    spearmanCSWithNextLoss: rhoCs,
    spearmanAdditiveSeverityWithNextLoss: spearman(additiveSeverity, outcomes),
    spearmanWMISeverityWithNextLoss: spearman(wmiSeverity, outcomes),
    clusteredBootstrap: bootstrap,
    h4HeldOutAssociationSupported: h4Supported
  },
  overlapRevisionDiagnostics: {
    comparedQuarters: ['2025_Q1', '2025_Q2'],
    differingStateQuarterRecords: overlapRevisionDiagnostics.length,
    diagnosticDigest: canonicalDigest(overlapRevisionDiagnostics)
  },
  phase4Candidate,
  boundaries: {
    stateAggregateOnly: true,
    heldOutRowsOverlapDevelopmentSample: false,
    routeRetuned: false,
    colonyLevelCausationClaimed: false,
    universalEarlyWarningClaimed: false,
    finalBeeRouteValidityClaimed: false,
    negativeAndComparatorInferiorResultsRetained: true
  }
});
const receiptBody = {
  schemaVersion: 'IMI_PHASE_3_BEE_LONGER_PANEL_RECEIPT_v1',
  operation: 'IMI_PARALLEL_EXTERNAL_TESTS_v1',
  track: track.track,
  result: summary.result,
  terminalDisposition: 'PASS_CLOSED_TRACK_EXECUTION',
  sourceDigest: canonicalDigest(sourceIdentity),
  routeDigest: summary.routeDigest,
  executionDigest: canonicalDigest(studyRun),
  summaryDigest: canonicalDigest(summary),
  minimumEvidenceSatisfied: states.length >= 20 && rows.length >= 60,
  phase4Candidate,
  boundaries: summary.boundaries
};
const receipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });

const files = {
  'bee-phase3-source-identity.v1.json': sourceIdentity,
  'bee-phase3-heldout-transformed-rows.v1.json': rows,
  'bee-phase3-overlap-revision-diagnostics.v1.json': overlapRevisionDiagnostics,
  'bee-phase3-study-run-output.v1.json': studyRun,
  'bee-phase3-summary.v1.json': summary,
  'bee-phase3-track-receipt.v1.json': receipt
};
for (const [name, value] of Object.entries(files)) await writeFile(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
