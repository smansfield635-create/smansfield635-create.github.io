import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.LAWS_BASE_URL || 'http://127.0.0.1:4173';
const pages = [
  {
    name: 'Flow / Signals',
    file: 'laws/categories/flow/signals/index.html',
    url: '/laws/categories/flow/signals/'
  },
  {
    name: 'Reality / Measure',
    file: 'laws/categories/reality/measure.html',
    url: '/laws/categories/reality/measure.html'
  },
  {
    name: 'Test / Reverse Audit',
    file: 'laws/test/reverse-audit/index.html',
    url: '/laws/test/reverse-audit/'
  },
  {
    name: 'Research / Findings and Boundaries',
    file: 'laws/research/findings-and-boundaries/index.html',
    url: '/laws/research/findings-and-boundaries/'
  },
  {
    name: 'Industrial Posture',
    file: 'laws/industrial-posture/index.html',
    url: '/laws/industrial-posture/'
  }
];

const deviceMatrix = [
  { name: 'phone', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true },
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, hasTouch: false, isMobile: false }
];

const receipt = {
  contract: 'LAWS_RENEWAL_COLLAPSED_ENTRY_BROWSER_VERIFICATION_v1',
  head: process.env.GITHUB_SHA || 'LOCAL',
  generated_at: new Date().toISOString(),
  pages: pages.map(({ name, file, url }) => ({ name, file, url })),
  checks: [],
  disposition: 'IN_PROGRESS'
};

function record(check, status, detail = '') {
  receipt.checks.push({ check, status, detail });
}

function verifySourceContracts() {
  for (const page of pages) {
    const html = fs.readFileSync(page.file, 'utf8');
    const pageFactsCount = (html.match(/<details class="lr-page-facts"(?: open)?>/g) || []).length;
    const statusGridCount = (html.match(/class="lr-status-grid"/g) || []).length;
    const tabCount = (html.match(/class="lr-tab"/g) || []).length;
    const collapsedTabCount = (html.match(/aria-selected="false" aria-expanded="false" type="button"/g) || []).length;

    assert.equal(pageFactsCount, 1, `${page.name}: expected one native Page facts disclosure`);
    assert.equal(statusGridCount, 1, `${page.name}: expected one hero fact grid`);
    assert.ok(html.indexOf('<details class="lr-page-facts" open>') < html.indexOf('class="lr-status-grid"'), `${page.name}: fact grid must be owned by Page facts disclosure`);
    assert.ok(html.includes('LAWS_COMPLETE_RENEWAL_V3'), `${page.name}: shared asset version must be V3`);
    assert.ok(!html.includes('LAWS_COMPLETE_RENEWAL_V1'), `${page.name}: stale shared asset version remains`);
    assert.ok(!html.includes('aria-selected="true"'), `${page.name}: preselected reading control remains in source`);
    assert.ok(tabCount > 0, `${page.name}: reading controls missing`);
    assert.equal(collapsedTabCount, tabCount, `${page.name}: every reading control must enter collapsed in source`);
    assert.ok(html.includes('<details class="lr-page-facts" open>'), `${page.name}: static Page facts fallback must be open in source`);
    assert.ok(html.includes('<details class="lr-audit" open>'), `${page.name}: static audit fallback must be open in source`);
    assert.ok(html.includes("document.documentElement.classList.add('lr-js')"), `${page.name}: pre-paint enhanced-entry bootstrap missing`);
  }
  record('source_contracts', 'PASS', 'Five pages carry native Page facts, V3 assets, and zero preselected reading controls.');
}

async function assertCollapsedEntry(page, pageName) {
  await page.waitForFunction(() => document.documentElement.dataset.lrEntryDisclosureState === 'collapsed');

  const pageFacts = page.locator('.lr-page-facts');
  assert.equal(await pageFacts.count(), 1, `${pageName}: Page facts disclosure missing`);
  assert.equal(await pageFacts.evaluate((node) => node.open), false, `${pageName}: Page facts opened on entry`);

  const buttons = page.locator('.lr-tab');
  const panels = page.locator('.lr-panel');
  const buttonCount = await buttons.count();
  assert.ok(buttonCount > 0, `${pageName}: reading controls missing`);
  assert.equal(await panels.count(), buttonCount, `${pageName}: reading control and panel counts differ`);

  const expanded = await buttons.evaluateAll((nodes) => nodes.filter((node) => node.getAttribute('aria-expanded') === 'true').length);
  const visiblePanels = await panels.evaluateAll((nodes) => nodes.filter((node) => !node.hidden && getComputedStyle(node).display !== 'none').length);
  assert.equal(expanded, 0, `${pageName}: a reading control opened on entry`);
  assert.equal(visiblePanels, 0, `${pageName}: a reading panel opened on entry`);

  const openAudits = await page.locator('.lr-audit').evaluateAll((nodes) => nodes.filter((node) => node.open).length);
  const openSources = await page.locator('.lr-source-disclosure').evaluateAll((nodes) => nodes.filter((node) => node.open).length);
  assert.equal(openAudits, 0, `${pageName}: canonical audit opened on entry`);
  assert.equal(openSources, 0, `${pageName}: exact source disclosure opened on entry`);

  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${pageName}: horizontal overflow ${overflow}px`);
}

async function verifyInteractiveMatrix(browser) {
  for (const device of deviceMatrix) {
    const context = await browser.newContext({
      viewport: device.viewport,
      hasTouch: device.hasTouch,
      isMobile: device.isMobile
    });

    for (const target of pages) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });

      await page.goto(`${baseUrl}${target.url}`, { waitUntil: 'networkidle' });
      await assertCollapsedEntry(page, `${target.name} (${device.name})`);

      const buttons = page.locator('.lr-tab');
      const panels = page.locator('.lr-panel');
      const buttonCount = await buttons.count();

      await buttons.first().focus();
      if (buttonCount > 1) {
        await page.keyboard.press('ArrowRight');
        assert.equal(await buttons.nth(1).evaluate((node) => document.activeElement === node), true, `${target.name} (${device.name}): ArrowRight did not move focus`);
        const keyboardExpanded = await buttons.evaluateAll((nodes) => nodes.filter((node) => node.getAttribute('aria-expanded') === 'true').length);
        assert.equal(keyboardExpanded, 0, `${target.name} (${device.name}): focus navigation opened a panel`);
      }

      await buttons.first().click();
      assert.equal(await buttons.first().getAttribute('aria-expanded'), 'true', `${target.name} (${device.name}): first control did not open`);
      assert.equal(await panels.first().isVisible(), true, `${target.name} (${device.name}): first panel did not become visible`);

      if (buttonCount > 1) {
        await buttons.nth(1).click();
        assert.equal(await buttons.first().getAttribute('aria-expanded'), 'false', `${target.name} (${device.name}): opening second control did not close first`);
        assert.equal(await buttons.nth(1).getAttribute('aria-expanded'), 'true', `${target.name} (${device.name}): second control did not open`);
        assert.equal(await panels.first().isVisible(), false, `${target.name} (${device.name}): first panel remained visible`);
        assert.equal(await panels.nth(1).isVisible(), true, `${target.name} (${device.name}): second panel did not become visible`);

        await buttons.nth(1).click();
      } else {
        await buttons.first().click();
      }

      const finalExpanded = await buttons.evaluateAll((nodes) => nodes.filter((node) => node.getAttribute('aria-expanded') === 'true').length);
      const finalVisible = await panels.evaluateAll((nodes) => nodes.filter((node) => !node.hidden && getComputedStyle(node).display !== 'none').length);
      assert.equal(finalExpanded, 0, `${target.name} (${device.name}): toggle-close left a control open`);
      assert.equal(finalVisible, 0, `${target.name} (${device.name}): toggle-close left a panel visible`);

      const facts = page.locator('.lr-page-facts');
      await facts.locator('summary').click();
      assert.equal(await facts.evaluate((node) => node.open), true, `${target.name} (${device.name}): Page facts did not open`);
      await facts.locator('summary').click();
      assert.equal(await facts.evaluate((node) => node.open), false, `${target.name} (${device.name}): Page facts did not close`);

      assert.deepEqual(errors, [], `${target.name} (${device.name}): browser errors: ${errors.join(' | ')}`);
      await page.close();
    }

    await context.close();
    record(`interactive_${device.name}`, 'PASS', 'Zero-open entry, exclusive/toggle interaction, Page facts disclosure, overflow, and browser-error checks passed.');
  }
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce'
  });

  for (const target of pages) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${target.url}`, { waitUntil: 'networkidle' });
    await assertCollapsedEntry(page, `${target.name} (reduced motion)`);
    assert.equal(await page.locator('html').getAttribute('data-lr-motion'), 'reduced', `${target.name}: reduced-motion state not recorded`);
    await page.close();
  }

  await context.close();
  record('reduced_motion', 'PASS', 'All five pages preserve collapsed entry under reduced motion.');
}

async function verifyStaticEquivalence(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    javaScriptEnabled: false
  });

  for (const target of pages) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${target.url}`, { waitUntil: 'load' });

    assert.equal(await page.locator('html').evaluate((node) => node.classList.contains('lr-js')), false, `${target.name}: JavaScript class present in static mode`);
    assert.equal(await page.locator('.lr-page-facts__body').isVisible(), true, `${target.name}: Page facts unavailable in static mode`);
    assert.equal(await page.locator('.lr-audit__body').isVisible(), true, `${target.name}: audit unavailable in static mode`);

    const panelsReadable = await page.locator('.lr-panel').evaluateAll((nodes) => nodes.every((node) => !node.hidden && getComputedStyle(node).display !== 'none'));
    assert.equal(panelsReadable, true, `${target.name}: reading panels unavailable in static mode`);

    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `${target.name}: static-mode horizontal overflow ${overflow}px`);
    await page.close();
  }

  await context.close();
  record('static_no_javascript', 'PASS', 'Complete Page facts, reading layers, and audit content remain readable without JavaScript.');
}

verifySourceContracts();

const browser = await chromium.launch({ headless: true });
try {
  await verifyInteractiveMatrix(browser);
  await verifyReducedMotion(browser);
  await verifyStaticEquivalence(browser);
  receipt.disposition = 'PASS';
} finally {
  await browser.close();
}

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync(
  path.join('artifacts', 'laws-renewal-collapsed-entry-verification.json'),
  `${JSON.stringify(receipt, null, 2)}\n`
);

console.log(JSON.stringify(receipt, null, 2));
