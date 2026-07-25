import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateHEarthCapacityCameraEnvelope } from './h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs';
import { validateCustody } from './h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs';
import { evaluateStageSeparatedCapacity } from './h-earth-capacity-camera-renderer-correspondence-h4-evaluator.mjs';

const here = dirname(fileURLToPath(import.meta.url));

export const H5_CONTRACT = deepFreeze(JSON.parse(await readFile(
  resolve(here, 'h-earth-capacity-camera-renderer-correspondence-h5-contract.json'),
  'utf8'
)));

export function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

const canonical = value => Array.isArray(value)
  ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
    : value;

export const digest = value =>
  createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');

export function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

export function validateH5Contract(candidate = H5_CONTRACT) {
  const expectedTaxonomy = [
    'H5_FAR_PLANE_TOO_SHORT',
    'H5_NEAR_PLANE_INVALID',
    'H5_TARGET_OUTSIDE_ALLOWED_BOUND',
    'H5_CAMERA_POSITION_OUTSIDE_ALLOWED_BOUND',
    'H5_FOV_OUTSIDE_ALLOWED_RANGE',
    'H5_PROJECTED_FRAGMENT_BUDGET_EXCEEDED',
    'H5_FINAL_DOM_NODE_BUDGET_EXCEEDED',
    'H5_REQUIRED_SOURCE_IDENTITY_MISMATCH',
    'H5_MISSING_CAPACITY_RECEIPT',
    'H5_MALFORMED_VIEWPORT_PROFILE'
  ];
  if (candidate.contractId !== H5_CONTRACT.contractId) fail('H5_CONTRACT_ID_MISMATCH');
  if (candidate.toolId !== H5_CONTRACT.toolId) fail('H5_TOOL_ID_MISMATCH');
  if (candidate.parentCheckpointCommit !== '21de52b4523e34408db4ffc2822efcda48d537b3') fail('H5_PARENT_CHECKPOINT_COMMIT_MISMATCH');
  if (candidate.sourceCommit !== 'ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e') fail('H5_SOURCE_COMMIT_MISMATCH');
  if (candidate.sourcePosture !== 'READ_ONLY_CONTROL_AND_FAILURE_TAXONOMY' || candidate.productionMutationAuthority !== 'NONE') fail('H5_AUTHORITY_BOUNDARY_INVALID');
  if (!Array.isArray(candidate.failureTaxonomy) || candidate.failureTaxonomy.length !== expectedTaxonomy.length || candidate.failureTaxonomy.some((code, index) => code !== expectedTaxonomy[index])) fail('H5_FAILURE_TAXONOMY_INVALID');
  const claims = candidate.claims;
  if (claims.rendererExecutionAuthorized !== false || claims.browserExecutionAuthorized !== false || claims.productionMutationAuthorized !== false || claims.productionFilesChanged !== 0 || claims.productionCorrectionStarted !== false || claims.h6Started !== false || claims.mergePerformed !== false) fail('H5_STOP_BOUNDARY_VIOLATION');
  return true;
}

const vectorFromRecord = value => [value.x, value.y, value.z];

export function createProductionCameraCandidate(productionFacts) {
  const camera = productionFacts?.camera;
  const viewport = productionFacts?.viewport;
  if (!camera || !viewport) fail('H5_PRODUCTION_FACTS_REQUIRED');
  return deepFreeze({
    cameraPosition: vectorFromRecord(camera.position),
    cameraTarget: vectorFromRecord(camera.target),
    verticalFieldOfViewDegrees: camera.verticalFovDegrees,
    nearPlane: camera.nearPlane,
    farPlane: camera.farPlane,
    yawDegrees: camera.yawDegrees.initialWaterwardYawDegrees,
    pitchDegrees: 0,
    viewportWidth: viewport.preferredDesignWidthPx,
    viewportHeight: viewport.preferredDesignHeightPx,
    devicePixelRatio: viewport.pixelRatioMinimum
  });
}

const withinVectorBounds = (vector, bounds) =>
  vector[0] >= bounds.xMin && vector[0] <= bounds.xMax &&
  vector[1] >= bounds.yMin && vector[1] <= bounds.yMax &&
  vector[2] >= bounds.zMin && vector[2] <= bounds.zMax;

const mapH1Error = error => {
  const mapping = {
    H1_FAR_PLANE_SHORTER_THAN_CAMERA_TARGET_DISTANCE: 'H5_FAR_PLANE_TOO_SHORT',
    H1_NEAR_PLANE_INVALID: 'H5_NEAR_PLANE_INVALID',
    H1_UNSUPPORTED_VIEWPORT_PROFILE: 'H5_MALFORMED_VIEWPORT_PROFILE',
    H1_CAMERA_INPUT_KEYS_INVALID: 'H5_MALFORMED_VIEWPORT_PROFILE'
  };
  const mapped = mapping[error.code];
  if (mapped) fail(mapped, { parentCode: error.code, parentDetails: error.details ?? null });
  throw error;
};

export function evaluateH5CameraCandidate(candidate, productionFacts) {
  validateH5Contract();
  const cameraFacts = productionFacts?.camera;
  if (!cameraFacts) fail('H5_PRODUCTION_CAMERA_FACTS_REQUIRED');
  if (!Array.isArray(candidate?.cameraPosition) || candidate.cameraPosition.length !== 3 || !candidate.cameraPosition.every(Number.isFinite)) fail('H5_CAMERA_POSITION_OUTSIDE_ALLOWED_BOUND');
  if (!Array.isArray(candidate?.cameraTarget) || candidate.cameraTarget.length !== 3 || !candidate.cameraTarget.every(Number.isFinite)) fail('H5_TARGET_OUTSIDE_ALLOWED_BOUND');
  if (!withinVectorBounds(candidate.cameraPosition, cameraFacts.positionBounds)) fail('H5_CAMERA_POSITION_OUTSIDE_ALLOWED_BOUND', { candidate: candidate.cameraPosition, bounds: cameraFacts.positionBounds });
  if (!withinVectorBounds(candidate.cameraTarget, cameraFacts.targetBounds)) fail('H5_TARGET_OUTSIDE_ALLOWED_BOUND', { candidate: candidate.cameraTarget, bounds: cameraFacts.targetBounds });
  if (!Number.isFinite(candidate.verticalFieldOfViewDegrees) || candidate.verticalFieldOfViewDegrees < cameraFacts.verticalFovCapacity.minimum || candidate.verticalFieldOfViewDegrees > cameraFacts.verticalFovCapacity.maximum) fail('H5_FOV_OUTSIDE_ALLOWED_RANGE', { candidate: candidate.verticalFieldOfViewDegrees, bounds: cameraFacts.verticalFovCapacity });
  try {
    return evaluateHEarthCapacityCameraEnvelope(candidate);
  } catch (error) {
    return mapH1Error(error);
  }
}

export function evaluateH5CapacityCandidate(candidate) {
  validateH5Contract();
  const receipt = evaluateStageSeparatedCapacity(candidate);
  if (receipt.terminalClassification === 'PROJECTED_FRAGMENT_BUDGET_NOT_MET') fail('H5_PROJECTED_FRAGMENT_BUDGET_EXCEEDED', { parentReceipt: receipt });
  if (receipt.terminalClassification === 'FINAL_DOM_NODE_BUDGET_EXCEEDED') fail('H5_FINAL_DOM_NODE_BUDGET_EXCEEDED', { parentReceipt: receipt });
  return receipt;
}

export function verifyH5RequiredSourceIdentity(records) {
  try {
    validateCustody(records);
    return true;
  } catch (error) {
    if (['H2_SOURCE_BLOB_MISMATCH', 'H2_SOURCE_PATH_MISMATCH', 'H2_SOURCE_CUSTODY_RECORD_COUNT_MISMATCH'].includes(error.code)) {
      fail('H5_REQUIRED_SOURCE_IDENTITY_MISMATCH', { parentCode: error.code, parentDetails: error.details ?? null });
    }
    throw error;
  }
}

export function requireH5CapacityReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object') fail('H5_MISSING_CAPACITY_RECEIPT');
  if (receipt.contractId !== 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H4_STAGE_EVALUATION_RECEIPT_v1' || !/^[0-9a-f]{64}$/.test(receipt.deterministicReceiptSha256 ?? '')) fail('H5_CAPACITY_RECEIPT_INVALID');
  return receipt;
}

export function classifyH5ToolProductRelation({ toolReceipt, productReceipt }) {
  if (toolReceipt?.status !== 'PASS') fail('H5_TOOL_RECEIPT_NOT_PASS');
  requireH5CapacityReceipt(productReceipt);
  const productBlockedOrFailed = productReceipt.earliestNonPassStage !== null;
  return deepFreeze({
    toolExecution: 'PASS',
    productCapacityResult: productBlockedOrFailed ? 'BLOCKED_OR_FAILED' : 'PASS',
    toolFailure: false,
    classification: productBlockedOrFailed
      ? 'TOOL_PASS_PRODUCT_CAPACITY_BLOCKED_OR_FAILED'
      : 'TOOL_PASS_PRODUCT_CAPACITY_PASS'
  });
}

export function createH5PositiveControl({ cameraCandidate, productionFacts, capacityCandidate, visibleOutputRatio }) {
  const cameraResult = evaluateH5CameraCandidate(cameraCandidate, productionFacts);
  const capacityResult = evaluateH5CapacityCandidate(capacityCandidate);
  if (cameraResult.terminalClassification !== 'CAMERA_AND_FRUSTUM_CONTRACT_ELIGIBLE') fail('H5_POSITIVE_CAMERA_RESULT_INVALID');
  if (capacityResult.terminalClassification !== 'CAPACITY_ELIGIBLE') fail('H5_POSITIVE_CAPACITY_RESULT_INVALID');
  if (!Number.isFinite(visibleOutputRatio) || visibleOutputRatio < H5_CONTRACT.positiveControl.minimumVisibleOutputRatio || visibleOutputRatio > 1) fail('H5_POSITIVE_VISIBLE_OUTPUT_THRESHOLD_NOT_MET');
  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H5_POSITIVE_CONTROL_RECEIPT_v1',
    toolId: H5_CONTRACT.toolId,
    checkpoint: 'H5',
    status: 'PASS',
    terminalClassification: H5_CONTRACT.positiveControl.requiredTerminalClassification,
    cameraEnvelopeEligible: true,
    depthEligibility: 'PASS',
    frustumEligibility: 'PASS',
    projectedFragmentCapacity: 'PASS',
    finalDomCapacity: 'PASS',
    visibleOutputThreshold: 'PASS',
    visibleOutputRatio,
    cameraResult,
    capacityResult,
    claims: {
      controlledFixtureOnly: true,
      productionCapacityPassClaim: false,
      rendererExecutionPerformed: false,
      browserExecutionPerformed: false,
      productionFilesChanged: 0
    }
  };
  return deepFreeze({ ...body, deterministicReceiptSha256: digest(body) });
}
