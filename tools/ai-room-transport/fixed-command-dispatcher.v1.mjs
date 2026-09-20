#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  stable,
  hashObject,
  sha256,
  commandDigest,
  fail,
  readJson,
  writeJson,
  parseArgs,
  loadJsonAtIdentity,
  assertObject,
  assertRepositoryPath
} from './lib.v1.mjs';
import { resolveToolset } from './toolset-resolver.v1.mjs';
import { selectBackend } from './backend-selector.v1.mjs';
const PRE_ADMISSION_PACKET_COMPILER_DESCRIPTOR='CANONICAL_PACKET_COMPILER_EXECUTION_V1';

function run(command, args, options = {}) {
  const visible = options.visible === true;
  const result = cp.spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    encoding: visible ? undefined : 'utf8',
    stdio: visible ? 'inherit' : undefined,
    maxBuffer: 64 * 1024 * 1024
  });
  return {
    status: result.status ?? 1,
    stdout: visible ? '' : (result.stdout ?? ''),
    stderr: visible ? '' : (result.stderr ?? ''),
    error: result.error ? result.error.message : null,
    visible
  };
}

function git(root, args, allowFailure = false) {
  const result = run('git', args, { cwd: root, env: process.env });
  if (!allowFailure && (result.error || result.status !== 0)) fail('GIT_COMMAND_FAILED', `${args.join(' ')}:${result.stderr || result.error}`);
  return result;
}

function ensureToolingHead(root, head) {
  const present = git(root, ['cat-file', '-e', `${head}^{commit}`], true);
  if (present.status === 0) return;
  const fetched = git(root, ['fetch', '--no-tags', 'origin', head], true);
  if (fetched.status !== 0) fail('EXACT_TOOLING_HEAD_UNAVAILABLE', head);
  if (git(root, ['cat-file', '-e', `${head}^{commit}`], true).status !== 0) fail('EXACT_TOOLING_HEAD_UNAVAILABLE', head);
}

function safeEnvironment() {
  const keys = ['PATH', 'HOME', 'CI', 'RUNNER_TEMP', 'TMPDIR', 'TEMP', 'TMP', 'NODE_OPTIONS'];
  return Object.fromEntries(keys.filter(key => process.env[key] != null).map(key => [key, process.env[key]]));
}

export function buildFixedCommand(descriptor, inputs, payloadReceiptPath) {
  const specification = assertObject(descriptor.commandSpecification, 'COMMAND_SPECIFICATION_INVALID');
  if (specification.shell !== false) fail('SHELL_EXECUTION_PROHIBITED');
  if (specification.extraArgumentsAllowed !== false) fail('EXTRA_ARGUMENTS_PROHIBITION_MISSING');
  if (specification.environmentOverridesAllowed !== false) fail('ENVIRONMENT_OVERRIDE_PROHIBITION_MISSING');
  const executable = specification.executable;
  const scriptPath = assertRepositoryPath(specification.scriptPath, 'REGISTERED_SCRIPT_PATH_INVALID');
  const args = [scriptPath, ...(specification.fixedArguments ?? [])];
  for (const binding of specification.inputArgumentBindings ?? []) {
    if (!Object.hasOwn(inputs, binding.inputField)) fail('REGISTERED_INPUT_BINDING_MISSING', binding.inputField);
    args.push(binding.argument, String(inputs[binding.inputField]));
  }
  for (const binding of specification.outputArgumentBindings ?? []) {
    if (binding.runtimeValue !== 'COMMAND_PAYLOAD_RECEIPT_PATH') fail('UNSUPPORTED_OUTPUT_BINDING', binding.runtimeValue);
    args.push(binding.argument, payloadReceiptPath);
  }
  return { executable, args, digest: commandDigest(executable, args) };
}

export function extractRegisteredStructuredFailurePayload(descriptor, execution) {
  if (descriptor?.descriptorId !== 'FIXED_EXACT_HEAD_QUALIFICATION_EXECUTION') return null;
  if (!Number.isInteger(execution?.status) || execution.status === 0 || execution.error != null) return null;
  const allowedKeys = ['detail', 'errorCode', 'result', 'schema'];
  const candidates = [];
  for (const line of String(execution.stderr ?? '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) continue;
    let value;
    try { value = JSON.parse(trimmed); } catch { continue; }
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    if (value.schema !== 'RESUME_BOUND_EXACT_HEAD_QUALIFICATION_FAILURE_v1') continue;
    if (value.result !== 'FAIL_CLOSED') continue;
    if (typeof value.errorCode !== 'string' || value.errorCode.length === 0) continue;
    if (!(value.detail === null || typeof value.detail === 'string')) continue;
    const keys = Object.keys(value).sort();
    if (keys.length !== allowedKeys.length || keys.some((key, index) => key !== allowedKeys[index])) continue;
    candidates.push(value);
  }
  return candidates.length === 1 ? stable(candidates[0]) : null;
}

function changedPaths(toolRoot) {
  const status = git(toolRoot, ['status', '--porcelain=v1', '--untracked-files=all'], true);
  if (status.status !== 0) fail('TOOLING_WORKTREE_STATUS_FAILED');
  return status.stdout.split(/\r?\n/).filter(Boolean).map(line => line.slice(3).trim()).sort();
}

function validateChangedPaths(descriptor, paths) {
  const allowed = descriptor.allowedMutationPaths ?? [];
  const prohibited = descriptor.prohibitedPaths ?? [];
  for (const changed of paths) {
    if (prohibited.some(prefix => changed === prefix || changed.startsWith(prefix))) fail('PROHIBITED_PATH_MUTATED', changed);
    if (!allowed.includes(changed)) fail('UNAUTHORIZED_PATH_MUTATED', changed);
  }
}

function materializeToolingRoot(root, descriptor, worktreeParent) {
  const toolRoot = path.join(worktreeParent, 'tooling');
  const materialization = descriptor.toolingMaterialization ?? null;
  if (materialization?.mode !== 'BOUNDED_SPARSE_INDEX') {
    git(root, ['worktree', 'add', '--detach', toolRoot, descriptor.exactToolingHead]);
    return { toolRoot, mode: 'LEGACY_FULL_WORKTREE', cleanup: () => git(root, ['worktree', 'remove', '--force', toolRoot], true) };
  }

  const sparsePaths = Array.isArray(materialization.sparsePaths) ? materialization.sparsePaths.map(value => assertRepositoryPath(value, 'TOOLING_SPARSE_PATH_INVALID')) : [];
  if (sparsePaths.length === 0) fail('TOOLING_SPARSE_PATHS_REQUIRED');
  const entryLimitExclusive = Number(materialization.sparseIndexEntryLimitExclusive ?? 5000);
  if (!Number.isInteger(entryLimitExclusive) || entryLimitExclusive < 2) fail('TOOLING_SPARSE_ENTRY_LIMIT_INVALID');
  const origin = git(root, ['config', '--get', 'remote.origin.url']).stdout.trim();
  if (!origin) fail('TOOLING_ORIGIN_URL_UNAVAILABLE');

  fs.mkdirSync(toolRoot, { recursive: true });
  git(toolRoot, ['init', '.']);
  git(toolRoot, ['remote', 'add', 'origin', origin]);
  const fetched = run('git', ['-c', 'protocol.version=2', 'fetch', '--no-tags', '--depth=1', '--filter=blob:none', 'origin', descriptor.exactToolingHead], { cwd: toolRoot, env: process.env });
  if (fetched.status !== 0 || fetched.error) fail('EXACT_TOOLING_HEAD_SPARSE_FETCH_FAILED', fetched.stderr || fetched.error);
  git(toolRoot, ['sparse-checkout', 'init', '--cone', '--sparse-index']);
  git(toolRoot, ['sparse-checkout', 'set', ...sparsePaths]);
  git(toolRoot, ['checkout', '--detach', 'FETCH_HEAD']);
  if (git(toolRoot, ['config', '--bool', 'index.sparse']).stdout.trim() !== 'true') fail('TOOLING_SPARSE_INDEX_NOT_ACTIVE');
  const entries = git(toolRoot, ['ls-files', '--sparse']).stdout.split(/\r?\n/).filter(Boolean).length;
  if (entries >= entryLimitExclusive) fail('TOOLING_SPARSE_INDEX_BOUND_EXCEEDED', `${entries}:${entryLimitExclusive}`);
  console.log(`AI_TOOLING_PHASE BOUNDED_SPARSE_TOOLING_READY entries=${entries}`);
  return { toolRoot, mode: 'BOUNDED_SPARSE_INDEX', cleanup: () => fs.rmSync(toolRoot, { recursive: true, force: true }) };
}

function readRemoteHead(toolRoot, targetBranchRef) {
  const result = git(toolRoot, ['ls-remote', '--heads', 'origin', targetBranchRef], true);
  if (result.status !== 0 || result.error) fail('WRITEBACK_REMOTE_HEAD_UNAVAILABLE', result.stderr || result.error || targetBranchRef);
  const lines = result.stdout.split(/\r?\n/).filter(Boolean);
  if (lines.length !== 1) fail('WRITEBACK_REMOTE_BRANCH_NOT_EXACTLY_ONE', `${targetBranchRef}:${lines.length}`);
  const [head, ref] = lines[0].trim().split(/\s+/);
  if (ref !== targetBranchRef || !/^[0-9a-f]{40}$/.test(head ?? '')) fail('WRITEBACK_REMOTE_HEAD_INVALID', lines[0]);
  return head;
}

export function validateWritebackSpecification(descriptor, selectedBackend = 'GITHUB_ACTIONS_CLEAN_EXECUTION') {
  const specification = descriptor.writebackSpecification ?? null;
  if (specification == null) return null;
  if (selectedBackend !== 'GITHUB_ACTIONS_CLEAN_EXECUTION') fail('WRITEBACK_BACKEND_NOT_AUTHORIZED', selectedBackend);
  if (!specification || typeof specification !== 'object' || Array.isArray(specification)) fail('WRITEBACK_SPECIFICATION_INVALID');
  if (specification.mode !== 'FAST_FORWARD_EXACT_BRANCH') fail('WRITEBACK_MODE_NOT_AUTHORIZED', specification.mode ?? null);
  const targetBranchRef = String(specification.targetBranchRef ?? '');
  if (!/^refs\/heads\/[A-Za-z0-9][A-Za-z0-9._\/-]*$/.test(targetBranchRef) || targetBranchRef.includes('..') || targetBranchRef.includes('//') || targetBranchRef.endsWith('/')) fail('WRITEBACK_BRANCH_NOT_FIXED', targetBranchRef);
  if (targetBranchRef === 'refs/heads/main' || targetBranchRef === 'refs/heads/master') fail('WRITEBACK_MAIN_TARGET_PROHIBITED', targetBranchRef);
  const expectedBranchHead = String(specification.expectedBranchHead ?? '');
  if (!/^[0-9a-f]{40}$/.test(expectedBranchHead)) fail('WRITEBACK_EXPECTED_HEAD_NOT_FIXED', expectedBranchHead);
  if (expectedBranchHead !== descriptor.exactToolingHead) fail('WRITEBACK_EXPECTED_HEAD_TOOLING_HEAD_MISMATCH', `${expectedBranchHead}:${descriptor.exactToolingHead}`);
  const commitMessage = String(specification.commitMessage ?? '');
  if (!commitMessage || commitMessage.length > 200 || /[\r\n]/.test(commitMessage)) fail('WRITEBACK_COMMIT_MESSAGE_INVALID');
  if (specification.fastForwardOnly !== true) fail('WRITEBACK_FAST_FORWARD_ONLY_REQUIRED');
  if (specification.requireChangedPaths !== true) fail('WRITEBACK_CHANGED_PATHS_REQUIRED');
  if (!Array.isArray(descriptor.allowedMutationPaths) || descriptor.allowedMutationPaths.length === 0) fail('WRITEBACK_ALLOWED_MUTATION_PATHS_REQUIRED');
  return stable({ mode: specification.mode, targetBranchRef, expectedBranchHead, commitMessage, fastForwardOnly: true, requireChangedPaths: true });
}

function pushFastForwardWithToken(toolRoot, targetBranchRef) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) fail('WRITEBACK_GITHUB_TOKEN_UNAVAILABLE');
  const authorization = Buffer.from(`x-access-token:${token}`, 'utf8').toString('base64');
  const args = ['-c', `http.https://github.com/.extraheader=AUTHORIZATION: basic ${authorization}`, 'push', '--porcelain', 'origin', `HEAD:${targetBranchRef}`];
  const result = run('git', args, { cwd: toolRoot, env: process.env });
  if (result.status !== 0 || result.error) fail('WRITEBACK_FAST_FORWARD_PUSH_FAILED', result.stderr || result.error || 'git push failed');
}

export function stageValidatedWritebackPaths({ descriptor, toolRoot, changed }) {
  if (!Array.isArray(changed) || changed.length === 0) fail('WRITEBACK_NO_CHANGED_PATHS');
  validateChangedPaths(descriptor, changed);
  git(toolRoot, ['add', '--sparse', '-A', '--', ...changed]);
  const staged = git(toolRoot, ['diff', '--cached', '--name-only']).stdout.split(/\r?\n/).filter(Boolean).sort();
  if (JSON.stringify(staged) !== JSON.stringify(changed)) fail('WRITEBACK_STAGED_PATH_SET_MISMATCH', `${JSON.stringify(changed)}:${JSON.stringify(staged)}`);
  return staged;
}

function performRegisteredWriteback({ descriptor, selectedBackend, toolRoot, changed, payloadReceiptPath }) {
  const specification = validateWritebackSpecification(descriptor, selectedBackend);
  if (!specification) return null;
  if (changed.length === 0) fail('WRITEBACK_NO_CHANGED_PATHS');
  validateChangedPaths(descriptor, changed);
  const actualHead = git(toolRoot, ['rev-parse', 'HEAD^{commit}']).stdout.trim();
  if (actualHead !== specification.expectedBranchHead) fail('WRITEBACK_LOCAL_HEAD_MISMATCH', `${specification.expectedBranchHead}:${actualHead}`);
  const remoteBefore = readRemoteHead(toolRoot, specification.targetBranchRef);
  if (remoteBefore !== specification.expectedBranchHead) fail('WRITEBACK_REMOTE_HEAD_MISMATCH', `${specification.expectedBranchHead}:${remoteBefore}`);

  git(toolRoot, ['config', 'user.name', 'github-actions[bot]']);
  git(toolRoot, ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  stageValidatedWritebackPaths({ descriptor, toolRoot, changed });
  git(toolRoot, ['commit', '--no-gpg-sign', '-m', specification.commitMessage]);
  const candidateHead = git(toolRoot, ['rev-parse', 'HEAD^{commit}']).stdout.trim();
  const parentHead = git(toolRoot, ['rev-parse', 'HEAD^1']).stdout.trim();
  if (parentHead !== specification.expectedBranchHead) fail('WRITEBACK_PARENT_HEAD_MISMATCH', `${specification.expectedBranchHead}:${parentHead}`);
  if (!/^[0-9a-f]{40}$/.test(candidateHead) || candidateHead === specification.expectedBranchHead) fail('WRITEBACK_CANDIDATE_HEAD_INVALID', candidateHead);
  const remoteImmediatelyBeforePush = readRemoteHead(toolRoot, specification.targetBranchRef);
  if (remoteImmediatelyBeforePush !== specification.expectedBranchHead) fail('WRITEBACK_REMOTE_HEAD_MOVED', `${specification.expectedBranchHead}:${remoteImmediatelyBeforePush}`);
  pushFastForwardWithToken(toolRoot, specification.targetBranchRef);
  const remoteAfter = readRemoteHead(toolRoot, specification.targetBranchRef);
  if (remoteAfter !== candidateHead) fail('WRITEBACK_REMOTE_READBACK_MISMATCH', `${candidateHead}:${remoteAfter}`);

  const payload = stable({
    schema: 'REGISTERED_GENERATOR_WRITEBACK_RECEIPT_v1',
    result: 'REGISTERED_GENERATOR_COMMITTED_FAST_FORWARD',
    operationId: descriptor.operationId,
    descriptorId: descriptor.descriptorId,
    targetBranchRef: specification.targetBranchRef,
    expectedBranchHead: specification.expectedBranchHead,
    candidateHead,
    changedPaths: changed,
    fastForwardOnly: true,
    remoteHeadVerifiedBeforeCommit: remoteBefore,
    remoteHeadVerifiedBeforePush: remoteImmediatelyBeforePush,
    remoteHeadVerifiedAfterPush: remoteAfter,
    childCommandGitHubTokenExposed: false,
    mainMutationPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false
  });
  fs.writeFileSync(payloadReceiptPath, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

function failClosedReceipt(request, error, selectedBackend = null) {
  const descriptorId = request?.descriptorId ?? 'UNRESOLVED_DESCRIPTOR';
  const operationId = request?.operationId ?? 'UNRESOLVED_OPERATION';
  return stable({
    schema: 'COMMAND_EXECUTION_RECEIPT_v1',
    requestId: request?.requestId ?? 'UNRESOLVED_REQUEST',
    descriptorId,
    operationId,
    authorizedOperationId: operationId,
    successorCompatibilityUsed: false,
    toolId: 'UNRESOLVED_TOOL',
    exactToolingHead: '0000000000000000000000000000000000000000',
    selectedBackend: selectedBackend ?? 'NONE',
    commandDigest: hashObject({ notExecuted: true, errorCode: error.code ?? 'UNEXPECTED_DISPATCH_ERROR' }),
    inputDigest: hashObject(request?.inputs ?? {}),
    outputDigests: {},
    changedPaths: [],
    exitStatus: null,
    executionDisposition: 'COMMAND_NOT_EXECUTED_FAIL_CLOSED',
    prohibitedSideEffectsObserved: false,
    writebackPerformed: false,
    writebackCandidateHead: null,
    errorCode: error.code ?? 'UNEXPECTED_DISPATCH_ERROR',
    detail: error.detail ?? error.message,
    workflowRunId: process.env.GITHUB_RUN_ID ?? null,
    workflowJobId: process.env.GITHUB_JOB ?? null
  });
}

export function dispatchLoaded({ request, registry, admissionReceipt, admissionReceiptIdentity = null, routerReceipt, root, allowCandidate = false }) {
  let selection = null;
  let cleanupTooling = null;
  try {
    const resolution = resolveToolset({ request, registry, admissionReceipt, admissionReceiptIdentity, routerReceipt, allowCandidate });
    selection = selectBackend({ resolutionReceipt: resolution, capabilities: request.availableCapabilities });
    const descriptor = resolution.descriptor;
    if (selection.selectedBackend !== 'GITHUB_ACTIONS_CLEAN_EXECUTION' && selection.selectedBackend !== 'LOCAL_CLEAN_GIT') fail('SELECTED_BACKEND_NOT_EXECUTABLE', selection.selectedBackend);
    const writebackSpecification = validateWritebackSpecification(descriptor, selection.selectedBackend);
    ensureToolingHead(root, descriptor.exactToolingHead);
    const worktreeParent = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-room-tool-'));
    const tooling = materializeToolingRoot(root, descriptor, worktreeParent);
    const toolRoot = tooling.toolRoot;
    cleanupTooling = tooling.cleanup;
    const actualHead = git(toolRoot, ['rev-parse', 'HEAD^{commit}']).stdout.trim();
    if (actualHead !== descriptor.exactToolingHead) fail('EXACT_TOOLING_HEAD_MISMATCH', `${descriptor.exactToolingHead}:${actualHead}`);
    if (changedPaths(toolRoot).length !== 0) fail('TOOLING_WORKTREE_NOT_CLEAN_BEFORE_EXECUTION');
    const payloadReceiptPath = path.join(worktreeParent, 'command-payload-receipt.json');
    const fixed = buildFixedCommand(descriptor, resolution.validatedInputs, payloadReceiptPath);
    const streamOutput = descriptor.commandSpecification?.streamOutput === true;
    if (streamOutput) console.log('AI_TOOLING_PHASE REGISTERED_COMMAND_START');
    const execution = run(fixed.executable, fixed.args, { cwd: toolRoot, env: safeEnvironment(), visible: streamOutput });
    if (streamOutput) console.log(`AI_TOOLING_PHASE REGISTERED_COMMAND_END status=${execution.status}`);
    const afterPaths = changedPaths(toolRoot);
    validateChangedPaths(descriptor, afterPaths);

    if (!fs.existsSync(payloadReceiptPath)) {
      const structuredFailurePayload = extractRegisteredStructuredFailurePayload(descriptor, execution);
      if (structuredFailurePayload) fs.writeFileSync(payloadReceiptPath, `${JSON.stringify(structuredFailurePayload, null, 2)}\n`);
    }

    let writebackPayload = null;
    if (writebackSpecification && execution.status === 0 && execution.error == null) {
      writebackPayload = performRegisteredWriteback({ descriptor, selectedBackend: selection.selectedBackend, toolRoot, changed: afterPaths, payloadReceiptPath });
    }

    const outputDigests = {};
    let payloadSchema = null;
    if (fs.existsSync(payloadReceiptPath)) {
      const bytes = fs.readFileSync(payloadReceiptPath);
      outputDigests.commandPayloadReceiptSha256 = sha256(bytes);
      try { payloadSchema = JSON.parse(bytes.toString('utf8')).schema ?? null; } catch { payloadSchema = null; }
    }
    const passed = execution.status === 0 && execution.error == null && Object.keys(outputDigests).length > 0 && (!writebackSpecification || writebackPayload?.result === 'REGISTERED_GENERATOR_COMMITTED_FAST_FORWARD');
    const compatibility = resolution.successorCompatibilityReceipt;
    return stable({
      schema: 'COMMAND_EXECUTION_RECEIPT_v1',
      requestId: request.requestId,
      descriptorId: descriptor.descriptorId,
      operationId: descriptor.operationId,
      descriptorOperationId: descriptor.operationId,
      authorizedOperationId: resolution.authorizedOperationId,
      authorizationMode: resolution.authorizationMode,
      successorCompatibilityUsed: resolution.successorCompatibilityUsed,
      successorProofSha256: compatibility?.successorProofSha256 ?? null,
      successorReceiptDigest: compatibility?.successorReceiptDigest ?? null,
      successorOperationId: compatibility?.successorOperationId ?? null,
      predecessorOperationId: compatibility?.predecessorOperationId ?? null,
      toolId: descriptor.toolId,
      exactToolingHead: descriptor.exactToolingHead,
      selectedBackend: selection.selectedBackend,
      toolingMaterializationMode: tooling.mode,
      commandDigest: fixed.digest,
      inputDigest: hashObject(resolution.validatedInputs),
      outputDigests,
      commandPayloadSchema: payloadSchema,
      changedPaths: afterPaths,
      exitStatus: execution.status,
      executionDisposition: passed ? 'COMMAND_EXECUTED_AND_PASSED' : 'COMMAND_EXECUTED_AND_FAILED',
      prohibitedSideEffectsObserved: false,
      writebackPerformed: writebackPayload != null,
      writebackTargetBranchRef: writebackPayload?.targetBranchRef ?? null,
      writebackExpectedBranchHead: writebackPayload?.expectedBranchHead ?? null,
      writebackCandidateHead: writebackPayload?.candidateHead ?? null,
      writebackFastForwardOnly: writebackPayload?.fastForwardOnly ?? null,
      childCommandGitHubTokenExposed: writebackPayload ? false : null,
      outputStreamingMode: streamOutput ? 'INHERITED_LIVE' : 'CAPTURED',
      stdoutSha256: streamOutput ? null : sha256(Buffer.from(execution.stdout, 'utf8')),
      stderrSha256: streamOutput ? null : sha256(Buffer.from(execution.stderr, 'utf8')),
      workflowRunId: process.env.GITHUB_RUN_ID ?? null,
      workflowJobId: process.env.GITHUB_JOB ?? null,
      descriptorDigest: resolution.descriptorDigest,
      admissionLockGeneration: resolution.admissionLockGeneration
    });
  } catch (error) {
    return failClosedReceipt(request, error, selection?.selectedBackend ?? null);
  } finally {
    try { cleanupTooling?.(); } catch {}
  }
}

export function dispatchFromIdentities({ request, registry, root, allowCandidate = false }) {
  if (request?.descriptorId === PRE_ADMISSION_PACKET_COMPILER_DESCRIPTOR) {
    return dispatchLoaded({ request, registry, admissionReceipt: null, admissionReceiptIdentity: null, routerReceipt: null, root, allowCandidate });
  }
  const admission = loadJsonAtIdentity(root, request.admissionReceiptIdentity);
  const router = loadJsonAtIdentity(root, request.routerReceiptIdentity);
  return dispatchLoaded({
    request,
    registry,
    admissionReceipt: admission.value,
    admissionReceiptIdentity: admission.identity,
    routerReceipt: router.value,
    root,
    allowCandidate
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root ?? '.');
  const request = readJson(args.request);
  const registry = readJson(args.registry);
  const receipt = dispatchFromIdentities({ request, registry, root, allowCandidate: args['allow-candidate'] === 'true' });
  writeJson(args.output, receipt);
  if (receipt.executionDisposition !== 'COMMAND_EXECUTED_AND_PASSED') process.exitCode = 1;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();