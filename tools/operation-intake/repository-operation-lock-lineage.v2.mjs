#!/usr/bin/env node
import {
  canonical,
  ledger,
  sha,
  stable
} from './repository-operation-lock-manager.v1.mjs';

export const OWNER_LOGIN = 'smansfield635-create';
export const OWNER_TRANSPORT = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1';
export const OWNER_PROVENANCE_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PROVENANCE_v1';
export const OWNER_SUCCESSOR_TRANSPORT = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_SUCCESSOR_V1';
export const OWNER_SUCCESSOR_PROVENANCE_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_SUCCESSOR_PROVENANCE_v1';
export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
export const GEN1767_EXACT_OWNER_INTAKE_RECOVERY = Object.freeze({
  operationId: 'AUDRALIA_WORK_EXECUTOR_PORTABLE_BOOTSTRAP_20260827_001',
  lockGeneration: 1767,
  lockScope: 'AUDRALIA:WORK_EXECUTOR_PORTABLE_BOOTSTRAP:V1',
  governingHead: '5d74b9b60ee7ab55cd58362ba1f62d7df263995d',
  commitSha: 'e24fd158777c8df4000d6ae6c36f1ab1073c3222',
  ledgerBlobSha: '35cd3351cee5884e707c5f5c3d5074c7d46af868',
  message: 'Acquire operation lock for AUDRALIA_WORK_EXECUTOR_PORTABLE_BOOTSTRAP_20260827_001'
});

function reject(code, detail = null) {
  const e = new Error(`${code}${detail ? ':' + detail : ''}`);
  Object.assign(e, { code, detail });
  throw e;
}

function validCanonicalMessage(message) {
  return typeof message === 'string' && (
    /^Acquire operation lock \d+: .+/.test(message) ||
    /^Supersede operation \d+ with successor \d+: .+/.test(message) ||
    /^Close operation lock \d+: .+ (PASS_CLOSED|FAIL_CLOSED|REJECTED_CLOSED|WITHDRAWN|SUPERSEDED|VOIDED|EXPIRED)$/.test(message)
  );
}

export function verifyOwnerProvenance(lock) {
  const p = lock?.independentAuthorityProvenance;
  if (!p || p.schema !== OWNER_PROVENANCE_SCHEMA || p.transportId !== OWNER_TRANSPORT) reject('OWNER_CONNECTOR_PROVENANCE_MISSING');
  if (p.source?.authorLogin !== OWNER_LOGIN || p.source?.authorAssociation !== 'OWNER') reject('OWNER_CONNECTOR_SOURCE_NOT_OWNER');
  if (p.source?.marker !== 'CANONICAL_OPERATION_INTAKE_REQUEST_V1') reject('OWNER_CONNECTOR_SOURCE_MARKER_MISMATCH');
  if (!/^[0-9a-f]{64}$/.test(p.source?.commentBodySha256 || '')) reject('OWNER_CONNECTOR_SOURCE_DIGEST_INVALID');
  if (!/^[0-9a-f]{40}$/.test(p.compareAndSwap?.observedLedgerBlobSha || '')) reject('OWNER_CONNECTOR_LEDGER_CAS_BINDING_INVALID');
  if (!/^[0-9a-f]{40}$/.test(p.compareAndSwap?.observedLockRefHead || '')) reject('OWNER_CONNECTOR_LOCK_REF_BINDING_INVALID');
  const identity = {
    operationId: lock.operationId,
    lockScope: lock.lockScope,
    scopeHash: lock.scopeHash,
    governingHead: lock.governingHead,
    requestDigest: lock.requestDigest,
    procedureLocatorDigest: lock.procedureLocatorDigest,
    lockGeneration: lock.lockGeneration
  };
  if (canonical(p.authorityIdentity) !== canonical(identity)) reject('OWNER_CONNECTOR_AUTHORITY_IDENTITY_MISMATCH');
  const core = stable({
    schema: p.schema,
    transportId: p.transportId,
    source: p.source,
    authorityIdentity: p.authorityIdentity,
    compareAndSwap: p.compareAndSwap
  });
  if (p.bindingDigest !== sha(canonical(core))) reject('OWNER_CONNECTOR_PROVENANCE_BINDING_MISMATCH');
  return stable({ result: 'OWNER_CONNECTOR_PROVENANCE_VERIFIED', authorityIdentity: identity });
}

export function verifyOwnerSuccessorProvenance(lock) {
  const p = lock?.independentAuthorityProvenance;
  if (!p || p.schema !== OWNER_SUCCESSOR_PROVENANCE_SCHEMA || p.transportId !== OWNER_SUCCESSOR_TRANSPORT) reject('OWNER_CONNECTOR_SUCCESSOR_PROVENANCE_MISSING');
  if (p.source?.authorLogin !== OWNER_LOGIN || p.source?.authorAssociation !== 'OWNER') reject('OWNER_CONNECTOR_SUCCESSOR_SOURCE_NOT_OWNER');
  if (p.source?.marker !== 'REMOTE_OPERATION_SUCCESSOR_REQUEST_V1') reject('OWNER_CONNECTOR_SUCCESSOR_SOURCE_MARKER_MISMATCH');
  if (!/^[0-9a-f]{64}$/.test(p.source?.commentBodySha256 || '')) reject('OWNER_CONNECTOR_SUCCESSOR_SOURCE_DIGEST_INVALID');
  if (!/^[0-9a-f]{40}$/.test(p.compareAndSwap?.observedLedgerBlobSha || '')) reject('OWNER_CONNECTOR_SUCCESSOR_LEDGER_CAS_BINDING_INVALID');
  if (!/^[0-9a-f]{40}$/.test(p.compareAndSwap?.observedLockRefHead || '')) reject('OWNER_CONNECTOR_SUCCESSOR_LOCK_REF_BINDING_INVALID');
  const identity = {
    operationId: lock.operationId,
    lockScope: lock.lockScope,
    scopeHash: lock.scopeHash,
    governingHead: lock.governingHead,
    requestDigest: lock.requestDigest,
    procedureLocatorDigest: lock.procedureLocatorDigest,
    lockGeneration: lock.lockGeneration
  };
  if (canonical(p.authorityIdentity) !== canonical(identity)) reject('OWNER_CONNECTOR_SUCCESSOR_AUTHORITY_IDENTITY_MISMATCH');
  if (p.transitionIdentity?.successor?.operationId !== lock.operationId || p.transitionIdentity?.successor?.lockScope !== lock.lockScope || p.transitionIdentity?.successor?.lockGeneration !== lock.lockGeneration || p.transitionIdentity?.successor?.governingHead !== lock.governingHead) reject('OWNER_CONNECTOR_SUCCESSOR_TRANSITION_IDENTITY_MISMATCH');
  if (!Number.isInteger(p.transitionIdentity?.predecessor?.lockGeneration) || p.transitionIdentity.predecessor.lockGeneration < 1) reject('OWNER_CONNECTOR_SUCCESSOR_PREDECESSOR_IDENTITY_INVALID');
  const core = stable({
    schema: p.schema,
    transportId: p.transportId,
    source: p.source,
    transitionIdentity: p.transitionIdentity,
    authorityIdentity: p.authorityIdentity,
    compareAndSwap: p.compareAndSwap
  });
  if (p.bindingDigest !== sha(canonical(core))) reject('OWNER_CONNECTOR_SUCCESSOR_PROVENANCE_BINDING_MISMATCH');
  return stable({ result: 'OWNER_CONNECTOR_SUCCESSOR_PROVENANCE_VERIFIED', authorityIdentity: identity, transitionIdentity: p.transitionIdentity });
}

function findAdmissionRow(resultingLedger, generation, operationId) {
  const l = ledger(resultingLedger);
  return Object.values(l.activeScopes).find(lock => lock.lockGeneration === generation && lock.operationId === operationId) || null;
}

function verifySupersededPredecessor(resultingLedger, provenance, predecessorGeneration) {
  const l = ledger(resultingLedger);
  const expected = provenance.transitionIdentity.predecessor;
  if (expected.lockGeneration !== predecessorGeneration) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'OWNER_SUCCESSOR_PREDECESSOR_GENERATION_MISMATCH');
  const row = l.terminalHistory.find(entry => entry.operationId === expected.operationId && entry.lockGeneration === expected.lockGeneration && entry.lockScope === expected.lockScope);
  if (!row) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'SUPERSEDED_PREDECESSOR_NOT_FOUND');
  if (row.terminalDisposition !== 'SUPERSEDED' || row.released !== true || row.state !== 'TERMINAL') reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'PREDECESSOR_NOT_TERMINALLY_SUPERSEDED');
  if (row.governingHead !== expected.governingHead) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'PREDECESSOR_GOVERNING_HEAD_MISMATCH');
  if (row.supersession?.successorOperationId !== provenance.transitionIdentity.successor.operationId || row.supersession?.successorLockGeneration !== provenance.transitionIdentity.successor.lockGeneration || row.supersession?.successorGoverningHead !== provenance.transitionIdentity.successor.governingHead || row.supersession?.authorityInherited !== false) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'SUPERSESSION_LINK_MISMATCH');
  return row;
}

export function verifyExactGen1767OwnerIntakeRecovery({ commit, changedPaths, resultingLedger }) {
  const exact = GEN1767_EXACT_OWNER_INTAKE_RECOVERY;
  const commitSha = commit?.sha ?? commit?.commitSha ?? null;
  if (commitSha !== exact.commitSha) return null;
  if (!Array.isArray(changedPaths) || changedPaths.length !== 1 || changedPaths[0] !== LEDGER_PATH) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'GEN1767_RECOVERY_PATH_MISMATCH');
  const message = commit?.commit?.message ?? commit?.message;
  if (message !== exact.message) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'GEN1767_RECOVERY_MESSAGE_MISMATCH');
  const ledgerFile = Array.isArray(commit?.files) ? commit.files.find(file => file?.filename === LEDGER_PATH) : null;
  if (!ledgerFile || ledgerFile.sha !== exact.ledgerBlobSha) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'GEN1767_RECOVERY_LEDGER_BLOB_MISMATCH');
  const row = findAdmissionRow(resultingLedger, exact.lockGeneration, exact.operationId);
  if (!row) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'GEN1767_RECOVERY_ROW_NOT_FOUND');
  if (row.lockScope !== exact.lockScope || row.governingHead !== exact.governingHead) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'GEN1767_RECOVERY_ROW_IDENTITY_MISMATCH');
  const provenance = verifyOwnerProvenance(row);
  return stable({
    result: 'CANONICAL_LEDGER_COMMIT_VERIFIED',
    principal: OWNER_TRANSPORT,
    operationId: exact.operationId,
    lockGeneration: exact.lockGeneration,
    verificationMode: 'GEN1767_EXACT_OWNER_INTAKE_RECOVERY',
    provenance
  });
}

export function verifyCanonicalLedgerCommitV2({ commit, changedPaths, resultingLedger }) {
  if (!Array.isArray(changedPaths) || changedPaths.length !== 1 || changedPaths[0] !== LEDGER_PATH) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'NON_LEDGER_PATH_MUTATION');
  const exactRecovery = verifyExactGen1767OwnerIntakeRecovery({ commit, changedPaths, resultingLedger });
  if (exactRecovery) return exactRecovery;
  const message = commit?.commit?.message ?? commit?.message;
  if (!validCanonicalMessage(message)) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'NON_CANONICAL_MUTATION_MESSAGE');

  const authorLogin = commit?.author?.login ?? null;
  const committerLogin = commit?.committer?.login ?? null;
  const verified = commit?.commit?.verification?.verified === true || commit?.verification?.verified === true;
  if (authorLogin === 'github-actions[bot]' && verified) {
    return stable({ result: 'CANONICAL_LEDGER_COMMIT_VERIFIED', principal: 'GITHUB_ACTIONS_CANONICAL_INTAKE_V1' });
  }

  if (authorLogin !== OWNER_LOGIN || committerLogin !== OWNER_LOGIN) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'UNAUTHORIZED_PRINCIPAL');
  const admission = message.match(/^Acquire operation lock (\d+): (.+)$/);
  if (admission) {
    const generation = Number(admission[1]);
    const operationId = admission[2];
    const row = findAdmissionRow(resultingLedger, generation, operationId);
    if (!row) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'RESULTING_LOCK_ROW_NOT_FOUND');
    const provenance = verifyOwnerProvenance(row);
    return stable({
      result: 'CANONICAL_LEDGER_COMMIT_VERIFIED',
      principal: OWNER_TRANSPORT,
      operationId,
      lockGeneration: generation,
      provenance
    });
  }

  const successor = message.match(/^Supersede operation (\d+) with successor (\d+): (.+)$/);
  if (successor) {
    const predecessorGeneration = Number(successor[1]);
    const successorGeneration = Number(successor[2]);
    const operationId = successor[3];
    const row = findAdmissionRow(resultingLedger, successorGeneration, operationId);
    if (!row) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'RESULTING_SUCCESSOR_LOCK_ROW_NOT_FOUND');
    const provenance = verifyOwnerSuccessorProvenance(row);
    verifySupersededPredecessor(resultingLedger, provenance, predecessorGeneration);
    return stable({
      result: 'CANONICAL_LEDGER_COMMIT_VERIFIED',
      principal: OWNER_SUCCESSOR_TRANSPORT,
      operationId,
      lockGeneration: successorGeneration,
      provenance
    });
  }

  reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'OWNER_TRANSPORT_MUTATION_NOT_AUTHORIZED');
}
