// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Full-file replacement.
// Diagnostic rail EAST child only.
// Internal implementation:
// HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_PRIMARY_COMPATIBILITY_SPLIT_TNT_v4
// Missing-construct baseline file.
// Purpose:
// - Create the required EAST diagnostic child file.
// - Serve NORTH with receipt-bearing served-source evidence.
// - Read current DOM/script/dataset evidence when available.
// - Recognize current Hearth HTML, Index, and Route Conductor spread without false CASE_5.
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
    "HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_PRIMARY_COMPATIBILITY_SPLIT_TNT_v4";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_PRIMARY_COMPATIBILITY_SPLIT_RECEIPT_v4";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_TNT_v3";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";

  const VERSION =
    "2026-06-04.hearth-diagnostic-east-missing-construct-baseline-current-spread-v4";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4";

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

  const EXPECTED_INDEX_SRC = "/showroom/globe/hearth/index.js";
  const EXPECTED_ROUTE_CONDUCTOR_SRC = "/showroom/globe/hearth/hearth.js";

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    BLOCKED: "BLOCKED",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
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
    if (!clean) return;
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

  function normalizeSrc(src) {
    const text = safeString(src);
    if (!text) return "";
    try {
      const url = new URL(text, root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com");
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return text;
    }
  }

  function scriptContains(script, path) {
    const src = normalizeSrc(script && script.getAttribute ? script.getAttribute("src") : "");
    return Boolean(src && src.includes(path));
  }

  function findScriptByPath(targetDocument, path) {
    const scripts = qa(targetDocument, "script[src]");
    return scripts.find((script) => scriptContains(script, path)) || null;
  }

  function readCacheKeyFromSrc(src) {
    const text = safeString(src);
    try {
      const url = new URL(text, root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com");
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
            result.routeConductorContract
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
      authority.routeConductorContract
    ), "");
  }

  function findRouteConductorAuthority() {
    const paths = [
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
    ];

    for (const path of paths) {
      const value = readPath(root, path);
      if (value && isObject(value)) {
        return { path, authority: value, contract: readAuthorityContract(value) };
      }
    }

    const markerContract = safeString(root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ || "");
    if (markerContract) {
      return {
        path: "__HEARTH_ROUTE_CONDUCTOR_CONTRACT__",
        authority: null,
        contract: markerContract
      };
    }

    return { path: "NONE", authority: null, contract: "" };
  }

  function findIndexAuthority() {
    const paths = [
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
    ];

    for (const path of paths) {
      const value = readPath(root, path);
      if (value && isObject(value)) {
        return { path, authority: value, contract: readAuthorityContract(value) };
      }
    }

    return { path: "NONE", authority: null, contract: "" };
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

  function hasHearthSignals(targetDocument) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

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
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet factory|planet engine|mirrorland formation/i.test(context) ||
        q(targetDocument, "#hearthCanvasMount") ||
        q(targetDocument, "[data-hearth-canvas-mount]") ||
        q(targetDocument, "#hearthGlobeStage") ||
        q(targetDocument, "[data-hearth-globe-stage]")
      );
    } catch (_error) {
      return false;
    }
  }

  function resolveTargetDocument(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetWindow = opts.targetDocument.defaultView || opts.targetWindow || null;
      state.diagnosticTargetAccessStatus = "SOURCE_TARGET_DOCUMENT_SUPPLIED";
      return { targetDocument: opts.targetDocument, targetWindow, source: "options.targetDocument" };
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;
        if (targetDocument && targetDocument.documentElement) {
          state.diagnosticTargetAccessStatus = "SOURCE_TARGET_WINDOW_SUPPLIED";
          return { targetDocument, targetWindow, source: "options.targetWindow" };
        }
      } catch (error) {
        state.diagnosticTargetAccessStatus = "TARGET_WINDOW_BLOCKED";
        state.diagnosticTargetAccessError = `TARGET_WINDOW_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`;
        addNote(state, state.diagnosticTargetAccessError);
      }
    }

    if (opts.frameElement) {
      try {
        const frame = opts.frameElement;
        const targetWindow = frame.contentWindow || null;
        const targetDocument = targetWindow ? targetWindow.document : null;

        if (targetDocument && targetDocument.documentElement) {
          state.diagnosticTargetAccessStatus = "SOURCE_TARGET_FRAME_SUPPLIED";
          return { targetDocument, targetWindow, source: "options.frameElement" };
        }

        state.diagnosticTargetAccessStatus = "TARGET_FRAME_BLOCKED";
        state.diagnosticTargetAccessError = "TARGET_FRAME_DOCUMENT_INACCESSIBLE";
        addNote(state, "EAST_TARGET_FRAME_DOCUMENT_INACCESSIBLE");
      } catch (error) {
        state.diagnosticTargetAccessStatus = "TARGET_FRAME_BLOCKED";
        state.diagnosticTargetAccessError = `TARGET_FRAME_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`;
        addNote(state, state.diagnosticTargetAccessError);
      }
    }

    if (doc && doc.documentElement && (routeMatches(root) || hasHearthSignals(doc))) {
      state.diagnosticTargetAccessStatus = "SOURCE_CURRENT_DOCUMENT";
      return { targetDocument: doc, targetWindow: root, source: "currentDocument" };
    }

    state.diagnosticTargetAccessStatus = "SOURCE_ONLY_NO_RENDERED_DOCUMENT";
    state.diagnosticTargetAccessError = "NO_TARGET_DOCUMENT_AVAILABLE_TO_EAST";
    addNote(state, "EAST_SOURCE_ONLY_BASELINE_NO_TARGET_DOCUMENT_AVAILABLE");
    return { targetDocument: null, targetWindow: null, source: "none" };
  }

  function readHtmlEvidence(targetDocument, state) {
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
    state.htmlContractRecognized = contractRecognized(served, ACCEPTED_HTML_CONTRACTS);

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

  function readIndexEvidence(targetDocument, state) {
    const target = targetDocument || doc;
    const indexAuthority = findIndexAuthority();
    const script = target ? findScriptByPath(target, EXPECTED_INDEX_SRC) : null;
    const src = script ? normalizeSrc(script.getAttribute("src")) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src")) : "";

    const dataset = target ? readDataset(target) : {};
    const authorityContract = indexAuthority.contract || "";
    const scriptContract = safeString(firstDefined(
      cacheKey,
      script && script.dataset ? script.dataset.jsSelectorCacheKey : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      script && script.dataset ? script.dataset.hearthIndexJsContract : "",
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
      addNote(state, "INDEX_SCRIPT_OR_AUTHORITY_NOT_FOUND_BY_EAST_BASELINE");
    }
  }

  function readRouteConductorEvidence(targetDocument, state) {
    const target = targetDocument || doc;
    const conductor = findRouteConductorAuthority();
    const script = target ? findScriptByPath(target, EXPECTED_ROUTE_CONDUCTOR_SRC) : null;
    const src = script ? normalizeSrc(script.getAttribute("src")) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src")) : "";

    const dataset = target ? readDataset(target) : {};
    const authorityContract = conductor.contract || "";
    const scriptContract = safeString(firstDefined(
      cacheKey,
      script && script.dataset ? script.dataset.routeConductorCurrentContract : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      dataset.hearthRouteConductorContract,
      dataset.routeConductorCurrentContract,
      dataset.expectedRouteConductorContract,
      dataset.routeConductorCurrentContract,
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
      addNote("unused");
    }

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
      addNote(state, "ROUTE_CONDUCTOR_SCRIPT_OR_AUTHORITY_NOT_FOUND_BY_EAST_BASELINE");
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
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: FALLBACK.UNKNOWN,
      diagnosticTargetAccessError: "",

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
      EAST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      EAST_VERSION: VERSION,

      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,

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

      if (targetDocument && !hasHearthSignals(targetDocument) && !routeMatches(targetWindow)) {
        addNote(state, "TARGET_DOCUMENT_ACCESSIBLE_BUT_HEARTH_SIGNALS_NOT_CONFIRMED");
      }

      readHtmlEvidence(targetDocument, state);
      readIndexEvidence(targetDocument, state);
      readRouteConductorEvidence(targetDocument, state);
      deriveMismatch(state);

      state.eastCurrentSpreadAlignmentRecognized = boolText(
        state.htmlContractRecognized === "true" &&
        state.indexContractRecognized === "true" &&
        state.routeConductorContractRecognized === "true"
      );

      if (state.eastCurrentSpreadAlignmentRecognized === "true") {
        addNote(state, "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED");
      }

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

      missingConstructBaselineFileCreated: true,
      currentSpreadCompatibilityOwned: true,
      servedSourceEvidenceOnlyOwned: true,
      contractRecognitionOwned: true,
      cacheMismatchEvidenceOwned: true,
      falseCase5PreventionOwned: true,

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
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

    ownsServedSourceEvidence: true,
    ownsCase5EvidenceSupportOnly: true,
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
