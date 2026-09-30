// /assets/hearth/hearth.canvas.finger.composite.js
// HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_TNT_v1
// Full-file replacement.
// Canvas Finger / Composite / World Expression Assembly.
// Purpose:
// - Establish Composite as the seventh planetary-disposition expansion finger after Landform, Elevation,
//   Hydrology, Material, Atmosphere, and Lighting.
// - Consume Landform, Elevation, Hydrology, Material, Atmosphere, and Lighting packets when available.
// - Assemble Hearth into one coherent visible-world expression packet.
// - Provide a safe 2D drawToCanvas(canvasOrContext) method for the Canvas parent.
// - Provide getCompositePacket(), getWorldExpressionPacket(), getCompositeModel(), getReceipt(), and getReceiptText().
// - Register with Canvas parent / Expression Hub when available.
// - Register with Surface pointer/socket when available.
// - Prepare Inspect handoff data for /assets/hearth/hearth.canvas.finger.inspect.js.
// - Continue expansion on the already-instilled finger architecture; do not treat this as reintegration.
// - Do not independently mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, or sibling fingers.
// - Do not create DOM mounts, append canvases, take over #hearthCanvasMount, or own the Inspect Planet button.
// - Never claim final terrain truth, final hydrology truth, final material truth, final atmosphere truth,
//   final lighting truth, final composite truth, final visual pass, F13, F21, ready text, generated image,
//   GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-composite-world-expression-assembly-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const LANDFORM_CONTRACT = "HEARTH_CANVAS_FINGER_LANDFORM_GLOBAL_256_AUTHORITY_TNT_v1";
  const ELEVATION_CONTRACT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1";
  const HYDROLOGY_CONTRACT = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_TNT_v1";
  const MATERIAL_CONTRACT = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_TNT_v1";
  const ATMOSPHERE_CONTRACT = "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_TNT_v1";
  const LIGHTING_CONTRACT = "HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_TNT_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;

  const FINGER_NAME = "composite";
  const FINGER_ROLE = "world-expression-assembly";
  const FINGER_ORDER = 7;
  const PLANETARY_DISPOSITION_INDEX = 7;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_ASSEMBLED_VISIBLE_EXPRESSION";

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
    landformTruthClaimed: false,
    elevationTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    atmosphereTruthClaimed: false,
    lightingTruthClaimed: false,
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
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
    material: MATERIAL_FILE,
    atmosphere: ATMOSPHERE_FILE,
    lighting: LIGHTING_FILE,
    composite: FILE,
    inspect: INSPECT_FILE
  });

  const LANDFORM_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerLandform",
    "HEARTH.canvasLandformFinger",
    "HEARTH_CANVAS_FINGER_LANDFORM",
    "HEARTH_CANVAS_LANDFORM_FINGER",
    "HEARTH_CANVAS_FINGER_LANDFORM_PACKET",
    "DEXTER_LAB.hearthCanvasFingerLandform",
    "DEXTER_LAB.hearthCanvasLandformFinger"
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

  const HYDROLOGY_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerHydrology",
    "HEARTH.canvasHydrologyFinger",
    "HEARTH_CANVAS_FINGER_HYDROLOGY",
    "HEARTH_CANVAS_HYDROLOGY_FINGER",
    "HEARTH_CANVAS_FINGER_HYDROLOGY_PACKET",
    "DEXTER_LAB.hearthCanvasFingerHydrology",
    "DEXTER_LAB.hearthCanvasHydrologyFinger"
  ]);

  const MATERIAL_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMaterial",
    "HEARTH.canvasMaterialFinger",
    "HEARTH_CANVAS_FINGER_MATERIAL",
    "HEARTH_CANVAS_MATERIAL_FINGER",
    "HEARTH_CANVAS_FINGER_MATERIAL_PACKET",
    "DEXTER_LAB.hearthCanvasFingerMaterial",
    "DEXTER_LAB.hearthCanvasMaterialFinger"
  ]);

  const ATMOSPHERE_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerAtmosphere",
    "HEARTH.canvasAtmosphereFinger",
    "HEARTH_CANVAS_FINGER_ATMOSPHERE",
    "HEARTH_CANVAS_ATMOSPHERE_FINGER",
    "HEARTH_CANVAS_FINGER_ATMOSPHERE_PACKET",
    "HEARTH_ATMOSPHERE_TO_COMPOSITE_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerAtmosphere",
    "DEXTER_LAB.hearthCanvasAtmosphereFinger"
  ]);

  const LIGHTING_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerLighting",
    "HEARTH.canvasLightingFinger",
    "HEARTH_CANVAS_FINGER_LIGHTING",
    "HEARTH_CANVAS_LIGHTING_FINGER",
    "HEARTH_CANVAS_FINGER_LIGHTING_PACKET",
    "HEARTH_LIGHTING_TO_COMPOSITE_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerLighting",
    "DEXTER_LAB.hearthCanvasLightingFinger"
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
    "receiveCompositeFingerPacket",
    "receiveWorldExpressionPacket",
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
    "HEARTH_CANVAS_FINGER_MANAGER",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveExpressionFingerPacket",
    "receiveCanvasExpressionPacket",
    "receiveCompositeFingerPacket",
    "receiveCompositePacket",
    "receiveWorldExpressionPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const COMPOSITE_CLASSES = Object.freeze({
    DEEP_BASIN_VISIBLE: "deep-basin-visible",
    OCEAN_BODY_VISIBLE: "ocean-body-visible",
    SHELF_RIM_VISIBLE: "shelf-rim-visible",
    RIVER_THREAD_VISIBLE: "river-thread-visible",
    WETLAND_SOFT_VISIBLE: "wetland-soft-visible",
    MINERAL_GLINT_VISIBLE: "mineral-glint-visible",
    AQUIFER_DARK_GROUND_VISIBLE: "aquifer-dark-ground-visible",
    HIGHLAND_RIM_VISIBLE: "highland-rim-visible",
    DRY_CRUST_VISIBLE: "dry-crust-visible",
    TEMPERATE_LAND_VISIBLE: "temperate-land-visible"
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

    landformDependencyObserved: false,
    elevationDependencyObserved: false,
    hydrologyDependencyObserved: false,
    materialDependencyObserved: false,
    atmosphereDependencyObserved: false,
    lightingDependencyObserved: false,

    landformPacketObserved: false,
    elevationPacketObserved: false,
    hydrologyPacketObserved: false,
    materialPacketObserved: false,
    atmospherePacketObserved: false,
    lightingPacketObserved: false,

    landformReceiptObserved: false,
    elevationReceiptObserved: false,
    hydrologyReceiptObserved: false,
    materialReceiptObserved: false,
    atmosphereReceiptObserved: false,
    lightingReceiptObserved: false,

    landformSourceName: "NONE",
    elevationSourceName: "NONE",
    hydrologySourceName: "NONE",
    materialSourceName: "NONE",
    atmosphereSourceName: "NONE",
    lightingSourceName: "NONE",

    landformFallbackUsed: false,
    elevationFallbackUsed: false,
    hydrologyFallbackUsed: false,
    materialFallbackUsed: false,
    atmosphereFallbackUsed: false,
    lightingFallbackUsed: false,

    landformNodeCount: 0,
    elevationNodeCount: 0,
    hydrologyNodeCount: 0,
    materialNodeCount: 0,
    atmosphereNodeCount: 0,
    lightingNodeCount: 0,

    compositeFingerLoaded: true,
    compositeFingerActive: true,
    worldExpressionAssemblyActive: true,
    compositeModelReady: false,
    compositePacketReady: false,
    worldExpressionPacketReady: false,
    diagnostic256Ready: false,

    drawToCanvasAvailable: true,
    renderContributionAvailable: false,
    visibleWorldExpressionAvailable: false,

    compositeNodeCount: 0,
    deepBasinVisibleNodeCount: 0,
    oceanBodyVisibleNodeCount: 0,
    shelfRimVisibleNodeCount: 0,
    riverThreadVisibleNodeCount: 0,
    wetlandSoftVisibleNodeCount: 0,
    mineralGlintVisibleNodeCount: 0,
    aquiferDarkGroundVisibleNodeCount: 0,
    highlandRimVisibleNodeCount: 0,
    dryCrustVisibleNodeCount: 0,
    temperateLandVisibleNodeCount: 0,

    surfacePointerExpected: true,
    surfacePointerObserved: false,
    surfacePointerSourceName: "NONE",
    surfacePointerRegistrationAttempted: false,
    surfacePointerRegistrationAccepted: false,
    surfacePointerRegistrationMethod: "NONE",
    surfacePointerRegistrationHeldReason: "NOT_ATTEMPTED",
    surfacePointerRegistrationError: "",

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "COMPOSITE_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "COMPOSITE_FINGER_WAITING_BOOT",

    landformEvidence: null,
    elevationEvidence: null,
    hydrologyEvidence: null,
    materialEvidence: null,
    atmosphereEvidence: null,
    lightingEvidence: null,

    landformPacket: null,
    elevationPacket: null,
    hydrologyPacket: null,
    materialPacket: null,
    atmospherePacket: null,
    lightingPacket: null,

    landformReceipt: null,
    elevationReceipt: null,
    hydrologyReceipt: null,
    materialReceipt: null,
    atmosphereReceipt: null,
    lightingReceipt: null,

    landformNodes: [],
    elevationNodes: [],
    hydrologyNodes: [],
    materialNodes: [],
    atmosphereNodes: [],
    lightingNodes: [],

    compositeModel: null,
    compositePacket: null,
    worldExpressionPacket: null,
    inspectPrepPacket: null,

    lastDrawReceipt: null,
    drawAttempted: false,
    drawComplete: false,
    drawHeldReason: "NOT_ATTEMPTED",
    drawError: "",
    drawWidth: 0,
    drawHeight: 0,
    drawNodeCount: 0,
    drawUpdatedAt: "",

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
      event: safeString(event, "COMPOSITE_FINGER_EVENT"),
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
      code: safeString(code, "COMPOSITE_FINGER_ERROR"),
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
        recordError("COMPOSITE_FINGER_AUTHORITY_READ_METHOD_FAILED", error, { method });
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

  function hashNoise(a, b, seed = 0) {
    const x = Math.sin((a + 1) * 127.1 + (b + 1) * 311.7 + seed * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function gaussian2(x, y, cx, cy, sx, sy, weight) {
    const dx = (x - cx) / Math.max(0.0001, sx);
    const dy = (y - cy) / Math.max(0.0001, sy);
    return Math.exp(-0.5 * ((dx * dx) + (dy * dy))) * weight;
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

  function extractPacketFrom(value, packetKeys) {
    if (!isObject(value)) return null;

    for (const key of packetKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (
      Array.isArray(value.nodes) ||
      Array.isArray(value.landformNodes) ||
      Array.isArray(value.elevationNodes) ||
      Array.isArray(value.hydrologyNodes) ||
      Array.isArray(value.materialNodes) ||
      Array.isArray(value.atmosphereNodes) ||
      Array.isArray(value.lightingNodes) ||
      Array.isArray(value.compositeNodes) ||
      Array.isArray(value.worldExpressionNodes)
    ) {
      return value;
    }

    return null;
  }

  function extractNodes(packet, nodeKeys) {
    if (!isObject(packet)) return [];

    for (const key of nodeKeys) {
      const value = packet[key];
      if (Array.isArray(value) && value.length) return value;
    }

    const nestedKeys = [
      "model",
      "landformModel",
      "elevationModel",
      "hydrologyModel",
      "materialModel",
      "atmosphereModel",
      "lightingModel",
      "compositeModel",
      "worldExpressionModel",
      "original"
    ];

    for (const parentKey of nestedKeys) {
      const parent = packet[parentKey];
      if (!isObject(parent)) continue;

      for (const key of nodeKeys) {
        const value = parent[key];
        if (Array.isArray(value) && value.length) return value;
      }
    }

    return [];
  }

  function buildFallbackBaseNodes() {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = (col + 0.5) / GRID_SIZE;
      const y = (row + 0.5) / GRID_SIZE;

      const basin = clamp(
        gaussian2(x, y, 0.50, 0.56, 0.22, 0.23, 0.88) +
        gaussian2(x, y, 0.18, 0.66, 0.14, 0.24, 0.28),
        0,
        1
      );

      const shelf = clamp(
        gaussian2(x, y, 0.58, 0.77, 0.32, 0.13, 0.74) +
        gaussian2(x, y, 0.80, 0.45, 0.12, 0.32, 0.32),
        0,
        1
      );

      const ridge = clamp(
        gaussian2(x, y, 0.34, 0.30, 0.14, 0.16, 0.72) +
        gaussian2(x, y, 0.72, 0.34, 0.16, 0.16, 0.52),
        0,
        1
      );

      const river = clamp(
        gaussian2(x, y, 0.44, 0.30, 0.05, 0.36, 0.60) +
        gaussian2(x, y, 0.62, 0.42, 0.04, 0.30, 0.48),
        0,
        1
      );

      const elevation = clamp(0.45 + ridge * 0.28 - basin * 0.22 + (hashNoise(index, 7, 19) - 0.5) * 0.08, 0, 1);
      const waterPresence = clamp(basin * 0.34 + shelf * 0.22 + river * 0.24 + Math.max(0, 0.42 - elevation) * 0.38, 0, 1);
      const waterDepth = clamp(Math.max(0, 0.44 - elevation) * 1.25 + basin * 0.18, 0, 1);
      const wetness = clamp(waterPresence * 0.46 + waterDepth * 0.22, 0, 1);
      const mineral = clamp(shelf * 0.24 + ridge * 0.10 + hashNoise(index, 11, 29) * 0.18, 0, 1);
      const stone = clamp(elevation * 0.32 + ridge * 0.18 + hashNoise(index, 13, 31) * 0.12, 0, 1);
      const humidity = clamp(waterPresence * 0.34 + wetness * 0.24, 0, 1);
      const vapor = clamp(waterDepth * 0.26 + wetness * 0.22 + basin * 0.12, 0, 1);
      const dust = clamp((1 - wetness) * 0.14 + stone * 0.08, 0, 1);
      const aerosol = clamp(mineral * 0.22 + shelf * 0.10, 0, 1);
      const airClarity = clamp(1 - vapor * 0.22 - dust * 0.16 - aerosol * 0.08 + elevation * 0.10, 0, 1);
      const rimEnvelope = clamp(elevation * 0.24 + shelf * 0.18 + airClarity * 0.12, 0, 1);
      const directLight = clamp(0.44 + elevation * 0.20 + airClarity * 0.16 - vapor * 0.10, 0, 1);
      const shadow = clamp((1 - directLight) * 0.32 + basin * 0.22 + waterDepth * 0.10, 0, 1);
      const rimLight = clamp(rimEnvelope * 0.44 + elevation * 0.16, 0, 1);
      const specularLight = clamp(waterDepth * 0.22 + mineral * 0.20 + shelf * 0.18, 0, 1);
      const hazeScatter = clamp(vapor * 0.20 + aerosol * 0.16 + dust * 0.10, 0, 1);

      nodes.push({
        index,
        row,
        col,
        x: round(x),
        y: round(y),
        worldName: WORLD_NAME,
        basin,
        shelf,
        ridge,
        river,
        elevation,
        waterPresence,
        waterDepth,
        wetness,
        mineral,
        stone,
        humidity,
        vapor,
        dust,
        aerosol,
        airClarity,
        rimEnvelope,
        directLight,
        shadow,
        rimLight,
        specularLight,
        hazeScatter
      });
    }

    return nodes;
  }

  function normalizeCommonNode(raw, index, fallback = {}) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], fallback.id || `HEARTH_NODE_${String(index + 1).padStart(3, "0")}`),
      row: getFirstNumber(raw, ["row"], fallback.row ?? row),
      col: getFirstNumber(raw, ["col"], fallback.col ?? col),
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], fallback.x ?? ((col + 0.5) / GRID_SIZE)), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], fallback.y ?? ((row + 0.5) / GRID_SIZE)), 0, 1)),
      worldName: WORLD_NAME
    };
  }

  function normalizeLandformNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    return {
      ...base,
      landformClass: getFirstString(raw, ["landformClass", "bodyClass", "class"], fallback.waterDepth > 0.28 ? "basin-body" : fallback.elevation > 0.64 ? "highland-body" : "land-body"),
      landScore: round(clamp(getFirstNumber(raw, ["landScore", "landPresence"], fallback.waterDepth > 0.28 ? 0.18 : 0.78), 0, 1)),
      basinScore: round(clamp(getFirstNumber(raw, ["basinScore"], fallback.basin ?? 0), 0, 1)),
      shelfScore: round(clamp(getFirstNumber(raw, ["shelfScore"], fallback.shelf ?? 0), 0, 1)),
      ridgeScore: round(clamp(getFirstNumber(raw, ["ridgeScore", "upliftScore"], fallback.ridge ?? 0), 0, 1)),
      riverScore: round(clamp(getFirstNumber(raw, ["riverScore", "channelScore"], fallback.river ?? 0), 0, 1)),
      finalLandformTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeElevationNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    return {
      ...base,
      elevation: round(clamp(getFirstNumber(raw, ["elevation", "normalizedHeight", "height"], fallback.elevation ?? 0.44), 0, 1)),
      normalizedHeight: round(clamp(getFirstNumber(raw, ["normalizedHeight", "elevation", "height"], fallback.elevation ?? 0.44), 0, 1)),
      slope: round(clamp(getFirstNumber(raw, ["slope"], fallback.ridge ? fallback.ridge * 0.3 : 0.12), 0, 1)),
      basinScore: round(clamp(getFirstNumber(raw, ["basinScore"], fallback.basin ?? 0), 0, 1)),
      shelfScore: round(clamp(getFirstNumber(raw, ["shelfScore"], fallback.shelf ?? 0), 0, 1)),
      upliftScore: round(clamp(getFirstNumber(raw, ["upliftScore", "ridgeScore"], fallback.ridge ?? fallback.elevation ?? 0.44), 0, 1)),
      reliefClass: getFirstString(raw, ["reliefClass"], fallback.elevation > 0.66 ? "HIGHLAND_RELIEF" : fallback.elevation < 0.38 ? "BASIN_RELIEF" : "MID_RELIEF"),
      finalElevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeHydrologyNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    return {
      ...base,
      waterClass: getFirstString(raw, ["waterClass", "hydrologyClass"], fallback.waterDepth > 0.25 ? "OCEAN_BODY" : fallback.waterPresence > 0.28 ? "WET_MARGIN" : "DRY_UPLAND"),
      waterPresence: round(clamp(getFirstNumber(raw, ["waterPresence"], fallback.waterPresence ?? 0), 0, 1)),
      waterDepth: round(clamp(getFirstNumber(raw, ["waterDepth"], fallback.waterDepth ?? 0), 0, 1)),
      aquiferPressure: round(clamp(getFirstNumber(raw, ["aquiferPressure"], fallback.wetness ?? 0), 0, 1)),
      riverChannel: safeBool(raw.riverChannel, fallback.river > 0.44),
      wetland: safeBool(raw.wetland, fallback.wetness > 0.48 && fallback.waterDepth < 0.22),
      shelfWater: safeBool(raw.shelfWater, fallback.shelf > 0.42),
      finalHydrologyTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeMaterialNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    let fallbackClass = "weathered-ground";
    if (fallback.waterDepth > 0.30) fallbackClass = "oceanic-dark-stone";
    else if (fallback.shelf > 0.45) fallbackClass = "shelf-mineral-sand";
    else if (fallback.river > 0.48) fallbackClass = "river-worn-stone";
    else if (fallback.wetness > 0.48) fallbackClass = "wetland-clay";
    else if (fallback.mineral > 0.45) fallbackClass = "spring-mineral-vein";
    else if (fallback.elevation > 0.66) fallbackClass = "exposed-highland-stone";
    else if (fallback.wetness < 0.10 && fallback.elevation > 0.52) fallbackClass = "dry-crust";

    return {
      ...base,
      materialClass: getFirstString(raw, ["materialClass", "class"], fallbackClass),
      colorHint: getFirstString(raw, ["colorHint"], fallbackClass),
      wetnessMaterial: round(clamp(getFirstNumber(raw, ["wetnessMaterial", "wetness"], fallback.wetness ?? 0), 0, 1)),
      sedimentMaterial: round(clamp(getFirstNumber(raw, ["sedimentMaterial", "sediment"], fallback.basin ?? 0), 0, 1)),
      mineralPressure: round(clamp(getFirstNumber(raw, ["mineralPressure", "mineral"], fallback.mineral ?? 0), 0, 1)),
      stoneExposure: round(clamp(getFirstNumber(raw, ["stoneExposure", "stone"], fallback.stone ?? 0), 0, 1)),
      shorelineMaterial: round(clamp(getFirstNumber(raw, ["shorelineMaterial", "shoreline"], fallback.shelf ?? 0), 0, 1)),
      roughness: round(clamp(getFirstNumber(raw, ["roughness"], fallback.stone ?? 0), 0, 1)),
      finalMaterialTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeAtmosphereNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    return {
      ...base,
      airClass: getFirstString(raw, ["airClass", "class"], fallback.humidity > 0.44 ? "ocean-humid-envelope" : fallback.elevation > 0.66 ? "highland-thin-air" : "temperate-surface-air"),
      humidity: round(clamp(getFirstNumber(raw, ["humidity"], fallback.humidity ?? 0), 0, 1)),
      vapor: round(clamp(getFirstNumber(raw, ["vapor"], fallback.vapor ?? 0), 0, 1)),
      dust: round(clamp(getFirstNumber(raw, ["dust"], fallback.dust ?? 0), 0, 1)),
      aerosol: round(clamp(getFirstNumber(raw, ["aerosol"], fallback.aerosol ?? 0), 0, 1)),
      airClarity: round(clamp(getFirstNumber(raw, ["airClarity"], fallback.airClarity ?? 0.5), 0, 1)),
      rimEnvelope: round(clamp(getFirstNumber(raw, ["rimEnvelope"], fallback.rimEnvelope ?? 0), 0, 1)),
      lowerHaze: round(clamp(getFirstNumber(raw, ["lowerHaze"], fallback.vapor ?? 0), 0, 1)),
      cloudSeed: round(clamp(getFirstNumber(raw, ["cloudSeed"], fallback.humidity ?? 0), 0, 1)),
      finalAtmosphereTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeLightingNode(raw, index, fallback = {}) {
    const base = normalizeCommonNode(raw, index, fallback);

    return {
      ...base,
      lightClass: getFirstString(raw, ["lightClass", "class"], fallback.shadow > 0.45 ? "basin-shadow" : fallback.rimLight > 0.48 ? "highland-rim-light" : "temperate-surface-light"),
      tintHint: getFirstString(raw, ["tintHint"], "balanced-surface-light"),
      directLight: round(clamp(getFirstNumber(raw, ["directLight"], fallback.directLight ?? 0.45), 0, 1)),
      shadow: round(clamp(getFirstNumber(raw, ["shadow"], fallback.shadow ?? 0), 0, 1)),
      rimLight: round(clamp(getFirstNumber(raw, ["rimLight"], fallback.rimLight ?? 0), 0, 1)),
      diffuseLight: round(clamp(getFirstNumber(raw, ["diffuseLight"], fallback.humidity ?? 0), 0, 1)),
      specularLight: round(clamp(getFirstNumber(raw, ["specularLight"], fallback.specularLight ?? 0), 0, 1)),
      hazeScatter: round(clamp(getFirstNumber(raw, ["hazeScatter"], fallback.hazeScatter ?? 0), 0, 1)),
      wetReflection: round(clamp(getFirstNumber(raw, ["wetReflection"], fallback.waterDepth ?? 0), 0, 1)),
      mineralGlint: round(clamp(getFirstNumber(raw, ["mineralGlint"], fallback.mineral ?? 0), 0, 1)),
      cloudDiffusion: round(clamp(getFirstNumber(raw, ["cloudDiffusion"], fallback.humidity ?? 0), 0, 1)),
      shadowSoftness: round(clamp(getFirstNumber(raw, ["shadowSoftness"], fallback.vapor ?? 0), 0, 1)),
      finalLightingTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function fallbackSet(kind) {
    const base = buildFallbackBaseNodes();

    if (kind === "landform") return base.map((entry, index) => normalizeLandformNode({}, index, entry));
    if (kind === "elevation") return base.map((entry, index) => normalizeElevationNode({}, index, entry));
    if (kind === "hydrology") return base.map((entry, index) => normalizeHydrologyNode({}, index, entry));
    if (kind === "material") return base.map((entry, index) => normalizeMaterialNode({}, index, entry));
    if (kind === "atmosphere") return base.map((entry, index) => normalizeAtmosphereNode({}, index, entry));
    if (kind === "lighting") return base.map((entry, index) => normalizeLightingNode({}, index, entry));
    return base;
  }

  function readLayerEvidence(kind, sourceNames, options = {}) {
    const found = findSource(sourceNames);
    const capital = kind.charAt(0).toUpperCase() + kind.slice(1);

    let observed = Boolean(found.source);
    let packet = null;
    let receipt = null;
    let readError = "";

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          `get${capital}Packet`,
          `get${capital}Model`,
          "getWorldExpressionPacket",
          "getCompositePrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          `${kind}Packet`,
          `${kind}Model`,
          `${kind}CompositePrepPacket`,
          "compositePrepPacket",
          "worldExpressionPacket",
          "packet"
        ]);

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        readError = error && error.message ? String(error.message) : String(error);
        recordError(`COMPOSITE_FINGER_${kind.toUpperCase()}_READ_FAILED`, error, {
          sourceName: found.sourceName
        });
      }
    }

    const optionPacketKey = `${kind}Packet`;
    if (options[optionPacketKey] && isObject(options[optionPacketKey])) {
      packet = options[optionPacketKey];
      observed = true;
    }

    const rawNodes = extractNodes(packet, [
      `${kind}Nodes`,
      "nodes",
      `${kind}Map`,
      `${kind}Grid`
    ]);

    const fallback = buildFallbackBaseNodes();

    let nodes = [];
    if (rawNodes.length) {
      if (kind === "landform") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeLandformNode(entry, index, fallback[index]));
      if (kind === "elevation") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeElevationNode(entry, index, fallback[index]));
      if (kind === "hydrology") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeHydrologyNode(entry, index, fallback[index]));
      if (kind === "material") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeMaterialNode(entry, index, fallback[index]));
      if (kind === "atmosphere") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeAtmosphereNode(entry, index, fallback[index]));
      if (kind === "lighting") nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeLightingNode(entry, index, fallback[index]));
    }

    if (nodes.length < NODE_COUNT) nodes = fallbackSet(kind);

    const evidence = {
      kind,
      observed,
      sourceName: found.sourceName,
      packetObserved: Boolean(packet),
      receiptObserved: Boolean(receipt),
      nodeCount: nodes.length,
      diagnostic256Ready: nodes.length === NODE_COUNT,
      fallbackUsed: !packet || rawNodes.length === 0,
      readError,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      nodes: clonePlain(nodes)
    };

    state[`${kind}DependencyObserved`] = observed;
    state[`${kind}PacketObserved`] = Boolean(packet);
    state[`${kind}ReceiptObserved`] = Boolean(receipt);
    state[`${kind}SourceName`] = found.sourceName;
    state[`${kind}FallbackUsed`] = evidence.fallbackUsed;
    state[`${kind}NodeCount`] = nodes.length;
    state[`${kind}Evidence`] = clonePlain(evidence);
    state[`${kind}Packet`] = clonePlain(packet);
    state[`${kind}Receipt`] = clonePlain(receipt);
    state[`${kind}Nodes`] = clonePlain(nodes);

    record(`COMPOSITE_FINGER_${kind.toUpperCase()}_EVIDENCE_READ`, {
      observed,
      sourceName: found.sourceName,
      packetObserved: Boolean(packet),
      receiptObserved: Boolean(receipt),
      nodeCount: nodes.length,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function readAllLayerEvidence(options = {}) {
    return {
      landform: readLayerEvidence("landform", LANDFORM_SOURCE_NAMES, options),
      elevation: readLayerEvidence("elevation", ELEVATION_SOURCE_NAMES, options),
      hydrology: readLayerEvidence("hydrology", HYDROLOGY_SOURCE_NAMES, options),
      material: readLayerEvidence("material", MATERIAL_SOURCE_NAMES, options),
      atmosphere: readLayerEvidence("atmosphere", ATMOSPHERE_SOURCE_NAMES, options),
      lighting: readLayerEvidence("lighting", LIGHTING_SOURCE_NAMES, options)
    };
  }

  function compositeClassFor(layer) {
    if (layer.hydrology.waterDepth >= 0.34 || layer.material.materialClass === "deep-basin-silt") return COMPOSITE_CLASSES.DEEP_BASIN_VISIBLE;
    if (layer.hydrology.waterPresence >= 0.52 || layer.material.materialClass === "oceanic-dark-stone") return COMPOSITE_CLASSES.OCEAN_BODY_VISIBLE;
    if (layer.landform.shelfScore >= 0.42 || layer.material.materialClass === "shelf-mineral-sand") return COMPOSITE_CLASSES.SHELF_RIM_VISIBLE;
    if (layer.landform.riverScore >= 0.46 || layer.hydrology.riverChannel || layer.material.materialClass === "river-worn-stone") return COMPOSITE_CLASSES.RIVER_THREAD_VISIBLE;
    if (layer.hydrology.wetland || layer.material.materialClass === "wetland-clay") return COMPOSITE_CLASSES.WETLAND_SOFT_VISIBLE;
    if (layer.material.materialClass === "spring-mineral-vein" || layer.lighting.mineralGlint >= 0.50) return COMPOSITE_CLASSES.MINERAL_GLINT_VISIBLE;
    if (layer.material.materialClass === "aquifer-dark-soil" || layer.hydrology.aquiferPressure >= 0.52) return COMPOSITE_CLASSES.AQUIFER_DARK_GROUND_VISIBLE;
    if (layer.elevation.elevation >= 0.66 || layer.lighting.rimLight >= 0.56) return COMPOSITE_CLASSES.HIGHLAND_RIM_VISIBLE;
    if (layer.material.materialClass === "dry-crust") return COMPOSITE_CLASSES.DRY_CRUST_VISIBLE;
    return COMPOSITE_CLASSES.TEMPERATE_LAND_VISIBLE;
  }

  function storyForComposite(compositeClass) {
    if (compositeClass === COMPOSITE_CLASSES.DEEP_BASIN_VISIBLE) {
      return "The low body holds a dark basin where water, shadow, and vapor collect into visible depth.";
    }

    if (compositeClass === COMPOSITE_CLASSES.OCEAN_BODY_VISIBLE) {
      return "The visible world shows a blue water body held by landform and softened by atmospheric light.";
    }

    if (compositeClass === COMPOSITE_CLASSES.SHELF_RIM_VISIBLE) {
      return "The shelf edge carries shallow-water light, mineral skin, and a thin atmospheric rim.";
    }

    if (compositeClass === COMPOSITE_CLASSES.RIVER_THREAD_VISIBLE) {
      return "A river-thread joins terrain pressure, water memory, material wear, and narrow light.";
    }

    if (compositeClass === COMPOSITE_CLASSES.WETLAND_SOFT_VISIBLE) {
      return "Wet ground, low vapor, and softened light create a held, living margin.";
    }

    if (compositeClass === COMPOSITE_CLASSES.MINERAL_GLINT_VISIBLE) {
      return "A mineral seam gives the assembled world a bright signal without becoming final terrain truth.";
    }

    if (compositeClass === COMPOSITE_CLASSES.AQUIFER_DARK_GROUND_VISIBLE) {
      return "Hidden water darkens the ground and gives the planet a restrained under-surface glow.";
    }

    if (compositeClass === COMPOSITE_CLASSES.HIGHLAND_RIM_VISIBLE) {
      return "Raised relief catches the rim first, making the planet read as a physical body.";
    }

    if (compositeClass === COMPOSITE_CLASSES.DRY_CRUST_VISIBLE) {
      return "Dry crust receives harder light and reveals the exposed old surface.";
    }

    return "Temperate ground carries the balanced expression between body, relief, water, skin, air, and light.";
  }

  function colorForComposite(compositeClass, node) {
    const direct = safeNumber(node.directLight, 0.45);
    const shadow = safeNumber(node.shadow, 0.2);
    const rim = safeNumber(node.rimLight, 0.2);
    const haze = safeNumber(node.hazeScatter, 0.1);
    const brightness = clamp(0.66 + direct * 0.28 + rim * 0.18 - shadow * 0.26 + haze * 0.04, 0.28, 1.18);

    let base = [112, 126, 86];

    if (compositeClass === COMPOSITE_CLASSES.DEEP_BASIN_VISIBLE) base = [24, 54, 82];
    if (compositeClass === COMPOSITE_CLASSES.OCEAN_BODY_VISIBLE) base = [30, 104, 164];
    if (compositeClass === COMPOSITE_CLASSES.SHELF_RIM_VISIBLE) base = [178, 162, 104];
    if (compositeClass === COMPOSITE_CLASSES.RIVER_THREAD_VISIBLE) base = [86, 132, 142];
    if (compositeClass === COMPOSITE_CLASSES.WETLAND_SOFT_VISIBLE) base = [78, 112, 82];
    if (compositeClass === COMPOSITE_CLASSES.MINERAL_GLINT_VISIBLE) base = [176, 142, 82];
    if (compositeClass === COMPOSITE_CLASSES.AQUIFER_DARK_GROUND_VISIBLE) base = [54, 78, 72];
    if (compositeClass === COMPOSITE_CLASSES.HIGHLAND_RIM_VISIBLE) base = [132, 126, 104];
    if (compositeClass === COMPOSITE_CLASSES.DRY_CRUST_VISIBLE) base = [164, 120, 72];

    const r = Math.round(clamp(base[0] * brightness + rim * 32, 0, 255));
    const g = Math.round(clamp(base[1] * brightness + rim * 36, 0, 255));
    const b = Math.round(clamp(base[2] * brightness + rim * 42, 0, 255));

    return {
      r,
      g,
      b,
      a: round(clamp(0.78 + node.airClarity * 0.12 - node.hazeScatter * 0.08, 0.58, 0.98))
    };
  }

  function buildCompositeModel(options = {}) {
    readAllLayerEvidence(options);

    const compositeNodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const landform = state.landformNodes[index] || fallbackSet("landform")[index];
      const elevation = state.elevationNodes[index] || fallbackSet("elevation")[index];
      const hydrology = state.hydrologyNodes[index] || fallbackSet("hydrology")[index];
      const material = state.materialNodes[index] || fallbackSet("material")[index];
      const atmosphere = state.atmosphereNodes[index] || fallbackSet("atmosphere")[index];
      const lighting = state.lightingNodes[index] || fallbackSet("lighting")[index];

      const layer = { landform, elevation, hydrology, material, atmosphere, lighting };
      const compositeClass = compositeClassFor(layer);
      const visibleScore = clamp(
        landform.landScore * 0.18 +
        elevation.elevation * 0.10 +
        hydrology.waterPresence * 0.13 +
        material.wetnessMaterial * 0.08 +
        material.mineralPressure * 0.08 +
        atmosphere.airClarity * 0.11 +
        atmosphere.rimEnvelope * 0.09 +
        lighting.directLight * 0.15 +
        lighting.rimLight * 0.11 +
        lighting.specularLight * 0.07 -
        lighting.shadow * 0.10,
        0,
        1
      );

      const nodeForColor = {
        directLight: lighting.directLight,
        shadow: lighting.shadow,
        rimLight: lighting.rimLight,
        hazeScatter: lighting.hazeScatter,
        airClarity: atmosphere.airClarity
      };

      const color = colorForComposite(compositeClass, nodeForColor);

      const node = {
        index,
        id: `HEARTH_COMPOSITE_NODE_${String(index + 1).padStart(3, "0")}`,
        row: landform.row,
        col: landform.col,
        x: landform.x,
        y: landform.y,
        worldName: WORLD_NAME,

        compositeClass,
        visibleScore: round(visibleScore),
        color,
        cssColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,

        landformClass: landform.landformClass,
        reliefClass: elevation.reliefClass,
        waterClass: hydrology.waterClass,
        materialClass: material.materialClass,
        airClass: atmosphere.airClass,
        lightClass: lighting.lightClass,

        landScore: landform.landScore,
        basinScore: landform.basinScore,
        shelfScore: landform.shelfScore,
        ridgeScore: landform.ridgeScore,
        riverScore: landform.riverScore,

        elevation: elevation.elevation,
        slope: elevation.slope,
        waterPresence: hydrology.waterPresence,
        waterDepth: hydrology.waterDepth,
        aquiferPressure: hydrology.aquiferPressure,

        wetnessMaterial: material.wetnessMaterial,
        mineralPressure: material.mineralPressure,
        stoneExposure: material.stoneExposure,
        shorelineMaterial: material.shorelineMaterial,

        humidity: atmosphere.humidity,
        vapor: atmosphere.vapor,
        dust: atmosphere.dust,
        aerosol: atmosphere.aerosol,
        airClarity: atmosphere.airClarity,
        rimEnvelope: atmosphere.rimEnvelope,
        lowerHaze: atmosphere.lowerHaze,

        directLight: lighting.directLight,
        shadow: lighting.shadow,
        rimLight: lighting.rimLight,
        diffuseLight: lighting.diffuseLight,
        specularLight: lighting.specularLight,
        hazeScatter: lighting.hazeScatter,
        wetReflection: lighting.wetReflection,
        mineralGlint: lighting.mineralGlint,
        cloudDiffusion: lighting.cloudDiffusion,

        story: storyForComposite(compositeClass),

        sourceNodeIds: {
          landform: landform.id,
          elevation: elevation.id,
          hydrology: hydrology.id,
          material: material.id,
          atmosphere: atmosphere.id,
          lighting: lighting.id
        },

        finalCompositeTruthClaim: false,
        finalVisualClaim: false
      };

      compositeNodes.push(node);
    }

    const byClass = {};
    for (const key of Object.values(COMPOSITE_CLASSES)) byClass[key] = [];

    for (const node of compositeNodes) {
      if (!byClass[node.compositeClass]) byClass[node.compositeClass] = [];
      byClass[node.compositeClass].push(node.index);
    }

    const compositeColorMap = compositeNodes.map((node) => node.color);
    const compositeClassMap = compositeNodes.map((node) => node.compositeClass);
    const compositeVisibleScoreMap = compositeNodes.map((node) => node.visibleScore);

    const model = {
      modelType: "HEARTH_COMPOSITE_WORLD_EXPRESSION_MODEL",
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

      gridSize: GRID_SIZE,
      nodeCount: NODE_COUNT,
      compositeNodes,
      compositeClasses: clonePlain(COMPOSITE_CLASSES),
      compositeClassIndex: clonePlain(byClass),
      compositeColorMap,
      compositeClassMap,
      compositeVisibleScoreMap,

      dependencySummary: {
        landformDependencyObserved: state.landformDependencyObserved,
        elevationDependencyObserved: state.elevationDependencyObserved,
        hydrologyDependencyObserved: state.hydrologyDependencyObserved,
        materialDependencyObserved: state.materialDependencyObserved,
        atmosphereDependencyObserved: state.atmosphereDependencyObserved,
        lightingDependencyObserved: state.lightingDependencyObserved,

        landformPacketObserved: state.landformPacketObserved,
        elevationPacketObserved: state.elevationPacketObserved,
        hydrologyPacketObserved: state.hydrologyPacketObserved,
        materialPacketObserved: state.materialPacketObserved,
        atmospherePacketObserved: state.atmospherePacketObserved,
        lightingPacketObserved: state.lightingPacketObserved,

        landformFallbackUsed: state.landformFallbackUsed,
        elevationFallbackUsed: state.elevationFallbackUsed,
        hydrologyFallbackUsed: state.hydrologyFallbackUsed,
        materialFallbackUsed: state.materialFallbackUsed,
        atmosphereFallbackUsed: state.atmosphereFallbackUsed,
        lightingFallbackUsed: state.lightingFallbackUsed
      },

      visibleExpressionRules: {
        compositeFollowsAllPriorFingers: true,
        compositeMayAssembleExpression: true,
        compositeMayDrawWhenGivenCanvasContext: true,
        compositeMayNotCreateRouteMount: true,
        compositeMayNotMutateHtml: true,
        compositeMayNotOwnInspectButton: true,
        compositeMayNotClaimFinalVisualPass: true,
        compositeMayNotClaimF13: true,
        compositeMayNotClaimF21: true
      },

      narrativeDisposition: {
        landform: "Landform gave Hearth body definition.",
        elevation: "Elevation gave that body relief.",
        hydrology: "Hydrology gave the relief water logic.",
        material: "Material gave the body skin.",
        atmosphere: "Atmosphere gave the skin an air envelope.",
        lighting: "Lighting gave the air and skin readable shadow and rim.",
        composite: "Composite assembles the visible planet expression where the globe belongs."
      },

      finalCompositeTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeModel = clonePlain(model);
    state.compositeModelReady = true;
    state.diagnostic256Ready = compositeNodes.length === NODE_COUNT;

    state.compositeNodeCount = compositeNodes.length;
    state.deepBasinVisibleNodeCount = (byClass[COMPOSITE_CLASSES.DEEP_BASIN_VISIBLE] || []).length;
    state.oceanBodyVisibleNodeCount = (byClass[COMPOSITE_CLASSES.OCEAN_BODY_VISIBLE] || []).length;
    state.shelfRimVisibleNodeCount = (byClass[COMPOSITE_CLASSES.SHELF_RIM_VISIBLE] || []).length;
    state.riverThreadVisibleNodeCount = (byClass[COMPOSITE_CLASSES.RIVER_THREAD_VISIBLE] || []).length;
    state.wetlandSoftVisibleNodeCount = (byClass[COMPOSITE_CLASSES.WETLAND_SOFT_VISIBLE] || []).length;
    state.mineralGlintVisibleNodeCount = (byClass[COMPOSITE_CLASSES.MINERAL_GLINT_VISIBLE] || []).length;
    state.aquiferDarkGroundVisibleNodeCount = (byClass[COMPOSITE_CLASSES.AQUIFER_DARK_GROUND_VISIBLE] || []).length;
    state.highlandRimVisibleNodeCount = (byClass[COMPOSITE_CLASSES.HIGHLAND_RIM_VISIBLE] || []).length;
    state.dryCrustVisibleNodeCount = (byClass[COMPOSITE_CLASSES.DRY_CRUST_VISIBLE] || []).length;
    state.temperateLandVisibleNodeCount = (byClass[COMPOSITE_CLASSES.TEMPERATE_LAND_VISIBLE] || []).length;

    state.renderContributionAvailable = true;
    state.visibleWorldExpressionAvailable = true;

    record("COMPOSITE_FINGER_MODEL_BUILT", {
      nodeCount: compositeNodes.length,
      deepBasinVisibleNodeCount: state.deepBasinVisibleNodeCount,
      oceanBodyVisibleNodeCount: state.oceanBodyVisibleNodeCount,
      shelfRimVisibleNodeCount: state.shelfRimVisibleNodeCount,
      highlandRimVisibleNodeCount: state.highlandRimVisibleNodeCount,
      fallbackSummary: model.dependencySummary
    });

    return model;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.compositeModel || buildCompositeModel();

    const packet = {
      packetType: "HEARTH_COMPOSITE_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "composite",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      compositeModelReady: true,
      worldExpressionPacketReady: true,
      drawToCanvasAvailable: true,

      inspectSummary: {
        compositeNodeCount: state.compositeNodeCount,
        deepBasinVisibleNodeCount: state.deepBasinVisibleNodeCount,
        oceanBodyVisibleNodeCount: state.oceanBodyVisibleNodeCount,
        shelfRimVisibleNodeCount: state.shelfRimVisibleNodeCount,
        riverThreadVisibleNodeCount: state.riverThreadVisibleNodeCount,
        wetlandSoftVisibleNodeCount: state.wetlandSoftVisibleNodeCount,
        mineralGlintVisibleNodeCount: state.mineralGlintVisibleNodeCount,
        aquiferDarkGroundVisibleNodeCount: state.aquiferDarkGroundVisibleNodeCount,
        highlandRimVisibleNodeCount: state.highlandRimVisibleNodeCount,
        dryCrustVisibleNodeCount: state.dryCrustVisibleNodeCount,
        temperateLandVisibleNodeCount: state.temperateLandVisibleNodeCount
      },

      readyForInspect: true,
      diagnosticRailAuthority: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.inspectPrepPacket = clonePlain(packet);
    return packet;
  }

  function buildCompositePacket(options = {}) {
    const model = buildCompositeModel(options);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_COMPOSITE_FINGER_PACKET",
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

      compositeFingerActive: true,
      worldExpressionAssemblyActive: true,
      compositeModelReady: true,
      compositePacketReady: true,
      worldExpressionPacketReady: true,
      diagnostic256Ready: true,
      drawToCanvasAvailable: true,
      renderContributionAvailable: true,
      visibleWorldExpressionAvailable: true,

      sourceFiles: {
        landform: LANDFORM_FILE,
        elevation: ELEVATION_FILE,
        hydrology: HYDROLOGY_FILE,
        material: MATERIAL_FILE,
        atmosphere: ATMOSPHERE_FILE,
        lighting: LIGHTING_FILE
      },

      sourceContractsExpected: {
        landform: LANDFORM_CONTRACT,
        elevation: ELEVATION_CONTRACT,
        hydrology: HYDROLOGY_CONTRACT,
        material: MATERIAL_CONTRACT,
        atmosphere: ATMOSPHERE_CONTRACT,
        lighting: LIGHTING_CONTRACT
      },

      dependencySummary: clonePlain(model.dependencySummary),
      compositeModel: clonePlain(model),
      worldExpressionModel: clonePlain(model),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_INSPECT_FINGER_EXPANSION",
      postgameStatus: "COMPOSITE_WORLD_EXPRESSION_PACKET_READY_FOR_INSPECT",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositePacket = clonePlain(packet);
    state.worldExpressionPacket = clonePlain(packet);
    state.compositePacketReady = true;
    state.worldExpressionPacketReady = true;
    state.inspectPrepPacketReady = true;

    state.firstFailedCoordinate = "WAITING_INSPECT_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "COMPOSITE_WORLD_EXPRESSION_PACKET_READY_FOR_INSPECT";

    record("COMPOSITE_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      worldExpressionPacketReady: true,
      drawToCanvasAvailable: true,
      nextFile: NEXT_FILE
    });

    return packet;
  }

  function getCompositeModel(options = {}) {
    if (!state.compositeModel || options.rebuild === true) {
      return buildCompositeModel(options);
    }

    return clonePlain(state.compositeModel);
  }

  function getCompositePacket(options = {}) {
    if (!state.compositePacket || options.rebuild === true) {
      return buildCompositePacket(options);
    }

    return clonePlain(state.compositePacket);
  }

  function getWorldExpressionPacket(options = {}) {
    return getCompositePacket(options);
  }

  function getWorldExpressionModel(options = {}) {
    return getCompositeModel(options);
  }

  function getCompositeColorMap(options = {}) {
    const model = getCompositeModel(options);
    return clonePlain(model.compositeColorMap || []);
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
    const nodes = model && Array.isArray(model.compositeNodes) ? model.compositeNodes : [];
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

  function sampleComposite(x, y, options = {}) {
    const model = getCompositeModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_COMPOSITE_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      compositeClass: node ? node.compositeClass : "UNKNOWN",
      visibleScore: node ? node.visibleScore : 0,
      color: node ? clonePlain(node.color) : null,
      finalCompositeTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleComposite(x, y, options);
  }

  function drawBackground(ctx, width, height) {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.44, width * 0.10, width * 0.5, height * 0.52, width * 0.72);
    bg.addColorStop(0, "rgba(14, 34, 68, 1)");
    bg.addColorStop(0.52, "rgba(3, 13, 32, 1)");
    bg.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 84; i += 1) {
      const x = (i * 89) % width;
      const y = (i * 47) % height;
      const a = 0.08 + ((i % 7) * 0.018);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 4 === 0 ? 1.1 : 0.62, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function pointInsideGlobe(px, py, cx, cy, radius) {
    const dx = (px - cx) / radius;
    const dy = (py - cy) / radius;
    const dist = (dx * dx) + (dy * dy);
    return dist <= 1;
  }

  function shadeForGlobe(px, py, cx, cy, radius) {
    const nx = (px - cx) / radius;
    const ny = (py - cy) / radius;
    const nz = Math.sqrt(Math.max(0, 1 - (nx * nx) - (ny * ny)));

    const lx = -0.44;
    const ly = -0.58;
    const lz = 0.70;

    const dot = clamp((nx * lx) + (ny * ly) + (nz * lz), 0, 1);
    const rim = clamp(1 - nz, 0, 1);

    return {
      light: dot,
      rim,
      shadow: 1 - dot
    };
  }

  function drawToCanvas(canvasOrContext, options = {}) {
    const target = canvasOrContext || null;
    const context = target && isFunction(target.getContext)
      ? target.getContext("2d")
      : target && isFunction(target.beginPath)
        ? target
        : null;

    state.drawAttempted = true;
    state.drawComplete = false;
    state.drawHeldReason = "DRAW_STARTED";
    state.drawError = "";

    if (!context) {
      state.drawHeldReason = "NO_2D_CANVAS_CONTEXT";
      state.lastDrawReceipt = {
        drawn: false,
        reason: state.drawHeldReason,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
      return clonePlain(state.lastDrawReceipt);
    }

    const canvas = context.canvas || target;
    const width = safeNumber(options.width || (canvas && canvas.width), 0);
    const height = safeNumber(options.height || (canvas && canvas.height), 0);

    if (!width || !height) {
      state.drawHeldReason = "CANVAS_DIMENSIONS_UNAVAILABLE";
      state.lastDrawReceipt = {
        drawn: false,
        reason: state.drawHeldReason,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
      return clonePlain(state.lastDrawReceipt);
    }

    const model = getCompositeModel(options);
    const nodes = Array.isArray(model.compositeNodes) ? model.compositeNodes : [];

    try {
      context.save();
      context.clearRect(0, 0, width, height);

      drawBackground(context, width, height);

      const cx = safeNumber(options.centerX, width * 0.5);
      const cy = safeNumber(options.centerY, height * 0.52);
      const radius = safeNumber(options.radius, Math.min(width, height) * 0.38);
      const cellW = (radius * 2) / GRID_SIZE;
      const cellH = (radius * 2) / GRID_SIZE;
      const left = cx - radius;
      const top = cy - radius;

      const glow = context.createRadialGradient(cx, cy, radius * 0.84, cx, cy, radius * 1.52);
      glow.addColorStop(0, "rgba(92, 178, 255, 0.04)");
      glow.addColorStop(0.46, "rgba(110, 196, 255, 0.18)");
      glow.addColorStop(1, "rgba(30, 44, 96, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(cx, cy, radius * 1.52, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.clip();

      const oceanBase = context.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.08, cx, cy, radius);
      oceanBase.addColorStop(0, "rgba(86, 188, 235, 1)");
      oceanBase.addColorStop(0.42, "rgba(25, 108, 174, 1)");
      oceanBase.addColorStop(0.78, "rgba(8, 44, 102, 1)");
      oceanBase.addColorStop(1, "rgba(2, 13, 40, 1)");
      context.fillStyle = oceanBase;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      for (const node of nodes) {
        const x = left + node.col * cellW;
        const y = top + node.row * cellH;
        const centerPx = x + cellW * 0.5;
        const centerPy = y + cellH * 0.5;

        if (!pointInsideGlobe(centerPx, centerPy, cx, cy, radius)) continue;

        const shade = shadeForGlobe(centerPx, centerPy, cx, cy, radius);
        const color = node.color || { r: 110, g: 126, b: 86, a: 0.9 };
        const visible = clamp(node.visibleScore, 0, 1);
        const alpha = clamp((color.a || 0.88) * (0.48 + visible * 0.40), 0.30, 0.96);

        const litR = Math.round(clamp(color.r * (0.62 + shade.light * 0.42) + shade.rim * 32, 0, 255));
        const litG = Math.round(clamp(color.g * (0.62 + shade.light * 0.42) + shade.rim * 36, 0, 255));
        const litB = Math.round(clamp(color.b * (0.62 + shade.light * 0.42) + shade.rim * 44, 0, 255));

        context.fillStyle = `rgba(${litR}, ${litG}, ${litB}, ${alpha})`;
        context.fillRect(x - 1, y - 1, Math.ceil(cellW) + 2, Math.ceil(cellH) + 2);

        if (node.compositeClass === COMPOSITE_CLASSES.RIVER_THREAD_VISIBLE) {
          context.strokeStyle = "rgba(210, 236, 236, 0.45)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.12);
          context.beginPath();
          context.moveTo(x + cellW * 0.15, y + cellH * 0.72);
          context.lineTo(x + cellW * 0.84, y + cellH * 0.30);
          context.stroke();
        }

        if (node.compositeClass === COMPOSITE_CLASSES.MINERAL_GLINT_VISIBLE) {
          context.fillStyle = "rgba(255, 236, 150, 0.58)";
          context.beginPath();
          context.arc(centerPx, centerPy, Math.max(1, Math.min(cellW, cellH) * 0.13), 0, Math.PI * 2);
          context.fill();
        }

        if (node.rimLight >= 0.56 || node.compositeClass === COMPOSITE_CLASSES.HIGHLAND_RIM_VISIBLE) {
          context.strokeStyle = "rgba(220, 242, 255, 0.32)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.07);
          context.beginPath();
          context.moveTo(x + cellW * 0.08, y + cellH * 0.18);
          context.lineTo(x + cellW * 0.86, y + cellH * 0.76);
          context.stroke();
        }
      }

      const shadeOverlay = context.createRadialGradient(cx - radius * 0.30, cy - radius * 0.38, radius * 0.12, cx + radius * 0.36, cy + radius * 0.32, radius * 1.08);
      shadeOverlay.addColorStop(0, "rgba(255,255,255,0.24)");
      shadeOverlay.addColorStop(0.42, "rgba(255,255,255,0.03)");
      shadeOverlay.addColorStop(0.80, "rgba(0,0,0,0.22)");
      shadeOverlay.addColorStop(1, "rgba(0,0,0,0.58)");
      context.fillStyle = shadeOverlay;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      context.restore();

      context.strokeStyle = "rgba(210, 238, 255, 0.72)";
      context.lineWidth = Math.max(1.5, radius * 0.014);
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.stroke();

      context.strokeStyle = "rgba(255, 226, 150, 0.18)";
      context.lineWidth = Math.max(1, radius * 0.008);
      context.beginPath();
      context.arc(cx, cy, radius * 1.018, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = "rgba(238,247,255,0.74)";
      context.font = `${Math.max(11, Math.round(Math.min(width, height) * 0.028))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      context.textAlign = "center";
      context.fillText("Hearth · Composite world expression", cx, Math.min(height - 18, cy + radius + 32));

      context.restore();

      state.drawComplete = true;
      state.drawHeldReason = "NONE";
      state.drawWidth = width;
      state.drawHeight = height;
      state.drawNodeCount = nodes.length;
      state.drawUpdatedAt = nowIso();

      state.lastDrawReceipt = {
        drawn: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        worldName: WORLD_NAME,
        nodeCount: nodes.length,
        width,
        height,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE,
        updatedAt: state.drawUpdatedAt
      };

      record("COMPOSITE_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        nodeCount: nodes.length,
        finalVisualClaim: false
      });

      updateDataset();
      publishGlobals();

      return clonePlain(state.lastDrawReceipt);
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      state.drawComplete = false;
      state.drawHeldReason = "DRAW_FAILED";
      state.drawError = error && error.message ? String(error.message) : String(error);

      recordError("COMPOSITE_FINGER_DRAW_TO_CANVAS_FAILED", error);

      state.lastDrawReceipt = {
        drawn: false,
        reason: state.drawHeldReason,
        error: state.drawError,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        finalVisualClaim: false,
        ...FINAL_FALSE,
        updatedAt: nowIso()
      };

      updateDataset();
      publishGlobals();

      return clonePlain(state.lastDrawReceipt);
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
    const packet = getCompositePacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("COMPOSITE_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
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
          : "CANVAS_HUB_REJECTED_COMPOSITE_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("COMPOSITE_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("COMPOSITE_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("COMPOSITE_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
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
    const packet = getCompositePacket(options);
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
          : "SURFACE_POINTER_REJECTED_COMPOSITE_PACKET";

        record("COMPOSITE_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("COMPOSITE_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
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

      compositeFingerLoaded: state.compositeFingerLoaded,
      compositeFingerActive: state.compositeFingerActive,
      worldExpressionAssemblyActive: state.worldExpressionAssemblyActive,
      compositeModelReady: state.compositeModelReady,
      compositePacketReady: state.compositePacketReady,
      worldExpressionPacketReady: state.worldExpressionPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      drawToCanvasAvailable: true,
      renderContributionAvailable: state.renderContributionAvailable,
      visibleWorldExpressionAvailable: state.visibleWorldExpressionAvailable,

      landformDependencyObserved: state.landformDependencyObserved,
      elevationDependencyObserved: state.elevationDependencyObserved,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      materialDependencyObserved: state.materialDependencyObserved,
      atmosphereDependencyObserved: state.atmosphereDependencyObserved,
      lightingDependencyObserved: state.lightingDependencyObserved,

      landformPacketObserved: state.landformPacketObserved,
      elevationPacketObserved: state.elevationPacketObserved,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      materialPacketObserved: state.materialPacketObserved,
      atmospherePacketObserved: state.atmospherePacketObserved,
      lightingPacketObserved: state.lightingPacketObserved,

      landformReceiptObserved: state.landformReceiptObserved,
      elevationReceiptObserved: state.elevationReceiptObserved,
      hydrologyReceiptObserved: state.hydrologyReceiptObserved,
      materialReceiptObserved: state.materialReceiptObserved,
      atmosphereReceiptObserved: state.atmosphereReceiptObserved,
      lightingReceiptObserved: state.lightingReceiptObserved,

      landformSourceName: state.landformSourceName,
      elevationSourceName: state.elevationSourceName,
      hydrologySourceName: state.hydrologySourceName,
      materialSourceName: state.materialSourceName,
      atmosphereSourceName: state.atmosphereSourceName,
      lightingSourceName: state.lightingSourceName,

      landformFallbackUsed: state.landformFallbackUsed,
      elevationFallbackUsed: state.elevationFallbackUsed,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,
      materialFallbackUsed: state.materialFallbackUsed,
      atmosphereFallbackUsed: state.atmosphereFallbackUsed,
      lightingFallbackUsed: state.lightingFallbackUsed,

      compositeNodeCount: state.compositeNodeCount,
      deepBasinVisibleNodeCount: state.deepBasinVisibleNodeCount,
      oceanBodyVisibleNodeCount: state.oceanBodyVisibleNodeCount,
      shelfRimVisibleNodeCount: state.shelfRimVisibleNodeCount,
      riverThreadVisibleNodeCount: state.riverThreadVisibleNodeCount,
      wetlandSoftVisibleNodeCount: state.wetlandSoftVisibleNodeCount,
      mineralGlintVisibleNodeCount: state.mineralGlintVisibleNodeCount,
      aquiferDarkGroundVisibleNodeCount: state.aquiferDarkGroundVisibleNodeCount,
      highlandRimVisibleNodeCount: state.highlandRimVisibleNodeCount,
      dryCrustVisibleNodeCount: state.dryCrustVisibleNodeCount,
      temperateLandVisibleNodeCount: state.temperateLandVisibleNodeCount,

      inspectPrepPacketReady: state.inspectPrepPacketReady,

      drawAttempted: state.drawAttempted,
      drawComplete: state.drawComplete,
      drawHeldReason: state.drawHeldReason,
      drawError: state.drawError,
      drawWidth: state.drawWidth,
      drawHeight: state.drawHeight,
      drawNodeCount: state.drawNodeCount,

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
      sampleCompositeAvailable: true,

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

      landformEvidence: clonePlain(state.landformEvidence),
      elevationEvidence: clonePlain(state.elevationEvidence),
      hydrologyEvidence: clonePlain(state.hydrologyEvidence),
      materialEvidence: clonePlain(state.materialEvidence),
      atmosphereEvidence: clonePlain(state.atmosphereEvidence),
      lightingEvidence: clonePlain(state.lightingEvidence),

      compositeModel: clonePlain(state.compositeModel),
      compositePacket: clonePlain(state.compositePacket),
      worldExpressionPacket: clonePlain(state.worldExpressionPacket),
      inspectPrepPacket: clonePlain(state.inspectPrepPacket),
      lastDrawReceipt: clonePlain(state.lastDrawReceipt),

      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),
      compositeClasses: clonePlain(COMPOSITE_CLASSES),
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
      "HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_RECEIPT",
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
      "COMPOSITE_STATUS",
      line("compositeFingerLoaded", r.compositeFingerLoaded),
      line("compositeFingerActive", r.compositeFingerActive),
      line("worldExpressionAssemblyActive", r.worldExpressionAssemblyActive),
      line("compositeModelReady", r.compositeModelReady),
      line("compositePacketReady", r.compositePacketReady),
      line("worldExpressionPacketReady", r.worldExpressionPacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("drawToCanvasAvailable", r.drawToCanvasAvailable),
      line("renderContributionAvailable", r.renderContributionAvailable),
      line("visibleWorldExpressionAvailable", r.visibleWorldExpressionAvailable),
      "",
      "DEPENDENCIES",
      line("landformDependencyObserved", r.landformDependencyObserved),
      line("elevationDependencyObserved", r.elevationDependencyObserved),
      line("hydrologyDependencyObserved", r.hydrologyDependencyObserved),
      line("materialDependencyObserved", r.materialDependencyObserved),
      line("atmosphereDependencyObserved", r.atmosphereDependencyObserved),
      line("lightingDependencyObserved", r.lightingDependencyObserved),
      line("landformPacketObserved", r.landformPacketObserved),
      line("elevationPacketObserved", r.elevationPacketObserved),
      line("hydrologyPacketObserved", r.hydrologyPacketObserved),
      line("materialPacketObserved", r.materialPacketObserved),
      line("atmospherePacketObserved", r.atmospherePacketObserved),
      line("lightingPacketObserved", r.lightingPacketObserved),
      line("landformFallbackUsed", r.landformFallbackUsed),
      line("elevationFallbackUsed", r.elevationFallbackUsed),
      line("hydrologyFallbackUsed", r.hydrologyFallbackUsed),
      line("materialFallbackUsed", r.materialFallbackUsed),
      line("atmosphereFallbackUsed", r.atmosphereFallbackUsed),
      line("lightingFallbackUsed", r.lightingFallbackUsed),
      "",
      "COUNTS",
      line("compositeNodeCount", r.compositeNodeCount),
      line("deepBasinVisibleNodeCount", r.deepBasinVisibleNodeCount),
      line("oceanBodyVisibleNodeCount", r.oceanBodyVisibleNodeCount),
      line("shelfRimVisibleNodeCount", r.shelfRimVisibleNodeCount),
      line("riverThreadVisibleNodeCount", r.riverThreadVisibleNodeCount),
      line("wetlandSoftVisibleNodeCount", r.wetlandSoftVisibleNodeCount),
      line("mineralGlintVisibleNodeCount", r.mineralGlintVisibleNodeCount),
      line("aquiferDarkGroundVisibleNodeCount", r.aquiferDarkGroundVisibleNodeCount),
      line("highlandRimVisibleNodeCount", r.highlandRimVisibleNodeCount),
      line("dryCrustVisibleNodeCount", r.dryCrustVisibleNodeCount),
      line("temperateLandVisibleNodeCount", r.temperateLandVisibleNodeCount),
      "",
      "DRAW",
      line("drawAttempted", r.drawAttempted),
      line("drawComplete", r.drawComplete),
      line("drawHeldReason", r.drawHeldReason),
      line("drawError", r.drawError),
      line("drawWidth", r.drawWidth),
      line("drawHeight", r.drawHeight),
      line("drawNodeCount", r.drawNodeCount),
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
      line("landformTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("atmosphereTruthClaimed", false),
      line("lightingTruthClaimed", false),
      line("compositeTruthClaimed", false),
      line("finalCompositeTruthClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerCompositeLoaded", "true");
    setDataset("hearthCanvasFingerCompositeContract", CONTRACT);
    setDataset("hearthCanvasFingerCompositeReceipt", RECEIPT);
    setDataset("hearthCanvasFingerCompositePacket", PACKET);
    setDataset("hearthCanvasFingerCompositeFile", FILE);
    setDataset("hearthCanvasFingerCompositeWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerCompositeDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerCompositeDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerCompositeExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerCompositeReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerCompositeModelReady", String(state.compositeModelReady));
    setDataset("hearthCanvasFingerCompositePacketReady", String(state.compositePacketReady));
    setDataset("hearthCanvasFingerCompositeWorldExpressionPacketReady", String(state.worldExpressionPacketReady));
    setDataset("hearthCanvasFingerCompositeDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerCompositeDrawToCanvasAvailable", "true");
    setDataset("hearthCanvasFingerCompositeRenderContributionAvailable", String(state.renderContributionAvailable));
    setDataset("hearthCanvasFingerCompositeVisibleWorldExpressionAvailable", String(state.visibleWorldExpressionAvailable));

    setDataset("hearthCanvasFingerCompositeLandformDependencyObserved", String(state.landformDependencyObserved));
    setDataset("hearthCanvasFingerCompositeElevationDependencyObserved", String(state.elevationDependencyObserved));
    setDataset("hearthCanvasFingerCompositeHydrologyDependencyObserved", String(state.hydrologyDependencyObserved));
    setDataset("hearthCanvasFingerCompositeMaterialDependencyObserved", String(state.materialDependencyObserved));
    setDataset("hearthCanvasFingerCompositeAtmosphereDependencyObserved", String(state.atmosphereDependencyObserved));
    setDataset("hearthCanvasFingerCompositeLightingDependencyObserved", String(state.lightingDependencyObserved));

    setDataset("hearthCanvasFingerCompositeLandformPacketObserved", String(state.landformPacketObserved));
    setDataset("hearthCanvasFingerCompositeElevationPacketObserved", String(state.elevationPacketObserved));
    setDataset("hearthCanvasFingerCompositeHydrologyPacketObserved", String(state.hydrologyPacketObserved));
    setDataset("hearthCanvasFingerCompositeMaterialPacketObserved", String(state.materialPacketObserved));
    setDataset("hearthCanvasFingerCompositeAtmospherePacketObserved", String(state.atmospherePacketObserved));
    setDataset("hearthCanvasFingerCompositeLightingPacketObserved", String(state.lightingPacketObserved));

    setDataset("hearthCanvasFingerCompositeLandformFallbackUsed", String(state.landformFallbackUsed));
    setDataset("hearthCanvasFingerCompositeElevationFallbackUsed", String(state.elevationFallbackUsed));
    setDataset("hearthCanvasFingerCompositeHydrologyFallbackUsed", String(state.hydrologyFallbackUsed));
    setDataset("hearthCanvasFingerCompositeMaterialFallbackUsed", String(state.materialFallbackUsed));
    setDataset("hearthCanvasFingerCompositeAtmosphereFallbackUsed", String(state.atmosphereFallbackUsed));
    setDataset("hearthCanvasFingerCompositeLightingFallbackUsed", String(state.lightingFallbackUsed));

    setDataset("hearthCanvasFingerCompositeNodeCount", String(state.compositeNodeCount));
    setDataset("hearthCanvasFingerCompositeDeepBasinVisibleNodeCount", String(state.deepBasinVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeOceanBodyVisibleNodeCount", String(state.oceanBodyVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeShelfRimVisibleNodeCount", String(state.shelfRimVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeRiverThreadVisibleNodeCount", String(state.riverThreadVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeWetlandSoftVisibleNodeCount", String(state.wetlandSoftVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeMineralGlintVisibleNodeCount", String(state.mineralGlintVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeAquiferDarkGroundVisibleNodeCount", String(state.aquiferDarkGroundVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeHighlandRimVisibleNodeCount", String(state.highlandRimVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeDryCrustVisibleNodeCount", String(state.dryCrustVisibleNodeCount));
    setDataset("hearthCanvasFingerCompositeTemperateLandVisibleNodeCount", String(state.temperateLandVisibleNodeCount));

    setDataset("hearthCanvasFingerCompositeDrawAttempted", String(state.drawAttempted));
    setDataset("hearthCanvasFingerCompositeDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasFingerCompositeDrawHeldReason", state.drawHeldReason);
    setDataset("hearthCanvasFingerCompositeDrawError", state.drawError);
    setDataset("hearthCanvasFingerCompositeDrawWidth", String(state.drawWidth));
    setDataset("hearthCanvasFingerCompositeDrawHeight", String(state.drawHeight));
    setDataset("hearthCanvasFingerCompositeDrawNodeCount", String(state.drawNodeCount));

    setDataset("hearthCanvasFingerCompositeSurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerCompositeSurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerCompositeSurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerCompositeSurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerCompositeSurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerCompositeSurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerCompositeHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerCompositeHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerCompositeHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerCompositeHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerCompositeHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerCompositeHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerCompositeFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerCompositeRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerCompositePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerCompositeNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerCompositeF13Claimed", "false");
    setDataset("hearthCanvasFingerCompositeF21Claimed", "false");
    setDataset("hearthCanvasFingerCompositeReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerCompositeTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeLandformTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeFinalCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerCompositeVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerCompositeGeneratedImage", "false");
    setDataset("hearthCanvasFingerCompositeGraphicBox", "false");
    setDataset("hearthCanvasFingerCompositeWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerComposite = api;
    hearth.canvasCompositeFinger = api;
    hearth.canvasFingerCompositeReceipt = getReceiptLight();
    hearth.canvasFingerCompositePacket = getCompositePacket();
    hearth.worldExpressionPacket = getWorldExpressionPacket();

    lab.hearthCanvasFingerComposite = api;
    lab.hearthCanvasCompositeFinger = api;
    lab.hearthCanvasFingerCompositeReceipt = getReceiptLight();
    lab.hearthCanvasFingerCompositePacket = getCompositePacket();
    lab.hearthWorldExpressionPacket = getWorldExpressionPacket();

    root.HEARTH_CANVAS_FINGER_COMPOSITE = api;
    root.HEARTH_CANVAS_COMPOSITE_FINGER = api;
    root.HEARTH_CANVAS_FINGER_COMPOSITE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_COMPOSITE_WORLD_EXPRESSION_ASSEMBLY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_COMPOSITE_PACKET = getCompositePacket();
    root.HEARTH_CANVAS_WORLD_EXPRESSION_PACKET = getWorldExpressionPacket();
    root.HEARTH_WORLD_EXPRESSION_PACKET = getWorldExpressionPacket();

    root.HEARTH_CANVAS_COMPOSITE_COLOR_MAP = getCompositeColorMap();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readAllLayerEvidence(options);
    buildCompositePacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("COMPOSITE_FINGER_BOOT_COMPLETE", {
      compositeModelReady: state.compositeModelReady,
      compositePacketReady: state.compositePacketReady,
      worldExpressionPacketReady: state.worldExpressionPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,
      drawToCanvasAvailable: true,
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
    MATERIAL_FILE,
    ATMOSPHERE_FILE,
    LIGHTING_FILE,
    SURFACE_FILE,
    NEXT_FILE,
    INSPECT_FILE,

    LANDFORM_CONTRACT,
    ELEVATION_CONTRACT,
    HYDROLOGY_CONTRACT,
    MATERIAL_CONTRACT,
    ATMOSPHERE_CONTRACT,
    LIGHTING_CONTRACT,

    GRID_SIZE,
    NODE_COUNT,
    FINGER_NAME,
    FINGER_ROLE,
    FINGER_ORDER,
    PLANETARY_DISPOSITION_INDEX,
    PLANETARY_DISPOSITION,
    FINGER_SEQUENCE,
    FINGER_FILES,
    COMPOSITE_CLASSES,

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

    readAllLayerEvidence,
    buildCompositeModel,
    buildCompositePacket,
    buildInspectPrepPacket,

    getCompositeModel,
    getCompositePacket,
    getWorldExpressionModel,
    getWorldExpressionPacket,
    getCompositeColorMap,

    sample,
    sampleComposite,
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

    supportsCompositeFinger: true,
    supportsWorldExpressionAssembly: true,
    supportsAllPriorFingerConsumption: true,
    supportsDiagnostic256CompositeScope: true,
    supportsDrawToCanvas: true,
    supportsWorldExpressionPacket: true,
    supportsCompositePacket: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoDomMounting: true,
    supportsNoFinalClaims: true,

    ownsCompositeFingerIdentity: true,
    ownsWorldExpressionAssembly: true,
    ownsCompositeExpressionPacket: true,
    ownsDrawReadyExpression: true,

    ownsRouteMount: false,
    ownsInspectButton: false,
    ownsHtml: false,
    ownsIndexJs: false,
    ownsCanvasParent: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsFinalTerrainTruth: false,
    ownsFinalCompositeTruth: false,
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

    readAllLayerEvidence();
    buildCompositePacket();
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
    recordError("COMPOSITE_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
