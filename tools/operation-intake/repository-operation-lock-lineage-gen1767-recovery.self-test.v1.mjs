#!/usr/bin/env node
import assert from 'node:assert/strict';
import { canonical, sha, stable } from './repository-operation-lock-manager.v1.mjs';
import {
  GEN1767_EXACT_OWNER_INTAKE_RECOVERY as exact,
  LEDGER_PATH,
  OWNER_PROVENANCE_SCHEMA,
  OWNER_TRANSPORT,
  verifyCanonicalLedgerCommitV2
} from './repository-operation-lock-lineage.v2.mjs';

const identity = {
  operationId: exact.operationId,
  lockScope: exact.lockScope,
  scopeHash: '1'.repeat(64),
  governingHead: exact.governingHead,
  requestDigest: '2'.repeat(64),
  procedureLocatorDigest: '3'.repeat(64),
  lockGeneration: exact.lockGeneration
};
const source = {
  authorLogin: 'smansfield635-create',
  authorAssociation: 'OWNER',
  marker: 'CANONICAL_OPERATION_INTAKE_REQUEST_V1',
  commentBodySha256: '4'.repeat(64)
};
const compareAndSwap = {
  observedLedgerBlobSha: '5'.repeat(40),
  observedLockRefHead: '6'.repeat(40)
};
const provenanceCore = stable({
  schema: OWNER_PROVENANCE_SCHEMA,
  transportId: OWNER_TRANSPORT,
  source,
  authorityIdentity: identity,
  compareAndSwap
});
const row = {
  ...identity,
  independentAuthorityProvenance: {
    ...provenanceCore,
    bindingDigest: sha(canonical(provenanceCore))
  }
};
const resultingLedger = {
  schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
  lockGeneration: exact.lockGeneration,
  activeScopes: { [exact.lockScope]: row },
  terminalHistory: []
};
const commit = {
  sha: exact.commitSha,
  author: null,
  committer: null,
  commit: { message: exact.message, verification: { verified: false } },
  files: [{ filename: LEDGER_PATH, sha: exact.ledgerBlobSha }]
};

const pass = verifyCanonicalLedgerCommitV2({ commit, changedPaths: [LEDGER_PATH], resultingLedger });
assert.equal(pass.result, 'CANONICAL_LEDGER_COMMIT_VERIFIED');
assert.equal(pass.verificationMode, 'GEN1767_EXACT_OWNER_INTAKE_RECOVERY');
assert.equal(pass.lockGeneration, 1767);

assert.throws(() => verifyCanonicalLedgerCommitV2({
  commit: { ...commit, sha: '0'.repeat(40) },
  changedPaths: [LEDGER_PATH], resultingLedger
}), /AUTHORITY_LEDGER_LINEAGE_UNTRUSTED/);

assert.throws(() => verifyCanonicalLedgerCommitV2({
  commit: { ...commit, commit: { ...commit.commit, message: `${exact.message}_ALTERED` } },
  changedPaths: [LEDGER_PATH], resultingLedger
}), /GEN1767_RECOVERY_MESSAGE_MISMATCH/);

assert.throws(() => verifyCanonicalLedgerCommitV2({
  commit: { ...commit, files: [{ filename: LEDGER_PATH, sha: '7'.repeat(40) }] },
  changedPaths: [LEDGER_PATH], resultingLedger
}), /GEN1767_RECOVERY_LEDGER_BLOB_MISMATCH/);

const alteredLedger = structuredClone(resultingLedger);
alteredLedger.activeScopes[exact.lockScope].operationId = `${exact.operationId}_ALTERED`;
assert.throws(() => verifyCanonicalLedgerCommitV2({
  commit, changedPaths: [LEDGER_PATH], resultingLedger: alteredLedger
}), /GEN1767_RECOVERY_ROW_NOT_FOUND/);

assert.throws(() => verifyCanonicalLedgerCommitV2({
  commit, changedPaths: ['README.md'], resultingLedger
}), /AUTHORITY_LEDGER_LINEAGE_UNTRUSTED/);

console.log('GEN1767_EXACT_OWNER_INTAKE_RECOVERY_SELF_TEST PASS');
