/** H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1 */
import {
  H_EARTH_RUN_8E_R2_CONTRACT_ID,
  evaluateHEarthRun8ER2Control
} from '../../../../h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js';
import { buildHEarthRun8ENeutralPackage } from './run8e-successor-environment.js';
import { admitHEarthPrimitiveBatch } from './geometry-kernel.js';
import {
  H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
  buildHEarthRun8EPacket002SuccessorTransfer
} from '../../../../h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js';
import {
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';
import { H_EARTH_SURFACE_CLASSES } from '../../../../h-earth-3d/environment/h-earth.surface-state-field.js';
import { H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID } from './renderer.functional-landscape.js';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const freezeArray = (values) => Object.freeze(Array.from(values));
const freezeRecord = (value) => Object.freeze(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const srgb8ToLinear = (value) => {
  const srgb = clamp01(value / 255);
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};
const now = () => globalThis.performance?.now?.() ?? Date.now();

export const H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_SOURCE_FILE =
  '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/render/live-render-package.run8e-r2.js';

export const H_EARTH_RUN_8E_R2_MATERIAL_MODEL = freezeRecord({
  PRIMITIVE_RGBA: 0,
  RUN_8C_INTRINSIC_TERRAIN: 1
});

export const H_EARTH_RUN_8E_R2_ROLE_CODE = freezeRecord({
  TERRAIN: 1,
  SHORELINE: 2,
  VEGETATION: 3
});

const SURFACE_CLASS_CODES = freezeRecord(Object.fromEntries(
  H_EARTH_SURFACE_CLASSES.map((surfaceClass, index) => [surfaceClass, index])
));
const NON_TERRAIN_SURFACE_CLASS_CODE = 255;

function normalizeVector(x, y, z) {
  const length = Math.hypot(x, y, z);
  return length > Number.EPSILON
    ? { x: x / length, y: y / length, z: z / length }
    : null;
}

function deriveVertexNormals(vertices, indices) {
  const sums = Array.from({ length: vertices.length }, () => ({ x: 0, y: 0, z: 0 }));
  for (let offset = 0; offset + 2 < indices.length; offset += 3) {
    const ia = indices[offset];
    const ib = indices[offset + 1];
    const ic = indices[offset + 2];
    const a = vertices[ia];
    const b = vertices[ib];
    const c = vertices[ic];
    if (!a || !b || !c) continue;
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const abz = b.z - a.z;
    const acx = c.x - a.x;
    const acy = c.y - a.y;
    const acz = c.z - a.z;
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    for (const index of [ia, ib, ic]) {
      sums[index].x += nx;
      sums[index].y += ny;
      sums[index].z += nz;
    }
  }
  return sums.map((sum) => normalizeVector(sum.x, sum.y, sum.z));
}

function resolveNormals(geometry, issues, primitiveId) {
  const vertices = Array.isArray(geometry?.vertices) ? geometry.vertices : [];
  const supplied = Array.isArray(geometry?.normals) ? geometry.normals : [];
  if (supplied.length === vertices.length && supplied.every((normal) =>
    normal && [normal.x, normal.y, normal.z].every(finite))) {
    return { normals: supplied, source: 'SOURCE_GEOMETRY_NORMALS' };
  }
  const derived = deriveVertexNormals(vertices, geometry?.indices ?? []);
  if (derived.length !== vertices.length || derived.some((normal) => !normal)) {
    issues.push(`R2_NORMAL_DERIVATION_FAILED:${primitiveId}`);
    return { normals: [], source: 'FAILED' };
  }
  return { normals: derived, source: 'DETERMINISTIC_GEOMETRIC_DERIVATION' };
}

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

function functionalLandscapeMaterialDefaults(primitive) {
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

function resolvePrimitiveMaterialProjection(primitive, role, issues) {
  const materialReference = primitive?.materialHint?.materialReference ?? null;
  const materialIntent = primitive?.materialHint?.materialIntent ?? null;
  if (role === 'VEGETATION') {
    return {
      rgba: vegetationRgba(primitive),
      transparencyClass: 'OPAQUE',
      materialReference,
      materialIntent,
      sourceAuthorityContractId: 'H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1',
      projectionModel: 'EXISTING_RUN_8E_VEGETATION_COLOR_PROJECTION'
    };
  }
  const directRgba = primitive?.renderMaterial?.rgba;
  if (Array.isArray(directRgba) && directRgba.length === 4 && directRgba.every(finite)) {
    const directTransparency = primitive?.renderMaterial?.transparencyClass;
    return {
      rgba: [...directRgba],
      transparencyClass: typeof directTransparency === 'string' && directTransparency.length > 0
        ? directTransparency : 'OPAQUE',
      materialReference,
      materialIntent,
      sourceAuthorityContractId: 'DIRECT_PRIMITIVE_RENDER_MATERIAL',
      projectionModel: 'DIRECT_PRIMITIVE_RENDER_MATERIAL'
    };
  }
  if (role === 'SHORELINE' && (materialReference || materialIntent)) {
    return {
      ...functionalLandscapeMaterialDefaults(primitive),
      materialReference,
      materialIntent,
      sourceAuthorityContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
      projectionModel: 'EXACT_RUN_6D_MATERIAL_DEFAULTS'
    };
  }
  issues.push(`R2_PRIMITIVE_MATERIAL_PROJECTION_MISSING:${primitive.primitiveId}`);
  return {
    rgba: [0, 0, 0, 255],
    transparencyClass: 'OPAQUE',
    materialReference,
    materialIntent,
    sourceAuthorityContractId: null,
    projectionModel: 'REJECTED'
  };
}

function createHashWriter() {
  let hash = 0x811c9dc5;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const encoder = new TextEncoder();
  const byte = (value) => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  return {
    string(value) {
      for (const item of encoder.encode(String(value))) byte(item);
      byte(0xff);
    },
    number(value) {
      numberView.setFloat64(0, value, true);
      for (let index = 0; index < 8; index += 1) byte(numberView.getUint8(index));
    },
    numbers(values) {
      for (const value of values) this.number(value);
      byte(0xfe);
    },
    digest() {
      return hash.toString(16).padStart(8, '0');
    }
  };
}

function mergeDrawRange(ranges, candidate) {
  const previous = ranges[ranges.length - 1];
  if (previous &&
      previous.role === candidate.role &&
      previous.transparencyClass === candidate.transparencyClass &&
      previous.materialModelCode === candidate.materialModelCode &&
      previous.indexStart + previous.indexCount === candidate.indexStart) {
    previous.indexCount += candidate.indexCount;
    previous.primitiveCount += 1;
    previous.primitiveIds.push(candidate.primitiveId);
    return;
  }
  ranges.push({
    role: candidate.role,
    transparencyClass: candidate.transparencyClass,
    materialModelCode: candidate.materialModelCode,
    indexStart: candidate.indexStart,
    indexCount: candidate.indexCount,
    primitiveCount: 1,
    primitiveIds: [candidate.primitiveId]
  });
}

function freezeDrawRanges(ranges) {
  return freezeArray(ranges.map((range) => freezeRecord({
    ...range,
    primitiveIds: freezeArray(range.primitiveIds)
  })));
}

export function buildHEarthRun8ER2ImmutableLiveRenderPackage({
  timeOfDayHours = 15.25,
  defaultObserverElevation = 2.25,
  defaultViewDistance = 512,
  packageOccurrenceId = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_OCCURRENCE_001'
} = {}) {
  const startedAt = now();
  const issues = [];
  const control = evaluateHEarthRun8ER2Control();
  if (control.eligible !== true) issues.push(...control.issues);
  if (![timeOfDayHours, defaultObserverElevation, defaultViewDistance].every(finite)) {
    issues.push('R2_PACKAGE_ENVIRONMENT_INPUT_NONFINITE');
  }
  if (typeof packageOccurrenceId !== 'string' || packageOccurrenceId.trim().length === 0) {
    issues.push('R2_PACKAGE_OCCURRENCE_ID_INVALID');
  }

  const neutralPackage = buildHEarthRun8ENeutralPackage();
  if (neutralPackage?.ok !== true) issues.push(...(neutralPackage?.issues ?? ['R2_NEUTRAL_PACKAGE_FAILED']));
  const westAdmission = issues.length === 0
    ? admitHEarthPrimitiveBatch(neutralPackage.primitives, {
        frameId: `${packageOccurrenceId}:WEST_AGGREGATE`,
        metadata: { recoveryCheckpoint: 'RUN_8E_R2', packageClass: 'IMMUTABLE_LIVE_RENDER_PACKAGE' }
      })
    : null;
  if (westAdmission?.valid !== true) issues.push('R2_WEST_ADMISSION_FAILED');
  const transfer = issues.length === 0
    ? buildHEarthRun8EPacket002SuccessorTransfer({
        neutralPackage,
        westBatchAdmissionResult: westAdmission,
        transferOccurrenceId: `${packageOccurrenceId}:PACKET_002_TRANSFER`
      })
    : null;
  if (transfer?.ok !== true || transfer?.contractId !== H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID) {
    issues.push(...(transfer?.issues ?? ['R2_PACKET_002_TRANSFER_FAILED']));
  }

  const atmosphere = sampleHEarthAtmosphereState({
    timeOfDayHours,
    observerElevation: defaultObserverElevation,
    viewDistance: defaultViewDistance
  });
  const atmosphereEvaluation = evaluateHEarthAtmosphereStateSample(atmosphere);
  if (atmosphereEvaluation.eligible !== true) issues.push(...atmosphereEvaluation.issues);

  if (issues.length > 0) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
      issues: freezeArray(issues)
    });
  }

  const primitives = transfer.admittedPrimitives;
  const terrainPrimitiveId = neutralPackage.primitives[0]?.primitiveId;
  const positions = [];
  const normals = [];
  const baseColorsLinear = [];
  const materialParameters = [];
  const materialModelCodes = [];
  const surfaceClassCodes = [];
  const primitiveIndices = [];
  const roleCodes = [];
  const indices = [];
  const primitiveSpans = [];
  const drawRanges = [];
  const normalSourceCounts = { SOURCE_GEOMETRY_NORMALS: 0, DETERMINISTIC_GEOMETRIC_DERIVATION: 0 };
  const roleCounts = { TERRAIN: 0, SHORELINE: 0, VEGETATION: 0 };
  let vertexOffset = 0;

  primitives.forEach((primitive, primitiveIndex) => {
    const geometry = primitive.geometry;
    const vertices = Array.isArray(geometry?.vertices) ? geometry.vertices : [];
    const localIndices = Array.isArray(geometry?.indices) ? geometry.indices : [];
    const role = roleForPrimitive(primitive, terrainPrimitiveId);
    roleCounts[role] += 1;
    if (vertices.length === 0 || localIndices.length === 0 || localIndices.length % 3 !== 0) {
      issues.push(`R2_PRIMITIVE_GEOMETRY_INVALID:${primitive.primitiveId}`);
      return;
    }
    if (localIndices.some((index) => !Number.isSafeInteger(index) || index < 0 || index >= vertices.length)) {
      issues.push(`R2_PRIMITIVE_INDEX_INVALID:${primitive.primitiveId}`);
      return;
    }
    const resolvedNormals = resolveNormals(geometry, issues, primitive.primitiveId);
    normalSourceCounts[resolvedNormals.source] = (normalSourceCounts[resolvedNormals.source] ?? 0) + 1;
    const materialModelCode = role === 'TERRAIN'
      ? H_EARTH_RUN_8E_R2_MATERIAL_MODEL.RUN_8C_INTRINSIC_TERRAIN
      : H_EARTH_RUN_8E_R2_MATERIAL_MODEL.PRIMITIVE_RGBA;
    const primitiveMaterial = role === 'TERRAIN' ? null : resolvePrimitiveMaterialProjection(primitive, role, issues);
    const rgba = primitiveMaterial?.rgba ?? null;
    const transparencyClass = primitiveMaterial?.transparencyClass ?? 'OPAQUE';
    const indexStart = indices.length;

    vertices.forEach((vertex, localVertexIndex) => {
      if (!vertex || ![vertex.x, vertex.y, vertex.z].every(finite)) {
        issues.push(`R2_VERTEX_NONFINITE:${primitive.primitiveId}:${localVertexIndex}`);
        return;
      }
      const normal = resolvedNormals.normals[localVertexIndex];
      if (!normal || ![normal.x, normal.y, normal.z].every(finite)) {
        issues.push(`R2_NORMAL_NONFINITE:${primitive.primitiveId}:${localVertexIndex}`);
        return;
      }
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
      primitiveIndices.push(primitiveIndex);
      roleCodes.push(H_EARTH_RUN_8E_R2_ROLE_CODE[role]);
      materialModelCodes.push(materialModelCode);

      if (role === 'TERRAIN') {
        const material = sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x, vertex.z);
        const materialEvaluation = evaluateHEarthRun8CSuccessorSurfaceMaterial(material);
        if (materialEvaluation.eligible !== true) {
          issues.push(`R2_TERRAIN_MATERIAL_INVALID:${primitive.primitiveId}:${localVertexIndex}`);
          baseColorsLinear.push(0, 0, 0, 1);
          materialParameters.push(0, 0, 0, 0);
          surfaceClassCodes.push(NON_TERRAIN_SURFACE_CLASS_CODE);
        } else {
          baseColorsLinear.push(
            material.baseColorProfile.linearR,
            material.baseColorProfile.linearG,
            material.baseColorProfile.linearB,
            material.baseColorProfile.alpha
          );
          materialParameters.push(
            material.roughness,
            material.reflectance,
            material.wetness,
            material.curvature
          );
          surfaceClassCodes.push(SURFACE_CLASS_CODES[material.surfaceClass]);
        }
      } else {
        baseColorsLinear.push(
          srgb8ToLinear(rgba[0]),
          srgb8ToLinear(rgba[1]),
          srgb8ToLinear(rgba[2]),
          clamp01(rgba[3] / 255)
        );
        materialParameters.push(0, 0, 0, 0);
        surfaceClassCodes.push(NON_TERRAIN_SURFACE_CLASS_CODE);
      }
    });

    for (const localIndex of localIndices) indices.push(vertexOffset + localIndex);
    const span = freezeRecord({
      primitiveIndex,
      primitiveId: primitive.primitiveId,
      geometryId: geometry.geometryId,
      role,
      roleCode: H_EARTH_RUN_8E_R2_ROLE_CODE[role],
      materialModelCode,
      transparencyClass,
      normalSource: resolvedNormals.source,
      materialReference: primitiveMaterial?.materialReference ?? null,
      materialIntent: primitiveMaterial?.materialIntent ?? null,
      materialProjectionAuthorityContractId: primitiveMaterial?.sourceAuthorityContractId ?? null,
      materialProjectionModel: primitiveMaterial?.projectionModel ?? null,
      vertexStart: vertexOffset,
      vertexCount: vertices.length,
      indexStart,
      indexCount: localIndices.length,
      triangleCount: localIndices.length / 3
    });
    primitiveSpans.push(span);
    mergeDrawRange(drawRanges, { ...span, primitiveId: primitive.primitiveId });
    vertexOffset += vertices.length;
  });

  const vertexCount = positions.length / 3;
  const indexCount = indices.length;
  const triangleCount = indexCount / 3;
  if (issues.length > 0) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
      issues: freezeArray(issues)
    });
  }

  const immutableBuffers = freezeRecord({
    positions: freezeArray(positions),
    normals: freezeArray(normals),
    baseColorsLinear: freezeArray(baseColorsLinear),
    materialParameters: freezeArray(materialParameters),
    materialModelCodes: freezeArray(materialModelCodes),
    surfaceClassCodes: freezeArray(surfaceClassCodes),
    primitiveIndices: freezeArray(primitiveIndices),
    roleCodes: freezeArray(roleCodes),
    indices: freezeArray(indices)
  });
  const frozenPrimitiveSpans = freezeArray(primitiveSpans);
  const frozenDrawRanges = freezeDrawRanges(drawRanges);
  const hash = createHashWriter();
  hash.string(H_EARTH_RUN_8E_R2_CONTRACT_ID);
  hash.string(H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID);
  hash.string(H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID);
  hash.string(H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID);
  primitives.forEach((primitive) => hash.string(primitive.primitiveId));
  hash.numbers(immutableBuffers.positions);
  hash.numbers(immutableBuffers.normals);
  hash.numbers(immutableBuffers.baseColorsLinear);
  hash.numbers(immutableBuffers.materialParameters);
  hash.numbers(immutableBuffers.materialModelCodes);
  hash.numbers(immutableBuffers.surfaceClassCodes);
  hash.numbers(immutableBuffers.primitiveIndices);
  hash.numbers(immutableBuffers.roleCodes);
  hash.numbers(immutableBuffers.indices);
  const contentDigest = `fnv1a32:${hash.digest()}`;

  const packageRecord = freezeRecord({
    eligible: true,
    status: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_COMPLETE',
    contractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
    packageOccurrenceId: packageOccurrenceId.trim(),
    packageIdentity: `H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_${hash.digest().toUpperCase()}`,
    contentDigest,
    revision: 1,
    cameraIndependent: true,
    viewportIndependent: true,
    worldBuiltOncePerPackageConstruction: true,
    westAdmissionPerformedOncePerPackageConstruction: true,
    packet002TransferPerformedOncePerPackageConstruction: true,
    webglContextCreated: false,
    renderLoopCreated: false,
    cameraAuthorityCreated: false,
    navigationAuthorityCreated: false,
    publicRouteBound: false,
    deploymentAuthority: false,
    primitiveCount: primitives.length,
    vertexCount,
    triangleCount,
    indexCount,
    roleCounts: freezeRecord({ ...roleCounts }),
    normalSourceCounts: freezeRecord({ ...normalSourceCounts }),
    bounds: transfer.bounds,
    primitiveIds: freezeArray(primitives.map((primitive) => primitive.primitiveId)),
    primitiveSpans: frozenPrimitiveSpans,
    drawRanges: frozenDrawRanges,
    buffers: immutableBuffers,
    environmentDefaults: freezeRecord({
      contractId: atmosphere.contractId,
      timeOfDayHours: atmosphere.timeOfDay.hours,
      observerElevation: atmosphere.observerElevation,
      viewDistance: atmosphere.viewDistance,
      sunDirection: freezeRecord({ ...atmosphere.sunDirection }),
      sunIntensity: atmosphere.sunIntensity,
      sunColor: freezeArray(atmosphere.sunColor),
      skyZenithColor: freezeArray(atmosphere.skyZenithColor),
      skyHorizonColor: freezeArray(atmosphere.skyHorizonColor),
      groundHazeColor: freezeArray(atmosphere.groundHazeColor),
      fogStartDistance: atmosphere.fogStartDistance,
      fogFalloff: atmosphere.fogFalloff,
      maximumFogFactor: atmosphere.maximumFogFactor,
      distanceDesaturationStrength: atmosphere.distanceDesaturationStrength
    }),
    sourceAuthorities: freezeRecord({
      run8ER2ContractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
      neutralPackageContractId: neutralPackage.contractId,
      westAdmissionContractId: transfer.westContractId,
      packet002TransferContractId: transfer.contractId,
      run8CMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
      functionalLandscapeRendererContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
      atmosphereContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      semanticAddressCount: transfer.semanticAddressCount,
      terrainAddressCount: transfer.terrainAddressCount,
      shorelineWaterAddressCount: transfer.shorelineWaterAddressCount,
      proxySummarizedAddressCount: transfer.proxySummarizedAddressCount,
      formationIds: freezeArray(transfer.formationIds),
      shorelineBandIds: freezeArray(transfer.shorelineBandIds),
      legacyProxyIncluded: transfer.legacyProxyIncluded,
      successorMountainIncluded: transfer.successorMountainIncluded
    }),
    constructionMilliseconds: now() - startedAt,
    issues: freezeArray([])
  });

  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord);
  if (evaluation.eligible !== true) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
      issues: evaluation.issues
    });
  }
  return packageRecord;
}

export function evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord) {
  const issues = [];
  const buffers = packageRecord?.buffers;
  const vertexCount = packageRecord?.vertexCount ?? 0;
  if (packageRecord?.eligible !== true) issues.push('R2_PACKAGE_NOT_ELIGIBLE');
  if (packageRecord?.contractId !== H_EARTH_RUN_8E_R2_CONTRACT_ID) issues.push('R2_PACKAGE_CONTRACT_MISMATCH');
  if (packageRecord?.primitiveCount !== 35) issues.push(`R2_PRIMITIVE_COUNT_INVALID:${packageRecord?.primitiveCount}`);
  if (packageRecord?.triangleCount !== 49040) issues.push(`R2_TRIANGLE_COUNT_INVALID:${packageRecord?.triangleCount}`);
  if (packageRecord?.indexCount !== 147120) issues.push(`R2_INDEX_COUNT_INVALID:${packageRecord?.indexCount}`);
  if (!buffers || !Object.isFrozen(buffers)) issues.push('R2_BUFFERS_NOT_FROZEN');
  const expectedLengths = {
    positions: vertexCount * 3,
    normals: vertexCount * 3,
    baseColorsLinear: vertexCount * 4,
    materialParameters: vertexCount * 4,
    materialModelCodes: vertexCount,
    surfaceClassCodes: vertexCount,
    primitiveIndices: vertexCount,
    roleCodes: vertexCount,
    indices: packageRecord?.indexCount ?? 0
  };
  for (const [name, length] of Object.entries(expectedLengths)) {
    if (!Array.isArray(buffers?.[name]) || buffers[name].length !== length) issues.push(`R2_BUFFER_LENGTH_INVALID:${name}`);
    if (!Object.isFrozen(buffers?.[name])) issues.push(`R2_BUFFER_NOT_FROZEN:${name}`);
    if (Array.isArray(buffers?.[name]) && buffers[name].some((value) => !finite(value))) issues.push(`R2_BUFFER_NONFINITE:${name}`);
  }
  if (Array.isArray(buffers?.indices) && buffers.indices.some((index) =>
    !Number.isSafeInteger(index) || index < 0 || index >= vertexCount)) {
    issues.push('R2_INDEX_OUT_OF_RANGE');
  }
  if (!Object.isFrozen(packageRecord?.primitiveSpans) || packageRecord?.primitiveSpans?.length !== 35) {
    issues.push('R2_PRIMITIVE_SPANS_INVALID');
  }
  const primitiveIndexCoverage = (packageRecord?.primitiveSpans ?? []).reduce((sum, span) => sum + span.indexCount, 0);
  if (primitiveIndexCoverage !== packageRecord?.indexCount) issues.push('R2_PRIMITIVE_SPAN_COVERAGE_INVALID');
  const drawIndexCoverage = (packageRecord?.drawRanges ?? []).reduce((sum, range) => sum + range.indexCount, 0);
  if (drawIndexCoverage !== packageRecord?.indexCount) issues.push('R2_DRAW_RANGE_COVERAGE_INVALID');
  let expectedStart = 0;
  for (const range of packageRecord?.drawRanges ?? []) {
    if (range.indexStart !== expectedStart) issues.push('R2_DRAW_RANGE_NOT_CONTIGUOUS');
    expectedStart += range.indexCount;
  }
  if (packageRecord?.cameraIndependent !== true || 'camera' in (packageRecord ?? {})) issues.push('R2_CAMERA_INDEPENDENCE_FAILED');
  if (packageRecord?.viewportIndependent !== true || 'viewport' in (packageRecord ?? {})) issues.push('R2_VIEWPORT_INDEPENDENCE_FAILED');
  if (packageRecord?.webglContextCreated !== false || packageRecord?.renderLoopCreated !== false) issues.push('R2_RENDERER_BOUNDARY_FAILED');
  if (packageRecord?.publicRouteBound !== false || packageRecord?.deploymentAuthority !== false) issues.push('R2_ROUTE_BOUNDARY_FAILED');
  if (packageRecord?.sourceAuthorities?.semanticAddressCount !== 256) issues.push('R2_SEMANTIC_PROVENANCE_INVALID');
  if (packageRecord?.sourceAuthorities?.legacyProxyIncluded !== false ||
      packageRecord?.sourceAuthorities?.successorMountainIncluded !== true) {
    issues.push('R2_SUCCESSOR_GEOMETRY_DISPOSITION_INVALID');
  }
  return freezeRecord({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_PASS' : 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_FAIL',
    issues: freezeArray(issues)
  });
}

export function createHEarthRun8ER2GPUBufferViews(packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage()) {
  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord);
  if (evaluation.eligible !== true) {
    throw new Error(`R2_GPU_VIEW_SOURCE_INVALID:${evaluation.issues.join(',')}`);
  }
  return freezeRecord({
    positions: new Float32Array(packageRecord.buffers.positions),
    normals: new Float32Array(packageRecord.buffers.normals),
    baseColorsLinear: new Float32Array(packageRecord.buffers.baseColorsLinear),
    materialParameters: new Float32Array(packageRecord.buffers.materialParameters),
    materialModelCodes: new Uint8Array(packageRecord.buffers.materialModelCodes),
    surfaceClassCodes: new Uint8Array(packageRecord.buffers.surfaceClassCodes),
    primitiveIndices: new Uint16Array(packageRecord.buffers.primitiveIndices),
    roleCodes: new Uint8Array(packageRecord.buffers.roleCodes),
    indices: new Uint32Array(packageRecord.buffers.indices),
    copyOnRequest: true,
    packageIdentity: packageRecord.packageIdentity
  });
}

let cachedPackage = null;

export function getHEarthRun8ER2ImmutableLiveRenderPackage() {
  if (!cachedPackage) cachedPackage = buildHEarthRun8ER2ImmutableLiveRenderPackage();
  return cachedPackage;
}

export default getHEarthRun8ER2ImmutableLiveRenderPackage;
