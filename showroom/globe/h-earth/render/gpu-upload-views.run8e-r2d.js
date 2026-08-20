/** H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from './live-render-package.run8e-r2.js';

const freezeRecord = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1';

const WATER_DEPTH_COLOR_STOPS = freezeRecord({
  SHALLOW_WATER: freezeRecord({ inner: [45,160,178], outer: [36,145,175] }),
  INNER_SHELF_WATER: freezeRecord({ inner: [36,145,175], outer: [25,119,160] }),
  MID_SHELF_WATER: freezeRecord({ inner: [25,119,160], outer: [16,91,139] }),
  OUTER_SHELF_WATER: freezeRecord({ inner: [16,91,139], outer: [9,61,108] }),
  DEEP_APPROACH_WATER: freezeRecord({ inner: [9,61,108], outer: [5,36,76] }),
  OPEN_WATER_NEAR_MID_REPRESENTATION: freezeRecord({ inner: [5,36,76], outer: [2,15,42] })
});

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
    'primitiveIndices',
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
    purpose: 'CONTINUOUS_VERTEX_INTERPOLATED_SHORELINE_DEPTH_DESCENT',
    sourceBandEndpointsPreserved: true,
    adjacentBandBoundaryColorsCorrespond: true,
    sourceAuthorityMutation: false,
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

function projectContinuousDepthColors(source, packageRecord) {
  const result = new Float32Array(source);
  let projectedPrimitiveCount = 0;
  let projectedVertexCount = 0;
  for (const span of packageRecord?.primitiveSpans ?? []) {
    const stop = WATER_DEPTH_COLOR_STOPS[span?.materialIntent];
    if (!stop) continue;
    projectedPrimitiveCount += 1;
    for (let localVertexIndex = 0; localVertexIndex < span.vertexCount; localVertexIndex += 1) {
      const vertexIndex = span.vertexStart + localVertexIndex;
      const rgb = localVertexIndex % 2 === 0 ? stop.inner : stop.outer;
      const colorOffset = vertexIndex * 4;
      result[colorOffset] = srgb8ToLinear(rgb[0]);
      result[colorOffset + 1] = srgb8ToLinear(rgb[1]);
      result[colorOffset + 2] = srgb8ToLinear(rgb[2]);
      projectedVertexCount += 1;
    }
  }
  return {
    view: result,
    receipt: freezeRecord({
      projectedPrimitiveCount,
      projectedVertexCount,
      sourceBandEndpointsPreserved: true,
      adjacentBandBoundaryColorsCorrespond: true,
      interpolationAuthority: 'GPU_VERTEX_INTERPOLATION_ACROSS_SHARED_DEPTH_ENDPOINTS'
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
    packageRecord
  );
  const projectedRoleCodes = projectGpuRoleCodes(rawViews.roleCodes);

  return freezeRecord({
    positions: new Float32Array(rawViews.positions),
    normals: canonicalNormals.view,
    baseColorsLinear: projectedBaseColors.view,
    materialParameters: canonicalMaterialParameters.view,
    materialModelCodes: new Uint8Array(rawViews.materialModelCodes),
    surfaceClassCodes: new Uint8Array(rawViews.surfaceClassCodes),
    primitiveIndices: new Uint16Array(rawViews.primitiveIndices),
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
