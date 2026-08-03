import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';

const CONTRACT = 'METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_v1';
const BASE_HEAD = '66a2105e96e84c5b482f783010779f87a90a28ee';
const ORIGIN = process.env.METHODS_MODELS_ORIGIN || 'http://127.0.0.1:4173';
const ROUTE = `${ORIGIN}/laws/research/methods-and-models/`;
const CHROME_PATH = process.env.CHROME_PATH;
const CANDIDATE_HEAD = process.env.CANDIDATE_HEAD || process.env.GITHUB_SHA || 'UNKNOWN';
const OUT_DIR = path.resolve(process.env.PROTOTYPE_OUT_DIR || 'methods-native-visual-architecture-remediation-prototype-v1-evidence');
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const HERE = path.dirname(new URL(import.meta.url).pathname);
const CSS_PATH = path.join(HERE, 'prototype.css');
const JS_PATH = path.join(HERE, 'prototype.js');
if (!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const VIEWPORTS = [
  { id: 'PHONE_360', width: 360, height: 800, safe: 12 },
  { id: 'PHONE_430', width: 430, height: 932, safe: 12 },
  { id: 'TABLET_768', width: 768, height: 1024, safe: 16 },
  { id: 'SHORT_DESKTOP_1180', width: 1180, height: 820, safe: 16 },
  { id: 'DESKTOP_1440', width: 1440, height: 1000, safe: 20 }
];
const FAMILIES = [
  { pageId: 'structure', models: ['envelope-451', 'gate-448', 'spine-minimum', 'collapse-qualified', 'membrane-61', 'anchors-9'] },
  { pageId: 'pressure', models: ['pressure-field', 'capacity-field', 'pcr', 'stability', 'hazard', 'complement', 'zero-aware'] },
  { pageId: 'closure', models: ['mass-ledger', 'residual-u', 'closure-threshold', 'energy-loop', 'useful-output'] },
  { pageId: 'method', models: ['first', 'integral-method', 'diagnostic-five', 'abcd', 'falsification', 'no-match', 'fixtures'] }
];
const LENSES = ['practical', 'engineering', 'evidence'];
const RISKS = [
  { id: 'PHONE_360_OVERVIEW_BASE', viewport: 'PHONE_360', z: 0, x: 0, y: 0, camera: 'OVERVIEW' },
  { id: 'PHONE_360_BROWSE_BASE', viewport: 'PHONE_360', z: 0, x: 0, y: 0, camera: 'BROWSE' },
  { id: 'PHONE_430_OVERVIEW_LONG_FAMILY', viewport: 'PHONE_430', z: 3, x: 0, y: 0, camera: 'OVERVIEW' },
  { id: 'PHONE_430_BROWSE_LONG_MODEL', viewport: 'PHONE_430', z: 1, x: 3, y: 2, camera: 'BROWSE' },
  { id: 'TABLET_768_OVERVIEW_DENSE_FAMILY', viewport: 'TABLET_768', z: 1, x: 6, y: 2, camera: 'OVERVIEW' },
  { id: 'TABLET_768_BROWSE_DENSE_FAMILY', viewport: 'TABLET_768', z: 1, x: 6, y: 2, camera: 'BROWSE' },
  { id: 'SHORT_1180_OVERVIEW_HEIGHT_RISK', viewport: 'SHORT_DESKTOP_1180', z: 0, x: 1, y: 0, camera: 'OVERVIEW' },
  { id: 'SHORT_1180_BROWSE_HEIGHT_RISK', viewport: 'SHORT_DESKTOP_1180', z: 0, x: 1, y: 0, camera: 'BROWSE' },
  { id: 'DESKTOP_1440_OVERVIEW_LONG_LABELS', viewport: 'DESKTOP_1440', z: 3, x: 0, y: 2, camera: 'OVERVIEW' },
  { id: 'DESKTOP_1440_BROWSE_LONG_LABELS', viewport: 'DESKTOP_1440', z: 3, x: 0, y: 2, camera: 'BROWSE' }
];

const results = [];
const screenshots = [];
const cameraPairs = {};
const inspectionReturns = [];
const executionErrors = [];
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function writeJson(name, value) { fs.writeFileSync(path.join(OUT_DIR, name), `${JSON.stringify(value, null, 2)}\n`); }
function safeName(value) { return value.replace(/[^A-Za-z0-9_.-]+/g, '_'); }
function rectOutside(rect, safeRect, tolerance = 1) { return !rect || rect.left < safeRect.left - tolerance || rect.top < safeRect.top - tolerance || rect.right > safeRect.right + tolerance || rect.bottom > safeRect.bottom + tolerance; }
function intersection(a, b) { return !a || !b ? 0 : Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)); }

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
async function waitStable(page, ms = 700) {
  await new Promise(resolve => setTimeout(resolve, ms));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function makePage(viewport, { reducedMotion = false } = {}) {
  const page = await browser.newPage();
  page.on('pageerror', error => executionErrors.push({ viewport: viewport.id, error: String(error) }));
  page.on('console', message => { if (message.type() === 'error') executionErrors.push({ viewport: viewport.id, console: message.text() }); });
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1, isMobile: viewport.width <= 430, hasTouch: viewport.width <= 768 });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const response = await page.goto(ROUTE, { waitUntil: 'networkidle0', timeout: 45000 });
  if (!response?.ok()) throw new Error(`ROUTE_LOAD_FAILED:${viewport.id}:${response?.status()}`);
  await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]', { timeout: 15000 });
  await page.addStyleTag({ path: CSS_PATH });
  await page.addScriptTag({ path: JS_PATH });
  await page.waitForSelector('html[data-methods-native-visual-prototype="active"]', { timeout: 5000 });
  await waitStable(page);
  return page;
}
async function activeIndex(page, axis) {
  if (axis === 'z') return page.$$eval('.mm-family-tab', elements => elements.findIndex(element => element.getAttribute('aria-selected') === 'true'));
  if (axis === 'y') return page.$$eval('[data-mm-lens-tab]', elements => elements.findIndex(element => element.getAttribute('aria-selected') === 'true'));
  return page.$$eval('.mm-model-card', elements => elements.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active'));
}
async function setCoordinate(page, z, x, y) {
  await page.evaluate(index => [...document.querySelectorAll('.mm-family-tab')][index]?.click(), z);
  await waitStable(page);
  let current = await activeIndex(page, 'x');
  let guard = 0;
  while (current !== x && guard < FAMILIES[z].models.length + 2) {
    const count = FAMILIES[z].models.length;
    const forward = (x - current + count) % count;
    const backward = (current - x + count) % count;
    await page.click(forward <= backward ? '[data-mm-next]' : '[data-mm-previous]');
    await waitStable(page);
    current = await activeIndex(page, 'x');
    guard += 1;
  }
  await page.evaluate(index => [...document.querySelectorAll('[data-mm-lens-tab]')][index]?.click(), y);
  await waitStable(page);
  const state = await page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    const families = [...document.querySelectorAll('.mm-family-tab')];
    const models = [...document.querySelectorAll('.mm-model-card')];
    const lenses = [...document.querySelectorAll('[data-mm-lens-tab]')];
    return {
      x: models.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active'),
      y: lenses.findIndex(element => element.getAttribute('aria-selected') === 'true'),
      z: families.findIndex(element => element.getAttribute('aria-selected') === 'true'),
      rootX: Number(root?.dataset.mmX), rootY: Number(root?.dataset.mmY), rootZ: Number(root?.dataset.mmZ),
      family: root?.dataset.mmFamily, model: root?.dataset.mmModel, lens: lenses.find(element => element.getAttribute('aria-selected') === 'true')?.dataset.mmLensTab
    };
  });
  const expected = { x, y, z, family: FAMILIES[z].pageId, model: FAMILIES[z].models[x], lens: LENSES[y] };
  const reached = state.x === x && state.y === y && state.z === z && state.rootX === x && state.rootY === y && state.rootZ === z && state.family === expected.family && state.model === expected.model && state.lens === expected.lens;
  return { reached, expected, observed: state };
}
async function setCamera(page, camera) {
  const changed = await page.evaluate(value => globalThis.METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_V1?.setCamera(value, 'risk-runner'), camera);
  await waitStable(page, 250);
  const observed = await page.$eval('[data-mm-showroom]', root => root.dataset.mmCamera);
  return { changed: Boolean(changed), requested: camera, observed, reached: observed === camera };
}
async function geometry(page, viewport) {
  return page.evaluate(({ safe }) => {
    const rect = element => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
    };
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const value = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.02 && value.width > 0 && value.height > 0;
    };
    const activeCard = [...document.querySelectorAll('.mm-model-card')].find(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active');
    const required = {
      stage: document.querySelector('.mm-stage'), header: document.querySelector('.mm-stage__header'), cameraControls: document.querySelector('[data-mvr-camera-controls]'),
      familyTabs: document.querySelector('.mm-family-tabs'), instrument: document.querySelector('.mm-instrument'), activeCard,
      lens: document.querySelector('.mm-lens'), coordinate: document.querySelector('.mm-euclidean-coordinate')
    };
    const requiredRects = Object.fromEntries(Object.entries(required).map(([key, element]) => [key, rect(element)]));
    const controls = [...document.querySelectorAll('.mm-stage button')].filter(visible).map(element => ({
      label: element.getAttribute('aria-label') || element.textContent.trim(), rect: rect(element), fontSize: parseFloat(getComputedStyle(element).fontSize)
    }));
    const labels = [document.querySelector('[data-mm-family-title]'), document.querySelector('.mm-stage__question'), activeCard?.querySelector('.mm-model-card__statement'), activeCard?.querySelector('.mm-equation'), document.querySelector('.mm-lens-panel')]
      .filter(visible).map(element => ({ text: element.textContent.replace(/\s+/g, ' ').trim(), rect: rect(element), fontSize: parseFloat(getComputedStyle(element).fontSize) }));
    return {
      camera: document.querySelector('[data-mm-showroom]')?.dataset.mmCamera, requiredRects, controls, labels,
      safeRect: { left: safe, top: safe, right: innerWidth - safe, bottom: innerHeight - safe },
      viewport: { width: innerWidth, height: innerHeight }, scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      activeCardTransform: getComputedStyle(activeCard).transform, activeCardOverflow: getComputedStyle(activeCard).overflow,
      visibleInactiveCards: [...document.querySelectorAll('.mm-model-card')].filter(element => element !== activeCard && visible(element)).length
    };
  }, { safe: viewport.safe });
}
function evaluateGeometry(snapshot, viewport) {
  const failures = [];
  const safe = snapshot.safeRect;
  for (const [name, rect] of Object.entries(snapshot.requiredRects)) {
    if (name === 'stage') continue;
    if (!rect || rect.width <= 0 || rect.height <= 0) failures.push(`REQUIRED_SURFACE_MISSING:${name}`);
    else if (rectOutside(rect, safe, 2)) failures.push(`OUTSIDE_SAFE_REGION:${name}`);
  }
  if (snapshot.scroll.width > viewport.width + 1) failures.push(`HORIZONTAL_OVERFLOW:${snapshot.scroll.width - viewport.width}`);
  if (snapshot.visibleInactiveCards !== 0) failures.push(`NEIGHBOR_INTRUSION:${snapshot.visibleInactiveCards}`);
  const active = snapshot.requiredRects.activeCard;
  for (const name of ['cameraControls', 'familyTabs', 'lens']) if (intersection(active, snapshot.requiredRects[name]) > 1) failures.push(`ACTIVE_CARD_OVERLAP:${name}`);
  for (const control of snapshot.controls) {
    if (rectOutside(control.rect, safe, 2)) failures.push(`CONTROL_OUTSIDE_SAFE_REGION:${control.label}`);
    if (viewport.width <= 768 && (control.rect.width < 43.5 || control.rect.height < 43.5)) failures.push(`TOUCH_TARGET_UNDERSIZED:${control.label}:${control.rect.width}x${control.rect.height}`);
    if (control.fontSize < 11) failures.push(`CONTROL_TEXT_UNDERSIZED:${control.label}:${control.fontSize}`);
  }
  for (const label of snapshot.labels) {
    if (rectOutside(label.rect, safe, 2)) failures.push(`LABEL_OUTSIDE_SAFE_REGION:${label.text.slice(0, 40)}`);
    if (label.fontSize < 12) failures.push(`LABEL_TEXT_UNDERSIZED:${label.fontSize}:${label.text.slice(0, 40)}`);
  }
  return failures;
}
async function captureRisk(risk) {
  const viewport = VIEWPORTS.find(value => value.id === risk.viewport);
  const page = await makePage(viewport);
  const coordinate = await setCoordinate(page, risk.z, risk.x, risk.y);
  const camera = await setCamera(page, risk.camera);
  const snapshot = await geometry(page, viewport);
  const failures = [...(!coordinate.reached ? ['COORDINATE_NOT_REACHED'] : []), ...(!camera.reached ? ['CAMERA_NOT_REACHED'] : []), ...evaluateGeometry(snapshot, viewport)];
  const filename = `${safeName(CANDIDATE_HEAD.slice(0, 12))}__${risk.id}.png`;
  const target = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: target, fullPage: false });
  const record = { risk, coordinate, camera, geometry: snapshot, failures, screenshot: `screenshots/${filename}`, sha256: sha256(target) };
  results.push(record);
  screenshots.push({ risk_id: risk.id, viewport, camera: risk.camera, coordinate: coordinate.expected, file: record.screenshot, sha256: record.sha256, failures });
  const pairKey = `${risk.viewport}:${risk.z}:${risk.x}:${risk.y}`;
  cameraPairs[pairKey] ??= {};
  cameraPairs[pairKey][risk.camera] = snapshot;
  await page.close();
}
async function testInspectionReturn(viewportId, z, x, y) {
  const viewport = VIEWPORTS.find(value => value.id === viewportId);
  const page = await makePage(viewport);
  const coordinate = await setCoordinate(page, z, x, y);
  await setCamera(page, 'BROWSE');
  const selector = '.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]';
  await page.focus(selector);
  const before = await page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    return { x: Number(root.dataset.mmX), y: Number(root.dataset.mmY), z: Number(root.dataset.mmZ), camera: root.dataset.mmCamera, scrollX, scrollY, focus: document.activeElement?.getAttribute('data-mm-inspect') || '' };
  });
  await page.click(selector);
  await page.waitForSelector('dialog[open]', { timeout: 5000 });
  const opened = await page.evaluate(() => ({ dialogOpen: Boolean(document.querySelector('dialog')?.open), bodyFixed: getComputedStyle(document.body).position === 'fixed', supportInert: Boolean(document.querySelector('.mm-support')?.inert), closePresent: Boolean(document.querySelector('[data-mm-dialog-close]')) }));
  const openFile = `${safeName(CANDIDATE_HEAD.slice(0, 12))}__${viewportId}__INSPECTION.png`;
  const openTarget = path.join(SCREENSHOT_DIR, openFile);
  await page.screenshot({ path: openTarget, fullPage: false });
  await page.click('[data-mm-dialog-close]');
  await page.waitForFunction(() => !document.querySelector('dialog')?.open, { timeout: 5000 });
  await waitStable(page, 250);
  const after = await page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    return { x: Number(root.dataset.mmX), y: Number(root.dataset.mmY), z: Number(root.dataset.mmZ), camera: root.dataset.mmCamera, scrollX, scrollY, focus: document.activeElement?.getAttribute('data-mm-inspect') || '' };
  });
  const returnFile = `${safeName(CANDIDATE_HEAD.slice(0, 12))}__${viewportId}__RETURN.png`;
  const returnTarget = path.join(SCREENSHOT_DIR, returnFile);
  await page.screenshot({ path: returnTarget, fullPage: false });
  const exact = coordinate.reached && opened.dialogOpen && opened.bodyFixed && opened.supportInert && opened.closePresent && JSON.stringify(before) === JSON.stringify(after);
  inspectionReturns.push({ viewport, coordinate, before, opened, after, exact, inspectionScreenshot: `screenshots/${openFile}`, returnScreenshot: `screenshots/${returnFile}` });
  screenshots.push({ risk_id: `${viewportId}_INSPECTION`, viewport, camera: 'BROWSE', coordinate: coordinate.expected, file: `screenshots/${openFile}`, sha256: sha256(openTarget), failures: exact ? [] : ['INSPECTION_RETURN_REGRESSION'] });
  screenshots.push({ risk_id: `${viewportId}_RETURN`, viewport, camera: 'BROWSE', coordinate: coordinate.expected, file: `screenshots/${returnFile}`, sha256: sha256(returnTarget), failures: exact ? [] : ['INSPECTION_RETURN_REGRESSION'] });
  await page.close();
}

try {
  for (const risk of RISKS) await captureRisk(risk);
  await testInspectionReturn('PHONE_360', 1, 3, 0);
  await testInspectionReturn('DESKTOP_1440', 2, 3, 1);
  const cameraDifferentiation = [];
  for (const [pair, states] of Object.entries(cameraPairs)) {
    if (!states.OVERVIEW || !states.BROWSE) continue;
    const o = states.OVERVIEW.requiredRects.activeCard;
    const b = states.BROWSE.requiredRects.activeCard;
    const dimensions = { active_card_width: Math.abs(o.width - b.width), active_card_height: Math.abs(o.height - b.height), active_card_top: Math.abs(o.top - b.top), transform: states.OVERVIEW.activeCardTransform !== states.BROWSE.activeCardTransform };
    const materiallyDistinctDimensions = [dimensions.active_card_width > 16, dimensions.active_card_height > 16, dimensions.active_card_top > 12, dimensions.transform].filter(Boolean).length;
    cameraDifferentiation.push({ pair, dimensions, materiallyDistinctDimensions, pass: materiallyDistinctDimensions >= 2 });
  }
  const failures = results.flatMap(result => result.failures.map(failure => ({ risk: result.risk.id, failure })));
  if (inspectionReturns.some(record => !record.exact)) failures.push({ risk: 'INSPECTION_RETURN', failure: 'PROTECTED_SUBSYSTEM_REGRESSION' });
  if (cameraDifferentiation.length < 3 || cameraDifferentiation.some(record => !record.pass)) failures.push({ risk: 'CAMERA_DIFFERENTIATION', failure: 'OVERVIEW_BROWSE_NOT_MATERIALLY_DISTINCT' });
  if (executionErrors.length) failures.push({ risk: 'EXECUTION', failure: `BROWSER_ERRORS:${executionErrors.length}` });
  const automatedDisposition = failures.length === 0 ? 'AUTOMATED_RISK_SET_PASS_AWAITING_INTERNAL_PERCEPTUAL_REVIEW' : 'PROTOTYPE_REQUIRES_ITERATION';
  const summary = {
    contract: CONTRACT, phase: 'PHASE_2A_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_AND_RISK_SET_REVIEW', exact_base_head: BASE_HEAD,
    exact_candidate_head: CANDIDATE_HEAD, public_methods_mutation: false, full_1575_state_run_executed: false,
    risk_views_attempted: RISKS.length, risk_views_captured: screenshots.length, geometry_failure_count: failures.length,
    inspection_return_cases: inspectionReturns.length, inspection_return_passes: inspectionReturns.filter(record => record.exact).length,
    camera_pairs: cameraDifferentiation.length, camera_pair_passes: cameraDifferentiation.filter(record => record.pass).length,
    automated_disposition: automatedDisposition, failures, execution_errors: executionErrors
  };
  writeJson('prototype-execution-summary.json', summary);
  writeJson('representative-risk-results.json', { contract: CONTRACT, results });
  writeJson('risk-screenshot-manifest.json', { contract: CONTRACT, exact_candidate_head: CANDIDATE_HEAD, screenshots });
  writeJson('overview-browse-differentiation.json', { contract: CONTRACT, pairs: cameraDifferentiation });
  writeJson('inspection-return-regression.json', { contract: CONTRACT, cases: inspectionReturns });
  fs.writeFileSync(path.join(OUT_DIR, 'responsive-composition-explanation.md'), '# Responsive composition explanation\n\nThe prototype applies an isolated browser-session architecture over the unchanged Methods source. It establishes reserved regions for the protected header, native camera controls, family controls, bounded stage, separated lens/reading surface, and coordinate footer. Inactive model cards are removed from the visible object field. Overview scales the active model down within a wider context; Browse expands the active model and reduces competing context. Phone and tablet controls use minimum 44px interaction regions.\n');
  fs.writeFileSync(path.join(OUT_DIR, 'internal-perceptual-review.template.json'), `${JSON.stringify({ contract: CONTRACT, exact_candidate_head: CANDIDATE_HEAD, reviewer: null, reviewed_screenshots: screenshots.map(value => value.file), disposition: 'PENDING_INTERNAL_PERCEPTUAL_REVIEW', permitted_final_dispositions: ['MATERIALLY_COHERENT_AND_WORTH_FULL_VERIFICATION', 'PROTOTYPE_REQUIRES_ITERATION'] }, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
