// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic PROBE SOUTH only.
// Early alias publication / North v10 chronology standard.
// Purpose:
// - Publish the South probe aliases NORTH v10 scans immediately.
// - Provide runProbeSouth(...) as the primary callable surface.
// - Provide all secondary callable aliases NORTH v10 accepts.
// - Inspect South rail observability, South rail callable surface, packet meaning, and chronology handoff.
// - Preserve South rail as packet-output authority.
// - Preserve this file as probe-only.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";
  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-south-early-alias-chronology-standard-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const NORTH_V10_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_V10_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";
  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_RECEIPT_v9";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_SOUTH_FILE = FILE;

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EXPECTED_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EXPECTED_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = CONTRACT;

  const NO_CLAIMS = Object.freeze({
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

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const PROBE_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      alias: "HEARTH.diagnosticProbeSouth",
      layer: "HEARTH",
      intent: "north-v10-primary-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      intent: "north-v10-explicit-rail-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      intent: "north-v10-south-probe-reverse-alias-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 5,
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 6,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_PROBE",
      layer: "GLOBAL",
      intent: "legacy-global-south-probe-reverse-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 7,
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 8,
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-probe-south-observation",
      authority: "packet-meaning-probe"
    }),
    Object.freeze({
      order: 9,
      alias: "DEXTER_LAB.hearthDiagnosticSouthProbe",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south-probe-reverse-observation",
      authority: "packet-meaning-probe"
    })
  ]);

  const SOUTH_RAIL_PATHS = Object.freeze([
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthRail",
    "HEARTH.southDiagnosticRail",
    "HEARTH.southDiagnostic",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_RAIL",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth",
    "DEXTER_LAB.hearthDiagnosticSouthRail",
    "DEXTER_LAB.hearthSouthDiagnosticRail"
  ]);

  const SOUTH_RAIL_METHODS = Object.freeze([
    "composeSouthReport",
    "runSouth",
    "composeReport",
    "inspect",
    "runDiagnostic"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  root.HEARTH = root.HEARTH || {};
  root.DEXTER_LAB = root.DEXTER_LAB || {};

  const api = getOrCreateStableApi();
  let lastReport = null;
  let lastState = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    probeRole: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION",
    diagnosticProbeOnly: true,
    probeSouthChronologyStandardCompatible: true,
    northV10Compatible: true,
    earlyAliasPublished: true,
    stableApiObject: true,

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect,
    runDiagnostic,
    getReport,
    getState,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getProbeReceipt,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
    runProbeApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    getReportApiAvailable: true,
    getStateApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,
    getProbeReceiptApiAvailable: true,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    canvasDrawingAuthority: false,
    routeConductorImplementationAuthority: false,
    controlImplementationAuthority: false,
    terrainTruthAuthority: false,
    hydrologyTruthAuthority: false,
    materialTruthAuthority: false,
    southRailPacketOutputAuthority: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  publishAliases();

  function getOrCreateStableApi() {
    const candidates = [
      root.HEARTH && root.HEARTH.diagnosticProbeSouth,
      root.HEARTH && root.HEARTH.diagnosticRailProbeSouth,
      root.HEARTH && root.HEARTH.diagnosticSouthProbe,
      root.HEARTH_DIAGNOSTIC_PROBE_SOUTH,
      root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH,
      root.HEARTH_DIAGNOSTIC_SOUTH_PROBE,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthDiagnosticProbeSouth,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthDiagnosticRailProbeSouth
    ];

    for (const candidate of candidates) {
      if (candidate && (typeof candidate === "object" || typeof candidate === "function")) {
        return candidate;
      }
    }

    return {};
  }

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

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
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

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => {
        if (isObject(entry)) {
          try {
            return JSON.stringify(entry);
          } catch (_error) {
            return bounded(entry, 1200);
          }
        }
        return bounded(entry, 1200);
      }).filter(Boolean).join(" | ");

      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 20000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }

    return "UNKNOWN";
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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

  function findFirstPath(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;

      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1400);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getSouthReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.report)) return authority.report;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
      if (!isObject(entry)) return bounded(entry, 1000);

      return [
        `${entry.order || "?"}.${entry.id || "UNKNOWN"}`,
        `file:${entry.file || "UNKNOWN"}`,
        `load:${entry.loadStatus || "UNKNOWN"}`,
        `observed:${entry.observed}`,
        `call:${entry.callStatus || "UNKNOWN"}`,
        `status:${entry.status || "UNKNOWN"}`
      ].join(" ");
    }).join(" | ");
  }

  function aliasChronologyText() {
    return PROBE_ALIAS_CHRONOLOGY.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
  }

  function extractCurrentReport(payload) {
    if (isObject(payload && payload.currentReport)) return clonePlain(payload.currentReport);
    if (isObject(payload && payload.report)) return clonePlain(payload.report);
    if (isObject(payload && payload.REPORT_OBJECT)) return clonePlain(payload.REPORT_OBJECT);
    if (isObject(payload && payload.output) && isObject(payload.output.REPORT_OBJECT)) {
      return clonePlain(payload.output.REPORT_OBJECT);
    }
    return {};
  }

  function extractChronology(payload, currentReport) {
    if (Array.isArray(payload && payload.chronology)) return clonePlain(payload.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    return [];
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function getOutputKeys(value) {
    if (!isObject(value)) return "NONE";
    return Object.keys(value).slice(0, 80).join(",") || "NONE";
  }

  function makeReport(payload = {}) {
    const currentReport = extractCurrentReport(payload);
    const chronology = extractChronology(payload, currentReport);
    const evidenceByStep = isObject(payload.evidenceByStep) ? clonePlain(payload.evidenceByStep) : {};
    const southRailFound = findFirstPath(SOUTH_RAIL_PATHS);
    const southRailReceipt = getReceiptFromAuthority(southRailFound.value) || {};
    const southRailMethods = SOUTH_RAIL_METHODS.filter((method) => {
      return isFunction(southRailFound.value && southRailFound.value[method]);
    });

    const southRailEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const probeSouthEntry = findChronologyEntry(chronology, "PROBE_SOUTH");

    const parentNorthContract = firstKnown(
      payload.northContract,
      currentReport.NORTH_CONTRACT,
      NORTH_V10_CONTRACT
    );

    const parentNorthReceipt = firstKnown(
      payload.northReceipt,
      currentReport.NORTH_RECEIPT,
      NORTH_V10_RECEIPT
    );

    const southRailObserved = Boolean(southRailFound.value);
    const southRailPrimaryMethodPresent = southRailMethods.includes("composeSouthReport");
    const southRailCallableSurfacePresent = southRailMethods.length > 0;
    const currentReportObserved = Object.keys(currentReport).length > 0;
    const chronologyObserved = chronology.length > 0;

    const southRailChronologyStatus = southRailEntry
      ? firstKnown(southRailEntry.status, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const southRailChronologyCallStatus = southRailEntry
      ? firstKnown(southRailEntry.callStatus, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const southRailChronologyCallMethod = southRailEntry
      ? firstKnown(southRailEntry.callMethod, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const reportMeaningFieldsPresent = Boolean(
      currentReportObserved &&
        firstKnown(currentReport.PACKET_NAME, REPORT_PACKET) === REPORT_PACKET &&
        parentNorthContract !== "UNKNOWN"
    );

    const southRailMeaningPresent = Boolean(
      southRailObserved &&
        southRailCallableSurfacePresent &&
        southRailChronologyStatus === "COMPLETE"
    );

    const noClaimsPayload = isObject(payload.noClaims) ? payload.noClaims : {};
    const noClaimIntegrity = [
      noClaimsPayload.f13Claimed,
      noClaimsPayload.f21EligibleForNorth,
      noClaimsPayload.f21ClaimedByDiagnosticRail,
      noClaimsPayload.readyTextAllowed,
      noClaimsPayload.readyTextClaimedByDiagnosticRail,
      noClaimsPayload.visualPassClaimed,
      noClaimsPayload.generatedImage,
      noClaimsPayload.graphicBox,
      noClaimsPayload.webGL
    ].every((value) => value === false || value === undefined);

    const meaningStatus = reportMeaningFieldsPresent && southRailMeaningPresent && noClaimIntegrity
      ? "PACKET_MEANING_PRESERVED"
      : reportMeaningFieldsPresent && southRailObserved && noClaimIntegrity
        ? "PACKET_MEANING_PARTIAL_SOUTH_RAIL_PRESENT"
        : "PACKET_MEANING_INCOMPLETE";

    const runStatus = meaningStatus === "PACKET_MEANING_PRESERVED"
      ? "COMPLETE"
      : "COMPLETE_WITH_DIAGNOSTIC_WARNINGS";

    const notes = normalizeNotes(
      "PROBE_SOUTH_EARLY_ALIAS_PUBLISH_ACTIVE",
      "PROBE_SOUTH_STABLE_API_OBJECT_ACTIVE",
      "PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_ACTIVE",
      "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "PROBE_SOUTH_DOES_NOT_OWN_SOUTH_RAIL_PACKET_OUTPUT",
      southRailObserved
        ? `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${southRailFound.path}`
        : "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL",
      southRailPrimaryMethodPresent
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_COMPOSE_SOUTH_REPORT_PRESENT"
        : "PROBE_SOUTH_DID_NOT_CONFIRM_PRIMARY_SOUTH_RAIL_METHOD",
      currentReportObserved
        ? "PROBE_SOUTH_CURRENT_NORTH_REPORT_OBSERVED"
        : "PROBE_SOUTH_CURRENT_NORTH_REPORT_NOT_OBSERVED",
      chronologyObserved
        ? "PROBE_SOUTH_CHRONOLOGY_ARRAY_OBSERVED"
        : "PROBE_SOUTH_CHRONOLOGY_ARRAY_NOT_OBSERVED",
      `PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED:${southRailChronologyStatus}`,
      meaningStatus === "PACKET_MEANING_PRESERVED"
        ? "PROBE_SOUTH_CONFIRMED_PACKET_MEANING_PRESERVED"
        : `PROBE_SOUTH_PACKET_MEANING_STATUS:${meaningStatus}`,
      getValue(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", "")
    );

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,
      PROBE_SOUTH_ROLE: "PACKET_MEANING_FILE_COMPOSITION_PROBE",
      PROBE_SOUTH_EARLY_ALIAS_PUBLISHED: true,
      PROBE_SOUTH_STABLE_API_OBJECT_ACTIVE: true,
      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(),

      PARENT_NORTH_CONTRACT: parentNorthContract,
      PARENT_NORTH_RECEIPT: parentNorthReceipt,
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        payload.previousNorthContract,
        currentReport.PREVIOUS_NORTH_CONTRACT,
        PREVIOUS_NORTH_CONTRACT
      ),
      PREVIOUS_NORTH_RECEIPT: firstKnown(
        currentReport.PREVIOUS_NORTH_RECEIPT,
        PREVIOUS_NORTH_RECEIPT
      ),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", payload.chronologyHubActive),
        "true"
      ),
      NORTH_IS_HUB_ONLY: boolText(getRaw(currentReport, "NORTH_IS_HUB_ONLY", true), "true"),
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", payload.eightWayProbeBridgeActive),
        "false"
      ),
      EIGHT_FILE_CHRONOLOGY_ACTIVE: boolText(getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true), "true"),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: boolText(getRaw(currentReport, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", false), "false"),
      RECEIVER_STILL_CALLS_NORTH_ONLY: boolText(getRaw(currentReport, "RECEIVER_STILL_CALLS_NORTH_ONLY", true), "true"),

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(payload.expectedHtmlContract, currentReport.EXPECTED_HTML_CONTRACT, EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(payload.expectedIndexJsContract, currentReport.EXPECTED_INDEX_JS_CONTRACT, EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(payload.expectedRouteConductorContract, currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT, EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: firstKnown(payload.expectedControlContract, currentReport.EXPECTED_CONTROL_CONTRACT, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(payload.expectedCanvasContract, currentReport.EXPECTED_CANVAS_CONTRACT, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_EAST_CONTRACT, EXPECTED_EAST_CONTRACT),
      EXPECTED_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_WEST_CONTRACT, EXPECTED_WEST_CONTRACT),
      EXPECTED_SOUTH_CONTRACT: firstKnown(currentReport.EXPECTED_SOUTH_CONTRACT, EXPECTED_SOUTH_CONTRACT),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_NORTH_CONTRACT, EXPECTED_PROBE_NORTH_CONTRACT),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_EAST_CONTRACT, EXPECTED_PROBE_EAST_CONTRACT),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_WEST_CONTRACT, EXPECTED_PROBE_WEST_CONTRACT),
      EXPECTED_PROBE_SOUTH_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: runStatus,
      PROBE_SOUTH_MEANING_STATUS: meaningStatus,
      PROBE_SOUTH_MEANING_PRESERVED: meaningStatus === "PACKET_MEANING_PRESERVED",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED_BY_PROBE: meaningStatus === "PACKET_MEANING_PRESERVED",
      PROBE_SOUTH_PACKET_MEANING_FIELDS_PRESENT: reportMeaningFieldsPresent,
      PROBE_SOUTH_NO_CLAIM_INTEGRITY_PRESERVED: noClaimIntegrity,

      PROBE_SOUTH_IS_DIAGNOSTIC_ONLY: true,
      PROBE_SOUTH_OWNS_PACKET_OUTPUT: false,
      PROBE_SOUTH_OWNS_SOUTH_RAIL: false,
      PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY: false,
      PROBE_SOUTH_OWNS_PRODUCTION_REPAIR: false,
      PROBE_SOUTH_OWNS_CANVAS_EXPRESSION: false,

      SOUTH_RAIL_OBSERVED_BY_PROBE: southRailObserved,
      SOUTH_RAIL_SOURCE_PATH_BY_PROBE: southRailFound.path,
      SOUTH_RAIL_CONTRACT_BY_PROBE: firstKnown(
        southRailReceipt.contract,
        southRailReceipt.CONTRACT,
        southRailReceipt.implementationContract,
        southRailFound.value && southRailFound.value.contract,
        southRailFound.value && southRailFound.value.CONTRACT
      ),
      SOUTH_RAIL_RECEIPT_BY_PROBE: firstKnown(
        southRailReceipt.receipt,
        southRailReceipt.RECEIPT,
        southRailReceipt.implementationReceipt,
        southRailFound.value && southRailFound.value.receipt,
        southRailFound.value && southRailFound.value.RECEIPT
      ),
      SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE: southRailCallableSurfacePresent,
      SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE: southRailMethods.join(",") || "NONE",
      SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE: southRailPrimaryMethodPresent,
      SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH: "composeSouthReport",

      CURRENT_REPORT_OBSERVED_BY_PROBE: currentReportObserved,
      CURRENT_REPORT_PACKET_NAME_BY_PROBE: firstKnown(currentReport.PACKET_NAME, REPORT_PACKET),
      CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE: parentNorthContract,
      CURRENT_REPORT_OUTPUT_KEYS_BY_PROBE: getOutputKeys(currentReport),

      CHRONOLOGY_OBSERVED_BY_PROBE: chronologyObserved,
      CHRONOLOGY_LENGTH_BY_PROBE: chronology.length,
      CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE: firstKnown(currentReport.CHRONOLOGY_SEQUENCE_TEXT, chronologyText(chronology)),
      RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED_BY_PROBE: Boolean(southRailEntry),
      RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE: southRailChronologyStatus,
      RAIL_SOUTH_CHRONOLOGY_CALL_STATUS_BY_PROBE: southRailChronologyCallStatus,
      RAIL_SOUTH_CHRONOLOGY_CALL_METHOD_BY_PROBE: southRailChronologyCallMethod,
      PROBE_SOUTH_CHRONOLOGY_STEP_PREEXISTED_BY_PROBE: Boolean(probeSouthEntry),

      EVIDENCE_BY_STEP_KEYS_BY_PROBE: Object.keys(evidenceByStep).join(",") || "NONE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      MACRO_WEST_RELEASE_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORITY: false,
      ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY: false,
      CONTROL_IMPLEMENTATION_AUTHORITY: false,
      TERRAIN_TRUTH_AUTHORITY: false,
      HYDROLOGY_TRUTH_AUTHORITY: false,
      MATERIAL_TRUTH_AUTHORITY: false,
      FINAL_VISUAL_PASS_AUTHORITY: false,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_EARLY_ALIAS_PUBLISHED",
      "PROBE_SOUTH_STABLE_API_OBJECT_ACTIVE",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "PARENT_NORTH_CONTRACT",
      "PARENT_NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_SOUTH_FILE",
      "EXPECTED_HTML_CONTRACT",
      "EXPECTED_INDEX_JS_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      "EXPECTED_CONTROL_CONTRACT",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_EAST_CONTRACT",
      "EXPECTED_WEST_CONTRACT",
      "EXPECTED_SOUTH_CONTRACT",
      "EXPECTED_PROBE_NORTH_CONTRACT",
      "EXPECTED_PROBE_EAST_CONTRACT",
      "EXPECTED_PROBE_WEST_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_MEANING_PRESERVED",
      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_SOURCE_PATH_BY_PROBE",
      "SOUTH_RAIL_CONTRACT_BY_PROBE",
      "SOUTH_RAIL_RECEIPT_BY_PROBE",
      "SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE",
      "SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE",
      "SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE",
      "SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH",
      "CURRENT_REPORT_OBSERVED_BY_PROBE",
      "CURRENT_REPORT_PACKET_NAME_BY_PROBE",
      "CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE",
      "CURRENT_REPORT_OUTPUT_KEYS_BY_PROBE",
      "CHRONOLOGY_OBSERVED_BY_PROBE",
      "CHRONOLOGY_LENGTH_BY_PROBE",
      "CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_CALL_STATUS_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_CALL_METHOD_BY_PROBE",
      "PROBE_SOUTH_CHRONOLOGY_STEP_PREEXISTED_BY_PROBE",
      "EVIDENCE_BY_STEP_KEYS_BY_PROBE",
      "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
      "PROBE_SOUTH_OWNS_PACKET_OUTPUT",
      "PROBE_SOUTH_OWNS_SOUTH_RAIL",
      "PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY",
      "PROBE_SOUTH_OWNS_PRODUCTION_REPAIR",
      "PROBE_SOUTH_OWNS_CANVAS_EXPRESSION",
      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES",
      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", CONTRACT)),
      line("PROBE_SOUTH_STATUS", getValue(report, "PROBE_SOUTH_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_RUN_STATUS", getValue(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_MEANING_STATUS", getValue(report, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN")),
      line("SOUTH_RAIL_OBSERVED_BY_PROBE", getValue(report, "SOUTH_RAIL_OBSERVED_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_SOURCE_PATH_BY_PROBE", getValue(report, "SOUTH_RAIL_SOURCE_PATH_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE", getValue(report, "SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE", "UNKNOWN")),
      line("RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE", getValue(report, "RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE", "UNKNOWN")),
      line("PROBE_SOUTH_EARLY_ALIAS_PUBLISHED", getValue(report, "PROBE_SOUTH_EARLY_ALIAS_PUBLISHED", "UNKNOWN"))
    ].join("\n");
  }

  function publishReport(report) {
    lastReport = clonePlain(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);
    lastState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      report: clonePlain(report),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAliases();
  }

  function runProbeSouth(payload = {}) {
    const report = makeReport(payload);
    publishReport(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      evidence: clonePlain(report),
      report: clonePlain(report),
      REPORT_OBJECT: clonePlain(report),
      output: {
        PROBE_SOUTH_STATUS: "COMPLETE",
        PROBE_SOUTH_CONTRACT: CONTRACT,
        PROBE_SOUTH_RECEIPT: RECEIPT,
        PROBE_SOUTH_RUN_STATUS: report.PROBE_SOUTH_RUN_STATUS,
        PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
        REPORT_OBJECT: clonePlain(report)
      },
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      state: clonePlain(lastState),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function inspectPacketMeaning(payload = {}) {
    return runProbeSouth(payload);
  }

  function inspectPacketComposition(payload = {}) {
    return runProbeSouth(payload);
  }

  function runProbe(payload = {}) {
    return runProbeSouth(payload);
  }

  function inspect(payload = {}) {
    return runProbeSouth(payload);
  }

  function runDiagnostic(payload = {}) {
    return runProbeSouth(payload);
  }

  function getReport() {
    if (!lastReport) {
      publishReport(makeReport({}));
    }
    return clonePlain(lastReport);
  }

  function getState() {
    if (!lastState) {
      publishReport(makeReport({}));
    }
    return clonePlain(lastState);
  }

  function getPacketText() {
    if (!lastPacketText) getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) getReport();
    return lastCompactSummary;
  }

  function getReceiptLight() {
    return {
      probeRole: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      expectedParentNorthContract: NORTH_V10_CONTRACT,
      expectedParentNorthReceipt: NORTH_V10_RECEIPT,
      expectedSouthRailFile: RAIL_SOUTH_FILE,
      expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthRailMethod: "composeSouthReport",

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getStateApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getProbeReceiptApiAvailable: true,

      publishesNorthExpectedAliases: true,
      earlyAliasPublished: true,
      stableApiObject: true,
      supportsChronologyHubStandard: true,
      supportsSouthRailAliasInspection: true,
      supportsPacketMeaningInspection: true,
      supportsNoClaimIntegrityInspection: true,

      diagnosticProbeOnly: true,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      canvasDrawingAuthority: false,
      routeConductorImplementationAuthority: false,
      controlImplementationAuthority: false,
      terrainTruthAuthority: false,
      hydrologyTruthAuthority: false,
      materialTruthAuthority: false,
      southRailPacketOutputAuthority: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      probeSouthContract: CONTRACT,
      probeSouthReceipt: RECEIPT,
      probeSouthFile: FILE,
      parentNorthContract: NORTH_V10_CONTRACT,
      parentNorthReceipt: NORTH_V10_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,
      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,
      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedEastContract: EXPECTED_EAST_CONTRACT,
      expectedWestContract: EXPECTED_WEST_CONTRACT,
      expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
      expectedProbeNorthContract: EXPECTED_PROBE_NORTH_CONTRACT,
      expectedProbeEastContract: EXPECTED_PROBE_EAST_CONTRACT,
      expectedProbeWestContract: EXPECTED_PROBE_WEST_CONTRACT,
      expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,
      probeAliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      probeAliasChronologyText: aliasChronologyText(),
      probeSouthReportObject: lastReport ? clonePlain(lastReport) : {},
      state: lastState ? clonePlain(lastState) : null,
      ...UPPER_NO_CLAIMS
    };
  }

  function getProbeReceipt() {
    return getReceipt();
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = lastReport ? clonePlain(lastReport) : {};
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = lastReport ? clonePlain(lastReport) : {};
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = lastReport ? clonePlain(lastReport) : {};

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_PACKET_TEXT = lastPacketText || "";
  }

  publishReport(makeReport({}));

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
