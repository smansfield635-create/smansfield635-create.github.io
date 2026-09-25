import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ORIGIN = process.env.H_EARTH_B10R1_ORIGIN || 'http://127.0.0.1:4188';
const RECEIPT_PATH = process.env.H_EARTH_B10R1_BROWSER_RECEIPT || '/tmp/h-earth-b10r1-guided-test-removal.browser.receipt.json';
const PUBLIC = process.env.PUBLIC_VERIFICATION === 'true';
const assertions = [];
const pageErrors = [];
const consoleErrors = [];
const httpErrors = [];
const guidedModuleRequests = [];
const check = (id, pass, detail = null) => assertions.push({ id, pass: Boolean(pass), detail });

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(String(error?.stack || error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('interaction-acceptance.run8e.js')) guidedModuleRequests.push({ url, status: response.status() });
    if (response.status() >= 400 && new URL(url).origin === new URL(ORIGIN).origin) httpErrors.push({ url, status: response.status() });
  });

  const response = await page.goto(`${ORIGIN}/showroom/globe/h-earth/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  check('PUBLIC_ROUTE_REACHABLE', response?.status() === 200, response?.status());
  await page.waitForFunction(() => document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true', null, { timeout: 45000 });
  check('RUN8E_READY', await page.locator('#h-earth-functional-landscape-route').getAttribute('data-run8e-ready') === 'true');
  check('TROPHY_DEFAULT_PROMOTED', await page.locator('html').getAttribute('data-h-earth-public-face-default') === 'promoted');
  check('TROPHY_HERO_VISIBLE', await page.locator('#h-earth-b10-hero').isVisible());
  check('BASELINE_ARRIVAL_HIDDEN', !(await page.locator('#h-earth-baseline-arrival').isVisible()));
  check('LIVE_WORLD_VISIBLE', await page.locator('#h-earth-functional-landscape-mount').isVisible());
  check('AWARDS_TAB_VISIBLE', await page.locator('#h-earth-awards-link').isVisible());
  check('FD05_NOT_PRIMARY_NAVIGATION', (await page.locator('#h-earth-3d-diagnostic-link').count()) === 1 && !(await page.locator('#h-earth-3d-diagnostic-link').isVisible()));
  check('GUIDED_PANEL_ABSENT', (await page.getByText('Guided interaction acceptance', { exact: true }).count()) === 0);
  check('GUIDED_GLOBAL_ABSENT', await page.evaluate(() => !('H_EARTH_INTERACTION_ACCEPTANCE' in window)));
  check('GUIDED_MODULE_NOT_REQUESTED', guidedModuleRequests.length === 0, guidedModuleRequests);

  const lenses = page.locator('.h-earth-b10-lens');
  check('SIX_LENSES_PRESENT', await lenses.count() === 6, await lenses.count());
  check('ALL_LENSES_CLOSED_ON_LOAD', await page.locator('.h-earth-b10-lens[open]').count() === 0);
  await lenses.nth(0).locator('summary').click();
  await page.waitForTimeout(100);
  check('FIRST_LENS_OPENS', await lenses.nth(0).getAttribute('open') !== null);
  await lenses.nth(1).locator('summary').click();
  await page.waitForTimeout(100);
  check('ONE_LENS_AT_A_TIME', await page.locator('.h-earth-b10-lens[open]').count() === 1 && await lenses.nth(1).getAttribute('open') !== null);

  const canvas = page.locator('#h-earth-functional-landscape-canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  check('CANVAS_HAS_VISIBLE_AREA', Boolean(box && box.width > 100 && box.height > 100), box);
  const before = await page.evaluate(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt?.()?.proposals?.length ?? 0);
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5, { steps: 6 });
    await page.mouse.up();
    await page.mouse.wheel(0, 180);
  }
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt?.()?.proposals?.length ?? 0);
  check('DESKTOP_INTERACTION_REACHES_INTAKE', after > before, { before, after });
  check('LIVE_GPU_PRESENTING', await page.evaluate(() => (window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.counters?.gpuFramebufferPresentationCount ?? 0) > 0));

  const awardsResponse = await page.goto(`${ORIGIN}/showroom/globe/h-earth/awards/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  check('AWARDS_ROUTE_REACHABLE', awardsResponse?.status() === 200, awardsResponse?.status());
  check('AWARDS_OVERVIEW_PRESENT', await page.getByRole('heading', { name: /Awards/i }).count() > 0 || (await page.title()).includes('Awards'));

  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', (error) => pageErrors.push(`MOBILE:${String(error?.stack || error)}`));
  mobile.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(`MOBILE:${message.text()}`); });
  mobile.on('response', (mobileResponse) => {
    const url = mobileResponse.url();
    if (url.includes('interaction-acceptance.run8e.js')) guidedModuleRequests.push({ url, status: mobileResponse.status(), mobile: true });
    if (mobileResponse.status() >= 400 && new URL(url).origin === new URL(ORIGIN).origin) httpErrors.push({ url, status: mobileResponse.status(), mobile: true });
  });
  await mobile.goto(`${ORIGIN}/showroom/globe/h-earth/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mobile.waitForFunction(() => document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true', null, { timeout: 45000 });
  check('MOBILE_TROPHY_HERO_VISIBLE', await mobile.locator('#h-earth-b10-hero').isVisible());
  check('MOBILE_LIVE_WORLD_VISIBLE', await mobile.locator('#h-earth-functional-landscape-mount').isVisible());
  check('MOBILE_GUIDED_PANEL_ABSENT', (await mobile.getByText('Guided interaction acceptance', { exact: true }).count()) === 0);
  check('MOBILE_GUIDED_GLOBAL_ABSENT', await mobile.evaluate(() => !('H_EARTH_INTERACTION_ACCEPTANCE' in window)));
  check('MOBILE_ALL_LENSES_CLOSED', await mobile.locator('.h-earth-b10-lens[open]').count() === 0);
  await mobileContext.close();
} catch (error) {
  assertions.push({ id: 'BROWSER_EXECUTION_COMPLETED', pass: false, detail: String(error?.stack || error) });
} finally {
  await browser.close();
}

check('PAGE_ERRORS_ZERO', pageErrors.length === 0, pageErrors);
check('CONSOLE_ERRORS_ZERO', consoleErrors.length === 0, consoleErrors);
check('OWNED_HTTP_ERRORS_ZERO', httpErrors.length === 0, httpErrors);
check('GUIDED_MODULE_REQUESTS_ZERO_FINAL', guidedModuleRequests.length === 0, guidedModuleRequests);
const failed = assertions.filter((entry) => !entry.pass);
const receiptBase = {
  schemaVersion: PUBLIC
    ? 'H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_PUBLIC_BROWSER_RECEIPT_v1'
    : 'H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_LOCAL_BROWSER_RECEIPT_v1',
  operation: 'H_EARTH_PUBLIC_FACE_GUIDED_TEST_REMOVAL_AND_DEFAULT_PROMOTION_001',
  checkpoint: 'B10R1_GUIDED_TEST_REMOVAL_AND_DEFAULT_PROMOTION',
  status: failed.length === 0 ? 'PASS_CLOSED' : 'FAIL',
  origin: ORIGIN,
  publicVerificationPerformed: PUBLIC,
  candidateHead: process.env.CANDIDATE_HEAD || null,
  assertionCount: assertions.length,
  failedAssertionCount: failed.length,
  pageErrors,
  consoleErrors,
  httpErrors,
  guidedModuleRequests,
  assertions
};
const receiptSha256 = crypto.createHash('sha256').update(JSON.stringify(receiptBase)).digest('hex');
const receipt = { ...receiptBase, receiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failed.length) process.exit(1);
