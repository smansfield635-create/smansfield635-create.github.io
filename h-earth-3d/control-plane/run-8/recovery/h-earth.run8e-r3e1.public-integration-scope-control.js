import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { H_EARTH_RUN_8E_R3E1_SCOPE_DECLARATION_ID, evaluateHEarthRun8ER3E1ScopeDeclaration } from './h-earth.run8e-r3e1.public-integration-scope-declaration.js';

const freeze = (value) => Object.freeze(value);

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
  currentStatus: 'PASS_CLOSED',
  executionEvidence: freeze({
    successfulExecutionHead: '15a518a9ae99c1e9c7ac5620c593be106e2c1948',
    workflowRun: 30305137754,
    workflowJob: 90107416323,
    artifactId: 8668122923,
    artifactDigest: 'sha256:1891c2309d459cf40da5ce1917ce2ece4be60fd7d8560ef911ef6679ee0b8bb4',
    automaticRepositoryRegistryPreflightRun: 30305137669,
    exactFuturePublicMutationPathCount: 2,
    protectedFutureWitnessCount: 11,
    collisionFindingCount: 8,
    rollbackGroupCount: 2,
    currentPublicScriptOwnerCount: 3,
    publicSourceMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  }),
  boundaries: freeze({
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
  }),
  nextCheckpoint: 'RUN_8E_R3E2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'
});

export function evaluateHEarthRun8ER3E1Control(candidate = H_EARTH_RUN_8E_R3E1_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const declaration = evaluateHEarthRun8ER3E1ScopeDeclaration();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (declaration.eligible !== true || declaration.status !== 'RUN_8E_R3E1_SCOPE_PASS_CLOSED') issues.push('R3E1_DECLARATION_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E1_CONTROL_ID) issues.push('R3E1_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7') issues.push('R3E1_BASE_HEAD_MISMATCH');
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R3E1_NOT_PASS_CLOSED');
  const evidence = candidate?.executionEvidence ?? {};
  if (evidence.workflowRun !== 30305137754 || evidence.workflowJob !== 90107416323) issues.push('R3E1_WORKFLOW_IDENTITY_MISMATCH');
  if (evidence.artifactDigest !== 'sha256:1891c2309d459cf40da5ce1917ce2ece4be60fd7d8560ef911ef6679ee0b8bb4') issues.push('R3E1_ARTIFACT_DIGEST_MISMATCH');
  if (evidence.exactFuturePublicMutationPathCount !== 2 || evidence.protectedFutureWitnessCount !== 11 || evidence.collisionFindingCount !== 8 || evidence.rollbackGroupCount !== 2 || evidence.currentPublicScriptOwnerCount !== 3) issues.push('R3E1_EVIDENCE_COUNTS_INVALID');
  if (evidence.publicSourceMutationCount !== 0 || evidence.browserExecutionCount !== 0 || evidence.gpuExecutionCount !== 0) issues.push('R3E1_EXECUTION_BOUNDARY_COUNTER_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3E1_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E2_NOT_STARTED' || candidate?.stoppingBoundary !== 'STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2') issues.push('R3E1_BOUNDARY_STATE_INVALID');
  return freeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'RUN_8E_R3E1_PASS_CLOSED' : 'RUN_8E_R3E1_CONTROL_FAIL', issues });
}

export default H_EARTH_RUN_8E_R3E1_CONTROL;
