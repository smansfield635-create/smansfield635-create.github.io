import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D4Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3d4.interaction-browser-execution.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3D4_OUTPUT ?? '/tmp/h-earth-run8e-r3d4';
const targetUrl = process.env.H_EARTH_RUN8E_R3D4_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3d/';
const cadenceMs = 350;
const interactionGroupCount = 24;
const maximumDeliveryLagThresholdMs = 2000;
const maximumCompletionLagThresholdMs = 2000;
const maximumActionProcessingThresholdMs = 1000;
fs.mkdirSync(outputDirectory, { recursive: true });

const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const percentile = (values, fraction) => {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.max(0, Math.ceil(ordered.length * fraction) - 1))] ?? 0;
};
const orientationOf = (width, height) => width >= height ? 'LANDSCAPE' : 'PORTRAIT';

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D4Control();
assert(parent.eligible === true, `R3D4_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D4_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

const definitions = [
  { sessionId: 'PORTRAIT', width: 390, height: 844 },
  { sessionId: 'LANDSCAPE', width: 844, height: 390 }
];
const completedSessions = [];
let browser = null;

try {
  browser = await chromium.launch({ headless: true });

  for (const definition of definitions) {
    const context = await browser.newContext({
      viewport: { width: definition.width, height: definition.height },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();
    page.setDefaultTimeout(120000);
    const browserEvents = { consoleErrors: [], pageErrors: [], requestFailures: [] };
    page.on('console', (message) => { if (message.type() === 'error') browserEvents.consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
    page.on('requestfailed', (request) => browserEvents.requestFailures.push({
      url: request.url(),
      errorText: request.failure()?.errorText ?? 'FAILED'
    }));

    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForFunction(() => document.documentElement.dataset.r3d3Ready === 'true', null, { timeout: 120000 });

    const execution = await page.evaluate(async ({ cadenceMs, interactionGroupCount }) => {
      const canvas = document.getElementById('r3d-canvas');
      const intake = window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE;
      const binding = window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING;
      if (!(canvas instanceof HTMLCanvasElement) || !intake || !binding) {
        throw new Error('R3D4_DIAGNOSTIC_RUNTIME_MISSING');
      }

      const initialIntake = intake.getReceipt();
      const initialBinding = binding.getReceipt();
      const initialFrameCount = initialBinding.frameRecords.length;
      const initialProposalCount = initialIntake.counters.navigationProposalCount;
      const initialAcceptedCount = initialIntake.counters.acceptedNavigationProposalCount;
      const rect = canvas.getBoundingClientRect();
      const point = (x, y) => ({ x: rect.left + rect.width * x, y: rect.top + rect.height * y });
      const pointer = (type, id, x, y, buttons = 1) => canvas.dispatchEvent(new PointerEvent(type, {
        pointerId: id,
        pointerType: 'touch',
        clientX: x,
        clientY: y,
        buttons,
        bubbles: true,
        cancelable: true,
        isPrimary: id === 1
      }));

      const look = (direction) => {
        const start = point(direction > 0 ? 0.30 : 0.70, 0.35);
        const end = point(direction > 0 ? 0.68 : 0.32, 0.35);
        pointer('pointerdown', 1, start.x, start.y);
        pointer('pointermove', 1, end.x, end.y);
        pointer('pointerup', 1, end.x, end.y, 0);
      };
      const travel = (direction) => {
        const startY = direction > 0 ? 0.70 : 0.42;
        const endY = direction > 0 ? 0.42 : 0.70;
        const a = point(0.30, startY);
        const b = point(0.70, startY);
        const c = point(0.30, endY);
        const d = point(0.70, endY);
        pointer('pointerdown', 1, a.x, a.y);
        pointer('pointerdown', 2, b.x, b.y);
        pointer('pointermove', 1, c.x, c.y);
        pointer('pointermove', 2, d.x, d.y);
        pointer('pointerup', 1, c.x, c.y, 0);
        pointer('pointerup', 2, d.x, d.y, 0);
      };
      const pinch = (direction) => {
        const nearA = point(0.42, 0.62);
        const nearB = point(0.58, 0.62);
        const farA = point(0.22, 0.62);
        const farB = point(0.78, 0.62);
        const a = direction > 0 ? nearA : farA;
        const b = direction > 0 ? nearB : farB;
        const c = direction > 0 ? farA : nearA;
        const d = direction > 0 ? farB : nearB;
        pointer('pointerdown', 1, a.x, a.y);
        pointer('pointerdown', 2, b.x, b.y);
        pointer('pointermove', 1, c.x, c.y);
        pointer('pointermove', 2, d.x, d.y);
        pointer('pointerup', 1, c.x, c.y, 0);
        pointer('pointerup', 2, d.x, d.y, 0);
      };
      const wheel = (deltaY, ctrlKey) => canvas.dispatchEvent(new WheelEvent('wheel', {
        deltaY,
        ctrlKey,
        bubbles: true,
        cancelable: true
      }));

      const factories = [
        () => look(1),
        () => look(-1),
        () => travel(1),
        () => travel(-1),
        () => pinch(1),
        () => pinch(-1),
        () => wheel(-140, false),
        () => wheel(-120, true)
      ];
      const labels = [
        'ONE_FINGER_LOOK_RIGHT',
        'ONE_FINGER_LOOK_LEFT',
        'TWO_FINGER_TRAVEL_FORWARD',
        'TWO_FINGER_TRAVEL_BACKWARD',
        'PINCH_ZOOM_IN',
        'PINCH_ZOOM_OUT',
        'WHEEL_TRAVEL_FORWARD',
        'WHEEL_ZOOM_IN'
      ];
      const actions = Array.from({ length: interactionGroupCount }, (_, index) => ({
        label: labels[index % labels.length],
        execute: factories[index % factories.length]
      }));
      const records = new Array(actions.length);
      let activeCallbacks = 0;
      let maximumConcurrentCallbacks = 0;
      let completedCallbacks = 0;
      const scheduleStartedAt = performance.now() + 250;

      await new Promise((resolve, reject) => {
        actions.forEach((action, index) => {
          const dueAt = scheduleStartedAt + index * cadenceMs;
          setTimeout(() => {
            const startedAt = performance.now();
            activeCallbacks += 1;
            maximumConcurrentCallbacks = Math.max(maximumConcurrentCallbacks, activeCallbacks);
            try {
              action.execute();
              const finishedAt = performance.now();
              records[index] = {
                index,
                label: action.label,
                dueAt,
                startedAt,
                finishedAt,
                deliveryLagMs: startedAt - dueAt,
                completionLagMs: finishedAt - dueAt,
                processingMs: finishedAt - startedAt
              };
            } catch (error) {
              reject(error);
              return;
            } finally {
              activeCallbacks -= 1;
            }
            completedCallbacks += 1;
            if (completedCallbacks === actions.length) resolve();
          }, Math.max(0, dueAt - performance.now()));
        });
      });

      const finalIntake = intake.getReceipt();
      const finalBinding = binding.getReceipt();
      const newFrames = finalBinding.frameRecords.slice(initialFrameCount);
      const hashes = newFrames.map((record) => record.colorSummary.byteHash);
      const resources = finalBinding.resources;
      const visual = window.visualViewport;
      const canvasRect = canvas.getBoundingClientRect();

      return {
        schedule: { cadenceMs, interactionGroupCount, scheduledDurationMs: (interactionGroupCount - 1) * cadenceMs },
        records,
        maximumConcurrentCallbacks,
        proposalDelta: finalIntake.counters.navigationProposalCount - initialProposalCount,
        acceptedProposalDelta: finalIntake.counters.acceptedNavigationProposalCount - initialAcceptedCount,
        visibleFrameDelta: finalBinding.counters.gpuFramebufferPresentationCount - initialBinding.counters.gpuFramebufferPresentationCount,
        distinctVisibleFrameHashCount: new Set(hashes).size,
        firstVisibleFrameHash: hashes[0] ?? null,
        finalVisibleFrameHash: hashes.at(-1) ?? null,
        inputClasses: [...new Set(newFrames.map((record) => record.inputClass).filter(Boolean))].sort(),
        initialIntake,
        finalIntake,
        initialBinding,
        finalBinding,
        viewportAudit: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          visualViewportWidth: visual?.width ?? null,
          visualViewportHeight: visual?.height ?? null,
          devicePixelRatio: window.devicePixelRatio,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          orientation: window.innerWidth >= window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT',
          canvasClientWidth: canvasRect.width,
          canvasClientHeight: canvasRect.height,
          inlineTransform: canvas.style.transform,
          computedTransform: getComputedStyle(canvas).transform,
          imageElementCount: document.querySelectorAll('img').length,
          visibleControllerPresent: document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null
        },
        persistentResourceAudit: {
          contextCreationCount: resources.counters.contextCreationCount,
          gpuBufferCreateCount: resources.counters.bufferCreateCount,
          gpuBufferUploadCount: resources.counters.bufferUploadCount,
          postInitializationResourceCreationCount: resources.counters.postInitializationResourceCreationCount,
          postInitializationBufferUploadCount: resources.counters.postInitializationBufferUploadCount,
          resourceIdentityStable: resources.resourceIdentityStable,
          packageUploadedOnce: resources.packageUploadedOnce
        }
      };
    }, { cadenceMs, interactionGroupCount });

    const delivery = execution.records.map((record) => record.deliveryLagMs);
    const completion = execution.records.map((record) => record.completionLagMs);
    const processing = execution.records.map((record) => record.processingMs);
    const timing = {
      maximumDeliveryLagMs: Math.max(...delivery),
      p95DeliveryLagMs: percentile(delivery, 0.95),
      maximumCompletionLagMs: Math.max(...completion),
      p95CompletionLagMs: percentile(completion, 0.95),
      maximumActionProcessingMs: Math.max(...processing),
      p95ActionProcessingMs: percentile(processing, 0.95),
      averageActionProcessingMs: processing.reduce((sum, value) => sum + value, 0) / processing.length
    };
    const rawSession = {
      sessionId: definition.sessionId,
      requestedViewport: { width: definition.width, height: definition.height },
      timing,
      execution,
      browserEvents
    };
    writeJson(`h-earth.run8e-r3d4.${definition.sessionId.toLowerCase()}.raw-session.json`, rawSession);

    const actual = execution.viewportAudit;
    assert(orientationOf(definition.width, definition.height) === definition.sessionId, `R3D4_${definition.sessionId}_REQUESTED_ORIENTATION_INVALID`);
    assert(Number.isFinite(actual.innerWidth) && Number.isFinite(actual.innerHeight) && actual.innerWidth > 0 && actual.innerHeight > 0, `R3D4_${definition.sessionId}_INNER_VIEWPORT_INVALID`);
    assert(actual.orientation === definition.sessionId, `R3D4_${definition.sessionId}_ORIENTATION_MISMATCH`);
    assert(orientationOf(actual.innerWidth, actual.innerHeight) === definition.sessionId, `R3D4_${definition.sessionId}_INNER_ASPECT_DIRECTION_INVALID`);
    assert(actual.visualViewportWidth === null || (actual.visualViewportWidth > 0 && actual.visualViewportHeight > 0), `R3D4_${definition.sessionId}_VISUAL_VIEWPORT_INVALID`);
    assert(actual.canvasClientWidth > 0 && actual.canvasClientHeight > 0, `R3D4_${definition.sessionId}_CANVAS_DIMENSIONS_INVALID`);
    assert(execution.records.length === interactionGroupCount, `R3D4_${definition.sessionId}_ACTION_COUNT_INVALID`);
    assert(execution.maximumConcurrentCallbacks === 1, `R3D4_${definition.sessionId}_CALLBACK_CONCURRENCY_INVALID`);
    assert(execution.proposalDelta >= 30, `R3D4_${definition.sessionId}_PROPOSAL_COUNT_INSUFFICIENT`);
    assert(execution.acceptedProposalDelta === execution.proposalDelta, `R3D4_${definition.sessionId}_PROPOSAL_REJECTION_OBSERVED`);
    assert(execution.visibleFrameDelta === execution.acceptedProposalDelta, `R3D4_${definition.sessionId}_VISIBLE_FRAME_CORRESPONDENCE_FAILED`);
    assert(execution.distinctVisibleFrameHashCount >= 8, `R3D4_${definition.sessionId}_FRAME_HASH_PROGRESSION_INSUFFICIENT`);
    assert(execution.inputClasses.length === 4, `R3D4_${definition.sessionId}_INPUT_CLASS_COVERAGE_INVALID`);
    assert(timing.maximumDeliveryLagMs < maximumDeliveryLagThresholdMs, `R3D4_${definition.sessionId}_MULTI_SECOND_DELIVERY_BACKLOG`);
    assert(timing.maximumCompletionLagMs < maximumCompletionLagThresholdMs, `R3D4_${definition.sessionId}_MULTI_SECOND_COMPLETION_BACKLOG`);
    assert(timing.maximumActionProcessingMs < maximumActionProcessingThresholdMs, `R3D4_${definition.sessionId}_ACTION_PROCESSING_TOO_SLOW`);
    assert(execution.finalBinding.counters.deferredRenderCommitCount === 0, `R3D4_${definition.sessionId}_DEFERRED_RENDER_COMMIT_CREATED`);
    assert(execution.finalBinding.counters.queuedFrameChainCount === 0, `R3D4_${definition.sessionId}_QUEUED_FRAME_CHAIN_CREATED`);
    assert(execution.finalIntake.counters.queuedNavigationChainCount === 0, `R3D4_${definition.sessionId}_QUEUED_NAVIGATION_CHAIN_CREATED`);
    assert(execution.finalIntake.counters.deferredCommitCount === 0, `R3D4_${definition.sessionId}_DEFERRED_NAVIGATION_COMMIT_CREATED`);
    assert(execution.persistentResourceAudit.contextCreationCount === 1, `R3D4_${definition.sessionId}_CONTEXT_COUNT_INVALID`);
    assert(execution.persistentResourceAudit.gpuBufferCreateCount === 9, `R3D4_${definition.sessionId}_BUFFER_CREATE_COUNT_INVALID`);
    assert(execution.persistentResourceAudit.gpuBufferUploadCount === 9, `R3D4_${definition.sessionId}_BUFFER_UPLOAD_COUNT_INVALID`);
    assert(execution.persistentResourceAudit.postInitializationResourceCreationCount === 0, `R3D4_${definition.sessionId}_RESOURCE_RECREATION_OBSERVED`);
    assert(execution.persistentResourceAudit.postInitializationBufferUploadCount === 0, `R3D4_${definition.sessionId}_BUFFER_REUPLOAD_OBSERVED`);
    assert(execution.persistentResourceAudit.resourceIdentityStable === true && execution.persistentResourceAudit.packageUploadedOnce === true, `R3D4_${definition.sessionId}_RESOURCE_PERSISTENCE_FAILED`);
    assert(execution.finalBinding.counters.worldRebuildCount === 0, `R3D4_${definition.sessionId}_WORLD_REBUILD_OBSERVED`);
    assert(execution.finalBinding.counters.bitmapPreviewApplicationCount === 0 && execution.finalBinding.counters.cssTransformPreviewCount === 0, `R3D4_${definition.sessionId}_BITMAP_PREVIEW_OBSERVED`);
    assert(actual.inlineTransform === '' && actual.computedTransform === 'none', `R3D4_${definition.sessionId}_CANVAS_TRANSFORM_OBSERVED`);
    assert(actual.imageElementCount === 0, `R3D4_${definition.sessionId}_DOM_IMAGE_PRESENTATION_OBSERVED`);
    assert(actual.visibleControllerPresent === false, `R3D4_${definition.sessionId}_VISIBLE_CONTROLLER_OBSERVED`);
    assert(browserEvents.consoleErrors.length === 0, `R3D4_${definition.sessionId}_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
    assert(browserEvents.pageErrors.length === 0, `R3D4_${definition.sessionId}_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
    assert(browserEvents.requestFailures.length === 0, `R3D4_${definition.sessionId}_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);

    const pagePath = path.join(outputDirectory, `h-earth.run8e-r3d4.${definition.sessionId.toLowerCase()}.page.png`);
    const canvasPath = path.join(outputDirectory, `h-earth.run8e-r3d4.${definition.sessionId.toLowerCase()}.canvas.png`);
    await page.screenshot({ path: pagePath, fullPage: true });
    await page.locator('#r3d-canvas').screenshot({ path: canvasPath });
    const pageBytes = fs.readFileSync(pagePath);
    const canvasBytes = fs.readFileSync(canvasPath);

    completedSessions.push({
      sessionId: definition.sessionId,
      requestedViewport: { width: definition.width, height: definition.height },
      actualViewport: execution.viewportAudit,
      eligible: true,
      status: `RUN_8E_R3D4_${definition.sessionId}_SESSION_PASS`,
      timing,
      execution,
      browserEvents,
      screenshots: {
        page: { filename: path.basename(pagePath), byteLength: pageBytes.length, sha256: sha256(pageBytes) },
        canvas: { filename: path.basename(canvasPath), byteLength: canvasBytes.length, sha256: sha256(canvasBytes) }
      }
    });
    await context.close();
  }

  const aggregate = {
    browserSessionCount: completedSessions.length,
    orientationCount: new Set(completedSessions.map((session) => session.sessionId)).size,
    scheduledInteractionGroupCount: completedSessions.reduce((sum, session) => sum + session.execution.records.length, 0),
    acceptedProposalCount: completedSessions.reduce((sum, session) => sum + session.execution.acceptedProposalDelta, 0),
    visibleGpuFrameCount: completedSessions.reduce((sum, session) => sum + session.execution.visibleFrameDelta, 0),
    maximumDeliveryLagMs: Math.max(...completedSessions.map((session) => session.timing.maximumDeliveryLagMs)),
    maximumCompletionLagMs: Math.max(...completedSessions.map((session) => session.timing.maximumCompletionLagMs)),
    maximumActionProcessingMs: Math.max(...completedSessions.map((session) => session.timing.maximumActionProcessingMs)),
    maximumConcurrentCallbacks: Math.max(...completedSessions.map((session) => session.execution.maximumConcurrentCallbacks)),
    worldRebuildCount: completedSessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.worldRebuildCount, 0),
    deferredRenderCommitCount: completedSessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.deferredRenderCommitCount, 0),
    queuedFrameChainCount: completedSessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.queuedFrameChainCount, 0),
    postInitializationResourceCreationCount: completedSessions.reduce((sum, session) => sum + session.execution.persistentResourceAudit.postInitializationResourceCreationCount, 0),
    postInitializationBufferUploadCount: completedSessions.reduce((sum, session) => sum + session.execution.persistentResourceAudit.postInitializationBufferUploadCount, 0),
    bitmapPreviewApplicationCount: completedSessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.bitmapPreviewApplicationCount, 0),
    cssTransformPreviewCount: completedSessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.cssTransformPreviewCount, 0)
  };
  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_RECEIPT',
    eligible: completedSessions.length === 2 && completedSessions.every((session) => session.eligible),
    status: 'RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    harnessVersion: 2,
    auditCorrection: 'REQUESTED_VIEWPORT_CUSTODY_PLUS_ACTUAL_ORIENTATION_AND_POSITIVE_VISUAL_VIEWPORT',
    thresholds: {
      interactionGroupCountPerSession: interactionGroupCount,
      cadenceMs,
      maximumDeliveryLagThresholdMs,
      maximumCompletionLagThresholdMs,
      maximumActionProcessingThresholdMs
    },
    sessions: completedSessions,
    aggregate,
    boundaries: {
      publicRouteMutated: false,
      publicRouteBound: false,
      publicDirectManipulationMutated: false,
      navigationAuthorityMutated: false,
      r3AFramePacketSourceMutated: false,
      persistentRendererSourceMutated: false,
      pointerTouchIntakeSourceMutated: false,
      liveGpuBindingSourceMutated: false,
      physicalDeviceAcceptancePerformed: false,
      deploymentPerformed: false,
      r3D5WorkStarted: false,
      run8EPassClosed: false
    },
    nextCheckpoint: 'RUN_8E_R3D5_NOT_STARTED',
    stoppingBoundary: 'STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5',
    issues: []
  };
  assert(receipt.eligible === true, 'R3D4_AGGREGATE_RECEIPT_NOT_ELIGIBLE');
  writeJson('h-earth.run8e-r3d4.interaction-browser-execution.receipt.json', receipt);
  console.log(JSON.stringify({
    status: receipt.status,
    aggregate,
    sessions: completedSessions.map((session) => ({
      sessionId: session.sessionId,
      requestedViewport: session.requestedViewport,
      actualViewport: session.actualViewport,
      timing: session.timing,
      acceptedProposalCount: session.execution.acceptedProposalDelta,
      visibleFrameCount: session.execution.visibleFrameDelta,
      distinctVisibleFrameHashCount: session.execution.distinctVisibleFrameHashCount,
      inputClasses: session.execution.inputClasses,
      canvasScreenshot: session.screenshots.canvas
    })),
    stoppingBoundary: receipt.stoppingBoundary
  }, null, 2));
} catch (error) {
  writeJson('h-earth.run8e-r3d4.current-attempt.failure.runtime.json', {
    receiptType: 'H_EARTH_RUN_8E_R3D4_CURRENT_ATTEMPT_RUNTIME_FAILURE',
    eligible: true,
    status: 'RUN_8E_R3D4_CURRENT_ATTEMPT_FAILED',
    errorName: error?.name ?? 'Error',
    errorMessage: error?.message ?? String(error),
    stack: error?.stack ?? null,
    completedSessionCount: completedSessions.length,
    completedSessions
  });
  throw error;
} finally {
  await browser?.close();
}
