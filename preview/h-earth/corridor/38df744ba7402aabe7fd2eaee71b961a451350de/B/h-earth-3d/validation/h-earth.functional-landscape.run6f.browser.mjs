import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.H_EARTH_RUN6F_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/functional-landscape/';
const artifactDirectory = process.env.H_EARTH_RUN6F_ARTIFACT_DIR ??
  'h-earth-run6f-browser-artifacts';

await fs.mkdir(artifactDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const configurations = [
  {
    id: 'desktop-landscape',
    viewport: { width: 1280, height: 800 },
    isMobile: false,
    hasTouch: false
  },
  {
    id: 'mobile-portrait',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-landscape',
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true
  }
];

const configurationReceipts = [];

try {
  for (const configuration of configurations) {
    const context = await browser.newContext({
      viewport: configuration.viewport,
      isMobile: configuration.isMobile,
      hasTouch: configuration.hasTouch,
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 120_000
    });

    await page.waitForFunction(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')
        ?.dataset.run6fReady === 'true',
    null, {
      timeout: 120_000
    });

    const baseFrame = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .getBaseFrameSummary()
    );
    assert.equal(baseFrame.primitiveCount, 18);
    assert.equal(baseFrame.semanticAddressCount, 256);
    assert.equal(baseFrame.terrainAddressCount, 124);
    assert.equal(baseFrame.shorelineWaterAddressCount, 96);
    assert.equal(baseFrame.proxyAddressCount, 36);
    assert.equal(baseFrame.packet001Altered, false);
    assert.equal(baseFrame.existingPacket002Altered, false);

    const initialSnapshot = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.getSnapshot()
    );
    assert.equal(initialSnapshot.ready, true);
    assert.equal(initialSnapshot.receipt.skyAlphaClosed, true);
    assert.equal(initialSnapshot.receipt.cameraTerrainClearancePass, true);
    assert.equal(initialSnapshot.receipt.semanticSelectionPresent, true);
    assert.equal(initialSnapshot.receipt.writtenPixelCount > 0, true);

    const initialRenderSequence =
      initialSnapshot.receipt.renderSequence;
    await page.locator('[data-action="MOVE_FORWARD"]').click();
    await page.waitForFunction((priorSequence) =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .getBrowserReceipt().renderSequence > priorSequence,
    initialRenderSequence, {
      timeout: 120_000
    });

    const pathReceipts = await page.evaluate(async () =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .runGeographicPath()
    );
    assert.equal(pathReceipts.length, 5);
    assert.equal(pathReceipts.every((entry) => entry.ok === true), true);

    const pathReceipt = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .getBrowserReceipt()
    );
    assert.deepEqual(
      pathReceipt.visitedWaypoints,
      ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']
    );
    assert.equal(
      pathReceipt.formationIds.includes('H_EARTH_RIDGE_BLUFF_001'),
      true
    );
    assert.equal(pathReceipt.cameraTerrainClearancePass, true);
    assert.equal(pathReceipt.skyAlphaClosed, true);
    assert.equal(pathReceipt.semanticSelectionPresent, true);

    const recovery = await page.evaluate(async () =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .forceBelowTerrainRecovery()
    );
    assert.equal(recovery.ok, true);
    assert.equal(recovery.state.recovered, true);
    assert.equal(recovery.state.clearance >= 1.6, true);

    const canvasEvidence = await page.evaluate(() => {
      const canvas = document.getElementById(
        'h-earth-functional-landscape-canvas'
      );
      const context = canvas.getContext('2d');
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let opaquePixelCount = 0;
      const sampledColors = new Set();
      const stride = Math.max(4, Math.floor(pixels.length / 12000 / 4) * 4);
      for (let index = 0; index < pixels.length; index += stride) {
        const aligned = index - (index % 4);
        if (pixels[aligned + 3] === 255) {
          opaquePixelCount += 1;
        }
        sampledColors.add(
          `${pixels[aligned]},${pixels[aligned + 1]},${pixels[aligned + 2]}`
        );
      }
      return {
        width: canvas.width,
        height: canvas.height,
        opaquePixelCount,
        sampledColorCount: sampledColors.size
      };
    });
    assert.equal(canvasEvidence.width >= 200, true);
    assert.equal(canvasEvidence.height >= 150, true);
    assert.equal(canvasEvidence.opaquePixelCount > 0, true);
    assert.equal(canvasEvidence.sampledColorCount > 8, true);

    const controlEvidence = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      return {
        buttonCount: buttons.length,
        minimumWidth: Math.min(...buttons.map((button) =>
          button.getBoundingClientRect().width)),
        minimumHeight: Math.min(...buttons.map((button) =>
          button.getBoundingClientRect().height)),
        routeError:
          document.getElementById('h-earth-functional-landscape-route')
            .dataset.run6fError
      };
    });
    assert.equal(controlEvidence.buttonCount >= 16, true);
    assert.equal(controlEvidence.minimumWidth >= 44, true);
    assert.equal(controlEvidence.minimumHeight >= 44, true);
    assert.equal(controlEvidence.routeError, 'false');

    const screenshotPath = path.join(
      artifactDirectory,
      `${configuration.id}.png`
    );
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    const finalReceipt = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .getBrowserReceipt()
    );

    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);

    configurationReceipts.push({
      configurationId: configuration.id,
      viewport: configuration.viewport,
      orientation: finalReceipt.viewport.orientation,
      initialRenderSequence,
      finalRenderSequence: finalReceipt.renderSequence,
      visitedWaypoints: finalReceipt.visitedWaypoints,
      finalChunkId: finalReceipt.chunkId,
      finalSemanticAddressId: finalReceipt.selectedSemanticAddressId,
      finalFormationIds: finalReceipt.formationIds,
      terrainClearance: finalReceipt.clearance,
      terrainRecovery: recovery.state.recovered,
      skyAlphaClosed: finalReceipt.skyAlphaClosed,
      writtenPixelCount: finalReceipt.writtenPixelCount,
      acceptedTriangleCount: finalReceipt.acceptedTriangleCount,
      rejectedFragmentCount: finalReceipt.rejectedFragmentCount,
      canvasEvidence,
      controlEvidence,
      screenshot: `${configuration.id}.png`,
      consoleErrors,
      pageErrors
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_BROWSER_MATRIX_RECEIPT',
  eligible: true,
  status: 'RUN_6F_BROWSER_MATRIX_PASS',
  url: baseUrl,
  configurationCount: configurationReceipts.length,
  configurations: configurationReceipts,
  geographicPath: ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE'],
  desktopLandscape: 'PASS',
  mobilePortrait: 'PASS',
  mobileLandscape: 'PASS',
  cameraTerrainClearance: 'PASS',
  terrainRecovery: 'PASS',
  semanticSelectionPersistence: 'PASS',
  skyClosure: 'PASS',
  actualBrowserExecution: true,
  publicRouteReplacement: false,
  productionAuthority: false,
  issues: []
};

await fs.writeFile(
  path.join(artifactDirectory, 'run6f-browser-receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify(receipt, null, 2));
