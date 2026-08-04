import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const PACKAGE = 'control-plane/methods-information-benchmark/assignment-infrastructure';
export const MANIFEST_PATH = `${PACKAGE}/manifest.v1.json`;
export const FIXTURES_PATH = `${PACKAGE}/negative-fixtures.v1.json`;

export const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : (value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
      : value);
export const canonical = (value) => JSON.stringify(stable(value));
export const sha256Bytes = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const hashObject = (value) => sha256Bytes(Buffer.from(canonical(value), 'utf8'));
export const readJson = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
export const readRepoJson = (relativePath) => readJson(path.join(ROOT, relativePath));

export function fail(code, detail = '') { throw new Error(detail ? `${code}:${detail}` : code); }
export function required(args, key) {
  const value = args[key];
  if (typeof value !== 'string' || !value.trim()) fail('REQUIRED_ARGUMENT_MISSING', key);
  return value.trim();
}
export function boolArg(value) { return value === true || value === 'true'; }
export function parseArgs(argv = process.argv.slice(3)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) { args[token.slice(2)] = next; i += 1; }
    else args[token.slice(2)] = true;
  }
  return args;
}
export function emit(value, output) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (!output) return process.stdout.write(text);
  const target = path.resolve(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, 'utf8');
}

const gitText = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const gitBytes = (...args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
export function currentHead() { return gitText('rev-parse', 'HEAD^{commit}'); }
export function assertExactCleanHead(expectedHead) {
  const actual = currentHead();
  if (actual !== expectedHead) fail('EXACT_HEAD_MISMATCH', `${expectedHead}:${actual}`);
  if (gitText('status', '--porcelain')) fail('DIRTY_WORKTREE');
  return actual;
}
function blobIdentity(relativePath, head) {
  return {
    path: relativePath,
    gitBlob: gitText('rev-parse', `${head}:${relativePath}`),
    sha256: sha256Bytes(gitBytes('show', `${head}:${relativePath}`))
  };
}
export function infrastructureFingerprint(expectedHead, baseHead) {
  const candidateHead = assertExactCleanHead(expectedHead);
  gitText('merge-base', '--is-ancestor', baseHead, candidateHead);
  const manifest = readRepoJson(MANIFEST_PATH);
  const actual = gitText('diff', '--name-only', baseHead, candidateHead).split(/\r?\n/).filter(Boolean).sort();
  const expected = [...manifest.expectedChangedPaths].sort();
  if (canonical(actual) !== canonical(expected)) {
    fail('CHANGED_PATH_SET_MISMATCH', canonical({
      missing: expected.filter((item) => !actual.includes(item)),
      unexpected: actual.filter((item) => !expected.includes(item))
    }));
  }
  for (const relativePath of actual) {
    if (!relativePath.startsWith(`${PACKAGE}/`) && relativePath !== '.github/workflows/methods-information-benchmark-generic-first-assignment-infrastructure.yml') {
      fail('NONINFRASTRUCTURE_PATH_MUTATION', relativePath);
    }
  }
  const payload = {
    schema: 'METHODS_INFORMATION_BENCHMARK_GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_FINGERPRINT_PAYLOAD_v1',
    candidateHead,
    baseHead,
    canonicalGenesisCandidateHead: manifest.canonicalGenesisCandidateHead,
    canonicalBootstrapFingerprint: manifest.canonicalBootstrapFingerprint,
    changedPathBlobMap: actual.map((item) => blobIdentity(item, candidateHead)),
    environmentClass: {
      nodeMajorVersion: Number(process.versions.node.split('.')[0]),
      operatingSystemClass: process.platform,
      architectureClass: process.arch
    },
    normalization: {
      excludes: ['TEMP_PATHS', 'PROCESS_IDS', 'WALL_CLOCK_TIMESTAMPS', 'EXECUTION_HOLDER_VALUES'],
      includes: ['CANDIDATE_HEAD', 'BASE_HEAD', 'EXACT_CHANGED_PATH_BLOB_MAP', 'NODE_MAJOR_VERSION', 'OPERATING_SYSTEM_CLASS', 'ARCHITECTURE_CLASS']
    }
  };
  return { payload, fingerprint: hashObject(payload) };
}

function ledgerPayload(ledger) {
  return {
    schema: ledger.schema,
    genesisCandidateHead: ledger.genesisCandidateHead,
    bootstrapFingerprint: ledger.bootstrapFingerprint,
    revision: ledger.revision,
    assignments: ledger.assignments
  };
}
export function computeLedgerHead(ledger) { return hashObject(ledgerPayload(ledger)); }
export function initializeLedger(genesisCandidateHead, bootstrapFingerprint) {
  if (!/^[0-9a-f]{40}$/.test(genesisCandidateHead)) fail('INVALID_GENESIS_HEAD');
  if (!/^[0-9a-f]{64}$/.test(bootstrapFingerprint)) fail('INVALID_BOOTSTRAP_FINGERPRINT');
  const ledger = {
    schema: 'METHODS_INFORMATION_BENCHMARK_FIRST_ASSIGNMENT_LEDGER_v1',
    genesisCandidateHead,
    bootstrapFingerprint,
    revision: 0,
    ledgerHead: '',
    assignments: []
  };
  ledger.ledgerHead = computeLedgerHead(ledger);
  return ledger;
}
export function validateLedger(ledger) {
  if (ledger.schema !== 'METHODS_INFORMATION_BENCHMARK_FIRST_ASSIGNMENT_LEDGER_v1') fail('LEDGER_SCHEMA_MISMATCH');
  if (computeLedgerHead(ledger) !== ledger.ledgerHead) fail('LEDGER_INTERNAL_HEAD_MISMATCH');
  if (!Array.isArray(ledger.assignments) || ledger.assignments.length > 1) fail('LEDGER_ASSIGNMENT_CARDINALITY_INVALID');
}
function validateEligibility(receipt, testMode) {
  if (receipt.schema !== 'METHODS_INFORMATION_BENCHMARK_ROLE_SYSTEM_ACTIVATION_GATE_RECEIPT_v2') fail('ACTIVATION_ELIGIBILITY_SCHEMA_MISMATCH');
  if (receipt.gateResult !== 'ELIGIBLE_FOR_SEPARATE_FIRST_ASSIGNMENT_OPERATION') fail('ACTIVATION_ELIGIBILITY_REQUIRED');
  if (typeof receipt.firstRoleCandidate !== 'string' || !receipt.firstRoleCandidate) fail('FIRST_ROLE_CANDIDATE_MISSING');
  if (receipt.automaticActivationPerformed !== false || receipt.permanentRoleAuthorityActivated !== false) fail('ELIGIBILITY_RECEIPT_AUTHORITY_BOUNDARY_MISMATCH');
  if (!testMode && receipt.testFixture === true) fail('TEST_FIXTURE_PROHIBITED_IN_PRODUCTION');
}
function validateOperationPacket(packet) {
  if (packet.schema !== 'METHODS_INFORMATION_BENCHMARK_BOUNDED_OPERATION_PACKET_v1') fail('OPERATION_PACKET_SCHEMA_MISMATCH');
  for (const field of ['packetId', 'roleId', 'operationId', 'purpose']) {
    if (typeof packet[field] !== 'string' || !packet[field]) fail('OPERATION_PACKET_REQUIRED_FIELD', field);
  }
  if (!Array.isArray(packet.outputs) || packet.outputs.length === 0) fail('OPERATION_PACKET_OUTPUTS_REQUIRED');
  if (packet.returnRequired !== true) fail('OPERATION_PACKET_RETURN_REQUIRED');
  if (packet.productMutationAllowed !== false) fail('OPERATION_PACKET_PRODUCT_MUTATION_FORBIDDEN');
  if (packet.selfRatificationAllowed !== false) fail('OPERATION_PACKET_SELF_RATIFICATION_FORBIDDEN');
  if (packet.scopeExpansionAllowed !== false) fail('OPERATION_PACKET_SCOPE_EXPANSION_FORBIDDEN');
  if (packet.mergeAllowed !== false) fail('OPERATION_PACKET_MERGE_FORBIDDEN');
}
function validateAuthorization(auth, context, testMode) {
  if (auth.schema !== 'METHODS_INFORMATION_BENCHMARK_ATOMIC_ASSIGNMENT_AUTHORIZATION_RECEIPT_v1') fail('ASSIGNMENT_AUTHORIZATION_SCHEMA_MISMATCH');
  if (auth.originAuthority !== 'USER' || auth.authorized !== true) fail('USER_ASSIGNMENT_AUTHORIZATION_REQUIRED');
  if (testMode && auth.fixtureOnly !== true) fail('TEST_MODE_REQUIRES_FIXTURE_AUTHORIZATION');
  if (!testMode && auth.fixtureOnly === true) fail('TEST_FIXTURE_PROHIBITED_IN_PRODUCTION');
  for (const [field, value] of Object.entries(context)) if (auth[field] !== value) fail('AUTHORIZATION_BINDING_MISMATCH', field);
}

export function createFirstAssignment({ ledger, expectedHead, eligibility, packet, authorization, holderExecutionId, testMode }) {
  validateLedger(ledger);
  if (ledger.ledgerHead !== expectedHead) fail('STALE_ASSIGNMENT_LEDGER_HEAD');
  if (ledger.revision !== 0 || ledger.assignments.length !== 0) fail('FIRST_ASSIGNMENT_ALREADY_EXISTS');
  validateEligibility(eligibility, testMode);
  validateOperationPacket(packet);
  if (packet.roleId !== eligibility.firstRoleCandidate) fail('FIRST_ROLE_CANDIDATE_MISMATCH');
  if (!holderExecutionId) fail('HOLDER_EXECUTION_ID_REQUIRED');
  const context = {
    roleId: packet.roleId,
    operationId: packet.operationId,
    holderExecutionId,
    eligibilityReceiptSha256: hashObject(eligibility),
    operationPacketSha256: hashObject(packet)
  };
  validateAuthorization(authorization, context, testMode);
  if (authorization.genesisCandidateHead != null && ledger.genesisCandidateHead !== authorization.genesisCandidateHead) fail('AUTHORIZATION_GENESIS_HEAD_MISMATCH');
  if (authorization.bootstrapFingerprint != null && ledger.bootstrapFingerprint !== authorization.bootstrapFingerprint) fail('AUTHORIZATION_BOOTSTRAP_FINGERPRINT_MISMATCH');
  const assignment = {
    assignmentId: hashObject({ ledgerHead: ledger.ledgerHead, ...context }).slice(0, 24),
    ...context,
    predecessorLedgerHead: ledger.ledgerHead,
    returnRequired: true,
    status: testMode ? 'ACTIVE_TEST_ONLY' : 'ACTIVE'
  };
  ledger.revision = 1;
  ledger.assignments = [assignment];
  ledger.ledgerHead = computeLedgerHead(ledger);
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_FIRST_ROLE_ASSIGNMENT_RECEIPT_v1',
    status: testMode ? 'PASS_TEST_MODE_ASSIGNMENT' : 'PASS_OPERATION_SCOPED_ACTIVE_ASSIGNMENT',
    assignment,
    assignmentHead: ledger.ledgerHead,
    ledgerRevision: ledger.revision,
    assignmentAuthorityActive: !testMode,
    automaticAdditionalRoleActivation: false,
    productMutationPerformed: false,
    mergePerformed: false
  };
}

export function admitAssignment({ ledger, expectedHead, assignmentReceipt, roleId, operationId, holderExecutionId, testMode }) {
  validateLedger(ledger);
  if (ledger.ledgerHead !== expectedHead) fail('STALE_ASSIGNMENT_LEDGER_HEAD');
  if (assignmentReceipt.schema !== 'METHODS_INFORMATION_BENCHMARK_FIRST_ROLE_ASSIGNMENT_RECEIPT_v1') fail('ASSIGNMENT_RECEIPT_SCHEMA_MISMATCH');
  const assignment = ledger.assignments[0];
  if (!assignment || assignment.assignmentId !== assignmentReceipt.assignment?.assignmentId || assignment.roleId !== roleId || assignment.operationId !== operationId || assignment.holderExecutionId !== holderExecutionId) fail('ACTIVE_ASSIGNMENT_NOT_FOUND');
  if (testMode && assignment.status !== 'ACTIVE_TEST_ONLY') fail('TEST_MODE_ASSIGNMENT_STATUS_MISMATCH');
  if (!testMode && assignment.status !== 'ACTIVE') fail('PRODUCTION_ASSIGNMENT_STATUS_MISMATCH');
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_HOLDER_ADMISSION_RECEIPT_v1',
    assignmentId: assignment.assignmentId,
    roleId,
    operationId,
    holderExecutionId,
    admitted: true,
    disposition: testMode ? 'ADMITTED_TEST_ONLY' : 'ADMITTED_OPERATION_SCOPED',
    assignmentAuthorityActive: !testMode,
    conversationMemoryUsed: false,
    privateStateUsed: false
  };
}
function validateReturnPacket(packet, testMode) {
  if (packet.schema !== 'METHODS_INFORMATION_BENCHMARK_ROLE_OPERATION_RETURN_v1') fail('RETURN_PACKET_INVALID');
  for (const field of ['assignmentId', 'roleId', 'operationId', 'holderExecutionId']) if (!packet[field]) fail('RETURN_PACKET_INVALID', field);
  if (!['PASS_RETURN', 'HELD_RETURN', 'FAIL_RETURN'].includes(packet.disposition)) fail('RETURN_PACKET_INVALID', 'disposition');
  if (!/^[0-9a-f]{64}$/.test(packet.outputManifestSha256 ?? '')) fail('RETURN_PACKET_INVALID', 'outputManifestSha256');
  if (testMode && packet.fixtureOnly !== true) fail('TEST_MODE_REQUIRES_FIXTURE_RETURN');
  if (!testMode && packet.fixtureOnly === true) fail('TEST_FIXTURE_PROHIBITED_IN_PRODUCTION');
}
export function returnAssignment({ ledger, expectedHead, assignmentReceipt, returnPacket, testMode }) {
  validateLedger(ledger);
  if (ledger.ledgerHead !== expectedHead) fail('STALE_ASSIGNMENT_LEDGER_HEAD');
  validateReturnPacket(returnPacket, testMode);
  const assignment = ledger.assignments[0];
  if (!assignment || assignment.assignmentId !== assignmentReceipt.assignment?.assignmentId || assignment.assignmentId !== returnPacket.assignmentId || assignment.roleId !== returnPacket.roleId || assignment.operationId !== returnPacket.operationId || assignment.holderExecutionId !== returnPacket.holderExecutionId) fail('ACTIVE_ASSIGNMENT_NOT_FOUND');
  if (assignment.status !== (testMode ? 'ACTIVE_TEST_ONLY' : 'ACTIVE')) fail('ACTIVE_ASSIGNMENT_NOT_FOUND');
  assignment.status = testMode ? 'RETURNED_TEST_ONLY' : 'RETURNED';
  assignment.returnDisposition = returnPacket.disposition;
  assignment.outputManifestSha256 = returnPacket.outputManifestSha256;
  ledger.revision = 2;
  ledger.ledgerHead = computeLedgerHead(ledger);
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_ASSIGNMENT_RETURN_RECEIPT_v1',
    status: testMode ? 'PASS_TEST_MODE_RETURNED' : 'PASS_OPERATION_ASSIGNMENT_RETURNED',
    assignmentId: assignment.assignmentId,
    roleId: assignment.roleId,
    operationId: assignment.operationId,
    holderExecutionId: assignment.holderExecutionId,
    disposition: returnPacket.disposition,
    assignmentHead: ledger.ledgerHead,
    ledgerRevision: ledger.revision,
    assignmentAuthorityActive: false,
    outputAdopted: false,
    nextRoleAssignmentPerformed: false,
    mergePerformed: false
  };
}
export function withLedgerLock(ledgerPath, callback) {
  const lockPath = `${ledgerPath}.lock`;
  let handle;
  try { handle = fs.openSync(lockPath, 'wx'); } catch { fail('CONCURRENT_ASSIGNMENT_LEDGER_UPDATE_LOCKED'); }
  try { return callback(); } finally { fs.closeSync(handle); fs.unlinkSync(lockPath); }
}
export function writeLedgerAtomically(ledgerPath, ledger) {
  const target = path.resolve(ledgerPath);
  const temporary = `${target}.${process.pid}.tmp`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(temporary, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
  fs.renameSync(temporary, target);
}
