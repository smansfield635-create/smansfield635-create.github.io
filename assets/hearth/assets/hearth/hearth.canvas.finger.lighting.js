// /assets/hearth/hearth.canvas.finger.lighting.js
// HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Lighting / Solar-Shadow Authority.
// Purpose:
// - Establish Lighting as the sixth planetary-disposition expansion finger after Landform, Elevation, Hydrology, Material, and Atmosphere.
// - Consume Atmosphere lighting-prep packets when available.
// - Consume Material lighting-prep packets when available.
// - Consume Elevation relief packets when available.
// - Convert Hearth's relief, material skin, and air envelope into visible light grammar:
//   rim light, basin shadow, shelf gleam, wet reflection, mineral glint, highland exposure,
//   lower haze scattering, shadow softness, cloud-seed diffusion, and composite-ready lighting layers.
// - Preserve Landform as body definition.
// - Preserve Elevation as relief definition.
// - Preserve Hydrology as water-level definition.
// - Preserve Material as surface/mineral definition.
// - Preserve Atmosphere as air-envelope definition.
// - Preserve Surface as the pointer/socket lane when available.
// - Publish lighting, composite-prep, and inspect-prep packets.
// - Continue expansion on the already-instilled finger architecture; do not treat this as reintegration.
// - Never mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Landform, Elevation, Hydrology, Material, Atmosphere, Surface, or any other finger file.
// - Never claim final terrain truth, final hydrology truth, final material truth, final atmosphere truth, final lighting truth, final visual pass, F13, F21, ready text, generated image, GraphicBox, or WebGL.
// Public name rule:
// - Use Hearth as the world/page name.
// - Do not create or preserve any separate fabricated name field.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-lighting-solar-shadow-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const WORLD_NAME = "Hearth";

  const LANDFORM_FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const ATMOSPHERE_CONTRACT = "HEARTH_CANVAS_FINGER_ATMOSPHERE_AIR_ENVELOPE_AUTHORITY_TNT_v1";
  const MATERIAL_CONTRACT = "HEARTH_CANVAS_FINGER_MATERIAL_SURFACE_MINERAL_AUTHORITY_TNT_v1";
  const ELEVATION_CONTRACT = "HEARTH_CANVAS_FINGER_ELEVATION_RELIEF_PRESSURE_AUTHORITY_TNT_v1";

  const GRID_SIZE = 16;
  const NODE_COUNT = 256;

  const FINGER_NAME = "lighting";
  const FINGER_ROLE = "solar-shadow-authority";
  const FINGER_ORDER = 6;
  const PLANETARY_DISPOSITION_INDEX = 6;
  const PLANETARY_DISPOSITION = "PLANETARY_BODY_ILLUMINATED";

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
    lightingTruthClaimed: false,
    finalLightingTruthClaimed: false,
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
    lighting: FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

  const ATMOSPHERE_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerAtmosphere",
    "HEARTH.canvasAtmosphereFinger",
    "HEARTH_CANVAS_FINGER_ATMOSPHERE",
    "HEARTH_CANVAS_ATMOSPHERE_FINGER",
    "HEARTH_CANVAS_FINGER_ATMOSPHERE_PACKET",
    "HEARTH_ATMOSPHERE_TO_LIGHTING_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerAtmosphere",
    "DEXTER_LAB.hearthCanvasAtmosphereFinger"
  ]);

  const MATERIAL_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMaterial",
    "HEARTH.canvasMaterialFinger",
    "HEARTH_CANVAS_FINGER_MATERIAL",
    "HEARTH_CANVAS_MATERIAL_FINGER",
    "HEARTH_CANVAS_FINGER_MATERIAL_PACKET",
    "HEARTH_MATERIAL_TO_LIGHTING_PREP_PACKET",
    "DEXTER_LAB.hearthCanvasFingerMaterial",
    "DEXTER_LAB.hearthCanvasMaterialFinger"
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
    "receiveLightingFingerPacket",
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
    "receiveLightingFingerPacket",
    "receiveLightingPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const LIGHT_CLASSES = Object.freeze({
    BASIN_SHADOW: "basin-shadow",
    OCEAN_GLEAM: "ocean-gleam",
    SHELF_GOLD_RIM: "shelf-gold-rim",
    RIVER_THREAD_LIGHT: "river-thread-light",
    WETLAND_SOFT_DIFFUSION: "wetland-soft-diffusion",
    MINERAL_GLINT: "mineral-glint",
    AQUIFER_LOW_GLOW: "aquifer-low-glow",
    HIGHLAND_RIM_LIGHT: "highland-rim-light",
    DRY_CRUST_HARSH_LIGHT: "dry-crust-harsh-light",
    TEMPERATE_SURFACE_LIGHT: "temperate-surface-light"
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

    atmosphereFile: ATMOSPHERE_FILE,
    atmosphereContractExpected: ATMOSPHERE_CONTRACT,
    atmosphereDependencyExpected: true,
    atmosphereDependencyObserved: false,
    atmosphereAuthoritySourceName: "NONE",
    atmospherePacketObserved: false,
    atmosphereReceiptObserved: false,
    atmosphereLightingPrepObserved: false,
    atmosphereNodeCount: 0,
    atmosphere256ScopeObserved: false,
    atmosphereFallbackUsed: false,
    atmosphereReadError: "",

    materialFile: MATERIAL_FILE,
    materialContractExpected: MATERIAL_CONTRACT,
    materialDependencyExpected: true,
    materialDependencyObserved: false,
    materialAuthoritySourceName: "NONE",
    materialPacketObserved: false,
    materialReceiptObserved: false,
    materialLightingPrepObserved: false,
    materialNodeCount: 0,
    material256ScopeObserved: false,
    materialFallbackUsed: false,
    materialReadError: "",

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

    lightingFingerLoaded: true,
    lightingFingerActive: true,
    solarShadowAuthorityActive: true,
    lightingModelReady: false,
    lightingPacketReady: false,
    diagnostic256Ready: false,

    directLightMapReady: false,
    shadowMapReady: false,
    rimLightMapReady: false,
    diffuseLightMapReady: false,
    specularLightMapReady: false,
    hazeScatterMapReady: false,
    wetReflectionMapReady: false,
    mineralGlintMapReady: false,
    cloudDiffusionMapReady: false,
    compositeLightingMapReady: false,

    compositeLightingPrepPacketReady: false,
    inspectPrepPacketReady: false,

    lightingNodeCount: 0,
    basinShadowNodeCount: 0,
    oceanGleamNodeCount: 0,
    shelfGoldRimNodeCount: 0,
    riverThreadLightNodeCount: 0,
    wetlandSoftDiffusionNodeCount: 0,
    mineralGlintNodeCount: 0,
    aquiferLowGlowNodeCount: 0,
    highlandRimLightNodeCount: 0,
    dryCrustHarshLightNodeCount: 0,
    temperateSurfaceLightNodeCount: 0,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",
    lastRegistrationResponse: null,

    firstFailedCoordinate: "LIGHTING_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LIGHTING_FINGER_WAITING_BOOT",

    atmosphereEvidence: null,
    atmospherePacket: null,
    atmosphereReceipt: null,
    atmosphereLightingPrepPacket: null,
    atmosphereNodes: [],

    materialEvidence: null,
    materialPacket: null,
    materialReceipt: null,
    materialLightingPrepPacket: null,
    materialNodes: [],

    elevationEvidence: null,
    elevationPacket: null,
    elevationReceipt: null,
    elevationNodes: [],

    lightingModel: null,
    lightingPacket: null,
    compositeLightingPrepPacket: null,
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
      event: safeString(event, "LIGHTING_FINGER_EVENT"),
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
      code: safeString(code, "LIGHTING_FINGER_ERROR"),
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
        recordError("LIGHTING_FINGER_AUTHORITY_READ_METHOD_FAILED", error, {
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
      Array.isArray(value.atmosphereNodes) ||
      Array.isArray(value.materialNodes) ||
      Array.isArray(value.elevationNodes) ||
      Array.isArray(value.lightingPrepNodes) ||
      Array.isArray(value.rimEnvelopeMap) ||
      Array.isArray(value.hazeScatterMap) ||
      Array.isArray(value.materialRoughnessMap) ||
      Array.isArray(value.exposedStoneMap) ||
      Array.isArray(value.heightfieldMap)
    ) {
      return value;
    }

    return null;
  }

  function buildFallbackAtmosphereNodes() {
    const nodes = [];

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = (col + 0.5) / GRID_SIZE;
      const y = (row + 0.5) / GRID_SIZE;

      const basin = clamp(gaussian2(x, y, 0.50, 0.56, 0.20, 0.22, 0.82), 0, 1);
      const shelf = clamp(gaussian2(x, y, 0.58, 0.77, 0.30, 0.12, 0.72), 0, 1);
      const ridge = clamp(gaussian2(x, y, 0.34, 0.30, 0.14, 0.16, 0.72) + gaussian2(x, y, 0.72, 0.34, 0.16, 0.16, 0.52), 0, 1);

      const elevation = clamp(0.44 + ridge * 0.26 - basin * 0.18 + (hashNoise(index, 3, 19) - 0.5) * 0.08, 0, 1);
      const humidity = clamp(basin * 0.30 + shelf * 0.22 + (1 - elevation) * 0.12, 0, 1);
      const vapor = clamp(humidity * 0.58 + basin * 0.14, 0, 1);
      const dust = clamp((1 - humidity) * 0.18 + elevation * 0.08, 0, 1);
      const aerosol = clamp(shelf * 0.20 + hashNoise(index, 4, 23) * 0.12, 0, 1);
      const pressure = clamp((1 - elevation) * 0.36 + humidity * 0.20, 0, 1);
      const clarity = clamp(1 - vapor * 0.22 - dust * 0.16 - aerosol * 0.08 + elevation * 0.12, 0, 1);
      const rim = clamp(elevation * 0.25 + shelf * 0.18 + clarity * 0.12, 0, 1);
      const lowerHaze = clamp(pressure * 0.24 + vapor * 0.22 + aerosol * 0.10, 0, 1);
      const cloudSeed = clamp(humidity * 0.34 + vapor * 0.22 - elevation * 0.08, 0, 1);

      let airClass = "temperate-surface-air";
      if (basin > 0.52 && vapor > 0.32) airClass = "deep-basin-vapor";
      else if (humidity > 0.46) airClass = "ocean-humid-envelope";
      else if (shelf > 0.48) airClass = "shelf-shimmer";
      else if (aerosol > 0.40) airClass = "mineral-aerosol-trace";
      else if (elevation > 0.68) airClass = "highland-thin-air";
      else if (dust > 0.32) airClass = "dry-dust-air";

      nodes.push({
        index,
        id: `HEARTH_ATMOSPHERE_NODE_${String(index + 1).padStart(3, "0")}`,
        row,
        col,
        x: round(x),
        y: round(y),
        worldName: WORLD_NAME,
        airClass,
        elevation: round(elevation),
        humidity: round(humidity),
        vapor: round(vapor),
        dust: round(dust),
        aerosol: round(aerosol),
        pressure: round(pressure),
        airClarity: round(clarity),
        rimEnvelope: round(rim),
        lowerHaze: round(lowerHaze),
        cloudSeed: round(cloudSeed),
        lightingPrep: {
          hazeScattering: round(clamp(lowerHaze * 0.32 + aerosol * 0.18, 0, 1)),
          rimLightCarrier: round(rim),
          atmosphericAbsorption: round(clamp(vapor * 0.22 + dust * 0.12 + humidity * 0.10, 0, 1)),
          shadowSoftening: round(clamp(vapor * 0.18 + lowerHaze * 0.16 + aerosol * 0.10, 0, 1)),
          skyTintHint: airClass
        },
        finalAtmosphereTruthClaim: false,
        finalVisualClaim: false
      });
    }

    return nodes;
  }

  function buildFallbackMaterialNodes() {
    const atmosphereNodes = state.atmosphereNodes.length ? state.atmosphereNodes : buildFallbackAtmosphereNodes();

    return atmosphereNodes.map((a, index) => {
      const stone = clamp(a.elevation * 0.34 + hashNoise(index, 9, 31) * 0.14, 0, 1);
      const wetness = clamp(a.humidity * 0.42 + a.vapor * 0.28, 0, 1);
      const mineral = clamp(a.aerosol * 0.44 + hashNoise(index, 5, 37) * 0.16, 0, 1);
      const shelf = a.airClass === "shelf-shimmer" ? 0.62 : clamp(a.rimEnvelope * 0.18, 0, 1);

      let materialClass = "weathered-ground";
      if (a.airClass === "deep-basin-vapor") materialClass = "deep-basin-silt";
      else if (a.airClass === "ocean-humid-envelope") materialClass = "oceanic-dark-stone";
      else if (a.airClass === "shelf-shimmer") materialClass = "shelf-mineral-sand";
      else if (a.airClass === "mineral-aerosol-trace") materialClass = "spring-mineral-vein";
      else if (a.airClass === "highland-thin-air") materialClass = "exposed-highland-stone";
      else if (a.airClass === "dry-dust-air") materialClass = "dry-crust";

      return {
        index,
        id: `HEARTH_MATERIAL_NODE_${String(index + 1).padStart(3, "0")}`,
        row: a.row,
        col: a.col,
        x: a.x,
        y: a.y,
        worldName: WORLD_NAME,
        materialClass,
        colorHint: materialClass,
        elevation: a.elevation,
        slope: clamp(stone * 0.22 + a.rimEnvelope * 0.12, 0, 1),
        waterPresence: clamp(a.humidity * 0.30 + a.vapor * 0.20, 0, 1),
        waterDepth: clamp(a.vapor * 0.18, 0, 1),
        aquiferPressure: clamp(wetness * 0.45, 0, 1),
        wetnessMaterial: round(wetness),
        sedimentMaterial: round(clamp(a.lowerHaze * 0.22, 0, 1)),
        mineralPressure: round(mineral),
        stoneExposure: round(stone),
        soilPotential: round(clamp((1 - stone) * 0.24 + wetness * 0.20, 0, 1)),
        shorelineMaterial: round(shelf),
        roughness: round(clamp(stone * 0.34 + (1 - wetness) * 0.12, 0, 1)),
        lightingPrep: {
          lightAbsorption: round(clamp(wetness * 0.20 + a.vapor * 0.12, 0, 1)),
          highlightPotential: round(clamp(mineral * 0.26 + shelf * 0.20 + stone * 0.12, 0, 1)),
          surfaceRoughness: round(clamp(stone * 0.34 + (1 - wetness) * 0.12, 0, 1)),
          wetReflectiveMaterial: round(clamp(wetness * 0.44 + shelf * 0.10, 0, 1)),
          mineralGlint: round(clamp(mineral * 0.42 + shelf * 0.12, 0, 1))
        },
        finalMaterialTruthClaim: false,
        finalVisualClaim: false
      };
    });
  }

  function buildFallbackElevationNodes() {
    const materialNodes = state.materialNodes.length ? state.materialNodes : buildFallbackMaterialNodes();

    return materialNodes.map((m, index) => ({
      index,
      id: `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`,
      row: m.row,
      col: m.col,
      x: m.x,
      y: m.y,
      worldName: WORLD_NAME,
      elevation: m.elevation,
      normalizedHeight: m.elevation,
      slope: m.slope,
      basinScore: clamp(1 - m.elevation + m.waterDepth * 0.22, 0, 1),
      shelfScore: m.shorelineMaterial,
      upliftScore: clamp(m.elevation + m.stoneExposure * 0.18, 0, 1),
      riftScore: clamp(m.mineralPressure * 0.22, 0, 1),
      landScore: clamp(m.elevation + 0.12, 0, 1),
      reliefClass: m.elevation > 0.66 ? "HIGHLAND_RELIEF" : m.elevation < 0.38 ? "BASIN_RELIEF" : "MID_RELIEF",
      finalElevationTruthClaim: false,
      finalVisualClaim: false
    }));
  }

  function normalizeAtmosphereNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const prep = isObject(raw.lightingPrep) ? raw.lightingPrep : {};

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_ATMOSPHERE_NODE_${String(index + 1).padStart(3, "0")}`),
      row: getFirstNumber(raw, ["row"], row),
      col: getFirstNumber(raw, ["col"], col),
      x: round(clamp(getFirstNumber(raw, ["x", "u", "nx"], (col + 0.5) / GRID_SIZE), 0, 1)),
      y: round(clamp(getFirstNumber(raw, ["y", "v", "ny"], (row + 0.5) / GRID_SIZE), 0, 1)),
      worldName: WORLD_NAME,

      airClass: getFirstString(raw, ["airClass", "class"], "temperate-surface-air"),
      elevation: round(clamp(getFirstNumber(raw, ["elevation"], 0.44), 0, 1)),
      humidity: round(clamp(getFirstNumber(raw, ["humidity"], 0), 0, 1)),
      vapor: round(clamp(getFirstNumber(raw, ["vapor"], 0), 0, 1)),
      dust: round(clamp(getFirstNumber(raw, ["dust"], 0), 0, 1)),
      aerosol: round(clamp(getFirstNumber(raw, ["aerosol"], 0), 0, 1)),
      pressure: round(clamp(getFirstNumber(raw, ["pressure"], 0), 0, 1)),
      airClarity: round(clamp(getFirstNumber(raw, ["airClarity"], 0.5), 0, 1)),
      rimEnvelope: round(clamp(getFirstNumber(raw, ["rimEnvelope"], 0), 0, 1)),
      lowerHaze: round(clamp(getFirstNumber(raw, ["lowerHaze"], 0), 0, 1)),
      cloudSeed: round(clamp(getFirstNumber(raw, ["cloudSeed"], 0), 0, 1)),
      lightingPrep: {
        hazeScattering: round(clamp(getFirstNumber(prep, ["hazeScattering"], 0), 0, 1)),
        rimLightCarrier: round(clamp(getFirstNumber(prep, ["rimLightCarrier"], getFirstNumber(raw, ["rimEnvelope"], 0)), 0, 1)),
        atmosphericAbsorption: round(clamp(getFirstNumber(prep, ["atmosphericAbsorption"], 0), 0, 1)),
        shadowSoftening: round(clamp(getFirstNumber(prep, ["shadowSoftening"], 0), 0, 1)),
        skyTintHint: getFirstString(prep, ["skyTintHint"], getFirstString(raw, ["airClass"], "temperate-surface-air"))
      },
      finalAtmosphereTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeMaterialNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const prep = isObject(raw.lightingPrep) ? raw.lightingPrep : {};

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
      wetnessMaterial: round(clamp(getFirstNumber(raw, ["wetnessMaterial", "wetness"], 0), 0, 1)),
      sedimentMaterial: round(clamp(getFirstNumber(raw, ["sedimentMaterial", "sediment"], 0), 0, 1)),
      mineralPressure: round(clamp(getFirstNumber(raw, ["mineralPressure", "mineral"], 0), 0, 1)),
      stoneExposure: round(clamp(getFirstNumber(raw, ["stoneExposure", "baseRock", "exposedStone"], 0), 0, 1)),
      soilPotential: round(clamp(getFirstNumber(raw, ["soilPotential", "soil"], 0), 0, 1)),
      shorelineMaterial: round(clamp(getFirstNumber(raw, ["shorelineMaterial", "shoreline"], 0), 0, 1)),
      roughness: round(clamp(getFirstNumber(raw, ["roughness"], 0), 0, 1)),
      lightingPrep: {
        lightAbsorption: round(clamp(getFirstNumber(prep, ["lightAbsorption"], 0), 0, 1)),
        highlightPotential: round(clamp(getFirstNumber(prep, ["highlightPotential"], 0), 0, 1)),
        surfaceRoughness: round(clamp(getFirstNumber(prep, ["surfaceRoughness"], getFirstNumber(raw, ["roughness"], 0)), 0, 1)),
        wetReflectiveMaterial: round(clamp(getFirstNumber(prep, ["wetReflectiveMaterial"], getFirstNumber(raw, ["wetnessMaterial", "wetness"], 0)), 0, 1)),
        mineralGlint: round(clamp(getFirstNumber(prep, ["mineralGlint"], getFirstNumber(raw, ["mineralPressure", "mineral"], 0)), 0, 1))
      },
      finalMaterialTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function normalizeElevationNode(raw, index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    return {
      index,
      id: getFirstString(raw, ["id", "nodeId", "key"], `HEARTH_ELEVATION_NODE_${String(index + 1).padStart(3, "0")}`),
      row: getFirstNumber(raw, ["row"], row),
      col: getFirstNumber(raw, ["col"], col),
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

  function extractAtmosphereNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.atmosphereNodes,
      packet.lightingPrepNodes,
      packet.atmosphereModel && packet.atmosphereModel.atmosphereNodes,
      packet.lightingAtmospherePrepPacket && packet.lightingAtmospherePrepPacket.atmosphereNodes,
      packet.compositeAtmospherePrepPacket && packet.compositeAtmospherePrepPacket.atmosphereNodes,
      packet.original && packet.original.atmosphereNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    const rimMap = Array.isArray(packet.rimEnvelopeMap) ? packet.rimEnvelopeMap : null;
    const hazeMap = Array.isArray(packet.lowerHazeMap) ? packet.lowerHazeMap : null;
    const clarityMap = Array.isArray(packet.airClarityMap) ? packet.airClarityMap : null;

    if (rimMap && rimMap.length === NODE_COUNT) {
      return rimMap.map((rimEnvelope, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;

        return {
          index,
          row,
          col,
          x: (col + 0.5) / GRID_SIZE,
          y: (row + 0.5) / GRID_SIZE,
          airClass: "temperate-surface-air",
          rimEnvelope,
          lowerHaze: hazeMap ? hazeMap[index] : 0,
          airClarity: clarityMap ? clarityMap[index] : 0.5,
          lightingPrep: {
            rimLightCarrier: rimEnvelope,
            hazeScattering: hazeMap ? hazeMap[index] * 0.32 : 0,
            atmosphericAbsorption: hazeMap ? hazeMap[index] * 0.18 : 0,
            shadowSoftening: hazeMap ? hazeMap[index] * 0.20 : 0
          }
        };
      });
    }

    return [];
  }

  function extractMaterialNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.materialNodes,
      packet.lightingPrepNodes,
      packet.materialModel && packet.materialModel.materialNodes,
      packet.lightingMaterialPrepPacket && packet.lightingMaterialPrepPacket.materialNodes,
      packet.compositeMaterialPrepPacket && packet.compositeMaterialPrepPacket.materialNodes,
      packet.original && packet.original.materialNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    return [];
  }

  function extractElevationNodes(packet) {
    if (!isObject(packet)) return [];

    const candidates = [
      packet.elevationNodes,
      packet.nodes,
      packet.elevationModel && packet.elevationModel.elevationNodes,
      packet.compositeReliefPrepPacket && packet.compositeReliefPrepPacket.elevationNodes,
      packet.original && packet.original.elevationNodes
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
    }

    return [];
  }

  function readAtmosphereEvidence(options = {}) {
    const found = findSource(ATMOSPHERE_SOURCE_NAMES);

    state.atmosphereDependencyObserved = Boolean(found.source);
    state.atmosphereAuthoritySourceName = found.sourceName;
    state.atmosphereReadError = "";

    let packet = null;
    let receipt = null;
    let lightingPrep = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getLightingAtmospherePrepPacket",
          "getAtmospherePacket",
          "getAtmosphereModel",
          "getCompositeAtmospherePrepPacket",
          "getPacket",
          "read",
          "getReceipt",
          "getReceiptLight",
          "getState"
        ]);

        packet = extractPacketFrom(packetCandidate, [
          "lightingAtmospherePrepPacket",
          "atmospherePacket",
          "packet",
          "atmosphereModel",
          "compositeAtmospherePrepPacket"
        ]);

        if (packetCandidate && packetCandidate.packetType === "HEARTH_ATMOSPHERE_TO_LIGHTING_PREP_PACKET") {
          lightingPrep = packetCandidate;
        } else if (packet && packet.packetType === "HEARTH_ATMOSPHERE_TO_LIGHTING_PREP_PACKET") {
          lightingPrep = packet;
        } else if (packet && isObject(packet.lightingAtmospherePrepPacket)) {
          lightingPrep = packet.lightingAtmospherePrepPacket;
        }

        const receiptCandidate = callFirstObject(found.source, [
          "getReceiptLight",
          "getReceipt",
          "read",
          "getState"
        ]);

        receipt = extractReceiptFrom(receiptCandidate) || extractReceiptFrom(packetCandidate);
      } catch (error) {
        state.atmosphereReadError = error && error.message ? String(error.message) : String(error);
        recordError("LIGHTING_FINGER_ATMOSPHERE_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.atmospherePacket && isObject(options.atmospherePacket)) {
      packet = options.atmospherePacket;
      state.atmosphereDependencyObserved = true;
      state.atmosphereAuthoritySourceName = "OPTIONS_ATMOSPHERE_PACKET";
    }

    if (options.lightingAtmospherePrepPacket && isObject(options.lightingAtmospherePrepPacket)) {
      lightingPrep = options.lightingAtmospherePrepPacket;
      state.atmosphereDependencyObserved = true;
      state.atmosphereAuthoritySourceName = "OPTIONS_LIGHTING_ATMOSPHERE_PREP_PACKET";
    }

    const packetForNodes = lightingPrep || packet;
    const rawNodes = extractAtmosphereNodes(packetForNodes);
    let nodes = [];

    if (rawNodes.length) {
      nodes = rawNodes.slice(0, NODE_COUNT).map((entry, index) => normalizeAtmosphereNode(entry, index));
    }

    if (nodes.length < NODE_COUNT) {
      nodes = buildFallbackAtmosphereNodes();
    }

    state.atmospherePacketObserved = Boolean(packet);
    state.atmosphereReceiptObserved = Boolean(receipt);
    state.atmosphereLightingPrepObserved = Boolean(lightingPrep);
    state.atmosphereNodeCount = nodes.length;
    state.atmosphere256ScopeObserved = nodes.length === NODE_COUNT;
    state.atmosphereFallbackUsed = !packetForNodes || rawNodes.length === 0;

    state.atmospherePacket = clonePlain(packet);
    state.atmosphereReceipt = clonePlain(receipt);
    state.atmosphereLightingPrepPacket = clonePlain(lightingPrep);
    state.atmosphereNodes = clonePlain(nodes);

    const evidence = {
      observed: state.atmosphereDependencyObserved,
      sourceName: state.atmosphereAuthoritySourceName,
      packetObserved: state.atmospherePacketObserved,
      receiptObserved: state.atmosphereReceiptObserved,
      lightingPrepObserved: state.atmosphereLightingPrepObserved,
      nodeCount: state.atmosphereNodeCount,
      diagnostic256Ready: state.atmosphere256ScopeObserved,
      fallbackUsed: state.atmosphereFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      lightingPrepPacket: clonePlain(lightingPrep),
      nodes: clonePlain(nodes)
    };

    state.atmosphereEvidence = clonePlain(evidence);

    record("LIGHTING_FINGER_ATMOSPHERE_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      lightingPrepObserved: evidence.lightingPrepObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function readMaterialEvidence(options = {}) {
    const found = findSource(MATERIAL_SOURCE_NAMES);

    state.materialDependencyObserved = Boolean(found.source);
    state.materialAuthoritySourceName = found.sourceName;
    state.materialReadError = "";

    let packet = null;
    let receipt = null;
    let lightingPrep = null;

    if (found.source) {
      try {
        const packetCandidate = callFirstObject(found.source, [
          "getLightingMaterialPrepPacket",
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
          "lightingMaterialPrepPacket",
          "materialPacket",
          "packet",
          "materialModel",
          "compositeMaterialPrepPacket"
        ]);

        if (packetCandidate && packetCandidate.packetType === "HEARTH_MATERIAL_TO_LIGHTING_PREP_PACKET") {
          lightingPrep = packetCandidate;
        } else if (packet && packet.packetType === "HEARTH_MATERIAL_TO_LIGHTING_PREP_PACKET") {
          lightingPrep = packet;
        } else if (packet && isObject(packet.lightingMaterialPrepPacket)) {
          lightingPrep = packet.lightingMaterialPrepPacket;
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
        recordError("LIGHTING_FINGER_MATERIAL_READ_FAILED", error, {
          sourceName: found.sourceName
        });
      }
    }

    if (options.materialPacket && isObject(options.materialPacket)) {
      packet = options.materialPacket;
      state.materialDependencyObserved = true;
      state.materialAuthoritySourceName = "OPTIONS_MATERIAL_PACKET";
    }

    if (options.lightingMaterialPrepPacket && isObject(options.lightingMaterialPrepPacket)) {
      lightingPrep = options.lightingMaterialPrepPacket;
      state.materialDependencyObserved = true;
      state.materialAuthoritySourceName = "OPTIONS_LIGHTING_MATERIAL_PREP_PACKET";
    }

    const packetForNodes = lightingPrep || packet;
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
    state.materialLightingPrepObserved = Boolean(lightingPrep);
    state.materialNodeCount = nodes.length;
    state.material256ScopeObserved = nodes.length === NODE_COUNT;
    state.materialFallbackUsed = !packetForNodes || rawNodes.length === 0;

    state.materialPacket = clonePlain(packet);
    state.materialReceipt = clonePlain(receipt);
    state.materialLightingPrepPacket = clonePlain(lightingPrep);
    state.materialNodes = clonePlain(nodes);

    const evidence = {
      observed: state.materialDependencyObserved,
      sourceName: state.materialAuthoritySourceName,
      packetObserved: state.materialPacketObserved,
      receiptObserved: state.materialReceiptObserved,
      lightingPrepObserved: state.materialLightingPrepObserved,
      nodeCount: state.materialNodeCount,
      diagnostic256Ready: state.material256ScopeObserved,
      fallbackUsed: state.materialFallbackUsed,
      packet: clonePlain(packet),
      receipt: clonePlain(receipt),
      lightingPrepPacket: clonePlain(lightingPrep),
      nodes: clonePlain(nodes)
    };

    state.materialEvidence = clonePlain(evidence);

    record("LIGHTING_FINGER_MATERIAL_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      lightingPrepObserved: evidence.lightingPrepObserved,
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
          "compositeReliefPrepPacket"
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
        recordError("LIGHTING_FINGER_ELEVATION_READ_FAILED", error, {
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
      nodes = buildFallbackElevationNodes();
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

    record("LIGHTING_FINGER_ELEVATION_EVIDENCE_READ", {
      observed: evidence.observed,
      sourceName: evidence.sourceName,
      packetObserved: evidence.packetObserved,
      nodeCount: evidence.nodeCount,
      fallbackUsed: evidence.fallbackUsed
    });

    return evidence;
  }

  function lightClassFor(atmo, material, elevation, directLight, shadow, rimLight, specular, hazeScatter) {
    const airClass = atmo.airClass;
    const materialClass = material.materialClass;

    if (shadow >= 0.58 || materialClass === "deep-basin-silt") return LIGHT_CLASSES.BASIN_SHADOW;
    if (materialClass === "oceanic-dark-stone" && specular >= 0.38) return LIGHT_CLASSES.OCEAN_GLEAM;
    if (materialClass === "shelf-mineral-sand" || airClass === "shelf-shimmer") return LIGHT_CLASSES.SHELF_GOLD_RIM;
    if (materialClass === "river-worn-stone") return LIGHT_CLASSES.RIVER_THREAD_LIGHT;
    if (materialClass === "wetland-clay" || airClass === "wetland-fog-hold") return LIGHT_CLASSES.WETLAND_SOFT_DIFFUSION;
    if (materialClass === "spring-mineral-vein" || specular >= 0.58) return LIGHT_CLASSES.MINERAL_GLINT;
    if (materialClass === "aquifer-dark-soil") return LIGHT_CLASSES.AQUIFER_LOW_GLOW;
    if (elevation.elevation >= 0.66 || rimLight >= 0.56) return LIGHT_CLASSES.HIGHLAND_RIM_LIGHT;
    if (materialClass === "dry-crust" || directLight >= 0.66 && hazeScatter < 0.18) return LIGHT_CLASSES.DRY_CRUST_HARSH_LIGHT;
    return LIGHT_CLASSES.TEMPERATE_SURFACE_LIGHT;
  }

  function lightStory(lightClass) {
    if (lightClass === LIGHT_CLASSES.BASIN_SHADOW) {
      return "The low body holds shadow first, letting the basin remain deep even when the surface is visible.";
    }

    if (lightClass === LIGHT_CLASSES.OCEAN_GLEAM) {
      return "Water and dark stone catch controlled gleam without becoming final ocean truth.";
    }

    if (lightClass === LIGHT_CLASSES.SHELF_GOLD_RIM) {
      return "The shelf takes a gold rim where mineral edge, shallow water, and atmosphere meet.";
    }

    if (lightClass === LIGHT_CLASSES.RIVER_THREAD_LIGHT) {
      return "The water-worn corridor becomes a narrow light thread across the body.";
    }

    if (lightClass === LIGHT_CLASSES.WETLAND_SOFT_DIFFUSION) {
      return "Wet ground and low air soften the light until the surface feels held rather than exposed.";
    }

    if (lightClass === LIGHT_CLASSES.MINERAL_GLINT) {
      return "Mineral pressure returns as a small glint, giving the old seam a readable signal.";
    }

    if (lightClass === LIGHT_CLASSES.AQUIFER_LOW_GLOW) {
      return "Hidden water gives the darker ground a restrained under-glow.";
    }

    if (lightClass === LIGHT_CLASSES.HIGHLAND_RIM_LIGHT) {
      return "The raised body catches rim light first, defining the high edge without claiming final terrain.";
    }

    if (lightClass === LIGHT_CLASSES.DRY_CRUST_HARSH_LIGHT) {
      return "Dry crust receives harder light and a sharper shadow response.";
    }

    return "Temperate light bridges stone, water, air, and shadow into a readable planet surface.";
  }

  function lightTintHint(lightClass) {
    if (lightClass === LIGHT_CLASSES.BASIN_SHADOW) return "cool-basin-shadow";
    if (lightClass === LIGHT_CLASSES.OCEAN_GLEAM) return "blue-white-ocean-gleam";
    if (lightClass === LIGHT_CLASSES.SHELF_GOLD_RIM) return "gold-cyan-shelf-rim";
    if (lightClass === LIGHT_CLASSES.RIVER_THREAD_LIGHT) return "silver-river-thread";
    if (lightClass === LIGHT_CLASSES.WETLAND_SOFT_DIFFUSION) return "green-gray-soft-diffusion";
    if (lightClass === LIGHT_CLASSES.MINERAL_GLINT) return "bright-mineral-glint";
    if (lightClass === LIGHT_CLASSES.AQUIFER_LOW_GLOW) return "dark-ground-under-glow";
    if (lightClass === LIGHT_CLASSES.HIGHLAND_RIM_LIGHT) return "pale-highland-rim";
    if (lightClass === LIGHT_CLASSES.DRY_CRUST_HARSH_LIGHT) return "ochre-hard-light";
    return "balanced-surface-light";
  }

  function buildLightingModel(options = {}) {
    const atmosphere = readAtmosphereEvidence(options);
    const material = readMaterialEvidence(options);
    const elevation = readElevationEvidence(options);

    const atmosphereNodes = atmosphere.nodes.length === NODE_COUNT ? atmosphere.nodes : buildFallbackAtmosphereNodes();
    const materialNodes = material.nodes.length === NODE_COUNT ? material.nodes : buildFallbackMaterialNodes();
    const elevationNodes = elevation.nodes.length === NODE_COUNT ? elevation.nodes : buildFallbackElevationNodes();

    const lightVector = {
      x: -0.48,
      y: -0.62,
      z: 0.62
    };

    const lightingNodes = atmosphereNodes.map((a, index) => {
      const m = materialNodes[index] || {};
      const e = elevationNodes[index] || {};
      const x = a.x;
      const y = a.y;

      const centerDx = x - 0.5;
      const centerDy = y - 0.52;
      const radial = clamp(Math.sqrt(centerDx * centerDx + centerDy * centerDy) / 0.72, 0, 1);
      const globeNormalZ = clamp(1 - radial * radial, 0, 1);

      const directional = clamp(
        (-(centerDx) * lightVector.x) +
        (-(centerDy) * lightVector.y) +
        (globeNormalZ * lightVector.z),
        0,
        1
      );

      const reliefExposure = clamp(
        (e.elevation * 0.24) +
        (e.slope * 0.20) +
        (e.upliftScore * 0.16) -
        (e.basinScore * 0.12),
        0,
        1
      );

      const atmosphericSoftening = clamp(
        (a.vapor * 0.18) +
        (a.lowerHaze * 0.22) +
        (a.humidity * 0.12) +
        (a.aerosol * 0.08),
        0,
        1
      );

      const materialAbsorption = clamp(
        getFirstNumber(m.lightingPrep, ["lightAbsorption"], 0) +
        (m.wetnessMaterial * 0.10) +
        (m.waterDepth * 0.10),
        0,
        1
      );

      const directLight = clamp(
        (directional * 0.52) +
        (reliefExposure * 0.24) +
        (a.airClarity * 0.16) -
        (atmosphericSoftening * 0.18) -
        (materialAbsorption * 0.12),
        0,
        1
      );

      const shadow = clamp(
        ((1 - directional) * 0.38) +
        (e.basinScore * 0.24) +
        (materialAbsorption * 0.16) +
        (a.lowerHaze * 0.08) -
        (a.rimEnvelope * 0.06),
        0,
        1
      );

      const rimLight = clamp(
        (a.rimEnvelope * 0.34) +
        (radial * 0.20) +
        (e.elevation * 0.16) +
        (a.airClarity * 0.12),
        0,
        1
      );

      const diffuseLight = clamp(
        (atmosphericSoftening * 0.34) +
        (a.cloudSeed * 0.18) +
        (a.humidity * 0.12) +
        (directional * 0.18),
        0,
        1
      );

      const specularLight = clamp(
        getFirstNumber(m.lightingPrep, ["highlightPotential"], 0) * 0.22 +
        getFirstNumber(m.lightingPrep, ["wetReflectiveMaterial"], 0) * 0.24 +
        getFirstNumber(m.lightingPrep, ["mineralGlint"], 0) * 0.28 +
        a.rimEnvelope * 0.10,
        0,
        1
      );

      const hazeScatter = clamp(
        getFirstNumber(a.lightingPrep, ["hazeScattering"], 0) * 0.36 +
        a.lowerHaze * 0.22 +
        a.aerosol * 0.16 +
        a.dust * 0.10,
        0,
        1
      );

      const wetReflection = clamp(
        getFirstNumber(m.lightingPrep, ["wetReflectiveMaterial"], 0) * 0.38 +
        m.waterPresence * 0.16 +
        m.waterDepth * 0.18 +
        a.humidity * 0.08,
        0,
        1
      );

      const mineralGlint = clamp(
        getFirstNumber(m.lightingPrep, ["mineralGlint"], 0) * 0.42 +
        m.mineralPressure * 0.20 +
        a.aerosol * 0.08,
        0,
        1
      );

      const cloudDiffusion = clamp(
        a.cloudSeed * 0.34 +
        a.vapor * 0.16 +
        atmosphericSoftening * 0.18,
        0,
        1
      );

      const shadowSoftness = clamp(
        getFirstNumber(a.lightingPrep, ["shadowSoftening"], 0) * 0.40 +
        diffuseLight * 0.24 +
        a.vapor * 0.12,
        0,
        1
      );

      const lightClass = lightClassFor(a, m, e, directLight, shadow, rimLight, specularLight, hazeScatter);

      return {
        index,
        id: `HEARTH_LIGHTING_NODE_${String(index + 1).padStart(3, "0")}`,
        row: a.row,
        col: a.col,
        x: a.x,
        y: a.y,
        worldName: WORLD_NAME,

        sourceAtmosphereId: a.id,
        sourceMaterialId: m.id || "",
        sourceElevationId: e.id || "",

        airClass: a.airClass,
        materialClass: m.materialClass || "",
        reliefClass: e.reliefClass || "",

        elevation: e.elevation === undefined ? a.elevation : e.elevation,
        slope: e.slope === undefined ? 0 : e.slope,
        airClarity: a.airClarity,
        rimEnvelope: a.rimEnvelope,
        lowerHaze: a.lowerHaze,
        humidity: a.humidity,
        vapor: a.vapor,
        dust: a.dust,
        aerosol: a.aerosol,
        wetnessMaterial: m.wetnessMaterial || 0,
        mineralPressure: m.mineralPressure || 0,
        stoneExposure: m.stoneExposure || 0,

        lightClass,
        tintHint: lightTintHint(lightClass),

        directLight: round(directLight),
        shadow: round(shadow),
        rimLight: round(rimLight),
        diffuseLight: round(diffuseLight),
        specularLight: round(specularLight),
        hazeScatter: round(hazeScatter),
        wetReflection: round(wetReflection),
        mineralGlint: round(mineralGlint),
        cloudDiffusion: round(cloudDiffusion),
        shadowSoftness: round(shadowSoftness),

        compositePrep: {
          lightingLayerReady: true,
          lightClass,
          tintHint: lightTintHint(lightClass),
          directLight: round(directLight),
          shadow: round(shadow),
          rimLight: round(rimLight),
          diffuseLight: round(diffuseLight),
          specularLight: round(specularLight),
          hazeScatter: round(hazeScatter),
          wetReflection: round(wetReflection),
          mineralGlint: round(mineralGlint),
          cloudDiffusion: round(cloudDiffusion),
          shadowSoftness: round(shadowSoftness)
        },

        story: lightStory(lightClass),

        finalLightingTruthClaim: false,
        finalVisualClaim: false
      };
    });

    const byClass = {};
    for (const key of Object.values(LIGHT_CLASSES)) byClass[key] = [];

    for (const node of lightingNodes) {
      if (!byClass[node.lightClass]) byClass[node.lightClass] = [];
      byClass[node.lightClass].push(node.index);
    }

    const directLightMap = lightingNodes.map((node) => node.directLight);
    const shadowMap = lightingNodes.map((node) => node.shadow);
    const rimLightMap = lightingNodes.map((node) => node.rimLight);
    const diffuseLightMap = lightingNodes.map((node) => node.diffuseLight);
    const specularLightMap = lightingNodes.map((node) => node.specularLight);
    const hazeScatterMap = lightingNodes.map((node) => node.hazeScatter);
    const wetReflectionMap = lightingNodes.map((node) => node.wetReflection);
    const mineralGlintMap = lightingNodes.map((node) => node.mineralGlint);
    const cloudDiffusionMap = lightingNodes.map((node) => node.cloudDiffusion);
    const compositeLightingMap = lightingNodes.map((node) => clonePlain(node.compositePrep));

    const model = {
      modelType: "HEARTH_LIGHTING_SOLAR_SHADOW_MODEL",
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

      sourceAtmosphereContractExpected: ATMOSPHERE_CONTRACT,
      sourceAtmosphereFile: ATMOSPHERE_FILE,
      atmosphereDependencyObserved: atmosphere.observed,
      atmospherePacketObserved: atmosphere.packetObserved,
      atmosphereReceiptObserved: atmosphere.receiptObserved,
      atmosphereLightingPrepObserved: atmosphere.lightingPrepObserved,
      atmosphereNodeCount: atmosphere.nodeCount,
      atmosphere256ScopeObserved: atmosphere.diagnostic256Ready,
      atmosphereFallbackUsed: atmosphere.fallbackUsed,

      sourceMaterialContractExpected: MATERIAL_CONTRACT,
      sourceMaterialFile: MATERIAL_FILE,
      materialDependencyObserved: material.observed,
      materialPacketObserved: material.packetObserved,
      materialReceiptObserved: material.receiptObserved,
      materialLightingPrepObserved: material.lightingPrepObserved,
      materialNodeCount: material.nodeCount,
      material256ScopeObserved: material.diagnostic256Ready,
      materialFallbackUsed: material.fallbackUsed,

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
      lightVector,
      lightingNodes,

      lightClasses: clonePlain(LIGHT_CLASSES),
      lightClassIndex: clonePlain(byClass),

      directLightMap,
      shadowMap,
      rimLightMap,
      diffuseLightMap,
      specularLightMap,
      hazeScatterMap,
      wetReflectionMap,
      mineralGlintMap,
      cloudDiffusionMap,
      compositeLightingMap,

      basinShadowNodes: byClass[LIGHT_CLASSES.BASIN_SHADOW] || [],
      oceanGleamNodes: byClass[LIGHT_CLASSES.OCEAN_GLEAM] || [],
      shelfGoldRimNodes: byClass[LIGHT_CLASSES.SHELF_GOLD_RIM] || [],
      riverThreadLightNodes: byClass[LIGHT_CLASSES.RIVER_THREAD_LIGHT] || [],
      wetlandSoftDiffusionNodes: byClass[LIGHT_CLASSES.WETLAND_SOFT_DIFFUSION] || [],
      mineralGlintNodes: byClass[LIGHT_CLASSES.MINERAL_GLINT] || [],
      aquiferLowGlowNodes: byClass[LIGHT_CLASSES.AQUIFER_LOW_GLOW] || [],
      highlandRimLightNodes: byClass[LIGHT_CLASSES.HIGHLAND_RIM_LIGHT] || [],
      dryCrustHarshLightNodes: byClass[LIGHT_CLASSES.DRY_CRUST_HARSH_LIGHT] || [],
      temperateSurfaceLightNodes: byClass[LIGHT_CLASSES.TEMPERATE_SURFACE_LIGHT] || [],

      lightingRules: {
        lightingFollowsElevationMaterialAndAtmosphere: true,
        lightingMayNotInventLand: true,
        lightingMayNotInventWater: true,
        directLightFollowsGlobeNormalReliefAndAirClarity: true,
        shadowFollowsBasinReliefMaterialAbsorptionAndLightDirection: true,
        rimLightFollowsAtmosphereRimElevationShelfAndClarity: true,
        specularFollowsWetMaterialMineralsAndShelf: true,
        hazeScatterFollowsVaporDustAerosolAndLowerHaze: true,
        lightingMayNotClaimFinalLightingTruth: true,
        lightingMayNotClaimFinalVisualPass: true
      },

      narrativeDisposition: {
        body: "Landform gave Hearth a body.",
        relief: "Elevation raised the body into pressure and shadow-casting relief.",
        water: "Hydrology gave the body visible and hidden water.",
        material: "Material gave the body a skin.",
        atmosphere: "Atmosphere gave the skin a breathing envelope.",
        lighting: "Lighting now makes Hearth readable by rim, shadow, gleam, haze, and glint."
      },

      finalLightingTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingModel = clonePlain(model);
    state.lightingModelReady = true;
    state.diagnostic256Ready = lightingNodes.length === NODE_COUNT;

    state.directLightMapReady = directLightMap.length === NODE_COUNT;
    state.shadowMapReady = shadowMap.length === NODE_COUNT;
    state.rimLightMapReady = rimLightMap.length === NODE_COUNT;
    state.diffuseLightMapReady = diffuseLightMap.length === NODE_COUNT;
    state.specularLightMapReady = specularLightMap.length === NODE_COUNT;
    state.hazeScatterMapReady = hazeScatterMap.length === NODE_COUNT;
    state.wetReflectionMapReady = wetReflectionMap.length === NODE_COUNT;
    state.mineralGlintMapReady = mineralGlintMap.length === NODE_COUNT;
    state.cloudDiffusionMapReady = cloudDiffusionMap.length === NODE_COUNT;
    state.compositeLightingMapReady = compositeLightingMap.length === NODE_COUNT;

    state.lightingNodeCount = lightingNodes.length;
    state.basinShadowNodeCount = model.basinShadowNodes.length;
    state.oceanGleamNodeCount = model.oceanGleamNodes.length;
    state.shelfGoldRimNodeCount = model.shelfGoldRimNodes.length;
    state.riverThreadLightNodeCount = model.riverThreadLightNodes.length;
    state.wetlandSoftDiffusionNodeCount = model.wetlandSoftDiffusionNodes.length;
    state.mineralGlintNodeCount = model.mineralGlintNodes.length;
    state.aquiferLowGlowNodeCount = model.aquiferLowGlowNodes.length;
    state.highlandRimLightNodeCount = model.highlandRimLightNodes.length;
    state.dryCrustHarshLightNodeCount = model.dryCrustHarshLightNodes.length;
    state.temperateSurfaceLightNodeCount = model.temperateSurfaceLightNodes.length;

    record("LIGHTING_FINGER_MODEL_BUILT", {
      nodeCount: lightingNodes.length,
      basinShadowNodeCount: state.basinShadowNodeCount,
      shelfGoldRimNodeCount: state.shelfGoldRimNodeCount,
      mineralGlintNodeCount: state.mineralGlintNodeCount,
      highlandRimLightNodeCount: state.highlandRimLightNodeCount,
      atmosphereFallbackUsed: atmosphere.fallbackUsed,
      materialFallbackUsed: material.fallbackUsed,
      elevationFallbackUsed: elevation.fallbackUsed
    });

    return model;
  }

  function buildCompositeLightingPrepPacket(model) {
    const source = model || state.lightingModel || buildLightingModel();

    const packet = {
      packetType: "HEARTH_LIGHTING_TO_COMPOSITE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      worldName: WORLD_NAME,
      nodeCount: source.nodeCount,
      gridSize: source.gridSize,
      lightVector: clonePlain(source.lightVector),

      lightingNodes: clonePlain(source.lightingNodes),
      lightClasses: clonePlain(source.lightClasses),
      lightClassIndex: clonePlain(source.lightClassIndex),
      directLightMap: clonePlain(source.directLightMap),
      shadowMap: clonePlain(source.shadowMap),
      rimLightMap: clonePlain(source.rimLightMap),
      diffuseLightMap: clonePlain(source.diffuseLightMap),
      specularLightMap: clonePlain(source.specularLightMap),
      hazeScatterMap: clonePlain(source.hazeScatterMap),
      wetReflectionMap: clonePlain(source.wetReflectionMap),
      mineralGlintMap: clonePlain(source.mineralGlintMap),
      cloudDiffusionMap: clonePlain(source.cloudDiffusionMap),
      compositeLightingMap: clonePlain(source.compositeLightingMap),

      compositeLayerContribution: {
        layer: "lighting",
        disposition: PLANETARY_DISPOSITION,
        contributesDirectLight: true,
        contributesShadow: true,
        contributesRimLight: true,
        contributesDiffuseLight: true,
        contributesSpecularLight: true,
        contributesHazeScatter: true,
        contributesWetReflection: true,
        contributesMineralGlint: true,
        contributesCloudDiffusion: true,
        contributesTint: true
      },

      readyForComposite: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.compositeLightingPrepPacket = clonePlain(packet);
    state.compositeLightingPrepPacketReady = true;
    return packet;
  }

  function buildInspectPrepPacket(model) {
    const source = model || state.lightingModel || buildLightingModel();

    const packet = {
      packetType: "HEARTH_LIGHTING_TO_INSPECT_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: INSPECT_FILE,
      worldName: WORLD_NAME,

      inspectLayer: "lighting",
      planetaryDisposition: PLANETARY_DISPOSITION,
      planetaryDispositionIndex: PLANETARY_DISPOSITION_INDEX,

      nodeCount: source.nodeCount,
      diagnostic256Ready: source.nodeCount === NODE_COUNT,
      atmospherePacketConsumed: state.atmospherePacketObserved || state.atmosphereDependencyObserved,
      atmosphereLightingPrepConsumed: state.atmosphereLightingPrepObserved,
      atmosphereFallbackUsed: state.atmosphereFallbackUsed,
      materialPacketConsumed: state.materialPacketObserved || state.materialDependencyObserved,
      materialLightingPrepConsumed: state.materialLightingPrepObserved,
      materialFallbackUsed: state.materialFallbackUsed,
      elevationPacketConsumed: state.elevationPacketObserved || state.elevationDependencyObserved,
      elevationFallbackUsed: state.elevationFallbackUsed,

      lightingModelReady: true,
      directLightMapReady: true,
      shadowMapReady: true,
      rimLightMapReady: true,
      diffuseLightMapReady: true,
      specularLightMapReady: true,
      hazeScatterMapReady: true,
      wetReflectionMapReady: true,
      mineralGlintMapReady: true,

      inspectSummary: {
        lightingNodeCount: state.lightingNodeCount,
        basinShadowNodeCount: state.basinShadowNodeCount,
        oceanGleamNodeCount: state.oceanGleamNodeCount,
        shelfGoldRimNodeCount: state.shelfGoldRimNodeCount,
        riverThreadLightNodeCount: state.riverThreadLightNodeCount,
        wetlandSoftDiffusionNodeCount: state.wetlandSoftDiffusionNodeCount,
        mineralGlintNodeCount: state.mineralGlintNodeCount,
        aquiferLowGlowNodeCount: state.aquiferLowGlowNodeCount,
        highlandRimLightNodeCount: state.highlandRimLightNodeCount,
        dryCrustHarshLightNodeCount: state.dryCrustHarshLightNodeCount,
        temperateSurfaceLightNodeCount: state.temperateSurfaceLightNodeCount
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

  function buildLightingPacket(options = {}) {
    const model = buildLightingModel(options);

    const compositePrep = buildCompositeLightingPrepPacket(model);
    const inspectPrep = buildInspectPrepPacket(model);

    const packet = {
      packetType: "HEARTH_CANVAS_LIGHTING_FINGER_PACKET",
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

      sourceAtmosphereFile: ATMOSPHERE_FILE,
      sourceAtmosphereContractExpected: ATMOSPHERE_CONTRACT,
      atmosphereDependencyExpected: true,
      atmosphereDependencyObserved: state.atmosphereDependencyObserved,
      atmosphereAuthoritySourceName: state.atmosphereAuthoritySourceName,
      atmospherePacketObserved: state.atmospherePacketObserved,
      atmosphereReceiptObserved: state.atmosphereReceiptObserved,
      atmosphereLightingPrepObserved: state.atmosphereLightingPrepObserved,
      atmosphereNodeCount: state.atmosphereNodeCount,
      atmosphere256ScopeObserved: state.atmosphere256ScopeObserved,
      atmosphereFallbackUsed: state.atmosphereFallbackUsed,

      sourceMaterialFile: MATERIAL_FILE,
      sourceMaterialContractExpected: MATERIAL_CONTRACT,
      materialDependencyExpected: true,
      materialDependencyObserved: state.materialDependencyObserved,
      materialAuthoritySourceName: state.materialAuthoritySourceName,
      materialPacketObserved: state.materialPacketObserved,
      materialReceiptObserved: state.materialReceiptObserved,
      materialLightingPrepObserved: state.materialLightingPrepObserved,
      materialNodeCount: state.materialNodeCount,
      material256ScopeObserved: state.material256ScopeObserved,
      materialFallbackUsed: state.materialFallbackUsed,

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

      lightingFingerActive: true,
      solarShadowAuthorityActive: true,
      lightingModelReady: true,
      lightingPacketReady: true,
      diagnostic256Ready: true,

      directLightMapReady: true,
      shadowMapReady: true,
      rimLightMapReady: true,
      diffuseLightMapReady: true,
      specularLightMapReady: true,
      hazeScatterMapReady: true,
      wetReflectionMapReady: true,
      mineralGlintMapReady: true,
      cloudDiffusionMapReady: true,
      compositeLightingMapReady: true,

      lightingModel: clonePlain(model),
      compositeLightingPrepPacket: clonePlain(compositePrep),
      inspectPrepPacket: clonePlain(inspectPrep),

      nextFile: NEXT_FILE,
      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: "WAITING_COMPOSITE_FINGER_EXPANSION",
      postgameStatus: "LIGHTING_SOLAR_SHADOW_PACKET_READY_FOR_COMPOSITE",

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lightingPacket = clonePlain(packet);
    state.lightingPacketReady = true;

    state.firstFailedCoordinate = "WAITING_COMPOSITE_FINGER_EXPANSION";
    state.recommendedNextFile = NEXT_FILE;
    state.recommendedNextRenewalTarget = NEXT_FILE;
    state.postgameStatus = "LIGHTING_SOLAR_SHADOW_PACKET_READY_FOR_COMPOSITE";

    record("LIGHTING_FINGER_PACKET_BUILT", {
      nodeCount: model.nodeCount,
      basinShadowNodeCount: state.basinShadowNodeCount,
      shelfGoldRimNodeCount: state.shelfGoldRimNodeCount,
      mineralGlintNodeCount: state.mineralGlintNodeCount,
      highlandRimLightNodeCount: state.highlandRimLightNodeCount,
      nextFile: NEXT_FILE,
      lightingPacketReady: true
    });

    return packet;
  }

  function getLightingModel(options = {}) {
    if (!state.lightingModel || options.rebuild === true) {
      return buildLightingModel(options);
    }

    return clonePlain(state.lightingModel);
  }

  function getLightingPacket(options = {}) {
    if (!state.lightingPacket || options.rebuild === true) {
      return buildLightingPacket(options);
    }

    return clonePlain(state.lightingPacket);
  }

  function getDirectLightMap(options = {}) {
    const model = getLightingModel(options);
    return clonePlain(model.directLightMap || []);
  }

  function getShadowMap(options = {}) {
    const model = getLightingModel(options);
    return clonePlain(model.shadowMap || []);
  }

  function getRimLightMap(options = {}) {
    const model = getLightingModel(options);
    return clonePlain(model.rimLightMap || []);
  }

  function getCompositeLightingPrepPacket(options = {}) {
    if (!state.compositeLightingPrepPacket || options.rebuild === true) {
      buildLightingPacket(options);
    }

    return clonePlain(state.compositeLightingPrepPacket);
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
    const nodes = model && Array.isArray(model.lightingNodes) ? model.lightingNodes : [];
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

  function sampleLighting(x, y, options = {}) {
    const model = getLightingModel(options);
    const point = normalizePoint(x, y, options.width, options.height);
    const node = nearestNode(point, model);

    return {
      packetType: "HEARTH_CANVAS_LIGHTING_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      worldName: WORLD_NAME,
      fingerName: FINGER_NAME,
      x: point.x,
      y: point.y,
      node: node ? clonePlain(node) : null,
      lightClass: node ? node.lightClass : "UNKNOWN",
      directLight: node ? node.directLight : 0,
      shadow: node ? node.shadow : 0,
      rimLight: node ? node.rimLight : 0,
      diffuseLight: node ? node.diffuseLight : 0,
      specularLight: node ? node.specularLight : 0,
      hazeScatter: node ? node.hazeScatter : 0,
      finalLightingTruthClaim: false,
      finalVisualClaim: false,
      ...FINAL_FALSE
    };
  }

  function sample(x, y, options = {}) {
    return sampleLighting(x, y, options);
  }

  function rgbaForLight(lightClass, alpha) {
    const a = clamp(alpha, 0, 1);

    if (lightClass === LIGHT_CLASSES.BASIN_SHADOW) return `rgba(20, 24, 38, ${a})`;
    if (lightClass === LIGHT_CLASSES.OCEAN_GLEAM) return `rgba(165, 220, 255, ${a})`;
    if (lightClass === LIGHT_CLASSES.SHELF_GOLD_RIM) return `rgba(246, 212, 128, ${a})`;
    if (lightClass === LIGHT_CLASSES.RIVER_THREAD_LIGHT) return `rgba(206, 228, 226, ${a})`;
    if (lightClass === LIGHT_CLASSES.WETLAND_SOFT_DIFFUSION) return `rgba(166, 188, 158, ${a})`;
    if (lightClass === LIGHT_CLASSES.MINERAL_GLINT) return `rgba(255, 232, 148, ${a})`;
    if (lightClass === LIGHT_CLASSES.AQUIFER_LOW_GLOW) return `rgba(88, 112, 104, ${a})`;
    if (lightClass === LIGHT_CLASSES.HIGHLAND_RIM_LIGHT) return `rgba(208, 236, 255, ${a})`;
    if (lightClass === LIGHT_CLASSES.DRY_CRUST_HARSH_LIGHT) return `rgba(220, 174, 106, ${a})`;
    return `rgba(188, 206, 216, ${a})`;
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

    const model = getLightingModel(options);
    const nodes = model.lightingNodes || [];

    try {
      context.save();
      context.globalCompositeOperation = options.compositeOperation || "source-over";

      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;
      const opacity = clamp(options.opacity === undefined ? 0.18 : options.opacity, 0, 0.58);

      for (const node of nodes) {
        const alpha = clamp(
          opacity +
          (node.directLight * 0.12) +
          (node.rimLight * 0.10) +
          (node.specularLight * 0.08) -
          (node.shadow * 0.08),
          0.02,
          0.62
        );

        context.fillStyle = rgbaForLight(node.lightClass, alpha);
        context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);

        if (node.lightClass === LIGHT_CLASSES.MINERAL_GLINT || node.mineralGlint >= 0.56) {
          context.globalAlpha = clamp(alpha + 0.20, 0, 0.76);
          context.fillStyle = "rgba(255, 235, 150, 0.62)";
          context.beginPath();
          context.arc(
            node.col * cellW + cellW * 0.54,
            node.row * cellH + cellH * 0.46,
            Math.max(1, Math.min(cellW, cellH) * 0.12),
            0,
            Math.PI * 2
          );
          context.fill();
          context.globalAlpha = 1;
        }

        if (node.lightClass === LIGHT_CLASSES.HIGHLAND_RIM_LIGHT || node.rimLight >= 0.58) {
          context.globalAlpha = clamp(alpha + 0.12, 0, 0.64);
          context.strokeStyle = "rgba(214, 240, 255, 0.44)";
          context.lineWidth = Math.max(1, Math.min(cellW, cellH) * 0.055);
          context.beginPath();
          context.moveTo(node.col * cellW + cellW * 0.12, node.row * cellH + cellH * 0.18);
          context.lineTo(node.col * cellW + cellW * 0.88, node.row * cellH + cellH * 0.72);
          context.stroke();
          context.globalAlpha = 1;
        }

        if (node.lightClass === LIGHT_CLASSES.BASIN_SHADOW) {
          context.globalAlpha = clamp(0.14 + node.shadow * 0.18, 0, 0.44);
          context.fillStyle = "rgba(0, 0, 0, 0.38)";
          context.fillRect(node.col * cellW, node.row * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);
          context.globalAlpha = 1;
        }
      }

      context.restore();

      record("LIGHTING_FINGER_DRAW_TO_CANVAS_COMPLETE", {
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

      recordError("LIGHTING_FINGER_DRAW_TO_CANVAS_FAILED", error);

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
    const packet = getLightingPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND_NONBLOCKING";
      record("LIGHTING_FINGER_HUB_NOT_FOUND_NONBLOCKING", {
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
          : "CANVAS_HUB_REJECTED_LIGHTING_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        record("LIGHTING_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("LIGHTING_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND_NONBLOCKING";
    record("LIGHTING_FINGER_HUB_INTAKE_NOT_FOUND_NONBLOCKING", {
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
    const packet = getLightingPacket(options);
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
          : "SURFACE_POINTER_REJECTED_LIGHTING_PACKET";

        record("LIGHTING_FINGER_SURFACE_POINTER_REGISTRATION_ATTEMPT_COMPLETE", {
          surfacePointerSourceName: found.sourceName,
          method,
          accepted: state.surfacePointerRegistrationAccepted
        });

        return state.surfacePointerRegistrationAccepted;
      } catch (error) {
        state.surfacePointerRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("LIGHTING_FINGER_SURFACE_POINTER_REGISTRATION_METHOD_FAILED", error, {
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

      atmosphereFile: ATMOSPHERE_FILE,
      atmosphereContractExpected: ATMOSPHERE_CONTRACT,
      atmosphereDependencyExpected: state.atmosphereDependencyExpected,
      atmosphereDependencyObserved: state.atmosphereDependencyObserved,
      atmosphereAuthoritySourceName: state.atmosphereAuthoritySourceName,
      atmospherePacketObserved: state.atmospherePacketObserved,
      atmosphereReceiptObserved: state.atmosphereReceiptObserved,
      atmosphereLightingPrepObserved: state.atmosphereLightingPrepObserved,
      atmosphereNodeCount: state.atmosphereNodeCount,
      atmosphere256ScopeObserved: state.atmosphere256ScopeObserved,
      atmosphereFallbackUsed: state.atmosphereFallbackUsed,
      atmosphereReadError: state.atmosphereReadError,

      materialFile: MATERIAL_FILE,
      materialContractExpected: MATERIAL_CONTRACT,
      materialDependencyExpected: state.materialDependencyExpected,
      materialDependencyObserved: state.materialDependencyObserved,
      materialAuthoritySourceName: state.materialAuthoritySourceName,
      materialPacketObserved: state.materialPacketObserved,
      materialReceiptObserved: state.materialReceiptObserved,
      materialLightingPrepObserved: state.materialLightingPrepObserved,
      materialNodeCount: state.materialNodeCount,
      material256ScopeObserved: state.material256ScopeObserved,
      materialFallbackUsed: state.materialFallbackUsed,
      materialReadError: state.materialReadError,

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

      lightingFingerLoaded: state.lightingFingerLoaded,
      lightingFingerActive: state.lightingFingerActive,
      solarShadowAuthorityActive: state.solarShadowAuthorityActive,
      lightingModelReady: state.lightingModelReady,
      lightingPacketReady: state.lightingPacketReady,
      diagnostic256Ready: state.diagnostic256Ready,

      directLightMapReady: state.directLightMapReady,
      shadowMapReady: state.shadowMapReady,
      rimLightMapReady: state.rimLightMapReady,
      diffuseLightMapReady: state.diffuseLightMapReady,
      specularLightMapReady: state.specularLightMapReady,
      hazeScatterMapReady: state.hazeScatterMapReady,
      wetReflectionMapReady: state.wetReflectionMapReady,
      mineralGlintMapReady: state.mineralGlintMapReady,
      cloudDiffusionMapReady: state.cloudDiffusionMapReady,
      compositeLightingMapReady: state.compositeLightingMapReady,

      compositeLightingPrepPacketReady: state.compositeLightingPrepPacketReady,
      inspectPrepPacketReady: state.inspectPrepPacketReady,

      lightingNodeCount: state.lightingNodeCount,
      basinShadowNodeCount: state.basinShadowNodeCount,
      oceanGleamNodeCount: state.oceanGleamNodeCount,
      shelfGoldRimNodeCount: state.shelfGoldRimNodeCount,
      riverThreadLightNodeCount: state.riverThreadLightNodeCount,
      wetlandSoftDiffusionNodeCount: state.wetlandSoftDiffusionNodeCount,
      mineralGlintNodeCount: state.mineralGlintNodeCount,
      aquiferLowGlowNodeCount: state.aquiferLowGlowNodeCount,
      highlandRimLightNodeCount: state.highlandRimLightNodeCount,
      dryCrustHarshLightNodeCount: state.dryCrustHarshLightNodeCount,
      temperateSurfaceLightNodeCount: state.temperateSurfaceLightNodeCount,

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
      sampleLightingAvailable: true,
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
      atmosphereEvidence: clonePlain(state.atmosphereEvidence),
      atmospherePacket: clonePlain(state.atmospherePacket),
      atmosphereReceipt: clonePlain(state.atmosphereReceipt),
      atmosphereLightingPrepPacket: clonePlain(state.atmosphereLightingPrepPacket),
      materialEvidence: clonePlain(state.materialEvidence),
      materialPacket: clonePlain(state.materialPacket),
      materialReceipt: clonePlain(state.materialReceipt),
      materialLightingPrepPacket: clonePlain(state.materialLightingPrepPacket),
      elevationEvidence: clonePlain(state.elevationEvidence),
      elevationPacket: clonePlain(state.elevationPacket),
      elevationReceipt: clonePlain(state.elevationReceipt),
      lightingModel: clonePlain(state.lightingModel),
      lightingPacket: clonePlain(state.lightingPacket),
      compositeLightingPrepPacket: clonePlain(state.compositeLightingPrepPacket),
      inspectPrepPacket: clonePlain(state.inspectPrepPacket),
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      fingerFiles: clonePlain(FINGER_FILES),
      lightClasses: clonePlain(LIGHT_CLASSES),
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
      "HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_RECEIPT",
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
      "ATMOSPHERE_CONSUMPTION",
      line("atmosphereFile", r.atmosphereFile),
      line("atmosphereContractExpected", r.atmosphereContractExpected),
      line("atmosphereDependencyExpected", r.atmosphereDependencyExpected),
      line("atmosphereDependencyObserved", r.atmosphereDependencyObserved),
      line("atmosphereAuthoritySourceName", r.atmosphereAuthoritySourceName),
      line("atmospherePacketObserved", r.atmospherePacketObserved),
      line("atmosphereReceiptObserved", r.atmosphereReceiptObserved),
      line("atmosphereLightingPrepObserved", r.atmosphereLightingPrepObserved),
      line("atmosphereNodeCount", r.atmosphereNodeCount),
      line("atmosphere256ScopeObserved", r.atmosphere256ScopeObserved),
      line("atmosphereFallbackUsed", r.atmosphereFallbackUsed),
      line("atmosphereReadError", r.atmosphereReadError),
      "",
      "MATERIAL_CONSUMPTION",
      line("materialFile", r.materialFile),
      line("materialContractExpected", r.materialContractExpected),
      line("materialDependencyExpected", r.materialDependencyExpected),
      line("materialDependencyObserved", r.materialDependencyObserved),
      line("materialAuthoritySourceName", r.materialAuthoritySourceName),
      line("materialPacketObserved", r.materialPacketObserved),
      line("materialReceiptObserved", r.materialReceiptObserved),
      line("materialLightingPrepObserved", r.materialLightingPrepObserved),
      line("materialNodeCount", r.materialNodeCount),
      line("material256ScopeObserved", r.material256ScopeObserved),
      line("materialFallbackUsed", r.materialFallbackUsed),
      line("materialReadError", r.materialReadError),
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
      "LIGHTING_STATUS",
      line("lightingFingerLoaded", r.lightingFingerLoaded),
      line("lightingFingerActive", r.lightingFingerActive),
      line("solarShadowAuthorityActive", r.solarShadowAuthorityActive),
      line("lightingModelReady", r.lightingModelReady),
      line("lightingPacketReady", r.lightingPacketReady),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("directLightMapReady", r.directLightMapReady),
      line("shadowMapReady", r.shadowMapReady),
      line("rimLightMapReady", r.rimLightMapReady),
      line("diffuseLightMapReady", r.diffuseLightMapReady),
      line("specularLightMapReady", r.specularLightMapReady),
      line("hazeScatterMapReady", r.hazeScatterMapReady),
      line("wetReflectionMapReady", r.wetReflectionMapReady),
      line("mineralGlintMapReady", r.mineralGlintMapReady),
      line("cloudDiffusionMapReady", r.cloudDiffusionMapReady),
      line("compositeLightingMapReady", r.compositeLightingMapReady),
      "",
      "PREP_PACKETS",
      line("compositeLightingPrepPacketReady", r.compositeLightingPrepPacketReady),
      line("inspectPrepPacketReady", r.inspectPrepPacketReady),
      "",
      "COUNTS",
      line("lightingNodeCount", r.lightingNodeCount),
      line("basinShadowNodeCount", r.basinShadowNodeCount),
      line("oceanGleamNodeCount", r.oceanGleamNodeCount),
      line("shelfGoldRimNodeCount", r.shelfGoldRimNodeCount),
      line("riverThreadLightNodeCount", r.riverThreadLightNodeCount),
      line("wetlandSoftDiffusionNodeCount", r.wetlandSoftDiffusionNodeCount),
      line("mineralGlintNodeCount", r.mineralGlintNodeCount),
      line("aquiferLowGlowNodeCount", r.aquiferLowGlowNodeCount),
      line("highlandRimLightNodeCount", r.highlandRimLightNodeCount),
      line("dryCrustHarshLightNodeCount", r.dryCrustHarshLightNodeCount),
      line("temperateSurfaceLightNodeCount", r.temperateSurfaceLightNodeCount),
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
      line("lightingTruthClaimed", false),
      line("finalLightingTruthClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerLightingLoaded", "true");
    setDataset("hearthCanvasFingerLightingContract", CONTRACT);
    setDataset("hearthCanvasFingerLightingReceipt", RECEIPT);
    setDataset("hearthCanvasFingerLightingPacket", PACKET);
    setDataset("hearthCanvasFingerLightingFile", FILE);
    setDataset("hearthCanvasFingerLightingWorldName", WORLD_NAME);

    setDataset("hearthCanvasFingerLightingDisposition", PLANETARY_DISPOSITION);
    setDataset("hearthCanvasFingerLightingDispositionIndex", String(PLANETARY_DISPOSITION_INDEX));
    setDataset("hearthCanvasFingerLightingExpansionMode", state.expansionMode);
    setDataset("hearthCanvasFingerLightingReintegrationMode", state.reintegrationMode);

    setDataset("hearthCanvasFingerLightingAtmosphereDependencyExpected", String(state.atmosphereDependencyExpected));
    setDataset("hearthCanvasFingerLightingAtmosphereDependencyObserved", String(state.atmosphereDependencyObserved));
    setDataset("hearthCanvasFingerLightingAtmosphereSourceName", state.atmosphereAuthoritySourceName);
    setDataset("hearthCanvasFingerLightingAtmospherePacketObserved", String(state.atmospherePacketObserved));
    setDataset("hearthCanvasFingerLightingAtmosphereReceiptObserved", String(state.atmosphereReceiptObserved));
    setDataset("hearthCanvasFingerLightingAtmospherePrepObserved", String(state.atmosphereLightingPrepObserved));
    setDataset("hearthCanvasFingerLightingAtmosphereNodeCount", String(state.atmosphereNodeCount));
    setDataset("hearthCanvasFingerLightingAtmosphere256ScopeObserved", String(state.atmosphere256ScopeObserved));
    setDataset("hearthCanvasFingerLightingAtmosphereFallbackUsed", String(state.atmosphereFallbackUsed));

    setDataset("hearthCanvasFingerLightingMaterialDependencyExpected", String(state.materialDependencyExpected));
    setDataset("hearthCanvasFingerLightingMaterialDependencyObserved", String(state.materialDependencyObserved));
    setDataset("hearthCanvasFingerLightingMaterialSourceName", state.materialAuthoritySourceName);
    setDataset("hearthCanvasFingerLightingMaterialPacketObserved", String(state.materialPacketObserved));
    setDataset("hearthCanvasFingerLightingMaterialReceiptObserved", String(state.materialReceiptObserved));
    setDataset("hearthCanvasFingerLightingMaterialPrepObserved", String(state.materialLightingPrepObserved));
    setDataset("hearthCanvasFingerLightingMaterialNodeCount", String(state.materialNodeCount));
    setDataset("hearthCanvasFingerLightingMaterial256ScopeObserved", String(state.material256ScopeObserved));
    setDataset("hearthCanvasFingerLightingMaterialFallbackUsed", String(state.materialFallbackUsed));

    setDataset("hearthCanvasFingerLightingElevationDependencyExpected", String(state.elevationDependencyExpected));
    setDataset("hearthCanvasFingerLightingElevationDependencyObserved", String(state.elevationDependencyObserved));
    setDataset("hearthCanvasFingerLightingElevationSourceName", state.elevationAuthoritySourceName);
    setDataset("hearthCanvasFingerLightingElevationPacketObserved", String(state.elevationPacketObserved));
    setDataset("hearthCanvasFingerLightingElevationReceiptObserved", String(state.elevationReceiptObserved));
    setDataset("hearthCanvasFingerLightingElevationNodeCount", String(state.elevationNodeCount));
    setDataset("hearthCanvasFingerLightingElevation256ScopeObserved", String(state.elevation256ScopeObserved));
    setDataset("hearthCanvasFingerLightingElevationFallbackUsed", String(state.elevationFallbackUsed));

    setDataset("hearthCanvasFingerLightingModelReady", String(state.lightingModelReady));
    setDataset("hearthCanvasFingerLightingPacketReady", String(state.lightingPacketReady));
    setDataset("hearthCanvasFingerLightingDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerLightingDirectLightMapReady", String(state.directLightMapReady));
    setDataset("hearthCanvasFingerLightingShadowMapReady", String(state.shadowMapReady));
    setDataset("hearthCanvasFingerLightingRimLightMapReady", String(state.rimLightMapReady));
    setDataset("hearthCanvasFingerLightingDiffuseLightMapReady", String(state.diffuseLightMapReady));
    setDataset("hearthCanvasFingerLightingSpecularLightMapReady", String(state.specularLightMapReady));
    setDataset("hearthCanvasFingerLightingHazeScatterMapReady", String(state.hazeScatterMapReady));
    setDataset("hearthCanvasFingerLightingWetReflectionMapReady", String(state.wetReflectionMapReady));
    setDataset("hearthCanvasFingerLightingMineralGlintMapReady", String(state.mineralGlintMapReady));
    setDataset("hearthCanvasFingerLightingCloudDiffusionMapReady", String(state.cloudDiffusionMapReady));
    setDataset("hearthCanvasFingerLightingCompositeMapReady", String(state.compositeLightingMapReady));

    setDataset("hearthCanvasFingerLightingNodeCount", String(state.lightingNodeCount));
    setDataset("hearthCanvasFingerLightingBasinShadowNodeCount", String(state.basinShadowNodeCount));
    setDataset("hearthCanvasFingerLightingOceanGleamNodeCount", String(state.oceanGleamNodeCount));
    setDataset("hearthCanvasFingerLightingShelfGoldRimNodeCount", String(state.shelfGoldRimNodeCount));
    setDataset("hearthCanvasFingerLightingRiverThreadLightNodeCount", String(state.riverThreadLightNodeCount));
    setDataset("hearthCanvasFingerLightingWetlandSoftDiffusionNodeCount", String(state.wetlandSoftDiffusionNodeCount));
    setDataset("hearthCanvasFingerLightingMineralGlintNodeCount", String(state.mineralGlintNodeCount));
    setDataset("hearthCanvasFingerLightingAquiferLowGlowNodeCount", String(state.aquiferLowGlowNodeCount));
    setDataset("hearthCanvasFingerLightingHighlandRimLightNodeCount", String(state.highlandRimLightNodeCount));
    setDataset("hearthCanvasFingerLightingDryCrustHarshLightNodeCount", String(state.dryCrustHarshLightNodeCount));
    setDataset("hearthCanvasFingerLightingTemperateSurfaceLightNodeCount", String(state.temperateSurfaceLightNodeCount));

    setDataset("hearthCanvasFingerLightingCompositePrepReady", String(state.compositeLightingPrepPacketReady));
    setDataset("hearthCanvasFingerLightingInspectPrepReady", String(state.inspectPrepPacketReady));

    setDataset("hearthCanvasFingerLightingSurfacePointerObserved", String(state.surfacePointerObserved));
    setDataset("hearthCanvasFingerLightingSurfacePointerSourceName", state.surfacePointerSourceName);
    setDataset("hearthCanvasFingerLightingSurfacePointerRegistrationAttempted", String(state.surfacePointerRegistrationAttempted));
    setDataset("hearthCanvasFingerLightingSurfacePointerRegistrationAccepted", String(state.surfacePointerRegistrationAccepted));
    setDataset("hearthCanvasFingerLightingSurfacePointerRegistrationMethod", state.surfacePointerRegistrationMethod);
    setDataset("hearthCanvasFingerLightingSurfacePointerRegistrationHeldReason", state.surfacePointerRegistrationHeldReason);

    setDataset("hearthCanvasFingerLightingHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerLightingHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerLightingHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerLightingHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerLightingHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerLightingHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerLightingFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerLightingRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerLightingPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerLightingNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerLightingF13Claimed", "false");
    setDataset("hearthCanvasFingerLightingF21Claimed", "false");
    setDataset("hearthCanvasFingerLightingReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerLightingTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingFinalLightingTruthClaimed", "false");
    setDataset("hearthCanvasFingerLightingVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerLightingGeneratedImage", "false");
    setDataset("hearthCanvasFingerLightingGraphicBox", "false");
    setDataset("hearthCanvasFingerLightingWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerLighting = api;
    hearth.canvasLightingFinger = api;
    hearth.canvasFingerLightingReceipt = getReceiptLight();
    hearth.canvasFingerLightingPacket = getLightingPacket();

    lab.hearthCanvasFingerLighting = api;
    lab.hearthCanvasLightingFinger = api;
    lab.hearthCanvasFingerLightingReceipt = getReceiptLight();
    lab.hearthCanvasFingerLightingPacket = getLightingPacket();

    root.HEARTH_CANVAS_FINGER_LIGHTING = api;
    root.HEARTH_CANVAS_LIGHTING_FINGER = api;
    root.HEARTH_CANVAS_FINGER_LIGHTING_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_LIGHTING_SOLAR_SHADOW_AUTHORITY_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_LIGHTING_PACKET = getLightingPacket();

    root.HEARTH_CANVAS_LIGHTING_DIRECT_LIGHT_MAP = getDirectLightMap();
    root.HEARTH_CANVAS_LIGHTING_SHADOW_MAP = getShadowMap();
    root.HEARTH_CANVAS_LIGHTING_RIM_LIGHT_MAP = getRimLightMap();

    root.HEARTH_LIGHTING_TO_COMPOSITE_PREP_PACKET = getCompositeLightingPrepPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readAtmosphereEvidence(options);
    readMaterialEvidence(options);
    readElevationEvidence(options);
    buildLightingPacket(options);
    publishGlobals();

    registerWithSurfacePointer(options);
    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("LIGHTING_FINGER_BOOT_COMPLETE", {
      atmosphereDependencyObserved: state.atmosphereDependencyObserved,
      atmospherePacketObserved: state.atmospherePacketObserved,
      atmosphereLightingPrepObserved: state.atmosphereLightingPrepObserved,
      materialDependencyObserved: state.materialDependencyObserved,
      materialLightingPrepObserved: state.materialLightingPrepObserved,
      elevationDependencyObserved: state.elevationDependencyObserved,
      lightingNodeCount: state.lightingNodeCount,
      lightingPacketReady: state.lightingPacketReady,
      compositeLightingPrepPacketReady: state.compositeLightingPrepPacketReady,
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
    SURFACE_FILE,
    NEXT_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,
    ATMOSPHERE_CONTRACT,
    MATERIAL_CONTRACT,
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
    LIGHT_CLASSES,

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

    readAtmosphereEvidence,
    readMaterialEvidence,
    readElevationEvidence,
    buildLightingModel,
    buildLightingPacket,
    getLightingModel,
    getLightingPacket,
    getDirectLightMap,
    getShadowMap,
    getRimLightMap,

    buildCompositeLightingPrepPacket,
    buildInspectPrepPacket,
    getCompositeLightingPrepPacket,

    sample,
    sampleLighting,
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

    supportsLightingFinger: true,
    supportsSolarShadowAuthority: true,
    supportsAtmospherePacketConsumption: true,
    supportsMaterialPacketConsumption: true,
    supportsElevationPacketConsumption: true,
    supportsDiagnostic256LightingScope: true,
    supportsDirectLightMap: true,
    supportsShadowMap: true,
    supportsRimLightMap: true,
    supportsDiffuseLightMap: true,
    supportsSpecularLightMap: true,
    supportsHazeScatterMap: true,
    supportsWetReflectionMap: true,
    supportsMineralGlintMap: true,
    supportsCloudDiffusionMap: true,
    supportsCompositeLightingPrep: true,
    supportsInspectPrep: true,
    supportsCanvasHubRegistration: true,
    supportsSurfacePointerRegistration: true,
    supportsNoFinalClaims: true,

    ownsLightingFingerIdentity: true,
    ownsSolarShadowModel: true,
    ownsLightingExpressionPacket: true,
    ownsCompositeLightingPrep: true,

    ownsLandformTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsFinalLightingTruth: false,
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

    readAtmosphereEvidence();
    readMaterialEvidence();
    readElevationEvidence();
    buildLightingPacket();
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
    recordError("LIGHTING_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
