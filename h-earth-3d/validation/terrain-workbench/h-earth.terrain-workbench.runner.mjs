import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE_HEAD = 'accdec74088120446bfc28f4441fc08a8210813f';
const HARNESS_URL = process.env.TERRAIN_WORKBENCH_URL || 'http://127.0.0.1:4187/h-earth-3d/tools/terrain-workbench/index.html';
const RECEIPT_PATH = path.join(HERE, 'h-earth.terrain-workbench.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'evidence');
const MANIFEST_PATH = path.join(ROOT, 'h-earth-3d/control-plane/post-cp2-round2/H_EARTH_ROUND2_ASSET_DISPOSITION_MANIFEST.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const expectedPaths = [
  '.github/workflows/h-earth-terrain-workbench.yml',
  'h-earth-3d/control-plane/post-cp2-round2/H_EARTH_ROUND2_ASSET_DISPOSITION_MANIFEST.v1.json',
  'h-earth-3d/tools/terrain-workbench/export-packet.mjs',
  'h-earth-3d/tools/terrain-workbench/index.html',
  'h-earth-3d/tools/terrain-workbench/perceptual-correspondence.mjs',
  'h-earth-3d/tools/terrain-workbench/scene-lab.mjs',
  'h-earth-3d/tools/terrain-workbench/terrain-atlas.mjs',
  'h-earth-3d/tools/terrain-workbench/workbench.mjs',
  'h-earth-3d/validation/terrain-workbench/h-earth.terrain-workbench.runner.mjs'
].sort();

const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${BASE_HEAD}..${head}`).split(/\r?\n/).filter(Boolean).sort();
check('EXACT_BASE_HEAD', git('merge-base', BASE_HEAD, head) === BASE_HEAD, { base: BASE_HEAD, head });
check('EXACT_CONSOLIDATION_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_LIVE_OR_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const allowed = new Set(manifest.allowedClassifications);
check('MANIFEST_SCHEMA_EXACT', manifest.schemaVersion === 'H_EARTH_ROUND2_ASSET_DISPOSITION_MANIFEST_v1');
check('MANIFEST_ALL_ASSETS_CLASSIFIED', manifest.assets.length > 0 && manifest.assets.every((asset) => allowed.has(asset.classification) && typeof asset.path === 'string'));
check('MANIFEST_REJECTED_CONTENT_PRESENT', manifest.assets.some((asset) => asset.classification === 'REJECTED_VISUAL_CONTENT'));
check('MANIFEST_LIVE_AUTHORITY_PRESENT', manifest.assets.some((asset) => asset.classification === 'LIVE_AUTHORITY'));
check('MANIFEST_WORKBENCH_PATHS_EXACT', JSON.stringify([...manifest.workbenchPaths].sort()) === JSON.stringify(expectedPaths));
check('MANIFEST_BOUNDARIES_CLOSED', Object.values(manifest.boundaries).every((value) => value === false), manifest.boundaries);

const workbenchSources = expectedPaths.filter((entry) => entry.startsWith('h-earth-3d/tools/terrain-workbench/')).map((entry) => fs.readFileSync(path.join(ROOT, entry), 'utf8')).join('\n');
const rejectedPaths = manifest.assets.filter((asset) => asset.classification === 'REJECTED_VISUAL_CONTENT').map((asset) => asset.path);
check('REJECTED_VISUAL_CONTENT_NOT_IMPORTED', rejectedPaths.every((entry) => !workbenchSources.includes(entry)), { rejectedPaths });
check('PUBLIC_ROUTE_LITERAL_NOT_TARGETED', !workbenchSources.includes("showroom/globe/h-earth/index.html") && !workbenchSources.includes('live-gpu-binding.js'));

for (const file of expectedPaths.filter((entry) => entry.endsWith('.mjs'))) {
  try {
    execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { cwd: ROOT, stdio: 'pipe' });
    check(`SYNTAX_${file.replaceAll('/', '_')}`, true);
  } catch (error) {
    check(`SYNTAX_${file.replaceAll('/', '_')}`, false, String(error.stderr || error));
  }
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1300 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(1800000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let browserResult = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.terrainWorkbenchReady === 'true' || document.documentElement.dataset.terrainWorkbenchError === 'true', null, { timeout: 600000 });
  const failed = await page.evaluate(() => document.documentElement.dataset.terrainWorkbenchError === 'true');
  if (failed) throw new Error(await page.locator('#status').textContent());
  browserResult = await page.evaluate(() => window.H_EARTH_TERRAIN_WORKBENCH.completeVerificationFixture());
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'terrain-workbench-full.png'), fullPage: true });
  await page.locator('#terrain-map').screenshot({ path: path.join(EVIDENCE_DIR, 'terrain-intelligence-atlas.png') });
  await page.locator('#accepted-view').screenshot({ path: path.join(EVIDENCE_DIR, 'accepted-cp2-pass-h.png') });
  await page.locator('#metric-view').screenshot({ path: path.join(EVIDENCE_DIR, 'orientation-lag-overlay.png') });
} finally {
  await browser.close();
}

const diagnostics = browserResult?.diagnostics;
const packet = browserResult?.packet;
check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
check('B1_BASELINE_DIGEST_EXACT', packet?.fixedGates?.b1BaselineDigest === 'fnv1a32:513f79fa', packet?.fixedGates);
check('B2_PROTECTION_DIGEST_EXACT', packet?.fixedGates?.b2ProtectionDigest === 'fnv1a32:f228a5b5', packet?.fixedGates);
check('EXACT_EIGHT_SCENES', diagnostics?.sceneCount === 8 && packet?.sceneCount === 8, { diagnosticScenes: diagnostics?.sceneCount, packetScenes: packet?.sceneCount });
check('CP2_H_FRAME_EQUIVALENCE_8_OF_8', diagnostics?.hOfficialColorEquivalenceSceneCount === 8, diagnostics?.hOfficialColorEquivalenceSceneCount);
check('CP2_DEPTH_EQUIVALENCE_8_OF_8', diagnostics?.hOfficialDepthEquivalenceSceneCount === 8, diagnostics?.hOfficialDepthEquivalenceSceneCount);
check('DIAGNOSTIC_PASSES_A_THROUGH_H', packet?.fixedGates?.diagnosticPasses === 'A_THROUGH_H');
check('MATERIAL_FAMILY_ABLATIONS_7_OF_7', diagnostics?.familyCount === 7 && packet?.fixedGates?.materialFamilyAblations === '7_OF_7');
check('ALL_RMA_OUTPUTS_DETERMINISTIC', diagnostics?.allOutputsDeterministic === true);
check('ALL_RMA_OUTPUTS_HAVE_COVERAGE', diagnostics?.allOutputsHaveCoverage === true);
check('DETERMINISTIC_EXPORT', browserResult?.deterministic === true && typeof packet?.canonicalPacketDigest === 'string', { deterministic: browserResult?.deterministic, digest: packet?.canonicalPacketDigest });
check('ALL_CORRESPONDENCE_RECORDS_COMPLETE', Object.values(browserResult?.validation ?? {}).every((issues) => Array.isArray(issues) && issues.length === 0));
check('PACKET_PRESERVES_NON_MUTATION_AUTHORITY', packet?.authority?.liveHEarthMutation === false && packet?.authority?.acceptedCP2Mutation === false && packet?.authority?.rejectedCandidatePromotion === false, packet?.authority);
check('FIXED_LIVE_GATES_FALSE', packet?.fixedGates?.liveHostChanged === false && packet?.fixedGates?.liveBindingChanged === false && packet?.fixedGates?.acceptedRendererChanged === false && packet?.fixedGates?.publicHEarthRouteChanged === false, packet?.fixedGates);

const receiptBody = {
  receiptType: 'H_EARTH_TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH_RECEIPT_v1',
  deliverable: 'H_EARTH_TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH_v1',
  result: failures.length === 0 ? 'H_EARTH_TERRAIN_WORKBENCH_VERIFICATION_PASS' : 'H_EARTH_TERRAIN_WORKBENCH_VERIFICATION_FAIL',
  pass: failures.length === 0,
  baseHead: BASE_HEAD,
  executedHead: head,
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  packetDigest: packet?.canonicalPacketDigest ?? null,
  packetSha256: packet ? sha256(JSON.stringify(packet)) : null,
  diagnostics: {
    sceneCount: diagnostics?.sceneCount,
    passKeys: diagnostics?.passKeys,
    hOfficialColorEquivalenceSceneCount: diagnostics?.hOfficialColorEquivalenceSceneCount,
    hOfficialDepthEquivalenceSceneCount: diagnostics?.hOfficialDepthEquivalenceSceneCount,
    allOutputsDeterministic: diagnostics?.allOutputsDeterministic
  },
  liveHostChanged: false,
  liveBindingChanged: false,
  acceptedRendererChanged: false,
  publicHEarthRouteChanged: false
};
const receipt = { ...receiptBody, canonicalReceiptSha256: sha256(JSON.stringify(receiptBody)) };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
