import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const H6_CONTRACT = deepFreeze(JSON.parse(await readFile(
  resolve(here, 'h-earth-capacity-camera-renderer-correspondence-h6-contract.json'),
  'utf8'
)));

export function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function stableNormalize(value, seen = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'bigint') return String(value);
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return null;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.map(entry => stableNormalize(entry, seen));
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableNormalize(value[key], seen)]));
}

export const digest = value => createHash('sha256')
  .update(JSON.stringify(stableNormalize(value)))
  .digest('hex');

export function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

const REQUIRED_CORRESPONDENCE_CLASSIFICATIONS = Object.freeze([
  'CAPACITY_AUTHORITY_GAP_RENDERER_NODE_BUDGET_REJECTION_CORRESPONDS',
  'CAPACITY_PASS_RENDERER_PASS',
  'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_CORRESPONDS',
  'CAPACITY_PASS_RENDERER_NONCAPACITY_FAILURE',
  'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_PREMOUNT_IDENTITY_PRESERVED'
]);

export function validateH6Contract(candidate = H6_CONTRACT) {
  if (candidate.contractId !== H6_CONTRACT.contractId) fail('H6_CONTRACT_ID_MISMATCH');
  if (candidate.toolId !== 'H_EARTH_CAPACITY_CAMERA_AND_RENDERER_CORRESPONDENCE_VERIFIER_v1') fail('H6_TOOL_ID_MISMATCH');
  if (candidate.parentCheckpointCommit !== '15e23bf83b71e81748da404a83bfb34b2d09722d') fail('H6_PARENT_CHECKPOINT_COMMIT_MISMATCH');
  if (candidate.sourceCommit !== 'ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e') fail('H6_SOURCE_COMMIT_MISMATCH');
  if (candidate.sourcePosture !== 'READ_ONLY_INDEPENDENT_DUAL_INSTRUMENT_CORRESPONDENCE') fail('H6_SOURCE_POSTURE_INVALID');
  if (candidate.productionMutationAuthority !== 'NONE') fail('H6_PRODUCTION_MUTATION_AUTHORITY_PROHIBITED');
  if (candidate.rendererTool?.sourceCommit !== '546f6fc05174347ac797837d0b4844a2164c3cb3') fail('H6_RENDERER_TOOL_COMMIT_MISMATCH');
  if (!Array.isArray(candidate.rendererTool?.requiredFiles) || candidate.rendererTool.requiredFiles.length !== 4) fail('H6_RENDERER_TOOL_SOURCE_SET_INVALID');
  if (!Array.isArray(candidate.requiredCorrespondenceClassifications) ||
      candidate.requiredCorrespondenceClassifications.length !== REQUIRED_CORRESPONDENCE_CLASSIFICATIONS.length ||
      candidate.requiredCorrespondenceClassifications.some((value, index) => value !== REQUIRED_CORRESPONDENCE_CLASSIFICATIONS[index])) {
    fail('H6_REQUIRED_CORRESPONDENCE_CLASSIFICATIONS_INVALID');
  }
  const claims = candidate.claims;
  if (claims.rendererToolSourceMayBeCopiedIntoRepositoryHistory !== false || claims.productionMutationAuthorized !== false || claims.productionFilesChanged !== 0 || claims.productionCorrectionStarted !== false || claims.h7Started !== false || claims.mergePerformed !== false) fail('H6_STOP_BOUNDARY_VIOLATION');
  return true;
}

export function verifyRendererToolSourceCustody(custody) {
  validateH6Contract();
  if (!custody || custody.sourceCommit !== H6_CONTRACT.rendererTool.sourceCommit) fail('H6_RENDERER_TOOL_SOURCE_COMMIT_MISMATCH');
  if (!Array.isArray(custody.files) || custody.files.length !== H6_CONTRACT.rendererTool.requiredFiles.length) fail('H6_RENDERER_TOOL_SOURCE_FILE_COUNT_MISMATCH');
  H6_CONTRACT.rendererTool.requiredFiles.forEach((expected, index) => {
    const actual = custody.files[index];
    if (actual?.path !== expected.path) fail('H6_RENDERER_TOOL_SOURCE_PATH_MISMATCH', { index });
    if (actual?.gitBlob !== expected.gitBlob) fail('H6_RENDERER_TOOL_SOURCE_BLOB_MISMATCH', { index, expected: expected.gitBlob, actual: actual?.gitBlob });
  });
  return true;
}

export function verifyRendererReceiptDigest(receipt) {
  if (!receipt || typeof receipt !== 'object') fail('H6_RENDERER_RECEIPT_REQUIRED');
  const { deterministicReceiptSha256, ...body } = receipt;
  if (!/^[0-9a-f]{64}$/.test(deterministicReceiptSha256 ?? '')) fail('H6_RENDERER_RECEIPT_DIGEST_MISSING');
  const actual = digest(body);
  if (actual !== deterministicReceiptSha256) fail('H6_RENDERER_RECEIPT_DIGEST_MISMATCH', { expected: deterministicReceiptSha256, actual });
  return true;
}

function expectedIdsPreserved(profile) {
  const expected = profile?.objectIdentity?.expected;
  const observed = profile?.objectIdentity?.observed;
  return Array.isArray(expected) && expected.length === 3 && Array.isArray(observed) && expected.every(id => observed.includes(id));
}

function rendererProfileSummary(profile) {
  const receipt = profile?.construction?.receipt ?? null;
  const authority = receipt?.nodeBudgetEvaluation?.authorityEvaluation ?? null;
  const projectedEnvironmentPrimitiveCount = receipt?.nodeBudgetEvaluation?.environmentPrimitives ?? authority?.accounting?.environmentPrimitives ?? null;
  const projectedEnvironmentPrimitiveAbsoluteMaximum = authority?.budget?.environmentPrimitives?.absoluteMaximum ?? null;
  return deepFreeze({
    profileId: profile?.profile?.id ?? null,
    rendererPassed: profile?.classification?.passed === true,
    rendererConstructionSucceeded: profile?.construction?.succeeded === true,
    rendererMountSucceeded: profile?.mount?.succeeded === true,
    terminalRouteStatus: profile?.routeState?.status ?? null,
    constructionStatus: receipt?.status ?? null,
    projectedEnvironmentPrimitiveCount,
    projectedEnvironmentPrimitiveAbsoluteMaximum,
    projectedEnvironmentPrimitiveBudgetExceeded:
      Number.isSafeInteger(projectedEnvironmentPrimitiveCount) &&
      Number.isSafeInteger(projectedEnvironmentPrimitiveAbsoluteMaximum) &&
      projectedEnvironmentPrimitiveCount > projectedEnvironmentPrimitiveAbsoluteMaximum,
    expectedObjectIdentitiesObservedWithoutMount:
      expectedIdsPreserved(profile) && profile?.mount?.succeeded !== true
  });
}

export function classifyControlledCorrespondence({
  capacityResult,
  rendererResult,
  premountIdentityPreserved = false,
  circularDependency = false
}) {
  if (circularDependency) fail('H6_CIRCULAR_RECEIPT_DEPENDENCY_PROHIBITED');
  if (!capacityResult || !rendererResult) fail('H6_CORRESPONDENCE_INPUT_REQUIRED');
  if (capacityResult.status === 'PASS' && rendererResult.status === 'PASS') return 'CAPACITY_PASS_RENDERER_PASS';
  if (capacityResult.status === 'PASS' && rendererResult.status === 'FAIL' && rendererResult.failureClass === 'NONCAPACITY') return 'CAPACITY_PASS_RENDERER_NONCAPACITY_FAILURE';
  if (capacityResult.status !== 'PASS' && rendererResult.status === 'FAIL' && rendererResult.failureClass === 'CAPACITY') {
    return premountIdentityPreserved
      ? 'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_PREMOUNT_IDENTITY_PRESERVED'
      : 'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_CORRESPONDS';
  }
  return 'CAPACITY_RENDERER_DIVERGENCE_REQUIRES_REVIEW';
}

export function evaluateActualH6Correspondence({ h5Receipt, rendererAggregateReceipt, rendererSourceCustody }) {
  validateH6Contract();
  verifyRendererToolSourceCustody(rendererSourceCustody);
  verifyRendererReceiptDigest(rendererAggregateReceipt);
  if (h5Receipt?.status !== 'PASS') fail('H6_H5_TOOL_RECEIPT_NOT_PASS');
  if (!Array.isArray(rendererAggregateReceipt.profileReceipts) || rendererAggregateReceipt.profileReceipts.length !== 5) fail('H6_RENDERER_PROFILE_COUNT_MISMATCH');

  const h5Serialized = JSON.stringify(h5Receipt);
  const rendererSerialized = JSON.stringify(rendererAggregateReceipt);
  if (h5Serialized.includes(rendererAggregateReceipt.deterministicReceiptSha256) || rendererSerialized.includes(h5Receipt.deterministicReceiptSha256)) {
    fail('H6_CIRCULAR_RECEIPT_DEPENDENCY_PROHIBITED');
  }

  for (const profile of rendererAggregateReceipt.profileReceipts) verifyRendererReceiptDigest(profile);
  const profiles = rendererAggregateReceipt.profileReceipts.map(rendererProfileSummary);
  const allRendererProfilesRejectedAtNodeBudget = profiles.every(profile =>
    profile.rendererPassed === false &&
    profile.rendererConstructionSucceeded === false &&
    profile.rendererMountSucceeded === false &&
    profile.constructionStatus === 'RENDERER_NODE_BUDGET_REJECTED' &&
    profile.projectedEnvironmentPrimitiveBudgetExceeded === true
  );
  const identitiesObservedWithoutMount = profiles.every(profile => profile.expectedObjectIdentitiesObservedWithoutMount === true);
  const capacityBlockedAtProjectedAuthority =
    h5Receipt.actualProductionResult?.toolExecution === 'PASS' &&
    h5Receipt.actualProductionResult?.productCapacityResult === 'BLOCKED' &&
    h5Receipt.actualProductionResult?.terminalClassification === 'PROJECTED_FRAGMENT_BUDGET_UNRESOLVED' &&
    h5Receipt.actualProductionResult?.earliestNonPassStage === 'STAGE_3_PROJECTED_FRAGMENTS';

  const terminalClassification =
    capacityBlockedAtProjectedAuthority && allRendererProfilesRejectedAtNodeBudget
      ? 'CAPACITY_AUTHORITY_GAP_RENDERER_NODE_BUDGET_REJECTION_CORRESPONDS'
      : 'CAPACITY_RENDERER_ACTUAL_CORRESPONDENCE_REQUIRES_REVIEW';

  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H6_ACTUAL_CORRESPONDENCE_RECEIPT_v1',
    toolId: H6_CONTRACT.toolId,
    checkpoint: 'H6',
    status: terminalClassification === 'CAPACITY_AUTHORITY_GAP_RENDERER_NODE_BUDGET_REJECTION_CORRESPONDS' ? 'PASS' : 'FAIL',
    terminalClassification,
    capacityResult: h5Receipt.actualProductionResult,
    rendererResult: {
      localIntegrationPassEstablished: rendererAggregateReceipt.localIntegrationPassEstablished,
      profileCount: rendererAggregateReceipt.profileCount,
      passedProfileCount: rendererAggregateReceipt.passedProfileCount,
      failedProfileIds: rendererAggregateReceipt.failedProfileIds,
      profiles
    },
    correspondence: {
      independentMeasurementsPreserved: true,
      circularReceiptDependency: false,
      capacityBlockedAtProjectedAuthority,
      allRendererProfilesRejectedAtNodeBudget,
      expectedObjectIdentitiesObservedWithoutMount: identitiesObservedWithoutMount,
      rendererProjectedCountSource: 'RENDERER_CONSTRUCT_RECEIPT_NODE_BUDGET_EVALUATION',
      capacityProjectedBudgetAuthority: 'UNRESOLVED',
      rendererNativeProjectionPlanCountObserved: profiles[0]?.projectedEnvironmentPrimitiveCount ?? null
    },
    claims: {
      rendererExecutionPerformed: true,
      browserExecutionPerformed: true,
      deployedRouteExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h7Started: false,
      mergePerformed: false
    }
  };
  return deepFreeze({ ...body, deterministicReceiptSha256: digest(body) });
}
