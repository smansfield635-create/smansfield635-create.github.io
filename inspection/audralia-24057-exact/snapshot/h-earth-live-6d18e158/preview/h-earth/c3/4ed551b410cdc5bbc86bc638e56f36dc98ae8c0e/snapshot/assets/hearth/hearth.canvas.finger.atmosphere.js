// /assets/hearth/hearth.canvas.finger.atmosphere.js
// HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Atmosphere / Air-Envelope Authority.
// Purpose:
// - Establish Atmosphere as the fifth planetary-disposition expansion finger after Landform, Elevation, Hydrology, and Material.
// - Consume Material atmosphere-prep packets when available.
// - Consume Hydrology humidity/water-presence packets when available.
// - Convert Hearth's material skin and water logic into visible air-envelope grammar:
//   lower haze, basin vapor, coastal humidity, mineral aerosol, dry dust, wet-clay vapor hold,
//   highland thin air, shelf shimmer, atmospheric rim readability, and composite-ready air layers.
// - Preserve Landform as body definition.
// - Preserve Elevation as relief definition.
// - Preserve Hydrology as water-level definition.
// - Preserve Material as surface/mineral definition.
// - Preserve Surface as the pointer/socket lane when available.
// - Publish atmosphere, lighting-prep, composite-prep, and inspect-prep packets.
// - Continue expansion on the already-instilled finger architecture; do not treat this as reintegration.
// - Never mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Landform, Elevation, Hydrology, Material, Surface, or any other finger file.
// - Never claim final terrain truth, final hydrology truth, final material truth, final atmosphere truth, final lighting truth, final visual pass, F13, F21, ready text, generated image, GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-atmosphere-air-envelope-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const MATERIAL_CONTRACT = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_TNT_v1";
  const HYDROLOGY_CONTRACT = "HEARTH_CANVAS_FINGER_HYDROLOGY_WATER_LEVEL_AUTHORITY_TNT_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;

  const FINGER_NAME = "atmosphere";
  const FINGER_ROLE = "air-envelope-authority";
  const FINGER_ORDER = 5;
  const PLANETARY_DISPOSITION_INDEX = 5;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_BREATHING_ENVELOPE";

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
    atmosphereTruthClaimed: false,
    finalAtmosphereTruthClaimed: false,
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
    material: MATERIAL_FILE,
    atmosphere: FILE,
    lighting: LIGHTING_FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

  const MATERIAL_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMaterial",
    "HEARTH.canvasMaterialFinger",
    "HEARTH_CANVAS_FINGER_MATERIAL",
    "HEARTH_CANVAS_MATERIAL_FINGER",
    "HEARTH_CANVAS_FINGER_MATERIAL_PACKET",
    "HEARTH_MATERIAL_TO_ATMOSPHERE_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerMaterial",
    "DEXTER_LAB.hearthCanvasMaterialFinger"
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
    "receiveAtmosphereFingerPacket",
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
    "receiveAtmosphereFingerPacket",
    "receiveAtmospherePacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const AIR_CLASSES = Object.freeze({
    DEEP_BASIN_VAPOR: "deep-basin-vapor",
    OCEAN_HUMID_ENVELOPE: "ocean-humid-envelope",
    SHELF_SHIMMER: "shelf-shimmer",
    RIVER_MIST: "river-mist",
    WETLAND_FOG_HOLD: "wetland-fog-hold",
    MINERAL_AEROSOL_TRACE: "mineral-aerosol-trace",
    AQUIFER_GROUND_HAZE: "aquifer-ground-haze",
    HIGHLAND_THIN_AIR: "highland-thin-air",
    DRY_DUST_AIR: "dry-dust-air",
    TEMPERATE_SURFACE_AIR: "temperate-surface-air"
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

    materialFile: MATERIAL_FILE,
    materialContractExpected: MATERIAL_CONTRACT,
    materialDependencyExpected: true,
    materialDependencyObserved: false,
    materialAuthoritySourceName: "NONE",
    materialPacketObserved: false,
    materialReceiptObserved: false,
    materialAtmospherePrepObserved: false,
    materialNodeCount: 0,
    material256ScopeObserved: false,
    materialFallbackUsed: false,
    materialReadError: "",

    hydrologyFile: HYDROLOGY_FILE,
    hydrologyContractExpected: HYDROLOGY_CONTRACT,
    hydrologyDependencyExpected: true,
    hydrologyDependencyObserved: false,
    hydrologyAuthoritySourceName: "NONE",
    hydrologyPacketObserved: false,
    hydrologyReceiptObserved: false,
    hydrologyNodeCount: 0,
    hydrology256ScopeObserved: false,
    hydrologyFallbackUsed: false,
    hydrologyReadError: "",

    surfacePointerExpected: true,
    surfacePointerObserved: false,
    surfacePointerSourceName: "NONE",
    surfacePointerRegistrationAttempted: false,
    surfacePointerRegistrationAccepted: false,
    surfacePointerRegistrationMethod: "NONE",
    surfacePointerRegistrationHeldReason: "NOT_ATTEMPTED",
    surfacePointerRegistrationError: "",

    atmosphereFingerLoaded: true,
    atmosphereFingerActive: true,
    airEnvelopeAuthorityActive: true,
    atmosphereModelReady: false,
    atmospherePacketReady: false,
    diagnostic256Ready: false,

    humidityMapReady: false,
    vaporMapReady: false,
    dustMapReady: false,
    aerosolMapReady: false,
    pressureMapReady: false,
    airClarityMapReady: false,
    rimEnvelopeMapReady: false,
    lowerHazeMapReady: false,
    cloudSeedMapReady: false,
    compositeAtmosphereMapReady: false,

    lightingAtmospherePrepPacketReady: false,
    compositeAtmospherePrepPacketReady: false,
    inspectPrepPacketReady: false,

    atmosphereNodeCount: 0,
    deepBasinVaporNodeCount: 0,
    oceanHumidEnvelopeNodeCount: 0,
    shelfShimmerNodeCount: 0,
    riverMistNodeCount: 0,
    wetlandFogHoldNodeCount: 0,
    mineralAerosolTraceNodeCount: 0,
    aquiferGroundHazeNodeCount: 0,
    highlandThinAirNodeCount: 0,
    dryDustAirNodeCount: 0,
    temperateSurfaceAirNodeCount: 0,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "ATMOSPHERE_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "ATMOSPHERE_FINGER_WAITING_BOOT",

    materialEvidence: null,
    materialPacket: null,
    materialReceipt: null,
    materialAtmospherePrepPacket: null,
    materialNodes: [],

    hydrologyEvidence: null,
    hydrologyPacket: null,
    hydrologyReceipt: null,
    hydrologyNodes: [],

    atmosphereModel: null,
    atmospherePacket: null,
    lightingAtmospherePrepPacket: null,
    compositeAtmospherePrepPacket: null,
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
      event: safeString(event, "ATMOSPHERE_FINGER_EVENT"),
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
      code: safeString(code, "ATMOSPHERE_FINGER_ERROR"),
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
        recordError("ATMOSPHERE_FINGER_AUTHORITY_READ_METHOD_FAILED", error, {
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
      Array.isArray(value.materialNodes) ||
      Array.isArray(value.atmospherePrepNodes) ||
      Array.isArray(value.materialColorHintMap) ||
      Array.isArray(value.wetnessMaterialMap) ||
      Array.isArray(value.mineralPressureMap) ||
      Array.isArray(value.hydrologyNodes) ||
      Array.isArray(value.waterPresenceMap)
    ) {
      return value;
    }

    return null;
  }

  function buildFallbackMaterialNodes() {
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
      const wetness = clamp(waterDepth * 0.48 + basin * 0.20 + shelf * 0.12 + river * 0.16, 0, 1);
      const sediment = clamp(basin * 0.34 + shelf * 0.30 + river * 0.16, 0, 1);
      const mineral = clamp(hashNoise(index, 3, 23) * 0.24 + shelf * 0.20 + river * 0.12, 0, 1);
      const stone = clamp(elevation * 0.34 + (1 - waterDepth) * 0.14 + hashNoise(index, 5, 19) * 0.12, 0, 1);

      let materialClass = "weathered-ground";
      if (waterDepth > 0.32) materialClass = "deep-basin-silt";
      else if (waterDepth > 0.18) materialClass = "oceanic-dark-stone";
      else if (shelf > 0.48 && waterDepth > 0.05) materialClass = "shelf-mineral-sand";
      else if (river > 0.55) materialClass = "river-worn-stone";
      else if (wetness > 0.42 && basin > 0.38) materialClass = "wetland-clay";
      else if (mineral > 0.58) materialClass = "spring-mineral-vein";
      else if (wetness > 0.36) materialClass = "aquifer-dark-soil";
      else if (elevation > 0.68 || stone > 0.66) materialClass = "exposed-highland-stone";
      else if (wetness < 0.08 && elevation > 0.52) materialClass = "dry-crust";

      nodes.push({
        index,
        id: `HEARTH_MATERIAL_NODE_${String(index + 1).padStart(3, "0")}`,
        row,
        col,
        x: round(x),
        y: round(y),
        worldName: WORLD_NAME,
        materialClass,
        colorHint: materialClass,
        elevation: round(elevation),
        slope: round(clamp(Math.abs(elevation - 0.48) * 0.6 + river * 0.2, 0, 1)),
        waterPresence: round(clamp(waterDepth + river * 0.20, 0, 1)),
        waterDepth: round(waterDepth),
        aquiferPressure: round(clamp(wetness * 0.58 + basin * 0.16, 0, 1)),
        springPotential: round(clamp(mineral * 0.42 + river * 0.16, 0, 1)),
        sedimentDepositPotential: round(sediment),
        erosionPotential: round(clamp(river * 0.35 + waterDepth * 0.20, 0, 1)),
        wetnessMaterial: round(wetness),
        sedimentMaterial: round(sediment),
        mineralPressure: round(mineral),
        stoneExposure: round(stone),
        soilPotential: round(clamp(sediment * 0.30 + wetness * 0.24 + (1 - stone) * 0.12, 0, 1)),
        shorelineMaterial: round(shelf),
        roughness: round(clamp(stone * 0.36 + elevation * 0.20, 0, 1)),
        atmospherePrep: {
          dustPotential: round(clamp(materialClass === "dry-crust" ? 0.42 : (1 - wetness) * 0.12, 0, 1)),
          wetSurfaceHumidityHold: round(clamp(wetness * 0.58 + waterDepth * 0.20, 0, 1)),
          mineralAerosolHint: round(clamp(mineral * 0.28 + shelf * 0.10, 0, 1))
        },
        lightingPrep: {
          lightAbsorption: round(clamp(wetness * 0.24 + waterDepth * 0.28, 0, 1)),
          highlightPotential: round(clamp(mineral * 0.22 + shelf * 0.24 + stone * 0.14, 0, 1)),
          surfaceRoughness: round(clamp(stone * 0.36 + elevation * 0.20, 0, 1))
        },
        finalMaterialTruthClaim: false,
        finalVisualClaim: false
      });
    }

    return nodes;
  }

  function buildFallbackHydrologyNodesFromMaterial(materialNodes) {
    return materialNodes.map((m, index) => ({
      index,
      id: `HEARTH_HYDROLOGY_NODE_${String(index + 1).padStart(3, "0")}`,
      row: m.row,
      col: m.col,
      x: m.x,
      y: m.y,
      worldName: WORLD_NAME,
      waterPresence: m.waterPresence || m.wetnessMaterial || 0,
      waterDepth: m.waterDepth || 0,
      aquiferPressure: m.aquiferPressure || m.wetnessMaterial || 0,
      humidityContribution: clamp((m.waterPresence || 0) * 0.42 + (m.wetnessMaterial || 0) * 0.30, 0, 1),
      reflectanceContribution: clamp((m.waterDepth || 0) * 0.42 + (m.shorelineMaterial || 0) * 0.16, 0, 1),
      waterClass: m.waterDepth > 0.22 ? "OCEAN_BODY" : m.waterPresence > 0.32 ? "WETLAND_MARGIN" : "DRY_UPLAND",
      riverChannel: m.materialClass === "river-worn-stone",
      wetland: m.materialClass === "wetland-clay",
      shelfWater: m.materialClass === "shelf-mineral-sand",
      finalHydrologyTruthClaim: false,
      finalVisualClaim: false
    }));
  }

  function normalizeMaterialNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const prep = isObject(raw.atmospherePrep) ? raw.atmospherePrep : {};

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_MATERIAL_NODE_${String(index + 1).padStart(3, "0")}`),
      row: getFirstNumber(raw, ["row"], row),
      col: getFirstNumber(raw, ["col"], col),
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1)),
      worldName: WORLD_NAME,

      materialClass: getFirstString(raw, ["materialClass", "class"], "weathered-ground"),
      colorHint: getFirstString(raw, ["colorHint"], "weathered-earth-tone"),
      elevation: round(clamp(getFirstNumber(raw, ["elevation", "height", "normalizedHeight"], 0.44), 0, 1)),
      slope: round(clamp(getFirstNumber(raw, ["slope"], 0.10), 0, 1)),
      waterPresence: round(clamp(getFirstNumber(raw, ["waterPresence"], 0), 0, 1)),
      waterDepth: round(clamp(getFirstNumber(raw, ["waterDepth"], 0), 0, 1)),
      aquiferPressure: round(clamp(getFirstNumber(raw, ["aquiferPressure"], 0), 0, 1)),
      springPotential: round(clamp(getFirstNumber(raw, ["springPotential"], 0), 0, 1)),
      sedimentDepositPotential: round(clamp(getFirstNumber(raw, ["sedimentDepositPotential"], 0), 0, 1)),
      erosionPotential: round(clamp(getFirstNumber(raw, ["erosionPotential"], 0), 0, 1)),
      wetnessMaterial: round(clamp(getFirstNumber(raw, ["wetnessMaterial", "wetness"], 0), 0, 1)),
      sedimentMaterial: round(clamp(getFirstNumber(raw, ["sedimentMaterial", "sediment"], 0), 0, 1)),
      mineralPressure: round(clamp(getFirstNumber(raw, ["mineralPressure", "mineral"], 0), 0, 1)),
      stoneExposure: round(clamp(getFirstNumber(raw, ["stoneExposure", "baseRock", "exposedStone"], 0), 0, 1)),
      soilPotential: round(clamp(getFirstNumber(raw, ["soilPotential", "soil"], 0), 0, 1)),
      shorelineMaterial: round(clamp(getFirstNumber(raw, ["shorelineMaterial", "shoreline"], 0), 0, 1)),
      roughness: round(clamp(getFirstNumber(raw, ["roughness"], 0), 0, 1)),
      atmospherePrep: {
        dustPotential: round(clamp(getFirstNumber(prep, ["dustPotential"], 0), 0, 1)),
        wetSurfaceHumidityHold: round(clamp(getFirstNumber(prep, ["wetSurfaceHumidityHold"], 0), 0, 1)),
        mineralAerosolHint: round(clamp(getFirstNumber(prep, ["mineralAerosolHint"], 0), 0, 1))
      },
      finalMaterialTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeHydrologyNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_HYDROLOGY_NODE_${String(index + 1).padStart(3, "0")}`),
      row: getFirstNumber(raw, ["row"], row),
      col: getFirstNumber(raw, ["col"], col),
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1)),
      worldName: WORLD_NAME,

      waterClass: getFirstString(raw, ["waterClass", "hydrologyClass"], "DRY_UPLAND"),
      waterPresence: round(clamp(getFirstNumber(raw, ["waterPresence"], 0), 0, 1)),
      waterDepth: round(clamp(getFirstNumber(raw, ["waterDepth"], 0), 0, 1)),
      aquiferPressure: round(clamp(getFirstNumber(raw, ["aquiferPressure"], 0), 0, 1)),
      humidityContribution: round(clamp(getFirstNumber(raw, ["humidityContribution"], 0), 0, 1)),
      reflectanceContribution: round(clamp(getFirstNumber(raw, ["reflectanceContribution"], 0), 0, 1)),
      riverChannel: getFirstBool(raw, ["riverChannel"], false),
      wetland: getFirstBool(raw, ["wetland"], false),
      shelfWater: getFirstBool(raw, ["shelfWater"], false),
      finalHydrologyTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function extractMaterialNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.materialNodes,
      packet.atmospherePrepNodes,
      packet.materialModel && packet.materialModel.materialNodes,
      packet.atmosphereMaterialPrepPacket && packet.atmosphereMaterialPrepPacket.materialNodes,
      packet.compositeMaterialPrepPacket && packet.compositeMaterialPrepPacket.materialNodes,
      packet.original && packet.original.materialNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    const wetnessMap = Array.isArray(packet.wetnessMaterialMap) ? packet.wetnessMaterialMap : null;
    const sedimentMap = Array.isArray(packet.sedimentMap) ? packet.sedimentMap : null;
    const mineralMap = Array.isArray(packet.mineralPressureMap) ? packet.mineralPressureMap : null;
    const colorMap = Array.isArray(packet.materialColorHintMap) ? packet.materialColorHintMap : null;

    if (wetnessMap && wetnessMap.length === NODE_COUNT) {
      return wetnessMap.map((wetness, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;

        return {
          index,
          row,
          col,
          x: (col + 0.5) / GRID_SIZE,
          y: (row + 0.5) / GRID_SIZE,
          materialClass: colorMap ? colorMap[index] : "weathered-ground",
          wetnessMaterial: wetness,
          sedimentMaterial: sedimentMap ? sedimentMap[index] : 0,
          mineralPressure: mineralMap ? mineralMap[index] : 0,
          atmospherePrep: {
            wetSurfaceHumidityHold: wetness * 0.6,
            dustPotential: Math.max(0, 1 - wetness) * 0.12,
            mineralAerosolHint: mineralMap ? mineralMap[index] * 0.25 : 0
          }
        };
      });
    }

    return [];
  }

  function extractHydrologyNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.hydrologyNodes,
      packet.nodes,
      packet.hydrologyModel && packet.hydrologyModel.hydrologyNodes,
      packet.materialHydrologyPrepPacket && packet.materialHydrologyPrepPacket.hydrologyNodes,
      packet.original && packet.original.hydrologyNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    return [];
  }

  function readMaterialEvidence(options = {}) {
    const found = findSource(MATERIAL_SOURCE_NAMES);

    state.materialDependencyObserved = Boolean(found.source);
    state.materialAuthoritySourceName = found.sourceName;
    state.materialReadError = "";

    let packet = null;
    let receipt = null;
    let atmospherePrep = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getAtmosphereMaterialPrepPacket",
          "getMaterialPacket",
          "getMaterialModel",
          "getCompositeMaterialPrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          "atmosphereMaterialPrepPacket",
          "materialPacket",
          "packet",
          "materialModel",
          "compositeMaterialPrepPacket"
        ]);

        if (packetCandidate && packetCandidate.packetType === "HEARTH_MATERIAL_TO_ATMOSPHERE_PREP_PACKET") {
          atmospherePrep = packetCandidate;
        } else if (packet && packet.packetType === "HEARTH_MATERIAL_TO_ATMOSPHERE_PREP_PACKET") {
          atmospherePrep = packet;
        } else if (packet && isObject(packet.atmosphereMaterialPrepPacket)) {
          atmospherePrep = packet.atmosphereMaterialPrepPacket;
        }

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.materialReadError = error && error.message ? String(error.message) : String(error);
        recordError("ATMOSPHERE_FINGER_MATERIAL_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.materialPacket && isObject(options.materialPacket)) {
      packet = options.materialPacket;
      state.materialDependencyObserved = true;
      state.materialAuthoritySourceName = "OPTIONS_MATERIAL_PACKET";
    }

    if (options.atmosphereMaterialPrepPacket && isObject(options.atmosphereMaterialPrepPacket)) {
      atmospherePrep = options.atmosphereMaterialPrepPacket;
      state.materialDependencyObserved = true;
      state.materialAuthoritySourceName = "OPTIONS_ATMOSPHERE_MATERIAL_PREP_PACKET";
    }

    const packetForNodes = atmospherePrep || packet;
    const rawNodes = extractMaterialNodes(packetForNodes);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeMaterialNode(entry, index));
    }

    if (nodes.length < NODE_COUNT) {
      nodes = buildFallbackMaterialNodes();
    }

    state.materialPacketObserved = Boolean(packet);
    state.materialReceiptObserved = Boolean(receipt);
    state.materialAtmospherePrepObserved = Boolean(atmospherePrep);
    state.materialNodeCount = nodes.length;
    state.material256ScopeObserved = nodes.length === NODE_COUNT;
    state.materialFallbackUsed = !packetForNodes || rawNodes.length === 0;

    state.materialPacket = clonePlain(packet);
    state.materialReceipt = clonePlain(receipt);
    state.materialAtmospherePrepPacket = clonePlain(atmospherePrep);
    state.materialNodes = clonePlain(nodes);

    const evidence = {
      observed: state.materialDependencyObserved,
      sourceName: state.materialAuthoritySourceName,
      packetObserved: state.materialPacketObserved,
      receiptObserved: state.materialReceiptObserved,
      atmospherePrepObserved: state.materialAtmospherePrepObserved,
      nodeCount: state.materialNodeCount,
      diagnostic256Ready: state.material256ScopeObserved,
      fallbackUsed: state.materialFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      atmospherePrepPacket: clonePlain(atmospherePrep),
      nodes: clonePlain(nodes)
    };

    state.materialEvidence = clonePlain(evidence);

    record("ATMOSPHERE_FINGER_MATERIAL_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      atmospherePrepObserved: evidence.atmospherePrepObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function readHydrologyEvidence(options = {}) {
    const found = findSource(HYDROLOGY_SOURCE_NAMES);

    state.hydrologyDependencyObserved = Boolean(found.source);
    state.hydrologyAuthoritySourceName = found.sourceName;
    state.hydrologyReadError = "";

    let packet = null;
    let receipt = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getHydrologyPacket",
          "getHydrologyModel",
          "getMaterialHydrologyPrepPacket",
          "getCompositeHydrologyPrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          "hydrologyPacket",
          "packet",
          "hydrologyModel",
          "materialHydrologyPrepPacket",
          "compositeHydrologyPrepPacket"
        ]);

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.hydrologyReadError = error && error.message ? String(error.message) : String(error);
        recordError("ATMOSPHERE_FINGER_HYDROLOGY_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.hydrologyPacket && isObject(options.hydrologyPacket)) {
      packet = options.hydrologyPacket;
      state.hydrologyDependencyObserved = true;
      state.hydrologyAuthoritySourceName = "OPTIONS_HYDROLOGY_PACKET";
    }

    const rawNodes = extractHydrologyNodes(packet);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeHydrologyNode(entry, index));
    }

    if (nodes.length < NODE_COUNT) {
      nodes = buildFallbackHydrologyNodesFromMaterial(state.materialNodes.length ? state.materialNodes : buildFallbackMaterialNodes());
    }

    state.hydrologyPacketObserved = Boolean(packet);
    state.hydrologyReceiptObserved = Boolean(receipt);
    state.hydrologyNodeCount = nodes.length;
    state.hydrology256ScopeObserved = nodes.length === NODE_COUNT;
    state.hydrologyFallbackUsed = !packet || rawNodes.length === 0;

    state.hydrologyPacket = clonePlain(packet);
    state.hydrologyReceipt = clonePlain(receipt);
    state.hydrologyNodes = clonePlain(nodes);

    const evidence = {
      observed: state.hydrologyDependencyObserved,
      sourceName: state.hydrologyAuthoritySourceName,
      packetObserved: state.hydrologyPacketObserved,
      receiptObserved: state.hydrologyReceiptObserved,
      nodeCount: state.hydrologyNodeCount,
      diagnostic256Ready: state.hydrology256ScopeObserved,
      fallbackUsed: state.hydrologyFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      nodes: clonePlain(nodes)
    };

    state.hydrologyEvidence = clonePlain(evidence);

    record("ATMOSPHERE_FINGER_HYDROLOGY_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function airClassFor(material, hydro, humidity, vapor, dust, aerosol, pressure, clarity) {
    const materialClass = material.materialClass;

    if (materialClass === "deep-basin-silt" || hydro.waterClass === "DEEP_BASIN_SEA") return AIR_CLASSES.DEEP_BASIN_VAPOR;
    if (materialClass === "oceanic-dark-stone" || hydro.waterClass === "OCEAN_BODY") return AIR_CLASSES.OCEAN_HUMID_ENVELOPE;
    if (materialClass === "shelf-mineral-sand" || hydro.shelfWater) return AIR_CLASSES.SHELF_SHIMMER;
    if (materialClass === "river-worn-stone" || hydro.riverChannel) return AIR_CLASSES.RIVER_MIST;
    if (materialClass === "wetland-clay" || hydro.wetland) return AIR_CLASSES.WETLAND_FOG_HOLD;
    if (materialClass === "spring-mineral-vein" || aerosol >= 0.46) return AIR_CLASSES.MINERAL_AEROSOL_TRACE;
    if (materialClass === "aquifer-dark-soil" || hydro.aquiferPressure >= 0.55) return AIR_CLASSES.AQUIFER_GROUND_HAZE;
    if (materialClass === "exposed-highland-stone" || material.elevation >= 0.68) return AIR_CLASSES.HIGHLAND_THIN_AIR;
    if (materialClass === "dry-crust" || dust >= 0.38) return AIR_CLASSES.DRY_DUST_AIR;
    if (humidity >= 0.46 || vapor >= 0.34) return AIR_CLASSES.OCEAN_HUMID_ENVELOPE;
    if (pressure <= 0.24 && clarity >= 0.60) return AIR_CLASSES.HIGHLAND_THIN_AIR;
    return AIR_CLASSES.TEMPERATE_SURFACE_AIR;
  }

  function airStory(airClass) {
    if (airClass === AIR_CLASSES.DEEP_BASIN_VAPOR) {
      return "The basin breathes upward from old depth, keeping vapor close to the low body.";
    }

    if (airClass === AIR_CLASSES.OCEAN_HUMID_ENVELOPE) {
      return "Open water feeds a heavier envelope where the air carries moisture before light touches it.";
    }

    if (airClass === AIR_CLASSES.SHELF_SHIMMER) {
      return "The shallow shelf holds a thin luminous shimmer where mineral edge and water edge meet.";
    }

    if (airClass === AIR_CLASSES.RIVER_MIST) {
      return "Moving water lifts a narrow mist trail along the worn corridor.";
    }

    if (airClass === AIR_CLASSES.WETLAND_FOG_HOLD) {
      return "Wet clay slows the air, holding fog close to the surface.";
    }

    if (airClass === AIR_CLASSES.MINERAL_AEROSOL_TRACE) {
      return "Mineral pressure leaves a subtle atmospheric trace above the surface seam.";
    }

    if (airClass === AIR_CLASSES.AQUIFER_GROUND_HAZE) {
      return "Water below the surface presses a low haze through darker ground.";
    }

    if (airClass === AIR_CLASSES.HIGHLAND_THIN_AIR) {
      return "Raised stone thins the envelope and clears the air along the high body.";
    }

    if (airClass === AIR_CLASSES.DRY_DUST_AIR) {
      return "Dry crust releases dust into the low envelope without becoming weather truth.";
    }

    return "Temperate air holds the neutral envelope between water, stone, dust, and light.";
  }

  function buildAtmosphereModel(options = {}) {
    const material = readMaterialEvidence(options);
    const hydrology = readHydrologyEvidence(options);

    const materialNodes = material.nodes.length === NODE_COUNT ? material.nodes : buildFallbackMaterialNodes();
    const hydrologyNodes = hydrology.nodes.length === NODE_COUNT
      ? hydrology.nodes
      : buildFallbackHydrologyNodesFromMaterial(materialNodes);

    const atmosphereNodes = materialNodes.map((m, index) => {
      const h = hydrologyNodes[index] || {};
      const prep = isObject(m.atmospherePrep) ? m.atmospherePrep : {};
      const noise = hashNoise(index, 17, 61);

      const humidity = clamp(
        (h.humidityContribution * 0.34) +
        (h.waterPresence * 0.24) +
        (m.wetnessMaterial * 0.24) +
        (prep.wetSurfaceHumidityHold * 0.20),
        0,
        1
      );

      const vapor = clamp(
        (h.waterDepth * 0.28) +
        (h.aquiferPressure * 0.18) +
        (m.wetnessMaterial * 0.24) +
        (m.sedimentMaterial * 0.12) +
        (noise * 0.10),
        0,
        1
      );

      const dust = clamp(
        (prep.dustPotential * 0.42) +
        ((1 - m.wetnessMaterial) * 0.14) +
        (m.soilPotential * 0.10) +
        (m.roughness * 0.08) +
        (m.materialClass === "dry-crust" ? 0.22 : 0),
        0,
        1
      );

      const aerosol = clamp(
        (prep.mineralAerosolHint * 0.40) +
        (m.mineralPressure * 0.22) +
        (m.shorelineMaterial * 0.10) +
        (noise * 0.10),
        0,
        1
      );

      const pressure = clamp(
        (1 - m.elevation) * 0.36 +
        (humidity * 0.22) +
        (vapor * 0.18) +
        (dust * 0.08),
        0,
        1
      );

      const airClarity = clamp(
        1 -
        (humidity * 0.18) -
        (vapor * 0.22) -
        (dust * 0.18) -
        (aerosol * 0.10) +
        (m.elevation * 0.12),
        0,
        1
      );

      const rimEnvelope = clamp(
        (m.elevation * 0.20) +
        (h.reflectanceContribution * 0.14) +
        (m.shorelineMaterial * 0.18) +
        (airClarity * 0.14),
        0,
        1
      );

      const lowerHaze = clamp(
        (pressure * 0.26) +
        (vapor * 0.24) +
        (dust * 0.16) +
        (aerosol * 0.12),
        0,
        1
      );

      const cloudSeed = clamp(
        (humidity * 0.34) +
        (vapor * 0.22) +
        (h.waterDepth * 0.10) -
        (m.elevation * 0.08) +
        (noise * 0.08),
        0,
        1
      );

      const airClass = airClassFor(m, h, humidity, vapor, dust, aerosol, pressure, airClarity);

      return {
        index,
        id: `HEARTH_ATMOSPHERE_NODE_${String(index + 1).padStart(3, "0")}`,
        row: m.row,
        col: m.col,
        x: m.x,
        y: m.y,
        worldName: WORLD_NAME,

        sourceMaterialId: m.id,
        sourceHydrologyId: h.id || "",
        materialClass: m.materialClass,
        waterClass: h.waterClass || "",
        elevation: m.elevation,
        wetnessMaterial: m.wetnessMaterial,
        mineralPressure: m.mineralPressure,
        shorelineMaterial: m.shorelineMaterial,

        airClass,
        humidity: round(humidity),
        vapor: round(vapor),
        dust: round(dust),
        aerosol: round(aerosol),
        pressure: round(pressure),
        airClarity: round(airClarity),
        rimEnvelope: round(rimEnvelope),
        lowerHaze: round(lowerHaze),
        cloudSeed: round(cloudSeed),

        lightingPrep: {
          hazeScattering: round(clamp(lowerHaze * 0.32 + aerosol * 0.18, 0, 1)),
          rimLightCarrier: round(rimEnvelope),
          atmosphericAbsorption: round(clamp(vapor * 0.22 + dust * 0.12 + humidity * 0.10, 0, 1)),
          shadowSoftening: round(clamp(vapor * 0.18 + hazeScatteringSafe(lowerHaze, aerosol), 0, 1)),
          skyTintHint: airTintHint(airClass)
        },

        compositePrep: {
          atmosphereLayerReady: true,
          airClass,
          humidity: round(humidity),
          vapor: round(vapor),
          dust: round(dust),
          aerosol: round(aerosol),
          pressure: round(pressure),
          airClarity: round(airClarity),
          rimEnvelope: round(rimEnvelope),
          lowerHaze: round(lowerHaze),
          cloudSeed: round(cloudSeed),
          tintHint: airTintHint(airClass)
        },

        story: airStory(airClass),

        finalAtmosphereTruthClaim: false,
        finalVisualClaim: false
      };
    });

    const byClass = {};
    for (const key of Object.values(AIR_CLASSES)) byClass[key] = [];

    for (const node of atmosphereNodes) {
      if (!byClass[node.airClass]) byClass[node.airClass] = [];
      byClass[node.airClass].push(node.index);
    }

    const humidityMap = atmosphereNodes.map((node) => node.humidity);
    const vaporMap = atmosphereNodes.map((node) => node.vapor);
    const dustMap = atmosphereNodes.map((node) => node.dust);
    const aerosolMap = atmosphereNodes.map((node) => node.aerosol);
    const pressureMap = atmosphereNodes.map((node) => node.pressure);
    const airClarityMap = atmosphereNodes.map((node) => node.airClarity);
    const rimEnvelopeMap = atmosphereNodes.map((node) => node.rimEnvelope);
    const lowerHazeMap = atmosphereNodes.map((node) => node.lowerHaze);
    const cloudSeedMap = atmosphereNodes.map((node) => node.cloudSeed);
    const compositeAtmosphereMap = atmosphereNodes.map((node) => clonePlain(node.compositePrep));

    const model = {
      modelType: "HEARTH_ATMOSPHERE_AIR_ENVELOPE_MODEL",
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

      sourceMaterialContractExpected: MATERIAL_CONTRACT,
      sourceMaterialFile: MATERIAL_FILE,
      materialDependencyObserved: material.observed,
      materialPacketObserved: material.packetObserved,
      materialReceiptObserved: material.receiptObserved,
      materialAtmospherePrepObserved: material.atmospherePrepObserved,
      materialNodeCount: material.nodeCount,
      material256ScopeObserved: material.diagnostic256Ready,
      materialFallbackUsed: material.fallbackUsed,

      sourceHydrologyContractExpected: HYDROLOGY_CONTRACT,
      sourceHydrologyFile: HYDROLOGY_FILE,
      hydrologyDependencyObserved: hydrology.observed,
      hydrologyPacketObserved: hydrology.packetObserved,
      hydrologyReceiptObserved: hydrology.receiptObserved,
      hydrologyNodeCount: hydrology.nodeCount,
      hydrology256ScopeObserved: hydrology.diagnostic256Ready,
      hydrologyFallbackUsed: hydrology.fallbackUsed,

      gridSize: GRID_SIZE,
      nodeCount: NODE_COUNT,
      atmosphereNodes,

      airClasses: clonePlain(AIR_CLASSES),
      airClassIndex: clonePlain(byClass),

      humidityMap,
      vaporMap,
      dustMap,
      aerosolMap,
      pressureMap,
      airClarityMap,
      rimEnvelopeMap,
      lowerHazeMap,
      cloudSeedMap,
      compositeAtmosphereMap,

      deepBasinVaporNodes: byClass[AIR_CLASSES.DEEP_BASIN_VAPOR] || [],
      oceanHumidEnvelopeNodes: byClass[AIR_CLASSES.OCEAN_HUMID_ENVELOPE] || [],
      shelfShimmerNodes: byClass[AIR_CLASSES.SHELF_SHIMMER] || [],
      riverMistNodes: byClass[AIR_CLASSES.RIVER_MIST] || [],
      wetlandFogHoldNodes: byClass[AIR_CLASSES.WETLAND_FOG_HOLD] || [],
      mineralAerosolTraceNodes: byClass[AIR_CLASSES.MINERAL_AEROSOL_TRACE] || [],
      aquiferGroundHazeNodes: byClass[AIR_CLASSES.AQUIFER_GROUND_HAZE] || [],
      highlandThinAirNodes: byClass[AIR_CLASSES.HIGHLAND_THIN_AIR] || [],
      dryDustAirNodes: byClass[AIR_CLASSES.DRY_DUST_AIR] || [],
      temperateSurfaceAirNodes: byClass[AIR_CLASSES.TEMPERATE_SURFACE_AIR] || [],

      atmosphereRules: {
        atmosphereFollowsMaterialAndHydrology: true,
        atmosphereMayNotInventLand: true,
        atmosphereMayNotInventWater: true,
        humidityFollowsWaterWetnessAndClay: true,
        vaporFollowsBasinsAquifersAndWetMaterial: true,
        dustFollowsDryCrustAndLowWetness: true,
        aerosolFollowsMineralPressureAndShelfMaterial: true,
        pressureFollowsElevationHumidityAndVapor: true,
        rimEnvelopeFollowsElevationClarityShelfAndWaterReflection: true,
        atmosphereMayNotClaimFinalWeatherTruth: true,
        atmosphereMayNotClaimFinalVisualPass: true
      },

      narrativeDisposition: {
        body: "Landform gave Hearth a body.",
        relief: "Elevation raised that body into pressure and slope.",
        water: "Hydrology placed visible and hidden water.",
        material: "Material gave the body a skin.",
        atmosphere: "Atmosphere now gives the skin a breathing envelope without claiming weather."
      },

      finalAtmosphereTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.atmosphereModel = clonePlain(model);
    state.atmosphereModelReady = true;
    state.diagnostic256Ready = atmosphereNodes.length === NODE_COUNT;

    state.humidityMapReady = humidityMap.length === NODE_COUNT;
    state.vaporMapReady = vaporMap.length === NODE_COUNT;
    state.dustMapReady = dustMap.length === NODE_COUNT;
    state.aerosolMapReady = aerosolMap.length === NODE_COUNT;
    state.pressureMapReady = pressureMap.length === NODE_COUNT;
    state.airClarityMapReady = airClarityMap.length === NODE_COUNT;
    state.rimEnvelopeMapReady = rimEnvelopeMap.length === NODE_COUNT;
    state.lowerHazeMapReady = lowerHazeMap.length === NODE_COUNT;
    state.cloudSeedMapReady = cloudSeedMap.length === NODE_COUNT;
    state.compositeAtmosphereMapReady = compositeAtmosphereMap.length === NODE_COUNT;

    state.atmosphereNodeCount = atmosphereNodes.length;
    state.deepBasinVaporNodeCount = model.deepBasinVaporNodes.length;
    state.oceanHumidEnvelopeNodeCount = model.oceanHumidEnvelopeNodes.length;
    state.shelfShimmerNodeCount = model.shelfShimmerNodes.length;
    state.riverMistNodeCount = model.riverMistNodes.length;
    state.wetlandFogHoldNodeCount = model.wetlandFogHoldNodes.length;
    state.mineralAerosolTraceNodeCount = model.mineralAerosolTraceNodes.length;
    state.aquiferGroundHazeNodeCount = model.aquiferGroundHazeNodes.length;
    state.highlandThinAirNodeCount = model.highlandThinAirNodes.length;
    state.dryDustAirNodeCount = model.dryDustAirNodes.length;
    state.temperateSurfaceAirNodeCount = model.temperateSurfaceAirNodes.length;

    record("ATMOSPHERE_FINGER_MODEL_BUILT", {
      nodeCount: atmosphereNodes.length,
      deepBasinVaporNodeCount: state.deepBasinVaporNodeCount,
      oceanHumidEnvelopeNodeCount: state.oceanHumidEnvelopeNodeCount,
      shelfShimmerNodeCount: state.shelfShimmerNodeCount,
      riverMistNodeCount: state.riverMistNodeCount,
      highlandThinAirNodeCount: state.highlandThinAirNodeCount,
      materialFallbackUsed: material.fallbackUsed,
      hydrologyFallbackUsed: hydrology.fallbackUsed
    });

    return model;
  }

  function hazeScatteringSafe(lowerHaze, aerosol) {
    return clamp(lowerHaze * 0.16 + aerosol * 0.10, 0, 1);
  }

  function airTintHint(airClass) {
    if (airClass === AIR_CLASSES.DEEP_BASIN_VAPOR) return "low-blue-basin-vapor";
    if (airClass === AIR_CLASSES.OCEAN_HUMID_ENVELOPE) return "blue-humid-envelope";
    if (airClass === AIR_CLASSES.SHELF_SHIMMER) return "pale-cyan-gold-shelf-shimmer";
    if (airClass === AIR_CLASSES.RIVER_MIST) return "cool-river-mist";
    if (airClass === AIR_CLASSES.WETLAND_FOG_HOLD) return "green-gray-wetland-fog";
    if (airClass === AIR_CLASSES.MINERAL_AEROSOL_TRACE) return "gold-mineral-aerosol";
    if (airClass === AIR_CLASSES.AQUIFER_GROUND_HAZE) return "dark-ground-haze";
    if (airClass === AIR_CLASSES.HIGHLAND_THIN_AIR) return "clear-highland-rim";
    if (airClass === AIR_CLASSES.DRY_DUST_AIR) return "ochre-dust-air";
    return "temperate-blue-gray-air";
  }

  function buildLightingAtmospherePrepPacket(model) {
    const source = model || state.atmosphereModel || buildAtmosphereModel();

    const packet = {
      packetType: "HEARTH_ATMOSPHERE_TO_LIGHTING_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: LIGHTING_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      humidityMap: clonePlain(source.humidityMap),
      vaporMap: clonePlain(source.vaporMap),
      dustMap: clonePlain(source.dustMap),
      aerosolMap: clonePlain(source.aerosolMap),
      pressureMap: clonePlain(source.pressureMap),
      airClarityMap: clonePlain(source.airClarityMap),
      rimEnvelopeMap: clonePlain(source.rimEnvelopeMap),
      lowerHazeMap: clonePlain(source.lowerHazeMap),
      cloudSeedMap: clonePlain(source.cloudSeedMap),
      atmosphereNodes: clonePlain(source.atmosphereNodes.map((node) => ({
        index: node.index,
        airClass: node.airClass,
        lightingPrep: node.lightingPrep,
        humidity: node.humidity,
        vapor: node.vapor,
        dust: node.dust,
        aerosol: node.aerosol,
        pressure: node.pressure,
        airClarity: node.airClarity,
        rimEnvelope: node.rimEnvelope,
        lowerHaze: node.lowerHaze,
        cloudSeed: node.cloudSeed
      }))),

      lightingRules: {
        hazeScattersLight: true,
        vaporSoftensShadows: true,
        aerosolCreatesGoldTrace: true,
        clarityStrengthensHighlandRim: true,
        shelfShimmerCarriesEdgeLight: true,
        lightingMayNotOverrideAtmosphere: true,
        lightingMayNotClaimFinalVisualPass: true
      },

      readyForLighting: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingAtmospherePrepPacket = clonePlain(packet);
    state.lightingAtmospherePrepPacketReady = true;
    return packet;
  }

  function buildCompositeAtmospherePrepPacket(model) {
    const source = model || state.atmosphereModel || buildAtmosphereModel();

    const packet = {
      packetType: "HEARTH_ATMOSPHERE_TO_COMPOSITE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,

      atmosphereNodes: clonePlain(source.atmosphereNodes),
      airClasses: clonePlain(source.airClasses),
      airClassIndex: clonePlain(source.airClassIndex),
      humidityMap: clonePlain(source.humidityMap),
      vaporMap: clonePlain(source.vaporMap),
      dustMap: clonePlain(source.dustMap),
      aerosolMap: clonePlain(source.aerosolMap),
      pressureMap: clonePlain(source.pressureMap),
      airClarityMap: clonePlain(source.airClarityMap),
      rimEnvelopeMap: clonePlain(source.rimEnvelopeMap),
      lowerHazeMap: clonePlain(source.lowerHazeMap),
      cloudSeedMap: clonePlain(source.cloudSeedMap),
      compositeAtmosphereMap: clonePlain(source.compositeAtmosphereMap),

      compositeLayerContribution: {
        layer: "atmosphere",
        disposition: PLANETARY_DISPOSITION,
        contributesAirEnvelope: true,
        contributesHumidity: true,
        contributesVapor: true,
        contributesDust: true,
        contributesAerosol: true,
        contributesPressure: true,
        contributesRimEnvelope: true,
        contributesLowerHaze: true,
        contributesCloudSeeds: true,
        contributesAirTint: true
      },

      readyForComposite: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeAtmospherePrepPacket = clonePlain(packet);
    state.compositeAtmospherePrepPacketReady = true;
    return packet;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.atmosphereModel || buildAtmosphereModel();

    const packet = {
      packetType: "HEARTH_ATMOSPHERE_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "atmosphere",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      materialPacketConsumed: state.materialPacketObserved || state.materialDependencyObserved,
      materialAtmospherePrepConsumed: state.materialAtmospherePrepObserved,
      materialFallbackUsed: state.materialFallbackUsed,
      hydrologyPacketConsumed: state.hydrologyPacketObserved || state.hydrologyDependencyObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,

      atmosphereModelReady: true,
      humidityMapReady: true,
      vaporMapReady: true,
      dustMapReady: true,
      aerosolMapReady: true,
      pressureMapReady: true,
      airClarityMapReady: true,
      rimEnvelopeMapReady: true,

      inspectSummary: {
        atmosphereNodeCount: state.atmosphereNodeCount,
        deepBasinVaporNodeCount: state.deepBasinVaporNodeCount,
        oceanHumidEnvelopeNodeCount: state.oceanHumidEnvelopeNodeCount,
        shelfShimmerNodeCount: state.shelfShimmerNodeCount,
        riverMistNodeCount: state.riverMistNodeCount,
        wetlandFogHoldNodeCount: state.wetlandFogHoldNodeCount,
        mineralAerosolTraceNodeCount: state.mineralAerosolTraceNodeCount,
        aquiferGroundHazeNodeCount: state.aquiferGroundHazeNodeCount,
        highlandThinAirNodeCount: state.highlandThinAirNodeCount,
        dryDustAirNodeCount: state.dryDustAirNodeCount,
        temperateSurfaceAirNodeCount: state.temperateSurfaceAirNodeCount
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

  function buildAtmospherePacket(options = {}) {
    const model = buildAtmosphereModel(options);

    const lightingPrep = buildLightingAtmospherePrepPacket(model);
    const compositePrep = buildCompositeAtmospherePrepPacket(model);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_ATMOSPHERE_FINGER_PACKET",
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

      sourceMaterialFile: MATERIAL_FILE,
      sourceMaterialContractExpected: MATERIAL_CONTRACT,
      materialDependencyExpected: true,
      materialDependencyObserved: state.materialDependencyObserved,
      materialAuthoritySourceName: state.materialAuthoritySourceName,
      materialPacketObserved: state.materialPacketObserved,
      materialReceiptObserved: state.materialReceiptObserved,
      materialAtmospherePrepObserved: state.materialAtmospherePrepObserved,
      materialNodeCount: state.materialNodeCount,
      material256ScopeObserved: state.material256ScopeObserved,
      materialFallbackUsed: state.materialFallbackUsed,

      sourceHydrologyFile: HYDROLOGY_FILE,
      sourceHydrologyContractExpected: HYDROLOGY_CONTRACT,
      hydrologyDependencyExpected: true,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      hydrologyAuthoritySourceName: state.hydrologyAuthoritySourceName,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      hydrologyReceiptObserved: state.hydrologyReceiptObserved,
      hydrologyNodeCount: state.hydrologyNodeCount,
      hydrology256ScopeObserved: state.hydrology256ScopeObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,

      atmosphereFingerActive: true,
      airEnvelopeAuthorityActive: true,
      atmosphereModelReady: true,
      atmospherePacketReady: true,
      diagnostic256Ready: true,

      humidityMapReady: true,
      vaporMapReady: true,
      dustMapReady: true,
      aerosolMapReady: true,
      pressureMapReady: true,
      airClarityMapReady: true,
      rimEnvelopeMapReady: true,
      lowerHazeMapReady: true,
      cloudSeedMapReady: true,
      compositeAtmosphereMapReady: true,

      atmosphereModel: clonePlain(model),
      lightingAtmospherePrepPacket: clonePlain(lightingPrep),
      compositeAtmospherePrepPacket: clonePlain(compositePrep),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_LIGHTING_FINGER_EXPANSION",
      postgameStatus: "ATMOSPHERE_AIR_ENVELOPE_PACKET_READY_FOR_LIGHTING",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.atmospherePacket = clonePlain(packet);
    state.atmospherePacketReady = true;

    state.firstFailedCoordinate = "WAITING_LIGHTING_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "ATMOSPHERE_AIR_ENVELOPE_PACKET_READY_FOR_LIGHTING";

    record("ATMOSPHERE_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      deepBasinVaporNodeCount: state.deepBasinVaporNodeCount,
      oceanHumidEnvelopeNodeCount: state.oceanHumidEnvelopeNodeCount,
      shelfShimmerNodeCount: state.shelfShimmerNodeCount,
      highlandThinAirNodeCount: state.highlandThinAirNodeCount,
      nextFile: NEXT_FILE,
      atmospherePacketReady: true
    });

    return packet;
  }

  function getAtmosphereModel(options = {}) {
    if (!state.atmosphereModel || options.rebuild === true) {
      return buildAtmosphereModel(options);
    }

    return clonePlain(state.atmosphereModel);
  }

  function getAtmospherePacket(options = {}) {
    if (!state.atmospherePacket || options.rebuild === true) {
      return buildAtmospherePacket(options);
    }

    return clonePlain(state.atmospherePacket);
  }

  function getHumidityMap(options = {}) {
    const model = getAtmosphereModel(options);
    return clonePlain(model.humidityMap || []);
  }

  function getVaporMap(options = {}) {
    const model = getAtmosphereModel(options);
    return clonePlain(model.vaporMap || []);
  }

  function getDustMap(options = {}) {
    const model = getAtmosphereModel(options);
    return clonePlain(model.dustMap || []);
  }

  function getAirClarityMap(options = {}) {
    const model = getAtmosphereModel(options);
    return clonePlain(model.airClarityMap || []);
  }

  function getRimEnvelopeMap(options = {}) {
    const model = getAtmosphereModel(options);
    return clonePlain(model.rimEnvelopeMap || []);
  }

  function getLightingAtmospherePrepPacket(options = {}) {
    if (!state.lightingAtmospherePrepPacket || options.rebuild === true) {
      buildAtmospherePacket(options);
    }

    return clonePlain(state.lightingAtmospherePrepPacket);
  }

  function getCompositeAtmospherePrepPacket(options = {}) {
    if (!state.compositeAtmospherePrepPacket || options.rebuild === true) {
      buildAtmospherePacket(options);
    }

    return clonePlain(state.compositeAtmospherePrepPacket);
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
    const nodes = model && Array.isArray(model.atmosphereNodes) ? model.atmosphereNodes : [];
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

  function sampleAtmosphere(x, y, options = {}) {
    const model = getAtmosphereModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_ATMOSPHERE_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      airClass: node ? node.airClass : "UNKNOWN",
      humidity: node ? node.humidity : 0,
      vapor: node ? node.vapor : 0,
      dust: node ? node.dust : 0,
      aerosol: node ? node.aerosol : 0,
      pressure: node ? node.pressure : 0,
      airClarity: node ? node.airClarity : 0,
      rimEnvelope: node ? node.rimEnvelope : 0,
      finalAtmosphereTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleAtmosphere(x, y, options);
  }

  function rgbaForAir(airClass, alpha) {
    const a = clamp(alpha, 0, 1);

    if (airClass === AIR_CLASSES.DEEP_BASIN_VAPOR) return `rgba(96, 132, 170, ${a})`;
    if (airClass === AIR_CLASSES.OCEAN_HUMID_ENVELOPE) return `rgba(112, 188, 230, ${a})`;
    if (airClass === AIR_CLASSES.SHELF_SHIMMER) return `rgba(202, 224, 214, ${a})`;
    if (airClass === AIR_CLASSES.RIVER_MIST) return `rgba(172, 208, 210, ${a})`;
    if (airClass === AIR_CLASSES.WETLAND_FOG_HOLD) return `rgba(142, 166, 148, ${a})`;
    if (airClass === AIR_CLASSES.MINERAL_AEROSOL_TRACE) return `rgba(222, 202, 130, ${a})`;
    if (airClass === AIR_CLASSES.AQUIFER_GROUND_HAZE) return `rgba(96, 108, 103, ${a})`;
    if (airClass === AIR_CLASSES.HIGHLAND_THIN_AIR) return `rgba(178, 224, 255, ${a})`;
    if (airClass === AIR_CLASSES.DRY_DUST_AIR) return `rgba(198, 160, 104, ${a})`;
    return `rgba(150, 182, 206, ${a})`;
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

    const model = getAtmosphereModel(options);
    const nodes = model.atmosphereNodes || [];

    try {
      context.save();
      context.globalCompositeOperation = options.compositeOperation || "source-over";

      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;
      const opacity = clamp(options.opacity === undefined ? 0.12 : options.opacity, 0, 0.45);

      for (const node of nodes) {
        const alpha = clamp(
          opacity +
          (node.lowerHaze * 0.10) +
          (node.vapor * 0.08) +
          (node.aerosol * 0.06),
          0.02,
          0.48
        );

        context.fillStyle = rgbaForAir(node.airClass, alpha);
        context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);

        if (node.rimEnvelope >= 0.54 || node.airClass === AIR_CLASSES.HIGHLAND_THIN_AIR) {
          context.globalAlpha = clamp(alpha + 0.08, 0, 0.50);
          context.strokeStyle = "rgba(178, 224, 255, 0.32)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.05);
          context.beginPath();
          context.moveTo(node.col * cellW + cellW * 0.10, node.row * cellH + cellH * 0.18);
          context.lineTo(node.col * cellW + cellW * 0.90, node.row * cellH + cellH * 0.82);
          context.stroke();
          context.globalAlpha = 1;
        }

        if (node.airClass === AIR_CLASSES.MINERAL_AEROSOL_TRACE) {
          context.globalAlpha = clamp(alpha + 0.10, 0, 0.52);
          context.fillStyle = "rgba(236, 215, 130, 0.22)";
          context.beginPath();
          context.arc(
            node.col * cellW + cellW * 0.5,
            node.row * cellH + cellH * 0.5,
            Math.max(1, Math.min(cellW, cellH) * 0.18),
            0,
            Math.PI * 2
          );
          context.fill();
          context.globalAlpha = 1;
        }
      }

      context.restore();

      record("ATMOSPHERE_FINGER_DRAW_TO_CANVAS_COMPLETE", {
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

      recordError("ATMOSPHERE_FINGER_DRAW_TO_CANVAS_FAILED", error);

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
    const packet = getAtmospherePacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("ATMOSPHERE_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
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
          : "CANVAS_HUB_REJECTED_ATMOSPHERE_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("ATMOSPHERE_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("ATMOSPHERE_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("ATMOSPHERE_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
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
    const packet = getAtmospherePacket(options);
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
          : "SURFACE_POINTER_REJECTED_ATMOSPHERE_PACKET";

        record("ATMOSPHERE_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("ATMOSPHERE_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
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

      materialFile: MATERIAL_FILE,
      materialContractExpected: MATERIAL_CONTRACT,
      materialDependencyExpected: state.materialDependencyExpected,
      materialDependencyObserved: state.materialDependencyObserved,
      materialAuthoritySourceName: state.materialAuthoritySourceName,
      materialPacketObserved: state.materialPacketObserved,
      materialReceiptObserved: state.materialReceiptObserved,
      materialAtmospherePrepObserved: state.materialAtmospherePrepObserved,
      materialNodeCount: state.materialNodeCount,
      material256ScopeObserved: state.material256ScopeObserved,
      materialFallbackUsed: state.materialFallbackUsed,
      materialReadError: state.materialReadError,

      hydrologyFile: HYDROLOGY_FILE,
      hydrologyContractExpected: HYDROLOGY_CONTRACT,
      hydrologyDependencyExpected: state.hydrologyDependencyExpected,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      hydrologyAuthoritySourceName: state.hydrologyAuthoritySourceName,
      hydrologyPacketObserved: state.hydrologyPacketObserved,
      hydrologyReceiptObserved: state.hydrologyReceiptObserved,
      hydrologyNodeCount: state.hydrologyNodeCount,
      hydrology256ScopeObserved: state.hydrology256ScopeObserved,
      hydrologyFallbackUsed: state.hydrologyFallbackUsed,
      hydrologyReadError: state.hydrologyReadError,

      atmosphereFingerLoaded: state.atmosphereFingerLoaded,
      atmosphereFingerActive: state.atmosphereFingerActive,
      airEnvelopeAuthorityActive: state.airEnvelopeAuthorityActive,
      atmosphereModelReady: state.atmosphereModelReady,
      atmospherePacketReady: state.atmospherePacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      humidityMapReady: state.humidityMapReady,
      vaporMapReady: state.vaporMapReady,
      dustMapReady: state.dustMapReady,
      aerosolMapReady: state.aerosolMapReady,
      pressureMapReady: state.pressureMapReady,
      airClarityMapReady: state.airClarityMapReady,
      rimEnvelopeMapReady: state.rimEnvelopeMapReady,
      lowerHazeMapReady: state.lowerHazeMapReady,
      cloudSeedMapReady: state.cloudSeedMapReady,
      compositeAtmosphereMapReady: state.compositeAtmosphereMapReady,

      lightingAtmospherePrepPacketReady: state.lightingAtmospherePrepPacketReady,
      compositeAtmospherePrepPacketReady: state.compositeAtmospherePrepPacketReady,
      inspectPrepPacketReady: state.inspectPrepPacketReady,

      atmosphereNodeCount: state.atmosphereNodeCount,
      deepBasinVaporNodeCount: state.deepBasinVaporNodeCount,
      oceanHumidEnvelopeNodeCount: state.oceanHumidEnvelopeNodeCount,
      shelfShimmerNodeCount: state.shelfShimmerNodeCount,
      riverMistNodeCount: state.riverMistNodeCount,
      wetlandFogHoldNodeCount: state.wetlandFogHoldNodeCount,
      mineralAerosolTraceNodeCount: state.mineralAerosolTraceNodeCount,
      aquiferGroundHazeNodeCount: state.aquiferGroundHazeNodeCount,
      highlandThinAirNodeCount: state.highlandThinAirNodeCount,
      dryDustAirNodeCount: state.dryDustAirNodeCount,
      temperateSurfaceAirNodeCount: state.temperateSurfaceAirNodeCount,

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
      sampleAtmosphereAvailable: true,
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
      materialEvidence: clonePlain(state.materialEvidence),
      materialPacket: clonePlain(state.materialPacket),
      materialReceipt: clonePlain(state.materialReceipt),
      materialAtmospherePrepPacket: clonePlain(state.materialAtmospherePrepPacket),
      hydrologyEvidence: clonePlain(state.hydrologyEvidence),
      hydrologyPacket: clonePlain(state.hydrologyPacket),
      hydrologyReceipt: clonePlain(state.hydrologyReceipt),
      atmosphereModel: clonePlain(state.atmosphereModel),
      atmospherePacket: clonePlain(state.atmospherePacket),
      lightingAtmospherePrepPacket: clonePlain(state.lightingAtmospherePrepPacket),
      compositeAtmospherePrepPacket: clonePlain(state.compositeAtmospherePrepPacket),
      inspectPrepPacket: clonePlain(state.inspectPrepPacket),
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),
      airClasses: clonePlain(AIR_CLASSES),
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
      "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_RECEIPT",
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
      "MATERIAL_CONSUMPTION",
      line("materialFile", r.materialFile),
      line("materialContractExpected", r.materialContractExpected),
      line("materialDependencyExpected", r.materialDependencyExpected),
      line("materialDependencyObserved", r.materialDependencyObserved),
      line("materialAuthoritySourceName", r.materialAuthoritySourceName),
      line("materialPacketObserved", r.materialPacketObserved),
      line("materialReceiptObserved", r.materialReceiptObserved),
      line("materialAtmospherePrepObserved", r.materialAtmospherePrepObserved),
      line("materialNodeCount", r.materialNodeCount),
      line("material256ScopeObserved", r.material256ScopeObserved),
      line("materialFallbackUsed", r.materialFallbackUsed),
      line("materialReadError", r.materialReadError),
      "",
      "HYDROLOGY_CONSUMPTION",
      line("hydrologyFile", r.hydrologyFile),
      line("hydrologyContractExpected", r.hydrologyContractExpected),
      line("hydrologyDependencyExpected", r.hydrologyDependencyExpected),
      line("hydrologyDependencyObserved", r.hydrologyDependencyObserved),
      line("hydrologyAuthoritySourceName", r.hydrologyAuthoritySourceName),
      line("hydrologyPacketObserved", r.hydrologyPacketObserved),
      line("hydrologyReceiptObserved", r.hydrologyReceiptObserved),
      line("hydrologyNodeCount", r.hydrologyNodeCount),
      line("hydrology256ScopeObserved", r.hydrology256ScopeObserved),
      line("hydrologyFallbackUsed", r.hydrologyFallbackUsed),
      line("hydrologyReadError", r.hydrologyReadError),
      "",
      "ATMOSPHERE_STATUS",
      line("atmosphereFingerLoaded", r.atmosphereFingerLoaded),
      line("atmosphereFingerActive", r.atmosphereFingerActive),
      line("airEnvelopeAuthorityActive", r.airEnvelopeAuthorityActive),
      line("atmosphereModelReady", r.atmosphereModelReady),
      line("atmospherePacketReady", r.atmospherePacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("humidityMapReady", r.humidityMapReady),
      line("vaporMapReady", r.vaporMapReady),
      line("dustMapReady", r.dustMapReady),
      line("aerosolMapReady", r.aerosolMapReady),
      line("pressureMapReady", r.pressureMapReady),
      line("airClarityMapReady", r.airClarityMapReady),
      line("rimEnvelopeMapReady", r.rimEnvelopeMapReady),
      line("lowerHazeMapReady", r.lowerHazeMapReady),
      line("cloudSeedMapReady", r.cloudSeedMapReady),
      line("compositeAtmosphereMapReady", r.compositeAtmosphereMapReady),
      "",
      "PREP_PACKETS",
      line("lightingAtmospherePrepPacketReady", r.lightingAtmospherePrepPacketReady),
      line("compositeAtmospherePrepPacketReady", r.compositeAtmospherePrepPacketReady),
      line("inspectPrepPacketReady", r.inspectPrepPacketReady),
      "",
      "COUNTS",
      line("atmosphereNodeCount", r.atmosphereNodeCount),
      line("deepBasinVaporNodeCount", r.deepBasinVaporNodeCount),
      line("oceanHumidEnvelopeNodeCount", r.oceanHumidEnvelopeNodeCount),
      line("shelfShimmerNodeCount", r.shelfShimmerNodeCount),
      line("riverMistNodeCount", r.riverMistNodeCount),
      line("wetlandFogHoldNodeCount", r.wetlandFogHoldNodeCount),
      line("mineralAerosolTraceNodeCount", r.mineralAerosolTraceNodeCount),
      line("aquiferGroundHazeNodeCount", r.aquiferGroundHazeNodeCount),
      line("highlandThinAirNodeCount", r.highlandThinAirNodeCount),
      line("dryDustAirNodeCount", r.dryDustAirNodeCount),
      line("temperateSurfaceAirNodeCount", r.temperateSurfaceAirNodeCount),
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
      line("atmosphereTruthClaimed", false),
      line("finalAtmosphereTruthClaimed", false),
      line("lightingTruthClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerAtmosphereLoaded", "true");
    setDataset("hearthCanvasFingerAtmosphereContract", CONTRACT);
    setDataset("hearthCanvasFingerAtmosphereReceipt", RECEIPT);
    setDataset("hearthCanvasFingerAtmospherePacket", PACKET);
    setDataset("hearthCanvasFingerAtmosphereFile", FILE);
    setDataset("hearthCanvasFingerAtmosphereWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerAtmosphereDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerAtmosphereDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerAtmosphereExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerAtmosphereReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerAtmosphereMaterialDependencyExpected", String(state.materialDependencyExpected));
    setDataset("hearthCanvasFingerAtmosphereMaterialDependencyObserved", String(state.materialDependencyObserved));
    setDataset("hearthCanvasFingerAtmosphereMaterialSourceName", state.materialAuthoritySourceName);
    setDataset("hearthCanvasFingerAtmosphereMaterialPacketObserved", String(state.materialPacketObserved));
    setDataset("hearthCanvasFingerAtmosphereMaterialReceiptObserved", String(state.materialReceiptObserved));
    setDataset("hearthCanvasFingerAtmosphereMaterialPrepObserved", String(state.materialAtmospherePrepObserved));
    setDataset("hearthCanvasFingerAtmosphereMaterialNodeCount", String(state.materialNodeCount));
    setDataset("hearthCanvasFingerAtmosphereMaterial256ScopeObserved", String(state.material256ScopeObserved));
    setDataset("hearthCanvasFingerAtmosphereMaterialFallbackUsed", String(state.materialFallbackUsed));

    setDataset("hearthCanvasFingerAtmosphereHydrologyDependencyExpected", String(state.hydrologyDependencyExpected));
    setDataset("hearthCanvasFingerAtmosphereHydrologyDependencyObserved", String(state.hydrologyDependencyObserved));
    setDataset("hearthCanvasFingerAtmosphereHydrologySourceName", state.hydrologyAuthoritySourceName);
    setDataset("hearthCanvasFingerAtmosphereHydrologyPacketObserved", String(state.hydrologyPacketObserved));
    setDataset("hearthCanvasFingerAtmosphereHydrologyReceiptObserved", String(state.hydrologyReceiptObserved));
    setDataset("hearthCanvasFingerAtmosphereHydrologyNodeCount", String(state.hydrologyNodeCount));
    setDataset("hearthCanvasFingerAtmosphereHydrology256ScopeObserved", String(state.hydrology256ScopeObserved));
    setDataset("hearthCanvasFingerAtmosphereHydrologyFallbackUsed", String(state.hydrologyFallbackUsed));

    setDataset("hearthCanvasFingerAtmosphereModelReady", String(state.atmosphereModelReady));
    setDataset("hearthCanvasFingerAtmospherePacketReady", String(state.atmospherePacketReady));
    setDataset("hearthCanvasFingerAtmosphereDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerAtmosphereHumidityMapReady", String(state.humidityMapReady));
    setDataset("hearthCanvasFingerAtmosphereVaporMapReady", String(state.vaporMapReady));
    setDataset("hearthCanvasFingerAtmosphereDustMapReady", String(state.dustMapReady));
    setDataset("hearthCanvasFingerAtmosphereAerosolMapReady", String(state.aerosolMapReady));
    setDataset("hearthCanvasFingerAtmospherePressureMapReady", String(state.pressureMapReady));
    setDataset("hearthCanvasFingerAtmosphereAirClarityMapReady", String(state.airClarityMapReady));
    setDataset("hearthCanvasFingerAtmosphereRimEnvelopeMapReady", String(state.rimEnvelopeMapReady));
    setDataset("hearthCanvasFingerAtmosphereLowerHazeMapReady", String(state.lowerHazeMapReady));
    setDataset("hearthCanvasFingerAtmosphereCloudSeedMapReady", String(state.cloudSeedMapReady));
    setDataset("hearthCanvasFingerAtmosphereCompositeMapReady", String(state.compositeAtmosphereMapReady));

    setDataset("hearthCanvasFingerAtmosphereNodeCount", String(state.atmosphereNodeCount));
    setDataset("hearthCanvasFingerAtmosphereDeepBasinVaporNodeCount", String(state.deepBasinVaporNodeCount));
    setDataset("hearthCanvasFingerAtmosphereOceanHumidEnvelopeNodeCount", String(state.oceanHumidEnvelopeNodeCount));
    setDataset("hearthCanvasFingerAtmosphereShelfShimmerNodeCount", String(state.shelfShimmerNodeCount));
    setDataset("hearthCanvasFingerAtmosphereRiverMistNodeCount", String(state.riverMistNodeCount));
    setDataset("hearthCanvasFingerAtmosphereWetlandFogHoldNodeCount", String(state.wetlandFogHoldNodeCount));
    setDataset("hearthCanvasFingerAtmosphereMineralAerosolTraceNodeCount", String(state.mineralAerosolTraceNodeCount));
    setDataset("hearthCanvasFingerAtmosphereAquiferGroundHazeNodeCount", String(state.aquiferGroundHazeNodeCount));
    setDataset("hearthCanvasFingerAtmosphereHighlandThinAirNodeCount", String(state.highlandThinAirNodeCount));
    setDataset("hearthCanvasFingerAtmosphereDryDustAirNodeCount", String(state.dryDustAirNodeCount));
    setDataset("hearthCanvasFingerAtmosphereTemperateSurfaceAirNodeCount", String(state.temperateSurfaceAirNodeCount));

    setDataset("hearthCanvasFingerAtmosphereLightingPrepReady", String(state.lightingAtmospherePrepPacketReady));
    setDataset("hearthCanvasFingerAtmosphereCompositePrepReady", String(state.compositeAtmospherePrepPacketReady));
    setDataset("hearthCanvasFingerAtmosphereInspectPrepReady", String(state.inspectPrepPacketReady));

    setDataset("hearthCanvasFingerAtmosphereSurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerAtmosphereSurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerAtmosphereSurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerAtmosphereSurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerAtmosphereSurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerAtmosphereSurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerAtmosphereHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerAtmosphereHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerAtmosphereHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerAtmosphereHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerAtmosphereHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerAtmosphereHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerAtmosphereFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerAtmosphereRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerAtmospherePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerAtmosphereNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerAtmosphereF13Claimed", "false");
    setDataset("hearthCanvasFingerAtmosphereF21Claimed", "false");
    setDataset("hearthCanvasFingerAtmosphereReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereFinalAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerAtmosphereGeneratedImage", "false");
    setDataset("hearthCanvasFingerAtmosphereGraphicBox", "false");
    setDataset("hearthCanvasFingerAtmosphereWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerAtmosphere = api;
    hearth.canvasAtmosphereFinger = api;
    hearth.canvasFingerAtmosphereReceipt = getReceiptLight();
    hearth.canvasFingerAtmospherePacket = getAtmospherePacket();

    lab.hearthCanvasFingerAtmosphere = api;
    lab.hearthCanvasAtmosphereFinger = api;
    lab.hearthCanvasFingerAtmosphereReceipt = getReceiptLight();
    lab.hearthCanvasFingerAtmospherePacket = getAtmospherePacket();

    root.HEARTH_CANVAS_FINGER_ATMOSPHERE = api;
    root.HEARTH_CANVAS_ATMOSPHERE_FINGER = api;
    root.HEARTH_CANVAS_FINGER_ATMOSPHERE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_ATMOSPHERE_PACKET = getAtmospherePacket();

    root.HEARTH_CANVAS_ATMOSPHERE_HUMIDITY_MAP = getHumidityMap();
    root.HEARTH_CANVAS_ATMOSPHERE_VAPOR_MAP = getVaporMap();
    root.HEARTH_CANVAS_ATMOSPHERE_DUST_MAP = getDustMap();
    root.HEARTH_CANVAS_ATMOSPHERE_AIR_CLARITY_MAP = getAirClarityMap();
    root.HEARTH_CANVAS_ATMOSPHERE_RIM_ENVELOPE_MAP = getRimEnvelopeMap();

    root.HEARTH_ATMOSPHERE_TO_LIGHTING_PREP_PACKET = getLightingAtmospherePrepPacket();
    root.HEARTH_ATMOSPHERE_TO_COMPOSITE_PREP_PACKET = getCompositeAtmospherePrepPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readMaterialEvidence(options);
    readHydrologyEvidence(options);
    buildAtmospherePacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("ATMOSPHERE_FINGER_BOOT_COMPLETE", {
      materialDependencyObserved: state.materialDependencyObserved,
      materialPacketObserved: state.materialPacketObserved,
      materialAtmospherePrepObserved: state.materialAtmospherePrepObserved,
      hydrologyDependencyObserved: state.hydrologyDependencyObserved,
      atmosphereNodeCount: state.atmosphereNodeCount,
      atmospherePacketReady: state.atmospherePacketReady,
      lightingAtmospherePrepPacketReady: state.lightingAtmospherePrepPacketReady,
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
    SURFACE_FILE,
    NEXT_FILE,
    LIGHTING_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,
    MATERIAL_CONTRACT,
    HYDROLOGY_CONTRACT,

    GRID_SIZE,
    NODE_COUNT,
    FINGER_NAME,
    FINGER_ROLE,
    FINGER_ORDER,
    PLANETARY_DISPOSITION_INDEX,
    PLANETARY_DISPOSITION,
    FINGER_SEQUENCE,
    FINGER_FILES,
    AIR_CLASSES,

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

    readMaterialEvidence,
    readHydrologyEvidence,
    buildAtmosphereModel,
    buildAtmospherePacket,
    getAtmosphereModel,
    getAtmospherePacket,
    getHumidityMap,
    getVaporMap,
    getDustMap,
    getAirClarityMap,
    getRimEnvelopeMap,

    buildLightingAtmospherePrepPacket,
    buildCompositeAtmospherePrepPacket,
    buildInspectPrepPacket,

    getLightingAtmospherePrepPacket,
    getCompositeAtmospherePrepPacket,

    sample,
    sampleAtmosphere,
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

    supportsAtmosphereFinger: true,
    supportsAirEnvelopeAuthority: true,
    supportsMaterialPacketConsumption: true,
    supportsHydrologyPacketConsumption: true,
    supportsDiagnostic256AtmosphereScope: true,
    supportsHumidityMap: true,
    supportsVaporMap: true,
    supportsDustMap: true,
    supportsAerosolMap: true,
    supportsPressureMap: true,
    supportsAirClarityMap: true,
    supportsRimEnvelopeMap: true,
    supportsLowerHazeMap: true,
    supportsCloudSeedMap: true,
    supportsLightingAtmospherePrep: true,
    supportsCompositeAtmospherePrep: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoFinalClaims: true,

    ownsAtmosphereFingerIdentity: true,
    ownsAirEnvelopeModel: true,
    ownsAtmosphereExpressionPacket: true,
    ownsLightingAtmospherePrep: true,
    ownsCompositeAtmospherePrep: true,

    ownsLandformTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsFinalAtmosphereTruth: false,
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

    readMaterialEvidence();
    readHydrologyEvidence();
    buildAtmospherePacket();
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
    recordError("ATMOSPHERE_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
