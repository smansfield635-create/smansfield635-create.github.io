// /assets/h-earth/h-earth.surface.js
// H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1
// Full-file replacement.
// Surface parent material truth authority only.
//
// Purpose:
// - Consume H-Earth terrain parent truth.
// - Translate terrain aspects into material/surface classifications.
// - Preserve terrain hierarchy without repainting or redefining terrain.
// - Prepare downstream canvas with read-only surface cells.
// - Keep canvas, controls, weather, atmosphere, life, and animation held.
//
// Owns:
// - parent surface truth
// - material classification
// - surface category sampling
// - terrain-to-surface translation
// - land/water/ice/shelf visual classification data
// - downstream child activation conditions
//
// Does not own:
// - route status
// - route boot
// - user input
// - animation clock
// - canvas DOM creation
// - canvas paint sovereignty
// - terrain generation
// - land/water ratio

const CONTRACT = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";
const REQUIRED_PARENT = "terrain";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const TERRAIN_ONLY_CHAIN = "H_EARTH_G1_COMPLETE_TERRAIN_ONLY_PARENT_CHAIN_TNT_v1";
const VERSION = "2026-05-11.h-earth.g1.surface-parent-material-truth-v1";

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

const TERRAIN_TO_MATERIAL = Object.freeze({
  "land-body-anchor": {
    materialClass: "land-anchor-ground",
    surfaceDomain: "land",
    surfaceFamily: "body-seat",
    materialWeight: 0.72
  },
  "coast-edge": {
    materialClass: "coastal-stone",
    surfaceDomain: "coast",
    surfaceFamily: "coastline",
    materialWeight: 0.74
  },
  "coastal-shelf": {
    materialClass: "coastal-shelf-ground",
    surfaceDomain: "transition",
    surfaceFamily: "nearshore-platform",
    materialWeight: 0.66
  },
  "beach-slope": {
    materialClass: "beach-sediment",
    surfaceDomain: "coast",
    surfaceFamily: "sediment-slope",
    materialWeight: 0.58
  },
  "cliff-edge": {
    materialClass: "cliff-stone",
    surfaceDomain: "relief",
    surfaceFamily: "hard-edge",
    materialWeight: 0.86
  },
  escarpment: {
    materialClass: "escarpment-stone",
    surfaceDomain: "relief",
    surfaceFamily: "raised-edge",
    materialWeight: 0.82
  },
  plateau: {
    materialClass: "plateau-stone",
    surfaceDomain: "relief",
    surfaceFamily: "tableland",
    materialWeight: 0.78
  },
  highland: {
    materialClass: "highland-stone",
    surfaceDomain: "relief",
    surfaceFamily: "upland",
    materialWeight: 0.76
  },
  "mountain-spine": {
    materialClass: "mountain-stone",
    surfaceDomain: "relief",
    surfaceFamily: "ridge-system",
    materialWeight: 0.9
  },
  "master-summit": {
    materialClass: "summit-stone",
    surfaceDomain: "relief",
    surfaceFamily: "summit",
    materialWeight: 1
  },
  "secondary-peak": {
    materialClass: "summit-stone",
    surfaceDomain: "relief",
    surfaceFamily: "secondary-peak",
    materialWeight: 0.92
  },
  "valley-corridor": {
    materialClass: "valley-ground",
    surfaceDomain: "land",
    surfaceFamily: "corridor",
    materialWeight: 0.54
  },
  basin: {
    materialClass: "basin-ground",
    surfaceDomain: "land",
    surfaceFamily: "depression",
    materialWeight: 0.5
  },
  canyon: {
    materialClass: "canyon-stone",
    surfaceDomain: "fracture",
    surfaceFamily: "cut",
    materialWeight: 0.72
  },
  "fault-ridge": {
    materialClass: "fault-stone",
    surfaceDomain: "fracture",
    surfaceFamily: "fault-line",
    materialWeight: 0.82
  },
  lowland: {
    materialClass: "lowland-ground",
    surfaceDomain: "land",
    surfaceFamily: "low-relief-ground",
    materialWeight: 0.46
  },
  "island-fragment": {
    materialClass: "island-ground",
    surfaceDomain: "island",
    surfaceFamily: "fragment",
    materialWeight: 0.62
  },
  "archipelago-seat": {
    materialClass: "archipelago-ground",
    surfaceDomain: "island",
    surfaceFamily: "island-chain",
    materialWeight: 0.64
  },
  "polar-crust-seat": {
    materialClass: "polar-crust",
    surfaceDomain: "polar",
    surfaceFamily: "cold-crust",
    materialWeight: 0.78
  },
  "glacial-terrain-seat": {
    materialClass: "glacial-crust",
    surfaceDomain: "polar",
    surfaceFamily: "glacial-seat",
    materialWeight: 0.88
  },
  "continental-shelf": {
    materialClass: "shelf-water",
    surfaceDomain: "ocean",
    surfaceFamily: "shallow-water",
    materialWeight: 0.48
  },
  "slope-drop": {
    materialClass: "slope-water",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "shelf-drop",
    materialWeight: 0.56
  },
  "abyssal-plain": {
    materialClass: "abyssal-ocean",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "deep-floor",
    materialWeight: 0.72
  },
  trench: {
    materialClass: "trench-water",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "deep-cut",
    materialWeight: 0.9
  },
  "mid-ocean-ridge": {
    materialClass: "submarine-ridge",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "submarine-ridge",
    materialWeight: 0.74
  },
  "seamount-chain": {
    materialClass: "seamount-field",
    surfaceDomain: "ocean-floor",
    surfaceFamily: "submarine-mountain",
    materialWeight: 0.7
  },
  "fracture-zone": {
    materialClass: "fracture-water",
    surfaceDomain: "fracture",
    surfaceFamily: "submarine-fracture",
    materialWeight: 0.68
  },
  "seaway-corridor": {
    materialClass: "seaway-water",
    surfaceDomain: "ocean",
    surfaceFamily: "ocean-corridor",
    materialWeight: 0.62
  },
  "basin-mouth": {
    materialClass: "basin-mouth-water",
    surfaceDomain: "transition",
    surfaceFamily: "basin-outlet",
    materialWeight: 0.58
  }
});

const MATERIAL_TOKENS = Object.freeze({
  "deep-ocean": {
    token: "h-earth-surface-deep-ocean",
    depthFamily: "deep",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "abyssal-ocean": {
    token: "h-earth-surface-abyssal-ocean",
    depthFamily: "abyssal",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "shelf-water": {
    token: "h-earth-surface-shelf-water",
    depthFamily: "shallow",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "slope-water": {
    token: "h-earth-surface-slope-water",
    depthFamily: "slope",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "trench-water": {
    token: "h-earth-surface-trench-water",
    depthFamily: "trench",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "seaway-water": {
    token: "h-earth-surface-seaway-water",
    depthFamily: "corridor",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "basin-mouth-water": {
    token: "h-earth-surface-basin-mouth-water",
    depthFamily: "transition",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "submarine-ridge": {
    token: "h-earth-surface-submarine-ridge",
    depthFamily: "raised-ocean-floor",
    visualFamily: "ocean-relief",
    downstreamCanvasEligible: true
  },
  "seamount-field": {
    token: "h-earth-surface-seamount-field",
    depthFamily: "raised-ocean-floor",
    visualFamily: "ocean-relief",
    downstreamCanvasEligible: true
  },
  "fracture-water": {
    token: "h-earth-surface-fracture-water",
    depthFamily: "fracture",
    visualFamily: "water",
    downstreamCanvasEligible: true
  },
  "coastal-stone": {
    token: "h-earth-surface-coastal-stone",
    depthFamily: "land-edge",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "beach-sediment": {
    token: "h-earth-surface-beach-sediment",
    depthFamily: "land-edge",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "cliff-stone": {
    token: "h-earth-surface-cliff-stone",
    depthFamily: "raised-land-edge",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "escarpment-stone": {
    token: "h-earth-surface-escarpment-stone",
    depthFamily: "raised-land-edge",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "plateau-stone": {
    token: "h-earth-surface-plateau-stone",
    depthFamily: "raised-land",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "highland-stone": {
    token: "h-earth-surface-highland-stone",
    depthFamily: "raised-land",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "mountain-stone": {
    token: "h-earth-surface-mountain-stone",
    depthFamily: "mountain",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "summit-stone": {
    token: "h-earth-surface-summit-stone",
    depthFamily: "summit",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "polar-crust": {
    token: "h-earth-surface-polar-crust",
    depthFamily: "cold-crust",
    visualFamily: "polar",
    downstreamCanvasEligible: true
  },
  "glacial-crust": {
    token: "h-earth-surface-glacial-crust",
    depthFamily: "glacial",
    visualFamily: "polar",
    downstreamCanvasEligible: true
  },
  "lowland-ground": {
    token: "h-earth-surface-lowland-ground",
    depthFamily: "lowland",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "basin-ground": {
    token: "h-earth-surface-basin-ground",
    depthFamily: "basin",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "valley-ground": {
    token: "h-earth-surface-valley-ground",
    depthFamily: "valley",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "canyon-stone": {
    token: "h-earth-surface-canyon-stone",
    depthFamily: "canyon",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "fault-stone": {
    token: "h-earth-surface-fault-stone",
    depthFamily: "fault",
    visualFamily: "land-relief",
    downstreamCanvasEligible: true
  },
  "island-ground": {
    token: "h-earth-surface-island-ground",
    depthFamily: "island",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "archipelago-ground": {
    token: "h-earth-surface-archipelago-ground",
    depthFamily: "island-chain",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "land-anchor-ground": {
    token: "h-earth-surface-land-anchor-ground",
    depthFamily: "land-body-anchor",
    visualFamily: "land",
    downstreamCanvasEligible: true
  },
  "coastal-shelf-ground": {
    token: "h-earth-surface-coastal-shelf-ground",
    depthFamily: "coastal-platform",
    visualFamily: "land",
    downstreamCanvasEligible: true
  }
});

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

function terrainToSurfaceRule(cell) {
  return TERRAIN_TO_MATERIAL[cell.terrainAspect] || {
    materialClass: cell.isOcean ? "deep-ocean" : "lowland-ground",
    surfaceDomain: cell.isOcean ? "ocean" : "land",
    surfaceFamily: "fallback-classification",
    materialWeight: 0.4
  };
}

function materialToken(materialClass) {
  return MATERIAL_TOKENS[materialClass] || {
    token: `h-earth-surface-${materialClass || "unknown"}`,
    depthFamily: "unknown",
    visualFamily: "unknown",
    downstreamCanvasEligible: false
  };
}

function computeSurfaceIntensity(cell, rule) {
  const relief = Number.isFinite(cell.relief) ? cell.relief : 0;
  const elevation = Number.isFinite(cell.elevation) ? cell.elevation : 0;
  const depth = Number.isFinite(cell.depth) ? Math.abs(cell.depth) : 0;
  const fracture = Number.isFinite(cell.fracturePressure) ? cell.fracturePressure : 0;
  const coast = Number.isFinite(cell.coastPressure) ? cell.coastPressure : 0;
  const shelf = Number.isFinite(cell.shelfPressure) ? cell.shelfPressure : 0;
  const noise = deterministicSurfaceNoise(cell, 3);

  const base =
    rule.materialWeight * 0.38 +
    relief * 0.24 +
    elevation * 0.12 +
    depth * 0.12 +
    fracture * 0.07 +
    coast * 0.035 +
    shelf * 0.035 +
    noise * 0.07;

  return round(clamp(base, 0, 1));
}

function computeSurfaceRoughness(cell, rule) {
  const fracture = Number.isFinite(cell.fracturePressure) ? cell.fracturePressure : 0;
  const slope = Number.isFinite(cell.slopePressure) ? cell.slopePressure : 0;
  const escarpment = Number.isFinite(cell.escarpmentPressure) ? cell.escarpmentPressure : 0;
  const relief = Number.isFinite(cell.relief) ? cell.relief : 0;
  const noise = deterministicSurfaceNoise(cell, 7);

  const rough =
    rule.surfaceDomain === "ocean"
      ? relief * 0.28 + fracture * 0.24 + slope * 0.2 + noise * 0.08
      : relief * 0.32 + fracture * 0.22 + escarpment * 0.22 + slope * 0.12 + noise * 0.08;

  return round(clamp(rough, 0, 1));
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

function classifySurfaceCell(cell) {
  const rule = terrainToSurfaceRule(cell);
  const token = materialToken(rule.materialClass);

  const surfaceIntensity = computeSurfaceIntensity(cell, rule);
  const surfaceRoughness = computeSurfaceRoughness(cell, rule);
  const surfaceWetness = computeSurfaceWetness(cell, rule);
  const surfaceColdness = computeSurfaceColdness(cell, rule);

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
    depthFamily: token.depthFamily,
    surfaceRole,
    materialWeight: rule.materialWeight,
    surfaceIntensity,
    surfaceRoughness,
    surfaceWetness,
    surfaceColdness,
    downstreamCanvasEligible: token.downstreamCanvasEligible,
    canvasPaint: "not-authorized-in-surface-parent",
    controls: "not-authorized-in-surface-parent",
    animation: "not-authorized-in-surface-parent"
  });
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
  const terrainReceipt = terrain?.receipts?.terrain || {};
  const terrainSummary = terrain?.summary || {};

  const requiredTerrainContractPresent = terrain?.contract === REQUIRED_TERRAIN_CONTRACT;
  const terrainFullAspectDisposition = terrainSummary.fullAspectDisposition === true;
  const everyCellAssignedTerrain = terrainSummary.everyCellAssignedTerrain === true;
  const everyCellAssignedSurface = cells.every((cell) => Boolean(cell.materialClass && cell.materialToken));
  const allTerrainAspectsRepresented = Array.isArray(terrainSummary.missingTerrainAspects)
    ? terrainSummary.missingTerrainAspects.length === 0
    : terrainFullAspectDisposition;

  const materialCoverageComplete = MATERIAL_CLASSES.every((materialClass) => {
    return Boolean(materialIndex.byMaterial[materialClass] && materialIndex.byMaterial[materialClass].length > 0);
  });

  const allowed =
    requiredTerrainContractPresent &&
    terrainFullAspectDisposition &&
    everyCellAssignedTerrain &&
    allTerrainAspectsRepresented &&
    everyCellAssignedSurface;

  return freezeDeep({
    parentTerrainContract: terrain?.contract || "missing",
    requiredTerrainContract: REQUIRED_TERRAIN_CONTRACT,
    requiredTerrainContractPresent,
    parentTerrainReceiptPresent: Boolean(terrainReceipt.contract),
    terrainFullAspectDisposition,
    everyCellAssignedTerrain,
    allTerrainAspectsRepresented,
    everyCellAssignedSurface,
    materialCoverageComplete,
    surfaceParentReady: allowed,
    downstreamCanvasMayReadSurface: allowed,
    downstreamCanvasMayPaint: false,
    downstreamControlsMayBind: false,
    weatherMayActivate: false,
    atmosphereMayActivate: false,
    lifeMayActivate: false,
    reason: allowed
      ? "surface-parent-material-truth-ready-for-canvas-child-read"
      : "surface-parent-held-until-terrain-contract-and-aspect-coverage-pass"
  });
}

function summarizeSurface(cells, materialIndex, activationConditions) {
  const land = cells.filter((cell) => cell.isLand);
  const ocean = cells.filter((cell) => cell.isOcean);
  const cold = cells.filter((cell) => cell.surfaceColdness >= 0.62);
  const wet = cells.filter((cell) => cell.surfaceWetness >= 0.5);
  const rough = cells.filter((cell) => cell.surfaceRoughness >= 0.58);

  return freezeDeep({
    totalCells: cells.length,
    landSurfaceCells: land.length,
    oceanSurfaceCells: ocean.length,
    coldSurfaceCells: cold.length,
    wetSurfaceCells: wet.length,
    roughSurfaceCells: rough.length,
    materialClassCount: materialIndex.materialClasses.length,
    requiredMaterialClassCount: MATERIAL_CLASSES.length,
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

  const cells = Object.freeze(terrain.cells.map(classifySurfaceCell));
  const cellsByKey = freezeDeep(Object.fromEntries(cells.map((cell) => [cell.key, cell])));
  const cellsById = freezeDeep(Object.fromEntries(cells.map((cell) => [cell.cellId, cell])));
  const materialIndex = createMaterialIndex(cells);
  const surfaceSamples = createSurfaceSamples(cells);
  const activationConditions = createActivationConditions(terrain, cells, materialIndex);
  const summary = summarizeSurface(cells, materialIndex, activationConditions);

  const surface = {
    contract: CONTRACT,
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
      "land-water-ice-shelf-visual-classification-data",
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
        seedPacket: SEED_PACKET,
        parent: REQUIRED_PARENT,
        requiredTerrainContract: REQUIRED_TERRAIN_CONTRACT,
        parentTerrainContract: terrain?.contract || "missing",
        surfaceParentMaterialTruth: true,
        totalCells: summary.totalCells,
        landSurfaceCells: summary.landSurfaceCells,
        oceanSurfaceCells: summary.oceanSurfaceCells,
        materialClassCount: summary.materialClassCount,
        requiredMaterialClassCount: summary.requiredMaterialClassCount,
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
  REQUIRED_PARENT,
  REQUIRED_TERRAIN_CONTRACT,
  SEED_PACKET,
  TERRAIN_ONLY_CHAIN,
  VERSION,
  MATERIAL_CLASSES,
  SURFACE_DOMAINS,
  TERRAIN_TO_MATERIAL,
  MATERIAL_TOKENS
};

export default createHEarthSurface;
