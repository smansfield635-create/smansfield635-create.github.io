import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  H_EARTH_ATMOSPHERE_STATE,
  H_EARTH_ATMOSPHERE_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample,
  getHEarthAtmosphereStateReceipt
} from '../environment/h-earth.atmosphere-state.js';

import {
  H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  H_EARTH_ATMOSPHERE_PRESENTATION,
  computeHEarthAtmosphericFogFactor,
  sampleHEarthAtmosphereSkyColor,
  applyHEarthAtmosphericDistanceToColor,
  buildHEarthAtmospherePresentation,
  evaluateHEarthAtmospherePresentation,
  getHEarthAtmospherePresentationReceipt
} from '../../showroom/globe/h-earth/render/environment-atmosphere.js';

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

const forbiddenAuthorityFields = [
  ...H_EARTH_ATMOSPHERE_STATE_FORBIDDEN_NATIVE_OUTPUTS,
  'semanticAddressId',
  'chunkId',
  'formationIds',
  'surfaceStateRevision',
  'environmentRevision'
];

const timeFixtures = [
  { id: 'NIGHT', hours: 2.5, observerElevation: 2.25, viewDistance: 160 },
  { id: 'DAWN', hours: 6.5, observerElevation: 2.25, viewDistance: 160 },
  { id: 'MORNING', hours: 9, observerElevation: 8, viewDistance: 220 },
  { id: 'NOON', hours: 12, observerElevation: 24, viewDistance: 320 },
  { id: 'AFTERNOON', hours: 15.25, observerElevation: 2.25, viewDistance: 160 },
  { id: 'SUNSET', hours: 18.25, observerElevation: 2.25, viewDistance: 180 },
  { id: 'WRAPPED_TIME', hours: 30.5, observerElevation: 2.25, viewDistance: 160 }
];

const firstSamples = timeFixtures.map((fixture) => ({
  fixture,
  sample: sampleHEarthAtmosphereState({
    timeOfDayHours: fixture.hours,
    observerElevation: fixture.observerElevation,
    viewDistance: fixture.viewDistance
  })
}));
const secondSamples = timeFixtures.map((fixture) => ({
  fixture,
  sample: sampleHEarthAtmosphereState({
    timeOfDayHours: fixture.hours,
    observerElevation: fixture.observerElevation,
    viewDistance: fixture.viewDistance
  })
}));

deepEqual(firstSamples, secondSamples, 'DETERMINISTIC_ATMOSPHERE_RERUN_MISMATCH');

const observedPhases = new Set();
const presentationSummaries = [];
for (const { fixture, sample } of firstSamples) {
  equal(sample.valid, true, `SAMPLE_INVALID:${fixture.id}`);
  equal(sample.contractId, H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    `CONTRACT_ID_MISMATCH:${fixture.id}`);
  equal(sample.atmosphereStateRevision, 1,
    `REVISION_MISMATCH:${fixture.id}`);
  const evaluation = evaluateHEarthAtmosphereStateSample(sample);
  equal(evaluation.eligible, true, `EVALUATION_FAIL:${fixture.id}`);
  deepEqual(evaluation.issues, [], `EVALUATION_ISSUES:${fixture.id}`);
  observedPhases.add(sample.timeOfDay.phase);

  check(finite(sample.sunElevation), `SUN_ELEVATION_NONFINITE:${fixture.id}`);
  check(finite(sample.sunAzimuth), `SUN_AZIMUTH_NONFINITE:${fixture.id}`);
  check(sample.sunIntensity >= 0 && sample.sunIntensity <= 1,
    `SUN_INTENSITY_RANGE:${fixture.id}`);
  check(sample.hazeDensity >= 0 && sample.hazeDensity <= 1,
    `HAZE_DENSITY_RANGE:${fixture.id}`);
  check(sample.aerialPerspectiveStrength >= 0 &&
    sample.aerialPerspectiveStrength <= 1,
    `AERIAL_PERSPECTIVE_RANGE:${fixture.id}`);
  check(sample.fogStartDistance > 0, `FOG_START_INVALID:${fixture.id}`);
  check(sample.fogFalloff > 0, `FOG_FALLOFF_INVALID:${fixture.id}`);
  check(sample.maximumFogFactor >= 0 && sample.maximumFogFactor <= 1,
    `MAXIMUM_FOG_RANGE:${fixture.id}`);
  check(sample.distanceDesaturationStrength >= 0 &&
    sample.distanceDesaturationStrength <= 1,
    `DESATURATION_RANGE:${fixture.id}`);
  check(sample.cloudCoverage >= 0 && sample.cloudCoverage <= 1,
    `CLOUD_COVERAGE_RANGE:${fixture.id}`);
  check(sample.cloudAltitude > 0, `CLOUD_ALTITUDE_INVALID:${fixture.id}`);
  check(sample.windSpeed >= 0, `WIND_SPEED_INVALID:${fixture.id}`);

  const sunLength = Math.hypot(
    sample.sunDirection.x,
    sample.sunDirection.y,
    sample.sunDirection.z
  );
  const windLength = Math.hypot(
    sample.windDirection.x,
    sample.windDirection.z
  );
  check(Math.abs(sunLength - 1) < 1e-12,
    `SUN_DIRECTION_NOT_NORMALIZED:${fixture.id}`);
  check(Math.abs(windLength - 1) < 1e-12,
    `WIND_DIRECTION_NOT_NORMALIZED:${fixture.id}`);

  for (const colorName of [
    'sunColor',
    'skyZenithColor',
    'skyHorizonColor',
    'groundHazeColor'
  ]) {
    const color = sample[colorName];
    check(Array.isArray(color) && color.length === 4,
      `COLOR_SHAPE:${fixture.id}:${colorName}`);
    color.forEach((channel, index) => {
      check(Number.isInteger(channel) && channel >= 0 && channel <= 255,
        `COLOR_CHANNEL:${fixture.id}:${colorName}:${index}`);
    });
    equal(color[3], 255, `COLOR_ALPHA_NOT_OPAQUE:${fixture.id}:${colorName}`);
  }

  forbiddenAuthorityFields.forEach((field) => {
    check(!Object.prototype.hasOwnProperty.call(sample, field),
      `FORBIDDEN_ATMOSPHERE_OUTPUT:${fixture.id}:${field}`);
  });

  equal(sample.sourceIdentities.atmosphereStateContractId,
    H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    `SOURCE_IDENTITY_CONTRACT:${fixture.id}`);
  equal(sample.sourceIdentities.atmosphereStateRevision, 1,
    `SOURCE_IDENTITY_REVISION:${fixture.id}`);
  assertDeepFrozen(sample, `atmosphere.${fixture.id}`);

  const plan = buildHEarthAtmospherePresentation(sample, {
    viewportWidth: fixture.id === 'NOON' ? 390 : 844,
    viewportHeight: fixture.id === 'NOON' ? 844 : 390,
    cameraFarPlane: 512
  });
  equal(plan.eligible, true, `PRESENTATION_INVALID:${fixture.id}`);
  equal(plan.contractId, H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    `PRESENTATION_CONTRACT:${fixture.id}`);
  const planEvaluation = evaluateHEarthAtmospherePresentation(plan);
  equal(planEvaluation.eligible, true,
    `PRESENTATION_EVALUATION_FAIL:${fixture.id}`);
  deepEqual(planEvaluation.issues, [],
    `PRESENTATION_EVALUATION_ISSUES:${fixture.id}`);
  equal(plan.skyGradientStops.length, 4,
    `SKY_GRADIENT_STOP_COUNT:${fixture.id}`);
  plan.skyGradientStops.forEach((stop, index) => {
    check(stop.offset >= 0 && stop.offset <= 1,
      `SKY_STOP_OFFSET:${fixture.id}:${index}`);
    equal(stop.rgba[3], 255,
      `SKY_STOP_ALPHA:${fixture.id}:${index}`);
  });
  equal(plan.frameClosure.transparentFallbackPermitted, false,
    `TRANSPARENT_FALLBACK:${fixture.id}`);
  equal(plan.frameClosure.grayFallbackPermitted, false,
    `GRAY_FALLBACK:${fixture.id}`);
  equal(plan.frameClosure.fullViewportSkyCoverageRequired, true,
    `SKY_CLOSURE_REQUIRED:${fixture.id}`);
  equal(plan.authority.ownsNativeAtmosphereTruth, false,
    `PRESENTATION_NATIVE_AUTHORITY_LEAK:${fixture.id}`);
  equal(plan.authority.ownsRendererLoop, false,
    `PRESENTATION_RENDERER_AUTHORITY_LEAK:${fixture.id}`);
  equal(plan.authority.ownsCamera, false,
    `PRESENTATION_CAMERA_AUTHORITY_LEAK:${fixture.id}`);
  equal(plan.authority.createsDom, false,
    `PRESENTATION_DOM_CREATION:${fixture.id}`);
  equal(plan.authority.createsCanvas, false,
    `PRESENTATION_CANVAS_CREATION:${fixture.id}`);
  assertDeepFrozen(plan, `presentation.${fixture.id}`);

  for (const normalizedY of [0, 0.18, 0.35, 0.52, 0.72, 1]) {
    const skyColor = sampleHEarthAtmosphereSkyColor(normalizedY, sample);
    check(Array.isArray(skyColor) && skyColor.length === 4,
      `SKY_SAMPLE_SHAPE:${fixture.id}:${normalizedY}`);
    equal(skyColor[3], 255,
      `SKY_SAMPLE_ALPHA:${fixture.id}:${normalizedY}`);
  }

  const distances = [0, 40, 92, 120, 180, 260, 384, 512, 768];
  let previousFog = -1;
  let previousDesaturation = -1;
  distances.forEach((distance) => {
    const fog = computeHEarthAtmosphericFogFactor(distance, sample);
    check(finite(fog), `FOG_NONFINITE:${fixture.id}:${distance}`);
    check(fog >= previousFog - 1e-12,
      `FOG_NOT_MONOTONIC:${fixture.id}:${distance}`);
    check(fog >= 0 && fog <= sample.maximumFogFactor + 1e-12,
      `FOG_RANGE:${fixture.id}:${distance}`);
    const projected = applyHEarthAtmosphericDistanceToColor({
      baseColor: [118, 92, 54, 255],
      distance,
      atmosphereState: sample
    });
    equal(projected.eligible, true,
      `DISTANCE_COLOR_REJECTED:${fixture.id}:${distance}`);
    equal(projected.rgba[3], 255,
      `DISTANCE_COLOR_ALPHA:${fixture.id}:${distance}`);
    check(projected.desaturationFactor >= previousDesaturation - 1e-12,
      `DESATURATION_NOT_MONOTONIC:${fixture.id}:${distance}`);
    previousFog = fog;
    previousDesaturation = projected.desaturationFactor;
  });

  presentationSummaries.push({
    fixtureId: fixture.id,
    timeOfDayHours: sample.timeOfDay.hours,
    phase: sample.timeOfDay.phase,
    sunElevation: sample.sunElevation,
    sunIntensity: sample.sunIntensity,
    hazeDensity: sample.hazeDensity,
    fogStartDistance: sample.fogStartDistance,
    fogFactorAtFarPlane: plan.distanceFog.factorAtFarPlane,
    skyTop: plan.skyGradientStops[0].rgba,
    skyHorizon: plan.skyGradientStops[2].rgba
  });
}

check(observedPhases.has('NIGHT'), 'NIGHT_PHASE_NOT_OBSERVED');
check(observedPhases.has('TWILIGHT'), 'TWILIGHT_PHASE_NOT_OBSERVED');
check(observedPhases.has('DAY_LOW_SUN'), 'DAY_LOW_SUN_PHASE_NOT_OBSERVED');
check(observedPhases.has('DAY_HIGH_SUN'), 'DAY_HIGH_SUN_PHASE_NOT_OBSERVED');

equal(H_EARTH_ATMOSPHERE_STATE.ownership.ownsSunState, true,
  'SUN_AUTHORITY_NOT_DECLARED');
equal(H_EARTH_ATMOSPHERE_STATE.ownership.ownsRenderer, false,
  'ATMOSPHERE_RENDERER_AUTHORITY_LEAK');
equal(H_EARTH_ATMOSPHERE_STATE.ownership.ownsCamera, false,
  'ATMOSPHERE_CAMERA_AUTHORITY_LEAK');
equal(H_EARTH_ATMOSPHERE_PRESENTATION.ownership.ownsNativeAtmosphereTruth, false,
  'PRESENTATION_NATIVE_TRUTH_LEAK');
equal(H_EARTH_ATMOSPHERE_PRESENTATION.ownership.mutatesRenderer, false,
  'PRESENTATION_RENDERER_MUTATION');

const invalidAtmosphereInputs = [
  { timeOfDayHours: Number.NaN },
  { observerElevation: Number.POSITIVE_INFINITY },
  { viewDistance: -1 },
  { timeOfDayHours: 'noon' }
];
invalidAtmosphereInputs.forEach((input, index) => {
  const rejected = sampleHEarthAtmosphereState(input);
  equal(rejected.valid, false, `INVALID_ATMOSPHERE_ACCEPTED:${index}`);
  equal(rejected.status, 'ATMOSPHERE_STATE_REJECTED_INVALID_INPUT',
    `INVALID_ATMOSPHERE_STATUS:${index}`);
});

equal(sampleHEarthAtmosphereSkyColor(Number.NaN, firstSamples[0].sample), null,
  'NONFINITE_SKY_COORDINATE_ACCEPTED');
check(Number.isNaN(computeHEarthAtmosphericFogFactor(-1, firstSamples[0].sample)),
  'NEGATIVE_FOG_DISTANCE_ACCEPTED');
const invalidColor = applyHEarthAtmosphericDistanceToColor({
  baseColor: [1, 2, 3],
  distance: 10,
  atmosphereState: firstSamples[0].sample
});
equal(invalidColor.eligible, false, 'INVALID_BASE_COLOR_ACCEPTED');
const invalidPlan = buildHEarthAtmospherePresentation(firstSamples[0].sample, {
  viewportWidth: 0,
  viewportHeight: 360,
  cameraFarPlane: 512
});
equal(invalidPlan.eligible, false, 'INVALID_PRESENTATION_DIMENSIONS_ACCEPTED');

const atmosphereReceipt = getHEarthAtmosphereStateReceipt();
const presentationReceipt = getHEarthAtmospherePresentationReceipt();
equal(atmosphereReceipt.eligible, true, 'ATMOSPHERE_RECEIPT_FAIL');
equal(presentationReceipt.eligible, true, 'PRESENTATION_RECEIPT_FAIL');
deepEqual(atmosphereReceipt.issues, [], 'ATMOSPHERE_RECEIPT_ISSUES');
deepEqual(presentationReceipt.issues, [], 'PRESENTATION_RECEIPT_ISSUES');

const deterministicCore = {
  contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  presentationContractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  atmosphereStateRevision: 1,
  presentationRevision: 1,
  fixtures: presentationSummaries,
  observedPhases: [...observedPhases].sort(),
  forbiddenOutputsObserved: 0
};
const deterministicDigest = digest(deterministicCore);
const rerunDigest = digest({
  ...deterministicCore,
  fixtures: secondSamples.map(({ fixture, sample }) => {
    const plan = buildHEarthAtmospherePresentation(sample, {
      viewportWidth: fixture.id === 'NOON' ? 390 : 844,
      viewportHeight: fixture.id === 'NOON' ? 844 : 390,
      cameraFarPlane: 512
    });
    return {
      fixtureId: fixture.id,
      timeOfDayHours: sample.timeOfDay.hours,
      phase: sample.timeOfDay.phase,
      sunElevation: sample.sunElevation,
      sunIntensity: sample.sunIntensity,
      hazeDensity: sample.hazeDensity,
      fogStartDistance: sample.fogStartDistance,
      fogFactorAtFarPlane: plan.distanceFog.factorAtFarPlane,
      skyTop: plan.skyGradientStops[0].rgba,
      skyHorizon: plan.skyGradientStops[2].rgba
    };
  })
});
equal(deterministicDigest, rerunDigest, 'DETERMINISTIC_DIGEST_RERUN_MISMATCH');

const execution = {
  receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7C_EXECUTION_CANDIDATE',
  contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  presentationContractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  eligible: true,
  status: 'RUN_7C_ATMOSPHERE_STATE_AND_PRESENTATION_PASS',
  runtime: process.version,
  fixtureCount: timeFixtures.length,
  phaseCount: observedPhases.size,
  assertionCount,
  passCount: assertionCount,
  failCount: 0,
  deterministicRerunMatch: true,
  deterministicDigest,
  observedPhases: [...observedPhases].sort(),
  forbiddenOutputsObserved: 0,
  workspaceExecution: true,
  localConstruction: false,
  createsDom: false,
  createsCanvas: false,
  rendererMutation: false,
  publicRouteMutation: false,
  productPromotionClaim: false,
  liveVerificationClaim: false,
  issues: []
};

const candidatePath = process.env.H_EARTH_RUN7C_EXECUTION_CANDIDATE ??
  'h-earth-run7c-execution-candidate.json';
writeFileSync(candidatePath, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(execution, null, 2));
