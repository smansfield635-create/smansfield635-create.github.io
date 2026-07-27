import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3e3.public-runtime-authority-exclusivity.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3E3_OUTPUT ?? '/tmp/h-earth-run8e-r3e3';
const targetUrl = process.env.H_EARTH_RUN8E_R3E3_URL ?? 'http://127.0.0.1:4173/showroom/globe/h-earth/';
fs.mkdirSync(outputDirectory, { recursive: true });

const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const legacyPaths = [
  '/showroom/globe/h-earth/functional-landscape/index.js',
  '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
  '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js'
];
const orchestratorPath = '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js';
const expectedListenerTypes = ['lostpointercapture', 'pointercancel', 'pointerdown', 'pointermove', 'pointerup', 'wheel'];

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3E3Control();
assert(parent.eligible === true, `R3E3_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3E3_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

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
    const relevantStack = () => {
      const stack = String(new Error().stack ?? '');
      return { stack, relevant: stack.includes('/showroom/globe/h-earth/') };
    };
    const targetLabel = (target) => {
      if (target === window) return 'window';
      if (target === document) return 'document';
      if (target instanceof Element) return target.id ? `${target.tagName.toLowerCase()}#${target.id}` : target.tagName.toLowerCase();
      return Object.prototype.toString.call(target);
    };
    const audit = {
      contextCalls: [],
      eventListeners: [],
      timeouts: [],
      intervals: [],
      animationFrames: [],
      microtasks: []
    };
    Object.defineProperty(window, '__R3E3_RUNTIME_AUDIT', { value: audit, configurable: false, writable: false });

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const result = originalGetContext.call(this, type, ...args);
      if (this.id === 'h-earth-functional-landscape-canvas') {
        audit.contextCalls.push({ target: targetLabel(this), type: String(type), created: Boolean(result) });
      }
      return result;
    };

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const target = targetLabel(this);
      const { stack, relevant } = relevantStack();
      if (relevant || target.includes('h-earth-functional-landscape')) {
        audit.eventListeners.push({ target, type: String(type), relevant, stack });
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = function (callback, delay, ...args) {
      const { stack, relevant } = relevantStack();
      if (relevant) audit.timeouts.push({ delay: Number(delay) || 0, stack });
      return originalSetTimeout(callback, delay, ...args);
    };

    const originalSetInterval = window.setInterval.bind(window);
    window.setInterval = function (callback, delay, ...args) {
      const { stack, relevant } = relevantStack();
      if (relevant) audit.intervals.push({ delay: Number(delay) || 0, stack });
      return originalSetInterval(callback, delay, ...args);
    };

    const originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = function (callback) {
      const { stack, relevant } = relevantStack();
      if (relevant) audit.animationFrames.push({ stack });
      return originalRequestAnimationFrame(callback);
    };

    const originalQueueMicrotask = window.queueMicrotask.bind(window);
    window.queueMicrotask = function (callback) {
      const { stack, relevant } = relevantStack();
      if (relevant) audit.microtasks.push({ stack });
      return originalQueueMicrotask(callback);
    };
  });

  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  page.on('console', (message) => { if (message.type() === 'error') browserEvents.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => browserEvents.pageErrors.push(error.message));
  page.on('requestfailed', (request) => browserEvents.requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText ?? 'FAILED' }));

  let scriptRequests = [];
  page.on('request', (request) => {
    if (request.resourceType() !== 'script') return;
    try { scriptRequests.push(new URL(request.url()).pathname); } catch { }
  });

  const auditDocument = async ({ label, navigation }) => {
    scriptRequests = [];
    if (navigation === 'goto') await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
    else await page.reload({ waitUntil: 'networkidle', timeout: 120000 });

    await page.waitForFunction(() =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true',
    null, { timeout: 120000 });

    const initial = await page.evaluate(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt());
    const initialCanvasPath = path.join(outputDirectory, `h-earth.run8e-r3e3.${label}.initial-canvas.png`);
    await page.locator('#h-earth-functional-landscape-canvas').screenshot({ path: initialCanvasPath });

    await page.evaluate((pointerId) => {
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      const bounds = canvas.getBoundingClientRect();
      const y = bounds.top + bounds.height * 0.55;
      const startX = bounds.left + bounds.width * 0.32;
      const endX = Math.min(bounds.right - 8, startX + Math.max(72, bounds.width * 0.18));
      const fire = (type, x, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
        pointerId,
        pointerType: 'touch',
        isPrimary: true,
        clientX: x,
        clientY: y,
        buttons,
        bubbles: true,
        cancelable: true
      }));
      fire('pointerdown', startX, 1);
      fire('pointermove', endX, 1);
      fire('pointerup', endX, 0);
    }, label === 'initial-load' ? 301 : 302);

    await page.waitForFunction(() => {
      const receipt = window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getReceipt?.();
      return receipt?.intake?.counters?.navigationProposalCount === 1 &&
        receipt?.liveGpu?.counters?.gpuFramebufferPresentationCount === 2;
    }, null, { timeout: 120000 });

    const final = await page.evaluate(() => {
      const receipt = window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt();
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      const mount = document.getElementById('h-earth-functional-landscape-mount');
      const root = document.getElementById('h-earth-functional-landscape-route');
      const audit = window.__R3E3_RUNTIME_AUDIT;
      const resourceScripts = performance.getEntriesByType('resource')
        .filter((entry) => entry.initiatorType === 'script')
        .map((entry) => new URL(entry.name, document.baseURI).pathname);
      return {
        receipt,
        runtimeAudit: audit,
        documentAudit: {
          scriptTags: [...document.querySelectorAll('script[type="module"][src]')].map((script) => new URL(script.src, document.baseURI).pathname),
          resourceScripts,
          canvasInlineTransform: canvas.style.transform,
          canvasComputedTransform: getComputedStyle(canvas).transform,
          canvasInlineTranslate: canvas.style.translate,
          canvasComputedTranslate: getComputedStyle(canvas).translate,
          canvasTouchAction: getComputedStyle(canvas).touchAction,
          canvasDimensions: { width: canvas.width, height: canvas.height, clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight },
          mountPresent: mount instanceof HTMLElement,
          rootPresent: root instanceof HTMLElement,
          publicApiCount: [window.H_EARTH_RUN8E_PUBLIC_ROUTE, window.H_EARTH_RUN8E_R3E2_PUBLIC_INTEGRATION].filter(Boolean).length,
          legacyKnownGlobalCount: [
            window.H_EARTH_FUNCTIONAL_LANDSCAPE,
            window.H_EARTH_FUNCTIONAL_LANDSCAPE_ENVIRONMENT_INTEGRATION,
            window.H_EARTH_FUNCTIONAL_LANDSCAPE_DIRECT_MANIPULATION
          ].filter(Boolean).length
        }
      };
    });

    const finalCanvasPath = path.join(outputDirectory, `h-earth.run8e-r3e3.${label}.final-canvas.png`);
    const pagePath = path.join(outputDirectory, `h-earth.run8e-r3e3.${label}.page.png`);
    await page.locator('#h-earth-functional-landscape-canvas').screenshot({ path: finalCanvasPath });
    await page.screenshot({ path: pagePath, fullPage: true });

    const canvasListeners = final.runtimeAudit.eventListeners.filter((entry) => entry.target === 'canvas#h-earth-functional-landscape-canvas');
    const listenerTypes = canvasListeners.map((entry) => entry.type).sort();
    const contextTypes = final.runtimeAudit.contextCalls.filter((entry) => entry.created).map((entry) => entry.type);
    const legacyRequestCount = scriptRequests.filter((source) => legacyPaths.includes(source)).length;
    const orchestratorRequestCount = scriptRequests.filter((source) => source === orchestratorPath).length;
    const frameRecords = final.receipt.liveGpu.frameRecords;
    const firstFrame = frameRecords[0];
    const lastFrame = frameRecords.at(-1);

    const session = {
      label,
      requestedViewport: { width: 390, height: 844 },
      requestedScripts: [...scriptRequests],
      initialReceipt: initial,
      finalReceipt: final.receipt,
      runtimeAudit: final.runtimeAudit,
      documentAudit: final.documentAudit,
      derived: {
        canvasInputListenerCount: canvasListeners.length,
        canvasInputListenerTypes: listenerTypes,
        createdContextTypes: contextTypes,
        webGL2ContextCount: contextTypes.filter((type) => type === 'webgl2').length,
        canvas2DContextCount: contextTypes.filter((type) => type === '2d').length,
        orchestratorRequestCount,
        legacyRequestCount,
        acceptedProposalCount: final.receipt.intake.counters.acceptedNavigationProposalCount,
        visibleGpuFrameCount: final.receipt.liveGpu.counters.gpuFramebufferPresentationCount,
        distinctVisibleFrameHashCount: final.receipt.liveGpu.distinctFrameHashCount,
        firstFrameHash: firstFrame.colorSummary.byteHash,
        finalFrameHash: lastFrame.colorSummary.byteHash,
        frameHashChanged: firstFrame.colorSummary.byteHash !== lastFrame.colorSummary.byteHash,
        initialNavigationSequence: firstFrame.navigationSequence,
        finalNavigationSequence: lastFrame.navigationSequence,
        appOwnedTimeoutCount: final.runtimeAudit.timeouts.length,
        appOwnedIntervalCount: final.runtimeAudit.intervals.length,
        appOwnedAnimationFrameCount: final.runtimeAudit.animationFrames.length,
        appOwnedMicrotaskCount: final.runtimeAudit.microtasks.length
      },
      screenshots: {
        initialCanvas: { filename: path.basename(initialCanvasPath), sha256: sha256(fs.readFileSync(initialCanvasPath)) },
        finalCanvas: { filename: path.basename(finalCanvasPath), sha256: sha256(fs.readFileSync(finalCanvasPath)) },
        page: { filename: path.basename(pagePath), sha256: sha256(fs.readFileSync(pagePath)) }
      }
    };
    writeJson(`h-earth.run8e-r3e3.${label}.raw-session.json`, session);
    return session;
  };

  const sessions = [
    await auditDocument({ label: 'initial-load', navigation: 'goto' }),
    await auditDocument({ label: 'reload', navigation: 'reload' })
  ];

  for (const session of sessions) {
    const receipt = session.finalReceipt;
    const liveGpu = receipt.liveGpu;
    const resources = liveGpu.resources;
    const runtime = receipt.runtimeExclusivity;
    assert(receipt?.eligible === true && receipt.status === 'RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_ACTIVE', `R3E3_${session.label}_PUBLIC_RECEIPT_INVALID`);
    assert(session.documentAudit.scriptTags.length === 1 && session.documentAudit.scriptTags[0] === orchestratorPath, `R3E3_${session.label}_PUBLIC_MODULE_LOAD_GRAPH_INVALID`);
    assert(session.derived.orchestratorRequestCount === 1, `R3E3_${session.label}_ORCHESTRATOR_REQUEST_COUNT_INVALID`);
    assert(session.derived.legacyRequestCount === 0, `R3E3_${session.label}_LEGACY_MODULE_REQUEST_OBSERVED`);
    assert(session.documentAudit.resourceScripts.every((source) => !legacyPaths.includes(source)), `R3E3_${session.label}_LEGACY_RESOURCE_ENTRY_OBSERVED`);
    assert(session.derived.webGL2ContextCount === 1, `R3E3_${session.label}_WEBGL2_CONTEXT_COUNT_INVALID`);
    assert(session.derived.canvas2DContextCount === 0, `R3E3_${session.label}_CANVAS_2D_CONTEXT_OBSERVED`);
    assert(resources.counters.contextCreationCount === 1, `R3E3_${session.label}_RENDERER_CONTEXT_COUNT_INVALID`);
    assert(liveGpu.counters.rendererInitializationCount === 1, `R3E3_${session.label}_RENDERER_INITIALIZATION_COUNT_INVALID`);
    assert(runtime.activeNavigationStateStreamCount === 1 && runtime.activePointerTouchIntakeCount === 1 && runtime.activeFramePresentationAuthorityCount === 1, `R3E3_${session.label}_RUNTIME_OWNER_COUNT_INVALID`);
    assert(session.derived.canvasInputListenerCount === 6, `R3E3_${session.label}_CANVAS_INPUT_LISTENER_COUNT_INVALID`);
    assert(JSON.stringify(session.derived.canvasInputListenerTypes) === JSON.stringify(expectedListenerTypes), `R3E3_${session.label}_CANVAS_INPUT_LISTENER_TYPES_INVALID`);
    assert(receipt.intake.counters.eventListenerCount === 6, `R3E3_${session.label}_INTAKE_LISTENER_RECEIPT_INVALID`);
    assert(receipt.intake.counters.navigationProposalCount === 1 && session.derived.acceptedProposalCount === 1 && receipt.intake.counters.rejectedNavigationProposalCount === 0, `R3E3_${session.label}_LIMITED_PROPOSAL_COUNT_INVALID`);
    assert(liveGpu.counters.navigationStateAcceptanceCount === 1, `R3E3_${session.label}_LIVE_GPU_ACCEPTANCE_COUNT_INVALID`);
    assert(session.derived.visibleGpuFrameCount === 2 && liveGpu.counters.renderFrameCallCount === 2, `R3E3_${session.label}_VISIBLE_FRAME_COUNT_INVALID`);
    assert(session.derived.distinctVisibleFrameHashCount === 2 && session.derived.frameHashChanged === true, `R3E3_${session.label}_VISIBLE_FRAME_IDENTITY_DID_NOT_CHANGE`);
    assert(session.derived.finalNavigationSequence > session.derived.initialNavigationSequence, `R3E3_${session.label}_NAVIGATION_SEQUENCE_DID_NOT_ADVANCE`);
    assert(resources.resourceIdentityStable === true && resources.packageUploadedOnce === true, `R3E3_${session.label}_RESOURCE_IDENTITY_NOT_STABLE`);
    assert(resources.counters.postInitializationResourceCreationCount === 0 && resources.counters.postInitializationBufferUploadCount === 0, `R3E3_${session.label}_POST_INITIALIZATION_RESOURCE_ACTIVITY`);
    assert(liveGpu.counters.worldRebuildCount === 0 && liveGpu.counters.deferredRenderCommitCount === 0 && liveGpu.counters.queuedFrameChainCount === 0, `R3E3_${session.label}_OBSOLETE_FRAME_PATH_ACTIVITY`);
    assert(session.derived.appOwnedTimeoutCount === 0 && session.derived.appOwnedIntervalCount === 0 && session.derived.appOwnedAnimationFrameCount === 0 && session.derived.appOwnedMicrotaskCount === 0, `R3E3_${session.label}_APP_OWNED_DEFERRED_EXECUTION_OBSERVED`);
    assert(session.documentAudit.canvasInlineTransform === '' && session.documentAudit.canvasComputedTransform === 'none', `R3E3_${session.label}_CSS_TRANSFORM_PREVIEW_OBSERVED`);
    assert(['', 'none'].includes(session.documentAudit.canvasInlineTranslate) && ['none', '0px'].includes(session.documentAudit.canvasComputedTranslate), `R3E3_${session.label}_CSS_TRANSLATE_PREVIEW_OBSERVED`);
    assert(runtime.legacyModuleScriptCount === 0 && runtime.legacyCpuRouteControllerLoaded === false && runtime.legacyCpuEnvironmentIntegrationLoaded === false && runtime.legacyPublicDirectManipulationLoaded === false, `R3E3_${session.label}_LEGACY_RUNTIME_OWNER_ACTIVE`);
    assert(runtime.cpuWorldRebuildPerCameraChange === false && runtime.cssBitmapPreview === false && runtime.deferredPublicRefresh === false, `R3E3_${session.label}_LEGACY_PRESENTATION_PATH_ACTIVE`);
    assert(session.documentAudit.legacyKnownGlobalCount === 0, `R3E3_${session.label}_LEGACY_GLOBAL_PRESENT`);
  }

  assert(browserEvents.consoleErrors.length === 0, `R3E3_CONSOLE_ERRORS:${browserEvents.consoleErrors.join('|')}`);
  assert(browserEvents.pageErrors.length === 0, `R3E3_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0, `R3E3_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);

  const totals = {
    documentLoadCount: sessions.length,
    acceptedNavigationProposalCount: sessions.reduce((sum, session) => sum + session.derived.acceptedProposalCount, 0),
    visibleGpuFrameCount: sessions.reduce((sum, session) => sum + session.derived.visibleGpuFrameCount, 0),
    sumOfDistinctVisibleFrameHashCounts: sessions.reduce((sum, session) => sum + session.derived.distinctVisibleFrameHashCount, 0),
    totalWebGL2ContextCount: sessions.reduce((sum, session) => sum + session.derived.webGL2ContextCount, 0),
    totalCanvas2DContextCount: sessions.reduce((sum, session) => sum + session.derived.canvas2DContextCount, 0),
    totalCanvasInputListenerCount: sessions.reduce((sum, session) => sum + session.derived.canvasInputListenerCount, 0),
    totalLegacyModuleRequestCount: sessions.reduce((sum, session) => sum + session.derived.legacyRequestCount, 0),
    totalAppOwnedDeferredExecutionCount: sessions.reduce((sum, session) => sum + session.derived.appOwnedTimeoutCount + session.derived.appOwnedIntervalCount + session.derived.appOwnedAnimationFrameCount + session.derived.appOwnedMicrotaskCount, 0),
    totalPostInitializationResourceCreationCount: sessions.reduce((sum, session) => sum + session.finalReceipt.liveGpu.resources.counters.postInitializationResourceCreationCount, 0),
    totalPostInitializationBufferUploadCount: sessions.reduce((sum, session) => sum + session.finalReceipt.liveGpu.resources.counters.postInitializationBufferUploadCount, 0),
    totalWorldRebuildCount: sessions.reduce((sum, session) => sum + session.finalReceipt.liveGpu.counters.worldRebuildCount, 0),
    totalDeferredRenderCommitCount: sessions.reduce((sum, session) => sum + session.finalReceipt.liveGpu.counters.deferredRenderCommitCount, 0),
    totalQueuedFrameChainCount: sessions.reduce((sum, session) => sum + session.finalReceipt.liveGpu.counters.queuedFrameChainCount, 0)
  };

  assert(totals.documentLoadCount === 2, 'R3E3_DOCUMENT_LOAD_COUNT_INVALID');
  assert(totals.acceptedNavigationProposalCount === 2, 'R3E3_TOTAL_ACCEPTED_PROPOSAL_COUNT_INVALID');
  assert(totals.visibleGpuFrameCount === 4, 'R3E3_TOTAL_VISIBLE_GPU_FRAME_COUNT_INVALID');
  assert(totals.sumOfDistinctVisibleFrameHashCounts === 4, 'R3E3_TOTAL_DISTINCT_FRAME_EVIDENCE_INVALID');
  assert(totals.totalWebGL2ContextCount === 2 && totals.totalCanvas2DContextCount === 0, 'R3E3_TOTAL_CONTEXT_COUNTS_INVALID');
  assert(totals.totalCanvasInputListenerCount === 12, 'R3E3_TOTAL_INPUT_LISTENER_COUNT_INVALID');
  assert(totals.totalLegacyModuleRequestCount === 0 && totals.totalAppOwnedDeferredExecutionCount === 0, 'R3E3_TOTAL_OBSOLETE_OWNER_ACTIVITY');
  assert(totals.totalPostInitializationResourceCreationCount === 0 && totals.totalPostInitializationBufferUploadCount === 0, 'R3E3_TOTAL_RESOURCE_RECREATION_ACTIVITY');
  assert(totals.totalWorldRebuildCount === 0 && totals.totalDeferredRenderCommitCount === 0 && totals.totalQueuedFrameChainCount === 0, 'R3E3_TOTAL_OBSOLETE_FRAME_ACTIVITY');

  const executionReceipt = {
    receiptType: 'H_EARTH_RUN_8E_R3E3_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3E3_EXECUTION_PASS',
    targetUrl,
    parentControl: parent,
    childControl: child,
    sessions,
    totals,
    browserEvents,
    authorityExclusivity: {
      oneWebGL2ContextPerDocument: true,
      zeroCanvas2DContexts: true,
      onePersistentRendererPerDocument: true,
      oneNavigationStateStreamPerDocument: true,
      onePointerTouchIntakePerDocument: true,
      oneFramePresentationAuthorityPerDocument: true,
      exactCanvasInputListenersPerDocument: true,
      zeroLegacyModuleRequests: true,
      zeroAppOwnedDeferredExecution: true,
      zeroPostInitializationResourceCreation: true,
      zeroPostInitializationBufferUpload: true,
      zeroWorldRebuild: true,
      zeroBitmapPreview: true,
      initialAndReloadDocumentsBothPass: true
    },
    boundaries: {
      publicSourceMutated: false,
      fullPublicDirectManipulationAcceptancePerformed: false,
      sustainedPublicInteractionAcceptancePerformed: false,
      deploymentPerformed: false,
      physicalDeviceAcceptancePerformed: false,
      r3E4WorkStarted: false,
      run8EPassClosed: false
    },
    nextCheckpoint: 'RUN_8E_R3E4_NOT_STARTED',
    stoppingBoundary: 'STOP_BEFORE_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_R3E4',
    issues: []
  };
  writeJson('h-earth.run8e-r3e3.public-runtime-authority-exclusivity.execution.receipt.json', executionReceipt);
  console.log(JSON.stringify({ status: executionReceipt.status, totals, authorityExclusivity: executionReceipt.authorityExclusivity, stoppingBoundary: executionReceipt.stoppingBoundary }, null, 2));
} finally {
  await browser?.close();
}
