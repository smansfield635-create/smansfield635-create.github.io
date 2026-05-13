// /assets/h-earth/h-earth.environment.profile.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_ENVIRONMENT_PROFILE_TNT_v1
// Owns: H-Earth Western Golden Shelf local expression for the reusable environment engine.

import { createEnvironmentProfile } from "/assets/world/environment/profile.js";

export const H_EARTH_ENVIRONMENT_PROFILE_VERSION = "h-earth-western-golden-shelf-environment-profile-v1";

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
    horizon: 0.350,
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
    atmosphereDepth: 0.76
  },
  water: {
    enabled: true,
    behindStructure: true,
    depth: 0.84,
    waveStrength: 0.70,
    foam: 0.78,
    shimmer: 0.94,
    tide: 0.48,
    reflection: 0.92
  },
  terrain: {
    shelf: 0.88,
    slope: 0.58,
    rockDensity: 0.72,
    pathStrength: 0.76,
    distantIslets: 0.74,
    mountainPresence: 0.42
  },
  foliage: {
    density: 0.78,
    windResponse: 0.78,
    wildflowers: 0.58,
    shrubs: 0.62,
    foregroundRichness: 0.88
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
    finalArchitecture: false
  },
  wildlife: {
    birds: 0.72,
    smallGroundLife: 0.30
  }
});

export function getHEarthWesternGoldenShelfProfile() {
  return H_EARTH_WESTERN_GOLDEN_SHELF_PROFILE;
}
