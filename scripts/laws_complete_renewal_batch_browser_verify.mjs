import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseURL = process.env.LAWS_BATCH_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = path.join(root, 'artifacts/laws-complete-renewal-batch-verification');
fs.mkdirSync(artifactDir, { recursive: true });

const narrative = JSON.parse(fs.readFileSync('laws/control-plane/narrative/laws-complete-narrative-map-v1.json', 'utf8'));
const batteryScope = JSON.parse(fs.readFileSync('laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json', 'utf8'));

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
  storyRoute: page.route,
  name: `${page.authority}-${page.page_title}`,
  family: page.authority,
  expectedTabs: ['FLOW', 'INTEGRITY', 'REALITY', 'STRUCTURE'].includes(page.authority) ? 3 : 5,
  studyRelationship: page.related_study?.relationship_status || 'NO_CURRENT_ADMITTED_STUDY',
}));

const familyPages = [
  '/laws/categories/flow/',
  '/laws/categories/integrity/',
  '/laws/categories/reality/',
  '/laws/categories/structure/',
].map(route => ({ route, name: route.split('/').filter(Boolean).at(-1), expectedTabs: 3, family: 'LAW_FAMILY' }));

const wrapperPages = [
  '/laws/battery-heldout-study/',
  '/laws/scientific-law/battery-heldout-study/',
  '/laws/categories/reality/battery-heldout-study/',
].map(route => ({ route, name: `wrapper-${route}`, expectedTabs: 0, family: 'BATTERY_COMPATIBILITY_WRAPPER' }));

const frontierPage = {
  route: '/frontier/energy/battery-coherence-study/',
  name: 'frontier-battery-complete-record',
  expectedTabs: 3,
  family: 'FRONTIER_COMPLETE_STUDY',
};

const lawsLanding = { route: '/laws/', name: 'laws-landing', expectedTabs: null, family: 'LAWS_LANDING' };
const renewedPages = [...childPages, ...familyPages, ...wrapperPages, frontierPage];
const allPages = [lawsLanding, ...renewedPages];

const profiles = [
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];

const representativeScreenshots = new Set([
  '/laws/categories/flow/cycles/',
  '/laws/categories/integrity/accountability/',
  '/laws/categories/reality/evidence.html',
  '/laws/categories/structure/constraints.html',
  '/laws/test/admission-and-baseline/',
  '/laws/research/applied-investigations/',
  '/laws/battery-heldout-study/',
  '/frontier/energy/battery-coherence-study/',
]);

const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function safeName(value) {
  return value.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';
}

async function gotoChecked(page, route) {
  const response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert(response, `${route}: no navigation response`);
  assert(response.status() === 200, `${route}: expected HTTP 200, received ${response.status()}`);
  await page.waitForTimeout(35);
}

async function browserHealth(page, route, errors) {
  const health = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
  }));
  assert(health.scrollWidth <= health.clientWidth + 1, `${route}: horizontal overflow ${health.scrollWidth}/${health.clientWidth}`);
  assert(health.title.length > 0, `${route}: empty document title`);
  assert(health.h1.length > 0, `${route}: missing visible H1`);
  assert(errors.length === 0, `${route}: browser errors: ${errors.join(' | ')}`);
  return health;
}

async function verifyNavigation(page, route, profileName) {
  const topbar = page.locator('.lr-topbar');
  assert(await topbar.count() === 1, `${route}: expected one renewal topbar`);
  const toggle = page.locator('.lr-nav-toggle');
  await toggle.waitFor({ state: 'visible', timeout: 5000 });
  const nav = page.locator('.lr-topbar .lr-nav');
  assert(await nav.count() === 1, `${route}: renewal nav missing`);

  if (profileName === 'desktop') {
    assert(await toggle.getAttribute('aria-expanded') === 'true', `${route}: desktop nav should enter expanded`);
    assert(await nav.isVisible(), `${route}: desktop nav not visible on entry`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: desktop nav did not collapse`);
    assert(!(await nav.isVisible()), `${route}: desktop nav remained visible after collapse`);
    await toggle.click();
    assert(await nav.isVisible(), `${route}: desktop nav did not reopen`);
  } else {
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: compact nav should enter collapsed`);
    assert(!(await nav.isVisible()), `${route}: compact nav visible on entry`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'true', `${route}: compact nav did not open`);
    assert(await nav.isVisible(), `${route}: compact nav links not visible after open`);
    await page.keyboard.press('Escape');
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: Escape did not close nav`);
    assert(!(await nav.isVisible()), `${route}: nav remained visible after Escape`);
  }
}

async function verifyTabs(page, descriptor) {
  if (!descriptor.expectedTabs) return;
  const tabs = page.locator('[data-lr-tabs] [role="tab"]');
  const panels = page.locator('[data-lr-tabs] [role="tabpanel"]');
  assert(await tabs.count() === descriptor.expectedTabs, `${descriptor.route}: expected ${descriptor.expectedTabs} tabs, found ${await tabs.count()}`);
  assert(await panels.count() === descriptor.expectedTabs, `${descriptor.route}: expected ${descriptor.expectedTabs} panels, found ${await panels.count()}`);
  assert(await tabs.locator('[aria-selected="true"]').count() === 1, `${descriptor.route}: active tab is not singular`);

  const selectedIndex = await tabs.evaluateAll(items => items.findIndex(item => item.getAttribute('aria-selected') === 'true'));
  const nextIndex = (selectedIndex + 1) % descriptor.expectedTabs;
  await tabs.nth(nextIndex).click();
  assert(await tabs.nth(nextIndex).getAttribute('aria-selected') === 'true', `${descriptor.route}: pointer/touch tab activation failed`);
  assert(await panels.nth(nextIndex).isVisible(), `${descriptor.route}: selected panel not visible`);

  await tabs.nth(nextIndex).focus();
  await page.keyboard.press('ArrowRight');
  const keyboardIndex = (nextIndex + 1) % descriptor.expectedTabs;
  assert(await tabs.nth(keyboardIndex).getAttribute('aria-selected') === 'true', `${descriptor.route}: keyboard tab activation failed`);
  assert(await panels.nth(keyboardIndex).isVisible(), `${descriptor.route}: keyboard-selected panel not visible`);
}

async function verifyAudit(page, route, profileName) {
  const audit = page.locator('details.lr-audit').first();
  if (await audit.count() === 0) return;
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit should enter closed`);
  await audit.locator('summary').click();
  assert(await audit.evaluate(node => node.open), `${route}: audit did not open`);
  if (profileName === 'phone') {
    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }));
    assert(widths.scroll <= widths.client + 1, `${route}: audit caused horizontal overflow ${widths.scroll}/${widths.client}`);
  }
  await audit.locator('summary').click();
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit did not close`);
}

async function verifyProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });

  for (const descriptor of allPages) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console:${message.text()}`);
    });

    await gotoChecked(page, descriptor.route);
    const health = await browserHealth(page, descriptor.route, errors);

    if (descriptor.route === '/laws/') {
      assert(await page.locator('#cp6-work-behind-laws.lr-battery-landing').count() === 1, '/laws/: renewed battery context module missing');
    } else {
      await verifyNavigation(page, descriptor.route, profile.name);
      await verifyTabs(page, descriptor);
      await verifyAudit(page, descriptor.route, profile.name);
      assert(await page.locator('.lr-boundary').count() >= 1, `${descriptor.route}: claim boundary missing`);
    }

    if (representativeScreenshots.has(descriptor.route) && ['phone', 'desktop'].includes(profile.name)) {
      await page.screenshot({
        path: path.join(artifactDir, `${profile.name}-${safeName(descriptor.route)}.png`),
        fullPage: false,
      });
    }

    results.push({
      check: 'profile-page',
      profile: profile.name,
      route: descriptor.route,
      status: 'PASS',
      title: health.title,
      h1: health.h1,
      overflow: false,
      browserErrors: 0,
    });
    await page.close();
  }
  await context.close();
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const descriptor of renewedPages) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await gotoChecked(page, descriptor.route);
    assert(await page.locator('html').getAttribute('data-lr-motion') === 'reduced', `${descriptor.route}: reduced-motion state not declared`);
    await browserHealth(page, descriptor.route, errors);
    results.push({ check: 'reduced-motion', route: descriptor.route, status: 'PASS' });
    await page.close();
  }
  await context.close();
}

async function verifyStaticNoJavaScript(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  for (const descriptor of allPages) {
    const page = await context.newPage();
    await gotoChecked(page, descriptor.route);
    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    }));
    assert(widths.scroll <= widths.client + 1, `${descriptor.route}: static mode overflow ${widths.scroll}/${widths.client}`);

    if (descriptor.route !== '/laws/') {
      assert(await page.locator('.lr-nav-toggle').count() === 0, `${descriptor.route}: script-created toggle exists with JavaScript disabled`);
      assert(await page.locator('.lr-topbar .lr-nav').isVisible(), `${descriptor.route}: static navigation not visible`);
      const panels = page.locator('[role="tabpanel"]');
      for (let index = 0; index < await panels.count(); index += 1) {
        assert(await panels.nth(index).isVisible(), `${descriptor.route}: static reading panel ${index} hidden`);
      }
      const audit = page.locator('details.lr-audit').first();
      if (await audit.count()) {
        await audit.locator('summary').click();
        assert(await audit.evaluate(node => node.open), `${descriptor.route}: native static audit disclosure failed`);
      }
    }
    results.push({ check: 'static-no-javascript', route: descriptor.route, status: 'PASS' });
    await page.close();
  }
  await context.close();
}

async function main() {
  assert(childPages.length === 24, `Expected 24 child pages, found ${childPages.length}`);
  assert(batteryScope.public_surface_count === 27, 'Battery public-surface authority drift');
  assert(allPages.length === 33, `Expected 33 integrated review routes, found ${allPages.length}`);

  const browser = await chromium.launch({ headless: true });
  try {
    for (const profile of profiles) await verifyProfile(browser, profile);
    await verifyReducedMotion(browser);
    await verifyStaticNoJavaScript(browser);
  } finally {
    await browser.close();
  }

  const summary = {
    contract: 'LAWS_COMPLETE_RENEWAL_BATCH_BROWSER_VERIFICATION_v1',
    status: 'PASS',
    baseURL,
    childRoutes: 24,
    integratedRoutes: 33,
    batteryPublicSurfaces: 27,
    profiles: profiles.map(profile => profile.name),
    profilePageExecutions: allPages.length * profiles.length,
    reducedMotionExecutions: renewedPages.length,
    staticNoJavaScriptExecutions: allPages.length,
    collapsibleNavigation: 'PASS',
    keyboardPointerTouchTabs: 'PASS',
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
    contract: 'LAWS_COMPLETE_RENEWAL_BATCH_BROWSER_VERIFICATION_v1',
    status: 'FAIL',
    message: error.stack || error.message || String(error),
    results,
  };
  fs.writeFileSync(path.join(artifactDir, 'browser-result.json'), JSON.stringify(failure, null, 2) + '\n');
  console.error(failure.message);
  process.exit(1);
});
