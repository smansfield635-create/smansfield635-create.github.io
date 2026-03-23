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
  return (hashNoise(seed, a, b, 0) * 2) - 1;
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

    contourSeedA: toNumber(kc.contourSeedA, 1109),
    contourSeedB: toNumber(kc.contourSeedB, 2713),
    contourSeedC: toNumber(kc.contourSeedC, 4079),

    defaultWorldVariant: clamp(Math.round(toNumber(kc.defaultWorldVariant, 9)), 1, 9),

    equatorialMaxAbsLat: toNumber(kc.equatorialMaxAbsLat, 15),
    tropicalMaxAbsLat: toNumber(kc.tropicalMaxAbsLat, 30),
    temperateMaxAbsLat: toNumber(kc.temperateMaxAbsLat, 55),
    subpolarMaxAbsLat: toNumber(kc.subpolarMaxAbsLat, 70),

    thermalBaseline: toNumber(kc.thermalBaseline, 0.64),
    magneticBaseline: toNumber(kc.magneticBaseline, 0.22),
    hydrologyRunoffStrength: toNumber(kc.hydrologyRunoffStrength, 0.52),

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
        macroContinentId: "C1",
        regionRank: 1,
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
        macroContinentId: "C1",
        regionRank: 2,
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
        macroContinentId: "C1",
        regionRank: 3,
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
        macroContinentId: "C2",
        regionRank: 4,
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
        macroContinentId: "C2",
        regionRank: 5,
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
        macroContinentId: "C2",
        regionRank: 6,
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
        macroContinentId: "C3",
        regionRank: 7,
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
        macroContinentId: "C3",
        regionRank: 8,
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
        macroContinentId: "C3",
        regionRank: 9,
        thermalBias: -0.14,
        moistureBias: -0.02,
        upliftBias: 0.18
      })
    ]),

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
    })
  });
}

function resolveWorldVariant(inputState, constants) {
  const root = normalizeObject(inputState);
  const worldVariantState =
    normalizeObject(root.worldVariantState).activeVariant ?
      normalizeObject(root.worldVariantState) :
      normalizeObject(normalizeObject(root.worldModeState).variantState);

  const requested = Math.round(toNumber(worldVariantState.activeVariant, constants.defaultWorldVariant));
  const variant = clamp(requested, 1, 9);
  const compositionScale =
    isFiniteNumber(worldVariantState.compositionScale) ?
      clamp(worldVariantState.compositionScale, 0, 1) :
      clamp(variant / 9, 0, 1);

  return Object.freeze({
    activeVariant: variant,
    compositionScale,
    baseScale: clamp(1 - compositionScale, 0, 1),
    ratio: `${variant}:${Math.max(1, 10 - variant)}`
  });
}

function mapContinentClass(continentMass) {
  switch (continentMass) {
    case "HARBOR_CONTINENT":
    case "GRATITUDE_CONTINENT":
    case "GENEROSITY_CONTINENT":
      return "C1";
    case "DEPENDABILITY_CONTINENT":
    case "ACCOUNTABILITY_CONTINENT":
    case "HUMILITY_CONTINENT":
      return "C2";
    case "FORGIVENESS_CONTINENT":
    case "SELF_CONTROL_CONTINENT":
    case "PURITY_CONTINENT":
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

function continentInfluence(latDeg, lonDeg, anchor) {
  const { xr, yr } = rotatedLocalDegrees(latDeg, lonDeg, anchor);
  const dx = xr / Math.max(1e-9, anchor.baseRadiusDeg * anchor.anisotropyX);
  const dy = yr / Math.max(1e-9, anchor.baseRadiusDeg * anchor.anisotropyY);
  const d = Math.sqrt((dx * dx) + (dy * dy));
  if (d >= 1) return 0;
  return anchor.dominanceWeight * Math.max(0, 1 - Math.pow(d, 1.48));
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
    seedSignature: "AUTHORED_NINE_SUMMITS_WORLD_v7_UNDEREXPRESSED",
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
    continentId: "NONE",
    continentClass: "OCEAN",
    macroContinentId: "OCEAN",
    regionId: "NONE",
    regionRank: 0,
    countryId: "NONE",
    countryQuadrant: "NONE",
    countryVariation: 0,

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

    compositionVariant: 9,
    compositionScale: 1,
    baseScale: 0,
    regionalPurityWeight: 0,
    continentMacroWeight: 0,
    preciousWeight: 0,
    baseWeight: 0,
    compositionWeight: 0,
    preciousToBaseRatio: 0,
    compositionClass: "BASE_DOMINANT",
    waterPurityWeight: 0,
    mineralReflectanceWeight: 0,
    sedimentTintWeight: 0,

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
    Array.from({ length: constants.width }, (_, x) =>
      createBaseSample(x, y, coordinates.latAt(y), coordinates.lonAt(x))
    )
  );
}

function stageMacroField(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const anchorScores = Object.create(null);
    let bestId = "NONE";
    let bestScore = 0;
    let total = 0;

    for (const anchor of constants.anchors) {
      const score = continentInfluence(sample.latDeg, sample.lonDeg, anchor);
      anchorScores[anchor.id] = score;
      total += score;
      if (score > bestScore) {
        bestScore = score;
        bestId = anchor.id;
      }
    }

    const nA = sampleSignedNoise(constants.contourSeedA, sample.latDeg, sample.lonDeg, 9.5, 13.5);
    const nB = sampleSignedNoise(constants.contourSeedB, sample.latDeg, sample.lonDeg, 18, 23);
    const nC = sampleSignedNoise(constants.contourSeedC, sample.latDeg, sample.lonDeg, 36, 44);
    const contourNoise = (0.55 * nA) + (0.30 * nB) + (0.15 * nC);

    const macroLandScore = Math.max(0, total);
    const finalLandScore = macroLandScore + contourNoise * 0.08;

    return {
      ...sample,
      anchorScores,
      macroLandScore,
      finalLandScore,
      supercontinentCore: bestScore,
      supercontinentAffinity: bestId
    };
  }));
}

function stageLandWater(grid, constants) {
  let low = 0;
  let high = 1;
  let threshold = 0.12;

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

  return grid.map((row) => row.map((sample) => ({
    ...sample,
    landMask: sample.finalLandScore >= threshold ? 1 : 0,
    waterMask: sample.finalLandScore >= threshold ? 0 : 1
  })));
}

function stageRegionLabels(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    if (sample.landMask !== 1) return sample;

    let bestRegion = "HARBOR_CONTINENT";
    let bestScore = -1;
    for (const anchor of constants.anchors) {
      const score = sample.anchorScores?.[anchor.id] ?? 0;
      if (score > bestScore) {
        bestScore = score;
        bestRegion = anchor.id;
      }
    }

    const anchor = constants.anchors.find((item) => item.id === bestRegion) ?? null;

    return {
      ...sample,
      continentMass: bestRegion,
      macroRegion: bestRegion,
      subRegion: bestRegion,
      continentId: bestRegion,
      continentClass: mapContinentClass(bestRegion),
      macroContinentId: anchor?.macroContinentId ?? "OCEAN",
      regionId: bestRegion,
      regionRank: anchor?.regionRank ?? 0,
      countryId: `${bestRegion}_CORE`,
      countryQuadrant: "CORE",
      countryVariation: 0
    };
  }));
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
      const next = [
        [x, y - 1],
        [getWrappedX(x + 1, width), y],
        [x, y + 1],
        [getWrappedX(x - 1, width), y]
      ];

      for (let i = 0; i < next.length; i += 1) {
        const nx = next[i][0];
        const ny = next[i][1];
        if (ny < 0 || ny >= height) continue;
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

function stageRelief(grid, constants) {
  const distances = computeDistanceFields(grid);
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  return grid.map((row, y) => row.map((sample, x) => {
    const left = getGridCell(grid, x - 1, y);
    const right = getGridCell(grid, x + 1, y);
    const up = getGridCell(grid, x, y - 1);
    const down = getGridCell(grid, x, y + 1);

    const latWave = sampleSignedNoise(constants.contourSeedA + 701, sample.latDeg, sample.lonDeg, 7.2, 9.4);
    const lonWave = sampleSignedNoise(constants.contourSeedB + 911, sample.latDeg, sample.lonDeg, 15.4, 18.8);
    const macroBoost = clamp(sample.macroLandScore * 0.18, 0, 0.22);
    const upliftBias =
      constants.anchors.find((item) => item.id === sample.continentMass)?.upliftBias ?? 0;

    let elevation = 0;
    if (sample.landMask === 1) {
      elevation = clamp(
        0.06 +
        macroBoost +
        upliftBias * 0.42 +
        Math.max(latWave, -0.25) * 0.08 +
        Math.max(lonWave, -0.25) * 0.06,
        0.01,
        0.84
      );
    } else {
      const oceanDepth = clamp(0.04 + (1 - clamp(sample.finalLandScore * 2.2, 0, 1)) * 0.28, 0.04, 0.36);
      elevation = -oceanDepth;
    }

    const lx = right ? right.finalLandScore : sample.finalLandScore;
    const rx = left ? left.finalLandScore : sample.finalLandScore;
    const uy = up ? up.finalLandScore : sample.finalLandScore;
    const dy = down ? down.finalLandScore : sample.finalLandScore;

    const dx = lx - rx;
    const dyv = dy - uy;
    const slope = clamp(Math.sqrt((dx * dx) + (dyv * dyv)) * 1.7 + Math.abs(latWave - lonWave) * 0.12, 0, 1);

    const meanNeighbor =
      ((left?.finalLandScore ?? sample.finalLandScore) +
      (right?.finalLandScore ?? sample.finalLandScore) +
      (up?.finalLandScore ?? sample.finalLandScore) +
      (down?.finalLandScore ?? sample.finalLandScore)) / 4;

    const curvature = clamp((sample.finalLandScore - meanNeighbor) * 3.0, -1, 1);
    const ridgeStrength = clamp(curvature > 0 ? curvature : 0, 0, 1);
    const basinStrength = clamp(curvature < 0 ? -curvature : 0, 0, 1);
    const divideStrength = clamp(Math.abs(dx - dyv) * 1.8, 0, 1);
    const plateauStrength = clamp(sample.landMask === 1 ? (1 - slope) * clamp(elevation * 1.6, 0, 1) : 0, 0, 1);
    const canyonStrength = clamp(sample.landMask === 1 ? basinStrength * slope * 1.18 : 0, 0, 1);
    const cavePotential = clamp(basinStrength * 0.40 + canyonStrength * 0.24 + plateauStrength * 0.10, 0, 1);

    const distanceToWater = Number.isFinite(distances.distanceToWater[y][x]) ? distances.distanceToWater[y][x] : -1;
    const distanceToLand = Number.isFinite(distances.distanceToLand[y][x]) ? distances.distanceToLand[y][x] : -1;
    const shoreline = sample.landMask === 1 && distanceToWater <= 1;
    const shorelineBand = distanceToWater <= 2 || distanceToLand <= 2;
    const beachCandidate = sample.landMask === 1 && shorelineBand && slope <= 0.11;

    return {
      ...sample,
      seaLevel: constants.seaLevel,
      baseElevation: elevation,
      elevation,
      waterDepth: sample.waterMask === 1 ? Math.abs(elevation) : 0,
      oceanDepthField: sample.waterMask === 1 ? elevation : 0,
      slope,
      curvature,
      ridgeStrength,
      basinStrength,
      divideStrength,
      plateauStrength,
      canyonStrength,
      cavePotential,
      distanceToWater,
      distanceToLand,
      shoreline,
      shorelineBand,
      beachCandidate
    };
  }));
}

function stageClimate(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const absLat = Math.abs(sample.latDeg);
    let climateBandField = "POLAR";
    if (absLat < constants.equatorialMaxAbsLat) climateBandField = "EQUATORIAL";
    else if (absLat < constants.tropicalMaxAbsLat) climateBandField = "TROPICAL";
    else if (absLat < constants.temperateMaxAbsLat) climateBandField = "TEMPERATE";
    else if (absLat < constants.subpolarMaxAbsLat) climateBandField = "SUBPOLAR";

    const anchor = constants.anchors.find((item) => item.id === sample.continentMass) ?? null;
    const latNorm = clamp(absLat / 90, 0, 1);
    const polarCooling = Math.pow(latNorm, 1.32) * 0.55;
    const altitudeCooling = clamp(Math.max(sample.elevation, 0) * 0.36, 0, 0.34);

    const temperature = clamp(
      constants.thermalBaseline +
      (anchor?.thermalBias ?? 0) +
      (sample.shoreline ? 0.05 : 0) -
      polarCooling -
      altitudeCooling -
      clamp(sample.ridgeStrength * 0.10, 0, 0.10),
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
      climateBandField,
      temperature,
      thermalGradient: clamp(polarCooling + altitudeCooling + sample.slope * 0.14, 0, 1),
      freezePotential,
      meltPotential,
      evaporationPressure,
      altitudeCooling
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

    const anchor = constants.anchors.find((item) => item.id === sample.continentMass) ?? null;
    const maritimeInfluence = clamp(sample.distanceToWater < 0 ? 0 : 1 - (sample.distanceToWater / 24), 0, 1);
    const continentality = clamp(1 - maritimeInfluence, 0, 1);
    const rainShadowStrength = clamp(
      sample.ridgeStrength * 0.26 +
      sample.divideStrength * 0.14 +
      Math.max(sample.distanceToWater - 5, 0) / 32,
      0,
      1
    );

    const rainfall = clamp(
      0.14 +
      sample.evaporationPressure * 0.30 +
      sample.basinStrength * 0.18 +
      maritimeInfluence * 0.28 +
      (anchor?.moistureBias ?? 0) -
      rainShadowStrength * 0.20 +
      (sample.climateBandField === "EQUATORIAL" ? 0.10 : 0),
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
      sample.basinStrength * 0.60 +
      rainfall * 0.22 +
      (sample.waterMask === 1 ? 0.2 : 0),
      0,
      1
    );

    return {
      ...sample,
      rainfall,
      runoff,
      basinAccumulation,
      drainage: determineDrainage(sample, left, right, up, down),
      riverCandidate: sample.landMask === 1 && runoff >= 0.48 && sample.distanceToWater > 1 && sample.slope >= 0.05,
      lakeCandidate: sample.landMask === 1 && basinAccumulation >= 0.50 && sample.slope <= 0.16,
      continentality,
      maritimeInfluence,
      rainShadowStrength
    };
  }));
}

function stageSeason(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    const latAbsNorm = clamp(Math.abs(sample.latDeg) / 90, 0, 1);
    const hemispherePhase = sample.latDeg >= 0 ? 0.18 : 0.68;
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

    let hemisphereSeason = "SPRING";
    if (wrappedPhase >= 0.25 && wrappedPhase < 0.50) hemisphereSeason = "SUMMER";
    else if (wrappedPhase >= 0.50 && wrappedPhase < 0.75) hemisphereSeason = "AUTUMN";
    else if (wrappedPhase >= 0.75 || wrappedPhase < 0.0) hemisphereSeason = "WINTER";

    let seasonalBiomePhase = hemisphereSeason;
    if (sample.waterMask === 1) seasonalBiomePhase = "MARINE";
    else if (sample.freezePotential >= 0.80) seasonalBiomePhase = "WINTER";

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
    const mountainAmplifier = clamp(Math.max(0, sample.elevation) * 0.20 + sample.ridgeStrength * 0.10, 0, 0.22);

    const magneticIntensity = clamp(constants.magneticBaseline + polarBias * 0.5 + mountainAmplifier, 0, 1);
    const shieldingGradient = clamp(0.25 + magneticIntensity * 0.68, 0, 1);
    const auroralPotential = clamp(Math.pow(polarBias, 1.6) * 0.82 + (sample.climateBandField === "POLAR" ? 0.08 : 0), 0, 1);

    return {
      ...sample,
      magneticIntensity,
      shieldingGradient,
      auroralPotential,
      navigationBias: sample.latDeg > 12 ? "N" : sample.latDeg < -12 ? "S" : sample.lonDeg >= 0 ? "E" : "W",
      navigationStability: clamp(0.35 + magneticIntensity * 0.5 - sample.canyonStrength * 0.15 - sample.freezePotential * 0.08, 0, 1),
      gravityConstraint: clamp(1 - (sample.slope * 0.18 + sample.canyonStrength * 0.24), 0.55, 1)
    };
  }));
}

function stageMaterials(grid, worldVariant) {
  return grid.map((row) => row.map((sample) => {
    const highlandBias = clamp(Math.max(0, sample.elevation) * 0.66 + sample.ridgeStrength * 0.20, 0, 1);
    const basinBias = clamp(sample.basinStrength * 0.9, 0, 1);
    const coastalBias = sample.shorelineBand ? 0.12 : 0;
    const polarBias = clamp((Math.abs(sample.latDeg) / 90) * 0.22 + (sample.climateBandField === "POLAR" ? 0.08 : 0), 0, 0.3);

    const regionalPurityWeight = clamp(sample.regionRank / 9, 0, 1);
    const continentMacroWeight =
      sample.macroContinentId === "C1" ? 0.25 :
      sample.macroContinentId === "C2" ? 0.50 :
      sample.macroContinentId === "C3" ? 0.75 : 0.40;

    const compositionWeight = clamp(
      continentMacroWeight * 0.35 +
      regionalPurityWeight * 0.55 +
      (worldVariant.compositionScale - 0.5) * 0.35,
      0,
      1
    );

    const preciousWeight = compositionWeight;
    const baseWeight = clamp(1 - compositionWeight, 0, 1);

    const diamondDensity = clamp(0.18 + highlandBias * 0.24 + preciousWeight * 0.42 + regionalPurityWeight * 0.14, 0, 1);
    const opalDensity = clamp(0.28 + (1 - Math.abs(sample.latDeg) / 90) * 0.18 + coastalBias * 0.28 + preciousWeight * 0.14 - polarBias * 0.14, 0, 1);
    const graniteDensity = clamp(0.22 + (1 - highlandBias) * 0.16 + baseWeight * 0.36, 0, 1);
    const marbleDensity = clamp(0.08 + basinBias * 0.26 + preciousWeight * 0.10, 0, 1);
    const metalDensity = clamp(0.03 + highlandBias * 0.10 + sample.canyonStrength * 0.18 + preciousWeight * 0.18, 0, 1);

    const preciousEnvelope = clamp(diamondDensity + opalDensity + metalDensity, 0, 3);
    const baseEnvelope = clamp(graniteDensity + marbleDensity, 0.000001, 2);
    const preciousToBaseRatio = preciousEnvelope / baseEnvelope;

    return {
      ...sample,
      compositionVariant: worldVariant.activeVariant,
      compositionScale: worldVariant.compositionScale,
      baseScale: worldVariant.baseScale,
      regionalPurityWeight,
      continentMacroWeight,
      preciousWeight,
      baseWeight,
      compositionWeight,
      preciousToBaseRatio,
      compositionClass:
        compositionWeight < 0.30 ? "BASE_DOMINANT" :
        compositionWeight < 0.55 ? "BALANCED" :
        compositionWeight < 0.80 ? "PRECIOUS_DOMINANT" :
        "PURITY_DOMINANT",
      waterPurityWeight: sample.waterMask === 1 ? clamp(preciousWeight * 0.8, 0, 1) : 0,
      mineralReflectanceWeight: sample.waterMask === 1 ? clamp(preciousWeight * 0.7 + coastalBias * 0.4, 0, 1) : 0,
      sedimentTintWeight: sample.waterMask === 1 ? clamp(baseWeight * 0.6 + coastalBias * 0.4, 0, 1) : 0,
      materialType:
        diamondDensity >= opalDensity && diamondDensity >= graniteDensity ? "diamond" :
        opalDensity >= graniteDensity ? "opal" : "granite",
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
    const transportPotential = clamp(sample.runoff * 0.45 + sample.slope * 0.3 + sample.meltPotential * 0.15, 0, 1);
    const depositionPotential = clamp(sample.basinAccumulation * 0.5 + (1 - sample.slope) * 0.22 + sample.freezePotential * 0.08 + (sample.shorelineBand ? 0.2 : 0), 0, 1);

    return {
      ...sample,
      sedimentType:
        sample.waterMask === 1 ? (sample.compositionWeight >= 0.7 ? "luminous_marine_sediment" : "marine_sediment") :
        sample.diamondDensity > 0.58 && depositionPotential > 0.45 ? "diamond_sand" :
        sample.opalDensity > 0.5 && transportPotential > 0.35 ? "opal_dust" :
        sample.graniteDensity > 0.42 ? "stone_sediment" :
        "mixed",
      sedimentLoad: clamp(transportPotential * 0.62 + depositionPotential * 0.28 + sample.metalDensity * 0.08, 0, 1),
      transportPotential,
      depositionPotential
    };
  }));
}

function stageMinimalSemanticBridge(grid, constants) {
  return grid.map((row) => row.map((sample) => {
    let terrainClass = constants.terrainClasses.LOWLAND;
    let surfaceMaterial = constants.surfaceMaterials.SOIL;
    let biomeType = constants.biomeTypes.TEMPERATE_GRASSLAND;

    if (sample.waterMask === 1) {
      terrainClass = sample.waterDepth <= 0.08 ? constants.terrainClasses.SHELF : constants.terrainClasses.WATER;
      surfaceMaterial = constants.surfaceMaterials.NONE;
      biomeType = constants.biomeTypes.NONE;
    } else {
      if (sample.freezePotential >= 0.88 && sample.temperature <= 0.22 && sample.elevation >= 0.26) {
        surfaceMaterial = constants.surfaceMaterials.ICE;
        biomeType = constants.biomeTypes.GLACIER;
        terrainClass = constants.terrainClasses.POLAR_ICE;
      } else if (sample.freezePotential >= 0.68 && sample.elevation >= 0.20) {
        surfaceMaterial = constants.surfaceMaterials.SNOW;
        biomeType = constants.biomeTypes.TUNDRA;
      } else if (sample.shorelineBand && sample.slope <= 0.18) {
        surfaceMaterial = constants.surfaceMaterials.SAND;
      } else if (sample.basinAccumulation >= 0.64 && sample.depositionPotential >= 0.60 && sample.slope <= 0.10) {
        surfaceMaterial = constants.surfaceMaterials.CLAY;
      } else if (sample.transportPotential >= 0.56 && sample.runoff >= 0.46 && sample.slope >= 0.16) {
        surfaceMaterial = constants.surfaceMaterials.GRAVEL;
      } else if (sample.slope >= 0.48 || sample.ridgeStrength >= 0.42) {
        surfaceMaterial = constants.surfaceMaterials.BEDROCK;
      } else {
        surfaceMaterial = constants.surfaceMaterials.SOIL;
      }

      if (sample.freezePotential >= 0.80 && sample.elevation >= 0.24) {
        biomeType = constants.biomeTypes.GLACIER;
      } else if (sample.basinAccumulation >= 0.60 && sample.runoff >= 0.36 && sample.slope <= 0.10) {
        biomeType = constants.biomeTypes.WETLAND;
      } else if (sample.rainfall <= 0.16 && sample.evaporationPressure >= 0.72) {
        biomeType = constants.biomeTypes.DESERT;
      } else if (sample.climateBandField === "EQUATORIAL" && sample.rainfall >= 0.68 && sample.temperature >= 0.58) {
        biomeType = constants.biomeTypes.TROPICAL_RAINFOREST;
      } else if (sample.climateBandField === "SUBPOLAR" && sample.rainfall >= 0.30 && sample.temperature <= 0.42) {
        biomeType = constants.biomeTypes.BOREAL_FOREST;
      } else if (sample.climateBandField === "TEMPERATE" && sample.rainfall >= 0.46) {
        biomeType = constants.biomeTypes.TEMPERATE_FOREST;
      } else if (sample.climateBandField === "TROPICAL" && sample.temperature >= 0.52) {
        biomeType = constants.biomeTypes.TROPICAL_GRASSLAND;
      } else if (sample.climateBandField === "POLAR" || sample.climateBandField === "SUBPOLAR") {
        biomeType = constants.biomeTypes.TUNDRA;
      }

      if (sample.strongestSummitScore > 0.24 || sample.elevation > 0.58) {
        terrainClass = constants.terrainClasses.SUMMIT;
      } else if (sample.elevation > 0.40 || sample.ridgeStrength > 0.30) {
        terrainClass = constants.terrainClasses.MOUNTAIN;
      } else if (sample.canyonStrength > 0.30 && sample.slope > 0.18) {
        terrainClass = constants.terrainClasses.CANYON;
      } else if (sample.basinStrength > 0.22 && sample.slope <= 0.24) {
        terrainClass = constants.terrainClasses.BASIN;
      } else if (sample.plateauStrength > 0.50 && sample.elevation > 0.16) {
        terrainClass = constants.terrainClasses.PLATEAU;
      } else if (sample.ridgeStrength > 0.14 && sample.elevation > 0.12) {
        terrainClass = constants.terrainClasses.RIDGE;
      } else if (sample.beachCandidate) {
        terrainClass = constants.terrainClasses.BEACH;
      } else if (sample.shoreline) {
        terrainClass = constants.terrainClasses.SHORELINE;
      } else if (sample.elevation > 0.10) {
        terrainClass = constants.terrainClasses.FOOTHILL;
      }
    }

    return {
      ...sample,
      terrainClass,
      surfaceMaterial,
      biomeType,
      rangeId: null,
      backboneStrength: sample.ridgeStrength,
      valleyId: null,
      canyonId: null,
      creviceId: null,
      basinId: null,
      plateauId: null,
      plateauRole: "NONE",
      flowClass:
        sample.waterMask === 1 ? "OCEAN" :
        sample.lakeCandidate ? "LAKE" :
        sample.riverCandidate ? "RIVER" :
        "NONE",
      flowDirection: sample.drainage === "none" ? "NONE" : sample.drainage.toUpperCase(),
      eventFlags: Object.freeze([])
    };
  }));
}

function buildSummary(grid, worldVariant) {
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
    topologyCoordinationDiagnostics: null,
    compositionSummary: null,
    regionalCompositionSummary: Object.freeze([])
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
  let preciousWeightTotal = 0;
  let baseWeightTotal = 0;
  let preciousDominantSampleCount = 0;
  let purityDominantSampleCount = 0;
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
      if (sample.terrainClass === "MOUNTAIN" || sample.terrainClass === "SUMMIT" || sample.terrainClass === "GLACIAL_HIGHLAND") {
        summary.mountainCount += 1;
        if (sample.continentMass !== "NONE") mountainRegionSet.add(sample.continentMass);
      }
      if (sample.terrainClass === "BASIN") {
        summary.basinCount += 1;
        if (sample.continentMass !== "NONE") basinRegionSet.add(sample.continentMass);
      }
      if (sample.terrainClass === "CANYON") summary.canyonCount += 1;
      if (sample.cavePotential > 0.5) summary.caveCandidateCount += 1;
      if (sample.biomeType === "GLACIER" || sample.terrainClass === "POLAR_ICE") summary.glacialRegionCount += 1;

      if (sample.landMask === 1) {
        if (sample.seasonalBiomePhase === "WINTER") summary.seasonCoverage.WINTER = true;
        if (sample.seasonalBiomePhase === "SPRING") summary.seasonCoverage.SPRING = true;
        if (sample.seasonalBiomePhase === "SUMMER") summary.seasonCoverage.SUMMER = true;
        if (sample.seasonalBiomePhase === "AUTUMN") summary.seasonCoverage.AUTUMN = true;
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
      preciousWeightTotal += sample.preciousWeight;
      baseWeightTotal += sample.baseWeight;

      if (sample.compositionClass === "PRECIOUS_DOMINANT") preciousDominantSampleCount += 1;
      if (sample.compositionClass === "PURITY_DOMINANT") purityDominantSampleCount += 1;

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

  summary.compositionSummary = Object.freeze({
    activeVariant: worldVariant.activeVariant,
    compositionScale: worldVariant.compositionScale,
    baseScale: worldVariant.baseScale,
    averagePreciousWeight: preciousWeightTotal / count,
    averageBaseWeight: baseWeightTotal / count,
    purityRegionStrength: 0,
    lowestRegionStrength: 0,
    preciousDominantSampleCount,
    purityDominantSampleCount
  });

  return Object.freeze(summary);
}

function buildCompleteness() {
  return Object.freeze({
    base_sample_grid: true,
    macro_continent_field: true,
    land_water_classification: true,
    continent_labels: true,
    region_country_mapping: true,
    summit_realization: false,
    basin_realization: false,
    elevation_redistribution: false,
    ocean_depth_realization: true,
    climate_bands: true,
    topology_fields: true,
    land_topology_coordination: false,
    thermodynamics: true,
    hydrology: true,
    seasonal_field: true,
    magnetics: true,
    materials: true,
    composition_field: true,
    regional_purity_gradient: true,
    variant_material_weighting: true,
    precious_base_ratio: true,
    sediment: true,
    surface_biome_threshold_bands: false,
    surface_biome_precedence_tiebreak: false,
    surface_biome_sampling_unit_assignment: false,
    final_terrain_class: true,
    composition_summary: true,
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
          return Object.freeze(finalized);
        })
      )
    )
  );
}

function buildPlanetFieldInternal(constants, inputState = {}) {
  const worldVariant = resolveWorldVariant(inputState, constants);

  const stage0 = stageBaseSampleGrid(constants);
  const stage1 = stageMacroField(stage0, constants);
  const stage2 = stageLandWater(stage1, constants);
  const stage3 = stageRegionLabels(stage2, constants);
  const stage4 = stageRelief(stage3, constants);
  const stage5 = stageClimate(stage4, constants);
  const stage6 = stageHydrology(stage5, constants);
  const stage7 = stageSeason(stage6, constants);
  const stage8 = stageMagnetics(stage7, constants);
  const stage9 = stageMaterials(stage8, worldVariant);
  const stage10 = stageSediment(stage9);
  const stage11 = stageMinimalSemanticBridge(stage10, constants);

  const samples = finalizeSamples(stage11);
  const summary = buildSummary(samples, worldVariant);
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

  function buildField(inputState = {}) {
    return buildPlanetFieldInternal(constants, inputState);
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
