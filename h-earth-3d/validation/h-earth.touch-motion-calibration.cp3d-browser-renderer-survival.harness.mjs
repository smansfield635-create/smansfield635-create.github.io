import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const route = `${origin}/showroom/globe/h-earth/`;
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';

await mkdir(evidenceDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=swiftshader',
    '--disable-dev-shm-usage'
  ]
});

const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const consoleMessages = [];
const pageErrors = [];
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text() }));
page.on('pageerror', error => pageErrors.push({ name: error.name, message: error.message, stack: error.stack ?? null }));

let receipt;
try {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  assert.ok(response, 'CP3D_ROUTE_RESPONSE_MISSING');
  assert.ok(response.status() >= 200 && response.status() < 400, `CP3D_ROUTE_HTTP_STATUS:${response.status()}`);

  await page.waitForFunction(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 90_000 });
  await page.waitForFunction(() => {
    const snapshot = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    return Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1;
  }, null, { timeout: 90_000 });

  receipt = await page.evaluate(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot());
  assert.equal(receipt?.eligible, true, 'CP3D_PUBLIC_RECEIPT_NOT_ELIGIBLE');
  assert.equal(receipt?.status, 'RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_ACTIVE', 'CP3D_PUBLIC_RUNTIME_NOT_ACTIVE');
  assert.equal(receipt?.intake?.status, 'RUN_8E_CP3B_LOCKED_CONTINUOUS_TOUCH_ACTIVE', 'CP3D_CP3B_RUNTIME_RECEIPT_UNAVAILABLE');
  assert.equal(receipt?.intake?.semantics?.continuousMotionOutput, true, 'CP3D_CONTINUOUS_MOTION_RUNTIME_NOT_INSTALLED');
  assert.equal(receipt?.intake?.semantics?.cp2bObservationCompatible, true, 'CP3D_CP2B_COMPATIBILITY_NOT_PRESERVED');
  assert.equal(receipt?.liveGpu?.resources?.initialized, true, 'CP3D_RENDERER_CONSTRUCTOR_OR_INITIALIZATION_NOT_COMPLETE');
  assert.ok(Number(receipt?.liveGpu?.counters?.rendererInitializationCount ?? 0) >= 1, 'CP3D_RENDERER_INITIALIZATION_COUNT_ZERO');
  assert.ok(Number(receipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1, 'CP3D_FIRST_FRAME_NOT_PRESENTED');
  assert.equal(receipt?.liveGpu?.correspondence?.packageUploadedOnce, true, 'CP3D_PACKAGE_NOT_UPLOADED_ONCE');
  assert.equal(receipt?.liveGpu?.correspondence?.resourceIdentityStable, true, 'CP3D_GPU_RESOURCE_IDENTITY_UNSTABLE');
  assert.equal(receipt?.runtimeExclusivity?.activeWebGL2ContextCount, 1, 'CP3D_WEBGL2_CONTEXT_COUNT_INVALID');
  assert.equal(receipt?.runtimeExclusivity?.activePersistentRendererCount, 1, 'CP3D_RENDERER_COUNT_INVALID');
  assert.equal(receipt?.runtimeExclusivity?.activePointerTouchIntakeCount, 1, 'CP3D_TOUCH_INTAKE_COUNT_INVALID');
  assert.equal(receipt?.runtimeExclusivity?.activeFramePresentationAuthorityCount, 1, 'CP3D_FRAME_AUTHORITY_COUNT_INVALID');
  assert.equal(receipt?.runtimeExclusivity?.legacyModuleScriptCount, 0, 'CP3D_LEGACY_RUNTIME_PRESENT');

  const canvasFacts = await page.evaluate(() => {
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    const root = document.getElementById('h-earth-functional-landscape-route');
    return {
      canvasPresent: canvas instanceof HTMLCanvasElement,
      canvasWidth: canvas?.width ?? 0,
      canvasHeight: canvas?.height ?? 0,
      routeReady: root?.dataset?.run8eReady ?? null,
      routeError: root?.dataset?.run8eError ?? null
    };
  });
  assert.equal(canvasFacts.canvasPresent, true, 'CP3D_CANVAS_NOT_PRESENT');
  assert.ok(canvasFacts.canvasWidth > 0 && canvasFacts.canvasHeight > 0, 'CP3D_CANVAS_DIMENSIONS_INVALID');
  assert.equal(canvasFacts.routeReady, 'true', 'CP3D_ROUTE_NOT_READY');
  assert.equal(canvasFacts.routeError, 'false', 'CP3D_ROUTE_ERROR_PRESENT');

  await page.screenshot({ path: `${evidenceDirectory}/cp3d-first-frame.png`, fullPage: true });

  const executionReceipt = {
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_REAL_BROWSER_RENDERER_SURVIVAL_RECEIPT_v1',
    eligible: true,
    status: 'CP3D_REAL_BROWSER_RENDERER_SURVIVAL_PASS',
    route,
    rendererConstructorReturned: 'PASS',
    firstFramePresented: 'PASS',
    visibleEnvironmentPreserved: true,
    touchRuntimeInstalled: 'PASS',
    cp2bObservationCompatible: 'PASS',
    cp3bRuntimeReceiptAvailable: 'PASS',
    publicReceipt: receipt,
    canvasFacts,
    consoleMessages,
    pageErrors
  };
  await writeFile(`${evidenceDirectory}/cp3d-browser-survival.receipt.json`, `${JSON.stringify(executionReceipt, null, 2)}\n`);
  console.log(JSON.stringify(executionReceipt, null, 2));
} finally {
  await browser.close();
}
