// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIVER_TNT_v12_7
// Full-file replacement.
// Canvas Hub / authority-side preface-launch handshake receiver only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route, diagnostics, controls, Hex Surface, and receipts.
// - Preserve Canvas as receiver/output carrier only.
// - Create or bind one real visible 2D canvas surface inside the existing Hearth mount.
// - Draw the candidate Hearth globe from governed source truth when available.
// - Draw only an under-preface candidate carrier when governed source truth is absent or below threshold.
// - Publish the authority-side handshake for the downstream launch/preface file.
// - Keep the preface/initial state active until a candidate canvas surface is worthy enough to replace it.
// - Authorize preface decommission only when the candidate surface is present, drawn, pixel-visible, varied, and source-thresholded.
// - Never treat the initial/preface carrier as final planet proof.
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

  const INTERNAL_CONTRACT =
    "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIVER_TNT_v12_7";
  const INTERNAL_RECEIPT =
    "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIVER_RECEIPT_v12_7";

  const PREVIOUS_INTERNAL_CONTRACT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_6";
  const PREVIOUS_INTERNAL_RECEIPT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_v12_6";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const EXPECTED_LAUNCH_CONTRACT =
    "HEARTH_CANVAS_PREFACE_LAUNCH_BRIDGE_TNT_v1";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const HANDSHAKE_PACKET =
    "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_PACKET_v12_7";
  const CANDIDATE_PACKET =
    "HEARTH_CANVAS_AUTHORITY_SIDE_CANDIDATE_SURFACE_PACKET_v12_7";
  const RECEIPT_PACKET =
    "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_RECEIPT_PACKET_v12_7";

  const TEXTURE_W = 384;
  const TEXTURE_H = 192;
  const SOURCE_PROBE_W = 32;
  const SOURCE_PROBE_H = 16;
  const SOURCE_THRESHOLD_RATIO = 0.55;
  const FRAME_MIN_MS = 48;
  const RESCAN_MS = 1200;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21SubmittedToNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvas: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    downstreamReleaseClaimed: false,
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
    "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIVER",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasAuthoritySidePrefaceLaunchHandshakeReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasAuthoritySidePrefaceLaunchHandshakeReceiver"
  ]);

  const LAUNCH_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_PREFACE_LAUNCH_BRIDGE",
    "HEARTH_CANVAS_LAUNCH_BRIDGE",
    "HEARTH_CANVAS_INITIAL_PREFACE_LAUNCH_BRIDGE",
    "HEARTH.canvasPrefaceLaunchBridge",
    "HEARTH.canvasLaunchBridge",
    "HEARTH.canvasInitialPrefaceLaunchBridge",
    "DEXTER_LAB.hearthCanvasPrefaceLaunchBridge",
    "DEXTER_LAB.hearthCanvasLaunchBridge",
    "DEXTER_LAB.hearthCanvasInitialPrefaceLaunchBridge"
  ]);

  const SOURCE_GROUPS = Object.freeze([
    {
      key: "composition",
      role: "composition",
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
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority"
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

  const EXPORT_METHODS = Object.freeze([
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
    internalContract: INTERNAL_CONTRACT,
    internalReceipt: INTERNAL_RECEIPT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    previousInternalReceipt: PREVIOUS_INTERNAL_RECEIPT,
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
    canvasInMount: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasCssWidth: 0,
    canvasCssHeight: 0,
    devicePixelRatio: 1,

    authoritySideHandshakeActive: true,
    expectedLaunchFile: EXPECTED_LAUNCH_FILE,
    expectedLaunchContract: EXPECTED_LAUNCH_CONTRACT,
    launchBridgeObserved: false,
    launchBridgeSourcePath: "NONE",
    launchBridgeContract: "UNKNOWN",
    launchBridgeReceipt: "UNKNOWN",
    launchBridgeReceiverMethod: "NONE",
    launchHandshakeDeliveryStatus: "WAITING_LAUNCH_BRIDGE",
    launchHandshakeDeliveryCount: 0,

    initialPrefaceRequired: true,
    prefaceHoldRequired: true,
    prefaceHoldStatus: "PREFACE_HELD_WAITING_CANVAS_BOOT",
    prefaceHoldReason: "WAITING_CANVAS_BOOT",
    prefaceDecommissionAuthorized: false,
    prefaceDecommissionReason: "CANDIDATE_NOT_EVALUATED",
    fallbackLanguageSuppressed: true,

    candidateSurfaceCreated: false,
    candidateSurfaceDrawAttempted: false,
    candidateSurfaceDrawn: false,
    candidateSurfacePixelVisible: false,
    candidateSurfacePixelVariancePresent: false,
    candidateSurfaceUniqueColorCount: 0,
    candidateSurfaceVisiblePixelCount: 0,
    candidateSurfaceAlphaPixelCount: 0,
    candidateSurfaceWorthinessStatus: "NOT_EVALUATED",
    candidateSurfaceWorthyForLaunch: false,
    candidateSurfaceFailureCoordinate: "WAITING_CANVAS_BOOT",
    candidateSurfaceSource: "NONE",
    candidateSurfaceReason: "WAITING_CANVAS_BOOT",

    governedSourceAuthorityObservedCount: 0,
    governedSourceAuthorityNames: [],
    governedSourceSampleCapableCount: 0,
    governedSourceSampleCapableNames: [],
    governedSourceAdapterStatus: "NOT_SCANNED",
    governedSourceThresholdStatus: "NOT_EVALUATED",
    governedSourceThresholdPassed: false,
    governedSourceThresholdRatioRequired: SOURCE_THRESHOLD_RATIO,
    governedSourceThresholdSampleTotal: 0,
    governedSourceThresholdSuccessCount: 0,
    governedSourceThresholdMissCount: 0,
    governedSourceThresholdErrorCount: 0,
    governedSourceThresholdSuccessRatio: 0,
    governedSourceThresholdFirstFailedCoordinate: "WAITING_CANVAS_BOOT",

    textureBuilt: false,
    textureBuiltFromGovernedSource: false,
    textureStatus: "NOT_BUILT",
    textureUniqueColorCount: 0,
    texturePixelVariancePresent: false,
    activeSourceClass: "NOT_SCANNED",
    activeSourceRole: "NONE",
    activeSourceNames: [],

    drawLoopActive: false,
    rescanActive: false,
    rescanCount: 0,
    rafId: 0,
    rescanTimer: 0,
    frameCount: 0,
    drawCount: 0,
    receivePacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    controlPacketCount: 0,
    viewPacketCount: 0,
    receiptPublishCount: 0,
    aliasPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    viewState: {
      yaw: 0.44,
      pitch: -0.08,
      zoom: 1,
      phase: 0
    },

    controlObserved: false,
    controlSourcePath: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

    hexSurfaceObserved: false,
    hexSurfaceSourcePath: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceReceiverMethod: "NONE",
    hexGateDeliveryStatus: "WAITING_HEX_SURFACE",
    hexGateDeliveryCount: 0,

    pixelSampleStatus: "NOT_SAMPLED",
    pixelSampleReason: "NOT_SAMPLED",

    currentCanvasParentRecognized: true,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE_PREFACE_HELD",
    renderedPlanetProofReady: false,
    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,

    lastPacketType: "NONE",
    lastPacketSource: "NONE",
    lastRejectedReason: "",
    lastDrawReason: "NOT_DRAWN",
    lastDrawAt: "",
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIVER_LOADED",

    firstFailedCoordinate: "WAITING_CANVAS_BOOT",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_HUB_AND_PUBLISH_AUTHORITY_SIDE_HANDSHAKE",
    postgameStatus: "CANVAS_AUTHORITY_SIDE_LOADED_WAITING_BOOT",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};
  let canvasRef = null;
  let ctxRef = null;
  let texture = null;
  let sourceAdapters = [];
  let lastFrameTime = 0;
  let publishGuard = false;
  let drawGuard = false;

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

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 160);
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
    trim(state.errors, 100);
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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function q(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;

    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector, base = doc) {
    if (!base || !isFunction(base.querySelectorAll)) return [];

    try {
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getSummary",
      "getState",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getControlReceipt",
      "getHexSurfaceReceipt",
      "getHexReceipt",
      "getLauncherReceipt",
      "getLaunchReceipt",
      "getPrefaceLaunchReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method](false);
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(value) {
    if (!value) return "";

    return firstNonEmpty(
      value.contract,
      value.CONTRACT,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.sourceContract,
      value.internalContract,
      value.internalImplementationContract
    );
  }

  function receiptOf(value) {
    if (!value) return "";

    return firstNonEmpty(
      value.receipt,
      value.RECEIPT,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.sourceReceipt,
      value.internalReceipt,
      value.internalImplementationReceipt
    );
  }

  function getMount() {
    if (!doc) return null;

    return (
      q("#hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-visible-planet-mount='true']") ||
      q("[data-hearth-planet-engine-mount='true']") ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage='true']")
    );
  }

  function getStage() {
    if (!doc) return null;

    return (
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage='true']") ||
      q("[data-hearth-planet-engine-stage='true']") ||
      getMount()
    );
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

  function collectCanvasCandidates() {
    const mount = getMount();
    const candidates = [];

    if (mount) candidates.push(...qa("canvas", mount));

    candidates.push(...qa("canvas[data-hearth-expression-surface='true']"));
    candidates.push(...qa("canvas[data-hearth-visible-canvas='true']"));
    candidates.push(...qa("canvas[data-hearth-canvas-hub='true']"));
    candidates.push(...qa("canvas[data-hearth-canvas='true']"));
    candidates.push(...qa("canvas[data-hearth-planet-canvas='true']"));
    candidates.push(...qa("#hearthVisibleExpressionCanvas"));
    candidates.push(...qa("#hearthCanvas"));

    return uniqueNodes(candidates).filter(isCanvas);
  }

  function createCanvas() {
    const mount = getMount();
    if (!doc || !mount || !isFunction(doc.createElement)) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = "hearthVisibleExpressionCanvas";
    canvas.setAttribute("aria-label", "Hearth candidate canvas surface");
    canvas.setAttribute("data-hearth-expression-surface", "true");
    canvas.setAttribute("data-hearth-visible-canvas", "true");
    canvas.setAttribute("data-hearth-canvas-hub", "true");

    mount.appendChild(canvas);

    state.canvasCreatedByCanvasHub = true;
    state.candidateSurfaceCreated = true;

    record("HEARTH_CANVAS_AUTHORITY_CREATED_REAL_CANVAS_IN_EXISTING_MOUNT", {
      mountSelector: "#hearthCanvasMount",
      canvasId: canvas.id,
      htmlContractMutated: false
    });

    return canvas;
  }

  function markCanvas(canvas, index = 0) {
    if (!canvas) return;

    if (!canvas.id) {
      canvas.id = index === 0
        ? "hearthVisibleExpressionCanvas"
        : `hearthVisibleExpressionCanvas${index + 1}`;
    }

    try {
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-contract", PUBLIC_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-receipt", PUBLIC_RECEIPT);
      canvas.setAttribute("data-hearth-canvas-internal-contract", INTERNAL_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-internal-receipt", INTERNAL_RECEIPT);
      canvas.setAttribute("data-hearth-canvas-authority-side-handshake", "true");
      canvas.setAttribute("data-hearth-canvas-preface-hold-required", String(state.prefaceHoldRequired));
      canvas.setAttribute("data-hearth-canvas-preface-decommission-authorized", String(state.prefaceDecommissionAuthorized));
      canvas.setAttribute("data-hearth-canvas-candidate-worthy-for-launch", String(state.candidateSurfaceWorthyForLaunch));
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Hearth live candidate canvas surface");
    } catch (_error) {}

    if (canvas.dataset) {
      canvas.dataset.hearthExpressionSurface = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasHub = "true";
      canvas.dataset.hearthPlanetCanvas = "true";
      canvas.dataset.hearthCanvasContract = PUBLIC_CONTRACT;
      canvas.dataset.hearthCanvasReceipt = PUBLIC_RECEIPT;
      canvas.dataset.hearthCanvasInternalContract = INTERNAL_CONTRACT;
      canvas.dataset.hearthCanvasInternalReceipt = INTERNAL_RECEIPT;
      canvas.dataset.hearthCanvasAuthoritySideHandshake = "true";
      canvas.dataset.hearthCanvasPrefaceHoldRequired = String(state.prefaceHoldRequired);
      canvas.dataset.hearthCanvasPrefaceDecommissionAuthorized = String(state.prefaceDecommissionAuthorized);
      canvas.dataset.hearthCanvasCandidateWorthyForLaunch = String(state.candidateSurfaceWorthyForLaunch);
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
    }
  }

  function measureCssSize(canvas) {
    const mount = getMount();
    const stage = getStage();
    const viewportW = root.innerWidth || 720;
    const viewportH = root.innerHeight || 720;
    let canvasRect = null;
    let mountRect = null;
    let stageRect = null;

    try {
      canvasRect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      mountRect = mount && isFunction(mount.getBoundingClientRect) ? mount.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      stageRect = stage && isFunction(stage.getBoundingClientRect) ? stage.getBoundingClientRect() : null;
    } catch (_error) {}

    const canvasSize = canvasRect ? Math.min(canvasRect.width || 0, canvasRect.height || 0) : 0;
    const mountSize = mountRect ? Math.min(mountRect.width || 0, mountRect.height || 0) : 0;
    const stageSize = stageRect ? Math.min(stageRect.width || 0, stageRect.height || 0) : 0;
    const viewportSize = Math.min(viewportW, viewportH);

    const selected =
      canvasSize > 80 ? canvasSize :
      mountSize > 80 ? mountSize :
      stageSize > 80 ? stageSize :
      Math.max(280, Math.min(760, viewportSize * 0.78));

    return clamp(selected, 240, Math.min(920, Math.max(280, viewportSize * 0.92)));
  }

  function prepareCanvas(canvas, index = 0) {
    if (!canvas || !isCanvas(canvas)) return null;

    markCanvas(canvas, index);

    const cssSize = measureCssSize(canvas);
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const pixelSize = Math.max(256, Math.min(960, Math.round(cssSize * dpr)));

    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
    }

    if (canvas.style) {
      try {
        canvas.style.setProperty("display", "block", "important");
        canvas.style.setProperty("box-sizing", "border-box", "important");
        canvas.style.setProperty("width", `${Math.round(cssSize)}px`, "important");
        canvas.style.setProperty("height", `${Math.round(cssSize)}px`, "important");
        canvas.style.setProperty("min-width", "240px", "important");
        canvas.style.setProperty("min-height", "240px", "important");
        canvas.style.setProperty("max-width", "100%", "important");
        canvas.style.setProperty("max-height", "calc(100svh - 128px)", "important");
        canvas.style.setProperty("aspect-ratio", "1 / 1", "important");
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

    let ctx = null;

    try {
      ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_error) {
      try {
        ctx = canvas.getContext("2d");
      } catch (error) {
        recordError("HEARTH_CANVAS_CONTEXT_2D_FAILED", error, {
          canvasId: canvas.id || "NONE"
        });
      }
    }

    return {
      canvas,
      ctx,
      cssSize,
      width: pixelSize,
      height: pixelSize,
      dpr,
      selector: "canvas[data-hearth-expression-surface='true']"
    };
  }

  function inspectGeometry(canvas) {
    if (!canvas) {
      state.canvasRectNonzero = false;
      state.canvasComputedVisible = false;
      state.canvasViewportIntersecting = false;
      return;
    }

    let rect = null;
    let computed = null;

    try {
      rect = isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      computed = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
    } catch (_error) {}

    const width = rect ? Number(rect.width || 0) : 0;
    const height = rect ? Number(rect.height || 0) : 0;
    const rectNonzero = width > 0 && height > 0;

    state.canvasRectNonzero = rectNonzero;
    state.canvasComputedVisible =
      rectNonzero &&
      (!computed ||
        (
          computed.display !== "none" &&
          computed.visibility !== "hidden" &&
          Number(computed.opacity || 1) !== 0
        ));

    state.canvasViewportIntersecting =
      rectNonzero &&
      rect.left < (root.innerWidth || 0) &&
      rect.right > 0 &&
      rect.top < (root.innerHeight || 0) &&
      rect.bottom > 0;
  }

  function bindCanvas(reason = "bind-canvas") {
    let canvases = collectCanvasCandidates();

    if (!canvases.length) {
      const created = createCanvas();
      if (created) canvases = [created];
    }

    const prepared = canvases
      .map((canvas, index) => prepareCanvas(canvas, index))
      .filter((entry) => entry && entry.canvas && entry.ctx);

    const primary = prepared[0] || null;
    canvasRef = primary ? primary.canvas : null;
    ctxRef = primary ? primary.ctx : null;

    state.canvasElementFound = Boolean(primary);
    state.canvasElementCount = prepared.length;
    state.canvasSelector = primary ? primary.selector : "NONE";
    state.canvasId = primary ? primary.canvas.id || "NONE" : "NONE";
    state.canvasContext2dReady = Boolean(primary && primary.ctx);
    state.canvasWidth = primary ? primary.width : 0;
    state.canvasHeight = primary ? primary.height : 0;
    state.canvasCssWidth = primary ? primary.cssSize : 0;
    state.canvasCssHeight = primary ? primary.cssSize : 0;
    state.devicePixelRatio = primary ? primary.dpr : 1;

    const mount = getMount();
    state.canvasInMount = Boolean(primary && mount && mount.contains(primary.canvas));

    inspectGeometry(canvasRef);

    state.mounted = Boolean(
      state.canvasElementFound &&
      state.canvasContext2dReady &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible
    );

    record("HEARTH_CANVAS_AUTHORITY_BOUND_REAL_DOM_CANVAS", {
      reason,
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      mounted: state.mounted
    });

    return primary;
  }

  function uToLon(u) {
    return (u - 0.5) * Math.PI * 2;
  }

  function vToLat(v) {
    return (0.5 - v) * Math.PI;
  }

  function lonLatToUv(lon, lat) {
    const uRaw = lon / (Math.PI * 2) + 0.5;
    const u = ((uRaw % 1) + 1) % 1;
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    return { u, v };
  }

  function inferArrayWidth(data) {
    const len = data && data.length ? data.length : 256;
    const rootLen = Math.sqrt(len);

    if (Math.abs(rootLen - Math.round(rootLen)) < 0.001) return Math.round(rootLen);
    if (len % 512 === 0) return 512;
    if (len % 384 === 0) return 384;
    if (len % 256 === 0) return 256;
    if (len % 128 === 0) return 128;
    if (len % 64 === 0) return 64;

    return Math.max(16, Math.round(rootLen));
  }

  function findArrayLike(source) {
    if (Array.isArray(source) || ArrayBuffer.isView(source)) {
      return {
        key: "self",
        data: source,
        width: inferArrayWidth(source),
        height: Math.ceil(source.length / inferArrayWidth(source))
      };
    }

    if (!isObject(source)) return null;

    for (const key of ARRAY_KEYS) {
      const value = source[key];

      if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return {
          key,
          data: value,
          width: safeNumber(source.width || source.mapWidth || source.columns || source.cols, inferArrayWidth(value)),
          height: safeNumber(source.height || source.mapHeight || source.rows, Math.ceil(value.length / inferArrayWidth(value)))
        };
      }

      if (isObject(value)) {
        for (const nestedKey of ARRAY_KEYS) {
          const nested = value[nestedKey];

          if (Array.isArray(nested) || ArrayBuffer.isView(nested)) {
            return {
              key: `${key}.${nestedKey}`,
              data: nested,
              width: safeNumber(value.width || value.mapWidth || value.columns || value.cols || source.width, inferArrayWidth(nested)),
              height: safeNumber(value.height || value.mapHeight || value.rows || source.height, Math.ceil(nested.length / inferArrayWidth(nested)))
            };
          }
        }
      }
    }

    return null;
  }

  function makeArrayAdapter(group, source, candidate, origin) {
    const found = findArrayLike(candidate);
    if (!found || !found.data || !found.data.length) return null;

    const width = Math.max(1, Math.floor(found.width || inferArrayWidth(found.data)));
    const height = Math.max(1, Math.floor(found.height || Math.ceil(found.data.length / width)));

    return {
      key: group.key,
      role: group.role,
      sourceName: source.path,
      contract: source.contract,
      receipt: source.receipt,
      kind: "array",
      origin: `${origin}:${found.key}`,
      sample(_lon, _lat, u, v) {
        const x = clamp(Math.floor(u * width), 0, width - 1);
        const y = clamp(Math.floor(v * height), 0, height - 1);
        const index = y * width + x;
        return found.data[index] !== undefined ? found.data[index] : null;
      }
    };
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
          state.governedSourceThresholdErrorCount += 1;
          if (state.governedSourceThresholdErrorCount < 8) {
            recordError("HEARTH_CANVAS_SOURCE_SAMPLE_METHOD_FAILED", error, { method });
          }
          return null;
        }
      }
    }
  }

  function makeMethodAdapter(group, source) {
    const authority = source.authority;

    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const method of SAMPLE_METHODS) {
      if (!isFunction(authority[method])) continue;

      return {
        key: group.key,
        role: group.role,
        sourceName: source.path,
        contract: source.contract,
        receipt: source.receipt,
        kind: "method",
        method,
        sample(lon, lat, u, v) {
          return callSampleMethod(authority, method, lon, lat, u, v);
        }
      };
    }

    return null;
  }

  function makeExportAdapter(group, source) {
    const authority = source.authority;

    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const method of EXPORT_METHODS) {
      if (!isFunction(authority[method])) continue;

      try {
        const exported = authority[method]();
        const adapter = makeArrayAdapter(group, source, exported, method);
        if (adapter) return adapter;
      } catch (_error) {}
    }

    return null;
  }

  function makeAdapter(group, source) {
    const direct = makeArrayAdapter(group, source, source.authority, "authority");
    if (direct) return direct;

    const exported = makeExportAdapter(group, source);
    if (exported) return exported;

    const method = makeMethodAdapter(group, source);
    if (method) return method;

    return null;
  }

  function normalize01(value, fallback = 0) {
    if (value === undefined || value === null || value === "") return fallback;
    const n = safeNumber(value, fallback);
    if (n > 1) return clamp(n / 255, 0, 1);
    return clamp(n, 0, 1);
  }

  function normalizeSigned(value, fallback = 0) {
    if (value === undefined || value === null || value === "") return fallback;
    const n = safeNumber(value, fallback);
    if (n > 1 || n < -1) return clamp(n / 255, -1, 1);
    return clamp(n, -1, 1);
  }

  function stringLooksWater(value) {
    return /water|ocean|sea|lake|river|bay|basin|hydro|reef|shelf|channel|submerged|wet/i.test(safeString(value));
  }

  function stringLooksLand(value) {
    return /land|terrain|soil|rock|mountain|ridge|crust|plate|desert|forest|plain|summit|dry|continent|island/i.test(safeString(value));
  }

  function valueMeansTrue(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0.5;

    const text = safeString(value).toLowerCase();
    if (!text) return false;
    if (["true", "yes", "land", "water", "ocean", "sea", "dry", "solid"].includes(text)) return true;
    if (["false", "no", "none", "void"].includes(text)) return false;

    return stringLooksWater(text) || stringLooksLand(text);
  }

  function readRgba(raw) {
    if (!isObject(raw)) return null;

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

  function normalizeSample(raw, adapter) {
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
      if (raw.length >= 4 && Number.isFinite(Number(raw[0])) && Number.isFinite(Number(raw[1])) && Number.isFinite(Number(raw[2]))) {
        return {
          meaningful: true,
          sourceKey: adapter.key,
          sourceRole: adapter.role,
          rgba: [
            clamp(Math.round(Number(raw[0])), 0, 255),
            clamp(Math.round(Number(raw[1])), 0, 255),
            clamp(Math.round(Number(raw[2])), 0, 255),
            clamp(Math.round(Number(raw[3] === undefined ? 255 : raw[3])), 0, 255)
          ],
          elevation: 0,
          water: false,
          land: true,
          material: "rgba-source",
          className: "rgba-source"
        };
      }

      if (raw.length) return normalizeSample(raw[0], adapter);
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
        ? valueMeansTrue(waterValue)
        : className
          ? stringLooksWater(className)
          : undefined;

    const land =
      landValue !== undefined
        ? valueMeansTrue(landValue)
        : className
          ? stringLooksLand(className)
          : undefined;

    const normalized = {
      meaningful: Boolean(className || material || elevation !== undefined || water !== undefined || land !== undefined || rgba),
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

  function sampleAdapter(adapter, lon, lat) {
    const uv = lonLatToUv(lon, lat);

    try {
      const raw = adapter.sample(lon, lat, uv.u, uv.v);
      return normalizeSample(raw, adapter);
    } catch (error) {
      state.governedSourceThresholdErrorCount += 1;
      if (state.governedSourceThresholdErrorCount < 8) {
        recordError("HEARTH_CANVAS_SOURCE_SAMPLE_FAILED", error, {
          sourceName: adapter.sourceName,
          role: adapter.role
        });
      }
      return null;
    }
  }

  function weightForRole(role) {
    const text = safeString(role);
    if (/hydrology|water|ocean/.test(text)) return 3;
    if (/land-channel|terrain|composition/.test(text)) return 2.5;
    if (/elevation|materials/.test(text)) return 2;
    return 1;
  }

  function mergeSamples(samples, lon, lat) {
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

  function sampleGovernedSource(lon, lat) {
    if (!sourceAdapters.length) return null;

    const samples = [];

    for (const adapter of sourceAdapters) {
      const sample = sampleAdapter(adapter, lon, lat);
      if (sample && sample.meaningful) samples.push(sample);
    }

    if (!samples.length) return null;

    return mergeSamples(samples, lon, lat);
  }

  function probeAdapter(adapter) {
    const points = [
      [0.12, 0.22],
      [0.28, 0.38],
      [0.44, 0.54],
      [0.58, 0.46],
      [0.72, 0.68],
      [0.86, 0.32]
    ];

    for (const point of points) {
      const lon = uToLon(point[0]);
      const lat = vToLat(point[1]);
      const sample = sampleAdapter(adapter, lon, lat);
      if (sample && sample.meaningful) return true;
    }

    return false;
  }

  function discoverSourceAdapters(reason = "discover") {
    const observed = [];
    const adapters = [];

    for (const group of SOURCE_GROUPS) {
      const found = firstGlobal(group.aliases);
      if (!found.value) continue;

      const receipt = readReceipt(found.value) || {};
      const source = {
        group,
        path: found.path,
        authority: found.value,
        contract: contractOf(receipt) || contractOf(found.value) || "UNKNOWN",
        receipt: receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN"
      };

      observed.push(source);

      const adapter = makeAdapter(group, source);
      if (!adapter) continue;

      if (probeAdapter(adapter)) adapters.push(adapter);
    }

    sourceAdapters = adapters;

    state.governedSourceAuthorityObservedCount = observed.length;
    state.governedSourceAuthorityNames = observed.map((item) => item.path);
    state.governedSourceSampleCapableCount = adapters.length;
    state.governedSourceSampleCapableNames = adapters.map((item) => `${item.key}:${item.sourceName}`);

    state.governedSourceAdapterStatus = adapters.length
      ? "SAMPLE_COMPATIBLE_GOVERNED_SOURCE_ADAPTERS_READY"
      : observed.length
        ? "SOURCE_AUTHORITIES_OBSERVED_BUT_NOT_SAMPLE_COMPATIBLE"
        : "NO_GOVERNED_SOURCE_AUTHORITIES_OBSERVED";

    state.activeSourceClass = adapters.length
      ? "GOVERNED_SOURCE_STACK_SAMPLE_ADAPTER"
      : observed.length
        ? "SOURCE_STACK_OBSERVED_NOT_SAMPLE_COMPATIBLE"
        : "NO_GOVERNED_SOURCE_OBSERVED";

    state.activeSourceRole = adapters.length
      ? adapters.map((item) => item.role).join("+")
      : "NONE";

    state.activeSourceNames = adapters.map((item) => item.sourceName);

    record("HEARTH_CANVAS_GOVERNED_SOURCE_ADAPTER_DISCOVERY_COMPLETE", {
      reason,
      observedCount: observed.length,
      sampleCapableCount: adapters.length,
      activeSourceClass: state.activeSourceClass
    });

    return adapters;
  }

  function runSourceThreshold(reason = "threshold") {
    if (!sourceAdapters.length) {
      state.governedSourceThresholdStatus = "HELD_NO_SAMPLE_COMPATIBLE_GOVERNED_SOURCE";
      state.governedSourceThresholdPassed = false;
      state.governedSourceThresholdSampleTotal = SOURCE_PROBE_W * SOURCE_PROBE_H;
      state.governedSourceThresholdSuccessCount = 0;
      state.governedSourceThresholdMissCount = state.governedSourceThresholdSampleTotal;
      state.governedSourceThresholdSuccessRatio = 0;
      state.governedSourceThresholdFirstFailedCoordinate = "GOVERNED_SOURCE_SAMPLE_CAPABLE_COUNT";
      return false;
    }

    let total = 0;
    let success = 0;
    let miss = 0;

    for (let y = 0; y < SOURCE_PROBE_H; y += 1) {
      const v = (y + 0.5) / SOURCE_PROBE_H;

      for (let x = 0; x < SOURCE_PROBE_W; x += 1) {
        const u = (x + 0.5) / SOURCE_PROBE_W;
        const lon = uToLon(u);
        const lat = vToLat(v);

        total += 1;

        if (sampleGovernedSource(lon, lat)) success += 1;
        else miss += 1;
      }
    }

    const ratio = total ? success / total : 0;
    const passed = ratio >= SOURCE_THRESHOLD_RATIO;

    state.governedSourceThresholdSampleTotal = total;
    state.governedSourceThresholdSuccessCount = success;
    state.governedSourceThresholdMissCount = miss;
    state.governedSourceThresholdSuccessRatio = ratio;
    state.governedSourceThresholdPassed = passed;
    state.governedSourceThresholdStatus = passed
      ? "GOVERNED_SOURCE_THRESHOLD_PASSED"
      : "HELD_GOVERNED_SOURCE_THRESHOLD_NOT_MET";
    state.governedSourceThresholdFirstFailedCoordinate = passed
      ? "NONE"
      : "GOVERNED_SOURCE_THRESHOLD_SUCCESS_RATIO";

    record("HEARTH_CANVAS_GOVERNED_SOURCE_THRESHOLD_EVALUATED", {
      reason,
      total,
      success,
      miss,
      ratio,
      required: SOURCE_THRESHOLD_RATIO,
      passed
    });

    return passed;
  }

  function fineNoise(lon, lat) {
    const v =
      Math.sin(lon * 17.13 + lat * 11.71) * 0.45 +
      Math.sin(lon * 41.9 - lat * 19.3) * 0.28 +
      Math.sin(lon * 83.1 + lat * 61.7) * 0.14;

    return clamp(v, -1, 1);
  }

  function colorFromSample(sample, lon, lat) {
    if (sample.rgba) return sample.rgba;

    const e = clamp(sample.elevation || 0, -1, 1);
    const moisture = clamp(sample.moisture || 0, 0, 1);
    const grain = fineNoise(lon, lat);
    const material = safeString(sample.material || sample.className).toLowerCase();

    if (sample.water) {
      const depth = clamp(-e * 0.72 + 0.38 + grain * 0.05, 0, 1);

      return [
        Math.round(7 + 24 * depth),
        Math.round(38 + 82 * depth),
        Math.round(92 + 130 * depth),
        255
      ];
    }

    if (/ice|snow|polar|glacier/.test(material) || Math.abs(lat) > 1.28) {
      const shade = clamp(0.74 + e * 0.16 + grain * 0.05, 0, 1);

      return [
        Math.round(176 + 56 * shade),
        Math.round(202 + 36 * shade),
        Math.round(212 + 32 * shade),
        255
      ];
    }

    if (/mount|ridge|summit|rock|crag|plate/.test(material) || e > 0.43) {
      const shade = clamp(0.44 + e * 0.42 + grain * 0.08, 0, 1);

      return [
        Math.round(76 + 94 * shade),
        Math.round(70 + 84 * shade),
        Math.round(60 + 72 * shade),
        255
      ];
    }

    if (/desert|sand|dune|arid/.test(material) || moisture < 0.16) {
      const shade = clamp(0.52 + e * 0.23 + grain * 0.09, 0, 1);

      return [
        Math.round(108 + 108 * shade),
        Math.round(88 + 82 * shade),
        Math.round(46 + 60 * shade),
        255
      ];
    }

    const shade = clamp(0.36 + e * 0.28 + moisture * 0.18 + grain * 0.1, 0, 1);

    return [
      Math.round(38 + 88 * shade),
      Math.round(72 + 94 * shade),
      Math.round(46 + 62 * shade),
      255
    ];
  }

  function neutralCandidateColor(lon, lat) {
    const band = 0.5 + 0.5 * Math.sin(lat * 4 + lon * 1.7);

    return [
      Math.round(8 + 10 * band),
      Math.round(22 + 20 * band),
      Math.round(48 + 34 * band),
      255
    ];
  }

  function buildTexture(reason = "build-texture") {
    texture = new Uint8ClampedArray(TEXTURE_W * TEXTURE_H * 4);

    if (!state.governedSourceThresholdPassed || !sourceAdapters.length) {
      texture = null;
      state.textureBuilt = false;
      state.textureBuiltFromGovernedSource = false;
      state.textureStatus = "TEXTURE_HELD_BY_SOURCE_THRESHOLD";
      state.textureUniqueColorCount = 0;
      state.texturePixelVariancePresent = false;
      return null;
    }

    const unique = new Set();
    let sampled = 0;
    let missed = 0;

    for (let y = 0; y < TEXTURE_H; y += 1) {
      const v = y / (TEXTURE_H - 1);

      for (let x = 0; x < TEXTURE_W; x += 1) {
        const u = x / (TEXTURE_W - 1);
        const lon = uToLon(u);
        const lat = vToLat(v);
        const sample = sampleGovernedSource(lon, lat);
        const color = sample ? colorFromSample(sample, lon, lat) : neutralCandidateColor(lon, lat);
        const index = (y * TEXTURE_W + x) * 4;

        if (sample) sampled += 1;
        else missed += 1;

        texture[index] = color[0];
        texture[index + 1] = color[1];
        texture[index + 2] = color[2];
        texture[index + 3] = color[3];

        if (x % 16 === 0 && y % 16 === 0) {
          unique.add(`${color[0]},${color[1]},${color[2]},${color[3]}`);
        }
      }
    }

    state.textureBuilt = true;
    state.textureBuiltFromGovernedSource = true;
    state.textureStatus = "GOVERNED_SOURCE_TEXTURE_BUILT";
    state.textureUniqueColorCount = unique.size;
    state.texturePixelVariancePresent = unique.size >= 4;

    record("HEARTH_CANVAS_GOVERNED_TEXTURE_BUILT", {
      reason,
      sampled,
      missed,
      uniqueColorCount: unique.size,
      texturePixelVariancePresent: state.texturePixelVariancePresent
    });

    return texture;
  }

  function refreshGovernedSources(reason = "refresh-sources") {
    discoverSourceAdapters(reason);
    runSourceThreshold(reason);
    buildTexture(reason);
    evaluateCandidateWorthiness(reason);
    return state.governedSourceThresholdPassed;
  }

  function textureSample(lon, lat) {
    if (!texture) return neutralCandidateColor(lon, lat);

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

  function resetCtx(ctx) {
    if (!ctx) return;

    try {
      if (isFunction(ctx.resetTransform)) ctx.resetTransform();
      else ctx.setTransform(1, 0, 0, 1, 0, 0);
    } catch (_error) {
      try {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } catch (_ignore) {}
    }
  }

  function drawStarField(ctx, w, h, frame) {
    ctx.save();
    ctx.globalAlpha = 0.38;

    for (let i = 0; i < 64; i += 1) {
      const x = pseudo(i * 17.13) * w;
      const y = pseudo(i * 31.71) * h;
      const flicker = 0.25 + 0.2 * Math.sin((frame + i * 3) * 0.035);
      const r = 0.55 + pseudo(i * 7.91) * 1.25;

      ctx.fillStyle = `rgba(210,238,255,${flicker})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function pseudo(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, radius * 0.022);
    ctx.strokeStyle = "rgba(127,220,255,.23)";
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

  function drawPrefaceHeldCandidate(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0) return false;

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
    ctx.fillText("PREFACE HELD", cx, cy - radius * 0.08);

    ctx.fillStyle = "rgba(232,241,255,.72)";
    ctx.font = `${Math.max(8, Math.round(radius * 0.032))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("candidate surface under test", cx, cy + radius * 0.045);
    ctx.fillText("launch not yet authorized", cx, cy + radius * 0.13);
    ctx.restore();

    state.candidateSurfaceSource = "CANVAS_AUTHORITY_PREFACE_HELD_NATIVE_CARRIER";
    state.candidateSurfaceReason = reason;

    return true;
  }

  function drawGovernedCandidate(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0 || !texture) return false;

    resetCtx(ctx);

    const w = width;
    const h = height;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const view = state.viewState;
    const radius = min * 0.43 * clamp(view.zoom, 0.72, 1.12);

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
    drawAtmosphere(ctx, cx, cy, radius);

    state.candidateSurfaceSource = "GOVERNED_SOURCE_CANVAS_AUTHORITY_CANDIDATE";
    state.candidateSurfaceReason = reason;
    state.viewState.phase += 0.004;

    return true;
  }

  function inspectPixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.pixelSampleStatus = "NO_PIXEL_SAMPLE";
      state.pixelSampleReason = "CANVAS_OR_CONTEXT_UNAVAILABLE";
      state.candidateSurfacePixelVisible = false;
      state.candidateSurfacePixelVariancePresent = false;
      state.candidateSurfaceUniqueColorCount = 0;
      state.candidateSurfaceVisiblePixelCount = 0;
      state.candidateSurfaceAlphaPixelCount = 0;
      return false;
    }

    const w = canvas.width;
    const h = canvas.height;
    const points = [
      [0.18, 0.18],
      [0.32, 0.32],
      [0.50, 0.50],
      [0.68, 0.42],
      [0.82, 0.68],
      [0.24, 0.76],
      [0.76, 0.24]
    ];

    let visible = 0;
    let alpha = 0;
    const unique = new Set();

    try {
      for (const point of points) {
        const x = clamp(Math.round(w * point[0]), 0, w - 1);
        const y = clamp(Math.round(h * point[1]), 0, h - 1);
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        const r = pixel[0] || 0;
        const g = pixel[1] || 0;
        const b = pixel[2] || 0;
        const a = pixel[3] || 0;

        if (a > 0) alpha += 1;
        if (a > 0 && (r > 3 || g > 3 || b > 3)) visible += 1;

        unique.add(`${r},${g},${b},${a}`);
      }
    } catch (error) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.pixelSampleReason = error && error.message ? String(error.message) : safeString(error);
      state.candidateSurfacePixelVisible = false;
      state.candidateSurfacePixelVariancePresent = false;
      state.candidateSurfaceUniqueColorCount = unique.size;
      state.candidateSurfaceVisiblePixelCount = visible;
      state.candidateSurfaceAlphaPixelCount = alpha;
      return false;
    }

    state.candidateSurfacePixelVisible = visible > 0;
    state.candidateSurfacePixelVariancePresent = unique.size >= 3;
    state.candidateSurfaceUniqueColorCount = unique.size;
    state.candidateSurfaceVisiblePixelCount = visible;
    state.candidateSurfaceAlphaPixelCount = alpha;
    state.pixelSampleStatus = visible > 0
      ? "PIXEL_SAMPLE_VISIBLE"
      : alpha > 0
        ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
        : "NO_PIXEL_SAMPLE";
    state.pixelSampleReason = visible > 0
      ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
      : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND";

    return state.candidateSurfacePixelVisible;
  }

  function evaluateCandidateWorthiness(reason = "evaluate") {
    const carrierReady = Boolean(
      state.canvasElementFound &&
      state.canvasContext2dReady &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible
    );

    const sourceReady = Boolean(
      state.governedSourceSampleCapableCount >= 1 &&
      state.governedSourceThresholdPassed &&
      state.textureBuiltFromGovernedSource &&
      state.texturePixelVariancePresent
    );

    const drawnReady = Boolean(
      state.candidateSurfaceDrawAttempted &&
      state.candidateSurfaceDrawn &&
      state.candidateSurfacePixelVisible &&
      state.candidateSurfacePixelVariancePresent
    );

    const worthy = Boolean(carrierReady && sourceReady && drawnReady);

    state.candidateSurfaceWorthyForLaunch = worthy;
    state.prefaceDecommissionAuthorized = worthy;
    state.prefaceHoldRequired = !worthy;
    state.visiblePlanetProofReady = worthy;
    state.renderedPlanetProofReady = worthy;
    state.canvasExpressionSurfaceReady = Boolean(state.canvasElementFound && state.canvasContext2dReady);
    state.canvasExpressionRichnessReady = Boolean(state.candidateSurfacePixelVisible && state.candidateSurfacePixelVariancePresent);
    state.domExpressionSurfaceProofReady = Boolean(state.canvasElementFound && state.canvasRectNonzero && state.canvasComputedVisible);

    if (!carrierReady) {
      state.candidateSurfaceWorthinessStatus = "HELD_CARRIER_SURFACE_NOT_READY";
      state.candidateSurfaceFailureCoordinate = !state.canvasElementFound
        ? "CANVAS_ELEMENT_FOUND"
        : !state.canvasContext2dReady
          ? "CANVAS_CONTEXT_2D_READY"
          : !state.canvasRectNonzero
            ? "CANVAS_RECT_NONZERO"
            : "CANVAS_COMPUTED_VISIBLE";
      state.prefaceHoldStatus = "PREFACE_HELD_CARRIER_SURFACE_NOT_READY";
      state.prefaceHoldReason = state.candidateSurfaceFailureCoordinate;
      state.prefaceDecommissionReason = "CARRIER_SURFACE_NOT_READY";
    } else if (!sourceReady) {
      state.candidateSurfaceWorthinessStatus = "HELD_GOVERNED_SOURCE_NOT_WORTHY";
      state.candidateSurfaceFailureCoordinate = state.governedSourceSampleCapableCount < 1
        ? "GOVERNED_SOURCE_SAMPLE_CAPABLE_COUNT"
        : !state.governedSourceThresholdPassed
          ? "GOVERNED_SOURCE_THRESHOLD_PASSED"
          : !state.textureBuiltFromGovernedSource
            ? "TEXTURE_BUILT_FROM_GOVERNED_SOURCE"
            : "TEXTURE_PIXEL_VARIANCE_PRESENT";
      state.prefaceHoldStatus = "PREFACE_HELD_GOVERNED_SOURCE_NOT_WORTHY";
      state.prefaceHoldReason = state.candidateSurfaceFailureCoordinate;
      state.prefaceDecommissionReason = "GOVERNED_SOURCE_THRESHOLD_NOT_MET";
    } else if (!drawnReady) {
      state.candidateSurfaceWorthinessStatus = "HELD_CANDIDATE_DRAW_NOT_PROVEN";
      state.candidateSurfaceFailureCoordinate = !state.candidateSurfaceDrawAttempted
        ? "CANDIDATE_SURFACE_DRAW_ATTEMPTED"
        : !state.candidateSurfaceDrawn
          ? "CANDIDATE_SURFACE_DRAWN"
          : !state.candidateSurfacePixelVisible
            ? "CANDIDATE_SURFACE_PIXEL_VISIBLE"
            : "CANDIDATE_SURFACE_PIXEL_VARIANCE_PRESENT";
      state.prefaceHoldStatus = "PREFACE_HELD_CANDIDATE_DRAW_NOT_PROVEN";
      state.prefaceHoldReason = state.candidateSurfaceFailureCoordinate;
      state.prefaceDecommissionReason = "CANDIDATE_DRAW_NOT_PROVEN";
    } else {
      state.candidateSurfaceWorthinessStatus = "CANDIDATE_WORTHY_FOR_LAUNCH";
      state.candidateSurfaceFailureCoordinate = "NONE";
      state.prefaceHoldStatus = "PREFACE_DECOMMISSION_AUTHORIZED";
      state.prefaceHoldReason = "NONE";
      state.prefaceDecommissionReason = "CANDIDATE_CANVAS_SURFACE_WORTHY";
    }

    state.visiblePlanetProofSource = worthy
      ? "CANVAS_AUTHORITY_SIDE_CANDIDATE_THRESHOLD"
      : "NONE_PREFACE_HELD";

    state.firstFailedCoordinate = worthy ? "NONE" : state.candidateSurfaceFailureCoordinate;
    state.recommendedNextOwner = worthy ? "CANVAS_PREFACE_LAUNCH_BRIDGE" : "CANVAS_HUB";
    state.recommendedNextFile = worthy ? EXPECTED_LAUNCH_FILE : FILE;
    state.recommendedNextAction = worthy
      ? "LAUNCH_BRIDGE_MAY_DECOMMISSION_PREFACE_AND_REVEAL_CANDIDATE"
      : "KEEP_PREFACE_HELD_AND_CONTINUE_CANVAS_SOURCE_RESCAN";
    state.postgameStatus = worthy
      ? "CANVAS_AUTHORITY_CANDIDATE_WORTHY_PREFACE_DECOMMISSION_AUTHORIZED_NO_FINAL_CLAIM"
      : "CANVAS_AUTHORITY_PREFACE_HELD_CANDIDATE_NOT_YET_WORTHY";

    markCanvas(canvasRef);

    record("HEARTH_CANVAS_CANDIDATE_WORTHINESS_EVALUATED", {
      reason,
      carrierReady,
      sourceReady,
      drawnReady,
      worthy,
      failureCoordinate: state.candidateSurfaceFailureCoordinate,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized
    });

    return worthy;
  }

  function drawFrame(reason = "draw-frame") {
    if (drawGuard) return getReceiptLight(false);
    drawGuard = true;

    try {
      const prepared = bindCanvas(reason);

      state.candidateSurfaceDrawAttempted = true;

      if (!prepared || !prepared.ctx) {
        state.candidateSurfaceDrawn = false;
        inspectPixels(null, null);
        evaluateCandidateWorthiness(reason);
        publishAll(reason);
        return getReceiptLight(false);
      }

      const governedReady = Boolean(
        state.governedSourceThresholdPassed &&
        state.textureBuiltFromGovernedSource &&
        texture
      );

      const drawn = governedReady
        ? drawGovernedCandidate(prepared.ctx, prepared.width, prepared.height, reason)
        : drawPrefaceHeldCandidate(prepared.ctx, prepared.width, prepared.height, reason);

      state.candidateSurfaceDrawn = Boolean(drawn);
      state.drawCount += 1;
      state.frameCount += 1;
      state.lastDrawReason = reason;
      state.lastDrawAt = nowIso();

      inspectPixels(prepared.canvas, prepared.ctx);
      evaluateCandidateWorthiness(reason);

      publishRenderGlobals(reason);
      deliverHandshake(reason);
      publishAll(reason);

      return getReceiptLight(false);
    } catch (error) {
      recordError("HEARTH_CANVAS_DRAW_FRAME_FAILED", error, { reason });
      state.candidateSurfaceDrawn = false;
      state.candidateSurfaceWorthinessStatus = "DRAW_ERROR";
      state.candidateSurfaceFailureCoordinate = "DRAW_FRAME_ERROR";
      evaluateCandidateWorthiness("draw-error");
      publishAll("draw-error");
      return getReceiptLight(false);
    } finally {
      drawGuard = false;
    }
  }

  function applyViewPacket(packet = {}, options = {}) {
    const source = isObject(packet.viewState) ? packet.viewState : packet;
    const current = state.viewState;

    const yaw = firstDefined(source.yaw, packet.yaw);
    const pitch = firstDefined(source.pitch, packet.pitch);
    const zoom = firstDefined(source.zoom, packet.zoom);
    const phase = firstDefined(source.phase, packet.phase);

    const deltaYaw = safeNumber(firstDefined(source.deltaYaw, packet.deltaYaw), 0);
    const deltaPitch = safeNumber(firstDefined(source.deltaPitch, packet.deltaPitch), 0);
    const deltaZoom = safeNumber(firstDefined(source.deltaZoom, packet.deltaZoom), 0);

    state.viewState = {
      yaw: yaw !== undefined ? safeNumber(yaw, current.yaw) : current.yaw + deltaYaw,
      pitch: clamp(pitch !== undefined ? safeNumber(pitch, current.pitch) : current.pitch + deltaPitch, -1.25, 1.25),
      zoom: clamp(zoom !== undefined ? safeNumber(zoom, current.zoom) : current.zoom + deltaZoom, 0.55, 2.4),
      phase: phase !== undefined ? safeNumber(phase, current.phase) : current.phase
    };

    state.lastPacketType = safeString(packet.packetType || packet.type || options.packetType || "VIEW_PACKET");
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

  function validatePacket(packet) {
    if (packet === undefined || packet === null) return { accepted: true, reason: "EMPTY_PACKET_AS_DRAW_REQUEST" };
    if (!isObject(packet)) return { accepted: false, reason: "PACKET_NOT_OBJECT" };

    if (
      packet.f13Claimed === true ||
      packet.f13CanvasClaimed === true ||
      packet.f13ClaimedByCanvas === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21Claimed === true ||
      packet.f21ClaimedByCanvas === true ||
      packet.f21SubmittedToNorth === true ||
      packet.readyTextAllowed === true ||
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

    return { accepted: true, reason: "PACKET_ACCEPTED" };
  }

  function receivePacket(packet = {}, options = {}) {
    state.receivePacketCount += 1;

    const validation = validatePacket(packet);
    if (!validation.accepted) {
      state.rejectedPacketCount += 1;
      state.lastRejectedReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.postgameStatus = "CANVAS_PACKET_REJECTED";
      publishAll("packet-rejected");
      return getReceiptLight(false);
    }

    state.acceptedPacketCount += 1;
    state.lastRejectedReason = "";

    if (options.controlPacket === true) state.controlPacketCount += 1;
    if (options.viewPacket === true) state.viewPacketCount += 1;

    applyViewPacket(packet, options);
    refreshGovernedSources(options.reason || "receive-packet");
    drawFrame(options.reason || "receive-packet");

    return getReceiptLight(false);
  }

  function receiveCanvasViewPacket(packet = {}, options = {}) {
    return receivePacket(packet, {
      ...options,
      viewPacket: true,
      source: "receiveCanvasViewPacket",
      reason: "receiveCanvasViewPacket"
    });
  }

  function consumeCanvasViewPacket(packet = {}, options = {}) {
    return receiveCanvasViewPacket(packet, {
      ...options,
      source: "consumeCanvasViewPacket"
    });
  }

  function receiveControlPacket(packet = {}, options = {}) {
    return receivePacket(packet, {
      ...options,
      controlPacket: true,
      viewPacket: true,
      source: "receiveControlPacket",
      reason: "receiveControlPacket"
    });
  }

  function receiveViewControlPacket(packet = {}, options = {}) {
    return receiveControlPacket(packet, {
      ...options,
      source: "receiveViewControlPacket"
    });
  }

  function receivePlanetaryViewControlPacket(packet = {}, options = {}) {
    return receiveControlPacket(packet, {
      ...options,
      source: "receivePlanetaryViewControlPacket"
    });
  }

  function renderFrame(packet = {}, options = {}) {
    if (isObject(packet)) applyViewPacket(packet, options);
    return drawFrame(options.reason || "renderFrame");
  }

  function requestFrame(packet = {}, options = {}) {
    return renderFrame(packet, {
      ...options,
      reason: "requestFrame"
    });
  }

  function readControlAuthority() {
    const found = firstGlobal(CONTROL_ALIASES);
    const receipt = readReceipt(found.value) || {};

    state.controlObserved = Boolean(found.value);
    state.controlSourcePath = found.path;
    state.controlContract = contractOf(receipt) || contractOf(found.value) || "UNKNOWN";
    state.controlReceipt = receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN";

    return {
      sourcePath: found.path,
      authority: found.value,
      contract: state.controlContract,
      receipt: state.controlReceipt
    };
  }

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readReceipt(found.value) || {};

    state.hexSurfaceObserved = Boolean(found.value);
    state.hexSurfaceSourcePath = found.path;
    state.hexSurfaceContract = contractOf(receipt) || contractOf(found.value) || "UNKNOWN";
    state.hexSurfaceReceipt = receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN";
    state.hexSurfaceReceiverMethod = resolveReceiverMethod(found.value, [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "receivePlanetaryViewControlPacket"
    ]) || "NONE";

    return {
      sourcePath: found.path,
      authority: found.value,
      contract: state.hexSurfaceContract,
      receipt: state.hexSurfaceReceipt,
      method: state.hexSurfaceReceiverMethod
    };
  }

  function readLaunchBridge() {
    const found = firstGlobal(LAUNCH_ALIAS_PATHS);
    const receipt = readReceipt(found.value) || {};

    state.launchBridgeObserved = Boolean(found.value);
    state.launchBridgeSourcePath = found.path;
    state.launchBridgeContract = contractOf(receipt) || contractOf(found.value) || "UNKNOWN";
    state.launchBridgeReceipt = receiptOf(receipt) || receiptOf(found.value) || "UNKNOWN";
    state.launchBridgeReceiverMethod = resolveReceiverMethod(found.value, [
      "receiveCanvasAuthorityHandshake",
      "receiveCanvasPrefaceHandshake",
      "receiveCanvasLaunchHandshake",
      "receiveCanvasCandidatePacket",
      "receiveCanvasAuthorityPacket",
      "receivePacket"
    ]) || "NONE";

    return {
      sourcePath: found.path,
      authority: found.value,
      contract: state.launchBridgeContract,
      receipt: state.launchBridgeReceipt,
      method: state.launchBridgeReceiverMethod
    };
  }

  function resolveReceiverMethod(authority, methods) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function composeCandidatePacket(reason = "candidate") {
    return {
      packetType: CANDIDATE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalContract: INTERNAL_CONTRACT,
      internalReceipt: INTERNAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      reason,

      canvas: canvasRef || undefined,
      ctx: ctxRef || undefined,

      candidateSurfaceCreated: state.candidateSurfaceCreated,
      candidateSurfaceDrawAttempted: state.candidateSurfaceDrawAttempted,
      candidateSurfaceDrawn: state.candidateSurfaceDrawn,
      candidateSurfacePixelVisible: state.candidateSurfacePixelVisible,
      candidateSurfacePixelVariancePresent: state.candidateSurfacePixelVariancePresent,
      candidateSurfaceUniqueColorCount: state.candidateSurfaceUniqueColorCount,
      candidateSurfaceVisiblePixelCount: state.candidateSurfaceVisiblePixelCount,
      candidateSurfaceWorthinessStatus: state.candidateSurfaceWorthinessStatus,
      candidateSurfaceWorthyForLaunch: state.candidateSurfaceWorthyForLaunch,
      candidateSurfaceFailureCoordinate: state.candidateSurfaceFailureCoordinate,
      candidateSurfaceSource: state.candidateSurfaceSource,
      candidateSurfaceReason: state.candidateSurfaceReason,

      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasInMount: state.canvasInMount,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,

      governedSourceThresholdPassed: state.governedSourceThresholdPassed,
      governedSourceThresholdSuccessRatio: state.governedSourceThresholdSuccessRatio,
      governedSourceSampleCapableCount: state.governedSourceSampleCapableCount,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      texturePixelVariancePresent: state.texturePixelVariancePresent,

      initialPrefaceRequired: state.initialPrefaceRequired,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceHoldStatus: state.prefaceHoldStatus,
      prefaceHoldReason: state.prefaceHoldReason,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceDecommissionReason: state.prefaceDecommissionReason,

      ...NO_CLAIMS,
      composedAt: nowIso()
    };
  }

  function composeHandshakePacket(reason = "handshake") {
    return {
      packetType: HANDSHAKE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalContract: INTERNAL_CONTRACT,
      internalReceipt: INTERNAL_RECEIPT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      previousInternalReceipt: PREVIOUS_INTERNAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "authority-side-preface-launch-handshake",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      targetLaunchFile: EXPECTED_LAUNCH_FILE,
      expectedLaunchContract: EXPECTED_LAUNCH_CONTRACT,
      reason,

      authoritySideHandshakeActive: true,
      canvasAuthorityOwnsCandidateEvaluation: true,
      launchFileOwnsPrefaceHoldAndReveal: true,
      canvasOwnsPrefaceVisual: false,
      canvasOwnsLaunchDecisionExecution: false,

      initialPrefaceRequired: state.initialPrefaceRequired,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceHoldStatus: state.prefaceHoldStatus,
      prefaceHoldReason: state.prefaceHoldReason,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceDecommissionReason: state.prefaceDecommissionReason,
      fallbackLanguageSuppressed: true,

      candidate: composeCandidatePacket(reason),

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,

      launchBridgeObserved: state.launchBridgeObserved,
      launchBridgeSourcePath: state.launchBridgeSourcePath,
      launchBridgeContract: state.launchBridgeContract,
      launchBridgeReceipt: state.launchBridgeReceipt,
      launchBridgeReceiverMethod: state.launchBridgeReceiverMethod,
      launchHandshakeDeliveryStatus: state.launchHandshakeDeliveryStatus,
      launchHandshakeDeliveryCount: state.launchHandshakeDeliveryCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ...NO_CLAIMS,
      composedAt: nowIso()
    };
  }

  function deliverHandshake(reason = "deliver-handshake") {
    const launch = readLaunchBridge();
    const packet = composeHandshakePacket(reason);

    publishHandshakeGlobals(packet);

    if (!launch.authority || !launch.method || !isFunction(launch.authority[launch.method])) {
      state.launchHandshakeDeliveryStatus = "LAUNCH_BRIDGE_PUBLIC_RECEIVER_NOT_AVAILABLE";
      return {
        delivered: false,
        method: "NONE",
        packet
      };
    }

    try {
      const output = launch.authority[launch.method](packet, {
        source: "HEARTH_CANVAS_HUB",
        reason
      });

      state.launchHandshakeDeliveryCount += 1;
      state.launchHandshakeDeliveryStatus = "AUTHORITY_SIDE_HANDSHAKE_DELIVERED_TO_LAUNCH_BRIDGE";

      if (output && isFunction(output.then)) {
        output.catch((error) => {
          recordError("HEARTH_CANVAS_LAUNCH_BRIDGE_ASYNC_HANDSHAKE_FAILED", error, {
            method: launch.method
          });
        });
      }

      record("HEARTH_CANVAS_AUTHORITY_SIDE_HANDSHAKE_DELIVERED", {
        reason,
        method: launch.method,
        launchBridgeSourcePath: launch.sourcePath,
        candidateSurfaceWorthyForLaunch: state.candidateSurfaceWorthyForLaunch,
        prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized
      });

      return {
        delivered: true,
        method: launch.method,
        packet
      };
    } catch (error) {
      state.launchHandshakeDeliveryStatus = "AUTHORITY_SIDE_HANDSHAKE_DELIVERY_ERROR";
      recordError("HEARTH_CANVAS_LAUNCH_BRIDGE_HANDSHAKE_FAILED", error, {
        method: launch.method
      });

      return {
        delivered: false,
        method: launch.method,
        packet
      };
    }
  }

  function sendHexGate(reason = "hex-gate") {
    const hex = readHexSurfaceAuthority();

    const packet = {
      packetType: "HEARTH_CANVAS_AUTHORITY_SIDE_HEX_GATE_PACKET_v12_7",
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalContract: INTERNAL_CONTRACT,
      internalReceipt: INTERNAL_RECEIPT,
      sourceFile: FILE,
      destinationFile: HEX_SURFACE_FILE,
      reason,
      viewState: clonePlain(state.viewState),
      handshake: composeHandshakePacket(reason),
      candidate: composeCandidatePacket(reason),
      ...NO_CLAIMS,
      composedAt: nowIso()
    };

    publishHexGateGlobals(packet);

    if (!hex.authority || !hex.method || !isFunction(hex.authority[hex.method])) {
      state.hexGateDeliveryStatus = "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE";
      return false;
    }

    try {
      hex.authority[hex.method](packet, {
        source: "HEARTH_CANVAS_HUB",
        reason
      });

      state.hexGateDeliveryCount += 1;
      state.hexGateDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERED";
      return true;
    } catch (error) {
      state.hexGateDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERY_ERROR";
      recordError("HEARTH_CANVAS_HEX_GATE_DELIVERY_FAILED", error, {
        method: hex.method
      });
      return false;
    }
  }

  function publishHandshakeGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_PACKET = cloned;
    root.HEARTH_CANVAS_PREFACE_LAUNCH_HANDSHAKE_PACKET = cloned;
    root.HEARTH_CANVAS_CANDIDATE_HANDSHAKE_PACKET = cloned;

    hearth.canvasAuthoritySidePrefaceLaunchHandshakePacket = cloned;
    hearth.canvasPrefaceLaunchHandshakePacket = cloned;
    hearth.canvasCandidateHandshakePacket = cloned;

    lab.hearthCanvasAuthoritySidePrefaceLaunchHandshakePacket = cloned;
    lab.hearthCanvasPrefaceLaunchHandshakePacket = cloned;
    lab.hearthCanvasCandidateHandshakePacket = cloned;

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-authority-handshake", { detail: cloned }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-authority-handshake", { detail: cloned }));
      }
    } catch (_error) {}
  }

  function publishHexGateGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_LAST_HEX_GATE_PACKET = cloned;
    hearth.canvasHexGatePacket = cloned;
    hearth.canvasLastHexGatePacket = cloned;
    lab.hearthCanvasHexGatePacket = cloned;
    lab.hearthCanvasLastHexGatePacket = cloned;
  }

  function publishRenderGlobals(reason = "render") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const candidate = composeCandidatePacket(reason);
    const handshake = composeHandshakePacket(reason);

    const visibleProof = {
      packetType: "HEARTH_CANVAS_AUTHORITY_SIDE_VISIBLE_PROOF_PACKET_v12_7",
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalContract: INTERNAL_CONTRACT,
      internalReceipt: INTERNAL_RECEIPT,
      sourceFile: FILE,
      candidate,
      handshake,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      canvasMounted: state.mounted,
      canvasDrawComplete: state.candidateSurfaceDrawn,
      baseGlobeDrawComplete: state.candidateSurfaceDrawn,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,
      ...NO_CLAIMS,
      composedAt: nowIso()
    };

    root.HEARTH_CANVAS_CANDIDATE_SURFACE_PACKET = clonePlain(candidate);
    root.HEARTH_CANVAS_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);
    root.HEARTH_VISIBLE_PLANET_PROOF = clonePlain(visibleProof);

    hearth.canvasCandidateSurfacePacket = clonePlain(candidate);
    hearth.canvasVisiblePlanetProof = clonePlain(visibleProof);
    hearth.visiblePlanetProof = clonePlain(visibleProof);

    lab.hearthCanvasCandidateSurfacePacket = clonePlain(candidate);
    lab.hearthCanvasVisiblePlanetProof = clonePlain(visibleProof);
    lab.hearthVisiblePlanetProof = clonePlain(visibleProof);

    return visibleProof;
  }

  function composeDiagnosticFields() {
    return {
      CANVAS_FILE: FILE,
      CANVAS_CONTRACT: PUBLIC_CONTRACT,
      CANVAS_RECEIPT: PUBLIC_RECEIPT,
      CURRENT_CANVAS_PARENT_CONTRACT: PUBLIC_CONTRACT,
      CURRENT_CANVAS_PARENT_RECEIPT: PUBLIC_RECEIPT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: "true",
      CANVAS_INTERNAL_CONTRACT: INTERNAL_CONTRACT,
      CANVAS_INTERNAL_RECEIPT: INTERNAL_RECEIPT,
      CANVAS_PREVIOUS_INTERNAL_CONTRACT: PREVIOUS_INTERNAL_CONTRACT,
      CANVAS_VERSION: "2026-06-07.canvas-authority-side-preface-launch-handshake-v12-7",

      AUTHORITY_SIDE_HANDSHAKE_ACTIVE: "true",
      EXPECTED_LAUNCH_FILE: EXPECTED_LAUNCH_FILE,
      EXPECTED_LAUNCH_CONTRACT: EXPECTED_LAUNCH_CONTRACT,
      LAUNCH_BRIDGE_OBSERVED: String(state.launchBridgeObserved),
      LAUNCH_BRIDGE_SOURCE_PATH: state.launchBridgeSourcePath,
      LAUNCH_BRIDGE_CONTRACT: state.launchBridgeContract,
      LAUNCH_BRIDGE_RECEIPT: state.launchBridgeReceipt,
      LAUNCH_BRIDGE_RECEIVER_METHOD: state.launchBridgeReceiverMethod,
      LAUNCH_HANDSHAKE_DELIVERY_STATUS: state.launchHandshakeDeliveryStatus,
      LAUNCH_HANDSHAKE_DELIVERY_COUNT: String(state.launchHandshakeDeliveryCount),

      INITIAL_PREFACE_REQUIRED: String(state.initialPrefaceRequired),
      PREFACE_HOLD_REQUIRED: String(state.prefaceHoldRequired),
      PREFACE_HOLD_STATUS: state.prefaceHoldStatus,
      PREFACE_HOLD_REASON: state.prefaceHoldReason,
      PREFACE_DECOMMISSION_AUTHORIZED: String(state.prefaceDecommissionAuthorized),
      PREFACE_DECOMMISSION_REASON: state.prefaceDecommissionReason,
      FALLBACK_LANGUAGE_SUPPRESSED: "true",

      CANDIDATE_SURFACE_CREATED: String(state.candidateSurfaceCreated),
      CANDIDATE_SURFACE_DRAW_ATTEMPTED: String(state.candidateSurfaceDrawAttempted),
      CANDIDATE_SURFACE_DRAWN: String(state.candidateSurfaceDrawn),
      CANDIDATE_SURFACE_PIXEL_VISIBLE: String(state.candidateSurfacePixelVisible),
      CANDIDATE_SURFACE_PIXEL_VARIANCE_PRESENT: String(state.candidateSurfacePixelVariancePresent),
      CANDIDATE_SURFACE_UNIQUE_COLOR_COUNT: String(state.candidateSurfaceUniqueColorCount),
      CANDIDATE_SURFACE_VISIBLE_PIXEL_COUNT: String(state.candidateSurfaceVisiblePixelCount),
      CANDIDATE_SURFACE_WORTHINESS_STATUS: state.candidateSurfaceWorthinessStatus,
      CANDIDATE_SURFACE_WORTHY_FOR_LAUNCH: String(state.candidateSurfaceWorthyForLaunch),
      CANDIDATE_SURFACE_FAILURE_COORDINATE: state.candidateSurfaceFailureCoordinate,
      CANDIDATE_SURFACE_SOURCE: state.candidateSurfaceSource,
      CANDIDATE_SURFACE_REASON: state.candidateSurfaceReason,

      CANVAS_ELEMENT_FOUND: String(state.canvasElementFound),
      CANVAS_SELECTOR: state.canvasSelector,
      CANVAS_ID: state.canvasId,
      CANVAS_MOUNT_FOUND: String(Boolean(getMount())),
      CANVAS_MOUNT_SELECTOR: state.mountSelector,
      CANVAS_IN_MOUNT: String(state.canvasInMount),
      CANVAS_CONTEXT_2D_READY: String(state.canvasContext2dReady),
      CANVAS_RECT_NONZERO: String(state.canvasRectNonzero),
      CANVAS_COMPUTED_VISIBLE: String(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: String(state.canvasViewportIntersecting),
      CANVAS_WIDTH: String(state.canvasWidth),
      CANVAS_HEIGHT: String(state.canvasHeight),

      CANVAS_PIXEL_SAMPLE_STATUS: state.pixelSampleStatus,
      CANVAS_PIXEL_SAMPLE_REASON: state.pixelSampleReason,
      CANVAS_PIXEL_VISIBLE: String(state.candidateSurfacePixelVisible),
      CANVAS_PIXEL_VARIANCE_STATUS: state.candidateSurfacePixelVariancePresent
        ? "PIXEL_VARIANCE_PRESENT"
        : state.pixelSampleStatus,

      CANVAS_NAMESPACE_PRESENT: "true",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: String(state.canvasElementFound),
      CANVAS_PARENT_CONTRACT_RECOGNIZED: String(state.currentCanvasParentRecognized),

      GOVERNED_SOURCE_AUTHORITY_OBSERVED_COUNT: String(state.governedSourceAuthorityObservedCount),
      GOVERNED_SOURCE_AUTHORITY_NAMES: state.governedSourceAuthorityNames.join(","),
      GOVERNED_SOURCE_SAMPLE_CAPABLE_COUNT: String(state.governedSourceSampleCapableCount),
      GOVERNED_SOURCE_SAMPLE_CAPABLE_NAMES: state.governedSourceSampleCapableNames.join(","),
      GOVERNED_SOURCE_ADAPTER_STATUS: state.governedSourceAdapterStatus,
      GOVERNED_SOURCE_THRESHOLD_STATUS: state.governedSourceThresholdStatus,
      GOVERNED_SOURCE_THRESHOLD_PASSED: String(state.governedSourceThresholdPassed),
      GOVERNED_SOURCE_THRESHOLD_RATIO_REQUIRED: String(state.governedSourceThresholdRatioRequired),
      GOVERNED_SOURCE_THRESHOLD_SUCCESS_RATIO: String(state.governedSourceThresholdSuccessRatio),
      GOVERNED_SOURCE_THRESHOLD_FIRST_FAILED_COORDINATE: state.governedSourceThresholdFirstFailedCoordinate,

      TEXTURE_BUILT: String(state.textureBuilt),
      TEXTURE_BUILT_FROM_GOVERNED_SOURCE: String(state.textureBuiltFromGovernedSource),
      TEXTURE_STATUS: state.textureStatus,
      TEXTURE_PIXEL_VARIANCE_PRESENT: String(state.texturePixelVariancePresent),
      TEXTURE_UNIQUE_COLOR_COUNT: String(state.textureUniqueColorCount),

      VISIBLE_PLANET_PROOF_READY: String(state.visiblePlanetProofReady),
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      RENDERED_PLANET_PROOF_READY: String(state.renderedPlanetProofReady),
      CANVAS_EXPRESSION_SURFACE_READY: String(state.canvasExpressionSurfaceReady),
      CANVAS_EXPRESSION_RICHNESS_READY: String(state.canvasExpressionRichnessReady),
      DOM_EXPRESSION_SURFACE_PROOF_READY: String(state.domExpressionSurfaceProofReady),

      CONTROL_OBSERVED: String(state.controlObserved),
      CONTROL_SOURCE_PATH: state.controlSourcePath,
      CONTROL_CONTRACT: state.controlContract,
      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE_PATH: state.hexSurfaceSourcePath,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECEIVER_METHOD: state.hexSurfaceReceiverMethod,
      HEX_GATE_DELIVERY_STATUS: state.hexGateDeliveryStatus,
      HEX_GATE_DELIVERY_COUNT: String(state.hexGateDeliveryCount),

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_OWNS_PREFACE_VISUAL: "false",
      CANVAS_OWNS_LAUNCH_DECISION_EXECUTION: "false",
      CANVAS_OWNS_TERRAIN_TRUTH: "false",
      CANVAS_OWNS_HYDROLOGY_TRUTH: "false",
      CANVAS_OWNS_ELEVATION_TRUTH: "false",
      CANVAS_OWNS_MATERIAL_TRUTH: "false",
      CANVAS_OWNS_HEX_TRUTH: "false",
      CANVAS_OWNS_CONTROL_TRUTH: "false",

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

  function updateDataset() {
    const fields = composeDiagnosticFields();

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
    setDataset("hearthCanvasInternalContract", INTERNAL_CONTRACT);
    setDataset("hearthCanvasInternalReceipt", INTERNAL_RECEIPT);
    setDataset("hearthCanvasPreviousInternalContract", PREVIOUS_INTERNAL_CONTRACT);
    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRoute", ROUTE);

    setDataset("hearthCanvasAuthoritySideHandshakeActive", "true");
    setDataset("hearthCanvasExpectedLaunchFile", EXPECTED_LAUNCH_FILE);
    setDataset("hearthCanvasExpectedLaunchContract", EXPECTED_LAUNCH_CONTRACT);
    setDataset("hearthCanvasLaunchBridgeObserved", String(state.launchBridgeObserved));
    setDataset("hearthCanvasLaunchBridgeSourcePath", state.launchBridgeSourcePath);
    setDataset("hearthCanvasLaunchHandshakeDeliveryStatus", state.launchHandshakeDeliveryStatus);

    setDataset("hearthCanvasInitialPrefaceRequired", String(state.initialPrefaceRequired));
    setDataset("hearthCanvasPrefaceHoldRequired", String(state.prefaceHoldRequired));
    setDataset("hearthCanvasPrefaceHoldStatus", state.prefaceHoldStatus);
    setDataset("hearthCanvasPrefaceHoldReason", state.prefaceHoldReason);
    setDataset("hearthCanvasPrefaceDecommissionAuthorized", String(state.prefaceDecommissionAuthorized));
    setDataset("hearthCanvasPrefaceDecommissionReason", state.prefaceDecommissionReason);
    setDataset("hearthCanvasFallbackLanguageSuppressed", "true");

    setDataset("hearthCanvasCandidateSurfaceCreated", String(state.candidateSurfaceCreated));
    setDataset("hearthCanvasCandidateSurfaceDrawAttempted", String(state.candidateSurfaceDrawAttempted));
    setDataset("hearthCanvasCandidateSurfaceDrawn", String(state.candidateSurfaceDrawn));
    setDataset("hearthCanvasCandidateSurfacePixelVisible", String(state.candidateSurfacePixelVisible));
    setDataset("hearthCanvasCandidateSurfacePixelVariancePresent", String(state.candidateSurfacePixelVariancePresent));
    setDataset("hearthCanvasCandidateSurfaceWorthyForLaunch", String(state.candidateSurfaceWorthyForLaunch));
    setDataset("hearthCanvasCandidateSurfaceWorthinessStatus", state.candidateSurfaceWorthinessStatus);
    setDataset("hearthCanvasCandidateSurfaceFailureCoordinate", state.candidateSurfaceFailureCoordinate);

    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasPrimaryCanvasId", state.canvasId);
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));

    setDataset("hearthCanvasPixelSampleStatus", state.pixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.candidateSurfacePixelVisible));
    setDataset("hearthCanvasPixelVariancePresent", String(state.candidateSurfacePixelVariancePresent));
    setDataset("hearthCanvasPixelVarianceStatus", fields.CANVAS_PIXEL_VARIANCE_STATUS);

    setDataset("hearthCanvasGovernedSourceThresholdStatus", state.governedSourceThresholdStatus);
    setDataset("hearthCanvasGovernedSourceThresholdPassed", String(state.governedSourceThresholdPassed));
    setDataset("hearthCanvasGovernedSourceThresholdSuccessRatio", String(state.governedSourceThresholdSuccessRatio));
    setDataset("hearthCanvasGovernedSourceSampleCapableCount", String(state.governedSourceSampleCapableCount));

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasExpressionSurfaceReady", String(state.canvasExpressionSurfaceReady));
    setDataset("hearthCanvasExpressionRichnessReady", String(state.canvasExpressionRichnessReady));
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextOwner", state.recommendedNextOwner);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) {
      inspectGeometry(canvasRef);
      readControlAuthority();
      readHexSurfaceAuthority();
      readLaunchBridge();
      evaluateCandidateWorthiness("receipt-refresh");
    }

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: RECEIPT_PACKET,
      contract: PUBLIC_CONTRACT,
      CONTRACT: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      RECEIPT: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalContract: INTERNAL_CONTRACT,
      internalReceipt: INTERNAL_RECEIPT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      previousInternalReceipt: PREVIOUS_INTERNAL_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      loaded: state.loaded,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      authoritySideHandshakeActive: true,
      expectedLaunchFile: EXPECTED_LAUNCH_FILE,
      expectedLaunchContract: EXPECTED_LAUNCH_CONTRACT,
      launchBridgeObserved: state.launchBridgeObserved,
      launchBridgeSourcePath: state.launchBridgeSourcePath,
      launchBridgeContract: state.launchBridgeContract,
      launchBridgeReceipt: state.launchBridgeReceipt,
      launchBridgeReceiverMethod: state.launchBridgeReceiverMethod,
      launchHandshakeDeliveryStatus: state.launchHandshakeDeliveryStatus,
      launchHandshakeDeliveryCount: state.launchHandshakeDeliveryCount,

      initialPrefaceRequired: state.initialPrefaceRequired,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceHoldStatus: state.prefaceHoldStatus,
      prefaceHoldReason: state.prefaceHoldReason,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceDecommissionReason: state.prefaceDecommissionReason,
      fallbackLanguageSuppressed: true,

      candidateSurfaceCreated: state.candidateSurfaceCreated,
      candidateSurfaceDrawAttempted: state.candidateSurfaceDrawAttempted,
      candidateSurfaceDrawn: state.candidateSurfaceDrawn,
      candidateSurfacePixelVisible: state.candidateSurfacePixelVisible,
      candidateSurfacePixelVariancePresent: state.candidateSurfacePixelVariancePresent,
      candidateSurfaceUniqueColorCount: state.candidateSurfaceUniqueColorCount,
      candidateSurfaceVisiblePixelCount: state.candidateSurfaceVisiblePixelCount,
      candidateSurfaceAlphaPixelCount: state.candidateSurfaceAlphaPixelCount,
      candidateSurfaceWorthinessStatus: state.candidateSurfaceWorthinessStatus,
      candidateSurfaceWorthyForLaunch: state.candidateSurfaceWorthyForLaunch,
      candidateSurfaceFailureCoordinate: state.candidateSurfaceFailureCoordinate,
      candidateSurfaceSource: state.candidateSurfaceSource,
      candidateSurfaceReason: state.candidateSurfaceReason,

      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasCreatedByCanvasHub: state.canvasCreatedByCanvasHub,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasInMount: state.canvasInMount,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,
      devicePixelRatio: state.devicePixelRatio,

      governedSourceAuthorityObservedCount: state.governedSourceAuthorityObservedCount,
      governedSourceAuthorityNames: clonePlain(state.governedSourceAuthorityNames),
      governedSourceSampleCapableCount: state.governedSourceSampleCapableCount,
      governedSourceSampleCapableNames: clonePlain(state.governedSourceSampleCapableNames),
      governedSourceAdapterStatus: state.governedSourceAdapterStatus,
      governedSourceThresholdStatus: state.governedSourceThresholdStatus,
      governedSourceThresholdPassed: state.governedSourceThresholdPassed,
      governedSourceThresholdRatioRequired: state.governedSourceThresholdRatioRequired,
      governedSourceThresholdSampleTotal: state.governedSourceThresholdSampleTotal,
      governedSourceThresholdSuccessCount: state.governedSourceThresholdSuccessCount,
      governedSourceThresholdMissCount: state.governedSourceThresholdMissCount,
      governedSourceThresholdErrorCount: state.governedSourceThresholdErrorCount,
      governedSourceThresholdSuccessRatio: state.governedSourceThresholdSuccessRatio,
      governedSourceThresholdFirstFailedCoordinate: state.governedSourceThresholdFirstFailedCoordinate,

      textureBuilt: state.textureBuilt,
      textureBuiltFromGovernedSource: state.textureBuiltFromGovernedSource,
      textureStatus: state.textureStatus,
      textureUniqueColorCount: state.textureUniqueColorCount,
      texturePixelVariancePresent: state.texturePixelVariancePresent,
      activeSourceClass: state.activeSourceClass,
      activeSourceRole: state.activeSourceRole,
      activeSourceNames: clonePlain(state.activeSourceNames),

      pixelSampleStatus: state.pixelSampleStatus,
      pixelSampleReason: state.pixelSampleReason,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      fallbackPixelsDoNotCountAsVisiblePlanet: true,

      drawLoopActive: state.drawLoopActive,
      rescanActive: state.rescanActive,
      rescanCount: state.rescanCount,
      frameCount: state.frameCount,
      drawCount: state.drawCount,
      receivePacketCount: state.receivePacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      controlPacketCount: state.controlPacketCount,
      viewPacketCount: state.viewPacketCount,
      receiptPublishCount: state.receiptPublishCount,
      aliasPublishCount: state.aliasPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

      viewState: clonePlain(state.viewState),

      controlObserved: state.controlObserved,
      controlSourcePath: state.controlSourcePath,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSourcePath: state.hexSurfaceSourcePath,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceReceiverMethod: state.hexSurfaceReceiverMethod,
      hexGateDeliveryStatus: state.hexGateDeliveryStatus,
      hexGateDeliveryCount: state.hexGateDeliveryCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      diagnosticFields,
      ...diagnosticFields,

      ownsCanvasCreationInsideExistingMount: true,
      ownsCanvasCandidateDrawing: true,
      ownsAuthoritySideLaunchHandshake: true,
      ownsCandidateWorthinessEvaluation: true,
      ownsPrefaceVisual: false,
      ownsPrefaceHoldExecution: false,
      ownsLaunchRevealExecution: false,
      ownsHtml: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsControlTruth: false,
      ownsSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
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
      handshake: composeHandshakePacket("receipt"),
      candidate: composeCandidatePacket("receipt"),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      lastDrawAt: state.lastDrawAt,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIPT",
      "",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalContract", r.internalContract),
      line("internalReceipt", r.internalReceipt),
      line("previousInternalContract", r.previousInternalContract),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "CANVAS",
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasInMount", r.canvasInMount),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      "",
      "PREFACE_HANDSHAKE",
      line("expectedLaunchFile", EXPECTED_LAUNCH_FILE),
      line("launchBridgeObserved", r.launchBridgeObserved),
      line("launchBridgeReceiverMethod", r.launchBridgeReceiverMethod),
      line("launchHandshakeDeliveryStatus", r.launchHandshakeDeliveryStatus),
      line("initialPrefaceRequired", r.initialPrefaceRequired),
      line("prefaceHoldRequired", r.prefaceHoldRequired),
      line("prefaceHoldStatus", r.prefaceHoldStatus),
      line("prefaceHoldReason", r.prefaceHoldReason),
      line("prefaceDecommissionAuthorized", r.prefaceDecommissionAuthorized),
      line("prefaceDecommissionReason", r.prefaceDecommissionReason),
      "",
      "CANDIDATE",
      line("candidateSurfaceDrawAttempted", r.candidateSurfaceDrawAttempted),
      line("candidateSurfaceDrawn", r.candidateSurfaceDrawn),
      line("candidateSurfacePixelVisible", r.candidateSurfacePixelVisible),
      line("candidateSurfacePixelVariancePresent", r.candidateSurfacePixelVariancePresent),
      line("candidateSurfaceWorthinessStatus", r.candidateSurfaceWorthinessStatus),
      line("candidateSurfaceWorthyForLaunch", r.candidateSurfaceWorthyForLaunch),
      line("candidateSurfaceFailureCoordinate", r.candidateSurfaceFailureCoordinate),
      line("candidateSurfaceSource", r.candidateSurfaceSource),
      "",
      "GOVERNED_SOURCE",
      line("governedSourceAuthorityObservedCount", r.governedSourceAuthorityObservedCount),
      line("governedSourceSampleCapableCount", r.governedSourceSampleCapableCount),
      line("governedSourceThresholdStatus", r.governedSourceThresholdStatus),
      line("governedSourceThresholdPassed", r.governedSourceThresholdPassed),
      line("governedSourceThresholdSuccessRatio", r.governedSourceThresholdSuccessRatio),
      line("textureBuiltFromGovernedSource", r.textureBuiltFromGovernedSource),
      line("texturePixelVariancePresent", r.texturePixelVariancePresent),
      "",
      "PROOF_WITHOUT_FINAL_CLAIM",
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("renderedPlanetProofReady", r.renderedPlanetProofReady),
      line("canvasExpressionSurfaceReady", r.canvasExpressionSurfaceReady),
      line("canvasExpressionRichnessReady", r.canvasExpressionRichnessReady),
      line("domExpressionSurfaceProofReady", r.domExpressionSurfaceProofReady),
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

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();

    return true;
  }

  function publishReceipts() {
    if (publishGuard) return true;
    publishGuard = true;

    try {
      const hearth = ensureObject(root, "HEARTH");
      const lab = ensureObject(root, "DEXTER_LAB");
      const receipt = getReceiptLight(false);
      const full = getReceipt();

      state.receiptPublishCount += 1;

      root.HEARTH_CANVAS_RECEIPT = receipt;
      root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
      root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
      root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
      root.HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_RECEIPT = full;
      root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

      hearth.canvasReceipt = receipt;
      hearth.canvasHubReceipt = receipt;
      hearth.canvasParentReceipt = receipt;
      hearth.canvasVisiblePlanetReceipt = receipt;
      hearth.canvasAuthoritySidePrefaceLaunchHandshakeReceipt = full;
      hearth.canvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

      lab.hearthCanvasReceipt = receipt;
      lab.hearthCanvasHubReceipt = receipt;
      lab.hearthCanvasParentReceipt = receipt;
      lab.hearthCanvasVisiblePlanetReceipt = receipt;
      lab.hearthCanvasAuthoritySidePrefaceLaunchHandshakeReceipt = full;
      lab.hearthCanvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

      return true;
    } finally {
      publishGuard = false;
    }
  }

  function publishAll(reason = "publish") {
    publishAliases();
    updateDataset();
    publishRenderGlobals(reason);
    publishReceipts();
    return true;
  }

  function startLoop(reason = "start-loop") {
    if (state.drawLoopActive || state.disposed) return getReceiptLight(false);

    state.drawLoopActive = true;
    state.started = true;
    state.startedAt = state.startedAt || nowIso();

    record("HEARTH_CANVAS_AUTHORITY_DRAW_LOOP_STARTED", { reason });

    tick();

    return getReceiptLight(false);
  }

  function stopLoop(reason = "stop-loop") {
    state.drawLoopActive = false;

    if (state.rafId) {
      try {
        if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(state.rafId);
        else root.clearTimeout(state.rafId);
      } catch (_error) {}
    }

    state.rafId = 0;

    record("HEARTH_CANVAS_AUTHORITY_DRAW_LOOP_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function tick(time) {
    if (!state.drawLoopActive || state.disposed) return;

    const now = safeNumber(time, Date.now());

    if (!lastFrameTime || now - lastFrameTime > FRAME_MIN_MS) {
      lastFrameTime = now;

      if (state.governedSourceThresholdPassed && texture) {
        drawFrame("raf-governed-candidate");
      }
    }

    const schedule = isFunction(root.requestAnimationFrame)
      ? root.requestAnimationFrame.bind(root)
      : (fn) => root.setTimeout(fn, FRAME_MIN_MS);

    state.rafId = schedule(tick);
  }

  function startRescan(reason = "start-rescan") {
    if (state.rescanTimer || state.disposed) return getReceiptLight(false);

    state.rescanActive = true;

    record("HEARTH_CANVAS_AUTHORITY_SOURCE_RESCAN_STARTED", { reason });

    state.rescanTimer = root.setInterval(() => {
      if (state.disposed) {
        stopRescan("disposed");
        return;
      }

      state.rescanCount += 1;

      refreshGovernedSources(`rescan-${state.rescanCount}`);
      drawFrame(`rescan-${state.rescanCount}`);

      if (state.candidateSurfaceWorthyForLaunch) {
        startLoop("candidate-worthy");
      }
    }, RESCAN_MS);

    return getReceiptLight(false);
  }

  function stopRescan(reason = "stop-rescan") {
    if (state.rescanTimer) {
      root.clearInterval(state.rescanTimer);
      state.rescanTimer = 0;
    }

    state.rescanActive = false;

    record("HEARTH_CANVAS_AUTHORITY_SOURCE_RESCAN_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_AUTHORITY_SIDE_BOOTING";

    try {
      publishAliases();
      bindCanvas(options.reason || "boot");
      readControlAuthority();
      readHexSurfaceAuthority();
      readLaunchBridge();
      refreshGovernedSources(options.reason || "boot");
      drawFrame(options.reason || "boot");
      deliverHandshake(options.reason || "boot");
      sendHexGate(options.reason || "boot");

      state.booted = true;
      state.started = true;
      state.postgameStatus = state.candidateSurfaceWorthyForLaunch
        ? "CANVAS_AUTHORITY_CANDIDATE_WORTHY_PREFACE_DECOMMISSION_AUTHORIZED_NO_FINAL_CLAIM"
        : "CANVAS_AUTHORITY_PREFACE_HELD_CANDIDATE_NOT_YET_WORTHY";

      if (state.candidateSurfaceWorthyForLaunch) {
        startLoop("boot-candidate-worthy");
      } else {
        startRescan("boot-preface-held");
      }

      publishAll("boot-complete");

      record("HEARTH_CANVAS_AUTHORITY_SIDE_PREFACE_LAUNCH_HANDSHAKE_BOOTED", {
        contract: PUBLIC_CONTRACT,
        internalContract: INTERNAL_CONTRACT,
        canvasElementFound: state.canvasElementFound,
        candidateSurfaceWorthyForLaunch: state.candidateSurfaceWorthyForLaunch,
        prefaceHoldRequired: state.prefaceHoldRequired,
        prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
        launchBridgeObserved: state.launchBridgeObserved,
        visualPassClaimed: false
      });

      return getReceipt();
    } catch (error) {
      recordError("HEARTH_CANVAS_AUTHORITY_BOOT_FAILED", error);
      publishAll("boot-error");
      return getReceipt();
    } finally {
      state.booting = false;
    }
  }

  function mount(options = {}) {
    bindCanvas(options.reason || "mount");
    refreshGovernedSources(options.reason || "mount");
    drawFrame(options.reason || "mount");
    publishAll("mount");
    return getReceipt();
  }

  function refresh(reason = "refresh") {
    readControlAuthority();
    readHexSurfaceAuthority();
    readLaunchBridge();
    bindCanvas(reason);
    refreshGovernedSources(reason);
    drawFrame(reason);
    deliverHandshake(reason);
    sendHexGate(reason);
    publishAll(reason);
    return getReceipt();
  }

  function dispose(reason = "dispose") {
    stopLoop("dispose");
    stopRescan("dispose");

    state.disposed = true;
    state.postgameStatus = "CANVAS_AUTHORITY_SIDE_DISPOSED";
    state.recommendedNextAction = "REBOOT_CANVAS_AUTHORITY_IF_REQUIRED";

    record("HEARTH_CANVAS_AUTHORITY_SIDE_DISPOSED", { reason });
    publishAll("dispose");

    return getReceipt();
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
    internalContract: INTERNAL_CONTRACT,
    internalReceipt: INTERNAL_RECEIPT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    previousInternalReceipt: PREVIOUS_INTERNAL_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedLaunchFile: EXPECTED_LAUNCH_FILE,
    expectedLaunchContract: EXPECTED_LAUNCH_CONTRACT,

    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    mount,
    refresh,
    dispose,

    startLoop,
    stopLoop,
    startRescan,
    stopRescan,

    bindCanvas,
    collectCanvasCandidates,
    refreshGovernedSources,
    discoverSourceAdapters,
    runSourceThreshold,
    buildTexture,
    sampleGovernedSource,
    drawFrame,
    renderFrame,
    requestFrame,

    receivePacket,
    receiveCanvasViewPacket,
    consumeCanvasViewPacket,
    receiveControlPacket,
    receiveViewControlPacket,
    receivePlanetaryViewControlPacket,

    composeCandidatePacket,
    composeHandshakePacket,
    deliverHandshake,
    sendHexGate,

    readControlAuthority,
    readHexSurfaceAuthority,
    readLaunchBridge,

    evaluateCandidateWorthiness,
    composeDiagnosticFields,
    updateDataset,
    publishAliases,
    publishReceipts,
    publishAll,
    publishRenderGlobals,
    publishHandshakeGlobals,

    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getSummary: getReceiptLight,
    getCanvasStationReceipt: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getCanvasParentReceipt: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getReceiptText,

    supportsBoot: true,
    supportsStart: true,
    supportsInit: true,
    supportsMount: true,
    supportsRefresh: true,
    supportsRenderFrame: true,
    supportsRequestFrame: true,
    supportsControlPacket: true,
    supportsCanvasViewPacket: true,
    supportsGovernedSourceDiscovery: true,
    supportsCandidateSurfaceDrawing: true,
    supportsAuthoritySidePrefaceLaunchHandshake: true,
    supportsLaunchBridgeDelivery: true,
    supportsPrefaceDecommissionAuthorization: true,
    supportsInitialPrefaceHold: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasCreationInsideExistingMount: true,
    ownsCanvasCandidateDrawing: true,
    ownsAuthoritySideLaunchHandshake: true,
    ownsCandidateWorthinessEvaluation: true,
    ownsPrefaceVisual: false,
    ownsPrefaceHoldExecution: false,
    ownsLaunchRevealExecution: false,
    ownsHtml: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsControlTruth: false,
    ownsSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexTruth: false,
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
    publishAliases();
    updateDataset();
    publishReceipts();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime" });
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_AUTHORITY_INITIALIZATION_FAILED", error);

    try {
      publishAliases();
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
