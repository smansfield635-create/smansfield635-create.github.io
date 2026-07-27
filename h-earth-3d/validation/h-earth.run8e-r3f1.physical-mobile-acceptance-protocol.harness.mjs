import fs from 'node:fs';
import path from 'node:path';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3FInputDecision } from '../control-plane/run-8/recovery/h-earth.run8e-r3f.input-decision.js';
import {
  H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT,
  evaluateHEarthRun8ER3FEvidenceContract
} from '../control-plane/run-8/recovery/h-earth.run8e-r3f.physical-mobile-evidence-contract.js';
import { evaluateHEarthRun8ER3F1Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3f1.physical-mobile-acceptance-protocol.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import {
  H_EARTH_RUN_8E_R3F1_NODE,
  H_EARTH_RUN_8E_R3F1_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3f1-physical-mobile-acceptance-protocol.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3F1_OUTPUT ?? '/tmp/h-earth-run8e-r3f1';
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);

const parent = evaluateHEarthRun8ER3Control();
const inputDecision = evaluateHEarthRun8ER3FInputDecision();
const evidenceContract = evaluateHEarthRun8ER3FEvidenceContract();
const child = evaluateHEarthRun8ER3F1Control();
assert(parent.eligible === true && parent.status === 'RUN_8E_R3F1_PARENT_EXECUTION_ELIGIBLE', `R3F1_PARENT_CONTROL_REJECTED:${parent.issues.join(',')}`);
assert(inputDecision.eligible === true && inputDecision.status === 'RUN_8E_R3F_INPUT_ADMISSIBLE_NOT_STARTED', `R3F1_INPUT_DECISION_REJECTED:${inputDecision.issues.join(',')}`);
assert(evidenceContract.eligible === true && evidenceContract.status === 'RUN_8E_R3F_EVIDENCE_CONTRACT_PASS', `R3F1_EVIDENCE_CONTRACT_REJECTED:${evidenceContract.issues.join(',')}`);
assert(child.eligible === true && child.status === 'RUN_8E_R3F1_CONTROL_EXECUTION_ELIGIBLE', `R3F1_CHILD_CONTROL_REJECTED:${child.issues.join(',')}`);

const receiptPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e5.pass-closed.receipt.json';
assert(fs.existsSync(receiptPath), 'R3F1_R3E5_RECEIPT_MISSING');
const predecessorReceipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
assert(predecessorReceipt?.eligible === true && predecessorReceipt?.status === 'RUN_8E_R3E5_PASS_CLOSED', 'R3F1_R3E5_RECEIPT_INVALID');
assert(predecessorReceipt?.closureResult?.run8ER3F === 'NOT_STARTED', 'R3F1_PREDECESSOR_R3F_ALREADY_STARTED');
assert(predecessorReceipt?.boundaries?.physicalReferenceDeviceExecuted === false, 'R3F1_PREDECESSOR_PHYSICAL_EXECUTION_VIOLATION');

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3F1_REGISTRY_LOADER_IDENTITY_FAILED');
const registeredNode = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3F1_NODE.nodeId);
assert(registeredNode?.nodeId === H_EARTH_RUN_8E_R3F1_NODE.nodeId, 'R3F1_REGISTRY_NODE_MISSING');
assert(registeredNode.lifecycleStatus === H_EARTH_RUN_8E_R3F1_NODE.lifecycleStatus, 'R3F1_REGISTRY_NODE_STATE_MISMATCH');
for (const repositoryPath of H_EARTH_RUN_8E_R3F1_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3F1_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const deviceLanes = Object.values(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.deviceLanes);
const sequence = H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.r3FSubcheckpointSequence;
assert(deviceLanes.length === 4, 'R3F1_DEVICE_LANE_COUNT_INVALID');
assert(sequence.length === 4, 'R3F1_SUBCHECKPOINT_COUNT_INVALID');
assert(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.requiredSessionRecordFields.length === 22, 'R3F1_SESSION_FIELD_COUNT_INVALID');
assert(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.previewTransportLaw.productionDeploymentAllowed === false, 'R3F1_PRODUCTION_DEPLOYMENT_AUTHORIZED');
assert(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.claimLaw.deviceBrandBackendSelectionProhibited === true, 'R3F1_DEVICE_BRAND_SELECTION_NOT_PROHIBITED');
assert(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.claimLaw.samsungOnlyImplementationProhibited === true, 'R3F1_SAMSUNG_ONLY_IMPLEMENTATION_NOT_PROHIBITED');

const makeSessionTemplate = () => Object.fromEntries(
  H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.requiredSessionRecordFields.map((field) => [field, null])
);
const sessionTemplates = Object.fromEntries(deviceLanes.map((lane) => [lane.laneId, {
  ...makeSessionTemplate(),
  deviceLaneId: lane.laneId,
  sourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
  publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
  publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
  interactionResults: Object.fromEntries(Object.keys(H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.requiredInteractionMatrix).map((key) => [key, null])),
  timingResults: {
    maximumObservedInputToVisibleResponseMs: null,
    maximumObservedFrozenPresentationMs: null,
    obsoleteInputBacklogObserved: null,
    continuousInteractionDurationMs: null
  },
  runtimeExclusivityResults: {
    activeWebGL2ContextCount: null,
    activePersistentRendererCount: null,
    activeNavigationStreamCount: null,
    activePointerTouchIntakeCount: null,
    activeFramePresentationAuthorityCount: null,
    canvas2DContextCount: null,
    legacyModuleRequestCount: null,
    duplicateInputListenerCount: null,
    worldRebuildDuringGestureCount: null
  },
  captureArtifacts: {
    screenRecording: null,
    initialScreenshot: null,
    postInteractionScreenshot: null,
    pageOrEnvironmentScreenshot: null,
    rawInstrumentedTrace: null
  }
}]));

const boundaries = {
  showroomSourceMutated: false,
  publicRouteMutated: false,
  publicRuntimeMutated: false,
  immutablePreviewCreated: false,
  browserExecuted: false,
  gpuExecuted: false,
  physicalReferenceDeviceExecuted: false,
  broaderMobileExecuted: false,
  productionDeployed: false,
  r3F2Started: false,
  r3F3Started: false,
  r3F4Started: false,
  r3GStarted: false,
  mainMerged: false,
  run8EPassClosed: false
};
assert(Object.values(boundaries).every((value) => value === false), 'R3F1_BOUNDARY_VIOLATION');

const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F1_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3F1_EXECUTION_PASS',
  parentControl: parent,
  childControl: child,
  inputDecision,
  predecessorReceipt: {
    path: `/${receiptPath}`,
    status: predecessorReceipt.status,
    eligible: predecessorReceipt.eligible,
    expectedGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00'
  },
  protocol: {
    contractId: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.contractId,
    evaluation: evidenceContract,
    subcheckpointSequence: sequence,
    deviceLanes,
    requiredInteractionMatrix: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.requiredInteractionMatrix,
    timingLaw: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.timingLaw,
    physicalityLaw: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.physicalityLaw,
    previewTransportLaw: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.previewTransportLaw,
    claimLaw: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.claimLaw,
    requiredSessionRecordFieldCount: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.requiredSessionRecordFields.length
  },
  registryAudit: {
    identityVerified: registry.identityVerified,
    nodeId: registeredNode.nodeId,
    lifecycleStatus: registeredNode.lifecycleStatus,
    registeredPathCount: H_EARTH_RUN_8E_R3F1_PATHS.length,
    allPathsResolved: true,
    loaderReadOnly: registry.boundary.readOnly
  },
  boundaries,
  nextCheckpoint: 'RUN_8E_R3F2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2',
  issues: []
};

writeJson('h-earth.run8e-r3f1.physical-mobile-acceptance-protocol.execution.receipt.json', executionReceipt);
writeJson('h-earth.run8e-r3f1.physical-mobile-evidence-intake.templates.json', {
  contractId: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.contractId,
  sessionTemplates
});
writeJson('h-earth.run8e-r3f1.physical-mobile-evidence-intake.manifest.json', {
  manifestId: 'H_EARTH_RUN_8E_R3F_PHYSICAL_MOBILE_EVIDENCE_INTAKE_MANIFEST_v1',
  sourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
  requiredLaneIds: deviceLanes.map((lane) => lane.laneId),
  physicalAcceptingEvidenceClasses: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.physicalityLaw.acceptingEvidenceClasses,
  supplementalEvidenceClasses: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.physicalityLaw.supplementalOnlyEvidenceClasses,
  sessions: [],
  referenceDeviceAcceptance: 'NOT_EXECUTED',
  broaderMobileAcceptance: 'NOT_EXECUTED',
  currentCheckpoint: 'RUN_8E_R3F1',
  nextCheckpoint: 'RUN_8E_R3F2_NOT_STARTED'
});

console.log(JSON.stringify({
  status: executionReceipt.status,
  protocolContractId: executionReceipt.protocol.contractId,
  deviceLaneCount: deviceLanes.length,
  subcheckpointCount: sequence.length,
  requiredSessionRecordFieldCount: executionReceipt.protocol.requiredSessionRecordFieldCount,
  registeredPathCount: executionReceipt.registryAudit.registeredPathCount,
  boundaries,
  nextCheckpoint: executionReceipt.nextCheckpoint,
  stoppingBoundary: executionReceipt.stoppingBoundary
}, null, 2));
