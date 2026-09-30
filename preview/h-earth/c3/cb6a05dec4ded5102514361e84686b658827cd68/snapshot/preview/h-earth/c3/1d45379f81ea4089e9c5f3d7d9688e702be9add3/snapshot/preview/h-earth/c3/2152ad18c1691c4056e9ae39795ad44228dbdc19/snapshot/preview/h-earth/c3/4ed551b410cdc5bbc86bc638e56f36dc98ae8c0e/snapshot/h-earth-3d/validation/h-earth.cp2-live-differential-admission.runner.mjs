import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const targetOrigin = process.env.ADMISSION_TARGET_ORIGIN ?? 'http://127.0.0.1:4177';
const acceptedOrigin = process.env.ACCEPTED_BASELINE_ORIGIN ?? 'http://127.0.0.1:4178';
const evidenceDir = process.env.ADMISSION_EVIDENCE_DIR ?? 'h-earth-3d/validation/cp2-live-differential-admission-evidence';
const candidateQuery = 'cp2=round1-1f520809';
const engineeringHead = '1f52080969034c55855a70834cc0294791254c80';
const profileId = 'H_EARTH_GRATITUDE_REGION_CP2_ROUND_1_PRESENTATION_PROFILE_v1';
const candidateRendererPath = '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';

const assert = (condition, message, detail = null) => {
  if (!condition) {
    const error = new Error(message);
    error.detail = detail;
    throw error;
  }
};

await fs.mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function inspect(label, url) {
  const page = await browser.newPage({ viewport: { width: 720, height: 900 }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const pageErrors = [];
  const requestedPaths = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));
  page.on('request', (request) => {
    try { requestedPaths.push(new URL(request.url()).pathname); } catch {}
  });

  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  assert(response?.ok(), `${label}: route did not return an OK response`, { status: response?.status(), url });
  await page.waitForFunction(() => {
    const api = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const receipt = api?.getLiveGpuReceipt?.();
    return Boolean(
      api?.ready === true &&
      receipt?.counters?.gpuFramebufferPresentationCount >= 1 &&
      receipt?.latestColorSummary?.byteHash
    );
  }, null, { timeout: 45_000 });

  const state = await page.evaluate(() => {
    const api = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
    return {
      publicReceipt: api.getReceipt(),
      gpuReceipt: api.getLiveGpuReceipt(),
      startupReceipt: window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.() ?? null,
      routeDataset: { ...document.getElementById('h-earth-functional-landscape-route')?.dataset },
      title: document.title,
      href: location.href
    };
  });
  await page.screenshot({ path: path.join(evidenceDir, `${label}.png`), fullPage: true });
  await page.close();
  return {
    label,
    url,
    consoleErrors,
    pageErrors,
    requestedPaths: [...new Set(requestedPaths)],
    state
  };
}

let result;
try {
  const accepted = await inspect('accepted-baseline', `${acceptedOrigin}/showroom/globe/h-earth/`);
  const admittedDefault = await inspect('admission-default', `${targetOrigin}/showroom/globe/h-earth/`);
  const candidate = await inspect(
    'cp2-candidate',
    `${targetOrigin}/showroom/globe/h-earth/?${candidateQuery}&verify=${Date.now()}`
  );

  for (const record of [accepted, admittedDefault, candidate]) {
    assert(record.consoleErrors.length === 0, `${record.label}: browser console errors`, record.consoleErrors);
    assert(record.pageErrors.length === 0, `${record.label}: page errors`, record.pageErrors);
    assert(
      record.state.gpuReceipt.counters.gpuFramebufferPresentationCount >= 1,
      `${record.label}: no visible GPU frame`
    );
    assert(
      record.state.gpuReceipt.correspondence.packageUploadedOnce === true,
      `${record.label}: renderer package was not uploaded exactly once`
    );
    assert(
      record.state.gpuReceipt.correspondence.resourceIdentityStable === true,
      `${record.label}: GPU resource identity is not stable`
    );
  }

  const acceptedHash = accepted.state.gpuReceipt.latestColorSummary.byteHash;
  const admittedDefaultHash = admittedDefault.state.gpuReceipt.latestColorSummary.byteHash;
  const candidateHash = candidate.state.gpuReceipt.latestColorSummary.byteHash;
  assert(
    admittedDefaultHash === acceptedHash,
    'Default admission URL changed the accepted live baseline frame',
    { acceptedHash, admittedDefaultHash }
  );
  assert(
    admittedDefault.state.gpuReceipt.liveDifferential?.requested === false,
    'Default admission URL did not select the accepted baseline renderer',
    admittedDefault.state.gpuReceipt.liveDifferential
  );
  assert(
    admittedDefault.state.gpuReceipt.liveDifferential?.acceptedBaselineRendererSelected === true,
    'Default admission URL baseline-selection receipt failed'
  );
  assert(
    !admittedDefault.requestedPaths.includes(candidateRendererPath),
    'Default admission URL requested the CP2 candidate renderer'
  );

  const liveDifferential = candidate.state.gpuReceipt.liveDifferential;
  assert(liveDifferential?.requested === true, 'Candidate query did not select the CP2 renderer', liveDifferential);
  assert(liveDifferential?.engineeringHead === engineeringHead, 'Candidate engineering-head identity mismatch', liveDifferential);
  assert(
    liveDifferential?.rendererPath?.endsWith('persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'),
    'Candidate renderer path mismatch',
    liveDifferential
  );
  assert(
    candidate.requestedPaths.includes(candidateRendererPath),
    'Candidate renderer module was not requested by the browser',
    candidate.requestedPaths
  );
  assert(
    candidate.state.gpuReceipt.resources.presentationProfileId === profileId,
    'Candidate presentation profile identity mismatch',
    candidate.state.gpuReceipt.resources
  );
  assert(candidateHash !== acceptedHash, 'Candidate frame does not differ from the accepted baseline frame');

  result = {
    receiptType: 'H_EARTH_CP2_LIVE_DIFFERENTIAL_ADMISSION_BROWSER_RECEIPT_v1',
    result: 'PASS_LIVE_DIFFERENTIAL_ADMISSION',
    engineeringHead,
    candidateQuery,
    acceptedBaselineUrl: `${acceptedOrigin}/showroom/globe/h-earth/`,
    admittedDefaultUrl: `${targetOrigin}/showroom/globe/h-earth/`,
    candidateUrl: `${targetOrigin}/showroom/globe/h-earth/?${candidateQuery}`,
    acceptedHash,
    admittedDefaultHash,
    candidateHash,
    defaultBaselinePreserved: admittedDefaultHash === acceptedHash,
    candidateProfileId: candidate.state.gpuReceipt.resources.presentationProfileId,
    browserConsoleErrors: 0,
    pageErrors: 0,
    records: [accepted, admittedDefault, candidate],
    mergeAuthorization: false,
    userDifferentialRequired: true,
    timestamp: new Date().toISOString()
  };
  await fs.writeFile(
    path.join(evidenceDir, 'h-earth.cp2-live-differential-admission.receipt.v1.json'),
    `${JSON.stringify(result, null, 2)}\n`
  );
  console.log(JSON.stringify({
    result: result.result,
    acceptedHash,
    admittedDefaultHash,
    candidateHash,
    candidateProfileId: result.candidateProfileId
  }, null, 2));
} catch (error) {
  result = {
    receiptType: 'H_EARTH_CP2_LIVE_DIFFERENTIAL_ADMISSION_BROWSER_RECEIPT_v1',
    result: 'FAIL_LIVE_DIFFERENTIAL_ADMISSION',
    message: error.message,
    detail: error.detail ?? null,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  await fs.writeFile(
    path.join(evidenceDir, 'h-earth.cp2-live-differential-admission.receipt.v1.json'),
    `${JSON.stringify(result, null, 2)}\n`
  );
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
