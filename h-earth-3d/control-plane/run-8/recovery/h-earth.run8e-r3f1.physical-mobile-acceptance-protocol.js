import { H_EARTH_RUN_8E_R3_CONTRACT_ID, evaluateHEarthRun8ER3Control } from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3FInputDecision } from './h-earth.run8e-r3f.input-decision.js';
import {
  H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT,
  evaluateHEarthRun8ER3FEvidenceContract
} from './h-earth.run8e-r3f.physical-mobile-evidence-contract.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F1_CONTROL_ID =
  'H_EARTH_RUN_8E_R3F1_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_AND_EVIDENCE_INTAKE_AUTHORITY_v1';

export const H_EARTH_RUN_8E_R3F1_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3F1_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3F1',
  checkpointName: 'PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_AND_EVIDENCE_INTAKE_AUTHORITY',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f1-physical-mobile-acceptance-protocol-001',
  baseBranch: 'agent/h-earth-run8e-r3e5-r3e-closure-r3f-input-decision-001',
  baseExactHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
  currentStatus: 'PASS_CLOSED',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3E5',
    status: 'PASS_CLOSED',
    exactHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    pullRequest: 249,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e5.pass-closed.receipt.json',
    passReceiptGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00',
    finalWorkflowRun: 30313774927,
    finalWorkflowJob: 90134863655,
    finalArtifactId: 8671366254,
    finalArtifactDigest: 'sha256:86dd2af17cdd0e477f7edd6aeef37263283cbf69f49cf705278c00195d98685e'
  }),
  protocolAuthority: freeze({
    evidenceContractId: H_EARTH_RUN_8E_R3F_EVIDENCE_CONTRACT.contractId,
    subcheckpointCount: 4,
    physicalEvidenceClasses: freeze(['PHYSICAL_LOCAL', 'REMOTE_PHYSICAL']),
    supplementalEvidenceClasses: freeze(['EMULATED_BROWSER', 'DESKTOP_MOBILE_VIEWPORT']),
    immutableNonProductionPreviewRequired: true,
    productionDeploymentAllowed: false,
    referenceDeviceRole: 'CURRENT_OFFICIAL_SAMSUNG_PHONE_PHYSICAL_REFERENCE_DEVICE_ONLY',
    productTarget: 'ALL_SUPPORTED_MOBILE_DEVICES',
    deviceBrandBackendSelectionProhibited: true,
    samsungOnlyImplementationProhibited: true
  }),
  requiredR3FSequence: freeze([
    freeze({ checkpointId: 'RUN_8E_R3F1', currentStatus: 'PASS_CLOSED' }),
    freeze({ checkpointId: 'RUN_8E_R3F2', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3F3', currentStatus: 'NOT_STARTED' }),
    freeze({ checkpointId: 'RUN_8E_R3F4', currentStatus: 'NOT_STARTED' })
  ]),
  executionEvidence: freeze({
    successfulExecutionHead: '08c4b9558d995acbc9ba1ff59990b8bc65d4a00d',
    workflowRun: 30314464717,
    workflowJob: 90136979082,
    artifactId: 8671621390,
    artifactDigest: 'sha256:3345790f2b92b789c80c59ed49759a7c9af5520b8fbe2be238631e94ffdee151',
    artifactFetchBackVerified: true,
    automaticRepositoryRegistryPreflightRun: 30314464737,
    automaticRepositoryRegistryPreflightStatus: 'PASS',
    protocolContractEligible: true,
    requiredSessionRecordFieldCount: 22,
    deviceLaneCount: 4,
    r3FSubcheckpointCount: 4,
    showroomMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0,
    physicalDeviceExecutionCount: 0,
    productionDeploymentCount: 0
  }),
  boundaries: freeze({
    showroomSourceMutation: false,
    publicRouteMutation: false,
    publicRuntimeMutation: false,
    browserExecution: false,
    gpuExecution: false,
    physicalReferenceDeviceExecution: false,
    broaderMobileExecution: false,
    productionDeployment: false,
    promotion: false,
    r3F2Work: false,
    r3F3Work: false,
    r3F4Work: false,
    r3GWork: false,
    mainMerge: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3F2_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2'
});

export function evaluateHEarthRun8ER3F1Control(candidate = H_EARTH_RUN_8E_R3F1_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  const inputDecision = evaluateHEarthRun8ER3FInputDecision();
  const evidenceContract = evaluateHEarthRun8ER3FEvidenceContract();
  if (parent.eligible !== true || !['RUN_8E_R3F1_PARENT_EXECUTION_ELIGIBLE','RUN_8E_R3F1_PARENT_PASS_CLOSED'].includes(parent.status)) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`), 'R3F1_PARENT_NOT_ELIGIBLE');
  if (inputDecision.eligible !== true || inputDecision.status !== 'RUN_8E_R3F_INPUT_ADMISSIBLE_NOT_STARTED') issues.push(...inputDecision.issues.map((issue) => `INPUT:${issue}`), 'R3F_INPUT_NOT_ADMISSIBLE');
  if (evidenceContract.eligible !== true) issues.push(...evidenceContract.issues.map((issue) => `EVIDENCE:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F1_CONTROL_ID) issues.push('R3F1_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '548672ae99cd406805f0c8ca576cc650baf7ed18') issues.push('R3F1_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.passReceiptGitBlob !== 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00') issues.push('R3E5_PASS_RECEIPT_BLOB_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3F1_STATUS_INVALID');
  if (candidate?.protocolAuthority?.subcheckpointCount !== 4 || candidate?.protocolAuthority?.referenceDeviceRole !== 'CURRENT_OFFICIAL_SAMSUNG_PHONE_PHYSICAL_REFERENCE_DEVICE_ONLY') issues.push('R3F1_PROTOCOL_AUTHORITY_INVALID');
  if (candidate?.protocolAuthority?.productTarget !== 'ALL_SUPPORTED_MOBILE_DEVICES' || candidate?.protocolAuthority?.deviceBrandBackendSelectionProhibited !== true || candidate?.protocolAuthority?.samsungOnlyImplementationProhibited !== true) issues.push('R3F1_DEVICE_NEUTRALITY_INVALID');
  const sequence = candidate?.requiredR3FSequence ?? [];
  if (sequence.map((entry) => entry.checkpointId).join(',') !== 'RUN_8E_R3F1,RUN_8E_R3F2,RUN_8E_R3F3,RUN_8E_R3F4') issues.push('R3F1_SEQUENCE_INVALID');
  if (sequence[0]?.currentStatus !== candidate?.currentStatus || sequence.slice(1).some((entry) => entry.currentStatus !== 'NOT_STARTED')) issues.push('R3F1_SEQUENCE_STATE_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) if (value !== false) issues.push(`R3F1_BOUNDARY_VIOLATION:${key}`);
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    const evidence = candidate?.executionEvidence ?? {};
    if (evidence.successfulExecutionHead !== '08c4b9558d995acbc9ba1ff59990b8bc65d4a00d' || evidence.workflowRun !== 30314464717 || evidence.workflowJob !== 90136979082 || evidence.artifactId !== 8671621390 || evidence.artifactFetchBackVerified !== true) issues.push('R3F1_CORE_WORKFLOW_IDENTITY_INVALID');
    if (evidence.artifactDigest !== 'sha256:3345790f2b92b789c80c59ed49759a7c9af5520b8fbe2be238631e94ffdee151') issues.push('R3F1_ARTIFACT_DIGEST_INVALID');
    if (evidence.automaticRepositoryRegistryPreflightRun !== 30314464737 || evidence.automaticRepositoryRegistryPreflightStatus !== 'PASS') issues.push('R3F1_AUTOMATIC_PREFLIGHT_INVALID');
    if (evidence.protocolContractEligible !== true || evidence.requiredSessionRecordFieldCount !== 22 || evidence.deviceLaneCount !== 4 || evidence.r3FSubcheckpointCount !== 4) issues.push('R3F1_PROTOCOL_EXECUTION_EVIDENCE_INVALID');
    for (const key of ['showroomMutationCount','browserExecutionCount','gpuExecutionCount','physicalDeviceExecutionCount','productionDeploymentCount']) if (evidence[key] !== 0) issues.push(`R3F1_NON_EXECUTION_COUNTER_INVALID:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F2_NOT_STARTED') issues.push('R3F2_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2') issues.push('R3F1_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3F1_PASS_CLOSED' : 'RUN_8E_R3F1_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3F1_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F1_CONTROL;
