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
assert(registry.requestBranch === 'ai-dispatch', 'dispatch branch drifted');
assert(registry.requestPath === '.github/ai-entry/workflow-dispatch-request.json', 'request path drifted');
assert(registry.receiptPath === '.github/ai-entry/workflow-dispatch-receipt.json', 'receipt path drifted');
assert(registry.capabilities?.PAGES_EXACT_HEAD_DEPLOY?.workflow === 'pages-direct-deploy.yml', 'Pages deploy capability drifted');
assert(registry.capabilities?.PAGES_EXACT_HEAD_DEPLOY?.inputPolicy?.target_sha?.source === 'CURRENT_MAIN_SHA', 'Pages deploy target must bind current main');
assert(registry.continuity?.dispatchRunIdMustBeRecovered === true, 'run id recovery must remain mandatory');
assert(registry.continuity?.directConnectorDispatchPreferredWhenAvailable === true, 'direct connector dispatch must remain preferred');
assert(registry.continuity?.receiptResult === 'NATIVE_WORKFLOW_DISPATCH_ACCEPTED_AND_RUN_RESOLVED', 'success receipt result drifted');

const procedure = shared.procedures?.find(p => p.procedureId === 'AI_ENTRY_NATIVE_WORKFLOW_DISPATCH');
assert(procedure, 'shared AI entry dispatch procedure missing');
assert(procedure.capabilityRegistry === '.github/ai-router/workflow-dispatch-capability.v1.json', 'shared procedure registry binding drifted');

for (const token of [
  'branches:\n      - ai-dispatch',
  '.github/ai-entry/workflow-dispatch-request.json',
  'actions: write',
  'contents: write',
  'node tools/ai-entry-workflow-dispatch-bridge.mjs',
  'workflow-dispatch-receipt.json'
]) assert(workflow.includes(token), `bridge workflow missing ${token}`);

for (const token of [
  '/actions/workflows/',
  '/dispatches',
  'workflow_dispatch',
  'currentMainSha',
  'requestCommitParent',
  'dispatchedRunId',
  'registry.continuity.receiptResult',
  'workflow-dispatch-receipt.json'
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
  runIdRecoveryRequired: registry.continuity.dispatchRunIdMustBeRecovered,
  successReceiptResult: registry.continuity.receiptResult
}, null, 2));
