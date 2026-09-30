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

function deepFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) &&
    Object.values(value).every((nested) => deepFrozen(nested, seen));
}

const hazardFields = [
  'slopeHazard',
  'footingHazard',
  'slipHazard',
  'stepHazard',
  'fallHazard',
  'waterHazard'
];

function validate(sample, label) {
  equal(sample.valid, true, `INVALID:${label}`);
  equal(sample.contractId, H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    `CONTRACT:${label}`);
  check(H_EARTH_TRAVERSAL_CLASSES.includes(sample.traversalClass),
    `CLASS:${label}`);
  check(H_EARTH_MOVEMENT_MODES.includes(sample.movementMode),
    `MODE:${label}`);
  check(H_EARTH_PASSABILITY_STATES.includes(sample.passability),
    `PASSABILITY:${label}`);
  const evaluation = evaluateHEarthTraversalSurfaceSample(sample);
  equal(evaluation.eligible, true, `EVALUATION:${label}`);
  deepEqual(evaluation.issues, [], `ISSUES:${label}`);
  check(finite(sample.movementCost) && sample.movementCost >= 1 && sample.movementCost <= 100,
    `COST:${label}`);
  check(finite(sample.speedMultiplier) && sample.speedMultiplier >= 0 && sample.speedMultiplier <= 1,
    `SPEED:${label}`);
  hazardFields.forEach((field) => {
    check(finite(sample[field]) && sample[field] >= 0 && sample[field] <= 1,
      `HAZARD:${label}:${field}`);
  });
  H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FORBIDDEN:${label}:${field}`);
  });
  equal(sample.sourceIdentities.terrainFieldContractId,
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID, `TERRAIN_SOURCE:${label}`);
  equal(sample.sourceIdentities.surfaceStateContractId,
    H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID, `SURFACE_SOURCE:${label}`);
  equal(sample.sourceIdentities.waterStateContractId,
    H_EARTH_WATER_STATE_CONTRACT_ID, `WATER_SOURCE:${label}`);
  equal(sample.correspondenceStatus, 'TRAVERSAL_UPSTREAM_CORRESPONDENCE_PASS',
    `CORRESPONDENCE:${label}`);
  equal(sample.nativeTruthOwnership, 'TRAVERSAL_ONLY', `OWNERSHIP:${label}`);
  check(deepFrozen(sample), `NOT_DEEP_FROZEN:${label}`);
  if (sample.passable === false) {
    equal(sample.passability, 'BLOCKED', `BLOCKED_STATE:${label}`);
    equal(sample.speedMultiplier, 0, `BLOCKED_SPEED:${label}`);
    equal(sample.movementCost, 100, `BLOCKED_COST:${label}`);
  }
}

const shoreline = (x) => getHEarthCanonicalShorelineZ(x);
const fixedFixtures = [
  { id: 'OPEN', x: 0, d: -90, expected: 'DEEP_WATER_BLOCKED' },
  { id: 'NEARSHORE', x: 48, d: -35, expected: 'DEEP_WATER_BLOCKED' },
  { id: 'SHALLOW', x: -48, d: -10, expected: 'SHALLOW_WADE' },
  { id: 'CONTACT', x: 96, d: -1, expected: 'SHORELINE_TRANSITION' },
  { id: 'WET_SAND', x: -96, d: 6, expected: 'SOFT_GROUND' },
  { id: 'DRY_SAND', x: 144, d: 24, expected: 'SOFT_GROUND' }
].map((entry) => ({ ...entry, z: shoreline(entry.x) - entry.d }));

const fixedFirst = fixedFixtures.map((entry) => ({
  entry,
  sample: sampleHEarthTraversalSurface(entry.x, entry.z)
}));
const fixedSecond = fixedFixtures.map((entry) => ({
  entry,
  sample: sampleHEarthTraversalSurface(entry.x, entry.z)
}));
deepEqual(fixedFirst, fixedSecond, 'FIXED_DETERMINISM');

const observed = new Set();
const fixedSummary = fixedFirst.map(({ entry, sample }) => {
  validate(sample, `fixed.${entry.id}`);
  equal(sample.traversalClass, entry.expected, `FIXED_CLASS:${entry.id}`);
  const terrain = sampleHEarthTerrainField(entry.x, entry.z);
  const surface = sampleHEarthSurfaceState(entry.x, entry.z);
  const water = sampleHEarthWaterState(entry.x, entry.z);
  equal(sample.world.y, terrain.elevation, `WORLD_Y:${entry.id}`);
  equal(sample.semanticAddressId, surface.semanticAddressId, `ADDRESS:${entry.id}`);
  equal(sample.chunkId, surface.chunkId, `CHUNK:${entry.id}`);
  equal(sample.consumedContext.waterStateClass, water.waterClass, `WATER_CLASS:${entry.id}`);
  observed.add(sample.traversalClass);
  return {
    id: entry.id,
    traversalClass: sample.traversalClass,
    passability: sample.passability,
    movementCost: sample.movementCost
  };
});

const candidateCoordinates = [];
for (let x = -240; x <= 240; x += 16) {
  for (let z = -248; z <= 16; z += 16) candidateCoordinates.push({ x, z });
}
const scanCoordinates = candidateCoordinates.filter(({ x, z }) =>
  sampleHEarthSurfaceState(x, z).valid === true &&
  sampleHEarthWaterState(x, z).valid === true);
check(scanCoordinates.length >= 300, 'AUTHORIZED_SCAN_TOO_SMALL');
check(scanCoordinates.length < candidateCoordinates.length,
  'NO_OUT_OF_DOMAIN_COORDINATES_EXCLUDED');

const scanFirst = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
const scanSecond = scanCoordinates.map(({ x, z }) =>
  sampleHEarthTraversalSurface(x, z));
deepEqual(scanFirst, scanSecond, 'SCAN_DETERMINISM');

const classCounts = new Map();
const scanSummary = scanFirst.map((sample, index) => {
  const { x, z } = scanCoordinates[index];
  validate(sample, `scan.${x}.${z}`);
  observed.add(sample.traversalClass);
  classCounts.set(sample.traversalClass,
    (classCounts.get(sample.traversalClass) ?? 0) + 1);
  return {
    x,
    z,
    traversalClass: sample.traversalClass,
    passable: sample.passable,
    movementCost: sample.movementCost,
    slopeHazard: sample.slopeHazard,
    fallHazard: sample.fallHazard,
    waterHazard: sample.waterHazard
  };
});

H_EARTH_TRAVERSAL_CLASSES.forEach((traversalClass) => {
  check(observed.has(traversalClass),
    `DECLARED_CLASS_NOT_OBSERVED:${traversalClass}`);
});
equal(observed.size, 8, 'OBSERVED_CLASS_COUNT');

const profile = [24, 6, -1, -10, -35, -90].map((distance) =>
  sampleHEarthTraversalSurface(0, shoreline(0) - distance));
deepEqual(profile.map((sample) => sample.traversalClass), [
  'SOFT_GROUND',
  'SOFT_GROUND',
  'SHORELINE_TRANSITION',
  'SHALLOW_WADE',
  'DEEP_WATER_BLOCKED',
  'DEEP_WATER_BLOCKED'
], 'WATERWARD_CLASS_SEQUENCE');
check(profile[3].waterHazard > profile[2].waterHazard,
  'SHALLOW_HAZARD_NOT_GREATER_THAN_CONTACT');
check(profile[4].waterHazard >= profile[3].waterHazard,
  'DEEP_HAZARD_NOT_GREATER_THAN_SHALLOW');

const suppliedX = -32;
const suppliedZ = -150;
const correspondingWater = sampleHEarthWaterState(suppliedX, suppliedZ);
equal(sampleHEarthTraversalSurface(suppliedX, suppliedZ, {
  waterState: correspondingWater
}).valid, true, 'CORRESPONDING_WATER_REJECTED');
const mismatched = sampleHEarthTraversalSurface(suppliedX, suppliedZ, {
  waterState: sampleHEarthWaterState(suppliedX + 24, suppliedZ)
});
equal(mismatched.valid, false, 'MISMATCHED_WATER_ACCEPTED');
check(mismatched.issues.includes('WATER_STATE_NOT_ELIGIBLE_OR_NOT_CORRESPONDING'),
  'MISMATCH_ISSUE_MISSING');

for (const [index, args] of [
  [Number.NaN, 0],
  [0, Number.POSITIVE_INFINITY],
  ['0', 0]
].entries()) {
  const rejected = sampleHEarthTraversalSurface(args[0], args[1]);
  equal(rejected.valid, false, `INVALID_INPUT_ACCEPTED:${index}`);
}

const sourceReceipt = getHEarthTraversalSurfaceReceipt();
equal(sourceReceipt.eligible, true, 'SOURCE_RECEIPT_FAIL');
deepEqual(sourceReceipt.issues, [], 'SOURCE_RECEIPT_ISSUES');
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
    `OWNERSHIP_DECLARATION:${key}`);
}

const deterministicCore = {
  contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  traversalSurfaceRevision: 1,
  fixedSummary,
  scanSummary,
  observedClasses: [...observed].sort(),
  classCounts: Object.fromEntries([...classCounts.entries()].sort()),
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  fixedSummary: fixedSecond.map(({ entry, sample }) => ({
    id: entry.id,
    traversalClass: sample.traversalClass,
    passability: sample.passability,
    movementCost: sample.movementCost
  })),
  scanSummary: scanSecond.map((sample, index) => ({
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
equal(deterministicDigest, rerunDigest, 'DIGEST_RERUN_MISMATCH');

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
  waterwardProfileSampleCount: profile.length,
  declaredTraversalClassCount: H_EARTH_TRAVERSAL_CLASSES.length,
  observedTraversalClassCount: observed.size,
  observedTraversalClasses: [...observed].sort(),
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
