import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D3Control } from './h-earth.run8e-r3d3.live-gpu-camera-response.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3D4_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D4_DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D4_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D4_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D4',
  checkpointName: 'DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d4-interaction-browser-execution-001',
  baseBranch: 'agent/h-earth-run8e-r3d3-live-gpu-camera-response-001',
  baseExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
  currentStatus: 'EXECUTION_PENDING',
  requiredInputs: {
    r3D3PassClosed: true,
    r3D3FinalExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
    r3D3FinalArtifactDigest: 'sha256:5fc53a506c386af468b4ebc3012a38970ae465bfd94a42825b07233d1acc3f5f',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  requiredExecution: {
    portraitMobileBrowserSession: true,
    landscapeMobileBrowserSession: true,
    scheduledSustainedInputStream: true,
    oneFingerLookRepeated: true,
    twoFingerForwardBackRepeated: true,
    pinchZoomRepeated: true,
    wheelDiagnosticEquivalentRepeated: true,
    acceptedProposalToVisibleFrameCorrespondence: true,
    visibleFrameHashProgression: true,
    noMultiSecondInputBacklog: true,
    noConcurrentInteractionCallbacks: true,
    noDeferredRenderCommit: true,
    noQueuedFrameChain: true,
    persistentGpuResourcesAcrossSessions: true,
    noBitmapOrCssTransformPreview: true
  },
  minimumEvidence: {
    browserSessionCount: 2,
    scheduledInteractionGroupCountPerSession: 24,
    acceptedProposalCountPerSession: 24,
    distinctVisibleFrameHashCountPerSession: 8,
    interactionClassesPerSession: 4,
    maximumDeliveryLagThresholdMs: 2000,
    maximumCompletionLagThresholdMs: 2000,
    maximumActionProcessingThresholdMs: 1000,
    maximumConcurrentCallbacks: 1,
    webGLContextCountPerSession: 1,
    gpuBufferUploadCountPerSession: 9
  },
  boundaries: {
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    r3AFramePacketSourceMutation: false,
    persistentRendererSourceMutation: false,
    pointerTouchIntakeSourceMutation: false,
    liveGpuBindingSourceMutation: false,
    bitmapPreviewExecution: false,
    cssCanvasTransformPreview: false,
    domImagePresentation: false,
    publicRouteBinding: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3D5Work: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3D5_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5'
});

export function evaluateHEarthRun8ER3D4Control(candidate = H_EARTH_RUN_8E_R3D4_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const r3D3 = evaluateHEarthRun8ER3D3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (r3D3.eligible !== true || r3D3.status !== 'RUN_8E_R3D3_PASS_CLOSED') issues.push('R3D3_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D4_CONTROL_ID) issues.push('R3D4_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '45dbf26ca8495ba03657ff0aeba52225359d23e5') issues.push('R3D4_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D4_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3D3PassClosed !== true) issues.push('R3D3_INPUT_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.liveGpuBindingGitBlob !== '5017bbaf857a644287cb829037b0fde4646f270d') issues.push('R3D3_LIVE_GPU_BINDING_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (value !== true) issues.push(`R3D4_REQUIRED_EXECUTION_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.minimumEvidence ?? {})) {
    if (!Number.isSafeInteger(value) || value < 1) issues.push(`R3D4_MINIMUM_EVIDENCE_INVALID:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D4_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3D5_NOT_STARTED') issues.push('R3D5_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5') issues.push('R3D4_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D4_PASS_CLOSED' : 'RUN_8E_R3D4_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D4_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D4_CONTROL;
