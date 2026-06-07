// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_6
// Full-file replacement.
// Canvas Hub / source-hold planet-surface threshold receiver only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route, diagnostics, controls, Hex Surface, and receipts.
// - Preserve Canvas as receiver/output carrier only.
// - Create or bind one real visible 2D canvas surface inside the existing Hearth mount.
// - Draw a neutral source-hold carrier shell while governed source truth is absent or not sample-compatible.
// - Prevent fallback pixels from being reported as a completed visible planet.
// - Require a defined planet-surface threshold before publishing visible planet proof.
// - Discover governed source authorities when present: composition, elevation, hydrology, materials, terrain,
//   land channel, water channel, air/atmosphere channel, ocean, tectonics, and hex/four-pair authority.
// - Render visible 2D pixels from governed source samples only after the governed-source threshold is met.
// - Forward lawful Canvas Hex Gate packets to Hex Surface through public APIs only.
// - Preserve live canvas identity:
//   data-hearth-visible-canvas="true"
//   data-hearth-expression-surface="true"
// - Do not mutate HTML contract, route conductor ownership, control ownership, diagnostic chronology,
//   governed source truth, or North readiness.
// - Do not claim F13, F21, ready text, final completion, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PUBLIC_RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIPT_v12_3";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_6";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_v12_6";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_TNT_v12_5";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT_v12_5";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const VERSION =
    "2026-06-06.hearth-canvas-source-hold-planet-surface-threshold-receiver-v12-6";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const POINTER_FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const CANVAS_HEX_GATE_PACKET =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_THRESHOLD_CANVAS_HEX_GATE_PACKET_v12_6";
  const CANVAS_VIEW_PACKET =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_THRESHOLD_VIEW_PACKET_v12_6";
  const CANVAS_RENDER_PACKET =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_THRESHOLD_VISIBLE_2D_RENDER_PACKET_v12_6";
  const CARRIER_SURFACE_PACKET =
    "HEARTH_CANVAS_HUB_CARRIER_SURFACE_PROOF_PACKET_v12_6";
  const PLANET_SURFACE_THRESHOLD_PACKET =
    "HEARTH_CANVAS_HUB_PLANET_SURFACE_THRESHOLD_PACKET_v12_6";

  const TEXTURE_W = 512;
  const TEXTURE_H = 256;
  const SOURCE_THRESHOLD_RATIO = 0.6;
  const SOURCE_THRESHOLD_PROBE_W = 40;
  const SOURCE_THRESHOLD_PROBE_H = 20;
  const SOURCE_HOLD_RESCAN_MS = 1400;
  const PLANET_FRAME_MIN_MS = 44;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CANVAS_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_CANVAS: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER",
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubGovernedSourcePacketVisible2dReceiver",
    "HEARTH.canvasHubSourceHoldPlanetSurfaceThresholdReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubGovernedSourcePacketVisible2dReceiver",
    "DEXTER_LAB.hearthCanvasHubSourceHoldPlanetSurfaceThresholdReceiver"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission"
  ]);

  const SOURCE_GROUPS = Object.freeze([
    {
      key: "composition",
      role: "planet-composition",
      aliases: [
        "HEARTH_COMPOSITION",
        "HEARTH.composition",
        "HEARTH.compositionAuthority",
        "DEXTER_LAB.hearthComposition"
      ]
    },
    {
      key: "elevation",
      role: "elevation",
      aliases: [
        "HEARTH_ELEVATION",
        "HEARTH.elevation",
        "HEARTH.elevationAuthority",
        "HEARTH.heightMap",
        "DEXTER_LAB.hearthElevation"
      ]
    },
    {
      key: "hydrology",
      role: "hydrology",
      aliases: [
        "HEARTH_HYDROLOGY",
        "HEARTH.hydrology",
        "HEARTH.hydrologyAuthority",
        "HEARTH.waterMap",
        "DEXTER_LAB.hearthHydrology"
      ]
    },
    {
      key: "materials",
      role: "materials",
      aliases: [
        "HEARTH_MATERIALS",
        "HEARTH.materials",
        "HEARTH.materialAuthority",
        "HEARTH.terrainMaterials",
        "DEXTER_LAB.hearthMaterials"
      ]
    },
    {
      key: "terrain",
      role: "terrain",
      aliases: [
        "HEARTH_TERRAIN",
        "HEARTH.terrain",
        "HEARTH.terrainAuthority",
        "HEARTH.landmap",
        "HEARTH.landMap",
        "DEXTER_LAB.hearthTerrain"
      ]
    },
    {
      key: "landChannel",
      role: "land-channel",
      aliases: [
        "HEARTH_LAND_CHANNEL",
        "HEARTH.landChannel",
        "HEARTH.canvasLandChannel",
        "DEXTER_LAB.hearthLandChannel"
      ]
    },
    {
      key: "waterChannel",
      role: "water-channel",
      aliases: [
        "HEARTH_WATER_CHANNEL",
        "HEARTH.waterChannel",
        "HEARTH.canvasWaterChannel",
        "DEXTER_LAB.hearthWaterChannel"
      ]
    },
    {
      key: "airChannel",
      role: "air-channel",
      aliases: [
        "HEARTH_AIR_CHANNEL",
        "HEARTH.airChannel",
        "HEARTH.atmosphere",
        "HEARTH.atmosphereAuthority",
        "DEXTER_LAB.hearthAirChannel"
      ]
    },
    {
      key: "ocean",
      role: "ocean",
      aliases: [
        "HEARTH_OCEAN",
        "HEARTH.ocean",
        "HEARTH.oceanAuthority",
        "DEXTER_LAB.hearthOcean"
      ]
    },
    {
      key: "tectonics",
      role: "tectonics",
      aliases: [
        "HEARTH_TECTONICS",
        "HEARTH.tectonics",
        "HEARTH.tectonicsAuthority",
        "DEXTER_LAB.hearthTectonics"
      ]
    },
    {
      key: "hexFourPairAuthority",
      role: "hex-four-pair-authority",
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexFourPairAuthority",
        "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority"
      ]
    }
  ]);

  const SAMPLE_METHODS = Object.freeze([
    "sample",
    "sampleAt",
    "sampleLatLon",
    "sampleLonLat",
    "readSample",
    "getSample",
    "getCell",
    "cellAt",
    "readCell",
    "lookup",
    "classify",
    "classifyAt",
    "materialAt",
    "hydrologyAt",
    "elevationAt",
    "heightAt",
    "getHeight",
    "getElevation",
    "getStateAt",
    "project",
    "evaluate",
    "query"
  ]);

  const ARRAY_KEYS = Object.freeze([
    "samples",
    "cells",
    "map",
    "atlas",
    "tiles",
    "states",
    "grid",
    "data",
    "points",
    "pixels",
    "texture",
    "values"
  ]);

  const SOURCE_EXPORT_METHODS = Object.freeze([
    "getSamples",
    "getCells",
    "getMap",
    "getAtlas",
    "getGrid",
    "getTexture",
    "getStateMap",
    "getHeightMap",
    "getMaterialMap",
    "getHydrologyMap"
  ]);

  const state = {
    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    started: false,
    disposed: false,

    mountSelector: "#hearthCanvasMount",
    stageSelector: "#hearthGlobeStage",
    primaryCanvasSelector: "NONE",
    primaryCanvasId: "NONE",
    surfaceIdentityUnified: false,
    visibleCanvasAttributeApplied: false,
    expressionSurfaceAttributeApplied: false,

    canvasElementFound: false,
    canvasElementCount: 0,
    canvasCreatedByCanvasHub: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasCssWidth: 0,
    canvasCssHeight: 0,
    devicePixelRatio: 1,

    carrierSurfaceReady: false,
    carrierSurfaceProofReady: false,
    carrierSurfaceStatus: "WAITING_BOOT",
    carrierSurfaceFailureReason: "WAITING_BOOT",

    sourceHold: true,
    sourceHoldClass: "WAITING_BOOT",
    sourceHoldReason: "WAITING_BOOT",
    sourceHoldFallbackDrawn: false,
    sourceHoldFallbackVisible: false,
    sourceHoldFallbackDrawCount: 0,
    sourceHoldRescanActive: false,
    sourceHoldRescanCount: 0,

    planetSurfaceThresholdActive: true,
    planetSurfaceThresholdStatus: "WAITING_BOOT",
    planetSurfaceThresholdPassed: false,
    planetSurfaceReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE_SOURCE_HOLD",
    visiblePlanetProofSuppressedReason: "WAITING_BOOT",

    thresholdSampleRatioRequired: SOURCE_THRESHOLD_RATIO,
    thresholdProbeWidth: SOURCE_THRESHOLD_PROBE_W,
    thresholdProbeHeight: SOURCE_THRESHOLD_PROBE_H,
    thresholdSampleTotal: 0,
    thresholdSampleSuccessCount: 0,
    thresholdSampleMissCount: 0,
    thresholdSampleErrorCount: 0,
    thresholdSampleSuccessRatio: 0,
    thresholdFirstFailedCoordinate: "WAITING_BOOT",

    sourceAuthorityObservedCount: 0,
    sourceAuthorityNames: [],
    sourceSampleCapableCount: 0,
    sourceSampleCapableNames: [],
    sourceAdapterStatus: "NOT_SCANNED",
    activeSourceClass: "NOT_SCANNED",
    activeSourceRole: "NONE",
    activeSourceNames: [],
    activeTextureBuilt: false,
    activeTextureStatus: "NOT_BUILT",
    activeTextureWidth: TEXTURE_W,
    activeTextureHeight: TEXTURE_H,
    textureBuiltFromGovernedSource: false,
    texturePixelVariancePresent: false,
    textureUniqueColorCount: 0,

    sourceSampleSuccessCount: 0,
    sourceSampleMissCount: 0,
    sourceSampleErrorCount: 0,
    sourceFallbackCarrierActive: false,
    fallbackClass: "NONE",
    fallbackReason: "NONE",

    drawLoopActive: false,
    rafId: 0,
    frameCount: 0,
    drawCount: 0,
    receivePacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    controlPacketCount: 0,
    viewPacketCount: 0,
    hexGatePacketCount: 0,
    hexGateDeliveryCount: 0,
    surfaceUnificationCount: 0,
    resizeCount: 0,
    receiptPublishCount: 0,
    aliasPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    viewState: {
      yaw: 0.48,
      pitch: -0.08,
      zoom: 1,
      phase: 0,
      minPitch: -1.25,
      maxPitch: 1.25,
      minZoom: 0.55,
      maxZoom: 2.4
    },

    lastPacketType: "NONE",
    lastPacketSource: "NONE",
    lastInputType: "NONE",
    lastRejectedReason: "",
    lastValidationStatus: "WAITING_PACKET",
    lastDrawReason: "NOT_DRAWN",
    lastDrawAt: "",
    lastMountedAt: "",
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_HUB_V12_6_LOADED",

    pixelSampleStatus: "NOT_SAMPLED",
    pixelVisible: false,
    visiblePixelCount: 0,
    alphaPixelCount: 0,
    uniqueColorCount: 0,
    pixelVariancePresent: false,
    pixelSampleReason: "NOT_SAMPLED",

    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceReceiverMethod: "NONE",
    hexSurfaceDeliveryStatus: "WAITING_CANVAS_HEX_GATE_PACKET",

    controlObserved: false,
    controlSource: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

    postgameStatus: "CANVAS_HUB_LOADED_WAITING_BOOT",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_HUB_AND_WAIT_FOR_PLANET_SURFACE_THRESHOLD",

    events: [],
    errors: [],
    surfaces: [],

    ...NO_CLAIMS
  };

  const api = {};
  let sourceAdapters = [];
  let texture = null;
  let textureMeta = null;
  let sourceHoldTimer = 0;
  let lastFrameTime = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 180);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 120);
    state.errorCount = state.errors.length;
    state.latestEvent = item.code;
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

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && (isObject(value) || isFunction(value))) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();

      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getControlReceipt",
      "getControlSummary",
      "getHexReceipt",
      "getHexAuthorityReceipt",
      "getHexSurfaceReceipt",
      "getFingerReceipt",
      "getPointerFingerReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.hexReceipt)) return authority.hexReceipt;
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.version
    ) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexContract",
        "hexSurfaceContract",
        "contract",
        "CONTRACT",
        "sourceContract"
      ], ""),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexReceipt",
        "hexSurfaceReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt"
      ], ""),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function safeQuery(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;

    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function safeQueryAll(selector, base = doc) {
    if (!base || !isFunction(base.querySelectorAll)) return [];

    try {
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function isCanvas(node) {
    return Boolean(node && safeString(node.tagName).toLowerCase() === "canvas");
  }

  function uniqueNodes(nodes) {
    const seen = new Set();
    const out = [];

    for (const node of nodes || []) {
      if (!node || seen.has(node)) continue;
      seen.add(node);
      out.push(node);
    }

    return out;
  }

  function getMount() {
    if (!doc) return null;

    return (
      safeQuery("#hearthCanvasMount") ||
      safeQuery("[data-hearth-canvas-mount='true']") ||
      safeQuery("[data-hearth-visible-planet-mount='true']") ||
      safeQuery("[data-hearth-planet-engine-mount='true']")
    );
  }

  function getStage() {
    if (!doc) return null;

    return (
      safeQuery("#hearthGlobeStage") ||
      safeQuery("[data-hearth-globe-stage='true']") ||
      safeQuery("[data-hearth-planet-engine-stage='true']")
    );
  }

  function collectCanvasCandidates() {
    const mount = getMount();
    const candidates = [];

    if (mount) candidates.push(...safeQueryAll("canvas", mount));

    candidates.push(...safeQueryAll("canvas[data-hearth-visible-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-expression-surface='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas-texture='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-planet-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas-hub='true']"));

    return uniqueNodes(candidates).filter(isCanvas);
  }

  function createCanvasInMount() {
    const mount = getMount();
    if (!mount || !doc || !isFunction(doc.createElement)) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = "hearthVisibleExpressionCanvas";
    canvas.setAttribute("aria-label", "Hearth source-hold carrier canvas");
    mount.appendChild(canvas);

    state.canvasCreatedByCanvasHub = true;

    record("HEARTH_CANVAS_CARRIER_SURFACE_CREATED_IN_EXISTING_MOUNT", {
      mountSelector: "#hearthCanvasMount",
      canvasId: canvas.id,
      htmlContractMutated: false
    });

    return canvas;
  }

  function markCanvasIdentity(canvas, index = 0) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthPlanetCanvas = "true";
    canvas.dataset.hearthCanvasContract = PUBLIC_CONTRACT;
    canvas.dataset.hearthCanvasReceipt = PUBLIC_RECEIPT;
    canvas.dataset.hearthCanvasInternalImplementationContract = INTERNAL_IMPLEMENTATION_CONTRACT;
    canvas.dataset.hearthCanvasInternalImplementationReceipt = INTERNAL_IMPLEMENTATION_RECEIPT;
    canvas.dataset.hearthCanvasSurfaceIdentityUnified = "true";
    canvas.dataset.hearthCanvasSourceHoldThresholdReceiver = "true";
    canvas.dataset.hearthCanvasCarrierSurfaceReady = String(state.carrierSurfaceReady === true);
    canvas.dataset.hearthCanvasPlanetSurfaceReady = String(state.planetSurfaceReady === true);
    canvas.dataset.hearthCanvasVisiblePlanetProofReady = String(state.visiblePlanetProofReady === true);
    canvas.dataset.hearthCanvasGeneratedImage = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.hearthCanvasSurfaceIndex = String(index);

    if (!canvas.id) {
      canvas.id = index === 0 ? "hearthVisibleExpressionCanvas" : `hearthVisibleExpressionCanvas${index + 1}`;
    }

    try {
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Hearth live 2D carrier surface");
    } catch (_error) {}

    state.visibleCanvasAttributeApplied = true;
    state.expressionSurfaceAttributeApplied = true;
  }

  function applyCanvasStyle(canvas, cssSize) {
    if (!canvas || !canvas.style) return;

    const sizeText = `${Math.max(1, Math.round(cssSize))}px`;

    try {
      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("box-sizing", "border-box", "important");
      canvas.style.setProperty("width", sizeText, "important");
      canvas.style.setProperty("height", sizeText, "important");
      canvas.style.setProperty("min-width", "238px", "important");
      canvas.style.setProperty("min-height", "238px", "important");
      canvas.style.setProperty("max-width", "100%", "important");
      canvas.style.setProperty("max-height", "calc(100svh - 144px)", "important");
      canvas.style.setProperty("aspect-ratio", "1 / 1", "important");
      canvas.style.setProperty("object-fit", "contain", "important");
      canvas.style.setProperty("margin", "auto", "important");
      canvas.style.setProperty("border-radius", "50%", "important");
      canvas.style.setProperty("opacity", "1", "important");
      canvas.style.setProperty("visibility", "visible", "important");
      canvas.style.setProperty("pointer-events", "auto", "important");
      canvas.style.setProperty("touch-action", "none", "important");
      canvas.style.setProperty("user-select", "none", "important");
      canvas.style.setProperty("-webkit-user-select", "none", "important");
      canvas.style.setProperty("background", "transparent", "important");
    } catch (_error) {}
  }

  function measureAvailableSize(canvas) {
    const mount = getMount();
    const stage = getStage();
    const viewportW = root.innerWidth || 720;
    const viewportH = root.innerHeight || 720;

    let mountRect = null;
    let stageRect = null;
    let canvasRect = null;

    try {
      mountRect = mount && isFunction(mount.getBoundingClientRect) ? mount.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      stageRect = stage && isFunction(stage.getBoundingClientRect) ? stage.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      canvasRect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {}

    const canvasRectSize = canvasRect ? Math.min(canvasRect.width || 0, canvasRect.height || 0) : 0;
    const mountSize = mountRect ? Math.min(mountRect.width || 0, mountRect.height || 0) : 0;
    const stageSize = stageRect ? Math.min(stageRect.width || 0, stageRect.height || 0) : 0;
    const viewportSize = Math.min(viewportW, viewportH);

    const candidate = firstDefined(
      canvasRectSize > 32 ? canvasRectSize : undefined,
      mountSize > 32 ? mountSize : undefined,
      stageSize > 32 ? Math.max(238, stageSize - 112) : undefined,
      Math.max(238, Math.min(860, viewportSize * 0.78))
    );

    return clamp(candidate, 238, Math.min(920, Math.max(238, viewportSize * 0.92)));
  }

  function prepareCanvas(canvas, index = 0) {
    if (!canvas || !isCanvas(canvas)) return null;

    markCanvasIdentity(canvas, index);

    const cssSize = measureAvailableSize(canvas);
    applyCanvasStyle(canvas, cssSize);

    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const width = Math.max(238, Math.min(760, Math.round(cssSize * dpr)));
    const height = width;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      state.resizeCount += 1;
    }

    let ctx = null;
    let ctxStatus = "CANVAS_CONTEXT_2D_NOT_READY";

    try {
      ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      ctxStatus = ctx ? "CANVAS_CONTEXT_2D_READY" : "CANVAS_CONTEXT_2D_NULL";
    } catch (_error) {
      try {
        ctx = canvas.getContext("2d");
        ctxStatus = ctx ? "CANVAS_CONTEXT_2D_READY_FALLBACK" : "CANVAS_CONTEXT_2D_NULL";
      } catch (error) {
        recordError("HEARTH_CANVAS_CONTEXT_2D_FAILED", error, { canvasId: canvas.id || "NONE" });
        ctx = null;
        ctxStatus = "CANVAS_CONTEXT_2D_ERROR";
      }
    }

    return {
      canvas,
      ctx,
      ctxStatus,
      cssSize,
      width,
      height,
      dpr,
      id: canvas.id || "NONE",
      selector: "canvas[data-hearth-expression-surface='true']"
    };
  }

  function inspectPrimaryCanvasGeometry(canvas) {
    if (!canvas) {
      state.canvasRectNonzero = false;
      state.canvasComputedVisible = false;
      state.canvasViewportIntersecting = false;
      return;
    }

    let rect = null;
    let style = null;

    try {
      rect = canvas.getBoundingClientRect();
    } catch (_error) {}

    try {
      style = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
    } catch (_error) {}

    const width = rect ? Number(rect.width || 0) : 0;
    const height = rect ? Number(rect.height || 0) : 0;
    const rectNonzero = width > 0 && height > 0;

    state.canvasRectNonzero = rectNonzero;
    state.canvasComputedVisible =
      rectNonzero &&
      (!style ||
        (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || 1) !== 0
        ));

    state.canvasViewportIntersecting =
      rectNonzero &&
      rect.left < (root.innerWidth || 0) &&
      rect.right > 0 &&
      rect.top < (root.innerHeight || 0) &&
      rect.bottom > 0;
  }

  function unifySurfaceIdentity(reason = "surface-unification") {
    let canvases = collectCanvasCandidates();

    if (!canvases.length) {
      const created = createCanvasInMount();
      if (created) canvases = [created];
    }

    const prepared = canvases
      .map((canvas, index) => prepareCanvas(canvas, index))
      .filter((entry) => entry && entry.canvas && entry.ctx);

    state.surfaces = prepared.map((entry, index) => ({
      index,
      id: entry.id,
      selector: entry.selector,
      width: entry.width,
      height: entry.height,
      cssSize: entry.cssSize,
      ctxStatus: entry.ctxStatus,
      visibleCanvas: true,
      expressionSurface: true
    }));

    state.canvasElementFound = prepared.length > 0;
    state.canvasElementCount = prepared.length;
    state.canvasContext2dReady = prepared.length > 0;
    state.surfaceIdentityUnified = prepared.length > 0;
    state.canvasWidth = prepared[0] ? prepared[0].width : 0;
    state.canvasHeight = prepared[0] ? prepared[0].height : 0;
    state.canvasCssWidth = prepared[0] ? prepared[0].cssSize : 0;
    state.canvasCssHeight = prepared[0] ? prepared[0].cssSize : 0;
    state.devicePixelRatio = prepared[0] ? prepared[0].dpr : 1;
    state.primaryCanvasId = prepared[0] ? prepared[0].id : "NONE";
    state.primaryCanvasSelector = prepared[0] ? "canvas[data-hearth-expression-surface='true']" : "NONE";
    state.surfaceUnificationCount += 1;

    inspectPrimaryCanvasGeometry(prepared[0] ? prepared[0].canvas : null);
    evaluateCarrierSurfaceThreshold();

    record("HEARTH_CANVAS_CARRIER_SURFACE_IDENTITY_UNIFIED", {
      reason,
      canvasElementCount: prepared.length,
      primaryCanvasId: state.primaryCanvasId,
      carrierSurfaceReady: state.carrierSurfaceReady,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied
    });

    return prepared;
  }

  function evaluateCarrierSurfaceThreshold() {
    const ready = Boolean(
      state.canvasElementFound &&
      state.canvasContext2dReady &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible
    );

    state.carrierSurfaceReady = ready;
    state.carrierSurfaceProofReady = ready;
    state.carrierSurfaceStatus = ready
      ? "CARRIER_SURFACE_READY"
      : "CARRIER_SURFACE_NOT_READY";

    if (!state.canvasElementFound) {
      state.carrierSurfaceFailureReason = "CANVAS_ELEMENT_FOUND_FALSE";
    } else if (!state.canvasContext2dReady) {
      state.carrierSurfaceFailureReason = "CANVAS_CONTEXT_2D_READY_FALSE";
    } else if (!state.canvasRectNonzero) {
      state.carrierSurfaceFailureReason = "CANVAS_RECT_NONZERO_FALSE";
    } else if (!state.canvasComputedVisible) {
      state.carrierSurfaceFailureReason = "CANVAS_COMPUTED_VISIBLE_FALSE";
    } else {
      state.carrierSurfaceFailureReason = "NONE";
    }

    return ready;
  }

  function readControlAuthority() {
    const found = firstGlobal(CONTROL_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthControlsContract,
      ds.hearthControlContract,
      ds.hearthSouthControlFileContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthControlsReceipt,
      ds.hearthControlReceipt,
      ds.hearthSouthControlFileReceipt
    );

    state.controlObserved = Boolean(found.value || contract);
    state.controlSource = found.name;
    state.controlContract = contract || "UNKNOWN";
    state.controlReceipt = receiptName || "UNKNOWN";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN"
    };
  }

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexSurfaceContract,
      ds.hearthHexSurfaceRendererContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexSurfaceReceipt,
      ds.hearthHexSurfaceRendererReceipt
    );

    state.hexSurfaceObserved = Boolean(found.value || contract);
    state.hexSurfaceSource = found.name;
    state.hexSurfaceContract = contract || "UNKNOWN";
    state.hexSurfaceReceipt = receiptName || "UNKNOWN";
    state.hexSurfaceReceiverMethod = resolveHexSurfaceReceiver(found.value) || "NONE";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      method: state.hexSurfaceReceiverMethod
    };
  }

  function resolveHexSurfaceReceiver(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "receivePlanetaryViewControlPacket",
      "receiveViewControlPacket"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function collectSourceAuthorities() {
    const out = [];

    for (const group of SOURCE_GROUPS) {
      const found = firstGlobal(group.aliases);
      if (!found.value) continue;

      const receipt = readAuthorityReceipt(found.value) || {};
      out.push({
        key: group.key,
        role: group.role,
        name: found.name,
        authority: found.value,
        receipt,
        contract: contractOf(receipt) || contractOf(found.value) || "UNKNOWN",
        receiptName: receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN"
      });
    }

    state.sourceAuthorityObservedCount = out.length;
    state.sourceAuthorityNames = out.map((item) => item.name);

    return out;
  }

  function discoverGovernedSourceAdapters(reason = "discover") {
    const authorities = collectSourceAuthorities();
    const adapters = [];

    for (const item of authorities) {
      const adapter = makeSourceAdapter(item);
      if (!adapter) continue;

      const probe = probeAdapter(adapter);
      adapter.sampleCapable = probe.sampleCapable;
      adapter.probeReason = probe.reason;
      adapter.probeSample = probe.sample;

      if (probe.sampleCapable) adapters.push(adapter);
    }

    sourceAdapters = adapters;

    state.sourceSampleCapableCount = adapters.length;
    state.sourceSampleCapableNames = adapters.map((adapter) => `${adapter.key}:${adapter.sourceName}`);
    state.sourceAdapterStatus = adapters.length
      ? "SAMPLE_COMPATIBLE_GOVERNED_SOURCE_ADAPTERS_READY"
      : authorities.length
        ? "SOURCE_AUTHORITIES_OBSERVED_BUT_NOT_SAMPLE_COMPATIBLE"
        : "NO_GOVERNED_SOURCE_AUTHORITIES_OBSERVED";

    state.activeSourceClass = adapters.length
      ? "GOVERNED_SOURCE_STACK_SAMPLE_ADAPTER"
      : authorities.length
        ? "SOURCE_STACK_OBSERVED_NOT_SAMPLE_COMPATIBLE"
        : "NO_GOVERNED_SOURCE_OBSERVED";

    state.activeSourceRole = adapters.length
      ? adapters.map((adapter) => adapter.role).join("+")
      : "NONE";

    state.activeSourceNames = adapters.map((adapter) => adapter.sourceName);

    record("HEARTH_CANVAS_GOVERNED_SOURCE_ADAPTER_DISCOVERY_COMPLETE", {
      reason,
      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      activeSourceClass: state.activeSourceClass,
      activeSourceNames: state.activeSourceNames
    });

    return adapters;
  }

  function makeSourceAdapter(source) {
    if (!source || !source.authority) return null;

    const directArrayAdapter = makeArrayAdapterFromSource(source, source.authority, "authority");
    if (directArrayAdapter) return directArrayAdapter;

    const exportedArrayAdapter = makeExportedArrayAdapter(source);
    if (exportedArrayAdapter) return exportedArrayAdapter;

    const methodAdapter = makeMethodAdapter(source);
    if (methodAdapter) return methodAdapter;

    return null;
  }

  function makeExportedArrayAdapter(source) {
    const authority = source.authority;
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const method of SOURCE_EXPORT_METHODS) {
      if (!isFunction(authority[method])) continue;

      try {
        const exported = authority[method]();
        const adapter = makeArrayAdapterFromSource(source, exported, method);
        if (adapter) return adapter;
      } catch (_error) {}
    }

    return null;
  }

  function makeMethodAdapter(source) {
    const authority = source.authority;
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const method of SAMPLE_METHODS) {
      if (!isFunction(authority[method])) continue;

      return {
        key: source.key,
        role: source.role,
        sourceName: source.name,
        contract: source.contract,
        receipt: source.receiptName,
        kind: "method",
        method,
        sample(lon, lat, u, v) {
          return callSampleMethod(authority, method, lon, lat, u, v);
        }
      };
    }

    return null;
  }

  function callSampleMethod(authority, method, lon, lat, u, v) {
    const payload = {
      lon,
      lng: lon,
      longitude: lon,
      lat,
      latitude: lat,
      u,
      v,
      x: u,
      y: v,
      theta: lon,
      phi: lat,
      route: ROUTE,
      receiver: FILE,
      canvasReceiverOnly: true
    };

    try {
      return authority[method](payload);
    } catch (_firstError) {
      try {
        return authority[method](lon, lat);
      } catch (_secondError) {
        try {
          return authority[method](u, v);
        } catch (error) {
          state.sourceSampleErrorCount += 1;
          if (state.sourceSampleErrorCount < 12) {
            recordError("HEARTH_CANVAS_SOURCE_SAMPLE_METHOD_FAILED", error, { method });
          }
          return null;
        }
      }
    }
  }

  function makeArrayAdapterFromSource(source, candidate, originKey) {
    if (!candidate) return null;

    if (Array.isArray(candidate) || ArrayBuffer.isView(candidate)) {
      const width = inferArrayWidth(candidate);
      const height = Math.ceil(candidate.length / width);

      return {
        key: source.key,
        role: source.role,
        sourceName: source.name,
        contract: source.contract,
        receipt: source.receiptName,
        kind: "array",
        arrayKey: originKey,
        width,
        height,
        data: candidate,
        sample(_lon, _lat, u, v) {
          const x = clamp(Math.floor(u * width), 0, width - 1);
          const y = clamp(Math.floor(v * height), 0, height - 1);
          const index = y * width + x;
          return candidate[index] !== undefined ? candidate[index] : null;
        }
      };
    }

    if (!isObject(candidate)) return null;

    const found = findArrayLikeSource(candidate);
    if (!found) return null;

    const width = Math.max(1, Math.floor(safeNumber(found.width, inferArrayWidth(found.data))));
    const height = Math.max(1, Math.floor(safeNumber(found.height, Math.ceil(found.data.length / width))));

    return {
      key: source.key,
      role: source.role,
      sourceName: source.name,
      contract: source.contract,
      receipt: source.receiptName,
      kind: "array",
      arrayKey: `${originKey}:${found.key}`,
      width,
      height,
      data: found.data,
      sample(_lon, _lat, u, v) {
        const x = clamp(Math.floor(u * width), 0, width - 1);
        const y = clamp(Math.floor(v * height), 0, height - 1);
        const index = y * width + x;
        return found.data[index] !== undefined ? found.data[index] : null;
      }
    };
  }

  function findArrayLikeSource(authority) {
    for (const key of ARRAY_KEYS) {
      const value = authority[key];

      if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return {
          key,
          data: value,
          width: safeNumber(authority.width || authority.mapWidth || authority.columns || authority.cols, inferArrayWidth(value)),
          height: safeNumber(authority.height || authority.mapHeight || authority.rows, Math.ceil(value.length / inferArrayWidth(value)))
        };
      }

      if (isObject(value)) {
        for (const nestedKey of ARRAY_KEYS) {
          const nested = value[nestedKey];
          if (Array.isArray(nested) || ArrayBuffer.isView(nested)) {
            return {
              key: `${key}.${nestedKey}`,
              data: nested,
              width: safeNumber(value.width || value.mapWidth || value.columns || value.cols || authority.width, inferArrayWidth(nested)),
              height: safeNumber(value.height || value.mapHeight || value.rows || authority.height, Math.ceil(nested.length / inferArrayWidth(nested)))
            };
          }
        }
      }
    }

    return null;
  }

  function inferArrayWidth(data) {
    const len = data && data.length ? data.length : 256;
    const rootLen = Math.sqrt(len);
    if (Math.abs(rootLen - Math.round(rootLen)) < 0.001) return Math.round(rootLen);
    if (len % 512 === 0) return 512;
    if (len % 256 === 0) return 256;
    if (len % 128 === 0) return 128;
    if (len % 64 === 0) return 64;
    return Math.max(16, Math.round(rootLen));
  }

  function probeAdapter(adapter) {
    const tests = [
      [0, 0],
      [0.18, 0.22],
      [0.32, 0.64],
      [0.5, 0.5],
      [0.72, 0.38],
      [0.9, 0.7]
    ];

    for (const pair of tests) {
      const u = pair[0];
      const v = pair[1];
      const lon = uToLon(u);
      const lat = vToLat(v);
      const raw = adapter.sample(lon, lat, u, v);
      const normalized = normalizeSourceSample(raw, adapter);

      if (normalized && normalized.meaningful) {
        return {
          sampleCapable: true,
          reason: "SAMPLE_RETURNED_MEANINGFUL_VALUE",
          sample: normalized
        };
      }
    }

    return {
      sampleCapable: false,
      reason: "NO_MEANINGFUL_SAMPLE_RETURNED",
      sample: null
    };
  }

  function uToLon(u) {
    return (u - 0.5) * Math.PI * 2;
  }

  function vToLat(v) {
    return (0.5 - v) * Math.PI;
  }

  function lonLatToUv(lon, lat) {
    const u = ((lon / (Math.PI * 2)) + 0.5) % 1;
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    return { u: u < 0 ? u + 1 : u, v };
  }

  function normalizeSourceSample(raw, adapter) {
    if (raw === undefined || raw === null) return null;

    if (typeof raw === "number") {
      return {
        meaningful: true,
        sourceKey: adapter.key,
        sourceRole: adapter.role,
        elevation: normalizeSigned(raw),
        water: undefined,
        land: undefined,
        material: "",
        className: ""
      };
    }

    if (typeof raw === "string") {
      return {
        meaningful: true,
        sourceKey: adapter.key,
        sourceRole: adapter.role,
        elevation: 0,
        water: stringLooksWater(raw),
        land: stringLooksLand(raw),
        material: raw,
        className: raw
      };
    }

    if (Array.isArray(raw) || ArrayBuffer.isView(raw)) {
      if (raw.length >= 4 && everyFirstNumbers(raw, 4)) {
        return {
          meaningful: true,
          sourceKey: adapter.key,
          sourceRole: adapter.role,
          rgba: [
            clamp(Math.round(Number(raw[0])), 0, 255),
            clamp(Math.round(Number(raw[1])), 0, 255),
            clamp(Math.round(Number(raw[2])), 0, 255),
            clamp(Math.round(Number(raw[3])), 0, 255)
          ],
          elevation: 0,
          water: false,
          land: true,
          material: "rgba-source",
          className: "rgba-source"
        };
      }

      if (raw.length) return normalizeSourceSample(raw[0], adapter);
      return null;
    }

    if (!isObject(raw)) return null;

    const className = firstNonEmpty(
      raw.className,
      raw.class,
      raw.kind,
      raw.type,
      raw.terrainClass,
      raw.materialClass,
      raw.hydrologyClass,
      raw.surfaceClass,
      raw.biome,
      raw.material,
      raw.name
    );

    const material = firstNonEmpty(raw.material, raw.materialClass, raw.terrainMaterial, className);

    const elevation = firstDefined(
      raw.elevation,
      raw.height,
      raw.altitude,
      raw.z,
      raw.relief,
      raw.pressure,
      raw.value,
      raw.stateValue
    );

    const waterValue = firstDefined(
      raw.water,
      raw.isWater,
      raw.ocean,
      raw.isOcean,
      raw.sea,
      raw.lake,
      raw.hydrology,
      raw.waterMask
    );

    const landValue = firstDefined(
      raw.land,
      raw.isLand,
      raw.landMask,
      raw.terrain,
      raw.solid,
      raw.dry
    );

    const rgba = readRgba(raw);

    const water =
      waterValue !== undefined
        ? sampleValueMeansTrue(waterValue)
        : className
          ? stringLooksWater(className)
          : undefined;

    const land =
      landValue !== undefined
        ? sampleValueMeansTrue(landValue)
        : className
          ? stringLooksLand(className)
          : undefined;

    const normalized = {
      meaningful: Boolean(
        className ||
        material ||
        elevation !== undefined ||
        water !== undefined ||
        land !== undefined ||
        rgba
      ),
      sourceKey: adapter.key,
      sourceRole: adapter.role,
      elevation: elevation !== undefined ? normalizeSigned(elevation) : 0,
      water,
      land,
      material,
      className,
      moisture: normalize01(firstDefined(raw.moisture, raw.humidity, raw.wetness), 0),
      temperature: normalizeSigned(firstDefined(raw.temperature, raw.temp), 0),
      state: firstDefined(raw.state, raw.stateIndex, raw.cell, raw.id, raw.code),
      rgba
    };

    return normalized.meaningful ? normalized : null;
  }

  function everyFirstNumbers(list, count) {
    for (let index = 0; index < count; index += 1) {
      if (!Number.isFinite(Number(list[index]))) return false;
    }
    return true;
  }

  function readRgba(raw) {
    const r = firstDefined(raw.r, raw.red);
    const g = firstDefined(raw.g, raw.green);
    const b = firstDefined(raw.b, raw.blue);
    const a = firstDefined(raw.a, raw.alpha);

    if (r !== undefined && g !== undefined && b !== undefined) {
      return [
        clamp(Math.round(safeNumber(r, 0)), 0, 255),
        clamp(Math.round(safeNumber(g, 0)), 0, 255),
        clamp(Math.round(safeNumber(b, 0)), 0, 255),
        clamp(Math.round(safeNumber(a, 255)), 0, 255)
      ];
    }

    if (Array.isArray(raw.rgba) && raw.rgba.length >= 3) {
      return [
        clamp(Math.round(safeNumber(raw.rgba[0], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.rgba[1], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.rgba[2], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.rgba[3], 255)), 0, 255)
      ];
    }

    if (Array.isArray(raw.color) && raw.color.length >= 3) {
      return [
        clamp(Math.round(safeNumber(raw.color[0], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.color[1], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.color[2], 0)), 0, 255),
        clamp(Math.round(safeNumber(raw.color[3], 255)), 0, 255)
      ];
    }

    return null;
  }

  function normalizeSigned(value) {
    const n = safeNumber(value, 0);
    if (n > 1 || n < -1) return clamp(n / 255, -1, 1);
    return clamp(n, -1, 1);
  }

  function normalize01(value, fallback = 0) {
    if (value === undefined || value === null || value === "") return fallback;
    const n = safeNumber(value, fallback);
    if (n > 1) return clamp(n / 255, 0, 1);
    return clamp(n, 0, 1);
  }

  function sampleValueMeansTrue(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0.5;
    const text = safeString(value).toLowerCase();
    if (!text) return false;
    if (["true", "yes", "land", "water", "ocean", "sea", "dry", "solid"].includes(text)) return true;
    if (["false", "no", "none", "void"].includes(text)) return false;
    return stringLooksWater(text) || stringLooksLand(text);
  }

  function stringLooksWater(value) {
    const text = safeString(value).toLowerCase();
    return /water|ocean|sea|lake|river|bay|basin|hydro|reef|shelf|channel|submerged|wet/.test(text);
  }

  function stringLooksLand(value) {
    const text = safeString(value).toLowerCase();
    return /land|terrain|soil|rock|mountain|ridge|crust|plate|desert|forest|plain|summit|dry|continent|island/.test(text);
  }

  function sampleGovernedSource(lon, lat) {
    const uv = lonLatToUv(lon, lat);

    if (!sourceAdapters.length) {
      state.sourceSampleMissCount += 1;
      return null;
    }

    const samples = [];

    for (const adapter of sourceAdapters) {
      const raw = adapter.sample(lon, lat, uv.u, uv.v);
      const normalized = normalizeSourceSample(raw, adapter);
      if (normalized && normalized.meaningful) samples.push(normalized);
    }

    if (!samples.length) {
      state.sourceSampleMissCount += 1;
      return null;
    }

    state.sourceSampleSuccessCount += 1;

    return mergeSourceSamples(samples, lon, lat);
  }

  function mergeSourceSamples(samples, lon, lat) {
    let landVotes = 0;
    let waterVotes = 0;
    let elevationSum = 0;
    let elevationCount = 0;
    let moistureSum = 0;
    let moistureCount = 0;
    let temperatureSum = 0;
    let temperatureCount = 0;
    let material = "";
    let className = "";
    let rgba = null;

    for (const sample of samples) {
      if (sample.rgba && !rgba) rgba = sample.rgba;
      if (sample.land === true) landVotes += weightForRole(sample.sourceRole);
      if (sample.water === true) waterVotes += weightForRole(sample.sourceRole);
      if (sample.elevation !== undefined) {
        elevationSum += sample.elevation;
        elevationCount += 1;
      }
      if (sample.moisture !== undefined) {
        moistureSum += sample.moisture;
        moistureCount += 1;
      }
      if (sample.temperature !== undefined) {
        temperatureSum += sample.temperature;
        temperatureCount += 1;
      }
      if (!material && sample.material) material = sample.material;
      if (!className && sample.className) className = sample.className;
    }

    const elevation = elevationCount ? elevationSum / elevationCount : 0;
    const moisture = moistureCount ? moistureSum / moistureCount : 0;
    const temperature = temperatureCount ? temperatureSum / temperatureCount : 0;

    let water = waterVotes > landVotes;
    let land = landVotes > waterVotes;

    if (!water && !land) {
      if (className && stringLooksWater(className)) water = true;
      else if (className && stringLooksLand(className)) land = true;
      else if (material && stringLooksWater(material)) water = true;
      else if (material && stringLooksLand(material)) land = true;
      else land = elevation > -0.03;
    }

    return {
      lon,
      lat,
      land,
      water,
      elevation,
      moisture,
      temperature,
      material,
      className,
      rgba,
      sourceCount: samples.length,
      sourceKeys: samples.map((sample) => sample.sourceKey)
    };
  }

  function weightForRole(role) {
    const text = safeString(role);
    if (/hydrology|water|ocean/.test(text)) return 3;
    if (/land-channel|terrain|composition/.test(text)) return 2.5;
    if (/elevation|materials/.test(text)) return 2;
    return 1;
  }

  function runGovernedSourceThresholdProbe(reason = "threshold-probe") {
    if (!sourceAdapters.length) {
      state.thresholdSampleTotal = SOURCE_THRESHOLD_PROBE_W * SOURCE_THRESHOLD_PROBE_H;
      state.thresholdSampleSuccessCount = 0;
      state.thresholdSampleMissCount = state.thresholdSampleTotal;
      state.thresholdSampleErrorCount = state.sourceSampleErrorCount;
      state.thresholdSampleSuccessRatio = 0;
      state.thresholdFirstFailedCoordinate = "SOURCE_SAMPLE_CAPABLE_COUNT";
      state.sourceHold = true;
      state.sourceHoldClass = "NO_SAMPLE_COMPATIBLE_GOVERNED_SOURCE";
      state.sourceHoldReason = state.sourceAdapterStatus;
      return false;
    }

    let total = 0;
    let success = 0;
    let misses = 0;

    for (let y = 0; y < SOURCE_THRESHOLD_PROBE_H; y += 1) {
      const v = (y + 0.5) / SOURCE_THRESHOLD_PROBE_H;

      for (let x = 0; x < SOURCE_THRESHOLD_PROBE_W; x += 1) {
        const u = (x + 0.5) / SOURCE_THRESHOLD_PROBE_W;
        const lon = uToLon(u);
        const lat = vToLat(v);
        total += 1;

        const sample = sampleGovernedSource(lon, lat);
        if (sample) success += 1;
        else misses += 1;
      }
    }

    const ratio = total ? success / total : 0;

    state.thresholdSampleTotal = total;
    state.thresholdSampleSuccessCount = success;
    state.thresholdSampleMissCount = misses;
    state.thresholdSampleErrorCount = state.sourceSampleErrorCount;
    state.thresholdSampleSuccessRatio = ratio;

    const passed = ratio >= SOURCE_THRESHOLD_RATIO;

    if (!passed) {
      state.thresholdFirstFailedCoordinate = "GOVERNED_SAMPLE_SUCCESS_RATIO";
      state.sourceHold = true;
      state.sourceHoldClass = "GOVERNED_SOURCE_THRESHOLD_NOT_MET";
      state.sourceHoldReason = `GOVERNED_SAMPLE_SUCCESS_RATIO_${ratio.toFixed(3)}_LT_${SOURCE_THRESHOLD_RATIO}`;
    } else {
      state.thresholdFirstFailedCoordinate = "NONE_THRESHOLD_PROBE_PASSED";
      state.sourceHold = false;
      state.sourceHoldClass = "NONE";
      state.sourceHoldReason = "NONE_GOVERNED_SOURCE_THRESHOLD_PROBE_PASSED";
    }

    record("HEARTH_CANVAS_GOVERNED_SOURCE_THRESHOLD_PROBE_COMPLETE", {
      reason,
      total,
      success,
      misses,
      ratio,
      required: SOURCE_THRESHOLD_RATIO,
      passed
    });

    return passed;
  }

  function buildGovernedTexture(reason = "build-texture") {
    texture = new Uint8ClampedArray(TEXTURE_W * TEXTURE_H * 4);
    textureMeta = {
      width: TEXTURE_W,
      height: TEXTURE_H,
      sourceClass: state.activeSourceClass,
      builtAt: nowIso(),
      reason
    };

    if (!sourceAdapters.length) {
      texture = null;
      state.activeTextureBuilt = false;
      state.textureBuiltFromGovernedSource = false;
      state.texturePixelVariancePresent = false;
      state.textureUniqueColorCount = 0;
      state.activeTextureStatus = "TEXTURE_NOT_BUILT_NO_SAMPLE_COMPATIBLE_SOURCE";
      return null;
    }

    let visible = 0;
    let misses = 0;
    const unique = new Set();

    for (let y = 0; y < TEXTURE_H; y += 1) {
      const v = y / (TEXTURE_H - 1);

      for (let x = 0; x < TEXTURE_W; x += 1) {
        const u = x / (TEXTURE_W - 1);
        const lon = uToLon(u);
        const lat = vToLat(v);
        const sample = sampleGovernedSource(lon, lat);

        let color;

        if (sample) {
          color = colorFromSourceSample(sample, lon, lat);
          visible += 1;
        } else {
          color = neutralCarrierColor(lon, lat);
          misses += 1;
        }

        const index = (y * TEXTURE_W + x) * 4;
        texture[index] = color[0];
        texture[index + 1] = color[1];
        texture[index + 2] = color[2];
        texture[index + 3] = color[3];

        if ((x % 16 === 0) && (y % 16 === 0)) {
          unique.add(`${color[0]},${color[1]},${color[2]},${color[3]}`);
        }
      }
    }

    state.activeTextureBuilt = true;
    state.textureBuiltFromGovernedSource = true;
    state.textureUniqueColorCount = unique.size;
    state.texturePixelVariancePresent = unique.size >= 4;
    state.activeTextureStatus = "GOVERNED_SOURCE_TEXTURE_BUILT";
    state.activeTextureWidth = TEXTURE_W;
    state.activeTextureHeight = TEXTURE_H;

    record("HEARTH_CANVAS_GOVERNED_TEXTURE_BUILT", {
      reason,
      activeTextureStatus: state.activeTextureStatus,
      visibleSamples: visible,
      missedSamples: misses,
      textureUniqueColorCount: state.textureUniqueColorCount,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      sourceSampleCapableCount: state.sourceSampleCapableCount
    });

    return texture;
  }

  function colorFromSourceSample(sample, lon, lat) {
    if (sample.rgba) return sample.rgba;

    const e = clamp(sample.elevation || 0, -1, 1);
    const moisture = clamp(sample.moisture || 0, 0, 1);
    const grain = fineNoise(lon, lat);
    const material = safeString(sample.material || sample.className).toLowerCase();

    if (sample.water) {
      const depth = clamp(-e * 0.75 + 0.38 + grain * 0.06, 0, 1);
      return [
        Math.round(7 + 22 * depth),
        Math.round(42 + 80 * depth),
        Math.round(94 + 132 * depth),
        255
      ];
    }

    if (/ice|snow|polar|glacier/.test(material) || Math.abs(lat) > 1.28) {
      const shade = clamp(0.78 + e * 0.15 + grain * 0.06, 0, 1);
      return [
        Math.round(186 + 48 * shade),
        Math.round(207 + 34 * shade),
        Math.round(214 + 32 * shade),
        255
      ];
    }

    if (/mount|ridge|summit|rock|crag|plate/.test(material) || e > 0.45) {
      const shade = clamp(0.46 + e * 0.42 + grain * 0.09, 0, 1);
      return [
        Math.round(74 + 92 * shade),
        Math.round(70 + 82 * shade),
        Math.round(62 + 70 * shade),
        255
      ];
    }

    if (/desert|sand|dune|arid/.test(material) || moisture < 0.16) {
      const shade = clamp(0.52 + e * 0.22 + grain * 0.1, 0, 1);
      return [
        Math.round(112 + 108 * shade),
        Math.round(90 + 84 * shade),
        Math.round(48 + 58 * shade),
        255
      ];
    }

    if (/forest|green|basin|plain|soil|land|terrain|continent|island/.test(material) || sample.land) {
      const shade = clamp(0.36 + e * 0.28 + moisture * 0.18 + grain * 0.11, 0, 1);
      return [
        Math.round(38 + 86 * shade),
        Math.round(72 + 92 * shade),
        Math.round(46 + 62 * shade),
        255
      ];
    }

    const shade = clamp(0.42 + e * 0.26 + grain * 0.1, 0, 1);
    return [
      Math.round(58 + 85 * shade),
      Math.round(83 + 78 * shade),
      Math.round(62 + 58 * shade),
      255
    ];
  }

  function neutralCarrierColor(lon, lat) {
    const band = 0.5 + 0.5 * Math.sin(lat * 4 + lon * 1.7);
    return [
      Math.round(8 + 8 * band),
      Math.round(24 + 18 * band),
      Math.round(48 + 32 * band),
      255
    ];
  }

  function fineNoise(lon, lat) {
    const v =
      Math.sin(lon * 17.13 + lat * 11.71) * 0.45 +
      Math.sin(lon * 41.9 - lat * 19.3) * 0.28 +
      Math.sin(lon * 83.1 + lat * 61.7) * 0.14;
    return clamp(v, -1, 1);
  }

  function refreshSourceThreshold(reason = "refresh-source-threshold") {
    discoverGovernedSourceAdapters(reason);

    const thresholdReady = runGovernedSourceThresholdProbe(reason);

    if (!thresholdReady) {
      texture = null;
      state.activeTextureBuilt = false;
      state.textureBuiltFromGovernedSource = false;
      state.texturePixelVariancePresent = false;
      state.textureUniqueColorCount = 0;
      state.activeTextureStatus = "TEXTURE_HELD_BY_SOURCE_THRESHOLD";
      state.sourceFallbackCarrierActive = true;
      state.fallbackClass = "SOURCE_HOLD";
      state.fallbackReason = state.sourceHoldReason;
      evaluatePlanetSurfaceThreshold("source-threshold-held");
      return false;
    }

    buildGovernedTexture(reason);

    state.sourceFallbackCarrierActive = false;
    state.fallbackClass = "NONE";
    state.fallbackReason = "NONE";

    evaluatePlanetSurfaceThreshold("source-threshold-ready");
    return true;
  }

  function applyViewPacket(packet = {}, options = {}) {
    const source = isObject(packet.viewState) ? packet.viewState : packet;
    const current = state.viewState;

    const incomingYaw = firstDefined(source.yaw, packet.yaw);
    const incomingPitch = firstDefined(source.pitch, packet.pitch);
    const incomingZoom = firstDefined(source.zoom, packet.zoom);
    const incomingPhase = firstDefined(source.phase, packet.phase);

    const deltaYaw = safeNumber(firstDefined(packet.deltaYaw, source.deltaYaw), 0);
    const deltaPitch = safeNumber(firstDefined(packet.deltaPitch, source.deltaPitch), 0);
    const deltaZoom = safeNumber(firstDefined(packet.deltaZoom, source.deltaZoom), 0);

    const yaw = incomingYaw !== undefined
      ? safeNumber(incomingYaw, current.yaw)
      : current.yaw + deltaYaw;

    const pitch = incomingPitch !== undefined
      ? safeNumber(incomingPitch, current.pitch)
      : current.pitch + deltaPitch;

    const zoom = incomingZoom !== undefined
      ? safeNumber(incomingZoom, current.zoom)
      : current.zoom + deltaZoom;

    const phase = incomingPhase !== undefined
      ? safeNumber(incomingPhase, current.phase)
      : current.phase;

    state.viewState = {
      yaw,
      pitch: clamp(pitch, -1.25, 1.25),
      zoom: clamp(zoom, 0.55, 2.4),
      phase,
      minPitch: safeNumber(source.minPitch, current.minPitch),
      maxPitch: safeNumber(source.maxPitch, current.maxPitch),
      minZoom: safeNumber(source.minZoom, current.minZoom),
      maxZoom: safeNumber(source.maxZoom, current.maxZoom)
    };

    state.lastInputType = safeString(packet.inputType || options.inputType || "view-packet");
    state.lastPacketType = safeString(packet.packetType || packet.type || CANVAS_VIEW_PACKET);
    state.lastPacketSource = safeString(
      packet.sourceFile ||
      packet.fromFile ||
      packet.sourceAuthority ||
      packet.sourceRole ||
      options.source ||
      "UNKNOWN"
    );

    return clonePlain(state.viewState);
  }

  function validateIncomingPacket(packet, options = {}) {
    if (packet === undefined || packet === null) {
      return { accepted: true, reason: "EMPTY_PACKET_ACCEPTED_AS_DRAW_REQUEST" };
    }

    if (!isObject(packet)) {
      return { accepted: false, reason: "PACKET_NOT_OBJECT" };
    }

    if (
      packet.f13Claimed === true ||
      packet.f13CanvasClaimed === true ||
      packet.f13ClaimedByCanvas === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21Claimed === true ||
      packet.f21ClaimedByCanvas === true ||
      packet.f21SubmittedToNorth === true ||
      packet.readyTextClaimed === true ||
      packet.visualPassClaimed === true ||
      packet.finalVisualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true
    ) {
      return { accepted: false, reason: "PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };
    }

    if (packet.canvasDrawingAuthorized === false && options.allowDrawingRequest !== true) {
      return { accepted: false, reason: "PACKET_EXPLICITLY_DENIES_CANVAS_DRAWING" };
    }

    return { accepted: true, reason: "PACKET_ACCEPTED_BY_CANVAS_HUB" };
  }

  function receivePacket(packet = {}, options = {}) {
    state.receivePacketCount += 1;

    const validation = validateIncomingPacket(packet, options);
    if (!validation.accepted) {
      state.rejectedPacketCount += 1;
      state.lastRejectedReason = validation.reason;
      state.lastValidationStatus = "REJECTED";
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextOwner = "UPSTREAM_PACKET_AUTHORITY";
      state.recommendedNextFile = safeString(packet && packet.sourceFile, CONTROL_FILE);
      state.recommendedNextAction = "SEND_CANVAS_PACKET_WITHOUT_FORBIDDEN_FINAL_CLAIMS";
      state.postgameStatus = "CANVAS_PACKET_REJECTED";

      record("HEARTH_CANVAS_PACKET_REJECTED", {
        reason: validation.reason,
        packetType: packet && packet.packetType
      });

      updateDataset();
      publishReceiptAliases();

      return getReceiptLight(false);
    }

    state.acceptedPacketCount += 1;
    state.lastRejectedReason = "";
    state.lastValidationStatus = "ACCEPTED";

    applyViewPacket(packet || {}, options);

    if (options.controlPacket === true) state.controlPacketCount += 1;
    if (options.viewPacket === true) state.viewPacketCount += 1;

    if (!state.planetSurfaceReady) {
      refreshSourceThreshold("receive-packet");
    }

    drawFrame(options.reason || "receive-packet");
    sendHexGatePacket("receive-packet");

    updateDataset();
    publishReceiptAliases();

    return {
      ...getReceiptLight(false),
      carrierSurfacePacket: composeCarrierSurfacePacket("receive-packet"),
      thresholdPacket: composePlanetSurfaceThresholdPacket("receive-packet"),
      renderPacket: composeRenderPacket("receive-packet"),
      hexGatePacket: composeCanvasHexGatePacket("receive-packet")
    };
  }

  function drawFrame(reason = "draw-frame") {
    const prepared = unifySurfaceIdentity(reason);

    if (!prepared.length) {
      state.firstFailedCoordinate = "CANVAS_SURFACE_NOT_AVAILABLE";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS_BEFORE_CANVAS_BOOT";
      state.postgameStatus = "CANVAS_HUB_NO_RENDERABLE_SURFACE";
      evaluatePlanetSurfaceThreshold("no-carrier-surface");
      updateDataset();
      publishReceiptAliases();
      return getReceiptLight(false);
    }

    const governedReady =
      !state.sourceHold &&
      sourceAdapters.length > 0 &&
      texture &&
      state.textureBuiltFromGovernedSource === true &&
      state.texturePixelVariancePresent === true &&
      state.thresholdSampleSuccessRatio >= SOURCE_THRESHOLD_RATIO;

    for (const surface of prepared) {
      if (governedReady) {
        drawVisiblePlanetSurface(surface.ctx, surface.width, surface.height, reason);
      } else {
        drawSourceHoldCarrier(surface.ctx, surface.width, surface.height, reason);
      }
    }

    state.frameCount += 1;
    state.drawCount += prepared.length;
    state.lastDrawReason = reason;
    state.lastDrawAt = nowIso();
    state.updatedAt = state.lastDrawAt;

    inspectPixelSample(prepared[0].canvas, prepared[0].ctx);
    evaluatePlanetSurfaceThreshold(reason);

    updateDataset();
    publishRenderGlobals(reason);
    publishReceiptAliases();

    return getReceiptLight(false);
  }

  function evaluatePlanetSurfaceThreshold(reason = "evaluate") {
    const carrierReady = evaluateCarrierSurfaceThreshold();

    const sourceReady = Boolean(
      state.sourceSampleCapableCount >= 1 &&
      state.thresholdSampleSuccessRatio >= SOURCE_THRESHOLD_RATIO &&
      state.textureBuiltFromGovernedSource === true &&
      state.texturePixelVariancePresent === true
    );

    const pixelReady = Boolean(
      state.pixelVisible === true &&
      state.visiblePixelCount > 0 &&
      state.pixelVariancePresent === true
    );

    const passed = Boolean(carrierReady && sourceReady && pixelReady);

    state.planetSurfaceThresholdPassed = passed;
    state.planetSurfaceReady = passed;
    state.visiblePlanetProofReady = passed;
    state.visiblePlanetProofSource = passed
      ? "GOVERNED_SOURCE_CANVAS_2D_SURFACE"
      : "NONE_SOURCE_HOLD_OR_THRESHOLD_NOT_MET";

    if (!carrierReady) {
      state.planetSurfaceThresholdStatus = "THRESHOLD_HELD_CARRIER_SURFACE_NOT_READY";
      state.thresholdFirstFailedCoordinate = "CARRIER_SURFACE_READY";
      state.visiblePlanetProofSuppressedReason = state.carrierSurfaceFailureReason;
      state.sourceHold = true;
      state.sourceHoldClass = "CARRIER_SURFACE_HOLD";
      state.sourceHoldReason = state.carrierSurfaceFailureReason;
      state.firstFailedCoordinate = "CARRIER_SURFACE_READY";
      state.recommendedNextOwner = "CANVAS_HUB_OR_HTML_MOUNT";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "VERIFY_CANVAS_ELEMENT_CONTEXT_RECT_AND_VISIBILITY";
      state.postgameStatus = "CANVAS_CARRIER_SURFACE_NOT_READY";
    } else if (!sourceReady) {
      state.planetSurfaceThresholdStatus = "THRESHOLD_HELD_GOVERNED_SOURCE_NOT_READY";
      state.thresholdFirstFailedCoordinate =
        state.sourceSampleCapableCount < 1
          ? "SOURCE_SAMPLE_CAPABLE_COUNT"
          : state.thresholdSampleSuccessRatio < SOURCE_THRESHOLD_RATIO
            ? "GOVERNED_SAMPLE_SUCCESS_RATIO"
            : !state.textureBuiltFromGovernedSource
              ? "TEXTURE_BUILT_FROM_GOVERNED_SOURCE"
              : "TEXTURE_PIXEL_VARIANCE_PRESENT";

      state.sourceHold = true;
      state.sourceHoldClass = "GOVERNED_SOURCE_THRESHOLD_HOLD";
      state.sourceHoldReason = state.thresholdFirstFailedCoordinate;
      state.sourceFallbackCarrierActive = true;
      state.fallbackClass = "SOURCE_HOLD";
      state.fallbackReason = state.thresholdFirstFailedCoordinate;
      state.visiblePlanetProofSuppressedReason = state.thresholdFirstFailedCoordinate;
      state.firstFailedCoordinate = state.thresholdFirstFailedCoordinate;
      state.recommendedNextOwner = "GOVERNED_SOURCE_STACK";
      state.recommendedNextFile = "/assets/hearth/";
      state.recommendedNextAction = "LOAD_OR_EXPOSE_SAMPLE_COMPATIBLE_GOVERNED_PLANET_SOURCE_AUTHORITY";
      state.postgameStatus = "CANVAS_CARRIER_VISIBLE_SOURCE_HOLD_NO_VISIBLE_PLANET_PROOF";
    } else if (!pixelReady) {
      state.planetSurfaceThresholdStatus = "THRESHOLD_HELD_PIXEL_OUTPUT_NOT_READY";
      state.thresholdFirstFailedCoordinate =
        !state.pixelVisible
          ? "CANVAS_PIXEL_VISIBLE"
          : !state.pixelVariancePresent
            ? "PIXEL_VARIANCE_PRESENT"
            : "VISIBLE_PIXEL_COUNT";

      state.visiblePlanetProofSuppressedReason = state.thresholdFirstFailedCoordinate;
      state.firstFailedCoordinate = state.thresholdFirstFailedCoordinate;
      state.recommendedNextOwner = "CANVAS_DRAWING";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "VERIFY_GOVERNED_TEXTURE_DRAW_WRITES_VISIBLE_VARIANT_PIXELS";
      state.postgameStatus = "CANVAS_GOVERNED_SOURCE_DRAW_PIXEL_THRESHOLD_NOT_MET";
    } else {
      state.planetSurfaceThresholdStatus = "PLANET_SURFACE_THRESHOLD_PASSED";
      state.thresholdFirstFailedCoordinate = "NONE";
      state.sourceHold = false;
      state.sourceHoldClass = "NONE";
      state.sourceHoldReason = "NONE";
      state.sourceFallbackCarrierActive = false;
      state.fallbackClass = "NONE";
      state.fallbackReason = "NONE";
      state.visiblePlanetProofSuppressedReason = "NONE";
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextOwner = "TEACHER_REVIEW";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_THRESHOLDED_GOVERNED_SOURCE_VISIBLE_2D_OUTPUT_WITHOUT_READY_OR_VISUAL_PASS_CLAIM";
      state.postgameStatus = "CANVAS_PLANET_SURFACE_THRESHOLD_CONFIRMED_NO_FINAL_CLAIM";
    }

    markPrimaryCanvasThresholdDataset();

    record("HEARTH_CANVAS_PLANET_SURFACE_THRESHOLD_EVALUATED", {
      reason,
      carrierReady,
      sourceReady,
      pixelReady,
      passed,
      thresholdFirstFailedCoordinate: state.thresholdFirstFailedCoordinate,
      visiblePlanetProofReady: state.visiblePlanetProofReady
    });

    return passed;
  }

  function markPrimaryCanvasThresholdDataset() {
    const canvas = collectCanvasCandidates()[0] || null;
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasCarrierSurfaceReady = String(state.carrierSurfaceReady === true);
    canvas.dataset.hearthCanvasCarrierSurfaceProofReady = String(state.carrierSurfaceProofReady === true);
    canvas.dataset.hearthCanvasSourceHold = String(state.sourceHold === true);
    canvas.dataset.hearthCanvasSourceHoldClass = state.sourceHoldClass;
    canvas.dataset.hearthCanvasSourceHoldReason = state.sourceHoldReason;
    canvas.dataset.hearthCanvasPlanetSurfaceReady = String(state.planetSurfaceReady === true);
    canvas.dataset.hearthCanvasVisiblePlanetProofReady = String(state.visiblePlanetProofReady === true);
    canvas.dataset.hearthCanvasVisiblePlanetProofSource = state.visiblePlanetProofSource;
    canvas.dataset.hearthCanvasPlanetSurfaceThresholdStatus = state.planetSurfaceThresholdStatus;
    canvas.dataset.hearthCanvasThresholdFirstFailedCoordinate = state.thresholdFirstFailedCoordinate;
  }

  function drawSourceHoldCarrier(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0) return;

    state.sourceHoldFallbackDrawn = true;
    state.sourceHoldFallbackVisible = true;
    state.sourceHoldFallbackDrawCount += 1;

    resetCtx(ctx);

    const w = width;
    const h = height;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const radius = min * 0.42;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx * 0.55, cy * 0.36, min * 0.05, cx, cy, min * 0.72);
    bg.addColorStop(0, "rgba(12,34,62,1)");
    bg.addColorStop(0.45, "rgba(3,10,25,1)");
    bg.addColorStop(1, "rgba(1,4,12,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawStarField(ctx, w, h, state.frameCount);

    const globe = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.42, radius * 0.04, cx, cy, radius);
    globe.addColorStop(0, "rgba(42,82,118,1)");
    globe.addColorStop(0.44, "rgba(11,35,69,1)");
    globe.addColorStop(0.82, "rgba(6,18,42,1)");
    globe.addColorStop(1, "rgba(2,8,22,1)");

    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.strokeStyle = "rgba(205,232,255,.14)";

    for (let i = -3; i <= 3; i += 1) {
      const y = cy + (i / 4) * radius * 0.72;
      const rx = radius * Math.sqrt(Math.max(0.04, 1 - Math.pow((y - cy) / radius, 2)));
      ctx.beginPath();
      ctx.ellipse(cx, y, rx, radius * 0.055, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8 + state.viewState.yaw * 0.22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    drawAtmosphere(ctx, cx, cy, radius);

    ctx.save();
    ctx.fillStyle = "rgba(255,231,162,.90)";
    ctx.font = `${Math.max(12, Math.round(radius * 0.052))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SOURCE HOLD", cx, cy - radius * 0.08);

    ctx.fillStyle = "rgba(232,241,255,.72)";
    ctx.font = `${Math.max(8, Math.round(radius * 0.032))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("carrier surface only", cx, cy + radius * 0.045);
    ctx.fillText("planet threshold not met", cx, cy + radius * 0.13);
    ctx.restore();

    if (reason === "boot" || reason === "mount") {
      ctx.save();
      ctx.fillStyle = "rgba(232,241,255,.58)";
      ctx.font = `${Math.max(8, Math.round(radius * 0.028))}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("waiting for sample-compatible governed source", cx, cy + radius + Math.max(14, radius * 0.1));
      ctx.restore();
    }
  }

  function drawVisiblePlanetSurface(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0 || !texture) return;

    resetCtx(ctx);

    const w = width;
    const h = height;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const view = state.viewState;
    const zoom = clamp(view.zoom, 0.55, 2.4);
    const radius = min * 0.43 * clamp(zoom, 0.72, 1.12);

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx * 0.55, cy * 0.36, min * 0.05, cx, cy, min * 0.72);
    bg.addColorStop(0, "rgba(16,45,78,1)");
    bg.addColorStop(0.42, "rgba(4,12,29,1)");
    bg.addColorStop(1, "rgba(1,4,12,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawStarField(ctx, w, h, state.frameCount);

    const image = ctx.createImageData(w, h);
    const data = image.data;

    const yaw = view.yaw + view.phase * 0.1;
    const pitch = view.pitch * 0.44;
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cyaw = Math.cos(yaw);
    const syaw = Math.sin(yaw);

    for (let y = 0; y < h; y += 1) {
      const ny = -(y + 0.5 - cy) / radius;

      for (let x = 0; x < w; x += 1) {
        const nx = (x + 0.5 - cx) / radius;
        const rr = nx * nx + ny * ny;
        const index = (y * w + x) * 4;

        if (rr > 1) {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - rr);

        const y0 = ny * cp + z * sp;
        const z0 = z * cp - ny * sp;
        const x0 = nx;

        const wx = x0 * cyaw - z0 * syaw;
        const wz = x0 * syaw + z0 * cyaw;
        const wy = y0;

        const lon = Math.atan2(wx, wz);
        const lat = Math.asin(clamp(wy, -1, 1));

        const color = textureSample(lon, lat);
        const light = clamp(0.54 + 0.44 * (-0.38 * nx - 0.52 * ny + 0.76 * z), 0.22, 1.08);
        const edge = clamp(1 - Math.pow(rr, 2.4) * 0.44, 0.48, 1);
        const finalLight = light * edge;

        data[index] = clamp(Math.round(color[0] * finalLight + 6), 0, 255);
        data[index + 1] = clamp(Math.round(color[1] * finalLight + 8), 0, 255);
        data[index + 2] = clamp(Math.round(color[2] * finalLight + 12), 0, 255);
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    drawLatitudeLongitudeBands(ctx, cx, cy, radius, view);
    drawAtmosphere(ctx, cx, cy, radius);
    drawReceiptNeedle(ctx, cx, cy, radius, reason);

    state.viewState.phase += 0.003;
  }

  function resetCtx(ctx) {
    if (isFunction(ctx.resetTransform)) {
      try {
        ctx.resetTransform();
      } catch (_error) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function textureSample(lon, lat) {
    if (!texture) return neutralCarrierColor(lon, lat);

    const uv = lonLatToUv(lon, lat);
    const x = clamp(Math.floor(uv.u * (TEXTURE_W - 1)), 0, TEXTURE_W - 1);
    const y = clamp(Math.floor(uv.v * (TEXTURE_H - 1)), 0, TEXTURE_H - 1);
    const index = (y * TEXTURE_W + x) * 4;

    return [
      texture[index] || 0,
      texture[index + 1] || 0,
      texture[index + 2] || 0,
      texture[index + 3] || 255
    ];
  }

  function drawStarField(ctx, w, h, frame) {
    ctx.save();
    ctx.globalAlpha = 0.42;

    const count = 70;
    for (let i = 0; i < count; i += 1) {
      const x = pseudo(i * 17.13) * w;
      const y = pseudo(i * 31.71) * h;
      const flicker = 0.28 + 0.22 * Math.sin((frame + i * 3) * 0.035);
      const r = 0.55 + pseudo(i * 7.91) * 1.4;

      ctx.fillStyle = `rgba(210,238,255,${flicker})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLatitudeLongitudeBands(ctx, cx, cy, radius, view) {
    ctx.save();
    ctx.lineWidth = Math.max(0.8, radius * 0.004);
    ctx.strokeStyle = "rgba(210,238,255,.10)";

    for (let i = -3; i <= 3; i += 1) {
      const y = cy + (i / 4) * radius * 0.72 + Math.sin(view.phase + i) * radius * 0.015;
      const rx = radius * Math.sqrt(Math.max(0.04, 1 - Math.pow((y - cy) / radius, 2)));

      ctx.beginPath();
      ctx.ellipse(cx, y, rx, radius * 0.055, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8 + view.yaw * 0.22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, radius * 0.022);
    ctx.strokeStyle = "rgba(127,220,255,.24)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, radius * 0.01);
    ctx.strokeStyle = "rgba(255,231,162,.12)";
    ctx.stroke();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.24);
    glow.addColorStop(0, "rgba(127,220,255,0)");
    glow.addColorStop(0.68, "rgba(127,220,255,.10)");
    glow.addColorStop(1, "rgba(127,220,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawReceiptNeedle(ctx, cx, cy, radius, reason) {
    ctx.save();

    const angle = state.viewState.phase * 0.75 + state.viewState.yaw * 0.22;
    const x1 = cx + Math.cos(angle) * radius * 0.76;
    const y1 = cy + Math.sin(angle) * radius * 0.76;
    const x2 = cx + Math.cos(angle) * radius * 0.94;
    const y2 = cy + Math.sin(angle) * radius * 0.94;

    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.strokeStyle = "rgba(255,231,162,.34)";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,231,162,.72)";
    ctx.beginPath();
    ctx.arc(x2, y2, Math.max(1.8, radius * 0.01), 0, Math.PI * 2);
    ctx.fill();

    if (reason === "boot" || reason === "mount") {
      ctx.fillStyle = "rgba(232,241,255,.72)";
      ctx.font = `${Math.max(9, Math.round(radius * 0.04))}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Hearth · governed source surface", cx, cy - radius - Math.max(12, radius * 0.11));
    }

    ctx.restore();
  }

  function pseudo(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function inspectPixelSample(canvas, ctx) {
    if (!canvas || !ctx) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.pixelVisible = false;
      state.visiblePixelCount = 0;
      state.alphaPixelCount = 0;
      state.uniqueColorCount = 0;
      state.pixelVariancePresent = false;
      state.pixelSampleReason = "NO_CANVAS_CONTEXT";
      return;
    }

    const width = Number(canvas.width || 0);
    const height = Number(canvas.height || 0);

    if (width <= 0 || height <= 0) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.pixelVisible = false;
      state.visiblePixelCount = 0;
      state.alphaPixelCount = 0;
      state.uniqueColorCount = 0;
      state.pixelVariancePresent = false;
      state.pixelSampleReason = "CANVAS_DIMENSIONS_ZERO";
      return;
    }

    const points = buildSamplePoints(width, height);
    let alphaPixelCount = 0;
    let visiblePixelCount = 0;
    const unique = new Set();

    try {
      for (const point of points) {
        const x = Math.max(0, Math.min(width - 1, Math.round(point.x)));
        const y = Math.max(0, Math.min(height - 1, Math.round(point.y)));
        const data = ctx.getImageData(x, y, 1, 1).data;

        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alphaPixelCount += 1;
        if (a > 0 && (r > 0 || g > 0 || b > 0)) visiblePixelCount += 1;

        unique.add(`${r},${g},${b},${a}`);
      }
    } catch (error) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.pixelVisible = false;
      state.visiblePixelCount = visiblePixelCount;
      state.alphaPixelCount = alphaPixelCount;
      state.uniqueColorCount = unique.size;
      state.pixelVariancePresent = unique.size >= 3;
      state.pixelSampleReason = error && error.message ? String(error.message) : safeString(error);
      return;
    }

    state.visiblePixelCount = visiblePixelCount;
    state.alphaPixelCount = alphaPixelCount;
    state.uniqueColorCount = unique.size;
    state.pixelVariancePresent = unique.size >= 3;
    state.pixelVisible = visiblePixelCount > 0;
    state.pixelSampleStatus = state.pixelVisible
      ? "PIXEL_SAMPLE_VISIBLE"
      : alphaPixelCount > 0
        ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
        : "PIXEL_SAMPLE_BLANK";
    state.pixelSampleReason = state.pixelVisible
      ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
      : alphaPixelCount > 0
        ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
        : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID";
  }

  function buildSamplePoints(width, height) {
    const xs = [0.18, 0.32, 0.5, 0.68, 0.82];
    const ys = [0.18, 0.32, 0.5, 0.68, 0.82];
    const points = [];

    for (const y of ys) {
      for (const x of xs) {
        points.push({
          x: width * x,
          y: height * y
        });
      }
    }

    return points;
  }

  function composeCarrierSurfacePacket(reason = "carrier-surface") {
    return {
      packetType: CARRIER_SURFACE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-carrier-surface",
      reason,

      carrierSurfaceReady: state.carrierSurfaceReady,
      carrierSurfaceProofReady: state.carrierSurfaceProofReady,
      carrierSurfaceStatus: state.carrierSurfaceStatus,
      carrierSurfaceFailureReason: state.carrierSurfaceFailureReason,

      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.primaryCanvasSelector,
      canvasId: state.primaryCanvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,

      sourceHold: state.sourceHold,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composePlanetSurfaceThresholdPacket(reason = "threshold") {
    return {
      packetType: PLANET_SURFACE_THRESHOLD_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      reason,

      planetSurfaceThresholdActive: true,
      planetSurfaceThresholdStatus: state.planetSurfaceThresholdStatus,
      planetSurfaceThresholdPassed: state.planetSurfaceThresholdPassed,
      thresholdFirstFailedCoordinate: state.thresholdFirstFailedCoordinate,

      thresholdTarget: {
        canvasElementFound: true,
        canvasContext2dReady: true,
        canvasRectNonzero: true,
        canvasComputedVisible: true,
        sourceSampleCapableCountMinimum: 1,
        governedSampleSuccessRatioMinimum: SOURCE_THRESHOLD_RATIO,
        textureBuiltFromGovernedSource: true,
        texturePixelVariancePresent: true,
        pixelVariancePresent: true,
        visiblePixelCountGreaterThan: 0
      },

      carrierSurfaceReady: state.carrierSurfaceReady,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      thresholdSampleTotal: state.thresholdSampleTotal,
      thresholdSampleSuccessCount: state.thresholdSampleSuccessCount,
      thresholdSampleMissCount: state.thresholdSampleMissCount,
      thresholdSampleErrorCount: state.thresholdSampleErrorCount,
      thresholdSampleSuccessRatio: state.thresholdSampleSuccessRatio,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      textureUniqueColorCount: state.textureUniqueColorCount,
      pixelVisible: state.pixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      pixelVariancePresent: state.pixelVariancePresent,
      uniqueColorCount: state.uniqueColorCount,

      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      sourceHoldFallbackVisible: state.sourceHoldFallbackVisible,
      sourceHoldFallbackDoesNotCountAsVisiblePlanet: true,

      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeRenderPacket(reason = "render-packet") {
    return {
      packetType: CANVAS_RENDER_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-receiver-output-carrier",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      reason,
      viewState: clonePlain(state.viewState),

      carrierSurfaceReady: state.carrierSurfaceReady,
      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      planetSurfaceThresholdPassed: state.planetSurfaceThresholdPassed,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,

      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),
      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceFallbackCarrierActive: state.sourceFallbackCarrierActive,
      fallbackClass: state.fallbackClass,
      fallbackReason: state.fallbackReason,

      surfaceIdentityUnified: state.surfaceIdentityUnified,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied,
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.primaryCanvasSelector,
      canvasId: state.primaryCanvasId,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,

      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelVariancePresent: state.pixelVariancePresent,
      pixelSampleReason: state.pixelSampleReason,

      canvasDrawingPerformedByCanvasHub: true,
      canvasDrawingOwnsSourceTruth: false,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,
      terrainTruthOwned: false,
      hydrologyTruthOwned: false,
      elevationTruthOwned: false,
      materialTruthOwned: false,
      finalVisualPassAuthority: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeCanvasHexGatePacket(reason = "canvas-hex-gate") {
    readHexSurfaceAuthority();
    readControlAuthority();

    return {
      packetType: CANVAS_HEX_GATE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-output-carrier-to-hex-surface-gate",
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasFile: FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      canvasHexGateAuthorized: true,
      hexSurfaceGateAuthorized: true,
      pointerFingerTransmissionAuthorized: true,

      viewState: clonePlain(state.viewState),
      carrierSurfacePacket: composeCarrierSurfacePacket(reason),
      thresholdPacket: composePlanetSurfaceThresholdPacket(reason),
      renderPacket: composeRenderPacket(reason),

      carrierSurfaceReady: state.carrierSurfaceReady,
      sourceHold: state.sourceHold,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),
      canvasPixelVisible: state.pixelVisible,
      canvasPixelSampleStatus: state.pixelSampleStatus,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceReceiverMethod: state.hexSurfaceReceiverMethod,

      controlObserved: state.controlObserved,
      controlSource: state.controlSource,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      canvasOwnsHexSurfaceTruth: false,
      canvasOwnsPointerFingerTruth: false,
      canvasOwnsTerrainTruth: false,
      canvasOwnsHydrologyTruth: false,
      canvasOwnsElevationTruth: false,
      canvasOwnsMaterialTruth: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function sendHexGatePacket(reason = "hex-gate") {
    const hex = readHexSurfaceAuthority();
    const packet = composeCanvasHexGatePacket(reason);

    state.hexGatePacketCount += 1;

    if (!hex.authority || !hex.method || !isFunction(hex.authority[hex.method])) {
      state.hexSurfaceDeliveryStatus = "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE";
      publishHexGateGlobals(packet);

      return {
        delivered: false,
        method: "NONE",
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE",
        packet
      };
    }

    try {
      const result = hex.authority[hex.method](clonePlain(packet), {
        source: "HEARTH_CANVAS_HUB",
        reason
      });

      state.hexGateDeliveryCount += 1;
      state.hexSurfaceDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERED";

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_CANVAS_HEX_SURFACE_ASYNC_DELIVERY_FAILED", error, {
            method: hex.method
          });
        });
      }

      publishHexGateGlobals(packet);

      record("HEARTH_CANVAS_HEX_GATE_PACKET_DELIVERED", {
        method: hex.method,
        reason,
        hexSurfaceSource: hex.name,
        carrierSurfaceReady: state.carrierSurfaceReady,
        planetSurfaceReady: state.planetSurfaceReady,
        activeSourceClass: state.activeSourceClass
      });

      return {
        delivered: true,
        method: hex.method,
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_CALLED",
        resultObserved: isObject(result),
        packet
      };
    } catch (error) {
      state.hexSurfaceDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERY_ERROR";
      recordError("HEARTH_CANVAS_HEX_SURFACE_DELIVERY_FAILED", error, {
        method: hex.method
      });

      publishHexGateGlobals(packet);

      return {
        delivered: false,
        method: hex.method,
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_THROWN",
        packet
      };
    }
  }

  function publishHexGateGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_LAST_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_SOURCE_HOLD_THRESHOLD_HEX_GATE_PACKET = cloned;

    hearth.canvasHexGatePacket = cloned;
    hearth.canvasLastHexGatePacket = cloned;
    hearth.canvasSourceHoldThresholdHexGatePacket = cloned;

    lab.hearthCanvasHexGatePacket = cloned;
    lab.hearthCanvasLastHexGatePacket = cloned;
    lab.hearthCanvasSourceHoldThresholdHexGatePacket = cloned;

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }
    } catch (_error) {}
  }

  function publishRenderGlobals(reason = "render") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const renderPacket = composeRenderPacket(reason);
    const carrierPacket = composeCarrierSurfacePacket(reason);
    const thresholdPacket = composePlanetSurfaceThresholdPacket(reason);

    root.HEARTH_CANVAS_RENDER_PACKET = clonePlain(renderPacket);
    root.HEARTH_CANVAS_VISIBLE_2D_RENDER_PACKET = clonePlain(renderPacket);
    root.HEARTH_CANVAS_SOURCE_HOLD_THRESHOLD_RENDER_PACKET = clonePlain(renderPacket);
    root.HEARTH_CANVAS_CARRIER_SURFACE_PROOF = clonePlain(carrierPacket);
    root.HEARTH_CANVAS_PLANET_SURFACE_THRESHOLD = clonePlain(thresholdPacket);

    hearth.canvasRenderPacket = clonePlain(renderPacket);
    hearth.canvasVisible2dRenderPacket = clonePlain(renderPacket);
    hearth.canvasSourceHoldThresholdRenderPacket = clonePlain(renderPacket);
    hearth.canvasCarrierSurfaceProof = clonePlain(carrierPacket);
    hearth.canvasPlanetSurfaceThreshold = clonePlain(thresholdPacket);

    lab.hearthCanvasRenderPacket = clonePlain(renderPacket);
    lab.hearthCanvasVisible2dRenderPacket = clonePlain(renderPacket);
    lab.hearthCanvasSourceHoldThresholdRenderPacket = clonePlain(renderPacket);
    lab.hearthCanvasCarrierSurfaceProof = clonePlain(carrierPacket);
    lab.hearthCanvasPlanetSurfaceThreshold = clonePlain(thresholdPacket);

    const visibleProof = {
      ...clonePlain(thresholdPacket),
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,
      renderedPlanetProofReady: state.visiblePlanetProofReady,
      currentVisibleProofValid: state.visiblePlanetProofReady,
      domVisiblePlanetProofReady: state.visiblePlanetProofReady,
      canvasMounted: state.carrierSurfaceReady,
      canvasDrawComplete: state.planetSurfaceReady,
      baseGlobeDrawComplete: state.planetSurfaceReady,
      ...NO_CLAIMS
    };

    root.HEARTH_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);
    root.HEARTH_CANVAS_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);
    hearth.visiblePlanetProof = clonePlain(visibleProof);
    hearth.canvasVisiblePlanetProof = clonePlain(visibleProof);
    lab.hearthVisiblePlanetProof = clonePlain(visibleProof);
    lab.hearthCanvasVisiblePlanetProof = clonePlain(visibleProof);

    return renderPacket;
  }

  function startLoop(reason = "start-loop") {
    if (state.drawLoopActive || state.disposed) return getReceiptLight(false);

    if (!state.planetSurfaceReady) {
      startSourceHoldRescan("start-loop-source-hold");
      return getReceiptLight(false);
    }

    state.drawLoopActive = true;
    state.started = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_DRAW_LOOP_ACTIVE_THRESHOLDED_NO_FINAL_CLAIM";

    record("HEARTH_CANVAS_DRAW_LOOP_STARTED", { reason });

    tick();

    return getReceiptLight(false);
  }

  function stopLoop(reason = "stop-loop") {
    state.drawLoopActive = false;

    if (state.rafId) {
      try {
        if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(state.rafId);
        else clearTimeout(state.rafId);
      } catch (_error) {}
    }

    state.rafId = 0;

    record("HEARTH_CANVAS_DRAW_LOOP_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function tick(time) {
    if (!state.drawLoopActive || state.disposed) return;

    if (!state.planetSurfaceReady) {
      stopLoop("planet-threshold-lost");
      startSourceHoldRescan("planet-threshold-lost");
      return;
    }

    const now = safeNumber(time, Date.now());
    if (!lastFrameTime || now - lastFrameTime > PLANET_FRAME_MIN_MS) {
      lastFrameTime = now;
      drawFrame("raf-thresholded-governed-source-visible-2d-output");
    }

    const schedule = isFunction(root.requestAnimationFrame)
      ? root.requestAnimationFrame.bind(root)
      : (fn) => root.setTimeout(fn, PLANET_FRAME_MIN_MS);

    state.rafId = schedule(tick);
  }

  function startSourceHoldRescan(reason = "source-hold-rescan") {
    if (sourceHoldTimer || state.disposed) return;

    state.sourceHoldRescanActive = true;

    record("HEARTH_CANVAS_SOURCE_HOLD_RESCAN_STARTED", { reason });

    sourceHoldTimer = root.setInterval(() => {
      if (state.disposed) {
        stopSourceHoldRescan("disposed");
        return;
      }

      state.sourceHoldRescanCount += 1;
      const ready = refreshSourceThreshold(`source-hold-rescan-${state.sourceHoldRescanCount}`);

      if (ready) {
        stopSourceHoldRescan("source-threshold-ready");
        drawFrame("source-threshold-ready");
        startLoop("source-threshold-ready");
      } else {
        drawFrame("source-hold-rescan-fallback");
      }
    }, SOURCE_HOLD_RESCAN_MS);
  }

  function stopSourceHoldRescan(reason = "stop-source-hold-rescan") {
    if (sourceHoldTimer) {
      root.clearInterval(sourceHoldTimer);
      sourceHoldTimer = 0;
    }

    state.sourceHoldRescanActive = false;

    record("HEARTH_CANVAS_SOURCE_HOLD_RESCAN_STOPPED", { reason });
  }

  function mount(options = {}) {
    state.lastMountedAt = nowIso();

    const prepared = unifySurfaceIdentity(options.reason || "mount");
    state.mounted = prepared.length > 0;

    refreshSourceThreshold(options.reason || "mount");

    if (state.mounted) {
      drawFrame(options.reason || "mount");
    }

    if (state.planetSurfaceReady) {
      stopSourceHoldRescan("mount-threshold-ready");
      startLoop("mount-threshold-ready");
    } else {
      startSourceHoldRescan("mount-source-hold");
    }

    updateDataset();
    publishGlobals("mount");

    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_BOOTING_SOURCE_HOLD_THRESHOLD_RECEIVER_V12_6";

    record("HEARTH_CANVAS_HUB_BOOT_START", {
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT
    });

    publishGlobals("boot-early");
    mount({ reason: "boot" });
    sendHexGatePacket("boot");

    state.booted = true;
    state.booting = false;

    record("HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_BOOTED", {
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      carrierSurfaceReady: state.carrierSurfaceReady,
      sourceHold: state.sourceHold,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      thresholdSampleSuccessRatio: state.thresholdSampleSuccessRatio,
      activeSourceClass: state.activeSourceClass,
      activeSourceNames: state.activeSourceNames,
      visualPassClaimed: false
    });

    updateDataset();
    publishGlobals("boot-complete");

    return getReceipt();
  }

  function refresh(reason = "refresh") {
    readControlAuthority();
    readHexSurfaceAuthority();
    unifySurfaceIdentity(reason);
    refreshSourceThreshold(reason);
    drawFrame(reason);
    sendHexGatePacket(reason);

    if (state.planetSurfaceReady) {
      stopSourceHoldRescan("refresh-threshold-ready");
      startLoop("refresh-threshold-ready");
    } else {
      stopLoop("refresh-source-hold");
      startSourceHoldRescan("refresh-source-hold");
    }

    updateDataset();
    publishGlobals(reason);

    return getReceiptLight(false);
  }

  function dispose(reason = "manual-dispose") {
    stopLoop("dispose");
    stopSourceHoldRescan("dispose");

    state.disposed = true;
    state.postgameStatus = "CANVAS_HUB_DISPOSED";
    state.recommendedNextAction = "REBOOT_CANVAS_HUB_IF_VISIBLE_SURFACE_REQUIRED";

    record("HEARTH_CANVAS_HUB_DISPOSED", { reason });
    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  function receiveCanvasHexGatePacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveCanvasHexGatePacket",
      viewPacket: true,
      reason: "receiveCanvasHexGatePacket"
    });
  }

  function consumeCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      source: "consumeCanvasHexGatePacket"
    });
  }

  function acceptCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      source: "acceptCanvasHexGatePacket"
    });
  }

  function receiveCanvasViewPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveCanvasViewPacket",
      viewPacket: true,
      reason: "receiveCanvasViewPacket"
    });
  }

  function consumeCanvasViewPacket(packet, options = {}) {
    return receiveCanvasViewPacket(packet, {
      ...options,
      source: "consumeCanvasViewPacket"
    });
  }

  function receivePlanetaryViewControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receivePlanetaryViewControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "planetary-view-control",
      reason: "receivePlanetaryViewControlPacket"
    });
  }

  function consumePlanetaryViewControlPacket(packet, options = {}) {
    return receivePlanetaryViewControlPacket(packet, {
      ...options,
      source: "consumePlanetaryViewControlPacket"
    });
  }

  function receiveViewControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveViewControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "view-control",
      reason: "receiveViewControlPacket"
    });
  }

  function consumeViewControlPacket(packet, options = {}) {
    return receiveViewControlPacket(packet, {
      ...options,
      source: "consumeViewControlPacket"
    });
  }

  function receiveControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "control-packet",
      reason: "receiveControlPacket"
    });
  }

  function acceptControlPacket(packet, options = {}) {
    return receiveControlPacket(packet, {
      ...options,
      source: "acceptControlPacket"
    });
  }

  function drawInteractiveFrame(packet, options = {}) {
    return receivePacket(packet || {}, {
      ...options,
      source: "drawInteractiveFrame",
      viewPacket: true,
      reason: "drawInteractiveFrame"
    });
  }

  function drawPairFrame(packet, options = {}) {
    return receivePacket(packet || {}, {
      ...options,
      source: "drawPairFrame",
      viewPacket: true,
      reason: "drawPairFrame"
    });
  }

  function renderFrame(packet, options = {}) {
    if (isObject(packet)) applyViewPacket(packet, options);

    if (!state.planetSurfaceReady) {
      refreshSourceThreshold(options.reason || "renderFrame-source-threshold");
    }

    return drawFrame(options.reason || "renderFrame");
  }

  function requestFrame(packet, options = {}) {
    return renderFrame(packet, {
      ...options,
      reason: "requestFrame"
    });
  }

  function rebuildSourceTexture(reason = "rebuild-source-texture") {
    refreshSourceThreshold(reason);
    drawFrame(reason);
    sendHexGatePacket(reason);
    updateDataset();
    publishGlobals(reason);
    return getReceipt();
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", String(state.canvasElementFound));
    setDataset("hearthCanvasContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasParentContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasCurrentParentContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthSouthCurrentCanvasParentContract", PUBLIC_CONTRACT);
    setDataset("hearthSouthCurrentCanvasParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRoute", ROUTE);
    setDataset("hearthCanvasMountSelector", state.mountSelector);
    setDataset("hearthCanvasStageSelector", state.stageSelector);
    setDataset("hearthCanvasSelector", state.primaryCanvasSelector);
    setDataset("hearthCanvasPrimaryCanvasId", state.primaryCanvasId);

    setDataset("hearthCanvasSourceHoldThresholdReceiverActive", "true");
    setDataset("hearthCanvasCarrierSurfaceReady", String(state.carrierSurfaceReady));
    setDataset("hearthCanvasCarrierSurfaceProofReady", String(state.carrierSurfaceProofReady));
    setDataset("hearthCanvasCarrierSurfaceStatus", state.carrierSurfaceStatus);
    setDataset("hearthCanvasCarrierSurfaceFailureReason", state.carrierSurfaceFailureReason);

    setDataset("hearthCanvasSourceHold", String(state.sourceHold));
    setDataset("hearthCanvasSourceHoldClass", state.sourceHoldClass);
    setDataset("hearthCanvasSourceHoldReason", state.sourceHoldReason);
    setDataset("hearthCanvasSourceHoldFallbackDrawn", String(state.sourceHoldFallbackDrawn));
    setDataset("hearthCanvasSourceHoldFallbackVisible", String(state.sourceHoldFallbackVisible));
    setDataset("hearthCanvasSourceHoldFallbackDoesNotCountAsVisiblePlanet", "true");
    setDataset("hearthCanvasSourceHoldRescanActive", String(state.sourceHoldRescanActive));
    setDataset("hearthCanvasSourceHoldRescanCount", String(state.sourceHoldRescanCount));

    setDataset("hearthCanvasPlanetSurfaceThresholdActive", "true");
    setDataset("hearthCanvasPlanetSurfaceThresholdStatus", state.planetSurfaceThresholdStatus);
    setDataset("hearthCanvasPlanetSurfaceThresholdPassed", String(state.planetSurfaceThresholdPassed));
    setDataset("hearthCanvasPlanetSurfaceReady", String(state.planetSurfaceReady));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofSuppressedReason", state.visiblePlanetProofSuppressedReason);
    setDataset("hearthCanvasThresholdFirstFailedCoordinate", state.thresholdFirstFailedCoordinate);
    setDataset("hearthCanvasThresholdSampleRatioRequired", String(SOURCE_THRESHOLD_RATIO));
    setDataset("hearthCanvasThresholdSampleSuccessRatio", String(state.thresholdSampleSuccessRatio));

    setDataset("hearthCanvasActiveSourceClass", state.activeSourceClass);
    setDataset("hearthCanvasActiveSourceRole", state.activeSourceRole);
    setDataset("hearthCanvasActiveSourceNames", state.activeSourceNames.join(","));
    setDataset("hearthCanvasSourceAuthorityObservedCount", String(state.sourceAuthorityObservedCount));
    setDataset("hearthCanvasSourceAuthorityNames", state.sourceAuthorityNames.join(","));
    setDataset("hearthCanvasSourceSampleCapableCount", String(state.sourceSampleCapableCount));
    setDataset("hearthCanvasSourceSampleCapableNames", state.sourceSampleCapableNames.join(","));
    setDataset("hearthCanvasSourceAdapterStatus", state.sourceAdapterStatus);
    setDataset("hearthCanvasSourceFallbackCarrierActive", String(state.sourceFallbackCarrierActive));
    setDataset("hearthCanvasFallbackClass", state.fallbackClass);
    setDataset("hearthCanvasFallbackReason", state.fallbackReason);
    setDataset("hearthCanvasActiveTextureBuilt", String(state.activeTextureBuilt));
    setDataset("hearthCanvasActiveTextureStatus", state.activeTextureStatus);
    setDataset("hearthCanvasTextureBuiltFromGovernedSource", String(state.textureBuiltFromGovernedSource));
    setDataset("hearthCanvasTexturePixelVariancePresent", String(state.texturePixelVariancePresent));
    setDataset("hearthCanvasTextureUniqueColorCount", String(state.textureUniqueColorCount));

    setDataset("hearthCanvasSurfaceIdentityUnified", String(state.surfaceIdentityUnified));
    setDataset("hearthCanvasVisibleCanvasAttributeApplied", String(state.visibleCanvasAttributeApplied));
    setDataset("hearthCanvasExpressionSurfaceAttributeApplied", String(state.expressionSurfaceAttributeApplied));
    setDataset("hearthCanvasVisible2dOutputActive", String(state.pixelVisible));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasElementCount", String(state.canvasElementCount));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));

    setDataset("hearthCanvasPixelSampleStatus", state.pixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.pixelVisible));
    setDataset("hearthCanvasVisiblePixelCount", String(state.visiblePixelCount));
    setDataset("hearthCanvasAlphaPixelCount", String(state.alphaPixelCount));
    setDataset("hearthCanvasUniqueColorCount", String(state.uniqueColorCount));
    setDataset("hearthCanvasPixelVariancePresent", String(state.pixelVariancePresent));
    setDataset("hearthCanvasPixelSampleReason", state.pixelSampleReason);

    setDataset("hearthCanvasDrawLoopActive", String(state.drawLoopActive));
    setDataset("hearthCanvasFrameCount", String(state.frameCount));
    setDataset("hearthCanvasDrawCount", String(state.drawCount));
    setDataset("hearthCanvasLastDrawReason", state.lastDrawReason);

    setDataset("hearthCanvasHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasHexSurfaceSource", state.hexSurfaceSource);
    setDataset("hearthCanvasHexSurfaceContract", state.hexSurfaceContract);
    setDataset("hearthCanvasHexSurfaceReceiverMethod", state.hexSurfaceReceiverMethod);
    setDataset("hearthCanvasHexSurfaceDeliveryStatus", state.hexSurfaceDeliveryStatus);

    setDataset("hearthCanvasControlObserved", String(state.controlObserved));
    setDataset("hearthCanvasControlSource", state.controlSource);
    setDataset("hearthCanvasControlContract", state.controlContract);

    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);
    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextOwner", state.recommendedNextOwner);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);

    setDataset("hearthCanvasOwnsSourceTruth", "false");
    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");
    setDataset("hearthCanvasOwnsHexSurfaceTruth", "false");
    setDataset("hearthCanvasOwnsPointerFingerTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function composeDiagnosticFields() {
    return {
      CANVAS_FILE: FILE,
      CANVAS_CONTRACT: PUBLIC_CONTRACT,
      CANVAS_RECEIPT: PUBLIC_RECEIPT,
      CURRENT_CANVAS_PARENT_CONTRACT: PUBLIC_CONTRACT,
      CURRENT_CANVAS_PARENT_RECEIPT: PUBLIC_RECEIPT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: "true",
      CANVAS_INTERNAL_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      CANVAS_INTERNAL_IMPLEMENTATION_RECEIPT: INTERNAL_IMPLEMENTATION_RECEIPT,
      CANVAS_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      CANVAS_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      CANVAS_VERSION: VERSION,

      CANVAS_HUB_ACTIVE: "true",
      SOURCE_HOLD_THRESHOLD_RECEIVER_ACTIVE: "true",

      CARRIER_SURFACE_READY: String(state.carrierSurfaceReady),
      CARRIER_SURFACE_PROOF_READY: String(state.carrierSurfaceProofReady),
      CARRIER_SURFACE_STATUS: state.carrierSurfaceStatus,
      CARRIER_SURFACE_FAILURE_REASON: state.carrierSurfaceFailureReason,

      SOURCE_HOLD: String(state.sourceHold),
      SOURCE_HOLD_CLASS: state.sourceHoldClass,
      SOURCE_HOLD_REASON: state.sourceHoldReason,
      SOURCE_HOLD_FALLBACK_DRAWN: String(state.sourceHoldFallbackDrawn),
      SOURCE_HOLD_FALLBACK_VISIBLE: String(state.sourceHoldFallbackVisible),
      SOURCE_HOLD_FALLBACK_DOES_NOT_COUNT_AS_VISIBLE_PLANET: "true",

      PLANET_SURFACE_THRESHOLD_ACTIVE: "true",
      PLANET_SURFACE_THRESHOLD_STATUS: state.planetSurfaceThresholdStatus,
      PLANET_SURFACE_THRESHOLD_PASSED: String(state.planetSurfaceThresholdPassed),
      PLANET_SURFACE_READY: String(state.planetSurfaceReady),
      VISIBLE_PLANET_PROOF_READY: String(state.visiblePlanetProofReady),
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      VISIBLE_PLANET_PROOF_SUPPRESSED_REASON: state.visiblePlanetProofSuppressedReason,

      THRESHOLD_SAMPLE_RATIO_REQUIRED: String(SOURCE_THRESHOLD_RATIO),
      THRESHOLD_SAMPLE_TOTAL: String(state.thresholdSampleTotal),
      THRESHOLD_SAMPLE_SUCCESS_COUNT: String(state.thresholdSampleSuccessCount),
      THRESHOLD_SAMPLE_MISS_COUNT: String(state.thresholdSampleMissCount),
      THRESHOLD_SAMPLE_ERROR_COUNT: String(state.thresholdSampleErrorCount),
      THRESHOLD_SAMPLE_SUCCESS_RATIO: String(state.thresholdSampleSuccessRatio),
      THRESHOLD_FIRST_FAILED_COORDINATE: state.thresholdFirstFailedCoordinate,

      ACTIVE_SOURCE_CLASS: state.activeSourceClass,
      ACTIVE_SOURCE_ROLE: state.activeSourceRole,
      ACTIVE_SOURCE_NAMES: state.activeSourceNames.join(","),
      SOURCE_AUTHORITY_OBSERVED_COUNT: String(state.sourceAuthorityObservedCount),
      SOURCE_AUTHORITY_NAMES: state.sourceAuthorityNames.join(","),
      SOURCE_SAMPLE_CAPABLE_COUNT: String(state.sourceSampleCapableCount),
      SOURCE_SAMPLE_CAPABLE_NAMES: state.sourceSampleCapableNames.join(","),
      SOURCE_ADAPTER_STATUS: state.sourceAdapterStatus,
      SOURCE_FALLBACK_CARRIER_ACTIVE: String(state.sourceFallbackCarrierActive),
      FALLBACK_CLASS: state.fallbackClass,
      FALLBACK_REASON: state.fallbackReason,
      ACTIVE_TEXTURE_BUILT: String(state.activeTextureBuilt),
      ACTIVE_TEXTURE_STATUS: state.activeTextureStatus,
      TEXTURE_BUILT_FROM_GOVERNED_SOURCE: String(state.textureBuiltFromGovernedSource),
      TEXTURE_PIXEL_VARIANCE_PRESENT: String(state.texturePixelVariancePresent),
      TEXTURE_UNIQUE_COLOR_COUNT: String(state.textureUniqueColorCount),

      VISIBLE_2D_OUTPUT_ACTIVE: String(state.pixelVisible),
      SURFACE_IDENTITY_UNIFIED: String(state.surfaceIdentityUnified),
      VISIBLE_CANVAS_ATTRIBUTE_APPLIED: String(state.visibleCanvasAttributeApplied),
      EXPRESSION_SURFACE_ATTRIBUTE_APPLIED: String(state.expressionSurfaceAttributeApplied),

      CANVAS_ELEMENT_FOUND: String(state.canvasElementFound),
      CANVAS_ELEMENT_COUNT: String(state.canvasElementCount),
      CANVAS_SELECTOR: state.primaryCanvasSelector,
      CANVAS_ID: state.primaryCanvasId,
      CANVAS_CONTEXT_2D_READY: String(state.canvasContext2dReady),
      CANVAS_RECT_NONZERO: String(state.canvasRectNonzero),
      CANVAS_COMPUTED_VISIBLE: String(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: String(state.canvasViewportIntersecting),
      CANVAS_WIDTH: String(state.canvasWidth),
      CANVAS_HEIGHT: String(state.canvasHeight),

      CANVAS_PIXEL_SAMPLE_STATUS: state.pixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: String(state.pixelVisible),
      CANVAS_VISIBLE_PIXEL_COUNT: String(state.visiblePixelCount),
      CANVAS_ALPHA_PIXEL_COUNT: String(state.alphaPixelCount),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(state.uniqueColorCount),
      PIXEL_VARIANCE_PRESENT: String(state.pixelVariancePresent),
      CANVAS_PIXEL_SAMPLE_REASON: state.pixelSampleReason,

      DRAW_LOOP_ACTIVE: String(state.drawLoopActive),
      SOURCE_HOLD_RESCAN_ACTIVE: String(state.sourceHoldRescanActive),
      SOURCE_HOLD_RESCAN_COUNT: String(state.sourceHoldRescanCount),
      FRAME_COUNT: String(state.frameCount),
      DRAW_COUNT: String(state.drawCount),
      RECEIVE_PACKET_COUNT: String(state.receivePacketCount),
      ACCEPTED_PACKET_COUNT: String(state.acceptedPacketCount),
      REJECTED_PACKET_COUNT: String(state.rejectedPacketCount),
      CONTROL_PACKET_COUNT: String(state.controlPacketCount),
      VIEW_PACKET_COUNT: String(state.viewPacketCount),

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECEIVER_METHOD: state.hexSurfaceReceiverMethod,
      HEX_SURFACE_DELIVERY_STATUS: state.hexSurfaceDeliveryStatus,
      HEX_GATE_PACKET_COUNT: String(state.hexGatePacketCount),
      HEX_GATE_DELIVERY_COUNT: String(state.hexGateDeliveryCount),

      CONTROL_OBSERVED: String(state.controlObserved),
      CONTROL_SOURCE: state.controlSource,
      CONTROL_CONTRACT: state.controlContract,

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_OWNS_SOURCE_TRUTH: "false",
      CANVAS_OWNS_TERRAIN_TRUTH: "false",
      CANVAS_OWNS_HYDROLOGY_TRUTH: "false",
      CANVAS_OWNS_ELEVATION_TRUTH: "false",
      CANVAS_OWNS_MATERIAL_TRUTH: "false",
      CANVAS_OWNS_HEX_SURFACE_TRUTH: "false",
      CANVAS_OWNS_POINTER_FINGER_TRUTH: "false",
      CANVAS_OWNS_FINAL_VISUAL_PASS: "false",

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByCanvas: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      finalVisualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function composeReceiptLight(doRefresh = false) {
    if (doRefresh) {
      readControlAuthority();
      readHexSurfaceAuthority();
      inspectPrimaryCanvasGeometry(collectCanvasCandidates()[0] || null);
      evaluateCarrierSurfaceThreshold();
      evaluatePlanetSurfaceThreshold("receipt-refresh");
    }

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_PACKET",
      canvasReceiptPacketType: "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_PACKET_v12_6",
      contract: PUBLIC_CONTRACT,
      CONTRACT: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      RECEIPT: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      role: "canvas-receiver-output-carrier-source-hold-planet-surface-threshold",

      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      canvasHubActive: true,
      canvasReceiverActive: true,
      canvasOutputCarrierActive: true,
      sourceHoldThresholdReceiverActive: true,
      canvasSurfaceTruthProbeCompatible: true,

      carrierSurfaceReady: state.carrierSurfaceReady,
      carrierSurfaceProofReady: state.carrierSurfaceProofReady,
      carrierSurfaceStatus: state.carrierSurfaceStatus,
      carrierSurfaceFailureReason: state.carrierSurfaceFailureReason,

      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      sourceHoldFallbackDrawn: state.sourceHoldFallbackDrawn,
      sourceHoldFallbackVisible: state.sourceHoldFallbackVisible,
      sourceHoldFallbackDoesNotCountAsVisiblePlanet: true,
      sourceHoldFallbackDrawCount: state.sourceHoldFallbackDrawCount,
      sourceHoldRescanActive: state.sourceHoldRescanActive,
      sourceHoldRescanCount: state.sourceHoldRescanCount,

      planetSurfaceThresholdActive: true,
      planetSurfaceThresholdStatus: state.planetSurfaceThresholdStatus,
      planetSurfaceThresholdPassed: state.planetSurfaceThresholdPassed,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,

      thresholdSampleRatioRequired: SOURCE_THRESHOLD_RATIO,
      thresholdSampleTotal: state.thresholdSampleTotal,
      thresholdSampleSuccessCount: state.thresholdSampleSuccessCount,
      thresholdSampleMissCount: state.thresholdSampleMissCount,
      thresholdSampleErrorCount: state.thresholdSampleErrorCount,
      thresholdSampleSuccessRatio: state.thresholdSampleSuccessRatio,
      thresholdFirstFailedCoordinate: state.thresholdFirstFailedCoordinate,

      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),
      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceAuthorityNames: clonePlain(state.sourceAuthorityNames),
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceSampleCapableNames: clonePlain(state.sourceSampleCapableNames),
      sourceAdapterStatus: state.sourceAdapterStatus,
      sourceFallbackCarrierActive: state.sourceFallbackCarrierActive,
      fallbackClass: state.fallbackClass,
      fallbackReason: state.fallbackReason,
      activeTextureBuilt: state.activeTextureBuilt,
      activeTextureStatus: state.activeTextureStatus,
      activeTextureWidth: state.activeTextureWidth,
      activeTextureHeight: state.activeTextureHeight,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      textureUniqueColorCount: state.textureUniqueColorCount,

      surfaceIdentityUnified: state.surfaceIdentityUnified,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied,
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasCreatedByCanvasHub: state.canvasCreatedByCanvasHub,
      canvasSelector: state.primaryCanvasSelector,
      canvasId: state.primaryCanvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,
      devicePixelRatio: state.devicePixelRatio,

      pixelSampleStatus: state.pixelSampleStatus,
      canvasPixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      canvasPixelVisible: state.pixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelVariancePresent: state.pixelVariancePresent,
      pixelSampleReason: state.pixelSampleReason,

      drawLoopActive: state.drawLoopActive,
      frameCount: state.frameCount,
      drawCount: state.drawCount,
      receivePacketCount: state.receivePacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      controlPacketCount: state.controlPacketCount,
      viewPacketCount: state.viewPacketCount,
      hexGatePacketCount: state.hexGatePacketCount,
      hexGateDeliveryCount: state.hexGateDeliveryCount,
      surfaceUnificationCount: state.surfaceUnificationCount,
      resizeCount: state.resizeCount,
      receiptPublishCount: state.receiptPublishCount,
      aliasPublishCount: state.aliasPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

      viewState: clonePlain(state.viewState),
      surfaces: clonePlain(state.surfaces),

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceReceiverMethod: state.hexSurfaceReceiverMethod,
      hexSurfaceDeliveryStatus: state.hexSurfaceDeliveryStatus,

      controlObserved: state.controlObserved,
      controlSource: state.controlSource,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      supportsBoot: true,
      supportsStart: true,
      supportsInit: true,
      supportsMount: true,
      supportsRefresh: true,
      supportsRenderFrame: true,
      supportsRequestFrame: true,
      supportsDrawInteractiveFrame: true,
      supportsDrawPairFrame: true,
      supportsCanvasViewPacket: true,
      supportsControlPacket: true,
      supportsPlanetaryViewControlPacket: true,
      supportsCanvasHexGatePacket: true,
      supportsHexSurfaceGateForwarding: true,
      supportsGovernedSourceDiscovery: true,
      supportsGovernedSourceTextureRebuild: true,
      supportsCarrierSurfaceThreshold: true,
      supportsSourceHoldFallback: true,
      supportsPlanetSurfaceThreshold: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      ownsCanvasDrawing: true,
      ownsCanvasCreationInsideExistingMount: true,
      ownsCanvasMountHtml: false,
      ownsHtml: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsControlHandshakeTruth: false,
      ownsSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexAuthorityTruth: false,
      ownsHexSurfaceTruth: false,
      ownsPointerFingerTruth: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight(doRefresh = false) {
    return composeReceiptLight(doRefresh);
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(false),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      lastMountedAt: state.lastMountedAt,
      lastDrawAt: state.lastDrawAt,
      textureMeta: clonePlain(textureMeta),
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT",
      "",
      "HEADER",
      line("contract", PUBLIC_CONTRACT),
      line("receipt", PUBLIC_RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("previousImplementationReceipt", PREVIOUS_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "CARRIER_SURFACE",
      line("carrierSurfaceReady", r.carrierSurfaceReady),
      line("carrierSurfaceProofReady", r.carrierSurfaceProofReady),
      line("carrierSurfaceStatus", r.carrierSurfaceStatus),
      line("carrierSurfaceFailureReason", r.carrierSurfaceFailureReason),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasElementCount", r.canvasElementCount),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      "",
      "SOURCE_HOLD",
      line("sourceHold", r.sourceHold),
      line("sourceHoldClass", r.sourceHoldClass),
      line("sourceHoldReason", r.sourceHoldReason),
      line("sourceHoldFallbackDrawn", r.sourceHoldFallbackDrawn),
      line("sourceHoldFallbackVisible", r.sourceHoldFallbackVisible),
      line("sourceHoldFallbackDoesNotCountAsVisiblePlanet", true),
      line("sourceHoldRescanActive", r.sourceHoldRescanActive),
      line("sourceHoldRescanCount", r.sourceHoldRescanCount),
      "",
      "PLANET_THRESHOLD",
      line("planetSurfaceThresholdActive", true),
      line("planetSurfaceThresholdStatus", r.planetSurfaceThresholdStatus),
      line("planetSurfaceThresholdPassed", r.planetSurfaceThresholdPassed),
      line("planetSurfaceReady", r.planetSurfaceReady),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofSuppressedReason", r.visiblePlanetProofSuppressedReason),
      line("thresholdSampleRatioRequired", r.thresholdSampleRatioRequired),
      line("thresholdSampleSuccessRatio", r.thresholdSampleSuccessRatio),
      line("thresholdFirstFailedCoordinate", r.thresholdFirstFailedCoordinate),
      "",
      "SOURCE",
      line("activeSourceClass", r.activeSourceClass),
      line("activeSourceRole", r.activeSourceRole),
      line("activeSourceNames", (r.activeSourceNames || []).join(",")),
      line("sourceAuthorityObservedCount", r.sourceAuthorityObservedCount),
      line("sourceAuthorityNames", (r.sourceAuthorityNames || []).join(",")),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("sourceSampleCapableNames", (r.sourceSampleCapableNames || []).join(",")),
      line("sourceAdapterStatus", r.sourceAdapterStatus),
      line("textureBuiltFromGovernedSource", r.textureBuiltFromGovernedSource),
      line("texturePixelVariancePresent", r.texturePixelVariancePresent),
      "",
      "PIXELS",
      line("pixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("visiblePixelCount", r.visiblePixelCount),
      line("alphaPixelCount", r.alphaPixelCount),
      line("uniqueColorCount", r.uniqueColorCount),
      line("pixelVariancePresent", r.pixelVariancePresent),
      line("pixelSampleReason", r.pixelSampleReason),
      "",
      "GATE",
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceSource", r.hexSurfaceSource),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceReceiverMethod", r.hexSurfaceReceiverMethod),
      line("hexSurfaceDeliveryStatus", r.hexSurfaceDeliveryStatus),
      line("hexGatePacketCount", r.hexGatePacketCount),
      line("hexGateDeliveryCount", r.hexGateDeliveryCount),
      "",
      "COUNTS",
      line("frameCount", r.frameCount),
      line("drawCount", r.drawCount),
      line("receivePacketCount", r.receivePacketCount),
      line("acceptedPacketCount", r.acceptedPacketCount),
      line("rejectedPacketCount", r.rejectedPacketCount),
      line("controlPacketCount", r.controlPacketCount),
      line("viewPacketCount", r.viewPacketCount),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByCanvas", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("carrierSurfaceReady", r.carrierSurfaceReady),
      line("sourceHold", r.sourceHold),
      line("sourceHoldClass", r.sourceHoldClass),
      line("planetSurfaceThresholdStatus", r.planetSurfaceThresholdStatus),
      line("planetSurfaceReady", r.planetSurfaceReady),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("activeSourceClass", r.activeSourceClass),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("thresholdSampleSuccessRatio", r.thresholdSampleSuccessRatio),
      line("textureBuiltFromGovernedSource", r.textureBuiltFromGovernedSource),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("pixelVariancePresent", r.pixelVariancePresent),
      line("drawLoopActive", r.drawLoopActive),
      line("sourceHoldRescanActive", r.sourceHoldRescanActive),
      line("frameCount", r.frameCount),
      line("hexSurfaceDeliveryStatus", r.hexSurfaceDeliveryStatus),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields(),
      textureMeta: clonePlain(textureMeta),
      ...NO_CLAIMS
    };
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();

    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubGovernedSourcePacketVisible2dReceiverReceipt = receipt;
    hearth.canvasHubSourceHoldPlanetSurfaceThresholdReceiverReceipt = receipt;
    hearth.canvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasHubGovernedSourcePacketVisible2dReceiverReceipt = receipt;
    lab.hearthCanvasHubSourceHoldPlanetSurfaceThresholdReceiverReceipt = receipt;
    lab.hearthCanvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    publishRenderGlobals("receipt-publication");

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    record("HEARTH_CANVAS_GLOBALS_PUBLISHED", {
      reason,
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      carrierSurfaceReady: state.carrierSurfaceReady,
      sourceHold: state.sourceHold,
      planetSurfaceReady: state.planetSurfaceReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      activeSourceClass: state.activeSourceClass,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      visualPassClaimed: false
    });

    return true;
  }

  Object.assign(api, {
    contract: PUBLIC_CONTRACT,
    CONTRACT: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    RECEIPT: PUBLIC_RECEIPT,
    canvasContract: PUBLIC_CONTRACT,
    canvasReceipt: PUBLIC_RECEIPT,
    currentCanvasParentContract: PUBLIC_CONTRACT,
    currentCanvasParentReceipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

    canvasHexGatePacket: CANVAS_HEX_GATE_PACKET,
    canvasViewPacket: CANVAS_VIEW_PACKET,
    canvasRenderPacket: CANVAS_RENDER_PACKET,
    carrierSurfacePacket: CARRIER_SURFACE_PACKET,
    planetSurfaceThresholdPacket: PLANET_SURFACE_THRESHOLD_PACKET,

    boot,
    start: boot,
    init: boot,
    run: boot,
    mount,
    refresh,
    dispose,
    startLoop,
    stopLoop,
    startSourceHoldRescan,
    stopSourceHoldRescan,

    receivePacket,
    receiveCanvasHexGatePacket,
    consumeCanvasHexGatePacket,
    acceptCanvasHexGatePacket,
    receiveCanvasViewPacket,
    consumeCanvasViewPacket,
    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveControlPacket,
    acceptControlPacket,

    drawInteractiveFrame,
    drawPairFrame,
    renderFrame,
    requestFrame,
    drawFrame,

    unifySurfaceIdentity,
    collectCanvasCandidates,
    collectSourceAuthorities,
    discoverGovernedSourceAdapters,
    refreshSourceThreshold,
    rebuildSourceTexture,
    buildGovernedTexture,
    sampleGovernedSource,

    composeCarrierSurfacePacket,
    composePlanetSurfaceThresholdPacket,
    composeRenderPacket,
    composeCanvasHexGatePacket,
    sendHexGatePacket,
    readControlAuthority,
    readHexSurfaceAuthority,

    evaluateCarrierSurfaceThreshold,
    evaluatePlanetSurfaceThreshold,
    runGovernedSourceThresholdProbe,

    getReceipt,
    getReceiptLight,
    getCanvasStationReceipt: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getCanvasParentReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getSummary: getReceiptLight,
    getReceiptText,
    getStatusText,
    getState,
    composeReceiptText,
    composeDiagnosticFields,

    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,
    updateDataset,

    supportsBoot: true,
    supportsStart: true,
    supportsInit: true,
    supportsMount: true,
    supportsRefresh: true,
    supportsRenderFrame: true,
    supportsRequestFrame: true,
    supportsDrawInteractiveFrame: true,
    supportsDrawPairFrame: true,
    supportsCanvasViewPacket: true,
    supportsControlPacket: true,
    supportsPlanetaryViewControlPacket: true,
    supportsCanvasHexGatePacket: true,
    supportsHexSurfaceGateForwarding: true,
    supportsGovernedSourceDiscovery: true,
    supportsGovernedSourceTextureRebuild: true,
    supportsCarrierSurfaceThreshold: true,
    supportsSourceHoldFallback: true,
    supportsPlanetSurfaceThreshold: true,

    canvasHubActive: true,
    canvasReceiverActive: true,
    canvasOutputCarrierActive: true,
    sourceHoldThresholdReceiverActive: true,

    ownsCanvasDrawing: true,
    ownsCanvasCreationInsideExistingMount: true,
    ownsCanvasMountHtml: false,
    ownsHtml: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsControlHandshakeTruth: false,
    ownsSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerTruth: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishGlobals("immediate-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_HUB_V12_6_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
