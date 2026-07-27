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
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  parentContractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  checkpointId: 'RUN_8E_R2E',
  checkpointName: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
  currentStatus: 'PASS_CLOSED',
  predecessor: {
    checkpointId: 'RUN_8E_R2D',
    status: 'PASS_CLOSED',
    exactHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
    custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e'
  },
  executionEvidence: {
    executionHead: 'c7a7a58458b22fbda650165ab7876a2640679455',
    workflowRun: 30276245196,
    workflowJob: 90010942725,
    evidenceArtifact: 8656899123,
    evidenceArtifactDigest: 'sha256:ab2235534a1d59c4a2030ba2b6c1d0caf7cef637b27ee6eebf904f446a401997',
    automaticRegistryPreflightRun: 30276239789,
    automaticRegistryPreflightJob: 90010923826,
    automaticRegistryPreflightArtifact: 8656897130,
    automaticRegistryPreflightArtifactDigest: 'sha256:b548333c6958b9ff0553c4b9af14a0480eb6c6534ab10eba96e7965218f793d9',
    registeredPathCount: 33,
    registeredGovernedPathCount: 25,
    custodyManifestDigest: 'sha256:40607b14ed9bf5f06225d2f2eb566e63ccdf700347065e457db8d7d50dcfc45e',
    passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
  },
  requiredProofs: [
    'ALL_RUN_8E_R2A_THROUGH_R2E_GOVERNED_PATHS_RESOLVE_IN_ACTIVE_REGISTRY_LOADER',
    'R2A_R2B_R2C_AND_R2D_PASS_RECEIPTS_RESOLVE_AS_REGISTERED_EVIDENCE',
    'R2D_FAILED_ATTEMPT_RECEIPTS_REMAIN_REGISTERED_AND_RECONCILED',
    'R2_PACKAGE_SOURCE_AND_GPU_TRANSPORT_ADAPTER_HAVE_SEPARATE_NODE_IDENTITIES',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASSES_ON_R2E_HEAD',
    'INDEPENDENT_SCOPE_AUDIT_MATCHES_EXACT_STACKED_PATH_SET',
    'DURABLE_R2E_RECEIPT_BINDS_PREDECESSOR_HEADS_RUNS_JOBS_ARTIFACTS_AND_DIGESTS',
    'NO_R2F_OR_R3_PATH_EXISTS_IN_R2E_DELTA',
    'NO_PUBLIC_ROUTE_RENDERER_CAMERA_NAVIGATION_GESTURE_OR_DEPLOYMENT_MUTATION'
  ],
  permittedScope: [
    'R2E_CONTROL_OVERLAY',
    'R2_REGISTRY_SCOPE_OVERLAY',
    'REGISTRY_LOADER_ACTIVATION',
    'R2E_INDEPENDENT_SCOPE_AUDIT',
    'R2E_DURABLE_PASS_RECEIPT',
    'R2E_READ_ONLY_WORKFLOW',
    'PARENT_R2_CHECKPOINT_PROGRESSION_ON_CLOSURE'
  ],
  prohibitedScope: [
    'R2A_R2B_R2C_OR_R2D_HISTORY_REWRITE',
    'LIVE_RENDER_PACKAGE_SOURCE_MUTATION',
    'GPU_TRANSPORT_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_H_EARTH_ROUTE',
    'CAMERA_OR_NAVIGATION_AUTHORITY',
    'POINTER_OR_GESTURE_BINDING',
    'SHADER_PROGRAM_OR_DRAW_CALL',
    'VISIBLE_RENDERER_OR_RENDER_LOOP',
    'GEOMETRY_MATERIAL_LIGHT_OR_ATMOSPHERE_RETUNING',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_R2F_OR_LATER_EXECUTION',
    'RUN_8E_R3_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2E_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R2F_NOT_STARTED',
    run8ER2FStarted: false,
    run8ER3Started: false,
    publicRendererInstalled: false,
    publicInteractionRestored: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2EControl(candidate = H_EARTH_RUN_8E_R2E_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2E_CONTRACT_ID) issues.push('R2E_CONTRACT_ID_MISMATCH');
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R2E_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2D_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9') {
    issues.push('R2D_EXACT_HEAD_MISMATCH');
  }
  if (candidate?.executionEvidence?.workflowRun !== 30276245196) issues.push('R2E_WORKFLOW_RUN_MISMATCH');
  if (candidate?.executionEvidence?.automaticRegistryPreflightRun !== 30276239789) {
    issues.push('R2E_AUTOMATIC_PREFLIGHT_RUN_MISMATCH');
  }
  if (candidate?.executionEvidence?.registeredPathCount !== 33) issues.push('R2E_REGISTERED_PATH_COUNT_INVALID');
  if (candidate?.executionEvidence?.custodyManifestDigest !==
      'sha256:40607b14ed9bf5f06225d2f2eb566e63ccdf700347065e457db8d7d50dcfc45e') {
    issues.push('R2E_CUSTODY_MANIFEST_DIGEST_MISMATCH');
  }
  if (!candidate?.prohibitedScope?.includes('RUN_8E_R2F_OR_LATER_EXECUTION')) {
    issues.push('R2F_STOPPING_BOUNDARY_MISSING');
  }
  if (candidate?.stoppingBoundary?.run8ER2FStarted !== false) issues.push('R2F_STARTED_INSIDE_R2E');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2E_CONTROL_PASS_CLOSED' : 'RUN_8E_R2E_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2E_CONTROL;
