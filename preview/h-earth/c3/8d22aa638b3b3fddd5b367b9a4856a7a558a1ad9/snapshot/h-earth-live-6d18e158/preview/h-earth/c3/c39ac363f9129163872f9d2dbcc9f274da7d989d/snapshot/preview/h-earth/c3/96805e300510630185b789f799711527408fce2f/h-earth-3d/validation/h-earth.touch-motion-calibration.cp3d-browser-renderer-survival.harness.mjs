import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const route = `${origin}/showroom/globe/h-earth/`;
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const canonicalModuleUrl = `${origin}/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js`;
const expectedIdentity = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_9BD0B898';
const requiredBoundary = 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY';

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

const page = await browser.newPage({
  viewport: { width: 694, height: 747 },
  deviceScaleFactor: 1.5,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
});
const consoleMessages = [];
const pageErrors = [];
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text() }));
page.on('pageerror', error => pageErrors.push({ name: error.name, message: error.message, stack: error.stack ?? null }));

let publicReceipt = null;
let tabletFluidityFacts = null;
try {
  const nodePackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  assert.equal(nodePackage?.eligible, true, 'CP3D_CANONICAL_NODE_PACKAGE_NOT_ELIGIBLE');
  assert.equal(nodePackage?.packageIdentity, expectedIdentity, 'CP3D_CANONICAL_NODE_PACKAGE_IDENTITY_MISMATCH');
  assert.equal(nodePackage?.sourceAuthorities?.numericIdentityBoundary, requiredBoundary, 'CP3D_CANONICAL_NODE_BOUNDARY_MISMATCH');

  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserPackageFacts = await page.evaluate(async ({ url }) => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    const packageRecord = module.getHEarthRun8ER2CanonicalLiveRenderPackage();
    return {
      eligible: packageRecord?.eligible === true,
      packageIdentity: packageRecord?.packageIdentity ?? null,
      contentDigest: packageRecord?.contentDigest ?? null,
      numericIdentityBoundary: packageRecord?.sourceAuthorities?.numericIdentityBoundary ?? null,
      primitiveCount: packageRecord?.primitiveCount ?? null,
      vertexCount: packageRecord?.vertexCount ?? null,
      indexCount: packageRecord?.indexCount ?? null
    };
  }, { url: canonicalModuleUrl });

  assert.equal(browserPackageFacts.eligible, true, 'CP3D_CANONICAL_BROWSER_PACKAGE_NOT_ELIGIBLE');
  assert.equal(browserPackageFacts.packageIdentity, expectedIdentity, 'CP3D_CANONICAL_BROWSER_PACKAGE_IDENTITY_MISMATCH');
  assert.equal(browserPackageFacts.packageIdentity, nodePackage.packageIdentity, 'CP3D_CANONICAL_CROSS_RUNTIME_IDENTITY_MISMATCH');
  assert.equal(browserPackageFacts.contentDigest, nodePackage.contentDigest, 'CP3D_CANONICAL_CROSS_RUNTIME_DIGEST_MISMATCH');
  assert.equal(browserPackageFacts.numericIdentityBoundary, requiredBoundary, 'CP3D_CANONICAL_BROWSER_BOUNDARY_MISMATCH');
  assert.equal(browserPackageFacts.primitiveCount, nodePackage.primitiveCount, 'CP3D_CANONICAL_PRIMITIVE_COUNT_MISMATCH');
  assert.equal(browserPackageFacts.vertexCount, nodePackage.vertexCount, 'CP3D_CANONICAL_VERTEX_COUNT_MISMATCH');
  assert.equal(browserPackageFacts.indexCount, nodePackage.indexCount, 'CP3D_CANONICAL_INDEX_COUNT_MISMATCH');

  await writeFile(`${evidenceDirectory}/cp3d-browser-canonical-package-preflight.receipt.json`, `${JSON.stringify({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_BROWSER_CANONICAL_PACKAGE_PREFLIGHT_v1',
    eligible: true,
    status: 'CP3D_BROWSER_CANONICAL_PACKAGE_PREFLIGHT_PASS',
    expectedIdentity,
    requiredBoundary,
    node: {
      packageIdentity: nodePackage.packageIdentity,
      contentDigest: nodePackage.contentDigest,
      primitiveCount: nodePackage.primitiveCount,
      vertexCount: nodePackage.vertexCount,
      indexCount: nodePackage.indexCount
    },
    browser: browserPackageFacts
  }, null, 2)}\n`);

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
  assert.equal(publicReceipt?.liveGpu?.counters?.diagnosticEvidenceReadbackCount, 1, 'CP4_INITIAL_EVIDENCE_READBACK_COUNT_INVALID');
  assert.equal(publicReceipt?.liveGpu?.counters?.diagnosticPngEncodingCount, 1, 'CP4_INITIAL_PNG_ENCODING_COUNT_INVALID');
  assert.equal(publicReceipt?.liveGpu?.resources?.counters?.colorReadbackCount, 1, 'CP4_RENDERER_INITIAL_COLOR_READBACK_COUNT_INVALID');
  assert.equal(publicReceipt?.liveGpu?.resources?.counters?.visiblePresentationCount, 1, 'CP4_RENDERER_INITIAL_PRESENTATION_COUNT_INVALID');
  assert.equal(publicReceipt?.liveGpu?.correspondence?.packageUploadedOnce, true, 'CP3D_PACKAGE_NOT_UPLOADED_ONCE');
  assert.equal(publicReceipt?.liveGpu?.correspondence?.resourceIdentityStable, true, 'CP3D_GPU_RESOURCE_IDENTITY_UNSTABLE');
  assert.equal(publicReceipt?.runtimeExclusivity?.activeWebGL2ContextCount, 1, 'CP3D_WEBGL2_CONTEXT_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activePersistentRendererCount, 1, 'CP3D_RENDERER_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activePointerTouchIntakeCount, 1, 'CP3D_TOUCH_INTAKE_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.activeFramePresentationAuthorityCount, 1, 'CP3D_FRAME_AUTHORITY_COUNT_INVALID');
  assert.equal(publicReceipt?.runtimeExclusivity?.legacyModuleScriptCount, 0, 'CP3D_LEGACY_RUNTIME_PRESENT');

  tabletFluidityFacts = await page.evaluate(async () => {
    const api = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    if (!api?.getLiveGpuReceipt || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('CP4_TABLET_FLUIDITY_HOST_UNAVAILABLE');
    }
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const snapshot = () => {
      const gpu = api.getLiveGpuReceipt();
      return {
        presentations: Number(gpu?.counters?.gpuFramebufferPresentationCount ?? 0),
        readbacks: Number(gpu?.counters?.diagnosticEvidenceReadbackCount ?? 0),
        pngEncodes: Number(gpu?.counters?.diagnosticPngEncodingCount ?? 0),
        presentationOnlyFrames: Number(gpu?.counters?.navigationFramesPresentedWithoutReadbackCount ?? 0),
        rendererPresentations: Number(gpu?.resources?.counters?.visiblePresentationCount ?? 0),
        rendererColorReadbacks: Number(gpu?.resources?.counters?.colorReadbackCount ?? 0),
        rendererPngEncodes: Number(gpu?.resources?.counters?.pngEncodingCount ?? 0),
        maximumPresentationOnlyResponseMs: Number(gpu?.counters?.maximumPresentationOnlyResponseMs ?? 0),
        maximumEvidenceCaptureResponseMs: Number(gpu?.counters?.maximumEvidenceCaptureResponseMs ?? 0),
        continuousPresentationWithoutReadback:
          gpu?.correspondence?.continuousPresentationWithoutReadback === true,
        diagnosticReadbackSeparatedFromPresentation:
          gpu?.correspondence?.diagnosticReadbackSeparatedFromPresentation === true
      };
    };
    const bounds = canvas.getBoundingClientRect();
    const emit = (type, pointerId, x, y, isPrimary) => {
      canvas.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId,
        pointerType: 'touch',
        isPrimary,
        clientX: x,
        clientY: y,
        buttons: type === 'pointerup' ? 0 : 1,
        pressure: type === 'pointerup' ? 0 : 0.5
      }));
    };

    const firstX = bounds.left + bounds.width * 0.42;
    const secondX = bounds.left + bounds.width * 0.58;
    const startY = bounds.top + bounds.height * 0.72;
    const movedY = bounds.top + bounds.height * 0.48;
    const before = snapshot();

    emit('pointerdown', 101, firstX, startY, true);
    emit('pointerdown', 102, secondX, startY, false);
    emit('pointermove', 101, firstX, movedY, true);
    emit('pointermove', 102, secondX, movedY, false);
    await sleep(1200);
    const active = snapshot();

    emit('pointerup', 101, firstX, movedY, true);
    emit('pointerup', 102, secondX, movedY, false);
    await sleep(150);
    const releaseSettled = snapshot();
    await sleep(350);
    const afterRelease = snapshot();

    return {
      canvas: {
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight
      },
      before,
      active,
      releaseSettled,
      afterRelease,
      deltas: {
        activePresentations: active.presentations - before.presentations,
        activeReadbacks: active.readbacks - before.readbacks,
        activePngEncodes: active.pngEncodes - before.pngEncodes,
        activePresentationOnlyFrames:
          active.presentationOnlyFrames - before.presentationOnlyFrames,
        rendererActivePresentations:
          active.rendererPresentations - before.rendererPresentations,
        rendererActiveColorReadbacks:
          active.rendererColorReadbacks - before.rendererColorReadbacks,
        rendererActivePngEncodes:
          active.rendererPngEncodes - before.rendererPngEncodes,
        postReleasePresentations:
          afterRelease.presentations - releaseSettled.presentations
      }
    };
  });

  assert.ok(tabletFluidityFacts.deltas.activePresentations >= 5, 'CP4_TABLET_SUSTAINED_PRESENTATION_COUNT_TOO_LOW');
  assert.equal(tabletFluidityFacts.deltas.activeReadbacks, 0, 'CP4_TABLET_NAVIGATION_TRIGGERED_BINDING_READBACK');
  assert.equal(tabletFluidityFacts.deltas.activePngEncodes, 0, 'CP4_TABLET_NAVIGATION_TRIGGERED_BINDING_PNG_ENCODING');
  assert.equal(tabletFluidityFacts.deltas.rendererActiveColorReadbacks, 0, 'CP4_TABLET_NAVIGATION_TRIGGERED_RENDERER_READBACK');
  assert.equal(tabletFluidityFacts.deltas.rendererActivePngEncodes, 0, 'CP4_TABLET_NAVIGATION_TRIGGERED_RENDERER_PNG_ENCODING');
  assert.equal(
    tabletFluidityFacts.deltas.rendererActivePresentations,
    tabletFluidityFacts.deltas.activePresentations,
    'CP4_TABLET_BINDING_RENDERER_PRESENTATION_COUNT_DIVERGED'
  );
  assert.ok(
    tabletFluidityFacts.deltas.activePresentationOnlyFrames >=
      tabletFluidityFacts.deltas.activePresentations,
    'CP4_TABLET_PRESENTATION_ONLY_COUNTER_DID_NOT_COVER_ACTIVE_FRAMES'
  );
  assert.equal(tabletFluidityFacts.active.continuousPresentationWithoutReadback, true, 'CP4_TABLET_PRESENTATION_READBACK_SEPARATION_NOT_PUBLISHED');
  assert.equal(tabletFluidityFacts.active.diagnosticReadbackSeparatedFromPresentation, true, 'CP4_TABLET_DIAGNOSTIC_SEPARATION_CORRESPONDENCE_MISSING');
  assert.equal(tabletFluidityFacts.deltas.postReleasePresentations, 0, 'CP4_TABLET_MOTION_CONTINUED_AFTER_RELEASE');

  publicReceipt = await page.evaluate(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot());

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

  await page.screenshot({ path: `${evidenceDirectory}/cp4-tablet-fluidity-corrected.png`, fullPage: true });

  const executionReceipt = {
    receiptType: 'H_EARTH_TOUCH_MOTION_CP4_TABLET_FLUIDITY_CORRECTION_BROWSER_RECEIPT_v1',
    eligible: true,
    status: 'CP4_TABLET_FLUIDITY_CORRECTION_BROWSER_PASS',
    route,
    canonicalPackagePreflight: 'PASS',
    rendererConstructorReturned: 'PASS',
    firstFramePresented: 'PASS',
    visibleEnvironmentPreserved: true,
    touchRuntimeInstalled: 'PASS',
    cp2bObservationCompatible: 'PASS',
    cp3bRuntimeReceiptAvailable: 'PASS',
    continuousPresentationWithoutReadback: 'PASS',
    releaseTermination: 'PASS',
    tabletFluidityFacts,
    publicReceipt,
    canvasFacts,
    consoleMessages,
    pageErrors
  };
  await writeFile(`${evidenceDirectory}/cp4-tablet-fluidity-correction.receipt.json`, `${JSON.stringify(executionReceipt, null, 2)}\n`);
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
  await page.screenshot({ path: `${evidenceDirectory}/cp4-tablet-fluidity-failure.png`, fullPage: true }).catch(() => {});
  await writeFile(`${evidenceDirectory}/cp4-tablet-fluidity-failure.receipt.json`, `${JSON.stringify({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP4_TABLET_FLUIDITY_CORRECTION_FAILURE_v1',
    eligible: false,
    status: 'CP4_TABLET_FLUIDITY_CORRECTION_BROWSER_FAIL',
    error: { name: error.name, message: error.message, stack: error.stack ?? null },
    failureEvidence,
    tabletFluidityFacts,
    publicReceipt,
    consoleMessages,
    pageErrors
  }, null, 2)}\n`);
  throw error;
} finally {
  await browser.close();
}
