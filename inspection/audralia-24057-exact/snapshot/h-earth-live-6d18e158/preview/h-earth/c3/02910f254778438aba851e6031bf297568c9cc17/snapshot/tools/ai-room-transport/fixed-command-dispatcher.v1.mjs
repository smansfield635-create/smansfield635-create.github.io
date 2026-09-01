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

function run(command, args, options = {}) {
  const result = cp.spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? result.error.message : null
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
    errorCode: error.code ?? 'UNEXPECTED_DISPATCH_ERROR',
    detail: error.detail ?? error.message,
    workflowRunId: process.env.GITHUB_RUN_ID ?? null,
    workflowJobId: process.env.GITHUB_JOB ?? null
  });
}

export function dispatchLoaded({ request, registry, admissionReceipt, admissionReceiptIdentity = null, routerReceipt, root, allowCandidate = false }) {
  let selection = null;
  let toolRoot = null;
  try {
    const resolution = resolveToolset({ request, registry, admissionReceipt, admissionReceiptIdentity, routerReceipt, allowCandidate });
    selection = selectBackend({ resolutionReceipt: resolution, capabilities: request.availableCapabilities });
    const descriptor = resolution.descriptor;
    if (selection.selectedBackend !== 'GITHUB_ACTIONS_CLEAN_EXECUTION' && selection.selectedBackend !== 'LOCAL_CLEAN_GIT') fail('SELECTED_BACKEND_NOT_EXECUTABLE', selection.selectedBackend);
    ensureToolingHead(root, descriptor.exactToolingHead);
    const worktreeParent = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-room-tool-'));
    toolRoot = path.join(worktreeParent, 'tooling');
    git(root, ['worktree', 'add', '--detach', toolRoot, descriptor.exactToolingHead]);
    const actualHead = git(toolRoot, ['rev-parse', 'HEAD^{commit}']).stdout.trim();
    if (actualHead !== descriptor.exactToolingHead) fail('EXACT_TOOLING_HEAD_MISMATCH', `${descriptor.exactToolingHead}:${actualHead}`);
    if (changedPaths(toolRoot).length !== 0) fail('TOOLING_WORKTREE_NOT_CLEAN_BEFORE_EXECUTION');
    const payloadReceiptPath = path.join(worktreeParent, 'command-payload-receipt.json');
    const fixed = buildFixedCommand(descriptor, resolution.validatedInputs, payloadReceiptPath);
    const execution = run(fixed.executable, fixed.args, { cwd: toolRoot, env: safeEnvironment() });
    const afterPaths = changedPaths(toolRoot);
    validateChangedPaths(descriptor, afterPaths);
    const outputDigests = {};
    let payloadSchema = null;
    if (fs.existsSync(payloadReceiptPath)) {
      const bytes = fs.readFileSync(payloadReceiptPath);
      outputDigests.commandPayloadReceiptSha256 = sha256(bytes);
      try { payloadSchema = JSON.parse(bytes.toString('utf8')).schema ?? null; } catch { payloadSchema = null; }
    }
    const passed = execution.status === 0 && execution.error == null && Object.keys(outputDigests).length > 0;
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
      commandDigest: fixed.digest,
      inputDigest: hashObject(resolution.validatedInputs),
      outputDigests,
      commandPayloadSchema: payloadSchema,
      changedPaths: afterPaths,
      exitStatus: execution.status,
      executionDisposition: passed ? 'COMMAND_EXECUTED_AND_PASSED' : 'COMMAND_EXECUTED_AND_FAILED',
      prohibitedSideEffectsObserved: false,
      stdoutSha256: sha256(Buffer.from(execution.stdout, 'utf8')),
      stderrSha256: sha256(Buffer.from(execution.stderr, 'utf8')),
      workflowRunId: process.env.GITHUB_RUN_ID ?? null,
      workflowJobId: process.env.GITHUB_JOB ?? null,
      descriptorDigest: resolution.descriptorDigest,
      admissionLockGeneration: resolution.admissionLockGeneration
    });
  } catch (error) {
    return failClosedReceipt(request, error, selection?.selectedBackend ?? null);
  } finally {
    if (toolRoot) git(root, ['worktree', 'remove', '--force', toolRoot], true);
  }
}

export function dispatchFromIdentities({ request, registry, root, allowCandidate = false }) {
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
