import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const outDir = '.fd05/shoreline-api-inspection-output';
await mkdir(outDir, { recursive: true });
const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, p)).href);

const files = {
  south: 'showroom/globe/h-earth/render/geometry-kernel.south.js',
  facade: 'showroom/globe/h-earth/render/geometry-kernel.js',
  ground: 'showroom/globe/h-earth/render/geometry-ground.js',
  preview: 'showroom/globe/h-earth/render/geometry-preview.js',
  packet002: 'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  frame: 'showroom/globe/h-earth/admitted-geometry-frame.js',
  html: 'showroom/globe/h-earth/index.html'
};

const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([id, file]) => [id, await readFile(file, 'utf8')])
  )
);
const modules = {
  facade: await load(files.facade),
  ground: await load(files.ground),
  preview: await load(files.preview),
  packet002: await load(files.packet002),
  frame: await load(files.frame)
};

function windowAround(source, token, before = 1000, after = 8000) {
  const index = source.indexOf(token);
  if (index < 0) return null;
  return source.slice(Math.max(0, index - before), Math.min(source.length, index + after));
}

function sourceOf(fn) {
  return typeof fn === 'function' ? Function.prototype.toString.call(fn) : null;
}

const report = {
  reportId: 'H_EARTH_FD05_SHORELINE_API_INSPECTION_002',
  generatedAt: new Date().toISOString(),
  status: 'COMPLETE',
  repositoryModified: false,
  exportedFunctions: {
    constructHEarthTriangleMesh: sourceOf(modules.facade.constructHEarthTriangleMesh),
    constructHEarthHeightFieldMesh: sourceOf(modules.facade.constructHEarthHeightFieldMesh),
    createHEarthNeutralGeometryRecord: sourceOf(modules.facade.createHEarthNeutralGeometryRecord),
    createHEarthNeutralPrimitiveRecord: sourceOf(modules.facade.createHEarthNeutralPrimitiveRecord),
    constructHEarthGroundProvider: sourceOf(modules.ground.constructHEarthGroundProvider),
    previewHEarthWetSandGeometry: sourceOf(modules.preview.previewHEarthWetSandGeometry),
    buildHEarthPostWestAdmittedGeometryTransfer: sourceOf(modules.packet002.buildHEarthPostWestAdmittedGeometryTransfer),
    evaluateHEarthPostWestAdmittedGeometryTransferInput: sourceOf(modules.packet002.evaluateHEarthPostWestAdmittedGeometryTransferInput),
    composeHEarth3DAdmittedGeometryFrame: sourceOf(modules.frame.composeHEarth3DAdmittedGeometryFrame),
    evaluateHEarth3DAdmittedGeometryFrameInput: sourceOf(modules.frame.evaluateHEarth3DAdmittedGeometryFrameInput)
  },
  sourceWindows: {
    groundHeightFieldInvocation: windowAround(sources.ground, 'constructHEarthHeightFieldMesh(', 2500, 9000),
    packetPrimitiveValidation: windowAround(sources.packet002, 'function validateWestPrimitiveAdmission', 1200, 12000),
    packetBatchValidation: windowAround(sources.packet002, 'function validateWestBatchAdmissionResult', 1200, 16000),
    packetPreviewDerivation: windowAround(sources.packet002, 'function derivePreviewSourceObjectIds', 1000, 9000),
    framePrimitiveProvenance: windowAround(sources.frame, 'function validatePrimitiveSourceProvenance', 1200, 14000),
    framePresentationAssignments: windowAround(sources.frame, 'function buildWetSandPresentationAssignments', 1200, 14000),
    framePacketValidation: windowAround(sources.frame, 'function validatePacket002Transfer', 1200, 14000),
    htmlPreviewConstruction: windowAround(sources.html, 'previewHEarthWetSandGeometry', 3500, 12000),
    htmlPacketConstruction: windowAround(sources.html, 'buildHEarthPostWestAdmittedGeometryTransfer', 3500, 10000)
  }
};

await writeFile(
  `${outDir}/api-inspection-v2.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify({
  reportId: report.reportId,
  exportedFunctionCount: Object.values(report.exportedFunctions).filter(Boolean).length,
  windowCount: Object.values(report.sourceWindows).filter(Boolean).length
}, null, 2));
