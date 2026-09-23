import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1APositionLocalizationSnapshot } from './h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs`;
const componentNames = Object.freeze(['X', 'Y', 'Z']);

function orderedFloat64(value) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, false);
  const bits = view.getBigUint64(0, false);
  return (bits >> 63n) === 0n ? bits | (1n << 63n) : ~bits;
}

function ulpDistance(left, right) {
  const a = orderedFloat64(left);
  const b = orderedFloat64(right);
  return a >= b ? a - b : b - a;
}

function sourcePathForSpan(span) {
  if (span.role === 'TERRAIN') return '/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
  if (span.role === 'VEGETATION') return '/showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js';
  if (span.role === 'SHORELINE') return '/showroom/globe/h-earth/render/landscape-preview.js';
  return null;
}

function locateFirstDifference(nodeSnapshot, browserSnapshot) {
  assert.equal(nodeSnapshot.positions.length, browserSnapshot.positions.length, 'CP3D1DA_POSITION_LENGTH_MISMATCH');
  assert.deepEqual(nodeSnapshot.primitiveSpans, browserSnapshot.primitiveSpans, 'CP3D1DA_PRIMITIVE_SPANS_MISMATCH');
  for (let positionElementIndex = 0; positionElementIndex < nodeSnapshot.positions.length; positionElementIndex += 1) {
    const nodeValue = nodeSnapshot.positions[positionElementIndex];
    const browserValue = browserSnapshot.positions[positionElementIndex];
    if (Object.is(nodeValue, browserValue)) continue;
    const globalVertexIndex = Math.floor(positionElementIndex / 3);
    const componentIndex = positionElementIndex % 3;
    const span = nodeSnapshot.primitiveSpans.find(candidate =>
      globalVertexIndex >= candidate.vertexStart &&
      globalVertexIndex < candidate.vertexStart + candidate.vertexCount
    );
    assert.ok(span, `CP3D1DA_PRIMITIVE_SPAN_NOT_FOUND:${globalVertexIndex}`);
    return Object.freeze({
      positionElementIndex,
      globalVertexIndex,
      componentIndex,
      component: componentNames[componentIndex],
      primitiveIndex: span.primitiveIndex,
      primitiveId: span.primitiveId,
      geometryId: span.geometryId,
      role: span.role,
      localVertexIndex: globalVertexIndex - span.vertexStart,
      geometrySourcePath: sourcePathForSpan(span),
      nodeValue,
      browserValue,
      absoluteDifference: Math.abs(nodeValue - browserValue),
      ulpDelta: ulpDistance(nodeValue, browserValue).toString()
    });
  }
  return null;
}

await mkdir(evidenceDirectory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});

try {
  const nodeSnapshot = buildCP3D1APositionLocalizationSnapshot('NODE');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserSnapshot = await page.evaluate(async url => {
    const module = await import(`${url}?runtime=BROWSER&stamp=${Date.now()}`);
    return module.buildCP3D1APositionLocalizationSnapshot('BROWSER');
  }, probeUrl);

  const firstDifference = locateFirstDifference(nodeSnapshot, browserSnapshot);
  const receipt = Object.freeze({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1DA_POST_CORRECTION_POSITION_DIVERGENCE_LOCALIZATION_v1',
    checkpoint: 'CP3D_1D_A_POST_MUTATION_POSITION_DIVERGENCE_RELOCALIZATION',
    eligible: firstDifference !== null,
    status: firstDifference
      ? 'FIRST_REMAINING_POSITION_DIVERGENCE_LOCALIZED'
      : 'POST_CORRECTION_POSITION_BUFFERS_ALREADY_EQUAL',
    nodePackageIdentity: nodeSnapshot.packageIdentity,
    browserPackageIdentity: browserSnapshot.packageIdentity,
    positionElementCount: nodeSnapshot.positions.length,
    firstDifference,
    boundary: {
      diagnosticOnly: true,
      productionMutationPerformed: false,
      rendererExpectationMutationPerformed: false,
      rendererGuardBypassPerformed: false,
      mergeAuthorizedByThisReceipt: false,
      cp4AuthorizedByThisReceipt: false
    }
  });

  await writeFile(`${evidenceDirectory}/cp3d1da-post-correction-position-localization.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
  if (!firstDifference) throw new Error('CP3D1DA_NO_REMAINING_POSITION_DIVERGENCE');
  throw new Error(`CP3D1DA_LOCALIZATION_COMPLETE:${firstDifference.primitiveId}:${firstDifference.localVertexIndex}:${firstDifference.component}`);
} finally {
  await browser.close();
}
