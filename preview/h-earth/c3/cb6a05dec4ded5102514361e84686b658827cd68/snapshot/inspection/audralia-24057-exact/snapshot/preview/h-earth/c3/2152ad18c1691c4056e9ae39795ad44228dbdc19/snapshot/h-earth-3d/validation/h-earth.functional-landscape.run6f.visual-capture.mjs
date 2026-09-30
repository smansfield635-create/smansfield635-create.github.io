import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.H_EARTH_RUN6F_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/functional-landscape/';
const output = process.env.H_EARTH_RUN6F_VISUAL_DIR ??
  'h-earth-run6f-visual-capture';
const waypoints = ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE'];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1
});
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000
  });
  await page.waitForFunction(() =>
    window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true,
  null, {
    timeout: 120_000
  });

  const captures = [];
  for (const waypointId of waypoints) {
    const result = await page.evaluate(async (id) =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.gotoWaypoint(id),
    waypointId);
    assert.equal(result.ok, true);

    const receipt = await page.evaluate(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F
        .getBrowserReceipt()
    );
    assert.equal(receipt.skyAlphaClosed, true);
    assert.equal(receipt.cameraTerrainClearancePass, true);
    assert.equal(receipt.semanticSelectionPresent, true);

    const fileName = `${waypointId.toLowerCase()}.png`;
    await page.screenshot({
      path: path.join(output, fileName),
      fullPage: true
    });

    captures.push({
      waypointId,
      fileName,
      position: receipt.position,
      terrainElevation: receipt.terrainElevation,
      clearance: receipt.clearance,
      chunkId: receipt.chunkId,
      semanticAddressId: receipt.selectedSemanticAddressId,
      formationIds: receipt.formationIds,
      acceptedTriangleCount: receipt.acceptedTriangleCount,
      rejectedFragmentCount: receipt.rejectedFragmentCount,
      writtenPixelCount: receipt.writtenPixelCount,
      skyAlphaClosed: receipt.skyAlphaClosed
    });
  }

  assert.deepEqual(pageErrors, []);

  const receipt = {
    receiptType:
      'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_VISUAL_CAPTURE_RECEIPT',
    eligible: true,
    status: 'RUN_6F_GEOGRAPHIC_WAYPOINT_CAPTURE_COMPLETE',
    viewport: { width: 1280, height: 800 },
    captures,
    browserVerdictAuthority: false,
    productionAuthority: false,
    issues: []
  };

  await fs.writeFile(
    path.join(output, 'run6f-visual-capture-receipt.json'),
    `${JSON.stringify(receipt, null, 2)}\n`,
    'utf8'
  );
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await context.close();
  await browser.close();
}
