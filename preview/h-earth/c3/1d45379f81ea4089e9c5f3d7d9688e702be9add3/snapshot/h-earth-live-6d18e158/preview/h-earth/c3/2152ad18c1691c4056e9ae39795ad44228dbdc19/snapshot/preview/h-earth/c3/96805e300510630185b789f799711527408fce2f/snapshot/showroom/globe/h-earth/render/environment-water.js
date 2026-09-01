/**
 * /showroom/globe/h-earth/render/environment-water.js
 *
 * H_EARTH_LOW_COST_WATER_PRESENTATION_RUN_7D_v1
 *
 * Pure presentation adapter for canonical H-Earth water state. It derives
 * depth-sensitive color, shoreline foam modulation, deterministic surface
 * motion descriptors, horizon-continuity requirements, and underwater
 * presentation parameters. It creates no geometry, DOM, canvas, renderer
 * loop, water truth, camera, traversal, route, or deployment authority.
 */

import {
  H_EARTH_WATER_STATE_CONTRACT_ID,
  H_EARTH_WATER_STATE_REVISION,
  evaluateHEarthWaterStateSample,
  sampleHEarthWaterState
} from '../../../../h-earth-3d/environment/h-earth.water-state.js';

import {
  H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,
  sampleHEarthAtmosphereState
} from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
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
const mixColor = (a, b, t, alpha = 255) => deepFreeze([
  Math.round(mix(a[0], b[0], t)),
  Math.round(mix(a[1], b[1], t)),
  Math.round(mix(a[2], b[2], t)),
  Math.round(clamp(alpha, 0, 255))
]);

export const H_EARTH_WATER_PRESENTATION_CONTRACT_ID =
  'H_EARTH_LOW_COST_WATER_PRESENTATION_RUN_7D_v1';

export const H_EARTH_WATER_PRESENTATION_REVISION = 1;

const COLORS = deepFreeze({
  contact: [134, 177, 170, 236],
  shallow: [58, 151, 169, 232],
  nearshore: [38, 113, 145, 226],
  open: [22, 71, 110, 222],
  deep: [11, 42, 78, 226],
  foam: [231, 243, 236, 218],
  underwater: [20, 86, 112, 255]
});

export const H_EARTH_WATER_PRESENTATION = deepFreeze({
  contractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
  presentationRevision: H_EARTH_WATER_PRESENTATION_REVISION,
  sourceWaterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
  presentationChannels: [
    'DEPTH_SENSITIVE_WATER_COLOR',
    'SHORELINE_FOAM_MODULATION',
    'DETERMINISTIC_WATER_SURFACE_MOTION',
    'HORIZON_CONSISTENT_WATER_EXTENT_REQUIREMENT',
    'UNDERWATER_PRESENTATION_CLASSIFICATION'
  ],
  ownership: {
    ownsNativeWaterTruth: false,
    ownsAtmosphereTruth: false,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsGeometry: false,
    ownsRendererLoop: false,
    ownsCamera: false,
    ownsTraversal: false,
    ownsPublicRoute: false,
    mutatesRenderer: false,
    createsDom: false,
    createsCanvas: false
  }
});

function baseWaterColor(waterClass) {
  switch (waterClass) {
    case 'SHORELINE_CONTACT': return COLORS.contact;
    case 'SHALLOW_WATER': return COLORS.shallow;
    case 'NEARSHORE_WATER': return COLORS.nearshore;
    case 'OPEN_WATER': return COLORS.open;
    default: return [0, 0, 0, 0];
  }
}

export function computeHEarthWaterDepthColor(
  waterState,
  atmosphereState = sampleHEarthAtmosphereState()
) {
  const waterEvaluation = evaluateHEarthWaterStateSample(waterState);
  if (!waterEvaluation.eligible ||
      atmosphereState?.valid !== true ||
      atmosphereState?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID) {
    return null;
  }
  if (waterState.waterPresent !== true) return deepFreeze([0, 0, 0, 0]);

  const depthFactor = clamp01(waterState.depth / 4.5);
  const turbidityLift = clamp01(waterState.turbidity) * 0.22;
  const skyInfluence = clamp01(atmosphereState.sunIntensity) * 0.18;
  const base = baseWaterColor(waterState.waterClass);
  const deepened = mixColor(base, COLORS.deep, depthFactor * 0.72, base[3]);
  const horizon = atmosphereState.skyHorizonColor;
  const withSky = mixColor(deepened, horizon, skyInfluence, base[3]);
  return mixColor(withSky, COLORS.contact, turbidityLift, base[3]);
}

export function computeHEarthWaterWavePhase(waterState, timeSeconds) {
  if (!finite(timeSeconds) || evaluateHEarthWaterStateSample(waterState).eligible !== true) {
    return null;
  }
  if (waterState.waterPresent !== true) {
    return deepFreeze({ phase: 0, normalizedOffset: 0, surfaceOffset: 0 });
  }
  const spatialPhase =
    waterState.world.x * waterState.waveDirection.x * 0.018 +
    waterState.world.z * waterState.waveDirection.z * 0.018;
  const phase = spatialPhase + timeSeconds * waterState.waveFrequency * Math.PI * 2;
  const normalizedOffset = Math.sin(phase);
  return deepFreeze({
    phase,
    normalizedOffset,
    surfaceOffset: normalizedOffset * waterState.waveAmplitude * 0.08
  });
}

export function buildHEarthWaterPresentation(
  waterState,
  {
    atmosphereState = null,
    timeSeconds = 0,
    cameraDistance = 0,
    horizonDistance = 512
  } = {}
) {
  const consumedAtmosphere = atmosphereState ?? sampleHEarthAtmosphereState();
  const waterEvaluation = evaluateHEarthWaterStateSample(waterState);
  if (!waterEvaluation.eligible ||
      consumedAtmosphere?.valid !== true ||
      consumedAtmosphere?.contractId !== H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID ||
      ![timeSeconds, cameraDistance, horizonDistance].every(finite) ||
      cameraDistance < 0 || horizonDistance <= 0) {
    return deepFreeze({
      eligible: false,
      status: 'WATER_PRESENTATION_REJECTED',
      contractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
      issues: ['WATER_PRESENTATION_INPUT_INVALID']
    });
  }

  const visible = waterState.waterPresent === true;
  const surfaceColor = computeHEarthWaterDepthColor(
    waterState,
    consumedAtmosphere
  );
  const waveMotion = computeHEarthWaterWavePhase(waterState, timeSeconds);
  const reflectionStrength = visible
    ? clamp01(
        0.18 + consumedAtmosphere.sunIntensity * 0.34 +
        (1 - waterState.turbidity) * 0.22
      )
    : 0;
  const distanceFade = clamp01(cameraDistance / horizonDistance);
  const foamAlpha = visible
    ? Math.round(255 * clamp01(waterState.foamIntensity * (1 - distanceFade * 0.62)))
    : 0;
  const underwater = deepFreeze({
    state: waterState.underwaterState,
    overlayRequired: waterState.underwaterState === 'SUBMERGED',
    contactOverlayRequired: waterState.underwaterState === 'CONTACT_ZONE',
    overlayColor: waterState.underwaterState === 'SUBMERGED'
      ? COLORS.underwater
      : [0, 0, 0, 0],
    distortionStrength: waterState.underwaterState === 'SUBMERGED'
      ? clamp01(0.12 + waterState.turbidity * 0.22)
      : 0
  });

  return deepFreeze({
    eligible: true,
    status: 'WATER_PRESENTATION_COMPLETE',
    contractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
    presentationRevision: H_EARTH_WATER_PRESENTATION_REVISION,
    waterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    waterStateRevision: H_EARTH_WATER_STATE_REVISION,
    visible,
    waterBodyId: waterState.waterBodyId,
    waterClass: waterState.waterClass,
    surfaceColor,
    transparencyClass: visible ? 'TRANSLUCENT_DEPTH_SORTED' : 'NOT_PRESENT',
    depthSensitiveColor: {
      enabled: visible,
      depth: waterState.depth,
      turbidity: waterState.turbidity,
      reflectionStrength
    },
    waveMotion: {
      enabled: visible && waterState.waveAmplitude > 0,
      direction: waterState.waveDirection,
      amplitude: waterState.waveAmplitude,
      frequency: waterState.waveFrequency,
      phase: waveMotion.phase,
      normalizedOffset: waveMotion.normalizedOffset,
      surfacePresentationOffset: waveMotion.surfaceOffset,
      ownsAnimationLoop: false
    },
    shorelineFoam: {
      eligible: visible && waterState.foamIntensity > 0,
      intensity: waterState.foamIntensity,
      rgba: [COLORS.foam[0], COLORS.foam[1], COLORS.foam[2], foamAlpha],
      modulationSource: 'CANONICAL_WATER_STATE_FOAM_INTENSITY'
    },
    shorelineWetnessTransfer: {
      intensity: waterState.wetnessTransfer,
      mutatesSurfaceState: false
    },
    horizonConsistency: {
      required: visible,
      extentClass: 'CAMERA_FAR_PLANE_WATER_CONTINUITY_REQUIRED',
      targetDistance: horizonDistance,
      finiteGeometryOwnedHere: false,
      trueStreamingRequired: false
    },
    underwater,
    sourceIdentities: {
      waterPresentationContractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
      waterPresentationRevision: H_EARTH_WATER_PRESENTATION_REVISION,
      waterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
      atmosphereStateContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID
    },
    authority: H_EARTH_WATER_PRESENTATION.ownership,
    issues: []
  });
}

export function evaluateHEarthWaterPresentation(plan) {
  const issues = [];
  if (plan?.eligible !== true) issues.push('WATER_PRESENTATION_NOT_ELIGIBLE');
  if (plan?.contractId !== H_EARTH_WATER_PRESENTATION_CONTRACT_ID) {
    issues.push('WATER_PRESENTATION_CONTRACT_MISMATCH');
  }
  if (plan?.visible === true) {
    if (!Array.isArray(plan.surfaceColor) || plan.surfaceColor.length !== 4) {
      issues.push('WATER_SURFACE_COLOR_INVALID');
    }
    if (!finite(plan?.waveMotion?.phase) ||
        !finite(plan?.waveMotion?.surfacePresentationOffset)) {
      issues.push('WATER_WAVE_MOTION_INVALID');
    }
    if (plan?.horizonConsistency?.required !== true) {
      issues.push('WATER_HORIZON_CONTINUITY_NOT_REQUIRED');
    }
  }
  if (plan?.authority?.ownsNativeWaterTruth !== false) {
    issues.push('PRESENTATION_NATIVE_WATER_AUTHORITY_LEAK');
  }
  if (plan?.authority?.ownsRendererLoop !== false ||
      plan?.authority?.mutatesRenderer !== false) {
    issues.push('PRESENTATION_RENDERER_AUTHORITY_LEAK');
  }
  if (plan?.authority?.createsDom !== false ||
      plan?.authority?.createsCanvas !== false) {
    issues.push('PRESENTATION_SURFACE_CREATION_LEAK');
  }

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'WATER_PRESENTATION_PASS'
      : 'WATER_PRESENTATION_FAIL',
    contractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
    issues
  });
}

export function getHEarthWaterPresentationReceipt() {
  const water = sampleHEarthWaterState(0, -130, { observerY: 2.25 });
  const plan = buildHEarthWaterPresentation(water, {
    timeSeconds: 12,
    cameraDistance: 120,
    horizonDistance: 512
  });
  const evaluation = evaluateHEarthWaterPresentation(plan);
  return deepFreeze({
    receiptType: 'H_EARTH_WATER_PRESENTATION_RUN_7D_SOURCE_RECEIPT',
    contractId: H_EARTH_WATER_PRESENTATION_CONTRACT_ID,
    sourceWaterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
    eligible: evaluation.eligible,
    status: evaluation.eligible
      ? 'WATER_PRESENTATION_SOURCE_ELIGIBLE'
      : 'WATER_PRESENTATION_SOURCE_NOT_ELIGIBLE',
    channels: H_EARTH_WATER_PRESENTATION.presentationChannels,
    createsDom: false,
    createsCanvas: false,
    rendererMutation: false,
    geometryMutation: false,
    publicRouteMutation: false,
    productPromotionClaim: false,
    liveVerificationClaim: false,
    issues: evaluation.issues
  });
}
