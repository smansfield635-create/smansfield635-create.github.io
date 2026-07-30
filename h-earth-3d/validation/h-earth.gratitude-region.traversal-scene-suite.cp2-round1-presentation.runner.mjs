import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CONTROL_PATH = path.join(ROOT, 'h-earth-3d/control-plane/traversal-scene-suite/h-earth.gratitude-region.traversal-scene-suite.cp2-round1-presentation.v1.json');
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/h-earth.gratitude-region.traversal-scene-suite.cp2-round1-presentation.receipt.v1.json');
const control = JSON.parse(fs.readFileSync(CONTROL_PATH, 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, control.baseline.receiptPath), 'utf8'));
const mode = process.env.CP2_EXECUTION_MODE ?? 'ENGINEERING_BRANCH';
const harnessUrl = process.env.CP2_HARNESS_URL ?? 'http://127.0.0.1:4177/h-earth-3d/validation/traversal-scene-suite/h-earth.gratitude-region.traversal-scene-suite.cp1-harness.html';
const publicRoute = process.env.CP2_PUBLIC_ROUTE ?? control.repository.publicRoute;
const evidenceDir = process.env.CP2_EVIDENCE_DIR ?? path.join(ROOT, 'h-earth-3d/validation/traversal-scene-suite/cp2-evidence');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  if (!passed) failures.push({ id, detail });
};
const startedAt = new Date().toISOString();
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const lowDifferentiation = (record) =>
  record.pixels.sampledColorBucketCount < 8 ||
  record.pixels.luminanceStandardDeviation < 2 ||
  record.pixels.meanAdjacentChannelDifference < 0.2;

const head = git(['rev-parse', 'HEAD']);
let programAncestor = true;
try {
  execFileSync('git', ['merge-base', '--is-ancestor', control.repository.cp1IntegratedProgramHead, head], { cwd: ROOT });
} catch {
  programAncestor = false;
}
check('CP1_INTEGRATED_PROGRAM_HEAD_IS_ANCESTOR', programAncestor, {
  cp1IntegratedProgramHead: control.repository.cp1IntegratedProgramHead,
  head
});
const diffPaths = git(['diff', '--name-only', `${control.repository.cp1IntegratedProgramHead}..${head}`])
  .split(/\r?\n/).filter(Boolean).sort();
const allowed = new Set(control.allowedMutationPaths);
const unauthorized = diffPaths.filter((entry) => !allowed.has(entry));
check('CP2_DELTA_IS_AUTHORIZED', unauthorized.length === 0, { diffPaths, unauthorized });
const prohibitedPrefixChanges = diffPaths.filter((entry) =>
  control.prohibitedMutationPrefixes.some((prefix) => entry.startsWith(prefix)));
check('TERRAIN_ENVIRONMENT_INTEGRATION_AND_OBJECT_SOURCES_UNCHANGED', prohibitedPrefixChanges.length === 0, {
  prohibitedPrefixChanges
});
const substantiveProductPaths = diffPaths.filter((entry) =>
  entry.startsWith('showroom/') && !control.cacheIdentityPaths.includes(entry));
check('SUBSTANTIVE_PRODUCT_MUTATION_IS_RENDERER_ONLY',
  JSON.stringify(substantiveProductPaths) === JSON.stringify(control.exactSubstantiveProductMutationPaths),
  { substantiveProductPaths, expected: control.exactSubstantiveProductMutationPaths });
check('CP1_BASELINE_RECEIPT_CLOSED', baseline.result === control.baseline.requiredResult, {
  actual: baseline.result,
  expected: control.baseline.requiredResult
});

fs.mkdirSync(evidenceDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 1 });
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let suiteIdentity = null;
let bindingReceipt = null;
const sceneRecords = [];
let publicRuntime = null;
try {
  await page.goto(`${harnessUrl}${harnessUrl.includes('?') ? '&' : '?'}cp2=${head.slice(0, 12)}-${mode}`, {
    waitUntil: 'domcontentloaded',
    timeout: 180000
  });
  await page.waitForFunction(() => document.documentElement.dataset.cp1Ready === 'true', null, { timeout: 240000 });
  suiteIdentity = await page.evaluate(() => window.H_EARTH_CP1_TRAVERSAL_SUITE.getSuiteIdentity());
  const sceneIds = await page.evaluate(() => window.H_EARTH_CP1_TRAVERSAL_SUITE.listSceneIds());
  for (const sceneId of sceneIds) {
    const record = await page.evaluate((id) => window.H_EARTH_CP1_TRAVERSAL_SUITE.renderScene(id), sceneId);
    const screenshotPath = path.join(evidenceDir, `${sceneId.toLowerCase()}.png`);
    await page.locator('#cp1-canvas').screenshot({ path: screenshotPath });
    record.screenshot = path.relative(ROOT, screenshotPath).replaceAll('\\', '/');
    delete record.pixels.fingerprint;
    sceneRecords.push(record);
  }
  bindingReceipt = await page.evaluate(() => window.H_EARTH_CP1_TRAVERSAL_SUITE.getBindingReceipt());

  if (mode === 'LIVE_PUBLIC') {
    const livePage = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const liveConsoleErrors = [];
    const livePageErrors = [];
    livePage.on('console', (message) => { if (message.type() === 'error') liveConsoleErrors.push(message.text()); });
    livePage.on('pageerror', (error) => livePageErrors.push(error.message));
    await livePage.goto(`${publicRoute}?cp2-live=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await livePage.waitForFunction(() =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true',
    null, { timeout: 240000 });
    publicRuntime = await livePage.evaluate(() => ({
      receipt: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt(),
      moduleSource: document.getElementById('h-earth-current-run8e-module')?.src ?? null,
      routeReady: document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady ?? null
    }));
    publicRuntime.consoleErrors = liveConsoleErrors;
    publicRuntime.pageErrors = livePageErrors;
    await livePage.screenshot({ path: path.join(evidenceDir, 'live-public-route-mobile.png'), fullPage: true });
    await livePage.close();
  }
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, {
  consoleErrors,
  pageErrors
});
check('ALL_EIGHT_SCENES_EXECUTED', sceneRecords.length === control.candidate.requiredSceneCount, {
  actual: sceneRecords.length,
  expected: control.candidate.requiredSceneCount
});
check('ALL_SCENE_CAMERAS_REMAIN_LAWFUL', sceneRecords.every((record) =>
  record.terrain?.navigationState && record.terrain?.cameraChunkId !== null), {
  failures: sceneRecords.filter((record) =>
    !record.terrain?.navigationState || record.terrain?.cameraChunkId === null).map((record) => record.scene.id)
});
check('ALL_AUTHORIZED_TARGETS_REMAIN_IN_FRAME', sceneRecords.every((record) => record.targetProjection?.visible === true), {
  failures: sceneRecords.filter((record) => record.targetProjection?.visible !== true)
    .map((record) => ({ id: record.scene.id, projection: record.targetProjection }))
});
const matrixKeys = new Set(sceneRecords.map((record) => JSON.stringify(record.frame.viewProjectionMatrix)));
check('EIGHT_DISTINCT_CAMERA_FRAME_EXECUTIONS',
  matrixKeys.size === control.candidate.requiredDistinctCameraMatrixCount,
  { actual: matrixKeys.size, expected: control.candidate.requiredDistinctCameraMatrixCount });
check('ALL_FRAMEBUFFER_READBACKS_EXECUTED',
  sceneRecords.every((record) => record.pixels?.pixelCount > 0 && record.pixels?.byteHash),
  { failures: sceneRecords.filter((record) => !(record.pixels?.pixelCount > 0 && record.pixels?.byteHash)).map((record) => record.scene.id) });
check('ALL_SCREENSHOTS_CAPTURED',
  sceneRecords.every((record) => fs.existsSync(path.join(ROOT, record.screenshot))),
  { failures: sceneRecords.filter((record) => !fs.existsSync(path.join(ROOT, record.screenshot))).map((record) => record.scene.id) });
check('PRESENTATION_PROFILE_ACTIVE',
  bindingReceipt?.resources?.presentationProfileId === control.candidate.presentationProfileId,
  { actual: bindingReceipt?.resources?.presentationProfileId, expected: control.candidate.presentationProfileId });
check('CANONICAL_RENDER_PACKAGE_IDENTITY_PRESERVED',
  bindingReceipt?.resources?.package?.runtimeIdentity === control.baseline.rendererPackageIdentity &&
  bindingReceipt?.resources?.package?.runtimeContentDigest === control.baseline.rendererPackageDigest,
  {
    identity: bindingReceipt?.resources?.package?.runtimeIdentity,
    digest: bindingReceipt?.resources?.package?.runtimeContentDigest
  });
check('PERSISTENT_GPU_RESOURCE_LIFECYCLE_PRESERVED',
  bindingReceipt?.resources?.packageUploadedOnce === true &&
  bindingReceipt?.resources?.resourceIdentityStable === true &&
  bindingReceipt?.resources?.noPostInitializationResourceCreation === true &&
  bindingReceipt?.resources?.noPostInitializationBufferUpload === true,
  { resources: bindingReceipt?.resources });

const baselineById = new Map(baseline.scenes.map((record) => [record.scene.id, record]));
const frameHashComparisons = sceneRecords.map((record) => ({
  id: record.scene.id,
  baseline: baselineById.get(record.scene.id)?.pixels?.byteHash ?? null,
  candidate: record.pixels.byteHash,
  changed: baselineById.get(record.scene.id)?.pixels?.byteHash !== record.pixels.byteHash
}));
check('ALL_CANDIDATE_FRAME_HASHES_DIFFER_FROM_BASELINE',
  frameHashComparisons.every((entry) => entry.changed),
  { frameHashComparisons });
const alphaFailures = sceneRecords.filter((record) => record.pixels.alphaClosedCount !== record.pixels.pixelCount);
check('ALL_CANDIDATE_FRAMEBUFFERS_ALPHA_CLOSED', alphaFailures.length === 0, {
  alphaFailures: alphaFailures.map((record) => ({
    id: record.scene.id,
    alphaClosedCount: record.pixels.alphaClosedCount,
    pixelCount: record.pixels.pixelCount
  }))
});

const baselineLow = baseline.scenes.filter(lowDifferentiation);
const candidateLow = sceneRecords.filter(lowDifferentiation);
const baselineBucketMean = average(baseline.scenes.map((record) => record.pixels.sampledColorBucketCount));
const candidateBucketMean = average(sceneRecords.map((record) => record.pixels.sampledColorBucketCount));
const baselineEdgeMean = average(baseline.scenes.map((record) => record.pixels.meanAdjacentChannelDifference));
const candidateEdgeMean = average(sceneRecords.map((record) => record.pixels.meanAdjacentChannelDifference));
const bucketRatio = candidateBucketMean / Math.max(0.000001, baselineBucketMean);
const edgeRatio = candidateEdgeMean / Math.max(0.000001, baselineEdgeMean);
check('LOW_DIFFERENTIATION_SCENE_COUNT_REDUCED',
  baselineLow.length === control.baseline.requiredLowDifferentiationSceneCount &&
  candidateLow.length <= control.candidate.maximumLowDifferentiationSceneCount,
  {
    baseline: baselineLow.map((record) => record.scene.id),
    candidate: candidateLow.map((record) => record.scene.id),
    maximumCandidate: control.candidate.maximumLowDifferentiationSceneCount
  });
check('AGGREGATE_COLOR_DIFFERENTIATION_IMPROVED',
  bucketRatio >= control.candidate.minimumAggregateColorBucketRatio,
  { baselineBucketMean, candidateBucketMean, bucketRatio, minimum: control.candidate.minimumAggregateColorBucketRatio });
check('AGGREGATE_EDGE_SIGNAL_IMPROVED',
  edgeRatio >= control.candidate.minimumAggregateEdgeSignalRatio,
  { baselineEdgeMean, candidateEdgeMean, edgeRatio, minimum: control.candidate.minimumAggregateEdgeSignalRatio });
for (const sceneId of ['SCENE_07_MANOR_SITE_APPROACH', 'SCENE_08_CAVERN_RELATION_APPROACH']) {
  const before = baselineById.get(sceneId);
  const after = sceneRecords.find((record) => record.scene.id === sceneId);
  check(`${sceneId}_DIFFERENTIATION_IMPROVED`,
    after.pixels.sampledColorBucketCount > before.pixels.sampledColorBucketCount &&
    after.pixels.meanAdjacentChannelDifference > before.pixels.meanAdjacentChannelDifference,
    { baseline: before.pixels, candidate: after.pixels });
}

if (mode === 'LIVE_PUBLIC') {
  const productPath = 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js';
  const localBytes = fs.readFileSync(path.join(ROOT, productPath));
  let served = null;
  let servedError = null;
  try {
    const response = await fetch(new URL(`/${productPath}?cp2=${head.slice(0, 12)}`, new URL(publicRoute).origin), {
      headers: { 'cache-control': 'no-cache' }
    });
    served = Buffer.from(await response.arrayBuffer());
    if (!response.ok) servedError = `HTTP_${response.status}`;
  } catch (error) {
    servedError = error?.message ?? String(error);
  }
  check('LIVE_RENDERER_BYTES_EQUAL_CHECKED_OUT_MAIN',
    servedError === null && served && Buffer.compare(localBytes, served) === 0,
    { servedError, localBytes: localBytes.length, servedBytes: served?.length ?? null });
  check('LIVE_PUBLIC_ROUTE_READY', publicRuntime?.routeReady === 'true', { publicRuntime });
  check('LIVE_PUBLIC_ROUTE_PRESENTATION_PROFILE_ACTIVE',
    publicRuntime?.receipt?.liveGpu?.resources?.presentationProfileId === control.candidate.presentationProfileId,
    { actual: publicRuntime?.receipt?.liveGpu?.resources?.presentationProfileId, expected: control.candidate.presentationProfileId });
  check('LIVE_PUBLIC_ROUTE_BROWSER_CLEAN',
    publicRuntime?.consoleErrors?.length === 0 && publicRuntime?.pageErrors?.length === 0,
    { consoleErrors: publicRuntime?.consoleErrors, pageErrors: publicRuntime?.pageErrors });
}

const engineeringPass = failures.length === 0;
const result = engineeringPass
  ? (mode === 'LIVE_PUBLIC' ? control.checkpoint.liveResult : control.checkpoint.engineeringResult)
  : 'BLOCKED';
const receipt = {
  schemaVersion: 'H_EARTH_GRATITUDE_REGION_TRAVERSAL_SCENE_SUITE_CP2_ROUND_1_PRESENTATION_RECEIPT_v1',
  checkpoint: control.checkpoint.id,
  mode,
  result,
  startedAt,
  completedAt: new Date().toISOString(),
  repository: {
    head,
    currentMainAtCheckpointOpen: control.repository.currentMainAtCheckpointOpen,
    cp1IntegratedProgramHead: control.repository.cp1IntegratedProgramHead,
    diffPaths
  },
  suiteIdentity,
  presentationProfile: bindingReceipt?.resources?.presentationProfile ?? null,
  checks,
  failures,
  comparison: {
    baselineLowDifferentiationScenes: baselineLow.map((record) => record.scene.id),
    candidateLowDifferentiationScenes: candidateLow.map((record) => record.scene.id),
    baselineBucketMean,
    candidateBucketMean,
    bucketRatio,
    baselineEdgeMean,
    candidateEdgeMean,
    edgeRatio,
    frameHashComparisons
  },
  scenes: sceneRecords,
  bindingReceipt,
  publicRuntime,
  authoritySeparation: {
    perceptualJudgment: 'USER_DIFFERENTIAL_REQUIRED_NOT_YET_RECORDED',
    engineeringDiagnosis: 'CP1_COMPLETE_AND_CONSUMED',
    repositoryMutation: engineeringPass ? 'ROUND_1_PRESENTATION_MUTATION_COMPLETE' : 'BLOCKED',
    executedVerification: engineeringPass ? 'PASS' : 'BLOCKED',
    physicalAcceptance: 'NOT_YET_PERFORMED'
  },
  closure: {
    checkpointClosed: false,
    productMutationComplete: engineeringPass,
    executedVerificationComplete: engineeringPass,
    liveCandidateAvailable: engineeringPass && mode === 'LIVE_PUBLIC',
    userDifferentialRequired: true,
    userDifferentialRecorded: false,
    automatedEvidenceMaySubstituteForUserDifferential: false,
    nextCheckpointAuthorized: false,
    nextCheckpointStarted: false,
    stoppingBoundary: control.stoppingBoundary
  }
};
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({
  checkpoint: receipt.checkpoint,
  mode,
  result,
  sceneCount: sceneRecords.length,
  baselineLowDifferentiationSceneCount: baselineLow.length,
  candidateLowDifferentiationSceneCount: candidateLow.length,
  bucketRatio,
  edgeRatio,
  failures,
  receiptPath: path.relative(ROOT, RECEIPT_PATH)
}, null, 2));
if (!engineeringPass) process.exitCode = 1;
