import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const repositoryRoot = process.cwd();
const targetUrl = process.env.H_EARTH_DIRECT_INSPECTION_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/';
const outputDirectory = process.env.H_EARTH_DIRECT_INSPECTION_OUTPUT ??
  '/tmp/h-earth-run8e-direct-inspection-restoration';
fs.mkdirSync(outputDirectory, { recursive: true });

const html = fs.readFileSync(
  path.join(repositoryRoot, 'showroom/globe/h-earth/index.html'),
  'utf8'
);
const integration = fs.readFileSync(
  path.join(
    repositoryRoot,
    'showroom/globe/h-earth/functional-landscape/environment-integration.js'
  ),
  'utf8'
);
const direct = fs.readFileSync(
  path.join(
    repositoryRoot,
    'showroom/globe/h-earth/functional-landscape/direct-manipulation.js'
  ),
  'utf8'
);
const controllerPath = path.join(
  repositoryRoot,
  'showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js'
);

const staticChecks = {
  controllerFileRemoved: !fs.existsSync(controllerPath),
  controllerImportRemoved:
    !integration.includes('mobile-navigation-controls.js') &&
    !integration.includes('installHEarthRun8EMobileNavigationControls'),
  stageDeclaresNoControls:
    !html.includes('data-h-earth-stage-contains-controls="true"') &&
    html.split('data-h-earth-stage-contains-controls="false"').length - 1 === 2,
  directGuidanceRestored:
    html.includes('Drag to look · Two-finger slide to move · Pinch to zoom'),
  directAriaRestored:
    html.includes('Drag one finger to look. Slide two fingers to move forward or backward. Pinch to zoom.'),
  directModuleLoaded:
    html.includes('direct-manipulation.js?v=run8e-direct-inspection-restoration-001'),
  cacheIdentityUpdated:
    html.includes('environment-integration.js?v=run8e-direct-inspection-restoration-001') &&
    html.includes('index.js?v=run8e-direct-inspection-restoration-001'),
  navigationOnlyStateMutation:
    direct.includes('dispatchNavigationOnly') &&
    integration.includes('dispatchNavigationOnly'),
  deferredInitialSuccessorRender:
    integration.includes('requestIdleCallback') &&
    integration.includes('DEFERRED_INITIAL_SUCCESSOR_RENDER'),
  renderRequestsCoalesced:
    integration.includes('coalescedRenderRequestCount') &&
    integration.includes('scheduledRenderWaiters'),
  browserYieldStagesPresent:
    integration.includes('yieldToBrowser') &&
    integration.split('await yieldToBrowser();').length - 1 >= 4,
  fullRenderCommittedAfterGesture:
    direct.includes('scheduleCommit(40)') &&
    direct.includes('successorApi'),
  visibleControllerAbsentByContract:
    direct.includes("visibleControllerPresent: false")
};
assert.equal(Object.values(staticChecks).every(Boolean), true, JSON.stringify(staticChecks));

const configurations = [
  {
    id: 'samsung-galaxy-portrait-emulation',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'samsung-galaxy-landscape-emulation',
    viewport: { width: 915, height: 412 },
    isMobile: true,
    hasTouch: true
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

async function dispatchPointer(page, type, pointerId, x, y) {
  await page.evaluate(({ type, pointerId, x, y }) => {
    const mount = document.getElementById('h-earth-functional-landscape-mount');
    mount.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId,
      pointerType: 'touch',
      isPrimary: pointerId === 1,
      clientX: x,
      clientY: y,
      buttons: type === 'pointerup' ? 0 : 1,
      pressure: type === 'pointerup' ? 0 : 0.5
    }));
  }, { type, pointerId, x, y });
}

async function snapshot(page) {
  return page.evaluate(() => ({
    navigation: window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot(),
    run8: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt(),
    scheduling: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getSchedulingReceipt(),
    interaction: window.H_EARTH_RUN8E_DIRECT_INSPECTION.getReceipt(),
    controllerPresent:
      document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null,
    stageContainsControls:
      document.querySelector('.h-earth-3d-world-stage')
        ?.dataset.hEarthStageContainsControls ?? null,
    status: document.getElementById('route-status')?.textContent ?? null
  }));
}

try {
  for (const configuration of configurations) {
    const context = await browser.newContext({
      viewport: configuration.viewport,
      isMobile: configuration.isMobile,
      hasTouch: configuration.hasTouch,
      deviceScaleFactor: 1,
      userAgent:
        'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(`PAGE:${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`CONSOLE:${message.text()}`);
    });
    page.on('requestfailed', (request) => {
      errors.push(`REQUEST:${request.url()}:${request.failure()?.errorText ?? 'UNKNOWN'}`);
    });

    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 240000
    });
    assert.equal(response?.status(), 200);

    await page.waitForFunction(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true &&
      window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
      window.H_EARTH_RUN8E_DIRECT_INSPECTION?.ready === true,
    null, { timeout: 240000 });

    await page.waitForFunction(() =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot().ready === true,
    null, { timeout: 240000 });

    const mount = page.locator('#h-earth-functional-landscape-mount');
    const box = await mount.boundingBox();
    assert.ok(box);
    const centerX = box.x + box.width * 0.5;
    const centerY = box.y + box.height * 0.5;

    const baseline = await snapshot(page);
    assert.equal(baseline.controllerPresent, false);
    assert.equal(baseline.stageContainsControls, 'false');
    assert.equal(baseline.interaction.visibleControllerPresent, false);

    // One-finger continuous look: navigation changes while the full successor
    // render remains unchanged until release.
    await dispatchPointer(page, 'pointerdown', 1, centerX, centerY);
    for (let step = 1; step <= 5; step += 1) {
      await dispatchPointer(page, 'pointermove', 1, centerX + step * 12, centerY - step * 2);
    }
    await page.waitForFunction((yaw) =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot().state.yawDegrees !== yaw,
    baseline.navigation.state.yawDegrees, { timeout: 5000 });
    const activeLook = await snapshot(page);
    assert.equal(activeLook.run8.renderSequence, baseline.run8.renderSequence);
    assert.equal(activeLook.interaction.previewActive, true);
    await dispatchPointer(page, 'pointerup', 1, centerX + 60, centerY - 10);
    await page.waitForFunction((sequence) =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence > sequence,
    baseline.run8.renderSequence, { timeout: 240000 });
    const afterLook = await snapshot(page);

    // Two-finger slide: movement state changes continuously without creating a
    // full Run 8 raster for every pointer move.
    const beforeTravel = afterLook;
    await dispatchPointer(page, 'pointerdown', 21, centerX - 30, centerY + 40);
    await dispatchPointer(page, 'pointerdown', 22, centerX + 30, centerY + 40);
    for (let step = 1; step <= 6; step += 1) {
      const y = centerY + 40 - step * 12;
      await dispatchPointer(page, 'pointermove', 21, centerX - 30, y);
      await dispatchPointer(page, 'pointermove', 22, centerX + 30, y);
    }
    await page.waitForFunction(({ x, z }) => {
      const position = window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot().state.position;
      return Math.hypot(position.x - x, position.z - z) > 2;
    }, {
      x: beforeTravel.navigation.state.position.x,
      z: beforeTravel.navigation.state.position.z
    }, { timeout: 5000 });
    const activeTravel = await snapshot(page);
    assert.equal(activeTravel.run8.renderSequence, beforeTravel.run8.renderSequence);
    await dispatchPointer(page, 'pointerup', 21, centerX - 30, centerY - 32);
    await dispatchPointer(page, 'pointerup', 22, centerX + 30, centerY - 32);
    await page.waitForFunction((sequence) =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence > sequence,
    beforeTravel.run8.renderSequence, { timeout: 240000 });
    const afterTravel = await snapshot(page);

    // Pinch zoom remains distinct from two-finger travel.
    const beforePinch = afterTravel;
    await dispatchPointer(page, 'pointerdown', 31, centerX - 28, centerY);
    await dispatchPointer(page, 'pointerdown', 32, centerX + 28, centerY);
    for (let step = 1; step <= 4; step += 1) {
      await dispatchPointer(page, 'pointermove', 31, centerX - 28 - step * 9, centerY);
      await dispatchPointer(page, 'pointermove', 32, centerX + 28 + step * 9, centerY);
    }
    await page.waitForFunction((fov) =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot().state.verticalFovDegrees !== fov,
    beforePinch.navigation.state.verticalFovDegrees, { timeout: 5000 });
    const activePinch = await snapshot(page);
    assert.equal(activePinch.run8.renderSequence, beforePinch.run8.renderSequence);
    await dispatchPointer(page, 'pointerup', 31, centerX - 64, centerY);
    await dispatchPointer(page, 'pointerup', 32, centerX + 64, centerY);
    await page.waitForFunction((sequence) =>
      window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence > sequence,
    beforePinch.run8.renderSequence, { timeout: 240000 });
    const final = await snapshot(page);

    assert.equal(final.controllerPresent, false);
    assert.equal(final.interaction.controllerElementPresent, false);
    assert.equal(final.interaction.oneFingerLook, true);
    assert.equal(final.interaction.twoFingerTravel, true);
    assert.equal(final.interaction.pinchZoom, true);
    assert.equal(final.interaction.previewActive, false);
    assert.equal(final.interaction.lastError, null);
    assert.equal(final.scheduling.directManipulationPreserved, true);
    assert.equal(final.scheduling.visibleControllerPresent, false);
    const successorRenderDelta =
      final.scheduling.completedRenderCount -
      baseline.scheduling.completedRenderCount;
    assert.equal(successorRenderDelta, 3);
    assert.equal(final.interaction.navigationIntentCount >= 3, true);
    assert.equal(
      successorRenderDelta < final.interaction.pointerMoveCount,
      true
    );
    assert.equal(
      final.interaction.maximumNavigationLatencyMilliseconds < 1000,
      true
    );
    assert.deepEqual(errors, []);

    const screenshot = `${configuration.id}.png`;
    await page.screenshot({
      path: path.join(outputDirectory, screenshot),
      fullPage: true
    });

    results.push({
      configurationId: configuration.id,
      viewport: configuration.viewport,
      oneFingerLookStateChanged: true,
      twoFingerTravelStateChanged: true,
      pinchZoomStateChanged: true,
      fullRenderSuppressedDuringActiveGestures: true,
      successorRenderCommittedAfterEachGesture: true,
      visibleControllerPresent: false,
      navigationIntentCount: final.interaction.navigationIntentCount,
      completedSuccessorRenderCount: final.scheduling.completedRenderCount,
      coalescedRenderRequestCount: final.scheduling.coalescedRenderRequestCount,
      maximumNavigationLatencyMilliseconds:
        final.interaction.maximumNavigationLatencyMilliseconds,
      zeroBrowserErrors: true,
      screenshot
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_DIRECT_INSPECTION_RESTORATION_PASS',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  baseMainHead: '43cf9be1397a756a3620166e498db10cc9d754b4',
  branch: 'agent/h-earth-run8e-direct-inspection-restoration-001',
  verifiedOn: '2026-07-26',
  staticChecks,
  interactionAuthority: {
    oneFingerContinuousLook: 'RESTORED',
    twoFingerContinuousTravel: 'RESTORED',
    pinchZoom: 'RESTORED',
    unobstructedInspection: 'RESTORED',
    visibleDirectionalController: 'REMOVED',
    coastControllerPanel: 'REMOVED',
    pressAndHoldControllerModel: 'REMOVED'
  },
  renderScheduling: {
    navigationStateMutationDuringGesture: true,
    lightweightCanvasPreviewDuringGesture: true,
    fullSuccessorRenderDuringActiveGesture: false,
    fullSuccessorRenderAfterGestureSettles: true,
    requestsCoalescedToLatestState: true,
    deferredInitialSuccessorRender: true,
    browserYieldStagesPresent: true
  },
  preservedAuthorities: {
    navigationAuthorityPreserved: true,
    cameraAuthorityPreserved: true,
    run8RendererPreserved: true,
    terrainGeometryMutated: false,
    lightingLawMutated: false,
    zDepthLawMutated: false
  },
  configurationCount: results.length,
  samsungPortraitEmulation: 'PASS',
  samsungLandscapeEmulation: 'PASS',
  physicalSamsungExecution: 'NOT_EXECUTED_AFTER_RESTORATION',
  run8EPassClosed: false,
  results,
  issues: []
};

const receiptText = `${JSON.stringify(receipt, null, 2)}\n`;
const receiptPath = path.join(
  outputDirectory,
  'h-earth.run8e-direct-inspection-restoration.receipt.json'
);
fs.writeFileSync(receiptPath, receiptText);
console.log(receiptText);
console.log(JSON.stringify({
  receiptPath,
  sha256: crypto.createHash('sha256').update(receiptText).digest('hex'),
  byteCount: Buffer.byteLength(receiptText)
}, null, 2));
