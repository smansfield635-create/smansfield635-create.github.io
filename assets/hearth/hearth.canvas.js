// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12
// Full-file replacement.
// Canvas Hub only.
// Purpose:
// - Renew the Canvas Parent / Expression Hub into the Hearth Canvas Hub.
// - Create or reuse the visible canvas inside the active Hearth page mount.
// - Prefer Composite for visible expression.
// - Detect the Hex Four-Pair Authority.
// - Detect the Hex Surface Renderer.
// - Use the Hex Surface Renderer only as the support visible-expression path.
// - Keep all three-file stretch awareness inside the Canvas Hub.
// - Recognize Route Conductor v9_5 as current and v9_4 as lineage.
// - Publish diagnostic-readable visible proof.
// - Preserve no F13, no F21, no ready text, no generated image, no GraphicBox, no WebGL, and no final visual pass.
// Does not own:
// - HTML shell
// - index/front-end button binding
// - diagnostic rail
// - Route Conductor systemic cycle authority
// - Composite truth
// - Hex Four-Pair Authority truth
// - Hex Surface Renderer truth
// - landform truth
// - elevation truth
// - material truth
// - hydrology truth
// - atmosphere truth
// - lighting truth
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const RECEIPT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT_v11_7";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT_v11_6";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const CURRENT_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";

  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const LINEAGE_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const LEGACY_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";
  const LEGACY_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3";

  const HEX_FOUR_PAIR_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const HEX_SURFACE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_FILE = FILE;
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";

  const BASE_FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js"
  });

  const EXPANSION_FINGER_FILES = Object.freeze({
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: COMPOSITE_FILE
  });

  const FINGER_FILES = Object.freeze({
    ...BASE_FINGER_FILES,
    ...EXPANSION_FINGER_FILES
  });

  const BASE_FINGER_SEQUENCE = Object.freeze(["boundary", "mass", "surface", "light", "inspect"]);
  const EXPANSION_FINGER_SEQUENCE = Object.freeze(["landform", "elevation", "material", "hydrology", "atmosphere", "lighting", "composite"]);
  const FINGER_SEQUENCE = Object.freeze([...BASE_FINGER_SEQUENCE, ...EXPANSION_FINGER_SEQUENCE]);

  const CANVAS_MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "#hearthGlobeStage",
    "[data-hearth-canvas-mount]",
    "[data-hearth-globe-mount]",
    "[data-hearth-planet-mount]",
    "#hearth-canvas-mount",
    "#hearth-globe-mount",
    "#hearth-planet-mount",
    "#hearthLoadCockpit",
    "#hearth-cockpit",
    "main",
    "body"
  ]);

  const GLOBE_STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "#hearth-globe-stage",
    "#hearth-planet-stage"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByCanvasParent: false,
    f21Claimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    readyTextClaimed: false,
    downstreamReleaseClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
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
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    targetFile: TARGET_FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: "Canvas Hub",

    canvasHubLoaded: true,
    canvasHubActive: true,
    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    threeFileStretchActive: true,
    threeFileAwarenessOwner: "Canvas Hub",
    otherFilesNeedPixelAwareness: false,
    roleSeparationPreserved: true,
    noRoleCollapse: true,

    currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    legacyRouteConductorContract: LEGACY_ROUTE_CONDUCTOR_CONTRACT,
    legacyRouteConductorReceipt: LEGACY_ROUTE_CONDUCTOR_RECEIPT,
    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorCurrentRecognized: false,
    routeConductorV95Recognized: false,
    routeConductorV94LineageAccepted: false,
    routeConductorV93LegacyObserved: false,
    routeConductorAuthoritySourceName: "NONE",
    routeConductorAuthoritySourceMethod: "NONE",
    expectedContractDriftFalsePositive: true,

    globeStageFound: false,
    globeStageSelector: "NONE",
    globeStageRectNonzero: false,
    canvasMountAttempted: false,
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasMountRectNonzero: false,
    canvasElementFound: false,
    canvasCreated: false,
    canvasReused: false,
    canvasId: "hearthCanvas",
    canvasRectNonzero: false,
    canvasAttributeWidth: 0,
    canvasAttributeHeight: 0,
    canvasCssWidth: "",
    canvasCssHeight: "",
    canvasContext2dReady: false,
    canvasDrawAttempted: false,
    canvasDrawComplete: false,
    canvasDrawError: "",
    holdingFieldDrawComplete: false,

    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "NOT_ATTEMPTED",
    renderedPlanetProofReady: false,
    domVisiblePlanetProofReady: false,
    stageMountDomProofReady: false,

    compositeFile: COMPOSITE_FILE,
    compositeDetected: false,
    compositeContract: "",
    compositeReceipt: "",
    compositeDrawMethodAvailable: false,
    compositeDrawMethod: "NONE",
    compositeDrawAttempted: false,
    compositeDrawComplete: false,
    compositeDrawReceipt: null,
    compositeDrawError: "",

    hexFourPairFile: HEX_FOUR_PAIR_FILE,
    hexFourPairAuthorityDetected: false,
    hexFourPairAuthorityContract: "",
    hexFourPairAuthorityContractRecognized: false,
    hexFourPairWideProbeAvailable: false,
    hexFourPairEveryPixelHasFourPairSet: false,
    hexFourPairBodyBound: false,
    hexFourPairAllowedToFloat: true,
    hexFourPairValidationReceipt: null,
    hexFourPairValidationError: "",

    hexSurfaceFile: HEX_SURFACE_FILE,
    hexSurfaceRendererDetected: false,
    hexSurfaceRendererContract: "",
    hexSurfaceRendererContractRecognized: false,
    hexSurfaceRendererDrawMethodAvailable: false,
    hexSurfaceRendererDrawMethod: "NONE",
    hexSurfaceRendererDrawAttempted: false,
    hexSurfaceRendererDrawComplete: false,
    hexSurfaceRendererFrameReceipt: null,
    hexSurfaceRendererDrawError: "",

    supportLoadAttempted: false,
    supportLoadComplete: false,
    supportLoadCompositeAttempted: false,
    supportLoadCompositeComplete: false,
    supportLoadHexFourPairAttempted: false,
    supportLoadHexFourPairComplete: false,
    supportLoadHexSurfaceAttempted: false,
    supportLoadHexSurfaceComplete: false,
    supportLoadErrors: [],

    fingerRegistry: {},
    fingerPacketLog: [],
    fingerReceiptLog: [],
    fingerExpressionPacketLog: [],
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,

    canvasEastApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestApiReady: false,
    canvasWestInspectionReady: false,
    canvasSouthApiReady: false,
    canvasSouthVisibleProofReady: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    f13StrictEvidenceRepairTarget: FILE,

    firstFailedCoordinate: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    recommendedNextFile: FILE,
    recommendedNextAction: "RUN_CANVAS_HUB",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "CANVAS_HUB_THREE_FILE_STRETCH_NOT_STARTED",

    lastCanvasStationSummary: null,
    lastExpressionHubSummary: null,
    lastExpressionHubReceipt: null,
    lastDiagnosticBridgeSummary: null,
    lastReceipt: null,
    localEvents: [],
    errors: [],
    bootAuditComplete: false,

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

  function hasRealValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
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
      event: safeString(event, "CANVAS_HUB_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 240);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_HUB_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 160);
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return hasRealValue(value) ? value : fallback;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";
    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.activeContract ||
      value.sourceContract ||
      "",
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return "";
    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.activeReceipt ||
      value.sourceReceipt ||
      "",
      ""
    );
  }

  function safeInvoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) {
      return {
        ok: false,
        value: null,
        error: `method-unavailable:${method}`
      };
    }

    try {
      return {
        ok: true,
        value: target[method](...(Array.isArray(args) ? args : [args])),
        error: ""
      };
    } catch (error) {
      return {
        ok: false,
        value: null,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getCanvasExpressionHubReceipt",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      const result = safeInvoke(authority, method);
      if (result.ok && isObject(result.value)) return result.value;
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function findFirstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };

    for (const selector of selectors) {
      try {
        const found = doc.querySelector(selector);
        if (found) return { element: found, selector };
      } catch (_error) {}
    }

    return { element: null, selector: "NONE" };
  }

  function rectNonzero(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) return false;

    try {
      const rect = element.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function choosePixelSize(container) {
    let cssWidth = 720;

    if (container && isFunction(container.getBoundingClientRect)) {
      try {
        const rect = container.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 240) && root.innerWidth) {
      cssWidth = Math.min(760, Math.max(300, root.innerWidth * 0.92));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(cssWidth * ratio)));
  }

  function normalizeFingerKey(value) {
    const raw = safeString(value).trim().toLowerCase();

    if (!raw) return "";
    if (FINGER_FILES[raw]) return raw;

    if (raw.includes("boundary") || raw.includes("shape")) return "boundary";
    if (raw.includes("mass") || raw.includes("body")) return "mass";
    if (raw.includes("surface")) return "surface";
    if (raw === "light" || raw.includes("base-light")) return "light";
    if (raw.includes("inspect")) return "inspect";
    if (raw.includes("landform") || raw.includes("landmass")) return "landform";
    if (raw.includes("elevation") || raw.includes("relief") || raw.includes("height")) return "elevation";
    if (raw.includes("material")) return "material";
    if (raw.includes("hydrology") || raw.includes("water")) return "hydrology";
    if (raw.includes("atmosphere") || raw.includes("air")) return "atmosphere";
    if (raw.includes("lighting") || raw.includes("shadow")) return "lighting";
    if (raw.includes("composite") || raw.includes("carrier")) return "composite";

    return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function createFingerTrack(key, input = {}) {
    const normalizedKey = normalizeFingerKey(key);
    const file = safeString(input.file || FINGER_FILES[normalizedKey] || "");

    return {
      key: normalizedKey,
      file,
      role: `canvas-finger-${normalizedKey}-track`,
      declared: true,
      authorityObserved: false,
      apiReady: false,
      expressionPacketReceived: false,
      receiptPacketReceived: false,
      trackReady: false,
      hardFail: false,
      status: "DECLARED_WAITING_FILE",
      firstGap: "WAITING_DOWNSTREAM_FINGER_FILE",
      ownsTruth: false,
      ownedByCanvasHub: false,
      canvasHubManagesTrack: true,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };
  }

  function initializeFingerRegistry() {
    for (const key of FINGER_SEQUENCE) {
      if (!state.fingerRegistry[key]) state.fingerRegistry[key] = createFingerTrack(key);
    }

    return state.fingerRegistry;
  }

  function inferFingerKeyFromPacket(packet) {
    if (!isObject(packet)) return "";

    const direct = normalizeFingerKey(
      packet.fingerKey ||
      packet.canvasFingerKey ||
      packet.trackKey ||
      packet.channelKey ||
      packet.finger ||
      packet.track ||
      ""
    );

    if (direct) return direct;

    const file = safeString(packet.file || packet.sourceFile || packet.targetFile || packet.destinationFile || "");
    for (const key of FINGER_SEQUENCE) {
      if (file === FINGER_FILES[key] || file.includes(`finger.${key}`)) return key;
    }

    const role = safeString(packet.role || packet.sourceRole || packet.childRole || packet.packetType || "");
    return normalizeFingerKey(role);
  }

  function hasFinalClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.finalPageProof === true ||
      packet.finalRouteProof === true ||
      packet.finalVisualPass === true ||
      packet.visualPassClaimed === true ||
      packet.readyTextAllowed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21SubmittedToNorth === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.degradedCompletionLatched === true ||
      safeString(packet.proofScope).toUpperCase().includes("FINAL") ||
      safeString(packet.scope).toUpperCase().includes("FINAL") ||
      safeString(packet.claimScope).toUpperCase().includes("FINAL")
    );
  }

  function packetHasExpressionContent(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.expressionPacket ||
      packet.expressionPayload ||
      packet.canvasExpressionPacket ||
      packet.boundaryPacket ||
      packet.massPacket ||
      packet.surfacePacket ||
      packet.lightPacket ||
      packet.samples ||
      packet.vertices ||
      packet.cells ||
      packet.atlas ||
      packet.texture ||
      packet.heightfield ||
      packet.materialMap ||
      packet.waterMap ||
      packet.lightMap ||
      packet.compositeMap ||
      safeString(packet.packetLane).toUpperCase().includes("EXPRESSION") ||
      safeString(packet.packetType).toUpperCase().includes("EXPRESSION")
    );
  }

  function packetHasReceiptContent(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.receipt ||
      packet.RECEIPT ||
      packet.contract ||
      packet.CONTRACT ||
      packet.status ||
      packet.firstFailedCoordinate ||
      packet.recommendedNextFile ||
      packet.packetType ||
      safeString(packet.packetLane).toUpperCase().includes("RECEIPT") ||
      safeString(packet.packetType).toUpperCase().includes("RECEIPT")
    );
  }

  function readFingerAuthority(key) {
    const normalizedKey = normalizeFingerKey(key);
    const camel = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
    const upper = normalizedKey.toUpperCase();

    const sourceNames = [
      `HEARTH_CANVAS_FINGER_${upper}`,
      `HEARTH_CANVAS_${upper}_FINGER`,
      `HEARTH.canvasFinger${camel}`,
      `HEARTH.canvas${camel}Finger`,
      `DEXTER_LAB.hearthCanvasFinger${camel}`,
      `DEXTER_LAB.hearthCanvas${camel}Finger`
    ];

    for (const name of sourceNames) {
      const found = readPath(name);
      if (found) return { name, authority: found };
    }

    return { name: "NONE", authority: null };
  }

  function scanFinger(key) {
    initializeFingerRegistry();

    const normalizedKey = normalizeFingerKey(key);
    const track = state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey);
    const source = readFingerAuthority(normalizedKey);
    const authority = source.authority;
    const receipt = readReceipt(authority);

    const authorityObserved = Boolean(authority);
    const apiReady = Boolean(
      authority &&
      (
        isFunction(authority.receiveHubPacket) ||
        isFunction(authority.receiveFingerPacket) ||
        isFunction(authority.receiveCanvasHubPacket) ||
        isFunction(authority.read) ||
        isFunction(authority.getReceipt) ||
        isFunction(authority.getReceiptLight) ||
        isFunction(authority.draw) ||
        isFunction(authority.render) ||
        isFunction(authority.drawFrame)
      )
    ) || safeBool(receipt && (receipt.apiReady || receipt.fingerApiReady || receipt.canvasFingerApiReady), false);

    const hardFail = Boolean(
      safeBool(receipt && (receipt.hardFail || receipt.fingerHardFail || receipt.canvasFingerHardFail), false) ||
      hasFinalClaim(receipt)
    );

    const expressionPacketReceived = Boolean(track.expressionPacketReceived || packetHasExpressionContent(receipt));
    const receiptPacketReceived = Boolean(track.receiptPacketReceived || packetHasReceiptContent(receipt));
    const trackReady = Boolean(apiReady || expressionPacketReceived || receiptPacketReceived || authorityObserved) && !hardFail;

    let status = "DECLARED_WAITING_FILE";
    if (hardFail) status = "HARD_FAIL";
    else if (trackReady) status = "TRACK_READY";
    else if (receiptPacketReceived) status = "RECEIPT_PACKET_RECEIVED";
    else if (expressionPacketReceived) status = "EXPRESSION_PACKET_RECEIVED";
    else if (apiReady) status = "API_READY";
    else if (authorityObserved) status = "AUTHORITY_OBSERVED";

    state.fingerRegistry[normalizedKey] = {
      ...track,
      authorityObserved,
      apiReady,
      expressionPacketReceived,
      receiptPacketReceived,
      trackReady,
      hardFail,
      status,
      lastAuthoritySourceName: source.name,
      lastReceiptPacket: receipt ? clonePlain(receipt) : track.lastReceiptPacket || null,
      firstGap: hardFail
        ? "FINGER_HARD_FAIL"
        : !authorityObserved
          ? "WAITING_DOWNSTREAM_FINGER_FILE"
          : !trackReady
            ? "WAITING_FINGER_PACKET"
            : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    return clonePlain(state.fingerRegistry[normalizedKey]);
  }

  function scanAllFingers() {
    initializeFingerRegistry();
    for (const key of FINGER_SEQUENCE) scanFinger(key);
    recomputeFingerAggregation();
    return getFingerRegistry();
  }

  function recomputeFingerAggregation() {
    initializeFingerRegistry();

    const tracks = FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);

    state.fingerAuthorityObservedCount = tracks.filter((track) => track.authorityObserved).length;
    state.fingerApiReadyCount = tracks.filter((track) => track.apiReady).length;
    state.fingerExpressionPacketCount = tracks.filter((track) => track.expressionPacketReceived).length;
    state.fingerReceiptPacketCount = tracks.filter((track) => track.receiptPacketReceived).length;
    state.fingerTrackReadyCount = tracks.filter((track) => track.trackReady).length;
    state.fingerHardFailCount = tracks.filter((track) => track.hardFail).length;

    return getFingerRegistry();
  }

  function getFingerRegistry() {
    initializeFingerRegistry();
    return clonePlain(state.fingerRegistry);
  }

  function getFingerTrackStatus(key) {
    const normalizedKey = normalizeFingerKey(key);
    if (!normalizedKey) return null;
    return clonePlain(state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey));
  }

  function receiveFingerPacket(packet = {}) {
    initializeFingerRegistry();

    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (!key) {
      recordError("FINGER_PACKET_REJECTED_NO_KEY", "No finger key could be inferred", { packet });
      return false;
    }

    if (!state.fingerRegistry[key]) state.fingerRegistry[key] = createFingerTrack(key);

    const track = state.fingerRegistry[key];
    const finalClaimBlocked = hasFinalClaim(packet);
    const expressionContent = packetHasExpressionContent(packet);
    const receiptContent = packetHasReceiptContent(packet);

    const next = {
      ...track,
      lastPacket: clonePlain(packet),
      authorityObserved: true,
      apiReady: true,
      hardFail: Boolean(track.hardFail || packet.hardFail === true || packet.fingerHardFail === true || finalClaimBlocked),
      expressionPacketReceived: Boolean(track.expressionPacketReceived || expressionContent),
      receiptPacketReceived: Boolean(track.receiptPacketReceived || receiptContent),
      lastExpressionPacket: expressionContent ? clonePlain(packet) : track.lastExpressionPacket || null,
      lastReceiptPacket: receiptContent ? clonePlain(packet) : track.lastReceiptPacket || null,
      trackReady: Boolean(!finalClaimBlocked && (expressionContent || receiptContent || track.trackReady)),
      status: finalClaimBlocked ? "HARD_FAIL" : "TRACK_READY",
      firstGap: finalClaimBlocked ? "FINGER_FALSE_FINAL_CLAIM_BLOCKED" : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.fingerRegistry[key] = next;

    state.fingerPacketLog.push({
      at: nowIso(),
      key,
      file: next.file,
      packetType: safeString(packet.packetType || packet.type || "FINGER_PACKET"),
      finalClaimBlocked,
      expressionContent,
      receiptContent
    });
    trimArray(state.fingerPacketLog, 160);

    if (expressionContent) {
      state.fingerExpressionPacketLog.push({ at: nowIso(), key, packet: clonePlain(packet) });
      trimArray(state.fingerExpressionPacketLog, 80);
    }

    if (receiptContent) {
      state.fingerReceiptLog.push({ at: nowIso(), key, packet: clonePlain(packet) });
      trimArray(state.fingerReceiptLog, 80);
    }

    refreshState();
    drawVisibleExpression("finger-packet-received");
    updateDataset();
    publishGlobals();

    return getExpressionHubSummary();
  }

  function receiveExpressionFingerPacket(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "EXPRESSION" });
  }

  function receiveFingerReceipt(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "RECEIPT" });
  }

  function receiveCanvasFingerPacket(packet = {}) {
    return receiveFingerPacket(packet);
  }

  function receiveCanvasExpressionPacket(packet = {}) {
    return receiveExpressionFingerPacket(packet);
  }

  function receiveCanvasFingerReceipt(packet = {}) {
    return receiveFingerReceipt(packet);
  }

  function routeConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR", readPath("HEARTH_ROUTE_CONDUCTOR")],
      ["HEARTH.routeConductor", readPath("HEARTH.routeConductor")],
      ["DEXTER_LAB.hearthRouteConductor", readPath("DEXTER_LAB.hearthRouteConductor")],
      ["HEARTH_ROUTE_CONDUCTOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_RECEIPT")],
      ["HEARTH.routeConductorReceipt", readPath("HEARTH.routeConductorReceipt")],
      ["DEXTER_LAB.hearthRouteConductorReceipt", readPath("DEXTER_LAB.hearthRouteConductorReceipt")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT")],
      ["HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion", readPath("HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion")],
      ["DEXTER_LAB.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion", readPath("DEXTER_LAB.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion")]
    ];
  }

  function lineageRouteConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT")],
      ["HEARTH.routeConductorCanvasLocalStationBridgeAlignment", readPath("HEARTH.routeConductorCanvasLocalStationBridgeAlignment")],
      ["DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment", readPath("DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment")]
    ];
  }

  function readContractReceiptPair(candidate) {
    if (!candidate) return { contract: "", receipt: "", body: null };

    const body = readReceipt(candidate) || (isObject(candidate) ? candidate : null);

    return {
      contract: safeString(
        (body && (body.contract || body.CONTRACT || body.routeConductorContract || body.sourceContract)) ||
        (isObject(candidate) && (candidate.contract || candidate.CONTRACT || candidate.routeConductorContract)) ||
        "",
        ""
      ),
      receipt: safeString(
        (body && (body.receipt || body.RECEIPT || body.routeConductorReceipt || body.sourceReceipt)) ||
        (isObject(candidate) && (candidate.receipt || candidate.RECEIPT || candidate.routeConductorReceipt)) ||
        "",
        ""
      ),
      body
    };
  }

  function readRouteConductorProfile() {
    let observed = false;
    let contract = "";
    let receipt = "";
    let currentRecognized = false;
    let lineageAccepted = false;
    let legacyObserved = false;
    let sourceName = "NONE";
    let sourceMethod = "NONE";

    for (const [name, candidate] of routeConductorSources()) {
      if (!candidate) continue;

      observed = true;
      const pair = readContractReceiptPair(candidate);

      if (!contract && pair.contract) contract = pair.contract;
      if (!receipt && pair.receipt) receipt = pair.receipt;

      if (pair.contract === CURRENT_ROUTE_CONDUCTOR_CONTRACT || pair.receipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT) {
        currentRecognized = true;
        sourceName = name;
        sourceMethod = "CURRENT_ROUTE_CONDUCTOR_SOURCE";
        contract = pair.contract || CURRENT_ROUTE_CONDUCTOR_CONTRACT;
        receipt = pair.receipt || CURRENT_ROUTE_CONDUCTOR_RECEIPT;
        break;
      }
    }

    const datasetContract =
      datasetValue("hearthServedRouteConductorContract") ||
      datasetValue("hearthCurrentRouteConductorContract") ||
      datasetValue("hearthCanvasCurrentRouteConductorRequiredContract") ||
      datasetValue("routeConductorContract");

    const datasetReceipt =
      datasetValue("hearthServedRouteConductorReceipt") ||
      datasetValue("hearthCurrentRouteConductorReceipt") ||
      datasetValue("hearthCanvasCurrentRouteConductorRequiredReceipt") ||
      datasetValue("routeConductorReceipt");

    if (datasetContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT || datasetReceipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT) {
      observed = true;
      currentRecognized = true;
      if (!contract) contract = datasetContract || CURRENT_ROUTE_CONDUCTOR_CONTRACT;
      if (!receipt) receipt = datasetReceipt || CURRENT_ROUTE_CONDUCTOR_RECEIPT;
      if (sourceName === "NONE") {
        sourceName = "DOCUMENT_DATASET_CURRENT_ROUTE_CONDUCTOR_CONTRACT";
        sourceMethod = "DATASET_CONTRACT_RECOGNITION";
      }
    }

    for (const [_name, candidate] of lineageRouteConductorSources()) {
      if (!candidate) continue;
      const pair = readContractReceiptPair(candidate);
      if (pair.contract === LINEAGE_ROUTE_CONDUCTOR_CONTRACT || pair.receipt === LINEAGE_ROUTE_CONDUCTOR_RECEIPT) {
        lineageAccepted = true;
        break;
      }
    }

    if (
      datasetContract === LINEAGE_ROUTE_CONDUCTOR_CONTRACT ||
      datasetReceipt === LINEAGE_ROUTE_CONDUCTOR_RECEIPT ||
      datasetValue("expectedRouteConductorContract") === LINEAGE_ROUTE_CONDUCTOR_CONTRACT
    ) {
      lineageAccepted = true;
    }

    if (contract === LEGACY_ROUTE_CONDUCTOR_CONTRACT || receipt === LEGACY_ROUTE_CONDUCTOR_RECEIPT) {
      legacyObserved = true;
    }

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = Boolean(contract);
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receipt;
    state.routeConductorCurrentRecognized = currentRecognized;
    state.routeConductorV95Recognized = currentRecognized;
    state.routeConductorV94LineageAccepted = lineageAccepted;
    state.routeConductorV93LegacyObserved = legacyObserved;
    state.routeConductorAuthoritySourceName = sourceName;
    state.routeConductorAuthoritySourceMethod = sourceMethod;

    return {
      observed,
      contract,
      receipt,
      routeConductorCurrentRecognized: currentRecognized,
      routeConductorV95Recognized: currentRecognized,
      routeConductorV94LineageAccepted: lineageAccepted,
      sourceName,
      sourceMethod
    };
  }

  function compositeSources() {
    return [
      ["HEARTH_CANVAS_FINGER_COMPOSITE", readPath("HEARTH_CANVAS_FINGER_COMPOSITE")],
      ["HEARTH_CANVAS_COMPOSITE_FINGER", readPath("HEARTH_CANVAS_COMPOSITE_FINGER")],
      ["HEARTH_CANVAS_COMPOSITE", readPath("HEARTH_CANVAS_COMPOSITE")],
      ["HEARTH.canvasFingerComposite", readPath("HEARTH.canvasFingerComposite")],
      ["HEARTH.canvasCompositeFinger", readPath("HEARTH.canvasCompositeFinger")],
      ["HEARTH.canvasComposite", readPath("HEARTH.canvasComposite")],
      ["DEXTER_LAB.hearthCanvasFingerComposite", readPath("DEXTER_LAB.hearthCanvasFingerComposite")],
      ["DEXTER_LAB.hearthCanvasCompositeFinger", readPath("DEXTER_LAB.hearthCanvasCompositeFinger")],
      ["DEXTER_LAB.hearthCanvasComposite", readPath("DEXTER_LAB.hearthCanvasComposite")]
    ];
  }

  function detectComposite() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of compositeSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const contract = contractOf(receipt || found);
    const receiptName = receiptOf(receipt || found);

    const method = findDrawMethod(found, [
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "render",
      "draw",
      "compose"
    ]);

    state.compositeDetected = Boolean(found);
    state.compositeContract = contract;
    state.compositeReceipt = receiptName;
    state.compositeDrawMethodAvailable = Boolean(found && method !== "NONE");
    state.compositeDrawMethod = method;
    state.compositeSourceName = sourceName;

    if (state.fingerRegistry.composite) {
      state.fingerRegistry.composite.authorityObserved = Boolean(found);
      state.fingerRegistry.composite.apiReady = state.compositeDrawMethodAvailable || Boolean(found);
      state.fingerRegistry.composite.trackReady = Boolean(found);
      state.fingerRegistry.composite.status = found ? "TRACK_READY" : "DECLARED_WAITING_FILE";
      state.fingerRegistry.composite.firstGap = found ? "NONE" : "WAITING_DOWNSTREAM_FINGER_FILE";
    }

    return { api: found, receipt, method, sourceName };
  }

  function hexFourPairSources() {
    return [
      ["HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEX_FOUR_PAIR_AUTHORITY", readPath("HEARTH_HEX_FOUR_PAIR_AUTHORITY")],
      ["HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEX_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEXGRID_AUTHORITY", readPath("HEARTH_HEXGRID_AUTHORITY")],
      ["HEARTH.hexFourPairAuthority", readPath("HEARTH.hexFourPairAuthority")],
      ["HEARTH.hexAuthority", readPath("HEARTH.hexAuthority")]
    ];
  }

  function detectHexFourPairAuthority() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of hexFourPairSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const actualContract = contractOf(receipt || found);
    const contractRecognized = actualContract === HEX_FOUR_PAIR_CONTRACT;
    let wideProbeAvailable = false;
    let everyPixelHasFourPairSet = false;
    let bodyBound = false;
    let allowedToFloat = true;
    let validationReceipt = null;
    let validationError = "";

    try {
      if (found && isFunction(found.sample)) {
        const sample = found.sample({ u: 0.5, v: 0.5 });
        everyPixelHasFourPairSet = Boolean(sample && sample.everyPixelHasFourPairSet === true);
        bodyBound = Boolean(sample && sample.bodyBound === true && sample.surfaceBound === true);
        allowedToFloat = sample ? sample.allowedToFloat !== false : true;
      }

      if (found && isFunction(found.wideProbe)) {
        wideProbeAvailable = true;
        validationReceipt = found.wideProbe({ rows: 5, columns: 9 });
        if (validationReceipt && validationReceipt.everyPixelHasFourPairSet === true) {
          everyPixelHasFourPairSet = true;
        }
        if (validationReceipt && validationReceipt.failedCount === 0) {
          bodyBound = true;
          allowedToFloat = false;
        }
      }
    } catch (error) {
      validationError = error && error.message ? String(error.message) : String(error);
      recordError("HEX_FOUR_PAIR_VALIDATION_FAILED", error);
    }

    state.hexFourPairAuthorityDetected = Boolean(found);
    state.hexFourPairAuthorityContract = actualContract;
    state.hexFourPairAuthorityContractRecognized = contractRecognized;
    state.hexFourPairWideProbeAvailable = wideProbeAvailable;
    state.hexFourPairEveryPixelHasFourPairSet = everyPixelHasFourPairSet;
    state.hexFourPairBodyBound = bodyBound;
    state.hexFourPairAllowedToFloat = allowedToFloat;
    state.hexFourPairValidationReceipt = validationReceipt ? clonePlain(validationReceipt) : null;
    state.hexFourPairValidationError = validationError;
    state.hexFourPairSourceName = sourceName;

    return { api: found, receipt, sourceName };
  }

  function hexSurfaceSources() {
    return [
      ["HEARTH_HEX_SURFACE", readPath("HEARTH_HEX_SURFACE")],
      ["HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER", readPath("HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER")],
      ["HEARTH.hexSurface", readPath("HEARTH.hexSurface")],
      ["HEARTH.hexSurfaceConsumer", readPath("HEARTH.hexSurfaceConsumer")]
    ];
  }

  function detectHexSurfaceRenderer() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of hexSurfaceSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const actualContract = contractOf(receipt || found);
    const method = findDrawMethod(found, [
      "drawHearthHexSurfaceFrame",
      "drawFrame",
      "render",
      "draw"
    ]);

    state.hexSurfaceRendererDetected = Boolean(found);
    state.hexSurfaceRendererContract = actualContract;
    state.hexSurfaceRendererContractRecognized = actualContract === HEX_SURFACE_CONTRACT;
    state.hexSurfaceRendererDrawMethodAvailable = Boolean(found && method !== "NONE");
    state.hexSurfaceRendererDrawMethod = method;
    state.hexSurfaceRendererSourceName = sourceName;

    return { api: found, receipt, method, sourceName };
  }

  function findDrawMethod(target, methods) {
    if (!target || !isObject(target)) return "NONE";

    for (const method of methods) {
      if (isFunction(target[method])) return method;
    }

    return "NONE";
  }

  function findCanvasElement(mount, stage) {
    if (!doc) return null;

    const direct = doc.getElementById(state.canvasId);
    if (direct && direct.tagName && direct.tagName.toLowerCase() === "canvas") return direct;

    const selectors = [
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-base-globe-canvas='true']",
      "canvas#hearth-canvas-base-globe"
    ];

    for (const selector of selectors) {
      try {
        const found = (mount && mount.querySelector ? mount.querySelector(selector) : null) ||
          (stage && stage.querySelector ? stage.querySelector(selector) : null) ||
          doc.querySelector(selector);
        if (found && found.tagName && found.tagName.toLowerCase() === "canvas") return found;
      } catch (_error) {}
    }

    return null;
  }

  function ensureCanvas() {
    state.canvasMountAttempted = true;

    if (!doc) {
      state.canvasMountFound = false;
      state.canvasElementFound = false;
      state.canvasDrawError = "DOCUMENT_NOT_AVAILABLE";
      return null;
    }

    const stageResult = findFirstElement(GLOBE_STAGE_SELECTORS);
    const mountResult = findFirstElement(CANVAS_MOUNT_SELECTORS);

    const stage = stageResult.element;
    const mount = mountResult.element || stage;

    state.globeStageFound = Boolean(stage);
    state.globeStageSelector = stageResult.selector;
    state.globeStageRectNonzero = rectNonzero(stage);

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;
    state.canvasMountRectNonzero = rectNonzero(mount);

    state.stageMountDomProofReady = Boolean(
      (state.globeStageFound && state.globeStageRectNonzero) ||
      (state.canvasMountFound && state.canvasMountRectNonzero)
    );
    state.domVisiblePlanetProofReady = state.stageMountDomProofReady;

    if (!mount) {
      state.canvasElementFound = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_HTML_MOUNT";
      return null;
    }

    let canvas = findCanvasElement(mount, stage);

    if (canvas) {
      state.canvasReused = true;
      state.canvasCreated = false;
    } else {
      canvas = doc.createElement("canvas");
      canvas.id = state.canvasId;
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      state.canvasReused = false;
    }

    sizeCanvas(canvas, mount);

    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthThreeFileStretchActive = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    state.canvasElementFound = true;
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.canvasAttributeWidth = safeNumber(canvas.width, 0);
    state.canvasAttributeHeight = safeNumber(canvas.height, 0);
    state.canvasCssWidth = safeString(canvas.style.width, "");
    state.canvasCssHeight = safeString(canvas.style.height, "");

    const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;
    state.canvasContext2dReady = Boolean(ctx);

    state.canvasElement = canvas;
    state.canvasContext = ctx;
    state.canvasMountElement = mount;
    state.globeStageElement = stage;

    return { canvas, ctx, mount, stage };
  }

  function sizeCanvas(canvas, mount) {
    const px = choosePixelSize(mount);

    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "min(88vw, 760px)";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    canvas.style.boxSizing = "border-box";
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) return false;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sampleSize = Math.max(1, Math.min(24, Math.floor(Math.min(w, h) / 32)));
      const x = Math.max(0, Math.floor(w / 2 - sampleSize / 2));
      const y = Math.max(0, Math.floor(h / 2 - sampleSize / 2));
      const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;

      for (let index = 0; index < data.length; index += 4) {
        if (data[index + 3] > 0 && (data[index] > 3 || data[index + 1] > 3 || data[index + 2] > 3)) {
          return true;
        }
      }
    } catch (_error) {
      return true;
    }

    return false;
  }

  function drawHoldingField(canvas, ctx, reason) {
    if (!canvas || !ctx) return false;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
      bg.addColorStop(0, "rgba(18,42,74,0.82)");
      bg.addColorStop(0.58, "rgba(7,12,28,0.96)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const globe = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.33, r * 0.05, cx, cy, r);
      globe.addColorStop(0, "rgba(108,192,244,0.92)");
      globe.addColorStop(0.38, "rgba(28,86,144,0.88)");
      globe.addColorStop(0.78, "rgba(7,28,76,0.96)");
      globe.addColorStop(1, "rgba(1,6,24,1)");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globe;
      ctx.fill();

      ctx.strokeStyle = "rgba(186,226,255,0.56)";
      ctx.lineWidth = Math.max(1, r * 0.012);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.68)";
      ctx.font = `${Math.max(11, Math.floor(w / 58))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Canvas Hub holding field", cx, h - Math.max(22, h * 0.055));

      if (reason) {
        ctx.fillStyle = "rgba(255,255,255,0.48)";
        ctx.font = `${Math.max(10, Math.floor(w / 72))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(String(reason).slice(0, 70), cx, h - Math.max(10, h * 0.028));
      }

      state.holdingFieldDrawComplete = true;
      return true;
    } catch (error) {
      state.holdingFieldDrawComplete = false;
      recordError("HOLDING_FIELD_DRAW_FAILED", error);
      return false;
    }
  }

  function buildDrawState(canvas, ctx, mount, stage, mode) {
    return {
      canvas,
      ctx,
      context: ctx,
      mount,
      stage,
      mode,
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      file: FILE,
      phase: safeNumber(state.baseFramePhase, 0),
      hexFourPairAuthority: detectHexFourPairAuthority().api,
      hexSurfaceRenderer: detectHexSurfaceRenderer().api,
      canvasHub: api,
      getReceipt: getReceiptLight,
      ...FINAL_FALSE
    };
  }

  function attemptCompositeDraw(canvas, ctx, mount, stage) {
    const detected = detectComposite();
    state.compositeDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.compositeDrawComplete = false;
      state.compositeDrawError = detected.api ? "COMPOSITE_DRAW_METHOD_UNAVAILABLE" : "COMPOSITE_NOT_DETECTED";
      return false;
    }

    const drawState = buildDrawState(canvas, ctx, mount, stage, "COMPOSITE");
    const result = safeInvoke(detected.api, detected.method, [drawState, {
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      preferredVisibleExpression: true,
      finalVisualPassClaimed: false,
      visualPassClaimed: false
    }]);

    if (!result.ok) {
      state.compositeDrawComplete = false;
      state.compositeDrawError = result.error;
      recordError("COMPOSITE_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.drawComplete === false ||
      receipt.compositeDrawComplete === false ||
      receipt.visiblePlanetProofReady === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.compositeDrawReceipt = receipt ? clonePlain(receipt) : null;
    state.compositeDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.compositeDrawError = state.compositeDrawComplete ? "" : "COMPOSITE_DRAW_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.compositeDrawComplete) {
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "COMPOSITE";
      state.visiblePlanetProofReason = "COMPOSITE_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      return true;
    }

    return false;
  }

  function attemptHexSurfaceDraw(canvas, ctx, mount, stage) {
    detectHexFourPairAuthority();
    const detected = detectHexSurfaceRenderer();

    state.hexSurfaceRendererDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = detected.api ? "HEX_SURFACE_RENDERER_DRAW_METHOD_UNAVAILABLE" : "HEX_SURFACE_RENDERER_NOT_DETECTED";
      return false;
    }

    const drawState = buildDrawState(canvas, ctx, mount, stage, "HEX_SURFACE_RENDERER");
    const result = safeInvoke(detected.api, detected.method, [drawState, {
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      supportVisibleExpression: true,
      finalVisualPassClaimed: false,
      visualPassClaimed: false
    }]);

    if (!result.ok) {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = result.error;
      recordError("HEX_SURFACE_RENDERER_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.ok === false ||
      receipt.drawComplete === false ||
      receipt.hexSurfaceRendererDrawComplete === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.hexSurfaceRendererFrameReceipt = receipt ? clonePlain(receipt) : null;
    state.hexSurfaceRendererDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.hexSurfaceRendererDrawError = state.hexSurfaceRendererDrawComplete ? "" : "HEX_SURFACE_RENDERER_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.hexSurfaceRendererDrawComplete) {
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "HEX_SURFACE_RENDERER";
      state.visiblePlanetProofReason = "HEX_SURFACE_RENDERER_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      return true;
    }

    return false;
  }

  function drawVisibleExpression(reason = "manual") {
    state.canvasDrawAttempted = true;
    state.canvasDrawComplete = false;
    state.visiblePlanetProofReady = false;
    state.renderedPlanetProofReady = false;
    state.visiblePlanetProofSource = "NONE";
    state.visiblePlanetProofReason = safeString(reason, "manual");

    const target = ensureCanvas();

    if (!target || !target.canvas || !target.ctx) {
      state.canvasDrawComplete = false;
      state.firstFailedCoordinate = target ? "CANVAS_CONTEXT_NOT_AVAILABLE" : "CANVAS_MOUNT_OR_ELEMENT_NOT_AVAILABLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "RENEW_CANVAS_HUB_MOUNT_COORDINATION";
      resolveF13Gap();
      updateDataset();
      return false;
    }

    refreshSupportDetections();

    if (attemptCompositeDraw(target.canvas, target.ctx, target.mount, target.stage)) {
      resolveF13Gap();
      updateDataset();
      publishGlobals();
      record("CANVAS_HUB_VISIBLE_EXPRESSION_COMPLETE", {
        source: "COMPOSITE",
        reason
      });
      return true;
    }

    if (attemptHexSurfaceDraw(target.canvas, target.ctx, target.mount, target.stage)) {
      resolveF13Gap();
      updateDataset();
      publishGlobals();
      record("CANVAS_HUB_VISIBLE_EXPRESSION_COMPLETE", {
        source: "HEX_SURFACE_RENDERER",
        reason
      });
      return true;
    }

    drawHoldingField(target.canvas, target.ctx, "awaiting Composite or Hex Surface Renderer");

    state.canvasDrawComplete = false;
    state.visiblePlanetProofReady = false;
    state.renderedPlanetProofReady = false;
    state.visiblePlanetProofSource = "NONE";
    state.visiblePlanetProofReason = "COMPOSITE_AND_HEX_SURFACE_RENDERER_NOT_READY";
    state.firstFailedCoordinate = "VISIBLE_EXPRESSION_SUPPORT_NOT_READY";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "CONFIRM_COMPOSITE_OR_HEX_SURFACE_RENDERER_LOADED";

    resolveF13Gap();
    updateDataset();
    publishGlobals();

    record("CANVAS_HUB_VISIBLE_EXPRESSION_HELD", {
      source: "NONE",
      reason,
      compositeDetected: state.compositeDetected,
      compositeDrawComplete: state.compositeDrawComplete,
      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete
    });

    return false;
  }

  function refreshSupportDetections() {
    detectComposite();
    detectHexFourPairAuthority();
    detectHexSurfaceRenderer();
    scanAllFingers();
    return true;
  }

  function refreshState() {
    readRouteConductorProfile();
    refreshSupportDetections();
    ensureCanvas();
    resolveF13Gap();
    composeDiagnosticBridgeSummary();
    state.updatedAt = nowIso();
    return clonePlain(state);
  }

  function resolveF13Gap() {
    let gap = "NONE_VISIBLE_EXPRESSION_READY";
    let target = FILE;
    let status = "CANVAS_HUB_VISIBLE_EXPRESSION_READY";

    if (!state.canvasMountFound) {
      gap = "CANVAS_MOUNT_NOT_FOUND";
      status = "CANVAS_HUB_WAITING_HEARTH_CANVAS_MOUNT";
    } else if (!state.canvasElementFound) {
      gap = "CANVAS_ELEMENT_NOT_FOUND";
      status = "CANVAS_HUB_WAITING_CANVAS_ELEMENT";
    } else if (!state.canvasContext2dReady) {
      gap = "CANVAS_2D_CONTEXT_NOT_READY";
      status = "CANVAS_HUB_WAITING_2D_CONTEXT";
    } else if (!state.visiblePlanetProofReady) {
      gap = "VISIBLE_EXPRESSION_NOT_PROVEN";
      status = "CANVAS_HUB_VISIBLE_EXPRESSION_NOT_PROVEN";
    } else if (state.visiblePlanetProofSource === "COMPOSITE") {
      gap = "NONE_COMPOSITE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_HUB_COMPOSITE_VISIBLE_EXPRESSION_ACTIVE";
    } else if (state.visiblePlanetProofSource === "HEX_SURFACE_RENDERER") {
      gap = "NONE_HEX_SURFACE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_HUB_HEX_SURFACE_VISIBLE_EXPRESSION_ACTIVE";
    }

    state.f13CanvasReadinessObserved = Boolean(state.canvasElementFound || state.canvasDrawAttempted);
    state.f13VisibleEvidenceAvailable = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceComplete = Boolean(state.visiblePlanetProofReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget = target;

    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = target;
    state.recommendedNextRenewalTarget = target;
    state.postgameStatus = status;

    if (state.visiblePlanetProofReady) {
      state.recommendedNextAction = "RUN_DIAGNOSTIC_RECEIPT";
    }

    return { gap, target, status };
  }

  function readCanvasChild(kind) {
    const sources = {
      east: ["HEARTH_CANVAS_EAST", "HEARTH.canvasEast", "DEXTER_LAB.hearthCanvasEast"],
      west: ["HEARTH_CANVAS_WEST", "HEARTH.canvasWest", "DEXTER_LAB.hearthCanvasWest"],
      south: ["HEARTH_CANVAS_SOUTH", "HEARTH.canvasSouth", "DEXTER_LAB.hearthCanvasSouth"]
    };

    for (const name of sources[kind] || []) {
      const found = readPath(name);
      if (found) return found;
    }

    return null;
  }

  function scanCanvasChildren() {
    const east = readCanvasChild("east");
    const west = readCanvasChild("west");
    const south = readCanvasChild("south");

    const eastReceipt = readReceipt(east) || {};
    const westReceipt = readReceipt(west) || {};
    const southReceipt = readReceipt(south) || {};

    state.canvasEastApiReady = Boolean(east || safeBool(eastReceipt.canvasEastApiReady, false));
    state.canvasEastEvidenceReady = Boolean(safeBool(eastReceipt.canvasEastEvidenceReady, false) || safeBool(eastReceipt.atlasReady, false));
    state.canvasWestApiReady = Boolean(west || safeBool(westReceipt.canvasWestApiReady, false));
    state.canvasWestInspectionReady = Boolean(safeBool(westReceipt.canvasWestInspectionReady, false) || safeBool(westReceipt.inspectionReady, false));
    state.canvasSouthApiReady = Boolean(south || safeBool(southReceipt.canvasSouthApiReady, false));
    state.canvasSouthVisibleProofReady = Boolean(safeBool(southReceipt.canvasSouthVisibleProofReady, false) || safeBool(southReceipt.visiblePlanetAvailable, false) || safeBool(southReceipt.imageRendered, false));

    return {
      east: { observed: Boolean(east), receipt: clonePlain(eastReceipt) },
      west: { observed: Boolean(west), receipt: clonePlain(westReceipt) },
      south: { observed: Boolean(south), receipt: clonePlain(southReceipt) }
    };
  }

  function composeDiagnosticBridgeSummary() {
    const summary = {
      packetType: "HEARTH_CANVAS_HUB_DIAGNOSTIC_BRIDGE_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticBridgeActive: true,
      canvasHubLoaded: true,
      canvasHubActive: true,
      threeFileStretchActive: true,
      threeFileAwarenessOwner: "Canvas Hub",
      otherFilesNeedPixelAwareness: false,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasDrawComplete: state.canvasDrawComplete,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      compositeDetected: state.compositeDetected,
      compositeDrawComplete: state.compositeDrawComplete,
      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorV95Recognized: state.routeConductorV95Recognized,
      routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,
      expectedContractDriftFalsePositive: true,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      noClaimsPreserved: true,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.lastDiagnosticBridgeSummary = clonePlain(summary);
    return summary;
  }

  function loadScriptOnce(src, stateAttemptKey, stateCompleteKey) {
    if (!doc || !doc.head) return Promise.resolve(false);

    state[stateAttemptKey] = true;
    state.supportLoadAttempted = true;

    const existing = Array.from(doc.querySelectorAll("script[src]")).find((script) => {
      try {
        const url = new URL(script.getAttribute("src"), root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
        return url.pathname === src;
      } catch (_error) {
        return safeString(script.getAttribute("src")).split("?")[0] === src;
      }
    });

    if (existing) {
      state[stateCompleteKey] = true;
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = doc.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-hearth-canvas-hub-support", "true");
      script.setAttribute("data-contract", CONTRACT);

      script.onload = () => {
        state[stateCompleteKey] = true;
        state.updatedAt = nowIso();
        resolve(true);
      };

      script.onerror = () => {
        const item = {
          at: nowIso(),
          file: src,
          error: "SCRIPT_LOAD_ERROR"
        };

        state.supportLoadErrors.push(item);
        trimArray(state.supportLoadErrors, 40);
        state[stateCompleteKey] = false;
        state.updatedAt = item.at;
        resolve(false);
      };

      doc.head.appendChild(script);
    });
  }

  function ensureSupportFilesLoaded() {
    state.supportLoadAttempted = true;

    return loadScriptOnce(COMPOSITE_FILE, "supportLoadCompositeAttempted", "supportLoadCompositeComplete")
      .then(() => loadScriptOnce(HEX_FOUR_PAIR_FILE, "supportLoadHexFourPairAttempted", "supportLoadHexFourPairComplete"))
      .then(() => loadScriptOnce(HEX_SURFACE_FILE, "supportLoadHexSurfaceAttempted", "supportLoadHexSurfaceComplete"))
      .then(() => {
        state.supportLoadComplete = true;
        refreshState();
        drawVisibleExpression("support-files-loaded");
        updateDataset();
        publishGlobals();
        return getReceipt();
      });
  }

  function receiveEastPacket(packet) {
    state.canvasEastApiReady = true;
    state.canvasEastEvidenceReady = packet && isObject(packet)
      ? packet.canvasEastEvidenceReady === true || packet.atlasReady === true
      : state.canvasEastEvidenceReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet) {
    state.canvasWestApiReady = true;
    state.canvasWestInspectionReady = packet && isObject(packet)
      ? packet.canvasWestInspectionReady === true || packet.inspectionReady === true
      : state.canvasWestInspectionReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet) {
    state.canvasSouthApiReady = true;
    state.canvasSouthVisibleProofReady = packet && isObject(packet)
      ? packet.canvasSouthVisibleProofReady === true || packet.visiblePlanetAvailable === true || packet.imageRendered === true
      : state.canvasSouthVisibleProofReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function receiveChildPacket(packet) {
    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (key && FINGER_FILES[key]) return receiveFingerPacket(packet);

    refreshState();
    updateDataset();
    publishGlobals();
    return true;
  }

  function consumeRouteConductorReleasePacket(packet) {
    state.routeConductorReleasePacket = clonePlain(packet || {});
    state.routeConductorReleasePacketObserved = isObject(packet);
    state.routeConductorReleasePacketValid = true;
    refreshState();
    drawVisibleExpression("route-conductor-release-packet");
    return getReceipt();
  }

  function receiveRouteConductorReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function consumeReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveCanvasReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function readRouteConductorReleasePacket() {
    readRouteConductorProfile();
    return state.routeConductorReleasePacket || null;
  }

  function getExpressionHubSummary() {
    refreshSupportDetections();
    recomputeFingerAggregation();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_EXPRESSION_HUB_THREE_FILE_STRETCH_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasHubLoaded: true,
      canvasHubActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      threeFileStretchActive: true,
      threeFileAwarenessOwner: "Canvas Hub",
      otherFilesNeedPixelAwareness: false,
      roleSeparationPreserved: true,
      noRoleCollapse: true,

      compositeFile: COMPOSITE_FILE,
      hexFourPairFile: HEX_FOUR_PAIR_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,

      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      globeStageFound: state.globeStageFound,
      globeStageSelector: state.globeStageSelector,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasReused: state.canvasReused,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasAttributeWidth: state.canvasAttributeWidth,
      canvasAttributeHeight: state.canvasAttributeHeight,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasDrawAttempted: state.canvasDrawAttempted,
      canvasDrawComplete: state.canvasDrawComplete,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,

      fingerSequence: FINGER_SEQUENCE.slice(),
      baseFingerFiles: clonePlain(BASE_FINGER_FILES),
      expansionFingerFiles: clonePlain(EXPANSION_FINGER_FILES),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),
      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastExpressionHubSummary = clonePlain(summary);
    return summary;
  }

  function getExpressionHubReceipt() {
    const receipt = {
      ...getExpressionHubSummary(),
      packetType: "CANVAS_EXPRESSION_HUB_THREE_FILE_STRETCH_RECEIPT",
      currentReceipt: true,
      fingerPacketLog: clonePlain(state.fingerPacketLog),
      fingerExpressionPacketLog: clonePlain(state.fingerExpressionPacketLog),
      fingerReceiptLog: clonePlain(state.fingerReceiptLog),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastExpressionHubReceipt = clonePlain(receipt);
    return receipt;
  }

  function getCanvasStationSummary() {
    scanCanvasChildren();
    resolveF13Gap();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      targetFile: TARGET_FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasHubLoaded: true,
      canvasHubActive: true,
      canvasLocalStationActive: true,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      threeFileStretchActive: true,
      threeFileAwarenessOwner: "Canvas Hub",
      otherFilesNeedPixelAwareness: false,
      roleSeparationPreserved: true,
      noRoleCollapse: true,

      currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorV95Recognized: state.routeConductorV95Recognized,
      routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,
      expectedContractDriftFalsePositive: true,

      canvasMountAttempted: state.canvasMountAttempted,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMountRectNonzero: state.canvasMountRectNonzero,
      globeStageFound: state.globeStageFound,
      globeStageSelector: state.globeStageSelector,
      globeStageRectNonzero: state.globeStageRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasReused: state.canvasReused,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasAttributeWidth: state.canvasAttributeWidth,
      canvasAttributeHeight: state.canvasAttributeHeight,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasDrawAttempted: state.canvasDrawAttempted,
      canvasDrawComplete: state.canvasDrawComplete,
      canvasDrawError: state.canvasDrawError,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawMethod: state.compositeDrawMethod,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,
      compositeDrawError: state.compositeDrawError,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContract: state.hexSurfaceRendererContract,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawMethod: state.hexSurfaceRendererDrawMethod,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      hexSurfaceRendererDrawError: state.hexSurfaceRendererDrawError,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      domVisiblePlanetProofReady: state.domVisiblePlanetProofReady,
      stageMountDomProofReady: state.stageMountDomProofReady,

      supportLoadAttempted: state.supportLoadAttempted,
      supportLoadComplete: state.supportLoadComplete,
      supportLoadCompositeAttempted: state.supportLoadCompositeAttempted,
      supportLoadCompositeComplete: state.supportLoadCompositeComplete,
      supportLoadHexFourPairAttempted: state.supportLoadHexFourPairAttempted,
      supportLoadHexFourPairComplete: state.supportLoadHexFourPairComplete,
      supportLoadHexSurfaceAttempted: state.supportLoadHexSurfaceAttempted,
      supportLoadHexSurfaceComplete: state.supportLoadHexSurfaceComplete,

      expressionHubSummary: getExpressionHubSummary(),
      diagnosticBridgeSummary: composeDiagnosticBridgeSummary(),

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      diagnosticRailMayReadThisSummary: true,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastCanvasStationSummary = clonePlain(summary);
    return summary;
  }

  function getCanvasStationReceiptLight() {
    return getCanvasStationSummary();
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_RECEIPT",
      currentReceipt: true,
      compositeDrawReceipt: clonePlain(state.compositeDrawReceipt),
      hexFourPairValidationReceipt: clonePlain(state.hexFourPairValidationReceipt),
      hexSurfaceRendererFrameReceipt: clonePlain(state.hexSurfaceRendererFrameReceipt),
      expressionHubReceipt: getExpressionHubReceipt(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      supportLoadErrors: clonePlain(state.supportLoadErrors),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getDiagnosticBridgeSummary() {
    return clonePlain(state.lastDiagnosticBridgeSummary || composeDiagnosticBridgeSummary());
  }

  function getDiagnosticBridgeReceipt() {
    return {
      ...composeDiagnosticBridgeSummary(),
      packetType: "HEARTH_CANVAS_HUB_DIAGNOSTIC_BRIDGE_RECEIPT",
      currentReceipt: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getStructuralCarrier() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      role: "Canvas Hub structural carrier",
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasHubActive: true,
      threeFileStretchActive: true,
      threeFileAwarenessOwner: "Canvas Hub",
      otherFilesNeedPixelAwareness: false,
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      ...FINAL_FALSE
    };
  }

  function readStructuralCarrier() {
    return getStructuralCarrier();
  }

  function getCanvasCarrier() {
    return getStructuralCarrier();
  }

  function getCarrierReceipt() {
    return getStructuralCarrier();
  }

  function getReceiptLight() {
    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    const receipt = {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      diagnosticBridgeReceipt: getDiagnosticBridgeReceipt(),
      expressionHubReceipt: getExpressionHubReceipt(),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();

    return [
      "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("baselineContract", r.baselineContract),
      line("baselineReceipt", r.baselineReceipt),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "CANVAS_HUB",
      line("canvasHubLoaded", r.canvasHubLoaded),
      line("canvasHubActive", r.canvasHubActive),
      line("threeFileStretchActive", r.threeFileStretchActive),
      line("threeFileAwarenessOwner", r.threeFileAwarenessOwner),
      line("otherFilesNeedPixelAwareness", r.otherFilesNeedPixelAwareness),
      line("roleSeparationPreserved", r.roleSeparationPreserved),
      line("noRoleCollapse", r.noRoleCollapse),
      "",
      "ROUTE_CONDUCTOR",
      line("currentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("lineageRouteConductorContract", LINEAGE_ROUTE_CONDUCTOR_CONTRACT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorV95Recognized", r.routeConductorV95Recognized),
      line("routeConductorV94LineageAccepted", r.routeConductorV94LineageAccepted),
      line("expectedContractDriftFalsePositive", r.expectedContractDriftFalsePositive),
      "",
      "MOUNT",
      line("globeStageFound", r.globeStageFound),
      line("globeStageSelector", r.globeStageSelector),
      line("globeStageRectNonzero", r.globeStageRectNonzero),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasMountRectNonzero", r.canvasMountRectNonzero),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasCreated", r.canvasCreated),
      line("canvasReused", r.canvasReused),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasAttributeWidth", r.canvasAttributeWidth),
      line("canvasAttributeHeight", r.canvasAttributeHeight),
      line("canvasContext2dReady", r.canvasContext2dReady),
      "",
      "COMPOSITE",
      line("compositeDetected", r.compositeDetected),
      line("compositeDrawMethodAvailable", r.compositeDrawMethodAvailable),
      line("compositeDrawMethod", r.compositeDrawMethod),
      line("compositeDrawAttempted", r.compositeDrawAttempted),
      line("compositeDrawComplete", r.compositeDrawComplete),
      line("compositeDrawError", r.compositeDrawError),
      "",
      "HEX_FOUR_PAIR_AUTHORITY",
      line("hexFourPairAuthorityDetected", r.hexFourPairAuthorityDetected),
      line("hexFourPairAuthorityContractRecognized", r.hexFourPairAuthorityContractRecognized),
      line("hexFourPairWideProbeAvailable", r.hexFourPairWideProbeAvailable),
      line("hexFourPairEveryPixelHasFourPairSet", r.hexFourPairEveryPixelHasFourPairSet),
      line("hexFourPairBodyBound", r.hexFourPairBodyBound),
      line("hexFourPairAllowedToFloat", r.hexFourPairAllowedToFloat),
      "",
      "HEX_SURFACE_RENDERER",
      line("hexSurfaceRendererDetected", r.hexSurfaceRendererDetected),
      line("hexSurfaceRendererContractRecognized", r.hexSurfaceRendererContractRecognized),
      line("hexSurfaceRendererDrawMethodAvailable", r.hexSurfaceRendererDrawMethodAvailable),
      line("hexSurfaceRendererDrawMethod", r.hexSurfaceRendererDrawMethod),
      line("hexSurfaceRendererDrawAttempted", r.hexSurfaceRendererDrawAttempted),
      line("hexSurfaceRendererDrawComplete", r.hexSurfaceRendererDrawComplete),
      line("hexSurfaceRendererDrawError", r.hexSurfaceRendererDrawError),
      "",
      "VISIBLE_PROOF",
      line("canvasDrawAttempted", r.canvasDrawAttempted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofReason", r.visiblePlanetProofReason),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("downstreamReleaseClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasBaselineReceipt", BASELINE_RECEIPT);

    setDataset("hearthCanvasHubLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasThreeFileStretchActive", "true");
    setDataset("hearthCanvasThreeFileAwarenessOwner", "Canvas Hub");
    setDataset("hearthCanvasOtherFilesNeedPixelAwareness", "false");
    setDataset("hearthCanvasRoleSeparationPreserved", "true");
    setDataset("hearthCanvasNoRoleCollapse", "true");

    setDataset("hearthCanvasCurrentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasCurrentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthCanvasLineageRouteConductorContract", LINEAGE_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasRouteConductorContractKnown", String(state.routeConductorContractKnown));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthCanvasRouteConductorCurrentRecognized", String(state.routeConductorCurrentRecognized));
    setDataset("hearthCanvasRouteConductorV95Recognized", String(state.routeConductorV95Recognized));
    setDataset("hearthCanvasRouteConductorV94LineageAccepted", String(state.routeConductorV94LineageAccepted));
    setDataset("hearthCanvasExpectedContractDriftFalsePositive", "true");

    setDataset("hearthCanvasGlobeStageFound", String(state.globeStageFound));
    setDataset("hearthCanvasGlobeStageSelector", state.globeStageSelector);
    setDataset("hearthCanvasGlobeStageRectNonzero", String(state.globeStageRectNonzero));
    setDataset("hearthCanvasMountAttempted", String(state.canvasMountAttempted));
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasMountRectNonzero", String(state.canvasMountRectNonzero));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasReused", String(state.canvasReused));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasAttributeWidth", String(state.canvasAttributeWidth));
    setDataset("hearthCanvasAttributeHeight", String(state.canvasAttributeHeight));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasDrawAttempted", String(state.canvasDrawAttempted));
    setDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));

    setDataset("hearthCanvasCompositeDetected", String(state.compositeDetected));
    setDataset("hearthCanvasCompositeContract", state.compositeContract);
    setDataset("hearthCanvasCompositeDrawMethodAvailable", String(state.compositeDrawMethodAvailable));
    setDataset("hearthCanvasCompositeDrawAttempted", String(state.compositeDrawAttempted));
    setDataset("hearthCanvasCompositeDrawComplete", String(state.compositeDrawComplete));

    setDataset("hearthCanvasHexFourPairAuthorityDetected", String(state.hexFourPairAuthorityDetected));
    setDataset("hearthCanvasHexFourPairAuthorityContractRecognized", String(state.hexFourPairAuthorityContractRecognized));
    setDataset("hearthCanvasHexFourPairWideProbeAvailable", String(state.hexFourPairWideProbeAvailable));
    setDataset("hearthCanvasHexFourPairEveryPixelHasFourPairSet", String(state.hexFourPairEveryPixelHasFourPairSet));
    setDataset("hearthCanvasHexFourPairBodyBound", String(state.hexFourPairBodyBound));
    setDataset("hearthCanvasHexFourPairAllowedToFloat", String(state.hexFourPairAllowedToFloat));

    setDataset("hearthCanvasHexSurfaceRendererDetected", String(state.hexSurfaceRendererDetected));
    setDataset("hearthCanvasHexSurfaceRendererContractRecognized", String(state.hexSurfaceRendererContractRecognized));
    setDataset("hearthCanvasHexSurfaceRendererDrawMethodAvailable", String(state.hexSurfaceRendererDrawMethodAvailable));
    setDataset("hearthCanvasHexSurfaceRendererDrawAttempted", String(state.hexSurfaceRendererDrawAttempted));
    setDataset("hearthCanvasHexSurfaceRendererDrawComplete", String(state.hexSurfaceRendererDrawComplete));

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasDomVisiblePlanetProofReady", String(state.domVisiblePlanetProofReady));
    setDataset("hearthCanvasStageMountDomProofReady", String(state.stageMountDomProofReady));

    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13EligibleForCanvas", "false");
    setDataset("hearthCanvasF13ClaimedByCanvasParent", "false");
    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasFinalCompletionLatched", "false");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasHub = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasDiagnosticBridge = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasDiagnosticBridge = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const hubReceipt = getExpressionHubReceipt();
    const bridge = getDiagnosticBridgeReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_HUB_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_RECEIPT = bridge;
    root.HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12 = full;

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasHubReceipt = full;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasExpressionHubReceipt = hubReceipt;
    hearth.canvasFingerManagerReceipt = hubReceipt;
    hearth.canvasDiagnosticBridgeReceipt = bridge;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasHubReceipt = full;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = hubReceipt;
    lab.hearthCanvasFingerManagerReceipt = hubReceipt;
    lab.hearthCanvasDiagnosticBridgeReceipt = bridge;

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function notifyRouteConductor() {
    const summary = getCanvasStationSummary();

    const candidates = [
      readPath("HEARTH_ROUTE_CONDUCTOR"),
      readPath("HEARTH.routeConductor"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION"),
      readPath("HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion"),
      readPath("DEXTER_LAB.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion")
    ];

    const methods = [
      "receiveCanvasHubSummary",
      "receiveCanvasExpressionHubSummary",
      "receiveVisibleGlobeProofSummary",
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasParentSummary",
      "reconcileCanvas",
      "refresh"
    ];

    for (const target of candidates) {
      if (!target || !isObject(target)) continue;

      for (const method of methods) {
        if (!isFunction(target[method])) continue;

        const result = safeInvoke(target, method, [clonePlain(summary)]);
        if (result.ok) {
          state.routeConductorNotified = true;
          state.routeConductorNotifyMethod = method;
          state.routeConductorNotificationError = "";
          return true;
        }

        state.routeConductorNotificationError = result.error;
      }
    }

    state.routeConductorNotified = false;
    state.routeConductorNotifyMethod = "NONE";
    return false;
  }

  function updateDatasetAndReceipt() {
    refreshState();
    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function bootAudit(options = {}) {
    state.timestamp = nowIso();

    initializeFingerRegistry();
    updateDataset();
    publishGlobals();

    refreshState();
    drawVisibleExpression(options && options.reason ? options.reason : "boot-audit");
    notifyRouteConductor();

    state.bootAuditComplete = true;

    record("CANVAS_HUB_THREE_FILE_STRETCH_BOOT_AUDIT_COMPLETE", {
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      compositeDetected: state.compositeDetected,
      compositeDrawComplete: state.compositeDrawComplete,
      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    });

    ensureSupportFilesLoaded();

    return updateDatasetAndReceipt();
  }

  function boot(options = {}) {
    return bootAudit(options || {});
  }

  function init(options = {}) {
    return bootAudit(options || {});
  }

  function start(options = {}) {
    return bootAudit(options || {});
  }

  function mount(options = {}) {
    return bootAudit(options || {});
  }

  function drawBaseGlobe() {
    return drawVisibleExpression("compatibility-drawBaseGlobe");
  }

  function mountBaseGlobeCarrier() {
    const target = ensureCanvas();
    return target ? target.canvas : null;
  }

  function recomputeAll() {
    return refreshState();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    LEGACY_ROUTE_CONDUCTOR_CONTRACT,
    LEGACY_ROUTE_CONDUCTOR_RECEIPT,
    HEX_FOUR_PAIR_CONTRACT,
    HEX_SURFACE_CONTRACT,
    FILE,
    TARGET_FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    ROUTE_FILE,
    INDEX_FILE,
    COMPOSITE_FILE,
    HEX_FOUR_PAIR_FILE,
    HEX_SURFACE_FILE,

    BASE_FINGER_FILES,
    EXPANSION_FINGER_FILES,
    FINGER_FILES,
    BASE_FINGER_SEQUENCE,
    EXPANSION_FINGER_SEQUENCE,
    FINGER_SEQUENCE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: state.role,

    boot,
    init,
    start,
    mount,
    bootAudit,

    ensureCanvas,
    drawVisibleExpression,
    mountBaseGlobeCarrier,
    drawBaseGlobe,

    readRouteConductorProfile,
    readRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,

    detectComposite,
    detectHexFourPairAuthority,
    detectHexSurfaceRenderer,
    refreshSupportDetections,
    ensureSupportFilesLoaded,

    receiveChildPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,

    initializeFingerRegistry,
    normalizeFingerKey,
    inferFingerKeyFromPacket,
    readFingerAuthority,
    scanFinger,
    scanAllFingers,
    receiveFingerPacket,
    receiveExpressionFingerPacket,
    receiveFingerReceipt,
    receiveCanvasFingerPacket,
    receiveCanvasExpressionPacket,
    receiveCanvasFingerReceipt,
    recomputeFingerAggregation,
    getFingerRegistry,
    getFingerTrackStatus,

    getExpressionHubSummary,
    getExpressionHubReceipt,
    getCanvasStationSummary,
    getCanvasStationReceipt,
    getCanvasStationReceiptLight,
    getDiagnosticBridgeSummary,
    getDiagnosticBridgeReceipt,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    updateDatasetAndReceipt,
    publishGlobals,
    notifyRouteConductor,
    recomputeAll,
    refreshState,
    resolveF13Gap,

    supportsCanvasHub: true,
    supportsCanvasLocalStation: true,
    supportsExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsThreeFileStretch: true,
    supportsCompositePreferredPath: true,
    supportsHexSurfaceSupportPath: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasHubIdentity: true,
    ownsCanvasParentIdentity: true,
    ownsExpressionHub: true,
    ownsFingerManager: true,
    ownsFingerRegistry: true,
    ownsFingerIntake: true,
    ownsVisibleCanvasPlacement: true,
    ownsThreeFileAwareness: true,
    ownsFinalPlanetTruth: false,
    ownsCompositeTruth: false,
    ownsHexFourPairTruth: false,
    ownsHexSurfaceTruth: false,
    ownsFingerTruth: false,
    ownsRouteConductorSwitching: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();
    initializeFingerRegistry();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => bootAudit({ reason: "dom-content-loaded" }), { once: true });
      } else {
        bootAudit({ reason: "document-ready" });
      }
    } else {
      bootAudit({ reason: "no-document-runtime" });
    }
  } catch (error) {
    recordError("CANVAS_HUB_THREE_FILE_STRETCH_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
