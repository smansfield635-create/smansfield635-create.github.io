import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma2-diagnostic-pass-authority.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma2-diagnostic-pass-authority.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'ma2-evidence');
const HARNESS_URL = 'http://127.0.0.1:4181/h-earth-3d/validation/metric-attribution/h-earth.ma2-diagnostic-pass-authority-harness.html';
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
const changedPaths = git('diff', '--name-only', `${control.controllingMA1Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_MA2_BASE', git('merge-base', control.controllingMA1Merge, head) === control.controllingMA1Merge, { base: control.controllingMA1Merge, head });
check('EXACT_MA2_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1560, height: 1280 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(900000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.ma2Ready === 'true' || document.documentElement.dataset.ma2Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.ma2Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  result = await page.evaluate(() => window.H_EARTH_MA2.executeFixture());
  await page.locator('#official').screenshot({ path: path.join(EVIDENCE_DIR, 'fixture.official-accepted-cp2.png') });
  for (const key of Object.keys(control.passes)) {
    await page.locator(`#pass-${key.toLowerCase()}`).screenshot({ path: path.join(EVIDENCE_DIR, `fixture.pass-${key.toLowerCase()}.png`) });
  }
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
check('EXACT_ONE_FIXTURE_SCENE', result?.fixtureScene?.id === control.fixtureSceneId, { actual: result?.fixtureScene?.id, expected: control.fixtureSceneId });
check('EXACT_A_THROUGH_H_PASS_COUNT', result?.passCount === control.gates.exactPassCount && result?.passes?.map((record) => record.key).join('') === 'ABCDEFGH', { actual: result?.passes?.map((record) => record.key) });
check('ALL_PASSES_DETERMINISTIC', result?.allPassesDeterministic === true, { failures: result?.passes?.filter((record) => !record.deterministic).map((record) => record.key) });
check('DIAGNOSTIC_H_COLOR_EQUIVALENT_TO_OFFICIAL', result?.diagnosticHByteEquivalentToOfficialAccepted === true, { official: result?.official?.frameHash, diagnostic: result?.passes?.find((record) => record.key === 'H')?.frameHash });
check('DIAGNOSTIC_H_DEPTH_EQUIVALENT_TO_OFFICIAL', result?.diagnosticHDepthEquivalentToOfficialAccepted === true, { official: result?.official?.depthMaskHash, diagnostic: result?.passes?.find((record) => record.key === 'H')?.depthMaskHash });
check('A_THROUGH_G_DISTINCT_FROM_H', result?.allNonReferencePassesDistinctFromOfficial === true, { failures: result?.passes?.filter((record) => record.key !== 'H' && !record.distinctFromOfficialFrame).map((record) => record.key) });
check('ALL_PASSES_HAVE_ELIGIBLE_COVERAGE', result?.allPassesHaveCoverage === true, { passes: result?.passes?.map((record) => ({ key: record.key, eligiblePixelCount: record.luminance.eligiblePixelCount })) });
check('ALL_PASSES_HAVE_NONTRIVIAL_VARIANCE', result?.allPassesHaveNontrivialVariance === true, { passes: result?.passes?.map((record) => ({ key: record.key, variance: record.luminance.variance })) });
check('G_FLAT_LIGHTING_TRANSFORM_PRESENT', result?.passes?.find((record) => record.key === 'G')?.shaderFacts?.flatLightingReplacementPresent === true);
check('H_USES_EXACT_ACCEPTED_FRAGMENT_SHADER', result?.passes?.find((record) => record.key === 'H')?.shaderFacts?.exactAcceptedFragmentShader === true);
check('PASS_ISOLATION_REGISTRY_EXACT', result?.passes?.every((record) => JSON.stringify(record.pass) === JSON.stringify(control.passes[record.key])) === true);
check('NO_PRODUCT_OR_LIVE_MUTATION', result?.productMutationPerformed === false && result?.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', result?.stoppingBoundary === control.boundaries.stop, { actual: result?.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_MA2_DIAGNOSTIC_PASS_AUTHORITY_RECEIPT_v1',
  checkpoint: 'MA2',
  result: failures.length === 0 ? control.result : 'MA2_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA1Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  fixture: result,
  productMutationPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `MA2_PASS_CLOSED@${head}` : `MA2_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
