// /world/planet_engine.js
// MODE: BASELINE RENEWAL
// STATUS: ENGINE-ONLY | FRAME-CAPABLE | NON-DRIFT
// OWNER: SEAN

import { WORLD_KERNEL, resolveNode } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function degToRad(value) {
  return (value * Math.PI) / 180;
}

function signedAngularDeltaDeg(a, b) {
  let delta = a - b;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

function hash2(a, b, c = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453123;
  return fract(x);
}

function noise2(a, b, c = 0) {
  return hash2(a, b, c) * 2 - 1;
}

function octaveNoise(a, b, octaves, persistence, seed = 0) {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += noise2(a * frequency, b * frequency, seed + i * 17.3) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return maxAmplitude > 0 ? total / maxAmplitude : 0;
}

function rotate2(x, y, rotationDeg) {
  const radians = degToRad(rotationDeg);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function buildTimeState(timeState = {}) {
  const source = normalizeObject(timeState);
  const elapsedSeconds =
    typeof source.elapsedSeconds === "number" && Number.isFinite(source.elapsedSeconds)
      ? Math.max(0, source.elapsedSeconds)
      : 0;

  return Object.freeze({
    elapsedSeconds,
    dayPhase: ((elapsedSeconds * 0.02) % 1 + 1) % 1,
    seasonPhase: ((elapsedSeconds * 0.0025) % 1 + 1) % 1,
    stormPhase: ((elapsedSeconds * 0.01) % 1 + 1) % 1
  });
}

function continentDistance(latDeg, lonDeg, profile) {
  const dLat = (latDeg - profile.seedLat) / 52;
  const dLon = signedAngularDeltaDeg(lonDeg, profile.seedLon) / 78;
  const rotated = rotate2(dLon, dLat, profile.rotationDeg);

  const seamWarp =
    octaveNoise(latDeg * 0.055 + profile.tier, lonDeg * 0.055 - profile.tier, 3, 0.55, 11.2) * 0.12 +
    octaveNoise(latDeg * 0.11 - profile.tier, lonDeg * 0.09 + profile.tier, 2, 0.50, 19.4) * 0.06;

  const x = rotated.x / profile.axisX;
  const y = rotated.y / profile.axisY;
  const radial = Math.sqrt(x * x + y * y);

  return radial + seamWarp;
}

function continentMaskStrength(latDeg, lonDeg, profile) {
  const distance = continentDistance(latDeg, lonDeg, profile);
  const tectonicBite =
    octaveNoise(latDeg * 0.07 + profile.tier * 0.3, lonDeg * 0.07 - profile.tier * 0.2, 4, 0.52, 29.8) * 0.11 +
    octaveNoise(latDeg * 0.16, lonDeg * 0.12, 2, 0.58, 9.7) * 0.04;

  const threshold = 1.02 - profile.sizeFactor * 0.08;
  const t = clamp((distance + tectonicBite - (threshold - 0.18)) / 0.36, 0, 1);
  return 1 - (t * t * (3 - 2 * t));
}

function findBestContinent(latDeg, lonDeg, continents) {
  let best = null;
  let second = null;

  for (const profile of continents) {
    const strength = continentMaskStrength(latDeg, lonDeg, profile);

    if (!best || strength > best.strength) {
      second = best;
      best = { profile, strength };
    } else if (!second || strength > second.strength) {
      second = { profile, strength };
    }
  }

  return { best, second };
}

function fractureStrength(latDeg, lonDeg, best, second) {
  const seamNoise = octaveNoise(latDeg * 0.14, lonDeg * 0.14, 3, 0.48, 41.1) * 0.08;
  const delta = Math.abs((best?.strength ?? 0) - (second?.strength ?? 0));
  return clamp(1 - delta * 2.6 + seamNoise, 0, 1);
}

function continentNormalizedCoordinates(latDeg, lonDeg, profile) {
  const dLat = (latDeg - profile.seedLat) / 36;
  const dLon = signedAngularDeltaDeg(lonDeg, profile.seedLon) / 54;
  const rotated = rotate2(dLon, dLat, profile.rotationDeg);

  return {
    u: clamp((rotated.x / (profile.axisX * 1.25) + 1) * 0.5, 0, 0.999999),
    v: clamp((rotated.y / (profile.axisY * 1.25) + 1) * 0.5, 0, 0.999999)
  };
}

function resolveCountryRegionState(localU, localV) {
  const countryX = clamp(Math.floor(localU * 2), 0, 1);
  const countryY = clamp(Math.floor(localV * 2), 0, 1);
  const countryIndex = countryY * 2 + countryX;

  const regionWithinCountryX = clamp(Math.floor((localU * 4) % 2), 0, 1);
  const regionWithinCountryY = clamp(Math.floor((localV * 4) % 2), 0, 1);
  const regionWithinCountry = regionWithinCountryY * 2 + regionWithinCountryX;

  const stateX = clamp(Math.floor(localU * 4), 0, 3);
  const stateY = clamp(Math.floor(localV * 4), 0, 3);
  const stateIndex = stateY * 4 + stateX;

  return {
    countryIndex,
    regionWithinCountry,
    stateIndex
  };
}

function resolveClimateBand(latDeg, elevation) {
  const absLat = Math.abs(latDeg);
  if (absLat >= 72 || elevation > 0.80) return "POLAR";
  if (absLat >= 58 || elevation > 0.68) return "SUBPOLAR";
  if (absLat >= 42) return "TEMPERATE";
  if (absLat >= 24) return "SUBTROPICAL";
  return "TROPICAL";
}

function deriveMoisture(latDeg, lonDeg, maritimeInfluence, elevation, profile) {
  const belt = Math.cos(degToRad(latDeg));
  const synoptic = octaveNoise(latDeg * 0.055 + profile.tier, lonDeg * 0.08 - profile.tier, 4, 0.53, 13.1);
  const rainShadow = octaveNoise(latDeg * 0.12 - profile.tier, lonDeg * 0.14 + profile.tier, 2, 0.58, 73.5);
  const value =
    0.34 +
    belt * 0.22 +
    maritimeInfluence * 0.20 +
    synoptic * 0.14 -
    clamp(elevation, 0, 1) * 0.22 -
    Math.max(rainShadow, 0) * 0.12;

  return clamp(value, 0, 1);
}

function deriveTemperature(latDeg, elevation, climateBandField) {
  const absLat = Math.abs(latDeg);
  let base = 1 - absLat / 90;
  base -= clamp(elevation, 0, 1) * 0.42;

  if (climateBandField === "POLAR") base -= 0.35;
  else if (climateBandField === "SUBPOLAR") base -= 0.20;
  else if (climateBandField === "TROPICAL") base += 0.08;

  return clamp(base, 0, 1);
}

function deriveBiome(temperature, rainfall, terrainClass) {
  if (terrainClass === "POLAR_ICE" || terrainClass === "GLACIAL_HIGHLAND") return "GLACIER";
  if (temperature < 0.18) return rainfall > 0.42 ? "TUNDRA" : "GLACIER";
  if (temperature < 0.34) return rainfall > 0.48 ? "BOREAL_FOREST" : "TUNDRA";
  if (temperature < 0.56) {
    if (rainfall > 0.64) return "TEMPERATE_FOREST";
    if (rainfall > 0.34) return "TEMPERATE_GRASSLAND";
    return "DESERT";
  }
  if (rainfall > 0.70) return "TROPICAL_RAINFOREST";
  if (rainfall > 0.42) return "TROPICAL_GRASSLAND";
  return "DESERT";
}

function deriveSurfaceMaterial(terrainClass, rainfall, freezePotential) {
  if (terrainClass === "POLAR_ICE" || terrainClass === "GLACIAL_HIGHLAND") return "ICE";
  if (terrainClass === "BEACH") return "SAND";
  if (terrainClass === "SHORELINE") return "SILT";
  if (terrainClass === "SUMMIT" || terrainClass === "RIDGE") return "BEDROCK";
  if (terrainClass === "CANYON") return "CLAY";
  if (terrainClass === "PLATEAU") return "GRAVEL";
  if (freezePotential > 0.82) return "SNOW";
  if (rainfall < 0.22) return "SAND";
  return "SOIL";
}

function terrainClassFromElevation(elevation, shoreline, freezePotential) {
  if (freezePotential > 0.86 && elevation > 0.22) return "POLAR_ICE";
  if (freezePotential > 0.74 && elevation > 0.62) return "GLACIAL_HIGHLAND";
  if (shoreline) return "SHORELINE";
  if (elevation > 0.92) return "SUMMIT";
  if (elevation > 0.76) return "MOUNTAIN";
  if (elevation > 0.58) return "RIDGE";
  if (elevation > 0.36) return "PLATEAU";
  if (elevation < 0.10) return "BASIN";
  if (elevation < 0.18) return "CANYON";
  return "LAND";
}

function buildContinentRelief(latDeg, lonDeg, profile, fracture) {
  const macro = octaveNoise(
    latDeg * (0.035 + profile.reliefFreq * 0.018),
    lonDeg * (0.035 + profile.reliefFreq * 0.014),
    4,
    0.52,
    profile.tier * 10.3
  );

  const ridge = octaveNoise(
    latDeg * (0.09 + profile.reliefFreq * 0.022),
    lonDeg * (0.11 + profile.ridgeAlignment * 0.030),
    3,
    0.48,
    80 + profile.tier * 7.1
  );

  const rough = octaveNoise(
    latDeg * (0.18 + profile.roughness * 0.08),
    lonDeg * (0.16 + profile.roughness * 0.07),
    2,
    0.45,
    140 + profile.tier * 5.7
  );

  const erosion = octaveNoise(
    latDeg * 0.07,
    lonDeg * 0.07,
    3,
    0.50,
    220 + profile.tier * 3.2
  ) * (1 - profile.erosionStrength * 0.5);

  const relief =
    macro * 0.52 +
    ridge * (0.18 + profile.ridgeAlignment * 0.22) +
    rough * (0.08 + profile.roughness * 0.10) +
    fracture * profile.valleyDepth * 0.10 -
    erosion * profile.erosionStrength * 0.18;

  return clamp(relief * profile.reliefAmp, -1, 1);
}

function deriveElevation(latDeg, lonDeg, best, second) {
  const profile = best.profile;
  const landStrength = best.strength;
  const seam = fractureStrength(latDeg, lonDeg, best, second);

  const coastalFadeRaw = clamp((landStrength - 0.18) / 0.66, 0, 1);
  const coastalFade = coastalFadeRaw * coastalFadeRaw * (3 - 2 * coastalFadeRaw);
  const relief = buildContinentRelief(latDeg, lonDeg, profile, seam);

  const baseElevation =
    (landStrength - 0.50) * 1.75 +
    relief * (0.55 + profile.traversalDifficulty * 0.35);

  const eroded = lerp(baseElevation, baseElevation * 0.82, profile.erosionStrength * 0.45);
  const finalElevation = clamp(eroded * coastalFade + (landStrength - 0.48) * 0.38, -1, 1);

  return { elevation: finalElevation, seam };
}

function deriveOceanDepth(latDeg, lonDeg) {
  const deep = octaveNoise(latDeg * 0.026, lonDeg * 0.026, 4, 0.56, 310.4);
  const trench = octaveNoise(latDeg * 0.08, lonDeg * 0.05, 2, 0.52, 470.9);
  return clamp(-0.25 - Math.abs(deep) * 0.55 - Math.max(trench, 0) * 0.30, -1, 0);
}

function activeCitiesForContinent(profile, hierarchy) {
  const baselineStatesPerContinent =
    hierarchy.countriesPerContinent * hierarchy.statesPerCountry;
  const baselineCitiesPerContinent =
    baselineStatesPerContinent * hierarchy.citiesPerState;

  if (typeof profile.activeCitiesTotal === "number") return profile.activeCitiesTotal;
  return Math.max(16, Math.round(baselineCitiesPerContinent * profile.activeNodeDensity));
}

function activeMetrosForContinent(profile, hierarchy) {
  const baselineStatesPerContinent =
    hierarchy.countriesPerContinent * hierarchy.statesPerCountry;
  const baselineMetrosPerContinent =
    baselineStatesPerContinent * hierarchy.metrosPerState;

  if (profile.tier === 9) return 1;
  return Math.max(4, Math.round(baselineMetrosPerContinent * profile.activeMetroDensity));
}

function buildDynamicFields(sample, timeState) {
  const latRad = degToRad(sample.latDeg);
  const lonRad = degToRad(sample.lonDeg);
  const dayAngle = timeState.dayPhase * Math.PI * 2;
  const seasonAngle = timeState.seasonPhase * Math.PI * 2;
  const stormAngle = timeState.stormPhase * Math.PI * 2;

  const diurnal = Math.cos(lonRad + dayAngle) * Math.cos(latRad);
  const seasonal = Math.sin(latRad + seasonAngle) * 0.5 + 0.5;
  const storm =
    0.5 +
    0.5 * Math.sin((sample.latDeg * 0.09) + (sample.lonDeg * 0.07) + stormAngle + sample.rainfall * 2.4);
  const current =
    0.5 +
    0.5 * Math.sin((sample.latDeg * 0.06) - (sample.lonDeg * 0.11) + dayAngle * 0.35);

  return Object.freeze({
    dynamicIllumination: clamp(0.5 + diurnal * 0.5, 0, 1),
    dynamicCloudBias: clamp(storm * (0.18 + sample.rainfall * 0.72 + sample.maritimeInfluence * 0.18), 0, 1),
    dynamicStormBias: clamp(storm * (sample.rainfall * 0.55 + sample.evaporationPressure * 0.25), 0, 1),
    dynamicCurrentBias: clamp(current * (sample.waterMask === 1 ? 1 : 0.2), 0, 1),
    dynamicAuroraBias: clamp(sample.auroralPotential * (0.55 + 0.45 * Math.sin(seasonAngle + latRad)), 0, 1),
    dynamicGlowBias: clamp(
      sample.waterMask === 1
        ? 0.2 + sample.maritimeInfluence * 0.3 + seasonal * 0.2
        : sample.habitability * 0.12 + seasonal * 0.08,
      0,
      1
    ),
    motionState: Object.freeze({
      elapsedSeconds: timeState.elapsedSeconds,
      dayPhase: timeState.dayPhase,
      seasonPhase: timeState.seasonPhase,
      stormPhase: timeState.stormPhase
    })
  });
}

function buildSample(latDeg, lonDeg, kernel, timeState) {
  const continents = kernel.stores.continents;
  const hierarchy = kernel.stores.hierarchy;
  const world = kernel.resources.world;
  const { best, second } = findBestContinent(latDeg, lonDeg, continents);

  const oceanDepthField = deriveOceanDepth(latDeg, lonDeg);
  const landStrength = best?.strength ?? 0;
  const isLand = landStrength >= 0.46;

  if (!best || !isLand) {
    const climateBandField = resolveClimateBand(latDeg, -0.2);
    const freezePotential = clamp((Math.abs(latDeg) - 46) / 34, 0, 1);
    const rainfall = clamp(
      0.36 + Math.cos(degToRad(latDeg)) * 0.18 + noise2(latDeg * 0.05, lonDeg * 0.05, 5.4) * 0.08,
      0,
      1
    );

    const base = {
      latDeg,
      lonDeg,
      continentId: null,
      continentTier: null,
      continentName: null,
      shardClass: null,
      countryIndex: null,
      regionWithinCountry: null,
      stateIndex: null,
      capitalRegionIndex: null,
      node16Id: null,
      nodeRelationType: null,
      nodeLatticeScope: hierarchy.latticeScope,
      nodeScope: hierarchy.nodeScope,
      elevation: clamp(oceanDepthField * 0.55, -1, 0),
      terrainClass: Math.abs(oceanDepthField) < world.shelfBand ? "SHELF" : "WATER",
      biomeType: "NONE",
      surfaceMaterial: "NONE",
      climateBandField,
      waterMask: 1,
      landMask: 0,
      shoreline: false,
      shorelineBand: false,
      oceanDepthField,
      freezePotential,
      rainfall,
      continentality: 0,
      evaporationPressure: clamp(0.32 + (1 - Math.abs(latDeg) / 90) * 0.24, 0, 1),
      maritimeInfluence: 1,
      auroralPotential: clamp((Math.abs(latDeg) - 52) / 24, 0, 1),
      habitability: 0,
      activationWeight: 0,
      activeCitiesTotal: 0,
      activeMetrosTotal: 0,
      tectonicMemory: 0,
      traversalDifficulty: 0,
      slopeSeverity: 0
    };

    return Object.freeze({
      ...base,
      ...buildDynamicFields(base, timeState)
    });
  }

  const profile = best.profile;
  const { elevation, seam } = deriveElevation(latDeg, lonDeg, best, second);
  const shorelineBand =
    elevation >= -world.shorelineBand &&
    elevation <= world.shorelineBand;
  const climateBandField = resolveClimateBand(latDeg, elevation);
  const maritimeInfluence = clamp(1 - clamp((Math.abs(elevation) + best.strength - 0.5) / 0.5, 0, 1), 0, 1);
  const rainfall = deriveMoisture(latDeg, lonDeg, maritimeInfluence, elevation, profile);
  const temperature = deriveTemperature(latDeg, elevation, climateBandField);
  const freezePotential = clamp(1 - temperature + Math.max(0, elevation - 0.45) * 0.45, 0, 1);
  const terrainClass = terrainClassFromElevation(elevation, shorelineBand, freezePotential);
  const biomeType = deriveBiome(temperature, rainfall, terrainClass);
  const surfaceMaterial = deriveSurfaceMaterial(terrainClass, rainfall, freezePotential);
  const local = continentNormalizedCoordinates(latDeg, lonDeg, profile);
  const structure = resolveCountryRegionState(local.u, local.v);
  const nodeRelation = resolveNode({ stateIndex: structure.stateIndex });
  const continentality = clamp(1 - maritimeInfluence, 0, 1);
  const habitability = clamp(
    profile.habitabilityFraction *
      (1 - profile.traversalDifficulty * 0.30) *
      (1 - Math.max(0, elevation - 0.40) * 0.65) *
      (0.70 + rainfall * 0.40),
    0,
    1
  );

  const activationWeight =
    profile.tier === 9
      ? clamp(
          habitability * 0.25 + (1 - Math.abs(local.u - 0.5) - Math.abs(local.v - 0.5)) * 0.18,
          0,
          1
        )
      : clamp(habitability * profile.activeNodeDensity, 0, 1);

  const base = {
    latDeg,
    lonDeg,
    continentId: profile.id,
    continentTier: profile.tier,
    continentName: profile.canonicalName,
    shardClass: profile.shardClass,
    countryIndex: structure.countryIndex,
    regionWithinCountry: structure.regionWithinCountry,
    stateIndex: structure.stateIndex,
    capitalRegionIndex: structure.regionWithinCountry,
    node16Id: nodeRelation.id,
    nodeRelationType: nodeRelation.relation_type,
    nodeLatticeScope: nodeRelation.lattice_scope,
    nodeScope: nodeRelation.node_scope,
    elevation,
    terrainClass: shorelineBand && elevation > 0 ? "BEACH" : terrainClass,
    biomeType,
    surfaceMaterial,
    climateBandField,
    waterMask: 0,
    landMask: 1,
    shoreline: shorelineBand,
    shorelineBand,
    oceanDepthField,
    freezePotential,
    rainfall,
    continentality,
    evaporationPressure: clamp(0.24 + temperature * 0.44 + continentality * 0.12, 0, 1),
    maritimeInfluence,
    auroralPotential: clamp((Math.abs(latDeg) - 52) / 24, 0, 1),
    habitability,
    activationWeight,
    activeCitiesTotal: activeCitiesForContinent(profile, hierarchy),
    activeMetrosTotal: activeMetrosForContinent(profile, hierarchy),
    tectonicMemory: clamp(seam * (0.35 + profile.ridgeAlignment * 0.55), 0, 1),
    traversalDifficulty: profile.traversalDifficulty,
    slopeSeverity: clamp(Math.abs(elevation) * 0.55 + profile.reliefAmp * 0.35 + seam * 0.22, 0, 1)
  };

  return Object.freeze({
    ...base,
    ...buildDynamicFields(base, timeState)
  });
}

function buildSummary(samples, kernel, timeState) {
  const summary = {
    contractVersion: "PLANET_ENGINE_v3",
    frameContract: Object.freeze({
      enabled: true,
      elapsedSeconds: timeState.elapsedSeconds,
      dayPhase: timeState.dayPhase,
      seasonPhase: timeState.seasonPhase,
      stormPhase: timeState.stormPhase
    }),
    continents: {}
  };

  const hierarchy = kernel.stores.hierarchy;

  for (const profile of kernel.stores.continents) {
    summary.continents[profile.id] = {
      tier: profile.tier,
      canonicalName: profile.canonicalName,
      shardClass: profile.shardClass,
      landSamples: 0,
      activeCitiesTotal: activeCitiesForContinent(profile, hierarchy),
      activeMetrosTotal: activeMetrosForContinent(profile, hierarchy),
      habitabilityFraction: profile.habitabilityFraction,
      traversalDifficulty: profile.traversalDifficulty
    };
  }

  for (const row of samples) {
    for (const sample of row) {
      if (sample.continentId && summary.continents[sample.continentId]) {
        summary.continents[sample.continentId].landSamples += 1;
      }
    }
  }

  return Object.freeze(summary);
}

function buildField(kernel, timeState) {
  const samples = [];
  const { latSteps, lonSteps } = kernel.resources.world;

  for (let y = 0; y < latSteps; y += 1) {
    const v = y / (latSteps - 1);
    const latDeg = lerp(82, -82, v);
    const row = [];

    for (let x = 0; x < lonSteps; x += 1) {
      const u = x / lonSteps;
      const lonDeg = lerp(-180, 180, u);
      row.push(buildSample(latDeg, lonDeg, kernel, timeState));
    }

    samples.push(Object.freeze(row));
  }

  const frozenSamples = Object.freeze(samples);

  return Object.freeze({
    contractVersion: "PLANET_ENGINE_v3",
    width: lonSteps,
    height: latSteps,
    samples: frozenSamples,
    summary: buildSummary(frozenSamples, kernel, timeState),
    motionContract: Object.freeze({
      enabled: true,
      fields: Object.freeze([
        "dynamicIllumination",
        "dynamicCloudBias",
        "dynamicStormBias",
        "dynamicCurrentBias",
        "dynamicAuroraBias",
        "dynamicGlowBias",
        "motionState"
      ])
    }),
    timeState
  });
}

export function createPlanetEngine() {
  const kernel = WORLD_KERNEL;

  function buildPlanetField() {
    return buildField(kernel, buildTimeState({ elapsedSeconds: 0 }));
  }

  function buildPlanetFrame(timeState = {}) {
    return buildField(kernel, buildTimeState(timeState));
  }

  return Object.freeze({
    buildPlanetField,
    buildPlanetFrame
  });
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export function buildPlanetField() {
  return DEFAULT_PLANET_ENGINE.buildPlanetField();
}

export function buildPlanetFrame(timeState = {}) {
  return DEFAULT_PLANET_ENGINE.buildPlanetFrame(timeState);
}

export default DEFAULT_PLANET_ENGINE;
