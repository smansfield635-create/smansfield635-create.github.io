// /assets/audralia/audralia.surface.js
// AUDRALIA_SURFACE_PARENT_BASIN_RIDGE_DISTRIBUTION_TNT_v5
// Full-file replacement.
// Purpose:
// - Parent surface owns land/water/ice/shelf truth.
// - Break the uniform green parent field.
// - Preserve Earth-compatible land/water ratio.
// - Force visible basins, oceans, shelves, coastlines, mountain-range candidates, and restrained ice.
// - Children refine from this parent contract only.
// - Runtime remains motion only.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_SURFACE_PARENT_BASIN_RIDGE_DISTRIBUTION_TNT_v5";
const PREVIOUS_RECEIPT = "AUDRALIA_SURFACE_PARENT_STANDARD_RATIO_LOCK_TNT_v4";
const CONTRACT = "AUDRALIA_SURFACE_PARENT_BASIN_RIDGE_NO_UNIFORM_FIELD_CONTRACT_v1";
const VERSION = "2026-05-07.surface-parent-basin-ridge-distribution.v5";

const GRID_WIDTH = 192;
const GRID_HEIGHT = 96;
const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;
const HEX_RESOLUTION = 192;

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  role: "audralia-parent-surface-basin-ridge-distribution-authority",

  parentStandard: true,
  ratioLocked: true,
  basinDistributionActive: true,
  ridgeDistributionActive: true,
  uniformFieldSuppressed: true,
  downstreamClassificationOverrideAllowed: false,
  downstreamDetailOnly: true,

  runtimeImport: false,
  runtimeAuthority: false,
  motionAuthority: false,
  paintAuthority: false,
  blurAuthority: false,
  compositorAuthority: false,
  visualSovereignty: false,

  staticSurfaceTruthAuthority: true,
  hexMicroSurfaceTruthAuthority: true,
  landWaterAuthority: true,
  terrainScalarAuthority: true,
  materialHintAuthority: true,

  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

let cachedSummary = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const denominator = Math.max(0.000001, edge1 - edge0);
  const t = clamp01((value - edge0) / denominator);
  return t * t * (3 - 2 * t);
}

function normalizeLongitudeRadians(lon) {
  let value = Number(lon) || 0;

  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;

  return value;
}

function normalizeLongitudeDegrees(lon) {
  let value = Number(lon) || 0;

  while (value > 180) value -= 360;
  while (value < -180) value += 360;

  return value;
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.03;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridged3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    const n = valueNoise3(x * frequency, y * frequency, z * frequency);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.12;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (input && typeof input === "object") {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg))
      ? Number(input.u ?? input.x ?? uArg)
      : 0.5;

    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg))
      ? Number(input.v ?? input.y ?? vArg)
      : 0.5;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat *= Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon *= Math.PI / 180;

    return {
      lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
      lon: normalizeLongitudeRadians(lon),
      u,
      v
    };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat *= Math.PI / 180;
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon *= Math.PI / 180;

  return {
    lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
    lon: normalizeLongitudeRadians(lon),
    u,
    v
  };
}

const LAND_LOBES = Object.freeze([
  { id: "western-highland-basin-edge", lat: 14, lon: -116, rx: 31, ry: 18, twist: -18, weight: 1.06, material: "green-granite-opal" },
  { id: "southwest-folded-range", lat: -32, lon: -68, rx: 25, ry: 34, twist: 24, weight: 0.95, material: "slate-granite-ridge" },
  { id: "eastern-broken-continent", lat: 4, lon: 38, rx: 37, ry: 21, twist: 10, weight: 1.00, material: "gold-granite-slate" },
  { id: "southeast-shelf-mass", lat: -42, lon: 108, rx: 38, ry: 18, twist: -8, weight: 0.92, material: "weathered-green-stone" },
  { id: "northern-crown-islands", lat: 55, lon: -18, rx: 28, ry: 12, twist: 3, weight: 0.76, material: "ice-opal-crown" },
  { id: "equatorial-ancient-chain", lat: -7, lon: 145, rx: 31, ry: 10, twist: 17, weight: 0.80, material: "ancient-brown-granite" },
  { id: "western-pressure-islands", lat: 2, lon: -164, rx: 23, ry: 13, twist: -22, weight: 0.62, material: "pressure-island-slate" },
  { id: "northwest-reef-scarp", lat: 37, lon: 128, rx: 27, ry: 14, twist: 28, weight: 0.58, material: "coastal-opal-islands" },
  { id: "southern-ice-footland", lat: -61, lon: -12, rx: 42, ry: 10, twist: -2, weight: 0.56, material: "ice-granite-footland" },
  { id: "far-east-reef-knife", lat: -20, lon: 171, rx: 26, ry: 10, twist: 31, weight: 0.54, material: "reef-knife-opal" }
]);

const SEA_LANES = Object.freeze([
  { id: "central-blue-basin", lon: -4, width: 34, strength: 0.38, wave: 18, phase: 0.1 },
  { id: "western-ocean-cut", lon: -138, width: 28, strength: 0.33, wave: 22, phase: 1.7 },
  { id: "eastern-basin-cut", lon: 78, width: 30, strength: 0.31, wave: 20, phase: 2.4 },
  { id: "southern-shelf-channel", lon: 150, width: 24, strength: 0.27, wave: 28, phase: 3.2 }
]);

function ellipseInfluenceDegrees(latDeg, lonDeg, lobe) {
  const latitudeScale = Math.max(0.22, Math.cos(latDeg * Math.PI / 180));
  const deltaLon = normalizeLongitudeDegrees(lonDeg - lobe.lon) * latitudeScale;
  const deltaLat = latDeg - lobe.lat;
  const twist = lobe.twist * Math.PI / 180;

  const x = deltaLon * Math.cos(twist) - deltaLat * Math.sin(twist);
  const y = deltaLon * Math.sin(twist) + deltaLat * Math.cos(twist);

  const dx = x / Math.max(1, lobe.rx);
  const dy = y / Math.max(1, lobe.ry);
  const distance = Math.sqrt(dx * dx + dy * dy);

  return smoothstep(1.12, 0.22, distance) * lobe.weight;
}

function seaLaneInfluence(latDeg, lonDeg, lane) {
  const curve = lane.lon + Math.sin((latDeg + lane.phase * 30) * Math.PI / 90) * lane.wave;
  const distance = Math.abs(normalizeLongitudeDegrees(lonDeg - curve)) * Math.max(0.32, Math.cos(latDeg * Math.PI / 180));
  return smoothstep(lane.width, lane.width * 0.26, distance) * lane.strength;
}

function lobeContext(latDeg, lonDeg) {
  let strongest = 0;
  let strongestLobe = LAND_LOBES[0];
  let sum = 0;

  for (const lobe of LAND_LOBES) {
    const influence = ellipseInfluenceDegrees(latDeg, lonDeg, lobe);
    sum += influence;

    if (influence > strongest) {
      strongest = influence;
      strongestLobe = lobe;
    }
  }

  return {
    strongest,
    sum,
    lobe: strongestLobe,
    lobeId: strongestLobe.id,
    materialFamily: strongestLobe.material
  };
}

function basinCut(latDeg, lonDeg, point) {
  let laneCut = 0;

  for (const lane of SEA_LANES) {
    laneCut = Math.max(laneCut, seaLaneInfluence(latDeg, lonDeg, lane));
  }

  const equatorialSea = smoothstep(34, 8, Math.abs(latDeg + Math.sin(lonDeg * Math.PI / 72) * 10)) * 0.16;
  const polarWaterBreak = smoothstep(80, 61, Math.abs(latDeg)) * 0.10;
  const organicBasinNoise = fbm3(point.x * 4.2 - 12.0, point.y * 4.2 + 3.1, point.z * 4.2 + 8.4, 4) * 0.12;

  return clamp01(laneCut + equatorialSea + polarWaterBreak + organicBasinNoise);
}

function staticLandPotential(lat, lon) {
  const point = latLonToPoint(lat, lon);
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = lon * 180 / Math.PI;
  const context = lobeContext(latDeg, lonDeg);

  const broad = fbm3(point.x * 2.9 + 3.1, point.y * 2.9 - 1.4, point.z * 2.9 + 5.9, 5);
  const ridge = ridged3(point.x * 6.2 - 7.2, point.y * 6.2 + 4.4, point.z * 6.2 - 2.9, 4);
  const micro = fbm3(point.x * 21.0 + 1.8, point.y * 21.0 - 9.6, point.z * 21.0 + 6.2, 3);
  const cut = basinCut(latDeg, lonDeg, point);

  const fragmentedContinentalMass =
    context.strongest * 0.68 +
    clamp(context.sum * 0.16, 0, 0.32) +
    broad * 0.10 +
    ridge * 0.075 +
    micro * 0.035;

  const waterForces =
    cut * 0.48 +
    smoothstep(0.82, 0.98, Math.abs(point.y)) * 0.08;

  return clamp01(fragmentedContinentalMass - waterForces + 0.035);
}

function buildSurfaceModel() {
  const scores = [];

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const v = (row + 0.5) / GRID_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const u = (col + 0.5) / GRID_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      scores.push(staticLandPotential(lat, lon));
    }
  }

  scores.sort((a, b) => b - a);

  const index = clamp(Math.floor(scores.length * TARGET_SOLID_SURFACE_RATIO) - 1, 0, scores.length - 1);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    totalSamples: scores.length,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    landThreshold: scores[index],
    hexResolution: HEX_RESOLUTION
  });
}

const surfaceModel = buildSurfaceModel();

function hexRound(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr, s: -rq - rr };
}

function computeHexCell(coordinate, point) {
  const scale = HEX_RESOLUTION;
  const x = (coordinate.lon / Math.PI) * scale * Math.max(0.28, Math.cos(coordinate.lat));
  const y = (coordinate.lat / (Math.PI / 2)) * scale * 0.82;
  const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y);
  const r = (2 / 3 * y);
  const rounded = hexRound(q, r);
  const ring = Math.max(Math.abs(rounded.q), Math.abs(rounded.r), Math.abs(rounded.s));
  const seed = hash3(rounded.q, rounded.r, ring + point.z * 19.37);

  return Object.freeze({
    id: `audralia-h${HEX_RESOLUTION}-q${rounded.q}-r${rounded.r}`,
    q: rounded.q,
    r: rounded.r,
    s: rounded.s,
    ring,
    resolution: HEX_RESOLUTION,
    seed
  });
}

function materialProfile(materialFamily, sample) {
  const relief = clamp01(sample.reliefTexture);
  const mineral = clamp01(sample.mineralIndex);
  const coast = clamp01(sample.coastlineIndex);
  const turquoise = clamp01(sample.turquoiseIndex);

  let diamond = 0.04;
  let opal = 0.06;
  let granite = 0.08;
  let slate = 0.08;
  let whiteOpalSand = 0;
  let blackDiamondSand = 0;

  if (sample.ice) {
    diamond = clamp01(0.28 + mineral * 0.18);
    opal = clamp01(0.20 + turquoise * 0.14);
    whiteOpalSand = clamp01(0.22 + coast * 0.16);
  } else if (sample.exposedTerrainLand) {
    diamond = clamp01(mineral * 0.40 + relief * 0.14);
    opal = clamp01(coast * 0.30 + mineral * 0.14);
    granite = clamp01(0.20 + relief * 0.44 + mineral * 0.14);
    slate = clamp01(0.15 + relief * 0.30 + (1 - mineral) * 0.10);
    whiteOpalSand = clamp01(coast * 0.34 + turquoise * 0.10);
    blackDiamondSand = clamp01(coast * relief * 0.24 + slate * 0.10);
  } else if (sample.shelf) {
    opal = clamp01(0.34 + turquoise * 0.30);
    whiteOpalSand = clamp01(0.20 + coast * 0.34);
    diamond = clamp01(0.08 + turquoise * 0.08);
  } else if (sample.ocean) {
    opal = clamp01(0.10 + turquoise * 0.08);
    slate = clamp01(0.08 + sample.depth * 0.16);
  }

  if (String(materialFamily).includes("opal")) opal = clamp01(opal + 0.10);
  if (String(materialFamily).includes("granite")) granite = clamp01(granite + 0.10);
  if (String(materialFamily).includes("slate")) slate = clamp01(slate + 0.09);
  if (String(materialFamily).includes("ice")) whiteOpalSand = clamp01(whiteOpalSand + 0.10);

  return Object.freeze({
    diamondSignal: diamond,
    opalSignal: opal,
    graniteSignal: granite,
    slateSignal: slate,
    whiteOpalSandSignal: whiteOpalSand,
    blackDiamondSandSignal: blackDiamondSand,
    parentMaterialHint: sample.ice
      ? "ice-opal-diamond"
      : sample.exposedTerrainLand
        ? materialFamily
        : sample.shelf
          ? "opal-shelf-water"
          : "deep-blue-slate-water"
  });
}

function classifySurface(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const latDeg = coordinate.lat * 180 / Math.PI;
  const lonDeg = coordinate.lon * 180 / Math.PI;
  const lobe = lobeContext(latDeg, lonDeg);
  const score = staticLandPotential(coordinate.lat, coordinate.lon);
  const threshold = surfaceModel.landThreshold;

  const solidSurfaceLand = score >= threshold;
  const liquidWater = !solidSurfaceLand;
  const edgeDistance = Math.abs(score - threshold);

  const nearCoast = edgeDistance < 0.074;
  const waterTexture = fbm3(point.x * 15.0 + 8.7, point.y * 15.0 - 3.4, point.z * 15.0 + 2.6, 4);
  const reliefTexture = ridged3(point.x * 17.0 + 2.2, point.y * 17.0 - 8.1, point.z * 17.0 + 6.4, 4);
  const colorBreak = fbm3(point.x * 34.0 + 4.1, point.y * 34.0 - 2.8, point.z * 34.0 + 7.2, 3);
  const mineralIndex = fbm3(point.x * 26.0 - 9.1, point.y * 26.0 + 5.2, point.z * 26.0 - 1.7, 4);
  const microTerrain = ridged3(point.x * 52.0 + 11.2, point.y * 52.0 - 4.9, point.z * 52.0 + 2.1, 3);
  const glazeTexture = fbm3(point.x * 64.0 - 2.5, point.y * 64.0 + 8.4, point.z * 64.0 - 9.9, 3);
  const iceNoise = fbm3(point.x * 11.0 - 4.3, point.y * 11.0 + 11.1, point.z * 11.0 - 5.7, 4);

  const shelf = liquidWater && (score > threshold - 0.110 || waterTexture > 0.855);
  const ocean = liquidWater && !shelf;

  const highLatitudeLand = Math.abs(point.y) > 0.78;
  const ice =
    solidSurfaceLand &&
    (
      (Math.abs(point.y) > 0.88 && iceNoise > 0.20) ||
      (highLatitudeLand && iceNoise > 0.72)
    );

  const exposedTerrainLand = solidSurfaceLand && !ice;
  const coastlineIndex = nearCoast || shelf ? clamp01(1 - edgeDistance / 0.110) : 0;
  const shelfIndex = shelf ? clamp01(0.42 + coastlineIndex * 0.36 + waterTexture * 0.22) : 0;

  const elevation = solidSurfaceLand
    ? clamp01(
        0.13 +
        (score - threshold) * 2.10 +
        reliefTexture * 0.28 +
        microTerrain * 0.11 +
        (ice ? 0.12 : 0)
      )
    : 0;

  const depth = liquidWater
    ? clamp01(
        0.18 +
        (threshold - score) * 1.52 +
        waterTexture * 0.25 +
        (ocean ? 0.18 : 0)
      )
    : 0;

  const turquoiseIndex = shelf
    ? clamp01(0.40 + shelfIndex * 0.38 + waterTexture * 0.12)
    : ocean
      ? clamp01(0.08 + waterTexture * 0.12)
      : clamp01(coastlineIndex * 0.16);

  const ridgeIndex = exposedTerrainLand ? clamp01(reliefTexture * 0.58 + mineralIndex * 0.20 + elevation * 0.18) : 0;
  const mountainIndex = exposedTerrainLand ? clamp01(elevation * 0.62 + reliefTexture * 0.34 + microTerrain * 0.10) : 0;
  const basinIndex = exposedTerrainLand ? clamp01((1 - elevation) * 0.28 + waterTexture * 0.22 + (1 - reliefTexture) * 0.14) : 0;
  const coastalCliffIndex = exposedTerrainLand && coastlineIndex > 0
    ? clamp01(elevation * 0.40 + reliefTexture * 0.34 + coastlineIndex * 0.22)
    : 0;

  const riverCandidate = exposedTerrainLand
    ? clamp01(basinIndex * 0.28 + ridgeIndex * 0.16 + coastlineIndex * 0.16 + waterTexture * 0.22)
    : 0;

  const lakeBasinCandidate = exposedTerrainLand
    ? clamp01(basinIndex * 0.46 + (1 - elevation) * 0.18 + waterTexture * 0.16)
    : 0;

  const springCandidate = exposedTerrainLand
    ? clamp01(mineralIndex * 0.22 + waterTexture * 0.24 + reliefTexture * 0.18)
    : 0;

  const baseSample = {
    ice,
    exposedTerrainLand,
    shelf,
    ocean,
    depth,
    elevation,
    coastlineIndex,
    shelfIndex,
    turquoiseIndex,
    reliefTexture,
    mineralIndex
  };

  const material = materialProfile(lobe.materialFamily, baseSample);
  const hexCell = computeHexCell(coordinate, point);
  const microGlazeIndex = clamp01(glazeTexture * 0.46 + microTerrain * 0.22 + material.opalSignal * 0.18 + coastlineIndex * 0.14);
  const parentEdgeDefinition = clamp01(coastlineIndex * 0.45 + ridgeIndex * 0.20 + coastalCliffIndex * 0.20 + microTerrain * 0.15);
  const parentHexDetailIndex = clamp01(hexCell.seed * 0.24 + microTerrain * 0.34 + reliefTexture * 0.18 + glazeTexture * 0.24);

  const visualSurfaceClass = ice
    ? "glacier_ice_snowpack_surface"
    : exposedTerrainLand
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    source: "audralia-parent-surface-basin-ridge-distribution",

    lat: coordinate.lat,
    lon: coordinate.lon,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,

    score,
    threshold,
    edgeDistance,
    lobeId: lobe.lobeId,
    lobeInfluence: lobe.strongest,
    materialFamily: lobe.materialFamily,

    hexCell,
    hexCellId: hexCell.id,
    hexQ: hexCell.q,
    hexR: hexCell.r,
    hexS: hexCell.s,
    hexRing: hexCell.ring,
    hexResolution: hexCell.resolution,
    parentHexDetailIndex,

    solidSurfaceLand,
    topologyLand: solidSurfaceLand,
    land: exposedTerrainLand,
    exposedTerrainLand,
    visibleLand: exposedTerrainLand,

    liquidWater,
    water: liquidWater,
    ocean,
    shelf,

    ice,
    glacier: ice,
    coastal: nearCoast || shelf,
    beach: nearCoast || shelf,
    hydrated: liquidWater || nearCoast || shelf || ice,

    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
    depth,
    maxDepth: depth,
    oceanDepth: depth,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    turquoise: turquoiseIndex,
    turquoiseIndex,
    blueWaterIndex: ocean ? clamp01(0.60 + depth * 0.30) : shelf ? 0.36 : 0,

    reliefTexture,
    colorBreak,
    mineralIndex,
    microTerrainIndex: microTerrain,
    microGlazeIndex,
    parentEdgeDefinition,

    ridgeIndex,
    mountainIndex,
    basinIndex,
    coastalCliffIndex,
    canyonIndex: 0,

    river: riverCandidate > 0.72,
    stream: riverCandidate > 0.62,
    lake: lakeBasinCandidate > 0.66,
    floodplain: (nearCoast || shelf) && riverCandidate > 0.56,
    delta: (nearCoast || shelf) && riverCandidate > 0.64,
    spring: springCandidate > 0.68,
    subterranean: exposedTerrainLand && springCandidate > 0.62,

    riverCandidate,
    streamCandidate: riverCandidate,
    lakeBasinCandidate,
    floodplainCandidate: nearCoast || shelf ? clamp01(riverCandidate * 0.58 + coastlineIndex * 0.28) : 0,
    deltaCandidate: nearCoast || shelf ? clamp01(riverCandidate * 0.46 + coastlineIndex * 0.38) : 0,
    springCandidate,
    subterraneanCandidate: exposedTerrainLand ? clamp01(springCandidate * 0.62 + mineralIndex * 0.20) : 0,

    diamondSignal: material.diamondSignal,
    opalSignal: material.opalSignal,
    graniteSignal: material.graniteSignal,
    slateSignal: material.slateSignal,
    whiteOpalSandSignal: material.whiteOpalSandSignal,
    blackDiamondSandSignal: material.blackDiamondSandSignal,
    parentMaterialHint: material.parentMaterialHint,

    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,

    parentStandard: true,
    ratioLocked: true,
    basinDistributionActive: true,
    ridgeDistributionActive: true,
    uniformFieldSuppressed: true,
    downstreamClassificationOverrideAllowed: false,
    downstreamDetailOnly: true,

    staticSurfaceTruthAuthority: true,
    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    compositorAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

function computeSummary() {
  if (cachedSummary) return cachedSummary;

  const classCounts = {};
  const rowDominance = [];

  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let exposedTerrainLandSamples = 0;
  let iceSamples = 0;
  let shelfSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let parentHexDetailAccum = 0;
  let parentEdgeDefinitionAccum = 0;
  let maxParentHexDetailIndex = 0;
  let maxParentEdgeDefinition = 0;
  let maxElevation = 0;
  let maxDepth = 0;
  let maxTurquoise = 0;
  let maxMicroGlaze = 0;

  const total = GRID_WIDTH * GRID_HEIGHT;

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const v = (row + 0.5) / GRID_HEIGHT;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const u = (col + 0.5) / GRID_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = classifySurface({ lat, lon, u, v });

      classCounts[sample.visualSurfaceClass] = (classCounts[sample.visualSurfaceClass] || 0) + 1;
      rowCounts[sample.visualSurfaceClass] = (rowCounts[sample.visualSurfaceClass] || 0) + 1;

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.ice) iceSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.coastal) coastalSamples += 1;

      parentHexDetailAccum += sample.parentHexDetailIndex;
      parentEdgeDefinitionAccum += sample.parentEdgeDefinition;
      maxParentHexDetailIndex = Math.max(maxParentHexDetailIndex, sample.parentHexDetailIndex);
      maxParentEdgeDefinition = Math.max(maxParentEdgeDefinition, sample.parentEdgeDefinition);
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxDepth = Math.max(maxDepth, sample.depth);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoiseIndex);
      maxMicroGlaze = Math.max(maxMicroGlaze, sample.microGlazeIndex);
    }

    const dominant = Math.max(...Object.values(rowCounts));
    rowDominance.push(dominant / GRID_WIDTH);
  }

  const solidSurfaceLandRatio = solidSurfaceLandSamples / total;
  const liquidWaterRatio = liquidWaterSamples / total;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / total;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedSummary = Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    totalSamples: total,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),

    solidSurfaceLandSamples,
    liquidWaterSamples,
    exposedTerrainLandSamples,
    iceSamples,
    shelfSamples,
    oceanSamples,
    coastalSamples,

    waterSamples: liquidWaterSamples,
    landSamples: exposedTerrainLandSamples,
    topologyLandSamples: solidSurfaceLandSamples,
    visibleLandSamples: exposedTerrainLandSamples,

    solidSurfaceLandRatio,
    liquidWaterRatio,
    exposedTerrainLandRatio,
    iceRatio: iceSamples / total,
    shelfRatio: shelfSamples / total,
    oceanRatio: oceanSamples / total,
    coastalRatio: coastalSamples / total,

    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidWaterRatioTargetMet:
      liquidWaterRatio >= TARGET_LIQUID_WATER_RATIO_MIN &&
      liquidWaterRatio <= TARGET_LIQUID_WATER_RATIO_MAX,

    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.92,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.98,
    uniformFieldSuppressed: true,
    basinDistributionActive: true,
    ridgeDistributionActive: true,

    maxElevation,
    maxDepth,
    maxTurquoise,
    maxMicroGlaze,
    maxParentHexDetailIndex,
    maxParentEdgeDefinition,
    averageParentHexDetailIndex: parentHexDetailAccum / total,
    averageParentEdgeDefinition: parentEdgeDefinitionAccum / total,

    hexResolution: HEX_RESOLUTION,
    model: surfaceModel,

    downstreamClassificationOverrideAllowed: false,
    downstreamDetailOnly: true,

    staticSurfaceTruthAuthority: true,
    parentStandard: true,
    ratioLocked: true,
    hexMicroSurfaceTruthAuthority: true,
    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    compositorAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });

  return cachedSummary;
}

function exposeSurfaceStatus() {
  STATUS.summary = cachedSummary || null;

  if (typeof window !== "undefined") {
    window.AUDRALIA_SURFACE_STATUS = STATUS;
    window.AUDRALIA_SURFACE_RECEIPT = RECEIPT;
    window.AUDRALIA_SURFACE_SUMMARY = cachedSummary;
    window.__AUDRALIA_SURFACE_STATUS__ = STATUS;
    window.__AUDRALIA_SURFACE_RECEIPT__ = RECEIPT;
    window.__AUDRALIA_SURFACE_SUMMARY__ = cachedSummary;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaSurfaceReceipt = RECEIPT;
    document.documentElement.dataset.audraliaSurfacePreviousReceipt = PREVIOUS_RECEIPT;
    document.documentElement.dataset.audraliaSurfaceContract = CONTRACT;
    document.documentElement.dataset.audraliaSurfaceTruthBridge = "true";
    document.documentElement.dataset.audraliaSurfaceParentStandard = "true";
    document.documentElement.dataset.audraliaSurfaceRatioLocked = "true";
    document.documentElement.dataset.audraliaSurfaceBasinDistributionActive = "true";
    document.documentElement.dataset.audraliaSurfaceRidgeDistributionActive = "true";
    document.documentElement.dataset.audraliaSurfaceUniformFieldSuppressed = "true";
    document.documentElement.dataset.audraliaSurfaceDownstreamClassificationOverrideAllowed = "false";
    document.documentElement.dataset.audraliaSurfaceDownstreamDetailOnly = "true";
    document.documentElement.dataset.audraliaSurfaceRuntimeAuthority = "false";
    document.documentElement.dataset.audraliaSurfacePaintAuthority = "false";
    document.documentElement.dataset.audraliaSurfaceBlurAuthority = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("audralia:surface-status", { detail: STATUS }));
    }
  } catch (_) {}

  return STATUS;
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return classifySurface(normalizeCoordinateInput(input, lonArg, uArg, vArg));
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurfaceTruth(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export function sampleParentSurface(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export async function initializeSurfaceDownstream() {
  exposeSurfaceStatus();
  return STATUS;
}

export function getStatus() {
  return {
    ...STATUS,
    summary: cachedSummary
  };
}

export function getSummary() {
  cachedSummary = computeSummary();
  exposeSurfaceStatus();
  return cachedSummary;
}

export function getSurfaceSummary() {
  return getSummary();
}

export function getParentStandard() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    standard: "parent-surface-basin-ridge-distribution-standard",
    importsBlockFirstPaint: false,
    downstreamClassificationOverrideAllowed: false,
    downstreamDetailOnly: true,
    owns: Object.freeze([
      "static_surface_truth",
      "land_water_ice_shelf_classification",
      "earth_compatible_ratio_lock",
      "basin_distribution",
      "ridge_distribution",
      "elevation_depth_scalar_fields",
      "coastline_gradient_fields",
      "material_hint_fields",
      "hex_cell_metadata",
      "micro_relief_indices",
      "parent_grade_surface_summary"
    ]),
    doesNotOwn: Object.freeze([
      "runtime_motion",
      "animation_clock",
      "canvas_paint",
      "pixel_blending",
      "blur",
      "route_mount",
      "gauges_scoring",
      "visual_pass_claim"
    ]),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function getSurfaceDataset() {
  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    model: surfaceModel,
    landLobes: LAND_LOBES,
    seaLanes: SEA_LANES,
    summary: cachedSummary,
    status: getStatus(),
    parentStandard: getParentStandard()
  });
}

export const AUDRALIA_SURFACE_STATUS = STATUS;
export const AUDRALIA_SURFACE_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_SURFACE_PREVIOUS_RECEIPT_VALUE = PREVIOUS_RECEIPT;
export const AUDRALIA_SURFACE_CONTRACT_VALUE = CONTRACT;
export const AUDRALIA_SURFACE_PARENT_STANDARD = true;
export const AUDRALIA_SURFACE_RATIO_LOCKED = true;
export const AUDRALIA_SURFACE_NONBLOCKING_BOOT = true;
export const AUDRALIA_SURFACE_BASIN_DISTRIBUTION_ACTIVE = true;
export const AUDRALIA_SURFACE_RIDGE_DISTRIBUTION_ACTIVE = true;
export const AUDRALIA_SURFACE_UNIFORM_FIELD_SUPPRESSED = true;
export const AUDRALIA_SURFACE_DOWNSTREAM_CLASSIFICATION_OVERRIDE_ALLOWED = false;

export const AUDRALIA_SURFACE_DATASET = Object.freeze({
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  model: surfaceModel,
  landLobes: LAND_LOBES,
  seaLanes: SEA_LANES,
  hexResolution: HEX_RESOLUTION,
  parentStandard: true,
  ratioLocked: true,
  basinDistributionActive: true,
  ridgeDistributionActive: true,
  uniformFieldSuppressed: true,
  nonblockingBoot: true,
  downstreamClassificationOverrideAllowed: false
});

exposeSurfaceStatus();

export default Object.freeze({
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  parentStandard: true,
  ratioLocked: true,
  basinDistributionActive: true,
  ridgeDistributionActive: true,
  uniformFieldSuppressed: true,
  nonblockingBoot: true,
  downstreamClassificationOverrideAllowed: false,
  sampleSurface,
  sampleAudraliaSurface,
  sampleAudraliaSurfaceTruth,
  sampleParentSurface,
  initializeSurfaceDownstream,
  getStatus,
  getSummary,
  getSurfaceSummary,
  getSurfaceDataset,
  getParentStandard
});
