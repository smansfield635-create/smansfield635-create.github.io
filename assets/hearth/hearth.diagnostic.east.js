// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_TNT_v3
// Full-file replacement.
// Parent-visible EAST contract preserved for NORTH validation:
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Diagnostic rail EAST child only.
// Purpose:
// - Renew Diagnostic EAST source-read expectations to the current Hearth page spread.
// - Accept current Hearth HTML v2_6 as the current served HTML contract.
// - Preserve HTML v2_5, v2_4, v2_3, v2_2, and v2_1 as accepted lineage, not cache mismatch.
// - Preserve Index v5_4 as current and Index v5_3 as accepted lineage.
// - Read Index v5_4 in context without treating its internal stale HTML expectation as controlling evidence.
// - Preserve Route Conductor v9_4 as current and v9_3 / v9_2 as accepted lineage.
// - Fetch index.js from the HTML script src when present.
// - Fetch hearth.js directly when the HTML does not list it as a direct script tag.
// - Prevent false CASE_5 when direct source reads confirm current or accepted lineage contracts.
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
  const ALIGNMENT_CONTRACT = "HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_TNT_v3";
  const RECEIPT = "HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_RECEIPT_v3";
  const PREVIOUS_ALIGNMENT_CONTRACT = "HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_V9_4_EXPECTATION_ALIGNMENT_TNT_v2";
  const PREVIOUS_RECEIPT = "HEARTH_DIAGNOSTIC_EAST_ROUTE_CONDUCTOR_V9_4_EXPECTATION_ALIGNMENT_RECEIPT_v2";
  const VERSION = "2026-06-03.hearth-diagnostic-east-hearth-index-context-current-spread-alignment-v3";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const TARGET_HTML_FILE = "/showroom/globe/hearth/index.html";
  const TARGET_INDEX_JS_FILE = "/showroom/globe/hearth/index.js";
  const TARGET_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";

  const CURRENT_EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6";

  const ACCEPTED_LINEAGE_HTML_CONTRACTS = Object.freeze([
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const CURRENT_EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS = Object.freeze([
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const EXPECTED_HTML_CONTRACT = CURRENT_EXPECTED_HTML_CONTRACT;
  const EXPECTED_INDEX_JS_CONTRACT = CURRENT_EXPECTED_INDEX_JS_CONTRACT;
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT = CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT;

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

  function bounded(value, limit = 1200) {
    return safeTrim(value).slice(0, limit);
  }

  function packetSafe(value, fallback = FALLBACK.UNKNOWN) {
    const text = safeTrim(value);
    return text || fallback;
  }

  function joinContracts(list) {
    return Array.isArray(list) ? list.join(" | ") : safeString(list);
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
    const clean = bounded(note, 1200);
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
      eastAlignmentContract: ALIGNMENT_CONTRACT,
      eastReceipt: RECEIPT,
      previousAlignmentContract: PREVIOUS_ALIGNMENT_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,

      currentExpectedHtmlContract: CURRENT_EXPECTED_HTML_CONTRACT,
      acceptedLineageHtmlContracts: joinContracts(ACCEPTED_LINEAGE_HTML_CONTRACTS),

      currentExpectedIndexJsContract: CURRENT_EXPECTED_INDEX_JS_CONTRACT,
      acceptedLineageIndexJsContracts: joinContracts(ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS),

      currentExpectedRouteConductorContract: CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      acceptedLineageRouteConductorContracts: joinContracts(ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS),

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,

      observedHtmlContract: FALLBACK.UNKNOWN,
      observedIndexJsContract: FALLBACK.UNKNOWN,
      observedRouteConductorContract: FALLBACK.UNKNOWN,

      currentHtmlContractRecognized: FALLBACK.UNKNOWN,
      acceptedHtmlLineageRecognized: FALLBACK.UNKNOWN,
      acceptedHtmlLineageMatchedContract: FALLBACK.UNKNOWN,
      htmlContractMismatch: FALLBACK.UNKNOWN,
      staleExpectedHtmlContractDriftPrevented: FALLBACK.UNKNOWN,

      currentIndexJsContractRecognized: FALLBACK.UNKNOWN,
      acceptedIndexJsLineageRecognized: FALLBACK.UNKNOWN,
      acceptedIndexJsLineageMatchedContract: FALLBACK.UNKNOWN,
      indexJsContractMismatch: FALLBACK.UNKNOWN,
      staleExpectedIndexJsContractDriftPrevented: FALLBACK.UNKNOWN,

      currentRouteConductorContractRecognized: FALLBACK.UNKNOWN,
      acceptedRouteConductorLineageRecognized: FALLBACK.UNKNOWN,
      acceptedRouteConductorLineageMatchedContract: FALLBACK.UNKNOWN,
      routeConductorContractMismatch: FALLBACK.UNKNOWN,
      staleExpectedRouteConductorContractDriftPrevented: FALLBACK.UNKNOWN,

      domDatasetContract: FALLBACK.UNKNOWN,
      metaContract: FALLBACK.UNKNOWN,
      scriptContract: FALLBACK.UNKNOWN,
      cacheKeyEvidence: FALLBACK.UNKNOWN,

      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      indexSourceFetchUrl: TARGET_INDEX_JS_FILE,
      routeConductorSourceFetchUrl: TARGET_ROUTE_CONDUCTOR_FILE,

      htmlSourceReadStatus: FALLBACK.UNKNOWN,
      indexJsSourceReadStatus: FALLBACK.UNKNOWN,
      routeConductorSourceReadStatus: FALLBACK.UNKNOWN,

      sourceReadAttempted: "false",
      sourceReadComplete: "false",
      sourceReadPartial: "false",
      sourceReadFailed: "false",
      sourceEvidenceStatus: FALLBACK.UNKNOWN,

      indexInternalHtmlExpectation: FALLBACK.UNKNOWN,
      indexInternalHtmlExpectationIsCurrent: FALLBACK.UNKNOWN,
      indexInternalHtmlExpectationIsAcceptedLineage: FALLBACK.UNKNOWN,
      indexInternalHtmlExpectationNonControlling: "true",

      routeConductorDirectSourceFallbackUsed: "false",
      routeConductorDirectSourceFallbackMatched: FALLBACK.UNKNOWN,

      cacheOrServedContractMismatch: MISMATCH.UNKNOWN,
      case5Support: CASE5.UNKNOWN,

      eastSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      eastOwnsFinalCase: false,
      eastOwnsRepair: false,
      eastOwnsRuntimeRelease: false,
      eastOwnsCanvas: false,
      eastOwnsDiagnosticRouteLoad: false,
      eastReportsToNorth: true,

      ...FINAL_FALSE
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
        addNote(state, `${label}_FETCH_FAILED:${bounded(statusText, 220)}`);
        return {
          ok: false,
          status: response.status === 404 ? FALLBACK.NOT_FOUND : FALLBACK.FAILED,
          text: "",
          error: statusText
        };
      }

      const text = await response.text();
      return { ok: true, status: FALLBACK.COMPLETE, text: safeString(text), error: "" };
    } catch (error) {
      const normalized = normalizeError(error, `${label}_FETCH_ERROR`);
      addNote(state, normalized);
      return { ok: false, status: FALLBACK.FAILED, text: "", error: normalized };
    }
  }

  function findFirst(source, patterns) {
    const text = safeString(source);

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return packetSafe(match[1]);
      if (match && match[0]) return packetSafe(match[0]);
    }

    return FALLBACK.UNKNOWN;
  }

  function extractHtmlContractParts(source) {
    const text = safeString(source);

    const dataContract = findFirst(text, [
      /data-contract=["']([^"']+)["']/i,
      /data-hearth-html-contract=["']([^"']+)["']/i,
      /data-hearth-shell-contract=["']([^"']+)["']/i
    ]);

    const metaContract = findFirst(text, [
      /<meta\b[^>]*name=["']hearth-html-contract["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      /<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']hearth-html-contract["'][^>]*>/i
    ]);

    let exactContract = FALLBACK.UNKNOWN;

    const knownContracts = [
      CURRENT_EXPECTED_HTML_CONTRACT,
      ...ACCEPTED_LINEAGE_HTML_CONTRACTS
    ];

    for (const contract of knownContracts) {
      if (text.includes(contract)) {
        exactContract = contract;
        break;
      }
    }

    const genericContract = findFirst(text, [
      /\bHEARTH_HTML_[A-Z0-9_]+_TNT_v[0-9A-Za-z_.-]+\b/
    ]);

    const contract = dataContract !== FALLBACK.UNKNOWN
      ? dataContract
      : metaContract !== FALLBACK.UNKNOWN
        ? metaContract
        : exactContract !== FALLBACK.UNKNOWN
          ? exactContract
          : genericContract;

    return { contract, domDatasetContract: dataContract, metaContract, exactContract, genericContract };
  }

  function extractJsContract(source, expectedContracts, genericPrefix) {
    const text = safeString(source);
    const expected = Array.isArray(expectedContracts) ? expectedContracts : [expectedContracts].filter(Boolean);

    for (const contract of expected) {
      if (contract && text.includes(contract)) return contract;
    }

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

  function extractIndexInternalHtmlExpectation(indexSource) {
    const text = safeString(indexSource);

    const direct = findFirst(text, [
      /\b(?:const|let|var)\s+CURRENT_HTML_CONTRACT\s*=\s*["']([^"']+)["']/,
      /\bcurrentHtmlContract\s*:\s*["']([^"']+)["']/i,
      /\bCURRENT_HTML_CONTRACT\s*=\s*["']([^"']+)["']/i
    ]);

    if (direct !== FALLBACK.UNKNOWN) return direct;

    const generic = text.match(/\bHEARTH_HTML_[A-Z0-9_]+_TNT_v[0-9A-Za-z_.-]+\b/);
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
    } catch (_error) {}
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
        absoluteFetchPath: `${pathname}${url.search || ""}`,
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
        absoluteFetchPath: clean,
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
      if (!isRouteAwareScriptMatch(src, basename)) continue;

      const normalized = normalizeScriptSource(src);
      matches.push(src);

      if (normalized.cacheKeyed) addNote(state, `${notePrefix}_CACHE_KEY_DETECTED`);
      if (src === basename || src === `./${basename}` || src.startsWith(`${basename}?`) || src.startsWith(`./${basename}?`)) {
        addNote(state, `${notePrefix}_RELATIVE_PATH_DETECTED`);
      }
    }

    return matches.length ? matches[0] : FALLBACK.NOT_FOUND;
  }

  function scriptSrcToFetchUrl(src, fallbackFile, state, notePrefix) {
    if (!src || src === FALLBACK.UNKNOWN || src === FALLBACK.NOT_FOUND || src === FALLBACK.UNREADABLE) {
      addNote(state, `${notePrefix}_FETCH_FALLBACK_DIRECT_FILE`);
      return fallbackFile;
    }

    const normalized = normalizeScriptSource(src);
    addNote(state, `${notePrefix}_FETCH_URL_FROM_HTML_SCRIPT_SRC`);
    return normalized.absoluteFetchPath || fallbackFile;
  }

  function readCacheKeyEvidence(indexScriptSrc, routeConductorScriptSrc) {
    const values = [indexScriptSrc, routeConductorScriptSrc]
      .map((value) => safeString(value))
      .filter((value) => value && value !== FALLBACK.UNKNOWN && value !== FALLBACK.NOT_FOUND && value !== FALLBACK.UNREADABLE);

    const keyed = values.filter((value) => value.includes("?"));
    return keyed.length ? keyed.join(" | ") : FALLBACK.NOT_FOUND;
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

  function scopeLabel(scope) {
    return safeString(scope).replace(/[A-Z]/g, (match, index) => (index ? "_" : "") + match).toUpperCase();
  }

  function setRecognitionState(state, scope, values) {
    const lower = scope.charAt(0).toLowerCase() + scope.slice(1);
    state[`current${scope}ContractRecognized`] = values.current ? "true" : "false";
    state[`accepted${scope}LineageRecognized`] = values.lineage ? "true" : "false";
    state[`accepted${scope}LineageMatchedContract`] = values.lineageContract || FALLBACK.UNKNOWN;
    state[`${lower}ContractMismatch`] = values.mismatch;
    state[`staleExpected${scope}ContractDriftPrevented`] = values.driftPrevented;
  }

  function evaluateContractRecognition(state, scope, observed, current, acceptedLineage) {
    const accepted = Array.isArray(acceptedLineage) ? acceptedLineage : [acceptedLineage].filter(Boolean);
    const label = scopeLabel(scope);

    if (!isConfidentContract(observed)) {
      setRecognitionState(state, scope, {
        current: false,
        lineage: false,
        lineageContract: FALLBACK.UNKNOWN,
        mismatch: FALLBACK.UNKNOWN,
        driftPrevented: FALLBACK.UNKNOWN
      });
      return {
        recognized: false,
        current: false,
        lineage: false,
        lineageContract: FALLBACK.UNKNOWN,
        mismatch: FALLBACK.UNKNOWN
      };
    }

    if (observed === current) {
      setRecognitionState(state, scope, {
        current: true,
        lineage: false,
        lineageContract: FALLBACK.UNKNOWN,
        mismatch: "false",
        driftPrevented: "true"
      });
      addNote(state, `CURRENT_EXPECTED_${label}_CONTRACT_RECOGNIZED`);
      addNote(state, `STALE_EXPECTED_${label}_CONTRACT_DRIFT_PREVENTED`);
      return {
        recognized: true,
        current: true,
        lineage: false,
        lineageContract: FALLBACK.UNKNOWN,
        mismatch: "false"
      };
    }

    if (accepted.includes(observed)) {
      setRecognitionState(state, scope, {
        current: false,
        lineage: true,
        lineageContract: observed,
        mismatch: "false",
        driftPrevented: "true"
      });
      addNote(state, `ACCEPTED_${label}_CONTRACT_LINEAGE_RECOGNIZED`);
      addNote(state, `${label}_LINEAGE_NOT_TREATED_AS_CURRENT_FAILURE`);
      return {
        recognized: true,
        current: false,
        lineage: true,
        lineageContract: observed,
        mismatch: "false"
      };
    }

    setRecognitionState(state, scope, {
      current: false,
      lineage: false,
      lineageContract: FALLBACK.UNKNOWN,
      mismatch: "true",
      driftPrevented: "false"
    });
    addNote(state, `${label}_CONTRACT_MISMATCH`);
    return {
      recognized: false,
      current: false,
      lineage: false,
      lineageContract: FALLBACK.UNKNOWN,
      mismatch: "true"
    };
  }

  function evaluateIndexInternalHtmlContext(state) {
    const expectation = state.indexInternalHtmlExpectation;

    if (!isConfidentContract(expectation)) {
      state.indexInternalHtmlExpectationIsCurrent = FALLBACK.UNKNOWN;
      state.indexInternalHtmlExpectationIsAcceptedLineage = FALLBACK.UNKNOWN;
      addNote(state, "INDEX_INTERNAL_HTML_EXPECTATION_UNREADABLE_OR_ABSENT");
      return;
    }

    state.indexInternalHtmlExpectationIsCurrent = expectation === CURRENT_EXPECTED_HTML_CONTRACT ? "true" : "false";
    state.indexInternalHtmlExpectationIsAcceptedLineage = ACCEPTED_LINEAGE_HTML_CONTRACTS.includes(expectation) ? "true" : "false";
    state.indexInternalHtmlExpectationNonControlling = "true";

    if (state.indexInternalHtmlExpectationIsCurrent === "false") {
      addNote(state, "INDEX_INTERNAL_HTML_EXPECTATION_STALE_BUT_NON_CONTROLLING");
    }

    if (state.indexInternalHtmlExpectationIsAcceptedLineage === "true") {
      addNote(state, "INDEX_INTERNAL_HTML_EXPECTATION_ACCEPTED_LINEAGE_CONTEXT");
    }
  }

  function evaluateReadStatus(state) {
    const statuses = [
      state.htmlSourceReadStatus,
      state.indexJsSourceReadStatus,
      state.routeConductorSourceReadStatus
    ];

    const allComplete = statuses.every((value) => value === FALLBACK.COMPLETE);
    const allFailed = statuses.every((value) => (
      value === FALLBACK.FAILED ||
      value === FALLBACK.UNREADABLE ||
      value === FALLBACK.BLOCKED ||
      value === FALLBACK.NOT_FOUND
    ));
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
      addNote(state, "SOURCE_READ_COMPLETE");
    } else if (allFailed) {
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.sourceEvidenceStatus = FALLBACK.FAILED;
      state.sourceReadFailed = "true";
      addNote(state, "SOURCE_READ_FAILED");
    } else if (anyIncomplete || !allContractsConfident) {
      state.eastSourceReadStatus = FALLBACK.PARTIAL;
      state.sourceEvidenceStatus = FALLBACK.PARTIAL;
      state.sourceReadPartial = "true";
      addNote(state, "SOURCE_READ_PARTIAL");
    } else {
      state.eastSourceReadStatus = FALLBACK.UNKNOWN;
      state.sourceEvidenceStatus = FALLBACK.UNKNOWN;
    }
  }

  function evaluateMismatch(state) {
    state.observedHtmlContract = state.servedHtmlContract;
    state.observedIndexJsContract = state.servedIndexJsContract;
    state.observedRouteConductorContract = state.servedRouteConductorContract;

    const html = evaluateContractRecognition(
      state,
      "Html",
      state.servedHtmlContract,
      CURRENT_EXPECTED_HTML_CONTRACT,
      ACCEPTED_LINEAGE_HTML_CONTRACTS
    );

    const index = evaluateContractRecognition(
      state,
      "IndexJs",
      state.servedIndexJsContract,
      CURRENT_EXPECTED_INDEX_JS_CONTRACT,
      ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS
    );

    const route = evaluateContractRecognition(
      state,
      "RouteConductor",
      state.servedRouteConductorContract,
      CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS
    );

    evaluateIndexInternalHtmlContext(state);

    if (state.indexScriptSrc === FALLBACK.NOT_FOUND) {
      addNote(state, "INDEX_SCRIPT_SRC_NOT_FOUND");
    }

    if (state.routeConductorScriptSrc === FALLBACK.NOT_FOUND) {
      state.routeConductorDirectSourceFallbackUsed = "true";
      addNote(state, "ROUTE_CONDUCTOR_SCRIPT_SRC_NOT_DIRECTLY_LOADED_BY_HTML");

      if (route.recognized) {
        state.routeConductorDirectSourceFallbackMatched = "true";
        addNote(state, "ROUTE_CONDUCTOR_SOURCE_FETCH_FALLBACK_DIRECT_FILE_MATCHED_NO_FALSE_CASE_5");
      } else {
        state.routeConductorDirectSourceFallbackMatched = "false";
      }
    }

    const indexScriptMissingMaterial = Boolean(
      state.htmlSourceReadStatus === FALLBACK.COMPLETE &&
      state.indexScriptSrc === FALLBACK.NOT_FOUND &&
      !index.recognized
    );

    const routeScriptMissingMaterial = Boolean(
      state.htmlSourceReadStatus === FALLBACK.COMPLETE &&
      state.routeConductorScriptSrc === FALLBACK.NOT_FOUND &&
      !route.recognized
    );

    const contractMismatch = Boolean(
      html.mismatch === "true" ||
      index.mismatch === "true" ||
      route.mismatch === "true"
    );

    const scriptAnomalyClearAndMaterial = indexScriptMissingMaterial || routeScriptMissingMaterial;

    if (contractMismatch || scriptAnomalyClearAndMaterial) {
      state.cacheOrServedContractMismatch = MISMATCH.TRUE;
      state.case5Support = CASE5.TRUE;
      if (scriptAnomalyClearAndMaterial) addNote(state, "SCRIPT_SOURCE_ANOMALY_CLEAR_AND_MATERIAL");
      addNote(state, "CASE_5_SUPPORT_TRUE");
      return;
    }

    if (state.eastSourceReadComplete === "true") {
      state.cacheOrServedContractMismatch = MISMATCH.FALSE;
      state.case5Support = CASE5.FALSE;
      addNote(state, "SOURCE_READ_COMPLETE_MATCHED");
      addNote(state, "CASE_5_SUPPORT_FALSE");
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
      EAST_ALIGNMENT_CONTRACT: ALIGNMENT_CONTRACT,
      EAST_RECEIPT: RECEIPT,
      EAST_VERSION: VERSION,

      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,

      CURRENT_EXPECTED_HTML_CONTRACT: state.currentExpectedHtmlContract,
      ACCEPTED_LINEAGE_HTML_CONTRACTS: state.acceptedLineageHtmlContracts,

      CURRENT_EXPECTED_INDEX_JS_CONTRACT: state.currentExpectedIndexJsContract,
      ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS: state.acceptedLineageIndexJsContracts,

      CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.currentExpectedRouteConductorContract,
      ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS: state.acceptedLineageRouteConductorContracts,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,

      OBSERVED_HTML_CONTRACT: state.observedHtmlContract,
      CURRENT_HTML_CONTRACT_RECOGNIZED: state.currentHtmlContractRecognized,
      ACCEPTED_HTML_LINEAGE_RECOGNIZED: state.acceptedHtmlLineageRecognized,
      ACCEPTED_HTML_LINEAGE_MATCHED_CONTRACT: state.acceptedHtmlLineageMatchedContract,
      HTML_CONTRACT_MISMATCH: state.htmlContractMismatch,
      STALE_EXPECTED_HTML_CONTRACT_DRIFT_PREVENTED: state.staleExpectedHtmlContractDriftPrevented,

      OBSERVED_INDEX_JS_CONTRACT: state.observedIndexJsContract,
      CURRENT_INDEX_JS_CONTRACT_RECOGNIZED: state.currentIndexJsContractRecognized,
      ACCEPTED_INDEX_JS_LINEAGE_RECOGNIZED: state.acceptedIndexJsLineageRecognized,
      ACCEPTED_INDEX_JS_LINEAGE_MATCHED_CONTRACT: state.acceptedIndexJsLineageMatchedContract,
      INDEX_JS_CONTRACT_MISMATCH: state.indexJsContractMismatch,
      STALE_EXPECTED_INDEX_JS_CONTRACT_DRIFT_PREVENTED: state.staleExpectedIndexJsContractDriftPrevented,

      INDEX_INTERNAL_HTML_EXPECTATION: state.indexInternalHtmlExpectation,
      INDEX_INTERNAL_HTML_EXPECTATION_IS_CURRENT: state.indexInternalHtmlExpectationIsCurrent,
      INDEX_INTERNAL_HTML_EXPECTATION_IS_ACCEPTED_LINEAGE: state.indexInternalHtmlExpectationIsAcceptedLineage,
      INDEX_INTERNAL_HTML_EXPECTATION_NON_CONTROLLING: state.indexInternalHtmlExpectationNonControlling,

      OBSERVED_ROUTE_CONDUCTOR_CONTRACT: state.observedRouteConductorContract,
      CURRENT_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.currentRouteConductorContractRecognized,
      ACCEPTED_ROUTE_CONDUCTOR_LINEAGE_RECOGNIZED: state.acceptedRouteConductorLineageRecognized,
      ACCEPTED_ROUTE_CONDUCTOR_LINEAGE_MATCHED_CONTRACT: state.acceptedRouteConductorLineageMatchedContract,
      ROUTE_CONDUCTOR_CONTRACT_MISMATCH: state.routeConductorContractMismatch,
      STALE_EXPECTED_ROUTE_CONDUCTOR_CONTRACT_DRIFT_PREVENTED: state.staleExpectedRouteConductorContractDriftPrevented,

      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      INDEX_SOURCE_FETCH_URL: state.indexSourceFetchUrl,
      ROUTE_CONDUCTOR_SOURCE_FETCH_URL: state.routeConductorSourceFetchUrl,
      ROUTE_CONDUCTOR_DIRECT_SOURCE_FALLBACK_USED: state.routeConductorDirectSourceFallbackUsed,
      ROUTE_CONDUCTOR_DIRECT_SOURCE_FALLBACK_MATCHED: state.routeConductorDirectSourceFallbackMatched,

      HTML_SOURCE_READ_STATUS: state.htmlSourceReadStatus,
      INDEX_JS_SOURCE_READ_STATUS: state.indexJsSourceReadStatus,
      ROUTE_CONDUCTOR_SOURCE_READ_STATUS: state.routeConductorSourceReadStatus,

      SOURCE_READ_ATTEMPTED: state.sourceReadAttempted,
      SOURCE_READ_COMPLETE: state.sourceReadComplete,
      SOURCE_READ_PARTIAL: state.sourceReadPartial,
      SOURCE_READ_FAILED: state.sourceReadFailed,
      SOURCE_EVIDENCE_STATUS: state.sourceEvidenceStatus,

      SERVED_SOURCE_CONTRACT: state.servedHtmlContract,
      DOM_DATASET_CONTRACT: state.domDatasetContract,
      META_CONTRACT: state.metaContract,
      SCRIPT_CONTRACT: state.scriptContract,
      CACHE_KEY_EVIDENCE: state.cacheKeyEvidence,

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
    state.sourceReadAttempted = "true";
    state.updatedAt = nowIso();

    try {
      const html = await fetchText(TARGET_HTML_FILE, state, "HTML");
      state.htmlSourceReadStatus = html.status;

      if (html.ok) {
        const htmlParts = extractHtmlContractParts(html.text);
        state.servedHtmlContract = htmlParts.contract;
        state.domDatasetContract = htmlParts.domDatasetContract;
        state.metaContract = htmlParts.metaContract;

        state.indexScriptSrc = extractScriptSrc(html.text, "index.js", state, "INDEX_SCRIPT_SRC");
        state.routeConductorScriptSrc = extractScriptSrc(html.text, "hearth.js", state, "ROUTE_CONDUCTOR_SCRIPT_SRC");
        state.cacheKeyEvidence = readCacheKeyEvidence(state.indexScriptSrc, state.routeConductorScriptSrc);

        if (state.servedHtmlContract === FALLBACK.UNKNOWN) addNote(state, "HTML_CONTRACT_UNKNOWN");
      } else {
        state.servedHtmlContract = html.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
        state.observedHtmlContract = state.servedHtmlContract;
        state.domDatasetContract = FALLBACK.UNREADABLE;
        state.metaContract = FALLBACK.UNREADABLE;
        state.indexScriptSrc = FALLBACK.UNREADABLE;
        state.routeConductorScriptSrc = FALLBACK.UNREADABLE;
        state.cacheKeyEvidence = FALLBACK.UNREADABLE;
      }

      state.indexSourceFetchUrl = scriptSrcToFetchUrl(
        state.indexScriptSrc,
        TARGET_INDEX_JS_FILE,
        state,
        "INDEX_SOURCE"
      );

      state.routeConductorSourceFetchUrl = scriptSrcToFetchUrl(
        state.routeConductorScriptSrc,
        TARGET_ROUTE_CONDUCTOR_FILE,
        state,
        "ROUTE_CONDUCTOR_SOURCE"
      );

      const indexJs = await fetchText(state.indexSourceFetchUrl, state, "INDEX_JS");
      const routeConductor = await fetchText(state.routeConductorSourceFetchUrl, state, "ROUTE_CONDUCTOR");

      state.indexJsSourceReadStatus = indexJs.status;
      state.routeConductorSourceReadStatus = routeConductor.status;

      if (indexJs.ok) {
        state.servedIndexJsContract = extractJsContract(
          indexJs.text,
          [CURRENT_EXPECTED_INDEX_JS_CONTRACT, ...ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS],
          "HEARTH_INDEX_JS"
        );

        state.indexInternalHtmlExpectation = extractIndexInternalHtmlExpectation(indexJs.text);
        state.scriptContract = state.servedIndexJsContract;

        if (state.servedIndexJsContract === FALLBACK.UNKNOWN) addNote(state, "INDEX_JS_CONTRACT_UNKNOWN");
      } else {
        state.servedIndexJsContract = indexJs.status === FALLBACK.NOT_FOUND ? FALLBACK.NOT_FOUND : FALLBACK.UNREADABLE;
        state.indexInternalHtmlExpectation = FALLBACK.UNREADABLE;
      }

      if (routeConductor.ok) {
        state.servedRouteConductorContract = extractJsContract(
          routeConductor.text,
          [
            CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
            ...ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS
          ],
          "HEARTH_ROUTE_CONDUCTOR"
        );

        if (state.servedRouteConductorContract === FALLBACK.UNKNOWN) {
          addNote(state, "ROUTE_CONDUCTOR_CONTRACT_UNKNOWN");
        }
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
        alignmentContract: ALIGNMENT_CONTRACT,
        receipt: RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.eastStatus = STATUS.FAILED;
      state.eastSourceReadComplete = "false";
      state.sourceReadComplete = "false";
      state.sourceReadFailed = "true";
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.sourceEvidenceStatus = FALLBACK.FAILED;
      state.cacheOrServedContractMismatch = MISMATCH.UNKNOWN;
      state.case5Support = CASE5.UNKNOWN;
      addNote(state, normalizeError(error, "EAST_SOURCE_READ_TOP_LEVEL_ERROR"));
      state.updatedAt = nowIso();
      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        alignmentContract: ALIGNMENT_CONTRACT,
        receipt: RECEIPT,
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
      alignmentContract: ALIGNMENT_CONTRACT,
      receipt: RECEIPT,
      previousAlignmentContract: PREVIOUS_ALIGNMENT_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
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

      expectedHtmlContract: state.expectedHtmlContract,
      expectedIndexJsContract: state.expectedIndexJsContract,
      expectedRouteConductorContract: state.expectedRouteConductorContract,

      currentExpectedHtmlContract: state.currentExpectedHtmlContract,
      acceptedLineageHtmlContracts: state.acceptedLineageHtmlContracts,
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      acceptedHtmlLineageRecognized: state.acceptedHtmlLineageRecognized,
      acceptedHtmlLineageMatchedContract: state.acceptedHtmlLineageMatchedContract,
      htmlContractMismatch: state.htmlContractMismatch,
      staleExpectedHtmlContractDriftPrevented: state.staleExpectedHtmlContractDriftPrevented,

      currentExpectedIndexJsContract: state.currentExpectedIndexJsContract,
      acceptedLineageIndexJsContracts: state.acceptedLineageIndexJsContracts,
      observedIndexJsContract: state.observedIndexJsContract,
      currentIndexJsContractRecognized: state.currentIndexJsContractRecognized,
      acceptedIndexJsLineageRecognized: state.acceptedIndexJsLineageRecognized,
      acceptedIndexJsLineageMatchedContract: state.acceptedIndexJsLineageMatchedContract,
      indexJsContractMismatch: state.indexJsContractMismatch,
      staleExpectedIndexJsContractDriftPrevented: state.staleExpectedIndexJsContractDriftPrevented,

      indexInternalHtmlExpectation: state.indexInternalHtmlExpectation,
      indexInternalHtmlExpectationIsCurrent: state.indexInternalHtmlExpectationIsCurrent,
      indexInternalHtmlExpectationIsAcceptedLineage: state.indexInternalHtmlExpectationIsAcceptedLineage,
      indexInternalHtmlExpectationNonControlling: state.indexInternalHtmlExpectationNonControlling,

      currentExpectedRouteConductorContract: state.currentExpectedRouteConductorContract,
      acceptedLineageRouteConductorContracts: state.acceptedLineageRouteConductorContracts,
      observedRouteConductorContract: state.observedRouteConductorContract,
      currentRouteConductorContractRecognized: state.currentRouteConductorContractRecognized,
      acceptedRouteConductorLineageRecognized: state.acceptedRouteConductorLineageRecognized,
      acceptedRouteConductorLineageMatchedContract: state.acceptedRouteConductorLineageMatchedContract,
      routeConductorContractMismatch: state.routeConductorContractMismatch,
      staleExpectedRouteConductorContractDriftPrevented: state.staleExpectedRouteConductorContractDriftPrevented,

      sourceReadAttempted: state.sourceReadAttempted,
      sourceReadComplete: state.sourceReadComplete,
      sourceReadPartial: state.sourceReadPartial,
      sourceReadFailed: state.sourceReadFailed,
      sourceEvidenceStatus: state.sourceEvidenceStatus,

      servedSourceContract: state.servedHtmlContract,
      servedHtmlContract: state.servedHtmlContract,
      servedIndexJsContract: state.servedIndexJsContract,
      servedRouteConductorContract: state.servedRouteConductorContract,

      domDatasetContract: state.domDatasetContract,
      metaContract: state.metaContract,
      scriptContract: state.scriptContract,
      cacheKeyEvidence: state.cacheKeyEvidence,

      indexScriptSrc: state.indexScriptSrc,
      routeConductorScriptSrc: state.routeConductorScriptSrc,
      indexSourceFetchUrl: state.indexSourceFetchUrl,
      routeConductorSourceFetchUrl: state.routeConductorSourceFetchUrl,
      routeConductorDirectSourceFallbackUsed: state.routeConductorDirectSourceFallbackUsed,
      routeConductorDirectSourceFallbackMatched: state.routeConductorDirectSourceFallbackMatched,

      cacheOrServedContractMismatch: state.cacheOrServedContractMismatch,
      case5Support: state.case5Support,
      eastSecondaryEvidenceNotes: state.eastSecondaryEvidenceNotes.join(" | ") || "none",

      eastOwnsFinalCase: false,
      eastOwnsRepair: false,
      eastOwnsRuntimeRelease: false,
      eastOwnsCanvas: false,
      eastOwnsDiagnosticRouteLoad: false,
      eastReportsToNorth: true,

      runEastSourceReadApiAvailable: true,
      getEastReceiptApiAvailable: true,
      getEastStateApiAvailable: true,

      servedHtmlReadOwned: true,
      servedIndexJsReadOwned: true,
      servedRouteConductorReadOwned: true,
      contractExtractionOwned: true,
      scriptSourceExtractionOwned: true,
      routeAwareScriptMatchingOwned: true,
      directRouteConductorFallbackFetchOwned: true,
      cacheOrServedContractMismatchEvidenceOwned: true,
      indexInternalHtmlExpectationReadOwned: true,
      indexInternalHtmlExpectationControllingAuthority: false,

      renderedTargetProbingOwned: false,
      showReceiptTestingOwned: false,
      hitTestInspectionOwned: false,
      pointerEventsInspectionOwned: false,
      overlayInspectionOwned: false,
      runtimeReleaseInspectionOwned: false,
      syntheticActivationOwned: false,
      packetFormattingOwned: false,
      diagnosticUiOwned: false,

      ...FINAL_FALSE,

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

  const api = Object.freeze({
    contract: CONTRACT,
    alignmentContract: ALIGNMENT_CONTRACT,
    receipt: RECEIPT,
    previousAlignmentContract: PREVIOUS_ALIGNMENT_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,

    currentExpectedHtmlContract: CURRENT_EXPECTED_HTML_CONTRACT,
    acceptedLineageHtmlContracts: ACCEPTED_LINEAGE_HTML_CONTRACTS.slice(),

    currentExpectedIndexJsContract: CURRENT_EXPECTED_INDEX_JS_CONTRACT,
    acceptedLineageIndexJsContracts: ACCEPTED_LINEAGE_INDEX_JS_CONTRACTS.slice(),

    currentExpectedRouteConductorContract: CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    acceptedLineageRouteConductorContracts: ACCEPTED_LINEAGE_ROUTE_CONDUCTOR_CONTRACTS.slice(),

    runEastSourceRead,
    getEastReceipt,
    getEastState,

    ...FINAL_FALSE
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
