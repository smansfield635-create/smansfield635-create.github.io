import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1PackageDeterminismReceipt } from './h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs`;
const expectedCorrectedIdentity = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_9AE117E4';

await mkdir(evidenceDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});

try {
  const nodeReceipt = await buildCP3D1PackageDeterminismReceipt('NODE');
  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserReceipt = await page.evaluate(async ({ url }) => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    return module.buildCP3D1PackageDeterminismReceipt('BROWSER');
  }, { url: probeUrl });

  await writeFile(`${evidenceDirectory}/cp3d1d-node-corrected-package.receipt.json`, `${JSON.stringify(nodeReceipt, null, 2)}\n`);
  await writeFile(`${evidenceDirectory}/cp3d1d-browser-corrected-package.receipt.json`, `${JSON.stringify(browserReceipt, null, 2)}\n`);

  const comparableNode = { ...nodeReceipt, runtime: 'CROSS_RUNTIME' };
  const comparableBrowser = { ...browserReceipt, runtime: 'CROSS_RUNTIME' };
  assert.deepEqual(comparableBrowser, comparableNode, 'CP3D1D_CORRECTED_PACKAGE_RECEIPTS_DIFFER');
  assert.equal(nodeReceipt.packageIdentity, expectedCorrectedIdentity, 'CP3D1D_NODE_CORRECTED_IDENTITY_UNEXPECTED');
  assert.equal(browserReceipt.packageIdentity, expectedCorrectedIdentity, 'CP3D1D_BROWSER_CORRECTED_IDENTITY_UNEXPECTED');
  assert.equal(nodeReceipt.canonicalBytesSHA256, browserReceipt.canonicalBytesSHA256, 'CP3D1D_CANONICAL_BYTES_SHA256_MISMATCH');
  assert.equal(nodeReceipt.contentDigest, browserReceipt.contentDigest, 'CP3D1D_CONTENT_DIGEST_MISMATCH');

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1D_CORRECTED_CROSS_RUNTIME_PACKAGE_IDENTITY_v1',
    checkpoint: 'CP3D_1D_CORRECTED_CROSS_RUNTIME_IDENTITY_VERIFICATION',
    eligible: true,
    status: 'CORRECTED_PACKAGE_IDENTITY_CONFIRMED_IN_NODE_AND_CHROMIUM',
    correctedPackageIdentity: expectedCorrectedIdentity,
    nodePackageIdentity: nodeReceipt.packageIdentity,
    browserPackageIdentity: browserReceipt.packageIdentity,
    nodeCanonicalBytesSHA256: nodeReceipt.canonicalBytesSHA256,
    browserCanonicalBytesSHA256: browserReceipt.canonicalBytesSHA256,
    nodeContentDigest: nodeReceipt.contentDigest,
    browserContentDigest: browserReceipt.contentDigest,
    fullDeterminismReceiptEqual: true,
    rendererExpectationUpdated: false,
    rendererGuardExecuted: false,
    productionMutationPerformedByThisHarness: false,
    mergeAuthorized: false,
    cp4Authorized: false
  });

  await writeFile(`${evidenceDirectory}/cp3d1d-corrected-cross-runtime-identity.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
  throw new Error(`CP3D1D_IDENTITY_VERIFICATION_COMPLETE:${expectedCorrectedIdentity}`);
} finally {
  await browser.close();
}
