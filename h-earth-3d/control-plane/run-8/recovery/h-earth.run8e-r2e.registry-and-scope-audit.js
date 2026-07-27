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
    passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
    custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e'
  },
  executionEvidence: {
    executionHead: 'b7d4a2553a3a6755d64cb30fab15fd6338a2855e',
    workflowRun: 30276376269,
    workflowJob: 90011388187,
    evidenceArtifact: 8656954357,
    evidenceArtifactDigest: 'sha256:2c0100cad7169ed1ee40ca750640ff91a698b581e3b079b030f0ed678eaf6289',
    automaticRegistryPreflightRun: 30276376061,
    automaticRegistryPreflightJob: 90011387581,
    automaticRegistryPreflightArtifact: 8656951286,
    automaticRegistryPreflightArtifactDigest: 'sha256:691b44d1bb23af857dc7ecf61cd41222a7a90ef7acfcba31a571a061dcfbba68',
    cumulativeGovernedPathCount: 28,
    cumulativeManifestDigest: 'sha256:ac156b619704889790e911c24023bfc23f24d3ec443194a2e6c46211b02663dd',
    cumulativeByteCount: 220755,
    gitRegistryLoaderSetEquality: true,
    passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
  },
  requiredProofs: [
    'ALL_GOVERNED_R2A_THROUGH_R2E_PATHS_REGISTERED',
    'REGISTRY_OVERLAY_ACTIVE_THROUGH_VALIDATOR_LOADER',
    'GIT_SCOPE_REGISTRY_SCOPE_AND_LOADER_RESOLUTION_SET_EQUALITY',
    'EACH_REGISTERED_EXISTING_PATH_HAS_FETCHBACK_GIT_BLOB_SHA_AND_BYTE_COUNT',
    'CUMULATIVE_R2_PACKAGE_MANIFEST_DIGEST_DETERMINISTIC',
    'R2A_R2B_R2C_R2D_PASS_RECEIPTS_PRESENT_AND_VALID',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASS',
    'INDEPENDENT_R2E_SCOPE_AUDIT_PASS',
    'NO_PRODUCT_OR_RUNTIME_AUTHORITY_MUTATION',
    'R2F_AND_R3_NOT_STARTED'
  ],
  permittedScope: [
    'R2E_CONTROL_OVERLAY',
    'CUMULATIVE_R2_REGISTRY_OVERLAY',
    'REGISTRY_LOADER_ACTIVATION',
    'R2E_INDEPENDENT_SCOPE_VALIDATOR',
    'R2E_READ_ONLY_WORKFLOW',
    'R2E_FAILURE_OR_PASS_RECEIPT',
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
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_R2F_OR_R3_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ],
  preflightFailureResolution: {
    priorRunId: 30240950338,
    priorJobId: 89897847300,
    priorArtifactId: 8643225287,
    priorArtifactDigest: 'sha256:f4f519e19da3298c341781887fddcab58a2067b18db733344addd99de6ecd83f',
    priorFailureCode: 'REQUESTED_PATH_UNRESOLVED',
    priorUnresolvedR2DGovernedPathCount: 12,
    cause: 'ACTIVE_VALIDATOR_LOADER_TERMINATED_AT_R1_EXECUTION_OVERLAY',
    resolutionStatus: 'RESOLVED_BY_CUMULATIVE_R2_OVERLAY_AND_LOADER_ACTIVATION'
  },
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
  if (candidate?.predecessor?.exactHead !== '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9') issues.push('R2D_EXACT_HEAD_MISMATCH');
  if (candidate?.executionEvidence?.workflowRun !== 30276376269) issues.push('R2E_WORKFLOW_RUN_MISMATCH');
  if (candidate?.executionEvidence?.automaticRegistryPreflightRun !== 30276376061) issues.push('R2E_PREFLIGHT_RUN_MISMATCH');
  if (candidate?.executionEvidence?.cumulativeGovernedPathCount !== 28) issues.push('R2E_PATH_COUNT_INVALID');
  if (candidate?.executionEvidence?.gitRegistryLoaderSetEquality !== true) issues.push('R2E_SCOPE_EQUALITY_NOT_ESTABLISHED');
  if (candidate?.preflightFailureResolution?.resolutionStatus !==
      'RESOLVED_BY_CUMULATIVE_R2_OVERLAY_AND_LOADER_ACTIVATION') {
    issues.push('R2E_PREFLIGHT_FAILURE_NOT_RESOLVED');
  }
  if (!candidate?.prohibitedScope?.includes('RUN_8E_R2F_OR_R3_EXECUTION')) issues.push('R2E_LATER_CHECKPOINT_BOUNDARY_MISSING');
  if (candidate?.stoppingBoundary?.run8ER2FStarted !== false) issues.push('R2F_STARTED_INSIDE_R2E');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2E_CONTROL_PASS_CLOSED' : 'RUN_8E_R2E_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2E_CONTROL;
