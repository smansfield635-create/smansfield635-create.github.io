/**
 * /showroom/globe/h-earth/render/environment-atmosphere.js
 *
 * H_EARTH_LOW_COST_ATMOSPHERE_PRESENTATION_RUN_7C_v1
 *
 * Pure presentation adapter for canonical H-Earth atmosphere state. It derives
 * a sky gradient, sun disc, horizon haze, distance fog, and terrain-distance
 * desaturation plan. It creates no native atmosphere, terrain, surface, water,
 * camera, navigation, geometry, frame, compositor, renderer-loop, route, or
 * deployment authority.
 */

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';

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
const mix = (a, b, t) => a + (b - a) * t;
const mixColor = (a, b, t) => [
  Math.round(mix(a[0], b[0], t)),
  Math.round(mix(a[1], b[1], t)),
  Math.round(mix(a[2], b[2], t)),
  255
];
const validateColor = (color) =>
  Array.isArray(color) && color.length === 4 &&
  color.every((value) => Number.isInteger(value) && value >= 0 && value <= 255);

export const H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID =
  'H_EARTH_LOW_COST_ATMOSPHERE_PRESENTATION_RUN_7C_v1';

export const H_EARTH_ATMOSPHERE_PRESENTATION = deepFreeze({
  contractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
  presentationRevision: 1,
  model: 'SKY_GRADIENT_SUN_DISC_HORIZON_HAZE_DISTANCE_FOG_TERRAIN_DESATURATION',
  consumesAtmosphereContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  implementationClass: 'PURE_PRESENTATION_PLAN_AND_COLOR_PROJECTION',
  ownership: {
    ownsNativeAtmosphereTruth: false,
    ownsSunTruth: false,
    ownsSkyTruth: false,
    ownsHazeTruth: false,
    ownsFogTruth: false,
    ownsCloudTruth: false,
    ownsWindTruth: false,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsCamera: false,
    ownsNavigation: false,
    ownsGeometry: false,
    ownsAdmission: false,
    ownsFrame: false,
    ownsCompositor: false,
    ownsRendererLoop: false,
    ownsPublicRoute: false,
    createsDom: false,
    createsCanvas: false,
    mutatesRenderer: false
  }
});

function validAtmosphere(sample) {
  return evaluateHEarthAtmosphereStateSample(sample).eligible === true;
}

export function computeHEarthAtmosphericFogFactor(
  distance,
  atmosphereState
) {
  if (!finite(distance) || distance < 0 || !validAtmosphere(atmosphereState)) {
    return Number.NaN;
  }
  const beyondStart = Math.max(0, distance - atmosphereState.fogStartDistance);
  const raw = 1 - Math.exp(-beyondStart * atmosphereState.fogFalloff);
  return clamp(raw, 0, atmosphereState.maximumFogFactor);
}

export function sampleHEarthAtmosphereSkyColor(
  normalizedY,
  atmosphereState
) {
  if (!finite(normalizedY) || !validAtmosphere(atmosphereState)) return null;
  const y = clamp01(normalizedY);
  const horizonToUpper = clamp01(y / 0.72);
  const base = mixColor(
    atmosphereState.skyHorizonColor,
    atmosphereState.skyZenithColor,
    horizonToUpper
  );
  const horizonHaze = clamp01(1 - Math.abs(y - 0.18) / 0.2) *
    atmosphereState.hazeDensity * 0.44;
  return deepFreeze(mixColor(base, atmosphereState.groundHazeColor, horizonHaze));
}

export function applyHEarthAtmosphericDistanceToColor({
  baseColor,
  distance,
  atmosphereState
}) {
  if (!validateColor(baseColor) || !finite(distance) || distance < 0 ||
      !validAtmosphere(atmosphereState)) {
    return deepFreeze({
      eligible: false,
      status: 'ATMOSPHERIC_DISTANCE_COLOR_REJECTED',
      rgba: null,
      fogFactor: Number.NaN,
      desaturationFactor: Number.NaN,
      issues: ['INVALID_DISTANCE_COLOR_INPUT']
    });
  }
  const fogFactor = computeHEarthAtmosphericFogFactor(
    distance,
    atmosphereState
  );
  const luminance = Math.round(
    baseColor[0] * 0.2126 + baseColor[1] * 0.7152 + baseColor[2] * 0.0722
  );
  const desaturationFactor = clamp01(
    fogFactor * atmosphereState.distanceDesaturationStrength
  );
  const desaturated = mixColor(
    baseColor,
    [luminance, luminance, luminance, 255],
    desaturationFactor
  );
  const rgba = mixColor(
    desaturated,
    atmosphereState.groundHazeColor,
    fogFactor
  );
  return deepFreeze({
    eligible: true,
    status: 'ATMOSPHERIC_DISTANCE_COLOR_COMPLETE',
    rgba,
    fogFactor,
    desaturationFactor,
    issues: []
  });
}

export function buildHEarthAtmospherePresentation(
  atmosphereState = sampleHEarthAtmosphereState(),
  {
    viewportWidth = 640,
    viewportHeight = 360,
    cameraFarPlane = 512
  } = {}
) {
  const issues = [];
  if (!validAtmosphere(atmosphereState)) {
    issues.push('ATMOSPHERE_STATE_INVALID');
  }
  if (![viewportWidth, viewportHeight, cameraFarPlane].every(finite) ||
      viewportWidth <= 0 || viewportHeight <= 0 || cameraFarPlane <= 0) {
    issues.push('PRESENTATION_DIMENSIONS_INVALID');
  }
  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,
      status: 'ATMOSPHERE_PRESENTATION_REJECTED',
      contractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
      issues
    });
  }

  const normalizedSunX = clamp01(0.5 + atmosphereState.sunDirection.x * 0.46);
  const normalizedSunY = clamp01(0.62 - atmosphereState.sunDirection.y * 0.52);
  const horizonCenter = clamp(0.58, 0.48, 0.72);
  const hazeHalfHeight = clamp(
    0.04 + atmosphereState.hazeDensity * 0.11,
    0.04,
    0.16
  );

  return deepFreeze({
    eligible: true,
    status: 'ATMOSPHERE_PRESENTATION_COMPLETE',
    contractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    presentationRevision: H_EARTH_ATMOSPHERE_PRESENTATION.presentationRevision,
    sourceAtmosphereContractId: atmosphereState.contractId,
    sourceAtmosphereRevision: atmosphereState.atmosphereStateRevision,
    viewport: {
      width: Math.floor(viewportWidth),
      height: Math.floor(viewportHeight),
      aspectRatio: viewportWidth / viewportHeight
    },
    skyGradientStops: [
      { offset: 0, rgba: atmosphereState.skyZenithColor },
      {
        offset: 0.52,
        rgba: sampleHEarthAtmosphereSkyColor(0.52, atmosphereState)
      },
      { offset: 0.82, rgba: atmosphereState.skyHorizonColor },
      { offset: 1, rgba: atmosphereState.groundHazeColor }
    ],
    sunDisc: {
      visible: atmosphereState.sunIntensity > 0.02,
      normalizedCenter: { x: normalizedSunX, y: normalizedSunY },
      normalizedRadius: clamp(
        0.012 + atmosphereState.sunIntensity * 0.006,
        0.012,
        0.019
      ),
      coreColor: atmosphereState.sunColor,
      haloColor: [
        atmosphereState.sunColor[0],
        atmosphereState.sunColor[1],
        atmosphereState.sunColor[2],
        128
      ],
      intensity: atmosphereState.sunIntensity
    },
    horizonHaze: {
      normalizedCenterY: horizonCenter,
      normalizedMinimumY: clamp01(horizonCenter - hazeHalfHeight),
      normalizedMaximumY: clamp01(horizonCenter + hazeHalfHeight),
      rgba: atmosphereState.groundHazeColor,
      opacity: clamp01(0.2 + atmosphereState.hazeDensity * 0.58)
    },
    distanceFog: {
      startDistance: atmosphereState.fogStartDistance,
      falloff: atmosphereState.fogFalloff,
      maximumFactor: atmosphereState.maximumFogFactor,
      cameraFarPlane,
      factorAtFarPlane: computeHEarthAtmosphericFogFactor(
        cameraFarPlane,
        atmosphereState
      )
    },
    terrainDistanceDesaturation: {
      strength: atmosphereState.distanceDesaturationStrength,
      hazeColor: atmosphereState.groundHazeColor,
      applyFunction:
        'applyHEarthAtmosphericDistanceToColor(baseColor,distance,atmosphereState)'
    },
    frameClosure: {
      alphaAtAllSkySamples: 255,
      transparentFallbackPermitted: false,
      grayFallbackPermitted: false,
      fullViewportSkyCoverageRequired: true
    },
    authority: H_EARTH_ATMOSPHERE_PRESENTATION.ownership,
    issues: []
  });
}

export function evaluateHEarthAtmospherePresentation(plan) {
  const issues = [];
  if (plan?.eligible !== true) issues.push('PRESENTATION_NOT_ELIGIBLE');
  if (plan?.contractId !== H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID) {
    issues.push('PRESENTATION_CONTRACT_ID_MISMATCH');
  }
  if (plan?.sourceAtmosphereContractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    issues.push('SOURCE_ATMOSPHERE_CONTRACT_ID_MISMATCH');
  }
  const stops = plan?.skyGradientStops;
  if (!Array.isArray(stops) || stops.length < 4) {
    issues.push('SKY_GRADIENT_STOPS_MISSING');
  } else {
    stops.forEach((stop, index) => {
      if (!finite(stop?.offset) || stop.offset < 0 || stop.offset > 1) {
        issues.push(`SKY_STOP_OFFSET_INVALID:${index}`);
      }
      if (!validateColor(stop?.rgba) || stop.rgba[3] !== 255) {
        issues.push(`SKY_STOP_COLOR_INVALID:${index}`);
      }
      if (index > 0 && stop.offset < stops[index - 1].offset) {
        issues.push(`SKY_STOP_ORDER_INVALID:${index}`);
      }
    });
  }
  if (plan?.frameClosure?.transparentFallbackPermitted !== false ||
      plan?.frameClosure?.grayFallbackPermitted !== false ||
      plan?.frameClosure?.fullViewportSkyCoverageRequired !== true) {
    issues.push('FRAME_CLOSURE_POLICY_INVALID');
  }
  if (plan?.authority?.ownsRendererLoop !== false ||
      plan?.authority?.ownsCamera !== false ||
      plan?.authority?.ownsNativeAtmosphereTruth !== false) {
    issues.push('PRESENTATION_AUTHORITY_LEAK');
  }
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'ATMOSPHERE_PRESENTATION_PASS'
      : 'ATMOSPHERE_PRESENTATION_FAIL',
    contractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    issues
  });
}

export function getHEarthAtmospherePresentationReceipt() {
  const atmosphereState = sampleHEarthAtmosphereState();
  const plan = buildHEarthAtmospherePresentation(atmosphereState);
  const evaluation = evaluateHEarthAtmospherePresentation(plan);
  return deepFreeze({
    receiptType: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7C_PRESENTATION_RECEIPT',
    contractId: H_EARTH_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    sourceAtmosphereContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
    eligible: evaluation.eligible,
    status: evaluation.status,
    presentationModel: H_EARTH_ATMOSPHERE_PRESENTATION.model,
    createsDom: false,
    createsCanvas: false,
    mutatesRenderer: false,
    issues: evaluation.issues
  });
}
