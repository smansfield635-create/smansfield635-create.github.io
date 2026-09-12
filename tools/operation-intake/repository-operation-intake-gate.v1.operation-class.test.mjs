#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  prepare,
  SOURCE_READBACK_OPERATION_CLASS,
  RUNTIME_OR_AUTHORITY_OPERATION_CLASS
} from './repository-operation-intake-gate.v1.mjs';
import { selfTest as functionalRouterSelfTest } from '../../.github/ai-router/functional-routing/compass-functional-router.v1.mjs';

const HEAD = 'ec1e19a8ec5c351827fad248635039906ffb2f3b';

function baseRequest() {
  return {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: 'TEST_OPERATION_001',
    projectId: 'TEST_PROJECT',
    lockScope: 'TEST_PROJECT:TEST_SCOPE',
    exactGoverningHead: HEAD,
    subjectIdentity: { subject: 'test' },
    requestingAuthority: { authorityId: 'test' },
    executingRole: { roleId: 'test' },
    independentVerifier: { roleId: 'test-verifier' },
    constructionProcedureLocator: 'TEST_PROCEDURE_001',
    requiredInputs: [{ id: 'INPUT_1', resolved: true }],
    allowedPaths: ['test/path.txt'],
    prohibitedPaths: ['other/path.txt'],
    requiredOutputs: ['OUTPUT_1'],
    exactTestCommand: 'node test.mjs',
    workflowPath: '.github/workflows/test.yml',
    artifactPaths: ['/tmp/test.json'],
    fingerprintDomain: { algorithm: 'sha256', paths: ['test/path.txt'] },
    errorPrecedence: ['ERROR_1'],
    stopConditions: ['STOP_1'],
    terminalDispositions: ['PASS_CLOSED']
  };
}

function baseProcedure() {
  return {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'TEST_PROCEDURE_001',
    operationClass: 'WORKFLOW_BACKED_TEST',
    exactGoverningHead: HEAD,
    exactAllowedRepositoryPaths: ['test/path.txt'],
    exactBranchAndCommitSequence: [{ step: 1, action: 'TEST' }],
    evaluationToolingHeadBindingRule: 'exact',
    canonicalInputSchemas: ['REPOSITORY_OPERATION_REQUEST_v1'],
    canonicalOutputSchemas: ['REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1'],
    errorCodeAndValidationPrecedence: ['ERROR_1'],
    exactTestRunnerCommand: 'node test.mjs',
    independentVerifierDefinition: { distinct: true },
    workflowAndArtifactPackagingPaths: {
      workflowPath: '.github/workflows/test.yml',
      artifactPaths: ['/tmp/test.json']
    },
    bridgeOutputFingerprintDomain: { algorithm: 'sha256', paths: ['test/path.txt'] },
    priorAttemptInspectionLimits: { prior: 'none' }
  };
}

function runtimePair() {
  const r = baseRequest();
  const p = baseProcedure();
  p.operationClass = RUNTIME_OR_AUTHORITY_OPERATION_CLASS;
  r.intakeCompletenessReceipt = {
    schema: 'INTAKE_COMPLETENESS_RECEIPT_v1',
    receiptId: 'TEST_COMPLETE_001',
    result: 'COMPLETE_NO_QUESTIONS_REQUIRED',
    unresolvedMaterialQuestions: [],
    receiptDigest: 'test-complete-digest',
    authorityEffect: 'NONE_BY_INTAKE_COMPLETENESS_RECEIPT'
  };
  r.functionalCoordination = {
    schema: 'FUNCTIONAL_BEARING_COORDINATION_v1',
    applicabilityClass: 'MATERIAL_GOVERNED_ENGINEERING',
    functionalBearing: { mode: 'ROUTE', bearings: ['W','ESE','SSW'], exemptionReason: null },
    primitiveRequirements: ['W','E','S'],
    authorityEffect: 'NONE'
  };
  return { r, p };
}

// Legacy/workflow-backed request shape remains strict and valid.
assert.doesNotThrow(() => prepare(baseRequest(), baseProcedure()));

// Workflow-backed operations must retain non-empty workflow and artifact packaging.
{
  const r = baseRequest();
  r.artifactPaths = [];
  assert.throws(() => prepare(r, baseProcedure()), /MISSING_REQUIRED_REQUEST_FIELD:artifactPaths/);
}
{
  const r = baseRequest();
  r.workflowPath = null;
  assert.throws(() => prepare(r, baseProcedure()), /MISSING_REQUIRED_REQUEST_FIELD:workflowPath/);
}

// RUNTIME_OR_AUTHORITY must declare functional coordination before lock acquisition.
{
  const { r, p } = runtimePair();
  delete r.functionalCoordination;
  assert.throws(() => prepare(r, p), /FUNCTIONAL_COORDINATION_REQUIRED:functionalCoordination/);
}

// Material governed engineering accepts a constitution-backed ordered route.
{
  const { r, p } = runtimePair();
  assert.doesNotThrow(() => prepare(r, p));
}

// Material governed engineering may not claim exemption from bearing.
{
  const { r, p } = runtimePair();
  r.functionalCoordination.functionalBearing = { mode: 'EXEMPT', bearings: [], exemptionReason: 'not-needed' };
  assert.throws(() => prepare(r, p), /BEARING_REQUIRED_MISSING/);
}

// Explicit read-only administrative work may use the bounded exemption.
{
  const { r, p } = runtimePair();
  r.functionalCoordination = {
    schema: 'FUNCTIONAL_BEARING_COORDINATION_v1',
    applicabilityClass: 'READ_ONLY_ADMINISTRATIVE',
    functionalBearing: { mode: 'EXEMPT', bearings: [], exemptionReason: 'NO_FUNCTIONAL_ENGINEERING_COORDINATION' },
    primitiveRequirements: [],
    authorityEffect: 'NONE'
  };
  assert.doesNotThrow(() => prepare(r, p));
}

// Unknown applicability fails closed rather than becoming an implicit exemption.
{
  const { r, p } = runtimePair();
  r.functionalCoordination.applicabilityClass = 'UNKNOWN';
  assert.throws(() => prepare(r, p), /APPLICABILITY_UNCLASSIFIED/);
}

// Bearing cannot create authority.
{
  const { r, p } = runtimePair();
  r.functionalCoordination.authorityEffect = 'GRANT';
  assert.throws(() => prepare(r, p), /AUTHORITY_EFFECT_NONZERO/);
}

// SOURCE_READBACK is the only class allowed to use null workflow + empty artifacts,
// and both request and procedure must explicitly declare it. Existing law is unchanged.
{
  const r = baseRequest();
  const p = baseProcedure();
  r.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  p.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  r.workflowPath = null;
  r.artifactPaths = [];
  p.workflowAndArtifactPackagingPaths = { workflowPath: null, artifactPaths: [] };
  assert.doesNotThrow(() => prepare(r, p));
}
{
  const r = baseRequest();
  const p = baseProcedure();
  r.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  r.workflowPath = null;
  r.artifactPaths = [];
  assert.throws(() => prepare(r, p), /OPERATION_CLASS_MISMATCH:operationClass/);
}
{
  const r = baseRequest();
  const p = baseProcedure();
  r.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  p.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  r.workflowPath = '.github/workflows/should-not-exist.yml';
  r.artifactPaths = [];
  p.workflowAndArtifactPackagingPaths = { workflowPath: null, artifactPaths: [] };
  assert.throws(() => prepare(r, p), /SOURCE_READBACK_REQUIRES_NULL/);
}
{
  const r = baseRequest();
  const p = baseProcedure();
  r.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  p.operationClass = SOURCE_READBACK_OPERATION_CLASS;
  r.workflowPath = null;
  r.artifactPaths = ['/tmp/forbidden.json'];
  p.workflowAndArtifactPackagingPaths = { workflowPath: null, artifactPaths: [] };
  assert.throws(() => prepare(r, p), /SOURCE_READBACK_REQUIRES_EMPTY_ARRAY/);
}

const functionalRouterReceipt = functionalRouterSelfTest();
assert.equal(functionalRouterReceipt.result, 'PASS_CLOSED');
assert.equal(functionalRouterReceipt.failed, 0);
assert.equal(functionalRouterReceipt.authorityEffect, 'NONE');

process.stdout.write(JSON.stringify({
  schema: 'REPOSITORY_OPERATION_CLASS_VALIDATION_RECEIPT_v1',
  result: 'PASS_CLOSED',
  runtimeFunctionalCoordinationRequired: true,
  materialEngineeringBearingRequired: true,
  orderedRouteAccepted: true,
  explicitReadOnlyExemptionAccepted: true,
  unknownApplicabilityFailsClosed: true,
  bearingAuthorityEffectNoneRequired: true,
  validationOccursBeforeLockAcquisition: true,
  adoptedFunctionalRouterReused: true,
  functionalRouterSelfTestResult: functionalRouterReceipt.result,
  functionalRouterSelfTestChecks: functionalRouterReceipt.checks,
  sourceReadbackNullWorkflowAllowed: true,
  sourceReadbackEmptyArtifactsAllowed: true,
  sourceReadbackRequiresBilateralDeclaration: true,
  workflowBackedStrictnessPreserved: true
}, null, 2) + '\n');
