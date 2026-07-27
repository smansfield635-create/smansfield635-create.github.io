import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3DControl } from '../control-plane/run-8/recovery/h-earth.run8e-r3d.diagnostic-direct-interaction.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3D_OUTPUT ?? '/tmp/h-earth-run8e-r3d';
const targetUrl = process.env.H_EARTH_RUN8E_R3D_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3d/';
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
const writeJson = (filename, value) =>
  fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const decodeDataUrl = (dataUrl) => {
  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl ?? '');
  if (!match) throw new Error('R3D_PNG_DATA_URL_INVALID');
  return Buffer.from(match[1], 'base64');
};
const pngDimensions = (bytes) => {
  assert(bytes.length > 24 && bytes.subarray(1, 4).toString('ascii') === 'PNG', 'R3D_PNG_SIGNATURE_INVALID');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3DControl();
assert(parent.eligible === true, `R3D_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

let browser = null;
const browserEvents = { consoleErrors: [], pageErrors: [], requestFailures: [] };
try {
  browser = await chromium.launch({ headless: true, args: chromiumArgs });
  const context = await browser.newContext({
    viewport: { width: 430, height: 860 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
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
  await page.waitForFunction(() =>
    document.documentElement.dataset.r3dReady === 'true' ||
    Boolean(window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION_ERROR), null, { timeout: 180000 });
  const browserError = await page.evaluate(() =>
    window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION_ERROR ?? null);
  if (browserError) throw new Error(`R3D_BROWSER_INITIALIZATION_FAILED:${browserError}`);

  const dispatchPointer = async (type, init) => {
    await page.evaluate(({ type: eventType, init: eventInit }) => {
      const canvas = document.getElementById('r3d-canvas');
      canvas.dispatchEvent(new PointerEvent(eventType, {
        bubbles: true,
        cancelable: true,
        composed: true,
        width: 12,
        height: 12,
        pressure: eventType === 'pointerup' ? 0 : 0.5,
        buttons: eventType === 'pointerup' ? 0 : 1,
        button: 0,
        ...eventInit
      }));
    }, { type, init });
  };

  const waitFor = async (predicateSource, argument) => {
    await page.waitForFunction(
      ({ predicateSource: source, argument: value }) => {
        const receipt = window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION?.getReceipt();
        return Function('receipt', 'argument', `return (${source})(receipt, argument);`)(receipt, value);
      },
      { predicateSource, argument },
      { timeout: 180000 }
    );
  };

  const capture = async (label) =>
    page.evaluate((captureLabel) =>
      window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION.capture(captureLabel), label);

  const captures = {};
  captures.initial = await page.evaluate(() =>
    window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION.initialCapture);

  // One-finger look: horizontal turn and vertical pitch in one browser gesture.
  await dispatchPointer('pointerdown', {
    pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 180, clientY: 220
  });
  await dispatchPointer('pointermove', {
    pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 300, clientY: 145
  });
  await dispatchPointer('pointerup', {
    pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 300, clientY: 145
  });
  await waitFor(
    `(receipt) => (receipt?.interaction?.actionCounts?.TURN_RIGHT ?? 0) >= 1 &&
      (receipt?.interaction?.actionCounts?.PITCH_UP ?? 0) >= 1 &&
      receipt?.interaction?.diagnostics?.gpuFrameCount >= 1`,
    null
  );
  captures.look = await capture('look');

  // Two-finger travel: matched upward centroid movement.
  await dispatchPointer('pointerdown', {
    pointerId: 2, pointerType: 'touch', isPrimary: true, clientX: 140, clientY: 250
  });
  await dispatchPointer('pointerdown', {
    pointerId: 3, pointerType: 'touch', isPrimary: false, clientX: 300, clientY: 250
  });
  await dispatchPointer('pointermove', {
    pointerId: 2, pointerType: 'touch', isPrimary: true, clientX: 140, clientY: 170
  });
  await dispatchPointer('pointermove', {
    pointerId: 3, pointerType: 'touch', isPrimary: false, clientX: 300, clientY: 170
  });
  await dispatchPointer('pointerup', {
    pointerId: 2, pointerType: 'touch', isPrimary: true, clientX: 140, clientY: 170
  });
  await dispatchPointer('pointerup', {
    pointerId: 3, pointerType: 'touch', isPrimary: false, clientX: 300, clientY: 170
  });
  await waitFor(
    `(receipt) => (receipt?.interaction?.actionCounts?.MOVE_FORWARD ?? 0) >= 1 &&
      receipt?.interaction?.diagnostics?.gpuFrameCount >= 2`,
    null
  );
  captures.travel = await capture('travel');

  // Two-finger pinch: expanding distance produces zoom-in.
  await dispatchPointer('pointerdown', {
    pointerId: 4, pointerType: 'touch', isPrimary: true, clientX: 175, clientY: 220
  });
  await dispatchPointer('pointerdown', {
    pointerId: 5, pointerType: 'touch', isPrimary: false, clientX: 255, clientY: 220
  });
  await dispatchPointer('pointermove', {
    pointerId: 4, pointerType: 'touch', isPrimary: true, clientX: 115, clientY: 220
  });
  await dispatchPointer('pointermove', {
    pointerId: 5, pointerType: 'touch', isPrimary: false, clientX: 315, clientY: 220
  });
  await dispatchPointer('pointerup', {
    pointerId: 4, pointerType: 'touch', isPrimary: true, clientX: 115, clientY: 220
  });
  await dispatchPointer('pointerup', {
    pointerId: 5, pointerType: 'touch', isPrimary: false, clientX: 315, clientY: 220
  });
  await waitFor(
    `(receipt) => (receipt?.interaction?.actionCounts?.ZOOM_IN ?? 0) >= 1 &&
      receipt?.interaction?.diagnostics?.gpuFrameCount >= 3`,
    null
  );
  captures.pinch = await capture('pinch');

  // Desktop fallback remains available without changing the mobile model.
  await page.evaluate(() => {
    const canvas = document.getElementById('r3d-canvas');
    canvas.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: -160,
      ctrlKey: false
    }));
  });
  await waitFor(
    `(receipt) => receipt?.interaction?.diagnostics?.wheelEventCount >= 1 &&
      receipt?.interaction?.diagnostics?.gpuFrameCount >= 4`,
    null
  );
  captures.wheel = await capture('wheel');

  const state = await page.evaluate(() =>
    window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION.getReceipt());
  const depthOutput = await page.evaluate(() =>
    window.H_EARTH_RUN8E_R3D_DIRECT_INTERACTION.captureDepth());

  const interaction = state.interaction;
  const resources = state.resources;
  assert(interaction.diagnostics.pointerDownCount === 5, 'R3D_POINTER_DOWN_COUNT_INVALID');
  assert(interaction.diagnostics.pointerMoveCount === 5, 'R3D_POINTER_MOVE_COUNT_INVALID');
  assert(interaction.diagnostics.pointerUpCount === 5, 'R3D_POINTER_UP_COUNT_INVALID');
  assert((interaction.pointerTypeCounts.touch ?? 0) === 5, 'R3D_TOUCH_POINTER_EVENTS_NOT_ESTABLISHED');
  assert(interaction.diagnostics.wheelEventCount === 1, 'R3D_WHEEL_EVENT_COUNT_INVALID');
  assert((interaction.actionCounts.TURN_RIGHT ?? 0) >= 1, 'R3D_ONE_FINGER_TURN_NOT_ESTABLISHED');
  assert((interaction.actionCounts.PITCH_UP ?? 0) >= 1, 'R3D_ONE_FINGER_PITCH_NOT_ESTABLISHED');
  assert((interaction.actionCounts.MOVE_FORWARD ?? 0) >= 2, 'R3D_TRAVEL_NOT_ESTABLISHED');
  assert((interaction.actionCounts.ZOOM_IN ?? 0) >= 1, 'R3D_PINCH_ZOOM_NOT_ESTABLISHED');
  assert(interaction.diagnostics.acceptedProposalCount >= 5, 'R3D_ACCEPTED_PROPOSAL_COUNT_INSUFFICIENT');
  assert(interaction.diagnostics.rejectedProposalCount === 0, 'R3D_NAVIGATION_PROPOSAL_REJECTED');
  assert(interaction.diagnostics.gpuFrameCount >= 4, 'R3D_DIRECT_GPU_FRAME_COUNT_INSUFFICIENT');
  assert(interaction.diagnostics.maximumInputToFrameLatencyMilliseconds <= 500, 'R3D_INPUT_TO_FRAME_LATENCY_EXCESSIVE');
  assert(interaction.diagnostics.bitmapPreviewTransformCount === 0, 'R3D_BITMAP_PREVIEW_TRANSFORM_USED');
  assert(interaction.diagnostics.cpuRasterRefreshCount === 0, 'R3D_CPU_RASTER_REFRESH_USED');
  assert(interaction.diagnostics.drawImageCount === 0, 'R3D_DRAW_IMAGE_PREVIEW_USED');
  assert(interaction.diagnostics.canvas2DContextRequestCount === 0, 'R3D_2D_CANVAS_CONTEXT_USED');
  assert(interaction.diagnostics.imageBitmapCreateCount === 0, 'R3D_IMAGE_BITMAP_USED');
  assert(interaction.canvas.cssTransform === '', 'R3D_CANVAS_TRANSFORM_PREVIEW_ACTIVE');
  assert(Object.values(interaction.correspondence).every(Boolean), 'R3D_INTERACTION_CORRESPONDENCE_FAILED');
  assert(Object.values(interaction.boundaries).every((value) => value === false), 'R3D_INTERACTION_BOUNDARY_VIOLATION');

  assert(resources.counters.contextCreationCount === 1, 'R3D_CONTEXT_CREATION_COUNT_INVALID');
  assert(resources.counters.shaderCompileCount === 4, 'R3D_SHADER_COMPILE_COUNT_INVALID');
  assert(resources.counters.programLinkCount === 2, 'R3D_PROGRAM_LINK_COUNT_INVALID');
  assert(resources.counters.bufferCreateCount === 9, 'R3D_BUFFER_CREATE_COUNT_INVALID');
  assert(resources.counters.bufferUploadCount === 9, 'R3D_BUFFER_UPLOAD_COUNT_INVALID');
  assert(resources.counters.postInitializationResourceCreationCount === 0, 'R3D_POST_INITIALIZATION_RESOURCE_CREATION');
  assert(resources.counters.postInitializationBufferUploadCount === 0, 'R3D_POST_INITIALIZATION_BUFFER_UPLOAD');
  assert(resources.counters.frameCount === 1 + interaction.diagnostics.gpuFrameCount, 'R3D_RENDERER_FRAME_COUNT_MISMATCH');
  assert(resources.counters.cameraUniformUpdateCount === resources.counters.frameCount * 2, 'R3D_CAMERA_UNIFORM_UPDATE_COUNT_INVALID');
  assert(resources.counters.geometryDrawCallCount === resources.counters.frameCount * 4, 'R3D_GEOMETRY_DRAW_COUNT_INVALID');
  assert(resources.counters.totalDrawnIndexCount === resources.counters.frameCount * 147120, 'R3D_DRAWN_INDEX_COUNT_INVALID');
  assert(resources.resourceIdentityStable === true, 'R3D_PERSISTENT_RESOURCE_IDENTITY_NOT_STABLE');
  assert(resources.packageUploadedOnce === true, 'R3D_PACKAGE_NOT_UPLOADED_ONCE');
  assert(depthOutput.nonClearPixelCount > 0, 'R3D_DEPTH_OUTPUT_EMPTY');
  assert(browserEvents.consoleErrors.length === 0, `R3D_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
  assert(browserEvents.pageErrors.length === 0, `R3D_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0, `R3D_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);

  const frameArtifacts = {};
  for (const label of ['initial', 'look', 'travel', 'pinch', 'wheel']) {
    const captureRecord = captures[label];
    const bytes = decodeDataUrl(captureRecord?.pngDataUrl);
    const dimensions = pngDimensions(bytes);
    assert(dimensions.width === 640 && dimensions.height === 360, `R3D_${label.toUpperCase()}_PNG_DIMENSIONS_INVALID`);
    const filename = `h-earth.run8e-r3d.${label}-frame.png`;
    fs.writeFileSync(path.join(outputDirectory, filename), bytes);
    frameArtifacts[label] = {
      filename,
      byteLength: bytes.length,
      sha256: sha256(bytes),
      pixelHash: captureRecord.summary.byteHash,
      nonClearPixelCount: captureRecord.summary.nonClearPixelCount,
      ...dimensions
    };
  }
  assert(new Set(Object.values(frameArtifacts).map((entry) => entry.sha256)).size === 5, 'R3D_VISIBLE_FRAME_ARTIFACTS_NOT_DISTINCT');
  assert(new Set(Object.values(frameArtifacts).map((entry) => entry.pixelHash)).size === 5, 'R3D_VISIBLE_PIXEL_HASHES_NOT_DISTINCT');

  const diagnosticPagePath = path.join(outputDirectory, 'h-earth.run8e-r3d.diagnostic-page.png');
  await page.screenshot({ path: diagnosticPagePath, fullPage: true });
  const diagnosticBytes = fs.readFileSync(diagnosticPagePath);

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3D_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    browserState: state,
    interactionSummary: {
      actionCounts: interaction.actionCounts,
      pointerTypeCounts: interaction.pointerTypeCounts,
      diagnostics: interaction.diagnostics,
      initialNavigationSequence: 1,
      finalNavigationSequence: interaction.navigationState.sequence,
      finalAction: interaction.navigationState.action
    },
    resourcePersistence: {
      counters: resources.counters,
      persistentObjectCounts: resources.persistentObjectCounts,
      resourceIdentityStable: resources.resourceIdentityStable,
      packageUploadedOnce: resources.packageUploadedOnce,
      noPostInitializationResourceCreation: resources.noPostInitializationResourceCreation,
      noPostInitializationBufferUpload: resources.noPostInitializationBufferUpload
    },
    frameArtifacts,
    distinctFrameArtifactCount: 5,
    depthOutput,
    diagnosticPage: {
      filename: path.basename(diagnosticPagePath),
      byteLength: diagnosticBytes.length,
      sha256: sha256(diagnosticBytes)
    },
    browserEvents,
    correspondence: {
      realBrowserPointerEventObjects: true,
      touchPointerEvents: (interaction.pointerTypeCounts.touch ?? 0) === 5,
      oneFingerLook: (interaction.actionCounts.TURN_RIGHT ?? 0) >= 1 &&
        (interaction.actionCounts.PITCH_UP ?? 0) >= 1,
      twoFingerTravel: (interaction.actionCounts.MOVE_FORWARD ?? 0) >= 1,
      pinchZoom: (interaction.actionCounts.ZOOM_IN ?? 0) >= 1,
      wheelFallback: interaction.diagnostics.wheelEventCount === 1,
      acceptedNavigationProposalsDriveGpuFrames:
        interaction.diagnostics.acceptedProposalCount >= interaction.diagnostics.gpuFrameCount,
      noBitmapPreview: interaction.correspondence.noBitmapPreview,
      noCpuRasterRefresh: interaction.correspondence.noCpuRasterRefresh,
      samePersistentRendererRetained: interaction.correspondence.samePersistentRendererRetained,
      noResourceRecreation: resources.counters.postInitializationResourceCreationCount === 0,
      noGpuReupload: resources.counters.postInitializationBufferUploadCount === 0,
      visibleFramesDistinct: true,
      navigationAuthorityMutated: false,
      cameraAuthorityCreated: false,
      publicRouteBound: false
    },
    stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E',
    issues: []
  };
  writeJson('h-earth.run8e-r3d.diagnostic-direct-interaction.execution.receipt.json', executionReceipt);
  console.log(JSON.stringify({
    status: executionReceipt.status,
    actions: executionReceipt.interactionSummary.actionCounts,
    gpuFrames: interaction.diagnostics.gpuFrameCount,
    resourceCounters: resources.counters,
    frameArtifacts,
    maximumInputToFrameLatencyMilliseconds:
      interaction.diagnostics.maximumInputToFrameLatencyMilliseconds,
    stoppingBoundary: executionReceipt.stoppingBoundary
  }, null, 2));
} finally {
  await browser?.close();
}
