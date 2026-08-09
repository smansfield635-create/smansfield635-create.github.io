#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const REGISTRY_PATH = path.join(ROOT, '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json');
const LOCK_REF = 'refs/remotes/origin/operation-locks/repository-operation-intake-v1';
const LOCK_LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
const REQUIRED_REQUEST_KEYS = ['schema', 'requestId', 'descriptorId', 'operationRequest', 'constructionProcedure', 'admissionReceipt', 'requestNonce'];
const FORBIDDEN_REQUEST_KEYS = ['command','shell','shellCommand','script','scriptBody','executable','arguments','extraArguments','environment','environmentOverride','paths','targetHead','workingDirectory','workflowOverride'];

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
export const canonical = value => JSON.stringify(stable(value));
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const hashObject = value => sha256(Buffer.from(canonical(value), 'utf8'));

function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${detail}`);
  error.code = code;
  error.detail = detail;
  throw error;
}
function assertObject(value, code) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(code);
  return value;
}
function assertString(value, code) {
  if (typeof value !== 'string' || value.length === 0) fail(code);
  return value;
}
function assertCommit(value, code) {
  if (!/^[0-9a-f]{40}$/.test(value ?? '')) fail(code, String(value));
  return value;
}
function assertDigest(value, code) {
  if (!/^[0-9a-f]{64}$/.test(value ?? '')) fail(code, String(value));
  return value;
}
function assertRepositoryPath(value, code) {
  assertString(value, code);
  const normalized = value.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) fail(code, value);
  if (!/^[A-Za-z0-9._/-]+$/.test(normalized)) fail(code, value);
  return normalized;
}
function assertClosedKeys(value, required, allowed, prefix) {
  assertObject(value, `${prefix}_OBJECT_REQUIRED`);
  for (const key of required) if (!Object.hasOwn(value, key)) fail(`${prefix}_MISSING_FIELD`, key);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${prefix}_UNKNOWN_FIELD`, key);
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}
function writeJson(file, value) {
  const target = path.resolve(file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(stable(value), null, 2)}\n`);
}
function execGit(args, cwd = ROOT, options = {}) {
  return cp.execFileSync('git', args, { cwd, encoding: options.encoding ?? 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'] });
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    const key = token.slice(2);
    if (Object.hasOwn(out, key)) fail('DUPLICATE_ARGUMENT', key);
    out[key] = argv[++i] ?? null;
  }
  return out;
}

export function validateRequest(raw) {
  assertClosedKeys(raw, REQUIRED_REQUEST_KEYS, REQUIRED_REQUEST_KEYS, 'CARRIER_REQUEST');
  if (raw.schema !== 'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1') fail('REQUEST_SCHEMA_MISMATCH');
  for (const key of FORBIDDEN_REQUEST_KEYS) if (Object.hasOwn(raw, key)) fail('ARBITRARY_COMMAND_FIELD_PROHIBITED', key);
  if (!/^[0-9a-f]{64}$/.test(raw.requestNonce ?? '')) fail('REQUEST_NONCE_INVALID');
  return stable(raw);
}

function validateRegistry(registry) {
  assertObject(registry, 'REGISTRY_INVALID');
  if (registry.schema !== 'BOUNDED_EXECUTABLE_DESCRIPTOR_REGISTRY_v1') fail('REGISTRY_SCHEMA_MISMATCH');
  if (registry.closedWorld !== true || registry.arbitraryCommandAccepted !== false || registry.movingExecutableRefsAccepted !== false) fail('REGISTRY_NOT_FAIL_CLOSED');
  if (!['ACTIVE_RATIFIED_WHEN_ON_DEFAULT_BRANCH'].includes(registry.status)) fail('REGISTRY_STATUS_INVALID', registry.status);
  if (!Array.isArray(registry.descriptors) || registry.descriptors.length === 0) fail('REGISTRY_EMPTY');
}
function resolveDescriptor(registry, descriptorId) {
  validateRegistry(registry);
  const matches = registry.descriptors.filter(item => item.descriptorId === descriptorId);
  if (matches.length !== 1) fail(matches.length === 0 ? 'UNREGISTERED_EXECUTABLE' : 'EXECUTABLE_DESCRIPTOR_AMBIGUOUS');
  const descriptor = stable(matches[0]);
  if (!['ACTIVE_RATIFIED_WHEN_ON_DEFAULT_BRANCH'].includes(descriptor.status)) fail('DESCRIPTOR_NOT_ACTIVE', descriptor.status);
  if (descriptor.shell !== false || descriptor.extraArgumentsAllowed !== false || descriptor.environmentOverridesAllowed !== false) fail('DESCRIPTOR_NOT_FAIL_CLOSED');
  if (descriptor.executable !== 'node' || descriptor.scriptPath !== 'tools/repository-ai-entry-router.mjs') fail('DESCRIPTOR_EXECUTABLE_NOT_ALLOWED');
  if (descriptor.pathDerivation !== 'OPERATION_REQUEST_ALLOWED_PATHS_EXACT') fail('DESCRIPTOR_PATH_DERIVATION_UNSUPPORTED');
  return descriptor;
}
function validateOperationDocuments(request) {
  const op = assertObject(request.operationRequest, 'OPERATION_REQUEST_INVALID');
  const procedure = assertObject(request.constructionProcedure, 'CONSTRUCTION_PROCEDURE_INVALID');
  const admission = assertObject(request.admissionReceipt, 'ADMISSION_RECEIPT_INVALID');
  if (op.schema !== 'REPOSITORY_OPERATION_REQUEST_v1') fail('OPERATION_REQUEST_SCHEMA_MISMATCH');
  if (procedure.schema !== 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1') fail('CONSTRUCTION_PROCEDURE_SCHEMA_MISMATCH');
  if (admission.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1' || admission.result !== 'ADMITTED_AND_LOCKED') fail('ADMISSION_NOT_ACTIVE');
  if (op.operationId !== admission.operationId) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'operationId');
  if (op.projectId !== admission.projectId) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'projectId');
  if (op.exactGoverningHead !== procedure.exactGoverningHead) fail('GOVERNING_HEAD_MISMATCH');
  if (admission.operationStarted !== true || admission.workflowExecutionAuthorized !== true) fail('ADMISSION_EXECUTION_NOT_AUTHORIZED');
  const lock = assertObject(admission.lock, 'ADMISSION_LOCK_MISSING');
  if (lock.operationId !== op.operationId || lock.lockAcquired !== true) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'admission.lock');
  if (!Number.isInteger(lock.lockGeneration) || lock.lockGeneration < 1) fail('LOCK_GENERATION_INVALID');
  assertDigest(lock.scopeHash, 'SCOPE_HASH_INVALID');
  assertDigest(admission.requestDigest, 'REQUEST_DIGEST_INVALID');
  assertDigest(admission.procedureLocatorDigest, 'PROCEDURE_DIGEST_INVALID');
  const allowed = Array.isArray(op.allowedPaths) ? op.allowedPaths.map(p => assertRepositoryPath(p, 'OPERATION_ALLOWED_PATH_INVALID')) : fail('OPERATION_ALLOWED_PATHS_INVALID');
  const procedureAllowed = Array.isArray(procedure.exactAllowedRepositoryPaths) ? procedure.exactAllowedRepositoryPaths.map(p => assertRepositoryPath(p, 'PROCEDURE_ALLOWED_PATH_INVALID')) : fail('PROCEDURE_ALLOWED_PATHS_INVALID');
  if (canonical([...allowed].sort()) !== canonical([...procedureAllowed].sort())) fail('REQUESTED_PATH_OUTSIDE_ADMITTED_SCOPE', 'operation/procedure path sets differ');
  return { op, procedure, admission, lock, allowedPaths: allowed };
}
function deriveTargetHead(op, descriptor) {
  let value;
  if (descriptor.targetHeadDerivation === 'SUBJECT_IDENTITY_REQUIRED_STARTING_HEAD_ELSE_EXACT_GOVERNING_HEAD') {
    value = op.subjectIdentity?.requiredStartingHead ?? op.exactGoverningHead;
  } else fail('TARGET_HEAD_DERIVATION_UNSUPPORTED');
  return assertCommit(value, 'TARGET_HEAD_NOT_AUTHORIZED');
}
function deriveTask(op, descriptor) {
  if (descriptor.taskDerivation !== 'SUBJECT_IDENTITY_EXPERIMENT_ID_UPPERCASE_ELSE_OPERATION_ID') fail('TASK_DERIVATION_UNSUPPORTED');
  const raw = typeof op.subjectIdentity?.experimentId === 'string' && op.subjectIdentity.experimentId.length > 0
    ? op.subjectIdentity.experimentId.toUpperCase()
    : op.operationId;
  if (!/^[A-Z0-9_.:-]+$/.test(raw)) fail('DERIVED_TASK_INVALID', raw);
  return raw;
}

export function validateAndResolve({ rawRequest, registry, ledger }) {
  const request = validateRequest(rawRequest);
  const descriptor = resolveDescriptor(registry, request.descriptorId);
  const docs = validateOperationDocuments(request);
  const live = ledger?.activeScopes?.[docs.lock.scopeHash];
  if (!live || typeof live !== 'object') fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'scopeHash not active');
  if (live.operationId !== docs.op.operationId || live.lockGeneration !== docs.lock.lockGeneration || live.lockScope !== docs.lock.lockScope) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'ledger identity');
  if (live.state !== 'ADMITTED_LOCKED' || live.released !== false) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', `ledger state ${live.state}/${live.released}`);
  const requestDigest = hashObject(docs.op);
  const procedureDigest = hashObject(docs.procedure);
  if (requestDigest !== live.requestDigest || requestDigest !== docs.admission.requestDigest) fail('REQUEST_OR_PROCEDURE_DIGEST_MISMATCH', 'request');
  if (procedureDigest !== live.procedureLocatorDigest || procedureDigest !== docs.admission.procedureLocatorDigest) fail('REQUEST_OR_PROCEDURE_DIGEST_MISMATCH', 'procedure');
  const targetHead = deriveTargetHead(docs.op, descriptor);
  const task = deriveTask(docs.op, descriptor);
  const paths = docs.allowedPaths;
  return stable({
    descriptor,
    operationId: docs.op.operationId,
    projectId: docs.op.projectId,
    lockGeneration: docs.lock.lockGeneration,
    scopeHash: docs.lock.scopeHash,
    targetHead,
    task,
    paths,
    requestDigest,
    procedureDigest,
    admissionReceipt: docs.admission
  });
}

function loadCanonicalLedger() {
  try {
    execGit(['show', `${LOCK_REF}:${LOCK_LEDGER_PATH}`]);
  } catch {
    try { execGit(['fetch', '--no-tags', 'origin', '+refs/heads/operation-locks/repository-operation-intake-v1:refs/remotes/origin/operation-locks/repository-operation-intake-v1']); }
    catch { fail('CANONICAL_LOCK_LEDGER_UNAVAILABLE'); }
  }
  try { return JSON.parse(execGit(['show', `${LOCK_REF}:${LOCK_LEDGER_PATH}`])); }
  catch { fail('CANONICAL_LOCK_LEDGER_INVALID'); }
}
function ensureCommitAvailable(commit) {
  try { execGit(['cat-file', '-e', `${commit}^{commit}`]); }
  catch {
    try { execGit(['fetch', '--no-tags', 'origin', commit]); }
    catch { fail('EXACT_HEAD_CHECKOUT_FAILURE', commit); }
  }
}
function assertClean(cwd, code = 'WORKTREE_NOT_CLEAN') {
  const status = execGit(['status', '--porcelain=v1', '--untracked-files=all'], cwd);
  if (status.trim() !== '') fail(code, status.trim());
}

export function executeResolved(resolution, { root = ROOT } = {}) {
  ensureCommitAvailable(resolution.targetHead);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bounded-exact-head-carrier-'));
  const worktree = path.join(tempRoot, 'worktree');
  const admissionPath = path.join(tempRoot, 'admission.json');
  const nativeReceiptPath = path.join(tempRoot, 'native-receipt.json');
  writeJson(admissionPath, resolution.admissionReceipt);
  let worktreeAdded = false;
  try {
    execGit(['worktree', 'add', '--detach', worktree, resolution.targetHead], root);
    worktreeAdded = true;
    const actualHead = execGit(['rev-parse', 'HEAD^{commit}'], worktree).trim();
    if (actualHead !== resolution.targetHead) fail('EXACT_HEAD_CHECKOUT_FAILURE', `${resolution.targetHead}:${actualHead}`);
    assertClean(worktree);
    const args = [
      resolution.descriptor.scriptPath,
      '--mutation-intent',
      ...resolution.paths.flatMap(p => ['--path', p]),
      '--task', resolution.task,
      '--output', nativeReceiptPath
    ];
    const safeEnv = {
      PATH: process.env.PATH ?? '',
      HOME: process.env.HOME ?? tempRoot,
      TMPDIR: process.env.RUNNER_TEMP ?? os.tmpdir(),
      LANG: process.env.LANG ?? 'C.UTF-8',
      LC_ALL: process.env.LC_ALL ?? 'C.UTF-8',
      INTAKE_ADMISSION_RECEIPT: admissionPath
    };
    let exitCode = 0;
    try {
      cp.execFileSync(resolution.descriptor.executable, args, { cwd: worktree, env: safeEnv, shell: false, stdio: ['ignore','pipe','pipe'], maxBuffer: 32 * 1024 * 1024 });
    } catch (error) {
      exitCode = Number.isInteger(error.status) ? error.status : 1;
    }
    assertClean(worktree);
    if (!fs.existsSync(nativeReceiptPath)) fail('NATIVE_RECEIPT_MISSING_OR_INVALID');
    let nativeReceipt;
    try { nativeReceipt = readJson(nativeReceiptPath); } catch { fail('NATIVE_RECEIPT_MISSING_OR_INVALID'); }
    if (nativeReceipt.schema !== resolution.descriptor.nativeReceiptSchema) fail('NATIVE_RECEIPT_MISSING_OR_INVALID', 'schema');
    const routePaths = Array.isArray(nativeReceipt.routes) ? nativeReceipt.routes.map(r => r.path).sort() : [];
    if (canonical(routePaths) !== canonical([...resolution.paths].sort())) fail('NATIVE_RECEIPT_MISSING_OR_INVALID', 'route path set');
    const nativePass = nativeReceipt[resolution.descriptor.nativePassField] === resolution.descriptor.nativePassValue;
    return stable({
      schema: 'BOUNDED_EXACT_HEAD_EXECUTION_RECEIPT_v1',
      result: nativePass && exitCode === 0 ? 'COMMAND_EXECUTED_AND_PASSED' : 'COMMAND_EXECUTED_AND_RETURNED_NONPASS',
      descriptorId: resolution.descriptor.descriptorId,
      operationId: resolution.operationId,
      lockGeneration: resolution.lockGeneration,
      targetHead: resolution.targetHead,
      task: resolution.task,
      paths: resolution.paths,
      commandDigest: hashObject({ executable: resolution.descriptor.executable, args }),
      exactHeadVerified: true,
      workingTreeCleanBeforeAndAfter: true,
      commandExecuted: true,
      commandExitCode: exitCode,
      nativeReceiptSchema: nativeReceipt.schema,
      nativeReceiptDigest: sha256(fs.readFileSync(nativeReceiptPath)),
      nativeReceiptRewritten: false,
      nativeReceipt,
      repositoryWritesPerformed: false,
      arbitraryCommandAuthority: false,
      semanticAuthorityCreated: false,
      productAuthorityCreated: false
    });
  } finally {
    if (worktreeAdded) {
      try { execGit(['worktree', 'remove', '--force', worktree], root); } catch {}
    }
    try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch {}
  }
}

export function runCarrier({ request, registry = readJson(REGISTRY_PATH), ledger = loadCanonicalLedger(), root = ROOT }) {
  const resolution = validateAndResolve({ rawRequest: request, registry, ledger });
  return executeResolved(resolution, { root });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.output) fail('INPUT_AND_OUTPUT_REQUIRED');
  const request = readJson(args.input);
  const receipt = runCarrier({ request });
  writeJson(args.output, receipt);
  if (receipt.result !== 'COMMAND_EXECUTED_AND_PASSED') process.exitCode = 2;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try { main(); }
  catch (error) {
    const args = (() => { try { return parseArgs(process.argv.slice(2)); } catch { return {}; } })();
    const failure = stable({
      schema: 'BOUNDED_EXACT_HEAD_EXECUTION_FAILURE_v1',
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_CARRIER_ERROR',
      detail: error.detail ?? error.message,
      repositoryWritesPerformed: false,
      arbitraryCommandAuthority: false,
      semanticAuthorityCreated: false,
      productAuthorityCreated: false
    });
    if (args.output) writeJson(args.output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}
