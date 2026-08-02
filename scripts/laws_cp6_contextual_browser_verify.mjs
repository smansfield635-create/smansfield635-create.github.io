import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseURL = process.env.CP6_BASE_URL || 'http://127.0.0.1:4173';
const root = process.cwd();
const results = [];

const destinationPages = [
  { route: '/laws/research/applied-investigations/', selector: '#cp6-battery-study-index', records: 11 },
  { route: '/laws/research/evidence-and-sources/', selector: '#cp6-battery-evidence', records: 6 },
  { route: '/laws/research/methods-and-models/', selector: '#cp6-battery-method', records: 10 },
  { route: '/laws/research/findings-and-boundaries/', selector: '#main', records: 7 },
  { route: '/laws/test/admission-and-baseline/', selector: '#cp6-battery-admission', records: 2 },
  { route: '/laws/test/forward-construction/', selector: '#cp6-battery-forward', records: 1 },
  { route: '/laws/test/reverse-audit/', selector: '#main', records: 4 },
  { route: '/laws/test/result-and-record/', selector: '#cp6-battery-result', records: 7 },
];

const relationshipPages = [
  '/laws/categories/flow/',
  '/laws/categories/integrity/',
  '/laws/categories/reality/',
  '/laws/categories/structure/',
];

const contextualPages = [
  { route: '/laws/', selector: '#cp6-work-behind-laws' },
  ...destinationPages.map(({ route, selector }) => ({ route, selector })),
  ...relationshipPages.map(route => ({ route, selector: '#cp6-battery-law-relationships' })),
];

const cohortPages = [
  {
    name: 'signals',
    route: '/laws/categories/flow/signals/',
    routeAttribute: '/laws/categories/flow/signals/',
    family: 'LAW_CHILD',
    tabs: 3,
    records: [],
  },
  {
    name: 'measure',
    route: '/laws/categories/reality/measure.html',
    routeAttribute: '/laws/categories/reality/measure.html',
    narrativeRoute: '/laws/categories/reality/measure/',
    family: 'LAW_CHILD',
    tabs: 3,
    records: [],
  },
  {
    name: 'reverse-audit',
    route: '/laws/test/reverse-audit/',
    routeAttribute: '/laws/test/reverse-audit/',
    family: 'TEST_CHILD',
    tabs: 5,
    records: ['CP6-CONTENT-119', 'CP6-CONTENT-121', 'CP6-CONTENT-122', 'CP6-CONTENT-137'],
  },
  {
    name: 'findings-and-boundaries',
    route: '/laws/research/findings-and-boundaries/',
    routeAttribute: '/laws/research/findings-and-boundaries/',
    family: 'RESEARCH_CHILD',
    tabs: 5,
    records: [
      'CP6-CONTENT-071', 'CP6-CONTENT-080', 'CP6-CONTENT-082',
      'CP6-CONTENT-083', 'CP6-CONTENT-084', 'CP6-CONTENT-085',
      'CP6-CONTENT-086',
    ],
  },
  {
    name: 'industrial-posture',
    route: '/laws/industrial-posture/',
    routeAttribute: '/laws/industrial-posture/',
    family: 'EQUATION_OR_MODEL_SURFACE',
    tabs: 6,
    records: ['CP6-CONTENT-063'],
  },
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
  const clean = route.split('#')[0].split('?')[0].replace(/^\//, '');
  if (!clean) return path.join(root, 'index.html');
  if (clean.endsWith('.html')) return path.join(root, clean);
  return path.join(root, clean, 'index.html');
}

function canonicalContentIds(html) {
  return new Set([...html.matchAll(/data-content-id="(CP6-CONTENT-\d+)"/g)].map(match => match[1]));
}

function readCSSGraph(entry, visited = new Set()) {
  const absolute = path.resolve(root, entry);
  if (visited.has(absolute)) return '';
  visited.add(absolute);
  const css = fs.readFileSync(absolute, 'utf8');
  const directory = path.dirname(absolute);
  const imported = [...css.matchAll(/@import\s+url\(["']?(\.\/[^"')]+)["']?\)\s*;/g)]
    .map(match => readCSSGraph(path.resolve(directory, match[1]), visited));
  return [css, ...imported].join('\n');
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

  for (const { route } of contextualPages) {
    assert(fs.existsSync(localPathForRoute(route)), `Missing local route target: ${route}`);
  }
  for (const page of cohortPages) {
    assert(fs.existsSync(localPathForRoute(page.route)), `Missing cohort route target: ${page.route}`);
  }

  const allMigratedIds = new Set();
  for (const { route, records } of destinationPages) {
    const html = fs.readFileSync(localPathForRoute(route), 'utf8');
    const ids = canonicalContentIds(html);
    assert(ids.size === records, `${route}: expected ${records} canonical records, found ${ids.size}`);
    for (const id of ids) {
      assert(!allMigratedIds.has(id), `${route}: duplicate canonical record identity ${id}`);
      allMigratedIds.add(id);
    }
  }
  assert(allMigratedIds.size === 48, `Expected 48 unique migrated records, found ${allMigratedIds.size}`);

  const sharedCSS = readCSSGraph('assets/laws-destination/renewal.css');
  const sharedJS = fs.readFileSync('assets/laws-destination/renewal.js', 'utf8');
  assert(sharedCSS.includes('@media (max-width: 920px)'), 'Tablet breakpoint missing');
  assert(sharedCSS.includes('@media (max-width: 680px)'), 'Phone breakpoint missing');
  assert(sharedCSS.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion CSS missing');
  for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End']) {
    assert(sharedJS.includes(key), `Shared keyboard operation missing: ${key}`);
  }
  assert(!sharedJS.includes('setInterval('), 'Continuous interval loop introduced');
  assert(!sharedJS.includes('canvas.getContext'), 'Shared interaction engine acquired canvas authority');

  for (const page of cohortPages) {
    const html = fs.readFileSync(localPathForRoute(page.route), 'utf8');
    assert(html.includes(`data-route="${page.routeAttribute}"`), `${page.name}: route identity changed`);
    assert(html.includes(`data-page-family="${page.family}"`), `${page.name}: page-family adapter missing`);
    if (page.narrativeRoute) assert(html.includes(`data-narrative-route="${page.narrativeRoute}"`), `${page.name}: narrative route missing`);
    assert(html.includes('/assets/laws-destination/renewal.css'), `${page.name}: shared CSS missing`);
    assert(html.includes('/assets/laws-destination/renewal.js'), `${page.name}: shared JS missing`);
    assert(html.includes('class="lr-hero"'), `${page.name}: page-specific hero missing`);
    assert(html.includes('class="lr-boundary"'), `${page.name}: visible claim boundary missing`);
    assert(html.includes('class="lr-story-nav"'), `${page.name}: story context missing`);
    assert(html.includes('class="lr-audit"'), `${page.name}: collapsed audit missing`);
    assert(!html.toLowerCase().includes('<meta http-equiv="refresh"'), `${page.name}: redirect metadata introduced`);
    assert(!html.includes('location.replace('), `${page.name}: redirect script introduced`);
    const tabs = (html.match(/role="tab"/g) || []).length;
    const panels = (html.match(/role="tabpanel"/g) || []).length;
    assert(tabs === page.tabs && panels === page.tabs, `${page.name}: tab/panel adapter mismatch ${tabs}/${panels}`);
    assert((html.match(/aria-selected="true"/g) || []).length === 0, `${page.name}: a reading control is preselected in source`);
    assert((html.match(/aria-expanded="false" type="button"/g) || []).length === page.tabs, `${page.name}: zero-open source contract is incomplete`);
    assert((html.match(/<details class="lr-page-facts" open>/g) || []).length === 1, `${page.name}: static Page facts fallback missing`);
    assert((html.match(/<details class="lr-audit" open>/g) || []).length === 1, `${page.name}: static audit fallback missing`);
    assert(html.includes("document.documentElement.classList.add('lr-js')"), `${page.name}: enhanced-entry bootstrap missing`);
    assert(!html.includes('role="tabpanel" hidden'), `${page.name}: static panel hidden in source`);
    for (const id of page.records) assert(html.includes(`data-content-id="${id}"`), `${page.name}: canonical record missing ${id}`);
  }

  const signals = fs.readFileSync(localPathForRoute('/laws/categories/flow/signals/'), 'utf8');
  const measure = fs.readFileSync(localPathForRoute('/laws/categories/reality/measure.html'), 'utf8');
  const reverse = fs.readFileSync(localPathForRoute('/laws/test/reverse-audit/'), 'utf8');
  const findings = fs.readFileSync(localPathForRoute('/laws/research/findings-and-boundaries/'), 'utf8');
  const industrial = fs.readFileSync(localPathForRoute('/laws/industrial-posture/'), 'utf8');
  assert(signals.includes('/laws/categories/flow/#signals'), 'Signals historical family owner missing');
  assert(measure.includes('data-narrative-route="/laws/categories/reality/measure/"'), 'Measure narrative identity missing');
  assert(reverse.includes('LAWS_COMPASS_WORLD_PASS_PLANET_AND_SHOWROOM_COSMOS_READY_HTML_RECEIPT_v2_3_0'), 'Reverse Audit structural provenance missing');
  assert(findings.includes('1,653 final-test records') && findings.includes('AUROC 0.9394'), 'Findings bounded result missing');
  assert(industrial.includes('M_in = M_out + M_dest + ΔM_inv ± ε'), 'Industrial equation identity missing');
  assert(industrial.includes('2c4caa3dea93fc96fcfd259c7bcdf000ccbc43ce826484298ae9cc9e72551657'), 'Industrial payload hash missing');

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
  for (const file of verification.changed_product_files.filter(file => file.endsWith('.html'))) {
    const text = fs.readFileSync(file, 'utf8').toLowerCase();
    for (const phrase of forbidden) assert(!text.includes(phrase.toLowerCase()), `Forbidden claim in ${file}: ${phrase}`);
  }

  results.push({
    check: 'repository-contracts',
    status: 'PASS',
    migratedRecords: allMigratedIds.size,
    recordVerification: 'UNIQUE_IDS_WITH_FROZEN_PER_DESTINATION_COUNTS',
    compatibilityBindings: 9,
    cohortPages: cohortPages.length,
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

async function verifyCohortPage(page, cohort, profileName) {
  const response = await page.goto(baseURL + cohort.route, { waitUntil: 'networkidle' });
  assert(response && response.ok(), `${profileName}: HTTP failure ${cohort.route}`);
  await page.locator('#main').waitFor({ state: 'visible' });

  const snapshot = await page.evaluate(() => ({
    route: document.documentElement.dataset.route || '',
    family: document.documentElement.dataset.pageFamily || '',
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    hero: Boolean(document.querySelector('.lr-hero')),
    boundary: Boolean(document.querySelector('.lr-boundary')),
    storyLinks: document.querySelectorAll('.lr-story-nav a').length,
    auditOpen: Boolean(document.querySelector('.lr-audit')?.open),
    pageFactsOpen: Boolean(document.querySelector('.lr-page-facts')?.open),
    tabs: document.querySelectorAll('.lr-tab').length,
    panels: document.querySelectorAll('.lr-panel').length,
    expandedControls: document.querySelectorAll('.lr-tab[aria-expanded="true"]').length,
    visiblePanels: [...document.querySelectorAll('.lr-panel')].filter(panel => !panel.hidden && getComputedStyle(panel).display !== 'none').length,
    browserErrors: document.documentElement.dataset.lrBrowserErrors || '0',
    overflowFlag: document.documentElement.dataset.lrOverflow || '0',
  }));

  assert(snapshot.route === cohort.routeAttribute, `${profileName}/${cohort.name}: route identity changed`);
  assert(snapshot.family === cohort.family, `${profileName}/${cohort.name}: page family changed`);
  assert(snapshot.hero && snapshot.boundary, `${profileName}/${cohort.name}: hero or boundary missing`);
  assert(snapshot.storyLinks >= 2, `${profileName}/${cohort.name}: story navigation incomplete`);
  assert(snapshot.tabs === cohort.tabs && snapshot.panels === cohort.tabs, `${profileName}/${cohort.name}: control/panel count mismatch`);
  assert(snapshot.expandedControls === 0 && snapshot.visiblePanels === 0, `${profileName}/${cohort.name}: zero-open entry state invalid`);
  assert(snapshot.pageFactsOpen === false, `${profileName}/${cohort.name}: Page facts is not collapsed on entry`);
  assert(snapshot.auditOpen === false, `${profileName}/${cohort.name}: audit is not collapsed on entry`);
  assert(snapshot.scrollWidth <= snapshot.clientWidth + 2, `${profileName}/${cohort.name}: horizontal overflow ${snapshot.scrollWidth}/${snapshot.clientWidth}`);
  assert(snapshot.scrollHeight > snapshot.clientHeight, `${profileName}/${cohort.name}: page content unexpectedly absent`);
  assert(snapshot.browserErrors === '0' && snapshot.overflowFlag === '0', `${profileName}/${cohort.name}: shared engine health failure`);

  const tabs = page.locator('.lr-tab');
  const panels = page.locator('.lr-panel');
  await tabs.nth(0).click();
  assert(await tabs.nth(0).getAttribute('aria-expanded') === 'true', `${profileName}/${cohort.name}: pointer/touch disclosure activation failed`);
  const controlledPanel = await tabs.nth(0).getAttribute('aria-controls');
  assert(controlledPanel && await page.locator(`#${controlledPanel}`).isVisible(), `${profileName}/${cohort.name}: selected panel not visible`);

  if (cohort.tabs > 1) {
    await tabs.nth(1).click();
    assert(await tabs.nth(0).getAttribute('aria-expanded') === 'false', `${profileName}/${cohort.name}: opening a second panel did not close the first`);
    assert(await tabs.nth(1).getAttribute('aria-expanded') === 'true', `${profileName}/${cohort.name}: second panel did not open`);
    assert(!(await panels.nth(0).isVisible()) && await panels.nth(1).isVisible(), `${profileName}/${cohort.name}: exclusive panel visibility failed`);
    await tabs.nth(1).click();
    assert(await tabs.nth(1).getAttribute('aria-expanded') === 'false', `${profileName}/${cohort.name}: active panel did not toggle closed`);
  } else {
    await tabs.nth(0).click();
  }
  assert((await tabs.evaluateAll(elements => elements.filter(element => element.getAttribute('aria-expanded') === 'true').length)) === 0, `${profileName}/${cohort.name}: a panel remained expanded after toggle-close`);

  await tabs.nth(0).focus();
  await page.keyboard.press('End');
  assert(await tabs.nth(cohort.tabs - 1).evaluate(element => document.activeElement === element), `${profileName}/${cohort.name}: End-key focus operation failed`);
  await page.keyboard.press('Home');
  assert(await tabs.nth(0).evaluate(element => document.activeElement === element), `${profileName}/${cohort.name}: Home-key focus operation failed`);
  if (cohort.tabs > 1) {
    await page.keyboard.press('ArrowRight');
    assert(await tabs.nth(1).evaluate(element => document.activeElement === element), `${profileName}/${cohort.name}: Arrow-key focus operation failed`);
  }
  assert((await tabs.evaluateAll(elements => elements.filter(element => element.getAttribute('aria-expanded') === 'true').length)) === 0, `${profileName}/${cohort.name}: keyboard focus movement opened a panel`);

  const pageFacts = page.locator('.lr-page-facts');
  await pageFacts.locator('summary').click();
  assert(await pageFacts.evaluate(element => element.open), `${profileName}/${cohort.name}: Page facts disclosure failed`);
  await pageFacts.locator('summary').click();
  assert(!(await pageFacts.evaluate(element => element.open)), `${profileName}/${cohort.name}: Page facts did not close`);

  const audit = page.locator('.lr-audit');
  await audit.locator(':scope > summary').click();
  assert(await audit.evaluate(element => element.open), `${profileName}/${cohort.name}: native audit disclosure failed`);
  assert(await audit.locator('.lr-audit__body').isVisible(), `${profileName}/${cohort.name}: audit body did not become visible`);

  results.push({
    check: `cohort-${profileName}-${cohort.name}`,
    status: 'PASS',
    controls: cohort.tabs,
    initialOpenPanels: 0,
    keyboardFocusWithoutOpen: true,
    pointerOrTouch: true,
    exclusiveOrZeroOpen: true,
    pageFactsDisclosure: true,
    auditDisclosure: true,
    overflow: 0,
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
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));

  for (const { route, selector } of contextualPages) {
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
  for (const cohort of cohortPages) await verifyCohortPage(page, cohort, profile.name);

  assert(consoleErrors.length === 0, `${profile.name}: browser errors: ${consoleErrors.join(' | ')}`);
  results.push({
    check: `browser-${profile.name}`,
    status: 'PASS',
    contextualPages: contextualPages.length,
    cohortPages: cohortPages.length,
    overflow: 0,
    browserErrors: 0,
  });
  await context.close();
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const cohort of cohortPages) {
    await page.goto(baseURL + cohort.route, { waitUntil: 'networkidle' });
    assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), `${cohort.name}: reduced-motion media state not active`);
    const animation = await page.locator('.lr-hero').evaluate(element => getComputedStyle(element).animationName);
    assert(animation === 'none', `${cohort.name}: reduced-motion hero still animated: ${animation}`);
    assert(await page.evaluate(() => document.documentElement.dataset.lrMotion) === 'reduced', `${cohort.name}: shared reduced-motion state missing`);
  }
  results.push({ check: 'reduced-motion', status: 'PASS', pages: cohortPages.length });
  await context.close();
}

async function verifyStaticEquivalent(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  for (const cohort of cohortPages) {
    const response = await page.goto(baseURL + cohort.route, { waitUntil: 'domcontentloaded' });
    assert(response && response.ok(), `Static mode HTTP failure ${cohort.route}`);
    await page.locator('#main').waitFor({ state: 'visible' });
    const panels = page.locator('[role="tabpanel"]');
    assert(await panels.count() === cohort.tabs, `${cohort.name}: static panel count mismatch`);
    for (let index = 0; index < cohort.tabs; index += 1) {
      assert(await panels.nth(index).isVisible(), `${cohort.name}: static reading panel ${index} hidden`);
    }
    const pageFacts = page.locator('.lr-page-facts');
    assert(await pageFacts.locator('.lr-page-facts__body').isVisible(), `${cohort.name}: static Page facts content unavailable`);
    const audit = page.locator('.lr-audit');
    assert(await audit.locator('.lr-audit__body').isVisible(), `${cohort.name}: static audit content unavailable`);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    assert(dimensions.scrollWidth <= dimensions.clientWidth + 2, `${cohort.name}: static horizontal overflow`);
  }
  results.push({ check: 'static-no-javascript', status: 'PASS', pages: cohortPages.length, allReadingPanelsVisible: true });
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
    contract: 'LAWS_COMPLETE_RENEWAL_REPRESENTATIVE_BROWSER_VERIFICATION_v1',
    status: 'PASS',
    baseURL,
    checks: results,
    cohortRoutes: cohortPages.map(page => page.route),
    legacyBenchmarkDisposition: 'CLASSIFIED_WITH_NO_MATERIAL_PRODUCT_FINDINGS',
    userVisualAcceptance: 'REQUIRED_NOT_RECORDED',
    batchMigration: 'HELD',
    mergeAuthorization: false,
  }, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
