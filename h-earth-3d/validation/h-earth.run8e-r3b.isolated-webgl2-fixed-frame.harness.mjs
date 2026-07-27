import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3BControl } from '../control-plane/run-8/recovery/h-earth.run8e-r3b.isolated-webgl2-fixed-frame.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3B_OUTPUT ?? '/tmp/h-earth-run8e-r3b';
const targetUrl = process.env.H_EARTH_RUN8E_R3B_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3b/';
fs.mkdirSync(outputDirectory, { recursive: true });

const chromiumArgs = Object.freeze([
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
  '--enable-unsafe-swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist'
]);
const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};
const parentControl = evaluateHEarthRun8ER3Control();
const r3bControl = evaluateHEarthRun8ER3BControl();
if (parentControl.eligible !== true) throw new Error(`R3B_PARENT_CONTROL_REJECTED:${parentControl.issues.join(',')}`);
if (r3bControl.eligible !== true) throw new Error(`R3B_CONTROL_REJECTED:${r3bControl.issues.join(',')}`);

const writeJson = (filename, value) => {
  fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
};

let browser = null;
const browserEvents = { consoleErrors: [], pageErrors: [], requestFailures: [] };
try {
  browser = await chromium.launch({ headless: true, args: chromiumArgs });
  const context = await browser.newContext({
    viewport: { width: 1100, height: 820 },
    deviceScaleFactor: 1,
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  page.setDefaultTimeout(180000);
  page.on('console', (message) => {
    if (message.type() === 'error') browserEvents.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
  page.on('requestfailed', (request) => browserEvents.requestFailures.push({
    url: request.url(),
    errorText: request.failure()?.errorText ?? 'FAILED'
  }));

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForFunction(
    () => Boolean(window.H_EARTH_RUN8E_R3B_FIXED_FRAME_RECEIPT) || Boolean(window.H_EARTH_RUN8E_R3B_FIXED_FRAME_ERROR),
    null,
    { timeout: 600000 }
  );
  const failure = await page.evaluate(() => window.H_EARTH_RUN8E_R3B_FIXED_FRAME_ERROR ?? null);
  if (failure) throw new Error(`R3B_BROWSER_EXECUTION_FAILED:${failure}`);
  const receipt = await page.evaluate(() => window.H_EARTH_RUN8E_R3B_FIXED_FRAME_RECEIPT);
  assert(receipt?.eligible === true, 'R3B_RECEIPT_NOT_ELIGIBLE');
  assert(receipt?.status === 'RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_PASS', 'R3B_STATUS_INVALID');
  assert(receipt?.context?.created === true, 'R3B_WEBGL2_CONTEXT_NOT_CREATED');
  assert(String(receipt?.context?.version).includes('WebGL 2'), 'R3B_WEBGL2_VERSION_INVALID');
  assert(receipt?.context?.contextLost === false, 'R3B_CONTEXT_LOST');
  for (const [key, value] of Object.entries(receipt?.shaders ?? {})) {
    assert(value === true || typeof value === 'string', `R3B_SHADER_OR_PROGRAM_FAILURE:${key}`);
  }
  assert(receipt?.framebuffer?.geometryFramebufferComplete === true, 'R3B_GEOMETRY_FRAMEBUFFER_INCOMPLETE');
  assert(receipt?.framebuffer?.depthVisualizationFramebufferComplete === true, 'R3B_DEPTH_FRAMEBUFFER_INCOMPLETE');
  assert(receipt?.package?.logicalPromotedIdentity === 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25', 'R3B_LOGICAL_PACKAGE_IDENTITY_MISMATCH');
  assert(receipt?.package?.runtimeIdentity === 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD', 'R3B_CHROMIUM_RUNTIME_PACKAGE_IDENTITY_MISMATCH');
  assert(receipt?.package?.primitiveCount === 35, 'R3B_PRIMITIVE_COUNT_INVALID');
  assert(receipt?.package?.triangleCount === 49040, 'R3B_TRIANGLE_COUNT_INVALID');
  assert(receipt?.package?.indexCount === 147120, 'R3B_INDEX_COUNT_INVALID');
  assert(receipt?.package?.drawRangeCount === 4, 'R3B_DRAW_RANGE_COUNT_INVALID');
  assert(receipt?.package?.gpuBufferCount === 9, 'R3B_GPU_BUFFER_COUNT_INVALID');
  assert(receipt?.package?.uploadedByteLength === 2145444, 'R3B_GPU_UPLOAD_BYTE_LENGTH_INVALID');
  assert(receipt?.package?.uploadedOnce === true, 'R3B_PACKAGE_NOT_UPLOADED_ONCE');
  assert(receipt?.package?.canonicalGpuTransport === true, 'R3B_CANONICAL_GPU_TRANSPORT_MISSING');
  assert(receipt?.cameraPacket?.contractId === 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v1', 'R3B_CAMERA_PACKET_CONTRACT_MISMATCH');
  assert(receipt?.cameraPacket?.successorTerrainCameraReconciled === true, 'R3B_CAMERA_NOT_RECONCILED');
  assert(receipt?.cameraPacket?.worldBuiltBecauseCameraMoved === false, 'R3B_WORLD_REBUILT_FOR_CAMERA');
  assert(receipt?.execution?.geometryDrawCallCount === 4, 'R3B_DRAW_CALL_COUNT_INVALID');
  assert(receipt?.execution?.totalDrawnIndexCount === 147120, 'R3B_DRAWN_INDEX_COVERAGE_INVALID');
  assert(receipt?.execution?.drawReceipts?.every((entry) => entry.executed === true && entry.error === 0), 'R3B_DRAW_RANGE_EXECUTION_INVALID');
  assert(receipt?.execution?.colorOutput?.nonClearPixelCount > 1000, 'R3B_COLOR_OUTPUT_NOT_VISIBLE');
  assert(receipt?.execution?.colorOutput?.uniqueColorBucketCount >= 8, 'R3B_COLOR_OUTPUT_NOT_INSPECTABLE');
  assert(receipt?.execution?.depthOutput?.nonClearPixelCount > 1000, 'R3B_DEPTH_OUTPUT_NOT_VISIBLE');
  assert(receipt?.execution?.depthOutput?.uniqueColorBucketCount >= 3, 'R3B_DEPTH_OUTPUT_NOT_INSPECTABLE');
  assert(receipt?.execution?.fixedFrameOnly === true, 'R3B_NOT_FIXED_FRAME_ONLY');
  assert(receipt?.execution?.renderLoopCreated === false, 'R3B_RENDER_LOOP_CREATED');
  assert(receipt?.execution?.interactionBindingCreated === false, 'R3B_INTERACTION_BINDING_CREATED');
  assert(receipt?.execution?.publicRouteBound === false, 'R3B_PUBLIC_ROUTE_BOUND');
  assert(Object.values(receipt?.correspondence ?? {}).every(Boolean), 'R3B_CORRESPONDENCE_FAILED');
  assert(Object.values(receipt?.boundaries ?? {}).every((value) => value === false), 'R3B_BOUNDARY_VIOLATION');
  assert(browserEvents.consoleErrors.length === 0, 'R3B_CONSOLE_ERRORS_PRESENT');
  assert(browserEvents.pageErrors.length === 0, 'R3B_PAGE_ERRORS_PRESENT');
  assert(browserEvents.requestFailures.length === 0, 'R3B_REQUEST_FAILURES_PRESENT');

  const canvasPath = path.join(outputDirectory, 'h-earth.run8e-r3b.fixed-visible-frame.png');
  const pagePath = path.join(outputDirectory, 'h-earth.run8e-r3b.diagnostic-page.png');
  const canvasDataUrl = await page.evaluate(() => {
    const canvas = document.getElementById('r3b-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('R3B_CANVAS_MISSING_FOR_EXACT_PNG_CAPTURE');
    return canvas.toDataURL('image/png');
  });
  fs.writeFileSync(canvasPath, Buffer.from(canvasDataUrl.split(',')[1], 'base64'));
  await page.screenshot({ path: pagePath, fullPage: true });
  assert(fs.statSync(canvasPath).size > 10000, 'R3B_CANVAS_SCREENSHOT_TOO_SMALL');
  assert(fs.statSync(pagePath).size > 10000, 'R3B_PAGE_SCREENSHOT_TOO_SMALL');

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3B_EXECUTION_PASS',
    targetUrl,
    chromiumLaunchArguments: chromiumArgs,
    browserReceipt: receipt,
    screenshotEvidence: {
      fixedVisibleFrame: canvasPath,
      fixedVisibleFrameByteLength: fs.statSync(canvasPath).size,
      diagnosticPage: pagePath,
      diagnosticPageByteLength: fs.statSync(pagePath).size
    },
    browserEvents,
    stoppingBoundary: 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C',
    issues: []
  };
  writeJson('h-earth.run8e-r3b.isolated-webgl2-fixed-frame.execution.receipt.json', executionReceipt);
  writeJson('h-earth.run8e-r3b.browser-events.json', browserEvents);
  console.log(JSON.stringify(executionReceipt, null, 2));
} catch (error) {
  const failureReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_FAILURE_RECEIPT',
    eligible: false,
    status: 'RUN_8E_R3B_EXECUTION_FAIL',
    targetUrl,
    browserEvents,
    error: error instanceof Error ? error.message : String(error)
  };
  writeJson('h-earth.run8e-r3b.failure.receipt.json', failureReceipt);
  console.error(JSON.stringify(failureReceipt, null, 2));
  process.exitCode = 1;
} finally {
  await browser?.close();
}
