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
    run8ER2F: 'PASS_CLOSED',
    r2FinalExactHead: '02aa90591a34968c8b6bacba926a156293ad0f76',
    immutablePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    promotionToR3Input: 'APPROVED',
    run8E: 'FAIL_OPEN'
  },
  governingLaw: [
    'BUILD_THE_WORLD_ONCE',
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'PRESERVE_SHARED_NAVIGATION_AND_CAMERA_PROPOSAL_AUTHORITY',
    'PRESENT_CURRENT_CAMERA_STATE_THROUGH_WEBGL2',
    'PRESERVE_CPU_RENDERER_AS_REFERENCE_WITNESS_ONLY',
    'REMOVE_FLAT_BITMAP_PREVIEW_BEFORE_PUBLIC_ACCEPTANCE',
    'NO_RUN_8E_PASS_BEFORE_REAL_MOBILE_ACCEPTANCE'
  ],
  boundedSubcheckpoints: [
    {
      checkpointId: 'RUN_8E_R3A',
      name: 'SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_AND_UNIFORM_PACKET',
      currentStatus: 'EXECUTION_PENDING',
      requiredResult: 'PASS_CLOSED_BEFORE_R3B',
      stoppingBoundary: 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B'
    },
    {
      checkpointId: 'RUN_8E_R3B',
      name: 'ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'
    },
    {
      checkpointId: 'RUN_8E_R3C',
      name: 'PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D'
    },
    {
      checkpointId: 'RUN_8E_R3D',
      name: 'DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
    },
    {
      checkpointId: 'RUN_8E_R3E',
      name: 'PUBLIC_ROUTE_BRANCH_INTEGRATION_AND_MOBILE_BROWSER_EXECUTION',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_PHYSICAL_AND_BROADER_MOBILE_ACCEPTANCE_R3F'
    },
    {
      checkpointId: 'RUN_8E_R3F',
      name: 'PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_R3_CLOSURE_DECISION_R3G'
    },
    {
      checkpointId: 'RUN_8E_R3G',
      name: 'R3_CLOSURE_AND_PROMOTION_DECISION',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_ANY_LATER_RUN_8E_PHASE'
    }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3A_EXECUTION',
    run8ER3A: 'EXECUTION_PENDING',
    run8ER3B: 'NOT_STARTED',
    run8ER3C: 'NOT_STARTED',
    run8ER3D: 'NOT_STARTED',
    run8ER3E: 'NOT_STARTED',
    run8ER3F: 'NOT_STARTED',
    run8ER3G: 'NOT_STARTED',
    run8E: 'FAIL_OPEN'
  },
  boundaries: {
    publicRouteMutation: false,
    directManipulationMutation: false,
    navigationAuthorityMutation: false,
    cameraAuthorityMutation: false,
    immutablePackageMutation: false,
    canonicalGpuTransportMutation: false,
    webglContextCreation: false,
    shaderOrProgramCreation: false,
    renderLoopCreation: false,
    visiblePresentation: false,
    deployment: false,
    mainMerge: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER2 !== 'PASS_CLOSED') issues.push('R2_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.promotionToR3Input !== 'APPROVED') issues.push('R3_INPUT_NOT_APPROVED');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7) issues.push('R3_CHECKPOINT_SEQUENCE_INVALID');
  if (checkpoints[0]?.checkpointId !== 'RUN_8E_R3A' || checkpoints[0]?.currentStatus !== 'EXECUTION_PENDING') {
    issues.push('R3A_EXECUTION_STATE_INVALID');
  }
  if (checkpoints.slice(1).some((entry) => entry.currentStatus !== 'NOT_STARTED')) {
    issues.push('LATER_R3_CHECKPOINT_STARTED');
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3A_CONTROL_EXECUTION_ELIGIBLE' : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
