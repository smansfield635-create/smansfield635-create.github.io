const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2E_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2E_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT_v1';

export const H_EARTH_RUN_8E_R2E_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2E_CONTRACT_ID,
  checkpointId: 'RUN_8E_R2E',
  checkpointName: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
  currentStatus: 'EXECUTION_OPEN',
  predecessor: {
    checkpointId: 'RUN_8E_R2D',
    status: 'PASS_CLOSED',
    exactHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
    executionRun: 30240226591,
    closureRun: 30240950430,
    custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e'
  },
  requiredProofs: [
    'ALL_R2A_THROUGH_R2E_GOVERNED_PATHS_RESOLVE_IN_REPOSITORY_REGISTRY',
    'REGISTRY_LOADER_ACTIVATES_R2E_OVERLAY',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASSES_FOR_COMPLETE_R2_PATH_SET',
    'R2A_R2B_R2C_R2D_PASS_RECEIPTS_PRESENT_AND_CONSISTENT',
    'PROTECTED_LIVE_RENDER_PACKAGE_AND_GPU_TRANSPORT_IDENTITIES_MATCH',
    'STACKED_CHECKPOINT_PARENTAGE_IS_EXACT',
    'NO_PUBLIC_ROUTE_CAMERA_NAVIGATION_GESTURE_OR_VISIBLE_RENDERER_MUTATION',
    'R2F_AND_R3_REMAIN_NOT_STARTED'
  ],
  permittedScope: [
    'R2E_CONTROL_OVERLAY',
    'R2_REPOSITORY_REGISTRY_ACCEPTED_AMENDMENT',
    'REGISTRY_LOADER_ACTIVATION',
    'R2E_INDEPENDENT_VALIDATION',
    'R2E_READ_ONLY_WORKFLOW',
    'R2E_PASS_OR_FAILURE_RECEIPT',
    'PARENT_R2_CHECKPOINT_PROGRESSION_ON_CLOSURE'
  ],
  prohibitedScope: [
    'LIVE_RENDER_PACKAGE_SOURCE_MUTATION',
    'GPU_TRANSPORT_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_H_EARTH_ROUTE',
    'CAMERA_NAVIGATION_OR_GESTURE_BINDING',
    'SHADER_PROGRAM_DRAW_CALL_OR_RENDER_LOOP',
    'VISIBLE_PRESENTATION',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_R2F_OR_R3_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2E_EXECUTION_OPEN',
    nextCheckpoint: 'RUN_8E_R2F_NOT_STARTED',
    run8ER2FStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2EControl(candidate = H_EARTH_RUN_8E_R2E_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2E_CONTRACT_ID) issues.push('R2E_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2D_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9') issues.push('R2D_EXACT_HEAD_MISMATCH');
  if (!candidate?.requiredProofs?.includes('AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASSES_FOR_COMPLETE_R2_PATH_SET')) issues.push('R2E_PREFLIGHT_PROOF_MISSING');
  if (candidate?.stoppingBoundary?.run8ER2FStarted !== false) issues.push('R2F_STARTED_INSIDE_R2E');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2E_CONTROL_PASS' : 'RUN_8E_R2E_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2E_CONTROL;
