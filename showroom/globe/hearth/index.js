// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4
// Internal controlled renewal:
// HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT_TNT_v5_4_3
// Full-file replacement.
// Index JS / passive front-end button authority / receipt corridor / downstream observer only.
// Served CONTRACT intentionally remains v5_4 to preserve HTML/EAST diagnostic expectations.
// Supersedes internally:
// - HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2
// Correction:
// - Retires active visible-expression chain loading from index.js.
// - Does not inject Hex, Surface, Canvas, Controls, diagnostic rail, or source-stack scripts.
// - Does not boot Canvas.
// - Does not call route-conductor release/admission methods.
// - Button presses are non-ignition events: UI action + receipt update only.
// - Route conductor remains the owner of control-file admission.
// - Canvas remains the owner of visible expression reception/render.
// Preserves:
// - visible Hearth front-end button and anchor functionality
// - native navigation for diagnostic and portal anchors
// - direct button binding
// - duplicate activation protection
// - receipt toggle
// - copy diagnostic
// - inspect/diagnostic dock
// - cockpit expansion
// - emergency diagnostic anchor
// - passive downstream/global observation receipts
// - F13 held
// - F21 held
// - ready text held
// - generated image false
// - GraphicBox false
// - WebGL false
// - visual pass false
// Does not own:
// - canvas drawing
// - hex truth
// - hex surface truth
// - controls admission
// - route conductor systemic authority
// - diagnostic child-chain authority
// - F13
// - F21
// - final visual pass
// - production repair beyond front-end button authority and passive receipt observation

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const RECEIPT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT_v5_4";

  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";
  const PREVIOUS_RENEWAL_CONTRACT = "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2";
  const PREVIOUS_RENEWAL_RECEIPT = "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_RECEIPT_v5_4_2";

  const RENEWAL_CONTRACT = "HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT_TNT_v5_4_3";
  const RENEWAL_RECEIPT = "HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT_RECEIPT_v5_4_3";
  const VERSION = "2026-06-04.hearth-index-js-passive-button-receipt-corridor-alignment-v5-4-3";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const PREVIOUS_HTML_CONTRACT = "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5";
  const BASELINE_HTML_CONTRACT = "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4";
  const FOUNDATION_HTML_CONTRACT = "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const CURRENT_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT_v9_7";

  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CONTROL_CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const CONTROL_RECEIPT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_HEX_FOUR_PAIR_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12"
  ]);

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    CURRENT_HTML_CONTRACT,
    PREVIOUS_HTML_CONTRACT,
    BASELINE_HTML_CONTRACT,
    FOUNDATION_HTML_CONTRACT,
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByIndex: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
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
    webGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    version: VERSION,

    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexFourPairAuthorityFile: HEX_FOUR_PAIR_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,

    role: "passive-front-end-button-authority-receipt-corridor",
    currentHtmlContract: CURRENT_HTML_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    baselineHtmlContract: BASELINE_HTML_CONTRACT,
    foundationHtmlContract: FOUNDATION_HTML_CONTRACT,
    observedHtmlContract: "UNKNOWN",
    currentHtmlContractRecognized: false,

    bootStarted: false,
    bootComplete: false,
    bootCount: 0,
    startedAt: "",
    updatedAt: "",

    passiveButtonCorridorActive: true,
    passiveReceiptCorridorActive: true,
    passiveDownstreamObserverActive: true,
    activeVisibleExpressionLoaderRetired: true,
    visibleExpressionChainLoaderBridgeRetired: true,
    noDynamicScriptInjection: true,
    canvasBootSuppressedByIndex: true,
    routeConductorAdmissionSuppressedByIndex: true,
    controlAdmissionSuppressedByIndex: true,

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    documentCaptureShieldActive: false,
    globalSuppressionAvoided: true,
    windowDocumentCaptureSuppressionRetired: false,
    nativeAnchorDefaultPreserved: true,
    directButtonBindingActive: true,
    delegatedButtonBindingActive: true,
    detailsSummaryBindingActive: true,
    duplicateActivationProtectionActive: true,

    pageReceiptTargetBindingActive: true,
    pageReceiptAvailable: false,
    activeReceiptSource: "INDEX_FALLBACK",
    copiedReceiptSource: "NONE",
    shownReceiptSource: "NONE",
    receiptVisible: false,

    downstreamObservationAttempted: false,
    downstreamObservationCount: 0,
    downstreamObservationLastReason: "NOT_RUN",

    routeConductorObserved: false,
    routeConductorContract: "UNKNOWN",
    routeConductorReceipt: "UNKNOWN",
    routeConductorContractRecognized: false,
    routeConductorOwnedByIndex: false,
    routeConductorLoadedByIndex: false,
    routeConductorHandoffByIndex: false,

    controlsObserved: false,
    controlsContract: "UNKNOWN",
    controlsReceipt: "UNKNOWN",
    controlsContractRecognized: false,
    controlsLoadedByIndex: false,
    controlsAdmittedByIndex: false,

    hexFourPairAuthorityObserved: false,
    hexFourPairAuthorityContract: "UNKNOWN",
    hexFourPairAuthorityContractRecognized: false,
    hexFourPairAuthorityObservationStatus: "PASSIVE_WAITING",

    hexSurfaceObserved: false,
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceContractRecognized: false,
    hexSurfaceObservationStatus: "PASSIVE_WAITING",

    canvasHubObserved: false,
    canvasHubContract: "UNKNOWN",
    canvasHubContractRecognized: false,
    canvasHubObservationStatus: "PASSIVE_WAITING",
    canvasLoadedByIndex: false,
    canvasStartedByIndex: false,
    canvasBootedByIndex: false,
    canvasBootAttempted: false,
    canvasBootMethod: "NONE",
    canvasBootResult: "PASSIVE_NOT_ATTEMPTED",
    canvasBootError: "",

    visibleExpressionChainObserved: false,
    visibleExpressionChainLoadStarted: false,
    visibleExpressionChainLoadComplete: false,
    visibleExpressionChainLoadHeld: false,
    visibleExpressionChainLoadHeldReason: "PASSIVE_CORRIDOR_DOES_NOT_LOAD_ASSETS",
    visibleExpressionChainLoadAttemptCount: 0,
    visibleExpressionChainLoadCompleteCount: 0,
    visibleExpressionChainLoadLastReason: "PASSIVE_OBSERVE_ONLY",
    visibleExpressionChainLoadLastError: "",
    visibleExpressionChainLoadPromiseActive: false,

    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    copyDiagnosticBound: false,
    toggleReceiptBound: false,
    diagnosticAnchorBound: false,
    inspectPlanetBound: false,
    expandCockpitBound: false,
    showDiagnosticBound: false,
    portalAnchorsBound: false,
    detailsDrawersBound: false,

    copyDiagnosticCount: 0,
    toggleReceiptCount: 0,
    diagnosticAnchorCount: 0,
    inspectPlanetCount: 0,
    showDiagnosticCount: 0,
    expandCockpitCount: 0,
    portalNavigationCount: 0,
    drawerToggleCount: 0,

    lastAction: "NOT_RUN",
    lastActionAt: "",
    lastError: "",
    inspectModeActive: false,
    cockpitMode: "diagnostic-dock",

    firstFailedCoordinate: "PASSIVE_INDEX_CORRIDOR_NO_DOWNSTREAM_FAILURE_CLAIM",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextAction: "READ_ROUTE_CONDUCTOR_OR_CANVAS_RECEIPT_IF_GLOBE_REMAINS_ABSENT",
    postgameStatus: "INDEX_PASSIVE_BUTTON_RECEIPT_CORRIDOR_READY",

    events: [],
    errors: [],

    ...FINAL_FALSE
  };

  const refs = {
    html: null,
    body: null,
    stage: null,
    mount: null,
    cockpit: null,
    receiptPanel: null,
    receiptText: null,
    routeStatus: null,
    copyButton: null,
    toggleReceiptButton: null,
    inspectButton: null,
    collapseButton: null,
    showDiagnosticTab: null,
    diagnosticAnchors: [],
    portalLinks: [],
    summaries: [],
    stageLabel: null,
    heartbeatText: null,
    latestEvent: null,
    progressFill: null,
    progressPercent: null,
    htmlReceiptTargets: []
  };

  let lastActivationKey = "";
  let lastActivationAt = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    try {
      return Date.now();
    } catch (_error) {
      return new Date().getTime();
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function toElement(value) {
    if (isElement(value)) return value;
    if (value && value.parentElement) return value.parentElement;
    return null;
  }

  function qs(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qsa(selector) {
    if (!doc) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function closest(target, selector) {
    const element = toElement(target);
    if (!element || !isFunction(element.closest)) return null;
    try {
      return element.closest(selector);
    } catch (_error) {
      return null;
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
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
      event: safeString(event, "HEARTH_INDEX_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimArray(state.events, 100);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_INDEX_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 80);
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

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setRootDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setText(node, text) {
    if (!node) return;
    node.textContent = safeString(text);
  }

  function readDirectContract(value) {
    if (!isObject(value)) return "UNKNOWN";

    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.sourceContract ||
      value.expectedContract ||
      "UNKNOWN",
      "UNKNOWN"
    );
  }

  function readDirectReceipt(value) {
    if (!isObject(value)) return "UNKNOWN";

    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.sourceReceipt ||
      value.expectedReceipt ||
      "UNKNOWN",
      "UNKNOWN"
    );
  }

  function contractRecognized(actual, accepted) {
    const a = safeString(actual, "");
    if (!a || a === "UNKNOWN") return false;
    if (Array.isArray(accepted)) return accepted.includes(a);
    return a === safeString(accepted, "");
  }

  function getKnownReceiptObject(names) {
    for (const name of names) {
      const candidate = readPath(name);
      if (candidate && isObject(candidate)) return candidate;
    }
    return null;
  }

  function resolveRouteConductor() {
    return (
      readPath("HEARTH_ROUTE_CONDUCTOR") ||
      readPath("HEARTH.routeConductor") ||
      readPath("DEXTER_LAB.hearthRouteConductor") ||
      readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION") ||
      readPath("HEARTH.routeConductorControlHandshakeIntegration") ||
      readPath("DEXTER_LAB.hearthRouteConductorControlHandshakeIntegration") ||
      null
    );
  }

  function resolveControls() {
    return (
      readPath("HEARTH_CONTROLS") ||
      readPath("HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE") ||
      readPath("HEARTH.controls") ||
      readPath("HEARTH.hearthControls") ||
      readPath("DEXTER_LAB.hearthControls") ||
      null
    );
  }

  function resolveHexFourPairAuthority() {
    return (
      readPath("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY") ||
      readPath("HEARTH_HEX_FOUR_PAIR_AUTHORITY") ||
      readPath("HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY") ||
      readPath("HEARTH_HEX_HANDSHAKE_AUTHORITY") ||
      readPath("HEARTH_HEXGRID_AUTHORITY") ||
      readPath("HEARTH.hexFourPairAuthority") ||
      readPath("HEARTH.hexAuthority") ||
      null
    );
  }

  function resolveHexSurface() {
    return (
      readPath("HEARTH_HEX_SURFACE") ||
      readPath("HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER") ||
      readPath("HEARTH.hexSurface") ||
      readPath("HEARTH.hexSurfaceConsumer") ||
      null
    );
  }

  function resolveCanvasHub() {
    return (
      readPath("HEARTH_CANVAS") ||
      readPath("HEARTH_CANVAS_PARENT") ||
      readPath("HEARTH_CANVAS_AUTHORITY") ||
      readPath("HEARTH_CANVAS_HUB") ||
      readPath("HEARTH_CANVAS_LOCAL_STATION") ||
      readPath("HEARTH_CANVAS_STATION") ||
      readPath("HEARTH_CANVAS_EXPRESSION_HUB") ||
      readPath("HEARTH_CANVAS_FINGER_MANAGER") ||
      readPath("HEARTH.canvas") ||
      readPath("HEARTH.canvasParent") ||
      readPath("HEARTH.canvasHub") ||
      readPath("HEARTH.canvasLocalStation") ||
      readPath("HEARTH.canvasStation") ||
      readPath("HEARTH.canvasExpressionHub") ||
      readPath("DEXTER_LAB.hearthCanvas") ||
      readPath("DEXTER_LAB.hearthCanvasParent") ||
      readPath("DEXTER_LAB.hearthCanvasHub") ||
      readPath("DEXTER_LAB.hearthCanvasExpressionHub") ||
      null
    );
  }

  function cleanReceiptText(value) {
    return safeString(value)
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/^\s+|\s+$/g, "");
  }

  function firstReceiptLine(value) {
    const text = cleanReceiptText(value);
    const lines = text.split("\n").map((entry) => entry.trim()).filter(Boolean);
    return lines.length ? lines[0] : "";
  }

  function isIndexReceiptText(value) {
    const text = cleanReceiptText(value);
    const first = firstReceiptLine(text);

    return (
      first === "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT" ||
      first === RECEIPT ||
      (text.includes(`contract=${CONTRACT}`) && text.includes(`file=${FILE}`))
    );
  }

  function isPageReceiptText(value) {
    const text = cleanReceiptText(value);
    const first = firstReceiptLine(text);

    if (!text || isIndexReceiptText(text)) return false;

    return (
      first.startsWith("HEARTH_HTML_") ||
      text.includes("target=/showroom/globe/hearth/index.html") ||
      text.includes("pageContext=Planet Factory · Mirrorland Formation Site") ||
      text.includes("visiblePlanetMountRequired=true") ||
      text.includes("htmlOwnsPublicShell=true") ||
      text.includes("routeConductorOwnsControlFileAdmission=true")
    );
  }

  function nodeReceiptText(node) {
    if (!node) return "";

    try {
      if (node.tagName && node.tagName.toLowerCase() === "template" && node.content) {
        return cleanReceiptText(node.content.textContent || "");
      }
    } catch (_error) {}

    try {
      if (typeof node.value === "string") return cleanReceiptText(node.value);
    } catch (_error) {}

    try {
      return cleanReceiptText(node.textContent || "");
    } catch (_error) {
      return "";
    }
  }

  function uniqueElements(list) {
    const output = [];
    const seen = typeof Set !== "undefined" ? new Set() : null;

    for (const item of list) {
      if (!item) continue;

      if (seen) {
        if (seen.has(item)) continue;
        seen.add(item);
      } else if (output.includes(item)) {
        continue;
      }

      output.push(item);
    }

    return output;
  }

  function refreshRefs() {
    refs.html = doc ? doc.documentElement : null;
    refs.body = doc ? doc.body : null;

    refs.stage = qs("#hearthGlobeStage") || qs("[data-hearth-globe-stage]");
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount]");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit]");

    refs.receiptPanel = qs("#hearthReceiptPanel") || qs("[data-hearth-receipt-box]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.routeStatus = qs("#hearth-route-status") || qs("[data-hearth-route-status]");

    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.toggleReceiptButton = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showDiagnosticTab =
      qs("[data-hearth-south-show-diagnostic-tab]") ||
      qs("[data-hearth-east-show-diagnostic-tab]") ||
      qs("[data-hearth-show-diagnostic-tab]");

    refs.diagnosticAnchors = qsa("a[href='/showroom/globe/hearth/diagnostic/'], a[data-hearth-diagnostic-rail-native-anchor], a[data-hearth-diagnostic-rail-field]");
    refs.portalLinks = qsa("#hearthMapPortal a[href], [data-hearth-map-portal] a[href], .portal-link[href]");
    refs.summaries = qsa("details.drawer > summary, details > summary");

    refs.stageLabel = qs("[data-hearth-stage-label]");
    refs.heartbeatText = qs("[data-hearth-heartbeat-text]");
    refs.latestEvent = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");

    refs.htmlReceiptTargets = uniqueElements([
      qs("#hearth-html-route-conductor-owns-control-handshake-shell-receipt"),
      qs("#hearth-html-control-handshake-route-shell-integration-receipt"),
      qs("#hearth-html-full-planet-visibility-downstream-shell-alignment-receipt"),
      qs("#hearth-html-planet-factory-mirrorland-public-shell-receipt"),
      ...qsa("template[data-hearth-html-receipt]"),
      ...qsa("template[data-route-receipt]"),
      ...qsa("[data-hearth-html-receipt]"),
      ...qsa("[data-route-receipt]"),
      refs.routeStatus
    ]);

    return refs;
  }

  function readHtmlContract() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return "UNKNOWN";
    return safeString(
      doc.documentElement.dataset.contract ||
      doc.documentElement.dataset.hearthHtmlContract ||
      doc.documentElement.dataset.hearthShellContract ||
      "UNKNOWN",
      "UNKNOWN"
    );
  }

  function htmlContractRecognized(contract) {
    return ACCEPTED_HTML_CONTRACTS.includes(safeString(contract));
  }

  function composeDatasetReceipt() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return "";

    const dataset = doc.documentElement.dataset;
    const contract = dataset.contract || dataset.hearthHtmlContract || dataset.hearthShellContract || "";

    if (!contract || !safeString(contract).startsWith("HEARTH_HTML_")) return "";

    return [
      "HEARTH_HTML_DATASET_RECEIPT",
      line("contract", contract),
      line("receipt", dataset.receipt || ""),
      line("previousContract", dataset.previousContract || ""),
      line("baselineContract", dataset.baselineContract || ""),
      line("foundationContract", dataset.foundationContract || ""),
      line("route", dataset.route || ROUTE),
      line("target", HTML_FILE),
      line("pageAlias", dataset.pageAlias || "Hearth"),
      line("pageContext", dataset.pageContext || "UNKNOWN"),
      line("planetFactoryPage", dataset.planetFactoryPage || "UNKNOWN"),
      line("planetEnginePage", dataset.planetEnginePage || "UNKNOWN"),
      line("worldFormationStandardPage", dataset.worldFormationStandardPage || "UNKNOWN"),
      line("fullPlanetVisibilityActive", dataset.fullPlanetVisibilityActive || "UNKNOWN"),
      line("visiblePlanetStagePrimary", dataset.visiblePlanetStagePrimary || "UNKNOWN"),
      line("visiblePlanetMountRequired", dataset.visiblePlanetMountRequired || "UNKNOWN"),
      line("mount", "#hearthCanvasMount"),
      line("globeStage", "#hearthGlobeStage"),
      line("htmlOwnsPublicShell", dataset.htmlOwnsPublicShell || "UNKNOWN"),
      line("htmlOwnsPlanetMount", dataset.htmlOwnsPlanetMount || "UNKNOWN"),
      line("htmlOwnsRuntime", dataset.htmlOwnsRuntime || "false"),
      line("htmlOwnsCanvasDrawing", dataset.htmlOwnsCanvasDrawing || "false"),
      line("htmlOwnsCanvasTruth", dataset.htmlOwnsCanvasTruth || "false"),
      line("htmlOwnsRouteConductor", dataset.htmlOwnsRouteConductor || "false"),
      line("htmlOwnsControlHandshakeTruth", dataset.htmlOwnsControlHandshakeTruth || "false"),
      line("htmlLoadsIndex", dataset.htmlLoadsIndex || "UNKNOWN"),
      line("htmlLoadsRouteConductor", dataset.htmlLoadsRouteConductor || "UNKNOWN"),
      line("htmlLoadsControlFile", dataset.htmlLoadsControlFile || "false"),
      line("routeConductorOwnsControlFileAdmission", dataset.routeConductorOwnsControlFileAdmission || "UNKNOWN"),
      line("routeConductorOwnsControlHandshakeTruth", dataset.routeConductorOwnsControlHandshakeTruth || "UNKNOWN"),
      line("controlDirectLoadSuppressedByHtml", dataset.controlDirectLoadSuppressedByHtml || "UNKNOWN"),
      line("expectedIndexJsContract", dataset.expectedIndexJsContract || CONTRACT),
      line("expectedRouteConductorContract", dataset.expectedRouteConductorContract || CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("expectedControlFile", dataset.expectedControlFile || CONTROL_FILE),
      line("diagnosticRailRoute", dataset.diagnosticRailRoute || DIAGNOSTIC_ROUTE),
      line("receiptPanel", dataset.receiptPanelSelector || "#hearthReceiptPanel"),
      line("receiptText", dataset.receiptTextSelector || "[data-hearth-receipt-text]"),
      line("f13Claimed", dataset.f13Claimed || "false"),
      line("f21Claimed", dataset.f21Claimed || "false"),
      line("readyTextClaimed", dataset.readyTextClaimed || "false"),
      line("visualPassClaimed", dataset.visualPassClaimed || "false"),
      line("generatedImage", dataset.generatedImage || "false"),
      line("graphicBox", dataset.graphicBox || "false"),
      line("webGL", dataset.webgl || dataset.webGL || "false")
    ].join("\n");
  }

  function resolvePageReceiptText() {
    refreshRefs();

    for (const target of refs.htmlReceiptTargets) {
      const text = nodeReceiptText(target);
      if (!isPageReceiptText(text)) continue;

      return {
        ok: true,
        source: target && target.id
          ? `HTML_RECEIPT_TARGET:#${target.id}`
          : "HTML_RECEIPT_TARGET",
        text
      };
    }

    const datasetReceipt = composeDatasetReceipt();

    if (isPageReceiptText(datasetReceipt)) {
      return {
        ok: true,
        source: "HTML_DATASET_RECEIPT",
        text: datasetReceipt
      };
    }

    return {
      ok: false,
      source: "INDEX_FALLBACK",
      text: ""
    };
  }

  function resolveActiveReceiptText() {
    const page = resolvePageReceiptText();

    if (page.ok && page.text) {
      state.pageReceiptAvailable = true;
      state.activeReceiptSource = page.source;
      return page;
    }

    const fallback = {
      ok: true,
      source: "INDEX_FALLBACK",
      text: getIndexReceiptText()
    };

    state.pageReceiptAvailable = false;
    state.activeReceiptSource = fallback.source;
    return fallback;
  }

  function observeAuthority(label, resolver, acceptedContracts, receiptNames) {
    const authority = resolver();
    const receiptObject = getKnownReceiptObject(receiptNames || []);
    const contract =
      readDirectContract(authority) !== "UNKNOWN"
        ? readDirectContract(authority)
        : readDirectContract(receiptObject);
    const receipt =
      readDirectReceipt(authority) !== "UNKNOWN"
        ? readDirectReceipt(authority)
        : readDirectReceipt(receiptObject);

    return {
      label,
      observed: Boolean(authority || receiptObject),
      contract,
      receipt,
      recognized: contractRecognized(contract, acceptedContracts),
      status: authority || receiptObject ? "OBSERVED_PASSIVELY" : "PASSIVE_WAITING"
    };
  }

  function refreshVisibleExpressionChainState(reason = "passive-observe") {
    state.downstreamObservationAttempted = true;
    state.downstreamObservationCount += 1;
    state.downstreamObservationLastReason = safeString(reason, "passive-observe");

    const route = observeAuthority(
      "routeConductor",
      resolveRouteConductor,
      CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      ["HEARTH_ROUTE_CONDUCTOR_RECEIPT", "HEARTH.routeConductorReceipt"]
    );

    state.routeConductorObserved = route.observed;
    state.routeConductorContract = route.contract;
    state.routeConductorReceipt = route.receipt;
    state.routeConductorContractRecognized = route.recognized;

    const controls = observeAuthority(
      "controls",
      resolveControls,
      CONTROL_CONTRACT,
      ["HEARTH_CONTROLS_RECEIPT", "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT", "HEARTH.controlsReceipt"]
    );

    state.controlsObserved = controls.observed;
    state.controlsContract = controls.contract;
    state.controlsReceipt = controls.receipt;
    state.controlsContractRecognized = controls.recognized;

    const hexFourPair = observeAuthority(
      "hexFourPairAuthority",
      resolveHexFourPairAuthority,
      EXPECTED_HEX_FOUR_PAIR_CONTRACT,
      ["HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT", "HEARTH_HEX_FOUR_PAIR_RECEIPT"]
    );

    state.hexFourPairAuthorityObserved = hexFourPair.observed;
    state.hexFourPairAuthorityContract = hexFourPair.contract;
    state.hexFourPairAuthorityContractRecognized = hexFourPair.recognized;
    state.hexFourPairAuthorityObservationStatus = hexFourPair.status;

    const hexSurface = observeAuthority(
      "hexSurface",
      resolveHexSurface,
      EXPECTED_HEX_SURFACE_CONTRACT,
      ["HEARTH_HEX_SURFACE_RECEIPT", "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT"]
    );

    state.hexSurfaceObserved = hexSurface.observed;
    state.hexSurfaceContract = hexSurface.contract;
    state.hexSurfaceContractRecognized = hexSurface.recognized;
    state.hexSurfaceObservationStatus = hexSurface.status;

    const canvas = observeAuthority(
      "canvasHub",
      resolveCanvasHub,
      ACCEPTED_CANVAS_CONTRACTS,
      ["HEARTH_CANVAS_RECEIPT", "HEARTH_CANVAS_HUB_RECEIPT", "HEARTH_CANVAS_STATION_RECEIPT"]
    );

    state.canvasHubObserved = canvas.observed;
    state.canvasHubContract = canvas.contract;
    state.canvasHubContractRecognized = canvas.recognized;
    state.canvasHubObservationStatus = canvas.status;

    state.visibleExpressionChainObserved = Boolean(
      state.hexFourPairAuthorityObserved ||
      state.hexSurfaceObserved ||
      state.canvasHubObserved
    );

    state.visibleExpressionChainLoadComplete = Boolean(
      state.hexFourPairAuthorityObserved &&
      state.hexSurfaceObserved &&
      state.canvasHubObserved
    );

    state.visibleExpressionChainLoadCompleteCount = state.visibleExpressionChainLoadComplete ? 1 : 0;
    state.visibleExpressionChainLoadStarted = false;
    state.visibleExpressionChainLoadHeld = false;
    state.visibleExpressionChainLoadHeldReason = "PASSIVE_CORRIDOR_DOES_NOT_LOAD_ASSETS";
    state.visibleExpressionChainLoadLastReason = "PASSIVE_OBSERVE_ONLY";
    state.visibleExpressionChainLoadLastError = "";

    if (state.canvasHubObserved) {
      state.firstFailedCoordinate = "PASSIVE_INDEX_CORRIDOR_CLEAR_CANVAS_OBSERVED";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "READ_CANVAS_OR_ROUTE_CONDUCTOR_RECEIPT_IF_VISIBLE_GLOBE_REMAINS_ABSENT";
      state.postgameStatus = "INDEX_PASSIVE_CORRIDOR_CANVAS_OBSERVED";
    } else if (state.routeConductorObserved) {
      state.firstFailedCoordinate = "CANVAS_HUB_NOT_OBSERVED_BY_PASSIVE_INDEX";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "AUDIT_ROUTE_CONDUCTOR_CANVAS_ADMISSION_OR_CANVAS_PUBLICATION";
      state.postgameStatus = "INDEX_PASSIVE_CORRIDOR_ROUTE_CONDUCTOR_OBSERVED_CANVAS_WAITING";
    } else {
      state.firstFailedCoordinate = "ROUTE_CONDUCTOR_NOT_OBSERVED_BY_PASSIVE_INDEX";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_JS_ROUTE_CONDUCTOR_LOAD";
      state.postgameStatus = "INDEX_PASSIVE_CORRIDOR_WAITING_ROUTE_CONDUCTOR";
    }

    publishDataset();
    return getVisibleExpressionChainReceipt();
  }

  function startVisibleExpressionChainBridge(reason = "passive-observe") {
    record("VISIBLE_EXPRESSION_CHAIN_ACTIVE_LOADING_RETIRED", {
      reason,
      passiveObserverOnly: true,
      noDynamicScriptInjection: true,
      canvasBootSuppressedByIndex: true,
      routeConductorAdmissionSuppressedByIndex: true
    });

    return Promise.resolve(refreshVisibleExpressionChainState(reason));
  }

  function loadVisibleExpressionChain(reason = "passive-observe") {
    return startVisibleExpressionChainBridge(reason);
  }

  function callCanvasHubPublicApi(reason = "passive-observe") {
    state.canvasBootAttempted = false;
    state.canvasBootMethod = "NONE";
    state.canvasBootResult = "PASSIVE_NOT_ATTEMPTED";
    state.canvasBootError = "";
    record("CANVAS_PUBLIC_API_CALL_SUPPRESSED_BY_PASSIVE_INDEX", {
      reason,
      canvasBootSuppressedByIndex: true,
      indexOwnsCanvasDrawing: false
    });
    publishDataset();
    return state.canvasBootResult;
  }

  function injectControlAuthorityStyle() {
    if (!doc || !doc.head) return false;

    if (qs("style[data-hearth-index-passive-button-corridor-style]")) {
      return true;
    }

    const style = doc.createElement("style");
    style.setAttribute("data-hearth-index-passive-button-corridor-style", RENEWAL_CONTRACT);
    style.textContent = `
      [data-hearth-load-cockpit],
      #hearthLoadCockpit {
        z-index: 10020 !important;
        pointer-events: auto !important;
      }

      [data-hearth-load-cockpit] button,
      [data-hearth-load-cockpit] a,
      #hearthLoadCockpit button,
      #hearthLoadCockpit a,
      #hearthMapPortal a,
      [data-hearth-map-portal] a,
      details > summary,
      [data-hearth-south-show-diagnostic-tab],
      [data-hearth-east-show-diagnostic-tab],
      [data-hearth-show-diagnostic-tab],
      #hearthDiagnosticRailEmergencyAnchor {
        pointer-events: auto !important;
        touch-action: manipulation !important;
        user-select: auto !important;
        -webkit-user-select: auto !important;
      }

      #hearthCanvasMount[data-hearth-canvas-mount],
      #hearthCanvasMount,
      [data-hearth-canvas-mount] {
        position: relative;
        z-index: 2;
        min-height: 320px;
      }

      #hearthReceiptPanel[data-visible="true"],
      [data-hearth-receipt-box][data-visible="true"] {
        display: block !important;
        visibility: visible !important;
      }

      #hearthReceiptPanel[data-visible="false"],
      [data-hearth-receipt-box][data-visible="false"] {
        display: none !important;
      }

      #hearthDiagnosticRailEmergencyAnchor {
        pointer-events: auto !important;
        touch-action: manipulation !important;
      }
    `;

    doc.head.appendChild(style);
    return true;
  }

  function ensureEmergencyDiagnosticAnchor() {
    if (!doc || !doc.body) return null;

    let anchor = qs("#hearthDiagnosticRailEmergencyAnchor");
    if (anchor) return anchor;

    anchor = doc.createElement("a");
    anchor.id = "hearthDiagnosticRailEmergencyAnchor";
    anchor.href = DIAGNOSTIC_ROUTE;
    anchor.textContent = "Under the Hood";
    anchor.setAttribute("data-hearth-diagnostic-rail-native-anchor", "true");
    anchor.setAttribute("data-hearth-index-emergency-diagnostic-anchor", RENEWAL_CONTRACT);
    anchor.setAttribute("aria-label", "Open Hearth under-the-hood diagnostic bay");
    doc.body.appendChild(anchor);

    return anchor;
  }

  function markControl(element, actionName) {
    if (!element) return;

    setDataset(element, "hearthIndexButtonAuthorityReset", "true");
    setDataset(element, "hearthIndexButtonAuthorityContract", CONTRACT);
    setDataset(element, "hearthIndexButtonRenewalContract", RENEWAL_CONTRACT);
    setDataset(element, "hearthIndexButtonAction", actionName);
    setDataset(element, "hearthPassiveButtonCorridor", "true");
    setDataset(element, "hearthButtonIgnitesRuntime", "false");
    setDataset(element, "hearthRouteConductorOwnsControlBinding", "true");
    setDataset(element, "hearthNativeAnchorDefaultPreserved", "true");
  }

  function markAllControls() {
    refreshRefs();

    [
      [refs.copyButton, "copyDiagnostic"],
      [refs.toggleReceiptButton, "toggleReceipt"],
      [refs.inspectButton, "inspectPlanet"],
      [refs.collapseButton, "toggleCockpit"],
      [refs.showDiagnosticTab, "showDiagnostic"]
    ].forEach(([element, action]) => markControl(element, action));

    refs.diagnosticAnchors.forEach((anchor) => markControl(anchor, "openDiagnosticRail"));
    refs.portalLinks.forEach((anchor) => markControl(anchor, "portalNativeNavigation"));

    refs.summaries.forEach((summary) => {
      setDataset(summary, "hearthIndexDrawerAuthorityReset", CONTRACT);
      setDataset(summary, "hearthPassiveButtonCorridor", "true");
      setDataset(summary, "hearthButtonIgnitesRuntime", "false");
    });
  }

  function shouldIgnoreDuplicate(key) {
    const at = nowMs();
    if (key === lastActivationKey && at - lastActivationAt < 420) return true;

    lastActivationKey = key;
    lastActivationAt = at;
    return false;
  }

  function stopButtonEvent(event) {
    if (!event) return;

    try {
      if (event.cancelable) event.preventDefault();
    } catch (_error) {}

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}
  }

  function preserveAnchorDefaultButBlockStaleHandlers(event) {
    if (!event) return;

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}
  }

  function markAction(actionName) {
    state.lastAction = safeString(actionName, "action");
    state.lastActionAt = nowIso();
    state.updatedAt = state.lastActionAt;
    publishDataset();
    updateStatusLine(actionName);
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_error) {}

    try {
      if (!doc || !doc.body) return false;

      const area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "readonly");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      area.style.top = "-9999px";
      doc.body.appendChild(area);
      area.focus();
      area.select();

      const ok = doc.execCommand("copy");
      area.remove();
      return Boolean(ok);
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      recordError("COPY_DIAGNOSTIC_FAILED", error);
      return false;
    }
  }

  async function copyDiagnostic() {
    refreshVisibleExpressionChainState("copyDiagnosticPassiveObserve");
    refreshRefs();

    const resolved = resolveActiveReceiptText();
    const text = resolved.text || getIndexReceiptText();
    const ok = await copyText(text);

    state.copyDiagnosticCount += 1;
    state.copiedReceiptSource = resolved.source || "INDEX_FALLBACK";

    if (refs.copyButton) {
      refs.copyButton.textContent = ok ? "Copied" : "Copy held";
      root.setTimeout(() => {
        refreshRefs();
        if (refs.copyButton) refs.copyButton.textContent = "Copy diagnostic";
      }, 900);
    }

    markAction(ok ? "copyDiagnostic" : "copyDiagnosticHeld");
    return ok;
  }

  function toggleReceiptPanel() {
    refreshVisibleExpressionChainState("toggleReceiptPassiveObserve");
    refreshRefs();

    if (!refs.receiptPanel) {
      state.lastError = "RECEIPT_PANEL_NOT_FOUND";
      markAction("toggleReceiptFailed");
      return false;
    }

    const visible = refs.receiptPanel.dataset.visible !== "true";
    refs.receiptPanel.dataset.visible = String(visible);
    refs.receiptPanel.hidden = false;

    try {
      refs.receiptPanel.style.display = visible ? "block" : "none";
      refs.receiptPanel.style.visibility = "visible";
    } catch (_error) {}

    const resolved = resolveActiveReceiptText();

    if (refs.receiptText) {
      refs.receiptText.textContent = visible ? resolved.text : "";
    }

    if (refs.toggleReceiptButton) {
      refs.toggleReceiptButton.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    state.shownReceiptSource = visible ? resolved.source : "HIDDEN";
    state.receiptVisible = visible;
    state.toggleReceiptCount += 1;
    markAction(visible ? "showReceipt" : "hideReceipt");
    return visible;
  }

  function setInspectMode(active) {
    refreshVisibleExpressionChainState("inspectModePassiveObserve");
    refreshRefs();

    state.inspectModeActive = Boolean(active);

    if (refs.html) {
      refs.html.dataset.hearthSouthPlanetInspect = String(state.inspectModeActive);
      refs.html.dataset.hearthEastInspectReservedActive = String(state.inspectModeActive);
      refs.html.dataset.hearthIndexInspectModeActive = String(state.inspectModeActive);
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = state.inspectModeActive ? "planet-inspect" : "diagnostic-dock";
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.inspectModeActive ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.showDiagnosticTab) {
      refs.showDiagnosticTab.hidden = !state.inspectModeActive;
      refs.showDiagnosticTab.dataset.visible = String(state.inspectModeActive);
    }

    if (state.inspectModeActive) {
      state.inspectPlanetCount += 1;
      state.cockpitMode = "planet-inspect";
      markAction("inspectPlanet");
    } else {
      state.showDiagnosticCount += 1;
      state.cockpitMode = "diagnostic-dock";
      markAction("showDiagnostic");
    }

    return state.inspectModeActive;
  }

  function toggleCockpitMode() {
    refreshVisibleExpressionChainState("toggleCockpitPassiveObserve");
    refreshRefs();

    if (!refs.cockpit) {
      state.lastError = "COCKPIT_NOT_FOUND";
      markAction("toggleCockpitFailed");
      return false;
    }

    const next = refs.cockpit.dataset.cockpitMode === "expanded-cockpit"
      ? "diagnostic-dock"
      : "expanded-cockpit";

    refs.cockpit.dataset.cockpitMode = next;
    state.cockpitMode = next;

    if (refs.collapseButton) {
      refs.collapseButton.textContent = next === "expanded-cockpit" ? "Collapse cockpit" : "Expand cockpit";
    }

    state.expandCockpitCount += 1;
    markAction("toggleCockpit");
    return true;
  }

  function toggleDrawer(summary) {
    const details = closest(summary, "details");

    if (!details) {
      state.lastError = "DRAWER_DETAILS_NOT_FOUND";
      markAction("drawerToggleFailed");
      return false;
    }

    details.open = !details.open;
    state.drawerToggleCount += 1;
    markAction("drawerToggle");
    return true;
  }

  function actionTargetFor(event) {
    const target = event && event.target ? event.target : null;

    const copy = closest(target, "[data-hearth-copy-diagnostic]");
    if (copy) return { type: "button", action: "copyDiagnostic", element: copy };

    const receipt = closest(target, "[data-hearth-toggle-receipt]");
    if (receipt) return { type: "button", action: "toggleReceipt", element: receipt };

    const inspect = closest(target, "[data-hearth-inspect-planet]");
    if (inspect) return { type: "button", action: "inspectPlanet", element: inspect };

    const collapse = closest(target, "[data-hearth-collapse-cockpit]");
    if (collapse) return { type: "button", action: "toggleCockpit", element: collapse };

    const showDiagnostic = closest(target, "[data-hearth-south-show-diagnostic-tab], [data-hearth-east-show-diagnostic-tab], [data-hearth-show-diagnostic-tab]");
    if (showDiagnostic) return { type: "button", action: "showDiagnostic", element: showDiagnostic };

    const summary = closest(target, "details.drawer > summary, details > summary");
    if (summary) return { type: "summary", action: "drawerToggle", element: summary };

    const anchor = closest(target, "a[href]");
    if (anchor) {
      const href = safeString(anchor.getAttribute("href") || anchor.href || "");
      const diagnostic = href === DIAGNOSTIC_ROUTE || href.endsWith("/showroom/globe/hearth/diagnostic/");
      return {
        type: "anchor",
        action: diagnostic ? "openDiagnosticRail" : "portalNativeNavigation",
        element: anchor,
        href,
        diagnostic
      };
    }

    return null;
  }

  function executeButtonAction(action) {
    if (action === "copyDiagnostic") {
      copyDiagnostic();
      return true;
    }

    if (action === "toggleReceipt") return toggleReceiptPanel();
    if (action === "inspectPlanet") return setInspectMode(!state.inspectModeActive);
    if (action === "toggleCockpit") return toggleCockpitMode();
    if (action === "showDiagnostic") return setInspectMode(false);

    return false;
  }

  function documentActivationCapture(event) {
    const found = actionTargetFor(event);
    if (!found) return;

    const type = event.type || "";
    const isKeyboard = type === "keydown";
    const key = isKeyboard ? safeString(event.key || "") : "";

    if (isKeyboard && key !== "Enter" && key !== " ") return;

    if (found.type === "anchor") {
      if (type !== "click" && !isKeyboard) return;

      if (found.diagnostic) state.diagnosticAnchorCount += 1;
      else state.portalNavigationCount += 1;

      markAction(found.action);
      preserveAnchorDefaultButBlockStaleHandlers(event);
      return;
    }

    if (found.type === "summary") {
      if (type !== "click" && !isKeyboard) return;

      const duplicateKey = `${found.action}:${type}:${key}`;
      if (shouldIgnoreDuplicate(duplicateKey)) {
        stopButtonEvent(event);
        return;
      }

      stopButtonEvent(event);
      toggleDrawer(found.element);
      return;
    }

    if (found.type === "button") {
      if (type !== "click" && type !== "pointerup" && type !== "touchend" && !isKeyboard) return;

      const duplicateKey = `${found.action}:${type}:${key}`;
      if (shouldIgnoreDuplicate(duplicateKey)) {
        stopButtonEvent(event);
        return;
      }

      stopButtonEvent(event);
      executeButtonAction(found.action);
    }
  }

  function bindDocumentCaptureShield() {
    if (!doc || doc.__hearthIndexPassiveButtonCorridorCaptureShield) {
      state.documentCaptureShieldActive = Boolean(doc && doc.__hearthIndexPassiveButtonCorridorCaptureShield);
      return state.documentCaptureShieldActive;
    }

    try {
      doc.addEventListener("click", documentActivationCapture, { capture: true, passive: false });
      doc.addEventListener("pointerup", documentActivationCapture, { capture: true, passive: false });
      doc.addEventListener("touchend", documentActivationCapture, { capture: true, passive: false });
      doc.addEventListener("keydown", documentActivationCapture, { capture: true, passive: false });
      doc.__hearthIndexPassiveButtonCorridorCaptureShield = true;
      state.documentCaptureShieldActive = true;
      state.windowDocumentCaptureSuppressionRetired = true;
      return true;
    } catch (error) {
      recordError("DOCUMENT_CAPTURE_SHIELD_BIND_FAILED", error);
      state.documentCaptureShieldActive = false;
      return false;
    }
  }

  function bindControls() {
    refreshRefs();
    injectControlAuthorityStyle();
    ensureEmergencyDiagnosticAnchor();
    refreshRefs();
    markAllControls();
    bindDocumentCaptureShield();

    state.copyDiagnosticBound = Boolean(refs.copyButton);
    state.toggleReceiptBound = Boolean(refs.toggleReceiptButton);
    state.inspectPlanetBound = Boolean(refs.inspectButton);
    state.expandCockpitBound = Boolean(refs.collapseButton);
    state.showDiagnosticBound = Boolean(refs.showDiagnosticTab);
    state.diagnosticAnchorBound = refs.diagnosticAnchors.length > 0;
    state.portalAnchorsBound = refs.portalLinks.length > 0;
    state.detailsDrawersBound = refs.summaries.length > 0;

    resolveActiveReceiptText();
    publishDataset();
    updateStatusLine("bindControls");
    return getReceipt();
  }

  function auditHtml() {
    refreshRefs();

    state.observedHtmlContract = readHtmlContract();
    state.currentHtmlContractRecognized = htmlContractRecognized(state.observedHtmlContract);

    const pageReceipt = resolvePageReceiptText();
    state.pageReceiptAvailable = Boolean(pageReceipt.ok && pageReceipt.text);
    state.activeReceiptSource = pageReceipt.ok ? pageReceipt.source : "INDEX_FALLBACK";

    refreshVisibleExpressionChainState("auditHtml");

    return {
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      pageReceiptAvailable: state.pageReceiptAvailable,
      activeReceiptSource: state.activeReceiptSource,

      copyButtonPresent: Boolean(refs.copyButton),
      toggleReceiptButtonPresent: Boolean(refs.toggleReceiptButton),
      diagnosticAnchorsPresent: refs.diagnosticAnchors.length,
      inspectButtonPresent: Boolean(refs.inspectButton),
      collapseButtonPresent: Boolean(refs.collapseButton),
      portalLinksPresent: refs.portalLinks.length,
      detailsSummariesPresent: refs.summaries.length,
      receiptPanelPresent: Boolean(refs.receiptPanel),
      receiptTextPresent: Boolean(refs.receiptText),
      htmlReceiptTargetsPresent: refs.htmlReceiptTargets.length,

      routeConductorObserved: state.routeConductorObserved,
      controlsObserved: state.controlsObserved,
      hexFourPairAuthorityObserved: state.hexFourPairAuthorityObserved,
      hexSurfaceObserved: state.hexSurfaceObserved,
      canvasHubObserved: state.canvasHubObserved,

      passiveButtonCorridorActive: true,
      activeVisibleExpressionLoaderRetired: true,
      noDynamicScriptInjection: true,
      canvasBootSuppressedByIndex: true
    };
  }

  function updateStatusLine(message = "") {
    refreshRefs();

    if (refs.stageLabel) {
      refs.stageLabel.textContent = "Passive button corridor · receipt authority";
    }

    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = [
        "buttons=passive-corridor",
        "native-anchors=preserved",
        "page-receipt-target=bound",
        "loader=retired",
        `route=${state.routeConductorObserved ? "observed" : "waiting"}`,
        `canvas=${state.canvasHubObserved ? "observed" : "waiting"}`,
        `last=${message || state.lastAction}`
      ].join(" · ");
    }

    if (refs.latestEvent) {
      refs.latestEvent.textContent = `latest=${RENEWAL_CONTRACT}`;
    }

    const percent = state.canvasHubObserved ? "55%" : state.routeConductorObserved ? "44%" : "34%";

    if (refs.progressFill) refs.progressFill.style.width = percent;
    if (refs.progressPercent) refs.progressPercent.textContent = percent;

    if (refs.routeStatus) {
      const resolved = resolveActiveReceiptText();
      refs.routeStatus.textContent = resolved.text || getIndexReceiptText();
    }
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const html = doc.documentElement;

    html.dataset.hearthIndexJsLoaded = "true";
    html.dataset.hearthIndexJsContract = CONTRACT;
    html.dataset.hearthIndexJsReceipt = RECEIPT;
    html.dataset.hearthIndexJsPreviousContract = PREVIOUS_CONTRACT;
    html.dataset.hearthIndexJsPreviousRenewalContract = PREVIOUS_RENEWAL_CONTRACT;
    html.dataset.hearthIndexJsPreviousRenewalReceipt = PREVIOUS_RENEWAL_RECEIPT;
    html.dataset.hearthIndexJsRenewalContract = RENEWAL_CONTRACT;
    html.dataset.hearthIndexJsRenewalReceipt = RENEWAL_RECEIPT;
    html.dataset.hearthIndexJsVersion = VERSION;

    html.dataset.hearthIndexPassiveButtonCorridorActive = "true";
    html.dataset.hearthIndexPassiveReceiptCorridorActive = "true";
    html.dataset.hearthIndexPassiveDownstreamObserverActive = "true";
    html.dataset.hearthIndexActiveVisibleExpressionLoaderRetired = "true";
    html.dataset.hearthIndexVisibleExpressionChainLoaderBridgeRetired = "true";
    html.dataset.hearthIndexNoDynamicScriptInjection = "true";
    html.dataset.hearthIndexCanvasBootSuppressed = "true";
    html.dataset.hearthIndexRouteConductorAdmissionSuppressed = "true";
    html.dataset.hearthIndexControlAdmissionSuppressed = "true";

    html.dataset.hearthIndexButtonAuthorityResetActive = "true";
    html.dataset.hearthFrontendButtonAuthorityRestored = "true";
    html.dataset.hearthDocumentCaptureShieldActive = String(state.documentCaptureShieldActive);
    html.dataset.hearthWindowDocumentCaptureSuppressionRetired = String(state.windowDocumentCaptureSuppressionRetired);
    html.dataset.hearthNativeAnchorDefaultPreserved = "true";
    html.dataset.hearthDirectButtonBindingActive = "true";
    html.dataset.hearthDuplicateActivationProtectionActive = "true";

    html.dataset.hearthPageReceiptTargetBindingActive = "true";
    html.dataset.hearthPageReceiptAvailable = String(state.pageReceiptAvailable);
    html.dataset.hearthActiveReceiptSource = state.activeReceiptSource;
    html.dataset.hearthCopiedReceiptSource = state.copiedReceiptSource;
    html.dataset.hearthShownReceiptSource = state.shownReceiptSource;
    html.dataset.hearthCurrentHtmlContractRecognized = String(state.currentHtmlContractRecognized);
    html.dataset.hearthObservedHtmlContract = state.observedHtmlContract;

    html.dataset.hearthRouteConductorObservedByIndex = String(state.routeConductorObserved);
    html.dataset.hearthRouteConductorContractObservedByIndex = state.routeConductorContract;
    html.dataset.hearthRouteConductorContractRecognizedByIndex = String(state.routeConductorContractRecognized);
    html.dataset.hearthRouteConductorLoadedByIndex = "false";
    html.dataset.hearthRouteConductorHandoffByIndex = "false";
    html.dataset.hearthRouteConductorOwnedByIndex = "false";

    html.dataset.hearthControlsObservedByIndex = String(state.controlsObserved);
    html.dataset.hearthControlsContractObservedByIndex = state.controlsContract;
    html.dataset.hearthControlsContractRecognizedByIndex = String(state.controlsContractRecognized);
    html.dataset.hearthControlsLoadedByIndex = "false";
    html.dataset.hearthControlsAdmittedByIndex = "false";

    html.dataset.hearthHexFourPairAuthorityFile = HEX_FOUR_PAIR_FILE;
    html.dataset.hearthHexFourPairAuthorityObserved = String(state.hexFourPairAuthorityObserved);
    html.dataset.hearthHexFourPairAuthorityContract = state.hexFourPairAuthorityContract;
    html.dataset.hearthHexFourPairAuthorityExpectedContract = EXPECTED_HEX_FOUR_PAIR_CONTRACT;
    html.dataset.hearthHexFourPairAuthorityContractRecognized = String(state.hexFourPairAuthorityContractRecognized);
    html.dataset.hearthHexFourPairAuthorityObservationStatus = state.hexFourPairAuthorityObservationStatus;

    html.dataset.hearthHexSurfaceFile = HEX_SURFACE_FILE;
    html.dataset.hearthHexSurfaceObserved = String(state.hexSurfaceObserved);
    html.dataset.hearthHexSurfaceContract = state.hexSurfaceContract;
    html.dataset.hearthHexSurfaceExpectedContract = EXPECTED_HEX_SURFACE_CONTRACT;
    html.dataset.hearthHexSurfaceContractRecognized = String(state.hexSurfaceContractRecognized);
    html.dataset.hearthHexSurfaceObservationStatus = state.hexSurfaceObservationStatus;

    html.dataset.hearthCanvasFile = CANVAS_FILE;
    html.dataset.hearthCanvasHubObserved = String(state.canvasHubObserved);
    html.dataset.hearthCanvasHubContract = state.canvasHubContract;
    html.dataset.hearthCanvasHubAcceptedContracts = ACCEPTED_CANVAS_CONTRACTS.join("|");
    html.dataset.hearthCanvasHubContractRecognized = String(state.canvasHubContractRecognized);
    html.dataset.hearthCanvasHubObservationStatus = state.canvasHubObservationStatus;

    html.dataset.hearthVisibleExpressionChainObserved = String(state.visibleExpressionChainObserved);
    html.dataset.hearthVisibleExpressionChainLoadStarted = "false";
    html.dataset.hearthVisibleExpressionChainLoadComplete = String(state.visibleExpressionChainLoadComplete);
    html.dataset.hearthVisibleExpressionChainLoadHeld = "false";
    html.dataset.hearthVisibleExpressionChainLoadHeldReason = state.visibleExpressionChainLoadHeldReason;
    html.dataset.hearthVisibleExpressionChainLoadAttemptCount = "0";
    html.dataset.hearthVisibleExpressionChainLoadCompleteCount = String(state.visibleExpressionChainLoadCompleteCount);
    html.dataset.hearthVisibleExpressionChainLoadLastReason = state.visibleExpressionChainLoadLastReason;
    html.dataset.hearthVisibleExpressionChainLoadLastError = state.visibleExpressionChainLoadLastError;
    html.dataset.hearthVisibleExpressionChainLoadPromiseActive = "false";

    html.dataset.hearthCanvasBootAttempted = "false";
    html.dataset.hearthCanvasBootMethod = "NONE";
    html.dataset.hearthCanvasBootResult = "PASSIVE_NOT_ATTEMPTED";
    html.dataset.hearthCanvasBootError = "";
    html.dataset.hearthCanvasLoadedByIndex = "false";
    html.dataset.hearthCanvasStartedByIndex = "false";
    html.dataset.hearthCanvasBootedByIndex = "false";

    html.dataset.hearthDiagnosticRailLoadedByIndex = "false";
    html.dataset.hearthDiagnosticRailOwnedByIndex = "false";

    html.dataset.hearthCopyDiagnosticBound = String(state.copyDiagnosticBound);
    html.dataset.hearthToggleReceiptBound = String(state.toggleReceiptBound);
    html.dataset.hearthDiagnosticAnchorBound = String(state.diagnosticAnchorBound);
    html.dataset.hearthInspectPlanetBound = String(state.inspectPlanetBound);
    html.dataset.hearthExpandCockpitBound = String(state.expandCockpitBound);
    html.dataset.hearthShowDiagnosticBound = String(state.showDiagnosticBound);
    html.dataset.hearthPortalAnchorsBound = String(state.portalAnchorsBound);
    html.dataset.hearthDetailsDrawersBound = String(state.detailsDrawersBound);

    html.dataset.hearthLastButtonAction = state.lastAction;
    html.dataset.hearthLastButtonActionAt = state.lastActionAt;

    html.dataset.hearthIndexFirstFailedCoordinate = state.firstFailedCoordinate;
    html.dataset.hearthIndexRecommendedNextFile = state.recommendedNextFile;
    html.dataset.hearthIndexRecommendedNextAction = state.recommendedNextAction;
    html.dataset.hearthIndexPostgameStatus = state.postgameStatus;

    html.dataset.hearthF13Claimed = "false";
    html.dataset.hearthF21Claimed = "false";
    html.dataset.hearthReadyTextAllowed = "false";
    html.dataset.hearthReadyTextClaimed = "false";
    html.dataset.hearthControlReadyClaimed = "false";
    html.dataset.hearthMotionReadyClaimed = "false";
    html.dataset.hearthTouchReadyClaimed = "false";
    html.dataset.hearthDragReadyClaimed = "false";
    html.dataset.hearthDownstreamReleaseClaimed = "false";
    html.dataset.visualPassClaimed = "false";
    html.dataset.generatedImage = "false";
    html.dataset.graphicBox = "false";
    html.dataset.webgl = "false";

    return true;
  }

  function getVisibleExpressionChainReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      packetType: "HEARTH_INDEX_PASSIVE_DOWNSTREAM_OBSERVER_RECEIPT",
      route: ROUTE,
      file: FILE,

      passiveDownstreamObserverActive: true,
      activeVisibleExpressionLoaderRetired: true,
      visibleExpressionChainLoaderBridgeRetired: true,
      noDynamicScriptInjection: true,
      indexDoesNotLoadAssets: true,
      indexDoesNotBootCanvas: true,
      indexDoesNotAdmitControls: true,
      routeConductorOwnsControlAdmission: true,

      visibleExpressionChainObserved: state.visibleExpressionChainObserved,
      visibleExpressionChainLoadStarted: false,
      visibleExpressionChainLoadComplete: state.visibleExpressionChainLoadComplete,
      visibleExpressionChainLoadHeld: false,
      visibleExpressionChainLoadHeldReason: state.visibleExpressionChainLoadHeldReason,
      visibleExpressionChainLoadAttemptCount: 0,
      visibleExpressionChainLoadCompleteCount: state.visibleExpressionChainLoadCompleteCount,
      visibleExpressionChainLoadLastReason: state.visibleExpressionChainLoadLastReason,
      visibleExpressionChainLoadLastError: state.visibleExpressionChainLoadLastError,

      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorExpectedContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      routeConductorLoadedByIndex: false,
      routeConductorHandoffByIndex: false,
      routeConductorOwnedByIndex: false,

      controlFile: CONTROL_FILE,
      controlsObserved: state.controlsObserved,
      controlsContract: state.controlsContract,
      controlsReceipt: state.controlsReceipt,
      controlsExpectedContract: CONTROL_CONTRACT,
      controlsContractRecognized: state.controlsContractRecognized,
      controlsLoadedByIndex: false,
      controlsAdmittedByIndex: false,

      hexFourPairAuthorityFile: HEX_FOUR_PAIR_FILE,
      hexFourPairAuthorityObserved: state.hexFourPairAuthorityObserved,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityExpectedContract: EXPECTED_HEX_FOUR_PAIR_CONTRACT,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairAuthorityObservationStatus: state.hexFourPairAuthorityObservationStatus,

      hexSurfaceFile: HEX_SURFACE_FILE,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceExpectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,
      hexSurfaceObservationStatus: state.hexSurfaceObservationStatus,

      canvasFile: CANVAS_FILE,
      canvasHubObserved: state.canvasHubObserved,
      canvasHubContract: state.canvasHubContract,
      canvasHubAcceptedContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      canvasHubContractRecognized: state.canvasHubContractRecognized,
      canvasHubObservationStatus: state.canvasHubObservationStatus,

      canvasBootAttempted: false,
      canvasBootMethod: "NONE",
      canvasBootResult: "PASSIVE_NOT_ATTEMPTED",
      canvasBootError: "",
      canvasLoadedByIndex: false,
      canvasStartedByIndex: false,
      canvasBootedByIndex: false,

      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      indexOwnsHexTruth: false,
      indexOwnsHexSurfaceTruth: false,
      indexOwnsRouteConductorAuthority: false,
      indexOwnsControlAdmission: false,

      ...FINAL_FALSE,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      currentHtmlContract: CURRENT_HTML_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      baselineHtmlContract: BASELINE_HTML_CONTRACT,
      foundationHtmlContract: FOUNDATION_HTML_CONTRACT,
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,

      bootStarted: state.bootStarted,
      bootComplete: state.bootComplete,
      bootCount: state.bootCount,

      passiveButtonCorridorActive: true,
      passiveReceiptCorridorActive: true,
      passiveDownstreamObserverActive: true,
      activeVisibleExpressionLoaderRetired: true,
      visibleExpressionChainLoaderBridgeRetired: true,
      noDynamicScriptInjection: true,
      canvasBootSuppressedByIndex: true,
      routeConductorAdmissionSuppressedByIndex: true,
      controlAdmissionSuppressedByIndex: true,

      buttonAuthorityActive: true,
      frontendButtonAuthorityRestored: true,
      documentCaptureShieldActive: state.documentCaptureShieldActive,
      globalSuppressionAvoided: true,
      windowDocumentCaptureSuppressionRetired: state.windowDocumentCaptureSuppressionRetired,
      nativeAnchorDefaultPreserved: true,
      directButtonBindingActive: true,
      delegatedButtonBindingActive: true,
      detailsSummaryBindingActive: true,
      duplicateActivationProtectionActive: true,

      pageReceiptTargetBindingActive: true,
      pageReceiptAvailable: state.pageReceiptAvailable,
      activeReceiptSource: state.activeReceiptSource,
      copiedReceiptSource: state.copiedReceiptSource,
      shownReceiptSource: state.shownReceiptSource,

      visibleExpressionChainReceipt: getVisibleExpressionChainReceipt(),

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorContractRecognized: state.routeConductorContractRecognized,

      controlsObserved: state.controlsObserved,
      controlsContract: state.controlsContract,
      controlsContractRecognized: state.controlsContractRecognized,

      hexFourPairAuthorityObserved: state.hexFourPairAuthorityObserved,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,

      canvasHubObserved: state.canvasHubObserved,
      canvasHubContract: state.canvasHubContract,
      canvasHubContractRecognized: state.canvasHubContractRecognized,
      canvasBootAttempted: false,
      canvasBootMethod: "NONE",
      canvasBootResult: "PASSIVE_NOT_ATTEMPTED",
      canvasBootError: "",
      canvasLoadedByIndex: false,
      canvasStartedByIndex: false,
      canvasBootedByIndex: false,

      copyDiagnosticBound: state.copyDiagnosticBound,
      toggleReceiptBound: state.toggleReceiptBound,
      diagnosticAnchorBound: state.diagnosticAnchorBound,
      inspectPlanetBound: state.inspectPlanetBound,
      expandCockpitBound: state.expandCockpitBound,
      showDiagnosticBound: state.showDiagnosticBound,
      portalAnchorsBound: state.portalAnchorsBound,
      detailsDrawersBound: state.detailsDrawersBound,

      copyDiagnosticCount: state.copyDiagnosticCount,
      toggleReceiptCount: state.toggleReceiptCount,
      diagnosticAnchorCount: state.diagnosticAnchorCount,
      inspectPlanetCount: state.inspectPlanetCount,
      showDiagnosticCount: state.showDiagnosticCount,
      expandCockpitCount: state.expandCockpitCount,
      portalNavigationCount: state.portalNavigationCount,
      drawerToggleCount: state.drawerToggleCount,

      receiptVisible: state.receiptVisible,
      inspectModeActive: state.inspectModeActive,
      cockpitMode: state.cockpitMode,
      lastAction: state.lastAction,
      lastActionAt: state.lastActionAt,
      lastError: state.lastError,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      routeConductorLoadedByIndex: false,
      routeConductorHandoffByIndex: false,
      routeConductorOwnedByIndex: false,
      diagnosticRailLoadedByIndex: false,
      diagnosticRailOwnedByIndex: false,

      htmlOwnsVisibleShell: true,
      indexCreatesVisibleShell: false,
      indexOwnsButtonBindingOnly: false,
      indexOwnsPassiveButtonAndReceiptCorridorOnly: true,
      indexOwnsRuntimeRelease: false,
      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      indexOwnsHexTruth: false,
      indexOwnsHexSurfaceTruth: false,
      indexOwnsRouteConductorHandoff: false,
      indexOwnsControlAdmission: false,
      indexOwnsPageReceiptSelection: true,
      indexOwnsPageReceiptTruth: false,

      localEvents: clonePlain(state.events),
      errors: clonePlain(state.errors),

      ...FINAL_FALSE,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getIndexReceiptText() {
    const r = getReceipt();
    const c = r.visibleExpressionChainReceipt || {};

    return [
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousRenewalContract", r.previousRenewalContract),
      line("previousRenewalReceipt", r.previousRenewalReceipt),
      line("renewalContract", r.renewalContract),
      line("renewalReceipt", r.renewalReceipt),
      line("version", r.version),
      line("route", r.route),
      line("file", r.file),
      line("htmlFile", r.htmlFile),
      line("routeConductorFile", r.routeConductorFile),
      line("diagnosticRoute", r.diagnosticRoute),
      "",
      "HTML_ALIGNMENT",
      line("currentHtmlContract", r.currentHtmlContract),
      line("previousHtmlContract", r.previousHtmlContract),
      line("baselineHtmlContract", r.baselineHtmlContract),
      line("foundationHtmlContract", r.foundationHtmlContract),
      line("observedHtmlContract", r.observedHtmlContract),
      line("currentHtmlContractRecognized", r.currentHtmlContractRecognized),
      "",
      "PASSIVE_CORRIDOR",
      line("passiveButtonCorridorActive", r.passiveButtonCorridorActive),
      line("passiveReceiptCorridorActive", r.passiveReceiptCorridorActive),
      line("passiveDownstreamObserverActive", r.passiveDownstreamObserverActive),
      line("activeVisibleExpressionLoaderRetired", r.activeVisibleExpressionLoaderRetired),
      line("visibleExpressionChainLoaderBridgeRetired", r.visibleExpressionChainLoaderBridgeRetired),
      line("noDynamicScriptInjection", r.noDynamicScriptInjection),
      line("canvasBootSuppressedByIndex", r.canvasBootSuppressedByIndex),
      line("routeConductorAdmissionSuppressedByIndex", r.routeConductorAdmissionSuppressedByIndex),
      line("controlAdmissionSuppressedByIndex", r.controlAdmissionSuppressedByIndex),
      "",
      "PASSIVE_DOWNSTREAM_OBSERVATION",
      line("visibleExpressionChainObserved", c.visibleExpressionChainObserved),
      line("visibleExpressionChainLoadStarted", c.visibleExpressionChainLoadStarted),
      line("visibleExpressionChainLoadComplete", c.visibleExpressionChainLoadComplete),
      line("visibleExpressionChainLoadHeld", c.visibleExpressionChainLoadHeld),
      line("visibleExpressionChainLoadHeldReason", c.visibleExpressionChainLoadHeldReason),
      line("visibleExpressionChainLoadAttemptCount", c.visibleExpressionChainLoadAttemptCount),
      line("visibleExpressionChainLoadCompleteCount", c.visibleExpressionChainLoadCompleteCount),
      line("visibleExpressionChainLoadLastReason", c.visibleExpressionChainLoadLastReason),
      line("visibleExpressionChainLoadLastError", c.visibleExpressionChainLoadLastError),
      "",
      "ROUTE_CONDUCTOR",
      line("routeConductorObserved", c.routeConductorObserved),
      line("routeConductorContract", c.routeConductorContract),
      line("routeConductorReceipt", c.routeConductorReceipt),
      line("routeConductorExpectedContract", c.routeConductorExpectedContract),
      line("routeConductorContractRecognized", c.routeConductorContractRecognized),
      line("routeConductorLoadedByIndex", c.routeConductorLoadedByIndex),
      line("routeConductorHandoffByIndex", c.routeConductorHandoffByIndex),
      line("routeConductorOwnedByIndex", c.routeConductorOwnedByIndex),
      "",
      "CONTROLS",
      line("controlFile", c.controlFile),
      line("controlsObserved", c.controlsObserved),
      line("controlsContract", c.controlsContract),
      line("controlsReceipt", c.controlsReceipt),
      line("controlsExpectedContract", c.controlsExpectedContract),
      line("controlsContractRecognized", c.controlsContractRecognized),
      line("controlsLoadedByIndex", c.controlsLoadedByIndex),
      line("controlsAdmittedByIndex", c.controlsAdmittedByIndex),
      "",
      "VISIBLE_EXPRESSION_SUBJECTS",
      line("hexFourPairAuthorityFile", c.hexFourPairAuthorityFile),
      line("hexFourPairAuthorityObserved", c.hexFourPairAuthorityObserved),
      line("hexFourPairAuthorityContract", c.hexFourPairAuthorityContract),
      line("hexFourPairAuthorityExpectedContract", c.hexFourPairAuthorityExpectedContract),
      line("hexFourPairAuthorityContractRecognized", c.hexFourPairAuthorityContractRecognized),
      line("hexFourPairAuthorityObservationStatus", c.hexFourPairAuthorityObservationStatus),
      line("hexSurfaceFile", c.hexSurfaceFile),
      line("hexSurfaceObserved", c.hexSurfaceObserved),
      line("hexSurfaceContract", c.hexSurfaceContract),
      line("hexSurfaceExpectedContract", c.hexSurfaceExpectedContract),
      line("hexSurfaceContractRecognized", c.hexSurfaceContractRecognized),
      line("hexSurfaceObservationStatus", c.hexSurfaceObservationStatus),
      line("canvasFile", c.canvasFile),
      line("canvasHubObserved", c.canvasHubObserved),
      line("canvasHubContract", c.canvasHubContract),
      line("canvasHubContractRecognized", c.canvasHubContractRecognized),
      line("canvasHubObservationStatus", c.canvasHubObservationStatus),
      "",
      "CANVAS_PUBLIC_API",
      line("canvasBootAttempted", c.canvasBootAttempted),
      line("canvasBootMethod", c.canvasBootMethod),
      line("canvasBootResult", c.canvasBootResult),
      line("canvasBootError", c.canvasBootError),
      line("canvasLoadedByIndex", c.canvasLoadedByIndex),
      line("canvasStartedByIndex", c.canvasStartedByIndex),
      line("canvasBootedByIndex", c.canvasBootedByIndex),
      "",
      "RECEIPT_TARGET_BINDING",
      line("pageReceiptTargetBindingActive", r.pageReceiptTargetBindingActive),
      line("pageReceiptAvailable", r.pageReceiptAvailable),
      line("activeReceiptSource", r.activeReceiptSource),
      line("copiedReceiptSource", r.copiedReceiptSource),
      line("shownReceiptSource", r.shownReceiptSource),
      line("indexOwnsPageReceiptSelection", r.indexOwnsPageReceiptSelection),
      line("indexOwnsPageReceiptTruth", r.indexOwnsPageReceiptTruth),
      "",
      "BUTTON_AUTHORITY",
      line("buttonAuthorityActive", r.buttonAuthorityActive),
      line("frontendButtonAuthorityRestored", r.frontendButtonAuthorityRestored),
      line("documentCaptureShieldActive", r.documentCaptureShieldActive),
      line("globalSuppressionAvoided", r.globalSuppressionAvoided),
      line("windowDocumentCaptureSuppressionRetired", r.windowDocumentCaptureSuppressionRetired),
      line("nativeAnchorDefaultPreserved", r.nativeAnchorDefaultPreserved),
      line("directButtonBindingActive", r.directButtonBindingActive),
      line("delegatedButtonBindingActive", r.delegatedButtonBindingActive),
      line("detailsSummaryBindingActive", r.detailsSummaryBindingActive),
      line("duplicateActivationProtectionActive", r.duplicateActivationProtectionActive),
      "",
      "BOUND_CONTROLS",
      line("copyDiagnosticBound", r.copyDiagnosticBound),
      line("toggleReceiptBound", r.toggleReceiptBound),
      line("diagnosticAnchorBound", r.diagnosticAnchorBound),
      line("inspectPlanetBound", r.inspectPlanetBound),
      line("expandCockpitBound", r.expandCockpitBound),
      line("showDiagnosticBound", r.showDiagnosticBound),
      line("portalAnchorsBound", r.portalAnchorsBound),
      line("detailsDrawersBound", r.detailsDrawersBound),
      "",
      "ACTION_COUNTS",
      line("copyDiagnosticCount", r.copyDiagnosticCount),
      line("toggleReceiptCount", r.toggleReceiptCount),
      line("diagnosticAnchorCount", r.diagnosticAnchorCount),
      line("inspectPlanetCount", r.inspectPlanetCount),
      line("showDiagnosticCount", r.showDiagnosticCount),
      line("expandCockpitCount", r.expandCockpitCount),
      line("portalNavigationCount", r.portalNavigationCount),
      line("drawerToggleCount", r.drawerToggleCount),
      "",
      "CURRENT_STATE",
      line("receiptVisible", r.receiptVisible),
      line("inspectModeActive", r.inspectModeActive),
      line("cockpitMode", r.cockpitMode),
      line("lastAction", r.lastAction),
      line("lastActionAt", r.lastActionAt),
      line("lastError", r.lastError),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "OWNERSHIP",
      line("htmlOwnsVisibleShell", r.htmlOwnsVisibleShell),
      line("indexCreatesVisibleShell", r.indexCreatesVisibleShell),
      line("indexOwnsButtonBindingOnly", r.indexOwnsButtonBindingOnly),
      line("indexOwnsPassiveButtonAndReceiptCorridorOnly", r.indexOwnsPassiveButtonAndReceiptCorridorOnly),
      line("indexOwnsRuntimeRelease", r.indexOwnsRuntimeRelease),
      line("indexOwnsCanvasDrawing", r.indexOwnsCanvasDrawing),
      line("indexOwnsCanvasTruth", r.indexOwnsCanvasTruth),
      line("indexOwnsHexTruth", r.indexOwnsHexTruth),
      line("indexOwnsHexSurfaceTruth", r.indexOwnsHexSurfaceTruth),
      line("indexOwnsRouteConductorHandoff", r.indexOwnsRouteConductorHandoff),
      line("indexOwnsControlAdmission", r.indexOwnsControlAdmission),
      line("routeConductorLoadedByIndex", r.routeConductorLoadedByIndex),
      line("routeConductorHandoffByIndex", r.routeConductorHandoffByIndex),
      line("routeConductorOwnedByIndex", r.routeConductorOwnedByIndex),
      line("diagnosticRailLoadedByIndex", r.diagnosticRailLoadedByIndex),
      line("diagnosticRailOwnedByIndex", r.diagnosticRailOwnedByIndex),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13EligibleForCanvas", false),
      line("f21Claimed", false),
      line("f21EligibleForNorth", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("downstreamReleaseClaimed", false),
      line("completionLatched", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("startedAt", r.startedAt),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return getIndexReceiptText();
  }

  function getPageReceiptText() {
    return resolvePageReceiptText().text || "";
  }

  function getActiveReceiptText() {
    return resolveActiveReceiptText().text || getIndexReceiptText();
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.indexJs = api;
    hearth.indexBridge = api;
    hearth.frontendButtonAuthorityReset = api;
    hearth.buttonAuthority = api;
    hearth.passiveButtonReceiptCorridor = api;
    hearth.visibleExpressionChainLoaderBridge = api;
    hearth.visibleExpressionChainPassiveObserver = api;

    hearth.indexJsReceipt = getReceipt();
    hearth.indexJsReceiptText = getIndexReceiptText;
    hearth.indexJsPageReceiptText = getPageReceiptText;
    hearth.indexJsActiveReceiptText = getActiveReceiptText;
    hearth.visibleExpressionChainReceipt = getVisibleExpressionChainReceipt;

    lab.hearthIndexJs = api;
    lab.hearthFrontendButtonAuthorityReset = api;
    lab.hearthPassiveButtonReceiptCorridor = api;
    lab.hearthVisibleExpressionChainPassiveObserver = api;

    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT = api;
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE = api;
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_PASSIVE_OBSERVER = api;

    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_RECEIPT = getVisibleExpressionChainReceipt();
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_PASSIVE_OBSERVER_RECEIPT = getVisibleExpressionChainReceipt();

    return api;
  }

  function boot() {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.bootCount += 1;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    auditHtml();
    bindControls();

    state.bootComplete = true;
    publishGlobals();
    markAction("bootComplete");

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      markAction("postBootPassiveRebind");
    }, 350);

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      markAction("latePassiveRebind");
    }, 1200);

    record("INDEX_PASSIVE_BUTTON_RECEIPT_CORRIDOR_BOOT_COMPLETE", {
      passiveButtonCorridorActive: true,
      activeVisibleExpressionLoaderRetired: true,
      noDynamicScriptInjection: true,
      canvasBootSuppressedByIndex: true,
      routeConductorObserved: state.routeConductorObserved,
      canvasHubObserved: state.canvasHubObserved,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  const api = Object.freeze({
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RENEWAL_CONTRACT,
    PREVIOUS_RENEWAL_RECEIPT,
    RENEWAL_CONTRACT,
    RENEWAL_RECEIPT,
    VERSION,
    ROUTE,
    FILE,
    HTML_FILE,
    ROUTE_CONDUCTOR_FILE,
    DIAGNOSTIC_ROUTE,
    CONTROL_FILE,
    CONTROL_CONTRACT,
    CONTROL_RECEIPT,
    HEX_FOUR_PAIR_FILE,
    HEX_SURFACE_FILE,
    CANVAS_FILE,
    CURRENT_HTML_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_RECEIPT,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    bindControls,
    auditHtml,

    copyDiagnostic,
    toggleReceiptPanel,
    setInspectMode,
    toggleCockpitMode,

    startVisibleExpressionChainBridge,
    loadVisibleExpressionChain,
    refreshVisibleExpressionChainState,
    resolveRouteConductor,
    resolveControls,
    resolveHexFourPairAuthority,
    resolveHexSurface,
    resolveCanvasHub,
    callCanvasHubPublicApi,

    getReceipt,
    getReceiptText,
    getIndexReceiptText,
    getPageReceiptText,
    getActiveReceiptText,
    getVisibleExpressionChainReceipt,
    publishGlobals,
    publishDataset,

    passiveButtonCorridorActive: true,
    passiveReceiptCorridorActive: true,
    passiveDownstreamObserverActive: true,
    activeVisibleExpressionLoaderRetired: true,
    visibleExpressionChainLoaderBridgeRetired: true,
    noDynamicScriptInjection: true,

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    pageReceiptTargetBindingActive: true,
    visibleExpressionChainObserverActive: true,

    routeConductorLoadedByIndex: false,
    routeConductorHandoffByIndex: false,
    routeConductorOwnedByIndex: false,
    controlsLoadedByIndex: false,
    controlsAdmittedByIndex: false,
    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    indexOwnsCanvasDrawing: false,
    indexOwnsCanvasTruth: false,
    indexOwnsHexTruth: false,
    indexOwnsHexSurfaceTruth: false,
    indexOwnsRouteConductorAuthority: false,
    indexOwnsControlAdmission: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    publishDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", boot, { once: true });
      } else {
        boot();
      }
    }
  } catch (error) {
    recordError("INDEX_PASSIVE_BUTTON_RECEIPT_CORRIDOR_INITIALIZATION_FAILED", error);

    try {
      publishDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
