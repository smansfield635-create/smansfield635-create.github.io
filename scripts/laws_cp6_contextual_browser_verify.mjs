import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseURL = process.env.CP6_BASE_URL || 'http://127.0.0.1:4173';
const root = process.cwd();
const results = [];

const destinationPages = [
  ['/laws/research/applied-investigations/', '#cp6-battery-study-index'],
  ['/laws/research/evidence-and-sources/', '#cp6-battery-evidence'],
  ['/laws/research/methods-and-models/', '#cp6-battery-method'],
  ['/laws/research/findings-and-boundaries/', '#cp6-battery-findings'],
  ['/laws/test/admission-and-baseline/', '#cp6-battery-admission'],
  ['/laws/test/forward-construction/', '#cp6-battery-forward'],
  ['/laws/test/reverse-audit/', '#cp6-battery-reverse'],
  ['/laws/test/result-and-record/', '#cp6-battery-result'],
];

const relationshipPages = [
  '/laws/categories/flow/',
  '/laws/categories/integrity/',
  '/laws/categories/reality/',
  '/laws/categories/structure/',
];

const allContextPages = [
  ['/laws/', '#cp6-work-behind-laws'],
  ...destinationPages,
  ...relationshipPages.map(route => [route, '#cp6-battery-law-relationships']),
];

const profiles = [
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function localPathForRoute(route) {
  const clean = route.split('#')[0].split('?')[0];
  if (clean === '/') return path.join(root, 'index.html');
  return path.join(root, clean.replace(/^\//, ''), 'index.html');
}

function verifyStaticRepositoryContracts() {
  const crosswalk = JSON.parse(fs.readFileSync('laws/control-plane/cp6-context/laws-frontier-compatibility-crosswalk-v1.json', 'utf8'));
  const battery = JSON.parse(fs.readFileSync('laws/control-plane/cp6-context/laws-battery-study-contextual-interpretation-record-v1.json', 'utf8'));
  const compatibility = JSON.parse(fs.readFileSync('laws/control-plane/cp6-1/cp6-2-route-contract.json', 'utf8'));
  const verification = JSON.parse(fs.readFileSync('laws/control-plane/cp6-context/contextual-renewal-verification-v1.json', 'utf8'));
  const legacyDisposition = JSON.parse(fs.readFileSync('laws/control-plane/cp6-context/legacy-benchmark-disposition-v1.json', 'utf8'));

  assert(crosswalk.mappings.length === 11, 'Current eleven Frontier compatibility surfaces not preserved in crosswalk');
  assert(crosswalk.authority_boundary.route_deletion === 0, 'Route deletion recorded');
  assert(crosswalk.authority_boundary.redirect_creation === 0, 'Redirect creation recorded');
  assert(crosswalk.authority_boundary.evidence_status_upgrade === 0, 'Evidence status upgrade recorded');
  assert(compatibility.compatibility_binding_count === 9, 'Nine compatibility bindings not preserved');
  assert(compatibility.bindings_with_complete_required_field_set === 9, 'Incomplete compatibility binding');
  assert(compatibility.test_routes.length === 4 && compatibility.research_routes.length === 4, 'Eight canonical destinations not preserved');
  assert(battery.data_and_observation_units.held_out_cell_count === 3, 'Held-out cell count drift');
  assert(battery.data_and_observation_units.final_test_record_count === 1653, 'Final-test record count drift');
  assert(battery.data_and_observation_units.warning_horizon_cycles === 20, 'Warning horizon drift');
  assert(battery.baselines_and_comparators[0].auroc === 0.9394, 'Combined AUROC drift');
  assert(battery.baselines_and_comparators[1].auroc === 0.9704, 'Burden AUROC drift');
  assert(verification.frontier_files_mutated === 0, 'Frontier mutation recorded');
  assert(verification.compass_runtime_files_mutated === 0, 'Compass runtime mutation recorded');

  assert(legacyDisposition.current_compass_contract.top_level_authorities === 6, 'Legacy disposition does not preserve six authorities');
  assert(legacyDisposition.current_compass_contract.outer_label_model === 'single-active-primary-only', 'Legacy disposition does not preserve the accepted outer-label model');
  assert(legacyDisposition.four_compass_exact_head_regression.material_findings_after_classification.length === 0, 'Material Four-Compass finding remains unresolved');
  assert(legacyDisposition.six_authority_benchmark.protected_compass_runtime_changed_in_current_pr === false, 'Historical six-authority benchmark disposition reports runtime mutation');

  for (const [route] of allContextPages) {
    assert(fs.existsSync(localPathForRoute(route)), `Missing local route target: ${route}`);
  }

  let migrated = 0;
  for (const [route] of destinationPages) {
    const html = fs.readFileSync(localPathForRoute(route), 'utf8');
    migrated += (html.match(/data-cp6-3-content-row="true"/g) || []).length;
  }
  assert(migrated === 48, `Expected 48 migrated records, found ${migrated}`);

  const lawsHTML = fs.readFileSync('laws/index.html', 'utf8');
  const interactions = fs.readFileSync('laws/index.interactions.js', 'utf8');
  assert(lawsHTML.includes('data-laws-category-count="6"'), 'Six authorities marker missing');
  assert(lawsHTML.includes('data-laws-primary-star-count="4"'), 'Four law-authority marker missing');
  assert(lawsHTML.includes('data-laws-nonlaw-member-count="8"'), 'Eight Test and Research child markers missing');
  assert(lawsHTML.includes('data-laws-child-route-count="24"'), 'Twenty-four Laws child-route marker missing');
  assert(lawsHTML.includes('data-laws-test-method="four-member-reversible-admissibility-cluster"'), 'Current Test method marker missing');
  assert(lawsHTML.includes('data-laws-first-disclosure'), 'Current F.I.R.S.T. disclosure missing');
  assert(lawsHTML.includes('data-laws-controller-navigation-authority="true"'), 'Compass controller navigation authority missing');
  assert(lawsHTML.includes('data-laws-evidence-claim-authority="false"'), 'Evidence claim boundary changed');
  assert(interactions.includes('const D=Object.freeze(["flow","integrity","reality","structure","test","research"])'), 'Six-authority interaction identity missing');
  assert(interactions.includes('singleActiveOuterAuthorityLabel:true'), 'Single-active outer-label contract missing');
  assert(interactions.includes('primary-only-star-center-protected-tab'), 'Primary-only label placement contract missing');

  const forbidden = [
    'future Frontier architecture is live',
    'Frontier Compass is deployed',
    'universal battery validation',
    'critical-system deployment validated: yes',
  ];
  for (const file of verification.changed_product_files.filter(p => p.endsWith('.html'))) {
    const text = fs.readFileSync(file, 'utf8').toLowerCase();
    for (const phrase of forbidden) assert(!text.includes(phrase.toLowerCase()), `Forbidden claim in ${file}: ${phrase}`);
  }
  results.push({
    check: 'repository-contracts',
    status: 'PASS',
    migratedRecords: migrated,
    compatibilityBindings: 9,
    currentCompassContract: 'SIX_AUTHORITY_SINGLE_ACTIVE_OUTER_LABEL',
    legacyFailuresClassified: true,
  });
}

async function verifyCurrentCompassContract(page, profileName) {
  await page.goto(baseURL + '/laws/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(
    document.querySelector('[data-laws-root]') &&
    globalThis.DGB_LAWS_CONTROLLER &&
    document.querySelectorAll('[data-laws-projected-category-label]').length === 6
  ));

  const snapshot = await page.evaluate(() => {
    const visible = element => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
    };
    const root = document.querySelector('[data-laws-root]');
    const labels = [...document.querySelectorAll('[data-laws-projected-category-label]')];
    const topLevelAuthorities = [...document.querySelectorAll('button[data-laws-category][data-direction]')];
    const childControls = [...document.querySelectorAll('button[data-direction][data-route]')]
      .filter(element => !element.hasAttribute('data-laws-category'));
    const lawControls = childControls.filter(element => element.hasAttribute('data-laws-law'));
    const testChildren = childControls.filter(element => element.dataset.direction === 'test');
    const researchChildren = childControls.filter(element => element.dataset.direction === 'research');
    return {
      methodAcronym: document.documentElement.dataset.lawsMethodAcronym || '',
      testMethod: document.documentElement.dataset.lawsTestMethod || '',
      primaryStarCount: Number(document.documentElement.dataset.lawsPrimaryStarCount || 0),
      declaredAuthorityCount: Number(document.documentElement.dataset.lawsCategoryCount || 0),
      declaredChildRouteCount: Number(document.documentElement.dataset.lawsChildRouteCount || 0),
      topLevelAuthorityCount: topLevelAuthorities.length,
      topLevelAuthorityIds: topLevelAuthorities.map(element => element.dataset.direction).sort(),
      childControlCount: childControls.length,
      lawControlCount: lawControls.length,
      testChildCount: testChildren.length,
      researchChildCount: researchChildren.length,
      projectedLabelCount: labels.length,
      projectedVisibleCount: labels.filter(visible).length,
      projectedPrimaryCount: labels.filter(element => visible(element) && element.dataset.primary === 'true').length,
      projectedLetterCount: labels.filter(element => element.querySelector('[data-laws-projected-category-letter]')).length,
      projectedWordCount: labels.filter(element => element.querySelector('[data-laws-projected-category-word]')).length,
      visibleAuthorityIds: labels.filter(visible).map(element => element.dataset.direction || element.dataset.lawsProjectedCategoryLabel || ''),
      firstDisclosurePresent: Boolean(document.querySelector('[data-laws-first-disclosure]')),
      controllerState: root?.dataset.lawsControllerState || '',
      controllerAuthority: document.documentElement.dataset.compassControllerNavigationAuthority || '',
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  assert(snapshot.methodAcronym === 'FIRST', `${profileName}: F.I.R.S.T. acronym contract changed`);
  assert(snapshot.testMethod === 'four-member-reversible-admissibility-cluster', `${profileName}: Test method contract changed: ${snapshot.testMethod}`);
  assert(snapshot.primaryStarCount === 4, `${profileName}: four law authorities not preserved`);
  assert(snapshot.declaredAuthorityCount === 6 && snapshot.topLevelAuthorityCount === 6, `${profileName}: six top-level authorities not preserved`);
  assert(JSON.stringify(snapshot.topLevelAuthorityIds) === JSON.stringify(['flow', 'integrity', 'reality', 'research', 'structure', 'test']), `${profileName}: authority identity set changed`);
  assert(snapshot.declaredChildRouteCount === 24 && snapshot.childControlCount === 24, `${profileName}: 24 child routes not preserved`);
  assert(snapshot.lawControlCount === 16 && snapshot.testChildCount === 4 && snapshot.researchChildCount === 4, `${profileName}: law, Test, or Research child membership changed`);
  assert(snapshot.projectedLabelCount === 6, `${profileName}: six projected authority labels were not installed`);
  assert(snapshot.projectedVisibleCount === 1 && snapshot.projectedPrimaryCount === 1, `${profileName}: single-active outer-label contract failed`);
  assert(snapshot.projectedLetterCount === 6 && snapshot.projectedWordCount === 6, `${profileName}: projected label parts are incomplete`);
  assert(snapshot.firstDisclosurePresent, `${profileName}: current F.I.R.S.T. disclosure is missing`);
  assert(snapshot.controllerState.length > 0 && snapshot.controllerAuthority === 'true', `${profileName}: controller authority is unavailable`);
  assert(snapshot.horizontalOverflow <= 2, `${profileName}: Compass stage horizontal overflow: ${snapshot.horizontalOverflow}`);

  results.push({
    check: `current-compass-${profileName}`,
    status: 'PASS',
    authorities: snapshot.topLevelAuthorityCount,
    childRoutes: snapshot.childControlCount,
    visibleOuterLabels: snapshot.projectedVisibleCount,
    visibleAuthorityIds: snapshot.visibleAuthorityIds,
  });
}

async function verifyProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));

  for (const [route, selector] of allContextPages) {
    const response = await page.goto(baseURL + route, { waitUntil: 'networkidle' });
    assert(response && response.ok(), `${profile.name}: HTTP failure ${route}`);
    await page.locator(selector).waitFor({ state: 'visible' });
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    }));
    assert(dimensions.scrollWidth <= dimensions.clientWidth + 2, `${profile.name}: horizontal overflow on ${route}: ${dimensions.scrollWidth}/${dimensions.clientWidth}`);
    assert(dimensions.scrollHeight > dimensions.clientHeight, `${profile.name}: page content unexpectedly absent on ${route}`);
  }

  await verifyCurrentCompassContract(page, profile.name);

  await page.goto(baseURL + '/laws/research/applied-investigations/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const keyboardFocus = await page.evaluate(() => document.activeElement?.tagName || '');
  assert(['A', 'BUTTON', 'SUMMARY'].includes(keyboardFocus), `${profile.name}: keyboard focus did not reach an interactive control`);

  if (profile.hasTouch) {
    await page.locator('#cp6-battery-study-index a[href="/frontier/energy/battery-coherence-study/"]').click();
    await page.waitForLoadState('domcontentloaded');
    assert(new URL(page.url()).pathname === '/frontier/energy/battery-coherence-study/', `${profile.name}: touch route did not return to complete Frontier record`);
  }

  assert(consoleErrors.length === 0, `${profile.name}: browser errors: ${consoleErrors.join(' | ')}`);
  results.push({ check: `browser-${profile.name}`, status: 'PASS', pages: allContextPages.length, overflow: 0, browserErrors: 0 });
  await context.close();
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseURL + '/laws/', { waitUntil: 'networkidle' });
  await page.locator('#cp6-work-behind-laws').waitFor({ state: 'visible' });
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  assert(reduced, 'Reduced-motion media state not active');
  const animation = await page.locator('#cp6-work-behind-laws').evaluate(el => getComputedStyle(el).animationName);
  assert(animation === 'none', `Reduced-motion contextual section still animated: ${animation}`);
  results.push({ check: 'reduced-motion', status: 'PASS' });
  await context.close();
}

async function verifyStaticEquivalent(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, selector] of allContextPages) {
    const response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' });
    assert(response && response.ok(), `Static mode HTTP failure ${route}`);
    await page.locator(selector).waitFor({ state: 'visible' });
  }
  results.push({ check: 'static-no-javascript', status: 'PASS', pages: allContextPages.length });
  await context.close();
}

async function main() {
  verifyStaticRepositoryContracts();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const profile of profiles) await verifyProfile(browser, profile);
    await verifyReducedMotion(browser);
    await verifyStaticEquivalent(browser);
  } finally {
    await browser.close();
  }
  fs.mkdirSync('artifacts/laws-cp6-contextual-verification', { recursive: true });
  fs.writeFileSync('artifacts/laws-cp6-contextual-verification/result.json', JSON.stringify({
    contract: 'LAWS_CP6_CONTEXTUAL_INTEGRATED_BROWSER_VERIFICATION_v1',
    status: 'PASS',
    baseURL,
    checks: results,
    legacyBenchmarkDisposition: 'CLASSIFIED_WITH_NO_MATERIAL_PRODUCT_FINDINGS',
    userVisualAcceptance: 'REQUIRED_NOT_RECORDED',
    mergeAuthorization: false,
  }, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
