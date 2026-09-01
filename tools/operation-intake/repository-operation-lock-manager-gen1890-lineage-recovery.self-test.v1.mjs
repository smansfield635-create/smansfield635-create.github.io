#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  EXACT_LOCK_REF_LINEAGE_RECOVERIES,
  stable
} from './repository-operation-lock-manager.v1.mjs';

const expected = stable({
  commitSha: '6be527a0aea26ba75e14e6d13b8e22021fa414fd',
  parentSha: 'bf476d15430e8fcb91c4e169b71e4ef53934846b',
  authorLogin: 'smansfield635-create',
  committerLogin: 'smansfield635-create',
  message: 'Close operation lock 1890: RESEARCH_FRONTIER_FOUR_CARD_RUNTIME_PUBLICATION_VERIFICATION_20260831_004 MUTATION_CLOSED_EVIDENCE_CONTINUES',
  ledgerBlobSha: 'b84180ccd008e5dca2c096781dedc98b9f1f0446'
});

const matches = EXACT_LOCK_REF_LINEAGE_RECOVERIES.filter(value => value.commitSha === expected.commitSha);
assert.equal(matches.length, 1, 'exact historical commit recovery must exist exactly once');
assert.deepEqual(matches[0], expected, 'exact historical recovery identity must be fully bound');
assert.equal(
  EXACT_LOCK_REF_LINEAGE_RECOVERIES.some(value => value.commitSha === expected.commitSha && value.parentSha !== expected.parentSha),
  false,
  'same commit sha must not admit an alternate parent'
);
assert.equal(
  EXACT_LOCK_REF_LINEAGE_RECOVERIES.some(value => value.commitSha === expected.commitSha && value.message !== expected.message),
  false,
  'same commit sha must not admit an alternate mutation message'
);
assert.equal(
  EXACT_LOCK_REF_LINEAGE_RECOVERIES.some(value => value.commitSha === expected.commitSha && value.ledgerBlobSha !== expected.ledgerBlobSha),
  false,
  'same commit sha must not admit an alternate ledger blob'
);

process.stdout.write(JSON.stringify(stable({
  schema: 'GEN1890_LOCK_MANAGER_LINEAGE_RECOVERY_SELF_TEST_v1',
  result: 'PASS_CLOSED',
  exactCommitRecoveryPresent: true,
  exactTupleBound: true,
  duplicateRecoveryAbsent: true,
  genericAuthorityWidening: false
}), null, 2) + '\n');
