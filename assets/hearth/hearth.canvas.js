// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_TNT_v12_5
// Full-file replacement.
// Canvas Hub / governed-source visible 2D receiver only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route, diagnostics, controls, Hex Surface, and receipts.
// - Remove Canvas-local continent/source authorship as the primary image source.
// - Treat Canvas as receiver/output carrier only.
// - Discover and consume available Hearth governed source authorities when present:
//   composition, elevation, hydrology, materials, terrain, land channel, water channel, air/atmosphere channel,
//   ocean, tectonics, and hex/four-pair authority.
// - Render visible 2D pixels from governed source samples when sample-compatible source authority is available.
// - When governed source is missing or not sample-compatible, draw only a neutral non-authoring carrier shell
//   and report the definitive source choke point instead of inventing continents.
// - Preserve live canvas identity:
//   data-hearth-visible-canvas="true"
//   data-hearth-expression-surface="true"
// - Forward lawful Canvas Hex Gate packets to /assets/hearth/hearth.hex.surface.js through public APIs only.
// - Preserve controls as input authority and Hex Surface as Hex gate toward downstream pointer/finger instruments.
// - Do not mutate HTML contract, route conductor ownership, control ownership, diagnostic chronology, source truth, or North readiness.
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
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_TNT_v12_5";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT_v12_5";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const VERSION =
    "2026-06-06.hearth-canvas-governed-source-packet-visible-2d-receiver-v12-5";

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
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_CANVAS_HEX_GATE_PACKET_v12_5";
  const CANVAS_VIEW_PACKET =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_VIEW_PACKET_v12_5";
  const CANVAS_RENDER_PACKET =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_VISIBLE_2D_RENDER_PACKET_v12_5";

  const TEXTURE_W = 512;
  const TEXTURE_H = 256;

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
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubGovernedSourcePacketVisible2dReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubGovernedSourcePacketVisible2dReceiver"
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
    latestEvent: "HEARTH_CANVAS_HUB_V12_5_LOADED",

    pixelSampleStatus: "NOT_SAMPLED",
    pixelVisible: false,
    visiblePixelCount: 0,
    alphaPixelCount: 0,
    uniqueColorCount: 0,
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
    recommendedNextAction: "BOOT_CANVAS_HUB_AND_DISCOVER_GOVERNED_SOURCE_STACK",

    events: [],
    errors: [],
    surfaces: [],

    ...NO_CLAIMS
  };

  const api = {};
  let sourceAdapters = [];
  let texture = null;
  let textureMeta = null;
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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
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
    canvas.setAttribute("aria-label", "Hearth governed-source visible 2D expression canvas");
    mount.appendChild(canvas);

    state.canvasCreatedByCanvasHub = true;

    record("HEARTH_CANVAS_SURFACE_CREATED_IN_EXISTING_MOUNT", {
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
    canvas.dataset.hearthCanvasGovernedSourceReceiver = "true";
    canvas.dataset.hearthCanvasVisible2dOutputActive = "true";
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
      canvas.setAttribute("aria-label", "Hearth governed-source live 2D planet carrier surface");
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

    if (!prepared.length) {
      state.firstFailedCoordinate = "CANVAS_SURFACE_NOT_AVAILABLE";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS_BEFORE_CANVAS_BOOT";
      state.postgameStatus = "CANVAS_HUB_NO_RENDERABLE_SURFACE";
    }

    record("HEARTH_CANVAS_SURFACE_IDENTITY_UNIFIED", {
      reason,
      canvasElementCount: prepared.length,
      primaryCanvasId: state.primaryCanvasId,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied
    });

    return prepared;
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
    state.sourceFallbackCarrierActive = adapters.length === 0;
    state.fallbackClass = adapters.length === 0 ? "NEUTRAL_CARRIER_ONLY_NO_PLANET_SOURCE_TRUTH" : "NONE";
    state.fallbackReason = adapters.length === 0
      ? state.sourceAdapterStatus
      : "NONE";

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

    const arrayAdapter = makeArrayAdapter(source);
    if (arrayAdapter) return arrayAdapter;

    const methodAdapter = makeMethodAdapter(source);
    if (methodAdapter) return methodAdapter;

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

  function makeArrayAdapter(source) {
    const authority = source.authority;
    if (!authority || !isObject(authority)) return null;

    const found = findArrayLikeSource(authority);
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
      arrayKey: found.key,
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
              width: safeNumber(value.width || value.mapWidth || value.columns || value.cols, authority.width, inferArrayWidth(nested)),
              height: safeNumber(value.height || value.mapHeight || value.rows, authority.height, Math.ceil(nested.length / inferArrayWidth(nested)))
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
    if (len % 256 === 0) return 256;
    if (len % 128 === 0) return 128;
    if (len % 64 === 0) return 64;
    return Math.max(16, Math.round(rootLen));
  }

  function probeAdapter(adapter) {
    const tests = [
      [0, 0],
      [0.25, 0.25],
      [0.5, 0.5],
      [0.75, 0.42],
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
      if (raw.length >= 4 && raw.every((n) => Number.isFinite(Number(n)))) {
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

      if (raw.length) {
        return normalizeSourceSample(raw[0], adapter);
      }

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

  function buildGovernedTexture(reason = "build-texture") {
    if (!sourceAdapters.length) discoverGovernedSourceAdapters(reason);

    texture = new Uint8ClampedArray(TEXTURE_W * TEXTURE_H * 4);
    textureMeta = {
      width: TEXTURE_W,
      height: TEXTURE_H,
      sourceClass: state.activeSourceClass,
      builtAt: nowIso(),
      reason
    };

    let visible = 0;
    let misses = 0;

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
      }
    }

    state.activeTextureBuilt = true;
    state.activeTextureStatus = sourceAdapters.length
      ? "GOVERNED_SOURCE_TEXTURE_BUILT"
      : "NEUTRAL_CARRIER_TEXTURE_BUILT_NO_GOVERNED_SOURCE";
    state.activeTextureWidth = TEXTURE_W;
    state.activeTextureHeight = TEXTURE_H;
    state.sourceFallbackCarrierActive = sourceAdapters.length === 0;

    record("HEARTH_CANVAS_GOVERNED_TEXTURE_BUILT", {
      reason,
      activeTextureStatus: state.activeTextureStatus,
      visibleSamples: visible,
      missedSamples: misses,
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
      const shade = clamp(0.52 + e * 0.22 + grain * 0.10, 0, 1);
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

    const shade = clamp(0.42 + e * 0.26 + grain * 0.10, 0, 1);
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

    drawFrame(options.reason || "receive-packet");
    sendHexGatePacket("receive-packet");

    updateDataset();
    publishReceiptAliases();

    return {
      ...getReceiptLight(false),
      renderPacket: composeRenderPacket("receive-packet"),
      hexGatePacket: composeCanvasHexGatePacket("receive-packet")
    };
  }

  function drawFrame(reason = "draw-frame") {
    const prepared = unifySurfaceIdentity(reason);

    if (!prepared.length) {
      updateDataset();
      publishReceiptAliases();
      return getReceiptLight(false);
    }

    if (!texture || !state.activeTextureBuilt) {
      discoverGovernedSourceAdapters(reason);
      buildGovernedTexture(reason);
    }

    for (const surface of prepared) {
      drawVisibleSurface(surface.ctx, surface.width, surface.height, reason);
    }

    state.frameCount += 1;
    state.drawCount += prepared.length;
    state.lastDrawReason = reason;
    state.lastDrawAt = nowIso();
    state.updatedAt = state.lastDrawAt;

    inspectPixelSample(prepared[0].canvas, prepared[0].ctx);

    if (!state.pixelVisible) {
      state.firstFailedCoordinate = "CANVAS_PIXEL_VISIBLE";
      state.recommendedNextOwner = "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "VERIFY_CANVAS_DRAW_PATH_WRITES_VISIBLE_2D_PIXELS";
      state.postgameStatus = "CANVAS_SURFACE_DRAW_ATTEMPTED_PIXEL_SAMPLE_NOT_VISIBLE";
    } else if (!sourceAdapters.length) {
      state.firstFailedCoordinate = "GOVERNED_SOURCE_SAMPLE_ADAPTER";
      state.recommendedNextOwner = "SOURCE_STACK_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = "/assets/hearth/";
      state.recommendedNextAction = "LOAD_OR_EXPOSE_SAMPLE_COMPATIBLE_GOVERNED_PLANET_SOURCE_AUTHORITY";
      state.postgameStatus = "CANVAS_VISIBLE_NEUTRAL_CARRIER_ONLY_GOVERNED_SOURCE_NOT_SAMPLE_COMPATIBLE";
    } else {
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextOwner = "TEACHER_REVIEW";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_GOVERNED_SOURCE_VISIBLE_2D_OUTPUT_WITHOUT_READY_OR_VISUAL_PASS_CLAIM";
      state.postgameStatus = "CANVAS_GOVERNED_SOURCE_VISIBLE_2D_PIXEL_OUTPUT_CONFIRMED_NO_FINAL_CLAIM";
    }

    updateDataset();
    publishRenderGlobals(reason);

    return getReceiptLight(false);
  }

  function drawVisibleSurface(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0) return;

    const w = width;
    const h = height;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const view = state.viewState;
    const zoom = clamp(view.zoom, 0.55, 2.4);
    const radius = min * 0.43 * clamp(zoom, 0.72, 1.12);

    if (isFunction(ctx.resetTransform)) {
      try {
        ctx.resetTransform();
      } catch (_error) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

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

    const yaw = view.yaw + view.phase * 0.10;
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

    if (!sourceAdapters.length) {
      drawSourceHoldNotice(ctx, cx, cy, radius);
    } else {
      drawReceiptNeedle(ctx, cx, cy, radius, reason);
    }

    state.viewState.phase += sourceAdapters.length ? 0.003 : 0.001;
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
    ctx.strokeStyle = sourceAdapters.length ? "rgba(210,238,255,.10)" : "rgba(210,238,255,.18)";

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
    ctx.lineWidth = Math.max(1, radius * 0.010);
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
    ctx.arc(x2, y2, Math.max(1.8, radius * 0.010), 0, Math.PI * 2);
    ctx.fill();

    if (reason === "boot" || reason === "mount") {
      ctx.fillStyle = "rgba(232,241,255,.72)";
      ctx.font = `${Math.max(9, Math.round(radius * 0.040))}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Mirrorland · Hearth · governed source receiver", cx, cy - radius - Math.max(12, radius * 0.11));
    }

    ctx.restore();
  }

  function drawSourceHoldNotice(ctx, cx, cy, radius) {
    ctx.save();
    ctx.fillStyle = "rgba(255,231,162,.88)";
    ctx.font = `${Math.max(11, Math.round(radius * 0.045))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SOURCE HOLD", cx, cy - radius * 0.08);

    ctx.fillStyle = "rgba(232,241,255,.72)";
    ctx.font = `${Math.max(8, Math.round(radius * 0.030))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("no sample-compatible governed planet source", cx, cy + radius * 0.05);
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
      state.pixelSampleReason = error && error.message ? String(error.message) : safeString(error);
      return;
    }

    state.visiblePixelCount = visiblePixelCount;
    state.alphaPixelCount = alphaPixelCount;
    state.uniqueColorCount = unique.size;
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
      pixelSampleReason: state.pixelSampleReason,

      canvasDrawingPerformedByCanvasHub: true,
      canvasDrawingOwnsSourceTruth: false,
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
      renderPacket: composeRenderPacket(reason),

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
        pixelVisible: state.pixelVisible,
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
    root.HEARTH_CANVAS_GOVERNED_SOURCE_HEX_GATE_PACKET = cloned;

    hearth.canvasHexGatePacket = cloned;
    hearth.canvasLastHexGatePacket = cloned;
    hearth.canvasGovernedSourceHexGatePacket = cloned;

    lab.hearthCanvasHexGatePacket = cloned;
    lab.hearthCanvasLastHexGatePacket = cloned;
    lab.hearthCanvasGovernedSourceHexGatePacket = cloned;

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
    const packet = composeRenderPacket(reason);

    root.HEARTH_CANVAS_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_VISIBLE_2D_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_GOVERNED_SOURCE_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_VISIBLE_PLANET_PROOF = clonePlain(packet);

    hearth.canvasRenderPacket = clonePlain(packet);
    hearth.canvasVisible2dRenderPacket = clonePlain(packet);
    hearth.canvasGovernedSourceRenderPacket = clonePlain(packet);
    hearth.visiblePlanetProof = clonePlain(packet);

    lab.hearthCanvasRenderPacket = clonePlain(packet);
    lab.hearthCanvasVisible2dRenderPacket = clonePlain(packet);
    lab.hearthCanvasGovernedSourceRenderPacket = clonePlain(packet);
    lab.hearthVisiblePlanetProof = clonePlain(packet);

    return packet;
  }

  function startLoop(reason = "start-loop") {
    if (state.drawLoopActive || state.disposed) return getReceiptLight(false);

    state.drawLoopActive = true;
    state.started = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_DRAW_LOOP_ACTIVE_NO_FINAL_CLAIM";

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

    const now = safeNumber(time, Date.now());
    if (!lastFrameTime || now - lastFrameTime > 32) {
      lastFrameTime = now;
      drawFrame("raf-governed-source-visible-2d-output");
    }

    const schedule = isFunction(root.requestAnimationFrame)
      ? root.requestAnimationFrame.bind(root)
      : (fn) => root.setTimeout(fn, 33);

    state.rafId = schedule(tick);
  }

  function mount(options = {}) {
    state.lastMountedAt = nowIso();

    discoverGovernedSourceAdapters(options.reason || "mount");
    buildGovernedTexture(options.reason || "mount");

    const prepared = unifySurfaceIdentity(options.reason || "mount");
    state.mounted = prepared.length > 0;

    if (state.mounted) {
      drawFrame("mount");
      state.postgameStatus = state.pixelVisible
        ? sourceAdapters.length
          ? "CANVAS_HUB_MOUNTED_GOVERNED_SOURCE_VISIBLE_2D_OUTPUT_ACTIVE"
          : "CANVAS_HUB_MOUNTED_NEUTRAL_CARRIER_SOURCE_HOLD"
        : "CANVAS_HUB_MOUNTED_PIXEL_SAMPLE_NOT_VISIBLE";
    }

    updateDataset();
    publishGlobals("mount");

    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_BOOTING_GOVERNED_SOURCE_RECEIVER_V12_5";

    record("HEARTH_CANVAS_HUB_BOOT_START", {
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT
    });

    publishGlobals("boot-early");
    mount({ reason: "boot" });
    drawFrame("boot");
    sendHexGatePacket("boot");

    state.booted = true;
    state.booting = false;

    startLoop("boot");

    record("HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_BOOTED", {
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      surfaceIdentityUnified: state.surfaceIdentityUnified,
      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      activeSourceClass: state.activeSourceClass,
      activeSourceNames: state.activeSourceNames,
      sourceFallbackCarrierActive: state.sourceFallbackCarrierActive,
      visualPassClaimed: false
    });

    updateDataset();
    publishGlobals("boot-complete");

    return getReceipt();
  }

  function refresh(reason = "refresh") {
    readControlAuthority();
    readHexSurfaceAuthority();
    discoverGovernedSourceAdapters(reason);
    buildGovernedTexture(reason);
    unifySurfaceIdentity(reason);
    drawFrame(reason);
    updateDataset();
    publishGlobals(reason);

    return getReceiptLight(false);
  }

  function dispose(reason = "manual-dispose") {
    stopLoop("dispose");
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
    return drawFrame(options.reason || "renderFrame");
  }

  function requestFrame(packet, options = {}) {
    return renderFrame(packet, {
      ...options,
      reason: "requestFrame"
    });
  }

  function rebuildSourceTexture(reason = "rebuild-source-texture") {
    discoverGovernedSourceAdapters(reason);
    buildGovernedTexture(reason);
    drawFrame(reason);
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

    setDataset("hearthCanvasGovernedSourceReceiverActive", "true");
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
      CANVAS_INTERNAL_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      CANVAS_INTERNAL_IMPLEMENTATION_RECEIPT: INTERNAL_IMPLEMENTATION_RECEIPT,
      CANVAS_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      CANVAS_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      CANVAS_VERSION: VERSION,

      CANVAS_HUB_ACTIVE: "true",
      GOVERNED_SOURCE_RECEIVER_ACTIVE: "true",
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
      CANVAS_PIXEL_SAMPLE_REASON: state.pixelSampleReason,

      DRAW_LOOP_ACTIVE: String(state.drawLoopActive),
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
    }

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_PACKET",
      canvasReceiptPacketType: "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT_PACKET_v12_5",
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

      role: "canvas-receiver-output-carrier-governed-source-visible-2d-surface",

      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      canvasHubActive: true,
      canvasReceiverActive: true,
      canvasOutputCarrierActive: true,
      governedSourceReceiverActive: true,
      visible2dOutputActive: state.pixelVisible,
      canvasSurfaceTruthProbeCompatible: true,

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
      "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT",
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
      "SOURCE",
      line("governedSourceReceiverActive", true),
      line("activeSourceClass", r.activeSourceClass),
      line("activeSourceRole", r.activeSourceRole),
      line("activeSourceNames", (r.activeSourceNames || []).join(",")),
      line("sourceAuthorityObservedCount", r.sourceAuthorityObservedCount),
      line("sourceAuthorityNames", (r.sourceAuthorityNames || []).join(",")),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("sourceSampleCapableNames", (r.sourceSampleCapableNames || []).join(",")),
      line("sourceAdapterStatus", r.sourceAdapterStatus),
      line("sourceFallbackCarrierActive", r.sourceFallbackCarrierActive),
      line("fallbackClass", r.fallbackClass),
      line("fallbackReason", r.fallbackReason),
      line("activeTextureBuilt", r.activeTextureBuilt),
      line("activeTextureStatus", r.activeTextureStatus),
      "",
      "SURFACE",
      line("surfaceIdentityUnified", r.surfaceIdentityUnified),
      line("visibleCanvasAttributeApplied", r.visibleCanvasAttributeApplied),
      line("expressionSurfaceAttributeApplied", r.expressionSurfaceAttributeApplied),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasElementCount", r.canvasElementCount),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      "",
      "PIXELS",
      line("pixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("visiblePixelCount", r.visiblePixelCount),
      line("alphaPixelCount", r.alphaPixelCount),
      line("uniqueColorCount", r.uniqueColorCount),
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
      "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("activeSourceClass", r.activeSourceClass),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("sourceFallbackCarrierActive", r.sourceFallbackCarrierActive),
      line("surfaceIdentityUnified", r.surfaceIdentityUnified),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("drawLoopActive", r.drawLoopActive),
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
    root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubGovernedSourcePacketVisible2dReceiverReceipt = receipt;
    hearth.canvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasHubGovernedSourcePacketVisible2dReceiverReceipt = receipt;
    lab.hearthCanvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

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
      canvasElementFound: state.canvasElementFound,
      surfaceIdentityUnified: state.surfaceIdentityUnified,
      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
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

    boot,
    start: boot,
    init: boot,
    run: boot,
    mount,
    refresh,
    dispose,
    startLoop,
    stopLoop,

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
    rebuildSourceTexture,
    buildGovernedTexture,
    sampleGovernedSource,

    composeRenderPacket,
    composeCanvasHexGatePacket,
    sendHexGatePacket,
    readControlAuthority,
    readHexSurfaceAuthority,

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

    canvasHubActive: true,
    canvasReceiverActive: true,
    canvasOutputCarrierActive: true,
    governedSourceReceiverActive: true,

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
    recordError("HEARTH_CANVAS_HUB_V12_5_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
