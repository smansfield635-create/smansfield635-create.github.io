#!/usr/bin/env node
// All native observations in this file are SYNTHETIC ADVERSARIAL FIXTURES.
// Passing this suite proves validator behavior, never actual agent invocation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {RECORD_SCHEMA, CHECK_SCHEMA, TASK_CLASSES, STATION_IDENTITIES, canonicalJson, sha256Canonical, sha256Text, validateReceipt, compareReadback, runCli} from './evidence-gate.v1.mjs';

const FIXTURE_HEAD = '0123456789abcdef0123456789abcdef01234567';
const FIXTURE_HEAD_OTHER = '89abcdef0123456789abcdef0123456789abcdef';
const copy = value => structuredClone(value);
function fixture() {
  const assignment = {packetId: 'SYNTHETIC_PACKET', bearing: 'S', canonicalIdentities: ['Tarian'], objective: 'SYNTHETIC ONLY: continuity check', authority: {grant: 'READ_ONLY', mayMerge: false, mayDeploy: false}, unresolvedConditions: ['SYNTHETIC: host authenticity remains unverified'], context: {repository: 'synthetic/repository', R: {target: 'synthetic/file', relationship: 'READS'}, L: {phase: 'REVIEW'}, D: {capability: 'CONTINUITY'}, requiredOutput: 'SYNTHETIC continuity result', evidenceRefs: ['synthetic:evidence'], prohibitedAuthority: ['MERGE', 'DEPLOY'], handoff: {next: 'INDEPENDENT_OBSERVER'}}};
  const text = 'SYNTHETIC OUTPUT: no real execution is represented by this fixture.';
  return {schema: RECORD_SCHEMA, taskId: 'SYNTHETIC_TASK', operationId: 'SYNTHETIC_OPERATION', governingHead: FIXTURE_HEAD, taskClass: 'MATERIAL_GOVERNED_ENGINEERING', assignment, assignmentSha256: sha256Canonical(assignment), nativeTaskId: '/synthetic/worker', invocation: {tool: 'collaboration.spawn_agent', eventRef: 'synthetic:spawn-event', returnedTaskId: '/synthetic/worker'}, state: 'COMPLETED', output: {text, sha256: sha256Text(text), sourceEventRef: 'synthetic:output-event'}, observer: {nativeTaskId: '/synthetic/observer', sourceEventRef: 'synthetic:observer-event'}};
}
function expected(receipt) {
  return copy(Object.fromEntries(['taskId', 'operationId', 'governingHead', 'taskClass', 'assignment', 'assignmentSha256', 'nativeTaskId'].map(field => [field, receipt[field]])));
}
function observations(receipt) {
  return {
    assignmentObservation: {sourceEventRef: 'synthetic:assignment-event', ...expected(receipt)},
    invocationObservation: {sourceEventRef: receipt.invocation.eventRef, tool: receipt.invocation.tool, returnedTaskId: receipt.nativeTaskId, taskId: receipt.taskId, operationId: receipt.operationId, governingHead: receipt.governingHead, assignmentSha256: receipt.assignmentSha256, state: receipt.state, ...(receipt.failure ? {failureSourceEventRef: receipt.failure.sourceEventRef} : {})},
    outputObservation: receipt.output === null ? null : {nativeTaskId: receipt.nativeTaskId, taskId: receipt.taskId, assignmentSha256: receipt.assignmentSha256, state: receipt.state, ...receipt.output},
    observerObservation: receipt.observer === null ? null : {...receipt.observer, observedNativeTaskId: receipt.nativeTaskId, taskId: receipt.taskId, assignmentSha256: receipt.assignmentSha256, invocationEventRef: receipt.invocation.eventRef, outputEventRef: receipt.output?.sourceEventRef ?? null, outputSha256: receipt.output?.sha256 ?? null}
  };
}
function assertUnverified(result) {
  assert.equal(result.schema, CHECK_SCHEMA);
  assert.equal(result.actualInvocationProved, false);
  assert.equal(result.workAuthorized, false);
  assert.equal(result.authorityEffect, 'NONE');
  assert.equal(result.executionAuthenticity, 'UNVERIFIED_REQUIRES_NATIVE_HOST_SOURCE_READBACK');
}

export function selfTest() {
  const checks = [];
  const run = (name, test) => { try { test(); checks.push({name, pass: true}); } catch (error) { checks.push({name, pass: false, detail: error.message}); } };
  const invalid = (name, mutate, code = null) => run(name, () => {
    const receipt = fixture(); mutate(receipt);
    const result = validateReceipt(receipt);
    assert.equal(result.result, 'INVALID_EVIDENCE');
    if (code !== null) assert.equal(result.errorCode, code);
    assertUnverified(result);
  });
  const mismatch = (name, mutate, code = null) => run(name, () => {
    const receipt = fixture(); const readback = observations(receipt); mutate(readback);
    const result = compareReadback(receipt, readback);
    assert.equal(result.result, 'PROVIDED_OBSERVATION_MISMATCH');
    if (code !== null) assert.equal(result.errorCode, code);
    assertUnverified(result);
  });

  run('synthetic-completed-structure-remains-unverified', () => {
    const receipt = fixture(); const result = validateReceipt(receipt, {expectedAssignment: expected(receipt)});
    assert.equal(result.result, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED'); assertUnverified(result);
    assert.deepEqual(result.authorityPreserved, receipt.assignment.authority);
    assert.deepEqual(result.unresolvedConditionsPreserved, receipt.assignment.unresolvedConditions);
  });
  run('consistent-fabricated-observations-never-prove-invocation', () => {
    const receipt = fixture(); const result = compareReadback(receipt, observations(receipt), {expectedAssignment: expected(receipt)});
    assert.equal(result.result, 'MATCHES_PROVIDED_OBSERVATIONS'); assertUnverified(result);
  });
  run('assignment-hash-is-key-order-stable', () => assert.equal(sha256Canonical({b: [1, 'two'], a: {d: false, c: null}}), sha256Canonical({a: {c: null, d: false}, b: [1, 'two']})));
  run('assignment-hash-preserves-array-order', () => assert.notEqual(sha256Canonical(['Alaric', 'Elara']), sha256Canonical(['Elara', 'Alaric'])));
  run('canonical-json-rejects-non-json-values', () => {
    for (const value of [undefined, NaN, Infinity, {missing: undefined}, [undefined], new Date(), [, 1]]) assert.throws(() => canonicalJson(value));
    const cycle = {}; cycle.self = cycle; assert.throws(() => canonicalJson(cycle));
  });
  run('all-sixteen-stations-use-only-four-frozen-identities', () => {
    assert.equal(Object.keys(STATION_IDENTITIES).length, 16);
    assert.deepEqual([...new Set(Object.values(STATION_IDENTITIES).flat())].sort(), ['Alaric', 'Elara', 'Soren', 'Tarian']);
    for (const [bearing, identities] of Object.entries(STATION_IDENTITIES)) {
      const receipt = fixture(); receipt.assignment.bearing = bearing; receipt.assignment.canonicalIdentities = [...identities]; receipt.assignmentSha256 = sha256Canonical(receipt.assignment);
      assert.equal(validateReceipt(receipt).result, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED');
    }
  });
  for (const taskClass of TASK_CLASSES) run(`native-invocation-required-for-${taskClass}`, () => {
    const receipt = fixture(); receipt.taskClass = taskClass;
    if (taskClass !== 'MATERIAL_GOVERNED_ENGINEERING') receipt.operationId = null;
    assert.equal(validateReceipt(receipt).result, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED');
    delete receipt.invocation;
    assert.equal(validateReceipt(receipt).result, 'INVALID_EVIDENCE');
  });
  invalid('route-only-receipt-rejected', receipt => { receipt.schema = 'FUNCTIONAL_BEARING_EXECUTION_RECEIPT_v1'; }, 'ROUTE_ONLY_OR_UNSUPPORTED_RECEIPT');
  run('actual-legacy-route-shape-does-not-prove-execution', () => {
    const result = validateReceipt({schema: 'FUNCTIONAL_BEARING_EXECUTION_RECEIPT_v1', result: 'ROUTE_RESOLVED', orderedRoute: ['S'], authorityEffect: 'NONE'});
    assert.equal(result.result, 'INVALID_EVIDENCE'); assertUnverified(result);
  });
  invalid('handwritten-invoked-flag-rejected', receipt => { receipt.invoked = true; }, 'UNSUPPORTED_EVIDENCE_FIELD');
  invalid('handwritten-invocation-proven-flag-rejected', receipt => { receipt.invocation.proven = true; }, 'UNSUPPORTED_EVIDENCE_FIELD');
  invalid('passive-ci-not-native-agent', receipt => { receipt.invocation.tool = 'github.actions'; }, 'NATIVE_INVOCATION_MISSING');
  invalid('route-tool-not-native-agent', receipt => { receipt.invocation.tool = 'resolveWorkPacket'; }, 'NATIVE_INVOCATION_MISSING');
  invalid('missing-task-id-rejected', receipt => { receipt.taskId = ''; });
  invalid('missing-operation-for-material-work-rejected', receipt => { receipt.operationId = null; }, 'MISSING_EVIDENCE');
  invalid('missing-native-task-rejected', receipt => { receipt.nativeTaskId = ''; });
  invalid('wrong-returned-task-rejected', receipt => { receipt.invocation.returnedTaskId = '/synthetic/another'; }, 'TASK_ID_MISMATCH');
  invalid('missing-invocation-event-rejected', receipt => { receipt.invocation.eventRef = ''; });
  invalid('short-head-rejected', receipt => { receipt.governingHead = '0123456'; }, 'GOVERNING_HEAD_MISMATCH');
  invalid('branch-name-is-not-exact-head', receipt => { receipt.governingHead = 'main'; }, 'GOVERNING_HEAD_MISMATCH');
  invalid('nonhex-head-rejected', receipt => { receipt.governingHead = 'g'.repeat(40); }, 'GOVERNING_HEAD_MISMATCH');
  run('different-valid-head-rejected-against-expected-assignment', () => {
    const receipt = fixture(); const original = expected(receipt); receipt.governingHead = FIXTURE_HEAD_OTHER;
    const result = validateReceipt(receipt, {expectedAssignment: original});
    assert.equal(result.errorCode, 'GOVERNING_HEAD_MISMATCH'); assertUnverified(result);
  });
  invalid('wrong-canonical-role-rejected', receipt => { receipt.assignment.canonicalIdentities = ['Elara']; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'CANONICAL_IDENTITY_MISMATCH');
  invalid('intermediate-station-is-not-new-identity', receipt => { receipt.assignment.bearing = 'SE'; receipt.assignment.canonicalIdentities = ['SE_Agent']; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'CANONICAL_IDENTITY_MISMATCH');
  invalid('opposed-primitives-not-single-station', receipt => { receipt.assignment.bearing = 'NS'; receipt.assignment.canonicalIdentities = ['Alaric', 'Tarian']; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'CANONICAL_IDENTITY_MISMATCH');
  invalid('three-primitives-not-single-station', receipt => { receipt.assignment.bearing = 'NE'; receipt.assignment.canonicalIdentities = ['Alaric', 'Elara', 'Tarian']; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'CANONICAL_IDENTITY_MISMATCH');
  invalid('missing-context-rejected', receipt => { delete receipt.assignment.context; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'MISSING_EVIDENCE');
  invalid('empty-typed-target-rejected', receipt => { receipt.assignment.context.R = {}; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); }, 'MISSING_EVIDENCE');
  invalid('invalid-evidence-list-rejected', receipt => { receipt.assignment.context.evidenceRefs = [42]; receipt.assignmentSha256 = sha256Canonical(receipt.assignment); });
  run('context-and-handoff-cannot-change-from-original', () => {
    const receipt = fixture(); const original = expected(receipt);
    receipt.assignment.context.handoff.next = 'SELF_CERTIFY'; receipt.assignmentSha256 = sha256Canonical(receipt.assignment);
    assert.equal(validateReceipt(receipt, {expectedAssignment: original}).errorCode, 'ASSIGNMENT_MISMATCH');
  });
  invalid('assignment-tamper-breaks-digest', receipt => { receipt.assignment.objective = 'Changed work'; }, 'ASSIGNMENT_MISMATCH');
  invalid('malformed-assignment-digest-rejected', receipt => { receipt.assignmentSha256 = 'x'.repeat(64); }, 'MALFORMED_DIGEST');
  run('redigested-assignment-cannot-match-original', () => {
    const receipt = fixture(); const original = expected(receipt);
    receipt.assignment.objective = 'Different work'; receipt.assignmentSha256 = sha256Canonical(receipt.assignment);
    assert.equal(validateReceipt(receipt, {expectedAssignment: original}).errorCode, 'ASSIGNMENT_MISMATCH');
  });
  run('authority-escalation-cannot-match-original', () => {
    const receipt = fixture(); const original = expected(receipt);
    receipt.assignment.authority.mayMerge = true; receipt.assignmentSha256 = sha256Canonical(receipt.assignment);
    const result = validateReceipt(receipt, {expectedAssignment: original});
    assert.equal(result.errorCode, 'ASSIGNMENT_MISMATCH'); assertUnverified(result);
  });
  run('unresolved-conditions-cannot-disappear-from-original', () => {
    const receipt = fixture(); const original = expected(receipt);
    receipt.assignment.unresolvedConditions = []; receipt.assignmentSha256 = sha256Canonical(receipt.assignment);
    assert.equal(validateReceipt(receipt, {expectedAssignment: original}).errorCode, 'ASSIGNMENT_MISMATCH');
  });
  invalid('missing-output-cannot-complete', receipt => { receipt.output = null; }, 'MISSING_EVIDENCE');
  invalid('empty-output-cannot-complete', receipt => { receipt.output.text = ' '; receipt.output.sha256 = sha256Text(' '); });
  invalid('output-tamper-rejected', receipt => { receipt.output.text += ' changed'; }, 'OUTPUT_MISMATCH');
  invalid('malformed-output-digest-rejected', receipt => { receipt.output.sha256 = 'xyz'; }, 'MALFORMED_DIGEST');
  invalid('output-event-cannot-be-invocation-event', receipt => { receipt.output.sourceEventRef = receipt.invocation.eventRef; }, 'SOURCE_EVENT_MISMATCH');
  invalid('missing-observer-cannot-complete', receipt => { receipt.observer = null; }, 'MISSING_EVIDENCE');
  invalid('self-review-rejected', receipt => { receipt.observer.nativeTaskId = receipt.nativeTaskId; }, 'INDEPENDENCE_FAILURE');
  invalid('observer-cannot-cite-workers-output-as-own-event', receipt => { receipt.observer.sourceEventRef = receipt.output.sourceEventRef; }, 'INDEPENDENCE_FAILURE');
  invalid('running-not-completed-evidence', receipt => { receipt.state = 'RUNNING'; }, 'STATE_EVIDENCE_MISMATCH');
  invalid('unknown-state-rejected', receipt => { receipt.state = 'DONE'; }, 'STATE_INVALID');
  run('running-state-preserved-without-completed-output', () => {
    const receipt = fixture(); receipt.state = 'RUNNING'; receipt.output = null; receipt.observer = null;
    const result = compareReadback(receipt, observations(receipt));
    assert.equal(result.result, 'MATCHES_PROVIDED_OBSERVATIONS'); assert.equal(result.state, 'RUNNING'); assertUnverified(result);
  });
  invalid('failed-state-requires-failure-evidence', receipt => { receipt.state = 'FAILED'; receipt.output = null; receipt.observer = null; });
  run('failed-work-may-request-release-without-success-output', () => {
    const receipt = fixture(); receipt.state = 'FAILED'; receipt.output = null; receipt.observer = null;
    receipt.failure = {code: 'SYNTHETIC_STOP', detail: 'Synthetic worker failed before an output.', sourceEventRef: 'synthetic:failure-event'};
    receipt.disposition = 'RELEASE_ONLY';
    const result = compareReadback(receipt, observations(receipt), {expectedAssignment: expected(receipt)});
    assert.equal(result.result, 'MATCHES_PROVIDED_OBSERVATIONS'); assert.equal(result.state, 'FAILED'); assert.equal(result.dispositionRequested, 'RELEASE_ONLY'); assertUnverified(result);
  });
  invalid('release-request-does-not-pretend-success', receipt => { receipt.disposition = 'RELEASE_ONLY'; }, 'STATE_EVIDENCE_MISMATCH');
  invalid('receipt-cannot-grant-authority', receipt => { receipt.disposition = 'MERGE_AUTHORIZED'; }, 'AUTHORITY_EFFECT_NONZERO');
  invalid('no-blanket-bootstrap-class', receipt => { receipt.taskClass = 'BOOTSTRAP_ANY_WORK'; }, 'TASK_CLASS_INVALID');
  mismatch('readback-wrong-assignment-task', readback => { readback.assignmentObservation.taskId = 'OTHER_TASK'; }, 'ASSIGNMENT_MISMATCH');
  mismatch('readback-wrong-assignment-head', readback => { readback.assignmentObservation.governingHead = FIXTURE_HEAD_OTHER; }, 'GOVERNING_HEAD_MISMATCH');
  mismatch('readback-role-mismatch', readback => { readback.assignmentObservation.assignment.canonicalIdentities = ['Soren']; }, 'ASSIGNMENT_MISMATCH');
  mismatch('readback-native-instance-mismatch', readback => { readback.invocationObservation.returnedTaskId = '/synthetic/wrong'; }, 'TASK_ID_MISMATCH');
  mismatch('readback-invocation-source-mismatch', readback => { readback.invocationObservation.sourceEventRef = 'synthetic:wrong'; }, 'SOURCE_EVENT_MISMATCH');
  mismatch('readback-state-mismatch', readback => { readback.invocationObservation.state = 'RUNNING'; }, 'ASSIGNMENT_MISMATCH');
  mismatch('readback-output-task-mismatch', readback => { readback.outputObservation.taskId = 'OTHER_TASK'; }, 'OUTPUT_MISMATCH');
  mismatch('readback-output-assignment-mismatch', readback => { readback.outputObservation.assignmentSha256 = '0'.repeat(64); }, 'OUTPUT_MISMATCH');
  mismatch('readback-output-content-mismatch', readback => { readback.outputObservation.text = 'Different output'; }, 'OUTPUT_MISMATCH');
  mismatch('readback-missing-output', readback => { readback.outputObservation = null; });
  mismatch('readback-observer-cannot-switch-task', readback => { readback.observerObservation.taskId = 'OTHER_TASK'; }, 'ASSIGNMENT_MISMATCH');
  mismatch('readback-observer-cannot-switch-worker', readback => { readback.observerObservation.observedNativeTaskId = '/synthetic/other'; }, 'TASK_ID_MISMATCH');
  mismatch('readback-observer-must-identify-output-digest', readback => { readback.observerObservation.outputSha256 = '0'.repeat(64); }, 'OUTPUT_MISMATCH');
  mismatch('readback-observer-must-be-independent', readback => { readback.observerObservation.nativeTaskId = '/synthetic/worker'; }, 'INDEPENDENCE_FAILURE');
  mismatch('readback-declared-trusted-flag-is-not-accepted', readback => { readback.trusted = true; }, 'UNSUPPORTED_EVIDENCE_FIELD');
  run('file-only-cli-structural-success-has-no-authority', () => {
    const receipt = fixture(); let text = '';
    const status = runCli(['--input', 'synthetic-input'], {readFile: () => JSON.stringify(receipt), write: value => { text += value; }});
    assert.equal(status, 0); const result = JSON.parse(text);
    assert.equal(result.result, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED'); assertUnverified(result);
  });
  run('file-only-cli-agreeing-files-remain-structural-only', () => {
    const receipt = fixture(); let text = '';
    const status = runCli(['--input', 'synthetic-input', '--observations', 'synthetic-observations'], {readFile: name => JSON.stringify(name === 'synthetic-input' ? receipt : observations(receipt)), write: value => { text += value; }});
    assert.equal(status, 0); const result = JSON.parse(text);
    assert.equal(result.result, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED'); assert.equal(result.providedObservationComparison, 'MATCHES_PROVIDED_OBSERVATIONS'); assertUnverified(result);
  });
  run('file-only-cli-authorization-attempt-exits-nonzero', () => {
    const receipt = fixture(); let text = '';
    const status = runCli(['--input', 'synthetic-input', '--authorize'], {readFile: () => JSON.stringify(receipt), write: value => { text += value; }});
    assert.equal(status, 2); const result = JSON.parse(text);
    assert.equal(result.authorizationAttempt, 'REJECTED_SOURCE_AUTHENTICITY_UNPROVABLE_FROM_FILES'); assertUnverified(result);
  });
  run('file-only-cli-malformed-input-fails', () => {
    let text = ''; const status = runCli(['--input', 'synthetic-input'], {readFile: () => '{', write: value => { text += value; }});
    assert.equal(status, 1); assertUnverified(JSON.parse(text));
  });
  run('file-only-cli-unknown-proof-switch-rejected', () => {
    let text = ''; const status = runCli(['--trust-me'], {readFile: () => '{}', write: value => { text += value; }});
    assert.equal(status, 1); assertUnverified(JSON.parse(text));
  });

  // Read the unchanged frozen constitution only when the repository supplies it.
  // No absent contract read or policy assumption is hidden in these unit checks.
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const constitutionPath = path.join(root, 'control-plane/whole-estate/characters-reconstruction-v1/compass-functional-coordinate-constitution.v1.json');
  if (fs.existsSync(constitutionPath)) run('mapping-equals-existing-frozen-constitution', () => {
    const constitution = JSON.parse(fs.readFileSync(constitutionPath, 'utf8'));
    for (const station of constitution.stations) {
      const identities = constitution.cardinalIdentities.filter((identity, index) => station.weights[index] > 0).map(identity => identity.identity);
      assert.deepEqual(STATION_IDENTITIES[station.bearing], identities);
    }
  });
  const contractPath = path.join(root, '.github/ai-router/agent-invocation/contract.v1.json');
  if (fs.existsSync(contractPath)) run('native-policy-contract-and-task-classes-integrate', () => {
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    assert.deepEqual([...TASK_CLASSES].sort(), [...contract.requiredTaskClasses].sort());
    assert.equal(contract.substantiveWorkWithoutInvocationAllowed, false);
    assert.equal(contract.authoritySeparation.functionalRouteExemptionExemptsNativeInvocation, false);
    assert.equal(contract.execution.actionsOrPassiveCIQualifiesAsAgent, false);
    assert.equal(contract.evidence.fileOnlyValidationResult, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED');
    assert.equal(contract.evidence.providedObservationComparisonResult, 'MATCHES_PROVIDED_OBSERVATIONS');
    assert.equal(contract.hostEnforcement.globalBypassPreventionProven, false);
    assert.equal(contract.bootstrap.allowsProductInspection, false);
    assert.equal(contract.bootstrap.allowsRepositoryMutation, false);
    for (const entry of ['AI_ENTRYPOINT.json', 'AGENTS.md', '.github/ai-router/shared-procedures.v1.json']) assert.match(fs.readFileSync(path.join(root, entry), 'utf8'), /agent-invocation\/contract\.v1\.json/);
  });
  const failures = checks.filter(check => !check.pass);
  return {schema: 'CANONICAL_NATIVE_AGENT_EVIDENCE_SELF_TEST_v1', result: failures.length ? 'FAIL_CLOSED' : 'PASS_CLOSED', fixtureProvenance: 'SYNTHETIC_ONLY_NOT_ACTUAL_AGENT_INVOCATION_EVIDENCE', checks: checks.length, passed: checks.length - failures.length, failed: failures.length, failures, authorityEffect: 'NONE', actualInvocationProved: false, workAuthorized: false};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = selfTest(); process.stdout.write(JSON.stringify(result, null, 2) + '\n'); process.exitCode = result.failed ? 1 : 0;
}
