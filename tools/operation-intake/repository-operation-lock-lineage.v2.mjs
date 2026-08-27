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
export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';

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

function findAdmissionRow(resultingLedger, generation, operationId) {
  const l = ledger(resultingLedger);
  return Object.values(l.activeScopes).find(lock => lock.lockGeneration === generation && lock.operationId === operationId) || null;
}

export function verifyCanonicalLedgerCommitV2({ commit, changedPaths, resultingLedger }) {
  if (!Array.isArray(changedPaths) || changedPaths.length !== 1 || changedPaths[0] !== LEDGER_PATH) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'NON_LEDGER_PATH_MUTATION');
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
  if (!admission) reject('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED', 'OWNER_TRANSPORT_ONLY_AUTHORIZED_FOR_CANONICAL_INTAKE');
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
