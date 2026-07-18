import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const outDir = '.fd05/shoreline-contract-check-output';
await mkdir(outDir, { recursive: true });

const previewModule = await load('showroom/globe/h-earth/render/geometry-preview.js');
const kernelModule = await load('showroom/globe/h-earth/render/geometry-kernel.js');
const packetModule = await load('h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js');
const frameModule = await load('showroom/globe/h-earth/admitted-geometry-frame.js');

function clone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(clone);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)]));
}

function rewriteStrings(value, replacements) {
  if (typeof value === 'string') {
    let output = value;
    for (const [from, to] of replacements) output = output.split(from).join(to);
    return output;
  }
  if (Array.isArray(value)) return value.map((entry) => rewriteStrings(entry, replacements));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, rewriteStrings(nested, replacements)])
    );
  }
  return value;
}

function compact(value, depth = 0) {
  if (depth > 5) return '[DEPTH_LIMIT]';
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.slice(0, 12).map((entry) => compact(entry, depth + 1));
  return Object.fromEntries(
    Object.entries(value).slice(0, 30).map(([key, nested]) => [key, compact(nested, depth + 1)])
  );
}

const wetPreview = previewModule.previewHEarthWetSandGeometry({
  sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose: 'WET_SAND_GEOMETRY_PREVIEW',
  requestId: 'FD05_SHORELINE_CONTRACT_CHECK_001'
});

if (!wetPreview?.ok || !Array.isArray(wetPreview.primitives) || wetPreview.primitives.length !== 1) {
  throw new Error('Current wet-sand preview is not lawful.');
}

const wetPrimitive = clone(wetPreview.primitives[0]);
const waterPrimitive = rewriteStrings(clone(wetPrimitive), [
  ['OBJ_002_FOREGROUND_WET_SAND', 'OBJ_007_WATER_SURFACE_PLANE'],
  ['ZONE_001_FOREGROUND_INSPECTION_ZONE', 'ZONE_003_WATER_SURFACE_ZONE'],
  ['H_EARTH_MATERIAL_WET_SAND', 'H_EARTH_MATERIAL_OPEN_WATER'],
  ['WET_SAND', 'OPEN_WATER'],
  ['FOREGROUND_INSPECTION_GROUND', 'WATER_SURFACE_CONTEXT']
]);
const foamPrimitive = rewriteStrings(clone(wetPrimitive), [
  ['OBJ_002_FOREGROUND_WET_SAND', 'OBJ_005_SHORELINE_FOAM_LINE'],
  ['ZONE_001_FOREGROUND_INSPECTION_ZONE', 'ZONE_002_SHORELINE_CONTACT_ZONE'],
  ['H_EARTH_MATERIAL_WET_SAND', 'H_EARTH_MATERIAL_FOAM'],
  ['WET_SAND', 'FOAM_CONTACT'],
  ['FOREGROUND_INSPECTION_GROUND', 'SHORELINE_CONTACT_CONTEXT']
]);

const primitiveCandidates = [wetPrimitive, foamPrimitive, waterPrimitive];
const sourceObjectIds = [
  'OBJ_002_FOREGROUND_WET_SAND',
  'OBJ_005_SHORELINE_FOAM_LINE',
  'OBJ_007_WATER_SURFACE_PLANE'
];
const sourceZoneIds = [
  'ZONE_001_FOREGROUND_INSPECTION_ZONE',
  'ZONE_002_SHORELINE_CONTACT_ZONE',
  'ZONE_003_WATER_SURFACE_ZONE'
];
const latticeRegionIds = Array.isArray(wetPreview.latticeRegionIds)
  ? [...wetPreview.latticeRegionIds]
  : [];

let westResult = null;
let westError = null;
try {
  westResult = kernelModule.admitHEarthPrimitiveBatch(primitiveCandidates, {
    frameId: 'FD05_SHORELINE_CONTRACT_CHECK_FRAME_001',
    metadata: Object.freeze({
      requestId: wetPreview.requestId,
      providerRequestId: wetPreview.providerRequestId,
      resolutionReceiptId: wetPreview.resolutionReceiptId,
      sourceObjectIds: Object.freeze([...sourceObjectIds]),
      sourceZoneIds: Object.freeze([...sourceZoneIds]),
      latticeRegionIds: Object.freeze([...latticeRegionIds])
    })
  });
} catch (error) {
  westError = { name: error?.name, message: error?.message, stack: error?.stack };
}

const previewVariants = [];
const common = {
  ...clone(wetPreview),
  primitives: primitiveCandidates,
  sourceObjectIds,
  sourceZoneIds,
  latticeRegionIds
};
previewVariants.push({
  id: 'PLURAL_WITH_LEGACY_SINGULAR_WET',
  value: { ...common, sourceObjectId: sourceObjectIds[0], sourceZoneIds }
});
previewVariants.push({
  id: 'PLURAL_WITH_SYNTHETIC_AGGREGATE_SINGULAR',
  value: {
    ...common,
    sourceObjectId: 'H_EARTH_MINIMUM_NATIVE_SHORELINE_CONTEXT',
    sourceZoneIds
  }
});
previewVariants.push({
  id: 'PLURAL_WITHOUT_SINGULAR',
  value: (() => {
    const output = { ...common };
    delete output.sourceObjectId;
    return output;
  })()
});

const variantResults = [];
for (const variant of previewVariants) {
  let packet = null;
  let packetError = null;
  let frame = null;
  let frameError = null;
  if (westResult) {
    try {
      packet = packetModule.buildHEarthPostWestAdmittedGeometryTransfer({
        previewResult: variant.value,
        westBatchAdmissionResult: westResult
      });
    } catch (error) {
      packetError = { name: error?.name, message: error?.message, stack: error?.stack };
    }
    if (packet?.ok) {
      try {
        frame = frameModule.composeHEarth3DAdmittedGeometryFrame({
          packet002Transfer: packet,
          packet002TransferOccurrenceId: `FD05_PACKET_${variant.id}`,
          compositorFrameOccurrenceId: `FD05_FRAME_${variant.id}`,
          presentationMode: frameModule.H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE
        });
      } catch (error) {
        frameError = { name: error?.name, message: error?.message, stack: error?.stack };
      }
    }
  }
  variantResults.push({
    id: variant.id,
    previewKeys: Object.keys(variant.value),
    packet: packet ? compact(packet) : null,
    packetError,
    frame: frame ? compact(frame) : null,
    frameError
  });
}

const report = {
  reportId: 'H_EARTH_FD05_SHORELINE_MULTI_PRIMITIVE_CONTRACT_CHECK_001',
  generatedAt: new Date().toISOString(),
  status: 'COMPLETE',
  repositoryModified: false,
  moduleExports: {
    kernel: Object.keys(kernelModule).sort(),
    packet002: Object.keys(packetModule).sort(),
    admittedFrame: Object.keys(frameModule).sort()
  },
  wetPreview: compact(wetPreview),
  wetPrimitiveKeys: Object.keys(wetPrimitive),
  wetPrimitiveMetadata: compact(wetPrimitive.metadata),
  westResult: westResult ? compact(westResult) : null,
  westError,
  variantResults
};

await writeFile(
  `${outDir}/contract-check.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify(report, null, 2));
