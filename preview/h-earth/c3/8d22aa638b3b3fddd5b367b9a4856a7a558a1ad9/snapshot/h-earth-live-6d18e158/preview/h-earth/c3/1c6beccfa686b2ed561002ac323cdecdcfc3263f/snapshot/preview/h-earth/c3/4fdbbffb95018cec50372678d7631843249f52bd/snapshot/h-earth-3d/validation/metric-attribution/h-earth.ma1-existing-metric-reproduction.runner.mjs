// validation-trigger: 1
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma1-existing-metric-reproduction.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma1-existing-metric-reproduction.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'ma1-evidence');
const HARNESS_URL = process.env.METRIC_ATTRIBUTION_HARNESS_URL ?? 'http://127.0.0.1:4181/h-earth-3d/validation/metric-attribution/h-earth.ma1-existing-metric-reproduction-harness.html';
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
const changedPaths = git('diff', '--name-only', `${control.controllingMA0Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_MA1_BASE', git('merge-base', control.controllingMA0Merge, head) === control.controllingMA0Merge, { base: control.controllingMA0Merge, head });
check('EXACT_MA1_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries({
  acceptedRenderer: control.acceptedRenderer,
  canonicalTerrainField: control.canonicalTerrainField,
  canonicalRenderPackage: control.canonicalRenderPackage,
  canonicalGpuUploadViews: control.canonicalGpuUploadViews,
  navigationAuthority: control.navigationAuthority,
  permanentEightSceneControl: control.permanentEightSceneControl,
  liveHost: control.liveHost,
  liveBinding: control.liveBinding
})) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 760 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(900000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.ma1Ready === 'true' || document.documentElement.dataset.ma1Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.ma1Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_MA1.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_MA1.renderScene(id), sceneId);
    await page.locator('#accepted').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.accepted-cp2.png`) });
  }
  result = await page.evaluate(() => window.H_EARTH_MA1.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_EIGHT_SCENES_EXECUTED', result?.sceneCount === control.gates.exactSceneCount, { actual: result?.sceneCount, expected: control.gates.exactSceneCount });
check('ALL_ACCEPTED_FRAMES_DETERMINISTIC', result?.deterministicAcrossAllScenes === true, { failures: result?.scenes?.filter((record) => !record.deterministic).map((record) => record.scene.id) });
check('B4_AGGREGATE_SCORE_REPRODUCED', result?.withinTolerance === true, { actual: result?.aggregateScore, expected: control.expectedB4AggregateScore, absoluteDifference: result?.absoluteDifference, tolerance: control.aggregateScoreAbsoluteTolerance });
check('ONLY_ACCEPTED_CP2_PASS_EXECUTED', JSON.stringify(result?.diagnosticPassesExecuted) === JSON.stringify(['H_ACCEPTED_CP2_FINAL_FRAME']), { actual: result?.diagnosticPassesExecuted });
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === control.boundaries.stop, { actual: result?.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_MA1_EXISTING_METRIC_REPRODUCTION_RECEIPT_v1',
  checkpoint: 'MA1',
  result: failures.length === 0 ? control.result : 'MA1_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA0Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  reproduction: result,
  productMutationPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `MA1_PASS_CLOSED@${head}` : `MA1_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
