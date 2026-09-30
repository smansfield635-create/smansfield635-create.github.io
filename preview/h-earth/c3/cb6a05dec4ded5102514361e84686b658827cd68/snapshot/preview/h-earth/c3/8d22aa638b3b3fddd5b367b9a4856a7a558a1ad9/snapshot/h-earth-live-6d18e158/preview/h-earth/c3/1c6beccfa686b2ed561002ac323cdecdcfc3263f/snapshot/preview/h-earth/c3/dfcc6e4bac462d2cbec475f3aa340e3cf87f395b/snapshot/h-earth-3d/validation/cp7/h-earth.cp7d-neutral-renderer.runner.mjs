import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7d-neutral-renderer-integration.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE = authority.controllingBasis.cp7cMergeHead;
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7d-neutral-renderer.receipt.v1.json');
const EVIDENCE_DIR = path.join(ROOT, 'h-earth-3d/validation/cp7/cp7d-evidence');
const HARNESS_URL = process.env.CP7D_HARNESS_URL ?? 'http://127.0.0.1:4177/h-earth-3d/validation/cp7/neutral-renderer/h-earth.cp7d-neutral-renderer.harness.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${BASE}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactSubcheckpoint7DPathScope].sort();
check('EXACT_CP7C_BASE', git('merge-base', BASE, head) === BASE, { base: BASE, head });
check('EXACT_7D_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
const productPaths = changedPaths.filter((entry) => entry.startsWith('showroom/'));
check('CANDIDATE_RENDERER_IS_ONLY_PRODUCT_MUTATION', JSON.stringify(productPaths) === JSON.stringify([authority.candidateRendererPath]), { productPaths });

for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  GENERATOR: { path: authority.controllingBasis.generatorPath, blob: authority.controllingBasis.generatorBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}

const candidateSource = fs.readFileSync(path.join(ROOT, authority.candidateRendererPath), 'utf8');
const prohibitedTokens = ['SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08','cameraId','targetName','alongFlow','acrossFlow','controlBroad','controlMeso','controlMicro','TIME_VARYING'];
const foundProhibited = prohibitedTokens.filter((token) => candidateSource.includes(token));
check('NEUTRAL_SOURCE_HAS_NO_SCENE_CAMERA_OR_SYNTHESIS_LOGIC', foundProhibited.length === 0, { foundProhibited });
check('CANDIDATE_DERIVES_FROM_ACCEPTED_RENDERER', candidateSource.includes("from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'"));
check('CANDIDATE_CONSUMES_CANONICAL_CONTROL_FIELD', candidateSource.includes("from './terrain-control-field.cp2-round2.v1.js'") && candidateSource.includes('getHEarthTerrainControlFieldReceipt'));
check('ZERO_MODULATION_FIXED_IN_SOURCE', candidateSource.includes('H_EARTH_CP7D_NEUTRAL_MATERIAL_MODULATION_WEIGHT = 0'));
check('ACTIVE_SAMPLE_PATH_PRESENT', candidateSource.includes('texture(uTerrainControlNeutral,neutralUv)') && candidateSource.includes('uTerrainControlNeutralWeight'));
check('ONE_TEXTURE_SAMPLE_DECLARED', candidateSource.includes('H_EARTH_CP7D_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT = 1'));
check('NO_DYNAMIC_OCTAVE_LOOPS_DECLARED', candidateSource.includes('H_EARTH_CP7D_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0'));

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(900000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.cp7dReady === 'true' || document.documentElement.dataset.cp7dError === 'true', null, { timeout: 600000 });
  const failed = await page.evaluate(() => document.documentElement.dataset.cp7dError === 'true');
  if (failed) throw new Error(await page.locator('#status').textContent());
  result = await page.evaluate(() => window.H_EARTH_CP7D_RESULT);
  await page.locator('#accepted').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.accepted.png') });
  await page.locator('#neutral').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.neutral.png') });
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
const scenes = result?.scenes ?? [];
check('ALL_EIGHT_SCENES_EXECUTED', scenes.length === 8, { actual: scenes.length });
check('ALL_CAMERA_STATES_LAWFUL', scenes.every((record) => record.cameraChunkId !== null), { failures: scenes.filter((record) => record.cameraChunkId === null).map((record) => record.scene.id) });
check('ALL_COLOR_FRAMEBUFFERS_BYTE_EXACT', scenes.every((record) => record.colorBytesExact === true && record.acceptedHash === record.neutralHash), { failures: scenes.filter((record) => !record.colorBytesExact || record.acceptedHash !== record.neutralHash) });
check('ALL_DEPTH_MASKS_EXACT', scenes.every((record) => record.depthMaskExact === true), { failures: scenes.filter((record) => !record.depthMaskExact).map((record) => record.scene.id) });
check('ALL_NEUTRAL_FIXED_FRAMES_EXACT', scenes.every((record) => record.neutralFixedFrameExact === true && record.neutralHash === record.repeatedNeutralHash), { failures: scenes.filter((record) => !record.neutralFixedFrameExact || record.neutralHash !== record.repeatedNeutralHash) });
check('NEUTRAL_PROFILE_ACTIVE', result.profile === result.expectedProfile, { actual: result.profile, expected: result.expectedProfile });
check('WEBGL_CONTEXT_STABLE', result.contextLoss.accepted === 0 && result.contextLoss.neutral === 0 && result.receipts.accepted.context.lost === false && result.receipts.neutral.context.lost === false, { contextLoss: result.contextLoss });

const acceptedReceipt = result.receipts.accepted;
const neutralReceipt = result.receipts.neutral;
check('CANONICAL_PACKAGE_IDENTITY_PRESERVED', neutralReceipt.package.runtimeIdentity === acceptedReceipt.package.runtimeIdentity && neutralReceipt.package.runtimeContentDigest === acceptedReceipt.package.runtimeContentDigest);
check('CONTROL_FIELD_DIGEST_EXACT', neutralReceipt.controlField.canonicalSha256 === authority.controllingBasis.canonicalControlFieldSha256, { actual: neutralReceipt.controlField.canonicalSha256, expected: authority.controllingBasis.canonicalControlFieldSha256 });
check('ONE_NEW_PERSISTENT_TEXTURE', neutralReceipt.persistentObjectCounts.textures === acceptedReceipt.persistentObjectCounts.textures + 1 && neutralReceipt.counters.textureCreateCount === acceptedReceipt.counters.textureCreateCount + 1, { accepted: acceptedReceipt.persistentObjectCounts.textures, neutral: neutralReceipt.persistentObjectCounts.textures });
check('CONTROL_TEXTURE_UPLOAD_AND_MIPMAP_PASS', neutralReceipt.controlFieldTexture.created === true && neutralReceipt.controlFieldTexture.baseUploadCount === 1 && neutralReceipt.controlFieldTexture.mipmapsGenerated === true);
check('ACTIVE_SAMPLE_WITH_ZERO_WEIGHT_PASS', neutralReceipt.controlFieldTexture.shaderSamplePathActive === true && neutralReceipt.controlFieldTexture.samplesPerTerrainFragment === 1 && neutralReceipt.controlFieldTexture.materialModulationWeight === 0 && neutralReceipt.controlFieldTexture.dynamicProceduralOctaveLoops === 0);
check('NO_POST_INITIALIZATION_CONTROL_RESOURCE_WORK', neutralReceipt.controlFieldTexture.postInitializationCreationCount === 0 && neutralReceipt.controlFieldTexture.postInitializationUploadCount === 0 && neutralReceipt.noPostInitializationResourceCreation === true && neutralReceipt.noPostInitializationBufferUpload === true);
check('RESOURCE_IDENTITY_STABLE', neutralReceipt.resourceIdentityStable === true && neutralReceipt.packageUploadedOnce === true);
check('MATERIAL_SYNTHESIS_REMAINS_DISABLED', authority.boundaries.materialSynthesisEnabled === false);
check('LIVE_ADMISSION_REMAINS_PROHIBITED', authority.boundaries.liveAdmissionAuthorized === false && authority.boundaries.liveDefaultPromotionAuthorized === false && authority.boundaries.liveRouteChanged === false);

const stable = {
  receiptType: 'H_EARTH_CP7D_NEUTRAL_RENDERER_INTEGRATION_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7D',
  result: failures.length === 0 ? authority.result : 'CP7D_NEUTRAL_RENDERER_INTEGRATION_FAIL',
  pass: failures.length === 0,
  exactBaseHead: BASE,
  executedHead: head,
  changedPaths,
  candidateRendererPath: authority.candidateRendererPath,
  candidateSourceSha256: sha256(candidateSource),
  canonicalControlFieldSha256: neutralReceipt.controlField.canonicalSha256,
  sceneCount: scenes.length,
  exactColorSceneCount: scenes.filter((record) => record.colorBytesExact).length,
  exactDepthSceneCount: scenes.filter((record) => record.depthMaskExact).length,
  deterministicNeutralSceneCount: scenes.filter((record) => record.neutralFixedFrameExact).length,
  controlTexture: neutralReceipt.controlFieldTexture,
  liveRouteChanged: false,
  materialSynthesisEnabled: false,
  checkpoint7EAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures,
  resultDetail: result
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
