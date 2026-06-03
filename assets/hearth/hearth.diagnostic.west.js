// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Full-file replacement.
// Diagnostic rail WEST child only.
// Internal implementation renewal:
// HEARTH_DIAGNOSTIC_WEST_RENDERED_PLANET_PROOF_SPREAD_RUNTIME_ADOPTION_TNT_v3
// Purpose:
// - Preserve WEST parent-visible rendered-target authority contract.
// - Calibrate WEST from the latest NORTH receipts.
// - Shift WEST away from button-centered failure diagnosis into rendered planet-proof spread inspection.
// - Treat floating/off-viewport Show Receipt hit-test results as non-controlling observability conditions.
// - Read the current rendered Hearth proof chain:
//   HTML shell -> index selector -> route conductor v9_5 -> Canvas expression hub -> finger manager -> visible base globe carrier.
// - Inspect rendered proof through target DOM, target datasets, route conductor globals, receipt globals, Hearth namespace, and Dexter Lab namespace.
// - Publish North-consumable proof fields:
//   CANVAS_ELEMENT_FOUND
//   ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET
//   RENDERED_PLANET_PROOF_FULLY_INSPECTED
//   WEST_RENDERED_PROOF_SPREAD_COMPLETE
// - Preserve EAST as CASE_5 served-source lane.
// - Preserve NORTH as final PRIMARY_CASE and recommendation authority.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - served-source parsing
// - CASE_5 authority
// - final PRIMARY_CASE selection
// - final recommendation selection
// - packet formatting
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release
// - North latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_RENDERED_PLANET_PROOF_SPREAD_RUNTIME_ADOPTION_TNT_v3";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_RENDERED_PLANET_PROOF_SPREAD_RUNTIME_ADOPTION_RECEIPT_v3";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_RENDERED_PLANET_PROOF_SPREAD_ALIGNMENT_TNT_v2";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_HIT_TEST_OBSERVABILITY_REFINEMENT_TNT_v1";

  const VERSION =
    "2026-06-03.hearth-diagnostic-west-rendered-planet-proof-spread-runtime-adoption-v3";

  const FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6";

  const CURRENT_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";

  const CURRENT_ROUTE_CONDUCTOR_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";

  const ACCEPTED_ROUTE_CONDUCTOR_LINEAGE = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const CURRENT_CANVAS_PARENT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const SHOW_RECEIPT_SELECTOR = "[data-hearth-toggle-receipt]";
  const RECEIPT_PANEL_SELECTOR = "#hearthReceiptPanel, [data-hearth-receipt-box]";
  const RECEIPT_TEXT_SELECTOR = "[data-hearth-receipt-text]";

  const VISIBLE_STATUS_SELECTORS = Object.freeze([
    "[data-hearth-latest-event]",
    "[data-hearth-heartbeat-text]",
    "#hearth-route-status",
    "[data-hearth-route-status]"
  ]);

  const PLANET_STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-engine-stage]",
    "[data-hearth-planetary-template-development-stage]",
    "[data-hearth-visible-planet-stage]"
  ]);

  const PLANET_MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-engine-mount]",
    "[data-hearth-canvas-stage-mount]"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-visible-planet-canvas='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-visible-planet-mount] canvas",
    "[data-hearth-planet-engine-mount] canvas",
    "canvas"
  ]);

  const ROUTE_CONDUCTOR_PATHS = Object.freeze([
    "HEARTH.routeConductor",
    "HEARTH.southRouteConductor",
    "HEARTH.routeConductorPrimary",
    "HEARTH.routeConductorV95",
    "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
    "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
    "HEARTH.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthSouthRouteConductor",
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_SOUTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT"
  ]);

  const ROUTE_CONDUCTOR_RECEIPT_PATHS = Object.freeze([
    "HEARTH.routeConductorReceipt",
    "HEARTH.southRouteConductorReceipt",
    "HEARTH.routeConductorPrimaryReceipt",
    "HEARTH.routeConductorV95Receipt",
    "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt",
    "HEARTH.routeConductorCanvasLocalStationBridgeAlignmentReceipt",
    "HEARTH.hearthRouteConductorReceipt",
    "DEXTER_LAB.hearthRouteConductorReceipt",
    "DEXTER_LAB.hearthSouthRouteConductorReceipt",
    "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
    "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5"
  ]);

  const CANVAS_AUTHORITY_PATHS = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.visibleBaseGlobeCarrier",
    "HEARTH.hearthCanvas",
    "DEXTER_LAB.hearthCanvas",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_VISIBLE_BASE_GLOBE_CARRIER"
  ]);

  const CANVAS_RECEIPT_PATHS = Object.freeze([
    "HEARTH.canvasReceipt",
    "HEARTH.canvasParentReceipt",
    "HEARTH.canvasExpressionHubReceipt",
    "HEARTH.canvasFingerManagerReceipt",
    "HEARTH.visibleBaseGlobeCarrierReceipt",
    "HEARTH.hearthCanvasReceipt",
    "DEXTER_LAB.hearthCanvasReceipt",
    "HEARTH_CANVAS_RECEIPT",
    "HEARTH_CANVAS_PARENT_RECEIPT",
    "HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT",
    "HEARTH_CANVAS_FINGER_MANAGER_RECEIPT",
    "HEARTH_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT"
  ]);

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
    COMPLETE: "COMPLETE",
    HELD: "HELD"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    HELD: "HELD"
  });

  const ACCESS = Object.freeze({
    RENDERED_TARGET_ACCESSIBLE: "RENDERED_TARGET_ACCESSIBLE",
    RENDERED_TARGET_BLOCKED: "RENDERED_TARGET_BLOCKED",
    TARGET_FRAME_BLOCKED: "TARGET_FRAME_BLOCKED",
    TARGET_WINDOW_BLOCKED: "TARGET_WINDOW_BLOCKED",
    TARGET_LOAD_FAILED: "TARGET_LOAD_FAILED",
    SOURCE_ONLY: "SOURCE_ONLY",
    UNKNOWN: "UNKNOWN"
  });

  const SUPPORT = Object.freeze({
    TRUE: "true",
    FALSE: "false",
    UNKNOWN: FALLBACK.UNKNOWN,
    HELD: FALLBACK.HELD,
    INSUFFICIENT_EVIDENCE: FALLBACK.INSUFFICIENT_EVIDENCE
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
  const doc = root.document || null;
  const api = {};

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

  function isPlainObject(value) {
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

  function bounded(value, limit = 1800) {
    return safeTrim(value).slice(0, limit);
  }

  function safeBool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isPlainObject(value)) return { ...value };
      return value;
    }
  }

  function normalizeError(error, prefix) {
    const name = error && error.name ? safeString(error.name) : "ERROR";
    const message = error && error.message ? safeString(error.message) : safeString(error, "UNKNOWN_ERROR");
    return `${prefix || "ERROR"}:${bounded(`${name}:${message}`, 1000)}`;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1600);
    if (!clean) return;

    if (!state.westSecondaryEvidenceNotes.includes(clean)) {
      state.westSecondaryEvidenceNotes.push(clean);
    }
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qFirst(context, selectors) {
    for (const selector of selectors || []) {
      const found = q(context, selector);
      if (found) return found;
    }

    return null;
  }

  function computed(el, prop) {
    try {
      const owner = el && el.ownerDocument && el.ownerDocument.defaultView
        ? el.ownerDocument.defaultView
        : root;

      if (!el || !owner || !isFunction(owner.getComputedStyle)) return FALLBACK.UNKNOWN;

      const style = owner.getComputedStyle(el);
      return style && prop ? safeString(style[prop], FALLBACK.UNKNOWN) : FALLBACK.UNKNOWN;
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function rectToPacket(rect) {
    try {
      if (!rect) return FALLBACK.UNKNOWN;

      return [
        `left:${Math.round(rect.left)}`,
        `top:${Math.round(rect.top)}`,
        `right:${Math.round(rect.right)}`,
        `bottom:${Math.round(rect.bottom)}`,
        `width:${Math.round(rect.width)}`,
        `height:${Math.round(rect.height)}`
      ].join(";");
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function viewportPacket(targetWindow) {
    try {
      const win = targetWindow || root;
      const width = Number(win.innerWidth || 0);
      const height = Number(win.innerHeight || 0);

      return {
        width,
        height,
        packet: `width:${Math.round(width)};height:${Math.round(height)}`
      };
    } catch (_error) {
      return {
        width: 0,
        height: 0,
        packet: FALLBACK.UNREADABLE
      };
    }
  }

  function pointInViewport(point, viewport) {
    if (!point || !viewport) return FALLBACK.UNKNOWN;
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return FALLBACK.UNKNOWN;
    if (!Number.isFinite(viewport.width) || !Number.isFinite(viewport.height)) return FALLBACK.UNKNOWN;

    return boolText(
      point.x >= 0 &&
      point.y >= 0 &&
      point.x <= viewport.width &&
      point.y <= viewport.height
    );
  }

  function cssEscape(value) {
    const text = safeString(value);

    try {
      if (root.CSS && isFunction(root.CSS.escape)) return root.CSS.escape(text);
    } catch (_error) {}

    return text.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function selectorFor(el) {
    if (!el) return FALLBACK.NOT_FOUND;

    try {
      const nodeDoc = el.ownerDocument || doc;

      if (el === root) return "window";
      if (nodeDoc && el === nodeDoc) return "document";
      if (nodeDoc && el === nodeDoc.documentElement) return "html";
      if (nodeDoc && el === nodeDoc.body) return "body";

      const tag = el.tagName ? el.tagName.toLowerCase() : "node";

      if (el.id) return `${tag}#${cssEscape(el.id)}`;

      const attrs = [
        "data-hearth-toggle-receipt",
        "data-hearth-receipt-box",
        "data-hearth-receipt-text",
        "data-hearth-latest-event",
        "data-hearth-heartbeat-text",
        "data-hearth-route-status",
        "data-hearth-globe-stage",
        "data-hearth-canvas-mount",
        "data-hearth-stage-label",
        "data-hearth-visible-planet-mount",
        "data-hearth-visible-planet-stage",
        "data-hearth-planet-engine-stage",
        "data-hearth-planet-canvas",
        "data-hearth-visible-planet-canvas",
        "aria-label",
        "role",
        "href"
      ];

      for (const attr of attrs) {
        if (el.hasAttribute && el.hasAttribute(attr)) {
          const attrValue = el.getAttribute(attr);
          if (attrValue === "" || attrValue === "true") return `${tag}[${attr}]`;
          return `${tag}[${attr}="${safeString(attrValue).slice(0, 120)}"]`;
        }
      }

      const classText = typeof el.className === "string" ? el.className.trim() : "";
      if (classText) {
        const cls = classText.split(/\s+/).filter(Boolean).slice(0, 4).map(cssEscape);
        if (cls.length) return `${tag}.${cls.join(".")}`;
      }

      return tag;
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function readPath(base, path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function callReceiptMethod(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.report)) return authority.report;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function scoreReceiptCandidate(candidate) {
    const receipt = candidate && candidate.receipt ? candidate.receipt : {};
    const contract = safeString(firstDefined(
      receipt.contract,
      receipt.CONTRACT,
      receipt.currentRouteConductorContract,
      receipt.currentCanvasParentContract,
      receipt.canvasContract
    ));

    let score = 0;

    if (contract === CURRENT_ROUTE_CONDUCTOR_CONTRACT) score += 1000;
    if (ACCEPTED_ROUTE_CONDUCTOR_LINEAGE.includes(contract)) score += 500;
    if (CURRENT_CANVAS_PARENT_CONTRACTS.includes(contract)) score += 300;

    const proofKeys = [
      "visiblePlanetProofReady",
      "canvasVisiblePlanetProofReady",
      "baseGlobeVisibleCarrierReady",
      "visibleBaseGlobeCarrierActive",
      "canvasMounted",
      "canvasDrawComplete",
      "baseGlobeDrawComplete",
      "f13CanvasEvidenceComplete",
      "expressionHubActive",
      "fingerManagerActive",
      "fingerRegistryActive"
    ];

    for (const key of proofKeys) {
      if (safeBool(receipt[key], false)) score += 20;
    }

    if (candidate.path && /routeConductor|ROUTE_CONDUCTOR/i.test(candidate.path)) score += 40;
    if (candidate.path && /canvas|CANVAS|globe|GLOBE/i.test(candidate.path)) score += 20;

    return score;
  }

  function collectKnownReceiptCandidates(targetWindow, paths, receiptPaths) {
    const win = targetWindow || root;
    const candidates = [];

    for (const path of paths) {
      const authority = readPath(win, path);
      if (!authority) continue;

      const receipt = callReceiptMethod(authority) || {};
      candidates.push({ path, authority, receipt });
    }

    for (const path of receiptPaths) {
      const receipt = readPath(win, path);
      if (!isObject(receipt)) continue;

      candidates.push({ path, authority: null, receipt });
    }

    return candidates;
  }

  function collectNamespaceReceiptCandidates(targetWindow, state) {
    const win = targetWindow || root;
    const roots = [
      { path: "HEARTH", value: readPath(win, "HEARTH") },
      { path: "DEXTER_LAB", value: readPath(win, "DEXTER_LAB") }
    ];

    const candidates = [];
    const visited = new Set();
    const queue = [];

    for (const entry of roots) {
      if (entry.value && isObject(entry.value)) {
        queue.push({ path: entry.path, value: entry.value, depth: 0 });
      }
    }

    let inspected = 0;
    const maxObjects = 160;
    const maxDepth = 3;

    while (queue.length && inspected < maxObjects) {
      const item = queue.shift();
      const value = item.value;

      if (!value || !isObject(value) || visited.has(value)) continue;

      visited.add(value);
      inspected += 1;

      const directReceipt = callReceiptMethod(value);
      if (directReceipt && isObject(directReceipt)) {
        const contractText = JSON.stringify(directReceipt).slice(0, 4000);
        if (
          /HEARTH_ROUTE_CONDUCTOR|HEARTH_CANVAS|VISIBLE|GLOBE|PLANET|F13|canvas|routeConductor/i.test(contractText)
        ) {
          candidates.push({
            path: item.path,
            authority: value,
            receipt: directReceipt
          });
        }
      }

      if (item.depth >= maxDepth) continue;

      let keys = [];

      try {
        keys = Object.keys(value);
      } catch (_error) {
        continue;
      }

      for (const key of keys.slice(0, 80)) {
        if (!/hearth|route|conductor|canvas|globe|planet|visible|base|finger|receipt|south|parent|f13/i.test(key)) {
          continue;
        }

        let child = null;

        try {
          child = value[key];
        } catch (_error) {
          continue;
        }

        if (!child || !isObject(child) || visited.has(child)) continue;

        queue.push({
          path: `${item.path}.${key}`,
          value: child,
          depth: item.depth + 1
        });
      }
    }

    state.namespaceObjectScanCount = String(inspected);
    state.namespaceReceiptCandidateCount = String(candidates.length);

    if (candidates.length) {
      addNote(state, `NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND:${candidates.length}`);
    }

    return candidates;
  }

  function chooseBestCandidate(candidates) {
    if (!Array.isArray(candidates) || !candidates.length) {
      return { path: "NONE", authority: null, receipt: {}, score: 0 };
    }

    let best = null;
    let bestScore = -1;

    for (const candidate of candidates) {
      const score = scoreReceiptCandidate(candidate);

      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }

    return {
      path: best && best.path ? best.path : "UNKNOWN",
      authority: best ? best.authority : null,
      receipt: best && best.receipt ? best.receipt : {},
      score: bestScore
    };
  }

  function readDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function readBodyDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.body
        ? targetDocument.body.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function currentPathMatchesTarget(targetWindow) {
    try {
      const win = targetWindow || root;
      const path = win.location && win.location.pathname ? win.location.pathname : "";
      const normalized = TARGET_ROUTE.replace(/\/$/, "");
      return path === TARGET_ROUTE || path === normalized;
    } catch (_error) {
      return false;
    }
  }

  function documentHasHearthTargetSignals(targetDocument) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const html = targetDocument.documentElement;
      const body = targetDocument.body;
      const htmlData = readDataset(targetDocument);
      const bodyData = readBodyDataset(targetDocument);

      const route = safeString(html.getAttribute("data-route") || htmlData.route || "");
      const page = safeString(html.getAttribute("data-page") || htmlData.page || "");
      const alias = safeString(html.getAttribute("data-page-alias") || htmlData.pageAlias || "");
      const context = safeString(html.getAttribute("data-page-context") || htmlData.pageContext || "");
      const bodyRoute = body ? safeString(body.getAttribute("data-route") || bodyData.route || "") : "";

      if (route === TARGET_ROUTE || route === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (bodyRoute === TARGET_ROUTE || bodyRoute === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (/hearth/i.test(page)) return true;
      if (/hearth/i.test(alias)) return true;
      if (/planet engine/i.test(context)) return true;
      if (q(targetDocument, SHOW_RECEIPT_SELECTOR)) return true;
      if (qFirst(targetDocument, PLANET_STAGE_SELECTORS)) return true;
      if (qFirst(targetDocument, PLANET_MOUNT_SELECTORS)) return true;

      return false;
    } catch (_error) {
      return false;
    }
  }

  function validateHearthTarget(targetDocument, targetWindow, state) {
    const pathMatches = currentPathMatchesTarget(targetWindow);
    const signals = documentHasHearthTargetSignals(targetDocument);
    const valid = Boolean(pathMatches || signals);

    state.hearthTargetConfirmed = valid;

    if (!valid) {
      addNote(state, "TARGET_DOCUMENT_ACCESSIBLE_BUT_NOT_HEARTH_TARGET");
      state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_BLOCKED;
      state.diagnosticTargetAccessError = "TARGET_DOCUMENT_ACCESSIBLE_BUT_NOT_HEARTH_TARGET";
    }

    return valid;
  }

  function readFrameDocument(frame) {
    try {
      if (!frame || !frame.contentWindow) return null;
      const targetDocument = frame.contentWindow.document;
      if (!targetDocument || !targetDocument.documentElement) return null;
      return targetDocument;
    } catch (_error) {
      return null;
    }
  }

  function readFrameObservability(frame, state) {
    if (!frame) {
      state.frameRect = FALLBACK.NOT_APPLICABLE;
      state.frameVisibleToDiagnosticRoute = FALLBACK.NOT_APPLICABLE;
      return;
    }

    try {
      const rect = frame.getBoundingClientRect ? frame.getBoundingClientRect() : null;
      state.frameRect = rectToPacket(rect);

      if (!rect) {
        state.frameVisibleToDiagnosticRoute = FALLBACK.UNKNOWN;
        addNote(state, "FRAME_RECT_UNREADABLE");
        return;
      }

      state.frameVisibleToDiagnosticRoute = boolText(rect.width > 0 && rect.height > 0);

      if (!(rect.width > 0 && rect.height > 0)) {
        addNote(state, "FRAME_NOT_VISIBLY_SIZED");
      }
    } catch (error) {
      state.frameRect = FALLBACK.UNREADABLE;
      state.frameVisibleToDiagnosticRoute = FALLBACK.UNKNOWN;
      addNote(state, normalizeError(error, "FRAME_OBSERVABILITY_READ_ERROR"));
    }
  }

  function resolveTargetFromOptions(options, state) {
    const opts = options || {};

    if (opts.sourceMismatchControlling === true) {
      state.sourceMismatchControlling = true;
      addNote(state, "CASE_5_CONTROLLING_FROM_NORTH_WEST_RENDERED_READ_REMAINS_SECONDARY");
    }

    if (opts.frameElement) {
      readFrameObservability(opts.frameElement, state);
    }

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetDocument = opts.targetDocument;
      const targetWindow = targetDocument.defaultView || opts.targetWindow || null;

      state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_ACCESSIBLE;
      state.diagnosticTargetAccessError = "";

      if (!validateHearthTarget(targetDocument, targetWindow, state)) {
        return { targetDocument: null, targetWindow: null, accessStatus: state.diagnosticTargetAccessStatus };
      }

      return { targetDocument, targetWindow, accessStatus: ACCESS.RENDERED_TARGET_ACCESSIBLE };
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement) {
          state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_ACCESSIBLE;
          state.diagnosticTargetAccessError = "";

          if (!validateHearthTarget(targetDocument, targetWindow, state)) {
            return { targetDocument: null, targetWindow: null, accessStatus: state.diagnosticTargetAccessStatus };
          }

          return { targetDocument, targetWindow, accessStatus: ACCESS.RENDERED_TARGET_ACCESSIBLE };
        }
      } catch (error) {
        state.diagnosticTargetAccessStatus = ACCESS.TARGET_WINDOW_BLOCKED;
        state.diagnosticTargetAccessError = normalizeError(error, "TARGET_WINDOW_BLOCKED");
        addNote(state, state.diagnosticTargetAccessError);
        return { targetDocument: null, targetWindow: null, accessStatus: ACCESS.TARGET_WINDOW_BLOCKED };
      }
    }

    if (opts.frameElement) {
      const frame = opts.frameElement;
      const targetDocument = readFrameDocument(frame);

      if (!targetDocument) {
        state.diagnosticTargetAccessStatus = ACCESS.TARGET_FRAME_BLOCKED;
        state.diagnosticTargetAccessError = "TARGET_FRAME_DOCUMENT_INACCESSIBLE";
        addNote(state, "TARGET_FRAME_BLOCKED");
        return { targetDocument: null, targetWindow: null, accessStatus: ACCESS.TARGET_FRAME_BLOCKED };
      }

      const targetWindow = frame.contentWindow || targetDocument.defaultView || null;

      state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_ACCESSIBLE;
      state.diagnosticTargetAccessError = "";

      if (!validateHearthTarget(targetDocument, targetWindow, state)) {
        return { targetDocument: null, targetWindow: null, accessStatus: state.diagnosticTargetAccessStatus };
      }

      return { targetDocument, targetWindow, accessStatus: ACCESS.RENDERED_TARGET_ACCESSIBLE };
    }

    if (doc && doc.documentElement && currentPathMatchesTarget(root)) {
      state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_ACCESSIBLE;
      state.diagnosticTargetAccessError = "";

      if (!validateHearthTarget(doc, root, state)) {
        return { targetDocument: null, targetWindow: null, accessStatus: state.diagnosticTargetAccessStatus };
      }

      return { targetDocument: doc, targetWindow: root, accessStatus: ACCESS.RENDERED_TARGET_ACCESSIBLE };
    }

    state.diagnosticTargetAccessStatus = ACCESS.SOURCE_ONLY;
    state.diagnosticTargetAccessError = "NO_AUTHORIZED_RENDERED_TARGET_DOCUMENT_WINDOW_OR_FRAME";
    addNote(state, "SOURCE_ONLY_NO_RENDERED_TARGET_SUPPLIED");
    return { targetDocument: null, targetWindow: null, accessStatus: ACCESS.SOURCE_ONLY };
  }

  function firstVisibleStatus(targetDocument) {
    for (const selector of VISIBLE_STATUS_SELECTORS) {
      const node = q(targetDocument, selector);
      const text = node ? safeTrim(node.textContent) : "";

      if (text) return text;
    }

    return FALLBACK.NOT_FOUND;
  }

  function readPanelState(panel) {
    try {
      if (!panel) return FALLBACK.NOT_FOUND;

      const datasetVisible = panel.dataset && panel.dataset.visible !== undefined
        ? safeString(panel.dataset.visible)
        : "";

      const ariaHidden = panel.getAttribute ? safeString(panel.getAttribute("aria-hidden")) : "";
      const hidden = panel.hidden === true ? "hidden=true" : "";
      const display = computed(panel, "display");
      const visibility = computed(panel, "visibility");

      return [
        datasetVisible ? `data-visible:${datasetVisible}` : "",
        ariaHidden ? `aria-hidden:${ariaHidden}` : "",
        hidden,
        display ? `display:${display}` : "",
        visibility ? `visibility:${visibility}` : ""
      ].filter(Boolean).join(";") || FALLBACK.UNKNOWN;
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function readRenderedDom(targetDocument, state) {
    const button = q(targetDocument, SHOW_RECEIPT_SELECTOR);
    const panel = q(targetDocument, RECEIPT_PANEL_SELECTOR);
    const textNode = q(targetDocument, RECEIPT_TEXT_SELECTOR);

    state.currentVisibleHearthStatus = firstVisibleStatus(targetDocument);

    state.showReceiptSelectorMatched = boolText(Boolean(button));
    state.showReceiptButtonExists = boolText(Boolean(button));
    state.receiptPanelExists = boolText(Boolean(panel));
    state.receiptTextNodeExists = boolText(Boolean(textNode));
    state.receiptPanelStateBeforeAction = readPanelState(panel);
    state.receiptPanelStateAfterAction = FALLBACK.HELD;
    state.showReceiptActionResult = FALLBACK.HELD;

    if (!button) addNote(state, "SHOW_RECEIPT_BUTTON_NOT_FOUND");
    if (!panel) addNote(state, "RECEIPT_PANEL_NOT_FOUND");
    if (!textNode) addNote(state, "RECEIPT_TEXT_NODE_NOT_FOUND");

    state.case4Support = button && panel && textNode ? SUPPORT.FALSE : SUPPORT.TRUE;

    return { button, panel, textNode };
  }

  function centerHit(button, state) {
    try {
      if (!button) {
        state.hitTestUnreadableReason = "SHOW_RECEIPT_BUTTON_NOT_FOUND";
        return null;
      }

      const targetDocument = button.ownerDocument;
      const targetWindow = targetDocument && targetDocument.defaultView ? targetDocument.defaultView : root;
      const rect = button.getBoundingClientRect ? button.getBoundingClientRect() : null;

      state.showReceiptRect = rectToPacket(rect);
      state.buttonPointerEvents = computed(button, "pointerEvents");

      const viewport = viewportPacket(targetWindow);
      state.targetViewportWidth = Number.isFinite(viewport.width)
        ? String(Math.round(viewport.width))
        : FALLBACK.UNKNOWN;
      state.targetViewportHeight = Number.isFinite(viewport.height)
        ? String(Math.round(viewport.height))
        : FALLBACK.UNKNOWN;

      if (!rect) {
        state.hitTestUnreadableReason = "SHOW_RECEIPT_RECT_UNREADABLE";
        state.showReceiptHitTestNonControlling = "true";
        addNote(state, "SHOW_RECEIPT_RECT_UNREADABLE_NON_CONTROLLING_FOR_PLANET_PROOF");
        return { error: "SHOW_RECEIPT_RECT_UNREADABLE" };
      }

      if (rect.width <= 0 || rect.height <= 0) {
        state.hitTestUnreadableReason = "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE";
        state.showReceiptHitTestNonControlling = "true";
        addNote(state, "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE_NON_CONTROLLING_FOR_PLANET_PROOF");
        return { error: "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE", rect };
      }

      const x = Math.round(rect.left + rect.width / 2);
      const y = Math.round(rect.top + rect.height / 2);
      const point = { x, y };

      state.showReceiptCenterPoint = `x:${x};y:${y}`;
      state.centerPointInViewport = pointInViewport(point, viewport);

      if (state.centerPointInViewport !== "true") {
        state.hitTestUnreadableReason = "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT";
        state.showReceiptHitTestNonControlling = "true";
        addNote(state, "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT_NON_CONTROLLING_FLOATING_ANCHOR_OR_SCROLL_POSITION");
        return { error: "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT", x, y, rect, targetDocument };
      }

      state.elementFromPointAvailable = boolText(isFunction(targetDocument.elementFromPoint));

      if (!isFunction(targetDocument.elementFromPoint)) {
        state.hitTestUnreadableReason = "ELEMENT_FROM_POINT_UNAVAILABLE";
        state.showReceiptHitTestNonControlling = "true";
        addNote(state, "ELEMENT_FROM_POINT_UNAVAILABLE_NON_CONTROLLING_FOR_PLANET_PROOF");
        return { error: "ELEMENT_FROM_POINT_UNAVAILABLE", x, y, rect, targetDocument };
      }

      const target = targetDocument.elementFromPoint(x, y);

      if (!target) {
        state.elementFromPointResult = "NULL";
        state.hitTestUnreadableReason = "ELEMENT_FROM_POINT_RETURNED_NULL";
        state.showReceiptHitTestNonControlling = "true";
        addNote(state, "ELEMENT_FROM_POINT_RETURNED_NULL_NON_CONTROLLING_FOR_PLANET_PROOF");
        return { error: "ELEMENT_FROM_POINT_RETURNED_NULL", x, y, rect, targetDocument };
      }

      state.elementFromPointResult = selectorFor(target);
      state.hitTestUnreadableReason = "none";
      state.showReceiptHitTestNonControlling = "false";

      return { x, y, rect, target, targetDocument };
    } catch (error) {
      const normalized = normalizeError(error, "HIT_TEST_ERROR");
      state.hitTestUnreadableReason = normalized;
      state.showReceiptHitTestNonControlling = "true";
      addNote(state, `${normalized}_NON_CONTROLLING_FOR_PLANET_PROOF`);
      return { error: normalized };
    }
  }

  function readHitTestAndPointer(button, state) {
    if (!button) {
      state.showReceiptHitTestTarget = FALLBACK.NOT_FOUND;
      state.showReceiptHitTestTargetSelector = FALLBACK.NOT_FOUND;
      state.showReceiptHitTestTargetTag = FALLBACK.NOT_FOUND;
      state.showReceiptTargetIsButton = "false";
      state.targetPointerEvents = FALLBACK.NOT_FOUND;
      state.buttonPointerEvents = FALLBACK.NOT_FOUND;
      state.showReceiptHitTestNonControlling = "true";
      return null;
    }

    const hit = centerHit(button, state);

    if (!hit || hit.error || !hit.target) {
      state.showReceiptHitTestTarget = FALLBACK.UNREADABLE;
      state.showReceiptHitTestTargetSelector = FALLBACK.UNREADABLE;
      state.showReceiptHitTestTargetTag = FALLBACK.UNREADABLE;
      state.showReceiptTargetIsButton = FALLBACK.UNKNOWN;
      state.targetPointerEvents = state.buttonPointerEvents || FALLBACK.UNREADABLE;

      if (state.hitTestUnreadableReason === FALLBACK.UNKNOWN) {
        state.hitTestUnreadableReason = hit && hit.error ? hit.error : "HIT_TEST_TARGET_UNREADABLE";
      }

      addNote(state, `HIT_TEST_TARGET_UNREADABLE_NON_CONTROLLING:${state.hitTestUnreadableReason}`);
      return null;
    }

    const target = hit.target;
    const targetIsButton = target === button || button.contains(target);

    state.showReceiptHitTestTarget = selectorFor(target);
    state.showReceiptHitTestTargetSelector = selectorFor(target);
    state.showReceiptHitTestTargetTag = target.tagName ? target.tagName.toLowerCase() : "node";
    state.showReceiptTargetIsButton = boolText(targetIsButton);
    state.targetPointerEvents = computed(target, "pointerEvents");

    if (!targetIsButton) {
      state.case1Support = SUPPORT.TRUE;
      addNote(state, `HIT_TEST_TARGET_NOT_SHOW_RECEIPT:${selectorFor(target)}`);
    }

    return hit;
  }

  function readAncestorBlockers(button, state) {
    if (!button) {
      state.ancestorBlockerFound = FALLBACK.NOT_APPLICABLE;
      state.ancestorBlockerDetail = "SHOW_RECEIPT_BUTTON_NOT_FOUND";
      return;
    }

    const blockers = [];
    let cur = button;

    while (cur && cur.nodeType === 1) {
      const pointerEvents = computed(cur, "pointerEvents");
      const display = computed(cur, "display");
      const visibility = computed(cur, "visibility");

      const disabled = cur.disabled === true;
      const inert = cur.inert === true;
      const hidden = cur.hidden === true;
      const ariaDisabled = cur.getAttribute ? cur.getAttribute("aria-disabled") : null;
      const dataDisabled = cur.getAttribute ? cur.getAttribute("data-disabled") : null;

      const blocked = (
        pointerEvents === "none" ||
        display === "none" ||
        visibility === "hidden" ||
        disabled ||
        inert ||
        hidden ||
        ariaDisabled === "true" ||
        dataDisabled === "true"
      );

      if (blocked) {
        blockers.push({
          selector: selectorFor(cur),
          pointerEvents,
          display,
          visibility,
          disabled,
          inert,
          hidden,
          ariaDisabled,
          dataDisabled
        });
      }

      cur = cur.parentElement;
    }

    if (blockers.length) {
      state.ancestorBlockerFound = "true";
      state.ancestorBlockerDetail = JSON.stringify(blockers).slice(0, 1800);
      state.case1Support = SUPPORT.TRUE;
      addNote(state, "ANCESTOR_INTERACTION_BLOCKER_FOUND");
    } else {
      state.ancestorBlockerFound = "false";
      state.ancestorBlockerDetail = "none";
    }
  }

  function readOverlay(button, hit, state) {
    if (!button) {
      state.overlayAboveControl = FALLBACK.NOT_APPLICABLE;
      state.overlayOwner = "SHOW_RECEIPT_BUTTON_NOT_FOUND";
      return;
    }

    if (!hit || !hit.target) {
      state.overlayAboveControl = FALLBACK.UNKNOWN;
      state.overlayOwner = FALLBACK.UNKNOWN;
      return;
    }

    const target = hit.target;
    const targetIsButton = target === button || button.contains(target);

    if (targetIsButton) {
      state.overlayAboveControl = "false";
      state.overlayOwner = "none";
      return;
    }

    state.overlayAboveControl = "true";
    state.overlayOwner = `TARGET=${selectorFor(target)}`;
    state.case1Support = SUPPORT.TRUE;
    addNote(state, `OVERLAY_OR_LAYER_ABOVE_SHOW_RECEIPT:${state.overlayOwner}`);
  }

  function readCurrentVisibleProofDom(targetDocument, state) {
    const stage = qFirst(targetDocument, PLANET_STAGE_SELECTORS);
    const mount = qFirst(targetDocument, PLANET_MOUNT_SELECTORS);
    const canvas = qFirst(targetDocument, CANVAS_SELECTORS);

    const stageRect = stage && stage.getBoundingClientRect ? stage.getBoundingClientRect() : null;
    const mountRect = mount && mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const canvasRect = canvas && canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : null;

    const canvasAttrWidth = canvas ? Number(canvas.width || 0) : 0;
    const canvasAttrHeight = canvas ? Number(canvas.height || 0) : 0;

    const canvasRectNonZero = Boolean(
      canvas &&
      (
        (canvasAttrWidth > 0 && canvasAttrHeight > 0) ||
        (canvasRect && canvasRect.width > 0 && canvasRect.height > 0)
      )
    );

    const stageNonZero = Boolean(stageRect && stageRect.width > 0 && stageRect.height > 0);
    const mountNonZero = Boolean(mountRect && mountRect.width > 0 && mountRect.height > 0);

    state.planetStagePresent = boolText(Boolean(stage));
    state.planetStageRect = rectToPacket(stageRect);
    state.planetStageRectNonZero = boolText(stageNonZero);

    state.canvasMountPresent = boolText(Boolean(mount));
    state.canvasMountRect = rectToPacket(mountRect);
    state.canvasMountRectNonZero = boolText(mountNonZero);

    state.domCanvasElementFound = boolText(Boolean(canvas));
    state.canvasElementPresent = boolText(Boolean(canvas));
    state.canvasRect = rectToPacket(canvasRect);
    state.canvasRectNonZero = boolText(canvasRectNonZero);
    state.canvasAttributeWidth = canvas ? String(Math.round(canvasAttrWidth || 0)) : FALLBACK.NOT_FOUND;
    state.canvasAttributeHeight = canvas ? String(Math.round(canvasAttrHeight || 0)) : FALLBACK.NOT_FOUND;
    state.canvasDrawEvidencePresent = boolText(canvasRectNonZero);
    state.domVisiblePlanetProofReady = boolText(Boolean(stageNonZero && mountNonZero && canvasRectNonZero));

    if (!stage) addNote(state, "PLANET_STAGE_NOT_FOUND");
    if (!mount) addNote(state, "CANVAS_MOUNT_NOT_FOUND");
    if (!canvas) addNote(state, "CANVAS_ELEMENT_NOT_FOUND_DOM_ONLY");
    if (canvas && !canvasRectNonZero) addNote(state, "CANVAS_ELEMENT_PRESENT_BUT_ZERO_SIZE");
    if (stageNonZero) addNote(state, "PLANET_STAGE_NONZERO_DOM_PROOF");
    if (mountNonZero) addNote(state, "CANVAS_MOUNT_NONZERO_DOM_PROOF");
    if (canvasRectNonZero) addNote(state, "CANVAS_ELEMENT_NONZERO_DOM_PROOF");
  }

  function contractRecognized(contract, current, lineage) {
    const c = safeString(contract);

    if (!c || c === FALLBACK.UNKNOWN || c === FALLBACK.NOT_FOUND || c === FALLBACK.UNREADABLE) {
      return FALLBACK.UNKNOWN;
    }

    if (c === current) return "true";
    if ((lineage || []).includes(c)) return "lineage";
    return "false";
  }

  function readCandidateField(candidates, fieldNames) {
    for (const candidate of candidates) {
      const receipt = candidate && candidate.receipt ? candidate.receipt : {};

      for (const field of fieldNames) {
        if (receipt[field] !== undefined && receipt[field] !== null && receipt[field] !== "") {
          return receipt[field];
        }
      }
    }

    return undefined;
  }

  function readAnyRouteConductorProof(targetDocument, targetWindow, state) {
    const dataset = readDataset(targetDocument);
    const bodyDataset = readBodyDataset(targetDocument);

    const knownRouteCandidates = collectKnownReceiptCandidates(
      targetWindow,
      ROUTE_CONDUCTOR_PATHS,
      ROUTE_CONDUCTOR_RECEIPT_PATHS
    );

    const knownCanvasCandidates = collectKnownReceiptCandidates(
      targetWindow,
      CANVAS_AUTHORITY_PATHS,
      CANVAS_RECEIPT_PATHS
    );

    const namespaceCandidates = collectNamespaceReceiptCandidates(targetWindow, state);

    const allCandidates = [
      ...knownRouteCandidates,
      ...knownCanvasCandidates,
      ...namespaceCandidates
    ];

    state.routeConductorKnownCandidateCount = String(knownRouteCandidates.length);
    state.canvasKnownCandidateCount = String(knownCanvasCandidates.length);
    state.renderedProofCandidateCount = String(allCandidates.length);

    const best = chooseBestCandidate(allCandidates);
    const primaryReceipt = best.receipt || {};

    const routeConductorContract = safeString(firstDefined(
      primaryReceipt.contract,
      primaryReceipt.CONTRACT,
      primaryReceipt.currentRouteConductorContract,
      primaryReceipt.routeConductorContract,
      dataset.hearthRouteConductorContract,
      dataset.hearthSouthRouteConductorContract,
      dataset.currentRouteConductorContract,
      bodyDataset.hearthRouteConductorContract,
      bodyDataset.hearthSouthRouteConductorContract
    ), FALLBACK.UNKNOWN);

    const routeConductorReceipt = safeString(firstDefined(
      primaryReceipt.receipt,
      primaryReceipt.RECEIPT,
      primaryReceipt.currentRouteConductorReceipt,
      primaryReceipt.routeConductorReceipt,
      dataset.hearthRouteConductorReceipt,
      dataset.hearthSouthRouteConductorReceipt,
      bodyDataset.hearthRouteConductorReceipt,
      bodyDataset.hearthSouthRouteConductorReceipt
    ), FALLBACK.UNKNOWN);

    const currentCanvasParentContract = safeString(firstDefined(
      primaryReceipt.currentCanvasParentContract,
      primaryReceipt.canvasParentContract,
      primaryReceipt.canvasContract,
      readCandidateField(allCandidates, ["currentCanvasParentContract", "canvasParentContract", "canvasContract", "contract"]),
      dataset.hearthSouthCurrentCanvasParentContract,
      dataset.hearthCanvasContract,
      dataset.hearthCanvasParentContract,
      bodyDataset.hearthSouthCurrentCanvasParentContract,
      bodyDataset.hearthCanvasContract,
      bodyDataset.hearthCanvasParentContract
    ), FALLBACK.UNKNOWN);

    const currentCanvasParentReceipt = safeString(firstDefined(
      primaryReceipt.currentCanvasParentReceipt,
      primaryReceipt.canvasParentReceipt,
      primaryReceipt.canvasReceipt,
      readCandidateField(allCandidates, ["currentCanvasParentReceipt", "canvasParentReceipt", "canvasReceipt", "receipt"]),
      dataset.hearthSouthCurrentCanvasParentReceipt,
      dataset.hearthCanvasReceipt,
      dataset.hearthCanvasParentReceipt,
      bodyDataset.hearthSouthCurrentCanvasParentReceipt,
      bodyDataset.hearthCanvasReceipt,
      bodyDataset.hearthCanvasParentReceipt
    ), FALLBACK.UNKNOWN);

    const expressionHubActive = safeBool(firstDefined(
      primaryReceipt.expressionHubActive,
      primaryReceipt.canvasExpressionHubActive,
      readCandidateField(allCandidates, ["expressionHubActive", "canvasExpressionHubActive"]),
      dataset.hearthSouthExpressionHubActive,
      dataset.hearthSouthCanvasExpressionHubActive,
      dataset.hearthCanvasExpressionHubActive,
      bodyDataset.hearthSouthExpressionHubActive,
      bodyDataset.hearthSouthCanvasExpressionHubActive,
      bodyDataset.hearthCanvasExpressionHubActive
    ), false);

    const fingerManagerActive = safeBool(firstDefined(
      primaryReceipt.fingerManagerActive,
      primaryReceipt.canvasFingerManagerActive,
      readCandidateField(allCandidates, ["fingerManagerActive", "canvasFingerManagerActive"]),
      dataset.hearthSouthFingerManagerActive,
      dataset.hearthSouthCanvasFingerManagerActive,
      dataset.hearthCanvasFingerManagerActive,
      bodyDataset.hearthSouthFingerManagerActive,
      bodyDataset.hearthSouthCanvasFingerManagerActive,
      bodyDataset.hearthCanvasFingerManagerActive
    ), false);

    const fingerRegistryActive = safeBool(firstDefined(
      primaryReceipt.fingerRegistryActive,
      readCandidateField(allCandidates, ["fingerRegistryActive"]),
      dataset.hearthSouthFingerRegistryActive,
      dataset.hearthCanvasFingerRegistryActive,
      bodyDataset.hearthSouthFingerRegistryActive,
      bodyDataset.hearthCanvasFingerRegistryActive
    ), false);

    const visibleBaseGlobeCarrierActive = safeBool(firstDefined(
      primaryReceipt.visibleBaseGlobeCarrierActive,
      primaryReceipt.canvasVisibleBaseGlobeCarrierActive,
      readCandidateField(allCandidates, ["visibleBaseGlobeCarrierActive", "canvasVisibleBaseGlobeCarrierActive"]),
      dataset.hearthSouthVisibleBaseGlobeCarrierActive,
      dataset.hearthSouthCanvasVisibleBaseGlobeCarrierActive,
      dataset.hearthCanvasVisibleBaseGlobeCarrierActive,
      bodyDataset.hearthSouthVisibleBaseGlobeCarrierActive,
      bodyDataset.hearthSouthCanvasVisibleBaseGlobeCarrierActive,
      bodyDataset.hearthCanvasVisibleBaseGlobeCarrierActive
    ), false);

    const canvasMounted = safeBool(firstDefined(
      primaryReceipt.canvasMounted,
      readCandidateField(allCandidates, ["canvasMounted", "mounted", "mount"]),
      dataset.hearthSouthCanvasMounted,
      dataset.hearthCanvasMounted,
      bodyDataset.hearthSouthCanvasMounted,
      bodyDataset.hearthCanvasMounted
    ), false);

    const canvasDrawComplete = safeBool(firstDefined(
      primaryReceipt.canvasDrawComplete,
      primaryReceipt.imageRendered,
      primaryReceipt.drawComplete,
      readCandidateField(allCandidates, ["canvasDrawComplete", "imageRendered", "drawComplete"]),
      dataset.hearthSouthCanvasDrawComplete,
      dataset.hearthCanvasDrawComplete,
      bodyDataset.hearthSouthCanvasDrawComplete,
      bodyDataset.hearthCanvasDrawComplete
    ), false);

    const baseGlobeDrawComplete = safeBool(firstDefined(
      primaryReceipt.baseGlobeDrawComplete,
      primaryReceipt.visibleBaseGlobeDrawComplete,
      readCandidateField(allCandidates, ["baseGlobeDrawComplete", "visibleBaseGlobeDrawComplete"]),
      dataset.hearthSouthBaseGlobeDrawComplete,
      dataset.hearthCanvasBaseGlobeDrawComplete,
      bodyDataset.hearthSouthBaseGlobeDrawComplete,
      bodyDataset.hearthCanvasBaseGlobeDrawComplete
    ), false);

    const baseGlobeVisibleCarrierReady = safeBool(firstDefined(
      primaryReceipt.baseGlobeVisibleCarrierReady,
      primaryReceipt.visibleBaseGlobeCarrierReady,
      readCandidateField(allCandidates, ["baseGlobeVisibleCarrierReady", "visibleBaseGlobeCarrierReady"]),
      dataset.hearthSouthBaseGlobeVisibleCarrierReady,
      dataset.hearthCanvasBaseGlobeVisibleCarrierReady,
      bodyDataset.hearthSouthBaseGlobeVisibleCarrierReady,
      bodyDataset.hearthCanvasBaseGlobeVisibleCarrierReady
    ), false);

    const visiblePlanetProofReady = safeBool(firstDefined(
      primaryReceipt.visiblePlanetProofReady,
      primaryReceipt.canvasVisiblePlanetProofReady,
      primaryReceipt.renderedPlanetProofReady,
      readCandidateField(allCandidates, ["visiblePlanetProofReady", "canvasVisiblePlanetProofReady", "renderedPlanetProofReady"]),
      dataset.hearthSouthVisiblePlanetProofReady,
      dataset.hearthCanvasVisiblePlanetProofReady,
      bodyDataset.hearthSouthVisiblePlanetProofReady,
      bodyDataset.hearthCanvasVisiblePlanetProofReady
    ), false);

    const visiblePlanetProofSource = safeString(firstDefined(
      primaryReceipt.visiblePlanetProofSource,
      primaryReceipt.canvasVisiblePlanetProofSource,
      primaryReceipt.renderedPlanetProofSource,
      readCandidateField(allCandidates, ["visiblePlanetProofSource", "canvasVisiblePlanetProofSource", "renderedPlanetProofSource"]),
      dataset.hearthSouthVisiblePlanetProofSource,
      dataset.hearthCanvasVisiblePlanetProofSource,
      bodyDataset.hearthSouthVisiblePlanetProofSource,
      bodyDataset.hearthCanvasVisiblePlanetProofSource
    ), FALLBACK.UNKNOWN);

    const f13Complete = safeBool(firstDefined(
      primaryReceipt.f13CanvasEvidenceComplete,
      primaryReceipt.canvasF13EvidenceComplete,
      readCandidateField(allCandidates, ["f13CanvasEvidenceComplete", "canvasF13EvidenceComplete"]),
      dataset.hearthSouthF13CanvasEvidenceComplete,
      bodyDataset.hearthSouthF13CanvasEvidenceComplete
    ), false);

    const f13Strict = safeBool(firstDefined(
      primaryReceipt.f13CanvasEvidenceStrict,
      readCandidateField(allCandidates, ["f13CanvasEvidenceStrict"]),
      dataset.hearthSouthF13CanvasEvidenceStrict,
      bodyDataset.hearthSouthF13CanvasEvidenceStrict
    ), false);

    const f13Degraded = safeBool(firstDefined(
      primaryReceipt.f13CanvasEvidenceDegraded,
      readCandidateField(allCandidates, ["f13CanvasEvidenceDegraded"]),
      dataset.hearthSouthF13CanvasEvidenceDegraded,
      bodyDataset.hearthSouthF13CanvasEvidenceDegraded
    ), false);

    const f13HardFail = safeBool(firstDefined(
      primaryReceipt.f13HardFail,
      readCandidateField(allCandidates, ["f13HardFail"]),
      dataset.hearthSouthF13HardFail,
      bodyDataset.hearthSouthF13HardFail
    ), false);

    const f13StrictEvidenceGap = safeString(firstDefined(
      primaryReceipt.f13StrictEvidenceGap,
      readCandidateField(allCandidates, ["f13StrictEvidenceGap"]),
      dataset.hearthSouthF13StrictEvidenceGap,
      bodyDataset.hearthSouthF13StrictEvidenceGap
    ), FALLBACK.UNKNOWN);

    const recommendedNextFile = safeString(firstDefined(
      primaryReceipt.recommendedNextFile,
      primaryReceipt.recommendedNextRenewalTarget,
      readCandidateField(allCandidates, ["recommendedNextFile", "recommendedNextRenewalTarget"]),
      dataset.hearthSouthRecommendedNextFile,
      dataset.hearthSouthRecommendedNextRenewalTarget,
      bodyDataset.hearthSouthRecommendedNextFile,
      bodyDataset.hearthSouthRecommendedNextRenewalTarget
    ), FALLBACK.UNKNOWN);

    const postgameStatus = safeString(firstDefined(
      primaryReceipt.postgameStatus,
      readCandidateField(allCandidates, ["postgameStatus"]),
      dataset.hearthSouthPostgameStatus,
      dataset.hearthPostgameStatus,
      bodyDataset.hearthSouthPostgameStatus,
      bodyDataset.hearthPostgameStatus
    ), FALLBACK.UNKNOWN);

    const routeConductorRecognition = contractRecognized(
      routeConductorContract,
      CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      ACCEPTED_ROUTE_CONDUCTOR_LINEAGE
    );

    const canvasParentRecognized = CURRENT_CANVAS_PARENT_CONTRACTS.includes(currentCanvasParentContract);

    state.routeConductorAuthoritySource = best.path;
    state.routeConductorAuthorityScore = String(best.score || 0);
    state.routeConductorContract = routeConductorContract;
    state.routeConductorReceipt = routeConductorReceipt;
    state.routeConductorV95Detected = boolText(routeConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    state.routeConductorContractRecognized = routeConductorRecognition;
    state.routeConductorLineageAccepted = boolText(routeConductorRecognition === "lineage");
    state.routeConductorContractReadableInRenderedTarget = boolText(
      routeConductorRecognition === "true" || routeConductorRecognition === "lineage"
    );

    state.currentCanvasParentContract = currentCanvasParentContract;
    state.currentCanvasParentReceipt = currentCanvasParentReceipt;
    state.currentCanvasParentRecognized = boolText(canvasParentRecognized);

    state.expressionHubActive = boolText(expressionHubActive);
    state.fingerManagerActive = boolText(fingerManagerActive);
    state.fingerRegistryActive = boolText(fingerRegistryActive);
    state.visibleBaseGlobeCarrierActive = boolText(visibleBaseGlobeCarrierActive);
    state.canvasMounted = boolText(canvasMounted);
    state.canvasDrawComplete = boolText(canvasDrawComplete);
    state.baseGlobeDrawComplete = boolText(baseGlobeDrawComplete);
    state.baseGlobeVisibleCarrierReady = boolText(baseGlobeVisibleCarrierReady);
    state.routeReceiptVisiblePlanetProofReady = boolText(visiblePlanetProofReady);
    state.routeReceiptVisiblePlanetProofSource = visiblePlanetProofSource;
    state.f13CanvasEvidenceComplete = boolText(f13Complete);
    state.f13CanvasEvidenceStrict = boolText(f13Strict);
    state.f13CanvasEvidenceDegraded = boolText(f13Degraded);
    state.f13HardFail = boolText(f13HardFail);
    state.f13StrictEvidenceGap = f13StrictEvidenceGap;
    state.recommendedNextFile = recommendedNextFile;
    state.postgameStatus = postgameStatus;

    const routeConductorCurrentOrLineage = routeConductorRecognition === "true" || routeConductorRecognition === "lineage";

    const routeDataEvidence = Boolean(
      routeConductorCurrentOrLineage &&
      (
        expressionHubActive ||
        fingerManagerActive ||
        fingerRegistryActive ||
        visibleBaseGlobeCarrierActive ||
        canvasMounted ||
        canvasDrawComplete ||
        baseGlobeDrawComplete ||
        baseGlobeVisibleCarrierReady ||
        visiblePlanetProofReady ||
        f13Complete ||
        f13Strict ||
        f13Degraded ||
        canvasParentRecognized ||
        postgameStatus !== FALLBACK.UNKNOWN
      )
    );

    state.routeConductorDataProofRead = boolText(routeDataEvidence);

    if (routeConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT) {
      addNote(state, "ROUTE_CONDUCTOR_V9_5_RENDERED_DATA_PROOF_DETECTED");
      addNote(state, "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET");
    } else if (routeConductorRecognition === "lineage") {
      addNote(state, "ROUTE_CONDUCTOR_LINEAGE_DETECTED_RENDERED_DATA_PROOF_COMPATIBLE");
      addNote(state, "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET");
    } else if (routeConductorRecognition === "false") {
      addNote(state, "ROUTE_CONDUCTOR_CONTRACT_UNRECOGNIZED_IN_RENDERED_TARGET");
    } else {
      addNote(state, "ROUTE_CONDUCTOR_CONTRACT_UNREADABLE_IN_RENDERED_TARGET");
    }

    if (canvasParentRecognized) {
      addNote(state, "CURRENT_CANVAS_PARENT_CONTRACT_RECOGNIZED_IN_RENDERED_TARGET");
    }

    if (routeDataEvidence) {
      addNote(state, "ROUTE_CONDUCTOR_RENDERED_DATA_PROOF_READ");
    }
  }

  function readRuntimeRelease(targetDocument, targetWindow, state) {
    try {
      const dataset = readDataset(targetDocument);
      const bodyDataset = readBodyDataset(targetDocument);

      const candidates = [
        ...collectKnownReceiptCandidates(targetWindow, ROUTE_CONDUCTOR_PATHS, ROUTE_CONDUCTOR_RECEIPT_PATHS),
        ...collectKnownReceiptCandidates(targetWindow, CANVAS_AUTHORITY_PATHS, CANVAS_RECEIPT_PATHS)
      ];

      const best = chooseBestCandidate(candidates);
      const receipt = best.receipt || {};

      const combined = [
        dataset.hearthRuntimeReleaseState,
        dataset.hearthRuntimeReleaseHeldReason,
        dataset.hearthPostgameStatus,
        dataset.hearthIndexPostgameStatus,
        dataset.hearthSouthPostgameStatus,
        dataset.hearthSouthFirstFailedCoordinate,
        bodyDataset.hearthRuntimeReleaseState,
        bodyDataset.hearthRuntimeReleaseHeldReason,
        bodyDataset.hearthPostgameStatus,
        bodyDataset.hearthIndexPostgameStatus,
        bodyDataset.hearthSouthPostgameStatus,
        bodyDataset.hearthSouthFirstFailedCoordinate,
        receipt.runtimeReleaseState,
        receipt.runtimeReleaseHeldReason,
        receipt.postgameStatus,
        receipt.firstFailedCoordinate,
        receipt.f13StrictEvidenceGap,
        state.currentVisibleHearthStatus
      ].filter(Boolean).join(" | ");

      state.runtimeReleaseState = safeTrim(combined) || FALLBACK.UNKNOWN;

      const functionalLockMarker = Boolean(
        receipt.runtimeReleaseIsLock === true ||
        receipt.runtimeLock === true ||
        receipt.queueBlocked === true ||
        /LOCK|BLOCK|STUCK|FAILED|ERROR|QUEUE_BLOCKED/i.test(state.runtimeReleaseState)
      );

      if (functionalLockMarker) {
        state.runtimeReleaseIsLock = "true";
        state.case6Support = SUPPORT.TRUE;
        addNote(state, "RUNTIME_RELEASE_FUNCTIONAL_LOCK_EVIDENCE_PRESENT");
        return;
      }

      state.runtimeReleaseIsLock = "false";
      state.case6Support = SUPPORT.FALSE;
    } catch (error) {
      state.runtimeReleaseState = FALLBACK.UNREADABLE;
      state.runtimeReleaseIsLock = FALLBACK.UNKNOWN;
      state.case6Support = SUPPORT.UNKNOWN;
      addNote(state, normalizeError(error, "RUNTIME_RELEASE_READ_ERROR"));
    }
  }

  function deriveRenderedPlanetProof(state) {
    const domCanvas = state.domCanvasElementFound === "true";
    const domCanvasNonZero = state.canvasRectNonZero === "true";
    const domProof = state.domVisiblePlanetProofReady === "true";

    const routeContractReadable = state.routeConductorContractReadableInRenderedTarget === "true";
    const routeProof = state.routeReceiptVisiblePlanetProofReady === "true";

    const routeCarrier = (
      state.visibleBaseGlobeCarrierActive === "true" ||
      state.canvasMounted === "true" ||
      state.canvasDrawComplete === "true" ||
      state.baseGlobeDrawComplete === "true" ||
      state.baseGlobeVisibleCarrierReady === "true" ||
      state.f13CanvasEvidenceComplete === "true" ||
      state.f13CanvasEvidenceStrict === "true" ||
      state.f13CanvasEvidenceDegraded === "true"
    );

    const routeDataProof = state.routeConductorDataProofRead === "true";
    const currentRoute = state.routeConductorV95Detected === "true";
    const lineageRoute = state.routeConductorLineageAccepted === "true";
    const currentCanvasParent = state.currentCanvasParentRecognized === "true";

    const canvasEquivalentFound = Boolean(
      domCanvas ||
      routeCarrier ||
      routeProof ||
      domProof ||
      currentCanvasParent ||
      routeDataProof
    );

    state.canvasElementFound = boolText(canvasEquivalentFound);
    state.canvasElementFoundSource = canvasEquivalentFound
      ? domCanvas
        ? "DOM_CANVAS_ELEMENT"
        : routeProof
          ? "ROUTE_RECEIPT_VISIBLE_PLANET_PROOF"
          : routeCarrier
            ? "ROUTE_CONDUCTOR_CANVAS_OR_BASE_GLOBE_CARRIER"
            : currentCanvasParent
              ? "CANVAS_PARENT_CONTRACT_PROOF"
              : "RENDERED_DATA_PROOF"
      : FALLBACK.UNKNOWN;

    const proofInspected = Boolean(
      state.diagnosticTargetAccessStatus === ACCESS.RENDERED_TARGET_ACCESSIBLE &&
      state.hearthTargetConfirmed === true &&
      (
        routeContractReadable ||
        currentRoute ||
        lineageRoute ||
        routeDataProof ||
        currentCanvasParent ||
        domCanvas ||
        domCanvasNonZero ||
        domProof ||
        routeProof ||
        routeCarrier
      )
    );

    const proofReady = Boolean(
      proofInspected &&
      canvasEquivalentFound &&
      (
        routeProof ||
        domProof ||
        domCanvasNonZero ||
        (routeDataProof && routeCarrier) ||
        (currentRoute && (routeCarrier || currentCanvasParent || routeProof)) ||
        (lineageRoute && routeCarrier)
      )
    );

    state.renderedPlanetProofInspected = boolText(proofInspected);
    state.renderedPlanetProofFullyInspected = boolText(proofInspected);
    state.renderedPlanetProofReady = boolText(proofReady);
    state.visiblePlanetProofReady = boolText(proofReady);
    state.visiblePlanetProofSource = proofReady
      ? routeProof
        ? state.routeReceiptVisiblePlanetProofSource || "ROUTE_CONDUCTOR_RECEIPT_VISIBLE_PLANET_PROOF"
        : domProof
          ? "DOM_STAGE_MOUNT_CANVAS_NONZERO"
          : domCanvasNonZero
            ? "DOM_CANVAS_NONZERO"
            : routeCarrier
              ? "ROUTE_CONDUCTOR_CANVAS_BASE_GLOBE_CARRIER_PROOF"
              : currentCanvasParent
                ? "CANVAS_PARENT_CONTRACT_PROOF"
                : "RENDERED_DATA_PROOF_SHAPE"
      : FALLBACK.UNKNOWN;

    state.dataProofReadComplete = proofInspected ? "true" : "false";
    state.dataProofReadStatus = proofInspected ? FALLBACK.COMPLETE : FALLBACK.PARTIAL;

    state.westRenderedProofSpreadComplete = boolText(proofReady);
    state.westRenderedProofSpreadReason = proofReady
      ? "VISIBLE_PLANET_PROOF_SPREAD_COMPLETE"
      : proofInspected
        ? "VISIBLE_PLANET_PROOF_SPREAD_INSPECTED_NOT_READY"
        : "VISIBLE_PLANET_PROOF_SPREAD_NOT_FULLY_INSPECTED";

    if (state.canvasElementFound === "true") {
      addNote(state, `CANVAS_ELEMENT_FOUND:${state.canvasElementFoundSource}`);
    } else {
      addNote(state, "CANVAS_ELEMENT_NOT_FOUND");
    }

    if (proofReady) {
      addNote(state, `RENDERED_PLANET_PROOF_READY:${state.visiblePlanetProofSource}`);
      addNote(state, "RENDERED_PLANET_PROOF_FULLY_INSPECTED");
      addNote(state, "WEST_RENDERED_PROOF_SPREAD_COMPLETE");
    } else if (proofInspected) {
      addNote(state, "RENDERED_PLANET_PROOF_FULLY_INSPECTED");
      addNote(state, "RENDERED_PLANET_PROOF_INSPECTED_BUT_NOT_READY");
      addNote(state, "WEST_RENDERED_READ_PARTIAL_PLANET_PROOF_SPREAD_INCOMPLETE");
    } else {
      addNote(state, "RENDERED_PLANET_PROOF_NOT_FULLY_INSPECTED");
      addNote(state, "WEST_RENDERED_READ_PARTIAL_PLANET_PROOF_SPREAD_INCOMPLETE");
    }
  }

  function deriveSupportFlags(state) {
    if (state.case1Support !== SUPPORT.TRUE) {
      if (
        state.showReceiptButtonExists === "true" &&
        state.ancestorBlockerFound === "false" &&
        (
          state.overlayAboveControl === "false" ||
          state.overlayAboveControl === FALLBACK.UNKNOWN ||
          state.showReceiptHitTestNonControlling === "true"
        )
      ) {
        state.case1Support = SUPPORT.FALSE;
      } else if (state.showReceiptButtonExists === FALLBACK.UNKNOWN) {
        state.case1Support = SUPPORT.UNKNOWN;
      }
    }

    if (state.case4Support !== SUPPORT.TRUE) {
      if (
        state.showReceiptButtonExists === "true" &&
        state.receiptPanelExists === "true" &&
        state.receiptTextNodeExists === "true"
      ) {
        state.case4Support = SUPPORT.FALSE;
      } else if (
        state.showReceiptButtonExists === FALLBACK.UNKNOWN ||
        state.receiptPanelExists === FALLBACK.UNKNOWN ||
        state.receiptTextNodeExists === FALLBACK.UNKNOWN
      ) {
        state.case4Support = SUPPORT.UNKNOWN;
      }
    }

    if (
      state.diagnosticTargetAccessStatus === ACCESS.TARGET_FRAME_BLOCKED ||
      state.diagnosticTargetAccessStatus === ACCESS.TARGET_WINDOW_BLOCKED ||
      state.diagnosticTargetAccessStatus === ACCESS.TARGET_LOAD_FAILED ||
      state.diagnosticTargetAccessStatus === ACCESS.RENDERED_TARGET_BLOCKED ||
      state.diagnosticTargetAccessStatus === ACCESS.SOURCE_ONLY
    ) {
      state.case7Support = SUPPORT.TRUE;
    } else if (state.diagnosticTargetAccessStatus === ACCESS.RENDERED_TARGET_ACCESSIBLE && state.hearthTargetConfirmed) {
      state.case7Support = SUPPORT.FALSE;
    } else {
      state.case7Support = SUPPORT.UNKNOWN;
    }

    state.case2Support = SUPPORT.HELD;
    state.case3Support = SUPPORT.HELD;

    if (state.showReceiptActionResult !== FALLBACK.HELD) {
      state.showReceiptActionResult = FALLBACK.HELD;
    }

    if (!state.syntheticActivationHeldReason || state.syntheticActivationHeldReason === FALLBACK.UNKNOWN) {
      state.syntheticActivationHeldReason = "HELD_REQUIRES_NORTH_PERMISSION";
    }
  }

  function deriveRenderedReadStatus(state) {
    const targetAccessible = state.diagnosticTargetAccessStatus === ACCESS.RENDERED_TARGET_ACCESSIBLE;
    const targetConfirmed = state.hearthTargetConfirmed === true;
    const spreadComplete = state.westRenderedProofSpreadComplete === "true";

    if (!targetAccessible || !targetConfirmed) {
      state.westRenderedReadComplete = "false";
      state.westRenderedReadStatus = state.case7Support === SUPPORT.TRUE ? FALLBACK.PARTIAL : FALLBACK.FAILED;
      return;
    }

    if (spreadComplete) {
      state.westRenderedReadComplete = "true";
      state.westRenderedReadStatus = FALLBACK.COMPLETE;
      addNote(state, "WEST_RENDERED_READ_COMPLETE_BY_RENDERED_PLANET_PROOF_SPREAD");
      return;
    }

    state.westRenderedReadComplete = "false";
    state.westRenderedReadStatus = FALLBACK.PARTIAL;
    addNote(state, "WEST_RENDERED_READ_PARTIAL_PLANET_PROOF_SPREAD_INCOMPLETE");
  }

  function makeState() {
    return {
      westStatus: STATUS.READY,
      westContract: CONTRACT,
      westReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      westRenderedReadComplete: "false",
      westRenderedReadStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: ACCESS.UNKNOWN,
      diagnosticTargetAccessError: "",

      currentVisibleHearthStatus: FALLBACK.UNKNOWN,

      showReceiptSelectorMatched: FALLBACK.UNKNOWN,
      showReceiptButtonExists: FALLBACK.UNKNOWN,
      showReceiptHitTestTarget: FALLBACK.UNKNOWN,
      showReceiptHitTestTargetSelector: FALLBACK.UNKNOWN,
      showReceiptHitTestTargetTag: FALLBACK.UNKNOWN,
      showReceiptTargetIsButton: FALLBACK.UNKNOWN,
      showReceiptHitTestNonControlling: FALLBACK.UNKNOWN,
      targetPointerEvents: FALLBACK.UNKNOWN,

      receiptPanelExists: FALLBACK.UNKNOWN,
      receiptTextNodeExists: FALLBACK.UNKNOWN,
      receiptPanelStateBeforeAction: FALLBACK.UNKNOWN,
      receiptPanelStateAfterAction: FALLBACK.HELD,
      showReceiptActionResult: FALLBACK.HELD,

      ancestorBlockerFound: FALLBACK.UNKNOWN,
      ancestorBlockerDetail: FALLBACK.UNKNOWN,
      overlayAboveControl: FALLBACK.UNKNOWN,
      overlayOwner: FALLBACK.UNKNOWN,

      globalEventSuppressionFound: FALLBACK.UNKNOWN,
      likelySuppressionOwner: FALLBACK.UNKNOWN,
      indexSuppressesVisibleControls: FALLBACK.UNKNOWN,

      runtimeReleaseState: FALLBACK.UNKNOWN,
      runtimeReleaseIsLock: FALLBACK.UNKNOWN,

      showReceiptRect: FALLBACK.UNKNOWN,
      showReceiptCenterPoint: FALLBACK.UNKNOWN,
      targetViewportWidth: FALLBACK.UNKNOWN,
      targetViewportHeight: FALLBACK.UNKNOWN,
      centerPointInViewport: FALLBACK.UNKNOWN,
      elementFromPointAvailable: FALLBACK.UNKNOWN,
      elementFromPointResult: FALLBACK.UNKNOWN,
      buttonPointerEvents: FALLBACK.UNKNOWN,
      hitTestUnreadableReason: FALLBACK.UNKNOWN,
      frameRect: FALLBACK.NOT_APPLICABLE,
      frameVisibleToDiagnosticRoute: FALLBACK.NOT_APPLICABLE,

      routeConductorAuthoritySource: FALLBACK.UNKNOWN,
      routeConductorAuthorityScore: FALLBACK.UNKNOWN,
      routeConductorContract: FALLBACK.UNKNOWN,
      routeConductorReceipt: FALLBACK.UNKNOWN,
      routeConductorV95Detected: FALLBACK.UNKNOWN,
      routeConductorContractRecognized: FALLBACK.UNKNOWN,
      routeConductorLineageAccepted: FALLBACK.UNKNOWN,
      routeConductorContractReadableInRenderedTarget: FALLBACK.UNKNOWN,

      currentCanvasParentContract: FALLBACK.UNKNOWN,
      currentCanvasParentReceipt: FALLBACK.UNKNOWN,
      currentCanvasParentRecognized: FALLBACK.UNKNOWN,

      expressionHubActive: FALLBACK.UNKNOWN,
      fingerManagerActive: FALLBACK.UNKNOWN,
      fingerRegistryActive: FALLBACK.UNKNOWN,
      visibleBaseGlobeCarrierActive: FALLBACK.UNKNOWN,
      canvasMounted: FALLBACK.UNKNOWN,
      canvasDrawComplete: FALLBACK.UNKNOWN,
      baseGlobeDrawComplete: FALLBACK.UNKNOWN,
      baseGlobeVisibleCarrierReady: FALLBACK.UNKNOWN,
      routeReceiptVisiblePlanetProofReady: FALLBACK.UNKNOWN,
      routeReceiptVisiblePlanetProofSource: FALLBACK.UNKNOWN,

      planetStagePresent: FALLBACK.UNKNOWN,
      planetStageRect: FALLBACK.UNKNOWN,
      planetStageRectNonZero: FALLBACK.UNKNOWN,
      canvasMountPresent: FALLBACK.UNKNOWN,
      canvasMountRect: FALLBACK.UNKNOWN,
      canvasMountRectNonZero: FALLBACK.UNKNOWN,
      domCanvasElementFound: FALLBACK.UNKNOWN,
      canvasElementPresent: FALLBACK.UNKNOWN,
      canvasElementFound: FALLBACK.UNKNOWN,
      canvasElementFoundSource: FALLBACK.UNKNOWN,
      canvasRect: FALLBACK.UNKNOWN,
      canvasRectNonZero: FALLBACK.UNKNOWN,
      canvasAttributeWidth: FALLBACK.UNKNOWN,
      canvasAttributeHeight: FALLBACK.UNKNOWN,
      canvasDrawEvidencePresent: FALLBACK.UNKNOWN,
      domVisiblePlanetProofReady: FALLBACK.UNKNOWN,

      renderedPlanetProofInspected: FALLBACK.UNKNOWN,
      renderedPlanetProofFullyInspected: FALLBACK.UNKNOWN,
      renderedPlanetProofReady: FALLBACK.UNKNOWN,
      visiblePlanetProofReady: FALLBACK.UNKNOWN,
      visiblePlanetProofSource: FALLBACK.UNKNOWN,
      dataProofReadComplete: "false",
      dataProofReadStatus: FALLBACK.UNKNOWN,
      routeConductorDataProofRead: FALLBACK.UNKNOWN,

      westRenderedProofSpreadComplete: FALLBACK.UNKNOWN,
      westRenderedProofSpreadReason: FALLBACK.UNKNOWN,

      f13CanvasEvidenceComplete: FALLBACK.UNKNOWN,
      f13CanvasEvidenceStrict: FALLBACK.UNKNOWN,
      f13CanvasEvidenceDegraded: FALLBACK.UNKNOWN,
      f13HardFail: FALLBACK.UNKNOWN,
      f13StrictEvidenceGap: FALLBACK.UNKNOWN,
      recommendedNextFile: FALLBACK.UNKNOWN,
      postgameStatus: FALLBACK.UNKNOWN,

      renderedProofCandidateCount: "0",
      routeConductorKnownCandidateCount: "0",
      canvasKnownCandidateCount: "0",
      namespaceObjectScanCount: "0",
      namespaceReceiptCandidateCount: "0",

      syntheticActivationAllowedByDefault: false,
      syntheticActivationPermittedByNorth: false,
      syntheticActivationAttempted: false,
      syntheticActivationHeldReason: "HELD_REQUIRES_NORTH_PERMISSION",

      readOnlyInspectionComplete: false,
      hearthTargetConfirmed: false,
      sourceMismatchControlling: false,

      case1Support: SUPPORT.UNKNOWN,
      case2Support: SUPPORT.HELD,
      case3Support: SUPPORT.HELD,
      case4Support: SUPPORT.UNKNOWN,
      case6Support: SUPPORT.UNKNOWN,
      case7Support: SUPPORT.UNKNOWN,

      westSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      ...FINAL_FALSE
    };
  }

  function makeInaccessibleState(state) {
    state.currentVisibleHearthStatus = state.currentVisibleHearthStatus === FALLBACK.UNKNOWN
      ? FALLBACK.INACCESSIBLE
      : state.currentVisibleHearthStatus;

    state.showReceiptSelectorMatched = FALLBACK.INACCESSIBLE;
    state.showReceiptButtonExists = FALLBACK.INACCESSIBLE;
    state.showReceiptHitTestTarget = FALLBACK.INACCESSIBLE;
    state.showReceiptHitTestTargetSelector = FALLBACK.INACCESSIBLE;
    state.showReceiptHitTestTargetTag = FALLBACK.INACCESSIBLE;
    state.showReceiptTargetIsButton = FALLBACK.INACCESSIBLE;
    state.showReceiptHitTestNonControlling = FALLBACK.INACCESSIBLE;
    state.targetPointerEvents = FALLBACK.INACCESSIBLE;
    state.receiptPanelExists = FALLBACK.INACCESSIBLE;
    state.receiptTextNodeExists = FALLBACK.INACCESSIBLE;
    state.receiptPanelStateBeforeAction = FALLBACK.INACCESSIBLE;
    state.receiptPanelStateAfterAction = FALLBACK.HELD;
    state.showReceiptActionResult = FALLBACK.HELD;
    state.ancestorBlockerFound = FALLBACK.INACCESSIBLE;
    state.ancestorBlockerDetail = FALLBACK.INACCESSIBLE;
    state.overlayAboveControl = FALLBACK.INACCESSIBLE;
    state.overlayOwner = FALLBACK.INACCESSIBLE;
    state.globalEventSuppressionFound = FALLBACK.INACCESSIBLE;
    state.likelySuppressionOwner = FALLBACK.INACCESSIBLE;
    state.indexSuppressesVisibleControls = FALLBACK.INACCESSIBLE;
    state.runtimeReleaseState = FALLBACK.INACCESSIBLE;
    state.runtimeReleaseIsLock = FALLBACK.UNKNOWN;

    state.showReceiptRect = FALLBACK.INACCESSIBLE;
    state.showReceiptCenterPoint = FALLBACK.INACCESSIBLE;
    state.targetViewportWidth = FALLBACK.INACCESSIBLE;
    state.targetViewportHeight = FALLBACK.INACCESSIBLE;
    state.centerPointInViewport = FALLBACK.INACCESSIBLE;
    state.elementFromPointAvailable = FALLBACK.INACCESSIBLE;
    state.elementFromPointResult = FALLBACK.INACCESSIBLE;
    state.buttonPointerEvents = FALLBACK.INACCESSIBLE;
    state.hitTestUnreadableReason = "RENDERED_TARGET_INACCESSIBLE";

    state.canvasElementFound = "false";
    state.routeConductorContractReadableInRenderedTarget = "false";
    state.renderedPlanetProofInspected = "false";
    state.renderedPlanetProofFullyInspected = "false";
    state.renderedPlanetProofReady = "false";
    state.visiblePlanetProofReady = "false";
    state.visiblePlanetProofSource = FALLBACK.INACCESSIBLE;
    state.dataProofReadComplete = "false";
    state.dataProofReadStatus = FALLBACK.INACCESSIBLE;
    state.westRenderedProofSpreadComplete = "false";
    state.westRenderedProofSpreadReason = "RENDERED_TARGET_INACCESSIBLE";
  }

  function makeEvidencePacket(state) {
    return {
      WEST_STATUS: state.westStatus,
      WEST_CONTRACT: CONTRACT,
      WEST_RECEIPT: RECEIPT,
      WEST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      WEST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      WEST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      WEST_VERSION: VERSION,
      WEST_RENDERED_READ_COMPLETE: state.westRenderedReadComplete,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      CURRENT_VISIBLE_HEARTH_STATUS: state.currentVisibleHearthStatus,

      SHOW_RECEIPT_SELECTOR_MATCHED: state.showReceiptSelectorMatched,
      SHOW_RECEIPT_BUTTON_EXISTS: state.showReceiptButtonExists,
      SHOW_RECEIPT_HIT_TEST_TARGET: state.showReceiptHitTestTarget,
      SHOW_RECEIPT_HIT_TEST_TARGET_SELECTOR: state.showReceiptHitTestTargetSelector,
      SHOW_RECEIPT_HIT_TEST_TARGET_TAG: state.showReceiptHitTestTargetTag,
      SHOW_RECEIPT_TARGET_IS_BUTTON: state.showReceiptTargetIsButton,
      SHOW_RECEIPT_HIT_TEST_NON_CONTROLLING: state.showReceiptHitTestNonControlling,
      TARGET_POINTER_EVENTS: state.targetPointerEvents,

      RECEIPT_PANEL_EXISTS: state.receiptPanelExists,
      RECEIPT_TEXT_NODE_EXISTS: state.receiptTextNodeExists,
      RECEIPT_PANEL_STATE_BEFORE_ACTION: state.receiptPanelStateBeforeAction,
      RECEIPT_PANEL_STATE_AFTER_ACTION: state.receiptPanelStateAfterAction,
      SHOW_RECEIPT_ACTION_RESULT: state.showReceiptActionResult,

      ANCESTOR_BLOCKER_FOUND: state.ancestorBlockerFound,
      ANCESTOR_BLOCKER_DETAIL: state.ancestorBlockerDetail,
      OVERLAY_ABOVE_CONTROL: state.overlayAboveControl,
      OVERLAY_OWNER: state.overlayOwner,

      GLOBAL_EVENT_SUPPRESSION_FOUND: state.globalEventSuppressionFound,
      LIKELY_SUPPRESSION_OWNER: state.likelySuppressionOwner,
      INDEX_SUPPRESSES_VISIBLE_CONTROLS: state.indexSuppressesVisibleControls,

      RUNTIME_RELEASE_STATE: state.runtimeReleaseState,
      RUNTIME_RELEASE_IS_LOCK: state.runtimeReleaseIsLock,

      SHOW_RECEIPT_RECT: state.showReceiptRect,
      SHOW_RECEIPT_CENTER_POINT: state.showReceiptCenterPoint,
      TARGET_VIEWPORT_WIDTH: state.targetViewportWidth,
      TARGET_VIEWPORT_HEIGHT: state.targetViewportHeight,
      CENTER_POINT_IN_VIEWPORT: state.centerPointInViewport,
      ELEMENT_FROM_POINT_AVAILABLE: state.elementFromPointAvailable,
      ELEMENT_FROM_POINT_RESULT: state.elementFromPointResult,
      BUTTON_POINTER_EVENTS: state.buttonPointerEvents,
      HIT_TEST_UNREADABLE_REASON: state.hitTestUnreadableReason,
      FRAME_RECT: state.frameRect,
      FRAME_VISIBLE_TO_DIAGNOSTIC_ROUTE: state.frameVisibleToDiagnosticRoute,

      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: state.routeConductorAuthoritySource,
      ROUTE_CONDUCTOR_AUTHORITY_SCORE: state.routeConductorAuthorityScore,
      ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract,
      ROUTE_CONDUCTOR_RECEIPT: state.routeConductorReceipt,
      ROUTE_CONDUCTOR_V9_5_DETECTED: state.routeConductorV95Detected,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.routeConductorContractRecognized,
      ROUTE_CONDUCTOR_LINEAGE_ACCEPTED: state.routeConductorLineageAccepted,
      ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET: state.routeConductorContractReadableInRenderedTarget,

      CURRENT_CANVAS_PARENT_CONTRACT: state.currentCanvasParentContract,
      CURRENT_CANVAS_PARENT_RECEIPT: state.currentCanvasParentReceipt,
      CURRENT_CANVAS_PARENT_RECOGNIZED: state.currentCanvasParentRecognized,

      EXPRESSION_HUB_ACTIVE: state.expressionHubActive,
      FINGER_MANAGER_ACTIVE: state.fingerManagerActive,
      FINGER_REGISTRY_ACTIVE: state.fingerRegistryActive,
      VISIBLE_BASE_GLOBE_CARRIER_ACTIVE: state.visibleBaseGlobeCarrierActive,
      CANVAS_MOUNTED: state.canvasMounted,
      CANVAS_DRAW_COMPLETE: state.canvasDrawComplete,
      BASE_GLOBE_DRAW_COMPLETE: state.baseGlobeDrawComplete,
      BASE_GLOBE_VISIBLE_CARRIER_READY: state.baseGlobeVisibleCarrierReady,
      ROUTE_RECEIPT_VISIBLE_PLANET_PROOF_READY: state.routeReceiptVisiblePlanetProofReady,
      ROUTE_RECEIPT_VISIBLE_PLANET_PROOF_SOURCE: state.routeReceiptVisiblePlanetProofSource,

      PLANET_STAGE_PRESENT: state.planetStagePresent,
      PLANET_STAGE_RECT: state.planetStageRect,
      PLANET_STAGE_RECT_NONZERO: state.planetStageRectNonZero,
      CANVAS_MOUNT_PRESENT: state.canvasMountPresent,
      CANVAS_MOUNT_RECT: state.canvasMountRect,
      CANVAS_MOUNT_RECT_NONZERO: state.canvasMountRectNonZero,
      DOM_CANVAS_ELEMENT_FOUND: state.domCanvasElementFound,
      CANVAS_ELEMENT_PRESENT: state.canvasElementPresent,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_ELEMENT_FOUND_SOURCE: state.canvasElementFoundSource,
      CANVAS_RECT: state.canvasRect,
      CANVAS_RECT_NONZERO: state.canvasRectNonZero,
      CANVAS_ATTRIBUTE_WIDTH: state.canvasAttributeWidth,
      CANVAS_ATTRIBUTE_HEIGHT: state.canvasAttributeHeight,
      CANVAS_DRAW_EVIDENCE_PRESENT: state.canvasDrawEvidencePresent,
      DOM_VISIBLE_PLANET_PROOF_READY: state.domVisiblePlanetProofReady,

      RENDERED_PLANET_PROOF_INSPECTED: state.renderedPlanetProofInspected,
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: state.renderedPlanetProofFullyInspected,
      RENDERED_PLANET_PROOF_READY: state.renderedPlanetProofReady,
      VISIBLE_PLANET_PROOF_READY: state.visiblePlanetProofReady,
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      DATA_PROOF_READ_COMPLETE: state.dataProofReadComplete,
      DATA_PROOF_READ_STATUS: state.dataProofReadStatus,
      ROUTE_CONDUCTOR_DATA_PROOF_READ: state.routeConductorDataProofRead,

      WEST_RENDERED_PROOF_SPREAD_COMPLETE: state.westRenderedProofSpreadComplete,
      WEST_RENDERED_PROOF_SPREAD_REASON: state.westRenderedProofSpreadReason,

      F13_CANVAS_EVIDENCE_COMPLETE: state.f13CanvasEvidenceComplete,
      F13_CANVAS_EVIDENCE_STRICT: state.f13CanvasEvidenceStrict,
      F13_CANVAS_EVIDENCE_DEGRADED: state.f13CanvasEvidenceDegraded,
      F13_HARD_FAIL: state.f13HardFail,
      F13_STRICT_EVIDENCE_GAP: state.f13StrictEvidenceGap,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      POSTGAME_STATUS: state.postgameStatus,

      RENDERED_PROOF_CANDIDATE_COUNT: state.renderedProofCandidateCount,
      ROUTE_CONDUCTOR_KNOWN_CANDIDATE_COUNT: state.routeConductorKnownCandidateCount,
      CANVAS_KNOWN_CANDIDATE_COUNT: state.canvasKnownCandidateCount,
      NAMESPACE_OBJECT_SCAN_COUNT: state.namespaceObjectScanCount,
      NAMESPACE_RECEIPT_CANDIDATE_COUNT: state.namespaceReceiptCandidateCount,

      CASE_1_SUPPORT: state.case1Support,
      CASE_2_SUPPORT: state.case2Support,
      CASE_3_SUPPORT: state.case3Support,
      CASE_4_SUPPORT: state.case4Support,
      CASE_6_SUPPORT: state.case6Support,
      CASE_7_SUPPORT: state.case7Support,

      WEST_SECONDARY_EVIDENCE_NOTES: state.westSecondaryEvidenceNotes.length
        ? state.westSecondaryEvidenceNotes.join(" | ")
        : "none",

      F13_CLAIMED: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false
    };
  }

  async function runWestRenderedRead(options = {}) {
    const state = makeState();
    state.westStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const target = resolveTargetFromOptions(options, state);

      if (!target || !target.targetDocument) {
        makeInaccessibleState(state);
        deriveSupportFlags(state);
        deriveRenderedReadStatus(state);

        state.westStatus = state.westRenderedReadStatus === FALLBACK.FAILED
          ? STATUS.FAILED
          : STATUS.PARTIAL;

        state.updatedAt = nowIso();
        publish(state);

        return {
          ok: true,
          contract: CONTRACT,
          receipt: RECEIPT,
          implementationContract: IMPLEMENTATION_CONTRACT,
          implementationReceipt: IMPLEMENTATION_RECEIPT,
          evidence: clonePlain(lastEvidencePacket),
          state: clonePlain(lastState)
        };
      }

      const targetDocument = target.targetDocument;
      const targetWindow = target.targetWindow || targetDocument.defaultView || null;

      const rendered = readRenderedDom(targetDocument, state);
      const hit = readHitTestAndPointer(rendered.button, state);

      readAncestorBlockers(rendered.button, state);
      readOverlay(rendered.button, hit, state);
      readCurrentVisibleProofDom(targetDocument, state);
      readAnyRouteConductorProof(targetDocument, targetWindow, state);
      readRuntimeRelease(targetDocument, targetWindow, state);

      state.syntheticActivationAttempted = false;
      state.syntheticActivationHeldReason = "HELD_REQUIRES_NORTH_PERMISSION";
      state.showReceiptActionResult = FALLBACK.HELD;
      state.receiptPanelStateAfterAction = readPanelState(rendered.panel);

      deriveRenderedPlanetProof(state);
      deriveSupportFlags(state);
      deriveRenderedReadStatus(state);

      state.readOnlyInspectionComplete = state.westRenderedReadComplete === "true";

      state.westStatus = state.westRenderedReadStatus === FALLBACK.COMPLETE
        ? STATUS.COMPLETE
        : STATUS.PARTIAL;

      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.westStatus = STATUS.FAILED;
      state.westRenderedReadComplete = "false";
      state.westRenderedReadStatus = FALLBACK.FAILED;
      state.diagnosticTargetAccessStatus = state.diagnosticTargetAccessStatus || ACCESS.UNKNOWN;
      state.diagnosticTargetAccessError = normalizeError(error, "WEST_RENDERED_READ_TOP_LEVEL_ERROR");
      state.case7Support = SUPPORT.UNKNOWN;
      state.hitTestUnreadableReason = state.hitTestUnreadableReason || "WEST_TOP_LEVEL_ERROR";
      addNote(state, state.diagnosticTargetAccessError);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getWestReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "WEST_RENDERED_TARGET_AUTHORITY_PROBE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      servedSourceAuthority: false,
      case5Authority: false,
      packetFormattingAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      syntheticActivationRepairAuthority: false,

      renderedTargetAuthorityProbeOwned: true,
      renderedPlanetProofSpreadRuntimeAdoptionOwned: true,
      targetAccessResolutionOwned: true,
      hearthTargetValidityCheckOwned: true,
      showReceiptDetectionOwned: true,
      showReceiptHitTestNonControllingWhenOffscreen: true,
      receiptPanelDetectionOwned: true,
      receiptTextNodeDetectionOwned: true,
      hitTestInspectionOwned: true,
      hitTestObservabilityRefinementOwned: true,
      pointerEventsInspectionOwned: true,
      blockerOverlayInspectionOwned: true,
      planetStageReadOwned: true,
      canvasMountReadOwned: true,
      canvasElementReadOwned: true,
      routeConductorRenderedDataProofReadOwned: true,
      namespaceRenderedProofScanOwned: true,
      canvasParentRenderedProofReadOwned: true,
      visiblePlanetProofReadOwned: true,
      globalSuppressionReadOwnedWhereSafelyAvailable: true,
      runtimeReleaseReadOwnedWhereSafelyAvailable: true,
      syntheticActivationAllowedByDefault: false,

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      acceptedRouteConductorLineage: ACCEPTED_ROUTE_CONDUCTOR_LINEAGE.slice(),
      currentCanvasParentContracts: CURRENT_CANVAS_PARENT_CONTRACTS.slice(),

      runWestRenderedReadApiAvailable: true,
      getWestReceiptApiAvailable: true,
      getWestStateApiAvailable: true,

      lastWestStatus: lastEvidencePacket ? lastEvidencePacket.WEST_STATUS : STATUS.READY,
      lastWestRenderedReadStatus: lastEvidencePacket ? lastEvidencePacket.WEST_RENDERED_READ_STATUS : FALLBACK.UNKNOWN,
      lastRenderedPlanetProofReady: lastEvidencePacket ? lastEvidencePacket.RENDERED_PLANET_PROOF_READY : FALLBACK.UNKNOWN,
      lastRenderedPlanetProofFullyInspected: lastEvidencePacket ? lastEvidencePacket.RENDERED_PLANET_PROOF_FULLY_INSPECTED : FALLBACK.UNKNOWN,
      lastVisiblePlanetProofReady: lastEvidencePacket ? lastEvidencePacket.VISIBLE_PLANET_PROOF_READY : FALLBACK.UNKNOWN,
      lastCanvasElementFound: lastEvidencePacket ? lastEvidencePacket.CANVAS_ELEMENT_FOUND : FALLBACK.UNKNOWN,
      lastRouteConductorContractReadableInRenderedTarget: lastEvidencePacket
        ? lastEvidencePacket.ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET
        : FALLBACK.UNKNOWN,
      lastWestRenderedProofSpreadComplete: lastEvidencePacket
        ? lastEvidencePacket.WEST_RENDERED_PROOF_SPREAD_COMPLETE
        : FALLBACK.UNKNOWN,
      lastRouteConductorContract: lastEvidencePacket ? lastEvidencePacket.ROUTE_CONDUCTOR_CONTRACT : FALLBACK.UNKNOWN,
      lastCurrentCanvasParentContract: lastEvidencePacket ? lastEvidencePacket.CURRENT_CANVAS_PARENT_CONTRACT : FALLBACK.UNKNOWN,
      lastCase1Support: lastEvidencePacket ? lastEvidencePacket.CASE_1_SUPPORT : SUPPORT.UNKNOWN,
      lastCase2Support: lastEvidencePacket ? lastEvidencePacket.CASE_2_SUPPORT : SUPPORT.HELD,
      lastCase3Support: lastEvidencePacket ? lastEvidencePacket.CASE_3_SUPPORT : SUPPORT.HELD,
      lastCase4Support: lastEvidencePacket ? lastEvidencePacket.CASE_4_SUPPORT : SUPPORT.UNKNOWN,
      lastCase6Support: lastEvidencePacket ? lastEvidencePacket.CASE_6_SUPPORT : SUPPORT.UNKNOWN,
      lastCase7Support: lastEvidencePacket ? lastEvidencePacket.CASE_7_SUPPORT : SUPPORT.UNKNOWN,
      lastHitTestUnreadableReason: lastEvidencePacket ? lastEvidencePacket.HIT_TEST_UNREADABLE_REASON : FALLBACK.UNKNOWN,

      ...FINAL_FALSE,

      updatedAt: nowIso()
    };
  }

  function getWestState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidencePacket = makeEvidencePacket(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticWest = api;
    root.HEARTH.diagnosticRailWest = api;
    root.HEARTH.diagnosticWestReceipt = getWestReceipt();
    root.HEARTH.diagnosticRailWestReceipt = getWestReceipt();
    root.HEARTH.diagnosticWestEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticRailWestEvidence = clonePlain(lastEvidencePacket);

    root.HEARTH_DIAGNOSTIC_WEST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_WEST = api;
    root.HEARTH_DIAGNOSTIC_WEST_RECEIPT = getWestReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_RECEIPT = getWestReceipt();
    root.HEARTH_DIAGNOSTIC_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
    currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    acceptedRouteConductorLineage: ACCEPTED_ROUTE_CONDUCTOR_LINEAGE.slice(),
    currentCanvasParentContracts: CURRENT_CANVAS_PARENT_CONTRACTS.slice(),

    runWestRenderedRead,
    getWestReceipt,
    getWestState,

    supportsRenderedPlanetProofSpreadRuntimeAdoption: true,
    supportsShowReceiptHitTestNonControllingWhenOffscreen: true,
    supportsRouteConductorV95RenderedDataProofRead: true,
    supportsNamespaceRenderedProofScan: true,
    supportsCanvasParentRenderedProofRead: true,
    supportsVisiblePlanetProofRead: true,
    supportsNorthOnlyAdjudication: true,

    ownsRenderedTargetEvidence: true,
    ownsRenderedPlanetProofEvidence: true,
    ownsFinalPrimaryCase: false,
    ownsRecommendation: false,
    ownsCase5: false,
    ownsRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsF13Claim: false,
    ownsF21: false,

    ...FINAL_FALSE
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
