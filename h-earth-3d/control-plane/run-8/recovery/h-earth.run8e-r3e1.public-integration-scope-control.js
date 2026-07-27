import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import {
  H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID,
  evaluateHEarthRun8ER3E1ScopeDeclaration
} from './h-earth.run8e-r3e1.public-integration-scope-declaration.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3E1_CONTROL_ID =
  'H_EARTH_RUN_8E_R3E1_EXACT_PUBLIC_INTEGRATION_MUTATION_SCOPE_CONTROL_v1';

export const H_EARTH_RUN_8E_R3E1_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3E1_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  declarationId: H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID,
  checkpointId: 'RUN_8E_R3E1',
  checkpointName: 'EXACT_PUBLIC_INTEGRATION_MUTATION_SCOPE',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e1-public-integration-scope-001',
  baseBranch: 'agent/h-earth-run8e-r3d5-r3d-closure-r3e-input-decision-001',
  baseExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
  currentStatus: 'EXECUTION_PENDING',
  requiredInputs: {
    r3DPassClosed: true,
    r3D5PassClosed: true,
    r3D5FinalExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
    r3D5FinalArtifactDigest: 'sha256:d62581b68b94e5104895f5d35688a9a68b0189108d2e8100cf4e81369a47ef94',
    r3D5PassReceiptGitBlob: 'f9f6d9b1464882f7e8cf7143a4d4e90d4093dcec',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicCpuRouteControllerGitBlob: '83e85df2f4440c2825672f46fb16e28c73992db2',
    publicCpuEnvironmentIntegrationGitBlob: '6c047d61544fcbc4fad8673abfbacb7c827fdb22',
    publicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  requiredResult: {
    exactFuturePublicMutationPathCount: 2,
    protectedFutureWitnessCount: 11,
    collisionFindingCount: 8,
    rollbackGroupCount: 2,
    currentPublicScriptOwnerCount: 3,
    futurePublicOrchestratorCount: 1,
    publicSourceMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  },
  boundaries: {
    showroomSourceMutation: false,
    publicRouteMutation: false,
    publicRouteBinding: false,
    publicDirectManipulationMutation: false,
    admittedAuthorityMutation: false,
    browserExecution: false,
    gpuExecution: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3E2Work: false,
    mainMerge: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'
});

export function evaluateHEarthRun8ER3E1Control(candidate = H_EARTH_RUN_8E_R3E1_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const declaration = evaluateHEarthRun8ER3E1ScopeDeclaration();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (declaration.eligible !== true) issues.push(...declaration.issues.map((issue) => `DECLARATION:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E1_CONTROL_ID) issues.push('R3E1_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7') issues.push('R3E1_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3E1_STATUS_INVALID');
  if (candidate?.requiredInputs?.r3DPassClosed !== true || candidate?.requiredInputs?.r3D5PassClosed !== true) issues.push('R3D_INPUT_NOT_PASS_CLOSED');
  if (candidate?.requiredInputs?.r3D5PassReceiptGitBlob !== 'f9f6d9b1464882f7e8cf7143a4d4e90d4093dcec') issues.push('R3D5_RECEIPT_IDENTITY_MISMATCH');
  const expectedResult = {
    exactFuturePublicMutationPathCount: 2,
    protectedFutureWitnessCount: 11,
    collisionFindingCount: 8,
    rollbackGroupCount: 2,
    currentPublicScriptOwnerCount: 3,
    futurePublicOrchestratorCount: 1,
    publicSourceMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  };
  for (const [key, value] of Object.entries(expectedResult)) {
    if (candidate?.requiredResult?.[key] !== value) issues.push(`R3E1_RESULT_REQUIREMENT_MISMATCH:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3E1_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E2_NOT_STARTED') issues.push('R3E2_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2') issues.push('R3E1_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E1_PASS_CLOSED' : 'RUN_8E_R3E1_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3E1_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E1_CONTROL;
