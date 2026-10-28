import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';

const CONTRACT = 'METHODS_NATIVE_VISUAL_ARCHITECTURE_RISK_REVIEW_v1';
const ORIGIN = process.env.METHODS_ORIGIN || 'http://127.0.0.1:4173';
const ROUTE = `${ORIGIN}/verification/methods-native-visual-architecture-v1/`;
const CHROME_PATH = process.env.CHROME_PATH;
const OUT_DIR = path.resolve(process.env.OUT_DIR || 'methods-native-visual-architecture-risk-evidence');
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const CANDIDATE_HEAD = process.env.CANDIDATE_HEAD || 'UNKNOWN';

if (!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const viewports = [
  { id: 'SMALL_PHONE', width: 360, height: 800 },
  { id: 'LARGE_PHONE', width: 430, height: 932 },
  { id: 'TABLET_PORTRAIT', width: 768, height: 1024 },
  { id: 'SHORT_DESKTOP', width: 1180, height: 820 },
  { id: 'STANDARD_DESKTOP', width: 1440, height: 1000 }
];

const findings = [];
const observations = [];
const screenshots = [];

function recordFinding(code, viewport, detail = {}) {
  findings.push({ code, viewport, detail });
}

function intersects(a, b) {
  if (!a || !b) return false;
  return Math.max(a.left, b.left) < Math.min(a.right, b.right) &&
    Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom);
}

async function waitStable(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-mm-showroom]');
    return document.documentElement.dataset.methodsModelsNativeArchitecture === 'active' &&
      root?.dataset.mmEuclideanReady === 'true' &&
      root?.dataset.mmNativeArchitecture === 'active' &&
      !root?.dataset.mmTransitioning;
  }, { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 140));
}

async function capture(page, viewport, state) {
  const file = `${viewport.id.toLowerCase()}-${state}.png`;
  const filePath = path.join(SCREENSHOT_DIR, file);
  await page.screenshot({ path: filePath, fullPage: true });
  const bytes = fs.readFileSync(filePath);
  screenshots.push({ file, viewport: viewport.id, state, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}

async function metrics(page) {
  return page.evaluate(() => {
    const rect = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const r = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        width: r.width, height: r.height,
        display: style.display, visibility: style.visibility,
        opacity: Number.parseFloat(style.opacity || '1'),
        fontSize: Number.parseFloat(style.fontSize || '0'),
        transform: style.transform
      };
    };
    const buttons = Array.from(document.querySelectorAll('[data-mm-showroom] button:not([hidden])')).map(button => {
      const r = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return {
        label: button.getAttribute('aria-label') || button.textContent.trim(),
        width: r.width, height: r.height,
        left: r.left, right: r.right, top: r.top, bottom: r.bottom,
        display: style.display, visibility: style.visibility,
        disabled: button.disabled
      };
    }).filter(item => item.display !== 'none' && item.visibility !== 'hidden');
    const activeCards = Array.from(document.querySelectorAll('.mm-model-card')).filter(card => {
      const style = getComputedStyle(card);
      return card.dataset.mmXPosition === 'active' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > .5;
    }).length;
    const visibleInactiveCards = Array.from(document.querySelectorAll('.mm-model-card')).filter(card => {
      const style = getComputedStyle(card);
      return card.dataset.mmXPosition !== 'active' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > .05;
    }).length;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      camera: document.body.dataset.mmCamera,
      architecture: document.documentElement.dataset.methodsModelsNativeArchitecture,
      coordinate: {
        x: document.querySelector('[data-mm-showroom]')?.dataset.mmX,
        y: document.querySelector('[data-mm-showroom]')?.dataset.mmY,
        z: document.querySelector('[data-mm-showroom]')?.dataset.mmZ
      },
      stage: rect('.mm-stage'),
      title: rect('.mm-stage__header h2'),
      family: rect('.mm-family-tabs'),
      cameraControls: rect('[data-mm-native-camera-controls]'),
      card: rect('.mm-model-card[data-mm-x-position="active"]'),
      lens: rect('.mm-lens-tabs'),
      coordinatePanel: rect('.mm-euclidean-coordinate'),
      depthPlane: rect('.mm-depth-plane'),
      buttons,
      activeCards,
      visibleInactiveCards
    };
  });
}

function evaluateMetrics(viewport, state, data) {
  const tolerance = 1.5;
  if (data.architecture !== 'active') recordFinding('ARCHITECTURE_NOT_ACTIVE', viewport.id, { state, value: data.architecture });
  if (data.scrollWidth > viewport.width + tolerance) recordFinding('HORIZONTAL_OVERFLOW', viewport.id, { state, scrollWidth: data.scrollWidth, viewportWidth: viewport.width });
  if (data.activeCards !== 1) recordFinding('ACTIVE_CARD_CARDINALITY_INVALID', viewport.id, { state, count: data.activeCards });
  if (data.visibleInactiveCards !== 0) recordFinding('NEIGHBOR_CARD_VISUAL_COMPETITION', viewport.id, { state, count: data.visibleInactiveCards });
  for (const key of ['stage', 'title', 'family', 'cameraControls', 'card', 'lens', 'coordinatePanel']) {
    const box = data[key];
    if (!box) {
      recordFinding('REQUIRED_SURFACE_MISSING', viewport.id, { state, surface: key });
      continue;
    }
    if (box.left < -tolerance || box.right > viewport.width + tolerance) {
      recordFinding('SURFACE_OUTSIDE_HORIZONTAL_SAFE_REGION', viewport.id, { state, surface: key, left: box.left, right: box.right, viewportWidth: viewport.width });
    }
  }
  const card = data.card;
  for (const [surface, box] of [['family', data.family], ['camera', data.cameraControls], ['lens', data.lens]]) {
    if (intersects(card, box)) recordFinding('CONTROL_CONTENT_OVERLAP', viewport.id, { state, surface });
  }
  if (data.title?.fontSize < 28) recordFinding('TITLE_BELOW_MINIMUM_LEGIBILITY', viewport.id, { state, fontSize: data.title.fontSize });
  for (const button of data.buttons) {
    if (button.disabled) continue;
    if (button.width < 44 || button.height < 44) recordFinding('TOUCH_TARGET_UNDERSIZED', viewport.id, { state, label: button.label, width: button.width, height: button.height });
    if (button.left < -tolerance || button.right > viewport.width + tolerance) recordFinding('CONTROL_OUTSIDE_SAFE_REGION', viewport.id, { state, label: button.label, left: button.left, right: button.right });
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

try {
  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
    await page.goto(ROUTE, { waitUntil: 'networkidle0', timeout: 30000 });
    await waitStable(page);

    const overview = await metrics(page);
    observations.push({ viewport: viewport.id, state: 'overview', metrics: overview });
    evaluateMetrics(viewport, 'overview', overview);
    await capture(page, viewport, 'overview');

    await page.click('[data-mm-camera="browse"]');
    await waitStable(page);
    const browse = await metrics(page);
    observations.push({ viewport: viewport.id, state: 'browse', metrics: browse });
    evaluateMetrics(viewport, 'browse', browse);
    if (overview.card?.transform === browse.card?.transform && overview.depthPlane?.opacity === browse.depthPlane?.opacity) {
      recordFinding('CAMERA_STATES_NOT_DISTINCT', viewport.id, { overviewTransform: overview.card?.transform, browseTransform: browse.card?.transform, overviewDepthOpacity: overview.depthPlane?.opacity, browseDepthOpacity: browse.depthPlane?.opacity });
    }
    await capture(page, viewport, 'browse');

    const familyButtons = await page.$$('[data-mm-family-tabs] .mm-family-tab');
    if (familyButtons[3]) await familyButtons[3].click();
    await waitStable(page);
    await page.click('[data-mm-lens-tab="evidence"]');
    await waitStable(page);
    const dense = await metrics(page);
    observations.push({ viewport: viewport.id, state: 'method-evidence', metrics: dense });
    evaluateMetrics(viewport, 'method-evidence', dense);
    await capture(page, viewport, 'method-evidence');

    const origin = await page.evaluate(() => ({
      x: document.querySelector('[data-mm-showroom]')?.dataset.mmX,
      y: document.querySelector('[data-mm-showroom]')?.dataset.mmY,
      z: document.querySelector('[data-mm-showroom]')?.dataset.mmZ,
      camera: document.body.dataset.mmCamera
    }));
    await page.click('.mm-model-card[data-mm-x-position="active"] .mm-inspect');
    await page.waitForFunction(() => document.querySelector('[data-mm-dialog]')?.open === true, { timeout: 5000 });
    await capture(page, viewport, 'inspection');
    await page.click('[data-mm-dialog-close]');
    await page.waitForFunction(() => document.querySelector('[data-mm-dialog]')?.open !== true, { timeout: 5000 });
    await waitStable(page);
    const restored = await page.evaluate(() => ({
      x: document.querySelector('[data-mm-showroom]')?.dataset.mmX,
      y: document.querySelector('[data-mm-showroom]')?.dataset.mmY,
      z: document.querySelector('[data-mm-showroom]')?.dataset.mmZ,
      camera: document.body.dataset.mmCamera
    }));
    if (JSON.stringify(origin) !== JSON.stringify(restored)) recordFinding('INSPECTION_RETURN_STATE_MISMATCH', viewport.id, { origin, restored });

    const beforeTouch = await page.evaluate(() => document.querySelector('[data-mm-showroom]')?.dataset.mmX);
    await page.evaluate(() => {
      const deck = document.querySelector('[data-mm-model-deck]');
      const r = deck.getBoundingClientRect();
      const common = { bubbles: true, cancelable: true, pointerId: 77, pointerType: 'touch', isPrimary: true };
      deck.dispatchEvent(new PointerEvent('pointerdown', { ...common, clientX: r.right - 60, clientY: r.top + r.height / 2 }));
      deck.dispatchEvent(new PointerEvent('pointerup', { ...common, clientX: r.left + 60, clientY: r.top + r.height / 2 }));
    });
    await waitStable(page);
    const afterTouch = await page.evaluate(() => document.querySelector('[data-mm-showroom]')?.dataset.mmX);
    if (beforeTouch === afterTouch) recordFinding('TOUCH_X_TRANSITION_FAILED', viewport.id, { beforeTouch, afterTouch });

    await page.close();
  }

  const reducedPage = await browser.newPage();
  await reducedPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await reducedPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await reducedPage.goto(ROUTE, { waitUntil: 'networkidle0', timeout: 30000 });
  await waitStable(reducedPage);
  await capture(reducedPage, { id: 'REDUCED_MOTION', width: 390, height: 844 }, 'stable');
  await reducedPage.close();

  const staticPage = await browser.newPage();
  await staticPage.setJavaScriptEnabled(false);
  await staticPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await staticPage.goto(`${ROUTE}static-model-catalog.html`, { waitUntil: 'networkidle0', timeout: 30000 });
  const staticCount = await staticPage.$$eval('article', nodes => nodes.length);
  if (staticCount !== 25) recordFinding('NO_SCRIPT_MODEL_ACCESS_INCOMPLETE', 'STATIC_CATALOG', { expected: 25, observed: staticCount });
  await capture(staticPage, { id: 'NO_SCRIPT', width: 390, height: 844 }, 'catalog');
  await staticPage.close();
} finally {
  await browser.close();
}

const criticalCodes = new Set([
  'ARCHITECTURE_NOT_ACTIVE',
  'HORIZONTAL_OVERFLOW',
  'ACTIVE_CARD_CARDINALITY_INVALID',
  'NEIGHBOR_CARD_VISUAL_COMPETITION',
  'SURFACE_OUTSIDE_HORIZONTAL_SAFE_REGION',
  'CONTROL_CONTENT_OVERLAP',
  'TOUCH_TARGET_UNDERSIZED',
  'CONTROL_OUTSIDE_SAFE_REGION',
  'CAMERA_STATES_NOT_DISTINCT',
  'INSPECTION_RETURN_STATE_MISMATCH',
  'TOUCH_X_TRANSITION_FAILED',
  'NO_SCRIPT_MODEL_ACCESS_INCOMPLETE'
]);
const criticalFindings = findings.filter(item => criticalCodes.has(item.code));
const result = {
  contract: CONTRACT,
  candidateHead: CANDIDATE_HEAD,
  route: ROUTE,
  viewportCount: viewports.length,
  screenshotCount: screenshots.length,
  observationCount: observations.length,
  findings,
  criticalFindingCount: criticalFindings.length,
  disposition: criticalFindings.length === 0 ? 'PASS_WORTH_FULL_INSTRUMENT_VERIFICATION' : 'FAIL_REQUIRES_PROTOTYPE_REMEDIATION',
  observations,
  screenshots
};
fs.writeFileSync(path.join(OUT_DIR, 'risk-review-result.json'), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'screenshot-manifest.json'), JSON.stringify(screenshots, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'findings.json'), JSON.stringify(findings, null, 2));
console.log(JSON.stringify({ disposition: result.disposition, criticalFindingCount: result.criticalFindingCount, screenshotCount: result.screenshotCount }, null, 2));
if (criticalFindings.length) process.exitCode = 1;
