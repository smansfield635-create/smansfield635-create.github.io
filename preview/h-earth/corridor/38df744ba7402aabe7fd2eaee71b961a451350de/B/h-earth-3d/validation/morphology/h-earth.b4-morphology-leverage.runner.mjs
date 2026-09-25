import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.b4-morphology-leverage.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'b4-evidence');
const HARNESS_URL = process.env.B4_HARNESS_URL ?? 'http://127.0.0.1:4180/h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage-harness.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed, status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingB3Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_B4_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('B4_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_B3_CLOSED_BASE', git('merge-base', control.controllingB3Merge, head) === control.controllingB3Merge, { base: control.controllingB3Merge, head });
for (const [id, record] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', record.path);
  check(`B4_FROZEN_${id.toUpperCase()}`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1500, height: 1150 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(900000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.b4Ready === 'true' || document.documentElement.dataset.b4Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.b4Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_B4_MORPHOLOGY.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_B4_MORPHOLOGY.renderScene(id), sceneId);
    const prefix = sceneId.toLowerCase();
    await page.locator('#baseline').screenshot({ path: path.join(EVIDENCE_DIR, `${prefix}.baseline.png`) });
    await page.locator('#probe-a').screenshot({ path: path.join(EVIDENCE_DIR, `${prefix}.probe-a.png`) });
    await page.locator('#probe-b').screenshot({ path: path.join(EVIDENCE_DIR, `${prefix}.probe-b.png`) });
  }
  result = await page.evaluate(() => window.H_EARTH_B4_MORPHOLOGY.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_EIGHT_SCENES_EXECUTED', result?.scenes?.length === control.gates.exactSceneCount, { actual: result?.scenes?.length, expected: control.gates.exactSceneCount });
check('ACCEPTED_RENDERER_EQUIVALENCE_PASS', result?.acceptedRendererEquivalentAcrossAllScenes === true, { failures: result?.scenes?.filter((record) => !record.acceptedRendererEquivalent).map((record) => ({ id: record.scene.id, acceptedHash: record.acceptedHash, baselineHash: record.baselineHash })) });
check('FIXED_PROBE_FRAMES_DETERMINISTIC', result?.deterministicAcrossAllProbeFrames === true, { failures: result?.scenes?.filter((record) => !record.probeADeterministic || !record.probeBDeterministic).map((record) => record.scene.id) });
check('FROZEN_BASELINE_DIGEST_PRESERVED', result?.baseline?.digest === control.frozenDigests.baseline, { actual: result?.baseline?.digest, expected: control.frozenDigests.baseline });
check('EXACT_TWO_PROBES_CLASSIFIED', result?.probes?.length === 2, { actual: result?.probes?.length });
check('PROBE_DIGESTS_PRESERVED', result?.probes?.[0]?.digest === control.frozenDigests.probeA && result?.probes?.[1]?.digest === control.frozenDigests.probeB, { actual: result?.probes?.map((probe) => probe.digest), expected: [control.frozenDigests.probeA, control.frozenDigests.probeB] });
check('ALL_CLASSIFICATION_METRICS_FINITE', result?.probes?.every((probe) => [probe.heightfieldDirectionalRepetitionReduction, probe.slopeFieldDirectionalRepetitionReduction, probe.finalFrameRepetitionScore, probe.finalFrameRepetitionReduction, probe.improvedSceneCount].every(Number.isFinite)) === true, { probes: result?.probes });
const validDispositions = ['MORPHOLOGY_LEVERAGE_ESTABLISHED', 'MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED', 'WEAK_OR_INCONCLUSIVE_LEVERAGE'];
check('CAUSAL_DISPOSITION_RECORDED', validDispositions.includes(result?.disposition), { disposition: result?.disposition });
const successful = result?.probes?.filter((probe) => probe.heightfieldDirectionalRepetitionReduction >= control.gates.heightfieldDirectionalRepetitionReductionMinimum && probe.finalFrameRepetitionReduction >= control.gates.finalFrameRepetitionReductionMinimum && probe.improvedSceneCount >= control.gates.improvedSceneMinimum) ?? [];
const expectedDisposition = successful.length
  ? 'MORPHOLOGY_LEVERAGE_ESTABLISHED'
  : result?.probes?.every((probe) => probe.finalFrameRepetitionReduction < control.gates.leverageNotEstablishedBothProbeFinalFrameMaximumExclusive)
    ? 'MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED'
    : 'WEAK_OR_INCONCLUSIVE_LEVERAGE';
check('CLASSIFICATION_LAW_APPLIED_EXACTLY', result?.disposition === expectedDisposition, { actual: result?.disposition, expected: expectedDisposition });
check('LOWER_SUCCESSFUL_AMPLITUDE_SELECTION_EXACT', expectedDisposition !== 'MORPHOLOGY_LEVERAGE_ESTABLISHED' ? result?.selectedProbe === null : result?.selectedProbe === [...successful].sort((a, b) => a.amplitudeFractionOfLocalRelief - b.amplitudeFractionOfLocalRelief)[0]?.probeId, { selectedProbe: result?.selectedProbe });
check('B5_AUTHORIZATION_EXACT', result?.b5Authorized === (expectedDisposition === 'MORPHOLOGY_LEVERAGE_ESTABLISHED'), { b5Authorized: result?.b5Authorized, disposition: expectedDisposition });
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === 'STOP_AFTER_CAUSAL_CLASSIFICATION', { actual: result?.stoppingBoundary });

const receiptBody = {
  receiptType: 'H_EARTH_B4_MORPHOLOGY_LEVERAGE_CLASSIFICATION_RECEIPT_v1',
  checkpoint: 'B4',
  result: failures.length === 0 ? result.result : 'B4_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  disposition: failures.length === 0 ? result.disposition : 'EXECUTION_INTEGRITY_FAIL',
  baseHead: control.controllingB3Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  classification: result,
  b5Authorized: failures.length === 0 && result.b5Authorized === true,
  productMutationPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: 'STOP_AFTER_CAUSAL_CLASSIFICATION'
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
