#!/usr/bin/env node
import assert from 'node:assert/strict';
import { assessDifferential, CARRY_FORWARD, STRICT_SUCCESSOR } from './differential-continuity-gate.v1.mjs';

const BASE = '2910d0718de3b1d5ecd31e32b97ff9678028c036';
const CURRENT = 'ec1e19a8ec5c351827fad248635039906ffb2f3b';
const DEPENDENCIES = [
  'compass-isolated-clone/index.html',
  'assets/compass/compass.controller.js'
];

function request(overrides = {}) {
  return {
    schema: 'DIFFERENTIAL_CONTINUITY_ASSESSMENT_REQUEST_v1',
    baseHead: BASE,
    currentHead: CURRENT,
    dependencySurfaceComplete: true,
    baseIsAncestor: true,
    dependencyPaths: DEPENDENCIES,
    changedPaths: [
      '.github/ai-router/workflow-dispatch-capability.v1.json',
      '.github/workflows/h-earth-stage1-mobile-interaction-qualify.yml'
    ],
    ...overrides
  };
}

const disjoint = assessDifferential(request());
assert.equal(disjoint.result, CARRY_FORWARD);
assert.equal(disjoint.carryForwardAuthorized, true);
assert.equal(disjoint.authorityExpanded, false);
assert.equal(disjoint.strictSuccessorFallbackPreserved, true);

const overlap = assessDifferential(request({ changedPaths: ['assets/compass/compass.controller.js'] }));
assert.equal(overlap.result, STRICT_SUCCESSOR);
assert.equal(overlap.reason, 'DEPENDENCY_OVERLAP');
assert.equal(overlap.carryForwardAuthorized, false);

const directoryOverlap = assessDifferential(request({
  dependencyPaths: ['assets/compass'],
  changedPaths: ['assets/compass/compass.controller.js']
}));
assert.equal(directoryOverlap.result, STRICT_SUCCESSOR);

const incomplete = assessDifferential(request({ dependencySurfaceComplete: false }));
assert.equal(incomplete.result, STRICT_SUCCESSOR);
assert.equal(incomplete.reason, 'INCOMPLETE_DEPENDENCY_SURFACE');

const divergent = assessDifferential(request({ baseIsAncestor: false }));
assert.equal(divergent.result, STRICT_SUCCESSOR);
assert.equal(divergent.reason, 'BASE_NOT_ANCESTOR_OF_CURRENT_HEAD');

const stationary = assessDifferential(request({ baseHead: CURRENT, currentHead: CURRENT, changedPaths: [] }));
assert.equal(stationary.result, CARRY_FORWARD);
assert.equal(stationary.reason, 'NO_HEAD_MOVEMENT');

assert.throws(() => assessDifferential(request({ changedPaths: ['../escape'] })), /PATH_INVALID/);
assert.throws(() => assessDifferential(request({ dependencyPaths: [] })), /PATH_SET_INVALID/);

process.stdout.write(JSON.stringify({
  schema: 'DIFFERENTIAL_CONTINUITY_SELF_TEST_RECEIPT_v1',
  result: 'PASS_CLOSED',
  deterministicDisjointCarryForward: true,
  overlapFailsToStrictSuccessor: true,
  incompleteEvidenceFailsToStrictSuccessor: true,
  divergentHistoryFailsToStrictSuccessor: true,
  authorityExpansionProhibited: true,
  realGen344DisjointFixture: {
    baseHead: BASE,
    currentHead: CURRENT,
    changedPaths: request().changedPaths,
    result: disjoint.result
  }
}, null, 2) + '\n');
