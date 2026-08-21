import fs from 'node:fs';

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const requestCommit = process.env.REQUEST_COMMIT;
const requestBranch = process.env.REQUEST_BRANCH;
const pullRequestNumber = Number(process.env.PULL_REQUEST_NUMBER || 0);
const bridgeRunId = process.env.GITHUB_RUN_ID || '';
const registryPath = '.github/ai-router/workflow-dispatch-capability.v1.json';
const requestPath = '.github/ai-entry/workflow-dispatch-request.json';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const ghResponse = async (path, options = {}) => fetch(`https://api.github.com${path}`, {
  ...options,
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    ...(options.headers || {})
  }
});
const gh = async (path, options = {}) => {
  const response = await ghResponse(path, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} ${path}: ${body}`);
  }
  if (response.status === 204) return null;
  return response.json();
};
const contentPath = path => path.split('/').map(encodeURIComponent).join('/');
const refPath = branch => branch.split('/').map(encodeURIComponent).join('/');
const decodeContent = payload => Buffer.from((payload.content || '').replace(/\n/g, ''), 'base64').toString('utf8');

let registry;
let request = {};
let currentMainSha = null;

const ensureReceiptBranch = async (owner, name, receiptBranch, seedSha) => {
  const endpoint = `/repos/${owner}/${name}/git/ref/heads/${refPath(receiptBranch)}`;
  const existing = await ghResponse(endpoint);
  if (existing.ok) return;
  if (existing.status !== 404) throw new Error(`Unable to inspect receipt branch: ${existing.status} ${await existing.text()}`);
  await gh(`/repos/${owner}/${name}/git/refs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${receiptBranch}`, sha: seedSha })
  });
};

const persistReceipt = async receipt => {
  if (!repo || !token || !registry) throw new Error('Cannot persist receipt without repository, token, and registry');
  const [owner, name] = repo.split('/');
  const receiptBranch = registry.receiptBranch;
  const safeRequestId = String(receipt.requestId || `failed-${bridgeRunId || Date.now()}`).replace(/[^A-Za-z0-9._-]/g, '_');
  const receiptPath = registry.receiptPathTemplate.replace('<requestId>', safeRequestId);
  await ensureReceiptBranch(owner, name, receiptBranch, currentMainSha || requestCommit);
  const endpoint = `/repos/${owner}/${name}/contents/${contentPath(receiptPath)}`;
  const existing = await ghResponse(`${endpoint}?ref=${encodeURIComponent(receiptBranch)}`);
  let sha;
  if (existing.ok) sha = (await existing.json()).sha;
  else if (existing.status !== 404) throw new Error(`Unable to inspect existing receipt: ${existing.status} ${await existing.text()}`);
  const body = {
    message: `AI workflow dispatch receipt: ${safeRequestId}`,
    content: Buffer.from(`${JSON.stringify(receipt, null, 2)}\n`, 'utf8').toString('base64'),
    branch: receiptBranch
  };
  if (sha) body.sha = sha;
  await gh(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  console.log(JSON.stringify({ ...receipt, receiptBranch, receiptPath }, null, 2));
};

const main = async () => {
  if (!repo || !token || !requestCommit || !requestBranch || !pullRequestNumber) throw new Error('Missing GitHub PR-target execution environment');
  registry = readJson(registryPath);
  if (registry.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_CAPABILITY_v1' || registry.status !== 'ACTIVE_FAIL_CLOSED') throw new Error('Dispatch capability registry is not active');
  if (!requestBranch.startsWith(registry.requestBranchPrefix)) throw new Error(`Unexpected request branch: ${requestBranch}`);

  const [owner, name] = repo.split('/');
  currentMainSha = (await gh(`/repos/${owner}/${name}/commits/main`)).sha;
  const requestCommitPayload = await gh(`/repos/${owner}/${name}/commits/${requestCommit}`);
  const parentSha = requestCommitPayload.parents?.[0]?.sha;
  if (parentSha !== currentMainSha) throw new Error(`Stale dispatch request: parent ${parentSha} != current main ${currentMainSha}`);

  const requestPayload = await gh(`/repos/${owner}/${name}/contents/${contentPath(requestPath)}?ref=${encodeURIComponent(requestCommit)}`);
  request = JSON.parse(decodeContent(requestPayload));
  if (request.schema !== 'AI_ENTRY_WORKFLOW_DISPATCH_REQUEST_v1') throw new Error('Request schema mismatch');
  if (!request.requestId || !request.capabilityId) throw new Error('requestId and capabilityId are required');

  const capability = registry.capabilities?.[request.capabilityId];
  if (!capability) throw new Error(`Unknown capabilityId: ${request.capabilityId}`);
  if (request.workflow && request.workflow !== capability.workflow) throw new Error('Request may not override workflow');
  if (request.ref && request.ref !== capability.ref) throw new Error('Request may not override ref');

  const declaredInputs = request.inputs || {};
  const inputPolicy = capability.inputPolicy || {};
  for (const key of Object.keys(declaredInputs)) {
    if (!Object.hasOwn(inputPolicy, key)) throw new Error(`Undeclared input: ${key}`);
    if (inputPolicy[key]?.source !== 'REQUEST') throw new Error(`Input may not be user supplied: ${key}`);
  }

  const inputs = {};
  for (const [key, policy] of Object.entries(inputPolicy)) {
    if (policy.source === 'CURRENT_MAIN_SHA') inputs[key] = currentMainSha;
    else if (policy.source === 'REQUEST') {
      const value = declaredInputs[key];
      if (policy.required && (value === undefined || value === null || value === '')) throw new Error(`Missing required input: ${key}`);
      if (value !== undefined) inputs[key] = String(value);
    } else throw new Error(`Unsupported input source for ${key}`);
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
  if (!dispatchedRun) throw new Error(`Native dispatch was accepted but run id was not resolved for ${workflow}`);

  const receipt = {
    schema: 'AI_ENTRY_WORKFLOW_DISPATCH_RECEIPT_v1',
    result: registry.continuity.receiptResult,
    requestId: request.requestId,
    capabilityId: request.capabilityId,
    repository: repo,
    transportPullRequest: pullRequestNumber,
    requestBranch,
    requestCommit,
    requestCommitParent: parentSha,
    currentMainSha,
    workflow,
    ref,
    inputs,
    bridgeRunId,
    dispatchedRunId: dispatchedRun.id,
    dispatchedRunUrl: dispatchedRun.html_url,
    dispatchedRunHeadSha: dispatchedRun.head_sha,
    dispatchedAt,
    resolvedAt: new Date().toISOString()
  };
  await persistReceipt(receipt);

  if (registry.transportPullRequest?.autoCloseOnSuccess) {
    await gh(`/repos/${owner}/${name}/pulls/${pullRequestNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'closed' })
    });
  }
  if (registry.transportPullRequest?.autoDeleteHeadBranchOnSuccess) {
    await gh(`/repos/${owner}/${name}/git/refs/heads/${refPath(requestBranch)}`, { method: 'DELETE' });
  }
};

try {
  await main();
} catch (error) {
  const receipt = {
    schema: 'AI_ENTRY_WORKFLOW_DISPATCH_RECEIPT_v1',
    result: 'WORKFLOW_DISPATCH_FAILED',
    requestId: request.requestId || null,
    capabilityId: request.capabilityId || null,
    repository: repo || null,
    transportPullRequest: pullRequestNumber || null,
    requestBranch: requestBranch || null,
    requestCommit: requestCommit || null,
    currentMainSha,
    bridgeRunId,
    error: error instanceof Error ? error.message : String(error),
    failedAt: new Date().toISOString()
  };
  try { if (registry && (currentMainSha || requestCommit)) await persistReceipt(receipt); } catch (receiptError) {
    console.error(`Unable to persist failure receipt: ${receiptError instanceof Error ? receiptError.message : String(receiptError)}`);
  }
  console.error(receipt.error);
  process.exitCode = 1;
}
