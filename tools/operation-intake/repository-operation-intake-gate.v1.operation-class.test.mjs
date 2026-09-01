#!/usr/bin/env node
import assert from 'node:assert/strict';
import { prepare, SOURCE_READBACK_OPERATION_CLASS } from './repository-operation-intake-gate.v1.mjs';

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

// SOURCE_READBACK is the only class allowed to use null workflow + empty artifacts,
// and both request and procedure must explicitly declare it.
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

process.stdout.write(JSON.stringify({
  schema: 'REPOSITORY_OPERATION_CLASS_VALIDATION_RECEIPT_v1',
  result: 'PASS_CLOSED',
  sourceReadbackNullWorkflowAllowed: true,
  sourceReadbackEmptyArtifactsAllowed: true,
  sourceReadbackRequiresBilateralDeclaration: true,
  workflowBackedStrictnessPreserved: true
}, null, 2) + '\n');
