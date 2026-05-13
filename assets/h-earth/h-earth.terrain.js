// /assets/h-earth/h-earth.terrain.js
// H_EARTH_CHILD_TERRAIN_REFINEMENT_TRIAL_TNT_v1
// Role: child terrain refinement only.
// This file refines the parent macro silhouette. It does not replace the map.

const TERRAIN_MODEL = "h-earth-child-terrain-refinement-trial-v1";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function valueNoise2D(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);

  const n00 = hash(xi, yi, seed);
  const n10 = hash(xi + 1, yi, seed);
  const n01 = hash(xi, yi + 1, seed);
  const n11 = hash(xi + 1, yi + 1, seed);

  return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy) * 2 - 1;
}

function fbm2D(x, y, seed = 0, octaves = 4) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 19) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge2D(x, y, seed = 0) {
  return 1 - Math.abs(fbm2D(x, y, seed, 4));
}

function wrapLonDelta(lon, center) {
  return Math.atan2(Math.sin(lon - center), Math.cos(lon - center));
}

function basinField(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = wrapLonDelta(lon, centerLon) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function ribbonCut(lat, lon, centerLat, centerLon, length, width, angle, phase = 0) {
  const x = wrapLonDelta(lon, centerLon);
  const y = lat - centerLat;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const xr = x * c - y * s;
  const yr = x * s + y * c;

  const curve =
    yr +
    Math.sin(xr * 2.7 + phase) * 0.075 +
    Math.sin(xr * 5.1 - phase) * 0.027;

  const along = Math.abs(xr) / length;
  const across = Math.abs(curve) / width;

  return 1 - Math.max(along * 0.72, across);
}

function coastlineRoughness(lat, lon) {
  const low =
    fbm2D(lon * 2.15 + 8.0, lat * 2.00 - 3.0, 1201, 4) * 0.052;

  const middle =
    fbm2D(lon * 4.30 - 2.0, lat * 3.90 + 5.0, 1202, 3) * 0.026;

  return low + middle;
}

function parentCoastPressure(elevation) {
  return 1 - clamp(Math.abs(elevation) / 0.13, 0, 1);
}

function refineCoastalSilhouette(sample) {
  const { lat, lon } = sample;

  const coastPressure = parentCoastPressure(sample.elevation);
  const roughness = coastlineRoughness(lat, lon);

  const bayCuts =
    basinField(lat, lon, 0.20, -1.86, 0.15, 0.18) * 0.070 +
    basinField(lat, lon, -0.34, -1.18, 0.15, 0.20) * 0.080 +
    basinField(lat, lon, 0.28, 1.42, 0.15, 0.20) * 0.080 +
    basinField(lat, lon, -0.42, 1.58, 0.17, 0.22) * 0.070 +
    basinField(lat, lon, 0.56, 0.20, 0.13, 0.32) * 0.055;

  const gulfs =
    ribbonCut(lat, lon, 0.16, -2.08, 0.50, 0.075, 0.62, 1.7) * 0.060 +
    ribbonCut(lat, lon, -0.18, 1.04, 0.50, 0.080, -0.56, -0.9) * 0.055 +
    ribbonCut(lat, lon, 0.44, 0.88, 0.42, 0.072, 0.40, 2.1) * 0.050;

  const peninsulas =
    ribbonCut(lat, lon, 0.32, -1.08, 0.44, 0.065, -0.54, 0.5) * 0.075 +
    ribbonCut(lat, lon, -0.08, -2.02, 0.45, 0.065, 0.66, 2.0) * 0.070 +
    ribbonCut(lat, lon, 0.16, 2.00, 0.42, 0.065, -0.62, 1.6) * 0.065 +
    ribbonCut(lat, lon, -0.52, -0.42, 0.54, 0.070, 0.28, -1.4) * 0.055;

  const islandChains =
    ribbonCut(lat, lon, 0.02, -0.22, 0.76, 0.052, 0.04, 0.9) * 0.070 +
    ribbonCut(lat, lon, -0.18, 1.18, 0.54, 0.050, 0.30, 2.5) * 0.060 +
    ribbonCut(lat, lon, 0.40, -2.44, 0.40, 0.045, -0.35, -1.0) * 0.050;

  const brokenIslands =
    fbm2D(lon * 6.1 + 4.0, lat * 5.4 - 7.0, 1203, 3) > 0.18
      ? islandChains
      : islandChains * 0.20;

  const coastOnly = smoothstep(0.08, 1.0, coastPressure);

  return (
    sample.elevation +
    roughness * (0.45 + coastOnly * 0.80) +
    peninsulas * coastOnly +
    brokenIslands * coastOnly -
    bayCuts * (0.50 + coastOnly * 0.85) -
    gulfs * (0.30 + coastOnly * 0.90)
  );
}

function refineInteriorTerrain(sample, elevation) {
  const { lat, lon } = sample;

  const ridge =
    ridge2D(lon * 1.42 + 3.0, lat * 1.64 - 5.0, 1301) * 0.56 +
    ridge2D(lon * 2.70 - 7.0, lat * 2.50 + 4.0, 1302) * 0.22;

  const valley =
    ribbonCut(lat, lon, 0.18, -1.34, 0.72, 0.080, -0.42, 0.4) * 0.040 +
    ribbonCut(lat, lon, -0.20, 0.82, 0.68, 0.084, 0.36, 1.5) * 0.042 +
    ribbonCut(lat, lon, 0.52, 0.08, 0.70, 0.074, -0.16, -1.2) * 0.034;

  const landPressure = smoothstep(0.02, 0.18, elevation);
  const ridgeLift = ridge * 0.045 * landPressure;
  const valleyCut = valley * landPressure;

  return {
    elevation: elevation + ridgeLift - valleyCut,
    ridge: clamp(sample.ridge * 0.55 + ridge * 0.45, 0, 1)
  };
}

function refineWaterAndMoisture(sample, elevation) {
  const { lat, lon } = sample;

  const moistureBase = clamp(
    sample.moisture * 0.70 +
      ((fbm2D(lon * 1.20 - 4.0, lat * 1.15 + 7.0, 1401, 3) + 1) * 0.5) * 0.30,
    0,
    1
  );

  const lakeSeats =
    basinField(lat, lon, 0.12, -1.42, 0.075, 0.100) +
    basinField(lat, lon, 0.08, 1.70, 0.080, 0.105) +
    basinField(lat, lon, -0.20, 0.74, 0.090, 0.120) +
    basinField(lat, lon, -0.30, -0.28, 0.085, 0.125) +
    basinField(lat, lon, 0.46, 0.38, 0.075, 0.120);

  const freshwater =
    elevation > 0.030 &&
    elevation < 0.145 &&
    moistureBase > 0.40 &&
    lakeSeats > 0.62;

  return {
    moisture: moistureBase,
    freshwater
  };
}

export function refineHEarthTerrain(sample) {
  if (!sample || sample.worldKey !== "hEarth") {
    return sample;
  }

  const coastalElevation = refineCoastalSilhouette(sample);
  const interior = refineInteriorTerrain(sample, coastalElevation);
  const water = refineWaterAndMoisture(sample, interior.elevation);

  return {
    ...sample,
    elevation: interior.elevation,
    ridge: interior.ridge,
    moisture: water.moisture,
    freshwater: water.freshwater,
    childTerrainModel: TERRAIN_MODEL,
    childTerrainActive: true
  };
}

export function getHEarthTerrainTrialStatus() {
  return {
    model: TERRAIN_MODEL,
    role: "child terrain refinement",
    replacesParentMap: false,
    refinesParentMap: true,
    ownsCanvas: false,
    ownsControls: false,
    privateEngine: false
  };
}

export default {
  model: TERRAIN_MODEL,
  refineHEarthTerrain,
  getHEarthTerrainTrialStatus
};
