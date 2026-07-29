import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const moduleUrl = `${origin}/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js`;
const bufferOrder = Object.freeze([
  'positions', 'normals', 'baseColorsLinear', 'materialParameters',
  'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
]);

const textEncoder = new TextEncoder();

function encodeNumbers(values) {
  const bytes = new Uint8Array(values.length * 8 + 1);
  const view = new DataView(bytes.buffer);
  values.forEach((value, index) => view.setFloat64(index * 8, value, true));
  bytes[bytes.length - 1] = 0xfe;
  return bytes;
}

async function sha256(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

async function snapshot(packageRecord, runtime) {
  const bufferRecords = [];
  for (const kind of bufferOrder) {
    const values = packageRecord.buffers[kind];
    bufferRecords.push({
      kind,
      length: values.length,
      sha256: await sha256(encodeNumbers(values))
    });
  }
  return {
    runtime,
    eligible: packageRecord.eligible,
    packageIdentity: packageRecord.packageIdentity,
    contentDigest: packageRecord.contentDigest,
    primitiveIds: [...packageRecord.primitiveIds],
    drawRanges: packageRecord.drawRanges.map(range => ({
      role: range.role,
      transparencyClass: range.transparencyClass,
      materialModelCode: range.materialModelCode,
      indexStart: range.indexStart,
      indexCount: range.indexCount,
      primitiveIds: [...range.primitiveIds]
    })),
    bufferRecords,
    numericIdentityBoundary: packageRecord.sourceAuthorities.numericIdentityBoundary,
    numericCanonicalizationLaw: packageRecord.sourceAuthorities.numericCanonicalizationLaw,
    canonicalizedFloatBuffers: [...packageRecord.sourceAuthorities.canonicalizedFloatBuffers]
  };
}

await mkdir(evidenceDirectory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});

try {
  const nodeSnapshot = await snapshot(getHEarthRun8ER2CanonicalLiveRenderPackage(), 'NODE');
  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserSnapshot = await page.evaluate(async ({ url }) => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    const packageRecord = module.getHEarthRun8ER2CanonicalLiveRenderPackage();
    const order = [
      'positions', 'normals', 'baseColorsLinear', 'materialParameters',
      'materialModelCodes', 'surfaceClassCodes', 'primitiveIndices', 'roleCodes', 'indices'
    ];
    const encode = values => {
      const bytes = new Uint8Array(values.length * 8 + 1);
      const view = new DataView(bytes.buffer);
      values.forEach((value, index) => view.setFloat64(index * 8, value, true));
      bytes[bytes.length - 1] = 0xfe;
      return bytes;
    };
    const digestHex = async bytes => {
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
    };
    const records = [];
    for (const kind of order) records.push({
      kind,
      length: packageRecord.buffers[kind].length,
      sha256: await digestHex(encode(packageRecord.buffers[kind]))
    });
    return {
      runtime: 'BROWSER',
      eligible: packageRecord.eligible,
      packageIdentity: packageRecord.packageIdentity,
      contentDigest: packageRecord.contentDigest,
      primitiveIds: [...packageRecord.primitiveIds],
      drawRanges: packageRecord.drawRanges.map(range => ({
        role: range.role,
        transparencyClass: range.transparencyClass,
        materialModelCode: range.materialModelCode,
        indexStart: range.indexStart,
        indexCount: range.indexCount,
        primitiveIds: [...range.primitiveIds]
      })),
      bufferRecords: records,
      numericIdentityBoundary: packageRecord.sourceAuthorities.numericIdentityBoundary,
      numericCanonicalizationLaw: packageRecord.sourceAuthorities.numericCanonicalizationLaw,
      canonicalizedFloatBuffers: [...packageRecord.sourceAuthorities.canonicalizedFloatBuffers]
    };
  }, { url: moduleUrl });

  const comparableNode = { ...nodeSnapshot, runtime: undefined };
  const comparableBrowser = { ...browserSnapshot, runtime: undefined };
  const completeEquality = JSON.stringify(comparableNode) === JSON.stringify(comparableBrowser);
  const positionsEqual = nodeSnapshot.bufferRecords[0].sha256 === browserSnapshot.bufferRecords[0].sha256;
  const normalsEqual = nodeSnapshot.bufferRecords[1].sha256 === browserSnapshot.bufferRecords[1].sha256;
  const allNumericBuffersEqual = JSON.stringify(nodeSnapshot.bufferRecords) === JSON.stringify(browserSnapshot.bufferRecords);
  const packageIdentityEqual = nodeSnapshot.packageIdentity === browserSnapshot.packageIdentity;
  const contentDigestEqual = nodeSnapshot.contentDigest === browserSnapshot.contentDigest;

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1D_SHARED_PACKAGE_BOUNDARY_EQUALITY_v1',
    checkpoint: 'CP3D_1D_D_SHARED_IDENTITY_BEARING_PACKAGE_BOUNDARY',
    eligible: completeEquality,
    status: completeEquality ? 'SHARED_PACKAGE_BOUNDARY_EQUALITY_PASS' : 'SHARED_PACKAGE_BOUNDARY_EQUALITY_FAIL',
    nodePackageIdentity: nodeSnapshot.packageIdentity,
    browserPackageIdentity: browserSnapshot.packageIdentity,
    positionsEqual,
    normalsEqual,
    allNumericBuffersEqual,
    contentDigestEqual,
    packageIdentityEqual,
    fullDeterminismReceiptEqual: completeEquality,
    nodeBufferRecords: nodeSnapshot.bufferRecords,
    browserBufferRecords: browserSnapshot.bufferRecords,
    numericIdentityBoundary: nodeSnapshot.numericIdentityBoundary,
    rendererExpectationUpdated: false,
    rendererGuardExecuted: false,
    mergeAuthorized: false,
    cp4Authorized: false
  });

  await writeFile(`${evidenceDirectory}/cp3d1d-shared-package-boundary-node.receipt.json`, `${JSON.stringify(nodeSnapshot, null, 2)}\n`);
  await writeFile(`${evidenceDirectory}/cp3d1d-shared-package-boundary-browser.receipt.json`, `${JSON.stringify(browserSnapshot, null, 2)}\n`);
  await writeFile(`${evidenceDirectory}/cp3d1d-shared-package-boundary-equality.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));

  assert.equal(completeEquality, true, 'CP3D1D_SHARED_PACKAGE_BOUNDARY_EQUALITY_FAIL');
} finally {
  await browser.close();
}
