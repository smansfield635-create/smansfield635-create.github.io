import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const outDir = '.fd05/native-shoreline-output';
await mkdir(outDir, { recursive: true });

const governed = [
  'showroom/globe/h-earth/render/geometry-preview.js',
  'showroom/globe/h-earth/render/geometry-ground.js',
  'showroom/globe/h-earth/render/geometry-water.js',
  'showroom/globe/h-earth/render/geometry-foam.js',
  'showroom/globe/h-earth/render/shoreline-preview.js',
  'h-earth-3d/integration/h-earth.source-object-geometry-resolution.js',
  'showroom/globe/h-earth/environment.js',
  'h-earth-3d/objects/ground-cell-001.objects.js',
  'h-earth-3d/zones/ground-cell-001.zones.js',
  'h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
  'showroom/globe/h-earth/capacity.js',
  'showroom/globe/h-earth/render/geometry-kernel.js',
  'h-earth-3d/cells/ground-cell-001.js',
  'h-earth-3d/h-earth.matrix.js',
  'showroom/globe/h-earth/render/geometry-kernel.north.js',
  'showroom/globe/h-earth/render/geometry-kernel.east.js',
  'showroom/globe/h-earth/render/geometry-kernel.south.js',
  'showroom/globe/h-earth/render/geometry-kernel.west.js',
  'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  'showroom/globe/h-earth/admitted-geometry-frame.js',
  'showroom/globe/h-earth/compositor.js',
  'showroom/globe/h-earth/renderer.js'
];

const importResults = [];
for (const file of governed) {
  try {
    await load(file);
    importResults.push({ file, ok: true });
  } catch (error) {
    importResults.push({
      file,
      ok: false,
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  }
}

if (importResults.some((result) => !result.ok)) {
  console.error(JSON.stringify({ importResults }, null, 2));
  throw new Error('One or more governed modules failed to import.');
}

const shoreline = await load('showroom/globe/h-earth/render/shoreline-preview.js');
const wetPreviewModule = await load('showroom/globe/h-earth/render/geometry-preview.js');
const kernel = await load('showroom/globe/h-earth/render/geometry-kernel.js');
const packetModule = await load('h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js');
const frameModule = await load('showroom/globe/h-earth/admitted-geometry-frame.js');
const compositor = await load('showroom/globe/h-earth/compositor.js');
const renderer = await load('showroom/globe/h-earth/renderer.js');

function assert(condition, message, details = null) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

function sourceIds(primitive, field) {
  const values = primitive?.metadata?.[field];
  return Array.isArray(values) ? [...values] : [];
}

const preview = shoreline.previewHEarthMinimumShorelineGeometry({
  sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose: 'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW',
  requestId: 'FD05_NATIVE_SHORELINE_SOURCE_TEST_001'
});

assert(preview.ok === true, 'Minimum shoreline preview rejected.', preview);
assert(preview.primitives.length === 3, 'Expected exactly three neutral primitives.', preview);
assert(
  JSON.stringify(preview.sourceObjectIds) ===
    JSON.stringify([
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),
  'Aggregate source-object membership mismatch.',
  preview.sourceObjectIds
);
assert(
  preview.primitives.every(kernel.isHEarthNeutralPrimitiveRecord),
  'One or more aggregate members are not lawful neutral primitives.'
);

const expectedMemberObjects = new Set(preview.sourceObjectIds);
for (const primitive of preview.primitives) {
  const ids = sourceIds(primitive, 'sourceObjectIds');
  assert(ids.length === 1, 'Every native member must preserve one source object.', { primitiveId: primitive.primitiveId, ids });
  assert(expectedMemberObjects.has(ids[0]), 'Unexpected primitive source object.', { primitiveId: primitive.primitiveId, ids });
}

const west = kernel.admitHEarthPrimitiveBatch(preview.primitives, {
  frameId: 'FD05_NATIVE_SHORELINE_WEST_FRAME_001',
  metadata: Object.freeze({
    requestId: preview.requestId,
    providerRequestId: preview.providerRequestId,
    resolutionReceiptId: preview.resolutionReceiptId,
    sourceObjectIds: Object.freeze([...preview.sourceObjectIds]),
    sourceZoneIds: Object.freeze([...preview.sourceZoneIds]),
    latticeRegionIds: Object.freeze([...preview.latticeRegionIds])
  })
});

assert(west.valid === true, 'West rejected the native shoreline primitive batch.', west);
assert(west.primitiveAdmissions.length === 3, 'West primitive admission count mismatch.', west);
assert(west.frame?.primitiveCount === 3, 'West aggregate-frame count mismatch.', west.frame);

const packet = packetModule.buildHEarthPostWestAdmittedGeometryTransfer({
  previewResult: preview,
  westBatchAdmissionResult: west
});

assert(packet.ok === true, 'Packet 002 rejected the three-member shoreline occurrence.', packet);
assert(packet.issues.length === 0, 'Packet 002 emitted issues.', packet.issues);
assert(packet.admittedPrimitives.length === 3, 'Packet 002 member count mismatch.', packet);
assert(
  JSON.stringify(packet.sourceObjectIds) === JSON.stringify(preview.sourceObjectIds),
  'Packet 002 aggregate source-object provenance mismatch.',
  packet
);

const viewportReceipt = compositor.setHEarth3DCompositorViewport({
  widthPx: 640,
  heightPx: 480,
  pixelRatio: 1
});
assert(viewportReceipt.accepted === true, 'Compositor viewport initialization rejected.', viewportReceipt);

const handoff = compositor.getHEarth3DCompositorRendererHandoff({
  packet002Transfer: packet,
  packet002TransferOccurrenceId: 'FD05_NATIVE_SHORELINE_PACKET_002_OCCURRENCE_001',
  compositorFrameOccurrenceId: 'FD05_NATIVE_SHORELINE_COMPOSITOR_FRAME_001',
  presentationMode: frameModule.H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE
});

assert(handoff.ok === true, 'Compositor renderer handoff rejected.', handoff);
const frame = handoff.admittedGeometryFrame;
assert(frameModule.isHEarth3DAdmittedGeometryFrame(frame), 'Constructed frame failed the public admitted-frame validator.', frame);
assert(frame.admittedPrimitives.length === 3, 'Admitted frame primitive count mismatch.', frame);
assert(frame.presentationAssignments.length === 3, 'Presentation assignment count mismatch.', frame);

const assignments = Object.fromEntries(
  frame.presentationAssignments.map((assignment) => [assignment.sourceObjectId, assignment])
);
assert(assignments.OBJ_002_FOREGROUND_WET_SAND?.materialReference === 'H_EARTH_MATERIAL_WET_SAND', 'Wet-sand material assignment mismatch.', assignments);
assert(assignments.OBJ_005_SHORELINE_FOAM_LINE?.materialReference === 'H_EARTH_MATERIAL_FOAM', 'Foam material assignment mismatch.', assignments);
assert(assignments.OBJ_007_WATER_SURFACE_PLANE?.materialReference === 'H_EARTH_MATERIAL_OPEN_WATER', 'Water material assignment mismatch.', assignments);
assert(frame.presentationAssignments.every((assignment) => assignment.presentationRole === 'PRIMARY_ADMITTED_WET_SAND_SURFACE'), 'Visibility-role correspondence mismatch.', frame.presentationAssignments);

const construction = renderer.constructHEarth3DRenderer(handoff);
assert(construction.constructed === true, 'Renderer construction rejected the shoreline frame.', construction);
assert(
  construction.status === 'RENDERER_STATE_AND_PROJECTION_PLAN_CONSTRUCTED' ||
    construction.status === 'RENDERER_STATE_CONSTRUCTED_FOR_LAWFUL_EMPTY_SCENE',
  'Unexpected renderer construction status.',
  construction
);

// Preserve the original one-object proof as a compatibility gate.
const wetPreview = wetPreviewModule.previewHEarthWetSandGeometry({
  sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose: 'WET_SAND_GEOMETRY_PREVIEW',
  requestId: 'FD05_NATIVE_SHORELINE_COMPATIBILITY_WET_001'
});
const wetWest = kernel.admitHEarthPrimitiveBatch(wetPreview.primitives, {
  frameId: 'FD05_NATIVE_SHORELINE_COMPATIBILITY_WEST_001',
  metadata: Object.freeze({
    requestId: wetPreview.requestId,
    providerRequestId: wetPreview.providerRequestId,
    resolutionReceiptId: wetPreview.resolutionReceiptId,
    sourceObjectIds: Object.freeze([wetPreview.sourceObjectId]),
    sourceZoneIds: Object.freeze([...wetPreview.sourceZoneIds]),
    latticeRegionIds: Object.freeze([...wetPreview.latticeRegionIds])
  })
});
const wetPacket = packetModule.buildHEarthPostWestAdmittedGeometryTransfer({
  previewResult: wetPreview,
  westBatchAdmissionResult: wetWest
});
assert(wetPacket.ok === true, 'Original wet-sand Packet 002 proof regressed.', wetPacket);

const report = {
  reportId: 'H_EARTH_FD05_MINIMUM_NATIVE_SHORELINE_SOURCE_VALIDATION_001',
  generatedAt: new Date().toISOString(),
  status: 'PASS',
  governedImports: {
    total: importResults.length,
    fulfilled: importResults.filter((entry) => entry.ok).length,
    rejected: importResults.filter((entry) => !entry.ok).length
  },
  preview: {
    contractId: preview.contractId,
    primitiveCount: preview.primitives.length,
    sourceObjectIds: preview.sourceObjectIds,
    sourceZoneIds: preview.sourceZoneIds,
    latticeRegionIds: preview.latticeRegionIds,
    bounds: preview.bounds
  },
  west: {
    valid: west.valid,
    primitiveAdmissionCount: west.primitiveAdmissions.length,
    aggregatePrimitiveCount: west.frame.primitiveCount
  },
  packet002: {
    ok: packet.ok,
    issueCount: packet.issues.length,
    admittedPrimitiveCount: packet.admittedPrimitives.length,
    sourceObjectIds: packet.sourceObjectIds
  },
  admittedFrame: {
    valid: frameModule.isHEarth3DAdmittedGeometryFrame(frame),
    presentationMode: frame.presentationMode,
    primitiveCount: frame.admittedPrimitives.length,
    presentationAssignments: frame.presentationAssignments.map((assignment) => ({
      primitiveId: assignment.primitiveId,
      sourceObjectId: assignment.sourceObjectId,
      materialReference: assignment.materialReference,
      materialIntent: assignment.materialIntent,
      presentationRole: assignment.presentationRole,
      renderLayer: assignment.renderLayer
    }))
  },
  renderer: {
    constructionStatus: construction.status,
    projectedDescriptorCount: construction.projectedDescriptorCount ?? null,
    nodeBudgetEvaluation: construction.nodeBudgetEvaluation ?? null
  },
  backwardCompatibility: {
    wetSandPacket002Ok: wetPacket.ok,
    wetSandIssueCount: wetPacket.issues?.length ?? null
  },
  claims: {
    fluidSimulation: false,
    visualPass: false,
    production: false
  }
};

await writeFile(
  `${outDir}/source-validation.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify(report, null, 2));
