import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE = '1bc16f081b718c99d07440d6d2fb70270df6f935';
const CONTROL_PATH = 'h-earth-3d/control-plane/post-cp2-round2/baked-material/h-earth.bm5-engineering-control.v1.json';
const SHIM_PATH = 'h-earth-3d/validation/baked-material/bm5/h-earth.bm5-candidate-shim.mjs';
const HARNESS_PATH = 'h-earth-3d/validation/baked-material/bm5/h-earth.bm5-engineering-harness.html';
const RUNNER_PATH = 'h-earth-3d/validation/baked-material/h-earth.bm5-engineering.runner.mjs';
const WORKFLOW_PATH = '.github/workflows/h-earth-bm5-baked-material-engineering.yml';
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/baked-material/h-earth.bm5-engineering.receipt.v1.json');
const EVIDENCE_DIR = path.join(ROOT, 'h-earth-3d/validation/baked-material/bm5-evidence');
const HARNESS_URL = process.env.BM5_HARNESS_URL ?? 'http://127.0.0.1:4181/h-earth-3d/validation/baked-material/bm5/h-earth.bm5-engineering-harness.html';
const control = JSON.parse(fs.readFileSync(path.join(ROOT, CONTROL_PATH), 'utf8'));
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${BASE}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [WORKFLOW_PATH, CONTROL_PATH, SHIM_PATH, HARNESS_PATH, RUNNER_PATH].sort();
check('EXACT_BM5_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('BM5_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_BM4_BASE', git('merge-base', BASE, head) === BASE, { base: BASE, head });

const frozen = {
  ACCEPTED_RENDERER: { path: control.acceptedCp2RendererPath, blob: control.acceptedCp2RendererBlob },
  CANDIDATE_RENDERER: { path: control.candidateRendererPath, blob: control.candidateRendererBlob },
  BAKED_METADATA: { path: 'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.js', blob: '9c77949d65ae80ead054138d7ee932e41a2a86d0' },
  TERRAIN: { path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js', blob: '0bd36eec01a75311bf6441d575bae5a057195bbc' },
  LIVE_HOST: { path: 'showroom/globe/h-earth/index.html', blob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a' },
  LIVE_BINDING: { path: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js', blob: '5eb1b6f2e72ac0525f608850234182b2c646f66f' }
};
for (const [id, record] of Object.entries(frozen)) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_FROZEN`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}
const bakedBytes = fs.readFileSync(path.join(ROOT, control.bakedMapPath));
check('BAKED_MAP_BYTE_LENGTH_FROZEN', bakedBytes.byteLength === control.bakedMapByteLength, { actual: bakedBytes.byteLength, expected: control.bakedMapByteLength });
check('BAKED_MAP_SHA256_FROZEN', sha256(bakedBytes) === control.bakedMapSha256, { actual: sha256(bakedBytes), expected: control.bakedMapSha256 });
const candidateSource = fs.readFileSync(path.join(ROOT, control.candidateRendererPath), 'utf8');
check('CANDIDATE_SOURCE_SHA256_FROZEN', sha256(candidateSource) === control.candidateSourceSha256, { actual: sha256(candidateSource), expected: control.candidateSourceSha256 });
const prohibitedTokens = ['SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08','cameraId','targetName','gl_FragCoord','uTime','Date.now','performance.now','Math.random'];
const foundProhibited = prohibitedTokens.filter((token) => candidateSource.includes(token));
check('CANDIDATE_SOURCE_HAS_NO_PROHIBITED_TECHNIQUES', foundProhibited.length === 0, { foundProhibited });
check('BAKED_ARCHITECTURE_FROZEN', candidateSource.includes('H_EARTH_BM4_TERRAIN_TEXTURE_SAMPLES_PER_FRAGMENT = 1') && candidateSource.includes('H_EARTH_BM4_CONTROL_FIELD_TEXTURE_SAMPLES = 0') && candidateSource.includes('H_EARTH_BM4_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0') && candidateSource.includes('BAKED_GENERIC_TERRAIN_BASE'));

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(900000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let result = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.bm5Ready === 'true' || document.documentElement.dataset.bm5Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.bm5Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_BM5_ENGINEERING.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_BM5_ENGINEERING.renderScene(id), sceneId);
    await page.locator('#cp2-canvas').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.cp2.png`) });
    await page.locator('#candidate-canvas').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.candidate.png`) });
  }
  result = await page.evaluate(() => window.H_EARTH_BM5_ENGINEERING.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
const scenes = result?.scenes ?? [];
check('ALL_EIGHT_SCENES_EXECUTED', scenes.length === 8, { actual: scenes.length });
check('ALL_EIGHT_TARGETS_PROJECT', scenes.every((record) => record.targetProjection?.visible === true), { failures: scenes.filter((record) => record.targetProjection?.visible !== true).map((record) => record.scene.id) });
check('ALL_CAMERA_STATES_LAWFUL', scenes.every((record) => record.cameraChunkId !== null));
check('ALL_EIGHT_FRAMEBUFFER_READBACKS', scenes.every((record) => record.cp2?.metrics?.pixelCount > 0 && record.candidate?.metrics?.pixelCount > 0 && record.cp2.metrics.byteHash && record.candidate.metrics.byteHash));
check('ALL_FRAMEBUFFERS_ALPHA_CLOSED', scenes.every((record) => record.cp2.metrics.alphaClosedCount === record.cp2.metrics.pixelCount && record.candidate.metrics.alphaClosedCount === record.candidate.metrics.pixelCount));
check('CANDIDATE_PROFILE_ACTIVE', result?.profile === control.candidateProfile, { actual: result?.profile, expected: control.candidateProfile });
check('ALL_DEPTH_MASKS_IDENTICAL', scenes.every((record) => record.depthMaskIdentity === true), { failures: scenes.filter((record) => !record.depthMaskIdentity).map((record) => record.scene.id) });
check('ALL_FIXED_CAMERA_FRAMES_DETERMINISTIC', scenes.every((record) => record.fixedFrameDeterministic === true));
check('LOW_DIFFERENTIATION_SCENE_COUNT_WITHIN_GATE', (result?.aggregates?.lowDifferentiationScenes?.length ?? 99) <= control.gates.maximumLowDifferentiationScenes, { scenes: result?.aggregates?.lowDifferentiationScenes });
check('AGGREGATE_COLOR_GATE_PRESERVED', result.aggregates.candidateColorRatioVersusCp1 >= control.gates.minimumAggregateColorRatioVersusCp1, { actual: result.aggregates.candidateColorRatioVersusCp1, minimum: control.gates.minimumAggregateColorRatioVersusCp1 });
check('AGGREGATE_EDGE_GATE_PRESERVED', result.aggregates.candidateEdgeRatioVersusCp1 >= control.gates.minimumAggregateEdgeRatioVersusCp1, { actual: result.aggregates.candidateEdgeRatioVersusCp1, minimum: control.gates.minimumAggregateEdgeRatioVersusCp1 });
const retentionFailures = scenes.filter((record) => record.colorRetention < control.gates.minimumAcceptedCp2PerSceneRetention || record.edgeRetention < control.gates.minimumAcceptedCp2PerSceneRetention);
check('ALL_SCENE_CP2_RETENTION_GATES_PASS', retentionFailures.length === 0, { failures: retentionFailures.map((record) => ({ id: record.scene.id, colorRetention: record.colorRetention, edgeRetention: record.edgeRetention })) });
const scene07 = scenes.find((record) => record.scene.id === 'SCENE_07_MANOR_SITE_APPROACH');
const scene08 = scenes.find((record) => record.scene.id === 'SCENE_08_CAVERN_RELATION_APPROACH');
check('SCENE_07_EXPLICIT_GATES_PASS', scene07?.candidate.metrics.sampledColorBucketCount >= control.gates.scene07MinimumColorBuckets && scene07?.candidate.metrics.meanAdjacentChannelDifference >= control.gates.scene07MinimumEdgeSignal, { metrics: scene07?.candidate.metrics });
check('SCENE_08_EXPLICIT_GATE_PASS', scene08?.candidate.metrics.meanAdjacentChannelDifference >= control.gates.scene08MinimumEdgeSignal, { metrics: scene08?.candidate.metrics });
const regressionFailures = scenes.filter((record) => control.regressionWitnesses.includes(record.scene.id) && (record.colorRetention < control.gates.minimumAcceptedCp2PerSceneRetention || record.edgeRetention < control.gates.minimumAcceptedCp2PerSceneRetention));
check('SCENES_03_04_06_REGRESSION_PASS', regressionFailures.length === 0, { failures: regressionFailures.map((record) => ({ id: record.scene.id, colorRetention: record.colorRetention, edgeRetention: record.edgeRetention })) });
check('CP4_FULL_FRAME_AGGREGATE_REPORTED', Number.isFinite(result.aggregates.fullFrameRepetitionRatio), { ratio: result.aggregates.fullFrameRepetitionRatio });
const fullFrameSceneFailures = scenes.filter((record) => record.fullFrameRepetitionRatio > control.gates.cp4FullFramePerSceneMaximumRelativeToCp2 || record.cp2.fullFrameRepetition.eligibleFraction < 0.2 || record.candidate.fullFrameRepetition.eligibleFraction < 0.2);
check('CP4_FULL_FRAME_PER_SCENE_DIAGNOSTIC_GATES_PASS', fullFrameSceneFailures.length === 0, { failures: fullFrameSceneFailures.map((record) => ({ id: record.scene.id, ratio: record.fullFrameRepetitionRatio })) });
check('MATERIAL_REPETITION_AGGREGATE_GATE_PASS', result.aggregates.materialRepetitionRatio <= control.gates.materialRepetitionAggregateMaximumRelativeToCp2, { actual: result.aggregates.materialRepetitionRatio, maximum: control.gates.materialRepetitionAggregateMaximumRelativeToCp2 });
const materialSceneFailures = scenes.filter((record) => record.materialRepetitionRatio > control.gates.materialRepetitionPerSceneMaximumRelativeToCp2 || record.cp2.materialRepetition.eligibleFraction < control.materialMetric.minimumEligiblePixelFraction || record.candidate.materialRepetition.eligibleFraction < control.materialMetric.minimumEligiblePixelFraction || !['micro','meso','broadMaterial'].every((band) => Number.isFinite(record.cp2.materialRepetition.bands[band]) && Number.isFinite(record.candidate.materialRepetition.bands[band])));
check('MATERIAL_REPETITION_PER_SCENE_GATES_PASS', materialSceneFailures.length === 0, { failures: materialSceneFailures.map((record) => ({ id: record.scene.id, ratio: record.materialRepetitionRatio })) });
check('MOTION_REPLAY_DETERMINISTIC', result.motion.deterministicReplay === true, { motion: result.motion });
check('MEDIAN_PRESENTATION_RESPONSE_GATE_PASS', result.motion.medianRatio <= control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2, { actual: result.motion.medianRatio, maximum: control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2 });
check('P95_PRESENTATION_RESPONSE_GATE_PASS', result.motion.p95Ratio <= control.gates.candidateP95PresentationResponseMaximumRelativeToCp2, { actual: result.motion.p95Ratio, maximum: control.gates.candidateP95PresentationResponseMaximumRelativeToCp2 });
check('MOBILE_MEDIAN_PRESENTATION_RESPONSE_GATE_PASS', result.mobileMotion.medianRatio <= control.gates.mobileMedianPresentationResponseMaximumRelativeToCp2, { actual: result.mobileMotion.medianRatio, maximum: control.gates.mobileMedianPresentationResponseMaximumRelativeToCp2 });
check('MOBILE_P95_PRESENTATION_RESPONSE_GATE_PASS', result.mobileMotion.p95Ratio <= control.gates.mobileP95PresentationResponseMaximumRelativeToCp2, { actual: result.mobileMotion.p95Ratio, maximum: control.gates.mobileP95PresentationResponseMaximumRelativeToCp2 });
check('WEBGL_CONTEXT_STABLE', Object.values(result.contextLoss).every((count) => count === control.gates.webglContextLossCount) && [result.receipts.cp2, result.receipts.candidate, result.receipts.cp2Mobile, result.receipts.candidateMobile].every((receipt) => receipt.context.lost === false), { contextLoss: result.contextLoss });
const candidateResources = result.receipts.candidate;
const candidateMobileResources = result.receipts.candidateMobile;
check('CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED', candidateResources.package.runtimeIdentity === result.receipts.cp2.package.runtimeIdentity && candidateResources.package.runtimeContentDigest === result.receipts.cp2.package.runtimeContentDigest && candidateResources.packageUploadedOnce === true && candidateResources.resourceIdentityStable === true && candidateResources.noPostInitializationResourceCreation === true && candidateResources.noPostInitializationBufferUpload === true && candidateMobileResources.packageUploadedOnce === true && candidateMobileResources.resourceIdentityStable === true && candidateMobileResources.noPostInitializationResourceCreation === true && candidateMobileResources.noPostInitializationBufferUpload === true);
const law = control.bakedResourceLaw;
check('BAKED_MATERIAL_RESOURCE_LAW_PRESERVED', candidateResources.bakedMaterialField?.canonicalSha256 === control.bakedMapSha256 && candidateResources.bakedMaterialField?.width === control.bakedMapWidth && candidateResources.bakedMaterialField?.height === control.bakedMapHeight && candidateResources.bakedMaterialField?.byteLength === control.bakedMapByteLength && candidateResources.bakedMaterialTexture?.created === true && candidateResources.bakedMaterialTexture?.baseUploadCount === law.baseUploadCount && candidateResources.bakedMaterialTexture?.mipmapsGenerated === law.mipmapsGenerated && candidateResources.bakedMaterialTexture?.samplesPerTerrainFragment === law.samplesPerTerrainFragment && candidateResources.bakedMaterialTexture?.controlFieldSamples === law.controlFieldSamples && candidateResources.bakedMaterialTexture?.dynamicProceduralOctaveLoops === law.dynamicProceduralOctaveLoops && candidateResources.bakedMaterialTexture?.postInitializationCreationCount === law.postInitializationCreationCount && candidateResources.bakedMaterialTexture?.postInitializationUploadCount === law.postInitializationUploadCount, { bakedMaterialField: candidateResources.bakedMaterialField, bakedMaterialTexture: candidateResources.bakedMaterialTexture });

const checkById = new Map(checks.map((record) => [record.id, record]));
const rollbackIds = ['EXACT_BM5_PATH_SCOPE','BM5_HAS_NO_PRODUCT_MUTATION','EXACT_BM4_BASE','ACCEPTED_RENDERER_BLOB_FROZEN','CANDIDATE_RENDERER_BLOB_FROZEN','BAKED_METADATA_BLOB_FROZEN','TERRAIN_BLOB_FROZEN','LIVE_HOST_BLOB_FROZEN','LIVE_BINDING_BLOB_FROZEN','BAKED_MAP_BYTE_LENGTH_FROZEN','BAKED_MAP_SHA256_FROZEN','CANDIDATE_SOURCE_SHA256_FROZEN','CANDIDATE_SOURCE_HAS_NO_PROHIBITED_TECHNIQUES','ALL_DEPTH_MASKS_IDENTICAL','SCENES_03_04_06_REGRESSION_PASS','WEBGL_CONTEXT_STABLE','CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED','BAKED_MATERIAL_RESOURCE_LAW_PRESERVED'];
const rollback = rollbackIds.some((id) => checkById.get(id)?.passed === false);
const materialImprovement = result.aggregates.materialRepetitionRatio < 0.98;
const allPass = failures.length === 0;
const disposition = allPass
  ? 'ROUND2_BAKED_MATERIAL_PASS_ENGINEERING'
  : rollback
    ? 'ROUND2_BAKED_MATERIAL_REGRESSION_ROLLBACK'
    : materialImprovement
      ? 'ROUND2_BAKED_MATERIAL_PARTIAL_IMPROVEMENT_REMAINS_BLOCKED'
      : 'ROUND2_BAKED_MATERIAL_NO_MATERIAL_IMPROVEMENT_STOP';
const receipt = {
  receiptType: 'H_EARTH_BM5_BAKED_MATERIAL_ENGINEERING_RECEIPT_v1',
  checkpoint: 'BM5',
  disposition,
  passEngineering: disposition === 'ROUND2_BAKED_MATERIAL_PASS_ENGINEERING',
  baseHead: BASE,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  acceptedRendererBlob: git('hash-object', control.acceptedCp2RendererPath),
  candidateRendererBlob: git('hash-object', control.candidateRendererPath),
  candidateSourceSha256: sha256(candidateSource),
  bakedMapSha256: sha256(bakedBytes),
  checks,
  failureCount: failures.length,
  failures,
  result,
  liveCandidateAuthorized: false,
  liveDefaultPromotionAuthorized: false,
  checkpointBM6Authorized: disposition === 'ROUND2_BAKED_MATERIAL_PASS_ENGINEERING',
  stoppingBoundary: disposition === 'ROUND2_BAKED_MATERIAL_PASS_ENGINEERING' ? 'STOP_BEFORE_BM6_QUERY_GATED_LIVE_ADMISSION' : 'STOP_AT_BM5_ENGINEERING_DISPOSITION'
};
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
