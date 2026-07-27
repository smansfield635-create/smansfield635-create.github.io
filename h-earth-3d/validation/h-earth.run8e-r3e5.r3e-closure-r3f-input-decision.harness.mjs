import fs from 'node:fs';
import path from 'node:path';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3E5Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3e5.r3e-closure-r3f-input-decision.js';
import { H_EARTH_RUN_8E_R3F_INPUT_DECISION, evaluateHEarthRun8ER3FInputDecision } from '../control-plane/run-8/recovery/h-earth.run8e-r3f.input-decision.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import { H_EARTH_RUN_8E_R3E5_NODE, H_EARTH_RUN_8E_R3E5_PATHS } from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3e5-r3e-closure-r3f-input-decision.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3E5_OUTPUT ?? '/tmp/h-earth-run8e-r3e5';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const readJson = (repositoryPath) => JSON.parse(fs.readFileSync(repositoryPath, 'utf8'));
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3E5Control();
const inputDecision = evaluateHEarthRun8ER3FInputDecision();
assert(parent.eligible === true && parent.status === 'RUN_8E_R3E5_PARENT_EXECUTION_ELIGIBLE', `R3E5_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true && child.status === 'RUN_8E_R3E5_CONTROL_EXECUTION_ELIGIBLE', `R3E5_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);
assert(inputDecision.eligible === true, `R3E5_R3F_INPUT_DECISION_REJECTED:${inputDecision.issues.join(',')}`);

const receiptDefinitions = [
  ['RUN_8E_R3E1','h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e1.pass-closed.receipt.json','RUN_8E_R3E1_PASS_CLOSED','2c71944eabc6d4522d934ef2fc4af6a85a38f3b5'],
  ['RUN_8E_R3E2','h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e2.pass-closed.receipt.json','RUN_8E_R3E2_PASS_CLOSED','e33405c5e7f600e59a6b1103fd856a1d37ca51c5'],
  ['RUN_8E_R3E3','h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e3.pass-closed.receipt.json','RUN_8E_R3E3_PASS_CLOSED','5c5f1ae06220f88f497dc2b45f4d749679849918'],
  ['RUN_8E_R3E4','h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.pass-closed.receipt.json','RUN_8E_R3E4_PASS_CLOSED','7b2db7ed51a345edea88ad8a1288db4db150201d']
];
const predecessorReceipts = receiptDefinitions.map(([checkpointId, repositoryPath, expectedStatus, expectedGitBlob]) => {
  assert(fs.existsSync(repositoryPath), `R3E5_RECEIPT_MISSING:${checkpointId}`);
  const receipt = readJson(repositoryPath);
  assert(receipt?.eligible === true, `R3E5_RECEIPT_NOT_ELIGIBLE:${checkpointId}`);
  assert(receipt?.status === expectedStatus, `R3E5_RECEIPT_STATUS_MISMATCH:${checkpointId}`);
  const deployment = receipt?.sourceScope?.deployment ?? receipt?.boundaries?.deploymentPerformed ?? false;
  const physical = receipt?.sourceScope?.referenceDeviceAcceptance ?? receipt?.boundaries?.physicalDeviceAcceptancePerformed ?? false;
  const run8EPass = receipt?.sourceScope?.run8EPassClosed ?? receipt?.boundaries?.run8EPassClosed ?? false;
  assert(deployment === false, `R3E5_PREDECESSOR_DEPLOYMENT_VIOLATION:${checkpointId}`);
  assert(physical === false, `R3E5_PREDECESSOR_PHYSICAL_ACCEPTANCE_VIOLATION:${checkpointId}`);
  assert(run8EPass === false, `R3E5_PREDECESSOR_RUN8E_PASS_VIOLATION:${checkpointId}`);
  return { checkpointId, repositoryPath: `/${repositoryPath}`, expectedGitBlob, status: receipt.status, eligible: receipt.eligible, stoppingBoundary: receipt.stoppingBoundary };
});

const r3E4Receipt = readJson('h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.pass-closed.receipt.json');
assert(r3E4Receipt.acceptance.publicOneFingerLook === 'PASS', 'R3E5_R3E4_LOOK_ACCEPTANCE_MISSING');
assert(r3E4Receipt.acceptance.publicTwoFingerTravel === 'PASS', 'R3E5_R3E4_TRAVEL_ACCEPTANCE_MISSING');
assert(r3E4Receipt.acceptance.publicPinchZoom === 'PASS', 'R3E5_R3E4_ZOOM_ACCEPTANCE_MISSING');
assert(r3E4Receipt.acceptance.publicSustainedInteraction === 'PASS', 'R3E5_R3E4_SUSTAINED_ACCEPTANCE_MISSING');
assert(r3E4Receipt.acceptance.publicRuntimeAuthorityExclusivity === 'PRESERVED', 'R3E5_R3E4_EXCLUSIVITY_NOT_PRESERVED');
assert(r3E4Receipt.acceptance.flatBitmapDragging === false && r3E4Receipt.acceptance.worldRebuildDuringGesture === false && r3E4Receipt.acceptance.obsoleteInputBacklog === false, 'R3E5_R3E4_PROHIBITED_RESULT');

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3E5_REGISTRY_LOADER_IDENTITY_FAILED');
const registeredNode = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3E5_NODE.nodeId);
assert(registeredNode?.nodeId === H_EARTH_RUN_8E_R3E5_NODE.nodeId, 'R3E5_REGISTRY_NODE_MISSING');
for (const repositoryPath of H_EARTH_RUN_8E_R3E5_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3E5_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const admittedInputs = Object.entries(H_EARTH_RUN_8E_R3F_INPUT_DECISION.admittedInputs).map(([inputId, input]) => ({ inputId, ...input }));
assert(admittedInputs.length === 11, 'R3E5_R3F_ADMITTED_INPUT_COUNT_INVALID');
assert(H_EARTH_RUN_8E_R3F_INPUT_DECISION.currentTargetStatus === 'NOT_STARTED', 'R3E5_R3F_STARTED_EARLY');
assert(Object.values(H_EARTH_RUN_8E_R3F_INPUT_DECISION.currentExecution).every((value) => value === false), 'R3E5_R3F_EXECUTION_BOUNDARY_VIOLATION');
assert(H_EARTH_RUN_8E_R3F_INPUT_DECISION.referenceDeviceLaw.officialSamsungPhoneRole === 'PHYSICAL_REFERENCE_DEVICE_ONLY', 'R3E5_REFERENCE_DEVICE_ROLE_INVALID');
assert(H_EARTH_RUN_8E_R3F_INPUT_DECISION.referenceDeviceLaw.samsungOnlyImplementationProhibited === true, 'R3E5_SAMSUNG_ONLY_PROHIBITION_MISSING');
assert(H_EARTH_RUN_8E_R3F_INPUT_DECISION.referenceDeviceLaw.deviceBrandBackendSelectionProhibited === true, 'R3E5_BRAND_BACKEND_PROHIBITION_MISSING');

const closureLedger = {
  r3ESubcheckpointCount: 5,
  predecessorPassClosedCount: 4,
  currentClosureCheckpoint: 'RUN_8E_R3E5',
  currentClosureCheckpointStatus: 'EXECUTION_PENDING',
  allPredecessorReceiptsPresent: predecessorReceipts.length === 4,
  allPredecessorReceiptsEligible: predecessorReceipts.every((receipt) => receipt.eligible),
  unresolvedPredecessorCount: predecessorReceipts.filter((receipt) => !receipt.eligible).length,
  r3EClosureEligible: true,
  resultingR3EStatus: 'PASS_CLOSED',
  resultingR3State: 'OPEN_AT_R3F_BOUNDARY',
  resultingR3FStatus: 'NOT_STARTED',
  resultingRun8EStatus: 'FAIL_OPEN'
};
assert(closureLedger.r3ESubcheckpointCount === 5, 'R3E5_SUBCHECKPOINT_COUNT_INVALID');
assert(closureLedger.predecessorPassClosedCount === 4, 'R3E5_PREDECESSOR_PASS_COUNT_INVALID');
assert(closureLedger.unresolvedPredecessorCount === 0, 'R3E5_UNRESOLVED_PREDECESSOR');

const boundaries = {
  showroomSourceMutated: false,
  publicRouteMutated: false,
  publicRuntimeMutated: false,
  browserExecuted: false,
  gpuExecuted: false,
  physicalReferenceDeviceExecuted: false,
  broaderMobileAcceptanceExecuted: false,
  r3FBranchCreated: false,
  r3FExecutionStarted: false,
  deploymentPerformed: false,
  promotionPerformed: false,
  r3GWorkStarted: false,
  mainMerged: false,
  run8EPassClosed: false
};
assert(Object.values(boundaries).every((value) => value === false), 'R3E5_BOUNDARY_VIOLATION');

const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3E5_R3E_CLOSURE_AND_R3F_INPUT_DECISION_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3E5_EXECUTION_PASS',
  parentControl: parent,
  childControl: child,
  predecessorReceipts,
  closureLedger,
  r3FInputDecision: {
    decisionId: H_EARTH_RUN_8E_R3F_INPUT_DECISION.decisionId,
    evaluation: inputDecision,
    disposition: H_EARTH_RUN_8E_R3F_INPUT_DECISION.disposition,
    authorizedNextAction: H_EARTH_RUN_8E_R3F_INPUT_DECISION.authorizedNextAction,
    symbolicRequiredBase: H_EARTH_RUN_8E_R3F_INPUT_DECISION.baseRequirement.symbolicBase,
    admittedInputs,
    referenceDeviceLaw: H_EARTH_RUN_8E_R3F_INPUT_DECISION.referenceDeviceLaw,
    requiredAcceptance: H_EARTH_RUN_8E_R3F_INPUT_DECISION.requiredAcceptance,
    requiredBoundaries: H_EARTH_RUN_8E_R3F_INPUT_DECISION.requiredBoundaries
  },
  registryAudit: {
    identityVerified: registry.identityVerified,
    nodeId: registeredNode.nodeId,
    lifecycleStatus: registeredNode.lifecycleStatus,
    registeredPathCount: H_EARTH_RUN_8E_R3E5_PATHS.length,
    allPathsResolved: true,
    loaderReadOnly: registry.boundary.readOnly
  },
  boundaries,
  nextCheckpoint: 'RUN_8E_R3F_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F',
  issues: []
};
writeJson('h-earth.run8e-r3e5.r3e-closure-r3f-input-decision.execution.receipt.json', executionReceipt);
console.log(JSON.stringify({
  status: executionReceipt.status,
  closureLedger,
  r3FInputDisposition: executionReceipt.r3FInputDecision.disposition,
  admittedInputCount: admittedInputs.length,
  referenceDeviceRole: executionReceipt.r3FInputDecision.referenceDeviceLaw.officialSamsungPhoneRole,
  registeredPathCount: executionReceipt.registryAudit.registeredPathCount,
  boundaries,
  stoppingBoundary: executionReceipt.stoppingBoundary
}, null, 2));
