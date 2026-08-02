import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.LAWS_BASE_URL || 'http://127.0.0.1:4173';
const directions = ['flow', 'integrity', 'reality', 'structure', 'test'];
const profiles = [
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true, narrow: true },
  { name: 'tablet', width: 820, height: 1180, isMobile: true, hasTouch: true, narrow: true },
  { name: 'tablet-wide', width: 1024, height: 1366, isMobile: true, hasTouch: true, narrow: true },
  { name: 'desktop', width: 1440, height: 1000, isMobile: false, hasTouch: false, narrow: false }
];

const receipt = { contract: 'LAWS_FIRST_PERSISTENT_RAIL_ARCHITECTURE_BROWSER_VERIFICATION_v2', head: process.env.GITHUB_SHA || 'LOCAL', generated_at: new Date().toISOString(), route: '/laws/', checks: [], disposition: 'IN_PROGRESS' };
const record = (check, status, detail = '') => receipt.checks.push({ check, status, detail });

function verifySource() {
  const html = fs.readFileSync('laws/index.html', 'utf8');
  const css = fs.readFileSync('laws/index.experience.polish.css', 'utf8');
  const js = fs.readFileSync('laws/index.experience.js', 'utf8');
  const control = JSON.parse(fs.readFileSync('laws/control-plane/renewal/laws-first-persistent-rail-and-tablet-reflow-v2.json', 'utf8'));
  assert.ok(html.includes('data-laws-first-rail=""'), 'Persistent rail missing from HTML.');
  assert.equal((html.match(/data-laws-experience-indicator="(?:flow|integrity|reality|structure|test)"/g) || []).length, 5, 'Exactly five persistent indicators required.');
  assert.ok(html.includes('data-laws-first-rail-architecture="persistent-compass-zone-v2"'), 'Architecture marker missing.');
  assert.ok(html.includes('index.experience.polish.css?v=LAWS_FIRST_RAIL_ARCHITECTURE_20260802B'), 'Polish cache token missing.');
  assert.ok(html.includes('index.experience.js?v=LAWS_FIRST_RAIL_ARCHITECTURE_20260802B'), 'Experience cache token missing.');
  assert.ok(css.includes('LAWS_FIRST_PERSISTENT_COMPASS_RAIL_AND_TABLET_REFLOW_v2'), 'Rail/reflow CSS contract missing.');
  assert.ok(css.includes('@media (max-width: 1100px)'), 'Tablet reflow breakpoint missing.');
  assert.ok(js.includes('const indicatorNodes ='), 'Persistent indicator registry missing.');
  assert.ok(js.includes('node.dataset.lawsExperienceIndicator'), 'Persistent indicator correspondence missing.');
  assert.ok(js.includes('const COMPASS_PRELOAD_MARGIN = "1200px 0px";'), 'Compass preload margin missing.');
  assert.ok(js.includes('function installCompassPreload()'), 'Compass preload installer missing.');
  assert.ok(js.includes('globalThis.DGBLawsStagedLoader'), 'Existing staged-loader surface is not used.');
  assert.ok(js.includes('loader.loadOrbitSystems();'), 'Orbit preload request missing.');
  assert.ok(js.includes('loader.loadInteractionSystems();'), 'Interaction preload request missing.');
  assert.equal(control.preload_contract?.target, '.laws-compass-primary', 'Control record preload target mismatch.');
  assert.equal(control.preload_contract?.root_margin, '1200px 0px', 'Control record preload margin mismatch.');
  assert.equal(control.preload_contract?.loader_surface, 'DGBLawsStagedLoader', 'Control record loader surface mismatch.');
  assert.equal(control.temporary_workflows_allowed_in_final_scope, false, 'Control record permits temporary workflows in final scope.');
  assert.ok(!html.includes('<a class="laws-first-rail__item"'), 'Rail must not create navigation controls.');
  record('source_contract', 'PASS', 'Source-native five-light rail, cache tokens, tablet reflow, read-only correspondence, and Compass-zone preload are present.');
}

async function waitForRuntimeReady(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return Boolean(globalThis.DGB_LAWS_EXPERIENCE && globalThis.DGB_LAWS_CONTROLLER && globalThis.DGBLawsStagedLoader) &&
      root?.dataset.lawsControllerStatus === 'ready' &&
      root?.dataset.lawsInteractionsStatus === 'ready' &&
      document.documentElement.dataset.lawsExperiencePreload === 'compass-zone-proximity';
  });
}

async function ensureConstellation(page) {
  const state = await page.locator('[data-laws-root]').getAttribute('data-laws-controller-state');
  if (state === 'CONSTELLATION') return;
  const returned = await page.evaluate(() => globalThis.DGB_LAWS_CONTROLLER?.requestReturnToConstellation({ scrollToScene: false }));
  assert.equal(returned, true, 'Return to constellation rejected.');
  await page.waitForFunction(() => document.querySelector('[data-laws-root]')?.dataset.lawsControllerState === 'CONSTELLATION');
}

async function select(page, direction) {
  await ensureConstellation(page);
  await page.waitForFunction(() => document.querySelector('[data-laws-root]')?.dataset.lawsControllerState === 'CONSTELLATION');
  await page.waitForTimeout(120);
  await page.evaluate((next) => {
    const control = document.querySelector('[data-laws-category][data-direction="' + next + '"]');
    if (!control) throw new Error('Missing authority control: ' + next);
    control.click();
  }, direction);
  await page.waitForFunction((next) => document.documentElement.dataset.lawsExperienceDirection === next && document.querySelector('[data-laws-root]')?.dataset.lawsControllerState === 'CLUSTER_OPEN', direction);
  await page.waitForFunction((next) => {
    const items = Array.from(document.querySelectorAll('[data-laws-first-rail] [data-laws-experience-indicator]'));
    return items.length === 5 && items.filter((item) => item.dataset.lawsExperienceActive === 'true').length === 1 && items.find((item) => item.dataset.lawsExperienceActive === 'true')?.dataset.lawsExperienceIndicator === next;
  }, direction);
  await page.waitForTimeout(260);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.laws-experience-hero');
    const primary = document.querySelector('.laws-compass-primary');
    const rail = document.querySelector('[data-laws-first-rail]');
    const orbit = document.querySelector('.laws-orbit');
    const panel = document.querySelector('.laws-controller-panel');
    const root = document.documentElement;
    const body = document.body;
    const rect = (node) => node ? ({ top: node.getBoundingClientRect().top, right: node.getBoundingClientRect().right, bottom: node.getBoundingClientRect().bottom, left: node.getBoundingClientRect().left, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }) : null;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      overflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
      heroDisplay: hero ? getComputedStyle(hero).display : '',
      primaryPosition: primary ? getComputedStyle(primary).position : '',
      hero: rect(hero), primary: rect(primary), rail: rect(rail), orbit: rect(orbit), panel: rect(panel),
      items: Array.from(document.querySelectorAll('[data-laws-first-rail] [data-laws-experience-indicator]')).map((item) => {
        const light = item.querySelector('.laws-first-rail__light');
        const lightStyle = light ? getComputedStyle(light) : null;
        const itemRect = item.getBoundingClientRect();
        return { direction: item.dataset.lawsExperienceIndicator || '', active: item.dataset.lawsExperienceActive === 'true', ariaCurrent: item.getAttribute('aria-current'), display: getComputedStyle(item).display, opacity: getComputedStyle(item).opacity, backgroundColor: lightStyle?.backgroundColor || '', boxShadow: lightStyle?.boxShadow || '', left: itemRect.left, right: itemRect.right };
      })
    };
  });
}

function assertSnapshot(data, direction, profile) {
  assert.ok(data.overflow <= 2, profile.name + ': horizontal overflow ' + data.overflow + 'px');
  assert.equal(data.items.length, 5, profile.name + ': five rail items required');
  assert.ok(data.rail && data.primary && data.hero && data.orbit && data.panel, profile.name + ': required hero surfaces missing');
  assert.ok(data.rail.left >= -1 && data.rail.right <= data.viewport.width + 2, profile.name + ': rail leaves viewport');
  assert.ok(data.rail.top >= data.primary.top - 2 && data.rail.bottom <= data.primary.bottom + 2, profile.name + ': rail leaves Compass zone');
  assert.equal(data.items.filter((item) => item.active).length, 1, profile.name + ': exactly one active rail item required');
  const active = data.items.find((item) => item.active);
  assert.equal(active.direction, direction, profile.name + ': rail did not follow Compass');
  assert.equal(active.ariaCurrent, 'true', profile.name + ': active rail ARIA state missing');
  assert.equal(active.backgroundColor, 'rgb(121, 234, 255)', profile.name + ': active light is not cyan');
  assert.notEqual(active.boxShadow, 'none', profile.name + ': active light has no glow');
  for (const item of data.items) {
    assert.ok(item.left >= -1 && item.right <= data.viewport.width + 2, profile.name + '/' + item.direction + ': item outside viewport');
    if (!item.active) assert.equal(item.ariaCurrent, 'false', profile.name + '/' + item.direction + ': inactive ARIA state incorrect');
  }
  if (profile.narrow) {
    assert.equal(data.heroDisplay, 'flex', profile.name + ': hero did not reflow to one column');
    assert.equal(data.primaryPosition, 'relative', profile.name + ': Compass remains sticky in narrow layout');
    assert.ok(data.rail.bottom <= data.orbit.top + 4, profile.name + ': rail is not placed before the Compass in narrow layout');
  } else {
    assert.ok(data.rail.top >= data.orbit.top, profile.name + ': desktop rail is not paired with the Compass scene');
  }
}

async function verifyProfile(browser, profile) {
  const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, isMobile: profile.isMobile, hasTouch: profile.hasTouch });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push('pageerror: ' + error.message));
  page.on('console', (message) => { if (message.type() === 'error' && !message.text().includes('404')) errors.push('console: ' + message.text()); });
  await page.goto(baseUrl + '/laws/', { waitUntil: 'networkidle' });
  await waitForRuntimeReady(page);
  for (const direction of directions) {
    await select(page, direction);
    assertSnapshot(await snapshot(page), direction, profile);
    await ensureConstellation(page);
  }
  assert.deepEqual(errors, [], profile.name + ': browser errors: ' + errors.join(' | '));
  await page.screenshot({ path: 'artifacts/laws-first-rail-' + profile.name + '.png', fullPage: true });
  await context.close();
  record('interactive_' + profile.name, 'PASS', 'Persistent rail remained in the Compass zone, followed all five selections, and preserved the declared reflow.');
}

async function verifyStatic(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseUrl + '/laws/', { waitUntil: 'load' });
  const data = await snapshot(page);
  assert.equal(data.items.length, 5, 'Static rail lost items.');
  assert.equal(data.items.filter((item) => item.active).length, 0, 'Static rail invented active state.');
  assert.ok(data.rail && data.rail.left >= -1 && data.rail.right <= data.viewport.width + 2, 'Static rail outside viewport.');
  assert.equal(data.heroDisplay, 'flex', 'Static phone hero did not reflow.');
  assert.ok(data.rail.bottom <= data.orbit.top + 4, 'Static phone rail is not before Compass.');
  await context.close();
  record('static_no_javascript', 'PASS', 'Five neutral source-native indicators remain visible without runtime state.');
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseUrl + '/laws/', { waitUntil: 'networkidle' });
  await waitForRuntimeReady(page);
  await select(page, 'structure');
  const transition = await page.locator('[data-laws-first-rail] [data-laws-experience-active="true"] .laws-first-rail__light').evaluate((node) => getComputedStyle(node).transitionDuration);
  assert.ok(transition === '0s' || transition === '0.001ms', 'Reduced-motion transition remains active: ' + transition);
  await context.close();
  record('reduced_motion', 'PASS', 'Persistent light correspondence remains correct with transitions removed.');
}

fs.mkdirSync('artifacts', { recursive: true });
verifySource();
const browser = await chromium.launch({ headless: true });
try {
  for (const profile of profiles) await verifyProfile(browser, profile);
  await verifyReducedMotion(browser);
  await verifyStatic(browser);
  receipt.disposition = 'PASS';
} finally {
  await browser.close();
}
fs.writeFileSync(path.join('artifacts', 'laws-first-rail-architecture-verification.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
