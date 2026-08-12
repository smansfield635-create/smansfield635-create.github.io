import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';

const ADAPTER_CONTRACT = 'METHODS_NONPRODUCT_HARNESS_ADAPTER_STATE_REACH_CORRECTION_v1';
const EXECUTION_CONTRACT = 'METHODS_EUCLIDEAN_SHOWROOM_NONPRODUCT_HARNESS_COHERENCE_PASS_v1';
const INSTRUMENT = 'METHODS_MODELS_COHERENCE_INSTRUMENT@1.0.0';
const ORIGIN = process.env.METHODS_MODELS_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || 'UNKNOWN';
const HARNESS_COMMIT = process.env.HARNESS_COMMIT || 'UNKNOWN';
const EXPECTED_SOURCE_HEAD = process.env.EXPECTED_SOURCE_HEAD || '66a2105e96e84c5b482f783010779f87a90a28ee';
const OUT_DIR = path.resolve(process.env.COHERENCE_OUT_DIR || 'methods-euclidean-coherence-evidence');
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const ROUTE = `${ORIGIN}/laws/research/methods-and-models/`;
if (!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const VIEWPORTS = [
  { id: 'SMALL_PHONE', width: 360, height: 800 },
  { id: 'PHONE_PORTRAIT', width: 390, height: 844 },
  { id: 'LARGE_PHONE', width: 430, height: 932 },
  { id: 'COMPACT_TABLET_PORTRAIT', width: 768, height: 1024 },
  { id: 'LARGE_TABLET_PORTRAIT', width: 820, height: 1180 },
  { id: 'TABLET_LANDSCAPE', width: 1180, height: 820 },
  { id: 'SHORT_LAPTOP', width: 1366, height: 768 },
  { id: 'STANDARD_DESKTOP', width: 1440, height: 1000 },
  { id: 'WIDE_DESKTOP', width: 1920, height: 1080 }
];

const FAMILIES = [
  {
    id: 'STRUCTURAL_ENVELOPE_AND_COLLAPSE', pageId: 'structure', label: 'Structural Envelope and Collapse',
    models: [
      ['STRUCTURAL_ENVELOPE_451', '451 Structural Envelope', 'envelope-451'],
      ['SATURATION_GATE_448', '448 Saturation Gate', 'gate-448'],
      ['INTERNAL_BURDEN_LATTICE_256', '256 Internal Burden Lattice', 'spine-minimum'],
      ['EXTERNAL_PRESSURE_SHELL_192', '192 External Pressure Shell', 'collapse-qualified'],
      ['COHERENCE_SPINE_EIV', 'E / I / V Coherence Spine', 'membrane-61'],
      ['QUALIFIED_COLLAPSE_PREDICATE', 'Qualified Collapse Predicate', 'anchors-9']
    ]
  },
  {
    id: 'PRESSURE_CAPACITY_AND_STABILITY', pageId: 'pressure', label: 'Pressure, Capacity and Stability',
    models: [
      ['PRESSURE_PRODUCT_PI', 'Pressure Product Π', 'pressure-field'],
      ['CAPACITY_PRODUCT_K', 'Capacity Product K', 'capacity-field'],
      ['CAPACITY_FLOOR_K_USED', 'Capacity Floor K_used', 'pcr'],
      ['PRESSURE_CAPACITY_RATIO_PCR', 'Pressure-Capacity Ratio PCR', 'stability'],
      ['STABILITY_MASS_S_STAR', 'Stability Mass S*', 'hazard'],
      ['HAZARD_MASS_H_STAR', 'Hazard Mass H*', 'complement'],
      ['COMPLEMENTARITY_IDENTITY', 'Complementarity Identity', 'zero-aware']
    ]
  },
  {
    id: 'CLOSURE_AND_SYSTEM_FLOW', pageId: 'closure', label: 'Closure and System Flow',
    models: [
      ['INDUSTRIAL_MASS_BALANCE', 'Industrial Mass Balance', 'mass-ledger'],
      ['UNCLOSED_RESIDUAL_U', 'Unclosed Residual U', 'residual-u'],
      ['CLOSURE_THRESHOLD_3_EPSILON', 'Closure Threshold 3ε', 'closure-threshold'],
      ['ENERGY_LOOP_LAW', 'Energy Loop Law', 'energy-loop'],
      ['SAFE_MODE_BOUNDARY', 'Safe-Mode Boundary', 'useful-output']
    ]
  },
  {
    id: 'METHOD_RESOLUTION_AND_FALSIFICATION', pageId: 'method', label: 'Method Resolution and Falsification',
    models: [
      ['OBSERVE', 'Observe', 'first'],
      ['HYPOTHESIZE', 'Hypothesize', 'integral-method'],
      ['REDUCE_1_2_3', 'Reduce 1–2–3', 'diagnostic-five'],
      ['FALSIFY', 'Falsify', 'abcd'],
      ['CLASSIFY_A_B_C_D', 'Classify A–B–C–D', 'falsification'],
      ['RECORD', 'Record', 'no-match'],
      ['CLAIM_BOUNDARY', 'Claim Boundary', 'fixtures']
    ]
  }
];

const LENSES = [
  { id: 'FORMAL_STRUCTURE', pageLabel: 'Practical', nativeId: 'practical', label: 'Formal Structure' },
  { id: 'ENGINEERING_OPERATION', pageLabel: 'Engineering', nativeId: 'engineering', label: 'Engineering Operation' },
  { id: 'EVIDENCE_AND_LIMITS', pageLabel: 'Evidence', nativeId: 'evidence', label: 'Evidence and Limits' }
];

const FINDING_CODES = [
  'LABEL_CLIPPED', 'LABEL_COLLISION', 'LABEL_GRID_DETACHED', 'LABEL_UNREADABLE_AT_REQUIRED_CAMERA_DISTANCE', 'LABEL_DEPTH_ORDER_AMBIGUOUS',
  'OBJECT_OUTSIDE_STAGE', 'OBJECT_OCCLUDED', 'OBJECT_INTERSECTION_INVALID', 'DEPTH_ORDER_INVALID', 'ACTIVE_COORDINATE_AMBIGUOUS',
  'MULTIPLE_ACTIVE_COORDINATES', 'NO_ACTIVE_COORDINATE', 'GRID_AXIS_MISSING', 'GRID_PLANE_MISSING', 'GRID_COORDINATE_MISMATCH',
  'TEXT_BELOW_MINIMUM_LEGIBILITY', 'CONTROL_OVERLAPS_CONTENT', 'CONTROL_OUTSIDE_SAFE_REGION', 'TOUCH_TARGET_UNDERSIZED',
  'STAGE_CONTENT_BEHIND_GEOMETRY', 'READING_CONTENT_INSIDE_PROHIBITED_STAGE_REGION', 'CAMERA_OVERVIEW_INCOHERENT',
  'CAMERA_BROWSE_STATE_INCOHERENT', 'CAMERA_TRANSITION_CLIPS_CONTENT', 'FAMILY_STATE_COLOR_MISMATCH', 'ATMOSPHERE_STATE_MISMATCH',
  'INSPECTION_DID_NOT_FREEZE_PAGE', 'BACKGROUND_NOT_INERT_DURING_INSPECTION', 'INSPECTION_FOREGROUND_CLIPPED', 'RETURN_CONTROL_MISSING',
  'RETURN_COORDINATE_MISMATCH', 'RETURN_CAMERA_MISMATCH', 'RETURN_SCROLL_MISMATCH', 'RETURN_FOCUS_MISMATCH', 'RETURN_ATMOSPHERE_MISMATCH',
  'HORIZONTAL_DOCUMENT_OVERFLOW', 'VERTICAL_STAGE_OVERFLOW', 'REQUIRED_EVIDENCE_MISSING', 'WRONG_EXACT_HEAD', 'HARNESS_LOAD_FAILED'
];

const counts = Object.fromEntries(FINDING_CODES.map(code => [code, 0]));
const dispositionCounts = Object.fromEntries(FINDING_CODES.map(code => [code, { INVALID: 0, UNEVALUABLE: 0, FAIL: 0 }]));
const examples = Object.fromEntries(FINDING_CODES.map(code => [code, []]));
const observations = [];
const stateReachReceipts = [];
const cameraReceipts = [];
const inspectionCycles = [];
const consoleErrors = [];
const pageErrors = [];
const screenshotManifest = [];
const inputTests = {};

const sourceFiles = [
  'laws/research/methods-and-models/index.html',
  'laws/research/methods-and-models/showroom.css',
  'laws/research/methods-and-models/showroom.js',
  'laws/research/methods-and-models/showroom-refinement.css',
  'laws/research/methods-and-models/showroom-refinement.js',
  'laws/research/methods-and-models/showroom-euclidean.css',
  'laws/research/methods-and-models/showroom-euclidean-interaction.css',
  'laws/research/methods-and-models/showroom-euclidean.js',
  'laws/research/methods-and-models/canonical-records-v1.html'
];
const sourcePresence = Object.fromEntries(sourceFiles.map(file => [file, fs.existsSync(file)]));
const sourceText = Object.fromEntries(sourceFiles.filter(file => fs.existsSync(file)).map(file => [file, fs.readFileSync(file, 'utf8')]));
const cameraSourceCorpus = sourceFiles.map(file => sourceText[file] || '').join('\n');
const nativeCameraContractDeclared = /data-mm-camera|mmCameraState|mmCamera|cameraState\s*[:=]|METHODS_MODELS_CAMERA_STATE/i.test(cameraSourceCorpus);
const sourceAssertions = {
  allRequiredFilesPresent: Object.values(sourcePresence).every(Boolean),
  contract: sourceText[sourceFiles[0]]?.includes('METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3') || false,
  sourceCompletenessOpen: sourceText[sourceFiles[0]]?.includes('data-source-completeness="open"') || false,
  productAcceptanceNotGranted: sourceText[sourceFiles[0]]?.includes('data-product-acceptance="not-granted"') || false,
  canonicalArchiveBound: sourceText[sourceFiles[0]]?.includes('METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT') || false,
  noCanvasWebglGlobe: !/webgl|three\.js|getContext\(|<canvas|globe/i.test((sourceText[sourceFiles[6]] || '') + (sourceText[sourceFiles[7]] || '')),
  reducedMotionDeclared: (sourceText[sourceFiles[5]] || '').includes('prefers-reduced-motion: reduce'),
  exactCoordinateStateDeclared: ['familyIndex', 'modelIndex', 'lensIndex', 'METHODS_MODELS_EUCLIDEAN_STATE_CHANGED'].every(token => (sourceText[sourceFiles[7]] || '').includes(token)),
  nativeCameraContractDeclared
};
const sourceFailures = Object.entries(sourceAssertions)
  .filter(([key, value]) => key !== 'nativeCameraContractDeclared' && !value)
  .map(([key]) => key);

function bump(code, detail, disposition = 'FAIL') {
  if (!FINDING_CODES.includes(code)) throw new Error(`UNREGISTERED_FINDING_CODE:${code}`);
  counts[code] += 1;
  if (dispositionCounts[code][disposition] === undefined) throw new Error(`UNSUPPORTED_DISPOSITION:${disposition}`);
  dispositionCounts[code][disposition] += 1;
  if (examples[code].length < 16) examples[code].push({ disposition, ...detail });
}
function rectOutside(a, b, tolerance = 1) {
  return a.left < b.left - tolerance || a.right > b.right + tolerance || a.top < b.top - tolerance || a.bottom > b.bottom + tolerance;
}
function intersection(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}
function rectDelta(a, b) {
  return Math.max(Math.abs(a.left - b.left), Math.abs(a.right - b.right), Math.abs(a.top - b.top), Math.abs(a.bottom - b.bottom));
}
function coordinateId(z, x, y) {
  return `${FAMILIES[z].models[x][0]}__${LENSES[y].id}`;
}
function expectedState(z, x, y) {
  return {
    x, y, z,
    family: FAMILIES[z].pageId,
    model: FAMILIES[z].models[x][2],
    lens: LENSES[y].nativeId,
    coordinateId: coordinateId(z, x, y)
  };
}
function stateRef(viewport, z, x, y, camera) {
  return { viewport: viewport.id, coordinate: coordinateId(z, x, y), camera, x: x + 1, y: y + 1, z: z + 1 };
}
function safeName(value) {
  return value.replace(/[^A-Za-z0-9_.-]+/g, '_');
}
function writeJson(file, object) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(object, null, 2)}\n`);
}
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function stateMatches(observed, expected) {
  if (!observed) return false;
  return observed.x === expected.x && observed.y === expected.y && observed.z === expected.z &&
    observed.rootX === expected.x && observed.rootY === expected.y && observed.rootZ === expected.z &&
    observed.family === expected.family && observed.model === expected.model && observed.lens === expected.lens &&
    observed.activeCounts.families === 1 && observed.activeCounts.models === 1 && observed.activeCounts.lenses === 1 &&
    observed.transitioning === false;
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
});

async function makePage(viewport, { touch = false, reducedMotion = false, javaScript = true } = {}) {
  const page = await browser.newPage();
  page.on('console', message => {
    if (message.type() === 'error' && consoleErrors.length < 300) consoleErrors.push({ viewport: viewport.id, text: message.text() });
  });
  page.on('pageerror', error => {
    if (pageErrors.length < 300) pageErrors.push({ viewport: viewport.id, text: String(error) });
  });
  await page.setJavaScriptEnabled(javaScript);
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    isMobile: viewport.width <= 430,
    hasTouch: touch || viewport.width <= 430
  });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const response = await page.goto(ROUTE, { waitUntil: javaScript ? 'networkidle0' : 'domcontentloaded', timeout: 45000 }).catch(() => null);
  if (!response) {
    bump('HARNESS_LOAD_FAILED', { viewport: viewport.id }, 'INVALID');
    return { page, loaded: false };
  }
  if (javaScript) {
    const baseReady = await page.waitForSelector('html[data-methods-models-euclidean-showroom="active"]', { timeout: 15000 }).then(() => true).catch(() => false);
    const euclideanReady = await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]', { timeout: 15000 }).then(() => true).catch(() => false);
    if (!baseReady || !euclideanReady) {
      bump('HARNESS_LOAD_FAILED', { viewport: viewport.id, baseReady, euclideanReady }, 'INVALID');
      return { page, loaded: false };
    }
  }
  return { page, loaded: true };
}

async function waitStable(page, milliseconds = 620) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))).catch(() => {});
}

async function readNativeState(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    if (!root) return null;
    const families = [...root.querySelectorAll('.mm-family-tab')];
    const models = [...root.querySelectorAll('.mm-model-card')];
    const lenses = [...root.querySelectorAll('[data-mm-lens-tab]')];
    const familyIndex = families.findIndex(element => element.getAttribute('aria-selected') === 'true');
    const modelIndex = models.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active');
    const lensIndex = lenses.findIndex(element => element.getAttribute('aria-selected') === 'true');
    return {
      x: modelIndex,
      y: lensIndex,
      z: familyIndex,
      rootX: Number(root.dataset.mmX),
      rootY: Number(root.dataset.mmY),
      rootZ: Number(root.dataset.mmZ),
      family: root.dataset.mmFamily || '',
      model: root.dataset.mmModel || '',
      lens: lenses[lensIndex]?.dataset.mmLensTab || '',
      ready: root.dataset.mmEuclideanReady || '',
      transitioning: root.dataset.mmTransitioning === 'true',
      transitionAxis: root.dataset.mmTransitionAxis || '',
      transitionDirection: root.dataset.mmTransitionDirection || '',
      activeCounts: {
        families: families.filter(element => element.getAttribute('aria-selected') === 'true').length,
        models: models.filter(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active').length,
        lenses: lenses.filter(element => element.getAttribute('aria-selected') === 'true').length
      }
    };
  });
}

async function waitNativeCoordinate(page, expected, timeout = 3500) {
  const reached = await page.waitForFunction(exp => {
    const root = document.querySelector('[data-mm-showroom]');
    if (!root) return false;
    const families = [...root.querySelectorAll('.mm-family-tab')];
    const models = [...root.querySelectorAll('.mm-model-card')];
    const lenses = [...root.querySelectorAll('[data-mm-lens-tab]')];
    const z = families.findIndex(element => element.getAttribute('aria-selected') === 'true');
    const x = models.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active');
    const y = lenses.findIndex(element => element.getAttribute('aria-selected') === 'true');
    const counts = {
      z: families.filter(element => element.getAttribute('aria-selected') === 'true').length,
      x: models.filter(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active').length,
      y: lenses.filter(element => element.getAttribute('aria-selected') === 'true').length
    };
    return x === exp.x && y === exp.y && z === exp.z &&
      Number(root.dataset.mmX) === exp.x && Number(root.dataset.mmY) === exp.y && Number(root.dataset.mmZ) === exp.z &&
      root.dataset.mmFamily === exp.family && root.dataset.mmModel === exp.model && lenses[y]?.dataset.mmLensTab === exp.lens &&
      counts.x === 1 && counts.y === 1 && counts.z === 1 && root.dataset.mmTransitioning !== 'true';
  }, { timeout }, expected).then(() => true).catch(() => false);
  return { reached, observed: await readNativeState(page) };
}

async function activeIndex(page, axis) {
  if (axis === 'z') return page.$$eval('.mm-family-tab', elements => elements.findIndex(element => element.getAttribute('aria-selected') === 'true'));
  if (axis === 'y') return page.$$eval('[data-mm-lens-tab]', elements => elements.findIndex(element => element.getAttribute('aria-selected') === 'true'));
  return page.$$eval('.mm-model-card', elements => elements.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active'));
}

async function clickIndexed(page, selector, index) {
  return page.evaluate(({ selector, index }) => {
    const element = [...document.querySelectorAll(selector)][index];
    if (!element) return false;
    element.click();
    return true;
  }, { selector, index });
}

async function setFamily(page, z) {
  let current = await activeIndex(page, 'z');
  if (current === z) return { reached: true, current };
  const dispatched = await clickIndexed(page, '.mm-family-tab', z);
  await waitStable(page);
  current = await activeIndex(page, 'z');
  return { reached: dispatched && current === z, current };
}

async function setModel(page, x, count) {
  let current = await activeIndex(page, 'x');
  let attempts = 0;
  while (current !== x && attempts < count + 2) {
    const forward = (x - current + count) % count;
    const backward = (current - x + count) % count;
    const selector = forward <= backward ? '[data-mm-next]' : '[data-mm-previous]';
    const dispatched = await page.evaluate(selectorValue => {
      const element = document.querySelector(selectorValue);
      if (!element) return false;
      element.click();
      return true;
    }, selector);
    if (!dispatched) break;
    await waitStable(page);
    current = await activeIndex(page, 'x');
    attempts += 1;
  }
  return { reached: current === x, current, attempts };
}

async function setLens(page, y) {
  let current = await activeIndex(page, 'y');
  if (current === y) return { reached: true, current };
  const dispatched = await clickIndexed(page, '[data-mm-lens-tab]', y);
  await waitStable(page, 240);
  current = await activeIndex(page, 'y');
  return { reached: dispatched && current === y, current };
}

async function setCoordinate(page, z, x, y, viewportId, context = 'PRIMARY') {
  const expected = expectedState(z, x, y);
  const before = await readNativeState(page);
  const family = await setFamily(page, z);
  const model = await setModel(page, x, FAMILIES[z].models.length);
  // Family and model changes reset the native lens to Practical. Lens must be set last.
  const lens = await setLens(page, y);
  const final = await waitNativeCoordinate(page, expected);
  const receipt = {
    receipt_id: `SR-${String(stateReachReceipts.length + 1).padStart(5, '0')}`,
    adapter_contract: ADAPTER_CONTRACT,
    context,
    viewport: viewportId,
    requested: expected,
    before,
    steps: { family, model, lens },
    observed: final.observed,
    reached: final.reached && stateMatches(final.observed, expected)
  };
  stateReachReceipts.push(receipt);
  return receipt;
}

async function enterCameraObservation(page, requested, viewportId, coordinate) {
  if (requested === 'OVERVIEW') {
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active && typeof active.blur === 'function') active.blur();
      document.querySelector('[data-mm-showroom]')?.scrollIntoView({ block: 'start', inline: 'nearest' });
    });
  } else {
    await page.focus('[data-mm-model-deck]');
  }
  await waitStable(page, 80);
  const observed = await page.evaluate(() => {
    const root = document.querySelector('[data-mm-showroom]');
    const deck = document.querySelector('[data-mm-model-deck]');
    const active = document.activeElement;
    const nativeCamera = root?.dataset.mmCamera || document.documentElement.dataset.mmCamera || document.body.dataset.mmCamera || null;
    return {
      nativeCamera,
      focusWithinDeck: Boolean(deck && active && (active === deck || deck.contains(active))),
      activeElement: active ? `${active.tagName}:${active.id || ''}:${active.getAttribute('aria-label') || ''}` : '',
      scrollX,
      scrollY
    };
  });
  const operationalReached = requested === 'OVERVIEW' ? observed.focusWithinDeck === false : observed.focusWithinDeck === true;
  const nativeReached = nativeCameraContractDeclared && String(observed.nativeCamera || '').toUpperCase() === requested;
  const receipt = {
    receipt_id: `CAM-${String(cameraReceipts.length + 1).padStart(5, '0')}`,
    viewport: viewportId,
    coordinate,
    requested,
    native_contract_declared: nativeCameraContractDeclared,
    native_reached: nativeReached,
    operational_condition_reached: operationalReached,
    observed
  };
  cameraReceipts.push(receipt);
  return receipt;
}

async function snapshot(page, viewport, z, x, y, cameraReceipt, stateReach) {
  const expected = expectedState(z, x, y);
  return page.evaluate(({ viewportId, expected, cameraReceipt, stateReach }) => {
    const root = document.querySelector('[data-mm-showroom]');
    const stage = document.querySelector('.mm-stage');
    const modelCards = root ? [...root.querySelectorAll('.mm-model-card')] : [];
    const familyTabs = root ? [...root.querySelectorAll('.mm-family-tab')] : [];
    const lensTabs = root ? [...root.querySelectorAll('[data-mm-lens-tab]')] : [];
    const activeCard = modelCards.find(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active') || null;
    const activeFamily = familyTabs.find(element => element.getAttribute('aria-selected') === 'true') || null;
    const activeLens = lensTabs.find(element => element.getAttribute('aria-selected') === 'true') || null;
    const rect = element => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height };
    };
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const value = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.01 && value.width > 0 && value.height > 0;
    };
    const labels = [
      ['family-title', document.querySelector('[data-mm-family-title]')],
      ['active-family', activeFamily],
      ['active-lens', activeLens],
      ['model-title', activeCard?.querySelector('h3')],
      ['model-statement', activeCard?.querySelector('.mm-model-card__statement')],
      ['progress', document.querySelector('[data-mm-progress]')],
      ['coordinate', document.querySelector('[data-mm-coordinate]')],
      ['coordinate-x', document.querySelector('[data-mm-coordinate-x]')],
      ['coordinate-y', document.querySelector('[data-mm-coordinate-y]')],
      ['coordinate-z', document.querySelector('[data-mm-coordinate-z]')]
    ].filter(([, element]) => visible(element)).map(([id, element]) => ({
      id,
      text: element.textContent.replace(/\s+/g, ' ').trim(),
      rect: rect(element),
      fontSize: parseFloat(getComputedStyle(element).fontSize),
      opacity: parseFloat(getComputedStyle(element).opacity),
      z: getComputedStyle(element).zIndex
    }));
    const controls = [...document.querySelectorAll('.mm-stage button')].filter(visible).map((element, index) => ({
      id: element.getAttribute('data-mm-control-id') || element.getAttribute('aria-label') || element.textContent.trim() || `control-${index}`,
      rect: rect(element),
      fontSize: parseFloat(getComputedStyle(element).fontSize)
    }));
    const cards = modelCards.filter(visible).map(element => ({
      id: element.dataset.modelId || '',
      position: element.dataset.position || element.dataset.mmXPosition || '',
      mmPosition: element.dataset.mmXPosition || '',
      rect: rect(element),
      z: getComputedStyle(element).zIndex,
      transform: getComputedStyle(element).transform,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    const inspect = activeCard?.querySelector('[data-mm-inspect]');
    const inspectRect = rect(inspect);
    let hit = '';
    let hitIsInspect = false;
    if (inspectRect) {
      const element = document.elementFromPoint(
        Math.max(0, Math.min(innerWidth - 1, inspectRect.left + inspectRect.width / 2)),
        Math.max(0, Math.min(innerHeight - 1, inspectRect.top + inspectRect.height / 2))
      );
      hit = element?.tagName || '';
      hitIsInspect = element === inspect || element?.closest?.('[data-mm-inspect]') === inspect;
    }
    const support = document.querySelector('.mm-support');
    const stageRect = rect(stage);
    const cardRect = rect(activeCard);
    const viewportRect = { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight };
    const xIndex = modelCards.findIndex(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active');
    const yIndex = lensTabs.findIndex(element => element.getAttribute('aria-selected') === 'true');
    const zIndex = familyTabs.findIndex(element => element.getAttribute('aria-selected') === 'true');
    const nativeState = root ? {
      x: xIndex,
      y: yIndex,
      z: zIndex,
      rootX: Number(root.dataset.mmX),
      rootY: Number(root.dataset.mmY),
      rootZ: Number(root.dataset.mmZ),
      family: root.dataset.mmFamily || '',
      model: root.dataset.mmModel || '',
      lens: lensTabs[yIndex]?.dataset.mmLensTab || '',
      ready: root.dataset.mmEuclideanReady || '',
      transitioning: root.dataset.mmTransitioning === 'true'
    } : null;
    return {
      viewportId,
      expected,
      stateReach,
      camera: cameraReceipt,
      nativeState,
      activeCounts: {
        families: familyTabs.filter(element => element.getAttribute('aria-selected') === 'true').length,
        models: modelCards.filter(element => element.dataset.position === 'active' || element.dataset.mmXPosition === 'active').length,
        lenses: lensTabs.filter(element => element.getAttribute('aria-selected') === 'true').length
      },
      axes: {
        x: Boolean(document.querySelector('[data-mm-previous]') && document.querySelector('[data-mm-next]')),
        y: lensTabs.length === 3,
        z: Boolean(document.querySelector('[data-mm-family-previous]') && document.querySelector('[data-mm-family-next]'))
      },
      planes: document.querySelectorAll('.mm-depth-plane').length,
      stageRect,
      viewportRect,
      cardRect,
      labels,
      controls,
      cards,
      cardTransform: activeCard ? getComputedStyle(activeCard).transform : 'none',
      familyTransform: activeFamily ? getComputedStyle(activeFamily).transform : 'none',
      lensTransform: activeLens ? getComputedStyle(activeLens).transform : 'none',
      activeFamilyText: activeFamily?.textContent.replace(/\s+/g, ' ').trim() || '',
      activeLensText: activeLens?.textContent.replace(/\s+/g, ' ').trim() || '',
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      verticalDocumentOverflow: document.documentElement.scrollHeight - innerHeight,
      supportInert: Boolean(support?.inert),
      bodyPosition: getComputedStyle(document.body).position,
      bodyFamily: document.body.dataset.mmFamily || '',
      familyVisualSignature: [
        root ? getComputedStyle(root).backgroundColor : '',
        activeFamily ? getComputedStyle(activeFamily).color : '',
        activeCard ? getComputedStyle(activeCard).borderColor : '',
        activeCard ? getComputedStyle(activeCard).boxShadow : ''
      ].join('|'),
      focusKey: document.activeElement ? `${document.activeElement.tagName}:${document.activeElement.getAttribute('data-mm-inspect') ?? ''}:${document.activeElement.getAttribute('aria-label') ?? ''}` : '',
      inspect: { exists: Boolean(inspect), rect: inspectRect, hit, hitIsInspect },
      scroll: { x: scrollX, y: scrollY },
      canvasCount: document.querySelectorAll('canvas').length,
      displayMode: document.body.dataset.mmDisplay === 'collapsed' ? 'DOCKED' : document.documentElement.dataset.methodsModelsInspection === 'open' ? 'INSPECTION' : 'STAGE',
      transitionPhase: root?.dataset.mmTransitioning === 'true' ? 'TRANSITIONING' : document.documentElement.dataset.methodsModelsInspection === 'restoring' ? 'RESTORING' : 'STABLE',
      readingIntersectsStage: (() => {
        const readingRect = rect(support);
        if (!readingRect || !stageRect) return 0;
        const width = Math.max(0, Math.min(readingRect.right, stageRect.right) - Math.max(readingRect.left, stageRect.left));
        const height = Math.max(0, Math.min(readingRect.bottom, stageRect.bottom) - Math.max(readingRect.top, stageRect.top));
        return width * height;
      })()
    };
  }, { viewportId: viewport.id, expected, cameraReceipt, stateReach: { receipt_id: stateReach.receipt_id, reached: stateReach.reached } });
}

function analyzeSnapshot(snapshotValue) {
  const ref = {
    viewport: snapshotValue.viewportId,
    coordinate: snapshotValue.expected.coordinateId,
    camera: snapshotValue.camera.requested
  };
  if (!snapshotValue.nativeState) {
    bump('NO_ACTIVE_COORDINATE', ref, 'INVALID');
    return;
  }
  const activeCounts = snapshotValue.activeCounts;
  if (activeCounts.families + activeCounts.models + activeCounts.lenses === 0) bump('NO_ACTIVE_COORDINATE', ref, 'INVALID');
  if (activeCounts.families > 1 || activeCounts.models > 1 || activeCounts.lenses > 1) bump('MULTIPLE_ACTIVE_COORDINATES', { ...ref, activeCounts }, 'INVALID');
  if (activeCounts.families !== 1 || activeCounts.models !== 1 || activeCounts.lenses !== 1) bump('ACTIVE_COORDINATE_AMBIGUOUS', { ...ref, activeCounts }, 'INVALID');
  if (!snapshotValue.axes.x || !snapshotValue.axes.y || !snapshotValue.axes.z) bump('GRID_AXIS_MISSING', { ...ref, axes: snapshotValue.axes });
  if (snapshotValue.planes < 3) bump('GRID_PLANE_MISSING', { ...ref, planes: snapshotValue.planes });
  const expected = snapshotValue.expected;
  const actual = snapshotValue.nativeState;
  if (!stateMatches({ ...actual, activeCounts }, expected)) {
    bump('GRID_COORDINATE_MISMATCH', { ...ref, actual, expected, stateReach: snapshotValue.stateReach }, 'INVALID');
  }
  if (!snapshotValue.cardRect || !snapshotValue.stageRect) {
    bump('OBJECT_OUTSIDE_STAGE', { ...ref, reason: 'MISSING_RECTANGLE' });
  } else {
    if (rectOutside(snapshotValue.cardRect, snapshotValue.stageRect, 2) || rectOutside(snapshotValue.cardRect, snapshotValue.viewportRect, 2)) {
      bump('OBJECT_OUTSIDE_STAGE', { ...ref, card: snapshotValue.cardRect, stage: snapshotValue.stageRect, viewport: snapshotValue.viewportRect });
    }
    if (snapshotValue.cardRect.top < snapshotValue.stageRect.top - 2 || snapshotValue.cardRect.bottom > snapshotValue.stageRect.bottom + 2) {
      bump('VERTICAL_STAGE_OVERFLOW', { ...ref, card: snapshotValue.cardRect, stage: snapshotValue.stageRect });
    }
  }
  if (!snapshotValue.inspect.hitIsInspect) bump('OBJECT_OCCLUDED', { ...ref, inspect: snapshotValue.inspect });
  const active = snapshotValue.cards.find(card => card.position === 'active' || card.mmPosition === 'active');
  const others = snapshotValue.cards.filter(card => card !== active && (card.position || card.mmPosition));
  if (active) {
    for (const card of others) {
      const area = intersection(active.rect, card.rect);
      const denominator = Math.min(active.rect.width * active.rect.height, card.rect.width * card.rect.height);
      if (denominator > 0 && area / denominator > 0.60) {
        bump('OBJECT_INTERSECTION_INVALID', { ...ref, active: active.rect, other: card.rect, ratio: area / denominator });
        break;
      }
    }
  }
  if (!active || active.transform === 'none') bump('DEPTH_ORDER_INVALID', { ...ref, active });
  if (snapshotValue.horizontalOverflow > 2) bump('HORIZONTAL_DOCUMENT_OVERFLOW', { ...ref, overflow: snapshotValue.horizontalOverflow });
  if (snapshotValue.bodyFamily && snapshotValue.bodyFamily !== snapshotValue.nativeState.family) {
    bump('FAMILY_STATE_COLOR_MISMATCH', { ...ref, bodyFamily: snapshotValue.bodyFamily, rootFamily: snapshotValue.nativeState.family });
  }
  for (const label of snapshotValue.labels) {
    if (rectOutside(label.rect, snapshotValue.viewportRect, 1)) bump('LABEL_CLIPPED', { ...ref, label });
    if (label.fontSize < 12) bump('TEXT_BELOW_MINIMUM_LEGIBILITY', { ...ref, label });
    if ((label.id === 'model-title' || label.id === 'family-title') && (label.fontSize < 14 || label.opacity < 0.65)) {
      bump('LABEL_UNREADABLE_AT_REQUIRED_CAMERA_DISTANCE', { ...ref, label });
    }
  }
  for (let first = 0; first < snapshotValue.labels.length; first += 1) {
    for (let second = first + 1; second < snapshotValue.labels.length; second += 1) {
      const a = snapshotValue.labels[first];
      const b = snapshotValue.labels[second];
      const area = intersection(a.rect, b.rect);
      const denominator = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
      if (area > 16 && denominator > 0 && area / denominator > 0.18) {
        bump('LABEL_COLLISION', { ...ref, a: a.id, b: b.id, ratio: area / denominator });
        first = snapshotValue.labels.length;
        break;
      }
    }
  }
  const title = snapshotValue.labels.find(label => label.id === 'model-title');
  if (title && snapshotValue.cardRect && rectOutside(title.rect, snapshotValue.cardRect, 2)) {
    bump('LABEL_GRID_DETACHED', { ...ref, title: title.rect, card: snapshotValue.cardRect });
  }
  if (title && active && active.z !== 'auto' && title.z !== 'auto' && Number(title.z) < Number(active.z)) {
    bump('LABEL_DEPTH_ORDER_AMBIGUOUS', { ...ref, titleZ: title.z, cardZ: active.z });
  }
  for (const control of snapshotValue.controls) {
    if (rectOutside(control.rect, snapshotValue.viewportRect, 1)) bump('CONTROL_OUTSIDE_SAFE_REGION', { ...ref, control });
    if (snapshotValue.viewportRect.width <= 430 && (control.rect.width < 44 || control.rect.height < 44)) {
      bump('TOUCH_TARGET_UNDERSIZED', { ...ref, control });
    }
    if (title) {
      const area = intersection(control.rect, title.rect);
      const denominator = Math.min(control.rect.width * control.rect.height, title.rect.width * title.rect.height);
      if (denominator > 0 && area / denominator > 0.20) {
        bump('CONTROL_OVERLAPS_CONTENT', { ...ref, control: control.id, label: title.id, ratio: area / denominator });
      }
    }
  }
  if (snapshotValue.readingIntersectsStage > 5000 && !snapshotValue.supportInert) {
    bump('READING_CONTENT_INSIDE_PROHIBITED_STAGE_REGION', { ...ref, area: snapshotValue.readingIntersectsStage });
  }
  if (snapshotValue.canvasCount > 0) bump('STAGE_CONTENT_BEHIND_GEOMETRY', { ...ref, canvasCount: snapshotValue.canvasCount });
}

const familySignatures = new Map();
let stableAttemptCount = 0;
let stableSemanticReachCount = 0;
let operationalCameraReachCount = 0;
let nativeCameraReachCount = 0;

for (const viewport of VIEWPORTS) {
  const { page, loaded } = await makePage(viewport);
  if (!loaded) {
    await page.close();
    continue;
  }
  for (let z = 0; z < FAMILIES.length; z += 1) {
    for (let y = 0; y < LENSES.length; y += 1) {
      for (let x = 0; x < FAMILIES[z].models.length; x += 1) {
        const reach = await setCoordinate(page, z, x, y, viewport.id, 'STABLE_STAGE');
        for (const camera of ['OVERVIEW', 'BROWSE']) {
          stableAttemptCount += 1;
          if (!reach.reached) {
            bump('GRID_COORDINATE_MISMATCH', {
              ...stateRef(viewport, z, x, y, camera),
              reason: 'REQUESTED_COORDINATE_NOT_REACHED',
              receipt: reach
            }, 'INVALID');
            observations.push({
              viewportId: viewport.id,
              expected: expectedState(z, x, y),
              requestedCamera: camera,
              stateReach: reach,
              executionStatus: 'INVALID_STATE_REACH'
            });
            continue;
          }
          stableSemanticReachCount += 1;
          const cameraReceipt = await enterCameraObservation(page, camera, viewport.id, coordinateId(z, x, y));
          if (cameraReceipt.operational_condition_reached) operationalCameraReachCount += 1;
          if (cameraReceipt.native_reached) nativeCameraReachCount += 1;
          const observation = await snapshot(page, viewport, z, x, y, cameraReceipt, reach);
          observations.push(observation);
          analyzeSnapshot(observation);
          if (!cameraReceipt.native_contract_declared) {
            bump(camera === 'OVERVIEW' ? 'CAMERA_OVERVIEW_INCOHERENT' : 'CAMERA_BROWSE_STATE_INCOHERENT', {
              ...stateRef(viewport, z, x, y, camera),
              reason: 'NATIVE_CAMERA_STATE_UNDECLARED',
              operationalConditionReached: cameraReceipt.operational_condition_reached
            });
          } else if (!cameraReceipt.native_reached) {
            bump(camera === 'OVERVIEW' ? 'CAMERA_OVERVIEW_INCOHERENT' : 'CAMERA_BROWSE_STATE_INCOHERENT', {
              ...stateRef(viewport, z, x, y, camera),
              reason: 'REQUESTED_NATIVE_CAMERA_STATE_NOT_REACHED',
              receipt: cameraReceipt
            });
          }
          if (camera === 'OVERVIEW') {
            if (!familySignatures.has(z)) familySignatures.set(z, new Set());
            familySignatures.get(z).add(observation.familyVisualSignature);
          }
        }
        const pair = observations.slice(-2);
        if (pair.length === 2 && pair.every(item => item.cardRect)) {
          const [overview, browse] = pair;
          const sameGeometry = rectDelta(overview.cardRect, browse.cardRect) < 0.5 && overview.cardTransform === browse.cardTransform;
          if (sameGeometry) {
            bump('CAMERA_BROWSE_STATE_INCOHERENT', {
              ...stateRef(viewport, z, x, y, 'PAIR'),
              reason: 'OVERVIEW_AND_BROWSE_GEOMETRY_IDENTICAL'
            });
          }
          if (rectOutside(overview.cardRect, overview.viewportRect, 2) || rectOutside(browse.cardRect, browse.viewportRect, 2)) {
            bump('CAMERA_TRANSITION_CLIPS_CONTENT', stateRef(viewport, z, x, y, 'PAIR'));
          }
        }
      }
    }
  }
  await page.close();
}

const familyRepresentative = [...familySignatures.entries()].map(([z, values]) => ({ z, values: [...values] }));
if (new Set(familyRepresentative.map(entry => entry.values[0])).size < 4) {
  bump('ATMOSPHERE_STATE_MISMATCH', { reason: 'FAMILY_VISUAL_SIGNATURES_NOT_DISTINCT', familyRepresentative });
}

let inspectionAttemptCount = 0;
let inspectionStateReachCount = 0;
for (const viewport of VIEWPORTS) {
  const { page, loaded } = await makePage(viewport);
  if (!loaded) {
    await page.close();
    continue;
  }
  for (let z = 0; z < FAMILIES.length; z += 1) {
    for (let x = 0; x < FAMILIES[z].models.length; x += 1) {
      inspectionAttemptCount += 1;
      const reach = await setCoordinate(page, z, x, 0, viewport.id, 'INSPECTION_RETURN');
      const cycleRef = { viewport: viewport.id, coordinate: coordinateId(z, x, 0), camera: 'BROWSE' };
      if (!reach.reached) {
        bump('GRID_COORDINATE_MISMATCH', { ...cycleRef, reason: 'INSPECTION_ORIGIN_NOT_REACHED', receipt: reach }, 'INVALID');
        inspectionCycles.push({ viewport: viewport.id, coordinate: coordinateId(z, x, 0), executionStatus: 'INVALID_STATE_REACH', reach });
        continue;
      }
      inspectionStateReachCount += 1;
      const inspectSelector = '.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]';
      const inspect = await page.$(inspectSelector);
      if (!inspect) {
        bump('RETURN_CONTROL_MISSING', { ...cycleRef, reason: 'INSPECT_CONTROL_MISSING' });
        inspectionCycles.push({ viewport: viewport.id, coordinate: coordinateId(z, x, 0), executionStatus: 'FAIL_MISSING_INSPECT', reach });
        continue;
      }
      await inspect.focus();
      await waitStable(page, 50);
      const originCamera = await enterCameraObservation(page, 'BROWSE', viewport.id, coordinateId(z, x, 0));
      await inspect.focus();
      const origin = await snapshot(page, viewport, z, x, 0, originCamera, reach);
      let realPointer = true;
      try {
        await inspect.click();
      } catch {
        realPointer = false;
        await page.evaluate(selector => document.querySelector(selector)?.click(), inspectSelector);
      }
      const dialogOpened = await page.waitForSelector('dialog[open]', { timeout: 5000 }).then(() => true).catch(() => false);
      await waitStable(page, 80);
      const opened = await page.evaluate(() => {
        const dialog = document.querySelector('dialog');
        const close = document.querySelector('[data-mm-dialog-close]');
        const support = document.querySelector('.mm-support');
        const value = dialog?.getBoundingClientRect();
        return {
          open: Boolean(dialog?.open),
          htmlState: document.documentElement.dataset.methodsModelsInspection || '',
          bodyPosition: getComputedStyle(document.body).position,
          supportInert: Boolean(support?.inert),
          dialogRect: value ? { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height } : null,
          closeExists: Boolean(close),
          focusKey: document.activeElement ? `${document.activeElement.tagName}:${document.activeElement.getAttribute('data-mm-inspect') ?? ''}:${document.activeElement.getAttribute('aria-label') ?? ''}` : '',
          scroll: { x: scrollX, y: scrollY }
        };
      });
      if (!dialogOpened || !opened.open || opened.htmlState !== 'open' || opened.bodyPosition !== 'fixed') {
        bump('INSPECTION_DID_NOT_FREEZE_PAGE', { ...cycleRef, opened });
      }
      if (!opened.supportInert) bump('BACKGROUND_NOT_INERT_DURING_INSPECTION', { ...cycleRef, opened });
      if (!opened.dialogRect || rectOutside(opened.dialogRect, { left: 0, top: 0, right: viewport.width, bottom: viewport.height }, 2)) {
        bump('INSPECTION_FOREGROUND_CLIPPED', { ...cycleRef, rect: opened.dialogRect });
      }
      if (!opened.closeExists) bump('RETURN_CONTROL_MISSING', cycleRef);
      if ((x + z) % 2 === 0) {
        await page.click('[data-mm-dialog-close]').catch(() => page.evaluate(() => document.querySelector('[data-mm-dialog-close]')?.click()));
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForFunction(() => !document.querySelector('dialog')?.open, { timeout: 5000 }).catch(() => {});
      await waitStable(page, 120);
      const returnedCamera = await enterCameraObservation(page, 'BROWSE', viewport.id, coordinateId(z, x, 0));
      const returned = await snapshot(page, viewport, z, x, 0, returnedCamera, reach);
      if (!stateMatches({ ...returned.nativeState, activeCounts: returned.activeCounts }, expectedState(z, x, 0))) {
        bump('RETURN_COORDINATE_MISMATCH', { ...cycleRef, origin: origin.nativeState, returned: returned.nativeState });
      }
      if (!returnedCamera.operational_condition_reached || returnedCamera.operational_condition_reached !== originCamera.operational_condition_reached) {
        bump('RETURN_CAMERA_MISMATCH', { ...cycleRef, origin: originCamera, returned: returnedCamera });
      }
      if (Math.abs(returned.scroll.x - origin.scroll.x) > 1 || Math.abs(returned.scroll.y - origin.scroll.y) > 1) {
        bump('RETURN_SCROLL_MISMATCH', { ...cycleRef, origin: origin.scroll, returned: returned.scroll });
      }
      if (returned.focusKey !== origin.focusKey) bump('RETURN_FOCUS_MISMATCH', { ...cycleRef, origin: origin.focusKey, returned: returned.focusKey });
      if (returned.familyVisualSignature !== origin.familyVisualSignature) bump('RETURN_ATMOSPHERE_MISMATCH', cycleRef);
      inspectionCycles.push({
        viewport: viewport.id,
        coordinate: coordinateId(z, x, 0),
        executionStatus: 'EVALUATED',
        realPointer,
        reach,
        origin: { state: origin.nativeState, camera: originCamera, scroll: origin.scroll, focus: origin.focusKey, atmosphere: origin.familyVisualSignature },
        opened,
        returned: { state: returned.nativeState, camera: returnedCamera, scroll: returned.scroll, focus: returned.focusKey, atmosphere: returned.familyVisualSignature }
      });
    }
  }
  await page.close();
}

async function tapCenter(page, selector) {
  const value = await page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  await page.touchscreen.tap(value.x, value.y);
  await waitStable(page);
}

async function clickCenter(page, selector) {
  const value = await page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  await page.mouse.click(value.x, value.y);
  await waitStable(page);
}

async function verifyStateAfterInput(page, expected, timeout = 3500) {
  const result = await waitNativeCoordinate(page, expected, timeout);
  return { reached: result.reached && stateMatches(result.observed, expected), observed: result.observed, expected };
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'STANDARD_DESKTOP');
  const { page, loaded } = await makePage(viewport);
  let result = { attempted: true, loaded };
  if (loaded) {
    await setCoordinate(page, 0, 0, 0, viewport.id, 'KEYBOARD_SETUP');
    await page.focus('[data-mm-model-deck]');
    await page.keyboard.press('ArrowRight');
    await waitStable(page);
    const xState = await verifyStateAfterInput(page, expectedState(0, 1, 0));
    await page.focus('[data-mm-model-deck]');
    await page.keyboard.press('ArrowDown');
    await waitStable(page);
    const yState = await verifyStateAfterInput(page, expectedState(0, 1, 1));
    const inspect = await page.$('.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');
    await inspect?.focus();
    await page.keyboard.press('Enter');
    const inspectionOpened = await page.waitForSelector('dialog[open]', { timeout: 4000 }).then(() => true).catch(() => false);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog')?.open, { timeout: 4000 }).catch(() => {});
    result = {
      ...result,
      xState,
      yState,
      xChanged: xState.reached,
      yChanged: yState.reached,
      inspectionOpened,
      inspectionClosed: !(await page.$eval('dialog', dialog => dialog.open).catch(() => false)),
      focusRestored: await page.evaluate(() => document.activeElement?.hasAttribute('data-mm-inspect'))
    };
    if (!xState.reached || !yState.reached) bump('GRID_COORDINATE_MISMATCH', { mode: 'KEYBOARD_PATH', result });
  }
  inputTests.keyboard = result;
  await page.close();
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'STANDARD_DESKTOP');
  const { page, loaded } = await makePage(viewport);
  let result = { attempted: true, loaded };
  if (loaded) {
    await setCoordinate(page, 0, 0, 0, viewport.id, 'POINTER_SETUP');
    await clickCenter(page, '[data-mm-next]');
    const xState = await verifyStateAfterInput(page, expectedState(0, 1, 0));
    await clickCenter(page, '[data-mm-lens-tab="engineering"]');
    const yState = await verifyStateAfterInput(page, expectedState(0, 1, 1));
    await clickCenter(page, '[data-mm-family-next]');
    const zState = await verifyStateAfterInput(page, expectedState(1, 0, 1));
    result = { ...result, xState, yState, zState, xChanged: xState.reached, yChanged: yState.reached, zChanged: zState.reached };
    if (!xState.reached || !yState.reached || !zState.reached) bump('GRID_COORDINATE_MISMATCH', { mode: 'POINTER_PATH', result });
  }
  inputTests.pointer = result;
  await page.close();
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'PHONE_PORTRAIT');
  const { page, loaded } = await makePage(viewport, { touch: true });
  let result = { attempted: true, loaded };
  if (loaded) {
    await setCoordinate(page, 0, 0, 0, viewport.id, 'TOUCH_SETUP');
    await tapCenter(page, '[data-mm-next]');
    const xState = await verifyStateAfterInput(page, expectedState(0, 1, 0));
    await tapCenter(page, '[data-mm-lens-tab="engineering"]');
    const yState = await verifyStateAfterInput(page, expectedState(0, 1, 1));
    await tapCenter(page, '[data-mm-family-next]');
    const zState = await verifyStateAfterInput(page, expectedState(1, 0, 1));
    let inspectionOpened = false;
    try {
      await tapCenter(page, '.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');
      inspectionOpened = await page.$eval('dialog', dialog => dialog.open);
    } catch {}
    if (inspectionOpened) await tapCenter(page, '[data-mm-dialog-close]');
    result = {
      ...result,
      xState,
      yState,
      zState,
      xChanged: xState.reached,
      yChanged: yState.reached,
      zChanged: zState.reached,
      inspectionOpened,
      inspectionClosed: !(await page.$eval('dialog', dialog => dialog.open).catch(() => false))
    };
    if (!xState.reached || !yState.reached || !zState.reached) bump('GRID_COORDINATE_MISMATCH', { mode: 'TOUCH_PATH', result });
  }
  inputTests.touch = result;
  await page.close();
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'STANDARD_DESKTOP');
  const { page, loaded } = await makePage(viewport, { reducedMotion: true });
  let result = { attempted: true, loaded };
  if (loaded) {
    result = await page.evaluate(() => {
      const values = [...document.querySelectorAll('.mm-model-card,.mm-family-tab,.mm-lens-tab')].slice(0, 16).map(element => ({
        duration: getComputedStyle(element).transitionDuration,
        animation: getComputedStyle(element).animationDuration
      }));
      const seconds = value => value.split(',').map(item => item.trim()).map(item => item.endsWith('ms') ? parseFloat(item) / 1000 : parseFloat(item) || 0);
      return {
        attempted: true,
        loaded: true,
        values,
        allBounded: values.every(item => seconds(item.duration).every(number => number <= 0.02) && seconds(item.animation).every(number => number <= 0.02))
      };
    });
    if (!result.allBounded) bump('ATMOSPHERE_STATE_MISMATCH', { mode: 'REDUCED_MOTION', result });
  }
  inputTests.reducedMotion = result;
  await page.close();
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'STANDARD_DESKTOP');
  const { page, loaded } = await makePage(viewport, { javaScript: false });
  let result = { attempted: true, loaded };
  if (loaded) {
    result = await page.evaluate(() => {
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      return {
        attempted: true,
        loaded: true,
        heading: Boolean(document.querySelector('h1')),
        showroom: Boolean(document.querySelector('[data-mm-showroom]')),
        modelCards: document.querySelectorAll('.mm-model-card').length,
        visibleModelCards: [...document.querySelectorAll('.mm-model-card')].filter(visible).length,
        canonicalText: document.body.innerText.includes('451 Structural Envelope'),
        completeFamilyLabels: ['Structural Envelope', 'Pressure / Capacity', 'Closure / Flow', 'Method / Falsification'].every(label => document.body.innerText.includes(label)),
        noScriptMessage: document.querySelector('noscript')?.textContent || '',
        controls: document.querySelectorAll('.mm-stage button').length
      };
    });
    result.completeFallback = result.heading && result.showroom && result.canonicalText && result.completeFamilyLabels && result.visibleModelCards >= 1;
    if (!result.completeFallback) bump('GRID_AXIS_MISSING', { mode: 'NO_SCRIPT_CONTINUITY', result });
  }
  inputTests.noScript = result;
  await page.close();
}

{
  const viewport = VIEWPORTS.find(value => value.id === 'STANDARD_DESKTOP');
  const { page, loaded } = await makePage(viewport);
  let result = { attempted: true, loaded };
  if (loaded) {
    const trace = [];
    for (let index = 0; index < 32; index += 1) {
      await page.keyboard.press('Tab');
      trace.push(await page.evaluate(() => {
        const element = document.activeElement;
        const style = getComputedStyle(element);
        const rect = element?.getBoundingClientRect();
        return {
          tag: element?.tagName || '',
          id: element?.id || '',
          aria: element?.getAttribute('aria-label') || '',
          outline: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
          rect: rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null
        };
      }));
    }
    const visibleFocus = trace.filter(item => (item.outline !== 'none' && parseFloat(item.outlineWidth) > 0) || (item.boxShadow && item.boxShadow !== 'none')).length;
    result = {
      ...result,
      trace,
      uniqueFocusKeys: new Set(trace.map(item => `${item.tag}:${item.id}:${item.aria}`)).size,
      visibleFocusCount: visibleFocus,
      allFocusableStatesVisible: visibleFocus === trace.length
    };
    if (visibleFocus === 0) bump('CONTROL_OUTSIDE_SAFE_REGION', { mode: 'FOCUS_VISIBILITY', result });
  }
  inputTests.focus = result;
  await page.close();
}

const RISK_SHOTS = [
  ['SMALLEST_VIEWPORT', 'SMALL_PHONE', 0, 0, 0, 'OVERVIEW', 'STAGE'],
  ['LARGEST_VIEWPORT', 'WIDE_DESKTOP', 3, 6, 2, 'OVERVIEW', 'STAGE'],
  ['SHORTEST_VIEWPORT', 'SHORT_LAPTOP', 0, 1, 0, 'BROWSE', 'STAGE'],
  ['TABLET_PORTRAIT', 'LARGE_TABLET_PORTRAIT', 0, 5, 2, 'OVERVIEW', 'STAGE'],
  ['TABLET_LANDSCAPE', 'TABLET_LANDSCAPE', 1, 3, 1, 'OVERVIEW', 'STAGE'],
  ['DENSEST_FAMILY_PLANE', 'STANDARD_DESKTOP', 1, 6, 0, 'OVERVIEW', 'STAGE'],
  ['LONGEST_FAMILY_LABEL', 'STANDARD_DESKTOP', 3, 0, 0, 'OVERVIEW', 'STAGE'],
  ['LONGEST_MODEL_LABEL', 'STANDARD_DESKTOP', 1, 3, 0, 'OVERVIEW', 'STAGE'],
  ['LONGEST_LENS_LABEL', 'STANDARD_DESKTOP', 0, 0, 2, 'OVERVIEW', 'STAGE'],
  ['FAMILY_TRANSITION_STRUCTURE', 'STANDARD_DESKTOP', 0, 0, 0, 'OVERVIEW', 'STAGE'],
  ['FAMILY_TRANSITION_PRESSURE', 'STANDARD_DESKTOP', 1, 0, 0, 'OVERVIEW', 'STAGE'],
  ['FAMILY_TRANSITION_CLOSURE', 'STANDARD_DESKTOP', 2, 0, 0, 'OVERVIEW', 'STAGE'],
  ['FAMILY_TRANSITION_METHOD', 'STANDARD_DESKTOP', 3, 0, 0, 'OVERVIEW', 'STAGE'],
  ['CAMERA_OVERVIEW', 'STANDARD_DESKTOP', 0, 0, 0, 'OVERVIEW', 'STAGE'],
  ['CAMERA_BROWSE', 'STANDARD_DESKTOP', 0, 0, 0, 'BROWSE', 'STAGE'],
  ['INSPECTION_FOREGROUND', 'PHONE_PORTRAIT', 1, 3, 0, 'BROWSE', 'INSPECTION'],
  ['RETURN_RESTORATION_STATE', 'STANDARD_DESKTOP', 2, 3, 1, 'BROWSE', 'RETURN'],
  ['REDUCED_MOTION_STATE', 'STANDARD_DESKTOP', 0, 0, 0, 'OVERVIEW', 'REDUCED'],
  ['KEYBOARD_FOCUS_STATE', 'STANDARD_DESKTOP', 0, 0, 0, 'BROWSE', 'FOCUS'],
  ['KNOWN_FAILURE_FIXTURE', 'STANDARD_DESKTOP', 0, 1, 0, 'OVERVIEW', 'STAGE']
];

for (const spec of RISK_SHOTS) {
  const [risk, viewportId, z, x, y, camera, mode] = spec;
  const viewport = VIEWPORTS.find(value => value.id === viewportId);
  const { page, loaded } = await makePage(viewport, { reducedMotion: mode === 'REDUCED' });
  if (!loaded) {
    await page.close();
    continue;
  }
  const reach = await setCoordinate(page, z, x, y, viewport.id, `SCREENSHOT_${risk}`);
  if (!reach.reached) {
    bump('GRID_COORDINATE_MISMATCH', { risk, viewport: viewport.id, requested: expectedState(z, x, y), receipt: reach }, 'INVALID');
    await page.close();
    continue;
  }
  const cameraReceipt = await enterCameraObservation(page, camera, viewport.id, coordinateId(z, x, y));
  const activeInspectSelector = '.mm-model-card[data-position="active"] [data-mm-inspect], .mm-model-card[data-mm-x-position="active"] [data-mm-inspect]';
  if (mode === 'FOCUS') await page.focus(activeInspectSelector);
  if (mode === 'INSPECTION') {
    await page.evaluate(selector => document.querySelector(selector)?.click(), activeInspectSelector);
    await page.waitForSelector('dialog[open]', { timeout: 4000 }).catch(() => {});
  }
  if (mode === 'RETURN') {
    await page.evaluate(selector => document.querySelector(selector)?.click(), activeInspectSelector);
    await page.waitForSelector('dialog[open]', { timeout: 4000 }).catch(() => {});
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog')?.open, { timeout: 4000 }).catch(() => {});
  }
  await waitStable(page, 80);
  const file = `${safeName(EXECUTION_COMMIT.slice(0, 12))}__${viewportId}__${safeName(coordinateId(z, x, y))}__${camera}__${mode}__${risk}.png`;
  const target = path.join(SCREENSHOT_DIR, file);
  await page.screenshot({ path: target, fullPage: false });
  screenshotManifest.push({
    risk_class: risk,
    file: `screenshots/${file}`,
    sha256: sha256(target),
    viewport,
    coordinate_id: coordinateId(z, x, y),
    camera_state_requested: camera,
    native_camera_contract_declared: nativeCameraContractDeclared,
    native_camera_reached: cameraReceipt.native_reached,
    operational_camera_condition_reached: cameraReceipt.operational_condition_reached,
    display_mode: mode,
    state_reach_receipt_id: reach.receipt_id,
    camera_receipt_id: cameraReceipt.receipt_id
  });
  await page.close();
}

const checks = [];
for (const code of FINDING_CODES) {
  if (code === 'WRONG_EXACT_HEAD') {
    checks.push({
      finding_code: code,
      actual: EXECUTION_COMMIT === EXPECTED_SOURCE_HEAD ? 0 : 1,
      operator: 'eq', expected: 0, on_fail: 'INVALID', measurement_status: 'EVALUABLE',
      detection_method: ADAPTER_CONTRACT, evidence_reference: 'execution.candidate_source_head'
    });
    continue;
  }
  if (code === 'HARNESS_LOAD_FAILED') {
    checks.push({
      finding_code: code,
      actual: counts[code], operator: 'eq', expected: 0, on_fail: 'INVALID', measurement_status: 'EVALUABLE',
      detection_method: ADAPTER_CONTRACT, evidence_reference: `raw-observations.json#${code}`
    });
    continue;
  }
  if (code === 'REQUIRED_EVIDENCE_MISSING') {
    const missing = sourceFailures.length + (screenshotManifest.length < RISK_SHOTS.length ? 1 : 0);
    checks.push({
      finding_code: code,
      actual: missing, operator: 'eq', expected: 0, on_fail: 'UNEVALUABLE', measurement_status: 'EVALUABLE',
      detection_method: ADAPTER_CONTRACT, evidence_reference: `raw-observations.json#${code}`
    });
    continue;
  }
  for (const disposition of ['INVALID', 'UNEVALUABLE', 'FAIL']) {
    const actual = dispositionCounts[code][disposition];
    if (actual === 0 && disposition !== 'FAIL') continue;
    checks.push({
      finding_code: code,
      actual,
      operator: 'eq',
      expected: 0,
      on_fail: disposition,
      measurement_status: 'EVALUABLE',
      detection_method: ADAPTER_CONTRACT,
      evidence_reference: `raw-observations.json#${code}:${disposition}`
    });
  }
}

const primaryCounts = {
  stable_stage_attempts: stableAttemptCount,
  stable_stage_observations_recorded: observations.length,
  stable_semantic_coordinate_reaches: stableSemanticReachCount,
  operational_camera_condition_reaches: operationalCameraReachCount,
  native_camera_state_reaches: nativeCameraReachCount,
  inspection_return_attempts: inspectionAttemptCount,
  inspection_origin_state_reaches: inspectionStateReachCount,
  inspection_return_records: inspectionCycles.length,
  minimum_primary_attempts: stableAttemptCount + inspectionAttemptCount,
  expected_stable_stage: 1350,
  expected_inspection_return: 225,
  expected_total: 1575,
  complete_attempt_surface: stableAttemptCount === 1350 && inspectionAttemptCount === 225,
  complete_semantic_state_reach: stableSemanticReachCount === 1350 && inspectionStateReachCount === 225,
  native_camera_contract_declared: nativeCameraContractDeclared
};

const allInputEvidencePresent = ['keyboard', 'pointer', 'touch', 'reducedMotion', 'noScript', 'focus']
  .every(key => inputTests[key]?.attempted === true && inputTests[key]?.loaded === true);
const factorEvidenceComplete = {
  A: primaryCounts.complete_attempt_surface && stateReachReceipts.length >= 675 && cameraReceipts.length >= 1350,
  G: primaryCounts.complete_attempt_surface && observations.length === 1350,
  H: observations.length === 1350 && screenshotManifest.length === RISK_SHOTS.length,
  I: inspectionAttemptCount === 225 && inspectionCycles.length === 225,
  D: allInputEvidencePresent,
  W: familyRepresentative.length === 4,
  C: EXECUTION_COMMIT === EXPECTED_SOURCE_HEAD && sourceFailures.length === 0
};

const candidateEvidence = {
  instrument_version: '1.0.0',
  target: {
    candidate_head: EXECUTION_COMMIT,
    harness_head: HARNESS_COMMIT,
    target_url: ROUTE,
    exact_head_verified: EXECUTION_COMMIT === EXPECTED_SOURCE_HEAD,
    harness_loaded: counts.HARNESS_LOAD_FAILED === 0,
    required_source_present: sourceFailures.length === 0,
    evidence_contaminated: false,
    harness_class: 'NONPRODUCT_EXACT_HEAD_BROWSER_ADAPTER',
    adapter_contract: ADAPTER_CONTRACT
  },
  factor_evidence_complete: factorEvidenceComplete,
  checks,
  human_review: {
    required: true,
    delivery_complete: false,
    disposition: 'UNEVALUABLE_DELIVERY_OR_EVIDENCE_DEFECT'
  },
  screenshot_candidates: screenshotManifest
};

const raw = {
  contract: EXECUTION_CONTRACT,
  adapter_contract: ADAPTER_CONTRACT,
  instrument: INSTRUMENT,
  execution: {
    candidate_source_head: EXECUTION_COMMIT,
    harness_commit: HARNESS_COMMIT,
    expected_source_head: EXPECTED_SOURCE_HEAD,
    origin: ORIGIN,
    route: ROUTE,
    generated_at: new Date().toISOString()
  },
  sourcePresence,
  sourceAssertions,
  sourceFailures,
  primaryCounts,
  counts,
  dispositionCounts,
  examples,
  familyRepresentative,
  inputTests,
  consoleErrors,
  pageErrors,
  stateReachReceipts,
  cameraReceipts,
  observations,
  inspectionCycles,
  screenshotManifest
};

writeJson(path.join(OUT_DIR, 'raw-observations.json'), raw);
writeJson(path.join(OUT_DIR, 'candidate-evidence.json'), candidateEvidence);
writeJson(path.join(OUT_DIR, 'state-reach-receipts.json'), { adapter_contract: ADAPTER_CONTRACT, receipts: stateReachReceipts });
writeJson(path.join(OUT_DIR, 'camera-receipts.json'), { adapter_contract: ADAPTER_CONTRACT, native_camera_contract_declared: nativeCameraContractDeclared, receipts: cameraReceipts });
writeJson(path.join(OUT_DIR, 'screenshot-manifest.json'), { version: '1.0.0', exact_head: EXECUTION_COMMIT, selected: screenshotManifest });
writeJson(path.join(OUT_DIR, 'human-review-receipt.template.json'), {
  exact_candidate_head: EXECUTION_COMMIT,
  exact_review_artifact: 'GITHUB_ACTIONS_ARTIFACT_PENDING',
  reviewer_identity: 'REQUIRED',
  reviewer_role: 'HUMAN_VISUAL_REVIEWER',
  review_timestamp: 'REQUIRED',
  device_or_viewport: 'REQUIRED',
  reviewed_coordinates: [],
  reviewed_camera_states: ['OVERVIEW', 'BROWSE'],
  reviewed_inspection_states: [],
  disposition: 'REQUIRED',
  material_findings: [],
  accepted_limitations: [],
  evidence_references: screenshotManifest.map(entry => entry.file)
});

const totalFindingEvents = Object.values(counts).reduce((sum, value) => sum + value, 0);
const summary = `# Methods Euclidean Nonproduct Coherence Execution\n\n` +
  `- Adapter correction: \`${ADAPTER_CONTRACT}\`\n` +
  `- Exact source head: \`${EXECUTION_COMMIT}\`\n` +
  `- Stable-stage attempts: ${stableAttemptCount} / 1350\n` +
  `- Stable semantic state reaches: ${stableSemanticReachCount} / 1350\n` +
  `- Native camera states reached: ${nativeCameraReachCount} / 1350\n` +
  `- Inspection-return attempts: ${inspectionAttemptCount} / 225\n` +
  `- Inspection origin states reached: ${inspectionStateReachCount} / 225\n` +
  `- Minimum primary attempts: ${stableAttemptCount + inspectionAttemptCount} / 1575\n` +
  `- Screenshots: ${screenshotManifest.length} / ${RISK_SHOTS.length}\n` +
  `- Human review: pending\n` +
  `- Automated registered finding events: ${totalFindingEvents}\n\n` +
  `The adapter does not project coordinate or camera labels into the candidate DOM. An observation counts as a semantic reach only after the native family, model, lens, root datasets, active-state cardinality, and stable transition state all match.\n\n` +
  `This is nonproduct evidence. It does not authorize public mutation, merge, or product acceptance.\n`;
fs.writeFileSync(path.join(OUT_DIR, 'execution-summary.md'), summary);

const manifestFiles = [];
for (const relative of fs.readdirSync(OUT_DIR, { recursive: true })) {
  const file = path.join(OUT_DIR, relative);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    manifestFiles.push({ path: relative.replaceAll('\\', '/'), bytes: fs.statSync(file).size, sha256: sha256(file) });
  }
}
writeJson(path.join(OUT_DIR, 'artifact-digests.json'), {
  candidate_source_head: EXECUTION_COMMIT,
  harness_commit: HARNESS_COMMIT,
  adapter_contract: ADAPTER_CONTRACT,
  files: manifestFiles.sort((a, b) => a.path.localeCompare(b.path))
});

await browser.close();
console.log(JSON.stringify({
  adapter_contract: ADAPTER_CONTRACT,
  out_dir: OUT_DIR,
  primaryCounts,
  factorEvidenceComplete,
  sourceFailures,
  counts,
  dispositionCounts,
  screenshot_count: screenshotManifest.length,
  human_review: 'PENDING'
}, null, 2));
