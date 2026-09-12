#!/usr/bin/env node
import assert from 'node:assert/strict';
import { executeOwnerConnectorAdmission } from './owner-connector-canonical-intake-executor.v1.mjs';
import { canonical, scopeHash, sha, stable } from './repository-operation-lock-manager.v1.mjs';

const HEAD = '1'.repeat(40);
const LOCK_HEAD = '2'.repeat(40);
const LEDGER_BLOB = '3'.repeat(40);
const NEXT_BLOB = '4'.repeat(40);
const BASE_TREE = '5'.repeat(40);
const COMMIT = '6'.repeat(40);
const PATH = '.github/operation-intake/active-operation-ledger.v1.json';
const OPERATION = 'SELF_TEST_NATIVE_OWNER_ADMISSION';
const SCOPE = 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE:SELF_TEST_NATIVE_ADMISSION:V1';

function request(overrides = {}) {
  return stable({
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: OPERATION,
    projectId: 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE',
    lockScope: SCOPE,
    exactGoverningHead: HEAD,
    subjectIdentity: { kind: 'native-admission-executor-self-test' },
    requestingAuthority: { type: 'USER_DIRECTIVE' },
    executingRole: { role: 'SELF_TEST' },
    independentVerifier: { role: 'SELF_TEST' },
    constructionProcedureLocator: 'self-test:native-admission-executor',
    requiredInputs: [{ id: 'complete', resolved: true }],
    intakeCompletenessReceipt: {
      schema: 'INTAKE_COMPLETENESS_RECEIPT_v1',
      receiptId: 'SELF_TEST_COMPLETENESS',
      result: 'COMPLETE_NO_QUESTIONS_REQUIRED',
      unresolvedMaterialQuestions: [],
      receiptDigest: 'self-test-native-admission-executor',
      authorityEffect: 'NONE_BY_INTAKE_COMPLETENESS_RECEIPT'
    },
    functionalCoordination: {
      schema: 'FUNCTIONAL_BEARING_COORDINATION_v1',
      applicabilityClass: 'MATERIAL_GOVERNED_ENGINEERING',
      functionalBearing: { mode: 'SINGLE', bearings: ['E'], exemptionReason: null },
      primitiveRequirements: ['E'],
      authorityEffect: 'NONE'
    },
    allowedPaths: ['index.html'],
    prohibitedPaths: ['forbidden/'],
    requiredOutputs: ['receipt'],
    exactTestCommand: 'node self-test',
    workflowPath: 'passive-self-test.yml',
    artifactPaths: ['/tmp/self-test.json'],
    fingerprintDomain: { kind: 'self-test' },
    errorPrecedence: ['FAIL_CLOSED'],
    stopConditions: ['FAIL'],
    terminalDispositions: ['PASS_CLOSED', 'FAIL_CLOSED'],
    ...overrides
  });
}
function procedure(overrides = {}) {
  return stable({
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'SELF_TEST_NATIVE_OWNER_ADMISSION_PROCEDURE',
    operationClass: 'RUNTIME_OR_AUTHORITY',
    exactGoverningHead: HEAD,
    exactAllowedRepositoryPaths: ['index.html'],
    exactBranchAndCommitSequence: ['admit', 'construct'],
    evaluationToolingHeadBindingRule: 'exact',
    canonicalInputSchemas: ['SELF_TEST_INPUT'],
    canonicalOutputSchemas: ['SELF_TEST_OUTPUT'],
    errorCodeAndValidationPrecedence: ['FAIL_CLOSED'],
    exactTestRunnerCommand: 'node self-test',
    independentVerifierDefinition: { kind: 'SELF_TEST' },
    workflowAndArtifactPackagingPaths: { workflowPath: 'passive-self-test.yml', artifactPaths: ['/tmp/self-test.json'] },
    bridgeOutputFingerprintDomain: { kind: 'self-test' },
    priorAttemptInspectionLimits: { max: 1 },
    ...overrides
  });
}
function sourceComment(r = request(), p = procedure(), overrides = {}) {
  const body = `CANONICAL_OPERATION_INTAKE_REQUEST_V1\n${JSON.stringify({ schema: 'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_SOURCE_v1', operationRequest: r, constructionProcedure: p })}`;
  return {
    id: 101,
    issue_url: 'https://api.github.com/repos/example/example/issues/3018',
    body,
    user: { login: 'smansfield635-create' },
    author_association: 'OWNER',
    ...overrides
  };
}
function emptyLedger() {
  return { schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1', lockGeneration: 7, activeScopes: {}, terminalHistory: [] };
}
function activeLedger() {
  const h = scopeHash(SCOPE);
  return {
    schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
    lockGeneration: 7,
    activeScopes: {
      [h]: {
        schema: 'REPOSITORY_OPERATION_LOCK_v1', operationId: 'OTHER_ACTIVE', lockScope: SCOPE, scopeHash: h,
        state: 'ADMITTED_LOCKED', governingHead: HEAD, requestDigest: 'a'.repeat(64), procedureLocatorDigest: 'b'.repeat(64), lockGeneration: 7, released: false
      }
    },
    terminalHistory: []
  };
}

class FakeApi {
  constructor(options = {}) {
    this.options = options;
    this.mainHeads = [...(options.mainHeads || [HEAD, HEAD, HEAD])];
    this.lockHeads = [...(options.lockHeads || [LOCK_HEAD, LOCK_HEAD, LOCK_HEAD])];
    this.initialLedger = stable(options.ledger || emptyLedger());
    this.currentLedger = this.initialLedger;
    this.currentLedgerBlob = LEDGER_BLOB;
    this.createdLedger = null;
    this.createdMessage = null;
    this.refUpdated = false;
    this.ledgerReads = 0;
  }
  async getMainHead() { return this.mainHeads.length > 1 ? this.mainHeads.shift() : this.mainHeads[0]; }
  async getSourceComment() { return this.options.comment || sourceComment(); }
  async getLockRefHead() {
    if (this.refUpdated) return COMMIT;
    return this.lockHeads.length > 1 ? this.lockHeads.shift() : this.lockHeads[0];
  }
  async getLedgerAtRef(ref) {
    this.ledgerReads += 1;
    if (ref === COMMIT) return { blobSha: NEXT_BLOB, ledger: stable(this.createdLedger) };
    if (this.options.staleLedgerOnSecondRead && this.ledgerReads === 2) return { blobSha: '9'.repeat(40), ledger: stable(this.initialLedger) };
    return { blobSha: this.currentLedgerBlob, ledger: stable(this.currentLedger) };
  }
  async getGitCommit() { return { tree: { sha: BASE_TREE } }; }
  async createBlob(contents) {
    this.createdLedger = JSON.parse(contents);
    return NEXT_BLOB;
  }
  async createTree(baseTreeSha, ledgerBlobSha) {
    assert.equal(baseTreeSha, BASE_TREE);
    assert.equal(ledgerBlobSha, NEXT_BLOB);
    return '7'.repeat(40);
  }
  async createCommit(treeSha, parentSha, message) {
    assert.equal(treeSha, '7'.repeat(40));
    assert.equal(parentSha, LOCK_HEAD);
    this.createdMessage = message;
    return COMMIT;
  }
  async updateLockRef() {
    if (this.options.casConflict) return { ok: false, errorCode: 'LOCK_REF_COMPARE_AND_SWAP_CONFLICT', httpStatus: 422 };
    this.refUpdated = true;
    return { ok: true, head: COMMIT };
  }
  async getCommitDetail() {
    const defaultDetail = {
      sha: COMMIT,
      author: { login: 'smansfield635-create' },
      committer: { login: 'smansfield635-create' },
      commit: { message: this.createdMessage, verification: { verified: false } },
      parents: [{ sha: LOCK_HEAD }],
      files: [{ filename: PATH, sha: NEXT_BLOB }]
    };
    return this.options.commitDetail ? this.options.commitDetail(defaultDetail, this) : defaultDetail;
  }
}
const verifyLineage = async ({ branchHead, anchorCommitSha }) => {
  assert.equal(branchHead, COMMIT);
  assert.equal(anchorCommitSha, LOCK_HEAD);
  return { result: 'CANONICAL_LOCK_REF_LINEAGE_VERIFIED' };
};
async function run(api, dependencies = {}) {
  return executeOwnerConnectorAdmission(
    { sourceCommentId: 101, expectedMainHead: HEAD },
    { api, verifyLineage, ...dependencies }
  );
}

{
  const api = new FakeApi();
  const receipt = await run(api);
  assert.equal(receipt.result, 'ADMITTED_AND_LOCKED');
  assert.equal(receipt.canonicalAdmissionReceipt?.result, 'ADMITTED_AND_LOCKED');
  assert.equal(receipt.lockGeneration, 8);
  assert.equal(receipt.observedLockRefHead, LOCK_HEAD);
  assert.equal(receipt.observedLedgerBlobSha, LEDGER_BLOB);
  assert.equal(receipt.committedLedgerBlobSha, NEXT_BLOB);
  assert.equal(receipt.acquisitionCommitSha, COMMIT);
  assert.equal(receipt.planWasReceipt, false);
  assert.equal(receipt.plannerSemanticsDuplicated, false);
  assert.equal(receipt.repositoryMutationLimitedToCanonicalLedger, true);
  assert.equal(receipt.githubActionsAgentTransport, false);
  const row = api.createdLedger.activeScopes[scopeHash(SCOPE)];
  assert.equal(row.operationId, OPERATION);
  assert.equal(row.requestDigest, sha(canonical(request())));
  assert.equal(row.independentAuthorityProvenance?.source?.authorAssociation, 'OWNER');
}

{
  const api = new FakeApi({ mainHeads: ['8'.repeat(40)] });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'GOVERNING_HEAD_MISMATCH');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ mainHeads: [HEAD, '8'.repeat(40)] });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'GOVERNING_HEAD_MISMATCH');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ lockHeads: [LOCK_HEAD, '8'.repeat(40)] });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'LOCK_REF_COMPARE_AND_SWAP_CONFLICT');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ staleLedgerOnSecondRead: true });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'LEDGER_COMPARE_AND_SWAP_CONFLICT');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ comment: sourceComment(request(), procedure(), { author_association: 'NONE' }) });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'SOURCE_COMMENT_NOT_OWNER');
  assert.equal(api.refUpdated, false);
}
{
  const badProcedure = procedure({ exactAllowedRepositoryPaths: ['other.html'] });
  const api = new FakeApi({ comment: sourceComment(request(), badProcedure) });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'SCOPE_MISMATCH');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ ledger: activeLedger() });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'ACTIVE_SCOPE_ALREADY_LOCKED');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ casConflict: true });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(receipt.errorCode, 'LOCK_REF_COMPARE_AND_SWAP_CONFLICT');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi();
  const receipt = await run(api, { planner: () => ({ schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1', result: 'ADMITTED_AND_LOCKED', ledgerMutationAuthorized: true, exactMutationPath: PATH }) });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_ADMISSION');
  assert.equal(api.refUpdated, false);
}
{
  const api = new FakeApi({ commitDetail: (detail) => ({ ...detail, commit: { ...detail.commit, message: `${detail.commit.message} altered` } }) });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_AFTER_MUTATION_REQUIRES_RECOVERY');
  assert.equal(receipt.errorCode, 'READBACK_MISMATCH');
  assert.equal(receipt.mutationMayHaveCommitted, true);
}
{
  const api = new FakeApi({ commitDetail: (detail) => ({ ...detail, files: [...detail.files, { filename: 'README.md', sha: '8'.repeat(40) }] }) });
  const receipt = await run(api);
  assert.equal(receipt.result, 'FAIL_CLOSED_AFTER_MUTATION_REQUIRES_RECOVERY');
  assert.equal(receipt.errorCode, 'NON_LEDGER_MUTATION');
  assert.equal(receipt.mutationMayHaveCommitted, true);
}

console.log('OWNER_CONNECTOR_CANONICAL_INTAKE_EXECUTOR_SELF_TEST PASS');
