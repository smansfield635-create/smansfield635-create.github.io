import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseURL = process.env.LAWS_CP6_FINAL_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = path.join(root, 'artifacts/laws-cp6-final-synchronization');
fs.mkdirSync(artifactDir, { recursive: true });

const narrative = JSON.parse(fs.readFileSync('laws/control-plane/narrative/laws-complete-narrative-map-v1.json', 'utf8'));
const batteryScope = JSON.parse(fs.readFileSync('laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json', 'utf8'));

const methodsShowroomRoute = '/laws/research/methods-and-models/';
const methodsShowroomContract = 'METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1';
const methodsCanonicalArchive = 'METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT';

const storyToServed = new Map([
  ['/laws/categories/reality/theory/', '/laws/categories/reality/theory.html'],
  ['/laws/categories/reality/evidence/', '/laws/categories/reality/evidence.html'],
  ['/laws/categories/reality/measure/', '/laws/categories/reality/measure.html'],
  ['/laws/categories/reality/limits/', '/laws/categories/reality/limits.html'],
  ['/laws/categories/structure/constraints/', '/laws/categories/structure/constraints.html'],
  ['/laws/categories/structure/interfaces/', '/laws/categories/structure/interfaces.html'],
  ['/laws/categories/structure/boundaries/', '/laws/categories/structure/boundaries.html'],
  ['/laws/categories/structure/governance/', '/laws/categories/structure/governance.html'],
]);
const servedRoute = route => storyToServed.get(route) || route;

const childPages = narrative.pages.map(page => ({
  route: servedRoute(page.route),
  canonicalRoute: page.route,
  name: `${page.authority}-${page.page_title}`,
  methodsShowroom: page.route === methodsShowroomRoute,
  expectedReadings: page.route === methodsShowroomRoute ? 0 : (['FLOW', 'INTEGRITY', 'REALITY', 'STRUCTURE'].includes(page.authority) ? 3 : 5),
}));
const familyPages = ['/laws/categories/flow/', '/laws/categories/integrity/', '/laws/categories/reality/', '/laws/categories/structure/']
  .map(route => ({ route, name: `family-${route}`, expectedReadings: 3, methodsShowroom: false }));
const wrapperPages = ['/laws/battery-heldout-study/', '/laws/scientific-law/battery-heldout-study/', '/laws/categories/reality/battery-heldout-study/']
  .map(route => ({ route, name: `wrapper-${route}`, expectedReadings: 0, methodsShowroom: false }));
const frontier = { route: '/frontier/energy/battery-coherence-study/', name: 'frontier-battery', expectedReadings: 3, methodsShowroom: false };
const landing = { route: '/laws/', name: 'laws-landing', expectedReadings: null, methodsShowroom: false };
const renewedPages = [...childPages, ...familyPages, ...wrapperPages, frontier];
const allPages = [landing, ...renewedPages];
const roomCarouselRoutes = [...childPages.filter(page => !page.methodsShowroom).map(page => page.route), '/laws/research/'];

const profiles = [
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];
const screenshots = new Set([
  '/laws/',
  '/laws/categories/flow/cycles/',
  '/laws/categories/integrity/accountability/',
  '/laws/categories/reality/evidence.html',
  '/laws/categories/structure/constraints.html',
  '/laws/test/reverse-audit/',
  '/laws/research/methods-and-models/',
  '/frontier/energy/battery-coherence-study/',
]);
const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function safeName(value) {
  return value.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';
}
function collectErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      errors.push(`console:${message.text()}`);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      const url = new URL(response.url());
      if (url.pathname !== '/favicon.ico') errors.push(`response:${response.status()}:${url.pathname}`);
    }
  });
  return errors;
}
async function gotoChecked(page, route) {
  const response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert(response, `${route}: no response`);
  assert(response.status() === 200, `${route}: HTTP ${response.status()}`);
  await page.waitForTimeout(80);
}
async function health(page, route, errors) {
  const value = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
  }));
  assert(value.scroll <= value.client + 1, `${route}: overflow ${value.scroll}/${value.client}`);
  assert(value.title, `${route}: title missing`);
  assert(value.h1, `${route}: h1 missing`);
  assert(errors.length === 0, `${route}: ${errors.join(' | ')}`);
  return value;
}
async function navCheck(page, route, profile) {
  const toggle = page.locator('.lr-nav-toggle');
  await toggle.waitFor({ state: 'visible', timeout: 5000 });
  const nav = page.locator('.lr-topbar .lr-nav');
  assert(await toggle.count() === 1, `${route}: nav toggle count`);
  assert(await nav.count() === 1, `${route}: nav missing`);
  if (profile === 'desktop') {
    assert(await toggle.getAttribute('aria-expanded') === 'true', `${route}: desktop nav not expanded`);
    assert(await nav.isVisible(), `${route}: desktop nav hidden`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: desktop collapse state`);
    assert(!(await nav.isVisible()), `${route}: desktop collapse visibility`);
    await toggle.click();
  } else {
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: compact nav not collapsed`);
    assert(!(await nav.isVisible()), `${route}: compact nav visible`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'true' && await nav.isVisible(), `${route}: compact open failed`);
    await page.keyboard.press('Escape');
    assert(await toggle.getAttribute('aria-expanded') === 'false' && !(await nav.isVisible()), `${route}: Escape close failed`);
  }
}
async function readingCheck(page, descriptor) {
  if (!descriptor.expectedReadings) return;
  const groups = page.locator('[data-lr-tabs]');
  assert(await groups.count() === 1, `${descriptor.route}: reading group count ${await groups.count()}`);
  const group = groups.first();
  const buttons = group.locator('.lr-tab');
  const panels = group.locator('.lr-panel');
  assert(await buttons.count() === descriptor.expectedReadings, `${descriptor.route}: buttons ${await buttons.count()}/${descriptor.expectedReadings}`);
  assert(await panels.count() === descriptor.expectedReadings, `${descriptor.route}: panels ${await panels.count()}/${descriptor.expectedReadings}`);
  assert(await buttons.locator('[aria-expanded="true"]').count() === 0, `${descriptor.route}: reading open on entry`);
  for (let index = 0; index < descriptor.expectedReadings; index += 1) {
    assert(!(await panels.nth(index).isVisible()), `${descriptor.route}: panel ${index} visible on entry`);
  }

  await buttons.nth(0).click();
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'true', `${descriptor.route}: first reading did not open`);
  assert(await panels.nth(0).isVisible(), `${descriptor.route}: first panel hidden`);
  await buttons.nth(0).click();
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'false', `${descriptor.route}: open reading did not collapse`);
  assert(!(await panels.nth(0).isVisible()), `${descriptor.route}: collapsed panel visible`);

  const second = descriptor.expectedReadings > 1 ? 1 : 0;
  await buttons.nth(second).focus();
  await page.keyboard.press('Enter');
  assert(await buttons.nth(second).getAttribute('aria-expanded') === 'true', `${descriptor.route}: keyboard activation failed`);
  assert(await panels.nth(second).isVisible(), `${descriptor.route}: keyboard panel hidden`);

  const next = (second + 1) % descriptor.expectedReadings;
  await buttons.nth(next).click();
  assert(await buttons.nth(next).getAttribute('aria-expanded') === 'true', `${descriptor.route}: next reading did not open`);
  assert(await buttons.locator('[aria-expanded="true"]').count() === 1, `${descriptor.route}: exclusive reading state failed`);
  assert(!(await panels.nth(second).isVisible()), `${descriptor.route}: previous panel remained visible`);
}
async function auditCheck(page, route, profile) {
  const audit = page.locator('details.lr-audit').first();
  if (!(await audit.count())) return;
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit open on enhanced entry`);
  await audit.locator('summary').click();
  assert(await audit.evaluate(node => node.open), `${route}: audit open failed`);
  if (profile === 'phone') {
    const width = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }));
    assert(width.scroll <= width.client + 1, `${route}: audit overflow`);
  }
  await audit.locator('summary').click();
}
async function methodsShowroomCheck(page, route) {
  const contract = await page.locator('html').getAttribute('data-methods-models-contract');
  assert(contract === methodsShowroomContract, `${route}: showroom contract ${contract}`);
  assert(await page.locator('html').getAttribute('data-canonical-archive') === methodsCanonicalArchive, `${route}: canonical archive binding`);
  assert(await page.locator('html').getAttribute('data-source-completeness') === 'open', `${route}: source completeness drift`);
  assert(await page.locator('.mm-nav').count() === 1 && await page.locator('.mm-nav').isVisible(), `${route}: showroom nav missing`);
  await page.locator('[data-mm-carousel] .mm-card[data-active="true"]').waitFor({ state: 'visible', timeout: 15000 });
  const tabs = page.locator('.mm-family-tab');
  const cards = page.locator('.mm-card');
  assert(await tabs.count() === 5, `${route}: family tabs ${await tabs.count()}/5`);
  assert(await cards.count() === 5, `${route}: family cards ${await cards.count()}/5`);
  assert(await page.locator('.mm-card[data-active="true"]').count() === 1, `${route}: active card count`);
  assert(await page.locator('dialog').count() === 0, `${route}: detached dialog present`);
  assert(await page.locator('.mm-disclosure').count() >= 1, `${route}: disclosure missing`);
  const initialFamily = await page.locator('.mm-card[data-active="true"]').getAttribute('data-family-id');
  await page.locator('[data-mm-viewport]').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(previous => document.querySelector('.mm-card[data-active="true"]')?.dataset.familyId !== previous, initialFamily);
  const nextFamily = await page.locator('.mm-card[data-active="true"]').getAttribute('data-family-id');
  assert(nextFamily && nextFamily !== initialFamily, `${route}: showroom keyboard movement failed`);
}

async function verifyProfiles(browser) {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.hasTouch, deviceScaleFactor: 1 });
    for (const descriptor of allPages) {
      const page = await context.newPage();
      const errors = collectErrors(page);
      await gotoChecked(page, descriptor.route);
      const state = await health(page, descriptor.route, errors);
      if (descriptor.route === '/laws/') {
        const rolodex = page.locator('[data-laws-root-rolodex-section]');
        await rolodex.waitFor({ state: 'visible', timeout: 5000 });
        assert(await page.locator('html').getAttribute('data-laws-root-rolodex') === 'active', '/laws/: root rolodex not active');
        assert(await rolodex.count() === 1, '/laws/: root rolodex missing');
        const applied = rolodex.locator('.laws-rolodex-card[data-destination-id="applied-investigations"]');
        assert(await applied.count() === 1, '/laws/: applied investigations destination missing');
        assert((await applied.textContent() || '').toLowerCase().includes('battery health'), '/laws/: battery-health context missing from applied investigations destination');
        await applied.locator('button.laws-rolodex-enter').click();
        const appliedRoute = page.locator('.laws-exhibit-route');
        await appliedRoute.waitFor({ state: 'visible', timeout: 5000 });
        assert(await appliedRoute.getAttribute('href') === '/laws/research/applied-investigations/', '/laws/: applied investigations route drift');
        await page.keyboard.press('Escape');
        assert(await page.locator('.laws-first-rail').count() === 1, '/laws/: persistent FIRST rail missing');
        assert(await page.locator('[data-laws-experience-indicator]').count() === 5, '/laws/: FIRST indicator count');
      } else if (descriptor.methodsShowroom) {
        await methodsShowroomCheck(page, descriptor.route);
      } else {
        await navCheck(page, descriptor.route, profile.name);
        await readingCheck(page, descriptor);
        await auditCheck(page, descriptor.route, profile.name);
        if (!descriptor.route.includes('battery-heldout-study')) {
          assert(await page.locator('.lr-boundary').count() >= 1, `${descriptor.route}: boundary missing`);
        }
      }
      if (screenshots.has(descriptor.route) && ['phone', 'desktop'].includes(profile.name)) {
        await page.screenshot({ path: path.join(artifactDir, `${profile.name}-${safeName(descriptor.route)}.png`), fullPage: false });
      }
      results.push({ check: descriptor.methodsShowroom ? 'methods-showroom-profile' : 'profile', profile: profile.name, route: descriptor.route, status: 'PASS', title: state.title, h1: state.h1 });
      await page.close();
    }
    await context.close();
  }
}

async function verifyReduced(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const descriptor of renewedPages) {
    const page = await context.newPage();
    const errors = collectErrors(page);
    await gotoChecked(page, descriptor.route);
    if (descriptor.methodsShowroom) {
      assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), `${descriptor.route}: reduced motion media not active`);
      await page.locator('[data-mm-carousel] .mm-card[data-active="true"]').waitFor({ state: 'visible', timeout: 15000 });
    } else {
      assert(await page.locator('html').getAttribute('data-lr-motion') === 'reduced', `${descriptor.route}: reduced motion not declared`);
    }
    await health(page, descriptor.route, errors);
    results.push({ check: 'reduced-motion', route: descriptor.route, status: 'PASS' });
    await page.close();
  }
  await context.close();
}

async function verifyStatic(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  for (const descriptor of allPages) {
    const page = await context.newPage();
    const errors = collectErrors(page);
    await gotoChecked(page, descriptor.route);
    await health(page, descriptor.route, errors);
    if (descriptor.route === '/laws/') {
      assert(await page.locator('#cp6-work-behind-laws.lr-battery-landing').count() === 1, '/laws/: static battery module missing');
      assert(await page.locator('[data-laws-supporting-panel="evidence-applied"] #cp6-work-behind-laws').count() === 1, '/laws/: static battery module custody drift');
    } else if (descriptor.methodsShowroom) {
      assert(await page.locator('.mm-nav').count() === 1 && await page.locator('.mm-nav').isVisible(), `${descriptor.route}: static showroom nav missing`);
      assert(await page.locator('.mm-disclosure').count() >= 1, `${descriptor.route}: static showroom disclosure missing`);
      assert(await page.locator('noscript .mm-disclosure').count() === 1, `${descriptor.route}: static showroom noscript boundary missing`);
    } else {
      assert(await page.locator('.lr-nav-toggle').count() === 0, `${descriptor.route}: JS toggle exists in static mode`);
      assert(await page.locator('.lr-topbar .lr-nav').isVisible(), `${descriptor.route}: static nav hidden`);
      if (descriptor.expectedReadings) {
        const buttons = page.locator('[data-lr-tabs] .lr-tab');
        const panels = page.locator('[data-lr-tabs] .lr-panel');
        assert(await buttons.count() === descriptor.expectedReadings, `${descriptor.route}: static reading count`);
        for (let index = 0; index < descriptor.expectedReadings; index += 1) {
          assert(await panels.nth(index).isVisible(), `${descriptor.route}: static panel ${index} hidden`);
        }
      }
    }
    results.push({ check: 'static-no-js', route: descriptor.route, status: 'PASS' });
    await page.close();
  }
  await context.close();
}

async function verifyRoomCarousel(browser) {
  assert(roomCarouselRoutes.length === 24, `Room carousel route count ${roomCarouselRoutes.length}`);
  assert(new Set(roomCarouselRoutes).size === 24, 'Duplicate room carousel route');

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const route of roomCarouselRoutes) {
    const page = await context.newPage();
    const errors = collectErrors(page);
    await gotoChecked(page, route);
    await health(page, route, errors);
    const root = page.locator('[data-laws-room-carousel]').first();
    assert(await root.count() === 1, `${route}: carousel root missing`);
    assert(await root.getAttribute('data-lrc-mounted') === 'true', `${route}: carousel runtime not mounted`);
    const cards = root.locator('[data-lrc-card]');
    assert(await cards.count() >= 2, `${route}: insufficient spatial states ${await cards.count()}`);
    const before = await root.getAttribute('data-lrc-index');
    await root.locator('[data-lrc-viewport]').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(30);
    const after = await root.getAttribute('data-lrc-index');
    assert(before !== after, `${route}: carousel keyboard one-step failed`);
    assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), `${route}: room reduced motion media not active`);
    results.push({ check: 'room-carousel-runtime', route, status: 'PASS', cardCount: await cards.count(), activeBefore: before, activeAfter: after });
    await page.close();
  }
  await context.close();

  const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  for (const route of roomCarouselRoutes) {
    const page = await staticContext.newPage();
    const errors = collectErrors(page);
    await gotoChecked(page, route);
    await health(page, route, errors);
    const root = page.locator('[data-laws-room-carousel]').first();
    assert(await root.count() === 1, `${route}: static carousel root missing`);
    assert(await root.getAttribute('data-lrc-mounted') !== 'true', `${route}: runtime mounted with JavaScript disabled`);
    results.push({ check: 'room-carousel-static-no-js', route, status: 'PASS' });
    await page.close();
  }
  await staticContext.close();
}

async function main() {
  assert(childPages.length === 24, `Child route count ${childPages.length}`);
  assert(batteryScope.public_surface_count === 27, 'Battery scope drift');
  assert(allPages.length === 33, `Integrated route count ${allPages.length}`);
  assert(roomCarouselRoutes.length === 24, `Room carousel route count ${roomCarouselRoutes.length}`);

  const browser = await chromium.launch({ headless: true });
  try {
    await verifyProfiles(browser);
    await verifyReduced(browser);
    await verifyStatic(browser);
    await verifyRoomCarousel(browser);
  } finally {
    await browser.close();
  }

  const summary = {
    contract: 'LAWS_CP6_FINAL_SYNCHRONIZATION_BROWSER_VERIFICATION_v1',
    status: 'PASS',
    head: process.env.GITHUB_SHA || 'LOCAL',
    childRoutes: 24,
    integratedRoutes: 33,
    batteryPublicSurfaces: 27,
    methodsModelsAlternateContract: 'PASS',
    roomCarouselRoutes: 24,
    roomCarouselRuntimeExecutions: 24,
    roomCarouselStaticNoJavaScriptExecutions: 24,
    profiles: profiles.map(profile => profile.name),
    profilePageExecutions: allPages.length * profiles.length,
    reducedMotionExecutions: renewedPages.length,
    staticNoJavaScriptExecutions: allPages.length,
    zeroOpenExclusiveOrZeroReadings: 'PASS',
    collapsibleNavigation: 'PASS',
    persistentFirstRail: 'PASS',
    auditDisclosure: 'PASS',
    horizontalOverflow: 0,
    browserErrors: 0,
    results,
  };
  fs.writeFileSync(path.join(artifactDir, 'browser-result.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch(error => {
  const failure = {
    contract: 'LAWS_CP6_FINAL_SYNCHRONIZATION_BROWSER_VERIFICATION_v1',
    status: 'FAIL',
    head: process.env.GITHUB_SHA || 'LOCAL',
    message: error.stack || String(error),
    results,
  };
  fs.writeFileSync(path.join(artifactDir, 'browser-result.json'), JSON.stringify(failure, null, 2) + '\n');
  console.error(error.stack || error);
  process.exit(1);
});
