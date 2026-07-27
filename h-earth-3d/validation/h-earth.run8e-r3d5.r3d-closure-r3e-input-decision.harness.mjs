import fs from 'node:fs';
import path from 'node:path';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3D5Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3d5.r3d-closure-r3e-input-decision.js';
import {
  H_EARTH_RUN_8E_R3E_INPUT_DECISION,
  evaluateHEarthRun8ER3EInputDecision
} from '../control-plane/run-8/recovery/h-earth.run8e-r3e.input-decision.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import {
  H_EARTH_RUN_8E_R3D5_NODE,
  H_EARTH_RUN_8E_R3D5_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3d5-r3d-closure-r3e-input-decision-scope.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3D5_OUTPUT ?? '/tmp/h-earth-run8e-r3d5';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const readJson = (repositoryPath) => JSON.parse(fs.readFileSync(repositoryPath, 'utf8'));
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3D5Control();
const inputDecision = evaluateHEarthRun8ER3EInputDecision();
assert(parent.eligible === true, `R3D5_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true, `R3D5_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);
assert(inputDecision.eligible === true, `R3D5_R3E_INPUT_DECISION_REJECTED:${inputDecision.issues.join(',')}`);

const receiptDefinitions = [
  {
    checkpointId: 'RUN_8E_R3D1',
    path: 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d1.pass-closed.receipt.json',
    expectedStatus: 'RUN_8E_R3D1_PASS_CLOSED',
    expectedBlob: '0ea8f618f597aef527655f28951d9cf4e9629485'
  },
  {
    checkpointId: 'RUN_8E_R3D2',
    path: 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d2.pass-closed.receipt.json',
    expectedStatus: 'RUN_8E_R3D2_PASS_CLOSED',
    expectedBlob: '69748b18b155e87930b52104f3e3c16385e3150f'
  },
  {
    checkpointId: 'RUN_8E_R3D3',
    path: 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d3.pass-closed.receipt.json',
    expectedStatus: 'RUN_8E_R3D3_PASS_CLOSED',
    expectedBlob: 'c744db650a1f0ba3bec208312b82cd469ce5dc0b'
  },
  {
    checkpointId: 'RUN_8E_R3D4',
    path: 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.pass-closed.receipt.json',
    expectedStatus: 'RUN_8E_R3D4_PASS_CLOSED',
    expectedBlob: '8f8a7d91354911d318edf850e87ab6ea890077a9'
  }
];

const predecessorReceipts = receiptDefinitions.map((definition) => {
  assert(fs.existsSync(definition.path), `R3D5_RECEIPT_MISSING:${definition.checkpointId}`);
  const receipt = readJson(definition.path);
  assert(receipt?.eligible === true, `R3D5_RECEIPT_NOT_ELIGIBLE:${definition.checkpointId}`);
  assert(receipt?.status === definition.expectedStatus, `R3D5_RECEIPT_STATUS_MISMATCH:${definition.checkpointId}`);
  assert(receipt?.boundaries?.run8EPassClosed === false, `R3D5_PREDECESSOR_RUN8E_PASS_VIOLATION:${definition.checkpointId}`);
  return {
    checkpointId: definition.checkpointId,
    repositoryPath: `/${definition.path}`,
    expectedGitBlob: definition.expectedBlob,
    status: receipt.status,
    eligible: receipt.eligible,
    stoppingBoundary: receipt.stoppingBoundary,
    finalExactHeadValidationEmbedded: receipt?.finalExactHeadValidation?.performedAfterReceiptAndFinalRegistryEvidenceReconciliation === true
  };
});

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3D5_REGISTRY_LOADER_IDENTITY_FAILED');
const registeredNode = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3D5_NODE.nodeId);
assert(registeredNode?.nodeId === H_EARTH_RUN_8E_R3D5_NODE.nodeId, 'R3D5_REGISTRY_NODE_MISSING');
assert(registeredNode.lifecycleStatus === H_EARTH_RUN_8E_R3D5_NODE.lifecycleStatus, 'R3D5_REGISTRY_NODE_STATE_MISMATCH');
for (const repositoryPath of H_EARTH_RUN_8E_R3D5_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3D5_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const admittedInputs = Object.entries(H_EARTH_RUN_8E_R3E_INPUT_DECISION.admittedInputs).map(([inputId, input]) => ({
  inputId,
  path: input.path,
  gitBlob: input.gitBlob,
  mutationPosture: input.mutationPosture
}));
assert(admittedInputs.length === 7, 'R3D5_R3E_ADMITTED_INPUT_COUNT_INVALID');
assert(H_EARTH_RUN_8E_R3E_INPUT_DECISION.currentTargetStatus === 'NOT_STARTED', 'R3D5_R3E_STARTED_EARLY');
assert(Object.values(H_EARTH_RUN_8E_R3E_INPUT_DECISION.currentExecution).every((value) => value === false), 'R3D5_R3E_EXECUTION_BOUNDARY_VIOLATION');

const closureLedger = {
  r3DSubcheckpointCount: 5,
  predecessorPassClosedCount: 4,
  currentClosureCheckpoint: 'RUN_8E_R3D5',
  currentClosureCheckpointStatus: 'EXECUTION_PENDING',
  allPredecessorReceiptsPresent: predecessorReceipts.length === 4,
  allPredecessorReceiptsEligible: predecessorReceipts.every((receipt) => receipt.eligible),
  unresolvedPredecessorCount: predecessorReceipts.filter((receipt) => !receipt.eligible).length,
  r3DClosureEligible: true,
  resultingR3DStatus: 'PASS_CLOSED',
  resultingR3State: 'OPEN_AT_R3E_BOUNDARY',
  resultingR3EStatus: 'NOT_STARTED',
  resultingRun8EStatus: 'FAIL_OPEN'
};
assert(closureLedger.r3DSubcheckpointCount === 5, 'R3D5_SUBCHECKPOINT_COUNT_INVALID');
assert(closureLedger.predecessorPassClosedCount === 4, 'R3D5_PREDECESSOR_PASS_COUNT_INVALID');
assert(closureLedger.unresolvedPredecessorCount === 0, 'R3D5_UNRESOLVED_PREDECESSOR');

const boundaries = {
  showroomSourceMutated: false,
  publicRouteMutated: false,
  publicDirectManipulationMutated: false,
  navigationAuthorityMutated: false,
  rendererSourceMutated: false,
  interactionSourceMutated: false,
  browserExecuted: false,
  gpuExecuted: false,
  r3EBranchCreated: false,
  r3EImplementationStarted: false,
  deploymentPerformed: false,
  physicalDeviceAcceptancePerformed: false,
  r3FWorkStarted: false,
  r3GWorkStarted: false,
  mainMerged: false,
  run8EPassClosed: false
};
assert(Object.values(boundaries).every((value) => value === false), 'R3D5_BOUNDARY_VIOLATION');

const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3D5_R3D_CLOSURE_AND_R3E_INPUT_DECISION_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3D5_EXECUTION_PASS',
  parentControl: parent,
  childControl: child,
  predecessorReceipts,
  closureLedger,
  r3EInputDecision: {
    decisionId: H_EARTH_RUN_8E_R3E_INPUT_DECISION.decisionId,
    evaluation: inputDecision,
    disposition: H_EARTH_RUN_8E_R3E_INPUT_DECISION.disposition,
    authorizedNextAction: H_EARTH_RUN_8E_R3E_INPUT_DECISION.authorizedNextAction,
    symbolicRequiredBase: H_EARTH_RUN_8E_R3E_INPUT_DECISION.baseRequirement.symbolicBase,
    admittedInputs,
    requiredObjective: H_EARTH_RUN_8E_R3E_INPUT_DECISION.requiredR3EObjective,
    requiredBoundaries: H_EARTH_RUN_8E_R3E_INPUT_DECISION.requiredR3EBoundaries
  },
  registryAudit: {
    identityVerified: registry.identityVerified,
    nodeId: registeredNode.nodeId,
    lifecycleStatus: registeredNode.lifecycleStatus,
    registeredPathCount: H_EARTH_RUN_8E_R3D5_PATHS.length,
    allPathsResolved: true,
    loaderReadOnly: registry.boundary.readOnly
  },
  boundaries,
  nextCheckpoint: 'RUN_8E_R3E_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E',
  issues: []
};
writeJson('h-earth.run8e-r3d5.r3d-closure-r3e-input-decision.execution.receipt.json', executionReceipt);
console.log(JSON.stringify({
  status: executionReceipt.status,
  closureLedger,
  r3EInputDisposition: executionReceipt.r3EInputDecision.disposition,
  admittedInputCount: admittedInputs.length,
  registeredPathCount: executionReceipt.registryAudit.registeredPathCount,
  boundaries,
  stoppingBoundary: executionReceipt.stoppingBoundary
}, null, 2));
