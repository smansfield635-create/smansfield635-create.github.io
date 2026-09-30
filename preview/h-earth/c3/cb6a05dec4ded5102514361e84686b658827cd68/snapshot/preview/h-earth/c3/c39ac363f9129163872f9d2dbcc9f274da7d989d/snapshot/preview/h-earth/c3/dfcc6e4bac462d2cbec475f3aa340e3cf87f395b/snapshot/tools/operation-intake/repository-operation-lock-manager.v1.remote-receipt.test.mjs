import test from 'node:test';
import assert from 'node:assert/strict';
import {
  closeRemote,
  scopeHash
} from './repository-operation-lock-manager.v1.mjs';

const SCOPE = 'TEST:REMOTE:CLOSURE:RECEIPT:V1';
const OPERATION_ID = 'REMOTE_RECEIPT_SCHEMA_REGRESSION_v1';
const LOCK_GENERATION = 7;
const HEAD = 'a'.repeat(40);
const OBSERVED_BLOB = 'b'.repeat(40);
const COMMITTED_BLOB = 'c'.repeat(40);
const COMMIT = 'd'.repeat(40);

function response(status, value) {
  return {
    status,
    async text() {
      return JSON.stringify(value);
    }
  };
}

function ledgerFixture() {
  const hash = scopeHash(SCOPE);
  const lock = {
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    operationId: OPERATION_ID,
    lockScope: SCOPE,
    scopeHash: hash,
    state: 'ADMITTED_LOCKED',
    governingHead: 'e'.repeat(40),
    requestDigest: 'f'.repeat(64),
    procedureLocatorDigest: '1'.repeat(64),
    lockGeneration: LOCK_GENERATION,
    released: false
  };
  return {
    schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
    lockGeneration: LOCK_GENERATION,
    activeScopes: { [hash]: lock },
    terminalHistory: []
  };
}

test('closeRemote preserves the remote closure receipt schema after local receipt composition', async () => {
  const ledger = ledgerFixture();
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method ?? 'GET' });
    if (calls.length === 1) return response(200, { object: { sha: HEAD } });
    if (calls.length === 2) {
      return response(200, {
        sha: OBSERVED_BLOB,
        content: Buffer.from(JSON.stringify(ledger)).toString('base64')
      });
    }
    if (calls.length === 3) {
      return response(200, {
        commit: { sha: COMMIT },
        content: { sha: COMMITTED_BLOB }
      });
    }
    throw new Error(`UNEXPECTED_FETCH_CALL:${calls.length}`);
  };

  try {
    const receipt = await closeRemote({
      repository: 'example/repository',
      token: 'test-token',
      operationId: OPERATION_ID,
      lockScope: SCOPE,
      lockGeneration: LOCK_GENERATION,
      terminalDisposition: 'PASS_CLOSED'
    });

    assert.equal(receipt.schema, 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1');
    assert.equal(receipt.result, 'TERMINAL_CLOSURE_COMMITTED');
    assert.equal(receipt.operationId, OPERATION_ID);
    assert.equal(receipt.lockScope, SCOPE);
    assert.equal(receipt.lockGeneration, LOCK_GENERATION);
    assert.equal(receipt.terminalDisposition, 'PASS_CLOSED');
    assert.equal(receipt.lockReleased, true);
    assert.equal(receipt.observedBranchHead, HEAD);
    assert.equal(receipt.observedLedgerBlobSha, OBSERVED_BLOB);
    assert.equal(receipt.committedLedgerBlobSha, COMMITTED_BLOB);
    assert.equal(receipt.closureCommitSha, COMMIT);
    assert.equal(calls.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
