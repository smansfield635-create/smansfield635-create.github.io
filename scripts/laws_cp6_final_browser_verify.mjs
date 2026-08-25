import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseURL = process.env.LAWS_CP6_FINAL_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = path.join(root, 'artifacts/laws-cp6-final-synchronization');
fs.mkdirSync(artifactDir, { recursive: true });

const executionCommit = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || 'LOCAL';
const githubEventSha = process.env.GITHUB_SHA || null;
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
const roomCarouselRoutes = [...childPages.filter(page => !page.methodsShowroom).map(page => page.route), '/laws/research/', '/laws/categories/reality/battery-heldout-study/'];

const profiles = [
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
];
const screenshots = new Set([
  '/laws/',
  '/laws/categories/flow/cycles/',
  '/laws/categories/integrity/accountability/',
  '/laws/categories/integrity/coherence/',
  '/laws/research/',
  '/laws/categories/reality/battery-heldout-study/',
  '/laws/categories/reality/evidence.html',
  '/laws/categories/structure/constraints.html',
  '/laws/test/reverse-audit/',
  '/laws/research/methods-and-models/',
  '/frontier/energy/battery-coherence-study/',
]);
const matrixChecks = new Set(['profile', 'reduced-motion', 'static-no-js', 'room-carousel-runtime', 'room-carousel-static-no-js']);
const results = [];
const failures = [];
const pointerDiagnostics = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function safeName(value) {
  return value.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';
}
function messageOf(error) {
  return error?.stack || String(error);
}
function recordFailure(metadata, error) {
  const failure = { ...metadata, status: 'FAIL', message: messageOf(error) };
  results.push(failure);
  failures.push(failure);
  return failure;
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
async function measuredPointerClick(page, locator, label, metadata = {}) {
  assert(await locator.count() === 1, `${label}: pointer target count ${await locator.count()}`);
  await locator.evaluate(node => node.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }));
  await page.waitForTimeout(20);
  const geometry = await locator.evaluate(node => {
    const describe = element => {
      if (!element) return null;
      return {
        tag: element.tagName?.toLowerCase() || null,
        id: element.id || null,
        className: typeof element.className === 'string' ? element.className : null,
        role: element.getAttribute?.('role') || null,
        text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
        active: element.getAttribute?.('data-active') || null,
      };
    };
    const rect = node.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const top = document.elementFromPoint(x, y);
    const stack = document.elementsFromPoint(x, y).slice(0, 8);
    return {
      x,
      y,
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      viewport: { width: innerWidth, height: innerHeight, scrollX, scrollY },
      visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth,
      target: describe(node),
      hit: describe(top),
      hitTarget: top === node || Boolean(top && node.contains(top)),
      stack: stack.map(describe),
    };
  });
  const diagnostic = { label, ...metadata, ...geometry };
  pointerDiagnostics.push(diagnostic);
  assert(geometry.visible, `${label}: pointer target not visibly measurable ${JSON.stringify(diagnostic)}`);
  assert(geometry.hitTarget, `${label}: POINTER_OCCLUDED ${JSON.stringify(diagnostic)}`);
  await page.mouse.click(geometry.x, geometry.y);
  await page.waitForTimeout(20);
  return diagnostic;
}
async function executePageCase(context, metadata, body) {
  let page = null;
  try {
    page = await context.newPage();
    const payload = await body(page) || {};
    results.push({ ...metadata, status: 'PASS', ...payload });
  } catch (error) {
    const failure = recordFailure(metadata, error);
    if (page) {
      try {
        const failurePath = path.join(artifactDir, `failure-${safeName(metadata.check)}-${safeName(metadata.profile || 'default')}-${safeName(metadata.route || 'suite')}.png`);
        await page.screenshot({ path: failurePath, fullPage: false });
        failure.screenshot = path.relative(root, failurePath);
      } catch (screenshotError) {
        failure.screenshotError = messageOf(screenshotError);
      }
    }
  } finally {
    if (page) await page.close().catch(() => {});
  }
}
async function contextOrFailure(browser, options, metadata) {
  try {
    return await browser.newContext(options);
  } catch (error) {
    recordFailure({ check: 'suite-bootstrap', ...metadata }, error);
    return null;
  }
}
async function activateReadingRoom(page, group, route) {
  const target = await group.evaluate(node => {
    const root = node.closest('[data-laws-room-carousel]');
    const card = node.closest('[data-lrc-card]');
    if (!root || !card) return null;
    const roots = Array.from(document.querySelectorAll('[data-laws-room-carousel]'));
    const cards = Array.from(root.querySelectorAll('[data-lrc-card]')).filter(candidate => candidate.closest('[data-laws-room-carousel]') === root);
    return { rootIndex: roots.indexOf(root), targetIndex: cards.indexOf(card) };
  });
  if (!target) return;
  assert(target.rootIndex >= 0 && target.targetIndex >= 0, `${route}: reading room carousel target unresolved`);
  const roomRoot = page.locator('[data-laws-room-carousel]').nth(target.rootIndex);
  const roomViewport = roomRoot.locator('[data-lrc-viewport]').first();
  assert(await roomRoot.getAttribute('data-lrc-mounted') === 'true', `${route}: room carousel not mounted before reading check`);
  assert(await roomViewport.count() === 1, `${route}: room carousel viewport missing before reading check`);
  if (Number(await roomRoot.getAttribute('data-lrc-index')) !== target.targetIndex) {
    await roomViewport.focus();
    await page.keyboard.press('Home');
    await page.waitForFunction(
      rootIndex => document.querySelectorAll('[data-laws-room-carousel]')[rootIndex]?.dataset.lrcIndex === '0',
      target.rootIndex,
    );
    for (let step = 0; step < target.targetIndex; step += 1) {
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(
        ({ rootIndex, expected }) => document.querySelectorAll('[data-laws-room-carousel]')[rootIndex]?.dataset.lrcIndex === expected,
        { rootIndex: target.rootIndex, expected: String(step + 1) },
      );
    }
  }
  assert(await group.evaluate(node => node.closest('[data-lrc-card]')?.dataset.active === 'true'), `${route}: reading room carousel card not active`);
  const settleMs = await group.evaluate(node => {
    const card = node.closest('[data-lrc-card]');
    if (!card) return 0;
    const style = getComputedStyle(card);
    const toMilliseconds = value => {
      const text = String(value || '').trim();
      if (text.endsWith('ms')) return Number.parseFloat(text) || 0;
      if (text.endsWith('s')) return (Number.parseFloat(text) || 0) * 1000;
      return 0;
    };
    const durations = style.transitionDuration.split(',').map(toMilliseconds);
    const delays = style.transitionDelay.split(',').map(toMilliseconds);
    const count = Math.max(durations.length, delays.length);
    let maximum = 0;
    for (let index = 0; index < count; index += 1) {
      const duration = durations[index % durations.length] || 0;
      const delay = delays[index % delays.length] || 0;
      maximum = Math.max(maximum, duration + delay);
    }
    return Math.ceil(maximum);
  });
  if (settleMs > 0) await page.waitForTimeout(Math.min(settleMs + 60, 1200));
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
    await measuredPointerClick(page, toggle, `${route}: desktop nav collapse`, { route, profile });
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: desktop collapse state`);
    assert(!(await nav.isVisible()), `${route}: desktop collapse visibility`);
    await measuredPointerClick(page, toggle, `${route}: desktop nav reopen`, { route, profile });
  } else {
    assert(await toggle.getAttribute('aria-expanded') === 'false', `${route}: compact nav not collapsed`);
    assert(!(await nav.isVisible()), `${route}: compact nav visible`);
    await measuredPointerClick(page, toggle, `${route}: compact nav open`, { route, profile });
    assert(await toggle.getAttribute('aria-expanded') === 'true' && await nav.isVisible(), `${route}: compact open failed`);
    await page.keyboard.press('Escape');
    assert(await toggle.getAttribute('aria-expanded') === 'false' && !(await nav.isVisible()), `${route}: Escape close failed`);
  }
}
async function readingCheck(page, descriptor, profile) {
  if (!descriptor.expectedReadings) return;
  const groups = page.locator('[data-lr-tabs]');
  assert(await groups.count() === 1, `${descriptor.route}: reading group count ${await groups.count()}`);
  const group = groups.first();
  await activateReadingRoom(page, group, descriptor.route);
  const buttons = group.locator('.lr-tab');
  const panels = group.locator('.lr-panel');
  const expanded = group.locator('.lr-tab[aria-expanded="true"]');
  assert(await buttons.count() === descriptor.expectedReadings, `${descriptor.route}: buttons ${await buttons.count()}/${descriptor.expectedReadings}`);
  assert(await panels.count() === descriptor.expectedReadings, `${descriptor.route}: panels ${await panels.count()}/${descriptor.expectedReadings}`);
  assert(await expanded.count() === 0, `${descriptor.route}: reading open on entry`);
  for (let index = 0; index < descriptor.expectedReadings; index += 1) {
    assert(!(await panels.nth(index).isVisible()), `${descriptor.route}: panel ${index} visible on entry`);
  }

  await measuredPointerClick(page, buttons.nth(0), `${descriptor.route}: first reading open`, { route: descriptor.route, profile, readingIndex: 0 });
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'true', `${descriptor.route}: first reading did not open`);
  assert(await panels.nth(0).isVisible(), `${descriptor.route}: first panel hidden`);
  await measuredPointerClick(page, buttons.nth(0), `${descriptor.route}: first reading collapse`, { route: descriptor.route, profile, readingIndex: 0 });
  assert(await buttons.nth(0).getAttribute('aria-expanded') === 'false', `${descriptor.route}: open reading did not collapse`);
  assert(!(await panels.nth(0).isVisible()), `${descriptor.route}: collapsed panel visible`);

  const second = descriptor.expectedReadings > 1 ? 1 : 0;
  await buttons.nth(second).focus();
  await page.keyboard.press('Enter');
  assert(await buttons.nth(second).getAttribute('aria-expanded') === 'true', `${descriptor.route}: keyboard activation failed`);
  assert(await panels.nth(second).isVisible(), `${descriptor.route}: keyboard panel hidden`);

  const next = (second + 1) % descriptor.expectedReadings;
  await measuredPointerClick(page, buttons.nth(next), `${descriptor.route}: next reading open`, { route: descriptor.route, profile, readingIndex: next });
  assert(await buttons.nth(next).getAttribute('aria-expanded') === 'true', `${descriptor.route}: next reading did not open`);
  assert(await expanded.count() === 1, `${descriptor.route}: exclusive reading state failed`);
  assert(!(await panels.nth(second).isVisible()), `${descriptor.route}: previous panel remained visible`);
}
async function auditCheck(page, route, profile) {
  const audit = page.locator('details.lr-audit').first();
  if (!(await audit.count())) return;
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit open on enhanced entry`);
  const summary = audit.locator(':scope > summary');
  await measuredPointerClick(page, summary, `${route}: audit open`, { route, profile });
  assert(await audit.evaluate(node => node.open), `${route}: audit open failed`);
  if (profile === 'phone') {
    const width = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }));
    assert(width.scroll <= width.client + 1, `${route}: audit overflow`);
  }
  await measuredPointerClick(page, summary, `${route}: audit close`, { route, profile });
  assert(!(await audit.evaluate(node => node.open)), `${route}: audit close failed`);
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
async function landingCheck(page, profile) {
  const rolodex = page.locator('[data-laws-root-rolodex-section]');
  await rolodex.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForFunction(() => document.querySelector('[data-laws-root-rolodex-section]')?.dataset.lawsDestinationStage === 'active');
  assert(await page.locator('html').getAttribute('data-laws-root-rolodex') === 'active', '/laws/: root rolodex not active');
  assert(await rolodex.count() === 1, '/laws/: root rolodex missing');
  const familyTabs = rolodex.locator('.laws-destination-stage__tab');
  assert(await familyTabs.count() === 3, `/laws/: complete family tab rail ${await familyTabs.count()}/3`);
  const familyOrdinals = await familyTabs.locator('.laws-destination-stage__tab-ordinal').allTextContents();
  assert(familyOrdinals.join(',') === '01,02,03', `/laws/: family tab numbering ${familyOrdinals.join(',')}`);
  const fieldTabTopology = await rolodex.locator('.laws-rolodex-field[data-rolodex-id]').evaluateAll(fields => fields.map(field => ({
    cards: field.querySelectorAll('.laws-rolodex-card').length,
    tabs: field.querySelectorAll('.laws-rolodex-record-tab').length,
    declared: Number(field.dataset.carouselTabCount || 0)
  })));
  assert(fieldTabTopology.every(item => item.cards > 0 && item.tabs === item.cards && item.declared === item.cards), `/laws/: record tab topology ${JSON.stringify(fieldTabTopology)}`);
  const applied = rolodex.locator('.laws-rolodex-card[data-destination-id="applied-investigations"]');
  assert(await applied.count() === 1, '/laws/: applied investigations destination missing');
  assert((await applied.textContent() || '').toLowerCase().includes('battery health'), '/laws/: battery-health context missing from applied investigations destination');
  const appliedField = rolodex.locator('.laws-rolodex-field[data-rolodex-id="research"]');
  assert(await appliedField.count() === 1, '/laws/: research rolodex field missing');
  assert(await appliedField.locator('.laws-rolodex-card[data-destination-id="applied-investigations"]').count() === 1, '/laws/: applied investigations not in research rolodex field');
  if (await appliedField.getAttribute('aria-hidden') === 'true') {
    const appliedFieldId = await appliedField.getAttribute('id');
    assert(appliedFieldId, '/laws/: research rolodex field id missing');
    const researchTab = rolodex.locator(`.laws-destination-stage__tab[aria-controls="${appliedFieldId}"]`);
    assert(await researchTab.count() === 1, '/laws/: research destination-family tab missing');
    const researchTabInViewport = await researchTab.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
      if (visible) return true;
      const targetTop = Math.max(0, window.scrollY + rect.top - Math.max(16, (innerHeight - rect.height) / 2));
      window.scrollTo({ top: targetTop, behavior: 'instant' });
      const next = node.getBoundingClientRect();
      return next.width > 0 && next.height > 0 && next.bottom > 0 && next.right > 0 && next.top < innerHeight && next.left < innerWidth;
    });
    assert(researchTabInViewport, '/laws/: research destination-family tab could not be brought into viewport');
    await page.waitForTimeout(20);
    await measuredPointerClick(page, researchTab, '/laws/: activate research destination family', { route: '/laws/', profile });
    await page.waitForFunction(
      () => document.querySelector('.laws-rolodex-field[data-rolodex-id="research"]')?.getAttribute('aria-hidden') === 'false',
    );
  }
  const appliedCardIndex = await applied.evaluate(node => Array.from(node.parentElement.children).indexOf(node));
  const appliedRecordTab = appliedField.locator(`.laws-rolodex-record-tab[data-rolodex-record-index="${appliedCardIndex}"]`);
  assert(await appliedRecordTab.count() === 1, '/laws/: applied investigations direct record tab missing');
  await measuredPointerClick(page, appliedRecordTab, '/laws/: direct-select applied investigations', { route: '/laws/', profile });
  await page.waitForFunction(
    () => document.querySelector('.laws-rolodex-card[data-destination-id="applied-investigations"]')?.getAttribute('data-active') === 'true',
  );
  assert(await applied.getAttribute('data-active') === 'true', '/laws/: applied investigations card did not become active');
  await measuredPointerClick(page, applied.locator('button.laws-rolodex-enter'), '/laws/: enter applied investigations', { route: '/laws/', profile });
  const appliedRoute = page.locator('.laws-exhibit-route');
  await appliedRoute.waitFor({ state: 'visible', timeout: 5000 });
  assert(await appliedRoute.getAttribute('href') === '/laws/research/applied-investigations/', '/laws/: applied investigations route drift');
  await page.keyboard.press('Escape');
  assert(await page.locator('.laws-first-rail').count() === 1, '/laws/: persistent FIRST rail missing');
  assert(await page.locator('[data-laws-experience-indicator]').count() === 5, '/laws/: FIRST indicator count');
}

async function verifyProfiles(browser) {
  for (const profile of profiles) {
    const context = await contextOrFailure(browser, { viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.hasTouch, deviceScaleFactor: 1 }, { suite: 'profiles', profile: profile.name });
    if (!context) continue;
    try {
      for (const descriptor of allPages) {
        await executePageCase(context, { check: 'profile', profile: profile.name, route: descriptor.route }, async page => {
          const errors = collectErrors(page);
          await gotoChecked(page, descriptor.route);
          const state = await health(page, descriptor.route, errors);
          if (descriptor.route === '/laws/') {
            await landingCheck(page, profile.name);
          } else if (descriptor.methodsShowroom) {
            await methodsShowroomCheck(page, descriptor.route);
          } else {
            await navCheck(page, descriptor.route, profile.name);
            await readingCheck(page, descriptor, profile.name);
            await auditCheck(page, descriptor.route, profile.name);
            if (!descriptor.route.includes('battery-heldout-study')) {
              assert(await page.locator('.lr-boundary').count() >= 1, `${descriptor.route}: boundary missing`);
            }
          }
          if (screenshots.has(descriptor.route) && ['phone', 'desktop'].includes(profile.name)) {
            await page.screenshot({ path: path.join(artifactDir, `${profile.name}-${safeName(descriptor.route)}.png`), fullPage: false });
          }
          return { title: state.title, h1: state.h1, methodsShowroom: descriptor.methodsShowroom };
        });
      }
    } finally {
      await context.close().catch(() => {});
    }
  }
}
async function verifyReduced(browser) {
  const context = await contextOrFailure(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }, { suite: 'reduced-motion' });
  if (!context) return;
  try {
    for (const descriptor of renewedPages) {
      await executePageCase(context, { check: 'reduced-motion', route: descriptor.route }, async page => {
        const errors = collectErrors(page);
        await gotoChecked(page, descriptor.route);
        if (descriptor.methodsShowroom) {
          assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), `${descriptor.route}: reduced motion media not active`);
          await page.locator('[data-mm-carousel] .mm-card[data-active="true"]').waitFor({ state: 'visible', timeout: 15000 });
        } else {
          assert(await page.locator('html').getAttribute('data-lr-motion') === 'reduced', `${descriptor.route}: reduced motion not declared`);
        }
        await health(page, descriptor.route, errors);
      });
    }
  } finally {
    await context.close().catch(() => {});
  }
}
async function verifyStatic(browser) {
  const context = await contextOrFailure(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false }, { suite: 'static-no-js' });
  if (!context) return;
  try {
    for (const descriptor of allPages) {
      await executePageCase(context, { check: 'static-no-js', route: descriptor.route }, async page => {
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
      });
    }
  } finally {
    await context.close().catch(() => {});
  }
}
async function verifyRoomCarousel(browser) {
  assert(roomCarouselRoutes.length === 25, `Room carousel route count ${roomCarouselRoutes.length}`);
  assert(new Set(roomCarouselRoutes).size === 25, 'Duplicate room carousel route');

  for (const profile of profiles) {
    const context = await contextOrFailure(browser, { viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.hasTouch, reducedMotion: 'reduce', deviceScaleFactor: 1 }, { suite: 'room-carousel-runtime', profile: profile.name });
    if (!context) continue;
    try {
      for (const route of roomCarouselRoutes) {
        await executePageCase(context, { check: 'room-carousel-runtime', profile: profile.name, route }, async page => {
          const errors = collectErrors(page);
          await gotoChecked(page, route);
          await health(page, route, errors);
          const carouselRoot = page.locator('[data-laws-room-carousel]').first();
          assert(await carouselRoot.count() === 1, `${route}: carousel root missing`);
          await page.waitForFunction(() => document.querySelector('[data-laws-room-carousel]')?.dataset.lrcMounted === 'true');
          assert(await carouselRoot.getAttribute('data-lrc-mounted') === 'true', `${route}: carousel runtime not mounted`);

          const cards = carouselRoot.locator('[data-lrc-card]');
          const tabs = carouselRoot.locator(':scope > [data-lrc-tabs] [data-lrc-tab]');
          const cardCount = await cards.count();
          const tabCount = await tabs.count();
          assert(cardCount >= 1, `${route}: no orbit states`);
          assert(tabCount === cardCount, `${route}: complete top tab rail ${tabCount}/${cardCount}`);
          assert(await carouselRoot.getAttribute('data-lrc-tab-count') === String(cardCount), `${route}: declared tab count drift`);
          const ordinals = await tabs.locator('[data-lrc-tab-number]').allTextContents();
          assert(ordinals.every((value, index) => value.trim() === String(index + 1).padStart(2, '0')), `${route}: numbered tab sequence ${JSON.stringify(ordinals)}`);

          const controls = carouselRoot.locator('[data-lrc-controls],[data-lrc-prev],[data-lrc-next]');
          assert(await controls.count() === 0, `${route}: visible directional control retained`);
          const viewport = carouselRoot.locator('[data-lrc-viewport]').first();
          const stageHeightBefore = await viewport.evaluate(node => node.getBoundingClientRect().height);
          const directIndex = cardCount > 2 ? cardCount - 1 : Math.max(0, cardCount - 1);
          await tabs.nth(directIndex).click();
          await page.waitForFunction(index => document.querySelector('[data-laws-room-carousel]')?.dataset.lrcIndex === String(index), directIndex);
          assert(await tabs.nth(directIndex).getAttribute('aria-selected') === 'true', `${route}: direct tab selection state missing`);
          const stageHeightAfterDirect = await viewport.evaluate(node => node.getBoundingClientRect().height);
          assert(Math.abs(stageHeightAfterDirect - stageHeightBefore) <= 1, `${route}: orbit stage height changed after direct selection ${stageHeightBefore}/${stageHeightAfterDirect}`);

          await viewport.focus();
          const keyboardBefore = Number(await carouselRoot.getAttribute('data-lrc-index'));
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(30);
          const keyboardAfter = Number(await carouselRoot.getAttribute('data-lrc-index'));
          const expectedKeyboard = (keyboardBefore + 1) % cardCount;
          assert(keyboardAfter === expectedKeyboard, `${route}: carousel keyboard one-step ${keyboardAfter}/${expectedKeyboard}`);
          const stageHeightAfterKeyboard = await viewport.evaluate(node => node.getBoundingClientRect().height);
          assert(Math.abs(stageHeightAfterKeyboard - stageHeightBefore) <= 1, `${route}: orbit stage geometry unstable ${stageHeightBefore}/${stageHeightAfterKeyboard}`);
          assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), `${route}: room reduced motion media not active`);

          let activeCard = carouselRoot.locator('[data-lrc-card][data-active="true"]').first();
          assert(await activeCard.count() === 1, `${route}: active room card count`);
          assert(await activeCard.locator(':scope > [data-lrc-summary]').isVisible(), `${route}: orbit summary missing`);
          assert(await activeCard.locator(':scope > [data-lrc-source-child]').evaluateAll(nodes => nodes.length > 0 && nodes.every(node => node.hidden)), `${route}: informational source leaked into orbit`);

          const layout = await activeCard.evaluate(node => {
            const root = node.closest('[data-laws-room-carousel]');
            const viewportNode = root?.querySelector('[data-lrc-viewport]');
            const tabsNode = root?.querySelector(':scope > [data-lrc-tabs]');
            const summary = node.querySelector(':scope > [data-lrc-summary]');
            const audit = root?.querySelector(':scope > details.lr-audit');
            const lower = audit || document.querySelector('.lr-footer, footer');
            const rect = node.getBoundingClientRect();
            const viewportRect = viewportNode?.getBoundingClientRect();
            const tabsRect = tabsNode?.getBoundingClientRect();
            const summaryRect = summary?.getBoundingClientRect();
            const lowerRect = lower?.getBoundingClientRect();
            const visibleSummaryNodes = summary ? Array.from(summary.querySelectorAll('*')).filter(child => {
              const style = getComputedStyle(child);
              const childRect = child.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && childRect.width > 0 && childRect.height > 0;
            }) : [];
            const summaryContained = Boolean(summaryRect) && visibleSummaryNodes.every(child => {
              const childRect = child.getBoundingClientRect();
              return childRect.left >= rect.left - 2 && childRect.right <= rect.right + 2 && childRect.top >= rect.top - 2 && childRect.bottom <= rect.bottom + 2;
            });
            return {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              viewportWidth: innerWidth,
              viewportHeight: innerHeight,
              stageHeight: viewportRect?.height ?? null,
              stageTop: viewportRect?.top ?? null,
              stageBottom: viewportRect?.bottom ?? null,
              tabsBottom: tabsRect?.bottom ?? null,
              lowerTop: lowerRect?.top ?? null,
              lowerExists: Boolean(lower),
              summaryContained,
              documentContained: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
            };
          });
          assert(layout.left >= -1 && layout.right <= layout.viewportWidth + 1, `${route}: profile containment ${profile.name} ${layout.left}/${layout.right}/${layout.viewportWidth}`);
          assert(layout.stageTop !== null && layout.top >= layout.stageTop - 2 && layout.bottom <= layout.stageBottom + 2, `${route}: active orbit card escaped stable stage`);
          assert(layout.tabsBottom !== null && layout.stageTop !== null && layout.tabsBottom <= layout.stageTop + 2, `${route}: top tab rail overlaps informational stage`);
          assert(layout.summaryContained, `${route}: orbit summary descendant clipping`);
          assert(layout.documentContained, `${route}: descendant horizontal document overflow`);
          assert(layout.lowerExists, `${route}: ordinary lower page content missing`);
          assert(layout.lowerTop === null || layout.stageBottom === null || layout.lowerTop >= layout.stageBottom - 2, `${route}: lower page content overlaps carousel ${layout.lowerTop}/${layout.stageBottom}`);

          const gesturePoint = await activeCard.evaluate(node => {
            const rect = node.getBoundingClientRect();
            const candidates = [
              [rect.left + 14, rect.top + 14],
              [rect.right - 14, rect.top + 14],
              [rect.left + 14, Math.min(rect.bottom - 14, innerHeight - 24)],
              [rect.right - 14, Math.min(rect.bottom - 14, innerHeight - 24)]
            ];
            for (const [x, y] of candidates) {
              if (x < 1 || y < 1 || x >= innerWidth - 1 || y >= innerHeight - 1) continue;
              const hit = document.elementFromPoint(x, y);
              if (hit && node.contains(hit) && !hit.closest('a,button,input,textarea,select,summary')) return { x, y, viewportHeight: innerHeight };
            }
            return null;
          });
          assert(gesturePoint, `${route}: carousel gesture surface unavailable`);
          const gestureBefore = await carouselRoot.getAttribute('data-lrc-index');
          const verticalDy = gesturePoint.y < gesturePoint.viewportHeight - 72 ? 52 : -52;
          await page.mouse.move(gesturePoint.x, gesturePoint.y);
          await page.mouse.down();
          await page.mouse.move(gesturePoint.x + 2, gesturePoint.y + verticalDy, { steps: 4 });
          await page.mouse.up();
          await page.waitForTimeout(20);
          assert(await carouselRoot.getAttribute('data-lrc-index') === gestureBefore, `${route}: vertical gesture changed room`);

          const pointerDx = gesturePoint.x > 72 ? -56 : 56;
          await page.mouse.move(gesturePoint.x, gesturePoint.y);
          await page.mouse.down();
          await page.mouse.move(gesturePoint.x + pointerDx, gesturePoint.y + 2, { steps: 4 });
          await page.mouse.up();
          await page.waitForTimeout(30);
          const pointerAfter = await carouselRoot.getAttribute('data-lrc-index');
          const expectedPointer = String((Number(gestureBefore) + (pointerDx < 0 ? 1 : -1) + cardCount) % cardCount);
          assert(pointerAfter === expectedPointer, `${route}: pointer one-step ${pointerAfter}/${expectedPointer}`);
          assert(await carouselRoot.getAttribute('data-lrc-gesture-state') === 'idle', `${route}: canonical settled landing missing`);

          activeCard = carouselRoot.locator('[data-lrc-card][data-active="true"]').first();
          const inspect = activeCard.locator(':scope > [data-lrc-summary] [data-lrc-inspect]');
          assert(await inspect.count() === 1, `${route}: inspect action missing`);
          await inspect.click();
          await page.waitForFunction(() => document.querySelector('[data-laws-room-carousel]')?.dataset.lrcInspecting === 'true');
          const inspection = await activeCard.evaluate(node => {
            const rect = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            const source = Array.from(node.querySelectorAll(':scope > [data-lrc-source-child]'));
            const visibleSource = source.filter(child => !child.hidden);
            const horizontallyContained = visibleSource.every(child => {
              const childRect = child.getBoundingClientRect();
              return childRect.left >= rect.left - 2 && childRect.right <= rect.right + 2;
            });
            return {
              overflowY: style.overflowY,
              width: rect.width,
              height: rect.height,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              viewportWidth: innerWidth,
              viewportHeight: innerHeight,
              scrollHeight: node.scrollHeight,
              clientHeight: node.clientHeight,
              sourceCount: source.length,
              visibleSourceCount: visibleSource.length,
              summaryHidden: node.querySelector(':scope > [data-lrc-summary]')?.hidden === true,
              returnVisible: !node.querySelector(':scope > [data-lrc-return]')?.hidden,
              horizontallyContained
            };
          });
          assert(['auto', 'scroll'].includes(inspection.overflowY), `${route}: bounded inspection scroll missing ${inspection.overflowY}`);
          assert(inspection.left >= -1 && inspection.right <= inspection.viewportWidth + 1 && inspection.top >= -1 && inspection.bottom <= inspection.viewportHeight + 1, `${route}: inspection escaped viewport ${JSON.stringify(inspection)}`);
          assert(inspection.height <= inspection.viewportHeight + 1, `${route}: inspection height unbounded`);
          assert(inspection.sourceCount > 0 && inspection.visibleSourceCount === inspection.sourceCount, `${route}: complete informational plane not visible`);
          assert(inspection.summaryHidden && inspection.returnVisible, `${route}: orbit and inspection planes not separated`);
          assert(inspection.horizontallyContained, `${route}: inspection descendant horizontal clipping`);
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('[data-laws-room-carousel]')?.dataset.lrcInspecting);
          assert(await activeCard.locator(':scope > [data-lrc-source-child]').evaluateAll(nodes => nodes.every(node => node.hidden)), `${route}: informational plane remained open`);

          return {
            cardCount,
            tabCount,
            completeNumberedTopRail: true,
            directNonAdjacentSelection: cardCount > 2,
            stableOrbitStage: true,
            orbitInspectionSeparated: true,
            boundedInspectionScroll: true,
            lowerPageContentBelowStage: true,
            descendantContainment: true,
            visibleDirectionalControls: 0,
            directionOnlyOneGestureOneStep: true,
            canonicalSettledLanding: true
          };
        });
      }
    } finally {
      await context.close().catch(() => {});
    }
  }

  const staticContext = await contextOrFailure(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: false }, { suite: 'room-carousel-static-no-js' });
  if (staticContext) {
    try {
      for (const route of roomCarouselRoutes) {
        await executePageCase(staticContext, { check: 'room-carousel-static-no-js', route }, async page => {
          const errors = collectErrors(page);
          await gotoChecked(page, route);
          await health(page, route, errors);
          const carouselRoot = page.locator('[data-laws-room-carousel]').first();
          assert(await carouselRoot.count() === 1, `${route}: static carousel root missing`);
          assert(await carouselRoot.getAttribute('data-lrc-mounted') !== 'true', `${route}: runtime mounted with JavaScript disabled`);
        });
      }
    } finally {
      await staticContext.close().catch(() => {});
    }
  }
}

function countCheck(check) {
  return results.filter(result => result.check === check).length;
}
function failureIncludes(pattern) {
  return failures.some(failure => failure.message.includes(pattern));
}
function writeSummary(summary) {
  fs.writeFileSync(path.join(artifactDir, 'browser-result.json'), JSON.stringify(summary, null, 2) + '\n');
}

async function main() {
  assert(childPages.length === 24, `Child route count ${childPages.length}`);
  assert(batteryScope.public_surface_count === 27, 'Battery scope drift');
  assert(allPages.length === 33, `Integrated route count ${allPages.length}`);
  assert(roomCarouselRoutes.length === 25, `Room carousel route count ${roomCarouselRoutes.length}`);

  const browser = await chromium.launch({ headless: true });
  try {
    await verifyProfiles(browser);
    await verifyReduced(browser);
    await verifyStatic(browser);
    await verifyRoomCarousel(browser);
  } finally {
    await browser.close();
  }

  const expectedMatrixExecutions = allPages.length * profiles.length + renewedPages.length + allPages.length + roomCarouselRoutes.length * (profiles.length + 1);
  const matrixExecutions = results.filter(result => matrixChecks.has(result.check)).length;
  const fullMatrixCompleted = matrixExecutions === expectedMatrixExecutions;
  if (!fullMatrixCompleted) {
    recordFailure({ check: 'matrix-completeness', expectedMatrixExecutions, matrixExecutions }, new Error(`FULL_MATRIX_INCOMPLETE:${matrixExecutions}/${expectedMatrixExecutions}`));
  }

  const summary = {
    contract: 'LAWS_CP6_FINAL_SYNCHRONIZATION_BROWSER_VERIFICATION_v2',
    status: failures.length ? 'FAIL' : 'PASS',
    head: executionCommit,
    executionCommit,
    githubEventSha,
    fullMatrixCompleted,
    expectedMatrixExecutions,
    matrixExecutions,
    failureCount: failures.length,
    childRoutes: 24,
    integratedRoutes: 33,
    batteryPublicSurfaces: 27,
    methodsModelsAlternateContract: failures.some(failure => failure.route === methodsShowroomRoute) ? 'FAIL' : 'PASS',
    roomCarouselRoutes: 25,
    roomCarouselRuntimeExecutions: countCheck('room-carousel-runtime'),
    roomCarouselStaticNoJavaScriptExecutions: countCheck('room-carousel-static-no-js'),
    roomCarouselVisibleDirectionalControls: failureIncludes('visible directional control') ? 'FAIL' : 'PASS',
    roomCarouselDirectionOnlyOneGestureOneStep: failureIncludes('vertical gesture') || failureIncludes('pointer one-step') ? 'FAIL' : 'PASS',
    roomCarouselCanonicalSettledLanding: failureIncludes('canonical settled landing') ? 'FAIL' : 'PASS',
    roomCarouselCompleteNumberedTopRail: failureIncludes('complete top tab rail') || failureIncludes('numbered tab sequence') ? 'FAIL' : 'PASS',
    roomCarouselDirectNonAdjacentSelection: failureIncludes('direct tab selection') ? 'FAIL' : 'PASS',
    roomCarouselStableOrbitStage: failureIncludes('stage height') || failureIncludes('geometry unstable') ? 'FAIL' : 'PASS',
    roomCarouselOrbitInspectionSeparation: failureIncludes('planes not separated') ? 'FAIL' : 'PASS',
    roomCarouselBoundedInspectionScroll: failureIncludes('bounded inspection') ? 'FAIL' : 'PASS',
    roomCarouselLowerPageFlow: failureIncludes('lower page content') ? 'FAIL' : 'PASS',
    roomCarouselDescendantContainment: failureIncludes('descendant') ? 'FAIL' : 'PASS',
    roomCarouselMobileContainment: failureIncludes('mobile containment') ? 'FAIL' : 'PASS',
    roomCarouselAuditSeparation: failureIncludes('audit overlaps carousel') ? 'FAIL' : 'PASS',
    profiles: profiles.map(profile => profile.name),
    profilePageExecutions: countCheck('profile'),
    reducedMotionExecutions: countCheck('reduced-motion'),
    staticNoJavaScriptExecutions: countCheck('static-no-js'),
    zeroOpenExclusiveOrZeroReadings: failureIncludes('reading') || failureIncludes('panel') ? 'FAIL' : 'PASS',
    collapsibleNavigation: failureIncludes('nav ') ? 'FAIL' : 'PASS',
    persistentFirstRail: failureIncludes('FIRST rail') ? 'FAIL' : 'PASS',
    auditDisclosure: failureIncludes('audit ') ? 'FAIL' : 'PASS',
    horizontalOverflow: failures.filter(failure => failure.message.includes('overflow')).length,
    browserErrors: failures.filter(failure => /pageerror:|console:|response:\d+/.test(failure.message)).length,
    pointerDiagnosticCount: pointerDiagnostics.length,
    pointerDiagnostics,
    failures,
    results,
  };
  writeSummary(summary);
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  const failure = {
    contract: 'LAWS_CP6_FINAL_SYNCHRONIZATION_BROWSER_VERIFICATION_v2',
    status: 'FAIL',
    head: executionCommit,
    executionCommit,
    githubEventSha,
    fullMatrixCompleted: false,
    failureCount: failures.length + 1,
    message: messageOf(error),
    pointerDiagnostics,
    failures,
    results,
  };
  writeSummary(failure);
  console.error(messageOf(error));
  process.exitCode = 1;
}