/** H_EARTH_FAP1_ATMOSPHERE_PRESENTATION_CANDIDATE_A_v1
 * Non-live candidate. Adds weather-aware haze/fog/cloud optical organization
 * without changing the accepted terrain, camera, navigation, or baseline renderer.
 */

import {
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../../../../h-earth-3d/environment/h-earth.atmosphere-state.js';
import {
  H_EARTH_FAP1_WEATHER_STATE_CONTRACT_ID,
  sampleHEarthFAP1WeatherState,
  sampleHEarthFAP1AltitudeVelocity
} from '../../../../h-earth-3d/environment/h-earth.fap1-weather-state.candidate-a.js';

const freeze = (value) => Object.freeze(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const mix = (a, b, t) => a + (b - a) * t;
const mixColor = (a, b, t) => freeze([
  Math.round(mix(a[0], b[0], t)),
  Math.round(mix(a[1], b[1], t)),
  Math.round(mix(a[2], b[2], t)),
  255
]);

export const H_EARTH_FAP1_ATMOSPHERE_PRESENTATION_CONTRACT_ID =
  'H_EARTH_FAP1_ATMOSPHERE_PRESENTATION_CANDIDATE_A_v1';

const QUALITY = freeze({
  INTERACTIVE: freeze({
    id: 'INTERACTIVE',
    rayStepScale: 1,
    lightingSampleScale: 1,
    shadowSampleScale: 1,
    volumeDetailScale: 1,
    temporalStabilityScale: 1
  }),
  CAPTURE: freeze({
    id: 'CAPTURE',
    rayStepScale: 2.5,
    lightingSampleScale: 2.25,
    shadowSampleScale: 2,
    volumeDetailScale: 2.5,
    temporalStabilityScale: 2
  })
});

function opticalRegime(weather, atmosphere) {
  const cloud = weather.cloudOccupancy;
  const clear = weather.clearAirSupport;
  const weatherHaze = weather.hazeSupport;

  // Clear air suppresses generalized gray accumulation. Weather haze may rise
  // only where explicit weather support exists.
  const clearSuppression = clamp01(clear * 0.9);
  const baselineHaze = clamp01(atmosphere.hazeDensity * (1 - clearSuppression));
  const haze = clamp01(baselineHaze * 0.45 + weatherHaze * weather.weatherSupport * 0.55);
  const fog = clamp01(atmosphere.maximumFogFactor * (0.2 + weatherHaze * 0.55) * (1 - clearSuppression));
  const aerialDesaturation = clamp01(
    atmosphere.distanceDesaturationStrength * (0.28 + haze * 0.62) * (1 - clearSuppression * 0.6)
  );

  return freeze({
    cloudExtinctionSupport: cloud,
    hazeExtinctionSupport: haze,
    fogExtinctionCeiling: fog,
    aerialDesaturationStrength: aerialDesaturation,
    clearAirSuppression: clearSuppression,
    grayFallbackPermitted: false,
    independentStackingPermitted: false
  });
}

function cloudFamilyPlans(weather) {
  return freeze(weather.altitudeFamilies.map((familyId) => {
    const altitudeKm = familyId === 'HIGH' ? 11 : familyId === 'MID' ? 5 : familyId === 'DEEP' ? 9 : 1.5;
    const velocity = sampleHEarthFAP1AltitudeVelocity(weather, altitudeKm);
    return freeze({
      familyId,
      altitudeKm,
      velocity,
      densityAuthority: 'OW01_SHARED_DENSITY_AUTHORITY_WITH_FAP1_REGIONAL_SUPPORT',
      noiseAuthority: 'SUBGRID_MORPHOLOGY_ONLY'
    });
  }));
}

function cyclonePlan(weather) {
  if (weather.weatherClass !== 'CYCLONE' || !weather.cyclone) return null;
  return freeze({
    identity: weather.stateIdentity,
    eye: freeze({ radiusDeg: weather.cyclone.eyeRadiusDeg, densitySuppression: 0.96 }),
    eyewall: freeze({ radiusDeg: weather.cyclone.eyewallRadiusDeg, convectiveSupport: 1 }),
    rainbands: freeze({ outerRadiusDeg: weather.cyclone.outerRainbandRadiusDeg, spiralTightness: weather.cyclone.spiralTightness }),
    convectiveTowers: freeze({ altitudeFamily: 'DEEP', support: weather.cyclone.maximumConvectiveSupport }),
    upperOutflow: freeze({ altitudeFamily: 'HIGH', radiusDeg: weather.cyclone.upperOutflowRadiusDeg }),
    rotationDirection: weather.cyclone.rotationDirection
  });
}

export function buildHEarthFAP1AtmosphereCandidate({
  latitudeDeg = 30,
  longitudeDeg = 0,
  canonicalTimeHours = 0,
  timeOfDayHours = 15.25,
  observerElevation = 2.25,
  viewDistance = 512,
  qualityMode = 'INTERACTIVE'
} = {}) {
  const atmosphere = sampleHEarthAtmosphereState({
    timeOfDayHours,
    observerElevation,
    viewDistance
  });
  const atmosphereEvaluation = evaluateHEarthAtmosphereStateSample(atmosphere);
  const weather = sampleHEarthFAP1WeatherState({ latitudeDeg, longitudeDeg, canonicalTimeHours });
  const quality = QUALITY[qualityMode] ?? null;
  const issues = [];
  if (atmosphereEvaluation.eligible !== true) issues.push(...atmosphereEvaluation.issues);
  if (weather.eligible !== true) issues.push(...(weather.issues ?? ['WEATHER_INVALID']));
  if (!quality) issues.push('QUALITY_MODE_INVALID');
  if (issues.length) return freeze({ eligible: false, status: 'FAP1_ATMOSPHERE_CANDIDATE_REJECTED', issues: freeze(issues) });

  const optics = opticalRegime(weather, atmosphere);
  const clearSkyBlend = clamp01(weather.clearAirSupport * 0.78);
  const skyHorizonColor = mixColor(atmosphere.skyHorizonColor, atmosphere.skyZenithColor, clearSkyBlend * 0.24);
  const hazeColor = mixColor(atmosphere.groundHazeColor, skyHorizonColor, weather.clearAirSupport * 0.64);

  return freeze({
    eligible: true,
    status: 'FAP1_ATMOSPHERE_CANDIDATE_COMPLETE',
    contractId: H_EARTH_FAP1_ATMOSPHERE_PRESENTATION_CONTRACT_ID,
    sourceWeatherContractId: H_EARTH_FAP1_WEATHER_STATE_CONTRACT_ID,
    weather,
    optics,
    cloudFamilies: cloudFamilyPlans(weather),
    cyclone: cyclonePlan(weather),
    lighting: freeze({
      sunDirection: atmosphere.sunDirection,
      sunColor: atmosphere.sunColor,
      sunIntensity: atmosphere.sunIntensity,
      cloudOwnsLighting: false,
      scatteringAuthority: 'SHARED_ATMOSPHERE_RADIATIVE_ENVIRONMENT',
      precipitationCoreExtinctionSharesAtmosphere: true
    }),
    sky: freeze({
      zenithColor: atmosphere.skyZenithColor,
      horizonColor: skyHorizonColor,
      hazeColor,
      generalizedGrayFallbackPermitted: false
    }),
    quality,
    qualityStateInvariant: freeze({
      weatherIdentity: weather.stateIdentity,
      weatherStateChangesWithQualityMode: false,
      onlySamplingAndPresentationQualityMayChange: true
    }),
    authority: freeze({
      geographyMutation: false,
      cameraMutation: false,
      navigationMutation: false,
      liveBaselineReplacement: false,
      rendererReplacement: false,
      candidateOnly: true
    })
  });
}

export function evaluateHEarthFAP1AtmosphereCandidate(plan) {
  const issues = [];
  if (plan?.eligible !== true) issues.push('CANDIDATE_NOT_ELIGIBLE');
  if (plan?.optics?.independentStackingPermitted !== false) issues.push('INDEPENDENT_OPTICAL_STACKING_ALLOWED');
  if (plan?.sky?.generalizedGrayFallbackPermitted !== false) issues.push('GRAY_FALLBACK_ALLOWED');
  if (plan?.lighting?.cloudOwnsLighting !== false) issues.push('CLOUD_LIGHTING_AUTHORITY_LEAK');
  if (plan?.qualityStateInvariant?.weatherStateChangesWithQualityMode !== false) issues.push('QUALITY_MODE_MUTATES_WEATHER');
  if (plan?.authority?.geographyMutation !== false || plan?.authority?.cameraMutation !== false || plan?.authority?.liveBaselineReplacement !== false) {
    issues.push('PROTECTED_AUTHORITY_LEAK');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'FAP1_ATMOSPHERE_CANDIDATE_PASS' : 'FAP1_ATMOSPHERE_CANDIDATE_FAIL',
    issues: freeze(issues)
  });
}
