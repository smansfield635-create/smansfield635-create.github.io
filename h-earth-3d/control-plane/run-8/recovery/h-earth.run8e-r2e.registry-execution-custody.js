const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2E_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2E_REGISTRY_EXECUTION_CUSTODY_v1';

export const H_EARTH_RUN_8E_R2E_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2E_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R2E',
  checkpointName: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r2e-registry-execution-custody-001',
  baseBranch: 'agent/h-earth-run8e-r2d-gpu-resource-lifecycle-001',
  baseExactHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
  currentStatus: 'PASS_CLOSED',
  predecessor: {
    run8ER2A: 'PASS_CLOSED',
    run8ER2B: 'PASS_CLOSED',
    run8ER2C: 'PASS_CLOSED',
    run8ER2D: 'PASS_CLOSED',
    run8ER2DExactHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9'
  },
  inventory: {
    inventoryId: 'H_EARTH_RUN_8E_R2E_EXACT_GOVERNED_PATH_INVENTORY_v1',
    r2UniquePathCount: 27,
    r2ePlannedPathCount: 9,
    r2eNonRegistryPathCount: 6,
    pathClassesRequired: [
      'IMPLEMENTATION_SOURCE',
      'CONTROL_CONTRACT',
      'VALIDATION_HARNESS',
      'WORKFLOW',
      'FAILURE_RECEIPT',
      'PASS_RECEIPT',
      'GPU_TRANSPORT_ADAPTER',
      'BROWSER_PROBE'
    ]
  },
  requiredResults: {
    allR2PathsResolve: true,
    allR2ENonRegistryPathsResolve: true,
    unregisteredGovernedPaths: 0,
    duplicateLocalNodeIds: 0,
    duplicateEvidenceIds: 0,
    unresolvedRequiredOccurrences: 0,
    checkpointStackOrderExact: true,
    passReceiptsMatchExactHeads: true,
    artifactIdentitiesMatch: true,
    r2AThroughR2DPassClosed: true,
    r2EExecutionOnly: true,
    r2FNotStarted: true,
    r3NotStarted: true,
    run8EFailOpen: true
  },
  executionCustody: {
    validatedCoreHead: '481dd572eb3351e42e11f48ff75edc37c9e03d76',
    executionEvidenceHead: '2ae6c8cfad013c0ddd3d7f71990357add582ae34',
    workflowRun: 30280738790,
    workflowJob: 90026155156,
    artifactId: 8658686555,
    artifactDigest: 'sha256:adbeab3e9b63dc6ec69282be2cb177f058b20d95203b12b6b5f89c0d53d58260',
    exactOccurrenceManifestDigest: 'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a',
    automaticRegistryPreflight: 'PASS',
    durablePassReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json',
    finalExactHead: null
  },
  boundaries: {
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    sourceAuthorityMutation: false,
    publicRouteMutation: false,
    cameraNavigationOrGestureMutation: false,
    shaderProgramRenderLoopOrVisiblePresentation: false,
    deployment: false,
    r2FWork: false,
    r3Work: false,
    run8EPassClosed: false,
    r2StackMerged: false
  },
  nextCheckpoint: 'RUN_8E_R2F_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F'
});

export function evaluateHEarthRun8ER2EControl(candidate = H_EARTH_RUN_8E_R2E_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2E_CONTRACT_ID) issues.push('R2E_CONTRACT_ID_MISMATCH');
  if (candidate?.baseExactHead !== '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9') issues.push('R2E_BASE_HEAD_MISMATCH');
  for (const checkpoint of ['run8ER2A', 'run8ER2B', 'run8ER2C', 'run8ER2D']) {
    if (candidate?.predecessor?.[checkpoint] !== 'PASS_CLOSED') issues.push(`${checkpoint.toUpperCase()}_NOT_PASS_CLOSED`);
  }
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R2E_NOT_PASS_CLOSED');
  if (candidate?.inventory?.r2UniquePathCount !== 27) issues.push('R2_PATH_COUNT_MISMATCH');
  if (candidate?.inventory?.r2ePlannedPathCount !== 9) issues.push('R2E_PATH_COUNT_MISMATCH');
  if (candidate?.inventory?.r2eNonRegistryPathCount !== 6) issues.push('R2E_NON_REGISTRY_PATH_COUNT_MISMATCH');
  if (candidate?.executionCustody?.workflowRun !== 30280738790) issues.push('R2E_WORKFLOW_RUN_MISMATCH');
  if (candidate?.executionCustody?.artifactDigest !==
      'sha256:adbeab3e9b63dc6ec69282be2cb177f058b20d95203b12b6b5f89c0d53d58260') {
    issues.push('R2E_ARTIFACT_DIGEST_MISMATCH');
  }
  if (candidate?.executionCustody?.exactOccurrenceManifestDigest !==
      'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a') {
    issues.push('R2E_OCCURRENCE_MANIFEST_DIGEST_MISMATCH');
  }
  if (candidate?.boundaries?.liveRenderPackageMutation !== false) issues.push('LIVE_RENDER_PACKAGE_MUTATION');
  if (candidate?.boundaries?.gpuTransportAdapterMutation !== false) issues.push('GPU_TRANSPORT_ADAPTER_MUTATION');
  if (candidate?.boundaries?.publicRouteMutation !== false) issues.push('PUBLIC_ROUTE_MUTATION');
  if (candidate?.boundaries?.r2FWork !== false) issues.push('R2F_WORK_STARTED');
  if (candidate?.boundaries?.r3Work !== false) issues.push('R3_WORK_STARTED');
  if (candidate?.boundaries?.run8EPassClosed !== false) issues.push('RUN_8E_PASS_CLOSED');
  if (candidate?.nextCheckpoint !== 'RUN_8E_R2F_NOT_STARTED') issues.push('R2F_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F') {
    issues.push('R2E_STOPPING_BOUNDARY_MISMATCH');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2E_PASS_CLOSED' : 'RUN_8E_R2E_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2E_CONTROL;
