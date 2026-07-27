import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {
  H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
  createHEarthRun8ER2DCanonicalGPUUploadViews,
  evaluateHEarthRun8ER2DCanonicalGPUUploadViews
} from '../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';

const keys = [
  'positions', 'normals', 'baseColorsLinear', 'materialParameters',
  'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
];
const url = process.env.H_EARTH_RUN8E_R2D_URL ??
  'http://127.0.0.1:4174/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.html';
const outputDirectory = process.env.H_EARTH_RUN8E_R2D_OUTPUT ?? '/tmp/h-earth-run8e-r2d';
fs.mkdirSync(outputDirectory, { recursive: true });

function sha256View(view) {
  return `sha256:${crypto.createHash('sha256')
    .update(Buffer.from(view.buffer, view.byteOffset, view.byteLength))
    .digest('hex')}`;
}

const nodePackage = getHEarthRun8ER2ImmutableLiveRenderPackage();
const nodeViews = createHEarthRun8ER2DCanonicalGPUUploadViews(nodePackage);
const nodeEvaluation = evaluateHEarthRun8ER2DCanonicalGPUUploadViews(nodeViews);
assert.equal(nodeEvaluation.eligible, true, `R2D_NODE_CANONICAL_VIEWS:${nodeEvaluation.issues.join(',')}`);
const nodeDigests = Object.fromEntries(keys.map((key) => [key, sha256View(nodeViews[key])]));
const nodeByteLength = keys.reduce((sum, key) => sum + nodeViews[key].byteLength, 0);

const launchArgs = [
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
  '--enable-unsafe-swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist'
];
const browser = await chromium.launch({ headless: true, args: launchArgs });
const page = await browser.newPage({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 1 });
const consoleEntries = [];
const pageErrors = [];
const requestFailures = [];
page.on('console', (message) => consoleEntries.push({ type: message.type(), text: message.text() }));
page.on('pageerror', (error) => pageErrors.push({ message: error.message, stack: error.stack ?? null }));
page.on('requestfailed', (request) => requestFailures.push({
  url: request.url(), method: request.method(), failure: request.failure()?.errorText ?? null
}));

let result = null;
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__H_EARTH_RUN_8E_R2D_RESULT__ !== undefined, null, { timeout: 180000 });
  result = await page.evaluate(() => window.__H_EARTH_RUN_8E_R2D_RESULT__);
  await page.screenshot({ path: path.join(outputDirectory, 'h-earth.run8e-r2d.canonical-validation-page.png'), fullPage: true });
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2d.canonical-raw-result.json'), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2d.canonical-browser-diagnostics.json'), `${JSON.stringify({
    url, launchArgs, consoleEntries, pageErrors, requestFailures
  }, null, 2)}\n`);

  assert.equal(result?.ok, true, `R2D_CANONICAL_BROWSER_PROBE:${result?.error ?? 'NO_RESULT'}`);
  const receipt = result.receipt;
  assert.equal(receipt.receiptType,
    'H_EARTH_RUN_8E_R2D_CANONICAL_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_RECEIPT');
  assert.equal(receipt.status, 'RUN_8E_R2D_CANONICAL_GPU_RESOURCE_LIFECYCLE_PASS');
  assert.equal(receipt.gpuUploadViewContractId, H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID);
  assert.deepEqual(receipt.canonicalUploadDigestsBefore, nodeDigests,
    'R2D_CANONICAL_NODE_CHROMIUM_DIGEST_MISMATCH');
  assert.deepEqual(receipt.canonicalUploadDigestsAfter, nodeDigests,
    'R2D_CANONICAL_POST_LIFECYCLE_DIGEST_MISMATCH');
  assert.equal(receipt.canonicalUploadDigestsStable, true);
  assert.equal(receipt.canonicalizationReceipt.normalBuffer.maximumAbsoluteAdjustment <= 0.00000051, true);
  assert.equal(receipt.canonicalizationReceipt.materialParameterBuffer.maximumAbsoluteAdjustment <= 0.00000051, true);
  assert.equal(receipt.canonicalizationReceipt.sourcePackageMutated, false);
  assert.equal(receipt.canonicalizationReceipt.transportEncodingOnly, true);

  const cycles = [receipt.lifecycle.first, receipt.lifecycle.second, receipt.lifecycle.restored];
  for (const cycle of cycles) {
    assert.equal(cycle.resourceCount, 9, `R2D_CYCLE_RESOURCE_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.arrayBufferCount, 8, `R2D_CYCLE_ARRAY_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.elementArrayBufferCount, 1, `R2D_CYCLE_ELEMENT_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.totalByteLength, nodeByteLength, `R2D_CYCLE_BYTE_LENGTH:${cycle.cycleId}`);
    assert.deepEqual(cycle.resources.map(({ key }) => key), keys, `R2D_CYCLE_ORDER:${cycle.cycleId}`);
    assert.equal(cycle.resources.every(({ byteLength, gpuByteLength }) => byteLength === gpuByteLength), true);
    assert.equal(cycle.resources.every(({ usageName }) => usageName === 'STATIC_DRAW'), true);
    assert.equal(cycle.deletion.deletedResourceCount, 9);
    assert.equal(cycle.deletion.recognizedAfterDelete, 0);
    assert.equal(cycle.deletion.pass, true);
  }
  assert.equal(nodeByteLength, 2145444);
  assert.equal(receipt.lifecycle.contextLossObserved, true);
  assert.equal(receipt.lifecycle.contextLossDefaultPrevented, true);
  assert.equal(receipt.lifecycle.contextRestoreObserved, true);
  assert.equal(receipt.lifecycle.totalCreatedBufferCount, 27);
  assert.equal(receipt.lifecycle.totalDeletedBufferCount, 27);
  assert.equal(Object.values(receipt.forbiddenCallCounts).every((value) => value === 0), true);
  assert.equal(receipt.shaderOrProgramCreated, false);
  assert.equal(receipt.drawCallCount, 0);
  assert.equal(receipt.visiblePresentationCreated, false);
  assert.equal(receipt.renderLoopCreated, false);
  assert.equal(receipt.ciPerformanceAuthority, false);
  assert.equal(pageErrors.length, 0, `R2D_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(requestFailures.length, 0, `R2D_REQUEST_FAILURES:${JSON.stringify(requestFailures)}`);

  const finalReceipt = {
    ...receipt,
    status: 'RUN_8E_R2D_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_PASS',
    nodeRuntime: {
      packageIdentity: nodePackage.packageIdentity,
      packageContentDigest: nodePackage.contentDigest,
      canonicalUploadDigests: nodeDigests,
      canonicalUploadByteLength: nodeByteLength,
      canonicalizationReceipt: nodeViews.canonicalizationReceipt
    },
    crossRuntimeDisposition: {
      rawFloat64PackageIdentityExact: nodePackage.packageIdentity === receipt.runtimePackageIdentity,
      canonicalGpuUploadBytesExact: true,
      canonicalGpuUploadByteLengthExact: true,
      sourceAuthorityMutationRequired: false,
      packageSourceMutationRequired: false,
      disposition: 'RUNTIME_LOCAL_HIGH_PRECISION_DRIFT_REMOVED_AT_DETERMINISTIC_GPU_TRANSPORT_BOUNDARY'
    },
    executionEnvironment: {
      classification: 'CI_SWIFTSHADER_FUNCTIONAL_RESOURCE_LIFECYCLE_ONLY',
      launchArgs,
      consoleEntryCount: consoleEntries.length,
      pageErrorCount: pageErrors.length,
      requestFailureCount: requestFailures.length,
      performanceAuthority: false
    },
    issues: []
  };
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2d.gpu-resource-lifecycle.receipt.json'),
    `${JSON.stringify(finalReceipt, null, 2)}\n`
  );
  console.log(JSON.stringify(finalReceipt, null, 2));
} catch (error) {
  const failure = {
    receiptType: 'H_EARTH_RUN_8E_R2D_CANONICAL_GPU_RESOURCE_LIFECYCLE_FAILURE_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R2D_EXECUTION_FAIL_OPEN',
    generatedAt: new Date().toISOString(),
    nodePackageIdentity: nodePackage.packageIdentity,
    nodePackageContentDigest: nodePackage.contentDigest,
    nodeCanonicalUploadDigests: nodeDigests,
    nodeCanonicalUploadByteLength: nodeByteLength,
    result,
    error: error?.message ?? String(error),
    stack: error?.stack ?? null,
    consoleEntries,
    pageErrors,
    requestFailures
  };
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2d.failure.receipt.json'),
    `${JSON.stringify(failure, null, 2)}\n`
  );
  console.error(JSON.stringify(failure, null, 2));
  throw error;
} finally {
  await browser.close();
}
