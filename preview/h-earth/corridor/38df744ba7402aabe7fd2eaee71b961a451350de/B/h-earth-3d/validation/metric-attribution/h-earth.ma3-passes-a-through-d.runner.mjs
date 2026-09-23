import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma3-passes-a-through-d.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma3-passes-a-through-d.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'ma3-evidence');
const HARNESS_URL = 'http://127.0.0.1:4181/h-earth-3d/validation/metric-attribution/h-earth.ma3-passes-a-through-d-harness.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingMA2Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_MA3_BASE', git('merge-base', control.controllingMA2Merge, head) === control.controllingMA2Merge, { base: control.controllingMA2Merge, head });
check('EXACT_MA3_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1500, height: 1180 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(1800000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.ma3Ready === 'true' || document.documentElement.dataset.ma3Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.ma3Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_MA3.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_MA3.renderScene(id), sceneId);
    for (const key of Object.keys(control.passes)) {
      await page.locator(`#pass-${key.toLowerCase()}`).screenshot({
        path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.pass-${key.toLowerCase()}.png`)
      });
    }
  }
  result = await page.evaluate(() => window.H_EARTH_MA3.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_EIGHT_SCENES_EXECUTED', result?.sceneCount === control.gates.exactSceneCount, { actual: result?.sceneCount, expected: control.gates.exactSceneCount });
check('EXACT_FOUR_PASSES_EXECUTED', result?.passCount === control.gates.exactPassCount && Object.keys(result?.passSummaries ?? {}).join('') === 'ABCD', { actual: Object.keys(result?.passSummaries ?? {}) });
check('EXACT_THIRTY_TWO_OUTPUTS', result?.outputCount === control.gates.exactOutputCount, { actual: result?.outputCount, expected: control.gates.exactOutputCount });
check('ALL_OUTPUTS_DETERMINISTIC', result?.allOutputsDeterministic === true, { failures: result?.scenes?.flatMap((scene) => Object.values(scene.passes).filter((record) => !record.deterministic).map((record) => `${scene.scene.id}:${record.key}`)) });
check('ALL_METRICS_FINITE', result?.allMetricsFinite === true);
check('ALL_OUTPUTS_HAVE_COVERAGE', result?.allOutputsHaveCoverage === true, { failures: result?.scenes?.flatMap((scene) => Object.values(scene.passes).filter((record) => record.metric.eligiblePixelCount < control.gates.minimumEligiblePixelCount).map((record) => `${scene.scene.id}:${record.key}:${record.metric.eligiblePixelCount}`)) });
check('ORIENTATION_AND_LAG_GRID_EXACT', result?.scenes?.every((scene) => Object.values(scene.passes).every((record) => Object.values(record.metric.bands).every((band) => band.grid.length === control.finalFrameMetric.orientationsDegrees.length * control.finalFrameMetric.lagsPixels.length))) === true);
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === control.boundaries.stop, { actual: result?.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_MA3_PASSES_A_THROUGH_D_RECEIPT_v1',
  checkpoint: 'MA3',
  result: failures.length === 0 ? control.result : 'MA3_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA2Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  execution: result,
  productMutationPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `MA3_PASS_CLOSED@${head}` : `MA3_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
