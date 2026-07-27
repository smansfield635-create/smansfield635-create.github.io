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
  currentStatus: 'PASS_CLOSED',
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
  executionEvidence: {
    successfulExecutionHead: 'a1fab0b653fd6004bc35a692cd786d568695e2b9',
    workflowRun: 30298763874,
    workflowJob: 90086226228,
    artifactId: 8665702890,
    artifactDigest: 'sha256:b752025984227dab39d2ffae59563df332b8ac030b1955bb71b6b07a5da5ef9c',
    automaticRepositoryRegistryPreflightRun: 30298763954,
    automaticRepositoryRegistryPreflight: 'PASS',
    acceptedProposalCount: 7,
    visibleGpuFrameCount: 8,
    distinctFrameHashCount: 8,
    initialFrameByteHash: 'fnv1a32:13de0f5d',
    finalFrameByteHash: 'fnv1a32:a1c7a48c',
    initialFramePngSha256: '8d9f21f75270912d6a048724577883938964572f1cfbf5657c13233d3e2bc0e2',
    finalFramePngSha256: 'dace064605f9c426252144bab6c077d552dbae710a06ff83d5df6c62771cba60',
    contextCreationCount: 1,
    gpuBufferCreateCount: 9,
    gpuBufferUploadCount: 9,
    gpuUploadBytes: 2145444,
    frameCount: 8,
    cameraUniformUpdateCount: 16,
    geometryDrawCallCount: 32,
    totalDrawnIndexCount: 1176960,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    worldRebuildCount: 0,
    bitmapPreviewApplicationCount: 0,
    cssTransformPreviewCount: 0,
    maximumSynchronousResponseMs: 187.29999999998836
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
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.executionEvidence?.workflowRun !== 30298763874) issues.push('R3D3_WORKFLOW_RUN_MISMATCH');
    if (candidate?.executionEvidence?.artifactDigest !== 'sha256:b752025984227dab39d2ffae59563df332b8ac030b1955bb71b6b07a5da5ef9c') issues.push('R3D3_ARTIFACT_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.acceptedProposalCount !== 7 || candidate?.executionEvidence?.visibleGpuFrameCount !== 8 || candidate?.executionEvidence?.distinctFrameHashCount !== 8) issues.push('R3D3_VISIBLE_FRAME_EVIDENCE_MISMATCH');
    if (candidate?.executionEvidence?.contextCreationCount !== 1 || candidate?.executionEvidence?.gpuBufferUploadCount !== 9) issues.push('R3D3_RESOURCE_INITIALIZATION_EVIDENCE_MISMATCH');
    if (candidate?.executionEvidence?.postInitializationResourceCreationCount !== 0 || candidate?.executionEvidence?.postInitializationBufferUploadCount !== 0 || candidate?.executionEvidence?.worldRebuildCount !== 0) issues.push('R3D3_PERSISTENCE_EVIDENCE_MISMATCH');
    if (candidate?.executionEvidence?.bitmapPreviewApplicationCount !== 0 || candidate?.executionEvidence?.cssTransformPreviewCount !== 0) issues.push('R3D3_BITMAP_BOUNDARY_EVIDENCE_MISMATCH');
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
