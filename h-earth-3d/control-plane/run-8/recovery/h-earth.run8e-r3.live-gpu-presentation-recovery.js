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
    run8ER3A: 'PASS_CLOSED',
    r3AFinalExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
    run8ER3B: 'PASS_CLOSED',
    r3BFinalExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
    r3BFinalEvidenceArtifactDigest: 'sha256:f794da533ba2b83e9f3182ee2a89e7f525a8c714f63e9c521446dc398a18c572',
    run8ER3C: 'PASS_CLOSED',
    r3CFinalExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    r3CFinalWorkflowRun: 30291054680,
    r3CFinalWorkflowJob: 90060661454,
    r3CFinalEvidenceArtifact: 8662798227,
    r3CFinalEvidenceArtifactDigest: 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2',
    immutablePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    publicDirectManipulationWitnessGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    run8E: 'FAIL_OPEN'
  },
  governingLaw: [
    'BUILD_THE_WORLD_ONCE',
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'PRESERVE_SHARED_NAVIGATION_AND_CAMERA_PROPOSAL_AUTHORITY',
    'PRESENT_CURRENT_CAMERA_STATE_THROUGH_WEBGL2',
    'PERSIST_GPU_RESOURCES_ACROSS_CAMERA_FRAMES',
    'UPDATE_CAMERA_UNIFORMS_WITHOUT_GPU_REUPLOAD',
    'REMOVE_FLAT_BITMAP_PREVIEW_BEFORE_PUBLIC_ACCEPTANCE',
    'BREAK_DIRECT_INTERACTION_RECOVERY_INTO_SMALL_DURABLE_SUBCHECKPOINTS',
    'NO_RUN_8E_PASS_BEFORE_REAL_MOBILE_ACCEPTANCE'
  ],
  boundedSubcheckpoints: [
    { checkpointId: 'RUN_8E_R3A', name: 'SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_AND_UNIFORM_PACKET', currentStatus: 'PASS_CLOSED', stoppingBoundary: 'STOP_BEFORE_R3B' },
    { checkpointId: 'RUN_8E_R3B', name: 'ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION', currentStatus: 'PASS_CLOSED', stoppingBoundary: 'STOP_BEFORE_R3C' },
    {
      checkpointId: 'RUN_8E_R3C',
      name: 'PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        finalExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
        finalWorkflowRun: 30291054680,
        finalWorkflowJob: 90060661454,
        finalEvidenceArtifact: 8662798227,
        finalEvidenceArtifactDigest: 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2',
        frameCount: 180,
        cameraUniformUpdateCount: 360,
        geometryDrawCallCount: 720,
        postInitializationResourceCreationCount: 0,
        postInitializationBufferUploadCount: 0
      },
      stoppingBoundary: 'STOP_BEFORE_R3D'
    },
    {
      checkpointId: 'RUN_8E_R3D',
      name: 'DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW',
      currentStatus: 'EXECUTION_PENDING',
      boundedSubcheckpoints: [
        { checkpointId: 'RUN_8E_R3D1', name: 'DIAGNOSTIC_DIRECTORY_AND_HOST_SCAFFOLD', currentStatus: 'EXECUTION_PENDING', stoppingBoundary: 'STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2' },
        { checkpointId: 'RUN_8E_R3D2', name: 'POINTER_AND_TOUCH_NAVIGATION_PROPOSAL_INTAKE', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3' },
        { checkpointId: 'RUN_8E_R3D3', name: 'LIVE_GPU_CAMERA_RESPONSE_WITHOUT_BITMAP_PREVIEW', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4' },
        { checkpointId: 'RUN_8E_R3D4', name: 'DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_R3D_CLOSURE_R3D5' },
        { checkpointId: 'RUN_8E_R3D5', name: 'R3D_CLOSURE_AND_R3E_INPUT_DECISION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E' }
      ],
      stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
    },
    { checkpointId: 'RUN_8E_R3E', name: 'PUBLIC_ROUTE_BRANCH_INTEGRATION_AND_MOBILE_BROWSER_EXECUTION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_R3F' },
    { checkpointId: 'RUN_8E_R3F', name: 'PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_R3G' },
    { checkpointId: 'RUN_8E_R3G', name: 'R3_CLOSURE_AND_PROMOTION_DECISION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_ANY_LATER_RUN_8E_PHASE' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3D1_EXECUTION',
    run8ER3A: 'PASS_CLOSED',
    run8ER3B: 'PASS_CLOSED',
    run8ER3C: 'PASS_CLOSED',
    run8ER3D: 'EXECUTION_PENDING',
    run8ER3D1: 'EXECUTION_PENDING',
    run8ER3D2: 'NOT_STARTED',
    run8ER3D3: 'NOT_STARTED',
    run8ER3D4: 'NOT_STARTED',
    run8ER3D5: 'NOT_STARTED',
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
    persistentRendererMutation: false,
    diagnosticDirectoryScaffoldAuthorized: true,
    diagnosticHostScaffoldAuthorized: true,
    interactionBinding: false,
    pointerBinding: false,
    touchBinding: false,
    wheelBinding: false,
    liveGpuCameraBinding: false,
    publicRouteBinding: false,
    deployment: false,
    mainMerge: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3C = checkpoints[2];
  const r3D = checkpoints[3];
  const r3DStages = r3D?.boundedSubcheckpoints ?? [];
  const r3D1 = r3DStages[0];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER2 !== 'PASS_CLOSED') issues.push('R2_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8ER3A !== 'PASS_CLOSED') issues.push('R3A_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8ER3B !== 'PASS_CLOSED') issues.push('R3B_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8ER3C !== 'PASS_CLOSED') issues.push('R3C_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3CFinalExactHead !== '5c7a7eef489da94a230812eecc5e531e285b7cac') issues.push('R3C_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3CFinalEvidenceArtifactDigest !== 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2') issues.push('R3C_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7) issues.push('R3_CHECKPOINT_SEQUENCE_INVALID');
  if (checkpoints.slice(0, 3).some((entry) => entry.currentStatus !== 'PASS_CLOSED')) issues.push('R3A_R3C_NOT_PASS_CLOSED');
  if (r3C?.executionEvidence?.finalExactHead !== '5c7a7eef489da94a230812eecc5e531e285b7cac') issues.push('R3C_EXECUTION_EVIDENCE_MISMATCH');
  if (r3D?.checkpointId !== 'RUN_8E_R3D' || !['EXECUTION_PENDING', 'IN_PROGRESS', 'PASS_CLOSED'].includes(r3D?.currentStatus)) issues.push('R3D_STATE_INVALID');
  if (r3DStages.length !== 5) issues.push('R3D_SUBCHECKPOINT_SEQUENCE_INVALID');
  if (r3D1?.checkpointId !== 'RUN_8E_R3D1' || !['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3D1?.currentStatus)) issues.push('R3D1_STATE_INVALID');
  if (r3DStages.slice(1).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3D_SUBCHECKPOINT_STARTED');
  if (checkpoints.slice(4).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3_CHECKPOINT_STARTED');
  if (r3D1?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D1_EXECUTION' || candidate?.currentState?.run8ER3D1 !== 'EXECUTION_PENDING') issues.push('R3D1_PARENT_EXECUTION_STATE_INVALID');
  } else if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D2_BOUNDARY' || candidate?.currentState?.run8ER3D2 !== 'NOT_STARTED') {
    issues.push('R3D2_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['publicRouteMutation','directManipulationMutation','navigationAuthorityMutation','cameraAuthorityMutation','immutablePackageMutation','canonicalGpuTransportMutation','persistentRendererMutation','interactionBinding','pointerBinding','touchBinding','wheelBinding','liveGpuCameraBinding','publicRouteBinding','deployment','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['diagnosticDirectoryScaffoldAuthorized','diagnosticHostScaffoldAuthorized']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3D1_AUTHORIZATION_MISSING:${key}`);
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3D1?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D1_PARENT_PASS_CLOSED' : 'RUN_8E_R3D1_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
