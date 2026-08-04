#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const BRIDGE_ID = 'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_EVALUATION_BRIDGE_v1';
export const INPUT_SCHEMA = 'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_EVALUATION_BRIDGE_INPUT_v1';
export const ASSERTION_SET_ID = 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_ASSERTIONS_28_v1';
export const EXPECTED_ASSERTION_COUNT = 28;
export const REQUIRED_TERRAIN_IDENTITY = Object.freeze({
  candidateTerrainBlob: 'eb544a41aaa56bdee5d6d92114e85d6b4e6262f3',
  successorTerrainFieldBlob: 'aa6111a2e37a0ddfd5004a2ec9920a2451f5a4b8',
  geometryConstructorBlob: 'a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46'
});

const OUTPUT_NAMES = Object.freeze({
  normalizedRequest: 'normalized-request.json',
  integrationManifest: 'integration-manifest.json',
  traversalManifest: 'traversal-manifest.json',
  cameraManifest: 'camera-manifest.json',
  evaluatorInputDocument: 'evaluator-input-document.json',
  evidencePackage: 'evidence-package.json',
  bridgeExecutionReceipt: 'bridge-execution-receipt.json'
});

class BridgeError extends Error {
  constructor(code, field, sourceDocument, detail = null) {
    const suffix = detail === null ? '' : `:${detail}`;
    super(`${code}:${field}:source=${sourceDocument}${suffix}`);
    this.name = 'BridgeError';
    this.code = code;
    this.field = field;
    this.sourceDocument = sourceDocument;
    this.detail = detail;
  }
}

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};

const stableText = (value) => `${JSON.stringify(stable(value), null, 2)}\n`;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const isSha40 = (value) => typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);
const isSha64 = (value) => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);

function requireObject(value, field, sourceDocument) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BridgeError('INVALID_OBJECT', field, sourceDocument);
  }
  return value;
}

function requireString(value, field, sourceDocument, { nonempty = true } = {}) {
  if (typeof value !== 'string' || (nonempty && value.length === 0)) {
    throw new BridgeError('MISSING_OR_INVALID_FIELD', field, sourceDocument);
  }
  return value;
}

function requireArray(value, field, sourceDocument, { nonempty = true } = {}) {
  if (!Array.isArray(value)) throw new BridgeError('MISSING_OR_INVALID_ARRAY', field, sourceDocument);
  if (nonempty && value.length === 0) throw new BridgeError('EMPTY_REQUIRED_ARRAY', field, sourceDocument);
  return value;
}

function requireBoolean(value, field, sourceDocument) {
  if (typeof value !== 'boolean') throw new BridgeError('MISSING_OR_INVALID_BOOLEAN', field, sourceDocument);
  return value;
}

function requireSha40(value, field, sourceDocument) {
  if (!isSha40(value)) throw new BridgeError('MISSING_OR_INVALID_SHA40', field, sourceDocument);
  return value;
}

function requireExact(value, expected, field, sourceDocument) {
  if (value !== expected) {
    throw new BridgeError('EXACT_VALUE_MISMATCH', field, sourceDocument, `expected=${expected}:actual=${String(value)}`);
  }
  return value;
}

function validateTerrainIdentity(value) {
  const source = 'integration';
  const identity = requireObject(value, 'integration.terrainIdentity', source);
  for (const [field, expected] of Object.entries(REQUIRED_TERRAIN_IDENTITY)) {
    const actual = requireString(identity[field], `integration.terrainIdentity.${field}`, source);
    if (actual !== expected) {
      throw new BridgeError(
        'CANDIDATE_BLOB_MISMATCH',
        `integration.terrainIdentity.${field}`,
        source,
        `expected=${expected}:actual=${actual}`
      );
    }
  }
  return {
    ...REQUIRED_TERRAIN_IDENTITY,
    terrainDifferentialFromSubject: 'ZERO',
    terrainMutationAuthorized: false
  };
}

function validateRequest(value, operationId) {
  const source = 'request';
  const request = requireObject(value, 'request', source);
  requireString(request.schemaVersion, 'request.schemaVersion', source);
  requireExact(request.operationId, operationId, 'request.operationId', source);
  requireObject(request.exactBaseline, 'request.exactBaseline', source);
  requireObject(request.region, 'request.region', source);
  requireArray(request.operations, 'request.operations', source);
  requireObject(request.traversableOpening, 'request.traversableOpening', source);
  requireObject(request.cavernCompatibility, 'request.cavernCompatibility', source);
  requireObject(request.waterfallReadiness, 'request.waterfallReadiness', source);
  return stable(request);
}

export function validateBridgeInput(value) {
  const input = requireObject(value, '$', 'bridge-input');
  requireExact(input.schema, INPUT_SCHEMA, 'schema', 'bridge-input');
  const operationId = requireString(input.operationId, 'operationId', 'bridge-input');
  const subjectCandidateHead = requireSha40(input.subjectCandidateHead, 'subjectCandidateHead', 'bridge-input');
  const evaluationToolingHead = requireSha40(input.evaluationToolingHead, 'evaluationToolingHead', 'bridge-input');
  const request = validateRequest(input.request, operationId);

  const integration = requireObject(input.integration, 'integration', 'integration');
  requireExact(integration.subjectCandidateHead, subjectCandidateHead, 'integration.subjectCandidateHead', 'integration');
  const changedPaths = requireArray(integration.changedPaths, 'integration.changedPaths', 'integration')
    .map((entry, index) => requireString(entry, `integration.changedPaths[${index}]`, 'integration'));
  if (new Set(changedPaths).size !== changedPaths.length) {
    throw new BridgeError('DUPLICATE_CHANGED_PATH', 'integration.changedPaths', 'integration');
  }
  const terrainIdentity = validateTerrainIdentity(integration.terrainIdentity);

  const traversal = requireObject(input.traversal, 'traversal', 'traversal');
  const traversalPoints = requireArray(traversal.points, 'traversal.points', 'traversal')
    .map((point, index) => requireObject(point, `traversal.points[${index}]`, 'traversal'));

  const camera = requireObject(input.camera, 'camera', 'camera');
  const cameraRecords = requireArray(camera.records, 'camera.records', 'camera')
    .map((record, index) => requireObject(record, `camera.records[${index}]`, 'camera'));

  const evaluatorContract = requireObject(input.evaluatorContract, 'evaluatorContract', 'evaluatorContract');
  requireExact(evaluatorContract.assertionSetId, ASSERTION_SET_ID, 'evaluatorContract.assertionSetId', 'evaluatorContract');
  requireExact(evaluatorContract.expectedAssertionCount, EXPECTED_ASSERTION_COUNT, 'evaluatorContract.expectedAssertionCount', 'evaluatorContract');
  const evidenceMembers = requireArray(evaluatorContract.evidenceMembers, 'evaluatorContract.evidenceMembers', 'evaluatorContract')
    .map((entry, index) => requireString(entry, `evaluatorContract.evidenceMembers[${index}]`, 'evaluatorContract'));
  const rollbackIdentity = requireObject(evaluatorContract.rollbackIdentity, 'evaluatorContract.rollbackIdentity', 'evaluatorContract');
  requireString(rollbackIdentity.rollbackId, 'evaluatorContract.rollbackIdentity.rollbackId', 'evaluatorContract');
  requireSha40(rollbackIdentity.rollbackHead, 'evaluatorContract.rollbackIdentity.rollbackHead', 'evaluatorContract');

  requireBoolean(input.authority?.terrainMutationAuthorized, 'authority.terrainMutationAuthorized', 'authority');
  requireBoolean(input.authority?.gateInvocationAuthorized, 'authority.gateInvocationAuthorized', 'authority');
  requireBoolean(input.authority?.gateReceiptGenerationAuthorized, 'authority.gateReceiptGenerationAuthorized', 'authority');
  requireExact(input.authority.terrainMutationAuthorized, false, 'authority.terrainMutationAuthorized', 'authority');
  requireExact(input.authority.gateInvocationAuthorized, false, 'authority.gateInvocationAuthorized', 'authority');
  requireExact(input.authority.gateReceiptGenerationAuthorized, false, 'authority.gateReceiptGenerationAuthorized', 'authority');

  return {
    schema: INPUT_SCHEMA,
    operationId,
    subjectCandidateHead,
    evaluationToolingHead,
    request,
    integration: {
      subjectCandidateHead,
      changedPaths: [...changedPaths].sort(),
      terrainIdentity
    },
    traversal: { points: traversalPoints },
    camera: { records: cameraRecords },
    evaluatorContract: {
      assertionSetId: ASSERTION_SET_ID,
      expectedAssertionCount: EXPECTED_ASSERTION_COUNT,
      evidenceMembers: [...evidenceMembers].sort(),
      rollbackIdentity: stable(rollbackIdentity)
    },
    authority: {
      terrainMutationAuthorized: false,
      gateInvocationAuthorized: false,
      gateReceiptGenerationAuthorized: false
    }
  };
}

function memberRecord(name, document) {
  const text = stableText(document);
  return { name, sha256: sha256(text), byteCount: Buffer.byteLength(text) };
}

export function buildBridgeArtifacts(rawInput) {
  const input = validateBridgeInput(rawInput);

  const normalizedRequest = {
    schema: 'H_EARTH_R06_C10_NORMALIZED_PROSPECTIVE_REQUEST_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    request: input.request
  };

  const integrationManifest = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_INTEGRATION_MANIFEST_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    evaluationToolingHead: input.evaluationToolingHead,
    admissionSuccessorHead: null,
    admissionSuccessorCommitRequired: true,
    changedPaths: input.integration.changedPaths,
    terrainIdentity: input.integration.terrainIdentity
  };

  const traversalManifest = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_TRAVERSAL_MANIFEST_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    points: input.traversal.points
  };

  const cameraManifest = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_CAMERA_MANIFEST_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    records: input.camera.records
  };

  const evaluatorInputDocument = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATOR_INPUT_DOCUMENT_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    evaluationToolingHead: input.evaluationToolingHead,
    request: normalizedRequest,
    changedPaths: input.integration.changedPaths,
    evidenceMembers: input.evaluatorContract.evidenceMembers,
    rollbackIdentity: input.evaluatorContract.rollbackIdentity,
    assertionSetId: ASSERTION_SET_ID,
    expectedAssertionCount: EXPECTED_ASSERTION_COUNT,
    gateInvocationAuthorized: false
  };

  const members = [
    memberRecord(OUTPUT_NAMES.normalizedRequest, normalizedRequest),
    memberRecord(OUTPUT_NAMES.integrationManifest, integrationManifest),
    memberRecord(OUTPUT_NAMES.traversalManifest, traversalManifest),
    memberRecord(OUTPUT_NAMES.cameraManifest, cameraManifest),
    memberRecord(OUTPUT_NAMES.evaluatorInputDocument, evaluatorInputDocument)
  ];

  const packageFingerprintPayload = {
    bridgeId: BRIDGE_ID,
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    evaluationToolingHead: input.evaluationToolingHead,
    terrainIdentity: input.integration.terrainIdentity,
    members
  };
  const admissionPackageDigestSha256 = sha256(JSON.stringify(stable(packageFingerprintPayload)));

  const evidencePackage = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_BOUND_EVIDENCE_PACKAGE_v1',
    operationId: input.operationId,
    subjectCandidateHead: input.subjectCandidateHead,
    evaluationToolingHead: input.evaluationToolingHead,
    admissionSuccessorHead: null,
    admissionPackageDigestSha256,
    memberCount: members.length,
    members,
    terrainDifferentialFromSubject: 'ZERO',
    proceduralEvidenceDifferential: 'MATERIAL',
    gateReceiptIncluded: false
  };

  const bridgeExecutionReceipt = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_EVALUATION_BRIDGE_EXECUTION_RECEIPT_v1',
    bridgeId: BRIDGE_ID,
    operationId: input.operationId,
    result: 'PASS_BRIDGE_ARTIFACTS_GENERATED',
    subjectCandidateHead: input.subjectCandidateHead,
    evaluationToolingHead: input.evaluationToolingHead,
    admissionSuccessorHead: null,
    admissionPackageDigestSha256,
    generatedArtifacts: Object.values(OUTPUT_NAMES).filter((name) => name !== OUTPUT_NAMES.bridgeExecutionReceipt),
    terrainMutationPerformed: false,
    candidateMutationPerformed: false,
    evaluatorInvoked: false,
    gateInvoked: false,
    gateReceiptGenerated: false,
    measurementSemanticsChanged: false,
    exactly28AssertionsClaimed: false,
    nextAuthorizedOperation: 'COMMIT_GATE_AWARE_ADMISSION_SUCCESSOR_AND_RUN_EXISTING_GATE_SEPARATELY'
  };

  return {
    normalizedRequest,
    integrationManifest,
    traversalManifest,
    cameraManifest,
    evaluatorInputDocument,
    evidencePackage,
    bridgeExecutionReceipt
  };
}

export function writeBridgeArtifacts(rawInput, outputDirectory) {
  const artifacts = buildBridgeArtifacts(rawInput);
  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const [key, name] of Object.entries(OUTPUT_NAMES)) {
    fs.writeFileSync(path.join(outputDirectory, name), stableText(artifacts[key]), 'utf8');
  }
  return artifacts.bridgeExecutionReceipt;
}

function parseArgs(argv) {
  const result = { input: null, outputDirectory: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--input') result.input = argv[++index] ?? null;
    else if (argv[index] === '--output-dir') result.outputDirectory = argv[++index] ?? null;
    else throw new Error(`UNKNOWN_ARGUMENT:${argv[index]}`);
  }
  if (!result.input) throw new Error('MISSING_REQUIRED_ARGUMENT:--input');
  if (!result.outputDirectory) throw new Error('MISSING_REQUIRED_ARGUMENT:--output-dir');
  return result;
}

function writeFailureReceipt(outputDirectory, error) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const receipt = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_EVALUATION_BRIDGE_FAILURE_RECEIPT_v1',
    bridgeId: BRIDGE_ID,
    result: 'FAIL_CLOSED_BEFORE_EVALUATOR_EXECUTION',
    errorCode: error instanceof BridgeError ? error.code : 'UNEXPECTED_BRIDGE_ERROR',
    field: error instanceof BridgeError ? error.field : null,
    sourceDocument: error instanceof BridgeError ? error.sourceDocument : null,
    detail: error instanceof BridgeError ? error.detail : null,
    error: error instanceof Error ? error.message : String(error),
    terrainMutationPerformed: false,
    candidateMutationPerformed: false,
    evaluatorInvoked: false,
    gateInvoked: false,
    gateReceiptGenerated: false
  };
  fs.writeFileSync(path.join(outputDirectory, OUTPUT_NAMES.bridgeExecutionReceipt), stableText(receipt), 'utf8');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
    const rawInput = JSON.parse(fs.readFileSync(path.resolve(args.input), 'utf8'));
    const receipt = writeBridgeArtifacts(rawInput, path.resolve(args.outputDirectory));
    process.stdout.write(stableText(receipt));
  } catch (error) {
    const outputDirectory = args?.outputDirectory ? path.resolve(args.outputDirectory) : process.cwd();
    writeFailureReceipt(outputDirectory, error);
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
