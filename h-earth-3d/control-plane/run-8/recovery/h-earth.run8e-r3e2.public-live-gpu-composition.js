import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E1Control } from './h-earth.run8e-r3e1.public-integration-scope-control.js';
import { evaluateHEarthRun8ER3E1ScopeDeclaration } from './h-earth.run8e-r3e1.public-integration-scope-declaration.js';

const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3E2_CONTROL_ID =
  'H_EARTH_RUN_8E_R3E2_BRANCH_LOCAL_PUBLIC_LIVE_GPU_COMPOSITION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3E2_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3E2_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3E2',
  checkpointName: 'BRANCH_LOCAL_PUBLIC_LIVE_GPU_COMPOSITION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e2-public-live-gpu-composition-001',
  baseBranch: 'agent/h-earth-run8e-r3e1-public-integration-scope-001',
  baseExactHead: '4d1692cb3f1555833bef7864a3f6ebc998b86a17',
  currentStatus: 'PASS_CLOSED',
  executionEvidence: freeze({
    successfulExecutionHead: '9cb9a0a98fcfc6fbf354ef9dacc6adf13743891c',
    workflowRun: 30306926100,
    workflowJob: 90113310977,
    artifactId: 8668783374,
    artifactDigest: 'sha256:a4e2e9a23e7cdc55345b24537db2d5b414af4b78be0e07ab871270ab0619bb90',
    automaticRepositoryRegistryPreflightRun: 30306925973,
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    baseHtmlByteLength: 12919,
    composedHtmlByteLength: 12693,
    publicOrchestratorByteLength: 8456,
    publicModuleScriptCount: 1,
    legacyModuleScriptCount: 0,
    exactLoadOrderOnlyDelta: true,
    protectedWitnessMutationCount: 0,
    prohibitedPatternCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  }),
  requiredInputs: freeze({
    r3E1PassClosed: true,
    r3E1PassReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5',
    publicRoutePreMutationGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d'
  }),
  exactPublicMutationPaths: freeze([
    '/showroom/globe/h-earth/index.html',
    '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'
  ]),
  sourceComposition: freeze({
    publicHtmlModuleScriptCount: 1,
    activePublicModule: '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
    legacyCpuControllerLoaded: false,
    legacyCpuEnvironmentIntegrationLoaded: false,
    legacyDirectManipulationLoaded: false,
    existingCanvasIdentityPreserved: true,
    existingMountIdentityPreserved: true,
    existingHudIdentityPreserved: true,
    existingCopyAndLayoutPreserved: true,
    existingCssReferencesPreserved: true,
    acceptedPointerTouchIntakeImported: true,
    acceptedLiveGpuBindingImported: true,
    acceptedNavigationAuthorityConsumedTransitively: true,
    acceptedR3AFramePacketConsumedTransitively: true,
    acceptedPersistentRendererConsumedTransitively: true,
    onePublicOrchestratorCreated: true,
    noCpuRasterizationInOrchestrator: true,
    noCanvas2DContextInOrchestrator: true,
    noCssBitmapPreviewInOrchestrator: true,
    noDeferredSettledRefreshChainInOrchestrator: true
  }),
  protectedWitnesses: freeze({
    publicShellCssMutation: false,
    functionalLandscapeCssMutation: false,
    legacyCpuControllerSourceMutation: false,
    legacyEnvironmentIntegrationSourceMutation: false,
    legacyDirectManipulationSourceMutation: false,
    navigationSourceMutation: false,
    r3AFramePacketSourceMutation: false,
    persistentRendererSourceMutation: false,
    pointerTouchIntakeSourceMutation: false,
    liveGpuBindingSourceMutation: false,
    diagnosticHostSourceMutation: false
  }),
  executionBoundaries: freeze({
    browserExecution: false,
    gpuExecution: false,
    authorityExclusivityAcceptance: false,
    publicInteractionAcceptance: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E3Work: false,
    mainMerge: false,
    run8EPassClosed: false
  }),
  rollbackGroups: freeze([
    freeze({ groupId: 'R3E_PUBLIC_HTML_LOAD_ORDER', operation: 'RESTORE_PUBLIC_ROUTE_FILE_TO_GIT_BLOB_b5f72fb70f59276f868a5894ee0c5e8beccc40ca' }),
    freeze({ groupId: 'R3E_PUBLIC_GPU_ORCHESTRATOR', operation: 'DELETE_NEW_PUBLIC_ORCHESTRATION_MODULE' })
  ]),
  nextCheckpoint: 'RUN_8E_R3E3_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3'
});

export function evaluateHEarthRun8ER3E2Control(candidate = H_EARTH_RUN_8E_R3E2_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const r3E1 = evaluateHEarthRun8ER3E1Control();
  const declaration = evaluateHEarthRun8ER3E1ScopeDeclaration();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (r3E1.eligible !== true || r3E1.status !== 'RUN_8E_R3E1_PASS_CLOSED') issues.push('R3E1_CONTROL_NOT_PASS_CLOSED');
  if (declaration.eligible !== true || declaration.status !== 'RUN_8E_R3E1_SCOPE_PASS_CLOSED') issues.push('R3E1_SCOPE_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E2_CONTROL_ID) issues.push('R3E2_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '4d1692cb3f1555833bef7864a3f6ebc998b86a17') issues.push('R3E2_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3E2_STATUS_INVALID');
  if ((candidate?.exactPublicMutationPaths ?? []).length !== 2) issues.push('R3E2_PUBLIC_MUTATION_PATH_COUNT_INVALID');
  if (candidate?.requiredInputs?.r3E1PassReceiptGitBlob !== '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5') issues.push('R3E1_PASS_RECEIPT_INPUT_MISMATCH');
  if (candidate?.requiredInputs?.publicRoutePreMutationGitBlob !== 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca') issues.push('PUBLIC_ROUTE_PRE_MUTATION_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.sourceComposition ?? {})) {
    if (typeof value === 'boolean' && value !== true && !['legacyCpuControllerLoaded','legacyCpuEnvironmentIntegrationLoaded','legacyDirectManipulationLoaded'].includes(key)) issues.push(`R3E2_SOURCE_COMPOSITION_MISSING:${key}`);
  }
  for (const key of ['legacyCpuControllerLoaded','legacyCpuEnvironmentIntegrationLoaded','legacyDirectManipulationLoaded']) if (candidate?.sourceComposition?.[key] !== false) issues.push(`R3E2_LEGACY_OWNER_ACTIVE:${key}`);
  for (const [key, value] of Object.entries(candidate?.protectedWitnesses ?? {})) if (value !== false) issues.push(`R3E2_PROTECTED_WITNESS_MUTATED:${key}`);
  for (const [key, value] of Object.entries(candidate?.executionBoundaries ?? {})) if (value !== false) issues.push(`R3E2_EXECUTION_BOUNDARY_VIOLATION:${key}`);
  if ((candidate?.rollbackGroups ?? []).length !== 2) issues.push('R3E2_ROLLBACK_GROUP_COUNT_INVALID');
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    const evidence = candidate?.executionEvidence ?? {};
    if (evidence.workflowRun !== 30306926100 || evidence.workflowJob !== 90113310977) issues.push('R3E2_WORKFLOW_IDENTITY_MISMATCH');
    if (evidence.artifactDigest !== 'sha256:a4e2e9a23e7cdc55345b24537db2d5b414af4b78be0e07ab871270ab0619bb90') issues.push('R3E2_ARTIFACT_DIGEST_MISMATCH');
    if (evidence.publicHtmlGitBlob !== '0daedf61f7e19af095f4db5fc47563a9cd786837' || evidence.publicOrchestratorGitBlob !== '2b0a916b3a6d11da84316925f8abd8a3a1447445') issues.push('R3E2_PUBLIC_SOURCE_IDENTITY_MISMATCH');
    if (evidence.publicModuleScriptCount !== 1 || evidence.legacyModuleScriptCount !== 0 || evidence.exactLoadOrderOnlyDelta !== true || evidence.protectedWitnessMutationCount !== 0 || evidence.prohibitedPatternCount !== 0 || evidence.browserExecutionCount !== 0 || evidence.gpuExecutionCount !== 0) issues.push('R3E2_EXECUTION_EVIDENCE_INVALID');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E3_NOT_STARTED' || candidate?.stoppingBoundary !== 'STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3') issues.push('R3E2_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E2_PASS_CLOSED' : 'RUN_8E_R3E2_SOURCE_COMPOSITION_ELIGIBLE')
      : 'RUN_8E_R3E2_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E2_CONTROL;
