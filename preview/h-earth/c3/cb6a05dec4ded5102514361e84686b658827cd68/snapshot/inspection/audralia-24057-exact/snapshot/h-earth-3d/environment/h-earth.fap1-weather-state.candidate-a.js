/** H_EARTH_FAP1_WEATHER_STATE_CANDIDATE_A_v3
 * Non-live candidate under Gen336.
 * Adds planetary/regional weather organization above OW01 without changing
 * geography, camera, traversal, or live baseline authority.
 */

const freeze = (value) => Object.freeze(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const wrapLon = (value) => ((value + 180) % 360 + 360) % 360 - 180;
const clampLat = (value) => Math.min(89, Math.max(-89, value));
const PLANET_RADIUS_KM = 6200;

export const H_EARTH_FAP1_WEATHER_STATE_CONTRACT_ID =
  'H_EARTH_FAP1_WEATHER_STATE_CANDIDATE_A_v3';

export const H_EARTH_FAP1_WEATHER_CLASSES = freeze({
  CLEAR: 'CLEAR',
  HIGH_ICE: 'HIGH_ICE',
  MID_FRONTAL: 'MID_FRONTAL',
  LOW_CUMULIFORM: 'LOW_CUMULIFORM',
  DEEP_CONVECTION: 'DEEP_CONVECTION',
  CYCLONE: 'CYCLONE'
});

export const H_EARTH_FAP1_ALTITUDE_FAMILIES = freeze({
  HIGH: freeze({ id: 'HIGH', baseKm: 7.5, topKm: 15.5, velocityScale: 1.35 }),
  MID: freeze({ id: 'MID', baseKm: 2.5, topKm: 8.5, velocityScale: 1.0 }),
  LOW: freeze({ id: 'LOW', baseKm: 0.5, topKm: 3.5, velocityScale: 0.72 }),
  DEEP: freeze({ id: 'DEEP', baseKm: 0.7, topKm: 17.0, velocityScale: 0.9 })
});

const REGIMES = freeze([
  freeze({ id: 'GRATITUDE_CLEAR_CORRIDOR', weatherClass: 'CLEAR', center: freeze({ latitudeDeg: 26, longitudeDeg: -18 }), radiusDeg: 23, occupancy: 0.08, hazeSupport: 0.08, families: freeze([]), wind: freeze({ eastKmH: 38, northKmH: 6 }) }),
  freeze({ id: 'NORTHERN_HIGH_ICE_FIELD', weatherClass: 'HIGH_ICE', center: freeze({ latitudeDeg: 57, longitudeDeg: 26 }), radiusDeg: 42, occupancy: 0.58, hazeSupport: 0.12, families: freeze(['HIGH']), wind: freeze({ eastKmH: 118, northKmH: -10 }) }),
  freeze({ id: 'WESTERN_FRONTAL_FIELD', weatherClass: 'MID_FRONTAL', center: freeze({ latitudeDeg: 34, longitudeDeg: -73 }), radiusDeg: 38, occupancy: 0.69, hazeSupport: 0.28, families: freeze(['HIGH', 'MID']), wind: freeze({ eastKmH: 72, northKmH: 18 }) }),
  freeze({ id: 'EQUATORIAL_CUMULUS_BELT', weatherClass: 'LOW_CUMULIFORM', center: freeze({ latitudeDeg: 4, longitudeDeg: 48 }), radiusDeg: 45, occupancy: 0.62, hazeSupport: 0.18, families: freeze(['LOW']), wind: freeze({ eastKmH: -31, northKmH: 8 }) }),
  freeze({ id: 'SOUTHEAST_DEEP_CONVECTION', weatherClass: 'DEEP_CONVECTION', center: freeze({ latitudeDeg: -19, longitudeDeg: 82 }), radiusDeg: 34, occupancy: 0.78, hazeSupport: 0.35, families: freeze(['LOW', 'DEEP', 'HIGH']), wind: freeze({ eastKmH: -46, northKmH: -16 }) }),
  freeze({
    id: 'SOUTHERN_OCEAN_CYCLONE', weatherClass: 'CYCLONE', center: freeze({ latitudeDeg: -20, longitudeDeg: 20 }), radiusDeg: 28,
    occupancy: 0.84, hazeSupport: 0.42, families: freeze(['LOW', 'MID', 'DEEP', 'HIGH']), wind: freeze({ eastKmH: 42, northKmH: 12 }),
    cyclone: freeze({ eyeRadiusDeg: 2.4, eyewallRadiusDeg: 5.8, outerRainbandRadiusDeg: 24, spiralTightness: 2.15, rotationDirection: 'CCW', upperOutflowRadiusDeg: 31, maximumConvectiveSupport: 1 })
  })
]);

function advectedCenter(regime, canonicalTimeHours) {
  const dt = canonicalTimeHours;
  const latRad = regime.center.latitudeDeg * Math.PI / 180;
  const deltaLatDeg = (regime.wind.northKmH * dt / PLANET_RADIUS_KM) * 180 / Math.PI;
  const lonDivisor = PLANET_RADIUS_KM * Math.max(Math.cos(latRad), 0.15);
  const deltaLonDeg = (regime.wind.eastKmH * dt / lonDivisor) * 180 / Math.PI;
  return freeze({
    latitudeDeg: clampLat(regime.center.latitudeDeg + deltaLatDeg),
    longitudeDeg: wrapLon(regime.center.longitudeDeg + deltaLonDeg)
  });
}

export function getHEarthFAP1WeatherRegimes({canonicalTimeHours=0}={}) {
  if (!Number.isFinite(canonicalTimeHours)) return freeze([]);
  return freeze(REGIMES.map((regime) => freeze({
    ...regime,
    center: advectedCenter(regime, canonicalTimeHours),
    sourceCenter: regime.center,
    canonicalTimeHours
  })));
}

function angularDistanceDeg(aLat, aLon, bLat, bLon) {
  const toRad = Math.PI / 180;
  const p1 = aLat * toRad;
  const p2 = bLat * toRad;
  const dp = (bLat - aLat) * toRad;
  const dl = (bLon - aLon) * toRad;
  const s = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(s), Math.sqrt(Math.max(0, 1 - s))) / toRad;
}

function supportFor(regime, latitudeDeg, longitudeDeg, canonicalTimeHours) {
  const center = advectedCenter(regime, canonicalTimeHours);
  const distance = angularDistanceDeg(latitudeDeg, longitudeDeg, center.latitudeDeg, center.longitudeDeg);
  return freeze({ support: clamp01(1 - distance / regime.radiusDeg), center });
}

export function sampleHEarthFAP1WeatherState({ latitudeDeg, longitudeDeg, canonicalTimeHours = 0 }) {
  if (![latitudeDeg, longitudeDeg, canonicalTimeHours].every(Number.isFinite)) {
    return freeze({ eligible: false, status: 'FAP1_WEATHER_SAMPLE_REJECTED', issues: freeze(['NONFINITE_INPUT']) });
  }

  const lat = clampLat(latitudeDeg);
  const lon = wrapLon(longitudeDeg);
  const weighted = REGIMES.map((regime) => ({ regime, ...supportFor(regime, lat, lon, canonicalTimeHours) }))
    .sort((a, b) => b.support - a.support);
  const primary = weighted[0];
  const secondary = weighted[1];
  const clear = weighted.find((entry) => entry.regime.weatherClass === 'CLEAR');
  const clearSupport = clear?.support ?? 0;
  const weatherSupport = clamp01(primary.support * primary.regime.occupancy);
  const effectiveOccupancy = clamp01(weatherSupport * (1 - clearSupport * 0.92));

  return freeze({
    eligible: true,
    status: 'FAP1_WEATHER_SAMPLE_COMPLETE',
    contractId: H_EARTH_FAP1_WEATHER_STATE_CONTRACT_ID,
    sampleLocation: freeze({ latitudeDeg: lat, longitudeDeg: lon }),
    canonicalTimeHours,
    primaryRegimeId: primary.regime.id,
    primarySystemCenter: primary.center,
    secondaryRegimeId: secondary.regime.id,
    weatherClass: primary.regime.weatherClass,
    weatherSupport,
    clearAirSupport: clearSupport,
    cloudOccupancy: effectiveOccupancy,
    emptyAirFraction: clamp01(1 - effectiveOccupancy),
    skipVolumeTraversalEligible: effectiveOccupancy < 0.06,
    hazeSupport: clamp01(primary.regime.hazeSupport * primary.support),
    altitudeFamilies: primary.regime.families,
    baseWind: primary.regime.wind,
    cyclone: primary.regime.cyclone ?? null,
    stateIdentity: primary.regime.id
  });
}

export function sampleHEarthFAP1AltitudeVelocity(weatherState, altitudeKm) {
  if (weatherState?.eligible !== true || !Number.isFinite(altitudeKm)) return null;
  const family = altitudeKm >= 7 ? H_EARTH_FAP1_ALTITUDE_FAMILIES.HIGH : altitudeKm >= 2.5 ? H_EARTH_FAP1_ALTITUDE_FAMILIES.MID : H_EARTH_FAP1_ALTITUDE_FAMILIES.LOW;
  const scale = family.velocityScale;
  const cycloneBoost = weatherState.weatherClass === 'CYCLONE' ? clamp01(altitudeKm / 12) * 22 : 0;
  return freeze({ familyId: family.id, eastKmH: weatherState.baseWind.eastKmH * scale + cycloneBoost, northKmH: weatherState.baseWind.northKmH * scale });
}

export function evaluateHEarthFAP1WeatherContract() {
  const classes = new Set(REGIMES.map((regime) => regime.weatherClass));
  const required = Object.values(H_EARTH_FAP1_WEATHER_CLASSES);
  const issues = required.filter((value) => !classes.has(value)).map((value) => `MISSING_WEATHER_CLASS:${value}`);
  const cyclone = REGIMES.find((regime) => regime.weatherClass === 'CYCLONE')?.cyclone;
  if (!cyclone?.eyeRadiusDeg || !cyclone?.eyewallRadiusDeg || !cyclone?.outerRainbandRadiusDeg || !cyclone?.upperOutflowRadiusDeg) issues.push('STRUCTURED_CYCLONE_INCOMPLETE');
  return freeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'FAP1_WEATHER_CONTRACT_PASS' : 'FAP1_WEATHER_CONTRACT_FAIL', regimeCount: REGIMES.length, issues: freeze(issues) });
}
