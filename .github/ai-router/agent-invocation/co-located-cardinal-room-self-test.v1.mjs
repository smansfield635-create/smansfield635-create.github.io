#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(fs.readFileSync(path.join(here, 'contract.v1.json'), 'utf8'));
const fallback = JSON.parse(fs.readFileSync(path.join(here, 'co-located-cardinal-room.v1.json'), 'utf8'));

assert.equal(contract.execution.coLocatedFallbackContract, '.github/ai-router/agent-invocation/co-located-cardinal-room.v1.json');
assert.equal(contract.execution.coLocatedFallbackRequiresExplicitOwnerDirection, true);
assert.equal(contract.execution.coLocatedFallbackCountsAsNativeSpawn, false);
assert.equal(contract.execution.coLocatedFallbackMayClaimIndependentModelReview, false);
assert.equal(contract.authoritySeparation.coLocatedFallbackGrantsNoAdditionalAuthority, true);
assert.match(contract.startupDiscovery.outcomes.NATIVE_AGENT_CAPABILITY_UNEXPOSED.next, /CO_LOCATED_CARDINAL_EXECUTION_ROOM_v1/);

assert.equal(fallback.activation.requiresNativeSpawnOrFollowupUnexposed, true);
assert.equal(fallback.activation.requiresExplicitOwnerDirectionToProceedInCurrentRoom, true);
assert.equal(fallback.executionModel.host, 'SINGLE_COORDINATOR_ROOM');
assert.equal(fallback.executionModel.persistentSeparateModelsClaimed, false);
assert.deepEqual(fallback.executionModel.phaseOrder, [
  'ALARIC_ORIENT',
  'ELARA_EXECUTE_OR_OBSERVE',
  'TARIAN_CONTINUITY_CHECK',
  'SOREN_BOUNDARY_REVIEW',
  'ALARIC_ROUTE'
]);
assert.equal(fallback.authority.effect, 'NONE');
assert.equal(fallback.authority.doesNotReplaceCanonicalIntake, true);
assert.equal(fallback.authority.doesNotCreateMergeAuthority, true);
assert.equal(fallback.authority.doesNotCreateDeploymentAuthority, true);
assert.equal(fallback.authority.doesNotCreatePublicationAuthority, true);
for (const identity of ['Alaric', 'Elara', 'Tarian', 'Soren']) {
  assert.ok(Object.values(fallback.identities).some(x => x.identity === identity));
}

console.log(JSON.stringify({
  schema: 'CO_LOCATED_CARDINAL_EXECUTION_ROOM_SELF_TEST_v1',
  result: 'PASS_CLOSED',
  checks: 19,
  authorityEffect: 'NONE',
  nativeSpawnClaimed: false,
  independentModelReviewClaimed: false
}, null, 2));
