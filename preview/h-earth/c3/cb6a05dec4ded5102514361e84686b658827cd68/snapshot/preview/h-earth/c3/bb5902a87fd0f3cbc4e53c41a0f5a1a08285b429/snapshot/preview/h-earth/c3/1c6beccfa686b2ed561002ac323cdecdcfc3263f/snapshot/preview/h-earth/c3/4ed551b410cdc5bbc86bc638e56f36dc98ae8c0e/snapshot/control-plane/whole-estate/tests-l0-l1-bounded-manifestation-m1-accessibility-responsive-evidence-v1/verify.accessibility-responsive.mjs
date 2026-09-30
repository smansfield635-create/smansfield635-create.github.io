import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE_URL = process.env.M1_BASE_URL || 'http://127.0.0.1:4173';
const ROUTE = '/control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/';
const OUT = process.env.M1_A11Y_EVIDENCE_DIR || '/tmp/m1-a11y-evidence';
const PROFILES = [
  { id: 'DESKTOP', width: 1440, height: 1000 },
  { id: 'TABLET', width: 820, height: 1180 },
  { id: 'PHONE', width: 390, height: 844 },
  { id: 'NARROW_REFLOW', width: 320, height: 800 },
];
const OBJECTS = [
  { id: 'METHODS', className: 'METHOD', name: 'Scientific procedure, METHOD. Focus object.' },
  { id: 'ROUTE_OPERATOR_PLATFORM', className: 'METHOD', name: 'Protocol and execution infrastructure, METHOD. Focus object.' },
  { id: 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO', className: 'TEST_INSTANCE', name: 'Five-domain severe-test instance, TEST_INSTANCE. Focus object.' },
];
const RELATIONS = [
  ['METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'METHODS', 'GOVERNS_PROCEDURE_FOR', 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO'],
  ['ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'ROUTE_OPERATOR_PLATFORM', 'EXECUTES', 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO'],
];

fs.mkdirSync(OUT, { recursive: true });
const checks = [];
let assertions = 0;
let failures = 0;
function record(condition, name, details = null) {
  assertions += 1;
  if (!condition) {
    failures += 1;
    checks.push({ name, status: 'FAIL', details });
    return false;
  }
  checks.push({ name, status: 'PASS', details });
  return true;
}
function stable(value) { return JSON.stringify(value); }
function axValue(node, propertyName) {
  const prop = node?.properties?.find((entry) => entry.name === propertyName);
  return prop?.value?.value;
}
function parseCssDuration(value) {
  return String(value).split(',').map((part) => part.trim()).map((part) => {
    if (part.endsWith('ms')) return Number.parseFloat(part);
    if (part.endsWith('s')) return Number.parseFloat(part) * 1000;
    return Number.NaN;
  });
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

async function semanticSnapshot(page) {
  return page.evaluate(() => ({
    candidate: document.querySelector('[data-candidate]')?.dataset.candidate ?? null,
    layerBoundary: document.querySelector('[data-layer-boundary]')?.dataset.layerBoundary ?? null,
    semanticLayout: document.querySelector('#spatial-field')?.dataset.semanticLayout ?? null,
    state: globalThis.__TESTS_L0_L1_M1__.getState(),
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
    projections: [...document.querySelectorAll('.projection-control')].map((node) => ({
      id: node.dataset.projection,
      disabled: node.disabled,
      ariaDisabled: node.getAttribute('aria-disabled'),
      pressed: node.getAttribute('aria-pressed'),
    })).sort((a, b) => a.id.localeCompare(b.id)),
    anchorCount: document.querySelectorAll('a[href]').length,
    deepControlCount: document.querySelectorAll('[data-operation="ENTER"], [data-action="enter"], [data-enter], [data-follow], [data-inspect], [data-provenance-route]').length,
  }));
}

function canonicalScientificSnapshot(snapshot) {
  return {
    candidate: snapshot.candidate,
    layerBoundary: snapshot.layerBoundary,
    semanticLayout: snapshot.semanticLayout,
    projection: snapshot.state.projection,
    operation: snapshot.state.operation,
    registryValidated: snapshot.state.registryValidated,
    objectIds: [...snapshot.state.objectIds].sort(),
    relationIds: [...snapshot.state.relationIds].sort(),
    objects: snapshot.objects,
    relations: snapshot.relations,
    projections: snapshot.projections,
    anchorCount: snapshot.anchorCount,
    deepControlCount: snapshot.deepControlCount,
  };
}

async function currentOutcome(page) {
  const snapshot = await semanticSnapshot(page);
  const last = await page.evaluate(() => globalThis.__TESTS_L0_L1_M1_LAST_FOCUS__ || null);
  return {
    operation: snapshot.state.operation,
    activeObject: snapshot.state.activeObject,
    semantic: canonicalScientificSnapshot(snapshot),
    lastFocus: last ? { operation: last.operation, target: last.target, semanticMutation: last.semanticMutation } : null,
  };
}

async function resetToMethods(page) {
  await page.evaluate(() => globalThis.__TESTS_L0_L1_M1__.setFocus('METHODS'));
  await page.waitForFunction(() => globalThis.__TESTS_L0_L1_M1__.getState().activeObject === 'METHODS');
}

async function inspectResponsiveProfile(browser, profile, baselineSemantic) {
  const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);

  const snapshot = await semanticSnapshot(page);
  const canonical = canonicalScientificSnapshot(snapshot);
  record(stable(canonical) === stable(baselineSemantic), `RESPONSIVE:${profile.id}:SCIENTIFIC_SNAPSHOT_EQUIVALENT`, { canonical, baselineSemantic });

  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const field = document.querySelector('#spatial-field');
    const fieldRect = field.getBoundingClientRect();
    const objectRects = [...document.querySelectorAll('.object-node')].map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        id: node.dataset.objectId,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        withinField: rect.left >= fieldRect.left - 1 && rect.right <= fieldRect.right + 1 && rect.top >= fieldRect.top - 1 && rect.bottom <= fieldRect.bottom + 1,
      };
    });
    const relationGeometry = [...document.querySelectorAll('#relation-paths path[data-relation-id]')].map((node) => ({
      id: node.dataset.relationId,
      d: node.getAttribute('d') || '',
      sourceClearance: Number(node.dataset.sourceClearance),
      targetClearance: Number(node.dataset.targetClearance),
    }));
    const enabledControls = [...document.querySelectorAll('button:not(:disabled)')].map((node) => {
      const rect = node.getBoundingClientRect();
      return { text: node.textContent.trim(), objectId: node.dataset.objectId || null, projection: node.dataset.projection || null, width: rect.width, height: rect.height };
    });
    return {
      clientWidth: doc.clientWidth,
      scrollWidth: doc.scrollWidth,
      objectRects,
      relationGeometry,
      enabledControls,
    };
  });

  record(layout.scrollWidth <= layout.clientWidth + 1, `RESPONSIVE:${profile.id}:NO_HORIZONTAL_DOCUMENT_OVERFLOW`, layout);
  record(layout.objectRects.length === 3 && layout.objectRects.every((entry) => entry.withinField), `RESPONSIVE:${profile.id}:ALL_OBJECTS_WITHIN_FIELD`, layout.objectRects);
  record(layout.relationGeometry.length === 2, `RESPONSIVE:${profile.id}:RELATION_COUNT`, layout.relationGeometry);
  record(layout.relationGeometry.every((entry) => entry.d.startsWith('M ') && !entry.d.includes('NaN') && Number.isFinite(entry.sourceClearance) && Number.isFinite(entry.targetClearance)), `RESPONSIVE:${profile.id}:FINITE_RELATION_GEOMETRY`, layout.relationGeometry);
  record(layout.enabledControls.every((entry) => entry.width >= 44 && entry.height >= 44), `RESPONSIVE:${profile.id}:ENABLED_TARGET_SIZE_AT_LEAST_44`, layout.enabledControls);
  record(consoleErrors.length === 0, `RESPONSIVE:${profile.id}:NO_CONSOLE_ERRORS`, consoleErrors);

  await context.close();
}

async function verifyKeyboardAndAX(browser, baselineSemantic) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);
  await resetToMethods(page);

  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press('Tab');
  const tab1 = await page.evaluate(() => ({ tag: document.activeElement?.tagName, projection: document.activeElement?.dataset?.projection || null, objectId: document.activeElement?.dataset?.objectId || null }));
  record(tab1.tag === 'BUTTON' && tab1.projection === 'METHODS', 'KEYBOARD:TAB1_REACHES_ACTIVE_METHODS_SELECTOR', tab1);

  await page.keyboard.press('Tab');
  const tab2 = await page.evaluate(() => ({ tag: document.activeElement?.tagName, projection: document.activeElement?.dataset?.projection || null, objectId: document.activeElement?.dataset?.objectId || null }));
  record(tab2.tag === 'BUTTON' && tab2.objectId === 'METHODS', 'KEYBOARD:TAB2_REACHES_ACTIVE_OBJECT', tab2);

  const focusVisual = await page.evaluate(() => {
    const node = document.activeElement;
    const style = getComputedStyle(node);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor, outlineOffset: style.outlineOffset };
  });
  record(focusVisual.outlineStyle !== 'none' && Number.parseFloat(focusVisual.outlineWidth) >= 1, 'KEYBOARD:VISIBLE_FOCUS_ON_OBJECT', focusVisual);

  await page.keyboard.press('ArrowRight');
  const afterArrow = await currentOutcome(page);
  record(afterArrow.activeObject === 'ROUTE_OPERATOR_PLATFORM' && afterArrow.operation === 'FOCUS' && afterArrow.lastFocus?.operation === 'FOCUS' && afterArrow.lastFocus?.target === 'ROUTE_OPERATOR_PLATFORM' && afterArrow.lastFocus?.semanticMutation === false, 'KEYBOARD:ROVING_FOCUS_RIGHT_EQUIVALENT', afterArrow);
  record(stable(afterArrow.semantic) === stable(baselineSemantic), 'KEYBOARD:ROVING_FOCUS_PRESERVES_SCIENTIFIC_SNAPSHOT', afterArrow.semantic);

  await page.keyboard.press('End');
  const afterEnd = await currentOutcome(page);
  record(afterEnd.activeObject === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO', 'KEYBOARD:END_REACHES_FINAL_OBJECT', afterEnd);
  record(stable(afterEnd.semantic) === stable(baselineSemantic), 'KEYBOARD:END_PRESERVES_SCIENTIFIC_SNAPSHOT', afterEnd.semantic);

  await page.keyboard.press('Home');
  const afterHome = await currentOutcome(page);
  record(afterHome.activeObject === 'METHODS', 'KEYBOARD:HOME_RETURNS_PRIMARY_OBJECT', afterHome);

  await page.keyboard.press('Enter');
  const afterEnter = await currentOutcome(page);
  record(afterEnter.operation === 'FOCUS' && afterEnter.activeObject === 'METHODS' && afterEnter.lastFocus?.target === 'METHODS' && afterEnter.lastFocus?.semanticMutation === false, 'KEYBOARD:ENTER_REMAINS_FOCUS_ONLY', afterEnter);
  record(stable(afterEnter.semantic) === stable(baselineSemantic), 'KEYBOARD:ENTER_PRESERVES_SCIENTIFIC_SNAPSHOT', afterEnter.semantic);

  const domA11y = await page.evaluate(() => ({
    groupRole: document.querySelector('#object-layer')?.getAttribute('role'),
    groupName: document.querySelector('#object-layer')?.getAttribute('aria-label'),
    liveRole: document.querySelector('#focus-status')?.getAttribute('role'),
    liveMode: document.querySelector('#focus-status')?.getAttribute('aria-live'),
    liveText: document.querySelector('#focus-status')?.textContent || '',
    activeCount: document.querySelectorAll('.object-node[data-active="true"]').length,
    pressedCount: document.querySelectorAll('.object-node[aria-pressed="true"]').length,
    tabStopCount: [...document.querySelectorAll('.object-node')].filter((node) => node.tabIndex === 0).length,
    objectNames: [...document.querySelectorAll('.object-node')].map((node) => ({ id: node.dataset.objectId, ariaLabel: node.getAttribute('aria-label'), pressed: node.getAttribute('aria-pressed'), tabIndex: node.tabIndex })),
  }));
  record(domA11y.groupRole === 'group' && domA11y.groupName === 'Three admitted Methods projection objects', 'A11Y:OBJECT_GROUP_EXPOSED', domA11y);
  record(domA11y.liveRole === 'status' && domA11y.liveMode === 'polite' && domA11y.liveText.includes('Scientific state unchanged.'), 'A11Y:LIVE_STATUS_SURFACE', domA11y);
  record(domA11y.activeCount === 1 && domA11y.pressedCount === 1 && domA11y.tabStopCount === 1, 'A11Y:ROVING_STATE_SINGULAR', domA11y);
  record(OBJECTS.every((expected) => domA11y.objectNames.some((actual) => actual.id === expected.id && actual.ariaLabel === expected.name)), 'A11Y:OBJECT_ACCESSIBLE_NAMES_EXACT', domA11y.objectNames);

  const session = await context.newCDPSession(page);
  await session.send('Accessibility.enable');
  const axTree = await session.send('Accessibility.getFullAXTree');
  const axButtons = axTree.nodes.filter((node) => node.role?.value === 'button' && !node.ignored);
  const axNames = axButtons.map((node) => node.name?.value || '');
  for (const expected of OBJECTS) {
    record(axNames.includes(expected.name), `AX:OBJECT_BUTTON_NAME:${expected.id}`, axNames);
  }
  for (const projectionName of ['Methods', 'Models', 'Experiments', 'Evidence']) {
    record(axNames.includes(projectionName), `AX:PROJECTION_BUTTON_NAME:${projectionName.toUpperCase()}`, axNames);
  }
  const disabledModelAx = axButtons.find((node) => node.name?.value === 'Models');
  record(axValue(disabledModelAx, 'disabled') === true, 'AX:MODELS_DISABLED_STATE', disabledModelAx?.properties || null);
  const methodsObjectAx = axButtons.find((node) => node.name?.value === OBJECTS[0].name);
  record(axValue(methodsObjectAx, 'pressed') === 'true' || axValue(methodsObjectAx, 'pressed') === true, 'AX:ACTIVE_OBJECT_PRESSED_STATE', methodsObjectAx?.properties || null);

  await context.close();
}

async function verifyPointerAssistiveAndTouch(browser, baselineSemantic) {
  const pointerContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await pointerContext.newPage();
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);
  await resetToMethods(page);
  await page.locator('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').click();
  const pointerOutcome = await currentOutcome(page);
  record(pointerOutcome.operation === 'FOCUS' && pointerOutcome.activeObject === 'ROUTE_OPERATOR_PLATFORM' && pointerOutcome.lastFocus?.target === 'ROUTE_OPERATOR_PLATFORM' && pointerOutcome.lastFocus?.semanticMutation === false, 'POINTER:FOCUS_OUTCOME', pointerOutcome);
  record(stable(pointerOutcome.semantic) === stable(baselineSemantic), 'POINTER:SCIENTIFIC_SNAPSHOT_EQUIVALENT', pointerOutcome.semantic);

  await resetToMethods(page);
  await page.evaluate(() => document.querySelector('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').click());
  const assistiveOutcome = await currentOutcome(page);
  record(assistiveOutcome.operation === 'FOCUS' && assistiveOutcome.activeObject === 'ROUTE_OPERATOR_PLATFORM' && assistiveOutcome.lastFocus?.target === 'ROUTE_OPERATOR_PLATFORM' && assistiveOutcome.lastFocus?.semanticMutation === false, 'BOUNDED_ASSISTIVE_NATIVE_ACTIVATION:FOCUS_OUTCOME', assistiveOutcome);
  record(stable(assistiveOutcome.semantic) === stable(baselineSemantic), 'BOUNDED_ASSISTIVE_NATIVE_ACTIVATION:SCIENTIFIC_SNAPSHOT_EQUIVALENT', assistiveOutcome.semantic);
  record(pointerOutcome.operation === assistiveOutcome.operation && pointerOutcome.activeObject === assistiveOutcome.activeObject && stable(pointerOutcome.semantic) === stable(assistiveOutcome.semantic), 'ACCESS_ROUTE_EQUIVALENCE:POINTER_EQUALS_BOUNDED_ASSISTIVE', { pointerOutcome, assistiveOutcome });
  await pointerContext.close();

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(touchPage);
  await resetToMethods(touchPage);
  await touchPage.locator('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').tap();
  const touchOutcome = await currentOutcome(touchPage);
  record(touchOutcome.operation === 'FOCUS' && touchOutcome.activeObject === 'ROUTE_OPERATOR_PLATFORM' && touchOutcome.lastFocus?.target === 'ROUTE_OPERATOR_PLATFORM' && touchOutcome.lastFocus?.semanticMutation === false, 'TOUCH:FOCUS_OUTCOME', touchOutcome);
  record(stable(touchOutcome.semantic) === stable(baselineSemantic), 'TOUCH:SCIENTIFIC_SNAPSHOT_EQUIVALENT', touchOutcome.semantic);
  record(pointerOutcome.operation === touchOutcome.operation && pointerOutcome.activeObject === touchOutcome.activeObject && stable(pointerOutcome.semantic) === stable(touchOutcome.semantic), 'ACCESS_ROUTE_EQUIVALENCE:POINTER_EQUALS_TOUCH', { pointerOutcome, touchOutcome });
  await touchContext.close();
}

async function verifyReducedMotion(browser, baselineSemantic) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
  await waitForReady(page);
  const motion = await page.evaluate(() => {
    const object = document.querySelector('.object-node');
    const relation = document.querySelector('#relation-paths path[data-relation-id]');
    const objectStyle = getComputedStyle(object);
    const relationStyle = getComputedStyle(relation);
    return {
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      objectTransitionDuration: objectStyle.transitionDuration,
      relationTransitionDuration: relationStyle.transitionDuration,
      objectAnimationDuration: objectStyle.animationDuration,
      relationAnimationDuration: relationStyle.animationDuration,
    };
  });
  record(motion.mediaMatches === true, 'REDUCED_MOTION:MEDIA_MATCHES', motion);
  const durations = [motion.objectTransitionDuration, motion.relationTransitionDuration, motion.objectAnimationDuration, motion.relationAnimationDuration].flatMap(parseCssDuration).filter(Number.isFinite);
  record(durations.length >= 2 && durations.every((value) => value <= 0.01), 'REDUCED_MOTION:DURATIONS_NEAR_ZERO', { motion, durations });

  await page.locator('[data-object-id="ROUTE_OPERATOR_PLATFORM"]').click();
  const outcome = await currentOutcome(page);
  record(outcome.operation === 'FOCUS' && outcome.activeObject === 'ROUTE_OPERATOR_PLATFORM' && outcome.lastFocus?.semanticMutation === false, 'REDUCED_MOTION:FOCUS_REMAINS_OPERATIONAL', outcome);
  record(stable(outcome.semantic) === stable(baselineSemantic), 'REDUCED_MOTION:SCIENTIFIC_SNAPSHOT_EQUIVALENT', outcome.semantic);
  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let browserVersion = 'unknown';
  try {
    browserVersion = browser.version();

    const baselineContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const baselinePage = await baselineContext.newPage();
    await baselinePage.goto(BASE_URL + ROUTE, { waitUntil: 'domcontentloaded' });
    await waitForReady(baselinePage);
    const baselineSnapshot = await semanticSnapshot(baselinePage);
    const baselineSemantic = canonicalScientificSnapshot(baselineSnapshot);

    record(baselineSnapshot.candidate === 'M1_TESTS_METHODS_OPERATIONAL_FIELD', 'BASELINE:CANDIDATE_IDENTITY', baselineSnapshot.candidate);
    record(baselineSnapshot.layerBoundary === 'L0_L1_ONLY', 'BASELINE:LAYER_BOUNDARY', baselineSnapshot.layerBoundary);
    record(baselineSnapshot.semanticLayout === 'NONSEMANTIC', 'BASELINE:SPATIAL_SEMANTIC_BOUNDARY', baselineSnapshot.semanticLayout);
    record(baselineSnapshot.state.projection === 'METHODS' && baselineSnapshot.state.operation === 'FOCUS' && baselineSnapshot.state.registryValidated === true, 'BASELINE:RUNTIME_STATE', baselineSnapshot.state);
    record(baselineSnapshot.objects.length === 3 && OBJECTS.every((expected) => baselineSnapshot.objects.some((actual) => actual.id === expected.id && actual.className === expected.className)), 'BASELINE:OBJECT_IDENTITY_CLASS', baselineSnapshot.objects);
    record(baselineSnapshot.relations.length === 2 && RELATIONS.every((expected) => baselineSnapshot.relations.some((actual) => stable([actual.id, actual.source, actual.relation, actual.target]) === stable(expected))), 'BASELINE:RELATION_IDENTITY_DIRECTION', baselineSnapshot.relations);
    record(baselineSnapshot.anchorCount === 0 && baselineSnapshot.deepControlCount === 0, 'BASELINE:WITHHELD_L2_L3_L4', { anchorCount: baselineSnapshot.anchorCount, deepControlCount: baselineSnapshot.deepControlCount });
    await baselineContext.close();

    for (const profile of PROFILES) await inspectResponsiveProfile(browser, profile, baselineSemantic);
    await verifyKeyboardAndAX(browser, baselineSemantic);
    await verifyPointerAssistiveAndTouch(browser, baselineSemantic);
    await verifyReducedMotion(browser, baselineSemantic);
  } catch (error) {
    failures += 1;
    checks.push({ name: 'HARNESS_FATAL', status: 'FAIL', details: String(error?.stack || error) });
  } finally {
    await browser.close();
  }

  const result = failures === 0
    ? 'PASS_BOUNDED_M1_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE_WITH_EXTERNAL_AT_LIMITATION'
    : 'FAIL_M1_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE';
  const receipt = {
    schema: 'WHOLE_ESTATE_TESTS_L0_L1_M1_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE_RECEIPT_v1',
    operation: 'M1_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE_EVIDENCE_v1',
    governingM1Candidate: '9370bba7841b8a831f7f1c034d0b74fb83dab2e0',
    governingM1PromotionMerge: '391c3543fd048bac90493232f04973911468d3eb',
    admittedRuntimeEvidenceMerge: '051268bfacbfc5671c68f4f24a5601b807412d86',
    result,
    assertions,
    failures,
    browser: { engine: 'chromium', version: browserVersion },
    profiles: PROFILES,
    evidenceBoundary: {
      accessibilityResponsiveEquivalence: failures === 0 ? 'ESTABLISHED_BOUNDED_FOR_DECLARED_BROWSER_FIXTURES' : 'NOT_ESTABLISHED',
      externalPhysicalScreenReaderOrATDevice: 'NOT_RUN',
      perceptualEvaluation: 'NOT_CLAIMED',
      freshIndependentVerification: 'NOT_CLAIMED',
      userDifferential: 'NOT_CLAIMED',
      publicPromotionFitness: 'NOT_CLAIMED',
      scientificClaimUpgrade: false,
    },
    checks,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(`${OUT}/accessibility-responsive-equivalence-receipt.v1.json`, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify({ result, assertions, failures, browserVersion }, null, 2));
  if (failures !== 0) process.exit(1);
}

await main();
