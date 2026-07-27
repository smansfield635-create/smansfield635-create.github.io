import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';

const url = process.env.H_EARTH_RUN8E_R2D_URL ??
  'http://127.0.0.1:4174/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.html';
const outputDirectory = process.env.H_EARTH_RUN8E_R2D_OUTPUT ?? '/tmp/h-earth-run8e-r2d';
fs.mkdirSync(outputDirectory, { recursive: true });

const viewKeys = [
  'positions', 'normals', 'baseColorsLinear', 'materialParameters',
  'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
];
const nodePackage = getHEarthRun8ER2ImmutableLiveRenderPackage();
const nodeViews = createHEarthRun8ER2GPUBufferViews(nodePackage);
const nodeTypedUploadDigests = Object.fromEntries(viewKeys.map((key) => {
  const view = nodeViews[key];
  const bytes = Buffer.from(view.buffer, view.byteOffset, view.byteLength);
  return [key, `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`];
}));
const nodeTypedUploadByteLength = viewKeys.reduce((sum, key) => sum + nodeViews[key].byteLength, 0);

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
  url: request.url(),
  method: request.method(),
  failure: request.failure()?.errorText ?? null
}));

let result = null;
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => window.__H_EARTH_RUN_8E_R2D_RESULT__ !== undefined, null, { timeout: 180000 });
  result = await page.evaluate(() => window.__H_EARTH_RUN_8E_R2D_RESULT__);
  await page.screenshot({ path: path.join(outputDirectory, 'h-earth.run8e-r2d.validation-page.png'), fullPage: true });
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2d.raw-result.json'),
    `${JSON.stringify(result, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2d.browser-diagnostics.json'),
    `${JSON.stringify({ url, launchArgs, consoleEntries, pageErrors, requestFailures }, null, 2)}\n`
  );

  assert.equal(result?.ok, true, `R2D_BROWSER_PROBE_FAILED:${result?.error ?? 'NO_RESULT'}`);
  const receipt = result.receipt;
  assert.equal(receipt.receiptType, 'H_EARTH_RUN_8E_R2D_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_RECEIPT');
  assert.equal(receipt.status, 'RUN_8E_R2D_GPU_RESOURCE_LIFECYCLE_PASS_RUNTIME_IDENTITY_RECORDED');
  assert.equal(receipt.expectedPredecessorPackageIdentity, 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25');
  assert.equal(receipt.expectedPredecessorContentDigest, 'fnv1a32:fd913c25');
  assert.equal(nodePackage.packageIdentity, 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25');
  assert.equal(nodePackage.contentDigest, 'fnv1a32:fd913c25');
  assert.deepEqual(receipt.sourceBufferDigestsBefore, nodeTypedUploadDigests,
    'R2D_NODE_CHROMIUM_TYPED_UPLOAD_DIGEST_MISMATCH');
  assert.deepEqual(receipt.sourceBufferDigestsAfter, nodeTypedUploadDigests,
    'R2D_POST_LIFECYCLE_TYPED_UPLOAD_DIGEST_MISMATCH');

  assert.equal(receipt.context.created, true);
  assert.match(receipt.context.version, /WebGL 2\.0/);
  assert.equal(receipt.context.loseContextExtensionAvailable, true);
  assert.equal(receipt.lifecycle.cycleCount, 3);
  assert.equal(receipt.lifecycle.contextLossObserved, true);
  assert.equal(receipt.lifecycle.contextLossDefaultPrevented, true);
  assert.equal(receipt.lifecycle.contextRestoreObserved, true);
  assert.equal(receipt.lifecycle.contextRestored, true);
  assert.equal(receipt.lifecycle.secondCycleBufferObjectsDistinctFromFirst, true);
  assert.equal(receipt.lifecycle.totalCreatedBufferCount, 27);
  assert.equal(receipt.lifecycle.totalDeletedBufferCount, 27);

  const cycles = [receipt.lifecycle.first, receipt.lifecycle.second, receipt.lifecycle.restored];
  const totalByteLengths = new Set();
  for (const cycle of cycles) {
    assert.equal(cycle.resourceCount, 9, `R2D_RESOURCE_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.arrayBufferCount, 8, `R2D_ARRAY_BUFFER_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.elementArrayBufferCount, 1, `R2D_ELEMENT_ARRAY_BUFFER_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.allRecognizedBeforeDelete, true, `R2D_BUFFER_RECOGNITION:${cycle.cycleId}`);
    assert.equal(cycle.deletion.deletedResourceCount, 9, `R2D_DELETE_COUNT:${cycle.cycleId}`);
    assert.equal(cycle.deletion.recognizedAfterDeleteCount, 0, `R2D_DELETE_RECOGNITION:${cycle.cycleId}`);
    assert.equal(cycle.deletion.deletePass, true, `R2D_DELETE_PASS:${cycle.cycleId}`);
    assert.deepEqual(cycle.resources.map(({ key }) => key), viewKeys, `R2D_RESOURCE_ORDER:${cycle.cycleId}`);
    assert.equal(cycle.resources.every(({ byteLength, gpuByteLength }) => byteLength === gpuByteLength), true,
      `R2D_GPU_SIZE_CORRESPONDENCE:${cycle.cycleId}`);
    assert.equal(cycle.resources.every(({ usageName }) => usageName === 'STATIC_DRAW'), true,
      `R2D_USAGE_CORRESPONDENCE:${cycle.cycleId}`);
    assert.equal(cycle.resources.filter(({ targetName }) => targetName === 'ELEMENT_ARRAY_BUFFER').length, 1,
      `R2D_ELEMENT_TARGET_CORRESPONDENCE:${cycle.cycleId}`);
    totalByteLengths.add(cycle.totalByteLength);
  }
  assert.equal(totalByteLengths.size, 1, 'R2D_CYCLE_BYTE_LENGTH_DRIFT');
  assert.equal([...totalByteLengths][0], nodeTypedUploadByteLength, 'R2D_TOTAL_UPLOAD_BYTE_LENGTH_UNEXPECTED');
  assert.equal(nodeTypedUploadByteLength, 2145444, 'R2D_NODE_TYPED_UPLOAD_BYTE_LENGTH_UNEXPECTED');
  assert.deepEqual(receipt.sourceBufferDigestsAfter, receipt.sourceBufferDigestsBefore,
    'R2D_SOURCE_DIGEST_INSTABILITY');
  assert.equal(receipt.sourceBufferDigestsStable, true);
  assert.equal(receipt.cachedPackageObjectStable, true);
  assert.equal(receipt.shaderOrProgramCreated, false);
  assert.equal(receipt.vertexArrayTextureFramebufferOrRenderbufferCreated, false);
  assert.equal(receipt.drawCallCount, 0);
  assert.equal(receipt.visiblePresentationCreated, false);
  assert.equal(receipt.renderLoopCreated, false);
  assert.equal(receipt.ciPerformanceAuthority, false);
  assert.equal(receipt.physicalMobilePerformanceAuthority, false);
  assert.equal(Object.values(receipt.forbiddenCallCounts).every((count) => count === 0), true);
  assert.equal(pageErrors.length, 0, `R2D_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(requestFailures.length, 0, `R2D_REQUEST_FAILURES:${JSON.stringify(requestFailures)}`);

  const float64RuntimeIdentityMatch = receipt.predecessorPackageIdentityMatch && receipt.predecessorContentDigestMatch;
  const finalReceipt = {
    ...receipt,
    status: float64RuntimeIdentityMatch
      ? 'RUN_8E_R2D_GPU_RESOURCE_LIFECYCLE_PASS'
      : 'RUN_8E_R2D_GPU_RESOURCE_LIFECYCLE_PASS_WITH_FLOAT64_RUNTIME_IDENTITY_DISTINCTION',
    crossRuntimeIdentity: {
      nodePackageIdentity: nodePackage.packageIdentity,
      nodeContentDigest: nodePackage.contentDigest,
      chromiumPackageIdentity: receipt.runtimePackageIdentity,
      chromiumContentDigest: receipt.runtimeContentDigest,
      float64PackageIdentityMatch: float64RuntimeIdentityMatch,
      typedGpuUploadByteDigestsMatch: true,
      typedGpuUploadByteLengthMatch: true,
      typedGpuUploadByteLength: nodeTypedUploadByteLength,
      disposition: float64RuntimeIdentityMatch
        ? 'PACKAGE_AND_GPU_UPLOAD_IDENTITIES_MATCH_ACROSS_RUNTIMES'
        : 'FLOAT64_PACKAGE_IDENTITY_RUNTIME_LOCAL_GPU_UPLOAD_BYTES_CROSS_RUNTIME_EXACT'
    },
    executionEnvironment: {
      classification: 'CI_SWIFTSHADER_FUNCTIONAL_RESOURCE_LIFECYCLE_ONLY',
      url,
      launchArgs,
      browserConsoleEntryCount: consoleEntries.length,
      pageErrorCount: pageErrors.length,
      requestFailureCount: requestFailures.length
    }
  };
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2d.gpu-resource-lifecycle.receipt.json'),
    `${JSON.stringify(finalReceipt, null, 2)}\n`
  );
  console.log(JSON.stringify(finalReceipt, null, 2));
} catch (error) {
  const failure = {
    receiptType: 'H_EARTH_RUN_8E_R2D_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_FAILURE_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R2D_EXECUTION_FAIL_OPEN',
    generatedAt: new Date().toISOString(),
    url,
    launchArgs,
    nodeRuntime: {
      packageIdentity: nodePackage.packageIdentity,
      contentDigest: nodePackage.contentDigest,
      typedUploadDigests: nodeTypedUploadDigests,
      typedUploadByteLength: nodeTypedUploadByteLength
    },
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
