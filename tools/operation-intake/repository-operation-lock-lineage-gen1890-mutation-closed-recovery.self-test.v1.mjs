#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  canonical,
  sha,
  stable
} from './repository-operation-lock-manager.v1.mjs';
import {
  LEDGER_PATH,
  OWNER_LOGIN,
  OWNER_TERMINAL_CLOSURE_PROVENANCE_SCHEMA,
  OWNER_TERMINAL_CLOSURE_TRANSPORT,
  verifyCanonicalLedgerCommitV2
} from './repository-operation-lock-lineage.v2.mjs';

const EXACT_COMMIT = '6be527a0aea26ba75e14e6d13b8e22021fa414fd';
const operationId = 'RESEARCH_FRONTIER_FOUR_CARD_RUNTIME_PUBLICATION_VERIFICATION_20260831_004';
const lockScope = 'RESEARCH_FRONTIER:FOUR_CARD_RUNTIME_PUBLICATION_VERIFICATION:V1';
const lockGeneration = 1890;
const terminalDisposition = 'MUTATION_CLOSED_EVIDENCE_CONTINUES';
const H40 = '1'.repeat(40);
const B40 = '2'.repeat(40);
const R64 = '3'.repeat(64);
const P64 = '4'.repeat(64);
const S64 = '5'.repeat(64);

function row() {
  return stable({
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    operationId,
    lockScope,
    scopeHash: S64,
    state: 'TERMINAL',
    governingHead: H40,
    requestDigest: R64,
    procedureLocatorDigest: P64,
    lockGeneration,
    released: true,
    terminalDisposition
  });
}

function provenance(terminalRow) {
  const authorityIdentity = stable({
    operationId: terminalRow.operationId,
    lockScope: terminalRow.lockScope,
    scopeHash: terminalRow.scopeHash,
    governingHead: terminalRow.governingHead,
    requestDigest: terminalRow.requestDigest,
    procedureLocatorDigest: terminalRow.procedureLocatorDigest,
    lockGeneration: terminalRow.lockGeneration
  });
  const terminalIdentity = stable({
    operationId: terminalRow.operationId,
    lockScope: terminalRow.lockScope,
    scopeHash: terminalRow.scopeHash,
    governingHead: terminalRow.governingHead,
    lockGeneration: terminalRow.lockGeneration,
    terminalDisposition: terminalRow.terminalDisposition,
    state: terminalRow.state,
    released: terminalRow.released
  });
  const core = stable({
    schema: OWNER_TERMINAL_CLOSURE_PROVENANCE_SCHEMA,
    transportId: OWNER_TERMINAL_CLOSURE_TRANSPORT,
    source: {
      repository: 'smansfield635-create/smansfield635-create.github.io',
      issueNumber: 0,
      commentId: 1,
      authorLogin: OWNER_LOGIN,
      authorAssociation: 'OWNER',
      commentBodySha256: '6'.repeat(64),
      marker: 'REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_V1'
    },
    authorityIdentity,
    terminalIdentity,
    compareAndSwap: {
      observedLedgerBlobSha: B40,
      observedLockRefHead: H40
    }
  });
  return stable({ ...core, bindingDigest: sha(canonical(core)) });
}

function fixture(mutate = x => x) {
  let terminalRow = row();
  terminalRow = stable({ ...terminalRow, independentClosureProvenance: provenance(terminalRow) });
  terminalRow = mutate(terminalRow);
  return {
    commit: {
      sha: EXACT_COMMIT,
      author: { login: OWNER_LOGIN },
      committer: { login: OWNER_LOGIN },
      commit: {
        message: `Close operation lock ${lockGeneration}: ${operationId} ${terminalDisposition}`
      }
    },
    changedPaths: [LEDGER_PATH],
    resultingLedger: stable({
      schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
      lockGeneration,
      activeScopes: {},
      terminalHistory: [terminalRow]
    })
  };
}

const exact = fixture();
assert.equal(exact.commit.sha, EXACT_COMMIT);
const valid = verifyCanonicalLedgerCommitV2(exact);
assert.equal(valid.result, 'CANONICAL_LEDGER_COMMIT_VERIFIED');
assert.equal(valid.principal, OWNER_TERMINAL_CLOSURE_TRANSPORT);
assert.equal(valid.operationId, operationId);
assert.equal(valid.lockGeneration, lockGeneration);
assert.equal(valid.terminalDisposition, terminalDisposition);

const wrongDisposition = fixture();
wrongDisposition.commit.commit.message = `Close operation lock ${lockGeneration}: ${operationId} UNPROVEN_CONTINUATION`;
assert.throws(
  () => verifyCanonicalLedgerCommitV2(wrongDisposition),
  /NON_CANONICAL_MUTATION_MESSAGE/
);

assert.throws(() => verifyCanonicalLedgerCommitV2(fixture(r => stable({
  ...r,
  independentClosureProvenance: stable({
    ...r.independentClosureProvenance,
    source: { ...r.independentClosureProvenance.source, authorLogin: 'attacker' }
  })
}))), /OWNER_CONNECTOR_TERMINAL_CLOSURE_SOURCE_NOT_OWNER/);

assert.throws(() => verifyCanonicalLedgerCommitV2(fixture(r => stable({
  ...r,
  independentClosureProvenance: stable({
    ...r.independentClosureProvenance,
    compareAndSwap: {
      ...r.independentClosureProvenance.compareAndSwap,
      observedLedgerBlobSha: 'x'
    }
  })
}))), /OWNER_CONNECTOR_TERMINAL_CLOSURE_LEDGER_CAS_BINDING_INVALID/);

assert.throws(
  () => verifyCanonicalLedgerCommitV2(fixture(r => stable({
    ...r,
    terminalDisposition: 'PASS_CLOSED'
  }))),
  /RESULTING_TERMINAL_ROW_MISMATCH/
);

const genericOwnerMutation = fixture();
genericOwnerMutation.commit.commit.message = `Acquire operation lock ${lockGeneration}: ${operationId}`;
assert.throws(
  () => verifyCanonicalLedgerCommitV2(genericOwnerMutation),
  /RESULTING_LOCK_ROW_NOT_FOUND/
);

const unrelatedPath = fixture();
unrelatedPath.changedPaths = ['characters/index.html'];
assert.throws(
  () => verifyCanonicalLedgerCommitV2(unrelatedPath),
  /NON_LEDGER_PATH_MUTATION/
);

process.stdout.write(JSON.stringify(stable({
  schema: 'GEN1890_MUTATION_CLOSED_LINEAGE_RECOVERY_SELF_TEST_v1',
  result: 'PASS',
  exactHistoricalCommit: EXACT_COMMIT,
  exactHistoricalDispositionAccepted: true,
  wrongDispositionRejected: true,
  sourceTamperRejected: true,
  casTamperRejected: true,
  terminalRowMismatchRejected: true,
  genericOwnerMutationRejected: true,
  unrelatedPathRejected: true,
  genericAuthorityWidening: false
}), null, 2) + '\n');
