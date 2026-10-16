import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INVOCATION_SCHEMA,
  REPOSITORY,
  REQUEST_SCHEMA,
  normalizeClosureInput,
  validateClosureRequest
} from './remote-operation-terminal-closure-bridge.v1.mjs';
import {
  canonical,
  closeLocal,
  scopeHash,
  sha,
  verifyOwnerConnectedAuthorityProvenance
} from './repository-operation-lock-manager.v1.mjs';

const valid = () => ({
  schema: REQUEST_SCHEMA,
  repository: REPOSITORY,
  operationId: 'H_EARTH_EXISTING_OPERATION_v1',
  lockScope: 'TEST:REMOTE_TERMINAL_CLOSURE:V1',
  lockGeneration: 1,
  terminalDisposition: 'PASS_CLOSED'
});
const invocation = (expectedMainHead = 'a'.repeat(40)) => ({
  schema: INVOCATION_SCHEMA,
  repository: REPOSITORY,
  expectedMainHead,
  closureRequest: valid()
});

function rejects(mutator, code) {
  const value = valid();
  mutator(value);
  assert.throws(() => validateClosureRequest(value), error => error?.code === code);
}
function rejectsInvocation(mutator, code) {
  const value = invocation();
  mutator(value);
  assert.throws(() => normalizeClosureInput(value), error => error?.code === code);
}

const ownerAdmissionFixture = () => {
  const lock = {
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    operationId: 'TEST_OWNER_CONNECTOR_OPERATION_001',
    lockScope: 'TEST:OWNER_CONNECTOR_AUTHORITY:V1',
    scopeHash: scopeHash('TEST:OWNER_CONNECTOR_AUTHORITY:V1'),
    state: 'ADMITTED_LOCKED',
    governingHead: 'a'.repeat(40),
    requestDigest: 'b'.repeat(64),
    procedureLocatorDigest: 'c'.repeat(64),
    lockGeneration: 12,
    released: false
  };
  const source = {
    repository: REPOSITORY,
    issueNumber: 42,
    commentId: 4201,
    commentBodySha256: 'd'.repeat(64),
    authorLogin: 'smansfield635-create',
    authorAssociation: 'OWNER',
    marker: 'CANONICAL_OPERATION_INTAKE_REQUEST_V1'
  };
  const authorityIdentity = {
    operationId: lock.operationId,
    lockScope: lock.lockScope,
    scopeHash: lock.scopeHash,
    governingHead: lock.governingHead,
    requestDigest: lock.requestDigest,
    procedureLocatorDigest: lock.procedureLocatorDigest,
    lockGeneration: lock.lockGeneration
  };
  const core = {
    schema: 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PROVENANCE_v1',
    transportId: 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1',
    source,
    authorityIdentity,
    compareAndSwap: { observedLedgerBlobSha: 'e'.repeat(40), observedLockRefHead: 'f'.repeat(40) }
  };
  lock.independentAuthorityProvenance = { ...core, bindingDigest: sha(canonical(core)) };
  return lock;
};

test('verifies owner-connected intake provenance for terminal closure', async () => {
  const lock = ownerAdmissionFixture();
  const result = await verifyOwnerConnectedAuthorityProvenance(lock);
  assert.equal(result.result, 'OWNER_CONNECTOR_PROVENANCE_VERIFIED');
  assert.equal(result.authorityIdentity.operationId, lock.operationId);
});

test('rejects tampered owner-connected intake provenance for terminal closure', async () => {
  const lock = ownerAdmissionFixture();
  lock.independentAuthorityProvenance.source.commentId++;
  await assert.rejects(
    () => verifyOwnerConnectedAuthorityProvenance(lock),
    error => error?.code === 'OWNER_CONNECTOR_PROVENANCE_BINDING_MISMATCH'
  );
});

test('accepts the exact closed request schema', () => {
  assert.deepEqual(validateClosureRequest(valid()), valid());
});

test('normalizes owner invocation envelope to canonical closure request', () => {
  const value = invocation('b'.repeat(40));
  const normalized = normalizeClosureInput(value);
  assert.equal(normalized.inputShape, 'OWNER_INVOCATION_ENVELOPE');
  assert.equal(normalized.expectedMainHeadContext, 'b'.repeat(40));
  assert.equal(normalized.currentMainBindingRequired, false);
  assert.deepEqual(normalized.request, valid());
});

test('preserves legacy direct six-field compatibility', () => {
  const normalized = normalizeClosureInput(valid());
  assert.equal(normalized.inputShape, 'LEGACY_DIRECT_CLOSURE_REQUEST');
  assert.equal(normalized.expectedMainHeadContext, null);
  assert.equal(normalized.currentMainBindingRequired, false);
  assert.deepEqual(normalized.request, valid());
});

test('treats stale expected main as observational context only', () => {
  const oldHead = '1'.repeat(40);
  const normalized = normalizeClosureInput(invocation(oldHead));
  assert.equal(normalized.expectedMainHeadContext, oldHead);
  assert.equal(normalized.currentMainBindingRequired, false);
});

test('rejects malformed expected-main context', () => {
  rejectsInvocation(value => { value.expectedMainHead = 'bad'; }, 'EXPECTED_MAIN_HEAD_INVALID');
});

test('rejects extra owner-invocation fields', () => {
  rejectsInvocation(value => { value.command = 'echo unsafe'; }, 'INVOCATION_SCHEMA_OR_KEYSET_INVALID');
});

test('accepts mutation-closed evidence-continuation disposition', () => {
  const request = valid();
  request.terminalDisposition = 'MUTATION_CLOSED_EVIDENCE_CONTINUES';
  assert.equal(validateClosureRequest(request).terminalDisposition, 'MUTATION_CLOSED_EVIDENCE_CONTINUES');
});

test('mutation-closed evidence-continuation releases scope and preserves terminal history', () => {
  const lockScope = 'TEST:MUTATION_CLOSED_EVIDENCE_CONTINUES:V1';
  const key = scopeHash(lockScope);
  const lock = {
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    operationId: 'TEST_MUTATION_EARLY_RELEASE_001',
    lockScope,
    scopeHash: key,
    state: 'ADMITTED_LOCKED',
    governingHead: 'a'.repeat(40),
    requestDigest: 'b'.repeat(64),
    procedureLocatorDigest: 'c'.repeat(64),
    lockGeneration: 7,
    released: false
  };
  const source = {
    schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
    lockGeneration: 7,
    activeScopes: { [key]: lock },
    terminalHistory: []
  };
  const result = closeLocal(source, {
    operationId: lock.operationId,
    lockScope,
    lockGeneration: 7,
    terminalDisposition: 'MUTATION_CLOSED_EVIDENCE_CONTINUES'
  });
  assert.equal(result.receipt.lockReleased, true);
  assert.equal(result.receipt.terminalHistoryPreserved, true);
  assert.equal(result.ledger.activeScopes[key], undefined);
  assert.equal(result.ledger.terminalHistory.at(-1).terminalDisposition, 'MUTATION_CLOSED_EVIDENCE_CONTINUES');
  assert.equal(result.ledger.terminalHistory.at(-1).released, true);
});

test('preserves existing lowercase operation identifiers', () => {
  const request = valid();
  assert.equal(validateClosureRequest(request).operationId, 'H_EARTH_EXISTING_OPERATION_v1');
});

test('rejects repository substitution', () => {
  rejects(value => { value.repository = 'other/repository'; }, 'REPOSITORY_SUBSTITUTION_PROHIBITED');
});

test('rejects repository substitution in owner invocation', () => {
  rejectsInvocation(value => { value.repository = 'other/repository'; }, 'REPOSITORY_SUBSTITUTION_PROHIBITED');
});

test('rejects noncanonical lock scope', () => {
  rejects(value => { value.lockScope = 'test:remote_terminal_closure:v1'; }, 'LOCK_SCOPE_NOT_CANONICAL');
});

test('rejects invalid generation', () => {
  rejects(value => { value.lockGeneration = 0; }, 'LOCK_GENERATION_INVALID');
});

test('rejects unsupported terminal disposition', () => {
  rejects(value => { value.terminalDisposition = 'PASS'; }, 'TERMINAL_DISPOSITION_INVALID');
});

test('rejects command injection fields by closed keyset', () => {
  rejects(value => { value.command = 'echo unsafe'; }, 'REQUEST_SCHEMA_OR_KEYSET_INVALID');
});

test('rejects missing identity fields', () => {
  rejects(value => { delete value.operationId; }, 'REQUEST_SCHEMA_OR_KEYSET_INVALID');
});
