// assets/hearth/hearth.canvas.finger.elevation.js
// HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Elevation / Relief Pressure Authority.
// Purpose:
// - Establish Elevation as the second planetary-disposition expansion finger after Landform.
// - Consume the Landform 256-node global economy when available.
// - Convert Hearth's land-body economy into vertical relief: mountains, plateaus, basins, escarpments, shelves, ridges, troughs, and slope.
// - Publish elevation, relief, hydrology-prep, material-prep, lighting-prep, composite-prep, and inspect-prep packets.
// - Preserve the already-instilled finger architecture: this is expansion/development, not reintegration.
// - Preserve Surface as the pointer/socket lane when available, without making Elevation depend on Surface.
// - Register with Canvas Expression Hub when a lawful hub intake exists.
// - Never mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Landform, Surface, or any other finger file.
// - Never claim final terrain truth, hydrology truth, material truth, atmospheric truth, lighting truth, final visual pass, F13, F21, ready text, generated image, GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-elevation-relief-pressure-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const LANDFORM_CONTRACT = "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_AUTHORITY_TNT_v1";
  const LANDFORM_PACKET = "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_PACKET_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;

  const FINGER_NAME = "elevation";
  const FINGER_ROLE = "relief-pressure-authority";
  const FINGER_ORDER = 2;
  const PLANETARY_DISPOSITION_INDEX = 2;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_RAISED";

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
    elevation: FILE,
    hydrology: HYDROLOGY_FILE,
    material: MATERIAL_FILE,
    atmosphere: ATMOSPHERE_FILE,
    lighting: LIGHTING_FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

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
    "receiveElevationFingerPacket",
    "receiveElevationPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const LANDFORM_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerLandform",
    "HEARTH.canvasLandformFinger",
    "HEARTH.canvasFingerLandformAuthority",
    "HEARTH_CANVAS_FINGER_LANDFORM",
    "HEARTH_CANVAS_LANDFORM_FINGER",
    "HEARTH_CANVAS_FINGER_LANDFORM_AUTHORITY",
    "DEXTER_LAB.hearthCanvasFingerLandform",
    "DEXTER_LAB.hearthCanvasLandformFinger"
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
    "receiveElevationFingerPacket",
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "registerExpressionFinger",
    "receiveExpressionPacket"
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

    landformFile: LANDFORM_FILE,
    landformContractExpected: LANDFORM_CONTRACT,
    landformPacketExpected: LANDFORM_PACKET,
    landformDependencyExpected: true,
    landformDependencyObserved: false,
    landformAuthoritySourceName: "NONE",
    landformPacketObserved: false,
    landformReceiptObserved: false,
    landformNodeCount: 0,
    landform256ScopeObserved: false,
    landformFallbackUsed: false,
    landformReadError: "",

    surfacePointerExpected: true,
    surfacePointerObserved: false,
    surfacePointerSourceName: "NONE",
    surfacePointerRegistrationAttempted: false,
    surfacePointerRegistrationAccepted: false,
    surfacePointerRegistrationMethod: "NONE",
    surfacePointerRegistrationHeldReason: "NOT_ATTEMPTED",
    surfacePointerRegistrationError: "",

    elevationFingerLoaded: true,
    elevationFingerActive: true,
    reliefPressureAuthorityActive: true,
    elevationModelReady: false,
    elevationPacketReady: false,
    diagnostic256Ready: false,

    heightfieldMapReady: false,
    reliefPressureMapReady: false,
    mountainCorridorMapReady: false,
    plateauMapReady: false,
    basinFloorDepthMapReady: false,
    slopeMapReady: false,
    escarpmentMapReady: false,
    hydrologyReliefPrepPacketReady: false,
    materialReliefPrepPacketReady: false,
    atmosphereReliefPrepPacketReady: false,
    lightingReliefPrepPacketReady: false,
    compositeReliefPrepPacketReady: false,
    inspectPrepPacketReady: false,

    elevationNodeCount: 0,
    highReliefNodeCount: 0,
    plateauNodeCount: 0,
    basinFloorNodeCount: 0,
    escarpmentNodeCount: 0,
    drainagePrepNodeCount: 0,
    shelfReliefNodeCount: 0,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "ELEVATION_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "ELEVATION_FINGER_WAITING_BOOT",

    landformEvidence: null,
    landformPacket: null,
    landformReceipt: null,
    landformNodes: [],
    elevationModel: null,
    elevationPacket: null,
    hydrologyReliefPrepPacket: null,
    materialReliefPrepPacket: null,
    atmosphereReliefPrepPacket: null,
    lightingReliefPrepPacket: null,
    compositeReliefPrepPacket: null,
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
      event: safeString(event, "ELEVATION_FINGER_EVENT"),
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
      code: safeString(code, "ELEVATION_FINGER_ERROR"),
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
        recordError("ELEVATION_FINGER_AUTHORITY_READ_METHOD_FAILED", error, {
          method
        });
      }
    }

    return null;
  }

  function extractPacketFrom(value) {
    if (!isObject(value)) return null;

    const directKeys = [
      "landformPacket",
      "LAND_FORM_PACKET",
      "packet",
      "surfacePacket",
      "bodyPacket",
      "worldBodyPacket",
      "globalEconomyPacket",
      "diagnostic256Packet",
      "elevationPrepPacket",
      "compositePrepPacket"
    ];

    for (const key of directKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (
      Array.isArray(value.nodes) ||
      Array.isArray(value.landformNodes) ||
      Array.isArray(value.nodeMap) ||
      Array.isArray(value.map256) ||
      isObject(value.landformEconomy) ||
      isObject(value.diagnostic256)
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
      "landformReceipt",
      "currentReceipt",
      "state"
    ];

    for (const key of directKeys) {
      if (isObject(value[key])) return value[key];
    }

    if (value.contract || value.receipt || value.file || value.landformModelReady !== undefined) return value;

    return null;
  }

  function extractNodesFromPacket(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.nodes,
      packet.landformNodes,
      packet.nodeMap,
      packet.map256,
      packet.diagnostic256Nodes,
      packet.landformNodeMap,
      packet.landformEconomy && packet.landformEconomy.nodes,
      packet.landformEconomy && packet.landformEconomy.nodeMap,
      packet.diagnostic256 && packet.diagnostic256.nodes,
      packet.diagnostic256 && packet.diagnostic256.nodeMap,
      packet.bodyEconomy && packet.bodyEconomy.nodes,
      packet.bodyEconomy && packet.bodyEconomy.nodeMap,
      packet.compositePrepPacket && packet.compositePrepPacket.nodes,
      packet.elevationPrepPacket && packet.elevationPrepPacket.nodes
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

  function getFirstNumber(source, keys, fallback = 0) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return safeNumber(source[key], fallback);
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

  function getFirstString(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== "") {
        return safeString(source[key], fallback);
      }
    }

    return fallback;
  }

  function inferLandScore(raw, x, y, index) {
    const explicit = getFirstNumber(raw, [
      "landScore",
      "landformScore",
      "landEligibility",
      "aboveWaterEligibility",
      "bodyScore",
      "massScore",
      "continentScore",
      "surfaceScore"
    ], NaN);

    if (Number.isFinite(explicit)) return clamp(explicit, 0, 1);

    const classText = getFirstString(raw, [
      "class",
      "landformClass",
      "nodeClass",
      "bodyClass",
      "district",
      "zone"
    ], "").toLowerCase();

    if (classText.includes("continent") || classText.includes("highland") || classText.includes("land")) return 0.78;
    if (classText.includes("shelf") || classText.includes("coast")) return 0.56;
    if (classText.includes("basin") || classText.includes("low")) return 0.34;
    if (classText.includes("ocean") || classText.includes("void")) return 0.16;

    const westernMass = gaussian2(x, y, 0.34, 0.45, 0.23, 0.30, 0.68);
    const easternMass = gaussian2(x, y, 0.68, 0.46, 0.19, 0.34, 0.62);
    const southernMass = gaussian2(x, y, 0.52, 0.72, 0.32, 0.15, 0.36);
    const islandArc = gaussian2(x, y, 0.76, 0.27, 0.10, 0.25, 0.34);
    const centralBasin = gaussian2(x, y, 0.51, 0.53, 0.17, 0.20, -0.38);
    const noise = (hashNoise(index, 4, 11) - 0.5) * 0.11;

    return clamp(0.24 + westernMass + easternMass + southernMass + islandArc + centralBasin + noise, 0, 1);
  }

  function inferBasinScore(raw, x, y, landScore, index) {
    const explicit = getFirstNumber(raw, [
      "basinScore",
      "basinEligibility",
      "belowWaterEligibility",
      "depressionScore",
      "waterBasinCandidate",
      "oceanBasinCandidate"
    ], NaN);

    if (Number.isFinite(explicit)) return clamp(explicit, 0, 1);

    const classText = getFirstString(raw, [
      "class",
      "landformClass",
      "nodeClass",
      "district",
      "zone"
    ], "").toLowerCase();

    if (classText.includes("basin") || classText.includes("trough") || classText.includes("low")) return 0.78;
    if (classText.includes("shelf")) return 0.45;
    if (classText.includes("ridge") || classText.includes("mountain")) return 0.12;

    const central = gaussian2(x, y, 0.50, 0.54, 0.18, 0.24, 0.78);
    const westernSea = gaussian2(x, y, 0.20, 0.64, 0.13, 0.21, 0.46);
    const northernTrough = gaussian2(x, y, 0.50, 0.17, 0.30, 0.08, 0.28);
    const edgeLow = smooth01(0.70, 0.98, Math.abs(x - 0.5) + Math.abs(y - 0.5));
    const noise = (hashNoise(index, 8, 17) - 0.5) * 0.10;

    return clamp(central + westernSea + northernTrough + (edgeLow * 0.18) + ((1 - landScore) * 0.18) + noise, 0, 1);
  }

  function inferUpliftScore(raw, x, y, landScore, basinScore, index) {
    const explicit = getFirstNumber(raw, [
      "upliftScore",
      "mountainEligibility",
      "ridgeEligibility",
      "tectonicPressure",
      "reliefPressure",
      "highlandEligibility"
    ], NaN);

    if (Number.isFinite(explicit)) return clamp(explicit, 0, 1);

    const westernRidge = gaussian2(x, y, 0.28, 0.38, 0.08, 0.34, 0.80);
    const easternRidge = gaussian2(x, y, 0.72, 0.46, 0.07, 0.33, 0.74);
    const northernShield = gaussian2(x, y, 0.49, 0.22, 0.25, 0.10, 0.46);
    const southernRise = gaussian2(x, y, 0.58, 0.77, 0.20, 0.08, 0.30);
    const riftShoulder = gaussian2(x, y, 0.54, 0.52, 0.06, 0.30, 0.26);
    const noise = (hashNoise(index, 13, 23) - 0.5) * 0.13;

    return clamp(((westernRidge + easternRidge + northernShield + southernRise + riftShoulder) * landScore) - (basinScore * 0.22) + noise, 0, 1);
  }

  function inferShelfScore(raw, x, y, landScore, basinScore, index) {
    const explicit = getFirstNumber(raw, [
      "shelfScore",
      "coastalShelfScore",
      "shelfEligibility",
      "coastEligibility",
      "shoreEligibility"
    ], NaN);

    if (Number.isFinite(explicit)) return clamp(explicit, 0, 1);

    const middleLand = smooth01(0.34, 0.70, landScore) * (1 - smooth01(0.74, 0.98, landScore));
    const basinEdge = smooth01(0.24, 0.62, basinScore) * (1 - smooth01(0.68, 0.95, basinScore));
    const edgeArc = gaussian2(x, y, 0.22, 0.56, 0.11, 0.28, 0.36) + gaussian2(x, y, 0.79, 0.48, 0.11, 0.28, 0.34);
    const noise = (hashNoise(index, 21, 29) - 0.5) * 0.08;

    return clamp((middleLand * 0.48) + (basinEdge * 0.38) + edgeArc + noise, 0, 1);
  }

  function inferRiftScore(raw, x, y, index) {
    const explicit = getFirstNumber(raw, [
      "riftScore",
      "fractureScore",
      "faultScore",
      "riftEligibility",
      "fractureEligibility"
    ], NaN);

    if (Number.isFinite(explicit)) return clamp(explicit, 0, 1);

    const diagonal = Math.abs((x * 0.78 + 0.12) - y);
    const centralRift = smooth01(0.16, 0.00, diagonal) * gaussian2(x, y, 0.54, 0.54, 0.22, 0.30, 0.68);
    const easternFault = gaussian2(x, y, 0.68, 0.49, 0.045, 0.38, 0.52);
    const noise = (hashNoise(index, 34, 41) - 0.5) * 0.10;

    return clamp(centralRift + easternFault + noise, 0, 1);
  }

  function inferDistrict(x, y, landScore, basinScore, upliftScore, shelfScore, riftScore) {
    if (upliftScore > 0.68 && x < 0.45) return "WESTERN_CROWN_UPLIFT";
    if (upliftScore > 0.66 && x >= 0.56) return "EASTERN_RIFT_SHOULDER";
    if (basinScore > 0.66 && y > 0.38 && y < 0.72) return "CENTRAL_MEMORY_BASIN";
    if (y < 0.28 && landScore > 0.44) return "NORTHERN_SHIELD";
    if (y > 0.70 && shelfScore > 0.38) return "SOUTHERN_SHELF_RISE";
    if (riftScore > 0.55) return "FRACTURE_CORRIDOR";
    if (shelfScore > 0.48) return "COASTAL_SHELF_TRANSITION";
    if (landScore > 0.62) return "INTERIOR_BODY_FIELD";
    return "LOW_RELIEF_OUTER_FIELD";
  }

  function normalizeLandformNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    const x = clamp(getFirstNumber(raw, ["x", "u", "nx", "lonNormalized"], (col + 0.5) / GRID_SIZE), 0, 1);
    const y = clamp(getFirstNumber(raw, ["y", "v", "ny", "latNormalized"], (row + 0.5) / GRID_SIZE), 0, 1);

    const landScore = inferLandScore(raw, x, y, index);
    const basinScore = inferBasinScore(raw, x, y, landScore, index);
    const upliftScore = inferUpliftScore(raw, x, y, landScore, basinScore, index);
    const shelfScore = inferShelfScore(raw, x, y, landScore, basinScore, index);
    const riftScore = inferRiftScore(raw, x, y, index);

    const aboveWaterEligibility = clamp(getFirstNumber(raw, [
      "aboveWaterEligibility",
      "aboveWaterScore",
      "landEligibility",
      "landScore"
    ], landScore), 0, 1);

    const belowWaterEligibility = clamp(getFirstNumber(raw, [
      "belowWaterEligibility",
      "waterEligibility",
      "basinEligibility",
      "basinScore"
    ], basinScore), 0, 1);

    const district = getFirstString(raw, ["district", "zone", "region"], "") || inferDistrict(
      x,
      y,
      landScore,
      basinScore,
      upliftScore,
      shelfScore,
      riftScore
    );

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_LANDFORM_NODE_${String(index + 1).padStart(3, "0")}`),
      row,
      col,
      x: round(x),
      y: round(y),

      sourceClass: getFirstString(raw, ["class", "landformClass", "nodeClass", "bodyClass"], "UNSPECIFIED"),
      district,

      landScore: round(landScore),
      basinScore: round(basinScore),
      upliftScore: round(upliftScore),
      shelfScore: round(shelfScore),
      riftScore: round(riftScore),
      aboveWaterEligibility: round(aboveWaterEligibility),
      belowWaterEligibility: round(belowWaterEligibility),

      landformSourceObserved: isObject(raw),
      raw: isObject(raw) ? clonePlain(raw) : null
    };
  }

  function buildFallbackLandformNodes() {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      nodes.push(normalizeLandformNode(null, index));
    }

    return nodes;
  }

  function readLandformEvidence(options = {}) {
    const found = findSource(LANDFORM_SOURCE_NAMES);

    state.landformDependencyObserved = Boolean(found.source);
    state.landformAuthoritySourceName = found.sourceName;
    state.landformReadError = "";

    let packet = null;
    let receipt = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getLandformPacket",
          "getGlobalEconomyPacket",
          "getDiagnostic256Packet",
          "getWorldBodyPacket",
          "getBodyPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate);

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.landformReadError = error && error.message ? String(error.message) : String(error);
        recordError("ELEVATION_FINGER_LANDFORM_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.landformPacket && isObject(options.landformPacket)) {
      packet = options.landformPacket;
      state.landformDependencyObserved = true;
      state.landformAuthoritySourceName = "OPTIONS_LANDFORM_PACKET";
    }

    const rawNodes = extractNodesFromPacket(packet);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeLandformNode(entry, index));
    }

    while (nodes.length < NODE_COUNT) {
      nodes.push(normalizeLandformNode(null, nodes.length));
    }

    state.landformPacketObserved = Boolean(packet);
    state.landformReceiptObserved = Boolean(receipt);
    state.landformNodeCount = nodes.length;
    state.landform256ScopeObserved = nodes.length === NODE_COUNT;
    state.landformFallbackUsed = !packet || rawNodes.length === 0;

    state.landformPacket = clonePlain(packet);
    state.landformReceipt = clonePlain(receipt);
    state.landformNodes = clonePlain(nodes);

    const evidence = {
      observed: state.landformDependencyObserved,
      sourceName: state.landformAuthoritySourceName,
      packetObserved: state.landformPacketObserved,
      receiptObserved: state.landformReceiptObserved,
      nodeCount: state.landformNodeCount,
      diagnostic256Ready: state.landform256ScopeObserved,
      fallbackUsed: state.landformFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      nodes: clonePlain(nodes)
    };

    state.landformEvidence = clonePlain(evidence);
    record("ELEVATION_FINGER_LANDFORM_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function initialHeightForNode(node) {
    const x = node.x;
    const y = node.y;

    const crown = gaussian2(x, y, 0.29, 0.36, 0.09, 0.34, 0.62);
    const eastShoulder = gaussian2(x, y, 0.72, 0.46, 0.075, 0.35, 0.58);
    const northernShield = gaussian2(x, y, 0.49, 0.23, 0.27, 0.095, 0.34);
    const southernRise = gaussian2(x, y, 0.58, 0.76, 0.24, 0.075, 0.28);
    const centralBasin = gaussian2(x, y, 0.50, 0.54, 0.20, 0.24, -0.48);
    const westernShelfLow = gaussian2(x, y, 0.18, 0.62, 0.12, 0.26, -0.18);
    const riftCut = node.riftScore * -0.13;
    const shelfDrawdown = node.shelfScore * -0.08;
    const basinDrawdown = node.basinScore * -0.28;
    const landLift = node.landScore * 0.34;
    const upliftLift = node.upliftScore * 0.44;
    const deterministicNoise = (hashNoise(node.index, 55, 89) - 0.5) * 0.08;

    return clamp(
      0.28 +
      landLift +
      upliftLift +
      crown +
      eastShoulder +
      northernShield +
      southernRise +
      centralBasin +
      westernShelfLow +
      riftCut +
      shelfDrawdown +
      basinDrawdown +
      deterministicNoise,
      0,
      1
    );
  }

  function classifyElevation(height, slope, node) {
    if (height >= 0.82) return "ALPINE_CROWN";
    if (height >= 0.72) return "HIGH_MOUNTAIN";
    if (height >= 0.62 && slope >= 0.22) return "ESCARPMENT_RISE";
    if (height >= 0.58) return "PLATEAU_FIELD";
    if (height >= 0.48) return "UPLAND_BODY";
    if (height >= 0.38) return "LOWLAND_BODY";
    if (height >= 0.30 && node.shelfScore > 0.36) return "SHELF_RELIEF";
    if (height >= 0.24) return "BASIN_SHOULDER";
    return "BASIN_FLOOR";
  }

  function elevationStory(node, height, slope, reliefClass) {
    if (reliefClass === "ALPINE_CROWN" || reliefClass === "HIGH_MOUNTAIN") {
      if (node.x < 0.45) return "The western crown rises first, giving Hearth a hard shoulder against collapse.";
      if (node.x > 0.58) return "The eastern rift shoulder climbs, leaving a fracture line for future water and shadow.";
      return "The shield lifts into high relief, holding the old pressure of the body.";
    }

    if (reliefClass === "PLATEAU_FIELD") {
      return "The land holds steady as a broad plateau, stable enough for later material and climate memory.";
    }

    if (reliefClass === "ESCARPMENT_RISE") {
      return "The surface breaks sharply here, preparing cliffs, drainage descent, and visible edge-reading.";
    }

    if (reliefClass === "LOWLAND_BODY") {
      return "The body lowers into habitable plain logic without surrendering to basin floor.";
    }

    if (reliefClass === "SHELF_RELIEF") {
      return "The shelf records a future waterline without letting water define the land.";
    }

    if (reliefClass === "BASIN_FLOOR") {
      return "The basin settles as stored memory, prepared for hydrology but not owned by it.";
    }

    return "The node carries transitional relief, binding landform into the next expression layer.";
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

  function computeSlope(index, heights) {
    const h = heights[index] || 0;
    const neighbors = neighborIndexes(index);

    if (!neighbors.length) return 0;

    let maxDelta = 0;
    let sumDelta = 0;

    for (const neighbor of neighbors) {
      const delta = Math.abs(h - (heights[neighbor] || 0));
      maxDelta = Math.max(maxDelta, delta);
      sumDelta += delta;
    }

    return clamp((maxDelta * 0.72) + ((sumDelta / neighbors.length) * 0.28), 0, 1);
  }

  function computeDrainageVector(index, heights, nodes) {
    const node = nodes[index];
    const h = heights[index] || 0;
    const neighbors = neighborIndexes(index);

    let lowestIndex = index;
    let lowest = h;

    for (const neighbor of neighbors) {
      if ((heights[neighbor] || 0) < lowest) {
        lowest = heights[neighbor] || 0;
        lowestIndex = neighbor;
      }
    }

    const target = nodes[lowestIndex] || node;

    return {
      fromIndex: index,
      toIndex: lowestIndex,
      dx: round(target.x - node.x),
      dy: round(target.y - node.y),
      descent: round(Math.max(0, h - lowest)),
      hasDescent: lowestIndex !== index
    };
  }

  function buildElevationModel(options = {}) {
    const landform = readLandformEvidence(options);
    const nodes = landform.nodes.length === NODE_COUNT ? landform.nodes : buildFallbackLandformNodes();

    const rawHeights = nodes.map(initialHeightForNode);

    const heights = rawHeights.map((height, index) => {
      const neighbors = neighborIndexes(index);
      if (!neighbors.length) return height;

      const neighborAverage = neighbors.reduce((sum, neighbor) => sum + rawHeights[neighbor], 0) / neighbors.length;
      const node = nodes[index];

      const preserveSharpness = clamp((node.upliftScore * 0.42) + (node.riftScore * 0.34), 0.12, 0.76);
      const smoothed = (height * (0.58 + preserveSharpness * 0.26)) + (neighborAverage * (0.42 - preserveSharpness * 0.26));

      return clamp(smoothed, 0, 1);
    });

    const elevationNodes = nodes.map((node, index) => {
      const height = heights[index];
      const slope = computeSlope(index, heights);
      const drainage = computeDrainageVector(index, heights, nodes);
      const reliefClass = classifyElevation(height, slope, node);

      const mountainCorridor = height >= 0.68 || (node.upliftScore >= 0.64 && slope >= 0.16);
      const plateau = height >= 0.55 && height < 0.74 && slope < 0.18 && node.landScore >= 0.45;
      const basinFloor = height < 0.31 && node.basinScore >= 0.42;
      const escarpment = slope >= 0.23 || (node.riftScore >= 0.62 && slope >= 0.14);
      const drainagePrep = drainage.hasDescent && drainage.descent >= 0.045 && node.landScore >= 0.28;
      const shelfRelief = node.shelfScore >= 0.42 && height >= 0.26 && height <= 0.49;

      const waterlinePreparation = clamp(
        (node.basinScore * 0.42) +
        (node.shelfScore * 0.38) +
        ((height < 0.42 ? 1 - height : 0) * 0.20),
        0,
        1
      );

      const materialExposure = clamp(
        (height * 0.38) +
        (slope * 0.30) +
        (node.upliftScore * 0.22) +
        (node.riftScore * 0.10),
        0,
        1
      );

      return {
        index: node.index,
        id: node.id,
        row: node.row,
        col: node.col,
        x: node.x,
        y: node.y,

        worldName: WORLD_NAME,
        sourceDistrict: node.district,
        sourceClass: node.sourceClass,

        landScore: node.landScore,
        basinScore: node.basinScore,
        upliftScore: node.upliftScore,
        shelfScore: node.shelfScore,
        riftScore: node.riftScore,
        aboveWaterEligibility: node.aboveWaterEligibility,
        belowWaterEligibility: node.belowWaterEligibility,

        elevation: round(height),
        normalizedHeight: round(height),
        relativeRelief: round((height - 0.5) * 2),
        slope: round(slope),
        reliefClass,

        mountainCorridor,
        plateau,
        basinFloor,
        escarpment,
        drainagePrep,
        shelfRelief,

        waterlinePreparation: round(waterlinePreparation),
        materialExposure: round(materialExposure),
        hydrologyBasinEligibility: round(clamp((node.basinScore * 0.58) + ((1 - height) * 0.42), 0, 1)),
        hydrologyDrainageEligibility: round(clamp((drainage.descent * 2.4) + (node.basinScore * 0.20), 0, 1)),
        materialRockEligibility: round(clamp((height * 0.40) + (slope * 0.38) + (node.upliftScore * 0.22), 0, 1)),
        materialSedimentEligibility: round(clamp((node.shelfScore * 0.36) + (node.basinScore * 0.34) + ((1 - slope) * 0.18) + ((1 - height) * 0.12), 0, 1)),
        lightingShadowEligibility: round(clamp((slope * 0.52) + (height * 0.22) + (node.riftScore * 0.26), 0, 1)),

        drainageVector: drainage,
        story: elevationStory(node, height, slope, reliefClass),

        finalTerrainTruthClaim: false,
        finalElevationTruthClaim: false,
        finalVisualClaim: false
      };
    });

    const highReliefNodes = elevationNodes.filter((node) => node.mountainCorridor);
    const plateauNodes = elevationNodes.filter((node) => node.plateau);
    const basinFloorNodes = elevationNodes.filter((node) => node.basinFloor);
    const escarpmentNodes = elevationNodes.filter((node) => node.escarpment);
    const drainagePrepNodes = elevationNodes.filter((node) => node.drainagePrep);
    const shelfReliefNodes = elevationNodes.filter((node) => node.shelfRelief);

    const heightfieldMap = elevationNodes.map((node) => round(node.elevation));
    const reliefPressureMap = elevationNodes.map((node) => round(clamp((node.upliftScore * 0.44) + (node.slope * 0.32) + (node.riftScore * 0.24), 0, 1)));
    const slopeMap = elevationNodes.map((node) => round(node.slope));
    const basinFloorDepthMap = elevationNodes.map((node) => round(node.basinFloor ? clamp((1 - node.elevation) * node.basinScore, 0, 1) : 0));
    const escarpmentMap = elevationNodes.map((node) => round(node.escarpment ? clamp(node.slope + (node.riftScore * 0.18), 0, 1) : 0));
    const waterlineReliefMap = elevationNodes.map((node) => node.waterlinePreparation);
    const materialExposureMap = elevationNodes.map((node) => node.materialExposure);

    const model = {
      modelType: "HEARTH_ELEVATION_RELIEF_PRESSURE_MODEL",
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

      sourceLandformContractExpected: LANDFORM_CONTRACT,
      sourceLandformFile: LANDFORM_FILE,
      landformDependencyObserved: landform.observed,
      landformPacketObserved: landform.packetObserved,
      landformReceiptObserved: landform.receiptObserved,
      landformNodeCount: landform.nodeCount,
      landform256ScopeObserved: landform.diagnostic256Ready,
      landformFallbackUsed: landform.fallbackUsed,

      gridSize: GRID_SIZE,
      nodeCount: NODE_COUNT,
      elevationNodeCount: elevationNodes.length,

      elevationNodes,
      heightfieldMap,
      reliefPressureMap,
      slopeMap,
      basinFloorDepthMap,
      escarpmentMap,
      waterlineReliefMap,
      materialExposureMap,

      mountainCorridorNodes: highReliefNodes.map((node) => node.index),
      plateauNodes: plateauNodes.map((node) => node.index),
      basinFloorNodes: basinFloorNodes.map((node) => node.index),
      escarpmentNodes: escarpmentNodes.map((node) => node.index),
      drainagePrepNodes: drainagePrepNodes.map((node) => node.index),
      shelfReliefNodes: shelfReliefNodes.map((node) => node.index),

      highReliefNodeCount: highReliefNodes.length,
      plateauNodeCount: plateauNodes.length,
      basinFloorNodeCount: basinFloorNodes.length,
      escarpmentNodeCount: escarpmentNodes.length,
      drainagePrepNodeCount: drainagePrepNodes.length,
      shelfReliefNodeCount: shelfReliefNodes.length,

      narrativeDisposition: {
        body: "Landform established Hearth as a 256-node body economy.",
        relief: "Elevation raises that body into pressure, height, basin depth, slope, and drainage preparation.",
        next: "Hydrology may now fill eligible basins and corridors without inventing the land."
      },

      finalTerrainTruthClaim: false,
      finalElevationTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.elevationModel = clonePlain(model);
    state.elevationModelReady = true;
    state.diagnostic256Ready = elevationNodes.length === NODE_COUNT;
    state.heightfieldMapReady = heightfieldMap.length === NODE_COUNT;
    state.reliefPressureMapReady = reliefPressureMap.length === NODE_COUNT;
    state.mountainCorridorMapReady = highReliefNodes.length > 0;
    state.plateauMapReady = plateauNodes.length > 0;
    state.basinFloorDepthMapReady = basinFloorDepthMap.length === NODE_COUNT;
    state.slopeMapReady = slopeMap.length === NODE_COUNT;
    state.escarpmentMapReady = escarpmentMap.length === NODE_COUNT;

    state.elevationNodeCount = elevationNodes.length;
    state.highReliefNodeCount = highReliefNodes.length;
    state.plateauNodeCount = plateauNodes.length;
    state.basinFloorNodeCount = basinFloorNodes.length;
    state.escarmentNodeCount = escarpmentNodes.length;
    state.escarpmentNodeCount = escarpmentNodes.length;
    state.drainagePrepNodeCount = drainagePrepNodes.length;
    state.shelfReliefNodeCount = shelfReliefNodes.length;

    record("ELEVATION_FINGER_MODEL_BUILT", {
      nodeCount: elevationNodes.length,
      highReliefNodeCount: highReliefNodes.length,
      plateauNodeCount: plateauNodes.length,
      basinFloorNodeCount: basinFloorNodes.length,
      escarpmentNodeCount: escarpmentNodes.length,
      drainagePrepNodeCount: drainagePrepNodes.length,
      landformFallbackUsed: landform.fallbackUsed
    });

    return model;
  }

  function buildHydrologyReliefPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_HYDROLOGY_RELIEF_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: HYDROLOGY_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      seaLevelCandidate: 0.42,
      basinFloorDepthMap: clonePlain(source.basinFloorDepthMap),
      slopeMap: clonePlain(source.slopeMap),
      drainagePrepNodes: clonePlain(source.drainagePrepNodes),
      shelfReliefNodes: clonePlain(source.shelfReliefNodes),
      waterlineReliefMap: clonePlain(source.waterlineReliefMap),

      hydrologyRules: {
        waterFillsEligibleRelief: true,
        hydrologyMayNotInventLand: true,
        basinFloorRequiredForDeepWater: true,
        drainageFollowsDescent: true,
        shelvesPrepareShorelineButDoNotBecomeWaterByThemselves: true
      },

      readyForHydrology: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.hydrologyReliefPrepPacket = clonePlain(packet);
    state.hydrologyReliefPrepPacketReady = true;
    return packet;
  }

  function buildMaterialReliefPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_MATERIAL_RELIEF_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: MATERIAL_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      heightfieldMap: clonePlain(source.heightfieldMap),
      slopeMap: clonePlain(source.slopeMap),
      materialExposureMap: clonePlain(source.materialExposureMap),
      escarpmentMap: clonePlain(source.escarpmentMap),
      mountainCorridorNodes: clonePlain(source.mountainCorridorNodes),
      plateauNodes: clonePlain(source.plateauNodes),
      basinFloorNodes: clonePlain(source.basinFloorNodes),
      shelfReliefNodes: clonePlain(source.shelfReliefNodes),

      materialRules: {
        rockExposureFollowsHeightSlopeAndUplift: true,
        sedimentFollowsBasinShelfAndLowSlope: true,
        plateauMaterialMayStabilize: true,
        cliffMaterialMustReadFromEscarpment: true,
        materialMayNotOverrideElevation: true
      },

      readyForMaterial: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.materialReliefPrepPacket = clonePlain(packet);
    state.materialReliefPrepPacketReady = true;
    return packet;
  }

  function buildAtmosphereReliefPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_ATMOSPHERE_RELIEF_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: ATMOSPHERE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      heightfieldMap: clonePlain(source.heightfieldMap),
      highReliefNodes: clonePlain(source.mountainCorridorNodes),
      basinFloorNodes: clonePlain(source.basinFloorNodes),
      slopeMap: clonePlain(source.slopeMap),

      atmosphereRules: {
        hazeMayCollectInBasins: true,
        cloudEligibilityMayRespectRelief: true,
        horizonDepthMayReadHighRelief: true,
        atmosphereMayNotDefineLandform: true
      },

      readyForAtmosphere: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.atmosphereReliefPrepPacket = clonePlain(packet);
    state.atmosphereReliefPrepPacketReady = true;
    return packet;
  }

  function buildLightingReliefPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_LIGHTING_RELIEF_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: LIGHTING_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      heightfieldMap: clonePlain(source.heightfieldMap),
      reliefPressureMap: clonePlain(source.reliefPressureMap),
      slopeMap: clonePlain(source.slopeMap),
      escarpmentMap: clonePlain(source.escarpmentMap),
      mountainCorridorNodes: clonePlain(source.mountainCorridorNodes),
      basinFloorNodes: clonePlain(source.basinFloorNodes),

      lightingRules: {
        shadowReadsSlopeAndRelief: true,
        rimLightMayUseHighRelief: true,
        basinShadowMayUseFloorDepth: true,
        lightingMayNotInventSurfaceTruth: true
      },

      readyForLighting: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingReliefPrepPacket = clonePlain(packet);
    state.lightingReliefPrepPacketReady = true;
    return packet;
  }

  function buildCompositeReliefPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_COMPOSITE_RELIEF_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      elevationNodes: clonePlain(source.elevationNodes),
      heightfieldMap: clonePlain(source.heightfieldMap),
      reliefPressureMap: clonePlain(source.reliefPressureMap),
      slopeMap: clonePlain(source.slopeMap),
      basinFloorDepthMap: clonePlain(source.basinFloorDepthMap),
      escarpmentMap: clonePlain(source.escarpmentMap),
      waterlineReliefMap: clonePlain(source.waterlineReliefMap),
      materialExposureMap: clonePlain(source.materialExposureMap),

      compositeLayerContribution: {
        layer: "elevation",
        disposition: PLANETARY_DISPOSITION,
        contributesRelief: true,
        contributesHeightfield: true,
        contributesSlope: true,
        contributesBasinDepth: true,
        contributesEscarpmentRead: true,
        contributesWaterlinePreparation: true,
        contributesMaterialExposurePreparation: true
      },

      readyForComposite: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeReliefPrepPacket = clonePlain(packet);
    state.compositeReliefPrepPacketReady = true;
    return packet;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.elevationModel || buildElevationModel();

    const packet = {
      packetType: "HEARTH_ELEVATION_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "elevation",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      landformPacketConsumed: state.landformPacketObserved || state.landformDependencyObserved,
      landformFallbackUsed: state.landformFallbackUsed,
      elevationModelReady: true,
      heightfieldMapReady: true,
      reliefPressureMapReady: true,
      slopeMapReady: true,
      basinFloorDepthMapReady: true,
      escarpmentMapReady: true,

      inspectSummary: {
        highReliefNodeCount: state.highReliefNodeCount,
        plateauNodeCount: state.plateauNodeCount,
        basinFloorNodeCount: state.basinFloorNodeCount,
        escarpmentNodeCount: state.escarpmentNodeCount,
        drainagePrepNodeCount: state.drainagePrepNodeCount,
        shelfReliefNodeCount: state.shelfReliefNodeCount
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

  function buildElevationPacket(options = {}) {
    const model = buildElevationModel(options);

    const hydrologyPrep = buildHydrologyReliefPrepPacket(model);
    const materialPrep = buildMaterialReliefPrepPacket(model);
    const atmospherePrep = buildAtmosphereReliefPrepPacket(model);
    const lightingPrep = buildLightingReliefPrepPacket(model);
    const compositePrep = buildCompositeReliefPrepPacket(model);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_ELEVATION_FINGER_PACKET",
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

      sourceLandformFile: LANDFORM_FILE,
      sourceLandformContractExpected: LANDFORM_CONTRACT,
      landformDependencyExpected: true,
      landformDependencyObserved: state.landformDependencyObserved,
      landformAuthoritySourceName: state.landformAuthoritySourceName,
      landformPacketObserved: state.landformPacketObserved,
      landformReceiptObserved: state.landformReceiptObserved,
      landformNodeCount: state.landformNodeCount,
      landform256ScopeObserved: state.landform256ScopeObserved,
      landformFallbackUsed: state.landformFallbackUsed,

      elevationFingerActive: true,
      reliefPressureAuthorityActive: true,
      elevationModelReady: true,
      elevationPacketReady: true,
      diagnostic256Ready: true,
      heightfieldMapReady: true,
      reliefPressureMapReady: true,
      mountainCorridorMapReady: state.mountainCorridorMapReady,
      plateauMapReady: state.plateauMapReady,
      basinFloorDepthMapReady: true,
      slopeMapReady: true,
      escarpmentMapReady: true,

      elevationModel: clonePlain(model),
      hydrologyReliefPrepPacket: clonePlain(hydrologyPrep),
      materialReliefPrepPacket: clonePlain(materialPrep),
      atmosphereReliefPrepPacket: clonePlain(atmospherePrep),
      lightingReliefPrepPacket: clonePlain(lightingPrep),
      compositeReliefPrepPacket: clonePlain(compositePrep),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_HYDROLOGY_FINGER_EXPANSION",
      postgameStatus: "ELEVATION_RELIEF_PRESSURE_PACKET_READY_FOR_HYDROLOGY",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.elevationPacket = clonePlain(packet);
    state.elevationPacketReady = true;

    state.firstFailedCoordinate = "WAITING_HYDROLOGY_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "ELEVATION_RELIEF_PRESSURE_PACKET_READY_FOR_HYDROLOGY";

    record("ELEVATION_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      nextFile: NEXT_FILE,
      elevationPacketReady: true
    });

    return packet;
  }

  function getElevationModel(options = {}) {
    if (!state.elevationModel || options.rebuild === true) {
      return buildElevationModel(options);
    }

    return clonePlain(state.elevationModel);
  }

  function getElevationPacket(options = {}) {
    if (!state.elevationPacket || options.rebuild === true) {
      return buildElevationPacket(options);
    }

    return clonePlain(state.elevationPacket);
  }

  function getHeightfieldMap(options = {}) {
    const model = getElevationModel(options);
    return clonePlain(model.heightfieldMap || []);
  }

  function getReliefPressureMap(options = {}) {
    const model = getElevationModel(options);
    return clonePlain(model.reliefPressureMap || []);
  }

  function getSlopeMap(options = {}) {
    const model = getElevationModel(options);
    return clonePlain(model.slopeMap || []);
  }

  function getCompositeReliefPrepPacket(options = {}) {
    if (!state.compositeReliefPrepPacket || options.rebuild === true) {
      buildElevationPacket(options);
    }

    return clonePlain(state.compositeReliefPrepPacket);
  }

  function getHydrologyReliefPrepPacket(options = {}) {
    if (!state.hydrologyReliefPrepPacket || options.rebuild === true) {
      buildElevationPacket(options);
    }

    return clonePlain(state.hydrologyReliefPrepPacket);
  }

  function getMaterialReliefPrepPacket(options = {}) {
    if (!state.materialReliefPrepPacket || options.rebuild === true) {
      buildElevationPacket(options);
    }

    return clonePlain(state.materialReliefPrepPacket);
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
    const nodes = model && Array.isArray(model.elevationNodes) ? model.elevationNodes : [];
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

  function sampleElevation(x, y, options = {}) {
    const model = getElevationModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_ELEVATION_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      elevation: node ? node.elevation : 0,
      slope: node ? node.slope : 0,
      reliefClass: node ? node.reliefClass : "UNKNOWN",
      drainageVector: node ? clonePlain(node.drainageVector) : null,
      finalElevationTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleElevation(x, y, options);
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

    const model = getElevationModel(options);
    const nodes = model.elevationNodes || [];

    try {
      context.save();
      context.globalCompositeOperation = options.compositeOperation || "source-over";

      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;

      for (const node of nodes) {
        const alpha = clamp(options.opacity === undefined ? 0.22 : options.opacity, 0, 0.45);
        const elevation = clamp(node.elevation, 0, 1);
        const slope = clamp(node.slope, 0, 1);

        let tone = Math.round(52 + elevation * 118);
        let warmth = Math.round(44 + node.materialExposure * 68);
        let blue = Math.round(48 + (1 - elevation) * 42);

        if (node.basinFloor) {
          tone = Math.round(tone * 0.62);
          warmth = Math.round(warmth * 0.72);
          blue = Math.round(blue + 28);
        }

        if (node.mountainCorridor) {
          tone = Math.min(210, tone + 36);
          warmth = Math.min(175, warmth + 18);
        }

        context.globalAlpha = alpha + (slope * 0.06);
        context.fillStyle = `rgb(${tone}, ${warmth}, ${blue})`;
        context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);

        if (node.escarpment) {
          context.globalAlpha = clamp(alpha + 0.16, 0, 0.58);
          context.strokeStyle = "rgba(255, 239, 180, 0.42)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.06);
          context.beginPath();
          context.moveTo(node.col * cellW, node.row * cellH + cellH * 0.18);
          context.lineTo(node.col * cellW + cellW, node.row * cellH + cellH * 0.82);
          context.stroke();
        }
      }

      context.restore();

      record("ELEVATION_FINGER_DRAW_TO_CANVAS_COMPLETE", {
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

      recordError("ELEVATION_FINGER_DRAW_TO_CANVAS_FAILED", error);

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
    const packet = getElevationPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("ELEVATION_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
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
          : "CANVAS_HUB_REJECTED_ELEVATION_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("ELEVATION_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("ELEVATION_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("ELEVATION_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
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
    const packet = getElevationPacket(options);
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
          : "SURFACE_POINTER_REJECTED_ELEVATION_PACKET";

        record("ELEVATION_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("ELEVATION_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
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

      landformFile: LANDFORM_FILE,
      landformContractExpected: LANDFORM_CONTRACT,
      landformDependencyExpected: state.landformDependencyExpected,
      landformDependencyObserved: state.landformDependencyObserved,
      landformAuthoritySourceName: state.landformAuthoritySourceName,
      landformPacketObserved: state.landformPacketObserved,
      landformReceiptObserved: state.landformReceiptObserved,
      landformNodeCount: state.landformNodeCount,
      landform256ScopeObserved: state.landform256ScopeObserved,
      landformFallbackUsed: state.landformFallbackUsed,
      landformReadError: state.landformReadError,

      elevationFingerLoaded: state.elevationFingerLoaded,
      elevationFingerActive: state.elevationFingerActive,
      reliefPressureAuthorityActive: state.reliefPressureAuthorityActive,
      elevationModelReady: state.elevationModelReady,
      elevationPacketReady: state.elevationPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      heightfieldMapReady: state.heightfieldMapReady,
      reliefPressureMapReady: state.reliefPressureMapReady,
      mountainCorridorMapReady: state.mountainCorridorMapReady,
      plateauMapReady: state.plateauMapReady,
      basinFloorDepthMapReady: state.basinFloorDepthMapReady,
      slopeMapReady: state.slopeMapReady,
      escarpmentMapReady: state.escarpmentMapReady,

      hydrologyReliefPrepPacketReady: state.hydrologyReliefPrepPacketReady,
      materialReliefPrepPacketReady: state.materialReliefPrepPacketReady,
      atmosphereReliefPrepPacketReady: state.atmosphereReliefPrepPacketReady,
      lightingReliefPrepPacketReady: state.lightingReliefPrepPacketReady,
      compositeReliefPrepPacketReady: state.compositeReliefPrepPacketReady,
      inspectPrepPacketReady: state.inspectPrepPacketReady,

      elevationNodeCount: state.elevationNodeCount,
      highReliefNodeCount: state.highReliefNodeCount,
      plateauNodeCount: state.plateauNodeCount,
      basinFloorNodeCount: state.basinFloorNodeCount,
      escarpmentNodeCount: state.escarpmentNodeCount,
      drainagePrepNodeCount: state.drainagePrepNodeCount,
      shelfReliefNodeCount: state.shelfReliefNodeCount,

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
      sampleElevationAvailable: true,
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
      landformEvidence: clonePlain(state.landformEvidence),
      landformPacket: clonePlain(state.landformPacket),
      landformReceipt: clonePlain(state.landformReceipt),
      elevationModel: clonePlain(state.elevationModel),
      elevationPacket: clonePlain(state.elevationPacket),
      hydrologyReliefPrepPacket: clonePlain(state.hydrologyReliefPrepPacket),
      materialReliefPrepPacket: clonePlain(state.materialReliefPrepPacket),
      atmosphereReliefPrepPacket: clonePlain(state.atmosphereReliefPrepPacket),
      lightingReliefPrepPacket: clonePlain(state.lightingReliefPrepPacket),
      compositeReliefPrepPacket: clonePlain(state.compositeReliefPrepPacket),
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
      "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_RECEIPT",
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
      "LANDFORM_CONSUMPTION",
      line("landformFile", r.landformFile),
      line("landformContractExpected", r.landformContractExpected),
      line("landformDependencyExpected", r.landformDependencyExpected),
      line("landformDependencyObserved", r.landformDependencyObserved),
      line("landformAuthoritySourceName", r.landformAuthoritySourceName),
      line("landformPacketObserved", r.landformPacketObserved),
      line("landformReceiptObserved", r.landformReceiptObserved),
      line("landformNodeCount", r.landformNodeCount),
      line("landform256ScopeObserved", r.landform256ScopeObserved),
      line("landformFallbackUsed", r.landformFallbackUsed),
      line("landformReadError", r.landformReadError),
      "",
      "ELEVATION_STATUS",
      line("elevationFingerLoaded", r.elevationFingerLoaded),
      line("elevationFingerActive", r.elevationFingerActive),
      line("reliefPressureAuthorityActive", r.reliefPressureAuthorityActive),
      line("elevationModelReady", r.elevationModelReady),
      line("elevationPacketReady", r.elevationPacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("heightfieldMapReady", r.heightfieldMapReady),
      line("reliefPressureMapReady", r.reliefPressureMapReady),
      line("mountainCorridorMapReady", r.mountainCorridorMapReady),
      line("plateauMapReady", r.plateauMapReady),
      line("basinFloorDepthMapReady", r.basinFloorDepthMapReady),
      line("slopeMapReady", r.slopeMapReady),
      line("escarpmentMapReady", r.escarpmentMapReady),
      "",
      "PREP_PACKETS",
      line("hydrologyReliefPrepPacketReady", r.hydrologyReliefPrepPacketReady),
      line("materialReliefPrepPacketReady", r.materialReliefPrepPacketReady),
      line("atmosphereReliefPrepPacketReady", r.atmosphereReliefPrepPacketReady),
      line("lightingReliefPrepPacketReady", r.lightingReliefPrepPacketReady),
      line("compositeReliefPrepPacketReady", r.compositeReliefPrepPacketReady),
      line("inspectPrepPacketReady", r.inspectPrepPacketReady),
      "",
      "COUNTS",
      line("elevationNodeCount", r.elevationNodeCount),
      line("highReliefNodeCount", r.highReliefNodeCount),
      line("plateauNodeCount", r.plateauNodeCount),
      line("basinFloorNodeCount", r.basinFloorNodeCount),
      line("escarpmentNodeCount", r.escarpmentNodeCount),
      line("drainagePrepNodeCount", r.drainagePrepNodeCount),
      line("shelfReliefNodeCount", r.shelfReliefNodeCount),
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
    setDataset("hearthCanvasFingerElevationLoaded", "true");
    setDataset("hearthCanvasFingerElevationContract", CONTRACT);
    setDataset("hearthCanvasFingerElevationReceipt", RECEIPT);
    setDataset("hearthCanvasFingerElevationPacket", PACKET);
    setDataset("hearthCanvasFingerElevationFile", FILE);
    setDataset("hearthCanvasFingerElevationWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerElevationDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerElevationDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerElevationExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerElevationReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerElevationLandformDependencyExpected", String(state.landformDependencyExpected));
    setDataset("hearthCanvasFingerElevationLandformDependencyObserved", String(state.landformDependencyObserved));
    setDataset("hearthCanvasFingerElevationLandformSourceName", state.landformAuthoritySourceName);
    setDataset("hearthCanvasFingerElevationLandformPacketObserved", String(state.landformPacketObserved));
    setDataset("hearthCanvasFingerElevationLandformReceiptObserved", String(state.landformReceiptObserved));
    setDataset("hearthCanvasFingerElevationLandformNodeCount", String(state.landformNodeCount));
    setDataset("hearthCanvasFingerElevationLandform256ScopeObserved", String(state.landform256ScopeObserved));
    setDataset("hearthCanvasFingerElevationLandformFallbackUsed", String(state.landformFallbackUsed));

    setDataset("hearthCanvasFingerElevationModelReady", String(state.elevationModelReady));
    setDataset("hearthCanvasFingerElevationPacketReady", String(state.elevationPacketReady));
    setDataset("hearthCanvasFingerElevationDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerElevationHeightfieldMapReady", String(state.heightfieldMapReady));
    setDataset("hearthCanvasFingerElevationReliefPressureMapReady", String(state.reliefPressureMapReady));
    setDataset("hearthCanvasFingerElevationMountainCorridorMapReady", String(state.mountainCorridorMapReady));
    setDataset("hearthCanvasFingerElevationPlateauMapReady", String(state.plateauMapReady));
    setDataset("hearthCanvasFingerElevationBasinFloorDepthMapReady", String(state.basinFloorDepthMapReady));
    setDataset("hearthCanvasFingerElevationSlopeMapReady", String(state.slopeMapReady));
    setDataset("hearthCanvasFingerElevationEscarpmentMapReady", String(state.escarpmentMapReady));

    setDataset("hearthCanvasFingerElevationNodeCount", String(state.elevationNodeCount));
    setDataset("hearthCanvasFingerElevationHighReliefNodeCount", String(state.highReliefNodeCount));
    setDataset("hearthCanvasFingerElevationPlateauNodeCount", String(state.plateauNodeCount));
    setDataset("hearthCanvasFingerElevationBasinFloorNodeCount", String(state.basinFloorNodeCount));
    setDataset("hearthCanvasFingerElevationEscarpmentNodeCount", String(state.escarpmentNodeCount));
    setDataset("hearthCanvasFingerElevationDrainagePrepNodeCount", String(state.drainagePrepNodeCount));
    setDataset("hearthCanvasFingerElevationShelfReliefNodeCount", String(state.shelfReliefNodeCount));

    setDataset("hearthCanvasFingerElevationHydrologyPrepReady", String(state.hydrologyReliefPrepPacketReady));
    setDataset("hearthCanvasFingerElevationMaterialPrepReady", String(state.materialReliefPrepPacketReady));
    setDataset("hearthCanvasFingerElevationAtmospherePrepReady", String(state.atmosphereReliefPrepPacketReady));
    setDataset("hearthCanvasFingerElevationLightingPrepReady", String(state.lightingReliefPrepPacketReady));
    setDataset("hearthCanvasFingerElevationCompositePrepReady", String(state.compositeReliefPrepPacketReady));
    setDataset("hearthCanvasFingerElevationInspectPrepReady", String(state.inspectPrepPacketReady));

    setDataset("hearthCanvasFingerElevationSurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerElevationSurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerElevationSurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerElevationSurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerElevationSurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerElevationSurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerElevationHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerElevationHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerElevationHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerElevationHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerElevationHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerElevationHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerElevationFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerElevationRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerElevationPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerElevationNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerElevationF13Claimed", "false");
    setDataset("hearthCanvasFingerElevationF21Claimed", "false");
    setDataset("hearthCanvasFingerElevationReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerElevationTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationAtmosphericTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerElevationVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerElevationGeneratedImage", "false");
    setDataset("hearthCanvasFingerElevationGraphicBox", "false");
    setDataset("hearthCanvasFingerElevationWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerElevation = api;
    hearth.canvasElevationFinger = api;
    hearth.canvasFingerElevationReceipt = getReceiptLight();
    hearth.canvasFingerElevationPacket = getElevationPacket();

    lab.hearthCanvasFingerElevation = api;
    lab.hearthCanvasElevationFinger = api;
    lab.hearthCanvasFingerElevationReceipt = getReceiptLight();
    lab.hearthCanvasFingerElevationPacket = getElevationPacket();

    root.HEARTH_CANVAS_FINGER_ELEVATION = api;
    root.HEARTH_CANVAS_ELEVATION_FINGER = api;
    root.HEARTH_CANVAS_FINGER_ELEVATION_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_ELEVATION_PACKET = getElevationPacket();
    root.HEARTH_CANVAS_ELEVATION_HEIGHTFIELD_MAP = getHeightfieldMap();
    root.HEARTH_CANVAS_ELEVATION_RELIEF_PRESSURE_MAP = getReliefPressureMap();
    root.HEARTH_CANVAS_ELEVATION_SLOPE_MAP = getSlopeMap();

    root.HEARTH_ELEVATION_TO_HYDROLOGY_RELIEF_PREP_PACKET = getHydrologyReliefPrepPacket();
    root.HEARTH_ELEVATION_TO_MATERIAL_RELIEF_PREP_PACKET = getMaterialReliefPrepPacket();
    root.HEARTH_ELEVATION_TO_COMPOSITE_RELIEF_PREP_PACKET = getCompositeReliefPrepPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readLandformEvidence(options);
    buildElevationPacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("ELEVATION_FINGER_BOOT_COMPLETE", {
      landformDependencyObserved: state.landformDependencyObserved,
      landformPacketObserved: state.landformPacketObserved,
      landformNodeCount: state.landformNodeCount,
      elevationPacketReady: state.elevationPacketReady,
      hydrologyReliefPrepPacketReady: state.hydrologyReliefPrepPacketReady,
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
    SURFACE_FILE,
    NEXT_FILE,
    HYDROLOGY_FILE,
    MATERIAL_FILE,
    ATMOSPHERE_FILE,
    LIGHTING_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,
    LANDFORM_CONTRACT,
    LANDFORM_PACKET,

    GRID_SIZE,
    NODE_COUNT,
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

    readLandformEvidence,
    buildElevationModel,
    buildElevationPacket,
    getElevationModel,
    getElevationPacket,
    getHeightfieldMap,
    getReliefPressureMap,
    getSlopeMap,

    buildHydrologyReliefPrepPacket,
    buildMaterialReliefPrepPacket,
    buildAtmosphereReliefPrepPacket,
    buildLightingReliefPrepPacket,
    buildCompositeReliefPrepPacket,
    buildInspectPrepPacket,

    getHydrologyReliefPrepPacket,
    getMaterialReliefPrepPacket,
    getCompositeReliefPrepPacket,

    sample,
    sampleElevation,
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

    supportsElevationFinger: true,
    supportsReliefPressureAuthority: true,
    supportsLandformPacketConsumption: true,
    supportsDiagnostic256ElevationScope: true,
    supportsHeightfieldMap: true,
    supportsReliefPressureMap: true,
    supportsMountainCorridorMap: true,
    supportsPlateauMap: true,
    supportsBasinFloorDepthMap: true,
    supportsSlopeMap: true,
    supportsEscarpmentMap: true,
    supportsHydrologyReliefPrep: true,
    supportsMaterialReliefPrep: true,
    supportsAtmosphereReliefPrep: true,
    supportsLightingReliefPrep: true,
    supportsCompositeReliefPrep: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoFinalClaims: true,

    ownsElevationFingerIdentity: true,
    ownsReliefPressureModel: true,
    ownsElevationExpressionPacket: true,
    ownsHeightfieldPrep: true,
    ownsHydrologyReliefPrep: true,
    ownsMaterialReliefPrep: true,
    ownsCompositeReliefPrep: true,

    ownsLandformTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsFinalTerrainTruth: false,
    ownsFinalElevationTruth: false,
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

    readLandformEvidence();
    buildElevationPacket();
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
    recordError("ELEVATION_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
