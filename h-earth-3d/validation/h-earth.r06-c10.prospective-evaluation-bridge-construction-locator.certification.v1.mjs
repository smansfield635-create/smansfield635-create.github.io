#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const GOVERNING_HEAD = '56b6ab1f192aec994af0c537dd7c9dad1be14d7f';
const OPERATION_ID = 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_MATERIALIZATION_001';
const EXPECTED_BRANCH = 'agent/h-earth-r06-c10-prospective-evaluation-bridge-construction-locator-v1-001';
const LOCATOR_SCHEMA = 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_v1';
const LOCATOR_SCHEMA_ID = 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_SCHEMA_v1';
const SUBJECT_HEAD = 'ed8267a0251e70c4f654eef90f5e3d7329fdf419';
const TERRAIN = Object.freeze({
  candidateModuleBlob: 'eb544a41aaa56bdee5d6d92114e85d6b4e6262f3',
  successorFieldBlob: 'aa6111a2e37a0ddfd5004a2ec9920a2451f5a4b8',
  constructorBlob: 'a1a82bc8d61cdeeb2e34d85ab6d590a6f583ea46'
});
const LOCATOR_PATH = 'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/h-earth.r06-c10.prospective-evaluation-bridge-construction.locator.v1.json';
const SCHEMA_PATH = 'h-earth-3d/control-plane/r06-c10/schemas/h-earth.r06-c10.prospective-evaluation-bridge-construction.locator.schema.v1.json';
const CERTIFIER_PATH = 'h-earth-3d/validation/h-earth.r06-c10.prospective-evaluation-bridge-construction-locator.certification.v1.mjs';
const WORKFLOW_PATH = '.github/workflows/h-earth-r06-c10-prospective-evaluation-bridge-construction-locator-certification.yml';
const EXPECTED_PATHS = Object.freeze([LOCATOR_PATH, SCHEMA_PATH, CERTIFIER_PATH, WORKFLOW_PATH].sort());
const EXPECTED_COMMITS = Object.freeze([
  { message: 'Add prospective evaluation bridge locator schema', paths: [SCHEMA_PATH] },
  { message: 'Materialize prospective evaluation bridge construction locator', paths: [LOCATOR_PATH] },
  { message: 'Add prospective evaluation bridge locator certifier', paths: [CERTIFIER_PATH] },
  { message: 'Certify prospective evaluation bridge construction locator', paths: [WORKFLOW_PATH] }
]);
const SUBJECT_EVIDENCE_BRANCH = 'control/r06-c10-prospective-candidate-003-construction-and-admission';
const SUBJECT_EVIDENCE_PATH = 'h-earth-3d/control-plane/r06-c10/candidate-admission/executions/prospective-candidate-003/candidate-head.txt';
const PRIOR_BRIDGE_BRANCH = 'agent/h-earth-r06-c10-prospective-evaluation-bridge-v1-001';
const PRIOR_BRIDGE_CONTRACT_PATH = 'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/h-earth.r06-c10.prospective-candidate-evaluation-bridge.contract.v1.json';
const EXPECTED_FUTURE_PATHS = Object.freeze([
  'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/h-earth.r06-c10.prospective-candidate-evaluation-bridge.contract.v1.json',
  'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/schemas/h-earth.r06-c10.prospective-candidate-evaluation-bridge.input.schema.v1.json',
  'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/schemas/h-earth.r06-c10.prospective-candidate-evaluation-bridge.output.schema.v1.json',
  'h-earth-3d/control-plane/r06-c10/prospective-evaluation-bridge/fixtures/h-earth.r06-c10.prospective-candidate-evaluation-bridge.fixtures.v1.json',
  'h-earth-3d/tools/r06-c10/h-earth.r06-c10.prospective-candidate-evaluation-bridge.v1.mjs',
  'h-earth-3d/validation/h-earth.r06-c10.prospective-landform-candidate-003.exact-candidate-evaluator.prospective.v1.mjs',
  'h-earth-3d/validation/h-earth.r06-c10.prospective-candidate-evaluation-bridge.conformance.v1.mjs',
  '.github/workflows/h-earth-r06-c10-prospective-candidate-evaluation-bridge.yml'
]);

class CertificationError extends Error {
  constructor(code, detail = null) {
    super(detail === null ? code : `${code}:${detail}`);
    this.name = 'CertificationError';
    this.code = code;
    this.detail = detail;
  }
}

const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;
const text = (value) => `${JSON.stringify(stable(value), null, 2)}\n`;
const canonical = (value) => JSON.stringify(stable(value));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const same = (left, right) => canonical(left) === canonical(right);
const fail = (code, detail = null) => { throw new CertificationError(code, detail); };

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    args[token.slice(2)] = argv[++index] ?? null;
  }
  for (const required of ['locator', 'schema', 'repository-root', 'output', 'fingerprint-output', 'blob-map-output', 'manifest-output']) {
    if (!args[required]) fail('MISSING_REQUIRED_ARGUMENT', required);
  }
  return args;
}

function git(repositoryRoot, args, options = {}) {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  }).trimEnd();
}

function readJson(repositoryRoot, relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'));
  } catch (error) {
    fail('LOCATOR_SCHEMA_INVALID', `${relativePath}:${error.message}`);
  }
}

function requireExact(actual, expected, code, field) {
  if (!same(actual, expected)) fail(code, field);
}

function requireString(value, code, field) {
  if (typeof value !== 'string' || value.length === 0) fail(code, field);
}

function showFromRef(repositoryRoot, branch, filePath) {
  const refs = [`refs/remotes/origin/${branch}`, `refs/heads/${branch}`, branch];
  for (const ref of refs) {
    try {
      return git(repositoryRoot, ['show', `${ref}:${filePath}`], { stdio: ['ignore', 'pipe', 'ignore'] }) + '\n';
    } catch {}
  }
  fail('SUBJECT_EVIDENCE_MISSING', `${branch}:${filePath}`);
}

function verifyBlob(repositoryRoot, blob) {
  try {
    git(repositoryRoot, ['cat-file', '-e', `${blob}^{blob}`]);
  } catch {
    fail('TERRAIN_BLOB_MISMATCH', blob);
  }
}

function validateLocator(locator, schema) {
  requireExact(locator.schema, LOCATOR_SCHEMA, 'LOCATOR_SCHEMA_INVALID', 'schema');
  requireExact(locator.locatorId, LOCATOR_SCHEMA, 'LOCATOR_SCHEMA_INVALID', 'locatorId');
  requireExact(locator.status, 'MATERIALIZED_CERTIFICATION_CANDIDATE_AWAITING_ROLE_4_DISPOSITION', 'LOCATOR_SCHEMA_INVALID', 'status');
  requireExact(locator.projectId, 'H_EARTH_C2_R1_COMPLETE_WORLD', 'LOCATOR_SCHEMA_INVALID', 'projectId');
  requireExact(locator.repository, 'smansfield635-create/smansfield635-create.github.io', 'LOCATOR_SCHEMA_INVALID', 'repository');
  requireExact(locator.materializationOperationId, OPERATION_ID, 'LOCATOR_SCHEMA_INVALID', 'materializationOperationId');
  requireExact(locator.locatorPath, LOCATOR_PATH, 'LOCATOR_SCHEMA_INVALID', 'locatorPath');
  requireExact(locator.exactGoverningMainHead, GOVERNING_HEAD, 'GOVERNING_HEAD_MISMATCH', 'exactGoverningMainHead');
  requireString(locator.purpose, 'LOCATOR_SCHEMA_INVALID', 'purpose');
  requireExact(schema.$id, LOCATOR_SCHEMA_ID, 'LOCATOR_SCHEMA_INVALID', '$id');
  requireExact(schema.additionalProperties, false, 'LOCATOR_SCHEMA_INVALID', 'additionalProperties');

  requireExact(locator.subjectIdentity.identityClass, 'IMMUTABLE_LOGICAL_SUBJECT_WITH_EXACT_TERRAIN_BLOB_BINDING', 'SUBJECT_IDENTITY_BINDING_INVALID', 'identityClass');
  requireExact(locator.subjectIdentity.subjectCandidateHead, SUBJECT_HEAD, 'SUBJECT_IDENTITY_BINDING_INVALID', 'subjectCandidateHead');
  requireExact(locator.subjectIdentity.gitCommitReachabilityRequirement, 'NOT_REQUIRED', 'SUBJECT_IDENTITY_BINDING_INVALID', 'gitCommitReachabilityRequirement');
  requireExact(locator.subjectIdentity.terrainIdentity, { ...TERRAIN, requiredDifferential: 'ZERO' }, 'TERRAIN_BLOB_MISMATCH', 'terrainIdentity');

  requireExact(locator.identityAdapterLaw.subjectCandidateHead, 'IMMUTABLE_LOGICAL_SUBJECT_IDENTIFIER', 'SUBJECT_IDENTITY_BINDING_INVALID', 'identityAdapterLaw.subjectCandidateHead');
  requireExact(locator.identityAdapterLaw.evaluationToolingHead, 'REACHABLE_EXACT_COMMIT_CONTAINING_BRIDGE_AND_REPAIRED_28_ASSERTION_EVALUATOR', 'EVALUATION_TOOLING_HEAD_BINDING_INVALID', 'identityAdapterLaw.evaluationToolingHead');
  requireExact(locator.identityAdapterLaw.admissionSuccessorHead, 'SEPARATE_REACHABLE_COMMIT_CONTAINING_IDENTICAL_TERRAIN_BYTES_PLUS_CANDIDATE_BOUND_EVIDENCE', 'EVALUATION_TOOLING_HEAD_BINDING_INVALID', 'identityAdapterLaw.admissionSuccessorHead');
  requireExact(locator.identityAdapterLaw.directSubjectCommitExecutionRequired, false, 'SUBJECT_IDENTITY_BINDING_INVALID', 'identityAdapterLaw.directSubjectCommitExecutionRequired');

  requireExact(locator.downstreamOperation.operationId, 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_IMPLEMENTATION_001', 'LOCATOR_SCHEMA_INVALID', 'downstreamOperation.operationId');
  requireExact([...locator.downstreamOperation.exactAllowedRepositoryPaths].sort(), [...EXPECTED_FUTURE_PATHS].sort(), 'PATH_SCOPE_DRIFT', 'downstreamOperation.exactAllowedRepositoryPaths');
  requireExact(locator.downstreamOperation.evaluatorContract.assertionSetId, 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_ASSERTIONS_28_v1', 'ASSERTION_SEMANTICS_DRIFT', 'assertionSetId');
  requireExact(locator.downstreamOperation.evaluatorContract.expectedAssertionCount, 28, 'ASSERTION_COUNT_DRIFT', 'expectedAssertionCount');
  requireExact(locator.downstreamOperation.evaluatorContract.assertionThresholdsAndMeanings, 'FROZEN_UNCHANGED', 'ASSERTION_SEMANTICS_DRIFT', 'assertionThresholdsAndMeanings');
  requireExact(locator.downstreamOperation.evaluatorContract.bridgeProducesAssertionResults, false, 'ASSERTION_SEMANTICS_DRIFT', 'bridgeProducesAssertionResults');
  requireExact(locator.downstreamOperation.evaluatorContract.bridgeInvokesExistingGate, false, 'UNAUTHORIZED_GATE_INVOCATION', 'bridgeInvokesExistingGate');

  const prohibited = new Set(locator.thisOperationProhibitions);
  for (const required of [
    'PROSPECTIVE_EVALUATION_BRIDGE_IMPLEMENTATION',
    'REPAIRED_28_ASSERTION_EVALUATOR_IMPLEMENTATION',
    'ADMISSION_SUCCESSOR_CREATION',
    'VISUAL_REVIEW_URL_CREATION',
    'TERRAIN_MUTATION',
    'PRODUCT_RUNTIME_MUTATION',
    'ASSERTION_THRESHOLD_OR_MEANING_CHANGE'
  ]) {
    if (!prohibited.has(required)) fail('LOCATOR_SCHEMA_INVALID', `missingProhibition=${required}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repositoryRoot = path.resolve(args['repository-root']);
  const locator = readJson(repositoryRoot, args.locator);
  const schema = readJson(repositoryRoot, args.schema);
  validateLocator(locator, schema);

  try {
    git(repositoryRoot, ['merge-base', '--is-ancestor', GOVERNING_HEAD, 'HEAD']);
  } catch {
    fail('GOVERNING_HEAD_MISMATCH', 'governingHeadNotAncestor');
  }

  const constructionHead = git(repositoryRoot, ['rev-parse', 'HEAD']);
  const observedBranch = process.env.EXPECTED_CONSTRUCTION_BRANCH
    || process.env.GITHUB_HEAD_REF
    || git(repositoryRoot, ['branch', '--show-current']);
  requireExact(observedBranch, EXPECTED_BRANCH, 'BRANCH_OR_COMMIT_SEQUENCE_DRIFT', 'branch');

  const changedPaths = git(repositoryRoot, ['diff', '--name-only', `${GOVERNING_HEAD}..HEAD`])
    .split('\n').filter(Boolean).sort();
  requireExact(changedPaths, EXPECTED_PATHS, 'PATH_SCOPE_DRIFT', 'changedPaths');

  const commits = git(repositoryRoot, ['rev-list', '--reverse', `${GOVERNING_HEAD}..HEAD`])
    .split('\n').filter(Boolean);
  if (commits.length !== EXPECTED_COMMITS.length) {
    fail('BRANCH_OR_COMMIT_SEQUENCE_DRIFT', `expectedCommitCount=${EXPECTED_COMMITS.length}:actual=${commits.length}`);
  }
  const commitSequence = commits.map((commit, index) => {
    const message = git(repositoryRoot, ['show', '-s', '--format=%s', commit]);
    const paths = git(repositoryRoot, ['diff-tree', '--no-commit-id', '--name-only', '-r', commit])
      .split('\n').filter(Boolean).sort();
    requireExact(message, EXPECTED_COMMITS[index].message, 'BRANCH_OR_COMMIT_SEQUENCE_DRIFT', `commit[${index}].message`);
    requireExact(paths, [...EXPECTED_COMMITS[index].paths].sort(), 'BRANCH_OR_COMMIT_SEQUENCE_DRIFT', `commit[${index}].paths`);
    return { ordinal: index + 1, commit, message, paths };
  });

  const evidenceText = showFromRef(repositoryRoot, SUBJECT_EVIDENCE_BRANCH, SUBJECT_EVIDENCE_PATH);
  requireExact(evidenceText, `${SUBJECT_HEAD}\n`, 'SUBJECT_IDENTITY_BINDING_INVALID', 'survivingEvidence');

  for (const blob of Object.values(TERRAIN)) verifyBlob(repositoryRoot, blob);

  const priorContract = JSON.parse(showFromRef(repositoryRoot, PRIOR_BRIDGE_BRANCH, PRIOR_BRIDGE_CONTRACT_PATH));
  requireExact(priorContract.requiredTerrainIdentity.candidateTerrainBlob, TERRAIN.candidateModuleBlob, 'TERRAIN_BLOB_MISMATCH', 'priorContract.candidateTerrainBlob');
  requireExact(priorContract.requiredTerrainIdentity.successorTerrainFieldBlob, TERRAIN.successorFieldBlob, 'TERRAIN_BLOB_MISMATCH', 'priorContract.successorTerrainFieldBlob');
  requireExact(priorContract.requiredTerrainIdentity.geometryConstructorBlob, TERRAIN.constructorBlob, 'TERRAIN_BLOB_MISMATCH', 'priorContract.geometryConstructorBlob');
  requireExact(priorContract.identityModel.subjectCandidateHead, 'IMMUTABLE_TERRAIN_SUBJECT', 'SUBJECT_IDENTITY_BINDING_INVALID', 'priorContract.subjectCandidateHead');
  requireExact(priorContract.identityModel.evaluationToolingHead, 'COMMIT_CONTAINING_BRIDGE_AND_BOUNDED_RUNTIME_REPAIR', 'EVALUATION_TOOLING_HEAD_BINDING_INVALID', 'priorContract.evaluationToolingHead');

  const pathBlobMap = Object.fromEntries(EXPECTED_PATHS.map((entry) => [
    entry,
    git(repositoryRoot, ['hash-object', entry])
  ]));
  const locatorCanonicalSha256 = sha256(canonical(locator));
  const locatorSchemaCanonicalSha256 = sha256(canonical(schema));

  const fingerprintPayload = {
    domainId: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_CERTIFICATION_FINGERPRINT_v1',
    operationId: OPERATION_ID,
    exactGoverningMainHead: GOVERNING_HEAD,
    constructionHead,
    constructionBranch: EXPECTED_BRANCH,
    exactChangedPathBlobMap: pathBlobMap,
    locatorCanonicalSha256,
    locatorSchemaCanonicalSha256,
    subjectIdentity: locator.subjectIdentity,
    identityAdapterLaw: locator.identityAdapterLaw,
    downstreamOperation: locator.downstreamOperation,
    thisOperationProhibitions: locator.thisOperationProhibitions
  };
  const certificationFingerprintSha256 = sha256(canonical(fingerprintPayload));

  const blobMapDocument = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_PATH_BLOB_MAP_v1',
    operationId: OPERATION_ID,
    exactGoverningMainHead: GOVERNING_HEAD,
    constructionHead,
    paths: pathBlobMap
  };
  const manifest = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_CERTIFICATION_MANIFEST_v1',
    operationId: OPERATION_ID,
    result: 'PASS_CLOSED_LOCATOR_CERTIFIED',
    exactGoverningMainHead: GOVERNING_HEAD,
    constructionHead,
    constructionBranch: EXPECTED_BRANCH,
    exactChangedPaths: EXPECTED_PATHS,
    locatorCanonicalSha256,
    locatorSchemaCanonicalSha256,
    certificationFingerprintSha256,
    terrainIdentity: TERRAIN,
    subjectCandidateHead: SUBJECT_HEAD,
    directSubjectCommitExecutionRequired: false,
    bridgeImplementationPresent: false,
    repairedEvaluatorPresent: false,
    admissionSuccessorPresent: false,
    assertionSemanticsChanged: false,
    productMutation: false,
    hEarthTerrainMutation: false
  };
  const receipt = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_CERTIFICATION_RECEIPT_v1',
    operationId: OPERATION_ID,
    result: 'PASS_CLOSED_LOCATOR_CERTIFIED',
    exactGoverningMainHead: GOVERNING_HEAD,
    constructionHead,
    constructionBranch: EXPECTED_BRANCH,
    commitSequence,
    exactChangedPaths: EXPECTED_PATHS,
    locatorPath: LOCATOR_PATH,
    locatorGitBlobSha: pathBlobMap[LOCATOR_PATH],
    locatorCanonicalSha256,
    locatorSchemaCanonicalSha256,
    certificationFingerprintSha256,
    independentVerificationRequired: true,
    subjectCandidateHead: SUBJECT_HEAD,
    subjectIdentityClass: 'IMMUTABLE_LOGICAL_SUBJECT_WITH_EXACT_TERRAIN_BLOB_BINDING',
    terrainIdentity: TERRAIN,
    evaluationToolingHeadBinding: 'DEFERRED_TO_EXACT_DOWNSTREAM_IMPLEMENTATION_HEAD',
    bridgeImplementationPresent: false,
    repairedEvaluatorPresent: false,
    admissionSuccessorPresent: false,
    gateInvoked: false,
    assertionSemanticsChanged: false,
    productMutation: false,
    hEarthTerrainMutation: false,
    checks: [
      'GOVERNING_HEAD_ANCESTRY_PASS',
      'EXACT_BRANCH_PASS',
      'EXACT_FOUR_COMMIT_SEQUENCE_PASS',
      'EXACT_CHANGED_PATH_SCOPE_PASS',
      'LOCATOR_SCHEMA_PASS',
      'LOGICAL_SUBJECT_IDENTITY_PASS',
      'SURVIVING_SUBJECT_EVIDENCE_PASS',
      'TERRAIN_BLOB_TRIPLE_PASS',
      'PRIOR_ATTEMPT_READ_ONLY_IDENTITY_PASS',
      'EVALUATION_TOOLING_HEAD_BINDING_RULE_PASS',
      'ASSERTION_28_SEMANTICS_FROZEN_PASS',
      'NO_BRIDGE_IMPLEMENTATION_PASS',
      'NO_REPAIRED_EVALUATOR_IMPLEMENTATION_PASS',
      'NO_ADMISSION_SUCCESSOR_PASS',
      'NO_PRODUCT_OR_TERRAIN_MUTATION_PASS',
      'DETERMINISTIC_FINGERPRINT_PASS'
    ]
  };

  for (const [outputPath, value] of [
    [args.output, receipt],
    [args['blob-map-output'], blobMapDocument],
    [args['manifest-output'], manifest]
  ]) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), text(value), 'utf8');
  }
  fs.mkdirSync(path.dirname(path.resolve(args['fingerprint-output'])), { recursive: true });
  fs.writeFileSync(path.resolve(args['fingerprint-output']), `${certificationFingerprintSha256}\n`, 'utf8');
}

let parsedArgs = null;
try {
  parsedArgs = parseArgs(process.argv.slice(2));
  main();
} catch (error) {
  const failure = {
    schema: 'H_EARTH_R06_C10_PROSPECTIVE_EVALUATION_BRIDGE_CONSTRUCTION_LOCATOR_CERTIFICATION_RECEIPT_v1',
    operationId: OPERATION_ID,
    result: 'FAIL_CLOSED',
    errorCode: error instanceof CertificationError ? error.code : 'UNEXPECTED_CERTIFICATION_ERROR',
    detail: error instanceof CertificationError ? error.detail : String(error?.message ?? error),
    productMutation: false,
    hEarthTerrainMutation: false,
    bridgeImplementationPresent: false,
    repairedEvaluatorPresent: false,
    admissionSuccessorPresent: false
  };
  if (parsedArgs?.output) {
    fs.mkdirSync(path.dirname(path.resolve(parsedArgs.output)), { recursive: true });
    fs.writeFileSync(path.resolve(parsedArgs.output), text(failure), 'utf8');
  } else {
    process.stderr.write(text(failure));
  }
  process.exitCode = 1;
}
