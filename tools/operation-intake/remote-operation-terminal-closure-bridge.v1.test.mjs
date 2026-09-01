import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REPOSITORY,
  REQUEST_SCHEMA,
  validateClosureRequest
} from './remote-operation-terminal-closure-bridge.v1.mjs';
import {
  closeLocal,
  scopeHash
} from './repository-operation-lock-manager.v1.mjs';

const valid = () => ({
  schema: REQUEST_SCHEMA,
  repository: REPOSITORY,
  operationId: 'H_EARTH_EXISTING_OPERATION_v1',
  lockScope: 'TEST:REMOTE_TERMINAL_CLOSURE:V1',
  lockGeneration: 1,
  terminalDisposition: 'PASS_CLOSED'
});

function rejects(mutator, code) {
  const value = valid();
  mutator(value);
  assert.throws(() => validateClosureRequest(value), error => error?.code === code);
}

test('accepts the exact closed request schema', () => {
  assert.deepEqual(validateClosureRequest(valid()), valid());
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
