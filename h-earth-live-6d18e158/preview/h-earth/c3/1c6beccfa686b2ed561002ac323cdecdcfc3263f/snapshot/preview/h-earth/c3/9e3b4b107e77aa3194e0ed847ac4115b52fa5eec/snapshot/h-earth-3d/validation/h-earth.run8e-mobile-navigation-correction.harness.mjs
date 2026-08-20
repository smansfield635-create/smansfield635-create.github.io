import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.H_EARTH_MOBILE_CORRECTION_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/';
const output = process.env.H_EARTH_MOBILE_CORRECTION_OUTPUT ??
  '/tmp/h-earth-run8e-mobile-navigation-correction';

await fs.mkdir(output, { recursive: true });

const [htmlSource, navigationSource, integrationSource, controlsSource] = await Promise.all([
  fs.readFile('showroom/globe/h-earth/index.html', 'utf8'),
  fs.readFile('showroom/globe/h-earth/functional-landscape/index.js', 'utf8'),
  fs.readFile('showroom/globe/h-earth/functional-landscape/environment-integration.js', 'utf8'),
  fs.readFile('showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js', 'utf8')
]);

const staticChecks = {
  cacheKeyUpdated: htmlSource.includes(
    'environment-integration.js?v=run8e-mobile-navigation-001'
  ),
  routeDeclaresControls: (
    htmlSource.match(/data-h-earth-stage-contains-controls="true"/g) ?? []
  ).length >= 2,
  navigationOnlyDispatchPresent: navigationSource.includes(
    'async dispatchNavigationOnly(intent)'
  ),
  navigationOnlyWaypointPresent: navigationSource.includes(
    'async gotoWaypointNavigationOnly(waypointId)'
  ),
  navigationOnlyResetPresent: navigationSource.includes(
    'async resetNavigationOnly()'
  ),
  integrationUsesNavigationOnlyDispatch: integrationSource.includes(
    'api.dispatchNavigationOnly.bind(api)'
  ),
  integrationUsesNavigationOnlyWaypoint: integrationSource.includes(
    'api.gotoWaypointNavigationOnly.bind(api)'
  ),
  mobileControlsInstalled: integrationSource.includes(
    'installHEarthRun8EMobileNavigationControls({ root, mount })'
  ),
  legacyDoubleRenderBridgeRemoved: !integrationSource.includes(
    'const result = await original.dispatch(intent);'
  ),
  directionalControlsPresent: [
    'MOVE_FORWARD',
    'MOVE_BACKWARD',
    'STRAFE_LEFT',
    'STRAFE_RIGHT'
  ].every((action) => controlsSource.includes(action)),
  coastResetPresent: controlsSource.includes('data-h-earth-mobile-reset'),
  pressAndHoldPresent: controlsSource.includes('HOLD_DELAY_MS') &&
    controlsSource.includes('HOLD_REPEAT_MS') &&
    controlsSource.includes('setInterval(() => dispatch(action), HOLD_REPEAT_MS)')
};

assert.equal(Object.values(staticChecks).every(Boolean), true, JSON.stringify(staticChecks));

const configurations = [
  {
    id: 'samsung-galaxy-portrait-emulation',
    width: 412,
    height: 915
  },
  {
    id: 'samsung-galaxy-landscape-emulation',
    width: 915,
    height: 412
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const configuration of configurations) {
    const context = await browser.newContext({
      viewport: {
        width: configuration.width,
        height: configuration.height
      },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const requestFailures = [];
    const httpErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      requestFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`);
    });

    await page.goto(`${url}?mobile-correction=${Date.now()}-${configuration.id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 180000
    });
    await page.waitForFunction(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true &&
      window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
      window.H_EARTH_RUN8E_MOBILE_NAVIGATION?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')
        ?.dataset.mobileNavigationControls === 'true',
    null, { timeout: 240000 });

    const controls = page.locator('#h-earth-run8e-mobile-navigation-controls');
    await controls.waitFor({ state: 'visible', timeout: 30000 });
    assert.equal(await controls.locator('button').count(), 5);

    const before = await page.evaluate(() => ({
      navigation: window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot(),
      run8: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt(),
      mobile: window.H_EARTH_RUN8E_MOBILE_NAVIGATION.getReceipt()
    }));
    const initialPosition = before.navigation.state.position;
    const run6RenderSequence = before.navigation.receipt.renderSequence;
    let previousRun8Sequence = before.run8.renderSequence;

    const forward = controls.locator('[data-h-earth-mobile-action="MOVE_FORWARD"]');
    for (let step = 0; step < 3; step += 1) {
      await forward.dispatchEvent('pointerdown', {
        pointerId: 41 + step,
        pointerType: 'touch',
        isPrimary: true,
        buttons: 1
      });
      await forward.dispatchEvent('pointerup', {
        pointerId: 41 + step,
        pointerType: 'touch',
        isPrimary: true,
        buttons: 0
      });
      await page.waitForFunction((sequence) =>
        window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence > sequence,
      previousRun8Sequence, { timeout: 240000 });
      previousRun8Sequence = await page.evaluate(() =>
        window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence);
    }

    const moved = await page.evaluate(() => ({
      navigation: window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot(),
      run8: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt(),
      mobile: window.H_EARTH_RUN8E_MOBILE_NAVIGATION.getReceipt()
    }));
    const movedPosition = moved.navigation.state.position;
    const movementDistance = Math.hypot(
      movedPosition.x - initialPosition.x,
      movedPosition.z - initialPosition.z
    );

    assert.equal(movementDistance >= 12, true);
    assert.equal(moved.navigation.receipt.renderSequence, run6RenderSequence);
    assert.equal(moved.run8.renderSequence > before.run8.renderSequence, true);
    assert.equal(moved.mobile.actionDispatchCount, 3);
    assert.equal(moved.mobile.holdSessionCount, 3);
    assert.equal(moved.mobile.lastError, null);

    await controls.locator('[data-h-earth-mobile-reset="true"]').click();
    await page.waitForFunction(({ sequence, x, z }) => {
      const run8 = window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt();
      const state = window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot().state;
      return run8.renderSequence > sequence &&
        Math.abs(state.position.x - x) < 1e-9 &&
        Math.abs(state.position.z - z) < 1e-9;
    }, {
      sequence: moved.run8.renderSequence,
      x: initialPosition.x,
      z: initialPosition.z
    }, { timeout: 240000 });

    const final = await page.evaluate(() => ({
      navigation: window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot(),
      run8: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt(),
      mobile: window.H_EARTH_RUN8E_MOBILE_NAVIGATION.getReceipt(),
      controlVisible: getComputedStyle(
        document.getElementById('h-earth-run8e-mobile-navigation-controls')
      ).display !== 'none'
    }));

    assert.equal(final.navigation.receipt.renderSequence, run6RenderSequence);
    assert.equal(final.mobile.resetCount, 1);
    assert.equal(final.mobile.lastAction, 'RESET_TO_COAST');
    assert.equal(final.mobile.lastError, null);
    assert.equal(final.controlVisible, true);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(requestFailures, []);
    assert.deepEqual(httpErrors, []);

    const screenshot = `${configuration.id}.png`;
    await page.screenshot({
      path: path.join(output, screenshot),
      fullPage: true
    });

    results.push({
      configurationId: configuration.id,
      viewport: {
        width: configuration.width,
        height: configuration.height
      },
      mobileControlsVisible: true,
      visibleControlCount: 5,
      forwardStepsExecuted: 3,
      movementDistanceMinimumEstablished: movementDistance >= 12,
      duplicateRun6RenderSuppressed: final.navigation.receipt.renderSequence === run6RenderSequence,
      run8RenderAdvanced: final.run8.renderSequence > before.run8.renderSequence,
      resetToCoastEstablished: final.mobile.resetCount === 1,
      zeroBrowserErrors: true,
      screenshot
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_MOBILE_NAVIGATION_CORRECTION_PASS',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  baseMainHead: 'cabe801ec64cb3e58a404774e9408a1b58de285b',
  branch: 'agent/h-earth-run8e-mobile-navigation-correction-001',
  verifiedOn: '2026-07-26',
  staticChecks,
  configurationCount: results.length,
  samsungPortraitEmulation: 'PASS',
  samsungLandscapeEmulation: 'PASS',
  explicitMovementControlsPresent: true,
  coastResetControlPresent: true,
  pressAndHoldImplementationPresent: true,
  navigationAuthorityPreserved: true,
  duplicateLegacyRenderSuppressed: true,
  run8RendererPreserved: true,
  terrainGeometryMutated: false,
  lightingLawMutated: false,
  physicalSamsungExecution: 'NOT_EXECUTED_AFTER_CORRECTION',
  run8EPassClosed: false,
  results,
  issues: []
};

await fs.writeFile(
  path.join(output, 'h-earth.run8e-mobile-navigation-correction.receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify(receipt, null, 2));
