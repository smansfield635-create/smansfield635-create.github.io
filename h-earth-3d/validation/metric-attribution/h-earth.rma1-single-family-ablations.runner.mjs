import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma1-single-family-ablations.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.rma1-single-family-ablations.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'rma1-evidence');
const HARNESS_URL = 'http://127.0.0.1:4181/h-earth-3d/validation/metric-attribution/h-earth.rma1-single-family-ablations-harness.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const close = (left, right, tolerance) => Number.isFinite(left) && Math.abs(left - right) <= tolerance;
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingRMA0Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_RMA1_BASE', git('merge-base', control.controllingRMA0Merge, head) === control.controllingRMA0Merge, { base: control.controllingRMA0Merge, head });
check('EXACT_RMA1_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1740, height: 1450 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(1800000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.rma1Ready === 'true' || document.documentElement.dataset.rma1Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.rma1Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_RMA1.listSceneIds());
  const passKeys = await page.evaluate(() => window.H_EARTH_RMA1.listPassKeys());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_RMA1.renderScene(id), sceneId);
    await page.locator('#official').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.official-accepted-cp2.png`) });
    for (const key of passKeys) {
      const id = key.startsWith('FAMILY_') ? `#pass-family-${key.split('_')[1]}` : `#pass-${key.toLowerCase()}`;
      await page.locator(id).screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.pass-${key.toLowerCase().replaceAll('_', '-')}.png`) });
    }
  }
  result = await page.evaluate(() => window.H_EARTH_RMA1.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_EIGHT_SCENES_EXECUTED', result?.sceneCount === control.gates.exactSceneCount, { actual: result?.sceneCount, expected: control.gates.exactSceneCount });
check('EXACT_TWO_REFERENCE_PASSES', result?.referencePassCount === control.gates.exactReferencePassCount, { actual: result?.referencePassCount, expected: control.gates.exactReferencePassCount });
check('EXACT_SEVEN_FAMILIES', result?.familyCount === control.gates.exactFamilyCount && result?.familyResults?.length === control.gates.exactFamilyCount, { actual: result?.familyCount, expected: control.gates.exactFamilyCount });
check('EXACT_NINE_DIAGNOSTIC_PASSES', result?.diagnosticPassCount === control.gates.exactDiagnosticPassCount && JSON.stringify(result?.passKeys) === JSON.stringify(control.passKeys), { actual: result?.passKeys, expected: control.passKeys });
check('EXACT_SEVENTY_TWO_OUTPUTS', result?.outputCount === control.gates.exactOutputCount, { actual: result?.outputCount, expected: control.gates.exactOutputCount });
check('ALL_OUTPUTS_DETERMINISTIC', result?.allOutputsDeterministic === true);
check('H_OFFICIAL_COLOR_EQUIVALENCE_ALL_SCENES', result?.hOfficialColorEquivalenceSceneCount === control.gates.hOfficialColorEquivalenceSceneCount, { actual: result?.hOfficialColorEquivalenceSceneCount, expected: control.gates.hOfficialColorEquivalenceSceneCount });
check('H_OFFICIAL_DEPTH_EQUIVALENCE_ALL_SCENES', result?.hOfficialDepthEquivalenceSceneCount === control.gates.hOfficialDepthEquivalenceSceneCount, { actual: result?.hOfficialDepthEquivalenceSceneCount, expected: control.gates.hOfficialDepthEquivalenceSceneCount });
check('H_ACCEPTED_AGGREGATE_SCORE_EXACT', close(result?.reference?.H?.aggregateScore, control.acceptedReference.hAggregateScore, control.gates.hAggregateAbsoluteTolerance), { actual: result?.reference?.H?.aggregateScore, expected: control.acceptedReference.hAggregateScore, tolerance: control.gates.hAggregateAbsoluteTolerance });
check('G_TO_H_EXACT_BAND_MATCHES_REPRODUCED', result?.reference?.gToH?.exactBandMatchCount === control.acceptedReference.gToHExactBandMatchCount && result?.reference?.gToH?.exactBandComparisonCount === control.acceptedReference.gToHBandComparisonCount, { actual: result?.reference?.gToH, expected: control.acceptedReference });
check('G_TO_H_GRID_PEARSON_REPRODUCED', close(result?.reference?.gToH?.meanBandGridPearson, control.acceptedReference.gToHMeanBandGridPearson, control.gates.gToHCorrespondenceTolerance), { actual: result?.reference?.gToH?.meanBandGridPearson, expected: control.acceptedReference.gToHMeanBandGridPearson });
check('G_TO_H_SCENE_SCORE_PEARSON_REPRODUCED', close(result?.reference?.gToH?.sceneScorePearson, control.acceptedReference.gToHSceneScorePearson, control.gates.gToHCorrespondenceTolerance), { actual: result?.reference?.gToH?.sceneScorePearson, expected: control.acceptedReference.gToHSceneScorePearson });
check('G_TO_H_PEAK_RATIO_REPRODUCED', close(result?.reference?.gToH?.meanPeakStrengthRatio, control.acceptedReference.gToHMeanPeakStrengthRatio, control.gates.gToHCorrespondenceTolerance), { actual: result?.reference?.gToH?.meanPeakStrengthRatio, expected: control.acceptedReference.gToHMeanPeakStrengthRatio });
check('G_TO_H_DOMINANT_SCENES_REPRODUCED', result?.reference?.gToH?.dominantSceneExactMatchCount === control.acceptedReference.gToHDominantSceneExactMatchCount, { actual: result?.reference?.gToH?.dominantSceneExactMatchCount, expected: control.acceptedReference.gToHDominantSceneExactMatchCount });
check('G_TO_H_AGGREGATE_RATIO_REPRODUCED', close(result?.reference?.gToH?.aggregateScoreRatio, control.acceptedReference.gToHAggregateScoreRatio, control.gates.gToHCorrespondenceTolerance), { actual: result?.reference?.gToH?.aggregateScoreRatio, expected: control.acceptedReference.gToHAggregateScoreRatio });
check('ALL_METRICS_FINITE', result?.allMetricsFinite === true);
check('ALL_OUTPUTS_HAVE_COVERAGE', result?.allOutputsHaveCoverage === true);
check('EVERY_FAMILY_CHANGED_AT_LEAST_ONE_SCENE', result?.familyResults?.every((family) => family.distinctSceneCount >= control.gates.minimumDistinctSceneCountPerFamily) === true, { familyDistinctSceneCounts: result?.familyResults?.map((family) => ({ key: family.family.key, count: family.distinctSceneCount })) });
check('RANKING_COMPLETE_AND_UNIQUE', result?.rankedFamilyKeys?.length === 7 && new Set(result?.rankedFamilyKeys ?? []).size === 7 && result?.rankedFamilyKeys?.every((key) => control.materialFamilies.some((family) => family.key === key)), { rankedFamilyKeys: result?.rankedFamilyKeys });
check('SINGLE_FAMILY_GATE_TERMS_COMPLETE', result?.familyResults?.every((family) => Object.keys(family.gateTerms).sort().join(',') === 'aggregateRepetitionReduction,causalImpactComposite,exactBandMatchDropFromG,meanBandGridPearsonDropFromG,sceneScoreReductionCount') === true);
check('NO_MULTI_FAMILY_ABLATION', result?.multiFamilyAblationExecuted === false);
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === control.boundaries.stop, { actual: result?.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_RMA1_SINGLE_FAMILY_ABLATION_MATRIX_RECEIPT_v1',
  checkpoint: 'RMA1',
  operation: control.operation,
  result: failures.length === 0 ? control.result : 'RMA1_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingRMA0Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  execution: result,
  productMutationPerformed: false,
  multiFamilyAblationExecuted: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `RMA1_PASS_CLOSED@${head}` : `RMA1_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
