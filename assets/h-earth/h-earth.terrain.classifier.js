// /assets/h-earth/h-earth.terrain.classifier.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_GROUND_LEVEL_SCOUTING_AND_BUILD_CANDIDATE_TNT_v1
// Owns: terrain classification and buildability grading for H-Earth scouting.
// Does not own: Manor placement, Estate placement, bridge placement, Globe selector, or route migration.

export const H_EARTH_TERRAIN_CLASSIFIER_VERSION = "h-earth-terrain-classifier-v1";

export const TERRAIN_CLASSES = Object.freeze({
  BUILDABLE_PLATEAU: Object.freeze({
    key: "buildable-plateau",
    label: "Buildable plateau",
    buildable: true,
    description: "Stable elevated terrain with room for future structured placement."
  }),
  COASTAL_SHELF: Object.freeze({
    key: "coastal-shelf",
    label: "Coastal shelf",
    buildable: true,
    description: "Water-access terrain with possible arrival and bridge-approach value."
  }),
  VALLEY_BASIN: Object.freeze({
    key: "valley-basin",
    label: "Valley basin",
    buildable: true,
    description: "Sheltered terrain with water and vegetation support."
  }),
  RIDGE_HIGHLAND: Object.freeze({
    key: "ridge-highland",
    label: "Ridge / highland",
    buildable: "conditional",
    description: "Dramatic high terrain; useful for views, but requires stability proof."
  }),
  MOUNTAIN_PRESSURE_ZONE: Object.freeze({
    key: "mountain-pressure-zone",
    label: "Mountain pressure zone",
    buildable: "conditional",
    description: "High-energy terrain near strong relief; scenic but not automatically buildable."
  }),
  BEACH_SHORELINE: Object.freeze({
    key: "beach-shoreline",
    label: "Beach / shoreline",
    buildable: "support",
    description: "Arrival and livability edge; not primary foundation terrain by itself."
  }),
  WETLAND_LOWLAND: Object.freeze({
    key: "wetland-lowland",
    label: "Wetland / hydrated lowland",
    buildable: false,
    description: "Habitable ecology but poor foundation candidate without later engineering."
  }),
  CLIFF_FRACTURE_ZONE: Object.freeze({
    key: "cliff-fracture-zone",
    label: "Unstable cliff / fracture zone",
    buildable: false,
    description: "No-build terrain due to collapse, fracture, or edge instability."
  }),
  CAVERN_COLLAPSE_RISK: Object.freeze({
    key: "cavern-collapse-risk",
    label: "Cavern / collapse-risk zone",
    buildable: false,
    description: "No-build terrain until subsurface integrity is proven."
  }),
  PROTECTED_NO_BUILD: Object.freeze({
    key: "protected-no-build",
    label: "Protected no-build zone",
    buildable: false,
    description: "Terrain preserved for ecology, water, scenery, or pressure reasons."
  })
});

export const BUILD_CANDIDATE_GRADES = Object.freeze({
  A: Object.freeze({
    key: "A",
    label: "A — Primary build candidate",
    authorizedForEstate: false,
    description: "Strong future candidate, but still requires estate authorization."
  }),
  B: Object.freeze({
    key: "B",
    label: "B — Scenic/support candidate",
    authorizedForEstate: false,
    description: "Useful support or scenic region, not first placement authority."
  }),
  C: Object.freeze({
    key: "C",
    label: "C — Hold for later",
    authorizedForEstate: false,
    description: "Interesting terrain, but insufficient proof for first build selection."
  }),
  D: Object.freeze({
    key: "D",
    label: "D — No-build",
    authorizedForEstate: false,
    description: "No-build region under current evidence."
  })
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function scoreRange(value, low, high) {
  if (value < low) return clamp(value / Math.max(0.001, low), 0, 1);
  if (value > high) return clamp(1 - (value - high) / Math.max(0.001, 1 - high), 0, 1);
  return 1;
}

function roundScore(value) {
  return Math.round(clamp(value, 0, 1) * 100) / 100;
}

export function classifyTerrain(sample = {}) {
  const elevation = clamp(sample.elevation ?? 0.5, 0, 1);
  const slope = clamp(sample.slope ?? 0.5, 0, 1);
  const hydration = clamp(sample.hydration ?? 0.3, 0, 1);
  const coast = clamp(sample.coast ?? 0.2, 0, 1);
  const vegetation = clamp(sample.vegetation ?? 0.3, 0, 1);
  const fracture = clamp(sample.fracture ?? 0.2, 0, 1);
  const cavern = clamp(sample.cavern ?? 0.1, 0, 1);
  const relief = clamp(sample.relief ?? 0.45, 0, 1);
  const protectedValue = clamp(sample.protectedValue ?? 0.1, 0, 1);

  if (protectedValue > 0.72) return TERRAIN_CLASSES.PROTECTED_NO_BUILD;
  if (cavern > 0.66) return TERRAIN_CLASSES.CAVERN_COLLAPSE_RISK;
  if (fracture > 0.68 || slope > 0.82) return TERRAIN_CLASSES.CLIFF_FRACTURE_ZONE;
  if (hydration > 0.74 && elevation < 0.34) return TERRAIN_CLASSES.WETLAND_LOWLAND;
  if (coast > 0.70 && elevation < 0.48) return TERRAIN_CLASSES.BEACH_SHORELINE;
  if (coast > 0.54 && slope < 0.52 && fracture < 0.46) return TERRAIN_CLASSES.COASTAL_SHELF;
  if (hydration > 0.42 && vegetation > 0.38 && slope < 0.58 && elevation < 0.62) return TERRAIN_CLASSES.VALLEY_BASIN;
  if (elevation > 0.50 && elevation < 0.78 && slope < 0.46 && fracture < 0.36 && cavern < 0.32) return TERRAIN_CLASSES.BUILDABLE_PLATEAU;
  if (relief > 0.74 || elevation > 0.78) return TERRAIN_CLASSES.MOUNTAIN_PRESSURE_ZONE;
  if (elevation > 0.56 || relief > 0.58) return TERRAIN_CLASSES.RIDGE_HIGHLAND;

  return TERRAIN_CLASSES.VALLEY_BASIN;
}

export function classifyBuildability(sample = {}, terrainClass = classifyTerrain(sample)) {
  const elevation = clamp(sample.elevation ?? 0.5, 0, 1);
  const slope = clamp(sample.slope ?? 0.5, 0, 1);
  const hydration = clamp(sample.hydration ?? 0.3, 0, 1);
  const waterAccess = clamp(sample.waterAccess ?? sample.coast ?? 0.2, 0, 1);
  const scenic = clamp(sample.scenic ?? 0.4, 0, 1);
  const expansionRoom = clamp(sample.expansionRoom ?? 0.4, 0, 1);
  const bridgeApproach = clamp(sample.bridgeApproach ?? 0.35, 0, 1);
  const fracture = clamp(sample.fracture ?? 0.2, 0, 1);
  const cavern = clamp(sample.cavern ?? 0.1, 0, 1);
  const protectedValue = clamp(sample.protectedValue ?? 0.1, 0, 1);
  const wetFoundationRisk = hydration > 0.74 && elevation < 0.38 ? 1 : clamp((hydration - 0.62) * 1.8, 0, 1);

  const stability =
    scoreRange(slope, 0.08, 0.52) * 0.30 +
    (1 - fracture) * 0.28 +
    (1 - cavern) * 0.22 +
    (1 - wetFoundationRisk) * 0.20;

  const placementValue =
    scoreRange(elevation, 0.42, 0.76) * 0.22 +
    waterAccess * 0.18 +
    scenic * 0.18 +
    expansionRoom * 0.22 +
    bridgeApproach * 0.20;

  const protectionPenalty = protectedValue * 0.36;
  const noBuildPenalty =
    terrainClass.key === TERRAIN_CLASSES.CLIFF_FRACTURE_ZONE.key ||
    terrainClass.key === TERRAIN_CLASSES.CAVERN_COLLAPSE_RISK.key ||
    terrainClass.key === TERRAIN_CLASSES.PROTECTED_NO_BUILD.key
      ? 0.70
      : 0;

  const buildabilityScore = roundScore(
    stability * 0.56 +
    placementValue * 0.44 -
    protectionPenalty -
    noBuildPenalty
  );

  let grade = BUILD_CANDIDATE_GRADES.D;

  if (buildabilityScore >= 0.76 && terrainClass.buildable === true) {
    grade = BUILD_CANDIDATE_GRADES.A;
  } else if (buildabilityScore >= 0.58 && terrainClass.buildable !== false) {
    grade = BUILD_CANDIDATE_GRADES.B;
  } else if (buildabilityScore >= 0.38 && terrainClass.key !== TERRAIN_CLASSES.CLIFF_FRACTURE_ZONE.key && terrainClass.key !== TERRAIN_CLASSES.CAVERN_COLLAPSE_RISK.key) {
    grade = BUILD_CANDIDATE_GRADES.C;
  }

  return Object.freeze({
    grade,
    score: buildabilityScore,
    stability: roundScore(stability),
    placementValue: roundScore(placementValue),
    waterAccess: roundScore(waterAccess),
    scenic: roundScore(scenic),
    expansionRoom: roundScore(expansionRoom),
    bridgeApproach: roundScore(bridgeApproach),
    wetFoundationRisk: roundScore(wetFoundationRisk),
    fractureRisk: roundScore(fracture),
    cavernRisk: roundScore(cavern),
    estateAuthorized: false,
    manorAuthorized: false,
    bridgeAuthorized: false
  });
}

export function classifyTerrainAndBuildability(sample = {}) {
  const terrainClass = classifyTerrain(sample);
  const buildability = classifyBuildability(sample, terrainClass);

  return Object.freeze({
    terrainClass,
    buildability,
    sample: Object.freeze({ ...sample })
  });
}
