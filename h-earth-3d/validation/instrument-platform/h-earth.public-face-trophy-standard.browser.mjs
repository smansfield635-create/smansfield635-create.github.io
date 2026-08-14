import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ORIGIN = process.env.H_EARTH_B10_ORIGIN || 'http://127.0.0.1:4187';
const CANDIDATE_ID = 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION_001';
const CANDIDATE_PATH = `/showroom/globe/h-earth/?candidate=${CANDIDATE_ID}`;
const BASELINE_PATH = '/showroom/globe/h-earth/';
const AWARDS_PATH = '/showroom/globe/h-earth/awards/';
const RECEIPT_PATH = process.env.H_EARTH_B10_BROWSER_RECEIPT || '/tmp/h-earth-public-face-trophy-standard-b10.browser.receipt.json';
const candidateHead = process.env.CANDIDATE_HEAD || 'LOCAL_CANDIDATE';
const publicVerificationPerformed = ORIGIN.startsWith('https://');

const assertions = [];
const pageErrors = [];
const consoleErrors = [];
const httpErrors = [];
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const check = (id, condition, detail = null) => {
  const entry = { id, pass: Boolean(condition), detail };
  assertions.push(entry);
  if (!entry.pass) throw new Error(`${id}:${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const captureErrors = (page, label) => {
  page.on('pageerror', (error) => pageErrors.push({ label, message: error.message, stack: error.stack ?? null }));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push({ label, text: message.text() });
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(ORIGIN)) {
      httpErrors.push({ label, status: response.status(), url: response.url() });
    }
  });
};

const digestCanvas = async (page) => sha256(await page.locator('#h-earth-functional-landscape-canvas').screenshot({ type: 'png' }));

const waitForHEarth = async (page, path, idPrefix) => {
  const response = await page.goto(`${ORIGIN}${path}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  check(`${idPrefix}_ROUTE_REACHABLE`, response?.ok() === true, response?.status());
  await page.locator('#h-earth-functional-landscape-canvas').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForFunction(() => {
    const route = document.getElementById('h-earth-functional-landscape-route');
    const startup = document.getElementById('h-earth-startup-result')?.textContent ?? '';
    return route?.dataset.run8eReady === 'true' || startup.includes('PASS');
  }, null, { timeout: 180000 });
  await page.waitForTimeout(700);
};

const gestureUsed = async (page) => page.evaluate(() => [
  document.getElementById('h-earth-3d-route-root'),
  document.getElementById('h-earth-functional-landscape-route')
].some((node) => node?.dataset.gestureUsed === 'true'));

const dispatchTouchSequence = async (page, frames) => {
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  for (const frame of frames) {
    await client.send('Input.dispatchTouchEvent', frame);
    await page.waitForTimeout(frame.type === 'touchMove' ? 90 : 60);
  }
};

const waitForSingleOpen = async (page, selector, attribute, expected) => {
  await page.waitForFunction(({ selector, attribute, expected }) => {
    const open = [...document.querySelectorAll(`${selector}[open]`)];
    return open.length === 1 && open[0].getAttribute(attribute) === expected;
  }, { selector, attribute, expected }, { timeout: 5000 });
};

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--no-sandbox']
});

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

  const baseline = await desktop.newPage();
  captureErrors(baseline, 'baseline-default');
  await waitForHEarth(baseline, BASELINE_PATH, 'BASELINE');
  check('BASELINE_B10_GATE_INACTIVE', await baseline.locator('html').getAttribute('data-h-earth-public-face-candidate') === 'inactive');
  check('BASELINE_TROPHY_HERO_HIDDEN', await baseline.locator('#h-earth-b10-hero').isHidden());
  check('BASELINE_ARRIVAL_VISIBLE', await baseline.locator('#h-earth-baseline-arrival').isVisible());
  check('BASELINE_AWARDS_TAB_HIDDEN', await baseline.locator('#h-earth-awards-link').isHidden());
  check('BASELINE_RUNTIME_DIAGNOSTICS_PRIMARY_VISIBLE', await baseline.locator('details.h-earth-runtime-diagnostics').isVisible());
  check('BASELINE_STARTUP_RECEIPT_PRIMARY_VISIBLE', await baseline.locator('details.h-earth-startup-receipt').isVisible());
  await baseline.close();

  const page = await desktop.newPage();
  captureErrors(page, 'desktop-candidate');
  await waitForHEarth(page, CANDIDATE_PATH, 'CANDIDATE');
  check('CANDIDATE_GATE_ACTIVE', await page.locator('html').getAttribute('data-h-earth-public-face-candidate') === 'active');
  check('TROPHY_HERO_VISIBLE', await page.locator('#h-earth-b10-hero').isVisible());
  check('WELCOME_TO_H_EARTH_VISIBLE', (await page.locator('#h-earth-b10-title').textContent())?.trim() === 'Welcome to H-Earth.');
  check('INTERACTIVE_NOW_VISIBLE', await page.getByText('Interactive now', { exact: true }).first().isVisible());
  check('IN_ACTIVE_DEVELOPMENT_VISIBLE', await page.getByText('In active development', { exact: true }).first().isVisible());
  check('ENTER_AND_EXPLORE_VISIBLE', await page.getByText('Enter and explore', { exact: true }).isVisible());
  check('AWARDS_TAB_VISIBLE', await page.locator('#h-earth-awards-link').isVisible());
  check('BASELINE_ARRIVAL_HIDDEN_IN_CANDIDATE', await page.locator('#h-earth-baseline-arrival').isHidden());
  check('SIX_PUBLIC_LENSES', await page.locator('.h-earth-b10-lens').count() === 6);
  check('ALL_PUBLIC_LENSES_CLOSED_ON_LOAD', await page.locator('.h-earth-b10-lens[open]').count() === 0);
  check('RUNTIME_DIAGNOSTICS_BACKSTAGE', await page.locator('details.h-earth-runtime-diagnostics').evaluate((node) => node.parentElement?.id === 'h-earth-b10-technical-host') && await page.locator('details.h-earth-runtime-diagnostics').isHidden());
  check('STARTUP_RECEIPT_BACKSTAGE', await page.locator('details.h-earth-startup-receipt').evaluate((node) => node.parentElement?.id === 'h-earth-b10-evidence-host') && await page.locator('details.h-earth-startup-receipt').isHidden());
  check('ENVIRONMENT_DETAILS_BACKSTAGE', await page.locator('details.h-earth-live-details').evaluate((node) => node.parentElement?.id === 'h-earth-b10-evidence-host') && await page.locator('details.h-earth-live-details').isHidden());
  check('LIVE_CANVAS_VISIBLE', await page.locator('#h-earth-functional-landscape-canvas').isVisible());

  const mount = page.locator('#h-earth-functional-landscape-mount');
  await mount.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const box = await mount.boundingBox();
  check('DESKTOP_STAGE_BOUNDS', Boolean(box && box.width > 200 && box.height > 200), box);
  const cx = box.x + box.width * 0.5;
  const cy = box.y + box.height * 0.5;

  let before = await digestCanvas(page);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 150, cy + 60, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(500);
  let after = await digestCanvas(page);
  check('DESKTOP_POINTER_DRAG_LOOK', before !== after && await gestureUsed(page), { before, after });

  before = after;
  const positionBeforeWheel = await page.locator('#hud-position').textContent();
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -520);
  await page.waitForTimeout(700);
  after = await digestCanvas(page);
  const positionAfterWheel = await page.locator('#hud-position').textContent();
  check('DESKTOP_WHEEL_TRAVEL', before !== after || positionBeforeWheel !== positionAfterWheel, { before, after, positionBeforeWheel, positionAfterWheel });

  before = after;
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -460);
  await page.keyboard.up('Control');
  await page.waitForTimeout(700);
  after = await digestCanvas(page);
  check('DESKTOP_CTRL_WHEEL_ZOOM', before !== after, { before, after });

  await page.locator('[data-b10-lens="PLATFORM_LENS"] > summary').click();
  check('PLATFORM_LENS_OPENS', await page.locator('[data-b10-lens="PLATFORM_LENS"]').evaluate((node) => node.open));
  await page.locator('[data-b10-lens="STORY_LENS"] > summary').click();
  await waitForSingleOpen(page, '.h-earth-b10-lens', 'data-b10-lens', 'STORY_LENS');
  check('ONE_PUBLIC_LENS_AT_A_TIME', await page.locator('.h-earth-b10-lens[open]').count() === 1);

  await page.locator('[data-b10-lens="ENGINEERING_LENS"] > summary').click();
  await waitForSingleOpen(page, '.h-earth-b10-lens', 'data-b10-lens', 'ENGINEERING_LENS');
  check('ENGINEERING_LENS_REVEALS_RUNTIME_DIAGNOSTICS', await page.locator('details.h-earth-runtime-diagnostics').isVisible());
  await page.locator('[data-b10-lens="EVIDENCE_LENS"] > summary').click();
  await waitForSingleOpen(page, '.h-earth-b10-lens', 'data-b10-lens', 'EVIDENCE_LENS');
  check('EVIDENCE_LENS_REVEALS_STARTUP_RECEIPT', await page.locator('details.h-earth-startup-receipt').isVisible());
  check('EVIDENCE_LENS_REVEALS_ENVIRONMENT_DETAILS', await page.locator('details.h-earth-live-details').isVisible());

  const awards = await desktop.newPage();
  captureErrors(awards, 'awards');
  const awardsResponse = await awards.goto(`${ORIGIN}${AWARDS_PATH}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  check('AWARDS_ROUTE_REACHABLE', awardsResponse?.ok() === true, awardsResponse?.status());
  check('AWARDS_ROUTE_IDENTITY', await awards.locator('html').getAttribute('data-awards-overview') === 'DIAMOND_GATE_BRIDGE_AWARD_LANDSCAPE');
  check('AWARDS_CLAIM_BOUNDARY', await awards.locator('html').getAttribute('data-claim-boundary') === 'TARGETS_AND_RATIONALE_NOT_NOMINATIONS_OR_WINS');
  check('FIVE_ACHIEVEMENT_STORIES', await awards.locator('[data-story]').count() === 5);
  check('EXPERIENCE_STORY_SELECTED_ON_LOAD', await awards.locator('[data-story="experience"]').getAttribute('aria-selected') === 'true');
  check('SIX_TROPHY_STANDARD_LENSES', await awards.locator('[data-lens]').count() === 6);
  check('COMPASS_LENS_SELECTED_ON_LOAD', await awards.locator('[data-lens="compass"]').getAttribute('aria-selected') === 'true');
  check('AWARDS_2027_CAMPAIGN_VISIBLE', await awards.getByText('Planned submissions · late October 2026 · 2027 cycle', { exact: true }).isVisible());
  check('AWARDS_TRANSPARENCY_BOUNDARY_VISIBLE', await awards.getByText(/does not claim that a submission, nomination, shortlist or win has already occurred/i).isVisible());
  check('AWARDS_H_EARTH_DOOR_PRESENT', (await awards.getByText('Enter H-Earth', { exact: true }).getAttribute('href')) === '/showroom/globe/h-earth/');
  await awards.locator('[data-story="governed"]').click();
  check('GOVERNED_STORY_SELECTS', await awards.locator('[data-story="governed"]').getAttribute('aria-selected') === 'true');
  check('GOVERNED_STORY_CONTENT_UPDATES', (await awards.locator('#story-title').textContent())?.trim() === 'Growth does not have to mean losing control.');
  await awards.locator('[data-lens="diagnostic"]').click();
  check('DIAGNOSTIC_LENS_SELECTS', await awards.locator('[data-lens="diagnostic"]').getAttribute('aria-selected') === 'true');
  check('DIAGNOSTIC_LENS_CONTENT_UPDATES', (await awards.locator('#lens-title').textContent())?.trim() === 'Reasoning becomes more useful when you can inspect it.');
  await awards.close();
  await page.close();
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mobilePage = await mobile.newPage();
  captureErrors(mobilePage, 'mobile-candidate');
  await waitForHEarth(mobilePage, CANDIDATE_PATH, 'MOBILE_CANDIDATE');
  check('MOBILE_TROPHY_HERO_VISIBLE', await mobilePage.locator('#h-earth-b10-hero').isVisible());
  check('MOBILE_LENSES_CLOSED_ON_LOAD', await mobilePage.locator('.h-earth-b10-lens[open]').count() === 0);

  const mobileMount = mobilePage.locator('#h-earth-functional-landscape-mount');
  await mobileMount.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(250);
  const mobileBox = await mobileMount.boundingBox();
  check('MOBILE_STAGE_BOUNDS', Boolean(mobileBox && mobileBox.width > 200 && mobileBox.height > 300), mobileBox);
  const mx = mobileBox.x + mobileBox.width * 0.5;
  const my = mobileBox.y + mobileBox.height * 0.45;

  before = await digestCanvas(mobilePage);
  await dispatchTouchSequence(mobilePage, [
    { type: 'touchStart', touchPoints: [{ x: mx, y: my, radiusX: 4, radiusY: 4, force: 1, id: 1 }] },
    { type: 'touchMove', touchPoints: [{ x: mx + 85, y: my + 30, radiusX: 4, radiusY: 4, force: 1, id: 1 }] },
    { type: 'touchEnd', touchPoints: [] }
  ]);
  await mobilePage.waitForTimeout(700);
  after = await digestCanvas(mobilePage);
  check('MOBILE_ONE_FINGER_LOOK', before !== after && await gestureUsed(mobilePage), { before, after });

  before = after;
  const positionBeforeTouchTravel = await mobilePage.locator('#hud-position').textContent();
  await dispatchTouchSequence(mobilePage, [
    { type: 'touchStart', touchPoints: [{ x: mx - 35, y: my + 70, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 35, y: my + 70, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchMove', touchPoints: [{ x: mx - 35, y: my - 65, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 35, y: my - 65, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchEnd', touchPoints: [] }
  ]);
  await mobilePage.waitForTimeout(900);
  after = await digestCanvas(mobilePage);
  const positionAfterTouchTravel = await mobilePage.locator('#hud-position').textContent();
  check('MOBILE_TWO_FINGER_TRAVEL', before !== after || positionBeforeTouchTravel !== positionAfterTouchTravel, { before, after, positionBeforeTouchTravel, positionAfterTouchTravel });

  before = after;
  await dispatchTouchSequence(mobilePage, [
    { type: 'touchStart', touchPoints: [{ x: mx - 25, y: my, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 25, y: my, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchMove', touchPoints: [{ x: mx - 95, y: my, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 95, y: my, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchEnd', touchPoints: [] }
  ]);
  await mobilePage.waitForTimeout(800);
  after = await digestCanvas(mobilePage);
  check('MOBILE_PINCH_ZOOM', before !== after, { before, after });
  await mobile.close();

  check('PAGE_ERRORS_ZERO', pageErrors.length === 0, pageErrors);
  check('CONSOLE_ERRORS_ZERO', consoleErrors.length === 0, consoleErrors);
  check('OWNED_HTTP_ERRORS_ZERO', httpErrors.length === 0, httpErrors);

  const receiptBody = {
    schemaVersion: publicVerificationPerformed
      ? 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_B10_PUBLIC_BROWSER_RECEIPT_v1'
      : 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_B10_LOCAL_BROWSER_RECEIPT_v1',
    checkpoint: 'B10_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION',
    status: 'PASS_CLOSED',
    candidateHead,
    candidateId: CANDIDATE_ID,
    origin: ORIGIN,
    publicVerificationPerformed,
    candidateUrl: `${ORIGIN}${CANDIDATE_PATH}`,
    baselineUrl: `${ORIGIN}${BASELINE_PATH}`,
    awardsUrl: `${ORIGIN}${AWARDS_PATH}`,
    baselinePublicDefaultUnchanged: true,
    productAccepted: false,
    defaultPromoted: false,
    newUserDifferentialRequired: true,
    assertionCount: assertions.length,
    failedAssertionCount: assertions.filter((entry) => !entry.pass).length,
    pageErrors,
    consoleErrors,
    httpErrors,
    assertions
  };
  const receiptSha256 = sha256(JSON.stringify(receiptBody));
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2)}\n`);
  console.log(JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2));
} catch (error) {
  const receiptBody = {
    schemaVersion: publicVerificationPerformed
      ? 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_B10_PUBLIC_BROWSER_RECEIPT_v1'
      : 'H_EARTH_PUBLIC_FACE_TROPHY_STANDARD_B10_LOCAL_BROWSER_RECEIPT_v1',
    checkpoint: 'B10_PUBLIC_FACE_TROPHY_STANDARD_RECONCILIATION',
    status: 'FAIL',
    candidateHead,
    candidateId: CANDIDATE_ID,
    origin: ORIGIN,
    publicVerificationPerformed,
    assertionCount: assertions.length,
    failedAssertionCount: Math.max(1, assertions.filter((entry) => !entry.pass).length),
    error: { message: error.message, stack: error.stack ?? null },
    pageErrors,
    consoleErrors,
    httpErrors,
    assertions
  };
  const receiptSha256 = sha256(JSON.stringify(receiptBody));
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify({ ...receiptBody, receiptSha256 }, null, 2)}\n`);
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}