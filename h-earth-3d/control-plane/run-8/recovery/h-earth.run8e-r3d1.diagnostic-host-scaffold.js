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

export const H_EARTH_RUN_8E_R3D1_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_DIRECTORY_AND_HOST_SCAFFOLD_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D1_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D1_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D1',
  checkpointName: 'DIAGNOSTIC_DIRECTORY_AND_HOST_SCAFFOLD',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d1-diagnostic-host-scaffold-001',
  baseBranch: 'agent/h-earth-run8e-r3c-persistent-gpu-camera-loop-001',
  baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
  currentStatus: 'PASS_CLOSED',
  requiredInputs: {
    r3CPassClosed: true,
    r3CFinalExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationWitnessGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  executionEvidence: {
    successfulExecutionHead: '7cff5f1800c6e0743a44ac41ed501bf0c266dc61',
    workflowRun: 30294915207,
    workflowJob: 90073456239,
    artifactId: 8664228635,
    artifactDigest: 'sha256:c650f1f3c391079f7cfaf564ea447687cf7afdc798e515a9e3fdb9d9e25f23fc',
    automaticRepositoryRegistryPreflightRun: 30294915184,
    automaticRepositoryRegistryPreflight: 'PASS',
    diagnosticPathCount: 4,
    registeredPathCount: 11,
    staticHttpPathCount: 4,
    executionBoundaryViolationCount: 0
  },
  requiredResult: {
    diagnosticDirectoryCreated: true,
    diagnosticHtmlHostCreated: true,
    diagnosticHostModuleCreated: true,
    pointerTouchIntakePlaceholderCreated: true,
    liveGpuBindingPlaceholderCreated: true,
    relativeModulePathsResolve: true,
    staticHttpPathsResolve: true,
    noInteractionExecution: true,
    noRendererExecution: true
  },
  diagnosticPaths: [
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.placeholder.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.placeholder.js'
  ],
  boundaries: {
    pointerBinding: false,
    touchBinding: false,
    wheelBinding: false,
    gestureExecution: false,
    navigationProposalExecution: false,
    webGLContextCreation: false,
    persistentRendererInitialization: false,
    liveGpuCameraBinding: false,
    bitmapPreviewExecution: false,
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    persistentRendererMutation: false,
    deployment: false,
    r3D2Work: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3D2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2'
});

export function evaluateHEarthRun8ER3D1Control(candidate = H_EARTH_RUN_8E_R3D1_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D1_CONTROL_ID) issues.push('R3D1_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '5c7a7eef489da94a230812eecc5e531e285b7cac') issues.push('R3D1_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D1_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3CPassClosed !== true) issues.push('R3C_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.persistentRendererGitBlob !== 'b8b3c713d5f0b7c79808e8942ce385887589d880') issues.push('R3C_RENDERER_IDENTITY_MISMATCH');
  if (!Array.isArray(candidate?.diagnosticPaths) || candidate.diagnosticPaths.length !== 4) issues.push('R3D1_DIAGNOSTIC_PATH_SET_INVALID');
  for (const [key, value] of Object.entries(candidate?.requiredResult ?? {})) {
    if (value !== true) issues.push(`R3D1_REQUIRED_RESULT_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D1_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.executionEvidence?.workflowRun !== 30294915207) issues.push('R3D1_WORKFLOW_RUN_MISMATCH');
    if (candidate?.executionEvidence?.artifactDigest !== 'sha256:c650f1f3c391079f7cfaf564ea447687cf7afdc798e515a9e3fdb9d9e25f23fc') issues.push('R3D1_ARTIFACT_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.diagnosticPathCount !== 4 || candidate?.executionEvidence?.registeredPathCount !== 11) issues.push('R3D1_PATH_COUNT_MISMATCH');
    if (candidate?.executionEvidence?.executionBoundaryViolationCount !== 0) issues.push('R3D1_EXECUTION_BOUNDARY_VIOLATION');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3D2_NOT_STARTED') issues.push('R3D2_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2') issues.push('R3D1_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D1_PASS_CLOSED' : 'RUN_8E_R3D1_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D1_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D1_CONTROL;
