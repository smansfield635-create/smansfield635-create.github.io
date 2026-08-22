import fs from 'node:fs';
import path from 'node:path';
import executionFacade, {
  H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE,
  H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';
import loadHEarthRepositoryRegistryValidatorDependencies from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};

const receiptPath = path.join(
  process.cwd(),
  'h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.material-ledger.preservation.receipt.json'
);
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

assert(receipt.receiptType === 'H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_PRESERVATION_RECEIPT', 'EXECUTION_RECEIPT_TYPE_INVALID');
assert(receipt.eligible === true, 'EXECUTION_RECEIPT_NOT_ELIGIBLE');
assert(receipt.status === 'RUN_8E_R1_MATERIAL_LEDGER_PRESERVATION_PASS', 'EXECUTION_RECEIPT_STATUS_INVALID');
assert(receipt.validatedCoreHead === '799b3429259e08ac6afb687a50fdcf52e6d418a9', 'EXECUTION_VALIDATED_CORE_HEAD_INVALID');
assert(receipt.workflowEvidence?.runId === 30232602384, 'EXECUTION_RUN_ID_INVALID');
assert(receipt.workflowEvidence?.jobId === 89874157308, 'EXECUTION_JOB_ID_INVALID');
assert(receipt.workflowEvidence?.conclusion === 'success', 'EXECUTION_CONCLUSION_INVALID');
assert(receipt.workflowEvidence?.artifactId === 8640568574, 'EXECUTION_ARTIFACT_ID_INVALID');
assert(receipt.workflowEvidence?.artifactDigest === 'sha256:e5044d0c88fede5d2ce6114b7dc80466371435a69b16d33e0d53aeefd39859ba', 'EXECUTION_ARTIFACT_DIGEST_INVALID');
assert(receipt.workflowEvidence?.automaticRegistryPreflightRunId === 30232602326, 'EXECUTION_PREFLIGHT_RUN_INVALID');
assert(receipt.workflowEvidence?.automaticRegistryPreflightJobId === 89874157263, 'EXECUTION_PREFLIGHT_JOB_INVALID');
assert(receipt.workflowEvidence?.automaticRegistryPreflightConclusion === 'success', 'EXECUTION_PREFLIGHT_CONCLUSION_INVALID');
assert(receipt.custodyBoundary?.originalBrowserDownloadByteIdentityEstablished === false, 'EXECUTION_ORIGINAL_BYTE_BOUNDARY_INVALID');
assert(receipt.custodyBoundary?.repositoryTranscriptionByteIdentityEstablished === true, 'EXECUTION_REPOSITORY_CUSTODY_INVALID');
assert(receipt.disposition?.run8ER1DiagnosticCheckpoint === 'PASS_CLOSED', 'EXECUTION_R1_DISPOSITION_INVALID');
assert(receipt.disposition?.referenceDeviceInteractionUsability === 'FAIL', 'EXECUTION_REFERENCE_USABILITY_INVALID');
assert(receipt.disposition?.run8E === 'FAIL_OPEN', 'EXECUTION_RUN8E_STATE_INVALID');
assert(receipt.disposition?.run8EPassClosed === false, 'EXECUTION_RUN8E_CLOSED_INVALID');
assert(receipt.disposition?.run8ER2AuthorizedAfterPreservation === true, 'EXECUTION_R2_AUTHORIZATION_INVALID');
assert(receipt.disposition?.run8ER2Started === false, 'EXECUTION_R2_STARTED_INVALID');
assert(receipt.scope?.productMutationPerformed === false, 'EXECUTION_PRODUCT_MUTATION_INVALID');
assert(receipt.scope?.run8ER2SourceCreated === false, 'EXECUTION_R2_SOURCE_CREATED_INVALID');
assert(receipt.stoppingBoundary === 'STOP_BEFORE_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION', 'EXECUTION_STOPPING_BOUNDARY_INVALID');

const registryInstance = executionFacade.getHEarthRepositoryRegistryInstance();
assert(registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId), 'EXECUTION_NODE_NOT_REGISTERED');
assert(registryInstance.evidenceRecords.some((entry) => entry.evidenceId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE.evidenceId), 'EXECUTION_EVIDENCE_NOT_REGISTERED');

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'EXECUTION_REGISTRY_LOADER_IDENTITY_NOT_VERIFIED');
assert(loader.registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId), 'EXECUTION_OVERLAY_NOT_ACTIVE_IN_LOADER');

console.log(JSON.stringify({
  receiptType: 'H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_VALIDATION_RECEIPT',
  status: 'RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE_PASS',
  executionEvidenceId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE.evidenceId,
  nodeId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId,
  run8ER1DiagnosticCheckpoint: 'PASS_CLOSED',
  referenceDeviceInteractionUsability: 'FAIL',
  run8E: 'FAIL_OPEN',
  run8ER2Authorized: true,
  run8ER2Started: false,
  stoppingBoundary: receipt.stoppingBoundary,
  issues: []
}, null, 2));
