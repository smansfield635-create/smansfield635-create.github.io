import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const route = `${origin}/showroom/globe/h-earth/`;
await mkdir(evidenceDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']
});

try {
  const page = await browser.newPage({ viewport: { width: 709, height: 1536 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(String(error?.stack ?? error)));

  const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  assert.ok(response && response.status() >= 200 && response.status() < 400, `C3C2_OWNER_VISUAL_ROUTE_HTTP_${response?.status()}`);
  await page.waitForFunction(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 90_000 });
  await page.waitForFunction(() => Number(globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1, null, { timeout: 90_000 });

  const facts = await page.evaluate(() => {
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    const snapshot = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    const receipt = snapshot?.liveGpu ?? null;
    const resources = receipt?.resources ?? null;
    const selectedRendererPath = receipt?.liveDifferential?.selectedRendererPath ?? receipt?.selectedRendererPath ?? null;
    const query = new URLSearchParams(location.search);

    if (!(canvas instanceof HTMLCanvasElement)) return { canvas: false };
    const sample = document.createElement('canvas');
    sample.width = canvas.width;
    sample.height = canvas.height;
    const ctx = sample.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, sample.width, sample.height);

    const regionMean = (y0, y1, x0 = 0.12, x1 = 0.88) => {
      const sy0 = Math.floor(height * y0), sy1 = Math.max(sy0 + 1, Math.floor(height * y1));
      const sx0 = Math.floor(width * x0), sx1 = Math.max(sx0 + 1, Math.floor(width * x1));
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = sy0; y < sy1; y += 2) for (let x = sx0; x < sx1; x += 2) {
        const i = (y * width + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n += 1;
      }
      return { r: r / n, g: g / n, b: b / n };
    };
    const delta = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
    const zenith = regionMean(0.04, 0.18);
    const upperSky = regionMean(0.20, 0.34);
    const horizonSky = regionMean(0.36, 0.48);

    let brightest = { luminance: -1, x: 0, y: 0, r: 0, g: 0, b: 0 };
    let brightSkyPixelCount = 0;
    const yMax = Math.floor(height * 0.55);
    for (let y = 0; y < yMax; y += 2) for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (luminance > 215 && r > 210 && g > 200) brightSkyPixelCount += 1;
      if (luminance > brightest.luminance) brightest = { luminance, x, y, r, g, b };
    }

    return {
      canvas: true,
      width,
      height,
      href: location.href,
      visualQuery: query.get('visual'),
      selectedRendererPath,
      atmosphericEnclosure: resources?.atmosphericEnclosure ?? null,
      ownerVisualRepair: resources?.ownerVisualRepair ?? null,
      atmosphereBackgroundDrawCallCount: Number(resources?.counters?.atmosphereBackgroundDrawCallCount ?? 0),
      visiblePresentationCount: Number(resources?.counters?.visiblePresentationCount ?? 0),
      zenith,
      upperSky,
      horizonSky,
      zenithToHorizonDelta: delta(zenith, horizonSky),
      upperToHorizonDelta: delta(upperSky, horizonSky),
      brightest,
      brightSkyPixelCount
    };
  });

  const screenshotPath = `${evidenceDirectory}/c3c2-owner-visual-materialization.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const diagnostic = {
    receiptType: 'H_EARTH_C3C2_OWNER_VISUAL_MATERIALIZATION_DIAGNOSTIC_v2',
    route,
    facts,
    consoleErrors,
    pageErrors
  };
  await writeFile(`${evidenceDirectory}/c3c2-owner-visual-materialization.diagnostic.json`, `${JSON.stringify(diagnostic, null, 2)}\n`);
  console.log(JSON.stringify(diagnostic, null, 2));

  assert.equal(facts.canvas, true, 'C3C2_OWNER_VISUAL_CANVAS_MISSING');
  assert.equal(facts.visualQuery, 'terrain-relief-v2', 'C3C2_OWNER_VISUAL_COMPATIBILITY_QUERY_NOT_EXERCISED');
  assert.match(String(facts.selectedRendererPath), /cp2-additive-bandlimited-relief-v2\.js$/, 'C3C2_OWNER_VISUAL_COMPATIBILITY_ROUTE_NOT_SELECTED');
  assert.equal(facts.atmosphericEnclosure?.materialized, true, 'C3C2_OWNER_VISUAL_ATMOSPHERIC_ENCLOSURE_NOT_MATERIALIZED');
  assert.equal(facts.atmosphericEnclosure?.model, 'FULLSCREEN_SKY_GRADIENT_SUN_CURVED_HORIZON_HAZE', 'C3C2_OWNER_VISUAL_ATMOSPHERIC_MODEL_MISMATCH');
  assert.equal(facts.ownerVisualRepair?.projectionRepairApplied, true, 'C3C2_OWNER_VISUAL_CELESTIAL_PROJECTION_REPAIR_NOT_APPLIED');
  assert.ok(facts.atmosphereBackgroundDrawCallCount >= 1, 'C3C2_OWNER_VISUAL_BACKGROUND_PASS_NOT_DRAWN');
  assert.ok(facts.visiblePresentationCount >= 1, 'C3C2_OWNER_VISUAL_FRAME_NOT_PRESENTED');
  assert.ok(facts.zenithToHorizonDelta >= 14, `C3C2_OWNER_VISUAL_SKY_GRADIENT_TOO_WEAK:${facts.zenithToHorizonDelta}`);
  assert.ok(facts.brightest?.luminance >= 220, `C3C2_OWNER_VISUAL_CELESTIAL_REFERENCE_NOT_BRIGHT:${facts.brightest?.luminance}`);
  assert.ok(facts.brightSkyPixelCount >= 8, `C3C2_OWNER_VISUAL_CELESTIAL_REFERENCE_NOT_LEGIBLE:${facts.brightSkyPixelCount}`);
  assert.equal(consoleErrors.length, 0, `C3C2_OWNER_VISUAL_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length, 0, `C3C2_OWNER_VISUAL_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);

  const receipt = {
    receiptType: 'H_EARTH_C3C2_OWNER_VISUAL_MATERIALIZATION_QUALIFICATION_v2',
    eligible: true,
    status: 'C3C2_OWNER_VISUAL_MATERIALIZATION_PASS',
    rootCauseClosed: 'PROMOTED_RENDERER_BYPASS_AND_INITIAL_CELESTIAL_OCCLUSION_CLOSED',
    route,
    facts,
    consoleErrors,
    pageErrors,
    ownerInspectionStillRequired: true,
    mergeAuthorized: false
  };
  await writeFile(`${evidenceDirectory}/c3c2-owner-visual-materialization.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await browser.close();
}
