// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic PROBE SOUTH only.
// Purpose:
// - Provide the callable South probe surface expected by NORTH v10 chronology hub.
// - Publish stable South-probe aliases in the same namespace family NORTH v10 scans.
// - Inspect South rail observability, callable surface, packet meaning, and chronology handoff.
// - Verify that South remains packet-output authority and this file remains probe-only.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - Queen/control implementation
// - finger implementation
// - terrain/material/hydrology truth
// - South rail packet composition
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";
  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-south-packet-meaning-file-composition-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

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

  let lastState = null;
  let lastReport = null;

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
      const joined = value.map((entry) => bounded(entry, 1200)).filter(Boolean).join(" | ");
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

  function getOutputKeys(value) {
    if (!isObject(value)) return "NONE";
    return Object.keys(value).slice(0, 80).join(",") || "NONE";
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function makeState(payload = {}) {
    const chronology = Array.isArray(payload.chronology) ? payload.chronology : [];
    const currentReport = isObject(payload.currentReport) ? payload.currentReport : {};
    const southRailFound = findFirstPath(SOUTH_RAIL_PATHS);
    const southRailReceipt = getReceiptFromAuthority(southRailFound.value) || {};
    const southRailMethods = SOUTH_RAIL_METHODS.filter((method) => isFunction(southRailFound.value && southRailFound.value[method]));
    const southRailChronologyEntry = findChronologyEntry(chronology, "RAIL_SOUTH");

    const parentNorthContract = firstKnown(
      payload.northContract,
      getValue(currentReport, "NORTH_CONTRACT", ""),
      "UNKNOWN"
    );

    const parentNorthReceipt = firstKnown(
      payload.northReceipt,
      getValue(currentReport, "NORTH_RECEIPT", ""),
      "UNKNOWN"
    );

    const reportPacketName = firstKnown(
      getValue(currentReport, "PACKET_NAME", ""),
      REPORT_PACKET
    );

    const currentReportObserved = Object.keys(currentReport).length > 0;
    const chronologyObserved = chronology.length > 0;
    const southRailObserved = Boolean(southRailFound.value);
    const composeSouthReportPresent = southRailMethods.includes("composeSouthReport");
    const callableSurfacePresent = southRailMethods.length > 0;

    const railSouthChronologyStatus = southRailChronologyEntry
      ? firstKnown(southRailChronologyEntry.status, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const railSouthChronologyCallStatus = southRailChronologyEntry
      ? firstKnown(southRailChronologyEntry.callStatus, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const railSouthChronologyCallMethod = southRailChronologyEntry
      ? firstKnown(southRailChronologyEntry.callMethod, "UNKNOWN")
      : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const reportMeaningFieldsPresent = Boolean(
      currentReportObserved &&
        reportPacketName === REPORT_PACKET &&
        parentNorthContract !== "UNKNOWN" &&
        getValue(currentReport, "TARGET_ROUTE", TARGET_ROUTE) === TARGET_ROUTE &&
        getValue(currentReport, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE) === DIAGNOSTIC_ROUTE
    );

    const chronologyMeaningFieldsPresent = Boolean(
      chronologyObserved &&
        southRailChronologyEntry &&
        railSouthChronologyStatus === "COMPLETE"
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

    const packetMeaningStatus = reportMeaningFieldsPresent && chronologyMeaningFieldsPresent && noClaimIntegrity
      ? "PACKET_MEANING_PRESERVED"
      : reportMeaningFieldsPresent && noClaimIntegrity
        ? "PACKET_MEANING_PARTIAL_CHRONOLOGY_STILL_OPEN"
        : "PACKET_MEANING_INCOMPLETE";

    const runStatus = packetMeaningStatus === "PACKET_MEANING_PRESERVED"
      ? "COMPLETE"
      : "COMPLETE_WITH_DIAGNOSTIC_WARNINGS";

    const notes = normalizeNotes(
      "PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_ACTIVE",
      "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      southRailObserved
        ? `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${southRailFound.path}`
        : "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL",
      composeSouthReportPresent
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_COMPOSE_SOUTH_REPORT_PRESENT"
        : "PROBE_SOUTH_DID_NOT_CONFIRM_PRIMARY_SOUTH_RAIL_METHOD",
      currentReportObserved
        ? "PROBE_SOUTH_CURRENT_NORTH_REPORT_OBSERVED"
        : "PROBE_SOUTH_CURRENT_NORTH_REPORT_NOT_OBSERVED",
      chronologyObserved
        ? "PROBE_SOUTH_CHRONOLOGY_ARRAY_OBSERVED"
        : "PROBE_SOUTH_CHRONOLOGY_ARRAY_NOT_OBSERVED",
      `PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED:${railSouthChronologyStatus}`,
      packetMeaningStatus === "PACKET_MEANING_PRESERVED"
        ? "PROBE_SOUTH_CONFIRMED_PACKET_MEANING_PRESERVED"
        : `PROBE_SOUTH_PACKET_MEANING_STATUS:${packetMeaningStatus}`,
      getValue(currentReport, "SECONDARY_EVIDENCE_NOTES", "")
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

      PARENT_NORTH_CONTRACT: parentNorthContract,
      PARENT_NORTH_RECEIPT: parentNorthReceipt,
      PREVIOUS_NORTH_CONTRACT: firstKnown(payload.previousNorthContract, getValue(currentReport, "PREVIOUS_NORTH_CONTRACT", "")),

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

      EXPECTED_HTML_CONTRACT: firstKnown(payload.expectedHtmlContract, EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(payload.expectedIndexJsContract, EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(payload.expectedRouteConductorContract, EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: firstKnown(payload.expectedControlContract, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(payload.expectedCanvasContract, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_SOUTH_RAIL_CONTRACT: EXPECTED_SOUTH_CONTRACT,
      SOUTH_RAIL_EXTERNAL_CONTRACT: firstKnown(
        getValue(currentReport, "EXPECTED_SOUTH_CONTRACT", ""),
        EXPECTED_SOUTH_CONTRACT
      ),
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: runStatus,
      PROBE_SOUTH_IS_DIAGNOSTIC_ONLY: true,
      PROBE_SOUTH_OWNS_PACKET_OUTPUT: false,
      PROBE_SOUTH_OWNS_SOUTH_RAIL: false,
      PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY: false,

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
      SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE: callableSurfacePresent,
      SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE: southRailMethods.join(",") || "NONE",
      SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE: composeSouthReportPresent,
      SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH: "composeSouthReport",

      CURRENT_REPORT_OBSERVED_BY_PROBE: currentReportObserved,
      CURRENT_REPORT_PACKET_NAME_BY_PROBE: reportPacketName,
      CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE: parentNorthContract,
      CURRENT_REPORT_OUTPUT_KEYS_BY_PROBE: getOutputKeys(currentReport),

      CHRONOLOGY_OBSERVED_BY_PROBE: chronologyObserved,
      CHRONOLOGY_LENGTH_BY_PROBE: chronology.length,
      RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED_BY_PROBE: Boolean(southRailChronologyEntry),
      RAIL_SOUTH_CHRONOLOGY_STATUS_BY_PROBE: railSouthChronologyStatus,
      RAIL_SOUTH_CHRONOLOGY_CALL_STATUS_BY_PROBE: railSouthChronologyCallStatus,
      RAIL_SOUTH_CHRONOLOGY_CALL_METHOD_BY_PROBE: railSouthChronologyCallMethod,

      PACKET_MEANING_STATUS_BY_PROBE: packetMeaningStatus,
      PACKET_MEANING_PRESERVED_BY_PROBE: packetMeaningStatus === "PACKET_MEANING_PRESERVED",
      PACKET_MEANING_FIELDS_PRESENT_BY_PROBE: reportMeaningFieldsPresent,
      CHRONOLOGY_MEANING_FIELDS_PRESENT_BY_PROBE: chronologyMeaningFieldsPresent,
      NO_CLAIM_INTEGRITY_PRESERVED_BY_PROBE: noClaimIntegrity,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      MACRO_WEST_RELEASE_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORITY: false,
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

  function composePacketText(report) {
    return Object.keys(report || {})
      .map((key) => line(key, report[key]))
      .join("\n");
  }

  function runProbeSouth(payload = {}) {
    const report = makeState(payload);
    lastReport = clonePlain(report);
    lastState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      report: clonePlain(report),
      packetText: composePacketText(report),
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publish();

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      evidence: clonePlain(report),
      report: clonePlain(report),
      packetText: composePacketText(report),
      state: clonePlain(lastState),
      ...NO_CLAIMS
    };
  }

  function inspect(payload = {}) {
    return runProbeSouth(payload);
  }

  function runProbe(payload = {}) {
    return runProbeSouth(payload);
  }

  function inspectPacketMeaning(payload = {}) {
    return runProbeSouth(payload);
  }

  function inspectPacketComposition(payload = {}) {
    return runProbeSouth(payload);
  }

  function getReport() {
    if (!lastReport) lastReport = makeState({});
    return clonePlain(lastReport);
  }

  function getState() {
    if (!lastState) {
      const report = getReport();
      lastState = {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        report: clonePlain(report),
        packetText: composePacketText(report),
        updatedAt: nowIso(),
        ...NO_CLAIMS
      };
    }

    return clonePlain(lastState);
  }

  function getPacketText() {
    return composePacketText(getReport());
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

      expectedParentNorthContract:
        "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10",
      expectedSouthRailFile: RAIL_SOUTH_FILE,
      expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthRailMethod: "composeSouthReport",

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      getReportApiAvailable: true,
      getStateApiAvailable: true,
      getPacketTextApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      publishesNorthExpectedAliases: true,
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
      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeSouthReportObject: getReport(),
      ...NO_CLAIMS
    };
  }

  function publish() {
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

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = getReport();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = getReport();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = getReport();
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
    reportPacket: REPORT_PACKET,

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
    expectedSouthRailMethod: "composeSouthReport",

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect,
    getReport,
    getState,
    getPacketText,
    getReceipt,
    getReceiptLight,

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

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
