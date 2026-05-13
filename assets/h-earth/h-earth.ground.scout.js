// /assets/h-earth/h-earth.ground.scout.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_GROUND_LEVEL_SCOUTING_AND_BUILD_CANDIDATE_TNT_v1
// Owns: H-Earth regional scouting and build-candidate region generation.
// Does not own: Manor placement, Estate placement, bridge placement, route migration, or Globe selector mutation.

import {
  H_EARTH_TERRAIN_CLASSIFIER_VERSION,
  classifyTerrainAndBuildability
} from "/assets/h-earth/h-earth.terrain.classifier.js?v=h-earth-terrain-classifier-v1";

export const H_EARTH_GROUND_SCOUT_VERSION = "h-earth-ground-scout-v1";
export const H_EARTH_GROUND_SCOUT_CONTRACT = "H_EARTH_GROUND_LEVEL_SCOUTING_AND_BUILD_CANDIDATE_TNT_v1";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundScore(value) {
  return Math.round(clamp(value, 0, 1) * 100) / 100;
}

function seededUnit(seed, salt) {
  return ((Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function makeSample(seed, bias = {}) {
  const elevation = clamp((bias.elevation ?? 0.5) + (seededUnit(seed, 1) - 0.5) * (bias.elevationVariance ?? 0.18), 0, 1);
  const slope = clamp((bias.slope ?? 0.38) + (seededUnit(seed, 2) - 0.5) * (bias.slopeVariance ?? 0.22), 0, 1);
  const hydration = clamp((bias.hydration ?? 0.36) + (seededUnit(seed, 3) - 0.5) * (bias.hydrationVariance ?? 0.24), 0, 1);
  const coast = clamp((bias.coast ?? 0.38) + (seededUnit(seed, 4) - 0.5) * (bias.coastVariance ?? 0.28), 0, 1);
  const vegetation = clamp((bias.vegetation ?? 0.42) + (seededUnit(seed, 5) - 0.5) * (bias.vegetationVariance ?? 0.24), 0, 1);
  const fracture = clamp((bias.fracture ?? 0.24) + (seededUnit(seed, 6) - 0.5) * (bias.fractureVariance ?? 0.20), 0, 1);
  const cavern = clamp((bias.cavern ?? 0.14) + (seededUnit(seed, 7) - 0.5) * (bias.cavernVariance ?? 0.16), 0, 1);
  const relief = clamp((bias.relief ?? 0.48) + (seededUnit(seed, 8) - 0.5) * (bias.reliefVariance ?? 0.24), 0, 1);
  const scenic = clamp((bias.scenic ?? 0.58) + (seededUnit(seed, 9) - 0.5) * (bias.scenicVariance ?? 0.24), 0, 1);
  const expansionRoom = clamp((bias.expansionRoom ?? 0.54) + (seededUnit(seed, 10) - 0.5) * (bias.expansionVariance ?? 0.26), 0, 1);
  const bridgeApproach = clamp((bias.bridgeApproach ?? 0.44) + (seededUnit(seed, 11) - 0.5) * (bias.bridgeVariance ?? 0.24), 0, 1);
  const protectedValue = clamp((bias.protectedValue ?? 0.16) + (seededUnit(seed, 12) - 0.5) * (bias.protectedVariance ?? 0.18), 0, 1);

  return Object.freeze({
    elevation,
    slope,
    hydration,
    coast,
    vegetation,
    fracture,
    cavern,
    relief,
    scenic,
    expansionRoom,
    bridgeApproach,
    protectedValue,
    waterAccess: clamp(coast * 0.62 + hydration * 0.38, 0, 1)
  });
}

const REGION_SEEDS = Object.freeze([
  Object.freeze({
    id: "HE-R01",
    name: "Western Golden Shelf",
    summary: "A dry elevated shelf near water access with strong first-candidate potential.",
    horizon: "wide waterline west, highland shadow east",
    arrivalRead: "clean western approach",
    bias: Object.freeze({
      elevation: 0.58,
      slope: 0.28,
      hydration: 0.44,
      coast: 0.62,
      vegetation: 0.44,
      fracture: 0.18,
      cavern: 0.10,
      relief: 0.48,
      scenic: 0.76,
      expansionRoom: 0.74,
      bridgeApproach: 0.70,
      protectedValue: 0.10
    })
  }),
  Object.freeze({
    id: "HE-R02",
    name: "North Basin Valley",
    summary: "Sheltered hydrated valley terrain with life support but foundation risk to verify.",
    horizon: "low valley floor, ridge walls",
    arrivalRead: "protected interior entry",
    bias: Object.freeze({
      elevation: 0.42,
      slope: 0.34,
      hydration: 0.64,
      coast: 0.28,
      vegetation: 0.62,
      fracture: 0.18,
      cavern: 0.18,
      relief: 0.46,
      scenic: 0.70,
      expansionRoom: 0.50,
      bridgeApproach: 0.42,
      protectedValue: 0.18
    })
  }),
  Object.freeze({
    id: "HE-R03",
    name: "Southern High Plain",
    summary: "Broad dry terrain with expansion room, but weaker water relationship.",
    horizon: "open plain, distant ridge",
    arrivalRead: "land-first approach",
    bias: Object.freeze({
      elevation: 0.64,
      slope: 0.24,
      hydration: 0.22,
      coast: 0.14,
      vegetation: 0.32,
      fracture: 0.16,
      cavern: 0.08,
      relief: 0.38,
      scenic: 0.52,
      expansionRoom: 0.82,
      bridgeApproach: 0.48,
      protectedValue: 0.08
    })
  }),
  Object.freeze({
    id: "HE-R04",
    name: "Eastern Ridge Gate",
    summary: "Visually strong ridge terrain with bridge drama but higher pressure risk.",
    horizon: "ridge line and steep relief",
    arrivalRead: "dramatic eastern approach",
    bias: Object.freeze({
      elevation: 0.76,
      slope: 0.56,
      hydration: 0.30,
      coast: 0.22,
      vegetation: 0.38,
      fracture: 0.44,
      cavern: 0.20,
      relief: 0.76,
      scenic: 0.88,
      expansionRoom: 0.42,
      bridgeApproach: 0.78,
      protectedValue: 0.22
    })
  }),
  Object.freeze({
    id: "HE-R05",
    name: "Wetland Mirror Lowland",
    summary: "Beautiful ecological terrain; likely protected or support-only.",
    horizon: "low reflective water and reeds",
    arrivalRead: "ecology-first no-build caution",
    bias: Object.freeze({
      elevation: 0.28,
      slope: 0.18,
      hydration: 0.82,
      coast: 0.52,
      vegetation: 0.72,
      fracture: 0.10,
      cavern: 0.14,
      relief: 0.22,
      scenic: 0.76,
      expansionRoom: 0.28,
      bridgeApproach: 0.24,
      protectedValue: 0.60
    })
  }),
  Object.freeze({
    id: "HE-R06",
    name: "Black Fracture Coast",
    summary: "Powerful shoreline terrain with high instability; no first-build authority.",
    horizon: "dark shore, fracture cuts",
    arrivalRead: "unsafe dramatic edge",
    bias: Object.freeze({
      elevation: 0.50,
      slope: 0.64,
      hydration: 0.48,
      coast: 0.72,
      vegetation: 0.30,
      fracture: 0.76,
      cavern: 0.44,
      relief: 0.72,
      scenic: 0.86,
      expansionRoom: 0.24,
      bridgeApproach: 0.36,
      protectedValue: 0.32
    })
  })
]);

function buildRegion(seedConfig, index) {
  const sample = makeSample(index + 101, seedConfig.bias);
  const classified = classifyTerrainAndBuildability(sample);

  return Object.freeze({
    id: seedConfig.id,
    name: seedConfig.name,
    summary: seedConfig.summary,
    horizon: seedConfig.horizon,
    arrivalRead: seedConfig.arrivalRead,
    sample,
    terrainClass: classified.terrainClass,
    buildability: classified.buildability,
    manorPlacementAuthorized: false,
    estatePlacementAuthorized: false,
    bridgePlacementAuthorized: false
  });
}

export function getGroundScoutRegions() {
  return REGION_SEEDS.map((seedConfig, index) => buildRegion(seedConfig, index));
}

export function gradeBuildCandidateRegion(region) {
  if (!region?.sample) {
    return Object.freeze({
      grade: "D",
      score: 0,
      reason: "Missing regional sample.",
      manorPlacementAuthorized: false,
      estatePlacementAuthorized: false,
      bridgePlacementAuthorized: false
    });
  }

  const classified = classifyTerrainAndBuildability(region.sample);

  return Object.freeze({
    grade: classified.buildability.grade.key,
    score: classified.buildability.score,
    terrainClass: classified.terrainClass.label,
    reason: classified.buildability.grade.description,
    manorPlacementAuthorized: false,
    estatePlacementAuthorized: false,
    bridgePlacementAuthorized: false
  });
}

export function createHEarthGroundScout() {
  const regions = getGroundScoutRegions();
  const primaryCandidates = regions.filter((region) => region.buildability.grade.key === "A");
  const supportCandidates = regions.filter((region) => region.buildability.grade.key === "B");
  const heldCandidates = regions.filter((region) => region.buildability.grade.key === "C");
  const noBuildRegions = regions.filter((region) => region.buildability.grade.key === "D");

  const bestCandidate = primaryCandidates[0] || supportCandidates[0] || heldCandidates[0] || null;

  return Object.freeze({
    version: H_EARTH_GROUND_SCOUT_VERSION,
    classifierVersion: H_EARTH_TERRAIN_CLASSIFIER_VERSION,
    contract: H_EARTH_GROUND_SCOUT_CONTRACT,
    target: "H-Earth",
    transitionPath: "orbital → regional → terrain → build-candidate → estate authorization",
    groundLevelScouting: true,
    buildCandidateAnalysis: true,
    manorPlacementAuthorized: false,
    estatePlacementAuthorized: false,
    bridgePlacementAuthorized: false,
    orbitalBaselinePreserved: true,
    globeSelectorMutated: false,
    mapFlattening: false,
    regions,
    primaryCandidates,
    supportCandidates,
    heldCandidates,
    noBuildRegions,
    bestCandidate,
    summary: Object.freeze({
      totalRegions: regions.length,
      primaryCandidates: primaryCandidates.length,
      supportCandidates: supportCandidates.length,
      heldCandidates: heldCandidates.length,
      noBuildRegions: noBuildRegions.length,
      bestCandidateName: bestCandidate?.name || "None proven"
    })
  });
}
