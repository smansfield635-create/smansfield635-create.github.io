// /assets/hearth/hearth.canvas.finger.material.js
// HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Material / Surface-Mineral Authority.
// Purpose:
// - Establish Material as the fourth planetary-disposition expansion finger after Landform, Elevation, and Hydrology.
// - Consume Hydrology water-level packets when available.
// - Consume Elevation relief packets when available.
// - Convert Hearth's body, relief, and water logic into visible material grammar:
//   exposed stone, old basin sediment, coastal shelf mineral sorting, wet rock, dry highland crust,
//   river-worn corridors, clay margins, mineral veins, dark basin floor, and weathered surface tone.
// - Preserve Landform as body definition, Elevation as relief definition, Hydrology as water-level definition.
// - Preserve Surface as the pointer/socket lane when available.
// - Publish material, atmosphere-prep, lighting-prep, composite-prep, and inspect-prep packets.
// - Continue expansion on the already-instilled finger architecture; do not treat this as reintegration.
// - Never mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Landform, Elevation, Hydrology, Surface, or any other finger file.
// - Never claim final terrain truth, final hydrology truth, final material truth, final atmospheric truth, final lighting truth, final visual pass, F13, F21, ready text, generated image, GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-material-surface-mineral-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const HYDROLOGY_CONTRACT = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_TNT_v1";
  const ELEVATION_CONTRACT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;

  const FINGER_NAME = "material";
  const FINGER_ROLE = "surface-mineral-authority";
  const FINGER_ORDER = 4;
  const PLANETARY_DISPOSITION_INDEX = 4;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_MATERIALIZED";

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,

    terrainTruthClaimed: false,
    elevationTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    finalMaterialTruthClaimed: false,
    atmosphericTruthClaimed: false,
    lightingTruthClaimed: false,
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,

    expressionComplete: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const FINGER_SEQUENCE = Object.freeze([
    "landform",
    "elevation",
    "hydrology",
    "material",
    "atmosphere",
    "lighting",
    "composite",
    "inspect"
  ]);

  const FINGER_FILES = Object.freeze({
    landform: LANDFORM_FILE,
    elevation: ELEVATION_FILE,
    hydrology: HYDROLOGY_FILE,
    material: FILE,
    atmosphere: ATMOSPHERE_FILE,
    lighting: LIGHTING_FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

  const HYDROLOGY_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerHydrology",
    "HEARTH.canvasHydrologyFinger",
    "HEARTH_CANVAS_FINGER_HYDROLOGY",
    "HEARTH_CANVAS_HYDROLOGY_FINGER",
    "HEARTH_CANVAS_FINGER_HYDROLOGY_PACKET",
    "HEARTH_HYDROLOGY_TO_MATERIAL_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerHydrology",
    "DEXTER_LAB.hearthCanvasHydrologyFinger"
  ]);

  const ELEVATION_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerElevation",
    "HEARTH.canvasElevationFinger",
    "HEARTH_CANVAS_FINGER_ELEVATION",
    "HEARTH_CANVAS_ELEVATION_FINGER",
    "HEARTH_CANVAS_FINGER_ELEVATION_PACKET",
    "DEXTER_LAB.hearthCanvasFingerElevation",
    "DEXTER_LAB.hearthCanvasElevationFinger"
  ]);

  const SURFACE_POINTER_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger"
  ]);

  const SURFACE_POINTER_METHODS = Object.freeze([
    "receiveInternalFingerPacket",
    "receiveExpansionFingerPacket",
    "receiveMaterialFingerPacket",
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "registerExpressionFinger",
    "receiveExpressionPacket"
  ]);

  const HUB_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveExpressionFingerPacket",
    "receiveCanvasExpressionPacket",
    "receiveMaterialFingerPacket",
    "receiveMaterialPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const MATERIAL_CLASSES = Object.freeze({
    DEEP_BASIN_SILT: "deep-basin-silt",
    OCEANIC_DARK_STONE: "oceanic-dark-stone",
    SHELF_MINERAL_SAND: "shelf-mineral-sand",
    RIVER_WORN_STONE: "river-worn-stone",
    WETLAND_CLAY: "wetland-clay",
    SPRING_MINERAL_VEIN: "spring-mineral-vein",
    AQUIFER_DARK_SOIL: "aquifer-dark-soil",
    EXPOSED_HIGHLAND_STONE: "exposed-highland-stone",
    DRY_CRUST: "dry-crust",
    WEATHERED_GROUND: "weathered-ground"
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    worldName: WORLD_NAME,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,
    planetaryDisposition: PLANETARY_DISPOSITION,
    expansionMode: "CHRONOLOGICAL_EXPANSION_ON_INSTILLED_ARCHITECTURE",
    reintegrationMode: "NOT_REINTEGRATION",

    hydrologyFile: HYDROLOGY_FILE,
    hydrologyContractExpected: HYDROLOGY_CONTRACT,
    hydrologyDependencyExpected: true,
    hydrologyDependencyObserved: false,
    hydrologyAuthoritySourceName: "NONE",
    hydrologyPacketObserved: false,
    hydrologyReceiptObserved: false,
    hydrologyMaterialPrepObserved: false,
    hydrologyNodeCount: 0,
    hydrology256ScopeObserved: false,
    hydrologyFallbackUsed: false,
    hydrologyReadError: "",

    elevationFile: ELEVATION_FILE,
    elevationContractExpected: ELEVATION_CONTRACT,
    elevationDependencyExpected: true,
    elevationDependencyObserved: false,
    elevationAuthoritySourceName: "NONE",
    elevationPacketObserved: false,
    elevationReceiptObserved: false,
    elevationNodeCount: 0,
    elevation256ScopeObserved: false,
    elevationFallbackUsed: false,
    elevationReadError: "",

    surfacePointerExpected: true,
    surfacePointerObserved: false,
    surfacePointerSourceName: "NONE",
    surfacePointerRegistrationAttempted: false,
    surfacePointerRegistrationAccepted: false,
    surfacePointerRegistrationMethod: "NONE",
    surfacePointerRegistrationHeldReason: "NOT_ATTEMPTED",
    surfacePointerRegistrationError: "",

    materialFingerLoaded: true,
    materialFingerActive: true,
    surfaceMineralAuthorityActive: true,
    materialModelReady: false,
    materialPacketReady: false,
    diagnostic256Ready: false,

    baseRockMapReady: false,
    sedimentMapReady: false,
    wetnessMaterialMapReady: false,
    mineralPressureMapReady: false,
    soilMapReady: false,
    shorelineMaterialMapReady: false,
    exposedStoneMapReady: false,
    materialColorHintMapReady: false,
    materialRoughnessMapReady: false,
    compositeMaterialMapReady: false,

    atmosphereMaterialPrepPacketReady: false,
    lightingMaterialPrepPacketReady: false,
    compositeMaterialPrepPacketReady: false,
    inspectPrepPacketReady: false,

    materialNodeCount: 0,
    deepBasinSiltNodeCount: 0,
    oceanicDarkStoneNodeCount: 0,
    shelfMineralSandNodeCount: 0,
    riverWornStoneNodeCount: 0,
    wetlandClayNodeCount: 0,
    springMineralVeinNodeCount: 0,
    aquiferDarkSoilNodeCount: 0,
    exposedHighlandStoneNodeCount: 0,
    dryCrustNodeCount: 0,
    weatheredGroundNodeCount: 0,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "MATERIAL_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "MATERIAL_FINGER_WAITING_BOOT",

    hydrologyEvidence: null,
    hydrologyPacket: null,
    hydrologyReceipt: null,
    hydrologyMaterialPrepPacket: null,
    hydrologyNodes: [],

    elevationEvidence: null,
    elevationPacket: null,
    elevationReceipt: null,
    elevationNodes: [],

    materialModel: null,
    materialPacket: null,
    atmosphereMaterialPrepPacket: null,
    lightingMaterialPrepPacket: null,
    compositeMaterialPrepPacket: null,
    inspectPrepPacket: null,

    localEvents: [],
    errors: [],

    booted: false,
    mounted: false,

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places = 6) {
    const p = Math.pow(10, places);
    return Math.round(safeNumber(value, 0) * p) / p;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "MATERIAL_FINGER_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "MATERIAL_FINGER_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 100);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function findSource(sourceNames) {
    for (const sourceName of sourceNames) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          source: candidate,
          sourceName
        };
      }
    }

    return {
      source: null,
      sourceName: "NONE"
    };
  }

  function callFirstObject(authority, methods) {
    if (!authority || !isObject(authority)) return null;

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method]();
        if (isObject(result)) return result;
      } catch (error) {
        recordError("MATERIAL_FINGER_AUTHORITY_READ_METHOD_FAILED", error, {
          method
        });
      }
    }

    return null;
  }

  function getFirstNumber(source, keys, fallback = 0) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return safeNumber(source[key], fallback);
      }
    }

    return fallback;
  }

  function getFirstString(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== "") {
        return safeString(source[key], fallback);
      }
    }

    return fallback;
  }

  function getFirstBool(source, keys, fallback = false) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return safeBool(source[key], fallback);
      }
    }

    return fallback;
  }

  function hashNoise(a, b, seed = 0) {
    const x = Math.sin((a + 1) * 127.1 + (b + 1) * 311.7 + seed * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function gaussian2(x, y, cx, cy, sx, sy, weight) {
    const dx = (x - cx) / Math.max(0.0001, sx);
    const dy = (y - cy) / Math.max(0.0001, sy);
    return Math.exp(-0.5 * ((dx * dx) + (dy * dy))) * weight;
  }

  function buildFallbackHydrologyNodes() {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = (col + 0.5) / GRID_SIZE;
      const y = (row + 0.5) / GRID_SIZE;

      const basin = clamp(
        gaussian2(x, y, 0.50, 0.56, 0.20, 0.22, 0.82) +
        gaussian2(x, y, 0.18, 0.64, 0.14, 0.24, 0.34),
        0,
        1
      );

      const shelf = clamp(
        gaussian2(x, y, 0.58, 0.77, 0.30, 0.12, 0.72) +
        gaussian2(x, y, 0.80, 0.45, 0.12, 0.32, 0.34),
        0,
        1
      );

      const river = clamp(
        gaussian2(x, y, 0.45, 0.30, 0.05, 0.36, 0.60) +
        gaussian2(x, y, 0.62, 0.40, 0.04, 0.30, 0.48),
        0,
        1
      );

      const elevation = clamp(0.50 - basin * 0.26 + shelf * 0.08 + (hashNoise(index, 8, 55) - 0.5) * 0.09, 0, 1);
      const waterDepth = clamp((0.42 - elevation) * 1.4 + basin * 0.22 + shelf * 0.09, 0, 1);
      const aquiferPressure = clamp(basin * 0.45 + (1 - elevation) * 0.28 + shelf * 0.20, 0, 1);
      const springPotential = clamp(aquiferPressure * 0.46 + river * 0.18 + hashNoise(index, 4, 17) * 0.12, 0, 1);
      const waterfallPotential = clamp(river * 0.35 + Math.max(0, elevation - 0.58) * 0.48, 0, 1);

      let waterClass = "DRY_UPLAND";
      if (waterDepth > 0.32) waterClass = "DEEP_BASIN_SEA";
      else if (waterDepth > 0.18) waterClass = "OCEAN_BODY";
      else if (waterDepth > 0.09 && shelf > 0.40) waterClass = "SHELF_SEA";
      else if (river > 0.55) waterClass = "RIVER_CHANNEL";
      else if (waterDepth > 0.04 && shelf > 0.38) waterClass = "WETLAND_MARGIN";
      else if (springPotential > 0.60) waterClass = "SPRING_POINT";
      else if (aquiferPressure > 0.55) waterClass = "SUBTERRANEAN_AQUIFER";

      nodes.push({
        index,
        id: `HEARTH_HYDROLOGY_NODE_${String(index + 1).padStart(3, "0")}`,
        row,
        col,
        x: round(x),
        y: round(y),
        worldName: WORLD_NAME,
        elevation: round(elevation),
        slope: round(clamp(river * 0.25 + Math.abs(elevation - 0.48) * 0.32, 0, 1)),
        basinScore: round(basin),
        shelfScore: round(shelf),
        riftScore: round(clamp(gaussian2(x, y, 0.58, 0.52, 0.07, 0.33, 0.62), 0, 1)),
        landScore: round(clamp(elevation + 0.18, 0, 1)),
        waterClass,
        waterPresence: round(clamp(waterDepth + river * 0.22 + aquiferPressure * 0.16, 0, 1)),
        waterDepth: round(waterDepth),
        aboveSurfaceWater: waterDepth > 0.04 || river > 0.55,
        subsurfaceWater: aquiferPressure > 0.45,
        oceanBasin: waterClass === "DEEP_BASIN_SEA" || waterClass === "OCEAN_BODY",
        shelfWater: waterClass === "SHELF_SEA",
        inlandLake: waterDepth > 0.10 && basin > 0.58 && waterClass !== "OCEAN_BODY",
        riverChannel: waterClass === "RIVER_CHANNEL",
        wetland: waterClass === "WETLAND_MARGIN",
        aquiferPressure: round(aquiferPressure),
        springPotential: round(springPotential),
        waterfallPotential: round(waterfallPotential),
        waterTableDepth: round(clamp(1 - aquiferPressure + elevation * 0.18, 0, 1)),
        erosionPotential: round(clamp(river * 0.38 + waterDepth * 0.20 + elevation * 0.12, 0, 1)),
        sedimentDepositPotential: round(clamp(basin * 0.34 + shelf * 0.36 + (1 - elevation) * 0.14, 0, 1)),
        humidityContribution: round(clamp(waterDepth * 0.44 + aquiferPressure * 0.22, 0, 1)),
        reflectanceContribution: round(clamp(waterDepth * 0.52 + shelf * 0.18, 0, 1)),
        finalHydrologyTruthClaim: false,
        finalVisualClaim: false
      });
    }

    return nodes;
  }

  function buildFallbackElevationNodesFromHydrology(hydrologyNodes) {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const h = hydrologyNodes[index] || {};
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      nodes.push({
        index,
        id: `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`,
        row,
        col,
        x: getFirstNumber(h, ["x"], (col + 0.5) / GRID_SIZE),
        y: getFirstNumber(h, ["y"], (row + 0.5) / GRID_SIZE),
        worldName: WORLD_NAME,
        elevation: getFirstNumber(h, ["elevation", "normalizedHeight"], 0.44),
        normalizedHeight: getFirstNumber(h, ["elevation", "normalizedHeight"], 0.44),
        slope: getFirstNumber(h, ["slope"], 0.12),
        basinScore: getFirstNumber(h, ["basinScore"], 0),
        shelfScore: getFirstNumber(h, ["shelfScore"], 0),
        upliftScore: clamp(getFirstNumber(h, ["elevation"], 0.44) + 0.05, 0, 1),
        riftScore: getFirstNumber(h, ["riftScore"], 0),
        landScore: getFirstNumber(h, ["landScore"], 0.5),
        reliefClass: getFirstString(h, ["reliefClass"], "FALLBACK_RELIEF_FROM_HYDROLOGY"),
        finalElevationTruthClaim: false,
        finalVisualClaim: false
      });
    }

    return nodes;
  }

  function extractPacketFrom(value, packetKeys) {
    if (!isObject(value)) return null;

    for (const key of packetKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (
      Array.isArray(value.materialPrepNodes) ||
      Array.isArray(value.hydrologyNodes) ||
      Array.isArray(value.elevationNodes) ||
      Array.isArray(value.waterPresenceMap) ||
      Array.isArray(value.sedimentDepositMap) ||
      Array.isArray(value.heightfieldMap)
    ) {
      return value;
    }

    return null;
  }

  function extractReceiptFrom(value) {
    if (!isObject(value)) return null;

    const directKeys = ["receipt", "receiptLight", "currentReceipt", "state"];

    for (const key of directKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (value.contract || value.receipt || value.file) return value;

    return null;
  }

  function extractHydrologyNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.hydrologyNodes,
      packet.nodes,
      packet.materialPrepNodes,
      packet.hydrologyModel && packet.hydrologyModel.hydrologyNodes,
      packet.materialHydrologyPrepPacket && packet.materialHydrologyPrepPacket.hydrologyNodes,
      packet.compositeHydrologyPrepPacket && packet.compositeHydrologyPrepPacket.hydrologyNodes,
      packet.original && packet.original.hydrologyNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    const waterPresenceMap = Array.isArray(packet.waterPresenceMap) ? packet.waterPresenceMap : null;
    const waterDepthMap = Array.isArray(packet.waterDepthMap) ? packet.waterDepthMap : null;

    if (waterPresenceMap && waterPresenceMap.length === NODE_COUNT) {
      return waterPresenceMap.map((waterPresence, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const waterDepth = waterDepthMap ? waterDepthMap[index] : waterPresence * 0.4;

        return {
          index,
          row,
          col,
          x: (col + 0.5) / GRID_SIZE,
          y: (row + 0.5) / GRID_SIZE,
          waterPresence,
          waterDepth,
          waterClass: waterDepth > 0.24 ? "OCEAN_BODY" : waterPresence > 0.40 ? "WETLAND_MARGIN" : "DRY_UPLAND"
        };
      });
    }

    return [];
  }

  function extractElevationNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.elevationNodes,
      packet.nodes,
      packet.elevationModel && packet.elevationModel.elevationNodes,
      packet.hydrologyReliefPrepPacket && packet.hydrologyReliefPrepPacket.elevationNodes,
      packet.compositeReliefPrepPacket && packet.compositeReliefPrepPacket.elevationNodes,
      packet.original && packet.original.elevationNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    return [];
  }

  function normalizeHydrologyNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_HYDROLOGY_NODE_${String(index + 1).padStart(3, "0")}`),
      row,
      col,
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1)),
      worldName: WORLD_NAME,

      sourceDistrict: getFirstString(raw, ["sourceDistrict", "district", "zone"], "UNSPECIFIED"),
      sourceClass: getFirstString(raw, ["sourceClass", "class"], "UNSPECIFIED"),
      reliefClass: getFirstString(raw, ["reliefClass"], "UNSPECIFIED"),

      elevation: round(clamp(getFirstNumber(raw, ["elevation", "normalizedHeight", "height"], 0.44), 0, 1)),
      slope: round(clamp(getFirstNumber(raw, ["slope"], 0.10), 0, 1)),
      basinScore: round(clamp(getFirstNumber(raw, ["basinScore"], 0), 0, 1)),
      shelfScore: round(clamp(getFirstNumber(raw, ["shelfScore"], 0), 0, 1)),
      riftScore: round(clamp(getFirstNumber(raw, ["riftScore"], 0), 0, 1)),
      landScore: round(clamp(getFirstNumber(raw, ["landScore"], 0.5), 0, 1)),

      waterClass: getFirstString(raw, ["waterClass", "hydrologyClass"], "DRY_UPLAND"),
      waterPresence: round(clamp(getFirstNumber(raw, ["waterPresence"], 0), 0, 1)),
      waterDepth: round(clamp(getFirstNumber(raw, ["waterDepth"], 0), 0, 1)),
      aboveSurfaceWater: getFirstBool(raw, ["aboveSurfaceWater"], false),
      subsurfaceWater: getFirstBool(raw, ["subsurfaceWater"], false),
      oceanBasin: getFirstBool(raw, ["oceanBasin"], false),
      shelfWater: getFirstBool(raw, ["shelfWater"], false),
      inlandLake: getFirstBool(raw, ["inlandLake"], false),
      riverChannel: getFirstBool(raw, ["riverChannel"], false),
      wetland: getFirstBool(raw, ["wetland"], false),

      aquiferPressure: round(clamp(getFirstNumber(raw, ["aquiferPressure"], 0), 0, 1)),
      springPotential: round(clamp(getFirstNumber(raw, ["springPotential"], 0), 0, 1)),
      waterfallPotential: round(clamp(getFirstNumber(raw, ["waterfallPotential"], 0), 0, 1)),
      waterTableDepth: round(clamp(getFirstNumber(raw, ["waterTableDepth"], 1), 0, 1)),
      erosionPotential: round(clamp(getFirstNumber(raw, ["erosionPotential"], 0), 0, 1)),
      sedimentDepositPotential: round(clamp(getFirstNumber(raw, ["sedimentDepositPotential"], 0), 0, 1)),
      humidityContribution: round(clamp(getFirstNumber(raw, ["humidityContribution"], 0), 0, 1)),
      reflectanceContribution: round(clamp(getFirstNumber(raw, ["reflectanceContribution"], 0), 0, 1)),

      finalHydrologyTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeElevationNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`),
      row,
      col,
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1)),
      worldName: WORLD_NAME,
      elevation: round(clamp(getFirstNumber(raw, ["elevation", "normalizedHeight", "height"], 0.44), 0, 1)),
      normalizedHeight: round(clamp(getFirstNumber(raw, ["normalizedHeight", "elevation", "height"], 0.44), 0, 1)),
      slope: round(clamp(getFirstNumber(raw, ["slope"], 0.10), 0, 1)),
      basinScore: round(clamp(getFirstNumber(raw, ["basinScore"], 0), 0, 1)),
      shelfScore: round(clamp(getFirstNumber(raw, ["shelfScore"], 0), 0, 1)),
      upliftScore: round(clamp(getFirstNumber(raw, ["upliftScore"], 0.44), 0, 1)),
      riftScore: round(clamp(getFirstNumber(raw, ["riftScore"], 0), 0, 1)),
      landScore: round(clamp(getFirstNumber(raw, ["landScore"], 0.5), 0, 1)),
      reliefClass: getFirstString(raw, ["reliefClass"], "UNSPECIFIED"),
      finalElevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function readHydrologyEvidence(options = {}) {
    const found = findSource(HYDROLOGY_SOURCE_NAMES);

    state.hydrologyDependencyObserved = Boolean(found.source);
    state.hydrologyAuthoritySourceName = found.sourceName;
    state.hydrologyReadError = "";

    let packet = null;
    let receipt = null;
    let materialPrep = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getMaterialHydrologyPrepPacket",
          "getHydrologyPacket",
          "getHydrologyModel",
          "getCompositeHydrologyPrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          "materialHydrologyPrepPacket",
          "hydrologyPacket",
          "packet",
          "hydrologyModel",
          "compositeHydrologyPrepPacket"
        ]);

        if (packetCandidate && packetCandidate.packetType === "HEARTH_HYDROLOGY_TO_MATERIAL_PREP_PACKET") {
          materialPrep = packetCandidate;
        } else if (packet && packet.packetType === "HEARTH_HYDROLOGY_TO_MATERIAL_PREP_PACKET") {
          materialPrep = packet;
        } else if (packet && isObject(packet.materialHydrologyPrepPacket)) {
          materialPrep = packet.materialHydrologyPrepPacket;
        }

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.hydrologyReadError = error && error.message ? String(error.message) : String(error);
        recordError("MATERIAL_FINGER_HYDROLOGY_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.hydrologyPacket && isObject(options.hydrologyPacket)) {
      packet = options.hydrologyPacket;
      state.hydrologyDependencyObserved = true;
      state.hydrologyAuthoritySourceName = "OPTIONS_HYDROLOGY_PACKET";
    }

    if (options.materialHydrologyPrepPacket && isObject(options.materialHydrologyPrepPacket)) {
      materialPrep = options.materialHydrologyPrepPacket;
      state.hydrologyDependencyObserved = true;
      state.hydrologyAuthoritySourceName = "OPTIONS_MATERIAL_HYDROLOGY_PREP_PACKET";
    }

    const packetForNodes = materialPrep || packet;
    const rawNodes = extractHydrologyNodes(packetForNodes);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeHydrologyNode(entry, index));
    }

    if (nodes.length < NODE_COUNT) {
      nodes = buildFallbackHydrologyNodes();
    }

    state.hydrologyPacketObserved = Boolean(packet);
    state.hydrologyReceiptObserved = Boolean(receipt);
    state.hydrologyMaterialPrepObserved = Boolean(materialPrep);
    state.hydrologyNodeCount = nodes.length;
    state.hydrology256ScopeObserved = nodes.length === NODE_COUNT;
    state.hydrologyFallbackUsed = !packetForNodes || rawNodes.length === 0;

    state.hydrologyPacket = clonePlain(packet);
    state.hydrologyReceipt = clonePlain(receipt);
    state.hydrologyMaterialPrepPacket = clonePlain(materialPrep);
    state.hydrologyNodes = clonePlain(nodes);

    const evidence = {
      observed: state.hydrologyDependencyObserved,
      sourceName: state.hydrologyAuthoritySourceName,
      packetObserved: state.hydrologyPacketObserved,
      receiptObserved: state.hydrologyReceiptObserved,
      materialPrepObserved: state.hydrologyMaterialPrepObserved,
      nodeCount: state.hydrologyNodeCount,
      diagnostic256Ready: state.hydrology256ScopeObserved,
      fallbackUsed: state.hydrologyFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      materialPrepPacket: clonePlain(materialPrep),
      nodes: clonePlain(nodes)
    };

    state.hydrologyEvidence = clonePlain(evidence);

    record("MATERIAL_FINGER_HYDROLOGY_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      materialPrepObserved: evidence.materialPrepObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function readElevationEvidence(options = {}) {
    const found = findSource(ELEVATION_SOURCE_NAMES);

    state.elevationDependencyObserved = Boolean(found.source);
    state.elevationAuthoritySourceName = found.sourceName;
    state.elevationReadError = "";

    let packet = null;
    let receipt = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getElevationPacket",
          "getElevationModel",
          "getCompositeReliefPrepPacket",
          "getHydrologyReliefPrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          "elevationPacket",
          "packet",
          "elevationModel",
          "compositeReliefPrepPacket",
          "hydrologyReliefPrepPacket"
        ]);

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.elevationReadError = error && error.message ? String(error.message) : String(error);
        recordError("MATERIAL_FINGER_ELEVATION_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.elevationPacket && isObject(options.elevationPacket)) {
      packet = options.elevationPacket;
      state.elevationDependencyObserved = true;
      state.elevationAuthoritySourceName = "OPTIONS_ELEVATION_PACKET";
    }

    const rawNodes = extractElevationNodes(packet);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeElevationNode(entry, index));
    }

    if (nodes.length < NODE_COUNT) {
      nodes = buildFallbackElevationNodesFromHydrology(state.hydrologyNodes.length ? state.hydrologyNodes : buildFallbackHydrologyNodes());
    }

    state.elevationPacketObserved = Boolean(packet);
    state.elevationReceiptObserved = Boolean(receipt);
    state.elevationNodeCount = nodes.length;
    state.elevation256ScopeObserved = nodes.length === NODE_COUNT;
    state.elevationFallbackUsed = !packet || rawNodes.length === 0;

    state.elevationPacket = clonePlain(packet);
    state.elevationReceipt = clonePlain(receipt);
    state.elevationNodes = clonePlain(nodes);

    const evidence = {
      observed: state.elevationDependencyObserved,
      sourceName: state.elevationAuthoritySourceName,
      packetObserved: state.elevationPacketObserved,
      receiptObserved: state.elevationReceiptObserved,
      nodeCount: state.elevationNodeCount,
      diagnostic256Ready: state.elevation256ScopeObserved,
      fallbackUsed: state.elevationFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      nodes: clonePlain(nodes)
    };

    state.elevationEvidence = clonePlain(evidence);

    record("MATERIAL_FINGER_ELEVATION_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function materialClassFor(h, e, mineralPressure, stoneExposure, sediment, wetness) {
    if (h.waterClass === "DEEP_BASIN_SEA") return MATERIAL_CLASSES.DEEP_BASIN_SILT;
    if (h.waterClass === "OCEAN_BODY") return MATERIAL_CLASSES.OCEANIC_DARK_STONE;
    if (h.shelfWater || h.waterClass === "SHELF_SEA") return MATERIAL_CLASSES.SHELF_MINERAL_SAND;
    if (h.riverChannel || h.waterClass === "RIVER_CHANNEL") return MATERIAL_CLASSES.RIVER_WORN_STONE;
    if (h.wetland || h.waterClass === "WETLAND_MARGIN") return MATERIAL_CLASSES.WETLAND_CLAY;
    if (h.springPotential >= 0.58) return MATERIAL_CLASSES.SPRING_MINERAL_VEIN;
    if (h.subsurfaceWater || h.aquiferPressure >= 0.55) return MATERIAL_CLASSES.AQUIFER_DARK_SOIL;
    if (stoneExposure >= 0.66 || e.elevation >= 0.68) return MATERIAL_CLASSES.EXPOSED_HIGHLAND_STONE;
    if (wetness <= 0.08 && e.elevation >= 0.52) return MATERIAL_CLASSES.DRY_CRUST;
    if (sediment >= 0.44) return MATERIAL_CLASSES.WEATHERED_GROUND;
    if (mineralPressure >= 0.55) return MATERIAL_CLASSES.SPRING_MINERAL_VEIN;
    return MATERIAL_CLASSES.WEATHERED_GROUND;
  }

  function materialStory(materialClass) {
    if (materialClass === MATERIAL_CLASSES.DEEP_BASIN_SILT) {
      return "Old depth presses fine material into the basin floor; the water keeps the sediment quiet.";
    }

    if (materialClass === MATERIAL_CLASSES.OCEANIC_DARK_STONE) {
      return "The drowned body darkens below open water, carrying stone rather than visible soil.";
    }

    if (materialClass === MATERIAL_CLASSES.SHELF_MINERAL_SAND) {
      return "The shelf sorts minerals along the shallow edge where future coasts can become readable.";
    }

    if (materialClass === MATERIAL_CLASSES.RIVER_WORN_STONE) {
      return "Moving water wears the path into a corridor of rounded stone and exposed channel memory.";
    }

    if (materialClass === MATERIAL_CLASSES.WETLAND_CLAY) {
      return "Slow water holds clay at the margin, making the ground soft, heavy, and biologically ready.";
    }

    if (materialClass === MATERIAL_CLASSES.SPRING_MINERAL_VEIN) {
      return "Subsurface pressure leaves a mineral signature where the under-body reaches the surface.";
    }

    if (materialClass === MATERIAL_CLASSES.AQUIFER_DARK_SOIL) {
      return "Water below the surface darkens the material without yet becoming visible water.";
    }

    if (materialClass === MATERIAL_CLASSES.EXPOSED_HIGHLAND_STONE) {
      return "High relief exposes older stone, making the raised body harder and brighter at the edge.";
    }

    if (materialClass === MATERIAL_CLASSES.DRY_CRUST) {
      return "Dry upper ground becomes crusted, wind-ready, and available for later light and atmosphere.";
    }

    return "Weathered ground keeps the surface readable between stone, water, sediment, and dry crust.";
  }

  function materialColorHint(materialClass, node) {
    const wetness = node.wetnessMaterial;
    const mineral = node.mineralPressure;

    if (materialClass === MATERIAL_CLASSES.DEEP_BASIN_SILT) return "deep-blue-black-silt";
    if (materialClass === MATERIAL_CLASSES.OCEANIC_DARK_STONE) return "submerged-indigo-stone";
    if (materialClass === MATERIAL_CLASSES.SHELF_MINERAL_SAND) return "pale-gold-mineral-shelf";
    if (materialClass === MATERIAL_CLASSES.RIVER_WORN_STONE) return "cool-river-gray-stone";
    if (materialClass === MATERIAL_CLASSES.WETLAND_CLAY) return "green-brown-wet-clay";
    if (materialClass === MATERIAL_CLASSES.SPRING_MINERAL_VEIN) return mineral > 0.70 ? "bright-mineral-vein" : "soft-mineral-thread";
    if (materialClass === MATERIAL_CLASSES.AQUIFER_DARK_SOIL) return wetness > 0.42 ? "dark-wet-soil" : "shadowed-under-soil";
    if (materialClass === MATERIAL_CLASSES.EXPOSED_HIGHLAND_STONE) return "warm-highland-stone";
    if (materialClass === MATERIAL_CLASSES.DRY_CRUST) return "dry-ochre-crust";
    return "weathered-earth-tone";
  }

  function buildMaterialModel(options = {}) {
    const hydrology = readHydrologyEvidence(options);
    const elevation = readElevationEvidence(options);

    const hydrologyNodes = hydrology.nodes.length === NODE_COUNT ? hydrology.nodes : buildFallbackHydrologyNodes();
    const elevationNodes = elevation.nodes.length === NODE_COUNT
      ? elevation.nodes
      : buildFallbackElevationNodesFromHydrology(hydrologyNodes);

    const materialNodes = hydrologyNodes.map((h, index) => {
      const e = elevationNodes[index] || {};
      const noise = hashNoise(index, 13, 41);

      const wetnessMaterial = clamp(
        (h.waterPresence * 0.36) +
        (h.waterDepth * 0.30) +
        (h.aquiferPressure * 0.18) +
        (h.wetland ? 0.15 : 0),
        0,
        1
      );

      const sediment = clamp(
        (h.sedimentDepositPotential * 0.42) +
        (h.basinScore * 0.24) +
        (h.shelfScore * 0.18) +
        ((1 - h.slope) * 0.10),
        0,
        1
      );

      const mineralPressure = clamp(
        (h.springPotential * 0.24) +
        (h.riftScore * 0.22) +
        (h.aquiferPressure * 0.16) +
        (e.upliftScore * 0.15) +
        (noise * 0.18),
        0,
        1
      );

      const stoneExposure = clamp(
        (e.elevation * 0.32) +
        (e.slope * 0.30) +
        (e.upliftScore * 0.22) +
        (h.erosionPotential * 0.16) -
        (h.waterDepth * 0.18),
        0,
        1
      );

      const soilPotential = clamp(
        ((1 - stoneExposure) * 0.30) +
        (sediment * 0.30) +
        (wetnessMaterial * 0.20) +
        ((1 - h.waterDepth) * 0.10),
        0,
        1
      );

      const shorelineMaterial = clamp(
        (h.shelfWater ? 0.44 : 0) +
        (h.shelfScore * 0.30) +
        (h.waterDepth * 0.10) +
        (sediment * 0.16),
        0,
        1
      );

      const roughness = clamp(
        (stoneExposure * 0.34) +
        (e.slope * 0.24) +
        ((1 - wetnessMaterial) * 0.16) +
        (mineralPressure * 0.08),
        0,
        1
      );

      const materialClass = materialClassFor(h, e, mineralPressure, stoneExposure, sediment, wetnessMaterial);
      const colorHint = materialColorHint(materialClass, {
        wetnessMaterial,
        mineralPressure
      });

      const lightAbsorption = clamp(
        (wetnessMaterial * 0.28) +
        (h.waterDepth * 0.32) +
        (materialClass === MATERIAL_CLASSES.OCEANIC_DARK_STONE ? 0.20 : 0) +
        (materialClass === MATERIAL_CLASSES.DEEP_BASIN_SILT ? 0.16 : 0),
        0,
        1
      );

      const highlightPotential = clamp(
        (shorelineMaterial * 0.24) +
        (mineralPressure * 0.22) +
        (stoneExposure * 0.18) +
        (h.reflectanceContribution * 0.18),
        0,
        1
      );

      const atmosphereDustPotential = clamp(
        (materialClass === MATERIAL_CLASSES.DRY_CRUST ? 0.42 : 0) +
        ((1 - wetnessMaterial) * 0.14) +
        (soilPotential * 0.12),
        0,
        1
      );

      return {
        index,
        id: `HEARTH_MATERIAL_NODE_${String(index + 1).padStart(3, "0")}`,
        row: h.row,
        col: h.col,
        x: h.x,
        y: h.y,
        worldName: WORLD_NAME,

        sourceHydrologyId: h.id,
        sourceElevationId: e.id || "",
        waterClass: h.waterClass,
        reliefClass: e.reliefClass || h.reliefClass,

        elevation: e.elevation === undefined ? h.elevation : e.elevation,
        slope: e.slope === undefined ? h.slope : e.slope,
        waterPresence: h.waterPresence,
        waterDepth: h.waterDepth,
        aquiferPressure: h.aquiferPressure,
        springPotential: h.springPotential,
        waterfallPotential: h.waterfallPotential,
        sedimentDepositPotential: h.sedimentDepositPotential,
        erosionPotential: h.erosionPotential,

        materialClass,
        colorHint,
        wetnessMaterial: round(wetnessMaterial),
        sedimentMaterial: round(sediment),
        mineralPressure: round(mineralPressure),
        stoneExposure: round(stoneExposure),
        soilPotential: round(soilPotential),
        shorelineMaterial: round(shorelineMaterial),
        roughness: round(roughness),

        baseRock: round(stoneExposure),
        sediment: round(sediment),
        wetness: round(wetnessMaterial),
        mineral: round(mineralPressure),
        soil: round(soilPotential),
        shoreline: round(shorelineMaterial),
        exposedStone: round(stoneExposure),

        atmospherePrep: {
          dustPotential: round(atmosphereDustPotential),
          wetSurfaceHumidityHold: round(clamp(wetnessMaterial * 0.42 + h.humidityContribution * 0.34, 0, 1)),
          mineralAerosolHint: round(clamp(mineralPressure * 0.18 + shorelineMaterial * 0.12, 0, 1))
        },

        lightingPrep: {
          lightAbsorption: round(lightAbsorption),
          highlightPotential: round(highlightPotential),
          surfaceRoughness: round(roughness),
          wetReflectiveMaterial: round(clamp(wetnessMaterial * 0.42 + h.reflectanceContribution * 0.32, 0, 1)),
          mineralGlint: round(clamp(mineralPressure * 0.42 + shorelineMaterial * 0.16, 0, 1))
        },

        compositePrep: {
          materialLayerReady: true,
          materialClass,
          colorHint,
          roughness: round(roughness),
          wetness: round(wetnessMaterial),
          sediment: round(sediment),
          stoneExposure: round(stoneExposure),
          mineralPressure: round(mineralPressure)
        },

        story: materialStory(materialClass),

        finalMaterialTruthClaim: false,
        finalVisualClaim: false
      };
    });

    const byClass = {};
    for (const key of Object.values(MATERIAL_CLASSES)) byClass[key] = [];

    for (const node of materialNodes) {
      if (!byClass[node.materialClass]) byClass[node.materialClass] = [];
      byClass[node.materialClass].push(node.index);
    }

    const baseRockMap = materialNodes.map((node) => node.baseRock);
    const sedimentMap = materialNodes.map((node) => node.sediment);
    const wetnessMaterialMap = materialNodes.map((node) => node.wetness);
    const mineralPressureMap = materialNodes.map((node) => node.mineral);
    const soilMap = materialNodes.map((node) => node.soil);
    const shorelineMaterialMap = materialNodes.map((node) => node.shoreline);
    const exposedStoneMap = materialNodes.map((node) => node.exposedStone);
    const materialColorHintMap = materialNodes.map((node) => node.colorHint);
    const materialRoughnessMap = materialNodes.map((node) => node.roughness);
    const compositeMaterialMap = materialNodes.map((node) => clonePlain(node.compositePrep));

    const model = {
      modelType: "HEARTH_MATERIAL_SURFACE_MINERAL_MODEL",
      worldName: WORLD_NAME,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,
      expansionMode: "CHRONOLOGICAL_EXPANSION_ON_INSTILLED_ARCHITECTURE",
      reintegrationMode: "NOT_REINTEGRATION",

      sourceHydrologyContractExpected: HYDROLOGY_CONTRACT,
      sourceHydrologyFile: HYDROLOGY_FILE,
      hydrologyDependencyObserved: hydrology.observed,
      hydrologyPacketObserved: hydrology.packetObserved,
      hydrologyReceiptObserved: hydrology.receiptObserved,
      hydrologyMaterialPrepObserved: hydrology.materialPrepObserved,
      hydrologyNodeCount: hydrology.nodeCount,
      hydrology256ScopeObserved: hydrology.diagnostic256Ready,
      hydrologyFallbackUsed: hydrology.fallbackUsed,

      sourceElevationContractExpected: ELEVATION_CONTRACT,
      sourceElevationFile: ELEVATION_FILE,
      elevationDependencyObserved: elevation.observed,
      elevationPacketObserved: elevation.packetObserved,
      elevationReceiptObserved: elevation.receiptObserved,
      elevationNodeCount: elevation.nodeCount,
      elevation256ScopeObserved: elevation.diagnostic256Ready,
      elevationFallbackUsed: elevation.fallbackUsed,

      gridSize: GRID_SIZE,
      nodeCount: NODE_COUNT,
      materialNodes,

      materialClasses: clonePlain(MATERIAL_CLASSES),
      materialClassIndex: clonePlain(byClass),

      baseRockMap,
      sedimentMap,
      wetnessMaterialMap,
      mineralPressureMap,
      soilMap,
      shorelineMaterialMap,
      exposedStoneMap,
      materialColorHintMap,
      materialRoughnessMap,
      compositeMaterialMap,

      deepBasinSiltNodes: byClass[MATERIAL_CLASSES.DEEP_BASIN_SILT] || [],
      oceanicDarkStoneNodes: byClass[MATERIAL_CLASSES.OCEANIC_DARK_STONE] || [],
      shelfMineralSandNodes: byClass[MATERIAL_CLASSES.SHELF_MINERAL_SAND] || [],
      riverWornStoneNodes: byClass[MATERIAL_CLASSES.RIVER_WORN_STONE] || [],
      wetlandClayNodes: byClass[MATERIAL_CLASSES.WETLAND_CLAY] || [],
      springMineralVeinNodes: byClass[MATERIAL_CLASSES.SPRING_MINERAL_VEIN] || [],
      aquiferDarkSoilNodes: byClass[MATERIAL_CLASSES.AQUIFER_DARK_SOIL] || [],
      exposedHighlandStoneNodes: byClass[MATERIAL_CLASSES.EXPOSED_HIGHLAND_STONE] || [],
      dryCrustNodes: byClass[MATERIAL_CLASSES.DRY_CRUST] || [],
      weatheredGroundNodes: byClass[MATERIAL_CLASSES.WEATHERED_GROUND] || [],

      materialRules: {
        materialFollowsLandformElevationAndHydrology: true,
        materialMayNotInventLand: true,
        materialMayNotInventWater: true,
        sedimentFollowsBasinsShelvesWetlandsAndRiverEnergy: true,
        stoneExposureFollowsReliefSlopeAndLowWaterDepth: true,
        mineralPressureFollowsRiftsSpringsAquiferPressureAndUplift: true,
        dryCrustRequiresLowWetnessAndExposedBody: true,
        materialMayNotClaimFinalVisualPass: true
      },

      narrativeDisposition: {
        body: "Landform gave Hearth a body.",
        relief: "Elevation raised the body into slopes, basins, shelves, and hard edges.",
        water: "Hydrology placed water above and below that body.",
        material: "Material now gives the body a skin: stone, silt, clay, crust, mineral, soil, and shelf."
      },

      finalMaterialTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.materialModel = clonePlain(model);
    state.materialModelReady = true;
    state.diagnostic256Ready = materialNodes.length === NODE_COUNT;

    state.baseRockMapReady = baseRockMap.length === NODE_COUNT;
    state.sedimentMapReady = sedimentMap.length === NODE_COUNT;
    state.wetnessMaterialMapReady = wetnessMaterialMap.length === NODE_COUNT;
    state.mineralPressureMapReady = mineralPressureMap.length === NODE_COUNT;
    state.soilMapReady = soilMap.length === NODE_COUNT;
    state.shorelineMaterialMapReady = shorelineMaterialMap.length === NODE_COUNT;
    state.exposedStoneMapReady = exposedStoneMap.length === NODE_COUNT;
    state.materialColorHintMapReady = materialColorHintMap.length === NODE_COUNT;
    state.materialRoughnessMapReady = materialRoughnessMap.length === NODE_COUNT;
    state.compositeMaterialMapReady = compositeMaterialMap.length === NODE_COUNT;

    state.materialNodeCount = materialNodes.length;
    state.deepBasinSiltNodeCount = model.deepBasinSiltNodes.length;
    state.oceanicDarkStoneNodeCount = model.oceanicDarkStoneNodes.length;
    state.shelfMineralSandNodeCount = model.shelfMineralSandNodes.length;
    state.riverWornStoneNodeCount = model.riverWornStoneNodes.length;
    state.wetlandClayNodeCount = model.wetlandClayNodes.length;
    state.springMineralVeinNodeCount = model.springMineralVeinNodes.length;
    state.aquiferDarkSoilNodeCount = model.aquiferDarkSoilNodes.length;
    state.exposedHighlandStoneNodeCount = model.exposedHighlandStoneNodes.length;
    state.dryCrustNodeCount = model.dryCrustNodes.length;
    state.weatheredGroundNodeCount = model.weatheredGroundNodes.length;

    record("MATERIAL_FINGER_MODEL_BUILT", {
      nodeCount: materialNodes.length,
      deepBasinSiltNodeCount: state.deepBasinSiltNodeCount,
      shelfMineralSandNodeCount: state.shelfMineralSandNodeCount,
      riverWornStoneNodeCount: state.riverWornStoneNodeCount,
      exposedHighlandStoneNodeCount: state.exposedHighlandStoneNodeCount,
      hydrologyFallbackUsed: hydrology.fallbackUsed,
      elevationFallbackUsed: elevation.fallbackUsed
    });

    return model;
  }

  function buildAtmosphereMaterialPrepPacket(model) {
    const source = model || state.materialModel || buildMaterialModel();

    const packet = {
      packetType: "HEARTH_MATERIAL_TO_ATMOSPHERE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: ATMOSPHERE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      materialColorHintMap: clonePlain(source.materialColorHintMap),
      wetnessMaterialMap: clonePlain(source.wetnessMaterialMap),
      sedimentMap: clonePlain(source.sedimentMap),
      soilMap: clonePlain(source.soilMap),
      mineralPressureMap: clonePlain(source.mineralPressureMap),
      materialNodes: clonePlain(source.materialNodes.map((node) => ({
        index: node.index,
        materialClass: node.materialClass,
        atmospherePrep: node.atmospherePrep,
        wetnessMaterial: node.wetnessMaterial,
        sedimentMaterial: node.sedimentMaterial,
        mineralPressure: node.mineralPressure,
        colorHint: node.colorHint
      }))),

      atmosphereRules: {
        dryCrustSupportsDust: true,
        wetClaySupportsHumidityHold: true,
        mineralVeinsSupportSubtleAerosolHint: true,
        sedimentBasinsSupportFogGrounding: true,
        atmosphereMayNotOverrideMaterial: true
      },

      readyForAtmosphere: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.atmosphereMaterialPrepPacket = clonePlain(packet);
    state.atmosphereMaterialPrepPacketReady = true;
    return packet;
  }

  function buildLightingMaterialPrepPacket(model) {
    const source = model || state.materialModel || buildMaterialModel();

    const packet = {
      packetType: "HEARTH_MATERIAL_TO_LIGHTING_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: LIGHTING_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      materialColorHintMap: clonePlain(source.materialColorHintMap),
      materialRoughnessMap: clonePlain(source.materialRoughnessMap),
      exposedStoneMap: clonePlain(source.exposedStoneMap),
      wetnessMaterialMap: clonePlain(source.wetnessMaterialMap),
      mineralPressureMap: clonePlain(source.mineralPressureMap),
      shorelineMaterialMap: clonePlain(source.shorelineMaterialMap),
      materialNodes: clonePlain(source.materialNodes.map((node) => ({
        index: node.index,
        materialClass: node.materialClass,
        lightingPrep: node.lightingPrep,
        colorHint: node.colorHint,
        roughness: node.roughness,
        wetnessMaterial: node.wetnessMaterial,
        mineralPressure: node.mineralPressure
      }))),

      lightingRules: {
        wetMaterialAbsorbsAndReflects: true,
        exposedStoneRaisesHighlightAndShadow: true,
        mineralPressureRaisesGlintPotential: true,
        roughnessModulatesSpecularStrength: true,
        lightingMayNotClaimFinalVisualPass: true
      },

      readyForLighting: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingMaterialPrepPacket = clonePlain(packet);
    state.lightingMaterialPrepPacketReady = true;
    return packet;
  }

  function buildCompositeMaterialPrepPacket(model) {
    const source = model || state.materialModel || buildMaterialModel();

    const packet = {
      packetType: "HEARTH_MATERIAL_TO_COMPOSITE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      materialNodes: clonePlain(source.materialNodes),
      materialClasses: clonePlain(source.materialClasses),
      materialClassIndex: clonePlain(source.materialClassIndex),
      baseRockMap: clonePlain(source.baseRockMap),
      sedimentMap: clonePlain(source.sedimentMap),
      wetnessMaterialMap: clonePlain(source.wetnessMaterialMap),
      mineralPressureMap: clonePlain(source.mineralPressureMap),
      soilMap: clonePlain(source.soilMap),
      shorelineMaterialMap: clonePlain(source.shorelineMaterialMap),
      exposedStoneMap: clonePlain(source.exposedStoneMap),
      materialColorHintMap: clonePlain(source.materialColorHintMap),
      materialRoughnessMap: clonePlain(source.materialRoughnessMap),
      compositeMaterialMap: clonePlain(source.compositeMaterialMap),

      compositeLayerContribution: {
        layer: "material",
        disposition: PLANETARY_DISPOSITION,
        contributesSurfaceSkin: true,
        contributesRock: true,
        contributesSediment: true,
        contributesSoil: true,
        contributesWetClay: true,
        contributesMineralPressure: true,
        contributesShorelineMaterial: true,
        contributesRoughness: true,
        contributesColorHints: true
      },

      readyForComposite: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeMaterialPrepPacket = clonePlain(packet);
    state.compositeMaterialPrepPacketReady = true;
    return packet;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.materialModel || buildMaterialModel();

    const packet = {
      packetType: "HEARTH_MATERIAL_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "material",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      hydrologyPacketConsumed: state.hydrologyPacketObserved || state.hydrologyDependencyObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,
      elevationPacketConsumed: state.elevationPacketObserved || state.elevationDependencyObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,

      materialModelReady: true,
      baseRockMapReady: true,
      sedimentMapReady: true,
      wetnessMaterialMapReady: true,
      mineralPressureMapReady: true,
      materialColorHintMapReady: true,

      inspectSummary: {
        materialNodeCount: state.materialNodeCount,
        deepBasinSiltNodeCount: state.deepBasinSiltNodeCount,
        oceanicDarkStoneNodeCount: state.oceanicDarkStoneNodeCount,
        shelfMineralSandNodeCount: state.shelfMineralSandNodeCount,
        riverWornStoneNodeCount: state.riverWornStoneNodeCount,
        wetlandClayNodeCount: state.wetlandClayNodeCount,
        springMineralVeinNodeCount: state.springMineralVeinNodeCount,
        aquiferDarkSoilNodeCount: state.aquiferDarkSoilNodeCount,
        exposedHighlandStoneNodeCount: state.exposedHighlandStoneNodeCount,
        dryCrustNodeCount: state.dryCrustNodeCount,
        weatheredGroundNodeCount: state.weatheredGroundNodeCount
      },

      readyForInspect: true,
      diagnosticRailAuthority: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.inspectPrepPacket = clonePlain(packet);
    state.inspectPrepPacketReady = true;
    return packet;
  }

  function buildMaterialPacket(options = {}) {
    const model = buildMaterialModel(options);

    const atmospherePrep = buildAtmosphereMaterialPrepPacket(model);
    const lightingPrep = buildLightingMaterialPrepPacket(model);
    const compositePrep = buildCompositeMaterialPrepPacket(model);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_MATERIAL_FINGER_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      worldName: WORLD_NAME,

      fingerKey: FINGER_NAME,
      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),

      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,
      planetaryDisposition: PLANETARY_DISPOSITION,
      expansionMode: "CHRONOLOGICAL_EXPANSION_ON_INSTILLED_ARCHITECTURE",
      reintegrationMode: "NOT_REINTEGRATION",

      sourceHydrologyFile: HYDROLOGY_FILE,
      sourceHydrologyContractExpected: HYDROLOGY_CONTRACT,
      hydrologyDependencyExpected: true,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      hydrologyAuthoritySourceName: state.hydrologyAuthoritySourceName,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      hydrologyReceiptObserved: state.hydrologyReceiptObserved,
      hydrologyMaterialPrepObserved: state.hydrologyMaterialPrepObserved,
      hydrologyNodeCount: state.hydrologyNodeCount,
      hydrology256ScopeObserved: state.hydrology256ScopeObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,

      sourceElevationFile: ELEVATION_FILE,
      sourceElevationContractExpected: ELEVATION_CONTRACT,
      elevationDependencyExpected: true,
      elevationDependencyObserved: state.elevationDependencyObserved,
      elevationAuthoritySourceName: state.elevationAuthoritySourceName,
      elevationPacketObserved: state.elevationPacketObserved,
      elevationReceiptObserved: state.elevationReceiptObserved,
      elevationNodeCount: state.elevationNodeCount,
      elevation256ScopeObserved: state.elevation256ScopeObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,

      materialFingerActive: true,
      surfaceMineralAuthorityActive: true,
      materialModelReady: true,
      materialPacketReady: true,
      diagnostic256Ready: true,

      baseRockMapReady: true,
      sedimentMapReady: true,
      wetnessMaterialMapReady: true,
      mineralPressureMapReady: true,
      soilMapReady: true,
      shorelineMaterialMapReady: true,
      exposedStoneMapReady: true,
      materialColorHintMapReady: true,
      materialRoughnessMapReady: true,
      compositeMaterialMapReady: true,

      materialModel: clonePlain(model),
      atmosphereMaterialPrepPacket: clonePlain(atmospherePrep),
      lightingMaterialPrepPacket: clonePlain(lightingPrep),
      compositeMaterialPrepPacket: clonePlain(compositePrep),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_ATMOSPHERE_FINGER_EXPANSION",
      postgameStatus: "MATERIAL_SURFACE_MINERAL_PACKET_READY_FOR_ATMOSPHERE",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.materialPacket = clonePlain(packet);
    state.materialPacketReady = true;

    state.firstFailedCoordinate = "WAITING_ATMOSPHERE_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "MATERIAL_SURFACE_MINERAL_PACKET_READY_FOR_ATMOSPHERE";

    record("MATERIAL_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      deepBasinSiltNodeCount: state.deepBasinSiltNodeCount,
      shelfMineralSandNodeCount: state.shelfMineralSandNodeCount,
      riverWornStoneNodeCount: state.riverWornStoneNodeCount,
      nextFile: NEXT_FILE,
      materialPacketReady: true
    });

    return packet;
  }

  function getMaterialModel(options = {}) {
    if (!state.materialModel || options.rebuild === true) {
      return buildMaterialModel(options);
    }

    return clonePlain(state.materialModel);
  }

  function getMaterialPacket(options = {}) {
    if (!state.materialPacket || options.rebuild === true) {
      return buildMaterialPacket(options);
    }

    return clonePlain(state.materialPacket);
  }

  function getBaseRockMap(options = {}) {
    const model = getMaterialModel(options);
    return clonePlain(model.baseRockMap || []);
  }

  function getSedimentMap(options = {}) {
    const model = getMaterialModel(options);
    return clonePlain(model.sedimentMap || []);
  }

  function getMineralPressureMap(options = {}) {
    const model = getMaterialModel(options);
    return clonePlain(model.mineralPressureMap || []);
  }

  function getMaterialColorHintMap(options = {}) {
    const model = getMaterialModel(options);
    return clonePlain(model.materialColorHintMap || []);
  }

  function getCompositeMaterialPrepPacket(options = {}) {
    if (!state.compositeMaterialPrepPacket || options.rebuild === true) {
      buildMaterialPacket(options);
    }

    return clonePlain(state.compositeMaterialPrepPacket);
  }

  function getAtmosphereMaterialPrepPacket(options = {}) {
    if (!state.atmosphereMaterialPrepPacket || options.rebuild === true) {
      buildMaterialPacket(options);
    }

    return clonePlain(state.atmosphereMaterialPrepPacket);
  }

  function normalizePoint(x, y, width, height) {
    let nx = safeNumber(x, 0);
    let ny = safeNumber(y, 0);

    const w = safeNumber(width, 0);
    const h = safeNumber(height, 0);

    if ((nx > 1 || ny > 1) && w > 0 && h > 0) {
      nx = nx / w;
      ny = ny / h;
    }

    return {
      x: clamp(nx, 0, 1),
      y: clamp(ny, 0, 1)
    };
  }

  function nearestNode(point, model) {
    const nodes = model && Array.isArray(model.materialNodes) ? model.materialNodes : [];
    if (!nodes.length) return null;

    let best = nodes[0];
    let bestDistance = Infinity;

    for (const node of nodes) {
      const dx = node.x - point.x;
      const dy = node.y - point.y;
      const distance = (dx * dx) + (dy * dy);

      if (distance < bestDistance) {
        bestDistance = distance;
        best = node;
      }
    }

    return best;
  }

  function sampleMaterial(x, y, options = {}) {
    const model = getMaterialModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_MATERIAL_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      materialClass: node ? node.materialClass : "UNKNOWN",
      colorHint: node ? node.colorHint : "UNKNOWN",
      baseRock: node ? node.baseRock : 0,
      sediment: node ? node.sediment : 0,
      mineral: node ? node.mineral : 0,
      wetness: node ? node.wetness : 0,
      finalMaterialTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleMaterial(x, y, options);
  }

  function rgbaForMaterial(materialClass, alpha) {
    const a = clamp(alpha, 0, 1);

    if (materialClass === MATERIAL_CLASSES.DEEP_BASIN_SILT) return `rgba(24, 31, 38, ${a})`;
    if (materialClass === MATERIAL_CLASSES.OCEANIC_DARK_STONE) return `rgba(20, 36, 55, ${a})`;
    if (materialClass === MATERIAL_CLASSES.SHELF_MINERAL_SAND) return `rgba(196, 176, 112, ${a})`;
    if (materialClass === MATERIAL_CLASSES.RIVER_WORN_STONE) return `rgba(118, 132, 132, ${a})`;
    if (materialClass === MATERIAL_CLASSES.WETLAND_CLAY) return `rgba(87, 92, 66, ${a})`;
    if (materialClass === MATERIAL_CLASSES.SPRING_MINERAL_VEIN) return `rgba(183, 168, 104, ${a})`;
    if (materialClass === MATERIAL_CLASSES.AQUIFER_DARK_SOIL) return `rgba(54, 58, 47, ${a})`;
    if (materialClass === MATERIAL_CLASSES.EXPOSED_HIGHLAND_STONE) return `rgba(145, 132, 103, ${a})`;
    if (materialClass === MATERIAL_CLASSES.DRY_CRUST) return `rgba(150, 115, 72, ${a})`;
    return `rgba(112, 102, 78, ${a})`;
  }

  function drawToCanvas(canvasOrContext, options = {}) {
    const target = canvasOrContext || null;
    const context = target && isFunction(target.getContext)
      ? target.getContext("2d")
      : target && isFunction(target.beginPath)
        ? target
        : null;

    if (!context) {
      return {
        drawn: false,
        reason: "NO_2D_CANVAS_CONTEXT",
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    }

    const canvas = context.canvas || target;
    const width = safeNumber(options.width || (canvas && canvas.width), 0);
    const height = safeNumber(options.height || (canvas && canvas.height), 0);

    if (!width || !height) {
      return {
        drawn: false,
        reason: "CANVAS_DIMENSIONS_UNAVAILABLE",
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    }

    const model = getMaterialModel(options);
    const nodes = model.materialNodes || [];

    try {
      context.save();
      context.globalCompositeOperation = options.compositeOperation || "source-over";

      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;
      const opacity = clamp(options.opacity === undefined ? 0.22 : options.opacity, 0, 0.68);

      for (const node of nodes) {
        const alpha = clamp(
          opacity +
          (node.stoneExposure * 0.12) +
          (node.sedimentMaterial * 0.08) +
          (node.mineralPressure * 0.06),
          0.03,
          0.72
        );

        context.fillStyle = rgbaForMaterial(node.materialClass, alpha);
        context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);

        if (node.materialClass === MATERIAL_CLASSES.SPRING_MINERAL_VEIN || node.mineralPressure >= 0.68) {
          context.globalAlpha = clamp(alpha + 0.14, 0, 0.76);
          context.strokeStyle = "rgba(236, 215, 130, 0.50)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.07);
          context.beginPath();
          context.moveTo(node.col * cellW + cellW * 0.18, node.row * cellH + cellH * 0.72);
          context.lineTo(node.col * cellW + cellW * 0.82, node.row * cellH + cellH * 0.28);
          context.stroke();
          context.globalAlpha = 1;
        }

        if (node.materialClass === MATERIAL_CLASSES.RIVER_WORN_STONE) {
          context.globalAlpha = clamp(alpha + 0.10, 0, 0.70);
          context.strokeStyle = "rgba(170, 196, 188, 0.32)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.05);
          context.beginPath();
          context.moveTo(node.col * cellW + cellW * 0.10, node.row * cellH + cellH * 0.50);
          context.lineTo(node.col * cellW + cellW * 0.90, node.row * cellH + cellH * 0.50);
          context.stroke();
          context.globalAlpha = 1;
        }
      }

      context.restore();

      record("MATERIAL_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        nodeCount: nodes.length,
        finalVisualClaim: false
      });

      return {
        drawn: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        nodeCount: nodes.length,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      recordError("MATERIAL_FINGER_DRAW_TO_CANVAS_FAILED", error);

      return {
        drawn: false,
        reason: "DRAW_FAILED",
        error: error && error.message ? String(error.message) : String(error),
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    }
  }

  function findCanvasHub() {
    for (const sourceName of HUB_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          hub: candidate,
          sourceName
        };
      }
    }

    return {
      hub: null,
      sourceName: "NONE"
    };
  }

  function registerWithCanvasHub(options = {}) {
    const packet = getMaterialPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("MATERIAL_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });
      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const response = found.hub[method](clonePlain(packet));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted
          ? "NONE"
          : "CANVAS_HUB_REJECTED_MATERIAL_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("MATERIAL_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("MATERIAL_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("MATERIAL_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    return false;
  }

  function findSurfacePointer() {
    for (const sourceName of SURFACE_POINTER_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          pointer: candidate,
          sourceName
        };
      }
    }

    return {
      pointer: null,
      sourceName: "NONE"
    };
  }

  function registerWithSurfacePointer(options = {}) {
    const packet = getMaterialPacket(options);
    const found = findSurfacePointer();

    state.surfacePointerObserved = Boolean(found.pointer);
    state.surfacePointerSourceName = found.sourceName;
    state.surfacePointerRegistrationAttempted = true;
    state.surfacePointerRegistrationAccepted = false;
    state.surfacePointerRegistrationMethod = "NONE";
    state.surfacePointerRegistrationError = "";

    if (!found.pointer) {
      state.surfacePointerRegistrationHeldReason = "SURFACE_POINTER_NOT_FOUND_NONBLOCKING";
      return false;
    }

    for (const method of SURFACE_POINTER_METHODS) {
      if (!isFunction(found.pointer[method])) continue;

      try {
        const response = found.pointer[method](clonePlain(packet));

        state.surfacePointerRegistrationAccepted = response !== false;
        state.surfacePointerRegistrationMethod = method;
        state.surfacePointerRegistrationHeldReason = state.surfacePointerRegistrationAccepted
          ? "NONE"
          : "SURFACE_POINTER_REJECTED_MATERIAL_PACKET";

        record("MATERIAL_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("MATERIAL_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
          sourceName: found.sourceName,
          method
        });
      }
    }

    state.surfacePointerRegistrationHeldReason = "SURFACE_POINTER_INTAKE_NOT_FOUND_NONBLOCKING";
    return false;
  }

  function getState() {
    return clonePlain(state);
  }

  function read() {
    return getReceiptLight();
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      worldName: WORLD_NAME,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,
      planetaryDisposition: PLANETARY_DISPOSITION,
      expansionMode: state.expansionMode,
      reintegrationMode: state.reintegrationMode,

      hydrologyFile: HYDROLOGY_FILE,
      hydrologyContractExpected: HYDROLOGY_CONTRACT,
      hydrologyDependencyExpected: state.hydrologyDependencyExpected,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      hydrologyAuthoritySourceName: state.hydrologyAuthoritySourceName,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      hydrologyReceiptObserved: state.hydrologyReceiptObserved,
      hydrologyMaterialPrepObserved: state.hydrologyMaterialPrepObserved,
      hydrologyNodeCount: state.hydrologyNodeCount,
      hydrology256ScopeObserved: state.hydrology256ScopeObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,
      hydrologyReadError: state.hydrologyReadError,

      elevationFile: ELEVATION_FILE,
      elevationContractExpected: ELEVATION_CONTRACT,
      elevationDependencyExpected: state.elevationDependencyExpected,
      elevationDependencyObserved: state.elevationDependencyObserved,
      elevationAuthoritySourceName: state.elevationAuthoritySourceName,
      elevationPacketObserved: state.elevationPacketObserved,
      elevationReceiptObserved: state.elevationReceiptObserved,
      elevationNodeCount: state.elevationNodeCount,
      elevation256ScopeObserved: state.elevation256ScopeObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,
      elevationReadError: state.elevationReadError,

      materialFingerLoaded: state.materialFingerLoaded,
      materialFingerActive: state.materialFingerActive,
      surfaceMineralAuthorityActive: state.surfaceMineralAuthorityActive,
      materialModelReady: state.materialModelReady,
      materialPacketReady: state.materialPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      baseRockMapReady: state.baseRockMapReady,
      sedimentMapReady: state.sedimentMapReady,
      wetnessMaterialMapReady: state.wetnessMaterialMapReady,
      mineralPressureMapReady: state.mineralPressureMapReady,
      soilMapReady: state.soilMapReady,
      shorelineMaterialMapReady: state.shorelineMaterialMapReady,
      exposedStoneMapReady: state.exposedStoneMapReady,
      materialColorHintMapReady: state.materialColorHintMapReady,
      materialRoughnessMapReady: state.materialRoughnessMapReady,
      compositeMaterialMapReady: state.compositeMaterialMapReady,

      atmosphereMaterialPrepPacketReady: state.atmosphereMaterialPrepPacketReady,
      lightingMaterialPrepPacketReady: state.lightingMaterialPrepPacketReady,
      compositeMaterialPrepPacketReady: state.compositeMaterialPrepPacketReady,
      inspectPrepPacketReady: state.inspectPrepPacketReady,

      materialNodeCount: state.materialNodeCount,
      deepBasinSiltNodeCount: state.deepBasinSiltNodeCount,
      oceanicDarkStoneNodeCount: state.oceanicDarkStoneNodeCount,
      shelfMineralSandNodeCount: state.shelfMineralSandNodeCount,
      riverWornStoneNodeCount: state.riverWornStoneNodeCount,
      wetlandClayNodeCount: state.wetlandClayNodeCount,
      springMineralVeinNodeCount: state.springMineralVeinNodeCount,
      aquiferDarkSoilNodeCount: state.aquiferDarkSoilNodeCount,
      exposedHighlandStoneNodeCount: state.exposedHighlandStoneNodeCount,
      dryCrustNodeCount: state.dryCrustNodeCount,
      weatheredGroundNodeCount: state.weatheredGroundNodeCount,

      surfacePointerExpected: state.surfacePointerExpected,
      surfacePointerObserved: state.surfacePointerObserved,
      surfacePointerSourceName: state.surfacePointerSourceName,
      surfacePointerRegistrationAttempted: state.surfacePointerRegistrationAttempted,
      surfacePointerRegistrationAccepted: state.surfacePointerRegistrationAccepted,
      surfacePointerRegistrationMethod: state.surfacePointerRegistrationMethod,
      surfacePointerRegistrationHeldReason: state.surfacePointerRegistrationHeldReason,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleMaterialAvailable: true,
      drawToCanvasAvailable: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      hydrologyEvidence: clonePlain(state.hydrologyEvidence),
      hydrologyPacket: clonePlain(state.hydrologyPacket),
      hydrologyReceipt: clonePlain(state.hydrologyReceipt),
      hydrologyMaterialPrepPacket: clonePlain(state.hydrologyMaterialPrepPacket),
      elevationEvidence: clonePlain(state.elevationEvidence),
      elevationPacket: clonePlain(state.elevationPacket),
      elevationReceipt: clonePlain(state.elevationReceipt),
      materialModel: clonePlain(state.materialModel),
      materialPacket: clonePlain(state.materialPacket),
      atmosphereMaterialPrepPacket: clonePlain(state.atmosphereMaterialPrepPacket),
      lightingMaterialPrepPacket: clonePlain(state.lightingMaterialPrepPacket),
      compositeMaterialPrepPacket: clonePlain(state.compositeMaterialPrepPacket),
      inspectPrepPacket: clonePlain(state.inspectPrepPacket),
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),
      materialClasses: clonePlain(MATERIAL_CLASSES),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      surfacePointerSourceNames: clonePlain(SURFACE_POINTER_SOURCE_NAMES),
      surfacePointerMethods: clonePlain(SURFACE_POINTER_METHODS),
      lastRegistrationResponse: clonePlain(state.lastRegistrationResponse),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("worldName", r.worldName),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("planetaryDispositionIndex", r.planetaryDispositionIndex),
      line("planetaryDisposition", r.planetaryDisposition),
      line("expansionMode", r.expansionMode),
      line("reintegrationMode", r.reintegrationMode),
      "",
      "HYDROLOGY_CONSUMPTION",
      line("hydrologyFile", r.hydrologyFile),
      line("hydrologyContractExpected", r.hydrologyContractExpected),
      line("hydrologyDependencyExpected", r.hydrologyDependencyExpected),
      line("hydrologyDependencyObserved", r.hydrologyDependencyObserved),
      line("hydrologyAuthoritySourceName", r.hydrologyAuthoritySourceName),
      line("hydrologyPacketObserved", r.hydrologyPacketObserved),
      line("hydrologyReceiptObserved", r.hydrologyReceiptObserved),
      line("hydrologyMaterialPrepObserved", r.hydrologyMaterialPrepObserved),
      line("hydrologyNodeCount", r.hydrologyNodeCount),
      line("hydrology256ScopeObserved", r.hydrology256ScopeObserved),
      line("hydrologyFallbackUsed", r.hydrologyFallbackUsed),
      line("hydrologyReadError", r.hydrologyReadError),
      "",
      "ELEVATION_CONSUMPTION",
      line("elevationFile", r.elevationFile),
      line("elevationContractExpected", r.elevationContractExpected),
      line("elevationDependencyExpected", r.elevationDependencyExpected),
      line("elevationDependencyObserved", r.elevationDependencyObserved),
      line("elevationAuthoritySourceName", r.elevationAuthoritySourceName),
      line("elevationPacketObserved", r.elevationPacketObserved),
      line("elevationReceiptObserved", r.elevationReceiptObserved),
      line("elevationNodeCount", r.elevationNodeCount),
      line("elevation256ScopeObserved", r.elevation256ScopeObserved),
      line("elevationFallbackUsed", r.elevationFallbackUsed),
      line("elevationReadError", r.elevationReadError),
      "",
      "MATERIAL_STATUS",
      line("materialFingerLoaded", r.materialFingerLoaded),
      line("materialFingerActive", r.materialFingerActive),
      line("surfaceMineralAuthorityActive", r.surfaceMineralAuthorityActive),
      line("materialModelReady", r.materialModelReady),
      line("materialPacketReady", r.materialPacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("baseRockMapReady", r.baseRockMapReady),
      line("sedimentMapReady", r.sedimentMapReady),
      line("wetnessMaterialMapReady", r.wetnessMaterialMapReady),
      line("mineralPressureMapReady", r.mineralPressureMapReady),
      line("soilMapReady", r.soilMapReady),
      line("shorelineMaterialMapReady", r.shorelineMaterialMapReady),
      line("exposedStoneMapReady", r.exposedStoneMapReady),
      line("materialColorHintMapReady", r.materialColorHintMapReady),
      line("materialRoughnessMapReady", r.materialRoughnessMapReady),
      line("compositeMaterialMapReady", r.compositeMaterialMapReady),
      "",
      "PREP_PACKETS",
      line("atmosphereMaterialPrepPacketReady", r.atmosphereMaterialPrepPacketReady),
      line("lightingMaterialPrepPacketReady", r.lightingMaterialPrepPacketReady),
      line("compositeMaterialPrepPacketReady", r.compositeMaterialPrepPacketReady),
      line("inspectPrepPacketReady", r.inspectPrepPacketReady),
      "",
      "COUNTS",
      line("materialNodeCount", r.materialNodeCount),
      line("deepBasinSiltNodeCount", r.deepBasinSiltNodeCount),
      line("oceanicDarkStoneNodeCount", r.oceanicDarkStoneNodeCount),
      line("shelfMineralSandNodeCount", r.shelfMineralSandNodeCount),
      line("riverWornStoneNodeCount", r.riverWornStoneNodeCount),
      line("wetlandClayNodeCount", r.wetlandClayNodeCount),
      line("springMineralVeinNodeCount", r.springMineralVeinNodeCount),
      line("aquiferDarkSoilNodeCount", r.aquiferDarkSoilNodeCount),
      line("exposedHighlandStoneNodeCount", r.exposedHighlandStoneNodeCount),
      line("dryCrustNodeCount", r.dryCrustNodeCount),
      line("weatheredGroundNodeCount", r.weatheredGroundNodeCount),
      "",
      "SURFACE_POINTER",
      line("surfacePointerExpected", r.surfacePointerExpected),
      line("surfacePointerObserved", r.surfacePointerObserved),
      line("surfacePointerSourceName", r.surfacePointerSourceName),
      line("surfacePointerRegistrationAttempted", r.surfacePointerRegistrationAttempted),
      line("surfacePointerRegistrationAccepted", r.surfacePointerRegistrationAccepted),
      line("surfacePointerRegistrationMethod", r.surfacePointerRegistrationMethod),
      line("surfacePointerRegistrationHeldReason", r.surfacePointerRegistrationHeldReason),
      "",
      "HUB_REGISTRATION",
      line("hubDetected", r.hubDetected),
      line("hubSourceName", r.hubSourceName),
      line("hubRegistrationAttempted", r.hubRegistrationAttempted),
      line("hubRegistrationAccepted", r.hubRegistrationAccepted),
      line("hubRegistrationMethod", r.hubRegistrationMethod),
      line("hubRegistrationHeldReason", r.hubRegistrationHeldReason),
      line("hubRegistrationError", r.hubRegistrationError),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noClaimsPreserved", r.noClaimsPreserved),
      line("f13Claimed", false),
      line("f13EligibleForCanvas", false),
      line("f21Claimed", false),
      line("f21EligibleForNorth", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("terrainTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("finalMaterialTruthClaimed", false),
      line("atmosphericTruthClaimed", false),
      line("lightingTruthClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerMaterialLoaded", "true");
    setDataset("hearthCanvasFingerMaterialContract", CONTRACT);
    setDataset("hearthCanvasFingerMaterialReceipt", RECEIPT);
    setDataset("hearthCanvasFingerMaterialPacket", PACKET);
    setDataset("hearthCanvasFingerMaterialFile", FILE);
    setDataset("hearthCanvasFingerMaterialWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerMaterialDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerMaterialDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerMaterialExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerMaterialReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerMaterialHydrologyDependencyExpected", String(state.hydrologyDependencyExpected));
    setDataset("hearthCanvasFingerMaterialHydrologyDependencyObserved", String(state.hydrologyDependencyObserved));
    setDataset("hearthCanvasFingerMaterialHydrologySourceName", state.hydrologyAuthoritySourceName);
    setDataset("hearthCanvasFingerMaterialHydrologyPacketObserved", String(state.hydrologyPacketObserved));
    setDataset("hearthCanvasFingerMaterialHydrologyReceiptObserved", String(state.hydrologyReceiptObserved));
    setDataset("hearthCanvasFingerMaterialHydrologyPrepObserved", String(state.hydrologyMaterialPrepObserved));
    setDataset("hearthCanvasFingerMaterialHydrologyNodeCount", String(state.hydrologyNodeCount));
    setDataset("hearthCanvasFingerMaterialHydrology256ScopeObserved", String(state.hydrology256ScopeObserved));
    setDataset("hearthCanvasFingerMaterialHydrologyFallbackUsed", String(state.hydrologyFallbackUsed));

    setDataset("hearthCanvasFingerMaterialElevationDependencyExpected", String(state.elevationDependencyExpected));
    setDataset("hearthCanvasFingerMaterialElevationDependencyObserved", String(state.elevationDependencyObserved));
    setDataset("hearthCanvasFingerMaterialElevationSourceName", state.elevationAuthoritySourceName);
    setDataset("hearthCanvasFingerMaterialElevationPacketObserved", String(state.elevationPacketObserved));
    setDataset("hearthCanvasFingerMaterialElevationReceiptObserved", String(state.elevationReceiptObserved));
    setDataset("hearthCanvasFingerMaterialElevationNodeCount", String(state.elevationNodeCount));
    setDataset("hearthCanvasFingerMaterialElevation256ScopeObserved", String(state.elevation256ScopeObserved));
    setDataset("hearthCanvasFingerMaterialElevationFallbackUsed", String(state.elevationFallbackUsed));

    setDataset("hearthCanvasFingerMaterialModelReady", String(state.materialModelReady));
    setDataset("hearthCanvasFingerMaterialPacketReady", String(state.materialPacketReady));
    setDataset("hearthCanvasFingerMaterialDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerMaterialBaseRockMapReady", String(state.baseRockMapReady));
    setDataset("hearthCanvasFingerMaterialSedimentMapReady", String(state.sedimentMapReady));
    setDataset("hearthCanvasFingerMaterialWetnessMapReady", String(state.wetnessMaterialMapReady));
    setDataset("hearthCanvasFingerMaterialMineralPressureMapReady", String(state.mineralPressureMapReady));
    setDataset("hearthCanvasFingerMaterialSoilMapReady", String(state.soilMapReady));
    setDataset("hearthCanvasFingerMaterialShorelineMapReady", String(state.shorelineMaterialMapReady));
    setDataset("hearthCanvasFingerMaterialExposedStoneMapReady", String(state.exposedStoneMapReady));
    setDataset("hearthCanvasFingerMaterialColorHintMapReady", String(state.materialColorHintMapReady));
    setDataset("hearthCanvasFingerMaterialRoughnessMapReady", String(state.materialRoughnessMapReady));
    setDataset("hearthCanvasFingerMaterialCompositeMapReady", String(state.compositeMaterialMapReady));

    setDataset("hearthCanvasFingerMaterialNodeCount", String(state.materialNodeCount));
    setDataset("hearthCanvasFingerMaterialDeepBasinSiltNodeCount", String(state.deepBasinSiltNodeCount));
    setDataset("hearthCanvasFingerMaterialOceanicDarkStoneNodeCount", String(state.oceanicDarkStoneNodeCount));
    setDataset("hearthCanvasFingerMaterialShelfMineralSandNodeCount", String(state.shelfMineralSandNodeCount));
    setDataset("hearthCanvasFingerMaterialRiverWornStoneNodeCount", String(state.riverWornStoneNodeCount));
    setDataset("hearthCanvasFingerMaterialWetlandClayNodeCount", String(state.wetlandClayNodeCount));
    setDataset("hearthCanvasFingerMaterialSpringMineralVeinNodeCount", String(state.springMineralVeinNodeCount));
    setDataset("hearthCanvasFingerMaterialAquiferDarkSoilNodeCount", String(state.aquiferDarkSoilNodeCount));
    setDataset("hearthCanvasFingerMaterialExposedHighlandStoneNodeCount", String(state.exposedHighlandStoneNodeCount));
    setDataset("hearthCanvasFingerMaterialDryCrustNodeCount", String(state.dryCrustNodeCount));
    setDataset("hearthCanvasFingerMaterialWeatheredGroundNodeCount", String(state.weatheredGroundNodeCount));

    setDataset("hearthCanvasFingerMaterialAtmospherePrepReady", String(state.atmosphereMaterialPrepPacketReady));
    setDataset("hearthCanvasFingerMaterialLightingPrepReady", String(state.lightingMaterialPrepPacketReady));
    setDataset("hearthCanvasFingerMaterialCompositePrepReady", String(state.compositeMaterialPrepPacketReady));
    setDataset("hearthCanvasFingerMaterialInspectPrepReady", String(state.inspectPrepPacketReady));

    setDataset("hearthCanvasFingerMaterialSurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerMaterialSurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerMaterialSurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerMaterialSurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerMaterialSurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerMaterialSurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerMaterialHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerMaterialHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerMaterialHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerMaterialHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerMaterialHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerMaterialHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerMaterialFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerMaterialRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerMaterialPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerMaterialNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerMaterialF13Claimed", "false");
    setDataset("hearthCanvasFingerMaterialF21Claimed", "false");
    setDataset("hearthCanvasFingerMaterialReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerMaterialTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialFinalMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialAtmosphericTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerMaterialVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerMaterialGeneratedImage", "false");
    setDataset("hearthCanvasFingerMaterialGraphicBox", "false");
    setDataset("hearthCanvasFingerMaterialWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerMaterial = api;
    hearth.canvasMaterialFinger = api;
    hearth.canvasFingerMaterialReceipt = getReceiptLight();
    hearth.canvasFingerMaterialPacket = getMaterialPacket();

    lab.hearthCanvasFingerMaterial = api;
    lab.hearthCanvasMaterialFinger = api;
    lab.hearthCanvasFingerMaterialReceipt = getReceiptLight();
    lab.hearthCanvasFingerMaterialPacket = getMaterialPacket();

    root.HEARTH_CANVAS_FINGER_MATERIAL = api;
    root.HEARTH_CANVAS_MATERIAL_FINGER = api;
    root.HEARTH_CANVAS_FINGER_MATERIAL_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_MATERIAL_PACKET = getMaterialPacket();

    root.HEARTH_CANVAS_MATERIAL_BASE_ROCK_MAP = getBaseRockMap();
    root.HEARTH_CANVAS_MATERIAL_SEDIMENT_MAP = getSedimentMap();
    root.HEARTH_CANVAS_MATERIAL_MINERAL_PRESSURE_MAP = getMineralPressureMap();
    root.HEARTH_CANVAS_MATERIAL_COLOR_HINT_MAP = getMaterialColorHintMap();

    root.HEARTH_MATERIAL_TO_ATMOSPHERE_PREP_PACKET = getAtmosphereMaterialPrepPacket();
    root.HEARTH_MATERIAL_TO_COMPOSITE_PREP_PACKET = getCompositeMaterialPrepPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readHydrologyEvidence(options);
    readElevationEvidence(options);
    buildMaterialPacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("MATERIAL_FINGER_BOOT_COMPLETE", {
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      hydrologyMaterialPrepObserved: state.hydrologyMaterialPrepObserved,
      elevationDependencyObserved: state.elevationDependencyObserved,
      materialNodeCount: state.materialNodeCount,
      materialPacketReady: state.materialPacketReady,
      atmosphereMaterialPrepPacketReady: state.atmosphereMaterialPrepPacketReady,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function mount(options = {}) {
    return boot(options);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    VERSION,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    WORLD_NAME,

    LANDFORM_FILE,
    ELEVATION_FILE,
    HYDROLOGY_FILE,
    SURFACE_FILE,
    NEXT_FILE,
    ATMOSPHERE_FILE,
    LIGHTING_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,
    HYDROLOGY_CONTRACT,
    ELEVATION_CONTRACT,

    GRID_SIZE,
    NODE_COUNT,
    FINGER_NAME,
    FINGER_ROLE,
    FINGER_ORDER,
    PLANETARY_DISPOSITION_INDEX,
    PLANETARY_DISPOSITION,
    FINGER_SEQUENCE,
    FINGER_FILES,
    MATERIAL_CLASSES,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    worldName: WORLD_NAME,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,
    planetaryDisposition: PLANETARY_DISPOSITION,

    boot,
    init,
    start,
    mount,

    readHydrologyEvidence,
    readElevationEvidence,
    buildMaterialModel,
    buildMaterialPacket,
    getMaterialModel,
    getMaterialPacket,
    getBaseRockMap,
    getSedimentMap,
    getMineralPressureMap,
    getMaterialColorHintMap,

    buildAtmosphereMaterialPrepPacket,
    buildLightingMaterialPrepPacket,
    buildCompositeMaterialPrepPacket,
    buildInspectPrepPacket,

    getAtmosphereMaterialPrepPacket,
    getCompositeMaterialPrepPacket,

    sample,
    sampleMaterial,
    drawToCanvas,

    findCanvasHub,
    registerWithCanvasHub,
    findSurfacePointer,
    registerWithSurfacePointer,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsMaterialFinger: true,
    supportsSurfaceMineralAuthority: true,
    supportsHydrologyPacketConsumption: true,
    supportsElevationPacketConsumption: true,
    supportsDiagnostic256MaterialScope: true,
    supportsBaseRockMap: true,
    supportsSedimentMap: true,
    supportsWetnessMaterialMap: true,
    supportsMineralPressureMap: true,
    supportsSoilMap: true,
    supportsShorelineMaterialMap: true,
    supportsExposedStoneMap: true,
    supportsMaterialColorHintMap: true,
    supportsMaterialRoughnessMap: true,
    supportsAtmosphereMaterialPrep: true,
    supportsLightingMaterialPrep: true,
    supportsCompositeMaterialPrep: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoFinalClaims: true,

    ownsMaterialFingerIdentity: true,
    ownsSurfaceMineralModel: true,
    ownsMaterialExpressionPacket: true,
    ownsAtmosphereMaterialPrep: true,
    ownsLightingMaterialPrep: true,
    ownsCompositeMaterialPrep: true,

    ownsLandformTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsFinalMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsFinalTerrainTruth: false,
    ownsCanvasParent: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsF13: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readHydrologyEvidence();
    readElevationEvidence();
    buildMaterialPacket();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({}), { once: true });
      } else {
        boot({});
      }
    } else {
      boot({});
    }
  } catch (error) {
    recordError("MATERIAL_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
