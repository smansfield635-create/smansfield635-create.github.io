// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Full-file replacement.
// Diagnostic rail EAST child only.
// Implementation renewal:
// - HEARTH_DIAGNOSTIC_EAST_HTML_CONTRACT_ALIGNMENT_TNT_v1
// Purpose:
// - Preserve the public EAST child contract required by NORTH.
// - Align served Hearth HTML recognition to the current production shell.
// - Recognize HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4 as current.
// - Preserve HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2 as accepted lineage.
// - Preserve HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1 as previous accepted lineage.
// - Prevent false CASE_5 caused only by stale expected-contract drift.
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
// - diagnostic route loading
// - NORTH calls from the production Hearth route
// - Canvas, runtime release, route conductor handoff, or planet rendering

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";
  const IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_EAST_HTML_CONTRACT_ALIGNMENT_TNT_v1";
  const VERSION = "2026-06-02.hearth-diagnostic-east-html-contract-alignment-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const TARGET_HTML_FILE = "/showroom/globe/hearth/index.html";
  const TARGET_INDEX_JS_FILE = "/showroom/globe/hearth/index.js";
  const TARGET_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";

  const CURRENT_EXPECTED_HTML_CONTRACT = "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4";
  const ACCEPTED_LINEAGE_HTML_CONTRACT = "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2";
  const PREVIOUS_ACCEPTED_HTML_CONTRACT = "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1";

  const EXPECTED_HTML_CONTRACT = CURRENT_EXPECTED_HTML_CONTRACT;
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

  function bounded(value, limit = 1000) {
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

  function boolString(value) {
    return value === true ? "true" : "false";
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
      implementationContract: IMPLEMENTATION_CONTRACT,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,

      currentExpectedHtmlContract: CURRENT_EXPECTED_HTML_CONTRACT,
      acceptedLineageHtmlContract: ACCEPTED_LINEAGE_HTML_CONTRACT,
      previousAcceptedHtmlContract: PREVIOUS_ACCEPTED_HTML_CONTRACT,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,

      observedHtmlContract: FALLBACK.UNKNOWN,
      currentHtmlContractRecognized: "false",
      acceptedLineageRecognized: "false",
      previousAcceptedRecognized: "false",
      htmlContractMismatch: MISMATCH.UNKNOWN,
      staleExpectedContractDriftPrevented: "false",
      htmlContractRecognitionStatus: FALLBACK.UNKNOWN,

      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,

      htmlSourceReadStatus: FALLBACK.UNKNOWN,
      indexJsSourceReadStatus: FALLBACK.UNKNOWN,
      routeConductorSourceReadStatus: FALLBACK.UNKNOWN,

      cacheOrServedContractMismatch: MISMATCH.UNKNOWN,
      case5Support: CASE5.UNKNOWN,

      sourceReadAttempted: "false",
      sourceReadComplete: "false",
      sourceReadPartial: "false",
      sourceReadFailed: "false",
      sourceEvidenceStatus: FALLBACK.UNKNOWN,
      servedSourceContract: FALLBACK.UNKNOWN,
      domDatasetContract: FALLBACK.UNKNOWN,
      metaContract: FALLBACK.UNKNOWN,
      scriptContract: FALLBACK.UNKNOWN,
      cacheKeyEvidence: FALLBACK.UNKNOWN,

      eastSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      eastOwnsFinalCase: false,
      eastOwnsRepair: false,
      eastOwnsRuntimeRelease: false,
      eastOwnsCanvas: false,
      eastOwnsDiagnosticRouteLoad: false,
      eastReportsToNorth: true,

      f13Claimed: false,
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
        return { ok: false, status: FALLBACK.UNREADABLE, text: "", error: "FETCH_UNAVAILABLE" };
      }

      const response = await root.fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!response) {
        addNote(state, `${label}_FETCH_FAILED:NO_RESPONSE`);
        return { ok: false, status: FALLBACK.FAILED, text: "", error: "NO_RESPONSE" };
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
      return { ok: false, status: FALLBACK.FAILED, text: "", error: normalized };
    }
  }

  function firstMatch(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return packetSafe(match[1]);
    }
    return "";
  }

  function extractHtmlContractDetails(source) {
    const text = safeString(source);

    const domDatasetContract = firstMatch(text, [
      /data-contract=["']([^"']+)["']/i,
      /data-hearth-html-contract=["']([^"']+)["']/i,
      /data-hearth-shell-contract=["']([^"']+)["']/i
    ]);

    const metaContract = firstMatch(text, [
      /<meta\b[^>]*name=["']hearth-contract["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      /<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']hearth-contract["'][^>]*>/i
    ]);

    const scriptContract = firstMatch(text, [
      /<script\b[^>]*data-loaded-by=["']([^"']+)["'][^>]*>/i,
      /<script\b[^>]*data-js-selector-cache-key=["']([^"']+)["'][^>]*>/i
    ]);

    let observed = FALLBACK.UNKNOWN;
    let evidenceSource = FALLBACK.UNKNOWN;

    if (domDatasetContract) {
      observed = domDatasetContract;
      evidenceSource = "DOM_DATASET_CONTRACT";
    } else if (text.includes(CURRENT_EXPECTED_HTML_CONTRACT)) {
      observed = CURRENT_EXPECTED_HTML_CONTRACT;
      evidenceSource = "CURRENT_EXPECTED_CONTRACT_STRING";
    } else if (text.includes(ACCEPTED_LINEAGE_HTML_CONTRACT)) {
      observed = ACCEPTED_LINEAGE_HTML_CONTRACT;
      evidenceSource = "ACCEPTED_LINEAGE_CONTRACT_STRING";
    } else if (text.includes(PREVIOUS_ACCEPTED_HTML_CONTRACT)) {
      observed = PREVIOUS_ACCEPTED_HTML_CONTRACT;
      evidenceSource = "PREVIOUS_ACCEPTED_CONTRACT_STRING";
    } else if (metaContract) {
      observed = metaContract;
      evidenceSource = "META_CONTRACT";
    } else {
      const generic = text.match(/\bHEARTH_HTML_[A-Z0-9_]+_TNT_v[0-9A-Za-z_.-]+\b/);
      if (generic && generic[0]) {
        observed = packetSafe(generic[0]);
        evidenceSource = "GENERIC_HEARTH_HTML_CONTRACT";
      }
    }

    return {
      observed,
      evidenceSource,
      domDatasetContract: domDatasetContract || FALLBACK.NOT_FOUND,
      metaContract: metaContract || FALLBACK.NOT_FOUND,
      scriptContract: scriptContract || FALLBACK.NOT_FOUND
    };
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

        if (
          src === basename ||
          src === `./${basename}` ||
          src.startsWith(`${basename}?`) ||
          src.startsWith(`./${basename}?`)
        ) {
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

  function applyHtmlAlignment(state, details) {
    const observed = details && details.observed ? details.observed : FALLBACK.UNKNOWN;

    state.observedHtmlContract = observed;
    state.servedHtmlContract = observed;
    state.servedSourceContract = observed;
    state.domDatasetContract = details.domDatasetContract || FALLBACK.UNKNOWN;
    state.metaContract = details.metaContract || FALLBACK.UNKNOWN;
    state.scriptContract = details.scriptContract || FALLBACK.UNKNOWN;

    const current = observed === CURRENT_EXPECTED_HTML_CONTRACT;
    const lineage = observed === ACCEPTED_LINEAGE_HTML_CONTRACT;
    const previous = observed === PREVIOUS_ACCEPTED_HTML_CONTRACT;

    state.currentHtmlContractRecognized = boolString(current);
    state.acceptedLineageRecognized = boolString(lineage);
    state.previousAcceptedRecognized = boolString(previous);

    if (current) {
      state.htmlContractMismatch = MISMATCH.FALSE;
      state.htmlContractRecognitionStatus = "CURRENT_EXPECTED_HTML_CONTRACT_RECOGNIZED";
      state.staleExpectedContractDriftPrevented = "true";
      addNote(state, "CURRENT_EXPECTED_HTML_CONTRACT_RECOGNIZED");
      addNote(state, "STALE_EXPECTED_CONTRACT_DRIFT_PREVENTED");
      return;
    }

    if (lineage) {
      state.htmlContractMismatch = MISMATCH.FALSE;
      state.htmlContractRecognitionStatus = "ACCEPTED_LINEAGE_HTML_CONTRACT_RECOGNIZED";
      state.staleExpectedContractDriftPrevented = "true";
      addNote(state, "ACCEPTED_LINEAGE_HTML_CONTRACT_RECOGNIZED");
      addNote(state, "HTML_LINEAGE_ACCEPTED_NOT_CURRENT_FAILURE");
      return;
    }

    if (previous) {
      state.htmlContractMismatch = MISMATCH.FALSE;
      state.htmlContractRecognitionStatus = "PREVIOUS_ACCEPTED_HTML_CONTRACT_RECOGNIZED";
      state.staleExpectedContractDriftPrevented = "true";
      addNote(state, "PREVIOUS_ACCEPTED_HTML_CONTRACT_RECOGNIZED");
      addNote(state, "PREVIOUS_HTML_LINEAGE_ACCEPTED_BUT_NOT_CURRENT_SUCCESS");
      return;
    }

    if (!isConfidentContract(observed)) {
      state.htmlContractMismatch = MISMATCH.UNKNOWN;
      state.htmlContractRecognitionStatus = FALLBACK.UNKNOWN;
      addNote(state, "HTML_CONTRACT_UNKNOWN");
      return;
    }

    state.htmlContractMismatch = MISMATCH.TRUE;
    state.htmlContractRecognitionStatus = "UNRECOGNIZED_HTML_CONTRACT_MISMATCH";
    addNote(state, "HTML_CONTRACT_MISMATCH");
  }

  function evaluateReadStatus(state) {
    const statuses = [
      state.htmlSourceReadStatus,
      state.indexJsSourceReadStatus,
      state.routeConductorSourceReadStatus
    ];

    const allComplete = statuses.every((value) => value === FALLBACK.COMPLETE);
    const allFailed = statuses.every((value) =>
      value === FALLBACK.FAILED ||
      value === FALLBACK.UNREADABLE ||
      value === FALLBACK.BLOCKED ||
      value === FALLBACK.NOT_FOUND
    );

    const anyIncomplete = statuses.some((value) => value !== FALLBACK.COMPLETE);

    const contracts = [
      state.servedHtmlContract,
      state.servedIndexJsContract,
      state.servedRouteConductorContract
    ];

    const allContractsConfident = contracts.every(isConfidentContract);

    state.eastSourceReadComplete = allComplete && allContractsConfident ? "true" : "false";
    state.sourceReadComplete = state.eastSourceReadComplete;

    if (allComplete && allContractsConfident) {
      state.eastSourceReadStatus = FALLBACK.COMPLETE;
      state.sourceEvidenceStatus = FALLBACK.COMPLETE;
    } else if (allFailed) {
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.sourceEvidenceStatus = FALLBACK.FAILED;
    } else if (anyIncomplete || !allContractsConfident) {
      state.eastSourceReadStatus = FALLBACK.PARTIAL;
      state.sourceEvidenceStatus = FALLBACK.PARTIAL;
    } else {
      state.eastSourceReadStatus = FALLBACK.UNKNOWN;
      state.sourceEvidenceStatus = FALLBACK.UNKNOWN;
    }

    state.sourceReadPartial = boolString(state.eastSourceReadStatus === FALLBACK.PARTIAL);
    state.sourceReadFailed = boolString(state.eastSourceReadStatus === FALLBACK.FAILED);

    if (state.eastSourceReadStatus === FALLBACK.PARTIAL) addNote(state, "SOURCE_READ_PARTIAL");
    if (state.eastSourceReadStatus === FALLBACK.COMPLETE) addNote(state, "SOURCE_READ_COMPLETE");
    if (state.eastSourceReadStatus === FALLBACK.FAILED) addNote(state, "SOURCE_READ_FAILED");
  }

  function evaluateMismatch(state) {
    const indexConfident = isConfidentContract(state.servedIndexJsContract);
    const routeConfident = isConfidentContract(state.servedRouteConductorContract);

    const htmlMismatch = state.htmlContractMismatch === MISMATCH.TRUE;
    const indexMismatch = indexConfident && state.servedIndexJsContract !== EXPECTED_INDEX_JS_CONTRACT;
    const routeMismatch = routeConfident && state.servedRouteConductorContract !== EXPECTED_ROUTE_CONDUCTOR_CONTRACT;

    if (indexMismatch) addNote(state, "INDEX_JS_CONTRACT_MISMATCH");
    if (routeMismatch) addNote(state, "ROUTE_CONDUCTOR_CONTRACT_MISMATCH");

    if (state.indexScriptSrc === FALLBACK.NOT_FOUND) addNote(state, "INDEX_SCRIPT_SRC_NOT_FOUND");
    if (state.routeConductorScriptSrc === FALLBACK.NOT_FOUND) addNote(state, "ROUTE_CONDUCTOR_SCRIPT_SRC_NOT_FOUND");

    const clearMaterialScriptAnomaly = (
      state.htmlSourceReadStatus === FALLBACK.COMPLETE &&
      (
        state.indexScriptSrc === FALLBACK.NOT_FOUND ||
        state.routeConductorScriptSrc === FALLBACK.NOT_FOUND
      )
    );

    if (htmlMismatch || indexMismatch || routeMismatch || clearMaterialScriptAnomaly) {
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
      addNote(state, "SOURCE_READ_COMPLETE_MATCHED_OR_ACCEPTED_LINEAGE");
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
      EAST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,

      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,

      CURRENT_EXPECTED_HTML_CONTRACT: state.currentExpectedHtmlContract,
      ACCEPTED_LINEAGE_HTML_CONTRACT: state.acceptedLineageHtmlContract,
      PREVIOUS_ACCEPTED_HTML_CONTRACT: state.previousAcceptedHtmlContract,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,

      OBSERVED_HTML_CONTRACT: state.observedHtmlContract,
      CURRENT_HTML_CONTRACT_RECOGNIZED: state.currentHtmlContractRecognized,
      ACCEPTED_LINEAGE_RECOGNIZED: state.acceptedLineageRecognized,
      PREVIOUS_ACCEPTED_RECOGNIZED: state.previousAcceptedRecognized,
      HTML_CONTRACT_MISMATCH: state.htmlContractMismatch,
      STALE_EXPECTED_CONTRACT_DRIFT_PREVENTED: state.staleExpectedContractDriftPrevented,
      HTML_CONTRACT_RECOGNITION_STATUS: state.htmlContractRecognitionStatus,

      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,

      HTML_SOURCE_READ_STATUS: state.htmlSourceReadStatus,
      INDEX_JS_SOURCE_READ_STATUS: state.indexJsSourceReadStatus,
      ROUTE_CONDUCTOR_SOURCE_READ_STATUS: state.routeConductorSourceReadStatus,

      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CASE_5_SUPPORT: state.case5Support,

      SOURCE_READ_ATTEMPTED: state.sourceReadAttempted,
      SOURCE_READ_COMPLETE: state.sourceReadComplete,
      SOURCE_READ_PARTIAL: state.sourceReadPartial,
      SOURCE_READ_FAILED: state.sourceReadFailed,
      SOURCE_EVIDENCE_STATUS: state.sourceEvidenceStatus,
      SERVED_SOURCE_CONTRACT: state.servedSourceContract,
      DOM_DATASET_CONTRACT: state.domDatasetContract,
      META_CONTRACT: state.metaContract,
      SCRIPT_CONTRACT: state.scriptContract,
      CACHE_KEY_EVIDENCE: state.cacheKeyEvidence,

      EAST_SECONDARY_EVIDENCE_NOTES: state.eastSecondaryEvidenceNotes.length
        ? state.eastSecondaryEvidenceNotes.join(" | ")
        : "none"
    };
  }

  async function runEastSourceRead() {
    const state = makeState();
    state.eastStatus = STATUS.RUNNING;
    state.sourceReadAttempted = "true";
    state.updatedAt = nowIso();

    try {
      const html = await fetchText(TARGET_HTML_FILE, state, "HTML");
      const indexJs = await fetchText(TARGET_INDEX_JS_FILE, state, "INDEX_JS");
      const routeConductor = await fetchText(TARGET_ROUTE_CONDUCTOR_FILE, state, "ROUTE_CONDUCTOR");

      state.htmlSourceReadStatus = html.status;
      state.indexJsSourceReadStatus = indexJs.status;
      state.routeConductorSourceReadStatus = routeConductor.status;

      if (html.ok) {
        const details = extractHtmlContractDetails(html.text);
        applyHtmlAlignment(state, details);

        state.indexScriptSrc = extractScriptSrc(html.text, "index.js", state, "INDEX_SCRIPT_SRC");
        state.routeConductorScriptSrc = extractScriptSrc(html.text, "hearth.js", state, "ROUTE_CONDUCTOR_SCRIPT_SRC");

        const cacheNotes = state.eastSecondaryEvidenceNotes.filter((note) => /CACHE_KEY_DETECTED/.test(note));
        state.cacheKeyEvidence = cacheNotes.length ? cacheNotes.join(" | ") : FALLBACK.NOT_FOUND;
      } else {
        state.servedHtmlContract = html.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
        state.observedHtmlContract = state.servedHtmlContract;
        state.servedSourceContract = state.servedHtmlContract;
        state.htmlContractMismatch = MISMATCH.UNKNOWN;
        state.htmlContractRecognitionStatus = FALLBACK.UNREADABLE;
        state.indexScriptSrc = FALLBACK.UNREADABLE;
        state.routeConductorScriptSrc = FALLBACK.UNREADABLE;
        state.cacheKeyEvidence = FALLBACK.UNREADABLE;
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
        implementationContract: IMPLEMENTATION_CONTRACT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.eastStatus = STATUS.FAILED;
      state.eastSourceReadComplete = "false";
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.sourceReadComplete = "false";
      state.sourceReadFailed = "true";
      state.sourceEvidenceStatus = FALLBACK.FAILED;
      state.cacheOrServedContractMismatch = MISMATCH.UNKNOWN;
      state.case5Support = CASE5.UNKNOWN;
      addNote(state, normalizeError(error, "EAST_SOURCE_READ_TOP_LEVEL_ERROR"));
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        error: normalizeError(error, "EAST_SOURCE_READ_TOP_LEVEL_ERROR"),
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
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

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
      htmlContractAlignmentOwned: true,

      renderedTargetProbingOwned: false,
      showReceiptTestingOwned: false,
      hitTestInspectionOwned: false,
      pointerEventsInspectionOwned: false,
      overlayInspectionOwned: false,
      runtimeReleaseInspectionOwned: false,
      syntheticActivationOwned: false,
      packetFormattingOwned: false,
      diagnosticUiOwned: false,
      diagnosticRouteLoadOwned: false,
      northCallFromProductionRouteOwned: false,

      currentExpectedHtmlContract: CURRENT_EXPECTED_HTML_CONTRACT,
      acceptedLineageHtmlContract: ACCEPTED_LINEAGE_HTML_CONTRACT,
      previousAcceptedHtmlContract: PREVIOUS_ACCEPTED_HTML_CONTRACT,
      observedHtmlContract: state.observedHtmlContract || FALLBACK.UNKNOWN,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized || "false",
      acceptedLineageRecognized: state.acceptedLineageRecognized || "false",
      previousAcceptedRecognized: state.previousAcceptedRecognized || "false",
      htmlContractMismatch: state.htmlContractMismatch || MISMATCH.UNKNOWN,
      staleExpectedContractDriftPrevented: state.staleExpectedContractDriftPrevented || "false",

      sourceReadAttempted: state.sourceReadAttempted || "false",
      sourceReadComplete: state.sourceReadComplete || "false",
      sourceReadPartial: state.sourceReadPartial || "false",
      sourceReadFailed: state.sourceReadFailed || "false",
      sourceEvidenceStatus: state.sourceEvidenceStatus || FALLBACK.UNKNOWN,
      servedSourceContract: state.servedSourceContract || FALLBACK.UNKNOWN,
      domDatasetContract: state.domDatasetContract || FALLBACK.UNKNOWN,
      metaContract: state.metaContract || FALLBACK.UNKNOWN,
      scriptContract: state.scriptContract || FALLBACK.UNKNOWN,
      cacheKeyEvidence: state.cacheKeyEvidence || FALLBACK.UNKNOWN,

      eastOwnsFinalCase: false,
      eastOwnsRepair: false,
      eastOwnsRuntimeRelease: false,
      eastOwnsCanvas: false,
      eastOwnsDiagnosticRouteLoad: false,
      eastReportsToNorth: true,

      f13Claimed: false,
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
    implementationContract: IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    runEastSourceRead,
    getEastReceipt,
    getEastState,

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

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
