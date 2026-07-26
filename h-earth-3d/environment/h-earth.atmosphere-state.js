/**
 * /h-earth-3d/environment/h-earth.atmosphere-state.js
 *
 * H_EARTH_CANONICAL_ATMOSPHERE_STATE_RUN_7C_v1
 *
 * Canonical low-cost atmosphere state authority for H-Earth. It owns native
 * sun, sky, haze, fog, cloud, wind, and time-of-day state. It creates no
 * geometry, renderer, camera, navigation, hydrology, traversal, biome,
 * population, audio-projection, spatial-lifecycle, route, or deployment
 * authority.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const mixColor = (a, b, t) => deepFreeze([
  Math.round(mix(a[0], b[0], t)),
  Math.round(mix(a[1], b[1], t)),
  Math.round(mix(a[2], b[2], t)),
  255
]);
const normalizeXZ = ({ x, z }) => {
  const length = Math.hypot(x, z);
  return length > Number.EPSILON
    ? deepFreeze({ x: x / length, z: z / length })
    : deepFreeze({ x: 1, z: 0 });
};
const normalizeXYZ = ({ x, y, z }) => {
  const length = Math.hypot(x, y, z);
  return length > Number.EPSILON
    ? deepFreeze({ x: x / length, y: y / length, z: z / length })
    : deepFreeze({ x: 0, y: 1, z: 0 });
};
const normalizeHours = (value) => ((value % 24) + 24) % 24;

export const H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID =
  'H_EARTH_CANONICAL_ATMOSPHERE_STATE_RUN_7C_v1';

export const H_EARTH_ATMOSPHERE_STATE_REVISION = 1;

export const H_EARTH_ATMOSPHERE_STATE_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'terrainElevation',
  'surfaceClass',
  'waterDepth',
  'flowDirection',
  'traversalClass',
  'traversalCost',
  'biomeClass',
  'populationEligibility',
  'requiredPopulationInstances',
  'ambientAudioClass',
  'audioLayerSelection',
  'chunkState',
  'proxyState',
  'loadingState',
  'geometry',
  'renderPlan',
  'cameraState'
]);

const COLOR_PROFILES = deepFreeze({
  nightZenith: [10, 18, 34, 255],
  nightHorizon: [32, 42, 58, 255],
  dawnZenith: [61, 89, 126, 255],
  dawnHorizon: [222, 158, 111, 255],
  dayZenith: [58, 113, 166, 255],
  dayHorizon: [183, 207, 213, 255],
  groundHazeNight: [38, 48, 56, 255],
  groundHazeDay: [132, 153, 148, 255],
  sunWarm: [255, 204, 136, 255],
  sunDay: [255, 242, 205, 255]
});

export const H_EARTH_ATMOSPHERE_STATE = deepFreeze({
  contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  defaultTimeOfDayHours: 15.25,
  defaultObserverElevation: 2.25,
  defaultViewDistance: 160,
  cloudProfile: {
    cloudClass: 'SPARSE_COASTAL_CUMULUS',
    cloudCoverage: 0.18,
    cloudAltitude: 1450,
    cloudThickness: 260
  },
  windProfile: {
    direction: { x: 0.82, z: -0.57 },
    speed: 5.4,
    gustStrength: 0.16
  },
  fogProfile: {
    fogStartDistance: 92,
    fogFalloff: 0.0062,
    maximumFogFactor: 0.86,
    distanceDesaturationStrength: 0.42
  },
  ownership: {
    ownsSunState: true,
    ownsSkyState: true,
    ownsHazeState: true,
    ownsFogState: true,
    ownsCloudState: true,
    ownsWindState: true,
    ownsTimeOfDayState: true,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsTraversal: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsRenderer: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsAdmission: false,
    ownsFrame: false,
    ownsCompositor: false,
    ownsController: false,
    ownsPublicRoute: false
  }
});

function rejectAtmosphereSample({ timeOfDayHours, observerElevation, viewDistance }) {
  return deepFreeze({
    valid: false,
    status: 'ATMOSPHERE_STATE_REJECTED_INVALID_INPUT',
    contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION,
    timeOfDayHours,
    observerElevation,
    viewDistance,
    issues: ['ATMOSPHERE_INPUT_NOT_FINITE']
  });
}

function resolveSolarState(timeOfDayHours) {
  const dayAngle = ((timeOfDayHours - 6) / 24) * Math.PI * 2;
  const rawElevation = Math.sin(dayAngle) * 72;
  const sunElevation = clamp(rawElevation, -18, 72);
  const azimuth = ((timeOfDayHours / 24) * 360 + 125) % 360;
  const elevationRadians = sunElevation * Math.PI / 180;
  const azimuthRadians = azimuth * Math.PI / 180;
  const sunDirection = normalizeXYZ({
    x: Math.cos(elevationRadians) * Math.sin(azimuthRadians),
    y: Math.sin(elevationRadians),
    z: -Math.cos(elevationRadians) * Math.cos(azimuthRadians)
  });
  const daylight = smoothstep(-6, 8, sunElevation);
  const noonStrength = clamp01(Math.sin(clamp(sunElevation, 0, 90) * Math.PI / 180));
  const sunIntensity = daylight * (0.34 + 0.66 * noonStrength);
  return deepFreeze({
    sunDirection,
    sunElevation,
    sunAzimuth: azimuth,
    daylight,
    sunIntensity
  });
}

function resolveSkyColors(solar) {
  const twilight = smoothstep(-12, 8, solar.sunElevation);
  const fullDay = smoothstep(4, 28, solar.sunElevation);
  const dawnZenith = mixColor(
    COLOR_PROFILES.nightZenith,
    COLOR_PROFILES.dawnZenith,
    twilight
  );
  const dawnHorizon = mixColor(
    COLOR_PROFILES.nightHorizon,
    COLOR_PROFILES.dawnHorizon,
    twilight
  );
  return deepFreeze({
    skyZenithColor: mixColor(dawnZenith, COLOR_PROFILES.dayZenith, fullDay),
    skyHorizonColor: mixColor(dawnHorizon, COLOR_PROFILES.dayHorizon, fullDay),
    groundHazeColor: mixColor(
      COLOR_PROFILES.groundHazeNight,
      COLOR_PROFILES.groundHazeDay,
      solar.daylight
    ),
    sunColor: mixColor(
      COLOR_PROFILES.sunWarm,
      COLOR_PROFILES.sunDay,
      fullDay
    )
  });
}

export function sampleHEarthAtmosphereState({
  timeOfDayHours = H_EARTH_ATMOSPHERE_STATE.defaultTimeOfDayHours,
  observerElevation = H_EARTH_ATMOSPHERE_STATE.defaultObserverElevation,
  viewDistance = H_EARTH_ATMOSPHERE_STATE.defaultViewDistance
} = {}) {
  if (![timeOfDayHours, observerElevation, viewDistance].every(finite) ||
      viewDistance < 0) {
    return rejectAtmosphereSample({
      timeOfDayHours,
      observerElevation,
      viewDistance
    });
  }

  const normalizedTime = normalizeHours(timeOfDayHours);
  const solar = resolveSolarState(normalizedTime);
  const colors = resolveSkyColors(solar);
  const altitudeRelief = clamp01(observerElevation / 120);
  const distancePressure = clamp01(viewDistance / 512);
  const hazeDensity = clamp01(
    0.2 + distancePressure * 0.24 - altitudeRelief * 0.08
  );
  const aerialPerspectiveStrength = clamp01(
    0.28 + distancePressure * 0.36 + hazeDensity * 0.18
  );
  const fogStartDistance = Math.max(
    24,
    H_EARTH_ATMOSPHERE_STATE.fogProfile.fogStartDistance - hazeDensity * 18
  );
  const fogFalloff = H_EARTH_ATMOSPHERE_STATE.fogProfile.fogFalloff *
    (0.82 + hazeDensity * 0.46);
  const windDirection = normalizeXZ(
    H_EARTH_ATMOSPHERE_STATE.windProfile.direction
  );

  return deepFreeze({
    valid: true,
    status: 'ATMOSPHERE_STATE_SAMPLE_COMPLETE',
    contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION,
    timeOfDay: {
      hours: normalizedTime,
      phase: solar.sunElevation < -6
        ? 'NIGHT'
        : solar.sunElevation < 8
          ? 'TWILIGHT'
          : solar.sunElevation < 42
            ? 'DAY_LOW_SUN'
            : 'DAY_HIGH_SUN'
    },
    sunDirection: solar.sunDirection,
    sunElevation: solar.sunElevation,
    sunAzimuth: solar.sunAzimuth,
    sunIntensity: solar.sunIntensity,
    sunColor: colors.sunColor,
    skyZenithColor: colors.skyZenithColor,
    skyHorizonColor: colors.skyHorizonColor,
    groundHazeColor: colors.groundHazeColor,
    hazeDensity,
    aerialPerspectiveStrength,
    fogStartDistance,
    fogFalloff,
    maximumFogFactor:
      H_EARTH_ATMOSPHERE_STATE.fogProfile.maximumFogFactor,
    distanceDesaturationStrength:
      H_EARTH_ATMOSPHERE_STATE.fogProfile.distanceDesaturationStrength,
    cloudCoverage:
      H_EARTH_ATMOSPHERE_STATE.cloudProfile.cloudCoverage,
    cloudAltitude:
      H_EARTH_ATMOSPHERE_STATE.cloudProfile.cloudAltitude,
    cloudThickness:
      H_EARTH_ATMOSPHERE_STATE.cloudProfile.cloudThickness,
    cloudClass:
      H_EARTH_ATMOSPHERE_STATE.cloudProfile.cloudClass,
    windDirection,
    windSpeed: H_EARTH_ATMOSPHERE_STATE.windProfile.speed,
    windGustStrength:
      H_EARTH_ATMOSPHERE_STATE.windProfile.gustStrength,
    observerElevation,
    viewDistance,
    sourceIdentities: {
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
      atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION
    },
    issues: []
  });
}

export function evaluateHEarthAtmosphereStateSample(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('ATMOSPHERE_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    issues.push('ATMOSPHERE_CONTRACT_ID_MISMATCH');
  }
  const numericFields = [
    'sunElevation',
    'sunAzimuth',
    'sunIntensity',
    'hazeDensity',
    'aerialPerspectiveStrength',
    'fogStartDistance',
    'fogFalloff',
    'maximumFogFactor',
    'distanceDesaturationStrength',
    'cloudCoverage',
    'cloudAltitude',
    'cloudThickness',
    'windSpeed',
    'windGustStrength',
    'observerElevation',
    'viewDistance'
  ];
  numericFields.forEach((field) => {
    if (!finite(sample?.[field])) issues.push(`NONFINITE_FIELD:${field}`);
  });
  for (const vectorName of ['sunDirection', 'windDirection']) {
    const vector = sample?.[vectorName];
    if (!vector || Object.values(vector).some((value) => !finite(value))) {
      issues.push(`INVALID_VECTOR:${vectorName}`);
    }
  }
  for (const colorName of [
    'sunColor',
    'skyZenithColor',
    'skyHorizonColor',
    'groundHazeColor'
  ]) {
    const color = sample?.[colorName];
    if (!Array.isArray(color) || color.length !== 4 ||
        color.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
      issues.push(`INVALID_COLOR:${colorName}`);
    }
  }
  H_EARTH_ATMOSPHERE_STATE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(sample ?? {}, field)) {
      issues.push(`FORBIDDEN_NATIVE_OUTPUT:${field}`);
    }
  });
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'ATMOSPHERE_STATE_SAMPLE_PASS'
      : 'ATMOSPHERE_STATE_SAMPLE_FAIL',
    contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    issues
  });
}

export function getHEarthAtmosphereStateReceipt() {
  const sample = sampleHEarthAtmosphereState();
  const evaluation = evaluateHEarthAtmosphereStateSample(sample);
  return deepFreeze({
    receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7C_ATMOSPHERE_STATE_RECEIPT',
    contractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    atmosphereStateRevision: H_EARTH_ATMOSPHERE_STATE_REVISION,
    eligible: evaluation.eligible,
    status: evaluation.status,
    nativeAuthority: [
      'SUN',
      'SKY',
      'HAZE',
      'FOG',
      'CLOUD',
      'WIND',
      'TIME_OF_DAY'
    ],
    forbiddenNativeOutputs:
      H_EARTH_ATMOSPHERE_STATE_FORBIDDEN_NATIVE_OUTPUTS,
    issues: evaluation.issues
  });
}
