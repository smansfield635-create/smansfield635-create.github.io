const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3_CONTRACT_ID =
  'H_EARTH_RUN_8E_R3_LIVE_GPU_PRESENTATION_RECOVERY_v1';

export const H_EARTH_RUN_8E_R3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R3',
  checkpointName: 'LIVE_GPU_PRESENTATION_AND_DIRECT_MOBILE_INSPECTION_RECOVERY',
  predecessor: {
    run8ER2: 'PASS_CLOSED',
    run8ER3A: 'PASS_CLOSED',
    run8ER3B: 'PASS_CLOSED',
    run8ER3C: 'PASS_CLOSED',
    run8ER3D1: 'PASS_CLOSED',
    run8ER3D2: 'PASS_CLOSED',
    run8ER3D3: 'PASS_CLOSED',
    r3D2FinalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
    r3D3FinalExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
    r3D3FinalWorkflowRun: 30299252089,
    r3D3FinalWorkflowJob: 90087858393,
    r3D3FinalEvidenceArtifact: 8665890253,
    r3D3FinalEvidenceArtifactDigest: 'sha256:5fc53a506c386af468b4ebc3012a38970ae465bfd94a42825b07233d1acc3f5f',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationWitnessGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    run8E: 'FAIL_OPEN'
  },
  governingLaw: [
    'BUILD_THE_WORLD_ONCE',
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'PRESERVE_SHARED_NAVIGATION_AND_CAMERA_PROPOSAL_AUTHORITY',
    'PRESENT_CURRENT_CAMERA_STATE_THROUGH_WEBGL2',
    'PERSIST_GPU_RESOURCES_ACROSS_CAMERA_RESPONSES',
    'REMOVE_FLAT_BITMAP_PREVIEW_BEFORE_PUBLIC_ACCEPTANCE',
    'BREAK_DIRECT_INTERACTION_RECOVERY_INTO_SMALL_DURABLE_SUBCHECKPOINTS',
    'R3D4_MAY_EXECUTE_SUSTAINED_DIAGNOSTIC_BROWSER_INTERACTION_ONLY',
    'R3D4_MUST_TEST_PORTRAIT_AND_LANDSCAPE_WITHOUT_MULTI_SECOND_INPUT_BACKLOG',
    'R3D5_OWNS_R3D_CLOSURE_AND_R3E_INPUT_DECISION',
    'NO_RUN_8E_PASS_BEFORE_REAL_MOBILE_ACCEPTANCE'
  ],
  boundedSubcheckpoints: [
    { checkpointId: 'RUN_8E_R3A', currentStatus: 'PASS_CLOSED' },
    { checkpointId: 'RUN_8E_R3B', currentStatus: 'PASS_CLOSED' },
    { checkpointId: 'RUN_8E_R3C', currentStatus: 'PASS_CLOSED' },
    {
      checkpointId: 'RUN_8E_R3D',
      name: 'DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW',
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: [
        { checkpointId: 'RUN_8E_R3D1', currentStatus: 'PASS_CLOSED' },
        { checkpointId: 'RUN_8E_R3D2', currentStatus: 'PASS_CLOSED', finalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd' },
        { checkpointId: 'RUN_8E_R3D3', currentStatus: 'PASS_CLOSED', finalExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5' },
        {
          checkpointId: 'RUN_8E_R3D4',
          name: 'DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION',
          currentStatus: 'PASS_CLOSED',
          executionEvidence: {
            successfulExecutionHead: '579ab9c3bd1371239e8a3a81f65ee4fffaa18a65',
            workflowRun: 30300915536,
            workflowJob: 90093335073,
            evidenceArtifact: 8666527165,
            evidenceArtifactDigest: 'sha256:7ace397a3fe7f476711337c667c6e65195ad4f4ef23871163bfd9434abd87b17',
            automaticRegistryPreflightRun: 30300915486,
            browserSessionCount: 2,
            scheduledInteractionGroupCount: 48,
            acceptedProposalCount: 72,
            visibleGpuFrameCount: 72,
            maximumDeliveryLagMs: 276.40000000000873,
            maximumCompletionLagMs: 606.9000000000087,
            maximumActionProcessingMs: 409.5,
            maximumConcurrentCallbacks: 1,
            worldRebuildCount: 0,
            deferredRenderCommitCount: 0,
            queuedFrameChainCount: 0,
            postInitializationResourceCreationCount: 0,
            postInitializationBufferUploadCount: 0,
            bitmapPreviewApplicationCount: 0,
            cssTransformPreviewCount: 0
          },
          stoppingBoundary: 'STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5'
        },
        { checkpointId: 'RUN_8E_R3D5', name: 'R3D_CLOSURE_AND_R3E_INPUT_DECISION', currentStatus: 'NOT_STARTED' }
      ],
      stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
    },
    { checkpointId: 'RUN_8E_R3E', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3D5_BOUNDARY',
    run8ER3D: 'IN_PROGRESS',
    run8ER3D1: 'PASS_CLOSED',
    run8ER3D2: 'PASS_CLOSED',
    run8ER3D3: 'PASS_CLOSED',
    run8ER3D4: 'PASS_CLOSED',
    run8ER3D5: 'NOT_STARTED',
    run8ER3E: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  },
  boundaries: {
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    r3AFramePacketSourceMutation: false,
    persistentRendererSourceMutation: false,
    pointerTouchIntakeSourceMutation: false,
    liveGpuBindingSourceMutation: false,
    bitmapPreviewExecution: false,
    cssCanvasTransformPreview: false,
    domImagePresentation: false,
    publicRouteBinding: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3D5Work: false,
    mainMerge: false,
    run8EPassClosed: false,
    portraitBrowserExecutionAuthorized: true,
    landscapeBrowserExecutionAuthorized: true,
    sustainedScheduledInputAuthorized: true,
    diagnosticTimingEvidenceAuthorized: true,
    diagnosticScreenshotEvidenceAuthorized: true
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3D = checkpoints[3];
  const stages = r3D?.boundedSubcheckpoints ?? [];
  const r3D4 = stages[3];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D3 !== 'PASS_CLOSED') issues.push('R3D3_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3D3FinalExactHead !== '45dbf26ca8495ba03657ff0aeba52225359d23e5') issues.push('R3D3_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3D3FinalEvidenceArtifactDigest !== 'sha256:5fc53a506c386af468b4ebc3012a38970ae465bfd94a42825b07233d1acc3f5f') issues.push('R3D3_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3D_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3C_NOT_PASS_CLOSED');
  if (stages.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3D1_R3D3_NOT_PASS_CLOSED');
  if (r3D?.currentStatus !== 'IN_PROGRESS') issues.push('R3D_NOT_IN_PROGRESS');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3D4?.currentStatus)) issues.push('R3D4_STATE_INVALID');
  if (stages[4]?.currentStatus !== 'NOT_STARTED') issues.push('R3D5_STARTED_EARLY');
  if (checkpoints.slice(4).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3_STAGE_STARTED');
  if (r3D4?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D4_EXECUTION' || candidate?.currentState?.run8ER3D4 !== 'EXECUTION_PENDING') issues.push('R3D4_PARENT_EXECUTION_STATE_INVALID');
  } else if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D5_BOUNDARY' || candidate?.currentState?.run8ER3D5 !== 'NOT_STARTED') {
    issues.push('R3D5_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['publicRouteMutation','publicDirectManipulationMutation','navigationAuthorityMutation','r3AFramePacketSourceMutation','persistentRendererSourceMutation','pointerTouchIntakeSourceMutation','liveGpuBindingSourceMutation','bitmapPreviewExecution','cssCanvasTransformPreview','domImagePresentation','publicRouteBinding','deployment','physicalDeviceAcceptance','r3D5Work','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['portraitBrowserExecutionAuthorized','landscapeBrowserExecutionAuthorized','sustainedScheduledInputAuthorized','diagnosticTimingEvidenceAuthorized','diagnosticScreenshotEvidenceAuthorized']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3D4_AUTHORIZATION_MISSING:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3D4?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D4_PARENT_PASS_CLOSED' : 'RUN_8E_R3D4_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
