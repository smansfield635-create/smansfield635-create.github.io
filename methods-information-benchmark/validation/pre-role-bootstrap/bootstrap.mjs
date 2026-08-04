import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SEED_PATH = 'control-plane/methods-information-benchmark/bootstrap/origin-bootstrap-seed.v1.json';
const BUNDLE_PATH = 'control-plane/methods-information-benchmark/bootstrap/bootstrap-bundle.v1.json';
const PATH_MANIFEST = 'control-plane/methods-information-benchmark/bootstrap/changed-path-manifest.v1.json';

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : (value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
      : value);
const canonical = (value) => JSON.stringify(stable(value));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const hashObject = (value) => sha256(canonical(value));
const gitText = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const gitBytes = (...args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });

function parseArgs() {
  const args = {};
  for (let index = 3; index < process.argv.length; index += 1) {
    const token = process.argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = process.argv[index + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function requireArg(args, key) {
  const value = args[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`REQUIRED_ARGUMENT_MISSING:${key}`);
  return value.trim();
}

function emit(value, output) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  if (output) {
    const target = path.resolve(output);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, serialized);
  } else {
    process.stdout.write(serialized);
  }
}

function currentHead() {
  return gitText('rev-parse', 'HEAD^{commit}');
}

function assertExpectedHead(expectedHead) {
  const executedHead = currentHead();
  if (executedHead !== expectedHead) throw new Error(`EXACT_HEAD_MISMATCH:${expectedHead}:${executedHead}`);
  return executedHead;
}

function assertCleanCheckout() {
  const dirty = gitText('status', '--porcelain');
  if (dirty) throw new Error('DIRTY_WORKTREE');
}

function seedCheck(seed = readJson(SEED_PATH)) {
  if (seed.currentState.conversationMemoryAuthority !== false) throw new Error('CONVERSATION_MEMORY_AUTHORITY_FORBIDDEN');
  if (seed.currentState.privateWorkingStateAuthority !== false) throw new Error('PRIVATE_STATE_AUTHORITY_FORBIDDEN');
  if (seed.currentState.permanentRoleAuthorityExists !== false) throw new Error('PERMANENT_ROLE_PREEXISTENCE_FORBIDDEN');
  if (seed.requiredFunctions.length !== 9) throw new Error('EXPECTED_NINE_OPERATIONAL_FUNCTIONS');
  if (seed.expectedRoles.length !== 6) throw new Error('EXPECTED_SIX_PERMANENT_ROLES');
  if (seed.canonicalLineage?.canonicalSeedPath !== SEED_PATH) throw new Error('CANONICAL_SEED_LINEAGE_MISMATCH');
  return { pass: true, digest: hashObject(seed) };
}

function bundleCheck(bundle = readJson(BUNDLE_PATH), seed = readJson(SEED_PATH)) {
  const declaredFunctions = new Set(bundle.functions);
  if (declaredFunctions.size !== bundle.functions.length) throw new Error('DUPLICATE_OPERATIONAL_FUNCTION');
  for (const fn of seed.requiredFunctions) {
    if (!declaredFunctions.has(fn)) throw new Error(`UNASSIGNED_OPERATIONAL_FUNCTION:${fn}`);
  }

  const assigned = new Map();
  for (const [role, functions] of Object.entries(bundle.roles)) {
    for (const fn of functions) {
      if (assigned.has(fn)) throw new Error(`DUPLICATE_FUNCTION_AUTHORITY:${fn}`);
      assigned.set(fn, role);
    }
  }
  for (const fn of seed.requiredFunctions) {
    if (!assigned.has(fn)) throw new Error(`UNASSIGNED_OPERATIONAL_FUNCTION:${fn}`);
  }
  for (const [left, right] of bundle.incompatible) {
    for (const [role, functions] of Object.entries(bundle.roles)) {
      if (functions.includes(left) && functions.includes(right)) throw new Error(`INCOMPATIBLE_FUNCTION_ASSIGNMENT:${role}`);
    }
  }
  for (const [role, contract] of Object.entries(bundle.contracts)) {
    if (contract.conversationMemoryAuthority !== false || contract.privateStateAuthority !== false) {
      throw new Error(`ROLE_CONTRACT_PRIVATE_AUTHORITY:${role}`);
    }
    if (!contract.returnRequired || !contract.stop) throw new Error(`ROLE_CONTRACT_RETURN_REQUIRED:${role}`);
  }
  if (bundle.activation.roleAuthorityActive || bundle.activation.activeAssignment) {
    throw new Error('PERMANENT_ROLE_ACTIVATION_NOT_AUTHORIZED');
  }
  return {
    pass: true,
    functionCount: bundle.functions.length,
    roleCount: Object.keys(bundle.roles).length,
    circularAuthorityCount: 0,
    conflictingRoleCombinations: 0,
    digest: hashObject(bundle)
  };
}

function blobIdentity(relativePath, head = currentHead()) {
  const gitBlob = gitText('rev-parse', `${head}:${relativePath}`);
  const bytes = gitBytes('show', `${head}:${relativePath}`);
  return Object.freeze({ path: relativePath, gitBlob, sha256: sha256(bytes) });
}

function changedPathBlobMap(baseHead, candidateHead) {
  gitText('merge-base', '--is-ancestor', baseHead, candidateHead);
  const manifest = readJson(PATH_MANIFEST);
  const actual = gitText('diff', '--name-only', baseHead, candidateHead)
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
  const expected = [...manifest.expectedChangedPaths].sort();
  if (canonical(actual) !== canonical(expected)) {
    const missing = expected.filter((value) => !actual.includes(value));
    const unexpected = actual.filter((value) => !expected.includes(value));
    throw new Error(`CHANGED_PATH_SET_MISMATCH:${canonical({ missing, unexpected })}`);
  }
  for (const candidatePath of actual) {
    if (manifest.prohibitedPathPrefixes.some((prefix) => candidatePath.startsWith(prefix))) {
      throw new Error(`PROTECTED_PATH_MUTATION:${candidatePath}`);
    }
  }
  return actual.map((candidatePath) => blobIdentity(candidatePath, candidateHead));
}

function repositoryDiscovery() {
  const bundle = readJson(BUNDLE_PATH);
  const files = gitText('ls-files').split(/\r?\n/).filter(Boolean).sort();
  const candidates = [];
  for (const candidatePath of files) {
    if (bundle.discovery.exclude.some((prefix) => candidatePath.startsWith(prefix))) continue;
    if (!bundle.discovery.include.some((prefix) => candidatePath.startsWith(prefix))) continue;
    let source = '';
    try {
      source = fs.readFileSync(path.join(ROOT, candidatePath), 'utf8');
    } catch {
      continue;
    }
    const markers = bundle.discovery.markers.filter((marker) => source.includes(marker));
    if (!markers.length) continue;
    candidates.push({ ...blobIdentity(candidatePath), markers });
  }
  const exact = candidates.filter((candidate) => candidate.markers.includes('METHODS_INFORMATION_BENCHMARK'));
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_REPOSITORY_DISCOVERY_RECEIPT_v1',
    head: currentHead(),
    candidateCount: candidates.length,
    exactMarkerCandidateCount: exact.length,
    candidates,
    disposition: exact.length === 1
      ? 'CANDIDATE_FOR_REQUIREMENTS_FREEZE'
      : (exact.length > 1 ? bundle.discovery.multiple : bundle.discovery.none),
    mutationPerformed: false
  };
}

function environmentClass() {
  return Object.freeze({
    nodeMajorVersion: Number(process.versions.node.split('.')[0]),
    operatingSystemClass: process.platform,
    architectureClass: process.arch
  });
}

function fingerprintContext({ expectedHead, baseHead }) {
  const candidateHead = assertExpectedHead(expectedHead);
  assertCleanCheckout();
  const bundle = readJson(BUNDLE_PATH);
  const changedPaths = changedPathBlobMap(baseHead, candidateHead);
  const authorityPaths = [...new Set(bundle.fingerprint.authorityPaths)].sort();
  const authorityFiles = authorityPaths.map((candidatePath) => blobIdentity(candidatePath, candidateHead));
  const originSeed = blobIdentity(SEED_PATH, candidateHead);
  const discovery = repositoryDiscovery();
  const exactCommand = `node methods-information-benchmark/validation/pre-role-bootstrap/bootstrap.mjs bootstrap-fingerprint-generator --expected-head ${candidateHead} --base-head ${baseHead}`;
  const payload = Object.freeze({
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_FINGERPRINT_PAYLOAD_v2',
    candidateHead,
    baseHead,
    originSeed,
    authorityFiles,
    changedPathBlobMap: changedPaths,
    toolBlobs: bundle.fingerprint.toolPaths.map((candidatePath) => blobIdentity(candidatePath, candidateHead)),
    schemaBlobs: bundle.fingerprint.schemaPaths.map((candidatePath) => blobIdentity(candidatePath, candidateHead)),
    benchmarkIdentity: Object.freeze({
      status: discovery.disposition,
      blobs: discovery.disposition === 'CANDIDATE_FOR_REQUIREMENTS_FREEZE' ? discovery.candidates : []
    }),
    exactCommand,
    environmentClass: environmentClass(),
    normalizationContract: bundle.fingerprint.normalization
  });
  return Object.freeze({ payload, fingerprint: hashObject(payload), discovery });
}

function selfTest(args = {}) {
  const seed = readJson(SEED_PATH);
  const bundle = readJson(BUNDLE_PATH);
  const expectedHead = args['expected-head'] || currentHead();
  const baseHead = args['base-head'] || readJson(PATH_MANIFEST).baseHead;
  assertExpectedHead(expectedHead);
  const positive = { seed: seedCheck(seed), bundle: bundleCheck(bundle, seed) };
  const negative = [];
  const expect = (id, callback, prefix) => {
    try {
      callback();
      negative.push({ id, pass: false, observed: 'NO_FAILURE' });
    } catch (error) {
      negative.push({ id, pass: String(error.message).startsWith(prefix), observed: error.message });
    }
  };

  let fixture = structuredClone(seed);
  fixture.currentState.conversationMemoryAuthority = true;
  expect('CONVERSATION_MEMORY_AUTHORITATIVE', () => seedCheck(fixture), 'CONVERSATION_MEMORY_AUTHORITY_FORBIDDEN');

  fixture = structuredClone(bundle);
  fixture.activation.roleAuthorityActive = true;
  expect('ROLE_SELF_ACTIVATION', () => bundleCheck(fixture, seed), 'PERMANENT_ROLE_ACTIVATION_NOT_AUTHORIZED');

  fixture = structuredClone(bundle);
  fixture.roles.ROLE_1_CONSTRUCTION_AND_SOURCE_INTEGRATION.push('INDEPENDENTLY_VERIFY');
  expect('MUTATOR_SELF_VERIFICATION', () => bundleCheck(fixture, seed), 'DUPLICATE_FUNCTION_AUTHORITY');

  fixture = structuredClone(bundle);
  fixture.functions = fixture.functions.filter((fn) => fn !== 'SUCCEED');
  expect('UNASSIGNED_FUNCTION', () => bundleCheck(fixture, seed), 'UNASSIGNED_OPERATIONAL_FUNCTION');

  fixture = structuredClone(bundle);
  fixture.contracts.ROLE_6_REQUIREMENTS_AND_CAUSAL_AUTHORITY.returnRequired = false;
  expect('MISSING_RETURN_DESTINATION', () => bundleCheck(fixture, seed), 'ROLE_CONTRACT_RETURN_REQUIRED');

  expect('VERIFIER_MISSING_BUILDER_RECEIPT', () => verify({}), 'REQUIRED_ARGUMENT_MISSING:builder-receipt');

  const fingerprintResult = fingerprintContext({ expectedHead, baseHead });
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_PRE_ROLE_BOOTSTRAP_SELF_TEST_RECEIPT_v2',
    executingFunction: 'BOOTSTRAP_BUILDER_LOCAL_NONINDEPENDENT_CHECK',
    candidateHead: currentHead(),
    baseHead,
    positive,
    negative,
    builderFingerprint: fingerprintResult.fingerprint,
    fingerprintPayloadDigest: hashObject(fingerprintResult.payload),
    independentVerificationClaimed: false,
    permanentRoleAuthorityActivated: false,
    pass: positive.seed.pass && positive.bundle.pass && negative.every((entry) => entry.pass)
  };
}

function buildReceipt(args) {
  const expectedHead = requireArg(args, 'expected-head');
  const baseHead = requireArg(args, 'base-head');
  const executionHolder = requireArg(args, 'execution-holder');
  const executedHead = assertExpectedHead(expectedHead);
  assertCleanCheckout();
  const selfTestReceipt = selfTest({ 'expected-head': expectedHead, 'base-head': baseHead });
  if (!selfTestReceipt.pass) throw new Error('BUILDER_SELF_TEST_FAILED');
  const { payload, fingerprint, discovery } = fingerprintContext({ expectedHead, baseHead });
  const receipt = Object.freeze({
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_BUILDER_RECEIPT_v2',
    operationId: 'METHODS_INFORMATION_BENCHMARK_PRE_ROLE_BOOTSTRAP_AND_ROLE_MATERIALIZATION_v1',
    executingFunction: 'BOOTSTRAP_BUILDER',
    executionHolder,
    expectedHead,
    executedHead,
    exactHeadMatch: expectedHead === executedHead,
    baseHead,
    originSeed: payload.originSeed,
    changedPathBlobMap: payload.changedPathBlobMap,
    authorityFileBlobMap: payload.authorityFiles,
    toolBlobs: payload.toolBlobs,
    schemaBlobs: payload.schemaBlobs,
    benchmarkIdentity: payload.benchmarkIdentity,
    exactFingerprintCommand: payload.exactCommand,
    environmentClass: payload.environmentClass,
    builderFingerprint: fingerprint,
    fingerprintPayloadDigest: hashObject(payload),
    selfTestPass: true,
    repositoryDiscoveryDisposition: discovery.disposition,
    independentVerificationClaimed: false,
    permanentRoleAuthorityActivated: false,
    conversationMemoryUsed: false,
    privateStateUsed: false,
    pass: true
  });
  if (args['changed-path-map-output']) emit(payload.changedPathBlobMap, args['changed-path-map-output']);
  return receipt;
}

function loadJsonFile(filePath, missingToken) {
  if (!filePath) throw new Error(missingToken);
  const absolute = path.resolve(filePath);
  if (!fs.existsSync(absolute)) throw new Error(`${missingToken}:${absolute}`);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function verify(args) {
  const builderReceiptPath = requireArg(args, 'builder-receipt');
  const suppliedBuilderFingerprint = requireArg(args, 'builder-fingerprint');
  const suppliedCandidateHead = requireArg(args, 'builder-candidate-head');
  const suppliedBuilderHolder = requireArg(args, 'builder-execution-holder');
  const verifierExecutionHolder = requireArg(args, 'verifier-execution-holder');
  const suppliedSeedBlob = requireArg(args, 'origin-seed-blob');
  const suppliedSeedSha256 = requireArg(args, 'origin-seed-sha256');
  const changedPathMapPath = requireArg(args, 'changed-path-blob-map');

  if (suppliedBuilderHolder === verifierExecutionHolder) throw new Error('BUILDER_VERIFIER_HOLDER_COLLISION');

  const builderReceipt = loadJsonFile(builderReceiptPath, 'BUILDER_RECEIPT_REQUIRED');
  const suppliedMap = loadJsonFile(changedPathMapPath, 'EXACT_CHANGED_PATH_BLOB_MAP_REQUIRED');
  if (builderReceipt.schema !== 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_BUILDER_RECEIPT_v2') throw new Error('BUILDER_RECEIPT_SCHEMA_MISMATCH');
  if (!builderReceipt.pass || !builderReceipt.exactHeadMatch) throw new Error('BUILDER_RECEIPT_NOT_PASS_CLOSED');
  if (builderReceipt.executingFunction !== 'BOOTSTRAP_BUILDER') throw new Error('BUILDER_FUNCTION_IDENTITY_MISMATCH');
  if (builderReceipt.builderFingerprint !== suppliedBuilderFingerprint) throw new Error('BUILDER_FINGERPRINT_ARGUMENT_MISMATCH');
  if (builderReceipt.executedHead !== suppliedCandidateHead) throw new Error('BUILDER_CANDIDATE_HEAD_ARGUMENT_MISMATCH');
  if (builderReceipt.executionHolder !== suppliedBuilderHolder) throw new Error('BUILDER_EXECUTION_HOLDER_ARGUMENT_MISMATCH');
  if (builderReceipt.originSeed.gitBlob !== suppliedSeedBlob) throw new Error('ORIGIN_SEED_BLOB_ARGUMENT_MISMATCH');
  if (builderReceipt.originSeed.sha256 !== suppliedSeedSha256) throw new Error('ORIGIN_SEED_SHA256_ARGUMENT_MISMATCH');
  if (canonical(builderReceipt.changedPathBlobMap) !== canonical(suppliedMap)) throw new Error('CHANGED_PATH_BLOB_MAP_ARGUMENT_MISMATCH');

  const executedHead = assertExpectedHead(suppliedCandidateHead);
  assertCleanCheckout();
  const { payload, fingerprint } = fingerprintContext({ expectedHead: suppliedCandidateHead, baseHead: builderReceipt.baseHead });
  const fingerprintMatch = fingerprint === suppliedBuilderFingerprint;
  const seedIdentityMatch = payload.originSeed.gitBlob === suppliedSeedBlob && payload.originSeed.sha256 === suppliedSeedSha256;
  const changedPathBlobMapMatch = canonical(payload.changedPathBlobMap) === canonical(suppliedMap);

  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_VERIFICATION_RECEIPT_v2',
    executingFunction: 'BOOTSTRAP_VERIFIER',
    executionHolder: verifierExecutionHolder,
    builderExecutionHolder: suppliedBuilderHolder,
    distinctExecutionHolders: verifierExecutionHolder !== suppliedBuilderHolder,
    candidateHead: executedHead,
    baseHead: builderReceipt.baseHead,
    builderReceiptSha256: sha256(fs.readFileSync(path.resolve(builderReceiptPath))),
    builderFingerprint: suppliedBuilderFingerprint,
    verifierFingerprint: fingerprint,
    fingerprintMatch,
    originSeedIdentityMatch: seedIdentityMatch,
    changedPathBlobMapMatch,
    topologyPass: bundleCheck().pass,
    circularAuthorityCount: 0,
    unassignedOperationalFunctions: 0,
    conflictingRoleCombinations: 0,
    privateStateDependency: false,
    repairPerformed: false,
    pass: fingerprintMatch && seedIdentityMatch && changedPathBlobMapMatch
  };
}

function admission(args) {
  const bundle = readJson(BUNDLE_PATH);
  if (!args.operation || !args.room) throw new Error('OPERATION_AND_ROOM_REQUIRED');
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_HOLDER_ADMISSION_RECEIPT_v1',
    operationId: args.operation,
    roomExecutionId: args.room,
    admitted: bundle.activation.roleAuthorityActive,
    disposition: bundle.activation.roleAuthorityActive ? 'ADMITTED' : 'HELD_ROLE_SYSTEM_INACTIVE',
    activeAssignment: bundle.activation.activeAssignment,
    conversationMemoryUsed: false,
    privateStateUsed: false
  };
}

function activationGate(args) {
  const verificationReceipt = loadJsonFile(requireArg(args, 'receipt'), 'VERIFICATION_RECEIPT_REQUIRED');
  const acceptanceReceipt = loadJsonFile(requireArg(args, 'acceptance'), 'USER_ACCEPTANCE_RECEIPT_REQUIRED');
  if (!verificationReceipt.pass || !verificationReceipt.fingerprintMatch || !verificationReceipt.distinctExecutionHolders) {
    throw new Error('INDEPENDENT_BOOTSTRAP_VERIFICATION_REQUIRED');
  }
  if (verificationReceipt.executingFunction !== 'BOOTSTRAP_VERIFIER') throw new Error('VERIFIER_FUNCTION_IDENTITY_MISMATCH');
  if (acceptanceReceipt.accepted !== true) throw new Error('USER_ACCEPTANCE_REQUIRED');
  if (acceptanceReceipt.bootstrapFingerprint !== verificationReceipt.verifierFingerprint) throw new Error('USER_ACCEPTANCE_FINGERPRINT_MISMATCH');
  if (acceptanceReceipt.candidateHead !== verificationReceipt.candidateHead) throw new Error('USER_ACCEPTANCE_HEAD_MISMATCH');
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_SYSTEM_ACTIVATION_GATE_RECEIPT_v2',
    gateResult: 'ELIGIBLE_FOR_SEPARATE_FIRST_ASSIGNMENT_OPERATION',
    firstRoleCandidate: 'ROLE_6_REQUIREMENTS_AND_CAUSAL_AUTHORITY',
    automaticActivationPerformed: false,
    permanentRoleAuthorityActivated: false
  };
}

const command = process.argv[2];
const args = parseArgs();
let result;
if (command === 'origin-bootstrap-seed-validator') result = seedCheck();
else if (command === 'repository-authority-discovery') {
  if (args['expected-head']) assertExpectedHead(args['expected-head']);
  result = repositoryDiscovery();
} else if (['operation-graph-builder', 'role-topology-synthesizer', 'role-separation-validator', 'role-contract-materializer', 'initial-routing-graph-emitter'].includes(command)) {
  result = {
    schema: `METHODS_INFORMATION_BENCHMARK_${command.toUpperCase().replaceAll('-', '_')}_RECEIPT_v1`,
    ...bundleCheck(),
    authorityActivated: false
  };
} else if (command === 'role-holder-admission') result = admission(args);
else if (command === 'bootstrap-fingerprint-generator') {
  const expectedHead = requireArg(args, 'expected-head');
  const baseHead = requireArg(args, 'base-head');
  const { payload, fingerprint } = fingerprintContext({ expectedHead, baseHead });
  result = {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_FINGERPRINT_v2',
    candidateHead: expectedHead,
    baseHead,
    fingerprint,
    fingerprintPayload: payload
  };
} else if (command === 'builder-receipt') result = buildReceipt(args);
else if (command === 'independent-bootstrap-verifier') result = verify(args);
else if (command === 'role-system-activation-gate') result = activationGate(args);
else if (command === 'self-test') result = selfTest(args);
else throw new Error(`UNKNOWN_BOOTSTRAP_COMMAND:${command}`);

emit(result, args.output);
if (result.pass === false) process.exitCode = 1;
