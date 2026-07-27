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
    r3CFinalExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    r3D1FinalExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d',
    r3D2FinalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
    r3D2FinalWorkflowRun: 30297782545,
    r3D2FinalWorkflowJob: 90082955826,
    r3D2FinalEvidenceArtifact: 8665322670,
    r3D2FinalEvidenceArtifactDigest: 'sha256:514d5d71dd60eaf8dd6b53e7e781876efebc045f2f4cf381fe460634fb82350b',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    liveRendererContractGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
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
    'R3D3_MAY_BIND_DIAGNOSTIC_NAVIGATION_STATE_TO_R3A_PACKET_AND_R3C_RENDERER_ONLY',
    'R3D4_OWNS_BROADER_INTERACTION_BROWSER_EXECUTION_AND_BACKLOG_ACCEPTANCE',
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
        { checkpointId: 'RUN_8E_R3D1', name: 'DIAGNOSTIC_DIRECTORY_AND_HOST_SCAFFOLD', currentStatus: 'PASS_CLOSED', finalExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d' },
        { checkpointId: 'RUN_8E_R3D2', name: 'POINTER_AND_TOUCH_NAVIGATION_PROPOSAL_INTAKE', currentStatus: 'PASS_CLOSED', finalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd' },
        {
          checkpointId: 'RUN_8E_R3D3',
          name: 'LIVE_GPU_CAMERA_RESPONSE_WITHOUT_BITMAP_PREVIEW',
          currentStatus: 'PASS_CLOSED',
          executionEvidence: {
            successfulExecutionHead: 'a1fab0b653fd6004bc35a692cd786d568695e2b9',
            workflowRun: 30298763874,
            workflowJob: 90086226228,
            evidenceArtifact: 8665702890,
            evidenceArtifactDigest: 'sha256:b752025984227dab39d2ffae59563df332b8ac030b1955bb71b6b07a5da5ef9c',
            automaticRegistryPreflightRun: 30298763954,
            acceptedNavigationProposalCount: 7,
            visibleGpuFrameCount: 8,
            distinctFrameHashCount: 8,
            webGLContextCount: 1,
            gpuBufferUploadCount: 9,
            cameraUniformUpdateCount: 16,
            geometryDrawCallCount: 32,
            postInitializationResourceCreationCount: 0,
            postInitializationBufferUploadCount: 0,
            worldRebuildCount: 0,
            maximumSynchronousResponseMs: 187.29999999998836
          },
          stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4'
        },
        { checkpointId: 'RUN_8E_R3D4', name: 'DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION', currentStatus: 'NOT_STARTED' },
        { checkpointId: 'RUN_8E_R3D5', name: 'R3D_CLOSURE_AND_R3E_INPUT_DECISION', currentStatus: 'NOT_STARTED' }
      ],
      stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
    },
    { checkpointId: 'RUN_8E_R3E', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3D4_BOUNDARY',
    run8ER3D: 'IN_PROGRESS',
    run8ER3D1: 'PASS_CLOSED',
    run8ER3D2: 'PASS_CLOSED',
    run8ER3D3: 'PASS_CLOSED',
    run8ER3D4: 'NOT_STARTED',
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
    cameraAuthorityMutation: false,
    persistentRendererSourceMutation: false,
    bitmapPreviewExecution: false,
    cssCanvasTransformPreview: false,
    publicRouteBinding: false,
    deployment: false,
    mainMerge: false,
    run8EPassClosed: false,
    diagnosticWebGLContextAuthorized: true,
    persistentRendererInitializationAuthorized: true,
    liveGpuCameraBindingAuthorized: true,
    gpuFramebufferBlitAuthorized: true,
    diagnosticEvidenceReadbackAuthorized: true
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3D = checkpoints[3];
  const stages = r3D?.boundedSubcheckpoints ?? [];
  const r3D1 = stages[0];
  const r3D2 = stages[1];
  const r3D3 = stages[2];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D2 !== 'PASS_CLOSED') issues.push('R3D2_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3D2FinalExactHead !== 'a58ed510eda8c21aac6fa6870271d945387f7cbd') issues.push('R3D2_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3D2FinalEvidenceArtifactDigest !== 'sha256:514d5d71dd60eaf8dd6b53e7e781876efebc045f2f4cf381fe460634fb82350b') issues.push('R3D2_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3D_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3C_NOT_PASS_CLOSED');
  if (r3D?.currentStatus !== 'IN_PROGRESS') issues.push('R3D_NOT_IN_PROGRESS');
  if (r3D1?.currentStatus !== 'PASS_CLOSED' || r3D2?.currentStatus !== 'PASS_CLOSED') issues.push('R3D1_R3D2_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3D3?.currentStatus)) issues.push('R3D3_STATE_INVALID');
  if (stages.slice(3).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3D_STAGE_STARTED');
  if (checkpoints.slice(4).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3_STAGE_STARTED');
  if (r3D3?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D3_EXECUTION' || candidate?.currentState?.run8ER3D3 !== 'EXECUTION_PENDING') issues.push('R3D3_PARENT_EXECUTION_STATE_INVALID');
  } else if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D4_BOUNDARY' || candidate?.currentState?.run8ER3D4 !== 'NOT_STARTED') {
    issues.push('R3D4_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['publicRouteMutation','publicDirectManipulationMutation','navigationAuthorityMutation','cameraAuthorityMutation','persistentRendererSourceMutation','bitmapPreviewExecution','cssCanvasTransformPreview','publicRouteBinding','deployment','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['diagnosticWebGLContextAuthorized','persistentRendererInitializationAuthorized','liveGpuCameraBindingAuthorized','gpuFramebufferBlitAuthorized','diagnosticEvidenceReadbackAuthorized']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3D3_AUTHORIZATION_MISSING:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3D3?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D3_PARENT_PASS_CLOSED' : 'RUN_8E_R3D3_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
