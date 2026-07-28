import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1PackageDeterminismReceipt } from './h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const route = `${origin}/showroom/globe/h-earth/`;
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs`;

await mkdir(evidenceDirectory, { recursive: true });

const localizationOrder = [
  'primitiveCount',
  'primitiveIdentifiers',
  'primitiveOrder',
  'drawRangeOrder',
  'drawRangeValues',
  'bufferConstructors',
  'bufferLengths',
  'bufferByteLengths',
  'bufferRecords',
  'canonicalBytesSHA256',
  'hashAccumulationSteps',
  'contentDigest',
  'packageIdentity'
];

const stable = value => JSON.stringify(value);
const firstDifference = (nodeReceipt, browserReceipt) => {
  for (const field of localizationOrder) {
    if (stable(nodeReceipt[field]) !== stable(browserReceipt[field])) {
      return { field, node: nodeReceipt[field], browser: browserReceipt[field] };
    }
  }
  return null;
};

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

let publicReceipt = null;
try {
  const nodePackageReceipt = await buildCP3D1PackageDeterminismReceipt('NODE');
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserPackageReceipt = await page.evaluate(async url => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    return module.buildCP3D1PackageDeterminismReceipt('BROWSER');
  }, probeUrl);

  await writeFile(`${evidenceDirectory}/cp3d1-node-package.receipt.json`, `${JSON.stringify(nodePackageReceipt, null, 2)}\n`);
  await writeFile(`${evidenceDirectory}/cp3d1-browser-package.receipt.json`, `${JSON.stringify(browserPackageReceipt, null, 2)}\n`);

  const difference = firstDifference(nodePackageReceipt, browserPackageReceipt);
  const localizationReceipt = {
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1_CROSS_RUNTIME_PACKAGE_DETERMINISM_LOCALIZATION_v1',
    eligible: difference === null,
    status: difference === null ? 'CROSS_RUNTIME_PACKAGE_DETERMINISM_PASS' : 'CROSS_RUNTIME_PACKAGE_DETERMINISM_FAIL',
    firstDifference: difference,
    comparisonOrder: localizationOrder,
    nodePackageIdentity: nodePackageReceipt.packageIdentity,
    browserPackageIdentity: browserPackageReceipt.packageIdentity,
    nodeCanonicalBytesSHA256: nodePackageReceipt.canonicalBytesSHA256,
    browserCanonicalBytesSHA256: browserPackageReceipt.canonicalBytesSHA256
  };
  await writeFile(`${evidenceDirectory}/cp3d1-localization.receipt.json`, `${JSON.stringify(localizationReceipt, null, 2)}\n`);

  if (difference) {
    throw new Error(`CP3D1_FIRST_DIVERGENCE:${difference.field}`);
  }

  const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  assert.ok(response, 'CP3D_ROUTE_RESPONSE_MISSING');
  assert.ok(response.status() >= 200 && response.status() < 400, `CP3D_ROUTE_HTTP_STATUS:${response.status()}`);

  const readiness = await Promise.race([
    page.waitForFunction(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 90_000 }).then(() => 'READY'),
    page.waitForFunction(() => globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()?.firstFailureStage, null, { timeout: 90_000 }).then(() => 'FAILED')
  ]);

  if (readiness === 'FAILED') {
    const startup = await page.evaluate(() => globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.() ?? null);
    throw new Error(`CP3D_BROWSER_STARTUP_FAILURE:${startup?.firstFailureStage ?? 'UNKNOWN'}:${startup?.exception?.message ?? startup?.failureClass ?? 'UNKNOWN'}`);
  }

  await page.waitForFunction(() => {
    const snapshot = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    return Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1;
  }, null, { timeout: 90_000 });

  publicReceipt = await page.evaluate(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot());
  assert.equal(publicReceipt?.eligible, true, 'CP3D_PUBLIC_RECEIPT_NOT_ELIGIBLE');
  assert.equal(publicReceipt?.status, 'RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_ACTIVE', 'CP3D_PUBLIC_RUNTIME_NOT_ACTIVE');
  assert.equal(publicReceipt?.intake?.status, 'RUN_8E_CP3B_LOCKED_CONTINUOUS_TOUCH_ACTIVE', 'CP3D_CP3B_RUNTIME_RECEIPT_UNAVAILABLE');
  assert.equal(publicReceipt?.intake?.semantics?.continuousMotionOutput, true, 'CP3D_CONTINUOUS_MOTION_RUNTIME_NOT_INSTALLED');
  assert.equal(publicReceipt?.intake?.semantics?.cp2bObservationCompatible, true, 'CP3D_CP2B_COMPATIBILITY_NOT_PRESERVED');
  assert.equal(publicReceipt?.liveGpu?.resources?.initialized, true, 'CP3D_RENDERER_CONSTRUCTOR_OR_INITIALIZATION_NOT_COMPLETE');
  assert.ok(Number(publicReceipt?.liveGpu?.counters?.rendererInitializationCount ?? 0) >= 1, 'CP3D_RENDERER_INITIALIZATION_COUNT_ZERO');
  assert.ok(Number(publicReceipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1, 'CP3D_FIRST_FRAME_NOT_PRESENTED');
  assert.equal(publicReceipt?.liveGpu?.correspondence?.packageUploadedOnce, true, 'CP3D_PACKAGE_NOT_UPLOADED_ONCE');
  assert.equal(publicReceipt?.liveGpu?.correspondence?.resourceIdentityStable, true, 'CP3D_GPU_RESOURCE_IDENTITY_UNSTABLE');
  assert.equal(publicReceipt?.runtimeExclusivity?.activeWebGL2ContextCount, 1, 'CP3D_WEBGL2_CONTEXT_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activePersistentRendererCount, 1, 'CP3D_RENDERER_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activePointerTouchIntakeCount, 1, 'CP3D_TOUCH_INTAKE_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activeFramePresentationAuthorityCount, 1, 'CP3D_FRAME_AUTHORITY_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.legacyModuleScriptCount, 0, 'CP3D_LEGACY_RUNTIME_PRESENT');

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
    crossRuntimePackageDeterminism: 'PASS',
    rendererConstructorReturned: 'PASS',
    firstFramePresented: 'PASS',
    visibleEnvironmentPreserved: true,
    touchRuntimeInstalled: 'PASS',
    cp2bObservationCompatible: 'PASS',
    cp3bRuntimeReceiptAvailable: 'PASS',
    publicReceipt,
    canvasFacts,
    consoleMessages,
    pageErrors
  };
  await writeFile(`${evidenceDirectory}/cp3d-browser-survival.receipt.json`, `${JSON.stringify(executionReceipt, null, 2)}\n`);
  console.log(JSON.stringify(executionReceipt, null, 2));
} catch (error) {
  const failureEvidence = await page.evaluate(() => ({
    startupReceipt: globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.() ?? null,
    runtimeDiagnostics: globalThis.H_EARTH_RUNTIME_DIAGNOSTICS?.getSnapshot?.() ?? null,
    publicRouteReady: globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready ?? false,
    rootDataset: document.getElementById('h-earth-functional-landscape-route')?.dataset
      ? { ...document.getElementById('h-earth-functional-landscape-route').dataset }
      : null
  })).catch(() => null);
  await page.screenshot({ path: `${evidenceDirectory}/cp3d-browser-failure.png`, fullPage: true }).catch(() => {});
  await writeFile(`${evidenceDirectory}/cp3d-browser-failure.receipt.json`, `${JSON.stringify({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_BROWSER_FAILURE_RECEIPT_v1',
    eligible: false,
    status: 'CP3D_BROWSER_SURVIVAL_FAIL',
    error: { name: error.name, message: error.message, stack: error.stack ?? null },
    failureEvidence,
    publicReceipt,
    consoleMessages,
    pageErrors
  }, null, 2)}\n`);
  throw error;
} finally {
  await browser.close();
}
