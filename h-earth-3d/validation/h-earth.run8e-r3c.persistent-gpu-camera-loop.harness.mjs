import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3CControl } from '../control-plane/run-8/recovery/h-earth.run8e-r3c.persistent-gpu-camera-loop.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3C_OUTPUT ?? '/tmp/h-earth-run8e-r3c';
const targetUrl = process.env.H_EARTH_RUN8E_R3C_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3c/';
fs.mkdirSync(outputDirectory, { recursive: true });
const chromiumArgs = Object.freeze([
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
  '--enable-unsafe-swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist'
]);
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const decodeDataUrl = (dataUrl) => {
  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl ?? '');
  if (!match) throw new Error('R3C_PNG_DATA_URL_INVALID');
  return Buffer.from(match[1], 'base64');
};
const pngDimensions = (bytes) => {
  assert(bytes.length > 24 && bytes.subarray(1, 4).toString('ascii') === 'PNG', 'R3C_PNG_SIGNATURE_INVALID');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3CControl();
assert(parent.eligible === true, `R3C_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3C_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

let browser = null;
const browserEvents = { consoleErrors: [], pageErrors: [], requestFailures: [] };
try {
  browser = await chromium.launch({ headless: true, args: chromiumArgs });
  const context = await browser.newContext({
    viewport: { width: 720, height: 760 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  });
  const page = await context.newPage();
  page.setDefaultTimeout(180000);
  page.on('console', (message) => { if (message.type() === 'error') browserEvents.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
  page.on('requestfailed', (request) => browserEvents.requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText ?? 'FAILED' }));

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForFunction(() =>
    document.documentElement.dataset.r3cReady === 'true' ||
    Boolean(window.H_EARTH_RUN8E_R3C_CONTINUOUS_LOOP_ERROR), null, { timeout: 180000 });
  const browserError = await page.evaluate(() => window.H_EARTH_RUN8E_R3C_CONTINUOUS_LOOP_ERROR ?? null);
  if (browserError) throw new Error(`R3C_BROWSER_EXECUTION_FAILED:${browserError}`);
  const receipt = await page.evaluate(() => window.H_EARTH_RUN8E_R3C_CONTINUOUS_LOOP_RECEIPT);
  const frameDataUrls = await page.evaluate(() => window.H_EARTH_RUN8E_R3C_FRAME_CAPTURES);
  assert(receipt?.eligible === true, 'R3C_BROWSER_RECEIPT_NOT_ELIGIBLE');
  assert(receipt.status === 'RUN_8E_R3C_CONTINUOUS_CAMERA_LOOP_PASS', 'R3C_BROWSER_STATUS_INVALID');
  assert(receipt.loop.completedFrameCount === 180, 'R3C_FRAME_COUNT_INVALID');
  assert(receipt.loop.requestAnimationFrameUsed === true, 'R3C_REQUEST_ANIMATION_FRAME_NOT_USED');
  assert(receipt.loop.maximumConcurrentCallbacks === 1, 'R3C_CALLBACK_CONCURRENCY_INVALID');
  assert(receipt.resources.counters.contextCreationCount === 1, 'R3C_CONTEXT_CREATION_COUNT_INVALID');
  assert(receipt.resources.counters.shaderCompileCount === 4, 'R3C_SHADER_COMPILE_COUNT_INVALID');
  assert(receipt.resources.counters.programLinkCount === 2, 'R3C_PROGRAM_LINK_COUNT_INVALID');
  assert(receipt.resources.counters.bufferCreateCount === 9, 'R3C_BUFFER_CREATE_COUNT_INVALID');
  assert(receipt.resources.counters.bufferUploadCount === 9, 'R3C_BUFFER_UPLOAD_COUNT_INVALID');
  assert(receipt.resources.counters.uploadedByteLength === 2145444, 'R3C_UPLOADED_BYTE_LENGTH_INVALID');
  assert(receipt.resources.counters.postInitializationResourceCreationCount === 0, 'R3C_POST_INITIALIZATION_RESOURCE_CREATION');
  assert(receipt.resources.counters.postInitializationBufferUploadCount === 0, 'R3C_POST_INITIALIZATION_BUFFER_UPLOAD');
  assert(receipt.resources.counters.cameraUniformUpdateCount === 360, 'R3C_CAMERA_UNIFORM_UPDATE_COUNT_INVALID');
  assert(receipt.resources.counters.geometryDrawCallCount === 720, 'R3C_GEOMETRY_DRAW_CALL_COUNT_INVALID');
  assert(receipt.resources.counters.totalDrawnIndexCount === 26481600, 'R3C_TOTAL_DRAWN_INDEX_COUNT_INVALID');
  assert(receipt.distinctCaptureHashCount === 3, 'R3C_CAPTURE_HASHES_NOT_DISTINCT');
  assert(receipt.depthOutput.nonClearPixelCount > 0, 'R3C_DEPTH_OUTPUT_EMPTY');
  assert(Object.values(receipt.boundaries).every((value) => value === false), 'R3C_BOUNDARY_VIOLATION');
  assert(browserEvents.consoleErrors.length === 0, `R3C_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
  assert(browserEvents.pageErrors.length === 0, `R3C_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0, `R3C_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);

  const frameArtifacts = {};
  for (const label of ['start', 'middle', 'final']) {
    const bytes = decodeDataUrl(frameDataUrls?.[label]);
    const dimensions = pngDimensions(bytes);
    assert(dimensions.width === 640 && dimensions.height === 360, `R3C_${label.toUpperCase()}_PNG_DIMENSIONS_INVALID`);
    const filename = `h-earth.run8e-r3c.${label}-frame.png`;
    fs.writeFileSync(path.join(outputDirectory, filename), bytes);
    frameArtifacts[label] = { filename, byteLength: bytes.length, sha256: sha256(bytes), ...dimensions };
  }
  assert(new Set(Object.values(frameArtifacts).map((entry) => entry.sha256)).size === 3, 'R3C_PNG_ARTIFACTS_NOT_DISTINCT');
  const diagnosticPagePath = path.join(outputDirectory, 'h-earth.run8e-r3c.diagnostic-page.png');
  await page.screenshot({ path: diagnosticPagePath, fullPage: true });
  const diagnosticBytes = fs.readFileSync(diagnosticPagePath);

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_RESOURCE_AND_CONTINUOUS_CAMERA_LOOP_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3C_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    browserReceipt: receipt,
    frameArtifacts,
    diagnosticPage: { filename: path.basename(diagnosticPagePath), byteLength: diagnosticBytes.length, sha256: sha256(diagnosticBytes) },
    browserEvents,
    correspondence: {
      logicalPromotedPackageIdentity: receipt.resources.package.logicalPromotedIdentity,
      chromiumRuntimePackageIdentity: receipt.resources.package.runtimeIdentity,
      canonicalGpuTransport: receipt.resources.package.canonicalGpuTransport,
      resourceIdentityStable: receipt.resources.resourceIdentityStable,
      packageUploadedOnce: receipt.resources.packageUploadedOnce,
      noPostInitializationResourceCreation: receipt.resources.noPostInitializationResourceCreation,
      noPostInitializationBufferUpload: receipt.resources.noPostInitializationBufferUpload,
      startMiddleFinalFramesDistinct: receipt.distinctCaptureHashCount === 3,
      navigationAuthorityMutated: false,
      worldRebuildCount: receipt.loop.worldRebuildCount
    },
    stoppingBoundary: 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D',
    issues: []
  };
  writeJson('h-earth.run8e-r3c.persistent-gpu-camera-loop.execution.receipt.json', executionReceipt);
  console.log(JSON.stringify({
    status: executionReceipt.status,
    frames: receipt.loop.completedFrameCount,
    durationMs: receipt.loop.durationMs,
    resourceCounters: receipt.resources.counters,
    frameArtifacts,
    depthOutput: receipt.depthOutput,
    stoppingBoundary: executionReceipt.stoppingBoundary
  }, null, 2));
} finally {
  await browser?.close();
}
