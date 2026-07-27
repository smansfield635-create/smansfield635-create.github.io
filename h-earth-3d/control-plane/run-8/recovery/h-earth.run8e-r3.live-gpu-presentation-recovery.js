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
    r3BFinalWorkflowRun: 30288809515,
    r3BFinalWorkflowJob: 90053191900,
    r3BFinalEvidenceArtifact: 8661940302,
    r3BFinalEvidenceArtifactDigest: 'sha256:f794da533ba2b83e9f3182ee2a89e7f525a8c714f63e9c521446dc398a18c572',
    r3BFixedFrameSha256: '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639',
    immutablePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    run8E: 'FAIL_OPEN'
  },
  governingLaw: [
    'BUILD_THE_WORLD_ONCE',
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'PRESERVE_SHARED_NAVIGATION_AND_CAMERA_PROPOSAL_AUTHORITY',
    'PRESENT_CURRENT_CAMERA_STATE_THROUGH_WEBGL2',
    'PERSIST_GPU_RESOURCES_ACROSS_CAMERA_FRAMES',
    'UPDATE_CAMERA_UNIFORMS_WITHOUT_GPU_REUPLOAD',
    'PRESERVE_CPU_RENDERER_AS_REFERENCE_WITNESS_ONLY',
    'REMOVE_FLAT_BITMAP_PREVIEW_BEFORE_PUBLIC_ACCEPTANCE',
    'NO_RUN_8E_PASS_BEFORE_REAL_MOBILE_ACCEPTANCE'
  ],
  boundedSubcheckpoints: [
    {
      checkpointId: 'RUN_8E_R3A',
      name: 'SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_AND_UNIFORM_PACKET',
      currentStatus: 'PASS_CLOSED',
      stoppingBoundary: 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B'
    },
    {
      checkpointId: 'RUN_8E_R3B',
      name: 'ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        finalExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
        finalWorkflowRun: 30288809515,
        finalWorkflowJob: 90053191900,
        finalEvidenceArtifact: 8661940302,
        finalEvidenceArtifactDigest: 'sha256:f794da533ba2b83e9f3182ee2a89e7f525a8c714f63e9c521446dc398a18c572',
        fixedFrameSha256: '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639',
        durablePassReceipt: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.pass-closed.receipt.json'
      },
      stoppingBoundary: 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'
    },
    {
      checkpointId: 'RUN_8E_R3C',
      name: 'PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        successfulExecutionHead: '1b02cb845d3b81c04fc3718233f5142765592f83',
        workflowRun: 30290450153,
        workflowJob: 90058672196,
        evidenceArtifact: 8662569874,
        evidenceArtifactDigest: 'sha256:3aea0979d3523da1c6e2c3f41cdcfcf64a0501f58f6df9b1187b0ea5fda92e87',
        automaticRegistryPreflightRun: 30290450161,
        automaticRegistryPreflight: 'PASS',
        frameCount: 180,
        cameraUniformUpdateCount: 360,
        geometryDrawCallCount: 720,
        totalDrawnIndexCount: 26481600,
        postInitializationResourceCreationCount: 0,
        postInitializationBufferUploadCount: 0,
        distinctFrameArtifactCount: 3,
        startFrameSha256: 'ef5957da367f220b516a8a3b1d6c8787608cf20357747c26648a744ce03929a5',
        middleFrameSha256: '7464e078f2c3981126112517a7cecc4a9616e2c363a9bfd5d34a9448707e64e2',
        finalFrameSha256: '6afece3cb60200c1d78147794c6ff8cf8b3b907f4ea0851ace4d326d767ff35b'
      },
      stoppingBoundary: 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D'
    },
    { checkpointId: 'RUN_8E_R3D', name: 'DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E' },
    { checkpointId: 'RUN_8E_R3E', name: 'PUBLIC_ROUTE_BRANCH_INTEGRATION_AND_MOBILE_BROWSER_EXECUTION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_PHYSICAL_AND_BROADER_MOBILE_ACCEPTANCE_R3F' },
    { checkpointId: 'RUN_8E_R3F', name: 'PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_R3_CLOSURE_DECISION_R3G' },
    { checkpointId: 'RUN_8E_R3G', name: 'R3_CLOSURE_AND_PROMOTION_DECISION', currentStatus: 'NOT_STARTED', stoppingBoundary: 'STOP_BEFORE_ANY_LATER_RUN_8E_PHASE' }
  ],
  currentState: {
    run8ER3: 'OPEN_AT_R3D_BOUNDARY',
    run8ER3A: 'PASS_CLOSED',
    run8ER3B: 'PASS_CLOSED',
    run8ER3C: 'PASS_CLOSED',
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
    isolatedWebGL2ContextExecuted: true,
    isolatedShaderProgramsExecuted: true,
    isolatedGpuDrawExecuted: true,
    isolatedVisibleFixedFrameExecuted: true,
    persistentGpuResourcesExecuted: true,
    continuousCameraLoopExecuted: true,
    interactionBinding: false,
    publicRouteBinding: false,
    deployment: false,
    mainMerge: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER3Control(candidate = H_EARTH_RUN_8E_R3_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r3B = checkpoints[1];
  const r3C = checkpoints[2];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3_CONTRACT_ID) issues.push('R3_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER2 !== 'PASS_CLOSED') issues.push('R2_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8ER3A !== 'PASS_CLOSED') issues.push('R3A_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8ER3B !== 'PASS_CLOSED') issues.push('R3B_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.r3BFinalExactHead !== '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1') issues.push('R3B_FINAL_HEAD_MISMATCH');
  if (candidate?.predecessor?.r3BFinalEvidenceArtifactDigest !== 'sha256:f794da533ba2b83e9f3182ee2a89e7f525a8c714f63e9c521446dc398a18c572') issues.push('R3B_FINAL_ARTIFACT_DIGEST_MISMATCH');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 7) issues.push('R3_CHECKPOINT_SEQUENCE_INVALID');
  if (checkpoints[0]?.currentStatus !== 'PASS_CLOSED') issues.push('R3A_PASS_CLOSED_STATE_INVALID');
  if (r3B?.currentStatus !== 'PASS_CLOSED') issues.push('R3B_PASS_CLOSED_STATE_INVALID');
  if (r3C?.checkpointId !== 'RUN_8E_R3C' || !['EXECUTION_PENDING', 'PASS_CLOSED'].includes(r3C?.currentStatus)) issues.push('R3C_STATE_INVALID');
  if (checkpoints.slice(3).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('LATER_R3_CHECKPOINT_STARTED');
  if (r3C?.currentStatus === 'EXECUTION_PENDING') {
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3C_EXECUTION' || candidate?.currentState?.run8ER3C !== 'EXECUTION_PENDING') issues.push('R3C_PARENT_EXECUTION_STATE_INVALID');
  }
  if (r3C?.currentStatus === 'PASS_CLOSED') {
    if (r3C?.executionEvidence?.workflowRun !== 30290450153) issues.push('R3C_WORKFLOW_RUN_MISMATCH');
    if (r3C?.executionEvidence?.evidenceArtifactDigest !== 'sha256:3aea0979d3523da1c6e2c3f41cdcfcf64a0501f58f6df9b1187b0ea5fda92e87') issues.push('R3C_ARTIFACT_DIGEST_MISMATCH');
    if (r3C?.executionEvidence?.frameCount !== 180 || r3C?.executionEvidence?.cameraUniformUpdateCount !== 360) issues.push('R3C_FRAME_OR_UNIFORM_COUNT_MISMATCH');
    if (r3C?.executionEvidence?.geometryDrawCallCount !== 720 || r3C?.executionEvidence?.totalDrawnIndexCount !== 26481600) issues.push('R3C_DRAW_EXECUTION_MISMATCH');
    if (r3C?.executionEvidence?.postInitializationResourceCreationCount !== 0 || r3C?.executionEvidence?.postInitializationBufferUploadCount !== 0) issues.push('R3C_RESOURCE_PERSISTENCE_MISMATCH');
    if (candidate?.currentState?.run8ER3 !== 'OPEN_AT_R3D_BOUNDARY' || candidate?.currentState?.run8ER3D !== 'NOT_STARTED') issues.push('R3D_PARENT_BOUNDARY_INVALID');
  }
  for (const key of ['publicRouteMutation','directManipulationMutation','navigationAuthorityMutation','cameraAuthorityMutation','immutablePackageMutation','canonicalGpuTransportMutation','interactionBinding','publicRouteBinding','deployment','mainMerge','run8EPassClosed']) {
    if (candidate?.boundaries?.[key] !== false) issues.push(`R3_BOUNDARY_VIOLATION:${key}`);
  }
  for (const key of ['isolatedWebGL2ContextExecuted','isolatedShaderProgramsExecuted','isolatedGpuDrawExecuted','isolatedVisibleFixedFrameExecuted']) {
    if (candidate?.boundaries?.[key] !== true) issues.push(`R3B_EXECUTION_FACT_MISSING:${key}`);
  }
  if (r3C?.currentStatus === 'EXECUTION_PENDING') {
    for (const key of ['persistentGpuResourcesAuthorized','continuousCameraLoopAuthorized']) {
      if (candidate?.boundaries?.[key] !== true) issues.push(`R3C_AUTHORIZATION_MISSING:${key}`);
    }
  } else {
    for (const key of ['persistentGpuResourcesExecuted','continuousCameraLoopExecuted']) {
      if (candidate?.boundaries?.[key] !== true) issues.push(`R3C_EXECUTION_FACT_MISSING:${key}`);
    }
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (r3C?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3C_PARENT_PASS_CLOSED' : 'RUN_8E_R3C_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3_CONTROL;
