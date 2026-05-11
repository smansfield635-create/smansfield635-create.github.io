// /assets/h-earth/h-earth/canvas/index.js
// H_EARTH_G1_CANVAS_INDEX_CHILD_RECEIVER_TNT_v1
// Full-file replacement.
// H-Earth canvas-layer child receiver only.
//
// Purpose:
// - Convert the old single canvas file concept into a nested canvas index receiver.
// - Receive parent instances from the route.
// - Import and activate downstream canvas children.
// - Register terrain elevation relative to sea level from the terrain child.
// - Preserve parent truth immutability.
// - Keep estate placement held.
// - Keep ground-level mode held.
//
// Owns:
// - canvas-layer child intake
// - child receipt aggregation
// - canvas terrain child registration
// - elevation child exposure
// - canvas-layer summary
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - direct orbital rendering
// - controls
// - estate placement
// - ground-level scene
// - buildings
// - roads
// - parent mutation
// - image generation
// - GraphicBox
// - visual pass claim

import {
  CONTRACT as TERRAIN_ELEVATION_CONTRACT,
  ASSET_PATH as TERRAIN_ELEVATION_ASSET_PATH,
  createHEarthCanvasTerrainElevation
} from "./terrain/elevation.sea-level.js";

const CONTRACT = "H_EARTH_G1_CANVAS_INDEX_CHILD_RECEIVER_TNT_v1";
const PREWRITE = "H_EARTH_G1_CANVAS_INDEX_CHILD_RECEIVER_PREWRITE_v1";
const PREVIOUS_ROOT_CANVAS = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const ASSET_PATH = "/assets/h-earth/h-earth/canvas/index.js";

const TOTAL_CELLS = 256;

const EXPECTED_PARENT_RECEIPTS = Object.freeze({
  kernel: "H_EARTH_G1_TERRAIN_ONLY_KERNEL_TNT_v1",
  lattice256: "H_EARTH_G1_TERRAIN_ONLY_LATTICE256_TNT_v1",
  landmap: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_LANDMAP_TNT_v2",
  terrain: "H_EARTH_G1_TERRAIN_BALANCE_AND_FULL_ASPECT_DISPOSITION_TERRAIN_TNT_v2",
  surface: "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1"
});

let bootPromise = null;
let activeLayer = null;

function isObject(value) {
  return value !== null && typeof value === "object";
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
    value.terrainReceipt ||
    value.landmapReceipt ||
    value.latticeReceipt ||
    value.kernelReceipt ||
    ""
  );
}

function resolveParentInstances(context = {}) {
  const instances =
    context.instances ||
    context.parentInstances ||
    window.H_EARTH_ROUTE_PARENT_INSTANCES ||
    null;

  const valid =
    instances?.kernel &&
    instances?.lattice256 &&
    instances?.landmap &&
    instances?.terrain &&
    instances?.surface;

  if (!valid) return null;

  return {
    kernel: instances.kernel,
    lattice256: instances.lattice256,
    landmap: instances.landmap,
    terrain: instances.terrain,
    surface: instances.surface
  };
}

function collectParentReceipts(parentInstances) {
  return {
    kernel: receiptFrom(parentInstances?.kernel) || "missing",
    lattice256: receiptFrom(parentInstances?.lattice256) || "missing",
    landmap: receiptFrom(parentInstances?.landmap) || "missing",
    terrain: receiptFrom(parentInstances?.terrain) || "missing",
    surface:
      parentInstances?.surface?.receipts?.surface?.contract ||
      receiptFrom(parentInstances?.surface) ||
      "missing"
  };
}

function countStaleParents(parentReceipts) {
  return Object.entries(EXPECTED_PARENT_RECEIPTS).filter(([key, expected]) => {
    return parentReceipts[key] !== expected;
  }).length;
}

function createSummary({ parentInstances, parentReceipts, elevationChild }) {
  const elevationSummary = elevationChild?.summary || {};
  const elevationCells = Array.isArray(elevationChild?.cells) ? elevationChild.cells : [];

  const parentSurfaceReady =
    parentInstances?.surface?.summary?.surfaceParentReady === true &&
    parentInstances?.surface?.summary?.downstreamCanvasMayReadSurface === true;

  const terrainElevationReady =
    elevationSummary.elevationChildReady === true &&
    elevationCells.length === TOTAL_CELLS;

  return {
    totalCells: TOTAL_CELLS,
    canvasLayerReady: terrainElevationReady && parentSurfaceReady,
    parentInstancesPassed: Boolean(parentInstances),
    parentSurfaceReady,
    staleParentContracts: countStaleParents(parentReceipts),

    childCount: 1,
    terrainElevationChildReady: terrainElevationReady,
    terrainElevationReceipt: elevationChild?.contract || "missing",
    terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,

    seaLevelDatum: elevationSummary.seaLevelDatum ?? 0,
    belowSeaCells: elevationSummary.belowSeaCells ?? 0,
    nearSeaLevelCells: elevationSummary.nearSeaLevelCells ?? 0,
    aboveSeaCells: elevationSummary.aboveSeaCells ?? 0,
    groundLevelCandidateCells: elevationSummary.groundLevelCandidateCells ?? 0,

    estatePlacementReady: false,
    groundLevelReady: false,
    parentMutationAuthorized: false,
    visualPassClaim: false
  };
}

function makeReceipts({ parentReceipts, elevationChild, summary }) {
  return {
    canvasIndex: {
      contract: CONTRACT,
      prewrite: PREWRITE,
      previousRootCanvas: PREVIOUS_ROOT_CANVAS,
      assetPath: ASSET_PATH,
      authority: "canvas-child-receiver",
      parentMutationAuthorized: false,
      estatePlacementReady: false,
      groundLevelReady: false,
      visualPassClaim: false
    },
    parentReceipts,
    expectedParentReceipts: EXPECTED_PARENT_RECEIPTS,
    children: {
      terrainElevation: {
        contract: elevationChild?.contract || "missing",
        expected: TERRAIN_ELEVATION_CONTRACT,
        assetPath: TERRAIN_ELEVATION_ASSET_PATH,
        ready: summary.terrainElevationChildReady === true
      }
    }
  };
}

function clone(value) {
  if (!isObject(value)) return value;
  return JSON.parse(JSON.stringify(value));
}

function createHEarthCanvasLayer(context = {}) {
  const parentInstances = resolveParentInstances(context);

  if (!parentInstances) {
    const parentReceipts = {
      kernel: "missing",
      lattice256: "missing",
      landmap: "missing",
      terrain: "missing",
      surface: "missing"
    };

    const summary = {
      totalCells: TOTAL_CELLS,
      canvasLayerReady: false,
      parentInstancesPassed: false,
      parentSurfaceReady: false,
      staleParentContracts: 5,
      childCount: 0,
      terrainElevationChildReady: false,
      terrainElevationReceipt: "not-created-parent-instances-missing",
      terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,
      seaLevelDatum: 0,
      belowSeaCells: 0,
      nearSeaLevelCells: 0,
      aboveSeaCells: 0,
      groundLevelCandidateCells: 0,
      estatePlacementReady: false,
      groundLevelReady: false,
      parentMutationAuthorized: false,
      visualPassClaim: false
    };

    return {
      contract: CONTRACT,
      prewrite: PREWRITE,
      previousRootCanvas: PREVIOUS_ROOT_CANVAS,
      assetPath: ASSET_PATH,
      authority: "canvas-child-receiver",
      status: "held-parent-instances-missing",
      parentReceipts,
      summary,
      children: {},
      receipts: makeReceipts({ parentReceipts, elevationChild: null, summary }),

      getCanvasChildren() {
        return {};
      },

      getTerrainElevation() {
        return null;
      },

      getElevationCells() {
        return [];
      },

      getCellElevation() {
        return null;
      },

      getBuildGrade() {
        return null;
      }
    };
  }

  const parentReceipts = collectParentReceipts(parentInstances);

  const elevationChild = createHEarthCanvasTerrainElevation({
    kernel: parentInstances.kernel,
    lattice256: parentInstances.lattice256,
    landmap: parentInstances.landmap,
    terrain: parentInstances.terrain,
    surface: parentInstances.surface
  });

  const summary = createSummary({
    parentInstances,
    parentReceipts,
    elevationChild
  });

  const children = {
    terrainElevation: elevationChild
  };

  const receipts = makeReceipts({
    parentReceipts,
    elevationChild,
    summary
  });

  const layer = {
    contract: CONTRACT,
    prewrite: PREWRITE,
    previousRootCanvas: PREVIOUS_ROOT_CANVAS,
    assetPath: ASSET_PATH,
    authority: "canvas-child-receiver",
    status: summary.canvasLayerReady
      ? "canvas-index-child-receiver-ready"
      : "canvas-index-child-receiver-held",
    parentReceipts,
    expectedParentReceipts: EXPECTED_PARENT_RECEIPTS,
    summary,
    children,
    receipts,

    getCanvasChildren() {
      return {
        terrainElevation: {
          contract: elevationChild.contract,
          assetPath: TERRAIN_ELEVATION_ASSET_PATH,
          summary: clone(elevationChild.summary)
        }
      };
    },

    getTerrainElevation() {
      return elevationChild;
    },

    getElevationCells() {
      if (typeof elevationChild.getElevationCells === "function") {
        return elevationChild.getElevationCells();
      }

      return Array.isArray(elevationChild.cells) ? elevationChild.cells.map(clone) : [];
    },

    getCellElevation(index) {
      if (typeof elevationChild.getCellElevation === "function") {
        return elevationChild.getCellElevation(index);
      }

      const numericIndex = Number(index);
      if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= TOTAL_CELLS) {
        return null;
      }

      return clone(elevationChild.cells?.[numericIndex] || null);
    },

    getBuildGrade(index) {
      if (typeof elevationChild.getBuildGrade === "function") {
        return elevationChild.getBuildGrade(index);
      }

      const cell = this.getCellElevation(index);
      if (!cell) return null;

      return {
        index: cell.index,
        buildGradeClass: cell.buildGradeClass,
        groundLevelCandidateClass: cell.groundLevelCandidateClass,
        estateCandidate: cell.estateCandidate === true,
        groundLevelCandidate: cell.groundLevelCandidate === true,
        held: cell.held !== false,
        estatePlacementReady: false,
        groundLevelReady: false,
        parentMutationAuthorized: false
      };
    }
  };

  activeLayer = layer;
  exposeCanvasIndexApi(layer);

  return layer;
}

function exposeCanvasIndexApi(layer = activeLayer) {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    prewrite: PREWRITE,
    previousRootCanvas: PREVIOUS_ROOT_CANVAS,
    assetPath: ASSET_PATH,
    terrainElevationReceipt: TERRAIN_ELEVATION_CONTRACT,
    terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,
    create: createHEarthCanvasLayer,
    createHEarthCanvasLayer,
    createHEarthCanvasIndex: createHEarthCanvasLayer,
    boot: bootHEarthCanvasLayer,
    bootHEarthCanvasLayer,
    status: getHEarthCanvasLayerStatus,
    getStatus: getHEarthCanvasLayerStatus,
    getHEarthCanvasLayerStatus,
    getCanvasChildren: () => layer?.getCanvasChildren?.() || {},
    getTerrainElevation: () => layer?.getTerrainElevation?.() || null,
    getElevationCells: () => layer?.getElevationCells?.() || [],
    getCellElevation: (index) => layer?.getCellElevation?.(index) || null,
    getBuildGrade: (index) => layer?.getBuildGrade?.(index) || null
  };

  window.DGBHEarthCanvasLayer = api;
  window.HEarthCanvasLayer = api;
  window.H_EARTH_CANVAS_LAYER = api;
  window.H_EARTH_CANVAS_INDEX_RECEIPT = CONTRACT;

  document.documentElement.dataset.hEarthCanvasIndexReceipt = CONTRACT;
  document.documentElement.dataset.hEarthCanvasIndexAssetPath = ASSET_PATH;
  document.documentElement.dataset.hEarthCanvasTerrainElevationReceipt = TERRAIN_ELEVATION_CONTRACT;
  document.documentElement.dataset.hEarthCanvasTerrainElevationAssetPath = TERRAIN_ELEVATION_ASSET_PATH;
  document.documentElement.dataset.hEarthEstatePlacementReady = "false";
  document.documentElement.dataset.hEarthGroundLevelReady = "false";
  document.documentElement.dataset.hEarthParentMutationAuthorized = "false";
  document.documentElement.dataset.hEarthVisualPassClaim = "false";

  if (layer?.summary) {
    document.documentElement.dataset.hEarthCanvasLayerReady = String(layer.summary.canvasLayerReady === true);
    document.documentElement.dataset.hEarthGroundLevelCandidateCells = String(layer.summary.groundLevelCandidateCells || 0);
  }
}

function bootHEarthCanvasLayer(context = {}) {
  if (bootPromise) return bootPromise;

  bootPromise = Promise.resolve().then(() => {
    const layer = createHEarthCanvasLayer(context);
    activeLayer = layer;
    exposeCanvasIndexApi(layer);
    return getHEarthCanvasLayerStatus();
  });

  return bootPromise;
}

function getHEarthCanvasLayerStatus() {
  const layer = activeLayer;

  if (!layer) {
    return {
      contract: CONTRACT,
      receipt: CONTRACT,
      prewrite: PREWRITE,
      previousRootCanvas: PREVIOUS_ROOT_CANVAS,
      assetPath: ASSET_PATH,
      status: "not-booted",
      terrainElevationReceipt: TERRAIN_ELEVATION_CONTRACT,
      terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,
      canvasLayerReady: false,
      estatePlacementReady: false,
      groundLevelReady: false,
      parentMutationAuthorized: false,
      visualPassClaim: false
    };
  }

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    prewrite: PREWRITE,
    previousRootCanvas: PREVIOUS_ROOT_CANVAS,
    assetPath: ASSET_PATH,
    status: layer.status,
    parentReceipts: clone(layer.parentReceipts),
    expectedParentReceipts: EXPECTED_PARENT_RECEIPTS,
    summary: clone(layer.summary),
    children: layer.getCanvasChildren(),
    terrainElevationReceipt: TERRAIN_ELEVATION_CONTRACT,
    terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,
    canvasLayerReady: layer.summary?.canvasLayerReady === true,
    estatePlacementReady: false,
    groundLevelReady: false,
    parentMutationAuthorized: false,
    visualPassClaim: false
  };
}

exposeCanvasIndexApi();

export {
  CONTRACT,
  PREWRITE,
  PREVIOUS_ROOT_CANVAS,
  ASSET_PATH,
  TERRAIN_ELEVATION_CONTRACT,
  TERRAIN_ELEVATION_ASSET_PATH,
  EXPECTED_PARENT_RECEIPTS,
  createHEarthCanvasLayer,
  createHEarthCanvasLayer as createHEarthCanvasIndex,
  bootHEarthCanvasLayer,
  getHEarthCanvasLayerStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  prewrite: PREWRITE,
  previousRootCanvas: PREVIOUS_ROOT_CANVAS,
  assetPath: ASSET_PATH,
  terrainElevationReceipt: TERRAIN_ELEVATION_CONTRACT,
  terrainElevationAssetPath: TERRAIN_ELEVATION_ASSET_PATH,
  create: createHEarthCanvasLayer,
  createHEarthCanvasLayer,
  createHEarthCanvasIndex: createHEarthCanvasLayer,
  boot: bootHEarthCanvasLayer,
  bootHEarthCanvasLayer,
  status: getHEarthCanvasLayerStatus,
  getStatus: getHEarthCanvasLayerStatus,
  getHEarthCanvasLayerStatus
};
