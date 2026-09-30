#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const RECEIPT_SCHEMA = 'H_EARTH_PREMUTATION_PREFLIGHT_REMOTE_EXECUTION_RECEIPT_v1';
const NATIVE_TOOL_PATH = 'tools/h-earth-repository-registry-auto-preflight.mjs';
const NATIVE_TOOL_BLOB = '6d4af698ca75b96aaa660033e9ae24c704673eb7';
const ACTIVATION_PATH = 'h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';
const ACTIVATION_BLOB = 'b3c51381af190b6aab296db222296dc851cb7e9a';
const ACTIVATION_ID = 'H_EARTH_REPOSITORY_REGISTRY_AUTOMATIC_PREFLIGHT_ACTIVATION_v1';
const TASK_TEXT = 'Remote pre-mutation H-Earth repository registry preflight';
const MAX_PATHS = 128;
const ALLOWED_ROOTS = ['h-earth-3d/', 'showroom/globe/h-earth/'];
const NEGATIVE_DISPOSITIONS = new Set(['REVIEW_REQUIRED', 'BLOCK', 'STOP']);

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function run(command, args, options = {}) {
  const result = cp.spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
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
  if (!allowFailure && (result.status !== 0 || result.error)) {
    fail('GIT_COMMAND_FAILED', `${args.join(' ')}:${result.stderr || result.error}`);
  }
  return result.stdout.trim();
}

function parseArgs(argv) {
  const out = { selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--self-test') {
      out.selfTest = true;
      continue;
    }
    if (!arg.startsWith('--')) fail('ARGUMENT_INVALID', arg);
    const value = argv[index + 1];
    if (value === undefined) fail('ARGUMENT_VALUE_MISSING', arg);
    out[arg.slice(2)] = value;
    index += 1;
  }
  if (!out.output) fail('OUTPUT_REQUIRED');
  if (!out.selfTest) {
    for (const key of ['subject-head', 'paths-base64', 'execution-holder']) {
      if (!out[key]) fail('ARGUMENT_REQUIRED', key);
    }
  }
  return out;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(path.resolve(filePath), `${JSON.stringify(stable(value), null, 2)}\n`);
}

function ensureSubjectHead(root, head) {
  if (!/^[0-9a-f]{40}$/.test(head)) fail('SUBJECT_HEAD_INVALID', head);
  const present = run('git', ['cat-file', '-e', `${head}^{commit}`], { cwd: root });
  if (present.status === 0) return;
  const fetched = run('git', ['fetch', '--no-tags', 'origin', head], { cwd: root });
  if (fetched.status !== 0 || fetched.error) fail('SUBJECT_HEAD_UNAVAILABLE', head);
  const verified = run('git', ['cat-file', '-e', `${head}^{commit}`], { cwd: root });
  if (verified.status !== 0) fail('SUBJECT_HEAD_UNAVAILABLE', head);
}

function cleanWorktree(root) {
  return git(root, ['status', '--porcelain=v1', '--untracked-files=all']) === '';
}

function decodePaths(pathsBase64) {
  if (typeof pathsBase64 !== 'string' || pathsBase64.length === 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(pathsBase64)) {
    fail('PATHS_BASE64_INVALID');
  }
  let parsed;
  try {
    const text = Buffer.from(pathsBase64, 'base64').toString('utf8');
    parsed = JSON.parse(text);
  } catch (error) {
    fail('PATHS_BASE64_DECODE_FAILED', error.message);
  }
  if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > MAX_PATHS) fail('PATH_COUNT_INVALID', parsed?.length ?? null);
  const normalized = parsed.map((entry) => {
    if (typeof entry !== 'string') fail('PATH_NOT_STRING');
    const value = entry.trim();
    if (!value || value.startsWith('/') || value.startsWith('./') || value.includes('\\') || value.includes('\0')) fail('PATH_FORMAT_INVALID', value);
    const segments = value.split('/');
    if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) fail('PATH_TRAVERSAL_OR_EMPTY_SEGMENT', value);
    if (!ALLOWED_ROOTS.some((root) => value.startsWith(root))) fail('PATH_OUTSIDE_H_EARTH_SCOPE', value);
    return value;
  });
  if (new Set(normalized).size !== normalized.length) fail('DUPLICATE_PATH');
  return [...normalized].sort((a, b) => a.localeCompare(b));
}

function verifyBoundNativeTool(root, subjectHead) {
  const nativeBlob = git(root, ['rev-parse', `${subjectHead}:${NATIVE_TOOL_PATH}`]);
  const activationBlob = git(root, ['rev-parse', `${subjectHead}:${ACTIVATION_PATH}`]);
  if (nativeBlob !== NATIVE_TOOL_BLOB) fail('NATIVE_TOOL_BLOB_MISMATCH', `${NATIVE_TOOL_BLOB}:${nativeBlob}`);
  if (activationBlob !== ACTIVATION_BLOB) fail('ACTIVATION_BLOB_MISMATCH', `${ACTIVATION_BLOB}:${activationBlob}`);
  return { nativeBlob, activationBlob };
}

function validateNativeReceiptEnvelope(receipt, paths) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) fail('NATIVE_RECEIPT_INVALID');
  if (receipt.activationId !== ACTIVATION_ID) fail('NATIVE_RECEIPT_ACTIVATION_ID_MISMATCH');
  if (receipt.activationStatus !== 'ACTIVATED') fail('NATIVE_RECEIPT_NOT_ACTIVATED');
  if (receipt.dependenciesVerified !== true) fail('NATIVE_RECEIPT_DEPENDENCIES_NOT_VERIFIED');
  if (receipt.mutationIntentDetected !== true) fail('NATIVE_RECEIPT_MUTATION_INTENT_MISSING');
  if (receipt.mutationMayProceed !== false) fail('NATIVE_RECEIPT_MUTATION_AUTHORITY_LEAK');

  const boundaries = receipt.boundaries ?? {};
  if (boundaries.readOnlyPreflight !== true || boundaries.sourceAuthorityCreated !== false || boundaries.mutationAuthorityCreated !== false || boundaries.mergeAuthorityCreated !== false || boundaries.canonicalizationAuthorityCreated !== false) {
    fail('NATIVE_RECEIPT_BOUNDARY_MISMATCH');
  }

  const expected = paths.map((value) => `/${value}`).sort((a, b) => a.localeCompare(b));
  const observed = [...(receipt.pathClassification?.normalizedPaths ?? [])].sort((a, b) => a.localeCompare(b));
  if (JSON.stringify(expected) !== JSON.stringify(observed)) fail('NATIVE_RECEIPT_PATH_SET_MISMATCH');

  if (receipt.finalDisposition === 'PASS') {
    if (receipt.continuation !== 'SEPARATE_MUTATION_AUTHORITY_REQUIRED_BEFORE_CHANGE') {
      fail('NATIVE_RECEIPT_CONTINUATION_MISMATCH', receipt.continuation);
    }
    return 'PASS_CLOSED';
  }

  if (!NEGATIVE_DISPOSITIONS.has(receipt.finalDisposition)) {
    fail('NATIVE_PREFLIGHT_DISPOSITION_UNSUPPORTED', receipt.finalDisposition);
  }
  if (typeof receipt.continuation !== 'string' || receipt.continuation.length === 0) {
    fail('NATIVE_RECEIPT_NEGATIVE_CONTINUATION_MISSING');
  }
  return 'FAIL_CLOSED';
}

function validateNativeExit(nativeExecution, adapterResult, nativeDisposition) {
  if (nativeExecution.error) fail('NATIVE_PREFLIGHT_EXECUTION_ERROR', nativeExecution.error);
  if (adapterResult === 'PASS_CLOSED' && nativeExecution.status !== 0) {
    fail('NATIVE_PREFLIGHT_PASS_EXIT_NONZERO', `${nativeExecution.status}:${nativeExecution.stderr}`);
  }
  if ((nativeDisposition === 'BLOCK' || nativeDisposition === 'STOP') && nativeExecution.status === 0) {
    fail('NATIVE_PREFLIGHT_FAIL_CLOSED_EXIT_ZERO', nativeDisposition);
  }
  if (nativeDisposition === 'REVIEW_REQUIRED' && nativeExecution.status !== 0) {
    fail('NATIVE_PREFLIGHT_REVIEW_EXIT_NONZERO', `${nativeExecution.status}:${nativeExecution.stderr}`);
  }
}

function execute({ root, subjectHead, pathsBase64, executionHolder }) {
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(executionHolder ?? '')) fail('EXECUTION_HOLDER_INVALID');
  const paths = decodePaths(pathsBase64);
  const repositoryCleanBefore = cleanWorktree(root);
  if (!repositoryCleanBefore) fail('TOOLING_WORKTREE_DIRTY_BEFORE_EXECUTION');
  ensureSubjectHead(root, subjectHead);
  const identities = verifyBoundNativeTool(root, subjectHead);

  const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'h-earth-premutation-preflight-'));
  const subjectRoot = path.join(tempParent, 'subject');
  const nativeReceiptPath = path.join(tempParent, 'native-preflight-receipt.json');
  let subjectWorktreeCleanBefore = false;
  let subjectWorktreeCleanAfter = false;
  let nativeExecution = null;
  let nativeReceipt = null;
  let adapterResult = null;

  try {
    git(root, ['worktree', 'add', '--detach', subjectRoot, subjectHead]);
    const exact = git(subjectRoot, ['rev-parse', 'HEAD^{commit}']);
    if (exact !== subjectHead) fail('SUBJECT_WORKTREE_HEAD_MISMATCH', `${subjectHead}:${exact}`);
    subjectWorktreeCleanBefore = cleanWorktree(subjectRoot);
    if (!subjectWorktreeCleanBefore) fail('SUBJECT_WORKTREE_DIRTY_BEFORE_PREFLIGHT');

    const nativeArgs = [
      '--experimental-default-type=module',
      NATIVE_TOOL_PATH,
      '--mutation-intent',
      '--task', TASK_TEXT
    ];
    for (const repositoryPath of paths) nativeArgs.push('--path', repositoryPath);
    nativeArgs.push('--output', nativeReceiptPath);

    nativeExecution = run('node', nativeArgs, { cwd: subjectRoot, env: process.env });
    if (!fs.existsSync(nativeReceiptPath)) fail('NATIVE_PREFLIGHT_RECEIPT_MISSING');
    try {
      nativeReceipt = JSON.parse(fs.readFileSync(nativeReceiptPath, 'utf8'));
    } catch (error) {
      fail('NATIVE_PREFLIGHT_RECEIPT_PARSE_FAILED', error.message);
    }

    adapterResult = validateNativeReceiptEnvelope(nativeReceipt, paths);
    validateNativeExit(nativeExecution, adapterResult, nativeReceipt.finalDisposition);

    subjectWorktreeCleanAfter = cleanWorktree(subjectRoot);
    if (!subjectWorktreeCleanAfter) fail('SUBJECT_WORKTREE_DIRTY_AFTER_PREFLIGHT');
  } finally {
    if (fs.existsSync(subjectRoot)) run('git', ['worktree', 'remove', '--force', subjectRoot], { cwd: root, env: process.env });
  }

  const repositoryCleanAfter = cleanWorktree(root);
  if (!repositoryCleanAfter) fail('TOOLING_WORKTREE_DIRTY_AFTER_EXECUTION');
  const nativeBytes = fs.readFileSync(nativeReceiptPath);

  const receipt = {
    schema: RECEIPT_SCHEMA,
    result: adapterResult,
    executionHolder,
    subjectHead,
    paths,
    taskText: TASK_TEXT,
    nativeToolPath: NATIVE_TOOL_PATH,
    nativeToolBlob: identities.nativeBlob,
    activationPath: ACTIVATION_PATH,
    activationBlob: identities.activationBlob,
    nativePreflightExitCode: nativeExecution.status,
    nativePreflightReceiptSha256: sha256(nativeBytes),
    nativePreflightReceipt: nativeReceipt,
    repositoryCleanBefore,
    repositoryCleanAfter,
    subjectWorktreeCleanBefore,
    subjectWorktreeCleanAfter,
    productMutationPerformed: false,
    constructionAuthorityGranted: false,
    branchCreated: false,
    genericCommandAuthority: false,
    runtimeOrRendererMutationPerformed: false,
    cameraOrNavigationMutationPerformed: false,
    terrainOrWaterMutationPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false
  };

  if (adapterResult === 'FAIL_CLOSED') {
    receipt.errorCode = 'NATIVE_PREFLIGHT_NOT_PASS';
    receipt.detail = nativeReceipt.finalDisposition;
  }

  return stable(receipt);
}

function selfTest(root) {
  const head = git(root, ['rev-parse', 'HEAD^{commit}']);
  const positivePaths = [
    'showroom/globe/h-earth/index.html',
    'showroom/globe/h-earth/index.css'
  ];
  const positive = execute({
    root,
    subjectHead: head,
    pathsBase64: Buffer.from(JSON.stringify(positivePaths), 'utf8').toString('base64'),
    executionHolder: 'H_EARTH_PREMUTATION_PREFLIGHT_ADAPTER_SELF_TEST'
  });
  if (positive.result !== 'PASS_CLOSED' || positive.nativePreflightReceipt.finalDisposition !== 'PASS') {
    fail('SELF_TEST_POSITIVE_FAILED');
  }

  const negativePath = 'showroom/globe/h-earth/__negative-receipt-preservation-self-test__.txt';
  const negative = execute({
    root,
    subjectHead: head,
    pathsBase64: Buffer.from(JSON.stringify([negativePath]), 'utf8').toString('base64'),
    executionHolder: 'H_EARTH_PREMUTATION_PREFLIGHT_NEGATIVE_SELF_TEST'
  });
  const negativeClassification = negative.nativePreflightReceipt.pathClassification?.classifications?.find(
    (entry) => entry.repositoryPath === `/${negativePath}`
  );
  if (
    negative.result !== 'FAIL_CLOSED' ||
    !NEGATIVE_DISPOSITIONS.has(negative.nativePreflightReceipt.finalDisposition) ||
    negativeClassification?.classification !== 'UNREGISTERED_H_EARTH_SCOPED_PATH' ||
    negative.nativePreflightReceipt.mutationMayProceed !== false ||
    negative.constructionAuthorityGranted !== false ||
    negative.genericCommandAuthority !== false
  ) {
    fail('SELF_TEST_NEGATIVE_RECEIPT_PRESERVATION_FAILED');
  }

  let outsideScopeRejected = false;
  try {
    decodePaths(Buffer.from(JSON.stringify(['laws/index.html']), 'utf8').toString('base64'));
  } catch (error) {
    outsideScopeRejected = error.code === 'PATH_OUTSIDE_H_EARTH_SCOPE';
  }
  if (!outsideScopeRejected) fail('SELF_TEST_NEGATIVE_SCOPE_FAILED');

  return stable({
    schema: 'H_EARTH_PREMUTATION_PREFLIGHT_REMOTE_EXECUTION_SELF_TEST_RECEIPT_v1',
    result: 'PASS_CLOSED',
    subjectHead: head,
    positiveNativeDisposition: positive.nativePreflightReceipt.finalDisposition,
    negativeNativeDisposition: negative.nativePreflightReceipt.finalDisposition,
    negativeClassification: negativeClassification.classification,
    negativeNativeReceiptPreserved: true,
    negativeScopeFixturePassed: true,
    productMutationPerformed: false,
    constructionAuthorityGranted: false,
    genericCommandAuthority: false
  });
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
    const root = process.cwd();
    const receipt = args.selfTest
      ? selfTest(root)
      : execute({
          root,
          subjectHead: args['subject-head'],
          pathsBase64: args['paths-base64'],
          executionHolder: args['execution-holder']
        });
    writeJson(args.output, receipt);
  } catch (error) {
    const output = args?.output;
    const failure = stable({
      schema: RECEIPT_SCHEMA,
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_ERROR',
      detail: error.detail ?? error.message,
      productMutationPerformed: false,
      constructionAuthorityGranted: false,
      branchCreated: false,
      genericCommandAuthority: false,
      runtimeOrRendererMutationPerformed: false,
      cameraOrNavigationMutationPerformed: false,
      terrainOrWaterMutationPerformed: false,
      mergePerformed: false,
      deploymentPerformed: false,
      releasePerformed: false
    });
    if (output) writeJson(output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
