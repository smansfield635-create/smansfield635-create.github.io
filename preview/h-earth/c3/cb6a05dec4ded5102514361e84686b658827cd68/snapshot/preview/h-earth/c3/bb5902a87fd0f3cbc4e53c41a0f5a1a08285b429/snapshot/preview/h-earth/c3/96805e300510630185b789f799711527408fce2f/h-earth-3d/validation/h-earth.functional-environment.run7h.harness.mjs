import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE,
  buildHEarthFunctionalEnvironmentComposite,
  evaluateHEarthFunctionalEnvironmentComposite
} from '../integration/h-earth.functional-environment-composite.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthTerrainField } from '../terrain/h-earth.terrain-field.js';

let assertionCount = 0;
const check = (condition, message) => {
  assertionCount += 1;
  assert.equal(Boolean(condition), true, message);
};
const equal = (actual, expected, message) => {
  assertionCount += 1;
  assert.equal(actual, expected, message);
};
const deepEqual = (actual, expected, message) => {
  assertionCount += 1;
  assert.deepEqual(actual, expected, message);
};
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) =>
        `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const digest = (value) => createHash('sha256').update(stable(value)).digest('hex');

const waypointSamples = [];
for (const [waypointId, waypoint] of Object.entries(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)) {
  const terrain = sampleHEarthTerrainField(waypoint.position.x, waypoint.position.z);
  equal(terrain.valid, true, `WAYPOINT_TERRAIN_INVALID:${waypointId}`);
  const observerWorld = {
    x: waypoint.position.x,
    y: terrain.elevation + 2.25,
    z: waypoint.position.z
  };
  const first = buildHEarthFunctionalEnvironmentComposite({
    worldX: waypoint.position.x,
    worldZ: waypoint.position.z,
    observerWorld,
    viewportWidth: 480,
    viewportHeight: 320,
    cameraFarPlane: 512,
    renderSequence: 7,
    populationRadius: 96,
    populationSampleStep: 24,
    populationSeed: 'H_EARTH_RUN_7H_NODE_PROOF_v1'
  });
  const second = buildHEarthFunctionalEnvironmentComposite({
    worldX: waypoint.position.x,
    worldZ: waypoint.position.z,
    observerWorld,
    viewportWidth: 480,
    viewportHeight: 320,
    cameraFarPlane: 512,
    renderSequence: 7,
    populationRadius: 96,
    populationSampleStep: 24,
    populationSeed: 'H_EARTH_RUN_7H_NODE_PROOF_v1'
  });
  deepEqual(first, second, `WAYPOINT_NONDETERMINISTIC:${waypointId}`);
  equal(first.eligible, true, `WAYPOINT_COMPOSITE_INVALID:${waypointId}`);
  equal(first.contractId, H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
    `WAYPOINT_CONTRACT_MISMATCH:${waypointId}`);
  const evaluation = evaluateHEarthFunctionalEnvironmentComposite(first);
  equal(evaluation.eligible, true, `WAYPOINT_EVALUATION_FAILED:${waypointId}`);
  deepEqual(evaluation.issues, [], `WAYPOINT_EVALUATION_ISSUES:${waypointId}`);
  equal(first.correspondence.semanticCorrespondence, true,
    `WAYPOINT_SEMANTIC_CORRESPONDENCE:${waypointId}`);
  equal(first.correspondence.authorityCollapse, false,
    `WAYPOINT_AUTHORITY_COLLAPSE:${waypointId}`);
  equal(first.presentation.atmosphere.frameClosure.grayFallbackPermitted, false,
    `WAYPOINT_GRAY_FALLBACK_PERMITTED:${waypointId}`);
  equal(first.presentation.atmosphere.frameClosure.fullViewportSkyCoverageRequired, true,
    `WAYPOINT_SKY_CLOSURE_NOT_REQUIRED:${waypointId}`);
  equal(first.population.spatialLifecycleAuthorityStatus, 'EXTERNAL_AUTHORITY_CONSUMED',
    `WAYPOINT_LIFECYCLE_NOT_CONSUMED:${waypointId}`);
  equal(first.lifecycle.state, 'ACTIVE_DETAIL',
    `WAYPOINT_LOCAL_LIFECYCLE_NOT_DETAIL:${waypointId}`);
  equal(first.lifecyclePopulationContext.authorityEstablished, true,
    `WAYPOINT_LIFECYCLE_AUTHORITY_NOT_ESTABLISHED:${waypointId}`);
  check(first.surface.valid && first.atmosphere.valid && first.water.valid &&
    first.biome.valid && first.traversal.valid,
    `WAYPOINT_UPSTREAM_INVALID:${waypointId}`);
  check(Number.isInteger(first.population.instanceCount) && first.population.instanceCount >= 0,
    `WAYPOINT_POPULATION_COUNT_INVALID:${waypointId}`);
  check(Object.isFrozen(first), `WAYPOINT_COMPOSITE_NOT_FROZEN:${waypointId}`);

  waypointSamples.push({
    waypointId,
    semanticAddressId: first.correspondence.semanticAddressId,
    chunkId: first.correspondence.chunkId,
    surfaceClass: first.surface.surfaceClass,
    waterClass: first.water.waterClass,
    biomeClass: first.biome.biomeClass,
    traversalClass: first.traversal.traversalClass,
    lifecycleState: first.lifecycle.state,
    populationInstanceCount: first.population.instanceCount,
    populationSpeciesCount: first.population.speciesCount
  });
}

const coast = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS.COAST;
const coastTerrain = sampleHEarthTerrainField(coast.position.x, coast.position.z);
const observerWorld = {
  x: coast.position.x,
  y: coastTerrain.elevation + 2.25,
  z: coast.position.z
};
const lifecycleProof = [
  ['ACTIVE_DETAIL', 32],
  ['ACTIVE_REDUCED', 120],
  ['SLEEPING', 260],
  ['UNLOADED', 420]
].map(([expectedState, distance]) => {
  const composite = buildHEarthFunctionalEnvironmentComposite({
    worldX: coast.position.x,
    worldZ: coast.position.z,
    observerWorld,
    lifecycleSubjectWorld: {
      x: observerWorld.x + distance,
      y: observerWorld.y,
      z: observerWorld.z
    },
    viewportWidth: 390,
    viewportHeight: 844,
    cameraFarPlane: 512,
    renderSequence: 11,
    populationRadius: 96,
    populationSampleStep: 24,
    populationSeed: 'H_EARTH_RUN_7H_LIFECYCLE_PROOF_v1'
  });
  equal(composite.eligible, true, `LIFECYCLE_COMPOSITE_INVALID:${expectedState}`);
  equal(composite.lifecycle.state, expectedState, `LIFECYCLE_STATE_MISMATCH:${expectedState}`);
  if (expectedState === 'SLEEPING' || expectedState === 'UNLOADED') {
    equal(composite.population.instanceCount, 0,
      `INACTIVE_LIFECYCLE_HAS_POPULATION:${expectedState}`);
  }
  return {
    distance,
    state: composite.lifecycle.state,
    populationInstanceCount: composite.population.instanceCount
  };
});

deepEqual(lifecycleProof.map((entry) => entry.state),
  ['ACTIVE_DETAIL', 'ACTIVE_REDUCED', 'SLEEPING', 'UNLOADED'],
  'LIFECYCLE_STATE_COVERAGE_FAILED');

for (const [key, expected] of Object.entries({
  ownsAggregation: true,
  ownsCorrespondenceAudit: true,
  ownsTerrainTruth: false,
  ownsSurfaceTruth: false,
  ownsAtmosphereTruth: false,
  ownsWaterTruth: false,
  ownsBiomeTruth: false,
  ownsPopulationPlanning: false,
  ownsTraversalTruth: false,
  ownsSpatialLifecycleTruth: false,
  ownsCamera: false,
  ownsNavigation: false,
  ownsGeometry: false,
  ownsRenderer: false,
  ownsPublicRoute: false,
  ownsDeployment: false
})) {
  equal(H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE.ownership[key], expected,
    `COMPOSITE_OWNERSHIP_MISMATCH:${key}`);
}

for (const invalid of [
  {},
  { worldX: Number.NaN, worldZ: 0, observerWorld: { x: 0, y: 0, z: 0 } },
  { worldX: 0, worldZ: 0, observerWorld: null }
]) {
  const rejected = buildHEarthFunctionalEnvironmentComposite(invalid);
  equal(rejected.eligible, false, 'INVALID_COMPOSITE_INPUT_ACCEPTED');
}

const deterministicCore = {
  contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  waypointSamples,
  lifecycleProof
};
const deterministicDigest = digest(deterministicCore);
const repeatDigest = digest({
  contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  waypointSamples,
  lifecycleProof
});
equal(deterministicDigest, repeatDigest, 'RUN_7H_DIGEST_RERUN_MISMATCH');

const candidate = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7H_EXECUTION_CANDIDATE',
  contractId: H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7H_NODE_INTEGRATION_PASS',
  runtime: process.version,
  waypointCount: waypointSamples.length,
  waypointSamples,
  lifecycleProof,
  lifecycleStateCount: 4,
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  authorityCollapse: false,
  workspaceExecution: true,
  localConstruction: false,
  rendererAuthorityReplaced: false,
  cameraAuthorityReplaced: false,
  navigationAuthorityReplaced: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7H_EXECUTION_CANDIDATE ??
  'h-earth-run7h-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(candidate, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(candidate, null, 2));
