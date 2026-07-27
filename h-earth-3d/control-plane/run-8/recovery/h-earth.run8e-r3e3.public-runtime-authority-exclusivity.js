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
  currentStatus: 'EXECUTION_PENDING',
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
