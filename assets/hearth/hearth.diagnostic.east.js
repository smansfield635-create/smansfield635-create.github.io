// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Full-file replacement.
// Diagnostic rail EAST child only.
// Purpose:
// - Provide served-source evidence for the Hearth diagnostic rail.
// - Read what the browser is actually being served for the Hearth route.
// - Extract observed contracts and script sources from served HTML / JS.
// - Support CASE_5 evidence only for NORTH adjudication.
// - Preserve protected production files as read-only observation targets.
// - Preserve no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - rendered-target probing
// - Show Receipt testing
// - hit-test inspection
// - pointer-events inspection
// - overlay inspection
// - runtime release inspection
// - synthetic activation
// - final PRIMARY_CASE selection
// - final recommendation selection
// - packet formatting
// - diagnostic UI
// - Hearth repair
// - cache repair
// - production mutation

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";
  const VERSION = "2026-06-02.hearth-diagnostic-rail-east-served-source-evidence-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";

  const TARGET_HTML_FILE = "/showroom/globe/hearth/index.html";
  const TARGET_INDEX_JS_FILE = "/showroom/globe/hearth/index.js";
  const TARGET_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1";
  const EXPECTED_INDEX_JS_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";

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
    COMPLETE: "COMPLETE"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED"
  });

  const CASE5 = Object.freeze({
    TRUE: "true",
    FALSE: "false",
    UNKNOWN: FALLBACK.UNKNOWN,
    INSUFFICIENT_EVIDENCE: FALLBACK.INSUFFICIENT_EVIDENCE
  });

  const MISMATCH = Object.freeze({
    TRUE: "true",
    FALSE: "false",
    UNKNOWN: FALLBACK.UNKNOWN
  });

  const root = typeof window !== "undefined" ? window : globalThis;

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
    return Boolean(value && typeof value === "object");
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

  function bounded(value, limit = 900) {
    return safeString(value).replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function packetSafe(value, fallback = FALLBACK.UNKNOWN) {
    const text = safeTrim(value);
    return text || fallback;
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
    const clean = bounded(note, 800);
    if (!clean) return;
    if (!state.eastSecondaryEvidenceNotes.includes(clean)) {
      state.eastSecondaryEvidenceNotes.push(clean);
    }
  }

  function normalizeError(error, prefix) {
    const name = error && error.name ? safeString(error.name) : "ERROR";
    const message = error && error.message ? safeString(error.message) : safeString(error, "UNKNOWN_ERROR");
    return `${prefix || "ERROR"}:${bounded(`${name}:${message}`, 500)}`;
  }

  function makeState() {
    return {
      eastStatus: STATUS.READY,
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,

      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,

      htmlSourceReadStatus: FALLBACK.UNKNOWN,
      indexJsSourceReadStatus: FALLBACK.UNKNOWN,
      routeConductorSourceReadStatus: FALLBACK.UNKNOWN,

      cacheOrServedContractMismatch: MISMATCH.UNKNOWN,
      case5Support: CASE5.UNKNOWN,

      eastSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  async function fetchText(url, state, label) {
    try {
      if (!isFunction(root.fetch)) {
        addNote(state, `${label}_FETCH_UNAVAILABLE`);
        return {
          ok: false,
          status: FALLBACK.UNREADABLE,
          text: "",
          error: "FETCH_UNAVAILABLE"
        };
      }

      const response = await root.fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!response) {
        addNote(state, `${label}_FETCH_FAILED:NO_RESPONSE`);
        return {
          ok: false,
          status: FALLBACK.FAILED,
          text: "",
          error: "NO_RESPONSE"
        };
      }

      if (!response.ok) {
        const statusText = `${response.status}:${response.statusText || "HTTP_ERROR"}`;
        addNote(state, `${label}_FETCH_FAILED:${bounded(statusText, 200)}`);
        return {
          ok: false,
          status: response.status === 404 ? FALLBACK.NOT_FOUND : FALLBACK.FAILED,
          text: "",
          error: statusText
        };
      }

      const text = await response.text();

      return {
        ok: true,
        status: FALLBACK.COMPLETE,
        text: safeString(text),
        error: ""
      };
    } catch (error) {
      const normalized = normalizeError(error, `${label}_FETCH_ERROR`);
      addNote(state, normalized);
      return {
        ok: false,
        status: FALLBACK.FAILED,
        text: "",
        error: normalized
      };
    }
  }

  function extractHtmlContract(source) {
    const text = safeString(source);

    const markerPatterns = [
      /data-contract=["']([^"']+)["']/i,
      /data-hearth-html-contract=["']([^"']+)["']/i,
      /data-hearth-shell-contract=["']([^"']+)["']/i
    ];

    for (const pattern of markerPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) return packetSafe(match[1]);
    }

    if (text.includes(EXPECTED_HTML_CONTRACT)) return EXPECTED_HTML_CONTRACT;

    const generic = text.match(/\bHEARTH_HTML_[A-Z0-9_]+_TNT_v[0-9A-Za-z_.-]+\b/);
    if (generic && generic[0]) return packetSafe(generic[0]);

    return FALLBACK.UNKNOWN;
  }

  function extractJsContract(source, expectedContract, genericPrefix) {
    const text = safeString(source);

    if (expectedContract && text.includes(expectedContract)) return expectedContract;

    const constContract = text.match(/\b(?:const|let|var)\s+CONTRACT\s*=\s*["']([^"']+)["']/);
    if (constContract && constContract[1]) return packetSafe(constContract[1]);

    const objectContract = text.match(/\bcontract\s*:\s*["']([^"']+_TNT_v[0-9A-Za-z_.-]+)["']/i);
    if (objectContract && objectContract[1]) return packetSafe(objectContract[1]);

    const assignmentContract = text.match(/\bcontract\s*=\s*["']([^"']+_TNT_v[0-9A-Za-z_.-]+)["']/i);
    if (assignmentContract && assignmentContract[1]) return packetSafe(assignmentContract[1]);

    const prefix = safeString(genericPrefix || "HEARTH");
    const generic = text.match(new RegExp(`\\b${prefix}_[A-Z0-9_]+_TNT_v[0-9A-Za-z_.-]+\\b`));
    if (generic && generic[0]) return packetSafe(generic[0]);

    return FALLBACK.UNKNOWN;
  }

  function parseScriptSources(htmlSource) {
    const text = safeString(htmlSource);
    const sources = [];
    const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = scriptRegex.exec(text))) {
      if (match && match[1]) sources.push(match[1]);
    }

    return sources;
  }

  function getOrigin() {
    try {
      if (root.location && root.location.origin) return root.location.origin;
    } catch (_error) {
      // Continue to fallback.
    }
    return "https://diamondgatebridge.com";
  }

  function normalizeScriptSource(src) {
    const original = safeString(src);
    const base = `${getOrigin()}${TARGET_ROUTE}`;

    try {
      const url = new URL(original, base);
      const pathname = url.pathname || "";
      const basename = pathname.split("/").filter(Boolean).pop() || "";
      return {
        original,
        pathname,
        basename,
        search: url.search || "",
        routePath: pathname.startsWith(TARGET_ROUTE),
        cacheKeyed: Boolean(url.search)
      };
    } catch (_error) {
      const clean = original.split("#")[0];
      const noQuery = clean.split("?")[0];
      const basename = noQuery.split("/").filter(Boolean).pop() || noQuery;
      return {
        original,
        pathname: noQuery,
        basename,
        search: clean.includes("?") ? clean.slice(clean.indexOf("?")) : "",
        routePath: noQuery.startsWith(TARGET_ROUTE) || !noQuery.startsWith("/"),
        cacheKeyed: clean.includes("?")
      };
    }
  }

  function isRouteAwareScriptMatch(src, basename) {
    const normalized = normalizeScriptSource(src);
    const wanted = safeString(basename);

    if (normalized.basename !== wanted) return false;

    if (normalized.routePath) return true;

    const original = normalized.original;

    if (original === wanted) return true;
    if (original === `./${wanted}`) return true;
    if (original.startsWith(`${wanted}?`)) return true;
    if (original.startsWith(`./${wanted}?`)) return true;

    return false;
  }

  function extractScriptSrc(htmlSource, basename, state, notePrefix) {
    const sources = parseScriptSources(htmlSource);
    const matches = [];

    for (const src of sources) {
      if (isRouteAwareScriptMatch(src, basename)) {
        const normalized = normalizeScriptSource(src);
        matches.push(src);

        if (normalized.cacheKeyed) {
          addNote(state, `${notePrefix}_CACHE_KEY_DETECTED`);
        }

        if (src === basename || src === `./${basename}` || src.startsWith(`${basename}?`) || src.startsWith(`./${basename}?`)) {
          addNote(state, `${notePrefix}_RELATIVE_PATH_DETECTED`);
        }
      }
    }

    if (matches.length) return matches.join(" | ");

    return FALLBACK.NOT_FOUND;
  }

  function isConfidentContract(value) {
    return Boolean(
      value &&
      value !== FALLBACK.UNKNOWN &&
      value !== FALLBACK.UNREADABLE &&
      value !== FALLBACK.BLOCKED &&
      value !== FALLBACK.FAILED &&
      value !== FALLBACK.NOT_FOUND &&
      value !== FALLBACK.PARTIAL &&
      value !== FALLBACK.INSUFFICIENT_EVIDENCE
    );
  }

  function evaluateReadStatus(state) {
    const statuses = [
      state.htmlSourceReadStatus,
      state.indexJsSourceReadStatus,
      state.routeConductorSourceReadStatus
    ];

    const allComplete = statuses.every((value) => value === FALLBACK.COMPLETE);
    const allFailed = statuses.every((value) => value === FALLBACK.FAILED || value === FALLBACK.UNREADABLE || value === FALLBACK.BLOCKED || value === FALLBACK.NOT_FOUND);
    const anyIncomplete = statuses.some((value) => value !== FALLBACK.COMPLETE);

    const contracts = [
      state.servedHtmlContract,
      state.servedIndexJsContract,
      state.servedRouteConductorContract
    ];

    const allContractsConfident = contracts.every(isConfidentContract);

    state.eastSourceReadComplete = allComplete && allContractsConfident ? "true" : "false";

    if (allComplete && allContractsConfident) {
      state.eastSourceReadStatus = FALLBACK.COMPLETE;
    } else if (allFailed) {
      state.eastSourceReadStatus = FALLBACK.FAILED;
    } else if (anyIncomplete || !allContractsConfident) {
      state.eastSourceReadStatus = FALLBACK.PARTIAL;
    } else {
      state.eastSourceReadStatus = FALLBACK.UNKNOWN;
    }

    if (state.eastSourceReadStatus === FALLBACK.PARTIAL) {
      addNote(state, "SOURCE_READ_PARTIAL");
    }

    if (state.eastSourceReadStatus === FALLBACK.COMPLETE) {
      addNote(state, "SOURCE_READ_COMPLETE");
    }

    if (state.eastSourceReadStatus === FALLBACK.FAILED) {
      addNote(state, "SOURCE_READ_FAILED");
    }
  }

  function evaluateMismatch(state) {
    const htmlConfident = isConfidentContract(state.servedHtmlContract);
    const indexConfident = isConfidentContract(state.servedIndexJsContract);
    const routeConfident = isConfidentContract(state.servedRouteConductorContract);

    const htmlMismatch = htmlConfident && state.servedHtmlContract !== EXPECTED_HTML_CONTRACT;
    const indexMismatch = indexConfident && state.servedIndexJsContract !== EXPECTED_INDEX_JS_CONTRACT;
    const routeMismatch = routeConfident && state.servedRouteConductorContract !== EXPECTED_ROUTE_CONDUCTOR_CONTRACT;

    if (htmlMismatch) addNote(state, "HTML_CONTRACT_MISMATCH");
    if (indexMismatch) addNote(state, "INDEX_JS_CONTRACT_MISMATCH");
    if (routeMismatch) addNote(state, "ROUTE_CONDUCTOR_CONTRACT_MISMATCH");

    if (state.indexScriptSrc === FALLBACK.NOT_FOUND) addNote(state, "INDEX_SCRIPT_SRC_NOT_FOUND");
    if (state.routeConductorScriptSrc === FALLBACK.NOT_FOUND) addNote(state, "ROUTE_CONDUCTOR_SCRIPT_SRC_NOT_FOUND");

    const contractMismatch = htmlMismatch || indexMismatch || routeMismatch;

    const clearMaterialScriptAnomaly = (
      state.htmlSourceReadStatus === FALLBACK.COMPLETE &&
      (
        state.indexScriptSrc === FALLBACK.NOT_FOUND ||
        state.routeConductorScriptSrc === FALLBACK.NOT_FOUND
      )
    );

    if (contractMismatch || clearMaterialScriptAnomaly) {
      state.cacheOrServedContractMismatch = MISMATCH.TRUE;
      state.case5Support = CASE5.TRUE;

      if (clearMaterialScriptAnomaly) {
        addNote(state, "SCRIPT_SOURCE_ANOMALY_CLEAR_AND_MATERIAL");
      }

      addNote(state, "CASE_5_SUPPORT_TRUE");
      return;
    }

    if (state.eastSourceReadComplete === "true") {
      state.cacheOrServedContractMismatch = MISMATCH.FALSE;
      state.case5Support = CASE5.FALSE;
      addNote(state, "SOURCE_READ_COMPLETE_MATCHED");
      return;
    }

    state.cacheOrServedContractMismatch = MISMATCH.UNKNOWN;
    state.case5Support = state.eastSourceReadStatus === FALLBACK.PARTIAL
      ? CASE5.INSUFFICIENT_EVIDENCE
      : CASE5.UNKNOWN;

    addNote(state, "CASE_5_SUPPORT_NOT_PROVEN");
  }

  function makeEvidencePacket(state) {
    return {
      EAST_STATUS: state.eastStatus,
      EAST_CONTRACT: CONTRACT,
      EAST_RECEIPT: RECEIPT,
      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,

      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,

      HTML_SOURCE_READ_STATUS: state.htmlSourceReadStatus,
      INDEX_JS_SOURCE_READ_STATUS: state.indexJsSourceReadStatus,
      ROUTE_CONDUCTOR_SOURCE_READ_STATUS: state.routeConductorSourceReadStatus,

      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CASE_5_SUPPORT: state.case5Support,
      EAST_SECONDARY_EVIDENCE_NOTES: state.eastSecondaryEvidenceNotes.length
        ? state.eastSecondaryEvidenceNotes.join(" | ")
        : "none"
    };
  }

  async function runEastSourceRead() {
    const state = makeState();
    state.eastStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const html = await fetchText(TARGET_HTML_FILE, state, "HTML");
      const indexJs = await fetchText(TARGET_INDEX_JS_FILE, state, "INDEX_JS");
      const routeConductor = await fetchText(TARGET_ROUTE_CONDUCTOR_FILE, state, "ROUTE_CONDUCTOR");

      state.htmlSourceReadStatus = html.status;
      state.indexJsSourceReadStatus = indexJs.status;
      state.routeConductorSourceReadStatus = routeConductor.status;

      if (html.ok) {
        state.servedHtmlContract = extractHtmlContract(html.text);
        state.indexScriptSrc = extractScriptSrc(html.text, "index.js", state, "INDEX_SCRIPT_SRC");
        state.routeConductorScriptSrc = extractScriptSrc(html.text, "hearth.js", state, "ROUTE_CONDUCTOR_SCRIPT_SRC");

        if (state.servedHtmlContract === FALLBACK.UNKNOWN) addNote(state, "HTML_CONTRACT_UNKNOWN");
      } else {
        state.servedHtmlContract = html.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
        state.indexScriptSrc = FALLBACK.UNREADABLE;
        state.routeConductorScriptSrc = FALLBACK.UNREADABLE;
      }

      if (indexJs.ok) {
        state.servedIndexJsContract = extractJsContract(
          indexJs.text,
          EXPECTED_INDEX_JS_CONTRACT,
          "HEARTH_INDEX_JS"
        );

        if (state.servedIndexJsContract === FALLBACK.UNKNOWN) addNote(state, "INDEX_JS_CONTRACT_UNKNOWN");
      } else {
        state.servedIndexJsContract = indexJs.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
      }

      if (routeConductor.ok) {
        state.servedRouteConductorContract = extractJsContract(
          routeConductor.text,
          EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
          "HEARTH_ROUTE_CONDUCTOR"
        );

        if (state.servedRouteConductorContract === FALLBACK.UNKNOWN) addNote(state, "ROUTE_CONDUCTOR_CONTRACT_UNKNOWN");
      } else {
        state.servedRouteConductorContract = routeConductor.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
      }

      evaluateReadStatus(state);
      evaluateMismatch(state);

      state.eastStatus = state.eastSourceReadStatus === FALLBACK.COMPLETE
        ? STATUS.COMPLETE
        : state.eastSourceReadStatus === FALLBACK.FAILED
          ? STATUS.FAILED
          : STATUS.PARTIAL;

      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.eastStatus = STATUS.FAILED;
      state.eastSourceReadComplete = "false";
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.cacheOrServedContractMismatch = MISMATCH.UNKNOWN;
      state.case5Support = CASE5.UNKNOWN;
      addNote(state, normalizeError(error, "EAST_SOURCE_READ_TOP_LEVEL_ERROR"));
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: normalizeError(error, "EAST_SOURCE_READ_TOP_LEVEL_ERROR"),
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getEastReceipt() {
    return {
      childRole: "EAST_SERVED_SOURCE_EVIDENCE",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      renderedTargetAuthority: false,
      syntheticActivationAuthority: false,
      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,
      case5EvidenceSupportOnly: true,

      runEastSourceReadApiAvailable: true,
      getEastReceiptApiAvailable: true,
      getEastStateApiAvailable: true,

      servedHtmlReadOwned: true,
      servedIndexJsReadOwned: true,
      servedRouteConductorReadOwned: true,
      contractExtractionOwned: true,
      scriptSourceExtractionOwned: true,
      routeAwareScriptMatchingOwned: true,
      cacheOrServedContractMismatchEvidenceOwned: true,

      renderedTargetProbingOwned: false,
      showReceiptTestingOwned: false,
      hitTestInspectionOwned: false,
      pointerEventsInspectionOwned: false,
      overlayInspectionOwned: false,
      runtimeReleaseInspectionOwned: false,
      syntheticActivationOwned: false,
      packetFormattingOwned: false,
      diagnosticUiOwned: false,

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastEastStatus: lastEvidencePacket ? lastEvidencePacket.EAST_STATUS : STATUS.READY,
      lastEastSourceReadStatus: lastEvidencePacket ? lastEvidencePacket.EAST_SOURCE_READ_STATUS : FALLBACK.UNKNOWN,
      lastCase5Support: lastEvidencePacket ? lastEvidencePacket.CASE_5_SUPPORT : CASE5.UNKNOWN,
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

    root.HEARTH_DIAGNOSTIC_EAST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST = api;

    root.HEARTH_DIAGNOSTIC_EAST_RECEIPT = getEastReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT = getEastReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,

    runEastSourceRead,
    getEastReceipt,
    getEastState,

    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
