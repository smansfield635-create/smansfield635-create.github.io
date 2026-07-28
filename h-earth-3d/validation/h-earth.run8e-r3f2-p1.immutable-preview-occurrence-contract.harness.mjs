import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  H_EARTH_RUN_8E_R3F2_P1_CONTRACT,
  evaluateHEarthRun8ER3F2P1Contract
} from '../control-plane/run-8/recovery/h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import {
  H_EARTH_RUN_8E_R3F2_P1_NODE,
  H_EARTH_RUN_8E_R3F2_P1_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-p1-immutable-preview-occurrence-contract.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3F2_P1_OUTPUT ?? '/tmp/h-earth-run8e-r3f2-p1';
const eventHead = process.env.H_EARTH_RUN8E_R3F2_P1_EVENT_HEAD ?? process.env.GITHUB_SHA ?? null;
const baseExactHead = 'fcdcb4e80a98a86773d5276447b880efde2099c9';
const receiptPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p1.pass-closed.receipt.json';
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
fs.mkdirSync(outputDirectory, { recursive: true });

assert(/^[0-9a-f]{40}$/.test(eventHead ?? ''), 'R3F2_P1_EVENT_HEAD_INVALID');
const evaluation = evaluateHEarthRun8ER3F2P1Contract();
assert(evaluation.eligible === true, `R3F2_P1_CONTRACT_REJECTED:${evaluation.issues.join(',')}`);
assert(['RUN_8E_R3F2_P1_CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT','RUN_8E_R3F2_P1_PASS_CLOSED'].includes(evaluation.status), 'R3F2_P1_CONTRACT_STATUS_INVALID');

const contract = H_EARTH_RUN_8E_R3F2_P1_CONTRACT;
assert(contract.baseExactHead === baseExactHead, 'R3F2_P1_BASE_HEAD_MISMATCH');
assert(contract.predecessor.packageHead === baseExactHead, 'R3F2_P1_PACKAGE_HEAD_MISMATCH');
assert(contract.predecessor.packageSha256 === 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234', 'R3F2_P1_PACKAGE_SHA256_MISMATCH');
assert(contract.predecessor.packageManifestSha256 === 'sha256:c74d71c1115b5b122d3d12e56014002bd15201c05af25b7d027e8d9ad88f7174', 'R3F2_P1_MANIFEST_SHA256_MISMATCH');
assert(contract.predecessor.packageByteCount === 1213597, 'R3F2_P1_PACKAGE_BYTE_COUNT_MISMATCH');
assert(contract.predecessor.workflowRun === 30317603086 && contract.predecessor.workflowJob === 90146467936, 'R3F2_P1_PREDECESSOR_WORKFLOW_IDENTITY_MISMATCH');
assert(contract.predecessor.artifactId === 8672743584 && contract.predecessor.artifactDigest === 'sha256:f6efea7ea4d1137c9b4eb8affb31f06deb0cc879653523a538d0f5145638faf0', 'R3F2_P1_PREDECESSOR_ARTIFACT_IDENTITY_MISMATCH');
assert(contract.predecessor.loopbackValidationPass === true && contract.predecessor.directFileValidationPass === true, 'R3F2_P1_PREDECESSOR_BROWSER_VALIDATION_NOT_PASS');
assert(contract.predecessor.activeWebGL2ContextCount === 1, 'R3F2_P1_PREDECESSOR_WEBGL2_CONTEXT_COUNT_INVALID');

const expectedPath = '/preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234/';
assert(contract.immutablePreviewOccurrence.urlPath === expectedPath, 'R3F2_P1_IMMUTABLE_PATH_MISMATCH');
assert(contract.immutablePreviewOccurrence.publicationHost === null, 'R3F2_P1_HOST_BOUND_TOO_EARLY');
assert(contract.immutablePreviewOccurrence.allowedServedFiles.length === 3, 'R3F2_P1_ALLOWED_FILE_COUNT_INVALID');
assert(contract.immutablePreviewOccurrence.allowedServedFiles.map((entry) => entry.relativePath).join('|') === 'index.html|preview-manifest.json|device-evidence-receipt.schema.json', 'R3F2_P1_ALLOWED_FILE_ORDER_INVALID');
assert(contract.immutablePreviewOccurrence.allowedRuntimeExternalRequests.length === 0, 'R3F2_P1_EXTERNAL_RUNTIME_REQUESTS_ALLOWED');
assert(contract.immutablePreviewOccurrence.mutableMainDependencyCountAllowed === 0, 'R3F2_P1_MUTABLE_MAIN_DEPENDENCY_ALLOWED');
assert(contract.deliveryLaw.cacheModel === 'IMMUTABLE_HASHED_URL_AND_IMMUTABLE_CACHE', 'R3F2_P1_CACHE_MODEL_INVALID');
assert(contract.deliveryLaw.xRobotsTag === 'noindex, nofollow, noarchive', 'R3F2_P1_NOINDEX_LAW_INVALID');
assert(contract.visibleIdentityRequirements.length === 6, 'R3F2_P1_VISIBLE_IDENTITY_REQUIREMENTS_INVALID');
assert(contract.deviceEvidenceReceiptRequiredFields.length === 23, 'R3F2_P1_DEVICE_RECEIPT_FIELD_COUNT_INVALID');
assert(Object.values(contract.boundaries).every((value) => value === false), 'R3F2_P1_BOUNDARY_VIOLATION');
assert(contract.stoppingBoundary === 'STOP_BEFORE_PREVIEW_FILES_OR_DEPLOYMENT_CONFIGURATION', 'R3F2_P1_STOPPING_BOUNDARY_INVALID');

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3F2_P1_REGISTRY_LOADER_IDENTITY_FAILED');
const node = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId);
assert(node?.nodeId === H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId, 'R3F2_P1_REGISTRY_NODE_MISSING');
assert(node.lifecycleStatus === contract.currentStatus, 'R3F2_P1_REGISTRY_NODE_STATE_MISMATCH');
for (const repositoryPath of H_EARTH_RUN_8E_R3F2_P1_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3F2_P1_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const receiptPresent = fs.existsSync(receiptPath);
let durableReceipt = null;
if (receiptPresent) {
  durableReceipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert(contract.currentStatus === 'PASS_CLOSED', 'R3F2_P1_RECEIPT_PRESENT_BEFORE_PASS_STATE');
  assert(durableReceipt.eligible === true && durableReceipt.status === 'RUN_8E_R3F2_P1_PASS_CLOSED', 'R3F2_P1_DURABLE_RECEIPT_INVALID');
  assert(durableReceipt.contractId === contract.contractId, 'R3F2_P1_DURABLE_RECEIPT_CONTRACT_MISMATCH');
  assert(durableReceipt.baseExactHead === baseExactHead, 'R3F2_P1_DURABLE_RECEIPT_BASE_MISMATCH');
  assert(durableReceipt.packageSha256 === contract.predecessor.packageSha256, 'R3F2_P1_DURABLE_RECEIPT_PACKAGE_MISMATCH');
} else {
  assert(contract.currentStatus === 'CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT', 'R3F2_P1_PASS_STATE_WITHOUT_RECEIPT');
}

const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_EXECUTION_RECEIPT',
  eligible: true,
  status: receiptPresent ? 'RUN_8E_R3F2_P1_FINAL_VALIDATION_PASS' : 'RUN_8E_R3F2_P1_CONTRACT_VALIDATION_PASS',
  eventHead,
  baseExactHead,
  contractEvaluation: evaluation,
  contractIdentity: {
    contractId: contract.contractId,
    currentStatus: contract.currentStatus,
    candidateId: contract.candidateIdentity.candidateId,
    immutablePreviewPath: contract.immutablePreviewOccurrence.urlPath,
    allowedServedFileCount: contract.immutablePreviewOccurrence.allowedServedFiles.length,
    requiredDeviceReceiptFieldCount: contract.deviceEvidenceReceiptRequiredFields.length
  },
  predecessorCustody: {
    packageHead: contract.predecessor.packageHead,
    packageSha256: contract.predecessor.packageSha256,
    packageByteCount: contract.predecessor.packageByteCount,
    packageManifestSha256: contract.predecessor.packageManifestSha256,
    workflowRun: contract.predecessor.workflowRun,
    workflowJob: contract.predecessor.workflowJob,
    artifactId: contract.predecessor.artifactId,
    artifactDigest: contract.predecessor.artifactDigest
  },
  registryAudit: {
    identityVerified: registry.identityVerified,
    nodeId: node.nodeId,
    lifecycleStatus: node.lifecycleStatus,
    registeredPathCount: H_EARTH_RUN_8E_R3F2_P1_PATHS.length,
    allPathsResolved: true,
    loaderReadOnly: registry.boundary.readOnly
  },
  receiptPresent,
  durableReceiptDigest: durableReceipt ? sha256(fs.readFileSync(receiptPath)) : null,
  boundaries: contract.boundaries,
  nextCheckpoint: contract.nextCheckpoint,
  stoppingBoundary: contract.stoppingBoundary,
  issues: []
};
const outputPath = path.join(outputDirectory, 'h-earth.run8e-r3f2-p1.contract.execution.receipt.json');
fs.writeFileSync(outputPath, `${JSON.stringify(executionReceipt, null, 2)}\n`);
console.log(JSON.stringify({
  status: executionReceipt.status,
  eventHead,
  candidateId: executionReceipt.contractIdentity.candidateId,
  immutablePreviewPath: executionReceipt.contractIdentity.immutablePreviewPath,
  allowedServedFileCount: executionReceipt.contractIdentity.allowedServedFileCount,
  requiredDeviceReceiptFieldCount: executionReceipt.contractIdentity.requiredDeviceReceiptFieldCount,
  receiptPresent,
  boundaries: executionReceipt.boundaries,
  nextCheckpoint: executionReceipt.nextCheckpoint,
  stoppingBoundary: executionReceipt.stoppingBoundary
}, null, 2));
