// /assets/audralia/audralia.terrain.fingers.js
// AUDRALIA_G2_4_TERRAIN_FORMATION_DELTA_TNT_v1
// Full-file replacement.
// Expanded renewal, not redeploy.
// Real delta:
// - Adds formationField.
// - Adds continentalShoulder to reduce single-blob land read.
// - Adds shelfBreak and coastalTerrace.
// - Adds explicit ringCrest and basinFloor separation.
// - Adds secondarySpiralPressure field.
// - Adds bayWeb / inletWeb / islandSeparation articulation.
// - Runtime, controls, canvas, route, and HTML remain outside terrain authority.
// No GraphicBox. No generated image. No visual-pass claim.

const CONTRACT = "AUDRALIA_G2_4_TERRAIN_FORMATION_DELTA_TNT_v1";
const RECEIPT = "AUDRALIA_G2_4_TERRAIN_FORMATION_DELTA_RECEIPT";
const PREVIOUS_CONTRACT = "AUDRALIA_G2_3_TERRAIN_RELIEF_FIELD_AND_SHELF_ATTENUATION_TNT_v1";
const VERSION = "2026-05-09.audralia-g2-4-terrain-formation-delta";

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
  let amp = 0.58;
  let total = 0;
  let norm = 0;
  let scale = 6;

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
  for (let i = 0; i < values.length; i += 1) out = Math.max(out, values[i]);
  return out;
}

function primaryLand(u, v) {
  const core = ellipseMetrics(u, v, 0.515, 0.500, 0.215, 0.245, -0.20);
  const northwest = ellipseMetrics(u, v, 0.450, 0.420, 0.112, 0.136, -0.82);
  const southeast = ellipseMetrics(u, v, 0.602, 0.585, 0.118, 0.142, 0.44);
  const southern = ellipseMetrics(u, v, 0.478, 0.655, 0.074, 0.104, 0.12);
  const northeast = ellipseMetrics(u, v, 0.585, 0.402, 0.065, 0.088, 0.70);

  return {
    metrics: core,
    field: maxOf([core.field, northwest.field, southeast.field, southern.field, northeast.field]),
    parts: { core, northwest, southeast, southern, northeast }
  };
}

function secondaryLand(u, v) {
  const eastSpine = ellipseMetrics(u, v, 0.745, 0.575, 0.100, 0.295, 0.05);
  const southeast = ellipseMetrics(u, v, 0.800, 0.700, 0.062, 0.160, -0.32);
  const northeast = ellipseMetrics(u, v, 0.696, 0.440, 0.052, 0.106, 0.54);
  const innerBayShoulder = ellipseMetrics(u, v, 0.710, 0.610, 0.048, 0.084, -0.48);

  return {
    metrics: eastSpine,
    field: maxOf([eastSpine.field, southeast.field, northeast.field, innerBayShoulder.field]),
    parts: { eastSpine, southeast, northeast, innerBayShoulder }
  };
}

function islandChain(u, v) {
  const seats = [
    ellipseMetrics(u, v, 0.170, 0.680, 0.032, 0.058, -0.16),
    ellipseMetrics(u, v, 0.225, 0.718, 0.030, 0.050, 0.45),
    ellipseMetrics(u, v, 0.365, 0.250, 0.024, 0.018, 0.10),
    ellipseMetrics(u, v, 0.405, 0.230, 0.018, 0.013, -0.25),
    ellipseMetrics(u, v, 0.632, 0.760, 0.022, 0.038, 0.18)
  ];

  return {
    field: maxOf(seats.map((seat) => seat.field)),
    seats
  };
}

function bayAndInletCuts(u, v) {
  const cuts = [
    ellipseMetrics(u, v, 0.455, 0.552, 0.034, 0.070, -0.30),
    ellipseMetrics(u, v, 0.604, 0.470, 0.042, 0.066, 0.78),
    ellipseMetrics(u, v, 0.724, 0.535, 0.032, 0.078, 0.20),
    ellipseMetrics(u, v, 0.785, 0.650, 0.026, 0.070, -0.42),
    ellipseMetrics(u, v, 0.520, 0.355, 0.035, 0.044, 0.20),
    ellipseMetrics(u, v, 0.560, 0.625, 0.030, 0.050, 0.55)
  ].map((bay) => smoothstep(-0.24, 0.10, bay.field));

  return clamp(maxOf(cuts), 0, 1);
}

function audraliaLandField(u, v) {
  const primary = primaryLand(u, v);
  const secondary = secondaryLand(u, v);
  const islands = islandChain(u, v);

  const coastlineBreak = (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.106;
  const reliefBreak = (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.058;
  const inlet = bayAndInletCuts(u, v) * 0.046;

  return {
    primary,
    secondary,
    islands,
    inlet,
    field: maxOf([primary.field, secondary.field, islands.field]) + coastlineBreak + reliefBreak - inlet
  };
}

function ringCrest(metrics, landMask) {
  const ringDistance = Math.abs(metrics.dist - 0.585);
  const crown = Math.exp(-(ringDistance * ringDistance) / 0.0054);
  const stoneBreak = smoothstep(0.18, 0.96, ridged(metrics.x * 3.15 + 0.2, metrics.y * 2.70 - 0.1, 6001));
  const directionalLift = 0.84 + Math.sin(metrics.theta * 5.25 + 0.65) * 0.15;
  const brokenGate = 1 - smoothstep(0.72, 0.96, Math.sin(metrics.theta * 2.0 - 0.8) * 0.5 + 0.5) * 0.18;

  return clamp(crown * (0.70 + stoneBreak * 0.56) * directionalLift * brokenGate * landMask, 0, 1);
}

function basinFloor(metrics, landMask) {
  const bowl = Math.exp(-(metrics.dist * metrics.dist) / 0.064);
  const floorTexture = 1 - smoothstep(0.48, 0.96, ridged(metrics.x * 2.55, metrics.y * 2.45, 6009));
  return clamp(smoothstep(0.05, 0.70, bowl * floorTexture) * landMask, 0, 1);
}

function spiralRange(metrics, landMask, turns, pressure, phase) {
  const r = metrics.dist;
  const theta = metrics.theta;
  const wave = 0.5 + 0.5 * Math.sin(theta * turns + r * pressure + phase);
  const band = smoothstep(0.60, 0.987, wave);
  const radial = smoothstep(0.15, 0.40, r) * (1 - smoothstep(0.90, 1.16, r));
  const breakNoise = smoothstep(0.26, 0.96, ridged(metrics.x * 2.12, metrics.y * 1.96, 6047));

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

  const rawCoast = 1 - clamp(Math.abs(field) * 23.0, 0, 1);
  const coastline = smoothstep(0.0, 0.82, rawCoast);

  const shelfBase = smoothstep(-0.265, 0.016, field);
  const shelfBanding = smoothstep(0.22, 0.92, ridged(u * 1.58 + 0.12, v * 1.36 - 0.06, 9173));
  const shelfBreak = clamp(coastline * (0.18 + shelfBanding * 0.42), 0, 0.64);
  const coastalTerrace = clamp(coastline * smoothstep(0.35, 0.88, ridged(u * 2.2 - 0.07, v * 2.05 + 0.03, 9281)), 0, 1);
  const shelfAttenuation = clamp((0.38 + shelfBanding * 0.30) * coastline, 0, 0.70);

  const shelfWater = isLand ? 0 : clamp(shelfBase * shelfAttenuation, 0, 1);
  const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.80, 0, 1);

  const primaryMask = smoothstep(-0.05, 0.14, land.primary.field);
  const secondaryMask = smoothstep(-0.05, 0.14, land.secondary.field);
  const islandMask = smoothstep(-0.05, 0.14, land.islands.field);

  const ring = ringCrest(land.primary.metrics, primaryMask);
  const basin = basinFloor(land.primary.metrics, primaryMask);

  const secondarySpiralA = spiralRange(land.secondary.metrics, secondaryMask, 3.15, 8.5, 0.35);
  const secondarySpiralB = spiralRange(land.secondary.metrics, secondaryMask, 4.55, 10.1, 2.08);
  const secondarySpiralC = spiralRange(land.secondary.metrics, secondaryMask, 5.75, 11.8, 3.18);
  const secondarySpiralPressure = clamp(Math.max(secondarySpiralA, secondarySpiralB, secondarySpiralC), 0, 1);

  const broad = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridgeNoise = ridged(u + 0.021, v - 0.015, 1409);
  const fineRelief = ridged(u * 2.15 + 0.071, v * 2.05 - 0.033, 8101);
  const mineralNoise = noise(u + 0.42, v - 0.18, 72, 9207);
  const seamNoise = ridged(u * 1.7 + 0.03, v * 1.4 - 0.08, 6113);

  const continentalShoulder = clamp(primaryMask * smoothstep(0.14, 0.74, broad) * (1 - basin * 0.38), 0, 1);
  const inheritedRidge = ridgeNoise * 0.14 * landMask;
  const mountainRanges = isLand ? clamp(Math.max(ring, secondarySpiralPressure, inheritedRidge), 0, 1) : 0;

  const basinValleys = isLand
    ? clamp(
        Math.max(
          basin,
          (1 - mountainRanges) * smoothstep(0.08, 0.56, field) * (1 - ridgeNoise) * 0.46
        ),
        0,
        1
      )
    : 0;

  const cliffsEscarpments = isLand
    ? clamp(
        coastline * smoothstep(0.50, 0.96, ridgeNoise) * (1 - smoothstep(0.50, 0.92, basin)) +
          mountainRanges * coastline * 0.18 +
          shelfBreak * 0.14,
        0,
        1
      )
    : 0;

  const beachLand = isLand ? smoothstep(0.072, 0.0, Math.abs(field)) * coastline : 0;
  const beachWater = !isLand ? shelfWater * coastline * 0.46 : 0;
  const beachesShelves = clamp(Math.max(beachLand, beachWater, coastalTerrace * 0.26), 0, 1);

  const bayWeb = land.inlet;
  const peninsulaNoise = ridged(u * 2.22 - 0.18, v * 1.98 + 0.09, 7181);
  const islandSeparation = islandArticulation(land.islands.seats);
  const inletWeb = clamp(bayWeb * 0.72 + coastline * smoothstep(0.50, 0.96, peninsulaNoise), 0, 1);

  const peninsulasBaysIslands = clamp(
    inletWeb +
      islandSeparation * 0.92,
    0,
    1
  );

  const reliefField = clamp(
    mountainRanges * 0.54 +
      cliffsEscarpments * 0.34 +
      secondarySpiralPressure * 0.38 -
      basinValleys * 0.22 +
      fineRelief * landMask * 0.18 +
      continentalShoulder * 0.14,
    0,
    1
  );

  const formationField = clamp(
    continentalShoulder * 0.24 +
      reliefField * 0.34 +
      beachesShelves * 0.12 +
      peninsulasBaysIslands * 0.12 +
      (1 - deepOcean) * 0.08,
    0,
    1
  );

  const elevation = isLand
    ? clamp(
        0.17 +
          field * 0.54 +
          mountainRanges * 0.84 -
          basinValleys * 0.40 +
          broad * 0.08 +
          fineRelief * 0.11 +
          continentalShoulder * 0.08,
        0,
        1
      )
    : 0;

  const mineralSeam = isLand
    ? clamp(
        smoothstep(0.84, 0.99, mineralNoise) *
          smoothstep(0.40, 0.98, seamNoise) *
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
    shelfAttenuation,
    shelfBanding,
    shelfBreak,
    coastalTerrace,
    mountainRanges,
    primaryRing: ring,
    primaryBasin: basin,
    ringCrest: ring,
    basinFloor: basin,
    secondarySpiralPressure,
    spiralRanges: secondarySpiralPressure,
    basinValleys,
    cliffsEscarpments,
    beachesShelves,
    bayWeb,
    inletWeb,
    islandSeparation,
    peninsulasBaysIslands,
    elevation,
    reliefField,
    formationField,
    continentalShoulder,
    mineralSeam,
    broad,
    micro,
    ridgeNoise,
    fineRelief
  };
}

function sampleAudraliaTerrain(u, v) {
  const terrain = classifyAudraliaTerrain(u, v);

  return {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
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
      externalSpiralRanges: terrain.spiralRanges,
      reliefField: terrain.reliefField,
      formationField: terrain.formationField,
      shelfAttenuation: terrain.shelfAttenuation,
      shelfBreak: terrain.shelfBreak,
      coastalTerrace: terrain.coastalTerrace
    }
  };
}

function getAudraliaTerrainFingerStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    generation: "G2.4",
    authority: "terrain-formation-delta",
    runtimeTouched: false,
    controlsTouched: false,
    canvasTouched: false,
    routeTouched: false,
    htmlTouched: false,
    assetsAbsorbAuthority: false,
    fingers: [
      "mountains/ranges",
      "valleys/basins",
      "cliffs/escarpments",
      "beaches/coastal-shelves",
      "peninsulas/bays/islands/inlets"
    ],
    renewedDeltas: [
      "formation-field",
      "continental-shoulder",
      "shelf-break",
      "coastal-terrace",
      "ring-crest-basin-floor-separation",
      "secondary-spiral-pressure",
      "bay-web-inlet-web-island-separation"
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
    previousContract: PREVIOUS_CONTRACT,
    classify: classifyAudraliaTerrain,
    sample: sampleAudraliaTerrain,
    getStatus: getAudraliaTerrainFingerStatus
  });

  window.__AUDRALIA_TERRAIN_FINGERS_STATUS__ = AUDRALIA_TERRAIN_FINGERS_STATUS;

  document.documentElement.dataset.audraliaTerrainFingersLoaded = "true";
  document.documentElement.dataset.audraliaTerrainFingersContract = CONTRACT;
  document.documentElement.dataset.audraliaTerrainFingersReceipt = RECEIPT;
  document.documentElement.dataset.audraliaGeneration = "G2.4";
  document.documentElement.dataset.audraliaTerrainFiveFingers = "true";
  document.documentElement.dataset.audraliaFormationField = "true";
  document.documentElement.dataset.audraliaShelfBreak = "true";
  document.documentElement.dataset.audraliaCoastalTerrace = "true";
  document.documentElement.dataset.audraliaRuntimeTouched = "false";
  document.documentElement.dataset.audraliaControlsTouched = "false";
  document.documentElement.dataset.audraliaCanvasTouched = "false";
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
  previousContract: PREVIOUS_CONTRACT,
  classify: classifyAudraliaTerrain,
  sample: sampleAudraliaTerrain,
  getStatus: getAudraliaTerrainFingerStatus
});
