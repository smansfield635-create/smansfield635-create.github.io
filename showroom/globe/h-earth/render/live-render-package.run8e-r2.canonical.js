/** H_EARTH_RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_v2 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage as getRawPackage,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackage
} from './live-render-package.run8e-r2.js';

const GRID_SCALE = 16777216;
const FLOAT_BUFFER_NAMES = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters'
]);
const HASH_BUFFER_ORDER = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters',
  'materialModelCodes',
  'surfaceClassCodes',
  'primitiveIndices',
  'roleCodes',
  'indices'
]);

const freezeArray = values => Object.freeze(Array.from(values));
const freezeRecord = value => Object.freeze(value);

function canonicalNumber(value) {
  if (!Number.isFinite(value)) throw new TypeError('R2_CANONICAL_NONFINITE_NUMBER');
  const rounded = Math.round(value * GRID_SCALE) / GRID_SCALE;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function canonicalizeBuffers(buffers) {
  const output = {};
  for (const name of HASH_BUFFER_ORDER) {
    const values = buffers[name];
    output[name] = FLOAT_BUFFER_NAMES.includes(name)
      ? freezeArray(values.map(canonicalNumber))
      : freezeArray(values);
  }
  return freezeRecord(output);
}

function createHashWriter() {
  let hash = 0x811c9dc5;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const encoder = new TextEncoder();
  const byte = value => {
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

function buildCanonicalPackage() {
  const raw = getRawPackage();
  if (raw?.eligible !== true) return raw;

  const buffers = canonicalizeBuffers(raw.buffers);
  const hash = createHashWriter();
  hash.string(raw.sourceAuthorities.run8ER2ContractId);
  hash.string(raw.sourceAuthorities.packet002TransferContractId);
  hash.string(raw.sourceAuthorities.run8CMaterialContractId);
  hash.string(raw.sourceAuthorities.atmosphereContractId);
  for (const primitiveId of raw.primitiveIds) hash.string(primitiveId);
  for (const name of HASH_BUFFER_ORDER) hash.numbers(buffers[name]);

  const digest = hash.digest();
  const packageRecord = freezeRecord({
    ...raw,
    packageIdentity: `H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_${digest.toUpperCase()}`,
    contentDigest: `fnv1a32:${digest}`,
    revision: 2,
    buffers,
    sourceAuthorities: freezeRecord({
      ...raw.sourceAuthorities,
      numericIdentityBoundary: 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY',
      numericCanonicalizationLaw: 'ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO',
      canonicalizedFloatBuffers: FLOAT_BUFFER_NAMES
    })
  });

  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord);
  if (evaluation.eligible !== true) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: raw.contractId,
      issues: evaluation.issues
    });
  }
  return packageRecord;
}

let cachedCanonicalPackage = null;
let runtimePackageOverride = null;
let runtimeRendererCompatibilityPackage = null;
let runtimePackageOverrideReceipt = null;

function canonicalSourcePackage() {
  if (!cachedCanonicalPackage) cachedCanonicalPackage = buildCanonicalPackage();
  return cachedCanonicalPackage;
}

function evaluateRuntimePackageOverride(packageRecord, canonicalPackage) {
  const issues = [];
  if (packageRecord?.eligible !== true) issues.push('R2_RUNTIME_OVERRIDE_NOT_ELIGIBLE');
  if (!/^H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_[0-9A-F]{8}$/.test(packageRecord?.packageIdentity ?? '')) {
    issues.push('R2_RUNTIME_OVERRIDE_IDENTITY_INVALID');
  }
  if (!/^fnv1a32:[0-9a-f]{8}$/.test(packageRecord?.contentDigest ?? '')) {
    issues.push('R2_RUNTIME_OVERRIDE_DIGEST_INVALID');
  }
  if (packageRecord?.parentPackageIdentity !== canonicalPackage?.packageIdentity) {
    issues.push('R2_RUNTIME_OVERRIDE_PARENT_IDENTITY_MISMATCH');
  }
  if (packageRecord?.parentPackageContentDigest !== canonicalPackage?.contentDigest) {
    issues.push('R2_RUNTIME_OVERRIDE_PARENT_DIGEST_MISMATCH');
  }
  if (packageRecord?.completeWorldBinding?.counters?.candidateSampleFailureCount !== 0) {
    issues.push('R2_RUNTIME_OVERRIDE_CANDIDATE_SAMPLE_FAILURES_PRESENT');
  }
  if (packageRecord?.completeWorldBinding?.counters?.boundTerrainVertexCount !== 10419) {
    issues.push('R2_RUNTIME_OVERRIDE_TERRAIN_BINDING_COUNT_MISMATCH');
  }
  if (packageRecord?.completeWorldBinding?.counters?.boundShorelineVertexCount !== 299) {
    issues.push('R2_RUNTIME_OVERRIDE_SHORELINE_BINDING_COUNT_MISMATCH');
  }
  if (!packageRecord?.buffers || !Array.isArray(packageRecord?.drawRanges)) {
    issues.push('R2_RUNTIME_OVERRIDE_RENDER_DATA_MISSING');
  }
  return freezeRecord({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'R2_RUNTIME_PACKAGE_OVERRIDE_PASS'
      : 'R2_RUNTIME_PACKAGE_OVERRIDE_FAIL',
    issues: freezeArray(issues)
  });
}

function createRendererCompatibilityPackage(packageRecord, canonicalPackage) {
  const compatibilityPackage = freezeRecord({
    ...packageRecord,
    packageIdentity: canonicalPackage.packageIdentity,
    contentDigest: canonicalPackage.contentDigest,
    runtimeCompatibilityAlias: true,
    integratedPackageIdentity: packageRecord.packageIdentity,
    integratedPackageContentDigest: packageRecord.contentDigest,
    integratedPackageParentIdentity: packageRecord.parentPackageIdentity,
    integratedPackageParentContentDigest: packageRecord.parentPackageContentDigest,
    sourceAuthorities: freezeRecord({
      ...packageRecord.sourceAuthorities,
      runtimeCompatibilityAliasContract:
        'H_EARTH_C2_R1_ACCEPTED_RENDERER_IDENTITY_COMPATIBILITY_ADAPTER_v1',
      rendererIdentityPreserved: true,
      integratedPackageIdentity: packageRecord.packageIdentity,
      integratedPackageContentDigest: packageRecord.contentDigest,
      packageBuffersMutatedByAlias: false
    })
  });
  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(
    compatibilityPackage
  );
  if (evaluation.eligible !== true) {
    throw new Error(
      `R2_RENDERER_COMPATIBILITY_PACKAGE_REJECTED:${evaluation.issues.join(',')}`
    );
  }
  return compatibilityPackage;
}

export function getHEarthRun8ER2CanonicalSourcePackage() {
  return canonicalSourcePackage();
}

export function getHEarthRun8ER2ExactIntegratedPackage() {
  return runtimePackageOverride;
}

export function installHEarthRun8ER2RuntimePackageOverride({
  packageRecord,
  operationId = 'UNSPECIFIED_RUNTIME_PACKAGE_OVERRIDE'
} = {}) {
  const canonicalPackage = canonicalSourcePackage();
  const evaluation = evaluateRuntimePackageOverride(packageRecord, canonicalPackage);
  if (evaluation.eligible !== true) {
    throw new Error(`R2_RUNTIME_PACKAGE_OVERRIDE_REJECTED:${evaluation.issues.join(',')}`);
  }
  if (runtimePackageOverride) {
    if (
      runtimePackageOverride.packageIdentity !== packageRecord.packageIdentity ||
      runtimePackageOverride.contentDigest !== packageRecord.contentDigest
    ) {
      throw new Error('R2_RUNTIME_PACKAGE_OVERRIDE_ALREADY_BOUND_TO_DIFFERENT_PACKAGE');
    }
    return runtimePackageOverrideReceipt;
  }
  runtimePackageOverride = packageRecord;
  runtimeRendererCompatibilityPackage = createRendererCompatibilityPackage(
    packageRecord,
    canonicalPackage
  );
  runtimePackageOverrideReceipt = freezeRecord({
    receiptType: 'H_EARTH_RUN_8E_R2_RUNTIME_PACKAGE_OVERRIDE_RECEIPT_v2',
    eligible: true,
    status: 'R2_RUNTIME_PACKAGE_OVERRIDE_ACTIVE',
    operationId,
    canonicalPackageIdentity: canonicalPackage.packageIdentity,
    canonicalPackageContentDigest: canonicalPackage.contentDigest,
    runtimePackageIdentity: packageRecord.packageIdentity,
    runtimePackageContentDigest: packageRecord.contentDigest,
    rendererCompatibilityPackageIdentity:
      runtimeRendererCompatibilityPackage.packageIdentity,
    rendererCompatibilityPackageContentDigest:
      runtimeRendererCompatibilityPackage.contentDigest,
    rendererCompatibilityAliasActive: true,
    rendererCompatibilityAliasContract:
      'H_EARTH_C2_R1_ACCEPTED_RENDERER_IDENTITY_COMPATIBILITY_ADAPTER_v1',
    exactIntegratedBuffersPresentedByAcceptedRenderer: true,
    boundTerrainVertexCount:
      packageRecord.completeWorldBinding.counters.boundTerrainVertexCount,
    boundShorelineVertexCount:
      packageRecord.completeWorldBinding.counters.boundShorelineVertexCount,
    candidateSampleFailureCount:
      packageRecord.completeWorldBinding.counters.candidateSampleFailureCount,
    canonicalSourcePackageMutated: false,
    runtimeSelectionOnly: true,
    publicDefaultPromotionPerformed: false
  });
  return runtimePackageOverrideReceipt;
}

export function getHEarthRun8ER2RuntimePackageSelectionReceipt() {
  const canonicalPackage = canonicalSourcePackage();
  return runtimePackageOverrideReceipt ?? freezeRecord({
    receiptType: 'H_EARTH_RUN_8E_R2_RUNTIME_PACKAGE_OVERRIDE_RECEIPT_v2',
    eligible: true,
    status: 'R2_CANONICAL_RUNTIME_PACKAGE_ACTIVE',
    operationId: null,
    canonicalPackageIdentity: canonicalPackage.packageIdentity,
    canonicalPackageContentDigest: canonicalPackage.contentDigest,
    runtimePackageIdentity: canonicalPackage.packageIdentity,
    runtimePackageContentDigest: canonicalPackage.contentDigest,
    rendererCompatibilityPackageIdentity: canonicalPackage.packageIdentity,
    rendererCompatibilityPackageContentDigest: canonicalPackage.contentDigest,
    rendererCompatibilityAliasActive: false,
    exactIntegratedBuffersPresentedByAcceptedRenderer: false,
    canonicalSourcePackageMutated: false,
    runtimeSelectionOnly: false,
    publicDefaultPromotionPerformed: false
  });
}

export function getHEarthRun8ER2CanonicalLiveRenderPackage() {
  return runtimeRendererCompatibilityPackage ?? canonicalSourcePackage();
}

export default getHEarthRun8ER2CanonicalLiveRenderPackage;
