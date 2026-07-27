import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_RUN_8E_R2C_CONTROL,
  H_EARTH_RUN_8E_R2C_CONTRACT_ID,
  evaluateHEarthRun8ER2CControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2c.source-authority-correspondence.js';
import {
  H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,
  buildHEarthRun8ENeutralPackage
} from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';
import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  admitHEarthPrimitiveBatch
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';
import {
  H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID,
  H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
  buildHEarthRun8EPacket002SuccessorTransfer
} from '../integration/h-earth.run8e-successor-environment-transfer.js';
import {
  H_EARTH_RUN_8E_R2_MATERIAL_MODEL,
  H_EARTH_RUN_8E_R2_ROLE_CODE,
  buildHEarthRun8ER2ImmutableLiveRenderPackage
} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from '../environment/h-earth.successor-surface-material.run8c.js';
import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../environment/h-earth.atmosphere-state.js';
import { H_EARTH_SURFACE_CLASSES } from '../environment/h-earth.surface-state-field.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID } from '../../showroom/globe/h-earth/render/renderer.functional-landscape.js';

const R2B_RECEIPT_PATH = new URL(
  './run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json',
  import.meta.url
);
const r2BReceipt = JSON.parse(fs.readFileSync(R2B_RECEIPT_PATH, 'utf8'));

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const canonical = (values) => [...new Set(values)].sort();
const digest = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const srgb8ToLinear = (value) => {
  const srgb = clamp01(value / 255);
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};
const exactArray = (actual, expected, message) => assert.deepEqual(Array.from(actual), Array.from(expected), message);

function roleForPrimitive(primitive, terrainPrimitiveId) {
  if (primitive.primitiveId === terrainPrimitiveId) return 'TERRAIN';
  if (primitive.metadata?.run8DInstanceId) return 'VEGETATION';
  return 'SHORELINE';
}

function vegetationRgba(primitive) {
  const intent = String(primitive?.materialHint?.materialIntent ?? '');
  if (intent.includes('TRUNK') || intent.includes('WOODY')) return [89, 63, 39, 255];
  if (intent.includes('CONIFER')) return [38, 73, 48, 255];
  if (intent.includes('SHRUB')) return [52, 94, 52, 255];
  return [78, 126, 65, 255];
}

function shorelineProjection(primitive) {
  const intent = primitive?.materialHint?.materialIntent ??
    primitive?.materialHint?.materialReference ?? 'DEFAULT';
  if (String(intent).includes('WATER')) {
    return { rgba: [46, 118, 144, 210], transparencyClass: 'TRANSLUCENT' };
  }
  if (String(intent).includes('FOAM')) {
    return { rgba: [232, 242, 235, 190], transparencyClass: 'TRANSLUCENT' };
  }
  if (String(intent).includes('HIGHLAND') || String(intent).includes('DISTANT')) {
    return { rgba: [68, 83, 79, 255], transparencyClass: 'OPAQUE' };
  }
  return { rgba: [116, 103, 73, 255], transparencyClass: 'OPAQUE' };
}

function expectedDrawRanges(spans) {
  const ranges = [];
  for (const span of spans) {
    const prior = ranges.at(-1);
    if (prior &&
        prior.role === span.role &&
        prior.transparencyClass === span.transparencyClass &&
        prior.materialModelCode === span.materialModelCode &&
        prior.indexStart + prior.indexCount === span.indexStart) {
      prior.indexCount += span.indexCount;
      prior.primitiveCount += 1;
      prior.primitiveIds.push(span.primitiveId);
    } else {
      ranges.push({
        role: span.role,
        transparencyClass: span.transparencyClass,
        materialModelCode: span.materialModelCode,
        indexStart: span.indexStart,
        indexCount: span.indexCount,
        primitiveCount: 1,
        primitiveIds: [span.primitiveId]
      });
    }
  }
  return ranges;
}

const control = evaluateHEarthRun8ER2CControl(H_EARTH_RUN_8E_R2C_CONTROL);
assert.equal(control.eligible, true, `R2C_CONTROL_FAILED:${control.issues.join(',')}`);
assert.equal(r2BReceipt.status, 'RUN_8E_R2B_PASS_CLOSED');
assert.equal(r2BReceipt.checkpointDisposition.run8ER2B, 'PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2C_CONTROL.predecessor.exactHead,
  '39de87edefcc037eaafa8a988dc0c84e40e3d1ba');
assert.equal(r2BReceipt.validatedCustody.packageIdentity,
  'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25');
assert.equal(r2BReceipt.validatedCustody.contentDigest, 'fnv1a32:fd913c25');

const neutralPackage = buildHEarthRun8ENeutralPackage();
assert.equal(neutralPackage.ok, true, `R2C_NEUTRAL_PACKAGE_FAILED:${neutralPackage.issues.join(',')}`);
assert.equal(neutralPackage.contractId, H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID);
const westAdmission = admitHEarthPrimitiveBatch(neutralPackage.primitives, {
  frameId: 'H_EARTH_RUN_8E_R2C_CORRESPONDENCE_AUDIT:WEST_AGGREGATE',
  metadata: { recoveryCheckpoint: 'RUN_8E_R2C', auditClass: 'READ_ONLY_CORRESPONDENCE' }
});
assert.equal(westAdmission.valid, true, 'R2C_WEST_ADMISSION_FAILED');
const transfer = buildHEarthRun8EPacket002SuccessorTransfer({
  neutralPackage,
  westBatchAdmissionResult: westAdmission,
  transferOccurrenceId: 'H_EARTH_RUN_8E_R2C_CORRESPONDENCE_AUDIT:PACKET_002_TRANSFER'
});
assert.equal(transfer.ok, true, `R2C_TRANSFER_FAILED:${transfer.issues.join(',')}`);
const packageRecord = buildHEarthRun8ER2ImmutableLiveRenderPackage({
  packageOccurrenceId: 'H_EARTH_RUN_8E_R2C_CORRESPONDENCE_AUDIT:PACKAGE'
});
assert.equal(packageRecord.eligible, true, `R2C_PACKAGE_FAILED:${packageRecord.issues?.join(',')}`);
assert.equal(packageRecord.packageIdentity, r2BReceipt.validatedCustody.packageIdentity);
assert.equal(packageRecord.contentDigest, r2BReceipt.validatedCustody.contentDigest);

const admittedPrimitives = transfer.admittedPrimitives;
const admittedOrder = admittedPrimitives.map((primitive) => primitive.primitiveId);
assert.deepEqual(packageRecord.primitiveIds, admittedOrder, 'R2C_PRIMITIVE_ORDER_MISMATCH');
assert.deepEqual(canonical(packageRecord.primitiveIds), transfer.primitiveIds, 'R2C_PRIMITIVE_MEMBERSHIP_MISMATCH');
assert.equal(new Set(packageRecord.primitiveIds).size, 35, 'R2C_PRIMITIVE_ID_UNIQUENESS_FAILED');
assert.deepEqual(packageRecord.bounds, transfer.bounds, 'R2C_BOUNDS_MISMATCH');

const terrainPrimitiveId = neutralPackage.primitives[0].primitiveId;
const buffers = packageRecord.buffers;
let auditedVertexCount = 0;
let auditedIndexCount = 0;
let terrainVertexCount = 0;
let shorelineVertexCount = 0;
let vegetationVertexCount = 0;
let terrainMaterialSampleCount = 0;
let shorelineMaterialProjectionCount = 0;
let vegetationMaterialProjectionCount = 0;

for (let primitiveIndex = 0; primitiveIndex < admittedPrimitives.length; primitiveIndex += 1) {
  const primitive = admittedPrimitives[primitiveIndex];
  const span = packageRecord.primitiveSpans[primitiveIndex];
  const vertices = primitive.geometry.vertices;
  const sourceNormals = primitive.geometry.normals;
  const sourceIndices = primitive.geometry.indices;
  const role = roleForPrimitive(primitive, terrainPrimitiveId);
  const roleCode = H_EARTH_RUN_8E_R2_ROLE_CODE[role];

  assert.equal(span.primitiveIndex, primitiveIndex, `R2C_SPAN_PRIMITIVE_INDEX:${primitive.primitiveId}`);
  assert.equal(span.primitiveId, primitive.primitiveId, `R2C_SPAN_PRIMITIVE_ID:${primitive.primitiveId}`);
  assert.equal(span.geometryId, primitive.geometry.geometryId, `R2C_GEOMETRY_ID:${primitive.primitiveId}`);
  assert.equal(span.role, role, `R2C_ROLE:${primitive.primitiveId}`);
  assert.equal(span.roleCode, roleCode, `R2C_ROLE_CODE:${primitive.primitiveId}`);
  assert.equal(span.vertexCount, vertices.length, `R2C_VERTEX_COUNT:${primitive.primitiveId}`);
  assert.equal(span.indexCount, sourceIndices.length, `R2C_INDEX_COUNT:${primitive.primitiveId}`);
  assert.equal(span.triangleCount, sourceIndices.length / 3, `R2C_TRIANGLE_COUNT:${primitive.primitiveId}`);
  assert.equal(span.normalSource, 'SOURCE_GEOMETRY_NORMALS', `R2C_NORMAL_SOURCE:${primitive.primitiveId}`);
  assert.equal(Array.isArray(sourceNormals), true, `R2C_SOURCE_NORMALS_MISSING:${primitive.primitiveId}`);
  assert.equal(sourceNormals.length, vertices.length, `R2C_SOURCE_NORMAL_COUNT:${primitive.primitiveId}`);

  const flattenedPositions = vertices.flatMap((vertex) => [vertex.x, vertex.y, vertex.z]);
  const flattenedNormals = sourceNormals.flatMap((normal) => [normal.x, normal.y, normal.z]);
  exactArray(
    buffers.positions.slice(span.vertexStart * 3, (span.vertexStart + span.vertexCount) * 3),
    flattenedPositions,
    `R2C_POSITION_CORRESPONDENCE:${primitive.primitiveId}`
  );
  exactArray(
    buffers.normals.slice(span.vertexStart * 3, (span.vertexStart + span.vertexCount) * 3),
    flattenedNormals,
    `R2C_NORMAL_CORRESPONDENCE:${primitive.primitiveId}`
  );
  exactArray(
    buffers.indices.slice(span.indexStart, span.indexStart + span.indexCount),
    sourceIndices.map((index) => index + span.vertexStart),
    `R2C_INDEX_CORRESPONDENCE:${primitive.primitiveId}`
  );
  assert.equal(
    buffers.primitiveIndices.slice(span.vertexStart, span.vertexStart + span.vertexCount)
      .every((value) => value === primitiveIndex),
    true,
    `R2C_PRIMITIVE_INDEX_BUFFER:${primitive.primitiveId}`
  );
  assert.equal(
    buffers.roleCodes.slice(span.vertexStart, span.vertexStart + span.vertexCount)
      .every((value) => value === roleCode),
    true,
    `R2C_ROLE_CODE_BUFFER:${primitive.primitiveId}`
  );

  if (role === 'TERRAIN') {
    terrainVertexCount += vertices.length;
    assert.equal(span.materialModelCode, H_EARTH_RUN_8E_R2_MATERIAL_MODEL.RUN_8C_INTRINSIC_TERRAIN);
    assert.equal(span.transparencyClass, 'OPAQUE');
    assert.equal(span.materialProjectionAuthorityContractId, null);
    for (let localVertexIndex = 0; localVertexIndex < vertices.length; localVertexIndex += 1) {
      const vertex = vertices[localVertexIndex];
      const globalVertexIndex = span.vertexStart + localVertexIndex;
      const material = sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x, vertex.z);
      const evaluation = evaluateHEarthRun8CSuccessorSurfaceMaterial(material);
      assert.equal(evaluation.eligible, true, `R2C_TERRAIN_MATERIAL_INVALID:${localVertexIndex}`);
      exactArray(
        buffers.baseColorsLinear.slice(globalVertexIndex * 4, globalVertexIndex * 4 + 4),
        [
          material.baseColorProfile.linearR,
          material.baseColorProfile.linearG,
          material.baseColorProfile.linearB,
          material.baseColorProfile.alpha
        ],
        `R2C_TERRAIN_COLOR:${localVertexIndex}`
      );
      exactArray(
        buffers.materialParameters.slice(globalVertexIndex * 4, globalVertexIndex * 4 + 4),
        [material.roughness, material.reflectance, material.wetness, material.curvature],
        `R2C_TERRAIN_PARAMETERS:${localVertexIndex}`
      );
      assert.equal(buffers.surfaceClassCodes[globalVertexIndex], H_EARTH_SURFACE_CLASSES.indexOf(material.surfaceClass));
      assert.equal(buffers.materialModelCodes[globalVertexIndex], H_EARTH_RUN_8E_R2_MATERIAL_MODEL.RUN_8C_INTRINSIC_TERRAIN);
      terrainMaterialSampleCount += 1;
    }
  } else {
    const materialReference = primitive.materialHint?.materialReference ?? null;
    const materialIntent = primitive.materialHint?.materialIntent ?? null;
    assert.equal(span.materialReference, materialReference, `R2C_MATERIAL_REFERENCE:${primitive.primitiveId}`);
    assert.equal(span.materialIntent, materialIntent, `R2C_MATERIAL_INTENT:${primitive.primitiveId}`);
    const projection = role === 'SHORELINE'
      ? shorelineProjection(primitive)
      : { rgba: vegetationRgba(primitive), transparencyClass: 'OPAQUE' };
    const expectedAuthority = role === 'SHORELINE'
      ? H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID
      : H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID;
    const expectedModel = role === 'SHORELINE'
      ? 'EXACT_RUN_6D_MATERIAL_DEFAULTS'
      : 'EXISTING_RUN_8E_VEGETATION_COLOR_PROJECTION';
    assert.equal(span.materialProjectionAuthorityContractId, expectedAuthority,
      `R2C_MATERIAL_AUTHORITY:${primitive.primitiveId}`);
    assert.equal(span.materialProjectionModel, expectedModel,
      `R2C_MATERIAL_MODEL:${primitive.primitiveId}`);
    assert.equal(span.transparencyClass, projection.transparencyClass,
      `R2C_TRANSPARENCY:${primitive.primitiveId}`);
    assert.equal(span.materialModelCode, H_EARTH_RUN_8E_R2_MATERIAL_MODEL.PRIMITIVE_RGBA);
    const linear = [
      srgb8ToLinear(projection.rgba[0]),
      srgb8ToLinear(projection.rgba[1]),
      srgb8ToLinear(projection.rgba[2]),
      projection.rgba[3] / 255
    ];
    for (let localVertexIndex = 0; localVertexIndex < vertices.length; localVertexIndex += 1) {
      const globalVertexIndex = span.vertexStart + localVertexIndex;
      exactArray(
        buffers.baseColorsLinear.slice(globalVertexIndex * 4, globalVertexIndex * 4 + 4),
        linear,
        `R2C_NON_TERRAIN_COLOR:${primitive.primitiveId}:${localVertexIndex}`
      );
      exactArray(
        buffers.materialParameters.slice(globalVertexIndex * 4, globalVertexIndex * 4 + 4),
        [0, 0, 0, 0],
        `R2C_NON_TERRAIN_PARAMETERS:${primitive.primitiveId}:${localVertexIndex}`
      );
      assert.equal(buffers.surfaceClassCodes[globalVertexIndex], 255);
      assert.equal(buffers.materialModelCodes[globalVertexIndex], H_EARTH_RUN_8E_R2_MATERIAL_MODEL.PRIMITIVE_RGBA);
    }
    if (role === 'SHORELINE') {
      shorelineVertexCount += vertices.length;
      shorelineMaterialProjectionCount += 1;
    } else {
      vegetationVertexCount += vertices.length;
      vegetationMaterialProjectionCount += 1;
    }
  }

  auditedVertexCount += vertices.length;
  auditedIndexCount += sourceIndices.length;
}

assert.equal(auditedVertexCount, packageRecord.vertexCount);
assert.equal(auditedIndexCount, packageRecord.indexCount);
assert.equal(terrainMaterialSampleCount, terrainVertexCount);
assert.equal(shorelineMaterialProjectionCount, 7);
assert.equal(vegetationMaterialProjectionCount, 27);
assert.deepEqual(packageRecord.drawRanges, expectedDrawRanges(packageRecord.primitiveSpans),
  'R2C_DRAW_RANGE_GROUPING_MISMATCH');

const sourceAuthorities = packageRecord.sourceAuthorities;
assert.equal(sourceAuthorities.neutralPackageContractId, H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID);
assert.equal(sourceAuthorities.westAdmissionContractId, H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID);
assert.equal(sourceAuthorities.packet002TransferContractId, H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID);
assert.equal(sourceAuthorities.run8CMaterialContractId, H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID);
assert.equal(sourceAuthorities.functionalLandscapeRendererContractId, H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID);
assert.equal(sourceAuthorities.atmosphereContractId, H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID);

const semanticIds = transfer.semanticAddressIds;
const terrainIds = transfer.terrainAddressIds;
const shorelineIds = transfer.shorelineWaterAddressIds;
const proxyIds = transfer.proxySummarizedAddressIds;
assert.equal(semanticIds.length, transfer.semanticAddressCount);
assert.equal(terrainIds.length, transfer.terrainAddressCount);
assert.equal(shorelineIds.length, transfer.shorelineWaterAddressCount);
assert.equal(proxyIds.length, transfer.proxySummarizedAddressCount);
for (const values of [semanticIds, terrainIds, shorelineIds, proxyIds]) {
  assert.equal(new Set(values).size, values.length, 'R2C_SEMANTIC_ID_DUPLICATE');
}
const partition = [...terrainIds, ...shorelineIds, ...proxyIds];
assert.equal(partition.length, 256);
assert.equal(new Set(partition).size, 256, 'R2C_SEMANTIC_PARTITIONS_NOT_DISJOINT');
assert.deepEqual(canonical(partition), canonical(semanticIds), 'R2C_SEMANTIC_PARTITION_UNION_MISMATCH');
assert.equal(sourceAuthorities.semanticAddressCount, semanticIds.length);
assert.equal(sourceAuthorities.terrainAddressCount, terrainIds.length);
assert.equal(sourceAuthorities.shorelineWaterAddressCount, shorelineIds.length);
assert.equal(sourceAuthorities.proxySummarizedAddressCount, proxyIds.length);
assert.deepEqual(sourceAuthorities.formationIds, transfer.formationIds, 'R2C_FORMATION_PROVENANCE_MISMATCH');
assert.deepEqual(sourceAuthorities.shorelineBandIds, transfer.shorelineBandIds, 'R2C_SHORELINE_BAND_PROVENANCE_MISMATCH');
assert.equal(sourceAuthorities.legacyProxyIncluded, false);
assert.equal(sourceAuthorities.successorMountainIncluded, true);
assert.equal(transfer.legacyProxyPreservedOutsideSuccessorFrame, true);

const atmosphere = sampleHEarthAtmosphereState({
  timeOfDayHours: 15.25,
  observerElevation: 2.25,
  viewDistance: 512
});
const atmosphereEvaluation = evaluateHEarthAtmosphereStateSample(atmosphere);
assert.equal(atmosphereEvaluation.eligible, true, `R2C_ATMOSPHERE_INVALID:${atmosphereEvaluation.issues.join(',')}`);
const defaults = packageRecord.environmentDefaults;
assert.equal(defaults.contractId, atmosphere.contractId);
assert.equal(defaults.timeOfDayHours, atmosphere.timeOfDay.hours);
assert.equal(defaults.observerElevation, atmosphere.observerElevation);
assert.equal(defaults.viewDistance, atmosphere.viewDistance);
assert.deepEqual(defaults.sunDirection, atmosphere.sunDirection);
assert.equal(defaults.sunIntensity, atmosphere.sunIntensity);
assert.deepEqual(defaults.sunColor, atmosphere.sunColor);
assert.deepEqual(defaults.skyZenithColor, atmosphere.skyZenithColor);
assert.deepEqual(defaults.skyHorizonColor, atmosphere.skyHorizonColor);
assert.deepEqual(defaults.groundHazeColor, atmosphere.groundHazeColor);
assert.equal(defaults.fogStartDistance, atmosphere.fogStartDistance);
assert.equal(defaults.fogFalloff, atmosphere.fogFalloff);
assert.equal(defaults.maximumFogFactor, atmosphere.maximumFogFactor);
assert.equal(defaults.distanceDesaturationStrength, atmosphere.distanceDesaturationStrength);

const geometryCorrespondenceDigest = digest({
  primitiveIds: packageRecord.primitiveIds,
  primitiveSpans: packageRecord.primitiveSpans.map(({ materialReference, materialIntent, materialProjectionAuthorityContractId, materialProjectionModel, ...geometry }) => geometry),
  positions: buffers.positions,
  normals: buffers.normals,
  indices: buffers.indices,
  bounds: packageRecord.bounds
});
const materialCorrespondenceDigest = digest({
  spans: packageRecord.primitiveSpans.map((span) => ({
    primitiveId: span.primitiveId,
    role: span.role,
    materialModelCode: span.materialModelCode,
    transparencyClass: span.transparencyClass,
    materialReference: span.materialReference,
    materialIntent: span.materialIntent,
    materialProjectionAuthorityContractId: span.materialProjectionAuthorityContractId,
    materialProjectionModel: span.materialProjectionModel
  })),
  baseColorsLinear: buffers.baseColorsLinear,
  materialParameters: buffers.materialParameters,
  materialModelCodes: buffers.materialModelCodes,
  surfaceClassCodes: buffers.surfaceClassCodes
});
const provenanceCorrespondenceDigest = digest({
  sourceAuthorities,
  semanticAddressIds: semanticIds,
  terrainAddressIds: terrainIds,
  shorelineWaterAddressIds: shorelineIds,
  proxySummarizedAddressIds: proxyIds
});
const atmosphereCorrespondenceDigest = digest(defaults);
const sourceManifestDigest = digest(H_EARTH_RUN_8E_R2C_CONTROL.protectedSourceManifest);
const auditManifestDigest = digest({
  contractId: H_EARTH_RUN_8E_R2C_CONTRACT_ID,
  packageIdentity: packageRecord.packageIdentity,
  contentDigest: packageRecord.contentDigest,
  geometryCorrespondenceDigest,
  materialCorrespondenceDigest,
  provenanceCorrespondenceDigest,
  atmosphereCorrespondenceDigest,
  sourceManifestDigest
});

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R2C_SOURCE_AUTHORITY_CORRESPONDENCE_AUDIT_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2C_CORRESPONDENCE_AUDIT_PASS',
  generatedAt: new Date().toISOString(),
  contractId: H_EARTH_RUN_8E_R2C_CONTRACT_ID,
  predecessor: {
    run8ER2A: 'PASS_CLOSED',
    run8ER2B: 'PASS_CLOSED',
    r2BExactHead: H_EARTH_RUN_8E_R2C_CONTROL.predecessor.exactHead
  },
  package: {
    packageIdentity: packageRecord.packageIdentity,
    contentDigest: packageRecord.contentDigest,
    primitiveCount: packageRecord.primitiveCount,
    vertexCount: packageRecord.vertexCount,
    triangleCount: packageRecord.triangleCount,
    indexCount: packageRecord.indexCount,
    drawRangeCount: packageRecord.drawRanges.length
  },
  geometry: {
    auditedPrimitiveCount: admittedPrimitives.length,
    auditedVertexCount,
    auditedIndexCount,
    sourceNormalPrimitiveCount: packageRecord.normalSourceCounts.SOURCE_GEOMETRY_NORMALS,
    geometryIdsExact: true,
    positionsExact: true,
    topologyExact: true,
    normalsExact: true,
    boundsExact: true,
    primitiveOrderExact: true,
    geometryCorrespondenceDigest
  },
  materials: {
    terrainVertexCount,
    terrainMaterialSampleCount,
    shorelineVertexCount,
    shorelineMaterialProjectionCount,
    vegetationVertexCount,
    vegetationMaterialProjectionCount,
    run8CPerVertexChannelsExact: true,
    run6DShorelineProjectionExact: true,
    run8EVegetationProjectionExact: true,
    transparencyClassesExact: true,
    drawRangeGroupingExact: true,
    materialCorrespondenceDigest
  },
  provenance: {
    semanticAddressCount: semanticIds.length,
    terrainAddressCount: terrainIds.length,
    shorelineWaterAddressCount: shorelineIds.length,
    proxySummarizedAddressCount: proxyIds.length,
    semanticPartitionUnionExact: true,
    semanticPartitionsDisjoint: true,
    formationIdsExact: true,
    shorelineBandIdsExact: true,
    legacyProxyIncluded: false,
    successorMountainIncluded: true,
    provenanceCorrespondenceDigest
  },
  atmosphere: {
    defaultsExact: true,
    atmosphereCorrespondenceDigest
  },
  sourceCustody: {
    sourceManifestEntryCount: Object.keys(H_EARTH_RUN_8E_R2C_CONTROL.protectedSourceManifest).length,
    sourceManifestDigest
  },
  auditManifestDigest,
  boundaries: {
    packageSourceMutated: false,
    sourceAuthorityMutated: false,
    gpuResourceCreatedOrUploaded: false,
    webglContextCreated: false,
    renderLoopCreated: false,
    publicRouteBound: false,
    run8ER2DStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false,
    pixelIdentityRequired: false
  },
  issues: []
};

const outputDirectory = process.env.H_EARTH_RUN8E_R2C_OUTPUT;
if (outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, 'h-earth.run8e-r2c.correspondence-audit.receipt.json'),
    `${JSON.stringify(receipt, null, 2)}\n`
  );
}
console.log(JSON.stringify(receipt, null, 2));
