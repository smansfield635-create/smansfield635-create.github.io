#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  canonical,
  scopeHash,
  sha,
  stable
} from './repository-operation-lock-manager.v1.mjs';
import {
  planOwnerConnectorTerminalClosure,
  MARKER,
  INVOCATION_SCHEMA,
  CLOSURE_SCHEMA,
  REPOSITORY,
  TRANSPORT_ID
} from './owner-connector-canonical-terminal-closure.v1.mjs';
import { verifyOwnerTerminalClosureProvenance } from './repository-operation-lock-lineage.v2.mjs';

const MAIN = 'e0fc91f3c30a1486754d616ccd56682ba697649f';
const LEDGER_BLOB = '1111111111111111111111111111111111111111';
const LOCK_REF_HEAD = '2222222222222222222222222222222222222222';
const operationId = 'SELF_TEST_TERMINAL_CLOSURE_OPERATION';
const lockScope = 'REPOSITORY:SELF_TEST_TERMINAL_CLOSURE:V1';
const hash = scopeHash(lockScope);
const generation = 99;
const activeLock = stable({
  schema: 'REPOSITORY_OPERATION_LOCK_v1',
  operationId,
  lockScope,
  scopeHash: hash,
  state: 'ADMITTED_LOCKED',
  governingHead: '3333333333333333333333333333333333333333',
  requestDigest: '4'.repeat(64),
  procedureLocatorDigest: '5'.repeat(64),
  lockGeneration: generation,
  released: false
});
const authorityCore = stable({
  schema: 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PROVENANCE_v1',
  transportId: 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1',
  source: {
    repository: REPOSITORY,
    issueNumber: 1,
    commentId: 1,
    authorLogin: 'smansfield635-create',
    authorAssociation: 'OWNER',
    commentBodySha256: '6'.repeat(64),
    marker: 'CANONICAL_OPERATION_INTAKE_REQUEST_V1'
  },
  authorityIdentity: {
    operationId,
    lockScope,
    scopeHash: hash,
    governingHead: activeLock.governingHead,
    requestDigest: activeLock.requestDigest,
    procedureLocatorDigest: activeLock.procedureLocatorDigest,
    lockGeneration: generation
  },
  compareAndSwap: {
    observedLedgerBlobSha: '7'.repeat(40),
    observedLockRefHead: '8'.repeat(40)
  }
});
const lock = stable({
  ...activeLock,
  independentAuthorityProvenance: stable({ ...authorityCore, bindingDigest: sha(canonical(authorityCore)) })
});
const ledger = stable({
  schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
  lockGeneration: generation,
  activeScopes: { [hash]: lock },
  terminalHistory: []
});
const closureRequest = stable({
  schema: CLOSURE_SCHEMA,
  repository: REPOSITORY,
  operationId,
  lockScope,
  lockGeneration: generation,
  terminalDisposition: 'PASS_CLOSED'
});
function sourceFor(request = closureRequest, overrides = {}) {
  const envelope = stable({
    schema: INVOCATION_SCHEMA,
    repository: REPOSITORY,
    expectedMainHead: MAIN,
    closureRequest: request
  });
  return {
    id: 12345,
    issueNumber: 2292,
    user: { login: 'smansfield635-create' },
    author_association: 'OWNER',
    body: `${MARKER}\n${JSON.stringify(envelope)}`,
    ...overrides
  };
}
function plan(input = {}) {
  return planOwnerConnectorTerminalClosure({
    closureRequest,
    rawLedger: ledger,
    sourceComment: sourceFor(),
    observedMainHead: MAIN,
    observedLedgerBlobSha: LEDGER_BLOB,
    observedLockRefHead: LOCK_REF_HEAD,
    ...input
  });
}
function expectCode(fn, code) {
  assert.throws(fn, error => error?.code === code, code);
}

const valid = plan();
assert.equal(valid.schema, 'OWNER_AUTHENTICATED_CANONICAL_TERMINAL_CLOSURE_PLAN_v1');
assert.equal(valid.result, 'TERMINAL_CLOSURE_PLANNED');
assert.equal(valid.transportId, TRANSPORT_ID);
assert.equal(valid.ledgerMutationAuthorized, true);
assert.equal(valid.oneLedgerMutationRequired, true);
assert.equal(valid.planIsReceipt, false);
assert.equal(valid.commitMessage, `Close operation lock ${generation}: ${operationId} PASS_CLOSED`);
assert.equal(Object.keys(valid.nextLedger.activeScopes).length, 0);
assert.equal(valid.nextLedger.terminalHistory.length, 1);
assert.equal(valid.nextLedger.terminalHistory[0].released, true);
assert.equal(valid.nextLedger.terminalHistory[0].terminalDisposition, 'PASS_CLOSED');
assert.equal(valid.nextLedger.terminalHistory[0].independentClosureProvenance.transportId, TRANSPORT_ID);
assert.equal(verifyOwnerTerminalClosureProvenance(valid.nextLedger.terminalHistory[0]).result, 'OWNER_CONNECTOR_TERMINAL_CLOSURE_PROVENANCE_VERIFIED');

expectCode(() => plan({ sourceComment: sourceFor(closureRequest, { user: { login: 'not-owner' } }) }), 'SOURCE_COMMENT_NOT_OWNER');
expectCode(() => plan({ sourceComment: sourceFor(closureRequest, { author_association: 'MEMBER' }) }), 'SOURCE_COMMENT_NOT_OWNER');
expectCode(() => plan({ sourceComment: { ...sourceFor(), body: `WRONG_MARKER\n{}` } }), 'SOURCE_MARKER_MISMATCH');
expectCode(() => plan({ observedMainHead: '9'.repeat(40) }), 'GOVERNING_HEAD_MISMATCH');
expectCode(() => plan({ observedLedgerBlobSha: 'bad' }), 'INVALID_DIGEST');
expectCode(() => plan({ observedLockRefHead: 'bad' }), 'INVALID_DIGEST');
const wrongGeneration = stable({ ...closureRequest, lockGeneration: generation + 1 });
expectCode(() => plan({ closureRequest: wrongGeneration, sourceComment: sourceFor(wrongGeneration) }), 'SOURCE_OPERATION_IDENTITY_MISMATCH');
const tamperedSourceRequest = stable({ ...closureRequest, terminalDisposition: 'FAIL_CLOSED' });
expectCode(() => plan({ sourceComment: sourceFor(tamperedSourceRequest) }), 'SOURCE_CLOSURE_REQUEST_MISMATCH');
const closedLedger = valid.nextLedger;
expectCode(() => plan({ rawLedger: closedLedger }), 'ACTIVE_LOCK_PROVENANCE_FAILURE');

const tamperedRow = stable({ ...valid.nextLedger.terminalHistory[0], terminalDisposition: 'FAIL_CLOSED' });
expectCode(() => verifyOwnerTerminalClosureProvenance(tamperedRow), 'OWNER_CONNECTOR_TERMINAL_CLOSURE_TERMINAL_IDENTITY_MISMATCH');

process.stdout.write(JSON.stringify(stable({
  schema: 'OWNER_CONNECTOR_TERMINAL_CLOSURE_SELF_TEST_RECEIPT_v1',
  result: 'PASS',
  validClosurePlanned: true,
  terminalLineageVerified: true,
  sourceTamperRejected: true,
  casTamperRejected: true,
  identityTamperRejected: true,
  doubleCloseRejected: true,
  unrelatedGenericAuthorityCreated: false
}), null, 2) + '\n');
