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

export const H_EARTH_RUN_8E_R3B_CONTROL_ID =
  'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_CONTROL_v1';

export const H_EARTH_RUN_8E_R3B_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3B_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3B',
  checkpointName: 'ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3b-isolated-webgl2-fixed-frame-001',
  baseBranch: 'agent/h-earth-run8e-r3a-live-renderer-contract-001',
  baseExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
  currentStatus: 'EXECUTION_PENDING',
  requiredInputs: {
    r3APassClosed: true,
    r3AFinalExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
    r3AContractId: 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v1',
    immutablePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3ALiveRendererContractGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1'
  },
  requiredExecution: {
    realWebGL2Context: true,
    realVertexShaderCompile: true,
    realFragmentShaderCompile: true,
    realProgramLink: true,
    exactCanonicalGpuBuffersBound: true,
    allFourDrawRangesExecuted: true,
    realColorAttachmentOutput: true,
    realDepthAttachmentOutput: true,
    inspectableVisibleFixedFrame: true,
    screenshotArtifact: true,
    readbackReceipt: true,
    packageCameraMaterialAtmosphereDepthCorrespondence: true
  },
  rejectionConditions: [
    'CLEARED_CANVAS_ONLY',
    'SYNTHETIC_TRIANGLE_ONLY',
    'METADATA_ONLY_RECEIPT',
    'DRAW_CALL_COUNT_WITHOUT_INSPECTABLE_OUTPUT',
    'PACKET_ONLY_OR_CONTRACT_ONLY_PROOF'
  ],
  boundaries: {
    publicRouteMutation: false,
    directManipulationMutation: false,
    navigationAuthorityMutation: false,
    cameraAuthorityMutation: false,
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    persistentGpuResourceLifecycle: false,
    continuousRenderLoop: false,
    interactionBinding: false,
    publicRouteBinding: false,
    deployment: false,
    r3CWork: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3C_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'
});

export function evaluateHEarthRun8ER3BControl(candidate = H_EARTH_RUN_8E_R3B_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3B_CONTROL_ID) issues.push('R3B_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '9560bc1f88800e12408a99a10032e9daf1e56713') issues.push('R3B_BASE_HEAD_MISMATCH');
  if (candidate?.currentStatus !== 'EXECUTION_PENDING') issues.push('R3B_STATUS_INVALID');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (value !== true) issues.push(`R3B_REQUIRED_EXECUTION_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3B_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3C_NOT_STARTED') issues.push('R3C_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C') {
    issues.push('R3B_STOPPING_BOUNDARY_MISMATCH');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3B_CONTROL_EXECUTION_ELIGIBLE' : 'RUN_8E_R3B_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3B_CONTROL;
