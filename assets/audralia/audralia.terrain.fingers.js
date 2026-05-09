// /assets/audralia/audralia.terrain.fingers.js
// AUDRALIA_G2_TERRAIN_FIVE_FINGER_NATURAL_READABILITY_TNT_v1
// Full-file replacement.
// Terrain truth expression only.
// Runtime remains motion-only.
// Assets consume this terrain expression and preserve visible boundaries.
// Five terrain fingers:
// 1. mountains / ranges
// 2. valleys / basins
// 3. cliffs / escarpments
// 4. beaches / coastal shelves
// 5. peninsulas / bays / islands / inlets
// No GraphicBox. No generated image. No visual-pass claim.

const CONTRACT = "AUDRALIA_G2_TERRAIN_FIVE_FINGER_NATURAL_READABILITY_TNT_v1";
const RECEIPT = "AUDRALIA_G2_TERRAIN_FIVE_FINGER_NATURAL_READABILITY_RECEIPT";
const VERSION = "2026-05-09.audralia-g2-terrain-five-finger-natural-readability";

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
  let amp = 0.56;
  let total = 0;
  let norm = 0;
  let scale = 7;

  for (let i = 0; i < 5; i += 1) {
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
  const field = 1 - dist;
  const theta = Math.atan2(y / ry, x / rx);

  return { x, y, dist, field, theta, cx, cy, rx, ry, angle };
}

function maxOf(values) {
  let out = -999;
  for (let i = 0; i < values.length; i += 1) {
    out = Math.max(out, values[i]);
  }
  return out;
}

function primaryLand(u, v) {
  const core = ellipseMetrics(u, v, 0.335, 0.505, 0.235, 0.265, -0.24);
  const northwest = ellipseMetrics(u, v, 0.270, 0.415, 0.122, 0.148, -0.86);
  const southeast = ellipseMetrics(u, v, 0.425, 0.575, 0.130, 0.154, 0.42);
  const southern = ellipseMetrics(u, v, 0.278, 0.668, 0.080, 0.110, 0.08);

  return {
    metrics: core,
    field: maxOf([core.field, northwest.field, southeast.field, southern.field]),
    parts: { core, northwest, southeast, southern }
  };
}

function secondaryLand(u, v) {
  const eastSpine = ellipseMetrics(u, v, 0.770, 0.585, 0.105, 0.318, 0.04);
  const southeast = ellipseMetrics(u, v, 0.826, 0.700, 0.066, 0.176, -0.30);
  const northeast = ellipseMetrics(u, v, 0.722, 0.452, 0.052, 0.114, 0.55);
  const bayShoulder = ellipseMetrics(u, v, 0.742, 0.625, 0.050, 0.090, -0.45);

  return {
    metrics: eastSpine,
    field: maxOf([eastSpine.field, southeast.field, northeast.field, bayShoulder.field]),
    parts: { eastSpine, southeast, northeast, bayShoulder }
  };
}

function islandLand(u, v) {
  const seats = [
    ellipseMetrics(u, v, 0.180, 0.680, 0.034, 0.060, -0.16),
    ellipseMetrics(u, v, 0.230, 0.720, 0.030, 0.052, 0.45),
    ellipseMetrics(u, v, 0.370, 0.250, 0.025, 0.018, 0.10),
    ellipseMetrics(u, v, 0.410, 0.230, 0.018, 0.013, -0.25),
    ellipseMetrics(u, v, 0.620, 0.760, 0.022, 0.040, 0.18)
  ];

  return {
    field: maxOf(seats.map((seat) => seat.field)),
    seats
  };
}

function inletCuts(u, v) {
  const bayA = ellipseMetrics(u, v, 0.248, 0.548, 0.040, 0.085, -0.20);
  const bayB = ellipseMetrics(u, v, 0.398, 0.470, 0.050, 0.075, 0.70);
  const bayC = ellipseMetrics(u, v, 0.755, 0.535, 0.038, 0.095, 0.18);
  const bayD = ellipseMetrics(u, v, 0.804, 0.648, 0.030, 0.080, -0.45);

  const cutA = smoothstep(-0.25, 0.10, bayA.field);
  const cutB = smoothstep(-0.25, 0.12, bayB.field);
  const cutC = smoothstep(-0.24, 0.11, bayC.field);
  const cutD = smoothstep(-0.24, 0.11, bayD.field);

  return clamp(Math.max(cutA, cutB, cutC, cutD), 0, 1);
}

function audraliaLandField(u, v) {
  const primary = primaryLand(u, v);
  const secondary = secondaryLand(u, v);
  const islands = islandLand(u, v);

  const coastlineBreak = (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.150;
  const reliefBreak = (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.074;
  const inlet = inletCuts(u, v) * 0.065;

  return {
    primary,
    secondary,
    islands,
    inlet,
    field: maxOf([primary.field, secondary.field, islands.field]) + coastlineBreak + reliefBreak - inlet
  };
}

function ringMountain(metrics, landMask) {
  const ringDistance = Math.abs(metrics.dist - 0.58);
  const ring = Math.exp(-(ringDistance * ringDistance) / 0.010);
  const brokenCrown = 0.76 + smoothstep(0.24, 0.92, ridged(metrics.x * 2.1 + 0.2, metrics.y * 2.1 - 0.1, 6001)) * 0.42;
  const directionalLift = 0.82 + Math.sin(metrics.theta * 5.0 + 0.65) * 0.14;
  return clamp(ring * brokenCrown * directionalLift * landMask, 0, 1);
}

function centralBasin(metrics, landMask) {
  const basin = Math.exp(-(metrics.dist * metrics.dist) / 0.100);
  const softFloor = 1 - smoothstep(0.55, 0.96, ridged(metrics.x * 2.2, metrics.y * 2.2, 6009));
  return clamp(basin * softFloor * landMask, 0, 1);
}

function spiralRange(metrics, landMask, turns, pressure, phase) {
  const r = metrics.dist;
  const theta = metrics.theta;

  const wave = 0.5 + 0.5 * Math.sin(theta * turns + r * pressure + phase);
  const band = smoothstep(0.67, 0.985, wave);
  const radial = smoothstep(0.18, 0.44, r) * (1 - smoothstep(0.94, 1.18, r));
  const breakNoise = smoothstep(0.30, 0.94, ridged(metrics.x * 1.75, metrics.y * 1.75, 6047));

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

  const coast = 1 - clamp(Math.abs(field) * 19.5, 0, 1);
  const coastline = smoothstep(0.0, 0.86, coast);
  const shelf = smoothstep(-0.215, 0.025, field);
  const deepOcean = isLand ? 0 : 1 - shelf;
  const shelfWater = isLand ? 0 : shelf;

  const primaryMask = smoothstep(-0.05, 0.14, land.primary.field);
  const secondaryMask = smoothstep(-0.05, 0.14, land.secondary.field);
  const islandMask = smoothstep(-0.05, 0.14, land.islands.field);

  const primaryRing = ringMountain(land.primary.metrics, primaryMask);
  const primaryBasin = centralBasin(land.primary.metrics, primaryMask);

  const secondarySpiralA = spiralRange(land.secondary.metrics, secondaryMask, 3.2, 8.7, 0.45);
  const secondarySpiralB = spiralRange(land.secondary.metrics, secondaryMask, 4.7, 10.4, 2.1);
  const secondarySpiralC = spiralRange(land.secondary.metrics, secondaryMask, 5.9, 12.2, 3.35);

  const broad = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridgeNoise = ridged(u + 0.021, v - 0.015, 1409);
  const mineralNoise = noise(u + 0.42, v - 0.18, 72, 9207);
  const seamNoise = ridged(u * 1.7 + 0.03, v * 1.4 - 0.08, 6113);

  const spiralRanges = clamp(Math.max(secondarySpiralA, secondarySpiralB, secondarySpiralC), 0, 1);
  const inheritedRidge = ridgeNoise * 0.28 * landMask;

  const mountainRanges = isLand
    ? clamp(Math.max(primaryRing, spiralRanges, inheritedRidge), 0, 1)
    : 0;

  const basinValleys = isLand
    ? clamp(
        Math.max(
          primaryBasin,
          (1 - mountainRanges) * smoothstep(0.08, 0.56, field) * (1 - ridgeNoise) * 0.62
        ),
        0,
        1
      )
    : 0;

  const cliffsEscarpments = isLand
    ? clamp(
        coastline * smoothstep(0.43, 0.94, ridgeNoise) * (1 - smoothstep(0.48, 0.92, primaryBasin)) +
          mountainRanges * coastline * 0.20,
        0,
        1
      )
    : 0;

  const beachLand = isLand ? smoothstep(0.08, 0.0, Math.abs(field)) * coastline : 0;
  const beachWater = !isLand ? shelfWater * coastline : 0;
  const beachesShelves = clamp(Math.max(beachLand, beachWater), 0, 1);

  const peninsulaNoise = ridged(u * 2.4 - 0.18, v * 2.0 + 0.09, 7181);
  const island = islandArticulation(land.islands.seats);
  const bayCut = land.inlet;

  const peninsulasBaysIslands = clamp(
    coastline * smoothstep(0.42, 0.96, peninsulaNoise) +
      bayCut * 0.85 +
      island * 0.92,
    0,
    1
  );

  const elevation = isLand
    ? clamp(
        0.20 +
          field * 0.58 +
          mountainRanges * 0.74 -
          basinValleys * 0.36 +
          broad * 0.11,
        0,
        1
      )
    : 0;

  const mineralSeam = isLand
    ? clamp(
        smoothstep(0.84, 0.99, mineralNoise) *
          smoothstep(0.39, 0.98, seamNoise) *
          (0.34 + mountainRanges * 0.66),
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
    spiralRanges,
    basinValleys,
    primaryBasin,
    cliffsEscarpments,
    beachesShelves,
    peninsulasBaysIslands,
    elevation,
    mineralSeam,
    bayCut,
    broad,
    micro,
    ridgeNoise
  };
}

function sampleAudraliaTerrain(u, v) {
  const terrain = classifyAudraliaTerrain(u, v);

  return {
    contract: CONTRACT,
    receipt: RECEIPT,
    u,
    v,
    terrain,
    fingers: {
      mountainsRanges: terrain.mountainRanges,
      valleysBasins: terrain.basinValleys,
      cliffsEscarpments: terrain.cliffsEscarpments,
      beachesCoastalShelves: terrain.beachesShelves,
      peninsulasBaysIslandsInlets: terrain.peninsulasBaysIslands
    },
    specialForms: {
      primaryMountainRing: terrain.primaryRing,
      primaryCentralValley: terrain.primaryBasin,
      externalSpiralRanges: terrain.spiralRanges
    }
  };
}

function getAudraliaTerrainFingerStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    generation: "G2",
    authority: "terrain-five-finger-natural-readability",
    runtimeTouched: false,
    controlsTouched: false,
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
  document.documentElement.dataset.audraliaG2MaterialReadability = "true";
  document.documentElement.dataset.audraliaRuntimeTouched = "false";
  document.documentElement.dataset.audraliaControlsTouched = "false";
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
