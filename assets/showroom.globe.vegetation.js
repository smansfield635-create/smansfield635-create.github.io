// /assets/showroom.globe.vegetation.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_ZIONTS_BEACH_VEGETATION_40B_HABITABILITY_TNT_v13
// Owns: governed ancient living-world expression signals.
// Provides: beaches, coastal shelves, vegetation, wetlands, old-growth, reef/shoreline life.
// Does not own: route authority, base material rendering, hydration authority, runtime, or ground-level mode.

export const VEGETATION_HABITABILITY_VERSION = "showroom-globe-vegetation-habitability-40b-v13";

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

function hash(seed, a = 0, b = 0, c = 0) {
  return fract(Math.sin(seed * 12.9898 + a * 78.233 + b * 37.719 + c * 19.911) * 43758.5453123);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise3D(x, y, z, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const n000 = hash(seed, xi, yi, zi);
  const n100 = hash(seed, xi + 1, yi, zi);
  const n010 = hash(seed, xi, yi + 1, zi);
  const n110 = hash(seed, xi + 1, yi + 1, zi);
  const n001 = hash(seed, xi, yi, zi + 1);
  const n101 = hash(seed, xi + 1, yi, zi + 1);
  const n011 = hash(seed, xi, yi + 1, zi + 1);
  const n111 = hash(seed, xi + 1, yi + 1, zi + 1);

  return lerp(
    lerp(lerp(n000, n100, u), lerp(n010, n110, u), v),
    lerp(lerp(n001, n101, u), lerp(n011, n111, u), v),
    w
  ) * 2 - 1;
}

function fbm3D(x, y, z, seed = 0, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + i * 37) * amplitude;
    total += amplitude;
    amplitude *= 0.52;
    frequency *= 2.03;
  }

  return value / total;
}

function ridge3D(x, y, z, seed = 0, octaves = 3) {
  return 1 - Math.abs(fbm3D(x, y, z, seed, octaves));
}

function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);

  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function seededVector(seed, index) {
  return normalize({
    x: Math.sin(seed * 0.013 + index * 1.91) + Math.cos(seed * 0.029 + index * 0.71) * 0.32,
    y: Math.sin(seed * 0.017 + index * 2.61) + Math.cos(seed * 0.031 + index * 1.29) * 0.28,
    z: Math.cos(seed * 0.019 + index * 3.17) + Math.sin(seed * 0.037 + index * 1.61) * 0.34
  });
}

function sphericalCap(p, center, radius, softness) {
  const d = dot(p, center);
  const inner = Math.cos(radius);
  const outer = Math.cos(radius + softness);

  return smoothstep(outer, inner, d);
}

function sampleCaps(p, caps) {
  let value = 0;

  for (const cap of caps) {
    value = Math.max(value, sphericalCap(p, cap.center, cap.radius, cap.softness) * cap.weight);
  }

  return clamp(value, 0, 1);
}

function makeCaps(seed, family, count, radiusBase, radiusRange, weightBase, weightRange) {
  return Array.from({ length: count }, (_, i) => ({
    center: seededVector(seed + family, i),
    radius: radiusBase + hash(seed, i, family) * radiusRange,
    softness: 0.12 + hash(seed, i, family + 1) * 0.22,
    weight: weightBase + hash(seed, i, family + 2) * weightRange
  }));
}

function createAncientBiosphereField(world) {
  const seed = world.seed || 1;

  return Object.freeze({
    coastalBiomes: Object.freeze(makeCaps(seed, 810, 9, 0.36, 0.48, 0.42, 0.46)),
    oldGrowth: Object.freeze(makeCaps(seed, 830, 7, 0.28, 0.36, 0.34, 0.44)),
    wetlandBasins: Object.freeze(makeCaps(seed, 850, 8, 0.24, 0.34, 0.42, 0.42)),
    mineralBeaches: Object.freeze(makeCaps(seed, 870, 10, 0.28, 0.54, 0.50, 0.44)),
    reefSignals: Object.freeze(makeCaps(seed, 890, 7, 0.20, 0.34, 0.30, 0.36))
  });
}

function getWorldLifeProfile(world) {
  const profile = world.lifeProfile || {};

  return {
    beachStrength: Number.isFinite(profile.beachStrength) ? profile.beachStrength : 0.52,
    vegetationStrength: Number.isFinite(profile.vegetationStrength) ? profile.vegetationStrength : 0.46,
    wetlandStrength: Number.isFinite(profile.wetlandStrength) ? profile.wetlandStrength : 0.34,
    oldGrowthStrength: Number.isFinite(profile.oldGrowthStrength) ? profile.oldGrowthStrength : 0.30,
    reefStrength: Number.isFinite(profile.reefStrength) ? profile.reefStrength : 0.24,
    alienLifeBias: Number.isFinite(profile.alienLifeBias) ? profile.alienLifeBias : 0.0,
    desertLifeBias: Number.isFinite(profile.desertLifeBias) ? profile.desertLifeBias : 0.0
  };
}

export function createVegetationHabitabilityLayer(options = {}) {
  const fieldCache = new Map();

  function getField(world) {
    const key = `${world.key || "world"}:${world.seed || 1}`;

    if (!fieldCache.has(key)) {
      fieldCache.set(key, createAncientBiosphereField(world));
    }

    return fieldCache.get(key);
  }

  function sampleHabitability(p, material = {}, hydration = {}, world = {}, profile = {}) {
    const field = getField(world);
    const life = getWorldLifeProfile(world);
    const seed = world.seed || 1;

    const water = clamp(hydration.water ?? hydration.wetness ?? 0, 0, 1);
    const shallow = clamp(hydration.shallow ?? hydration.shelf ?? hydration.coastal ?? (1 - Math.abs(water - 0.48) * 2), 0, 1);
    const relief = clamp(material.relief ?? 0.5, 0, 1);
    const basins = clamp(material.basins ?? 0, 0, 1);
    const channels = clamp(material.channels ?? 0, 0, 1);
    const canyons = clamp(material.canyons ?? 0, 0, 1);
    const cliffs = clamp(material.cliffs ?? 0, 0, 1);
    const caverns = clamp(material.caverns ?? 0, 0, 1);
    const ridges = clamp(material.ridges ?? 0, 0, 1);

    const ancientCoastNoise = clamp((fbm3D(p.x * 4.0, p.y * 4.0, p.z * 4.0, seed + 910, 4) + 1) * 0.5, 0, 1);
    const vegetationNoise = clamp((fbm3D(p.x * 5.6, p.y * 5.3, p.z * 5.5, seed + 930, 4) + 1) * 0.5, 0, 1);
    const wetlandNoise = clamp((ridge3D(p.x * 6.2, p.y * 6.0, p.z * 6.1, seed + 950, 3)), 0, 1);
    const reefNoise = clamp((ridge3D(p.x * 8.2, p.y * 8.0, p.z * 8.4, seed + 970, 3)), 0, 1);

    const coastalField = sampleCaps(p, field.coastalBiomes);
    const oldGrowthField = sampleCaps(p, field.oldGrowth);
    const wetlandField = sampleCaps(p, field.wetlandBasins);
    const beachField = sampleCaps(p, field.mineralBeaches);
    const reefField = sampleCaps(p, field.reefSignals);

    const deepWaterPenalty = smoothstep(0.58, 0.88, water);
    const deadDryPenalty = 1 - smoothstep(0.01, 0.12, water + shallow + channels * 0.4);
    const extremeReliefPenalty = smoothstep(0.72, 0.96, cliffs + canyons * 0.65 + caverns * 0.55);
    const moderateRelief = 1 - Math.abs(relief - 0.52) * 1.35;
    const valleySupport = clamp(basins * 0.42 + channels * 0.34 + shallow * 0.28, 0, 1);

    const coastPotential = clamp(
      shallow * 0.48 +
      beachField * 0.36 +
      coastalField * 0.24 +
      ancientCoastNoise * 0.20 -
      deepWaterPenalty * 0.50 -
      extremeReliefPenalty * 0.24,
      0,
      1
    );

    const beach = clamp(
      coastPotential *
      life.beachStrength *
      (0.52 + beachField * 0.34 + ancientCoastNoise * 0.22) *
      (1 - deepWaterPenalty * 0.82) *
      (1 - deadDryPenalty * 0.55),
      0,
      1
    );

    const wetland = clamp(
      (valleySupport * 0.46 + wetlandField * 0.34 + wetlandNoise * 0.24) *
      life.wetlandStrength *
      (1 - deepWaterPenalty * 0.62) *
      (1 - extremeReliefPenalty * 0.48),
      0,
      1
    );

    const oldGrowth = clamp(
      (oldGrowthField * 0.42 + vegetationNoise * 0.34 + valleySupport * 0.30 + moderateRelief * 0.18) *
      life.oldGrowthStrength *
      (1 - deepWaterPenalty * 0.72) *
      (1 - extremeReliefPenalty * 0.54),
      0,
      1
    );

    const vegetation = clamp(
      (coastalField * 0.24 + vegetationNoise * 0.30 + wetland * 0.42 + oldGrowth * 0.42 + valleySupport * 0.24) *
      life.vegetationStrength *
      (1 - deepWaterPenalty * 0.76) *
      (1 - deadDryPenalty * 0.62) *
      (1 - extremeReliefPenalty * 0.52),
      0,
      1
    );

    const reef = clamp(
      (reefField * 0.42 + reefNoise * 0.32 + beach * 0.26 + shallow * 0.30) *
      life.reefStrength *
      (1 - smoothstep(0.72, 1.0, water)) *
      (1 - deadDryPenalty),
      0,
      1
    );

    const ancientHabitability = clamp(
      beach * 0.28 +
      vegetation * 0.34 +
      wetland * 0.22 +
      oldGrowth * 0.22 +
      reef * 0.12 +
      valleySupport * 0.10,
      0,
      1
    );

    return Object.freeze({
      beach,
      coast: coastPotential,
      vegetation,
      wetland,
      oldGrowth,
      reef,
      valleyLife: valleySupport,
      ancientHabitability,
      deepWaterPenalty,
      deadDryPenalty,
      extremeReliefPenalty,
      alienLifeBias: life.alienLifeBias,
      desertLifeBias: life.desertLifeBias
    });
  }

  function blendVegetationHabitability(color, habitability = {}, material = {}, hydration = {}, world = {}, profile = {}) {
    let result = Array.isArray(color) ? [...color] : [0, 0, 0];
    const beach = clamp(habitability.beach ?? 0, 0, 1);
    const vegetation = clamp(habitability.vegetation ?? 0, 0, 1);
    const wetland = clamp(habitability.wetland ?? 0, 0, 1);
    const oldGrowth = clamp(habitability.oldGrowth ?? 0, 0, 1);
    const reef = clamp(habitability.reef ?? 0, 0, 1);
    const ancient = clamp(habitability.ancientHabitability ?? 0, 0, 1);

    const beachColor = world.beach || [224, 202, 142];
    const beachWhite = world.beachWhite || [236, 228, 202];
    const beachBlack = world.beachBlack || [68, 58, 54];
    const vegetationColor = world.vegetation || [54, 126, 78];
    const oldGrowthColor = world.oldGrowth || [34, 86, 58];
    const wetlandColor = world.wetland || [42, 110, 96];
    const reefColor = world.reef || [96, 174, 158];

    const beachTone = mixColor(beachColor, beachWhite, clamp((habitability.coast ?? 0) * 0.28, 0, 0.28));
    const mineralBeach = mixColor(beachTone, beachBlack, clamp((world.lifeProfile?.blackSandBias || 0) * beach * 0.42, 0, 0.42));

    result = mixColor(result, mineralBeach, clamp(beach * 0.36, 0, 0.36));
    result = mixColor(result, reefColor, clamp(reef * 0.18, 0, 0.18));
    result = mixColor(result, wetlandColor, clamp(wetland * 0.30, 0, 0.30));
    result = mixColor(result, vegetationColor, clamp(vegetation * 0.34, 0, 0.34));
    result = mixColor(result, oldGrowthColor, clamp(oldGrowth * 0.28, 0, 0.28));

    if (world.lifeProfile?.alienLifeBias) {
      const alienColor = world.alienVegetation || [56, 150, 132];
      result = mixColor(result, alienColor, clamp(world.lifeProfile.alienLifeBias * ancient * 0.26, 0, 0.26));
    }

    if (world.lifeProfile?.desertLifeBias) {
      const dryLife = world.desertVegetation || [116, 124, 72];
      result = mixColor(result, dryLife, clamp(world.lifeProfile.desertLifeBias * vegetation * 0.18, 0, 0.18));
    }

    const maturityWarmth = ancient * 5;

    return [
      clamp(result[0] + maturityWarmth, 0, 255),
      clamp(result[1] + maturityWarmth * 0.82, 0, 255),
      clamp(result[2] + maturityWarmth * 0.40, 0, 255)
    ];
  }

  return Object.freeze({
    version: VEGETATION_HABITABILITY_VERSION,
    sampleHabitability,
    blendVegetationHabitability
  });
}

export function sampleHabitability(p, material, hydration, world, profile) {
  const layer = createVegetationHabitabilityLayer();
  return layer.sampleHabitability(p, material, hydration, world, profile);
}

export function blendVegetationHabitability(color, habitability, material, hydration, world, profile) {
  const layer = createVegetationHabitabilityLayer();
  return layer.blendVegetationHabitability(color, habitability, material, hydration, world, profile);
}
