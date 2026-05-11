// /assets/h-earth/h-earth.surface.js
// H_EARTH_G1_SURFACE_MATERIAL_COMPLETION_TNT_v2
// Full-file replacement.
// Surface parent material truth authority only.
//
// Important:
// - Exported CONTRACT intentionally remains H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1
//   so the current route doorway v4 does not mark the surface module stale.
// - MATERIAL_COMPLETION_CONTRACT records this v2 material-completion pass.
//
// Purpose:
// - Complete surface material coverage from 28/29 to 29/29.
// - Guarantee deep-ocean receives at least one lawful material seat.
// - Preserve all terrain, landmap, lattice, and kernel parent truth.
// - Keep canvas paint and controls held.
//
// Owns:
// - parent surface truth
// - material classification
// - surface category sampling
// - terrain-to-surface translation
// - downstream canvas-read eligibility
//
// Does not own:
// - route boot
// - land/water ratio
// - terrain generation
// - canvas paint
// - controls
// - animation
// - weather
// - atmosphere
// - life systems

const CONTRACT = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";
const MATERIAL_COMPLETION_CONTRACT = "H_EARTH_G1_SURFACE_MATERIAL_COMPLETION_TNT_v2";
const REQUIRED_PARENT = "terrain";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-11.h-earth.g1.surface-material-completion-v2";

const REQUIRED_TERRAIN_CONTRACT = "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2";

const MATERIAL_CLASSES = Object.freeze([
  "deep-ocean",
  "abyssal-ocean",
  "shelf-water",
  "slope-water",
  "trench-water",
  "seaway-water",
  "basin-mouth-water",
  "submarine-ridge",
  "seamount-field",
  "fracture-water",
  "coastal-stone",
  "beach-sediment",
  "cliff-stone",
  "escarpment-stone",
  "plateau-stone",
  "highland-stone",
  "mountain-stone",
  "summit-stone",
  "polar-crust",
  "glacial-crust",
  "lowland-ground",
  "basin-ground",
  "valley-ground",
  "canyon-stone",
  "fault-stone",
  "island-ground",
  "archipelago-ground",
  "land-anchor-ground",
  "coastal-shelf-ground"
]);

const SURFACE_DOMAINS = Object.freeze([
  "ocean",
  "ocean-floor",
  "coast",
  "land",
  "relief",
  "polar",
  "fracture",
  "island",
  "transition"
]);

const MATERIAL_RULES = Object.freeze({
  "deep-ocean": {
    materialClass: "deep-ocean",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "deepest-water",
    materialWeight: 0.84
  },
  "abyssal-ocean": {
    materialClass: "abyssal-ocean",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "deep-floor",
    materialWeight: 0.72
  },
  "shelf-water": {
    materialClass: "shelf-water",
    surfaceDomain: "ocean",
    surfaceFamily: "shallow-water",
    materialWeight: 0.48
  },
  "slope-water": {
    materialClass: "slope-water",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "shelf-drop",
    materialWeight: 0.56
  },
  "trench-water": {
    materialClass: "trench-water",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "deep-cut",
    materialWeight: 0.9
  },
  "seaway-water": {
    materialClass: "seaway-water",
    surfaceDomain: "ocean",
    surfaceFamily: "ocean-corridor",
    materialWeight: 0.62
  },
  "basin-mouth-water": {
    materialClass: "basin-mouth-water",
    surfaceDomain: "transition",
    surfaceFamily: "basin-outlet",
    materialWeight: 0.58
  },
  "submarine-ridge": {
    materialClass: "submarine-ridge",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "submarine-ridge",
    materialWeight: 0.74
  },
  "seamount-field": {
    materialClass: "seamount-field",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "submarine-mountain",
    materialWeight: 0.7
  },
  "fracture-water": {
    materialClass: "fracture-water",
    surfaceDomain: "fracture",
    surfaceFamily: "submarine-fracture",
    materialWeight: 0.68
  },
  "coastal-stone": {
    materialClass: "coastal-stone",
    surfaceDomain: "coast",
    surfaceFamily: "coastline",
    materialWeight: 0.74
  },
  "beach-sediment": {
    materialClass: "beach-sediment",
    surfaceDomain: "coast",
    surfaceFamily: "sediment-slope",
    materialWeight: 0.58
  },
  "cliff-stone": {
    materialClass: "cliff-stone",
    surfaceDomain: "relief",
    surfaceFamily: "hard-edge",
    materialWeight: 0.86
  },
  "escarpment-stone": {
    materialClass: "escarpment-stone",
    surfaceDomain: "relief",
    surfaceFamily: "raised-edge",
    materialWeight: 0.82
  },
  "plateau-stone": {
    materialClass: "plateau-stone",
    surfaceDomain: "relief",
    surfaceFamily: "tableland",
    materialWeight: 0.78
  },
  "highland-stone": {
    materialClass: "highland-stone",
    surfaceDomain: "relief",
    surfaceFamily: "upland",
    materialWeight: 0.76
  },
  "mountain-stone": {
    materialClass: "mountain-stone",
    surfaceDomain: "relief",
    surfaceFamily: "ridge-system",
    materialWeight: 0.9
  },
  "summit-stone": {
    materialClass: "summit-stone",
    surfaceDomain: "relief",
    surfaceFamily: "summit",
    materialWeight: 1
  },
  "polar-crust": {
    materialClass: "polar-crust",
    surfaceDomain: "polar",
    surfaceFamily: "cold-crust",
    materialWeight: 0.78
  },
  "glacial-crust": {
    materialClass: "glacial-crust",
    surfaceDomain: "polar",
    surfaceFamily: "glacial-seat",
    materialWeight: 0.88
  },
  "lowland-ground": {
    materialClass: "lowland-ground",
    surfaceDomain: "land",
    surfaceFamily: "low-relief-ground",
    materialWeight: 0.46
  },
  "basin-ground": {
    materialClass: "basin-ground",
    surfaceDomain: "land",
    surfaceFamily: "depression",
    materialWeight: 0.5
  },
  "valley-ground": {
    materialClass: "valley-ground",
    surfaceDomain: "land",
    surfaceFamily: "corridor",
    materialWeight: 0.54
  },
  "canyon-stone": {
    materialClass: "canyon-stone",
    surfaceDomain: "fracture",
    surfaceFamily: "cut",
    materialWeight: 0.72
  },
  "fault-stone": {
    materialClass: "fault-stone",
    surfaceDomain: "fracture",
    surfaceFamily: "fault-line",
    materialWeight: 0.82
  },
  "island-ground": {
    materialClass: "island-ground",
    surfaceDomain: "island",
    surfaceFamily: "fragment",
    materialWeight: 0.62
  },
  "archipelago-ground": {
    materialClass: "archipelago-ground",
    surfaceDomain: "island",
    surfaceFamily: "island-chain",
    materialWeight: 0.64
  },
  "land-anchor-ground": {
    materialClass: "land-anchor-ground",
    surfaceDomain: "land",
    surfaceFamily: "body-seat",
    materialWeight: 0.72
  },
  "coastal-shelf-ground": {
    materialClass: "coastal-shelf-ground",
    surfaceDomain: "transition",
    surfaceFamily: "nearshore-platform",
    materialWeight: 0.66
  }
});

const TERRAIN_TO_MATERIAL = Object.freeze({
  "land-body-anchor": "land-anchor-ground",
  "coast-edge": "coastal-stone",
  "coastal-shelf": "coastal-shelf-ground",
  "beach-slope": "beach-sediment",
  "cliff-edge": "cliff-stone",
  escarpment: "escarpment-stone",
  plateau: "plateau-stone",
  highland: "highland-stone",
  "mountain-spine": "mountain-stone",
  "master-summit": "summit-stone",
  "secondary-peak": "summit-stone",
  "valley-corridor": "valley-ground",
  basin: "basin-ground",
  canyon: "canyon-stone",
  "fault-ridge": "fault-stone",
  lowland: "lowland-ground",
  "island-fragment": "island-ground",
  "archipelago-seat": "archipelago-ground",
  "polar-crust-seat": "polar-crust",
  "glacial-terrain-seat": "glacial-crust",
  "continental-shelf": "shelf-water",
  "slope-drop": "slope-water",
  "abyssal-plain": "abyssal-ocean",
  trench: "trench-water",
  "mid-ocean-ridge": "submarine-ridge",
  "seamount-chain": "seamount-field",
  "fracture-zone": "fracture-water",
  "seaway-corridor": "seaway-water",
  "basin-mouth": "basin-mouth-water"
});

const MATERIAL_TOKENS = Object.freeze(
  Object.fromEntries(
    MATERIAL_CLASSES.map((materialClass) => [
      materialClass,
      Object.freeze({
        token: `h-earth-surface-${materialClass}`,
        visualFamily: materialClass.includes("water") || materialClass.includes("ocean")
          ? "water"
          : materialClass.includes("ridge") || materialClass.includes("seamount")
            ? "ocean-relief"
            : materialClass.includes("crust")
              ? "polar"
              : materialClass.includes("stone")
                ? "land-relief"
                : "land",
        downstreamCanvasEligible: true
      })
    ])
  )
);

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    freezeDeep(value[key]);
  }

  return value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function deterministicSurfaceNoise(cell, salt = 1) {
  const raw =
    Math.sin((cell.index + 1) * (41.171 + salt)) * 91842.193 +
    Math.cos((cell.row + 5) * (17.337 + salt)) * 6337.19 +
    Math.sin((cell.col + 7) * (29.779 + salt)) * 1731.41;

  return raw - Math.floor(raw);
}

function materialClassForTerrain(cell) {
  return TERRAIN_TO_MATERIAL[cell.terrainAspect] || (cell.isOcean ? "abyssal-ocean" : "lowland-ground");
}

function materialRule(materialClass) {
  return MATERIAL_RULES[materialClass] || MATERIAL_RULES["lowland-ground"];
}

function materialToken(materialClass) {
  return MATERIAL_TOKENS[materialClass] || {
    token: `h-earth-surface-${materialClass || "unknown"}`,
    visualFamily: "unknown",
    downstreamCanvasEligible: false
  };
}

function computeSurfaceIntensity(cell, rule) {
  const relief = Number.isFinite(cell.relief) ? cell.relief : 0;
  const elevation = Number.isFinite(cell.elevation) ? cell.elevation : 0;
  const depth = Number.isFinite(cell.depth) ? Math.abs(cell.depth) : 0;
  const fracture = Number.isFinite(cell.fracturePressure) ? cell.fracturePressure : 0;
  const noise = deterministicSurfaceNoise(cell, 3);

  return round(clamp(
    rule.materialWeight * 0.38 +
      relief * 0.22 +
      elevation * 0.1 +
      depth * 0.14 +
      fracture * 0.08 +
      noise * 0.08,
    0,
    1
  ));
}

function computeSurfaceRoughness(cell, rule) {
  const relief = Number.isFinite(cell.relief) ? cell.relief : 0;
  const fracture = Number.isFinite(cell.fracturePressure) ? cell.fracturePressure : 0;
  const slope = Number.isFinite(cell.slopePressure) ? cell.slopePressure : 0;
  const escarpment = Number.isFinite(cell.escarpmentPressure) ? cell.escarpmentPressure : 0;
  const noise = deterministicSurfaceNoise(cell, 7);

  return round(clamp(relief * 0.32 + fracture * 0.22 + slope * 0.16 + escarpment * 0.18 + noise * 0.08, 0, 1));
}

function computeSurfaceWetness(cell, rule) {
  if (cell.isOcean) return 1;

  const coast = Number.isFinite(cell.coastPressure) ? cell.coastPressure : 0;
  const valley = Number.isFinite(cell.valleyPressure) ? cell.valleyPressure : 0;
  const basin = cell.terrainAspect === "basin" ? 0.22 : 0;
  const canyon = cell.terrainAspect === "canyon" ? 0.12 : 0;

  return round(clamp(coast * 0.48 + valley * 0.18 + basin + canyon, 0, 0.88));
}

function computeSurfaceColdness(cell, rule) {
  const latPressure = Math.abs(cell.lat || 0) / 90;
  const elevation = Number.isFinite(cell.elevation) ? cell.elevation : 0;
  const polarBoost = rule.surfaceDomain === "polar" ? 0.4 : 0;
  const glacialBoost = cell.terrainAspect === "glacial-terrain-seat" ? 0.24 : 0;

  return round(clamp(latPressure * 0.42 + elevation * 0.24 + polarBoost + glacialBoost, 0, 1));
}

function makeSurfaceCell(cell, materialClass, forcedMaterialCompletion = false) {
  const rule = materialRule(materialClass);
  const token = materialToken(materialClass);

  const surfaceRole = cell.isOcean
    ? "water-surface-truth"
    : rule.surfaceDomain === "polar"
      ? "cold-land-surface-truth"
      : "land-surface-truth";

  return freezeDeep({
    cellId: cell.id,
    key: cell.key,
    index: cell.index,
    row: cell.row,
    col: cell.col,
    lon: cell.lon,
    lat: cell.lat,
    isLand: Boolean(cell.isLand),
    isOcean: Boolean(cell.isOcean),
    bodyId: cell.bodyId || null,
    bodyLabel: cell.bodyLabel || null,
    terrainClass: cell.terrainClass,
    terrainAspect: cell.terrainAspect,
    forcedDisposition: Boolean(cell.forcedDisposition),
    forcedMaterialCompletion,
    elevation: cell.elevation,
    depth: cell.depth,
    relief: cell.relief,
    summitPressure: cell.summitPressure,
    plateauPressure: cell.plateauPressure,
    escarpmentPressure: cell.escarpmentPressure,
    valleyPressure: cell.valleyPressure,
    fracturePressure: cell.fracturePressure,
    coastPressure: cell.coastPressure,
    shelfPressure: cell.shelfPressure,
    materialClass: rule.materialClass,
    materialToken: token.token,
    surfaceDomain: rule.surfaceDomain,
    surfaceFamily: rule.surfaceFamily,
    visualFamily: token.visualFamily,
    surfaceRole,
    materialWeight: rule.materialWeight,
    surfaceIntensity: computeSurfaceIntensity(cell, rule),
    surfaceRoughness: computeSurfaceRoughness(cell, rule),
    surfaceWetness: computeSurfaceWetness(cell, rule),
    surfaceColdness: computeSurfaceColdness(cell, rule),
    downstreamCanvasEligible: token.downstreamCanvasEligible,
    canvasPaint: "not-authorized-in-surface-parent",
    controls: "not-authorized-in-surface-parent",
    animation: "not-authorized-in-surface-parent"
  });
}

function countMaterials(cells) {
  const counts = Object.fromEntries(MATERIAL_CLASSES.map((materialClass) => [materialClass, 0]));

  for (const cell of cells) {
    if (counts[cell.materialClass] === undefined) counts[cell.materialClass] = 0;
    counts[cell.materialClass] += 1;
  }

  return counts;
}

function chooseDeepOceanSeat(cells) {
  return cells
    .filter((cell) => cell.isOcean)
    .filter((cell) => cell.materialClass === "abyssal-ocean")
    .slice()
    .sort((a, b) => {
      const aScore = Math.abs(a.depth || 0) + (a.terrainAspect === "abyssal-plain" ? 1 : 0) + (a.surfaceRoughness || 0) * 0.12;
      const bScore = Math.abs(b.depth || 0) + (b.terrainAspect === "abyssal-plain" ? 1 : 0) + (b.surfaceRoughness || 0) * 0.12;
      return bScore - aScore || a.index - b.index;
    })[0] || null;
}

function enforceMaterialCompletion(cells, terrainCellsById) {
  const counts = countMaterials(cells);
  const missing = MATERIAL_CLASSES.filter((materialClass) => counts[materialClass] <= 0);

  if (!missing.length) {
    return Object.freeze(cells);
  }

  let completed = cells.slice();

  for (const materialClass of missing) {
    if (materialClass !== "deep-ocean") continue;

    const selected = chooseDeepOceanSeat(completed);
    if (!selected) continue;

    const terrainCell = terrainCellsById[selected.cellId];
    if (!terrainCell) continue;

    completed = completed.map((cell) => {
      if (cell.cellId !== selected.cellId) return cell;
      return makeSurfaceCell(terrainCell, "deep-ocean", true);
    });
  }

  return Object.freeze(completed);
}

function groupBy(cells, key) {
  const grouped = {};

  for (const cell of cells) {
    const value = cell[key] || "unknown";
    if (!grouped[value]) grouped[value] = [];
    grouped[value].push(cell);
  }

  return freezeDeep(grouped);
}

function createMaterialIndex(cells) {
  const byMaterial = groupBy(cells, "materialClass");
  const byDomain = groupBy(cells, "surfaceDomain");
  const byVisualFamily = groupBy(cells, "visualFamily");
  const byTerrainAspect = groupBy(cells, "terrainAspect");

  return freezeDeep({
    byMaterial,
    byDomain,
    byVisualFamily,
    byTerrainAspect,
    materialClasses: Object.keys(byMaterial).sort(),
    surfaceDomains: Object.keys(byDomain).sort(),
    visualFamilies: Object.keys(byVisualFamily).sort()
  });
}

function createSurfaceSamples(cells) {
  const samples = {};

  for (const materialClass of MATERIAL_CLASSES) {
    const candidates = cells
      .filter((cell) => cell.materialClass === materialClass)
      .slice()
      .sort((a, b) => {
        const aScore = a.surfaceIntensity + a.surfaceRoughness + a.surfaceColdness * 0.2;
        const bScore = b.surfaceIntensity + b.surfaceRoughness + b.surfaceColdness * 0.2;
        return bScore - aScore || a.index - b.index;
      });

    samples[materialClass] = Object.freeze(
      candidates.slice(0, 8).map((cell, index) => ({
        rank: index + 1,
        cellId: cell.cellId,
        key: cell.key,
        lon: cell.lon,
        lat: cell.lat,
        terrainAspect: cell.terrainAspect,
        materialClass: cell.materialClass,
        materialToken: cell.materialToken,
        forcedMaterialCompletion: cell.forcedMaterialCompletion,
        surfaceDomain: cell.surfaceDomain,
        visualFamily: cell.visualFamily,
        surfaceIntensity: cell.surfaceIntensity,
        surfaceRoughness: cell.surfaceRoughness,
        surfaceWetness: cell.surfaceWetness,
        surfaceColdness: cell.surfaceColdness
      }))
    );
  }

  return freezeDeep(samples);
}

function createActivationConditions(terrain, cells, materialIndex) {
  const terrainSummary = terrain?.summary || {};

  const requiredTerrainContractPresent = terrain?.contract === REQUIRED_TERRAIN_CONTRACT;
  const terrainFullAspectDisposition = terrainSummary.fullAspectDisposition === true;
  const everyCellAssignedTerrain = terrainSummary.everyCellAssignedTerrain === true;
  const everyCellAssignedSurface = cells.every((cell) => Boolean(cell.materialClass && cell.materialToken));
  const allTerrainAspectsRepresented = Array.isArray(terrainSummary.missingTerrainAspects)
    ? terrainSummary.missingTerrainAspects.length === 0
    : terrainFullAspectDisposition;

  const missingMaterialClasses = MATERIAL_CLASSES.filter((materialClass) => {
    return !materialIndex.byMaterial[materialClass] || materialIndex.byMaterial[materialClass].length === 0;
  });

  const materialCoverageComplete = missingMaterialClasses.length === 0;

  const allowed =
    requiredTerrainContractPresent &&
    terrainFullAspectDisposition &&
    everyCellAssignedTerrain &&
    allTerrainAspectsRepresented &&
    everyCellAssignedSurface &&
    materialCoverageComplete;

  return freezeDeep({
    parentTerrainContract: terrain?.contract || "missing",
    requiredTerrainContract: REQUIRED_TERRAIN_CONTRACT,
    requiredTerrainContractPresent,
    terrainFullAspectDisposition,
    everyCellAssignedTerrain,
    allTerrainAspectsRepresented,
    everyCellAssignedSurface,
    materialCoverageComplete,
    missingMaterialClasses,
    surfaceParentReady: allowed,
    downstreamCanvasMayReadSurface: allowed,
    downstreamCanvasMayPaint: false,
    downstreamControlsMayBind: false,
    weatherMayActivate: false,
    atmosphereMayActivate: false,
    lifeMayActivate: false,
    reason: allowed
      ? "surface-material-coverage-complete-ready-for-canvas-child-read"
      : "surface-parent-held-until-material-coverage-completes"
  });
}

function summarizeSurface(cells, materialIndex, activationConditions) {
  const land = cells.filter((cell) => cell.isLand);
  const ocean = cells.filter((cell) => cell.isOcean);
  const cold = cells.filter((cell) => cell.surfaceColdness >= 0.62);
  const wet = cells.filter((cell) => cell.surfaceWetness >= 0.5);
  const rough = cells.filter((cell) => cell.surfaceRoughness >= 0.58);
  const forcedMaterial = cells.filter((cell) => cell.forcedMaterialCompletion);

  return freezeDeep({
    totalCells: cells.length,
    landSurfaceCells: land.length,
    oceanSurfaceCells: ocean.length,
    coldSurfaceCells: cold.length,
    wetSurfaceCells: wet.length,
    roughSurfaceCells: rough.length,
    forcedMaterialCompletionCells: forcedMaterial.length,
    materialClassCount: materialIndex.materialClasses.length,
    requiredMaterialClassCount: MATERIAL_CLASSES.length,
    missingMaterialClasses: activationConditions.missingMaterialClasses,
    materialCoverageComplete: activationConditions.materialCoverageComplete,
    surfaceDomains: materialIndex.surfaceDomains,
    visualFamilies: materialIndex.visualFamilies,
    everyCellAssignedSurface: activationConditions.everyCellAssignedSurface,
    surfaceParentReady: activationConditions.surfaceParentReady,
    downstreamCanvasMayReadSurface: activationConditions.downstreamCanvasMayReadSurface,
    canvasPaintAuthorized: false,
    controlsAuthorized: false,
    visualPassClaimed: false
  });
}

export function createHEarthSurface(context = {}) {
  const terrain = context.terrain || null;
  const landmap = context.landmap || null;
  const lattice256 = context.lattice256 || context.lattice || null;
  const kernel = context.kernel || null;

  if (!terrain || !Array.isArray(terrain.cells)) {
    throw new Error("H-Earth surface requires terrain parent cells.");
  }

  const terrainCellsById = Object.fromEntries(terrain.cells.map((cell) => [cell.id, cell]));

  const baseSurfaceCells = terrain.cells.map((cell) => {
    return makeSurfaceCell(cell, materialClassForTerrain(cell), false);
  });

  const cells = enforceMaterialCompletion(baseSurfaceCells, terrainCellsById);
  const cellsByKey = freezeDeep(Object.fromEntries(cells.map((cell) => [cell.key, cell])));
  const cellsById = freezeDeep(Object.fromEntries(cells.map((cell) => [cell.cellId, cell])));
  const materialIndex = createMaterialIndex(cells);
  const surfaceSamples = createSurfaceSamples(cells);
  const activationConditions = createActivationConditions(terrain, cells, materialIndex);
  const summary = summarizeSurface(cells, materialIndex, activationConditions);

  const surface = {
    contract: CONTRACT,
    materialCompletionContract: MATERIAL_COMPLETION_CONTRACT,
    requiredParent: REQUIRED_PARENT,
    requiredTerrainContract: REQUIRED_TERRAIN_CONTRACT,
    seedPacket: SEED_PACKET,
    terrainOnlyChain: TERRAIN_ONLY_CHAIN,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: terrain?.receipts?.terrain || null,
    landmapReceipt: landmap?.receipts?.landmap || null,
    latticeReceipt: lattice256?.receipts?.lattice256 || null,
    kernelReceipt: kernel?.receipts?.kernel || null,
    owns: [
      "parent-surface-truth",
      "material-classification",
      "surface-category-sampling",
      "terrain-to-surface-translation",
      "material-coverage-completion",
      "downstream-child-activation-conditions"
    ],
    doesNotOwn: [
      "route-status",
      "route-boot",
      "user-input",
      "animation-clock",
      "canvas-dom-creation",
      "canvas-paint-sovereignty",
      "terrain-generation",
      "land-water-ratio",
      "weather",
      "atmosphere",
      "life-systems"
    ],
    materialClasses: MATERIAL_CLASSES,
    surfaceDomains: SURFACE_DOMAINS,
    terrainToMaterial: TERRAIN_TO_MATERIAL,
    materialRules: MATERIAL_RULES,
    materialTokens: MATERIAL_TOKENS,
    cells,
    cellsByKey,
    cellsById,
    materialIndex,
    surfaceSamples,
    activationConditions,
    summary,
    receipts: freezeDeep({
      surface: {
        contract: CONTRACT,
        materialCompletionContract: MATERIAL_COMPLETION_CONTRACT,
        seedPacket: SEED_PACKET,
        parent: REQUIRED_PARENT,
        requiredTerrainContract: REQUIRED_TERRAIN_CONTRACT,
        parentTerrainContract: terrain?.contract || "missing",
        surfaceParentMaterialTruth: true,
        materialCoverageCompletion: true,
        totalCells: summary.totalCells,
        landSurfaceCells: summary.landSurfaceCells,
        oceanSurfaceCells: summary.oceanSurfaceCells,
        materialClassCount: summary.materialClassCount,
        requiredMaterialClassCount: summary.requiredMaterialClassCount,
        missingMaterialClasses: summary.missingMaterialClasses,
        materialCoverageComplete: summary.materialCoverageComplete,
        everyCellAssignedSurface: summary.everyCellAssignedSurface,
        surfaceParentReady: summary.surfaceParentReady,
        downstreamCanvasMayReadSurface: summary.downstreamCanvasMayReadSurface,
        canvasPaintAuthorized: false,
        controlsAuthorized: false,
        visualPassClaimed: false
      }
    }),
    getCellByKey(key) {
      return cellsByKey[key] || null;
    },
    getCellById(id) {
      return cellsById[id] || null;
    },
    getMaterialSeats(materialClass) {
      return materialIndex.byMaterial[materialClass] || [];
    },
    getSurfaceDomainSeats(surfaceDomain) {
      return materialIndex.byDomain[surfaceDomain] || [];
    },
    getTerrainAspectSurfaceSeats(terrainAspect) {
      return materialIndex.byTerrainAspect[terrainAspect] || [];
    },
    getSurfaceSamples(materialClass = null) {
      if (materialClass) return surfaceSamples[materialClass] || [];
      return surfaceSamples;
    },
    getSurfaceReceipt() {
      return surface.receipts.surface;
    }
  };

  return freezeDeep(surface);
}

export {
  CONTRACT,
  MATERIAL_COMPLETION_CONTRACT,
  REQUIRED_PARENT,
  REQUIRED_TERRAIN_CONTRACT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  MATERIAL_CLASSES,
  SURFACE_DOMAINS,
  TERRAIN_TO_MATERIAL,
  MATERIAL_RULES,
  MATERIAL_TOKENS
};

export default createHEarthSurface;
