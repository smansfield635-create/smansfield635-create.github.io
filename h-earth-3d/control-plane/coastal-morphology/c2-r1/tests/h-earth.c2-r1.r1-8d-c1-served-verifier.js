import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

async function openReadyPage({ context, carrier, reviewDocument, productAuthorityHead, expectedAsset }) {
  const page = await context.newPage();
  const errors = { page: [], console: [], requests: [], responses: [], failures: [] };
  page.on('pageerror', error => errors.page.push(String(error?.stack || error)));
  page.on('console', message => { if (message.type() === 'error') errors.console.push(message.text()); });
  page.on('request', request => errors.requests.push(request.url()));
  page.on('response', response => errors.responses.push({ url: response.url(), status: response.status() }));
  page.on('requestfailed', request => errors.failures.push({ url: request.url(), failure: request.failure() }));
  const url = new URL(reviewDocument, carrier.baseUrl).href;
  const started = performance.now();
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (response?.status() !== 200) throw Object.assign(new Error('SERVED_REVIEW_DOCUMENT_NOT_HTTP_200'), { detail: response?.status() });
  await page.waitForFunction(() => document.documentElement.dataset.r1_8Review === 'ready', null, { timeout: 60000 });
  const readyDurationMs = performance.now() - started;
  if (readyDurationMs >= 60000) throw Object.assign(new Error('SERVED_READY_SENTINEL_EXCEEDED_60_SECONDS'), { detail: readyDurationMs });
  const receipt = await page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW?.getReceipt?.());
  const checks = [
    [receipt?.sourceHead === productAuthorityHead, 'SERVED_SOURCE_HEAD_MISMATCH', receipt?.sourceHead],
    [receipt?.webgl2ContextEstablished === true, 'SERVED_WEBGL2_CONTEXT_NOT_ESTABLISHED'],
    [receipt?.meshReady === true, 'SERVED_CANDIDATE_WORLD_NOT_LOADED'],
    [receipt?.exactReviewGeometryPreserved === true, 'SERVED_EXACT_REVIEW_GEOMETRY_NOT_PRESERVED'],
    [receipt?.meshIdentity?.vertexCount === expectedAsset.vertexCount, 'SERVED_VERTEX_COUNT_MISMATCH', receipt?.meshIdentity?.vertexCount],
    [receipt?.meshIdentity?.indexCount === expectedAsset.indexCount, 'SERVED_INDEX_COUNT_MISMATCH', receipt?.meshIdentity?.indexCount],
    [receipt?.asset?.byteLength === expectedAsset.byteLength, 'SERVED_ASSET_BYTE_LENGTH_MISMATCH', receipt?.asset?.byteLength],
    [receipt?.asset?.sha256 === expectedAsset.sha256, 'SERVED_ASSET_SHA256_MISMATCH', receipt?.asset?.sha256],
    [receipt?.noBitmapDragFallback === true, 'SERVED_BITMAP_DRAG_FALLBACK_PRESENT']
  ];
  for (const [condition, code, detail] of checks) {
    if (!condition) throw Object.assign(new Error(code), { detail });
  }
  return { page, url, receipt, readyDurationMs, errors };
}

export async function verifyServedOccurrence({
  browser,
  carrier,
  reviewDocument,
  productAuthorityHead,
  expectedAsset,
  captureRoot,
  repositoryRoot,
  candidateBytesHead,
  views
}) {
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  const desktop = await openReadyPage({ context: desktopContext, carrier, reviewDocument, productAuthorityHead, expectedAsset });
  const canvas = desktop.page.locator('#r18-review-canvas');
  const box = await canvas.boundingBox();
  if (!(box && box.width > 200 && box.height > 300)) throw Object.assign(new Error('SERVED_REVIEW_CANVAS_NOT_VISIBLE'), { detail: box });
  const beforeFrames = desktop.receipt.frameCount;
  await desktop.page.waitForTimeout(650);
  const afterFrames = await desktop.page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt().frameCount);
  if (afterFrames <= beforeFrames + 2) throw Object.assign(new Error('SERVED_LIVE_FRAME_ADVANCEMENT_NOT_CONFIRMED'), { detail: { beforeFrames, afterFrames } });
  await desktop.page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.48);
  await desktop.page.mouse.down();
  await desktop.page.mouse.move(box.x + box.width * 0.61, box.y + box.height * 0.42, { steps: 8 });
  await desktop.page.mouse.up();
  await desktop.page.mouse.wheel(0, 160);
  await desktop.page.waitForTimeout(250);
  const desktopInteracted = await desktop.page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt());
  if (desktopInteracted.cameraRevision <= desktop.receipt.camera.revision) throw new Error('SERVED_DESKTOP_CAMERA_RESPONSE_NOT_FUNCTIONAL');
  if (!(desktopInteracted.navigationEventCount > 0 || desktopInteracted.pointerEventCount > 2)) throw new Error('SERVED_DESKTOP_NAVIGATION_NOT_FUNCTIONAL');
  const captures = [];
  fs.mkdirSync(captureRoot, { recursive: true });
  for (const view of views) {
    await desktop.page.evaluate(viewId => window.H_EARTH_C2_R1_R1_8_REVIEW.setView(viewId), view);
    await desktop.page.waitForTimeout(450);
    const camera = await desktop.page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getCameraSnapshot());
    const file = path.join(captureRoot, `${view.toLowerCase().replaceAll('_', '-')}.png`);
    await canvas.screenshot({ path: file, type: 'png' });
    const viewport = await desktop.page.evaluate(() => {
      const element = document.getElementById('r18-review-canvas');
      return {
        cssWidth: element.clientWidth,
        cssHeight: element.clientHeight,
        pixelWidth: element.width,
        pixelHeight: element.height,
        devicePixelRatio: window.devicePixelRatio
      };
    });
    captures.push({
      identity: view,
      file: path.relative(repositoryRoot, file).split(path.sep).join('/'),
      sha256: sha256(fs.readFileSync(file)),
      exactCandidateBytesHead: candidateBytesHead,
      servedOccurrence: desktop.url,
      camera,
      viewport,
      deviceOrBrowser: {
        browser: 'Chromium',
        browserVersion: browser.version(),
        userAgent: await desktop.page.evaluate(() => navigator.userAgent)
      }
    });
  }
  if (captures.length !== 6) throw Object.assign(new Error('SIX_REPRESENTATIVE_CAPTURES_NOT_CREATED'), { detail: captures.length });
  if (desktop.errors.page.length || desktop.errors.console.length || desktop.errors.failures.length) throw Object.assign(new Error('SERVED_DESKTOP_FATAL_ERROR_PRESENT'), { detail: desktop.errors });
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
  });
  const mobile = await openReadyPage({ context: mobileContext, carrier, reviewDocument, productAuthorityHead, expectedAsset });
  await mobile.page.evaluate(() => {
    const canvas = document.getElementById('r18-review-canvas');
    const rect = canvas.getBoundingClientRect();
    const fire = (type, pointerId, x, y, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType: 'touch',
      isPrimary: pointerId === 1,
      clientX: rect.left + x,
      clientY: rect.top + y,
      buttons
    }));
    fire('pointerdown', 1, rect.width * 0.42, rect.height * 0.48, 1);
    fire('pointermove', 1, rect.width * 0.58, rect.height * 0.43, 1);
    fire('pointerup', 1, rect.width * 0.58, rect.height * 0.43, 0);
    fire('pointerdown', 1, rect.width * 0.4, rect.height * 0.48, 1);
    fire('pointerdown', 2, rect.width * 0.6, rect.height * 0.48, 1);
    fire('pointermove', 1, rect.width * 0.4, rect.height * 0.39, 1);
    fire('pointermove', 2, rect.width * 0.6, rect.height * 0.39, 1);
    fire('pointerup', 1, rect.width * 0.4, rect.height * 0.39, 0);
    fire('pointerup', 2, rect.width * 0.6, rect.height * 0.39, 0);
  });
  await mobile.page.waitForTimeout(300);
  const mobileInteracted = await mobile.page.evaluate(() => window.H_EARTH_C2_R1_R1_8_REVIEW.getReceipt());
  if (!(mobileInteracted.touchEventCount > 0)) throw new Error('SERVED_TOUCH_RESPONSE_NOT_CONFIRMED');
  if (mobileInteracted.cameraRevision <= mobile.receipt.camera.revision) throw new Error('SERVED_MOBILE_CAMERA_RESPONSE_NOT_FUNCTIONAL');
  if (mobile.errors.page.length || mobile.errors.console.length || mobile.errors.failures.length) throw Object.assign(new Error('SERVED_MOBILE_FATAL_ERROR_PRESENT'), { detail: mobile.errors });
  await mobileContext.close();

  return {
    servedOccurrence: desktop.url,
    browserVersion: browser.version(),
    desktop: {
      readyDurationMs: desktop.readyDurationMs,
      initialReceipt: desktop.receipt,
      interactedReceipt: desktopInteracted,
      frameAdvancement: { beforeFrames, afterFrames, delta: afterFrames - beforeFrames },
      errors: desktop.errors
    },
    mobileReferenceEmulation: {
      readyDurationMs: mobile.readyDurationMs,
      initialReceipt: mobile.receipt,
      interactedReceipt: mobileInteracted,
      errors: mobile.errors,
      device: 'Android 16 SM-S948U reference-device emulation'
    },
    captures
  };
}
