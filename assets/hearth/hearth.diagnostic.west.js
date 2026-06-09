// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_TNT_v10
// Full-file replacement.
// West Diagnostic / rendered-target authority probe / strict runtime endpoint-family reader / direct method surface.
//
// Purpose:
// - Preserve the public West Diagnostic authority path: HEARTH.diagnosticWest.
// - Preserve the public v1 rendered-target authority probe contract.
// - Preserve the implementation-family label: HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_TNT_v9.
// - Correct the direct execution gap proved by Receipt Deck 12.
// - Expose receipt-deck-readable methods: runDiagnostic, run, inspect, getReport, getReceipt, getReceiptLight, getStatus, getState.
// - Keep West Diagnostic separate from LabWest Gate.
// - Read runtime endpoint-family evidence only.
// - Read rendered-target authority evidence only.
// - Report rendered read status, target access status, visible planet proof status, recommended next file, and recommended next action.
// - Avoid preserving any contradictory internal authority model.
// - Avoid production mutation, route conductor mutation, Canvas build, Canvas release, controls mutation, runtime restart, F13/F21/F55 claims, and final visual-pass claims.
//
// Does not own:
// - LabWest Gate
// - North final arbitration
// - North F21 latch
// - Lab South F8 proof production
// - South Surface Pointer sidecar ownership
// - Surface Truth definition
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - Canvas release
// - production mutation
// - route conductor mutation
// - controls
// - runtime restart
// - terrain/material/hydrology/elevation truth
// - final visual pass
// - public superiority claim
//

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_TNT_v9";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_RECEIPT_v9";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_TNT_v10";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_RECEIPT_v10";

  const PREVIOUS_RECEIPT_DECK_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_NORTH_ALIAS_RECOGNITION_AND_WEST_LABEL_SPLIT_TNT_v9_1";
  const PREVIOUS_RECEIPT_DECK_RECEIPT =
    "HEARTH_DIAGNOSTIC_ROUTE_NORTH_ALIAS_RECOGNITION_AND_WEST_LABEL_SPLIT_RECEIPT_v9_1";

  const VERSION =
    "2026-06-08.hearth-diagnostic-west-strict-runtime-endpoint-family-reader-direct-method-surface-v10";

  const FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const NORTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const SOUTH_POINTER_FILE = "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const LABWEST_GATE_FILE = "/assets/hearth/hearth.diagnostic.labwest.js";
  const SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const CONTROLS_FILE = "/assets/hearth/hearth.controls.js";

  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_PACKET_v10";

  const NO_CLAIMS = Object.freeze({
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    controlsMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasBuildAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,

    f13Claimed: false,
    f13ClaimedByWest: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByWest: false,
    f21SubmittedToNorth: false,
    f55ClaimedByWest: false,

    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    finalVisualPassAuthority: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CONTROLS_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,

    F13_CLAIMED: false,
    F13_CLAIMED_BY_WEST: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_WEST: false,
    F21_SUBMITTED_TO_NORTH: false,
    F55_CLAIMED_BY_WEST: false,

    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PUBLIC_SUPERIORITY_CLAIM: false,
    PUBLIC_COMPARISON_CLAIM_ALLOWED: false,
    FINAL_VISUAL_PASS_AUTHORITY: false
  });

  const WEST_PUBLIC_ALIASES = Object.freeze([
    "HEARTH.diagnosticWest",
    "HEARTH.diagnosticRailWest",
    "HEARTH.diagnosticWestRenderedTargetProbe",
    "HEARTH.diagnosticWestRuntimeEndpointFamilyReader",
    "HEARTH.WEST_DIAGNOSTIC",
    "HEARTH.WEST_DIAGNOSTIC_DIRECT",

    "HEARTH_DIAGNOSTIC_WEST",
    "HEARTH_DIAGNOSTIC_RAIL_WEST",
    "HEARTH_DIAGNOSTIC_WEST_RENDERED_TARGET_AUTHORITY_PROBE",
    "HEARTH_DIAGNOSTIC_WEST_RUNTIME_ENDPOINT_FAMILY_READER",

    "DEXTER_LAB.hearthDiagnosticWest",
    "DEXTER_LAB.hearthDiagnosticRailWest",
    "DEXTER_LAB.hearthDiagnosticWestRenderedTargetProbe",
    "DEXTER_LAB.hearthDiagnosticWestRuntimeEndpointFamilyReader"
  ]);

  const NORTH_RAIL_ALIASES = Object.freeze([
    "JUDGE_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL",
    "HEARTH.diagnosticRail",
    "HEARTH.diagnosticNorth",
    "HEARTH.diagnosticNorthRail",
    "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
    "DEXTER_LAB.hearthDiagnosticRail",
    "DEXTER_LAB.hearthDiagnosticNorth",
    "DEXTER_LAB.hearthDiagnosticNorthRail"
  ]);

  const LABWEST_GATE_ALIASES = Object.freeze([
    "HEARTH.diagnosticLabWest",
    "HEARTH.labWestConstruct",
    "HEARTH.diagnosticLabWestConstruct",
    "HEARTH.diagnosticConstructAlignmentGaugeReceiver",
    "HEARTH_DIAGNOSTIC_LABWEST",
    "HEARTH_DIAGNOSTIC_LABWEST_CONSTRUCT",
    "HEARTH_DIAGNOSTIC_CONSTRUCT_ALIGNMENT_GAUGE_RECEIVER",
    "DEXTER_LAB.hearthDiagnosticLabWest",
    "DEXTER_LAB.hearthDiagnosticConstructAlignmentGaugeReceiver"
  ]);

  const SOUTH_POINTER_ALIASES = Object.freeze([
    "HEARTH.southSurfacePointerSidecar",
    "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH.southCanvasSurfacePointerSidecar",
    "HEARTH.diagnosticSouthSurfacePointer",
    "HEARTH.diagnosticSouthScopeLens",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS",
    "DEXTER_LAB.southSurfacePointerSidecar",
    "DEXTER_LAB.hearthSouthSurfacePointerSidecar",
    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer"
  ]);

  const SOUTH_RAIL_ALIASES = Object.freeze([
    "JUDGE_SOUTH",
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthReceiptSegregator",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth"
  ]);

  const SURFACE_TRUTH_ALIASES = Object.freeze([
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH.canvasSurfaceTruthProbe",
    "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "DEXTER_LAB.canvasSurfaceTruthProbe",
    "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
  ]);

  const RENDERED_TARGET_ALIASES = Object.freeze([
    "HEARTH.renderedTargetAuthority",
    "HEARTH.renderedTarget",
    "HEARTH.visiblePlanetTargetAuthority",
    "HEARTH.visiblePlanetTarget",
    "HEARTH.visiblePlanet",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.chapel1AssetsCanvasHub",
    "HEARTH.CHAPEL_1_ASSETS_CANVAS_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasAuthority"
  ]);

  const RUNTIME_ENDPOINT_ALIASES = Object.freeze([
    "HEARTH.runtimeEndpointFamily",
    "HEARTH.runtimeEndpointFamilyReader",
    "HEARTH.renderedRuntimeEndpoint",
    "HEARTH.renderedTargetEndpoint",
    "HEARTH.diagnosticRouteReceiver",
    "HEARTH.diagnosticGaugeVarianceReceiver",
    "HEARTH_DIAGNOSTIC_ROUTE_RECEIVER",
    "HEARTH_DIAGNOSTIC_GAUGE_VARIANCE_RECEIVER",
    "DEXTER_LAB.hearthDiagnosticRouteReceiver",
    "DEXTER_LAB.hearthDiagnosticGaugeVarianceReceiver"
  ]);

  const READ_METHODS = Object.freeze([
    "runDiagnostic",
    "run",
    "inspect",
    "getReport",
    "getReceiptLight",
    "getReceipt",
    "getStatus",
    "getState",
    "getSummary",
    "getPacket",
    "getAlignmentPacket",
    "getRenderedTargetReport",
    "getRenderedReadReport",
    "getTargetAccessReport",
    "composeReceipt"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousReceiptDeckContract: PREVIOUS_RECEIPT_DECK_CONTRACT,
    previousReceiptDeckReceipt: PREVIOUS_RECEIPT_DECK_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    directMethodSurfaceActive: true,
    westDiagnosticAuthorityActive: true,
    westDiagnosticSeparateFromLabWest: true,
    strictRuntimeEndpointFamilyReaderActive: true,
    renderedTargetAuthorityProbeActive: true,

    runCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,

    latestRunState: "LOADED_NOT_RUN",
    latestTrustState: "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE_PRESENT",
    latestRenderedReadStatus: "UNKNOWN",
    latestTargetAccessStatus: "UNKNOWN",
    latestVisiblePlanetProofReady: "UNKNOWN",
    latestRecommendedNextFile: "UNKNOWN",
    latestRecommendedNextAction: "RUN_WEST_DIAGNOSTIC_DIRECT_CHECK",
    latestEvent: "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE_LOADED",
    updatedAt: "",
    lastReport: null,
    lastPacketText: "",
    events: [],
    errors: [],

    ...NO_CLAIMS
  };

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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function clonePlain(value) {
    if (value === undefined || value === null) return value;

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
      const joined = value.map((item) => packetValue(item, "")).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 20000) || fallback;
      } catch (_error) {
        return bounded(value, 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolValue(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
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

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "WEST_DIAGNOSTIC_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 100);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "WEST_DIAGNOSTIC_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1600),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 60);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    let cursor = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function parsePacketText(text) {
    const out = {};
    const source = safeString(text);

    source.split(/\r?\n/).forEach((row) => {
      const index = row.indexOf("=");
      if (index <= 0) return;
      const key = row.slice(0, index).trim();
      const value = row.slice(index + 1).trim();
      if (key) out[key] = value;
    });

    return out;
  }

  function safeMethodList(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return [];

    try {
      return Object.keys(value)
        .filter((key) => isFunction(value[key]))
        .sort()
        .slice(0, 120);
    } catch (_error) {
      return [];
    }
  }

  function callFirstMethod(authority, methods, argument) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) {
      return {
        attempted: false,
        method: "NONE",
        ok: false,
        output: null,
        outputText: "",
        error: "NO_AUTHORITY"
      };
    }

    for (const method of methods || []) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = argument === undefined ? authority[method]() : authority[method](argument);

        if (isObject(output)) {
          return {
            attempted: true,
            method,
            ok: true,
            output: clonePlain(output),
            outputText: "",
            error: "NONE"
          };
        }

        if (typeof output === "string" && output.trim()) {
          return {
            attempted: true,
            method,
            ok: true,
            output: parsePacketText(output),
            outputText: output,
            error: "NONE"
          };
        }

        return {
          attempted: true,
          method,
          ok: true,
          output,
          outputText: "",
          error: "NONE"
        };
      } catch (error) {
        return {
          attempted: true,
          method,
          ok: false,
          output: null,
          outputText: "",
          error: bounded(error && error.message ? error.message : error, 1600)
        };
      }
    }

    return {
      attempted: false,
      method: "NONE",
      ok: false,
      output: null,
      outputText: "",
      error: "NO_METHOD_AVAILABLE"
    };
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    const call = callFirstMethod(authority, READ_METHODS);
    if (call.ok && isObject(call.output)) return call.output;

    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return {};
  }

  function contractOf(value) {
    const source = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      getRaw(source, "CONTRACT", undefined),
      getRaw(source, "contract", undefined),
      getRaw(source, "PUBLIC_CONTRACT", undefined),
      getRaw(source, "publicContract", undefined),
      getRaw(source, "IMPLEMENTATION_CONTRACT", undefined),
      getRaw(source, "implementationContract", undefined),
      getRaw(source, "INTERNAL_RENEWAL_CONTRACT", undefined),
      getRaw(source, "internalRenewalContract", undefined),
      "UNKNOWN"
    );
  }

  function receiptOf(value) {
    const source = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      getRaw(source, "RECEIPT", undefined),
      getRaw(source, "receipt", undefined),
      getRaw(source, "PUBLIC_RECEIPT", undefined),
      getRaw(source, "publicReceipt", undefined),
      getRaw(source, "IMPLEMENTATION_RECEIPT", undefined),
      getRaw(source, "implementationReceipt", undefined),
      getRaw(source, "INTERNAL_RENEWAL_RECEIPT", undefined),
      getRaw(source, "internalRenewalReceipt", undefined),
      "UNKNOWN"
    );
  }

  function inspectAuthority(id, file, aliases, methods = READ_METHODS) {
    const found = firstGlobal(aliases || []);
    const authority = found.value;
    const receipt = readAuthorityReceipt(authority);
    const methodCall = callFirstMethod(authority, methods);

    const contract =
      contractOf(receipt) !== "UNKNOWN" ? contractOf(receipt) : contractOf(authority || {});
    const receiptName =
      receiptOf(receipt) !== "UNKNOWN" ? receiptOf(receipt) : receiptOf(authority || {});

    return {
      id,
      file,
      observed: Boolean(authority),
      alias: found.path,
      contract,
      receipt: receiptName,
      methodCount: safeMethodList(authority).length,
      methods: safeMethodList(authority),
      readableReceiptPresent: Boolean(receipt && Object.keys(receipt).length),
      preferredMethodAttempted: methodCall.attempted,
      preferredMethod: methodCall.method,
      preferredMethodOk: methodCall.ok,
      preferredMethodError: methodCall.error,
      preferredMethodOutput: clonePlain(methodCall.output),
      preferredMethodOutputText: methodCall.outputText || "",
      status: authority
        ? contract !== "UNKNOWN"
          ? "LOADED_AND_AVAILABLE"
          : "AUTHORITY_PRESENT_CONTRACT_NOT_PRESENT"
        : "NOT_OBSERVED",
      receiptObject: clonePlain(receipt),
      ...NO_CLAIMS
    };
  }

  function detectForbiddenClaim(source = {}) {
    const text = (() => {
      try {
        return JSON.stringify(source || {});
      } catch (_error) {
        return safeString(source, "");
      }
    })();

    return Boolean(
      boolValue(getRaw(source, "generatedImage", false), false) ||
      boolValue(getRaw(source, "graphicBox", false), false) ||
      boolValue(getRaw(source, "webGL", false), false) ||
      boolValue(getRaw(source, "webgl", false), false) ||
      boolValue(getRaw(source, "visualPassClaimed", false), false) ||
      boolValue(getRaw(source, "finalVisualPassClaimed", false), false) ||
      boolValue(getRaw(source, "publicSuperiorityClaim", false), false) ||
      boolValue(getRaw(source, "canvasBuildAuthorized", false), false) ||
      boolValue(getRaw(source, "canvasReleaseAuthorized", false), false) ||
      boolValue(getRaw(source, "productionMutationAuthorized", false), false) ||
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true') ||
      text.includes('"webgl":true') ||
      text.includes('"visualPassClaimed":true') ||
      text.includes('"finalVisualPassClaimed":true') ||
      text.includes('"canvasBuildAuthorized":true') ||
      text.includes('"canvasReleaseAuthorized":true') ||
      text.includes('"productionMutationAuthorized":true')
    );
  }

  function readExplicitBoolean(source, keys) {
    for (const key of keys || []) {
      const value = getRaw(source, key, undefined);
      if (value === undefined) continue;
      if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
      if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    }
    return "UNKNOWN";
  }

  function scanProofReady(records) {
    for (const record of records || []) {
      const output = record.preferredMethodOutput || {};
      const receipt = record.receiptObject || {};

      const fromOutput = readExplicitBoolean(output, [
        "VISIBLE_PLANET_PROOF_READY",
        "visiblePlanetProofReady",
        "CANVAS_VISIBLE_PLANET_PROOF_READY",
        "canvasVisiblePlanetProofReady",
        "visiblePlanetProofComplete",
        "VISIBLE_PLANET_PROOF_COMPLETE"
      ]);

      if (fromOutput !== "UNKNOWN") return fromOutput;

      const fromReceipt = readExplicitBoolean(receipt, [
        "VISIBLE_PLANET_PROOF_READY",
        "visiblePlanetProofReady",
        "CANVAS_VISIBLE_PLANET_PROOF_READY",
        "canvasVisiblePlanetProofReady",
        "visiblePlanetProofComplete",
        "VISIBLE_PLANET_PROOF_COMPLETE"
      ]);

      if (fromReceipt !== "UNKNOWN") return fromReceipt;
    }

    return "UNKNOWN";
  }

  function computeEndpointFamily() {
    const renderedTarget = inspectAuthority(
      "RENDERED_TARGET_AUTHORITY",
      CANVAS_FILE,
      RENDERED_TARGET_ALIASES
    );

    const runtimeEndpoint = inspectAuthority(
      "RUNTIME_ENDPOINT_FAMILY",
      DIAGNOSTIC_ROUTE,
      RUNTIME_ENDPOINT_ALIASES
    );

    const surfaceTruth = inspectAuthority(
      "SURFACE_TRUTH_PROBE",
      SURFACE_TRUTH_FILE,
      SURFACE_TRUTH_ALIASES
    );

    const northRail = inspectAuthority(
      "NORTH_DIAGNOSTIC_RAIL",
      NORTH_RAIL_FILE,
      NORTH_RAIL_ALIASES
    );

    const southPointer = inspectAuthority(
      "SOUTH_SURFACE_POINTER_SIDECAR",
      SOUTH_POINTER_FILE,
      SOUTH_POINTER_ALIASES
    );

    const southRail = inspectAuthority(
      "SOUTH_DIAGNOSTIC_RAIL",
      SOUTH_RAIL_FILE,
      SOUTH_RAIL_ALIASES
    );

    const labWestGate = inspectAuthority(
      "LABWEST_GATE",
      LABWEST_GATE_FILE,
      LABWEST_GATE_ALIASES
    );

    const records = {
      renderedTarget,
      runtimeEndpoint,
      surfaceTruth,
      northRail,
      southPointer,
      southRail,
      labWestGate
    };

    const targetAccessPresent = Boolean(
      renderedTarget.observed ||
      runtimeEndpoint.observed ||
      surfaceTruth.observed ||
      southPointer.observed
    );

    const readableRenderedTarget = Boolean(
      renderedTarget.readableReceiptPresent ||
      renderedTarget.preferredMethodOk ||
      runtimeEndpoint.readableReceiptPresent ||
      runtimeEndpoint.preferredMethodOk ||
      surfaceTruth.readableReceiptPresent ||
      surfaceTruth.preferredMethodOk ||
      southPointer.readableReceiptPresent ||
      southPointer.preferredMethodOk
    );

    let renderedReadStatus = "UNKNOWN";
    if (readableRenderedTarget) renderedReadStatus = "RENDERED_ENDPOINT_FAMILY_READABLE";
    else if (targetAccessPresent) renderedReadStatus = "TARGET_AUTHORITY_FOUND_READ_METHOD_UNKNOWN";

    let targetAccessStatus = "UNKNOWN";
    if (targetAccessPresent && readableRenderedTarget) {
      targetAccessStatus = "TARGET_ACCESS_PRESENT_AND_READABLE";
    } else if (targetAccessPresent) {
      targetAccessStatus = "TARGET_ACCESS_PRESENT_READ_STATUS_UNKNOWN";
    }

    const visiblePlanetProofReady = scanProofReady([
      renderedTarget,
      runtimeEndpoint,
      surfaceTruth,
      southPointer,
      southRail,
      northRail
    ]);

    const forbiddenClaimDetected = Object.values(records).some((record) =>
      detectForbiddenClaim(record.receiptObject) || detectForbiddenClaim(record.preferredMethodOutput)
    );

    let recommendedNextFile = NORTH_RAIL_FILE;
    let recommendedNextAction = "RUN_14_NEXT_MOVE_SYNTHESIS";

    if (forbiddenClaimDetected) {
      recommendedNextFile = FILE;
      recommendedNextAction = "HOLD_WEST_DIAGNOSTIC_FOR_FORBIDDEN_CLAIM_REVIEW";
    } else if (!targetAccessPresent) {
      recommendedNextFile = SURFACE_TRUTH_FILE;
      recommendedNextAction =
        "RUN_SURFACE_TRUTH_OR_TARGET_ENDPOINT_DIRECT_CHECK_BEFORE_CANVAS_OR_PRODUCTION_TOUCH";
    } else if (targetAccessPresent && !readableRenderedTarget) {
      recommendedNextFile = FILE;
      recommendedNextAction =
        "WEST_DIAGNOSTIC_TARGET_FOUND_BUT_READ_STATUS_UNKNOWN_KEEP_DIRECT_CHECK_ACTIVE";
    } else if (southPointer.observed && northRail.observed) {
      recommendedNextFile = NORTH_RAIL_FILE;
      recommendedNextAction =
        "RUN_EXISTING_NORTH_RAIL_TO_CONFIRM_SOUTH_SURFACE_POINTER_SIDECAR_DISCOVERY";
    }

    return {
      renderedReadStatus,
      targetAccessStatus,
      visiblePlanetProofReady,
      forbiddenClaimDetected,
      recommendedNextFile,
      recommendedNextAction,
      records,
      labWestGateIsSeparate: true,
      westDiagnosticIsSeparate: true
    };
  }

  function buildReport(input = {}) {
    const endpoint = computeEndpointFamily();

    state.latestRunState = "WEST_DIAGNOSTIC_DIRECT_RUN_COMPLETE";
    state.latestTrustState = endpoint.forbiddenClaimDetected
      ? "WEST_DIAGNOSTIC_FORBIDDEN_CLAIM_DETECTED"
      : "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE_TRUSTED";
    state.latestRenderedReadStatus = endpoint.renderedReadStatus;
    state.latestTargetAccessStatus = endpoint.targetAccessStatus;
    state.latestVisiblePlanetProofReady = endpoint.visiblePlanetProofReady;
    state.latestRecommendedNextFile = endpoint.recommendedNextFile;
    state.latestRecommendedNextAction = endpoint.recommendedNextAction;
    state.updatedAt = nowIso();

    return {
      PACKET: PACKET_NAME,
      PACKET_NAME,
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: "WEST_DIAGNOSTIC_DIRECT_CHECK",
      SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",
      COMPONENT: "WEST_DIAGNOSTIC",

      CONTRACT,
      RECEIPT,
      IMPLEMENTATION_CONTRACT,
      IMPLEMENTATION_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_RECEIPT_DECK_CONTRACT,
      PREVIOUS_RECEIPT_DECK_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      UPDATED_AT: state.updatedAt,

      RUN_STATE: state.latestRunState,
      TRUST_STATE: state.latestTrustState,
      BLOCKING: false,

      WEST_DIAGNOSTIC_AUTHORITY_PATH: "HEARTH.diagnosticWest",
      WEST_DIAGNOSTIC_PRESENT: true,
      WEST_DIAGNOSTIC_STATUS: "AUTHORITY_FOUND",
      WEST_DIAGNOSTIC_RUN_EXECUTED: true,
      WEST_DIAGNOSTIC_DIRECT_METHOD: "runDiagnostic",
      WEST_DIAGNOSTIC_DIRECT_ERROR: "NONE",
      WEST_DIAGNOSTIC_CONTRACT: CONTRACT,
      WEST_DIAGNOSTIC_RECEIPT: RECEIPT,
      WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_DIAGNOSTIC_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,

      WEST_DIAGNOSTIC_RENDERED_READ_STATUS: endpoint.renderedReadStatus,
      WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS: endpoint.targetAccessStatus,
      WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY: endpoint.visiblePlanetProofReady,
      WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE: endpoint.recommendedNextFile,
      WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION: endpoint.recommendedNextAction,

      LABWEST_GATE_IS_SEPARATE_RECEIPT: "07 · LabWest Gate",
      WEST_DIAGNOSTIC_IS_SEPARATE_RECEIPT: "12 · West Diagnostic Direct",
      LABWEST_GATE_SEPARATE_FROM_WEST_DIAGNOSTIC: true,
      WEST_DIAGNOSTIC_SEPARATE_FROM_LABWEST_GATE: true,
      LABWEST_COLLAPSED_WITH_WEST_DIAGNOSTIC: false,

      RENDERED_TARGET_AUTHORITY_STATUS:
        endpoint.records.renderedTarget.status,
      RENDERED_TARGET_AUTHORITY_PATH:
        endpoint.records.renderedTarget.alias,
      RENDERED_TARGET_AUTHORITY_CONTRACT:
        endpoint.records.renderedTarget.contract,

      RUNTIME_ENDPOINT_FAMILY_STATUS:
        endpoint.records.runtimeEndpoint.status,
      RUNTIME_ENDPOINT_FAMILY_PATH:
        endpoint.records.runtimeEndpoint.alias,
      RUNTIME_ENDPOINT_FAMILY_CONTRACT:
        endpoint.records.runtimeEndpoint.contract,

      SURFACE_TRUTH_PROBE_STATUS:
        endpoint.records.surfaceTruth.status,
      SURFACE_TRUTH_PROBE_PATH:
        endpoint.records.surfaceTruth.alias,
      SURFACE_TRUTH_PROBE_CONTRACT:
        endpoint.records.surfaceTruth.contract,

      NORTH_RAIL_STATUS:
        endpoint.records.northRail.status,
      NORTH_RAIL_PATH:
        endpoint.records.northRail.alias,
      NORTH_RAIL_CONTRACT:
        endpoint.records.northRail.contract,

      SOUTH_SURFACE_POINTER_STATUS:
        endpoint.records.southPointer.status,
      SOUTH_SURFACE_POINTER_PATH:
        endpoint.records.southPointer.alias,
      SOUTH_SURFACE_POINTER_CONTRACT:
        endpoint.records.southPointer.contract,

      SOUTH_RAIL_STATUS:
        endpoint.records.southRail.status,
      SOUTH_RAIL_PATH:
        endpoint.records.southRail.alias,
      SOUTH_RAIL_CONTRACT:
        endpoint.records.southRail.contract,

      LABWEST_GATE_STATUS:
        endpoint.records.labWestGate.status,
      LABWEST_GATE_PATH:
        endpoint.records.labWestGate.alias,
      LABWEST_GATE_CONTRACT:
        endpoint.records.labWestGate.contract,

      ENDPOINT_FAMILY_EVIDENCE: clonePlain(endpoint.records),
      INPUT: clonePlain(input || {}),

      DIRECT_METHOD_SURFACE_ACTIVE: true,
      STRICT_RUNTIME_ENDPOINT_FAMILY_READER_ACTIVE: true,
      RENDERED_TARGET_AUTHORITY_PROBE_ACTIVE: true,
      CONTRADICTORY_INTERNAL_AUTHORITY_PRESERVED: false,

      NEXT_RECEIPT_RECOMMENDED: "14 · Next Move",
      NEXT_FILE: endpoint.recommendedNextFile,
      NEXT_ACTION: endpoint.recommendedNextAction,
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedKeys(report) {
    const priority = [
      "PACKET",
      "PACKET_NAME",
      "RECEIPT_LEVEL",
      "ROLE",
      "SCOPE",
      "COMPONENT",
      "CONTRACT",
      "RECEIPT",
      "IMPLEMENTATION_CONTRACT",
      "IMPLEMENTATION_RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "WEST_DIAGNOSTIC_AUTHORITY_PATH",
      "WEST_DIAGNOSTIC_PRESENT",
      "WEST_DIAGNOSTIC_STATUS",
      "WEST_DIAGNOSTIC_RUN_EXECUTED",
      "WEST_DIAGNOSTIC_DIRECT_METHOD",
      "WEST_DIAGNOSTIC_DIRECT_ERROR",
      "WEST_DIAGNOSTIC_CONTRACT",
      "WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT",
      "WEST_DIAGNOSTIC_INTERNAL_RENEWAL_CONTRACT",
      "WEST_DIAGNOSTIC_RENDERED_READ_STATUS",
      "WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY",
      "WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE",
      "WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION",
      "LABWEST_GATE_IS_SEPARATE_RECEIPT",
      "WEST_DIAGNOSTIC_IS_SEPARATE_RECEIPT",
      "LABWEST_COLLAPSED_WITH_WEST_DIAGNOSTIC",
      "RENDERED_TARGET_AUTHORITY_STATUS",
      "RUNTIME_ENDPOINT_FAMILY_STATUS",
      "SURFACE_TRUTH_PROBE_STATUS",
      "NORTH_RAIL_STATUS",
      "SOUTH_SURFACE_POINTER_STATUS",
      "LABWEST_GATE_STATUS",
      "NEXT_RECEIPT_RECOMMENDED",
      "NEXT_FILE",
      "NEXT_ACTION",
      "DO_NOT_TOUCH",
      "CANVAS_BUILD_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "PRODUCTION_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "VISUAL_PASS_CLAIMED",
      "FINAL_VISUAL_PASS_CLAIMED",
      "UPDATED_AT"
    ];

    const seen = new Set();
    return priority.concat(Object.keys(report || {})).filter((key) => {
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function composePacketText(report) {
    return orderedKeys(report)
      .map((key) => line(key, getRaw(report, key, "UNKNOWN")))
      .join("\n");
  }

  function publishReport(report) {
    state.lastReport = clonePlain(report);
    state.lastPacketText = composePacketText(report);
    state.updatedAt = nowIso();
    publishAliases({ skipReportRefresh: true });
  }

  function runDiagnostic(input = {}) {
    state.runCount += 1;

    try {
      const report = buildReport(input);
      publishReport(report);

      record("WEST_DIAGNOSTIC_DIRECT_RUN_COMPLETE", {
        renderedReadStatus: report.WEST_DIAGNOSTIC_RENDERED_READ_STATUS,
        targetAccessStatus: report.WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS,
        visiblePlanetProofReady: report.WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY,
        recommendedNextFile: report.WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE,
        recommendedNextAction: report.WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION
      });

      return clonePlain(report);
    } catch (error) {
      recordError("WEST_DIAGNOSTIC_DIRECT_RUN_FAILED", error);

      const fallback = {
        PACKET: PACKET_NAME,
        PACKET_NAME,
        RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
        ROLE: "WEST_DIAGNOSTIC_DIRECT_CHECK",
        SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",
        COMPONENT: "WEST_DIAGNOSTIC",
        CONTRACT,
        RECEIPT,
        IMPLEMENTATION_CONTRACT,
        IMPLEMENTATION_RECEIPT,
        INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT,
        VERSION,
        FILE,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        RUN_STATE: "WEST_DIAGNOSTIC_DIRECT_RUN_ERROR",
        TRUST_STATE: "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE_PRESENT_WITH_ERROR",
        BLOCKING: false,
        WEST_DIAGNOSTIC_AUTHORITY_PATH: "HEARTH.diagnosticWest",
        WEST_DIAGNOSTIC_PRESENT: true,
        WEST_DIAGNOSTIC_STATUS: "AUTHORITY_FOUND",
        WEST_DIAGNOSTIC_RUN_EXECUTED: true,
        WEST_DIAGNOSTIC_DIRECT_METHOD: "runDiagnostic",
        WEST_DIAGNOSTIC_DIRECT_ERROR: bounded(error && error.message ? error.message : error, 2000),
        WEST_DIAGNOSTIC_CONTRACT: CONTRACT,
        WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
        WEST_DIAGNOSTIC_RENDERED_READ_STATUS: "UNKNOWN",
        WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS: "UNKNOWN",
        WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY: "UNKNOWN",
        WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE: FILE,
        WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION: "REVIEW_WEST_DIAGNOSTIC_DIRECT_RUN_ERROR",
        LABWEST_GATE_IS_SEPARATE_RECEIPT: "07 · LabWest Gate",
        WEST_DIAGNOSTIC_IS_SEPARATE_RECEIPT: "12 · West Diagnostic Direct",
        LABWEST_COLLAPSED_WITH_WEST_DIAGNOSTIC: false,
        NEXT_RECEIPT_RECOMMENDED: "14 · Next Move",
        NEXT_FILE: FILE,
        NEXT_ACTION: "REVIEW_WEST_DIAGNOSTIC_DIRECT_RUN_ERROR",
        DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE",
        UPDATED_AT: nowIso(),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };

      publishReport(fallback);
      return clonePlain(fallback);
    }
  }

  function run(input = {}) {
    return runDiagnostic(input);
  }

  function inspect(input = {}) {
    return runDiagnostic(input);
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.lastReport) {
      return clonePlain(state.lastReport);
    }

    return runDiagnostic({ reason: "GET_REPORT_REFRESH" });
  }

  function getReceiptLight() {
    return {
      role: "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      westDiagnosticAuthorityPath: "HEARTH.diagnosticWest",
      westDiagnosticPresent: true,
      westDiagnosticStatus: "AUTHORITY_FOUND",
      directMethodSurfaceActive: true,
      strictRuntimeEndpointFamilyReaderActive: true,
      renderedTargetAuthorityProbeActive: true,
      westDiagnosticSeparateFromLabWest: true,
      labWestGateIsSeparateReceipt: "07 · LabWest Gate",
      westDiagnosticIsSeparateReceipt: "12 · West Diagnostic Direct",
      labWestCollapsedWithWestDiagnostic: false,

      runDiagnosticApiAvailable: true,
      runApiAvailable: true,
      inspectApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStatusApiAvailable: true,
      getStateApiAvailable: true,

      latestRunState: state.latestRunState,
      latestTrustState: state.latestTrustState,
      latestRenderedReadStatus: state.latestRenderedReadStatus,
      latestTargetAccessStatus: state.latestTargetAccessStatus,
      latestVisiblePlanetProofReady: state.latestVisiblePlanetProofReady,
      latestRecommendedNextFile: state.latestRecommendedNextFile,
      latestRecommendedNextAction: state.latestRecommendedNextAction,

      runCount: state.runCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      latestEvent: state.latestEvent,
      updatedAt: state.updatedAt || nowIso(),

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      WEST_DIAGNOSTIC_CONTRACT: CONTRACT,
      WEST_DIAGNOSTIC_RECEIPT: RECEIPT,
      WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_DIAGNOSTIC_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      WEST_DIAGNOSTIC_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      WEST_DIAGNOSTIC_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      WEST_DIAGNOSTIC_FILE: FILE,

      NORTH_RAIL_FILE,
      SOUTH_RAIL_FILE,
      SOUTH_POINTER_FILE,
      LABWEST_GATE_FILE,
      SURFACE_TRUTH_FILE,
      CANVAS_FILE,
      CANVAS_LAUNCH_FILE,
      CONTROLS_FILE,

      renderedTargetAliases: RENDERED_TARGET_ALIASES.slice(),
      runtimeEndpointAliases: RUNTIME_ENDPOINT_ALIASES.slice(),
      westPublicAliases: WEST_PUBLIC_ALIASES.slice(),
      reportObject: clonePlain(state.lastReport || {}),
      packetText: state.lastPacketText || "",
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      ...UPPER_NO_CLAIMS
    };
  }

  function getStatus() {
    return getReceiptLight();
  }

  function getState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,

      directMethodSurfaceActive: state.directMethodSurfaceActive,
      westDiagnosticAuthorityActive: state.westDiagnosticAuthorityActive,
      westDiagnosticSeparateFromLabWest: state.westDiagnosticSeparateFromLabWest,
      strictRuntimeEndpointFamilyReaderActive: state.strictRuntimeEndpointFamilyReaderActive,
      renderedTargetAuthorityProbeActive: state.renderedTargetAuthorityProbeActive,

      latestRunState: state.latestRunState,
      latestTrustState: state.latestTrustState,
      latestRenderedReadStatus: state.latestRenderedReadStatus,
      latestTargetAccessStatus: state.latestTargetAccessStatus,
      latestVisiblePlanetProofReady: state.latestVisiblePlanetProofReady,
      latestRecommendedNextFile: state.latestRecommendedNextFile,
      latestRecommendedNextAction: state.latestRecommendedNextAction,

      runCount: state.runCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      latestEvent: state.latestEvent,
      updatedAt: state.updatedAt || nowIso(),

      ...NO_CLAIMS
    };
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    try {
      const ds = doc.documentElement.dataset;

      ds.hearthDiagnosticWestLoaded = "true";
      ds.hearthDiagnosticWestContract = CONTRACT;
      ds.hearthDiagnosticWestReceipt = RECEIPT;
      ds.hearthDiagnosticWestImplementationContract = IMPLEMENTATION_CONTRACT;
      ds.hearthDiagnosticWestInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
      ds.hearthDiagnosticWestFile = FILE;

      ds.hearthDiagnosticWestAuthorityPath = "HEARTH.diagnosticWest";
      ds.hearthDiagnosticWestPresent = "true";
      ds.hearthDiagnosticWestStatus = "AUTHORITY_FOUND";
      ds.hearthDiagnosticWestDirectMethodSurfaceActive = "true";
      ds.hearthDiagnosticWestRunDiagnosticApiAvailable = "true";
      ds.hearthDiagnosticWestGetReportApiAvailable = "true";
      ds.hearthDiagnosticWestGetReceiptApiAvailable = "true";

      ds.hearthDiagnosticWestRenderedReadStatus = state.latestRenderedReadStatus;
      ds.hearthDiagnosticWestTargetAccessStatus = state.latestTargetAccessStatus;
      ds.hearthDiagnosticWestVisiblePlanetProofReady = String(state.latestVisiblePlanetProofReady);
      ds.hearthDiagnosticWestRecommendedNextFile = state.latestRecommendedNextFile;
      ds.hearthDiagnosticWestRecommendedNextAction = state.latestRecommendedNextAction;

      ds.hearthDiagnosticWestLabWestSeparateReceipt = "07 · LabWest Gate";
      ds.hearthDiagnosticWestWestSeparateReceipt = "12 · West Diagnostic Direct";
      ds.hearthDiagnosticWestLabWestCollapsedWithWest = "false";

      ds.hearthDiagnosticWestProductionMutationAuthorized = "false";
      ds.hearthDiagnosticWestCanvasBuildAuthorized = "false";
      ds.hearthDiagnosticWestCanvasReleaseAuthorized = "false";
      ds.hearthDiagnosticWestCanvasRepairAuthorized = "false";
      ds.hearthDiagnosticWestRuntimeRestartAuthorized = "false";
      ds.hearthDiagnosticWestVisualPassClaimed = "false";
      ds.hearthDiagnosticWestGeneratedImage = "false";
      ds.hearthDiagnosticWestGraphicBox = "false";
      ds.hearthDiagnosticWestWebgl = "false";
    } catch (_error) {
      return false;
    }

    return true;
  }

  function publishAliases(options = {}) {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    WEST_PUBLIC_ALIASES.forEach((alias) => {
      setPath(alias, api);
    });

    const receipt = getReceiptLight();
    state.receiptPublishCount += 1;

    root.HEARTH_DIAGNOSTIC_WEST_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_WEST_RUNTIME_ENDPOINT_FAMILY_READER_RECEIPT = receipt;

    root.HEARTH.diagnosticWestReceipt = receipt;
    root.HEARTH.diagnosticRailWestReceipt = receipt;
    root.HEARTH.diagnosticWestRenderedTargetProbeReceipt = receipt;
    root.HEARTH.diagnosticWestRuntimeEndpointFamilyReaderReceipt = receipt;

    root.DEXTER_LAB.hearthDiagnosticWestReceipt = receipt;
    root.DEXTER_LAB.hearthDiagnosticRailWestReceipt = receipt;

    root.HEARTH_DIAGNOSTIC_WEST_REPORT = clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_WEST_PACKET_TEXT = state.lastPacketText || "";

    root.__HEARTH_DIAGNOSTIC_WEST_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_WEST_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_RECEIPT__ = RECEIPT;
    root.__HEARTH_DIAGNOSTIC_WEST_IMPLEMENTATION_CONTRACT__ = IMPLEMENTATION_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_DIRECT_METHOD_SURFACE_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_WEST_LABWEST_COLLAPSED_WITH_WEST__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_WEBGL__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_VISUAL_PASS_CLAIMED__ = false;

    if (!options.skipReportRefresh) {
      updateDataset();
    }

    state.aliasPublishCount += 1;
    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousReceiptDeckContract: PREVIOUS_RECEIPT_DECK_CONTRACT,
    previousReceiptDeckReceipt: PREVIOUS_RECEIPT_DECK_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    role: "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE",
    authority:
      "READ_ONLY_RENDERED_TARGET_AUTHORITY_PROBE_AND_STRICT_RUNTIME_ENDPOINT_FAMILY_READER",
    component: "WEST_DIAGNOSTIC",
    publicAuthorityPath: "HEARTH.diagnosticWest",

    labWestGateIsSeparateReceipt: "07 · LabWest Gate",
    westDiagnosticIsSeparateReceipt: "12 · West Diagnostic Direct",
    labWestCollapsedWithWestDiagnostic: false,

    northRailFile: NORTH_RAIL_FILE,
    southRailFile: SOUTH_RAIL_FILE,
    southPointerFile: SOUTH_POINTER_FILE,
    labWestGateFile: LABWEST_GATE_FILE,
    surfaceTruthFile: SURFACE_TRUTH_FILE,
    canvasFile: CANVAS_FILE,
    canvasLaunchFile: CANVAS_LAUNCH_FILE,
    controlsFile: CONTROLS_FILE,

    runDiagnostic,
    run,
    inspect,
    getReport,
    getReceipt,
    getReceiptLight,
    getStatus,
    getState,
    publishAliases,
    updateDataset,

    runDiagnosticApiAvailable: true,
    runApiAvailable: true,
    inspectApiAvailable: true,
    getReportApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,
    getStatusApiAvailable: true,
    getStateApiAvailable: true,

    directMethodSurfaceActive: true,
    strictRuntimeEndpointFamilyReaderActive: true,
    renderedTargetAuthorityProbeActive: true,
    westDiagnosticSeparateFromLabWest: true,
    contradictoryInternalAuthorityPreserved: false,

    ownsLabWestGate: false,
    ownsNorthFinalArbitration: false,
    ownsNorthF21Latch: false,
    ownsLabSouthF8ProofProduction: false,
    ownsSouthSurfacePointerSidecar: false,
    ownsSurfaceTruthDefinition: false,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasBuild: false,
    ownsCanvasRepair: false,
    ownsCanvasRelease: false,
    ownsProductionMutation: false,
    ownsRouteConductorMutation: false,
    ownsControls: false,
    ownsRuntimeRestart: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get report() {
      return getReport({ refresh: false });
    },

    get receiptObject() {
      return getReceiptLight();
    }
  });

  state.updatedAt = nowIso();
  publishAliases();
  updateDataset();

  record("WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE_LOADED", {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    publicAuthorityPath: "HEARTH.diagnosticWest",
    directMethods: [
      "runDiagnostic",
      "run",
      "inspect",
      "getReport",
      "getReceipt",
      "getReceiptLight",
      "getStatus",
      "getState"
    ],
    labWestCollapsedWithWestDiagnostic: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    productionMutationAuthorized: false
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
