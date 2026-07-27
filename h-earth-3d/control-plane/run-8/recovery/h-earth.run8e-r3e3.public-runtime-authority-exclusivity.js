import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E2Control } from './h-earth.run8e-r3e2.public-live-gpu-composition.js';

const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3E3_CONTROL_ID =
  'H_EARTH_RUN_8E_R3E3_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3E3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3E3_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3E3',
  checkpointName: 'PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e3-public-runtime-authority-exclusivity-001',
  baseBranch: 'agent/h-earth-run8e-r3e2-public-live-gpu-composition-001',
  baseExactHead: '2017755b4c0186ef546774c3cfefe57b0e9c3199',
  currentStatus: 'PASS_CLOSED',
  executionEvidence: freeze({
    successfulExecutionHead: '9ce869c03951a5760a1c29e87d261bc20a66d309',
    workflowRun: 30308290969,
    workflowJob: 90117713422,
    artifactId: 8669318353,
    artifactDigest: 'sha256:4b81bf80bdda5d6fc90d3dc8d6a3c3eeca40c6bd5dd5486e7ecf92234b69df2f',
    automaticRepositoryRegistryPreflightRun: 30308290926,
    documentLoadCount: 2,
    acceptedNavigationProposalCount: 2,
    visibleGpuFrameCount: 4,
    sumOfDistinctVisibleFrameHashCounts: 4,
    totalWebGL2ContextCount: 2,
    totalCanvas2DContextCount: 0,
    totalCanvasInputListenerCount: 12,
    totalLegacyModuleRequestCount: 0,
    totalAppOwnedDeferredExecutionCount: 0,
    totalPostInitializationResourceCreationCount: 0,
    totalPostInitializationBufferUploadCount: 0,
    totalWorldRebuildCount: 0,
    totalDeferredRenderCommitCount: 0,
    totalQueuedFrameChainCount: 0,
    initialFrameHash: 'fnv1a32:9dbc4dd6',
    finalFrameHash: 'fnv1a32:54cb73b4',
    initialCanvasScreenshotSha256: '78cc8fe8458ede9a3a55272d49edfbc612b11f05d60cbe63a672b84498f84ef5',
    finalCanvasScreenshotSha256: 'f71f9e40c554d83428885fbf7402957749498b2b2dae86ceff750eda4ae3fe8f',
    pageScreenshotSha256: '4be1328a239392cf27f96c3a87709c9874f35988e449ebc22bc6fa4de1ec6cf5',
    maximumSynchronousResponseMs: 261.8
  }),
  requiredInputs: freeze({
    r3E2PassClosed: true,
    r3E2PassReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d'
  }),
  requiredExecution: freeze({
    publicRouteLoadedInMobileChromium: true,
    initialDocumentAudited: true,
    reloadDocumentAudited: true,
    activePublicModuleScriptCountPerDocument: 1,
    legacyModuleRequestCountPerDocument: 0,
    webGL2ContextCountPerDocument: 1,
    canvas2DContextCountPerDocument: 0,
    persistentRendererInitializationCountPerDocument: 1,
    navigationStateStreamCountPerDocument: 1,
    pointerTouchIntakeCountPerDocument: 1,
    framePresentationAuthorityCountPerDocument: 1,
    canvasInputListenerCountPerDocument: 6,
    limitedLookProposalCountPerDocument: 1,
    visibleGpuFrameCountPerDocument: 2,
    distinctVisibleFrameHashCountPerDocument: 2,
    appOwnedRequestAnimationFrameCountPerDocument: 0,
    appOwnedTimerCountPerDocument: 0,
    appOwnedIntervalCountPerDocument: 0,
    appOwnedMicrotaskCountPerDocument: 0,
    postInitializationResourceCreationCountPerDocument: 0,
    postInitializationBufferUploadCountPerDocument: 0,
    worldRebuildCountPerDocument: 0,
    deferredRenderCommitCountPerDocument: 0,
    queuedFrameChainCountPerDocument: 0,
    cssBitmapPreviewCountPerDocument: 0
  }),
  minimumEvidence: freeze({
    documentLoadCount: 2,
    acceptedNavigationProposalCount: 2,
    visibleGpuFrameCount: 4,
    distinctVisibleFrameHashCount: 4,
    totalWebGL2ContextCount: 2,
    totalCanvas2DContextCount: 0,
    totalCanvasInputListenerCount: 12,
    totalLegacyModuleRequestCount: 0
  }),
  protectedBoundaries: freeze({
    publicSourceMutation: false,
    protectedWitnessMutation: false,
    admittedAuthorityMutation: false,
    fullPublicInteractionAcceptance: false,
    sustainedInteractionAcceptance: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E4Work: false,
    mainMerge: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3E4_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_R3E4'
});

export function evaluateHEarthRun8ER3E3Control(candidate = H_EARTH_RUN_8E_R3E3_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const predecessor = evaluateHEarthRun8ER3E2Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (predecessor.eligible !== true || predecessor.status !== 'RUN_8E_R3E2_PASS_CLOSED') issues.push('R3E2_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E3_CONTROL_ID) issues.push('R3E3_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '2017755b4c0186ef546774c3cfefe57b0e9c3199') issues.push('R3E3_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3E3_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3E2PassReceiptGitBlob !== 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5') issues.push('R3E2_PASS_RECEIPT_INPUT_MISMATCH');
  if (candidate?.requiredInputs?.publicHtmlGitBlob !== '0daedf61f7e19af095f4db5fc47563a9cd786837' || candidate?.requiredInputs?.publicOrchestratorGitBlob !== '2b0a916b3a6d11da84316925f8abd8a3a1447445') issues.push('PUBLIC_COMPOSITION_INPUT_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (!Number.isSafeInteger(value) && value !== true) issues.push(`R3E3_REQUIRED_EXECUTION_INVALID:${key}`);
    if (Number.isSafeInteger(value) && value < 0) issues.push(`R3E3_REQUIRED_EXECUTION_NEGATIVE:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.minimumEvidence ?? {})) if (!Number.isSafeInteger(value) || value < 0) issues.push(`R3E3_MINIMUM_EVIDENCE_INVALID:${key}`);
  for (const [key, value] of Object.entries(candidate?.protectedBoundaries ?? {})) if (value !== false) issues.push(`R3E3_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    const evidence = candidate?.executionEvidence ?? {};
    if (evidence.workflowRun !== 30308290969 || evidence.workflowJob !== 90117713422) issues.push('R3E3_WORKFLOW_IDENTITY_MISMATCH');
    if (evidence.artifactDigest !== 'sha256:4b81bf80bdda5d6fc90d3dc8d6a3c3eeca40c6bd5dd5486e7ecf92234b69df2f') issues.push('R3E3_ARTIFACT_DIGEST_MISMATCH');
    if (evidence.documentLoadCount !== 2 || evidence.acceptedNavigationProposalCount !== 2 || evidence.visibleGpuFrameCount !== 4 || evidence.sumOfDistinctVisibleFrameHashCounts !== 4) issues.push('R3E3_FRAME_AND_PROPOSAL_EVIDENCE_INVALID');
    if (evidence.totalWebGL2ContextCount !== 2 || evidence.totalCanvas2DContextCount !== 0 || evidence.totalCanvasInputListenerCount !== 12 || evidence.totalLegacyModuleRequestCount !== 0 || evidence.totalAppOwnedDeferredExecutionCount !== 0) issues.push('R3E3_RUNTIME_OWNER_EVIDENCE_INVALID');
    if (evidence.totalPostInitializationResourceCreationCount !== 0 || evidence.totalPostInitializationBufferUploadCount !== 0 || evidence.totalWorldRebuildCount !== 0 || evidence.totalDeferredRenderCommitCount !== 0 || evidence.totalQueuedFrameChainCount !== 0) issues.push('R3E3_RESOURCE_OR_FRAME_BOUNDARY_EVIDENCE_INVALID');
    if (evidence.initialFrameHash === evidence.finalFrameHash) issues.push('R3E3_VISIBLE_FRAME_HASH_DID_NOT_CHANGE');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E4_NOT_STARTED' || candidate?.stoppingBoundary !== 'STOP_BEFORE_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_R3E4') issues.push('R3E3_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E3_PASS_CLOSED' : 'RUN_8E_R3E3_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3E3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E3_CONTROL;
