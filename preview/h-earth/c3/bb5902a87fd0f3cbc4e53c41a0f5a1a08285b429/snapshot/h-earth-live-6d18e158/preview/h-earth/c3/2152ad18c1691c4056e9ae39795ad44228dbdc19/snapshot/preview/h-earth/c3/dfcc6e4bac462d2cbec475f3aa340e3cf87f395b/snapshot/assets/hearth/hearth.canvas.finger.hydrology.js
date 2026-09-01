// /assets/hearth/hearth.canvas.finger.hydrology.js
// HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Hydrology / Water-Level Authority.
// Purpose:
// - Establish Hydrology as the third planetary-disposition expansion finger after Landform and Elevation.
// - Consume the Elevation relief-prep packet when available.
// - Convert Hearth's raised body into water logic: oceans, basins, shelves, rivers, wetlands, aquifers, springs, water table, and flow descent.
// - Preserve Landform as body definition and Elevation as relief definition.
// - Publish hydrology, material-prep, atmosphere-prep, lighting-prep, composite-prep, and inspect-prep packets.
// - Preserve Surface as the pointer/socket lane when available, without making Hydrology depend on Surface.
// - Register with Canvas Expression Hub when a lawful hub intake exists.
// - Continue expansion on the already-instilled finger architecture; do not treat this as reintegration.
// - Never mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Landform, Elevation, Surface, or any other finger file.
// - Never claim final terrain truth, final hydrology truth, final material truth, final atmospheric truth, final lighting truth, final visual pass, F13, F21, ready text, generated image, GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-hydrology-water-level-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const ELEVATION_CONTRACT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1";
  const ELEVATION_PACKET = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_PACKET_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;
  const SEA_LEVEL = 0.42;

  const FINGER_NAME = "hydrology";
  const FINGER_ROLE = "water-level-authority";
  const FINGER_ORDER = 3;
  const PLANETARY_DISPOSITION_INDEX = 3;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_WATER_LEVEL_ESTABLISHED";

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
    finalHydrologyTruthClaimed: false,
    materialTruthClaimed: false,
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
    hydrology: FILE,
    material: MATERIAL_FILE,
    atmosphere: ATMOSPHERE_FILE,
    lighting: LIGHTING_FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

  const ELEVATION_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerElevation",
    "HEARTH.canvasElevationFinger",
    "HEARTH.canvasFingerElevationAuthority",
    "HEARTH_CANVAS_FINGER_ELEVATION",
    "HEARTH_CANVAS_ELEVATION_FINGER",
    "HEARTH_CANVAS_FINGER_ELEVATION_PACKET",
    "HEARTH_ELEVATION_TO_HYDROLOGY_RELIEF_PREP_PACKET",
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
    "receiveHydrologyFingerPacket",
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
    "receiveHydrologyFingerPacket",
    "receiveHydrologyPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

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

    elevationFile: ELEVATION_FILE,
    elevationContractExpected: ELEVATION_CONTRACT,
    elevationPacketExpected: ELEVATION_PACKET,
    elevationDependencyExpected: true,
    elevationDependencyObserved: false,
    elevationAuthoritySourceName: "NONE",
    elevationPacketObserved: false,
    elevationReceiptObserved: false,
    elevationHydrologyPrepObserved: false,
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

    hydrologyFingerLoaded: true,
    hydrologyFingerActive: true,
    waterLevelAuthorityActive: true,
    hydrologyModelReady: false,
    hydrologyPacketReady: false,
    diagnostic256Ready: false,

    waterPresenceMapReady: false,
    waterDepthMapReady: false,
    oceanBasinMapReady: false,
    shelfWaterMapReady: false,
    riverChannelMapReady: false,
    wetlandMapReady: false,
    aquiferMapReady: false,
    springPotentialMapReady: false,
    waterfallPotentialMapReady: false,
    flowDirectionMapReady: false,

    materialHydrologyPrepPacketReady: false,
    atmosphereHydrologyPrepPacketReady: false,
    lightingHydrologyPrepPacketReady: false,
    compositeHydrologyPrepPacketReady: false,
    inspectPrepPacketReady: false,

    hydrologyNodeCount: 0,
    oceanNodeCount: 0,
    deepBasinNodeCount: 0,
    shelfWaterNodeCount: 0,
    inlandLakeNodeCount: 0,
    riverChannelNodeCount: 0,
    wetlandNodeCount: 0,
    aquiferNodeCount: 0,
    springPotentialNodeCount: 0,
    waterfallPotentialNodeCount: 0,
    dryUplandNodeCount: 0,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "HYDROLOGY_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "HYDROLOGY_FINGER_WAITING_BOOT",

    elevationEvidence: null,
    elevationPacket: null,
    elevationReceipt: null,
    elevationHydrologyPrepPacket: null,
    elevationNodes: [],
    hydrologyModel: null,
    hydrologyPacket: null,
    materialHydrologyPrepPacket: null,
    atmosphereHydrologyPrepPacket: null,
    lightingHydrologyPrepPacket: null,
    compositeHydrologyPrepPacket: null,
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
      event: safeString(event, "HYDROLOGY_FINGER_EVENT"),
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
      code: safeString(code, "HYDROLOGY_FINGER_ERROR"),
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
        recordError("HYDROLOGY_FINGER_AUTHORITY_READ_METHOD_FAILED", error, {
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

  function extractPacketFrom(value) {
    if (!isObject(value)) return null;

    const directKeys = [
      "hydrologyReliefPrepPacket",
      "elevationPacket",
      "packet",
      "elevationModel",
      "reliefPrepPacket",
      "compositeReliefPrepPacket"
    ];

    for (const key of directKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (
      Array.isArray(value.elevationNodes) ||
      Array.isArray(value.heightfieldMap) ||
      Array.isArray(value.basinFloorDepthMap) ||
      Array.isArray(value.waterlineReliefMap)
    ) {
      return value;
    }

    return null;
  }

  function extractReceiptFrom(value) {
    if (!isObject(value)) return null;

    const directKeys = [
      "receipt",
      "receiptLight",
      "elevationReceipt",
      "currentReceipt",
      "state"
    ];

    for (const key of directKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (value.contract || value.receipt || value.file || value.elevationModelReady !== undefined) return value;

    return null;
  }

  function extractElevationNodesFromPacket(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.elevationNodes,
      packet.nodes,
      packet.hydrologyNodes,
      packet.elevationModel && packet.elevationModel.elevationNodes,
      packet.compositeReliefPrepPacket && packet.compositeReliefPrepPacket.elevationNodes,
      packet.hydrologyReliefPrepPacket && packet.hydrologyReliefPrepPacket.elevationNodes,
      packet.original && packet.original.elevationNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    return [];
  }

  function hashNoise(a, b, seed = 0) {
    const x = Math.sin((a + 1) * 127.1 + (b + 1) * 311.7 + seed * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function smooth01(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function gaussian2(x, y, cx, cy, sx, sy, weight) {
    const dx = (x - cx) / Math.max(0.0001, sx);
    const dy = (y - cy) / Math.max(0.0001, sy);
    return Math.exp(-0.5 * ((dx * dx) + (dy * dy))) * weight;
  }

  function neighborIndexes(index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const out = [];

    if (row > 0) out.push(index - GRID_SIZE);
    if (row < GRID_SIZE - 1) out.push(index + GRID_SIZE);
    if (col > 0) out.push(index - 1);
    if (col < GRID_SIZE - 1) out.push(index + 1);

    return out;
  }

  function buildFallbackElevationNodes() {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = (col + 0.5) / GRID_SIZE;
      const y = (row + 0.5) / GRID_SIZE;

      const westernCrown = gaussian2(x, y, 0.28, 0.38, 0.10, 0.34, 0.48);
      const easternShoulder = gaussian2(x, y, 0.72, 0.46, 0.08, 0.34, 0.44);
      const centralBasin = gaussian2(x, y, 0.50, 0.55, 0.20, 0.24, -0.34);
      const southernShelf = gaussian2(x, y, 0.55, 0.76, 0.26, 0.08, -0.12);
      const northernShield = gaussian2(x, y, 0.49, 0.23, 0.27, 0.10, 0.24);
      const noise = (hashNoise(index, 5, 89) - 0.5) * 0.08;

      const elevation = clamp(0.42 + westernCrown + easternShoulder + northernShield + centralBasin + southernShelf + noise, 0, 1);
      const basinScore = clamp(gaussian2(x, y, 0.50, 0.55, 0.20, 0.24, 0.82) + gaussian2(x, y, 0.18, 0.62, 0.13, 0.25, 0.42), 0, 1);
      const shelfScore = clamp(smooth01(0.31, 0.47, elevation) * (0.4 + gaussian2(x, y, 0.58, 0.76, 0.28, 0.12, 0.6)), 0, 1);
      const upliftScore = clamp(westernCrown + easternShoulder + northernShield, 0, 1);
      const riftScore = clamp(gaussian2(x, y, 0.58, 0.52, 0.07, 0.33, 0.64), 0, 1);
      const slope = clamp((upliftScore * 0.20) + (riftScore * 0.18) + Math.abs(elevation - 0.45) * 0.20, 0, 1);

      nodes.push({
        index,
        id: `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`,
        row,
        col,
        x: round(x),
        y: round(y),
        worldName: WORLD_NAME,
        sourceDistrict: "FALLBACK_RELIEF_FIELD",
        sourceClass: "FALLBACK_ELEVATION",
        landScore: round(clamp(elevation + 0.12, 0, 1)),
        basinScore: round(basinScore),
        upliftScore: round(upliftScore),
        shelfScore: round(shelfScore),
        riftScore: round(riftScore),
        elevation: round(elevation),
        normalizedHeight: round(elevation),
        slope: round(slope),
        reliefClass: elevation < 0.31 ? "BASIN_FLOOR" : elevation < 0.43 ? "BASIN_SHOULDER" : elevation > 0.70 ? "HIGH_MOUNTAIN" : "UPLAND_BODY",
        basinFloor: elevation < 0.31 && basinScore > 0.44,
        shelfRelief: shelfScore > 0.42,
        drainagePrep: elevation > 0.34 && basinScore > 0.35,
        escarpment: slope > 0.24,
        drainageVector: {
          fromIndex: index,
          toIndex: index,
          dx: 0,
          dy: 0,
          descent: 0,
          hasDescent: false
        },
        hydrologyBasinEligibility: round(clamp((basinScore * 0.58) + ((1 - elevation) * 0.42), 0, 1)),
        hydrologyDrainageEligibility: round(clamp((slope * 0.52) + (basinScore * 0.24), 0, 1)),
        materialSedimentEligibility: round(clamp((shelfScore * 0.36) + (basinScore * 0.34) + ((1 - slope) * 0.18), 0, 1)),
        lightingShadowEligibility: round(clamp((slope * 0.52) + (elevation * 0.22), 0, 1)),
        finalTerrainTruthClaim: false,
        finalElevationTruthClaim: false,
        finalVisualClaim: false
      });
    }

    const heights = nodes.map((node) => node.elevation);

    for (const node of nodes) {
      const neighbors = neighborIndexes(node.index);
      let lowestIndex = node.index;
      let lowestHeight = node.elevation;

      for (const neighbor of neighbors) {
        if (heights[neighbor] < lowestHeight) {
          lowestIndex = neighbor;
          lowestHeight = heights[neighbor];
        }
      }

      const target = nodes[lowestIndex];

      node.drainageVector = {
        fromIndex: node.index,
        toIndex: lowestIndex,
        dx: round(target.x - node.x),
        dy: round(target.y - node.y),
        descent: round(Math.max(0, node.elevation - lowestHeight)),
        hasDescent: lowestIndex !== node.index
      };
    }

    return nodes;
  }

  function normalizeElevationNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    const x = clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1);
    const y = clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1);

    const elevation = clamp(getFirstNumber(raw, ["elevation", "normalizedHeight", "height", "heightfield"], 0.42), 0, 1);
    const slope = clamp(getFirstNumber(raw, ["slope", "slopeValue"], 0), 0, 1);
    const basinScore = clamp(getFirstNumber(raw, ["basinScore", "hydrologyBasinEligibility", "basinEligibility"], 1 - elevation), 0, 1);
    const shelfScore = clamp(getFirstNumber(raw, ["shelfScore", "waterlinePreparation", "shelfReliefScore"], 0), 0, 1);
    const upliftScore = clamp(getFirstNumber(raw, ["upliftScore", "reliefPressure", "mountainScore"], elevation), 0, 1);
    const riftScore = clamp(getFirstNumber(raw, ["riftScore", "fractureScore"], 0), 0, 1);
    const landScore = clamp(getFirstNumber(raw, ["landScore", "aboveWaterEligibility"], elevation), 0, 1);

    const drainageVector = isObject(raw && raw.drainageVector)
      ? clonePlain(raw.drainageVector)
      : {
          fromIndex: index,
          toIndex: index,
          dx: 0,
          dy: 0,
          descent: 0,
          hasDescent: false
        };

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`),
      row,
      col,
      x: round(x),
      y: round(y),
      worldName: WORLD_NAME,
      sourceDistrict: getFirstString(raw, ["sourceDistrict", "district", "zone"], "UNSPECIFIED"),
      sourceClass: getFirstString(raw, ["sourceClass", "class", "reliefClass"], "UNSPECIFIED"),

      landScore: round(landScore),
      basinScore: round(basinScore),
      upliftScore: round(upliftScore),
      shelfScore: round(shelfScore),
      riftScore: round(riftScore),
      elevation: round(elevation),
      normalizedHeight: round(elevation),
      slope: round(slope),
      reliefClass: getFirstString(raw, ["reliefClass"], elevation < SEA_LEVEL ? "LOW_RELIEF" : "RAISED_BODY"),

      basinFloor: getFirstBool(raw, ["basinFloor"], elevation < SEA_LEVEL && basinScore > 0.42),
      shelfRelief: getFirstBool(raw, ["shelfRelief"], shelfScore > 0.42),
      drainagePrep: getFirstBool(raw, ["drainagePrep"], false),
      escarpment: getFirstBool(raw, ["escarpment"], slope > 0.24),

      drainageVector,
      hydrologyBasinEligibility: round(clamp(getFirstNumber(raw, ["hydrologyBasinEligibility"], (basinScore * 0.58) + ((1 - elevation) * 0.42)), 0, 1)),
      hydrologyDrainageEligibility: round(clamp(getFirstNumber(raw, ["hydrologyDrainageEligibility"], (slope * 0.42) + (basinScore * 0.22)), 0, 1)),
      materialSedimentEligibility: round(clamp(getFirstNumber(raw, ["materialSedimentEligibility"], (shelfScore * 0.36) + (basinScore * 0.34)), 0, 1)),
      lightingShadowEligibility: round(clamp(getFirstNumber(raw, ["lightingShadowEligibility"], (slope * 0.52) + (elevation * 0.22)), 0, 1)),

      finalTerrainTruthClaim: false,
      finalElevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function readElevationEvidence(options = {}) {
    const found = findSource(ELEVATION_SOURCE_NAMES);

    state.elevationDependencyObserved = Boolean(found.source);
    state.elevationAuthoritySourceName = found.sourceName;
    state.elevationReadError = "";

    let packet = null;
    let receipt = null;
    let hydrologyPrep = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getHydrologyReliefPrepPacket",
          "getElevationPacket",
          "getElevationModel",
          "getCompositeReliefPrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate);

        if (packetCandidate && packetCandidate.packetType === "HEARTH_ELEVATION_TO_HYDROLOGY_RELIEF_PREP_PACKET") {
          hydrologyPrep = packetCandidate;
        } else if (packet && packet.packetType === "HEARTH_ELEVATION_TO_HYDROLOGY_RELIEF_PREP_PACKET") {
          hydrologyPrep = packet;
        } else if (packet && isObject(packet.hydrologyReliefPrepPacket)) {
          hydrologyPrep = packet.hydrologyReliefPrepPacket;
        }

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.elevationReadError = error && error.message ? String(error.message) : String(error);
        recordError("HYDROLOGY_FINGER_ELEVATION_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.elevationPacket && isObject(options.elevationPacket)) {
      packet = options.elevationPacket;
      state.elevationDependencyObserved = true;
      state.elevationAuthoritySourceName = "OPTIONS_ELEVATION_PACKET";
    }

    if (options.hydrologyReliefPrepPacket && isObject(options.hydrologyReliefPrepPacket)) {
      hydrologyPrep = options.hydrologyReliefPrepPacket;
      state.elevationDependencyObserved = true;
      state.elevationAuthoritySourceName = "OPTIONS_HYDROLOGY_RELIEF_PREP_PACKET";
    }

    const packetForNodes = hydrologyPrep || packet;
    const rawNodes = extractElevationNodesFromPacket(packetForNodes);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeElevationNode(entry, index));
    }

    while (nodes.length < NODE_COUNT) {
      const fallback = buildFallbackElevationNodes();
      nodes = fallback;
      break;
    }

    state.elevationPacketObserved = Boolean(packet);
    state.elevationReceiptObserved = Boolean(receipt);
    state.elevationHydrologyPrepObserved = Boolean(hydrologyPrep);
    state.elevationNodeCount = nodes.length;
    state.elevation256ScopeObserved = nodes.length === NODE_COUNT;
    state.elevationFallbackUsed = !packetForNodes || rawNodes.length === 0;

    state.elevationPacket = clonePlain(packet);
    state.elevationReceipt = clonePlain(receipt);
    state.elevationHydrologyPrepPacket = clonePlain(hydrologyPrep);
    state.elevationNodes = clonePlain(nodes);

    const evidence = {
      observed: state.elevationDependencyObserved,
      sourceName: state.elevationAuthoritySourceName,
      packetObserved: state.elevationPacketObserved,
      receiptObserved: state.elevationReceiptObserved,
      hydrologyPrepObserved: state.elevationHydrologyPrepObserved,
      nodeCount: state.elevationNodeCount,
      diagnostic256Ready: state.elevation256ScopeObserved,
      fallbackUsed: state.elevationFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      hydrologyPrepPacket: clonePlain(hydrologyPrep),
      nodes: clonePlain(nodes)
    };

    state.elevationEvidence = clonePlain(evidence);

    record("HYDROLOGY_FINGER_ELEVATION_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      hydrologyPrepObserved: evidence.hydrologyPrepObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function computeFlowTarget(index, elevations) {
    const h = elevations[index] || 0;
    const neighbors = neighborIndexes(index);

    let target = index;
    let lowest = h;

    for (const neighbor of neighbors) {
      const candidate = elevations[neighbor] || 0;
      if (candidate < lowest) {
        lowest = candidate;
        target = neighbor;
      }
    }

    return {
      toIndex: target,
      descent: round(Math.max(0, h - lowest)),
      hasDescent: target !== index
    };
  }

  function classifyHydrology(node, waterDepth, surfaceFlow, aquiferPressure, springPotential, waterfallPotential) {
    if (waterDepth >= 0.34 && node.basinScore >= 0.58) return "DEEP_BASIN_SEA";
    if (waterDepth >= 0.22) return "OCEAN_BODY";
    if (waterDepth >= 0.11 && node.shelfScore >= 0.34) return "SHELF_SEA";
    if (waterDepth >= 0.10 && node.basinScore >= 0.48) return "INLAND_LAKE";
    if (surfaceFlow >= 0.54 && waterDepth < 0.16) return "RIVER_CHANNEL";
    if (waterDepth >= 0.04 && node.shelfScore >= 0.32) return "WETLAND_MARGIN";
    if (springPotential >= 0.56) return "SPRING_POINT";
    if (aquiferPressure >= 0.52) return "SUBTERRANEAN_AQUIFER";
    if (waterfallPotential >= 0.60) return "WATERFALL_POTENTIAL";
    if (node.elevation >= 0.68) return "DRY_HIGH_RELIEF";
    return "DRY_UPLAND";
  }

  function hydrologyStory(node, waterClass) {
    if (waterClass === "DEEP_BASIN_SEA") {
      return "The basin receives the old depth first; water settles where relief already made room for it.";
    }

    if (waterClass === "OCEAN_BODY") {
      return "Open water occupies the lowered body without erasing the landform that shaped it.";
    }

    if (waterClass === "SHELF_SEA") {
      return "The shelf becomes a shallow edge where coastline can later gather sediment, light, and life.";
    }

    if (waterClass === "INLAND_LAKE") {
      return "An enclosed basin keeps water inside the raised body, storing a local history of descent.";
    }

    if (waterClass === "RIVER_CHANNEL") {
      return "Water moves here because the terrain tells it where to go.";
    }

    if (waterClass === "WETLAND_MARGIN") {
      return "The edge softens into wet ground, neither full sea nor dry plain.";
    }

    if (waterClass === "SPRING_POINT") {
      return "Pressure from below touches the surface, preparing a future source point.";
    }

    if (waterClass === "SUBTERRANEAN_AQUIFER") {
      return "Water hides below the visible terrain, carrying the under-body logic of Hearth.";
    }

    if (waterClass === "WATERFALL_POTENTIAL") {
      return "A sudden drop prepares visible descent, but the final fall remains downstream.";
    }

    return "This node remains dry enough for material and light to define the exposed body.";
  }

  function buildHydrologyModel(options = {}) {
    const elevation = readElevationEvidence(options);
    const nodes = elevation.nodes.length === NODE_COUNT ? elevation.nodes : buildFallbackElevationNodes();
    const seaLevel = clamp(options.seaLevel === undefined ? SEA_LEVEL : safeNumber(options.seaLevel, SEA_LEVEL), 0.05, 0.95);
    const elevations = nodes.map((node) => node.elevation);

    const hydrologyNodes = nodes.map((node, index) => {
      const flowTarget = computeFlowTarget(index, elevations);
      const neighborCount = neighborIndexes(index).length || 1;

      const belowSea = Math.max(0, seaLevel - node.elevation);
      const nearSea = 1 - clamp(Math.abs(node.elevation - seaLevel) / 0.22, 0, 1);
      const basinPull = clamp((node.basinScore * 0.52) + (node.hydrologyBasinEligibility * 0.36) + (belowSea * 0.62), 0, 1);
      const shelfPull = clamp((node.shelfScore * 0.46) + (nearSea * 0.32) + (node.shelfRelief ? 0.18 : 0), 0, 1);
      const flowPull = clamp((node.hydrologyDrainageEligibility * 0.48) + (flowTarget.descent * 2.3) + (node.slope * 0.20), 0, 1);

      const baseWaterDepth = clamp(
        (belowSea * 1.8) +
        (node.basinScore * 0.18) +
        (node.shelfScore * 0.10) -
        (node.upliftScore * 0.06),
        0,
        1
      );

      const oceanBasin = baseWaterDepth > 0.18 && basinPull > 0.48;
      const shelfWater = baseWaterDepth > 0.05 && shelfPull > 0.42 && node.elevation <= seaLevel + 0.11;
      const inlandLake = !oceanBasin && baseWaterDepth > 0.07 && node.basinScore > 0.58 && node.elevation < seaLevel + 0.06;
      const riverChannel = !oceanBasin && flowPull > 0.56 && flowTarget.hasDescent && node.elevation > seaLevel - 0.05;
      const wetland = !oceanBasin && !riverChannel && shelfPull > 0.44 && baseWaterDepth > 0.025 && node.elevation < seaLevel + 0.13;

      const aquiferPressure = clamp(
        (node.basinScore * 0.42) +
        ((1 - node.elevation) * 0.26) +
        (node.shelfScore * 0.18) +
        (node.landScore * 0.10) -
        (node.slope * 0.10),
        0,
        1
      );

      const springPotential = clamp(
        (aquiferPressure * 0.46) +
        (node.slope * 0.24) +
        (flowTarget.descent * 1.4) +
        (node.riftScore * 0.18) -
        (baseWaterDepth * 0.20),
        0,
        1
      );

      const waterfallPotential = clamp(
        (flowTarget.descent * 3.8) +
        (node.slope * 0.36) +
        (node.escarpment ? 0.24 : 0) -
        (baseWaterDepth * 0.18),
        0,
        1
      );

      const aboveSurfaceWater = oceanBasin || shelfWater || inlandLake || riverChannel || wetland;
      const subsurfaceWater = !aboveSurfaceWater && aquiferPressure >= 0.42;

      const waterDepth = round(
        oceanBasin
          ? clamp(baseWaterDepth + (node.basinScore * 0.14), 0, 1)
          : shelfWater
            ? clamp(baseWaterDepth * 0.62, 0, 0.28)
            : inlandLake
              ? clamp(baseWaterDepth * 0.52 + node.basinScore * 0.08, 0, 0.32)
              : wetland
                ? clamp(baseWaterDepth * 0.25 + shelfPull * 0.035, 0, 0.14)
                : riverChannel
                  ? clamp(flowPull * 0.08, 0.02, 0.12)
                  : 0
      );

      const waterPresence = clamp(
        (aboveSurfaceWater ? 0.72 : 0) +
        (waterDepth * 0.40) +
        (subsurfaceWater ? aquiferPressure * 0.24 : 0),
        0,
        1
      );

      const waterTableDepth = round(clamp(1 - aquiferPressure + node.elevation * 0.18, 0, 1));
      const erosionPotential = round(clamp((flowPull * 0.32) + (waterDepth * 0.24) + (node.slope * 0.26) + (waterfallPotential * 0.18), 0, 1));
      const sedimentDepositPotential = round(clamp((wetland ? 0.32 : 0) + (shelfWater ? 0.30 : 0) + (node.basinScore * 0.22) + ((1 - node.slope) * 0.16), 0, 1));
      const humidityContribution = round(clamp((waterPresence * 0.52) + (waterDepth * 0.30) + (wetland ? 0.12 : 0), 0, 1));
      const reflectanceContribution = round(clamp((waterDepth * 0.52) + (shelfWater ? 0.18 : 0) + (oceanBasin ? 0.12 : 0), 0, 1));

      const waterClass = classifyHydrology(
        node,
        waterDepth,
        flowPull,
        aquiferPressure,
        springPotential,
        waterfallPotential
      );

      return {
        index: node.index,
        id: node.id.replace("ELEVATION", "HYDROLOGY"),
        row: node.row,
        col: node.col,
        x: node.x,
        y: node.y,

        worldName: WORLD_NAME,
        sourceDistrict: node.sourceDistrict,
        sourceClass: node.sourceClass,
        reliefClass: node.reliefClass,

        elevation: node.elevation,
        slope: node.slope,
        basinScore: node.basinScore,
        shelfScore: node.shelfScore,
        riftScore: node.riftScore,
        landScore: node.landScore,

        seaLevel: round(seaLevel),
        belowSea: round(belowSea),
        basinPull: round(basinPull),
        shelfPull: round(shelfPull),
        flowPull: round(flowPull),

        waterClass,
        waterPresence: round(waterPresence),
        waterDepth,
        aboveSurfaceWater,
        subsurfaceWater,
        oceanBasin,
        shelfWater,
        inlandLake,
        riverChannel,
        wetland,

        aquiferPressure: round(aquiferPressure),
        springPotential: round(springPotential),
        waterfallPotential: round(waterfallPotential),
        waterTableDepth,

        flowTarget: {
          fromIndex: index,
          toIndex: flowTarget.toIndex,
          descent: flowTarget.descent,
          hasDescent: flowTarget.hasDescent,
          neighborCount
        },

        erosionPotential,
        sedimentDepositPotential,
        humidityContribution,
        reflectanceContribution,

        materialPrep: {
          sedimentDepositPotential,
          erosionPotential,
          shorelineMineralSorting: round(clamp((shelfWater ? 0.46 : 0) + (wetland ? 0.24 : 0) + (flowPull * 0.18), 0, 1)),
          exposedWetRockPotential: round(clamp((riverChannel ? 0.36 : 0) + (waterfallPotential * 0.38) + (node.slope * 0.16), 0, 1))
        },

        atmospherePrep: {
          humidityContribution,
          basinFogPotential: round(clamp((waterPresence * 0.30) + (node.basinScore * 0.32) + ((1 - node.elevation) * 0.16), 0, 1)),
          mistPotential: round(clamp((waterfallPotential * 0.44) + (riverChannel ? 0.18 : 0) + (wetland ? 0.16 : 0), 0, 1))
        },

        lightingPrep: {
          reflectanceContribution,
          waterShadowPotential: round(clamp((waterDepth * 0.42) + (node.slope * 0.16), 0, 1)),
          shorelineGlintPotential: round(clamp((shelfWater ? 0.42 : 0) + (waterDepth * 0.22), 0, 1))
        },

        story: hydrologyStory(node, waterClass),

        finalHydrologyTruthClaim: false,
        finalVisualClaim: false
      };
    });

    const oceanNodes = hydrologyNodes.filter((node) => node.oceanBasin || node.waterClass === "OCEAN_BODY");
    const deepBasinNodes = hydrologyNodes.filter((node) => node.waterClass === "DEEP_BASIN_SEA");
    const shelfWaterNodes = hydrologyNodes.filter((node) => node.shelfWater);
    const inlandLakeNodes = hydrologyNodes.filter((node) => node.inlandLake);
    const riverChannelNodes = hydrologyNodes.filter((node) => node.riverChannel);
    const wetlandNodes = hydrologyNodes.filter((node) => node.wetland);
    const aquiferNodes = hydrologyNodes.filter((node) => node.subsurfaceWater || node.aquiferPressure >= 0.52);
    const springNodes = hydrologyNodes.filter((node) => node.springPotential >= 0.56);
    const waterfallNodes = hydrologyNodes.filter((node) => node.waterfallPotential >= 0.60);
    const dryUplandNodes = hydrologyNodes.filter((node) => !node.aboveSurfaceWater && !node.subsurfaceWater);

    const waterPresenceMap = hydrologyNodes.map((node) => node.waterPresence);
    const waterDepthMap = hydrologyNodes.map((node) => node.waterDepth);
    const oceanBasinMap = hydrologyNodes.map((node) => node.oceanBasin ? 1 : 0);
    const shelfWaterMap = hydrologyNodes.map((node) => node.shelfWater ? 1 : 0);
    const riverChannelMap = hydrologyNodes.map((node) => node.riverChannel ? round(node.flowPull) : 0);
    const wetlandMap = hydrologyNodes.map((node) => node.wetland ? round(node.waterPresence) : 0);
    const aquiferMap = hydrologyNodes.map((node) => node.aquiferPressure);
    const springPotentialMap = hydrologyNodes.map((node) => node.springPotential);
    const waterfallPotentialMap = hydrologyNodes.map((node) => node.waterfallPotential);
    const flowDirectionMap = hydrologyNodes.map((node) => clonePlain(node.flowTarget));
    const sedimentDepositMap = hydrologyNodes.map((node) => node.sedimentDepositPotential);
    const humidityMap = hydrologyNodes.map((node) => node.humidityContribution);
    const reflectanceMap = hydrologyNodes.map((node) => node.reflectanceContribution);

    const model = {
      modelType: "HEARTH_HYDROLOGY_WATER_LEVEL_MODEL",
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

      sourceElevationContractExpected: ELEVATION_CONTRACT,
      sourceElevationFile: ELEVATION_FILE,
      elevationDependencyObserved: elevation.observed,
      elevationPacketObserved: elevation.packetObserved,
      elevationReceiptObserved: elevation.receiptObserved,
      elevationHydrologyPrepObserved: elevation.hydrologyPrepObserved,
      elevationNodeCount: elevation.nodeCount,
      elevation256ScopeObserved: elevation.diagnostic256Ready,
      elevationFallbackUsed: elevation.fallbackUsed,

      gridSize: GRID_SIZE,
      nodeCount: NODE_COUNT,
      seaLevel: round(seaLevel),

      hydrologyNodes,
      waterPresenceMap,
      waterDepthMap,
      oceanBasinMap,
      shelfWaterMap,
      riverChannelMap,
      wetlandMap,
      aquiferMap,
      springPotentialMap,
      waterfallPotentialMap,
      flowDirectionMap,
      sedimentDepositMap,
      humidityMap,
      reflectanceMap,

      oceanNodes: oceanNodes.map((node) => node.index),
      deepBasinNodes: deepBasinNodes.map((node) => node.index),
      shelfWaterNodes: shelfWaterNodes.map((node) => node.index),
      inlandLakeNodes: inlandLakeNodes.map((node) => node.index),
      riverChannelNodes: riverChannelNodes.map((node) => node.index),
      wetlandNodes: wetlandNodes.map((node) => node.index),
      aquiferNodes: aquiferNodes.map((node) => node.index),
      springPotentialNodes: springNodes.map((node) => node.index),
      waterfallPotentialNodes: waterfallNodes.map((node) => node.index),
      dryUplandNodes: dryUplandNodes.map((node) => node.index),

      oceanNodeCount: oceanNodes.length,
      deepBasinNodeCount: deepBasinNodes.length,
      shelfWaterNodeCount: shelfWaterNodes.length,
      inlandLakeNodeCount: inlandLakeNodes.length,
      riverChannelNodeCount: riverChannelNodes.length,
      wetlandNodeCount: wetlandNodes.length,
      aquiferNodeCount: aquiferNodes.length,
      springPotentialNodeCount: springNodes.length,
      waterfallPotentialNodeCount: waterfallNodes.length,
      dryUplandNodeCount: dryUplandNodes.length,

      hydrologyRules: {
        waterFollowsElevation: true,
        waterMayNotInventLand: true,
        basinFloorReceivesDepth: true,
        shelvesPrepareShallowSeasAndCoasts: true,
        riversFollowDescent: true,
        aquifersRemainSubsurfaceUnlessSpringPressureReachesSurface: true,
        waterfallsRequireSlopeDescentAndRelief: true
      },

      narrativeDisposition: {
        body: "Landform gave Hearth body.",
        relief: "Elevation raised the body and opened basins, shelves, slopes, and descent.",
        water: "Hydrology now decides where water can collect, hide, move, and prepare future expression without overriding the land."
      },

      finalHydrologyTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.hydrologyModel = clonePlain(model);
    state.hydrologyModelReady = true;
    state.diagnostic256Ready = hydrologyNodes.length === NODE_COUNT;

    state.waterPresenceMapReady = waterPresenceMap.length === NODE_COUNT;
    state.waterDepthMapReady = waterDepthMap.length === NODE_COUNT;
    state.oceanBasinMapReady = oceanBasinMap.length === NODE_COUNT;
    state.shelfWaterMapReady = shelfWaterMap.length === NODE_COUNT;
    state.riverChannelMapReady = riverChannelMap.length === NODE_COUNT;
    state.wetlandMapReady = wetlandMap.length === NODE_COUNT;
    state.aquiferMapReady = aquiferMap.length === NODE_COUNT;
    state.springPotentialMapReady = springPotentialMap.length === NODE_COUNT;
    state.waterfallPotentialMapReady = waterfallPotentialMap.length === NODE_COUNT;
    state.flowDirectionMapReady = flowDirectionMap.length === NODE_COUNT;

    state.hydrologyNodeCount = hydrologyNodes.length;
    state.oceanNodeCount = oceanNodes.length;
    state.deepBasinNodeCount = deepBasinNodes.length;
    state.shelfWaterNodeCount = shelfWaterNodes.length;
    state.inlandLakeNodeCount = inlandLakeNodes.length;
    state.riverChannelNodeCount = riverChannelNodes.length;
    state.wetlandNodeCount = wetlandNodes.length;
    state.aquiferNodeCount = aquiferNodes.length;
    state.springPotentialNodeCount = springNodes.length;
    state.waterfallPotentialNodeCount = waterfallNodes.length;
    state.dryUplandNodeCount = dryUplandNodes.length;

    record("HYDROLOGY_FINGER_MODEL_BUILT", {
      nodeCount: hydrologyNodes.length,
      oceanNodeCount: oceanNodes.length,
      shelfWaterNodeCount: shelfWaterNodes.length,
      riverChannelNodeCount: riverChannelNodes.length,
      aquiferNodeCount: aquiferNodes.length,
      elevationFallbackUsed: elevation.fallbackUsed
    });

    return model;
  }

  function buildMaterialHydrologyPrepPacket(model) {
    const source = model || state.hydrologyModel || buildHydrologyModel();

    const packet = {
      packetType: "HEARTH_HYDROLOGY_TO_MATERIAL_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: MATERIAL_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      waterDepthMap: clonePlain(source.waterDepthMap),
      waterPresenceMap: clonePlain(source.waterPresenceMap),
      sedimentDepositMap: clonePlain(source.sedimentDepositMap),
      riverChannelMap: clonePlain(source.riverChannelMap),
      wetlandMap: clonePlain(source.wetlandMap),
      aquiferMap: clonePlain(source.aquiferMap),
      shelfWaterNodes: clonePlain(source.shelfWaterNodes),
      riverChannelNodes: clonePlain(source.riverChannelNodes),
      wetlandNodes: clonePlain(source.wetlandNodes),

      materialRules: {
        sedimentFollowsWaterAndLowSlope: true,
        wetRockFollowsRiverAndWaterfallPotential: true,
        shorelineSortingFollowsShelfWater: true,
        dryMaterialRemainsAvailableWhereWaterPresenceIsLow: true,
        materialMayNotOverrideHydrology: true
      },

      readyForMaterial: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.materialHydrologyPrepPacket = clonePlain(packet);
    state.materialHydrologyPrepPacketReady = true;
    return packet;
  }

  function buildAtmosphereHydrologyPrepPacket(model) {
    const source = model || state.hydrologyModel || buildHydrologyModel();

    const packet = {
      packetType: "HEARTH_HYDROLOGY_TO_ATMOSPHERE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: ATMOSPHERE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      waterPresenceMap: clonePlain(source.waterPresenceMap),
      waterDepthMap: clonePlain(source.waterDepthMap),
      humidityMap: clonePlain(source.humidityMap),
      wetlandMap: clonePlain(source.wetlandMap),
      oceanNodes: clonePlain(source.oceanNodes),
      wetlandNodes: clonePlain(source.wetlandNodes),
      springPotentialNodes: clonePlain(source.springPotentialNodes),
      waterfallPotentialNodes: clonePlain(source.waterfallPotentialNodes),

      atmosphereRules: {
        humidityFollowsWaterPresence: true,
        basinFogMayFormWhereWaterAndLowReliefOverlap: true,
        mistMayFormFromSpringsRiversAndWaterfallPotential: true,
        atmosphereMayNotInventWater: true
      },

      readyForAtmosphere: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.atmosphereHydrologyPrepPacket = clonePlain(packet);
    state.atmosphereHydrologyPrepPacketReady = true;
    return packet;
  }

  function buildLightingHydrologyPrepPacket(model) {
    const source = model || state.hydrologyModel || buildHydrologyModel();

    const packet = {
      packetType: "HEARTH_HYDROLOGY_TO_LIGHTING_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: LIGHTING_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      waterPresenceMap: clonePlain(source.waterPresenceMap),
      waterDepthMap: clonePlain(source.waterDepthMap),
      reflectanceMap: clonePlain(source.reflectanceMap),
      shelfWaterMap: clonePlain(source.shelfWaterMap),
      riverChannelMap: clonePlain(source.riverChannelMap),
      waterfallPotentialMap: clonePlain(source.waterfallPotentialMap),

      lightingRules: {
        waterReflectanceFollowsDepthAndSurfaceExposure: true,
        shorelineGlintFollowsShelfWater: true,
        riverHighlightFollowsChannelMap: true,
        waterfallMistLightFollowsPotentialOnly: true,
        lightingMayNotClaimFinalVisualPass: true
      },

      readyForLighting: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingHydrologyPrepPacket = clonePlain(packet);
    state.lightingHydrologyPrepPacketReady = true;
    return packet;
  }

  function buildCompositeHydrologyPrepPacket(model) {
    const source = model || state.hydrologyModel || buildHydrologyModel();

    const packet = {
      packetType: "HEARTH_HYDROLOGY_TO_COMPOSITE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      hydrologyNodes: clonePlain(source.hydrologyNodes),
      waterPresenceMap: clonePlain(source.waterPresenceMap),
      waterDepthMap: clonePlain(source.waterDepthMap),
      oceanBasinMap: clonePlain(source.oceanBasinMap),
      shelfWaterMap: clonePlain(source.shelfWaterMap),
      riverChannelMap: clonePlain(source.riverChannelMap),
      wetlandMap: clonePlain(source.wetlandMap),
      aquiferMap: clonePlain(source.aquiferMap),
      springPotentialMap: clonePlain(source.springPotentialMap),
      waterfallPotentialMap: clonePlain(source.waterfallPotentialMap),
      flowDirectionMap: clonePlain(source.flowDirectionMap),
      humidityMap: clonePlain(source.humidityMap),
      reflectanceMap: clonePlain(source.reflectanceMap),

      compositeLayerContribution: {
        layer: "hydrology",
        disposition: PLANETARY_DISPOSITION,
        contributesWaterPresence: true,
        contributesWaterDepth: true,
        contributesOceanBasins: true,
        contributesShelves: true,
        contributesRivers: true,
        contributesWetlands: true,
        contributesAquifers: true,
        contributesSprings: true,
        contributesWaterfallPotential: true,
        contributesFlow: true
      },

      readyForComposite: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeHydrologyPrepPacket = clonePlain(packet);
    state.compositeHydrologyPrepPacketReady = true;
    return packet;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.hydrologyModel || buildHydrologyModel();

    const packet = {
      packetType: "HEARTH_HYDROLOGY_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "hydrology",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      elevationPacketConsumed: state.elevationPacketObserved || state.elevationDependencyObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,
      hydrologyModelReady: true,
      waterPresenceMapReady: true,
      waterDepthMapReady: true,
      riverChannelMapReady: true,
      aquiferMapReady: true,
      flowDirectionMapReady: true,

      inspectSummary: {
        oceanNodeCount: state.oceanNodeCount,
        deepBasinNodeCount: state.deepBasinNodeCount,
        shelfWaterNodeCount: state.shelfWaterNodeCount,
        inlandLakeNodeCount: state.inlandLakeNodeCount,
        riverChannelNodeCount: state.riverChannelNodeCount,
        wetlandNodeCount: state.wetlandNodeCount,
        aquiferNodeCount: state.aquiferNodeCount,
        springPotentialNodeCount: state.springPotentialNodeCount,
        waterfallPotentialNodeCount: state.waterfallPotentialNodeCount,
        dryUplandNodeCount: state.dryUplandNodeCount
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

  function buildHydrologyPacket(options = {}) {
    const model = buildHydrologyModel(options);

    const materialPrep = buildMaterialHydrologyPrepPacket(model);
    const atmospherePrep = buildAtmosphereHydrologyPrepPacket(model);
    const lightingPrep = buildLightingHydrologyPrepPacket(model);
    const compositePrep = buildCompositeHydrologyPrepPacket(model);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_HYDROLOGY_FINGER_PACKET",
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

      sourceElevationFile: ELEVATION_FILE,
      sourceElevationContractExpected: ELEVATION_CONTRACT,
      elevationDependencyExpected: true,
      elevationDependencyObserved: state.elevationDependencyObserved,
      elevationAuthoritySourceName: state.elevationAuthoritySourceName,
      elevationPacketObserved: state.elevationPacketObserved,
      elevationReceiptObserved: state.elevationReceiptObserved,
      elevationHydrologyPrepObserved: state.elevationHydrologyPrepObserved,
      elevationNodeCount: state.elevationNodeCount,
      elevation256ScopeObserved: state.elevation256ScopeObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,

      hydrologyFingerActive: true,
      waterLevelAuthorityActive: true,
      hydrologyModelReady: true,
      hydrologyPacketReady: true,
      diagnostic256Ready: true,

      waterPresenceMapReady: true,
      waterDepthMapReady: true,
      oceanBasinMapReady: true,
      shelfWaterMapReady: true,
      riverChannelMapReady: true,
      wetlandMapReady: true,
      aquiferMapReady: true,
      springPotentialMapReady: true,
      waterfallPotentialMapReady: true,
      flowDirectionMapReady: true,

      hydrologyModel: clonePlain(model),
      materialHydrologyPrepPacket: clonePlain(materialPrep),
      atmosphereHydrologyPrepPacket: clonePlain(atmospherePrep),
      lightingHydrologyPrepPacket: clonePlain(lightingPrep),
      compositeHydrologyPrepPacket: clonePlain(compositePrep),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_MATERIAL_FINGER_EXPANSION",
      postgameStatus: "HYDROLOGY_WATER_LEVEL_PACKET_READY_FOR_MATERIAL",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.hydrologyPacket = clonePlain(packet);
    state.hydrologyPacketReady = true;

    state.firstFailedCoordinate = "WAITING_MATERIAL_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "HYDROLOGY_WATER_LEVEL_PACKET_READY_FOR_MATERIAL";

    record("HYDROLOGY_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      oceanNodeCount: model.oceanNodeCount,
      riverChannelNodeCount: model.riverChannelNodeCount,
      aquiferNodeCount: model.aquiferNodeCount,
      nextFile: NEXT_FILE,
      hydrologyPacketReady: true
    });

    return packet;
  }

  function getHydrologyModel(options = {}) {
    if (!state.hydrologyModel || options.rebuild === true) {
      return buildHydrologyModel(options);
    }

    return clonePlain(state.hydrologyModel);
  }

  function getHydrologyPacket(options = {}) {
    if (!state.hydrologyPacket || options.rebuild === true) {
      return buildHydrologyPacket(options);
    }

    return clonePlain(state.hydrologyPacket);
  }

  function getWaterPresenceMap(options = {}) {
    const model = getHydrologyModel(options);
    return clonePlain(model.waterPresenceMap || []);
  }

  function getWaterDepthMap(options = {}) {
    const model = getHydrologyModel(options);
    return clonePlain(model.waterDepthMap || []);
  }

  function getRiverChannelMap(options = {}) {
    const model = getHydrologyModel(options);
    return clonePlain(model.riverChannelMap || []);
  }

  function getAquiferMap(options = {}) {
    const model = getHydrologyModel(options);
    return clonePlain(model.aquiferMap || []);
  }

  function getCompositeHydrologyPrepPacket(options = {}) {
    if (!state.compositeHydrologyPrepPacket || options.rebuild === true) {
      buildHydrologyPacket(options);
    }

    return clonePlain(state.compositeHydrologyPrepPacket);
  }

  function getMaterialHydrologyPrepPacket(options = {}) {
    if (!state.materialHydrologyPrepPacket || options.rebuild === true) {
      buildHydrologyPacket(options);
    }

    return clonePlain(state.materialHydrologyPrepPacket);
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
    const nodes = model && Array.isArray(model.hydrologyNodes) ? model.hydrologyNodes : [];
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

  function sampleHydrology(x, y, options = {}) {
    const model = getHydrologyModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_HYDROLOGY_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      waterClass: node ? node.waterClass : "UNKNOWN",
      waterPresence: node ? node.waterPresence : 0,
      waterDepth: node ? node.waterDepth : 0,
      aboveSurfaceWater: node ? node.aboveSurfaceWater : false,
      subsurfaceWater: node ? node.subsurfaceWater : false,
      finalHydrologyTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleHydrology(x, y, options);
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

    const model = getHydrologyModel(options);
    const nodes = model.hydrologyNodes || [];

    try {
      context.save();
      context.globalCompositeOperation = options.compositeOperation || "source-over";

      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;

      for (const node of nodes) {
        const waterPresence = clamp(node.waterPresence, 0, 1);
        const waterDepth = clamp(node.waterDepth, 0, 1);

        if (waterPresence <= 0 && node.aquiferPressure < 0.46) continue;

        const alpha = clamp(options.opacity === undefined ? 0.18 : options.opacity, 0, 0.50);
        let r = 18;
        let g = 92;
        let b = 150;

        if (node.waterClass === "DEEP_BASIN_SEA") {
          r = 5;
          g = 46;
          b = 110;
        } else if (node.waterClass === "OCEAN_BODY") {
          r = 12;
          g = 84;
          b = 155;
        } else if (node.waterClass === "SHELF_SEA") {
          r = 48;
          g = 152;
          b = 176;
        } else if (node.waterClass === "RIVER_CHANNEL") {
          r = 70;
          g = 172;
          b = 205;
        } else if (node.waterClass === "WETLAND_MARGIN") {
          r = 68;
          g = 128;
          b = 116;
        } else if (node.waterClass === "SUBTERRANEAN_AQUIFER") {
          r = 32;
          g = 92;
          b = 120;
        }

        context.globalAlpha = clamp(alpha + (waterDepth * 0.20), 0.04, 0.58);
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);

        if (node.riverChannel || node.springPotential >= 0.56) {
          context.globalAlpha = clamp(alpha + 0.18, 0, 0.62);
          context.strokeStyle = "rgba(150, 230, 255, 0.50)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.08);
          context.beginPath();
          context.moveTo(node.col * cellW + cellW * 0.5, node.row * cellH + cellH * 0.5);

          const targetNode = nodes[node.flowTarget.toIndex] || node;
          context.lineTo(targetNode.col * cellW + cellW * 0.5, targetNode.row * cellH + cellH * 0.5);
          context.stroke();
        }
      }

      context.restore();

      record("HYDROLOGY_FINGER_DRAW_TO_CANVAS_COMPLETE", {
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

      recordError("HYDROLOGY_FINGER_DRAW_TO_CANVAS_FAILED", error);

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
    const packet = getHydrologyPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("HYDROLOGY_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
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
          : "CANVAS_HUB_REJECTED_HYDROLOGY_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("HYDROLOGY_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("HYDROLOGY_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("HYDROLOGY_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
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
    const packet = getHydrologyPacket(options);
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
          : "SURFACE_POINTER_REJECTED_HYDROLOGY_PACKET";

        record("HYDROLOGY_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("HYDROLOGY_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
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

      elevationFile: ELEVATION_FILE,
      elevationContractExpected: ELEVATION_CONTRACT,
      elevationDependencyExpected: state.elevationDependencyExpected,
      elevationDependencyObserved: state.elevationDependencyObserved,
      elevationAuthoritySourceName: state.elevationAuthoritySourceName,
      elevationPacketObserved: state.elevationPacketObserved,
      elevationReceiptObserved: state.elevationReceiptObserved,
      elevationHydrologyPrepObserved: state.elevationHydrologyPrepObserved,
      elevationNodeCount: state.elevationNodeCount,
      elevation256ScopeObserved: state.elevation256ScopeObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,
      elevationReadError: state.elevationReadError,

      hydrologyFingerLoaded: state.hydrologyFingerLoaded,
      hydrologyFingerActive: state.hydrologyFingerActive,
      waterLevelAuthorityActive: state.waterLevelAuthorityActive,
      hydrologyModelReady: state.hydrologyModelReady,
      hydrologyPacketReady: state.hydrologyPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      waterPresenceMapReady: state.waterPresenceMapReady,
      waterDepthMapReady: state.waterDepthMapReady,
      oceanBasinMapReady: state.oceanBasinMapReady,
      shelfWaterMapReady: state.shelfWaterMapReady,
      riverChannelMapReady: state.riverChannelMapReady,
      wetlandMapReady: state.wetlandMapReady,
      aquiferMapReady: state.aquiferMapReady,
      springPotentialMapReady: state.springPotentialMapReady,
      waterfallPotentialMapReady: state.waterfallPotentialMapReady,
      flowDirectionMapReady: state.flowDirectionMapReady,

      materialHydrologyPrepPacketReady: state.materialHydrologyPrepPacketReady,
      atmosphereHydrologyPrepPacketReady: state.atmosphereHydrologyPrepPacketReady,
      lightingHydrologyPrepPacketReady: state.lightingHydrologyPrepPacketReady,
      compositeHydrologyPrepPacketReady: state.compositeHydrologyPrepPacketReady,
      inspectPrepPacketReady: state.inspectPrepPacketReady,

      hydrologyNodeCount: state.hydrologyNodeCount,
      oceanNodeCount: state.oceanNodeCount,
      deepBasinNodeCount: state.deepBasinNodeCount,
      shelfWaterNodeCount: state.shelfWaterNodeCount,
      inlandLakeNodeCount: state.inlandLakeNodeCount,
      riverChannelNodeCount: state.riverChannelNodeCount,
      wetlandNodeCount: state.wetlandNodeCount,
      aquiferNodeCount: state.aquiferNodeCount,
      springPotentialNodeCount: state.springPotentialNodeCount,
      waterfallPotentialNodeCount: state.waterfallPotentialNodeCount,
      dryUplandNodeCount: state.dryUplandNodeCount,

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
      sampleHydrologyAvailable: true,
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
      elevationEvidence: clonePlain(state.elevationEvidence),
      elevationPacket: clonePlain(state.elevationPacket),
      elevationReceipt: clonePlain(state.elevationReceipt),
      elevationHydrologyPrepPacket: clonePlain(state.elevationHydrologyPrepPacket),
      hydrologyModel: clonePlain(state.hydrologyModel),
      hydrologyPacket: clonePlain(state.hydrologyPacket),
      materialHydrologyPrepPacket: clonePlain(state.materialHydrologyPrepPacket),
      atmosphereHydrologyPrepPacket: clonePlain(state.atmosphereHydrologyPrepPacket),
      lightingHydrologyPrepPacket: clonePlain(state.lightingHydrologyPrepPacket),
      compositeHydrologyPrepPacket: clonePlain(state.compositeHydrologyPrepPacket),
      inspectPrepPacket: clonePlain(state.inspectPrepPacket),
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),
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
      "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_RECEIPT",
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
      "ELEVATION_CONSUMPTION",
      line("elevationFile", r.elevationFile),
      line("elevationContractExpected", r.elevationContractExpected),
      line("elevationDependencyExpected", r.elevationDependencyExpected),
      line("elevationDependencyObserved", r.elevationDependencyObserved),
      line("elevationAuthoritySourceName", r.elevationAuthoritySourceName),
      line("elevationPacketObserved", r.elevationPacketObserved),
      line("elevationReceiptObserved", r.elevationReceiptObserved),
      line("elevationHydrologyPrepObserved", r.elevationHydrologyPrepObserved),
      line("elevationNodeCount", r.elevationNodeCount),
      line("elevation256ScopeObserved", r.elevation256ScopeObserved),
      line("elevationFallbackUsed", r.elevationFallbackUsed),
      line("elevationReadError", r.elevationReadError),
      "",
      "HYDROLOGY_STATUS",
      line("hydrologyFingerLoaded", r.hydrologyFingerLoaded),
      line("hydrologyFingerActive", r.hydrologyFingerActive),
      line("waterLevelAuthorityActive", r.waterLevelAuthorityActive),
      line("hydrologyModelReady", r.hydrologyModelReady),
      line("hydrologyPacketReady", r.hydrologyPacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("waterPresenceMapReady", r.waterPresenceMapReady),
      line("waterDepthMapReady", r.waterDepthMapReady),
      line("oceanBasinMapReady", r.oceanBasinMapReady),
      line("shelfWaterMapReady", r.shelfWaterMapReady),
      line("riverChannelMapReady", r.riverChannelMapReady),
      line("wetlandMapReady", r.wetlandMapReady),
      line("aquiferMapReady", r.aquiferMapReady),
      line("springPotentialMapReady", r.springPotentialMapReady),
      line("waterfallPotentialMapReady", r.waterfallPotentialMapReady),
      line("flowDirectionMapReady", r.flowDirectionMapReady),
      "",
      "PREP_PACKETS",
      line("materialHydrologyPrepPacketReady", r.materialHydrologyPrepPacketReady),
      line("atmosphereHydrologyPrepPacketReady", r.atmosphereHydrologyPrepPacketReady),
      line("lightingHydrologyPrepPacketReady", r.lightingHydrologyPrepPacketReady),
      line("compositeHydrologyPrepPacketReady", r.compositeHydrologyPrepPacketReady),
      line("inspectPrepPacketReady", r.inspectPrepPacketReady),
      "",
      "COUNTS",
      line("hydrologyNodeCount", r.hydrologyNodeCount),
      line("oceanNodeCount", r.oceanNodeCount),
      line("deepBasinNodeCount", r.deepBasinNodeCount),
      line("shelfWaterNodeCount", r.shelfWaterNodeCount),
      line("inlandLakeNodeCount", r.inlandLakeNodeCount),
      line("riverChannelNodeCount", r.riverChannelNodeCount),
      line("wetlandNodeCount", r.wetlandNodeCount),
      line("aquiferNodeCount", r.aquiferNodeCount),
      line("springPotentialNodeCount", r.springPotentialNodeCount),
      line("waterfallPotentialNodeCount", r.waterfallPotentialNodeCount),
      line("dryUplandNodeCount", r.dryUplandNodeCount),
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
      line("finalHydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
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
    setDataset("hearthCanvasFingerHydrologyLoaded", "true");
    setDataset("hearthCanvasFingerHydrologyContract", CONTRACT);
    setDataset("hearthCanvasFingerHydrologyReceipt", RECEIPT);
    setDataset("hearthCanvasFingerHydrologyPacket", PACKET);
    setDataset("hearthCanvasFingerHydrologyFile", FILE);
    setDataset("hearthCanvasFingerHydrologyWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerHydrologyDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerHydrologyDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerHydrologyExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerHydrologyReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerHydrologyElevationDependencyExpected", String(state.elevationDependencyExpected));
    setDataset("hearthCanvasFingerHydrologyElevationDependencyObserved", String(state.elevationDependencyObserved));
    setDataset("hearthCanvasFingerHydrologyElevationSourceName", state.elevationAuthoritySourceName);
    setDataset("hearthCanvasFingerHydrologyElevationPacketObserved", String(state.elevationPacketObserved));
    setDataset("hearthCanvasFingerHydrologyElevationReceiptObserved", String(state.elevationReceiptObserved));
    setDataset("hearthCanvasFingerHydrologyElevationPrepObserved", String(state.elevationHydrologyPrepObserved));
    setDataset("hearthCanvasFingerHydrologyElevationNodeCount", String(state.elevationNodeCount));
    setDataset("hearthCanvasFingerHydrologyElevation256ScopeObserved", String(state.elevation256ScopeObserved));
    setDataset("hearthCanvasFingerHydrologyElevationFallbackUsed", String(state.elevationFallbackUsed));

    setDataset("hearthCanvasFingerHydrologyModelReady", String(state.hydrologyModelReady));
    setDataset("hearthCanvasFingerHydrologyPacketReady", String(state.hydrologyPacketReady));
    setDataset("hearthCanvasFingerHydrologyDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerHydrologyWaterPresenceMapReady", String(state.waterPresenceMapReady));
    setDataset("hearthCanvasFingerHydrologyWaterDepthMapReady", String(state.waterDepthMapReady));
    setDataset("hearthCanvasFingerHydrologyOceanBasinMapReady", String(state.oceanBasinMapReady));
    setDataset("hearthCanvasFingerHydrologyShelfWaterMapReady", String(state.shelfWaterMapReady));
    setDataset("hearthCanvasFingerHydrologyRiverChannelMapReady", String(state.riverChannelMapReady));
    setDataset("hearthCanvasFingerHydrologyWetlandMapReady", String(state.wetlandMapReady));
    setDataset("hearthCanvasFingerHydrologyAquiferMapReady", String(state.aquiferMapReady));
    setDataset("hearthCanvasFingerHydrologySpringPotentialMapReady", String(state.springPotentialMapReady));
    setDataset("hearthCanvasFingerHydrologyWaterfallPotentialMapReady", String(state.waterfallPotentialMapReady));
    setDataset("hearthCanvasFingerHydrologyFlowDirectionMapReady", String(state.flowDirectionMapReady));

    setDataset("hearthCanvasFingerHydrologyNodeCount", String(state.hydrologyNodeCount));
    setDataset("hearthCanvasFingerHydrologyOceanNodeCount", String(state.oceanNodeCount));
    setDataset("hearthCanvasFingerHydrologyDeepBasinNodeCount", String(state.deepBasinNodeCount));
    setDataset("hearthCanvasFingerHydrologyShelfWaterNodeCount", String(state.shelfWaterNodeCount));
    setDataset("hearthCanvasFingerHydrologyInlandLakeNodeCount", String(state.inlandLakeNodeCount));
    setDataset("hearthCanvasFingerHydrologyRiverChannelNodeCount", String(state.riverChannelNodeCount));
    setDataset("hearthCanvasFingerHydrologyWetlandNodeCount", String(state.wetlandNodeCount));
    setDataset("hearthCanvasFingerHydrologyAquiferNodeCount", String(state.aquiferNodeCount));
    setDataset("hearthCanvasFingerHydrologySpringPotentialNodeCount", String(state.springPotentialNodeCount));
    setDataset("hearthCanvasFingerHydrologyWaterfallPotentialNodeCount", String(state.waterfallPotentialNodeCount));
    setDataset("hearthCanvasFingerHydrologyDryUplandNodeCount", String(state.dryUplandNodeCount));

    setDataset("hearthCanvasFingerHydrologyMaterialPrepReady", String(state.materialHydrologyPrepPacketReady));
    setDataset("hearthCanvasFingerHydrologyAtmospherePrepReady", String(state.atmosphereHydrologyPrepPacketReady));
    setDataset("hearthCanvasFingerHydrologyLightingPrepReady", String(state.lightingHydrologyPrepPacketReady));
    setDataset("hearthCanvasFingerHydrologyCompositePrepReady", String(state.compositeHydrologyPrepPacketReady));
    setDataset("hearthCanvasFingerHydrologyInspectPrepReady", String(state.inspectPrepPacketReady));

    setDataset("hearthCanvasFingerHydrologySurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerHydrologySurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerHydrologySurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerHydrologySurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerHydrologySurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerHydrologySurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerHydrologyHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerHydrologyHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerHydrologyHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerHydrologyHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerHydrologyHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerHydrologyHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerHydrologyFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerHydrologyRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerHydrologyPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerHydrologyNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerHydrologyF13Claimed", "false");
    setDataset("hearthCanvasFingerHydrologyF21Claimed", "false");
    setDataset("hearthCanvasFingerHydrologyReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyFinalHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyAtmosphericTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerHydrologyGeneratedImage", "false");
    setDataset("hearthCanvasFingerHydrologyGraphicBox", "false");
    setDataset("hearthCanvasFingerHydrologyWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerHydrology = api;
    hearth.canvasHydrologyFinger = api;
    hearth.canvasFingerHydrologyReceipt = getReceiptLight();
    hearth.canvasFingerHydrologyPacket = getHydrologyPacket();

    lab.hearthCanvasFingerHydrology = api;
    lab.hearthCanvasHydrologyFinger = api;
    lab.hearthCanvasFingerHydrologyReceipt = getReceiptLight();
    lab.hearthCanvasFingerHydrologyPacket = getHydrologyPacket();

    root.HEARTH_CANVAS_FINGER_HYDROLOGY = api;
    root.HEARTH_CANVAS_HYDROLOGY_FINGER = api;
    root.HEARTH_CANVAS_FINGER_HYDROLOGY_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_HYDROLOGY_PACKET = getHydrologyPacket();
    root.HEARTH_CANVAS_HYDROLOGY_WATER_PRESENCE_MAP = getWaterPresenceMap();
    root.HEARTH_CANVAS_HYDROLOGY_WATER_DEPTH_MAP = getWaterDepthMap();
    root.HEARTH_CANVAS_HYDROLOGY_RIVER_CHANNEL_MAP = getRiverChannelMap();
    root.HEARTH_CANVAS_HYDROLOGY_AQUIFER_MAP = getAquiferMap();

    root.HEARTH_HYDROLOGY_TO_MATERIAL_PREP_PACKET = getMaterialHydrologyPrepPacket();
    root.HEARTH_HYDROLOGY_TO_COMPOSITE_PREP_PACKET = getCompositeHydrologyPrepPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readElevationEvidence(options);
    buildHydrologyPacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("HYDROLOGY_FINGER_BOOT_COMPLETE", {
      elevationDependencyObserved: state.elevationDependencyObserved,
      elevationPacketObserved: state.elevationPacketObserved,
      elevationHydrologyPrepObserved: state.elevationHydrologyPrepObserved,
      hydrologyNodeCount: state.hydrologyNodeCount,
      hydrologyPacketReady: state.hydrologyPacketReady,
      materialHydrologyPrepPacketReady: state.materialHydrologyPrepPacketReady,
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
    SURFACE_FILE,
    NEXT_FILE,
    MATERIAL_FILE,
    ATMOSPHERE_FILE,
    LIGHTING_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,
    ELEVATION_CONTRACT,
    ELEVATION_PACKET,

    GRID_SIZE,
    NODE_COUNT,
    SEA_LEVEL,
    FINGER_NAME,
    FINGER_ROLE,
    FINGER_ORDER,
    PLANETARY_DISPOSITION_INDEX,
    PLANETARY_DISPOSITION,
    FINGER_SEQUENCE,
    FINGER_FILES,

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

    readElevationEvidence,
    buildHydrologyModel,
    buildHydrologyPacket,
    getHydrologyModel,
    getHydrologyPacket,
    getWaterPresenceMap,
    getWaterDepthMap,
    getRiverChannelMap,
    getAquiferMap,

    buildMaterialHydrologyPrepPacket,
    buildAtmosphereHydrologyPrepPacket,
    buildLightingHydrologyPrepPacket,
    buildCompositeHydrologyPrepPacket,
    buildInspectPrepPacket,

    getMaterialHydrologyPrepPacket,
    getCompositeHydrologyPrepPacket,

    sample,
    sampleHydrology,
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

    supportsHydrologyFinger: true,
    supportsWaterLevelAuthority: true,
    supportsElevationPacketConsumption: true,
    supportsDiagnostic256HydrologyScope: true,
    supportsWaterPresenceMap: true,
    supportsWaterDepthMap: true,
    supportsOceanBasinMap: true,
    supportsShelfWaterMap: true,
    supportsRiverChannelMap: true,
    supportsWetlandMap: true,
    supportsAquiferMap: true,
    supportsSpringPotentialMap: true,
    supportsWaterfallPotentialMap: true,
    supportsFlowDirectionMap: true,
    supportsMaterialHydrologyPrep: true,
    supportsAtmosphereHydrologyPrep: true,
    supportsLightingHydrologyPrep: true,
    supportsCompositeHydrologyPrep: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoFinalClaims: true,

    ownsHydrologyFingerIdentity: true,
    ownsWaterLevelModel: true,
    ownsHydrologyExpressionPacket: true,
    ownsMaterialHydrologyPrep: true,
    ownsAtmosphereHydrologyPrep: true,
    ownsLightingHydrologyPrep: true,
    ownsCompositeHydrologyPrep: true,

    ownsLandformTruth: false,
    ownsElevationTruth: false,
    ownsFinalHydrologyTruth: false,
    ownsMaterialTruth: false,
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

    readElevationEvidence();
    buildHydrologyPacket();
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
    recordError("HYDROLOGY_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
