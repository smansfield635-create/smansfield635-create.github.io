import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma2-bounded-combination-classification.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.rma2-bounded-combination-classification.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'rma2-evidence');
const HARNESS_URL = 'http://127.0.0.1:4181/h-earth-3d/validation/metric-attribution/h-earth.rma2-bounded-combination-classification-harness.html';
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
const changedPaths = git('diff', '--name-only', `${control.controllingRMA1Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_RMA2_BASE', git('merge-base', control.controllingRMA1Merge, head) === control.controllingRMA1Merge, { base: control.controllingRMA1Merge, head });
check('EXACT_RMA2_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}
check('RMA1_NO_SINGLE_FAMILY_PASS_EXACT', control.rma1Disposition.singleFamilyPassKeys.length === 0);
check('EXACT_TOP_TWO_SELECTION', JSON.stringify(control.combination.members) === JSON.stringify(control.rma1Disposition.rankedFamilyKeys.slice(0, 2)) && JSON.stringify(control.combination.members) === JSON.stringify(['FAMILY_5', 'FAMILY_4']), { combination: control.combination, ranking: control.rma1Disposition.rankedFamilyKeys });
check('ONLY_ONE_COMBINATION_AUTHORIZED', control.combination.exactCombinationCount === 1 && control.combination.thirdFamilyIncluded === false && control.combination.parameterTuningPerformed === false, control.combination);

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1480, height: 1120 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(1800000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.rma2Ready === 'true' || document.documentElement.dataset.rma2Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.rma2Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_RMA2.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_RMA2.renderScene(id), sceneId);
    await page.locator('#official').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.official-accepted-cp2.png`) });
    await page.locator('#pass-g').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.pass-g.png`) });
    await page.locator('#pass-h').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.pass-h.png`) });
    await page.locator('#pass-combination').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.combination-family-5-plus-family-4.png`) });
  }
  result = await page.evaluate(() => window.H_EARTH_RMA2.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_EIGHT_SCENES_EXECUTED', result?.sceneCount === control.gates.exactSceneCount, { actual: result?.sceneCount, expected: control.gates.exactSceneCount });
check('EXACT_THREE_PASSES_EXECUTED', result?.passCount === control.gates.exactPassCount, { actual: result?.passCount, expected: control.gates.exactPassCount });
check('EXACT_TWENTY_FOUR_OUTPUTS', result?.outputCount === control.gates.exactOutputCount, { actual: result?.outputCount, expected: control.gates.exactOutputCount });
check('EXACT_COMBINATION_IDENTITY', result?.combination?.key === control.combination.key && JSON.stringify(result?.combination?.members) === JSON.stringify(control.combination.members), { actual: result?.combination, expected: control.combination });
check('ALL_OUTPUTS_DETERMINISTIC', result?.allOutputsDeterministic === true);
check('H_OFFICIAL_COLOR_EQUIVALENCE_ALL_SCENES', result?.hOfficialColorEquivalenceSceneCount === control.gates.hOfficialColorEquivalenceSceneCount, { actual: result?.hOfficialColorEquivalenceSceneCount, expected: control.gates.hOfficialColorEquivalenceSceneCount });
check('H_OFFICIAL_DEPTH_EQUIVALENCE_ALL_SCENES', result?.hOfficialDepthEquivalenceSceneCount === control.gates.hOfficialDepthEquivalenceSceneCount, { actual: result?.hOfficialDepthEquivalenceSceneCount, expected: control.gates.hOfficialDepthEquivalenceSceneCount });
check('H_ACCEPTED_AGGREGATE_SCORE_EXACT', close(result?.reference?.H?.aggregateScore, 0.8081230868576569, control.gates.hAggregateAbsoluteTolerance), { actual: result?.reference?.H?.aggregateScore, expected: 0.8081230868576569 });
check('G_TO_H_REFERENCE_REPRODUCED',
  result?.reference?.gToH?.exactBandMatchCount === 23 &&
  close(result?.reference?.gToH?.meanBandGridPearson, 0.9795210903175875, control.gates.gToHCorrespondenceTolerance) &&
  close(result?.reference?.gToH?.sceneScorePearson, 0.9923694320951161, control.gates.gToHCorrespondenceTolerance) &&
  close(result?.reference?.gToH?.meanPeakStrengthRatio, 0.9804080305101164, control.gates.gToHCorrespondenceTolerance) &&
  result?.reference?.gToH?.dominantSceneExactMatchCount === 7 &&
  close(result?.reference?.gToH?.aggregateScoreRatio, 0.9945351868190059, control.gates.gToHCorrespondenceTolerance),
  { actual: result?.reference?.gToH }
);
check('COMBINATION_CHANGED_ALL_OR_SOME_SCENES', result?.combinationResult?.distinctSceneCount >= 1, { actual: result?.combinationResult?.distinctSceneCount });
check('CAUSAL_GATE_TERMS_COMPLETE', Object.keys(result?.combinationResult?.gateTerms ?? {}).sort().join(',') === 'aggregateRepetitionReduction,causalImpactComposite,exactBandMatchDropFromG,meanBandGridPearsonDropFromG,sceneScoreReductionCount', result?.combinationResult?.gateTerms);
check('CLASSIFICATION_MECHANICALLY_CONSISTENT', result?.combinationResult?.classification === (result?.combinationResult?.combinationPassesCausalGate ? 'BOUNDED_COMBINATION_REPETITION_CAUSAL' : 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_CAUSAL_GATE'), result?.combinationResult);
check('ALL_METRICS_FINITE', result?.allMetricsFinite === true);
check('ALL_OUTPUTS_HAVE_COVERAGE', result?.allOutputsHaveCoverage === true);
check('EXACT_ONE_COMBINATION_EXECUTED', result?.exactCombinationCount === control.boundaries.exactCombinationCount);
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === control.boundaries.stop, { actual: result?.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_RMA2_BOUNDED_COMBINATION_CLASSIFICATION_RECEIPT_v1',
  checkpoint: 'RMA2',
  operation: control.operation,
  result: failures.length === 0 ? control.result : 'RMA2_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingRMA1Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  execution: result,
  causalClassification: result?.combinationResult?.classification ?? null,
  productMutationPerformed: false,
  exactCombinationCount: 1,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `RMA2_PASS_CLOSED@${head}` : `RMA2_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
