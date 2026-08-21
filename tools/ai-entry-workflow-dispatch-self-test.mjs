import fs from 'node:fs';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const readText = path => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const registry = readJson('.github/ai-router/workflow-dispatch-capability.v1.json');
const shared = readJson('.github/ai-router/shared-procedures.v1.json');
const workflow = readText('.github/workflows/ai-entry-workflow-dispatch-bridge.yml');
const runtime = readText('tools/ai-entry-workflow-dispatch-bridge.mjs');

assert(registry.schema === 'AI_ENTRY_WORKFLOW_DISPATCH_CAPABILITY_v1', 'registry schema mismatch');
assert(registry.status === 'ACTIVE_FAIL_CLOSED', 'registry must fail closed');
assert(registry.preferredTransport === 'DIRECT_CONNECTED_GITHUB_WORKFLOW_DISPATCH', 'direct dispatch must remain preferred');
assert(registry.fallbackTransport === 'SAME_REPOSITORY_PR_TARGET_NATIVE_WORKFLOW_DISPATCH_BRIDGE', 'fallback transport drifted');
assert(registry.requestBranchPrefix === 'ai-dispatch/', 'dispatch branch prefix drifted');
assert(registry.requestPath === '.github/ai-entry/workflow-dispatch-request.json', 'request path drifted');
assert(registry.receiptBranch === 'ai-dispatch-receipts', 'receipt branch drifted');
assert(registry.receiptPathTemplate === '.github/ai-entry/receipts/<requestId>.json', 'receipt path template drifted');
assert(registry.transportPullRequest?.base === 'main', 'transport PR base drifted');
assert(registry.transportPullRequest?.headPrefix === 'ai-dispatch/', 'transport PR head prefix drifted');
assert(registry.transportPullRequest?.autoDeleteHeadBranchOnSuccess === true, 'successful request branches must be deleted');
assert(registry.continuity?.transportPullRequestMayNeverBeMerged === true, 'transport PR merge prohibition must remain explicit');
assert(registry.continuity?.successfulTransportLeavesNoRequestBranch === true, 'successful transport must not leave a request branch');
assert(registry.capabilities?.PAGES_EXACT_HEAD_DEPLOY?.workflow === 'pages-direct-deploy.yml', 'Pages deploy capability drifted');
assert(registry.capabilities?.PAGES_EXACT_HEAD_DEPLOY?.inputPolicy?.target_sha?.source === 'CURRENT_MAIN_SHA', 'Pages deploy target must bind current main');
assert(registry.continuity?.dispatchRunIdMustBeRecovered === true, 'run id recovery must remain mandatory');
assert(registry.continuity?.receiptResult === 'NATIVE_WORKFLOW_DISPATCH_ACCEPTED_AND_RUN_RESOLVED', 'success receipt result drifted');

const procedure = shared.procedures?.find(p => p.procedureId === 'AI_ENTRY_NATIVE_WORKFLOW_DISPATCH');
assert(procedure, 'shared AI entry dispatch procedure missing');
assert(procedure.capabilityRegistry === '.github/ai-router/workflow-dispatch-capability.v1.json', 'shared procedure registry binding drifted');
assert(procedure.fallbackTransport === registry.fallbackTransport, 'shared procedure fallback transport drifted');

for (const token of [
  'pull_request_target:',
  '.github/ai-entry/workflow-dispatch-request.json',
  "startsWith(github.event.pull_request.head.ref, 'ai-dispatch/')",
  'actions: write',
  'contents: write',
  'pull-requests: write',
  'REQUEST_COMMIT:',
  'PULL_REQUEST_NUMBER:',
  'node tools/ai-entry-workflow-dispatch-bridge.mjs'
]) assert(workflow.includes(token), `bridge workflow missing ${token}`);

for (const token of [
  '/actions/workflows/',
  '/dispatches',
  'workflow_dispatch',
  'currentMainSha',
  'requestCommitParent',
  'dispatchedRunId',
  'registry.continuity.receiptResult',
  'registry.receiptBranch',
  'registry.receiptPathTemplate',
  'requestBranch.startsWith(registry.requestBranchPrefix)',
  "state: 'closed'",
  "method: 'DELETE'"
]) assert(runtime.includes(token), `bridge runtime missing ${token}`);

for (const forbidden of ['child_process.exec(', 'eval(', 'request.command', 'request.workflow ||']) {
  assert(!runtime.includes(forbidden), `generic command/workflow authority detected: ${forbidden}`);
}

console.log(JSON.stringify({
  schema: 'AI_ENTRY_WORKFLOW_DISPATCH_SELF_TEST_RECEIPT_v1',
  result: 'PASS',
  capabilityCount: Object.keys(registry.capabilities || {}).length,
  preferredTransport: registry.preferredTransport,
  fallbackTransport: registry.fallbackTransport,
  requestBranchPrefix: registry.requestBranchPrefix,
  runIdRecoveryRequired: registry.continuity.dispatchRunIdMustBeRecovered,
  successReceiptResult: registry.continuity.receiptResult
}, null, 2));
