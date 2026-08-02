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
  name: `${page.authority}-${page.page_title}`,
  expectedTabs: ['FLOW', 'INTEGRITY', 'REALITY', 'STRUCTURE'].includes(page.authority) ? 3 : 5,
}));
const familyPages = ['/laws/categories/flow/', '/laws/categories/integrity/', '/laws/categories/reality/', '/laws/categories/structure/']
  .map(route => ({ route, name: `family-${route}`, expectedTabs: 3 }));
const wrapperPages = ['/laws/battery-heldout-study/', '/laws/scientific-law/battery-heldout-study/', '/laws/categories/reality/battery-heldout-study/']
  .map(route => ({ route, name: `wrapper-${route}`, expectedTabs: 0 }));
const frontier = { route: '/frontier/energy/battery-coherence-study/', name: 'frontier-battery', expectedTabs: 3 };
const landing = { route: '/laws/', name: 'laws-landing', expectedTabs: null };
const renewedPages = [...childPages, ...familyPages, ...wrapperPages, frontier];
const allPages = [landing, ...renewedPages];

const profiles = [
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];
const screenshotRoutes = new Set([
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
  assert(response, `${route}: no response`);
  assert(response.status() === 200, `${route}: HTTP ${response.status()}`);
  await page.waitForTimeout(50);
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
  assert(await nav.count() === 1, `${route}: nav missing`);
  if (profile === 'desktop') {
    assert(await toggle.getAttribute('aria-expanded') === 'true', `${route}: desktop nav not expanded on entry`);
    assert(await nav.isVisible(), `${route}: desktop nav hidden on entry`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'false' && !(await nav.isVisible()), `${route}: desktop collapse failed`);
    await toggle.click();
    assert(await nav.isVisible(), `${route}: desktop reopen failed`);
  } else {
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: compact nav not collapsed on entry`);
    assert(!(await nav.isVisible()), `${route}: compact nav visible on entry`);
    await toggle.click();
    assert(await toggle.getAttribute('aria-expanded') === 'true' && await nav.isVisible(), `${route}: compact open failed`);
    await page.keyboard.press('Escape');
    assert(await toggle.getAttribute('aria-expanded') === 'false' && !(await nav.isVisible()), `${route}: Escape close failed`);
  }
}
async function tabCheck(page, descriptor) {
  if (!descriptor.expectedTabs) return;
  const groups = page.locator('[data-lr-tabs]:visible');
  assert(await groups.count() === 1, `${descriptor.route}: expected one visible current tab group, found ${await groups.count()}`);
  const group = groups.first();
  const tabs = group.locator('[role="tab"]');
  const panels = group.locator('[role="tabpanel"]');
  assert(await tabs.count() === descriptor.expectedTabs, `${descriptor.route}: tabs ${await tabs.count()}/${descriptor.expectedTabs}`);
  assert(await panels.count() === descriptor.expectedTabs, `${descriptor.route}: panels ${await panels.count()}/${descriptor.expectedTabs}`);
  assert(await tabs.locator('[aria-selected="true"]').count() === 1, `${descriptor.route}: selected tab not singular`);
  const current = await tabs.evaluateAll(items => items.findIndex(item => item.getAttribute('aria-selected') === 'true'));
  const clicked = (current + 1) % descriptor.expectedTabs;
  await tabs.nth(clicked).click();
  assert(await tabs.nth(clicked).getAttribute('aria-selected') === 'true', `${descriptor.route}: pointer/touch activation failed`);
  assert(await panels.nth(clicked).isVisible(), `${descriptor.route}: clicked panel hidden`);
  await tabs.nth(clicked).focus();
  await page.keyboard.press('ArrowRight');
  const keyboard = (clicked + 1) % descriptor.expectedTabs;
  assert(await tabs.nth(keyboard).getAttribute('aria-selected') === 'true', `${descriptor.route}: keyboard activation failed`);
  assert(await panels.nth(keyboard).isVisible(), `${descriptor.route}: keyboard panel hidden`);
}
async function auditCheck(page, route, profile) {
  const audit = page.locator('details.lr-audit').first();
  if (!(await audit.count())) return;
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit open on entry`);
  await audit.locator('summary').click();
  assert(await audit.evaluate(node => node.open), `${route}: audit open failed`);
  if (profile === 'phone') {
    const width = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) }));
    assert(width.scroll <= width.client + 1, `${route}: audit overflow ${width.scroll}/${width.client}`);
  }
  await audit.locator('summary').click();
}

async function verifyProfiles(browser) {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.hasTouch, deviceScaleFactor: 1 });
    for (const descriptor of allPages) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`console:${message.text()}`); });
      await gotoChecked(page, descriptor.route);
      const state = await health(page, descriptor.route, errors);
      if (descriptor.route === '/laws/') {
        assert(await page.locator('#cp6-work-behind-laws.lr-battery-landing').count() === 1, '/laws/: battery module missing');
      } else {
        await navCheck(page, descriptor.route, profile.name);
        await tabCheck(page, descriptor);
        await auditCheck(page, descriptor.route, profile.name);
        assert(await page.locator('.lr-boundary').count() >= 1, `${descriptor.route}: boundary missing`);
      }
      if (screenshotRoutes.has(descriptor.route) && ['phone', 'desktop'].includes(profile.name)) {
        await page.screenshot({ path: path.join(artifactDir, `${profile.name}-${safeName(descriptor.route)}.png`), fullPage: false });
      }
      results.push({ check: 'profile', profile: profile.name, route: descriptor.route, status: 'PASS', title: state.title, h1: state.h1 });
      await page.close();
    }
    await context.close();
  }
}

async function verifyReduced(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const descriptor of renewedPages) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await gotoChecked(page, descriptor.route);
    assert(await page.locator('html').getAttribute('data-lr-motion') === 'reduced', `${descriptor.route}: reduced motion not declared`);
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
    await gotoChecked(page, descriptor.route);
    const width = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) }));
    assert(width.scroll <= width.client + 1, `${descriptor.route}: static overflow ${width.scroll}/${width.client}`);
    if (descriptor.route !== '/laws/') {
      assert(await page.locator('.lr-nav-toggle').count() === 0, `${descriptor.route}: JS toggle exists in static mode`);
      assert(await page.locator('.lr-topbar .lr-nav').isVisible(), `${descriptor.route}: static nav hidden`);
      if (descriptor.expectedTabs) {
        const group = page.locator('[data-lr-tabs]:visible').first();
        assert(await group.count() === 1, `${descriptor.route}: static current tab group missing`);
        const panels = group.locator('[role="tabpanel"]');
        assert(await panels.count() === descriptor.expectedTabs, `${descriptor.route}: static panel count drift`);
        for (let index = 0; index < descriptor.expectedTabs; index += 1) {
          assert(await panels.nth(index).isVisible(), `${descriptor.route}: static panel ${index} hidden`);
        }
      }
      const audit = page.locator('details.lr-audit').first();
      if (await audit.count()) {
        await audit.locator('summary').click();
        assert(await audit.evaluate(node => node.open), `${descriptor.route}: native static audit failed`);
      }
    }
    results.push({ check: 'static-no-js', route: descriptor.route, status: 'PASS' });
    await page.close();
  }
  await context.close();
}

async function main() {
  assert(childPages.length === 24, `Child route count ${childPages.length}`);
  assert(batteryScope.public_surface_count === 27, 'Battery scope drift');
  assert(allPages.length === 33, `Integrated route count ${allPages.length}`);
  const browser = await chromium.launch({ headless: true });
  try {
    await verifyProfiles(browser);
    await verifyReduced(browser);
    await verifyStatic(browser);
  } finally {
    await browser.close();
  }
  const summary = {
    contract: 'LAWS_COMPLETE_RENEWAL_BATCH_BROWSER_VERIFICATION_v2',
    status: 'PASS',
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
  fs.writeFileSync(path.join(artifactDir, 'browser-result.json'), JSON.stringify({ contract: 'LAWS_COMPLETE_RENEWAL_BATCH_BROWSER_VERIFICATION_v2', status: 'FAIL', message: error.stack || String(error), results }, null, 2) + '\n');
  console.error(error.stack || error);
  process.exit(1);
});
