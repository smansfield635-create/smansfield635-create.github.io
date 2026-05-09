// /assets/audralia/audralia.terrain.fingers.js
// AUDRALIA_V18_TERRAIN_FIVE_FINGER_REEXPRESSION_TNT_v1
// Terrain truth expression only.
// Five terrain fingers:
// 1. mountains/ranges
// 2. valleys/basins
// 3. cliffs/escarpments
// 4. beaches/coastal shelves
// 5. peninsulas/bays/islands/inlets
// Runtime remains motion-only.
// Assets consume this terrain expression and preserve visible boundaries.
// No GraphicBox. No generated image. No visual-pass claim.

const CONTRACT = "AUDRALIA_V18_TERRAIN_FIVE_FINGER_REEXPRESSION_TNT_v1";
const RECEIPT = "AUDRALIA_V18_TERRAIN_FIVE_FINGER_RECEIPT";
const VERSION = "2026-05-09.audralia-v18-five-finger-terrain-reexpression";

const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function wrapDelta(value) {
  return mod(value + 0.5, 1) - 0.5;
}

function hash(a, b, seed) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b);
  h ^= Math.imul(b ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function noise(u, v, scale, seed) {
  const s = Math.max(1, Math.floor(scale));
  const x = u * s;
  const y = v * s;

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const xf = x - x0;
  const yf = y - y0;

  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);

  return lerp(
    lerp(hash(mod(x0, s), y0, seed), hash(mod(x1, s), y0, seed), sx),
    lerp(hash(mod(x0, s), y1, seed), hash(mod(x1, s), y1, seed), sx),
    sy
  );
}

function fbm(u, v, seed) {
  let amp = 0.5;
  let total = 0;
  let norm = 0;
  let scale = 4;

  for (let i = 0; i < 5; i += 1) {
    total += noise(u, v, scale, seed + i * 97) * amp;
    norm += amp;
    amp *= 0.52;
    scale *= 2;
  }

  return total / Math.max(0.000001, norm);
}

function ridged(u, v, seed) {
  let amp = 0.54;
  let total = 0;
  let norm = 0;
  let scale = 8;

  for (let i = 0; i < 4; i += 1) {
    const n = noise(u, v, scale, seed + i * 71);
    total += (1 - Math.abs(n * 2 - 1)) * amp;
    norm += amp;
    amp *= 0.52;
    scale *= 2;
  }

  return total / Math.max(0.000001, norm);
}

function ellipseMetrics(u, v, cx, cy, rx, ry, angle) {
  const dx = wrapDelta(u - cx);
  const dy = v - cy;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const x = dx * ca - dy * sa;
  const y = dx * sa + dy * ca;
  const dist = Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));

  return { x, y, dist, field: 1 - dist, theta: Math.atan2(y / ry, x / rx) };
}

function maxOf(values) {
  let out = -999;
  for (let i = 0; i < values.length; i += 1) out = Math.max(out, values[i]);
  return out;
}

function primaryLand(u, v) {
  const core = ellipseMetrics(u, v, 0.335, 0.505, 0.235, 0.265, -0.24);
  const shoulder = ellipseMetrics(u, v, 0.275, 0.415, 0.12, 0.145, -0.86);
  const southeast = ellipseMetrics(u, v, 0.425, 0.575, 0.13, 0.15, 0.42);
  const lower = ellipseMetrics(u, v, 0.275, 0.665, 0.078, 0.108, 0.08);

  return {
    metrics: core,
    field: maxOf([core.field, shoulder.field, southeast.field, lower.field])
  };
}

function secondaryLand(u, v) {
  const east = ellipseMetrics(u, v, 0.77, 0.58, 0.105, 0.315, 0.04);
  const southeast = ellipseMetrics(u, v, 0.825, 0.695, 0.064, 0.175, -0.30);
  const northeast = ellipseMetrics(u, v, 0.722, 0.45, 0.052, 0.112, 0.55);

  return {
    metrics: east,
    field: maxOf([east.field, southeast.field, northeast.field])
  };
}

function islandLand(u, v) {
  const a = ellipseMetrics(u, v, 0.18, 0.68, 0.034, 0.06, -0.16);
  const b = ellipseMetrics(u, v, 0.23, 0.72, 0.03, 0.052, 0.45);
  const c = ellipseMetrics(u, v, 0.37, 0.25, 0.025, 0.018, 0.1);
  const d = ellipseMetrics(u, v, 0.41, 0.23, 0.018, 0.013, -0.25);
  const e = ellipseMetrics(u, v, 0.62, 0.76, 0.022, 0.04, 0.18);

  return {
    field: maxOf([a.field, b.field, c.field, d.field, e.field]),
    seats: [a, b, c, d, e]
  };
}

function audraliaLandField(u, v) {
  const primary = primaryLand(u, v);
  const secondary = secondaryLand(u, v);
  const islands = islandLand(u, v);

  const coastlineBreak = (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.15;
  const reliefBreak = (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.074;

  return {
    primary,
    secondary,
    islands,
    field: maxOf([primary.field, secondary.field, islands.field]) + coastlineBreak + reliefBreak
  };
}

function ringMountain(metrics, landMask) {
  const ringDistance = Math.abs(metrics.dist - 0.58);
  const ring = Math.exp(-(ringDistance * ringDistance) / 0.012);
  const breakNoise = smoothstep(0.18, 0.86, ridged(metrics.x * 1.8 + 0.2, metrics.y * 1.8 - 0.1, 6001));
  return clamp(ring * (0.72 + breakNoise * 0.38) * landMask, 0, 1);
}

function centralBasin(metrics, landMask) {
  const basin = Math.exp(-(metrics.dist * metrics.dist) / 0.105);
  const floorNoise = 1 - smoothstep(0.58, 0.92, ridged(metrics.x * 2.2, metrics.y * 2.2, 6009));
  return clamp(basin * floorNoise * landMask, 0, 1);
}

function spiralRange(metrics, landMask, turns, pressure, phase) {
  const r = metrics.dist;
  const theta = metrics.theta;
  const wave = 0.5 + 0.5 * Math.sin(theta * turns + r * pressure + phase);
  const band = smoothstep(0.70, 0.98, wave);
  const radial = smoothstep(0.18, 0.46, r) * (1 - smoothstep(0.94, 1.18, r));
  const breakNoise = smoothstep(0.32, 0.92, ridged(metrics.x * 1.7, metrics.y * 1.7, 6047));
  return clamp(band * radial * breakNoise * landMask, 0, 1);
}

function islandArticulation(islandSeats) {
  let out = 0;

  for (const seat of islandSeats) {
    out = Math.max(out, smoothstep(-0.12, 0.12, seat.field));
  }

  return clamp(out, 0, 1);
}

function classifyAudraliaTerrain(u, v) {
  const land = audraliaLandField(u, v);
  const field = land.field;
  const isLand = field > 0;
  const landMask = smoothstep(-0.045, 0.14, field);

  const coast = 1 - clamp(Math.abs(field) * 19, 0, 1);
  const coastline = smoothstep(0.0, 0.85, coast);
  const shelf = smoothstep(-0.20, 0.025, field);
  const deepOcean = isLand ? 0 : 1 - shelf;
  const shelfWater = isLand ? 0 : shelf;

  const primaryMask = smoothstep(-0.05, 0.14, land.primary.field);
  const secondaryMask = smoothstep(-0.05, 0.14, land.secondary.field);
  const islandMask = smoothstep(-0.05, 0.14, land.islands.field);

  const primaryRing = ringMountain(land.primary.metrics, primaryMask);
  const primaryBasin = centralBasin(land.primary.metrics, primaryMask);

  const secondarySpiral = spiralRange(land.secondary.metrics, secondaryMask, 3.25, 8.8, 0.45);
  const secondaryOuter = spiralRange(land.secondary.metrics, secondaryMask, 4.6, 10.2, 2.1);

  const broad = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridgeNoise = ridged(u + 0.021, v - 0.015, 1409);
  const mineralNoise = noise(u + 0.42, v - 0.18, 72, 9207);
  const seamNoise = ridged(u * 1.7 + 0.03, v * 1.4 - 0.08, 6113);

  const mountainRanges = isLand
    ? clamp(Math.max(primaryRing, secondarySpiral, secondaryOuter, ridgeNoise * 0.34 * landMask), 0, 1)
    : 0;

  const basinValleys = isLand
    ? clamp(Math.max(primaryBasin, (1 - mountainRanges) * smoothstep(0.08, 0.56, field) * (1 - ridgeNoise) * 0.7), 0, 1)
    : 0;

  const cliffsEscarpments = isLand
    ? clamp(coastline * smoothstep(0.46, 0.92, ridgeNoise) * (1 - smoothstep(0.52, 0.95, primaryBasin)), 0, 1)
    : 0;

  const beachesShelves = clamp(
    coastline * (isLand ? smoothstep(0.07, 0.0, Math.abs(field)) : shelfWater),
    0,
    1
  );

  const peninsulaNoise = ridged(u * 2.4 - 0.18, v * 2.0 + 0.09, 7181);
  const island = islandArticulation(land.islands.seats);
  const peninsulasBaysIslands = clamp(
    coastline * smoothstep(0.44, 0.95, peninsulaNoise) + island * 0.9,
    0,
    1
  );

  const elevation = isLand
    ? clamp(0.20 + field * 0.62 + mountainRanges * 0.72 - basinValleys * 0.34 + broad * 0.12, 0, 1)
    : 0;

  const mineralSeam = isLand
    ? clamp(
        smoothstep(0.84, 0.99, mineralNoise) * smoothstep(0.40, 0.98, seamNoise) * (0.35 + mountainRanges * 0.65),
        0,
        1
      )
    : 0;

  return {
    field,
    isLand,
    landMask,
    primaryMask,
    secondaryMask,
    islandMask,
    coastline,
    shelfWater,
    deepOcean,
    mountainRanges,
    primaryRing,
    spiralRanges: clamp(Math.max(secondarySpiral, secondaryOuter), 0, 1),
    basinValleys,
    primaryBasin,
    cliffsEscarpments,
    beachesShelves,
    peninsulasBaysIslands,
    elevation,
    mineralSeam,
    broad,
    micro,
    ridgeNoise
  };
}

function sampleAudraliaTerrain(u, v) {
  const t = classifyAudraliaTerrain(u, v);

  return {
    contract: CONTRACT,
    receipt: RECEIPT,
    u,
    v,
    terrain: t,
    fingers: {
      mountainsRanges: t.mountainRanges,
      valleysBasins: t.basinValleys,
      cliffsEscarpments: t.cliffsEscarpments,
      beachesCoastalShelves: t.beachesShelves,
      peninsulasBaysIslandsInlets: t.peninsulasBaysIslands
    },
    specialForms: {
      primaryMountainRing: t.primaryRing,
      primaryCentralValley: t.primaryBasin,
      externalSpiralRanges: t.spiralRanges
    }
  };
}

function getAudraliaTerrainFingerStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    authority: "terrain-five-finger-expression",
    runtimeTouched: false,
    assetsAbsorbAuthority: false,
    fingers: [
      "mountains/ranges",
      "valleys/basins",
      "cliffs/escarpments",
      "beaches/coastal-shelves",
      "peninsulas/bays/islands/inlets"
    ],
    specialForms: [
      "primary-land-plot-mountain-ring-with-central-valley",
      "secondary-landmasses-external-spiral-ranges"
    ],
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const AUDRALIA_TERRAIN_FINGERS_STATUS = getAudraliaTerrainFingerStatus();
const AUDRALIA_TERRAIN_FINGERS_RECEIPT_VALUE = RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_TERRAIN_FINGERS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    classify: classifyAudraliaTerrain,
    sample: sampleAudraliaTerrain,
    getStatus: getAudraliaTerrainFingerStatus
  });

  window.__AUDRALIA_TERRAIN_FINGERS_STATUS__ = AUDRALIA_TERRAIN_FINGERS_STATUS;

  document.documentElement.dataset.audraliaTerrainFingersLoaded = "true";
  document.documentElement.dataset.audraliaTerrainFingersContract = CONTRACT;
  document.documentElement.dataset.audraliaTerrainFingersReceipt = RECEIPT;
  document.documentElement.dataset.audraliaTerrainFiveFingers = "true";
  document.documentElement.dataset.audraliaRuntimeTouched = "false";
}

export {
  CONTRACT,
  RECEIPT,
  VERSION,
  AUDRALIA_TERRAIN_FINGERS_STATUS,
  AUDRALIA_TERRAIN_FINGERS_RECEIPT_VALUE,
  classifyAudraliaTerrain,
  sampleAudraliaTerrain,
  getAudraliaTerrainFingerStatus
};

export default Object.freeze({
  contract: CONTRACT,
  receipt: RECEIPT,
  classify: classifyAudraliaTerrain,
  sample: sampleAudraliaTerrain,
  getStatus: getAudraliaTerrainFingerStatus
});
