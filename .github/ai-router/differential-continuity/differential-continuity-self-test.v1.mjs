#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assessDifferential,
  classifyProofCarrier,
  successorActionForReceipt,
  stable
} from './differential-continuity-gate.v1.mjs';

const H0 = '1'.repeat(40);
const H1 = '2'.repeat(40);
function assert(condition, message) { if (!condition) throw new Error(message); }
function surface(paths = ['alpha/core/']) { return { complete: true, paths, interfaceKeys: ['SELF_TEST_INTERFACE'], evidenceRefs: ['SELF_TEST_DEPENDENCY_DECLARATION'] }; }
function request(changedFiles, extra = {}) {
  return {
    assessmentId: 'SELF_TEST_DIFFERENTIAL_001',
    baseHead: H0,
    targetHead: H1,
    dependencySurface: surface(),
    changedFiles,
    filesComplete: true,
    compareStatus: 'ahead',
    ...extra
  };
}

function main() {
  const tests = [];
  const run = (id, fn) => {
    try { tests.push({ id, pass: true, detail: fn() ?? null }); }
    catch (error) { tests.push({ id, pass: false, detail: error.message }); }
  };

  run('DISJOINT_CHANGE_CARRIES_FORWARD', () => {
    const receipt = assessDifferential(request(['beta/unrelated.txt']));
    assert(receipt.result === 'PASS_CARRY_FORWARD_ADMISSIBLE', 'RESULT');
    assert(receipt.impactClassification === 'DISJOINT_DEPENDENCY_CHANGE', 'CLASS');
    assert(receipt.carryForwardAdmissible === true, 'CARRY_FORWARD');
    assert(receipt.successorRequired === false, 'SUCCESSOR_NOT_SUPPRESSED');
    assert(successorActionForReceipt(receipt) === 'STOP_SUCCESSOR_CARRY_FORWARD', 'WRAPPER_ACTION');
  });

  run('DIRECT_DEPENDENCY_CHANGE_REQUIRES_SUCCESSOR', () => {
    const receipt = assessDifferential(request(['alpha/core/file.mjs']));
    assert(receipt.impactClassification === 'MATERIAL_DEPENDENCY_CHANGE', 'CLASS');
    assert(receipt.carryForwardAdmissible === false, 'CARRY_FORWARD');
    assert(receipt.successorRequired === true, 'SUCCESSOR');
    assert(successorActionForReceipt(receipt) === 'DELEGATE_TO_STRICT_SUCCESSOR', 'WRAPPER_ACTION');
  });

  run('PARENT_PATH_CHANGE_REQUIRES_SUCCESSOR', () => {
    const receipt = assessDifferential(request(['alpha']));
    assert(receipt.successorRequired === true, 'PARENT_OVERLAP_MISSED');
  });

  run('RENAMED_FROM_DEPENDENCY_REQUIRES_SUCCESSOR', () => {
    const receipt = assessDifferential(request([{ filename: 'beta/moved.mjs', previous_filename: 'alpha/core/original.mjs', status: 'renamed' }]));
    assert(receipt.successorRequired === true, 'RENAME_PREVIOUS_PATH_MISSED');
  });

  run('WILDCARD_DEPENDENCY_REQUIRES_SUCCESSOR_FOR_ANY_CHANGE', () => {
    const receipt = assessDifferential(request(['beta/unrelated.txt'], { dependencySurface: surface(['*']) }));
    assert(receipt.successorRequired === true, 'WILDCARD_MISSED');
  });

  run('INCOMPLETE_DEPENDENCY_SURFACE_FAILS_CLOSED', () => {
    const receipt = assessDifferential(request(['beta/unrelated.txt'], { dependencySurface: { complete: false, paths: ['alpha/core'] } }));
    assert(receipt.result === 'FAIL_CLOSED_SUCCESSOR_REQUIRED', 'RESULT');
    assert(receipt.successorRequired === true, 'SUCCESSOR');
    assert(receipt.errorCode === 'DEPENDENCY_SURFACE_INCOMPLETE', 'ERROR_CODE');
  });

  run('TRUNCATED_CHANGED_FILE_SET_FAILS_CLOSED', () => {
    const receipt = assessDifferential(request(['beta/unrelated.txt'], { filesComplete: false }));
    assert(receipt.result === 'FAIL_CLOSED_SUCCESSOR_REQUIRED', 'RESULT');
    assert(receipt.errorCode === 'CHANGED_FILE_SET_INCOMPLETE', 'ERROR_CODE');
  });

  run('DIVERGED_COMPARE_FAILS_CLOSED', () => {
    const receipt = assessDifferential(request(['beta/unrelated.txt'], { compareStatus: 'diverged' }));
    assert(receipt.result === 'FAIL_CLOSED_SUCCESSOR_REQUIRED', 'RESULT');
    assert(receipt.errorCode === 'COMPARE_NOT_LINEAR_AHEAD_OR_IDENTICAL', 'ERROR_CODE');
  });

  run('SAME_HEAD_CARRIES_FORWARD_WITH_ZERO_DIFF', () => {
    const receipt = assessDifferential(request([], { targetHead: H0, compareStatus: 'identical' }));
    assert(receipt.impactClassification === 'SAME_HEAD', 'CLASS');
    assert(receipt.carryForwardAdmissible === true, 'CARRY_FORWARD');
  });

  run('COALESCED_BASE_TO_LATEST_IS_EXPLICIT', () => {
    const receipt = assessDifferential(request(['beta/one.txt', 'gamma/two.txt']));
    assert(receipt.coalescedFromBaseDirectlyToTarget === true, 'NOT_COALESCED');
    assert(receipt.intermediateHeadReplayRequired === false, 'INTERMEDIATE_REPLAY_REQUIRED');
  });

  run('CHANGED_PATH_DIGEST_IS_ORDER_STABLE', () => {
    const a = assessDifferential(request(['gamma/two.txt', 'beta/one.txt']));
    const b = assessDifferential(request(['beta/one.txt', 'gamma/two.txt']));
    assert(a.changedPathsDigest === b.changedPathsDigest, 'NONDETERMINISTIC_CHANGED_PATH_DIGEST');
    assert(a.dependencySurfaceDigest === b.dependencySurfaceDigest, 'NONDETERMINISTIC_DEPENDENCY_DIGEST');
  });

  run('CONSUMED_VALIDATION_ONLY_PROOF_IS_CLOSE_ELIGIBLE', () => {
    const receipt = classifyProofCarrier({ kind: 'VALIDATION_ONLY_PR', status: 'CONSUMED', mergeAuthorized: false, prNumber: 827 });
    assert(receipt.classification === 'CLOSE_ELIGIBLE_CONSUMED', 'CLASS');
    assert(receipt.closeEligible === true, 'ELIGIBILITY');
  });

  run('SUPERSEDED_VALIDATION_ONLY_PROOF_IS_CLOSE_ELIGIBLE', () => {
    const receipt = classifyProofCarrier({ kind: 'VALIDATION_ONLY_PR', status: 'SUPERSEDED', mergeAuthorized: false, prNumber: 828 });
    assert(receipt.classification === 'CLOSE_ELIGIBLE_SUPERSEDED', 'CLASS');
    assert(receipt.closeEligible === true, 'ELIGIBILITY');
  });

  run('ACTIVE_PROOF_IS_RETAINED', () => {
    const receipt = classifyProofCarrier({ kind: 'VALIDATION_ONLY_PR', status: 'ACTIVE', mergeAuthorized: false });
    assert(receipt.classification === 'ACTIVE_PROOF', 'CLASS');
    assert(receipt.closeEligible === false, 'CLOSE_ELIGIBLE');
  });

  run('MERGE_AUTHORITY_PREVENTS_AUTOMATIC_CLOSE_CLASSIFICATION', () => {
    const receipt = classifyProofCarrier({ kind: 'VALIDATION_ONLY_PR', status: 'SUPERSEDED', mergeAuthorized: true });
    assert(receipt.classification === 'RETAIN_REVIEW_REQUIRED', 'CLASS');
    assert(receipt.closeEligible === false, 'CLOSE_ELIGIBLE');
  });

  const failures = tests.filter((test) => !test.pass);
  const receipt = stable({
    schema: 'DIFFERENTIAL_CONTINUITY_SELF_TEST_RECEIPT_v1',
    selfTestId: 'REPOSITORY_DIFFERENTIAL_CONTINUITY_AND_PROOF_CHURN_SUPPRESSION_SELF_TEST_v1',
    result: failures.length ? 'FAIL_CLOSED' : 'PASS_CLOSED',
    testCount: tests.length,
    passCount: tests.length - failures.length,
    failCount: failures.length,
    tests,
    invariants: {
      incompleteDependencySurfaceFailsClosed: true,
      ambiguousCompareFailsClosed: true,
      renamePreviousPathParticipatesInImpact: true,
      disjointDiffMayCarryForward: true,
      materialDiffRequiresSuccessor: true,
      intermediateHeadsAreCoalesced: true,
      proofCarrierClassificationCreatesNoMergeAuthority: true,
      directLedgerMutationPerformed: false
    }
  });
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex >= 0 && process.argv[outputIndex + 1]) {
    const absolute = path.resolve(process.argv[outputIndex + 1]);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, `${JSON.stringify(receipt, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  if (failures.length) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
