#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  LOCK_REF,
  TERMINAL,
  canonScope,
  closeRemote,
  stable,
  text
} from './repository-operation-lock-manager.v1.mjs';

export const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
export const ROUTE_ID = 'REMOTE_OPERATION_TERMINAL_CLOSURE_v1';
export const REQUEST_SCHEMA = 'REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_v1';
export const RECEIPT_SCHEMA = 'REMOTE_OPERATION_TERMINAL_CLOSURE_INVOCATION_RECEIPT_v1';
export const LOCK_MANAGER_PATH = 'tools/operation-intake/repository-operation-lock-manager.v1.mjs';
export const LOCK_MANAGER_BLOB = 'edb249f76cc326ea2f07aae20510f894c0e4511c';
const REQUIRED_KEYS = Object.freeze([
  'schema',
  'repository',
  'operationId',
  'lockScope',
  'lockGeneration',
  'terminalDisposition'
]);
const PROHIBITED_KEYS = Object.freeze([
  'command',
  'shellCommand',
  'scriptBody',
  'workflowOverride',
  'repositoryOverride',
  'lockRef',
  'lockRefOverride',
  'environment',
  'environmentOverride',
  'extraArguments',
  'branch',
  'path',
  'ledgerPath',
  'ledgerContent'
]);

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const fail = (code, detail = null) => {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
};
const auditFactory = () => {
  const events = [];
  return {
    events,
    add(event, details = {}) {
      events.push({ sequence: events.length + 1, event, details: stable(details) });
    }
  };
};

function repositoryRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
}

export function verifyBoundIdentity(root = repositoryRoot()) {
  const absolute = path.join(root, LOCK_MANAGER_PATH);
  const bytes = fs.readFileSync(absolute);
  const actual = gitBlobSha(bytes);
  if (actual !== LOCK_MANAGER_BLOB) {
    fail('LOCK_MANAGER_IDENTITY_MISMATCH', { expected: LOCK_MANAGER_BLOB, actual });
  }
  return actual;
}

export function validateClosureRequest(value) {
  if (!isObject(value)) fail('REQUEST_NOT_OBJECT');
  const keys = Object.keys(value).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...REQUIRED_KEYS].sort())) {
    fail('REQUEST_SCHEMA_OR_KEYSET_INVALID', keys);
  }
  for (const key of PROHIBITED_KEYS) {
    if (Object.hasOwn(value, key)) fail('PROHIBITED_REQUEST_FIELD', key);
  }
  if (value.schema !== REQUEST_SCHEMA) fail('REQUEST_SCHEMA_OR_KEYSET_INVALID', 'schema');
  if (value.repository !== REPOSITORY) fail('REPOSITORY_SUBSTITUTION_PROHIBITED', value.repository);
  if (typeof value.operationId !== 'string' || !value.operationId.trim() || value.operationId.length > 512 || /[\u0000\r\n]/.test(value.operationId)) {
    fail('OPERATION_ID_INVALID');
  }
  if (typeof value.lockScope !== 'string' || !value.lockScope) fail('LOCK_SCOPE_INVALID');
  if (canonScope(value.lockScope) !== value.lockScope) fail('LOCK_SCOPE_NOT_CANONICAL');
  if (!Number.isInteger(value.lockGeneration) || value.lockGeneration < 1) fail('LOCK_GENERATION_INVALID');
  if (!TERMINAL.includes(value.terminalDisposition)) fail('TERMINAL_DISPOSITION_INVALID');
  return stable(value);
}

export async function executeClosure(raw) {
  const audit = auditFactory();
  let nativeReceipt = null;
  try {
    const request = validateClosureRequest(raw);
    audit.add('REQUEST_VALIDATED', {
      operationId: request.operationId,
      lockScope: request.lockScope,
      lockGeneration: request.lockGeneration,
      terminalDisposition: request.terminalDisposition
    });
    const token = process.env.GITHUB_TOKEN;
    if (!token) fail('GITHUB_TOKEN_MISSING');
    const lockManagerBlob = verifyBoundIdentity();
    audit.add('LOCK_MANAGER_IDENTITY_VERIFIED', { lockManagerBlob });
    nativeReceipt = await closeRemote({
      repository: REPOSITORY,
      lockRef: LOCK_REF,
      token,
      operationId: request.operationId,
      lockScope: request.lockScope,
      lockGeneration: request.lockGeneration,
      terminalDisposition: request.terminalDisposition
    });
    audit.add('CANONICAL_CLOSE_REMOTE_RETURNED', {
      schema: nativeReceipt?.schema ?? null,
      result: nativeReceipt?.result ?? null
    });
    if (nativeReceipt?.schema !== 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1') {
      fail('NATIVE_RECEIPT_SCHEMA_MISMATCH', nativeReceipt?.schema ?? null);
    }
    if (nativeReceipt.result !== 'TERMINAL_CLOSURE_COMMITTED' || nativeReceipt.lockReleased !== true) {
      fail('REMOTE_CAS_CLOSURE_FAILURE', nativeReceipt.result);
    }
    if (
      nativeReceipt.operationId !== request.operationId ||
      nativeReceipt.lockScope !== request.lockScope ||
      nativeReceipt.lockGeneration !== request.lockGeneration ||
      nativeReceipt.terminalDisposition !== request.terminalDisposition
    ) {
      fail('NATIVE_RECEIPT_IDENTITY_MISMATCH');
    }
    const nativeBytes = Buffer.from(text(nativeReceipt), 'utf8');
    const receipt = stable({
      schema: RECEIPT_SCHEMA,
      result: 'TERMINAL_CLOSURE_COMMITTED',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: LOCK_REF,
      lockManagerPath: LOCK_MANAGER_PATH,
      lockManagerBlob: LOCK_MANAGER_BLOB,
      operationId: request.operationId,
      lockScope: request.lockScope,
      lockGeneration: request.lockGeneration,
      terminalDisposition: request.terminalDisposition,
      nativeReceiptSha256: sha256(nativeBytes),
      nativeReceiptJson: nativeReceipt,
      nativeReceiptRewritten: false,
      directLedgerEditPerformed: false,
      genericCommandAuthority: false,
      repositoryMutationLimitedToCanonicalLockManager: true,
      semanticAuthorityCreated: false,
      auditEvents: audit.events
    });
    return { receipt, nativeReceipt };
  } catch (error) {
    const nativeBytes = nativeReceipt ? Buffer.from(text(nativeReceipt), 'utf8') : null;
    const receipt = stable({
      schema: RECEIPT_SCHEMA,
      result: 'FAIL_CLOSED_NO_CLOSURE',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: LOCK_REF,
      lockManagerPath: LOCK_MANAGER_PATH,
      lockManagerBlob: LOCK_MANAGER_BLOB,
      errorCode: error.code ?? 'UNEXPECTED_TERMINAL_CLOSURE_FAILURE',
      detail: error.detail ?? error.message,
      nativeReceiptSha256: nativeBytes ? sha256(nativeBytes) : null,
      nativeReceiptJson: nativeReceipt,
      nativeReceiptRewritten: false,
      directLedgerEditPerformed: false,
      genericCommandAuthority: false,
      repositoryMutationLimitedToCanonicalLockManager: true,
      semanticAuthorityCreated: false,
      auditEvents: audit.events
    });
    return { receipt, nativeReceipt };
  }
}

function parseArgs(argv) {
  const allowed = new Set(['--input', '--output', '--native-output']);
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!allowed.has(key) || value === undefined) fail('CLI_ARGUMENTS_NOT_FIXED', key);
    const normalized = key.slice(2);
    if (Object.hasOwn(result, normalized)) fail('CLI_ARGUMENT_DUPLICATE', key);
    result[normalized] = value;
  }
  if (Object.keys(result).length !== 3 || !result.input || !result.output || !result['native-output']) {
    fail('CLI_ARGUMENTS_INCOMPLETE');
  }
  return result;
}

function runtimePath(value, label) {
  const root = path.resolve(process.env.RUNNER_TEMP || '/tmp');
  const resolved = path.resolve(value);
  if (!(resolved === root || resolved.startsWith(root + path.sep))) {
    fail('RUNTIME_PATH_OUTSIDE_RUNNER_TEMP', label);
  }
  return resolved;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text(value));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = runtimePath(args.input, 'input');
  const outputPath = runtimePath(args.output, 'output');
  const nativeOutputPath = runtimePath(args['native-output'], 'native-output');
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const { receipt, nativeReceipt } = await executeClosure(raw);
  writeJson(outputPath, receipt);
  if (nativeReceipt) writeJson(nativeOutputPath, nativeReceipt);
  if (receipt.result !== 'TERMINAL_CLOSURE_COMMITTED') process.exitCode = 1;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  main().catch(error => {
    process.stderr.write(text({
      schema: 'REMOTE_OPERATION_TERMINAL_CLOSURE_PROCESS_FAILURE_v1',
      result: 'FAIL_CLOSED_NO_CLOSURE',
      errorCode: error.code ?? 'UNEXPECTED_PROCESS_FAILURE',
      error: error.message
    }));
    process.exitCode = 1;
  });
}
