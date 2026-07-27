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
    run8ER3D4: 'PASS_CLOSED',
    r3D1FinalExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d',
    r3D2FinalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
    r3D3FinalExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
    r3D4FinalExactHead: '641c25f76d44f95709693a1cc0aec7ecbb53ae2e',
    r3D4FinalWorkflowRun: 30301479872,
    r3D4FinalWorkflowJob: 90095219458,
    r3D4FinalEvidenceArtifact: 8666741737,
    r3D4FinalEvidenceArtifactDigest: 'sha256:c1f7845ff732718f44168e23fcb520f1ab74315102777025a694de4b6ca40292',
    r3D1PassReceiptGitBlob: '0ea8f618f597aef527655f28951d9cf4e9629485',
    r3D2PassReceiptGitBlob: '69748b18b155e87930b52104f3e3c16385e3150f',
    r3D3PassReceiptGitBlob: 'c744db650a1f0ba3bec208312b82cd469ce5dc0b',
    r3D4PassReceiptGitBlob: '8f8a7d91354911d318edf850e87ab6ea890077a9',
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
    'R3D5_MAY_CLOSE_R3D_AND_ISSUE_THE_R3E_INPUT_DECISION_ONLY',
    'R3E_IMPLEMENTATION_REQUIRES_A_SEPARATE_BRANCH_FROM_THE_R3D5_FINAL_EXACT_HEAD',
    'NO_PUBLIC_ROUTE_MUTATION_INSIDE_R3D5',
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
        { checkpointId: 'RUN_8E_R3D1', currentStatus: 'PASS_CLOSED', finalExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d' },
        { checkpointId: 'RUN_8E_R3D2', currentStatus: 'PASS_CLOSED', finalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd' },
        { checkpointId: 'RUN_8E_R3D3', currentStatus: 'PASS_CLOSED', finalExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5' },
        { checkpointId: 'RUN_8E_R3D4', currentStatus: 'PASS_CLOSED', finalExactHead: '641c25f76d44f95709693a1cc0aec7ecbb53ae2e' },
        {
          checkpointId: 'RUN_8E_R3D5',
          name: 'R3D_CLOSURE_AND_R3E_INPUT_DECISION',
          currentStatus: 'EXECUTION_PENDING',
          requiredResult: 'R3D_PASS_CLOSED_AND_R3E_INPUT_ADMITTED',
          stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
        }
      ],
      stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
    },
    { checkpointId: 'RUN_8E_R3E', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3F', currentStatus: 'NOT_STARTED' },
    { checkpointId: 'RUN_8E_R3G', currentStatus: 'NOT_STARTED' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3D5_EXECUTION',
    run8ER3D: 'IN_PROGRESS',
    run8ER3D1: 'PASS_CLOSED',
    run8ER3D2: 'PASS_CLOSED',
    run8ER3D3: 'PASS_CLOSED',
    run8ER3D4: 'PASS_CLOSED',
    run8ER3D5: 'EXECUTION_PENDING',
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
    diagnosticRouteMutation: false,
    browserExecution: false,
    gpuExecution: false,
    publicRouteBinding: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3EImplementation: false,
    mainMerge: false,
    run8EPassClosed: false,
    r3DClosureAuthorized: true,
    r3EInputDecisionAuthorized: true,
    repositoryEvidenceReconciliationAuthorized: true
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3D = checkpoints[3];
  const stages = r3D?.boundedSubcheckpoints ?? [];
  const r3D5 = stages[4];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER3D4 !== 'PASS_CLOSED') issues.push('R3D4_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3D4FinalExactHead !== '641c25f76d44f95709693a1cc0aec7ecbb53ae2e') issues.push('R3D4_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3D4FinalEvidenceArtifactDigest !== 'sha256:c1f7845ff732718f44168e23fcb520f1ab74315102777025a694de4b6ca40292') issues.push('R3D4_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7 || stages.length !== 5) issues.push('R3_OR_R3D_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3C_NOT_PASS_CLOSED');
  if (stages.slice(0, 4).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3D1_R3D4_NOT_PASS_CLOSED');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3D5?.currentStatus)) issues.push('R3D5_STATE_INVALID');
  if (checkpoints.slice(4).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3_STAGE_STARTED');
  if (r3D5?.currentStatus === 'EXECUTION_PENDING') {
    if (r3D?.currentStatus !== 'IN_PROGRESS') issues.push('R3D_NOT_IN_PROGRESS_DURING_R3D5');
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D5_EXECUTION' || candidate?.currentState?.run8ER3D5 !== 'EXECUTION_PENDING') issues.push('R3D5_PARENT_EXECUTION_STATE_INVALID');
  } else {
    if (r3D?.currentStatus !== 'PASS_CLOSED') issues.push('R3D_NOT_PASS_CLOSED_AFTER_R3D5');
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3E_BOUNDARY' || candidate?.currentState?.run8ER3D !== 'PASS_CLOSED' || candidate?.currentState?.run8ER3E !== 'NOT_STARTED') issues.push('R3E_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['publicRouteMutation','publicDirectManipulationMutation','navigationAuthorityMutation','r3AFramePacketSourceMutation','persistentRendererSourceMutation','pointerTouchIntakeSourceMutation','liveGpuBindingSourceMutation','diagnosticRouteMutation','browserExecution','gpuExecution','publicRouteBinding','deployment','physicalDeviceAcceptance','r3EImplementation','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['r3DClosureAuthorized','r3EInputDecisionAuthorized','repositoryEvidenceReconciliationAuthorized']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3D5_AUTHORIZATION_MISSING:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3D5?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D_PARENT_PASS_CLOSED_OPEN_AT_R3E_BOUNDARY' : 'RUN_8E_R3D5_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
