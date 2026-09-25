import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
  resolveHEarthFormationMembershipForAddress
} from '../terrain/h-earth.terrain-formations.js';

import {
  H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../integration/h-earth.landscape-realization-planner.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  H_EARTH_SURFACE_STATE_FIELD,
  H_EARTH_SURFACE_CLASSES,
  H_EARTH_SURFACE_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  sampleHEarthSurfaceState,
  evaluateHEarthSurfaceStateSample,
  getHEarthSurfaceStateFieldReceipt
} from '../environment/h-earth.surface-state-field.js';

let assertionCount = 0;
const check = (condition, message) => {
  assertionCount += 1;
  assert.ok(condition, message);
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

const digest = (value) => createHash('sha256')
  .update(stable(value))
  .digest('hex');

const deepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) &&
    Object.values(value).every((nested) => deepFrozen(nested, seen));
};

const parseAddress = (address) => {
  const match = /:R(\d+):C(\d+)$/.exec(address ?? '');
  return match ? { row: Number(match[1]), column: Number(match[2]) } : null;
};

const fixtures = Object.freeze([
  Object.freeze({ id: 'OPEN_WATER', x: -240, z: -52, expectedClass: 'OPEN_WATER' }),
  Object.freeze({ id: 'NEARSHORE_WATER', x: -240, z: -72, expectedClass: 'NEARSHORE_WATER' }),
  Object.freeze({ id: 'WET_SAND', x: -240, z: -84, expectedClass: 'WET_SAND' }),
  Object.freeze({ id: 'DRY_SAND', x: -240, z: -112, expectedClass: 'DRY_SAND' }),
  Object.freeze({ id: 'LOWLAND_SOIL', x: -240, z: -208, expectedClass: 'LOWLAND_SOIL' }),
  Object.freeze({ id: 'COASTAL_SOIL', x: 40, z: -132, expectedClass: 'COASTAL_SOIL' }),
  Object.freeze({ id: 'STONE_AND_SPARSE_SOIL', x: -16, z: -128, expectedClass: 'STONE_AND_SPARSE_SOIL' })
]);

const scalarUnitChannels = Object.freeze([
  'roughness',
  'reflectance',
  'wetness',
  'waterSaturation',
  'rockExposure',
  'vegetationSupport',
  'footingStability',
  'friction'
]);

const finiteChannels = Object.freeze([
  'terrainElevation',
  'slope',
  'curvature',
  'shorelineDistance',
  ...scalarUnitChannels,
  'soilDepth'
]);

// Contract and authority-boundary checks.
equal(H_EARTH_SURFACE_STATE_FIELD.contractId,
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  'surface contract identity');
equal(H_EARTH_SURFACE_STATE_FIELD.surfaceStateRevision, 1,
  'surface revision');
equal(H_EARTH_SURFACE_STATE_FIELD.ownership.ownsIntrinsicSurfaceCondition, true,
  'intrinsic surface ownership');
for (const key of [
  'ownsTerrainTruth', 'ownsSemanticAddressIdentity', 'ownsFormationIdentity',
  'ownsWaterState', 'ownsTraversal', 'ownsBiome', 'ownsPopulation',
  'ownsAmbientAudioProjection', 'ownsSpatialLifecycle', 'ownsGeometry',
  'ownsRenderer', 'ownsAdmission', 'ownsFrame', 'ownsCompositor',
  'ownsController', 'ownsPublicRoute'
]) {
  equal(H_EARTH_SURFACE_STATE_FIELD.ownership[key], false,
    `authority boundary ${key}`);
}
deepEqual([...H_EARTH_SURFACE_CLASSES].sort(),
  fixtures.map((fixture) => fixture.expectedClass).sort(),
  'all seven classes are fixture-covered');
check(deepFrozen(H_EARTH_SURFACE_STATE_FIELD), 'field definition deep frozen');

// Nonfinite rejection.
for (const [x, z] of [[Number.NaN, 0], [0, Number.NaN], [Infinity, 0], [0, -Infinity]]) {
  const rejected = sampleHEarthSurfaceState(x, z);
  equal(rejected.valid, false, 'nonfinite sample rejected');
  equal(rejected.status, 'SURFACE_STATE_REJECTED_NONFINITE',
    'nonfinite rejection status');
  check(deepFrozen(rejected), 'nonfinite rejection deep frozen');
}

const observed = [];
for (const fixture of fixtures) {
  const first = sampleHEarthSurfaceState(fixture.x, fixture.z);
  const second = sampleHEarthSurfaceState(fixture.x, fixture.z);
  const terrain = sampleHEarthTerrainField(fixture.x, fixture.z);
  const evaluation = evaluateHEarthSurfaceStateSample(first);

  equal(first.valid, true, `${fixture.id} valid`);
  equal(first.status, 'SURFACE_STATE_SAMPLE_COMPLETE', `${fixture.id} status`);
  equal(first.surfaceClass, fixture.expectedClass, `${fixture.id} class`);
  equal(evaluation.eligible, true, `${fixture.id} evaluation pass`);
  deepEqual(evaluation.issues, [], `${fixture.id} evaluation issues empty`);
  deepEqual(first, second, `${fixture.id} deterministic repeatability`);
  equal(digest(first), digest(second), `${fixture.id} deterministic digest`);
  check(deepFrozen(first), `${fixture.id} deep frozen`);

  equal(first.terrainElevation, terrain.elevation,
    `${fixture.id} terrain elevation correspondence`);
  deepEqual(first.normal, terrain.normal,
    `${fixture.id} terrain normal correspondence`);
  equal(first.slope, terrain.slope, `${fixture.id} terrain slope correspondence`);
  equal(first.curvature, terrain.curvature,
    `${fixture.id} terrain curvature correspondence`);
  equal(first.shorelineDistance, terrain.shorelineDistance,
    `${fixture.id} shoreline correspondence`);

  for (const channel of finiteChannels) {
    check(Number.isFinite(first[channel]), `${fixture.id} finite ${channel}`);
  }
  for (const channel of scalarUnitChannels) {
    check(first[channel] >= 0 && first[channel] <= 1,
      `${fixture.id} unit range ${channel}`);
  }
  check(first.soilDepth >= 0, `${fixture.id} nonnegative soil depth`);

  for (const channel of ['linearR', 'linearG', 'linearB', 'alpha']) {
    check(Number.isFinite(first.baseColorProfile[channel]),
      `${fixture.id} finite base color ${channel}`);
    check(first.baseColorProfile[channel] >= 0 &&
      first.baseColorProfile[channel] <= 1,
      `${fixture.id} base color range ${channel}`);
  }

  check(/^H_EARTH_GROUND_CELL_001:R\d{2}:C\d{2}$/.test(first.semanticAddressId),
    `${fixture.id} semantic identity shape`);
  check(typeof first.chunkId === 'string' && first.chunkId.length > 0,
    `${fixture.id} chunk identity`);
  check(Array.isArray(first.formationIds), `${fixture.id} formation membership array`);
  const addressRecord = parseAddress(first.semanticAddressId);
  deepEqual(first.formationIds,
    resolveHEarthFormationMembershipForAddress(addressRecord),
    `${fixture.id} formation membership correspondence`);

  equal(first.sourceIdentities.terrainFieldContractId,
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    `${fixture.id} terrain source identity`);
  equal(first.sourceIdentities.terrainFormationsContractId,
    H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
    `${fixture.id} formation source identity`);
  equal(first.sourceIdentities.landscapeRealizationPlannerContractId,
    H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
    `${fixture.id} planner source identity`);
  equal(first.sourceIdentities.landscapeRealizationPlanDigest,
    H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.deterministicDigest,
    `${fixture.id} plan digest correspondence`);
  equal(first.nativeTruthOwnership, 'INTRINSIC_SURFACE_STATE_ONLY',
    `${fixture.id} native truth scope`);

  for (const forbidden of H_EARTH_SURFACE_STATE_FORBIDDEN_NATIVE_OUTPUTS) {
    equal(Object.prototype.hasOwnProperty.call(first, forbidden), false,
      `${fixture.id} forbidden output absent ${forbidden}`);
  }

  observed.push(first);
}

const byClass = Object.fromEntries(observed.map((sample) => [sample.surfaceClass, sample]));
equal(byClass.OPEN_WATER.wetness, 1, 'open-water wetness saturated');
equal(byClass.NEARSHORE_WATER.waterSaturation, 1,
  'nearshore saturation saturated');
check(byClass.WET_SAND.wetness > byClass.DRY_SAND.wetness,
  'wet sand wetter than dry sand');
check(byClass.STONE_AND_SPARSE_SOIL.rockExposure > byClass.LOWLAND_SOIL.rockExposure,
  'stone has greater rock exposure than lowland');
check(byClass.LOWLAND_SOIL.vegetationSupport >
  byClass.STONE_AND_SPARSE_SOIL.vegetationSupport,
  'lowland has greater vegetation support than stone');
check(byClass.STONE_AND_SPARSE_SOIL.friction > byClass.WET_SAND.friction,
  'stone friction exceeds wet sand');
equal(byClass.WET_SAND.soundResponse, 'WET_SAND',
  'wet-sand intrinsic sound response');
equal(byClass.DRY_SAND.soundResponse, 'SOFT_SAND',
  'dry-sand intrinsic sound response');
equal(byClass.STONE_AND_SPARSE_SOIL.soundResponse, 'LOOSE_STONE',
  'stone intrinsic sound response');
equal(byClass.NEARSHORE_WATER.soundResponse, 'SHALLOW_WATER_CONTACT',
  'nearshore intrinsic sound response');

// Cross-domain deterministic grid execution.
const gridDigests = [];
for (let x = -224; x <= 224; x += 32) {
  for (let z = -240; z <= 16; z += 16) {
    const sample = sampleHEarthSurfaceState(x, z);
    if (!sample.valid) continue;
    const evaluation = evaluateHEarthSurfaceStateSample(sample);
    equal(evaluation.eligible, true, `grid sample pass ${x}:${z}`);
    equal(evaluation.issues.length, 0, `grid issues empty ${x}:${z}`);
    gridDigests.push(digest(sample));
  }
}
check(gridDigests.length >= 150, 'cross-domain grid sample count');
equal(new Set(gridDigests).size, gridDigests.length,
  'cross-domain samples retain distinct governed identities');

const sourceReceipt = getHEarthSurfaceStateFieldReceipt();
equal(sourceReceipt.contractId, H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  'source receipt contract');
equal(sourceReceipt.nativeTruthScope, 'INTRINSIC_SURFACE_STATE_ONLY',
  'source receipt native truth scope');
equal(sourceReceipt.productPromotionClaim, false,
  'source receipt no promotion claim');
equal(sourceReceipt.ownsTraversal, false, 'source receipt no traversal authority');
equal(sourceReceipt.ownsWaterState, false, 'source receipt no water authority');
equal(sourceReceipt.ownsBiome, false, 'source receipt no biome authority');
equal(sourceReceipt.ownsAmbientAudioProjection, false,
  'source receipt no audio projection authority');
equal(sourceReceipt.ownsSpatialLifecycle, false,
  'source receipt no lifecycle authority');
check(deepFrozen(sourceReceipt), 'source receipt deep frozen');

const core = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7B_RECEIPT',
  contractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7B_CANONICAL_SURFACE_STATE_FIELD_PASS',
  parentCommit: 'c51d7a6ae5d913a0712e5a8d5a55c06866842f45',
  executedSourcePath: '/h-earth-3d/environment/h-earth.surface-state-field.js',
  executedHarnessPath: '/h-earth-3d/validation/h-earth.functional-environment.run7b.harness.mjs',
  sourceContractIdentities: {
    terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    terrainFormationsContractId: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
    landscapeRealizationPlannerContractId:
      H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID
  },
  surfaceStateRevision: H_EARTH_SURFACE_STATE_FIELD.surfaceStateRevision,
  fixtureCount: fixtures.length,
  crossDomainSampleCount: gridDigests.length,
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  surfaceClassesObserved: [...new Set(observed.map((sample) => sample.surfaceClass))].sort(),
  forbiddenOutputsObserved: [],
  issues: [],
  execution: {
    runtime: `node ${process.version}`,
    command: 'node --experimental-default-type=module h-earth-3d/validation/h-earth.functional-environment.run7b.harness.mjs',
    exactTerrainFieldMaterialized: true,
    exactTerrainFormationsMaterialized: true,
    plannerFixture: 'STRUCTURALLY_EQUIVALENT_16_CHUNK_TEST_DOUBLE_ONLY',
    repositoryPlannerImportTarget: '/h-earth-3d/integration/h-earth.landscape-realization-planner.js',
    repositoryImportExecutionClaim: false,
    productPromotionClaim: false,
    rendererMutation: false,
    publicRouteMutation: false,
    liveVerificationClaim: false
  }
};

const receipt = {
  ...core,
  deterministicDigestAlgorithm: 'SHA256_STABLE_SERIALIZATION',
  deterministicDigest: digest(core)
};

console.log(JSON.stringify(receipt, null, 2));
