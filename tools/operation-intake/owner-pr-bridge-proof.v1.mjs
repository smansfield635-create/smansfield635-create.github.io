// H-Earth Gen3059: candidate proof implementation for the existing intake gate.
// This is a pure verification helper: no network calls, repository writes, or authority creation.
import { createHash } from 'node:crypto';

export const MARKER = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1';
export const CAPABILITY = 'H_EARTH_CANONICAL_OPERATION_INTAKE';
export const BRIDGE_WORKFLOW = '.github/workflows/ai-entry-workflow-dispatch-bridge.yml';
export const INTAKE_WORKFLOW = '.github/workflows/canonical-operation-intake-transport-v1.yml';
export const REQUEST_PATH = '.github/ai-entry/workflow-dispatch-request.json';
export const PREFIX = 'ai-dispatch-request-';
export const RECEIPT_RESULT = 'NATIVE_WORKFLOW_DISPATCH_ACCEPTED_AND_RUN_RESOLVED';
export const OWNER = 'smansfield635-create';
export const REPO = 'smansfield635-create/smansfield635-create.github.io';
export const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');

function fail(code) { const e = new Error(code); e.code = code; throw e; }
function equal(a,b) { return JSON.stringify(a) === JSON.stringify(b); }
function numeric(value) { return Number.isSafeInteger(value) && value > 0; }
function sha40(value) { return typeof value === 'string' && /^[0-9a-f]{40}$/.test(value); }

// Caller must retrieve the resources directly from GitHub's API, at exact immutable refs.
// Do not use caller-supplied snapshots as trusted proof in production.
export function verifyOwnerPrBridgeProof({
  body, operation, receipt, pr, requestFile, requestCommit, changedFiles,
  bridgeRun, intakeRun, callbackIssue, expectedCurrentMain
}) {
  if (typeof body !== 'string' || !body.startsWith(`${MARKER}\n`)) fail('CANONICAL_MARKER_MISSING');
  if (!operation || !receipt || !pr || !requestFile || !requestCommit || !bridgeRun || !intakeRun) fail('PROOF_RESOURCE_MISSING');
  if (typeof callbackIssue !== 'string' || !/^[1-9]\d*$/.test(callbackIssue)) fail('CALLBACK_ISSUE_INVALID');
  if (!sha40(expectedCurrentMain)) fail('GOVERNING_HEAD_INVALID');
  const envelope = JSON.parse(body.slice(MARKER.length).trim());
  if (envelope.schema !== 'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1' || !envelope.operationRequest || !envelope.constructionProcedure) fail('CANONICAL_ENVELOPE_INVALID');
  if (envelope.operationRequest.exactGoverningHead !== expectedCurrentMain || envelope.constructionProcedure.exactGoverningHead !== expectedCurrentMain) fail('GOVERNING_HEAD_MISMATCH');
  if (envelope.operationRequest.operationId !== operation) fail('OPERATION_MISMATCH');

  if (receipt.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_RECEIPT_v1' || receipt.result !== RECEIPT_RESULT || receipt.capabilityId !== CAPABILITY || receipt.repository !== REPO) fail('BRIDGE_RECEIPT_INVALID');
  if (receipt.workflow !== INTAKE_WORKFLOW.replace('.github/workflows/','') || receipt.ref !== 'main') fail('WRONG_DISPATCH_TARGET');
  if (receipt.requestParentWasCurrent !== true || receipt.currentMainSha !== expectedCurrentMain || receipt.requestCommitParent !== expectedCurrentMain) fail('PARENT_OR_MAIN_MISMATCH');
  if (!numeric(receipt.transportPullRequest) || !numeric(receipt.bridgeRunId) || !numeric(receipt.dispatchedRunId)) fail('BRIDGE_IDENTITY_INVALID');
  if (receipt.inputs?.request_json !== body || receipt.inputs?.router_callback_issue !== callbackIssue || receipt.inputs?.router_callback_repository !== REPO) fail('BRIDGE_INPUTS_MISMATCH');
  if (!sha40(receipt.requestCommit) || !receipt.requestBranch?.startsWith(PREFIX)) fail('REQUEST_COMMIT_OR_BRANCH_INVALID');

  if (pr.number !== receipt.transportPullRequest || pr.user?.login !== OWNER || pr.head?.repo?.full_name !== REPO || pr.base?.repo?.full_name !== REPO || pr.base?.ref !== 'main') fail('PR_OWNER_OR_REPOSITORY_INVALID');
  if (pr.head?.ref !== receipt.requestBranch || pr.head?.sha !== receipt.requestCommit || pr.merged !== false) fail('PR_REQUEST_HEAD_INVALID');
  if (requestCommit.sha !== receipt.requestCommit || requestCommit.parents?.length !== 1 || requestCommit.parents[0]?.sha !== expectedCurrentMain) fail('REQUEST_COMMIT_PARENT_INVALID');
  if (!Array.isArray(changedFiles) || changedFiles.length !== 1 || changedFiles[0]?.filename !== REQUEST_PATH || changedFiles[0]?.status !== 'modified') fail('REQUEST_PATH_EXPANSION');
  if (requestFile.ref !== receipt.requestCommit || requestFile.path !== REQUEST_PATH) fail('REQUEST_FILE_REF_INVALID');
  if (typeof requestFile.content !== 'string') fail('REQUEST_FILE_CONTENT_MISSING');
  const request = JSON.parse(requestFile.content);
  if (request.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_REQUEST_v1' || request.requestId !== receipt.requestId || request.capabilityId !== CAPABILITY) fail('PR_REQUEST_SCHEMA_MISMATCH');
  if (!equal(request.inputs, receipt.inputs)) fail('PR_REQUEST_INPUTS_MISMATCH');

  if (bridgeRun.id !== receipt.bridgeRunId || bridgeRun.event !== 'pull_request' || bridgeRun.path !== BRIDGE_WORKFLOW || bridgeRun.head_sha !== receipt.requestCommit || bridgeRun.conclusion !== 'success' || bridgeRun.actor?.login !== OWNER) fail('BRIDGE_RUN_NOT_AUTHENTICATED');
  if (intakeRun.id !== receipt.dispatchedRunId || intakeRun.event !== 'workflow_dispatch' || intakeRun.path !== INTAKE_WORKFLOW || intakeRun.head_sha !== expectedCurrentMain || intakeRun.actor?.login !== 'github-actions[bot]') fail('INTAKE_RUN_NOT_AUTHENTICATED');
  if (receipt.requestCommit !== requestCommit.sha) fail('COMMIT_BINDING_INVALID');
  return Object.freeze({schema:'CANONICAL_OWNER_PR_DISPATCH_AUTHORITY_PROOF_v1',result:'AUTHENTICATED',sourceKind:'OWNER_PR_BRIDGE',sourcePr:pr.number,requestCommit:receipt.requestCommit,requestBodySha256:sha256(body),bridgeRunId:bridgeRun.id,dispatchRunId:intakeRun.id,governingHead:expectedCurrentMain,operationId:operation});
}
