import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1PackageDeterminismReceipt } from './h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs`;

const comparisonOrder = Object.freeze([
  'primitiveCount',
  'primitiveIdentifiers',
  'primitiveOrder',
  'drawRangeOrder',
  'drawRangeValues',
  'bufferConstructors',
  'bufferLengths',
  'bufferByteLengths',
  'bufferRecords',
  'canonicalBytesSHA256',
  'hashAccumulationSteps',
  'contentDigest',
  'packageIdentity'
]);

const stable = value => JSON.stringify(value);
const firstDifference = (nodeReceipt, browserReceipt) => {
  for (const field of comparisonOrder) {
    if (stable(nodeReceipt[field]) !== stable(browserReceipt[field])) {
      return { field, node: nodeReceipt[field], browser: browserReceipt[field] };
    }
  }
  return null;
};

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

  const difference = firstDifference(nodeReceipt, browserReceipt);
  const positionsEqual = nodeReceipt.bufferRecords.find(record => record.kind === 'positions')?.canonicalFloat64LittleEndianSha256 ===
    browserReceipt.bufferRecords.find(record => record.kind === 'positions')?.canonicalFloat64LittleEndianSha256;
  const normalsEqual = nodeReceipt.bufferRecords.find(record => record.kind === 'normals')?.canonicalFloat64LittleEndianSha256 ===
    browserReceipt.bufferRecords.find(record => record.kind === 'normals')?.canonicalFloat64LittleEndianSha256;
  const allNumericBuffersEqual = stable(nodeReceipt.bufferRecords) === stable(browserReceipt.bufferRecords);
  const contentDigestEqual = nodeReceipt.contentDigest === browserReceipt.contentDigest;
  const packageIdentityEqual = nodeReceipt.packageIdentity === browserReceipt.packageIdentity;
  const completeEquality = difference === null;

  let disposition;
  if (completeEquality && positionsEqual && normalsEqual && allNumericBuffersEqual && contentDigestEqual && packageIdentityEqual) {
    disposition = 'CONTINUE_TO_RENDERER_IDENTITY_PROMOTION_AND_SURVIVAL';
  } else if (positionsEqual && !allNumericBuffersEqual) {
    disposition = 'STOP_SOURCE_BY_SOURCE_PATCHING_REASSESS_IDENTITY_MODEL_OR_SHARED_PACKAGE_BOUNDARY';
  } else {
    disposition = 'REJECT_SHORELINE_SOURCE_LOCAL_PLACEMENT';
  }

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1D_SHORELINE_PRODUCTION_CORRECTION_PACKAGE_EQUALITY_v1',
    checkpoint: 'CP3D_1D_C_SHORELINE_SOURCE_LOCAL_PRODUCTION_CORRECTION',
    eligible: completeEquality,
    status: completeEquality
      ? 'SHORELINE_CORRECTION_COMPLETE_PACKAGE_EQUALITY_PASS'
      : 'SHORELINE_CORRECTION_COMPLETE_PACKAGE_EQUALITY_FAIL',
    nodePackageIdentity: nodeReceipt.packageIdentity,
    browserPackageIdentity: browserReceipt.packageIdentity,
    positionsEqual,
    normalsEqual,
    allNumericBuffersEqual,
    canonicalBytesEqual: nodeReceipt.canonicalBytesSHA256 === browserReceipt.canonicalBytesSHA256,
    contentDigestEqual,
    packageIdentityEqual,
    fullDeterminismReceiptEqual: completeEquality,
    firstDifference: difference,
    disposition,
    productionMutation: {
      scope: [
        'H_EARTH_FUNCTIONAL_SHORELINE:DRY_SAND_EDGE',
        'H_EARTH_FUNCTIONAL_SHORELINE:DAMP_TRANSITION'
      ],
      placement: 'SHORELINE_SOURCE_BOUNDARY_BEFORE_BOUNDS_AND_NORMALS',
      law: 'Math.round(value * 2^24) / 2^24_WITH_NEGATIVE_ZERO_NORMALIZATION'
    },
    rendererExpectationUpdated: false,
    rendererGuardExecuted: false,
    mergeAuthorized: false,
    cp4Authorized: false
  });

  await writeFile(`${evidenceDirectory}/cp3d1d-shoreline-production-package-equality.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));

  assert.equal(completeEquality, true, `CP3D1D_SHORELINE_CORRECTION_PACKAGE_EQUALITY_FAIL:${difference?.field ?? 'UNKNOWN'}`);
} finally {
  await browser.close();
}
