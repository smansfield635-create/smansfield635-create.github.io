#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planOwnerConnectorAdmission } from './owner-connector-canonical-intake.v1.mjs';
import {
  LEDGER_PATH,
  LOCK_REF,
  canonical,
  ledger,
  stable,
  text,
  verifyCanonicalLockRefLineage
} from './repository-operation-lock-manager.v1.mjs';
import { verifyCanonicalLedgerCommitV2 } from './repository-operation-lock-lineage.v2.mjs';

export const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
export const SOURCE_MARKER = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1';
export const RECEIPT_SCHEMA = 'OWNER_AUTHENTICATED_CANONICAL_INTAKE_EXECUTION_RECEIPT_v1';
export const ADMISSION_RECEIPT_SCHEMA = 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1';
export const ROUTE_ID = 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_EXECUTOR_V1';
const OWNER_LOGIN = 'smansfield635-create';
const REQUIRED_ARGS = Object.freeze(['source-comment-id','expected-main-head','output']);

function fail(code, detail = null, mutationMayHaveCommitted = false) {
  const error = new Error(code);
  Object.assign(error, { code, detail, mutationMayHaveCommitted });
  throw error;
}
function digest40(value, field) {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/.test(value)) fail('INVALID_DIGEST', field);
  return value;
}
function positiveInteger(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) fail('INVALID_POSITIVE_INTEGER', field);
  return n;
}
function branchFromRef(ref) {
  if (ref !== LOCK_REF || !ref.startsWith('refs/heads/')) fail('LOCK_REF_IDENTITY_INVALID');
  return ref.slice('refs/heads/'.length);
}
function baseUrl() { return `https://api.github.com/repos/${REPOSITORY}`; }
function headers(token) {
  if (!token) fail('GITHUB_TOKEN_MISSING');
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };
}
async function requestJson(url, options = {}, accepted = [200]) {
  const response = await fetch(url, options);
  const raw = await response.text();
  let body = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = { raw }; }
  if (!accepted.includes(response.status)) {
    const error = new Error(`GITHUB_API_ERROR:${response.status}`);
    Object.assign(error, { code: 'GITHUB_API_ERROR', status: response.status, detail: body });
    throw error;
  }
  return body;
}
function decodeLedgerFile(file, source = 'contents-api') {
  if (!file || typeof file.sha !== 'string') fail('LEDGER_READBACK_INVALID', source);
  if (typeof file.content !== 'string' || !file.content.replace(/\s/g, '')) return null;
  try {
    return {
      blobSha: digest40(file.sha, 'ledgerBlobSha'),
      ledger: ledger(JSON.parse(Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')))
    };
  } catch (error) {
    if (error.code) throw error;
    fail('LEDGER_JSON_DECODE_FAILURE', error.message);
  }
}

export function createGitHubApi(token = process.env.GITHUB_TOKEN) {
  const h = headers(token);
  const root = baseUrl();
  const lockBranch = branchFromRef(LOCK_REF);
  const lockRefName = encodeURIComponent(`heads/${lockBranch}`);
  const ledgerPath = LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  return {
    async getMainHead() {
      const value = await requestJson(`${root}/git/ref/heads/main`, { headers: h });
      return digest40(value?.object?.sha, 'mainHead');
    },
    async getSourceComment(commentId) {
      return requestJson(`${root}/issues/comments/${positiveInteger(commentId, 'sourceCommentId')}`, { headers: h });
    },
    async getLockRefHead() {
      const value = await requestJson(`${root}/git/ref/${lockRefName}`, { headers: h });
      return digest40(value?.object?.sha, 'lockRefHead');
    },
    async getLedgerAtRef(ref) {
      const exactRef = digest40(ref, 'ledgerRef');
      const file = await requestJson(`${root}/contents/${ledgerPath}?ref=${encodeURIComponent(exactRef)}`, { headers: h });
      const inline = decodeLedgerFile(file);
      if (inline) return inline;
      const blobSha = digest40(file?.sha, 'ledgerBlobSha');
      const blob = await requestJson(`${root}/git/blobs/${blobSha}`, { headers: h });
      if (blob?.encoding !== 'base64' || typeof blob.content !== 'string') fail('LEDGER_BLOB_ENCODING_UNSUPPORTED');
      return {
        blobSha,
        ledger: ledger(JSON.parse(Buffer.from(blob.content.replace(/\s/g, ''), 'base64').toString('utf8')))
      };
    },
    async getGitCommit(commitSha) {
      return requestJson(`${root}/git/commits/${digest40(commitSha, 'commitSha')}`, { headers: h });
    },
    async createBlob(contents) {
      const value = await requestJson(`${root}/git/blobs`, {
        method: 'POST', headers: h, body: JSON.stringify({ content: contents, encoding: 'utf-8' })
      }, [201]);
      return digest40(value?.sha, 'createdBlobSha');
    },
    async createTree(baseTreeSha, ledgerBlobSha) {
      const value = await requestJson(`${root}/git/trees`, {
        method: 'POST', headers: h,
        body: JSON.stringify({
          base_tree: digest40(baseTreeSha, 'baseTreeSha'),
          tree: [{ path: LEDGER_PATH, mode: '100644', type: 'blob', sha: digest40(ledgerBlobSha, 'ledgerBlobSha') }]
        })
      }, [201]);
      return digest40(value?.sha, 'createdTreeSha');
    },
    async createCommit(treeSha, parentSha, message) {
      const value = await requestJson(`${root}/git/commits`, {
        method: 'POST', headers: h,
        body: JSON.stringify({
          message,
          tree: digest40(treeSha, 'treeSha'),
          parents: [digest40(parentSha, 'parentSha')]
        })
      }, [201]);
      return digest40(value?.sha, 'createdCommitSha');
    },
    async updateLockRef(commitSha) {
      try {
        const value = await requestJson(`${root}/git/refs/${lockRefName}`, {
          method: 'PATCH', headers: h,
          body: JSON.stringify({ sha: digest40(commitSha, 'commitSha'), force: false })
        }, [200]);
        return { ok: true, head: digest40(value?.object?.sha, 'updatedLockRefHead') };
      } catch (error) {
        if (error.status === 409 || error.status === 422) {
          return { ok: false, errorCode: 'LOCK_REF_COMPARE_AND_SWAP_CONFLICT', httpStatus: error.status };
        }
        throw error;
      }
    },
    async getCommitDetail(commitSha) {
      return requestJson(`${root}/commits/${digest40(commitSha, 'commitSha')}`, { headers: h });
    }
  };
}

function parseSourceEnvelope(comment) {
  const body = comment?.body;
  if (comment?.user?.login !== OWNER_LOGIN || comment?.author_association !== 'OWNER') fail('SOURCE_COMMENT_NOT_OWNER');
  if (typeof body !== 'string' || body.split(/\r?\n/, 1)[0].trim() !== SOURCE_MARKER) fail('SOURCE_MARKER_MISMATCH');
  let envelope;
  try { envelope = JSON.parse(body.slice(body.indexOf('\n') + 1).trim()); }
  catch (error) { fail('SOURCE_ENVELOPE_INVALID', error.message); }
  if (!envelope?.operationRequest || !envelope?.constructionProcedure) fail('SOURCE_ENVELOPE_INCOMPLETE');
  const issueNumber = Number(String(comment.issue_url || '').split('/').pop());
  if (!Number.isInteger(issueNumber) || issueNumber < 1) fail('SOURCE_ISSUE_IDENTITY_INVALID');
  return { body, envelope, issueNumber };
}
function exactChangedPaths(detail) {
  const files = Array.isArray(detail?.files) ? detail.files : [];
  return files.map(file => file?.filename).filter(Boolean);
}
function rowMatchesPlan(row, plan) {
  if (!row) return false;
  return row.operationId === plan.operationId &&
    row.lockScope === plan.lockScope &&
    row.scopeHash === plan.scopeHash &&
    row.lockGeneration === plan.lockGeneration &&
    row.governingHead === plan.governingHead &&
    row.requestDigest === plan.requestDigest &&
    row.procedureLocatorDigest === plan.procedureLocatorDigest &&
    row.state === 'ADMITTED_LOCKED' && row.released === false &&
    canonical(row.independentAuthorityProvenance) === canonical(plan.independentAuthorityProvenance);
}
function admissionReceipt(plan, row) {
  return stable({
    schema: ADMISSION_RECEIPT_SCHEMA,
    gateId: 'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',
    result: 'ADMITTED_AND_LOCKED',
    errorCode: null,
    field: null,
    sourceDocument: null,
    operationId: plan.operationId,
    requestDigest: plan.requestDigest,
    procedureLocatorDigest: plan.procedureLocatorDigest,
    operationStarted: true,
    branchCreationAuthorized: true,
    repositoryWritesAuthorized: true,
    workflowExecutionAuthorized: true,
    implementationInferenceAuthorized: false,
    lock: row
  });
}
function auditFactory() {
  const events = [];
  return { events, add(event, details = {}) { events.push({ sequence: events.length + 1, event, details: stable(details) }); } };
}

export async function executeOwnerConnectorAdmission(input, dependencies = {}) {
  const audit = auditFactory();
  let mutationCommitted = false;
  let plan = null;
  let createdCommitSha = null;
  const api = dependencies.api || createGitHubApi();
  const planner = dependencies.planner || planOwnerConnectorAdmission;
  const verifyCommit = dependencies.verifyCommit || verifyCanonicalLedgerCommitV2;
  const verifyLineage = dependencies.verifyLineage || verifyCanonicalLockRefLineage;
  try {
    const sourceCommentId = positiveInteger(input?.sourceCommentId, 'sourceCommentId');
    const expectedMainHead = digest40(input?.expectedMainHead, 'expectedMainHead');
    audit.add('EXECUTION_INPUT_VALIDATED', { sourceCommentId, expectedMainHead, repository: REPOSITORY, lockRef: LOCK_REF });

    const currentMain = await api.getMainHead();
    if (currentMain !== expectedMainHead) fail('GOVERNING_HEAD_MISMATCH', { expectedMainHead, currentMain });
    const sourceComment = await api.getSourceComment(sourceCommentId);
    const source = parseSourceEnvelope(sourceComment);
    if (source.envelope.operationRequest.exactGoverningHead !== expectedMainHead || source.envelope.constructionProcedure.exactGoverningHead !== expectedMainHead) {
      fail('GOVERNING_HEAD_MISMATCH', 'source request/procedure not bound to expected current main');
    }
    audit.add('OWNER_SOURCE_AUTHENTICATED', { sourceCommentId, issueNumber: source.issueNumber });

    const observedLockRefHead = await api.getLockRefHead();
    const observed = await api.getLedgerAtRef(observedLockRefHead);
    audit.add('CANONICAL_STATE_OBSERVED', { observedLockRefHead, observedLedgerBlobSha: observed.blobSha, ledgerGeneration: observed.ledger.lockGeneration });

    plan = planner({
      request: source.envelope.operationRequest,
      procedure: source.envelope.constructionProcedure,
      rawLedger: observed.ledger,
      sourceComment: {
        id: sourceComment.id,
        issueNumber: source.issueNumber,
        body: source.body,
        user: { login: sourceComment.user.login },
        author_association: sourceComment.author_association
      },
      observedMainHead: currentMain,
      observedLedgerBlobSha: observed.blobSha,
      observedLockRefHead
    });
    if (plan?.result !== 'ADMITTED_AND_LOCKED' || plan?.ledgerMutationAuthorized !== true || plan?.exactMutationPath !== LEDGER_PATH) {
      fail(plan?.result === 'ACTIVE_SCOPE_ALREADY_LOCKED' ? 'ACTIVE_SCOPE_ALREADY_LOCKED' : 'PLANNER_DID_NOT_AUTHORIZE_LEDGER_MUTATION', plan?.errorCode || plan?.result || null);
    }
    audit.add('CANONICAL_PLAN_PRODUCED', { operationId: plan.operationId, lockGeneration: plan.lockGeneration, planIsReceipt: false });

    const preWriteMain = await api.getMainHead();
    if (preWriteMain !== expectedMainHead) fail('GOVERNING_HEAD_MISMATCH', { expectedMainHead, preWriteMain });
    const preWriteLockRefHead = await api.getLockRefHead();
    if (preWriteLockRefHead !== observedLockRefHead) fail('LOCK_REF_COMPARE_AND_SWAP_CONFLICT', { observedLockRefHead, preWriteLockRefHead });
    const preWriteLedger = await api.getLedgerAtRef(observedLockRefHead);
    if (preWriteLedger.blobSha !== observed.blobSha) fail('LEDGER_COMPARE_AND_SWAP_CONFLICT', { observedLedgerBlobSha: observed.blobSha, preWriteLedgerBlobSha: preWriteLedger.blobSha });
    audit.add('WRITE_BOUNDARY_REVALIDATED', { mainHead: preWriteMain, lockRefHead: preWriteLockRefHead, ledgerBlobSha: preWriteLedger.blobSha });

    const parentCommit = await api.getGitCommit(observedLockRefHead);
    const baseTreeSha = digest40(parentCommit?.tree?.sha, 'baseTreeSha');
    const nextLedgerBlobSha = await api.createBlob(text(plan.nextLedger));
    const nextTreeSha = await api.createTree(baseTreeSha, nextLedgerBlobSha);
    createdCommitSha = await api.createCommit(nextTreeSha, observedLockRefHead, plan.commitMessage);
    audit.add('CANDIDATE_LEDGER_COMMIT_MATERIALIZED', { createdCommitSha, parent: observedLockRefHead, ledgerBlobSha: nextLedgerBlobSha, message: plan.commitMessage });

    const finalMain = await api.getMainHead();
    if (finalMain !== expectedMainHead) fail('GOVERNING_HEAD_MISMATCH', { expectedMainHead, finalMain });
    const finalPreCasLockHead = await api.getLockRefHead();
    if (finalPreCasLockHead !== observedLockRefHead) fail('LOCK_REF_COMPARE_AND_SWAP_CONFLICT', { observedLockRefHead, finalPreCasLockHead });
    const update = await api.updateLockRef(createdCommitSha);
    if (!update?.ok || update.head !== createdCommitSha) fail(update?.errorCode || 'LOCK_REF_COMPARE_AND_SWAP_CONFLICT', update || null);
    mutationCommitted = true;
    audit.add('LOCK_REF_CAS_COMMITTED', { createdCommitSha });

    const readbackHead = await api.getLockRefHead();
    if (readbackHead !== createdCommitSha) fail('READBACK_MISMATCH', { expected: createdCommitSha, observed: readbackHead }, true);
    const readback = await api.getLedgerAtRef(createdCommitSha);
    if (readback.blobSha !== nextLedgerBlobSha) fail('READBACK_MISMATCH', { expectedLedgerBlobSha: nextLedgerBlobSha, observedLedgerBlobSha: readback.blobSha }, true);
    const detail = await api.getCommitDetail(createdCommitSha);
    const parents = Array.isArray(detail?.parents) ? detail.parents : [];
    const changedPaths = exactChangedPaths(detail);
    if (detail?.sha !== createdCommitSha || parents.length !== 1 || parents[0]?.sha !== observedLockRefHead) fail('READBACK_MISMATCH', 'commit identity/parent mismatch', true);
    if (detail?.commit?.message !== plan.commitMessage) fail('READBACK_MISMATCH', 'canonical commit message mismatch', true);
    if (changedPaths.length !== 1 || changedPaths[0] !== LEDGER_PATH) fail('NON_LEDGER_MUTATION', changedPaths, true);
    const changedLedgerFile = detail.files.find(file => file.filename === LEDGER_PATH);
    if (changedLedgerFile?.sha !== nextLedgerBlobSha) fail('READBACK_MISMATCH', 'commit ledger blob mismatch', true);
    if (readback.ledger.lockGeneration !== plan.lockGeneration) fail('READBACK_MISMATCH', 'ledger generation mismatch', true);
    const row = readback.ledger.activeScopes?.[plan.scopeHash];
    if (!rowMatchesPlan(row, plan)) fail('READBACK_MISMATCH', 'active lock/provenance mismatch', true);

    const commitVerification = verifyCommit({ commit: detail, changedPaths, resultingLedger: readback.ledger });
    if (commitVerification?.result !== 'CANONICAL_LEDGER_COMMIT_VERIFIED') fail('READBACK_MISMATCH', 'canonical ledger commit verification failed', true);
    const lineageVerification = await verifyLineage({ repository: REPOSITORY, token: process.env.GITHUB_TOKEN || 'DEPENDENCY_INJECTED', branchHead: createdCommitSha, anchorCommitSha: observedLockRefHead });
    if (lineageVerification?.result !== 'CANONICAL_LOCK_REF_LINEAGE_VERIFIED') fail('READBACK_MISMATCH', 'canonical lock-ref lineage verification failed', true);
    audit.add('READBACK_AND_LINEAGE_VERIFIED', { operationId: plan.operationId, lockGeneration: plan.lockGeneration, commitVerification: commitVerification.result, lineageVerification: lineageVerification.result });

    return stable({
      schema: RECEIPT_SCHEMA,
      result: 'ADMITTED_AND_LOCKED',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: LOCK_REF,
      operationId: plan.operationId,
      lockScope: plan.lockScope,
      scopeHash: plan.scopeHash,
      lockGeneration: plan.lockGeneration,
      governingHead: plan.governingHead,
      requestDigest: plan.requestDigest,
      procedureLocatorDigest: plan.procedureLocatorDigest,
      sourceCommentId,
      observedLedgerBlobSha: observed.blobSha,
      observedLockRefHead,
      committedLedgerBlobSha: nextLedgerBlobSha,
      acquisitionCommitSha: createdCommitSha,
      planWasReceipt: false,
      plannerSemanticsDuplicated: false,
      directUnplannedLedgerMutation: false,
      repositoryMutationLimitedToCanonicalLedger: true,
      githubActionsAgentTransport: false,
      readbackVerified: true,
      canonicalAdmissionReceipt: admissionReceipt(plan, row),
      auditEvents: audit.events
    });
  } catch (error) {
    return stable({
      schema: RECEIPT_SCHEMA,
      result: mutationCommitted || error.mutationMayHaveCommitted ? 'FAIL_CLOSED_AFTER_MUTATION_REQUIRES_RECOVERY' : 'FAIL_CLOSED_NO_ADMISSION',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: LOCK_REF,
      errorCode: error.code || 'UNEXPECTED_EXECUTOR_FAILURE',
      detail: error.detail ?? error.message,
      operationId: plan?.operationId ?? null,
      lockGeneration: plan?.lockGeneration ?? null,
      acquisitionCommitSha: createdCommitSha,
      planWasReceipt: false,
      plannerSemanticsDuplicated: false,
      directUnplannedLedgerMutation: false,
      repositoryMutationLimitedToCanonicalLedger: true,
      githubActionsAgentTransport: false,
      mutationMayHaveCommitted: mutationCommitted || error.mutationMayHaveCommitted === true,
      canonicalAdmissionReceipt: null,
      auditEvents: audit.events
    });
  }
}

function parseArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value === undefined) fail('CLI_ARGUMENTS_INVALID');
    const name = key.slice(2);
    if (!REQUIRED_ARGS.includes(name) || Object.hasOwn(values, name)) fail('CLI_ARGUMENTS_NOT_FIXED', name);
    values[name] = value;
  }
  if (Object.keys(values).length !== REQUIRED_ARGS.length || REQUIRED_ARGS.some(key => !values[key])) fail('CLI_ARGUMENTS_INCOMPLETE');
  return values;
}
function runtimeOutput(value) {
  const root = path.resolve(process.env.RUNNER_TEMP || '/tmp');
  const resolved = path.resolve(value);
  if (!(resolved === root || resolved.startsWith(`${root}${path.sep}`))) fail('OUTPUT_PATH_OUTSIDE_RUNTIME_TEMP');
  return resolved;
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const receipt = await executeOwnerConnectorAdmission({
    sourceCommentId: args['source-comment-id'],
    expectedMainHead: args['expected-main-head']
  });
  const output = runtimeOutput(args.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, text(receipt));
  if (receipt.result !== 'ADMITTED_AND_LOCKED') process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(text({ schema: RECEIPT_SCHEMA, result: 'FAIL_CLOSED_NO_ADMISSION', errorCode: error.code || 'UNEXPECTED_PROCESS_FAILURE', detail: error.message }));
    process.exitCode = 1;
  });
}
