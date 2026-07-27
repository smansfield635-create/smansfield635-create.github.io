import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3C_CONTROL_ID =
  'H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_RESOURCE_AND_CONTINUOUS_CAMERA_LOOP_CONTROL_v1';

export const H_EARTH_RUN_8E_R3C_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3C_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3C',
  checkpointName: 'PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3c-persistent-gpu-camera-loop-001',
  baseBranch: 'agent/h-earth-run8e-r3b-isolated-webgl2-fixed-frame-001',
  baseExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
  currentStatus: 'PASS_CLOSED',
  requiredInputs: {
    r3BPassClosed: true,
    r3BFinalExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
    r3BFixedFrameSha256: '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639',
    logicalPromotedPackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3ALiveRendererContractGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1'
  },
  executionEvidence: {
    successfulExecutionHead: '1b02cb845d3b81c04fc3718233f5142765592f83',
    workflowRun: 30290450153,
    workflowJob: 90058672196,
    artifactId: 8662569874,
    artifactDigest: 'sha256:3aea0979d3523da1c6e2c3f41cdcfcf64a0501f58f6df9b1187b0ea5fda92e87',
    automaticRepositoryRegistryPreflightRun: 30290450161,
    automaticRepositoryRegistryPreflight: 'PASS',
    browserExecutionStatus: 'RUN_8E_R3C_EXECUTION_PASS',
    contextCreationCount: 1,
    shaderCompileCount: 4,
    programLinkCount: 2,
    vertexArrayCreateCount: 1,
    gpuBufferCount: 9,
    bufferUploadCount: 9,
    uploadedByteLength: 2145444,
    textureCount: 3,
    framebufferCount: 2,
    frameCount: 180,
    requestAnimationFrameCallbackCount: 180,
    maximumConcurrentCallbacks: 1,
    loopDurationMs: 4366.55,
    cameraUniformUpdateCount: 360,
    geometryDrawCallCount: 720,
    totalDrawnIndexCount: 26481600,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    worldRebuildCount: 0,
    startFrameSha256: 'ef5957da367f220b516a8a3b1d6c8787608cf20357747c26648a744ce03929a5',
    middleFrameSha256: '7464e078f2c3981126112517a7cecc4a9616e2c363a9bfd5d34a9448707e64e2',
    finalFrameSha256: '6afece3cb60200c1d78147794c6ff8cf8b3b907f4ea0851ace4d326d767ff35b',
    diagnosticPageSha256: '0615244a9fdb8fb8adcf0412565a1b44f8bfabcbc911d291a9c26c0e247480ac',
    startFramePixelHash: 'fnv1a32:13de0f5d',
    middleFramePixelHash: 'fnv1a32:c50c9cca',
    finalFramePixelHash: 'fnv1a32:f7b77601',
    depthPixelHash: 'fnv1a32:d98bf534',
    distinctFrameArtifactCount: 3
  },
  requiredExecution: {
    realWebGL2ContextRetained: true,
    shaderProgramsRetained: true,
    vertexArrayRetained: true,
    nineCanonicalGpuBuffersRetained: true,
    canonicalGpuBuffersUploadedExactlyOnce: true,
    framebufferAttachmentsRetained: true,
    requestAnimationFrameLoopExecuted: true,
    minimumContinuousFrameCount: 180,
    cameraViewProjectionUpdatedEveryFrame: true,
    cameraPositionUpdatedEveryFrame: true,
    fourDrawRangesExecutedEveryFrame: true,
    noPostInitializationBufferUpload: true,
    noPostInitializationResourceCreation: true,
    noWorldRebuildDuringCameraMovement: true,
    distinctStartMiddleFinalFrames: true,
    finalColorAndDepthOutputInspectable: true
  },
  boundaries: {
    publicRouteMutation: false,
    directManipulationMutation: false,
    navigationAuthorityMutation: false,
    cameraAuthorityMutation: false,
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    gestureBinding: false,
    pointerBinding: false,
    touchBinding: false,
    wheelBinding: false,
    publicRouteBinding: false,
    deployment: false,
    r3DWork: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3D_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D'
});

export function evaluateHEarthRun8ER3CControl(candidate = H_EARTH_RUN_8E_R3C_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3C_CONTROL_ID) issues.push('R3C_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1') issues.push('R3C_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3C_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3BPassClosed !== true) issues.push('R3B_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.r3BFixedFrameSha256 !== '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639') issues.push('R3B_FIXED_FRAME_DIGEST_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (key === 'minimumContinuousFrameCount') {
      if (!Number.isSafeInteger(value) || value < 180) issues.push('R3C_MINIMUM_FRAME_COUNT_INVALID');
    } else if (value !== true) {
      issues.push(`R3C_REQUIRED_EXECUTION_MISSING:${key}`);
    }
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3C_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.executionEvidence?.workflowRun !== 30290450153) issues.push('R3C_WORKFLOW_RUN_MISMATCH');
    if (candidate?.executionEvidence?.artifactDigest !== 'sha256:3aea0979d3523da1c6e2c3f41cdcfcf64a0501f58f6df9b1187b0ea5fda92e87') issues.push('R3C_ARTIFACT_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.contextCreationCount !== 1 || candidate?.executionEvidence?.gpuBufferCount !== 9 || candidate?.executionEvidence?.bufferUploadCount !== 9) issues.push('R3C_RESOURCE_INITIALIZATION_IDENTITY_MISMATCH');
    if (candidate?.executionEvidence?.frameCount !== 180 || candidate?.executionEvidence?.cameraUniformUpdateCount !== 360) issues.push('R3C_FRAME_OR_UNIFORM_COUNT_MISMATCH');
    if (candidate?.executionEvidence?.geometryDrawCallCount !== 720 || candidate?.executionEvidence?.totalDrawnIndexCount !== 26481600) issues.push('R3C_DRAW_EXECUTION_MISMATCH');
    if (candidate?.executionEvidence?.postInitializationResourceCreationCount !== 0 || candidate?.executionEvidence?.postInitializationBufferUploadCount !== 0 || candidate?.executionEvidence?.worldRebuildCount !== 0) issues.push('R3C_PERSISTENCE_BOUNDARY_MISMATCH');
    if (candidate?.executionEvidence?.distinctFrameArtifactCount !== 3) issues.push('R3C_DISTINCT_FRAME_ARTIFACTS_MISSING');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3D_NOT_STARTED') issues.push('R3D_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D') issues.push('R3C_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3C_PASS_CLOSED' : 'RUN_8E_R3C_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3C_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3C_CONTROL;
