#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  stable,
  hashObject,
  fail,
  readJson,
  writeJson,
  assertClosedKeys,
  assertObject,
  validateInputObject,
  parseArgs
} from './lib.v1.mjs';
import { validateSuccessorCompatibility } from './successor-compatibility-validator.v1.mjs';

const REQUEST_REQUIRED = [
  'schema',
  'requestId',
  'descriptorId',
  'operationId',
  'admissionReceiptIdentity',
  'routerReceiptIdentity',
  'inputs',
  'availableCapabilities',
  'requestNonce'
];
const REQUEST_ALLOWED = [...REQUEST_REQUIRED];
const FORBIDDEN_REQUEST_KEYS = [
  'command',
  'shellCommand',
  'scriptBody',
  'workflowOverride',
  'repositoryPathOverride',
  'environment',
  'environmentOverride',
  'extraArguments'
];

export function validateExecutionRequest(request) {
  assertClosedKeys(request, REQUEST_REQUIRED, REQUEST_ALLOWED, 'EXECUTION_REQUEST');
  if (request.schema !== 'AI_ROOM_EXECUTION_REQUEST_v1') fail('EXECUTION_REQUEST_SCHEMA_MISMATCH');
  for (const key of FORBIDDEN_REQUEST_KEYS) if (Object.hasOwn(request, key)) fail('ARBITRARY_EXECUTION_FIELD_PROHIBITED', key);
  if (!/^[0-9a-f]{64}$/.test(request.requestNonce ?? '')) fail('REQUEST_NONCE_INVALID');
  assertObject(request.inputs, 'EXECUTION_REQUEST_INPUTS_INVALID');
  assertObject(request.availableCapabilities, 'EXECUTION_REQUEST_CAPABILITIES_INVALID');
  return stable(request);
}

function validateAdmission(admission, descriptor) {
  assertObject(admission, 'ADMISSION_RECEIPT_INVALID');
  if (admission.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1') fail('ADMISSION_RECEIPT_SCHEMA_MISMATCH');
  if (admission.result !== 'ADMITTED_AND_LOCKED') fail('ADMISSION_NOT_ACTIVE', admission.result);
  if (admission.operationId !== descriptor.operationId) fail('DESCRIPTOR_AND_ADMISSION_MISMATCH', 'operationId');
  if (admission.projectId !== descriptor.projectId) fail('DESCRIPTOR_AND_ADMISSION_MISMATCH', 'projectId');
  if (admission.operationStarted !== true || admission.workflowExecutionAuthorized !== true) fail('ADMISSION_EXECUTION_NOT_AUTHORIZED');
  const lock = assertObject(admission.lock, 'ADMISSION_LOCK_MISSING');
  if (lock.operationId !== descriptor.operationId) fail('DESCRIPTOR_AND_ADMISSION_MISMATCH', 'lock.operationId');
  if (lock.released === true || lock.state === 'TERMINAL') fail('EXPIRED_OR_CLOSED_LOCK');
  if (!['ADMITTED_LOCKED', 'EXECUTING'].includes(lock.state)) fail('LOCK_STATE_NOT_EXECUTABLE', lock.state);
  return stable({
    mode: 'EXACT_OPERATION_ID',
    authorizedOperationId: descriptor.operationId,
    admissionLockGeneration: lock.lockGeneration,
    successorCompatibilityUsed: false,
    successorCompatibilityReceipt: null
  });
}

function validateRouter(router, descriptor) {
  assertObject(router, 'ROUTER_RECEIPT_INVALID');
  if (router.schema !== 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1') fail('ROUTER_RECEIPT_SCHEMA_MISMATCH');
  if (router.disposition !== 'PASS') fail('ROUTER_DISPOSITION_NOT_PASS', router.disposition);
  const routes = Array.isArray(router.routes) ? router.routes : [];
  const matching = routes.filter(route => route.projectId === descriptor.projectId && route.disposition === 'PASS');
  if (matching.length !== 1) fail(matching.length === 0 ? 'AUTHORITY_ROUTE_NOT_FOUND' : 'AUTHORITY_ROUTE_AMBIGUOUS');
}

function validateRegistry(registry, allowCandidate) {
  assertObject(registry, 'TOOLSET_REGISTRY_INVALID');
  if (registry.schema !== 'REPOSITORY_AUTHORIZED_TOOLSET_REGISTRY_v1') fail('TOOLSET_REGISTRY_SCHEMA_MISMATCH');
  if (registry.closedWorld !== true || registry.arbitraryCommandAccepted !== false || registry.movingToolingRefsAccepted !== false) fail('TOOLSET_REGISTRY_NOT_FAIL_CLOSED');
  const allowedStatuses = allowCandidate ? ['BOOTSTRAP_CANDIDATE_NOT_ACTIVE', 'ACTIVE_CERTIFIED'] : ['ACTIVE_CERTIFIED'];
  if (!allowedStatuses.includes(registry.status)) fail('TOOLSET_REGISTRY_NOT_ACTIVE', registry.status);
  if (!Array.isArray(registry.tools) || registry.tools.length === 0) fail('TOOLSET_REGISTRY_EMPTY');
}

export function resolveToolset({ request: rawRequest, registry, admissionReceipt, admissionReceiptIdentity = null, routerReceipt, allowCandidate = false }) {
  const request = validateExecutionRequest(rawRequest);
  validateRegistry(registry, allowCandidate);

  const matches = registry.tools.filter(tool => tool.descriptorId === request.descriptorId);
  if (matches.length !== 1) fail(matches.length === 0 ? 'AUTHORIZED_TOOLSET_NOT_FOUND' : 'AUTHORIZED_TOOLSET_AMBIGUOUS');
  const descriptor = stable(matches[0]);
  if (!allowCandidate && descriptor.descriptorActivationStatus !== 'ACTIVE_CERTIFIED') fail('DESCRIPTOR_NOT_ACTIVE', descriptor.descriptorActivationStatus);
  if (!/^[0-9a-f]{40}$/.test(descriptor.exactToolingHead ?? '')) fail('TOOLING_HEAD_NOT_IMMUTABLE');
  if (descriptor.commandSpecification?.shell !== false) fail('SHELL_EXECUTION_PROHIBITED');
  if (descriptor.commandSpecification?.extraArgumentsAllowed !== false) fail('EXTRA_ARGUMENTS_PROHIBITION_MISSING');
  if (descriptor.commandSpecification?.environmentOverridesAllowed !== false) fail('ENVIRONMENT_OVERRIDE_PROHIBITION_MISSING');

  let authorization;
  if (request.operationId === descriptor.operationId) {
    authorization = validateAdmission(admissionReceipt, descriptor);
  } else {
    const compatibility = validateSuccessorCompatibility({
      descriptor,
      request,
      successorReceipt: admissionReceipt,
      receiptIdentity: admissionReceiptIdentity
    });
    authorization = stable({
      mode: 'CANONICAL_ONE_HOP_SUCCESSOR',
      authorizedOperationId: compatibility.authorizedOperationId,
      admissionLockGeneration: compatibility.successorLockGeneration,
      successorCompatibilityUsed: true,
      successorCompatibilityReceipt: compatibility
    });
  }

  validateRouter(routerReceipt, descriptor);
  const validatedInputs = validateInputObject(descriptor.canonicalInputSchema, request.inputs);
  return stable({
    schema: 'AUTHORIZED_TOOLSET_RESOLUTION_RECEIPT_v1',
    result: 'EXACTLY_ONE_AUTHORIZED_DESCRIPTOR_RESOLVED',
    requestId: request.requestId,
    operationId: descriptor.operationId,
    descriptorOperationId: descriptor.operationId,
    authorizedOperationId: authorization.authorizedOperationId,
    descriptorId: descriptor.descriptorId,
    descriptorDigest: hashObject(descriptor),
    descriptor,
    validatedInputs,
    admissionLockGeneration: authorization.admissionLockGeneration,
    authorizationMode: authorization.mode,
    successorCompatibilityUsed: authorization.successorCompatibilityUsed,
    successorCompatibilityReceipt: authorization.successorCompatibilityReceipt,
    authorityRouteProjectId: descriptor.projectId
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = resolveToolset({
    request: readJson(args.request),
    registry: readJson(args.registry),
    admissionReceipt: readJson(args.admission),
    admissionReceiptIdentity: args['admission-identity'] ? readJson(args['admission-identity']) : null,
    routerReceipt: readJson(args.router),
    allowCandidate: args['allow-candidate'] === 'true'
  });
  writeJson(args.output, result);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    main();
  } catch (error) {
    const args = (() => { try { return parseArgs(process.argv.slice(2)); } catch { return {}; } })();
    const failure = stable({
      schema: 'AUTHORIZED_TOOLSET_RESOLUTION_FAILURE_v1',
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_RESOLVER_ERROR',
      detail: error.detail ?? error.message
    });
    if (args.output) writeJson(args.output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}
