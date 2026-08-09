#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { prepare } from '../../../tools/operation-intake/repository-operation-intake-gate.v1.mjs';
import {
  DEFAULT_LOCK_REF,
  RECEIPT_SCHEMA as NATIVE_RECEIPT_SCHEMA,
  successorRemote,
  validateTransition
} from './repository-operation-successor-gate.v1.mjs';
import { stable, text } from '../../../tools/operation-intake/repository-operation-lock-manager.v1.mjs';

export const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
export const ROUTE_ID = 'REMOTE_OPERATION_SUCCESSOR_TRANSITION_v1';
export const REQUEST_SCHEMA = 'REMOTE_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1';
export const RECEIPT_SCHEMA = 'REMOTE_OPERATION_SUCCESSOR_TRANSITION_INVOCATION_RECEIPT_v1';
export const SUCCESSOR_GATE_PATH = '.github/ai-router/operation-lifecycle/repository-operation-successor-gate.v1.mjs';
export const SUCCESSOR_GATE_BLOB = 'b174bb20a19e62f9aaf6e819171e24416321b9e4';
const REQUIRED_KEYS = Object.freeze([
  'schema',
  'repository',
  'transition',
  'successorRequest',
  'successorProcedure'
]);
const PROHIBITED_KEYS = new Set([
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
  'ledgerPath',
  'ledgerContent',
  'genericCommand'
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
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
}

function rejectProhibitedKeys(value, trail = '$') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => rejectProhibitedKeys(entry, `${trail}[${index}]`));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (PROHIBITED_KEYS.has(key)) fail('PROHIBITED_REQUEST_FIELD', `${trail}.${key}`);
    rejectProhibitedKeys(child, `${trail}.${key}`);
  }
}

export function verifyBoundIdentity(root = repositoryRoot()) {
  const absolute = path.join(root, SUCCESSOR_GATE_PATH);
  const bytes = fs.readFileSync(absolute);
  const actual = gitBlobSha(bytes);
  if (actual !== SUCCESSOR_GATE_BLOB) {
    fail('SUCCESSOR_GATE_IDENTITY_MISMATCH', { expected: SUCCESSOR_GATE_BLOB, actual });
  }
  return actual;
}

export function validateRemoteSuccessorRequest(value) {
  if (!isObject(value)) fail('REQUEST_NOT_OBJECT');
  const keys = Object.keys(value).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...REQUIRED_KEYS].sort())) {
    fail('REQUEST_SCHEMA_OR_KEYSET_INVALID', keys);
  }
  rejectProhibitedKeys(value);
  if (value.schema !== REQUEST_SCHEMA) fail('REQUEST_SCHEMA_OR_KEYSET_INVALID', 'schema');
  if (value.repository !== REPOSITORY) fail('REPOSITORY_SUBSTITUTION_PROHIBITED', value.repository);
  if (!isObject(value.transition)) fail('TRANSITION_NOT_OBJECT');
  if (!isObject(value.successorRequest)) fail('SUCCESSOR_REQUEST_NOT_OBJECT');
  if (!isObject(value.successorProcedure)) fail('SUCCESSOR_PROCEDURE_NOT_OBJECT');

  const transition = validateTransition(value.transition);
  const prepared = prepare(value.successorRequest, value.successorProcedure);
  if (transition.successor.operationId !== prepared.request.operationId) fail('SUCCESSOR_OPERATION_ID_MISMATCH');
  if (transition.successor.lockScope !== prepared.request.lockScope) fail('SUCCESSOR_SCOPE_MISMATCH');
  if (transition.successor.governingHead !== prepared.request.exactGoverningHead) fail('SUCCESSOR_GOVERNING_HEAD_MISMATCH');
  return stable({
    schema: REQUEST_SCHEMA,
    repository: REPOSITORY,
    transition,
    successorRequest: prepared.request,
    successorProcedure: prepared.procedure
  });
}

function validateNativeReceipt(nativeReceipt, request) {
  if (!isObject(nativeReceipt) || nativeReceipt.schema !== NATIVE_RECEIPT_SCHEMA) {
    fail('NATIVE_RECEIPT_SCHEMA_MISMATCH', nativeReceipt?.schema ?? null);
  }
  if (nativeReceipt.result !== 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED') {
    fail('CANONICAL_SUCCESSOR_GATE_REJECTED', nativeReceipt.result ?? null);
  }
  if (nativeReceipt.transitionId !== request.transition.transitionId) fail('NATIVE_RECEIPT_TRANSITION_ID_MISMATCH');
  if (nativeReceipt.predecessor?.operationId !== request.transition.predecessor.operationId) fail('NATIVE_RECEIPT_PREDECESSOR_MISMATCH');
  if (nativeReceipt.predecessor?.lockScope !== request.transition.predecessor.lockScope) fail('NATIVE_RECEIPT_PREDECESSOR_SCOPE_MISMATCH');
  if (nativeReceipt.predecessor?.lockGeneration !== request.transition.predecessor.lockGeneration) fail('NATIVE_RECEIPT_PREDECESSOR_GENERATION_MISMATCH');
  if (nativeReceipt.predecessor?.governingHead !== request.transition.predecessor.governingHead) fail('NATIVE_RECEIPT_PREDECESSOR_HEAD_MISMATCH');
  if (nativeReceipt.predecessor?.terminalDisposition !== 'SUPERSEDED') fail('NATIVE_RECEIPT_PREDECESSOR_NOT_SUPERSEDED');
  if (nativeReceipt.successor?.operationId !== request.successorRequest.operationId) fail('NATIVE_RECEIPT_SUCCESSOR_MISMATCH');
  if (nativeReceipt.successor?.lockScope !== request.successorRequest.lockScope) fail('NATIVE_RECEIPT_SUCCESSOR_SCOPE_MISMATCH');
  if (nativeReceipt.successor?.governingHead !== request.successorRequest.exactGoverningHead) fail('NATIVE_RECEIPT_SUCCESSOR_HEAD_MISMATCH');
  if (nativeReceipt.successor?.state !== 'ADMITTED_LOCKED') fail('NATIVE_RECEIPT_SUCCESSOR_NOT_LOCKED');
  if (nativeReceipt.authorityInherited !== false) fail('NATIVE_RECEIPT_AUTHORITY_INHERITANCE_FORBIDDEN');
  if (nativeReceipt.exactHeadRevalidationRequired !== true) fail('NATIVE_RECEIPT_EXACT_HEAD_REVALIDATION_MISSING');
  if (nativeReceipt.ledgerCompareAndSwapCommitted !== true) fail('NATIVE_RECEIPT_CAS_NOT_COMMITTED');
  return nativeReceipt;
}

export async function executeSuccessorTransition(raw, options = {}) {
  const audit = auditFactory();
  let nativeReceipt = null;
  try {
    const request = validateRemoteSuccessorRequest(raw);
    audit.add('REQUEST_VALIDATED', {
      transitionId: request.transition.transitionId,
      predecessorOperationId: request.transition.predecessor.operationId,
      predecessorLockGeneration: request.transition.predecessor.lockGeneration,
      successorOperationId: request.successorRequest.operationId,
      successorGoverningHead: request.successorRequest.exactGoverningHead
    });
    const token = options.token ?? process.env.GITHUB_TOKEN;
    if (!token) fail('GITHUB_TOKEN_MISSING');
    const verifier = options.identityVerifier ?? verifyBoundIdentity;
    const successorGateBlob = verifier(options.root ?? repositoryRoot());
    audit.add('SUCCESSOR_GATE_IDENTITY_VERIFIED', { successorGateBlob });
    const executor = options.successorExecutor ?? successorRemote;
    nativeReceipt = await executor({
      repository: REPOSITORY,
      lockRef: DEFAULT_LOCK_REF,
      token,
      transition: request.transition,
      request: request.successorRequest,
      procedure: request.successorProcedure
    });
    audit.add('CANONICAL_SUCCESSOR_GATE_RETURNED', {
      schema: nativeReceipt?.schema ?? null,
      result: nativeReceipt?.result ?? null
    });
    validateNativeReceipt(nativeReceipt, request);
    const nativeBytes = Buffer.from(text(nativeReceipt), 'utf8');
    const receipt = stable({
      schema: RECEIPT_SCHEMA,
      result: 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: DEFAULT_LOCK_REF,
      successorGatePath: SUCCESSOR_GATE_PATH,
      successorGateBlob: SUCCESSOR_GATE_BLOB,
      transitionId: request.transition.transitionId,
      predecessorOperationId: request.transition.predecessor.operationId,
      predecessorLockScope: request.transition.predecessor.lockScope,
      predecessorLockGeneration: request.transition.predecessor.lockGeneration,
      successorOperationId: request.successorRequest.operationId,
      successorLockScope: request.successorRequest.lockScope,
      successorLockGeneration: nativeReceipt.successor.lockGeneration,
      successorGoverningHead: request.successorRequest.exactGoverningHead,
      nativeReceiptSha256: sha256(nativeBytes),
      nativeReceiptJson: nativeReceipt,
      nativeReceiptRewritten: false,
      successorGateMutated: false,
      directLedgerEditPerformed: false,
      repositoryMutationLimitedToCanonicalSuccessorGate: true,
      genericCommandAuthority: false,
      arbitrarySuccessorAuthority: false,
      semanticAuthorityCreated: false,
      productMutationPerformed: false,
      auditEvents: audit.events
    });
    return { receipt, nativeReceipt };
  } catch (error) {
    const nativeBytes = nativeReceipt ? Buffer.from(text(nativeReceipt), 'utf8') : null;
    const receipt = stable({
      schema: RECEIPT_SCHEMA,
      result: 'FAIL_CLOSED_NO_SUCCESSOR',
      routeId: ROUTE_ID,
      repository: REPOSITORY,
      lockRef: DEFAULT_LOCK_REF,
      successorGatePath: SUCCESSOR_GATE_PATH,
      successorGateBlob: SUCCESSOR_GATE_BLOB,
      errorCode: error.code ?? 'UNEXPECTED_REMOTE_SUCCESSOR_FAILURE',
      detail: error.detail ?? error.message,
      nativeReceiptSha256: nativeBytes ? sha256(nativeBytes) : null,
      nativeReceiptJson: nativeReceipt,
      nativeReceiptRewritten: false,
      successorGateMutated: false,
      directLedgerEditPerformed: false,
      repositoryMutationLimitedToCanonicalSuccessorGate: true,
      genericCommandAuthority: false,
      arbitrarySuccessorAuthority: false,
      semanticAuthorityCreated: false,
      productMutationPerformed: false,
      auditEvents: audit.events
    });
    return { receipt, nativeReceipt };
  }
}

function parseArgs(argv) {
  const allowed = new Set(['--input', '--output', '--native-output']);
  const result = {};
  if (argv.length % 2 !== 0) fail('CLI_ARGUMENTS_NOT_FIXED');
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
  if (!(resolved === root || resolved.startsWith(root + path.sep))) fail('RUNTIME_PATH_OUTSIDE_RUNNER_TEMP', label);
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
  const { receipt, nativeReceipt } = await executeSuccessorTransition(raw);
  writeJson(outputPath, receipt);
  if (nativeReceipt) writeJson(nativeOutputPath, nativeReceipt);
  if (receipt.result !== 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED') process.exitCode = 1;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  main().catch(error => {
    process.stderr.write(text({
      schema: 'REMOTE_OPERATION_SUCCESSOR_TRANSITION_PROCESS_FAILURE_v1',
      result: 'FAIL_CLOSED_NO_SUCCESSOR',
      errorCode: error.code ?? 'UNEXPECTED_PROCESS_FAILURE',
      error: error.message,
      directLedgerEditPerformed: false,
      genericCommandAuthority: false
    }));
    process.exitCode = 1;
  });
}
