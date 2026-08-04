import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseArgs, required, emit, readRepoJson, MANIFEST_PATH, FIXTURES_PATH,
  infrastructureFingerprint, initializeLedger, createFirstAssignment,
  admitAssignment, returnAssignment, hashObject, sha256Bytes, canonical
} from './assignment-core.mjs';

function expectFailure(id, callback, prefix) {
  try { callback(); return { id, pass: false, observed: 'NO_FAILURE' }; }
  catch (error) { return { id, pass: String(error.message).startsWith(prefix), observed: error.message }; }
}

function syntheticFixture() {
  const manifest = readRepoJson(MANIFEST_PATH);
  const roleId = 'ROLE_TEST_ALPHA';
  const operationId = 'OPERATION_TEST_ALPHA';
  const holderExecutionId = 'TEST_HOLDER_ALPHA';
  const eligibility = {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_SYSTEM_ACTIVATION_GATE_RECEIPT_v2',
    gateResult: 'ELIGIBLE_FOR_SEPARATE_FIRST_ASSIGNMENT_OPERATION',
    firstRoleCandidate: roleId,
    automaticActivationPerformed: false,
    permanentRoleAuthorityActivated: false,
    testFixture: true
  };
  const packet = {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOUNDED_OPERATION_PACKET_v1',
    packetId: 'TEST_PACKET_ALPHA', roleId, operationId,
    purpose: 'TEST_ONLY_GENERIC_ASSIGNMENT_INFRASTRUCTURE',
    inputs: ['TEST_INPUT'], outputs: ['TEST_OUTPUT'], may: ['TEST_ONLY'],
    mayNot: ['PRODUCT_MUTATION', 'SELF_RATIFICATION', 'MERGE'],
    returnRequired: true, productMutationAllowed: false,
    selfRatificationAllowed: false, scopeExpansionAllowed: false,
    mergeAllowed: false, fixtureOnly: true
  };
  const authorization = {
    schema: 'METHODS_INFORMATION_BENCHMARK_ATOMIC_ASSIGNMENT_AUTHORIZATION_RECEIPT_v1',
    authorizationId: 'TEST_AUTHORIZATION_ALPHA', originAuthority: 'USER', authorized: true,
    roleId, operationId, holderExecutionId,
    eligibilityReceiptSha256: hashObject(eligibility),
    operationPacketSha256: hashObject(packet),
    genesisCandidateHead: manifest.canonicalGenesisCandidateHead,
    bootstrapFingerprint: manifest.canonicalBootstrapFingerprint,
    fixtureOnly: true
  };
  return { manifest, roleId, operationId, holderExecutionId, eligibility, packet, authorization };
}

export function selfTest(expectedHead, baseHead, executionHolder) {
  const f = syntheticFixture();
  const { payload, fingerprint } = infrastructureFingerprint(expectedHead, baseHead);
  const ledger = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
  const initialHead = ledger.ledgerHead;
  const assignmentReceipt = createFirstAssignment({ ledger, expectedHead: initialHead, eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true });
  const admissionReceipt = admitAssignment({ ledger, expectedHead: ledger.ledgerHead, assignmentReceipt, roleId: f.roleId, operationId: f.operationId, holderExecutionId: f.holderExecutionId, testMode: true });
  const returnPacket = {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_OPERATION_RETURN_v1',
    assignmentId: assignmentReceipt.assignment.assignmentId,
    roleId: f.roleId, operationId: f.operationId, holderExecutionId: f.holderExecutionId,
    disposition: 'PASS_RETURN', outputManifestSha256: sha256Bytes(Buffer.from('TEST_OUTPUT_MANIFEST')),
    fixtureOnly: true
  };
  const activeHead = ledger.ledgerHead;
  const returnReceipt = returnAssignment({ ledger, expectedHead: activeHead, assignmentReceipt, returnPacket, testMode: true });
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'mib-assignment-self-test-'));
  fs.writeFileSync(path.join(temp, 'final-ledger.json'), `${JSON.stringify(ledger, null, 2)}\n`);

  const n = [];
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    n.push(expectFailure('STALE_ASSIGNMENT_LEDGER_HEAD', () => createFirstAssignment({ ledger: l, expectedHead: '0'.repeat(64), eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true }), 'STALE_ASSIGNMENT_LEDGER_HEAD'));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    const p = { ...f.packet, roleId: 'ROLE_TEST_BETA' };
    n.push(expectFailure('FIRST_ROLE_CANDIDATE_MISMATCH', () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: p, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true }), 'FIRST_ROLE_CANDIDATE_MISMATCH'));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    const a = { ...f.authorization, authorized: false };
    n.push(expectFailure('USER_ASSIGNMENT_AUTHORIZATION_REQUIRED', () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: a, holderExecutionId: f.holderExecutionId, testMode: true }), 'USER_ASSIGNMENT_AUTHORIZATION_REQUIRED'));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    const a = { ...f.authorization, holderExecutionId: 'OTHER_HOLDER' };
    n.push(expectFailure('AUTHORIZATION_BINDING_MISMATCH', () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: a, holderExecutionId: f.holderExecutionId, testMode: true }), 'AUTHORIZATION_BINDING_MISMATCH'));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true });
    n.push(expectFailure('FIRST_ASSIGNMENT_ALREADY_EXISTS', () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true }), 'FIRST_ASSIGNMENT_ALREADY_EXISTS'));
  }
  for (const [id, field, expected] of [
    ['PRODUCT_MUTATION_FORBIDDEN', 'productMutationAllowed', 'OPERATION_PACKET_PRODUCT_MUTATION_FORBIDDEN'],
    ['SELF_RATIFICATION_FORBIDDEN', 'selfRatificationAllowed', 'OPERATION_PACKET_SELF_RATIFICATION_FORBIDDEN']
  ]) {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    const p = { ...f.packet, [field]: true };
    n.push(expectFailure(id, () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: p, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true }), expected));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    n.push(expectFailure('TEST_FIXTURE_IN_PRODUCTION', () => createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: false }), 'TEST_FIXTURE_PROHIBITED_IN_PRODUCTION'));
  }
  {
    const l = initializeLedger(f.manifest.canonicalGenesisCandidateHead, f.manifest.canonicalBootstrapFingerprint);
    const r = createFirstAssignment({ ledger: l, expectedHead: l.ledgerHead, eligibility: f.eligibility, packet: f.packet, authorization: f.authorization, holderExecutionId: f.holderExecutionId, testMode: true });
    n.push(expectFailure('ADMISSION_WRONG_HOLDER', () => admitAssignment({ ledger: l, expectedHead: l.ledgerHead, assignmentReceipt: r, roleId: f.roleId, operationId: f.operationId, holderExecutionId: 'WRONG_HOLDER', testMode: true }), 'ACTIVE_ASSIGNMENT_NOT_FOUND'));
    n.push(expectFailure('RETURN_WRONG_ASSIGNMENT', () => returnAssignment({ ledger: l, expectedHead: l.ledgerHead, assignmentReceipt: r, returnPacket: { ...returnPacket, assignmentId: 'WRONG' }, testMode: true }), 'ACTIVE_ASSIGNMENT_NOT_FOUND'));
    n.push(expectFailure('STALE_RETURN_LEDGER_HEAD', () => returnAssignment({ ledger: l, expectedHead: '0'.repeat(64), assignmentReceipt: r, returnPacket: { ...returnPacket, assignmentId: r.assignment.assignmentId }, testMode: true }), 'STALE_ASSIGNMENT_LEDGER_HEAD'));
    n.push(expectFailure('INVALID_RETURN_PACKET', () => returnAssignment({ ledger: l, expectedHead: l.ledgerHead, assignmentReceipt: r, returnPacket: { ...returnPacket, assignmentId: r.assignment.assignmentId, outputManifestSha256: 'bad' }, testMode: true }), 'RETURN_PACKET_INVALID'));
  }
  const declared = readRepoJson(FIXTURES_PATH).fixtures.map((x) => x.id).sort();
  if (canonical(declared) !== canonical(n.map((x) => x.id).sort())) throw new Error('NEGATIVE_FIXTURE_REGISTRY_MISMATCH');
  const pass = assignmentReceipt.status === 'PASS_TEST_MODE_ASSIGNMENT' && admissionReceipt.admitted && returnReceipt.status === 'PASS_TEST_MODE_RETURNED' && n.every((x) => x.pass);
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_SELF_TEST_RECEIPT_v1',
    executingFunction: 'GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_BUILDER_TEST',
    executionHolder, candidateHead: expectedHead, baseHead,
    infrastructureFingerprint: fingerprint, fingerprintPayloadDigest: hashObject(payload),
    positive: {
      initializationPass: initialHead.length === 64,
      testAssignmentPass: assignmentReceipt.status === 'PASS_TEST_MODE_ASSIGNMENT',
      testAdmissionPass: admissionReceipt.admitted,
      testReturnPass: returnReceipt.status === 'PASS_TEST_MODE_RETURNED',
      finalLedgerRevision: ledger.revision,
      finalAssignmentStatus: ledger.assignments[0].status
    },
    negative: n, negativeFixtureCount: n.length,
    productionAssignmentPerformed: false, permanentRoleAuthorityActivated: false,
    roleIdentityBound: false, operationIdentityBound: false,
    candidateMutationPerformed: false, productMutationPerformed: false,
    mergePerformed: false, pass
  };
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const result = selfTest(required(args, 'expected-head'), required(args, 'base-head'), required(args, 'execution-holder'));
  emit(result, args.output);
  if (!result.pass) process.exitCode = 1;
}
