import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D2Control } from './h-earth.run8e-r3d2.pointer-touch-intake.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3D3_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_WITHOUT_BITMAP_PREVIEW_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D3_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D3_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D3',
  checkpointName: 'LIVE_GPU_CAMERA_RESPONSE_WITHOUT_BITMAP_PREVIEW',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d3-live-gpu-camera-response-001',
  baseBranch: 'agent/h-earth-run8e-r3d2-pointer-touch-intake-001',
  baseExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
  currentStatus: 'EXECUTION_PENDING',
  requiredInputs: {
    r3D2PassClosed: true,
    r3D2FinalExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
    r3D2FinalArtifactDigest: 'sha256:514d5d71dd60eaf8dd6b53e7e781876efebc045f2f4cf381fe460634fb82350b',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  requiredExecution: {
    realWebGL2ContextCreated: true,
    persistentRendererInitializedOnce: true,
    canonicalPackageUploadedOnce: true,
    initialVisibleGpuFramePresented: true,
    acceptedNavigationProposalConvertedToR3AFramePacket: true,
    proposalStateRenderedSynchronously: true,
    gpuFramebufferBlittedToCanvas: true,
    distinctVisibleFramesEstablished: true,
    noPostInitializationResourceCreation: true,
    noPostInitializationBufferUpload: true,
    worldRebuildBecauseCameraMoved: false,
    noBitmapPreview: true,
    noCssCanvasTransformPreview: true
  },
  minimumEvidence: {
    acceptedProposalCount: 5,
    visibleGpuFrameCount: 6,
    distinctFrameHashCount: 3,
    drawRangesPerFrame: 4,
    cameraUniformUpdatesPerFrame: 2,
    gpuBufferUploadCount: 9,
    webGLContextCount: 1
  },
  boundaries: {
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    r3AFramePacketSourceMutation: false,
    persistentRendererSourceMutation: false,
    bitmapPreviewExecution: false,
    cssCanvasTransformPreview: false,
    publicRouteBinding: false,
    deployment: false,
    r3D4Work: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3D4_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4'
});

export function evaluateHEarthRun8ER3D3Control(candidate = H_EARTH_RUN_8E_R3D3_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const r3D2 = evaluateHEarthRun8ER3D2Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (r3D2.eligible !== true || r3D2.status !== 'RUN_8E_R3D2_PASS_CLOSED') issues.push('R3D2_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D3_CONTROL_ID) issues.push('R3D3_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== 'a58ed510eda8c21aac6fa6870271d945387f7cbd') issues.push('R3D3_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D3_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3D2PassClosed !== true) issues.push('R3D2_INPUT_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.persistentRendererGitBlob !== 'b8b3c713d5f0b7c79808e8942ce385887589d880') issues.push('R3C_RENDERER_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (key === 'worldRebuildBecauseCameraMoved') {
      if (value !== false) issues.push('R3D3_WORLD_REBUILD_BOUNDARY_INVALID');
    } else if (value !== true) issues.push(`R3D3_REQUIRED_EXECUTION_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.minimumEvidence ?? {})) {
    if (!Number.isSafeInteger(value) || value < 1) issues.push(`R3D3_MINIMUM_EVIDENCE_INVALID:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D3_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3D4_NOT_STARTED') issues.push('R3D4_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4') issues.push('R3D3_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D3_PASS_CLOSED' : 'RUN_8E_R3D3_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D3_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D3_CONTROL;
