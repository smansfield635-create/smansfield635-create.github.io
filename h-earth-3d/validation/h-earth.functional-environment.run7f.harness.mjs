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

const shorelineAt = (x) => getHEarthCanonicalShorelineZ(x);
const fixture = ({ id, x, shorelineDistance, expectedClass }) => ({
  id,
  x,
  shorelineDistance,
  z: shorelineAt(x) - shorelineDistance,
  expectedClass
});

const fixedFixtures = [
  fixture({ id: 'OPEN_WATER_BLOCKED', x: 0, shorelineDistance: -90, expectedClass: 'DEEP_WATER_BLOCKED' }),
  fixture({ id: 'NEARSHORE_BLOCKED', x: 48, shorelineDistance: -35, expectedClass: 'DEEP_WATER_BLOCKED' }),
  fixture({ id: 'SHALLOW_WADE', x: -48, shorelineDistance: -10, expectedClass: 'SHALLOW_WADE' }),
  fixture({ id: 'SHORELINE_TRANSITION', x: 96, shorelineDistance: -1, expectedClass: 'SHORELINE_TRANSITION' }),
  fixture({ id: 'WET_SAND_SOFT', x: -96, shorelineDistance: 6, expectedClass: 'SOFT_GROUND' }),
  fixture({ id: 'DRY_SAND_SOFT', x: 144, shorelineDistance: 24, expectedClass: 'SOFT_GROUND' })
];

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
const hazardFields = [
  'slopeHazard',
  'footingHazard',
  'slipHazard',
  'stepHazard',
  'fallHazard',
  'waterHazard'
];

for (const { fixture: entry, sample } of fixedFirst) {
  equal(sample.valid, true, `FIXED_SAMPLE_INVALID:${entry.id}`);
  equal(sample.contractId, H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    `FIXED_CONTRACT_MISMATCH:${entry.id}`);
  equal(sample.traversalClass, entry.expectedClass,
    `FIXED_CLASS_MISMATCH:${entry.id}`);
  const evaluation = evaluateHEarthTraversalSurfaceSample(sample);
  equal(evaluation.eligible, true, `FIXED_EVALUATION_FAIL:${entry.id}`);
  deepEqual(evaluation.issues, [], `FIXED_EVALUATION_ISSUES:${entry.id}`);
  observedClasses.add(sample.traversalClass);

  check(H_EARTH_MOVEMENT_MODES.includes(sample.movementMode),
    `FIXED_MOVEMENT_MODE_INVALID:${entry.id}`);
  check(H_EARTH_PASSABILITY_STATES.includes(sample.passability),
    `FIXED_PASSABILITY_INVALID:${entry.id}`);
  check(finite(sample.movementCost) && sample.movementCost >= 1 && sample.movementCost <= 100,
    `FIXED_MOVEMENT_COST_INVALID:${entry.id}`);
  check(finite(sample.speedMultiplier) && sample.speedMultiplier >= 0 && sample.speedMultiplier <= 1,
    `FIXED_SPEED_MULTIPLIER_INVALID:${entry.id}`);
  hazardFields.forEach((field) => {
    check(finite(sample[field]) && sample[field] >= 0 && sample[field] <= 1,
      `FIXED_HAZARD_RANGE:${entry.id}:${field}`);
  });

  const terrain = sampleHEarthTerrainField(entry.x, entry.z);
  const surface = sampleHEarthSurfaceState(entry.x, entry.z);
  const water = sampleHEarthWaterState(entry.x, entry.z);
  equal(terrain.valid, true, `FIXED_TERRAIN_INVALID:${entry.id}`);
  equal(surface.valid, true, `FIXED_SURFACE_INVALID:${entry.id}`);
  equal(water.valid, true, `FIXED_WATER_INVALID:${entry.id}`);
  equal(sample.world.y, terrain.elevation, `FIXED_WORLD_Y_CORRESPONDENCE:${entry.id}`);
  equal(sample.semanticAddressId, surface.semanticAddressId,
    `FIXED_SEMANTIC_CORRESPONDENCE:${entry.id}`);
  equal(sample.chunkId, surface.chunkId, `FIXED_CHUNK_CORRESPONDENCE:${entry.id}`);
  deepEqual(sample.formationIds, surface.formationIds,
    `FIXED_FORMATION_CORRESPONDENCE:${entry.id}`);
  equal(sample.consumedContext.terrainSlope, terrain.slope,
    `FIXED_SLOPE_CORRESPONDENCE:${entry.id}`);
  equal(sample.consumedContext.surfaceStateClass, surface.surfaceClass,
    `FIXED_SURFACE_CLASS_CORRESPONDENCE:${entry.id}`);
  equal(sample.consumedContext.waterStateClass, water.waterClass,
    `FIXED_WATER_CLASS_CORRESPONDENCE:${entry.id}`);
  equal(sample.consumedContext.waterStateDepth, water.depth,
    `FIXED_WATER_DEPTH_CORRESPONDENCE:${entry.id}`);

  equal(sample.sourceIdentities.terrainFieldContractId,
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    `FIXED_TERRAIN_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.sourceIdentities.surfaceStateContractId,
    H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    `FIXED_SURFACE_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.sourceIdentities.waterStateContractId,
    H_EARTH_WATER_STATE_CONTRACT_ID,
    `FIXED_WATER_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.correspondenceStatus, 'TRAVERSAL_UPSTREAM_CORRESPONDENCE_PASS',
    `FIXED_CORRESPONDENCE_STATUS:${entry.id}`);
  equal(sample.nativeTruthOwnership, 'TRAVERSAL_ONLY',
    `FIXED_OWNERSHIP_STATUS:${entry.id}`);
  deepEqual(sample.issues, [], `FIXED_SAMPLE_ISSUES:${entry.id}`);

  H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FIXED_FORBIDDEN_OUTPUT:${entry.id}:${field}`);
  });

  if (sample.passable === false) {
    equal(sample.passability, 'BLOCKED', `BLOCKED_PASSABILITY:${entry.id}`);
    equal(sample.speedMultiplier, 0, `BLOCKED_SPEED:${entry.id}`);
    equal(sample.movementCost, 100, `BLOCKED_COST:${entry.id}`);
  } else {
    check(sample.passability !== 'BLOCKED', `PASSABLE_MARKED_BLOCKED:${entry.id}`);
    check(sample.speedMultiplier > 0, `PASSABLE_ZERO_SPEED:${entry.id}`);
  }

  assertDeepFrozen(sample, `fixed.${entry.id}`);
  fixedSummaries.push({
    fixtureId: entry.id,
    traversalClass: sample.traversalClass,
    passability: sample.passability,
    movementMode: sample.movementMode,
    movementCost: sample.movementCost,
    hazards: Object.fromEntries(hazardFields.map((field) => [field, sample[field]]))
  });
}

const scanCoordinates = [];
for (let x = -240; x <= 240; x += 24) {
  for (let z = -240; z <= 48; z += 24) {
    scanCoordinates.push({ x, z });
  }
}

const scanFirst = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
const scanSecond = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
deepEqual(scanFirst, scanSecond, 'DOMAIN_SCAN_DETERMINISM_FAILURE');

const classCounts = new Map();
const scanSummaries = [];
scanFirst.forEach((sample, index) => {
  const coordinate = scanCoordinates[index];
  equal(sample.valid, true, `SCAN_SAMPLE_INVALID:${coordinate.x}:${coordinate.z}`);
  const evaluation = evaluateHEarthTraversalSurfaceSample(sample);
  equal(evaluation.eligible, true,
    `SCAN_EVALUATION_FAIL:${coordinate.x}:${coordinate.z}`);
  deepEqual(evaluation.issues, [],
    `SCAN_EVALUATION_ISSUES:${coordinate.x}:${coordinate.z}`);
  observedClasses.add(sample.traversalClass);
  classCounts.set(sample.traversalClass,
    (classCounts.get(sample.traversalClass) ?? 0) + 1);

  check(finite(sample.movementCost),
    `SCAN_MOVEMENT_COST_NONFINITE:${coordinate.x}:${coordinate.z}`);
  check(sample.movementCost >= 1 && sample.movementCost <= 100,
    `SCAN_MOVEMENT_COST_RANGE:${coordinate.x}:${coordinate.z}`);
  hazardFields.forEach((field) => {
    check(finite(sample[field]) && sample[field] >= 0 && sample[field] <= 1,
      `SCAN_HAZARD_RANGE:${coordinate.x}:${coordinate.z}:${field}`);
  });
  if (sample.passable === false) {
    equal(sample.speedMultiplier, 0,
      `SCAN_BLOCKED_SPEED:${coordinate.x}:${coordinate.z}`);
  } else {
    check(sample.speedMultiplier > 0 && sample.speedMultiplier <= 1,
      `SCAN_PASSABLE_SPEED:${coordinate.x}:${coordinate.z}`);
  }
  if (index % 31 === 0) assertDeepFrozen(sample, `scan.${index}`);

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

for (const requiredClass of [
  'STABLE_GROUND',
  'SOFT_GROUND',
  'ROCKY_UNEVEN_GROUND',
  'STEEP_GROUND_CAUTION',
  'SHORELINE_TRANSITION',
  'SHALLOW_WADE',
  'STEEP_SLOPE_BLOCKED',
  'DEEP_WATER_BLOCKED'
]) {
  check(observedClasses.has(requiredClass), `REQUIRED_TRAVERSAL_CLASS_NOT_OBSERVED:${requiredClass}`);
}

const waterwardProfileDistances = [24, 6, -1, -10, -35, -90];
const waterwardProfile = waterwardProfileDistances.map((shorelineDistance) => {
  const x = 0;
  const z = shorelineAt(x) - shorelineDistance;
  return sampleHEarthTraversalSurface(x, z);
});
equal(waterwardProfile[0].traversalClass, 'SOFT_GROUND',
  'WATERWARD_PROFILE_DRY_SAND_NOT_SOFT');
equal(waterwardProfile[1].traversalClass, 'SOFT_GROUND',
  'WATERWARD_PROFILE_WET_SAND_NOT_SOFT');
equal(waterwardProfile[2].traversalClass, 'SHORELINE_TRANSITION',
  'WATERWARD_PROFILE_CONTACT_MISMATCH');
equal(waterwardProfile[3].traversalClass, 'SHALLOW_WADE',
  'WATERWARD_PROFILE_SHALLOW_MISMATCH');
equal(waterwardProfile[4].traversalClass, 'DEEP_WATER_BLOCKED',
  'WATERWARD_PROFILE_NEARSHORE_NOT_BLOCKED');
equal(waterwardProfile[5].traversalClass, 'DEEP_WATER_BLOCKED',
  'WATERWARD_PROFILE_OPEN_WATER_NOT_BLOCKED');
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
equal(sourceReceipt.ownsMovementClassification, true,
  'TRAVERSAL_CLASSIFICATION_AUTHORITY_MISSING');
equal(sourceReceipt.ownsMovementCost, true,
  'TRAVERSAL_COST_AUTHORITY_MISSING');
equal(sourceReceipt.ownsPassability, true,
  'TRAVERSAL_PASSABILITY_AUTHORITY_MISSING');
equal(sourceReceipt.ownsTerrainTruth, false,
  'TRAVERSAL_TERRAIN_AUTHORITY_LEAK');
equal(sourceReceipt.ownsSurfaceState, false,
  'TRAVERSAL_SURFACE_AUTHORITY_LEAK');
equal(sourceReceipt.ownsWaterState, false,
  'TRAVERSAL_WATER_AUTHORITY_LEAK');
equal(sourceReceipt.ownsGeometry, false,
  'TRAVERSAL_GEOMETRY_AUTHORITY_LEAK');
equal(sourceReceipt.ownsNavigation, false,
  'TRAVERSAL_NAVIGATION_AUTHORITY_LEAK');
equal(sourceReceipt.ownsRenderer, false,
  'TRAVERSAL_RENDERER_AUTHORITY_LEAK');

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
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  fixedSummaries: fixedSecond.map(({ fixture: entry, sample }) => ({
    fixtureId: entry.id,
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
equal(deterministicDigest, rerunDigest, 'TRAVERSAL_DETERMINISTIC_DIGEST_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7F_EXECUTION_CANDIDATE',
  contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7F_TRAVERSAL_SURFACE_PASS',
  runtime: process.version,
  fixedFixtureCount: fixedFixtures.length,
  domainScanSampleCount: scanCoordinates.length,
  waterwardProfileSampleCount: waterwardProfile.length,
  observedTraversalClassCount: observedClasses.size,
  observedTraversalClasses: [...observedClasses].sort(),
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
