import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3d3.live-gpu-camera-response.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3D3_OUTPUT ?? '/tmp/h-earth-run8e-r3d3';
const targetUrl = process.env.H_EARTH_RUN8E_R3D3_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3d/';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const writeDataUrl = (filename, dataUrl) => {
  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl ?? '');
  if (!match) throw new Error(`R3D3_PNG_DATA_URL_INVALID:${filename}`);
  const bytes = Buffer.from(match[1], 'base64');
  fs.writeFileSync(path.join(outputDirectory, filename), bytes);
  return { filename, byteLength: bytes.length, sha256: sha256(bytes) };
};

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D3Control();
assert(parent.eligible === true, `R3D3_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D3_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

let browser = null;
const browserEvents = { consoleErrors: [], pageErrors: [], requestFailures: [] };
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    window.__R3D3_CONTEXT_CALLS = [];
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      window.__R3D3_CONTEXT_CALLS.push(String(type));
      return original.call(this, type, ...args);
    };
  });
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  page.on('console', (message) => { if (message.type() === 'error') browserEvents.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
  page.on('requestfailed', (request) => browserEvents.requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText ?? 'FAILED' }));

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => document.documentElement.dataset.r3d3Ready === 'true', null, { timeout: 120000 });

  const initial = await page.evaluate(() => ({
    intake: window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE.getReceipt(),
    liveGpu: window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING.getReceipt(),
    png: window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING.getLastPngDataUrl()
  }));
  const initialPng = writeDataUrl('h-earth.run8e-r3d3.initial-visible-frame.png', initial.png);

  const dispatchPointer = async (type, pointerId, x, y, buttons = 1) => {
    await page.evaluate(({ type, pointerId, x, y, buttons }) => {
      const canvas = document.getElementById('r3d-canvas');
      canvas.dispatchEvent(new PointerEvent(type, {
        pointerId,
        pointerType: 'touch',
        clientX: x,
        clientY: y,
        buttons,
        bubbles: true,
        cancelable: true,
        isPrimary: pointerId === 1
      }));
    }, { type, pointerId, x, y, buttons });
  };

  await dispatchPointer('pointerdown', 1, 150, 160, 1);
  await dispatchPointer('pointermove', 1, 235, 160, 1);
  await dispatchPointer('pointerup', 1, 235, 160, 0);

  await dispatchPointer('pointerdown', 1, 120, 260, 1);
  await dispatchPointer('pointerdown', 2, 270, 260, 1);
  await dispatchPointer('pointermove', 1, 120, 220, 1);
  await dispatchPointer('pointermove', 2, 270, 220, 1);
  await dispatchPointer('pointerup', 1, 120, 220, 0);
  await dispatchPointer('pointerup', 2, 270, 220, 0);

  await dispatchPointer('pointerdown', 1, 165, 260, 1);
  await dispatchPointer('pointerdown', 2, 225, 260, 1);
  await dispatchPointer('pointermove', 1, 120, 260, 1);
  await dispatchPointer('pointermove', 2, 270, 260, 1);
  await dispatchPointer('pointerup', 1, 120, 260, 0);
  await dispatchPointer('pointerup', 2, 270, 260, 0);

  await page.evaluate(() => {
    const canvas = document.getElementById('r3d-canvas');
    canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: -140, ctrlKey: false, bubbles: true, cancelable: true }));
    canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, ctrlKey: true, bubbles: true, cancelable: true }));
  });

  const final = await page.evaluate(() => ({
    intake: window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE.getReceipt(),
    liveGpu: window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING.getReceipt(),
    png: window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING.getLastPngDataUrl(),
    pageAudit: {
      contextCalls: [...window.__R3D3_CONTEXT_CALLS],
      inlineTransform: document.getElementById('r3d-canvas').style.transform,
      computedTransform: getComputedStyle(document.getElementById('r3d-canvas')).transform,
      touchAction: getComputedStyle(document.getElementById('r3d-canvas')).touchAction,
      imageElementCount: document.querySelectorAll('img').length,
      controllerElementPresent: document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null,
      descriptor: window.H_EARTH_RUN8E_R3D3_DIAGNOSTIC_HOST_DESCRIPTOR
    }
  }));
  const finalPng = writeDataUrl('h-earth.run8e-r3d3.final-visible-frame.png', final.png);
  const pageScreenshotPath = path.join(outputDirectory, 'h-earth.run8e-r3d3.diagnostic-page.png');
  await page.screenshot({ path: pageScreenshotPath, fullPage: true });
  const pageScreenshotBytes = fs.readFileSync(pageScreenshotPath);

  const intake = final.intake;
  const gpu = final.liveGpu;
  const resources = gpu.resources;
  const frameCount = gpu.counters.gpuFramebufferPresentationCount;
  const minimumVisiblePixels = Math.floor(640 * 360 * 0.002);

  assert(intake.counters.navigationProposalCount === 7, 'R3D3_NAVIGATION_PROPOSAL_COUNT_INVALID');
  assert(intake.counters.acceptedNavigationProposalCount === 7, 'R3D3_ACCEPTED_PROPOSAL_COUNT_INVALID');
  assert(gpu.counters.navigationStateAcceptanceCount === 7, 'R3D3_GPU_ACCEPTANCE_COUNT_INVALID');
  assert(frameCount === 8, 'R3D3_VISIBLE_FRAME_COUNT_INVALID');
  assert(gpu.counters.renderFrameCallCount === frameCount, 'R3D3_RENDER_FRAME_COUNT_INVALID');
  assert(gpu.counters.r3AFramePacketCount === frameCount + 1, 'R3D3_R3A_PACKET_COUNT_INVALID');
  assert(gpu.counters.rendererInitializationCount === 1, 'R3D3_RENDERER_INITIALIZATION_COUNT_INVALID');
  assert(gpu.counters.worldRebuildCount === 0, 'R3D3_WORLD_REBUILD_OBSERVED');
  assert(gpu.counters.bitmapPreviewApplicationCount === 0, 'R3D3_BITMAP_PREVIEW_APPLIED');
  assert(gpu.counters.cssTransformPreviewCount === 0, 'R3D3_CSS_TRANSFORM_PREVIEW_APPLIED');
  assert(gpu.counters.deferredRenderCommitCount === 0, 'R3D3_DEFERRED_RENDER_COMMIT_CREATED');
  assert(gpu.counters.queuedFrameChainCount === 0, 'R3D3_FRAME_QUEUE_CREATED');
  assert(gpu.counters.maximumSynchronousResponseMs < 1500, 'R3D3_SYNCHRONOUS_RESPONSE_EXCESSIVE');
  assert(gpu.distinctFrameHashCount >= 3, 'R3D3_DISTINCT_VISIBLE_FRAME_COUNT_INSUFFICIENT');
  assert(gpu.frameRecords[0].colorSummary.byteHash !== gpu.frameRecords.at(-1).colorSummary.byteHash, 'R3D3_INITIAL_FINAL_FRAME_HASH_IDENTICAL');
  assert(gpu.frameRecords.every((record) => record.colorSummary.nonClearPixelCount >= minimumVisiblePixels), 'R3D3_VISIBLE_FRAME_PIXEL_COVERAGE_INSUFFICIENT');
  assert(gpu.frameRecords.every((record) => record.colorSummary.uniqueColorBucketCount >= 8), 'R3D3_VISIBLE_FRAME_COLOR_VARIATION_INSUFFICIENT');
  assert(gpu.frameRecords.every((record) => record.worldBuiltBecauseCameraMoved === false), 'R3D3_FRAME_REBUILT_WORLD');
  assert(gpu.frameRecords.every((record) => record.successorTerrainCameraReconciled === true), 'R3D3_TERRAIN_CAMERA_RECONCILIATION_MISSING');

  assert(resources.counters.contextCreationCount === 1, 'R3D3_CONTEXT_COUNT_INVALID');
  assert(resources.counters.bufferCreateCount === 9, 'R3D3_BUFFER_CREATE_COUNT_INVALID');
  assert(resources.counters.bufferUploadCount === 9, 'R3D3_BUFFER_UPLOAD_COUNT_INVALID');
  assert(resources.counters.postInitializationResourceCreationCount === 0, 'R3D3_POST_INITIALIZATION_RESOURCE_CREATION');
  assert(resources.counters.postInitializationBufferUploadCount === 0, 'R3D3_POST_INITIALIZATION_BUFFER_UPLOAD');
  assert(resources.counters.frameCount === frameCount, 'R3D3_RENDERER_FRAME_COUNT_INVALID');
  assert(resources.counters.cameraUniformUpdateCount === frameCount * 2, 'R3D3_CAMERA_UNIFORM_UPDATE_COUNT_INVALID');
  assert(resources.counters.geometryDrawCallCount === frameCount * 4, 'R3D3_DRAW_CALL_COUNT_INVALID');
  assert(resources.counters.totalDrawnIndexCount === frameCount * 147120, 'R3D3_DRAWN_INDEX_COUNT_INVALID');
  assert(resources.packageUploadedOnce === true, 'R3D3_PACKAGE_NOT_UPLOADED_ONCE');
  assert(resources.resourceIdentityStable === true, 'R3D3_RESOURCE_IDENTITY_NOT_STABLE');
  assert(resources.noPostInitializationResourceCreation === true, 'R3D3_RESOURCE_PERSISTENCE_FAILED');
  assert(resources.noPostInitializationBufferUpload === true, 'R3D3_BUFFER_PERSISTENCE_FAILED');

  assert(final.pageAudit.contextCalls.length === 1 && final.pageAudit.contextCalls[0] === 'webgl2', 'R3D3_UNEXPECTED_CANVAS_CONTEXT_CALLS');
  assert(final.pageAudit.inlineTransform === '', 'R3D3_INLINE_CANVAS_TRANSFORM_CREATED');
  assert(final.pageAudit.computedTransform === 'none', 'R3D3_COMPUTED_CANVAS_TRANSFORM_CREATED');
  assert(final.pageAudit.touchAction === 'none', 'R3D3_TOUCH_ACTION_NOT_LOCKED');
  assert(final.pageAudit.imageElementCount === 0, 'R3D3_DOM_IMAGE_PRESENTATION_CREATED');
  assert(final.pageAudit.controllerElementPresent === false, 'R3D3_VISIBLE_CONTROLLER_CREATED');
  assert(Object.values(gpu.boundaries).every((value) => value === false), 'R3D3_BOUNDARY_VIOLATION');
  assert(browserEvents.consoleErrors.length === 0, `R3D3_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
  assert(browserEvents.pageErrors.length === 0, `R3D3_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0, `R3D3_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);
  assert(initialPng.sha256 !== finalPng.sha256, 'R3D3_INITIAL_FINAL_PNG_IDENTICAL');

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3D3_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    intake,
    liveGpu: gpu,
    pageAudit: final.pageAudit,
    browserEvents,
    artifacts: {
      initialVisibleFrame: initialPng,
      finalVisibleFrame: finalPng,
      diagnosticPage: {
        filename: path.basename(pageScreenshotPath),
        byteLength: pageScreenshotBytes.length,
        sha256: sha256(pageScreenshotBytes)
      }
    },
    correspondence: {
      acceptedProposalCount: intake.counters.acceptedNavigationProposalCount,
      visibleGpuFrameCount: frameCount,
      distinctFrameHashCount: gpu.distinctFrameHashCount,
      packageUploadedOnce: resources.packageUploadedOnce,
      postInitializationResourceCreationCount: resources.counters.postInitializationResourceCreationCount,
      postInitializationBufferUploadCount: resources.counters.postInitializationBufferUploadCount,
      worldRebuildCount: gpu.counters.worldRebuildCount,
      bitmapPreviewApplied: gpu.boundaries.bitmapPreviewApplied,
      cssCanvasTransformPreviewApplied: gpu.boundaries.cssCanvasTransformPreviewApplied
    },
    stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4',
    issues: []
  };
  writeJson('h-earth.run8e-r3d3.live-gpu-camera-response.execution.receipt.json', executionReceipt);
  console.log(JSON.stringify({
    status: executionReceipt.status,
    proposalCount: intake.counters.navigationProposalCount,
    visibleGpuFrameCount: frameCount,
    distinctFrameHashCount: gpu.distinctFrameHashCount,
    rendererCounters: resources.counters,
    initialFrame: initialPng,
    finalFrame: finalPng,
    maximumSynchronousResponseMs: gpu.counters.maximumSynchronousResponseMs,
    stoppingBoundary: executionReceipt.stoppingBoundary
  }, null, 2));
} finally {
  await browser?.close();
}
