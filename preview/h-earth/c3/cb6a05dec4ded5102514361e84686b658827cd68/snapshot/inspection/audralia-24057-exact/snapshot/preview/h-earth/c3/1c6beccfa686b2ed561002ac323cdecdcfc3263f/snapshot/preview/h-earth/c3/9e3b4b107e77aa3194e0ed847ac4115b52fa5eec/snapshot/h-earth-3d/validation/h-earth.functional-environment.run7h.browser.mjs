import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.H_EARTH_RUN7H_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/functional-landscape/';
const output = process.env.H_EARTH_RUN7H_BROWSER_ARTIFACT_DIR ??
  'h-earth-run7h-browser-artifacts';
await fs.mkdir(output, { recursive: true });

const configurations = [
  ['desktop-landscape', 1280, 800, false, false],
  ['samsung-mobile-portrait', 412, 915, true, true],
  ['samsung-mobile-landscape', 915, 412, true, true]
];
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const [id, width, height, isMobile, hasTouch] of configurations) {
    const context = await browser.newContext({
      viewport: { width, height }, isMobile, hasTouch, deviceScaleFactor: 1
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await page.waitForFunction(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true &&
      window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')?.dataset.run7hReady === 'true',
    null, { timeout: 120_000 });

    const initial = await page.evaluate(async () => {
      await window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.dispatch({ action: 'RESET' });
      const refreshReceipt = await window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.refresh();
      return {
        refreshReceipt,
        snapshot: window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.getSnapshot()
      };
    });
    assert.equal(initial.snapshot.ready, true);
    assert.equal(initial.refreshReceipt.eligible, true);
    assert.equal(initial.refreshReceipt.skyAlphaClosed, true);
    assert.equal(initial.refreshReceipt.authorityCollapse, false);
    assert.equal(initial.refreshReceipt.rendererAuthorityReplaced, false);
    assert.equal(initial.refreshReceipt.cameraAuthorityReplaced, false);
    assert.equal(initial.refreshReceipt.navigationAuthorityReplaced, false);

    const before = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getBrowserReceipt().renderSequence);
    await page.locator('[data-action="MOVE_FORWARD"]').click();
    await page.waitForFunction((sequence) =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getBrowserReceipt().renderSequence > sequence &&
      window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.getBrowserReceipt().renderSequence > sequence,
    before, { timeout: 120_000 });

    const geographic = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.runGeographicPath());
    assert.equal(geographic.length, 5);
    assert.equal(geographic.every((entry) => entry.result.ok && entry.environmentReceipt.eligible), true);

    const lifecycle = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.runLifecycleDistanceProof());
    assert.deepEqual(lifecycle.map((entry) => entry.state),
      ['ACTIVE_DETAIL', 'ACTIVE_REDUCED', 'SLEEPING', 'UNLOADED']);
    assert.equal(lifecycle[2].populationInstanceCount, 0);
    assert.equal(lifecycle[3].populationInstanceCount, 0);

    const evidence = await page.evaluate(() => {
      const api = window.H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN7H.getSnapshot();
      const ids = ['hud-surface', 'hud-water', 'hud-biome', 'hud-traversal', 'hud-lifecycle', 'hud-population'];
      const hud = Object.fromEntries(ids.map((key) => [key, document.getElementById(key)?.textContent]));
      const buttons = [...document.querySelectorAll('button')];
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = new Set();
      let opaque = 0;
      let upperBandNonGray = 0;
      let lowerBandBlue = 0;
      const stride = Math.max(4, Math.floor(pixels.length / 12000 / 4) * 4);
      for (let index = 0; index < pixels.length; index += stride) {
        const offset = index - index % 4;
        const red = pixels[offset];
        const green = pixels[offset + 1];
        const blue = pixels[offset + 2];
        if (pixels[offset + 3] === 255) opaque += 1;
        colors.add(`${red},${green},${blue}`);
        const pixelIndex = offset / 4;
        const y = Math.floor(pixelIndex / canvas.width);
        if (y < canvas.height * 0.45 &&
            Math.max(red, green, blue) - Math.min(red, green, blue) > 8) {
          upperBandNonGray += 1;
        }
        if (y > canvas.height * 0.3 && blue > red * 1.08 && blue > green) {
          lowerBandBlue += 1;
        }
      }
      return {
        api,
        hud,
        hudComplete: Object.values(hud).every((value) => value && value !== '—'),
        minimumButtonWidth: Math.min(...buttons.map((button) => button.getBoundingClientRect().width)),
        minimumButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height)),
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        opaque,
        colorCount: colors.size,
        upperBandNonGray,
        lowerBandBlue,
        routeError: document.getElementById('h-earth-functional-landscape-route').dataset.run7hError
      };
    });
    assert.equal(evidence.api.ready, true);
    assert.equal(evidence.hudComplete, true);
    assert.equal(evidence.minimumButtonWidth >= 44, true);
    assert.equal(evidence.minimumButtonHeight >= 44, true);
    assert.equal(evidence.canvasWidth >= 200, true);
    assert.equal(evidence.canvasHeight >= 150, true);
    assert.equal(evidence.opaque > 0, true);
    assert.equal(evidence.colorCount > 12, true);
    assert.equal(evidence.upperBandNonGray > 0, true);
    assert.equal(evidence.lowerBandBlue > 0, true);
    assert.equal(evidence.routeError, 'false');
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);

    const screenshot = `${id}.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
    results.push({
      configurationId: id,
      viewport: { width, height },
      isMobile,
      hasTouch,
      lifecycle,
      initialMaterializationReceipt: initial.refreshReceipt,
      finalReceipt: evidence.api.receipt,
      composite: evidence.api.composite,
      visualEvidence: {
        colorCount: evidence.colorCount,
        upperBandNonGray: evidence.upperBandNonGray,
        lowerBandBlue: evidence.lowerBandBlue,
        opaquePixelSamples: evidence.opaque
      },
      screenshot,
      consoleErrors,
      pageErrors
    });
    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7H_BROWSER_MATRIX_RECEIPT',
  eligible: true,
  status: 'RUN_7H_BROWSER_MATRIX_PASS',
  configurationCount: results.length,
  configurations: results,
  desktopExecution: 'PASS',
  samsungMobilePortraitExecution: 'PASS',
  samsungMobileLandscapeExecution: 'PASS',
  touchAndPointerExecution: 'PASS',
  integratedEnvironmentPresentation: 'PASS',
  lifecycleTransitionProof: 'PASS',
  actualBrowserExecution: true,
  productionDeployment: false,
  livePublicUrlVerification: false,
  issues: []
};
await fs.writeFile(path.join(output, 'run7h-browser-receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
