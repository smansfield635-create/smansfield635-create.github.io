// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic PROBE SOUTH only.
// Purpose:
// - Provide the callable PROBE_SOUTH surface expected by NORTH v10 chronology hub.
// - Publish every alias NORTH v10 scans for PROBE_SOUTH.
// - Confirm South rail observability without owning South rail packet output.
// - Inspect packet meaning, chronology handoff, South output preservation, and no-claim integrity.
// - Return standard probe evidence to NORTH v10.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic South rail packet composition
// - diagnostic East source evidence
// - diagnostic West rendered evidence
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";
  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-south-chronology-standard-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const NORTH_EXPECTED_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_EXPECTED_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";
  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";

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
      intent: "probe-south-primary",
      northV10LookupPriority: 1
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-rail-explicit",
      northV10LookupPriority: 2
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      intent: "south-probe-readable",
      northV10LookupPriority: 3
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "global-probe-south",
      northV10LookupPriority: 4
    }),
    Object.freeze({
      order: 5,
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "global-rail-probe-south",
      northV10LookupPriority: 5
    }),
    Object.freeze({
      order: 6,
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-probe-south",
      northV10LookupPriority: 6
    }),
    Object.freeze({
      order: 7,
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-rail-probe-south",
      northV10LookupPriority: 7
    }),
    Object.freeze({
      order: 8,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_PROBE",
      layer: "GLOBAL",
      intent: "compat-south-probe",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 9,
      alias: "DEXTER_LAB.hearthDiagnosticSouthProbe",
      layer: "DEXTER_LAB",
      intent: "compat-lab-south-probe",
      northV10LookupPriority: "compat"
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
    "composePacket",
    "inspect",
    "runDiagnostic"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastReport = null;
  let lastState = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

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

  function getValue(source, key, fallback = "UNKNOWN") {
    const value = getRaw(source, key, undefined);
    return packetValue(value, fallback);
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

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value
        .map((entry) => {
          if (isObject(entry)) {
            try {
              return JSON.stringify(entry);
            } catch (_error) {
              return bounded(entry, 1200);
            }
          }

          return bounded(entry, 1200);
        })
        .filter(Boolean)
        .join(" | ");

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

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.version
    ) {
      return authority;
    }

    return null;
  }

  function aliasChronologyText() {
    return PROBE_ALIAS_CHRONOLOGY.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`
      ].join(" ");
    }).join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
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

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function outputKeys(value, limit = 120) {
    if (!isObject(value)) return "NONE";
    return Object.keys(value).slice(0, limit).join(",") || "NONE";
  }

  function extractCurrentReport(payload) {
    if (isObject(payload && payload.currentReport)) return clonePlain(payload.currentReport);
    if (isObject(payload && payload.report)) return clonePlain(payload.report);
    if (isObject(payload && payload.REPORT_OBJECT)) return clonePlain(payload.REPORT_OBJECT);
    return {};
  }

  function inspectSouthRail() {
    const found = findFirstPath(SOUTH_RAIL_PATHS);
    const authority = found.value;
    const receipt = getReceiptFromAuthority(authority) || {};
    const callableMethods = SOUTH_RAIL_METHODS.filter((method) => {
      return isFunction(authority && authority[method]);
    });

    return {
      observed: Boolean(authority),
      sourcePath: found.path,
      contract: firstKnown(
        receipt.contract,
        receipt.CONTRACT,
        receipt.implementationContract,
        authority && authority.contract,
        authority && authority.CONTRACT
      ),
      receipt: firstKnown(
        receipt.receipt,
        receipt.RECEIPT,
        receipt.implementationReceipt,
        authority && authority.receipt,
        authority && authority.RECEIPT
      ),
      callableSurfacePresent: callableMethods.length > 0,
      primaryMethodPresent: callableMethods.includes("composeSouthReport"),
      callableMethods: callableMethods.join(",") || "NONE",
      requiredMethodByNorth: "composeSouthReport"
    };
  }

  function computeNoClaimIntegrity(payload, currentReport) {
    const noClaims = isObject(payload && payload.noClaims) ? payload.noClaims : {};

    const values = [
      noClaims.f13Claimed,
      noClaims.f21EligibleForNorth,
      noClaims.f21ClaimedByDiagnosticRail,
      noClaims.readyTextAllowed,
      noClaims.readyTextClaimedByDiagnosticRail,
      noClaims.visualPassClaimed,
      noClaims.generatedImage,
      noClaims.graphicBox,
      noClaims.webGL,
      getRaw(currentReport, "f13Claimed", false),
      getRaw(currentReport, "f21EligibleForNorth", false),
      getRaw(currentReport, "f21ClaimedByDiagnosticRail", false),
      getRaw(currentReport, "readyTextAllowed", false),
      getRaw(currentReport, "readyTextClaimedByDiagnosticRail", false),
      getRaw(currentReport, "visualPassClaimed", false),
      getRaw(currentReport, "generatedImage", false),
      getRaw(currentReport, "graphicBox", false),
      getRaw(currentReport, "webGL", false)
    ];

    return values.every((value) => value === false || value === undefined || value === null || value === "false");
  }

  function buildProbeReport(payload = {}) {
    const currentReport = extractCurrentReport(payload);

    const chronology = Array.isArray(payload.chronology)
      ? clonePlain(payload.chronology)
      : Array.isArray(currentReport.CHRONOLOGY_SEQUENCE)
        ? clonePlain(currentReport.CHRONOLOGY_SEQUENCE)
        : [];

    const evidenceByStep = isObject(payload.evidenceByStep)
      ? clonePlain(payload.evidenceByStep)
      : {};

    const southRail = inspectSouthRail();
    const southRailEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const probeSouthEntry = findChronologyEntry(chronology, "PROBE_SOUTH");

    const parentNorthContract = firstKnown(
      payload.northContract,
      currentReport.NORTH_CONTRACT,
      NORTH_EXPECTED_CONTRACT
    );

    const parentNorthReceipt = firstKnown(
      payload.northReceipt,
      currentReport.NORTH_RECEIPT,
      NORTH_EXPECTED_RECEIPT
    );

    const currentPacketName = firstKnown(currentReport.PACKET_NAME, PACKET_NAME);
    const currentTargetRoute = firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE);
    const currentDiagnosticRoute = firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE);

    const packetIdentityPreserved =
      currentPacketName === PACKET_NAME &&
      currentTargetRoute === TARGET_ROUTE &&
      currentDiagnosticRoute === DIAGNOSTIC_ROUTE &&
      parentNorthContract !== "UNKNOWN";

    const railSouthChronologyObserved = Boolean(southRailEntry);
    const railSouthChronologyComplete = Boolean(
      southRailEntry && southRailEntry.status === "COMPLETE"
    );

    const southOutputStatus = firstKnown(
      currentReport.SOUTH_OUTPUT_STATUS,
      getValue(evidenceByStep.RAIL_SOUTH, "SOUTH_OUTPUT_STATUS", ""),
      railSouthChronologyComplete ? "COMPLETE" : "UNKNOWN"
    );

    const southMeaningPreserved = firstKnown(
      currentReport.SOUTH_MEANING_PRESERVED,
      getValue(evidenceByStep.RAIL_SOUTH, "SOUTH_MEANING_PRESERVED", ""),
      railSouthChronologyComplete ? "true" : "UNKNOWN"
    );

    const noClaimIntegrity = computeNoClaimIntegrity(payload, currentReport);

    const packetMeaningPreserved =
      packetIdentityPreserved &&
      noClaimIntegrity &&
      (
        railSouthChronologyComplete ||
        southOutputStatus === "COMPLETE" ||
        southMeaningPreserved === "true"
      );

    const probeRunStatus = packetMeaningPreserved
      ? "COMPLETE"
      : "COMPLETE_WITH_DIAGNOSTIC_WARNINGS";

    const probeMeaningStatus = packetMeaningPreserved
      ? "PACKET_MEANING_PRESERVED"
      : packetIdentityPreserved && noClaimIntegrity
        ? "PACKET_MEANING_PARTIAL_SOUTH_OUTPUT_CONTEXT_INCOMPLETE"
        : "PACKET_MEANING_INCOMPLETE";

    const recommendedNextOwner = packetMeaningPreserved
      ? firstKnown(currentReport.RECOMMENDED_NEXT_OWNER, "CANVAS_EXPRESSION_SURFACE")
      : "DIAGNOSTIC_PROBE_SOUTH";

    const recommendedNextFile = packetMeaningPreserved
      ? firstKnown(currentReport.RECOMMENDED_NEXT_FILE, "/assets/hearth/hearth.canvas.js")
      : FILE;

    const recommendedNextAction = packetMeaningPreserved
      ? firstKnown(
          currentReport.RECOMMENDED_NEXT_ACTION,
          "RERUN_NORTH_V10_CHRONOLOGY_AND_REVIEW_NEXT_NON_DIAGNOSTIC_HOLD"
        )
      : "VERIFY_PROBE_SOUTH_DEPLOYMENT_AND_RERUN_NORTH_V10_CHRONOLOGY";

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_CHRONOLOGY_STANDARD_ACTIVE",
      "PROBE_SOUTH_ALIASES_PUBLISHED_FOR_NORTH_V10",
      "PROBE_SOUTH_CALLABLE_SURFACE_AVAILABLE",
      "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      southRail.observed
        ? `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${southRail.sourcePath}`
        : "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL",
      southRail.primaryMethodPresent
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_COMPOSE_SOUTH_REPORT_PRESENT"
        : "PROBE_SOUTH_PRIMARY_SOUTH_RAIL_METHOD_NOT_CONFIRMED",
      packetIdentityPreserved
        ? "PROBE_SOUTH_CONFIRMED_PACKET_IDENTITY_PRESERVED"
        : "PROBE_SOUTH_PACKET_IDENTITY_INCOMPLETE",
      railSouthChronologyObserved
        ? `PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP:${southRailEntry.status}`
        : "PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP_NOT_PRESENT",
      probeSouthEntry
        ? `PROBE_SOUTH_PARENT_CHRONOLOGY_ENTRY_PRESENT:${probeSouthEntry.status}`
        : "PROBE_SOUTH_PARENT_CHRONOLOGY_ENTRY_NOT_YET_PRESENT_DURING_OWN_CALL",
      noClaimIntegrity
        ? "PROBE_SOUTH_CONFIRMED_NO_CLAIM_INTEGRITY"
        : "PROBE_SOUTH_NO_CLAIM_INTEGRITY_WARNING",
      packetMeaningPreserved
        ? "PROBE_SOUTH_CONFIRMED_PACKET_MEANING_PRESERVED"
        : `PROBE_SOUTH_PACKET_MEANING_STATUS:${probeMeaningStatus}`
    );

    const report = {
      PACKET_NAME,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,

      PARENT_NORTH_CONTRACT: parentNorthContract,
      PARENT_NORTH_RECEIPT: parentNorthReceipt,
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        payload.previousNorthContract,
        currentReport.PREVIOUS_NORTH_CONTRACT,
        PREVIOUS_NORTH_CONTRACT
      ),

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: false,
      EIGHT_FILE_CHRONOLOGY_ACTIVE: true,
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

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
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeRunStatus,
      PROBE_SOUTH_MEANING_STATUS: probeMeaningStatus,
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: packetMeaningPreserved,
      PROBE_SOUTH_PACKET_IDENTITY_PRESERVED: packetIdentityPreserved,
      PROBE_SOUTH_NO_CLAIM_INTEGRITY_PRESERVED: noClaimIntegrity,

      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(),
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_RAIL_ALIAS: "HEARTH.diagnosticRailProbeSouth",
      PROBE_SOUTH_READABLE_ALIAS: "HEARTH.diagnosticSouthProbe",
      PROBE_SOUTH_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      PROBE_SOUTH_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      PROBE_SOUTH_LAB_RAIL_ALIAS: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",

      PROBE_SOUTH_CALLABLE_METHODS:
        "runProbeSouth | inspectPacketMeaning | inspectPacketComposition | runProbe | inspect | runDiagnostic",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_NORTH_V10_COMPATIBLE: true,

      SOUTH_RAIL_OBSERVED_BY_PROBE: southRail.observed,
      SOUTH_RAIL_SOURCE_PATH_BY_PROBE: southRail.sourcePath,
      SOUTH_RAIL_CONTRACT_BY_PROBE: southRail.contract,
      SOUTH_RAIL_RECEIPT_BY_PROBE: southRail.receipt,
      SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE: southRail.callableSurfacePresent,
      SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE: southRail.callableMethods,
      SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE: southRail.primaryMethodPresent,
      SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH: southRail.requiredMethodByNorth,

      CURRENT_REPORT_OBSERVED_BY_PROBE: Object.keys(currentReport).length > 0,
      CURRENT_REPORT_PACKET_NAME_BY_PROBE: currentPacketName,
      CURRENT_REPORT_TARGET_ROUTE_BY_PROBE: currentTargetRoute,
      CURRENT_REPORT_DIAGNOSTIC_ROUTE_BY_PROBE: currentDiagnosticRoute,
      CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE: parentNorthContract,
      CURRENT_REPORT_OUTPUT_KEYS_BY_PROBE: outputKeys(currentReport),

      CHRONOLOGY_OBSERVED_BY_PROBE: chronology.length > 0,
      CHRONOLOGY_LENGTH_BY_PROBE: chronology.length,
      CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE: chronologyText(chronology),
      RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED_BY_PROBE: railSouthChronologyObserved,
      RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE: southRailEntry ? firstKnown(southRailEntry.status, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",
      RAIL_SOUTH_CHRONOLOGY_CALL_STATUS_BY_PROBE: southRailEntry ? firstKnown(southRailEntry.callStatus, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",
      RAIL_SOUTH_CHRONOLOGY_CALL_METHOD_BY_PROBE: southRailEntry ? firstKnown(southRailEntry.callMethod, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",

      SOUTH_OUTPUT_STATUS_BY_PROBE: southOutputStatus,
      SOUTH_MEANING_PRESERVED_BY_PROBE: southMeaningPreserved,

      EVIDENCE_BY_STEP_KEYS_BY_PROBE: Object.keys(evidenceByStep).join(",") || "NONE",

      PROBE_SOUTH_OWNS_PACKET_OUTPUT: false,
      PROBE_SOUTH_OWNS_SOUTH_RAIL: false,
      PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY: false,
      PROBE_SOUTH_OWNS_EAST_EVIDENCE: false,
      PROBE_SOUTH_OWNS_WEST_EVIDENCE: false,
      PROBE_SOUTH_OWNS_CANVAS_EXPRESSION: false,

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

      PRIMARY_CASE: firstKnown(currentReport.PRIMARY_CASE, "INCONCLUSIVE_EVIDENCE"),
      CALIBRATION_STATUS: firstKnown(
        currentReport.CALIBRATION_STATUS,
        packetMeaningPreserved ? "CALIBRATION_PROBE_SOUTH_COMPLETE" : "CALIBRATION_PROBE_SOUTH_WARNING"
      ),
      CALIBRATION_HOLD_REASON: firstKnown(
        currentReport.CALIBRATION_HOLD_REASON,
        packetMeaningPreserved ? "NONE_FROM_PROBE_SOUTH" : probeMeaningStatus
      ),
      RECOMMENDED_NEXT_OWNER: recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: recommendedNextAction,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    return report;
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
      "PARENT_NORTH_CONTRACT",
      "PARENT_NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_PACKET_IDENTITY_PRESERVED",
      "PROBE_SOUTH_NO_CLAIM_INTEGRITY_PRESERVED",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "PROBE_SOUTH_PRIMARY_ALIAS",
      "PROBE_SOUTH_RAIL_ALIAS",
      "PROBE_SOUTH_READABLE_ALIAS",
      "PROBE_SOUTH_GLOBAL_ALIAS",
      "PROBE_SOUTH_GLOBAL_RAIL_ALIAS",
      "PROBE_SOUTH_LAB_ALIAS",
      "PROBE_SOUTH_LAB_RAIL_ALIAS",
      "PROBE_SOUTH_CALLABLE_METHODS",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD",
      "PROBE_SOUTH_NORTH_V10_COMPATIBLE",
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
      "CURRENT_REPORT_TARGET_ROUTE_BY_PROBE",
      "CURRENT_REPORT_DIAGNOSTIC_ROUTE_BY_PROBE",
      "CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE",
      "CURRENT_REPORT_OUTPUT_KEYS_BY_PROBE",
      "CHRONOLOGY_OBSERVED_BY_PROBE",
      "CHRONOLOGY_LENGTH_BY_PROBE",
      "CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_CALL_STATUS_BY_PROBE",
      "RAIL_SOUTH_CHRONOLOGY_CALL_METHOD_BY_PROBE",
      "SOUTH_OUTPUT_STATUS_BY_PROBE",
      "SOUTH_MEANING_PRESERVED_BY_PROBE",
      "EVIDENCE_BY_STEP_KEYS_BY_PROBE",
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
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
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
      line("PROBE_SOUTH_RUN_STATUS", getValue(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_MEANING_STATUS", getValue(report, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_PACKET_MEANING_PRESERVED", getValue(report, "PROBE_SOUTH_PACKET_MEANING_PRESERVED", "UNKNOWN")),
      line("SOUTH_RAIL_OBSERVED_BY_PROBE", getValue(report, "SOUTH_RAIL_OBSERVED_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE", getValue(report, "SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE", "UNKNOWN")),
      line("RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE", getValue(report, "RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE", "UNKNOWN")),
      line("SOUTH_OUTPUT_STATUS_BY_PROBE", getValue(report, "SOUTH_OUTPUT_STATUS_BY_PROBE", "UNKNOWN")),
      line("SOUTH_MEANING_PRESERVED_BY_PROBE", getValue(report, "SOUTH_MEANING_PRESERVED_BY_PROBE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function publishReport(report) {
    lastReport = clonePlain(report);
    lastPacketText = composePacketText(lastReport);
    lastCompactSummary = composeCompactSummary(lastReport);

    lastState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      probeSouthStatus: getValue(lastReport, "PROBE_SOUTH_STATUS", "COMPLETE"),
      probeSouthRunStatus: getValue(lastReport, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN"),
      probeSouthMeaningStatus: getValue(lastReport, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN"),
      reportObject: clonePlain(lastReport),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAliases();
  }

  function runProbeSouth(payload = {}) {
    const report = buildProbeReport(payload);
    publishReport(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      evidence: clonePlain(report),
      report: clonePlain(report),
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
      const report = buildProbeReport({});
      publishReport(report);
    }

    return clonePlain(lastReport);
  }

  function getState() {
    if (!lastState) {
      getReport();
    }

    return clonePlain(lastState);
  }

  function getPacketText() {
    if (!lastPacketText) {
      getReport();
    }

    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) {
      getReport();
    }

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
      packetName: PACKET_NAME,

      expectedParentNorthContract: NORTH_EXPECTED_CONTRACT,
      expectedParentNorthReceipt: NORTH_EXPECTED_RECEIPT,
      expectedSouthRailFile: RAIL_SOUTH_FILE,
      expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthRailMethod: "composeSouthReport",

      probeAliasChronologyStatus: "COMPLETE",
      probeAliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      probeAliasChronologyText: aliasChronologyText(),

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

      publishesHearthDiagnosticProbeSouth: true,
      publishesHearthDiagnosticRailProbeSouth: true,
      publishesHearthDiagnosticSouthProbe: true,
      publishesGlobalDiagnosticProbeSouth: true,
      publishesGlobalDiagnosticRailProbeSouth: true,
      publishesDexterLabDiagnosticProbeSouth: true,
      publishesDexterLabDiagnosticRailProbeSouth: true,

      supportsNorthV10ChronologyStandard: true,
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

      reportObject: clonePlain(lastReport || {}),
      state: clonePlain(lastState || {}),

      ...UPPER_NO_CLAIMS
    };
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

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_PACKET_TEXT = lastPacketText || "";
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    probeSouthFile: PROBE_SOUTH_FILE,
    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,

    expectedParentNorthContract: NORTH_EXPECTED_CONTRACT,
    expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
    expectedSouthRailMethod: "composeSouthReport",

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

    probeAliasChronology: PROBE_ALIAS_CHRONOLOGY,
    probeAliasChronologyText: aliasChronologyText(),

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

    ...NO_CLAIMS
  });

  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
