import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.LAWS_BASE_URL || 'http://127.0.0.1:4173';
const directions = ['flow', 'integrity', 'reality', 'structure', 'test'];
const viewports = [
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 820, height: 1180, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1440, height: 1000, isMobile: false, hasTouch: false }
];

const receipt = {
  contract: 'LAWS_FIRST_DYNAMIC_INDICATOR_RESTORATION_BROWSER_VERIFICATION_v1',
  head: process.env.GITHUB_SHA || 'LOCAL',
  generated_at: new Date().toISOString(),
  route: '/laws/',
  directions,
  checks: [],
  disposition: 'IN_PROGRESS'
};

function record(check, status, detail = '') {
  receipt.checks.push({ check, status, detail });
}

function verifySourceContract() {
  const css = fs.readFileSync('laws/index.experience.polish.css', 'utf8');
  const js = fs.readFileSync('laws/index.experience.js', 'utf8');
  const controller = fs.readFileSync('laws/index.controller.js', 'utf8');
  const html = fs.readFileSync('laws/index.html', 'utf8');

  assert.ok(css.includes('LAWS_FIRST_DYNAMIC_INDICATOR_RESTORATION_v1'), 'Restoration CSS contract missing.');
  assert.ok(css.includes('article[data-laws-experience-active="true"]::before'), 'Active indicator selector missing.');
  assert.ok(css.includes('left: 0 !important;'), 'Mobile in-bounds indicator position missing.');
  assert.ok(css.includes('background: #79eaff;'), 'Active cyan light missing.');
  assert.ok(js.includes('subscribeCompassState'), 'Existing Compass correspondence subscription missing.');
  assert.ok(js.includes('node.dataset.lawsExperienceActive'), 'Existing question-state correspondence missing.');
  assert.ok(controller.includes('function requestReturnToConstellation'), 'Accepted return-to-constellation procedure missing.');
  assert.equal((html.match(/data-laws-experience-question="(?:flow|integrity|reality|structure|test)"/g) || []).length, 5, 'Exactly five FIRST question records are required.');
  assert.ok(!css.includes('pointer-events: auto'), 'Indicator restoration must not create a new interaction surface.');

  record('source_contract', 'PASS', 'Five state records, existing read-only Compass subscription, accepted constellation return, cyan active light, and in-bounds mobile positioning are present.');
}

async function waitForRuntimeReady(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return Boolean(globalThis.DGB_LAWS_EXPERIENCE && globalThis.DGB_LAWS_CONTROLLER) &&
      root?.dataset.lawsControllerStatus === 'ready' &&
      root?.dataset.lawsInteractionsStatus === 'ready';
  });
}

async function openFirstDisclosure(page) {
  const disclosure = page.locator('[data-laws-first-disclosure]');
  assert.equal(await disclosure.count(), 1, 'FIRST disclosure missing.');
  if (!(await disclosure.evaluate((node) => node.open))) {
    await disclosure.locator(':scope > summary').click();
  }
  assert.equal(await disclosure.evaluate((node) => node.open), true, 'FIRST disclosure did not open.');
}

async function ensureConstellation(page) {
  const state = await page.locator('[data-laws-root]').getAttribute('data-laws-controller-state');
  if (state === 'CONSTELLATION') return;

  const returned = await page.evaluate(() => {
    const controller = globalThis.DGB_LAWS_CONTROLLER;
    if (!controller || typeof controller.requestReturnToConstellation !== 'function') {
      throw new Error('Accepted return-to-constellation controller procedure missing');
    }
    return controller.requestReturnToConstellation({ scrollToScene: false });
  });

  assert.equal(returned, true, `Return to constellation was rejected from ${state || 'unknown state'}.`);
  await page.waitForFunction(
    () => document.querySelector('[data-laws-root]')?.dataset.lawsControllerState === 'CONSTELLATION'
  );
}

async function selectDirection(page, direction) {
  await ensureConstellation(page);

  const accepted = await page.evaluate((nextDirection) => {
    const control = document.querySelector(`[data-laws-category][data-direction="${nextDirection}"]`);
    if (!control) throw new Error(`Compass authority control missing: ${nextDirection}`);
    control.click();
    return true;
  }, direction);

  assert.equal(accepted, true, `Compass authority selection was not issued: ${direction}.`);
  await page.waitForFunction(
    (nextDirection) => {
      const root = document.querySelector('[data-laws-root]');
      return root?.dataset.lawsControllerState === 'CLUSTER_OPEN' &&
        document.documentElement.dataset.lawsExperienceDirection === nextDirection;
    },
    direction
  );

  await page.waitForFunction(
      (nextDirection) => {
        const records = Array.from(document.querySelectorAll('.laws-first__question-grid [data-laws-experience-question]'));
        return records.length === 5 && records.every((record) => {
          const active = record.dataset.lawsExperienceActive === 'true';
          const expectedActive = record.dataset.lawsExperienceQuestion === nextDirection;
          return active === expectedActive;
        });
      },
      direction
    );
    await page.waitForTimeout(260);
}

async function inspectIndicators(page) {
  return page.evaluate(() => {
    const records = Array.from(document.querySelectorAll('.laws-first__question-grid [data-laws-experience-question]'));
    const root = document.documentElement;
    const body = document.body;

    return {
      direction: root.dataset.lawsExperienceDirection || '',
      controllerState: document.querySelector('[data-laws-root]')?.dataset.lawsControllerState || '',
      overflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
      records: records.map((record) => {
        const pseudo = getComputedStyle(record, '::before');
        const rect = record.getBoundingClientRect();
        return {
          direction: record.dataset.lawsExperienceQuestion || '',
          active: record.dataset.lawsExperienceActive === 'true',
          display: pseudo.display,
          visibility: pseudo.visibility,
          opacity: pseudo.opacity,
          backgroundColor: pseudo.backgroundColor,
          borderColor: pseudo.borderColor,
          boxShadow: pseudo.boxShadow,
          left: pseudo.left,
          top: pseudo.top,
          width: pseudo.width,
          recordLeft: rect.left,
          recordRight: rect.right,
          viewportWidth: innerWidth
        };
      })
    };
  });
}

function assertIndicatorSnapshot(snapshot, expectedDirection, profileName) {
  assert.equal(snapshot.direction, expectedDirection, `${profileName}: ambient direction mismatch.`);
  assert.equal(snapshot.controllerState, 'CLUSTER_OPEN', `${profileName}: selection did not reach the accepted Compass cluster state.`);
  assert.ok(snapshot.overflow <= 2, `${profileName}: horizontal overflow ${snapshot.overflow}px.`);
  assert.equal(snapshot.records.length, 5, `${profileName}: expected five indicator records.`);

  const active = snapshot.records.filter((record) => record.active);
  assert.equal(active.length, 1, `${profileName}: exactly one light must be active.`);
  assert.equal(active[0].direction, expectedDirection, `${profileName}: active light did not follow Compass selection.`);

  for (const record of snapshot.records) {
    assert.equal(record.display, 'block', `${profileName}/${record.direction}: indicator is not displayed.`);
    assert.equal(record.visibility, 'visible', `${profileName}/${record.direction}: indicator is hidden.`);
    assert.equal(record.opacity, '1', `${profileName}/${record.direction}: indicator is transparent.`);
    assert.ok(parseFloat(record.width) >= 12, `${profileName}/${record.direction}: indicator is too small.`);
    assert.ok(record.recordLeft >= -1, `${profileName}/${record.direction}: record begins outside the viewport.`);
    assert.ok(record.recordRight <= record.viewportWidth + 2, `${profileName}/${record.direction}: record exceeds the viewport.`);

    if (profileName.startsWith('phone')) {
      assert.ok(parseFloat(record.left) >= 0, `${profileName}/${record.direction}: light remains positioned off the mobile content rail.`);
    }

    if (record.active) {
      assert.equal(record.backgroundColor, 'rgb(121, 234, 255)', `${profileName}/${record.direction}: active light is not cyan.`);
      assert.notEqual(record.boxShadow, 'none', `${profileName}/${record.direction}: active light has no glow.`);
    } else {
      assert.equal(record.backgroundColor, 'rgb(7, 16, 31)', `${profileName}/${record.direction}: inactive light is not the subdued outline state.`);
    }
  }
}

async function verifyViewport(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch
  });
  const page = await context.newPage();
  const errors = [];

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('404')) {
      errors.push(`console: ${message.text()}`);
    }
  });

  await page.goto(`${baseUrl}/laws/`, { waitUntil: 'networkidle' });
  await waitForRuntimeReady(page);
  await openFirstDisclosure(page);

  const observations = [];
  for (const direction of directions) {
    await selectDirection(page, direction);
    const snapshot = await inspectIndicators(page);
    assertIndicatorSnapshot(snapshot, direction, profile.name);
    observations.push(snapshot);
    await ensureConstellation(page);
  }

  assert.deepEqual(errors, [], `${profile.name}: browser errors: ${errors.join(' | ')}`);
  await page.screenshot({ path: `artifacts/laws-first-indicators-${profile.name}.png`, fullPage: true });
  await context.close();
  record(`interactive_${profile.name}`, 'PASS', 'Five Compass selections, each separated by the accepted return-to-constellation procedure, produced one settled, visible, in-bounds active light with no overflow or browser errors.');
  return observations;
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/laws/`, { waitUntil: 'networkidle' });
  await waitForRuntimeReady(page);
  await openFirstDisclosure(page);
  await selectDirection(page, 'structure');

  const reduced = await page.evaluate(() => {
    const active = document.querySelector('.laws-first__question-grid [data-laws-experience-active="true"]');
    const pseudo = active ? getComputedStyle(active, '::before') : null;
    return {
      direction: document.documentElement.dataset.lawsExperienceDirection || '',
      transitionDuration: pseudo?.transitionDuration || '',
      backgroundColor: pseudo?.backgroundColor || ''
    };
  });

  assert.equal(reduced.direction, 'structure', 'Reduced motion lost Compass correspondence.');
  assert.equal(reduced.backgroundColor, 'rgb(121, 234, 255)', 'Reduced motion lost the active light.');
  assert.ok(reduced.transitionDuration === '0s' || reduced.transitionDuration === '0.001ms', `Reduced-motion transition remains active: ${reduced.transitionDuration}`);
  await context.close();
  record('reduced_motion', 'PASS', 'The active light remains state-correct with transitions removed.');
}

async function verifyStaticFallback(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: false
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/laws/`, { waitUntil: 'load' });
  await openFirstDisclosure(page);

  const fallback = await inspectIndicators(page);
  assert.equal(fallback.records.length, 5, 'Static fallback lost indicator records.');
  assert.equal(fallback.records.filter((record) => record.active).length, 0, 'Static fallback invented an active Compass state.');
  assert.ok(fallback.overflow <= 2, `Static fallback horizontal overflow ${fallback.overflow}px.`);
  for (const record of fallback.records) {
    assert.equal(record.display, 'block', `Static fallback hides ${record.direction} indicator.`);
    assert.ok(parseFloat(record.left) >= 0, `Static fallback positions ${record.direction} indicator outside the mobile rail.`);
  }

  await context.close();
  record('static_no_javascript', 'PASS', 'All five neutral indicators remain visible and in-bounds without inventing runtime state.');
}

fs.mkdirSync('artifacts', { recursive: true });
verifySourceContract();

const browser = await chromium.launch({ headless: true });
try {
  for (const profile of viewports) {
    await verifyViewport(browser, profile);
  }
  await verifyReducedMotion(browser);
  await verifyStaticFallback(browser);
  receipt.disposition = 'PASS';
} finally {
  await browser.close();
}

fs.writeFileSync(
  path.join('artifacts', 'laws-first-indicator-restoration-verification.json'),
  `${JSON.stringify(receipt, null, 2)}\n`
);

console.log(JSON.stringify(receipt, null, 2));
