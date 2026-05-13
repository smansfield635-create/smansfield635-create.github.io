// /assets/world/environment/profile.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_ENVIRONMENT_PROFILE_TNT_v1
// Owns: shared environment profile schema, coordinate cell resolution, and safe profile merging.

export const ENVIRONMENT_PROFILE_VERSION = "reusable-planetary-environment-profile-v1";

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

export function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k)
  ];
}

export function rgba(color, alpha = 1) {
  return `rgba(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])},${alpha})`;
}

export function hash01(a = 0, b = 0, c = 0, seed = 1) {
  const value = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + seed * 19.911) * 43758.5453123;
  return value - Math.floor(value);
}

export function wave01(value, speed = 1, offset = 0) {
  return 0.5 + Math.sin(value * speed + offset) * 0.5;
}

export function deepMerge(base, override) {
  if (!override || typeof override !== "object") return structuredClone(base);

  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.entries(override).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      output[key] = deepMerge(base[key], value);
    } else {
      output[key] = Array.isArray(value) ? [...value] : value;
    }
  });

  return output;
}

export const DEFAULT_ENVIRONMENT_PROFILE = Object.freeze({
  system: {
    version: ENVIRONMENT_PROFILE_VERSION,
    coordinateScale: 256,
    staticImageSource: false,
    reusableEngine: true
  },
  planet: {
    key: "generic",
    label: "Generic Planet",
    seed: 1000
  },
  region: {
    key: "default-region",
    label: "Default Region",
    activeCell: { x: 128, y: 128 },
    biome: "coastal-shelf"
  },
  camera: {
    mode: "ground",
    facing: "west-southwest",
    elevated: true,
    horizon: 0.35,
    shoreline: 0.59,
    groundStart: 0.56
  },
  climate: {
    timeOfDay: "golden-hour",
    sunX: 0.80,
    sunY: 0.13,
    haze: 0.55,
    wind: 0.58,
    cloudDensity: 0.46,
    atmosphereDepth: 0.70,
    palette: {
      skyTop: [84, 111, 133],
      skyMid: [171, 181, 170],
      skyWarm: [228, 205, 164],
      skyLow: [76, 96, 76],
      sun: [255, 225, 155],
      haze: [255, 235, 190]
    }
  },
  water: {
    enabled: true,
    behindStructure: true,
    depth: 0.80,
    waveStrength: 0.62,
    foam: 0.68,
    shimmer: 0.88,
    tide: 0.42,
    reflection: 0.86,
    palette: {
      far: [92, 148, 154],
      mid: [52, 119, 142],
      near: [23, 83, 118],
      deep: [13, 57, 90],
      foam: [238, 247, 240],
      shimmer: [255, 235, 180]
    }
  },
  terrain: {
    shelf: 0.82,
    slope: 0.55,
    rockDensity: 0.66,
    pathStrength: 0.72,
    distantIslets: 0.70,
    mountainPresence: 0.38,
    palette: {
      shelfHigh: [148, 137, 77],
      grassBase: [78, 105, 61],
      grassDeep: [34, 61, 43],
      soil: [93, 72, 47],
      path: [138, 111, 70],
      rock: [93, 88, 75],
      shadow: [18, 28, 24]
    }
  },
  foliage: {
    density: 0.72,
    windResponse: 0.72,
    wildflowers: 0.50,
    shrubs: 0.58,
    foregroundRichness: 0.82,
    palette: {
      grass: [82, 132, 76],
      grassGold: [178, 171, 92],
      shrub: [58, 113, 66],
      flowerWhite: [245, 238, 208],
      flowerGold: [229, 192, 72],
      flowerPink: [206, 134, 162],
      flowerPurple: [139, 116, 191]
    }
  },
  structure: {
    enabled: true,
    type: "manor",
    label: "Manor",
    x: 0.50,
    baseY: 0.615,
    width: 0.405,
    height: 0.205,
    integrated: true,
    warmInterior: true,
    finalArchitecture: false,
    palette: {
      wallDark: [62, 57, 49],
      wallMid: [128, 111, 77],
      wallLit: [184, 148, 88],
      roof: [45, 39, 36],
      window: [255, 215, 137],
      shadow: [23, 19, 16]
    }
  },
  wildlife: {
    birds: 0.60,
    smallGroundLife: 0.25
  }
});

export function createEnvironmentProfile(profile = {}) {
  const merged = deepMerge(DEFAULT_ENVIRONMENT_PROFILE, profile);
  merged.system.version = ENVIRONMENT_PROFILE_VERSION;
  merged.system.reusableEngine = true;
  return merged;
}

export function resolveEnvironmentCell(profile, coordinate = profile.region.activeCell) {
  const scale = profile.system.coordinateScale || 256;
  const x = clamp(Number(coordinate?.x ?? 128), 0, scale - 1);
  const y = clamp(Number(coordinate?.y ?? 128), 0, scale - 1);
  const nx = x / (scale - 1);
  const ny = y / (scale - 1);
  const seed = profile.planet.seed || 1;

  const coastalPressure = clamp(1 - Math.abs(nx - 0.52) * 1.15, 0, 1);
  const elevation = clamp(0.42 + ny * 0.38 + hash01(x, y, 3, seed) * 0.12, 0, 1);
  const waterAccess = clamp(profile.water.enabled ? 0.48 + coastalPressure * 0.36 : 0, 0, 1);
  const wetRisk = clamp((1 - elevation) * 0.28 + waterAccess * 0.10 - profile.terrain.shelf * 0.22, 0, 1);
  const vegetationDensity = clamp(profile.foliage.density * (0.72 + waterAccess * 0.30), 0, 1);
  const buildability = clamp(profile.terrain.shelf * 0.62 + elevation * 0.30 - wetRisk * 0.22, 0, 1);
  const pathLogic = clamp(profile.terrain.pathStrength * (0.70 + buildability * 0.30), 0, 1);

  return Object.freeze({
    coordinate: { x, y },
    normalized: { x: nx, y: ny },
    seed,
    biome: profile.region.biome,
    elevation,
    waterAccess,
    wetRisk,
    vegetationDensity,
    buildability,
    pathLogic,
    wildlifeProbability: clamp(profile.wildlife.birds * 0.45 + vegetationDensity * 0.30, 0, 1)
  });
}
