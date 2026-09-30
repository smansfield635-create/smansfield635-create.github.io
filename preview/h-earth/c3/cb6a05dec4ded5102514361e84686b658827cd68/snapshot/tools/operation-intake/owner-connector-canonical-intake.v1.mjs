#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare } from './repository-operation-intake-gate.v1.mjs';
import {
  acquireLocal,
  canonical,
  ledger,
  sha,
  stable,
  text
} from './repository-operation-lock-manager.v1.mjs';

export const CONTRACT_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PROVENANCE_v1';
export const TRANSPORT_ID = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1';
export const OWNER_LOGIN = 'smansfield635-create';
export const MARKER = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1';

function fail(code, field, detail = null) {
  const e = new Error(`${code}:${field}${detail ? ':' + detail : ''}`);
  Object.assign(e, { code, field, detail });
  throw e;
}

function digest40(value, field) {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/.test(value)) fail('INVALID_DIGEST', field);
  return value;
}

function parseSource(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) fail('SOURCE_COMMENT_INVALID', 'sourceComment');
  const id = Number(source.id);
  const issueNumber = Number(source.issueNumber ?? source.issue_number);
  const body = source.body;
  const login = source.user?.login ?? source.authorLogin;
  const association = source.author_association ?? source.authorAssociation;
  if (!Number.isInteger(id) || id < 1) fail('SOURCE_COMMENT_INVALID', 'id');
  if (!Number.isInteger(issueNumber) || issueNumber < 1) fail('SOURCE_COMMENT_INVALID', 'issueNumber');
  if (login !== OWNER_LOGIN) fail('SOURCE_COMMENT_NOT_OWNER', 'user.login', String(login));
  if (association !== 'OWNER') fail('SOURCE_COMMENT_NOT_OWNER', 'author_association', String(association));
  if (typeof body !== 'string' || body.split(/\r?\n/, 1)[0].trim() !== MARKER) fail('SOURCE_MARKER_MISMATCH', 'body');
  let envelope;
  try { envelope = JSON.parse(body.slice(body.indexOf('\n') + 1).trim()); }
  catch (e) { fail('SOURCE_ENVELOPE_INVALID', 'body', e.message); }
  return stable({ id, issueNumber, body, login, association, envelope });
}

export function planOwnerConnectorAdmission({
  request,
  procedure,
  rawLedger,
  sourceComment,
  observedMainHead,
  observedLedgerBlobSha,
  observedLockRefHead
}) {
  const q = prepare(request, procedure);
  const source = parseSource(sourceComment);
  const mainHead = digest40(observedMainHead, 'observedMainHead');
  const ledgerBlob = digest40(observedLedgerBlobSha, 'observedLedgerBlobSha');
  const lockRefHead = digest40(observedLockRefHead, 'observedLockRefHead');

  if (q.request.exactGoverningHead !== mainHead || q.procedure.exactGoverningHead !== mainHead) {
    fail('GOVERNING_HEAD_MISMATCH', 'exactGoverningHead', `current=${mainHead}`);
  }
  if (canonical(source.envelope?.operationRequest) !== canonical(q.request)) fail('SOURCE_REQUEST_MISMATCH', 'operationRequest');
  if (canonical(source.envelope?.constructionProcedure) !== canonical(q.procedure)) fail('SOURCE_PROCEDURE_MISMATCH', 'constructionProcedure');

  const baseLedger = ledger(rawLedger);
  const acquired = acquireLocal(baseLedger, {
    operationId: q.request.operationId,
    lockScope: q.request.lockScope,
    governingHead: q.request.exactGoverningHead,
    requestDigest: q.requestDigest,
    procedureLocatorDigest: q.procedureLocatorDigest
  });

  if (!acquired.acquired) {
    return stable({
      schema: 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PLAN_v1',
      result: 'ACTIVE_SCOPE_ALREADY_LOCKED',
      errorCode: acquired.errorCode,
      activeOperationId: acquired.activeOperationId,
      lockGeneration: acquired.lockGeneration,
      scopeHash: acquired.scopeHash,
      ledgerMutationAuthorized: false
    });
  }

  const core = stable({
    schema: CONTRACT_SCHEMA,
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
    authorityIdentity: {
      operationId: acquired.lock.operationId,
      lockScope: acquired.lock.lockScope,
      scopeHash: acquired.lock.scopeHash,
      governingHead: acquired.lock.governingHead,
      requestDigest: acquired.lock.requestDigest,
      procedureLocatorDigest: acquired.lock.procedureLocatorDigest,
      lockGeneration: acquired.lock.lockGeneration
    },
    compareAndSwap: {
      observedLedgerBlobSha: ledgerBlob,
      observedLockRefHead: lockRefHead
    }
  });
  const independentAuthorityProvenance = stable({ ...core, bindingDigest: sha(canonical(core)) });
  const lock = stable({ ...acquired.lock, independentAuthorityProvenance });
  const nextLedger = stable({
    ...acquired.ledger,
    activeScopes: {
      ...acquired.ledger.activeScopes,
      [lock.scopeHash]: lock
    }
  });
  const commitMessage = `Acquire operation lock ${lock.lockGeneration}: ${lock.operationId}`;

  return stable({
    schema: 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PLAN_v1',
    result: 'ADMITTED_AND_LOCKED',
    transportId: TRANSPORT_ID,
    operationId: lock.operationId,
    lockScope: lock.lockScope,
    scopeHash: lock.scopeHash,
    lockGeneration: lock.lockGeneration,
    governingHead: lock.governingHead,
    requestDigest: lock.requestDigest,
    procedureLocatorDigest: lock.procedureLocatorDigest,
    independentAuthorityProvenance,
    observedLedgerBlobSha: ledgerBlob,
    observedLockRefHead: lockRefHead,
    commitMessage,
    exactMutationPath: '.github/operation-intake/active-operation-ledger.v1.json',
    ledgerMutationAuthorized: true,
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
    const plan = planOwnerConnectorAdmission({
      request: readJson(a.request, 'request'),
      procedure: readJson(a.procedure, 'procedure'),
      rawLedger: readJson(a.ledger, 'ledger'),
      sourceComment: readJson(a['source-comment'], 'source-comment'),
      observedMainHead: a['observed-main-head'],
      observedLedgerBlobSha: a['observed-ledger-blob-sha'],
      observedLockRefHead: a['observed-lock-ref-head']
    });
    write(a.output, plan);
    if (plan.result !== 'ADMITTED_AND_LOCKED') process.exitCode = 3;
  } catch (e) {
    write(a.output, stable({
      schema: 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_PLAN_v1',
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
