import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toNumber(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
}

function wrapLongitude(lonDeg) {
  let value = lonDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function normalizeLongitudeDelta(deltaDeg) {
  let value = deltaDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function buildCoordinateMaps(width, height) {
  const latStep = 180 / Math.max(1, height - 1);
  const lonStep = 360 / Math.max(1, width);

  return Object.freeze({
    latAt(y) {
      return 90 - y * latStep;
    },
    lonAt(x) {
      return wrapLongitude(-180 + x * lonStep);
    }
  });
}

function hashNoise(seed, a, b, c = 0) {
  const v = Math.sin((seed * 0.001) + (a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function sampleSignedNoise(seed, latDeg, lonDeg, scaleLat, scaleLon) {
  const a = latDeg / scaleLat;
  const b = lonDeg / scaleLon;
  const n = hashNoise(seed, a, b, 0);
  return (n * 2) - 1;
}

function getKernelContract() {
  const kernel = normalizeObject(WORLD_KERNEL);
  const planetField = normalizeObject(kernel.planetField);
  const constants = normalizeObject(kernel.constants);

  const width =
    Number.isInteger(planetField.width) ? planetField.width :
    Number.isInteger(constants.lonSteps) ? constants.lonSteps :
    216;

  const height =
    Number.isInteger(planetField.height) ? planetField.height :
    Number.isInteger(constants.latSteps) ? constants.latSteps :
    108;

  return Object.freeze({
    width,
    height,
    total: width * height,
    constants
  });
}

function buildAuthoredConstants(contract) {
  const kc = normalizeObject(contract.constants);

  return Object.freeze({
    width: contract.width,
    height: contract.height,
    totalSamples: contract.total,

    seaLevel: toNumber(kc.seaLevel, 0),
    landTarget: 0.56,
    waterTarget: 0.44,
    ratioTolerance: toNumber(kc.ratioTolerance, 0.01),

    contourSeedA: toNumber(kc.contourSeedA, 1109),
    contourSeedB: toNumber(kc.contourSeedB, 2713),
    contourSeedC: toNumber(kc.contourSeedC, 4079),
    contourAmplitude: 0.10,
    contourSigma: 0.08,
    macroThreshold: 0.10,
    finalLandThresholdDefault: 0.11,
    shorelineBandHalfWidth: toNumber(kc.shorelineBandHalfWidth, 0.018),

    equatorialMaxAbsLat: toNumber(kc.equatorialMaxAbsLat, 15),
    tropicalMaxAbsLat: toNumber(kc.tropicalMaxAbsLat, 30),
    temperateMaxAbsLat: toNumber(kc.temperateMaxAbsLat, 55),
    subpolarMaxAbsLat: toNumber(kc.subpolarMaxAbsLat, 70),
    polarMaxAbsLat: toNumber(kc.polarMaxAbsLat, 90),

    thermalBaseline: toNumber(kc.thermalBaseline, 0.64),
    thermalPolarCoolingStrength: toNumber(kc.thermalPolarCoolingStrength, 0.55),
    thermalWildernessDecayStrength: toNumber(kc.thermalWildernessDecayStrength, 0.65),

    magneticBaseline: toNumber(kc.magneticBaseline, 0.22),

    hydrologyRunoffStrength: toNumber(kc.hydrologyRunoffStrength, 0.52),
    hydrologyRiverThreshold: toNumber(kc.hydrologyRiverThreshold, 0.48),
    hydrologyLakeThreshold: toNumber(kc.hydrologyLakeThreshold, 0.50),

    topologyMountainThreshold: toNumber(kc.topologyMountainThreshold, 0.38),
    topologyBasinThreshold: toNumber(kc.topologyBasinThreshold, 0.26),
    topologyCanyonThreshold: toNumber(kc.topologyCanyonThreshold, 0.32),
    topologyCaveThreshold: toNumber(kc.topologyCaveThreshold, 0.50),

    seasonGlobalPhase: toNumber(kc.seasonGlobalPhase, 0.18),

    oceanDepths: Object.freeze({
      shelf: -0.04,
      slope: -0.10,
      abyss: -0.22,
      trench: -0.36,
      shelfWidthDeg: 4.5
    }),

    climateLabels: Object.freeze({
      EQUATORIAL: "EQUATORIAL",
      TROPICAL: "TROPICAL",
      TEMPERATE: "TEMPERATE",
      SUBPOLAR: "SUBPOLAR",
      POLAR: "POLAR"
    }),

    terrainClasses: Object.freeze({
      WATER: "WATER",
      SHELF: "SHELF",
      SHORELINE: "SHORELINE",
      BEACH: "BEACH",
      LOWLAND: "LOWLAND",
      FOOTHILL: "FOOTHILL",
      RIDGE: "RIDGE",
      PLATEAU: "PLATEAU",
      MOUNTAIN: "MOUNTAIN",
      SUMMIT: "SUMMIT",
      BASIN: "BASIN",
      CANYON: "CANYON",
      POLAR_ICE: "POLAR_ICE",
      GLACIAL_HIGHLAND: "GLACIAL_HIGHLAND"
    }),

    surfaceMaterials: Object.freeze({
      NONE: "NONE",
      BEDROCK: "BEDROCK",
      GRAVEL: "GRAVEL",
      SAND: "SAND",
      SILT: "SILT",
      CLAY: "CLAY",
      SOIL: "SOIL",
      ICE: "ICE",
      SNOW: "SNOW"
    }),

    biomeTypes: Object.freeze({
      NONE: "NONE",
      TROPICAL_RAINFOREST: "TROPICAL_RAINFOREST",
      TROPICAL_GRASSLAND: "TROPICAL_GRASSLAND",
      TEMPERATE_FOREST: "TEMPERATE_FOREST",
      TEMPERATE_GRASSLAND: "TEMPERATE_GRASSLAND",
      DESERT: "DESERT",
      TUNDRA: "TUNDRA",
      WETLAND: "WETLAND",
      BOREAL_FOREST: "BOREAL_FOREST",
      GLACIER: "GLACIER"
    }),

    seasonLabels: Object.freeze({
      WINTER: "WINTER",
      SPRING: "SPRING",
      SUMMER: "SUMMER",
      AUTUMN: "AUTUMN"
    }),

    groupedRegionGrowing: Object.freeze({
      RANGE_SEED: 0.52,
      RANGE_JOIN: 0.34,
      BACKBONE_MIN: 0.40,

      VALLEY_BASIN_MIN: 0.40,
      VALLEY_SLOPE_MAX: 0.16,
      VALLEY_JOIN_SLOPE_MAX: 0.22,
      CANYON_OVERRIDE: 0.42,

      CANYON_SEED: 0.34,
      CANYON_JOIN: 0.22,
      CANYON_SLOPE_MIN: 0.16,

      CREVICE_SEED: 0.58,
      CREVICE_JOIN: 0.42,
      CREVICE_SLOPE_MIN: 0.32,
      CREVICE_WIDTH_MAX: 2,

      BASIN_SEED: 0.10,
      BASIN_STRENGTH_SEED: 0.26,
      BASIN_JOIN: 0.18,

      PLATEAU_SEED: 0.56,
      PLATEAU_JOIN: 0.40,
      PLATEAU_SLOPE_MAX: 0.10,
      PLATEAU_JOIN_SLOPE_MAX: 0.16,
      PLATEAU_RELIEF_RADIUS: 3,
      PLATEAU_RELIEF_MIN: 0.26
    }),

    anchors: Object.freeze([
      Object.freeze({
        id: "HARBOR_CONTINENT",
        centerLatDeg: 10,
        centerLonDeg: -8,
        baseRadiusDeg: 32,
        anisotropyX: 1.30,
        anisotropyY: 1.06,
        rotationDeg: -12,
        dominanceWeight: 1.14,
        hemisphereBias: "N",
        thermalBias: 0.04,
        moistureBias: 0.08,
        upliftBias: 0.12
      }),
      Object.freeze({
        id: "GRATITUDE_CONTINENT",
        centerLatDeg: 26,
        centerLonDeg: 78,
        baseRadiusDeg: 26,
        anisotropyX: 1.16,
        anisotropyY: 0.98,
        rotationDeg: 18,
        dominanceWeight: 0.98,
        hemisphereBias: "N",
        thermalBias: 0.03,
        moistureBias: 0.10,
        upliftBias: 0.10
      }),
      Object.freeze({
        id: "GENEROSITY_CONTINENT",
        centerLatDeg: 22,
        centerLonDeg: -84,
        baseRadiusDeg: 26,
        anisotropyX: 1.10,
        anisotropyY: 0.98,
        rotationDeg: -18,
        dominanceWeight: 0.98,
        hemisphereBias: "N",
        thermalBias: 0.02,
        moistureBias: 0.08,
        upliftBias: 0.09
      }),
      Object.freeze({
        id: "DEPENDABILITY_CONTINENT",
        centerLatDeg: 50,
        centerLonDeg: 32,
        baseRadiusDeg: 24,
        anisotropyX: 1.04,
        anisotropyY: 1.28,
        rotationDeg: 12,
        dominanceWeight: 0.90,
        hemisphereBias: "N",
        thermalBias: -0.06,
        moistureBias: 0.02,
        upliftBias: 0.15
      }),
      Object.freeze({
        id: "ACCOUNTABILITY_CONTINENT",
        centerLatDeg: 42,
        centerLonDeg: 140,
        baseRadiusDeg: 23,
        anisotropyX: 1.10,
        anisotropyY: 1.16,
        rotationDeg: 30,
        dominanceWeight: 0.86,
        hemisphereBias: "N",
        thermalBias: -0.02,
        moistureBias: -0.03,
        upliftBias: 0.16
      }),
      Object.freeze({
        id: "HUMILITY_CONTINENT",
        centerLatDeg: -14,
        centerLonDeg: 108,
        baseRadiusDeg: 29,
        anisotropyX: 1.18,
        anisotropyY: 0.98,
        rotationDeg: -10,
        dominanceWeight: 0.96,
        hemisphereBias: "S",
        thermalBias: 0.05,
        moistureBias: 0.00,
        upliftBias: 0.13
      }),
      Object.freeze({
        id: "FORGIVENESS_CONTINENT",
        centerLatDeg: -20,
        centerLonDeg: -132,
        baseRadiusDeg: 28,
        anisotropyX: 1.12,
        anisotropyY: 0.98,
        rotationDeg: 14,
        dominanceWeight: 0.96,
        hemisphereBias: "S",
        thermalBias: 0.03,
        moistureBias: 0.06,
        upliftBias: 0.12
      }),
      Object.freeze({
        id: "SELF_CONTROL_CONTINENT",
        centerLatDeg: -46,
        centerLonDeg: 18,
        baseRadiusDeg: 25,
        anisotropyX: 1.24,
        anisotropyY: 0.90,
        rotationDeg: 8,
        dominanceWeight: 0.92,
        hemisphereBias: "S",
        thermalBias: -0.08,
        moistureBias: -0.06,
        upliftBias: 0.14
      }),
      Object.freeze({
        id: "PURITY_CONTINENT",
        centerLatDeg: 70,
        centerLonDeg: -34,
        baseRadiusDeg: 22,
        anisotropyX: 0.94,
        anisotropyY: 1.36,
        rotationDeg: 2,
        dominanceWeight: 0.82,
        hemisphereBias: "N",
        thermalBias: -0.14,
        moistureBias: -0.02,
        upliftBias: 0.18
      })
    ]),

    supercontinentAnchors: Object.freeze([
      Object.freeze({
        id: "C1_SUPERCONTINENT",
        centerLatDeg: 22,
        centerLonDeg: -12,
        baseRadiusDeg: 68,
        anisotropyX: 1.48,
        anisotropyY: 1.10,
        rotationDeg: -8,
        dominanceWeight: 1.18,
        regionIds: Object.freeze([
          "HARBOR_CONTINENT",
          "GRATITUDE_CONTINENT",
          "GENEROSITY_CONTINENT"
        ])
      }),
      Object.freeze({
        id: "C2_SUPERCONTINENT",
        centerLatDeg: 54,
        centerLonDeg: 52,
        baseRadiusDeg: 58,
        anisotropyX: 1.56,
        anisotropyY: 1.04,
        rotationDeg: 18,
        dominanceWeight: 1.04,
        regionIds: Object.freeze([
          "DEPENDABILITY_CONTINENT",
          "ACCOUNTABILITY_CONTINENT",
          "PURITY_CONTINENT"
        ])
      }),
      Object.freeze({
        id: "C3_SUPERCONTINENT",
        centerLatDeg: -28,
        centerLonDeg: 4,
        baseRadiusDeg: 64,
        anisotropyX: 1.72,
        anisotropyY: 1.00,
        rotationDeg: 4,
        dominanceWeight: 1.12,
        regionIds: Object.freeze([
          "HUMILITY_CONTINENT",
          "FORGIVENESS_CONTINENT",
          "SELF_CONTROL_CONTINENT"
        ])
      })
    ]),

    continentInfluenceExponent: 1.48,

    oceanCarves: Object.freeze([
      Object.freeze({ id: "PACIFIC_WEST_SPLIT", centerLatDeg: 12, centerLonDeg: -44, radiusDeg: 18, weight: 0.68 }),
      Object.freeze({ id: "PACIFIC_EAST_SPLIT", centerLatDeg: 18, centerLonDeg: 36, radiusDeg: 18, weight: 0.64 }),
      Object.freeze({ id: "NORTH_INTERIOR_SEA", centerLatDeg: 38, centerLonDeg: 106, radiusDeg: 15, weight: 0.60 }),
      Object.freeze({ id: "MID_ATLANTIC_GAP", centerLatDeg: 2, centerLonDeg: -108, radiusDeg: 17, weight: 0.62 }),
      Object.freeze({ id: "SOUTHERN_OCEAN_CORE", centerLatDeg: -38, centerLonDeg: -42, radiusDeg: 26, weight: 0.82 }),
      Object.freeze({ id: "SOUTHERN_INDIAN_GAP", centerLatDeg: -32, centerLonDeg: 84, radiusDeg: 19, weight: 0.66 }),
      Object.freeze({ id: "POLAR_SEA_WEST", centerLatDeg: 74, centerLonDeg: 36, radiusDeg: 12, weight: 0.52 }),
      Object.freeze({ id: "POLAR_SEA_EAST", centerLatDeg: 66, centerLonDeg: -98, radiusDeg: 12, weight: 0.52 }),
      Object.freeze({ id: "EQUATORIAL_OPEN_WATER", centerLatDeg: -2, centerLonDeg: 156, radiusDeg: 16, weight: 0.60 })
    ]),
    oceanCarveExponent: 2.10,

    separationCorridors: Object.freeze([
      Object.freeze({
        id: "HARBOR_TO_GRATITUDE_SPLIT",
        a: "HARBOR_CONTINENT",
        b: "GRATITUDE_CONTINENT",
        widthDeg: 8,
        weight: 0.18
      }),
      Object.freeze({
        id: "HARBOR_TO_GENEROSITY_SPLIT",
        a: "HARBOR_CONTINENT",
        b: "GENEROSITY_CONTINENT",
        widthDeg: 8,
        weight: 0.18
      }),
      Object.freeze({
        id: "GRATITUDE_TO_ACCOUNTABILITY_SPLIT",
        a: "GRATITUDE_CONTINENT",
        b: "ACCOUNTABILITY_CONTINENT",
        widthDeg: 7,
        weight: 0.16
      }),
      Object.freeze({
        id: "HUMILITY_TO_SELF_CONTROL_SPLIT",
        a: "HUMILITY_CONTINENT",
        b: "SELF_CONTROL_CONTINENT",
        widthDeg: 8,
        weight: 0.18
      }),
      Object.freeze({
        id: "FORGIVENESS_TO_SELF_CONTROL_SPLIT",
        a: "FORGIVENESS_CONTINENT",
        b: "SELF_CONTROL_CONTINENT",
        widthDeg: 8,
        weight: 0.16
      })
    ]),
    separationFalloffExponent: 1.82,

    summits: Object.freeze([
      Object.freeze({ id: "S1_HARBOR_SUMMIT", parentRegion: "HARBOR_CONTINENT", anchorLatDeg: 14, anchorLonDeg: -2, peakHeightNorm: 0.12, influenceRadiusDeg: 14, difficultyWeight: 0.18 }),
      Object.freeze({ id: "S2_GRATITUDE_SUMMIT", parentRegion: "GRATITUDE_CONTINENT", anchorLatDeg: 30, anchorLonDeg: 82, peakHeightNorm: 0.15, influenceRadiusDeg: 14, difficultyWeight: 0.26 }),
      Object.freeze({ id: "S3_GENEROSITY_SUMMIT", parentRegion: "GENEROSITY_CONTINENT", anchorLatDeg: 26, anchorLonDeg: -80, peakHeightNorm: 0.15, influenceRadiusDeg: 14, difficultyWeight: 0.30 }),
      Object.freeze({ id: "S4_DEPENDABILITY_SUMMIT", parentRegion: "DEPENDABILITY_CONTINENT", anchorLatDeg: 54, anchorLonDeg: 28, peakHeightNorm: 0.18, influenceRadiusDeg: 15, difficultyWeight: 0.40 }),
      Object.freeze({ id: "S5_ACCOUNTABILITY_SUMMIT", parentRegion: "ACCOUNTABILITY_CONTINENT", anchorLatDeg: 48, anchorLonDeg: 146, peakHeightNorm: 0.20, influenceRadiusDeg: 15, difficultyWeight: 0.50 }),
      Object.freeze({ id: "S6_HUMILITY_SUMMIT", parentRegion: "HUMILITY_CONTINENT", anchorLatDeg: -10, anchorLonDeg: 102, peakHeightNorm: 0.22, influenceRadiusDeg: 16, difficultyWeight: 0.60 }),
      Object.freeze({ id: "S7_FORGIVENESS_SUMMIT", parentRegion: "FORGIVENESS_CONTINENT", anchorLatDeg: -16, anchorLonDeg: -124, peakHeightNorm: 0.24, influenceRadiusDeg: 16, difficultyWeight: 0.72 }),
      Object.freeze({ id: "S8_SELF_CONTROL_SUMMIT", parentRegion: "SELF_CONTROL_CONTINENT", anchorLatDeg: -50, anchorLonDeg: 12, peakHeightNorm: 0.30, influenceRadiusDeg: 17, difficultyWeight: 0.86 }),
      Object.freeze({ id: "S9_PURITY_APEX", parentRegion: "PURITY_CONTINENT", anchorLatDeg: 74, anchorLonDeg: -30, peakHeightNorm: 0.40, influenceRadiusDeg: 18, difficultyWeight: 1.0 })
    ]),

    basins: Object.freeze([
      Object.freeze({ id: "B1_HARBOR_BASIN", parentRegion: "HARBOR_CONTINENT", centerLatDeg: 8, centerLonDeg: -10, basinDepthNorm: -0.06, influenceRadiusDeg: 13, recoveryPriority: 1 }),
      Object.freeze({ id: "B2_GRATITUDE_BASIN", parentRegion: "GRATITUDE_CONTINENT", centerLatDeg: 22, centerLonDeg: 74, basinDepthNorm: -0.06, influenceRadiusDeg: 12, recoveryPriority: 2 }),
      Object.freeze({ id: "B3_GENEROSITY_BASIN", parentRegion: "GENEROSITY_CONTINENT", centerLatDeg: 18, centerLonDeg: -88, basinDepthNorm: -0.06, influenceRadiusDeg: 12, recoveryPriority: 2 }),
      Object.freeze({ id: "B4_DEPENDABILITY_BASIN", parentRegion: "DEPENDABILITY_CONTINENT", centerLatDeg: 46, centerLonDeg: 36, basinDepthNorm: -0.07, influenceRadiusDeg: 13, recoveryPriority: 3 }),
      Object.freeze({ id: "B5_ACCOUNTABILITY_BASIN", parentRegion: "ACCOUNTABILITY_CONTINENT", centerLatDeg: 40, centerLonDeg: 136, basinDepthNorm: -0.07, influenceRadiusDeg: 11, recoveryPriority: 3 }),
      Object.freeze({ id: "B6_HUMILITY_BASIN", parentRegion: "HUMILITY_CONTINENT", centerLatDeg: -18, centerLonDeg: 112, basinDepthNorm: -0.07, influenceRadiusDeg: 13, recoveryPriority: 4 }),
      Object.freeze({ id: "B7_FORGIVENESS_BASIN", parentRegion: "FORGIVENESS_CONTINENT", centerLatDeg: -26, centerLonDeg: -138, basinDepthNorm: -0.08, influenceRadiusDeg: 13, recoveryPriority: 4 }),
      Object.freeze({ id: "B8_SELF_CONTROL_BASIN", parentRegion: "SELF_CONTROL_CONTINENT", centerLatDeg: -52, centerLonDeg: 24, basinDepthNorm: -0.08, influenceRadiusDeg: 14, recoveryPriority: 5 }),
      Object.freeze({ id: "B9_PURITY_BASIN", parentRegion: "PURITY_CONTINENT", centerLatDeg: 68, centerLonDeg: -40, basinDepthNorm: -0.05, influenceRadiusDeg: 10, recoveryPriority: 6 })
    ])
  });
}

function findAnchor(constants, id) {
  return constants.anchors.find((anchor) => anchor.id === id) ?? null;
}

function mapContinentClass(continentMass) {
  switch (continentMass) {
    case "HARBOR_CONTINENT":
    case "GRATITUDE_CONTINENT":
    case "GENEROSITY_CONTINENT":
      return "C1";
    case "DEPENDABILITY_CONTINENT":
    case "ACCOUNTABILITY_CONTINENT":
    case "PURITY_CONTINENT":
      return "C2";
    case "HUMILITY_CONTINENT":
    case "FORGIVENESS_CONTINENT":
    case "SELF_CONTROL_CONTINENT":
      return "C3";
    default:
      return "OCEAN";
  }
}

function rotatedLocalDegrees(latDeg, lonDeg, anchor) {
  const dLat = latDeg - anchor.centerLatDeg;
  const midLatRad = degToRad((latDeg + anchor.centerLatDeg) * 0.5);
  const dLon = normalizeLongitudeDelta(lonDeg - anchor.centerLonDeg) * Math.cos(midLatRad);
  const rot = degToRad(anchor.rotationDeg);
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);

  const xr = (dLon * cosR) + (dLat * sinR);
  const yr = (-dLon * sinR) + (dLat * cosR);

  return { xr, yr };
}

function continentInfluence(latDeg, lonDeg, anchor, exponent) {
  const { xr, yr } = rotatedLocalDegrees(latDeg, lonDeg, anchor);
  const dx = xr / Math.max(1e-9, anchor.baseRadiusDeg * anchor.anisotropyX);
  const dy = yr / Math.max(1e-9, anchor.baseRadiusDeg * anchor.anisotropyY);
  const d = Math.sqrt((dx * dx) + (dy * dy));
  if (d >= 1) return 0;
  return anchor.dominanceWeight * Math.max(0, 1 - Math.pow(d, exponent));
}

function radialInfluence(latDeg, lonDeg, node, exponent) {
  const dLat = latDeg - node.centerLatDeg;
  const midLatRad = degToRad((latDeg + node.centerLatDeg) * 0.5);
  const dLon = normalizeLongitudeDelta(lonDeg - node.centerLonDeg) * Math.cos(midLatRad);
  const d = Math.sqrt((dLat * dLat) + (dLon * dLon)) / Math.max(1e-9, node.radiusDeg);
  if (d >= 1) return 0;
  return node.weight * Math.max(0, 1 - Math.pow(d, exponent));
}

function radialFalloff(latDeg, lonDeg, anchorLatDeg, anchorLonDeg, radiusDeg, exponent = 1.75) {
  const midLatRad = degToRad((latDeg + anchorLatDeg) * 0.5);
  const dLon = normalizeLongitudeDelta(lonDeg - anchorLonDeg) * Math.cos(midLatRad);
  const dLat = latDeg - anchorLatDeg;
  const d = Math.sqrt((dLon * dLon) + (dLat * dLat)) / Math.max(1e-9, radiusDeg);
  if (d >= 1) return 0;
  return Math.max(0, 1 - Math.pow(d, exponent));
}

function corridorField(latDeg, lonDeg, a, b, corridorWidthDeg, exponent) {
  const midLatRad = degToRad((latDeg + a.centerLatDeg + b.centerLatDeg) / 3);
  const ax = normalizeLongitudeDelta(a.centerLonDeg) * Math.cos(midLatRad);
  const ay = a.centerLatDeg;
  const bx = normalizeLongitudeDelta(b.centerLonDeg) * Math.cos(midLatRad);
  const by = b.centerLatDeg;
  const px = normalizeLongitudeDelta(lonDeg) * Math.cos(midLatRad);
  const py = latDeg;

  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLen2 = Math.max(1e-9, (abx * abx) + (aby * aby));
  const t = clamp(((apx * abx) + (apy * aby)) / abLen2, 0, 1);

  const qx = ax + (abx * t);
  const qy = ay + (aby * t);
  const dx = px - qx;
  const dy = py - qy;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  const normalized = distance / Math.max(1e-9, corridorWidthDeg);

  if (normalized >= 1) return 0;
  return Math.max(0, 1 - Math.pow(normalized, exponent));
}

function createBaseSample(x, y, latDeg, lonDeg) {
  return {
    x,
    y,
    latDeg,
    lonDeg,
    visible: true,

    parentAddress: "ROOT",
    localAddress: `${x}:${y}`,
    seedSignature: "AUTHORED_NINE_SUMMITS_WORLD_v6_MACRO",
    nestedLatticeDepth: 1,

    landMask: 0,
    waterMask: 1,
    macroLandScore: 0,
    finalLandScore: 0,
    supercontinentCore: 0,
    supercontinentAffinity: "NONE",

    baseElevation: 0,
    elevation: 0,
    seaLevel: 0,
    waterDepth: 0,
    oceanDepthField: 0,
    terrainClass: "WATER",
    shoreline: false,
    shorelineBand: false,
    beachCandidate: false,
    continentMass: "NONE",
    macroRegion: "NONE",
    subRegion: "NONE",

    strongestSummitId: "NONE",
    strongestSummitScore: 0,
    strongestBasinId: "NONE",
    strongestBasinScore: 0,

    slope: 0,
    curvature: 0,
    ridgeStrength: 0,
    basinStrength: 0,
    divideStrength: 0,
    plateauStrength: 0,
    canyonStrength: 0,
    cavePotential: 0,

    continentClass: "OCEAN",
    macroWaterClass: "OCEAN",
    rangeId: null,
    backboneStrength: 0,
    valleyId: null,
    canyonId: null,
    creviceId: null,
    basinId: null,
    plateauId: null,
    plateauRole: "NONE",
    flowClass: "NONE",
    flowDirection: "NONE",

    temperature: 0,
    thermalGradient: 0,
    freezePotential: 0,
    meltPotential: 0,
    evaporationPressure: 0,
    climateBandField: "TEMPERATE",

    rainfall: 0,
    runoff: 0,
    basinAccumulation: 0,
    drainage: "none",
    riverCandidate: false,
    lakeCandidate: false,
    distanceToWater: -1,
    distanceToLand: -1,

    magneticIntensity: 0,
    shieldingGradient: 0,
    auroralPotential: 0,
    navigationBias: "N",
    navigationStability: 0,
    gravityConstraint: 1,

    materialType: "mixed",
    diamondDensity: 0,
    opalDensity: 0,
    graniteDensity: 0,
    marbleDensity: 0,
    metalDensity: 0,

    sedimentType: "mixed",
    sedimentLoad: 0,
    transportPotential: 0,
    depositionPotential: 0,

    surfaceMaterial: "NONE",
    biomeType: "NONE",

    stateCode: 0,
    stateAge: 0,

    hemisphereSeason: "NONE",
    seasonPhase: 0,
    continentality: 0,
    maritimeInfluence: 0,
    altitudeCooling: 0,
    rainShadowStrength: 0,
    seasonalTemperature: 0,
    seasonalMoisture: 0,
    seasonalBiomePhase: "NONE",

    eventFlags: []
  };
}

function stageBaseSampleGrid(constants) {
  const coordinates = buildCoordinateMaps(constants.width, constants.height);
  return Array.from({ length: constants.height }, (_, y) =>
    Array.from({ length: constants.width }, (_, x) => {
      const latDeg = coordinates.latAt(y);
      const lonDeg = coordinates.lonAt(x);
      return createBaseSample(x, y, latDeg, lonDeg);
    })
  );
}

function stageMacroContinentField(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const anchorScores = Object.create(null);
    let sumInfluence = 0;

    for (const anchor of constants.anchors) {
      const score = continentInfluence(
        sample.latDeg,
        sample.lonDeg,
        anchor,
        constants.continentInfluenceExponent
      );
      anchorScores[anchor.id] = score;
      sumInfluence += score;
    }

    let strongestSupercontinent = "NONE";
    let strongestSuperScore = 0;
    let supercontinentTotal = 0;

    for (const superAnchor of constants.supercontinentAnchors) {
      const score = continentInfluence(
        sample.latDeg,
        sample.lonDeg,
        superAnchor,
        Math.max(1.2, constants.continentInfluenceExponent - 0.18)
      );
      supercontinentTotal += score;
      if (score > strongestSuperScore) {
        strongestSuperScore = score;
        strongestSupercontinent = superAnchor.id;
      }
    }

    let oceanCarveTotal = 0;
    for (const carve of constants.oceanCarves) {
      oceanCarveTotal += radialInfluence(
        sample.latDeg,
        sample.lonDeg,
        carve,
        constants.oceanCarveExponent
      );
    }

    let corridorSeparation = 0;
    for (const corridor of constants.separationCorridors) {
      const a = findAnchor(constants, corridor.a);
      const b = findAnchor(constants, corridor.b);
      if (!a || !b) continue;
      corridorSeparation += corridor.weight * corridorField(
        sample.latDeg,
        sample.lonDeg,
        a,
        b,
        corridor.widthDeg,
        constants.separationFalloffExponent
      );
    }

    const n1 = sampleSignedNoise(constants.contourSeedA, sample.latDeg, sample.lonDeg, 9.5, 13.5);
    const n2 = sampleSignedNoise(constants.contourSeedB, sample.latDeg, sample.lonDeg, 18, 23);
    const n3 = sampleSignedNoise(constants.contourSeedC, sample.latDeg, sample.lonDeg, 36, 44);
    const contourNoise = (0.55 * n1) + (0.30 * n2) + (0.15 * n3);

    const macroRaw =
      sumInfluence * 0.92 +
      supercontinentTotal * 0.78 -
      oceanCarveTotal * 0.78 -
      corridorSeparation * 0.68;

    const macroLandScore = Math.max(0, macroRaw);
    const coastSensitivity = Math.exp(-Math.abs(macroLandScore - constants.macroThreshold) / constants.contourSigma);
    const contourContribution = constants.contourAmplitude * coastSensitivity * contourNoise;
    const finalLandScore =
      macroLandScore +
      contourContribution +
      strongestSuperScore * 0.16;

    return {
      ...sample,
      anchorScores,
      oceanCarveTotal,
      corridorSeparation,
      macroLandScore,
      finalLandScore,
      supercontinentCore: strongestSuperScore,
      supercontinentAffinity: strongestSupercontinent
    };
  }));
}

function stageLandWaterClassification(grid, constants) {
  let low = constants.finalLandThresholdDefault - 0.12;
  let high = constants.finalLandThresholdDefault + 0.12;
  let threshold = constants.finalLandThresholdDefault;

  for (let i = 0; i < 18; i += 1) {
    threshold = (low + high) * 0.5;
    let landCount = 0;

    for (const row of grid) {
      for (const sample of row) {
        if (sample.finalLandScore >= threshold) landCount += 1;
      }
    }

    const landFraction = landCount / constants.totalSamples;
    if (landFraction > constants.landTarget) {
      low = threshold;
    } else {
      high = threshold;
    }
  }

  return grid.map((row) => row.map((sample) => {
    const landMask = sample.finalLandScore >= threshold ? 1 : 0;
    const waterMask = 1 - landMask;
    return {
      ...sample,
      landMask,
      waterMask
    };
  }));
}

function stageContinentLabels(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask !== 1) {
      return {
        ...sample,
        continentMass: "NONE",
        macroRegion: "NONE",
        subRegion: "NONE",
        continentId: "NONE",
        continentClass: "OCEAN"
      };
    }

    const entries = Object.entries(sample.anchorScores || {});
    entries.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      const anchorA = findAnchor(constants, a[0]);
      const anchorB = findAnchor(constants, b[0]);
      if (anchorA && anchorB && anchorB.dominanceWeight !== anchorA.dominanceWeight) {
        return anchorB.dominanceWeight - anchorA.dominanceWeight;
      }
      return a[0].localeCompare(b[0]);
    });

    let bestRegion = entries[0]?.[0] ?? "HARBOR_CONTINENT";
    const bestClass = mapContinentClass(bestRegion);
    const superClass =
      sample.supercontinentAffinity === "C1_SUPERCONTINENT" ? "C1" :
      sample.supercontinentAffinity === "C2_SUPERCONTINENT" ? "C2" :
      sample.supercontinentAffinity === "C3_SUPERCONTINENT" ? "C3" :
      bestClass;

    if (superClass !== bestClass) {
      const compatible = entries.find(([id]) => mapContinentClass(id) === superClass);
      if (compatible) bestRegion = compatible[0];
    }

    return {
      ...sample,
      continentMass: bestRegion,
      macroRegion: bestRegion,
      subRegion: bestRegion,
      continentId: bestRegion,
      continentClass: superClass
    };
  }));
}

function stageSummitRealization(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask !== 1) {
      return {
        ...sample,
        baseElevation: constants.seaLevel,
        elevation: constants.seaLevel
      };
    }

    let summitElevation = 0;
    let strongestSummitId = "NONE";
    let strongestSummitScore = 0;

    for (const summit of constants.summits) {
      const influence = radialFalloff(
        sample.latDeg,
        sample.lonDeg,
        summit.anchorLatDeg,
        summit.anchorLonDeg,
        summit.influenceRadiusDeg,
        1.6
      );
      if (influence <= 0) continue;

      const parentBoost = summit.parentRegion === sample.continentMass ? 1.10 : 0.18;
      const contribution = summit.peakHeightNorm * influence * parentBoost;
      summitElevation += contribution;

      if (contribution > strongestSummitScore) {
        strongestSummitScore = contribution;
        strongestSummitId = summit.id;
      }
    }

    const ownAnchor = findAnchor(constants, sample.continentMass);
    const regionalPlate = ownAnchor ? ownAnchor.upliftBias : 0.08;
    const continentalPlate =
      0.08 +
      regionalPlate * 0.34 +
      sample.macroLandScore * 0.18 +
      Math.max(0, sample.finalLandScore - constants.finalLandThresholdDefault) * 0.18 +
      sample.supercontinentCore * 0.18;

    const r1 = sampleSignedNoise(constants.contourSeedA + 901, sample.latDeg, sample.lonDeg, 6.5, 8.5);
    const r2 = sampleSignedNoise(constants.contourSeedB + 1301, sample.latDeg, sample.lonDeg, 14, 17);
    const regionalRelief = clamp((0.014 * r1) + (0.022 * r2), -0.02, 0.03);

    const baseElevation = clamp(continentalPlate + summitElevation + regionalRelief, 0.02, 0.88);

    return {
      ...sample,
      strongestSummitId,
      strongestSummitScore,
      baseElevation,
      elevation: baseElevation
    };
  }));
}

function stageBasinRealization(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask !== 1) return sample;

    let basinPull = 0;
    let strongestBasinId = "NONE";
    let strongestBasinScore = 0;

    for (const basin of constants.basins) {
      const influence = radialFalloff(
        sample.latDeg,
        sample.lonDeg,
        basin.centerLatDeg,
        basin.centerLonDeg,
        basin.influenceRadiusDeg,
        1.75
      );
      if (influence <= 0) continue;

      const parentBoost = basin.parentRegion === sample.continentMass ? 1.10 : 0.18;
      const contribution = Math.abs(basin.basinDepthNorm) * influence * parentBoost;
      basinPull += contribution;

      if (contribution > strongestBasinScore) {
        strongestBasinScore = contribution;
        strongestBasinId = basin.id;
      }
    }

    const elevation = clamp(sample.elevation - basinPull, 0.01, 0.88);

    return {
      ...sample,
      strongestBasinId,
      strongestBasinScore,
      elevation
    };
  }));
}

function stageElevationRedistribution(grid) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask !== 1) return sample;

    const redistributed = clamp(
      sample.elevation * 0.68 +
      sample.macroLandScore * 0.16 +
      sample.supercontinentCore * 0.12 +
      sample.strongestSummitScore * 0.08 -
      sample.strongestBasinScore * 0.06,
      0.02,
      0.82
    );

    return {
      ...sample,
      baseElevation: redistributed,
      elevation: redistributed
    };
  }));
}

function stageOceanDepthRealization(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask === 1) {
      return {
        ...sample,
        waterDepth: 0,
        oceanDepthField: 0,
        seaLevel: constants.seaLevel
      };
    }

    const oceanBase = clamp(
      toNumber(sample.oceanCarveTotal, 0) + toNumber(sample.corridorSeparation, 0) * 0.58,
      0,
      1.35
    );

    let oceanDepth = constants.oceanDepths.shelf;

    if (oceanBase > 0.98) oceanDepth = constants.oceanDepths.trench;
    else if (oceanBase > 0.70) oceanDepth = constants.oceanDepths.abyss;
    else if (oceanBase > 0.42) oceanDepth = constants.oceanDepths.slope;
    else oceanDepth = constants.oceanDepths.shelf;

    return {
      ...sample,
      baseElevation: oceanDepth,
      elevation: oceanDepth,
      seaLevel: constants.seaLevel,
      waterDepth: Math.abs(oceanDepth),
      oceanDepthField: oceanDepth
    };
  }));
}

function stageClimateBands(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg);
    let climateBandField = constants.climateLabels.POLAR;

    if (absLat < constants.equatorialMaxAbsLat) climateBandField = constants.climateLabels.EQUATORIAL;
    else if (absLat < constants.tropicalMaxAbsLat) climateBandField = constants.climateLabels.TROPICAL;
    else if (absLat < constants.temperateMaxAbsLat) climateBandField = constants.climateLabels.TEMPERATE;
    else if (absLat < constants.subpolarMaxAbsLat) climateBandField = constants.climateLabels.SUBPOLAR;

    return {
      ...sample,
      climateBandField
    };
  }));
}

function getElevation(grid, x, y) {
  return grid[y]?.[x]?.elevation ?? 0;
}

function getWrappedX(x, width) {
  if (x < 0) return width - 1;
  if (x >= width) return 0;
  return x;
}

function getGridCell(grid, x, y) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  if (y < 0 || y >= height || width <= 0) return null;
  return grid[y]?.[getWrappedX(x, width)] ?? null;
}

function getNeighborCoords4(x, y, width, height) {
  const coords = [];
  if (y - 1 >= 0) coords.push([x, y - 1]);
  coords.push([getWrappedX(x + 1, width), y]);
  if (y + 1 < height) coords.push([x, y + 1]);
  coords.push([getWrappedX(x - 1, width), y]);
  return coords;
}

function computeDistanceFields(grid) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const distanceToWater = Array.from({ length: height }, () => Array.from({ length: width }, () => Infinity));
  const distanceToLand = Array.from({ length: height }, () => Array.from({ length: width }, () => Infinity));
  const waterQueue = [];
  const landQueue = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x].waterMask === 1) {
        distanceToWater[y][x] = 0;
        waterQueue.push([x, y]);
      }
      if (grid[y][x].landMask === 1) {
        distanceToLand[y][x] = 0;
        landQueue.push([x, y]);
      }
    }
  }

  function bfs(queue, dist) {
    let head = 0;
    while (head < queue.length) {
      const [x, y] = queue[head];
      head += 1;
      const current = dist[y][x];

      const nextCoords = getNeighborCoords4(x, y, width, height);
      for (let i = 0; i < nextCoords.length; i += 1) {
        const nx = nextCoords[i][0];
        const ny = nextCoords[i][1];
        if (dist[ny][nx] <= current + 1) continue;
        dist[ny][nx] = current + 1;
        queue.push([nx, ny]);
      }
    }
  }

  bfs(waterQueue, distanceToWater);
  bfs(landQueue, distanceToLand);

  return { distanceToWater, distanceToLand };
}

function stageTopologyFields(grid, constants) {
  const distanceFields = computeDistanceFields(grid);

  return grid.map((row, y) => row.map((sample, x) => {
    const left = getElevation(grid, getWrappedX(x - 1, grid[0].length), y);
    const right = getElevation(grid, getWrappedX(x + 1, grid[0].length), y);
    const up = getElevation(grid, x, Math.max(0, y - 1));
    const down = getElevation(grid, x, Math.min(grid.length - 1, y + 1));

    const dx = right - left;
    const dy = down - up;
    const slope = clamp(Math.sqrt((dx * dx) + (dy * dy)) * 2.1, 0, 1);

    const meanNeighbor = (left + right + up + down) / 4;
    const curvatureRaw = sample.elevation - meanNeighbor;
    const curvature = clamp(curvatureRaw * 3.5, -1, 1);

    const ridgeStrength = clamp(curvature > 0 ? curvature : 0, 0, 1);
    const basinStrength = clamp(curvature < 0 ? -curvature : 0, 0, 1);
    const divideStrength = clamp(Math.abs(dx - dy) * 2.0, 0, 1);
    const plateauStrength = clamp(sample.elevation > 0.16 ? 1 - slope : 0, 0, 1);
    const canyonStrength = clamp(slope > 0.18 ? basinStrength * slope * 1.28 : 0, 0, 1);
    const cavePotential = clamp(
      basinStrength * 0.42 + plateauStrength * 0.12 + canyonStrength * 0.24,
      0,
      1
    );

    const distWater = distanceFields.distanceToWater[y][x];
    const distLand = distanceFields.distanceToLand[y][x];
    const shoreline = sample.landMask === 1 && distWater <= 1;
    const shorelineBand = distWater <= 2 || distLand <= 2;
    const beachCandidate =
      sample.landMask === 1 &&
      shorelineBand &&
      slope < 0.11 &&
      sample.elevation <= (constants.seaLevel + constants.shorelineBandHalfWidth * 6.4) &&
      basinStrength < 0.24;

    return {
      ...sample,
      shoreline,
      shorelineBand,
      beachCandidate,
      slope,
      curvature,
      ridgeStrength,
      basinStrength,
      divideStrength,
      plateauStrength,
      canyonStrength,
      cavePotential,
      distanceToWater: Number.isFinite(distWater) ? distWater : -1,
      distanceToLand: Number.isFinite(distLand) ? distLand : -1
    };
  }));
}

function dominantDirectionFromGradient(dx, dy) {
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return "NONE";
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);

  if (ax > ay * 1.5) return dx > 0 ? "E" : "W";
  if (ay > ax * 1.5) return dy > 0 ? "S" : "N";

  if (dx > 0 && dy > 0) return "SE";
  if (dx > 0 && dy < 0) return "NE";
  if (dx < 0 && dy > 0) return "SW";
  if (dx < 0 && dy < 0) return "NW";
  return "NONE";
}

function localGradient(grid, x, y) {
  const c = getGridCell(grid, x, y);
  const w = getGridCell(grid, x - 1, y);
  const e = getGridCell(grid, x + 1, y);
  const n = getGridCell(grid, x, y - 1);
  const s = getGridCell(grid, x, y + 1);

  const cx = c ? c.elevation : 0;
  const dx = ((e ? e.elevation : cx) - (w ? w.elevation : cx)) * 0.5;
  const dy = ((s ? s.elevation : cx) - (n ? n.elevation : cx)) * 0.5;

  return { dx, dy, magnitude: Math.sqrt((dx * dx) + (dy * dy)) };
}

function localWidthProxy(grid, x, y, predicate) {
  const width = grid[0]?.length ?? 0;
  const height = grid.length;
  let count = 0;
  const neighbors = getNeighborCoords4(x, y, width, height);
  for (let i = 0; i < neighbors.length; i += 1) {
    const nx = neighbors[i][0];
    const ny = neighbors[i][1];
    const sample = grid[ny][nx];
    if (predicate(sample, nx, ny)) count += 1;
  }
  return count;
}

function hasNearbyStrongerRelief(grid, x, y, radius, minRelief) {
  const center = getGridCell(grid, x, y);
  if (!center) return false;

  for (let dy = -radius; dy <= radius; dy += 1) {
    const ny = y + dy;
    if (ny < 0 || ny >= grid.length) continue;

    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = getWrappedX(x + dx, grid[0].length);
      const candidate = grid[ny][nx];
      if (!candidate || candidate.landMask !== 1) continue;

      const relief =
        Math.max(
          candidate.ridgeStrength,
          candidate.canyonStrength,
          candidate.slope,
          Math.max(candidate.elevation - center.elevation, 0)
        );

      if (relief >= minRelief) return true;
    }
  }

  return false;
}

function cloneGridForTopologyCoordination(grid) {
  return grid.map((row) => row.map((sample) => ({
    ...sample,
    continentClass: sample.waterMask === 1 ? "OCEAN" : mapContinentClass(sample.continentMass),
    macroWaterClass: sample.waterMask === 1
      ? (sample.distanceToLand >= 7 ? "OCEAN" : "SEA")
      : "LAND",
    rangeId: null,
    backboneStrength: 0,
    valleyId: null,
    canyonId: null,
    creviceId: null,
    basinId: null,
    plateauId: null,
    plateauRole: "NONE",
    flowClass: "NONE",
    flowDirection: "NONE"
  })));
}

function createRegionDiagnostics() {
  return {
    seedCount: 0,
    groupedRegionCount: 0,
    largestRegionSize: 0,
    isolatedFallbackCount: 0,
    seamMergeCount: 0
  };
}

function growGroupedRegions(grid, options) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const assigned = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  const diagnostics = createRegionDiagnostics();
  let nextId = 1;

  function regionKey(x, y) {
    return `${x}:${y}`;
  }

  function countSeamEdges(cells) {
    let seamEdges = 0;
    const set = new Set(cells.map(([x, y]) => regionKey(x, y)));
    for (let i = 0; i < cells.length; i += 1) {
      const x = cells[i][0];
      const y = cells[i][1];
      if (set.has(regionKey(getWrappedX(x + 1, width), y)) && x === width - 1) seamEdges += 1;
      if (set.has(regionKey(getWrappedX(x - 1, width), y)) && x === 0) seamEdges += 1;
    }
    return seamEdges;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (assigned[y][x]) continue;

      const seedSample = grid[y][x];
      if (!options.seedPredicate(seedSample, x, y, grid)) continue;

      diagnostics.seedCount += 1;

      const queue = [[x, y]];
      const region = [];
      assigned[y][x] = true;

      while (queue.length) {
        const [cx, cy] = queue.shift();
        region.push([cx, cy]);

        const neighbors = getNeighborCoords4(cx, cy, width, height);
        for (let i = 0; i < neighbors.length; i += 1) {
          const nx = neighbors[i][0];
          const ny = neighbors[i][1];
          if (assigned[ny][nx]) continue;

          const candidate = grid[ny][nx];
          if (!options.joinPredicate(candidate, nx, ny, grid, seedSample, cx, cy)) continue;

          assigned[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }

      if (region.length < 2) {
        const only = region[0];
        const onlySample = grid[only[1]][only[0]];
        if (options.allowSingleFallback && options.allowSingleFallback(onlySample, only[0], only[1], grid)) {
          const fallbackId = nextId++;
          diagnostics.groupedRegionCount += 1;
          diagnostics.isolatedFallbackCount += 1;
          diagnostics.largestRegionSize = Math.max(diagnostics.largestRegionSize, 1);
          options.assignRegion([[only[0], only[1]]], fallbackId, grid);
        } else {
          assigned[only[1]][only[0]] = false;
        }
        continue;
      }

      const regionId = nextId++;
      diagnostics.groupedRegionCount += 1;
      diagnostics.largestRegionSize = Math.max(diagnostics.largestRegionSize, region.length);
      diagnostics.seamMergeCount += countSeamEdges(region);
      options.assignRegion(region, regionId, grid);
    }
  }

  return diagnostics;
}

function stageLandTopologyCoordination(grid, constants) {
  const G = constants.groupedRegionGrowing;
  const working = cloneGridForTopologyCoordination(grid);
  const height = working.length;
  const width = working[0]?.length ?? 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = working[y][x];
      if (sample.waterMask === 1) {
        sample.continentClass = "OCEAN";
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = working[y][x];
      if (sample.landMask !== 1) continue;

      const summitBoost = clamp(sample.strongestSummitScore * 0.54, 0, 0.22);
      const elevationBoost = clamp(Math.max(sample.elevation - 0.22, 0) * 0.18, 0, 0.14);
      const superBoost = clamp(sample.supercontinentCore * 0.16, 0, 0.16);
      sample.backboneStrength = clamp(sample.ridgeStrength + summitBoost + elevationBoost + superBoost, 0, 1);
    }
  }

  const diagnostics = {
    range: createRegionDiagnostics(),
    valley: createRegionDiagnostics(),
    canyon: createRegionDiagnostics(),
    crevice: createRegionDiagnostics(),
    basin: createRegionDiagnostics(),
    plateau: createRegionDiagnostics()
  };

  diagnostics.range = growGroupedRegions(working, {
    seedPredicate(sample) {
      return (
        sample.landMask === 1 &&
        sample.ridgeStrength >= G.RANGE_SEED &&
        sample.backboneStrength >= G.BACKBONE_MIN
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample) {
      if (candidate.landMask !== 1) return false;
      if (candidate.ridgeStrength < G.RANGE_JOIN) return false;
      if (candidate.backboneStrength < G.RANGE_JOIN) return false;
      if (candidate.continentClass !== seedSample.continentClass) return false;
      const elevationDelta = Math.abs(candidate.elevation - seedSample.elevation);
      return elevationDelta <= 0.24;
    },
    allowSingleFallback(sample) {
      return sample.backboneStrength >= 0.82 && sample.ridgeStrength >= 0.68;
    },
    assignRegion(region, regionId, gridRef) {
      const regionSize = region.length;
      const sizeBoost = clamp(regionSize / 60, 0, 0.12);
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.rangeId = regionId;
        sample.backboneStrength = clamp(sample.backboneStrength + sizeBoost, 0, 1);
        sample.ridgeStrength = clamp(sample.ridgeStrength + sizeBoost * 0.42, 0, 1);
      }
    }
  });

  diagnostics.basin = growGroupedRegions(working, {
    seedPredicate(sample) {
      return (
        sample.landMask === 1 &&
        (
          sample.strongestBasinScore >= G.BASIN_SEED ||
          sample.basinStrength >= G.BASIN_STRENGTH_SEED
        )
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample) {
      if (candidate.landMask !== 1) return false;
      if (candidate.continentClass !== seedSample.continentClass) return false;

      const sameFamily =
        seedSample.strongestBasinId !== "NONE" &&
        candidate.strongestBasinId === seedSample.strongestBasinId;

      if (sameFamily) return true;
      if (candidate.basinStrength < G.BASIN_JOIN) return false;
      if (candidate.elevation > seedSample.elevation + 0.16) return false;
      return candidate.slope <= 0.22;
    },
    allowSingleFallback(sample) {
      return sample.strongestBasinScore >= 0.20 || sample.basinStrength >= 0.42;
    },
    assignRegion(region, regionId, gridRef) {
      const regionSize = region.length;
      const sizeBoost = clamp(regionSize / 64, 0, 0.12);
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.basinId = regionId;
        sample.basinStrength = clamp(sample.basinStrength + sizeBoost * 0.46, 0, 1);
      }
    }
  });

  diagnostics.crevice = growGroupedRegions(working, {
    seedPredicate(sample, x, y, gridRef) {
      const widthProxy = localWidthProxy(gridRef, x, y, (s) => s && s.landMask === 1 && s.canyonStrength >= G.CREVICE_JOIN);
      return (
        sample.landMask === 1 &&
        sample.canyonStrength >= G.CREVICE_SEED &&
        sample.slope >= G.CREVICE_SLOPE_MIN &&
        widthProxy <= G.CREVICE_WIDTH_MAX
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample) {
      if (candidate.landMask !== 1) return false;
      if (candidate.canyonStrength < G.CREVICE_JOIN) return false;
      if (candidate.slope < G.CREVICE_SLOPE_MIN * 0.85) return false;
      const widthProxy = localWidthProxy(gridRef, nx, ny, (s) => s && s.landMask === 1 && s.canyonStrength >= G.CREVICE_JOIN);
      if (widthProxy > G.CREVICE_WIDTH_MAX) return false;
      const gradient = localGradient(gridRef, nx, ny);
      const direction = dominantDirectionFromGradient(-gradient.dx, -gradient.dy);
      const seedGradient = localGradient(gridRef, seedSample.x, seedSample.y);
      const seedDirection = dominantDirectionFromGradient(-seedGradient.dx, -seedGradient.dy);
      return direction === seedDirection || direction === "NONE" || seedDirection === "NONE";
    },
    allowSingleFallback(sample, x, y, gridRef) {
      const widthProxy = localWidthProxy(gridRef, x, y, (s) => s && s.landMask === 1 && s.canyonStrength >= G.CREVICE_JOIN);
      return (
        sample.canyonStrength >= 0.76 &&
        sample.slope >= 0.42 &&
        widthProxy <= 1
      );
    },
    assignRegion(region, regionId, gridRef) {
      const sizeBoost = clamp(region.length / 44, 0, 0.14);
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.creviceId = regionId;
        sample.canyonStrength = clamp(sample.canyonStrength + 0.16 + sizeBoost, 0, 1);
      }
    }
  });

  diagnostics.canyon = growGroupedRegions(working, {
    seedPredicate(sample) {
      return (
        sample.landMask === 1 &&
        sample.creviceId == null &&
        sample.canyonStrength >= G.CANYON_SEED &&
        sample.slope >= G.CANYON_SLOPE_MIN
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample) {
      if (candidate.landMask !== 1) return false;
      if (candidate.creviceId != null) return false;
      if (candidate.canyonStrength < G.CANYON_JOIN) return false;
      if (candidate.slope < G.CANYON_SLOPE_MIN * 0.85) return false;
      const candidateGradient = localGradient(gridRef, nx, ny);
      const seedGradient = localGradient(gridRef, seedSample.x, seedSample.y);
      const candidateDir = dominantDirectionFromGradient(-candidateGradient.dx, -candidateGradient.dy);
      const seedDir = dominantDirectionFromGradient(-seedGradient.dx, -seedGradient.dy);
      return candidateDir === seedDir || candidateDir === "NONE" || seedDir === "NONE";
    },
    allowSingleFallback(sample) {
      return sample.canyonStrength >= 0.68 && sample.slope >= 0.32;
    },
    assignRegion(region, regionId, gridRef) {
      const sizeBoost = clamp(region.length / 52, 0, 0.10);
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.canyonId = regionId;
        sample.canyonStrength = clamp(sample.canyonStrength + 0.09 + sizeBoost, 0, 1);
      }
    }
  });

  diagnostics.valley = growGroupedRegions(working, {
    seedPredicate(sample) {
      return (
        sample.landMask === 1 &&
        sample.creviceId == null &&
        sample.canyonId == null &&
        sample.basinStrength >= G.VALLEY_BASIN_MIN &&
        sample.slope <= G.VALLEY_SLOPE_MAX &&
        sample.canyonStrength < G.CANYON_OVERRIDE
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample, cx, cy) {
      if (candidate.landMask !== 1) return false;
      if (candidate.creviceId != null || candidate.canyonId != null) return false;
      if (candidate.slope > G.VALLEY_JOIN_SLOPE_MAX) return false;
      if (candidate.basinStrength < G.BASIN_JOIN && candidate.distanceToWater > 5) return false;

      const current = gridRef[cy][cx];
      const basinLinked =
        current.basinId != null &&
        candidate.basinId != null &&
        current.basinId === candidate.basinId;

      const gradient = localGradient(gridRef, nx, ny);
      const downhillDir = dominantDirectionFromGradient(-gradient.dx, -gradient.dy);
      const flowLinked = downhillDir !== "NONE";

      return basinLinked || flowLinked;
    },
    allowSingleFallback(sample) {
      return sample.basinStrength >= 0.64 && sample.slope <= 0.08;
    },
    assignRegion(region, regionId, gridRef) {
      const sizeBoost = clamp(region.length / 72, 0, 0.08);
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.valleyId = regionId;
        sample.basinStrength = clamp(sample.basinStrength + 0.07 + sizeBoost, 0, 1);
      }
    }
  });

  diagnostics.plateau = growGroupedRegions(working, {
    seedPredicate(sample, x, y, gridRef) {
      return (
        sample.landMask === 1 &&
        sample.plateauStrength >= G.PLATEAU_SEED &&
        sample.slope <= G.PLATEAU_SLOPE_MAX &&
        sample.creviceId == null &&
        sample.canyonId == null &&
        hasNearbyStrongerRelief(gridRef, x, y, G.PLATEAU_RELIEF_RADIUS, G.PLATEAU_RELIEF_MIN)
      );
    },
    joinPredicate(candidate, nx, ny, gridRef, seedSample) {
      if (candidate.landMask !== 1) return false;
      if (candidate.creviceId != null || candidate.canyonId != null) return false;
      if (candidate.plateauStrength < G.PLATEAU_JOIN) return false;
      if (candidate.slope > G.PLATEAU_JOIN_SLOPE_MAX) return false;
      if (!hasNearbyStrongerRelief(gridRef, nx, ny, G.PLATEAU_RELIEF_RADIUS, G.PLATEAU_RELIEF_MIN)) return false;
      if (candidate.continentClass !== seedSample.continentClass) return false;
      return Math.abs(candidate.elevation - seedSample.elevation) <= 0.16;
    },
    allowSingleFallback() {
      return false;
    },
    assignRegion(region, regionId, gridRef) {
      for (let i = 0; i < region.length; i += 1) {
        const x = region[i][0];
        const y = region[i][1];
        const sample = gridRef[y][x];
        sample.plateauId = regionId;
      }
    }
  });

  const plateauMembers = new Map();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = working[y][x];
      if (sample.plateauId == null) continue;
      if (!plateauMembers.has(sample.plateauId)) plateauMembers.set(sample.plateauId, []);
      plateauMembers.get(sample.plateauId).push([x, y]);
    }
  }

  for (const [plateauId, cells] of plateauMembers.entries()) {
    for (let i = 0; i < cells.length; i += 1) {
      const x = cells[i][0];
      const y = cells[i][1];
      const sample = working[y][x];
      const neighbors = getNeighborCoords4(x, y, width, height);

      let edgeExposure = 0;
      let strongerReliefAdjacency = 0;
      let plateauAdjacency = 0;

      for (let n = 0; n < neighbors.length; n += 1) {
        const nx = neighbors[n][0];
        const ny = neighbors[n][1];
        const neighbor = working[ny][nx];

        if (neighbor.plateauId === plateauId) {
          plateauAdjacency += 1;
        } else {
          edgeExposure += 1;
          if (
            neighbor.landMask === 1 &&
            (
              neighbor.ridgeStrength > sample.ridgeStrength + 0.08 ||
              neighbor.canyonStrength > sample.canyonStrength + 0.08 ||
              neighbor.slope > sample.slope + 0.08
            )
          ) {
            strongerReliefAdjacency += 1;
          }
        }
      }

      if (edgeExposure === 0 && sample.plateauStrength >= 0.70 && sample.slope <= 0.08) {
        sample.plateauRole = "CORE";
      } else if (edgeExposure > 0 && strongerReliefAdjacency > 0) {
        sample.plateauRole = "EDGE";
      } else if (sample.slope > 0.10 || sample.plateauStrength < 0.56) {
        sample.plateauRole = "SLOPE";
      } else if (plateauAdjacency >= 2) {
        sample.plateauRole = "OUTER";
      } else {
        sample.plateauRole = "NONE";
      }

      sample.plateauStrength = clamp(
        sample.plateauStrength +
        (sample.plateauRole === "CORE" ? 0.12 : sample.plateauRole === "EDGE" ? 0.07 : 0.03),
        0,
        1
      );
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = working[y][x];
      const gradient = localGradient(working, x, y);
      const downhillDirection = dominantDirectionFromGradient(-gradient.dx, -gradient.dy);

      if (sample.waterMask === 1) {
        sample.flowClass = sample.macroWaterClass === "SEA" ? "SEA" : "OCEAN";
        sample.flowDirection = "NONE";
        continue;
      }

      if (sample.basinId != null && sample.slope <= 0.10 && sample.basinStrength >= 0.50) {
        sample.flowClass = "LAKE";
        sample.flowDirection = downhillDirection;
      } else if (sample.creviceId != null || sample.canyonId != null) {
        sample.flowClass = "RIVER";
        sample.flowDirection = downhillDirection;
      } else if (sample.valleyId != null && sample.slope >= 0.04) {
        sample.flowClass = "STREAM";
        sample.flowDirection = downhillDirection;
      } else {
        sample.flowClass = "NONE";
        sample.flowDirection = downhillDirection;
      }
    }
  }

  return Object.freeze({
    grid: working,
    diagnostics: Object.freeze(diagnostics)
  });
}

function stageThermodynamics(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg) / 90;
    const ownAnchor = findAnchor(constants, sample.continentMass);
    const polarCooling = Math.pow(absLat, 1.35) * constants.thermalPolarCoolingStrength;
    const elevationCooling = clamp(Math.max(0, sample.elevation - constants.seaLevel) * 0.38, 0, 0.34);
    const basinModeration = clamp(toNumber(sample.strongestBasinScore, 0) * 0.18, 0, 0.14);
    const shorelineModeration = sample.shoreline ? 0.08 : 0;
    const summitExposure = clamp(toNumber(sample.strongestSummitScore, 0) * 0.16, 0, 0.14);
    const regionThermalBias = ownAnchor ? ownAnchor.thermalBias : 0;
    const continentalityHeat = clamp(Math.max(sample.distanceToWater - 6, 0) / 24, 0, 0.16);

    const temperature = clamp(
      constants.thermalBaseline +
      regionThermalBias +
      basinModeration +
      shorelineModeration +
      continentalityHeat -
      polarCooling -
      elevationCooling -
      summitExposure,
      0,
      1
    );

    const thermalGradient = clamp(
      polarCooling + elevationCooling + sample.slope * 0.18 + summitExposure,
      0,
      1
    );

    const freezePotential = clamp((0.42 - temperature) / 0.42, 0, 1);
    const meltPotential = clamp((temperature - 0.38) / 0.42, 0, 1);
    const evaporationPressure = clamp(
      (temperature - 0.28) / 0.52 + (sample.waterMask === 1 ? 0.12 : 0),
      0,
      1
    );

    return {
      ...sample,
      temperature,
      thermalGradient,
      freezePotential,
      meltPotential,
      evaporationPressure,
      altitudeCooling: elevationCooling
    };
  }));
}

function determineDrainage(sample, left, right, up, down) {
  const targets = [
    { key: "west", value: left?.elevation ?? sample.elevation },
    { key: "east", value: right?.elevation ?? sample.elevation },
    { key: "north", value: up?.elevation ?? sample.elevation },
    { key: "south", value: down?.elevation ?? sample.elevation }
  ];

  targets.sort((a, b) => a.value - b.value);
  if (targets[0].value >= sample.elevation) return "none";
  return targets[0].key;
}

function stageHydrology(grid, constants) {
  return grid.map((row, y) => row.map((sample, x) => {
    const left = getGridCell(grid, x - 1, y);
    const right = getGridCell(grid, x + 1, y);
    const up = getGridCell(grid, x, y - 1);
    const down = getGridCell(grid, x, y + 1);
    const ownAnchor = findAnchor(constants, sample.continentMass);

    const maritimeInfluence = clamp(sample.distanceToWater < 0 ? 0 : 1 - (sample.distanceToWater / 24), 0, 1);
    const continentality = clamp(1 - maritimeInfluence, 0, 1);
    const rainShadowStrength = clamp(
      sample.ridgeStrength * 0.28 +
      sample.divideStrength * 0.16 +
      Math.max(sample.distanceToWater - 5, 0) / 32,
      0,
      1
    );

    const rainfall = clamp(
      0.14 +
      sample.evaporationPressure * 0.30 +
      toNumber(sample.strongestBasinScore, 0) * 0.18 +
      maritimeInfluence * 0.28 +
      (ownAnchor ? ownAnchor.moistureBias : 0) -
      rainShadowStrength * 0.20 +
      (sample.climateBandField === constants.climateLabels.EQUATORIAL ? 0.10 : 0),
      0,
      1
    );

    const runoff = clamp(
      rainfall * constants.hydrologyRunoffStrength +
      sample.slope * 0.24 +
      sample.meltPotential * 0.12,
      0,
      1
    );

    const basinAccumulation = clamp(
      toNumber(sample.strongestBasinScore, 0) * 0.60 +
      rainfall * 0.22 +
      (sample.waterMask === 1 ? 0.2 : 0),
      0,
      1
    );

    const drainage = determineDrainage(sample, left, right, up, down);
    const riverCandidate =
      sample.landMask === 1 &&
      runoff >= constants.hydrologyRiverThreshold &&
      sample.distanceToWater > 1 &&
      sample.slope >= 0.05;
    const lakeCandidate =
      sample.landMask === 1 &&
      basinAccumulation >= constants.hydrologyLakeThreshold &&
      toNumber(sample.strongestBasinScore, 0) > 0.04 &&
      sample.slope <= 0.16;

    return {
      ...sample,
      rainfall,
      runoff,
      basinAccumulation,
      drainage,
      riverCandidate,
      lakeCandidate,
      continentality,
      maritimeInfluence,
      rainShadowStrength
    };
  }));
}

function stageSeasonalField(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const latAbsNorm = clamp(Math.abs(sample.latDeg) / 90, 0, 1);
    const hemispherePhase = sample.latDeg >= 0 ? constants.seasonGlobalPhase : constants.seasonGlobalPhase + 0.5;
    const wrappedPhase = hemispherePhase - Math.floor(hemispherePhase);
    const phaseAngle = wrappedPhase * Math.PI * 2;
    const seasonalWave = Math.sin(phaseAngle);
    const shoulderWave = Math.cos(phaseAngle);

    const seasonAmplitude = clamp(
      0.12 + latAbsNorm * 0.28 + sample.continentality * 0.12 - sample.maritimeInfluence * 0.08,
      0,
      0.42
    );

    const seasonalTemperature = clamp(
      sample.temperature +
      seasonalWave * seasonAmplitude -
      sample.altitudeCooling * 0.40 +
      sample.maritimeInfluence * 0.03,
      0,
      1
    );

    const seasonalMoisture = clamp(
      sample.rainfall +
      shoulderWave * 0.08 +
      sample.maritimeInfluence * 0.06 -
      sample.rainShadowStrength * 0.08,
      0,
      1
    );

    let hemisphereSeason = constants.seasonLabels.SPRING;
    if (wrappedPhase >= 0 && wrappedPhase < 0.25) hemisphereSeason = constants.seasonLabels.SPRING;
    else if (wrappedPhase >= 0.25 && wrappedPhase < 0.50) hemisphereSeason = constants.seasonLabels.SUMMER;
    else if (wrappedPhase >= 0.50 && wrappedPhase < 0.75) hemisphereSeason = constants.seasonLabels.AUTUMN;
    else hemisphereSeason = constants.seasonLabels.WINTER;

    let seasonalBiomePhase = hemisphereSeason;

    if (sample.waterMask === 1) {
      seasonalBiomePhase = "MARINE";
    } else if (seasonalTemperature <= 0.22 || sample.freezePotential >= 0.80) {
      seasonalBiomePhase = constants.seasonLabels.WINTER;
    } else if (seasonalTemperature >= 0.70 && seasonalMoisture >= 0.20) {
      seasonalBiomePhase = constants.seasonLabels.SUMMER;
    } else if (shoulderWave >= 0) {
      seasonalBiomePhase = constants.seasonLabels.SPRING;
    } else {
      seasonalBiomePhase = constants.seasonLabels.AUTUMN;
    }

    return {
      ...sample,
      hemisphereSeason,
      seasonPhase: wrappedPhase,
      seasonalTemperature,
      seasonalMoisture,
      seasonalBiomePhase
    };
  }));
}

function stageMagnetics(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg) / 90;
    const polarBias = Math.pow(absLat, 0.72);
    const mountainAmplifier = clamp(
      Math.max(0, sample.elevation) * 0.20 + toNumber(sample.strongestSummitScore, 0) * 0.14,
      0,
      0.22
    );

    const magneticIntensity = clamp(
      constants.magneticBaseline + polarBias * 0.5 + mountainAmplifier,
      0,
      1
    );

    const shieldingGradient = clamp(0.25 + magneticIntensity * 0.68, 0, 1);
    const auroralPotential = clamp(
      Math.pow(polarBias, 1.6) * 0.82 + (sample.climateBandField === constants.climateLabels.POLAR ? 0.08 : 0),
      0,
      1
    );

    const navigationBias =
      sample.latDeg > 12 ? "N" :
      sample.latDeg < -12 ? "S" :
      sample.lonDeg >= 0 ? "E" : "W";

    const navigationStability = clamp(
      0.35 + magneticIntensity * 0.5 - sample.canyonStrength * 0.15 - sample.freezePotential * 0.08,
      0,
      1
    );

    const gravityConstraint = clamp(
      1 - (sample.slope * 0.18 + sample.canyonStrength * 0.24 + toNumber(sample.strongestSummitScore, 0) * 0.08),
      0.55,
      1
    );

    return {
      ...sample,
      magneticIntensity,
      shieldingGradient,
      auroralPotential,
      navigationBias,
      navigationStability,
      gravityConstraint
    };
  }));
}

function stageMaterials(grid) {
  const baseDiamond = 0.18;
  const baseOpal = 0.28;
  const baseGranite = 0.22;
  const baseMarble = 0.08;
  const baseMetal = 0.03;

  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg) / 90;
    const highlandBias = clamp(Math.max(0, sample.elevation) * 0.66 + sample.ridgeStrength * 0.20, 0, 1);
    const basinBias = clamp(toNumber(sample.strongestBasinScore, 0) * 0.9 + sample.basinStrength * 0.35, 0, 1);
    const coastalBias = sample.shorelineBand ? 0.12 : 0;

    const diamondDensity = clamp(baseDiamond + highlandBias * 0.48, 0, 1);
    const opalDensity = clamp(baseOpal + (1 - absLat) * 0.26 + coastalBias, 0, 1);
    const graniteDensity = clamp(baseGranite + (1 - highlandBias) * 0.22, 0, 1);
    const marbleDensity = clamp(baseMarble + basinBias * 0.24, 0, 1);
    const metalDensity = clamp(baseMetal + highlandBias * 0.12 + basinBias * 0.04, 0, 1);

    let materialType = "mixed";
    if (diamondDensity >= opalDensity && diamondDensity >= graniteDensity) materialType = "diamond";
    else if (opalDensity >= graniteDensity) materialType = "opal";
    else materialType = "granite";

    return {
      ...sample,
      materialType,
      diamondDensity,
      opalDensity,
      graniteDensity,
      marbleDensity,
      metalDensity
    };
  }));
}

function stageSediment(grid) {
  return grid.map((row) => row.map((sample) => {
    const transportPotential = clamp(
      sample.runoff * 0.45 + sample.slope * 0.3 + sample.meltPotential * 0.15,
      0,
      1
    );

    const depositionPotential = clamp(
      sample.basinAccumulation * 0.5 +
      (1 - sample.slope) * 0.22 +
      sample.freezePotential * 0.08 +
      (sample.shorelineBand ? 0.2 : 0),
      0,
      1
    );

    let sedimentType = "mixed";
    if (sample.waterMask === 1) sedimentType = "marine_sediment";
    else if (sample.diamondDensity > 0.58 && depositionPotential > 0.45) sedimentType = "diamond_sand";
    else if (sample.opalDensity > 0.5 && transportPotential > 0.35) sedimentType = "opal_dust";
    else if (sample.graniteDensity > 0.42) sedimentType = "stone_sediment";

    const sedimentLoad = clamp(
      transportPotential * 0.62 + depositionPotential * 0.28 + sample.metalDensity * 0.08,
      0,
      1
    );

    return {
      ...sample,
      sedimentType,
      sedimentLoad,
      transportPotential,
      depositionPotential
    };
  }));
}

function surfaceMaterialCandidates(sample, constants) {
  const candidates = [];
  const SM = constants.surfaceMaterials;

  if (sample.waterMask === 1) {
    candidates.push({ value: SM.NONE, score: 1, precedence: 999 });
    return candidates;
  }

  const iceLock =
    sample.freezePotential >= 0.88 &&
    sample.meltPotential <= 0.16 &&
    sample.temperature <= 0.22 &&
    (sample.elevation >= 0.26 || sample.climateBandField === constants.climateLabels.POLAR);

  if (iceLock) {
    candidates.push({
      value: SM.ICE,
      score:
        (sample.freezePotential - 0.88) +
        (0.16 - sample.meltPotential) +
        (0.22 - sample.temperature) +
        Math.max(sample.elevation - 0.26, 0),
      precedence: 1
    });
  }

  if (
    sample.freezePotential >= 0.68 &&
    sample.elevation >= 0.20 &&
    !iceLock
  ) {
    candidates.push({
      value: SM.SNOW,
      score:
        (sample.freezePotential - 0.68) +
        (sample.elevation - 0.20),
      precedence: 2
    });
  }

  if (
    sample.slope >= 0.48 ||
    sample.ridgeStrength >= 0.42 ||
    (sample.elevation >= 0.42 && sample.depositionPotential <= 0.22)
  ) {
    candidates.push({
      value: SM.BEDROCK,
      score:
        Math.max(sample.slope - 0.48, 0) +
        Math.max(sample.ridgeStrength - 0.42, 0) +
        Math.max(sample.elevation - 0.42, 0),
      precedence: 3
    });
  }

  if (
    sample.transportPotential >= 0.56 &&
    sample.runoff >= 0.46 &&
    sample.slope >= 0.16
  ) {
    candidates.push({
      value: SM.GRAVEL,
      score:
        (sample.transportPotential - 0.56) +
        (sample.runoff - 0.46) +
        Math.max(sample.slope - 0.16, 0),
      precedence: 4
    });
  }

  if (
    sample.basinAccumulation >= 0.64 &&
    sample.depositionPotential >= 0.60 &&
    sample.slope <= 0.10
  ) {
    candidates.push({
      value: SM.CLAY,
      score:
        (sample.basinAccumulation - 0.64) +
        (sample.depositionPotential - 0.60) +
        (0.10 - sample.slope),
      precedence: 5
    });
  }

  if (
    sample.runoff >= 0.34 &&
    sample.depositionPotential >= 0.40 &&
    sample.slope <= 0.18 &&
    sample.distanceToWater > 2
  ) {
    candidates.push({
      value: SM.SILT,
      score:
        (sample.runoff - 0.34) +
        (sample.depositionPotential - 0.40) +
        (0.18 - sample.slope),
      precedence: 6
    });
  }

  if (
    (sample.shorelineBand && sample.slope <= 0.18) ||
    (sample.evaporationPressure >= 0.70 && sample.rainfall <= 0.20)
  ) {
    candidates.push({
      value: SM.SAND,
      score:
        (sample.shorelineBand ? 0.6 : 0) +
        Math.max(sample.evaporationPressure - 0.70, 0) +
        Math.max(0.20 - sample.rainfall, 0) +
        Math.max(0.18 - sample.slope, 0),
      precedence: 7
    });
  }

  if (
    sample.rainfall >= 0.26 &&
    sample.rainfall <= 0.78 &&
    sample.slope <= 0.28 &&
    sample.freezePotential <= 0.62 &&
    sample.evaporationPressure <= 0.74
  ) {
    candidates.push({
      value: SM.SOIL,
      score:
        Math.max(sample.rainfall - 0.26, 0) +
        Math.max(0.28 - sample.slope, 0) +
        Math.max(0.62 - sample.freezePotential, 0) +
        Math.max(0.74 - sample.evaporationPressure, 0),
      precedence: 8
    });
  }

  if (candidates.length === 0) {
    candidates.push({ value: SM.SOIL, score: 0, precedence: 8 });
  }

  return candidates;
}

function compareCandidates(a, b) {
  if (a.precedence !== b.precedence) return a.precedence - b.precedence;
  if (b.score !== a.score) return b.score - a.score;
  return a.value.localeCompare(b.value);
}

function stageSurfaceBiomeThresholdBands(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const surfaceCandidates = surfaceMaterialCandidates(sample, constants);
    return {
      ...sample,
      _surfaceCandidates: surfaceCandidates
    };
  }));
}

function terrainWouldBeGlacialHighland(sample) {
  return sample.climateBandField === "POLAR" && sample.elevation > 0.28;
}

function stageSurfaceBiomePrecedenceTiebreak(grid, constants) {
  const BT = constants.biomeTypes;
  const CL = constants.climateLabels;
  const SM = constants.surfaceMaterials;

  return grid.map((row) => row.map((sample) => {
    const surfaceCandidates = Array.isArray(sample._surfaceCandidates) ? [...sample._surfaceCandidates] : [];
    surfaceCandidates.sort(compareCandidates);
    const chosenSurface = surfaceCandidates[0]?.value ?? (sample.waterMask === 1 ? SM.NONE : SM.SOIL);

    const biomeCandidates = [];

    if (sample.waterMask === 1) {
      biomeCandidates.push({ value: BT.NONE, score: 1, precedence: 999 });
    } else {
      const glacierLock =
        chosenSurface === SM.ICE &&
        (sample.climateBandField === CL.SUBPOLAR || sample.climateBandField === CL.POLAR) &&
        sample.elevation >= 0.24 &&
        sample.freezePotential >= 0.80;

      if (glacierLock || terrainWouldBeGlacialHighland(sample)) {
        biomeCandidates.push({
          value: BT.GLACIER,
          score: sample.freezePotential + sample.elevation + Math.max(0.3 - sample.meltPotential, 0),
          precedence: 1
        });
      }

      if (
        sample.basinAccumulation >= 0.60 &&
        sample.runoff >= 0.36 &&
        sample.slope <= 0.10 &&
        (sample.strongestBasinScore >= 0.03 || sample.basinStrength >= 0.18)
      ) {
        biomeCandidates.push({
          value: BT.WETLAND,
          score: sample.basinAccumulation + sample.runoff + (0.10 - sample.slope),
          precedence: 2
        });
      }

      if (
        sample.rainfall <= 0.16 &&
        sample.evaporationPressure >= 0.72 &&
        (chosenSurface === SM.SAND || chosenSurface === SM.GRAVEL)
      ) {
        biomeCandidates.push({
          value: BT.DESERT,
          score: (0.16 - sample.rainfall) + sample.evaporationPressure + Math.max(sample.temperature - 0.44, 0),
          precedence: 3
        });
      }

      if (
        sample.climateBandField === CL.EQUATORIAL &&
        sample.rainfall >= 0.68 &&
        sample.temperature >= 0.58 &&
        (chosenSurface === SM.SOIL || chosenSurface === SM.CLAY)
      ) {
        biomeCandidates.push({
          value: BT.TROPICAL_RAINFOREST,
          score: sample.rainfall + sample.temperature + Math.max(0.4 - sample.slope, 0),
          precedence: 4
        });
      }

      if (
        sample.climateBandField === CL.SUBPOLAR &&
        sample.rainfall >= 0.30 &&
        sample.rainfall <= 0.58 &&
        sample.temperature >= 0.18 &&
        sample.temperature <= 0.42 &&
        sample.freezePotential >= 0.34 &&
        sample.freezePotential <= 0.72 &&
        chosenSurface === SM.SOIL
      ) {
        biomeCandidates.push({
          value: BT.BOREAL_FOREST,
          score: sample.rainfall + sample.temperature + sample.freezePotential,
          precedence: 5
        });
      }

      if (
        sample.climateBandField === CL.TEMPERATE &&
        sample.rainfall >= 0.46 &&
        sample.temperature >= 0.34 &&
        sample.temperature <= 0.68 &&
        chosenSurface === SM.SOIL
      ) {
        biomeCandidates.push({
          value: BT.TEMPERATE_FOREST,
          score: sample.rainfall + sample.temperature,
          precedence: 6
        });
      }

      if (
        (sample.climateBandField === CL.SUBPOLAR || sample.climateBandField === CL.POLAR) &&
        sample.freezePotential >= 0.60 &&
        sample.temperature <= 0.32 &&
        !glacierLock
      ) {
        biomeCandidates.push({
          value: BT.TUNDRA,
          score: sample.freezePotential + (0.32 - sample.temperature),
          precedence: 7
        });
      }

      if (
        (sample.climateBandField === CL.EQUATORIAL || sample.climateBandField === CL.TROPICAL) &&
        sample.rainfall >= 0.30 &&
        sample.rainfall <= 0.62 &&
        sample.temperature >= 0.52
      ) {
        biomeCandidates.push({
          value: BT.TROPICAL_GRASSLAND,
          score: sample.rainfall + sample.temperature,
          precedence: 8
        });
      }

      if (
        sample.climateBandField === CL.TEMPERATE &&
        sample.rainfall >= 0.20 &&
        sample.rainfall <= 0.44 &&
        sample.temperature >= 0.34 &&
        sample.temperature <= 0.68
      ) {
        biomeCandidates.push({
          value: BT.TEMPERATE_GRASSLAND,
          score: sample.rainfall + sample.temperature,
          precedence: 9
        });
      }

      if (biomeCandidates.length === 0) {
        if (sample.climateBandField === CL.SUBPOLAR || sample.climateBandField === CL.POLAR) {
          biomeCandidates.push({ value: BT.TUNDRA, score: 0, precedence: 7 });
        } else {
          biomeCandidates.push({ value: BT.TEMPERATE_GRASSLAND, score: 0, precedence: 9 });
        }
      }
    }

    biomeCandidates.sort(compareCandidates);

    return {
      ...sample,
      _surfaceChosen: chosenSurface,
      _biomeChosen: biomeCandidates[0]?.value ?? BT.NONE
    };
  }));
}

function stageSurfaceBiomeSamplingUnitAssignment(grid, constants) {
  const SM = constants.surfaceMaterials;
  const BT = constants.biomeTypes;

  return grid.map((row) => row.map((sample) => ({
    ...sample,
    surfaceMaterial: sample.waterMask === 1 ? SM.NONE : (sample._surfaceChosen ?? SM.SOIL),
    biomeType: sample.waterMask === 1 ? BT.NONE : (sample._biomeChosen ?? BT.TEMPERATE_GRASSLAND)
  })));
}

function stageFinalTerrainClass(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    let terrainClass = constants.terrainClasses.LOWLAND;

    if (sample.waterMask === 1) {
      if (
        sample.oceanDepthField >= constants.oceanDepths.shelf - 1e-9 &&
        sample.oceanDepthField <= constants.oceanDepths.slope + 0.015
      ) {
        terrainClass = constants.terrainClasses.SHELF;
      } else {
        terrainClass = constants.terrainClasses.WATER;
      }
    } else if (sample.surfaceMaterial === constants.surfaceMaterials.ICE && sample.biomeType === constants.biomeTypes.GLACIER) {
      terrainClass = constants.terrainClasses.POLAR_ICE;
    } else if (sample.biomeType === constants.biomeTypes.GLACIER || terrainWouldBeGlacialHighland(sample)) {
      terrainClass = constants.terrainClasses.GLACIAL_HIGHLAND;
    } else if (sample.strongestSummitScore > 0.24 || sample.elevation > 0.58) {
      terrainClass = constants.terrainClasses.SUMMIT;
    } else if (sample.elevation > 0.40 || sample.ridgeStrength > 0.30 || sample.backboneStrength > 0.54) {
      terrainClass = constants.terrainClasses.MOUNTAIN;
    } else if (sample.canyonStrength > 0.30 && sample.slope > 0.18) {
      terrainClass = constants.terrainClasses.CANYON;
    } else if ((sample.strongestBasinScore > 0.065 || sample.basinStrength > 0.22 || sample.basinId != null) && sample.slope <= 0.24) {
      terrainClass = constants.terrainClasses.BASIN;
    } else if ((sample.plateauStrength > 0.50 || sample.plateauId != null) && sample.elevation > 0.16) {
      terrainClass = constants.terrainClasses.PLATEAU;
    } else if ((sample.ridgeStrength > 0.14 || sample.rangeId != null) && sample.elevation > 0.12) {
      terrainClass = constants.terrainClasses.RIDGE;
    } else if (sample.beachCandidate) {
      terrainClass = constants.terrainClasses.BEACH;
    } else if (sample.shoreline) {
      terrainClass = constants.terrainClasses.SHORELINE;
    } else if (sample.elevation > 0.10) {
      terrainClass = constants.terrainClasses.FOOTHILL;
    } else {
      terrainClass = constants.terrainClasses.LOWLAND;
    }

    const eventFlags = [];
    if (sample.riverCandidate) eventFlags.push("RIVER_CANDIDATE");
    if (sample.lakeCandidate) eventFlags.push("LAKE_CANDIDATE");
    if (sample.cavePotential > constants.topologyCaveThreshold) eventFlags.push("CAVE_CANDIDATE");
    if (sample.shoreline) eventFlags.push("SHORELINE");
    if (sample.biomeType === constants.biomeTypes.GLACIER) eventFlags.push("GLACIER");
    if (sample.biomeType === constants.biomeTypes.WETLAND) eventFlags.push("WETLAND");
    if (sample.rangeId != null) eventFlags.push("RANGE_GROUPED");
    if (sample.valleyId != null) eventFlags.push("VALLEY_GROUPED");
    if (sample.canyonId != null) eventFlags.push("CANYON_GROUPED");
    if (sample.creviceId != null) eventFlags.push("CREVICE_GROUPED");
    if (sample.plateauId != null) eventFlags.push("PLATEAU_GROUPED");

    return {
      ...sample,
      terrainClass,
      eventFlags
    };
  }));
}

function buildSummary(grid, constants, topologyCoordinationDiagnostics = null) {
  const summary = {
    sampleCount: 0,
    landCount: 0,
    waterCount: 0,
    shorelineCount: 0,
    mountainCount: 0,
    basinCount: 0,
    canyonCount: 0,
    caveCandidateCount: 0,
    glacialRegionCount: 0,
    temperatureAverage: 0,
    rainfallAverage: 0,
    runoffAverage: 0,
    magneticAverage: 0,
    auroralAverage: 0,
    diamondAverage: 0,
    opalAverage: 0,
    sedimentAverage: 0,
    seasonalTemperatureAverage: 0,
    seasonalMoistureAverage: 0,
    elevationMin: Infinity,
    elevationMax: -Infinity,
    topologyVariance: 0,
    continentIds: [],
    continentCount: 0,
    seasonCoverage: {
      WINTER: false,
      SPRING: false,
      SUMMER: false,
      AUTUMN: false
    },
    climateBandCoverage: {
      EQUATORIAL: false,
      TROPICAL: false,
      TEMPERATE: false,
      SUBPOLAR: false,
      POLAR: false
    },
    mountainRegionCount: 0,
    basinRegionCount: 0,
    topologyCoordinationDiagnostics: topologyCoordinationDiagnostics
      ? Object.freeze(topologyCoordinationDiagnostics)
      : null
  };

  let temperatureTotal = 0;
  let rainfallTotal = 0;
  let runoffTotal = 0;
  let magneticTotal = 0;
  let auroralTotal = 0;
  let diamondTotal = 0;
  let opalTotal = 0;
  let sedimentTotal = 0;
  let seasonalTemperatureTotal = 0;
  let seasonalMoistureTotal = 0;
  let slopeTotal = 0;
  let ridgeTotal = 0;
  let basinTotal = 0;

  const continentSet = new Set();
  const mountainRegionSet = new Set();
  const basinRegionSet = new Set();

  for (const row of grid) {
    for (const sample of row) {
      summary.sampleCount += 1;
      if (sample.landMask === 1) {
        summary.landCount += 1;
        if (sample.continentMass && sample.continentMass !== "NONE") continentSet.add(sample.continentMass);
      } else {
        summary.waterCount += 1;
      }

      if (sample.shoreline) summary.shorelineCount += 1;

      if (
        sample.terrainClass === "MOUNTAIN" ||
        sample.terrainClass === "SUMMIT" ||
        sample.terrainClass === "GLACIAL_HIGHLAND"
      ) {
        summary.mountainCount += 1;
        if (sample.continentMass !== "NONE") mountainRegionSet.add(sample.continentMass);
      }

      if (sample.terrainClass === "BASIN") {
        summary.basinCount += 1;
        if (sample.continentMass !== "NONE") basinRegionSet.add(sample.continentMass);
      }

      if (sample.terrainClass === "CANYON") summary.canyonCount += 1;
      if (sample.cavePotential > 0.5) summary.caveCandidateCount += 1;
      if (sample.biomeType === "GLACIER" || sample.terrainClass === "GLACIAL_HIGHLAND" || sample.terrainClass === "POLAR_ICE") {
        summary.glacialRegionCount += 1;
      }

      if (sample.landMask === 1) {
        if (sample.seasonalBiomePhase === constants.seasonLabels.WINTER) summary.seasonCoverage.WINTER = true;
        if (sample.seasonalBiomePhase === constants.seasonLabels.SPRING) summary.seasonCoverage.SPRING = true;
        if (sample.seasonalBiomePhase === constants.seasonLabels.SUMMER) summary.seasonCoverage.SUMMER = true;
        if (sample.seasonalBiomePhase === constants.seasonLabels.AUTUMN) summary.seasonCoverage.AUTUMN = true;
      }

      if (summary.climateBandCoverage[sample.climateBandField] === false) {
        summary.climateBandCoverage[sample.climateBandField] = true;
      }

      temperatureTotal += sample.temperature;
      rainfallTotal += sample.rainfall;
      runoffTotal += sample.runoff;
      magneticTotal += sample.magneticIntensity;
      auroralTotal += sample.auroralPotential;
      diamondTotal += sample.diamondDensity;
      opalTotal += sample.opalDensity;
      sedimentTotal += sample.sedimentLoad;
      seasonalTemperatureTotal += sample.seasonalTemperature;
      seasonalMoistureTotal += sample.seasonalMoisture;
      slopeTotal += sample.slope;
      ridgeTotal += sample.ridgeStrength;
      basinTotal += sample.basinStrength;

      summary.elevationMin = Math.min(summary.elevationMin, sample.elevation);
      summary.elevationMax = Math.max(summary.elevationMax, sample.elevation);
    }
  }

  const count = Math.max(1, summary.sampleCount);
  summary.temperatureAverage = temperatureTotal / count;
  summary.rainfallAverage = rainfallTotal / count;
  summary.runoffAverage = runoffTotal / count;
  summary.magneticAverage = magneticTotal / count;
  summary.auroralAverage = auroralTotal / count;
  summary.diamondAverage = diamondTotal / count;
  summary.opalAverage = opalTotal / count;
  summary.sedimentAverage = sedimentTotal / count;
  summary.seasonalTemperatureAverage = seasonalTemperatureTotal / count;
  summary.seasonalMoistureAverage = seasonalMoistureTotal / count;

  summary.topologyVariance = (slopeTotal / count) + (ridgeTotal / count) + (basinTotal / count);
  summary.continentIds = Object.freeze(Array.from(continentSet).sort());
  summary.continentCount = summary.continentIds.length;
  summary.mountainRegionCount = mountainRegionSet.size;
  summary.basinRegionCount = basinRegionSet.size;

  if (!Number.isFinite(summary.elevationMin)) summary.elevationMin = 0;
  if (!Number.isFinite(summary.elevationMax)) summary.elevationMax = 0;

  return Object.freeze(summary);
}

function buildCompleteness() {
  return Object.freeze({
    base_sample_grid: true,
    macro_continent_field: true,
    land_water_classification: true,
    continent_labels: true,
    summit_realization: true,
    basin_realization: true,
    elevation_redistribution: true,
    ocean_depth_realization: true,
    climate_bands: true,
    topology_fields: true,
    land_topology_coordination: true,
    thermodynamics: true,
    hydrology: true,
    seasonal_field: true,
    magnetics: true,
    materials: true,
    sediment: true,
    surface_biome_threshold_bands: true,
    surface_biome_precedence_tiebreak: true,
    surface_biome_sampling_unit_assignment: true,
    final_terrain_class: true,
    summary_completeness: true
  });
}

function finalizeSamples(grid) {
  return Object.freeze(
    grid.map((row) =>
      Object.freeze(
        row.map((sample) => {
          const finalized = {
            ...sample,
            eventFlags: Object.freeze(Array.isArray(sample.eventFlags) ? [...sample.eventFlags] : [])
          };

          delete finalized.anchorScores;
          delete finalized.oceanCarveTotal;
          delete finalized.corridorSeparation;
          delete finalized._surfaceCandidates;
          delete finalized._surfaceChosen;
          delete finalized._biomeChosen;

          return Object.freeze(finalized);
        })
      )
    )
  );
}

function buildPlanetFieldInternal(constants) {
  const stage0 = stageBaseSampleGrid(constants);
  const stage1 = stageMacroContinentField(stage0, constants);
  const stage2 = stageLandWaterClassification(stage1, constants);
  const stage3 = stageContinentLabels(stage2, constants);
  const stage4 = stageSummitRealization(stage3, constants);
  const stage5 = stageBasinRealization(stage4, constants);
  const stage6 = stageElevationRedistribution(stage5);
  const stage7 = stageOceanDepthRealization(stage6, constants);
  const stage8 = stageClimateBands(stage7, constants);
  const stage9 = stageTopologyFields(stage8, constants);
  const stage10Result = stageLandTopologyCoordination(stage9, constants);
  const stage10 = stage10Result.grid;
  const stage11 = stageThermodynamics(stage10, constants);
  const stage12 = stageHydrology(stage11, constants);
  const stage13 = stageSeasonalField(stage12, constants);
  const stage14 = stageMagnetics(stage13, constants);
  const stage15 = stageMaterials(stage14);
  const stage16 = stageSediment(stage15);
  const stage17 = stageSurfaceBiomeThresholdBands(stage16, constants);
  const stage18 = stageSurfaceBiomePrecedenceTiebreak(stage17, constants);
  const stage19 = stageSurfaceBiomeSamplingUnitAssignment(stage18, constants);
  const stage20 = stageFinalTerrainClass(stage19, constants);

  const samples = finalizeSamples(stage20);
  const summary = buildSummary(samples, constants, stage10Result.diagnostics);
  const completeness = buildCompleteness();

  return Object.freeze({
    width: constants.width,
    height: constants.height,
    samples,
    summary,
    completeness
  });
}

export function createPlanetEngine() {
  const contract = getKernelContract();
  const constants = buildAuthoredConstants(contract);

  function buildField(_inputState = {}) {
    return buildPlanetFieldInternal(constants);
  }

  return Object.freeze({
    buildPlanetField: buildField
  });
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export function buildPlanetField(inputState = {}) {
  return DEFAULT_PLANET_ENGINE.buildPlanetField(inputState);
}

export default DEFAULT_PLANET_ENGINE;
