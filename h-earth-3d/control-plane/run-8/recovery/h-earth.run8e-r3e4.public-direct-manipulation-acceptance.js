import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E3Control } from './h-earth.run8e-r3e3.public-runtime-authority-exclusivity.js';

const freeze = (value) => Object.freeze(value);

export const H_EARTH_RUN_8E_R3E4_CONTROL_ID =
  'H_EARTH_RUN_8E_R3E4_PUBLIC_DIRECT_MANIPULATION_EXECUTION_AND_ACCEPTANCE_CONTROL_v1';

export const H_EARTH_RUN_8E_R3E4_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3E4_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3E4',
  checkpointName: 'PUBLIC_ROUTE_DIRECT_MANIPULATION_EXECUTION_AND_ACCEPTANCE',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e4-public-direct-manipulation-acceptance-001',
  baseBranch: 'agent/h-earth-run8e-r3e3-public-runtime-authority-exclusivity-001',
  baseExactHead: '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9',
  currentStatus: 'EXECUTION_PENDING',
  protectedInputs: freeze({
    r3E3PassClosed: true,
    r3E3PassReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d'
  }),
  acceptanceMatrix: freeze({
    portraitMobileBrowserSession: true,
    landscapeMobileBrowserSession: true,
    oneFingerLook: 'REQUIRED',
    twoFingerForwardTravel: 'REQUIRED',
    twoFingerBackwardTravel: 'REQUIRED',
    pinchZoomIn: 'REQUIRED',
    pinchZoomOut: 'REQUIRED',
    visibleController: 'PROHIBITED',
    wheelSubstitutionForTouch: 'PROHIBITED'
  }),
  correspondenceLaw: freeze({
    frameCoalescingPolicy: 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL',
    acceptedNavigationProposalsEqualPublicFramePacketUpdates: true,
    publicFramePacketUpdatesEqualPublicVisibleGpuResponses: true,
    everyAcceptedProposalRequiresNavigationSequenceAdvance: true,
    everyAcceptedProposalRequiresR3AFramePacket: true,
    everyAcceptedProposalRequiresGpuCameraUniformRecord: true,
    everyAcceptedProposalRequiresCurrentFramePresentation: true,
    everyAcceptedProposalRequiresDistinctVisibleFrameIdentity: true
  }),
  sustainedExecution: freeze({
    orientations: freeze(['PORTRAIT', 'LANDSCAPE']),
    scheduledInteractionGroupsPerOrientation: 24,
    inputCadenceMs: 350,
    maximumTimerDeliveryLagExclusiveMs: 2000,
    maximumActionCompletionLagExclusiveMs: 2000,
    maximumSynchronousActionProcessingExclusiveMs: 1000,
    maximumConcurrentCallbacks: 1
  }),
  runtimeExclusivity: freeze({
    activeWebGL2ContextCountPerSession: 1,
    activePersistentRendererCountPerSession: 1,
    activeNavigationStreamCountPerSession: 1,
    activePointerTouchIntakeCountPerSession: 1,
    activeFramePresentationAuthorityCountPerSession: 1,
    canvas2DContextCountPerSession: 0,
    legacyModuleRequestCountPerSession: 0,
    duplicateInputListenerCountPerSession: 0,
    secondRenderLoopCountPerSession: 0,
    postInitializationResourceCreationCountPerSession: 0,
    postInitializationBufferUploadCountPerSession: 0,
    worldRebuildDuringGestureCountPerSession: 0,
    cssBitmapTransformCountPerSession: 0,
    domImagePresentationCountPerSession: 0,
    deferredPublicRefreshCountPerSession: 0,
    queuedNavigationChainCountPerSession: 0,
    queuedFrameChainCountPerSession: 0
  }),
  failureLaw: freeze({
    sourceDefectResult: 'FAIL_OPEN',
    failedAttemptReceiptRequired: true,
    publicSourcePatchInAcceptanceRun: false,
    correctionRequiresSeparateCheckpoint: true
  }),
  protectedBoundaries: freeze({
    publicSourceMutation: false,
    showroomMutation: false,
    publicSourcePatchInAcceptanceRun: false,
    referenceDeviceAcceptance: false,
    deployment: false,
    promotion: false,
    mainMerge: false,
    r3E5Work: false,
    r3FWork: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3E5_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5'
});

export function evaluateHEarthRun8ER3E4Control(candidate = H_EARTH_RUN_8E_R3E4_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const predecessor = evaluateHEarthRun8ER3E3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (predecessor.eligible !== true || predecessor.status !== 'RUN_8E_R3E3_PASS_CLOSED') issues.push('R3E3_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E4_CONTROL_ID) issues.push('R3E4_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9') issues.push('R3E4_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED', 'FAIL_OPEN'].includes(candidate?.currentStatus)) issues.push('R3E4_STATUS_INVALID');
  if (candidate?.protectedInputs?.r3E3PassReceiptGitBlob !== '5c5f1ae06220f88f497dc2b45f4d749679849918') issues.push('R3E3_PASS_RECEIPT_INPUT_MISMATCH');
  if (candidate?.protectedInputs?.publicHtmlGitBlob !== '0daedf61f7e19af095f4db5fc47563a9cd786837' || candidate?.protectedInputs?.publicOrchestratorGitBlob !== '2b0a916b3a6d11da84316925f8abd8a3a1447445') issues.push('PUBLIC_ROUTE_INPUT_IDENTITY_MISMATCH');
  const matrix = candidate?.acceptanceMatrix ?? {};
  for (const key of ['portraitMobileBrowserSession', 'landscapeMobileBrowserSession']) if (matrix[key] !== true) issues.push(`R3E4_MATRIX_SESSION_MISSING:${key}`);
  for (const key of ['oneFingerLook', 'twoFingerForwardTravel', 'twoFingerBackwardTravel', 'pinchZoomIn', 'pinchZoomOut']) if (matrix[key] !== 'REQUIRED') issues.push(`R3E4_MATRIX_INTERACTION_INVALID:${key}`);
  if (matrix.visibleController !== 'PROHIBITED' || matrix.wheelSubstitutionForTouch !== 'PROHIBITED') issues.push('R3E4_MATRIX_PROHIBITION_INVALID');
  if (candidate?.correspondenceLaw?.frameCoalescingPolicy !== 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL') issues.push('R3E4_FRAME_COALESCING_POLICY_INVALID');
  if (Object.entries(candidate?.correspondenceLaw ?? {}).filter(([key]) => key !== 'frameCoalescingPolicy').some(([, value]) => value !== true)) issues.push('R3E4_CORRESPONDENCE_LAW_INCOMPLETE');
  const sustained = candidate?.sustainedExecution ?? {};
  if (sustained.scheduledInteractionGroupsPerOrientation !== 24 || sustained.inputCadenceMs !== 350 || sustained.maximumConcurrentCallbacks !== 1) issues.push('R3E4_SUSTAINED_STRUCTURE_INVALID');
  if (sustained.maximumTimerDeliveryLagExclusiveMs !== 2000 || sustained.maximumActionCompletionLagExclusiveMs !== 2000 || sustained.maximumSynchronousActionProcessingExclusiveMs !== 1000) issues.push('R3E4_TIMING_THRESHOLDS_INVALID');
  for (const [key, value] of Object.entries(candidate?.protectedBoundaries ?? {})) if (value !== false) issues.push(`R3E4_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.failureLaw?.publicSourcePatchInAcceptanceRun !== false || candidate?.failureLaw?.correctionRequiresSeparateCheckpoint !== true) issues.push('R3E4_FAILURE_LAW_INVALID');
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E5_NOT_STARTED' || candidate?.stoppingBoundary !== 'STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5') issues.push('R3E4_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E4_PASS_CLOSED' : candidate?.currentStatus === 'FAIL_OPEN' ? 'RUN_8E_R3E4_FAIL_OPEN' : 'RUN_8E_R3E4_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3E4_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E4_CONTROL;
