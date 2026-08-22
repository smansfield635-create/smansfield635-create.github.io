import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.M1_BASE_URL || 'http://127.0.0.1:4173';
const ROUTE = '/control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/';
const OUT = process.env.M1_RUNTIME_EVIDENCE_DIR || '/tmp/m1-runtime-evidence';
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
let assertions = 0;
function check(condition, name, details = null) {
  assertions += 1;
  if (!condition) {
    const suffix = details == null ? '' : ` :: ${JSON.stringify(details)}`;
    throw new Error(`${name}${suffix}`);
  }
  checks.push({ name, status: 'PASS', details });
}

function stable(value) {
  return JSON.stringify(value);
}

async function waitForReady(page) {
  await page.waitForFunction(() => Boolean(
    globalThis.__TESTS_L0_L1_M1__ &&
    globalThis.__TESTS_L0_L1_M1__.getState().registryValidated === true
  ), null, { timeout: 10000 });
  await page.waitForFunction(() => (
    document.querySelectorAll('.object-node').length === 3 &&
    document.querySelectorAll('#relation-paths path[data-relation-id]').length === 2
  ), null, { timeout: 10000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function runtimeState(page) {
  return page.evaluate(() => globalThis.__TESTS_L0_L1_M1__.getState());
}

async function semanticSnapshot(page) {
  return page.evaluate(() => {
    const objects = [...document.querySelectorAll('.object-node')]
      .map((node) => ({
        id: node.dataset.objectId,
        className: node.dataset.objectClass,
        label: node.querySelector('.object-node-label')?.textContent ?? '',
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const relations = [...document.querySelectorAll('#relation-paths path[data-relation-id]')]
      .map((node) => ({
        id: node.dataset.relationId,
        source: node.dataset.sourceObject,
        relation: node.dataset.relation,
        target: node.dataset.targetObject,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const projectionControls = [...document.querySelectorAll('.projection-control')]
      .map((node) => ({
        id: node.dataset.projection,
        disabled: node.disabled,
        ariaDisabled: node.getAttribute('aria-disabled'),
        pressed: node.getAttribute('aria-pressed'),
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    return {
      candidate: document.querySelector('[data-candidate]')?.dataset.candidate ?? null,
      layerBoundary: document.querySelector('[data-layer-boundary]')?.dataset.layerBoundary ?? null,
      semanticLayout: document.querySelector('#spatial-field')?.dataset.semanticLayout ?? null,
      objects,
      relations,
      projectionControls,
      relationKey: [...document.querySelectorAll('.relation-key-item')].map((node) => node.textContent.trim()).sort(),
    };
  });
}

async function relationGeometry(page) {
  return page.evaluate(() => [...document.querySelectorAll('#relation-paths path[data-relation-id]')]
    .map((node) => ({
      id: node.dataset.relationId,
      d: node.getAttribute('d') || '',
      sourceClearance: Number(node.dataset.sourceClearance),
      targetClearance: Number(node.dataset.targetClearance),
    }))
    .sort((a, b) => a.id.localeCompare(b.id)));
}

function expectedObjectSnapshot(snapshot) {
  return snapshot.objects.map(({ id, className }) => [id, className]).sort((a, b) => a[0].localeCompare(b[0]));
}

function expectedRelationSnapshot(snapshot) {
  return snapshot.relations.map(({ id, source, relation, target }) => [id, source, relation, target]).sort((a, b) => a[0].localeCompare(b[0]));
}

async function assertSemanticInvariant(page, baseline, fixture) {
  const current = await semanticSnapshot(page);
  check(stable(current) === stable(baseline), `${fixture}:SEMANTIC_GRAPH_CHANGED`, { baseline, current });
}

async function verifyHappyPath(browser) {
  const context = await browser.newContext({ viewport: { width: PROFILES[0].width, height: PROFILES[0].height } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);

  const state = await runtimeState(page);
  check(state.projection === 'METHODS', 'BOOT:PROJECTION_NOT_METHODS', state);
  check(state.operation === 'FOCUS', 'BOOT:OPERATION_NOT_FOCUS', state);
  check(state.registryValidated === true, 'BOOT:REGISTRY_NOT_VALIDATED', state);
  check(state.objectIds.length === 3, 'BOOT:OBJECT_ID_COUNT', state.objectIds);
  check(state.relationIds.length === 2, 'BOOT:RELATION_ID_COUNT', state.relationIds);

  const baseline = await semanticSnapshot(page);
  check(baseline.candidate === 'M1_TESTS_METHODS_OPERATIONAL_FIELD', 'BOOT:CANDIDATE_IDENTITY_DRIFT', baseline.candidate);
  check(baseline.layerBoundary === 'L0_L1_ONLY', 'BOOT:LAYER_BOUNDARY_DRIFT', baseline.layerBoundary);
  check(baseline.semanticLayout === 'NONSEMANTIC', 'BOOT:SPATIAL_SEMANTIC_BOUNDARY_DRIFT', baseline.semanticLayout);
  check(stable(expectedObjectSnapshot(baseline)) === stable([...EXPECTED_OBJECTS].sort((a, b) => a[0].localeCompare(b[0]))), 'BOOT:OBJECT_IDENTITY_OR_CLASS_DRIFT', baseline.objects);
  check(stable(expectedRelationSnapshot(baseline)) === stable([...EXPECTED_RELATIONS].sort((a, b) => a[0].localeCompare(b[0]))), 'BOOT:RELATION_IDENTITY_OR_DIRECTION_DRIFT', baseline.relations);
  check(baseline.relationKey.length === 2, 'BOOT:RELATION_KEY_COUNT', baseline.relationKey);

  const methodsControl = baseline.projectionControls.find((control) => control.id === 'METHODS');
  check(methodsControl?.disabled === false && methodsControl?.pressed === 'true', 'L0:METHODS_NOT_ACTIVE', methodsControl);
  for (const projection of ['MODELS', 'EXPERIMENTS', 'EVIDENCE']) {
    const control = baseline.projectionControls.find((item) => item.id === projection);
    check(control?.disabled === true && control?.ariaDisabled === 'true', `L0:${projection}_NOT_DISABLED`, control);
  }

  const interactiveSurface = await page.evaluate(() => ({
    anchors: [...document.querySelectorAll('a[href]')].map((node) => node.getAttribute('href')),
    enabledButtons: [...document.querySelectorAll('button:not(:disabled)')].map((node) => ({
      className: node.className,
      projection: node.dataset.projection || null,
      objectId: node.dataset.objectId || null,
      text: node.textContent.trim(),
    })),
    enterLike: [...document.querySelectorAll('[data-operation="ENTER"], [data-action="enter"], [data-enter], [data-follow], [data-inspect], [data-provenance-route]')].length,
  }));
  check(interactiveSurface.anchors.length === 0, 'WITHHELD:ANCHOR_ROUTE_PRESENT', interactiveSurface.anchors);
  check(interactiveSurface.enterLike === 0, 'WITHHELD:L2_L3_L4_INTERACTIVE_CONTROL_PRESENT', interactiveSurface);
  check(interactiveSurface.enabledButtons.every((button) => button.objectId || button.projection === 'METHODS'), 'WITHHELD:UNAUTHORIZED_ENABLED_BUTTON', interactiveSurface.enabledButtons);

  for (const [objectId] of EXPECTED_OBJECTS) {
    await page.evaluate((id) => globalThis.__TESTS_L0_L1_M1__.setFocus(id), objectId);
    await page.waitForFunction((id) => globalThis.__TESTS_L0_L1_M1__.getState().activeObject === id, objectId);
    const focus = await page.evaluate(() => globalThis.__TESTS_L0_L1_M1_LAST_FOCUS__);
    check(focus.operation === 'FOCUS' && focus.target === objectId && focus.semanticMutation === false, `PROGRAMMATIC_FOCUS:${objectId}:BAD_RECEIPT`, focus);
    await assertSemanticInvariant(page, baseline, `PROGRAMMATIC_FOCUS:${objectId}`);
  }

  for (const [objectId] of EXPECTED_OBJECTS) {
    await page.locator(`[data-object-id="${objectId}"]`).click();
    const after = await runtimeState(page);
    const focus = await page.evaluate(() => globalThis.__TESTS_L0_L1_M1_LAST_FOCUS__);
    check(after.activeObject === objectId, `POINTER_FOCUS:${objectId}:ACTIVE_OBJECT_MISMATCH`, after);
    check(focus.modality === 'POINTER_OR_ACTIVATION' && focus.semanticMutation === false, `POINTER_FOCUS:${objectId}:BAD_RECEIPT`, focus);
    await assertSemanticInvariant(page, baseline, `POINTER_FOCUS:${objectId}`);
  }

  await page.evaluate(() => globalThis.__TESTS_L0_L1_M1__.setFocus('METHODS'));
  const methodsNode = page.locator('[data-object-id="METHODS"]');
  await methodsNode.focus();
  await methodsNode.press('ArrowRight');
  let afterKeyboard = await runtimeState(page);
  let keyboardReceipt = await page.evaluate(() => globalThis.__TESTS_L0_L1_M1_LAST_FOCUS__);
  check(afterKeyboard.activeObject === 'ROUTE_OPERATOR_PLATFORM', 'KEYBOARD:ARROWRIGHT_TARGET', afterKeyboard);
  check(keyboardReceipt.modality === 'KEYBOARD' && keyboardReceipt.semanticMutation === false, 'KEYBOARD:ARROWRIGHT_RECEIPT', keyboardReceipt);
  await assertSemanticInvariant(page, baseline, 'KEYBOARD:ARROWRIGHT');

  await page.locator('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').press('End');
  afterKeyboard = await runtimeState(page);
  check(afterKeyboard.activeObject === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'KEYBOARD:END_TARGET', afterKeyboard);
  await assertSemanticInvariant(page, baseline, 'KEYBOARD:END');

  await page.locator('[data-object-id="PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]').press('Home');
  afterKeyboard = await runtimeState(page);
  check(afterKeyboard.activeObject === 'METHODS', 'KEYBOARD:HOME_TARGET', afterKeyboard);
  await assertSemanticInvariant(page, baseline, 'KEYBOARD:HOME');

  const focusA11yState = await page.evaluate(() => ({
    activeCount: document.querySelectorAll('.object-node[data-active="true"]').length,
    pressedCount: document.querySelectorAll('.object-node[aria-pressed="true"]').length,
    tabStopCount: [...document.querySelectorAll('.object-node')].filter((node) => node.tabIndex === 0).length,
    focusStatus: document.querySelector('#focus-status')?.textContent || '',
  }));
  check(focusA11yState.activeCount === 1 && focusA11yState.pressedCount === 1 && focusA11yState.tabStopCount === 1, 'FOCUS:ROVING_STATE_NOT_SINGULAR', focusA11yState);
  check(focusA11yState.focusStatus.includes('Scientific state unchanged.'), 'FOCUS:STATUS_DOES_NOT_DECLARE_SEMANTIC_BOUNDARY', focusA11yState.focusStatus);

  for (const projection of ['MODELS', 'EXPERIMENTS', 'EVIDENCE']) {
    await page.evaluate((id) => document.querySelector(`[data-projection="${id}"]`).click(), projection);
    const afterDisabledAttempt = await runtimeState(page);
    check(afterDisabledAttempt.projection === 'METHODS', `L0:${projection}:DISABLED_CONTROL_CHANGED_PROJECTION`, afterDisabledAttempt);
    check((await page.locator(`[data-projection="${projection}"]`).isDisabled()) === true, `L0:${projection}:CONTROL_BECAME_ENABLED`);
    await assertSemanticInvariant(page, baseline, `L0:${projection}:DISABLED_ATTEMPT`);
  }

  for (const profile of PROFILES) {
    await page.setViewportSize({ width: profile.width, height: profile.height });
    await page.evaluate(() => globalThis.__TESTS_L0_L1_M1__.relayout());
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await assertSemanticInvariant(page, baseline, `REFLOW:${profile.id}`);
    const geometry = await relationGeometry(page);
    check(geometry.length === 2, `REFLOW:${profile.id}:RELATION_GEOMETRY_COUNT`, geometry);
    check(geometry.every((entry) => entry.d.startsWith('M ') && !entry.d.includes('NaN')), `REFLOW:${profile.id}:INVALID_PATH_GEOMETRY`, geometry);
    check(geometry.every((entry) => Number.isFinite(entry.sourceClearance) && Number.isFinite(entry.targetClearance)), `REFLOW:${profile.id}:INVALID_CLEARANCE`, geometry);
    await page.screenshot({ path: path.join(OUT, `${profile.id.toLowerCase()}.png`), fullPage: true });
  }

  check(consoleErrors.length === 0, 'HAPPY_PATH:CONSOLE_ERRORS', consoleErrors);
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
        projectionSelection: { PROJECTION: 'METHODS', projectionCount: 1, objectCount: 4 },
        objects: [],
        relations: [],
      }),
    });
  });
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#field-failure')?.hidden === false, null, { timeout: 10000 });
  const disposition = await page.evaluate(() => ({
    failureVisible: document.querySelector('#field-failure')?.hidden === false,
    objectCount: document.querySelectorAll('.object-node').length,
    relationCount: document.querySelectorAll('#relation-paths path[data-relation-id]').length,
    apiPresent: Boolean(globalThis.__TESTS_L0_L1_M1__),
  }));
  check(disposition.failureVisible === true, 'FAIL_CLOSED:CORRUPT_REGISTRY_ALERT_NOT_VISIBLE', disposition);
  check(disposition.objectCount === 0 && disposition.relationCount === 0, 'FAIL_CLOSED:CORRUPT_REGISTRY_PARTIAL_RENDER', disposition);
  check(disposition.apiPresent === false, 'FAIL_CLOSED:CORRUPT_REGISTRY_EXPOSED_READY_API', disposition);
  await context.close();
}

async function verifyRegistryFetchFailureFailClosed(browser) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  await page.route('**/object-projection-registry.v1.json', async (route) => route.abort('failed'));
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#field-failure')?.hidden === false, null, { timeout: 10000 });
  const disposition = await page.evaluate(() => ({
    failureVisible: document.querySelector('#field-failure')?.hidden === false,
    objectCount: document.querySelectorAll('.object-node').length,
    relationCount: document.querySelectorAll('#relation-paths path[data-relation-id]').length,
    apiPresent: Boolean(globalThis.__TESTS_L0_L1_M1__),
  }));
  check(disposition.failureVisible === true, 'FAIL_CLOSED:FETCH_FAILURE_ALERT_NOT_VISIBLE', disposition);
  check(disposition.objectCount === 0 && disposition.relationCount === 0, 'FAIL_CLOSED:FETCH_FAILURE_PARTIAL_RENDER', disposition);
  check(disposition.apiPresent === false, 'FAIL_CLOSED:FETCH_FAILURE_EXPOSED_READY_API', disposition);
  await context.close();
}

async function main() {
  let browser;
  const receipt = {
    schema: 'WHOLE_ESTATE_TESTS_L0_L1_M1_RUNTIME_INTERACTION_EVIDENCE_RECEIPT_v1',
    operation: 'M1_RUNTIME_INTERACTION_EVIDENCE_v1',
    governingM1Candidate: '9370bba7841b8a831f7f1c034d0b74fb83dab2e0',
    governingM1PromotionMerge: '391c3543fd048bac90493232f04973911468d3eb',
    route: ROUTE,
    baseUrl: BASE_URL,
    result: 'NOT_RUN',
    assertions: 0,
    failures: 0,
    evidenceBoundary: {
      runtimeInteraction: 'UNDER_TEST',
      accessibilityResponsiveEquivalence: 'NOT_CLAIMED',
      perceptualEvaluation: 'NOT_CLAIMED',
      freshIndependentVerification: 'NOT_CLAIMED',
      userDifferential: 'NOT_CLAIMED',
      publicPromotionFitness: 'NOT_CLAIMED',
      scientificClaimUpgrade: false,
    },
  };

  try {
    browser = await chromium.launch({ headless: true });
    receipt.browser = { engine: 'chromium', version: browser.version() };
    await verifyHappyPath(browser);
    await verifyCorruptRegistryFailClosed(browser);
    await verifyRegistryFetchFailureFailClosed(browser);
    receipt.result = 'PASS_BOUNDED_M1_RUNTIME_INTERACTION_EVIDENCE';
    receipt.evidenceBoundary.runtimeInteraction = 'ESTABLISHED_FOR_DECLARED_FIXTURES_ONLY';
  } catch (error) {
    receipt.result = 'FAIL_BOUNDED_M1_RUNTIME_INTERACTION_EVIDENCE';
    receipt.failures = 1;
    receipt.error = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    receipt.assertions = assertions;
    receipt.checks = checks;
    receipt.generatedAt = new Date().toISOString();
    fs.writeFileSync(path.join(OUT, 'runtime-interaction-receipt.v1.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify({
      result: receipt.result,
      assertions: receipt.assertions,
      failures: receipt.failures,
      receipt: path.join(OUT, 'runtime-interaction-receipt.v1.json'),
    }, null, 2));
  }
}

await main();
