import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D2Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3d2.pointer-touch-intake.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3D2_OUTPUT ?? '/tmp/h-earth-run8e-r3d2';
const targetUrl = process.env.H_EARTH_RUN8E_R3D2_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r3d/';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D2Control();
assert(parent.eligible === true, `R3D2_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D2_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

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
    window.__R3D2_GET_CONTEXT_CALLS = 0;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      window.__R3D2_GET_CONTEXT_CALLS += 1;
      return original.apply(this, args);
    };
  });
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  page.on('console', (message) => { if (message.type() === 'error') browserEvents.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
  page.on('requestfailed', (request) => browserEvents.requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText ?? 'FAILED' }));

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(() => document.documentElement.dataset.r3d2Ready === 'true', null, { timeout: 120000 });

  const initial = await page.evaluate(() => window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE.getReceipt());
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

  const final = await page.evaluate(() => window.H_EARTH_RUN8E_R3D2_POINTER_TOUCH_INTAKE.getReceipt());
  const pageAudit = await page.evaluate(() => {
    const canvas = document.getElementById('r3d-canvas');
    return {
      getContextCallCount: window.__R3D2_GET_CONTEXT_CALLS,
      inlineTransform: canvas.style.transform,
      computedTransform: getComputedStyle(canvas).transform,
      touchAction: getComputedStyle(canvas).touchAction,
      descriptor: window.H_EARTH_RUN8E_R3D2_DIAGNOSTIC_HOST_DESCRIPTOR,
      controllerElementPresent: document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null
    };
  });

  assert(final?.eligible === true, 'R3D2_BROWSER_RECEIPT_NOT_ELIGIBLE');
  assert(final.status === 'RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ACTIVE', 'R3D2_BROWSER_STATUS_INVALID');
  assert(final.counters.navigationProposalCount >= 5, 'R3D2_PROPOSAL_COUNT_INSUFFICIENT');
  assert(final.counters.acceptedNavigationProposalCount === final.counters.navigationProposalCount, 'R3D2_PROPOSAL_REJECTION_OBSERVED');
  assert(final.counters.oneFingerLookProposalCount >= 1, 'R3D2_ONE_FINGER_LOOK_MISSING');
  assert(final.counters.twoFingerTravelProposalCount >= 1, 'R3D2_TWO_FINGER_TRAVEL_MISSING');
  assert(final.counters.pinchProposalCount >= 1, 'R3D2_PINCH_MISSING');
  assert(final.counters.wheelProposalCount === 2, 'R3D2_WHEEL_PROPOSAL_COUNT_INVALID');
  assert(final.counters.touchPointerEventCount >= 8, 'R3D2_TOUCH_POINTER_EVIDENCE_INSUFFICIENT');
  assert(final.counters.maximumActivePointerCount === 2, 'R3D2_TWO_POINTER_STATE_NOT_ESTABLISHED');
  assert(final.counters.deferredCommitCount === 0, 'R3D2_DEFERRED_COMMIT_CREATED');
  assert(final.counters.queuedNavigationChainCount === 0, 'R3D2_NAVIGATION_QUEUE_CREATED');
  assert(final.currentNavigationState.sequence > initial.currentNavigationState.sequence, 'R3D2_NAVIGATION_SEQUENCE_DID_NOT_ADVANCE');
  assert(final.currentNavigationState.yawDegrees !== initial.currentNavigationState.yawDegrees, 'R3D2_LOOK_STATE_DID_NOT_CHANGE');
  assert(final.currentNavigationState.verticalFovDegrees !== initial.currentNavigationState.verticalFovDegrees, 'R3D2_ZOOM_STATE_DID_NOT_CHANGE');
  assert(final.currentNavigationState.position.x !== initial.currentNavigationState.position.x || final.currentNavigationState.position.z !== initial.currentNavigationState.position.z, 'R3D2_TRAVEL_STATE_DID_NOT_CHANGE');
  assert(Object.values(final.boundaries).every((value) => value === false), 'R3D2_BOUNDARY_VIOLATION');
  assert(pageAudit.getContextCallCount === 0, 'R3D2_WEBGL_OR_CANVAS_CONTEXT_CREATED');
  assert(pageAudit.inlineTransform === '', 'R3D2_INLINE_BITMAP_TRANSFORM_CREATED');
  assert(pageAudit.computedTransform === 'none', 'R3D2_COMPUTED_BITMAP_TRANSFORM_CREATED');
  assert(pageAudit.touchAction === 'none', 'R3D2_TOUCH_ACTION_NOT_LOCKED');
  assert(pageAudit.controllerElementPresent === false, 'R3D2_VISIBLE_CONTROLLER_CREATED');
  assert(pageAudit.descriptor?.execution?.liveGpuCameraBindingCreated === false, 'R3D2_LIVE_GPU_BINDING_CREATED');
  assert(browserEvents.consoleErrors.length === 0, `R3D2_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
  assert(browserEvents.pageErrors.length === 0, `R3D2_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0, `R3D2_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);

  const screenshotPath = path.join(outputDirectory, 'h-earth.run8e-r3d2.input-intake-page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const screenshotBytes = fs.readFileSync(screenshotPath);

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3D2_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    initialReceipt: initial,
    finalReceipt: final,
    pageAudit,
    browserEvents,
    screenshot: {
      filename: path.basename(screenshotPath),
      byteLength: screenshotBytes.length,
      sha256: sha256(screenshotBytes)
    },
    correspondence: {
      existingNavigationProposalAuthorityConsumed: final.semantics.existingNavigationProposalAuthorityConsumed,
      touchConsumedThroughPointerEvents: final.semantics.touchConsumedThroughPointerEvents,
      proposalIntakeImmediate: final.semantics.immediateProposalIntake,
      navigationAuthorityMutated: final.boundaries.navigationAuthorityMutated,
      webGLContextCreated: final.boundaries.webGLContextCreated,
      liveGpuCameraBindingCreated: final.boundaries.liveGpuCameraBindingCreated,
      bitmapPreviewExecuted: final.boundaries.bitmapPreviewExecuted
    },
    stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3',
    issues: []
  };
  writeJson('h-earth.run8e-r3d2.pointer-touch-intake.execution.receipt.json', executionReceipt);
  console.log(JSON.stringify({
    status: executionReceipt.status,
    proposalCount: final.counters.navigationProposalCount,
    counters: final.counters,
    initialState: initial.currentNavigationState,
    finalState: final.currentNavigationState,
    pageAudit,
    stoppingBoundary: executionReceipt.stoppingBoundary
  }, null, 2));
} finally {
  await browser?.close();
}
