import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { H_EARTH_RUN_8E_R3E4_CONTROL } from './h-earth.run8e-r3e4.public-direct-manipulation-acceptance.js';
import { evaluateHEarthRun8ER3FInputDecision } from './h-earth.run8e-r3f.input-decision.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3E5_CONTROL_ID =
  'H_EARTH_RUN_8E_R3E5_R3E_CLOSURE_AND_R3F_INPUT_DECISION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3E5_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3E5_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3E5',
  checkpointName: 'R3E_CLOSURE_AND_R3F_INPUT_DECISION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3e5-r3e-closure-r3f-input-decision-001',
  baseBranch: 'agent/h-earth-run8e-r3e4-public-direct-manipulation-acceptance-001',
  baseExactHead: '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3',
  currentStatus: 'EXECUTION_PENDING',
  predecessorReceipts: freeze({
    r3E1: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e1.pass-closed.receipt.json', gitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5', status: 'RUN_8E_R3E1_PASS_CLOSED' }),
    r3E2: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e2.pass-closed.receipt.json', gitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5', status: 'RUN_8E_R3E2_PASS_CLOSED' }),
    r3E3: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e3.pass-closed.receipt.json', gitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918', status: 'RUN_8E_R3E3_PASS_CLOSED' }),
    r3E4: freeze({ path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.pass-closed.receipt.json', gitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d', status: 'RUN_8E_R3E4_PASS_CLOSED' })
  }),
  executionEvidence: freeze({
    successfulExecutionHead: null,
    workflowRun: null,
    workflowJob: null,
    artifactId: null,
    artifactDigest: null,
    automaticRepositoryRegistryPreflightRun: null,
    predecessorReceiptCount: 4,
    predecessorPassClosedCount: 4,
    unresolvedPredecessorCount: 0,
    r3ESubcheckpointCount: 5,
    admittedR3FInputCount: 11,
    r3EResultingStatus: 'PASS_CLOSED',
    r3ResultingState: 'OPEN_AT_R3F_BOUNDARY',
    r3FResultingStatus: 'NOT_STARTED',
    run8EResultingStatus: 'FAIL_OPEN',
    showroomMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0,
    physicalDeviceExecutionCount: 0
  }),
  requiredClosure: freeze({
    allFiveR3ESubcheckpointsAccountedFor: true,
    r3E1PassClosed: true,
    r3E2PassClosed: true,
    r3E3PassClosed: true,
    r3E4PassClosed: true,
    r3E5ClosureValidationExecuted: true,
    noUnresolvedR3ESubcheckpoint: true,
    publicRouteIntegrationProgramPassClosed: true,
    publicRuntimeAuthorityExclusivityPreserved: true,
    fullPublicDirectManipulationAcceptanceEstablished: true,
    sustainedPublicInteractionAcceptanceEstablished: true,
    r3FInputDecisionIssued: true,
    r3FExecutionStillNotStarted: true,
    run8ERemainsFailOpen: true
  }),
  requiredR3FInputDisposition: freeze({
    disposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
    nextCheckpoint: 'RUN_8E_R3F',
    requiredBase: 'R3E5_FINAL_EXACT_HEAD',
    separateBranchRequired: true,
    r3FExecutionInsideR3E5: false
  }),
  boundaries: freeze({
    showroomSourceMutation: false,
    publicRouteMutation: false,
    publicRuntimeMutation: false,
    browserExecution: false,
    gpuExecution: false,
    physicalReferenceDeviceExecution: false,
    broaderMobileAcceptanceExecution: false,
    deployment: false,
    promotion: false,
    r3FWork: false,
    r3GWork: false,
    mainMerge: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3F_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F'
});

export function evaluateHEarthRun8ER3E5Control(candidate = H_EARTH_RUN_8E_R3E5_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const decision = evaluateHEarthRun8ER3FInputDecision();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (decision.eligible !== true) issues.push(...decision.issues.map((issue) => `R3F_INPUT:${issue}`));
  if (H_EARTH_RUN_8E_R3E4_CONTROL.currentStatus !== 'PASS_CLOSED') issues.push('R3E4_CONTROL_NOT_PASS_CLOSED');
  if (H_EARTH_RUN_8E_R3E4_CONTROL.coreExecutionEvidence?.publicSustainedInteraction !== 'PASS') issues.push('R3E4_SUSTAINED_ACCEPTANCE_NOT_PASS');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3E5_CONTROL_ID) issues.push('R3E5_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3') issues.push('R3E5_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3E5_STATUS_INVALID');
  const expectedReceipts = {
    r3E1: ['2c71944eabc6d4522d934ef2fc4af6a85a38f3b5','RUN_8E_R3E1_PASS_CLOSED'],
    r3E2: ['e33405c5e7f600e59a6b1103fd856a1d37ca51c5','RUN_8E_R3E2_PASS_CLOSED'],
    r3E3: ['5c5f1ae06220f88f497dc2b45f4d749679849918','RUN_8E_R3E3_PASS_CLOSED'],
    r3E4: ['7b2db7ed51a345edea88ad8a1288db4db150201d','RUN_8E_R3E4_PASS_CLOSED']
  };
  for (const [key, [gitBlob, status]] of Object.entries(expectedReceipts)) {
    if (candidate?.predecessorReceipts?.[key]?.gitBlob !== gitBlob) issues.push(`R3E5_RECEIPT_BLOB_MISMATCH:${key}`);
    if (candidate?.predecessorReceipts?.[key]?.status !== status) issues.push(`R3E5_RECEIPT_STATUS_MISMATCH:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.requiredClosure ?? {})) if (value !== true) issues.push(`R3E5_REQUIRED_CLOSURE_MISSING:${key}`);
  if (candidate?.requiredR3FInputDisposition?.disposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3F_INPUT_DISPOSITION_INVALID');
  if (candidate?.requiredR3FInputDisposition?.requiredBase !== 'R3E5_FINAL_EXACT_HEAD' || candidate?.requiredR3FInputDisposition?.separateBranchRequired !== true || candidate?.requiredR3FInputDisposition?.r3FExecutionInsideR3E5 !== false) issues.push('R3F_INPUT_BOUNDARY_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3E5_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    const evidence = candidate?.executionEvidence ?? {};
    if (!Number.isSafeInteger(evidence.workflowRun) || !Number.isSafeInteger(evidence.workflowJob) || !Number.isSafeInteger(evidence.artifactId)) issues.push('R3E5_CORE_WORKFLOW_IDENTITY_MISSING');
    if (typeof evidence.artifactDigest !== 'string' || !evidence.artifactDigest.startsWith('sha256:')) issues.push('R3E5_CORE_ARTIFACT_DIGEST_MISSING');
    if (evidence.predecessorReceiptCount !== 4 || evidence.predecessorPassClosedCount !== 4 || evidence.unresolvedPredecessorCount !== 0) issues.push('R3E5_PREDECESSOR_EVIDENCE_MISMATCH');
    if (evidence.r3ESubcheckpointCount !== 5 || evidence.admittedR3FInputCount !== 11) issues.push('R3E5_CLOSURE_COUNT_MISMATCH');
    if (evidence.r3EResultingStatus !== 'PASS_CLOSED' || evidence.r3ResultingState !== 'OPEN_AT_R3F_BOUNDARY' || evidence.r3FResultingStatus !== 'NOT_STARTED' || evidence.run8EResultingStatus !== 'FAIL_OPEN') issues.push('R3E5_RESULTING_STATE_MISMATCH');
    if (evidence.showroomMutationCount !== 0 || evidence.browserExecutionCount !== 0 || evidence.gpuExecutionCount !== 0 || evidence.physicalDeviceExecutionCount !== 0) issues.push('R3E5_NON_EXECUTION_COUNTER_MISMATCH');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F_NOT_STARTED') issues.push('R3F_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F') issues.push('R3E5_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3E5_PASS_CLOSED' : 'RUN_8E_R3E5_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3E5_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3E5_CONTROL;
