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
  assert(lawsHTML.includes('data-laws-category-count="6"'), 'Six authorities marker missing');
  assert(lawsHTML.includes('data-laws-child-route-count="24"'), 'Twenty-four Laws child-route marker missing');
  assert(lawsHTML.includes('data-laws-controller-navigation-authority="true"'), 'Compass controller navigation authority missing');
  assert(lawsHTML.includes('data-laws-evidence-claim-authority="false"'), 'Evidence claim boundary changed');

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
  results.push({ check: 'repository-contracts', status: 'PASS', migratedRecords: migrated, compatibilityBindings: 9 });
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
    userVisualAcceptance: 'REQUIRED_NOT_RECORDED',
    mergeAuthorization: false,
  }, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
