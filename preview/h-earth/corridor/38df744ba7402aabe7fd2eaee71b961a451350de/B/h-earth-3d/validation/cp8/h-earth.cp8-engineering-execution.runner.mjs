import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE = '695c1ee789db2f2c3080f4ebe1536efbebde53a6';
const CONTROL_PATH = 'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp8-engineering-execution-control.v1.json';
const BROWSER_PATH = 'h-earth-3d/validation/cp8/h-earth.cp8-engineering-browser.mjs';
const HARNESS_PATH = 'h-earth-3d/validation/cp8/h-earth.cp8-engineering-harness.html';
const RUNNER_PATH = 'h-earth-3d/validation/cp8/h-earth.cp8-engineering-execution.runner.mjs';
const WORKFLOW_PATH = '.github/workflows/h-earth-cp8-engineering-execution.yml';
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/cp8/h-earth.cp8-engineering-execution.receipt.v1.json');
const EVIDENCE_DIR = path.join(ROOT, 'h-earth-3d/validation/cp8/cp8-evidence');
const HARNESS_URL = process.env.CP8_HARNESS_URL ?? 'http://127.0.0.1:4179/h-earth-3d/validation/cp8/h-earth.cp8-engineering-harness.html';
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
const expectedPaths = [WORKFLOW_PATH, CONTROL_PATH, BROWSER_PATH, HARNESS_PATH, RUNNER_PATH].sort();
check('EXACT_CP8_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('CP8_HAS_NO_PRODUCT_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/')) });
check('EXACT_CP7G_BASE', git('merge-base', BASE, head) === BASE, { base: BASE, head });

const frozen = {
  ACCEPTED_RENDERER: { path: control.acceptedCp2RendererPath, blob: control.acceptedCp2RendererBlob },
  CANDIDATE_RENDERER: { path: control.candidateRendererPath, blob: control.candidateRendererBlob },
  CONTROL_FIELD_GENERATOR: { path: 'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js', blob: '95f33f67d83921425dc44b273cac74764855a626' },
  TERRAIN: { path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js', blob: '0bd36eec01a75311bf6441d575bae5a057195bbc' },
  LIVE_HOST: { path: 'showroom/globe/h-earth/index.html', blob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a' },
  LIVE_BINDING: { path: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js', blob: '5eb1b6f2e72ac0525f608850234182b2c646f66f' }
};
for (const [id, record] of Object.entries(frozen)) {
  const actual = git('hash-object', record.path);
  check(`${id}_BLOB_FROZEN`, actual === record.blob, { path: record.path, expected: record.blob, actual });
}
const candidateSource = fs.readFileSync(path.join(ROOT, control.candidateRendererPath), 'utf8');
check('CANDIDATE_SOURCE_SHA256_FROZEN', sha256(candidateSource) === control.candidateSourceSha256, { actual: sha256(candidateSource), expected: control.candidateSourceSha256 });
const prohibitedTokens = ['SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08','cameraId','targetName','gl_FragCoord','uTime','Date.now','performance.now','Math.random'];
const foundProhibited = prohibitedTokens.filter((token) => candidateSource.includes(token));
check('CANDIDATE_SOURCE_HAS_NO_PROHIBITED_TECHNIQUES', foundProhibited.length === 0, { foundProhibited });
check('CONTROL_FIELD_ARCHITECTURE_FROZEN', candidateSource.includes('H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT = 0.72') && candidateSource.includes('H_EARTH_CP7E_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT = 3') && candidateSource.includes('H_EARTH_CP7E_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0'));

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
  await page.waitForFunction(() => document.documentElement.dataset.cp8Ready === 'true' || document.documentElement.dataset.cp8Error === 'true', null, { timeout: 600000 });
  const harnessFailed = await page.evaluate(() => document.documentElement.dataset.cp8Error === 'true');
  if (harnessFailed) throw new Error(await page.locator('#status').textContent());
  const sceneIds = await page.evaluate(() => window.H_EARTH_CP8_ENGINEERING.listSceneIds());
  for (const sceneId of sceneIds) {
    await page.evaluate((id) => window.H_EARTH_CP8_ENGINEERING.renderScene(id), sceneId);
    await page.locator('#cp2-canvas').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.cp2.png`) });
    await page.locator('#candidate-canvas').screenshot({ path: path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.candidate.png`) });
  }
  result = await page.evaluate(() => window.H_EARTH_CP8_ENGINEERING.finalize());
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === control.gates.browserConsoleErrors && pageErrors.length === control.gates.pageErrors, { consoleErrors, pageErrors });
const scenes = result?.scenes ?? [];
check('ALL_EIGHT_SCENES_EXECUTED', scenes.length === 8, { actual: scenes.length });
check('ALL_EIGHT_TARGETS_PROJECT', scenes.every((record) => record.targetProjection?.visible === true), { failures: scenes.filter((record) => record.targetProjection?.visible !== true).map((record) => record.scene.id) });
check('ALL_CAMERA_STATES_LAWFUL', scenes.every((record) => record.cameraChunkId !== null), { failures: scenes.filter((record) => record.cameraChunkId === null).map((record) => record.scene.id) });
check('ALL_EIGHT_FRAMEBUFFER_READBACKS', scenes.every((record) => record.cp2?.metrics?.pixelCount > 0 && record.candidate?.metrics?.pixelCount > 0 && record.cp2.metrics.byteHash && record.candidate.metrics.byteHash));
check('ALL_FRAMEBUFFERS_ALPHA_CLOSED', scenes.every((record) => record.cp2.metrics.alphaClosedCount === record.cp2.metrics.pixelCount && record.candidate.metrics.alphaClosedCount === record.candidate.metrics.pixelCount));
check('CANDIDATE_PROFILE_ACTIVE', result?.profile === control.candidateProfile, { actual: result?.profile, expected: control.candidateProfile });
check('ALL_DEPTH_MASKS_IDENTICAL', scenes.every((record) => record.depthMaskIdentity === true), { failures: scenes.filter((record) => !record.depthMaskIdentity).map((record) => record.scene.id) });
check('ALL_FIXED_CAMERA_FRAMES_DETERMINISTIC', scenes.every((record) => record.fixedFrameDeterministic === true), { failures: scenes.filter((record) => !record.fixedFrameDeterministic).map((record) => record.scene.id) });

check('LOW_DIFFERENTIATION_SCENE_COUNT_WITHIN_GATE', (result?.aggregates?.lowDifferentiationScenes?.length ?? 99) <= control.gates.maximumLowDifferentiationScenes, { scenes: result?.aggregates?.lowDifferentiationScenes, maximum: control.gates.maximumLowDifferentiationScenes });
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

check('CP4_FULL_FRAME_AGGREGATE_REPORTED', Number.isFinite(result.aggregates.fullFrameRepetitionRatio), { ratio: result.aggregates.fullFrameRepetitionRatio, gateRequired: false });
const fullFrameSceneFailures = scenes.filter((record) => record.fullFrameRepetitionRatio > control.gates.cp4FullFramePerSceneMaximumRelativeToCp2 || record.cp2.fullFrameRepetition.eligibleFraction < 0.2 || record.candidate.fullFrameRepetition.eligibleFraction < 0.2);
check('CP4_FULL_FRAME_PER_SCENE_DIAGNOSTIC_GATES_PASS', fullFrameSceneFailures.length === 0, { failures: fullFrameSceneFailures.map((record) => ({ id: record.scene.id, ratio: record.fullFrameRepetitionRatio, cp2Eligible: record.cp2.fullFrameRepetition.eligibleFraction, candidateEligible: record.candidate.fullFrameRepetition.eligibleFraction })) });
check('MATERIAL_REPETITION_AGGREGATE_GATE_PASS', result.aggregates.materialRepetitionRatio <= control.gates.materialRepetitionAggregateMaximumRelativeToCp2, { actual: result.aggregates.materialRepetitionRatio, maximum: control.gates.materialRepetitionAggregateMaximumRelativeToCp2 });
const materialSceneFailures = scenes.filter((record) => record.materialRepetitionRatio > control.gates.materialRepetitionPerSceneMaximumRelativeToCp2 || record.cp2.materialRepetition.eligibleFraction < control.materialMetric.minimumEligiblePixelFraction || record.candidate.materialRepetition.eligibleFraction < control.materialMetric.minimumEligiblePixelFraction || !['micro','meso','broadMaterial'].every((band) => Number.isFinite(record.cp2.materialRepetition.bands[band]) && Number.isFinite(record.candidate.materialRepetition.bands[band])));
check('MATERIAL_REPETITION_PER_SCENE_GATES_PASS', materialSceneFailures.length === 0, { failures: materialSceneFailures.map((record) => ({ id: record.scene.id, ratio: record.materialRepetitionRatio, cp2Eligible: record.cp2.materialRepetition.eligibleFraction, candidateEligible: record.candidate.materialRepetition.eligibleFraction, cp2Bands: record.cp2.materialRepetition.bands, candidateBands: record.candidate.materialRepetition.bands })) });

check('MOTION_REPLAY_DETERMINISTIC', result.motion.deterministicReplay === true, { motion: result.motion });
check('MEDIAN_PRESENTATION_RESPONSE_GATE_PASS', result.motion.medianRatio <= control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2, { actual: result.motion.medianRatio, maximum: control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2 });
check('P95_PRESENTATION_RESPONSE_GATE_PASS', result.motion.p95Ratio <= control.gates.candidateP95PresentationResponseMaximumRelativeToCp2, { actual: result.motion.p95Ratio, maximum: control.gates.candidateP95PresentationResponseMaximumRelativeToCp2 });
check('MOBILE_MEDIAN_PRESENTATION_RESPONSE_GATE_PASS', result.mobileMotion.medianRatio <= control.gates.mobileMedianPresentationResponseMaximumRelativeToCp2, { actual: result.mobileMotion.medianRatio, maximum: control.gates.mobileMedianPresentationResponseMaximumRelativeToCp2 });
check('MOBILE_P95_PRESENTATION_RESPONSE_GATE_PASS', result.mobileMotion.p95Ratio <= control.gates.mobileP95PresentationResponseMaximumRelativeToCp2, { actual: result.mobileMotion.p95Ratio, maximum: control.gates.mobileP95PresentationResponseMaximumRelativeToCp2 });

check('WEBGL_CONTEXT_STABLE', Object.values(result.contextLoss).every((count) => count === control.gates.webglContextLossCount) && [result.receipts.cp2, result.receipts.candidate, result.receipts.cp2Mobile, result.receipts.candidateMobile].every((receipt) => receipt.context.lost === false), { contextLoss: result.contextLoss });
const candidateResources = result.receipts.candidate;
const candidateMobileResources = result.receipts.candidateMobile;
check('CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED', candidateResources.package.runtimeIdentity === result.receipts.cp2.package.runtimeIdentity && candidateResources.package.runtimeContentDigest === result.receipts.cp2.package.runtimeContentDigest && candidateResources.packageUploadedOnce === true && candidateResources.resourceIdentityStable === true && candidateResources.noPostInitializationResourceCreation === true && candidateResources.noPostInitializationBufferUpload === true && candidateMobileResources.packageUploadedOnce === true && candidateMobileResources.resourceIdentityStable === true && candidateMobileResources.noPostInitializationResourceCreation === true && candidateMobileResources.noPostInitializationBufferUpload === true, { candidateResources, candidateMobileResources });
check('CONTROL_FIELD_RESOURCE_LAW_PRESERVED', candidateResources.controlField?.canonicalSha256 === control.controlFieldSha256 && candidateResources.controlFieldTexture?.created === true && candidateResources.controlFieldTexture?.baseUploadCount === 1 && candidateResources.controlFieldTexture?.mipmapsGenerated === true && candidateResources.controlFieldTexture?.samplesPerTerrainFragment === 3 && candidateResources.controlFieldTexture?.materialModulationWeight === 0.72 && candidateResources.controlFieldTexture?.dynamicProceduralOctaveLoops === 0 && candidateResources.controlFieldTexture?.postInitializationCreationCount === 0 && candidateResources.controlFieldTexture?.postInitializationUploadCount === 0, { controlField: candidateResources.controlField, controlFieldTexture: candidateResources.controlFieldTexture });

const checkById = new Map(checks.map((record) => [record.id, record]));
const rollbackIds = ['EXACT_CP8_PATH_SCOPE','CP8_HAS_NO_PRODUCT_MUTATION','EXACT_CP7G_BASE','ACCEPTED_RENDERER_BLOB_FROZEN','CANDIDATE_RENDERER_BLOB_FROZEN','TERRAIN_BLOB_FROZEN','LIVE_HOST_BLOB_FROZEN','LIVE_BINDING_BLOB_FROZEN','CANDIDATE_SOURCE_SHA256_FROZEN','CANDIDATE_SOURCE_HAS_NO_PROHIBITED_TECHNIQUES','ALL_DEPTH_MASKS_IDENTICAL','SCENES_03_04_06_REGRESSION_PASS','WEBGL_CONTEXT_STABLE','CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED','CONTROL_FIELD_RESOURCE_LAW_PRESERVED'];
const rollback = rollbackIds.some((id) => checkById.get(id)?.passed === false);
const materialImprovement = result.aggregates.materialRepetitionRatio < 0.98;
const allPass = failures.length === 0;
const disposition = allPass
  ? 'ROUND2_PASS_ENGINEERING'
  : rollback
    ? 'ROUND2_REGRESSION_ROLLBACK'
    : materialImprovement
      ? 'ROUND2_PARTIAL_IMPROVEMENT_REMAINS_BLOCKED'
      : 'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP';
const receipt = {
  receiptType: 'H_EARTH_CP8_ENGINEERING_EXECUTION_RECEIPT_v1',
  checkpoint: 8,
  disposition,
  passEngineering: disposition === 'ROUND2_PASS_ENGINEERING',
  baseHead: BASE,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  acceptedRendererBlob: git('hash-object', control.acceptedCp2RendererPath),
  candidateRendererBlob: git('hash-object', control.candidateRendererPath),
  candidateSourceSha256: sha256(candidateSource),
  checks,
  failureCount: failures.length,
  failures,
  result,
  liveCandidateAuthorized: false,
  liveDefaultPromotionAuthorized: false,
  checkpoint9Authorized: disposition === 'ROUND2_PASS_ENGINEERING',
  stoppingBoundary: disposition === 'ROUND2_PASS_ENGINEERING' ? 'STOP_BEFORE_SEPARATE_QUERY_GATED_LIVE_ADMISSION' : 'STOP_AT_ENGINEERING_DISPOSITION'
};
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
