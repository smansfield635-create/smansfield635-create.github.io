import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import authority from '../../control-plane/post-cp2-round2/cp7/h-earth.cp7e-bounded-material-synthesis.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE = authority.controllingBasis.cp7dMergeHead;
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/cp7/h-earth.cp7e-bounded-material-synthesis.receipt.v1.json');
const EVIDENCE_DIR = path.join(ROOT, 'h-earth-3d/validation/cp7/cp7e-evidence');
const HARNESS_URL = process.env.CP7E_HARNESS_URL ?? 'http://127.0.0.1:4178/h-earth-3d/validation/cp7/material-synthesis/h-earth.cp7e-material-synthesis.harness.html';
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
const expectedPaths = [...authority.exactSubcheckpoint7EPathScope].sort();
check('EXACT_CP7D_BASE', git('merge-base', BASE, head) === BASE, { base: BASE, head });
check('EXACT_7E_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
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
const prohibitedTokens = [
  'SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08',
  'cameraId','targetName','gl_FragCoord','uTime','Date.now','performance.now','TIME_VARYING'
];
const foundProhibited = prohibitedTokens.filter((token) => candidateSource.includes(token));
check('SOURCE_HAS_NO_SCENE_CAMERA_SCREEN_OR_TIME_HACKS', foundProhibited.length === 0, { foundProhibited });
check('CANDIDATE_DERIVES_FROM_ACCEPTED_RENDERER', candidateSource.includes("from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'"));
check('CANDIDATE_CONSUMES_CANONICAL_CONTROL_FIELD', candidateSource.includes("from './terrain-control-field.cp2-round2.v1.js'") && candidateSource.includes('getHEarthTerrainControlFieldReceipt'));
check('FIXED_NONZERO_WEIGHT', candidateSource.includes('H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT = 0.72'));
check('THREE_TEXTURE_SAMPLES_DECLARED', candidateSource.includes('H_EARTH_CP7E_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT = 3'));
check('NO_DYNAMIC_OCTAVE_LOOPS_DECLARED', candidateSource.includes('H_EARTH_CP7E_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0'));
check('FLOW_AND_CURVATURE_INPUTS_PRESENT', ['downslope','crossSlope','drainage','landform','flowDelta','curvatureDelta','alongFlow','acrossFlow'].every((token) => candidateSource.includes(token)));
check('ACCEPTED_SIGNAL_PHASE_WARP_PRESENT', candidateSource.includes('CONTROL_FIELD_PHASE_WARP') && candidateSource.includes('CONTROL_FIELD_CONTOUR_AND_RAKE'));
check('INHERITED_MANOR_CAVERN_RAVINE_AND_CONTACT_TERMS_DECLARED_PRESERVED', candidateSource.includes('manorCavernRavineAndContactTermsPreserved: true') && candidateSource.includes('acceptedCp2PaletteAndAmplitudeTermsPreserved: true'));

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
  await page.waitForFunction(() => document.documentElement.dataset.cp7eReady === 'true' || document.documentElement.dataset.cp7eError === 'true', null, { timeout: 600000 });
  const failed = await page.evaluate(() => document.documentElement.dataset.cp7eError === 'true');
  if (failed) throw new Error(await page.locator('#status').textContent());
  result = await page.evaluate(() => window.H_EARTH_CP7E_RESULT);
  await page.locator('#accepted').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.accepted.png') });
  await page.locator('#candidate').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.candidate.png') });
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
const scenes = result?.scenes ?? [];
check('ALL_EIGHT_SCENES_EXECUTED', scenes.length === 8, { actual: scenes.length });
check('ALL_CAMERA_STATES_LAWFUL', scenes.every((record) => record.cameraChunkId !== null), { failures: scenes.filter((record) => record.cameraChunkId === null).map((record) => record.scene.id) });
check('ALL_DEPTH_MASKS_EXACT', scenes.every((record) => record.depthMaskExact === true), { failures: scenes.filter((record) => !record.depthMaskExact).map((record) => record.scene.id) });
check('ALL_CANDIDATE_FIXED_FRAMES_EXACT', scenes.every((record) => record.candidateFixedFrameExact === true && record.candidateHash === record.repeatedCandidateHash), { failures: scenes.filter((record) => !record.candidateFixedFrameExact || record.candidateHash !== record.repeatedCandidateHash).map((record) => record.scene.id) });
const primaryScenes = scenes.filter((record) => record.scene.role === 'PRIMARY');
check('ALL_PRIMARY_SCENES_MATERIALLY_DIFFERENT', primaryScenes.length === 5 && primaryScenes.every((record) => record.colorBytesExact === false && record.difference.changedPixelRatio >= authority.constructionGates.minimumChangedPixelRatioPerPrimaryScene), { primaryScenes: primaryScenes.map((record) => ({ id: record.scene.id, exact: record.colorBytesExact, changedPixelRatio: record.difference.changedPixelRatio })) });
check('ALL_SCENE_DELTAS_BOUNDED', scenes.every((record) => record.difference.meanAbsoluteRgbByteDelta <= authority.constructionGates.maximumMeanAbsoluteByteDeltaPerScene), { sceneDeltas: scenes.map((record) => ({ id: record.scene.id, meanAbsoluteRgbByteDelta: record.difference.meanAbsoluteRgbByteDelta })) });
check('CANDIDATE_PROFILE_ACTIVE', result.profile === result.expectedProfile, { actual: result.profile, expected: result.expectedProfile });
check('WEBGL_CONTEXT_STABLE', result.contextLoss.accepted === 0 && result.contextLoss.candidate === 0 && result.receipts.accepted.context.lost === false && result.receipts.candidate.context.lost === false, { contextLoss: result.contextLoss });

const acceptedReceipt = result.receipts.accepted;
const candidateReceipt = result.receipts.candidate;
check('CANONICAL_PACKAGE_IDENTITY_PRESERVED', candidateReceipt.package.runtimeIdentity === acceptedReceipt.package.runtimeIdentity && candidateReceipt.package.runtimeContentDigest === acceptedReceipt.package.runtimeContentDigest);
check('CONTROL_FIELD_DIGEST_EXACT', candidateReceipt.controlField.canonicalSha256 === authority.controllingBasis.canonicalControlFieldSha256, { actual: candidateReceipt.controlField.canonicalSha256, expected: authority.controllingBasis.canonicalControlFieldSha256 });
check('ONE_NEW_PERSISTENT_TEXTURE', candidateReceipt.persistentObjectCounts.textures === acceptedReceipt.persistentObjectCounts.textures + 1 && candidateReceipt.counters.textureCreateCount === acceptedReceipt.counters.textureCreateCount + 1);
check('CONTROL_TEXTURE_UPLOAD_AND_MIPMAP_PASS', candidateReceipt.controlFieldTexture.created === true && candidateReceipt.controlFieldTexture.baseUploadCount === 1 && candidateReceipt.controlFieldTexture.mipmapsGenerated === true);
check('ACTIVE_BOUNDED_SYNTHESIS_PASS', candidateReceipt.controlFieldTexture.shaderSamplePathActive === true && candidateReceipt.controlFieldTexture.samplesPerTerrainFragment === 3 && candidateReceipt.controlFieldTexture.materialModulationWeight === 0.72 && candidateReceipt.controlFieldTexture.dynamicProceduralOctaveLoops === 0);
check('NO_POST_INITIALIZATION_CONTROL_RESOURCE_WORK', candidateReceipt.controlFieldTexture.postInitializationCreationCount === 0 && candidateReceipt.controlFieldTexture.postInitializationUploadCount === 0 && candidateReceipt.noPostInitializationResourceCreation === true && candidateReceipt.noPostInitializationBufferUpload === true);
check('RESOURCE_IDENTITY_STABLE', candidateReceipt.resourceIdentityStable === true && candidateReceipt.packageUploadedOnce === true);
check('LIVE_ADMISSION_REMAINS_PROHIBITED', authority.boundaries.liveAdmissionAuthorized === false && authority.boundaries.liveDefaultPromotionAuthorized === false && authority.boundaries.liveRouteChanged === false);

const stable = {
  receiptType: 'H_EARTH_CP7E_BOUNDED_MATERIAL_SYNTHESIS_RECEIPT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7E',
  result: failures.length === 0 ? authority.result : 'CP7E_BOUNDED_MATERIAL_SYNTHESIS_FAIL',
  pass: failures.length === 0,
  exactBaseHead: BASE,
  executedHead: head,
  changedPaths,
  candidateRendererPath: authority.candidateRendererPath,
  candidateSourceSha256: sha256(candidateSource),
  canonicalControlFieldSha256: candidateReceipt?.controlField?.canonicalSha256 ?? null,
  sceneCount: scenes.length,
  primaryMateriallyDifferentCount: primaryScenes.filter((record) => record.colorBytesExact === false && record.difference.changedPixelRatio >= authority.constructionGates.minimumChangedPixelRatioPerPrimaryScene).length,
  exactDepthSceneCount: scenes.filter((record) => record.depthMaskExact).length,
  deterministicCandidateSceneCount: scenes.filter((record) => record.candidateFixedFrameExact).length,
  maximumMeanAbsoluteRgbByteDelta: Math.max(0, ...scenes.map((record) => record.difference.meanAbsoluteRgbByteDelta)),
  controlTexture: candidateReceipt?.controlFieldTexture ?? null,
  liveRouteChanged: false,
  fullEngineeringAcceptancePerformed: false,
  checkpoint7FAuthorized: failures.length === 0,
  checks,
  failureCount: failures.length,
  failures,
  resultDetail: result
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
