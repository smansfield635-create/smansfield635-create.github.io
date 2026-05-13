// /assets/h-earth/h-earth.environment.profile.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_ENVIRONMENT_PROFILE_RENEWAL_TNT_v2
// Owns: H-Earth Western Golden Shelf local profile for the reusable 256×256 hex environment engine.
// Required export: getHEarthWesternGoldenShelfProfile

import { createEnvironmentProfile } from "/assets/world/environment/profile.js";

export const H_EARTH_ENVIRONMENT_PROFILE_VERSION =
  "h-earth-western-golden-shelf-environment-profile-renewal-v2";

export const H_EARTH_WESTERN_GOLDEN_SHELF_PROFILE = createEnvironmentProfile({
  planet: {
    key: "h-earth",
    label: "H-Earth",
    seed: 2402
  },

  region: {
    key: "western-golden-shelf",
    label: "Western Golden Shelf",
    activeCell: { x: 86, y: 164 },
    biome: "ancient-coastal-shelf"
  },

  camera: {
    mode: "ground",
    facing: "west-southwest",
    elevated: true,
    horizon: 0.35,
    shoreline: 0.588,
    groundStart: 0.558
  },

  climate: {
    timeOfDay: "golden-hour",
    sunX: 0.80,
    sunY: 0.13,
    haze: 0.60,
    wind: 0.66,
    cloudDensity: 0.52,
    atmosphereDepth: 0.76,
    palette: {
      skyTop: [78, 108, 132],
      skyMid: [163, 178, 174],
      skyWarm: [226, 203, 162],
      skyLow: [90, 102, 73],
      sun: [255, 224, 156],
      haze: [255, 235, 186]
    }
  },

  water: {
    enabled: true,
    behindStructure: true,
    depth: 0.84,
    waveStrength: 0.70,
    foam: 0.78,
    shimmer: 0.94,
    tide: 0.48,
    reflection: 0.92,
    palette: {
      far: [94, 150, 155],
      mid: [54, 120, 143],
      near: [25, 85, 119],
      deep: [13, 61, 93],
      foam: [238, 247, 240],
      shimmer: [255, 238, 187]
    }
  },

  terrain: {
    shelf: 0.88,
    slope: 0.58,
    rockDensity: 0.72,
    pathStrength: 0.76,
    distantIslets: 0.74,
    mountainPresence: 0.42,
    palette: {
      shelfHigh: [148, 137, 77],
      grassBase: [78, 105, 61],
      grassDeep: [34, 61, 43],
      soil: [93, 72, 47],
      path: [138, 111, 70],
      rock: [93, 88, 75],
      shadow: [17, 31, 26]
    }
  },

  foliage: {
    density: 0.78,
    windResponse: 0.78,
    wildflowers: 0.58,
    shrubs: 0.62,
    foregroundRichness: 0.88,
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
    birds: 0.72,
    smallGroundLife: 0.30
  }
});

export function getHEarthWesternGoldenShelfProfile() {
  return H_EARTH_WESTERN_GOLDEN_SHELF_PROFILE;
}

export default H_EARTH_WESTERN_GOLDEN_SHELF_PROFILE;
