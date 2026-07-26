import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  H_EARTH_TRAVERSAL_SURFACE,
  H_EARTH_TRAVERSAL_CLASSES,
  H_EARTH_MOVEMENT_MODES,
  H_EARTH_PASSABILITY_STATES,
  H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS,
  sampleHEarthTraversalSurface,
  evaluateHEarthTraversalSurfaceSample,
  getHEarthTraversalSurfaceReceipt
} from '../environment/h-earth.traversal-surface.js';

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

const hazardFields = [
  'slopeHazard',
  'footingHazard',
  'slipHazard',
  'stepHazard',
  'fallHazard',
  'waterHazard'
];

function validateTraversalSample(sample, label, { deepFrozen = false } = {}) {
  equal(sample.valid, true, `SAMPLE_INVALID:${label}`);
  equal(sample.contractId, H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    `CONTRACT_MISMATCH:${label}`);
  check(H_EARTH_TRAVERSAL_CLASSES.includes(sample.traversalClass),
    `CLASS_INVALID:${label}`);
  check(H_EARTH_MOVEMENT_MODES.includes(sample.movementMode),
    `MOVEMENT_MODE_INVALID:${label}`);
  check(H_EARTH_PASSABILITY_STATES.includes(sample.passability),
    `PASSABILITY_INVALID:${label}`);
  const evaluation = evaluateHEarthTraversalSurfaceSample(sample);
  equal(evaluation.eligible, true, `EVALUATION_FAIL:${label}`);
  deepEqual(evaluation.issues, [], `EVALUATION_ISSUES:${label}`);
  check(finite(sample.movementCost) && sample.movementCost >= 1 && sample.movementCost <= 100,
    `MOVEMENT_COST_RANGE:${label}`);
  check(finite(sample.speedMultiplier) && sample.speedMultiplier >= 0 && sample.speedMultiplier <= 1,
    `SPEED_MULTIPLIER_RANGE:${label}`);
  check(finite(sample.maximumRecommendedStepHeight) &&
    sample.maximumRecommendedStepHeight >= 0 &&
    sample.maximumRecommendedStepHeight <= 0.48,
  `STEP_HEIGHT_RANGE:${label}`);
  hazardFields.forEach((field) => {
    check(finite(sample[field]) && sample[field] >= 0 && sample[field] <= 1,
      `HAZARD_RANGE:${label}:${field}`);
  });
  H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FORBIDDEN_OUTPUT:${label}:${field}`);
  });
  equal(sample.correspondenceStatus, 'TRAVERSAL_UPSTREAM_CORRESPONDENCE_PASS',
    `CORRESPONDENCE_STATUS:${label}`);
  equal(sample.nativeTruthOwnership, 'TRAVERSAL_ONLY',
    `OWNERSHIP_STATUS:${label}`);
  equal(sample.sourceIdentities.terrainFieldContractId,
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    `TERRAIN_SOURCE_IDENTITY:${label}`);
  equal(sample.sourceIdentities.surfaceStateContractId,
    H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    `SURFACE_SOURCE_IDENTITY:${label}`);
  equal(sample.sourceIdentities.waterStateContractId,
    H_EARTH_WATER_STATE_CONTRACT_ID,
    `WATER_SOURCE_IDENTITY:${label}`);
  if (sample.passable === false) {
    equal(sample.passability, 'BLOCKED', `BLOCKED_PASSABILITY:${label}`);
    equal(sample.speedMultiplier, 0, `BLOCKED_SPEED:${label}`);
    equal(sample.movementCost, 100, `BLOCKED_COST:${label}`);
  } else {
    check(sample.passability !== 'BLOCKED', `PASSABLE_MARKED_BLOCKED:${label}`);
    check(sample.speedMultiplier > 0, `PASSABLE_ZERO_SPEED:${label}`);
  }
  if (deepFrozen) assertDeepFrozen(sample, label);
}

const shorelineAt = (x) => getHEarthCanonicalShorelineZ(x);
const fixedFixtures = [
  { id: 'OPEN_WATER_BLOCKED', x: 0, d: -90, expected: 'DEEP_WATER_BLOCKED' },
  { id: 'NEARSHORE_BLOCKED', x: 48, d: -35, expected: 'DEEP_WATER_BLOCKED' },
  { id: 'SHALLOW_WADE', x: -48, d: -10, expected: 'SHALLOW_WADE' },
  { id: 'SHORELINE_TRANSITION', x: 96, d: -1, expected: 'SHORELINE_TRANSITION' },
  { id: 'WET_SAND_SOFT', x: -96, d: 6, expected: 'SOFT_GROUND' },
  { id: 'DRY_SAND_SOFT', x: 144, d: 24, expected: 'SOFT_GROUND' }
].map((entry) => ({
  ...entry,
  z: shorelineAt(entry.x) - entry.d
}));

const fixedFirst = fixedFixtures.map((entry) => ({
  fixture: entry,
  sample: sampleHEarthTraversalSurface(entry.x, entry.z)
}));
const fixedSecond = fixedFixtures.map((entry) => ({
  fixture: entry,
  sample: sampleHEarthTraversalSurface(entry.x, entry.z)
}));
deepEqual(fixedFirst, fixedSecond, 'FIXED_FIXTURE_DETERMINISM_FAILURE');

const observedClasses = new Set();
const fixedSummaries = [];
for (const { fixture, sample } of fixedFirst) {
  validateTraversalSample(sample, `fixed.${fixture.id}`, { deepFrozen: true });
  equal(sample.traversalClass, fixture.expected,
    `FIXED_CLASS_MISMATCH:${fixture.id}`);
  const terrain = sampleHEarthTerrainField(fixture.x, fixture.z);
  const surface = sampleHEarthSurfaceState(fixture.x, fixture.z);
  const water = sampleHEarthWaterState(fixture.x, fixture.z);
  equal(sample.world.y, terrain.elevation,
    `WORLD_Y_CORRESPONDENCE:${fixture.id}`);
  equal(sample.semanticAddressId, surface.semanticAddressId,
    `SEMANTIC_CORRESPONDENCE:${fixture.id}`);
  equal(sample.chunkId, surface.chunkId,
    `CHUNK_CORRESPONDENCE:${fixture.id}`);
  deepEqual(sample.formationIds, surface.formationIds,
    `FORMATION_CORRESPONDENCE:${fixture.id}`);
  equal(sample.consumedContext.terrainSlope, terrain.slope,
    `SLOPE_CORRESPONDENCE:${fixture.id}`);
  equal(sample.consumedContext.surfaceStateClass, surface.surfaceClass,
    `SURFACE_CLASS_CORRESPONDENCE:${fixture.id}`);
  equal(sample.consumedContext.waterStateClass, water.waterClass,
    `WATER_CLASS_CORRESPONDENCE:${fixture.id}`);
  equal(sample.consumedContext.waterStateDepth, water.depth,
    `WATER_DEPTH_CORRESPONDENCE:${fixture.id}`);
  observedClasses.add(sample.traversalClass);
  fixedSummaries.push({
    fixtureId: fixture.id,
    traversalClass: sample.traversalClass,
    passability: sample.passability,
    movementMode: sample.movementMode,
    movementCost: sample.movementCost,
    hazards: Object.fromEntries(hazardFields.map((field) => [field, sample[field]]))
  });
}

// The scan is derived from accepted upstream samples. Coordinates outside the
// physical chunk/semantic domain are excluded rather than treated as traversal
// failures, because Run 7F consumes but does not expand that upstream domain.
const candidateCoordinates = [];
for (let x = -240; x <= 240; x += 16) {
  for (let z = -248; z <= 16; z += 16) candidateCoordinates.push({ x, z });
}
const scanCoordinates = candidateCoordinates.filter(({ x, z }) => {
  const surface = sampleHEarthSurfaceState(x, z);
  const water = sampleHEarthWaterState(x, z);
  return surface.valid === true && water.valid === true;
});
check(scanCoordinates.length >= 300, 'AUTHORIZED_DOMAIN_SCAN_TOO_SMALL');
check(scanCoordinates.length < candidateCoordinates.length,
  'UPSTREAM_DOMAIN_FILTER_DID_NOT_EXCLUDE_ANY_COORDINATES');

const scanFirst = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
const scanSecond = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
deepEqual(scanFirst, scanSecond, 'DOMAIN_SCAN_DETERMINISM_FAILURE');

const classCounts = new Map();
const scanSummaries = [];
scanFirst.forEach((sample, index) => {
  const coordinate = scanCoordinates[index];
  validateTraversalSample(sample, `scan.${coordinate.x}.${coordinate.z}`, {
    deepFrozen: index % 47 === 0
  });
  observedClasses.add(sample.traversalClass);
  classCounts.set(sample.traversalClass,
    (classCounts.get(sample.traversalClass) ?? 0) + 1);
  scanSummaries.push({
    x: coordinate.x,
    z: coordinate.z,
    traversalClass: sample.traversalClass,
    passable: sample.passable,
    movementCost: sample.movementCost,
    slopeHazard: sample.slopeHazard,
    fallHazard: sample.fallHazard,
    waterHazard: sample.waterHazard
  });
});

const expectedObservedClasses = [
  'STABLE_GROUND',
  'SOFT_GROUND',
  'ROCKY_UNEVEN_GROUND',
  'STEEP_GROUND_CAUTION',
  'SHORELINE_TRANSITION',
  'SHALLOW_WADE',
  'DEEP_WATER_BLOCKED'
];
expectedObservedClasses.forEach((traversalClass) => {
  check(observedClasses.has(traversalClass),
    `REQUIRED_OBSERVED_CLASS_MISSING:${traversalClass}`);
});
equal(observedClasses.size, 7, 'OBSERVED_TRAVERSAL_CLASS_COUNT');
const unobservedDeclaredClasses = H_EARTH_TRAVERSAL_CLASSES
  .filter((traversalClass) => !observedClasses.has(traversalClass));
deepEqual(unobservedDeclaredClasses, ['STEEP_SLOPE_BLOCKED'],
  'UNOBSERVED_DECLARED_CLASS_SET_MISMATCH');

const waterwardProfileDistances = [24, 6, -1, -10, -35, -90];
const waterwardProfile = waterwardProfileDistances.map((shorelineDistance) => {
  const x = 0;
  const z = shorelineAt(x) - shorelineDistance;
  return sampleHEarthTraversalSurface(x, z);
});
deepEqual(waterwardProfile.map((sample) => sample.traversalClass), [
  'SOFT_GROUND',
  'SOFT_GROUND',
  'SHORELINE_TRANSITION',
  'SHALLOW_WADE',
  'DEEP_WATER_BLOCKED',
  'DEEP_WATER_BLOCKED'
], 'WATERWARD_PROFILE_CLASS_SEQUENCE');
check(waterwardProfile[3].waterHazard > waterwardProfile[2].waterHazard,
  'SHALLOW_WATER_HAZARD_NOT_GREATER_THAN_CONTACT');
check(waterwardProfile[4].waterHazard >= waterwardProfile[3].waterHazard,
  'NEARSHORE_HAZARD_NOT_GREATER_THAN_SHALLOW');

const suppliedX = -32;
const suppliedZ = -150;
const correspondingWater = sampleHEarthWaterState(suppliedX, suppliedZ);
const suppliedTraversal = sampleHEarthTraversalSurface(suppliedX, suppliedZ, {
  waterState: correspondingWater
});
equal(suppliedTraversal.valid, true, 'CORRESPONDING_SUPPLIED_WATER_REJECTED');
const mismatchedWater = sampleHEarthWaterState(suppliedX + 24, suppliedZ);
const mismatchTraversal = sampleHEarthTraversalSurface(suppliedX, suppliedZ, {
  waterState: mismatchedWater
});
equal(mismatchTraversal.valid, false, 'MISMATCHED_SUPPLIED_WATER_ACCEPTED');
check(mismatchTraversal.issues.includes('WATER_STATE_NOT_ELIGIBLE_OR_NOT_CORRESPONDING'),
  'MISMATCHED_SUPPLIED_WATER_ISSUE_MISSING');

for (const [index, args] of [
  [Number.NaN, 0],
  [0, Number.POSITIVE_INFINITY],
  ['0', 0]
].entries()) {
  const rejected = sampleHEarthTraversalSurface(args[0], args[1]);
  equal(rejected.valid, false, `INVALID_COORDINATE_ACCEPTED:${index}`);
  equal(rejected.status, 'TRAVERSAL_SURFACE_REJECTED_INVALID_INPUT',
    `INVALID_COORDINATE_STATUS:${index}`);
}

const sourceReceipt = getHEarthTraversalSurfaceReceipt();
equal(sourceReceipt.eligible, true, 'TRAVERSAL_SOURCE_RECEIPT_FAIL');
deepEqual(sourceReceipt.issues, [], 'TRAVERSAL_SOURCE_RECEIPT_ISSUES');
for (const [key, expected] of Object.entries({
  ownsMovementClassification: true,
  ownsMovementCost: true,
  ownsPassability: true,
  ownsFootingHazard: true,
  ownsSlipHazard: true,
  ownsStepHazard: true,
  ownsFallHazard: true,
  ownsWaterTraversalHazard: true,
  ownsTerrainTruth: false,
  ownsSurfaceState: false,
  ownsWaterState: false,
  ownsBiome: false,
  ownsPopulation: false,
  ownsAmbientAudioProjection: false,
  ownsSpatialLifecycle: false,
  ownsGeometry: false,
  ownsNavigation: false,
  ownsRenderer: false,
  ownsPublicRoute: false
})) {
  equal(H_EARTH_TRAVERSAL_SURFACE.ownership[key], expected,
    `TRAVERSAL_OWNERSHIP_DECLARATION:${key}`);
}

const deterministicCore = {
  contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  traversalSurfaceRevision: 1,
  traversalClasses: H_EARTH_TRAVERSAL_CLASSES,
  fixedSummaries,
  scanSummaries,
  classCounts: Object.fromEntries([...classCounts.entries()].sort()),
  observedClasses: [...observedClasses].sort(),
  unobservedDeclaredClasses,
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  fixedSummaries: fixedSecond.map(({ fixture, sample }) => ({
    fixtureId: fixture.id,
    traversalClass: sample.traversalClass,
    passability: sample.passability,
    movementMode: sample.movementMode,
    movementCost: sample.movementCost,
    hazards: Object.fromEntries(hazardFields.map((field) => [field, sample[field]]))
  })),
  scanSummaries: scanSecond.map((sample, index) => ({
    x: scanCoordinates[index].x,
    z: scanCoordinates[index].z,
    traversalClass: sample.traversalClass,
    passable: sample.passable,
    movementCost: sample.movementCost,
    slopeHazard: sample.slopeHazard,
    fallHazard: sample.fallHazard,
    waterHazard: sample.waterHazard
  }))
});
equal(deterministicDigest, rerunDigest,
  'TRAVERSAL_DETERMINISTIC_DIGEST_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7F_EXECUTION_CANDIDATE',
  contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7F_TRAVERSAL_SURFACE_PASS',
  runtime: process.version,
  fixedFixtureCount: fixedFixtures.length,
  candidateDomainCoordinateCount: candidateCoordinates.length,
  authorizedDomainScanSampleCount: scanCoordinates.length,
  excludedOutOfDomainCoordinateCount:
    candidateCoordinates.length - scanCoordinates.length,
  waterwardProfileSampleCount: waterwardProfile.length,
  declaredTraversalClassCount: H_EARTH_TRAVERSAL_CLASSES.length,
  observedTraversalClassCount: observedClasses.size,
  observedTraversalClasses: [...observedClasses].sort(),
  unobservedDeclaredClasses,
  traversalClassCounts: Object.fromEntries([...classCounts.entries()].sort()),
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  forbiddenOutputsObserved: 0,
  workspaceExecution: true,
  localConstruction: false,
  terrainMutation: false,
  surfaceStateMutation: false,
  waterStateMutation: false,
  biomeMutation: false,
  populationMutation: false,
  geometryMutation: false,
  navigationMutation: false,
  rendererMutation: false,
  publicRouteMutation: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7F_EXECUTION_CANDIDATE ??
  'h-earth-run7f-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(execution, null, 2));
