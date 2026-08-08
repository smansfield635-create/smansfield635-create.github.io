import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.M1_BASE_URL || 'http://127.0.0.1:4173';
const ROUTE = '/control-plane/whole-estate/tests-l0-l1-compass-integrated-m1-v1/';
const OUT = process.env.M1_RUNTIME_EVIDENCE_DIR || '/tmp/m1-compass-integrated-runtime-evidence';
const SUBJECT = '0c84cc4bb5b75245d225a47fde68d3de879cdaed';
const EXPECTED_OBJECTS = [
  ['METHODS', 'METHOD'],
  ['ROUTE_OPERATOR_PLATFORM', 'METHOD'],
  ['PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'TEST_INSTANCE'],
];
const EXPECTED_RELATIONS = [
  ['METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'METHODS', 'GOVERNS_PROCEDURE_FOR', 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO'],
  ['ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'ROUTE_OPERATOR_PLATFORM', 'EXECUTES', 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO'],
];
const PROFILES = [
  { id: 'DESKTOP', width: 1440, height: 1000 },
  { id: 'TABLET_RUNTIME', width: 820, height: 1180 },
  { id: 'PHONE_RUNTIME', width: 390, height: 844 },
];

fs.mkdirSync(OUT, { recursive: true });
const checks = [];
const failures = [];
let assertions = 0;

function record(name, condition, details = null) {
  assertions += 1;
  const entry = { name, status: condition ? 'PASS' : 'FAIL', details };
  checks.push(entry);
  if (!condition) failures.push(entry);
}

function stable(value) {
  return JSON.stringify(value);
}

function equal(name, actual, expected) {
  record(name, stable(actual) === stable(expected), { actual, expected });
}

async function waitForReady(page) {
  await page.waitForFunction(() => Boolean(globalThis.__M1_COMPASS_INTEGRATED_API__), null, { timeout: 15000 });
  await page.waitForFunction(() => (
    document.querySelectorAll('.object-node').length === 3 &&
    document.querySelectorAll('#relation-paths path[data-relation-id]').length === 2
  ), null, { timeout: 15000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function navigationState(page) {
  return page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.getNavigationState());
}

async function currentReceipt(page) {
  return page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_RECEIPT__);
}

async function semanticSnapshot(page) {
  return page.evaluate(() => ({
    candidate: document.querySelector('[data-candidate]')?.dataset.candidate ?? null,
    layerBoundary: document.querySelector('[data-layer-boundary]')?.dataset.layerBoundary ?? null,
    semanticLayout: document.querySelector('[data-semantic-layout]')?.dataset.semanticLayout ?? null,
    objects: [...document.querySelectorAll('.object-node')].map((node) => ({
      id: node.dataset.objectId,
      className: node.dataset.objectClass,
      label: node.querySelector('.object-node-label')?.textContent ?? '',
    })).sort((a, b) => a.id.localeCompare(b.id)),
    relations: [...document.querySelectorAll('#relation-paths path[data-relation-id]')].map((node) => ({
      id: node.dataset.relationId,
      source: node.dataset.sourceObject,
      relation: node.dataset.relation,
      target: node.dataset.targetObject,
    })).sort((a, b) => a.id.localeCompare(b.id)),
    projectionControls: [...document.querySelectorAll('.projection-control')].map((node) => ({
      id: node.dataset.projection,
      disabled: node.disabled,
      ariaDisabled: node.getAttribute('aria-disabled'),
      pressed: node.getAttribute('aria-pressed'),
    })).sort((a, b) => a.id.localeCompare(b.id)),
    relationKey: [...document.querySelectorAll('.relation-key-item')].map((node) => node.textContent.trim()).sort(),
  }));
}

async function assertSemanticInvariant(page, baseline, fixture) {
  const current = await semanticSnapshot(page);
  record(`${fixture}:SCIENTIFIC_PRESENTATION_GRAPH_UNCHANGED`, stable(current) === stable(baseline), { baseline, current });
}

async function fieldVisualState(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector('#spatial-viewport');
    const vr = viewport.getBoundingClientRect();
    const nodes = [...document.querySelectorAll('.object-node')].map((node) => {
      const r = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        id: node.dataset.objectId,
        active: node.dataset.active,
        pressed: node.getAttribute('aria-pressed'),
        tabIndex: node.tabIndex,
        opacity: Number(style.opacity),
        width: r.width,
        height: r.height,
        left: r.left - vr.left,
        right: r.right - vr.left,
        top: r.top - vr.top,
        bottom: r.bottom - vr.top,
        transform: style.transform,
        visible: r.width > 0 && r.height > 0 && Number(style.opacity) > 0.1,
      };
    });
    const relations = [...document.querySelectorAll('#relation-paths path[data-relation-id]')].map((node) => ({
      id: node.dataset.relationId,
      d: node.getAttribute('d') || '',
      incident: node.dataset.incident,
    }));
    return {
      viewport: { width: vr.width, height: vr.height, depth: viewport.dataset.depth },
      nodes,
      relations,
      activeCount: nodes.filter((node) => node.active === 'true').length,
      pressedCount: nodes.filter((node) => node.pressed === 'true').length,
      tabStopCount: nodes.filter((node) => node.tabIndex === 0).length,
    };
  });
}

function nodeIds(snapshot) {
  return snapshot.objects.map(({ id, className }) => [id, className]).sort((a, b) => a[0].localeCompare(b[0]));
}

function relationIds(snapshot) {
  return snapshot.relations.map(({ id, source, relation, target }) => [id, source, relation, target]).sort((a, b) => a[0].localeCompare(b[0]));
}

async function resetToEntry(page) {
  await page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.restoreEntryContext());
  await page.waitForFunction(() => {
    const state = globalThis.__M1_COMPASS_INTEGRATED_API__.getNavigationState();
    return state.activeObject === 'METHODS' && state.orientation.depth === 'L1';
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function verifyRuntime(browser) {
  const context = await browser.newContext({ viewport: { width: PROFILES[0].width, height: PROFILES[0].height } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);

  const baseline = await semanticSnapshot(page);
  record('BOOT:CANDIDATE_IDENTITY', baseline.candidate === 'M1_COMPASS_INTEGRATED', baseline.candidate);
  record('BOOT:LAYER_BOUNDARY', baseline.layerBoundary === 'L_MINUS_1_L0_L1', baseline.layerBoundary);
  record('BOOT:NONSEMANTIC_LAYOUT', baseline.semanticLayout === 'NONSEMANTIC', baseline.semanticLayout);
  equal('BOOT:OBJECT_IDENTITIES_AND_CLASSES', nodeIds(baseline), [...EXPECTED_OBJECTS].sort((a, b) => a[0].localeCompare(b[0])));
  equal('BOOT:RELATION_IDENTITIES_AND_DIRECTIONS', relationIds(baseline), [...EXPECTED_RELATIONS].sort((a, b) => a[0].localeCompare(b[0])));
  record('BOOT:RELATION_KEY_COUNT', baseline.relationKey.length === 2, baseline.relationKey);

  const bootState = await navigationState(page);
  record('ENTRY:INITIAL_ACTIVE_OBJECT', bootState.activeObject === 'METHODS', bootState);
  record('ENTRY:INITIAL_DEPTH_L1', bootState.orientation.depth === 'L1', bootState);
  record('ENTRY:THREE_OBJECT_FIELD', bootState.objectIds.length === 3, bootState.objectIds);
  const entryContext = await page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.getEntryContext());
  record('ENTRY:CONTEXT_CAPTURED', entryContext?.projection === 'METHODS' && entryContext?.activeObject === 'METHODS' && entryContext?.orientation?.depth === 'L1' && entryContext?.source === 'TESTS_NAVIGATION_CONTEXT' && entryContext?.semanticMutation === false, entryContext);
  const bootReceipt = await currentReceipt(page);
  record('ENTRY:INITIAL_BINDING_RECEIPT', bootReceipt?.candidate === 'M1_COMPASS_INTEGRATED' && bootReceipt?.modality === 'INITIAL_BINDING' && bootReceipt?.semanticMutation === false && bootReceipt?.scientificStateMutation === false, bootReceipt);

  const methodsControl = baseline.projectionControls.find((item) => item.id === 'METHODS');
  record('L0:METHODS_ACTIVE', methodsControl?.disabled === false && methodsControl?.pressed === 'true', methodsControl);
  for (const projection of ['MODELS', 'EXPERIMENTS', 'EVIDENCE']) {
    const control = baseline.projectionControls.find((item) => item.id === projection);
    record(`L0:${projection}_WITHHELD`, control?.disabled === true && control?.ariaDisabled === 'true', control);
  }

  const surface = await page.evaluate(() => ({
    anchors: [...document.querySelectorAll('a[href]')].map((node) => node.getAttribute('href')),
    prohibitedControls: document.querySelectorAll('[data-operation="INSPECT"], [data-operation="FOLLOW"], [data-operation="ENTER"], [data-inspect], [data-follow], [data-enter], [data-provenance-route]').length,
  }));
  record('BOUNDARY:NO_NAVIGATING_ANCHORS', surface.anchors.length === 0, surface.anchors);
  record('BOUNDARY:NO_L2_L3_L4_CONTROLS', surface.prohibitedControls === 0, surface.prohibitedControls);

  let visual = await fieldVisualState(page);
  record('NEIGHBORS:ALL_THREE_VISIBLE_AT_ENTRY', visual.nodes.length === 3 && visual.nodes.every((node) => node.visible), visual);
  record('FOCUS:SINGULAR_ACTIVE_AT_ENTRY', visual.activeCount === 1 && visual.pressedCount === 1 && visual.tabStopCount === 1, visual);
  record('RELATIONS:GEOMETRY_VALID_AT_ENTRY', visual.relations.length === 2 && visual.relations.every((entry) => entry.d.startsWith('M ') && !entry.d.includes('NaN')), visual.relations);

  for (const [id] of EXPECTED_OBJECTS) {
    await page.locator(`[data-object-id="${id}"]`).click();
    const state = await navigationState(page);
    const receipt = await currentReceipt(page);
    record(`FOCUS:POINTER:${id}`, state.activeObject === id && receipt?.modality === 'POINTER_OR_ACTIVATION' && receipt?.semanticMutation === false, { state, receipt });
    visual = await fieldVisualState(page);
    record(`NEIGHBORS:POINTER:${id}:RETAINED`, visual.nodes.length === 3 && visual.nodes.every((node) => node.visible) && visual.activeCount === 1, visual);
    await assertSemanticInvariant(page, baseline, `FOCUS:POINTER:${id}`);
  }

  await resetToEntry(page);

  await page.locator('#focus-next').click();
  let state = await navigationState(page);
  record('CONTROL:NEXT', state.activeObject === 'ROUTE_OPERATOR_PLATFORM', state);
  let receipt = await currentReceipt(page);
  record('CONTROL:NEXT_RECEIPT', receipt?.modality === 'CONTROL' && receipt?.semanticMutation === false, receipt);
  await page.locator('#focus-previous').click();
  state = await navigationState(page);
  record('CONTROL:PREVIOUS', state.activeObject === 'METHODS', state);
  await assertSemanticInvariant(page, baseline, 'CONTROL:PREVIOUS_NEXT');

  const methodsNode = page.locator('[data-object-id="METHODS"]');
  await methodsNode.focus();
  await methodsNode.press('ArrowRight');
  state = await navigationState(page);
  record('KEYBOARD:OBJECT_ARROWRIGHT', state.activeObject === 'ROUTE_OPERATOR_PLATFORM', state);
  receipt = await currentReceipt(page);
  record('KEYBOARD:OBJECT_RECEIPT', receipt?.modality === 'KEYBOARD', receipt);
  await page.locator('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').press('End');
  state = await navigationState(page);
  record('KEYBOARD:OBJECT_END', state.activeObject === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO', state);
  await page.locator('[data-object-id="PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]').press('Home');
  state = await navigationState(page);
  record('KEYBOARD:OBJECT_HOME', state.activeObject === 'METHODS', state);
  await assertSemanticInvariant(page, baseline, 'KEYBOARD:OBJECT_ROUTE');

  await page.locator('#spatial-viewport').focus();
  await page.locator('#spatial-viewport').press('ArrowRight');
  state = await navigationState(page);
  record('KEYBOARD:VIEWPORT_ARROWRIGHT', state.activeObject === 'ROUTE_OPERATOR_PLATFORM', state);
  receipt = await currentReceipt(page);
  record('KEYBOARD:VIEWPORT_RECEIPT', receipt?.modality === 'VIEWPORT_KEYBOARD', receipt);
  await assertSemanticInvariant(page, baseline, 'KEYBOARD:VIEWPORT_ROUTE');

  await resetToEntry(page);
  const viewportBox = await page.locator('#spatial-viewport').boundingBox();
  await page.mouse.move(viewportBox.x + viewportBox.width * 0.5, viewportBox.y + viewportBox.height * 0.88);
  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(240);
  state = await navigationState(page);
  record('WHEEL:NEXT_FOCUS', state.activeObject === 'ROUTE_OPERATOR_PLATFORM', state);
  receipt = await currentReceipt(page);
  record('WHEEL:RECEIPT', receipt?.modality === 'WHEEL' && receipt?.semanticMutation === false, receipt);
  await assertSemanticInvariant(page, baseline, 'WHEEL');

  await resetToEntry(page);
  const dragBox = await page.locator('#spatial-viewport').boundingBox();
  const y = dragBox.y + dragBox.height * 0.9;
  const x0 = dragBox.x + dragBox.width * 0.72;
  const x1 = dragBox.x + dragBox.width * 0.18;
  await page.mouse.move(x0, y);
  await page.mouse.down();
  await page.mouse.move(x1, y, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(80);
  state = await navigationState(page);
  receipt = await currentReceipt(page);
  record('DIRECT_MANIPULATION:FOCUS_CHANGED', state.activeObject !== 'METHODS', { state, receipt });
  record('DIRECT_MANIPULATION:RECEIPT', receipt?.modality === 'DIRECT_MANIPULATION' && receipt?.semanticMutation === false, receipt);
  visual = await fieldVisualState(page);
  record('DIRECT_MANIPULATION:NEIGHBORS_RETAINED', visual.nodes.length === 3 && visual.nodes.every((node) => node.visible), visual);
  await assertSemanticInvariant(page, baseline, 'DIRECT_MANIPULATION');

  const focusBeforeDepth = (await navigationState(page)).activeObject;
  await page.locator('[data-depth="L0"]').click();
  state = await navigationState(page);
  record('DEPTH:L0_ENTERED', state.orientation.depth === 'L0' && state.activeObject === focusBeforeDepth, state);
  receipt = await currentReceipt(page);
  record('DEPTH:L0_RECEIPT', receipt?.modality === 'DEPTH_CONTROL' && receipt?.semanticMutation === false, receipt);
  visual = await fieldVisualState(page);
  record('DEPTH:L0_NEIGHBORS_RETAINED', visual.viewport.depth === 'L0' && visual.nodes.length === 3 && visual.nodes.every((node) => node.visible), visual);
  await page.locator('[data-depth="L1"]').click();
  state = await navigationState(page);
  record('DEPTH:L1_RETURNED', state.orientation.depth === 'L1' && state.activeObject === focusBeforeDepth, state);
  await assertSemanticInvariant(page, baseline, 'DEPTH:L0_L1');

  const persistedFocus = state.activeObject;
  const revisionBeforeResize = state.revision;
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  state = await navigationState(page);
  record('FIELD_STATE:FOCUS_PERSISTS_THROUGH_RESIZE', state.activeObject === persistedFocus, state);
  record('FIELD_STATE:RESIZE_DOES_NOT_MUTATE_REVISION', state.revision === revisionBeforeResize, { revisionBeforeResize, state });
  const continuity = await page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.getContinuityState());
  record('CONTINUITY:SNAPSHOT_MATCHES_CURRENT_FOCUS', continuity?.activeObject === persistedFocus && continuity?.semanticMutation === false, continuity);

  await page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.focus('PROSPECTIVE_FINAL_REPORT_PORTFOLIO'));
  await page.evaluate(() => globalThis.__M1_COMPASS_INTEGRATED_API__.setDepth('L0'));
  const beforeRestore = await navigationState(page);
  record('RETURN:PRECONDITION_CHANGED', beforeRestore.activeObject === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO' && beforeRestore.orientation.depth === 'L0', beforeRestore);
  await page.locator('#restore-entry-context').click();
  await page.waitForFunction(() => {
    const current = globalThis.__M1_COMPASS_INTEGRATED_API__.getNavigationState();
    return current.activeObject === 'METHODS' && current.orientation.depth === 'L1';
  });
  state = await navigationState(page);
  receipt = await currentReceipt(page);
  record('RETURN:ENTRY_CONTEXT_RESTORED', state.activeObject === 'METHODS' && state.orientation.depth === 'L1' && Number.isFinite(state.orientation.angle), state);
  record('RETURN:RECEIPT', receipt?.modality === 'RETURN_CONTEXT_RESTORE' && receipt?.semanticMutation === false && receipt?.scientificStateMutation === false, receipt);
  await assertSemanticInvariant(page, baseline, 'RETURN:RESTORE_ENTRY_CONTEXT');

  const beforeInvalidFocus = await navigationState(page);
  const invalidFocus = await page.evaluate(() => {
    try { globalThis.__M1_COMPASS_INTEGRATED_API__.focus('NOT_AUTHORIZED'); return { threw: false }; }
    catch (error) { return { threw: true, message: String(error?.message || error) }; }
  });
  record('FAIL_CLOSED:INVALID_FOCUS_REJECTED', invalidFocus.threw === true && invalidFocus.message.includes('C04_FOCUS_TARGET_INVALID'), invalidFocus);
  equal('FAIL_CLOSED:INVALID_FOCUS_STATE_UNCHANGED', await navigationState(page), beforeInvalidFocus);

  const beforeInvalidDepth = await navigationState(page);
  const invalidDepth = await page.evaluate(() => {
    try { globalThis.__M1_COMPASS_INTEGRATED_API__.setDepth('L2'); return { threw: false }; }
    catch (error) { return { threw: true, message: String(error?.message || error) }; }
  });
  record('FAIL_CLOSED:INVALID_DEPTH_REJECTED', invalidDepth.threw === true && invalidDepth.message.includes('DEPTH_TARGET_INVALID'), invalidDepth);
  equal('FAIL_CLOSED:INVALID_DEPTH_STATE_UNCHANGED', await navigationState(page), beforeInvalidDepth);

  for (const profile of PROFILES) {
    await resetToEntry(page);
    await page.setViewportSize({ width: profile.width, height: profile.height });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    visual = await fieldVisualState(page);
    record(`RESPONSIVE:${profile.id}:THREE_VISIBLE_OBJECTS`, visual.nodes.length === 3 && visual.nodes.every((node) => node.visible), visual);
    record(`RESPONSIVE:${profile.id}:FINITE_NODE_GEOMETRY`, visual.nodes.every((node) => [node.width, node.height, node.left, node.right, node.top, node.bottom, node.opacity].every(Number.isFinite)), visual.nodes);
    record(`RESPONSIVE:${profile.id}:SINGULAR_ACTIVE_OBJECT`, visual.activeCount === 1 && visual.pressedCount === 1 && visual.tabStopCount === 1, visual);
    record(`RESPONSIVE:${profile.id}:RELATIONS_RENDER`, visual.relations.length === 2 && visual.relations.every((entry) => entry.d.startsWith('M ') && !entry.d.includes('NaN')), visual.relations);
    await assertSemanticInvariant(page, baseline, `RESPONSIVE:${profile.id}`);
    await page.screenshot({ path: path.join(OUT, `${profile.id.toLowerCase()}.png`), fullPage: true });
  }

  record('RUNTIME:NO_CONSOLE_ERRORS', consoleErrors.length === 0, consoleErrors);
  record('RUNTIME:NO_PAGE_ERRORS', pageErrors.length === 0, pageErrors);
  await context.close();
}

async function verifyCorruptRegistryFailClosed(browser) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  await page.route('**/object-projection-registry.v1.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        schema: 'WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1',
        projectionSelection: { PROJECTION: 'METHODS', objectCount: 4 },
        objects: [],
        relations: [],
        populationBoundary: { researchContentCopied: false },
        publicMutationAuthorized: false,
        scientificClaimUpgrade: false,
      }),
    });
  });
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#field-failure')?.hidden === false, null, { timeout: 10000 });
  const disposition = await page.evaluate(() => ({
    failureVisible: document.querySelector('#field-failure')?.hidden === false,
    objectCount: document.querySelectorAll('.object-node').length,
    relationCount: document.querySelectorAll('#relation-paths path[data-relation-id]').length,
    apiPresent: Boolean(globalThis.__M1_COMPASS_INTEGRATED_API__),
    receipt: globalThis.__M1_COMPASS_INTEGRATED_RECEIPT__,
  }));
  record('FAIL_CLOSED:CORRUPT_REGISTRY_ALERT_VISIBLE', disposition.failureVisible === true, disposition);
  record('FAIL_CLOSED:CORRUPT_REGISTRY_NO_PARTIAL_FIELD', disposition.objectCount === 0 && disposition.relationCount === 0, disposition);
  record('FAIL_CLOSED:CORRUPT_REGISTRY_NO_READY_API', disposition.apiPresent === false, disposition);
  record('FAIL_CLOSED:CORRUPT_REGISTRY_RECEIPT_WITHHELD', disposition.receipt?.status === 'WITHHELD' && disposition.receipt?.semanticMutation === false, disposition.receipt);
  await context.close();
}

async function verifyRegistryFetchFailure(browser) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  await page.route('**/object-projection-registry.v1.json', (route) => route.abort('failed'));
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#field-failure')?.hidden === false, null, { timeout: 10000 });
  const disposition = await page.evaluate(() => ({
    failureVisible: document.querySelector('#field-failure')?.hidden === false,
    objectCount: document.querySelectorAll('.object-node').length,
    relationCount: document.querySelectorAll('#relation-paths path[data-relation-id]').length,
    apiPresent: Boolean(globalThis.__M1_COMPASS_INTEGRATED_API__),
  }));
  record('FAIL_CLOSED:REGISTRY_FETCH_FAILURE_ALERT_VISIBLE', disposition.failureVisible === true, disposition);
  record('FAIL_CLOSED:REGISTRY_FETCH_FAILURE_NO_PARTIAL_FIELD', disposition.objectCount === 0 && disposition.relationCount === 0, disposition);
  record('FAIL_CLOSED:REGISTRY_FETCH_FAILURE_NO_READY_API', disposition.apiPresent === false, disposition);
  await context.close();
}

let browser;
let browserVersion = null;
try {
  browser = await chromium.launch({ headless: true });
  browserVersion = browser.version();
  await verifyRuntime(browser);
  await verifyCorruptRegistryFailClosed(browser);
  await verifyRegistryFetchFailure(browser);
} catch (error) {
  failures.push({ name: 'HARNESS_FATAL', status: 'FAIL', details: String(error?.stack || error) });
} finally {
  if (browser) await browser.close();
}

const result = {
  schema: 'M1_COMPASS_INTEGRATED_RUNTIME_REVIEW_RECEIPT_v1',
  operation: 'M1_COMPASS_INTEGRATED_RUNTIME_REVIEW_v1',
  subject: SUBJECT,
  status: failures.length === 0 ? 'PASS_RUNTIME_REVIEW' : 'FAIL_RUNTIME_REVIEW',
  assertions,
  passed: checks.filter((entry) => entry.status === 'PASS').length,
  failed: failures.length,
  checks,
  failures,
  runtime: {
    node: process.version,
    playwright: '1.54.2',
    browser: browserVersion,
  },
  scope: {
    entry: true,
    returnBehavior: true,
    fieldStatePersistence: true,
    activeObjectFocus: true,
    neighborRetention: true,
    L0L1Transitions: true,
    pointerDragSwipe: true,
    wheelNavigation: true,
    keyboardNavigation: true,
    previousNextControls: true,
    responsiveBehavior: true,
    stateRestoration: true,
    corruptRegistryFailClosed: true,
    registryFetchFailureFailClosed: true,
  },
  nonClaims: [
    'NO_PERCEPTUAL_ACCEPTANCE_CLAIM',
    'NO_BASELINE_REGRESSION_CLOSURE_CLAIM',
    'NO_EXACT_HEAD_CERTIFICATION_CLAIM',
    'NO_PROMOTION_CLAIM',
  ],
};

fs.writeFileSync(path.join(OUT, 'runtime-review-receipt.v1.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
