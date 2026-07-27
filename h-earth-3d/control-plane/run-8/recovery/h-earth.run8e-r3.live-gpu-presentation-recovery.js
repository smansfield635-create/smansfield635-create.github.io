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
    run8ER3D: 'PASS_CLOSED',
    run8ER3D5: 'PASS_CLOSED',
    r3D5FinalExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
    r3D5FinalWorkflowRun: 30303974940,
    r3D5FinalWorkflowJob: 90103548271,
    r3D5FinalEvidenceArtifact: 8667678685,
    r3D5FinalEvidenceArtifactDigest: 'sha256:d62581b68b94e5104895f5d35688a9a68b0189108d2e8100cf4e81369a47ef94',
    r3D5PassReceiptGitBlob: 'f9f6d9b1464882f7e8cf7143a4d4e90d4093dcec',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicCpuRouteControllerGitBlob: '83e85df2f4440c2825672f46fb16e28c73992db2',
    publicCpuEnvironmentIntegrationGitBlob: '6c047d61544fcbc4fad8673abfbacb7c827fdb22',
    publicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    run8E: 'FAIL_OPEN'
  },
  governingLaw: [
    'R3E_IS_PUBLIC_ROUTE_ORCHESTRATION_AND_BINDING_NOT_ARCHITECTURE_REDESIGN',
    'R3E1_MUST_DECLARE_EXACT_MUTATION_SCOPE_BEFORE_ANY_PUBLIC_SOURCE_MUTATION',
    'EXACTLY_ONE_ACTIVE_PUBLIC_PRESENTATION_CORRIDOR',
    'LEGACY_CPU_RASTER_BITMAP_PREVIEW_AND_DEFERRED_REFRESH_MUST_NOT_RUN_BESIDE_THE_GPU_CORRIDOR',
    'ADMITTED_NAVIGATION_FRAME_PACKET_RENDERER_INPUT_AND_BINDING_AUTHORITIES_REMAIN_UNMODIFIED',
    'NO_RUN_8E_PASS_BEFORE_REAL_MOBILE_ACCEPTANCE'
  ],
  boundedSubcheckpoints: [
    { checkpointId: 'RUN_8E_R3A', currentStatus: 'PASS_CLOSED' },
    { checkpointId: 'RUN_8E_R3B', currentStatus: 'PASS_CLOSED' },
    { checkpointId: 'RUN_8E_R3C', currentStatus: 'PASS_CLOSED' },
    { checkpointId: 'RUN_8E_R3D', currentStatus: 'PASS_CLOSED', finalExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7' },
    {
      checkpointId: 'RUN_8E_R3E',
      name: 'PUBLIC_ROUTE_GPU_INTEGRATION',
      currentStatus: 'IN_PROGRESS',
      boundedSubcheckpoints: [
        {
          checkpointId: 'RUN_8E_R3E1',
          name: 'EXACT_PUBLIC_INTEGRATION_MUTATION_SCOPE',
          currentStatus: 'EXECUTION_PENDING',
          stoppingBoundary: 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'
        },
        { checkpointId: 'RUN_8E_R3E2', name: 'BRANCH_LOCAL_PUBLIC_ROUTE_COMPOSITION', currentStatus: 'NOT_STARTED' },
        { checkpointId: 'RUN_8E_R3E3', name: 'PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_AUDIT', currentStatus: 'NOT_STARTED' },
        { checkpointId: 'RUN_8E_R3E4', name: 'PUBLIC_ROUTE_DIRECT_MANIPULATION_BROWSER_EXECUTION', currentStatus: 'NOT_STARTED' },
        { checkpointId: 'RUN_8E_R3E5', name: 'R3E_CLOSURE_AND_R3F_INPUT_DECISION', currentStatus: 'NOT_STARTED' }
      ]
    },
    { checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3E1_EXECUTION',
    run8ER3D: 'PASS_CLOSED',
    run8ER3E: 'IN_PROGRESS',
    run8ER3E1: 'EXECUTION_PENDING',
    run8ER3E2: 'NOT_STARTED',
    run8ER3E3: 'NOT_STARTED',
    run8ER3E4: 'NOT_STARTED',
    run8ER3E5: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  },
  boundaries: {
    showroomSourceMutation: false,
    publicRouteMutation: false,
    publicRouteBinding: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    r3AFramePacketSourceMutation: false,
    persistentRendererSourceMutation: false,
    pointerTouchIntakeSourceMutation: false,
    liveGpuBindingSourceMutation: false,
    diagnosticRouteMutation: false,
    browserExecution: false,
    gpuExecution: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E2Work: false,
    mainMerge: false,
    run8EPassClosed: false,
    exactScopeDeclarationAuthorized: true,
    publicSourceReadAuthorized: true,
    rollbackDeclarationAuthorized: true
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3D = checkpoints[3];
  const r3E = checkpoints[4];
  const stages = r3E?.boundedSubcheckpoints ?? [];
  const r3E1 = stages[0];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D !== 'PASS_CLOSED' || candidate?.predecessor?.run8ER3D5 !== 'PASS_CLOSED') issues.push('R3D_PREDECESSOR_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3D5FinalExactHead !== 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7') issues.push('R3D5_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3D5FinalEvidenceArtifactDigest !== 'sha256:d62581b68b94e5104895f5d35688a9a68b0189108d2e8100cf4e81369a47ef94') issues.push('R3D5_FINAL_ARTIFACT_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3E_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3D_NOT_PASS_CLOSED');
  if (r3E?.currentStatus !== 'IN_PROGRESS') issues.push('R3E_NOT_IN_PROGRESS');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3E1?.currentStatus)) issues.push('R3E1_STATE_INVALID');
  if (stages.slice(1).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3E_STAGE_STARTED');
  if (checkpoints.slice(5).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F_OR_R3G_STARTED');
  if (r3E1?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E1_EXECUTION' || candidate?.currentState?.run8ER3E1 !== 'EXECUTION_PENDING') issues.push('R3E1_PARENT_EXECUTION_STATE_INVALID');
  } else if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E2_BOUNDARY' || candidate?.currentState?.run8ER3E2 !== 'NOT_STARTED') {
    issues.push('R3E2_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['showroomSourceMutation','publicRouteMutation','publicRouteBinding','publicDirectManipulationMutation','navigationAuthorityMutation','r3AFramePacketSourceMutation','persistentRendererSourceMutation','pointerTouchIntakeSourceMutation','liveGpuBindingSourceMutation','diagnosticRouteMutation','browserExecution','gpuExecution','deployment','physicalDeviceAcceptance','r3E2Work','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3E1_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['exactScopeDeclarationAuthorized','publicSourceReadAuthorized','rollbackDeclarationAuthorized']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3E1_AUTHORIZATION_MISSING:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3E1?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E1_PARENT_PASS_CLOSED' : 'RUN_8E_R3E1_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
