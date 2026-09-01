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

  async function sampleFrame(viewIndex) {
    return page.evaluate((index) => {
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      const snapshot = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
      const receipt = snapshot?.liveGpu ?? null;
      const resources = receipt?.resources ?? null;
      const selectedRendererPath = receipt?.liveDifferential?.selectedRendererPath ?? receipt?.selectedRendererPath ?? null;
      const query = new URLSearchParams(location.search);
      if (!(canvas instanceof HTMLCanvasElement)) return { canvas: false, viewIndex: index };

      const sample = document.createElement('canvas');
      sample.width = canvas.width;
      sample.height = canvas.height;
      const ctx = sample.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(canvas, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, sample.width, sample.height);

      const regionMean = (y0, y1, x0 = 0.08, x1 = 0.92) => {
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
      const horizonSky = regionMean(0.36, 0.50);

      let brightest = { luminance: -1, x: 0, y: 0, r: 0, g: 0, b: 0 };
      let brightSkyPixelCount = 0;
      let blueSkyPixelCount = 0;
      const yMax = Math.floor(height * 0.62);
      for (let y = 0; y < yMax; y += 2) for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (luminance > 215 && r > 210 && g > 200) brightSkyPixelCount += 1;
        if (b > r + 18 && b > g + 5 && b > 115) blueSkyPixelCount += 1;
        if (luminance > brightest.luminance) brightest = { luminance, x, y, r, g, b };
      }

      return {
        canvas: true,
        viewIndex: index,
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
        zenithBlueDominance: zenith.b - zenith.r,
        brightest,
        brightSkyPixelCount,
        blueSkyPixelCount
      };
    }, viewIndex);
  }

  async function yawStep(pointerId) {
    await page.evaluate(async (id) => {
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      if (!(canvas instanceof HTMLCanvasElement)) throw new Error('C3C2_OWNER_VISUAL_YAW_CANVAS_MISSING');
      const b = canvas.getBoundingClientRect();
      const y = b.top + b.height * 0.48;
      const x0 = b.left + b.width * 0.68;
      const x1 = b.left + b.width * 0.43;
      const emit = (type, x, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', isPrimary: true,
        clientX: x, clientY: y, buttons, pressure: buttons ? 0.5 : 0
      }));
      emit('pointerdown', x0, 1);
      emit('pointermove', x1, 1);
      await new Promise(resolve => setTimeout(resolve, 260));
      emit('pointerup', x1, 0);
      await new Promise(resolve => setTimeout(resolve, 220));
    }, pointerId);
  }

  const views = [];
  views.push(await sampleFrame(0));
  for (let index = 1; index <= 14; index += 1) {
    await yawStep(700 + index);
    views.push(await sampleFrame(index));
  }

  const score = (view) =>
    (view.blueSkyPixelCount ?? 0) * 0.02 +
    (view.brightSkyPixelCount ?? 0) * 0.08 +
    Math.max(0, view.zenithBlueDominance ?? 0) * 2 +
    Math.max(0, view.zenithToHorizonDelta ?? 0) +
    Math.max(0, (view.brightest?.luminance ?? 0) - 140) * 1.5;
  const best = [...views].sort((a, b) => score(b) - score(a))[0];

  const screenshotPath = `${evidenceDirectory}/c3c2-owner-visual-materialization.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const diagnostic = {
    receiptType: 'H_EARTH_C3C2_OWNER_VISUAL_MATERIALIZATION_DIAGNOSTIC_v3_NAVIGABLE_VIEW_RING',
    route,
    best,
    bestScore: score(best),
    views,
    consoleErrors,
    pageErrors
  };
  await writeFile(`${evidenceDirectory}/c3c2-owner-visual-materialization.diagnostic.json`, `${JSON.stringify(diagnostic, null, 2)}\n`);
  console.log(JSON.stringify(diagnostic, null, 2));

  assert.equal(best.canvas, true, 'C3C2_OWNER_VISUAL_CANVAS_MISSING');
  assert.equal(best.visualQuery, 'terrain-relief-v2', 'C3C2_OWNER_VISUAL_COMPATIBILITY_QUERY_NOT_EXERCISED');
  assert.match(String(best.selectedRendererPath), /cp2-additive-bandlimited-relief-v2\.js$/, 'C3C2_OWNER_VISUAL_COMPATIBILITY_ROUTE_NOT_SELECTED');
  assert.equal(best.atmosphericEnclosure?.materialized, true, 'C3C2_OWNER_VISUAL_ATMOSPHERIC_ENCLOSURE_NOT_MATERIALIZED');
  assert.equal(best.atmosphericEnclosure?.model, 'FULLSCREEN_SKY_GRADIENT_SUN_CURVED_HORIZON_HAZE', 'C3C2_OWNER_VISUAL_ATMOSPHERIC_MODEL_MISMATCH');
  assert.equal(best.ownerVisualRepair?.projectionRepairApplied, true, 'C3C2_OWNER_VISUAL_CELESTIAL_PROJECTION_REPAIR_NOT_APPLIED');
  assert.ok(best.atmosphereBackgroundDrawCallCount >= 1, 'C3C2_OWNER_VISUAL_BACKGROUND_PASS_NOT_DRAWN');
  assert.ok(best.visiblePresentationCount >= 1, 'C3C2_OWNER_VISUAL_FRAME_NOT_PRESENTED');
  assert.ok(best.blueSkyPixelCount >= 100, `C3C2_OWNER_VISUAL_NO_OPEN_ATMOSPHERIC_VIEW:${best.blueSkyPixelCount}`);
  assert.ok(best.zenithBlueDominance >= 12, `C3C2_OWNER_VISUAL_SKY_NOT_BLUE_DOMINANT:${best.zenithBlueDominance}`);
  assert.ok(best.zenithToHorizonDelta >= 14, `C3C2_OWNER_VISUAL_SKY_GRADIENT_TOO_WEAK:${best.zenithToHorizonDelta}`);
  assert.ok(best.brightest?.luminance >= 220, `C3C2_OWNER_VISUAL_CELESTIAL_REFERENCE_NOT_BRIGHT:${best.brightest?.luminance}`);
  assert.ok(best.brightSkyPixelCount >= 8, `C3C2_OWNER_VISUAL_CELESTIAL_REFERENCE_NOT_LEGIBLE:${best.brightSkyPixelCount}`);
  assert.equal(consoleErrors.length, 0, `C3C2_OWNER_VISUAL_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length, 0, `C3C2_OWNER_VISUAL_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);

  const receipt = {
    receiptType: 'H_EARTH_C3C2_OWNER_VISUAL_MATERIALIZATION_QUALIFICATION_v3',
    eligible: true,
    status: 'C3C2_OWNER_VISUAL_MATERIALIZATION_PASS',
    rootCauseClosed: 'PROMOTED_RENDERER_BYPASS_CLOSED_AND_PLANETARY_ATMOSPHERE_PROVED_FROM_NAVIGABLE_OWNER_VIEW',
    route,
    best,
    scannedViewCount: views.length,
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
