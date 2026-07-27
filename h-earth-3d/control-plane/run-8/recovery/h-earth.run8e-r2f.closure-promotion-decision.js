const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2F_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION_v1';

export const H_EARTH_RUN_8E_R2F_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2F_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R2F',
  checkpointName: 'R2_CLOSURE_AND_PROMOTION_DECISION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r2f-closure-promotion-decision-001',
  baseBranch: 'agent/h-earth-run8e-r2e-registry-execution-custody-001',
  baseExactHead: '096bfbaf45b8987041600385ae16646b00137b9b',
  currentStatus: 'EXECUTION_PENDING',
  predecessor: {
    run8ER2A: 'PASS_CLOSED',
    run8ER2B: 'PASS_CLOSED',
    run8ER2C: 'PASS_CLOSED',
    run8ER2D: 'PASS_CLOSED',
    run8ER2E: 'PASS_CLOSED',
    run8ER2EExactHead: '096bfbaf45b8987041600385ae16646b00137b9b',
    controllingR2EPR: 224,
    supersededR2EPR: 223,
    supersededR2EPRState: 'CLOSED_UNMERGED'
  },
  stack: [
    ['RUN_8E_R2A', 217, 'a660d54b0df30e768b95e2314b918d0f263883ed', '22b23594005dabdd9374501dae1c561f2dafa648'],
    ['RUN_8E_R2B', 218, '22b23594005dabdd9374501dae1c561f2dafa648', '39de87edefcc037eaafa8a988dc0c84e40e3d1ba'],
    ['RUN_8E_R2C', 219, '39de87edefcc037eaafa8a988dc0c84e40e3d1ba', '845b6d6acffdd461153b3474044ec533ffd4403b'],
    ['RUN_8E_R2D', 220, '845b6d6acffdd461153b3474044ec533ffd4403b', '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9'],
    ['RUN_8E_R2E', 224, '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9', '096bfbaf45b8987041600385ae16646b00137b9b']
  ],
  protectedIdentities: {
    liveRenderPackageGitBlobSha: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    gpuTransportAdapterGitBlobSha: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    packageContentDigest: 'fnv1a32:fd913c25',
    r2bCustodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d',
    r2cAuditManifestDigest: 'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe',
    r2dCustodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e',
    r2eOccurrenceManifestDigest: 'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a'
  },
  requiredResults: {
    allPriorCheckpointsPassClosed: true,
    exactStackBaseHeadChain: true,
    singleControllingR2EOccurrence: true,
    allControllingPRsOpenDraftUnmerged: true,
    protectedIdentitiesPreserved: true,
    registryResolutionComplete: true,
    automaticRepositoryRegistryPreflight: 'PASS',
    r2ConstructionEligibleForClosure: true,
    promotionToR3InputEligible: true,
    mainMergeExecuted: false,
    deploymentExecuted: false,
    run8EPassClosed: false
  },
  promotionDecision: {
    r2ConstructionClosure: 'PENDING_EXECUTION',
    promotionTarget: 'RUN_8E_R3_INPUT',
    promotionToR3Input: 'PENDING_EXECUTION',
    mainBranchPromotion: 'NOT_EXECUTED',
    mainMergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    publicRouteAuthorityCreated: false,
    run8EPassAuthorityCreated: false
  },
  executionCustody: {
    executionHead: null,
    workflowRun: null,
    workflowJob: null,
    artifactId: null,
    artifactDigest: null,
    closureManifestDigest: null,
    durablePassReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json',
    finalExactHead: null
  },
  boundaries: {
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    sourceAuthorityMutation: false,
    publicRouteMutation: false,
    cameraNavigationOrGestureMutation: false,
    shaderProgramDrawCallRenderLoopOrVisiblePresentation: false,
    mainMerge: false,
    deployment: false,
    r3Work: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_RUN_8E_R3'
});

export function evaluateHEarthRun8ER2FControl(candidate = H_EARTH_RUN_8E_R2F_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2F_CONTRACT_ID) issues.push('R2F_CONTRACT_ID_MISMATCH');
  if (candidate?.baseExactHead !== '096bfbaf45b8987041600385ae16646b00137b9b') issues.push('R2F_BASE_HEAD_MISMATCH');
  for (const checkpoint of ['run8ER2A', 'run8ER2B', 'run8ER2C', 'run8ER2D', 'run8ER2E']) {
    if (candidate?.predecessor?.[checkpoint] !== 'PASS_CLOSED') issues.push(`${checkpoint.toUpperCase()}_NOT_PASS_CLOSED`);
  }
  if (candidate?.predecessor?.controllingR2EPR !== 224) issues.push('CONTROLLING_R2E_PR_MISMATCH');
  if (candidate?.predecessor?.supersededR2EPRState !== 'CLOSED_UNMERGED') issues.push('SUPERSEDED_R2E_PR_NOT_CLOSED');
  if (!Array.isArray(candidate?.stack) || candidate.stack.length !== 5) issues.push('R2_STACK_LENGTH_INVALID');
  for (let index = 1; index < (candidate?.stack?.length ?? 0); index += 1) {
    if (candidate.stack[index - 1][3] !== candidate.stack[index][2]) issues.push(`R2_STACK_CHAIN_BREAK_${index}`);
  }
  if (candidate?.protectedIdentities?.liveRenderPackageGitBlobSha !==
      '1699654f39c9e183f4cfc6f75b20ba051641b763') issues.push('LIVE_RENDER_PACKAGE_IDENTITY_MISMATCH');
  if (candidate?.protectedIdentities?.gpuTransportAdapterGitBlobSha !==
      '785856d7702a0e855c2672e6b8a7325ad5b3ba50') issues.push('GPU_TRANSPORT_ADAPTER_IDENTITY_MISMATCH');
  if (candidate?.requiredResults?.allPriorCheckpointsPassClosed !== true) issues.push('PRIOR_CHECKPOINT_CLOSURE_MISSING');
  if (candidate?.requiredResults?.r2ConstructionEligibleForClosure !== true) issues.push('R2_NOT_CLOSURE_ELIGIBLE');
  if (candidate?.requiredResults?.promotionToR3InputEligible !== true) issues.push('R2_NOT_PROMOTION_ELIGIBLE');
  if (candidate?.promotionDecision?.mainBranchPromotion !== 'NOT_EXECUTED') issues.push('MAIN_PROMOTION_EXECUTED');
  if (candidate?.boundaries?.mainMerge !== false) issues.push('MAIN_MERGE_PERFORMED');
  if (candidate?.boundaries?.deployment !== false) issues.push('DEPLOYMENT_PERFORMED');
  if (candidate?.boundaries?.r3Work !== false) issues.push('R3_WORK_STARTED');
  if (candidate?.boundaries?.run8EPassClosed !== false) issues.push('RUN_8E_PASS_CLOSED');
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3_NOT_STARTED') issues.push('R3_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_RUN_8E_R3') issues.push('R2F_STOPPING_BOUNDARY_MISMATCH');
  const pending = candidate?.currentStatus === 'EXECUTION_PENDING' &&
    candidate?.promotionDecision?.r2ConstructionClosure === 'PENDING_EXECUTION' &&
    candidate?.promotionDecision?.promotionToR3Input === 'PENDING_EXECUTION';
  const closed = candidate?.currentStatus === 'PASS_CLOSED' &&
    candidate?.promotionDecision?.r2ConstructionClosure === 'PASS_CLOSED' &&
    candidate?.promotionDecision?.promotionToR3Input === 'APPROVED' &&
    Number.isInteger(candidate?.executionCustody?.workflowRun) &&
    typeof candidate?.executionCustody?.artifactDigest === 'string';
  if (!pending && !closed) issues.push('R2F_EXECUTION_STATE_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length
      ? 'RUN_8E_R2F_CONTROL_FAIL'
      : closed
        ? 'RUN_8E_R2F_PASS_CLOSED'
        : 'RUN_8E_R2F_EXECUTION_ELIGIBLE',
    issues
  });
}

export default H_EARTH_RUN_8E_R2F_CONTROL;
