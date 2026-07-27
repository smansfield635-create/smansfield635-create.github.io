import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D4Control } from './h-earth.run8e-r3d4.interaction-browser-execution.js';
import { evaluateHEarthRun8ER3EInputDecision } from './h-earth.run8e-r3e.input-decision.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3D5_CONTROL_ID =
  'H_EARTH_RUN_8E_R3D5_R3D_CLOSURE_AND_R3E_INPUT_DECISION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3D5_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3D5_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3D5',
  checkpointName: 'R3D_CLOSURE_AND_R3E_INPUT_DECISION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3d5-r3d-closure-r3e-input-decision-001',
  baseBranch: 'agent/h-earth-run8e-r3d4-interaction-browser-execution-001',
  baseExactHead: '641c25f76d44f95709693a1cc0aec7ecbb53ae2e',
  currentStatus: 'EXECUTION_PENDING',
  predecessorReceipts: {
    r3D1: {
      path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d1.pass-closed.receipt.json',
      gitBlob: '0ea8f618f597aef527655f28951d9cf4e9629485',
      status: 'RUN_8E_R3D1_PASS_CLOSED'
    },
    r3D2: {
      path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d2.pass-closed.receipt.json',
      gitBlob: '69748b18b155e87930b52104f3e3c16385e3150f',
      status: 'RUN_8E_R3D2_PASS_CLOSED'
    },
    r3D3: {
      path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d3.pass-closed.receipt.json',
      gitBlob: 'c744db650a1f0ba3bec208312b82cd469ce5dc0b',
      status: 'RUN_8E_R3D3_PASS_CLOSED'
    },
    r3D4: {
      path: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.pass-closed.receipt.json',
      gitBlob: '8f8a7d91354911d318edf850e87ab6ea890077a9',
      status: 'RUN_8E_R3D4_PASS_CLOSED'
    }
  },
  requiredClosure: {
    allFiveR3DSubcheckpointsAccountedFor: true,
    r3D1PassClosed: true,
    r3D2PassClosed: true,
    r3D3PassClosed: true,
    r3D4PassClosed: true,
    r3D5ClosureValidationExecuted: true,
    noUnresolvedR3DSubcheckpoint: true,
    diagnosticInteractionProgramPassClosed: true,
    r3EInputDecisionIssued: true,
    r3EImplementationStillNotStarted: true,
    run8ERemainsFailOpen: true
  },
  requiredR3EInputDisposition: {
    disposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
    nextCheckpoint: 'RUN_8E_R3E',
    requiredBase: 'R3D5_FINAL_EXACT_HEAD',
    implementationBranchRequired: true,
    publicRouteIntegrationInsideR3D5: false
  },
  boundaries: {
    showroomSourceMutation: false,
    publicRouteMutation: false,
    publicDirectManipulationMutation: false,
    navigationAuthorityMutation: false,
    rendererSourceMutation: false,
    interactionSourceMutation: false,
    browserExecution: false,
    gpuExecution: false,
    deployment: false,
    physicalDeviceAcceptance: false,
    r3EImplementation: false,
    r3FWork: false,
    r3GWork: false,
    mainMerge: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3E_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'
});

export function evaluateHEarthRun8ER3D5Control(candidate = H_EARTH_RUN_8E_R3D5_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const r3D4 = evaluateHEarthRun8ER3D4Control();
  const decision = evaluateHEarthRun8ER3EInputDecision();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (r3D4.eligible !== true || r3D4.status !== 'RUN_8E_R3D4_PASS_CLOSED') issues.push('R3D4_CONTROL_NOT_PASS_CLOSED');
  if (decision.eligible !== true) issues.push(...decision.issues.map((issue) => `R3E_INPUT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3D5_CONTROL_ID) issues.push('R3D5_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '641c25f76d44f95709693a1cc0aec7ecbb53ae2e') issues.push('R3D5_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3D5_STATUS_INVALID');
  const receipts = candidate?.predecessorReceipts ?? {};
  const expectedReceipts = {
    r3D1: ['0ea8f618f597aef527655f28951d9cf4e9629485', 'RUN_8E_R3D1_PASS_CLOSED'],
    r3D2: ['69748b18b155e87930b52104f3e3c16385e3150f', 'RUN_8E_R3D2_PASS_CLOSED'],
    r3D3: ['c744db650a1f0ba3bec208312b82cd469ce5dc0b', 'RUN_8E_R3D3_PASS_CLOSED'],
    r3D4: ['8f8a7d91354911d318edf850e87ab6ea890077a9', 'RUN_8E_R3D4_PASS_CLOSED']
  };
  for (const [key, [gitBlob, status]] of Object.entries(expectedReceipts)) {
    if (receipts?.[key]?.gitBlob !== gitBlob) issues.push(`R3D5_RECEIPT_BLOB_MISMATCH:${key}`);
    if (receipts?.[key]?.status !== status) issues.push(`R3D5_RECEIPT_STATUS_MISMATCH:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.requiredClosure ?? {})) {
    if (value !== true) issues.push(`R3D5_REQUIRED_CLOSURE_MISSING:${key}`);
  }
  if (candidate?.requiredR3EInputDisposition?.disposition !== 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT') issues.push('R3E_INPUT_DISPOSITION_INVALID');
  if (candidate?.requiredR3EInputDisposition?.requiredBase !== 'R3D5_FINAL_EXACT_HEAD') issues.push('R3E_REQUIRED_BASE_INVALID');
  if (candidate?.requiredR3EInputDisposition?.implementationBranchRequired !== true) issues.push('R3E_SEPARATE_BRANCH_REQUIREMENT_MISSING');
  if (candidate?.requiredR3EInputDisposition?.publicRouteIntegrationInsideR3D5 !== false) issues.push('R3D5_PUBLIC_ROUTE_INTEGRATION_AUTHORIZED');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3D5_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3E_NOT_STARTED') issues.push('R3E_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E') issues.push('R3D5_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3D5_PASS_CLOSED' : 'RUN_8E_R3D5_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3D5_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3D5_CONTROL;
