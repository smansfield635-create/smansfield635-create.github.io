import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { getHEarthOW01CanonicalLiveRenderPackageOccurrence } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const route = `${origin}/showroom/globe/h-earth/`;
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const canonicalModuleUrl = `${origin}/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js`;
const expectedOccurrenceId = 'H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001';
const requiredBoundary = 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY';

await mkdir(evidenceDirectory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});
const page = await browser.newPage({
  viewport: { width: 694, height: 747 },
  deviceScaleFactor: 1.5,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
});
const consoleMessages = [];
const pageErrors = [];
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text() }));
page.on('pageerror', error => pageErrors.push({ name: error.name, message: error.message, stack: error.stack ?? null }));

try {
  const nodePackage = getHEarthOW01CanonicalLiveRenderPackageOccurrence();
  assert.equal(nodePackage?.eligible, true, `CP3D_GEN329_NODE_OW01_PACKAGE_NOT_ELIGIBLE:${nodePackage?.issues?.join(',') ?? 'UNKNOWN'}`);
  assert.equal(nodePackage?.packageOccurrenceId, expectedOccurrenceId, 'CP3D_GEN329_NODE_OW01_OCCURRENCE_MISMATCH');
  assert.equal(nodePackage?.sourceAuthorities?.numericIdentityBoundary, requiredBoundary, 'CP3D_GEN329_NODE_PACKAGE_BOUNDARY_MISMATCH');

  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserPackageFacts = await page.evaluate(async ({ url, expectedOccurrenceId }) => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    const packageRecord = module.getHEarthOW01CanonicalLiveRenderPackageOccurrence();
    return {
      eligible: packageRecord?.eligible === true,
      packageOccurrenceId: packageRecord?.packageOccurrenceId ?? null,
      packageIdentity: packageRecord?.packageIdentity ?? null,
      contentDigest: packageRecord?.contentDigest ?? null,
      numericIdentityBoundary: packageRecord?.sourceAuthorities?.numericIdentityBoundary ?? null,
      primitiveCount: packageRecord?.primitiveCount ?? null,
      vertexCount: packageRecord?.vertexCount ?? null,
      indexCount: packageRecord?.indexCount ?? null,
      occurrenceMatches: packageRecord?.packageOccurrenceId === expectedOccurrenceId
    };
  }, { url: canonicalModuleUrl, expectedOccurrenceId });

  assert.equal(browserPackageFacts.eligible, true, 'CP3D_GEN329_BROWSER_OW01_PACKAGE_NOT_ELIGIBLE');
  assert.equal(browserPackageFacts.occurrenceMatches, true, 'CP3D_GEN329_BROWSER_OW01_OCCURRENCE_MISMATCH');
  assert.equal(browserPackageFacts.packageIdentity, nodePackage.packageIdentity, 'CP3D_GEN329_CROSS_RUNTIME_PACKAGE_IDENTITY_MISMATCH');
  assert.equal(browserPackageFacts.contentDigest, nodePackage.contentDigest, 'CP3D_GEN329_CROSS_RUNTIME_PACKAGE_DIGEST_MISMATCH');
  assert.equal(browserPackageFacts.numericIdentityBoundary, requiredBoundary, 'CP3D_GEN329_BROWSER_PACKAGE_BOUNDARY_MISMATCH');
  assert.equal(browserPackageFacts.primitiveCount, nodePackage.primitiveCount, 'CP3D_GEN329_PRIMITIVE_COUNT_MISMATCH');
  assert.equal(browserPackageFacts.vertexCount, nodePackage.vertexCount, 'CP3D_GEN329_VERTEX_COUNT_MISMATCH');
  assert.equal(browserPackageFacts.indexCount, nodePackage.indexCount, 'CP3D_GEN329_INDEX_COUNT_MISMATCH');

  await writeFile(`${evidenceDirectory}/cp3d-gen329-browser-package-preflight.receipt.json`, `${JSON.stringify({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_GEN329_BROWSER_OW01_PACKAGE_PREFLIGHT_v2',
    eligible: true,
    status: 'CP3D_GEN329_BROWSER_OW01_PACKAGE_PREFLIGHT_PASS',
    expectedOccurrenceId,
    requiredBoundary,
    node: {
      packageOccurrenceId: nodePackage.packageOccurrenceId,
      packageIdentity: nodePackage.packageIdentity,
      contentDigest: nodePackage.contentDigest,
      primitiveCount: nodePackage.primitiveCount,
      vertexCount: nodePackage.vertexCount,
      indexCount: nodePackage.indexCount
    },
    browser: browserPackageFacts,
    historicalR2CheckpointRewritten: false,
    gen329ProductMutation: false
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
    throw new Error(`CP3D_GEN329_BROWSER_STARTUP_FAILURE:${startup?.firstFailureStage ?? 'UNKNOWN'}:${startup?.exception?.message ?? startup?.failureClass ?? 'UNKNOWN'}`);
  }

  await page.waitForFunction(() => {
    const snapshot = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    return Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1;
  }, null, { timeout: 90_000 });

  const initial = await page.evaluate(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot());
  assert.equal(initial?.eligible, true, 'CP3D_GEN329_PUBLIC_RECEIPT_NOT_ELIGIBLE');
  assert.equal(initial?.status, 'RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_ACTIVE', 'CP3D_GEN329_PUBLIC_RUNTIME_NOT_ACTIVE');
  assert.equal(initial?.intake?.status, 'RUN_8E_CP3B_LOCKED_CONTINUOUS_TOUCH_ACTIVE', 'CP3D_GEN329_CP3B_RUNTIME_RECEIPT_UNAVAILABLE');
  assert.equal(initial?.intake?.semantics?.continuousMotionOutput, true, 'CP3D_GEN329_CONTINUOUS_MOTION_RUNTIME_NOT_INSTALLED');
  assert.equal(initial?.intake?.semantics?.cp2bObservationCompatible, true, 'CP3D_GEN329_CP2B_COMPATIBILITY_NOT_PRESERVED');
  assert.equal(initial?.liveGpu?.resources?.initialized, true, 'CP3D_GEN329_RENDERER_INITIALIZATION_NOT_COMPLETE');
  assert.ok(Number(initial?.liveGpu?.counters?.rendererInitializationCount ?? 0) >= 1, 'CP3D_GEN329_RENDERER_INITIALIZATION_COUNT_ZERO');
  assert.ok(Number(initial?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1, 'CP3D_GEN329_FIRST_FRAME_NOT_PRESENTED');
  assert.equal(initial?.liveGpu?.correspondence?.packageUploadedOnce, true, 'CP3D_GEN329_PACKAGE_NOT_UPLOADED_ONCE');
  assert.equal(initial?.liveGpu?.correspondence?.resourceIdentityStable, true, 'CP3D_GEN329_GPU_RESOURCE_IDENTITY_UNSTABLE');
  assert.equal(initial?.runtimeExclusivity?.activeWebGL2ContextCount, 1, 'CP3D_GEN329_WEBGL2_CONTEXT_COUNT_INVALID');
  assert.equal(initial?.runtimeExclusivity?.activePersistentRendererCount, 1, 'CP3D_GEN329_RENDERER_COUNT_INVALID');
  assert.equal(initial?.runtimeExclusivity?.activePointerTouchIntakeCount, 1, 'CP3D_GEN329_TOUCH_INTAKE_COUNT_INVALID');
  assert.equal(initial?.runtimeExclusivity?.activeFramePresentationAuthorityCount, 1, 'CP3D_GEN329_FRAME_AUTHORITY_COUNT_INVALID');
  assert.equal(initial?.runtimeExclusivity?.legacyModuleScriptCount, 0, 'CP3D_GEN329_LEGACY_RUNTIME_PRESENT');

  const sustained = await page.evaluate(async () => {
    const api = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    if (!api?.getLiveGpuReceipt || !(canvas instanceof HTMLCanvasElement)) throw new Error('CP3D_GEN329_TOUCH_HOST_UNAVAILABLE');
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
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
        continuousPresentationWithoutReadback: gpu?.correspondence?.continuousPresentationWithoutReadback === true,
        diagnosticReadbackSeparatedFromPresentation: gpu?.correspondence?.diagnosticReadbackSeparatedFromPresentation === true
      };
    };
    const bounds = canvas.getBoundingClientRect();
    const emit = (type, pointerId, x, y, isPrimary) => canvas.dispatchEvent(new PointerEvent(type, {
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
    const x1 = bounds.left + bounds.width * 0.42;
    const x2 = bounds.left + bounds.width * 0.58;
    const y0 = bounds.top + bounds.height * 0.72;
    const y1 = bounds.top + bounds.height * 0.48;
    const before = snapshot();
    emit('pointerdown', 101, x1, y0, true);
    emit('pointerdown', 102, x2, y0, false);
    emit('pointermove', 101, x1, y1, true);
    emit('pointermove', 102, x2, y1, false);
    await sleep(1200);
    const active = snapshot();
    emit('pointerup', 101, x1, y1, true);
    emit('pointerup', 102, x2, y1, false);
    await sleep(150);
    const releaseSettled = snapshot();
    await sleep(350);
    const afterRelease = snapshot();
    return {
      before, active, releaseSettled, afterRelease,
      deltas: {
        activePresentations: active.presentations - before.presentations,
        activeReadbacks: active.readbacks - before.readbacks,
        activePngEncodes: active.pngEncodes - before.pngEncodes,
        activePresentationOnlyFrames: active.presentationOnlyFrames - before.presentationOnlyFrames,
        rendererActivePresentations: active.rendererPresentations - before.rendererPresentations,
        rendererActiveColorReadbacks: active.rendererColorReadbacks - before.rendererColorReadbacks,
        rendererActivePngEncodes: active.rendererPngEncodes - before.rendererPngEncodes,
        postReleasePresentations: afterRelease.presentations - releaseSettled.presentations
      }
    };
  });

  assert.ok(sustained.deltas.activePresentations >= 5, 'CP3D_GEN329_SUSTAINED_PRESENTATION_COUNT_TOO_LOW');
  assert.equal(sustained.deltas.activeReadbacks, 0, 'CP3D_GEN329_NAVIGATION_TRIGGERED_BINDING_READBACK');
  assert.equal(sustained.deltas.activePngEncodes, 0, 'CP3D_GEN329_NAVIGATION_TRIGGERED_BINDING_PNG_ENCODING');
  assert.equal(sustained.deltas.rendererActiveColorReadbacks, 0, 'CP3D_GEN329_NAVIGATION_TRIGGERED_RENDERER_READBACK');
  assert.equal(sustained.deltas.rendererActivePngEncodes, 0, 'CP3D_GEN329_NAVIGATION_TRIGGERED_RENDERER_PNG_ENCODING');
  assert.equal(sustained.deltas.rendererActivePresentations, sustained.deltas.activePresentations, 'CP3D_GEN329_BINDING_RENDERER_PRESENTATION_COUNT_DIVERGED');
  assert.ok(sustained.deltas.activePresentationOnlyFrames >= sustained.deltas.activePresentations, 'CP3D_GEN329_PRESENTATION_ONLY_COUNTER_DID_NOT_COVER_ACTIVE_FRAMES');
  assert.equal(sustained.active.continuousPresentationWithoutReadback, true, 'CP3D_GEN329_PRESENTATION_READBACK_SEPARATION_NOT_PUBLISHED');
  assert.equal(sustained.active.diagnosticReadbackSeparatedFromPresentation, true, 'CP3D_GEN329_DIAGNOSTIC_SEPARATION_CORRESPONDENCE_MISSING');
  assert.equal(sustained.deltas.postReleasePresentations, 0, 'CP3D_GEN329_MOTION_CONTINUED_AFTER_RELEASE');

  const finalSnapshot = await page.evaluate(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot());
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
  assert.equal(canvasFacts.canvasPresent, true, 'CP3D_GEN329_CANVAS_NOT_PRESENT');
  assert.ok(canvasFacts.canvasWidth > 0 && canvasFacts.canvasHeight > 0, 'CP3D_GEN329_CANVAS_DIMENSIONS_INVALID');
  assert.equal(canvasFacts.routeReady, 'true', 'CP3D_GEN329_ROUTE_NOT_READY');
  assert.equal(canvasFacts.routeError, 'false', 'CP3D_GEN329_ROUTE_ERROR_PRESENT');
  await page.screenshot({ path: `${evidenceDirectory}/cp3d-gen329-renderer-survival.png`, fullPage: true });

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D_GEN329_BROWSER_RENDERER_SURVIVAL_RECEIPT_v2',
    eligible: true,
    status: 'CP3D_GEN329_BROWSER_RENDERER_SURVIVAL_PASS',
    route,
    package: {
      occurrenceId: nodePackage.packageOccurrenceId,
      identity: nodePackage.packageIdentity,
      contentDigest: nodePackage.contentDigest,
      crossRuntimeIdentityEqual: browserPackageFacts.packageIdentity === nodePackage.packageIdentity,
      crossRuntimeDigestEqual: browserPackageFacts.contentDigest === nodePackage.contentDigest
    },
    renderer: {
      initialized: finalSnapshot?.liveGpu?.resources?.initialized === true,
      firstFramePresented: Number(finalSnapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1,
      packageUploadedOnce: finalSnapshot?.liveGpu?.correspondence?.packageUploadedOnce === true,
      resourceIdentityStable: finalSnapshot?.liveGpu?.correspondence?.resourceIdentityStable === true
    },
    runtimeExclusivity: finalSnapshot?.runtimeExclusivity ?? null,
    sustainedTouch: sustained,
    canvas: canvasFacts,
    pageErrors,
    consoleMessages,
    historicalR2CheckpointRewritten: false,
    gen329ProductMutation: false,
    experienceAnchorMutation: false,
    mergeAuthorized: false,
    deploymentAuthorized: false
  });
  await writeFile(`${evidenceDirectory}/cp3d-gen329-browser-renderer-survival.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await browser.close();
}
