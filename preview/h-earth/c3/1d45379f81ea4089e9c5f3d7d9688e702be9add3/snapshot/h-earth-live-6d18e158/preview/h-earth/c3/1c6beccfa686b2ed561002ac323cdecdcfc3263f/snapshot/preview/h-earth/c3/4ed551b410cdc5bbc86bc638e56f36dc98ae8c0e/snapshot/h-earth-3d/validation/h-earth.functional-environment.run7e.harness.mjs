import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_BIOME_FIELD_CONTRACT_ID,
  H_EARTH_BIOME_FIELD,
  H_EARTH_BIOME_CLASSES,
  H_EARTH_BIOME_FIELD_FORBIDDEN_NATIVE_OUTPUTS,
  sampleHEarthBiomeField,
  evaluateHEarthBiomeFieldSample,
  getHEarthBiomeFieldReceipt
} from '../environment/h-earth.biome-field.js';

import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  H_EARTH_POPULATION_PLANNER,
  H_EARTH_POPULATION_SPECIES_CATALOG,
  H_EARTH_POPULATION_PLANNER_FORBIDDEN_NATIVE_OUTPUTS,
  H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT,
  planHEarthPopulation,
  buildHEarthRun7ESmallInstanceProof,
  evaluateHEarthPopulationPlan,
  getHEarthPopulationPlannerReceipt
} from '../environment/h-earth.population-planner.js';

import {
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  sampleHEarthSurfaceState
} from '../environment/h-earth.surface-state-field.js';

import {
  H_EARTH_WATER_STATE_CONTRACT_ID,
  sampleHEarthWaterState
} from '../environment/h-earth.water-state.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState
} from '../environment/h-earth.atmosphere-state.js';

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
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) =>
        `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const digest = (value) => createHash('sha256').update(stable(value)).digest('hex');

function assertDeepFrozen(value, path = 'root', seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  check(Object.isFrozen(value), `NOT_FROZEN:${path}`);
  Object.entries(value).forEach(([key, nested]) =>
    assertDeepFrozen(nested, `${path}.${key}`, seen));
}

const atmosphere = sampleHEarthAtmosphereState({
  timeOfDayHours: 12,
  observerElevation: 4,
  viewDistance: 320
});
equal(atmosphere.valid, true, 'ATMOSPHERE_FIXTURE_INVALID');
equal(atmosphere.contractId, H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  'ATMOSPHERE_CONTRACT_MISMATCH');

const shorelineAt = (x) => getHEarthCanonicalShorelineZ(x);
const targetedFixtures = [
  { id: 'OPEN_WATER', x: 144, d: -90, expected: 'OPEN_COASTAL_WATER' },
  { id: 'SHALLOW_WATER', x: 48, d: -10, expected: 'SHALLOW_COASTAL_WATER' },
  { id: 'INTERTIDAL', x: 0, d: 1, expected: 'INTERTIDAL_SHORE' },
  { id: 'DUNE', x: -64, d: 25, expected: 'COASTAL_DUNE' }
].map((fixture) => ({
  ...fixture,
  z: shorelineAt(fixture.x) - fixture.d
}));

const firstTargeted = targetedFixtures.map((fixture) => ({
  fixture,
  sample: sampleHEarthBiomeField(fixture.x, fixture.z, {
    atmosphereState: atmosphere
  })
}));
const secondTargeted = targetedFixtures.map((fixture) => ({
  fixture,
  sample: sampleHEarthBiomeField(fixture.x, fixture.z, {
    atmosphereState: atmosphere
  })
}));
deepEqual(firstTargeted, secondTargeted,
  'TARGETED_BIOME_DETERMINISTIC_RERUN_MISMATCH');

const observedClasses = new Set();
const biomeSummaries = [];

for (const { fixture, sample } of firstTargeted) {
  equal(sample.valid, true, `TARGETED_BIOME_INVALID:${fixture.id}`);
  equal(sample.biomeClass, fixture.expected,
    `TARGETED_BIOME_CLASS_MISMATCH:${fixture.id}`);
  observedClasses.add(sample.biomeClass);
}

for (let z = -240; z <= -32; z += 16) {
  for (let x = -224; x <= 224; x += 16) {
    const sample = sampleHEarthBiomeField(x, z, {
      atmosphereState: atmosphere
    });
    if (sample.valid !== true) continue;
    observedClasses.add(sample.biomeClass);
    const evaluation = evaluateHEarthBiomeFieldSample(sample);
    equal(evaluation.eligible, true, `BIOME_EVALUATION_FAIL:${x}:${z}`);
    deepEqual(evaluation.issues, [], `BIOME_EVALUATION_ISSUES:${x}:${z}`);

    const terrain = sampleHEarthTerrainField(x, z);
    const surface = sampleHEarthSurfaceState(x, z);
    const water = sampleHEarthWaterState(x, z, {
      atmosphereState: atmosphere
    });
    equal(terrain.valid, true, `TERRAIN_INVALID:${x}:${z}`);
    equal(surface.valid, true, `SURFACE_INVALID:${x}:${z}`);
    equal(water.valid, true, `WATER_INVALID:${x}:${z}`);
    equal(sample.terrainElevation, terrain.elevation,
      `BIOME_TERRAIN_CORRESPONDENCE:${x}:${z}`);
    equal(sample.surfaceClass, surface.surfaceClass,
      `BIOME_SURFACE_CORRESPONDENCE:${x}:${z}`);
    equal(sample.waterClass, water.waterClass,
      `BIOME_WATER_CORRESPONDENCE:${x}:${z}`);
    equal(sample.semanticAddressId, surface.semanticAddressId,
      `BIOME_SEMANTIC_ADDRESS_CORRESPONDENCE:${x}:${z}`);
    equal(sample.chunkId, surface.chunkId,
      `BIOME_CHUNK_CORRESPONDENCE:${x}:${z}`);
    deepEqual(sample.formationIds, surface.formationIds,
      `BIOME_FORMATION_CORRESPONDENCE:${x}:${z}`);

    equal(sample.sourceIdentities.terrainFieldContractId,
      H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      `BIOME_TERRAIN_SOURCE_IDENTITY:${x}:${z}`);
    equal(sample.sourceIdentities.surfaceStateContractId,
      H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      `BIOME_SURFACE_SOURCE_IDENTITY:${x}:${z}`);
    equal(sample.sourceIdentities.waterStateContractId,
      H_EARTH_WATER_STATE_CONTRACT_ID,
      `BIOME_WATER_SOURCE_IDENTITY:${x}:${z}`);
    equal(sample.sourceIdentities.atmosphereStateContractId,
      H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      `BIOME_ATMOSPHERE_SOURCE_IDENTITY:${x}:${z}`);
    equal(sample.sourceIdentities.biomeFieldContractId,
      H_EARTH_BIOME_FIELD_CONTRACT_ID,
      `BIOME_SELF_SOURCE_IDENTITY:${x}:${z}`);
    equal(sample.correspondenceStatus, 'BIOME_UPSTREAM_CORRESPONDENCE_PASS',
      `BIOME_CORRESPONDENCE_STATUS:${x}:${z}`);
    deepEqual(sample.issues, [], `BIOME_SAMPLE_ISSUES:${x}:${z}`);

    for (const field of [
      'terrainElevation',
      'slope',
      'shorelineDistance',
      'ecologicalEligibility',
      'vegetationCapacity',
      'canopyCapacity',
      'groundCoverCapacity'
    ]) {
      check(finite(sample[field]), `BIOME_NONFINITE:${x}:${z}:${field}`);
    }
    for (const field of [
      'ecologicalEligibility',
      'vegetationCapacity',
      'canopyCapacity',
      'groundCoverCapacity'
    ]) {
      check(sample[field] >= 0 && sample[field] <= 1,
        `BIOME_RANGE:${x}:${z}:${field}`);
    }
    H_EARTH_BIOME_FIELD_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
      check(!Object.prototype.hasOwnProperty.call(sample, field),
        `FORBIDDEN_BIOME_OUTPUT:${x}:${z}:${field}`);
    });
    assertDeepFrozen(sample, `biome.${x}.${z}`);

    if (biomeSummaries.length < 64) {
      biomeSummaries.push({
        worldX: x,
        worldZ: z,
        biomeClass: sample.biomeClass,
        vegetationCapacity: sample.vegetationCapacity,
        ecologicalEligibility: sample.ecologicalEligibility,
        semanticAddressId: sample.semanticAddressId,
        chunkId: sample.chunkId
      });
    }
  }
}

for (const requiredClass of [
  'OPEN_COASTAL_WATER',
  'SHALLOW_COASTAL_WATER',
  'INTERTIDAL_SHORE',
  'COASTAL_DUNE',
  'LOWLAND_MEADOW',
  'COASTAL_GRASSLAND',
  'COASTAL_SHRUBLAND',
  'ROCKY_UPLAND'
]) {
  check(observedClasses.has(requiredClass),
    `REQUIRED_BIOME_CLASS_NOT_OBSERVED:${requiredClass}`);
}
check(observedClasses.size >= 8, 'BIOME_CLASS_DIVERSITY_BELOW_EIGHT');

const invalidBiomeInputs = [
  [Number.NaN, 0],
  [0, Number.POSITIVE_INFINITY]
];
invalidBiomeInputs.forEach(([x, z], index) => {
  const rejected = sampleHEarthBiomeField(x, z, {
    atmosphereState: atmosphere
  });
  equal(rejected.valid, false, `INVALID_BIOME_INPUT_ACCEPTED:${index}`);
});
const invalidAtmosphereBiome = sampleHEarthBiomeField(0, -160, {
  atmosphereState: { valid: false }
});
equal(invalidAtmosphereBiome.valid, false,
  'INVALID_ATMOSPHERE_BIOME_INPUT_ACCEPTED');

const biomeReceipt = getHEarthBiomeFieldReceipt();
equal(biomeReceipt.eligible, true, 'BIOME_RECEIPT_FAIL');
deepEqual(biomeReceipt.issues, [], 'BIOME_RECEIPT_ISSUES');
equal(H_EARTH_BIOME_FIELD.ownership.ownsPopulationInstances, false,
  'BIOME_POPULATION_AUTHORITY_LEAK');
equal(H_EARTH_BIOME_FIELD.ownership.ownsSpatialLifecycle, false,
  'BIOME_LIFECYCLE_AUTHORITY_LEAK');

const firstProof = buildHEarthRun7ESmallInstanceProof({
  atmosphereState: atmosphere
});
const secondProof = buildHEarthRun7ESmallInstanceProof({
  atmosphereState: atmosphere
});
deepEqual(firstProof, secondProof,
  'SMALL_INSTANCE_PROOF_DETERMINISTIC_RERUN_MISMATCH');

const proofEvaluation = evaluateHEarthPopulationPlan(firstProof);
equal(firstProof.eligible, true, 'SMALL_INSTANCE_PROOF_NOT_ELIGIBLE');
equal(proofEvaluation.eligible, true, 'SMALL_INSTANCE_PROOF_EVALUATION_FAIL');
deepEqual(proofEvaluation.issues, [], 'SMALL_INSTANCE_PROOF_EVALUATION_ISSUES');
equal(firstProof.contractId, H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  'POPULATION_PLANNER_CONTRACT_MISMATCH');
check(firstProof.instanceCount > 0, 'SMALL_INSTANCE_PROOF_EMPTY');
check(firstProof.instanceCount <=
  H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT.maxInstances,
  'SMALL_INSTANCE_PROOF_EXCEEDS_MAXIMUM');
check(firstProof.speciesCount > 0, 'SMALL_INSTANCE_SPECIES_EMPTY');
equal(firstProof.instances.length, firstProof.instanceCount,
  'SMALL_INSTANCE_COUNT_ARRAY_MISMATCH');
equal(firstProof.spatialLifecycleContext.authorityEstablished, false,
  'RUN_7E_IMPROPERLY_ESTABLISHED_SPATIAL_LIFECYCLE_AUTHORITY');
equal(firstProof.spatialLifecycleContext.provisional, true,
  'RUN_7E_PROOF_CONTEXT_NOT_PROVISIONAL');
equal(firstProof.spatialLifecycleAuthorityStatus,
  'PROVISIONAL_CONTEXT_RUN_7G_NOT_YET_ESTABLISHED',
  'RUN_7E_LIFECYCLE_STATUS_MISMATCH');
equal(firstProof.geometryCreated, false, 'POPULATION_GEOMETRY_CREATED');
equal(firstProof.rendererMutation, false, 'POPULATION_RENDERER_MUTATION');
equal(firstProof.publicRouteMutation, false, 'POPULATION_ROUTE_MUTATION');

const instanceIds = new Set();
for (const instance of firstProof.instances) {
  check(!instanceIds.has(instance.instanceId),
    `DUPLICATE_POPULATION_INSTANCE_ID:${instance.instanceId}`);
  instanceIds.add(instance.instanceId);
  check(typeof instance.speciesId === 'string' && instance.speciesId.length > 0,
    `POPULATION_SPECIES_ID_MISSING:${instance.instanceId}`);
  check(typeof instance.guild === 'string' && instance.guild.length > 0,
    `POPULATION_GUILD_MISSING:${instance.instanceId}`);
  check(finite(instance.world.x) && finite(instance.world.y) &&
    finite(instance.world.z),
  `POPULATION_WORLD_NONFINITE:${instance.instanceId}`);
  check(finite(instance.rotationY),
    `POPULATION_ROTATION_NONFINITE:${instance.instanceId}`);
  check(finite(instance.uniformScale) && instance.uniformScale > 0,
    `POPULATION_SCALE_INVALID:${instance.instanceId}`);
  equal(instance.sourceIdentities.biomeFieldContractId,
    H_EARTH_BIOME_FIELD_CONTRACT_ID,
    `POPULATION_BIOME_SOURCE_IDENTITY:${instance.instanceId}`);
  equal(instance.sourceIdentities.surfaceStateContractId,
    H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    `POPULATION_SURFACE_SOURCE_IDENTITY:${instance.instanceId}`);
  equal(instance.sourceIdentities.populationPlannerContractId,
    H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    `POPULATION_SELF_SOURCE_IDENTITY:${instance.instanceId}`);
  H_EARTH_POPULATION_PLANNER_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(instance, field),
      `FORBIDDEN_POPULATION_INSTANCE_OUTPUT:${instance.instanceId}:${field}`);
  });
  assertDeepFrozen(instance, `population.${instance.instanceId}`);
}
assertDeepFrozen(firstProof, 'smallInstanceProof');

const reducedContext = {
  ...H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT,
  contractId: 'H_EARTH_SPATIAL_LIFECYCLE_PROOF_CONTEXT_RUN_7E_REDUCED_ONLY',
  state: 'ACTIVE_REDUCED',
  densityScale: 1,
  maxInstances: 64
};
const reducedPlan = planHEarthPopulation({
  bounds: firstProof.bounds,
  sampleStep: firstProof.sampleStep,
  deterministicSeed: firstProof.deterministicSeed,
  atmosphereState: atmosphere,
  spatialLifecycleContext: reducedContext
});
equal(reducedPlan.eligible, true, 'REDUCED_POPULATION_PLAN_REJECTED');
check(reducedPlan.instanceCount <= firstProof.instanceCount,
  'REDUCED_POPULATION_EXCEEDS_DETAIL_POPULATION');

for (const state of ['DISTANT_PROXY', 'DORMANT', 'UNAVAILABLE']) {
  const heldPlan = planHEarthPopulation({
    bounds: firstProof.bounds,
    sampleStep: firstProof.sampleStep,
    deterministicSeed: firstProof.deterministicSeed,
    atmosphereState: atmosphere,
    spatialLifecycleContext: {
      contractId: `H_EARTH_SPATIAL_LIFECYCLE_PROOF_CONTEXT_RUN_7E_${state}`,
      state,
      densityScale: 1,
      maxInstances: 64,
      authorityEstablished: false,
      provisional: true
    }
  });
  equal(heldPlan.eligible, true, `HELD_POPULATION_PLAN_REJECTED:${state}`);
  equal(heldPlan.instanceCount, 0, `HELD_POPULATION_CREATED_INSTANCES:${state}`);
}

const invalidPlans = [
  planHEarthPopulation(),
  planHEarthPopulation({
    bounds: firstProof.bounds,
    spatialLifecycleContext: null
  }),
  planHEarthPopulation({
    bounds: { xMinimum: 1, xMaximum: 0, zMinimum: 0, zMaximum: 1 },
    spatialLifecycleContext: H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT
  }),
  planHEarthPopulation({
    bounds: firstProof.bounds,
    sampleStep: 0,
    spatialLifecycleContext: H_EARTH_RUN_7E_SMALL_INSTANCE_PROOF_CONTEXT
  })
];
invalidPlans.forEach((plan, index) => {
  equal(plan.eligible, false, `INVALID_POPULATION_PLAN_ACCEPTED:${index}`);
});

const plannerReceipt = getHEarthPopulationPlannerReceipt();
equal(plannerReceipt.eligible, true, 'POPULATION_PLANNER_RECEIPT_FAIL');
deepEqual(plannerReceipt.issues, [], 'POPULATION_PLANNER_RECEIPT_ISSUES');
check(plannerReceipt.speciesCatalogCount >= 12,
  'POPULATION_SPECIES_CATALOG_BELOW_MINIMUM');
equal(plannerReceipt.spatialLifecycleAuthorityEstablishedByRun7E, false,
  'PLANNER_RECEIPT_LIFECYCLE_AUTHORITY_LEAK');
equal(H_EARTH_POPULATION_PLANNER.ownership.ownsSpatialLifecycle, false,
  'POPULATION_PLANNER_LIFECYCLE_AUTHORITY_LEAK');
equal(H_EARTH_POPULATION_PLANNER.ownership.ownsGeometry, false,
  'POPULATION_PLANNER_GEOMETRY_AUTHORITY_LEAK');
check(Object.keys(H_EARTH_POPULATION_SPECIES_CATALOG).length >= 12,
  'SPECIES_CATALOG_INCOMPLETE');

const deterministicCore = {
  biomeFieldContractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
  populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  biomeFieldRevision: 1,
  populationPlanRevision: 1,
  observedBiomeClasses: [...observedClasses].sort(),
  biomeSummaries,
  smallInstanceProof: {
    deterministicSeed: firstProof.deterministicSeed,
    sampleCount: firstProof.sampleCount,
    candidateCount: firstProof.candidateCount,
    instanceCount: firstProof.instanceCount,
    speciesCount: firstProof.speciesCount,
    speciesCounts: firstProof.speciesCounts,
    instances: firstProof.instances
  },
  reducedInstanceCount: reducedPlan.instanceCount,
  forbiddenOutputsObserved: 0,
  spatialLifecycleAuthorityEstablished: false
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  smallInstanceProof: {
    deterministicSeed: secondProof.deterministicSeed,
    sampleCount: secondProof.sampleCount,
    candidateCount: secondProof.candidateCount,
    instanceCount: secondProof.instanceCount,
    speciesCount: secondProof.speciesCount,
    speciesCounts: secondProof.speciesCounts,
    instances: secondProof.instances
  }
});
equal(deterministicDigest, rerunDigest,
  'RUN_7E_DETERMINISTIC_DIGEST_RERUN_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_EXECUTION_CANDIDATE',
  biomeFieldContractId: H_EARTH_BIOME_FIELD_CONTRACT_ID,
  populationPlannerContractId: H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7E_BIOME_FIELD_POPULATION_PLANNER_AND_SMALL_INSTANCE_PROOF_PASS',
  runtime: process.version,
  observedBiomeClassCount: observedClasses.size,
  observedBiomeClasses: [...observedClasses].sort(),
  smallInstanceSampleCount: firstProof.sampleCount,
  smallInstanceCandidateCount: firstProof.candidateCount,
  smallInstanceCount: firstProof.instanceCount,
  smallInstanceSpeciesCount: firstProof.speciesCount,
  reducedInstanceCount: reducedPlan.instanceCount,
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  forbiddenOutputsObserved: 0,
  workspaceExecution: true,
  localConstruction: false,
  spatialLifecycleAuthorityEstablished: false,
  spatialLifecycleProofContextOnly: true,
  geometryMutation: false,
  rendererMutation: false,
  publicRouteMutation: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7E_EXECUTION_CANDIDATE ??
  'h-earth-run7e-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(execution, null, 2));
