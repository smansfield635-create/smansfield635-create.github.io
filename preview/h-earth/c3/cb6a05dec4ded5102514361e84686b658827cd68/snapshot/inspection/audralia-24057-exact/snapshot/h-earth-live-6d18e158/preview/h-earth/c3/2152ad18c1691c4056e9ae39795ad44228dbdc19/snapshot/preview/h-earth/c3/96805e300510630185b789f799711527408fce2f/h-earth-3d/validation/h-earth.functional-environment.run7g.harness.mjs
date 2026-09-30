import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  H_EARTH_SPATIAL_LIFECYCLE,
  H_EARTH_SPATIAL_LIFECYCLE_STATES,
  H_EARTH_SPATIAL_LIFECYCLE_VISIBILITY_CLASSES,
  H_EARTH_SPATIAL_LIFECYCLE_PROFILE,
  H_EARTH_SPATIAL_LIFECYCLE_FORBIDDEN_NATIVE_OUTPUTS,
  sampleHEarthSpatialLifecycle,
  projectHEarthSpatialLifecycleToPopulationContext,
  evaluateHEarthSpatialLifecycleSample,
  getHEarthSpatialLifecycleReceipt
} from '../environment/h-earth.spatial-lifecycle.js';

import {
  H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
  planHEarthPopulation,
  evaluateHEarthPopulationPlan
} from '../environment/h-earth.population-planner.js';

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

const observerWorld = Object.freeze({ x: 0, y: 0, z: 0 });
const sampleAtDistance = (distance, options = {}) => sampleHEarthSpatialLifecycle({
  subjectId: options.subjectId ?? `SUBJECT_${distance}_${options.previousState ?? 'INITIAL'}`,
  subjectWorld: { x: distance, y: 0, z: 0 },
  observerWorld,
  boundsRadius: options.boundsRadius ?? 0,
  previousState: options.previousState ?? null,
  visibilityClass: options.visibilityClass ?? 'VISIBLE',
  importance: options.importance ?? 0,
  memoryPressure: options.memoryPressure ?? 0
});

const fixedFixtures = [
  { id: 'DETAIL', distance: 32, expectedState: 'ACTIVE_DETAIL' },
  { id: 'REDUCED', distance: 120, expectedState: 'ACTIVE_REDUCED' },
  { id: 'SLEEPING', distance: 260, expectedState: 'SLEEPING' },
  { id: 'UNLOADED', distance: 420, expectedState: 'UNLOADED' }
];

const fixedFirst = fixedFixtures.map((fixture) => ({
  fixture,
  sample: sampleAtDistance(fixture.distance, { subjectId: fixture.id })
}));
const fixedSecond = fixedFixtures.map((fixture) => ({
  fixture,
  sample: sampleAtDistance(fixture.distance, { subjectId: fixture.id })
}));
deepEqual(fixedFirst, fixedSecond, 'FIXED_LIFECYCLE_DETERMINISM_FAILURE');

const observedStates = new Set();
const fixedSummaries = [];
for (const { fixture, sample } of fixedFirst) {
  equal(sample.valid, true, `FIXED_SAMPLE_INVALID:${fixture.id}`);
  equal(sample.contractId, H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    `FIXED_CONTRACT_MISMATCH:${fixture.id}`);
  equal(sample.state, fixture.expectedState, `FIXED_STATE_MISMATCH:${fixture.id}`);
  equal(sample.desiredState, fixture.expectedState,
    `FIXED_DESIRED_STATE_MISMATCH:${fixture.id}`);
  equal(sample.previousState, null, `FIXED_PREVIOUS_STATE_NOT_NULL:${fixture.id}`);
  equal(sample.transition.initialized, true, `FIXED_INITIALIZATION_MISSING:${fixture.id}`);
  equal(sample.transition.allowed, true, `FIXED_TRANSITION_NOT_ALLOWED:${fixture.id}`);
  equal(sample.nativeTruthOwnership, 'SPATIAL_LIFECYCLE_ONLY',
    `FIXED_OWNERSHIP_MISMATCH:${fixture.id}`);
  check(finite(sample.centerDistance) && finite(sample.edgeDistance) &&
    finite(sample.effectiveDistance), `FIXED_DISTANCE_INVALID:${fixture.id}`);
  check(sample.statePolicy.densityScale >= 0 && sample.statePolicy.densityScale <= 1,
    `FIXED_DENSITY_SCALE_INVALID:${fixture.id}`);
  check(Number.isInteger(sample.statePolicy.maxInstances) &&
    sample.statePolicy.maxInstances >= 0, `FIXED_MAX_INSTANCES_INVALID:${fixture.id}`);
  const evaluation = evaluateHEarthSpatialLifecycleSample(sample);
  equal(evaluation.eligible, true, `FIXED_EVALUATION_FAIL:${fixture.id}`);
  deepEqual(evaluation.issues, [], `FIXED_EVALUATION_ISSUES:${fixture.id}`);
  H_EARTH_SPATIAL_LIFECYCLE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FIXED_FORBIDDEN_OUTPUT:${fixture.id}:${field}`);
  });
  assertDeepFrozen(sample, `fixed.${fixture.id}`);
  observedStates.add(sample.state);
  fixedSummaries.push({
    fixtureId: fixture.id,
    distance: fixture.distance,
    state: sample.state,
    desiredState: sample.desiredState,
    densityScale: sample.statePolicy.densityScale,
    maxInstances: sample.statePolicy.maxInstances,
    residencyClass: sample.statePolicy.residencyClass,
    updateIntervalFrames: sample.statePolicy.updateIntervalFrames
  });
}

equal(H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  'H_EARTH_CANONICAL_SPATIAL_LIFECYCLE_RUN_7G_v1',
  'LIFECYCLE_CONTRACT_ID_MISMATCH');
deepEqual(H_EARTH_SPATIAL_LIFECYCLE_STATES,
  ['ACTIVE_DETAIL', 'ACTIVE_REDUCED', 'SLEEPING', 'UNLOADED'],
  'LIFECYCLE_STATE_SET_MISMATCH');
equal(H_EARTH_SPATIAL_LIFECYCLE_PROFILE.referenceTier,
  'SAMSUNG_GALAXY_PHONE_PRIMARY_PERFORMANCE_TIER',
  'REFERENCE_PERFORMANCE_TIER_MISMATCH');

for (const visibilityClass of H_EARTH_SPATIAL_LIFECYCLE_VISIBILITY_CLASSES) {
  const sample = sampleAtDistance(64, { visibilityClass, subjectId: `VIS_${visibilityClass}` });
  equal(sample.valid, true, `VISIBILITY_SAMPLE_INVALID:${visibilityClass}`);
  equal(sample.visibilityClass, visibilityClass, `VISIBILITY_CLASS_MISMATCH:${visibilityClass}`);
}

const directAt80 = sampleAtDistance(80, { subjectId: 'DIRECT_80' });
const retainedDetailAt80 = sampleAtDistance(80, {
  subjectId: 'RETAINED_DETAIL_80',
  previousState: 'ACTIVE_DETAIL'
});
equal(directAt80.state, 'ACTIVE_REDUCED', 'DIRECT_80_NOT_REDUCED');
equal(retainedDetailAt80.state, 'ACTIVE_DETAIL', 'DETAIL_HYSTERESIS_NOT_RETAINED');

const directAt165 = sampleAtDistance(165, { subjectId: 'DIRECT_165' });
const retainedSleepingAt165 = sampleAtDistance(165, {
  subjectId: 'RETAINED_SLEEPING_165',
  previousState: 'SLEEPING'
});
equal(directAt165.state, 'ACTIVE_REDUCED', 'DIRECT_165_NOT_REDUCED');
equal(retainedSleepingAt165.state, 'SLEEPING', 'SLEEPING_HYSTERESIS_NOT_RETAINED');

const directAt320 = sampleAtDistance(320, { subjectId: 'DIRECT_320' });
const retainedUnloadedAt320 = sampleAtDistance(320, {
  subjectId: 'RETAINED_UNLOADED_320',
  previousState: 'UNLOADED'
});
equal(directAt320.state, 'SLEEPING', 'DIRECT_320_NOT_SLEEPING');
equal(retainedUnloadedAt320.state, 'UNLOADED', 'UNLOADED_HYSTERESIS_NOT_RETAINED');

const visible60 = sampleAtDistance(60, { subjectId: 'VISIBLE_60' });
const outOfView60 = sampleAtDistance(60, {
  subjectId: 'OUT_OF_VIEW_60',
  visibilityClass: 'OUT_OF_VIEW'
});
equal(visible60.state, 'ACTIVE_DETAIL', 'VISIBLE_60_NOT_DETAIL');
equal(outOfView60.state, 'ACTIVE_REDUCED', 'OUT_OF_VIEW_PENALTY_NOT_APPLIED');
check(outOfView60.effectiveDistance > visible60.effectiveDistance,
  'OUT_OF_VIEW_EFFECTIVE_DISTANCE_NOT_GREATER');

const normal95 = sampleAtDistance(95, { subjectId: 'NORMAL_95' });
const important95 = sampleAtDistance(95, {
  subjectId: 'IMPORTANT_95',
  importance: 1
});
equal(normal95.state, 'ACTIVE_REDUCED', 'NORMAL_95_NOT_REDUCED');
equal(important95.state, 'ACTIVE_DETAIL', 'IMPORTANCE_CREDIT_NOT_APPLIED');
check(important95.effectiveDistance < normal95.effectiveDistance,
  'IMPORTANCE_EFFECTIVE_DISTANCE_NOT_REDUCED');

const normal60 = sampleAtDistance(60, { subjectId: 'NORMAL_60' });
const pressured60 = sampleAtDistance(60, {
  subjectId: 'PRESSURED_60',
  memoryPressure: 0.5
});
equal(normal60.state, 'ACTIVE_DETAIL', 'NORMAL_60_NOT_DETAIL');
equal(pressured60.state, 'ACTIVE_REDUCED', 'MEMORY_PRESSURE_NOT_APPLIED');
check(pressured60.effectiveDistance > normal60.effectiveDistance,
  'MEMORY_PRESSURE_EFFECTIVE_DISTANCE_NOT_INCREASED');

const outwardSequence = [];
let priorState = 'ACTIVE_DETAIL';
for (let step = 0; step < 3; step += 1) {
  const sample = sampleAtDistance(520, {
    subjectId: `OUTWARD_${step}`,
    previousState: priorState
  });
  outwardSequence.push(sample);
  priorState = sample.state;
}
deepEqual(outwardSequence.map((sample) => sample.state),
  ['ACTIVE_REDUCED', 'SLEEPING', 'UNLOADED'],
  'OUTWARD_TRANSITION_SEQUENCE_MISMATCH');
outwardSequence.forEach((sample, index) => {
  equal(sample.transition.allowed, true, `OUTWARD_TRANSITION_NOT_ALLOWED:${index}`);
  equal(sample.transition.changed, true, `OUTWARD_TRANSITION_NOT_CHANGED:${index}`);
  check(sample.transition.transitionDistance <= 1,
    `OUTWARD_NONADJACENT_TRANSITION:${index}`);
});

const inwardSequence = [];
priorState = 'UNLOADED';
for (let step = 0; step < 3; step += 1) {
  const sample = sampleAtDistance(20, {
    subjectId: `INWARD_${step}`,
    previousState: priorState
  });
  inwardSequence.push(sample);
  priorState = sample.state;
}
deepEqual(inwardSequence.map((sample) => sample.state),
  ['SLEEPING', 'ACTIVE_REDUCED', 'ACTIVE_DETAIL'],
  'INWARD_TRANSITION_SEQUENCE_MISMATCH');
inwardSequence.forEach((sample, index) => {
  equal(sample.transition.allowed, true, `INWARD_TRANSITION_NOT_ALLOWED:${index}`);
  equal(sample.transition.changed, true, `INWARD_TRANSITION_NOT_CHANGED:${index}`);
  check(sample.transition.transitionDistance <= 1,
    `INWARD_NONADJACENT_TRANSITION:${index}`);
});

const distanceSweep = [];
for (let distance = 0; distance <= 520; distance += 4) {
  distanceSweep.push(sampleAtDistance(distance, {
    subjectId: `SWEEP_${distance}`
  }));
}
const distanceSweepRerun = [];
for (let distance = 0; distance <= 520; distance += 4) {
  distanceSweepRerun.push(sampleAtDistance(distance, {
    subjectId: `SWEEP_${distance}`
  }));
}
deepEqual(distanceSweep, distanceSweepRerun, 'DISTANCE_SWEEP_DETERMINISM_FAILURE');
const stateCounts = new Map();
distanceSweep.forEach((sample, index) => {
  equal(sample.valid, true, `SWEEP_SAMPLE_INVALID:${index}`);
  const evaluation = evaluateHEarthSpatialLifecycleSample(sample);
  equal(evaluation.eligible, true, `SWEEP_EVALUATION_FAIL:${index}`);
  observedStates.add(sample.state);
  stateCounts.set(sample.state, (stateCounts.get(sample.state) ?? 0) + 1);
  check(finite(sample.effectiveDistance), `SWEEP_DISTANCE_NONFINITE:${index}`);
  if (index % 13 === 0) assertDeepFrozen(sample, `sweep.${index}`);
});

for (const state of H_EARTH_SPATIAL_LIFECYCLE_STATES) {
  check(observedStates.has(state), `REQUIRED_LIFECYCLE_STATE_NOT_OBSERVED:${state}`);
}

const transitionTargets = [32, 120, 260, 420];
const transitionMatrix = [];
for (const previousState of H_EARTH_SPATIAL_LIFECYCLE_STATES) {
  for (const targetDistance of transitionTargets) {
    const sample = sampleAtDistance(targetDistance, {
      subjectId: `MATRIX_${previousState}_${targetDistance}`,
      previousState
    });
    equal(sample.valid, true, `MATRIX_SAMPLE_INVALID:${previousState}:${targetDistance}`);
    equal(sample.transition.allowed, true,
      `MATRIX_TRANSITION_NOT_ALLOWED:${previousState}:${targetDistance}`);
    check(sample.transition.transitionDistance <= 1,
      `MATRIX_NONADJACENT_TRANSITION:${previousState}:${targetDistance}`);
    transitionMatrix.push({
      previousState,
      targetDistance,
      desiredState: sample.desiredState,
      state: sample.state,
      stepwise: sample.transition.stepwise
    });
  }
}

for (const [index, input] of [
  {},
  { subjectId: 'BAD', subjectWorld: { x: 0, y: 0, z: 0 } },
  { subjectId: 'BAD', subjectWorld: { x: 0, y: 0, z: 0 }, observerWorld, boundsRadius: -1 },
  { subjectId: 'BAD', subjectWorld: { x: Number.NaN, y: 0, z: 0 }, observerWorld },
  { subjectId: 'BAD', subjectWorld: { x: 0, y: 0, z: 0 }, observerWorld, previousState: 'INVALID' },
  { subjectId: 'BAD', subjectWorld: { x: 0, y: 0, z: 0 }, observerWorld, memoryPressure: 2 }
].entries()) {
  const rejected = sampleHEarthSpatialLifecycle(input);
  equal(rejected.valid, false, `INVALID_INPUT_ACCEPTED:${index}`);
  equal(rejected.status, 'SPATIAL_LIFECYCLE_REJECTED_INVALID_INPUT',
    `INVALID_INPUT_STATUS:${index}`);
}

const contexts = Object.fromEntries(fixedFirst.map(({ fixture, sample }) => [
  fixture.expectedState,
  projectHEarthSpatialLifecycleToPopulationContext(sample)
]));
for (const state of H_EARTH_SPATIAL_LIFECYCLE_STATES) {
  const context = contexts[state];
  equal(context.contractId, H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    `POPULATION_CONTEXT_CONTRACT:${state}`);
  equal(context.authorityEstablished, true,
    `POPULATION_CONTEXT_AUTHORITY_NOT_ESTABLISHED:${state}`);
  equal(context.provisional, false, `POPULATION_CONTEXT_PROVISIONAL:${state}`);
  equal(context.canonicalState, state, `POPULATION_CONTEXT_CANONICAL_STATE:${state}`);
  assertDeepFrozen(context, `populationContext.${state}`);
}
equal(contexts.ACTIVE_DETAIL.state, 'ACTIVE_DETAIL', 'DETAIL_CONTEXT_STATE_MISMATCH');
equal(contexts.ACTIVE_REDUCED.state, 'ACTIVE_REDUCED', 'REDUCED_CONTEXT_STATE_MISMATCH');
equal(contexts.SLEEPING.state, 'DORMANT', 'SLEEPING_CONTEXT_STATE_MISMATCH');
equal(contexts.UNLOADED.state, 'UNAVAILABLE', 'UNLOADED_CONTEXT_STATE_MISMATCH');

const populationBounds = {
  xMinimum: -160,
  xMaximum: 160,
  zMinimum: -224,
  zMaximum: -32
};
const populationPlans = Object.fromEntries(H_EARTH_SPATIAL_LIFECYCLE_STATES.map((state) => [
  state,
  planHEarthPopulation({
    bounds: populationBounds,
    sampleStep: 24,
    deterministicSeed: 'H_EARTH_RUN_7G_POPULATION_LIFECYCLE_PROOF_v1',
    spatialLifecycleContext: contexts[state]
  })
]));
const populationPlansRerun = Object.fromEntries(H_EARTH_SPATIAL_LIFECYCLE_STATES.map((state) => [
  state,
  planHEarthPopulation({
    bounds: populationBounds,
    sampleStep: 24,
    deterministicSeed: 'H_EARTH_RUN_7G_POPULATION_LIFECYCLE_PROOF_v1',
    spatialLifecycleContext: contexts[state]
  })
]));
deepEqual(populationPlans, populationPlansRerun,
  'POPULATION_LIFECYCLE_PLAN_DETERMINISM_FAILURE');

for (const state of H_EARTH_SPATIAL_LIFECYCLE_STATES) {
  const plan = populationPlans[state];
  equal(plan.eligible, true, `POPULATION_PLAN_NOT_ELIGIBLE:${state}`);
  equal(plan.contractId, H_EARTH_POPULATION_PLANNER_CONTRACT_ID,
    `POPULATION_PLAN_CONTRACT_MISMATCH:${state}`);
  equal(evaluateHEarthPopulationPlan(plan).eligible, true,
    `POPULATION_PLAN_EVALUATION_FAIL:${state}`);
  equal(plan.spatialLifecycleContext.contractId,
    H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    `POPULATION_PLAN_LIFECYCLE_IDENTITY:${state}`);
  equal(plan.spatialLifecycleContext.authorityEstablished, true,
    `POPULATION_PLAN_LIFECYCLE_AUTHORITY:${state}`);
  equal(plan.spatialLifecycleContext.provisional, false,
    `POPULATION_PLAN_PROVISIONAL_CONTEXT:${state}`);
}
check(populationPlans.ACTIVE_DETAIL.instanceCount > 0,
  'DETAIL_POPULATION_INSTANCE_COUNT_ZERO');
check(populationPlans.ACTIVE_REDUCED.instanceCount > 0,
  'REDUCED_POPULATION_INSTANCE_COUNT_ZERO');
check(populationPlans.ACTIVE_DETAIL.instanceCount >
  populationPlans.ACTIVE_REDUCED.instanceCount,
  'DETAIL_POPULATION_NOT_GREATER_THAN_REDUCED');
equal(populationPlans.SLEEPING.instanceCount, 0,
  'SLEEPING_POPULATION_INSTANCE_COUNT_NONZERO');
equal(populationPlans.UNLOADED.instanceCount, 0,
  'UNLOADED_POPULATION_INSTANCE_COUNT_NONZERO');

const sourceReceipt = getHEarthSpatialLifecycleReceipt();
equal(sourceReceipt.eligible, true, 'SPATIAL_LIFECYCLE_SOURCE_RECEIPT_FAIL');
deepEqual(sourceReceipt.issues, [], 'SPATIAL_LIFECYCLE_SOURCE_RECEIPT_ISSUES');
equal(sourceReceipt.ownsLifecycleClassification, true,
  'LIFECYCLE_CLASSIFICATION_AUTHORITY_MISSING');
equal(sourceReceipt.ownsLifecycleStateTransition, true,
  'LIFECYCLE_TRANSITION_AUTHORITY_MISSING');
equal(sourceReceipt.ownsPopulationPlanning, false,
  'LIFECYCLE_POPULATION_AUTHORITY_LEAK');
equal(sourceReceipt.ownsGeometry, false, 'LIFECYCLE_GEOMETRY_AUTHORITY_LEAK');
equal(sourceReceipt.ownsNavigation, false, 'LIFECYCLE_NAVIGATION_AUTHORITY_LEAK');
equal(sourceReceipt.ownsRenderer, false, 'LIFECYCLE_RENDERER_AUTHORITY_LEAK');

for (const [key, expected] of Object.entries({
  ownsLifecycleClassification: true,
  ownsLifecycleStateTransition: true,
  ownsResidencyPolicy: true,
  ownsUpdateCadence: true,
  ownsDensityBudget: true,
  ownsInstanceCountBudget: true,
  ownsObserverOrCameraTruth: false,
  ownsPopulationPlanning: false,
  ownsPopulationIdentity: false,
  ownsTerrainTruth: false,
  ownsSurfaceState: false,
  ownsWaterState: false,
  ownsBiome: false,
  ownsTraversal: false,
  ownsAmbientAudioProjection: false,
  ownsGeometry: false,
  ownsNavigation: false,
  ownsRenderer: false,
  ownsPublicRoute: false,
  ownsDeployment: false
})) {
  equal(H_EARTH_SPATIAL_LIFECYCLE.ownership[key], expected,
    `LIFECYCLE_OWNERSHIP_DECLARATION:${key}`);
}

const deterministicCore = {
  contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  profileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId,
  states: H_EARTH_SPATIAL_LIFECYCLE_STATES,
  fixedSummaries,
  stateCounts: Object.fromEntries([...stateCounts.entries()].sort()),
  transitionMatrix,
  outwardSequence: outwardSequence.map((sample) => sample.state),
  inwardSequence: inwardSequence.map((sample) => sample.state),
  populationCounts: Object.fromEntries(H_EARTH_SPATIAL_LIFECYCLE_STATES.map((state) => [
    state,
    populationPlans[state].instanceCount
  ])),
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  fixedSummaries: fixedSecond.map(({ fixture, sample }) => ({
    fixtureId: fixture.id,
    distance: fixture.distance,
    state: sample.state,
    desiredState: sample.desiredState,
    densityScale: sample.statePolicy.densityScale,
    maxInstances: sample.statePolicy.maxInstances,
    residencyClass: sample.statePolicy.residencyClass,
    updateIntervalFrames: sample.statePolicy.updateIntervalFrames
  })),
  populationCounts: Object.fromEntries(H_EARTH_SPATIAL_LIFECYCLE_STATES.map((state) => [
    state,
    populationPlansRerun[state].instanceCount
  ]))
});
equal(deterministicDigest, rerunDigest, 'SPATIAL_LIFECYCLE_DETERMINISTIC_DIGEST_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7G_EXECUTION_CANDIDATE',
  contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7G_SPATIAL_LIFECYCLE_PASS',
  runtime: process.version,
  fixedFixtureCount: fixedFixtures.length,
  distanceSweepSampleCount: distanceSweep.length,
  transitionMatrixSampleCount: transitionMatrix.length,
  outwardTransitionCount: outwardSequence.length,
  inwardTransitionCount: inwardSequence.length,
  observedLifecycleStateCount: observedStates.size,
  observedLifecycleStates: [...observedStates].sort(),
  lifecycleStateCounts: Object.fromEntries([...stateCounts.entries()].sort()),
  activeDetailPopulationInstanceCount: populationPlans.ACTIVE_DETAIL.instanceCount,
  activeReducedPopulationInstanceCount: populationPlans.ACTIVE_REDUCED.instanceCount,
  sleepingPopulationInstanceCount: populationPlans.SLEEPING.instanceCount,
  unloadedPopulationInstanceCount: populationPlans.UNLOADED.instanceCount,
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  forbiddenOutputsObserved: 0,
  workspaceExecution: true,
  localConstruction: false,
  populationPlannerMutation: false,
  cameraMutation: false,
  terrainMutation: false,
  surfaceStateMutation: false,
  waterStateMutation: false,
  biomeMutation: false,
  traversalMutation: false,
  geometryMutation: false,
  navigationMutation: false,
  rendererMutation: false,
  publicRouteMutation: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7G_EXECUTION_CANDIDATE ??
  'h-earth-run7g-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(execution, null, 2));
