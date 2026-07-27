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
  currentStatus: 'PASS_CLOSED',
  coreExecutionEvidence: freeze({
    successfulExecutionHead: 'd99f883afb879756c398a3654e4a428f9dcfa3a1',
    workflowRun: 30311202411,
    workflowJob: 90126973627,
    artifactId: 8670441099,
    artifactDigest: 'sha256:ccc4c03763ee191f3675ab8fce7bb512cf4eb157277fde894b81bba76dbc3f41',
    artifactFetchBackVerified: true,
    automaticRepositoryRegistryPreflightRun: 30311202372,
    browserSessionCount: 2,
    scheduledInteractionGroupCount: 48,
    acceptedNavigationProposalCount: 80,
    publicFramePacketUpdateCount: 80,
    publicVisibleGpuResponseCount: 80,
    portrait: freeze({
      acceptedNavigationProposalCount: 40,
      publicFramePacketUpdateCount: 40,
      publicVisibleGpuResponseCount: 40,
      initialFrameSha256: '78cc8fe8458ede9a3a55272d49edfbc612b11f05d60cbe63a672b84498f84ef5',
      postInteractionFrameSha256: '86fc1ef5518fd9063c7b06082bcf07533b409a3b19953bf78c648fe965efc3a9',
      publicPageCaptureSha256: 'dcb96ca680af53f1d2b5a171821a1f57d0165bcd0def8020197f4352d78fda17',
      maximumActionCompletionLagMs: 279.6000000000058,
      maximumSynchronousActionProcessingMs: 280,
      maximumGpuResponseMs: 174.5
    }),
    landscape: freeze({
      acceptedNavigationProposalCount: 40,
      publicFramePacketUpdateCount: 40,
      publicVisibleGpuResponseCount: 40,
      initialFrameSha256: '03e673b44e6a18f17b60a51ba1a4cd0eaf5530565c5112050e921c49c8d34ac2',
      postInteractionFrameSha256: '0eb7962b029425f6cd1711f67533d656e7778f456b5b15872eb289ceb5691261',
      publicPageCaptureSha256: '9c87906fee42a118cc498a535986b9a6e50c58c00edc009ae8dd029c857c028b',
      maximumActionCompletionLagMs: 271.09999999999127,
      maximumSynchronousActionProcessingMs: 271.1999999999971,
      maximumGpuResponseMs: 177
    }),
    maximumTimerDeliveryLagMs: 0,
    maximumActionCompletionLagMs: 279.6000000000058,
    maximumSynchronousActionProcessingMs: 280,
    maximumGpuResponseMs: 177,
    maximumConcurrentCallbacks: 1,
    activeWebGL2ContextCountPerSession: 1,
    activePersistentRendererCountPerSession: 1,
    activeNavigationStreamCountPerSession: 1,
    activePointerTouchIntakeCountPerSession: 1,
    activeFramePresentationAuthorityCountPerSession: 1,
    canvas2DContextCountPerSession: 0,
    legacyModuleRequestCountPerSession: 0,
    duplicateInputListenerCountPerSession: 0,
    postInitializationResourceCreationCountPerSession: 0,
    postInitializationBufferUploadCountPerSession: 0,
    worldRebuildDuringGestureCountPerSession: 0,
    cssBitmapTransformCountPerSession: 0,
    domImagePresentationCountPerSession: 0,
    deferredPublicRefreshCountPerSession: 0,
    queuedNavigationChainCountPerSession: 0,
    queuedFrameChainCountPerSession: 0,
    inputListenerCountPerSession: 6,
    gpuBufferCountPerSession: 9,
    gpuBufferUploadCountPerSession: 9,
    uploadedBytesPerSession: 2145444,
    publicOneFingerLook: 'PASS',
    publicTwoFingerTravel: 'PASS',
    publicPinchZoom: 'PASS',
    publicPortraitExecution: 'PASS',
    publicLandscapeExecution: 'PASS',
    publicSustainedInteraction: 'PASS',
    publicRuntimeAuthorityExclusivity: 'PRESERVED',
    flatBitmapDragging: false,
    worldRebuildDuringGesture: false,
    obsoleteInputBacklog: false
  }),
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
  const evidence = candidate?.coreExecutionEvidence ?? {};
  if (parent.eligible !== true || parent.status !== 'RUN_8E_R3E4_PARENT_PASS_CLOSED') issues.push(...parent.issues.map((issue) => `PARENT:${issue}`), 'R3E4_PARENT_NOT_PASS_CLOSED');
  if (predecessor.eligible !== true || predecessor.status !== 'RUN_8E_R3E3_PASS_CLOSED') issues.push('R3E3_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E4_CONTROL_ID) issues.push('R3E4_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9') issues.push('R3E4_BASE_HEAD_MISMATCH');
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R3E4_NOT_PASS_CLOSED');
  if (candidate?.protectedInputs?.r3E3PassReceiptGitBlob !== '5c5f1ae06220f88f497dc2b45f4d749679849918') issues.push('R3E3_PASS_RECEIPT_INPUT_MISMATCH');
  if (candidate?.protectedInputs?.publicHtmlGitBlob !== '0daedf61f7e19af095f4db5fc47563a9cd786837' || candidate?.protectedInputs?.publicOrchestratorGitBlob !== '2b0a916b3a6d11da84316925f8abd8a3a1447445') issues.push('PUBLIC_ROUTE_INPUT_IDENTITY_MISMATCH');
  if (candidate?.correspondenceLaw?.frameCoalescingPolicy !== 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL') issues.push('R3E4_FRAME_COALESCING_POLICY_INVALID');
  if (Object.entries(candidate?.correspondenceLaw ?? {}).filter(([key]) => key !== 'frameCoalescingPolicy').some(([, value]) => value !== true)) issues.push('R3E4_CORRESPONDENCE_LAW_INCOMPLETE');
  const sustained = candidate?.sustainedExecution ?? {};
  if (sustained.scheduledInteractionGroupsPerOrientation !== 24 || sustained.inputCadenceMs !== 350 || sustained.maximumConcurrentCallbacks !== 1) issues.push('R3E4_SUSTAINED_STRUCTURE_INVALID');
  if (evidence.successfulExecutionHead !== 'd99f883afb879756c398a3654e4a428f9dcfa3a1' || evidence.workflowRun !== 30311202411 || evidence.workflowJob !== 90126973627 || evidence.artifactId !== 8670441099 || evidence.artifactFetchBackVerified !== true) issues.push('R3E4_CORE_EXECUTION_IDENTITY_INVALID');
  if (evidence.artifactDigest !== 'sha256:ccc4c03763ee191f3675ab8fce7bb512cf4eb157277fde894b81bba76dbc3f41') issues.push('R3E4_CORE_ARTIFACT_DIGEST_INVALID');
  if (evidence.browserSessionCount !== 2 || evidence.scheduledInteractionGroupCount !== 48 || evidence.acceptedNavigationProposalCount !== 80 || evidence.publicFramePacketUpdateCount !== 80 || evidence.publicVisibleGpuResponseCount !== 80) issues.push('R3E4_CORE_CORRESPONDENCE_COUNTS_INVALID');
  if (evidence.portrait?.acceptedNavigationProposalCount !== 40 || evidence.landscape?.acceptedNavigationProposalCount !== 40) issues.push('R3E4_ORIENTATION_COUNTS_INVALID');
  if (evidence.maximumTimerDeliveryLagMs >= 2000 || evidence.maximumActionCompletionLagMs >= 2000 || evidence.maximumSynchronousActionProcessingMs >= 1000 || evidence.maximumConcurrentCallbacks !== 1) issues.push('R3E4_TIMING_INVALID');
  for (const key of ['activeWebGL2ContextCountPerSession','activePersistentRendererCountPerSession','activeNavigationStreamCountPerSession','activePointerTouchIntakeCountPerSession','activeFramePresentationAuthorityCountPerSession']) if (evidence[key] !== 1) issues.push(`R3E4_RUNTIME_OWNER_INVALID:${key}`);
  for (const key of ['canvas2DContextCountPerSession','legacyModuleRequestCountPerSession','duplicateInputListenerCountPerSession','postInitializationResourceCreationCountPerSession','postInitializationBufferUploadCountPerSession','worldRebuildDuringGestureCountPerSession','cssBitmapTransformCountPerSession','domImagePresentationCountPerSession','deferredPublicRefreshCountPerSession','queuedNavigationChainCountPerSession','queuedFrameChainCountPerSession']) if (evidence[key] !== 0) issues.push(`R3E4_ZERO_LAW_VIOLATION:${key}`);
  for (const key of ['publicOneFingerLook','publicTwoFingerTravel','publicPinchZoom','publicPortraitExecution','publicLandscapeExecution','publicSustainedInteraction']) if (evidence[key] !== 'PASS') issues.push(`R3E4_ACCEPTANCE_NOT_PASS:${key}`);
  if (evidence.publicRuntimeAuthorityExclusivity !== 'PRESERVED') issues.push('R3E4_AUTHORITY_EXCLUSIVITY_NOT_PRESERVED');
  for (const key of ['flatBitmapDragging','worldRebuildDuringGesture','obsoleteInputBacklog']) if (evidence[key] !== false) issues.push(`R3E4_PROHIBITED_RESULT:${key}`);
  for (const [key, value] of Object.entries(candidate?.protectedBoundaries ?? {})) if (value !== false) issues.push(`R3E4_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.failureLaw?.publicSourcePatchInAcceptanceRun !== false || candidate?.failureLaw?.correctionRequiresSeparateCheckpoint !== true) issues.push('R3E4_FAILURE_LAW_INVALID');
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E5_NOT_STARTED' || candidate?.stoppingBoundary !== 'STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5') issues.push('R3E4_STOPPING_BOUNDARY_INVALID');
  return freeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'RUN_8E_R3E4_PASS_CLOSED' : 'RUN_8E_R3E4_CONTROL_FAIL', issues });
}

export default H_EARTH_RUN_8E_R3E4_CONTROL;
