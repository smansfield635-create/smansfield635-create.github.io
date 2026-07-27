import fs from 'node:fs';
import { chromium } from 'playwright';

let failureWritten = false;
function persistFailure(error) {
  if (failureWritten) return;
  failureWritten = true;
  const payload = {
    status: 'FAIL',
    error: String(error),
    stack: error && error.stack ? String(error.stack) : ''
  };
  try {
    fs.writeFileSync('/tmp/laws-secondary-label-glow-results.json', JSON.stringify(payload, null, 2));
  } catch (_) {}
}
process.on('uncaughtException', error => {
  persistFailure(error);
  console.error(error);
  process.exit(1);
});
process.on('unhandledRejection', error => {
  persistFailure(error);
  console.error(error);
  process.exit(1);
});

const configurations = [
  { name: 'samsung-portrait', width: 360, height: 800 },
  { name: 'large-phone', width: 412, height: 915 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 }
];
const expectedPrimary = ['Flow', 'Integrity', 'Reality', 'Structure'];
const expectedFlow = ['Signals', 'Feedback', 'Cycles', 'Handoffs'];
const results = [];
const browser = await chromium.launch({ headless: true });

for (const config of configurations) {
  const page = await browser.newPage({ viewport: { width: config.width, height: config.height } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  await page.goto('http://127.0.0.1:4173/laws/', { waitUntil: 'domcontentloaded' });
  await page.locator('#laws-orbit').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-laws-root]');
    return root?.getAttribute('data-laws-staged-orbit-loaded') === 'true' &&
      root?.getAttribute('data-laws-staged-interaction-loaded') === 'true' &&
      root?.getAttribute('data-laws-secondary-label-status') === 'active';
  }, null, { timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll('[data-laws-projected-category-label]:not([hidden])').length === 4, null, { timeout: 15000 });

  const primary = await page.locator('[data-laws-projected-category-label]:not([hidden])').allTextContents();
  if (primary.join('|') !== expectedPrimary.join('|')) {
    throw new Error(`${config.name}:PRIMARY_LABELS_CHANGED:${primary.join('|')}`);
  }

  await page.locator('[data-laws-projected-category-label="flow"]').click({ force: true });
  await page.waitForFunction(() => String(document.querySelector('[data-laws-root]')?.getAttribute('data-laws-presentation-mode') || '').toUpperCase() === 'CLUSTER', null, { timeout: 10000 });
  await page.waitForFunction(() => document.querySelectorAll('[data-laws-projected-law-label]:not([hidden])').length === 4, null, { timeout: 10000 });

  const audit = await page.evaluate(() => {
    const field = document.querySelector('[data-laws-scene-field]');
    const fieldRect = field.getBoundingClientRect();
    const labels = [...document.querySelectorAll('[data-laws-projected-law-label]:not([hidden])')];
    const texts = labels.map(label => label.textContent.trim());
    const contained = labels.every(label => {
      const rect = label.getBoundingClientRect();
      const style = getComputedStyle(label);
      return rect.width > 0 && rect.height > 0 && style.visibility === 'visible' &&
        style.display !== 'none' && style.pointerEvents === 'none' &&
        rect.left >= fieldRect.left - 0.5 && rect.right <= fieldRect.right + 0.5 &&
        rect.top >= fieldRect.top - 0.5 && rect.bottom <= fieldRect.bottom + 0.5;
    });
    const activeControls = [...document.querySelectorAll('[data-laws-law][data-direction="flow"][data-projection-visible="true"]')]
      .filter(control => getComputedStyle(control).pointerEvents !== 'none').length;
    return {
      mode: String(document.querySelector('[data-laws-root]')?.getAttribute('data-laws-presentation-mode') || ''),
      texts,
      contained,
      activeControls,
      placement: labels.every(label => label.dataset.lawsProjectedPlacement === 'inward-edge-constrained'),
      labelState: globalThis.DGB_LAWS_SECONDARY_LABELS?.getState?.() || null,
      rootState: Object.fromEntries([...document.querySelector('[data-laws-root]').attributes].filter(attribute => attribute.name.startsWith('data-laws-')).map(attribute => [attribute.name, attribute.value]))
    };
  });

  if (audit.texts.join('|') !== expectedFlow.join('|')) {
    throw new Error(`${config.name}:SECONDARY_LABELS_INVALID:${audit.texts.join('|')}:${JSON.stringify(audit)}`);
  }
  if (!audit.contained || !audit.placement || audit.activeControls !== 4 || audit.labelState?.visibleCount !== 4) {
    throw new Error(`${config.name}:SECONDARY_LABEL_CONTRACT_FAILED:${JSON.stringify(audit)}`);
  }
  if (errors.length) {
    throw new Error(`${config.name}:PAGE_ERRORS:${errors.join(' || ')}`);
  }

  await page.screenshot({ path: `/tmp/laws-${config.name}.png`, fullPage: false });
  results.push({ config, primary, secondary: audit.texts, contained: audit.contained, activeControls: audit.activeControls, errors });
  await page.close();
}

await browser.close();
fs.writeFileSync('/tmp/laws-secondary-label-glow-results.json', JSON.stringify({ status: 'PASS', results }, null, 2));
console.log(JSON.stringify({ status: 'PASS', results }, null, 2));
