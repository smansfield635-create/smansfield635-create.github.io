#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  stable,
  canonical,
  hashObject,
  sha256,
  fail,
  readJson,
  writeJson,
  validateReceiptIdentity,
  parseArgs
} from './lib.v1.mjs';
import { validateExecutionRequest, resolveToolset } from './toolset-resolver.v1.mjs';
import { selectBackend } from './backend-selector.v1.mjs';
import { parseTransportBody } from './transport-request-parser.v1.mjs';
import { dispatchLoaded } from './fixed-command-dispatcher.v1.mjs';
import { validateCommandReceipt } from './command-receipt-validator.v1.mjs';
import { applyContinuationGate } from './continuation-gate.v1.mjs';

const BASE = '.github/ai-toolset-transport';
const REGISTRY = `${BASE}/authorized-toolset-registry.v1.json`;
const SCHEMAS = `${BASE}/schemas.v1.json`;
const FIXTURES = `${BASE}/negative-fixtures.v1.json`;
const MANIFEST = `${BASE}/changed-path-manifest.v1.json`;

function git(root, ...args) {
  return cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
}

function gitBytes(root, ...args) {
  return cp.execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
}

function fixture(registry, holder) {
  const descriptor = registry.tools[0];
  const request = {
    schema: 'AI_ROOM_EXECUTION_REQUEST_v1',
    requestId: `AI_ROOM_BOOTSTRAP_SELF_TEST_${holder}`,
    descriptorId: descriptor.descriptorId,
    operationId: descriptor.operationId,
    admissionReceiptIdentity: {
      sourceClass: 'REPOSITORY_PATH_AT_EXACT_HEAD',
      exactHead: '0'.repeat(40),
      path: '.github/operation-intake/evidence/fixture-admission.json',
      sha256: '0'.repeat(64)
    },
    routerReceiptIdentity: {
      sourceClass: 'REPOSITORY_PATH_AT_EXACT_HEAD',
      exactHead: '0'.repeat(40),
      path: '.github/ai-router/evidence/fixture-router.json',
      sha256: '0'.repeat(64)
    },
    inputs: {
      expectedHead: 'cfc2dc915ae84fd6349832500165a40a5dd0ddb8',
      baseHead: 'fa7e74403ff43e017bccef7462f4e001918cf0a3',
      executionHolder: holder
    },
    availableCapabilities: {
      schema: 'AVAILABLE_CAPABILITY_RECEIPT_v1',
      availableBackends: ['GITHUB_ACTIONS_CLEAN_EXECUTION'],
      availableWorkflowPaths: ['.github/workflows/ai-room-execution-transport.yml'],
      availableToolingHeads: ['cfc2dc915ae84fd6349832500165a40a5dd0ddb8']
    },
    requestNonce: 'a'.repeat(64)
  };
  const admissionReceipt = {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: descriptor.operationId,
    projectId: descriptor.projectId,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    lock: {
      operationId: descriptor.operationId,
      state: 'ADMITTED_LOCKED',
      released: false,
      lockGeneration: 1
    }
  };
  const routerReceipt = {
    schema: 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1',
    disposition: 'PASS',
    routes: [{ projectId: descriptor.projectId, disposition: 'PASS' }]
  };
  return { request, admissionReceipt, routerReceipt, registry };
}

function clone(value) { return structuredClone(value); }
function expected(id, code, fn) {
  try {
    fn();
    return { id, expectedErrorCode: code, observedErrorCode: 'NO_FAILURE', pass: false };
  } catch (error) {
    return { id, expectedErrorCode: code, observedErrorCode: error.code ?? error.message, pass: (error.code ?? error.message) === code };
  }
}

function runNegative(base, descriptor, positiveReceipt) {
  const tests = [];
  tests.push(expected('ARBITRARY_COMMAND_FROM_ISSUE', 'EXECUTION_REQUEST_UNKNOWN_FIELD', () => {
    const x = clone(base.request); x.shellCommand = 'echo unauthorized'; validateExecutionRequest(x);
  }));
  tests.push(expected('UNREGISTERED_TOOL', 'AUTHORIZED_TOOLSET_NOT_FOUND', () => {
    const x = clone(base); x.request.descriptorId = 'UNREGISTERED_TOOL_DESCRIPTOR'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('UNKNOWN_DESCRIPTOR', 'AUTHORIZED_TOOLSET_NOT_FOUND', () => {
    const x = clone(base); x.request.descriptorId = 'UNKNOWN_DESCRIPTOR'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('DESCRIPTOR_OPERATION_MISMATCH', 'AUTHORIZED_TOOLSET_NOT_FOUND', () => {
    const x = clone(base); x.request.operationId = 'OTHER_OPERATION_v1'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('ADMISSION_OPERATION_MISMATCH', 'DESCRIPTOR_AND_ADMISSION_MISMATCH', () => {
    const x = clone(base); x.admissionReceipt.operationId = 'OTHER_OPERATION_v1'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('ADMISSION_PROJECT_MISMATCH', 'DESCRIPTOR_AND_ADMISSION_MISMATCH', () => {
    const x = clone(base); x.admissionReceipt.projectId = 'OTHER_PROJECT'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('ROUTER_RECEIPT_MISMATCH', 'AUTHORITY_ROUTE_NOT_FOUND', () => {
    const x = clone(base); x.routerReceipt.routes = [{ projectId: 'OTHER_PROJECT', disposition: 'PASS' }]; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('CLOSED_LOCK', 'EXPIRED_OR_CLOSED_LOCK', () => {
    const x = clone(base); x.admissionReceipt.lock.released = true; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('UNSUPPORTED_RECEIPT_SOURCE', 'UNSUPPORTED_RECEIPT_SOURCE_CLASS', () => {
    const x = clone(base.request.admissionReceiptIdentity); x.sourceClass = 'INLINE_UNTRUSTED'; validateReceiptIdentity(x);
  }));
  tests.push(expected('UNAUTHORIZED_INPUT_FIELD', 'INPUT_UNKNOWN_FIELD', () => {
    const x = clone(base); x.request.inputs.extra = 'not allowed'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('INPUT_CONST_MISMATCH', 'INPUT_CONST_MISMATCH', () => {
    const x = clone(base); x.request.inputs.expectedHead = '1'.repeat(40); resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('NO_AUTHORIZED_BACKEND', 'NO_AUTHORIZED_BACKEND_AVAILABLE', () => {
    const resolution = resolveToolset({ ...clone(base), allowCandidate: true });
    const capabilities = clone(base.request.availableCapabilities); capabilities.availableBackends = [];
    selectBackend({ resolutionReceipt: resolution, capabilities });
  }));
  tests.push(expected('BACKEND_SELECTION_AMBIGUOUS', 'AUTHORIZED_BACKEND_SELECTION_AMBIGUOUS', () => {
    const x = clone(base);
    x.registry.tools[0].allowedBackends.push({ backendId: 'LOCAL_CLEAN_GIT', priority: 100, requirements: [] });
    x.request.availableCapabilities.availableBackends.push('LOCAL_CLEAN_GIT');
    const resolution = resolveToolset({ ...x, allowCandidate: true });
    selectBackend({ resolutionReceipt: resolution, capabilities: x.request.availableCapabilities });
  }));
  tests.push(expected('MOVING_TOOLING_REF', 'TOOLING_HEAD_NOT_IMMUTABLE', () => {
    const x = clone(base); x.registry.tools[0].exactToolingHead = 'main'; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('SHELL_EXECUTION_REQUESTED', 'SHELL_EXECUTION_PROHIBITED', () => {
    const x = clone(base); x.registry.tools[0].commandSpecification.shell = true; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('EXTRA_ARGUMENTS_ALLOWED', 'EXTRA_ARGUMENTS_PROHIBITION_MISSING', () => {
    const x = clone(base); x.registry.tools[0].commandSpecification.extraArgumentsAllowed = true; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('ENVIRONMENT_OVERRIDE_ALLOWED', 'ENVIRONMENT_OVERRIDE_PROHIBITION_MISSING', () => {
    const x = clone(base); x.registry.tools[0].commandSpecification.environmentOverridesAllowed = true; resolveToolset({ ...x, allowCandidate: true });
  }));
  tests.push(expected('FORGED_COMMAND_RECEIPT', 'COMMAND_RECEIPT_DESCRIPTOR_MISMATCH', () => {
    const receipt = clone(positiveReceipt); receipt.descriptorId = 'FORGED_DESCRIPTOR'; validateCommandReceipt({ descriptor, receipt });
  }));
  tests.push(expected('UNAUTHORIZED_CHANGED_PATH_IN_RECEIPT', 'RECEIPT_UNAUTHORIZED_PATH_OBSERVED', () => {
    const receipt = clone(positiveReceipt); receipt.changedPaths = ['future-project/unauthorized.txt']; validateCommandReceipt({ descriptor, receipt });
  }));
  tests.push(expected('CONTINUATION_WITHOUT_VALIDATION', 'CONTINUATION_VALIDATION_SCHEMA_MISMATCH', () => {
    applyContinuationGate({ descriptor, validationResult: { schema: 'NOT_A_VALIDATION_RESULT' } });
  }));
  return tests;
}

function repositoryIdentity(root, expectedHead) {
  const manifest = readJson(path.join(root, MANIFEST));
  const actualHead = git(root, 'rev-parse', 'HEAD^{commit}');
  if (actualHead !== expectedHead) fail('EXACT_HEAD_MISMATCH', `${expectedHead}:${actualHead}`);
  if (git(root, 'status', '--porcelain=v1', '--untracked-files=all')) fail('DIRTY_BOOTSTRAP_WORKTREE');
  const paths = git(root, 'diff', '--name-only', manifest.baseHead, expectedHead).split(/\r?\n/).filter(Boolean).sort();
  const expectedPaths = [...manifest.expectedChangedPaths].sort();
  if (canonical(paths) !== canonical(expectedPaths)) fail('BOOTSTRAP_CHANGED_PATH_SET_MISMATCH');
  const blobMap = paths.map(filePath => ({
    path: filePath,
    gitBlob: git(root, 'rev-parse', `${expectedHead}:${filePath}`),
    sha256: sha256(gitBytes(root, 'show', `${expectedHead}:${filePath}`))
  }));
  return { baseHead: manifest.baseHead, expectedHead, changedPathCount: paths.length, changedPathBlobMap: blobMap };
}

export function runSelfTest({ root, expectedHead, holder, outputDir }) {
  const registry = readJson(path.join(root, REGISTRY));
  const schemas = readJson(path.join(root, SCHEMAS));
  const declaredFixtures = readJson(path.join(root, FIXTURES));
  const base = fixture(registry, holder);
  const body = `prefix\n<!-- AI_ROOM_EXECUTION_REQUEST_V1\n${JSON.stringify(base.request)}\nAI_ROOM_EXECUTION_REQUEST_V1 -->\nsuffix`;
  const parsed = parseTransportBody(body);
  if (canonical(parsed) !== canonical(stable(base.request))) fail('TRANSPORT_PARSE_ROUNDTRIP_MISMATCH');
  const resolution = resolveToolset({ ...base, allowCandidate: true });
  const backend = selectBackend({ resolutionReceipt: resolution, capabilities: base.request.availableCapabilities });
  const commandReceipt = dispatchLoaded({ ...base, request: parsed, root, allowCandidate: true });
  if (commandReceipt.executionDisposition !== 'COMMAND_EXECUTED_AND_PASSED') fail('POSITIVE_COMMAND_EXECUTION_FAILED', commandReceipt.errorCode ?? commandReceipt.executionDisposition);
  const descriptor = registry.tools[0];
  const validation = validateCommandReceipt({ descriptor, receipt: commandReceipt });
  if (validation.validationDisposition !== 'VALIDATED_PASS') fail('POSITIVE_RECEIPT_VALIDATION_FAILED');
  const continuation = applyContinuationGate({ descriptor, validationResult: validation });
  if (continuation.result !== 'CONTINUE') fail('POSITIVE_CONTINUATION_FAILED');
  const negative = runNegative(base, descriptor, commandReceipt);
  const declared = declaredFixtures.fixtures.map(x => ({ id: x.id, expectedErrorCode: x.expectedErrorCode })).sort((a,b) => a.id.localeCompare(b.id));
  const observed = negative.map(x => ({ id: x.id, expectedErrorCode: x.expectedErrorCode })).sort((a,b) => a.id.localeCompare(b.id));
  if (canonical(declared) !== canonical(observed)) fail('NEGATIVE_FIXTURE_REGISTRY_MISMATCH');
  if (!negative.every(test => test.pass)) fail('NEGATIVE_FIXTURE_FAILURE', canonical(negative.filter(test => !test.pass)));
  const identity = repositoryIdentity(root, expectedHead);
  const fingerprintPayload = stable({
    schema: 'REPOSITORY_AUTHORIZED_TOOLSET_AND_AI_ROOM_TRANSPORT_PACKAGE_FINGERPRINT_PAYLOAD_v1',
    ...identity,
    registryDigest: hashObject(registry),
    schemaRegistryDigest: hashObject(schemas),
    negativeFixtureRegistryDigest: hashObject(declaredFixtures),
    negativeResults: negative.map(test => ({ id: test.id, expectedErrorCode: test.expectedErrorCode, pass: test.pass })),
    resolvedDescriptorDigest: resolution.descriptorDigest,
    selectedBackend: backend.selectedBackend,
    commandPayloadSchema: commandReceipt.commandPayloadSchema,
    continuationRule: continuation.ruleApplied,
    normalization: { excludes: ['EXECUTION_HOLDER', 'REQUEST_ID', 'COMMAND_INPUT_DIGEST', 'WORKFLOW_RUN_ID', 'WORKFLOW_JOB_ID', 'TEMP_PATHS'] }
  });
  const receipt = stable({
    schema: 'REPOSITORY_AUTHORIZED_TOOLSET_AND_AI_ROOM_TRANSPORT_BOOTSTRAP_SELF_TEST_RECEIPT_v1',
    result: 'PASS_CLOSED',
    executionHolder: holder,
    expectedHead,
    packageFingerprint: hashObject(fingerprintPayload),
    fingerprintPayload,
    negativeFixtureCount: negative.length,
    negativeFixturesPassed: negative.filter(test => test.pass).length,
    commandExecutionPassed: true,
    receiptValidationPassed: true,
    continuationGatePassed: true,
    productMutationPerformed: false,
    roleActivationPerformed: false,
    methodsAuditExecuted: false,
    mergePerformed: false,
    permanentTransportActivated: false
  });
  fs.mkdirSync(outputDir, { recursive: true });
  writeJson(path.join(outputDir, 'bootstrap-self-test-receipt.json'), receipt);
  writeJson(path.join(outputDir, 'command-execution-receipt.json'), commandReceipt);
  writeJson(path.join(outputDir, 'receipt-validation-result.json'), validation);
  writeJson(path.join(outputDir, 'continuation-gate-result.json'), continuation);
  return receipt;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  runSelfTest({
    root: path.resolve(args.root ?? '.'),
    expectedHead: args['expected-head'],
    holder: args.holder,
    outputDir: path.resolve(args['output-dir'])
  });
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
