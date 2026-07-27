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
  currentStatus: 'EXECUTION_PENDING',
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
