/** H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from './live-render-package.run8e-r2.js';
import { getHEarthCanonicalShorelineZ } from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const freezeRecord = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));

export const H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1';

const PLANET_RADIUS = 420000;
const WATER_MATERIAL_INTENTS = Object.freeze(new Set([
  'SHALLOW_WATER',
  'INNER_SHELF_WATER',
  'MID_SHELF_WATER',
  'OUTER_SHELF_WATER',
  'DEEP_APPROACH_WATER',
  'OPEN_WATER_NEAR_MID_REPRESENTATION',
  'ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON'
]));
const WATER_DEPTH_COLOR_CURVE = Object.freeze([
  Object.freeze({ depth: 0, rgb: Object.freeze([45, 160, 178]) }),
  Object.freeze({ depth: 10, rgb: Object.freeze([36, 145, 175]) }),
  Object.freeze({ depth: 28, rgb: Object.freeze([25, 119, 160]) }),
  Object.freeze({ depth: 56, rgb: Object.freeze([16, 91, 139]) }),
  Object.freeze({ depth: 96, rgb: Object.freeze([9, 61, 108]) }),
  Object.freeze({ depth: 160, rgb: Object.freeze([5, 36, 76]) }),
  Object.freeze({ depth: 320, rgb: Object.freeze([2, 15, 42]) })
]);

export const H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION = freezeRecord({
  contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
  encodingClass: 'DECIMAL_CANONICALIZATION_BEFORE_FLOAT32_TRANSPORT',
  decimalPlaces: 6,
  scale: 1000000,
  appliedBuffers: Object.freeze(['normals', 'materialParameters']),
  unchangedBuffers: Object.freeze([
    'positions',
    'materialModelCodes',
    'surfaceClassCodes',
    'indices'
  ]),
  presentationRoleProjection: freezeRecord({
    sourceShorelineRoleCode: 2,
    gpuDepthColorPreservingRoleCode: 4,
    purpose: 'BYPASS_CP2_HARDCODED_TEAL_WATER_OVERRIDE',
    semanticPackageRoleMutation: false,
    materialBufferMutation: false,
    geometryMutation: false
  }),
  presentationDepthColorProjection: freezeRecord({
    purpose: 'ONE_CANONICAL_COAST_DISTANCE_COLOR_LAW_ACROSS_LOCAL_AND_FAR_OCEAN',
    sourceMetric: 'GET_H_EARTH_CANONICAL_SHORELINE_Z',
    localAndFarOceanShareMetric: true,
    continuousVertexInterpolation: true,
    farOceanDepthClamp: 320,
    sourceAuthorityMutation: false,
    geometryMutation: false
  }),
  presentationPrimitiveSeedProjection: freezeRecord({
    purpose: 'REMOVE_PER_BAND_SHADER_VARIATION_SEAM_FOR_SHORELINE_AND_OCEAN',
    sourceShorelineRoleCode: 2,
    gpuPresentationPrimitiveIndex: 0,
    semanticPrimitiveIdentityMutation: false,
    drawRangeMutation: false,
    geometryMutation: false
  }),
  maximumPermittedAbsoluteAdjustment: 9.5367431640625e-7,
  sourceAuthorityMutation: false,
  packageSourceMutation: false,
  materialRetuning: false,
  normalRetuning: false,
  transportEncodingOnly: true
});

function canonicalDecimal(value) {
  if (!finite(value)) throw new TypeError('R2D_GPU_CANONICALIZATION_NONFINITE');
  const rounded = Number(value.toFixed(H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.decimalPlaces));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function canonicalFloat32(source, bufferName) {
  const result = new Float32Array(source.length);
  let adjustedElementCount = 0;
  let maximumAbsoluteAdjustment = 0;
  for (let index = 0; index < source.length; index += 1) {
    const before = source[index];
    const canonical = canonicalDecimal(before);
    const after = Math.fround(canonical);
    result[index] = after;
    const adjustment = Math.abs(after - before);
    if (adjustment > 0) adjustedElementCount += 1;
    if (adjustment > maximumAbsoluteAdjustment) maximumAbsoluteAdjustment = adjustment;
  }
  if (maximumAbsoluteAdjustment >
      H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.maximumPermittedAbsoluteAdjustment) {
    throw new RangeError(
      `R2D_GPU_CANONICALIZATION_ADJUSTMENT_EXCEEDED:${bufferName}:${maximumAbsoluteAdjustment}`
    );
  }
  return {
    view: result,
    receipt: freezeRecord({
      bufferName,
      elementCount: result.length,
      adjustedElementCount,
      maximumAbsoluteAdjustment,
      decimalPlaces: H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION.decimalPlaces
    })
  };
}

function srgb8ToLinear(value) {
  const normalized = Math.min(255, Math.max(0, Number(value))) / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function mixRgb(a, b, t) {
  const u = clamp01(t);
  return [0, 1, 2].map((index) => a[index] + (b[index] - a[index]) * u);
}

function waterRgbAtDepth(depth) {
  const d = Math.max(0, Number(depth) || 0);
  for (let index = 0; index < WATER_DEPTH_COLOR_CURVE.length - 1; index += 1) {
    const a = WATER_DEPTH_COLOR_CURVE[index];
    const b = WATER_DEPTH_COLOR_CURVE[index + 1];
    if (d <= b.depth) {
      const t = (d - a.depth) / Math.max(Number.EPSILON, b.depth - a.depth);
      return mixRgb(a.rgb, b.rgb, t);
    }
  }
  return [...WATER_DEPTH_COLOR_CURVE.at(-1).rgb];
}

function presentationPointToRegionXZ(x, z) {
  const horizontal = Math.hypot(x, z);
  if (horizontal <= Number.EPSILON) return { x: 0, z: 0, radialDistance: 0 };
  const ratio = Math.min(1, Math.max(-1, horizontal / PLANET_RADIUS));
  const radialDistance = Math.asin(ratio) * PLANET_RADIUS;
  const scale = radialDistance / horizontal;
  return { x: x * scale, z: z * scale, radialDistance };
}

function projectContinuousDepthColors(source, positions, packageRecord) {
  const result = new Float32Array(source);
  let projectedPrimitiveCount = 0;
  let projectedVertexCount = 0;
  let farOceanProjectedVertexCount = 0;
  let minimumDepth = Number.POSITIVE_INFINITY;
  let maximumDepth = 0;

  for (const span of packageRecord?.primitiveSpans ?? []) {
    if (!WATER_MATERIAL_INTENTS.has(span?.materialIntent)) continue;
    projectedPrimitiveCount += 1;
    const farOcean = span.materialIntent === 'ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON';

    for (let localVertexIndex = 0; localVertexIndex < span.vertexCount; localVertexIndex += 1) {
      const vertexIndex = span.vertexStart + localVertexIndex;
      const positionOffset = vertexIndex * 3;
      const projectedX = Number(positions[positionOffset]);
      const projectedZ = Number(positions[positionOffset + 2]);
      const region = presentationPointToRegionXZ(projectedX, projectedZ);
      const shorelineZ = getHEarthCanonicalShorelineZ(region.x);
      let depth = region.z - shorelineZ;

      // FAR horizon rings are deliberately all-ocean continuation. If a spherical
      // continuation vertex wraps behind the local coastline function, do not
      // invent a bright shallow shelf on the opposite hemisphere.
      if (farOcean && (region.radialDistance >= 6000 || depth < 0)) depth = 320;
      depth = Math.max(0, Math.min(320, depth));

      const rgb = waterRgbAtDepth(depth);
      const colorOffset = vertexIndex * 4;
      result[colorOffset] = srgb8ToLinear(rgb[0]);
      result[colorOffset + 1] = srgb8ToLinear(rgb[1]);
      result[colorOffset + 2] = srgb8ToLinear(rgb[2]);
      projectedVertexCount += 1;
      if (farOcean) farOceanProjectedVertexCount += 1;
      minimumDepth = Math.min(minimumDepth, depth);
      maximumDepth = Math.max(maximumDepth, depth);
    }
  }

  return {
    view: result,
    receipt: freezeRecord({
      projectedPrimitiveCount,
      projectedVertexCount,
      farOceanProjectedVertexCount,
      minimumDepth: Number.isFinite(minimumDepth) ? minimumDepth : null,
      maximumDepth,
      sourceMetric: 'CANONICAL_COAST_DISTANCE',
      localAndFarOceanShareMetric: true,
      interpolationAuthority: 'ONE_CONTINUOUS_DEPTH_COLOR_CURVE_ACROSS_ALL_WATER_VERTICES'
    })
  };
}

function projectGpuRoleCodes(source) {
  const result = new Uint8Array(source.length);
  let remappedElementCount = 0;
  for (let index = 0; index < source.length; index += 1) {
    const before = Number(source[index]);
    const after = before === 2 ? 4 : before;
    result[index] = after;
    if (after !== before) remappedElementCount += 1;
  }
  return {
    view: result,
    receipt: freezeRecord({
      sourceShorelineRoleCode: 2,
      gpuDepthColorPreservingRoleCode: 4,
      remappedElementCount,
      semanticPackageRoleMutation: false,
      materialBufferMutation: false
    })
  };
}

function projectGpuPrimitiveIndices(sourcePrimitiveIndices, sourceRoleCodes) {
  const result = new Uint16Array(sourcePrimitiveIndices.length);
  let remappedElementCount = 0;
  for (let index = 0; index < sourcePrimitiveIndices.length; index += 1) {
    const sourceRole = Number(sourceRoleCodes[index]);
    const before = Number(sourcePrimitiveIndices[index]);
    const after = sourceRole === 2 ? 0 : before;
    result[index] = after;
    if (after !== before) remappedElementCount += 1;
  }
  return {
    view: result,
    receipt: freezeRecord({
      sourceShorelineRoleCode: 2,
      gpuPresentationPrimitiveIndex: 0,
      remappedElementCount,
      semanticPrimitiveIdentityMutation: false,
      drawRangeMutation: false
    })
  };
}

export function createHEarthRun8ER2DCanonicalGPUUploadViews(
  packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage()
) {
  const rawViews = createHEarthRun8ER2GPUBufferViews(packageRecord);
  const canonicalNormals = canonicalFloat32(rawViews.normals, 'normals');
  const canonicalMaterialParameters = canonicalFloat32(
    rawViews.materialParameters,
    'materialParameters'
  );
  const projectedBaseColors = projectContinuousDepthColors(
    rawViews.baseColorsLinear,
    rawViews.positions,
    packageRecord
  );
  const projectedRoleCodes = projectGpuRoleCodes(rawViews.roleCodes);
  const projectedPrimitiveIndices = projectGpuPrimitiveIndices(
    rawViews.primitiveIndices,
    rawViews.roleCodes
  );

  return freezeRecord({
    positions: new Float32Array(rawViews.positions),
    normals: canonicalNormals.view,
    baseColorsLinear: projectedBaseColors.view,
    materialParameters: canonicalMaterialParameters.view,
    materialModelCodes: new Uint8Array(rawViews.materialModelCodes),
    surfaceClassCodes: new Uint8Array(rawViews.surfaceClassCodes),
    primitiveIndices: projectedPrimitiveIndices.view,
    roleCodes: projectedRoleCodes.view,
    indices: new Uint32Array(rawViews.indices),
    canonicalizationReceipt: freezeRecord({
      contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
      packageIdentityAtSource: packageRecord.packageIdentity,
      packageContentDigestAtSource: packageRecord.contentDigest,
      normalBuffer: canonicalNormals.receipt,
      materialParameterBuffer: canonicalMaterialParameters.receipt,
      depthColorProjection: projectedBaseColors.receipt,
      gpuRoleProjection: projectedRoleCodes.receipt,
      gpuPrimitiveSeedProjection: projectedPrimitiveIndices.receipt,
      sourcePackageMutated: false,
      transportEncodingOnly: true
    }),
    copyOnRequest: true,
    deterministicTransportEncoding: true,
    packageIdentity: packageRecord.packageIdentity
  });
}

export function evaluateHEarthRun8ER2DCanonicalGPUUploadViews(views) {
  const issues = [];
  const expected = {
    positions: Float32Array,
    normals: Float32Array,
    baseColorsLinear: Float32Array,
    materialParameters: Float32Array,
    materialModelCodes: Uint8Array,
    surfaceClassCodes: Uint8Array,
    primitiveIndices: Uint16Array,
    roleCodes: Uint8Array,
    indices: Uint32Array
  };
  for (const [key, Constructor] of Object.entries(expected)) {
    if (!(views?.[key] instanceof Constructor)) issues.push(`R2D_GPU_VIEW_TYPE_INVALID:${key}`);
  }
  if (views?.canonicalizationReceipt?.contractId !==
      H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID) {
    issues.push('R2D_GPU_CANONICALIZATION_RECEIPT_MISSING');
  }
  if (views?.deterministicTransportEncoding !== true) {
    issues.push('R2D_GPU_TRANSPORT_ENCODING_NOT_DETERMINISTIC');
  }
  return freezeRecord({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8E_R2D_CANONICAL_GPU_UPLOAD_VIEWS_PASS'
      : 'RUN_8E_R2D_CANONICAL_GPU_UPLOAD_VIEWS_FAIL',
    issues: Object.freeze(issues)
  });
}

export default createHEarthRun8ER2DCanonicalGPUUploadViews;
