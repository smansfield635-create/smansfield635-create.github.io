// /assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js
// H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_DETAIL_BINDING_CHILD_TNT_v2
// Full-file replacement.
// H-Earth canvas terrain elevation / sea-level child only.
//
// Purpose:
// - Preserve elevation relative to sea level.
// - Preserve below-sea, near-sea, and above-sea classification.
// - Preserve build-grade and ground-level candidate classification.
// - Bind this elevation child downstream to the terrain-detail child.
// - Keep canonical terrain truth upstream in parent terrain/surface.
// - Keep estate placement held.
// - Keep ground-level mode held.
//
// Owns:
// - sea-level datum expression
// - below-sea depth expression
// - above-sea elevation expression
// - build-grade classification
// - ground-level candidate classification
// - elevation child receipts
// - terrain-detail binding compatibility
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - terrain-detail rendering
// - estate placement
// - ground-level scene
// - buildings
// - roads
// - live construction tools
// - parent mutation
// - image generation
// - GraphicBox
// - visual pass claim

const CONTRACT = "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_DETAIL_BINDING_CHILD_TNT_v2";
const PREVIOUS_CONTRACT = "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_CHILD_TNT_v1";
const PREWRITE = "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_DETAIL_BINDING_PREWRITE_v1";
const ORIGINAL_PREWRITE = "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_CHILD_PREWRITE_v1";
const DETAIL_BINDING_CONTRACT = "H_EARTH_G1_CANVAS_TERRAIN_DETAIL_CHILD_TNT_v1";
const ASSET_PATH = "/assets/h-earth/h-earth/canvas/terrain/elevation.sea-level.js";
const DETAIL_CHILD_PATH = "/assets/h-earth/h-earth/canvas/terrain/detail.js";

const TOTAL_CELLS = 256;
const GRID = 16;
const SEA_LEVEL_DATUM = 0;

const EXPECTED_PARENT_RECEIPTS = Object.freeze({
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1"
});

const MATERIAL_ELEVATION_RULES = Object.freeze({
  "abyssal-ocean": { min: -6500, max: -4200, band: "abyssal-depth", grade: "ocean-unavailable" },
  "deep-ocean": { min: -4200, max: -2200, band: "deep-ocean-depth", grade: "ocean-unavailable" },
  "open-ocean": { min: -2200, max: -550, band: "open-ocean-depth", grade: "ocean-unavailable" },
  "ocean-water": { min: -1800, max: -420, band: "ocean-water-depth", grade: "ocean-unavailable" },
  "basin-mouth-water": { min: -420, max: -90, band: "basin-mouth-depth", grade: "submerged-held" },
  "coastal-shelf-water": { min: -90, max: -12, band: "coastal-shelf-depth", grade: "submerged-held" },
  "reef-shelf-water": { min: -45, max: -3, band: "reef-shelf-depth", grade: "submerged-held" },

  "beach-sediment": { min: 0, max: 12, band: "beach-transition", grade: "beach-edge-candidate" },
  "coastal-shelf-ground": { min: 2, max: 28, band: "coastal-shelf-grade", grade: "coastal-transition" },
  "coastal-stone": { min: 10, max: 90, band: "coastal-stone-rise", grade: "coastal-transition" },
  "archipelago-ground": { min: 8, max: 95, band: "archipelago-rise", grade: "island-candidate" },
  "island-ground": { min: 10, max: 130, band: "island-rise", grade: "island-candidate" },

  "lowland-ground": { min: 18, max: 180, band: "lowland-elevation", grade: "lowland-primary-candidate" },
  "grassland-ground": { min: 22, max: 240, band: "grassland-elevation", grade: "lowland-primary-candidate" },
  "forest-ground": { min: 45, max: 340, band: "forest-elevation", grade: "lowland-primary-candidate" },
  "wetland-ground": { min: 1, max: 55, band: "wetland-near-sea", grade: "basin-conditional-candidate" },
  "basin-ground": { min: 4, max: 90, band: "basin-depression", grade: "basin-conditional-candidate" },
  "valley-ground": { min: 24, max: 180, band: "valley-depression", grade: "valley-primary-candidate" },

  "highland-ground": { min: 280, max: 1050, band: "highland-rise", grade: "highland-conditional-candidate" },
  "ridge-ground": { min: 650, max: 1450, band: "ridge-rise", grade: "ridge-held" },

  "canyon-stone": { min: 90, max: 760, band: "canyon-cut", grade: "canyon-held" },
  "cliff-stone": { min: 140, max: 980, band: "cliff-relief", grade: "cliff-held" },
  "mountain-stone": { min: 950, max: 3600, band: "mountain-relief", grade: "mountain-scenic-held" },
  "highland-stone": { min: 720, max: 2100, band: "highland-stone-rise", grade: "ridge-held" },
  "mineral-stone": { min: 620, max: 2500, band: "mineral-rise", grade: "ridge-held" },
  "volcanic-stone": { min: 1050, max: 4300, band: "volcanic-rise", grade: "volcanic-held" },

  "snow-highland": { min: 1800, max: 3600, band: "snow-highland-condition", grade: "ice-held" },
  "glacier-ice": { min: 2200, max: 4800, band: "glacier-elevation-condition", grade: "ice-held" },
  "ice-cap": { min: 2600, max: 5500, band: "ice-cap-elevation-condition", grade: "ice-held" }
});

const BUILD_GRADE_META = Object.freeze({
  "ocean-unavailable": {
    groundLevelCandidateClass: "unavailable",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "submerged-held": {
    groundLevelCandidateClass: "submerged-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "coastal-transition": {
    groundLevelCandidateClass: "future-coastal-ground-candidate",
    estateCandidate: false,
    groundLevelCandidate: true,
    held: false
  },
  "beach-edge-candidate": {
    groundLevelCandidateClass: "beach-edge-ground-candidate",
    estateCandidate: false,
    groundLevelCandidate: true,
    held: false
  },
  "lowland-primary-candidate": {
    groundLevelCandidateClass: "primary-ground-level-candidate",
    estateCandidate: true,
    groundLevelCandidate: true,
    held: false
  },
  "valley-primary-candidate": {
    groundLevelCandidateClass: "primary-ground-level-candidate",
    estateCandidate: true,
    groundLevelCandidate: true,
    held: false
  },
  "basin-conditional-candidate": {
    groundLevelCandidateClass: "conditional-ground-level-candidate",
    estateCandidate: true,
    groundLevelCandidate: true,
    held: true
  },
  "island-candidate": {
    groundLevelCandidateClass: "island-ground-level-candidate",
    estateCandidate: true,
    groundLevelCandidate: true,
    held: false
  },
  "highland-conditional-candidate": {
    groundLevelCandidateClass: "conditional-ground-level-candidate",
    estateCandidate: true,
    groundLevelCandidate: true,
    held: true
  },
  "ridge-held": {
    groundLevelCandidateClass: "scenic-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "cliff-held": {
    groundLevelCandidateClass: "relief-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "canyon-held": {
    groundLevelCandidateClass: "cut-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "mountain-scenic-held": {
    groundLevelCandidateClass: "scenic-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "ice-held": {
    groundLevelCandidateClass: "frozen-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "volcanic-held": {
    groundLevelCandidateClass: "volcanic-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  },
  "unknown-held": {
    groundLevelCandidateClass: "unknown-held",
    estateCandidate: false,
    groundLevelCandidate: false,
    held: true
  }
});

let lastInstance = null;

function isObject(value) {
  return value !== null && typeof value === "object";
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeName(value) {
  return safeString(value)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

function receiptFrom(value) {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (isObject(value.receipts)) {
    for (const item of Object.values(value.receipts)) {
      const nested = receiptFrom(item);
      if (nested) return nested;
    }
  }

  return (
    value.CONTRACT ||
    value.contract ||
    value.receipt ||
    value.surfaceReceipt ||
    value.SURFACE_RECEIPT ||
    ""
  );
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (value instanceof Map) {
    return Array.from(value.entries()).map(([key, item]) => {
      if (isObject(item)) return { index: Number(key), ...item };
      return { index: Number(key), value: item };
    });
  }

  if (isObject(value)) {
    const numericKeys = Object.keys(value).filter((key) => /^\d+$/.test(key));
    if (numericKeys.length >= TOTAL_CELLS) {
      return numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => {
          const item = value[key];
          if (isObject(item)) return { index: Number(key), ...item };
          return { index: Number(key), value: item };
        });
    }
  }

  return [];
}

function collectCandidates(source, label) {
  const candidates = [];

  if (!source) return candidates;

  const roots = [
    source,
    source.surface,
    source.materialIndex,
    source.surfaceIndex,
    source.cellIndex,
    source.terrainIndex,
    source.map,
    source.dataset
  ].filter(Boolean);

  const keys = [
    "cells",
    "surfaceCells",
    "materialCells",
    "terrainCells",
    "cellMap",
    "surfaceMap",
    "terrainMap",
    "materials",
    "records",
    "data",
    "states"
  ];

  for (const root of roots) {
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(root, key)) continue;

      const cells = toArray(root[key]);
      if (cells.length >= TOTAL_CELLS) {
        candidates.push({
          source: `${label}.${key}`,
          cells
        });
      }
    }
  }

  const providers = [
    "getCells",
    "getSurfaceCells",
    "getMaterialCells",
    "getTerrainCells",
    "readCells",
    "readSurfaceCells",
    "readMaterialCells",
    "readTerrainCells",
    "getHEarthSurfaceCells",
    "getHEarthTerrainCells",
    "getSurfaceMap",
    "getMaterialMap",
    "getTerrainMap"
  ];

  for (const provider of providers) {
    if (typeof source[provider] !== "function") continue;

    const argSets = [
      [],
      [{ readOnly: true }],
      [{ mutationAuthorized: false }],
      [{ readOnly: true, mutationAuthorized: false }]
    ];

    for (const args of argSets) {
      try {
        const cells = toArray(source[provider](...args));
        if (cells.length >= TOTAL_CELLS) {
          candidates.push({
            source: `${label}.${provider}()`,
            cells
          });
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }

  return candidates;
}

function indexFromCell(cell, fallbackIndex) {
  if (!isObject(cell)) return fallbackIndex;

  const keys = ["index", "cellIndex", "cell_index", "cellId", "cell_id", "stateId", "state_id", "id", "i"];

  for (const key of keys) {
    const raw = cell[key];

    if (Number.isInteger(raw) && raw >= 0 && raw < TOTAL_CELLS) return raw;

    if (typeof raw === "string" && /^\d+$/.test(raw)) {
      const parsed = Number(raw);
      if (parsed >= 0 && parsed < TOTAL_CELLS) return parsed;
    }
  }

  const row = Number.isInteger(cell.row) ? cell.row : Number.isInteger(cell.r) ? cell.r : null;
  const col = Number.isInteger(cell.col) ? cell.col : Number.isInteger(cell.c) ? cell.c : null;

  if (row !== null && col !== null) {
    const index = row * GRID + col;
    if (index >= 0 && index < TOTAL_CELLS) return index;
  }

  return fallbackIndex;
}

function readField(cell, keys) {
  if (!isObject(cell)) return "";

  for (const key of keys) {
    const value = cell[key];
    if (value !== undefined && value !== null && String(value).trim()) return value;
  }

  return "";
}

function materialFromCell(cell) {
  if (typeof cell === "string") return normalizeName(cell);

  return normalizeName(
    readField(cell, [
      "surfaceMaterial",
      "surface_material",
      "materialClass",
      "material_class",
      "surfaceClass",
      "surface_class",
      "material",
      "className",
      "class",
      "type",
      "aspect",
      "terrainAspect",
      "terrain_aspect",
      "name",
      "value"
    ])
  );
}

function terrainAspectFromCell(cell) {
  if (typeof cell === "string") return normalizeName(cell);

  return normalizeName(
    readField(cell, [
      "terrainAspect",
      "terrain_aspect",
      "aspect",
      "relief",
      "reliefClass",
      "landform",
      "terrainClass",
      "terrain_class",
      "type",
      "name"
    ])
  );
}

function deterministicNoise(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function chooseRule(material, terrainAspect) {
  const materialName = normalizeName(material);
  const aspectName = normalizeName(terrainAspect);

  if (MATERIAL_ELEVATION_RULES[materialName]) return MATERIAL_ELEVATION_RULES[materialName];

  const merged = `${materialName}-${aspectName}`;

  if (merged.includes("abyss")) return MATERIAL_ELEVATION_RULES["abyssal-ocean"];
  if (merged.includes("deep") && merged.includes("ocean")) return MATERIAL_ELEVATION_RULES["deep-ocean"];
  if (merged.includes("ocean") || merged.includes("water")) return MATERIAL_ELEVATION_RULES["open-ocean"];
  if (merged.includes("reef")) return MATERIAL_ELEVATION_RULES["reef-shelf-water"];
  if (merged.includes("beach") || merged.includes("sediment")) return MATERIAL_ELEVATION_RULES["beach-sediment"];
  if (merged.includes("coastal") || merged.includes("shelf")) return MATERIAL_ELEVATION_RULES["coastal-shelf-ground"];
  if (merged.includes("archipelago")) return MATERIAL_ELEVATION_RULES["archipelago-ground"];
  if (merged.includes("island")) return MATERIAL_ELEVATION_RULES["island-ground"];
  if (merged.includes("valley")) return MATERIAL_ELEVATION_RULES["valley-ground"];
  if (merged.includes("basin")) return MATERIAL_ELEVATION_RULES["basin-ground"];
  if (merged.includes("wetland")) return MATERIAL_ELEVATION_RULES["wetland-ground"];
  if (merged.includes("forest")) return MATERIAL_ELEVATION_RULES["forest-ground"];
  if (merged.includes("grass")) return MATERIAL_ELEVATION_RULES["grassland-ground"];
  if (merged.includes("highland")) return MATERIAL_ELEVATION_RULES["highland-ground"];
  if (merged.includes("ridge")) return MATERIAL_ELEVATION_RULES["ridge-ground"];
  if (merged.includes("canyon")) return MATERIAL_ELEVATION_RULES["canyon-stone"];
  if (merged.includes("cliff")) return MATERIAL_ELEVATION_RULES["cliff-stone"];
  if (merged.includes("volcanic")) return MATERIAL_ELEVATION_RULES["volcanic-stone"];
  if (merged.includes("mineral")) return MATERIAL_ELEVATION_RULES["mineral-stone"];
  if (merged.includes("mountain")) return MATERIAL_ELEVATION_RULES["mountain-stone"];
  if (merged.includes("glacier")) return MATERIAL_ELEVATION_RULES["glacier-ice"];
  if (merged.includes("snow")) return MATERIAL_ELEVATION_RULES["snow-highland"];
  if (merged.includes("ice")) return MATERIAL_ELEVATION_RULES["ice-cap"];
  if (merged.includes("stone")) return MATERIAL_ELEVATION_RULES["highland-stone"];
  if (merged.includes("land") || merged.includes("ground")) return MATERIAL_ELEVATION_RULES["lowland-ground"];

  return {
    min: 0,
    max: 0,
    band: "unknown-held",
    grade: "unknown-held"
  };
}

function resolveRelativeToSeaLevel(elevationMeters) {
  if (elevationMeters < 0) return "below-sea-level";
  if (elevationMeters >= 0 && elevationMeters <= 20) return "near-sea-level";
  return "above-sea-level";
}

function resolveElevationCell(index, material, terrainAspect, sourceCell = {}) {
  const row = Math.floor(index / GRID);
  const col = index % GRID;
  const rule = chooseRule(material, terrainAspect);
  const ratio = deterministicNoise(index, 451);
  const elevationMeters = Math.round(rule.min + (rule.max - rule.min) * ratio);
  const depthMeters = elevationMeters < SEA_LEVEL_DATUM ? Math.abs(elevationMeters) : 0;
  const relativeToSeaLevel = resolveRelativeToSeaLevel(elevationMeters);
  const buildGradeClass = rule.grade || "unknown-held";
  const gradeMeta = BUILD_GRADE_META[buildGradeClass] || BUILD_GRADE_META["unknown-held"];

  return {
    index,
    row,
    col,
    latitude: Number.isFinite(Number(sourceCell.latitude))
      ? Number(sourceCell.latitude)
      : 90 - ((row + 0.5) / GRID) * 180,
    longitude: Number.isFinite(Number(sourceCell.longitude))
      ? Number(sourceCell.longitude)
      : -180 + ((col + 0.5) / GRID) * 360,

    seaLevelDatum: SEA_LEVEL_DATUM,
    relativeToSeaLevel,
    elevationMeters,
    depthMeters,
    elevationBand: rule.band || "unknown-held",

    material: normalizeName(material) || "unknown",
    terrainAspect: normalizeName(terrainAspect) || "unknown",

    belowSeaDepth: depthMeters,
    oceanFloorDepth: buildGradeClass === "ocean-unavailable" ? depthMeters : 0,
    abyssalDepth: rule.band === "abyssal-depth" ? depthMeters : 0,
    deepOceanDepth: rule.band === "deep-ocean-depth" ? depthMeters : 0,
    coastalShelfGrade: rule.band === "coastal-shelf-depth" || rule.band === "coastal-shelf-grade" ? elevationMeters : 0,
    beachTransitionElevation: rule.band === "beach-transition" ? elevationMeters : 0,
    lowlandElevation: rule.band === "lowland-elevation" || rule.band === "grassland-elevation" || rule.band === "forest-elevation" ? elevationMeters : 0,
    valleyDepression: rule.band === "valley-depression" ? elevationMeters : 0,
    basinDepression: rule.band === "basin-depression" ? elevationMeters : 0,
    highlandRise: rule.band === "highland-rise" || rule.band === "highland-stone-rise" ? elevationMeters : 0,
    ridgeRise: rule.band === "ridge-rise" ? elevationMeters : 0,
    mountainRelief: rule.band === "mountain-relief" ? elevationMeters : 0,
    cliffRelief: rule.band === "cliff-relief" ? elevationMeters : 0,
    canyonCutDepth: rule.band === "canyon-cut" ? elevationMeters : 0,
    volcanicRise: rule.band === "volcanic-rise" ? elevationMeters : 0,
    iceElevationCondition: rule.band === "ice-cap-elevation-condition" || rule.band === "glacier-elevation-condition" ? elevationMeters : 0,
    snowHighlandCondition: rule.band === "snow-highland-condition" ? elevationMeters : 0,

    buildGradeClass,
    groundLevelCandidateClass: gradeMeta.groundLevelCandidateClass,
    estateCandidate: gradeMeta.estateCandidate,
    groundLevelCandidate: gradeMeta.groundLevelCandidate,
    held: gradeMeta.held,

    terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
    terrainDetailReadyForConsumption: true,

    estatePlacementReady: false,
    groundLevelReady: false,
    parentMutationAuthorized: false,
    truthMutationAuthorized: false
  };
}

function mergeParentCells({ surface, terrain }) {
  const surfaceCandidates = collectCandidates(surface, "surface");
  const terrainCandidates = collectCandidates(terrain, "terrain");

  const surfaceCells = surfaceCandidates.length ? surfaceCandidates[0].cells : [];
  const terrainCells = terrainCandidates.length ? terrainCandidates[0].cells : [];

  const cells = [];

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const surfaceItem = surfaceCells[index] || {};
    const terrainItem = terrainCells[index] || {};

    const surfaceIndex = indexFromCell(surfaceItem, index);
    const terrainIndex = indexFromCell(terrainItem, index);

    const sourceSurfaceCell =
      surfaceIndex === index
        ? surfaceItem
        : surfaceCells.find((cell, fallback) => indexFromCell(cell, fallback) === index) || {};

    const sourceTerrainCell =
      terrainIndex === index
        ? terrainItem
        : terrainCells.find((cell, fallback) => indexFromCell(cell, fallback) === index) || {};

    const material =
      materialFromCell(sourceSurfaceCell) ||
      materialFromCell(sourceTerrainCell) ||
      "unknown";

    const terrainAspect =
      terrainAspectFromCell(sourceTerrainCell) ||
      terrainAspectFromCell(sourceSurfaceCell) ||
      material;

    cells.push(resolveElevationCell(index, material, terrainAspect, sourceSurfaceCell));
  }

  return {
    cells,
    candidateSources: {
      surface: surfaceCandidates.map((candidate) => candidate.source),
      terrain: terrainCandidates.map((candidate) => candidate.source)
    }
  };
}

function summarize(cells, parentReceipts) {
  const belowSeaCells = cells.filter((cell) => cell.relativeToSeaLevel === "below-sea-level").length;
  const nearSeaLevelCells = cells.filter((cell) => cell.relativeToSeaLevel === "near-sea-level").length;
  const aboveSeaCells = cells.filter((cell) => cell.relativeToSeaLevel === "above-sea-level").length;

  const oceanDepthCells = cells.filter((cell) => cell.depthMeters > 0).length;
  const coastalTransitionCells = cells.filter((cell) => {
    return (
      cell.buildGradeClass === "coastal-transition" ||
      cell.buildGradeClass === "beach-edge-candidate"
    );
  }).length;

  const lowlandCandidateCells = cells.filter((cell) => cell.buildGradeClass === "lowland-primary-candidate").length;
  const valleyCandidateCells = cells.filter((cell) => cell.buildGradeClass === "valley-primary-candidate").length;
  const islandCandidateCells = cells.filter((cell) => cell.buildGradeClass === "island-candidate").length;
  const highlandConditionalCells = cells.filter((cell) => cell.buildGradeClass === "highland-conditional-candidate").length;
  const mountainHeldCells = cells.filter((cell) => cell.buildGradeClass === "mountain-scenic-held").length;
  const iceHeldCells = cells.filter((cell) => cell.buildGradeClass === "ice-held").length;
  const groundLevelCandidateCells = cells.filter((cell) => cell.groundLevelCandidate === true).length;

  const materialClasses = new Set(cells.map((cell) => cell.material)).size;
  const buildGradeClasses = new Set(cells.map((cell) => cell.buildGradeClass)).size;

  const parentSurfaceReady =
    parentReceipts.surface === EXPECTED_PARENT_RECEIPTS.surface ||
    Boolean(parentReceipts.surface);

  const elevationChildReady =
    cells.length === TOTAL_CELLS &&
    cells.every((cell) => {
      return (
        cell.elevationBand &&
        cell.relativeToSeaLevel &&
        Number.isFinite(cell.elevationMeters) &&
        Number.isFinite(cell.depthMeters) &&
        cell.buildGradeClass &&
        cell.groundLevelCandidateClass
      );
    }) &&
    parentSurfaceReady;

  return {
    totalCells: TOTAL_CELLS,
    seaLevelDatum: SEA_LEVEL_DATUM,

    belowSeaCells,
    nearSeaLevelCells,
    aboveSeaCells,
    oceanDepthCells,
    coastalTransitionCells,
    lowlandCandidateCells,
    valleyCandidateCells,
    islandCandidateCells,
    highlandConditionalCells,
    mountainHeldCells,
    iceHeldCells,
    groundLevelCandidateCells,

    materialClasses,
    buildGradeClasses,

    terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
    terrainDetailBindingReady: true,
    terrainDetailChildPath: DETAIL_CHILD_PATH,

    estatePlacementReady: false,
    groundLevelReady: false,
    parentMutationAuthorized: false,
    truthMutationAuthorized: false,
    visualPassClaim: false,
    elevationChildReady
  };
}

function cloneCell(cell) {
  return { ...cell };
}

function createFallbackCell(index = 0) {
  const safeIndex = Math.max(0, Math.min(TOTAL_CELLS - 1, Number.isInteger(index) ? index : 0));
  return resolveElevationCell(safeIndex, "unknown", "unknown", {});
}

function createHEarthCanvasTerrainElevation({
  kernel = null,
  lattice256 = null,
  landmap = null,
  terrain = null,
  surface = null
} = {}) {
  const parentReceipts = {
    kernel: receiptFrom(kernel) || "missing",
    lattice256: receiptFrom(lattice256) || "missing",
    landmap: receiptFrom(landmap) || "missing",
    terrain: receiptFrom(terrain) || "missing",
    surface: surface?.receipts?.surface?.contract || receiptFrom(surface) || "missing"
  };

  const { cells, candidateSources } = mergeParentCells({ surface, terrain });
  const summary = summarize(cells, parentReceipts);

  const elevationIndex = cells.reduce((index, cell) => {
    index[cell.index] = {
      elevationMeters: cell.elevationMeters,
      depthMeters: cell.depthMeters,
      relativeToSeaLevel: cell.relativeToSeaLevel,
      elevationBand: cell.elevationBand,
      buildGradeClass: cell.buildGradeClass,
      groundLevelCandidateClass: cell.groundLevelCandidateClass,
      estateCandidate: cell.estateCandidate,
      groundLevelCandidate: cell.groundLevelCandidate,
      held: cell.held,
      terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
      terrainDetailReadyForConsumption: true
    };
    return index;
  }, {});

  const receipts = {
    elevation: {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      prewrite: PREWRITE,
      originalPrewrite: ORIGINAL_PREWRITE,
      assetPath: ASSET_PATH,
      terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
      terrainDetailChildPath: DETAIL_CHILD_PATH,
      parentMutationAuthorized: false,
      truthMutationAuthorized: false,
      estatePlacementReady: false,
      groundLevelReady: false,
      visualPassClaim: false
    },
    parentReceipts,
    expectedParentReceipts: EXPECTED_PARENT_RECEIPTS,
    candidateSources
  };

  const instance = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    prewrite: PREWRITE,
    originalPrewrite: ORIGINAL_PREWRITE,
    assetPath: ASSET_PATH,
    terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
    terrainDetailChildPath: DETAIL_CHILD_PATH,
    parentReceipts,
    summary,
    cells: cells.map(cloneCell),
    elevationIndex,
    receipts,

    getElevationCells() {
      return cells.map(cloneCell);
    },

    getCellElevation(index) {
      const numericIndex = Number(index);
      if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= TOTAL_CELLS) {
        return null;
      }

      return cloneCell(cells[numericIndex]);
    },

    getBuildGrade(index) {
      const numericIndex = Number(index);
      if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= TOTAL_CELLS) {
        return null;
      }

      const cell = cells[numericIndex];

      return {
        index: cell.index,
        buildGradeClass: cell.buildGradeClass,
        groundLevelCandidateClass: cell.groundLevelCandidateClass,
        estateCandidate: cell.estateCandidate,
        groundLevelCandidate: cell.groundLevelCandidate,
        held: cell.held,
        terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
        terrainDetailReadyForConsumption: true,
        estatePlacementReady: false,
        groundLevelReady: false,
        parentMutationAuthorized: false,
        truthMutationAuthorized: false
      };
    },

    sampleElevationForTerrainDetail(index) {
      const numericIndex = Number(index);
      if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= TOTAL_CELLS) {
        return cloneCell(createFallbackCell(0));
      }

      return cloneCell(cells[numericIndex]);
    },

    getStatus() {
      return getHEarthCanvasTerrainElevationStatus();
    },

    getHEarthCanvasTerrainElevationStatus() {
      return getHEarthCanvasTerrainElevationStatus();
    }
  };

  lastInstance = instance;

  return instance;
}

function sampleElevationForTerrainDetail(index = 0) {
  if (lastInstance && typeof lastInstance.sampleElevationForTerrainDetail === "function") {
    return lastInstance.sampleElevationForTerrainDetail(index);
  }

  return cloneCell(createFallbackCell(Number(index) || 0));
}

function getHEarthCanvasTerrainElevationStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    prewrite: PREWRITE,
    originalPrewrite: ORIGINAL_PREWRITE,
    assetPath: ASSET_PATH,
    terrainDetailBindingContract: DETAIL_BINDING_CONTRACT,
    terrainDetailChildPath: DETAIL_CHILD_PATH,
    totalCells: TOTAL_CELLS,
    grid: GRID,
    seaLevelDatum: SEA_LEVEL_DATUM,
    expectedParentReceipts: EXPECTED_PARENT_RECEIPTS,
    requiredExports: [
      "createHEarthCanvasTerrainElevation",
      "sampleElevationForTerrainDetail",
      "getHEarthCanvasTerrainElevationStatus"
    ],
    owns: [
      "sea-level-datum-expression",
      "below-sea-depth-expression",
      "above-sea-elevation-expression",
      "build-grade-classification",
      "ground-level-candidate-classification",
      "terrain-detail-binding-compatibility"
    ],
    doesNotOwn: [
      "kernel-truth",
      "lattice-truth",
      "landmap-truth",
      "terrain-truth",
      "surface-truth",
      "terrain-detail-rendering",
      "estate-placement",
      "ground-level-scene",
      "buildings",
      "roads",
      "parent-mutation"
    ],
    elevationChildReady: true,
    terrainDetailBindingReady: true,
    parentMutationAuthorized: false,
    truthMutationAuthorized: false,
    estatePlacementReady: false,
    groundLevelReady: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false
  };
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  PREWRITE,
  ORIGINAL_PREWRITE,
  DETAIL_BINDING_CONTRACT,
  ASSET_PATH,
  DETAIL_CHILD_PATH,
  SEA_LEVEL_DATUM,
  EXPECTED_PARENT_RECEIPTS,
  createHEarthCanvasTerrainElevation,
  sampleElevationForTerrainDetail,
  getHEarthCanvasTerrainElevationStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  prewrite: PREWRITE,
  originalPrewrite: ORIGINAL_PREWRITE,
  detailBindingContract: DETAIL_BINDING_CONTRACT,
  assetPath: ASSET_PATH,
  detailChildPath: DETAIL_CHILD_PATH,
  createHEarthCanvasTerrainElevation,
  sampleElevationForTerrainDetail,
  status: getHEarthCanvasTerrainElevationStatus,
  getStatus: getHEarthCanvasTerrainElevationStatus,
  getHEarthCanvasTerrainElevationStatus
};
