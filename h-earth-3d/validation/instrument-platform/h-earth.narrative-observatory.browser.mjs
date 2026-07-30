import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const ORIGIN = process.env.H_EARTH_OBSERVATORY_ORIGIN || 'http://127.0.0.1:4186';
const CANDIDATE_ID = 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001';
const CANDIDATE_PATH = `/showroom/globe/h-earth/?candidate=${CANDIDATE_ID}`;
const OBSERVATORY_PATH = `/showroom/globe/h-earth/observatory/?candidate=${CANDIDATE_ID}`;
const candidateHead = process.env.CANDIDATE_HEAD || 'LOCAL_CANDIDATE';
const publicVerificationPerformed = ORIGIN.startsWith('https://');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const assertions = [];
const pageErrors = [];
const consoleErrors = [];
const httpErrors = [];

const check = (id, condition, detail = null) => {
  assertions.push({ id, pass: Boolean(condition), detail });
  if (!condition) throw new Error(`${id}:${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};
const captureErrors = (page, label) => {
  page.on('pageerror', (error) => pageErrors.push({ label, message: error.message, stack: error.stack ?? null }));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push({ label, text: message.text() });
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(ORIGIN)) httpErrors.push({ label, status: response.status(), url: response.url() });
  });
};
const digestCanvas = async (page) => sha256(await page.locator('#h-earth-functional-landscape-canvas').screenshot({ type: 'png' }));
const waitForHEarth = async (page, path = CANDIDATE_PATH) => {
  await page.goto(`${ORIGIN}${path}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.locator('#h-earth-functional-landscape-canvas').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForFunction(() => {
    const route = document.getElementById('h-earth-functional-landscape-route');
    const startup = document.getElementById('h-earth-startup-result')?.textContent ?? '';
    return route?.dataset.run8eReady === 'true' || startup.includes('PASS');
  }, null, { timeout: 180000 });
  await page.waitForTimeout(700);
};
const changed = (before, after) => before !== after;
const gestureUsed = async (page) => page.evaluate(() => {
  const nodes = [document.getElementById('h-earth-3d-route-root'), document.getElementById('h-earth-functional-landscape-route')];
  return nodes.some((node) => node?.dataset.gestureUsed === 'true');
});
const dispatchTouchSequence = async (page, frames) => {
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  for (const frame of frames) {
    await client.send('Input.dispatchTouchEvent', frame);
    await page.waitForTimeout(frame.type === 'touchMove' ? 90 : 60);
  }
};

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--no-sandbox']
});

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const page = await desktop.newPage();
  captureErrors(page, 'desktop');

  const observatoryResponse = await page.goto(`${ORIGIN}${OBSERVATORY_PATH}`, { waitUntil: 'networkidle', timeout: 120000 });
  check('OBSERVATORY_ROUTE_REACHABLE', observatoryResponse?.ok() === true, observatoryResponse?.status());
  await page.waitForFunction(() => document.documentElement.dataset.observatoryContract === 'PASS', null, { timeout: 30000 });
  check('OBSERVATORY_ROUTE_IDENTITY', await page.locator('html').getAttribute('data-observatory') === 'THE_H_EARTH_OBSERVATORY');
  check('OBSERVATORY_CANDIDATE_IDENTITY', await page.locator('html').getAttribute('data-observatory-candidate') === 'active');
  check('SEVEN_SECTION_STRUCTURE', await page.locator('[data-observatory-section]').count() === 7);
  check('READ_ONLY_REPLAY_EIGHT_CHAPTERS', await page.locator('[data-replay-chapter]').count() === 8);
  check('SPECIALIZED_DESTINATIONS_FOUR', await page.locator('[data-destination="H_EARTH_GAUGES"], [data-destination="FD_05"], [data-destination="RUN_8E_R1_PROFILER"], [data-destination="TERRAIN_WORKBENCH"]').count() === 4);
  check('TECHNICAL_EVIDENCE_OPTIONAL', !(await page.locator('#technical-evidence-disclosure').evaluate((node) => node.open)));
  check('SESSION_REPLAY_OPTIONAL', !(await page.locator('#session-replay-disclosure').evaluate((node) => node.open)));
  check('NO_DIAGNOSTIC_AUTO_LAUNCH', await page.locator('iframe').count() === 0 && await page.locator('html').getAttribute('data-diagnostic-auto-launch') === 'false');
  check('RETURN_TO_H_EARTH_PERSISTENT', await page.locator('a.persistent-return').count() === 1);
  const returnHref = await page.locator('a.persistent-return').getAttribute('href');
  check('RETURN_PRESERVES_CANDIDATE_IDENTITY', returnHref?.includes(`candidate=${CANDIDATE_ID}`), returnHref);
  await page.locator('#session-replay-disclosure > summary').click();
  check('SESSION_REPLAY_DISCLOSURE_OPENS', await page.locator('#session-replay-disclosure').evaluate((node) => node.open));
  await page.locator('#technical-evidence-disclosure > summary').click();
  check('TECHNICAL_DISCLOSURE_OPENS', await page.locator('#technical-evidence-disclosure').evaluate((node) => node.open));
  check('UNIFIED_PLATFORM_ONE_LEVEL_DEEP', await page.locator('[data-destination="UNIFIED_INSTRUMENT_PLATFORM"]').count() === 1);
  check('SPECIALIZED_DIAGNOSTICS_SECOND_LEVEL', await page.locator('[data-disclosure-sequence="SPECIALIZED_DIAGNOSTICS"]').count() === 1);

  const baselinePage = await desktop.newPage();
  captureErrors(baselinePage, 'baseline-default');
  await baselinePage.goto(`${ORIGIN}/showroom/globe/h-earth/`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  check('BASELINE_PUBLIC_DEFAULT_GATE_INACTIVE', await baselinePage.locator('html').getAttribute('data-h-earth-observatory-candidate') === 'inactive');
  check('BASELINE_DIRECT_FD05_VISIBLE', await baselinePage.locator('#h-earth-3d-diagnostic-link').isVisible());
  check('BASELINE_OBSERVATORY_ENTRY_HIDDEN', await baselinePage.locator('#h-earth-observatory-link').isHidden());
  await baselinePage.close();

  await waitForHEarth(page, CANDIDATE_PATH);
  check('CANDIDATE_GATE_ACTIVE', await page.locator('html').getAttribute('data-h-earth-observatory-candidate') === 'active');
  check('CANDIDATE_OBSERVATORY_ENTRY_VISIBLE', await page.locator('#h-earth-observatory-link').isVisible());
  check('CANDIDATE_DIRECT_FD05_HIDDEN', await page.locator('#h-earth-3d-diagnostic-link').isHidden());
  check('H_EARTH_RUNTIME_STARTUP', (await page.locator('#h-earth-startup-result').textContent())?.includes('PASS') || await page.locator('#h-earth-functional-landscape-route').getAttribute('data-run8e-ready') === 'true');
  check('LIVE_CANVAS', await page.locator('#h-earth-functional-landscape-canvas').isVisible());
  check('LIVE_RUNTIME_DIAGNOSTICS', await page.locator('details.h-earth-runtime-diagnostics').count() === 1);
  check('RENDERER_STARTUP_RECEIPT', await page.locator('details.h-earth-startup-receipt').count() === 1);
  check('ENVIRONMENT_DETAILS', await page.locator('details.h-earth-live-details').count() === 1);

  const mount = page.locator('#h-earth-functional-landscape-mount');
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
  check('POINTER_DRAG_LOOK', changed(before, after) && await gestureUsed(page), { before, after });

  before = after;
  const positionBeforeWheel = await page.locator('#hud-position').textContent();
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -520);
  await page.waitForTimeout(700);
  after = await digestCanvas(page);
  const positionAfterWheel = await page.locator('#hud-position').textContent();
  check('MOUSE_WHEEL_FORWARD_BACKWARD_TRAVEL', changed(before, after) || positionBeforeWheel !== positionAfterWheel, { positionBeforeWheel, positionAfterWheel, before, after });

  before = after;
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -460);
  await page.keyboard.up('Control');
  await page.waitForTimeout(700);
  after = await digestCanvas(page);
  check('CTRL_PLUS_WHEEL_ZOOM', changed(before, after), { before, after });
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mobilePage = await mobile.newPage();
  captureErrors(mobilePage, 'mobile');
  await waitForHEarth(mobilePage, CANDIDATE_PATH);
  const mobileMount = mobilePage.locator('#h-earth-functional-landscape-mount');
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
  check('ONE_FINGER_LOOK', changed(before, after) && await gestureUsed(mobilePage), { before, after });

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
  check('TWO_FINGER_FORWARD_BACKWARD_TRAVEL', changed(before, after) || positionBeforeTouchTravel !== positionAfterTouchTravel, { positionBeforeTouchTravel, positionAfterTouchTravel, before, after });

  before = after;
  await dispatchTouchSequence(mobilePage, [
    { type: 'touchStart', touchPoints: [{ x: mx - 25, y: my, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 25, y: my, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchMove', touchPoints: [{ x: mx - 95, y: my, radiusX: 4, radiusY: 4, force: 1, id: 1 }, { x: mx + 95, y: my, radiusX: 4, radiusY: 4, force: 1, id: 2 }] },
    { type: 'touchEnd', touchPoints: [] }
  ]);
  await mobilePage.waitForTimeout(800);
  after = await digestCanvas(mobilePage);
  check('PINCH_ZOOM', changed(before, after), { before, after });
  await mobile.close();

  const reachability = [
    ['UNIFIED_INSTRUMENT_PLATFORM', '/h-earth-3d/tools/instrument-platform/', 'H-Earth Unified Instrument Platform'],
    ['H_EARTH_GAUGES', '/gauges/h-earth/', 'H-Earth Current-Authority Gauge'],
    ['FD_05', '/showroom/globe/h-earth/diagnostic/', 'H-Earth FD_05 Diagnostic Authority'],
    ['RUN_8E_R1_PROFILER', '/showroom/globe/h-earth/diagnostic/run8e-r1/', 'Run 8E'],
    ['TERRAIN_WORKBENCH', '/h-earth-3d/tools/terrain-workbench/', 'Terrain']
  ];
  const probeContext = await browser.newContext({ viewport: { width: 1024, height: 800 } });
  for (const [id, route, titleFragment] of reachability) {
    const probe = await probeContext.newPage();
    captureErrors(probe, `probe:${id}`);
    const response = await probe.goto(`${ORIGIN}${route}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    check(`${id}_REACHABLE`, response?.ok() === true, response?.status());
    check(`${id}_TITLE`, (await probe.title()).toLowerCase().includes(titleFragment.toLowerCase()), await probe.title());
    await probe.close();
  }
  await probeContext.close();

  check('PAGE_ERRORS_ZERO', pageErrors.length === 0, pageErrors);
  check('UNEXPECTED_CONSOLE_ERRORS_ZERO', consoleErrors.length === 0, consoleErrors);
  check('CANDIDATE_OWNED_HTTP_FAILURES_ZERO', httpErrors.length === 0, httpErrors);

  const receiptBody = {
    schemaVersion: publicVerificationPerformed
      ? 'H_EARTH_NARRATIVE_OBSERVATORY_B8_PUBLIC_BROWSER_RECEIPT_v1'
      : 'H_EARTH_NARRATIVE_OBSERVATORY_B6_BROWSER_RECEIPT_v1',
    status: 'PASS_CLOSED',
    candidateHead,
    origin: ORIGIN,
    publicVerificationPerformed,
    candidateId: CANDIDATE_ID,
    candidateUrl: `${ORIGIN}${CANDIDATE_PATH}`,
    observatoryUrl: `${ORIGIN}${OBSERVATORY_PATH}`,
    baselineDefaultUrl: `${ORIGIN}/showroom/globe/h-earth/`,
    baselinePublicDefaultUnchanged: true,
    userDifferentialRecorded: false,
    defaultPromoted: false,
    assertionCount: assertions.length,
    failedAssertionCount: assertions.filter((entry) => !entry.pass).length,
    pageErrors,
    consoleErrors,
    httpErrors,
    assertions
  };
  const receipt = { ...receiptBody, receiptSha256: sha256(JSON.stringify(receiptBody)) };
  const outputPath = process.env.H_EARTH_OBSERVATORY_B6_RECEIPT || '/tmp/h-earth-narrative-observatory-b6.browser.receipt.json';
  fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
  const checkpoint = publicVerificationPerformed ? 'B8_PUBLIC' : 'B6';
  console.log(`H_EARTH_NARRATIVE_OBSERVATORY_${checkpoint}_PASS:${candidateHead}:${receipt.receiptSha256}:${assertions.length}`);
} finally {
  await browser.close();
}
