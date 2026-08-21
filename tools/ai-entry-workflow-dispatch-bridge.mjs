import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const requestCommit = process.env.GITHUB_SHA;
const runId = process.env.GITHUB_RUN_ID || '';
const registryPath = '.github/ai-router/workflow-dispatch-capability.v1.json';
const requestPath = '.github/ai-entry/workflow-dispatch-request.json';
const receiptPath = '.github/ai-entry/workflow-dispatch-receipt.json';

const fail = (message) => { throw new Error(message); };
const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const gh = async (path, options = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    fail(`GitHub API ${response.status} ${path}: ${body}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

if (!repo || !token || !requestCommit) fail('Missing GitHub execution environment');
const registry = readJson(registryPath);
const request = readJson(requestPath);
if (registry.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_CAPABILITY_v1' || registry.status !== 'ACTIVE_FAIL_CLOSED') fail('Dispatch capability registry is not active');
if (request.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_REQUEST_v1') fail('Request schema mismatch');
if (!request.requestId || !request.capabilityId) fail('requestId and capabilityId are required');

const capability = registry.capabilities?.[request.capabilityId];
if (!capability) fail(`Unknown capabilityId: ${request.capabilityId}`);
if (request.workflow && request.workflow !== capability.workflow) fail('Request may not override workflow');
if (request.ref && request.ref !== capability.ref) fail('Request may not override ref');

const [owner, name] = repo.split('/');
const main = await gh(`/repos/${owner}/${name}/commits/main`);
const currentMainSha = main.sha;
const parentSha = execFileSync('git', ['rev-parse', 'HEAD^'], { encoding: 'utf8' }).trim();
if (parentSha !== currentMainSha) fail(`Stale dispatch branch: request parent ${parentSha} != current main ${currentMainSha}`);

const declaredInputs = request.inputs || {};
const inputPolicy = capability.inputPolicy || {};
for (const key of Object.keys(declaredInputs)) {
  if (!Object.hasOwn(inputPolicy, key)) fail(`Undeclared input: ${key}`);
  if (inputPolicy[key]?.source !== 'REQUEST') fail(`Input may not be user supplied: ${key}`);
}

const inputs = {};
for (const [key, policy] of Object.entries(inputPolicy)) {
  if (policy.source === 'CURRENT_MAIN_SHA') inputs[key] = currentMainSha;
  else if (policy.source === 'REQUEST') {
    const value = declaredInputs[key];
    if (policy.required && (value === undefined || value === null || value === '')) fail(`Missing required input: ${key}`);
    if (value !== undefined) inputs[key] = String(value);
  } else fail(`Unsupported input source for ${key}`);
}

const workflow = capability.workflow;
const ref = capability.ref;
const runsBefore = await gh(`/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/runs?event=workflow_dispatch&branch=${encodeURIComponent(ref)}&per_page=20`);
const priorIds = new Set((runsBefore.workflow_runs || []).map(run => run.id));
const dispatchedAt = new Date().toISOString();

await gh(`/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ref, inputs })
});

let dispatchedRun = null;
for (let attempt = 0; attempt < 30; attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const runs = await gh(`/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/runs?event=workflow_dispatch&branch=${encodeURIComponent(ref)}&per_page=20`);
  dispatchedRun = (runs.workflow_runs || []).find(run => !priorIds.has(run.id) && run.head_sha === currentMainSha) || null;
  if (dispatchedRun) break;
}
if (!dispatchedRun) fail(`Native dispatch was accepted but run id was not resolved for ${workflow}`);

const receipt = {
  schema: 'AI_ENTRY_WORKFLOW_DISPATCH_RECEIPT_v1',
  result: registry.continuity.receiptResult,
  requestId: request.requestId,
  capabilityId: request.capabilityId,
  repository: repo,
  requestCommit,
  requestCommitParent: parentSha,
  currentMainSha,
  workflow,
  ref,
  inputs,
  bridgeRunId: runId,
  dispatchedRunId: dispatchedRun.id,
  dispatchedRunUrl: dispatchedRun.html_url,
  dispatchedRunHeadSha: dispatchedRun.head_sha,
  dispatchedAt,
  resolvedAt: new Date().toISOString()
};

fs.mkdirSync('.github/ai-entry', { recursive: true });
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
