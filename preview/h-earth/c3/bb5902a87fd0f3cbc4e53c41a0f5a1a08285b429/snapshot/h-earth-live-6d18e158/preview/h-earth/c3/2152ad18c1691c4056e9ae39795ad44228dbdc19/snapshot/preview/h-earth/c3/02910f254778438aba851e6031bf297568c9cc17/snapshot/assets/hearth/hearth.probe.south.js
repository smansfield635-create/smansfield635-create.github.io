// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic PROBE SOUTH only.
// Purpose:
// - Restore PROBE SOUTH observability under NORTH v10 chronology hub.
// - Publish the exact PROBE SOUTH aliases NORTH v10 scans, immediately at parse time.
// - Provide runProbeSouth(...) as the primary callable surface NORTH expects.
// - Treat Gate 8 as a checkmark/router after the South rail funnel, not as South rail authority.
// - Confirm that parent chronology passed through the first seven gates when that chronology is supplied.
// - Preserve contact with South rail without judging or replacing South rail packet-output authority.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic East source evidence
// - diagnostic West rendered evidence
// - South rail packet composition
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - Queen/control implementation
// - finger implementation
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
    "2026-06-05.hearth-diagnostic-probe-south-gate-8-checkmark-router-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_RECEIPT =
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
      intent: "probe-south-operational-primary",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 1
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-rail-explicit",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 2
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      intent: "south-probe-inverted",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 3
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-probe-south",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 4
    }),
    Object.freeze({
      order: 5,
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-probe-south",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 5
    }),
    Object.freeze({
      order: 6,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_PROBE",
      layer: "GLOBAL",
      intent: "legacy-global-south-probe-inverted",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 7,
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-probe-south",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 6
    }),
    Object.freeze({
      order: 8,
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-probe-south",
      authority: "gate-8-checkmark-router",
      northV10LookupPriority: 7
    }),
    Object.freeze({
      order: 9,
      alias: "DEXTER_LAB.hearthDiagnosticSouthProbe",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south-probe-inverted",
      authority: "gate-8-checkmark-router",
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
    "inspect",
    "runDiagnostic",
    "getReport",
    "getReceipt",
    "getReceiptLight"
  ]);

  const EXPECTED_UPSTREAM_GATE_IDS = Object.freeze([
    "NORTH_RAIL",
    "PROBE_NORTH",
    "RAIL_EAST",
    "PROBE_EAST",
    "RAIL_WEST",
    "PROBE_WEST",
    "RAIL_SOUTH"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  root.HEARTH = root.HEARTH || {};
  root.DEXTER_LAB = root.DEXTER_LAB || {};

  root.HEARTH.diagnosticProbeSouth = api;
  root.HEARTH.diagnosticRailProbeSouth = api;
  root.HEARTH.diagnosticSouthProbe = api;

  root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
  root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
  root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;

  root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
  root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
  root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

  let lastState = null;
  let lastReport = null;
  let lastEvidence = null;
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
        return bounded(JSON.stringify(value), 24000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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
      "getEvidence",
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

  function probeAliasChronologyText() {
    return PROBE_ALIAS_CHRONOLOGY.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
      if (!isObject(entry)) return bounded(entry, 1200);

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

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }

    return {};
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function resolveGateState(chronology) {
    const observed = Array.isArray(chronology) && chronology.length > 0;
    const gates = EXPECTED_UPSTREAM_GATE_IDS.map((id, index) => {
      const entry = findChronologyEntry(chronology, id);
      const status = entry ? firstKnown(entry.status, "UNKNOWN") : "NOT_OBSERVED_IN_PARENT_CHRONOLOGY";
      const callStatus = entry ? firstKnown(entry.callStatus, "UNKNOWN") : "NOT_OBSERVED_IN_PARENT_CHRONOLOGY";

      return {
        order: index + 1,
        id,
        observed: Boolean(entry),
        status,
        callStatus,
        file: entry ? firstKnown(entry.file, "UNKNOWN") : "UNKNOWN"
      };
    });

    const complete = observed && gates.every((gate) => gate.status === "COMPLETE");

    return {
      observed,
      gates,
      complete,
      status: complete
        ? "UPSTREAM_SEVEN_GATES_COMPLETE"
        : observed
          ? "UPSTREAM_SEVEN_GATES_INCOMPLETE_OR_UNPROVEN"
          : "UPSTREAM_CHRONOLOGY_NOT_SUPPLIED_TO_PROBE",
      text: gates.map((gate) => {
        return [
          `${gate.order}.${gate.id}`,
          `observed:${gate.observed}`,
          `status:${gate.status}`,
          `call:${gate.callStatus}`
        ].join(" ");
      }).join(" | ")
    };
  }

  function makeBaseState() {
    return {
      probeSouthStatus: "READY",
      probeSouthContract: CONTRACT,
      probeSouthReceipt: RECEIPT,
      probeSouthVersion: VERSION,
      probeSouthFile: FILE,
      probeSouthAuthority: "GATE_8_CHECKMARK_ROUTER",
      probeSouthPathUse: "ROUTER_ONLY_ALL_CONDUCTING_HELD_BY_SOUTH_RAIL",
      gate8CheckmarkStatus: "READY",
      gate8OwnsGate7Correctness: false,
      gate8JudgesSouthRailCorrectness: false,
      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      aliasChronologyText: probeAliasChronologyText(),
      callableMethods: [
        "runProbeSouth",
        "inspectPacketMeaning",
        "inspectPacketComposition",
        "runProbe",
        "inspect",
        "runDiagnostic",
        "getReport",
        "getEvidence",
        "getPacketText",
        "getCompactSummary",
        "getState",
        "getReceipt",
        "getReceiptLight"
      ],
      lastUpdatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function buildNotes(currentReport, gateState, southRail, input) {
    const noClaims = isObject(input && input.noClaims) ? input.noClaims : {};
    const noClaimIntegrity = [
      noClaims.f13Claimed,
      noClaims.f21EligibleForNorth,
      noClaims.f21ClaimedByDiagnosticRail,
      noClaims.readyTextAllowed,
      noClaims.readyTextClaimedByDiagnosticRail,
      noClaims.visualPassClaimed,
      noClaims.generatedImage,
      noClaims.graphicBox,
      noClaims.webGL
    ].every((value) => value === false || value === undefined);

    return normalizeNotes(
      getRaw(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getRaw(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      "PROBE_SOUTH_GATE_8_CHECKMARK_ROUTER_ACTIVE",
      "PROBE_SOUTH_PUBLISHES_NORTH_V10_REQUIRED_ALIASES_AT_PARSE_TIME",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD_AVAILABLE:runProbeSouth",
      "PROBE_SOUTH_IS_GATE_8_CHECKMARK_NOT_SOUTH_RAIL_AUTHORITY",
      "PROBE_SOUTH_DOES_NOT_JUDGE_GATE_7_CORRECTNESS",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_REPAIR_HEARTH",
      "PROBE_SOUTH_DOES_NOT_RESTART_RUNTIME",
      "PROBE_SOUTH_DOES_NOT_RELEASE_CANVAS",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "PROBE_SOUTH_DOES_NOT_CLAIM_READY_TEXT_OR_VISUAL_PASS",
      gateState.complete
        ? "PROBE_SOUTH_CONFIRMED_PARENT_UPSTREAM_SEVEN_GATES_COMPLETE"
        : `PROBE_SOUTH_UPSTREAM_GATE_STATUS:${gateState.status}`,
      southRail.observed
        ? `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${southRail.sourcePath}`
        : "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL_DIRECTLY_NON_BLOCKING",
      noClaimIntegrity
        ? "PROBE_SOUTH_CONFIRMED_NO_CLAIM_INTEGRITY"
        : "PROBE_SOUTH_NO_CLAIM_PAYLOAD_INCOMPLETE_NON_BLOCKING"
    );
  }

  function inspectSouthRail() {
    const found = findFirstPath(SOUTH_RAIL_PATHS);
    const receipt = getReceiptFromAuthority(found.value) || {};
    const callableMethods = SOUTH_RAIL_METHODS.filter((method) => {
      return Boolean(found.value && isFunction(found.value[method]));
    });

    return {
      observed: Boolean(found.value),
      sourcePath: found.path,
      contract: firstKnown(
        receipt.contract,
        receipt.CONTRACT,
        receipt.SOUTH_CONTRACT,
        receipt.SouthContract,
        found.value && found.value.contract,
        found.value && found.value.CONTRACT
      ),
      receipt: firstKnown(
        receipt.receipt,
        receipt.RECEIPT,
        receipt.SOUTH_RECEIPT,
        found.value && found.value.receipt,
        found.value && found.value.RECEIPT
      ),
      callableSurfacePresent: callableMethods.length > 0,
      primaryMethodPresent: callableMethods.includes("composeSouthReport"),
      callableMethods: callableMethods.join(",") || "NONE"
    };
  }

  function buildProbeReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = Array.isArray(input.chronology)
      ? clonePlain(input.chronology)
      : Array.isArray(getRaw(currentReport, "CHRONOLOGY_SEQUENCE", null))
        ? clonePlain(getRaw(currentReport, "CHRONOLOGY_SEQUENCE", []))
        : [];

    const evidenceByStep = isObject(input.evidenceByStep)
      ? clonePlain(input.evidenceByStep)
      : {};

    const gateState = resolveGateState(chronology);
    const southRail = inspectSouthRail();

    const parentNorthContract = firstKnown(
      input.northContract,
      getRaw(currentReport, "NORTH_CONTRACT", ""),
      NORTH_CONTRACT
    );

    const parentNorthReceipt = firstKnown(
      input.northReceipt,
      getRaw(currentReport, "NORTH_RECEIPT", ""),
      NORTH_RECEIPT
    );

    const notes = buildNotes(currentReport, gateState, southRail, input);
    const notesText = notes.join(" | ");

    const probeMeaningStatus = gateState.complete
      ? "GATE_8_CHECKMARK_CONFIRMED_AFTER_SEVEN_GATES"
      : gateState.observed
        ? "GATE_8_CHECKMARK_COMPLETE_WITH_UPSTREAM_GATE_WARNING"
        : "GATE_8_CHECKMARK_COMPLETE_PARENT_CHRONOLOGY_NOT_SUPPLIED";

    const runStatus = "COMPLETE";

    const report = {
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
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        input.previousNorthContract,
        getRaw(currentReport, "PREVIOUS_NORTH_CONTRACT", ""),
        PREVIOUS_NORTH_CONTRACT
      ),
      PREVIOUS_NORTH_RECEIPT: firstKnown(
        getRaw(currentReport, "PREVIOUS_NORTH_RECEIPT", ""),
        PREVIOUS_NORTH_RECEIPT
      ),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", input.chronologyHubActive),
        "true"
      ),
      NORTH_IS_HUB_ONLY: boolText(getRaw(currentReport, "NORTH_IS_HUB_ONLY", true), "true"),
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", input.eightWayProbeBridgeActive),
        "false"
      ),
      EIGHT_FILE_CHRONOLOGY_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true),
        "true"
      ),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: boolText(
        getRaw(currentReport, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", false),
        "false"
      ),
      RECEIVER_STILL_CALLS_NORTH_ONLY: boolText(
        getRaw(currentReport, "RECEIVER_STILL_CALLS_NORTH_ONLY", true),
        "true"
      ),

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(
        input.expectedHtmlContract,
        getRaw(currentReport, "EXPECTED_HTML_CONTRACT", ""),
        EXPECTED_HTML_CONTRACT
      ),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(
        input.expectedIndexJsContract,
        getRaw(currentReport, "EXPECTED_INDEX_JS_CONTRACT", ""),
        EXPECTED_INDEX_JS_CONTRACT
      ),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(
        input.expectedRouteConductorContract,
        getRaw(currentReport, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT", ""),
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT
      ),
      EXPECTED_CONTROL_CONTRACT: firstKnown(
        input.expectedControlContract,
        getRaw(currentReport, "EXPECTED_CONTROL_CONTRACT", ""),
        EXPECTED_CONTROL_CONTRACT
      ),
      EXPECTED_CANVAS_CONTRACT: firstKnown(
        input.expectedCanvasContract,
        getRaw(currentReport, "EXPECTED_CANVAS_CONTRACT", ""),
        EXPECTED_CANVAS_CONTRACT
      ),
      EXPECTED_EAST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_EAST_CONTRACT", ""), EXPECTED_EAST_CONTRACT),
      EXPECTED_WEST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_WEST_CONTRACT", ""), EXPECTED_WEST_CONTRACT),
      EXPECTED_SOUTH_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_SOUTH_CONTRACT", ""), EXPECTED_SOUTH_CONTRACT),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "EXPECTED_PROBE_NORTH_CONTRACT", ""),
        EXPECTED_PROBE_NORTH_CONTRACT
      ),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(
        getRaw(currentReport, "EXPECTED_PROBE_EAST_CONTRACT", ""),
        EXPECTED_PROBE_EAST_CONTRACT
      ),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(
        getRaw(currentReport, "EXPECTED_PROBE_WEST_CONTRACT", ""),
        EXPECTED_PROBE_WEST_CONTRACT
      ),
      EXPECTED_PROBE_SOUTH_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: runStatus,
      PROBE_SOUTH_MEANING_STATUS: probeMeaningStatus,
      PROBE_SOUTH_IS_DIAGNOSTIC_ONLY: true,
      PROBE_SOUTH_AUTHORITY: "GATE_8_CHECKMARK_ROUTER",
      PROBE_SOUTH_ROUTER_MODE: "GATE_8_CHECKMARK_ROUTER",
      PROBE_SOUTH_PATH_USE: "ROUTER_ONLY_ALL_CONDUCTING_HELD_BY_SOUTH_RAIL",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_CALLABLE_METHODS:
        "runProbeSouth | inspectPacketMeaning | inspectPacketComposition | runProbe | inspect | runDiagnostic",
      PROBE_SOUTH_NORTH_V10_COMPATIBLE: true,
      PROBE_SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE: true,

      GATE_8_CHECKMARK_STATUS: "COMPLETE",
      GATE_8_ROLE: "CHECKMARK_AFTER_SOUTH_RAIL_FUNNEL",
      GATE_8_OWNS_GATE_7_CORRECTNESS: false,
      GATE_8_JUDGES_SOUTH_RAIL_CORRECTNESS: false,
      GATE_8_DICTATES_SOUTH_RAIL_STATUS: false,
      GATE_8_CONFIRMS_ITS_OWN_OBSERVATION_AND_CALL_RETURN: true,

      UPSTREAM_CHRONOLOGY_OBSERVED_BY_PROBE: gateState.observed,
      UPSTREAM_CHRONOLOGY_LENGTH_BY_PROBE: chronology.length,
      UPSTREAM_SEVEN_GATES_STATUS_BY_PROBE: gateState.status,
      UPSTREAM_SEVEN_GATES_COMPLETE_BY_PROBE: gateState.complete,
      UPSTREAM_SEVEN_GATES_TEXT_BY_PROBE: gateState.text,
      UPSTREAM_GATE_SUMMARY_BY_PROBE: clonePlain(gateState.gates),

      SOUTH_RAIL_OBSERVED_BY_PROBE: southRail.observed,
      SOUTH_RAIL_SOURCE_PATH_BY_PROBE: southRail.sourcePath,
      SOUTH_RAIL_CONTRACT_BY_PROBE: southRail.contract,
      SOUTH_RAIL_RECEIPT_BY_PROBE: southRail.receipt,
      SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE: southRail.callableSurfacePresent,
      SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE: southRail.primaryMethodPresent,
      SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE: southRail.callableMethods,
      SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH: "composeSouthReport",
      SOUTH_RAIL_CORRECTNESS_DECIDED_BY_PROBE: false,

      PROBE_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_ALIAS_CHRONOLOGY_TEXT: probeAliasChronologyText(),
      PROBE_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_RAIL_ALIAS: "HEARTH.diagnosticRailProbeSouth",
      PROBE_INVERTED_ALIAS: "HEARTH.diagnosticSouthProbe",
      PROBE_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      PROBE_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      PROBE_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      PROBE_LAB_RAIL_ALIAS: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",

      CURRENT_REPORT_OBSERVED_BY_PROBE: Object.keys(currentReport).length > 0,
      CURRENT_REPORT_PACKET_NAME_BY_PROBE: firstKnown(
        getRaw(currentReport, "PACKET_NAME", ""),
        REPORT_PACKET
      ),
      CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE: firstKnown(
        getRaw(currentReport, "NORTH_CONTRACT", ""),
        parentNorthContract
      ),
      CURRENT_REPORT_CHRONOLOGY_TEXT_BY_PROBE: firstKnown(
        getRaw(currentReport, "CHRONOLOGY_SEQUENCE_TEXT", ""),
        chronologyText(chronology)
      ),
      EVIDENCE_BY_STEP_KEYS_BY_PROBE: Object.keys(evidenceByStep).join(",") || "NONE",

      PROBE_SOUTH_OWNS_PACKET_OUTPUT: false,
      PROBE_SOUTH_OWNS_SOUTH_RAIL: false,
      PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY: false,
      PROBE_SOUTH_OWNS_EAST_EVIDENCE: false,
      PROBE_SOUTH_OWNS_WEST_EVIDENCE: false,
      PROBE_SOUTH_OWNS_CANVAS_EXPRESSION: false,
      PROBE_SOUTH_OWNS_PRODUCTION_REPAIR: false,

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

      SECONDARY_EVIDENCE_NOTES: notesText,
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notesText,

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
      "PREVIOUS_NORTH_RECEIPT",

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
      "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_ROUTER_MODE",
      "PROBE_SOUTH_PATH_USE",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD",
      "PROBE_SOUTH_CALLABLE_METHODS",
      "PROBE_SOUTH_NORTH_V10_COMPATIBLE",
      "PROBE_SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE",

      "GATE_8_CHECKMARK_STATUS",
      "GATE_8_ROLE",
      "GATE_8_OWNS_GATE_7_CORRECTNESS",
      "GATE_8_JUDGES_SOUTH_RAIL_CORRECTNESS",
      "GATE_8_DICTATES_SOUTH_RAIL_STATUS",
      "GATE_8_CONFIRMS_ITS_OWN_OBSERVATION_AND_CALL_RETURN",

      "UPSTREAM_CHRONOLOGY_OBSERVED_BY_PROBE",
      "UPSTREAM_CHRONOLOGY_LENGTH_BY_PROBE",
      "UPSTREAM_SEVEN_GATES_STATUS_BY_PROBE",
      "UPSTREAM_SEVEN_GATES_COMPLETE_BY_PROBE",
      "UPSTREAM_SEVEN_GATES_TEXT_BY_PROBE",

      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_SOURCE_PATH_BY_PROBE",
      "SOUTH_RAIL_CONTRACT_BY_PROBE",
      "SOUTH_RAIL_RECEIPT_BY_PROBE",
      "SOUTH_RAIL_CALL_SURFACE_PRESENT_BY_PROBE",
      "SOUTH_RAIL_PRIMARY_METHOD_PRESENT_BY_PROBE",
      "SOUTH_RAIL_CALLABLE_METHODS_BY_PROBE",
      "SOUTH_RAIL_REQUIRED_METHOD_BY_NORTH",
      "SOUTH_RAIL_CORRECTNESS_DECIDED_BY_PROBE",

      "PROBE_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_ALIAS_CHRONOLOGY_TEXT",
      "PROBE_PRIMARY_ALIAS",
      "PROBE_RAIL_ALIAS",
      "PROBE_INVERTED_ALIAS",
      "PROBE_GLOBAL_ALIAS",
      "PROBE_GLOBAL_RAIL_ALIAS",
      "PROBE_LAB_ALIAS",
      "PROBE_LAB_RAIL_ALIAS",

      "CURRENT_REPORT_OBSERVED_BY_PROBE",
      "CURRENT_REPORT_PACKET_NAME_BY_PROBE",
      "CURRENT_REPORT_NORTH_CONTRACT_BY_PROBE",
      "CURRENT_REPORT_CHRONOLOGY_TEXT_BY_PROBE",
      "EVIDENCE_BY_STEP_KEYS_BY_PROBE",

      "PROBE_SOUTH_OWNS_PACKET_OUTPUT",
      "PROBE_SOUTH_OWNS_SOUTH_RAIL",
      "PROBE_SOUTH_OWNS_NORTH_CHRONOLOGY",
      "PROBE_SOUTH_OWNS_EAST_EVIDENCE",
      "PROBE_SOUTH_OWNS_WEST_EVIDENCE",
      "PROBE_SOUTH_OWNS_CANVAS_EXPRESSION",
      "PROBE_SOUTH_OWNS_PRODUCTION_REPAIR",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "MACRO_WEST_RELEASE_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORITY",
      "ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY",
      "CONTROL_IMPLEMENTATION_AUTHORITY",
      "TERRAIN_TRUTH_AUTHORITY",
      "HYDROLOGY_TRUTH_AUTHORITY",
      "MATERIAL_TRUTH_AUTHORITY",
      "FINAL_VISUAL_PASS_AUTHORITY",

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
      line("GATE_8_CHECKMARK_STATUS", getValue(report, "GATE_8_CHECKMARK_STATUS", "UNKNOWN")),
      line("UPSTREAM_SEVEN_GATES_STATUS_BY_PROBE", getValue(report, "UPSTREAM_SEVEN_GATES_STATUS_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_OBSERVED_BY_PROBE", getValue(report, "SOUTH_RAIL_OBSERVED_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_CORRECTNESS_DECIDED_BY_PROBE", getValue(report, "SOUTH_RAIL_CORRECTNESS_DECIDED_BY_PROBE", "false")),
      line("PROBE_ALIAS_CHRONOLOGY_STATUS", getValue(report, "PROBE_ALIAS_CHRONOLOGY_STATUS", "UNKNOWN"))
    ].join("\n");
  }

  function publishResult(report) {
    lastReport = clonePlain(report || {});
    lastEvidence = clonePlain(report || {});
    lastPacketText = composePacketText(lastReport);
    lastCompactSummary = composeCompactSummary(lastReport);
    lastState = {
      ...makeBaseState(),
      probeSouthStatus: "COMPLETE",
      gate8CheckmarkStatus: "COMPLETE",
      report: clonePlain(lastReport),
      evidence: clonePlain(lastEvidence),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      lastUpdatedAt: nowIso()
    };

    publishAliasesAndReceipts();
  }

  function runProbeSouth(payload = {}) {
    const report = buildProbeReport(payload);
    publishResult(report);

    return {
      ok: true,
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: "COMPLETE",
      PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
      GATE_8_CHECKMARK_STATUS: "COMPLETE",
      GATE_8_OWNS_GATE_7_CORRECTNESS: false,
      GATE_8_JUDGES_SOUTH_RAIL_CORRECTNESS: false,

      evidence: clonePlain(report),
      report: clonePlain(report),
      REPORT_OBJECT: clonePlain(report),
      output: {
        PROBE_SOUTH_STATUS: "COMPLETE",
        PROBE_SOUTH_CONTRACT: CONTRACT,
        PROBE_SOUTH_RECEIPT: RECEIPT,
        PROBE_SOUTH_RUN_STATUS: "COMPLETE",
        PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
        GATE_8_CHECKMARK_STATUS: "COMPLETE",
        REPORT_OBJECT: clonePlain(report),
        evidence: clonePlain(report)
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
      publishResult(buildProbeReport({
        northContract: NORTH_CONTRACT,
        northReceipt: NORTH_RECEIPT,
        chronologyHubActive: true,
        eightWayProbeBridgeActive: false,
        currentReport: {}
      }));
    }

    return clonePlain(lastReport);
  }

  function getEvidence() {
    if (!lastEvidence) getReport();
    return clonePlain(lastEvidence || {});
  }

  function getPacketText() {
    if (!lastPacketText) getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) getReport();
    return lastCompactSummary;
  }

  function getState() {
    return clonePlain(lastState || makeBaseState());
  }

  function getReceiptLight() {
    return {
      probeRole: "DIAGNOSTIC_PROBE_SOUTH_GATE_8_CHECKMARK_ROUTER",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      expectedParentNorthContract: NORTH_CONTRACT,
      expectedParentNorthReceipt: NORTH_RECEIPT,
      expectedSouthRailFile: RAIL_SOUTH_FILE,
      expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthRailMethod: "composeSouthReport",

      probeSouthAuthority: "GATE_8_CHECKMARK_ROUTER",
      probeSouthPathUse: "ROUTER_ONLY_ALL_CONDUCTING_HELD_BY_SOUTH_RAIL",
      gate8CheckmarkStatus: lastState && lastState.gate8CheckmarkStatus ? lastState.gate8CheckmarkStatus : "READY",
      gate8OwnsGate7Correctness: false,
      gate8JudgesSouthRailCorrectness: false,
      gate8DictatesSouthRailStatus: false,

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getEvidenceApiAvailable: true,
      getStateApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      publishesNorthExpectedAliases: true,
      supportsChronologyHubStandard: true,
      supportsGate8CheckmarkRouter: true,
      supportsSouthRailContactSurface: true,
      supportsNoClaimIntegrity: true,
      supportsProbeAsCheckmarkNotJudge: true,

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

      parentNorthContract: NORTH_CONTRACT,
      parentNorthReceipt: NORTH_RECEIPT,
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

      probeAliasChronologyStatus: "COMPLETE",
      probeAliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      probeAliasChronologyText: probeAliasChronologyText(),

      reportObject: clonePlain(lastReport || {}),
      evidence: clonePlain(lastEvidence || {}),
      state: clonePlain(lastState || makeBaseState()),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliasesAndReceipts() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_EVIDENCE = clonePlain(lastEvidence || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_EVIDENCE = clonePlain(lastEvidence || {});

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_COMPACT_SUMMARY = lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_COMPACT_SUMMARY = lastCompactSummary || "";
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

    parentNorthContract: NORTH_CONTRACT,
    parentNorthReceipt: NORTH_RECEIPT,
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

    expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT,
    expectedSouthRailMethod: "composeSouthReport",

    probeSouthAuthority: "GATE_8_CHECKMARK_ROUTER",
    probeSouthPathUse: "ROUTER_ONLY_ALL_CONDUCTING_HELD_BY_SOUTH_RAIL",
    gate8OwnsGate7Correctness: false,
    gate8JudgesSouthRailCorrectness: false,
    gate8DictatesSouthRailStatus: false,

    probeAliasChronology: PROBE_ALIAS_CHRONOLOGY,
    probeAliasChronologyText: probeAliasChronologyText(),

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect,
    runDiagnostic,
    getReport,
    getEvidence,
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
    getEvidenceApiAvailable: true,
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

  lastState = makeBaseState();
  publishAliasesAndReceipts();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
