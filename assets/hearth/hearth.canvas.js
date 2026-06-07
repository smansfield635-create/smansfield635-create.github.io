// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_TNT_v12_7
// Full-file replacement.
// Canvas Hub / preface-handshake surface-worthiness authority only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route, diagnostics, controls, Hex Surface, and receipts.
// - Preserve Canvas as receiver/output carrier only.
// - Create or bind one real visible 2D canvas surface inside the existing Hearth mount.
// - Draw an initial source-hold carrier while governed source truth is absent or not sample-compatible.
// - Treat the initial carrier as a preface-held surface, not as a completed planet.
// - Determine when the drawn canvas surface is worthy enough for the downstream preface/launch file to decommission the preface.
// - Publish a stable first-half handshake for the downstream launch/preface file.
// - Never decommission the preface directly; Canvas only authorizes or withholds the decommission packet.
// - Forward lawful Canvas Hex Gate packets to Hex Surface through public APIs only.
// - Preserve live canvas identity:
//   data-hearth-visible-canvas="true"
//   data-hearth-expression-surface="true"
// - Do not mutate HTML contract, route conductor ownership, control ownership, diagnostic chronology,
//   governed source truth, North readiness, or final visual-pass authority.
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
    "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_TNT_v12_7";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_RECEIPT_v12_7";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_6";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_v12_6";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_TNT_v12_5";

  const VERSION =
    "2026-06-07.hearth-canvas-preface-handshake-surface-worthiness-authority-v12-7";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const PREFACE_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";

  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const PREFACE_HANDSHAKE_PACKET =
    "HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET_v12_7";
  const SURFACE_WORTHINESS_PACKET =
    "HEARTH_CANVAS_SURFACE_WORTHINESS_PACKET_v12_7";
  const PREFACE_DECOMMISSION_PACKET =
    "HEARTH_CANVAS_PREFACE_DECOMMISSION_PACKET_v12_7";
  const CANVAS_HEX_GATE_PACKET =
    "HEARTH_CANVAS_PREFACE_HANDSHAKE_HEX_GATE_PACKET_v12_7";
  const CANVAS_RENDER_PACKET =
    "HEARTH_CANVAS_PREFACE_HANDSHAKE_VISIBLE_2D_RENDER_PACKET_v12_7";

  const TEXTURE_W = 256;
  const TEXTURE_H = 128;
  const SOURCE_PROBE_W = 24;
  const SOURCE_PROBE_H = 12;
  const SOURCE_WORTHY_RATIO = 0.55;
  const SURFACE_WORTHY_SCORE_MINIMUM = 80;
  const SOURCE_HOLD_RESCAN_MS = 1400;
  const LOOP_MIN_MS = 48;

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
    "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubPrefaceHandshakeSurfaceWorthinessAuthority",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubPrefaceHandshakeSurfaceWorthinessAuthority"
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

  const api = {};
  let sourceAdapters = [];
  let texture = null;
  let textureMeta = null;
  let sourceHoldTimer = 0;
  let rafId = 0;
  let lastFrameAt = 0;

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
    canvasSelector: "NONE",
    canvasId: "NONE",
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
    visibleCanvasAttributeApplied: false,
    expressionSurfaceAttributeApplied: false,
    surfaceIdentityUnified: false,

    sourceAuthorityObservedCount: 0,
    sourceAuthorityNames: [],
    sourceSampleCapableCount: 0,
    sourceSampleCapableNames: [],
    sourceAdapterStatus: "NOT_SCANNED",
    sourceHold: true,
    sourceHoldClass: "WAITING_BOOT",
    sourceHoldReason: "WAITING_BOOT",
    sourceHoldInitialCarrierDrawn: false,
    sourceHoldInitialCarrierVisible: false,
    sourceHoldInitialCarrierDrawCount: 0,
    sourceHoldRescanActive: false,
    sourceHoldRescanCount: 0,

    sourceProbeTotal: 0,
    sourceProbeSuccessCount: 0,
    sourceProbeMissCount: 0,
    sourceProbeErrorCount: 0,
    sourceProbeSuccessRatio: 0,

    activeSourceClass: "NOT_SCANNED",
    activeSourceRole: "NONE",
    activeSourceNames: [],
    activeTextureBuilt: false,
    activeTextureStatus: "NOT_BUILT",
    textureBuiltFromGovernedSource: false,
    texturePixelVariancePresent: false,
    textureUniqueColorCount: 0,

    pixelSampleStatus: "NOT_SAMPLED",
    canvasPixelVisible: false,
    visiblePixelCount: 0,
    alphaPixelCount: 0,
    uniqueColorCount: 0,
    pixelVariancePresent: false,
    pixelSampleReason: "NOT_SAMPLED",

    surfaceWorthinessAuthorityActive: true,
    surfaceWorthinessStatus: "WAITING_BOOT",
    surfaceWorthinessScore: 0,
    surfaceWorthy: false,
    surfaceWorthinessFirstFailedCoordinate: "WAITING_BOOT",
    surfaceWorthinessReason: "WAITING_BOOT",

    prefaceHandshakeActive: true,
    prefaceLaunchObserved: false,
    prefaceLaunchSource: "NONE",
    prefaceLaunchContract: "UNKNOWN",
    prefaceLaunchReceipt: "UNKNOWN",
    prefaceHandshakeCount: 0,
    prefaceDecommissionAuthorized: false,
    prefaceHoldRequired: true,
    initialPrefaceMustRemain: true,
    initialPrefaceState: "PREFACE_MUST_REMAIN",
    prefaceDecommissionReason: "WAITING_BOOT",
    lastPrefaceHandshakeStatus: "WAITING_BOOT",

    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE_PREFACE_HOLD",
    visiblePlanetProofSuppressedReason: "WAITING_BOOT",

    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceReceiverMethod: "NONE",
    hexSurfaceDeliveryStatus: "WAITING_CANVAS_HEX_GATE_PACKET",
    hexGatePacketCount: 0,
    hexGateDeliveryCount: 0,

    controlObserved: false,
    controlSource: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

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

    receivePacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    controlPacketCount: 0,
    viewPacketCount: 0,
    renderPacketCount: 0,
    drawCount: 0,
    frameCount: 0,
    resizeCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    lastPacketType: "NONE",
    lastPacketSource: "NONE",
    lastInputType: "NONE",
    lastRejectedReason: "NONE",
    lastValidationStatus: "WAITING_PACKET",
    lastDrawReason: "NOT_DRAWN",
    lastDrawAt: "",
    lastMountedAt: "",
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_HUB_V12_7_LOADED",

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_AND_WAIT_FOR_SURFACE_WORTHINESS",
    postgameStatus: "CANVAS_HUB_LOADED_WAITING_BOOT",

    events: [],
    errors: [],
    surfaces: [],

    ...NO_CLAIMS
  };

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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
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

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    if (state.events.length > 180) state.events.splice(0, state.events.length - 180);

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
    if (state.errors.length > 120) state.errors.splice(0, state.errors.length - 120);

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

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) {
        return { path, value };
      }
    }

    return { path: "NONE", value: null };
  }

  function getDataset() {
    return doc && doc.documentElement && doc.documentElement.dataset
      ? doc.documentElement.dataset
      : {};
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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
      "getHexReceipt",
      "getHexSurfaceReceipt"
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

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
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

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
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
    canvas.setAttribute("aria-label", "Hearth live canvas surface");
    canvas.setAttribute("role", "img");
    mount.appendChild(canvas);

    state.canvasCreatedByCanvasHub = true;

    record("HEARTH_CANVAS_REAL_SURFACE_CREATED_IN_EXISTING_MOUNT", {
      mountSelector: "#hearthCanvasMount",
      canvasId: canvas.id,
      htmlContractMutated: false
    });

    return canvas;
  }

  function markCanvasIdentity(canvas, index = 0) {
    if (!canvas || !canvas.dataset) return;

    if (!canvas.id) {
      canvas.id = index === 0 ? "hearthVisibleExpressionCanvas" : `hearthVisibleExpressionCanvas${index + 1}`;
    }

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
    canvas.dataset.hearthCanvasPrefaceHandshakeAuthority = "true";
    canvas.dataset.hearthCanvasGeneratedImage = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.hearthCanvasSurfaceIndex = String(index);

    try {
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Hearth live 2D canvas surface");
    } catch (_error) {}

    state.visibleCanvasAttributeApplied = true;
    state.expressionSurfaceAttributeApplied = true;
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

    const candidate =
      canvasRectSize > 32
        ? canvasRectSize
        : mountSize > 32
          ? mountSize
          : stageSize > 32
            ? Math.max(238, stageSize - 112)
            : Math.max(238, Math.min(860, viewportSize * 0.78));

    return clamp(candidate, 238, Math.min(860, Math.max(238, viewportSize * 0.92)));
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

  function prepareCanvas(canvas, index = 0) {
    if (!canvas || !isCanvas(canvas)) return null;

    markCanvasIdentity(canvas, index);

    const cssSize = measureAvailableSize(canvas);
    applyCanvasStyle(canvas, cssSize);

    const dpr = clamp(root.devicePixelRatio || 1, 1, 1.65);
    const width = Math.max(238, Math.min(560, Math.round(cssSize * dpr)));
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
      }
    }

    return {
      canvas,
      ctx,
      ctxStatus,
      width,
      height,
      cssSize,
      dpr,
      id: canvas.id || "NONE",
      selector: "canvas[data-hearth-expression-surface='true']"
    };
  }

  function inspectCanvasGeometry(canvas) {
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
    state.canvasId = prepared[0] ? prepared[0].id : "NONE";
    state.canvasSelector = prepared[0] ? "canvas[data-hearth-expression-surface='true']" : "NONE";

    inspectCanvasGeometry(prepared[0] ? prepared[0].canvas : null);
    evaluateSurfaceWorthiness(reason);

    record("HEARTH_CANVAS_SURFACE_IDENTITY_UNIFIED", {
      reason,
      canvasElementCount: prepared.length,
      canvasId: state.canvasId,
      canvasSelector: state.canvasSelector,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero
    });

    return prepared;
  }

  function readControlAuthority() {
    const found = firstGlobal(CONTROL_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = getDataset();

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
    state.controlSource = found.path;
    state.controlContract = contract || "UNKNOWN";
    state.controlReceipt = receiptName || "UNKNOWN";

    return {
      path: found.path,
      authority: found.value,
      receipt,
      contract: state.controlContract,
      receiptName: state.controlReceipt
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

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = getDataset();

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
    state.hexSurfaceSource = found.path;
    state.hexSurfaceContract = contract || "UNKNOWN";
    state.hexSurfaceReceipt = receiptName || "UNKNOWN";
    state.hexSurfaceReceiverMethod = resolveHexSurfaceReceiver(found.value) || "NONE";

    return {
      path: found.path,
      authority: found.value,
      receipt,
      contract: state.hexSurfaceContract,
      receiptName: state.hexSurfaceReceipt,
      method: state.hexSurfaceReceiverMethod
    };
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
        path: found.path,
        authority: found.value,
        receipt,
        contract: contractOf(receipt) || contractOf(found.value) || "UNKNOWN",
        receiptName: receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN"
      });
    }

    state.sourceAuthorityObservedCount = out.length;
    state.sourceAuthorityNames = out.map((item) => item.path);

    return out;
  }

  function discoverGovernedSourceAdapters(reason = "discover") {
    const authorities = collectSourceAuthorities();
    const adapters = [];

    for (const source of authorities) {
      const adapter = makeSourceAdapter(source);
      if (!adapter) continue;

      const probe = probeAdapter(adapter);
      adapter.sampleCapable = probe.sampleCapable;
      adapter.probeReason = probe.reason;
      adapter.probeSample = probe.sample;

      if (probe.sampleCapable) adapters.push(adapter);
    }

    sourceAdapters = adapters;

    state.sourceSampleCapableCount = adapters.length;
    state.sourceSampleCapableNames = adapters.map((adapter) => `${adapter.key}:${adapter.sourcePath}`);
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

    state.activeSourceNames = adapters.map((adapter) => adapter.sourcePath);

    record("HEARTH_CANVAS_GOVERNED_SOURCE_ADAPTER_DISCOVERY_COMPLETE", {
      reason,
      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      activeSourceClass: state.activeSourceClass
    });

    return adapters;
  }

  function makeSourceAdapter(source) {
    if (!source || !source.authority) return null;

    const directArrayAdapter = makeArrayAdapterFromSource(source, source.authority, "authority");
    if (directArrayAdapter) return directArrayAdapter;

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
        sourcePath: source.path,
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
          state.sourceProbeErrorCount += 1;
          if (state.sourceProbeErrorCount < 8) {
            recordError("HEARTH_CANVAS_SOURCE_SAMPLE_METHOD_FAILED", error, { method });
          }
          return null;
        }
      }
    }
  }

  function makeArrayAdapterFromSource(source, candidate, originKey) {
    const found = findArrayLikeSource(candidate);
    if (!found) return null;

    const width = Math.max(1, Math.floor(safeNumber(found.width, inferArrayWidth(found.data))));
    const height = Math.max(1, Math.floor(safeNumber(found.height, Math.ceil(found.data.length / width))));

    return {
      key: source.key,
      role: source.role,
      sourcePath: source.path,
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

  function findArrayLikeSource(candidate) {
    if (!candidate) return null;

    if (Array.isArray(candidate) || ArrayBuffer.isView(candidate)) {
      return {
        key: "direct-array",
        data: candidate,
        width: inferArrayWidth(candidate),
        height: Math.ceil(candidate.length / inferArrayWidth(candidate))
      };
    }

    if (!isObject(candidate)) return null;

    for (const key of ARRAY_KEYS) {
      const value = candidate[key];

      if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return {
          key,
          data: value,
          width: safeNumber(candidate.width || candidate.mapWidth || candidate.columns || candidate.cols, inferArrayWidth(value)),
          height: safeNumber(candidate.height || candidate.mapHeight || candidate.rows, Math.ceil(value.length / inferArrayWidth(value)))
        };
      }

      if (isObject(value)) {
        for (const nestedKey of ARRAY_KEYS) {
          const nested = value[nestedKey];
          if (Array.isArray(nested) || ArrayBuffer.isView(nested)) {
            return {
              key: `${key}.${nestedKey}`,
              data: nested,
              width: safeNumber(value.width || value.mapWidth || value.columns || value.cols || candidate.width, inferArrayWidth(nested)),
              height: safeNumber(value.height || value.mapHeight || value.rows || candidate.height, Math.ceil(nested.length / inferArrayWidth(nested)))
            };
          }
        }
      }
    }

    return null;
  }

  function inferArrayWidth(data) {
    const len = data && data.length ? data.length : 256;
    const sqrt = Math.sqrt(len);
    if (Math.abs(sqrt - Math.round(sqrt)) < 0.001) return Math.round(sqrt);
    if (len % 512 === 0) return 512;
    if (len % 256 === 0) return 256;
    if (len % 128 === 0) return 128;
    if (len % 64 === 0) return 64;
    return Math.max(16, Math.round(sqrt));
  }

  function probeAdapter(adapter) {
    const tests = [
      [0.18, 0.22],
      [0.32, 0.64],
      [0.5, 0.5],
      [0.72, 0.38],
      [0.9, 0.7]
    ];

    for (const pair of tests) {
      const u = pair[0];
      const v = pair[1];
      const raw = adapter.sample(uToLon(u), vToLat(v), u, v);
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
    const rawU = lon / (Math.PI * 2) + 0.5;
    const u = rawU - Math.floor(rawU);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    return { u, v };
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
      if (raw.length >= 4 && firstFourNumbers(raw)) {
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
      rgba
    };

    return normalized.meaningful ? normalized : null;
  }

  function firstFourNumbers(list) {
    for (let index = 0; index < 4; index += 1) {
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
    return /water|ocean|sea|lake|river|bay|basin|hydro|reef|shelf|channel|submerged|wet/.test(safeString(value).toLowerCase());
  }

  function stringLooksLand(value) {
    return /land|terrain|soil|rock|mountain|ridge|crust|plate|desert|forest|plain|summit|dry|continent|island/.test(safeString(value).toLowerCase());
  }

  function sampleGovernedSource(lon, lat) {
    const uv = lonLatToUv(lon, lat);

    if (!sourceAdapters.length) {
      return null;
    }

    const samples = [];

    for (const adapter of sourceAdapters) {
      const raw = adapter.sample(lon, lat, uv.u, uv.v);
      const normalized = normalizeSourceSample(raw, adapter);
      if (normalized && normalized.meaningful) samples.push(normalized);
    }

    if (!samples.length) return null;

    return mergeSourceSamples(samples, lon, lat);
  }

  function mergeSourceSamples(samples, lon, lat) {
    let landVotes = 0;
    let waterVotes = 0;
    let elevationSum = 0;
    let elevationCount = 0;
    let moistureSum = 0;
    let moistureCount = 0;
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

      if (!material && sample.material) material = sample.material;
      if (!className && sample.className) className = sample.className;
    }

    const elevation = elevationCount ? elevationSum / elevationCount : 0;
    const moisture = moistureCount ? moistureSum / moistureCount : 0;

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

  function runSourceProbe(reason = "source-probe") {
    if (!sourceAdapters.length) {
      state.sourceProbeTotal = SOURCE_PROBE_W * SOURCE_PROBE_H;
      state.sourceProbeSuccessCount = 0;
      state.sourceProbeMissCount = state.sourceProbeTotal;
      state.sourceProbeSuccessRatio = 0;
      state.sourceHold = true;
      state.sourceHoldClass = "NO_SAMPLE_COMPATIBLE_GOVERNED_SOURCE";
      state.sourceHoldReason = state.sourceAdapterStatus;
      return false;
    }

    let total = 0;
    let success = 0;
    let misses = 0;

    for (let y = 0; y < SOURCE_PROBE_H; y += 1) {
      const v = (y + 0.5) / SOURCE_PROBE_H;

      for (let x = 0; x < SOURCE_PROBE_W; x += 1) {
        const u = (x + 0.5) / SOURCE_PROBE_W;
        total += 1;

        const sample = sampleGovernedSource(uToLon(u), vToLat(v));
        if (sample) success += 1;
        else misses += 1;
      }
    }

    const ratio = total ? success / total : 0;

    state.sourceProbeTotal = total;
    state.sourceProbeSuccessCount = success;
    state.sourceProbeMissCount = misses;
    state.sourceProbeSuccessRatio = ratio;

    const passed = ratio >= SOURCE_WORTHY_RATIO;

    if (passed) {
      state.sourceHold = false;
      state.sourceHoldClass = "NONE";
      state.sourceHoldReason = "NONE_GOVERNED_SOURCE_PROBE_PASSED";
    } else {
      state.sourceHold = true;
      state.sourceHoldClass = "GOVERNED_SOURCE_PROBE_NOT_WORTHY";
      state.sourceHoldReason = `GOVERNED_SOURCE_RATIO_${ratio.toFixed(3)}_LT_${SOURCE_WORTHY_RATIO}`;
    }

    record("HEARTH_CANVAS_GOVERNED_SOURCE_PROBE_COMPLETE", {
      reason,
      total,
      success,
      misses,
      ratio,
      required: SOURCE_WORTHY_RATIO,
      passed
    });

    return passed;
  }

  function refreshSources(reason = "refresh-sources") {
    discoverGovernedSourceAdapters(reason);

    const sourceReady = runSourceProbe(reason);

    if (!sourceReady) {
      texture = null;
      textureMeta = null;
      state.activeTextureBuilt = false;
      state.textureBuiltFromGovernedSource = false;
      state.texturePixelVariancePresent = false;
      state.textureUniqueColorCount = 0;
      state.activeTextureStatus = "TEXTURE_HELD_BY_SOURCE_PROBE";
      evaluateSurfaceWorthiness("source-held");
      return false;
    }

    buildGovernedTexture(reason);
    evaluateSurfaceWorthiness("source-ready");
    return true;
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

        const color = sample ? colorFromSourceSample(sample, lon, lat) : neutralCarrierColor(lon, lat);

        if (sample) visible += 1;
        else misses += 1;

        const index = (y * TEXTURE_W + x) * 4;
        texture[index] = color[0];
        texture[index + 1] = color[1];
        texture[index + 2] = color[2];
        texture[index + 3] = color[3];

        if (x % 12 === 0 && y % 12 === 0) {
          unique.add(`${color[0]},${color[1]},${color[2]},${color[3]}`);
        }
      }
    }

    state.activeTextureBuilt = true;
    state.textureBuiltFromGovernedSource = true;
    state.textureUniqueColorCount = unique.size;
    state.texturePixelVariancePresent = unique.size >= 4;
    state.activeTextureStatus = "GOVERNED_SOURCE_TEXTURE_BUILT";

    record("HEARTH_CANVAS_GOVERNED_TEXTURE_BUILT", {
      reason,
      visibleSamples: visible,
      missedSamples: misses,
      textureUniqueColorCount: state.textureUniqueColorCount,
      texturePixelVariancePresent: state.texturePixelVariancePresent
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
      const depth = clamp(-e * 0.75 + 0.42 + grain * 0.05, 0, 1);
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

    const shade = clamp(0.36 + e * 0.28 + moisture * 0.18 + grain * 0.11, 0, 1);
    return [
      Math.round(38 + 86 * shade),
      Math.round(72 + 92 * shade),
      Math.round(46 + 62 * shade),
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

    state.viewState = {
      yaw: incomingYaw !== undefined ? safeNumber(incomingYaw, current.yaw) : current.yaw + deltaYaw,
      pitch: clamp(incomingPitch !== undefined ? safeNumber(incomingPitch, current.pitch) : current.pitch + deltaPitch, -1.25, 1.25),
      zoom: clamp(incomingZoom !== undefined ? safeNumber(incomingZoom, current.zoom) : current.zoom + deltaZoom, 0.55, 2.4),
      phase: incomingPhase !== undefined ? safeNumber(incomingPhase, current.phase) : current.phase,
      minPitch: current.minPitch,
      maxPitch: current.maxPitch,
      minZoom: current.minZoom,
      maxZoom: current.maxZoom
    };

    state.lastInputType = safeString(packet.inputType || options.inputType || "view-packet");
    state.lastPacketType = safeString(packet.packetType || packet.type || "VIEW_PACKET");
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
    state.lastRejectedReason = "NONE";
    state.lastValidationStatus = "ACCEPTED";

    if (options.controlPacket === true) state.controlPacketCount += 1;
    if (options.viewPacket === true) state.viewPacketCount += 1;

    applyViewPacket(packet || {}, options);

    if (!state.activeTextureBuilt) {
      refreshSources("receive-packet");
    }

    drawFrame(options.reason || "receive-packet");
    sendHexGatePacket("receive-packet");
    releaseToPrefaceLaunch("receive-packet");

    return {
      ...getReceiptLight(false),
      prefaceHandshakePacket: composePrefaceHandshakePacket("receive-packet"),
      surfaceWorthinessPacket: getCanvasSurfaceWorthinessPacket("receive-packet"),
      prefaceDecommissionPacket: getPrefaceDecommissionPacket("receive-packet"),
      renderPacket: composeRenderPacket("receive-packet"),
      hexGatePacket: composeCanvasHexGatePacket("receive-packet")
    };
  }

  function resetCtx(ctx) {
    if (!ctx) return;

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

  function drawFrame(reason = "draw-frame") {
    const prepared = unifySurfaceIdentity(reason);

    if (!prepared.length) {
      state.firstFailedCoordinate = "CANVAS_ELEMENT_FOUND";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS_BEFORE_CANVAS_BOOT";
      state.postgameStatus = "CANVAS_HUB_NO_RENDERABLE_SURFACE";
      evaluateSurfaceWorthiness("no-surface");
      updateDataset();
      publishReceiptAliases();
      return getReceiptLight(false);
    }

    const sourceReady =
      sourceAdapters.length > 0 &&
      texture &&
      state.textureBuiltFromGovernedSource === true &&
      state.texturePixelVariancePresent === true &&
      state.sourceProbeSuccessRatio >= SOURCE_WORTHY_RATIO;

    for (const surface of prepared) {
      if (sourceReady) {
        drawVisiblePlanetSurface(surface.ctx, surface.width, surface.height, reason);
      } else {
        drawInitialCarrierSurface(surface.ctx, surface.width, surface.height, reason);
      }
    }

    state.renderPacketCount += 1;
    state.frameCount += 1;
    state.drawCount += prepared.length;
    state.lastDrawReason = reason;
    state.lastDrawAt = nowIso();
    state.updatedAt = state.lastDrawAt;

    inspectPixelSample(prepared[0].canvas, prepared[0].ctx);
    evaluateSurfaceWorthiness(reason);
    updateDataset();
    publishRenderGlobals(reason);
    publishReceiptAliases();

    return getReceiptLight(false);
  }

  function drawInitialCarrierSurface(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0) return;

    state.sourceHoldInitialCarrierDrawn = true;
    state.sourceHoldInitialCarrierVisible = true;
    state.sourceHoldInitialCarrierDrawCount += 1;

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
    ctx.fillText("PREFACE HOLD", cx, cy - radius * 0.08);

    ctx.fillStyle = "rgba(232,241,255,.72)";
    ctx.font = `${Math.max(8, Math.round(radius * 0.032))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("real canvas surface", cx, cy + radius * 0.045);
    ctx.fillText("not yet worthy for decommission", cx, cy + radius * 0.13);
    ctx.restore();

    if (reason === "boot" || reason === "mount") {
      ctx.save();
      ctx.fillStyle = "rgba(232,241,255,.58)";
      ctx.font = `${Math.max(8, Math.round(radius * 0.028))}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("waiting for governed source threshold", cx, cy + radius + Math.max(14, radius * 0.1));
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

    drawBands(ctx, cx, cy, radius, view);
    drawAtmosphere(ctx, cx, cy, radius);
    drawReceiptNeedle(ctx, cx, cy, radius, reason);

    state.viewState.phase += 0.003;
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

    for (let i = 0; i < 70; i += 1) {
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

  function drawBands(ctx, cx, cy, radius, view) {
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
      state.canvasPixelVisible = false;
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
      state.canvasPixelVisible = false;
      state.visiblePixelCount = 0;
      state.alphaPixelCount = 0;
      state.uniqueColorCount = 0;
      state.pixelVariancePresent = false;
      state.pixelSampleReason = "CANVAS_DIMENSIONS_ZERO";
      return;
    }

    const xs = [0.18, 0.32, 0.5, 0.68, 0.82];
    const ys = [0.18, 0.32, 0.5, 0.68, 0.82];

    let alpha = 0;
    let visible = 0;
    const unique = new Set();

    try {
      for (const yRatio of ys) {
        for (const xRatio of xs) {
          const x = Math.max(0, Math.min(width - 1, Math.round(width * xRatio)));
          const y = Math.max(0, Math.min(height - 1, Math.round(height * yRatio)));
          const data = ctx.getImageData(x, y, 1, 1).data;

          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;

          if (a > 0) alpha += 1;
          if (a > 0 && (r > 0 || g > 0 || b > 0)) visible += 1;

          unique.add(`${r},${g},${b},${a}`);
        }
      }
    } catch (error) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.canvasPixelVisible = false;
      state.visiblePixelCount = visible;
      state.alphaPixelCount = alpha;
      state.uniqueColorCount = unique.size;
      state.pixelVariancePresent = unique.size >= 3;
      state.pixelSampleReason = error && error.message ? String(error.message) : safeString(error);
      return;
    }

    state.visiblePixelCount = visible;
    state.alphaPixelCount = alpha;
    state.uniqueColorCount = unique.size;
    state.pixelVariancePresent = unique.size >= 3;
    state.canvasPixelVisible = visible > 0;
    state.pixelSampleStatus = state.canvasPixelVisible
      ? "PIXEL_SAMPLE_VISIBLE"
      : alpha > 0
        ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
        : "PIXEL_SAMPLE_BLANK";
    state.pixelSampleReason = state.canvasPixelVisible
      ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
      : alpha > 0
        ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
        : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID";
  }

  function evaluateSurfaceWorthiness(reason = "evaluate-surface-worthiness") {
    const criteria = {
      canvasElementFound: state.canvasElementFound === true,
      canvasContext2dReady: state.canvasContext2dReady === true,
      canvasRectNonzero: state.canvasRectNonzero === true,
      canvasComputedVisible: state.canvasComputedVisible === true,
      canvasPixelVisible: state.canvasPixelVisible === true,
      pixelVariancePresent: state.pixelVariancePresent === true,
      governedSourceObserved: state.sourceAuthorityObservedCount > 0,
      sourceSampleCapable: state.sourceSampleCapableCount > 0,
      governedSourceProbePassed: state.sourceProbeSuccessRatio >= SOURCE_WORTHY_RATIO,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource === true,
      texturePixelVariancePresent: state.texturePixelVariancePresent === true
    };

    let score = 0;
    if (criteria.canvasElementFound) score += 12;
    if (criteria.canvasContext2dReady) score += 12;
    if (criteria.canvasRectNonzero) score += 10;
    if (criteria.canvasComputedVisible) score += 10;
    if (criteria.canvasPixelVisible) score += 10;
    if (criteria.pixelVariancePresent) score += 8;
    if (criteria.governedSourceObserved) score += 8;
    if (criteria.sourceSampleCapable) score += 10;
    if (criteria.governedSourceProbePassed) score += 8;
    if (criteria.textureBuiltFromGovernedSource) score += 6;
    if (criteria.texturePixelVariancePresent) score += 6;

    const worthy = Boolean(
      score >= SURFACE_WORTHY_SCORE_MINIMUM &&
      criteria.canvasElementFound &&
      criteria.canvasContext2dReady &&
      criteria.canvasRectNonzero &&
      criteria.canvasComputedVisible &&
      criteria.canvasPixelVisible &&
      criteria.pixelVariancePresent &&
      criteria.sourceSampleCapable &&
      criteria.governedSourceProbePassed &&
      criteria.textureBuiltFromGovernedSource &&
      criteria.texturePixelVariancePresent
    );

    state.surfaceWorthinessScore = score;
    state.surfaceWorthy = worthy;
    state.prefaceDecommissionAuthorized = worthy;
    state.prefaceHoldRequired = !worthy;
    state.initialPrefaceMustRemain = !worthy;
    state.initialPrefaceState = worthy
      ? "PREFACE_MAY_BE_DECOMMISSIONED_BY_LAUNCH_FILE"
      : "PREFACE_MUST_REMAIN";

    state.visiblePlanetProofReady = worthy;
    state.visiblePlanetProofSource = worthy
      ? "CANVAS_SURFACE_WORTHINESS_AUTHORITY_GOVERNED_SOURCE_2D_SURFACE"
      : "NONE_PREFACE_HOLD_OR_SOURCE_HOLD";
    state.visiblePlanetProofSuppressedReason = worthy ? "NONE" : firstFailedWorthinessCoordinate(criteria);

    state.surfaceWorthinessStatus = worthy
      ? "SURFACE_WORTHY_PREFACE_DECOMMISSION_AUTHORIZED"
      : "SURFACE_NOT_YET_WORTHY_PREFACE_HOLD_REQUIRED";
    state.surfaceWorthinessFirstFailedCoordinate = worthy ? "NONE" : firstFailedWorthinessCoordinate(criteria);
    state.surfaceWorthinessReason = worthy
      ? "GOVERNED_SOURCE_CANVAS_SURFACE_MET_WORTHINESS_CRITERIA"
      : `HELD_AT_${state.surfaceWorthinessFirstFailedCoordinate}`;

    state.prefaceDecommissionReason = worthy
      ? "SURFACE_WORTHY_REPLACEMENT_OBJECT_READY"
      : state.surfaceWorthinessReason;

    if (!worthy) {
      state.firstFailedCoordinate = state.surfaceWorthinessFirstFailedCoordinate;
      state.recommendedNextOwner =
        state.surfaceWorthinessFirstFailedCoordinate.indexOf("CANVAS") === 0
          ? "CANVAS_SURFACE"
          : "GOVERNED_SOURCE_STACK";
      state.recommendedNextFile =
        state.recommendedNextOwner === "CANVAS_SURFACE" ? FILE : "/assets/hearth/";
      state.recommendedNextAction =
        state.recommendedNextOwner === "CANVAS_SURFACE"
          ? "VERIFY_REAL_VISIBLE_2D_CANVAS_SURFACE"
          : "LOAD_OR_EXPOSE_SAMPLE_COMPATIBLE_GOVERNED_PLANET_SOURCE";
      state.postgameStatus = "CANVAS_PREFACE_HOLD_SURFACE_NOT_YET_WORTHY";
    } else {
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextOwner = "PREFACE_LAUNCH_FILE";
      state.recommendedNextFile = PREFACE_LAUNCH_FILE;
      state.recommendedNextAction = "CONSUME_PREFACE_DECOMMISSION_PACKET_AND_EXPOSE_WORTHY_CANVAS";
      state.postgameStatus = "CANVAS_SURFACE_WORTHY_WAITING_PREFACE_LAUNCH_ENFORCEMENT";
    }

    markPrimaryCanvasWorthinessDataset();

    record("HEARTH_CANVAS_SURFACE_WORTHINESS_EVALUATED", {
      reason,
      score,
      worthy,
      firstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized
    });

    return worthy;
  }

  function firstFailedWorthinessCoordinate(criteria) {
    if (!criteria.canvasElementFound) return "CANVAS_ELEMENT_FOUND";
    if (!criteria.canvasContext2dReady) return "CANVAS_CONTEXT_2D_READY";
    if (!criteria.canvasRectNonzero) return "CANVAS_RECT_NONZERO";
    if (!criteria.canvasComputedVisible) return "CANVAS_COMPUTED_VISIBLE";
    if (!criteria.canvasPixelVisible) return "CANVAS_PIXEL_VISIBLE";
    if (!criteria.pixelVariancePresent) return "PIXEL_VARIANCE_PRESENT";
    if (!criteria.governedSourceObserved) return "GOVERNED_SOURCE_OBSERVED";
    if (!criteria.sourceSampleCapable) return "SOURCE_SAMPLE_CAPABLE";
    if (!criteria.governedSourceProbePassed) return "GOVERNED_SOURCE_PROBE_PASSED";
    if (!criteria.textureBuiltFromGovernedSource) return "TEXTURE_BUILT_FROM_GOVERNED_SOURCE";
    if (!criteria.texturePixelVariancePresent) return "TEXTURE_PIXEL_VARIANCE_PRESENT";
    return "SURFACE_WORTHINESS_SCORE";
  }

  function markPrimaryCanvasWorthinessDataset() {
    const canvas = collectCanvasCandidates()[0] || null;
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasSurfaceWorthinessAuthorityActive = "true";
    canvas.dataset.hearthCanvasSurfaceWorthinessStatus = state.surfaceWorthinessStatus;
    canvas.dataset.hearthCanvasSurfaceWorthinessScore = String(state.surfaceWorthinessScore);
    canvas.dataset.hearthCanvasSurfaceWorthy = String(state.surfaceWorthy);
    canvas.dataset.hearthCanvasSurfaceWorthinessFirstFailedCoordinate = state.surfaceWorthinessFirstFailedCoordinate;
    canvas.dataset.hearthCanvasPrefaceHandshakeActive = "true";
    canvas.dataset.hearthCanvasPrefaceDecommissionAuthorized = String(state.prefaceDecommissionAuthorized);
    canvas.dataset.hearthCanvasPrefaceHoldRequired = String(state.prefaceHoldRequired);
    canvas.dataset.hearthCanvasInitialPrefaceMustRemain = String(state.initialPrefaceMustRemain);
    canvas.dataset.hearthCanvasInitialPrefaceState = state.initialPrefaceState;
    canvas.dataset.hearthCanvasVisiblePlanetProofReady = String(state.visiblePlanetProofReady);
    canvas.dataset.hearthCanvasVisiblePlanetProofSource = state.visiblePlanetProofSource;
  }

  function getCanvasSurfaceWorthinessPacket(reason = "surface-worthiness") {
    return {
      packetType: SURFACE_WORTHINESS_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-surface-worthiness-authority",
      reason,
      composedAt: nowIso(),

      surfaceWorthinessAuthorityActive: true,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessScoreMinimum: SURFACE_WORTHY_SCORE_MINIMUM,
      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      surfaceWorthinessReason: state.surfaceWorthinessReason,

      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasPixelVisible: state.canvasPixelVisible,
      pixelSampleStatus: state.pixelSampleStatus,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelVariancePresent: state.pixelVariancePresent,

      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceAuthorityNames: clonePlain(state.sourceAuthorityNames),
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceSampleCapableNames: clonePlain(state.sourceSampleCapableNames),
      sourceAdapterStatus: state.sourceAdapterStatus,
      sourceProbeSuccessRatio: state.sourceProbeSuccessRatio,
      sourceProbeRequiredRatio: SOURCE_WORTHY_RATIO,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      textureUniqueColorCount: state.textureUniqueColorCount,

      initialCarrierDrawn: state.sourceHoldInitialCarrierDrawn,
      initialCarrierVisible: state.sourceHoldInitialCarrierVisible,
      initialCarrierDoesNotCountAsWorthySurface: true,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getPrefaceDecommissionPacket(reason = "preface-decommission") {
    return {
      packetType: PREFACE_DECOMMISSION_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "preface-decommission-authorization-source",
      destinationFile: PREFACE_LAUNCH_FILE,
      reason,
      composedAt: nowIso(),

      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      initialPrefaceMustRemain: state.initialPrefaceMustRemain,
      initialPrefaceState: state.initialPrefaceState,
      prefaceDecommissionReason: state.prefaceDecommissionReason,
      decommissionOnlyWhenSurfaceWorthy: true,
      launchFileOwnsActualDecommission: true,
      canvasDoesNotRemovePreface: true,

      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      surfaceWorthinessPacket: getCanvasSurfaceWorthinessPacket(reason),

      actionForLaunchFile: state.prefaceDecommissionAuthorized
        ? "DECOMMISSION_PREFACE_AND_EXPOSE_WORTHY_CANVAS_SURFACE"
        : "HOLD_PREFACE_AND_KEEP_CANVAS_SURFACE_PREPARED",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composePrefaceHandshakePacket(reason = "preface-handshake") {
    state.prefaceHandshakeCount += 1;

    const worthinessPacket = getCanvasSurfaceWorthinessPacket(reason);
    const decommissionPacket = getPrefaceDecommissionPacket(reason);

    const packet = {
      packetType: PREFACE_HANDSHAKE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-authority-first-half-preface-handshake",
      destinationFile: PREFACE_LAUNCH_FILE,
      targetRoute: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reason,
      composedAt: nowIso(),

      prefaceHandshakeActive: true,
      prefaceHandshakeCount: state.prefaceHandshakeCount,
      canvasAuthorityOwnsWorthinessDecision: true,
      launchFileOwnsPrefaceHoldAndDecommissionEnforcement: true,
      initialPrefaceIsNotFailureState: true,
      prefaceIsInitialStateUntilWorthyReplacement: true,
      fallbackStateBeginsOnlyAfterWorthyObjectCanReplacePreface: true,

      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      initialPrefaceMustRemain: state.initialPrefaceMustRemain,
      initialPrefaceState: state.initialPrefaceState,
      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,

      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasPixelVisible: state.canvasPixelVisible,
      pixelVariancePresent: state.pixelVariancePresent,

      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceProbeSuccessRatio: state.sourceProbeSuccessRatio,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,

      surfaceWorthinessPacket: worthinessPacket,
      prefaceDecommissionPacket: decommissionPacket,
      renderPacket: composeRenderPacket(reason),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    state.lastPrefaceHandshakeStatus = packet.prefaceDecommissionAuthorized
      ? "HANDSHAKE_AUTHORIZES_PREFACE_DECOMMISSION"
      : "HANDSHAKE_REQUIRES_PREFACE_HOLD";

    return packet;
  }

  function receivePrefaceLaunchPacket(packet = {}, options = {}) {
    const p = isObject(packet) ? packet : {};

    state.prefaceLaunchObserved = true;
    state.prefaceLaunchSource = firstNonEmpty(
      p.sourceFile,
      p.fromFile,
      p.sourceAuthority,
      options.source,
      PREFACE_LAUNCH_FILE
    );
    state.prefaceLaunchContract = firstNonEmpty(p.contract, p.CONTRACT, "UNKNOWN");
    state.prefaceLaunchReceipt = firstNonEmpty(p.receipt, p.RECEIPT, "UNKNOWN");

    record("HEARTH_CANVAS_PREFACE_LAUNCH_PACKET_RECEIVED", {
      source: state.prefaceLaunchSource,
      contract: state.prefaceLaunchContract,
      receipt: state.prefaceLaunchReceipt,
      requestBoot: p.requestCanvasBoot === true,
      requestRefresh: p.requestCanvasRefresh === true
    });

    if (p.requestCanvasBoot === true && !state.booted) boot({ reason: "preface-launch-request" });
    if (p.requestCanvasRefresh === true) refresh("preface-launch-request");

    const handshake = composePrefaceHandshakePacket("receive-preface-launch-packet");

    publishPrefaceHandshakeGlobals(handshake);
    updateDataset();
    publishReceiptAliases();

    return handshake;
  }

  function releaseToPrefaceLaunch(reason = "release-to-preface-launch") {
    const handshake = composePrefaceHandshakePacket(reason);
    publishPrefaceHandshakeGlobals(handshake);

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(handshake) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(handshake) }));
      }
    } catch (_error) {}

    return handshake;
  }

  function publishPrefaceHandshakeGlobals(handshake) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(handshake);
    const worthiness = clonePlain(handshake.surfaceWorthinessPacket);
    const decommission = clonePlain(handshake.prefaceDecommissionPacket);

    root.HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET = cloned;
    root.HEARTH_CANVAS_SURFACE_WORTHINESS_PACKET = worthiness;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_PACKET = decommission;

    hearth.canvasPrefaceHandshakePacket = cloned;
    hearth.canvasSurfaceWorthinessPacket = worthiness;
    hearth.canvasPrefaceDecommissionPacket = decommission;

    lab.hearthCanvasPrefaceHandshakePacket = cloned;
    lab.hearthCanvasSurfaceWorthinessPacket = worthiness;
    lab.hearthCanvasPrefaceDecommissionPacket = decommission;

    return true;
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
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-receiver-output-carrier",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reason,
      composedAt: nowIso(),

      viewState: clonePlain(state.viewState),

      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,

      pixelSampleStatus: state.pixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelVariancePresent: state.pixelVariancePresent,

      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      initialCarrierDrawn: state.sourceHoldInitialCarrierDrawn,
      initialCarrierVisible: state.sourceHoldInitialCarrierVisible,
      initialCarrierDoesNotCountAsWorthySurface: true,

      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),
      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceProbeSuccessRatio: state.sourceProbeSuccessRatio,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,

      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,

      canvasDrawingPerformedByCanvasHub: true,
      canvasDrawingOwnsSourceTruth: false,
      terrainTruthOwned: false,
      hydrologyTruthOwned: false,
      elevationTruthOwned: false,
      materialTruthOwned: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
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
      reason,
      composedAt: nowIso(),

      canvasFile: FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      prefaceLaunchFile: PREFACE_LAUNCH_FILE,

      viewState: clonePlain(state.viewState),
      renderPacket: composeRenderPacket(reason),
      prefaceHandshakePacket: composePrefaceHandshakePacket(reason),

      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      canvasPixelVisible: state.canvasPixelVisible,
      pixelSampleStatus: state.pixelSampleStatus,

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

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
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
          recordError("HEARTH_CANVAS_HEX_SURFACE_ASYNC_DELIVERY_FAILED", error, { method: hex.method });
        });
      }

      publishHexGateGlobals(packet);

      record("HEARTH_CANVAS_HEX_GATE_PACKET_DELIVERED", {
        method: hex.method,
        reason,
        hexSurfaceSource: hex.path,
        surfaceWorthy: state.surfaceWorthy,
        prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized
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
      recordError("HEARTH_CANVAS_HEX_SURFACE_DELIVERY_FAILED", error, { method: hex.method });

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
    root.HEARTH_CANVAS_PREFACE_HANDSHAKE_HEX_GATE_PACKET = cloned;

    hearth.canvasHexGatePacket = cloned;
    hearth.canvasLastHexGatePacket = cloned;
    hearth.canvasPrefaceHandshakeHexGatePacket = cloned;

    lab.hearthCanvasHexGatePacket = cloned;
    lab.hearthCanvasLastHexGatePacket = cloned;
    lab.hearthCanvasPrefaceHandshakeHexGatePacket = cloned;

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }
    } catch (_error) {}

    return true;
  }

  function publishRenderGlobals(reason = "render") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const renderPacket = composeRenderPacket(reason);

    root.HEARTH_CANVAS_RENDER_PACKET = clonePlain(renderPacket);
    root.HEARTH_CANVAS_VISIBLE_2D_RENDER_PACKET = clonePlain(renderPacket);
    root.HEARTH_CANVAS_PREFACE_HANDSHAKE_RENDER_PACKET = clonePlain(renderPacket);

    hearth.canvasRenderPacket = clonePlain(renderPacket);
    hearth.canvasVisible2dRenderPacket = clonePlain(renderPacket);
    hearth.canvasPrefaceHandshakeRenderPacket = clonePlain(renderPacket);

    lab.hearthCanvasRenderPacket = clonePlain(renderPacket);
    lab.hearthCanvasVisible2dRenderPacket = clonePlain(renderPacket);
    lab.hearthCanvasPrefaceHandshakeRenderPacket = clonePlain(renderPacket);

    const visibleProof = {
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      sourceFile: FILE,
      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,
      renderedPlanetProofReady: state.visiblePlanetProofReady,
      currentVisibleProofValid: state.visiblePlanetProofReady,
      domVisiblePlanetProofReady: state.visiblePlanetProofReady,
      canvasMounted: state.canvasElementFound,
      canvasDrawComplete: state.surfaceWorthy,
      baseGlobeDrawComplete: state.surfaceWorthy,
      initialCarrierDoesNotCountAsVisiblePlanet: true,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    root.HEARTH_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);
    root.HEARTH_CANVAS_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);
    hearth.visiblePlanetProof = clonePlain(visibleProof);
    hearth.canvasVisiblePlanetProof = clonePlain(visibleProof);
    lab.hearthVisiblePlanetProof = clonePlain(visibleProof);
    lab.hearthCanvasVisiblePlanetProof = clonePlain(visibleProof);

    return renderPacket;
  }

  function startSourceHoldRescan(reason = "source-hold-rescan") {
    if (sourceHoldTimer || state.disposed) return getReceiptLight(false);

    state.sourceHoldRescanActive = true;

    record("HEARTH_CANVAS_SOURCE_HOLD_RESCAN_STARTED", { reason });

    sourceHoldTimer = root.setInterval(() => {
      if (state.disposed) {
        stopSourceHoldRescan("disposed");
        return;
      }

      state.sourceHoldRescanCount += 1;

      const ready = refreshSources(`source-hold-rescan-${state.sourceHoldRescanCount}`);
      drawFrame(ready ? "source-threshold-ready" : "source-hold-rescan-initial-carrier");
      releaseToPrefaceLaunch("source-hold-rescan");

      if (ready && state.surfaceWorthy) {
        stopSourceHoldRescan("surface-worthy");
        startLoop("surface-worthy");
      }
    }, SOURCE_HOLD_RESCAN_MS);

    return getReceiptLight(false);
  }

  function stopSourceHoldRescan(reason = "stop-source-hold-rescan") {
    if (sourceHoldTimer) {
      root.clearInterval(sourceHoldTimer);
      sourceHoldTimer = 0;
    }

    state.sourceHoldRescanActive = false;

    record("HEARTH_CANVAS_SOURCE_HOLD_RESCAN_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function startLoop(reason = "start-loop") {
    if (state.disposed) return getReceiptLight(false);
    if (rafId) return getReceiptLight(false);

    state.started = true;
    state.startedAt = state.startedAt || nowIso();

    record("HEARTH_CANVAS_LOOP_STARTED", { reason });

    const schedule = isFunction(root.requestAnimationFrame)
      ? root.requestAnimationFrame.bind(root)
      : (fn) => root.setTimeout(() => fn(Date.now()), LOOP_MIN_MS);

    function tick(time) {
      if (state.disposed || !state.started) {
        rafId = 0;
        return;
      }

      const now = safeNumber(time, Date.now());

      if (!lastFrameAt || now - lastFrameAt >= LOOP_MIN_MS) {
        lastFrameAt = now;
        drawFrame(state.surfaceWorthy ? "loop-worthy-surface" : "loop-preface-hold");
        releaseToPrefaceLaunch("loop");
      }

      rafId = schedule(tick);
    }

    rafId = schedule(tick);

    return getReceiptLight(false);
  }

  function stopLoop(reason = "stop-loop") {
    state.started = false;

    if (rafId) {
      try {
        if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(rafId);
        else root.clearTimeout(rafId);
      } catch (_error) {}
    }

    rafId = 0;

    record("HEARTH_CANVAS_LOOP_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function mount(options = {}) {
    state.lastMountedAt = nowIso();

    const prepared = unifySurfaceIdentity(options.reason || "mount");
    state.mounted = prepared.length > 0;

    refreshSources(options.reason || "mount");
    drawFrame(options.reason || "mount");
    sendHexGatePacket("mount");
    releaseToPrefaceLaunch("mount");

    if (!state.surfaceWorthy) startSourceHoldRescan("mount-preface-hold");
    else stopSourceHoldRescan("mount-surface-worthy");

    updateDataset();
    publishGlobals("mount");

    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_BOOTING_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_V12_7";

    record("HEARTH_CANVAS_HUB_BOOT_START", {
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT
    });

    publishGlobals("boot-early");
    mount({ reason: options.reason || "boot" });

    state.booted = true;
    state.booting = false;

    record("HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_BOOTED", {
      canvasElementFound: state.canvasElementFound,
      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      visualPassClaimed: false
    });

    updateDataset();
    publishGlobals("boot-complete");

    return getReceipt();
  }

  function start(options = {}) {
    boot({ reason: options.reason || "start" });
    startLoop(options.reason || "start");
    return getReceipt();
  }

  function refresh(reason = "refresh") {
    readControlAuthority();
    readHexSurfaceAuthority();
    unifySurfaceIdentity(reason);
    refreshSources(reason);
    drawFrame(reason);
    sendHexGatePacket(reason);
    releaseToPrefaceLaunch(reason);

    if (!state.surfaceWorthy) startSourceHoldRescan("refresh-preface-hold");
    else stopSourceHoldRescan("refresh-surface-worthy");

    updateDataset();
    publishGlobals(reason);

    return getReceipt();
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

    if (!state.activeTextureBuilt) refreshSources(options.reason || "renderFrame-source-refresh");

    return drawFrame(options.reason || "renderFrame");
  }

  function requestFrame(packet, options = {}) {
    return renderFrame(packet, {
      ...options,
      reason: "requestFrame"
    });
  }

  function rebuildSourceTexture(reason = "rebuild-source-texture") {
    refreshSources(reason);
    drawFrame(reason);
    sendHexGatePacket(reason);
    releaseToPrefaceLaunch(reason);
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
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasPrimaryCanvasId", state.canvasId);

    setDataset("hearthCanvasPrefaceHandshakeAuthorityActive", "true");
    setDataset("hearthCanvasPrefaceLaunchFile", PREFACE_LAUNCH_FILE);
    setDataset("hearthCanvasPrefaceLaunchObserved", String(state.prefaceLaunchObserved));
    setDataset("hearthCanvasPrefaceLaunchSource", state.prefaceLaunchSource);
    setDataset("hearthCanvasPrefaceHandshakeCount", String(state.prefaceHandshakeCount));
    setDataset("hearthCanvasPrefaceDecommissionAuthorized", String(state.prefaceDecommissionAuthorized));
    setDataset("hearthCanvasPrefaceHoldRequired", String(state.prefaceHoldRequired));
    setDataset("hearthCanvasInitialPrefaceMustRemain", String(state.initialPrefaceMustRemain));
    setDataset("hearthCanvasInitialPrefaceState", state.initialPrefaceState);
    setDataset("hearthCanvasPrefaceDecommissionReason", state.prefaceDecommissionReason);

    setDataset("hearthCanvasSurfaceWorthinessAuthorityActive", "true");
    setDataset("hearthCanvasSurfaceWorthinessStatus", state.surfaceWorthinessStatus);
    setDataset("hearthCanvasSurfaceWorthinessScore", String(state.surfaceWorthinessScore));
    setDataset("hearthCanvasSurfaceWorthy", String(state.surfaceWorthy));
    setDataset("hearthCanvasSurfaceWorthinessFirstFailedCoordinate", state.surfaceWorthinessFirstFailedCoordinate);
    setDataset("hearthCanvasSurfaceWorthinessReason", state.surfaceWorthinessReason);

    setDataset("hearthCanvasSourceHold", String(state.sourceHold));
    setDataset("hearthCanvasSourceHoldClass", state.sourceHoldClass);
    setDataset("hearthCanvasSourceHoldReason", state.sourceHoldReason);
    setDataset("hearthCanvasSourceHoldInitialCarrierDrawn", String(state.sourceHoldInitialCarrierDrawn));
    setDataset("hearthCanvasSourceHoldInitialCarrierVisible", String(state.sourceHoldInitialCarrierVisible));
    setDataset("hearthCanvasInitialCarrierDoesNotCountAsVisiblePlanet", "true");
    setDataset("hearthCanvasSourceHoldRescanActive", String(state.sourceHoldRescanActive));
    setDataset("hearthCanvasSourceHoldRescanCount", String(state.sourceHoldRescanCount));

    setDataset("hearthCanvasActiveSourceClass", state.activeSourceClass);
    setDataset("hearthCanvasActiveSourceRole", state.activeSourceRole);
    setDataset("hearthCanvasActiveSourceNames", state.activeSourceNames.join(","));
    setDataset("hearthCanvasSourceAuthorityObservedCount", String(state.sourceAuthorityObservedCount));
    setDataset("hearthCanvasSourceAuthorityNames", state.sourceAuthorityNames.join(","));
    setDataset("hearthCanvasSourceSampleCapableCount", String(state.sourceSampleCapableCount));
    setDataset("hearthCanvasSourceSampleCapableNames", state.sourceSampleCapableNames.join(","));
    setDataset("hearthCanvasSourceAdapterStatus", state.sourceAdapterStatus);
    setDataset("hearthCanvasSourceProbeSuccessRatio", String(state.sourceProbeSuccessRatio));
    setDataset("hearthCanvasSourceProbeRequiredRatio", String(SOURCE_WORTHY_RATIO));
    setDataset("hearthCanvasActiveTextureBuilt", String(state.activeTextureBuilt));
    setDataset("hearthCanvasActiveTextureStatus", state.activeTextureStatus);
    setDataset("hearthCanvasTextureBuiltFromGovernedSource", String(state.textureBuiltFromGovernedSource));
    setDataset("hearthCanvasTexturePixelVariancePresent", String(state.texturePixelVariancePresent));
    setDataset("hearthCanvasTextureUniqueColorCount", String(state.textureUniqueColorCount));

    setDataset("hearthCanvasSurfaceIdentityUnified", String(state.surfaceIdentityUnified));
    setDataset("hearthCanvasVisibleCanvasAttributeApplied", String(state.visibleCanvasAttributeApplied));
    setDataset("hearthCanvasExpressionSurfaceAttributeApplied", String(state.expressionSurfaceAttributeApplied));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasElementCount", String(state.canvasElementCount));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));

    setDataset("hearthCanvasPixelSampleStatus", state.pixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasVisiblePixelCount", String(state.visiblePixelCount));
    setDataset("hearthCanvasAlphaPixelCount", String(state.alphaPixelCount));
    setDataset("hearthCanvasUniqueColorCount", String(state.uniqueColorCount));
    setDataset("hearthCanvasPixelVariancePresent", String(state.pixelVariancePresent));
    setDataset("hearthCanvasPixelSampleReason", state.pixelSampleReason);

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofSuppressedReason", state.visiblePlanetProofSuppressedReason);

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
    setDataset("hearthCanvasOwnsPrefaceDecommissionDom", "false");

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
      PREFACE_HANDSHAKE_AUTHORITY_ACTIVE: "true",
      PREFACE_LAUNCH_FILE: PREFACE_LAUNCH_FILE,
      PREFACE_LAUNCH_OBSERVED: String(state.prefaceLaunchObserved),
      PREFACE_DECOMMISSION_AUTHORIZED: String(state.prefaceDecommissionAuthorized),
      PREFACE_HOLD_REQUIRED: String(state.prefaceHoldRequired),
      INITIAL_PREFACE_MUST_REMAIN: String(state.initialPrefaceMustRemain),
      INITIAL_PREFACE_STATE: state.initialPrefaceState,
      PREFACE_DECOMMISSION_REASON: state.prefaceDecommissionReason,

      SURFACE_WORTHINESS_AUTHORITY_ACTIVE: "true",
      SURFACE_WORTHINESS_STATUS: state.surfaceWorthinessStatus,
      SURFACE_WORTHINESS_SCORE: String(state.surfaceWorthinessScore),
      SURFACE_WORTHY: String(state.surfaceWorthy),
      SURFACE_WORTHINESS_FIRST_FAILED_COORDINATE: state.surfaceWorthinessFirstFailedCoordinate,
      SURFACE_WORTHINESS_REASON: state.surfaceWorthinessReason,

      CANVAS_ELEMENT_FOUND: String(state.canvasElementFound),
      CANVAS_ELEMENT_COUNT: String(state.canvasElementCount),
      CANVAS_SELECTOR: state.canvasSelector,
      CANVAS_ID: state.canvasId,
      CANVAS_CONTEXT_2D_READY: String(state.canvasContext2dReady),
      CANVAS_RECT_NONZERO: String(state.canvasRectNonzero),
      CANVAS_COMPUTED_VISIBLE: String(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: String(state.canvasViewportIntersecting),
      CANVAS_WIDTH: String(state.canvasWidth),
      CANVAS_HEIGHT: String(state.canvasHeight),

      CANVAS_PIXEL_SAMPLE_STATUS: state.pixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: String(state.canvasPixelVisible),
      CANVAS_VISIBLE_PIXEL_COUNT: String(state.visiblePixelCount),
      CANVAS_ALPHA_PIXEL_COUNT: String(state.alphaPixelCount),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(state.uniqueColorCount),
      PIXEL_VARIANCE_PRESENT: String(state.pixelVariancePresent),
      CANVAS_PIXEL_SAMPLE_REASON: state.pixelSampleReason,

      SOURCE_HOLD: String(state.sourceHold),
      SOURCE_HOLD_CLASS: state.sourceHoldClass,
      SOURCE_HOLD_REASON: state.sourceHoldReason,
      SOURCE_HOLD_INITIAL_CARRIER_DRAWN: String(state.sourceHoldInitialCarrierDrawn),
      SOURCE_HOLD_INITIAL_CARRIER_VISIBLE: String(state.sourceHoldInitialCarrierVisible),
      INITIAL_CARRIER_DOES_NOT_COUNT_AS_VISIBLE_PLANET: "true",

      ACTIVE_SOURCE_CLASS: state.activeSourceClass,
      ACTIVE_SOURCE_ROLE: state.activeSourceRole,
      ACTIVE_SOURCE_NAMES: state.activeSourceNames.join(","),
      SOURCE_AUTHORITY_OBSERVED_COUNT: String(state.sourceAuthorityObservedCount),
      SOURCE_AUTHORITY_NAMES: state.sourceAuthorityNames.join(","),
      SOURCE_SAMPLE_CAPABLE_COUNT: String(state.sourceSampleCapableCount),
      SOURCE_SAMPLE_CAPABLE_NAMES: state.sourceSampleCapableNames.join(","),
      SOURCE_ADAPTER_STATUS: state.sourceAdapterStatus,
      SOURCE_PROBE_SUCCESS_RATIO: String(state.sourceProbeSuccessRatio),
      SOURCE_PROBE_REQUIRED_RATIO: String(SOURCE_WORTHY_RATIO),
      TEXTURE_BUILT_FROM_GOVERNED_SOURCE: String(state.textureBuiltFromGovernedSource),
      TEXTURE_PIXEL_VARIANCE_PRESENT: String(state.texturePixelVariancePresent),
      TEXTURE_UNIQUE_COLOR_COUNT: String(state.textureUniqueColorCount),

      VISIBLE_PLANET_PROOF_READY: String(state.visiblePlanetProofReady),
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      VISIBLE_PLANET_PROOF_SUPPRESSED_REASON: state.visiblePlanetProofSuppressedReason,

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECEIVER_METHOD: state.hexSurfaceReceiverMethod,
      HEX_SURFACE_DELIVERY_STATUS: state.hexSurfaceDeliveryStatus,

      CONTROL_OBSERVED: String(state.controlObserved),
      CONTROL_SOURCE: state.controlSource,
      CONTROL_CONTRACT: state.controlContract,

      FRAME_COUNT: String(state.frameCount),
      DRAW_COUNT: String(state.drawCount),
      RECEIVE_PACKET_COUNT: String(state.receivePacketCount),
      ACCEPTED_PACKET_COUNT: String(state.acceptedPacketCount),
      REJECTED_PACKET_COUNT: String(state.rejectedPacketCount),
      CONTROL_PACKET_COUNT: String(state.controlPacketCount),
      VIEW_PACKET_COUNT: String(state.viewPacketCount),

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
      CANVAS_OWNS_PREFACE_DECOMMISSION_DOM: "false",
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

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) {
      readControlAuthority();
      readHexSurfaceAuthority();
      inspectCanvasGeometry(collectCanvasCandidates()[0] || null);
      evaluateSurfaceWorthiness("receipt-refresh");
    }

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_PACKET",
      canvasReceiptPacketType: "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_RECEIPT_PACKET_v12_7",
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
      prefaceLaunchFile: PREFACE_LAUNCH_FILE,

      expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      role: "canvas-receiver-output-carrier-preface-handshake-surface-worthiness-authority",

      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      canvasHubActive: true,
      canvasReceiverActive: true,
      canvasOutputCarrierActive: true,
      prefaceHandshakeAuthorityActive: true,
      surfaceWorthinessAuthorityActive: true,
      canvasSurfaceTruthProbeCompatible: true,

      prefaceLaunchObserved: state.prefaceLaunchObserved,
      prefaceLaunchSource: state.prefaceLaunchSource,
      prefaceLaunchContract: state.prefaceLaunchContract,
      prefaceLaunchReceipt: state.prefaceLaunchReceipt,
      prefaceHandshakeCount: state.prefaceHandshakeCount,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
      initialPrefaceMustRemain: state.initialPrefaceMustRemain,
      initialPrefaceState: state.initialPrefaceState,
      prefaceDecommissionReason: state.prefaceDecommissionReason,
      lastPrefaceHandshakeStatus: state.lastPrefaceHandshakeStatus,

      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessScoreMinimum: SURFACE_WORTHY_SCORE_MINIMUM,
      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      surfaceWorthinessReason: state.surfaceWorthinessReason,

      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasCreatedByCanvasHub: state.canvasCreatedByCanvasHub,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
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
      pixelVisible: state.canvasPixelVisible,
      canvasPixelVisible: state.canvasPixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelVariancePresent: state.pixelVariancePresent,
      pixelSampleReason: state.pixelSampleReason,

      sourceHold: state.sourceHold,
      sourceHoldClass: state.sourceHoldClass,
      sourceHoldReason: state.sourceHoldReason,
      sourceHoldInitialCarrierDrawn: state.sourceHoldInitialCarrierDrawn,
      sourceHoldInitialCarrierVisible: state.sourceHoldInitialCarrierVisible,
      sourceHoldInitialCarrierDrawCount: state.sourceHoldInitialCarrierDrawCount,
      initialCarrierDoesNotCountAsVisiblePlanet: true,
      sourceHoldRescanActive: state.sourceHoldRescanActive,
      sourceHoldRescanCount: state.sourceHoldRescanCount,

      sourceAuthorityObservedCount: state.sourceAuthorityObservedCount,
      sourceAuthorityNames: clonePlain(state.sourceAuthorityNames),
      sourceSampleCapableCount: state.sourceSampleCapableCount,
      sourceSampleCapableNames: clonePlain(state.sourceSampleCapableNames),
      sourceAdapterStatus: state.sourceAdapterStatus,
      sourceProbeTotal: state.sourceProbeTotal,
      sourceProbeSuccessCount: state.sourceProbeSuccessCount,
      sourceProbeMissCount: state.sourceProbeMissCount,
      sourceProbeErrorCount: state.sourceProbeErrorCount,
      sourceProbeSuccessRatio: state.sourceProbeSuccessRatio,
      sourceProbeRequiredRatio: SOURCE_WORTHY_RATIO,
      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),
      activeTextureBuilt: state.activeTextureBuilt,
      activeTextureStatus: state.activeTextureStatus,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      textureUniqueColorCount: state.textureUniqueColorCount,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofSuppressedReason: state.visiblePlanetProofSuppressedReason,

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

      viewState: clonePlain(state.viewState),
      surfaces: clonePlain(state.surfaces),

      receivePacketCount: state.receivePacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      controlPacketCount: state.controlPacketCount,
      viewPacketCount: state.viewPacketCount,
      renderPacketCount: state.renderPacketCount,
      drawCount: state.drawCount,
      frameCount: state.frameCount,
      resizeCount: state.resizeCount,
      hexGatePacketCount: state.hexGatePacketCount,
      hexGateDeliveryCount: state.hexGateDeliveryCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

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
      ownsPrefaceHoldDom: false,
      ownsPrefaceDecommissionDom: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      lastMountedAt: state.lastMountedAt,
      lastDrawAt: state.lastDrawAt,
      textureMeta: clonePlain(textureMeta),
      prefaceHandshakePacket: composePrefaceHandshakePacket("getReceipt"),
      surfaceWorthinessPacket: getCanvasSurfaceWorthinessPacket("getReceipt"),
      prefaceDecommissionPacket: getPrefaceDecommissionPacket("getReceipt"),
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields(),
      textureMeta: clonePlain(textureMeta),
      ...NO_CLAIMS
    };
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_RECEIPT",
      "",
      "HEADER",
      line("contract", PUBLIC_CONTRACT),
      line("receipt", PUBLIC_RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "SURFACE",
      line("canvasElementFound", r.canvasElementFound),
      line("canvasElementCount", r.canvasElementCount),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      "",
      "WORTHINESS",
      line("surfaceWorthinessAuthorityActive", true),
      line("surfaceWorthinessStatus", r.surfaceWorthinessStatus),
      line("surfaceWorthinessScore", r.surfaceWorthinessScore),
      line("surfaceWorthinessScoreMinimum", r.surfaceWorthinessScoreMinimum),
      line("surfaceWorthy", r.surfaceWorthy),
      line("surfaceWorthinessFirstFailedCoordinate", r.surfaceWorthinessFirstFailedCoordinate),
      line("surfaceWorthinessReason", r.surfaceWorthinessReason),
      "",
      "PREFACE_HANDSHAKE",
      line("prefaceHandshakeAuthorityActive", true),
      line("prefaceLaunchFile", PREFACE_LAUNCH_FILE),
      line("prefaceLaunchObserved", r.prefaceLaunchObserved),
      line("prefaceDecommissionAuthorized", r.prefaceDecommissionAuthorized),
      line("prefaceHoldRequired", r.prefaceHoldRequired),
      line("initialPrefaceMustRemain", r.initialPrefaceMustRemain),
      line("initialPrefaceState", r.initialPrefaceState),
      line("prefaceDecommissionReason", r.prefaceDecommissionReason),
      line("lastPrefaceHandshakeStatus", r.lastPrefaceHandshakeStatus),
      "",
      "SOURCE",
      line("sourceHold", r.sourceHold),
      line("sourceHoldClass", r.sourceHoldClass),
      line("sourceHoldReason", r.sourceHoldReason),
      line("sourceAuthorityObservedCount", r.sourceAuthorityObservedCount),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("sourceProbeSuccessRatio", r.sourceProbeSuccessRatio),
      line("textureBuiltFromGovernedSource", r.textureBuiltFromGovernedSource),
      line("texturePixelVariancePresent", r.texturePixelVariancePresent),
      "",
      "PIXELS",
      line("pixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("visiblePixelCount", r.visiblePixelCount),
      line("uniqueColorCount", r.uniqueColorCount),
      line("pixelVariancePresent", r.pixelVariancePresent),
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

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("surfaceWorthy", r.surfaceWorthy),
      line("surfaceWorthinessStatus", r.surfaceWorthinessStatus),
      line("prefaceDecommissionAuthorized", r.prefaceDecommissionAuthorized),
      line("prefaceHoldRequired", r.prefaceHoldRequired),
      line("initialPrefaceMustRemain", r.initialPrefaceMustRemain),
      line("sourceHold", r.sourceHold),
      line("sourceSampleCapableCount", r.sourceSampleCapableCount),
      line("sourceProbeSuccessRatio", r.sourceProbeSuccessRatio),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
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
    root.HEARTH_CANVAS_HUB_PREFACE_HANDSHAKE_SURFACE_WORTHINESS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubPrefaceHandshakeSurfaceWorthinessAuthorityReceipt = receipt;
    hearth.canvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasHubPrefaceHandshakeSurfaceWorthinessAuthorityReceipt = receipt;
    lab.hearthCanvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    publishRenderGlobals("receipt-publication");
    publishPrefaceHandshakeGlobals(composePrefaceHandshakePacket("receipt-publication"));

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
      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
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
    prefaceLaunchFile: PREFACE_LAUNCH_FILE,

    expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

    prefaceHandshakePacket: PREFACE_HANDSHAKE_PACKET,
    surfaceWorthinessPacket: SURFACE_WORTHINESS_PACKET,
    prefaceDecommissionPacket: PREFACE_DECOMMISSION_PACKET,
    canvasHexGatePacket: CANVAS_HEX_GATE_PACKET,
    canvasRenderPacket: CANVAS_RENDER_PACKET,

    boot,
    start,
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
    receivePrefaceLaunchPacket,

    drawInteractiveFrame,
    drawPairFrame,
    renderFrame,
    requestFrame,
    drawFrame,

    unifySurfaceIdentity,
    collectCanvasCandidates,
    collectSourceAuthorities,
    discoverGovernedSourceAdapters,
    refreshSources,
    rebuildSourceTexture,
    buildGovernedTexture,
    sampleGovernedSource,

    getCanvasSurfaceWorthinessPacket,
    getPrefaceDecommissionPacket,
    composePrefaceHandshakePacket,
    releaseToPrefaceLaunch,
    composeRenderPacket,
    composeCanvasHexGatePacket,
    sendHexGatePacket,
    readControlAuthority,
    readHexSurfaceAuthority,
    evaluateSurfaceWorthiness,

    getReceipt,
    getReceiptLight,
    getCanvasStationReceipt: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getCanvasParentReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getSummary: getReceiptLight,
    getState,
    getReceiptText,
    getStatusText,
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
    supportsSourceHoldInitialCarrier: true,
    supportsPrefaceHandshake: true,
    supportsSurfaceWorthinessPacket: true,
    supportsPrefaceDecommissionPacket: true,

    canvasHubActive: true,
    canvasReceiverActive: true,
    canvasOutputCarrierActive: true,
    prefaceHandshakeAuthorityActive: true,
    surfaceWorthinessAuthorityActive: true,

    ownsCanvasDrawing: true,
    ownsCanvasCreationInsideExistingMount: true,
    ownsSurfaceWorthinessDecision: true,
    ownsPrefaceHoldDom: false,
    ownsPrefaceDecommissionDom: false,
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
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document" });
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_HUB_V12_7_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
