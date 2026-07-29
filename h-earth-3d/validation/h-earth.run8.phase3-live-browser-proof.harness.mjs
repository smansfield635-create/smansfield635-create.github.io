import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const repository = 'smansfield635-create/smansfield635-create.github.io';
const branch = 'agent/h-earth-touch-motion-cp4-calibration-testing-001';
const sourceHead = '9ce2b2ef9078d99c93f847957479e37c41f83a53';
const materializationHead = '83e15166dafcab2b3718e4f2069c87d2afa11a59';
const previewPath = 'h-earth-3d/control-plane/touch-motion-calibration/cp4-0b-three-file-preview';
const previewUrl = `https://rawcdn.githack.com/${repository}/${materializationHead}/${previewPath}/index.html`;
const harnessPath = 'h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.harness.mjs';
const receiptPath = 'h-earth-3d/control-plane/touch-motion-calibration/h-earth.touch-motion-calibration.cp4-0c-non-live-preview-publication.receipt.json';
const outputDirectory = process.env.H_EARTH_PHASE3_OUTPUT ?? '/tmp/h-earth-run8-phase3-live-browser-proof';

await fs.mkdir(outputDirectory, { recursive: true });

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
const requestUrls = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  screen: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
});

await context.addCookies([{
  name: '__Http-phish',
  value: '1',
  url: 'https://rawcdn.githack.com/',
  secure: true,
  httpOnly: true,
  sameSite: 'None'
}]);

const page = await context.newPage();
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(String(error?.stack ?? error)));
page.on('request', (request) => requestUrls.push(request.url()));
page.on('requestfailed', (request) => {
  failedRequests.push({
    url: request.url(),
    failure: request.failure()?.errorText ?? null
  });
});

const response = await page.goto(previewUrl, {
  waitUntil: 'domcontentloaded',
  timeout: 120000
});
assert.ok(response, 'CP4_0C_REMOTE_NAVIGATION_RESPONSE_MISSING');
assert.equal(response.status(), 200, `CP4_0C_REMOTE_HTTP_STATUS_${response.status()}`);
const responseHeaders = await response.allHeaders();
assert.match(responseHeaders['content-type'] ?? '', /text\/html/i, 'CP4_0C_REMOTE_CONTENT_TYPE_NOT_HTML');

await page.waitForSelector('canvas', { state: 'attached', timeout: 60000 });
await page.waitForTimeout(12000);

const runtimeSnapshot = await page.evaluate(() => {
  const canvases = Array.from(document.querySelectorAll('canvas'));
  const canvasRecords = [];
  let webgl2ContextCount = 0;

  for (const [index, canvas] of canvases.entries()) {
    let webgl2 = false;
    let centerPixel = null;
    try {
      const gl = canvas.getContext('webgl2');
      webgl2 = Boolean(gl);
      if (gl) {
        webgl2ContextCount += 1;
        const pixel = new Uint8Array(4);
        const x = Math.max(0, Math.floor(gl.drawingBufferWidth / 2));
        const y = Math.max(0, Math.floor(gl.drawingBufferHeight / 2));
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        centerPixel = Array.from(pixel);
      }
    } catch (error) {
      centerPixel = { error: String(error) };
    }
    canvasRecords.push({
      index,
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
      webgl2,
      centerPixel
    });
  }

  const rootDataset = { ...document.documentElement.dataset };
  const bodyDataset = document.body ? { ...document.body.dataset } : {};
  const matchingGlobals = Object.getOwnPropertyNames(window)
    .filter((name) => /H_EARTH|RUN_8E|RUN8E/i.test(name))
    .sort();
  const resources = performance.getEntriesByType('resource').map((entry) => ({
    name: entry.name,
    initiatorType: entry.initiatorType,
    transferSize: entry.transferSize,
    decodedBodySize: entry.decodedBodySize
  }));

  return {
    title: document.title,
    readyState: document.readyState,
    locationHref: location.href,
    rootDataset,
    bodyDataset,
    matchingGlobals,
    resources,
    canvasRecords,
    webgl2ContextCount,
    navigator: {
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints,
      platform: navigator.platform
    },
    media: {
      coarsePointer: matchMedia('(pointer: coarse)').matches,
      portrait: matchMedia('(orientation: portrait)').matches
    }
  };
});

const screenshotPath = path.join(outputDirectory, 'cp4-0c-remote-preview-samsung-class.png');
await page.screenshot({ path: screenshotPath, fullPage: false });
const screenshotBytes = await fs.readFile(screenshotPath);
const screenshotSha256 = crypto.createHash('sha256').update(screenshotBytes).digest('hex');

await browser.close();

assert.equal(consoleErrors.length, 0, `CP4_0C_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
assert.equal(pageErrors.length, 0, `CP4_0C_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
assert.equal(failedRequests.length, 0, `CP4_0C_FAILED_REQUESTS:${JSON.stringify(failedRequests)}`);
assert.ok(runtimeSnapshot.canvasRecords.length >= 1, 'CP4_0C_CANVAS_MISSING');
assert.ok(runtimeSnapshot.canvasRecords.some((canvas) => canvas.width > 0 && canvas.height > 0), 'CP4_0C_CANVAS_ZERO_SIZED');
assert.ok(runtimeSnapshot.webgl2ContextCount >= 1, 'CP4_0C_WEBGL2_CONTEXT_MISSING');
assert.ok(runtimeSnapshot.navigator.maxTouchPoints >= 1, 'CP4_0C_TOUCH_CAPABILITY_MISSING');
assert.equal(runtimeSnapshot.media.coarsePointer, true, 'CP4_0C_COARSE_POINTER_NOT_ACTIVE');
assert.equal(runtimeSnapshot.media.portrait, true, 'CP4_0C_PORTRAIT_VIEWPORT_NOT_ACTIVE');

const networkUrls = Array.from(new Set(requestUrls.filter((url) => /^https?:/i.test(url))));
const networkHosts = Array.from(new Set(networkUrls.map((url) => new URL(url).host))).sort();
assert.deepEqual(networkHosts, ['rawcdn.githack.com'], `CP4_0C_EXTERNAL_BROWSER_HOSTS:${JSON.stringify(networkHosts)}`);

const resourceUrls = runtimeSnapshot.resources.map((entry) => entry.name);
assert.ok(resourceUrls.some((url) => url.endsWith('/preview.css')), 'CP4_0C_PREVIEW_CSS_NOT_REQUESTED');
assert.ok(resourceUrls.some((url) => url.endsWith('/preview.js')), 'CP4_0C_PREVIEW_JS_NOT_REQUESTED');

const receipt = {
  artifactId: 'H_EARTH_TOUCH_MOTION_CALIBRATION_CP4_0C_NON_LIVE_PREVIEW_PUBLICATION_RECEIPT_v1',
  checkpoint: 'CP4_0C_NON_LIVE_PREVIEW_PUBLICATION',
  status: 'PASS_CLOSED',
  sourceHead,
  materializationHead,
  publicationModel: 'COMMIT_PINNED_ISOLATED_STATIC_PREVIEW',
  previewUrl,
  previewPath,
  provider: {
    name: 'rawgit.hack',
    endpoint: 'rawcdn.githack.com',
    repositoryAffiliation: 'THIRD_PARTY_NOT_GITHUB',
    immutableCommitPinnedCache: true,
    formalUptimeGuarantee: false
  },
  remoteValidation: {
    executed: true,
    httpStatus: response.status(),
    contentType: responseHeaders['content-type'] ?? null,
    finalUrl: runtimeSnapshot.locationHref,
    consoleErrorCount: consoleErrors.length,
    pageErrorCount: pageErrors.length,
    failedRequestCount: failedRequests.length,
    browserRequestHosts: networkHosts,
    resourceUrls,
    canvasCount: runtimeSnapshot.canvasRecords.length,
    webgl2ContextCount: runtimeSnapshot.webgl2ContextCount,
    screenshotSha256,
    runtimeSnapshot
  },
  physicalTestAuthority: {
    physicalReferenceDevice: 'SAMSUNG_GALAXY_PHONE',
    allSupportedTouchDevicesRemainTarget: true,
    physicalTestingMayBegin: true,
    physicalTestingPerformedByThisCheckpoint: false,
    cp4AcceptanceAuthorized: false,
    cp4MergeAuthorized: false
  },
  mutationBoundary: {
    livePagesDeploymentChanged: false,
    productionRouteChanged: false,
    rendererChanged: false,
    renderPackageChanged: false,
    sourceOccurrenceChanged: false,
    previewFilesChanged: false,
    onlyDurableOutput: receiptPath
  },
  nextCheckpoint: 'CP4_0D_PHYSICAL_ALL_EIGHT_TOUCH_EXECUTION',
  stoppingBoundary: 'STOP_BEFORE_CP4_ACCEPTANCE_OR_MERGE'
};

await fs.writeFile(
  path.join(outputDirectory, 'h-earth.touch-motion-calibration.cp4-0c-non-live-preview-publication.receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify(receipt, null, 2));

execFileSync('git', ['fetch', 'origin', branch, '--quiet'], { stdio: 'inherit' });
execFileSync('git', ['checkout', '-B', branch, `origin/${branch}`], { stdio: 'inherit' });
execFileSync('git', ['checkout', sourceHead, '--', harnessPath], { stdio: 'inherit' });
await fs.mkdir(path.dirname(receiptPath), { recursive: true });
await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
execFileSync('git', ['add', harnessPath, receiptPath], { stdio: 'inherit' });

const stagedPaths = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)
  .sort();
assert.deepEqual(stagedPaths, [harnessPath, receiptPath].sort(), `CP4_0C_FINAL_SCOPE_INVALID:${JSON.stringify(stagedPaths)}`);

execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
execFileSync('git', ['commit', '-m', 'Record CP4 non-live preview publication'], { stdio: 'inherit' });
execFileSync('git', ['push', 'origin', `HEAD:${branch}`], { stdio: 'inherit' });
