import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import authority from '../../control-plane/post-cp2-round2/baked-material/h-earth.bm4-one-sample-renderer-authority.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/baked-material/h-earth.bm4-one-sample-renderer.receipt.v1.json');
const EVIDENCE_DIR = path.join(ROOT, 'h-earth-3d/validation/baked-material/bm4-evidence');
const HARNESS_URL = process.env.BM4_HARNESS_URL ?? 'http://127.0.0.1:4180/h-earth-3d/validation/baked-material/bm4/h-earth.bm4-one-sample-renderer.harness.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, passed, status: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) failures.push({ id, detail });
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const head = git('rev-parse', 'HEAD');
const base = authority.controllingBasis.bm3MergeHead;
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
check('EXACT_BM3_BASE', git('merge-base', base, head) === base, { base, head });
check('EXACT_BM4_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify([...authority.exactPathScope].sort()), { changedPaths, expected: authority.exactPathScope });
const productPaths = changedPaths.filter((entry) => entry.startsWith('showroom/'));
check('CANDIDATE_RENDERER_ONLY_PRODUCT_MUTATION', JSON.stringify(productPaths) === JSON.stringify([authority.candidateRendererPath]), { productPaths });
for (const [id, record] of Object.entries({
  ACCEPTED_RENDERER: { path: authority.controllingBasis.acceptedRendererPath, blob: authority.controllingBasis.acceptedRendererBlob },
  TERRAIN: { path: authority.controllingBasis.terrainPath, blob: authority.controllingBasis.terrainBlob },
  LIVE_HOST: { path: authority.controllingBasis.liveHostPath, blob: authority.controllingBasis.liveHostBlob },
  LIVE_BINDING: { path: authority.controllingBasis.liveBindingPath, blob: authority.controllingBasis.liveBindingBlob },
  BAKED_METADATA: { path: authority.controllingBasis.bakedMetadataPath, blob: authority.controllingBasis.bakedMetadataBlob }
})) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_PRESERVED`, actual === record.blob, { expected: record.blob, actual });
}
const bakedRaw = fs.readFileSync(path.join(ROOT, authority.controllingBasis.bakedMapPath));
check('BAKED_MAP_DIGEST_PRESERVED', sha256(bakedRaw) === authority.controllingBasis.bakedMapSha256, { actual: sha256(bakedRaw), expected: authority.controllingBasis.bakedMapSha256 });
const candidateSource = fs.readFileSync(path.join(ROOT, authority.candidateRendererPath), 'utf8');
const prohibitedTokens = ['SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08','cameraId','targetName','gl_FragCoord','uTime','Date.now','performance.now'];
check('NO_SCENE_CAMERA_SCREEN_OR_TIME_HACKS', prohibitedTokens.every((token) => !candidateSource.includes(token)));
check('DERIVES_FROM_ACCEPTED_RENDERER', candidateSource.includes("from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'"));
check('CONSUMES_BAKED_FIELD_ONLY', candidateSource.includes("from './terrain-material-field.round2-baked.v1.js'") && !candidateSource.includes('terrain-control-field.cp2-round2.v1.js'));
check('ONE_TEXTURE_SAMPLE_DECLARED', candidateSource.includes('H_EARTH_BM4_TERRAIN_TEXTURE_SAMPLES_PER_FRAGMENT = 1'));
check('ZERO_CONTROL_SAMPLES_DECLARED', candidateSource.includes('H_EARTH_BM4_CONTROL_FIELD_TEXTURE_SAMPLES = 0'));
check('ZERO_DYNAMIC_OCTAVE_LOOPS_DECLARED', candidateSource.includes('H_EARTH_BM4_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0'));
check('GENERIC_REPEATED_FAMILY_REPLACED', candidateSource.includes("'BAKED_GENERIC_TERRAIN_BASE'") && candidateSource.includes('vec4 bakedMaterial=texture(uTerrainBakedMaterial,bakedUv);'));
check('LANDMARK_TERMS_INHERITED_BEFORE_END_MARKER', candidateSource.includes('vec2 manorCenter=vec2(80.0,-172.0);') && authority.sourceLaw.manorTermsRetained && authority.sourceLaw.cavernTermsRetained && authority.sourceLaw.ravineTermsRetained);

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
  await page.waitForFunction(() => document.documentElement.dataset.bm4Ready === 'true' || document.documentElement.dataset.bm4Error === 'true', null, { timeout: 600000 });
  const failed = await page.evaluate(() => document.documentElement.dataset.bm4Error === 'true');
  if (failed) throw new Error(await page.locator('#status').textContent());
  result = await page.evaluate(() => window.H_EARTH_BM4_RESULT);
  await page.locator('#accepted').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.accepted.png') });
  await page.locator('#candidate').screenshot({ path: path.join(EVIDENCE_DIR, 'scene-08.candidate.png') });
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
const scenes = result?.scenes ?? [];
check('ALL_EIGHT_SCENES_EXECUTED', scenes.length === 8, { actual: scenes.length });
check('ALL_CAMERA_STATES_LAWFUL', scenes.every((record) => record.cameraChunkId !== null));
check('ALL_DEPTH_MASKS_EXACT', scenes.every((record) => record.depthMaskExact === true), { failures: scenes.filter((record) => !record.depthMaskExact).map((record) => record.scene.id) });
check('ALL_CANDIDATE_FIXED_FRAMES_EXACT', scenes.every((record) => record.candidateFixedFrameExact === true && record.candidateHash === record.repeatedCandidateHash));
const materiallyDifferent = scenes.filter((record) => !record.colorBytesExact && record.difference.changedPixelRatio >= authority.constructionGates.minimumChangedPixelRatioPerMateriallyDifferentScene);
check('MATERIALLY_DIFFERENT_SCENE_COUNT', materiallyDifferent.length >= authority.constructionGates.minimumMateriallyDifferentScenes, { materiallyDifferent: materiallyDifferent.map((record) => ({ id: record.scene.id, changedPixelRatio: record.difference.changedPixelRatio })) });
check('ALL_SCENE_DELTAS_BOUNDED', scenes.every((record) => record.difference.meanAbsoluteRgbByteDelta <= authority.constructionGates.maximumMeanAbsoluteRgbByteDeltaPerScene), { deltas: scenes.map((record) => ({ id: record.scene.id, delta: record.difference.meanAbsoluteRgbByteDelta })) });
check('CANDIDATE_PROFILE_ACTIVE', result.profile === result.expectedProfile, { actual: result.profile, expected: result.expectedProfile });
check('WEBGL_CONTEXT_STABLE', result.contextLoss.accepted === 0 && result.contextLoss.candidate === 0 && result.receipts.accepted.context.lost === false && result.receipts.candidate.context.lost === false);
const acceptedReceipt = result.receipts.accepted;
const candidateReceipt = result.receipts.candidate;
check('CANONICAL_PACKAGE_IDENTITY_PRESERVED', candidateReceipt.package.runtimeIdentity === acceptedReceipt.package.runtimeIdentity && candidateReceipt.package.runtimeContentDigest === acceptedReceipt.package.runtimeContentDigest);
check('BAKED_FIELD_DIGEST_EXACT', candidateReceipt.bakedMaterialField.canonicalSha256 === authority.controllingBasis.bakedMapSha256);
check('ONE_NEW_PERSISTENT_TEXTURE', candidateReceipt.persistentObjectCounts.textures === acceptedReceipt.persistentObjectCounts.textures + 1 && candidateReceipt.counters.textureCreateCount === acceptedReceipt.counters.textureCreateCount + 1);
check('ONE_UPLOAD_AND_MIPMAP_PASS', candidateReceipt.bakedMaterialTexture.baseUploadCount === 1 && candidateReceipt.bakedMaterialTexture.mipmapsGenerated === true && candidateReceipt.bakedMaterialTexture.shaderSamplePathActive === true);
check('ONE_SAMPLE_NO_CONTROL_NO_OCTAVES', candidateReceipt.bakedMaterialTexture.samplesPerTerrainFragment === 1 && candidateReceipt.bakedMaterialTexture.controlFieldSamples === 0 && candidateReceipt.bakedMaterialTexture.dynamicProceduralOctaveLoops === 0);
check('NO_POST_INITIALIZATION_TEXTURE_WORK', candidateReceipt.bakedMaterialTexture.postInitializationCreationCount === 0 && candidateReceipt.bakedMaterialTexture.postInitializationUploadCount === 0 && candidateReceipt.noPostInitializationResourceCreation === true && candidateReceipt.noPostInitializationBufferUpload === true);
check('RESOURCE_IDENTITY_STABLE', candidateReceipt.resourceIdentityStable === true && candidateReceipt.packageUploadedOnce === true);
check('LIVE_ADMISSION_REMAINS_PROHIBITED', authority.boundaries.liveAdmissionAuthorized === false && authority.boundaries.liveDefaultPromotionAuthorized === false);

const stable = {
  receiptType: 'H_EARTH_BM4_ONE_SAMPLE_BAKED_MATERIAL_RENDERER_RECEIPT_v1',
  result: failures.length === 0 ? authority.result : 'BM4_ONE_SAMPLE_BAKED_MATERIAL_RENDERER_FAIL',
  pass: failures.length === 0,
  baseHead: base,
  executedHead: head,
  changedPaths,
  candidateRendererPath: authority.candidateRendererPath,
  candidateSourceSha256: sha256(candidateSource),
  bakedMapSha256: authority.controllingBasis.bakedMapSha256,
  sceneCount: scenes.length,
  materiallyDifferentSceneCount: materiallyDifferent.length,
  exactDepthSceneCount: scenes.filter((record) => record.depthMaskExact).length,
  deterministicSceneCount: scenes.filter((record) => record.candidateFixedFrameExact).length,
  maximumMeanAbsoluteRgbByteDelta: Math.max(0, ...scenes.map((record) => record.difference.meanAbsoluteRgbByteDelta)),
  controlTexture: candidateReceipt?.bakedMaterialTexture ?? null,
  checks,
  failureCount: failures.length,
  failures,
  checkpointBM5Authorized: failures.length === 0,
  fullEngineeringAcceptancePerformed: false,
  liveRouteChanged: false,
  resultDetail: result
};
const receipt = { ...stable, canonicalReceiptSha256: sha256(JSON.stringify(stable)) };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
