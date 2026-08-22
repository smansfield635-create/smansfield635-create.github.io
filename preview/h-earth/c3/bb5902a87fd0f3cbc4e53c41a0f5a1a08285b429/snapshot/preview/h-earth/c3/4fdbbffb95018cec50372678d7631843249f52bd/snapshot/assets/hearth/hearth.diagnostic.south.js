// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_CONSUMPTION_PACKET_MEANING_TNT_v12
// Full-file replacement.
// Diagnostic South Rail / packet output handoff only.
//
// Purpose:
// - Preserve the public v10 South packet-output contract expected by the diagnostic route.
// - Preserve v11 receipt segregation, duplicate-standard collapse, compact manifest,
//   and raw-evidence-by-reference behavior.
// - Add v12 South sidecar lens consumption without promoting sidecars into top-level
//   receiver receipt participants.
// - Consume supporting South sidecars internally as lenses during South packet meaning.
// - Allow South’s conclusion to be modified by sidecar evidence when the sidecar
//   clarifies the inspected surface, Canvas blame gate, or packet meaning.
// - Keep the sidecar out of the primary receipt field unless South includes a compact
//   South-owned lens summary.
// - Preserve raw sidecar detail by reference only.
// - Preserve read-only diagnostic behavior.
//
// Does not own:
// - diagnostic North final arbitration
// - North grammar
// - West derivative map
// - East served-source truth
// - production mutation
// - route conductor mutation
// - controls mutation
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - Canvas release
// - runtime restart
// - terrain/material/hydrology/elevation truth
// - final visual pass
// - F13/F21/F55 claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_RECEIPT_v10";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_CONSUMPTION_PACKET_MEANING_TNT_v12";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_CONSUMPTION_PACKET_MEANING_RECEIPT_v12";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_DUPLICATE_STANDARD_COLLAPSE_TNT_v11";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATION_DUPLICATE_STANDARD_COLLAPSE_RECEIPT_v11";

  const BASELINE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10";
  const BASELINE_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_RECEIPT_v10";

  const VERSION =
    "2026-06-08.hearth-diagnostic-south-sidecar-lens-consumption-packet-meaning-v12";

  const FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const SOUTH_SURFACE_POINTER_FILE =
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const NORTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const EAST_RAIL_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const WEST_RAIL_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const SURFACE_TRUTH_PROBE_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_PACKET_MEANING_PACKET_v12";
  const MANIFEST_PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_COMPACT_MANIFEST_PACKET_v12";
  const SEGREGATION_PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SEGREGATED_RECEIPT_INDEX_PACKET_v12";
  const DUPLICATE_COLLAPSE_PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_DUPLICATE_STANDARD_COLLAPSE_REPORT_PACKET_v12";
  const SIDECAR_LENS_PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_CONSUMPTION_REPORT_PACKET_v12";

  const RAW_STORE_LIMIT = 12;
  const MAX_FLATTEN_NODES = 1500;
  const MAX_PACKET_TEXT_CHARS = 12000;
  const MAX_COMPACT_MANIFEST_CHARS = 4200;
  const MAX_SUPER_COMPACT_CHARS = 1400;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedBySouth: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedBySouth: false,
    f55ClaimedBySouth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    macroWestReleaseAuthorized: false,
    syntheticActivationAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_ELIGIBLE_FOR_CANVAS: false,
    F13_CLAIMED_BY_SOUTH: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_SUBMITTED_TO_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_SOUTH: false,
    F55_CLAIMED_BY_SOUTH: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    MACRO_WEST_RELEASE_AUTHORIZED: false,
    SYNTHETIC_ACTIVATION_AUTHORIZED: false
  });

  const CANONICAL_NO_CLAIM_FIELDS = Object.freeze([
    "PRODUCTION_MUTATION_AUTHORIZED",
    "HEARTH_REPAIR_AUTHORIZED",
    "ROUTE_REPAIR_AUTHORIZED",
    "ROUTE_CONDUCTOR_MUTATION_AUTHORIZED",
    "CONTROL_MUTATION_AUTHORIZED",
    "CANVAS_DRAWING_AUTHORIZED",
    "CANVAS_CREATION_AUTHORIZED",
    "CANVAS_REPAIR_AUTHORIZED",
    "CANVAS_RELEASE_AUTHORIZED",
    "RUNTIME_RESTART_AUTHORIZED",
    "MACRO_WEST_RELEASE_AUTHORIZED",
    "SYNTHETIC_ACTIVATION_AUTHORIZED",
    "F13_CLAIMED",
    "F13_ELIGIBLE_FOR_CANVAS",
    "F13_CLAIMED_BY_SOUTH",
    "F21_ELIGIBLE_FOR_NORTH",
    "F21_SUBMITTED_TO_NORTH",
    "F21_CLAIMED",
    "F21_CLAIMED_BY_DIAGNOSTIC_RAIL",
    "F21_CLAIMED_BY_SOUTH",
    "F55_CLAIMED_BY_SOUTH",
    "READY_TEXT_PERMISSION_GRANTED",
    "READY_TEXT_ALLOWED",
    "READY_TEXT_CLAIMED",
    "READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL",
    "VISUAL_PASS_CLAIMED",
    "FINAL_VISUAL_PASS_CLAIMED",
    "GENERATED_IMAGE",
    "GRAPHIC_BOX",
    "WEBGL",
    "webGL",
    "webgl",
    "productionMutationAuthorized",
    "hearthRepairAuthorized",
    "routeRepairAuthorized",
    "routeConductorMutationAuthorized",
    "controlMutationAuthorized",
    "canvasDrawingAuthorized",
    "canvasCreationAuthorized",
    "canvasRepairAuthorized",
    "canvasReleaseAuthorized",
    "runtimeRestartAuthorized",
    "macroWestReleaseAuthorized",
    "syntheticActivationAuthorized",
    "f13Claimed",
    "f13EligibleForCanvas",
    "f13ClaimedBySouth",
    "f21EligibleForNorth",
    "f21SubmittedToNorth",
    "f21Claimed",
    "f21ClaimedByDiagnosticRail",
    "f21ClaimedBySouth",
    "f55ClaimedBySouth",
    "readyTextPermissionGranted",
    "readyTextAllowed",
    "readyTextClaimed",
    "readyTextClaimedByDiagnosticRail",
    "visualPassClaimed",
    "finalVisualPassClaimed",
    "generatedImage",
    "graphicBox"
  ]);

  const ROUTE_METADATA_FIELDS = Object.freeze([
    "PACKET_NAME",
    "CONTRACT",
    "RECEIPT",
    "PREVIOUS_CONTRACT",
    "BASELINE_CONTRACT",
    "VERSION",
    "TARGET_ROUTE",
    "DIAGNOSTIC_ROUTE",
    "ROUTE",
    "FILE",
    "DIAGNOSTIC_TIMESTAMP",
    "UPDATED_AT",
    "GENERATED_AT"
  ]);

  const GAUGE_RECEIPT_LAW_FIELDS = Object.freeze([
    "RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE",
    "GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE",
    "GAUGES_DO_NOT_REPLACE_RECEIPTS",
    "GAUGES_AUTHORIZE_REPAIR",
    "SCREENSHOT_SAFE_GAUGE_SURFACE_ACTIVE",
    "SCREENSHOT_SAFE_GAUGE_SURFACE_REQUIRED"
  ]);

  const SECTION_DEFINITIONS = Object.freeze([
    {
      id: "CONTROL_GATE",
      title: "Control Gate / Receiver",
      match: [
        "CONTROL_GATE",
        "RECEIVER",
        "RUN_BUTTON",
        "ALIGNMENT_RUN",
        "ROUTE_RECEIVER"
      ]
    },
    {
      id: "LAB_NORTH_AND_LABWEST",
      title: "Lab North / LabWest Construct",
      match: [
        "LAB_NORTH",
        "LABWEST",
        "LAB_RUNTIME",
        "GRAMMAR",
        "DERIVATIVE_CONSTRUCT",
        "LAB_WEST"
      ]
    },
    {
      id: "NORTH_DIAGNOSTIC_TRACK",
      title: "North Diagnostic Track",
      match: [
        "NORTH_RAIL",
        "NORTH_VERDICT",
        "NORTH_RUN",
        "DIAGNOSTIC_RAIL",
        "CHRONOLOGY",
        "JUDGE_NORTH"
      ]
    },
    {
      id: "EAST_SOURCE_READ",
      title: "East Source Read",
      match: ["EAST_RAIL", "PROBE_EAST", "EAST_SOURCE", "SERVED_SOURCE"]
    },
    {
      id: "WEST_RENDERED_READ",
      title: "West Rendered Read",
      match: ["WEST_RAIL", "PROBE_WEST", "WEST_RENDERED", "RENDERED_TARGET"]
    },
    {
      id: "SOUTH_PACKET_OUTPUT",
      title: "South Packet Output",
      match: [
        "SOUTH_RAIL",
        "PROBE_SOUTH",
        "SOUTH_PACKET",
        "SOUTH_OUTPUT",
        "PACKET_MEANING",
        "COMPACT_MANIFEST",
        "SEGREGATED"
      ]
    },
    {
      id: "SOUTH_SIDECAR_LENSES",
      title: "South Sidecar Lenses",
      match: [
        "SIDECAR",
        "SOUTH_SURFACE_POINTER",
        "SURFACE_POINTER",
        "CANVAS_FEED_CLASSIFIER",
        "INSPECTED_SURFACE_CLASS",
        "CANVAS_BLAME_GATE"
      ]
    },
    {
      id: "SURFACE_TRUTH_CONTRACTS",
      title: "Surface Truth / Canvas Contract Definitions",
      match: [
        "SURFACE_TRUTH",
        "CANVAS_SURFACE",
        "CANVAS_TRUTH",
        "CANVAS_RECT",
        "CANVAS_PIXEL",
        "CANONICAL_MOUNT",
        "CANONICAL_CANVAS",
        "CONTRACT_DEFINITION"
      ]
    },
    {
      id: "PROBE_NETWORK",
      title: "Probe Network",
      match: [
        "PROBE",
        "PROBE_NETWORK",
        "PROBE_PRESENT",
        "PROBE_RECEIPT",
        "PROBE_MISSING"
      ]
    },
    {
      id: "CANVAS_CYCLE_BOUNDARY",
      title: "Canvas Cycle Boundary",
      match: [
        "CANVAS_CYCLE",
        "CHAPEL",
        "BISHOP",
        "PRIEST",
        "HEX_SURFACE",
        "CANVAS_HUB"
      ]
    },
    {
      id: "CONTAINER_COLLAPSE_RISK",
      title: "Container Collapse Risk",
      match: [
        "CONTAINER",
        "COLLAPSE",
        "BORROWED_CONTRACT",
        "SUBSTITUTION",
        "PARENT_CHILD",
        "SIBLING"
      ]
    },
    {
      id: "DUTY_LOAD_MALPRACTICE",
      title: "Duty Load / Diagnostic Malpractice",
      match: [
        "DUTY",
        "MALPRACTICE",
        "SELF_MEASUREMENT",
        "SELF_DUTY",
        "OVERLOAD"
      ]
    },
    {
      id: "CONSTRUCTION_READINESS",
      title: "Construction Readiness",
      match: [
        "CONSTRUCTION",
        "READINESS",
        "DERIVATIVE_MAP",
        "CANVAS_BUILD",
        "WEST_FORWARD"
      ]
    },
    {
      id: "SPECIFIC_RECEIPTS",
      title: "Specific Receipt Field",
      match: [
        "specificReceipts",
        "SPECIFIC_RECEIPT",
        "RECEIPT_FIELD",
        "receiptPresent",
        "receiptStatus"
      ]
    },
    {
      id: "GAUGE_VARIANCE",
      title: "Collective Gauge Variance",
      match: ["gaugeVariance", "GAUGE_VARIANCE", "GAUGE", "VARIANCE", "SCORE"]
    },
    {
      id: "ERRORS_AND_EXCEPTIONS",
      title: "Errors / Exceptions",
      match: ["ERROR", "EXCEPTION", "FAILED", "LOAD_FAILED", "UNAVAILABLE"]
    },
    {
      id: "UNCLASSIFIED",
      title: "Unclassified Evidence",
      match: []
    }
  ]);

  const SOUTH_SURFACE_POINTER_ALIASES = Object.freeze([
    "HEARTH.diagnosticSouthSurfacePointer",
    "HEARTH.diagnosticSurfacePointerSouth",
    "HEARTH.diagnosticSouthBishopSurfacePointer",
    "HEARTH.diagnosticBishopSurfacePointerSouth",
    "HEARTH.diagnosticSouthSurfaceClassifier",
    "HEARTH.diagnosticCanvasFeedClassifierSouth",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SURFACE_POINTER_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_CLASSIFIER",
    "HEARTH_DIAGNOSTIC_CANVAS_FEED_CLASSIFIER_SOUTH",
    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSurfacePointerSouth",
    "DEXTER_LAB.hearthDiagnosticSouthSurfaceClassifier",
    "DEXTER_LAB.hearthDiagnosticCanvasFeedClassifierSouth"
  ]);

  const RECEIVER_PACKET_ALIASES = Object.freeze([
    "HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET",
    "HEARTH.diagnosticGaugeVarianceReceiver.alignmentPacket",
    "HEARTH.diagnosticRouteReceiver.alignmentPacket"
  ]);

  const RECEIVER_TEXT_ALIASES = Object.freeze([
    "HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET_TEXT",
    "HEARTH.diagnosticGaugeVarianceReceiver.packetText",
    "HEARTH.diagnosticRouteReceiver.packetText"
  ]);

  const RECEIVER_API_ALIASES = Object.freeze([
    "HEARTH.diagnosticGaugeVarianceReceiver",
    "HEARTH.diagnosticConstructAlignmentGaugeReceiver",
    "HEARTH.diagnosticRouteReceiver",
    "HEARTH_DIAGNOSTIC_GAUGE_VARIANCE_RECEIVER",
    "HEARTH_DIAGNOSTIC_CONSTRUCT_ALIGNMENT_GAUGE_RECEIVER",
    "HEARTH_DIAGNOSTIC_ROUTE_RECEIVER",
    "DEXTER_LAB.hearthDiagnosticGaugeVarianceReceiver",
    "DEXTER_LAB.hearthDiagnosticRouteReceiver"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
    baselineInternalRenewalReceipt: BASELINE_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "SOUTH_PACKET_OUTPUT_HANDOFF",
    profileClass: "RECEIPT_SEGREGATION_SIDECAR_LENS_PACKET_MEANING_CARRIER",
    cyclePosition: "DIAGNOSTIC_TRACK_SOUTH_PACKET_OUTPUT_STAGE",

    loaded: true,
    southReceiptSegregationActive: true,
    southDuplicateStandardCollapseActive: true,
    southCopyableCompactManifestActive: true,
    southRawEvidenceReferenceStoreActive: true,
    southSidecarProcessingActive: true,
    southSidecarLensConsumptionActive: true,
    southSurfacePointerSidecarExpected: true,
    sidecarsArePrimaryReceiptParticipants: false,
    sidecarsAreInternalSouthProcessLenses: true,

    runCount: 0,
    receiptPublishCount: 0,
    aliasPublishCount: 0,
    rawStoreCount: 0,
    latestRawRef: "NONE",
    latestRunAt: "",
    latestEvent: "SOUTH_RAIL_LOADED",
    updatedAt: "",
    events: [],
    errors: [],

    rawStore: [],
    latestNormalizedInput: null,
    latestSegregatedReceiptIndex: null,
    latestDuplicateStandardCollapseReport: null,
    latestSidecarLensReport: null,
    latestPacket: null,
    latestReport: null,
    latestPacketText: "",
    latestCompactManifestText: "COMPACT_MANIFEST=NOT_RUN",
    latestSuperCompactManifestText: "SOUTH_PACKET_OUTPUT=NOT_RUN",
    latestConclusion: null,

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
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, limit);
  }

  function compactInline(value, limit = 4000) {
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

  function safeJson(value, fallback = "{}", limit = 50000) {
    try {
      return JSON.stringify(value).slice(0, limit);
    } catch (_error) {
      return fallback;
    }
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((item) => packetValue(item, "")).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      return compactInline(safeJson(value, fallback, 20000), 20000) || fallback;
    }

    return compactInline(value, 8000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") {
      return "true";
    }
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") {
      return "false";
    }
    return fallback;
  }

  function boolValue(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") {
      return true;
    }
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") {
      return false;
    }
    return fallback;
  }

  function numberValue(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = compactInline(value, 6000);
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

    const lower = safeString(key).toLowerCase();

    try {
      for (const candidate of Object.keys(source)) {
        if (candidate.toLowerCase() === lower) {
          const value = source[candidate];
          return value === undefined || value === null ? fallback : value;
        }
      }
    } catch (_error) {}

    return fallback;
  }

  function readField(source, keys, fallback = "") {
    if (!source || (!isObject(source) && !isFunction(source))) return fallback;

    for (const key of keys || []) {
      try {
        const direct = source[key];
        if (direct !== undefined && direct !== null && direct !== "") return direct;
      } catch (_error) {}

      const lower = safeString(key).toLowerCase();
      try {
        for (const candidate of Object.keys(source)) {
          if (candidate.toLowerCase() === lower) {
            const value = source[candidate];
            if (value !== undefined && value !== null && value !== "") return value;
          }
        }
      } catch (_error) {}
    }

    return fallback;
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
    const parts = safeString(path).replace(/^window\./, "").split(".");
    if (!parts.length) return false;

    let cursor = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!part) continue;
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value !== null && value !== undefined) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "SOUTH_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 120);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SOUTH_ERROR"),
      message: bounded(error && error.message ? error.message : error, 2000),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 60);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function tryParseJson(text) {
    const raw = bounded(text, 100000);
    if (!raw) return null;

    if (!/^\s*[\[{]/.test(raw)) return null;

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function parseScalar(value) {
    const text = bounded(value, 100000);

    if (text === "true") return true;
    if (text === "false") return false;
    if (text === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);

    const json = tryParseJson(text);
    if (json !== null) return json;

    return text;
  }

  function parsePacketText(text) {
    const output = {};
    const raw = safeString(text);
    const lines = raw.split(/\n+/);

    for (const sourceLine of lines) {
      const trimmed = sourceLine.trim();
      if (!trimmed) continue;

      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;

      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!key) continue;

      output[key] = parseScalar(value);
    }

    return output;
  }

  function flattenObject(value, options = {}) {
    const maxDepth = numberValue(options.maxDepth, 8);
    const maxNodes = numberValue(options.maxNodes, MAX_FLATTEN_NODES);
    const out = [];
    const seen = new WeakSet();
    let truncated = false;

    function walk(node, path, depth) {
      if (out.length >= maxNodes) {
        truncated = true;
        return;
      }

      if (node === undefined) return;

      if (node === null || typeof node !== "object") {
        out.push({
          path: path || "ROOT",
          key: path ? path.split(".").pop() : "ROOT",
          value: node,
          valueText: packetValue(node, ""),
          type: typeof node
        });
        return;
      }

      if (seen.has(node)) {
        out.push({
          path: path || "ROOT",
          key: path ? path.split(".").pop() : "ROOT",
          value: "[Circular]",
          valueText: "[Circular]",
          type: "circular"
        });
        return;
      }

      seen.add(node);

      if (depth >= maxDepth) {
        out.push({
          path: path || "ROOT",
          key: path ? path.split(".").pop() : "ROOT",
          value: Array.isArray(node) ? `[Array:${node.length}]` : "[Object]",
          valueText: Array.isArray(node) ? `[Array:${node.length}]` : "[Object]",
          type: Array.isArray(node) ? "array" : "object"
        });
        return;
      }

      if (Array.isArray(node)) {
        out.push({
          path: path || "ROOT",
          key: path ? path.split(".").pop() : "ROOT",
          value: `[Array:${node.length}]`,
          valueText: `[Array:${node.length}]`,
          type: "array"
        });

        const limit = Math.min(node.length, 80);
        for (let index = 0; index < limit; index += 1) {
          walk(node[index], `${path || "ROOT"}[${index}]`, depth + 1);
        }

        if (node.length > limit) {
          truncated = true;
          out.push({
            path: `${path || "ROOT"}[TRUNCATED]`,
            key: "TRUNCATED",
            value: node.length - limit,
            valueText: String(node.length - limit),
            type: "truncated-array"
          });
        }

        return;
      }

      const keys = Object.keys(node);
      out.push({
        path: path || "ROOT",
        key: path ? path.split(".").pop() : "ROOT",
        value: `[Object:${keys.length}]`,
        valueText: `[Object:${keys.length}]`,
        type: "object"
      });

      for (const key of keys) {
        walk(node[key], path ? `${path}.${key}` : key, depth + 1);
        if (out.length >= maxNodes) {
          truncated = true;
          break;
        }
      }
    }

    walk(value, "", 0);

    return {
      items: out,
      truncated,
      count: out.length
    };
  }

  function readReceiverApiPacket() {
    const apiFound = firstGlobal(RECEIVER_API_ALIASES);
    const receiver = apiFound.value;

    if (receiver && isFunction(receiver.getAlignmentPacket)) {
      try {
        const value = receiver.getAlignmentPacket();
        if (isObject(value)) {
          return {
            source: `${apiFound.path}.getAlignmentPacket`,
            rawObject: clonePlain(value),
            rawText: "",
            sourceType: "receiver-api-object"
          };
        }
      } catch (error) {
        recordError("SOUTH_RECEIVER_GET_ALIGNMENT_PACKET_FAILED", error, {
          source: apiFound.path
        });
      }
    }

    if (receiver && isFunction(receiver.getPacket)) {
      try {
        const value = receiver.getPacket();
        if (isObject(value)) {
          return {
            source: `${apiFound.path}.getPacket`,
            rawObject: clonePlain(value),
            rawText: "",
            sourceType: "receiver-api-object"
          };
        }
      } catch (error) {
        recordError("SOUTH_RECEIVER_GET_PACKET_FAILED", error, {
          source: apiFound.path
        });
      }
    }

    if (receiver && isFunction(receiver.getPacketText)) {
      try {
        const value = receiver.getPacketText();
        if (value) {
          return {
            source: `${apiFound.path}.getPacketText`,
            rawObject: parsePacketText(value),
            rawText: safeString(value),
            sourceType: "receiver-api-text"
          };
        }
      } catch (error) {
        recordError("SOUTH_RECEIVER_GET_PACKET_TEXT_FAILED", error, {
          source: apiFound.path
        });
      }
    }

    if (receiver && isFunction(receiver.getCompactSummary)) {
      try {
        const value = receiver.getCompactSummary();
        if (value) {
          return {
            source: `${apiFound.path}.getCompactSummary`,
            rawObject: parsePacketText(value),
            rawText: safeString(value),
            sourceType: "receiver-api-compact-text"
          };
        }
      } catch (error) {
        recordError("SOUTH_RECEIVER_GET_COMPACT_SUMMARY_FAILED", error, {
          source: apiFound.path
        });
      }
    }

    const packetFound = firstGlobal(RECEIVER_PACKET_ALIASES);
    if (isObject(packetFound.value)) {
      return {
        source: packetFound.path,
        rawObject: clonePlain(packetFound.value),
        rawText: "",
        sourceType: "global-packet-object"
      };
    }

    const textFound = firstGlobal(RECEIVER_TEXT_ALIASES);
    if (textFound.value) {
      return {
        source: textFound.path,
        rawObject: parsePacketText(textFound.value),
        rawText: safeString(textFound.value),
        sourceType: "global-packet-text"
      };
    }

    return {
      source: "NONE",
      rawObject: {},
      rawText: "",
      sourceType: "none"
    };
  }

  function normalizeInput(input = {}) {
    if (typeof input === "string") {
      const parsed = parsePacketText(input);
      return {
        source: "EXPLICIT_TEXT_INPUT",
        rawObject: parsed,
        rawText: input,
        sourceType: "explicit-text",
        supplied: true
      };
    }

    if (isObject(input)) {
      if (isObject(input.packet)) {
        return {
          source: "EXPLICIT_PACKET_INPUT",
          rawObject: clonePlain(input.packet),
          rawText: safeString(input.packetText || ""),
          sourceType: "explicit-packet",
          supplied: true
        };
      }

      if (isObject(input.report)) {
        return {
          source: "EXPLICIT_REPORT_INPUT",
          rawObject: clonePlain(input.report),
          rawText: safeString(input.packetText || ""),
          sourceType: "explicit-report",
          supplied: true
        };
      }

      if (isObject(input.REPORT_OBJECT)) {
        return {
          source: "EXPLICIT_REPORT_OBJECT_INPUT",
          rawObject: clonePlain(input.REPORT_OBJECT),
          rawText: safeString(input.packetText || ""),
          sourceType: "explicit-report-object",
          supplied: true
        };
      }

      if (typeof input.packetText === "string") {
        return {
          source: "EXPLICIT_PACKET_TEXT_FIELD_INPUT",
          rawObject: parsePacketText(input.packetText),
          rawText: input.packetText,
          sourceType: "explicit-packet-text-field",
          supplied: true
        };
      }

      const meaningfulKeys = Object.keys(input).filter((key) => {
        return ![
          "refresh",
          "reason",
          "diagnosticTimestamp",
          "sidecarSurfacePointerReport",
          "sidecarLensReport"
        ].includes(key);
      });

      if (meaningfulKeys.length > 0) {
        return {
          source: "EXPLICIT_OBJECT_INPUT",
          rawObject: clonePlain(input),
          rawText: "",
          sourceType: "explicit-object",
          supplied: true
        };
      }
    }

    return {
      ...readReceiverApiPacket(),
      supplied: false
    };
  }

  function classifyReceiptWeight(text, object) {
    const textLength = safeString(text).length;
    const objectTextLength = safeJson(object, "", 250000).length;
    const size = Math.max(textLength, objectTextLength);

    if (size <= 3000) return "RECEIPT_WEIGHT_SMALL";
    if (size <= 12000) return "RECEIPT_WEIGHT_MEDIUM";
    if (size <= 50000) return "RECEIPT_WEIGHT_LARGE";
    if (size <= 120000) return "RECEIPT_WEIGHT_OVERSIZED";
    return "RECEIPT_WEIGHT_UNCOPYABLE";
  }

  function assignSection(path, valueText) {
    const combined = `${path} ${valueText}`.toUpperCase();

    for (const section of SECTION_DEFINITIONS) {
      if (section.id === "UNCLASSIFIED") continue;
      for (const needle of section.match) {
        if (combined.includes(String(needle).toUpperCase())) return section.id;
      }
    }

    return "UNCLASSIFIED";
  }

  function makeSectionShell() {
    const sections = {};
    for (const def of SECTION_DEFINITIONS) {
      sections[def.id] = {
        id: def.id,
        title: def.title,
        itemCount: 0,
        samplePaths: [],
        sampleValues: [],
        status: "EMPTY"
      };
    }
    return sections;
  }

  function summarizeSpecificReceipts(rawObject) {
    const specific = getRaw(rawObject, "specificReceipts", null);
    if (!isObject(specific)) return null;

    const entries = Object.keys(specific).map((id) => {
      const item = specific[id] || {};
      const receipt = getRaw(item, "receipt", null);
      const packet = isObject(receipt) ? getRaw(receipt, "packet", receipt) : null;

      return {
        id,
        title: firstKnown(getRaw(item, "title", ""), id),
        file: firstKnown(getRaw(item, "file", ""), "UNKNOWN"),
        present: boolValue(getRaw(item, "present", false), false),
        status: firstKnown(getRaw(item, "status", ""), "UNKNOWN"),
        observedPath: firstKnown(getRaw(item, "observedPath", ""), "UNKNOWN"),
        receiptPresent: boolValue(getRaw(item, "receiptPresent", false), false),
        receiptStatus: firstKnown(getRaw(item, "receiptStatus", ""), "UNKNOWN"),
        contract: firstKnown(
          getRaw(packet || {}, "CONTRACT", ""),
          getRaw(packet || {}, "contract", ""),
          getRaw(item, "expectedContract", ""),
          "UNKNOWN"
        ),
        internalRenewalContract: firstKnown(
          getRaw(packet || {}, "INTERNAL_RENEWAL_CONTRACT", ""),
          getRaw(packet || {}, "internalRenewalContract", ""),
          "UNKNOWN"
        )
      };
    });

    return {
      count: entries.length,
      presentCount: entries.filter((entry) => entry.present).length,
      receiptPresentCount: entries.filter((entry) => entry.receiptPresent).length,
      missingCount: entries.filter((entry) => !entry.present).length,
      entries
    };
  }

  function summarizeGaugeVariance(rawObject) {
    const gauges = getRaw(rawObject, "gaugeVariance", null);
    if (!isObject(gauges)) return null;

    const entries = Object.keys(gauges).map((id) => {
      const gauge = gauges[id] || {};
      return {
        id,
        title: firstKnown(getRaw(gauge, "title", ""), id),
        status: firstKnown(getRaw(gauge, "status", ""), "UNKNOWN"),
        score: numberValue(getRaw(gauge, "score", 0), 0),
        variance: numberValue(getRaw(gauge, "variance", 0), 0),
        varianceClass: firstKnown(getRaw(gauge, "varianceClass", ""), "UNKNOWN"),
        evidence: firstKnown(getRaw(gauge, "evidence", ""), "UNKNOWN"),
        missing: firstKnown(getRaw(gauge, "missing", ""), "NONE")
      };
    });

    return {
      count: entries.length,
      blockedCount: entries.filter((entry) => /BLOCKED/i.test(entry.status)).length,
      partialCount: entries.filter((entry) => /PARTIAL/i.test(entry.status)).length,
      highVarianceCount: entries.filter((entry) => /HIGH_VARIANCE/i.test(entry.varianceClass)).length,
      entries
    };
  }

  function segregateReceipt(normalized) {
    const rawObject = normalized.rawObject || {};
    const rawText = normalized.rawText || "";
    const flattened = flattenObject(rawObject);
    const sections = makeSectionShell();

    for (const item of flattened.items) {
      const sectionId = assignSection(item.path, item.valueText);
      const section = sections[sectionId] || sections.UNCLASSIFIED;

      section.itemCount += 1;
      if (section.samplePaths.length < 18) section.samplePaths.push(item.path);
      if (section.sampleValues.length < 10 && item.type !== "object" && item.type !== "array") {
        section.sampleValues.push(`${item.path}=${compactInline(item.valueText, 300)}`);
      }
      section.status = "PRESENT";
    }

    if (rawText) {
      const parsedLines = rawText.split(/\n+/).filter(Boolean);
      const section = sections.SPECIFIC_RECEIPTS;
      section.itemCount += parsedLines.length;
      if (section.sampleValues.length < 10) {
        section.sampleValues.push(...parsedLines.slice(0, 10).map((item) => compactInline(item, 300)));
      }
      section.status = "PRESENT";
    }

    const specificSummary = summarizeSpecificReceipts(rawObject);
    const gaugeSummary = summarizeGaugeVariance(rawObject);

    if (specificSummary) {
      sections.SPECIFIC_RECEIPTS.status = "PRESENT";
      sections.SPECIFIC_RECEIPTS.specificReceiptSummary = specificSummary;
    }

    if (gaugeSummary) {
      sections.GAUGE_VARIANCE.status = "PRESENT";
      sections.GAUGE_VARIANCE.gaugeVarianceSummary = gaugeSummary;
    }

    const presentSectionIds = Object.keys(sections).filter((id) => sections[id].itemCount > 0);
    const emptySectionIds = Object.keys(sections).filter((id) => sections[id].itemCount <= 0);

    return {
      PACKET_NAME: SEGREGATION_PACKET_NAME,
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      SOURCE: normalized.source,
      SOURCE_TYPE: normalized.sourceType,
      RECEIPT_WEIGHT_CLASS: classifyReceiptWeight(rawText, rawObject),
      FLATTENED_ITEM_COUNT: flattened.count,
      FLATTENED_TRUNCATED: flattened.truncated,
      PRESENT_SECTION_COUNT: presentSectionIds.length,
      EMPTY_SECTION_COUNT: emptySectionIds.length,
      PRESENT_SECTIONS: presentSectionIds,
      EMPTY_SECTIONS: emptySectionIds,
      sections
    };
  }

  function keyName(path) {
    const text = safeString(path);
    const dot = text.split(".").pop() || text;
    const bracket = dot.replace(/\[[^\]]+\]/g, "");
    return bracket || dot;
  }

  function isFalseLike(value) {
    return value === false || value === "false" || value === "FALSE" || value === 0 || value === "0";
  }

  function collapseDuplicateStandards(normalized) {
    const rawObject = normalized.rawObject || {};
    const rawText = normalized.rawText || "";
    const flattened = flattenObject(rawObject, { maxDepth: 9, maxNodes: 2200 });

    const noClaimHits = {};
    const routeMetadataHits = {};
    const gaugeLawHits = {};
    const contractValueHits = {};
    const fieldValueHits = {};

    function bump(map, key, value, path) {
      const id = safeString(key, "UNKNOWN");
      if (!map[id]) {
        map[id] = {
          key: id,
          count: 0,
          values: {},
          samplePaths: []
        };
      }

      map[id].count += 1;
      const valueKey = packetValue(value, "UNKNOWN").slice(0, 300);
      map[id].values[valueKey] = (map[id].values[valueKey] || 0) + 1;
      if (map[id].samplePaths.length < 10) map[id].samplePaths.push(path);
    }

    for (const item of flattened.items) {
      const key = keyName(item.path);
      const upperKey = key.toUpperCase();
      const valueText = packetValue(item.value, "");

      if (CANONICAL_NO_CLAIM_FIELDS.includes(key) || CANONICAL_NO_CLAIM_FIELDS.includes(upperKey)) {
        if (isFalseLike(item.value) || valueText === "false") {
          bump(noClaimHits, upperKey, false, item.path);
        }
      }

      if (ROUTE_METADATA_FIELDS.includes(upperKey)) {
        bump(routeMetadataHits, upperKey, item.value, item.path);
      }

      if (GAUGE_RECEIPT_LAW_FIELDS.includes(upperKey)) {
        bump(gaugeLawHits, upperKey, item.value, item.path);
      }

      if (/_TNT_v/i.test(valueText) || /_RECEIPT_v/i.test(valueText)) {
        const valueKey = valueText.slice(0, 500);
        if (!contractValueHits[valueKey]) {
          contractValueHits[valueKey] = {
            value: valueKey,
            count: 0,
            samplePaths: []
          };
        }
        contractValueHits[valueKey].count += 1;
        if (contractValueHits[valueKey].samplePaths.length < 10) {
          contractValueHits[valueKey].samplePaths.push(item.path);
        }
      }

      const genericKey = `${upperKey}=${valueText.slice(0, 400)}`;
      if (valueText && valueText !== "[Object]" && valueText !== "[Array]" && valueText.length < 500) {
        if (!fieldValueHits[genericKey]) {
          fieldValueHits[genericKey] = {
            key: upperKey,
            value: valueText.slice(0, 400),
            count: 0,
            samplePaths: []
          };
        }
        fieldValueHits[genericKey].count += 1;
        if (fieldValueHits[genericKey].samplePaths.length < 6) {
          fieldValueHits[genericKey].samplePaths.push(item.path);
        }
      }
    }

    if (rawText) {
      const parsed = parsePacketText(rawText);
      for (const key of Object.keys(parsed)) {
        const upperKey = key.toUpperCase();
        const value = parsed[key];

        if (CANONICAL_NO_CLAIM_FIELDS.includes(key) || CANONICAL_NO_CLAIM_FIELDS.includes(upperKey)) {
          if (isFalseLike(value)) bump(noClaimHits, upperKey, false, `packetText.${key}`);
        }

        if (ROUTE_METADATA_FIELDS.includes(upperKey)) {
          bump(routeMetadataHits, upperKey, value, `packetText.${key}`);
        }

        if (GAUGE_RECEIPT_LAW_FIELDS.includes(upperKey)) {
          bump(gaugeLawHits, upperKey, value, `packetText.${key}`);
        }
      }
    }

    const noClaimCollapsed = Object.values(noClaimHits).filter((item) => item.count > 1);
    const routeMetadataCollapsed = Object.values(routeMetadataHits).filter((item) => item.count > 1);
    const gaugeLawCollapsed = Object.values(gaugeLawHits).filter((item) => item.count > 1);
    const contractValueCollapsed = Object.values(contractValueHits).filter((item) => item.count > 1);
    const repeatedFieldValues = Object.values(fieldValueHits)
      .filter((item) => item.count > 1)
      .slice(0, 80);

    const totalCollapsed =
      noClaimCollapsed.length +
      routeMetadataCollapsed.length +
      gaugeLawCollapsed.length +
      contractValueCollapsed.length +
      repeatedFieldValues.length;

    return {
      PACKET_NAME: DUPLICATE_COLLAPSE_PACKET_NAME,
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      SOURCE: normalized.source,
      SOURCE_TYPE: normalized.sourceType,
      DUPLICATE_STANDARD_COLLAPSE_STATUS:
        totalCollapsed > 0
          ? "DUPLICATE_STANDARD_COLLAPSE_COMPLETE"
          : "NO_DUPLICATE_STANDARDS_DETECTED",
      DUPLICATE_STANDARDS_COLLAPSED: totalCollapsed > 0,
      RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,
      COLLAPSE_IS_REFERENCE_NORMALIZATION: true,
      COLLAPSE_DOES_NOT_DELETE_EVIDENCE: true,
      TOTAL_COLLAPSED_STANDARD_CLASSES: totalCollapsed,
      NO_CLAIM_STANDARD_COLLAPSE_COUNT: noClaimCollapsed.length,
      ROUTE_METADATA_COLLAPSE_COUNT: routeMetadataCollapsed.length,
      GAUGE_RECEIPT_LAW_COLLAPSE_COUNT: gaugeLawCollapsed.length,
      CONTRACT_VALUE_COLLAPSE_COUNT: contractValueCollapsed.length,
      REPEATED_FIELD_VALUE_COLLAPSE_COUNT: repeatedFieldValues.length,
      collapsedStandards: {
        noClaimStandards: noClaimCollapsed,
        routeMetadataStandards: routeMetadataCollapsed,
        gaugeReceiptLawStandards: gaugeLawCollapsed,
        repeatedContractValues: contractValueCollapsed.slice(0, 80),
        repeatedFieldValues
      }
    };
  }

  function storeRawEvidence(kind, payload, meta = {}) {
    const ref = `SOUTH_RAW_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const entry = {
      ref,
      kind: safeString(kind, "RAW_EVIDENCE"),
      storedAt: nowIso(),
      meta: clonePlain(meta),
      payload: clonePlain(payload)
    };

    state.rawStore.push(entry);
    trim(state.rawStore, RAW_STORE_LIMIT);
    state.rawStoreCount = state.rawStore.length;
    state.latestRawRef = ref;

    return {
      ref,
      kind: entry.kind,
      storedAt: entry.storedAt,
      byteEstimate: safeJson(payload, "", 500000).length
    };
  }

  function readSidecarReportObject(result) {
    if (!result) return {};
    if (isObject(result.report)) return clonePlain(result.report);
    if (isObject(result.REPORT_OBJECT)) return clonePlain(result.REPORT_OBJECT);
    if (isObject(result.evidence)) return clonePlain(result.evidence);
    if (isObject(result.output) && isObject(result.output.REPORT_OBJECT)) {
      return clonePlain(result.output.REPORT_OBJECT);
    }
    if (isObject(result.output)) return clonePlain(result.output);
    if (isObject(result)) return clonePlain(result);
    return {};
  }

  function callSidecarMethod(sidecar, method, input) {
    if (!sidecar || !isFunction(sidecar[method])) return null;

    try {
      return {
        ok: true,
        method,
        result: sidecar[method](input)
      };
    } catch (error) {
      return {
        ok: false,
        method,
        error
      };
    }
  }

  function extractSidecarLensFields(report, callInfo, sourcePath) {
    const sidecarOutput = isObject(report.output) ? report.output : {};
    const values = [
      report,
      sidecarOutput,
      isObject(report.evidence) ? report.evidence : {},
      isObject(report.REPORT_OBJECT) ? report.REPORT_OBJECT : {}
    ];

    function firstFrom(keys, fallback = "UNKNOWN") {
      for (const source of values) {
        for (const key of keys) {
          const value = getRaw(source, key, undefined);
          const text = compactInline(value, 6000);
          if (text && text !== "UNKNOWN" && text !== "NONE") return value;
        }
      }
      return fallback;
    }

    const inspectedSurfaceClass = firstFrom([
      "INSPECTED_SURFACE_CLASS",
      "inspectedSurfaceClass",
      "surfaceClass"
    ], "UNKNOWN");

    const productionCanvasConfirmed = firstFrom([
      "PRODUCTION_CANVAS_CONFIRMED",
      "productionCanvasConfirmed"
    ], "UNKNOWN");

    const canvasBlameEligible = firstFrom([
      "CANVAS_BLAME_ELIGIBLE",
      "canvasBlameEligible"
    ], "UNKNOWN");

    const canvasBlameGateStatus = firstFrom([
      "CANVAS_BLAME_GATE_STATUS",
      "canvasBlameGateStatus"
    ], "UNKNOWN");

    const interpretation = firstFrom([
      "SURFACE_POINTER_INTERPRETATION",
      "surfacePointerInterpretation",
      "interpretation"
    ], "UNKNOWN");

    const recommendedOwner = firstFrom([
      "SURFACE_POINTER_RECOMMENDED_OWNER",
      "surfacePointerRecommendedOwner",
      "recommendedOwner"
    ], "UNKNOWN");

    const recommendedFile = firstFrom([
      "SURFACE_POINTER_RECOMMENDED_FILE",
      "surfacePointerRecommendedFile",
      "recommendedFile"
    ], "UNKNOWN");

    const recommendedAction = firstFrom([
      "SURFACE_POINTER_RECOMMENDED_ACTION",
      "surfacePointerRecommendedAction",
      "recommendedAction"
    ], "UNKNOWN");

    const classificationApplied =
      inspectedSurfaceClass !== "UNKNOWN" ||
      canvasBlameGateStatus !== "UNKNOWN" ||
      interpretation !== "UNKNOWN";

    const productionConfirmedBool = boolValue(productionCanvasConfirmed, false);
    const blameEligibleBool = boolValue(canvasBlameEligible, false);
    const nonProductionSurface =
      inspectedSurfaceClass !== "UNKNOWN" &&
      inspectedSurfaceClass !== "PRODUCTION_CANVAS_SURFACE";

    const conclusionModifier =
      classificationApplied &&
      (
        nonProductionSurface ||
        productionConfirmedBool ||
        blameEligibleBool ||
        /BLOCKED|ELIGIBLE|CONFIRMED|INCONCLUSIVE|NOT_NEEDED/i.test(compactInline(canvasBlameGateStatus, 1000))
      );

    return {
      sourcePath,
      callMethod: callInfo ? callInfo.method : "NONE",
      callOk: Boolean(callInfo && callInfo.ok),
      observed: true,
      SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED: true,
      SOUTH_SURFACE_POINTER_LENS_CONSUMED: classificationApplied,
      SOUTH_SURFACE_CLASSIFICATION_APPLIED: classificationApplied,
      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: conclusionModifier,
      INSPECTED_SURFACE_CLASS: packetValue(inspectedSurfaceClass),
      PRODUCTION_CANVAS_CONFIRMED: boolText(productionCanvasConfirmed, "UNKNOWN"),
      CANVAS_BLAME_ELIGIBLE: boolText(canvasBlameEligible, "UNKNOWN"),
      CANVAS_BLAME_GATE_STATUS: packetValue(canvasBlameGateStatus),
      SURFACE_POINTER_INTERPRETATION: packetValue(interpretation),
      SURFACE_POINTER_RECOMMENDED_OWNER: packetValue(recommendedOwner),
      SURFACE_POINTER_RECOMMENDED_FILE: packetValue(recommendedFile),
      SURFACE_POINTER_RECOMMENDED_ACTION: packetValue(recommendedAction),
      SIDE_CAR_REPORT_REF: "PENDING_RAW_REF"
    };
  }

  function consumeSouthSidecars(normalized, options = {}) {
    const explicitReport =
      isObject(options.sidecarSurfacePointerReport)
        ? options.sidecarSurfacePointerReport
        : isObject(options.sidecarLensReport)
          ? options.sidecarLensReport
          : null;

    const reportInput = {
      currentReport: clonePlain(normalized.rawObject || {}),
      packetText: normalized.rawText || "",
      diagnosticTimestamp: nowIso(),
      reason: "SOUTH_RAIL_INTERNAL_SIDECAR_LENS_CONSUMPTION"
    };

    let surfacePointer = {
      sourcePath: "NONE",
      observed: false,
      SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED: false,
      SOUTH_SURFACE_POINTER_LENS_CONSUMED: false,
      SOUTH_SURFACE_CLASSIFICATION_APPLIED: false,
      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: false,
      INSPECTED_SURFACE_CLASS: "UNKNOWN",
      PRODUCTION_CANVAS_CONFIRMED: "UNKNOWN",
      CANVAS_BLAME_ELIGIBLE: "UNKNOWN",
      CANVAS_BLAME_GATE_STATUS: "UNKNOWN",
      SURFACE_POINTER_INTERPRETATION: "UNKNOWN",
      SURFACE_POINTER_RECOMMENDED_OWNER: "UNKNOWN",
      SURFACE_POINTER_RECOMMENDED_FILE: "UNKNOWN",
      SURFACE_POINTER_RECOMMENDED_ACTION: "UNKNOWN",
      SIDE_CAR_REPORT_REF: "NONE"
    };

    let callInfo = null;
    let rawReport = {};

    if (explicitReport) {
      rawReport = clonePlain(explicitReport);
      surfacePointer = extractSidecarLensFields(
        rawReport,
        { ok: true, method: "EXPLICIT_SIDECAR_REPORT" },
        "EXPLICIT_SIDECAR_REPORT"
      );
    } else {
      const found = firstGlobal(SOUTH_SURFACE_POINTER_ALIASES);

      if (found.value) {
        const sidecar = found.value;
        const methodOrder = [
          "runSouthSurfacePointerRead",
          "inspectSouthSurfacePointer",
          "inspectSurfacePointer",
          "runProbeSidecar",
          "inspect",
          "runDiagnostic",
          "getReport"
        ];

        for (const method of methodOrder) {
          callInfo = callSidecarMethod(sidecar, method, reportInput);
          if (!callInfo) continue;

          if (!callInfo.ok) {
            recordError("SOUTH_SIDECAR_METHOD_FAILED", callInfo.error, {
              sidecar: found.path,
              method
            });
            continue;
          }

          rawReport = readSidecarReportObject(callInfo.result);
          if (isObject(rawReport) && Object.keys(rawReport).length > 0) {
            surfacePointer = extractSidecarLensFields(rawReport, callInfo, found.path);
            break;
          }
        }

        if (!surfacePointer.observed) {
          surfacePointer = {
            ...surfacePointer,
            sourcePath: found.path,
            observed: true,
            SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED: true,
            SOUTH_SURFACE_POINTER_LENS_CONSUMED: false,
            SOUTH_SURFACE_CLASSIFICATION_APPLIED: false,
            SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: false,
            CANVAS_BLAME_GATE_STATUS: "SIDECAR_OBSERVED_NO_CLASSIFICATION_OUTPUT"
          };
        }
      }
    }

    let rawRef = "NONE";
    if (isObject(rawReport) && Object.keys(rawReport).length > 0) {
      rawRef = storeRawEvidence("SOUTH_SURFACE_POINTER_SIDECAR_REPORT", rawReport, {
        sidecarFile: SOUTH_SURFACE_POINTER_FILE,
        sourcePath: surfacePointer.sourcePath,
        method: surfacePointer.callMethod || "UNKNOWN"
      }).ref;

      surfacePointer.SIDE_CAR_REPORT_REF = rawRef;
    }

    const status = !surfacePointer.SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED
      ? "SOUTH_SURFACE_POINTER_SIDECAR_NOT_OBSERVED"
      : surfacePointer.SOUTH_SURFACE_POINTER_LENS_CONSUMED
        ? "SOUTH_SURFACE_POINTER_LENS_CONSUMED"
        : "SOUTH_SURFACE_POINTER_PRESENT_BUT_NO_APPLICABLE_LENS_OUTPUT";

    return {
      PACKET_NAME: SIDECAR_LENS_PACKET_NAME,
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      SOUTH_SIDECAR_PROCESSING_ACTIVE: true,
      SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE: true,
      SOUTH_SIDECARS_ARE_PRIMARY_RECEIPT_PARTICIPANTS: false,
      SOUTH_SIDECARS_ARE_INTERNAL_PROCESS_LENSES: true,
      SOUTH_SURFACE_POINTER_SIDECAR_EXPECTED: true,
      SOUTH_SURFACE_POINTER_FILE,
      SOUTH_SURFACE_POINTER_SIDECAR_CONSUMPTION_STATUS: status,
      SOUTH_SIDECAR_CONSUMPTION_STATUS: status,
      surfacePointer,
      rawSidecarReportStoredByReference: rawRef !== "NONE",
      rawSidecarReportRef: rawRef
    };
  }

  function readGauge(rawObject, id) {
    const gauges = getRaw(rawObject, "gaugeVariance", {});
    if (!isObject(gauges)) return {};

    return getRaw(gauges, id, {});
  }

  function readGaugeStatus(rawObject, id, fallback = "UNKNOWN") {
    const gauge = readGauge(rawObject, id);
    return firstKnown(getRaw(gauge, "status", ""), fallback);
  }

  function deriveBasePacketMeaning(normalized, segregation, duplicateReport) {
    const raw = normalized.rawObject || {};

    const northAvailable = boolValue(getRaw(raw, "NORTH_VERDICT_AVAILABLE", false), false);
    const northPresent = boolValue(getRaw(raw, "NORTH_RAIL_PRESENT", false), false);

    const constructionReadiness =
      firstKnown(
        getRaw(raw, "CONSTRUCTION_READINESS_STATUS", ""),
        readGaugeStatus(raw, "CONSTRUCTION_READINESS", ""),
        "UNKNOWN"
      );

    const surfaceTruthStatus = readGaugeStatus(raw, "SURFACE_TRUTH_CONTRACTS", "UNKNOWN");
    const dutyLoadStatus = readGaugeStatus(raw, "DUTY_LOAD_MALPRACTICE", "UNKNOWN");
    const containerStatus = readGaugeStatus(raw, "CONTAINER_COLLAPSE_RISK", "UNKNOWN");
    const canvasBoundaryStatus = readGaugeStatus(raw, "CANVAS_CYCLE_BOUNDARY", "UNKNOWN");

    let southConclusion = "SOUTH_PACKET_MEANING_HELD";
    let southConclusionClass = "DIAGNOSTIC_FIELD_HELD";
    let southRecommendedNextProcess = "WAIT_FOR_NORTH_DIAGNOSTIC_TRACK_ALIGNMENT";
    let southReason = "NORTH_VERDICT_NOT_AVAILABLE";

    if (!northPresent || !northAvailable) {
      southConclusion = "CONSTRUCTION_BLOCKED_DIAGNOSTIC_FIELD";
      southConclusionClass = "NORTH_DIAGNOSTIC_TRACK_BLOCKED";
      southRecommendedNextProcess = "RESTORE_OR_ALIGN_NORTH_DIAGNOSTIC_TRACK_BEFORE_CANVAS_BUILD";
      southReason = "NORTH_VERDICT_AVAILABLE=false";
    } else if (/MALPRACTICE|BLOCKED|COLLAPSE/i.test(dutyLoadStatus)) {
      southConclusion = "CONSTRUCTION_BLOCKED_DIAGNOSTIC_SELF_BOUNDARY";
      southConclusionClass = "DUTY_LOAD_OR_DIAGNOSTIC_MALPRACTICE_BLOCK";
      southRecommendedNextProcess = "CLEAR_DIAGNOSTIC_SELF_BOUNDARY_BEFORE_PRODUCTION_BUILD";
      southReason = `DUTY_LOAD_MALPRACTICE=${dutyLoadStatus}`;
    } else if (/HIGH_VARIANCE|FAILED|PARTIAL/i.test(surfaceTruthStatus)) {
      southConclusion = "CONSTRUCTION_HELD_SURFACE_TRUTH_VARIANCE";
      southConclusionClass = "SURFACE_TRUTH_CONTRACT_VARIANCE";
      southRecommendedNextProcess = "ALIGN_SURFACE_TRUTH_CONTRACT_DEFINITION_BEFORE_CANVAS_BUILD";
      southReason = `SURFACE_TRUTH_CONTRACTS=${surfaceTruthStatus}`;
    } else if (/RISK|PARTIAL/i.test(containerStatus) || /RISK|PARTIAL/i.test(canvasBoundaryStatus)) {
      southConclusion = "CONSTRUCTION_HELD_CONTAINER_BOUNDARY_RISK";
      southConclusionClass = "CONTAINER_OR_CANVAS_BOUNDARY_RISK";
      southRecommendedNextProcess = "CLEAR_CONTAINER_BOUNDARY_AND_CANVAS_CYCLE_RISK";
      southReason = `CONTAINER=${containerStatus};CANVAS_BOUNDARY=${canvasBoundaryStatus}`;
    } else if (/ALIGNED|READY/i.test(constructionReadiness)) {
      southConclusion = "SOUTH_PACKET_MEANING_ALIGNED_FOR_NORTH_CONSUMPTION";
      southConclusionClass = "SOUTH_OUTPUT_READY_FOR_NORTH_CONSUMPTION";
      southRecommendedNextProcess = "RETURN_COMPACT_MANIFEST_AND_SEGREGATED_INDEX_TO_NORTH";
      southReason = `CONSTRUCTION_READINESS=${constructionReadiness}`;
    }

    return {
      NORTH_RAIL_PRESENT: northPresent,
      NORTH_VERDICT_AVAILABLE: northAvailable,
      CONSTRUCTION_READINESS_STATUS: constructionReadiness,
      SURFACE_TRUTH_CONTRACTS_STATUS: surfaceTruthStatus,
      DUTY_LOAD_MALPRACTICE_STATUS: dutyLoadStatus,
      CONTAINER_COLLAPSE_RISK_STATUS: containerStatus,
      CANVAS_CYCLE_BOUNDARY_STATUS: canvasBoundaryStatus,

      SOUTH_BASE_CONCLUSION: southConclusion,
      SOUTH_BASE_CONCLUSION_CLASS: southConclusionClass,
      SOUTH_BASE_CONCLUSION_REASON: southReason,
      SOUTH_BASE_RECOMMENDED_NEXT_PROCESS: southRecommendedNextProcess,

      RECEIPT_WEIGHT_CLASS: segregation.RECEIPT_WEIGHT_CLASS,
      DUPLICATE_STANDARDS_COLLAPSED:
        duplicateReport.DUPLICATE_STANDARDS_COLLAPSED === true,
      RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true
    };
  }

  function applySidecarLensToConclusion(baseMeaning, sidecarLens) {
    const surface = sidecarLens.surfacePointer || {};
    const surfaceClass = firstKnown(surface.INSPECTED_SURFACE_CLASS, "UNKNOWN");
    const blameGate = firstKnown(surface.CANVAS_BLAME_GATE_STATUS, "UNKNOWN");
    const sidecarConsumed = boolValue(surface.SOUTH_SURFACE_POINTER_LENS_CONSUMED, false);
    const conclusionModified = boolValue(surface.SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR, false);
    const productionConfirmed = boolValue(surface.PRODUCTION_CANVAS_CONFIRMED, false);
    const blameEligible = boolValue(surface.CANVAS_BLAME_ELIGIBLE, false);

    let finalConclusion = baseMeaning.SOUTH_BASE_CONCLUSION;
    let finalClass = baseMeaning.SOUTH_BASE_CONCLUSION_CLASS;
    let finalReason = baseMeaning.SOUTH_BASE_CONCLUSION_REASON;
    let nextProcess = baseMeaning.SOUTH_BASE_RECOMMENDED_NEXT_PROCESS;
    let sidecarEffect = "NO_SIDECAR_EFFECT";

    if (!sidecarConsumed) {
      return {
        ...baseMeaning,
        SOUTH_FINAL_CONCLUSION: finalConclusion,
        SOUTH_FINAL_CONCLUSION_CLASS: finalClass,
        SOUTH_FINAL_CONCLUSION_REASON: finalReason,
        SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS: nextProcess,
        SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: false,
        SOUTH_SIDECAR_EFFECT: sidecarEffect
      };
    }

    if (
      surfaceClass !== "UNKNOWN" &&
      surfaceClass !== "PRODUCTION_CANVAS_SURFACE"
    ) {
      finalConclusion = "CONSTRUCTION_HELD_INSPECTED_SURFACE_NOT_PRODUCTION_CANVAS";
      finalClass = "SOUTH_SIDECAR_SURFACE_CLASS_BLOCK";
      finalReason = `SIDECAR_INSPECTED_SURFACE_CLASS=${surfaceClass}`;
      nextProcess =
        "DO_NOT_BLAME_CANVAS_UNTIL_PRODUCTION_HEARTH_CANVAS_SURFACE_IS_CONFIRMED";
      sidecarEffect = "SIDECAR_BLOCKED_PREMATURE_CANVAS_BLAME";
    } else if (productionConfirmed && blameEligible) {
      finalConclusion = "CANVAS_BLAME_ELIGIBLE_AFTER_PRODUCTION_CANVAS_CONFIRMATION";
      finalClass = "SOUTH_SIDECAR_CANVAS_BLAME_GATE_OPEN";
      finalReason = `SIDECAR_CANVAS_BLAME_GATE=${blameGate}`;
      nextProcess =
        "RETURN_TO_NORTH_OR_WEST_FOR_LAWFUL_CANVAS_DRAW_PATH_AUDIT_AUTHORIZATION";
      sidecarEffect = "SIDECAR_OPENED_CANVAS_BLAME_GATE_WITHOUT_AUTHORIZING_REPAIR";
    } else if (productionConfirmed && /NOT_NEEDED|VISIBLE_PIXEL|VISIBLE/i.test(blameGate)) {
      finalConclusion = "CANVAS_BLAME_NOT_NEEDED_VISIBLE_PRODUCTION_SURFACE_PROOF";
      finalClass = "SOUTH_SIDECAR_CANVAS_BLAME_NOT_NEEDED";
      finalReason = `SIDECAR_CANVAS_BLAME_GATE=${blameGate}`;
      nextProcess =
        "KEEP_CANVAS_REPAIR_HELD_AND_RETURN_VISIBLE_SURFACE_PROOF_TO_NORTH";
      sidecarEffect = "SIDECAR_CLOSED_CANVAS_BLAME_GATE";
    } else if (/BLOCKED|HELD|INCONCLUSIVE/i.test(blameGate)) {
      finalConclusion = "CONSTRUCTION_HELD_BY_SOUTH_SIDECAR_CANVAS_BLAME_GATE";
      finalClass = "SOUTH_SIDECAR_CANVAS_BLAME_GATE_HELD";
      finalReason = `SIDECAR_CANVAS_BLAME_GATE=${blameGate}`;
      nextProcess =
        "RESOLVE_SIDECAR_SURFACE_OR_POINTER_GATE_BEFORE_CANVAS_BLAME";
      sidecarEffect = "SIDECAR_HELD_CANVAS_BLAME_GATE";
    } else if (conclusionModified) {
      finalReason = `${finalReason};SIDECAR_LENS_APPLIED=${blameGate}`;
      sidecarEffect = "SIDECAR_LENS_APPLIED_WITHOUT_CONCLUSION_OVERRIDE";
    }

    return {
      ...baseMeaning,
      SOUTH_FINAL_CONCLUSION: finalConclusion,
      SOUTH_FINAL_CONCLUSION_CLASS: finalClass,
      SOUTH_FINAL_CONCLUSION_REASON: finalReason,
      SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS: nextProcess,
      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: sidecarEffect !== "NO_SIDECAR_EFFECT",
      SOUTH_SIDECAR_EFFECT: sidecarEffect
    };
  }

  function composeCompactManifest(packet) {
    const lines = [
      line("PACKET_NAME", MANIFEST_PACKET_NAME),
      line("CONTRACT", CONTRACT),
      line("RECEIPT", RECEIPT),
      line("INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT),
      line("VERSION", VERSION),
      line("TARGET_ROUTE", TARGET_ROUTE),
      line("DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE),
      line("GENERATED_AT", packet.GENERATED_AT),
      line("SOURCE", packet.SOURCE),
      line("SOURCE_TYPE", packet.SOURCE_TYPE),
      line("DEFAULT_COPY_SURFACE", "COMPACT_MANIFEST"),
      line("FULL_RECEIPT_IS_NOT_DEFAULT_COPY_SURFACE", true),
      line("SOUTH_RECEIPT_SEGREGATION_ACTIVE", true),
      line("SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE", true),
      line("SOUTH_SIDECAR_PROCESSING_ACTIVE", true),
      line("SOUTH_SIDECARS_ARE_PRIMARY_RECEIPT_PARTICIPANTS", false),
      line("SOUTH_SIDECARS_ARE_INTERNAL_PROCESS_LENSES", true),
      line("SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED", packet.SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED),
      line("SOUTH_SURFACE_POINTER_LENS_CONSUMED", packet.SOUTH_SURFACE_POINTER_LENS_CONSUMED),
      line("SOUTH_SURFACE_CLASSIFICATION_APPLIED", packet.SOUTH_SURFACE_CLASSIFICATION_APPLIED),
      line("INSPECTED_SURFACE_CLASS", packet.INSPECTED_SURFACE_CLASS),
      line("PRODUCTION_CANVAS_CONFIRMED", packet.PRODUCTION_CANVAS_CONFIRMED),
      line("CANVAS_BLAME_ELIGIBLE", packet.CANVAS_BLAME_ELIGIBLE),
      line("CANVAS_BLAME_GATE_STATUS", packet.CANVAS_BLAME_GATE_STATUS),
      line("SURFACE_POINTER_INTERPRETATION", packet.SURFACE_POINTER_INTERPRETATION),
      line("NORTH_VERDICT_AVAILABLE", packet.NORTH_VERDICT_AVAILABLE),
      line("CONSTRUCTION_READINESS_STATUS", packet.CONSTRUCTION_READINESS_STATUS),
      line("SURFACE_TRUTH_CONTRACTS_STATUS", packet.SURFACE_TRUTH_CONTRACTS_STATUS),
      line("DUTY_LOAD_MALPRACTICE_STATUS", packet.DUTY_LOAD_MALPRACTICE_STATUS),
      line("CONTAINER_COLLAPSE_RISK_STATUS", packet.CONTAINER_COLLAPSE_RISK_STATUS),
      line("CANVAS_CYCLE_BOUNDARY_STATUS", packet.CANVAS_CYCLE_BOUNDARY_STATUS),
      line("SOUTH_FINAL_CONCLUSION", packet.SOUTH_FINAL_CONCLUSION),
      line("SOUTH_FINAL_CONCLUSION_CLASS", packet.SOUTH_FINAL_CONCLUSION_CLASS),
      line("SOUTH_FINAL_CONCLUSION_REASON", packet.SOUTH_FINAL_CONCLUSION_REASON),
      line("SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS", packet.SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS),
      line("DUPLICATE_STANDARDS_COLLAPSED", packet.DUPLICATE_STANDARDS_COLLAPSED),
      line("RAW_EVIDENCE_PRESERVED_BY_REFERENCE", packet.RAW_EVIDENCE_PRESERVED_BY_REFERENCE),
      line("RAW_RECEIPT_REF", packet.RAW_RECEIPT_REF),
      line("SIDECAR_REPORT_REF", packet.SIDECAR_REPORT_REF),
      line("PRODUCTION_MUTATION_AUTHORIZED", false),
      line("HEARTH_REPAIR_AUTHORIZED", false),
      line("RUNTIME_RESTART_AUTHORIZED", false),
      line("CANVAS_RELEASE_AUTHORIZED", false),
      line("F13_CLAIMED", false),
      line("F21_CLAIMED", false),
      line("F55_CLAIMED_BY_SOUTH", false),
      line("READY_TEXT_CLAIMED", false),
      line("VISUAL_PASS_CLAIMED", false),
      line("FINAL_VISUAL_PASS_CLAIMED", false),
      line("GENERATED_IMAGE", false),
      line("GRAPHIC_BOX", false),
      line("WEBGL", false)
    ];

    return lines.join("\n").slice(0, MAX_COMPACT_MANIFEST_CHARS);
  }

  function composeSuperCompactManifest(packet) {
    return [
      line("SOUTH_FINAL_CONCLUSION", packet.SOUTH_FINAL_CONCLUSION),
      line("NORTH_VERDICT_AVAILABLE", packet.NORTH_VERDICT_AVAILABLE),
      line("SIDE_CAR", packet.SOUTH_SURFACE_POINTER_SIDECAR_CONSUMPTION_STATUS),
      line("SURFACE", packet.INSPECTED_SURFACE_CLASS),
      line("CANVAS_BLAME_GATE", packet.CANVAS_BLAME_GATE_STATUS),
      line("NEXT_PROCESS", packet.SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS),
      line("RAW_REF", packet.RAW_RECEIPT_REF)
    ].join("\n").slice(0, MAX_SUPER_COMPACT_CHARS);
  }

  function composePacketText(packet) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "PREVIOUS_INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "GENERATED_AT",
      "SOURCE",
      "SOURCE_TYPE",
      "SOUTH_RECEIPT_SEGREGATION_ACTIVE",
      "SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE",
      "SOUTH_COPYABLE_COMPACT_MANIFEST_ACTIVE",
      "SOUTH_RAW_EVIDENCE_REFERENCE_STORE_ACTIVE",
      "SOUTH_SIDECAR_PROCESSING_ACTIVE",
      "SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE",
      "SOUTH_SIDECARS_ARE_PRIMARY_RECEIPT_PARTICIPANTS",
      "SOUTH_SIDECARS_ARE_INTERNAL_PROCESS_LENSES",
      "SOUTH_SURFACE_POINTER_SIDECAR_EXPECTED",
      "SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED",
      "SOUTH_SURFACE_POINTER_LENS_CONSUMED",
      "SOUTH_SURFACE_CLASSIFICATION_APPLIED",
      "SOUTH_SURFACE_POINTER_SIDECAR_CONSUMPTION_STATUS",
      "SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR",
      "SOUTH_SIDECAR_EFFECT",
      "INSPECTED_SURFACE_CLASS",
      "PRODUCTION_CANVAS_CONFIRMED",
      "CANVAS_BLAME_ELIGIBLE",
      "CANVAS_BLAME_GATE_STATUS",
      "SURFACE_POINTER_INTERPRETATION",
      "SURFACE_POINTER_RECOMMENDED_OWNER",
      "SURFACE_POINTER_RECOMMENDED_FILE",
      "SURFACE_POINTER_RECOMMENDED_ACTION",
      "NORTH_RAIL_PRESENT",
      "NORTH_VERDICT_AVAILABLE",
      "CONSTRUCTION_READINESS_STATUS",
      "SURFACE_TRUTH_CONTRACTS_STATUS",
      "DUTY_LOAD_MALPRACTICE_STATUS",
      "CONTAINER_COLLAPSE_RISK_STATUS",
      "CANVAS_CYCLE_BOUNDARY_STATUS",
      "SOUTH_BASE_CONCLUSION",
      "SOUTH_BASE_CONCLUSION_CLASS",
      "SOUTH_BASE_CONCLUSION_REASON",
      "SOUTH_FINAL_CONCLUSION",
      "SOUTH_FINAL_CONCLUSION_CLASS",
      "SOUTH_FINAL_CONCLUSION_REASON",
      "SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS",
      "RECEIPT_WEIGHT_CLASS",
      "SEGREGATED_SECTION_COUNT",
      "DUPLICATE_STANDARDS_COLLAPSED",
      "TOTAL_COLLAPSED_STANDARD_CLASSES",
      "RAW_EVIDENCE_PRESERVED_BY_REFERENCE",
      "RAW_RECEIPT_REF",
      "SIDECAR_REPORT_REF",
      "COMPACT_MANIFEST_TEXT",
      "SUPER_COMPACT_MANIFEST_TEXT",
      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "F13_CLAIMED",
      "F21_CLAIMED",
      "F55_CLAIMED_BY_SOUTH",
      "READY_TEXT_CLAIMED",
      "VISUAL_PASS_CLAIMED",
      "FINAL_VISUAL_PASS_CLAIMED",
      "GENERATED_IMAGE",
      "GRAPHIC_BOX",
      "WEBGL"
    ];

    const keys = priority.concat(Object.keys(packet || {}));
    const seen = new Set();
    const lines = [];

    for (const key of keys) {
      if (seen.has(key)) continue;
      seen.add(key);

      const value = getRaw(packet, key, undefined);
      if (value === undefined) continue;

      if (["segregatedReceiptIndex", "duplicateStandardCollapseReport", "sidecarLensReport"].includes(key)) {
        continue;
      }

      lines.push(line(key, value));
    }

    return lines.join("\n").slice(0, MAX_PACKET_TEXT_CHARS);
  }

  function buildSouthPacket(input = {}) {
    const normalized = normalizeInput(input);
    const rawRef = storeRawEvidence("DIAGNOSTIC_RECEIPT_INPUT", {
      rawObject: normalized.rawObject,
      rawText: normalized.rawText
    }, {
      source: normalized.source,
      sourceType: normalized.sourceType
    });

    const segregation = segregateReceipt(normalized);
    const duplicateReport = collapseDuplicateStandards(normalized);
    const sidecarLens = consumeSouthSidecars(normalized, input || {});
    const baseMeaning = deriveBasePacketMeaning(normalized, segregation, duplicateReport);
    const finalMeaning = applySidecarLensToConclusion(baseMeaning, sidecarLens);

    const sidecar = sidecarLens.surfacePointer || {};

    const packet = {
      PACKET_NAME,
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      BASELINE_INTERNAL_RENEWAL_CONTRACT,
      BASELINE_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      SOURCE: normalized.source,
      SOURCE_TYPE: normalized.sourceType,

      SOUTH_ROLE: "SOUTH_PACKET_OUTPUT_HANDOFF",
      SOUTH_PROFILE_CLASS:
        "RECEIPT_SEGREGATION_SIDECAR_LENS_PACKET_MEANING_CARRIER",
      SOUTH_CYCLE_POSITION: "DIAGNOSTIC_TRACK_SOUTH_PACKET_OUTPUT_STAGE",

      SOUTH_RECEIPT_SEGREGATION_ACTIVE: true,
      SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE: true,
      SOUTH_COPYABLE_COMPACT_MANIFEST_ACTIVE: true,
      SOUTH_RAW_EVIDENCE_REFERENCE_STORE_ACTIVE: true,
      SOUTH_SIDECAR_PROCESSING_ACTIVE: true,
      SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE: true,
      SOUTH_SIDECARS_ARE_PRIMARY_RECEIPT_PARTICIPANTS: false,
      SOUTH_SIDECARS_ARE_INTERNAL_PROCESS_LENSES: true,
      SIDE_CARS_DO_NOT_NEED_TOP_LEVEL_RECEIPT_PARTICIPATION: true,
      SIDE_CARS_MAY_INFORM_SOUTH_PROCESS_CONCLUSION: true,

      SOUTH_SURFACE_POINTER_FILE,
      PROBE_SOUTH_FILE,
      NORTH_RAIL_FILE,
      EAST_RAIL_FILE,
      WEST_RAIL_FILE,
      LAB_NORTH_FILE,
      LAB_WEST_FILE,
      SURFACE_TRUTH_PROBE_FILE,

      SOUTH_SURFACE_POINTER_SIDECAR_EXPECTED:
        sidecarLens.SOUTH_SURFACE_POINTER_SIDECAR_EXPECTED,
      SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED:
        sidecar.SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED,
      SOUTH_SURFACE_POINTER_LENS_CONSUMED:
        sidecar.SOUTH_SURFACE_POINTER_LENS_CONSUMED,
      SOUTH_SURFACE_CLASSIFICATION_APPLIED:
        sidecar.SOUTH_SURFACE_CLASSIFICATION_APPLIED,
      SOUTH_SURFACE_POINTER_SIDECAR_CONSUMPTION_STATUS:
        sidecarLens.SOUTH_SURFACE_POINTER_SIDECAR_CONSUMPTION_STATUS,
      SOUTH_SIDECAR_CONSUMPTION_STATUS:
        sidecarLens.SOUTH_SIDECAR_CONSUMPTION_STATUS,

      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR:
        finalMeaning.SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR,
      SOUTH_SIDECAR_EFFECT: finalMeaning.SOUTH_SIDECAR_EFFECT,

      INSPECTED_SURFACE_CLASS: sidecar.INSPECTED_SURFACE_CLASS,
      PRODUCTION_CANVAS_CONFIRMED: sidecar.PRODUCTION_CANVAS_CONFIRMED,
      CANVAS_BLAME_ELIGIBLE: sidecar.CANVAS_BLAME_ELIGIBLE,
      CANVAS_BLAME_GATE_STATUS: sidecar.CANVAS_BLAME_GATE_STATUS,
      SURFACE_POINTER_INTERPRETATION: sidecar.SURFACE_POINTER_INTERPRETATION,
      SURFACE_POINTER_RECOMMENDED_OWNER: sidecar.SURFACE_POINTER_RECOMMENDED_OWNER,
      SURFACE_POINTER_RECOMMENDED_FILE: sidecar.SURFACE_POINTER_RECOMMENDED_FILE,
      SURFACE_POINTER_RECOMMENDED_ACTION: sidecar.SURFACE_POINTER_RECOMMENDED_ACTION,

      ...finalMeaning,

      RECEIPT_WEIGHT_CLASS: segregation.RECEIPT_WEIGHT_CLASS,
      SEGREGATED_SECTION_COUNT: segregation.PRESENT_SECTION_COUNT,
      SEGREGATED_EMPTY_SECTION_COUNT: segregation.EMPTY_SECTION_COUNT,
      SEGREGATED_SECTIONS: segregation.PRESENT_SECTIONS,

      DUPLICATE_STANDARDS_COLLAPSED:
        duplicateReport.DUPLICATE_STANDARDS_COLLAPSED,
      TOTAL_COLLAPSED_STANDARD_CLASSES:
        duplicateReport.TOTAL_COLLAPSED_STANDARD_CLASSES,
      NO_CLAIM_STANDARD_COLLAPSE_COUNT:
        duplicateReport.NO_CLAIM_STANDARD_COLLAPSE_COUNT,
      ROUTE_METADATA_COLLAPSE_COUNT:
        duplicateReport.ROUTE_METADATA_COLLAPSE_COUNT,
      GAUGE_RECEIPT_LAW_COLLAPSE_COUNT:
        duplicateReport.GAUGE_RECEIPT_LAW_COLLAPSE_COUNT,
      CONTRACT_VALUE_COLLAPSE_COUNT:
        duplicateReport.CONTRACT_VALUE_COLLAPSE_COUNT,

      RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,
      RAW_RECEIPT_REF: rawRef.ref,
      RAW_RECEIPT_BYTE_ESTIMATE: rawRef.byteEstimate,
      SIDECAR_REPORT_REF: sidecar.SIDE_CAR_REPORT_REF || sidecarLens.rawSidecarReportRef || "NONE",

      FULL_RECEIPT_IS_NOT_DEFAULT_COPY_SURFACE: true,
      DEFAULT_COPY_SURFACE: "COMPACT_MANIFEST",
      COMPACT_MANIFEST_TEXT: "",
      SUPER_COMPACT_MANIFEST_TEXT: "",

      TRUTH_AUTHORITY: false,
      FINAL_ARBITRATION: false,
      REPAIR_AUTHORIZATION: false,
      GAUGE_VERDICT_REPLACEMENT: false,
      NORTH_GRAMMAR_AUTHORITY: false,
      WEST_DERIVATIVE_MAP_AUTHORITY: false,
      CANVAS_BUILD_AUTHORITY: false,
      CANVAS_PRODUCTION_REPAIR_AUTHORITY: false,
      FORCED_RECEIPT_RETURN: false,

      truthAuthorityClaimed: false,
      finalArbitrationClaimed: false,
      repairAuthorizationClaimed: false,
      gaugeVerdictReplacementClaimed: false,
      northGrammarAuthorityClaimed: false,
      westDerivativeMapAuthorityClaimed: false,
      canvasBuildAuthorityClaimed: false,
      canvasProductionRepairAuthorityClaimed: false,
      forcedReceiptReturnClaimed: false,

      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasDrawingAuthorized: false,
      f13Claimed: false,
      f21Claimed: false,
      f55ClaimedBySouth: false,
      readyTextClaimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webgl: false,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      F13_CLAIMED: false,
      F21_CLAIMED: false,
      F55_CLAIMED_BY_SOUTH: false,
      READY_TEXT_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      FINAL_VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,

      segregatedReceiptIndex: segregation,
      duplicateStandardCollapseReport: duplicateReport,
      sidecarLensReport: sidecarLens
    };

    packet.COMPACT_MANIFEST_TEXT = composeCompactManifest(packet);
    packet.SUPER_COMPACT_MANIFEST_TEXT = composeSuperCompactManifest(packet);

    return {
      normalized,
      segregation,
      duplicateReport,
      sidecarLens,
      packet
    };
  }

  function publishPacket(result) {
    const packet = result.packet;

    state.latestNormalizedInput = clonePlain(result.normalized);
    state.latestSegregatedReceiptIndex = clonePlain(result.segregation);
    state.latestDuplicateStandardCollapseReport = clonePlain(result.duplicateReport);
    state.latestSidecarLensReport = clonePlain(result.sidecarLens);
    state.latestPacket = clonePlain(packet);
    state.latestReport = clonePlain(packet);
    state.latestConclusion = {
      SOUTH_FINAL_CONCLUSION: packet.SOUTH_FINAL_CONCLUSION,
      SOUTH_FINAL_CONCLUSION_CLASS: packet.SOUTH_FINAL_CONCLUSION_CLASS,
      SOUTH_FINAL_CONCLUSION_REASON: packet.SOUTH_FINAL_CONCLUSION_REASON,
      SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS:
        packet.SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS,
      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR:
        packet.SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR,
      SOUTH_SIDECAR_EFFECT: packet.SOUTH_SIDECAR_EFFECT
    };

    state.latestCompactManifestText = packet.COMPACT_MANIFEST_TEXT;
    state.latestSuperCompactManifestText = packet.SUPER_COMPACT_MANIFEST_TEXT;
    state.latestPacketText = composePacketText(packet);
    state.latestRunAt = packet.GENERATED_AT;
    state.updatedAt = nowIso();

    publishAliases();

    return packet;
  }

  function runSouthPacketOutput(input = {}) {
    state.runCount += 1;

    try {
      const result = buildSouthPacket(input || {});
      const packet = publishPacket(result);

      record("SOUTH_PACKET_OUTPUT_COMPLETE", {
        conclusion: packet.SOUTH_FINAL_CONCLUSION,
        sidecarStatus: packet.SOUTH_SIDECAR_CONSUMPTION_STATUS,
        rawRef: packet.RAW_RECEIPT_REF
      });

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: CONTRACT,
        implementationReceipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

        SOUTH_PACKET_OUTPUT_STATUS: "SOUTH_PACKET_OUTPUT_COMPLETE",
        SOUTH_RECEIPT_SEGREGATION_ACTIVE: true,
        SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE: true,
        SOUTH_SIDECAR_PROCESSING_ACTIVE: true,
        SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE: true,
        SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED:
          packet.SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED,
        SOUTH_SURFACE_POINTER_LENS_CONSUMED:
          packet.SOUTH_SURFACE_POINTER_LENS_CONSUMED,
        SOUTH_SURFACE_CLASSIFICATION_APPLIED:
          packet.SOUTH_SURFACE_CLASSIFICATION_APPLIED,
        SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR:
          packet.SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR,

        SOUTH_FINAL_CONCLUSION: packet.SOUTH_FINAL_CONCLUSION,
        SOUTH_FINAL_CONCLUSION_CLASS: packet.SOUTH_FINAL_CONCLUSION_CLASS,
        SOUTH_FINAL_CONCLUSION_REASON: packet.SOUTH_FINAL_CONCLUSION_REASON,
        SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS:
          packet.SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS,

        packet,
        report: packet,
        REPORT_OBJECT: packet,
        output: {
          SOUTH_PACKET_OUTPUT_STATUS: "SOUTH_PACKET_OUTPUT_COMPLETE",
          SOUTH_FINAL_CONCLUSION: packet.SOUTH_FINAL_CONCLUSION,
          SOUTH_FINAL_CONCLUSION_CLASS: packet.SOUTH_FINAL_CONCLUSION_CLASS,
          SOUTH_FINAL_CONCLUSION_REASON: packet.SOUTH_FINAL_CONCLUSION_REASON,
          SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS:
            packet.SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS,
          SOUTH_SIDECAR_CONSUMPTION_STATUS:
            packet.SOUTH_SIDECAR_CONSUMPTION_STATUS,
          INSPECTED_SURFACE_CLASS: packet.INSPECTED_SURFACE_CLASS,
          CANVAS_BLAME_GATE_STATUS: packet.CANVAS_BLAME_GATE_STATUS,
          RAW_RECEIPT_REF: packet.RAW_RECEIPT_REF,
          REPORT_OBJECT: packet
        },
        packetText: state.latestPacketText,
        compactManifest: packet.COMPACT_MANIFEST_TEXT,
        compactManifestText: packet.COMPACT_MANIFEST_TEXT,
        superCompactManifestText: packet.SUPER_COMPACT_MANIFEST_TEXT,

        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      recordError("SOUTH_PACKET_OUTPUT_FAILED", error);

      const fallback = {
        PACKET_NAME,
        CONTRACT,
        RECEIPT,
        INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT,
        VERSION,
        FILE,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        GENERATED_AT: nowIso(),
        SOUTH_PACKET_OUTPUT_STATUS: "ERROR",
        SOUTH_FINAL_CONCLUSION: "SOUTH_PACKET_OUTPUT_ERROR",
        SOUTH_FINAL_CONCLUSION_CLASS: "SOUTH_INTERNAL_ERROR",
        SOUTH_FINAL_CONCLUSION_REASON:
          bounded(error && error.message ? error.message : error, 2000),
        SOUTH_FINAL_RECOMMENDED_NEXT_PROCESS:
          "REVIEW_SOUTH_PACKET_OUTPUT_ERROR_WITHOUT_PRODUCTION_MUTATION",
        SOUTH_SIDECAR_PROCESSING_ACTIVE: true,
        SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE: true,
        SOUTH_SURFACE_POINTER_SIDECAR_OBSERVED: false,
        SOUTH_SURFACE_POINTER_LENS_CONSUMED: false,
        SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: false,
        PRODUCTION_MUTATION_AUTHORIZED: false,
        HEARTH_REPAIR_AUTHORIZED: false,
        RUNTIME_RESTART_AUTHORIZED: false,
        CANVAS_RELEASE_AUTHORIZED: false,
        F13_CLAIMED: false,
        F21_CLAIMED: false,
        F55_CLAIMED_BY_SOUTH: false,
        READY_TEXT_CLAIMED: false,
        VISUAL_PASS_CLAIMED: false,
        FINAL_VISUAL_PASS_CLAIMED: false,
        GENERATED_IMAGE: false,
        GRAPHIC_BOX: false,
        WEBGL: false,
        ...NO_CLAIMS
      };

      state.latestPacket = fallback;
      state.latestReport = fallback;
      state.latestPacketText = composePacketText(fallback);
      state.latestCompactManifestText = composeCompactManifest(fallback);
      state.latestSuperCompactManifestText = composeSuperCompactManifest(fallback);
      publishAliases();

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: fallback.SOUTH_FINAL_CONCLUSION_REASON,
        packet: fallback,
        report: fallback,
        REPORT_OBJECT: fallback,
        packetText: state.latestPacketText,
        compactManifestText: state.latestCompactManifestText,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }
  }

  function run(input = {}) {
    return runSouthPacketOutput(input);
  }

  function runDiagnostic(input = {}) {
    return runSouthPacketOutput(input);
  }

  function inspect(input = {}) {
    return runSouthPacketOutput(input);
  }

  function probe(input = {}) {
    return runSouthPacketOutput(input);
  }

  function measure(input = {}) {
    return runSouthPacketOutput(input);
  }

  function auditReceipt(input = {}) {
    return runSouthPacketOutput(input);
  }

  function segregateReceiptApi(input = {}) {
    const normalized = normalizeInput(input);
    const rawRef = storeRawEvidence("SEGREGATION_ONLY_INPUT", {
      rawObject: normalized.rawObject,
      rawText: normalized.rawText
    }, {
      source: normalized.source,
      sourceType: normalized.sourceType
    });

    const segregation = segregateReceipt(normalized);
    state.latestSegregatedReceiptIndex = clonePlain(segregation);
    state.latestRawRef = rawRef.ref;
    publishAliases();

    return segregation;
  }

  function collapseDuplicateStandardsApi(input = {}) {
    const normalized = normalizeInput(input);
    const rawRef = storeRawEvidence("DUPLICATE_COLLAPSE_ONLY_INPUT", {
      rawObject: normalized.rawObject,
      rawText: normalized.rawText
    }, {
      source: normalized.source,
      sourceType: normalized.sourceType
    });

    const report = collapseDuplicateStandards(normalized);
    state.latestDuplicateStandardCollapseReport = clonePlain(report);
    state.latestRawRef = rawRef.ref;
    publishAliases();

    return report;
  }

  function consumeSidecars(input = {}) {
    const normalized = normalizeInput(input);
    const report = consumeSouthSidecars(normalized, input || {});
    state.latestSidecarLensReport = clonePlain(report);
    publishAliases();
    return report;
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.latestReport) {
      return clonePlain(state.latestReport);
    }

    return runSouthPacketOutput(options || {}).report;
  }

  function getPacket(options = {}) {
    return getReport(options);
  }

  function getPacketText(options = {}) {
    if (options && options.refresh === false && state.latestPacketText) {
      return state.latestPacketText;
    }

    getReport(options);
    return state.latestPacketText;
  }

  function getCompactManifest(options = {}) {
    if (options && options.refresh === false && state.latestCompactManifestText) {
      return state.latestCompactManifestText;
    }

    getReport(options);
    return state.latestCompactManifestText;
  }

  function getCompactManifestText(options = {}) {
    return getCompactManifest(options);
  }

  function getSuperCompactManifestText(options = {}) {
    if (options && options.refresh === false && state.latestSuperCompactManifestText) {
      return state.latestSuperCompactManifestText;
    }

    getReport(options);
    return state.latestSuperCompactManifestText;
  }

  function getSegregatedReceiptIndex(options = {}) {
    if (options && options.refresh === false && state.latestSegregatedReceiptIndex) {
      return clonePlain(state.latestSegregatedReceiptIndex);
    }

    getReport(options);
    return clonePlain(state.latestSegregatedReceiptIndex || {});
  }

  function getDuplicateStandardCollapseReport(options = {}) {
    if (options && options.refresh === false && state.latestDuplicateStandardCollapseReport) {
      return clonePlain(state.latestDuplicateStandardCollapseReport);
    }

    getReport(options);
    return clonePlain(state.latestDuplicateStandardCollapseReport || {});
  }

  function getSidecarLensReport(options = {}) {
    if (options && options.refresh === false && state.latestSidecarLensReport) {
      return clonePlain(state.latestSidecarLensReport);
    }

    getReport(options);
    return clonePlain(state.latestSidecarLensReport || {});
  }

  function getRawReceiptStore() {
    return clonePlain(state.rawStore);
  }

  function getRawReceiptByRef(ref) {
    const target = state.rawStore.find((item) => item.ref === ref);
    return clonePlain(target || null);
  }

  function getConclusion(options = {}) {
    if (options && options.refresh === false && state.latestConclusion) {
      return clonePlain(state.latestConclusion);
    }

    getReport(options);
    return clonePlain(state.latestConclusion || {});
  }

  function getStatus() {
    return {
      role: state.role,
      profileClass: state.profileClass,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      loaded: true,
      southReceiptSegregationActive: true,
      southDuplicateStandardCollapseActive: true,
      southCopyableCompactManifestActive: true,
      southRawEvidenceReferenceStoreActive: true,
      southSidecarProcessingActive: true,
      southSidecarLensConsumptionActive: true,
      sidecarsArePrimaryReceiptParticipants: false,
      sidecarsAreInternalSouthProcessLenses: true,
      runCount: state.runCount,
      rawStoreCount: state.rawStore.length,
      latestRawRef: state.latestRawRef,
      latestRunAt: state.latestRunAt || "NEVER",
      latestConclusion: clonePlain(state.latestConclusion || {}),
      latestSidecarStatus: firstKnown(
        getRaw(state.latestPacket || {}, "SOUTH_SIDECAR_CONSUMPTION_STATUS", ""),
        "NOT_RUN"
      ),
      latestEvent: state.latestEvent,
      updatedAt: state.updatedAt || nowIso(),
      errorCount: state.errors.length,
      ...NO_CLAIMS
    };
  }

  function getState() {
    return {
      ...getStatus(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptLight() {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_LIGHT_RECEIPT_v12",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      BASELINE_INTERNAL_RENEWAL_CONTRACT,
      BASELINE_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      ROLE: "SOUTH_PACKET_OUTPUT_HANDOFF",
      PROFILE_CLASS: "RECEIPT_SEGREGATION_SIDECAR_LENS_PACKET_MEANING_CARRIER",
      CYCLE_POSITION: "DIAGNOSTIC_TRACK_SOUTH_PACKET_OUTPUT_STAGE",
      GENERATED_AT: nowIso(),

      SOUTH_RECEIPT_SEGREGATION_ACTIVE: true,
      SOUTH_DUPLICATE_STANDARD_COLLAPSE_ACTIVE: true,
      SOUTH_COPYABLE_COMPACT_MANIFEST_ACTIVE: true,
      SOUTH_RAW_EVIDENCE_REFERENCE_STORE_ACTIVE: true,
      SOUTH_SIDECAR_PROCESSING_ACTIVE: true,
      SOUTH_SIDECAR_LENS_CONSUMPTION_ACTIVE: true,
      SOUTH_SURFACE_POINTER_SIDECAR_EXPECTED: true,
      SOUTH_SURFACE_POINTER_FILE,
      SIDE_CARS_DO_NOT_NEED_TOP_LEVEL_RECEIPT_PARTICIPATION: true,
      SIDE_CARS_MAY_INFORM_SOUTH_PROCESS_CONCLUSION: true,
      SIDE_CARS_ARE_INTERNAL_SOUTH_PROCESS_LENSES: true,
      SOUTH_SIDECARS_ARE_PRIMARY_RECEIPT_PARTICIPANTS: false,
      SOUTH_SIDECARS_ARE_INTERNAL_PROCESS_LENSES: true,

      RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE: true,
      GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE: true,
      GAUGES_DO_NOT_REPLACE_RECEIPTS: true,
      GAUGES_AUTHORIZE_REPAIR: false,

      DEFAULT_COPY_SURFACE: "COMPACT_MANIFEST",
      FULL_RECEIPT_IS_NOT_DEFAULT_COPY_SURFACE: true,
      DUPLICATE_STANDARDS_COLLAPSED:
        Boolean(
          state.latestDuplicateStandardCollapseReport &&
          state.latestDuplicateStandardCollapseReport.DUPLICATE_STANDARDS_COLLAPSED
        ),
      RAW_EVIDENCE_PRESERVED_BY_REFERENCE: true,
      RAW_STORE_COUNT: state.rawStore.length,
      LAST_RAW_REF: state.latestRawRef,
      LAST_RUN_AT: state.latestRunAt || "NEVER",

      SOUTH_FINAL_CONCLUSION: firstKnown(
        getRaw(state.latestConclusion || {}, "SOUTH_FINAL_CONCLUSION", ""),
        "NOT_RUN"
      ),
      SOUTH_SIDECAR_CONSUMPTION_STATUS: firstKnown(
        getRaw(state.latestPacket || {}, "SOUTH_SIDECAR_CONSUMPTION_STATUS", ""),
        "NOT_RUN"
      ),
      SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR: boolValue(
        getRaw(state.latestPacket || {}, "SOUTH_CONCLUSION_MODIFIED_BY_SIDECAR", false),
        false
      ),

      runApiAvailable: true,
      runDiagnosticApiAvailable: true,
      inspectApiAvailable: true,
      probeApiAvailable: true,
      measureApiAvailable: true,
      auditReceiptApiAvailable: true,
      segregateReceiptApiAvailable: true,
      collapseDuplicateStandardsApiAvailable: true,
      consumeSidecarsApiAvailable: true,
      getReportApiAvailable: true,
      getPacketApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactManifestApiAvailable: true,
      getCompactManifestTextApiAvailable: true,
      getSuperCompactManifestTextApiAvailable: true,
      getSegregatedReceiptIndexApiAvailable: true,
      getDuplicateStandardCollapseReportApiAvailable: true,
      getSidecarLensReportApiAvailable: true,
      getRawReceiptStoreApiAvailable: true,
      getRawReceiptByRefApiAvailable: true,
      getConclusionApiAvailable: true,
      getStatusApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      TRUTH_AUTHORITY: false,
      FINAL_ARBITRATION: false,
      REPAIR_AUTHORIZATION: false,
      GAUGE_VERDICT_REPLACEMENT: false,
      NORTH_GRAMMAR_AUTHORITY: false,
      WEST_DERIVATIVE_MAP_AUTHORITY: false,
      CANVAS_BUILD_AUTHORITY: false,
      CANVAS_PRODUCTION_REPAIR_AUTHORITY: false,
      FORCED_RECEIPT_RETURN: false,

      truthAuthorityClaimed: false,
      finalArbitrationClaimed: false,
      repairAuthorizationClaimed: false,
      gaugeVerdictReplacementClaimed: false,
      northGrammarAuthorityClaimed: false,
      westDerivativeMapAuthorityClaimed: false,
      canvasBuildAuthorityClaimed: false,
      canvasProductionRepairAuthorityClaimed: false,
      forcedReceiptReturnClaimed: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      canonicalStandards: {
        CANONICAL_NO_CLAIM_STANDARD: {
          id: "CANONICAL_NO_CLAIM_STANDARD",
          status: "ACTIVE",
          description:
            "No production mutation, no Hearth repair, no runtime restart, no Canvas release, no F13, no F21, no F55, no ready text, no visual pass.",
          fields: CANONICAL_NO_CLAIM_FIELDS.slice(),
          canonicalValue: false
        },
        CANONICAL_ROUTE_METADATA_STANDARD: {
          id: "CANONICAL_ROUTE_METADATA_STANDARD",
          status: "ACTIVE",
          fields: ROUTE_METADATA_FIELDS.slice()
        },
        CANONICAL_GAUGE_RECEIPT_LAW_STANDARD: {
          id: "CANONICAL_GAUGE_RECEIPT_LAW_STANDARD",
          status: "ACTIVE",
          fields: GAUGE_RECEIPT_LAW_FIELDS.slice(),
          laws: {
            RECEIPTS_ARE_SPECIFIC_DIAGNOSTIC_EVIDENCE: true,
            GAUGES_ARE_COLLECTIVE_DIAGNOSTIC_VARIANCE: true,
            GAUGES_DO_NOT_REPLACE_RECEIPTS: true,
            GAUGES_AUTHORIZE_REPAIR: false
          }
        },
        CANONICAL_SOUTH_BOUNDARY_STANDARD: {
          id: "CANONICAL_SOUTH_BOUNDARY_STANDARD",
          status: "ACTIVE",
          laws: {
            SOUTH_MAY_SEGREGATE_RECEIPTS: true,
            SOUTH_MAY_COLLAPSE_DUPLICATE_STANDARDS: true,
            SOUTH_MAY_PRODUCE_COPYABLE_MANIFEST: true,
            SOUTH_MAY_PRESERVE_RAW_EVIDENCE_BY_REFERENCE: true,
            SOUTH_MAY_CONSUME_SIDECARS_AS_INTERNAL_PROCESS_LENSES: true,
            SOUTH_MAY_REFLECT_SIDECAR_CONCLUSION_IN_SOUTH_PACKET_MEANING: true,
            SOUTH_MAY_NOT_PROMOTE_SIDECARS_TO_PRIMARY_RECEIPT_PARTICIPANTS: true,
            SOUTH_MAY_NOT_CHANGE_DIAGNOSTIC_FACTS: true,
            SOUTH_MAY_NOT_FINAL_ARBITRATE: true,
            SOUTH_MAY_NOT_AUTHORIZE_REPAIR: true
          }
        }
      },

      sectionDefinitions: clonePlain(SECTION_DEFINITIONS),
      latestCompactManifestText: state.latestCompactManifestText,
      latestSuperCompactManifestText: state.latestSuperCompactManifestText,
      latestConclusion: clonePlain(state.latestConclusion || {}),
      latestSidecarLensReport: clonePlain(state.latestSidecarLensReport || {}),
      latestSegregatedReceiptIndexSummary: state.latestSegregatedReceiptIndex
        ? {
            PACKET_NAME: state.latestSegregatedReceiptIndex.PACKET_NAME,
            RECEIPT_WEIGHT_CLASS: state.latestSegregatedReceiptIndex.RECEIPT_WEIGHT_CLASS,
            PRESENT_SECTION_COUNT: state.latestSegregatedReceiptIndex.PRESENT_SECTION_COUNT,
            EMPTY_SECTION_COUNT: state.latestSegregatedReceiptIndex.EMPTY_SECTION_COUNT,
            PRESENT_SECTIONS: state.latestSegregatedReceiptIndex.PRESENT_SECTIONS
          }
        : {},
      latestDuplicateStandardCollapseSummary: state.latestDuplicateStandardCollapseReport
        ? {
            PACKET_NAME: state.latestDuplicateStandardCollapseReport.PACKET_NAME,
            DUPLICATE_STANDARD_COLLAPSE_STATUS:
              state.latestDuplicateStandardCollapseReport.DUPLICATE_STANDARD_COLLAPSE_STATUS,
            DUPLICATE_STANDARDS_COLLAPSED:
              state.latestDuplicateStandardCollapseReport.DUPLICATE_STANDARDS_COLLAPSED,
            TOTAL_COLLAPSED_STANDARD_CLASSES:
              state.latestDuplicateStandardCollapseReport.TOTAL_COLLAPSED_STANDARD_CLASSES
          }
        : {},
      state: getStatus(),
      errors: clonePlain(state.errors),
      events: clonePlain(state.events)
    };
  }

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthRail = api;
    root.HEARTH.JUDGE_SOUTH_PACKET_OUTPUT = api;
    root.HEARTH.southPacketOutputRail = api;
    root.HEARTH.southReceiptSegregator = api;
    root.HEARTH.southSidecarLensConsumer = api;

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = api;
    root.HEARTH_JUDGE_SOUTH_PACKET_OUTPUT = api;
    root.HEARTH_SOUTH_RECEIPT_SEGREGATOR = api;
    root.HEARTH_SOUTH_SIDECAR_LENS_CONSUMER = api;

    root.DEXTER_LAB.hearthDiagnosticSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = api;
    root.DEXTER_LAB.hearthSouthReceiptSegregator = api;
    root.DEXTER_LAB.hearthSouthSidecarLensConsumer = api;

    const receipt = getReceiptLight();
    state.receiptPublishCount += 1;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_LIGHT_RECEIPT = receipt;
    root.HEARTH_SOUTH_SIDECAR_LENS_RECEIPT = receipt;

    root.HEARTH.diagnosticSouthReceipt = receipt;
    root.HEARTH.diagnosticRailSouthReceipt = receipt;
    root.HEARTH.southSidecarLensReceipt = receipt;

    root.DEXTER_LAB.hearthDiagnosticSouthReceipt = receipt;
    root.DEXTER_LAB.hearthSouthSidecarLensReceipt = receipt;

    if (state.latestPacket) {
      root.HEARTH_DIAGNOSTIC_SOUTH_PACKET = clonePlain(state.latestPacket);
      root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(state.latestReport || {});
      root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = state.latestPacketText;
      root.HEARTH_DIAGNOSTIC_SOUTH_COMPACT_MANIFEST =
        state.latestCompactManifestText;
      root.HEARTH_DIAGNOSTIC_SOUTH_SUPER_COMPACT_MANIFEST =
        state.latestSuperCompactManifestText;
      root.HEARTH_DIAGNOSTIC_SOUTH_SEGREGATED_RECEIPT_INDEX =
        clonePlain(state.latestSegregatedReceiptIndex || {});
      root.HEARTH_DIAGNOSTIC_SOUTH_DUPLICATE_STANDARD_COLLAPSE_REPORT =
        clonePlain(state.latestDuplicateStandardCollapseReport || {});
      root.HEARTH_DIAGNOSTIC_SOUTH_SIDECAR_LENS_REPORT =
        clonePlain(state.latestSidecarLensReport || {});
    }

    state.aliasPublishCount += 1;
    state.updatedAt = state.updatedAt || nowIso();

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
    baselineInternalRenewalReceipt: BASELINE_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    role: "SOUTH_PACKET_OUTPUT_HANDOFF",
    profileClass: "RECEIPT_SEGREGATION_SIDECAR_LENS_PACKET_MEANING_CARRIER",
    cyclePosition: "DIAGNOSTIC_TRACK_SOUTH_PACKET_OUTPUT_STAGE",

    southSurfacePointerFile: SOUTH_SURFACE_POINTER_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    northRailFile: NORTH_RAIL_FILE,
    eastRailFile: EAST_RAIL_FILE,
    westRailFile: WEST_RAIL_FILE,
    labNorthFile: LAB_NORTH_FILE,
    labWestFile: LAB_WEST_FILE,
    surfaceTruthProbeFile: SURFACE_TRUTH_PROBE_FILE,

    southReceiptSegregationActive: true,
    southDuplicateStandardCollapseActive: true,
    southCopyableCompactManifestActive: true,
    southRawEvidenceReferenceStoreActive: true,
    southSidecarProcessingActive: true,
    southSidecarLensConsumptionActive: true,
    southSurfacePointerSidecarExpected: true,
    sidecarsArePrimaryReceiptParticipants: false,
    sidecarsAreInternalSouthProcessLenses: true,

    runSouthPacketOutput,
    run,
    runDiagnostic,
    inspect,
    probe,
    measure,
    auditReceipt,
    segregateReceipt: segregateReceiptApi,
    collapseDuplicateStandards: collapseDuplicateStandardsApi,
    consumeSidecars,

    getReport,
    getPacket,
    getPacketText,
    getCompactManifest,
    getCompactManifestText,
    getSuperCompactManifestText,
    getSegregatedReceiptIndex,
    getDuplicateStandardCollapseReport,
    getSidecarLensReport,
    getRawReceiptStore,
    getRawReceiptByRef,
    getConclusion,
    getStatus,
    getState,
    getReceipt,
    getReceiptLight,
    publishAliases,

    runApiAvailable: true,
    runDiagnosticApiAvailable: true,
    inspectApiAvailable: true,
    probeApiAvailable: true,
    measureApiAvailable: true,
    auditReceiptApiAvailable: true,
    segregateReceiptApiAvailable: true,
    collapseDuplicateStandardsApiAvailable: true,
    consumeSidecarsApiAvailable: true,
    getReportApiAvailable: true,
    getPacketApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactManifestApiAvailable: true,
    getCompactManifestTextApiAvailable: true,
    getSuperCompactManifestTextApiAvailable: true,
    getSegregatedReceiptIndexApiAvailable: true,
    getDuplicateStandardCollapseReportApiAvailable: true,
    getSidecarLensReportApiAvailable: true,
    getRawReceiptStoreApiAvailable: true,
    getRawReceiptByRefApiAvailable: true,
    getConclusionApiAvailable: true,
    getStatusApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    truthAuthority: false,
    finalArbitration: false,
    repairAuthorization: false,
    gaugeVerdictReplacement: false,
    northGrammarAuthority: false,
    westDerivativeMapAuthority: false,
    canvasBuildAuthority: false,
    canvasProductionRepairAuthority: false,
    forcedReceiptReturn: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get report() {
      return getReport({ refresh: false });
    },

    get packet() {
      return getPacket({ refresh: false });
    },

    get receiptObject() {
      return getReceiptLight();
    },

    get compactManifest() {
      return getCompactManifest({ refresh: false });
    },

    get packetText() {
      return getPacketText({ refresh: false });
    }
  });

  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
