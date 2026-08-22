import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REPOSITORY,
  REQUEST_SCHEMA,
  validateClosureRequest
} from './remote-operation-terminal-closure-bridge.v1.mjs';

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
