import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_WATER_STATE_CONTRACT_ID,
  H_EARTH_WATER_STATE,
  H_EARTH_WATER_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  H_EARTH_WATER_CLASSES,
  sampleHEarthWaterState,
  evaluateHEarthWaterStateSample,
  getHEarthWaterStateReceipt
} from '../environment/h-earth.water-state.js';

import {
  H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
  H_EARTH_WATER_PRESENTATION,
  computeHEarthWaterDepthColor,
  computeHEarthWaterWavePhase,
  buildHEarthWaterPresentation,
  evaluateHEarthWaterPresentation,
  getHEarthWaterPresentationReceipt
} from '../../showroom/globe/h-earth/render/environment-water.js';

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
  timeOfDayHours: 15.25,
  observerElevation: 2.25,
  viewDistance: 320
});
equal(atmosphere.valid, true, 'ATMOSPHERE_FIXTURE_INVALID');
equal(atmosphere.contractId, H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  'ATMOSPHERE_FIXTURE_CONTRACT_MISMATCH');

const makeFixture = ({ id, x, distance, expectedClass, observerY }) => ({
  id,
  x,
  distance,
  z: getHEarthCanonicalShorelineZ(x) - distance,
  expectedClass,
  observerY
});

const fixtures = [
  makeFixture({ id: 'DRY_INLAND', x: -128, distance: 30, expectedClass: 'NO_WATER', observerY: 2.25 }),
  makeFixture({ id: 'CONTACT_LANDWARD', x: -64, distance: 1, expectedClass: 'SHORELINE_CONTACT', observerY: 0.6 }),
  makeFixture({ id: 'CONTACT_WATERWARD', x: 0, distance: -1, expectedClass: 'SHORELINE_CONTACT', observerY: 0 }),
  makeFixture({ id: 'SHALLOW_WATER', x: 48, distance: -10, expectedClass: 'SHALLOW_WATER', observerY: 1.2 }),
  makeFixture({ id: 'NEARSHORE_WATER', x: 96, distance: -35, expectedClass: 'NEARSHORE_WATER', observerY: 2.25 }),
  makeFixture({ id: 'OPEN_WATER', x: 144, distance: -90, expectedClass: 'OPEN_WATER', observerY: 3.5 }),
  makeFixture({ id: 'OPEN_WATER_SUBMERGED', x: 144, distance: -90, expectedClass: 'OPEN_WATER', observerY: -2 })
];

const sampleFixture = (entry) => ({
  fixture: entry,
  sample: sampleHEarthWaterState(entry.x, entry.z, {
    atmosphereState: atmosphere,
    observerY: entry.observerY
  })
});
const firstSamples = fixtures.map(sampleFixture);
const secondSamples = fixtures.map(sampleFixture);
deepEqual(firstSamples, secondSamples, 'DETERMINISTIC_WATER_RERUN_MISMATCH');

const observedClasses = new Set();
const summaries = [];
const forbiddenFields = [...new Set([
  ...H_EARTH_WATER_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  'traversalClass',
  'traversalCost',
  'ambientAudioClass',
  'biomeClass',
  'chunkState'
])];

for (const [index, { fixture, sample }] of firstSamples.entries()) {
  equal(sample.valid, true, `WATER_SAMPLE_INVALID:${fixture.id}`);
  equal(sample.contractId, H_EARTH_WATER_STATE_CONTRACT_ID,
    `WATER_CONTRACT_MISMATCH:${fixture.id}`);
  equal(sample.waterStateRevision, 1, `WATER_REVISION_MISMATCH:${fixture.id}`);
  equal(sample.waterClass, fixture.expectedClass,
    `WATER_CLASS_MISMATCH:${fixture.id}`);
  observedClasses.add(sample.waterClass);

  const evaluation = evaluateHEarthWaterStateSample(sample);
  equal(evaluation.eligible, true, `WATER_EVALUATION_FAIL:${fixture.id}`);
  deepEqual(evaluation.issues, [], `WATER_EVALUATION_ISSUES:${fixture.id}`);

  const terrain = sampleHEarthTerrainField(fixture.x, fixture.z);
  const surface = sampleHEarthSurfaceState(fixture.x, fixture.z);
  equal(terrain.valid, true, `TERRAIN_FIXTURE_INVALID:${fixture.id}`);
  equal(surface.valid, true, `SURFACE_FIXTURE_INVALID:${fixture.id}`);
  equal(sample.bedElevation, terrain.elevation,
    `BED_TERRAIN_CORRESPONDENCE:${fixture.id}`);
  equal(sample.shorelineDistance, terrain.shorelineDistance,
    `SHORELINE_DISTANCE_CORRESPONDENCE:${fixture.id}`);
  equal(sample.shorelineZ, terrain.shorelineZ,
    `SHORELINE_Z_CORRESPONDENCE:${fixture.id}`);
  equal(sample.semanticAddressId, surface.semanticAddressId,
    `SEMANTIC_ADDRESS_CORRESPONDENCE:${fixture.id}`);
  equal(sample.chunkId, surface.chunkId,
    `CHUNK_CORRESPONDENCE:${fixture.id}`);
  deepEqual(sample.formationIds, surface.formationIds,
    `FORMATION_CORRESPONDENCE:${fixture.id}`);

  const identities = sample.sourceIdentities;
  equal(identities.terrainFieldContractId, H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    `TERRAIN_SOURCE_IDENTITY:${fixture.id}`);
  equal(identities.surfaceStateContractId, H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    `SURFACE_SOURCE_IDENTITY:${fixture.id}`);
  equal(identities.atmosphereStateContractId, H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    `ATMOSPHERE_SOURCE_IDENTITY:${fixture.id}`);
  equal(identities.waterStateContractId, H_EARTH_WATER_STATE_CONTRACT_ID,
    `WATER_SOURCE_IDENTITY:${fixture.id}`);
  equal(sample.correspondenceStatus, 'WATER_UPSTREAM_CORRESPONDENCE_PASS',
    `CORRESPONDENCE_STATUS:${fixture.id}`);
  deepEqual(sample.issues, [], `WATER_SAMPLE_ISSUES:${fixture.id}`);

  for (const field of [
    'bedElevation', 'depth', 'shorelineDistance', 'shorelineZ',
    'waterwardDistance', 'flowSpeed', 'waveAmplitude', 'waveFrequency',
    'turbidity', 'foamIntensity', 'wetnessTransfer'
  ]) {
    check(finite(sample[field]), `NONFINITE_WATER_FIELD:${fixture.id}:${field}`);
  }
  check(sample.depth >= 0, `NEGATIVE_DEPTH:${fixture.id}`);
  for (const field of ['turbidity', 'foamIntensity', 'wetnessTransfer']) {
    check(sample[field] >= 0 && sample[field] <= 1,
      `WATER_FIELD_RANGE:${fixture.id}:${field}`);
  }
  forbiddenFields.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FORBIDDEN_WATER_OUTPUT:${fixture.id}:${field}`);
  });

  if (sample.waterPresent) {
    check(typeof sample.waterBodyId === 'string' && sample.waterBodyId.length > 0,
      `WATER_BODY_ID_MISSING:${fixture.id}`);
    check(finite(sample.surfaceElevation), `SURFACE_ELEVATION_NONFINITE:${fixture.id}`);
    check(Math.abs(Math.hypot(sample.flowDirection.x, sample.flowDirection.z) - 1) < 1e-10,
      `FLOW_DIRECTION_NOT_NORMALIZED:${fixture.id}`);
    check(Math.abs(Math.hypot(sample.waveDirection.x, sample.waveDirection.z) - 1) < 1e-10,
      `WAVE_DIRECTION_NOT_NORMALIZED:${fixture.id}`);
    check(sample.waveAmplitude > 0, `WAVE_AMPLITUDE_NOT_POSITIVE:${fixture.id}`);
    check(sample.waveFrequency > 0, `WAVE_FREQUENCY_NOT_POSITIVE:${fixture.id}`);
  } else {
    equal(sample.waterBodyId, null, `LAND_WATER_BODY_PRESENT:${fixture.id}`);
    equal(sample.surfaceElevation, null, `LAND_SURFACE_ELEVATION_PRESENT:${fixture.id}`);
    equal(sample.depth, 0, `LAND_DEPTH_PRESENT:${fixture.id}`);
    equal(sample.flowSpeed, 0, `LAND_FLOW_PRESENT:${fixture.id}`);
    equal(sample.waveAmplitude, 0, `LAND_WAVE_PRESENT:${fixture.id}`);
    equal(sample.buoyancyEligibility, false, `LAND_BUOYANCY_ELIGIBLE:${fixture.id}`);
  }

  if (fixture.id === 'OPEN_WATER_SUBMERGED') {
    equal(sample.underwaterState, 'SUBMERGED', 'SUBMERGED_CLASSIFICATION_MISSING');
  }
  if (fixture.id === 'CONTACT_WATERWARD') {
    equal(sample.underwaterState, 'CONTACT_ZONE', 'CONTACT_CLASSIFICATION_MISSING');
  }
  assertDeepFrozen(sample, `water.${fixture.id}`);

  const timeSeconds = index * 7.5 + 3;
  const plan = buildHEarthWaterPresentation(sample, {
    atmosphereState: atmosphere,
    timeSeconds,
    cameraDistance: 40 + index * 48,
    horizonDistance: 512
  });
  equal(plan.eligible, true, `WATER_PRESENTATION_INVALID:${fixture.id}`);
  equal(plan.contractId, H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
    `WATER_PRESENTATION_CONTRACT:${fixture.id}`);
  const planEvaluation = evaluateHEarthWaterPresentation(plan);
  equal(planEvaluation.eligible, true,
    `WATER_PRESENTATION_EVALUATION_FAIL:${fixture.id}`);
  deepEqual(planEvaluation.issues, [],
    `WATER_PRESENTATION_EVALUATION_ISSUES:${fixture.id}`);
  equal(plan.visible, sample.waterPresent,
    `WATER_PRESENTATION_VISIBILITY:${fixture.id}`);
  equal(plan.authority.ownsNativeWaterTruth, false,
    `PRESENTATION_NATIVE_WATER_AUTHORITY_LEAK:${fixture.id}`);
  equal(plan.authority.ownsRendererLoop, false,
    `PRESENTATION_RENDERER_LOOP_LEAK:${fixture.id}`);
  equal(plan.authority.mutatesRenderer, false,
    `PRESENTATION_RENDERER_MUTATION:${fixture.id}`);
  equal(plan.authority.createsDom, false,
    `PRESENTATION_DOM_CREATION:${fixture.id}`);
  equal(plan.authority.createsCanvas, false,
    `PRESENTATION_CANVAS_CREATION:${fixture.id}`);
  assertDeepFrozen(plan, `presentation.${fixture.id}`);

  if (sample.waterPresent) {
    check(Array.isArray(plan.surfaceColor) && plan.surfaceColor.length === 4,
      `WATER_COLOR_SHAPE:${fixture.id}`);
    plan.surfaceColor.forEach((channel, channelIndex) => {
      check(Number.isInteger(channel) && channel >= 0 && channel <= 255,
        `WATER_COLOR_CHANNEL:${fixture.id}:${channelIndex}`);
    });
    equal(plan.horizonConsistency.required, true,
      `HORIZON_CONTINUITY_NOT_REQUIRED:${fixture.id}`);
    equal(plan.horizonConsistency.finiteGeometryOwnedHere, false,
      `PRESENTATION_GEOMETRY_AUTHORITY_LEAK:${fixture.id}`);
    check(plan.shorelineFoam.intensity >= 0 && plan.shorelineFoam.intensity <= 1,
      `FOAM_INTENSITY_RANGE:${fixture.id}`);
    check(finite(plan.waveMotion.phase), `WAVE_PHASE_NONFINITE:${fixture.id}`);
    check(finite(plan.waveMotion.surfacePresentationOffset),
      `WAVE_OFFSET_NONFINITE:${fixture.id}`);
    const phaseA = computeHEarthWaterWavePhase(sample, timeSeconds);
    const phaseB = computeHEarthWaterWavePhase(sample, timeSeconds);
    deepEqual(phaseA, phaseB, `WAVE_PHASE_NONDETERMINISTIC:${fixture.id}`);
    const phaseLater = computeHEarthWaterWavePhase(sample, timeSeconds + 0.5);
    check(Math.abs(phaseLater.phase - phaseA.phase) > 1e-8,
      `WAVE_PHASE_NOT_ADVANCING:${fixture.id}`);
    deepEqual(computeHEarthWaterDepthColor(sample, atmosphere), plan.surfaceColor,
      `DEPTH_COLOR_MISMATCH:${fixture.id}`);
  } else {
    deepEqual(plan.surfaceColor, [0, 0, 0, 0],
      `LAND_WATER_COLOR_PRESENT:${fixture.id}`);
    equal(plan.horizonConsistency.required, false,
      `LAND_HORIZON_WATER_REQUIRED:${fixture.id}`);
  }
  if (sample.underwaterState === 'SUBMERGED') {
    equal(plan.underwater.overlayRequired, true,
      `UNDERWATER_OVERLAY_MISSING:${fixture.id}`);
    check(plan.underwater.distortionStrength > 0,
      `UNDERWATER_DISTORTION_MISSING:${fixture.id}`);
  }

  summaries.push({
    fixtureId: fixture.id,
    waterClass: sample.waterClass,
    shorelineDistance: sample.shorelineDistance,
    depth: sample.depth,
    flowSpeed: sample.flowSpeed,
    waveAmplitude: sample.waveAmplitude,
    waveFrequency: sample.waveFrequency,
    turbidity: sample.turbidity,
    foamIntensity: sample.foamIntensity,
    wetnessTransfer: sample.wetnessTransfer,
    underwaterState: sample.underwaterState,
    buoyancyEligibility: sample.buoyancyEligibility,
    surfaceColor: plan.surfaceColor
  });
}

H_EARTH_WATER_CLASSES.forEach((waterClass) => {
  check(observedClasses.has(waterClass), `WATER_CLASS_NOT_OBSERVED:${waterClass}`);
});

const profileX = 0;
const profileDistances = [-1, -10, -35, -90];
const depthProfile = profileDistances.map((distance) => sampleHEarthWaterState(
  profileX,
  getHEarthCanonicalShorelineZ(profileX) - distance,
  { atmosphereState: atmosphere, observerY: 2.25 }
));
depthProfile.forEach((sample, index) => {
  equal(sample.valid, true, `DEPTH_PROFILE_SAMPLE_INVALID:${index}`);
  equal(sample.waterPresent, true, `DEPTH_PROFILE_WATER_MISSING:${index}`);
});
for (let index = 1; index < depthProfile.length; index += 1) {
  check(depthProfile[index].depth >= depthProfile[index - 1].depth - 1e-10,
    `DEPTH_NOT_MONOTONIC_WATERWARD:${index}`);
}

const byId = (id) => firstSamples.find(({ fixture }) => fixture.id === id).sample;
const dry = byId('DRY_INLAND');
const contact = byId('CONTACT_WATERWARD');
const shallow = byId('SHALLOW_WATER');
const nearshore = byId('NEARSHORE_WATER');
const open = byId('OPEN_WATER');
check(dry.wetnessTransfer < contact.wetnessTransfer,
  'WETNESS_TRANSFER_NOT_INCREASING_TO_SHORE');
check(contact.foamIntensity > shallow.foamIntensity,
  'CONTACT_FOAM_NOT_GREATER_THAN_SHALLOW');
check(shallow.foamIntensity > nearshore.foamIntensity,
  'SHALLOW_FOAM_NOT_GREATER_THAN_NEARSHORE');
check(nearshore.foamIntensity > open.foamIntensity,
  'NEARSHORE_FOAM_NOT_GREATER_THAN_OPEN');
check(shallow.turbidity > nearshore.turbidity,
  'SHALLOW_TURBIDITY_NOT_GREATER_THAN_NEARSHORE');
check(nearshore.turbidity > open.turbidity,
  'NEARSHORE_TURBIDITY_NOT_GREATER_THAN_OPEN');

const invalidSamples = [
  sampleHEarthWaterState(Number.NaN, 0),
  sampleHEarthWaterState(0, Number.POSITIVE_INFINITY),
  sampleHEarthWaterState(0, -100, { observerY: Number.NaN }),
  sampleHEarthWaterState(0, -100, { atmosphereState: { valid: false } })
];
invalidSamples.forEach((sample, index) => {
  equal(sample.valid, false, `INVALID_WATER_SAMPLE_ACCEPTED:${index}`);
  equal(sample.status, 'WATER_STATE_REJECTED_INVALID_INPUT',
    `INVALID_WATER_STATUS:${index}`);
});
equal(computeHEarthWaterWavePhase(open, Number.NaN), null,
  'NONFINITE_WAVE_TIME_ACCEPTED');
equal(buildHEarthWaterPresentation(open, {
  atmosphereState: atmosphere,
  timeSeconds: 0,
  cameraDistance: -1,
  horizonDistance: 512
}).eligible, false, 'INVALID_WATER_PRESENTATION_ACCEPTED');

const waterReceipt = getHEarthWaterStateReceipt();
const presentationReceipt = getHEarthWaterPresentationReceipt();
equal(waterReceipt.eligible, true, 'WATER_SOURCE_RECEIPT_FAIL');
equal(presentationReceipt.eligible, true, 'WATER_PRESENTATION_RECEIPT_FAIL');
deepEqual(waterReceipt.issues, [], 'WATER_SOURCE_RECEIPT_ISSUES');
deepEqual(presentationReceipt.issues, [], 'WATER_PRESENTATION_RECEIPT_ISSUES');
equal(H_EARTH_WATER_STATE.ownership.ownsWaterBodyIdentity, true,
  'WATER_BODY_AUTHORITY_NOT_DECLARED');
equal(H_EARTH_WATER_STATE.ownership.ownsTerrainTruth, false,
  'WATER_TERRAIN_AUTHORITY_LEAK');
equal(H_EARTH_WATER_STATE.ownership.ownsRenderer, false,
  'WATER_RENDERER_AUTHORITY_LEAK');
equal(H_EARTH_WATER_PRESENTATION.ownership.ownsNativeWaterTruth, false,
  'PRESENTATION_NATIVE_WATER_TRUTH_LEAK');
equal(H_EARTH_WATER_PRESENTATION.ownership.mutatesRenderer, false,
  'PRESENTATION_RENDERER_MUTATION_DECLARED');

const deterministicCore = {
  contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
  presentationContractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
  waterStateRevision: 1,
  presentationRevision: 1,
  observedClasses: [...observedClasses].sort(),
  fixtures: summaries,
  depthProfile: depthProfile.map((sample) => ({
    shorelineDistance: sample.shorelineDistance,
    depth: sample.depth,
    waterClass: sample.waterClass
  })),
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunSummaries = secondSamples.map(({ fixture, sample }, index) => {
  const plan = buildHEarthWaterPresentation(sample, {
    atmosphereState: atmosphere,
    timeSeconds: index * 7.5 + 3,
    cameraDistance: 40 + index * 48,
    horizonDistance: 512
  });
  return {
    fixtureId: fixture.id,
    waterClass: sample.waterClass,
    shorelineDistance: sample.shorelineDistance,
    depth: sample.depth,
    flowSpeed: sample.flowSpeed,
    waveAmplitude: sample.waveAmplitude,
    waveFrequency: sample.waveFrequency,
    turbidity: sample.turbidity,
    foamIntensity: sample.foamIntensity,
    wetnessTransfer: sample.wetnessTransfer,
    underwaterState: sample.underwaterState,
    buoyancyEligibility: sample.buoyancyEligibility,
    surfaceColor: plan.surfaceColor
  };
});
const rerunDigest = digest({ ...deterministicCore, fixtures: rerunSummaries });
equal(deterministicDigest, rerunDigest, 'DETERMINISTIC_WATER_DIGEST_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7D_EXECUTION_CANDIDATE',
  contractId: H_EARTH_WATER_STATE_CONTRACT_ID,
  presentationContractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7D_WATER_STATE_AND_PRESENTATION_PASS',
  runtime: process.version,
  fixtureCount: fixtures.length,
  depthProfileSampleCount: depthProfile.length,
  waterClassCount: observedClasses.size,
  observedWaterClasses: [...observedClasses].sort(),
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  forbiddenOutputsObserved: 0,
  workspaceExecution: true,
  localConstruction: false,
  createsDom: false,
  createsCanvas: false,
  geometryMutation: false,
  rendererMutation: false,
  publicRouteMutation: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7D_EXECUTION_CANDIDATE ??
  'h-earth-run7d-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(execution, null, 2));
