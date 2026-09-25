import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const prepromotionOrigin = process.env.PREPROMOTION_ORIGIN ?? 'http://127.0.0.1:4178';
const targetOrigin = process.env.PROMOTION_TARGET_ORIGIN ?? 'http://127.0.0.1:4177';
const evidenceDir = process.env.PROMOTION_EVIDENCE_DIR ??
  'h-earth-3d/validation/cp2-round1-default-promotion-evidence';
const candidateValue = 'round1-1f520809';
const engineeringHead = '1f52080969034c55855a70834cc0294791254c80';
const candidateProfile = 'H_EARTH_GRATITUDE_REGION_CP2_ROUND_1_PRESENTATION_PROFILE_v1';
const candidateRendererPath =
  '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';

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
  const page = await browser.newPage({
    viewport: { width: 720, height: 900 },
    deviceScaleFactor: 1
  });
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

  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 45_000
  });
  assert(response?.ok(), `${label}: route did not return OK`, {
    status: response?.status(),
    url
  });

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
      href: location.href,
      search: location.search,
      publicReceipt: api.getReceipt(),
      gpuReceipt: api.getLiveGpuReceipt(),
      routeDataset: {
        ...document.getElementById('h-earth-functional-landscape-route')?.dataset
      }
    };
  });
  await page.screenshot({
    path: path.join(evidenceDir, `${label}.png`),
    fullPage: true
  });
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
  const prepromotion = await inspect(
    'prepromotion-default',
    `${prepromotionOrigin}/showroom/globe/h-earth/`
  );
  const promotedDefault = await inspect(
    'promoted-default',
    `${targetOrigin}/showroom/globe/h-earth/`
  );
  const rollbackWitness = await inspect(
    'accepted-baseline-query',
    `${targetOrigin}/showroom/globe/h-earth/?cp2=baseline`
  );

  for (const record of [prepromotion, promotedDefault, rollbackWitness]) {
    assert(record.consoleErrors.length === 0,
      `${record.label}: console errors`, record.consoleErrors);
    assert(record.pageErrors.length === 0,
      `${record.label}: page errors`, record.pageErrors);
    assert(
      record.state.gpuReceipt.counters.gpuFramebufferPresentationCount >= 1,
      `${record.label}: no visible GPU frame`
    );
    assert(
      record.state.gpuReceipt.correspondence.packageUploadedOnce === true,
      `${record.label}: package upload identity failed`
    );
    assert(
      record.state.gpuReceipt.correspondence.resourceIdentityStable === true,
      `${record.label}: GPU resource identity failed`
    );
  }

  const prepromotionHash = prepromotion.state.gpuReceipt.latestColorSummary.byteHash;
  const promotedHash = promotedDefault.state.gpuReceipt.latestColorSummary.byteHash;
  const rollbackHash = rollbackWitness.state.gpuReceipt.latestColorSummary.byteHash;
  const promotedAdmission = promotedDefault.state.gpuReceipt.liveDifferential;
  const rollbackAdmission = rollbackWitness.state.gpuReceipt.liveDifferential;

  assert(promotedHash !== prepromotionHash,
    'Default live route did not change from the accepted baseline frame');
  assert(rollbackHash === prepromotionHash,
    'Baseline query does not reproduce the pre-promotion accepted frame',
    { prepromotionHash, rollbackHash });
  assert(
    new URLSearchParams(promotedDefault.state.search).get('cp2') === candidateValue,
    'Default route did not canonicalize to the accepted CP2 selector',
    promotedDefault.state
  );
  assert(promotedAdmission?.requested === true,
    'Default route did not request the CP2 candidate', promotedAdmission);
  assert(promotedAdmission?.engineeringHead === engineeringHead,
    'Default route engineering-head identity mismatch', promotedAdmission);
  assert(
    promotedDefault.state.gpuReceipt.resources.presentationProfileId === candidateProfile,
    'Default route presentation profile mismatch',
    promotedDefault.state.gpuReceipt.resources
  );
  assert(promotedDefault.requestedPaths.includes(candidateRendererPath),
    'Default route did not request the exact candidate renderer',
    promotedDefault.requestedPaths);
  assert(rollbackAdmission?.requested === false,
    'Baseline query incorrectly requested the candidate', rollbackAdmission);
  assert(rollbackAdmission?.acceptedBaselineRendererSelected === true,
    'Baseline query did not select the accepted baseline renderer', rollbackAdmission);
  assert(!rollbackWitness.requestedPaths.includes(candidateRendererPath),
    'Baseline query requested the candidate renderer');

  result = {
    receiptType: 'H_EARTH_CP2_ROUND_1_DEFAULT_PROMOTION_BROWSER_RECEIPT_v1',
    result: 'PASS_CP2_ROUND_1_DEFAULT_PROMOTION',
    engineeringHead,
    candidateProfile,
    defaultUrl: `${targetOrigin}/showroom/globe/h-earth/`,
    rollbackUrl: `${targetOrigin}/showroom/globe/h-earth/?cp2=baseline`,
    prepromotionHash,
    promotedHash,
    rollbackHash,
    defaultCandidateSelected: true,
    acceptedBaselineRollbackPreserved: rollbackHash === prepromotionHash,
    browserConsoleErrors: 0,
    pageErrors: 0,
    records: [prepromotion, promotedDefault, rollbackWitness],
    userDifferentialRecorded: true,
    userDisposition: 'ACCEPT_PROMOTION_TO_DEFAULT_LIVE_ROUTE',
    timestamp: new Date().toISOString()
  };

  await fs.writeFile(
    path.join(evidenceDir, 'h-earth.cp2-round1-default-promotion.receipt.v1.json'),
    `${JSON.stringify(result, null, 2)}\n`
  );
  console.log(JSON.stringify({
    result: result.result,
    prepromotionHash,
    promotedHash,
    rollbackHash,
    candidateProfile
  }, null, 2));
} catch (error) {
  result = {
    receiptType: 'H_EARTH_CP2_ROUND_1_DEFAULT_PROMOTION_BROWSER_RECEIPT_v1',
    result: 'FAIL_CP2_ROUND_1_DEFAULT_PROMOTION',
    message: error.message,
    detail: error.detail ?? null,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  await fs.writeFile(
    path.join(evidenceDir, 'h-earth.cp2-round1-default-promotion.receipt.v1.json'),
    `${JSON.stringify(result, null, 2)}\n`
  );
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
