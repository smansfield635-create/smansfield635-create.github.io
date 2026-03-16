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

  return Object.freeze({
    width: Number.isInteger(planetField.width) ? planetField.width : 256,
    height: Number.isInteger(planetField.height) ? planetField.height : 256,
    total: Number.isInteger(planetField.total) ? planetField.total : 65536,
    constants
  });
}

function buildAuthoredConstants(contract) {
  const kc = normalizeObject(contract.constants);

  return Object.freeze({
    width: contract.width,
    height: contract.height,
    totalSamples: contract.total,

    seaLevel: toNumber(kc.seaLevelNormalized, 0),
    landTarget: toNumber(kc.landTarget, 0.29),
    waterTarget: toNumber(kc.waterTarget, 0.71),
    ratioTolerance: toNumber(kc.ratioTolerance, 0.005),

    contourSeedA: toNumber(kc.contourSeedA, 1109),
    contourSeedB: toNumber(kc.contourSeedB, 2713),
    contourSeedC: toNumber(kc.contourSeedC, 4079),
    contourAmplitude: toNumber(kc.contourAmplitude, 0.07),
    contourSigma: toNumber(kc.contourSigma, 0.06),
    macroThreshold: toNumber(kc.macroThreshold, 0.16),
    finalLandThresholdDefault: toNumber(kc.finalLandThresholdDefault, 0.18),
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

    anchors: Object.freeze([
      Object.freeze({
        id: "HARBOR_SUPERCONTINENT",
        centerLatDeg: 8,
        centerLonDeg: 0,
        baseRadiusDeg: 58,
        anisotropyX: 1.35,
        anisotropyY: 0.92,
        rotationDeg: -12,
        dominanceWeight: 1.8
      }),
      Object.freeze({
        id: "GRATITUDE_REGION",
        centerLatDeg: 26,
        centerLonDeg: 36,
        baseRadiusDeg: 24,
        anisotropyX: 1.05,
        anisotropyY: 0.82,
        rotationDeg: 18,
        dominanceWeight: 1.05
      }),
      Object.freeze({
        id: "GENEROSITY_REGION",
        centerLatDeg: 24,
        centerLonDeg: -34,
        baseRadiusDeg: 24,
        anisotropyX: 1.02,
        anisotropyY: 0.86,
        rotationDeg: -20,
        dominanceWeight: 1.05
      }),
      Object.freeze({
        id: "HUMILITY_BODY",
        centerLatDeg: -18,
        centerLonDeg: 104,
        baseRadiusDeg: 27,
        anisotropyX: 1.18,
        anisotropyY: 0.88,
        rotationDeg: -8,
        dominanceWeight: 0.88
      }),
      Object.freeze({
        id: "FORGIVENESS_BODY",
        centerLatDeg: -22,
        centerLonDeg: -110,
        baseRadiusDeg: 29,
        anisotropyX: 1.12,
        anisotropyY: 0.90,
        rotationDeg: 16,
        dominanceWeight: 0.90
      }),
      Object.freeze({
        id: "ACCOUNTABILITY_BODY",
        centerLatDeg: 42,
        centerLonDeg: 112,
        baseRadiusDeg: 21,
        anisotropyX: 0.98,
        anisotropyY: 1.10,
        rotationDeg: 28,
        dominanceWeight: 0.76
      }),
      Object.freeze({
        id: "PURITY_BODY",
        centerLatDeg: 61,
        centerLonDeg: -28,
        baseRadiusDeg: 18,
        anisotropyX: 0.84,
        anisotropyY: 1.34,
        rotationDeg: 6,
        dominanceWeight: 0.72
      })
    ]),

    harborBridge: Object.freeze({
      harborToGratitudeWeight: 0.22,
      harborToGenerosityWeight: 0.22,
      harborToGratitudeCorridorWidthDeg: 11,
      harborToGenerosityCorridorWidthDeg: 11,
      falloffExponent: 1.65
    }),

    oceanCarves: Object.freeze([
      Object.freeze({
        id: "WESTERN_DEEP_OCEAN",
        centerLatDeg: -4,
        centerLonDeg: -70,
        radiusDeg: 34,
        weight: 0.95
      }),
      Object.freeze({
        id: "EASTERN_WARM_OCEAN",
        centerLatDeg: 2,
        centerLonDeg: 76,
        radiusDeg: 31,
        weight: 0.88
      }),
      Object.freeze({
        id: "SOUTHERN_OPEN_OCEAN",
        centerLatDeg: -42,
        centerLonDeg: 10,
        radiusDeg: 44,
        weight: 1.0
      }),
      Object.freeze({
        id: "NORTH_POLAR_SEPARATION_SEA",
        centerLatDeg: 72,
        centerLonDeg: 98,
        radiusDeg: 20,
        weight: 0.72
      })
    ]),
    oceanCarveExponent: 2.0,
    continentInfluenceExponent: 1.85,

    summits: Object.freeze([
      Object.freeze({
        id: "S1_HARBOR_BASIN_RIM",
        parentRegion: "HARBOR_SUPERCONTINENT",
        anchorLatDeg: 6,
        anchorLonDeg: -8,
        peakHeightNorm: 0.08,
        influenceRadiusDeg: 10,
        difficultyWeight: 0.20
      }),
      Object.freeze({
        id: "S2_GRATITUDE_RIDGE",
        parentRegion: "GRATITUDE_REGION",
        anchorLatDeg: 22,
        anchorLonDeg: 28,
        peakHeightNorm: 0.12,
        influenceRadiusDeg: 10,
        difficultyWeight: 0.26
      }),
      Object.freeze({
        id: "S3_GENEROSITY_PLATEAU",
        parentRegion: "GENEROSITY_REGION",
        anchorLatDeg: 22,
        anchorLonDeg: -26,
        peakHeightNorm: 0.16,
        influenceRadiusDeg: 11,
        difficultyWeight: 0.32
      }),
      Object.freeze({
        id: "S4_HUMILITY_PASS",
        parentRegion: "HUMILITY_BODY",
        anchorLatDeg: -12,
        anchorLonDeg: 96,
        peakHeightNorm: 0.21,
        influenceRadiusDeg: 12,
        difficultyWeight: 0.40
      }),
      Object.freeze({
        id: "S5_ACCOUNTABILITY_SPINE",
        parentRegion: "ACCOUNTABILITY_BODY",
        anchorLatDeg: 39,
        anchorLonDeg: 106,
        peakHeightNorm: 0.28,
        influenceRadiusDeg: 13,
        difficultyWeight: 0.50
      }),
      Object.freeze({
        id: "S6_FORGIVENESS_WALL",
        parentRegion: "FORGIVENESS_BODY",
        anchorLatDeg: -18,
        anchorLonDeg: -100,
        peakHeightNorm: 0.36,
        influenceRadiusDeg: 13,
        difficultyWeight: 0.62
      }),
      Object.freeze({
        id: "S7_PATIENCE_RANGE",
        parentRegion: "HARBOR_SUPERCONTINENT",
        anchorLatDeg: 15,
        anchorLonDeg: 10,
        peakHeightNorm: 0.46,
        influenceRadiusDeg: 14,
        difficultyWeight: 0.74
      }),
      Object.freeze({
        id: "S8_SELF_CONTROL_PEAK",
        parentRegion: "HARBOR_SUPERCONTINENT",
        anchorLatDeg: 18,
        anchorLonDeg: 0,
        peakHeightNorm: 0.60,
        influenceRadiusDeg: 14,
        difficultyWeight: 0.86
      }),
      Object.freeze({
        id: "S9_PURITY_APEX",
        parentRegion: "PURITY_BODY",
        anchorLatDeg: 64,
        anchorLonDeg: -24,
        peakHeightNorm: 0.78,
        influenceRadiusDeg: 15,
        difficultyWeight: 1.0
      })
    ]),

    basins: Object.freeze([
      Object.freeze({
        id: "B1_HARBOR_BASIN",
        parentRegion: "HARBOR_SUPERCONTINENT",
        centerLatDeg: 2,
        centerLonDeg: 0,
        basinDepthNorm: -0.08,
        influenceRadiusDeg: 16,
        recoveryPriority: 1
      }),
      Object.freeze({
        id: "B2_GRATITUDE_BASIN",
        parentRegion: "GRATITUDE_REGION",
        centerLatDeg: 19,
        centerLonDeg: 34,
        basinDepthNorm: -0.07,
        influenceRadiusDeg: 11,
        recoveryPriority: 2
      }),
      Object.freeze({
        id: "B3_GENEROSITY_BASIN",
        parentRegion: "GENEROSITY_REGION",
        centerLatDeg: 19,
        centerLonDeg: -32,
        basinDepthNorm: -0.07,
        influenceRadiusDeg: 11,
        recoveryPriority: 2
      }),
      Object.freeze({
        id: "B4_HUMILITY_BASIN",
        parentRegion: "HUMILITY_BODY",
        centerLatDeg: -20,
        centerLonDeg: 102,
        basinDepthNorm: -0.09,
        influenceRadiusDeg: 12,
        recoveryPriority: 3
      }),
      Object.freeze({
        id: "B5_FORGIVENESS_BASIN",
        parentRegion: "FORGIVENESS_BODY",
        centerLatDeg: -24,
        centerLonDeg: -112,
        basinDepthNorm: -0.10,
        influenceRadiusDeg: 12,
        recoveryPriority: 3
      }),
      Object.freeze({
        id: "B6_ACCOUNTABILITY_BASIN",
        parentRegion: "ACCOUNTABILITY_BODY",
        centerLatDeg: 36,
        centerLonDeg: 108,
        basinDepthNorm: -0.08,
        influenceRadiusDeg: 10,
        recoveryPriority: 4
      }),
      Object.freeze({
        id: "B7_PURITY_BASIN",
        parentRegion: "PURITY_BODY",
        centerLatDeg: 58,
        centerLonDeg: -30,
        basinDepthNorm: -0.06,
        influenceRadiusDeg: 9,
        recoveryPriority: 5
      })
    ])
  });
}

function findAnchor(constants, id) {
  return constants.anchors.find((anchor) => anchor.id === id) ?? null;
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

function radialFalloff(latDeg, lonDeg, anchorLatDeg, anchorLonDeg, radiusDeg, exponent = 1.75) {
  const midLatRad = degToRad((latDeg + anchorLatDeg) * 0.5);
  const dLon = normalizeLongitudeDelta(lonDeg - anchorLonDeg) * Math.cos(midLatRad);
  const dLat = latDeg - anchorLatDeg;
  const d = Math.sqrt((dLon * dLon) + (dLat * dLat)) / Math.max(1e-9, radiusDeg);
  if (d >= 1) return 0;
  return Math.max(0, 1 - Math.pow(d, exponent));
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
    seedSignature: "AUTHORED_NINE_SUMMITS_WORLD_v1",
    nestedLatticeDepth: 1,

    landMask: 0,
    waterMask: 1,
    macroLandScore: 0,
    finalLandScore: 0,

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
  const harbor = findAnchor(constants, "HARBOR_SUPERCONTINENT");
  const gratitude = findAnchor(constants, "GRATITUDE_REGION");
  const generosity = findAnchor(constants, "GENEROSITY_REGION");

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

    const bridgeG = constants.harborBridge.harborToGratitudeWeight * corridorField(
      sample.latDeg,
      sample.lonDeg,
      harbor,
      gratitude,
      constants.harborBridge.harborToGratitudeCorridorWidthDeg,
      constants.harborBridge.falloffExponent
    );

    const bridgeN = constants.harborBridge.harborToGenerosityWeight * corridorField(
      sample.latDeg,
      sample.lonDeg,
      harbor,
      generosity,
      constants.harborBridge.harborToGenerosityCorridorWidthDeg,
      constants.harborBridge.falloffExponent
    );

    let oceanCarveTotal = 0;
    for (const carve of constants.oceanCarves) {
      oceanCarveTotal += radialInfluence(
        sample.latDeg,
        sample.lonDeg,
        carve,
        constants.oceanCarveExponent
      );
    }

    const macroRaw = sumInfluence + bridgeG + bridgeN - oceanCarveTotal;
    const macroLandScore = Math.max(0, macroRaw);

    const n1 = sampleSignedNoise(constants.contourSeedA, sample.latDeg, sample.lonDeg, 9.5, 13.5);
    const n2 = sampleSignedNoise(constants.contourSeedB, sample.latDeg, sample.lonDeg, 18, 23);
    const n3 = sampleSignedNoise(constants.contourSeedC, sample.latDeg, sample.lonDeg, 36, 44);
    const contourNoise = (0.55 * n1) + (0.30 * n2) + (0.15 * n3);

    const coastSensitivity = Math.exp(-Math.abs(macroLandScore - constants.macroThreshold) / constants.contourSigma);
    const contourContribution = constants.contourAmplitude * coastSensitivity * contourNoise;
    const finalLandScore = macroLandScore + contourContribution;

    return {
      ...sample,
      anchorScores,
      harborBridgeSupport: bridgeG + bridgeN,
      oceanCarveTotal,
      macroLandScore,
      finalLandScore
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
        subRegion: "NONE"
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

    const bestRegion = entries[0]?.[0] ?? "HARBOR_SUPERCONTINENT";
    const continentMass =
      bestRegion === "GRATITUDE_REGION" || bestRegion === "GENEROSITY_REGION"
        ? "HARBOR_SUPERCONTINENT"
        : bestRegion;

    return {
      ...sample,
      continentMass,
      macroRegion: continentMass,
      subRegion: bestRegion
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
        1.7
      );
      if (influence <= 0) continue;

      const contribution = summit.peakHeightNorm * influence;
      summitElevation += contribution;

      if (contribution > strongestSummitScore) {
        strongestSummitScore = contribution;
        strongestSummitId = summit.id;
      }
    }

    const harborBodyBoost =
      sample.continentMass === "HARBOR_SUPERCONTINENT"
        ? 0.05 + (toNumber(sample.harborBridgeSupport, 0) * 0.12)
        : 0;

    const continentalPlate = 0.04 + (sample.macroLandScore * 0.12) + harborBodyBoost;
    const baseElevation = clamp(continentalPlate + summitElevation, 0.01, 0.98);

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
        1.8
      );
      if (influence <= 0) continue;

      const contribution = Math.abs(basin.basinDepthNorm) * influence;
      basinPull += contribution;

      if (contribution > strongestBasinScore) {
        strongestBasinScore = contribution;
        strongestBasinId = basin.id;
      }
    }

    const elevation = clamp(sample.elevation - basinPull, 0.001, 0.98);

    return {
      ...sample,
      strongestBasinId,
      strongestBasinScore,
      elevation
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

    const oceanBase = clamp(toNumber(sample.oceanCarveTotal, 0), 0, 1.25);
    let oceanDepth = constants.oceanDepths.shelf;

    if (oceanBase > 0.95) oceanDepth = constants.oceanDepths.trench;
    else if (oceanBase > 0.68) oceanDepth = constants.oceanDepths.abyss;
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

function computeDistanceFields(grid) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const distanceToWater = Array.from({ length: height }, () => Array.from({ length: width }, () => Infinity));
  const distanceToLand = Array.from({ length: height }, () => Array.from({ length: width }, () => Infinity));
  const waterQueue = [];
  const landQueue = [];
  const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];

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
      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
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
    const left = getElevation(grid, Math.max(0, x - 1), y);
    const right = getElevation(grid, Math.min(grid[0].length - 1, x + 1), y);
    const up = getElevation(grid, x, Math.max(0, y - 1));
    const down = getElevation(grid, x, Math.min(grid.length - 1, y + 1));

    const dx = right - left;
    const dy = down - up;
    const slope = clamp(Math.sqrt((dx * dx) + (dy * dy)) * 2.4, 0, 1);

    const meanNeighbor = (left + right + up + down) / 4;
    const curvatureRaw = sample.elevation - meanNeighbor;
    const curvature = clamp(curvatureRaw * 4, -1, 1);

    const ridgeStrength = clamp(curvature > 0 ? curvature : 0, 0, 1);
    const basinStrength = clamp(curvature < 0 ? -curvature : 0, 0, 1);
    const divideStrength = clamp(Math.abs(dx - dy) * 2.4, 0, 1);
    const plateauStrength = clamp(sample.elevation > 0.18 ? 1 - slope : 0, 0, 1);
    const canyonStrength = clamp(slope > 0.18 ? basinStrength * slope * 1.35 : 0, 0, 1);
    const cavePotential = clamp(
      basinStrength * 0.45 + plateauStrength * 0.12 + canyonStrength * 0.28,
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
      slope < 0.18 &&
      sample.elevation <= (constants.seaLevel + constants.shorelineBandHalfWidth * 3.5);

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

function stageThermodynamics(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg) / 90;
    const polarCooling = Math.pow(absLat, 1.35) * constants.thermalPolarCoolingStrength;
    const elevationCooling = clamp(Math.max(0, sample.elevation - constants.seaLevel) * 0.35, 0, 0.34);
    const basinModeration = clamp(toNumber(sample.strongestBasinScore, 0) * 0.16, 0, 0.14);
    const shorelineModeration = sample.shoreline ? 0.08 : 0;
    const summitExposure = clamp(toNumber(sample.strongestSummitScore, 0) * 0.2, 0, 0.18);
    const regionWarmBias =
      sample.subRegion === "GRATITUDE_REGION" || sample.subRegion === "GENEROSITY_REGION"
        ? 0.04
        : sample.continentMass === "HARBOR_SUPERCONTINENT"
          ? 0.02
          : 0;

    const temperature = clamp(
      constants.thermalBaseline +
        regionWarmBias +
        basinModeration +
        shorelineModeration -
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
      evaporationPressure
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
    const left = grid[y]?.[Math.max(0, x - 1)] ?? null;
    const right = grid[y]?.[Math.min(grid[0].length - 1, x + 1)] ?? null;
    const up = grid[Math.max(0, y - 1)]?.[x] ?? null;
    const down = grid[Math.min(grid.length - 1, y + 1)]?.[x] ?? null;

    const rainfall = clamp(
      0.14 +
        sample.evaporationPressure * 0.34 +
        toNumber(sample.strongestBasinScore, 0) * 0.18 +
        (sample.shorelineBand ? 0.16 : 0) +
        (sample.climateBandField === constants.climateLabels.EQUATORIAL ? 0.12 : 0),
      0,
      1
    );

    const runoff = clamp(
      rainfall * constants.hydrologyRunoffStrength +
        sample.slope * 0.26 +
        sample.meltPotential * 0.12,
      0,
      1
    );

    const basinAccumulation = clamp(
      toNumber(sample.strongestBasinScore, 0) * 0.6 +
        rainfall * 0.22 +
        (sample.waterMask === 1 ? 0.2 : 0),
      0,
      1
    );

    const drainage = determineDrainage(sample, left, right, up, down);
    const riverCandidate =
      sample.landMask === 1 &&
      runoff >= constants.hydrologyRiverThreshold &&
      sample.distanceToWater > 1;
    const lakeCandidate =
      sample.landMask === 1 &&
      basinAccumulation >= constants.hydrologyLakeThreshold &&
      toNumber(sample.strongestBasinScore, 0) > 0.04;

    return {
      ...sample,
      rainfall,
      runoff,
      basinAccumulation,
      drainage,
      riverCandidate,
      lakeCandidate
    };
  }));
}

function stageMagnetics(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg) / 90;
    const polarBias = Math.pow(absLat, 0.72);
    const mountainAmplifier = clamp(
      Math.max(0, sample.elevation) * 0.22 + toNumber(sample.strongestSummitScore, 0) * 0.18,
      0,
      0.24
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
      sample.latDeg > 12 ? "N"
        : sample.latDeg < -12 ? "S"
          : sample.lonDeg >= 0 ? "E" : "W";

    const navigationStability = clamp(
      0.35 + magneticIntensity * 0.5 - sample.canyonStrength * 0.15 - sample.freezePotential * 0.08,
      0,
      1
    );

    const gravityConstraint = clamp(
      1 - (sample.slope * 0.18 + sample.canyonStrength * 0.24 + toNumber(sample.strongestSummitScore, 0) * 0.10),
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
    const highlandBias = clamp(Math.max(0, sample.elevation) * 0.7 + sample.ridgeStrength * 0.22, 0, 1);
    const basinBias = clamp(toNumber(sample.strongestBasinScore, 0) * 0.9 + sample.basinStrength * 0.35, 0, 1);
    const coastalBias = sample.shorelineBand ? 0.12 : 0;

    const diamondDensity = clamp(baseDiamond + highlandBias * 0.52, 0, 1);
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

  if (
    sample.freezePotential >= 0.82 &&
    sample.meltPotential <= 0.20 &&
    sample.temperature <= 0.26
  ) {
    candidates.push({
      value: SM.ICE,
      score:
        (sample.freezePotential - 0.82) +
        (0.20 - sample.meltPotential) +
        (0.26 - sample.temperature),
      precedence: 1
    });
  }

  if (
    sample.freezePotential >= 0.64 &&
    sample.elevation >= 0.24 &&
    !(
      sample.freezePotential >= 0.82 &&
      sample.meltPotential <= 0.20 &&
      sample.temperature <= 0.26
    )
  ) {
    candidates.push({
      value: SM.SNOW,
      score: (sample.freezePotential - 0.64) + (sample.elevation - 0.24),
      precedence: 2
    });
  }

  if (
    sample.slope >= 0.42 ||
    sample.ridgeStrength >= 0.38 ||
    (sample.elevation >= 0.34 && sample.depositionPotential <= 0.24)
  ) {
    candidates.push({
      value: SM.BEDROCK,
      score: Math.max(sample.slope - 0.42, 0) + Math.max(sample.ridgeStrength - 0.38, 0),
      precedence: 3
    });
  }

  if (
    sample.transportPotential >= 0.48 &&
    sample.runoff >= 0.42 &&
    sample.slope >= 0.18
  ) {
    candidates.push({
      value: SM.GRAVEL,
      score:
        (sample.transportPotential - 0.48) +
        (sample.runoff - 0.42) +
        (sample.slope - 0.18),
      precedence: 4
    });
  }

  if (
    sample.basinAccumulation >= 0.52 &&
    sample.depositionPotential >= 0.52 &&
    sample.slope <= 0.14
  ) {
    candidates.push({
      value: SM.CLAY,
      score:
        (sample.basinAccumulation - 0.52) +
        (sample.depositionPotential - 0.52) +
        (0.14 - sample.slope),
      precedence: 5
    });
  }

  if (
    sample.runoff >= 0.26 &&
    sample.depositionPotential >= 0.34 &&
    sample.slope <= 0.22
  ) {
    candidates.push({
      value: SM.SILT,
      score:
        (sample.runoff - 0.26) +
        (sample.depositionPotential - 0.34) +
        (0.22 - sample.slope),
      precedence: 6
    });
  }

  if (
    sample.shorelineBand ||
    (sample.evaporationPressure >= 0.62 && sample.rainfall <= 0.24)
  ) {
    candidates.push({
      value: SM.SAND,
      score:
        (sample.shorelineBand ? 0.5 : 0) +
        Math.max(sample.evaporationPressure - 0.62, 0) +
        Math.max(0.24 - sample.rainfall, 0),
      precedence: 7
    });
  }

  if (
    sample.rainfall >= 0.24 &&
    sample.rainfall <= 0.72 &&
    sample.slope <= 0.30 &&
    sample.freezePotential <= 0.58 &&
    sample.evaporationPressure <= 0.72
  ) {
    candidates.push({
      value: SM.SOIL,
      score:
        (sample.rainfall - 0.24) +
        (0.30 - sample.slope) +
        (0.58 - sample.freezePotential) +
        (0.72 - sample.evaporationPressure),
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
      if (
        chosenSurface === SM.ICE &&
        (
          (sample.climateBandField === CL.SUBPOLAR || sample.climateBandField === CL.POLAR) &&
          sample.elevation >= 0.28
        )
      ) {
        biomeCandidates.push({ value: BT.GLACIER, score: sample.freezePotential + sample.elevation, precedence: 1 });
      }

      if (
        sample.basinAccumulation >= 0.56 &&
        sample.runoff >= 0.34 &&
        sample.slope <= 0.12 &&
        (
          sample.terrainClass === constants.terrainClasses.BASIN ||
          sample.terrainClass === constants.terrainClasses.LOWLAND ||
          sample.terrainClass === constants.terrainClasses.SHORELINE
        )
      ) {
        biomeCandidates.push({
          value: BT.WETLAND,
          score: sample.basinAccumulation + sample.runoff + (0.12 - sample.slope),
          precedence: 2
        });
      }

      if (
        sample.rainfall <= 0.18 &&
        sample.evaporationPressure >= 0.62 &&
        (chosenSurface === SM.SAND || chosenSurface === SM.GRAVEL)
      ) {
        biomeCandidates.push({
          value: BT.DESERT,
          score: (0.18 - sample.rainfall) + sample.evaporationPressure,
          precedence: 3
        });
      }

      if (
        sample.climateBandField === CL.EQUATORIAL &&
        sample.rainfall >= 0.66 &&
        sample.temperature >= 0.56 &&
        (chosenSurface === SM.SOIL || chosenSurface === SM.CLAY)
      ) {
        biomeCandidates.push({
          value: BT.TROPICAL_RAINFOREST,
          score: sample.rainfall + sample.temperature,
          precedence: 4
        });
      }

      if (
        sample.climateBandField === CL.SUBPOLAR &&
        sample.rainfall >= 0.28 &&
        sample.rainfall <= 0.58 &&
        sample.temperature >= 0.22 &&
        sample.temperature <= 0.46 &&
        sample.freezePotential >= 0.30 &&
        sample.freezePotential <= 0.68
      ) {
        biomeCandidates.push({
          value: BT.BOREAL_FOREST,
          score: sample.rainfall + sample.temperature + sample.freezePotential,
          precedence: 5
        });
      }

      if (
        sample.climateBandField === CL.TEMPERATE &&
        sample.rainfall >= 0.42 &&
        sample.temperature >= 0.34 &&
        sample.temperature <= 0.66 &&
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
        sample.freezePotential >= 0.58 &&
        sample.temperature <= 0.34 &&
        !(
          chosenSurface === SM.ICE &&
          (sample.climateBandField === CL.SUBPOLAR || sample.climateBandField === CL.POLAR) &&
          sample.elevation >= 0.28
        )
      ) {
        biomeCandidates.push({
          value: BT.TUNDRA,
          score: sample.freezePotential + (0.34 - sample.temperature),
          precedence: 7
        });
      }

      if (
        (sample.climateBandField === CL.EQUATORIAL || sample.climateBandField === CL.TROPICAL) &&
        sample.rainfall >= 0.30 &&
        sample.rainfall <= 0.66 &&
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
        sample.rainfall >= 0.22 &&
        sample.rainfall <= 0.46 &&
        sample.temperature >= 0.34 &&
        sample.temperature <= 0.66
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
      if (sample.oceanDepthField <= constants.oceanDepths.slope + 0.015) terrainClass = constants.terrainClasses.SHELF;
      else terrainClass = constants.terrainClasses.WATER;
    } else if (sample.surfaceMaterial === constants.surfaceMaterials.ICE) {
      terrainClass = constants.terrainClasses.POLAR_ICE;
    } else if (sample.biomeType === constants.biomeTypes.GLACIER || (sample.climateBandField === constants.climateLabels.POLAR && sample.elevation > 0.26)) {
      terrainClass = constants.terrainClasses.GLACIAL_HIGHLAND;
    } else if (sample.strongestSummitScore > 0.18 || sample.elevation > 0.56) {
      terrainClass = constants.terrainClasses.SUMMIT;
    } else if (sample.elevation > constants.topologyMountainThreshold || sample.ridgeStrength > 0.35) {
      terrainClass = constants.terrainClasses.MOUNTAIN;
    } else if (sample.canyonStrength > constants.topologyCanyonThreshold) {
      terrainClass = constants.terrainClasses.CANYON;
    } else if (sample.strongestBasinScore > 0.055 || sample.basinStrength > constants.topologyBasinThreshold) {
      terrainClass = constants.terrainClasses.BASIN;
    } else if (sample.plateauStrength > 0.42) {
      terrainClass = constants.terrainClasses.PLATEAU;
    } else if (sample.ridgeStrength > 0.18) {
      terrainClass = constants.terrainClasses.RIDGE;
    } else if (sample.shoreline) {
      terrainClass = sample.beachCandidate ? constants.terrainClasses.BEACH : constants.terrainClasses.SHORELINE;
    } else if (sample.elevation > 0.12) {
      terrainClass = constants.terrainClasses.FOOTHILL;
    }

    const eventFlags = [];
    if (sample.riverCandidate) eventFlags.push("RIVER_CANDIDATE");
    if (sample.lakeCandidate) eventFlags.push("LAKE_CANDIDATE");
    if (sample.cavePotential >= constants.topologyCaveThreshold) eventFlags.push("CAVE_CANDIDATE");
    if (sample.shoreline) eventFlags.push("SHORELINE");
    if (sample.biomeType === constants.biomeTypes.GLACIER) eventFlags.push("GLACIER");
    if (sample.biomeType === constants.biomeTypes.WETLAND) eventFlags.push("WETLAND");

    return {
      ...sample,
      terrainClass,
      eventFlags
    };
  }));
}

function buildSummary(grid) {
  const summary = {
    sampleCount: 0,
    landCount: 0,
    waterCount: 0,
    shorelineCount: 0,
    mountainCount: 0,
    basinCount: 0,
    canyonCount: 0,
    caveCandidateCount: 0,
    temperatureAverage: 0,
    rainfallAverage: 0,
    runoffAverage: 0,
    magneticAverage: 0,
    auroralAverage: 0,
    diamondAverage: 0,
    opalAverage: 0,
    sedimentAverage: 0
  };

  let temperatureTotal = 0;
  let rainfallTotal = 0;
  let runoffTotal = 0;
  let magneticTotal = 0;
  let auroralTotal = 0;
  let diamondTotal = 0;
  let opalTotal = 0;
  let sedimentTotal = 0;

  for (const row of grid) {
    for (const sample of row) {
      summary.sampleCount += 1;
      if (sample.landMask === 1) summary.landCount += 1;
      else summary.waterCount += 1;
      if (sample.shoreline) summary.shorelineCount += 1;

      if (
        sample.terrainClass === "MOUNTAIN" ||
        sample.terrainClass === "SUMMIT" ||
        sample.terrainClass === "GLACIAL_HIGHLAND"
      ) {
        summary.mountainCount += 1;
      }
      if (sample.terrainClass === "BASIN") summary.basinCount += 1;
      if (sample.terrainClass === "CANYON") summary.canyonCount += 1;
      if (sample.cavePotential > 0.5) summary.caveCandidateCount += 1;

      temperatureTotal += sample.temperature;
      rainfallTotal += sample.rainfall;
      runoffTotal += sample.runoff;
      magneticTotal += sample.magneticIntensity;
      auroralTotal += sample.auroralPotential;
      diamondTotal += sample.diamondDensity;
      opalTotal += sample.opalDensity;
      sedimentTotal += sample.sedimentLoad;
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
    ocean_depth_realization: true,
    climate_bands: true,
    topology_fields: true,
    thermodynamics: true,
    hydrology: true,
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
          delete finalized.harborBridgeSupport;
          delete finalized.oceanCarveTotal;
          delete finalized._surfaceCandidates;
          delete finalized._surfaceChosen;
          delete finalized._biomeChosen;

          return Object.freeze(finalized);
        })
      )
    )
  );
}

function buildPlanetFieldFromAuthoredWorld(constants) {
  const stage0 = stageBaseSampleGrid(constants);
  const stage1 = stageMacroContinentField(stage0, constants);
  const stage2 = stageLandWaterClassification(stage1, constants);
  const stage3 = stageContinentLabels(stage2, constants);
  const stage4 = stageSummitRealization(stage3, constants);
  const stage5 = stageBasinRealization(stage4, constants);
  const stage6 = stageOceanDepthRealization(stage5, constants);
  const stage7 = stageClimateBands(stage6, constants);
  const stage8 = stageTopologyFields(stage7, constants);
  const stage9 = stageThermodynamics(stage8, constants);
  const stage10 = stageHydrology(stage9, constants);
  const stage11 = stageMagnetics(stage10, constants);
  const stage12 = stageMaterials(stage11);
  const stage13 = stageSediment(stage12);
  const stage14 = stageSurfaceBiomeThresholdBands(stage13, constants);
  const stage15 = stageSurfaceBiomePrecedenceTiebreak(stage14, constants);
  const stage16 = stageSurfaceBiomeSamplingUnitAssignment(stage15, constants);
  const stage17 = stageFinalTerrainClass(stage16, constants);

  const samples = finalizeSamples(stage17);
  const summary = buildSummary(samples);
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

  function buildPlanetField(_inputState = {}) {
    return buildPlanetFieldFromAuthoredWorld(constants);
  }

  return Object.freeze({
    buildPlanetField
  });
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export function buildPlanetField(inputState = {}) {
  return DEFAULT_PLANET_ENGINE.buildPlanetField(inputState);
}
