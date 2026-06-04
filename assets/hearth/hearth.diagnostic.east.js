// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Full-file replacement.
// Diagnostic rail EAST child only.
// Internal implementation:
// HEARTH_DIAGNOSTIC_EAST_PLANETARY_CONTROL_FOOTPRINT_SOURCE_READER_TNT_v5
// Purpose:
// - Serve NORTH with receipt-bearing served-source evidence.
// - Read the Hearth target iframe/window, not the diagnostic receiver window.
// - Recognize current Hearth HTML, Index, and Route Conductor spread without false CASE_5.
// - Publish planetary-control footprint fields before /assets/hearth/hearth.controls.js exists.
// - Treat missing controls as EXPECTED_NOT_YET_BUILT, not failure, not CASE_5.
// - Preserve EAST as served-source evidence only.
// - Preserve NORTH as final PRIMARY_CASE and recommendation authority.
// - Preserve WEST as rendered-target authority.
// - Preserve SOUTH as report-output authority.
// - Preserve no repair, no cache mutation, no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - rendered-target probing
// - hit-test inspection
// - pointer-events inspection
// - overlay inspection
// - runtime release inspection
// - synthetic activation
// - final PRIMARY_CASE selection
// - final recommendation selection
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release
// - North latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_PLANETARY_CONTROL_FOOTPRINT_SOURCE_READER_TNT_v5";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_EAST_PLANETARY_CONTROL_FOOTPRINT_SOURCE_READER_RECEIPT_v5";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_PRIMARY_COMPATIBILITY_SPLIT_TNT_v4";
  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_TNT_v3";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";

  const VERSION =
    "2026-06-04.hearth-diagnostic-east-planetary-control-footprint-source-reader-v5";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4";

  const DIAGNOSTIC_RECEIVER_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_PLANETARY_BUILD_OBSERVER_RECEIVER_TNT_v2_2";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4",
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const CURRENT_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ACCEPTED_INDEX_JS_CONTRACTS = Object.freeze([
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4",
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";

  const COMPAT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";

  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEARTH_JS_CONTROL_FUNNEL_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_JS_FILE = "/showroom/globe/hearth/index.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: "/assets/hearth/hearth.canvas.finger.composite.js"
  });

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    BLOCKED: "BLOCKED",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED",
    WAITING_CONTROL_FILE: "WAITING_CONTROL_FILE",
    READY: "READY",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    COMPLETE: "COMPLETE",
    HELD: "HELD",
    NONE: "none"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED"
  });

  const SUPPORT = Object.freeze({
    TRUE: "true",
    FALSE: "false",
    UNKNOWN: FALLBACK.UNKNOWN,
    INSUFFICIENT_EVIDENCE: FALLBACK.INSUFFICIENT_EVIDENCE
  });

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  let lastState = null;
  let lastEvidencePacket = null;

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
    return String(value);
  }

  function safeTrim(value, fallback = "") {
    return safeString(value, fallback).replace(/\s+/g, " ").trim();
  }

  function bounded(value, limit = 2200) {
    return safeTrim(value).slice(0, limit);
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function addNote(state, note) {
    const clean = bounded(note, 1600);
    if (!state || !Array.isArray(state.eastSecondaryEvidenceNotes) || !clean) return;
    if (!state.eastSecondaryEvidenceNotes.includes(clean)) {
      state.eastSecondaryEvidenceNotes.push(clean);
    }
  }

  function readPath(base, path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function readDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function readBodyDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.body ? targetDocument.body.dataset || {} : {};
    } catch (_error) {
      return {};
    }
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function normalizeSrc(src, targetWindow) {
    const text = safeString(src);
    if (!text) return "";

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(text, origin);
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return text;
    }
  }

  function scriptMatches(script, path, targetWindow) {
    const src = normalizeSrc(script && script.getAttribute ? script.getAttribute("src") : "", targetWindow);
    if (!src) return false;

    const cleanPath = safeString(path);
    const fileName = cleanPath.split("/").filter(Boolean).pop();

    return Boolean(
      src.includes(cleanPath) ||
      (fileName && src.endsWith(`/${fileName}`)) ||
      (fileName && src.includes(`/${fileName}?`))
    );
  }

  function findScriptByPaths(targetDocument, paths, targetWindow) {
    const scripts = qa(targetDocument, "script[src]");
    return scripts.find((script) => paths.some((path) => scriptMatches(script, path, targetWindow))) || null;
  }

  function readCacheKeyFromSrc(src, targetWindow) {
    const text = safeString(src);

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(text, origin);
      return url.searchParams.get("v") || url.searchParams.get("cache") || url.searchParams.get("version") || "";
    } catch (_error) {
      const match = text.match(/[?&](?:v|cache|version)=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
  }

  function contractRecognized(contract, accepted) {
    const c = safeString(contract);
    if (!c || c === FALLBACK.UNKNOWN || c === FALLBACK.NOT_FOUND || c === FALLBACK.UNREADABLE) {
      return FALLBACK.UNKNOWN;
    }

    return accepted.includes(c) ? "true" : "false";
  }

  function readAuthorityContract(authority) {
    if (!authority || !isObject(authority)) return "";

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) {
          const contract = firstDefined(
            result.contract,
            result.CONTRACT,
            result.currentContract,
            result.currentRouteConductorContract,
            result.routeConductorContract,
            result.canvasContract,
            result.controlsContract
          );
          if (contract) return safeString(contract);
        }
      } catch (_error) {}
    }

    return safeString(firstDefined(
      authority.contract,
      authority.CONTRACT,
      authority.currentContract,
      authority.currentRouteConductorContract,
      authority.routeConductorContract,
      authority.canvasContract,
      authority.controlsContract
    ), "");
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlsReceipt",
      "getState",
      "getStatus",
      "getReport"
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

    return null;
  }

  function findWindowAuthority(targetWindow, paths) {
    const win = targetWindow || root;

    for (const path of paths) {
      const value = readPath(win, path);
      if (value && isObject(value)) {
        return { path, authority: value, contract: readAuthorityContract(value), receipt: readAuthorityReceipt(value) };
      }
    }

    return { path: "NONE", authority: null, contract: "", receipt: null };
  }

  function findRouteConductorAuthority(targetWindow) {
    const found = findWindowAuthority(targetWindow, [
      "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
      "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor"
    ]);

    if (found.authority || found.contract) return found;

    try {
      const markerContract = safeString((targetWindow || root).__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ || "");
      if (markerContract) {
        return {
          path: "__HEARTH_ROUTE_CONDUCTOR_CONTRACT__",
          authority: null,
          contract: markerContract,
          receipt: null
        };
      }
    } catch (_error) {}

    return found;
  }

  function findIndexAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, [
      "HEARTH_INDEX_JS",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH.indexJs",
      "HEARTH.indexBridge",
      "HEARTH.frontendButtonAuthorityReset",
      "HEARTH.buttonAuthority",
      "DEXTER_LAB.hearthIndexJs",
      "DEXTER_LAB.hearthFrontendButtonAuthorityReset"
    ]);
  }

  function findControlsAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, [
      "HEARTH_CONTROLS",
      "HEARTH_PLANET_CONTROLS",
      "HEARTH_MOTION_TOUCH_CONTROLS",
      "HEARTH.controls",
      "HEARTH.planetControls",
      "HEARTH.motionTouchControls",
      "HEARTH.viewControls",
      "HEARTH.hearthControls",
      "DEXTER_LAB.hearthControls",
      "DEXTER_LAB.hearthPlanetControls",
      "DEXTER_LAB.hearthMotionTouchControls"
    ]);
  }

  function findCanvasAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, [
      "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_FINGER_MANAGER",
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS",
      "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasFingerManager",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvas"
    ]);
  }

  function routeMatches(targetWindow) {
    try {
      const win = targetWindow || root;
      const path = win.location && win.location.pathname ? win.location.pathname : "";
      return path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "");
    } catch (_error) {
      return false;
    }
  }

  function diagnosticRouteMatches(targetWindow) {
    try {
      const win = targetWindow || root;
      const path = win.location && win.location.pathname ? win.location.pathname : "";
      return path === DIAGNOSTIC_ROUTE || path === DIAGNOSTIC_ROUTE.replace(/\/$/, "");
    } catch (_error) {
      return false;
    }
  }

  function documentRoute(targetDocument) {
    try {
      const dataset = readDataset(targetDocument);
      const bodyDataset = readBodyDataset(targetDocument);
      return safeString(firstDefined(
        dataset.route,
        targetDocument.documentElement && targetDocument.documentElement.getAttribute("data-route"),
        bodyDataset.route
      ), "");
    } catch (_error) {
      return "";
    }
  }

  function isDiagnosticReceiverDocument(targetDocument, targetWindow) {
    const route = documentRoute(targetDocument);
    const dataset = readDataset(targetDocument);
    const contract = safeString(firstDefined(
      dataset.contract,
      targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.getAttribute("data-contract")
        : ""
    ), "");

    return Boolean(
      diagnosticRouteMatches(targetWindow) ||
      route === DIAGNOSTIC_ROUTE ||
      route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
      contract === DIAGNOSTIC_RECEIVER_CONTRACT ||
      /diagnostic/i.test(safeString(dataset.page || ""))
    );
  }

  function hasHearthSignals(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (isDiagnosticReceiverDocument(targetDocument, targetWindow)) return false;

      const html = targetDocument.documentElement;
      const body = targetDocument.body;
      const htmlData = readDataset(targetDocument);
      const bodyData = readBodyDataset(targetDocument);

      const route = safeString(html.getAttribute("data-route") || htmlData.route || "");
      const page = safeString(html.getAttribute("data-page") || htmlData.page || "");
      const alias = safeString(html.getAttribute("data-page-alias") || htmlData.pageAlias || "");
      const context = safeString(html.getAttribute("data-page-context") || htmlData.pageContext || "");
      const bodyRoute = body ? safeString(body.getAttribute("data-route") || bodyData.route || "") : "";

      return Boolean(
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        bodyRoute === TARGET_ROUTE ||
        bodyRoute === TARGET_ROUTE.replace(/\/$/, "") ||
        routeMatches(targetWindow) ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet factory|planet engine|mirrorland formation|visible globe/i.test(context) ||
        q(targetDocument, "#hearthCanvasMount") ||
        q(targetDocument, "[data-hearth-canvas-mount]") ||
        q(targetDocument, "#hearthGlobeStage") ||
        q(targetDocument, "[data-hearth-globe-stage]")
      );
    } catch (_error) {
      return false;
    }
  }

  function findDiagnosticTargetFrame(sourceDocument) {
    if (!sourceDocument) return null;

    return (
      q(sourceDocument, "#hearthDiagnosticTargetFrame") ||
      q(sourceDocument, "iframe[data-hearth-diagnostic-target-frame='true']") ||
      q(sourceDocument, "iframe[src='/showroom/globe/hearth/']") ||
      q(sourceDocument, "iframe[src*='/showroom/globe/hearth/']")
    );
  }

  function readFrame(frame, state) {
    try {
      if (!frame) return null;

      const targetWindow = frame.contentWindow || null;
      const targetDocument = targetWindow ? targetWindow.document : null;

      if (targetDocument && targetDocument.documentElement) {
        return {
          targetDocument,
          targetWindow,
          source: "diagnosticTargetFrame"
        };
      }

      addNote(state, "EAST_TARGET_FRAME_FOUND_BUT_DOCUMENT_INACCESSIBLE");
      return null;
    } catch (error) {
      addNote(state, `EAST_TARGET_FRAME_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`);
      return null;
    }
  }

  function resolveTargetDocument(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetWindow = opts.targetDocument.defaultView || opts.targetWindow || null;

      if (!isDiagnosticReceiverDocument(opts.targetDocument, targetWindow)) {
        state.diagnosticTargetAccessStatus = "SOURCE_TARGET_DOCUMENT_SUPPLIED";
        return { targetDocument: opts.targetDocument, targetWindow, source: "options.targetDocument" };
      }

      addNote(state, "EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_DOCUMENT_AS_TARGET");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && !isDiagnosticReceiverDocument(targetDocument, targetWindow)) {
          state.diagnosticTargetAccessStatus = "SOURCE_TARGET_WINDOW_SUPPLIED";
          return { targetDocument, targetWindow, source: "options.targetWindow" };
        }

        addNote(state, "EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_WINDOW_AS_TARGET");
      } catch (error) {
        state.diagnosticTargetAccessStatus = "TARGET_WINDOW_BLOCKED";
        state.diagnosticTargetAccessError = `TARGET_WINDOW_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`;
        addNote(state, state.diagnosticTargetAccessError);
      }
    }

    if (opts.frameElement) {
      const fromOptionFrame = readFrame(opts.frameElement, state);

      if (fromOptionFrame && !isDiagnosticReceiverDocument(fromOptionFrame.targetDocument, fromOptionFrame.targetWindow)) {
        state.diagnosticTargetAccessStatus = "SOURCE_TARGET_FRAME_SUPPLIED";
        return fromOptionFrame;
      }
    }

    const diagnosticFrame = findDiagnosticTargetFrame(doc);
    const fromDiscoveredFrame = readFrame(diagnosticFrame, state);

    if (fromDiscoveredFrame && !isDiagnosticReceiverDocument(fromDiscoveredFrame.targetDocument, fromDiscoveredFrame.targetWindow)) {
      state.diagnosticTargetAccessStatus = "SOURCE_DISCOVERED_DIAGNOSTIC_TARGET_FRAME";
      return fromDiscoveredFrame;
    }

    if (doc && doc.documentElement && !isDiagnosticReceiverDocument(doc, root) && (routeMatches(root) || hasHearthSignals(doc, root))) {
      state.diagnosticTargetAccessStatus = "SOURCE_CURRENT_HEARTH_DOCUMENT";
      return { targetDocument: doc, targetWindow: root, source: "currentHearthDocument" };
    }

    state.diagnosticTargetAccessStatus = "SOURCE_ONLY_NO_HEARTH_TARGET_DOCUMENT";
    state.diagnosticTargetAccessError = "NO_HEARTH_TARGET_DOCUMENT_AVAILABLE_TO_EAST";
    addNote(state, "EAST_SOURCE_ONLY_BASELINE_NO_HEARTH_TARGET_DOCUMENT_AVAILABLE");
    return { targetDocument: null, targetWindow: null, source: "none" };
  }

  function readHtmlEvidence(targetDocument, targetWindow, state) {
    if (!targetDocument || !targetDocument.documentElement) {
      state.expectedHtmlContract = CURRENT_HTML_CONTRACT;
      state.servedHtmlContract = FALLBACK.UNKNOWN;
      state.htmlContractRecognized = FALLBACK.UNKNOWN;
      return;
    }

    const html = targetDocument.documentElement;
    const dataset = readDataset(targetDocument);
    const bodyDataset = readBodyDataset(targetDocument);

    const served = safeString(firstDefined(
      dataset.contract,
      dataset.hearthHtmlContract,
      dataset.hearthShellContract,
      html.getAttribute("data-contract"),
      bodyDataset.hearthHtmlContract
    ), FALLBACK.UNKNOWN);

    state.expectedHtmlContract = CURRENT_HTML_CONTRACT;
    state.currentExpectedHtmlContract = CURRENT_HTML_CONTRACT;
    state.servedHtmlContract = served;

    if (served === DIAGNOSTIC_RECEIVER_CONTRACT || isDiagnosticReceiverDocument(targetDocument, targetWindow)) {
      state.htmlContractRecognized = FALLBACK.UNKNOWN;
      state.servedHtmlContract = FALLBACK.UNKNOWN;
      addNote(state, "DIAGNOSTIC_RECEIVER_HTML_CONTRACT_IGNORED_AS_NON_TARGET_SOURCE");
    } else {
      state.htmlContractRecognized = contractRecognized(served, ACCEPTED_HTML_CONTRACTS);
    }

    if (state.htmlContractRecognized === "true") {
      addNote(state, "HTML_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    } else if (state.htmlContractRecognized === "false") {
      addNote(state, `HTML_CONTRACT_UNRECOGNIZED:${served}`);
    }

    state.targetRouteSignal = safeString(firstDefined(
      dataset.route,
      html.getAttribute("data-route"),
      bodyDataset.route
    ), FALLBACK.UNKNOWN);

    state.planetContextSignal = safeString(firstDefined(
      dataset.pageContext,
      html.getAttribute("data-page-context"),
      dataset.publicFacingPurpose,
      bodyDataset.pageContext
    ), FALLBACK.UNKNOWN);
  }

  function readIndexEvidence(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const indexAuthority = findIndexAuthority(targetWindow);
    const script = target
      ? findScriptByPaths(target, [INDEX_JS_FILE, "index.js"], targetWindow)
      : null;

    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src"), targetWindow) : "";

    const dataset = target ? readDataset(target) : {};
    const authorityContract = indexAuthority.contract || "";
    const scriptContract = safeString(firstDefined(
      script && script.dataset ? script.dataset.hearthIndexJsContract : "",
      script && script.dataset ? script.dataset.jsSelectorCacheKey : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      cacheKey,
      dataset.hearthIndexJsContract,
      dataset.expectedIndexJsContract,
      dataset.selectorCacheBust
    ), "");

    const served = safeString(firstDefined(
      authorityContract,
      scriptContract,
      dataset.hearthIndexJsContract,
      dataset.expectedIndexJsContract
    ), FALLBACK.UNKNOWN);

    state.expectedIndexJsContract = CURRENT_INDEX_JS_CONTRACT;
    state.currentExpectedIndexJsContract = CURRENT_INDEX_JS_CONTRACT;
    state.servedIndexJsContract = served;
    state.indexScriptSrc = src;
    state.indexScriptPresent = boolText(Boolean(script));
    state.indexAuthoritySource = indexAuthority.path;
    state.indexContractRecognized = contractRecognized(served, ACCEPTED_INDEX_JS_CONTRACTS);

    if (state.indexContractRecognized === "true") {
      addNote(state, "INDEX_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    } else if (state.indexContractRecognized === "false") {
      addNote(state, `INDEX_CONTRACT_UNRECOGNIZED:${served}`);
    }

    if (!script && !authorityContract) {
      addNote(state, "INDEX_SCRIPT_OR_AUTHORITY_NOT_FOUND_IN_HEARTH_TARGET");
    }
  }

  function readRouteConductorEvidence(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const conductor = findRouteConductorAuthority(targetWindow);
    const script = target
      ? findScriptByPaths(target, [HEARTH_JS_CONTROL_FUNNEL_FILE, "hearth.js"], targetWindow)
      : null;

    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src"), targetWindow) : "";

    const dataset = target ? readDataset(target) : {};
    const authorityContract = conductor.contract || "";
    const scriptContract = safeString(firstDefined(
      script && script.dataset ? script.dataset.routeConductorCurrentContract : "",
      script && script.dataset ? script.dataset.hearthRouteConductorContract : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      cacheKey,
      dataset.hearthRouteConductorContract,
      dataset.routeConductorCurrentContract,
      dataset.expectedRouteConductorContract,
      dataset.routeConductorCurrent
    ), "");

    const served = safeString(firstDefined(
      authorityContract,
      scriptContract,
      dataset.hearthRouteConductorContract,
      dataset.expectedRouteConductorContract,
      dataset.routeConductorCurrentContract,
      dataset.routeConductorCurrent
    ), FALLBACK.UNKNOWN);

    state.expectedRouteConductorContract = CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    state.currentExpectedRouteConductorContract = CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    state.compatRouteConductorContract = COMPAT_ROUTE_CONDUCTOR_CONTRACT;
    state.lineageRouteConductorContract = LINEAGE_ROUTE_CONDUCTOR_CONTRACT;
    state.servedRouteConductorContract = served;
    state.routeConductorScriptSrc = src;
    state.routeConductorScriptPresent = boolText(Boolean(script));
    state.routeConductorAuthoritySource = conductor.path;
    state.routeConductorContractRecognized = contractRecognized(served, ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS);

    const v96 = served === CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    const v95 = served === COMPAT_ROUTE_CONDUCTOR_CONTRACT;
    const v94 = served === LINEAGE_ROUTE_CONDUCTOR_CONTRACT;

    state.primaryRouteConductorContractRecognized = boolText(
      v96 || v95 || v94 || state.routeConductorContractRecognized === "true",
      state.routeConductorContractRecognized
    );

    state.routeConductorV95PrimaryNotTreatedAsCase5 = boolText(v96 || v95);
    state.routeConductorV94LineageAccepted = boolText(v94 || v95 || v96);

    if (v96) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_COMPATIBILITY_SURFACE_ACCEPTED_UNDER_V9_6");
    } else if (v95) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5");
    } else if (v94) {
      addNote(state, "ACCEPTED_ROUTE_CONDUCTOR_CONTRACT_LINEAGE_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_SOURCE_FETCH_FALLBACK_DIRECT_FILE_MATCHED_NO_FALSE_CASE_5");
    } else if (state.routeConductorContractRecognized === "true") {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
    } else if (state.routeConductorContractRecognized === "false") {
      addNote(state, `ROUTE_CONDUCTOR_CONTRACT_UNRECOGNIZED:${served}`);
    }

    if (!script && !authorityContract) {
      addNote(state, "ROUTE_CONDUCTOR_SCRIPT_OR_AUTHORITY_NOT_FOUND_IN_HEARTH_TARGET");
    }
  }

  function readCanvasAndFingerFootprint(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const canvasAuthority = findCanvasAuthority(targetWindow);
    const canvasScript = target ? findScriptByPaths(target, [CANVAS_FILE, "hearth.canvas.js"], targetWindow) : null;
    const canvasReceipt = canvasAuthority.receipt || {};
    const dataset = target ? readDataset(target) : {};

    state.canvasFile = CANVAS_FILE;
    state.canvasScriptPresent = boolText(Boolean(canvasScript));
    state.canvasAuthoritySource = canvasAuthority.path;
    state.canvasContract = safeString(firstDefined(
      canvasAuthority.contract,
      canvasReceipt.contract,
      canvasReceipt.CONTRACT,
      dataset.hearthCanvasContract
    ), FALLBACK.UNKNOWN);

    state.canvasAuthorityStatus = canvasAuthority.authority || canvasAuthority.contract || canvasScript
      ? "CANVAS_SOURCE_FOOTPRINT_OBSERVED"
      : FALLBACK.UNKNOWN;

    state.visiblePlanetSourceStatus = (
      canvasReceipt.visiblePlanetProofReady === true ||
      canvasReceipt.baseGlobeVisibleCarrierReady === true ||
      dataset.hearthCanvasVisiblePlanetProofReady === "true" ||
      dataset.hearthSouthVisiblePlanetProofReady === "true"
    )
      ? "VISIBLE_PLANET_SOURCE_PROOF_OBSERVED"
      : "VISIBLE_PLANET_SOURCE_PROOF_NOT_REQUIRED_BY_EAST";

    const fingerStatuses = {};
    Object.keys(FINGER_FILES).forEach((key) => {
      const file = FINGER_FILES[key];
      const script = target ? findScriptByPaths(target, [file, file.split("/").pop()], targetWindow) : null;
      fingerStatuses[key] = {
        file,
        scriptPresent: Boolean(script),
        status: script ? "SCRIPT_PRESENT" : "EXPECTED_OR_EMBEDDED_NOT_CONFIRMED_BY_EAST"
      };
    });

    state.fingerFileFootprint = fingerStatuses;
    state.planetaryFileFootprintActive = true;
  }

  function controlAuthorityHasMotion(authority, receipt) {
    if (!authority && !receipt) return false;

    return Boolean(
      isFunction(authority && authority.attach) ||
      isFunction(authority && authority.mount) ||
      isFunction(authority && authority.start) ||
      isFunction(authority && authority.boot) ||
      isFunction(authority && authority.enableMotionTouch) ||
      isFunction(authority && authority.bindMotionTouch) ||
      isFunction(authority && authority.bindDrag) ||
      (receipt && (
        receipt.motionTouchReady === true ||
        receipt.dragReady === true ||
        receipt.viewControlReady === true ||
        receipt.controlsReady === true
      ))
    );
  }

  function readControlFootprint(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const controls = findControlsAuthority(targetWindow);
    const receipt = controls.receipt || {};
    const script = target ? findScriptByPaths(target, [CONTROL_FILE, "hearth.controls.js"], targetWindow) : null;
    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const dataset = target ? readDataset(target) : {};

    const controlContract = safeString(firstDefined(
      controls.contract,
      receipt.contract,
      receipt.CONTRACT,
      dataset.hearthControlsContract,
      dataset.hearthControlContract
    ), "");

    const controlsPresent = Boolean(script || controls.authority || controlContract);
    const motionReady = controlAuthorityHasMotion(controls.authority, receipt);

    state.planetaryControlSchemaActive = true;
    state.planetaryControlFootprintActive = true;

    state.controlFile = CONTROL_FILE;
    state.controlFileExpected = true;
    state.controlScriptSrc = src;
    state.controlScriptPresent = boolText(Boolean(script));
    state.controlAuthoritySource = controls.path;
    state.controlContract = controlContract || FALLBACK.UNKNOWN;

    state.controlFileStatus = controlsPresent
      ? motionReady
        ? "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY"
        : "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING"
      : FALLBACK.EXPECTED_NOT_YET_BUILT;

    state.controlAbsenceIsFailure = "false";
    state.controlAbsenceIsCase5 = "false";
    state.controlAbsenceBlocksVisiblePlanet = "false";
    state.controlAbsenceBlocksMotionTouch = controlsPresent && motionReady ? "false" : "true";

    state.hearthJsControlFunnelFile = HEARTH_JS_CONTROL_FUNNEL_FILE;
    state.hearthJsControlFunnelStatus = state.routeConductorContractRecognized === "true"
      ? "ROUTE_CONDUCTOR_FUNNEL_RECOGNIZED"
      : state.servedRouteConductorContract !== FALLBACK.UNKNOWN
        ? "ROUTE_CONDUCTOR_FUNNEL_PRESENT_BUT_CONTRACT_NOT_RECOGNIZED"
        : FALLBACK.EXPECTED_NOT_YET_WIRED;

    state.hearthJsControlHandshakeStatus = controlsPresent
      ? motionReady
        ? "CONTROL_HANDSHAKE_READY"
        : "CONTROL_FILE_PRESENT_WAITING_ROUTE_HANDSHAKE"
      : FALLBACK.EXPECTED_NOT_YET_WIRED;

    state.indexJsControlDisposition = "INDEX_OWNS_BUTTON_AUTHORITY_ONLY";
    state.indexJsControlLoadSlotStatus = "INDEX_DOES_NOT_OWN_PLANETARY_MOTION_TOUCH";

    state.motionTouchStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;
    state.dragStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;
    state.viewControlStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;

    state.visiblePlanetBlockedByControlAbsence = "false";
    state.motionTouchBlockedByControlAbsence = state.controlAbsenceBlocksMotionTouch;

    if (!controlsPresent) {
      addNote(state, "EAST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT");
      addNote(state, "EAST_CONTROL_ABSENCE_NOT_TREATED_AS_CASE_5");
      addNote(state, "EAST_CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET");
    } else if (motionReady) {
      addNote(state, "EAST_CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY");
    } else {
      addNote(state, "EAST_CONTROL_FILE_PRESENT_HANDSHAKE_PENDING");
    }
  }

  function deriveMismatch(state) {
    const htmlKnown = state.servedHtmlContract !== FALLBACK.UNKNOWN && state.servedHtmlContract !== FALLBACK.NOT_FOUND;
    const indexKnown = state.servedIndexJsContract !== FALLBACK.UNKNOWN && state.servedIndexJsContract !== FALLBACK.NOT_FOUND;
    const routeKnown = state.servedRouteConductorContract !== FALLBACK.UNKNOWN && state.servedRouteConductorContract !== FALLBACK.NOT_FOUND;

    const htmlBad = htmlKnown && state.htmlContractRecognized === "false";
    const indexBad = indexKnown && state.indexContractRecognized === "false";
    const routeBad = routeKnown && state.routeConductorContractRecognized === "false";

    if (htmlBad || indexBad || routeBad) {
      state.cacheOrServedContractMismatch = "true";
      state.case5Support = SUPPORT.TRUE;

      if (htmlBad) addNote(state, "CASE_5_SUPPORT_HTML_CONTRACT_UNRECOGNIZED");
      if (indexBad) addNote(state, "CASE_5_SUPPORT_INDEX_CONTRACT_UNRECOGNIZED");
      if (routeBad) addNote(state, "CASE_5_SUPPORT_ROUTE_CONDUCTOR_CONTRACT_UNRECOGNIZED");
      return;
    }

    if (htmlKnown || indexKnown || routeKnown) {
      state.cacheOrServedContractMismatch = "false";
      state.case5Support = SUPPORT.FALSE;
      addNote(state, "CASE_5_FALSE_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
      return;
    }

    state.cacheOrServedContractMismatch = FALLBACK.UNKNOWN;
    state.case5Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    addNote(state, "CASE_5_INSUFFICIENT_EVIDENCE_NO_SERVED_CONTRACTS_READABLE");
  }

  function makeState() {
    return {
      eastStatus: STATUS.READY,
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: FALLBACK.UNKNOWN,
      diagnosticTargetAccessError: "",
      targetDocumentSource: FALLBACK.UNKNOWN,

      expectedHtmlContract: CURRENT_HTML_CONTRACT,
      expectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,

      currentExpectedHtmlContract: CURRENT_HTML_CONTRACT,
      currentExpectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentExpectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,

      htmlContractRecognized: FALLBACK.UNKNOWN,
      indexContractRecognized: FALLBACK.UNKNOWN,
      routeConductorContractRecognized: FALLBACK.UNKNOWN,

      primaryRouteConductorContractRecognized: FALLBACK.UNKNOWN,
      routeConductorV95PrimaryNotTreatedAsCase5: FALLBACK.UNKNOWN,
      routeConductorV94LineageAccepted: FALLBACK.UNKNOWN,
      eastCurrentSpreadAlignmentRecognized: FALLBACK.UNKNOWN,

      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      indexScriptPresent: FALLBACK.UNKNOWN,
      routeConductorScriptPresent: FALLBACK.UNKNOWN,
      indexAuthoritySource: FALLBACK.UNKNOWN,
      routeConductorAuthoritySource: FALLBACK.UNKNOWN,

      targetRouteSignal: FALLBACK.UNKNOWN,
      planetContextSignal: FALLBACK.UNKNOWN,

      cacheOrServedContractMismatch: FALLBACK.UNKNOWN,
      case5Support: FALLBACK.INSUFFICIENT_EVIDENCE,

      planetaryControlSchemaActive: true,
      planetaryControlFootprintActive: true,
      controlFile: CONTROL_FILE,
      controlFileExpected: true,
      controlFileStatus: FALLBACK.EXPECTED_NOT_YET_BUILT,
      controlScriptSrc: FALLBACK.NOT_FOUND,
      controlScriptPresent: "false",
      controlAuthoritySource: "NONE",
      controlContract: FALLBACK.UNKNOWN,
      controlAbsenceIsFailure: "false",
      controlAbsenceIsCase5: "false",
      controlAbsenceBlocksVisiblePlanet: "false",
      controlAbsenceBlocksMotionTouch: "true",

      hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
      hearthJsControlFunnelStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      hearthJsControlHandshakeStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      indexJsControlDisposition: "INDEX_OWNS_BUTTON_AUTHORITY_ONLY",
      indexJsControlLoadSlotStatus: "INDEX_DOES_NOT_OWN_PLANETARY_MOTION_TOUCH",

      motionTouchStatus: FALLBACK.WAITING_CONTROL_FILE,
      dragStatus: FALLBACK.WAITING_CONTROL_FILE,
      viewControlStatus: FALLBACK.WAITING_CONTROL_FILE,
      visiblePlanetBlockedByControlAbsence: "false",
      motionTouchBlockedByControlAbsence: "true",

      canvasFile: CANVAS_FILE,
      canvasScriptPresent: FALLBACK.UNKNOWN,
      canvasAuthoritySource: FALLBACK.UNKNOWN,
      canvasContract: FALLBACK.UNKNOWN,
      canvasAuthorityStatus: FALLBACK.UNKNOWN,
      visiblePlanetSourceStatus: FALLBACK.UNKNOWN,

      planetaryFileFootprintActive: true,
      fingerFileFootprint: {},

      eastSecondaryEvidenceNotes: [],

      readOnlyInspectionComplete: false,
      servedSourceAuthorityOnly: true,
      renderedTargetAuthority: false,
      syntheticActivationAuthority: false,
      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,

      updatedAt: nowIso(),

      ...FINAL_FALSE
    };
  }

  function makeEvidencePacket(state) {
    return {
      EAST_STATUS: state.eastStatus,
      EAST_CONTRACT: CONTRACT,
      EAST_RECEIPT: RECEIPT,
      EAST_ALIGNMENT_CONTRACT: IMPLEMENTATION_CONTRACT,
      EAST_ALIGNMENT_RECEIPT: IMPLEMENTATION_RECEIPT,
      EAST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      EAST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      EAST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      EAST_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      EAST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      EAST_VERSION: VERSION,

      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      TARGET_DOCUMENT_SOURCE: state.targetDocumentSource,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,

      CURRENT_EXPECTED_HTML_CONTRACT: state.currentExpectedHtmlContract,
      CURRENT_EXPECTED_INDEX_JS_CONTRACT: state.currentExpectedIndexJsContract,
      CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.currentExpectedRouteConductorContract,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,

      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      INDEX_SCRIPT_PRESENT: state.indexScriptPresent,
      ROUTE_CONDUCTOR_SCRIPT_PRESENT: state.routeConductorScriptPresent,

      INDEX_AUTHORITY_SOURCE: state.indexAuthoritySource,
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: state.routeConductorAuthoritySource,

      HTML_CONTRACT_RECOGNIZED: state.htmlContractRecognized,
      INDEX_CONTRACT_RECOGNIZED: state.indexContractRecognized,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.routeConductorContractRecognized,

      PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.primaryRouteConductorContractRecognized,
      ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5: state.routeConductorV95PrimaryNotTreatedAsCase5,
      ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED: state.routeConductorV94LineageAccepted,
      EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED: state.eastCurrentSpreadAlignmentRecognized,

      TARGET_ROUTE_SIGNAL: state.targetRouteSignal,
      PLANET_CONTEXT_SIGNAL: state.planetContextSignal,

      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CASE_5_SUPPORT: state.case5Support,

      PLANETARY_CONTROL_SCHEMA_ACTIVE: state.planetaryControlSchemaActive,
      PLANETARY_CONTROL_FOOTPRINT_ACTIVE: state.planetaryControlFootprintActive,
      CONTROL_FILE: state.controlFile,
      CONTROL_FILE_EXPECTED: state.controlFileExpected,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_SCRIPT_SRC: state.controlScriptSrc,
      CONTROL_SCRIPT_PRESENT: state.controlScriptPresent,
      CONTROL_AUTHORITY_SOURCE: state.controlAuthoritySource,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_ABSENCE_IS_FAILURE: state.controlAbsenceIsFailure,
      CONTROL_ABSENCE_IS_CASE_5: state.controlAbsenceIsCase5,
      CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET: state.controlAbsenceBlocksVisiblePlanet,
      CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH: state.controlAbsenceBlocksMotionTouch,

      HEARTH_JS_CONTROL_FUNNEL_FILE: state.hearthJsControlFunnelFile,
      HEARTH_JS_CONTROL_FUNNEL_STATUS: state.hearthJsControlFunnelStatus,
      HEARTH_JS_CONTROL_HANDSHAKE_STATUS: state.hearthJsControlHandshakeStatus,
      INDEX_JS_CONTROL_DISPOSITION: state.indexJsControlDisposition,
      INDEX_JS_CONTROL_LOAD_SLOT_STATUS: state.indexJsControlLoadSlotStatus,

      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,
      VISIBLE_PLANET_BLOCKED_BY_CONTROL_ABSENCE: state.visiblePlanetBlockedByControlAbsence,
      MOTION_TOUCH_BLOCKED_BY_CONTROL_ABSENCE: state.motionTouchBlockedByControlAbsence,

      CANVAS_FILE: state.canvasFile,
      CANVAS_SCRIPT_PRESENT: state.canvasScriptPresent,
      CANVAS_AUTHORITY_SOURCE: state.canvasAuthoritySource,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_AUTHORITY_STATUS: state.canvasAuthorityStatus,
      VISIBLE_PLANET_SOURCE_STATUS: state.visiblePlanetSourceStatus,

      PLANETARY_FILE_FOOTPRINT_ACTIVE: state.planetaryFileFootprintActive,
      FINGER_FILE_FOOTPRINT: clonePlain(state.fingerFileFootprint),

      EAST_SECONDARY_EVIDENCE_NOTES: state.eastSecondaryEvidenceNotes.length
        ? state.eastSecondaryEvidenceNotes.join(" | ")
        : FALLBACK.NONE,

      F13_CLAIMED: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false
    };
  }

  async function runEastSourceRead(options = {}) {
    const state = makeState();
    state.eastStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const target = resolveTargetDocument(options, state);
      const targetDocument = target.targetDocument;
      const targetWindow = target.targetWindow || (targetDocument ? targetDocument.defaultView : null);

      state.targetDocumentSource = target.source || FALLBACK.UNKNOWN;

      if (targetDocument && !hasHearthSignals(targetDocument, targetWindow) && !routeMatches(targetWindow)) {
        addNote(state, "TARGET_DOCUMENT_ACCESSIBLE_BUT_HEARTH_SIGNALS_NOT_CONFIRMED");
      }

      readHtmlEvidence(targetDocument, targetWindow, state);
      readIndexEvidence(targetDocument, targetWindow, state);
      readRouteConductorEvidence(targetDocument, targetWindow, state);
      readControlFootprint(targetDocument, targetWindow, state);
      readCanvasAndFingerFootprint(targetDocument, targetWindow, state);
      deriveMismatch(state);

      state.eastCurrentSpreadAlignmentRecognized = boolText(
        state.htmlContractRecognized === "true" &&
        (
          state.indexContractRecognized === "true" ||
          state.servedIndexJsContract === FALLBACK.UNKNOWN
        ) &&
        (
          state.routeConductorContractRecognized === "true" ||
          state.primaryRouteConductorContractRecognized === "true"
        )
      );

      if (state.eastCurrentSpreadAlignmentRecognized === "true") {
        addNote(state, "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED");
      }

      addNote(state, "EAST_PLANETARY_CONTROL_FOOTPRINT_SOURCE_READ_COMPLETE");

      state.eastSourceReadComplete = "true";
      state.eastSourceReadStatus = FALLBACK.COMPLETE;
      state.readOnlyInspectionComplete = true;
      state.eastStatus = STATUS.COMPLETE;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.eastStatus = STATUS.FAILED;
      state.eastSourceReadComplete = "false";
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.diagnosticTargetAccessError = `EAST_SOURCE_READ_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`;
      state.cacheOrServedContractMismatch = FALLBACK.UNKNOWN;
      state.case5Support = FALLBACK.INSUFFICIENT_EVIDENCE;
      addNote(state, state.diagnosticTargetAccessError);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getEastReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "EAST_SERVED_SOURCE_EVIDENCE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      renderedTargetAuthority: false,
      syntheticActivationAuthority: false,
      servedSourceAuthority: true,
      case5EvidenceSupportOnly: true,
      packetFormattingAuthority: false,
      diagnosticUiAuthority: false,

      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,

      runEastSourceReadApiAvailable: true,
      getEastReceiptApiAvailable: true,
      getEastStateApiAvailable: true,

      currentSpreadCompatibilityOwned: true,
      servedSourceEvidenceOnlyOwned: true,
      contractRecognitionOwned: true,
      cacheMismatchEvidenceOwned: true,
      falseCase5PreventionOwned: true,
      targetWindowScopedReadOwned: true,
      diagnosticReceiverHtmlIgnoredAsTargetOwned: true,
      planetaryControlFootprintReadOwned: true,
      missingControlsExpectedNotYetBuiltOwned: true,
      controlAbsenceNotCase5Owned: true,
      motionTouchAbsenceFootprintOwned: true,

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

      controlFile: CONTROL_FILE,
      hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
      indexJsFile: INDEX_JS_FILE,
      canvasFile: CANVAS_FILE,

      acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
      acceptedIndexJsContracts: ACCEPTED_INDEX_JS_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),

      lastEastStatus: lastEvidencePacket ? lastEvidencePacket.EAST_STATUS : STATUS.READY,
      lastEastSourceReadStatus: lastEvidencePacket ? lastEvidencePacket.EAST_SOURCE_READ_STATUS : FALLBACK.UNKNOWN,
      lastCacheOrServedContractMismatch: lastEvidencePacket
        ? lastEvidencePacket.CACHE_OR_SERVED_CONTRACT_MISMATCH
        : FALLBACK.UNKNOWN,
      lastCase5Support: lastEvidencePacket ? lastEvidencePacket.CASE_5_SUPPORT : FALLBACK.INSUFFICIENT_EVIDENCE,
      lastServedHtmlContract: lastEvidencePacket ? lastEvidencePacket.SERVED_HTML_CONTRACT : FALLBACK.UNKNOWN,
      lastServedIndexJsContract: lastEvidencePacket ? lastEvidencePacket.SERVED_INDEX_JS_CONTRACT : FALLBACK.UNKNOWN,
      lastServedRouteConductorContract: lastEvidencePacket
        ? lastEvidencePacket.SERVED_ROUTE_CONDUCTOR_CONTRACT
        : FALLBACK.UNKNOWN,
      lastControlFileStatus: lastEvidencePacket ? lastEvidencePacket.CONTROL_FILE_STATUS : FALLBACK.EXPECTED_NOT_YET_BUILT,
      lastMotionTouchStatus: lastEvidencePacket ? lastEvidencePacket.MOTION_TOUCH_STATUS : FALLBACK.WAITING_CONTROL_FILE,
      lastHearthJsControlHandshakeStatus: lastEvidencePacket
        ? lastEvidencePacket.HEARTH_JS_CONTROL_HANDSHAKE_STATUS
        : FALLBACK.EXPECTED_NOT_YET_WIRED,

      ...FINAL_FALSE,

      updatedAt: nowIso()
    };
  }

  function getEastState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidencePacket = makeEvidencePacket(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticEast = api;
    root.HEARTH.diagnosticRailEast = api;
    root.HEARTH.diagnosticEastReceipt = getEastReceipt();
    root.HEARTH.diagnosticRailEastReceipt = getEastReceipt();
    root.HEARTH.diagnosticEastEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticRailEastEvidence = clonePlain(lastEvidencePacket);

    root.HEARTH_DIAGNOSTIC_EAST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST = api;
    root.HEARTH_DIAGNOSTIC_EAST_RECEIPT = getEastReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT = getEastReceipt();
    root.HEARTH_DIAGNOSTIC_EAST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_EVIDENCE = clonePlain(lastEvidencePacket);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
    currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

    controlFile: CONTROL_FILE,
    hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
    indexJsFile: INDEX_JS_FILE,
    canvasFile: CANVAS_FILE,
    fingerFiles: clonePlain(FINGER_FILES),

    acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
    acceptedIndexJsContracts: ACCEPTED_INDEX_JS_CONTRACTS.slice(),
    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),

    runEastSourceRead,
    getEastReceipt,
    getEastState,

    supportsServedSourceEvidence: true,
    supportsCurrentSpreadCompatibilitySplit: true,
    supportsRouteConductorV96CurrentSpread: true,
    supportsRouteConductorV95Compatibility: true,
    supportsRouteConductorV94Lineage: true,
    supportsFalseCase5Prevention: true,
    supportsNorthOnlyAdjudication: true,
    supportsTargetWindowScopedRead: true,
    supportsDiagnosticReceiverHtmlNonTargetGuard: true,
    supportsPlanetaryControlFootprint: true,
    supportsExpectedMissingControlFile: true,
    supportsMotionTouchFootprint: true,
    supportsPlanetaryFileFootprint: true,

    ownsServedSourceEvidence: true,
    ownsCase5EvidenceSupportOnly: true,
    ownsPlanetaryControlFootprintEvidence: true,
    ownsRenderedTargetEvidence: false,
    ownsFinalPrimaryCase: false,
    ownsRecommendation: false,
    ownsRepair: false,
    ownsCacheRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsF13: false,
    ownsF21: false,

    ...FINAL_FALSE
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
