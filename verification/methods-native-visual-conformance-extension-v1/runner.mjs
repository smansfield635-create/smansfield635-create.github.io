import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {
  EXTENSION_CONTRACT,
  visibleArea,
  detectPairwiseCollisions,
  detectTransitionContext,
  detectVerticalBudget,
  detectCameraRoleDifferentiation,
  detectMobileRouteContinuity,
  validateHumanFactorsReceipt
} from './detectors.mjs';

const ORIGIN = process.env.METHODS_ORIGIN || 'http://127.0.0.1:4173';
const ROUTE = `${ORIGIN}/verification/methods-native-visual-architecture-v1/`;
const CHROME_PATH = process.env.CHROME_PATH;
const OUT_DIR = path.resolve(process.env.OUT_DIR || 'methods-native-visual-conformance-extension-v1-evidence');
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const CANDIDATE_HEAD = process.env.CANDIDATE_HEAD || 'UNKNOWN';
const HUMAN_RECEIPT_PATH = process.env.HUMAN_REVIEW_RECEIPT || '';
if (!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const viewports = [
  { id: 'SMALL_PHONE', width: 360, height: 800 },
  { id: 'LARGE_PHONE', width: 430, height: 932 },
  { id: 'TABLET_PORTRAIT', width: 768, height: 1024 },
  { id: 'SHORT_DESKTOP', width: 1180, height: 820 },
  { id: 'STANDARD_DESKTOP', width: 1440, height: 1000 }
];
const prohibitedPairs = [
  ['coordinatePanel', 'lensTabs'],
  ['coordinatePanel', 'lensPanel'],
  ['coordinatePanel', 'cameraControls'],
  ['coordinatePanel', 'card'],
  ['family', 'card'],
  ['cameraControls', 'family'],
  ['cameraControls', 'card'],
  ['modelControls', 'lensTabs']
];
const findings = [];
const observations = [];
const screenshots = [];

function record(viewport, state, finding) {
  findings.push({ viewport: viewport.id, state, code: finding.code, detail: finding.detail || {} });
}
function recordAll(viewport, state, items) {
  for (const item of items) record(viewport, state, item);
}
async function waitStable(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-mm-showroom]');
    return document.documentElement.dataset.methodsModelsNativeArchitecture === 'active' &&
      root?.dataset.mmEuclideanReady === 'true' && root?.dataset.mmNativeArchitecture === 'active' &&
      !root?.dataset.mmTransitioning;
  }, { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 180));
}
async function capture(page, viewport, state) {
  const file = `${viewport.id.toLowerCase()}-${state}.png`;
  const filePath = path.join(SCREENSHOT_DIR, file);
  await page.screenshot({ path: filePath, fullPage: false });
  const bytes = fs.readFileSync(filePath);
  screenshots.push({ file, viewport: viewport.id, state, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}

async function snapshot(page) {
  return page.evaluate(() => {
    const viewport = { width: innerWidth, height: innerHeight };
    const rect = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const r = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity || '1') <= .01) return null;
      return {
        left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        width: r.width, height: r.height,
        fontSize: Number.parseFloat(style.fontSize || '0'),
        overflowY: style.overflowY,
        borderRadius: style.borderRadius,
        borderWidth: style.borderWidth,
        backgroundColor: style.backgroundColor,
        transform: style.transform,
        opacity: Number.parseFloat(style.opacity || '1')
      };
    };
    const visible = value => {
      if (!value) return false;
      const left = Math.max(0, value.left);
      const top = Math.max(0, value.top);
      const right = Math.min(viewport.width, value.right);
      const bottom = Math.min(viewport.height, value.bottom);
      return Math.max(0, right - left) * Math.max(0, bottom - top) >= 64;
    };
    const surfaces = {
      topbar: rect('.mm-topbar'),
      stage: rect('.mm-stage'),
      title: rect('.mm-stage__header h2'),
      stageHeader: rect('.mm-stage__header'),
      cameraControls: rect('[data-mm-native-camera-controls]'),
      family: rect('.mm-family-tabs'),
      card: rect('.mm-model-card[data-mm-x-position="active"]'),
      modelControls: rect('.mm-deck-controls'),
      lensTabs: rect('.mm-lens-tabs'),
      lensPanel: rect('.mm-lens-panel'),
      coordinatePanel: rect('.mm-euclidean-coordinate'),
      progress: rect('.mm-progress'),
      status: rect('[data-mm-native-stage-status]'),
      continuation: rect('[data-mm-continuation-cue]')
    };
    const routeLink = hrefPart => Array.from(document.querySelectorAll('.mm-topbar a')).find(link => link.getAttribute('href')?.includes(hrefPart));
    const currentMethods = routeLink('/laws/research/methods-and-models/');
    const staticCatalog = routeLink('static-model-catalog');
    const routeRect = link => {
      if (!link) return null;
      const r = link.getBoundingClientRect();
      const style = getComputedStyle(link);
      if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity || '1') <= .01) return null;
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };
    const currentMethodsRect = routeRect(currentMethods);
    const staticCatalogRect = routeRect(staticCatalog);
    const menu = document.querySelector('[data-mm-mobile-navigation],button[aria-label*="navigation" i],button[aria-label*="menu" i]');
    const menuRect = routeRect(menu);
    const root = document.querySelector('[data-mm-showroom]');
    const stage = document.querySelector('.mm-stage');
    return {
      viewport,
      scrollY,
      pageHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      instrumentIdentity: root?.id || root?.dataset.mmNativeArchitecture || null,
      camera: document.body.dataset.mmCamera,
      coordinate: { x: root?.dataset.mmX, y: root?.dataset.mmY, z: root?.dataset.mmZ },
      surfaces,
      visibility: Object.fromEntries(Object.entries(surfaces).map(([key, value]) => [key, visible(value)])),
      stageOverflowY: stage ? getComputedStyle(stage).overflowY : null,
      continuation: {
        visible: visible(surfaces.continuation),
        semanticLabel: Boolean(document.querySelector('[data-mm-continuation-cue]')?.getAttribute('aria-label') || document.querySelector('[data-mm-continuation-cue]')?.textContent?.trim())
      },
      routes: {
        currentMethodsPresent: Boolean(currentMethods),
        currentMethodsVisible: visible(currentMethodsRect),
        staticCatalogVisible: visible(staticCatalogRect),
        singleActionNavigationVisible: visible(menuRect)
      }
    };
  });
}

function cameraRoleMetrics(data) {
  const viewportArea = data.viewport.width * data.viewport.height;
  const contextNames = ['title', 'cameraControls', 'family', 'lensTabs', 'coordinatePanel'];
  const contextVisibilityCount = contextNames.filter(name => data.visibility[name]).length;
  const contextArea = contextNames.reduce((sum, name) => sum + visibleArea(data.surfaces[name], data.viewport), 0);
  return {
    cardAreaRatio: visibleArea(data.surfaces.card, data.viewport) / viewportArea,
    contextVisibilityCount,
    contextAreaRatio: contextArea / viewportArea
  };
}

function evaluateSnapshot(viewport, state, data) {
  recordAll(viewport, state, detectPairwiseCollisions(data, prohibitedPairs));
  recordAll(viewport, state, detectVerticalBudget(data));
  if (data.surfaces.title?.fontSize < 28) record(viewport, state, { code: 'TITLE_BELOW_MINIMUM_LEGIBILITY', detail: { fontSize: data.surfaces.title.fontSize } });
  if (data.pageHeight > viewport.height && data.surfaces.stage?.bottom > viewport.height && !data.continuation.visible && data.stageOverflowY === 'visible') {
    record(viewport, state, { code: 'PAGE_FRAGMENT_CONTINUATION_UNSIGNALLED', detail: { pageHeight: data.pageHeight, stageBottom: data.surfaces.stage.bottom, viewportHeight: viewport.height } });
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
try {
  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
    await page.goto(ROUTE, { waitUntil: 'networkidle0', timeout: 30000 });
    await waitStable(page);

    const routeState = await snapshot(page);
    recordAll(viewport, 'route-orientation', detectMobileRouteContinuity(routeState));

    await page.evaluate(() => document.querySelector('[data-mm-showroom]')?.scrollIntoView({ block: 'start' }));
    await new Promise(resolve => setTimeout(resolve, 120));
    const overview = await snapshot(page);
    observations.push({ viewport: viewport.id, state: 'overview', snapshot: overview });
    evaluateSnapshot(viewport, 'overview', overview);
    await capture(page, viewport, 'overview');

    await page.click('[data-mm-camera="browse"]');
    await waitStable(page);
    const browse = await snapshot(page);
    observations.push({ viewport: viewport.id, state: 'browse', snapshot: browse });
    evaluateSnapshot(viewport, 'browse', browse);
    recordAll(viewport, 'overview-browse', detectCameraRoleDifferentiation(cameraRoleMetrics(overview), cameraRoleMetrics(browse)));
    await capture(page, viewport, 'browse');

    await page.click('[data-mm-camera="overview"]');
    await waitStable(page);
    await page.evaluate(() => document.querySelector('[data-mm-showroom]')?.scrollIntoView({ block: 'start' }));
    await new Promise(resolve => setTimeout(resolve, 120));
    const beforeFamily = await snapshot(page);
    const familyButtons = await page.$$('[data-mm-family-tabs] .mm-family-tab');
    if (!familyButtons[3]) throw new Error(`METHOD_FAMILY_CONTROL_MISSING:${viewport.id}`);
    await familyButtons[3].click();
    await waitStable(page);
    const afterFamily = await snapshot(page);
    recordAll(viewport, 'family-transition', detectTransitionContext(beforeFamily, afterFamily));

    const beforeEvidence = await snapshot(page);
    await page.click('[data-mm-lens-tab="evidence"]');
    await waitStable(page);
    const dense = await snapshot(page);
    observations.push({ viewport: viewport.id, state: 'method-evidence', snapshot: dense });
    recordAll(viewport, 'evidence-transition', detectTransitionContext(beforeEvidence, dense));
    evaluateSnapshot(viewport, 'method-evidence', dense);
    if (viewport.width <= 760 && (!dense.visibility.title || !dense.visibility.cameraControls)) {
      record(viewport, 'method-evidence', {
        code: 'MOBILE_STATE_CONTEXT_NOT_PRESERVED',
        detail: { titleVisible: dense.visibility.title, cameraVisible: dense.visibility.cameraControls, scrollY: dense.scrollY }
      });
    }
    await capture(page, viewport, 'method-evidence');
    await page.close();
  }
} finally {
  await browser.close();
}

let humanReceipt = null;
if (HUMAN_RECEIPT_PATH && fs.existsSync(HUMAN_RECEIPT_PATH)) humanReceipt = JSON.parse(fs.readFileSync(HUMAN_RECEIPT_PATH, 'utf8'));
const humanFactors = validateHumanFactorsReceipt(humanReceipt);
const automatedDisposition = findings.length === 0 ? 'PASS_AUTOMATED_VISUAL_CONFORMANCE' : 'FAIL_AUTOMATED_VISUAL_CONFORMANCE';
const finalDisposition = findings.length > 0
  ? automatedDisposition
  : humanFactors.status === 'PASS_HUMAN_FACTORS'
    ? 'PASS_CLOSED_VISUAL_CONFORMANCE'
    : humanFactors.status;

const humanReviewTemplate = {
  contract: `${EXTENSION_CONTRACT}_HUMAN_FACTORS_RECEIPT`,
  candidateHead: CANDIDATE_HEAD,
  reviewer: { id: '', type: 'HUMAN' },
  judgments: {
    visualWeightHierarchy: '',
    methodsIdentity: '',
    visualRhythm: '',
    perceptualEffort: '',
    cameraRoleClarity: '',
    mobileContextContinuity: ''
  },
  notes: '',
  signedAt: ''
};
const result = {
  contract: EXTENSION_CONTRACT,
  version: '1.0.0',
  candidateHead: CANDIDATE_HEAD,
  route: ROUTE,
  publicMethodsMutation: false,
  legacyInstrumentPreserved: true,
  viewportCount: viewports.length,
  observationCount: observations.length,
  screenshotCount: screenshots.length,
  findingCount: findings.length,
  findingCodes: [...new Set(findings.map(item => item.code))].sort(),
  automatedDisposition,
  humanFactors,
  finalDisposition,
  findings,
  observations,
  screenshots
};
fs.writeFileSync(path.join(OUT_DIR, 'visual-conformance-extension-result.json'), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'findings.json'), JSON.stringify(findings, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'screenshot-manifest.json'), JSON.stringify(screenshots, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'human-factors-receipt-template.json'), JSON.stringify(humanReviewTemplate, null, 2));
console.log(JSON.stringify({ contract: result.contract, candidateHead: result.candidateHead, findingCount: result.findingCount, findingCodes: result.findingCodes, automatedDisposition: result.automatedDisposition, humanFactors: result.humanFactors.status, finalDisposition: result.finalDisposition }, null, 2));
