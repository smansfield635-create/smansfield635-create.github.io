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

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D4Control();
assert(parent.eligible === true, `R3D4_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D4_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

const sessionDefinitions = [
  { sessionId: 'PORTRAIT', width: 390, height: 844 },
  { sessionId: 'LANDSCAPE', width: 844, height: 390 }
];

let browser = null;
const browserEvents = [];
try {
  browser = await chromium.launch({ headless: true });
  const sessions = [];

  for (const definition of sessionDefinitions) {
    const context = await browser.newContext({
      viewport: { width: definition.width, height: definition.height },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();
    page.setDefaultTimeout(120000);
    const events = { consoleErrors: [], pageErrors: [], requestFailures: [] };
    page.on('console', (message) => { if (message.type() === 'error') events.consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => events.pageErrors.push(error.message));
    page.on('requestfailed', (request) => events.requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText ?? 'FAILED' }));

    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForFunction(() => document.documentElement.dataset.r3d3Ready === 'true', null, { timeout: 120000 });

    const result = await page.evaluate(async ({ cadenceMs, interactionGroupCount }) => {
      const canvas = document.getElementById('r3d-canvas');
      const intake = window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE;
      const binding = window.H_EARTH_RUN8E_R3D3_LIVE_GPU_BINDING;
      if (!(canvas instanceof HTMLCanvasElement) || !intake || !binding) throw new Error('R3D4_DIAGNOSTIC_RUNTIME_MISSING');

      const initialIntake = intake.getReceipt();
      const initialBinding = binding.getReceipt();
      const initialFrameCount = initialBinding.frameRecords.length;
      const initialProposalCount = initialIntake.counters.navigationProposalCount;
      const initialAcceptedCount = initialIntake.counters.acceptedNavigationProposalCount;
      const rect = canvas.getBoundingClientRect();
      const point = (x, y) => ({ x: rect.left + rect.width * x, y: rect.top + rect.height * y });
      const dispatchPointer = (type, pointerId, x, y, buttons = 1) => {
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
      };
      const look = (direction) => {
        const start = point(direction > 0 ? 0.30 : 0.70, 0.35);
        const end = point(direction > 0 ? 0.68 : 0.32, 0.35);
        dispatchPointer('pointerdown', 1, start.x, start.y, 1);
        dispatchPointer('pointermove', 1, end.x, end.y, 1);
        dispatchPointer('pointerup', 1, end.x, end.y, 0);
      };
      const travel = (direction) => {
        const startY = direction > 0 ? 0.70 : 0.42;
        const endY = direction > 0 ? 0.42 : 0.70;
        const leftStart = point(0.30, startY);
        const rightStart = point(0.70, startY);
        const leftEnd = point(0.30, endY);
        const rightEnd = point(0.70, endY);
        dispatchPointer('pointerdown', 1, leftStart.x, leftStart.y, 1);
        dispatchPointer('pointerdown', 2, rightStart.x, rightStart.y, 1);
        dispatchPointer('pointermove', 1, leftEnd.x, leftEnd.y, 1);
        dispatchPointer('pointermove', 2, rightEnd.x, rightEnd.y, 1);
        dispatchPointer('pointerup', 1, leftEnd.x, leftEnd.y, 0);
        dispatchPointer('pointerup', 2, rightEnd.x, rightEnd.y, 0);
      };
      const pinch = (direction) => {
        const nearLeft = point(0.42, 0.62);
        const nearRight = point(0.58, 0.62);
        const farLeft = point(0.22, 0.62);
        const farRight = point(0.78, 0.62);
        const leftStart = direction > 0 ? nearLeft : farLeft;
        const rightStart = direction > 0 ? nearRight : farRight;
        const leftEnd = direction > 0 ? farLeft : nearLeft;
        const rightEnd = direction > 0 ? farRight : nearRight;
        dispatchPointer('pointerdown', 1, leftStart.x, leftStart.y, 1);
        dispatchPointer('pointerdown', 2, rightStart.x, rightStart.y, 1);
        dispatchPointer('pointermove', 1, leftEnd.x, leftEnd.y, 1);
        dispatchPointer('pointermove', 2, rightEnd.x, rightEnd.y, 1);
        dispatchPointer('pointerup', 1, leftEnd.x, leftEnd.y, 0);
        dispatchPointer('pointerup', 2, rightEnd.x, rightEnd.y, 0);
      };
      const wheel = (deltaY, ctrlKey) => {
        canvas.dispatchEvent(new WheelEvent('wheel', { deltaY, ctrlKey, bubbles: true, cancelable: true }));
      };

      const actionFactories = [
        () => look(1),
        () => look(-1),
        () => travel(1),
        () => travel(-1),
        () => pinch(1),
        () => pinch(-1),
        () => wheel(-140, false),
        () => wheel(-120, true)
      ];
      const actionLabels = [
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
        label: actionLabels[index % actionLabels.length],
        execute: actionFactories[index % actionFactories.length]
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
      const acceptedProposalDelta = finalIntake.counters.acceptedNavigationProposalCount - initialAcceptedCount;
      const proposalDelta = finalIntake.counters.navigationProposalCount - initialProposalCount;
      const visibleFrameDelta = finalBinding.counters.gpuFramebufferPresentationCount - initialBinding.counters.gpuFramebufferPresentationCount;
      const hashes = newFrames.map((record) => record.colorSummary.byteHash);
      const finalResources = finalBinding.resources;
      const audit = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        orientation: window.innerWidth >= window.innerHeight ? 'LANDSCAPE' : 'PORTRAIT',
        canvasClientWidth: canvas.getBoundingClientRect().width,
        canvasClientHeight: canvas.getBoundingClientRect().height,
        inlineTransform: canvas.style.transform,
        computedTransform: getComputedStyle(canvas).transform,
        imageElementCount: document.querySelectorAll('img').length,
        visibleControllerPresent: document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null
      };
      return {
        schedule: { cadenceMs, interactionGroupCount, scheduledDurationMs: (interactionGroupCount - 1) * cadenceMs },
        records,
        maximumConcurrentCallbacks,
        proposalDelta,
        acceptedProposalDelta,
        visibleFrameDelta,
        distinctVisibleFrameHashCount: new Set(hashes).size,
        firstVisibleFrameHash: hashes[0] ?? null,
        finalVisibleFrameHash: hashes.at(-1) ?? null,
        inputClasses: [...new Set(newFrames.map((record) => record.inputClass).filter(Boolean))].sort(),
        initialIntake,
        finalIntake,
        initialBinding,
        finalBinding,
        audit,
        persistentResourceAudit: {
          contextCreationCount: finalResources.counters.contextCreationCount,
          gpuBufferCreateCount: finalResources.counters.bufferCreateCount,
          gpuBufferUploadCount: finalResources.counters.bufferUploadCount,
          postInitializationResourceCreationCount: finalResources.counters.postInitializationResourceCreationCount,
          postInitializationBufferUploadCount: finalResources.counters.postInitializationBufferUploadCount,
          resourceIdentityStable: finalResources.resourceIdentityStable,
          packageUploadedOnce: finalResources.packageUploadedOnce
        }
      };
    }, { cadenceMs, interactionGroupCount });

    const deliveryLags = result.records.map((record) => record.deliveryLagMs);
    const completionLags = result.records.map((record) => record.completionLagMs);
    const processingTimes = result.records.map((record) => record.processingMs);
    const timing = {
      maximumDeliveryLagMs: Math.max(...deliveryLags),
      p95DeliveryLagMs: percentile(deliveryLags, 0.95),
      maximumCompletionLagMs: Math.max(...completionLags),
      p95CompletionLagMs: percentile(completionLags, 0.95),
      maximumActionProcessingMs: Math.max(...processingTimes),
      p95ActionProcessingMs: percentile(processingTimes, 0.95),
      averageActionProcessingMs: processingTimes.reduce((sum, value) => sum + value, 0) / processingTimes.length
    };

    assert(result.audit.innerWidth === definition.width && result.audit.innerHeight === definition.height, `R3D4_${definition.sessionId}_VIEWPORT_MISMATCH`);
    assert(result.audit.orientation === definition.sessionId, `R3D4_${definition.sessionId}_ORIENTATION_MISMATCH`);
    assert(result.records.length === interactionGroupCount, `R3D4_${definition.sessionId}_ACTION_COUNT_INVALID`);
    assert(result.maximumConcurrentCallbacks === 1, `R3D4_${definition.sessionId}_CALLBACK_CONCURRENCY_INVALID`);
    assert(result.proposalDelta >= 30, `R3D4_${definition.sessionId}_PROPOSAL_COUNT_INSUFFICIENT`);
    assert(result.acceptedProposalDelta === result.proposalDelta, `R3D4_${definition.sessionId}_PROPOSAL_REJECTION_OBSERVED`);
    assert(result.visibleFrameDelta === result.acceptedProposalDelta, `R3D4_${definition.sessionId}_VISIBLE_FRAME_CORRESPONDENCE_FAILED`);
    assert(result.distinctVisibleFrameHashCount >= 8, `R3D4_${definition.sessionId}_FRAME_HASH_PROGRESSION_INSUFFICIENT`);
    assert(result.inputClasses.length === 4, `R3D4_${definition.sessionId}_INPUT_CLASS_COVERAGE_INVALID`);
    assert(timing.maximumDeliveryLagMs < maximumDeliveryLagThresholdMs, `R3D4_${definition.sessionId}_MULTI_SECOND_DELIVERY_BACKLOG`);
    assert(timing.maximumCompletionLagMs < maximumCompletionLagThresholdMs, `R3D4_${definition.sessionId}_MULTI_SECOND_COMPLETION_BACKLOG`);
    assert(timing.maximumActionProcessingMs < maximumActionProcessingThresholdMs, `R3D4_${definition.sessionId}_ACTION_PROCESSING_TOO_SLOW`);
    assert(result.finalBinding.counters.deferredRenderCommitCount === 0, `R3D4_${definition.sessionId}_DEFERRED_RENDER_COMMIT_CREATED`);
    assert(result.finalBinding.counters.queuedFrameChainCount === 0, `R3D4_${definition.sessionId}_QUEUED_FRAME_CHAIN_CREATED`);
    assert(result.finalIntake.counters.queuedNavigationChainCount === 0, `R3D4_${definition.sessionId}_QUEUED_NAVIGATION_CHAIN_CREATED`);
    assert(result.finalIntake.counters.deferredCommitCount === 0, `R3D4_${definition.sessionId}_DEFERRED_NAVIGATION_COMMIT_CREATED`);
    assert(result.persistentResourceAudit.contextCreationCount === 1, `R3D4_${definition.sessionId}_CONTEXT_COUNT_INVALID`);
    assert(result.persistentResourceAudit.gpuBufferCreateCount === 9, `R3D4_${definition.sessionId}_BUFFER_CREATE_COUNT_INVALID`);
    assert(result.persistentResourceAudit.gpuBufferUploadCount === 9, `R3D4_${definition.sessionId}_BUFFER_UPLOAD_COUNT_INVALID`);
    assert(result.persistentResourceAudit.postInitializationResourceCreationCount === 0, `R3D4_${definition.sessionId}_RESOURCE_RECREATION_OBSERVED`);
    assert(result.persistentResourceAudit.postInitializationBufferUploadCount === 0, `R3D4_${definition.sessionId}_BUFFER_REUPLOAD_OBSERVED`);
    assert(result.persistentResourceAudit.resourceIdentityStable === true && result.persistentResourceAudit.packageUploadedOnce === true, `R3D4_${definition.sessionId}_RESOURCE_PERSISTENCE_FAILED`);
    assert(result.finalBinding.counters.worldRebuildCount === 0, `R3D4_${definition.sessionId}_WORLD_REBUILD_OBSERVED`);
    assert(result.finalBinding.counters.bitmapPreviewApplicationCount === 0 && result.finalBinding.counters.cssTransformPreviewCount === 0, `R3D4_${definition.sessionId}_BITMAP_PREVIEW_OBSERVED`);
    assert(result.audit.inlineTransform === '' && result.audit.computedTransform === 'none', `R3D4_${definition.sessionId}_CANVAS_TRANSFORM_OBSERVED`);
    assert(result.audit.imageElementCount === 0, `R3D4_${definition.sessionId}_DOM_IMAGE_PRESENTATION_OBSERVED`);
    assert(result.audit.visibleControllerPresent === false, `R3D4_${definition.sessionId}_VISIBLE_CONTROLLER_OBSERVED`);
    assert(events.consoleErrors.length === 0, `R3D4_${definition.sessionId}_CONSOLE_ERRORS:${events.consoleErrors.join('|')}`);
    assert(events.pageErrors.length === 0, `R3D4_${definition.sessionId}_PAGE_ERRORS:${events.pageErrors.join('|')}`);
    assert(events.requestFailures.length === 0, `R3D4_${definition.sessionId}_REQUEST_FAILURES:${JSON.stringify(events.requestFailures)}`);

    const pageScreenshotPath = path.join(outputDirectory, `h-earth.run8e-r3d4.${definition.sessionId.toLowerCase()}.page.png`);
    const canvasScreenshotPath = path.join(outputDirectory, `h-earth.run8e-r3d4.${definition.sessionId.toLowerCase()}.canvas.png`);
    await page.screenshot({ path: pageScreenshotPath, fullPage: true });
    await page.locator('#r3d-canvas').screenshot({ path: canvasScreenshotPath });
    const pageBytes = fs.readFileSync(pageScreenshotPath);
    const canvasBytes = fs.readFileSync(canvasScreenshotPath);

    sessions.push({
      sessionId: definition.sessionId,
      viewport: { width: definition.width, height: definition.height },
      eligible: true,
      status: `RUN_8E_R3D4_${definition.sessionId}_SESSION_PASS`,
      timing,
      execution: result,
      browserEvents: events,
      screenshots: {
        page: { filename: path.basename(pageScreenshotPath), byteLength: pageBytes.length, sha256: sha256(pageBytes) },
        canvas: { filename: path.basename(canvasScreenshotPath), byteLength: canvasBytes.length, sha256: sha256(canvasBytes) }
      }
    });
    browserEvents.push({ sessionId: definition.sessionId, ...events });
    await context.close();
  }

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_RECEIPT',
    eligible: sessions.length === 2 && sessions.every((session) => session.eligible),
    status: 'RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    thresholds: {
      interactionGroupCountPerSession: interactionGroupCount,
      cadenceMs,
      maximumDeliveryLagThresholdMs,
      maximumCompletionLagThresholdMs,
      maximumActionProcessingThresholdMs
    },
    sessions,
    aggregate: {
      browserSessionCount: sessions.length,
      orientationCount: new Set(sessions.map((session) => session.sessionId)).size,
      scheduledInteractionGroupCount: sessions.reduce((sum, session) => sum + session.execution.records.length, 0),
      acceptedProposalCount: sessions.reduce((sum, session) => sum + session.execution.acceptedProposalDelta, 0),
      visibleGpuFrameCount: sessions.reduce((sum, session) => sum + session.execution.visibleFrameDelta, 0),
      maximumDeliveryLagMs: Math.max(...sessions.map((session) => session.timing.maximumDeliveryLagMs)),
      maximumCompletionLagMs: Math.max(...sessions.map((session) => session.timing.maximumCompletionLagMs)),
      maximumActionProcessingMs: Math.max(...sessions.map((session) => session.timing.maximumActionProcessingMs)),
      maximumConcurrentCallbacks: Math.max(...sessions.map((session) => session.execution.maximumConcurrentCallbacks)),
      worldRebuildCount: sessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.worldRebuildCount, 0),
      deferredRenderCommitCount: sessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.deferredRenderCommitCount, 0),
      queuedFrameChainCount: sessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.queuedFrameChainCount, 0),
      postInitializationResourceCreationCount: sessions.reduce((sum, session) => sum + session.execution.persistentResourceAudit.postInitializationResourceCreationCount, 0),
      postInitializationBufferUploadCount: sessions.reduce((sum, session) => sum + session.execution.persistentResourceAudit.postInitializationBufferUploadCount, 0),
      bitmapPreviewApplicationCount: sessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.bitmapPreviewApplicationCount, 0),
      cssTransformPreviewCount: sessions.reduce((sum, session) => sum + session.execution.finalBinding.counters.cssTransformPreviewCount, 0)
    },
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
    aggregate: receipt.aggregate,
    sessions: sessions.map((session) => ({
      sessionId: session.sessionId,
      timing: session.timing,
      acceptedProposalCount: session.execution.acceptedProposalDelta,
      visibleFrameCount: session.execution.visibleFrameDelta,
      distinctVisibleFrameHashCount: session.execution.distinctVisibleFrameHashCount,
      inputClasses: session.execution.inputClasses,
      canvasScreenshot: session.screenshots.canvas
    })),
    stoppingBoundary: receipt.stoppingBoundary
  }, null, 2));
} finally {
  await browser?.close();
}
