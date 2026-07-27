import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D1Control } from './h-earth.run8e-r3d1.diagnostic-host-scaffold.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3D2_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D2_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D2_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D2',
  checkpointName: 'POINTER_AND_TOUCH_NAVIGATION_PROPOSAL_INTAKE',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d2-pointer-touch-intake-001',
  baseBranch: 'agent/h-earth-run8e-r3d1-diagnostic-host-scaffold-001',
  baseExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d',
  currentStatus: 'PASS_CLOSED',
  requiredInputs: {
    r3D1PassClosed: true,
    r3D1FinalExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d',
    r3D1FinalArtifactDigest: 'sha256:a191a96249b757ea40cae66ad8c171ed1d996b24ad43865f83b9f7a055f77351',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationWitnessGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    liveGpuBindingPlaceholderGitBlob: '14705aed628c58bb3eb93d97e773f1fdc394dc44'
  },
  executionEvidence: {
    successfulExecutionHead: '5436cec48f46e9c5417af877af8d6927a6f8ef52',
    workflowRun: 30296987991,
    workflowJob: 90080344166,
    artifactId: 8665023404,
    artifactDigest: 'sha256:a679e9bdc06ec95ba00a656572da44da8848fb2133d0c2c8c50faba68f385a29',
    automaticRepositoryRegistryPreflightRun: 30296988090,
    automaticRepositoryRegistryPreflight: 'PASS',
    proposalCount: 7,
    acceptedProposalCount: 7,
    rejectedProposalCount: 0,
    touchPointerEventCount: 15,
    oneFingerLookProposalCount: 1,
    twoFingerTravelProposalCount: 2,
    pinchProposalCount: 2,
    wheelProposalCount: 2,
    maximumActivePointerCount: 2,
    getContextCallCount: 0,
    deferredCommitCount: 0,
    queuedNavigationChainCount: 0,
    screenshotSha256: '87a314939f99b0cc14a5ba354f650436a2d81fd95b1ac90e15b0bcb44a85f3db'
  },
  requiredExecution: {
    diagnosticPointerListenersInstalled: true,
    touchPointerEventsAccepted: true,
    oneFingerLookProducesNavigationProposal: true,
    twoFingerTravelProducesNavigationProposal: true,
    pinchProducesNavigationProposal: true,
    wheelProducesNavigationProposal: true,
    existingNavigationProposalAuthorityConsumed: true,
    navigationStateEvaluationExecuted: true,
    immediateProposalIntakeWithoutDeferredCommit: true,
    noInputBacklogMechanismCreated: true
  },
  minimumEvidence: {
    totalNavigationProposals: 5,
    touchPointerEventCount: 8,
    oneFingerLookProposalCount: 1,
    twoFingerTravelProposalCount: 1,
    pinchProposalCount: 1,
    wheelProposalCount: 2
  },
  boundaries: {
    webGLContextCreation: false,
    persistentRendererInitialization: false,
    liveGpuCameraBinding: false,
    gpuDrawExecution: false,
    bitmapPreviewExecution: false,
    canvasTransformPreview: false,
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    persistentRendererMutation: false,
    deployment: false,
    r3D3Work: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3D3_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3'
});

export function evaluateHEarthRun8ER3D2Control(candidate = H_EARTH_RUN_8E_R3D2_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const r3D1 = evaluateHEarthRun8ER3D1Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (r3D1.eligible !== true || r3D1.status !== 'RUN_8E_R3D1_PASS_CLOSED') issues.push('R3D1_CONTROL_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D2_CONTROL_ID) issues.push('R3D2_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== 'ccac32e8a273fcd47bae684630f49970304c218d') issues.push('R3D2_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D2_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3D1PassClosed !== true) issues.push('R3D1_INPUT_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.navigationSourceGitBlob !== '8ab3446c536fc24423d5601acce232b19fa71c91') issues.push('NAVIGATION_SOURCE_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (value !== true) issues.push(`R3D2_REQUIRED_EXECUTION_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.minimumEvidence ?? {})) {
    if (!Number.isSafeInteger(value) || value < 1) issues.push(`R3D2_MINIMUM_EVIDENCE_INVALID:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D2_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.executionEvidence?.workflowRun !== 30296987991) issues.push('R3D2_WORKFLOW_RUN_MISMATCH');
    if (candidate?.executionEvidence?.artifactDigest !== 'sha256:a679e9bdc06ec95ba00a656572da44da8848fb2133d0c2c8c50faba68f385a29') issues.push('R3D2_ARTIFACT_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.proposalCount !== 7 || candidate?.executionEvidence?.acceptedProposalCount !== 7 || candidate?.executionEvidence?.rejectedProposalCount !== 0) issues.push('R3D2_PROPOSAL_EVIDENCE_MISMATCH');
    if (candidate?.executionEvidence?.getContextCallCount !== 0 || candidate?.executionEvidence?.deferredCommitCount !== 0 || candidate?.executionEvidence?.queuedNavigationChainCount !== 0) issues.push('R3D2_BOUNDARY_COUNTER_MISMATCH');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3D3_NOT_STARTED') issues.push('R3D3_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3') issues.push('R3D2_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D2_PASS_CLOSED' : 'RUN_8E_R3D2_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D2_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D2_CONTROL;
