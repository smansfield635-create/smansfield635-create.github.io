#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  authorityIdentity,
  canonical,
  canonScope,
  closeLocal,
  ledger,
  sha,
  stable,
  text
} from './repository-operation-lock-manager.v1.mjs';
import {
  verifyOwnerProvenance,
  verifyOwnerSuccessorProvenance
} from './repository-operation-lock-lineage.v2.mjs';

export const PLAN_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_TERMINAL_CLOSURE_PLAN_v1';
export const PROVENANCE_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_TERMINAL_CLOSURE_PROVENANCE_v1';
export const TRANSPORT_ID = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_TERMINAL_CLOSURE_V1';
export const OWNER_LOGIN = 'smansfield635-create';
export const MARKER = 'REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_V1';
export const INVOCATION_SCHEMA = 'REMOTE_OPERATION_TERMINAL_CLOSURE_INVOCATION_REQUEST_v1';
export const CLOSURE_SCHEMA = 'REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_v1';
export const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
export const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';

function fail(code, field, detail = null) {
  const error = new Error(`${code}:${field}${detail ? ':' + detail : ''}`);
  Object.assign(error, { code, field, detail });
  throw error;
}

function digest(value, length, field) {
  if (typeof value !== 'string' || !new RegExp(`^[0-9a-f]{${length}}$`).test(value)) fail('INVALID_DIGEST', field);
  return value;
}

function parseOwnerSource(sourceComment) {
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
  catch (error) { fail('SOURCE_ENVELOPE_INVALID', 'body', error.message); }
  if (envelope?.schema !== INVOCATION_SCHEMA) fail('SOURCE_ENVELOPE_SCHEMA_MISMATCH', 'schema');
  if (envelope?.repository !== REPOSITORY) fail('SOURCE_REPOSITORY_MISMATCH', 'repository');
  return stable({ id, issueNumber, body, login, association, envelope });
}

function validateClosureRequest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('CLOSURE_REQUEST_INVALID', 'closureRequest');
  if (value.schema !== CLOSURE_SCHEMA) fail('CLOSURE_REQUEST_SCHEMA_MISMATCH', 'schema');
  if (value.repository !== REPOSITORY) fail('CLOSURE_REQUEST_REPOSITORY_MISMATCH', 'repository');
  if (typeof value.operationId !== 'string' || !value.operationId.trim()) fail('CLOSURE_REQUEST_INVALID', 'operationId');
  if (canonScope(value.lockScope) !== value.lockScope) fail('CLOSURE_REQUEST_SCOPE_NOT_CANONICAL', 'lockScope');
  if (!Number.isInteger(value.lockGeneration) || value.lockGeneration < 1) fail('CLOSURE_REQUEST_INVALID', 'lockGeneration');
  if (!['PASS_CLOSED','FAIL_CLOSED','REJECTED_CLOSED','WITHDRAWN','SUPERSEDED','VOIDED','EXPIRED','MUTATION_CLOSED_EVIDENCE_CONTINUES'].includes(value.terminalDisposition)) fail('CLOSURE_REQUEST_INVALID', 'terminalDisposition');
  return stable(value);
}

export function verifyCanonicalActiveAuthority(lock) {
  try { return verifyOwnerSuccessorProvenance(lock); }
  catch (successorError) {
    try { return verifyOwnerProvenance(lock); }
    catch (ownerError) {
      const canonical = lock?.authorityProvenance;
      if (canonical?.schema === 'REPOSITORY_OPERATION_AUTHORITY_PROVENANCE_v1') {
        return stable({ result: 'CANONICAL_AUTHORITY_PROVENANCE_PRESENT', origin: canonical.origin ?? null, authorityIdentity: authorityIdentity(lock) });
      }
      fail('ACTIVE_LOCK_PROVENANCE_FAILURE', 'activeLock', `${successorError.code || successorError.message}|${ownerError.code || ownerError.message}`);
    }
  }
}

export function buildIndependentClosureProvenance({ source, activeLock, terminalRow, observedLedgerBlobSha, observedLockRefHead }) {
  const core = stable({
    schema: PROVENANCE_SCHEMA,
    transportId: TRANSPORT_ID,
    source: {
      repository: REPOSITORY,
      issueNumber: source.issueNumber,
      commentId: source.id,
      authorLogin: source.login,
      authorAssociation: source.association,
      commentBodySha256: sha(source.body),
      marker: MARKER
    },
    authorityIdentity: authorityIdentity(activeLock),
    terminalIdentity: {
      operationId: terminalRow.operationId,
      lockScope: terminalRow.lockScope,
      scopeHash: terminalRow.scopeHash,
      governingHead: terminalRow.governingHead,
      lockGeneration: terminalRow.lockGeneration,
      terminalDisposition: terminalRow.terminalDisposition,
      state: terminalRow.state,
      released: terminalRow.released
    },
    compareAndSwap: {
      observedLedgerBlobSha: digest(observedLedgerBlobSha, 40, 'observedLedgerBlobSha'),
      observedLockRefHead: digest(observedLockRefHead, 40, 'observedLockRefHead')
    }
  });
  return stable({ ...core, bindingDigest: sha(canonical(core)) });
}

export function planOwnerConnectorTerminalClosure({
  closureRequest,
  rawLedger,
  sourceComment,
  observedMainHead,
  observedLedgerBlobSha,
  observedLockRefHead
}) {
  const request = validateClosureRequest(closureRequest);
  const source = parseOwnerSource(sourceComment);
  const mainHead = digest(observedMainHead, 40, 'observedMainHead');
  digest(observedLedgerBlobSha, 40, 'observedLedgerBlobSha');
  digest(observedLockRefHead, 40, 'observedLockRefHead');
  if (source.envelope.expectedMainHead !== mainHead) fail('GOVERNING_HEAD_MISMATCH', 'expectedMainHead', `current=${mainHead}`);
  if (canonical(source.envelope.closureRequest) !== canonical(request)) fail('SOURCE_CLOSURE_REQUEST_MISMATCH', 'closureRequest');

  const baseLedger = ledger(rawLedger);
  const scopeHashValue = sha(request.lockScope);
  const activeLock = baseLedger.activeScopes[scopeHashValue];
  if (!activeLock) fail('ACTIVE_LOCK_PROVENANCE_FAILURE', 'activeLock', 'ACTIVE_LOCK_NOT_FOUND');
  if (activeLock.operationId !== request.operationId || activeLock.lockGeneration !== request.lockGeneration) fail('SOURCE_OPERATION_IDENTITY_MISMATCH', 'closureRequest');
  const activeAuthorityVerification = verifyCanonicalActiveAuthority(activeLock);

  const local = closeLocal(baseLedger, request);
  const terminalIndex = local.ledger.terminalHistory.findIndex(row => row.operationId === request.operationId && row.lockGeneration === request.lockGeneration);
  if (terminalIndex < 0) fail('TERMINAL_ROW_CORRESPONDENCE_FAILURE', 'terminalHistory');
  const terminalRow = local.ledger.terminalHistory[terminalIndex];
  const independentClosureProvenance = buildIndependentClosureProvenance({ source, activeLock, terminalRow, observedLedgerBlobSha, observedLockRefHead });
  const certifiedTerminalRow = stable({ ...terminalRow, independentClosureProvenance });
  const terminalHistory = [...local.ledger.terminalHistory];
  terminalHistory[terminalIndex] = certifiedTerminalRow;
  const nextLedger = stable({ ...local.ledger, terminalHistory });
  const commitMessage = `Close operation lock ${request.lockGeneration}: ${request.operationId} ${request.terminalDisposition}`;

  return stable({
    schema: PLAN_SCHEMA,
    result: 'TERMINAL_CLOSURE_PLANNED',
    transportId: TRANSPORT_ID,
    nativeResult: local.receipt,
    operationId: request.operationId,
    lockScope: request.lockScope,
    lockGeneration: request.lockGeneration,
    terminalDisposition: request.terminalDisposition,
    activeAuthorityVerification,
    independentClosureProvenance,
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
  for (let index = 0; index < argv.length; index++) {
    if (!argv[index].startsWith('--')) fail('UNKNOWN_ARGUMENT', argv[index]);
    out[argv[index].slice(2)] = argv[++index] ?? null;
  }
  return out;
}
function readJson(file, field) {
  try { return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
  catch (error) { fail('INPUT_READ_FAILED', field, error.message); }
}
function write(file, value) {
  if (!file) return process.stdout.write(text(value));
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(path.resolve(file), text(value));
}

async function main() {
  const a = args(process.argv.slice(2));
  try {
    const plan = planOwnerConnectorTerminalClosure({
      closureRequest: readJson(a.request, 'request'),
      rawLedger: readJson(a.ledger, 'ledger'),
      sourceComment: readJson(a['source-comment'], 'source-comment'),
      observedMainHead: a['observed-main-head'],
      observedLedgerBlobSha: a['observed-ledger-blob-sha'],
      observedLockRefHead: a['observed-lock-ref-head']
    });
    write(a.output, plan);
  } catch (error) {
    write(a.output, stable({
      schema: PLAN_SCHEMA,
      result: 'FAIL_CLOSED',
      errorCode: error.code || 'UNEXPECTED_ERROR',
      field: error.field || null,
      detail: error.detail || null,
      ledgerMutationAuthorized: false
    }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
