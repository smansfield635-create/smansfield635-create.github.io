/** H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage,
  createHEarthRun8ER2GPUBufferViews
} from './live-render-package.run8e-r2.js';

const freezeRecord = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1';

export const H_EARTH_RUN_8E_R2D_GPU_FLOAT_CANONICALIZATION = freezeRecord({
  contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
  encodingClass: 'DECIMAL_CANONICALIZATION_BEFORE_FLOAT32_TRANSPORT',
  decimalPlaces: 6,
  scale: 1000000,
  appliedBuffers: Object.freeze(['normals', 'materialParameters']),
  unchangedBuffers: Object.freeze([
    'positions',
    'baseColorsLinear',
    'materialModelCodes',
    'surfaceClassCodes',
    'primitiveIndices',
    'roleCodes',
    'indices'
  ]),
  maximumPermittedAbsoluteAdjustment: 0.00000051,
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

export function createHEarthRun8ER2DCanonicalGPUUploadViews(
  packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage()
) {
  const rawViews = createHEarthRun8ER2GPUBufferViews(packageRecord);
  const canonicalNormals = canonicalFloat32(rawViews.normals, 'normals');
  const canonicalMaterialParameters = canonicalFloat32(
    rawViews.materialParameters,
    'materialParameters'
  );

  return freezeRecord({
    positions: new Float32Array(rawViews.positions),
    normals: canonicalNormals.view,
    baseColorsLinear: new Float32Array(rawViews.baseColorsLinear),
    materialParameters: canonicalMaterialParameters.view,
    materialModelCodes: new Uint8Array(rawViews.materialModelCodes),
    surfaceClassCodes: new Uint8Array(rawViews.surfaceClassCodes),
    primitiveIndices: new Uint16Array(rawViews.primitiveIndices),
    roleCodes: new Uint8Array(rawViews.roleCodes),
    indices: new Uint32Array(rawViews.indices),
    canonicalizationReceipt: freezeRecord({
      contractId: H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_CONTRACT_ID,
      packageIdentityAtSource: packageRecord.packageIdentity,
      packageContentDigestAtSource: packageRecord.contentDigest,
      normalBuffer: canonicalNormals.receipt,
      materialParameterBuffer: canonicalMaterialParameters.receipt,
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
