import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const url = `http://127.0.0.1:4188${process.env.PREVIEW_URL_PATH}`;
const out = path.join(process.env.RUNNER_TEMP, 'proof');
const assert = (value, code, detail = null) => {
  if (!value) {
    const error = new Error(code);
    error.detail = detail;
    throw error;
  }
};
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const touch = async (page, steps) => page.evaluate(async sequence => {
  const canvas = document.getElementById('complete-world-canvas');
  for (const step of sequence) {
    for (const point of step.p) {
      const up = step.t === 'pointerup';
      canvas.dispatchEvent(new PointerEvent(step.t, {
        bubbles: true,
        cancelable: true,
        pointerId: point.id,
        pointerType: 'touch',
        isPrimary: point.id === 1,
        clientX: point.x,
        clientY: point.y,
        buttons: up ? 0 : 1,
        pressure: up ? 0 : 0.5
      }));
    }
    await new Promise(resolve => setTimeout(resolve, step.w ?? 80));
  }
}, steps);

async function executeInput(page, mobile) {
  if (!mobile) {
    const box = await page.locator('#complete-world-canvas').boundingBox();
    assert(box, 'CANVAS_BOX_MISSING');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 120, y, { steps: 12 });
    await page.mouse.up();
    await page.mouse.wheel(0, -240);
    await sleep(250);
    return;
  }

  await touch(page, [
    { t: 'pointerdown', p: [{ id: 1, x: 110, y: 220 }] },
    { t: 'pointermove', p: [{ id: 1, x: 205, y: 220 }], w: 380 },
    { t: 'pointerup', p: [{ id: 1, x: 205, y: 220 }] }
  ]);
  await touch(page, [
    { t: 'pointerdown', p: [{ id: 1, x: 105, y: 360 }, { id: 2, x: 225, y: 360 }] },
    { t: 'pointermove', p: [{ id: 1, x: 105, y: 275 }, { id: 2, x: 225, y: 275 }], w: 420 },
    { t: 'pointerup', p: [{ id: 1, x: 105, y: 275 }, { id: 2, x: 225, y: 275 }] }
  ]);
  await touch(page, [
    { t: 'pointerdown', p: [{ id: 1, x: 125, y: 330 }, { id: 2, x: 205, y: 330 }] },
    { t: 'pointermove', p: [{ id: 1, x: 70, y: 330 }, { id: 2, x: 260, y: 330 }], w: 420 },
    { t: 'pointerup', p: [{ id: 1, x: 70, y: 330 }, { id: 2, x: 260, y: 330 }] }
  ]);
}

async function scenario(browser, config) {
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: config.dpr,
    isMobile: config.mobile,
    hasTouch: config.mobile
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const httpFailures = [];

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => requestFailures.push({
    url: request.url(),
    failure: request.failure()
  }));
  page.on('response', response => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
      httpFailures.push({ url: response.url(), status: response.status() });
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => {
      const state = window.H_EARTH_C2_R1_COMPLETE_WORLD;
      return state?.ready === true || state?.failed === true;
    }, null, { timeout: 120000, polling: 250 });

    const runtime = await page.evaluate(() => {
      const state = window.H_EARTH_C2_R1_COMPLETE_WORLD;
      return state.failed
        ? { failed: true, receipt: state.getFailureReceipt() }
        : { failed: false, receipt: state.getReceipt() };
    });
    if (runtime.failed) {
      throw Object.assign(
        new Error(`RUNTIME_FAILED:${runtime.receipt.rootRejectionCode}`),
        { detail: runtime.receipt }
      );
    }

    await page.waitForFunction(
      () => window.H_EARTH_C2_R1_PREVIEW_CORRESPONDENCE?.status === 'PASS',
      null,
      { timeout: 120000, polling: 250 }
    );

    const before = runtime.receipt;
    assert(
      before.packageIdentity === 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE',
      'PACKAGE_IDENTITY_MISMATCH',
      before.packageIdentity
    );
    assert(
      before.packageContentDigest === 'fnv1a32:218f37ae',
      'PACKAGE_CONTENT_DIGEST_MISMATCH',
      before.packageContentDigest
    );
    assert(before.packageBinding.counters.candidateSampleFailureCount === 0, 'CANDIDATE_SAMPLE_FAILURES');
    assert(before.packageBinding.counters.boundTerrainVertexCount === 10419, 'BOUND_TERRAIN_VERTEX_COUNT');
    assert(before.packageBinding.counters.boundShorelineVertexCount === 299, 'BOUND_SHORELINE_VERTEX_COUNT');
    assert(before.renderer.counters.contextCreationCount === 1, 'WEBGL2_CONTEXT_COUNT');
    assert(before.renderer.counters.rendererInitializationCount === 1, 'RENDERER_INITIALIZATION_COUNT');

    await executeInput(page, config.mobile);
    const after = await page.evaluate(() => window.H_EARTH_C2_R1_COMPLETE_WORLD.getReceipt());

    assert(
      after.renderer.counters.visiblePresentationCount > before.renderer.counters.visiblePresentationCount,
      'VISIBLE_FRAMES_NOT_ADVANCED',
      { before: before.renderer.counters, after: after.renderer.counters }
    );
    assert(
      after.intake.counters.navigationProposalCount > before.intake.counters.navigationProposalCount,
      'CAMERA_NAVIGATION_NOT_RESPONSIVE',
      { before: before.intake.counters, after: after.intake.counters }
    );

    if (config.mobile) {
      assert(after.intake.counters.touchPointerEventCount > before.intake.counters.touchPointerEventCount, 'TOUCH_NOT_RECORDED');
      assert(after.intake.counters.oneFingerLookProposalCount > before.intake.counters.oneFingerLookProposalCount, 'LOOK_NOT_RECORDED');
      assert(after.intake.counters.twoFingerTravelProposalCount > before.intake.counters.twoFingerTravelProposalCount, 'TRAVEL_NOT_RECORDED');
      assert(after.intake.counters.pinchProposalCount > before.intake.counters.pinchProposalCount, 'PINCH_NOT_RECORDED');
      assert(after.intake.counters.releaseTerminationCount > before.intake.counters.releaseTerminationCount, 'RELEASE_NOT_RECORDED');
    } else {
      assert(after.intake.counters.mousePointerEventCount > before.intake.counters.mousePointerEventCount, 'MOUSE_NOT_RECORDED');
      assert(after.intake.counters.oneFingerLookProposalCount > before.intake.counters.oneFingerLookProposalCount, 'DESKTOP_LOOK_NOT_RECORDED');
      assert(after.intake.counters.wheelEventCount > before.intake.counters.wheelEventCount, 'WHEEL_NOT_RECORDED');
    }

    assert(consoleErrors.length === 0, 'CONSOLE_ERRORS', consoleErrors);
    assert(pageErrors.length === 0, 'PAGE_ERRORS', pageErrors);
    assert(requestFailures.length === 0, 'REQUEST_FAILURES', requestFailures);
    assert(httpFailures.length === 0, 'HTTP_FAILURES', httpFailures);

    await page.screenshot({ path: path.join(out, `${config.name}.png`), fullPage: true });
    const receipt = {
      receiptType: 'H_EARTH_C2_R1_IMMUTABLE_PREVIEW_LOCAL_SCENARIO_v1',
      name: config.name,
      url,
      before,
      after,
      correspondence: await page.evaluate(() => window.H_EARTH_C2_R1_PREVIEW_CORRESPONDENCE),
      consoleErrors,
      pageErrors,
      requestFailures,
      httpFailures
    };
    fs.writeFileSync(path.join(out, `${config.name}.json`), JSON.stringify(receipt, null, 2));
    return receipt;
  } catch (error) {
    fs.writeFileSync(
      path.join(out, `${config.name}-failure.json`),
      JSON.stringify({
        error: { name: error.name, message: error.message, detail: error.detail ?? null },
        consoleErrors,
        pageErrors,
        requestFailures,
        httpFailures
      }, null, 2)
    );
    throw error;
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage']
});

try {
  const configurations = [
    { name: 'desktop-1440x900', viewport: { width: 1440, height: 900 }, dpr: 1, mobile: false },
    { name: 'mobile-412x915', viewport: { width: 412, height: 915 }, dpr: 2.625, mobile: true },
    { name: 'mobile-390x844', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true }
  ];
  const receipts = [];
  for (const configuration of configurations) {
    receipts.push(await scenario(browser, configuration));
  }
  fs.writeFileSync(
    path.join(out, 'local-preview-summary.json'),
    JSON.stringify({
      status: 'PASS',
      sourceHead: process.env.SOURCE_HEAD,
      previewPath: process.env.PREVIEW_URL_PATH,
      scenarios: receipts.map(receipt => receipt.name)
    }, null, 2)
  );
} finally {
  await browser.close();
}
