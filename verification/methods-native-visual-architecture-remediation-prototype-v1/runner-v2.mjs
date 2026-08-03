import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';

const CONTRACT = 'METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_v1';
const BASE_HEAD = '66a2105e96e84c5b482f783010779f87a90a28ee';
const HEAD = process.env.CANDIDATE_HEAD || process.env.GITHUB_SHA || 'UNKNOWN';
const CHROME = process.env.CHROME_PATH;
const ORIGIN = process.env.METHODS_MODELS_ORIGIN || 'http://127.0.0.1:4173';
const ROUTE = `${ORIGIN}/laws/research/methods-and-models/`;
const OUT = path.resolve(process.env.PROTOTYPE_OUT_DIR || 'methods-native-visual-architecture-remediation-prototype-v1-evidence');
const SHOTS = path.join(OUT, 'screenshots');
const HERE = path.dirname(new URL(import.meta.url).pathname);
if (!CHROME) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SHOTS, { recursive: true });

const viewports = {
  PHONE_360: { width: 360, height: 800, safe: 12 },
  PHONE_430: { width: 430, height: 932, safe: 12 },
  TABLET_768: { width: 768, height: 1024, safe: 16 },
  SHORT_1180: { width: 1180, height: 820, safe: 16 },
  DESKTOP_1440: { width: 1440, height: 1000, safe: 20 }
};
const families = [
  { id: 'structure', models: ['envelope-451', 'gate-448', 'spine-minimum', 'collapse-qualified', 'membrane-61', 'anchors-9'] },
  { id: 'pressure', models: ['pressure-field', 'capacity-field', 'pcr', 'stability', 'hazard', 'complement', 'zero-aware'] },
  { id: 'closure', models: ['mass-ledger', 'residual-u', 'closure-threshold', 'energy-loop', 'useful-output'] },
  { id: 'method', models: ['first', 'integral-method', 'diagnostic-five', 'abcd', 'falsification', 'no-match', 'fixtures'] }
];
const lenses = ['practical', 'engineering', 'evidence'];
const risks = [
  ['PHONE_360_OVERVIEW_BASE', 'PHONE_360', 0, 0, 0, 'OVERVIEW'],
  ['PHONE_360_BROWSE_BASE', 'PHONE_360', 0, 0, 0, 'BROWSE'],
  ['PHONE_430_OVERVIEW_LONG_FAMILY', 'PHONE_430', 3, 0, 0, 'OVERVIEW'],
  ['PHONE_430_BROWSE_LONG_MODEL', 'PHONE_430', 1, 3, 2, 'BROWSE'],
  ['TABLET_768_OVERVIEW_DENSE', 'TABLET_768', 1, 6, 2, 'OVERVIEW'],
  ['TABLET_768_BROWSE_DENSE', 'TABLET_768', 1, 6, 2, 'BROWSE'],
  ['SHORT_1180_OVERVIEW_HEIGHT', 'SHORT_1180', 0, 1, 0, 'OVERVIEW'],
  ['SHORT_1180_BROWSE_HEIGHT', 'SHORT_1180', 0, 1, 0, 'BROWSE'],
  ['DESKTOP_1440_OVERVIEW_LABELS', 'DESKTOP_1440', 3, 0, 2, 'OVERVIEW'],
  ['DESKTOP_1440_BROWSE_LABELS', 'DESKTOP_1440', 3, 0, 2, 'BROWSE']
];
const results = [];
const screenshots = [];
const inspections = [];
const pairs = new Map();
const browserErrors = [];

const json = (name, value) => fs.writeFileSync(path.join(OUT, name), `${JSON.stringify(value, null, 2)}\n`);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const overlap = (a, b) => !a || !b ? 0 : Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });

async function stable(page, ms = 650) {
  await sleep(ms);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function openPage(viewportId) {
  const viewport = viewports[viewportId];
  const page = await browser.newPage();
  page.on('pageerror', error => browserErrors.push({ viewportId, type: 'pageerror', message: String(error) }));
  page.on('console', message => { if (message.type() === 'error') browserErrors.push({ viewportId, type: 'console', message: message.text() }); });
  await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: viewport.width <= 430, hasTouch: viewport.width <= 768 });
  await page.setCacheEnabled(false);
  const response = await page.goto(ROUTE, { waitUntil: 'networkidle0', timeout: 45000 });
  const status = response?.status() ?? 0;
  if (status < 200 || status >= 400) throw new Error(`ROUTE_LOAD_FAILED:${viewportId}:${status}`);
  await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]', { timeout: 15000 });
  await page.addStyleTag({ path: path.join(HERE, 'prototype.css') });
  await page.addScriptTag({ path: path.join(HERE, 'prototype.js') });
  await page.waitForSelector('html[data-methods-native-visual-prototype="active"]', { timeout: 5000 });
  await stable(page);
  return page;
}

async function indices(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    const familyButtons = [...document.querySelectorAll('.mm-family-tab')];
    const cards = [...document.querySelectorAll('.mm-model-card')];
    const lensButtons = [...document.querySelectorAll('[data-mm-lens-tab]')];
    return {
      x: cards.findIndex(card => card.dataset.position === 'active' || card.dataset.mmXPosition === 'active'),
      y: lensButtons.findIndex(button => button.getAttribute('aria-selected') === 'true'),
      z: familyButtons.findIndex(button => button.getAttribute('aria-selected') === 'true'),
      rootX: Number(root?.dataset.mmX), rootY: Number(root?.dataset.mmY), rootZ: Number(root?.dataset.mmZ),
      family: root?.dataset.mmFamily, model: root?.dataset.mmModel,
      lens: lensButtons.find(button => button.getAttribute('aria-selected') === 'true')?.dataset.mmLensTab
    };
  });
}

async function coordinate(page, z, x, y) {
  await page.evaluate(index => [...document.querySelectorAll('.mm-family-tab')][index]?.click(), z);
  await stable(page);
  for (let guard = 0; guard < families[z].models.length + 2; guard += 1) {
    const state = await indices(page);
    if (state.x === x) break;
    const count = families[z].models.length;
    const forward = (x - state.x + count) % count;
    const backward = (state.x - x + count) % count;
    await page.click(forward <= backward ? '[data-mm-next]' : '[data-mm-previous]');
    await stable(page);
  }
  await page.evaluate(index => [...document.querySelectorAll('[data-mm-lens-tab]')][index]?.click(), y);
  await stable(page);
  const observed = await indices(page);
  const expected = { x, y, z, family: families[z].id, model: families[z].models[x], lens: lenses[y] };
  const reached = observed.x === x && observed.y === y && observed.z === z && observed.rootX === x && observed.rootY === y && observed.rootZ === z && observed.family === expected.family && observed.model === expected.model && observed.lens === expected.lens;
  return { reached, expected, observed };
}

async function camera(page, requested) {
  const changed = await page.evaluate(value => globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V1?.setCamera(value, 'phase-2a-runner'), requested);
  await stable(page, 250);
  const observed = await page.$eval('[data-mm-showroom]', root => root.dataset.mmCamera);
  return { requested, observed, changed: Boolean(changed), reached: requested === observed };
}

async function snapshot(page, viewportId) {
  return page.evaluate(({ viewportId, safe }) => {
    const rect = element => {
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };
    const intersectsViewport = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const r = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.02 && r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
    };
    const active = [...document.querySelectorAll('.mm-model-card')].find(card => card.dataset.position === 'active' || card.dataset.mmXPosition === 'active');
    const surfaces = {
      header: document.querySelector('.mm-stage__header'), camera: document.querySelector('[data-mvr-camera-controls]'), families: document.querySelector('.mm-family-tabs'),
      instrument: document.querySelector('.mm-instrument'), active, lens: document.querySelector('.mm-lens'), coordinate: document.querySelector('.mm-euclidean-coordinate')
    };
    const controls = [...document.querySelectorAll('.mm-stage button')].filter(intersectsViewport).map(element => ({
      label: element.getAttribute('aria-label') || element.textContent.trim(), rect: rect(element), fontSize: parseFloat(getComputedStyle(element).fontSize)
    }));
    const labels = [document.querySelector('[data-mm-family-title]'), document.querySelector('.mm-stage__question'), active?.querySelector('.mm-model-card__statement'), active?.querySelector('.mm-equation'), document.querySelector('.mm-lens-panel')]
      .filter(intersectsViewport).map(element => ({ text: element.textContent.replace(/\s+/g, ' ').trim(), rect: rect(element), fontSize: parseFloat(getComputedStyle(element).fontSize) }));
    return {
      viewportId, viewport: { width: innerWidth, height: innerHeight }, safeRect: { left: safe, top: safe, right: innerWidth - safe, bottom: innerHeight - safe },
      surfaces: Object.fromEntries(Object.entries(surfaces).map(([key, value]) => [key, rect(value)])), controls, labels,
      scrollWidth: document.documentElement.scrollWidth, visibleInactiveCards: [...document.querySelectorAll('.mm-model-card')].filter(card => card !== active && intersectsViewport(card)).length,
      activeTransform: getComputedStyle(active).transform, camera: document.querySelector('[data-mm-showroom]')?.dataset.mmCamera
    };
  }, { viewportId, safe: viewports[viewportId].safe });
}

function failuresFor(s) {
  const failures = [];
  const outside = r => !r || r.left < s.safeRect.left - 2 || r.top < s.safeRect.top - 2 || r.right > s.safeRect.right + 2 || r.bottom > s.safeRect.bottom + 2;
  for (const [name, r] of Object.entries(s.surfaces)) {
    if (!r || r.width <= 0 || r.height <= 0) failures.push(`MISSING:${name}`);
    else if (outside(r)) failures.push(`OUTSIDE_SAFE_REGION:${name}`);
  }
  if (s.scrollWidth > s.viewport.width + 1) failures.push(`HORIZONTAL_OVERFLOW:${s.scrollWidth - s.viewport.width}`);
  if (s.visibleInactiveCards) failures.push(`NEIGHBOR_INTRUSION:${s.visibleInactiveCards}`);
  for (const name of ['camera', 'families', 'lens']) if (overlap(s.surfaces.active, s.surfaces[name]) > 1) failures.push(`ACTIVE_OVERLAP:${name}`);
  for (const control of s.controls) {
    if (outside(control.rect)) failures.push(`CONTROL_OUTSIDE:${control.label}`);
    if (s.viewport.width <= 768 && (control.rect.width < 43.5 || control.rect.height < 43.5)) failures.push(`TOUCH_TARGET:${control.label}:${control.rect.width}x${control.rect.height}`);
    if (control.fontSize < 11) failures.push(`CONTROL_TEXT:${control.label}:${control.fontSize}`);
  }
  for (const label of s.labels) {
    if (outside(label.rect)) failures.push(`LABEL_OUTSIDE:${label.text.slice(0, 32)}`);
    if (label.fontSize < 12) failures.push(`LABEL_TEXT:${label.fontSize}:${label.text.slice(0, 32)}`);
  }
  return [...new Set(failures)];
}

async function capture([id, viewportId, z, x, y, cameraId]) {
  const page = await openPage(viewportId);
  const state = await coordinate(page, z, x, y);
  const cameraState = await camera(page, cameraId);
  const geometry = await snapshot(page, viewportId);
  const failures = [...(!state.reached ? ['COORDINATE_NOT_REACHED'] : []), ...(!cameraState.reached ? ['CAMERA_NOT_REACHED'] : []), ...failuresFor(geometry)];
  const filename = `${HEAD.slice(0, 12)}__${id}.png`;
  const file = path.join(SHOTS, filename);
  await page.screenshot({ path: file, fullPage: false });
  const record = { id, viewportId, coordinate: state, camera: cameraState, geometry, failures, screenshot: `screenshots/${filename}`, sha256: hash(file) };
  results.push(record);
  screenshots.push({ id, file: record.screenshot, sha256: record.sha256, failures });
  const key = `${viewportId}:${z}:${x}:${y}`;
  if (!pairs.has(key)) pairs.set(key, {});
  pairs.get(key)[cameraId] = geometry;
  await page.close();
}

async function inspection(viewportId, z, x, y) {
  const page = await openPage(viewportId);
  const state = await coordinate(page, z, x, y);
  await camera(page, 'BROWSE');
  const selector = '.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]';
  await page.focus(selector);
  const read = () => page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    return { x: Number(root.dataset.mmX), y: Number(root.dataset.mmY), z: Number(root.dataset.mmZ), camera: root.dataset.mmCamera, scrollX, scrollY, focus: document.activeElement?.getAttribute('data-mm-inspect') || '' };
  });
  const before = await read();
  await page.click(selector);
  await page.waitForSelector('dialog[open]', { timeout: 5000 });
  const openFile = `${HEAD.slice(0, 12)}__${viewportId}__INSPECTION.png`;
  await page.screenshot({ path: path.join(SHOTS, openFile), fullPage: false });
  await page.click('[data-mm-dialog-close]');
  await page.waitForFunction(() => !document.querySelector('dialog')?.open, { timeout: 5000 });
  await stable(page, 250);
  const after = await read();
  const returnFile = `${HEAD.slice(0, 12)}__${viewportId}__RETURN.png`;
  await page.screenshot({ path: path.join(SHOTS, returnFile), fullPage: false });
  const exact = state.reached && JSON.stringify(before) === JSON.stringify(after);
  inspections.push({ viewportId, state, before, after, exact, inspectionScreenshot: `screenshots/${openFile}`, returnScreenshot: `screenshots/${returnFile}` });
  for (const [suffix, file] of [['INSPECTION', openFile], ['RETURN', returnFile]]) screenshots.push({ id: `${viewportId}_${suffix}`, file: `screenshots/${file}`, sha256: hash(path.join(SHOTS, file)), failures: exact ? [] : ['INSPECTION_RETURN_REGRESSION'] });
  await page.close();
}

let fatal = null;
try {
  for (const risk of risks) await capture(risk);
  await inspection('PHONE_360', 1, 3, 0);
  await inspection('DESKTOP_1440', 2, 3, 1);
} catch (error) {
  fatal = { message: String(error), stack: error?.stack || null };
} finally {
  await browser.close();
}

const differentiation = [];
for (const [key, states] of pairs) {
  if (!states.OVERVIEW || !states.BROWSE) continue;
  const a = states.OVERVIEW.surfaces.active;
  const b = states.BROWSE.surfaces.active;
  const dimensions = { width: Math.abs(a.width - b.width), height: Math.abs(a.height - b.height), top: Math.abs(a.top - b.top), transform: states.OVERVIEW.activeTransform !== states.BROWSE.activeTransform };
  const count = [dimensions.width > 16, dimensions.height > 16, dimensions.top > 12, dimensions.transform].filter(Boolean).length;
  differentiation.push({ key, dimensions, materiallyDistinctDimensions: count, pass: count >= 2 });
}
const failures = results.flatMap(result => result.failures.map(failure => ({ id: result.id, failure })));
if (inspections.some(value => !value.exact)) failures.push({ id: 'INSPECTION_RETURN', failure: 'PROTECTED_SUBSYSTEM_REGRESSION' });
if (differentiation.length < 3 || differentiation.some(value => !value.pass)) failures.push({ id: 'CAMERA', failure: 'OVERVIEW_BROWSE_NOT_MATERIALLY_DISTINCT' });
if (browserErrors.length) failures.push({ id: 'BROWSER', failure: `BROWSER_ERRORS:${browserErrors.length}` });
if (fatal) failures.push({ id: 'EXECUTION', failure: fatal.message });
const disposition = fatal ? 'HARNESS_EXECUTION_FAILED' : failures.length ? 'PROTOTYPE_REQUIRES_ITERATION' : 'AUTOMATED_RISK_SET_PASS_AWAITING_INTERNAL_PERCEPTUAL_REVIEW';
const summary = {
  contract: CONTRACT, phase: 'PHASE_2A_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_AND_RISK_SET_REVIEW', exactBaseHead: BASE_HEAD, exactCandidateHead: HEAD,
  publicMethodsMutation: false, full1575StateRunExecuted: false, riskViewsRequired: risks.length, riskViewsCompleted: results.length,
  screenshotCount: screenshots.length, inspectionReturnPasses: inspections.filter(value => value.exact).length, inspectionReturnCases: inspections.length,
  cameraPairPasses: differentiation.filter(value => value.pass).length, cameraPairs: differentiation.length, failureCount: failures.length,
  automatedDisposition: disposition, fatal, failures, browserErrors
};
json('prototype-execution-summary.json', summary);
json('representative-risk-results.json', { contract: CONTRACT, results });
json('risk-screenshot-manifest.json', { contract: CONTRACT, exactCandidateHead: HEAD, screenshots });
json('overview-browse-differentiation.json', { contract: CONTRACT, differentiation });
json('inspection-return-regression.json', { contract: CONTRACT, inspections });
json('internal-perceptual-review.template.json', { contract: CONTRACT, exactCandidateHead: HEAD, reviewer: null, reviewedScreenshots: screenshots.map(value => value.file), disposition: 'PENDING_INTERNAL_PERCEPTUAL_REVIEW', permittedDispositions: ['MATERIALLY_COHERENT_AND_WORTH_FULL_VERIFICATION', 'PROTOTYPE_REQUIRES_ITERATION'] });
fs.writeFileSync(path.join(OUT, 'responsive-composition-explanation.md'), '# Responsive composition explanation\n\nThis isolated browser-session prototype reserves separate regions for the stage heading, native camera controls, family controls, active-model reading surface, lens panel, and coordinate footer. Inactive model cards are excluded from the visible field. Overview presents more context and a reduced active surface; Browse expands the active surface and suppresses competing context. Mobile and tablet controls target a minimum 44-pixel interaction region. Public Methods files remain unchanged.\n');
console.log(JSON.stringify(summary, null, 2));
if (fatal) process.exitCode = 1;
