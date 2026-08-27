#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { successorLocal, validateTransition } from './repository-operation-successor-gate.v1.mjs';
import {
  authorityIdentity,
  canonical,
  ledger,
  sha,
  stable,
  text,
  verifyAuthorityProvenanceBinding
} from '../../../tools/operation-intake/repository-operation-lock-manager.v1.mjs';
import { verifyOwnerProvenance } from '../../../tools/operation-intake/repository-operation-lock-lineage.v2.mjs';

export const PLAN_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_SUCCESSOR_PLAN_v1';
export const PROVENANCE_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_SUCCESSOR_PROVENANCE_v1';
export const TRANSPORT_ID = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_SUCCESSOR_V1';
export const OWNER_LOGIN = 'smansfield635-create';
export const MARKER = 'REMOTE_OPERATION_SUCCESSOR_REQUEST_V1';
export const INVOCATION_SCHEMA = 'REMOTE_OPERATION_SUCCESSOR_INVOCATION_REQUEST_v1';
export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
export const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';

function fail(code, field, detail = null) {
  const e = new Error(`${code}:${field}${detail ? ':' + detail : ''}`);
  Object.assign(e, { code, field, detail });
  throw e;
}
function digest(value, length, field) {
  if (typeof value !== 'string' || !new RegExp(`^[0-9a-f]{${length}}$`).test(value)) fail('INVALID_DIGEST', field);
  return value;
}

export function validateOwnerSuccessorSource(sourceComment) {
  if (!sourceComment || typeof sourceComment !== 'object' || Array.isArray(sourceComment)) fail('SOURCE_COMMENT_INVALID', 'sourceComment');
  const id = Number(sourceComment.id);
  const issueNumber = Number(sourceComment.issueNumber ?? sourceComment.issue_number);
  const body = sourceComment.body;
  const login = sourceComment.user?.login ?? sourceComment.authorLogin;
  const association = sourceComment.author_association ?? sourceComment.authorAssociation;
  if (!Number.isInteger(id) || id < 1) fail('SOURCE_COMMENT_INVALID', 'id');
  if (!Number.isInteger(issueNumber) || issueNumber < 1) fail('SOURCE_COMMENT_INVALID', 'issueNumber');
  if (login !== OWNER_LOGIN) fail('SOURCE_COMMENT_NOT_OWNER', 'user.login', String(login));
  if (association !== 'OWNER') fail('SOURCE_COMMENT_NOT_OWNER', 'author_association', String(association));
  if (typeof body !== 'string' || body.split(/\r?\n/, 1)[0].trim() !== MARKER) fail('SOURCE_MARKER_MISMATCH', 'body');
  let envelope;
  try { envelope = JSON.parse(body.slice(body.indexOf('\n') + 1).trim()); }
  catch (e) { fail('SOURCE_ENVELOPE_INVALID', 'body', e.message); }
  if (envelope?.schema !== INVOCATION_SCHEMA) fail('SOURCE_ENVELOPE_SCHEMA_MISMATCH', 'schema');
  if (envelope?.repository !== 'smansfield635-create/smansfield635-create.github.io') fail('SOURCE_REPOSITORY_MISMATCH', 'repository');
  return stable({ id, issueNumber, body, login, association, envelope });
}

export function verifyCanonicalPredecessorAuthority(lock) {
  try { return verifyAuthorityProvenanceBinding(lock); }
  catch (canonicalError) {
    try { return verifyOwnerProvenance(lock); }
    catch (ownerError) { fail('PREDECESSOR_PROVENANCE_INVALID', 'predecessor', `${canonicalError.code || canonicalError.message}|${ownerError.code || ownerError.message}`); }
  }
}

export function buildIndependentSuccessorProvenance({ source, successorLock, transition, observedLedgerBlobSha, observedLockRefHead }) {
  const core = stable({
    schema: PROVENANCE_SCHEMA,
    transportId: TRANSPORT_ID,
    source: {
      repository: 'smansfield635-create/smansfield635-create.github.io',
      issueNumber: source.issueNumber,
      commentId: source.id,
      authorLogin: source.login,
      authorAssociation: source.association,
      commentBodySha256: sha(source.body),
      marker: MARKER
    },
    transitionIdentity: {
      transitionId: transition.transitionId,
      predecessor: {
        operationId: transition.predecessor.operationId,
        lockScope: transition.predecessor.lockScope,
        lockGeneration: transition.predecessor.lockGeneration,
        governingHead: transition.predecessor.governingHead
      },
      successor: {
        operationId: successorLock.operationId,
        lockScope: successorLock.lockScope,
        lockGeneration: successorLock.lockGeneration,
        governingHead: successorLock.governingHead
      }
    },
    authorityIdentity: authorityIdentity(successorLock),
    compareAndSwap: {
      observedLedgerBlobSha: digest(observedLedgerBlobSha, 40, 'observedLedgerBlobSha'),
      observedLockRefHead: digest(observedLockRefHead, 40, 'observedLockRefHead')
    }
  });
  return stable({ ...core, bindingDigest: sha(canonical(core)) });
}

export function planOwnerConnectorSuccessor({
  transition,
  request,
  procedure,
  rawLedger,
  sourceComment,
  observedMainHead,
  observedLedgerBlobSha,
  observedLockRefHead
}) {
  const source = validateOwnerSuccessorSource(sourceComment);
  const validatedTransition = validateTransition(transition);
  const mainHead = digest(observedMainHead, 40, 'observedMainHead');
  digest(observedLedgerBlobSha, 40, 'observedLedgerBlobSha');
  digest(observedLockRefHead, 40, 'observedLockRefHead');
  if (validatedTransition.successor.governingHead !== mainHead || request?.exactGoverningHead !== mainHead || procedure?.exactGoverningHead !== mainHead) fail('GOVERNING_HEAD_MISMATCH', 'exactGoverningHead', `current=${mainHead}`);
  if (canonical(source.envelope.transition) !== canonical(transition)) fail('SOURCE_TRANSITION_MISMATCH', 'transition');
  if (canonical(source.envelope.operationRequest) !== canonical(request)) fail('SOURCE_REQUEST_MISMATCH', 'operationRequest');
  if (canonical(source.envelope.constructionProcedure) !== canonical(procedure)) fail('SOURCE_PROCEDURE_MISMATCH', 'constructionProcedure');

  const baseLedger = ledger(rawLedger);
  const preflight = successorLocal(baseLedger, transition, request, procedure);
  const predecessor = baseLedger.activeScopes[preflight.receipt.predecessor.scopeHash];
  const predecessorAuthorityVerification = verifyCanonicalPredecessorAuthority(predecessor);
  const local = successorLocal(baseLedger, transition, request, procedure);
  const successorHash = local.receipt.successor.scopeHash;
  const successorLock = local.ledger.activeScopes[successorHash];
  const independentAuthorityProvenance = buildIndependentSuccessorProvenance({
    source,
    successorLock,
    transition: validatedTransition,
    observedLedgerBlobSha,
    observedLockRefHead
  });
  const nextSuccessorLock = stable({ ...successorLock, independentAuthorityProvenance });
  const nextLedger = stable({
    ...local.ledger,
    activeScopes: { ...local.ledger.activeScopes, [successorHash]: nextSuccessorLock }
  });
  const commitMessage = `Supersede operation ${local.receipt.predecessor.lockGeneration} with successor ${local.receipt.successor.lockGeneration}: ${local.receipt.successor.operationId}`;
  return stable({
    schema: PLAN_SCHEMA,
    result: 'SUCCESSOR_TRANSITION_PLANNED',
    transportId: TRANSPORT_ID,
    nativeResult: local.receipt.result,
    transitionId: validatedTransition.transitionId,
    predecessor: local.receipt.predecessor,
    successor: local.receipt.successor,
    predecessorAuthorityVerification,
    independentAuthorityProvenance,
    observedMainHead: mainHead,
    observedLedgerBlobSha,
    observedLockRefHead,
    exactMutationPath: LEDGER_PATH,
    lockRef: LOCK_REF,
    commitMessage,
    ledgerMutationAuthorized: true,
    oneLedgerMutationRequired: true,
    planIsReceipt: false,
    finalReceiptRequiresCommitRereadAndLineageVerification: true,
    nextLedger
  });
}

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) fail('UNKNOWN_ARGUMENT', argv[i]);
    out[argv[i].slice(2)] = argv[++i] ?? null;
  }
  return out;
}
function readJson(file, field) {
  try { return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
  catch (e) { fail('INPUT_READ_FAILED', field, e.message); }
}
function write(file, value) {
  if (!file) return process.stdout.write(text(value));
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(path.resolve(file), text(value));
}

async function main() {
  const a = args(process.argv.slice(2));
  try {
    const plan = planOwnerConnectorSuccessor({
      transition: readJson(a.transition, 'transition'),
      request: readJson(a.request, 'request'),
      procedure: readJson(a.procedure, 'procedure'),
      rawLedger: readJson(a.ledger, 'ledger'),
      sourceComment: readJson(a['source-comment'], 'source-comment'),
      observedMainHead: a['observed-main-head'],
      observedLedgerBlobSha: a['observed-ledger-blob-sha'],
      observedLockRefHead: a['observed-lock-ref-head']
    });
    write(a.output, plan);
  } catch (e) {
    write(a.output, stable({
      schema: PLAN_SCHEMA,
      result: 'FAIL_CLOSED',
      errorCode: e.code || 'UNEXPECTED_ERROR',
      field: e.field || null,
      detail: e.detail || null,
      ledgerMutationAuthorized: false
    }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
