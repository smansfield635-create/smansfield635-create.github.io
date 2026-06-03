// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4
// Internal controlled renewal:
// HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2
// Full-file replacement.
// Index JS / front-end button authority reset / visible-expression loader bridge only.
// Served CONTRACT intentionally remains v5_4 to preserve HTML/EAST diagnostic expectations.
// Supersedes internally:
// - HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1
// Adds:
// - Loads/recognizes the downstream visible-expression chain from the index bridge:
//   1. /assets/hearth/hearth.hex.four-pair.authority.js
//   2. /assets/hearth/hearth.hex.surface.js
//   3. /assets/hearth/hearth.canvas.js
// - Calls the Canvas Hub only through its public API: boot/init/start/mount.
// - Publishes loader receipts proving whether the chain is served, loaded, and boot-attempted.
// Preserves:
// - visible Hearth front-end button and anchor functionality
// - native navigation for diagnostic and portal anchors
// - downstream/global suppression avoidance
// - direct button binding
// - duplicate activation protection
// - receipt toggle
// - copy diagnostic
// - inspect/diagnostic dock
// - cockpit expansion
// - emergency diagnostic anchor
// - diagnostic child-chain loading held
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
// - route conductor systemic authority
// - diagnostic child-chain authority
// - F13
// - F21
// - final visual pass
// - production repair beyond front-end button authority and downstream asset loading

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const RECEIPT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT_v5_4";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";

  const PREVIOUS_RENEWAL_CONTRACT = "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1";
  const PREVIOUS_RENEWAL_RECEIPT = "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_RECEIPT_v5_4_1";

  const RENEWAL_CONTRACT = "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2";
  const RENEWAL_RECEIPT = "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_RECEIPT_v5_4_2";
  const VERSION = "2026-06-03.hearth-index-js-visible-expression-chain-loader-bridge-v5-4-2";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3";
  const LINEAGE_HTML_CONTRACT = "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6";
  const PREVIOUS_HTML_CONTRACT = "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_HEX_FOUR_PAIR_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";

  const ASSET_CHAIN = Object.freeze([
    {
      key: "hexFourPairAuthority",
      file: HEX_FOUR_PAIR_FILE,
      expectedContract: EXPECTED_HEX_FOUR_PAIR_CONTRACT,
      globalLabel: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      resolverName: "resolveHexFourPairAuthority"
    },
    {
      key: "hexSurface",
      file: HEX_SURFACE_FILE,
      expectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      globalLabel: "HEARTH_HEX_SURFACE",
      resolverName: "resolveHexSurface"
    },
    {
      key: "canvasHub",
      file: CANVAS_FILE,
      expectedContract: EXPECTED_CANVAS_CONTRACT,
      globalLabel: "HEARTH_CANVAS",
      resolverName: "resolveCanvasHub"
    }
  ]);

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
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "frontend-button-authority-reset-visible-expression-chain-loader-bridge",
    currentHtmlContract: CURRENT_HTML_CONTRACT,
    lineageHtmlContract: LINEAGE_HTML_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    observedHtmlContract: "UNKNOWN",
    currentHtmlContractRecognized: false,

    bootStarted: false,
    bootComplete: false,
    controlStyleInjected: false,

    buttonAuthorityActive: true,
    globalSuppressionAvoided: true,
    windowDocumentCaptureSuppressionRetired: true,
    nativeAnchorDefaultPreserved: true,
    directButtonBindingActive: true,
    delegatedButtonBindingActive: true,
    detailsSummaryBindingActive: true,

    pageReceiptTargetBindingActive: true,
    pageReceiptAvailable: false,
    activeReceiptSource: "INDEX_FALLBACK",
    copiedReceiptSource: "NONE",
    shownReceiptSource: "NONE",

    visibleExpressionChainLoaderBridgeActive: true,
    visibleExpressionChainLoadStarted: false,
    visibleExpressionChainLoadComplete: false,
    visibleExpressionChainLoadHeld: false,
    visibleExpressionChainLoadHeldReason: "NOT_RUN",
    visibleExpressionChainLoadAttemptCount: 0,
    visibleExpressionChainLoadCompleteCount: 0,
    visibleExpressionChainLoadLastReason: "NOT_RUN",
    visibleExpressionChainLoadLastError: "",
    visibleExpressionChainLoadPromiseActive: false,

    hexFourPairAuthorityFile: HEX_FOUR_PAIR_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    canvasFile: CANVAS_FILE,

    hexFourPairAuthorityLoaded: false,
    hexFourPairAuthorityContract: "UNKNOWN",
    hexFourPairAuthorityContractRecognized: false,
    hexFourPairAuthorityLoadStatus: "NOT_RUN",
    hexFourPairAuthorityLoadError: "",

    hexSurfaceLoaded: false,
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceContractRecognized: false,
    hexSurfaceLoadStatus: "NOT_RUN",
    hexSurfaceLoadError: "",

    canvasHubLoaded: false,
    canvasHubContract: "UNKNOWN",
    canvasHubContractRecognized: false,
    canvasHubLoadStatus: "NOT_RUN",
    canvasHubLoadError: "",

    canvasBootAttempted: false,
    canvasBootMethod: "NONE",
    canvasBootResult: "NOT_RUN",
    canvasBootError: "",
    canvasLoadedByIndex: false,
    canvasStartedByIndex: false,
    canvasBootedByIndex: false,

    routeConductorLoadedByIndex: false,
    routeConductorHandoffByIndex: false,
    routeConductorOwnedByIndex: false,

    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    copyDiagnosticBound: false,
    toggleReceiptBound: false,
    diagnosticAnchorBound: false,
    inspectPlanetBound: false,
    expandCockpitBound: false,
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
    receiptVisible: false,
    inspectModeActive: false,
    cockpitMode: "diagnostic-dock",

    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    startedAt: "",
    updatedAt: "",
    events: []
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

  const boundElements = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  let lastActivationKey = "";
  let lastActivationAt = 0;
  let visibleExpressionChainPromise = null;

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

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function isFunction(value) {
    return typeof value === "function";
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
    if (!isElement(target) || !isFunction(target.closest)) return null;
    try {
      return target.closest(selector);
    } catch (_error) {
      return null;
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setText(node, text) {
    if (!node) return;
    node.textContent = safeString(text);
  }

  function trimEvents() {
    if (state.events.length > 80) {
      state.events.splice(0, state.events.length - 80);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_INDEX_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimEvents();
    state.updatedAt = item.at;
    return item;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
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

  function getContract(value) {
    if (!isObject(value)) return "UNKNOWN";

    let receipt = null;

    const methods = ["getReceipt", "getReceiptLight", "getStatus", "getCanvasStationReceiptLight", "getCanvasStationReceipt"];

    for (const method of methods) {
      if (!isFunction(value[method])) continue;
      try {
        const result = value[method]();
        if (isObject(result)) {
          receipt = result;
          break;
        }
      } catch (_error) {}
    }

    return safeString(
      (receipt && (receipt.contract || receipt.CONTRACT || receipt.currentContract)) ||
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      "UNKNOWN",
      "UNKNOWN"
    );
  }

  function contractMatches(actual, expected) {
    const a = safeString(actual, "");
    const e = safeString(expected, "");
    return Boolean(a && e && a === e);
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
      text.includes("pageContext=Planet Engine and Planetary Template Development page") ||
      text.includes("visiblePlanetMountRequired=true") ||
      text.includes("htmlOwnsPublicShell=true")
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

  function markAction(actionName) {
    state.lastAction = actionName;
    state.lastActionAt = nowIso();
    state.updatedAt = state.lastActionAt;
    publishDataset();
    updateStatusLine(actionName);
  }

  function shouldIgnoreDuplicate(key) {
    const at = nowMs();
    if (key === lastActivationKey && at - lastActivationAt < 450) return true;
    lastActivationKey = key;
    lastActivationAt = at;
    return false;
  }

  function stopForButton(event) {
    if (!event) return;
    try {
      if (event.cancelable) event.preventDefault();
    } catch (_error) {}
    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}
  }

  function protectNativeAnchor(event, anchor) {
    if (!anchor) return;

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}

    if (event.type !== "click") return;

    if (event.defaultPrevented) {
      navigate(anchor.href || anchor.getAttribute("href") || DIAGNOSTIC_ROUTE);
      return;
    }

    root.setTimeout(() => {
      if (!doc || doc.visibilityState === "hidden") return;
    }, 0);
  }

  function navigate(url) {
    const target = safeString(url, "");
    if (!target) return false;

    try {
      root.location.assign(target);
      return true;
    } catch (_error) {
      try {
        root.location.href = target;
        return true;
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        return false;
      }
    }
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
      qs("#hearth-html-planet-factory-mirrorland-public-shell-receipt"),
      qs("#hearth-html-planet-engine-template-development-receipt-target-restoration-receipt"),
      qs("#hearth-html-planet-engine-template-development-optimal-standard-receipt"),
      qs("#hearth-html-single-floating-diagnostic-doorway-no-duplicate-top-banner-receipt"),
      ...qsa("template[data-hearth-html-receipt]"),
      ...qsa("template[data-route-receipt]"),
      ...qsa("[data-hearth-html-receipt]"),
      ...qsa("[data-route-receipt]"),
      refs.receiptText,
      refs.routeStatus
    ]);
  }

  function readHtmlContract() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return "UNKNOWN";
    return safeString(
      doc.documentElement.dataset.contract ||
      doc.documentElement.dataset.hearthHtmlContract ||
      doc.documentElement.dataset.hearthShellContract ||
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
      line("route", dataset.route || ROUTE),
      line("target", HTML_FILE),
      line("pageAlias", dataset.pageAlias || dataset.hearthAlias || "Hearth"),
      line("pageContext", dataset.pageContext || "UNKNOWN"),
      line("planetFactoryPage", dataset.planetFactoryPage || "UNKNOWN"),
      line("planetEnginePage", dataset.planetEnginePage || "UNKNOWN"),
      line("worldFormationStandardPage", dataset.worldFormationStandardPage || "UNKNOWN"),
      line("visiblePlanetStagePrimary", dataset.visiblePlanetStagePrimary || "UNKNOWN"),
      line("visiblePlanetMountRequired", dataset.visiblePlanetMountRequired || "UNKNOWN"),
      line("mount", dataset.mount || "#hearthCanvasMount"),
      line("globeStage", dataset.globeStage || "#hearthGlobeStage"),
      line("htmlOwnsPublicShell", dataset.htmlOwnsPublicShell || "UNKNOWN"),
      line("htmlOwnsPlanetMount", dataset.htmlOwnsPlanetMount || "UNKNOWN"),
      line("htmlOwnsRuntime", dataset.htmlOwnsRuntime || "false"),
      line("htmlOwnsCanvasDrawing", dataset.htmlOwnsCanvasDrawing || "false"),
      line("htmlOwnsCanvasTruth", dataset.htmlOwnsCanvasTruth || "false"),
      line("htmlOwnsFingerTruth", dataset.htmlOwnsFingerTruth || "false"),
      line("htmlOwnsRouteConductor", dataset.htmlOwnsRouteConductor || "false"),
      line("htmlOwnsDiagnosticRail", dataset.htmlOwnsDiagnosticRail || "false"),
      line("diagnosticRailRoute", dataset.diagnosticRailRoute || DIAGNOSTIC_ROUTE),
      line("femaleJsSelector", dataset.femaleJsSelector || FILE),
      line("selectorCacheBust", dataset.selectorCacheBust || CONTRACT),
      line("expectedIndexJsContract", dataset.expectedIndexJsContract || CONTRACT),
      line("expectedRouteConductorContract", dataset.expectedRouteConductorContract || "UNKNOWN"),
      line("expectedCanvasParentContract", dataset.expectedCanvasParentContract || "UNKNOWN"),
      line("routeConductorDelegated", dataset.routeConductorDelegated || "UNKNOWN"),
      line("canvasF13Delegated", dataset.canvasF13Delegated || "UNKNOWN"),
      line("fingersDownstream", dataset.fingersDownstream || "UNKNOWN"),
      line("f13Claimed", dataset.f13Claimed || "false"),
      line("f21NorthOnly", dataset.f21NorthOnly || "true"),
      line("f21Claimed", dataset.f21Claimed || "false"),
      line("readyTextAllowed", dataset.readyTextAllowed || "false"),
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
          : target && target.getAttribute
            ? `HTML_RECEIPT_TARGET:${target.getAttribute("data-hearth-html-receipt") ? "data-hearth-html-receipt" : target.getAttribute("data-route-receipt") ? "data-route-receipt" : target.tagName || "node"}`
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

  function injectControlAuthorityStyle() {
    if (!doc || !doc.head) return false;

    if (qs("style[data-hearth-index-button-authority-reset-style]")) {
      state.controlStyleInjected = true;
      return true;
    }

    const style = doc.createElement("style");
    style.setAttribute("data-hearth-index-button-authority-reset-style", CONTRACT);
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
        position: fixed;
        left: max(10px, env(safe-area-inset-left));
        top: max(10px, env(safe-area-inset-top));
        z-index: 100000;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 10px 14px;
        border: 1px solid rgba(242, 198, 109, .8);
        border-radius: 999px;
        background: linear-gradient(135deg, #ffe8a3, #f2c66d);
        color: #06101e;
        font: 950 12px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        text-decoration: none;
        box-shadow: 0 16px 44px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.28);
      }

      #hearthDiagnosticRailEmergencyAnchor:focus-visible {
        outline: 3px solid rgba(126, 216, 255, .9);
        outline-offset: 4px;
      }
    `;

    doc.head.appendChild(style);
    state.controlStyleInjected = true;
    return true;
  }

  function ensureEmergencyDiagnosticAnchor() {
    if (!doc || !doc.body) return null;

    let anchor = qs("#hearthDiagnosticRailEmergencyAnchor");
    if (anchor) return anchor;

    anchor = doc.createElement("a");
    anchor.id = "hearthDiagnosticRailEmergencyAnchor";
    anchor.href = DIAGNOSTIC_ROUTE;
    anchor.textContent = "Open Hearth Diagnostic Rail";
    anchor.setAttribute("data-hearth-diagnostic-rail-native-anchor", "true");
    anchor.setAttribute("data-hearth-index-emergency-diagnostic-anchor", CONTRACT);
    anchor.setAttribute("aria-label", "Open Hearth Diagnostic Rail");
    doc.body.appendChild(anchor);

    return anchor;
  }

  function bindOnce(element, type, handler, options) {
    if (!element || !isFunction(element.addEventListener)) return false;

    const key = `__hearth_${CONTRACT}_${RENEWAL_CONTRACT}_${type}`;
    if (element[key]) return false;

    try {
      element.addEventListener(type, handler, options || false);
      element[key] = true;
      return true;
    } catch (_error) {
      try {
        element.addEventListener(type, handler, false);
        element[key] = true;
        return true;
      } catch (__error) {
        return false;
      }
    }
  }

  function markControl(element, actionName) {
    if (!element) return;
    setDataset(element, "hearthIndexButtonAuthorityReset", "true");
    setDataset(element, "hearthIndexButtonAuthorityContract", CONTRACT);
    setDataset(element, "hearthIndexButtonRenewalContract", RENEWAL_CONTRACT);
    setDataset(element, "hearthIndexButtonAction", actionName);
    setDataset(element, "hearthRouteConductorOwnsControlBinding", "false");
    setDataset(element, "hearthNativeAnchorDefaultPreserved", "true");
  }

  function bindButton(element, actionName, callback) {
    if (!element) return false;

    markControl(element, actionName);

    if (boundElements && boundElements.has(element)) return true;

    bindOnce(element, "pointerup", (event) => {
      const key = `${actionName}:pointerup`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "touchend", (event) => {
      const key = `${actionName}:touchend`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "click", (event) => {
      const keyboardClick = Number(event.detail || 0) === 0;
      const key = `${actionName}:click`;

      if (!keyboardClick && shouldIgnoreDuplicate(key)) {
        stopForButton(event);
        return;
      }

      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    if (boundElements) boundElements.add(element);
    return true;
  }

  function bindAnchor(anchor, actionName = "nativeAnchor") {
    if (!anchor) return false;

    markControl(anchor, actionName);

    bindOnce(anchor, "pointerup", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "touchend", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "click", (event) => {
      state.diagnosticAnchorCount += anchor.getAttribute("href") === DIAGNOSTIC_ROUTE ? 1 : 0;
      state.portalNavigationCount += anchor.getAttribute("href") !== DIAGNOSTIC_ROUTE ? 1 : 0;
      markAction(actionName);
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    return true;
  }

  function bindSummary(summary) {
    if (!summary) return false;

    setDataset(summary, "hearthIndexDrawerAuthorityReset", CONTRACT);

    bindOnce(summary, "click", (event) => {
      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      markAction("drawerToggle");
    }, { capture: true, passive: false });

    bindOnce(summary, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;

      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      markAction("drawerToggleKeyboard");
    }, { capture: true, passive: false });

    return true;
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
      return false;
    }
  }

  async function copyDiagnostic() {
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
      refs.receiptPanel.style.visibility = visible ? "visible" : "visible";
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
      startVisibleExpressionChainBridge("inspectPlanet");
      markAction("inspectPlanet");
    } else {
      state.showDiagnosticCount += 1;
      state.cockpitMode = "diagnostic-dock";
      markAction("showDiagnostic");
    }

    return state.inspectModeActive;
  }

  function toggleCockpitMode() {
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

  function resolveHexFourPairAuthority() {
    const candidates = [
      readPath("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY"),
      readPath("HEARTH_HEX_FOUR_PAIR_AUTHORITY"),
      readPath("HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY"),
      readPath("HEARTH_HEX_HANDSHAKE_AUTHORITY"),
      readPath("HEARTH_HEXGRID_AUTHORITY"),
      readPath("HEARTH.hexFourPairAuthority"),
      readPath("HEARTH.hexAuthority")
    ];

    return candidates.find((candidate) => (
      isObject(candidate) &&
      (
        isFunction(candidate.sample) ||
        isFunction(candidate.read) ||
        isFunction(candidate.getCell) ||
        isFunction(candidate.wideProbe) ||
        isFunction(candidate.getReceipt)
      )
    )) || null;
  }

  function resolveHexSurface() {
    const candidates = [
      readPath("HEARTH_HEX_SURFACE"),
      readPath("HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER"),
      readPath("HEARTH.hexSurface"),
      readPath("HEARTH.hexSurfaceConsumer")
    ];

    return candidates.find((candidate) => (
      isObject(candidate) &&
      (
        isFunction(candidate.drawHearthHexSurfaceFrame) ||
        isFunction(candidate.drawFrame) ||
        isFunction(candidate.getHearthHexSurfaceStatus) ||
        isFunction(candidate.getStatus) ||
        isFunction(candidate.getReceipt)
      )
    )) || null;
  }

  function resolveCanvasHub() {
    const candidates = [
      readPath("HEARTH_CANVAS"),
      readPath("HEARTH_CANVAS_PARENT"),
      readPath("HEARTH_CANVAS_AUTHORITY"),
      readPath("HEARTH_CANVAS_LOCAL_STATION"),
      readPath("HEARTH_CANVAS_STATION"),
      readPath("HEARTH_CANVAS_EXPRESSION_HUB"),
      readPath("HEARTH_CANVAS_FINGER_MANAGER"),
      readPath("HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER"),
      readPath("HEARTH.canvas"),
      readPath("HEARTH.canvasParent"),
      readPath("HEARTH.canvasLocalStation"),
      readPath("HEARTH.canvasStation"),
      readPath("HEARTH.canvasExpressionHub"),
      readPath("HEARTH.canvasVisibleBaseGlobeCarrier"),
      readPath("DEXTER_LAB.hearthCanvas"),
      readPath("DEXTER_LAB.hearthCanvasParent"),
      readPath("DEXTER_LAB.hearthCanvasLocalStation"),
      readPath("DEXTER_LAB.hearthCanvasStation"),
      readPath("DEXTER_LAB.hearthCanvasExpressionHub"),
      readPath("DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrier")
    ];

    return candidates.find((candidate) => (
      isObject(candidate) &&
      (
        isFunction(candidate.boot) ||
        isFunction(candidate.init) ||
        isFunction(candidate.start) ||
        isFunction(candidate.mount) ||
        isFunction(candidate.drawBaseGlobe) ||
        isFunction(candidate.getReceipt) ||
        isFunction(candidate.getCanvasStationReceipt)
      )
    )) || null;
  }

  function resolverForKey(key) {
    if (key === "hexFourPairAuthority") return resolveHexFourPairAuthority;
    if (key === "hexSurface") return resolveHexSurface;
    if (key === "canvasHub") return resolveCanvasHub;
    return () => null;
  }

  function updateAssetState(key, authority, extra = {}) {
    const loaded = Boolean(authority);
    const actualContract = loaded ? getContract(authority) : "UNKNOWN";

    if (key === "hexFourPairAuthority") {
      state.hexFourPairAuthorityLoaded = loaded;
      state.hexFourPairAuthorityContract = actualContract;
      state.hexFourPairAuthorityContractRecognized = contractMatches(actualContract, EXPECTED_HEX_FOUR_PAIR_CONTRACT);
      state.hexFourPairAuthorityLoadStatus = loaded ? "LOADED_AND_AVAILABLE" : (extra.status || state.hexFourPairAuthorityLoadStatus || "NOT_FOUND");
      state.hexFourPairAuthorityLoadError = extra.error || "";
    }

    if (key === "hexSurface") {
      state.hexSurfaceLoaded = loaded;
      state.hexSurfaceContract = actualContract;
      state.hexSurfaceContractRecognized = contractMatches(actualContract, EXPECTED_HEX_SURFACE_CONTRACT);
      state.hexSurfaceLoadStatus = loaded ? "LOADED_AND_AVAILABLE" : (extra.status || state.hexSurfaceLoadStatus || "NOT_FOUND");
      state.hexSurfaceLoadError = extra.error || "";
    }

    if (key === "canvasHub") {
      state.canvasHubLoaded = loaded;
      state.canvasHubContract = actualContract;
      state.canvasHubContractRecognized = contractMatches(actualContract, EXPECTED_CANVAS_CONTRACT);
      state.canvasHubLoadStatus = loaded ? "LOADED_AND_AVAILABLE" : (extra.status || state.canvasHubLoadStatus || "NOT_FOUND");
      state.canvasHubLoadError = extra.error || "";
      state.canvasLoadedByIndex = loaded;
    }

    publishDataset();
    return loaded;
  }

  function refreshVisibleExpressionChainState() {
    updateAssetState("hexFourPairAuthority", resolveHexFourPairAuthority());
    updateAssetState("hexSurface", resolveHexSurface());
    updateAssetState("canvasHub", resolveCanvasHub());

    state.visibleExpressionChainLoadComplete = Boolean(
      state.hexFourPairAuthorityLoaded &&
      state.hexSurfaceLoaded &&
      state.canvasHubLoaded
    );

    if (state.visibleExpressionChainLoadComplete) {
      state.visibleExpressionChainLoadHeld = false;
      state.visibleExpressionChainLoadHeldReason = "NONE";
    }

    publishDataset();
    return getVisibleExpressionChainReceipt();
  }

  function assetScriptId(file) {
    return `hearth-index-visible-expression-loader-${safeString(file).replace(/[^a-zA-Z0-9]+/g, "-")}`;
  }

  function assetScriptSrc(file, cacheKey) {
    const separator = safeString(file).includes("?") ? "&" : "?";
    return `${file}${separator}v=${encodeURIComponent(cacheKey || RENEWAL_CONTRACT)}`;
  }

  function existingScriptForFile(file) {
    if (!doc) return null;
    const scripts = qsa("script[src]");
    return scripts.find((script) => safeString(script.getAttribute("src")).includes(file)) || null;
  }

  function loadScriptForAsset(asset) {
    return new Promise((resolve) => {
      if (!doc || !doc.head) {
        resolve({ ok: false, status: "DOCUMENT_HEAD_NOT_AVAILABLE", error: "document.head unavailable" });
        return;
      }

      const resolver = resolverForKey(asset.key);
      const already = resolver();

      if (already) {
        updateAssetState(asset.key, already, { status: "ALREADY_AVAILABLE" });
        resolve({ ok: true, status: "ALREADY_AVAILABLE", authority: already });
        return;
      }

      const existing = existingScriptForFile(asset.file);

      if (existing && existing.dataset && existing.dataset.hearthIndexVisibleExpressionLoaded === "true") {
        const authority = resolver();
        updateAssetState(asset.key, authority, { status: authority ? "EXISTING_SCRIPT_AVAILABLE" : "EXISTING_SCRIPT_NO_AUTHORITY" });
        resolve({ ok: Boolean(authority), status: authority ? "EXISTING_SCRIPT_AVAILABLE" : "EXISTING_SCRIPT_NO_AUTHORITY", authority });
        return;
      }

      const script = existing || doc.createElement("script");

      script.id = script.id || assetScriptId(asset.file);
      script.async = false;
      script.defer = false;
      script.dataset.hearthIndexVisibleExpressionLoader = RENEWAL_CONTRACT;
      script.dataset.hearthIndexVisibleExpressionAssetKey = asset.key;
      script.dataset.hearthIndexVisibleExpressionAssetFile = asset.file;
      script.dataset.hearthIndexVisibleExpressionExpectedContract = asset.expectedContract;

      const done = (ok, status, error = "") => {
        const authority = resolver();

        if (script.dataset) {
          script.dataset.hearthIndexVisibleExpressionLoaded = String(Boolean(authority));
          script.dataset.hearthIndexVisibleExpressionLoadStatus = status;
          script.dataset.hearthIndexVisibleExpressionLoadError = error;
          script.dataset.hearthIndexVisibleExpressionActualContract = authority ? getContract(authority) : "UNKNOWN";
        }

        updateAssetState(asset.key, authority, { status, error });

        resolve({
          ok: Boolean(ok && authority),
          status,
          error,
          authority: authority || null,
          actualContract: authority ? getContract(authority) : "UNKNOWN"
        });
      };

      script.onload = () => {
        root.setTimeout(() => {
          const authority = resolver();
          done(Boolean(authority), authority ? "SCRIPT_LOADED_AUTHORITY_AVAILABLE" : "SCRIPT_LOADED_AUTHORITY_NOT_FOUND", authority ? "" : "authority global not found after script load");
        }, 0);
      };

      script.onerror = () => {
        done(false, "SCRIPT_LOAD_ERROR", `failed to load ${asset.file}`);
      };

      if (!existing) {
        script.src = assetScriptSrc(asset.file, RENEWAL_CONTRACT);
        doc.head.appendChild(script);
      } else {
        root.setTimeout(() => {
          const authority = resolver();
          done(Boolean(authority), authority ? "EXISTING_SCRIPT_AUTHORITY_AVAILABLE" : "EXISTING_SCRIPT_AUTHORITY_NOT_FOUND", authority ? "" : "existing script present but authority global not found");
        }, 0);
      }
    });
  }

  async function loadVisibleExpressionChain(reason = "boot") {
    state.visibleExpressionChainLoadStarted = true;
    state.visibleExpressionChainLoadAttemptCount += 1;
    state.visibleExpressionChainLoadLastReason = safeString(reason, "boot");
    state.visibleExpressionChainLoadPromiseActive = true;
    state.visibleExpressionChainLoadHeld = false;
    state.visibleExpressionChainLoadHeldReason = "LOADING";
    state.visibleExpressionChainLoadLastError = "";
    publishDataset();

    record("VISIBLE_EXPRESSION_CHAIN_LOAD_STARTED", {
      reason,
      files: ASSET_CHAIN.map((asset) => asset.file)
    });

    for (const asset of ASSET_CHAIN) {
      const result = await loadScriptForAsset(asset);

      record("VISIBLE_EXPRESSION_ASSET_LOAD_RESULT", {
        key: asset.key,
        file: asset.file,
        ok: result.ok,
        status: result.status,
        actualContract: result.actualContract,
        error: result.error || ""
      });
    }

    refreshVisibleExpressionChainState();

    if (!state.hexFourPairAuthorityLoaded) {
      state.visibleExpressionChainLoadHeld = true;
      state.visibleExpressionChainLoadHeldReason = "HEX_FOUR_PAIR_AUTHORITY_NOT_LOADED";
    } else if (!state.hexSurfaceLoaded) {
      state.visibleExpressionChainLoadHeld = true;
      state.visibleExpressionChainLoadHeldReason = "HEX_SURFACE_NOT_LOADED";
    } else if (!state.canvasHubLoaded) {
      state.visibleExpressionChainLoadHeld = true;
      state.visibleExpressionChainLoadHeldReason = "CANVAS_HUB_NOT_LOADED";
    } else {
      state.visibleExpressionChainLoadHeld = false;
      state.visibleExpressionChainLoadHeldReason = "NONE";
      state.visibleExpressionChainLoadComplete = true;
      state.visibleExpressionChainLoadCompleteCount += 1;
    }

    const canvasResult = callCanvasHubPublicApi(reason);

    state.visibleExpressionChainLoadPromiseActive = false;

    if (state.visibleExpressionChainLoadHeld) {
      state.visibleExpressionChainLoadLastError = state.visibleExpressionChainLoadHeldReason;
    }

    publishDataset();
    publishGlobals();
    updateStatusLine(`visibleExpressionChain:${state.visibleExpressionChainLoadHeld ? state.visibleExpressionChainLoadHeldReason : "complete"}`);

    record("VISIBLE_EXPRESSION_CHAIN_LOAD_COMPLETE", {
      reason,
      complete: state.visibleExpressionChainLoadComplete,
      held: state.visibleExpressionChainLoadHeld,
      heldReason: state.visibleExpressionChainLoadHeldReason,
      canvasBootResult: canvasResult
    });

    return getVisibleExpressionChainReceipt();
  }

  function startVisibleExpressionChainBridge(reason = "boot") {
    if (visibleExpressionChainPromise) return visibleExpressionChainPromise;

    visibleExpressionChainPromise = loadVisibleExpressionChain(reason)
      .catch((error) => {
        state.visibleExpressionChainLoadHeld = true;
        state.visibleExpressionChainLoadHeldReason = "VISIBLE_EXPRESSION_CHAIN_EXCEPTION";
        state.visibleExpressionChainLoadLastError = error && error.message ? error.message : String(error);
        state.visibleExpressionChainLoadPromiseActive = false;
        state.lastError = state.visibleExpressionChainLoadLastError;
        record("VISIBLE_EXPRESSION_CHAIN_EXCEPTION", { error: state.visibleExpressionChainLoadLastError });
        publishDataset();
        return getVisibleExpressionChainReceipt();
      })
      .finally(() => {
        visibleExpressionChainPromise = null;
      });

    return visibleExpressionChainPromise;
  }

  function callCanvasHubPublicApi(reason = "boot") {
    const canvas = resolveCanvasHub();

    state.canvasBootAttempted = true;
    state.canvasBootMethod = "NONE";
    state.canvasBootResult = "CANVAS_HUB_NOT_AVAILABLE";
    state.canvasBootError = "";

    if (!canvas) {
      publishDataset();
      return state.canvasBootResult;
    }

    const methods = ["boot", "init", "start", "mount"];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      state.canvasBootMethod = method;

      try {
        const result = canvas[method]({
          source: "HEARTH_INDEX_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE",
          sourceFile: FILE,
          contract: CONTRACT,
          renewalContract: RENEWAL_CONTRACT,
          reason,
          hexFourPairAuthorityLoaded: state.hexFourPairAuthorityLoaded,
          hexSurfaceLoaded: state.hexSurfaceLoaded,
          canvasHubLoaded: state.canvasHubLoaded,
          indexOwnsCanvasDrawing: false,
          indexOwnsHexTruth: false,
          indexOwnsVisualPass: false,
          f13Claimed: false,
          f21Claimed: false,
          visualPassClaimed: false
        });

        state.canvasBootResult = result === false ? "PUBLIC_API_RETURNED_FALSE" : "PUBLIC_API_CALLED";
        state.canvasBootedByIndex = true;
        state.canvasStartedByIndex = true;
        state.canvasLoadedByIndex = true;
        publishDataset();
        return state.canvasBootResult;
      } catch (error) {
        try {
          canvas[method]();
          state.canvasBootResult = "PUBLIC_API_CALLED_WITHOUT_OPTIONS";
          state.canvasBootedByIndex = true;
          state.canvasStartedByIndex = true;
          state.canvasLoadedByIndex = true;
          state.canvasBootError = "";
          publishDataset();
          return state.canvasBootResult;
        } catch (fallbackError) {
          state.canvasBootResult = "PUBLIC_API_ERROR";
          state.canvasBootError = fallbackError && fallbackError.message
            ? fallbackError.message
            : error && error.message
              ? error.message
              : String(fallbackError || error);
          publishDataset();
          return state.canvasBootResult;
        }
      }
    }

    if (isFunction(canvas.drawBaseGlobe)) {
      try {
        canvas.drawBaseGlobe();
        state.canvasBootMethod = "drawBaseGlobe";
        state.canvasBootResult = "PUBLIC_FALLBACK_DRAW_BASE_GLOBE_CALLED";
        state.canvasBootedByIndex = true;
        state.canvasStartedByIndex = true;
        state.canvasLoadedByIndex = true;
        publishDataset();
        return state.canvasBootResult;
      } catch (error) {
        state.canvasBootMethod = "drawBaseGlobe";
        state.canvasBootResult = "PUBLIC_FALLBACK_DRAW_BASE_GLOBE_ERROR";
        state.canvasBootError = error && error.message ? error.message : String(error);
        publishDataset();
        return state.canvasBootResult;
      }
    }

    state.canvasBootResult = "NO_PUBLIC_CANVAS_BOOT_METHOD";
    publishDataset();
    return state.canvasBootResult;
  }

  function updateStatusLine(message = "") {
    refreshRefs();

    if (refs.stageLabel) refs.stageLabel.textContent = "F3 · Front-end button authority restored";

    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = [
        "buttons=functional",
        "native-anchors=preserved",
        "page-receipt-target=bound",
        "visible-expression-chain=loading-bridge",
        `canvas=${state.canvasHubLoaded ? "loaded" : "waiting"}`,
        `last=${message || state.lastAction}`
      ].join(" · ");
    }

    if (refs.latestEvent) {
      refs.latestEvent.textContent = `latest=${state.observedHtmlContract && state.observedHtmlContract !== "UNKNOWN" ? state.observedHtmlContract : CONTRACT}`;
    }

    if (refs.progressFill) refs.progressFill.style.width = state.canvasHubLoaded ? "55%" : "34%";
    if (refs.progressPercent) refs.progressPercent.textContent = state.canvasHubLoaded ? "55%" : "34%";

    if (refs.routeStatus) {
      const resolved = resolveActiveReceiptText();
      refs.routeStatus.textContent = resolved.text || getIndexReceiptText();
    }
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

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

    html.dataset.hearthIndexButtonAuthorityResetActive = "true";
    html.dataset.hearthFrontendButtonAuthorityRestored = "true";
    html.dataset.hearthWindowDocumentCaptureSuppressionRetired = "true";
    html.dataset.hearthNativeAnchorDefaultPreserved = "true";
    html.dataset.hearthDirectButtonBindingActive = "true";

    html.dataset.hearthPageReceiptTargetBindingActive = "true";
    html.dataset.hearthPageReceiptAvailable = String(state.pageReceiptAvailable);
    html.dataset.hearthActiveReceiptSource = state.activeReceiptSource;
    html.dataset.hearthCopiedReceiptSource = state.copiedReceiptSource;
    html.dataset.hearthShownReceiptSource = state.shownReceiptSource;
    html.dataset.hearthCurrentHtmlContractRecognized = String(state.currentHtmlContractRecognized);
    html.dataset.hearthObservedHtmlContract = state.observedHtmlContract;

    html.dataset.hearthVisibleExpressionChainLoaderBridgeActive = "true";
    html.dataset.hearthVisibleExpressionChainLoadStarted = String(state.visibleExpressionChainLoadStarted);
    html.dataset.hearthVisibleExpressionChainLoadComplete = String(state.visibleExpressionChainLoadComplete);
    html.dataset.hearthVisibleExpressionChainLoadHeld = String(state.visibleExpressionChainLoadHeld);
    html.dataset.hearthVisibleExpressionChainLoadHeldReason = state.visibleExpressionChainLoadHeldReason;
    html.dataset.hearthVisibleExpressionChainLoadAttemptCount = String(state.visibleExpressionChainLoadAttemptCount);
    html.dataset.hearthVisibleExpressionChainLoadCompleteCount = String(state.visibleExpressionChainLoadCompleteCount);
    html.dataset.hearthVisibleExpressionChainLoadLastReason = state.visibleExpressionChainLoadLastReason;
    html.dataset.hearthVisibleExpressionChainLoadLastError = state.visibleExpressionChainLoadLastError;
    html.dataset.hearthVisibleExpressionChainLoadPromiseActive = String(state.visibleExpressionChainLoadPromiseActive);

    html.dataset.hearthHexFourPairAuthorityFile = HEX_FOUR_PAIR_FILE;
    html.dataset.hearthHexFourPairAuthorityLoaded = String(state.hexFourPairAuthorityLoaded);
    html.dataset.hearthHexFourPairAuthorityContract = state.hexFourPairAuthorityContract;
    html.dataset.hearthHexFourPairAuthorityExpectedContract = EXPECTED_HEX_FOUR_PAIR_CONTRACT;
    html.dataset.hearthHexFourPairAuthorityContractRecognized = String(state.hexFourPairAuthorityContractRecognized);
    html.dataset.hearthHexFourPairAuthorityLoadStatus = state.hexFourPairAuthorityLoadStatus;
    html.dataset.hearthHexFourPairAuthorityLoadError = state.hexFourPairAuthorityLoadError;

    html.dataset.hearthHexSurfaceFile = HEX_SURFACE_FILE;
    html.dataset.hearthHexSurfaceLoaded = String(state.hexSurfaceLoaded);
    html.dataset.hearthHexSurfaceContract = state.hexSurfaceContract;
    html.dataset.hearthHexSurfaceExpectedContract = EXPECTED_HEX_SURFACE_CONTRACT;
    html.dataset.hearthHexSurfaceContractRecognized = String(state.hexSurfaceContractRecognized);
    html.dataset.hearthHexSurfaceLoadStatus = state.hexSurfaceLoadStatus;
    html.dataset.hearthHexSurfaceLoadError = state.hexSurfaceLoadError;

    html.dataset.hearthCanvasFile = CANVAS_FILE;
    html.dataset.hearthCanvasHubLoaded = String(state.canvasHubLoaded);
    html.dataset.hearthCanvasHubContract = state.canvasHubContract;
    html.dataset.hearthCanvasHubExpectedContract = EXPECTED_CANVAS_CONTRACT;
    html.dataset.hearthCanvasHubContractRecognized = String(state.canvasHubContractRecognized);
    html.dataset.hearthCanvasHubLoadStatus = state.canvasHubLoadStatus;
    html.dataset.hearthCanvasHubLoadError = state.canvasHubLoadError;

    html.dataset.hearthCanvasBootAttempted = String(state.canvasBootAttempted);
    html.dataset.hearthCanvasBootMethod = state.canvasBootMethod;
    html.dataset.hearthCanvasBootResult = state.canvasBootResult;
    html.dataset.hearthCanvasBootError = state.canvasBootError;
    html.dataset.hearthCanvasLoadedByIndex = String(state.canvasLoadedByIndex);
    html.dataset.hearthCanvasStartedByIndex = String(state.canvasStartedByIndex);
    html.dataset.hearthCanvasBootedByIndex = String(state.canvasBootedByIndex);

    html.dataset.hearthRouteConductorLoadedByIndex = "false";
    html.dataset.hearthRouteConductorHandoffByIndex = "false";
    html.dataset.hearthRouteConductorOwnedByIndex = "false";
    html.dataset.hearthDiagnosticRailLoadedByIndex = "false";
    html.dataset.hearthDiagnosticRailOwnedByIndex = "false";

    html.dataset.hearthCopyDiagnosticBound = String(state.copyDiagnosticBound);
    html.dataset.hearthToggleReceiptBound = String(state.toggleReceiptBound);
    html.dataset.hearthDiagnosticAnchorBound = String(state.diagnosticAnchorBound);
    html.dataset.hearthInspectPlanetBound = String(state.inspectPlanetBound);
    html.dataset.hearthExpandCockpitBound = String(state.expandCockpitBound);
    html.dataset.hearthPortalAnchorsBound = String(state.portalAnchorsBound);
    html.dataset.hearthDetailsDrawersBound = String(state.detailsDrawersBound);
    html.dataset.hearthLastButtonAction = state.lastAction;
    html.dataset.hearthLastButtonActionAt = state.lastActionAt;

    html.dataset.hearthF13Claimed = "false";
    html.dataset.hearthF21Claimed = "false";
    html.dataset.hearthReadyTextClaimed = "false";
    html.dataset.visualPassClaimed = "false";
    html.dataset.generatedImage = "false";
    html.dataset.graphicBox = "false";
    html.dataset.webgl = "false";
  }

  function bindControls() {
    refreshRefs();
    injectControlAuthorityStyle();
    ensureEmergencyDiagnosticAnchor();
    refreshRefs();

    state.copyDiagnosticBound = bindButton(refs.copyButton, "copyDiagnostic", copyDiagnostic);
    state.toggleReceiptBound = bindButton(refs.toggleReceiptButton, "toggleReceipt", toggleReceiptPanel);
    state.inspectPlanetBound = bindButton(refs.inspectButton, "inspectPlanet", () => setInspectMode(!state.inspectModeActive));
    state.expandCockpitBound = bindButton(refs.collapseButton, "toggleCockpit", toggleCockpitMode);

    if (refs.showDiagnosticTab) {
      bindButton(refs.showDiagnosticTab, "showDiagnostic", () => setInspectMode(false));
    }

    refs.diagnosticAnchors.forEach((anchor) => bindAnchor(anchor, "openDiagnosticRail"));
    refs.portalLinks.forEach((anchor) => bindAnchor(anchor, "portalNativeNavigation"));
    refs.summaries.forEach(bindSummary);

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

    refreshVisibleExpressionChainState();

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
      visibleExpressionChainLoaderBridgeActive: true,
      hexFourPairAuthorityLoaded: state.hexFourPairAuthorityLoaded,
      hexSurfaceLoaded: state.hexSurfaceLoaded,
      canvasHubLoaded: state.canvasHubLoaded,
      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootResult: state.canvasBootResult
    };
  }

  function boot() {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    auditHtml();
    bindControls();
    startVisibleExpressionChainBridge("boot");

    state.bootComplete = true;

    publishGlobals();
    markAction("bootComplete");

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      startVisibleExpressionChainBridge("postBootRebind");
      publishGlobals();
      markAction("postBootRebind");
    }, 350);

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      startVisibleExpressionChainBridge("lateRebind");
      publishGlobals();
      markAction("lateRebind");
    }, 1200);

    return getReceipt();
  }

  function getVisibleExpressionChainReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      packetType: "HEARTH_INDEX_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_RECEIPT",
      route: ROUTE,
      file: FILE,

      visibleExpressionChainLoaderBridgeActive: true,
      visibleExpressionChainLoadStarted: state.visibleExpressionChainLoadStarted,
      visibleExpressionChainLoadComplete: state.visibleExpressionChainLoadComplete,
      visibleExpressionChainLoadHeld: state.visibleExpressionChainLoadHeld,
      visibleExpressionChainLoadHeldReason: state.visibleExpressionChainLoadHeldReason,
      visibleExpressionChainLoadAttemptCount: state.visibleExpressionChainLoadAttemptCount,
      visibleExpressionChainLoadCompleteCount: state.visibleExpressionChainLoadCompleteCount,
      visibleExpressionChainLoadLastReason: state.visibleExpressionChainLoadLastReason,
      visibleExpressionChainLoadLastError: state.visibleExpressionChainLoadLastError,

      hexFourPairAuthorityFile: HEX_FOUR_PAIR_FILE,
      hexFourPairAuthorityLoaded: state.hexFourPairAuthorityLoaded,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityExpectedContract: EXPECTED_HEX_FOUR_PAIR_CONTRACT,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairAuthorityLoadStatus: state.hexFourPairAuthorityLoadStatus,
      hexFourPairAuthorityLoadError: state.hexFourPairAuthorityLoadError,

      hexSurfaceFile: HEX_SURFACE_FILE,
      hexSurfaceLoaded: state.hexSurfaceLoaded,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceExpectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,
      hexSurfaceLoadStatus: state.hexSurfaceLoadStatus,
      hexSurfaceLoadError: state.hexSurfaceLoadError,

      canvasFile: CANVAS_FILE,
      canvasHubLoaded: state.canvasHubLoaded,
      canvasHubContract: state.canvasHubContract,
      canvasHubExpectedContract: EXPECTED_CANVAS_CONTRACT,
      canvasHubContractRecognized: state.canvasHubContractRecognized,
      canvasHubLoadStatus: state.canvasHubLoadStatus,
      canvasHubLoadError: state.canvasHubLoadError,

      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootMethod: state.canvasBootMethod,
      canvasBootResult: state.canvasBootResult,
      canvasBootError: state.canvasBootError,
      canvasLoadedByIndex: state.canvasLoadedByIndex,
      canvasStartedByIndex: state.canvasStartedByIndex,
      canvasBootedByIndex: state.canvasBootedByIndex,

      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      indexOwnsHexTruth: false,
      indexOwnsHexSurfaceTruth: false,
      indexOwnsRouteConductorAuthority: false,
      routeConductorLoadedByIndex: false,
      routeConductorHandoffByIndex: false,
      routeConductorOwnedByIndex: false,

      f13Claimed: false,
      f21Claimed: false,
      readyTextClaimed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

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
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      currentHtmlContract: CURRENT_HTML_CONTRACT,
      lineageHtmlContract: LINEAGE_HTML_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,

      bootStarted: state.bootStarted,
      bootComplete: state.bootComplete,
      controlStyleInjected: state.controlStyleInjected,

      buttonAuthorityActive: true,
      frontendButtonAuthorityRestored: true,
      globalSuppressionAvoided: true,
      windowDocumentCaptureSuppressionRetired: true,
      nativeAnchorDefaultPreserved: true,
      directButtonBindingActive: true,
      delegatedButtonBindingActive: true,
      detailsSummaryBindingActive: true,

      pageReceiptTargetBindingActive: true,
      pageReceiptAvailable: state.pageReceiptAvailable,
      activeReceiptSource: state.activeReceiptSource,
      copiedReceiptSource: state.copiedReceiptSource,
      shownReceiptSource: state.shownReceiptSource,

      visibleExpressionChainReceipt: getVisibleExpressionChainReceipt(),

      visibleExpressionChainLoaderBridgeActive: true,
      visibleExpressionChainLoadStarted: state.visibleExpressionChainLoadStarted,
      visibleExpressionChainLoadComplete: state.visibleExpressionChainLoadComplete,
      visibleExpressionChainLoadHeld: state.visibleExpressionChainLoadHeld,
      visibleExpressionChainLoadHeldReason: state.visibleExpressionChainLoadHeldReason,

      hexFourPairAuthorityLoaded: state.hexFourPairAuthorityLoaded,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,

      hexSurfaceLoaded: state.hexSurfaceLoaded,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,

      canvasHubLoaded: state.canvasHubLoaded,
      canvasHubContract: state.canvasHubContract,
      canvasHubContractRecognized: state.canvasHubContractRecognized,
      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootMethod: state.canvasBootMethod,
      canvasBootResult: state.canvasBootResult,
      canvasBootError: state.canvasBootError,
      canvasLoadedByIndex: state.canvasLoadedByIndex,
      canvasStartedByIndex: state.canvasStartedByIndex,
      canvasBootedByIndex: state.canvasBootedByIndex,

      copyDiagnosticBound: state.copyDiagnosticBound,
      toggleReceiptBound: state.toggleReceiptBound,
      diagnosticAnchorBound: state.diagnosticAnchorBound,
      inspectPlanetBound: state.inspectPlanetBound,
      expandCockpitBound: state.expandCockpitBound,
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

      routeConductorLoadedByIndex: false,
      routeConductorHandoffByIndex: false,
      routeConductorOwnedByIndex: false,
      diagnosticRailLoadedByIndex: false,
      diagnosticRailOwnedByIndex: false,

      htmlOwnsVisibleShell: true,
      indexCreatesVisibleShell: false,
      indexOwnsButtonBindingOnly: false,
      indexOwnsButtonBindingAndLoaderBridgeOnly: true,
      indexOwnsRuntimeRelease: false,
      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      indexOwnsHexTruth: false,
      indexOwnsHexSurfaceTruth: false,
      indexOwnsRouteConductorHandoff: false,
      indexOwnsPageReceiptSelection: true,
      indexOwnsPageReceiptTruth: false,

      f13Claimed: false,
      f21Claimed: false,
      readyTextClaimed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

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
      line("diagnosticRoute", r.diagnosticRoute),
      "",
      "HTML_ALIGNMENT",
      line("currentHtmlContract", r.currentHtmlContract),
      line("lineageHtmlContract", r.lineageHtmlContract),
      line("previousHtmlContract", r.previousHtmlContract),
      line("observedHtmlContract", r.observedHtmlContract),
      line("currentHtmlContractRecognized", r.currentHtmlContractRecognized),
      "",
      "VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE",
      line("visibleExpressionChainLoaderBridgeActive", c.visibleExpressionChainLoaderBridgeActive),
      line("visibleExpressionChainLoadStarted", c.visibleExpressionChainLoadStarted),
      line("visibleExpressionChainLoadComplete", c.visibleExpressionChainLoadComplete),
      line("visibleExpressionChainLoadHeld", c.visibleExpressionChainLoadHeld),
      line("visibleExpressionChainLoadHeldReason", c.visibleExpressionChainLoadHeldReason),
      line("visibleExpressionChainLoadAttemptCount", c.visibleExpressionChainLoadAttemptCount),
      line("visibleExpressionChainLoadCompleteCount", c.visibleExpressionChainLoadCompleteCount),
      line("visibleExpressionChainLoadLastReason", c.visibleExpressionChainLoadLastReason),
      line("visibleExpressionChainLoadLastError", c.visibleExpressionChainLoadLastError),
      "",
      "VISIBLE_EXPRESSION_CHAIN_FILES",
      line("hexFourPairAuthorityFile", c.hexFourPairAuthorityFile),
      line("hexFourPairAuthorityLoaded", c.hexFourPairAuthorityLoaded),
      line("hexFourPairAuthorityContract", c.hexFourPairAuthorityContract),
      line("hexFourPairAuthorityExpectedContract", c.hexFourPairAuthorityExpectedContract),
      line("hexFourPairAuthorityContractRecognized", c.hexFourPairAuthorityContractRecognized),
      line("hexFourPairAuthorityLoadStatus", c.hexFourPairAuthorityLoadStatus),
      line("hexFourPairAuthorityLoadError", c.hexFourPairAuthorityLoadError),
      line("hexSurfaceFile", c.hexSurfaceFile),
      line("hexSurfaceLoaded", c.hexSurfaceLoaded),
      line("hexSurfaceContract", c.hexSurfaceContract),
      line("hexSurfaceExpectedContract", c.hexSurfaceExpectedContract),
      line("hexSurfaceContractRecognized", c.hexSurfaceContractRecognized),
      line("hexSurfaceLoadStatus", c.hexSurfaceLoadStatus),
      line("hexSurfaceLoadError", c.hexSurfaceLoadError),
      line("canvasFile", c.canvasFile),
      line("canvasHubLoaded", c.canvasHubLoaded),
      line("canvasHubContract", c.canvasHubContract),
      line("canvasHubExpectedContract", c.canvasHubExpectedContract),
      line("canvasHubContractRecognized", c.canvasHubContractRecognized),
      line("canvasHubLoadStatus", c.canvasHubLoadStatus),
      line("canvasHubLoadError", c.canvasHubLoadError),
      "",
      "CANVAS_PUBLIC_API_CALL",
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
      line("globalSuppressionAvoided", r.globalSuppressionAvoided),
      line("windowDocumentCaptureSuppressionRetired", r.windowDocumentCaptureSuppressionRetired),
      line("nativeAnchorDefaultPreserved", r.nativeAnchorDefaultPreserved),
      line("directButtonBindingActive", r.directButtonBindingActive),
      line("detailsSummaryBindingActive", r.detailsSummaryBindingActive),
      "",
      "BOUND_CONTROLS",
      line("copyDiagnosticBound", r.copyDiagnosticBound),
      line("toggleReceiptBound", r.toggleReceiptBound),
      line("diagnosticAnchorBound", r.diagnosticAnchorBound),
      line("inspectPlanetBound", r.inspectPlanetBound),
      line("expandCockpitBound", r.expandCockpitBound),
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
      "OWNERSHIP",
      line("htmlOwnsVisibleShell", r.htmlOwnsVisibleShell),
      line("indexCreatesVisibleShell", r.indexCreatesVisibleShell),
      line("indexOwnsButtonBindingOnly", r.indexOwnsButtonBindingOnly),
      line("indexOwnsButtonBindingAndLoaderBridgeOnly", r.indexOwnsButtonBindingAndLoaderBridgeOnly),
      line("indexOwnsRuntimeRelease", r.indexOwnsRuntimeRelease),
      line("indexOwnsCanvasDrawing", r.indexOwnsCanvasDrawing),
      line("indexOwnsCanvasTruth", r.indexOwnsCanvasTruth),
      line("indexOwnsHexTruth", r.indexOwnsHexTruth),
      line("indexOwnsHexSurfaceTruth", r.indexOwnsHexSurfaceTruth),
      line("indexOwnsRouteConductorHandoff", r.indexOwnsRouteConductorHandoff),
      line("routeConductorLoadedByIndex", r.routeConductorLoadedByIndex),
      line("routeConductorHandoffByIndex", r.routeConductorHandoffByIndex),
      line("routeConductorOwnedByIndex", r.routeConductorOwnedByIndex),
      line("diagnosticRailLoadedByIndex", r.diagnosticRailLoadedByIndex),
      line("diagnosticRailOwnedByIndex", r.diagnosticRailOwnedByIndex),
      "",
      "NO_CLAIMS",
      line("f13Claimed", r.f13Claimed),
      line("f21Claimed", r.f21Claimed),
      line("readyTextClaimed", r.readyTextClaimed),
      line("visualPassClaimed", r.visualPassClaimed),
      line("generatedImage", r.generatedImage),
      line("graphicBox", r.graphicBox),
      line("webGL", r.webGL),
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
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.indexJs = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.frontendButtonAuthorityReset = api;
    root.HEARTH.buttonAuthority = api;
    root.HEARTH.visibleExpressionChainLoaderBridge = api;
    root.HEARTH.indexJsReceipt = getReceipt();
    root.HEARTH.indexJsReceiptText = getIndexReceiptText;
    root.HEARTH.indexJsPageReceiptText = getPageReceiptText;
    root.HEARTH.indexJsActiveReceiptText = getActiveReceiptText;
    root.HEARTH.visibleExpressionChainReceipt = getVisibleExpressionChainReceipt;

    root.DEXTER_LAB.hearthIndexJs = api;
    root.DEXTER_LAB.hearthFrontendButtonAuthorityReset = api;
    root.DEXTER_LAB.hearthVisibleExpressionChainLoaderBridge = api;

    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE = api;

    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_RECEIPT = getVisibleExpressionChainReceipt();
  }

  const api = Object.freeze({
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

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    pageReceiptTargetBindingActive: true,
    visibleExpressionChainLoaderBridgeActive: true,

    hexFourPairAuthorityFile: HEX_FOUR_PAIR_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    canvasFile: CANVAS_FILE,

    routeConductorLoadedByIndex: false,
    routeConductorHandoffByIndex: false,
    routeConductorOwnedByIndex: false,
    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    indexOwnsCanvasDrawing: false,
    indexOwnsCanvasTruth: false,
    indexOwnsHexTruth: false,
    indexOwnsHexSurfaceTruth: false,
    indexOwnsRouteConductorAuthority: false,

    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    get state() {
      return state;
    }
  });

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
