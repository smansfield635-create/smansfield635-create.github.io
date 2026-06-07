// /assets/hearth/hearth.diagnostic.south.surface.pointer.js
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_TNT_v2
// Full-file replacement.
// Diagnostic South Surface Pointer sidecar only.
//
// Purpose:
// - Preserve the public v1 South Surface Pointer sidecar contract expected by Probe South.
// - Pair with /assets/hearth/hearth.canvas.finger.inspect.js v2 without replacing it.
// - Split responsibility:
//   * Canvas Finger Inspect owns surface identity evidence, pointer/receiver evidence,
//     Hex Surface receiver proof, and canvas pixel observation.
//   * South Surface Pointer consumes that evidence and classifies what kind of surface
//     was inspected before Canvas is blamed.
// - Distinguish production canvas from temporary image, inner-scope feed, diagnostic
//   frame surface, and unknown/misaligned surface.
// - Prevent premature Canvas blame unless the inspected surface is confirmed as the
//   production Hearth canvas.
// - Publish stable aliases and packet text for Probe South / South Rail consumption.
// - Preserve asymmetric tenth-sidecar status outside the nine-step chronology.
// - Preserve read-only diagnostic behavior.
//
// Does not own:
// - diagnostic North chronology
// - South packet output
// - Probe South packet meaning
// - production mutation
// - route conductor mutation
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - Canvas release
// - controls
// - runtime restart
// - terrain/material/hydrology/elevation truth
// - Hex truth
// - Pointer Finger truth
// - final visual pass
// - F13/F21/F55 claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_TNT_v2";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_RECEIPT_v2";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_RECEIPT_v1";

  const VERSION =
    "2026-06-07.hearth-diagnostic-south-surface-pointer-canvas-feed-classifier-v2";

  const FILE = "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_FINGER_INSPECT_FILE =
    "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE =
    "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_FILE =
    "/assets/hearth/hearth.canvas.finger.inspect.js";

  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_PACKET_v2";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_FINGER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";
  const EXPECTED_FINGER_INSPECT_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_TNT_v2";
  const EXPECTED_PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";

  const SURFACE_CLASS = Object.freeze({
    PRODUCTION_CANVAS: "PRODUCTION_CANVAS_SURFACE",
    TEMPORARY_IMAGE: "TEMPORARY_IMAGE_SURFACE",
    INNER_SCOPE_FEED: "INNER_SCOPE_FEED_SURFACE",
    DIAGNOSTIC_FRAME: "DIAGNOSTIC_FRAME_SURFACE",
    UNKNOWN: "UNKNOWN_OR_MISALIGNED_SURFACE"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13ClaimedBySidecar: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedBySidecar: false,
    f21SubmittedToNorth: false,
    f55ClaimedBySidecar: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CLAIMED_BY_SIDECAR: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_SIDECAR: false,
    F21_SUBMITTED_TO_NORTH: false,
    F55_CLAIMED_BY_SIDECAR: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const FINGER_INSPECT_ALIASES = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.canvasFingerExpressionInspect",
    "HEARTH.diagnosticCanvasFingerInspect",
    "HEARTH.hearthCanvasFingerInspect",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "HEARTH.hexGatePointerFingerInspectReceiver",
    "HEARTH.hexSurfacePointerFingerReceiver",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerInspector",
    "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver",
    "DEXTER_LAB.hearthHexSurfacePointerFingerReceiver",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECTOR",
    "HEARTH_DIAGNOSTIC_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_GATE_POINTER_FINGER_INSPECT_RECEIVER"
  ]);

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasAuthority",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_VISIBLE_PLANET"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    asymmetricTenthDiagnosticSidecar: true,
    chronologyOwner: false,
    nineCycleMutation: false,
    replacesSouthRail: false,
    replacesProbeSouth: false,
    operationalDependencyForNorth: false,
    readableByProbeSouth: true,

    splitResponsibilityActive: true,
    consumesCanvasFingerInspectEvidence: true,
    publishesProbeSouthClassifierPacket: true,
    classifiesSurfaceBeforeCanvasBlame: true,
    canvasBlameRequiresProductionCanvasConfirmation: true,

    latestSurfaceClass: SURFACE_CLASS.UNKNOWN,
    latestCanvasBlameEligible: false,
    latestRecommendedOwner: "UNKNOWN",
    latestRecommendedFile: "UNKNOWN",
    latestRecommendedAction: "UNKNOWN",
    latestInterpretation: "NOT_RUN",

    runCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    receivedFingerReportCount: 0,
    latestEvent: "SOUTH_SURFACE_POINTER_CLASSIFIER_LOADED",
    updatedAt: "",
    lastReport: null,
    lastPacketText: "",
    lastCompactSummary: "",
    lastFingerInspectEvidence: null,
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

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function bounded(value, limit = 3000) {
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

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
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
      event: safeString(event, "SOUTH_SURFACE_POINTER_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 80);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SOUTH_SURFACE_POINTER_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1600),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 40);
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
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readField(source, keys, fallback = "") {
    const obj = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys || []) {
      try {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
      } catch (_error) {}

      const lower = safeString(key).toLowerCase();
      try {
        for (const candidate of Object.keys(obj)) {
          if (candidate.toLowerCase() === lower) {
            const value = obj[candidate];
            if (value !== undefined && value !== null && value !== "") return value;
          }
        }
      } catch (_error) {}
    }

    return fallback;
  }

  function contractOf(value) {
    return firstKnown(
      readField(value, [
        "contract",
        "CONTRACT",
        "canvasContract",
        "currentCanvasParentContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "sourceContract",
        "implementationContract",
        "internalImplementationContract",
        "internalRenewalContract",
        "INTERNAL_RENEWAL_CONTRACT"
      ], ""),
      "UNKNOWN"
    );
  }

  function receiptOf(value) {
    return firstKnown(
      readField(value, [
        "receipt",
        "RECEIPT",
        "canvasReceipt",
        "currentCanvasParentReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "sourceReceipt",
        "implementationReceipt",
        "internalImplementationReceipt",
        "internalRenewalReceipt",
        "INTERNAL_RENEWAL_RECEIPT"
      ], ""),
      "UNKNOWN"
    );
  }

  function safeMethodList(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return [];

    try {
      return Object.keys(value)
        .filter((key) => isFunction(value[key]))
        .sort()
        .slice(0, 80);
    } catch (_error) {
      return [];
    }
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const getters = [
      ["getReport", { refresh: false }],
      ["getReceiptLight", null],
      ["getReceipt", null],
      ["getState", null],
      ["report", null],
      ["receiptObject", null]
    ];

    for (const entry of getters) {
      const method = entry[0];
      const arg = entry[1];

      if (method === "report" || method === "receiptObject") {
        try {
          if (isObject(authority[method])) return authority[method];
        } catch (_error) {}
        continue;
      }

      if (!isFunction(authority[method])) continue;

      try {
        const output = arg === null ? authority[method]() : authority[method](arg);
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
  }

  function inspectAuthority(paths) {
    const found = firstGlobal(paths);
    const authority = found.value;
    const receipt = readAuthorityReceipt(authority) || {};

    return {
      observed: Boolean(authority),
      path: found.path,
      contract: firstKnown(contractOf(receipt), contractOf(authority), "UNKNOWN"),
      receipt: firstKnown(receiptOf(receipt), receiptOf(authority), "UNKNOWN"),
      internalRenewalContract: firstKnown(
        getRaw(receipt, "INTERNAL_RENEWAL_CONTRACT", undefined),
        getRaw(receipt, "internalRenewalContract", undefined),
        getRaw(authority, "internalRenewalContract", undefined),
        "UNKNOWN"
      ),
      internalRenewalReceipt: firstKnown(
        getRaw(receipt, "INTERNAL_RENEWAL_RECEIPT", undefined),
        getRaw(receipt, "internalRenewalReceipt", undefined),
        getRaw(authority, "internalRenewalReceipt", undefined),
        "UNKNOWN"
      ),
      methodCount: safeMethodList(authority).length,
      methods: safeMethodList(authority),
      receiptObject: clonePlain(receipt)
    };
  }

  function readFingerInspectEvidence(input = {}) {
    if (isObject(input.fingerInspectEvidence)) {
      state.receivedFingerReportCount += 1;
      return {
        source: "INPUT_FINGER_INSPECT_EVIDENCE",
        authority: inspectAuthority(FINGER_INSPECT_ALIASES),
        report: clonePlain(input.fingerInspectEvidence)
      };
    }

    if (isObject(input.fingerInspectReport)) {
      state.receivedFingerReportCount += 1;
      return {
        source: "INPUT_FINGER_INSPECT_REPORT",
        authority: inspectAuthority(FINGER_INSPECT_ALIASES),
        report: clonePlain(input.fingerInspectReport)
      };
    }

    const authority = inspectAuthority(FINGER_INSPECT_ALIASES);
    let report = {};

    const value = readPath(authority.path);

    if (value && isFunction(value.getReport)) {
      try {
        const output = value.getReport({ refresh: false });
        if (isObject(output)) report = output;
      } catch (_error) {}
    }

    if (!isObject(report) || Object.keys(report).length === 0) {
      report = clonePlain(authority.receiptObject || {});
    }

    return {
      source: authority.observed
        ? "FINGER_INSPECT_ALIAS_REPORT_OR_RECEIPT"
        : "FINGER_INSPECT_NOT_OBSERVED",
      authority,
      report: isObject(report) ? report : {}
    };
  }

  function extractCurrentReport(input = {}) {
    if (isObject(input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input.report)) return clonePlain(input.report);
    if (isObject(input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    return {};
  }

  function q(selector) {
    if (!doc || !selector || !doc.querySelector) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function queryFirst(selectors) {
    for (const selector of selectors || []) {
      const node = q(selector);
      if (node) return { selector, node };
    }

    return { selector: "NONE", node: null };
  }

  function classifyDomNode(node, selector) {
    if (!node) {
      return {
        domClass: SURFACE_CLASS.UNKNOWN,
        domReason: "NO_DOM_NODE_AVAILABLE",
        domSelector: selector || "NONE"
      };
    }

    const tag = safeString(node.tagName).toLowerCase();
    const id = safeString(node.id);
    const className = safeString(node.className);
    const dataset = node.dataset || {};
    const selectorText = safeString(selector);

    let inProductionMount = false;
    let inDiagnosticSurface = false;

    try {
      inProductionMount = Boolean(node.closest && node.closest("#hearthCanvasMount"));
    } catch (_error) {}

    try {
      inDiagnosticSurface = Boolean(
        node.closest &&
        (
          node.closest("#diagnostic-main") ||
          node.closest("[data-hearth-diagnostic-rail]") ||
          node.closest("[data-diagnostic-route]") ||
          node.closest("[data-hearth-diagnostic]")
        )
      );
    } catch (_error) {}

    const text = [
      tag,
      id,
      className,
      selectorText,
      dataset.hearthSurfaceClass,
      dataset.hearthSurfaceRole,
      dataset.hearthFeedType,
      dataset.hearthImageType
    ].join(" ").toLowerCase();

    const generated =
      boolValue(dataset.generatedImage, false) ||
      boolValue(dataset.hearthTemporaryImage, false) ||
      boolValue(dataset.hearthTempImage, false) ||
      /temporary|temp-image|snapshot|preview-image|generated-image/.test(text);

    const innerFeed =
      boolValue(dataset.hearthInnerScopeFeed, false) ||
      boolValue(dataset.hearthCanvasFeed, false) ||
      boolValue(dataset.hearthExpressionFeed, false) ||
      /inner-scope|innerscope|canvas-feed|expression-feed|feed-surface|source-feed/.test(text);

    const production =
      tag === "canvas" &&
      (
        id === "hearthVisibleCanvas" ||
        inProductionMount ||
        boolValue(dataset.hearthVisibleCanvas, false) ||
        boolValue(dataset.hearthCanvasHub, false) ||
        boolValue(dataset.hearthCanvas, false) ||
        boolValue(dataset.hearthPlanetCanvas, false) ||
        boolValue(dataset.hearthDomSurface, false) ||
        selectorText === "#hearthCanvasMount canvas" ||
        selectorText.includes("#hearthCanvasMount")
      ) &&
      !generated &&
      !innerFeed;

    if (inDiagnosticSurface || /diagnostic/.test(text)) {
      return {
        domClass: SURFACE_CLASS.DIAGNOSTIC_FRAME,
        domReason: "DOM_NODE_IS_INSIDE_DIAGNOSTIC_SURFACE_OR_MARKED_DIAGNOSTIC",
        domSelector: selectorText || "DOM_NODE"
      };
    }

    if (generated || tag === "img") {
      return {
        domClass: SURFACE_CLASS.TEMPORARY_IMAGE,
        domReason: tag === "img"
          ? "DOM_NODE_IS_IMAGE_NOT_PRODUCTION_CANVAS"
          : "DOM_NODE_MARKED_TEMPORARY_OR_GENERATED_IMAGE",
        domSelector: selectorText || "DOM_NODE"
      };
    }

    if (innerFeed) {
      return {
        domClass: SURFACE_CLASS.INNER_SCOPE_FEED,
        domReason: "DOM_NODE_MARKED_AS_INNER_SCOPE_OR_EXPRESSION_FEED",
        domSelector: selectorText || "DOM_NODE"
      };
    }

    if (production) {
      return {
        domClass: SURFACE_CLASS.PRODUCTION_CANVAS,
        domReason: "DOM_NODE_MATCHES_HEARTH_PRODUCTION_CANVAS_MOUNT_OR_DATASET",
        domSelector: selectorText || "DOM_NODE"
      };
    }

    return {
      domClass: SURFACE_CLASS.UNKNOWN,
      domReason: "DOM_NODE_DID_NOT_MATCH_PRODUCTION_TEMPORARY_INNER_SCOPE_OR_DIAGNOSTIC_CLASS",
      domSelector: selectorText || "DOM_NODE"
    };
  }

  function classifyFromEvidence(fingerReport = {}, currentReport = {}) {
    const selector = firstKnown(
      getRaw(fingerReport, "CANVAS_SELECTOR", undefined),
      getRaw(fingerReport, "canvasSelector", undefined),
      getRaw(fingerReport, "EXPRESSION_SURFACE_SELECTOR", undefined),
      getRaw(currentReport, "CANVAS_SELECTOR", undefined),
      getRaw(currentReport, "canvasSelector", undefined),
      "#hearthCanvasMount canvas",
      "UNKNOWN"
    );

    const datasetContract = firstKnown(
      getRaw(fingerReport, "CANVAS_DATASET_CONTRACT", undefined),
      getRaw(fingerReport, "canvasDatasetContract", undefined),
      getRaw(currentReport, "CANVAS_DATASET_CONTRACT", undefined),
      getRaw(currentReport, "CURRENT_CANVAS_PARENT_CONTRACT", undefined),
      "UNKNOWN"
    );

    const pixelStatus = firstKnown(
      getRaw(fingerReport, "CANVAS_PIXEL_SAMPLE_STATUS", undefined),
      getRaw(fingerReport, "canvasPixelSampleStatus", undefined),
      getRaw(currentReport, "CANVAS_PIXEL_SAMPLE_STATUS", undefined),
      getRaw(currentReport, "CANVAS_PIXEL_VARIANCE_STATUS", undefined),
      "UNKNOWN"
    );

    const pixelVisible = firstKnown(
      getRaw(fingerReport, "CANVAS_PIXEL_VISIBLE", undefined),
      getRaw(fingerReport, "canvasPixelVisible", undefined),
      getRaw(currentReport, "CANVAS_PIXEL_VISIBLE", undefined),
      getRaw(currentReport, "CANVAS_PIXEL_NONEMPTY", undefined),
      "UNKNOWN"
    );

    const viewportIntersecting = firstKnown(
      getRaw(fingerReport, "CANVAS_VIEWPORT_INTERSECTING", undefined),
      getRaw(fingerReport, "canvasViewportIntersecting", undefined),
      getRaw(currentReport, "CANVAS_VIEWPORT_INTERSECTING", undefined),
      "UNKNOWN"
    );

    const downstreamStatus = firstKnown(
      getRaw(fingerReport, "DOWNSTREAM_EXPRESSION_SET_STATUS", undefined),
      getRaw(currentReport, "DOWNSTREAM_EXPRESSION_SET_STATUS", undefined),
      "UNKNOWN"
    );

    const downstreamClass = firstKnown(
      getRaw(fingerReport, "DOWNSTREAM_EXPRESSION_VERDICT_CLASS", undefined),
      getRaw(currentReport, "DOWNSTREAM_EXPRESSION_VERDICT_CLASS", undefined),
      "UNKNOWN"
    );

    const downstreamRecommendedFile = firstKnown(
      getRaw(fingerReport, "DOWNSTREAM_RECOMMENDED_FILE", undefined),
      getRaw(currentReport, "DOWNSTREAM_RECOMMENDED_FILE", undefined),
      "UNKNOWN"
    );

    const generatedImage = boolValue(
      firstKnown(
        getRaw(fingerReport, "GENERATED_IMAGE", undefined),
        getRaw(fingerReport, "generatedImage", undefined),
        getRaw(currentReport, "GENERATED_IMAGE", undefined),
        getRaw(currentReport, "generatedImage", undefined),
        "false"
      ),
      false
    );

    const visiblePlanetProofSource = firstKnown(
      getRaw(currentReport, "VISIBLE_PLANET_PROOF_SOURCE", undefined),
      getRaw(currentReport, "CANVAS_EXPRESSION_PROOF_STATUS", undefined),
      getRaw(fingerReport, "CANVAS_PIXEL_SAMPLE_REASON", undefined),
      "UNKNOWN"
    );

    const selectorLower = selector.toLowerCase();
    const contractLower = datasetContract.toLowerCase();
    const proofLower = visiblePlanetProofSource.toLowerCase();

    let evidenceClass = SURFACE_CLASS.UNKNOWN;
    let evidenceReason = "NO_RECOGNIZED_EVIDENCE_CLASS";

    if (
      selectorLower.includes("#hearthcanvasmount") ||
      selectorLower.includes("#hearthvisiblecanvas") ||
      selectorLower.includes("data-hearth-visible-canvas") ||
      selectorLower.includes("data-hearth-canvas-hub") ||
      contractLower.includes("hearth_canvas")
    ) {
      evidenceClass = SURFACE_CLASS.PRODUCTION_CANVAS;
      evidenceReason = "EVIDENCE_SELECTOR_OR_CONTRACT_MATCHES_PRODUCTION_HEARTH_CANVAS";
    }

    if (
      generatedImage ||
      selectorLower.includes("img") ||
      selectorLower.includes("temporary") ||
      selectorLower.includes("snapshot") ||
      selectorLower.includes("preview")
    ) {
      evidenceClass = SURFACE_CLASS.TEMPORARY_IMAGE;
      evidenceReason = "EVIDENCE_MARKS_TEMPORARY_IMAGE_OR_GENERATED_IMAGE";
    }

    if (
      selectorLower.includes("inner-scope") ||
      selectorLower.includes("innerscope") ||
      selectorLower.includes("feed") ||
      proofLower.includes("namespace") ||
      proofLower.includes("bishop") ||
      proofLower.includes("inner")
    ) {
      evidenceClass = SURFACE_CLASS.INNER_SCOPE_FEED;
      evidenceReason = "EVIDENCE_MARKS_INNER_SCOPE_OR_NAMESPACE_FEED";
    }

    if (
      selectorLower.includes("diagnostic") ||
      proofLower.includes("diagnostic-frame") ||
      proofLower.includes("diagnostic")
    ) {
      evidenceClass = SURFACE_CLASS.DIAGNOSTIC_FRAME;
      evidenceReason = "EVIDENCE_MARKS_DIAGNOSTIC_FRAME_SURFACE";
    }

    let domClassification = {
      domClass: SURFACE_CLASS.UNKNOWN,
      domReason: "DOM_NOT_QUERIED_OR_NOT_AVAILABLE",
      domSelector: "NONE"
    };

    if (doc) {
      const queried = queryFirst([
        selector,
        "#hearthVisibleCanvas",
        "#hearthCanvasMount canvas",
        "canvas[data-hearth-visible-canvas='true']",
        "canvas[data-hearth-canvas-hub='true']",
        "canvas[data-hearth-canvas='true']",
        "img[data-hearth-temporary-image='true']",
        "[data-hearth-inner-scope-feed='true']",
        "[data-hearth-diagnostic-surface='true']"
      ]);

      domClassification = classifyDomNode(queried.node, queried.selector);
    }

    let finalClass = evidenceClass;
    let finalReason = evidenceReason;
    let classificationSource = "FINGER_INSPECT_OR_CURRENT_REPORT_EVIDENCE";

    if (finalClass === SURFACE_CLASS.UNKNOWN && domClassification.domClass !== SURFACE_CLASS.UNKNOWN) {
      finalClass = domClassification.domClass;
      finalReason = domClassification.domReason;
      classificationSource = "DOM_CLASSIFICATION_FALLBACK";
    }

    if (
      finalClass === SURFACE_CLASS.PRODUCTION_CANVAS &&
      domClassification.domClass !== SURFACE_CLASS.UNKNOWN &&
      domClassification.domClass !== SURFACE_CLASS.PRODUCTION_CANVAS
    ) {
      finalClass = domClassification.domClass;
      finalReason =
        "DOM_CLASSIFICATION_OVERRIDES_PRODUCTION_ASSUMPTION:" +
        domClassification.domReason;
      classificationSource = "DOM_CLASSIFICATION_OVERRIDE";
    }

    const pixelBlank =
      pixelStatus === "PIXEL_SAMPLE_BLANK" ||
      pixelStatus === "PIXEL_EMPTY_OR_TRANSPARENT" ||
      pixelStatus === "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK" ||
      boolValue(pixelVisible, true) === false;

    const pixelVisibleConfirmed =
      pixelStatus === "PIXEL_SAMPLE_VISIBLE" ||
      pixelStatus === "PIXEL_SAMPLE_NONEMPTY" ||
      pixelStatus === "PIXEL_VARIANCE_PRESENT" ||
      boolValue(pixelVisible, false) === true;

    return {
      surfaceClass: finalClass,
      classificationSource,
      classificationReason: finalReason,
      domClassification,
      selector,
      datasetContract,
      pixelStatus,
      pixelVisible,
      pixelBlank,
      pixelVisibleConfirmed,
      viewportIntersecting,
      downstreamStatus,
      downstreamClass,
      downstreamRecommendedFile,
      visiblePlanetProofSource
    };
  }

  function deriveInterpretation(classification, fingerEvidence) {
    const surfaceClass = classification.surfaceClass;
    const pixelBlank = classification.pixelBlank;
    const pixelVisibleConfirmed = classification.pixelVisibleConfirmed;
    const viewportIntersecting = boolValue(classification.viewportIntersecting, true);
    const downstreamClass = classification.downstreamClass;
    const receivedCount = safeNumber(
      getRaw(fingerEvidence.report, "RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT", 0),
      0
    );

    if (surfaceClass !== SURFACE_CLASS.PRODUCTION_CANVAS) {
      return {
        canvasBlameEligible: false,
        interpretation: "INSPECTED_SURFACE_IS_NOT_CONFIRMED_PRODUCTION_CANVAS",
        blameGateStatus: "CANVAS_BLAME_BLOCKED_SURFACE_CLASS_NOT_PRODUCTION_CANVAS",
        recommendedOwner:
          surfaceClass === SURFACE_CLASS.TEMPORARY_IMAGE
            ? "TEMPORARY_IMAGE_OR_PREVIEW_FEED"
            : surfaceClass === SURFACE_CLASS.INNER_SCOPE_FEED
              ? "INNER_SCOPE_EXPRESSION_FEED_OR_ADAPTER"
              : surfaceClass === SURFACE_CLASS.DIAGNOSTIC_FRAME
                ? "DIAGNOSTIC_FRAME_SURFACE"
                : "SURFACE_POINTER_CLASSIFICATION",
        recommendedFile:
          surfaceClass === SURFACE_CLASS.TEMPORARY_IMAGE
            ? PROBE_SOUTH_FILE
            : surfaceClass === SURFACE_CLASS.INNER_SCOPE_FEED
              ? CANVAS_FINGER_INSPECT_FILE
              : surfaceClass === SURFACE_CLASS.DIAGNOSTIC_FRAME
                ? SOUTH_RAIL_FILE
                : CANVAS_FINGER_INSPECT_FILE,
        recommendedAction:
          "DO_NOT_BLAME_CANVAS_UNTIL_PRODUCTION_CANVAS_SURFACE_IS_CONFIRMED"
      };
    }

    if (!viewportIntersecting) {
      return {
        canvasBlameEligible: false,
        interpretation: "PRODUCTION_CANVAS_CONFIRMED_BUT_NOT_VIEWPORT_INTERSECTING",
        blameGateStatus: "CANVAS_BLAME_BLOCKED_LAYOUT_OR_SCROLL_POSITION_FIRST",
        recommendedOwner: "CSS_LAYOUT_OR_SCROLL_POSITION",
        recommendedFile: "/showroom/globe/hearth/index.html",
        recommendedAction:
          "REPAIR_STAGE_PLACEMENT_SCROLL_OR_VIEWPORT_INTERSECTION_BEFORE_CANVAS_DRAW_BLAME"
      };
    }

    if (pixelVisibleConfirmed) {
      return {
        canvasBlameEligible: false,
        interpretation: "PRODUCTION_CANVAS_CONFIRMED_WITH_VISIBLE_PIXEL_PROOF",
        blameGateStatus: "CANVAS_BLAME_NOT_NEEDED_VISIBLE_PIXEL_PROOF_PRESENT",
        recommendedOwner: "NONE",
        recommendedFile: "NONE",
        recommendedAction:
          "NO_CANVAS_PIXEL_REPAIR_RECOMMENDED_FROM_SOUTH_SURFACE_POINTER"
      };
    }

    if (/HEX_SURFACE|POINTER|DELIVERY|RECEIVER|GATE/i.test(downstreamClass) && receivedCount <= 0) {
      return {
        canvasBlameEligible: false,
        interpretation: "PRODUCTION_CANVAS_CONFIRMED_BUT_DOWNSTREAM_DELIVERY_NOT_PROVEN",
        blameGateStatus: "CANVAS_BLAME_BLOCKED_HEX_OR_POINTER_DELIVERY_FIRST",
        recommendedOwner: "HEX_SURFACE_GATE_OR_POINTER_RECEIVER_ALIGNMENT",
        recommendedFile: HEX_SURFACE_FILE,
        recommendedAction:
          "CONFIRM_HEX_SURFACE_DELIVERS_TO_POINTER_INSPECT_RECEIVER_BEFORE_CANVAS_DRAW_BLAME"
      };
    }

    if (pixelBlank) {
      return {
        canvasBlameEligible: true,
        interpretation: "PRODUCTION_CANVAS_CONFIRMED_AND_PIXEL_SAMPLE_BLANK_AFTER_DOWNSTREAM_EVIDENCE",
        blameGateStatus: "CANVAS_BLAME_ELIGIBLE_PRODUCTION_CANVAS_CONFIRMED",
        recommendedOwner: "CANVAS_DRAW_PATH_OR_FINAL_EXPRESSION_ADAPTER",
        recommendedFile: CANVAS_FILE,
        recommendedAction:
          "AUDIT_CANVAS_DRAW_PATH_AFTER_PRODUCTION_CANVAS_IDENTITY_AND_DOWNSTREAM_EVIDENCE_ARE_CONFIRMED"
      };
    }

    return {
      canvasBlameEligible: false,
      interpretation: "PRODUCTION_CANVAS_CONFIRMED_BUT_PIXEL_AND_DOWNSTREAM_STATUS_INCONCLUSIVE",
      blameGateStatus: "CANVAS_BLAME_HELD_INCONCLUSIVE_PIXEL_EVIDENCE",
      recommendedOwner: "CANVAS_FINGER_INSPECT_OR_SURFACE_POINTER_CLASSIFIER",
      recommendedFile: CANVAS_FINGER_INSPECT_FILE,
      recommendedAction:
        "REFRESH_FINGER_INSPECT_EVIDENCE_AND CLASSIFY SURFACE BEFORE CANVAS DRAW BLAME"
    };
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "") continue;

      const values = Array.isArray(source)
        ? source
        : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1200);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function buildReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const fingerEvidence = readFingerInspectEvidence(input);
    const canvasAuthority = inspectAuthority(CANVAS_AUTHORITY_ALIASES);

    const classification = classifyFromEvidence(
      fingerEvidence.report || {},
      currentReport || {}
    );

    const interpretation = deriveInterpretation(classification, fingerEvidence);

    state.latestSurfaceClass = classification.surfaceClass;
    state.latestCanvasBlameEligible = interpretation.canvasBlameEligible;
    state.latestRecommendedOwner = interpretation.recommendedOwner;
    state.latestRecommendedFile = interpretation.recommendedFile;
    state.latestRecommendedAction = interpretation.recommendedAction;
    state.latestInterpretation = interpretation.interpretation;

    const notes = normalizeNotes(
      getRaw(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getRaw(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getRaw(fingerEvidence.report, "SECONDARY_EVIDENCE_NOTES", ""),
      "SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_ACTIVE",
      "SPLIT_RESPONSIBILITY_ACTIVE:FINGER_INSPECT_PUBLISHES_SURFACE_AND_RECEIVER_EVIDENCE",
      "SPLIT_RESPONSIBILITY_ACTIVE:SOUTH_SURFACE_POINTER_CLASSIFIES_SURFACE_BEFORE_CANVAS_BLAME",
      "CANVAS_BLAME_REQUIRES_PRODUCTION_CANVAS_CONFIRMATION",
      `INSPECTED_SURFACE_CLASS:${classification.surfaceClass}`,
      `CANVAS_BLAME_GATE:${interpretation.blameGateStatus}`,
      "SIDE_CAR_IS_READ_ONLY",
      "SIDE_CAR_DOES_NOT_DRAW_CANVAS",
      "SIDE_CAR_DOES_NOT_CREATE_CANVAS",
      "SIDE_CAR_DOES_NOT_REPAIR_CANVAS",
      "SIDE_CAR_DOES_NOT_MUTATE_ROUTE",
      "SIDE_CAR_DOES_NOT_RESTART_RUNTIME",
      "SIDE_CAR_DOES_NOT_CLAIM_F13_F21_F55_OR_VISUAL_PASS"
    );

    return {
      PACKET_NAME,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: firstKnown(
        input.diagnosticTimestamp,
        getRaw(currentReport, "DIAGNOSTIC_TIMESTAMP", undefined),
        nowIso()
      ),

      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,

      SOUTH_SURFACE_POINTER_STATUS: "COMPLETE",
      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      SOUTH_SURFACE_POINTER_VERSION: VERSION,
      SOUTH_SURFACE_POINTER_FILE: FILE,
      SOUTH_SURFACE_POINTER_ROLE:
        "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR_SURFACE_CLASSIFIER",
      SOUTH_SURFACE_POINTER_AUTHORITY:
        "READ_ONLY_SURFACE_CLASSIFICATION_AND_PROBE_SOUTH_PACKET_EVIDENCE",
      SOUTH_SURFACE_POINTER_CHRONOLOGY_POSITION: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      SOUTH_SURFACE_POINTER_IS_NINTH_CYCLE: "false",
      SOUTH_SURFACE_POINTER_REPLACES_PROBE_SOUTH: "false",
      SOUTH_SURFACE_POINTER_REPLACES_SOUTH_RAIL: "false",
      SOUTH_SURFACE_POINTER_OPERATIONAL_DEPENDENCY_FOR_NORTH: "false",
      SOUTH_SURFACE_POINTER_CONSUMER: PROBE_SOUTH_FILE,

      SPLIT_RESPONSIBILITY_ACTIVE: "true",
      FINGER_INSPECT_RESPONSIBILITY:
        "SURFACE_IDENTITY_RECEIVER_METHODS_HEX_DELIVERY_AND_PIXEL_OBSERVATION",
      SOUTH_SURFACE_POINTER_RESPONSIBILITY:
        "SURFACE_CLASSIFICATION_AND_CANVAS_BLAME_GATE_FOR_PROBE_SOUTH",
      CANVAS_BLAME_REQUIRES_PRODUCTION_CANVAS_CONFIRMATION: "true",

      SOUTH_RAIL_FILE,
      PROBE_SOUTH_FILE,
      CANVAS_FILE,
      CANVAS_FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      HEX_FOUR_PAIR_FILE,
      POINTER_FINGER_FILE,

      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_FINGER_INSPECT_CONTRACT,
      EXPECTED_FINGER_INSPECT_RENEWAL_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      FINGER_INSPECT_OBSERVED: boolText(fingerEvidence.authority.observed, "false"),
      FINGER_INSPECT_SOURCE: fingerEvidence.source,
      FINGER_INSPECT_SELECTED_PATH: fingerEvidence.authority.path,
      FINGER_INSPECT_CONTRACT: fingerEvidence.authority.contract,
      FINGER_INSPECT_RECEIPT: fingerEvidence.authority.receipt,
      FINGER_INSPECT_INTERNAL_RENEWAL_CONTRACT:
        fingerEvidence.authority.internalRenewalContract,
      FINGER_INSPECT_INTERNAL_RENEWAL_RECEIPT:
        fingerEvidence.authority.internalRenewalReceipt,
      FINGER_INSPECT_METHOD_COUNT: String(fingerEvidence.authority.methodCount),

      CANVAS_AUTHORITY_OBSERVED_BY_SIDECAR: boolText(canvasAuthority.observed, "false"),
      CANVAS_AUTHORITY_SELECTED_PATH_BY_SIDECAR: canvasAuthority.path,
      CANVAS_AUTHORITY_CONTRACT_BY_SIDECAR: canvasAuthority.contract,
      CANVAS_AUTHORITY_RECEIPT_BY_SIDECAR: canvasAuthority.receipt,

      INSPECTED_SURFACE_CLASS: classification.surfaceClass,
      SURFACE_CLASSIFICATION_SOURCE: classification.classificationSource,
      SURFACE_CLASSIFICATION_REASON: classification.classificationReason,
      SURFACE_SELECTOR_SEEN_BY_SIDECAR: classification.selector,
      SURFACE_DATASET_CONTRACT_SEEN_BY_SIDECAR: classification.datasetContract,
      SURFACE_VISIBLE_PROOF_SOURCE_SEEN_BY_SIDECAR:
        classification.visiblePlanetProofSource,

      DOM_SURFACE_CLASSIFICATION: clonePlain(classification.domClassification),
      DOM_SURFACE_CLASS: classification.domClassification.domClass,
      DOM_SURFACE_CLASS_REASON: classification.domClassification.domReason,
      DOM_SURFACE_SELECTOR: classification.domClassification.domSelector,

      PRODUCTION_CANVAS_CONFIRMED: boolText(
        classification.surfaceClass === SURFACE_CLASS.PRODUCTION_CANVAS,
        "false"
      ),
      TEMPORARY_IMAGE_SURFACE_CONFIRMED: boolText(
        classification.surfaceClass === SURFACE_CLASS.TEMPORARY_IMAGE,
        "false"
      ),
      INNER_SCOPE_FEED_SURFACE_CONFIRMED: boolText(
        classification.surfaceClass === SURFACE_CLASS.INNER_SCOPE_FEED,
        "false"
      ),
      DIAGNOSTIC_FRAME_SURFACE_CONFIRMED: boolText(
        classification.surfaceClass === SURFACE_CLASS.DIAGNOSTIC_FRAME,
        "false"
      ),
      UNKNOWN_OR_MISALIGNED_SURFACE_CONFIRMED: boolText(
        classification.surfaceClass === SURFACE_CLASS.UNKNOWN,
        "false"
      ),

      FINGER_INSPECT_CANVAS_PIXEL_SAMPLE_STATUS: classification.pixelStatus,
      FINGER_INSPECT_CANVAS_PIXEL_VISIBLE: classification.pixelVisible,
      FINGER_INSPECT_CANVAS_PIXEL_BLANK: boolText(classification.pixelBlank, "false"),
      FINGER_INSPECT_CANVAS_PIXEL_VISIBLE_CONFIRMED: boolText(
        classification.pixelVisibleConfirmed,
        "false"
      ),
      FINGER_INSPECT_CANVAS_VIEWPORT_INTERSECTING:
        classification.viewportIntersecting,
      FINGER_INSPECT_DOWNSTREAM_STATUS: classification.downstreamStatus,
      FINGER_INSPECT_DOWNSTREAM_VERDICT_CLASS: classification.downstreamClass,
      FINGER_INSPECT_DOWNSTREAM_RECOMMENDED_FILE:
        classification.downstreamRecommendedFile,

      CANVAS_BLAME_ELIGIBLE: boolText(interpretation.canvasBlameEligible, "false"),
      CANVAS_BLAME_GATE_STATUS: interpretation.blameGateStatus,
      SURFACE_POINTER_INTERPRETATION: interpretation.interpretation,
      SURFACE_POINTER_RECOMMENDED_OWNER: interpretation.recommendedOwner,
      SURFACE_POINTER_RECOMMENDED_FILE: interpretation.recommendedFile,
      SURFACE_POINTER_RECOMMENDED_ACTION: interpretation.recommendedAction,

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      SOUTH_SURFACE_POINTER_NOTES: notes.join(" | "),

      FINGER_INSPECT_REPORT_SNAPSHOT: clonePlain(fingerEvidence.report || {}),
      CURRENT_REPORT_SNAPSHOT: clonePlain(currentReport || {}),

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

      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "PREVIOUS_INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",

      "SOUTH_SURFACE_POINTER_STATUS",
      "SOUTH_SURFACE_POINTER_CONTRACT",
      "SOUTH_SURFACE_POINTER_RECEIPT",
      "SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT",
      "SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_RECEIPT",
      "SOUTH_SURFACE_POINTER_VERSION",
      "SOUTH_SURFACE_POINTER_FILE",
      "SOUTH_SURFACE_POINTER_ROLE",
      "SOUTH_SURFACE_POINTER_AUTHORITY",
      "SOUTH_SURFACE_POINTER_CHRONOLOGY_POSITION",
      "SOUTH_SURFACE_POINTER_IS_NINTH_CYCLE",
      "SOUTH_SURFACE_POINTER_REPLACES_PROBE_SOUTH",
      "SOUTH_SURFACE_POINTER_REPLACES_SOUTH_RAIL",
      "SOUTH_SURFACE_POINTER_OPERATIONAL_DEPENDENCY_FOR_NORTH",
      "SOUTH_SURFACE_POINTER_CONSUMER",

      "SPLIT_RESPONSIBILITY_ACTIVE",
      "FINGER_INSPECT_RESPONSIBILITY",
      "SOUTH_SURFACE_POINTER_RESPONSIBILITY",
      "CANVAS_BLAME_REQUIRES_PRODUCTION_CANVAS_CONFIRMATION",

      "FINGER_INSPECT_OBSERVED",
      "FINGER_INSPECT_SOURCE",
      "FINGER_INSPECT_SELECTED_PATH",
      "FINGER_INSPECT_CONTRACT",
      "FINGER_INSPECT_RECEIPT",
      "FINGER_INSPECT_INTERNAL_RENEWAL_CONTRACT",
      "FINGER_INSPECT_INTERNAL_RENEWAL_RECEIPT",
      "FINGER_INSPECT_METHOD_COUNT",

      "CANVAS_AUTHORITY_OBSERVED_BY_SIDECAR",
      "CANVAS_AUTHORITY_SELECTED_PATH_BY_SIDECAR",
      "CANVAS_AUTHORITY_CONTRACT_BY_SIDECAR",

      "INSPECTED_SURFACE_CLASS",
      "SURFACE_CLASSIFICATION_SOURCE",
      "SURFACE_CLASSIFICATION_REASON",
      "SURFACE_SELECTOR_SEEN_BY_SIDECAR",
      "SURFACE_DATASET_CONTRACT_SEEN_BY_SIDECAR",
      "SURFACE_VISIBLE_PROOF_SOURCE_SEEN_BY_SIDECAR",

      "DOM_SURFACE_CLASS",
      "DOM_SURFACE_CLASS_REASON",
      "DOM_SURFACE_SELECTOR",

      "PRODUCTION_CANVAS_CONFIRMED",
      "TEMPORARY_IMAGE_SURFACE_CONFIRMED",
      "INNER_SCOPE_FEED_SURFACE_CONFIRMED",
      "DIAGNOSTIC_FRAME_SURFACE_CONFIRMED",
      "UNKNOWN_OR_MISALIGNED_SURFACE_CONFIRMED",

      "FINGER_INSPECT_CANVAS_PIXEL_SAMPLE_STATUS",
      "FINGER_INSPECT_CANVAS_PIXEL_VISIBLE",
      "FINGER_INSPECT_CANVAS_PIXEL_BLANK",
      "FINGER_INSPECT_CANVAS_PIXEL_VISIBLE_CONFIRMED",
      "FINGER_INSPECT_CANVAS_VIEWPORT_INTERSECTING",
      "FINGER_INSPECT_DOWNSTREAM_STATUS",
      "FINGER_INSPECT_DOWNSTREAM_VERDICT_CLASS",
      "FINGER_INSPECT_DOWNSTREAM_RECOMMENDED_FILE",

      "CANVAS_BLAME_ELIGIBLE",
      "CANVAS_BLAME_GATE_STATUS",
      "SURFACE_POINTER_INTERPRETATION",
      "SURFACE_POINTER_RECOMMENDED_OWNER",
      "SURFACE_POINTER_RECOMMENDED_FILE",
      "SURFACE_POINTER_RECOMMENDED_ACTION",

      "SOUTH_RAIL_FILE",
      "PROBE_SOUTH_FILE",
      "CANVAS_FILE",
      "CANVAS_FINGER_INSPECT_FILE",
      "HEX_SURFACE_FILE",
      "HEX_FOUR_PAIR_FILE",
      "POINTER_FINGER_FILE",

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
      "FINAL_VISUAL_PASS_AUTHORITY",

      "SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SURFACE_POINTER_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const key of priority.concat(Object.keys(report || {}))) {
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((key) => line(key, getRaw(report, key, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("SOUTH_SURFACE_POINTER_CONTRACT", CONTRACT),
      line("SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT),
      line("SPLIT_RESPONSIBILITY_ACTIVE", "true"),
      line("FINGER_INSPECT_OBSERVED", report.FINGER_INSPECT_OBSERVED),
      line("INSPECTED_SURFACE_CLASS", report.INSPECTED_SURFACE_CLASS),
      line("PRODUCTION_CANVAS_CONFIRMED", report.PRODUCTION_CANVAS_CONFIRMED),
      line("CANVAS_BLAME_ELIGIBLE", report.CANVAS_BLAME_ELIGIBLE),
      line("CANVAS_BLAME_GATE_STATUS", report.CANVAS_BLAME_GATE_STATUS),
      line("SURFACE_POINTER_INTERPRETATION", report.SURFACE_POINTER_INTERPRETATION),
      line("SURFACE_POINTER_RECOMMENDED_FILE", report.SURFACE_POINTER_RECOMMENDED_FILE),
      line("SURFACE_POINTER_RECOMMENDED_ACTION", report.SURFACE_POINTER_RECOMMENDED_ACTION)
    ].join("\n");
  }

  function publishReport(report) {
    state.lastReport = clonePlain(report);
    state.lastPacketText = composePacketText(report);
    state.lastCompactSummary = composeCompactSummary(report);
    state.lastFingerInspectEvidence = clonePlain(report.FINGER_INSPECT_REPORT_SNAPSHOT || {});
    state.updatedAt = nowIso();

    publishAliases();
  }

  function runSouthSurfacePointerRead(input = {}) {
    state.runCount += 1;

    try {
      const report = buildReport(input);
      publishReport(report);

      record("SOUTH_SURFACE_POINTER_READ_COMPLETE", {
        inspectedSurfaceClass: report.INSPECTED_SURFACE_CLASS,
        canvasBlameEligible: report.CANVAS_BLAME_ELIGIBLE,
        recommendedFile: report.SURFACE_POINTER_RECOMMENDED_FILE
      });

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: CONTRACT,
        implementationReceipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

        SOUTH_SURFACE_POINTER_STATUS: report.SOUTH_SURFACE_POINTER_STATUS,
        SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
        SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
        SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT:
          INTERNAL_RENEWAL_CONTRACT,
        SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_RECEIPT:
          INTERNAL_RENEWAL_RECEIPT,

        SPLIT_RESPONSIBILITY_ACTIVE: report.SPLIT_RESPONSIBILITY_ACTIVE,
        FINGER_INSPECT_OBSERVED: report.FINGER_INSPECT_OBSERVED,
        INSPECTED_SURFACE_CLASS: report.INSPECTED_SURFACE_CLASS,
        PRODUCTION_CANVAS_CONFIRMED: report.PRODUCTION_CANVAS_CONFIRMED,
        CANVAS_BLAME_ELIGIBLE: report.CANVAS_BLAME_ELIGIBLE,
        CANVAS_BLAME_GATE_STATUS: report.CANVAS_BLAME_GATE_STATUS,
        SURFACE_POINTER_INTERPRETATION: report.SURFACE_POINTER_INTERPRETATION,
        SURFACE_POINTER_RECOMMENDED_OWNER:
          report.SURFACE_POINTER_RECOMMENDED_OWNER,
        SURFACE_POINTER_RECOMMENDED_FILE:
          report.SURFACE_POINTER_RECOMMENDED_FILE,
        SURFACE_POINTER_RECOMMENDED_ACTION:
          report.SURFACE_POINTER_RECOMMENDED_ACTION,

        evidence: report,
        REPORT_OBJECT: report,
        report,
        output: {
          SOUTH_SURFACE_POINTER_STATUS: report.SOUTH_SURFACE_POINTER_STATUS,
          SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
          SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
          INSPECTED_SURFACE_CLASS: report.INSPECTED_SURFACE_CLASS,
          PRODUCTION_CANVAS_CONFIRMED: report.PRODUCTION_CANVAS_CONFIRMED,
          CANVAS_BLAME_ELIGIBLE: report.CANVAS_BLAME_ELIGIBLE,
          CANVAS_BLAME_GATE_STATUS: report.CANVAS_BLAME_GATE_STATUS,
          SURFACE_POINTER_INTERPRETATION: report.SURFACE_POINTER_INTERPRETATION,
          SURFACE_POINTER_RECOMMENDED_FILE:
            report.SURFACE_POINTER_RECOMMENDED_FILE,
          REPORT_OBJECT: report
        },
        packetText: state.lastPacketText,
        compactSummary: state.lastCompactSummary,

        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      recordError("SOUTH_SURFACE_POINTER_READ_FAILED", error);

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
        SOUTH_SURFACE_POINTER_STATUS: "ERROR",
        INSPECTED_SURFACE_CLASS: SURFACE_CLASS.UNKNOWN,
        CANVAS_BLAME_ELIGIBLE: "false",
        CANVAS_BLAME_GATE_STATUS: "CANVAS_BLAME_BLOCKED_SIDECAR_ERROR",
        SURFACE_POINTER_INTERPRETATION: "SURFACE_POINTER_CLASSIFIER_ERROR",
        SURFACE_POINTER_RECOMMENDED_FILE: FILE,
        SURFACE_POINTER_RECOMMENDED_ACTION:
          "REVIEW_SOUTH_SURFACE_POINTER_CLASSIFIER_ERROR",
        ERROR_MESSAGE: bounded(error && error.message ? error.message : error, 2000),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };

      publishReport(fallback);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: fallback.ERROR_MESSAGE,
        report: fallback,
        REPORT_OBJECT: fallback,
        packetText: state.lastPacketText,
        compactSummary: state.lastCompactSummary,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }
  }

  function inspectSouthSurfacePointer(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function inspectSurfacePointer(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function runProbeSidecar(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function inspect(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function runDiagnostic(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function receiveFingerInspectReport(packet = {}) {
    state.receivedFingerReportCount += 1;
    return runSouthSurfacePointerRead({
      fingerInspectReport: isObject(packet) ? packet : {},
      diagnosticTimestamp: nowIso(),
      reason: "RECEIVE_FINGER_INSPECT_REPORT"
    });
  }

  function consumeFingerInspectReport(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function receiveCanvasFingerInspectPacket(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function consumeCanvasFingerInspectPacket(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.lastReport) {
      return clonePlain(state.lastReport);
    }

    const result = runSouthSurfacePointerRead({
      diagnosticTimestamp: nowIso(),
      reason: "GET_REPORT_REFRESH"
    });

    return clonePlain(result.report);
  }

  function getPacketText(options = {}) {
    if (options && options.refresh === false && state.lastPacketText) {
      return state.lastPacketText;
    }

    getReport();
    return state.lastPacketText;
  }

  function getCompactSummary(options = {}) {
    if (options && options.refresh === false && state.lastCompactSummary) {
      return state.lastCompactSummary;
    }

    getReport();
    return state.lastCompactSummary;
  }

  function getState() {
    return {
      role: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR_SURFACE_CLASSIFIER",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      asymmetricTenthDiagnosticSidecar: true,
      chronologyOwner: false,
      nineCycleMutation: false,
      replacesSouthRail: false,
      replacesProbeSouth: false,
      operationalDependencyForNorth: false,
      readableByProbeSouth: true,

      splitResponsibilityActive: true,
      consumesCanvasFingerInspectEvidence: true,
      publishesProbeSouthClassifierPacket: true,
      classifiesSurfaceBeforeCanvasBlame: true,
      canvasBlameRequiresProductionCanvasConfirmation: true,

      latestSurfaceClass: state.latestSurfaceClass,
      latestCanvasBlameEligible: state.latestCanvasBlameEligible,
      latestRecommendedOwner: state.latestRecommendedOwner,
      latestRecommendedFile: state.latestRecommendedFile,
      latestRecommendedAction: state.latestRecommendedAction,
      latestInterpretation: state.latestInterpretation,

      runCount: state.runCount,
      receivedFingerReportCount: state.receivedFingerReportCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      latestEvent: state.latestEvent,
      updatedAt: state.updatedAt || nowIso(),

      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      asymmetricTenthDiagnosticSidecar: true,
      replacesSouthRail: false,
      replacesProbeSouth: false,
      operationalDependencyForNorth: false,
      consumer: PROBE_SOUTH_FILE,

      splitResponsibilityActive: true,
      fingerInspectResponsibility:
        "SURFACE_IDENTITY_RECEIVER_METHODS_HEX_DELIVERY_AND_PIXEL_OBSERVATION",
      southSurfacePointerResponsibility:
        "SURFACE_CLASSIFICATION_AND_CANVAS_BLAME_GATE_FOR_PROBE_SOUTH",
      canvasBlameRequiresProductionCanvasConfirmation: true,

      primaryCallable: "runSouthSurfacePointerRead",
      runSouthSurfacePointerReadApiAvailable: true,
      inspectSouthSurfacePointerApiAvailable: true,
      inspectSurfacePointerApiAvailable: true,
      runProbeSidecarApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      receiveFingerInspectReportApiAvailable: true,
      consumeFingerInspectReportApiAvailable: true,
      receiveCanvasFingerInspectPacketApiAvailable: true,
      consumeCanvasFingerInspectPacketApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

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
      finalVisualPassAuthority: false,

      latestSurfaceClass: state.latestSurfaceClass,
      latestCanvasBlameEligible: state.latestCanvasBlameEligible,
      latestInterpretation: state.latestInterpretation,
      latestRecommendedFile: state.latestRecommendedFile,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT:
        INTERNAL_RENEWAL_CONTRACT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_RECEIPT:
        INTERNAL_RENEWAL_RECEIPT,
      SOUTH_SURFACE_POINTER_FILE: FILE,

      SOUTH_RAIL_FILE,
      PROBE_SOUTH_FILE,
      CANVAS_FILE,
      CANVAS_FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      HEX_FOUR_PAIR_FILE,
      POINTER_FINGER_FILE,

      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_FINGER_INSPECT_CONTRACT,
      EXPECTED_FINGER_INSPECT_RENEWAL_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      reportObject: clonePlain(state.lastReport || {}),
      state: getState(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    root.HEARTH.diagnosticSouthSurfacePointer = api;
    root.HEARTH.diagnosticSurfacePointerSouth = api;
    root.HEARTH.diagnosticSouthBishopSurfacePointer = api;
    root.HEARTH.diagnosticBishopSurfacePointerSouth = api;
    root.HEARTH.diagnosticSouthSurfaceClassifier = api;
    root.HEARTH.diagnosticCanvasFeedClassifierSouth = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_SURFACE_POINTER_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_CLASSIFIER = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_FEED_CLASSIFIER_SOUTH = api;

    root.DEXTER_LAB.hearthDiagnosticSouthSurfacePointer = api;
    root.DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer = api;
    root.DEXTER_LAB.hearthDiagnosticSurfacePointerSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthSurfaceClassifier = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasFeedClassifierSouth = api;

    const receipt = getReceipt();
    state.receiptPublishCount += 1;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_CLASSIFIER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_CANVAS_FEED_CLASSIFIER_SOUTH_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_REPORT =
      clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PACKET_TEXT =
      state.lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_COMPACT_SUMMARY =
      state.lastCompactSummary || "";

    root.HEARTH.diagnosticSouthSurfacePointerReceipt = receipt;
    root.HEARTH.diagnosticSouthSurfaceClassifierReceipt = receipt;
    root.HEARTH.diagnosticCanvasFeedClassifierSouthReceipt = receipt;

    root.DEXTER_LAB.hearthDiagnosticSouthSurfacePointerReceipt = receipt;
    root.DEXTER_LAB.hearthDiagnosticSouthSurfaceClassifierReceipt = receipt;

    state.aliasPublishCount += 1;
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
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    role: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR_SURFACE_CLASSIFIER",
    authority: "READ_ONLY_SURFACE_CLASSIFICATION_AND_PROBE_SOUTH_PACKET_EVIDENCE",
    chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
    asymmetricTenthDiagnosticSidecar: true,
    replacesSouthRail: false,
    replacesProbeSouth: false,
    operationalDependencyForNorth: false,
    consumer: PROBE_SOUTH_FILE,

    southRailFile: SOUTH_RAIL_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    canvasFile: CANVAS_FILE,
    canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexFourPairFile: HEX_FOUR_PAIR_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    expectedFingerInspectContract: EXPECTED_FINGER_INSPECT_CONTRACT,
    expectedFingerInspectRenewalContract: EXPECTED_FINGER_INSPECT_RENEWAL_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    splitResponsibilityActive: true,
    fingerInspectResponsibility:
      "SURFACE_IDENTITY_RECEIVER_METHODS_HEX_DELIVERY_AND_PIXEL_OBSERVATION",
    southSurfacePointerResponsibility:
      "SURFACE_CLASSIFICATION_AND_CANVAS_BLAME_GATE_FOR_PROBE_SOUTH",
    canvasBlameRequiresProductionCanvasConfirmation: true,

    runSouthSurfacePointerRead,
    inspectSouthSurfacePointer,
    inspectSurfacePointer,
    runProbeSidecar,
    inspect,
    runDiagnostic,
    receiveFingerInspectReport,
    consumeFingerInspectReport,
    receiveCanvasFingerInspectPacket,
    consumeCanvasFingerInspectPacket,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,
    publishAliases,

    runSouthSurfacePointerReadApiAvailable: true,
    inspectSouthSurfacePointerApiAvailable: true,
    inspectSurfacePointerApiAvailable: true,
    runProbeSidecarApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    receiveFingerInspectReportApiAvailable: true,
    consumeFingerInspectReportApiAvailable: true,
    receiveCanvasFingerInspectPacketApiAvailable: true,
    consumeCanvasFingerInspectPacketApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

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
    finalVisualPassAuthority: false,

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

  publishReport(buildReport({ diagnosticTimestamp: nowIso(), reason: "INITIAL_PUBLICATION" }));
  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
