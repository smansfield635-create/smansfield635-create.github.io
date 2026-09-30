#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, hashObject, writeJson } from './lib.v1.mjs';
import { resolveToolset } from './toolset-resolver.v1.mjs';

function assert(condition, code, detail = null) {
  if (!condition) {
    const error = new Error(detail == null ? code : `${code}:${detail}`);
    error.code = code;
    error.detail = detail;
    throw error;
  }
}

function expectFailure(fn, code) {
  try { fn(); }
  catch (error) {
    assert(error.code === code, 'UNEXPECTED_NEGATIVE_ERROR', `${code}:${error.code}`);
    return code;
  }
  throw Object.assign(new Error(`NEGATIVE_FIXTURE_DID_NOT_FAIL:${code}`), { code: 'NEGATIVE_FIXTURE_DID_NOT_FAIL' });
}

const OLD_HEAD = '1'.repeat(40);
const NEW_HEAD = '2'.repeat(40);
const OLD_SCOPE_HASH = 'a'.repeat(64);
const NEW_SCOPE_HASH = 'b'.repeat(64);
const REQUEST_DIGEST = 'c'.repeat(64);
const PROCEDURE_DIGEST = 'd'.repeat(64);
const PROOF_DIGEST = 'e'.repeat(64);
const DESCRIPTOR_OPERATION = 'RECOGNIZED_PAGE_EXCELLENCE_OPERATION_v1';
const SUCCESSOR_OPERATION = 'RECOGNIZED_PAGE_EXCELLENCE_OPERATION_SUCCESSOR_20260809';
const DESCRIPTOR_ID = 'RECOGNIZED_PAGE_EXCELLENCE_DESCRIPTOR_V1';
const PROJECT_ID = 'H_EARTH';

function descriptor() {
  return {
    schema: 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1',
    descriptorId: DESCRIPTOR_ID,
    operationId: DESCRIPTOR_OPERATION,
    projectId: PROJECT_ID,
    descriptorActivationStatus: 'ACTIVE_CERTIFIED',
    exactToolingHead: '3'.repeat(40),
    commandSpecification: {
      executable: 'node',
      scriptPath: 'tools/example-fixed-command.v1.mjs',
      fixedArguments: [],
      inputArgumentBindings: [{ argument: '--subject-head', inputField: 'subjectHead' }],
      outputArgumentBindings: [{ argument: '--output', runtimeValue: 'COMMAND_PAYLOAD_RECEIPT_PATH' }],
      shell: false,
      extraArgumentsAllowed: false,
      environmentOverridesAllowed: false
    },
    canonicalInputSchema: {
      schemaId: 'EXAMPLE_INPUT_v1',
      required: ['subjectHead'],
      allowed: ['subjectHead'],
      properties: { subjectHead: { type: 'string', pattern: '^[0-9a-f]{40}$' } }
    },
    canonicalOutputSchema: { schemaId: 'EXAMPLE_OUTPUT_v1' },
    allowedBackends: [{ backendId: 'GITHUB_ACTIONS_CLEAN_EXECUTION', priority: 100 }]
  };
}

function registry() {
  return {
    schema: 'REPOSITORY_AUTHORIZED_TOOLSET_REGISTRY_v1',
    status: 'ACTIVE_CERTIFIED',
    closedWorld: true,
    arbitraryCommandAccepted: false,
    movingToolingRefsAccepted: false,
    tools: [descriptor()]
  };
}

function request(operationId = DESCRIPTOR_OPERATION) {
  return {
    schema: 'AI_ROOM_EXECUTION_REQUEST_v1',
    requestId: `SELF_TEST_${operationId}`,
    descriptorId: DESCRIPTOR_ID,
    operationId,
    admissionReceiptIdentity: {
      sourceClass: 'REPOSITORY_PATH_AT_EXACT_HEAD', exactHead: NEW_HEAD,
      path: 'artifacts/self-test/admission.json', sha256: PROOF_DIGEST
    },
    routerReceiptIdentity: {
      sourceClass: 'REPOSITORY_PATH_AT_EXACT_HEAD', exactHead: NEW_HEAD,
      path: 'artifacts/self-test/router.json', sha256: 'f'.repeat(64)
    },
    inputs: { subjectHead: NEW_HEAD },
    availableCapabilities: {},
    requestNonce: '9'.repeat(64)
  };
}

function directAdmission() {
  return {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: DESCRIPTOR_OPERATION,
    projectId: PROJECT_ID,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    lock: { operationId: DESCRIPTOR_OPERATION, state: 'ADMITTED_LOCKED', released: false, lockGeneration: 40 }
  };
}

function routerReceipt() {
  return {
    schema: 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1',
    disposition: 'PASS',
    routes: [{ projectId: PROJECT_ID, disposition: 'PASS' }]
  };
}

function successorReceipt() {
  return {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_RECEIPT_v1',
    result: 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED',
    transitionId: 'SELF_TEST_TRANSITION_001',
    reasonCode: 'GOVERNING_HEAD_ADVANCED',
    governingRef: 'refs/heads/main',
    predecessor: {
      operationId: DESCRIPTOR_OPERATION,
      lockScope: 'H_EARTH:HC02:PAGE_EXCELLENCE:REMOTE_EXECUTION:V2',
      scopeHash: OLD_SCOPE_HASH,
      lockGeneration: 41,
      governingHead: OLD_HEAD,
      terminalDisposition: 'SUPERSEDED',
      terminalHistoryPreserved: true
    },
    successor: {
      operationId: SUCCESSOR_OPERATION,
      projectId: PROJECT_ID,
      lockScope: 'H_EARTH:HC02:PAGE_EXCELLENCE:REMOTE_EXECUTION:V3',
      scopeHash: NEW_SCOPE_HASH,
      lockGeneration: 42,
      governingHead: NEW_HEAD,
      requestDigest: REQUEST_DIGEST,
      procedureLocatorDigest: PROCEDURE_DIGEST,
      state: 'ADMITTED_LOCKED'
    },
    authorityPolicy: 'FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE',
    authorityInherited: false,
    authoritySource: 'FRESH_SUCCESSOR_REQUEST_AND_CONSTRUCTION_PROCEDURE',
    evidencePolicy: 'EXACT_HEAD_REVALIDATION_REQUIRED',
    exactHeadRevalidationRequired: true,
    preservedEvidenceRefs: [],
    operationStarted: true,
    branchCreationAuthorized: true,
    repositoryWritesAuthorized: true,
    workflowExecutionAuthorized: true,
    implementationInferenceAuthorized: false,
    ledgerGenerationBefore: 41,
    ledgerGenerationAfter: 42,
    oneLedgerMutationRequired: true
  };
}

function proofIdentity() {
  return {
    sourceClass: 'REPOSITORY_PATH_AT_EXACT_HEAD',
    exactHead: NEW_HEAD,
    path: 'artifacts/self-test/successor-transition-receipt.json',
    sha256: PROOF_DIGEST
  };
}

function resolveDirect() {
  return resolveToolset({
    request: request(), registry: registry(), admissionReceipt: directAdmission(),
    routerReceipt: routerReceipt(), allowCandidate: false
  });
}

function resolveSuccessor(receipt = successorReceipt(), req = request(SUCCESSOR_OPERATION), reg = registry(), identity = proofIdentity()) {
  return resolveToolset({
    request: req, registry: reg, admissionReceipt: receipt, admissionReceiptIdentity: identity,
    routerReceipt: routerReceipt(), allowCandidate: false
  });
}

export function runSuccessorCompatibilitySelfTest() {
  const direct = resolveDirect();
  assert(direct.result === 'EXACTLY_ONE_AUTHORIZED_DESCRIPTOR_RESOLVED', 'DIRECT_PATH_FAILED');
  assert(direct.authorizationMode === 'EXACT_OPERATION_ID', 'DIRECT_MODE_CHANGED');
  assert(direct.operationId === DESCRIPTOR_OPERATION && direct.authorizedOperationId === DESCRIPTOR_OPERATION, 'DIRECT_IDENTITY_CHANGED');
  assert(direct.successorCompatibilityUsed === false, 'DIRECT_PATH_USED_SUCCESSOR_COMPATIBILITY');

  const successor = resolveSuccessor();
  assert(successor.result === 'EXACTLY_ONE_AUTHORIZED_DESCRIPTOR_RESOLVED', 'SUCCESSOR_PATH_FAILED');
  assert(successor.authorizationMode === 'CANONICAL_ONE_HOP_SUCCESSOR', 'SUCCESSOR_MODE_MISSING');
  assert(successor.operationId === DESCRIPTOR_OPERATION, 'DESCRIPTOR_OPERATION_ID_MUTATED');
  assert(successor.descriptorOperationId === DESCRIPTOR_OPERATION, 'DESCRIPTOR_OPERATION_ID_MISSING');
  assert(successor.authorizedOperationId === SUCCESSOR_OPERATION, 'AUTHORIZED_SUCCESSOR_ID_MISSING');
  assert(successor.successorCompatibilityUsed === true, 'SUCCESSOR_COMPATIBILITY_NOT_RECORDED');
  assert(successor.descriptor.commandSpecification.scriptPath === descriptor().commandSpecification.scriptPath, 'FIXED_COMMAND_SUBSTITUTED');
  assert(successor.descriptor.exactToolingHead === descriptor().exactToolingHead, 'TOOLING_HEAD_SUBSTITUTED');
  assert(successor.successorCompatibilityReceipt.successorProofSha256 === PROOF_DIGEST, 'SUCCESSOR_PROOF_DIGEST_NOT_PRESERVED');
  assert(successor.successorCompatibilityReceipt.authorityInherited === false, 'AUTHORITY_INHERITANCE_CREATED');
  assert(successor.successorCompatibilityReceipt.arbitrarySuccessorAccepted === false, 'ARBITRARY_SUCCESSOR_ACCEPTANCE_CREATED');

  const negatives = [];
  negatives.push(expectFailure(() => resolveSuccessor(directAdmission(), request('RANDOM_UNRELATED_OPERATION')), 'SUCCESSOR_RECEIPT_SCHEMA_MISMATCH'));
  { const x = successorReceipt(); x.predecessor.operationId = 'OTHER_RECOGNIZED_OPERATION'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_PREDECESSOR_DESCRIPTOR_MISMATCH')); }
  { const x = successorReceipt(); x.successor.operationId = 'OTHER_SUCCESSOR'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_OPERATION_ID_MISMATCH')); }
  { const x = successorReceipt(); x.successor.projectId = 'OTHER_PROJECT'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_PROJECT_MISMATCH')); }
  { const x = successorReceipt(); x.predecessor.terminalDisposition = 'PASS_CLOSED'; negatives.push(expectFailure(() => resolveSuccessor(x), 'PREDECESSOR_NOT_SUPERSEDED')); }
  { const x = successorReceipt(); x.predecessor.terminalHistoryPreserved = false; negatives.push(expectFailure(() => resolveSuccessor(x), 'PREDECESSOR_TERMINAL_HISTORY_NOT_PRESERVED')); }
  { const x = successorReceipt(); x.successor.state = 'TERMINAL'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_NOT_ADMITTED_LOCKED')); }
  { const x = successorReceipt(); x.authorityInherited = true; negatives.push(expectFailure(() => resolveSuccessor(x), 'AUTHORITY_INHERITANCE_FORBIDDEN')); }
  { const x = successorReceipt(); x.authorityPolicy = 'INHERIT_PREDECESSOR'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_AUTHORITY_POLICY_MISMATCH')); }
  { const x = successorReceipt(); x.evidencePolicy = 'OLD_EVIDENCE_ALLOWED'; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_EVIDENCE_POLICY_MISMATCH')); }
  { const x = successorReceipt(); x.exactHeadRevalidationRequired = false; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_EXACT_HEAD_REVALIDATION_NOT_REQUIRED')); }
  { const x = successorReceipt(); x.successor.lockGeneration = 41; x.ledgerGenerationAfter = 41; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_GENERATION_NOT_ADVANCED')); }
  { const x = successorReceipt(); x.ledgerGenerationAfter = 43; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_LEDGER_GENERATION_MISMATCH')); }
  { const x = request(SUCCESSOR_OPERATION); x.descriptorId = 'UNKNOWN_DESCRIPTOR'; negatives.push(expectFailure(() => resolveSuccessor(successorReceipt(), x), 'AUTHORIZED_TOOLSET_NOT_FOUND')); }
  { const x = registry(); x.tools.push(structuredClone(x.tools[0])); negatives.push(expectFailure(() => resolveSuccessor(successorReceipt(), request(SUCCESSOR_OPERATION), x), 'AUTHORIZED_TOOLSET_AMBIGUOUS')); }
  { const x = successorReceipt(); x.successor.governingHead = OLD_HEAD; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_HEAD_NOT_ADVANCED')); }
  { const x = successorReceipt(); x.implementationInferenceAuthorized = true; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_IMPLEMENTATION_INFERENCE_FORBIDDEN')); }
  { const x = successorReceipt(); x.workflowExecutionAuthorized = false; negatives.push(expectFailure(() => resolveSuccessor(x), 'SUCCESSOR_WORKFLOW_EXECUTION_NOT_AUTHORIZED')); }

  const payload = stable({
    directAuthorizationMode: direct.authorizationMode,
    successorAuthorizationMode: successor.authorizationMode,
    descriptorOperationId: successor.descriptorOperationId,
    authorizedOperationId: successor.authorizedOperationId,
    fixedCommandPath: successor.descriptor.commandSpecification.scriptPath,
    exactToolingHead: successor.descriptor.exactToolingHead,
    successorProofSha256: successor.successorCompatibilityReceipt.successorProofSha256,
    negativeResults: negatives
  });

  return stable({
    schema: 'AI_ROOM_SUCCESSOR_EXECUTION_COMPATIBILITY_SELF_TEST_RECEIPT_v1',
    result: 'PASS_CLOSED_LOCAL_SUCCESSOR_COMPATIBILITY',
    positiveFixtureCount: 2,
    positiveFixturesPassed: 2,
    negativeFixtureCount: negatives.length,
    negativeFixturesPassed: negatives.length,
    directPathPreserved: true,
    canonicalOneHopSuccessorAccepted: true,
    unrelatedOperationRejected: true,
    fixedDescriptorPreserved: true,
    fixedCommandPreserved: true,
    exactToolingHeadPreserved: true,
    genericCommandAuthorityCreated: false,
    wildcardDescriptorAuthorityCreated: false,
    arbitrarySuccessorAuthorityCreated: false,
    productMutationPerformed: false,
    packageFingerprint: hashObject(payload)
  });
}

function main() {
  const outputIndex = process.argv.indexOf('--output');
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  const receipt = runSuccessorCompatibilitySelfTest();
  if (output) writeJson(output, receipt);
  else process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
