import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import registryFacade, {
  H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE,
  H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r1-material-ledger-scope.js';
import loadHEarthRepositoryRegistryValidatorDependencies from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};

const ROOT = process.cwd();
const MATERIAL_ROOT = 'h-earth-3d/validation/run-8e-r1-material-ledger';
const paths = {
  architecture001: `${MATERIAL_ROOT}/h-earth.run8e-r1.reference-device.architecture-probe-001.transcribed.json`,
  architecture002: `${MATERIAL_ROOT}/h-earth.run8e-r1.reference-device.architecture-probe-002.transcribed.json`,
  physical: `${MATERIAL_ROOT}/h-earth.run8e-r1.reference-device.physical-interaction.transcribed.json`,
  ledger: `${MATERIAL_ROOT}/h-earth.run8e-r1.reference-device.material-ledger.json`
};

const expected = {
  architecture001: {
    sha256: '984872d3940c6deca2f6284eb9d2d15c9e69aa1f812a278767c27a5212fafea6',
    bytes: 5781,
    gitBlob: '1ed92708f944eaf6df7208ad4412ca675306947b'
  },
  architecture002: {
    sha256: '5eb25e3b96ee0781f88c5b81a5e341f1b508dfe0ee0838e95835ccf55b2ad0ac',
    bytes: 5786,
    gitBlob: '1435919811a962c1a869c443662b9b4a3a2e52fe'
  },
  physical: {
    sha256: '84d1fef931b9936fc2f558b5863cfa086e357d599bca4217bb4a9f8cb014406b',
    bytes: 13475,
    gitBlob: 'a419ef0026de7053bc7ff4f44d2b316b18b17c5c'
  }
};

function readMaterial(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const bytes = fs.readFileSync(absolutePath);
  return {
    relativePath,
    bytes,
    text: bytes.toString('utf8'),
    json: JSON.parse(bytes.toString('utf8')),
    byteCount: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    gitBlob: execFileSync('git', ['hash-object', relativePath], { cwd: ROOT, encoding: 'utf8' }).trim()
  };
}

const materials = {
  architecture001: readMaterial(paths.architecture001),
  architecture002: readMaterial(paths.architecture002),
  physical: readMaterial(paths.physical),
  ledger: readMaterial(paths.ledger)
};

for (const key of ['architecture001', 'architecture002', 'physical']) {
  assert(materials[key].sha256 === expected[key].sha256, `${key.toUpperCase()}_SHA256_MISMATCH`);
  assert(materials[key].byteCount === expected[key].bytes, `${key.toUpperCase()}_BYTE_COUNT_MISMATCH`);
  assert(materials[key].gitBlob === expected[key].gitBlob, `${key.toUpperCase()}_GIT_BLOB_MISMATCH`);
}

for (const key of ['architecture001', 'architecture002']) {
  const receipt = materials[key].json;
  assert(receipt.receiptType === 'H_EARTH_RUN_8E_R1_ARCHITECTURE_PROBE_RECEIPT', `${key.toUpperCase()}_TYPE_INVALID`);
  assert(receipt.fixedCameraStateCount === 5, `${key.toUpperCase()}_CAMERA_CORPUS_INVALID`);
  assert(receipt.candidateA?.results?.length === 5, `${key.toUpperCase()}_CPU_RESULTS_INVALID`);
  assert(receipt.candidateB?.available === true && receipt.candidateB?.results?.length === 5, `${key.toUpperCase()}_WORKER_RESULTS_INVALID`);
  assert(receipt.candidateC?.available === true && receipt.candidateC?.results?.length === 5, `${key.toUpperCase()}_WEBGL_RESULTS_INVALID`);
  assert(receipt.architectureDisposition?.realtimeLiveRendererPrimaryCandidate === 'WEBGL_2', `${key.toUpperCase()}_WEBGL_DISPOSITION_INVALID`);
  assert(receipt.architectureDisposition?.deterministicCpuReferenceRenderer === 'PRESERVE_REFERENCE_ONLY', `${key.toUpperCase()}_CPU_DISPOSITION_INVALID`);
}

const physical = materials.physical.json;
assert(physical.receiptType === 'H_EARTH_RUN_8E_R1_PHYSICAL_SAMSUNG_PROFILING_RECEIPT', 'PHYSICAL_RECEIPT_TYPE_INVALID');
assert(physical.status === 'RUN_8E_R1_PHYSICAL_PROFILE_CAPTURED_NOT_CLOSURE_PASS', 'PHYSICAL_STATUS_INVALID');
assert(physical.interaction?.pointerEventReceiptCount === 190, 'PHYSICAL_POINTER_RECEIPT_COUNT_INVALID');
assert(physical.interaction?.pointerMoveCount === 190, 'PHYSICAL_POINTER_MOVE_COUNT_INVALID');
assert(physical.interaction?.directInspectionDiagnostics?.navigationIntentCount === 14, 'PHYSICAL_NAVIGATION_INTENT_COUNT_INVALID');
assert(physical.interaction?.directInspectionDiagnostics?.previewFrameCount === 190, 'PHYSICAL_PREVIEW_FRAME_COUNT_INVALID');
assert(physical.interaction?.schedulingDiagnostics?.lastRenderDurationMilliseconds === 7558.900000035763, 'PHYSICAL_RENDER_DURATION_INVALID');
assert(physical.mainThread?.longTaskCount === 18, 'PHYSICAL_LONG_TASK_COUNT_INVALID');
assert(physical.mainThread?.longestMainThreadTaskMilliseconds === 7421, 'PHYSICAL_LONGEST_TASK_INVALID');
assert(physical.stateEvidence?.baselineNavigation?.state?.sequence === 1, 'PHYSICAL_BASELINE_NAVIGATION_SEQUENCE_INVALID');
assert(physical.stateEvidence?.finalNavigation?.state?.sequence === 15, 'PHYSICAL_FINAL_NAVIGATION_SEQUENCE_INVALID');
assert(physical.stateEvidence?.finalRender?.receipt?.navigationStateId === 'H_EARTH_NAVIGATION_STATE_0015', 'PHYSICAL_FINAL_RENDER_STATE_INVALID');
assert(physical.failureClassification?.truthfulContinuousRealtimeInteractionEstablished === false, 'PHYSICAL_TRUTHFUL_INTERACTION_FALSE_REQUIRED');
assert(physical.failureClassification?.currentCpuPublicSuitability === 'FAILED_PHYSICAL_EVIDENCE', 'PHYSICAL_CPU_FAILURE_CLASS_INVALID');
assert(physical.failureClassification?.run8EPassClosed === false, 'PHYSICAL_RUN8E_CLOSED_INVALID');
assert(Array.isArray(physical.interaction?.firstPointerToNavigationMilliseconds) && physical.interaction.firstPointerToNavigationMilliseconds.length === 0, 'PHYSICAL_POINTER_TIMING_CAVEAT_INVALID');
assert(Array.isArray(physical.interaction?.releaseToSettledFrameMilliseconds) && physical.interaction.releaseToSettledFrameMilliseconds.length === 0, 'PHYSICAL_RELEASE_TIMING_CAVEAT_INVALID');

const ledger = materials.ledger.json;
assert(ledger.ledgerId === 'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MATERIAL_LEDGER_v1', 'LEDGER_ID_INVALID');
assert(ledger.materials?.length === 3, 'LEDGER_MATERIAL_COUNT_INVALID');
assert(ledger.sourceCustody?.sourceOccurrenceClass === 'CONVERSATION_TRANSCRIBED_JSON', 'LEDGER_SOURCE_CLASS_INVALID');
assert(ledger.sourceCustody?.originalBrowserDownloadByteIdentityEstablished === false, 'LEDGER_ORIGINAL_BYTE_BOUNDARY_INVALID');
assert(ledger.sourceCustody?.repositoryTranscriptionByteIdentityEstablished === true, 'LEDGER_REPOSITORY_BYTE_CUSTODY_INVALID');
assert(ledger.aggregateFindings?.referenceDeviceWebgl2FunctionalViability === 'ESTABLISHED', 'LEDGER_WEBGL_FINDING_INVALID');
assert(ledger.aggregateFindings?.navigationAuthorityFunctioning === true, 'LEDGER_NAVIGATION_FINDING_INVALID');
assert(ledger.aggregateFindings?.truthfulContinuousRealtimeInteractionEstablished === false, 'LEDGER_INTERACTION_FAILURE_INVALID');
assert(ledger.checkpointDisposition?.run8ER1DiagnosticCheckpoint === 'PASS_CLOSED', 'LEDGER_R1_DIAGNOSTIC_DISPOSITION_INVALID');
assert(ledger.checkpointDisposition?.referenceDeviceInteractionUsability === 'FAIL', 'LEDGER_REFERENCE_USABILITY_INVALID');
assert(ledger.checkpointDisposition?.run8E === 'FAIL_OPEN', 'LEDGER_RUN8E_STATE_INVALID');
assert(ledger.checkpointDisposition?.run8EPassClosed === false, 'LEDGER_RUN8E_CLOSED_INVALID');
assert(ledger.checkpointDisposition?.run8ER2AuthorizedAfterPreservation === true, 'LEDGER_R2_AUTHORIZATION_INVALID');
assert(ledger.checkpointDisposition?.run8ER2Started === false, 'LEDGER_R2_STARTED_INVALID');
assert(ledger.stoppingBoundary === 'STOP_BEFORE_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION', 'LEDGER_STOPPING_BOUNDARY_INVALID');

const ledgerById = new Map(ledger.materials.map((entry) => [entry.materialId, entry]));
const bindings = [
  ['RUN_8E_R1_REFERENCE_DEVICE_ARCHITECTURE_PROBE_001', 'architecture001'],
  ['RUN_8E_R1_REFERENCE_DEVICE_ARCHITECTURE_PROBE_002', 'architecture002'],
  ['RUN_8E_R1_REFERENCE_DEVICE_PHYSICAL_INTERACTION_001', 'physical']
];
for (const [materialId, key] of bindings) {
  const entry = ledgerById.get(materialId);
  assert(entry, `LEDGER_MATERIAL_MISSING:${materialId}`);
  assert(entry.contentSha256 === materials[key].sha256, `LEDGER_SHA_MISMATCH:${materialId}`);
  assert(entry.byteCount === materials[key].byteCount, `LEDGER_BYTE_COUNT_MISMATCH:${materialId}`);
  assert(entry.gitBlobSha === materials[key].gitBlob, `LEDGER_BLOB_MISMATCH:${materialId}`);
}

const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
assert(registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId), 'MATERIAL_LEDGER_NODE_NOT_REGISTERED');
assert(registryInstance.evidenceRecords.some((entry) => entry.evidenceId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE.evidenceId), 'MATERIAL_LEDGER_EVIDENCE_NOT_REGISTERED');
const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert(loader.identityVerified === true, 'REGISTRY_LOADER_IDENTITY_NOT_VERIFIED');
assert(loader.registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId), 'MATERIAL_LEDGER_OVERLAY_NOT_ACTIVE_IN_LOADER');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_VALIDATION_RECEIPT',
  status: 'RUN_8E_R1_MATERIAL_LEDGER_PRESERVATION_PASS',
  generatedAt: new Date().toISOString(),
  ledgerId: ledger.ledgerId,
  receiptCount: 3,
  materialIdentities: Object.fromEntries(Object.entries(materials)
    .filter(([key]) => key !== 'ledger')
    .map(([key, value]) => [key, {
      path: value.relativePath,
      gitBlobSha: value.gitBlob,
      contentSha256: value.sha256,
      byteCount: value.byteCount
    }])),
  checkpointDisposition: ledger.checkpointDisposition,
  sourceCustody: ledger.sourceCustody,
  registry: {
    nodeId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId,
    evidenceId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE.evidenceId,
    loaderIdentityVerified: loader.identityVerified
  },
  productMutationPerformed: false,
  run8ER2Started: false,
  stoppingBoundary: ledger.stoppingBoundary,
  issues: []
};

const outputDirectory = process.env.H_EARTH_RUN8E_R1_MATERIAL_LEDGER_OUTPUT ?? '/tmp/h-earth-run8e-r1-material-ledger';
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r1.material-ledger.validation.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
