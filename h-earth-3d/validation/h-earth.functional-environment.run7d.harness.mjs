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

const shorelineAt = (x) => getHEarthCanonicalShorelineZ(x);
const fixture = ({ id, x, shorelineDistance, expectedClass, observerY = null }) => ({
  id,
  x,
  shorelineDistance,
  z: shorelineAt(x) - shorelineDistance,
  expectedClass,
  observerY
});

const fixtures = [
  fixture({ id: 'DRY_INLAND', x: -128, shorelineDistance: 30, expectedClass: 'NO_WATER', observerY: 2.25 }),
  fixture({ id: 'CONTACT_LANDWARD', x: -64, shorelineDistance: 1, expectedClass: 'SHORELINE_CONTACT', observerY: 0.6 }),
  fixture({ id: 'CONTACT_WATERWARD', x: 0, shorelineDistance: -1, expectedClass: 'SHORELINE_CONTACT', observerY: 0 }),
  fixture({ id: 'SHALLOW_WATER', x: 48, shorelineDistance: -10, expectedClass: 'SHALLOW_WATER', observerY: 1.2 }),
  fixture({ id: 'NEARSHORE_WATER', x: 96, shorelineDistance: -35, expectedClass: 'NEARSHORE_WATER', observerY: 2.25 }),
  fixture({ id: 'OPEN_WATER', x: 144, shorelineDistance: -90, expectedClass: 'OPEN_WATER', observerY: 3.5 }),
  fixture({ id: 'OPEN_WATER_SUBMERGED', x: 144, shorelineDistance: -90, expectedClass: 'OPEN_WATER', observerY: -2 })
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
const forbiddenFields = [
  ...H_EARTH_WATER_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  'traversalClass',
  'traversalCost',
  'ambientAudioClass',
  'biomeClass',
  'chunkState'
];

for (const [index, { fixture: entry, sample }] of firstSamples.entries()) {
  equal(sample.valid, true, `WATER_SAMPLE_INVALID:${entry.id}`);
  equal(sample.contractId, H_EARTH_WATER_STATE_CONTRACT_ID,
    `WATER_CONTRACT_MISMATCH:${entry.id}`);
  equal(sample.waterStateRevision, 1, `WATER_REVISION_MISMATCH:${entry.id}`);
  equal(sample.waterClass, entry.expectedClass,
    `WATER_CLASS_MISMATCH:${entry.id}`);
  observedClasses.add(sample.waterClass);

  const evaluation = evaluateHEarthWaterStateSample(sample);
  equal(evaluation.eligible, true, `WATER_EVALUATION_FAIL:${entry.id}`);
  deepEqual(evaluation.issues, [], `WATER_EVALUATION_ISSUES:${entry.id}`);

  const terrain = sampleHEarthTerrainField(entry.x, entry.z);
  const surface = sampleHEarthSurfaceState(entry.x, entry.z);
  equal(terrain.valid, true, `TERRAIN_FIXTURE_INVALID:${entry.id}`);
  equal(surface.valid, true, `SURFACE_FIXTURE_INVALID:${entry.id}`);
  equal(sample.bedElevation, terrain.elevation,
    `BED_TERRAIN_CORRESPONDENCE:${entry.id}`);
  equal(sample.shorelineDistance, terrain.shorelineDistance,
    `SHORELINE_DISTANCE_CORRESPONDENCE:${entry.id}`);
  equal(sample.shorelineZ, terrain.shorelineZ,
    `SHORELINE_Z_CORRESPONDENCE:${entry.id}`);
  equal(sample.semanticAddressId, surface.semanticAddressId,
    `SEMANTIC_ADDRESS_CORRESPONDENCE:${entry.id}`);
  equal(sample.chunkId, surface.chunkId,
    `CHUNK_CORRESPONDENCE:${entry.id}`);
  deepEqual(sample.formationIds, surface.formationIds,
    `FORMATION_CORRESPONDENCE:${entry.id}`);

  equal(sample.sourceIdentities.terrainFieldContractId,
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    `TERRAIN_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.sourceIdentities.surfaceStateContractId,
    H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
    `SURFACE_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.sourceIdentities.atmosphereStateContractId,
    H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    `ATMOSPHERE_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.sourceIdentities.waterStateContractId,
    H_EARTH_WATER_STATE_CONTRACT_ID,
    `WATER_SOURCE_IDENTITY:${entry.id}`);
  equal(sample.correspondenceStatus, 'WATER_UPSTREAM_CORRESPONDENCE_PASS',
    `CORRESPONDENCE_STATUS:${entry.id}`);
  deepEqual(sample.issues, [], `WATER_SAMPLE_ISSUES:${entry.id}`);

  for (const field of [
    'bedElevation', 'depth', 'shorelineDistance', 'shorelineZ',
    'waterwardDistance', 'flowSpeed', 'waveAmplitude', 'waveFrequency',
    'turbidity', 'foamIntensity', 'wetnessTransfer'
  ]) {
    check(finite(sample[field]), `NONFINITE_WATER_FIELD:${entry.id}:${field}`);
  }
  check(sample.depth >= 0, `NEGATIVE_DEPTH:${entry.id}`);
  for (const field of ['turbidity', 'foamIntensity', 'wetnessTransfer']) {
    check(sample[field] >= 0 && sample[field] <= 1,
      `WATER_FIELD_RANGE:${entry.id}:${field}`);
  }

  forbiddenFields.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FORBIDDEN_WATER_OUTPUT:${entry.id}:${field}`);
  });

  if (sample.waterPresent) {
    check(typeof sample.waterBodyId === 'string' && sample.waterBodyId.length > 0,
      `WATER_BODY_ID_MISSING:${entry.id}`);
    check(finite(sample.surfaceElevation), `SURFACE_ELEVATION_NONFINITE:${entry.id}`);
    check(Math.abs(Math.hypot(sample.flowDirection.x, sample.flowDirection.z) - 1) < 1e-10,
      `FLOW_DIRECTION_NOT_NORMALIZED:${entry.id}`);
    check(Math.abs(Math.hypot(sample.waveDirection.x, sample.waveDirection.z) - 1) < 1e-10,
      `WAVE_DIRECTION_NOT_NORMALIZED:${entry.id}`);
    check(sample.waveAmplitude > 0, `WAVE_AMPLITUDE_NOT_POSITIVE:${entry.id}`);
    check(sample.waveFrequency > 0, `WAVE_FREQUENCY_NOT_POSITIVE:${entry.id}`);
  } else {
    equal(sample.waterBodyId, null, `LAND_WATER_BODY_PRESENT:${entry.id}`);
    equal(sample.surfaceElevation, null, `LAND_SURFACE_ELEVATION_PRESENT:${entry.id}`);
    equal(sample.depth, 0, `LAND_DEPTH_PRESENT:${entry.id}`);
    equal(sample.flowSpeed, 0, `LAND_FLOW_PRESENT:${entry.id}`);
    equal(sample.waveAmplitude, 0, `LAND_WAVE_PRESENT:${entry.id}`);
    equal(sample.buoyancyEligibility, false, `LAND_BUOYANCY_ELIGIBLE:${entry.id}`);
  }

  if (entry.id === 'OPEN_WATER_SUBMERGED') {
    equal(sample.underwaterState, 'SUBMERGED', 'SUBMERGED_CLASSIFICATION_MISSING');
  }
  if (entry.id === 'CONTACT_WATERWARD') {
    equal(sample.underwaterState, 'CONTACT_ZONE', 'CONTACT_UNDERWATER_CLASSIFICATION_MISSING');
  }

  assertDeepFrozen(sample, `water.${entry.id}`);

  const timeSeconds = index * 7.5 + 3;
  const plan = buildHEarthWaterPresentation(sample, {
    atmosphereState: atmosphere,
    timeSeconds,
    cameraDistance: 40 + index * 48,
    horizonDistance: 512
  });
  equal(plan.eligible, true, `WATER_PRESENTATION_INVALID:${entry.id}`);
  equal(plan.contractId, H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
    `WATER_PRESENTATION_CONTRACT:${entry.id}`);
  const presentationEvaluation = evaluateHEarthWaterPresentation(plan);
  equal(presentationEvaluation.eligible, true,
    `WATER_PRESENTATION_EVALUATION_FAIL:${entry.id}`);
  deepEqual(presentationEvaluation.issues, [],
    `WATER_PRESENTATION_EVALUATION_ISSUES:${entry.id}`);
  equal(plan.visible, sample.waterPresent,
    `WATER_PRESENTATION_VISIBILITY:${entry.id}`);
  equal(plan.authority.ownsNativeWaterTruth, false,
    `PRESENTATION_NATIVE_WATER_AUTHORITY_LEAK:${entry.id}`);
  equal(plan.authority.ownsRendererLoop, false,
    `PRESENTATION_RENDERER_LOOP_LEAK:${entry.id}`);
  equal(plan.authority.mutatesRenderer, false,
    `PRESENTATION_RENDERER_MUTATION:${entry.id}`);
  equal(plan.authority.createsDom, false,
    `PRESENTATION_DOM_CREATION:${entry.id}`);
  equal(plan.authority.createsCanvas, false,
    `PRESENTATION_CANVAS_CREATION:${entry.id}`);
  assertDeepFrozen(plan, `presentation.${entry.id}`);

  if (sample.waterPresent) {
    check(Array.isArray(plan.surfaceColor) && plan.surfaceColor.length === 4,
      `WATER_COLOR_SHAPE:${entry.id}`);
    plan.surfaceColor.forEach((channel, channelIndex) => {
      check(Number.isInteger(channel) && channel >= 0 && channel <= 255,
        `WATER_COLOR_CHANNEL:${entry.id}:${channelIndex}`);
    });
    equal(plan.horizonConsistency.required, true,
      `HORIZON_CONTINUITY_NOT_REQUIRED:${entry.id}`);
    equal(plan.horizonConsistency.finiteGeometryOwnedHere, false,
      `PRESENTATION_GEOMETRY_AUTHORITY_LEAK:${entry.id}`);
    check(plan.shorelineFoam.intensity >= 0 && plan.shorelineFoam.intensity <= 1,
      `FOAM_INTENSITY_RANGE:${entry.id}`);
    check(finite(plan.waveMotion.phase), `WAVE_PHASE_NONFINITE:${entry.id}`);
    check(finite(plan.waveMotion.surfacePresentationOffset),
      `WAVE_OFFSET_NONFINITE:${entry.id}`);

    const phaseA = computeHEarthWaterWavePhase(sample, timeSeconds);
    const phaseB = computeHEarthWaterWavePhase(sample, timeSeconds);
    deepEqual(phaseA, phaseB, `WAVE_PHASE_NONDETERMINISTIC:${entry.id}`);
    const phaseLater = computeHEarthWaterWavePhase(sample, timeSeconds + 0.5);
    check(Math.abs(phaseLater.phase - phaseA.phase) > 1e-8,
      `WAVE_PHASE_NOT_ADVANCING:${entry.id}`);
    const color = computeHEarthWaterDepthColor(sample, atmosphere);
    deepEqual(color, plan.surfaceColor, `DEPTH_COLOR_MISMATCH:${entry.id}`);
  } else {
    deepEqual(plan.surfaceColor, [0, 0, 0, 0], `LAND_WATER_COLOR_PRESENT:${entry.id}`);
    equal(plan.horizonConsistency.required, false,
      `LAND_HORIZON_WATER_REQUIRED:${entry.id}`);
  }

  if (sample.underwaterState === 'SUBMERGED') {
    equal(plan.underwater.overlayRequired, true,
      `UNDERWATER_OVERLAY_MISSING:${entry.id}`);
    check(plan.underwater.distortionStrength > 0,
      `UNDERWATER_DISTORTION_MISSING:${entry.id}`);
  }

  summaries.push({
    fixtureId: entry.id,
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

const waterwardSamples = firstSamples
  .filter(({ sample }) => sample.waterPresent)
  .sort((left, right) => right.sample.shorelineDistance - left.sample.shorelineDistance);
for (let index = 1; index < waterwardSamples.length; index += 1) {
  check(waterwardSamples[index].sample.depth >=
    waterwardSamples[index - 1].sample.depth - 1e-10,
  `DEPTH_NOT_MONOTONIC_WATERWARD:${index}`);
}

const dry = firstSamples.find(({ fixture: entry }) => entry.id === 'DRY_INLAND').sample;
const contact = firstSamples.find(({ fixture: entry }) => entry.id === 'CONTACT_WATERWARD').sample;
const shallow = firstSamples.find(({ fixture: entry }) => entry.id === 'SHALLOW_WATER').sample;
const nearshore = firstSamples.find(({ fixture: entry }) => entry.id === 'NEARSHORE_WATER').sample;
const open = firstSamples.find(({ fixture: entry }) => entry.id === 'OPEN_WATER').sample;
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
const invalidPresentation = buildHEarthWaterPresentation(open, {
  atmosphereState: atmosphere,
  timeSeconds: 0,
  cameraDistance: -1,
  horizonDistance: 512
});
equal(invalidPresentation.eligible, false,
  'INVALID_WATER_PRESENTATION_ACCEPTED');

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
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunSummaries = secondSamples.map(({ fixture: entry, sample }, index) => {
  const plan = buildHEarthWaterPresentation(sample, {
    atmosphereState: atmosphere,
    timeSeconds: index * 7.5 + 3,
    cameraDistance: 40 + index * 48,
    horizonDistance: 512
  });
  return {
    fixtureId: entry.id,
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
