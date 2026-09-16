#!/usr/bin/env node
import { canonical, stable } from './repository-operation-lock-manager.v1.mjs';
import {
  MARKER,
  TRANSPORT_SCHEMA,
  compileCanonicalPacket,
  validateCompiledComment
} from './canonical-packet-compiler.v1.mjs';

const HEAD = '9df9b2e0b1e289f707d4541df69713d4cafdacf2';
const RUNS = [35100631722, 35104746859, 35105007144, 35113108135, 35114532078];

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function fail(code, detail = null) { const e = new Error(`${code}${detail ? ':' + detail : ''}`); Object.assign(e, { code, detail }); throw e; }
function check(condition, code, detail = null) { if (!condition) fail(code, detail); }

function sourceReadbackFixture() {
  const allowedPaths = ['AI_ENTRYPOINT.json'];
  const fingerprintDomain = { domain: 'CANONICAL_PACKET_COMPILER_SELF_TEST_V1', governingHead: HEAD, allowedPathCount: 1 };
  const errorPrecedence = ['GOVERNING_HEAD_MISMATCH', 'DECLARED_PATH_VIOLATION', 'PASS'];
  const request = {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationClass: 'SOURCE_READBACK',
    operationId: 'CANONICAL_PACKET_COMPILER_SELF_TEST_OPERATION',
    projectId: 'CONTROL_PLANE',
    lockScope: 'CONTROL_PLANE:CANONICAL_PACKET_COMPILER:SELF_TEST',
    exactGoverningHead: HEAD,
    subjectIdentity: { specimen: 'SELF_TEST', authorityEffect: 'NONE' },
    requestingAuthority: { principal: 'SELF_TEST', source: 'SELF_TEST', intent: 'Validate packet compilation only.', authorityInherited: false, scopeExpansionAllowed: false },
    executingRole: { role: 'SELF_TEST', mayMutateProduct: false, mayMutateControlPlane: false, mayMerge: false, mayDeploy: false, scopeExpansionAllowed: false },
    independentVerifier: { role: 'SELF_TEST_VERIFIER', builderMaySelfDeclarePass: false, repairAuthority: false },
    constructionProcedureLocator: 'self-test:canonical-packet-compiler',
    requiredInputs: [{ id: 'SELF_TEST_INPUT_RESOLVED', resolved: true }],
    allowedPaths,
    prohibitedPaths: ['ALL_OTHER_REPOSITORY_PATHS'],
    requiredOutputs: ['PACKET_READY_SELF_TEST'],
    exactTestCommand: 'node tools/operation-intake/canonical-packet-compiler-self-test.v1.mjs',
    workflowPath: null,
    artifactPaths: [],
    fingerprintDomain,
    errorPrecedence,
    stopConditions: ['STOP_AFTER_PACKET_READY'],
    terminalDispositions: ['PASS_CLOSED', 'FAIL_CLOSED']
  };
  const procedure = {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'CANONICAL_PACKET_COMPILER_SELF_TEST_PROCEDURE',
    operationClass: 'SOURCE_READBACK',
    exactGoverningHead: HEAD,
    exactAllowedRepositoryPaths: allowedPaths,
    exactBranchAndCommitSequence: [{ step: 1, action: 'COMPILE_PACKET' }],
    evaluationToolingHeadBindingRule: 'Self-test only. No authority created.',
    canonicalInputSchemas: ['REPOSITORY_OPERATION_REQUEST_v1', 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1'],
    canonicalOutputSchemas: ['CANONICAL_PACKET_READY_RECEIPT_v1'],
    errorCodeAndValidationPrecedence: errorPrecedence,
    exactTestRunnerCommand: request.exactTestCommand,
    independentVerifierDefinition: { role: 'SELF_TEST_VERIFIER', requiredChecks: ['PACKET_READY'] },
    workflowAndArtifactPackagingPaths: { workflowPath: null, artifactPaths: [] },
    bridgeOutputFingerprintDomain: fingerprintDomain,
    priorAttemptInspectionLimits: { allowed: 'SELF_TEST_ONLY', forbidden: 'MUTATION' }
  };
  return { request, procedure };
}

function runtimeMissingWorkflowFixture(sourceRequest, sourceProcedure) {
  const request = clone(sourceRequest);
  const procedure = clone(sourceProcedure);
  delete request.operationClass;
  request.workflowPath = 'SELF_TEST_NO_EXECUTION';
  request.artifactPaths = ['issue:test'];
  request.intakeCompletenessReceipt = {
    schema: 'INTAKE_COMPLETENESS_RECEIPT_v1',
    receiptId: 'CANONICAL_PACKET_COMPILER_SELF_TEST_COMPLETENESS',
    result: 'COMPLETE_NO_QUESTIONS_REQUIRED',
    unresolvedMaterialQuestions: [],
    receiptDigest: 'canonical-packet-compiler-self-test-complete-v1',
    authorityEffect: 'NONE_BY_INTAKE_COMPLETENESS_RECEIPT'
  };
  request.functionalCoordination = {
    schema: 'FUNCTIONAL_BEARING_COORDINATION_v1',
    applicabilityClass: 'MATERIAL_GOVERNED_ENGINEERING',
    functionalBearing: { mode: 'ROUTE', bearings: ['N', 'E', 'S', 'W', 'N'], exemptionReason: null },
    primitiveRequirements: ['N', 'E', 'S', 'W'],
    authorityEffect: 'NONE'
  };
  procedure.operationClass = 'RUNTIME_OR_AUTHORITY';
  procedure.workflowAndArtifactPackagingPaths = { artifactPaths: ['issue:test'] };
  return { request, procedure };
}

function expectFailure(label, fn, expectedCode) {
  try { fn(); }
  catch (error) {
    check(error.code === expectedCode, 'UNEXPECTED_NEGATIVE_ERROR_CODE', `${label}:${error.code}:${expectedCode}`);
    return stable({ label, result: 'REJECTED_PRE_SUBMIT', errorCode: error.code });
  }
  fail('NEGATIVE_CASE_UNEXPECTEDLY_ACCEPTED', label);
}

const { request, procedure } = sourceReadbackFixture();
const first = compileCanonicalPacket(request, procedure);
const second = compileCanonicalPacket(clone(request), clone(procedure));

check(first.receipt.result === 'PACKET_READY', 'POSITIVE_PACKET_NOT_READY');
check(first.receipt.submissionReady === true, 'POSITIVE_SUBMISSION_NOT_READY');
check(first.receipt.admissionAuthorityCreated === false, 'PACKET_READY_AUTHORITY_LEAK');
check(canonical(first) === canonical(second), 'NONDETERMINISTIC_PACKET_COMPILATION');
check(first.comment.startsWith(`${MARKER}\n`), 'COMMENT_MARKER_MISSING');
check(validateCompiledComment(first.comment).prepared.requestDigest === first.receipt.requestDigest, 'REQUEST_DIGEST_ROUNDTRIP_FAILURE');
check(validateCompiledComment(first.comment).prepared.procedureLocatorDigest === first.receipt.procedureDigest, 'PROCEDURE_DIGEST_ROUNDTRIP_FAILURE');

const missingProcedureComment = `${MARKER}\n${JSON.stringify({ schema: TRANSPORT_SCHEMA, operationRequest: first.request })}\n`;
const malformedBase = first.comment.trimEnd();
const runtimeMissingWorkflow = runtimeMissingWorkflowFixture(request, procedure);

const negatives = [
  expectFailure('35100631722_TRANSPORT_ENVELOPE_INCOMPLETE', () => validateCompiledComment(missingProcedureComment), 'TRANSPORT_ENVELOPE_INCOMPLETE'),
  expectFailure('35104746859_MALFORMED_JSON_EXTRA_CONTENT', () => validateCompiledComment(`${malformedBase}\n{}`), 'TRANSPORT_COMMENT_JSON_INVALID'),
  expectFailure('35105007144_MALFORMED_JSON_EXTRA_CONTENT', () => validateCompiledComment(`${malformedBase}\n[]`), 'TRANSPORT_COMMENT_JSON_INVALID'),
  expectFailure('35113108135_INPUT_INCOMPLETE_WORKFLOW_PATH', () => compileCanonicalPacket(runtimeMissingWorkflow.request, runtimeMissingWorkflow.procedure), 'CONSTRUCTION_PROCEDURE_INVALID'),
  expectFailure('35114532078_MALFORMED_JSON_EXTRA_CONTENT', () => validateCompiledComment(`${malformedBase}\nnull`), 'TRANSPORT_COMMENT_JSON_INVALID')
];

const receipt = stable({
  schema: 'CANONICAL_PACKET_COMPILER_SELF_TEST_v1',
  result: 'PASS_CLOSED',
  frozenRegressionRuns: RUNS,
  negativeCaseCount: negatives.length,
  negativeCases: negatives,
  positiveCaseCount: 1,
  positiveCase: {
    operationClass: 'SOURCE_READBACK',
    governedRuntimeFirstSubmissionPositiveControl: 35117043676,
    result: first.receipt.result,
    requestDigest: first.receipt.requestDigest,
    procedureDigest: first.receipt.procedureDigest,
    envelopeDigest: first.receipt.envelopeDigest,
    commentDigest: first.receipt.commentDigest,
    deterministicRepeat: canonical(first) === canonical(second)
  },
  semanticValidator: first.receipt.semanticValidator,
  handBuiltCanonicalIntakeRequired: false,
  authorityCreated: false
});

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
