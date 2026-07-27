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

export const H_EARTH_RUN_8E_R3D_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D',
  checkpointName: 'DIAGNOSTIC_DIRECT_INTERACTION_WITHOUT_BITMAP_PREVIEW',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d-direct-interaction-no-bitmap-001',
  baseBranch: 'agent/h-earth-run8e-r3c-persistent-gpu-camera-loop-001',
  baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
  currentStatus: 'EXECUTION_PENDING',
  requiredInputs: {
    r3CPassClosed: true,
    r3CFinalExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    r3CFinalArtifactDigest: 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2',
    r3CPassReceiptGitBlob: '49229ca98a64a55277b74c20b9651ab23bbdcd59',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3ALiveRendererContractGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    publicDirectManipulationWitnessGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    publicRouteWitnessGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca'
  },
  requiredExecution: {
    realBrowserPointerEvents: true,
    touchPointerEvents: true,
    oneFingerLook: true,
    twoFingerTravel: true,
    pinchZoom: true,
    wheelFallback: true,
    navigationProposalConsumed: true,
    gpuFrameRenderedFromAcceptedProposal: true,
    samePersistentRendererRetained: true,
    noBitmapPreviewTransform: true,
    noCpuRasterRefresh: true,
    noPostInitializationBufferUpload: true,
    noPostInitializationResourceCreation: true,
    visibleFramesChangeAcrossGestures: true,
    inputToFrameLatencyMeasured: true,
    minimumDistinctVisibleFrames: 5
  },
  rejectionConditions: [
    'CSS_TRANSFORM_BITMAP_PREVIEW',
    'DEFERRED_CPU_RASTER_COMMIT',
    'DRAW_IMAGE_PREVIEW',
    'SYNTHETIC_NAVIGATION_WITHOUT_BROWSER_EVENTS',
    'CAMERA_STATE_CHANGE_WITHOUT_VISIBLE_GPU_FRAME',
    'GPU_RESOURCE_RECREATION_DURING_GESTURE'
  ],
  boundaries: {
    publicRouteMutation: false,
    publicRouteBinding: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    cameraAuthorityMutation: false,
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    deployment: false,
    r3EWork: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
});

export function evaluateHEarthRun8ER3DControl(candidate = H_EARTH_RUN_8E_R3D_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D_CONTROL_ID) issues.push('R3D_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '5c7a7eef489da94a230812eecc5e531e285b7cac') issues.push('R3D_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3CPassClosed !== true) issues.push('R3C_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.persistentRendererGitBlob !== 'b8b3c713d5f0b7c79808e8942ce385887589d880') issues.push('R3C_RENDERER_IDENTITY_MISMATCH');
  if (candidate?.requiredInputs?.publicDirectManipulationWitnessGitBlob !== '322ee2bfed5184acd8eac600f19abd72380b6c2b') issues.push('PUBLIC_DIRECT_MANIPULATION_WITNESS_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (key === 'minimumDistinctVisibleFrames') {
      if (!Number.isSafeInteger(value) || value < 5) issues.push('R3D_MINIMUM_DISTINCT_FRAME_COUNT_INVALID');
    } else if (value !== true) {
      issues.push(`R3D_REQUIRED_EXECUTION_MISSING:${key}`);
    }
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E_NOT_STARTED') issues.push('R3E_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E') issues.push('R3D_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D_PASS_CLOSED' : 'RUN_8E_R3D_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D_CONTROL;
