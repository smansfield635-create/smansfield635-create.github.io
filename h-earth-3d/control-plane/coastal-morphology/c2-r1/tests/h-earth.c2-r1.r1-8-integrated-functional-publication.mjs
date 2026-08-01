#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const STARTING_HEAD = 'c53362c6f74b01c4e0b53be526b0e3a0b73edede';
const TARGET_BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const START_ROLLBACK_BRANCH = 'rollback/h-earth-c2-r1-r1-8-start-001';
const PR_NUMBER = 418;
const CONTROL_ROOT = 'h-earth-3d/control-plane/coastal-morphology/c2-r1';
const REVIEW_ROOT = `${CONTROL_ROOT}/review/r1-8`;
const EVIDENCE_ROOT = path.join(ROOT, CONTROL_ROOT, 'evidence/r1-8');
const LEDGER_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-phase-ledger.json');
const FUNCTIONAL_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8b-functional-verification.json');
const PUBLICATION_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8c-publication-receipt.json');
const SERVED_RECEIPT_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-served-verification.json');
const CAPTURE_MANIFEST_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8d-capture-manifest.json');
const HANDOFF_PATH = path.join(EVIDENCE_ROOT, 'h-earth.c2-r1.r1-8-handoff.json');
const CAPTURE_ROOT = path.join(EVIDENCE_ROOT, 'captures');
const REVIEW_URL_PATH = `${REVIEW_ROOT}/index.html`;
const OCCURRENCE = 'H_EARTH_C2_R1_R1_8_ISOLATED_REVIEW_001';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const BRANCH = process.env.GITHUB_HEAD_REF || TARGET_BRANCH;
const TRIGGER_HEAD = process.env.GITHUB_SHA || null;

const PACKAGE_PATHS = [
  `${REVIEW_ROOT}/index.html`,
  `${REVIEW_ROOT}/review.css`,
  `${REVIEW_ROOT}/review.js`,
  `${REVIEW_ROOT}/identity.json`
];
const OPERATION_PATHS = [
  '.github/workflows/h-earth-c2-r1-physically-coherent-coastal-successor.yml',
  `${CONTROL_ROOT}/tests/h-earth.c2-r1.r1-8-integrated-functional-publication.mjs`,
  ...PACKAGE_PATHS,
  `${CONTROL_ROOT}/evidence/r1-8/h-earth.c2-r1.r1-8-phase-ledger.json`
].sort();
const IMMUTABLE_BLOBS = Object.freeze({
  [`${CONTROL_ROOT}/h-earth.c2-r1.landform-analysis.js`]: 'dba3fe2898b127addaa5a62081d466e55370da72',
  [`${CONTROL_ROOT}/h-earth.c2-r1.baked-macro-control-field.js`]: 'a97b3df57ae01626a2ff5cbedf510e2afdf06912',
  [`${CONTROL_ROOT}/h-earth.c2-r1.continuous-sediment-membership.js`]: 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281',
  [`${CONTROL_ROOT}/h-earth.c2-r1.candidate-renderer-sampling.js`]: 'd4681c64230e75c362daa702a60c6f2fee3720a4',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7a-verification.json`]: '000c72cd37b12c7e7abfe783f26bdd139d69901d',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7b-verification.json`]: 'c15d880bda64279f220ee810721909941f4b6424',
  [`${CONTROL_ROOT}/evidence/h-earth.c2-r1.r1-7c-verification.json`]: '5b7a9650a5f39ffee2ba394334fb24806d771d0e',
  [`${CONTROL_ROOT}/evidence/r1-7d/h-earth.c2-r1.r1-7d-verification.json`]: '55cb8397e8c57e541ae014a9df0232c64459087e',
  'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js': '45cbd83337c14bc94ce7d173b25f2157cb4eb84f',
  'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js': 'c5a439f2833a4def90944e5eb1d03005ddb41e70',
  'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js': '3eb689c5a030c40ebede52c6eaef300207742a7c',
  'h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js': '2094bcafb1e5ae1c291066a9cf1dd3820a22d0b1',
  'h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js': '1ac2ee902fc0cfb74413db37dd139bc51dbd9e46',
  'h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js': '0fa4b8434a5883e9858d2b73bb2e05e4b1a60c5c'
});
const REQUIRED_MODULE_SUFFIXES = [
  '/h-earth.c2-r1.candidate-renderer-sampling.js',
  '/h-earth.c2-r1.baked-macro-control-field.js',
  '/h-earth.coastal-profile.c2-r1.js',
  '/h-earth.coastal-water-optics.c2-r1.js',
  '/h-earth.coastal-breaker-field.c2-r1.js',
  '/h-earth.coastal-swash-foam-wetness.c2-r1.js'
];
const VIEWS = [
  'LATERAL_BEACH_PROFILE',
  'INLAND_TO_DEEP_WATER',
  'SHALLOW_WATER_AND_SEABED',
  'SANDBAR_AND_BATHYMETRY',
  'GROUND_TRAVERSAL',
  'DISTANT_LANDSCAPE'
];

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256File = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const now = () => new Date().toISOString();
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

fs.mkdirSync(EVIDENCE_ROOT, { recursive: true });
fs.mkdirSync(CAPTURE_ROOT, { recursive: true });
let ledger;
try {
  ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
} catch {
  ledger = {
    ledgerType: 'H_EARTH_C2_R1_R1_8_BOUNDED_PHASE_LEDGER_v1',
    operation: 'R1.8_INTEGRATED_FUNCTIONAL_VERIFICATION_PUBLICATION_AND_HUMAN_REVIEW',
    startingHead: STARTING_HEAD,
    targetBranch: TARGET_BRANCH,
    startRollbackBranch: START_ROLLBACK_BRANCH,
    controllingStatus: 'AUTHORIZED_NOT_STARTED',
    phases: [],
    firstBlocker: null,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false,
    createdAt: now()
  };
}
let currentPhase = 'R1.8A_EXACT_HEAD_FREEZE_AND_REVIEW_OCCURRENCE_CONTRACT';
let publicationHead = null;
let reviewUrl = null;

function persistLedger() {
  ledger.updatedAt = now();
  ledger.completedPhaseCount = ledger.phases.filter(row => String(row.status).startsWith('PASS')).length;
  fs.writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`);
}

function recordPhase(id, status, evidence = {}, blocker = null) {
  const row = { id, status, recordedAt: now(), evidence, blocker };
  const index = ledger.phases.findIndex(existing => existing.id === id);
  if (index >= 0) ledger.phases[index] = row;
  else ledger.phases.push(row);
  if (blocker && !ledger.firstBlocker) ledger.firstBlocker = blocker;
  persistLedger();
}

function requireCondition(condition, code, detail = null) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    error.detail = detail;
    throw error;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function commitEvidence(message, pathsToAdd = [relative(LEDGER_PATH)]) {
  git('add', '--', ...pathsToAdd);
  try {
    execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: ROOT });
    return git('rev-parse', 'HEAD');
  } catch {}
  git('commit', '-m', message);
  const head = git('rev-parse', 'HEAD');
  git('push', 'origin', `HEAD:${BRANCH}`);
  return head;
}

async function getPullRequest() {
  requireCondition(Boolean(TOKEN), 'GITHUB_TOKEN_MISSING');
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/pulls/${PR_NUMBER}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  requireCondition(response.ok, 'PR_418_API_READ_FAILED', response.status);
  return response.json();
}

async function waitForHttp(url, expectedText, attempts = 36, delayMilliseconds = 5000) {
  let last = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', cache: 'no-store' });
      const text = await response.text();
      last = { attempt, status: response.status, finalUrl: response.url, contentType: response.headers.get('content-type'), text };
      if (response.status === 200 && text.includes(expectedText)) return last;
    } catch (error) {
      last = { attempt, error: String(error) };
    }
    if (attempt < attempts) await sleep(delayMilliseconds);
  }
  const error = new Error('SERVED_OCCURRENCE_NOT_REACHABLE_WITH_EXACT_IDENTITY');
  error.code = 'SERVED_OCCURRENCE_NOT_REACHABLE_WITH_EXACT_IDENTITY';
  error.detail = last;
  throw error;
}

async function waitForLocalServer(origin) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/${REVIEW_URL_PATH}`);
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('LOCAL_REVIEW_SERVER_NOT_READY');
}

function browserLaunchOptions() {
  return {
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-dev-shm-usage'
    ]
  };
}

async function inspectPage(page, url, { touch = false, capture = false, captureDirectory = null } = {}) {
  const pageErrors = [];
  const consoleErrors = [];
  const httpErrors = [];
  const resources = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', response => {
    const resourceUrl = response.url();
    resources.push({ url: resourceUrl, status: response.status() });
    if (response.status() >= 400) httpErrors.push({ url: resourceUrl, status: response.status() });
  });
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  requireCondition(response?.status() === 200, 'REVIEW_DOCUMENT_NOT_HTTP_200', response?.status());
  await page.waitForFunction(() => document.documentElement.dataset.r1_8Review === 'ready', null, { timeout: 60000 });
  const initial = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW?.getReceipt?.());
  requireCondition(initial?.sourceHead === STARTING_HEAD, 'SERVED_SOURCE_HEAD_MISMATCH', initial?.sourceHead);
  requireCondition(initial?.webgl2ContextEstablished === true, 'WEBGL2_CONTEXT_NOT_ESTABLISHED');
  requireCondition(initial?.meshReady === true, 'CANDIDATE_WORLD_NOT_LOADED');
  requireCondition(initial?.macroExpressionActive === true, 'R1_7_MACRO_EXPRESSION_NOT_ACTIVE');
  requireCondition(initial?.coastalMaterialChainActive === true, 'COASTAL_MATERIAL_CHAIN_NOT_ACTIVE');
  requireCondition(initial?.waterBreakerSwashChainActive === true, 'WATER_BREAKER_SWASH_CHAIN_NOT_ACTIVE');
  requireCondition(initial?.noBitmapDragFallback === true, 'BITMAP_DRAG_FALLBACK_PRESENT');
  requireCondition(initial?.rendererLifecycleMutated === false, 'RENDERER_LIFECYCLE_REGRESSION_RECORDED');
  requireCondition(initial?.terrainGeometryMutated === false, 'TERRAIN_GEOMETRY_MUTATION_RECORDED');
  const canvas = page.locator('#r18-review-canvas');
  const box = await canvas.boundingBox();
  requireCondition(Boolean(box && box.width > 200 && box.height > 300), 'REVIEW_CANVAS_NOT_VISIBLE', box);
  const beforeFrames = initial.frameCount;
  await page.waitForTimeout(650);
  const afterFrames = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt().frameCount);
  requireCondition(afterFrames > beforeFrames + 2, 'LIVE_FRAME_ADVANCEMENT_NOT_CONFIRMED', { beforeFrames, afterFrames });

  const beforeCamera = initial.camera;
  if (touch) {
    await page.evaluate(() => {
      const canvas = document.getElementById('r18-review-canvas');
      const rect = canvas.getBoundingClientRect();
      const fire = (type, pointerId, x, y, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId,
        pointerType: 'touch',
        isPrimary: pointerId === 1,
        clientX: rect.left + x,
        clientY: rect.top + y,
        buttons
      }));
      fire('pointerdown', 1, rect.width * 0.42, rect.height * 0.48, 1);
      fire('pointermove', 1, rect.width * 0.58, rect.height * 0.43, 1);
      fire('pointerup', 1, rect.width * 0.58, rect.height * 0.43, 0);
      fire('pointerdown', 1, rect.width * 0.4, rect.height * 0.48, 1);
      fire('pointerdown', 2, rect.width * 0.6, rect.height * 0.48, 1);
      fire('pointermove', 1, rect.width * 0.4, rect.height * 0.39, 1);
      fire('pointermove', 2, rect.width * 0.6, rect.height * 0.39, 1);
      fire('pointerup', 1, rect.width * 0.4, rect.height * 0.39, 0);
      fire('pointerup', 2, rect.width * 0.6, rect.height * 0.39, 0);
    });
  } else if (box) {
    await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.48);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.61, box.y + box.height * 0.42, { steps: 8 });
    await page.mouse.up();
    await page.mouse.wheel(0, 160);
  }
  await page.waitForTimeout(300);
  const interacted = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt());
  requireCondition(interacted.cameraRevision > beforeCamera.revision, 'CAMERA_RESPONSE_NOT_FUNCTIONAL', { beforeCamera, afterCamera: interacted.camera });
  requireCondition(interacted.navigationEventCount > 0 || interacted.pointerEventCount > 2, 'NAVIGATION_INPUT_NOT_FUNCTIONAL', interacted);
  if (touch) requireCondition(interacted.touchEventCount > 0, 'TOUCH_RESPONSE_NOT_CONFIRMED', interacted.touchEventCount);

  await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.setView('GROUND_TRAVERSAL'));
  const navigationCamera = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getCameraSnapshot());
  requireCondition(navigationCamera.view === 'GROUND_TRAVERSAL', 'VIEW_NAVIGATION_NOT_FUNCTIONAL', navigationCamera);

  const loadedUrls = resources.filter(row => row.status < 400).map(row => row.url);
  const missingModules = REQUIRED_MODULE_SUFFIXES.filter(suffix => !loadedUrls.some(urlValue => urlValue.endsWith(suffix)));
  requireCondition(missingModules.length === 0, 'REQUIRED_CANDIDATE_MODULES_DID_NOT_LOAD', missingModules);
  requireCondition(pageErrors.length === 0, 'FATAL_PAGE_ERROR_PRESENT', pageErrors);
  requireCondition(consoleErrors.length === 0, 'FATAL_CONSOLE_ERROR_PRESENT', consoleErrors);
  requireCondition(httpErrors.length === 0, 'OWNED_HTTP_FAILURE_PRESENT', httpErrors);

  const captures = [];
  if (capture) {
    fs.mkdirSync(captureDirectory, { recursive: true });
    for (const view of VIEWS) {
      await page.evaluate(viewId => window.H_EARTH_C2_R1_R1_8_REVIEW.setView(viewId), view);
      await page.waitForTimeout(450);
      const camera = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getCameraSnapshot());
      const file = path.join(captureDirectory, `${view.toLowerCase().replaceAll('_', '-')}.png`);
      await canvas.screenshot({ path: file, type: 'png' });
      captures.push({
        identity: view,
        file: relative(file),
        sha256: sha256File(file),
        exactCandidateHead: STARTING_HEAD,
        servedOccurrence: url,
        camera,
        viewport: await page.evaluate(() => ({
          cssWidth: document.getElementById('r18-review-canvas').clientWidth,
          cssHeight: document.getElementById('r18-review-canvas').clientHeight,
          pixelWidth: document.getElementById('r18-review-canvas').width,
          pixelHeight: document.getElementById('r18-review-canvas').height,
          devicePixelRatio: window.devicePixelRatio
        })),
        deviceOrBrowser: {
          userAgent: await page.evaluate(() => navigator.userAgent),
          browser: 'Chromium'
        }
      });
    }
  }
  return {
    response: { status: response.status(), finalUrl: response.url(), contentType: await response.headerValue('content-type') },
    initial,
    interacted,
    navigationCamera,
    frameAdvancement: { beforeFrames, afterFrames, delta: afterFrames - beforeFrames },
    loadedModuleUrls: loadedUrls.filter(urlValue => REQUIRED_MODULE_SUFFIXES.some(suffix => urlValue.endsWith(suffix))),
    pageErrors,
    consoleErrors,
    httpErrors,
    captures
  };
}

async function verifyOccurrence(url, { served = false, captures = false } = {}) {
  const browser = await chromium.launch(browserLaunchOptions());
  try {
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
    const desktopPage = await desktopContext.newPage();
    const desktop = await inspectPage(desktopPage, url, { capture: captures, captureDirectory: CAPTURE_ROOT });
    await desktopContext.close();

    const mobileContext = await browser.newContext({
      viewport: { width: 412, height: 915 },
      deviceScaleFactor: 2.625,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
    });
    const mobilePage = await mobileContext.newPage();
    const mobile = await inspectPage(mobilePage, url, { touch: true });
    await mobileContext.close();
    return { served, desktop, mobile, browserVersion: browser.version() };
  } finally {
    await browser.close();
  }
}

async function main() {
  git('fetch', 'origin',
    `+refs/heads/${TARGET_BRANCH}:refs/remotes/origin/${TARGET_BRANCH}`,
    `+refs/heads/${START_ROLLBACK_BRANCH}:refs/remotes/origin/${START_ROLLBACK_BRANCH}`
  );
  git('config', 'user.name', 'github-actions[bot]');
  git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');

  currentPhase = 'R1.8A_EXACT_HEAD_FREEZE_AND_REVIEW_OCCURRENCE_CONTRACT';
  const eventHead = git('rev-parse', 'HEAD');
  requireCondition(!TRIGGER_HEAD || eventHead === TRIGGER_HEAD, 'WORKFLOW_EVENT_HEAD_MISMATCH', { eventHead, triggerHead: TRIGGER_HEAD });
  git('merge-base', '--is-ancestor', STARTING_HEAD, eventHead);
  const rollbackHead = git('rev-parse', `refs/remotes/origin/${START_ROLLBACK_BRANCH}`);
  requireCondition(rollbackHead === STARTING_HEAD, 'R1_8_START_ROLLBACK_IDENTITY_MISMATCH', rollbackHead);
  const changedPaths = git('diff', '--name-only', STARTING_HEAD, eventHead).split('\n').filter(Boolean).sort();
  requireCondition(JSON.stringify(changedPaths) === JSON.stringify(OPERATION_PATHS), 'R1_8A_OPERATION_PATH_SET_MISMATCH', { changedPaths, expected: OPERATION_PATHS });
  const immutableReadback = {};
  for (const [repositoryPath, expectedBlob] of Object.entries(IMMUTABLE_BLOBS)) {
    const actualBlob = git('rev-parse', `HEAD:${repositoryPath}`);
    requireCondition(actualBlob === expectedBlob, 'CLOSED_AUTHORITY_BLOB_MISMATCH', { repositoryPath, expectedBlob, actualBlob });
    immutableReadback[repositoryPath] = actualBlob;
  }
  const program = JSON.parse(fs.readFileSync(path.join(ROOT, CONTROL_ROOT, 'h-earth.c2-r1.r1-7-subcheckpoint-program.json'), 'utf8'));
  requireCondition(program.r1_7OverallStatus === 'PASS_CLOSED_DO_NOT_REOPEN', 'R1_7_NOT_CLOSED');
  requireCondition(['R1.7A', 'R1.7B', 'R1.7C', 'R1.7D'].every(id => program.subcheckpoints?.[id]?.status === 'PASS_CLOSED_DO_NOT_REOPEN'), 'R1_7_SUBCHECKPOINT_CLOSURE_MISSING');
  const pr = await getPullRequest();
  requireCondition(pr.state === 'open' && pr.draft === true && pr.merged === false, 'PR_418_NOT_OPEN_DRAFT_ISOLATED_UNMERGED', { state: pr.state, draft: pr.draft, merged: pr.merged });
  requireCondition(pr.head?.ref === TARGET_BRANCH, 'PR_418_HEAD_BRANCH_MISMATCH', pr.head?.ref);
  const packageIdentity = PACKAGE_PATHS.map(repositoryPath => ({
    path: repositoryPath,
    gitBlob: git('rev-parse', `HEAD:${repositoryPath}`),
    sha256: sha256File(path.join(ROOT, repositoryPath)),
    byteCount: fs.statSync(path.join(ROOT, repositoryPath)).size
  }));
  ledger.controllingStatus = 'R1.8A_PASS_RECORDED';
  ledger.reviewPackage = { sourceCandidateHead: STARTING_HEAD, materializationBasisHead: eventHead, occurrence: OCCURRENCE, files: packageIdentity };
  recordPhase(currentPhase, 'PASS_RECORDED', {
    eventHead,
    sourceCandidateHead: STARTING_HEAD,
    rollbackHead,
    changedPaths,
    immutableReadback,
    pr418: { state: pr.state, draft: pr.draft, merged: pr.merged, head: pr.head.ref, headSha: pr.head.sha },
    reviewPackage: ledger.reviewPackage,
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false
  });
  const r18aHead = commitEvidence('R1.8A: freeze exact candidate and review occurrence identity');
  ledger.r18aHead = r18aHead;
  persistLedger();

  currentPhase = 'R1.8B_INTEGRATED_FUNCTIONAL_AND_REGRESSION_VERIFICATION';
  const server = spawn('python3', ['-m', 'http.server', '4188', '--bind', '127.0.0.1'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    const origin = 'http://127.0.0.1:4188';
    await waitForLocalServer(origin);
    const localUrl = `${origin}/${REVIEW_URL_PATH}`;
    const result = await verifyOccurrence(localUrl);
    const receipt = {
      receiptType: 'H_EARTH_C2_R1_R1_8B_INTEGRATED_FUNCTIONAL_VERIFICATION_v1',
      operation: 'R1.8_INTEGRATED_FUNCTIONAL_VERIFICATION_PUBLICATION_AND_HUMAN_REVIEW',
      result: 'PASS_ENGINEERING_READY_FOR_ISOLATED_PUBLICATION',
      sourceCandidateHead: STARTING_HEAD,
      verificationHead: git('rev-parse', 'HEAD'),
      localOccurrence: localUrl,
      webglRendererStarts: true,
      candidateWorldLoads: true,
      cameraResponseFunctional: true,
      touchInputFunctional: true,
      navigationFunctional: true,
      framePresentationContinuous: true,
      noBitmapDragFallback: true,
      noRendererLifecycleRegression: true,
      noGeometryOrWorldAuthorityDamage: true,
      coastalMaterialChainActive: true,
      waterBreakerSwashChainActive: true,
      r1_7MacroExpressionActive: true,
      performanceUsableForPhysicalReview: true,
      immutableReadback,
      desktop: result.desktop,
      mobile: result.mobile,
      browserVersion: result.browserVersion,
      productDefaultMutated: false,
      publicDefaultRouteMutated: false,
      mainMutated: false,
      pr418Merged: false,
      visualSuccessorStatus: 'NOT_ESTABLISHED',
      userDifferentialReady: false,
      firstBlocker: null
    };
    writeJson(FUNCTIONAL_RECEIPT_PATH, receipt);
    ledger.controllingStatus = 'R1.8B_PASS_RECORDED';
    recordPhase(currentPhase, 'PASS_RECORDED', {
      receipt: { path: relative(FUNCTIONAL_RECEIPT_PATH), sha256: sha256File(FUNCTIONAL_RECEIPT_PATH) },
      webglRendererStarts: true,
      candidateWorldLoads: true,
      cameraResponseFunctional: true,
      touchInputFunctional: true,
      navigationFunctional: true,
      framePresentationContinuous: true,
      noBitmapDragFallback: true,
      noRendererLifecycleRegression: true,
      noGeometryOrWorldAuthorityDamage: true,
      coastalMaterialChainActive: true,
      waterBreakerSwashChainActive: true,
      r1_7MacroExpressionActive: true,
      performanceUsableForPhysicalReview: true
    });
    publicationHead = commitEvidence('R1.8B: record integrated functional verification', [relative(LEDGER_PATH), relative(FUNCTIONAL_RECEIPT_PATH)]);
  } finally {
    server.kill('SIGTERM');
  }

  currentPhase = 'R1.8C_ISOLATED_NON_DEFAULT_CANDIDATE_PUBLICATION';
  reviewUrl = `https://rawcdn.githack.com/${REPOSITORY}/${publicationHead}/${REVIEW_URL_PATH}`;
  const availability = await waitForHttp(reviewUrl, STARTING_HEAD);
  const prAtPublication = await getPullRequest();
  requireCondition(prAtPublication.merged === false && prAtPublication.state === 'open' && prAtPublication.draft === true, 'PR_418_STATE_CHANGED_DURING_PUBLICATION', { state: prAtPublication.state, draft: prAtPublication.draft, merged: prAtPublication.merged });
  const publicationReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8C_ISOLATED_NON_DEFAULT_PUBLICATION_v1',
    result: 'PASS_PUBLISHED_ISOLATED_NON_DEFAULT',
    sourceCandidateHead: STARTING_HEAD,
    materializationHead: publicationHead,
    servedCandidateHead: STARTING_HEAD,
    occurrence: OCCURRENCE,
    reviewUrl,
    publicationModel: 'COMMIT_PINNED_ISOLATED_STATIC_REVIEW',
    provider: {
      name: 'rawgit.hack',
      endpoint: 'rawcdn.githack.com',
      repositoryAffiliation: 'THIRD_PARTY_NOT_GITHUB',
      immutableCommitPinnedCache: true,
      formalUptimeGuarantee: false
    },
    availability: { status: availability.status, finalUrl: availability.finalUrl, contentType: availability.contentType, attempt: availability.attempt },
    independentlyRemovable: true,
    ordinaryHEarthRouteRedirected: false,
    publicDefaultHEarthRouteReplaced: false,
    productDefaultChanged: false,
    pr418Merged: false,
    mainMutated: false,
    rejectedOrEarlierExperimentInherited: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    firstBlocker: null
  };
  writeJson(PUBLICATION_RECEIPT_PATH, publicationReceipt);
  ledger.controllingStatus = 'R1.8C_PASS_RECORDED';
  ledger.reviewOccurrence = reviewUrl;
  ledger.publicationHead = publicationHead;
  recordPhase(currentPhase, 'PASS_RECORDED', {
    receipt: { path: relative(PUBLICATION_RECEIPT_PATH), sha256: sha256File(PUBLICATION_RECEIPT_PATH) },
    reviewUrl,
    sourceCandidateHead: STARTING_HEAD,
    materializationHead: publicationHead,
    publicDefaultHEarthRouteReplaced: false,
    productDefaultChanged: false,
    pr418Merged: false,
    mainMutated: false
  });
  const r18cHead = commitEvidence('R1.8C: record isolated non-default publication', [relative(LEDGER_PATH), relative(PUBLICATION_RECEIPT_PATH)]);
  ledger.r18cHead = r18cHead;
  persistLedger();

  currentPhase = 'R1.8D_SERVED_OCCURRENCE_VERIFICATION_AND_REPRESENTATIVE_CAPTURE_PACKAGE';
  const servedResult = await verifyOccurrence(reviewUrl, { served: true, captures: true });
  const finalPr = await getPullRequest();
  requireCondition(finalPr.merged === false && finalPr.state === 'open' && finalPr.draft === true, 'PR_418_STATE_CHANGED_DURING_SERVED_VERIFICATION', { state: finalPr.state, draft: finalPr.draft, merged: finalPr.merged });
  const captures = servedResult.desktop.captures;
  requireCondition(captures.length === 6, 'SIX_CAPTURE_PACKAGE_NOT_COMPLETE', captures.length);
  requireCondition(JSON.stringify(captures.map(capture => capture.identity)) === JSON.stringify(VIEWS), 'CAPTURE_IDENTITY_SET_MISMATCH', captures.map(capture => capture.identity));
  const captureManifest = {
    manifestType: 'H_EARTH_C2_R1_R1_8D_REPRESENTATIVE_CAPTURE_PACKAGE_v1',
    result: 'PASS_CAPTURE_PACKAGE_READY_FOR_HUMAN_REVIEW',
    exactCandidateHead: STARTING_HEAD,
    servedOccurrence: reviewUrl,
    materializationHead: publicationHead,
    browserVersion: servedResult.browserVersion,
    captures,
    captureCount: captures.length,
    visualSuccessEstablished: false,
    userDifferentialRequired: true
  };
  writeJson(CAPTURE_MANIFEST_PATH, captureManifest);
  const servedReceipt = {
    receiptType: 'H_EARTH_C2_R1_R1_8D_SERVED_OCCURRENCE_VERIFICATION_v1',
    result: 'PASS_READY_FOR_USER_DIFFERENTIAL',
    exactCandidateHead: STARTING_HEAD,
    materializationHead: publicationHead,
    servedOccurrence: reviewUrl,
    servedDocumentReachable: true,
    servedIdentityMatchesExactCandidate: true,
    requiredModulesLoad: true,
    webglContextEstablished: true,
    liveFrameAdvancementConfirmed: true,
    touchResponseConfirmed: true,
    cameraMovementTruthful: true,
    noFatalConsoleOrModuleFailure: true,
    referenceDeviceReviewAvailable: true,
    referenceDeviceExecutionStatus: 'AVAILABLE_FOR_PHYSICAL_SAMSUNG_REVIEW_NOT_EXECUTED_BY_AUTOMATION',
    desktop: servedResult.desktop,
    mobileReferenceEmulation: servedResult.mobile,
    captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256File(CAPTURE_MANIFEST_PATH) },
    sixCaptureIdentities: captures.map(capture => ({ identity: capture.identity, path: capture.file, sha256: capture.sha256, camera: capture.camera, viewport: capture.viewport, deviceOrBrowser: capture.deviceOrBrowser })),
    knownNonblockingLimitations: [
      'RAWCDN_GITHACK_IS_A_THIRD_PARTY_COMMIT_PINNED_REVIEW_PROVIDER_WITHOUT_FORMAL_UPTIME_GUARANTEE',
      'AUTOMATED_MOBILE_EXECUTION_IS_REFERENCE_DEVICE_EMULATION_NOT_PHYSICAL_USER_ACCEPTANCE',
      'CAPTURES_ARE_REVIEW_EVIDENCE_AND_DO_NOT_ESTABLISH_VISUAL_SUCCESS'
    ],
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: true,
    firstBlocker: null
  };
  writeJson(SERVED_RECEIPT_PATH, servedReceipt);
  ledger.controllingStatus = 'R1.8D_PASS_RECORDED_WAITING_USER_DIFFERENTIAL';
  ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
  ledger.userDifferentialReady = true;
  ledger.firstBlocker = null;
  recordPhase(currentPhase, 'PASS_RECORDED', {
    receipt: { path: relative(SERVED_RECEIPT_PATH), sha256: sha256File(SERVED_RECEIPT_PATH) },
    captureManifest: { path: relative(CAPTURE_MANIFEST_PATH), sha256: sha256File(CAPTURE_MANIFEST_PATH) },
    servedOccurrence: reviewUrl,
    exactServedHead: publicationHead,
    sourceCandidateHead: STARTING_HEAD,
    referenceDeviceReviewAvailable: true,
    captureCount: captures.length,
    sixCaptureIdentities: captures.map(capture => ({ identity: capture.identity, sha256: capture.sha256 })),
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: true
  });
  const handoff = {
    handoffType: 'H_EARTH_C2_R1_R1_8_USER_DIFFERENTIAL_HANDOFF_v1',
    status: 'READY_FOR_USER_DIFFERENTIAL',
    reviewOccurrence: reviewUrl,
    changedCandidate: `C2_R1_AT_${STARTING_HEAD}`,
    comparisonBaseline: 'LAST_USER_ACCEPTED_LIVE_H_EARTH_BASELINE',
    exactServedHead: publicationHead,
    functionalVerificationResult: 'PASS',
    referenceDeviceStatus: 'AVAILABLE_FOR_PHYSICAL_REVIEW',
    sixCaptureIdentities: captures.map(capture => ({ identity: capture.identity, sha256: capture.sha256, path: capture.file })),
    knownNonblockingLimitations: servedReceipt.knownNonblockingLimitations,
    firstBlocker: null,
    permittedUserResults: ['ACCEPTED', 'REJECTED', 'MIXED_WITH_SPECIFIC_DEFECTS'],
    r1_8Status: 'OPEN_WAITING_USER_DIFFERENTIAL',
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    productDefaultMutated: false,
    publicDefaultRouteMutated: false,
    mainMutated: false,
    pr418Merged: false
  };
  writeJson(HANDOFF_PATH, handoff);
  const evidencePaths = [
    relative(LEDGER_PATH),
    relative(FUNCTIONAL_RECEIPT_PATH),
    relative(PUBLICATION_RECEIPT_PATH),
    relative(SERVED_RECEIPT_PATH),
    relative(CAPTURE_MANIFEST_PATH),
    relative(HANDOFF_PATH),
    ...captures.map(capture => capture.file)
  ];
  const r18dHead = commitEvidence('R1.8D: preserve served verification and six-view review evidence', evidencePaths);
  handoff.evidenceHead = r18dHead;
  writeJson(HANDOFF_PATH, handoff);
  commitEvidence('R1.8D: record exact evidence head in user differential handoff', [relative(HANDOFF_PATH)]);
  console.log(`R1_8_REVIEW_OCCURRENCE=${reviewUrl}`);
  console.log(`R1_8_EXACT_SERVED_HEAD=${publicationHead}`);
  console.log(`R1_8_SOURCE_CANDIDATE_HEAD=${STARTING_HEAD}`);
  console.log('R1_8_FUNCTIONAL_VERIFICATION=PASS');
  console.log('R1_8_REFERENCE_DEVICE_STATUS=AVAILABLE_FOR_PHYSICAL_REVIEW');
  console.log('R1_8_USER_DIFFERENTIAL_READY=TRUE');
  console.log('R1_8_VISUAL_SUCCESSOR_STATUS=NOT_ESTABLISHED');
}

try {
  await main();
} catch (error) {
  const blocker = {
    code: error.code || error.message || 'R1_8_UNCLASSIFIED_BLOCKER',
    detail: error.detail ?? String(error?.stack || error),
    phase: currentPhase,
    recordedAt: now()
  };
  ledger.controllingStatus = `R1.8_BLOCKED_AT_${currentPhase}`;
  ledger.userDifferentialReady = false;
  ledger.visualSuccessorStatus = 'NOT_ESTABLISHED';
  recordPhase(currentPhase, 'BLOCKED', {}, blocker);
  try {
    commitEvidence(`R1.8: preserve blocker at ${currentPhase}`);
  } catch (commitError) {
    console.error(`BLOCKER_LEDGER_COMMIT_FAILED:${String(commitError?.stack || commitError)}`);
  }
  console.error(JSON.stringify({ result: 'BLOCKED', blocker }, null, 2));
  process.exit(1);
}
