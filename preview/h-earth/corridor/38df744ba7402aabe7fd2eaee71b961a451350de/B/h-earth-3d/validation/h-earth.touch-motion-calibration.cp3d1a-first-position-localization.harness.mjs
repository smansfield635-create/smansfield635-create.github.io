import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { buildCP3D1APositionLocalizationSnapshot } from './h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1-package-determinism-probe.mjs`;
await mkdir(evidenceDirectory, { recursive: true });

const bytesOf = value => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, true);
  return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0'));
};

const orderedBits = value => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, false);
  const bits = view.getBigUint64(0, false);
  return (bits >> 63n) === 1n ? ~bits : bits | (1n << 63n);
};

const ulpDistance = (left, right) => {
  const a = orderedBits(left);
  const b = orderedBits(right);
  return (a >= b ? a - b : b - a).toString();
};

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=swiftshader', '--disable-dev-shm-usage']
});

try {
  const nodeSnapshot = buildCP3D1APositionLocalizationSnapshot('NODE');
  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserSnapshot = await page.evaluate(async url => {
    const module = await import(`${url}?checkpoint=CP3D_1A&stamp=${Date.now()}`);
    return module.buildCP3D1APositionLocalizationSnapshot('BROWSER');
  }, probeUrl);

  if (nodeSnapshot.positions.length !== browserSnapshot.positions.length) {
    throw new Error(`CP3D1A_POSITION_LENGTH_MISMATCH:${nodeSnapshot.positions.length}:${browserSnapshot.positions.length}`);
  }

  let elementIndex = -1;
  for (let index = 0; index < nodeSnapshot.positions.length; index += 1) {
    if (!Object.is(nodeSnapshot.positions[index], browserSnapshot.positions[index])) {
      elementIndex = index;
      break;
    }
  }
  if (elementIndex < 0) throw new Error('CP3D1A_NO_POSITION_ELEMENT_DIVERGENCE_FOUND');

  const globalVertexIndex = Math.floor(elementIndex / 3);
  const componentIndex = elementIndex % 3;
  const component = ['X', 'Y', 'Z'][componentIndex];
  const span = nodeSnapshot.primitiveSpans.find(candidate =>
    globalVertexIndex >= candidate.vertexStart && globalVertexIndex < candidate.vertexStart + candidate.vertexCount
  );
  if (!span) throw new Error(`CP3D1A_SOURCE_SPAN_NOT_FOUND:${globalVertexIndex}`);

  const localVertexIndex = globalVertexIndex - span.vertexStart;
  const nodeValue = nodeSnapshot.positions[elementIndex];
  const browserValue = browserSnapshot.positions[elementIndex];
  const receipt = {
    receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1A_FIRST_POSITION_ELEMENT_AND_SOURCE_VERTEX_LOCALIZATION_v1',
    checkpoint: 'CP3D_1A_FIRST_POSITION_ELEMENT_AND_SOURCE_VERTEX_LOCALIZATION',
    status: 'FIRST_POSITION_DIVERGENCE_LOCALIZED',
    nodePackageIdentity: nodeSnapshot.packageIdentity,
    browserPackageIdentity: browserSnapshot.packageIdentity,
    firstDifferingPositionElementIndex: elementIndex,
    globalVertexIndex,
    positionComponent: component,
    nodeValue,
    browserValue,
    nodeFloat64LittleEndianBytes: bytesOf(nodeValue),
    browserFloat64LittleEndianBytes: bytesOf(browserValue),
    absoluteDelta: Math.abs(nodeValue - browserValue),
    ulpDelta: ulpDistance(nodeValue, browserValue),
    sourcePrimitiveIndex: span.primitiveIndex,
    sourcePrimitiveId: span.primitiveId,
    sourceGeometryId: span.geometryId,
    sourceRole: span.role,
    sourceLocalVertexIndex: localVertexIndex,
    sourceVertexStart: span.vertexStart,
    sourceVertexCount: span.vertexCount,
    packageConstructionPath: [
      'buildHEarthRun8ER2ImmutableLiveRenderPackage',
      'buildHEarthRun8ENeutralPackage',
      'buildHEarthRun8EPacket002SuccessorTransfer',
      'transfer.admittedPrimitives',
      'primitive.geometry.vertices',
      'positions.push(vertex.x, vertex.y, vertex.z)'
    ],
    stoppingBoundary: 'DO_NOT_INVESTIGATE_LATER_POSITION_ELEMENTS_NORMALS_OR_MATERIALS_UNTIL_THIS_SOURCE_VERTEX_CONSTRUCTION_IS_RESOLVED'
  };
  await writeFile(`${evidenceDirectory}/cp3d1a-first-position-localization.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
  throw new Error(`CP3D1A_LOCALIZATION_COMPLETE:${span.primitiveId}:${localVertexIndex}:${component}`);
} finally {
  await browser.close();
}
