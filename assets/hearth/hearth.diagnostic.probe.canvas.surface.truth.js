// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_TNT_v1_6
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
// Purpose:
// - Preserve the public NORTH-facing Canvas surface truth probe contract.
// - Preserve v1_5 canonical visible-surface disambiguation.
// - Add temporal transition measurement for the observed flash → cartoon/static/fallback surface behavior.
// - Measure whether the canonical canvas is:
//   1. never properly mounted,
//   2. mounted then collapsed,
//   3. pixel-bearing then replaced,
//   4. pixel-bearing then cleared,
//   5. covered/hidden by a later surface,
//   6. outside viewport,
//   7. stable and admissible.
// - Keep this probe read-only.
// - Do not create, draw, repair, release, restart, invoke lifecycle methods,
//   dispatch input, or mutate production state.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_TNT_v1_6";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_RECEIPT_v1_6";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_RECEIPT_v1_5";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-canvas-surface-truth-temporal-visible-surface-transition-v1-6";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";

  const CANONICAL_MOUNT_SELECTOR = "#hearthCanvasMount";

  const CANONICAL_CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvasMount canvas[data-hearth-expression-surface='true']",
    "#hearthCanvasMount canvas[data-hearth-visible-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas-hub='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-planet-canvas='true']",
    "#hearthCanvasMount canvas"
  ]);

  const ALL_CANVAS_SELECTOR = "canvas";

  const TEMPORAL_SAMPLE_PLAN = Object.freeze([
    { id: "T0_SYNC", delay: 0, mode: "SYNC" },
    { id: "T1_RAF", delay: 0, mode: "RAF" },
    { id: "T2_120MS", delay: 120, mode: "TIMEOUT" },
    { id: "T3_420MS", delay: 420, mode: "TIMEOUT" },
    { id: "T4_900MS", delay: 900, mode: "TIMEOUT" }
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
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
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  let lastReport = null;
  let lastReceipt = null;
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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
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

    if (Array.isArray(value) || isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 30000) || fallback;
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

  function readPath(base, path) {
    const parts = safeString(path).split(".");
    let cursor = base || root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
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

  function q(doc, selector) {
    if (!doc || !isFunction(doc.querySelector)) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(doc, selector) {
    if (!doc || !isFunction(doc.querySelectorAll)) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function firstElement(doc, selectors) {
    for (const selector of selectors || []) {
      const element = q(doc, selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function pathMatches(win, route) {
    try {
      const path = win && win.location ? win.location.pathname : "";
      const normal = safeString(route).replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
    }
  }

  function dataValue(doc, key) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset[key] : "",
        body && body.dataset ? body.dataset[key] : "",
        html && html.getAttribute ? html.getAttribute(`data-${key}`) : "",
        body && body.getAttribute ? body.getAttribute(`data-${key}`) : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function documentRoute(doc) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset.route : "",
        body && body.dataset ? body.dataset.route : "",
        html && html.getAttribute ? html.getAttribute("data-route") : "",
        body && body.getAttribute ? body.getAttribute("data-route") : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function contractFromDataset(doc) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset.contract : "",
        html && html.dataset ? html.dataset.hearthHtmlContract : "",
        html && html.dataset ? html.dataset.hearthShellContract : "",
        body && body.dataset ? body.dataset.contract : "",
        body && body.dataset ? body.dataset.hearthHtmlContract : "",
        html && html.getAttribute ? html.getAttribute("data-contract") : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function isDiagnosticReceiver(doc, win) {
    try {
      if (!doc || !doc.documentElement) return false;

      const contract = contractFromDataset(doc);
      const page = dataValue(doc, "page");
      const route = documentRoute(doc);

      return Boolean(
        pathMatches(win, DIAGNOSTIC_ROUTE) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /diagnostic/i.test(page) ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract)
      );
    } catch (_error) {
      return false;
    }
  }

  function hasHearthTargetSignals(doc, win) {
    try {
      if (!doc || !doc.documentElement) return false;
      if (isDiagnosticReceiver(doc, win)) return false;

      const page = dataValue(doc, "page");
      const alias = dataValue(doc, "pageAlias");
      const context = firstKnown(dataValue(doc, "pageContext"), dataValue(doc, "context"));
      const route = documentRoute(doc);

      return Boolean(
        pathMatches(win, TARGET_ROUTE) ||
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet engine|planet factory|visible globe|visible planet|canvas expression|mirrorland formation/i.test(context) ||
        q(doc, CANONICAL_MOUNT_SELECTOR) ||
        q(doc, ALL_CANVAS_SELECTOR)
      );
    } catch (_error) {
      return false;
    }
  }

  function getTargetContext(payload = {}) {
    const ownDocument = root.document || null;

    let targetWindow = null;
    let targetDocument = null;
    let targetSource = "UNKNOWN";
    let targetAccessError = "NONE";

    try {
      if (payload.targetWindow && payload.targetDocument) {
        targetWindow = payload.targetWindow;
        targetDocument = payload.targetDocument;
        targetSource = "PAYLOAD_TARGET_WINDOW_DOCUMENT";
      } else if (payload.targetWindow && payload.targetWindow.document) {
        targetWindow = payload.targetWindow;
        targetDocument = payload.targetWindow.document;
        targetSource = "PAYLOAD_TARGET_WINDOW";
      } else if (payload.targetDocument) {
        targetWindow = payload.targetDocument.defaultView || root;
        targetDocument = payload.targetDocument;
        targetSource = "PAYLOAD_TARGET_DOCUMENT";
      }
    } catch (error) {
      targetWindow = null;
      targetDocument = null;
      targetSource = "PAYLOAD_TARGET_BLOCKED";
      targetAccessError = bounded(error && error.message ? error.message : error, 900);
    }

    if (targetDocument && isDiagnosticReceiver(targetDocument, targetWindow)) {
      targetWindow = null;
      targetDocument = null;
      targetSource = "PAYLOAD_DIAGNOSTIC_RECEIVER_REJECTED";
    }

    if (!targetDocument && payload.frameElement) {
      try {
        const frameWindow = payload.frameElement.contentWindow;
        const frameDocument =
          payload.frameElement.contentDocument ||
          (frameWindow && frameWindow.document);

        if (frameWindow && frameDocument && !isDiagnosticReceiver(frameDocument, frameWindow)) {
          targetWindow = frameWindow;
          targetDocument = frameDocument;
          targetSource = "PAYLOAD_FRAME_ELEMENT";
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    if (!targetDocument && ownDocument) {
      try {
        const frames = qa(ownDocument, "iframe");
        const frame = frames.find((candidate) => {
          const src = safeString(candidate.getAttribute("src"));
          const id = safeString(candidate.id);
          const flag =
            candidate.dataset &&
            candidate.dataset.hearthDiagnosticTargetFrame === "true";

          return (
            flag ||
            id === "hearthDiagnosticTargetFrame" ||
            src.includes(TARGET_ROUTE) ||
            src === TARGET_ROUTE
          );
        });

        if (frame) {
          const frameWindow = frame.contentWindow;
          const frameDocument =
            frame.contentDocument || (frameWindow && frameWindow.document);

          if (frameWindow && frameDocument && !isDiagnosticReceiver(frameDocument, frameWindow)) {
            targetWindow = frameWindow;
            targetDocument = frameDocument;
            targetSource = "DISCOVERED_TARGET_IFRAME";
          }
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    if (!targetDocument && ownDocument) {
      try {
        if (!isDiagnosticReceiver(ownDocument, root) && hasHearthTargetSignals(ownDocument, root)) {
          targetWindow = root;
          targetDocument = ownDocument;
          targetSource = "CURRENT_HEARTH_DOCUMENT";
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    return {
      targetWindow,
      targetDocument,
      targetSource,
      targetAvailable: Boolean(targetWindow && targetDocument),
      targetAccessError
    };
  }

  function scriptInfo(doc, path) {
    const scripts = qa(doc, "script[src]");
    const matches = [];

    for (let index = 0; index < scripts.length; index += 1) {
      const script = scripts[index];
      const src = safeString(script.getAttribute("src"));

      let pathname = src;
      let cacheKey = "NONE";

      try {
        const base =
          root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";
        const url = new URL(src, base);
        pathname = url.pathname;
        cacheKey =
          url.searchParams.get("v") ||
          url.searchParams.get("cacheKey") ||
          url.searchParams.get("northRecovery") ||
          "NONE";
      } catch (_error) {}

      if (pathname === path || pathname.endsWith(path) || src.includes(path)) {
        matches.push({
          order: index + 1,
          src,
          pathname,
          cacheKey,
          id: safeString(script.id, "NONE"),
          async: Boolean(script.async),
          defer: Boolean(script.defer)
        });
      }
    }

    const last = matches[matches.length - 1] || null;

    return {
      present: matches.length > 0,
      count: matches.length,
      lastOrder: last ? last.order : 0,
      src: last ? last.src : "NONE",
      cacheKey: last ? last.cacheKey : "NONE",
      id: last ? last.id : "NONE",
      matches
    };
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const safeGetters = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasSurfaceReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getPresentationReceipt",
      "getPresentationPlatterReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getState",
      "getReport"
    ];

    for (const method of safeGetters) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;
    if (isObject(authority.report)) return authority.report;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.RENEWAL_CONTRACT,
      value.renewalContract,
      value.INTERNAL_RENEWAL_CONTRACT,
      value.internalRenewalContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.hearthCanvasContract,
      value.CANVAS_CONTRACT,
      value.CANVAS_NAMESPACE_CONTRACT
    );
  }

  function receiptOf(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.RENEWAL_RECEIPT,
      value.renewalReceipt,
      value.INTERNAL_RENEWAL_RECEIPT,
      value.internalRenewalReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.hearthCanvasReceipt,
      value.CANVAS_RECEIPT,
      value.CANVAS_NAMESPACE_RECEIPT
    );
  }

  function authorityMethods(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 80);
    } catch (_error) {
      return [];
    }
  }

  function inspectCanvasAuthority(targetWindow) {
    const scopes = [
      { scope: "TARGET_WINDOW", base: targetWindow || null },
      { scope: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of CANVAS_AUTHORITY_ALIASES) {
        const authority = readPath(scope.base, path);
        if (!authority) continue;

        const receipt = getReceiptFromAuthority(authority) || {};
        const contract = firstKnown(contractOf(receipt), contractOf(authority));
        const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
        const methods = authorityMethods(authority);

        candidates.push({
          observed: true,
          scope: scope.scope,
          path,
          contract,
          receipt: receiptName,
          methodCount: methods.length,
          methods,
          authority
        });
      }
    }

    const selected =
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW" && candidate.contract !== "UNKNOWN") ||
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW") ||
      candidates.find((candidate) => candidate.contract !== "UNKNOWN") ||
      candidates[0] ||
      null;

    return {
      observed: Boolean(selected),
      scope: selected ? selected.scope : "NONE",
      path: selected ? selected.path : "NONE",
      contract: selected ? selected.contract : "UNKNOWN",
      receipt: selected ? selected.receipt : "UNKNOWN",
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods : [],
      candidates: candidates.map((candidate) => ({
        scope: candidate.scope,
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        methodCount: candidate.methodCount
      }))
    };
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();

      return {
        left: safeNumber(rect.left),
        top: safeNumber(rect.top),
        right: safeNumber(rect.right),
        bottom: safeNumber(rect.bottom),
        width: safeNumber(rect.width),
        height: safeNumber(rect.height)
      };
    } catch (_error) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
  }

  function rectNonzero(rect) {
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function viewportIntersecting(targetWindow, rect) {
    if (!targetWindow || !rectNonzero(rect)) return false;

    const viewportWidth = safeNumber(targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow.innerHeight, 0);

    if (!viewportWidth || !viewportHeight) return false;

    return !(
      rect.right <= 0 ||
      rect.bottom <= 0 ||
      rect.left >= viewportWidth ||
      rect.top >= viewportHeight
    );
  }

  function cssSummary(targetWindow, element) {
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return {
        visible: false,
        display: "UNKNOWN",
        visibility: "UNKNOWN",
        opacity: "UNKNOWN",
        position: "UNKNOWN",
        zIndex: "UNKNOWN",
        pointerEvents: "UNKNOWN",
        transform: "UNKNOWN",
        overflow: "UNKNOWN"
      };
    }

    try {
      const style = targetWindow.getComputedStyle(element);
      const display = safeString(style.display, "UNKNOWN");
      const visibility = safeString(style.visibility, "UNKNOWN");
      const opacity = safeString(style.opacity, "UNKNOWN");

      return {
        visible: Boolean(
          display !== "none" &&
          visibility !== "hidden" &&
          visibility !== "collapse" &&
          safeNumber(opacity, 1) > 0
        ),
        display,
        visibility,
        opacity,
        position: safeString(style.position, "UNKNOWN"),
        zIndex: safeString(style.zIndex, "UNKNOWN"),
        pointerEvents: safeString(style.pointerEvents, "UNKNOWN"),
        transform: safeString(style.transform, "UNKNOWN"),
        overflow: safeString(style.overflow, "UNKNOWN")
      };
    } catch (_error) {
      return {
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE",
        transform: "UNREADABLE",
        overflow: "UNREADABLE"
      };
    }
  }

  function containsOrEquals(parent, child) {
    if (!parent || !child) return false;
    if (parent === child) return true;

    try {
      return Boolean(parent.contains(child));
    } catch (_error) {
      return false;
    }
  }

  function elementDescriptor(element, index = 0) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "UNKNOWN").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes =
        element.classList && element.classList.length
          ? `.${Array.from(element.classList).slice(0, 6).join(".")}`
          : "";
    } catch (_error) {}

    return `${tag}${id}${classes}${index ? `[${index}]` : ""}` || "UNKNOWN_ELEMENT";
  }

  function elementFingerprint(element, index = 0) {
    if (!element) return "NONE";

    const dataset = element.dataset || {};
    const id = safeString(element.id, "NO_ID");
    const cls = element.className ? bounded(element.className, 160) : "NO_CLASS";
    const width = safeNumber(element.width, 0);
    const height = safeNumber(element.height, 0);

    return [
      elementDescriptor(element, index),
      `id:${id}`,
      `class:${cls}`,
      `w:${width}`,
      `h:${height}`,
      `expr:${safeString(dataset.hearthExpressionSurface, "NA")}`,
      `visible:${safeString(dataset.hearthVisibleCanvas, "NA")}`,
      `hub:${safeString(dataset.hearthCanvasHub, "NA")}`
    ].join("|");
  }

  function canvasDataset(canvas) {
    if (!canvas || !canvas.dataset) {
      return {
        contract: "UNKNOWN",
        receipt: "UNKNOWN",
        visibleCanvas: "UNKNOWN",
        expressionSurface: "UNKNOWN",
        canvasHub: "UNKNOWN",
        fallback: "UNKNOWN",
        stage: "UNKNOWN"
      };
    }

    return {
      contract: firstKnown(
        canvas.dataset.hearthCanvasContract,
        canvas.dataset.contract,
        canvas.dataset.hearthCanvasRenewalContract,
        canvas.dataset.hearthCanvasCurrentParentContract
      ),
      receipt: firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasRenewalReceipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt
      ),
      visibleCanvas: firstKnown(canvas.dataset.hearthVisibleCanvas),
      expressionSurface: firstKnown(canvas.dataset.hearthExpressionSurface),
      canvasHub: firstKnown(canvas.dataset.hearthCanvasHub),
      fallback: firstKnown(
        canvas.dataset.hearthFallbackSurface,
        canvas.dataset.hearthCartoonSurface,
        canvas.dataset.fallback,
        canvas.dataset.mode
      ),
      stage: firstKnown(
        canvas.dataset.hearthStage,
        canvas.dataset.hearthSurfaceStage,
        canvas.dataset.stage
      )
    };
  }

  function textSignature(value) {
    return bounded(value, 240).toUpperCase();
  }

  function fallbackSignal(element, summary = {}) {
    const pieces = [];

    try {
      pieces.push(elementDescriptor(element));
      pieces.push(safeString(element && element.id));
      pieces.push(safeString(element && element.className));
      if (element && element.dataset) {
        pieces.push(JSON.stringify(element.dataset));
      }
      pieces.push(summary.datasetFallback);
      pieces.push(summary.datasetStage);
    } catch (_error) {}

    const joined = textSignature(pieces.join(" "));

    const matched = /FALLBACK|CARTOON|PLACEHOLDER|STATIC|SIMPLE|DEMO|THUMB|PREVIEW|POSTER|BACKUP|SAFE|SKETCH/.test(joined);

    return {
      detected: matched,
      signature: joined || "NONE"
    };
  }

  function getCanvas2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) {
      return { ready: false, ctx: null, status: "CANVAS_GET_CONTEXT_UNAVAILABLE" };
    }

    try {
      const ctx = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });

      return {
        ready: Boolean(ctx),
        ctx,
        status: ctx ? "CONTEXT_2D_READY" : "CONTEXT_2D_NULL"
      };
    } catch (error) {
      return {
        ready: false,
        ctx: null,
        status: `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 600)}`
      };
    }
  }

  function samplePixels(canvas, ctx) {
    if (!canvas || !ctx) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        centerColor: "NONE",
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        centerColor: "NONE",
        reason: "CANVAS_INTERNAL_SIZE_OR_GET_IMAGE_DATA_UNAVAILABLE"
      };
    }

    try {
      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.5, 0.22],
        [0.5, 0.78],
        [0.22, 0.5],
        [0.78, 0.5],
        [0.12, 0.12],
        [0.88, 0.12],
        [0.12, 0.88],
        [0.88, 0.88]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;
      let centerColor = "NONE";
      const unique = new Set();

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - 1, Math.floor(width * px)));
        const y = Math.max(0, Math.min(height - 1, Math.floor(height * py)));
        const data = ctx.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const red = data[0] || 0;
        const green = data[1] || 0;
        const blue = data[2] || 0;
        const alpha = data[3] || 0;
        const color = `${red},${green},${blue},${alpha}`;

        if (sampleCount === 1) centerColor = color;
        if (alpha > 0) alphaPixelCount += 1;
        if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) {
          visiblePixelCount += 1;
        }

        unique.add(color);
      }

      const visible = visiblePixelCount > 0;

      return {
        status: visible
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
            : "PIXEL_SAMPLE_BLANK",
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        centerColor,
        reason: visible
          ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
          : alphaPixelCount > 0
            ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
            : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        centerColor: "UNREADABLE",
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function findCanonicalCanvas(targetDocument) {
    return firstElement(targetDocument, CANONICAL_CANVAS_SELECTORS);
  }

  function describeCanvas(targetWindow, canvas, index, selector, canonicalMount) {
    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const dataset = canvasDataset(canvas);

    const summary = {
      index,
      selector: selector || "canvas",
      descriptor: elementDescriptor(canvas, index),
      fingerprint: elementFingerprint(canvas, index),
      id: canvas && canvas.id ? canvas.id : "NONE",
      datasetContract: dataset.contract,
      datasetReceipt: dataset.receipt,
      datasetVisibleCanvas: dataset.visibleCanvas,
      datasetExpressionSurface: dataset.expressionSurface,
      datasetCanvasHub: dataset.canvasHub,
      datasetFallback: dataset.fallback,
      datasetStage: dataset.stage,
      inCanonicalMount: Boolean(canonicalMount && canvas && containsOrEquals(canonicalMount, canvas)),
      widthAttribute: canvas ? safeNumber(canvas.width, 0) : 0,
      heightAttribute: canvas ? safeNumber(canvas.height, 0) : 0,
      internalSizeNonzero: Boolean(canvas && safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0),
      rectLeft: rect.left,
      rectTop: rect.top,
      rectRight: rect.right,
      rectBottom: rect.bottom,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectNonzero(rect),
      computedVisible: css.visible,
      computedDisplay: css.display,
      computedVisibility: css.visibility,
      computedOpacity: css.opacity,
      computedPosition: css.position,
      computedZIndex: css.zIndex,
      computedPointerEvents: css.pointerEvents,
      computedTransform: css.transform,
      computedOverflow: css.overflow,
      viewportIntersecting: viewportIntersecting(targetWindow, rect),
      context2dReady: ctx.ready,
      context2dStatus: ctx.status,
      pixelSampleStatus: pixels.status,
      pixelVisible: pixels.visible,
      pixelSampleCount: pixels.sampleCount,
      visiblePixelCount: pixels.visiblePixelCount,
      alphaPixelCount: pixels.alphaPixelCount,
      uniqueColorCount: pixels.uniqueColorCount,
      centerColor: pixels.centerColor,
      pixelSampleReason: pixels.reason
    };

    const fallback = fallbackSignal(canvas, summary);
    summary.fallbackSignalDetected = fallback.detected;
    summary.fallbackSignalSignature = fallback.signature;

    return summary;
  }

  function describeMount(targetWindow, mount) {
    if (!mount) {
      return {
        found: false,
        descriptor: "NONE",
        rectNonzero: false,
        rectWidth: 0,
        rectHeight: 0,
        computedVisible: false,
        childElementCount: 0,
        childCanvasCount: 0,
        textSignature: "NONE"
      };
    }

    const rect = getRect(mount);
    const css = cssSummary(targetWindow, mount);

    let childElementCount = 0;
    let childCanvasCount = 0;
    let text = "";

    try {
      childElementCount = mount.children ? mount.children.length : 0;
      childCanvasCount = mount.querySelectorAll ? mount.querySelectorAll("canvas").length : 0;
      text = mount.textContent || "";
    } catch (_error) {}

    return {
      found: true,
      descriptor: elementDescriptor(mount),
      rectLeft: rect.left,
      rectTop: rect.top,
      rectRight: rect.right,
      rectBottom: rect.bottom,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectNonzero(rect),
      computedVisible: css.visible,
      computedDisplay: css.display,
      computedVisibility: css.visibility,
      computedOpacity: css.opacity,
      computedPosition: css.position,
      computedZIndex: css.zIndex,
      computedOverflow: css.overflow,
      viewportIntersecting: viewportIntersecting(targetWindow, rect),
      childElementCount,
      childCanvasCount,
      textSignature: textSignature(text)
    };
  }

  function summarizeSnapshot(context, label) {
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    if (!context.targetAvailable || !targetDocument) {
      return {
        sampleId: label,
        timestamp: nowIso(),
        targetAvailable: false,
        status: "TARGET_CONTEXT_UNAVAILABLE",
        canonicalMountFound: false,
        canonicalCanvasFound: false,
        totalCanvasCount: 0,
        pixelBearingCanvasFound: false,
        pixelBearingCanvasIsCanonical: false,
        nonCanonicalPixelBearingCanvasCount: 0,
        fallbackSurfaceSignalDetected: false
      };
    }

    const canonicalMount = q(targetDocument, CANONICAL_MOUNT_SELECTOR);
    const canonicalFound = findCanonicalCanvas(targetDocument);
    const canonicalCanvas = canonicalFound.element;
    const allCanvases = qa(targetDocument, ALL_CANVAS_SELECTOR);

    const mountSummary = describeMount(targetWindow, canonicalMount);

    const allCanvasSummaries = allCanvases.map((canvas, index) =>
      describeCanvas(
        targetWindow,
        canvas,
        index + 1,
        canvas === canonicalCanvas ? canonicalFound.selector : "canvas",
        canonicalMount
      )
    );

    const canonicalSummary = canonicalCanvas
      ? describeCanvas(
          targetWindow,
          canonicalCanvas,
          allCanvases.indexOf(canonicalCanvas) + 1 || 1,
          canonicalFound.selector,
          canonicalMount
        )
      : null;

    const pixelBearingSummaries = allCanvasSummaries.filter((entry) => entry.pixelVisible === true);
    const firstPixelBearingSummary = pixelBearingSummaries[0] || null;
    const firstPixelBearingCanvas = firstPixelBearingSummary
      ? allCanvases[firstPixelBearingSummary.index - 1]
      : null;

    const pixelBearingCanvasFound = Boolean(firstPixelBearingSummary);
    const pixelBearingCanvasIsCanonical = Boolean(
      canonicalCanvas &&
      firstPixelBearingCanvas &&
      canonicalCanvas === firstPixelBearingCanvas
    );

    const nonCanonicalPixelBearingCanvasCount = pixelBearingSummaries.filter((entry) => {
      const canvas = allCanvases[entry.index - 1];
      return canvas && canonicalCanvas && canvas !== canonicalCanvas;
    }).length;

    const fallbackSurfaceSignalDetected = Boolean(
      mountSummary.textSignature &&
      /FALLBACK|CARTOON|PLACEHOLDER|STATIC|SIMPLE|DEMO|THUMB|PREVIEW|POSTER|BACKUP|SAFE|SKETCH/.test(mountSummary.textSignature)
    ) || allCanvasSummaries.some((entry) => entry.fallbackSignalDetected);

    const canonicalSurfaceAdmissible = Boolean(
      canonicalSummary &&
      canonicalSummary.inCanonicalMount &&
      canonicalSummary.internalSizeNonzero &&
      canonicalSummary.rectNonzero &&
      canonicalSummary.computedVisible &&
      canonicalSummary.viewportIntersecting &&
      canonicalSummary.context2dReady
    );

    return {
      sampleId: label,
      timestamp: nowIso(),
      targetAvailable: true,
      status: "SNAPSHOT_RETURNED",
      canonicalMountFound: Boolean(canonicalMount),
      canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
      mountSummary,
      canonicalCanvasFound: Boolean(canonicalCanvas),
      canonicalCanvasSelector: canonicalFound.selector,
      canonicalCanvasDescriptor: canonicalSummary ? canonicalSummary.descriptor : "NONE",
      canonicalCanvasFingerprint: canonicalSummary ? canonicalSummary.fingerprint : "NONE",
      canonicalCanvasIndex: canonicalSummary ? canonicalSummary.index : 0,
      canonicalCanvasInMount: canonicalSummary ? canonicalSummary.inCanonicalMount : false,
      canonicalCanvasSurfaceAdmissible,
      canvasRectNonzero: canonicalSummary ? canonicalSummary.rectNonzero : false,
      canvasRectWidth: canonicalSummary ? canonicalSummary.rectWidth : 0,
      canvasRectHeight: canonicalSummary ? canonicalSummary.rectHeight : 0,
      canvasComputedVisible: canonicalSummary ? canonicalSummary.computedVisible : false,
      canvasViewportIntersecting: canonicalSummary ? canonicalSummary.viewportIntersecting : false,
      canvasContext2dReady: canonicalSummary ? canonicalSummary.context2dReady : false,
      canvasPixelSampleStatus: canonicalSummary ? canonicalSummary.pixelSampleStatus : "NO_PIXEL_SAMPLE",
      canvasPixelVisible: canonicalSummary ? canonicalSummary.pixelVisible : false,
      canvasVisiblePixelCount: canonicalSummary ? canonicalSummary.visiblePixelCount : 0,
      canvasAlphaPixelCount: canonicalSummary ? canonicalSummary.alphaPixelCount : 0,
      canvasUniqueColorCount: canonicalSummary ? canonicalSummary.uniqueColorCount : 0,
      canvasCenterColor: canonicalSummary ? canonicalSummary.centerColor : "NONE",
      totalCanvasCount: allCanvases.length,
      pixelBearingCanvasFound,
      pixelBearingCanvasCount: pixelBearingSummaries.length,
      pixelBearingCanvasIsCanonical,
      pixelBearingCanvasDescriptor: firstPixelBearingSummary ? firstPixelBearingSummary.descriptor : "NONE",
      pixelBearingCanvasFingerprint: firstPixelBearingSummary ? firstPixelBearingSummary.fingerprint : "NONE",
      pixelBearingCanvasRectNonzero: firstPixelBearingSummary ? firstPixelBearingSummary.rectNonzero : false,
      pixelBearingCanvasInCanonicalMount: firstPixelBearingSummary ? firstPixelBearingSummary.inCanonicalMount : false,
      nonCanonicalPixelBearingCanvasCount,
      fallbackSurfaceSignalDetected,
      canonicalCanvasSummary: clonePlain(canonicalSummary || {}),
      firstPixelBearingCanvasSummary: clonePlain(firstPixelBearingSummary || {}),
      pixelBearingCanvasSummaries: clonePlain(pixelBearingSummaries),
      allCanvasSummaries: clonePlain(allCanvasSummaries)
    };
  }

  function waitForTemporalSample(targetWindow, plan) {
    return new Promise((resolve) => {
      if (plan.mode === "SYNC") {
        resolve();
        return;
      }

      if (plan.mode === "RAF" && targetWindow && isFunction(targetWindow.requestAnimationFrame)) {
        try {
          targetWindow.requestAnimationFrame(() => resolve());
          return;
        } catch (_error) {}
      }

      const delay = Math.max(0, safeNumber(plan.delay, 0));
      setTimeout(() => resolve(), delay);
    });
  }

  async function collectTemporalSnapshots(context) {
    const snapshots = [];

    for (const plan of TEMPORAL_SAMPLE_PLAN) {
      await waitForTemporalSample(context.targetWindow || root, plan);
      snapshots.push(summarizeSnapshot(context, plan.id));
    }

    return snapshots;
  }

  function analyzeTemporalSnapshots(snapshots) {
    const usable = Array.isArray(snapshots) ? snapshots : [];
    const first = usable[0] || {};
    const last = usable[usable.length - 1] || {};
    const any = (predicate) => usable.some(predicate);
    const all = (predicate) => usable.length > 0 && usable.every(predicate);

    const firstPixelVisibleIndex = usable.findIndex((s) => s.canvasPixelVisible === true);
    const lastPixelVisibleIndex = (() => {
      for (let index = usable.length - 1; index >= 0; index -= 1) {
        if (usable[index].canvasPixelVisible === true) return index;
      }
      return -1;
    })();

    const firstRectNonzeroIndex = usable.findIndex((s) => s.canvasRectNonzero === true);
    const lastRectNonzeroIndex = (() => {
      for (let index = usable.length - 1; index >= 0; index -= 1) {
        if (usable[index].canvasRectNonzero === true) return index;
      }
      return -1;
    })();

    const fingerprints = usable.map((s) => s.canonicalCanvasFingerprint || "NONE");
    const uniqueFingerprints = Array.from(new Set(fingerprints));
    const canonicalCanvasFingerprintChanged = uniqueFingerprints.length > 1;

    const pixelBearingFingerprints = usable.map((s) => s.pixelBearingCanvasFingerprint || "NONE");
    const uniquePixelBearingFingerprints = Array.from(new Set(pixelBearingFingerprints));
    const pixelBearingCanvasFingerprintChanged = uniquePixelBearingFingerprints.length > 1;

    const rectCollapsedAfterNonzero =
      firstRectNonzeroIndex >= 0 &&
      usable.slice(firstRectNonzeroIndex + 1).some((s) => s.canvasRectNonzero === false);

    const pixelClearedAfterVisible =
      firstPixelVisibleIndex >= 0 &&
      usable.slice(firstPixelVisibleIndex + 1).some((s) => s.canvasPixelVisible === false);

    const pixelAppearedThenNonCanonical =
      firstPixelVisibleIndex >= 0 &&
      usable.slice(firstPixelVisibleIndex).some(
        (s) => s.pixelBearingCanvasFound && s.pixelBearingCanvasIsCanonical === false
      );

    const fallbackSurfaceSignalDetected = any((s) => s.fallbackSurfaceSignalDetected === true);

    const canvasCountChanged =
      new Set(usable.map((s) => safeNumber(s.totalCanvasCount, 0))).size > 1;

    const mountChildCountChanged =
      new Set(usable.map((s) => s.mountSummary ? safeNumber(s.mountSummary.childElementCount, 0) : 0)).size > 1;

    const stableCanonicalSurfacePassed = all(
      (s) =>
        s.canonicalMountFound === true &&
        s.canonicalCanvasFound === true &&
        s.canonicalCanvasInMount === true &&
        s.canvasRectNonzero === true &&
        s.canvasComputedVisible === true &&
        s.canvasViewportIntersecting === true &&
        s.canvasContext2dReady === true &&
        s.canvasPixelVisible === true &&
        s.pixelBearingCanvasIsCanonical === true
    );

    let status = "TEMPORAL_SURFACE_STABLE_OR_UNCHANGED";
    let failureClass = "TEMPORAL_SURFACE_NO_TRANSITION_FAILURE_OBSERVED";
    let reason = "NO_TEMPORAL_TRANSITION_FAILURE_OBSERVED";
    let coordinate = "TEMPORAL_SURFACE_CHRONOLOGY";
    let owner = "NONE";
    let file = "NONE";
    let action = "RETURN_TO_NORTH_FOR_CANONICAL_SURFACE_ARBITRATION";
    let certainty = "TEMPORAL_DIAGNOSTIC_RETURNED";

    if (usable.length === 0) {
      status = "TEMPORAL_SAMPLING_NOT_RUN";
      failureClass = "TEMPORAL_SAMPLING_NOT_RUN";
      reason = "NO_TEMPORAL_SNAPSHOTS_AVAILABLE";
      owner = "DIAGNOSTIC_PROBE";
      file = FILE;
      action = "CALL_runProbeCanvasSurfaceTruth";
      certainty = "NO_TEMPORAL_EVIDENCE";
    } else if (stableCanonicalSurfacePassed) {
      status = "TEMPORAL_CANONICAL_SURFACE_STABLE_PASSED";
      failureClass = "TEMPORAL_CANONICAL_SURFACE_STABLE_PASSED";
      reason = "CANONICAL_CANVAS_REMAINED_MOUNTED_NONZERO_VISIBLE_PIXEL_BEARING_AND_PIXEL_BEARING_IDENTITY_DID_NOT_DIVERGE";
      coordinate = "NONE";
      owner = "NONE";
      file = "NONE";
      action = "RETURN_STABLE_TEMPORAL_SURFACE_TRUTH_TO_NORTH";
      certainty = "DEFINITIVE_TEMPORAL_SURFACE_PASS_NO_FINAL_CLAIM";
    } else if (canonicalCanvasFingerprintChanged || canvasCountChanged || mountChildCountChanged) {
      status = "TEMPORAL_CANVAS_DOM_REPLACEMENT_OR_MOUNT_CHURN_DETECTED";
      failureClass = "CANONICAL_CANVAS_DOM_REPLACED_OR_MOUNT_CHILDREN_CHANGED";
      reason = "CANONICAL_CANVAS_OR_MOUNT_CHILDREN_CHANGED_DURING_TEMPORAL_SAMPLE_WINDOW";
      coordinate = "CANONICAL_CANVAS_FINGERPRINT_STABILITY";
      owner = "CANVAS_DOM_BINDING_OR_FALLBACK_SWAP";
      file = CANVAS_FILE;
      action = "AUDIT_CANVAS_DOM_BINDING_FOR_LATE_REPLACEMENT_OR_FALLBACK_SWAP";
      certainty = "DEFINITIVE_TEMPORAL_DOM_CHURN";
    } else if (rectCollapsedAfterNonzero) {
      status = "TEMPORAL_CANONICAL_CANVAS_RECT_COLLAPSED_AFTER_FIRST_PAINT";
      failureClass = "CANONICAL_CANVAS_RECT_COLLAPSED_AFTER_FIRST_PAINT";
      reason = "CANONICAL_CANVAS_RECT_WAS_NONZERO_THEN_BECAME_ZERO_DURING_TEMPORAL_SAMPLE_WINDOW";
      coordinate = "CANVAS_RECT_NONZERO_TEMPORAL_STABILITY";
      owner = "CSS_LAYOUT_OR_CANVAS_PLACEMENT";
      file = CANVAS_FILE;
      action = "AUDIT_CANONICAL_CANVAS_STYLE_SIZE_PARENT_LAYOUT_AND_LATE_CLASS_OR_STYLE_CHANGES";
      certainty = "DEFINITIVE_TEMPORAL_RECT_COLLAPSE";
    } else if (pixelClearedAfterVisible) {
      status = "TEMPORAL_CANONICAL_CANVAS_PIXELS_CLEARED_AFTER_FIRST_PAINT";
      failureClass = "CANONICAL_CANVAS_PIXELS_CLEARED_AFTER_FIRST_PAINT";
      reason = "CANONICAL_CANVAS_VISIBLE_PIXELS_WERE_OBSERVED_THEN_LOST_DURING_TEMPORAL_SAMPLE_WINDOW";
      coordinate = "CANVAS_PIXEL_VISIBLE_TEMPORAL_STABILITY";
      owner = "CANVAS_DRAW_PATH_OR_FALLBACK_PAINT";
      file = CANVAS_FILE;
      action = "AUDIT_CANVAS_POST_FIRST_PAINT_CLEAR_RESET_OR_FALLBACK_PAINT_PATH";
      certainty = "DEFINITIVE_TEMPORAL_PIXEL_LOSS";
    } else if (pixelAppearedThenNonCanonical || pixelBearingCanvasFingerprintChanged) {
      status = "TEMPORAL_PIXEL_BEARING_CANVAS_IDENTITY_CHANGED";
      failureClass = "PIXEL_BEARING_CANVAS_IDENTITY_CHANGED_DURING_SAMPLE_WINDOW";
      reason = "PIXEL_BEARING_CANVAS_IDENTITY_CHANGED_OR_BECAME_NON_CANONICAL_DURING_TEMPORAL_SAMPLE_WINDOW";
      coordinate = "PIXEL_BEARING_CANVAS_TEMPORAL_IDENTITY";
      owner = "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT";
      file = CANVAS_FILE;
      action = "ALIGN_THE_PIXEL_BEARING_SURFACE_WITH_THE_CANONICAL_MOUNTED_CANVAS_ACROSS_THE_FULL_LOAD_WINDOW";
      certainty = "DEFINITIVE_TEMPORAL_PIXEL_IDENTITY_DIVERGENCE";
    } else if (fallbackSurfaceSignalDetected) {
      status = "TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED";
      failureClass = "FALLBACK_OR_STATIC_SURFACE_SIGNAL_DETECTED";
      reason = "FALLBACK_STATIC_CARTOON_OR_PLACEHOLDER_SIGNAL_WAS_OBSERVED_IN_CANVAS_OR_MOUNT_SIGNATURE";
      coordinate = "FALLBACK_SURFACE_SIGNAL";
      owner = "CANVAS_FALLBACK_PATH_OR_ROUTE_SURFACE_SWAP";
      file = CANVAS_FILE;
      action = "AUDIT_CANVAS_FALLBACK_SURFACE_SELECTION_AND_EXIT_CONDITIONS";
      certainty = "TEMPORAL_FALLBACK_SIGNAL_PRESENT";
    }

    return {
      status,
      failureClass,
      reason,
      coordinate,
      owner,
      file,
      action,
      certainty,
      snapshotCount: usable.length,
      firstSampleId: first.sampleId || "NONE",
      lastSampleId: last.sampleId || "NONE",
      firstPixelVisibleSampleId: firstPixelVisibleIndex >= 0 ? usable[firstPixelVisibleIndex].sampleId : "NONE",
      lastPixelVisibleSampleId: lastPixelVisibleIndex >= 0 ? usable[lastPixelVisibleIndex].sampleId : "NONE",
      firstRectNonzeroSampleId: firstRectNonzeroIndex >= 0 ? usable[firstRectNonzeroIndex].sampleId : "NONE",
      lastRectNonzeroSampleId: lastRectNonzeroIndex >= 0 ? usable[lastRectNonzeroIndex].sampleId : "NONE",
      canonicalCanvasFingerprintChanged,
      pixelBearingCanvasFingerprintChanged,
      canvasCountChanged,
      mountChildCountChanged,
      rectCollapsedAfterNonzero,
      pixelClearedAfterVisible,
      pixelAppearedThenNonCanonical,
      fallbackSurfaceSignalDetected,
      stableCanonicalSurfacePassed,
      uniqueCanonicalCanvasFingerprints: uniqueFingerprints,
      uniquePixelBearingCanvasFingerprints: uniquePixelBearingFingerprints
    };
  }

  function resolveCanonicalVerdict(input) {
    const context = input.context;
    const snapshot = input.snapshot || {};

    if (!context.targetAvailable) {
      return {
        status: "TARGET_CONTEXT_UNAVAILABLE",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "TARGET_CONTEXT_STATUS",
        failureClass: "TARGET_CONTEXT_UNAVAILABLE",
        reason: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        owner: "DIAGNOSTIC_TARGET_ACCESS",
        file: FILE,
        action: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE",
        certainty: "DEFINITIVE_TARGET_CONTEXT_FAILURE"
      };
    }

    if (!snapshot.canonicalMountFound) {
      return {
        status: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANONICAL_MOUNT_FOUND",
        failureClass: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        reason: "#hearthCanvasMount_WAS_NOT_FOUND_IN_TARGET_DOCUMENT",
        owner: "HTML_SHELL_OR_CANVAS_PLACEMENT",
        file: "/showroom/globe/hearth/index.html",
        action: "RESTORE_OR_CONFIRM_CANONICAL_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_MOUNT_FAILURE"
      };
    }

    if (!snapshot.canonicalCanvasFound) {
      return {
        status: "CANONICAL_CANVAS_NOT_FOUND",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANONICAL_CANVAS_FOUND",
        failureClass: "CANONICAL_CANVAS_NOT_FOUND",
        reason: "#hearthCanvasMount_EXISTS_BUT_CONTAINS_NO_MATCHING_CANVAS",
        owner: "CANVAS_DOM_BINDING",
        file: CANVAS_FILE,
        action: "BIND_OR_CREATE_THE_CANONICAL_CANVAS_INSIDE_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_CANVAS_FAILURE"
      };
    }

    if (
      snapshot.pixelBearingCanvasFound &&
      !snapshot.pixelBearingCanvasIsCanonical &&
      safeNumber(snapshot.nonCanonicalPixelBearingCanvasCount, 0) > 0 &&
      snapshot.canvasPixelVisible !== true
    ) {
      return {
        status: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "PIXEL_BEARING_CANVAS_IS_CANONICAL",
        failureClass: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        reason: "VISIBLE_PIXELS_FOUND_ON_NON_CANONICAL_CANVAS_BUT_NOT_ON_CANONICAL_HEARTH_CANVAS_MOUNT_CANVAS",
        owner: "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "ALIGN_PIXEL_BEARING_CANVAS_WITH_CANONICAL_HEARTH_CANVAS_MOUNT_CANVAS",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE"
      };
    }

    if (!snapshot.canvasRectNonzero) {
      return {
        status: "CANONICAL_CANVAS_ZERO_RECT",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_RECT_NONZERO",
        failureClass: "CANONICAL_CANVAS_ZERO_RECT",
        reason: snapshot.canvasPixelVisible
          ? "CANONICAL_CANVAS_HAS_PIXEL_DATA_BUT_BOUNDING_RECT_IS_ZERO"
          : "CANONICAL_CANVAS_EXISTS_BUT_BOUNDING_RECT_IS_ZERO",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT_INSIDE_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_RECT_FAILURE"
      };
    }

    if (!snapshot.canvasComputedVisible) {
      return {
        status: "CANONICAL_CANVAS_HIDDEN",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_COMPUTED_VISIBLE",
        failureClass: "CANONICAL_CANVAS_COMPUTED_STYLE_HIDDEN",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_COMPUTED_STYLE_IS_NOT_VISIBLE",
        owner: "CSS_VISIBILITY_OR_ROUTE_SHELL",
        file: "/showroom/globe/hearth/index.html",
        action: "AUDIT_DISPLAY_VISIBILITY_OPACITY_AND_ROUTE_STAGE_VISIBILITY",
        certainty: "DEFINITIVE_CANONICAL_VISIBILITY_FAILURE"
      };
    }

    if (!snapshot.canvasViewportIntersecting) {
      return {
        status: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_VIEWPORT_INTERSECTING",
        failureClass: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        owner: "CSS_LAYOUT_OR_SCROLL_POSITION",
        file: "/showroom/globe/hearth/index.html",
        action: "AUDIT_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION",
        certainty: "DEFINITIVE_CANONICAL_VIEWPORT_FAILURE"
      };
    }

    if (!snapshot.canvasContext2dReady) {
      return {
        status: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_CONTEXT_2D_READY",
        failureClass: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        reason: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        owner: "CANVAS_DOM_SURFACE",
        file: CANVAS_FILE,
        action: "VERIFY_CANONICAL_DOM_SURFACE_IS_STANDARD_2D_CANVAS",
        certainty: "DEFINITIVE_CANONICAL_CONTEXT_FAILURE"
      };
    }

    if (
      snapshot.pixelBearingCanvasFound &&
      !snapshot.pixelBearingCanvasIsCanonical &&
      safeNumber(snapshot.nonCanonicalPixelBearingCanvasCount, 0) > 0
    ) {
      return {
        status: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "PIXEL_BEARING_CANVAS_IS_CANONICAL",
        failureClass: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        reason: "VISIBLE_PIXELS_ARE_PRESENT_ON_A_NON_CANONICAL_CANVAS",
        owner: "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "ENSURE_THE_RENDERED_PIXEL_BEARING_CANVAS_IS_THE_CANONICAL_CANVAS_INSIDE_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE"
      };
    }

    if (snapshot.canonicalCanvasSurfaceAdmissible && !snapshot.canvasPixelVisible) {
      return {
        status: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_PIXEL_VISIBLE",
        failureClass: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        reason: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_SAMPLE_NOT_VISIBLE",
        owner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "AUDIT_CANONICAL_CANVAS_DRAW_PATH_AFTER_DOM_SURFACE_BINDING_IS_CONFIRMED",
        certainty: "DEFINITIVE_CANONICAL_PIXEL_FAILURE"
      };
    }

    if (
      snapshot.canonicalCanvasSurfaceAdmissible &&
      snapshot.canvasPixelVisible &&
      snapshot.pixelBearingCanvasIsCanonical
    ) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM",
        clean: true,
        coordinate: "NONE",
        failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        reason: "CANONICAL_CANVAS_IS_MOUNTED_NONZERO_VISIBLE_VIEWPORT_INTERSECTING_CONTEXT_READY_AND_PIXEL_BEARING",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_CANONICAL_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_LAWFUL_CHECK",
        certainty: "DEFINITIVE_CANONICAL_SURFACE_PASS_NO_FINAL_CLAIM"
      };
    }

    return {
      status: "CANONICAL_CANVAS_SURFACE_TRUTH_PARTIAL",
      laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      clean: false,
      coordinate: "CANONICAL_CANVAS_SURFACE_ADMISSIBLE",
      failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PARTIAL",
      reason: "CANONICAL_CANVAS_DID_NOT_MATCH_A_MORE_SPECIFIC_CANONICAL_SURFACE_FAILURE",
      owner: "CANVAS_DOM_SURFACE",
      file: CANVAS_FILE,
      action: "REVIEW_CANONICAL_CANVAS_SUMMARY_FIELDS",
      certainty: "PARTIAL_CANONICAL_SURFACE_DIAGNOSTIC"
    };
  }

  function selectFinalVerdict(canonical, temporal) {
    if (
      temporal &&
      temporal.failureClass &&
      temporal.failureClass !== "TEMPORAL_SURFACE_NO_TRANSITION_FAILURE_OBSERVED" &&
      temporal.failureClass !== "TEMPORAL_CANONICAL_SURFACE_STABLE_PASSED" &&
      temporal.failureClass !== "TEMPORAL_SAMPLING_NOT_RUN"
    ) {
      return {
        status: temporal.status,
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: temporal.coordinate,
        failureClass: temporal.failureClass,
        reason: temporal.reason,
        owner: temporal.owner,
        file: temporal.file,
        action: temporal.action,
        certainty: temporal.certainty,
        finalArbitrationSourceLane: "TEMPORAL_VISIBLE_SURFACE_TRANSITION_LANE"
      };
    }

    if (temporal && temporal.stableCanonicalSurfacePassed && canonical.clean === true) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED_TEMPORALLY_STABLE",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM",
        clean: true,
        coordinate: "NONE",
        failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED_TEMPORALLY_STABLE",
        reason: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED_AND_REMAINED_STABLE_THROUGH_TEMPORAL_SAMPLE_WINDOW",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_TEMPORALLY_STABLE_CANONICAL_SURFACE_TRUTH_TO_NORTH",
        certainty: "DEFINITIVE_TEMPORAL_CANONICAL_SURFACE_PASS_NO_FINAL_CLAIM",
        finalArbitrationSourceLane: "TEMPORAL_VISIBLE_SURFACE_TRANSITION_LANE"
      };
    }

    return {
      ...canonical,
      finalArbitrationSourceLane: "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE"
    };
  }

  async function inspectSurface(payload = {}) {
    const diagnosticTimestamp = nowIso();
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const canvasScript = scriptInfo(targetDocument, CANVAS_FILE);
    const indexScript = scriptInfo(targetDocument, INDEX_FILE);
    const routeScript = scriptInfo(targetDocument, ROUTE_CONDUCTOR_FILE);
    const canvasAuthority = inspectCanvasAuthority(targetWindow);

    const snapshots = await collectTemporalSnapshots(context);
    const temporal = analyzeTemporalSnapshots(snapshots);
    const finalSnapshot = snapshots[snapshots.length - 1] || summarizeSnapshot(context, "FINAL_SYNC_FALLBACK");
    const firstSnapshot = snapshots[0] || finalSnapshot;

    const canonical = resolveCanonicalVerdict({
      context,
      snapshot: finalSnapshot
    });

    const result = selectFinalVerdict(canonical, temporal);

    const notes = [
      "V1_6_TEMPORAL_VISIBLE_SURFACE_TRANSITION_ACTIVE",
      "V1_5_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_PRESERVED",
      "FOCUS_LIMITED_TO_CANONICAL_CANVAS_PIXEL_BEARING_IDENTITY_AND_TEMPORAL_STABILITY",
      "FLASH_TO_FALLBACK_BEHAVIOR_MEASURED_WITH_READ_ONLY_SNAPSHOTS",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_REPAIR",
      "NO_ROUTE_REPAIR",
      "NO_RUNTIME_RESTART",
      `TEMPORAL_SAMPLE_COUNT:${temporal.snapshotCount}`,
      `TEMPORAL_STATUS:${temporal.status}`,
      `TEMPORAL_FAILURE_CLASS:${temporal.failureClass}`,
      `CANONICAL_MOUNT_FOUND:${finalSnapshot.canonicalMountFound === true}`,
      `CANONICAL_CANVAS_FOUND:${finalSnapshot.canonicalCanvasFound === true}`,
      `CANONICAL_CANVAS_RECT_NONZERO:${finalSnapshot.canvasRectNonzero === true}`,
      `CANONICAL_CANVAS_PIXEL_VISIBLE:${finalSnapshot.canvasPixelVisible === true}`,
      `PIXEL_BEARING_CANVAS_FOUND:${finalSnapshot.pixelBearingCanvasFound === true}`,
      `PIXEL_BEARING_CANVAS_IS_CANONICAL:${finalSnapshot.pixelBearingCanvasIsCanonical === true}`,
      `NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT:${safeNumber(finalSnapshot.nonCanonicalPixelBearingCanvasCount, 0)}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${result.failureClass}`
    ];

    const report = {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_PACKET_v1_6",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      ROUTE_CONDUCTOR_FILE,
      INDEX_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      DIAGNOSTIC_TIMESTAMP: diagnosticTimestamp,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: boolText(context.targetAvailable, "false"),
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_AND_TEMPORAL_TRANSITION_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "DOES_THE_PIXEL_BEARING_CANONICAL_CANVAS_REMAIN_STABLE_AFTER_INITIAL_FLASH",

      TARGET_CONTEXT_STATUS: context.targetAvailable
        ? "TARGET_CONTEXT_AVAILABLE"
        : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: context.targetSource,
      TARGET_ACCESS_ERROR: context.targetAccessError,

      INDEX_SCRIPT_PRESENT: indexScript.present,
      INDEX_SCRIPT_SRC: indexScript.src,
      ROUTE_CONDUCTOR_SCRIPT_PRESENT: routeScript.present,
      ROUTE_CONDUCTOR_SCRIPT_SRC: routeScript.src,

      CANVAS_SCRIPT_PRESENT: canvasScript.present,
      CANVAS_SCRIPT_COUNT: canvasScript.count,
      CANVAS_SCRIPT_SRC: canvasScript.src,
      CANVAS_SCRIPT_CACHE_KEY: canvasScript.cacheKey,
      CANVAS_SCRIPT_TAG_ORDER: canvasScript.lastOrder || "NONE",
      CANVAS_SCRIPT_LOAD_INFERRED: Boolean(canvasScript.present),
      CANVAS_SCRIPT_EXECUTION_INFERRED: Boolean(
        canvasScript.present &&
          (
            canvasAuthority.observed ||
            finalSnapshot.canonicalCanvasFound ||
            safeNumber(finalSnapshot.totalCanvasCount, 0) > 0 ||
            dataValue(targetDocument, "hearthCanvasLoaded") === "true"
          )
      ),

      CANVAS_AUTHORITY_OBSERVED: canvasAuthority.observed,
      CANVAS_AUTHORITY_SCOPE: canvasAuthority.scope,
      CANVAS_AUTHORITY_SOURCE_PATH: canvasAuthority.path,
      CANVAS_AUTHORITY_CONTRACT: canvasAuthority.contract,
      CANVAS_AUTHORITY_RECEIPT: canvasAuthority.receipt,
      CANVAS_AUTHORITY_METHOD_COUNT: canvasAuthority.methodCount,
      CANVAS_AUTHORITY_METHODS: canvasAuthority.methods.join(",") || "NONE",
      CANVAS_AUTHORITY_CANDIDATE_COUNT: canvasAuthority.candidates.length,
      CANVAS_AUTHORITY_CANDIDATES: canvasAuthority.candidates,

      TEMPORAL_VISIBLE_SURFACE_TRANSITION_ACTIVE: true,
      TEMPORAL_SAMPLE_PLAN: TEMPORAL_SAMPLE_PLAN,
      TEMPORAL_SAMPLE_COUNT: temporal.snapshotCount,
      TEMPORAL_SURFACE_STATUS: temporal.status,
      TEMPORAL_SURFACE_FAILURE_CLASS: temporal.failureClass,
      TEMPORAL_SURFACE_FAILURE_REASON: temporal.reason,
      TEMPORAL_SURFACE_FIRST_FAILED_COORDINATE: temporal.coordinate,
      TEMPORAL_SURFACE_RECOMMENDED_OWNER: temporal.owner,
      TEMPORAL_SURFACE_RECOMMENDED_FILE: temporal.file,
      TEMPORAL_SURFACE_RECOMMENDED_ACTION: temporal.action,
      TEMPORAL_SURFACE_CERTAINTY: temporal.certainty,
      TEMPORAL_FIRST_SAMPLE_ID: temporal.firstSampleId,
      TEMPORAL_LAST_SAMPLE_ID: temporal.lastSampleId,
      TEMPORAL_FIRST_PIXEL_VISIBLE_SAMPLE_ID: temporal.firstPixelVisibleSampleId,
      TEMPORAL_LAST_PIXEL_VISIBLE_SAMPLE_ID: temporal.lastPixelVisibleSampleId,
      TEMPORAL_FIRST_RECT_NONZERO_SAMPLE_ID: temporal.firstRectNonzeroSampleId,
      TEMPORAL_LAST_RECT_NONZERO_SAMPLE_ID: temporal.lastRectNonzeroSampleId,
      TEMPORAL_CANONICAL_CANVAS_FINGERPRINT_CHANGED: temporal.canonicalCanvasFingerprintChanged,
      TEMPORAL_PIXEL_BEARING_CANVAS_FINGERPRINT_CHANGED: temporal.pixelBearingCanvasFingerprintChanged,
      TEMPORAL_CANVAS_COUNT_CHANGED: temporal.canvasCountChanged,
      TEMPORAL_MOUNT_CHILD_COUNT_CHANGED: temporal.mountChildCountChanged,
      TEMPORAL_RECT_COLLAPSED_AFTER_NONZERO: temporal.rectCollapsedAfterNonzero,
      TEMPORAL_PIXEL_CLEARED_AFTER_VISIBLE: temporal.pixelClearedAfterVisible,
      TEMPORAL_PIXEL_APPEARED_THEN_NON_CANONICAL: temporal.pixelAppearedThenNonCanonical,
      TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED: temporal.fallbackSurfaceSignalDetected,
      TEMPORAL_STABLE_CANONICAL_SURFACE_PASSED: temporal.stableCanonicalSurfacePassed,
      TEMPORAL_UNIQUE_CANONICAL_CANVAS_FINGERPRINTS: temporal.uniqueCanonicalCanvasFingerprints,
      TEMPORAL_UNIQUE_PIXEL_BEARING_CANVAS_FINGERPRINTS: temporal.uniquePixelBearingCanvasFingerprints,

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_CANVAS_SELECTORS: CANONICAL_CANVAS_SELECTORS.slice(),
      CANONICAL_MOUNT_FOUND: finalSnapshot.canonicalMountFound === true,
      CANONICAL_MOUNT_DESCRIPTOR:
        finalSnapshot.mountSummary && finalSnapshot.mountSummary.descriptor
          ? finalSnapshot.mountSummary.descriptor
          : "NONE",
      CANONICAL_MOUNT_RECT_NONZERO:
        finalSnapshot.mountSummary && finalSnapshot.mountSummary.rectNonzero === true,
      CANONICAL_MOUNT_RECT_WIDTH:
        finalSnapshot.mountSummary ? finalSnapshot.mountSummary.rectWidth : 0,
      CANONICAL_MOUNT_RECT_HEIGHT:
        finalSnapshot.mountSummary ? finalSnapshot.mountSummary.rectHeight : 0,
      CANONICAL_MOUNT_COMPUTED_VISIBLE:
        finalSnapshot.mountSummary && finalSnapshot.mountSummary.computedVisible === true,
      CANONICAL_MOUNT_CHILD_ELEMENT_COUNT:
        finalSnapshot.mountSummary ? finalSnapshot.mountSummary.childElementCount : 0,
      CANONICAL_MOUNT_CHILD_CANVAS_COUNT:
        finalSnapshot.mountSummary ? finalSnapshot.mountSummary.childCanvasCount : 0,
      CANONICAL_MOUNT_TEXT_SIGNATURE:
        finalSnapshot.mountSummary ? finalSnapshot.mountSummary.textSignature : "NONE",

      CANONICAL_CANVAS_FOUND: finalSnapshot.canonicalCanvasFound === true,
      CANONICAL_CANVAS_SELECTOR: finalSnapshot.canonicalCanvasSelector || "NONE",
      CANONICAL_CANVAS_DESCRIPTOR: finalSnapshot.canonicalCanvasDescriptor || "NONE",
      CANONICAL_CANVAS_FINGERPRINT: finalSnapshot.canonicalCanvasFingerprint || "NONE",
      CANONICAL_CANVAS_INDEX: finalSnapshot.canonicalCanvasIndex || 0,
      CANONICAL_CANVAS_IN_CANONICAL_MOUNT: finalSnapshot.canonicalCanvasInMount === true,

      CANVAS_ELEMENT_FOUND: finalSnapshot.canonicalCanvasFound === true,
      CANVAS_DOM_SURFACE_FOUND: finalSnapshot.canonicalCanvasFound === true,
      CANVAS_SELECTOR: finalSnapshot.canonicalCanvasSelector || "NONE",
      CANVAS_MOUNT_FOUND: finalSnapshot.canonicalMountFound === true,
      CANVAS_MOUNT_SELECTOR: CANONICAL_MOUNT_SELECTOR,
      CANVAS_IN_MOUNT: finalSnapshot.canonicalCanvasInMount === true,

      CANVAS_RECT_WIDTH: finalSnapshot.canvasRectWidth || 0,
      CANVAS_RECT_HEIGHT: finalSnapshot.canvasRectHeight || 0,
      CANVAS_RECT_NONZERO: finalSnapshot.canvasRectNonzero === true,

      CANVAS_COMPUTED_VISIBLE: finalSnapshot.canvasComputedVisible === true,
      CANVAS_VIEWPORT_INTERSECTING: finalSnapshot.canvasViewportIntersecting === true,
      CANVAS_CONTEXT_2D_READY: finalSnapshot.canvasContext2dReady === true,

      CANVAS_PIXEL_SAMPLE_STATUS: finalSnapshot.canvasPixelSampleStatus || "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_VISIBLE: finalSnapshot.canvasPixelVisible === true,
      CANVAS_VISIBLE_PIXEL_COUNT: finalSnapshot.canvasVisiblePixelCount || 0,
      CANVAS_ALPHA_PIXEL_COUNT: finalSnapshot.canvasAlphaPixelCount || 0,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: finalSnapshot.canvasUniqueColorCount || 0,
      CANVAS_PIXEL_CENTER_COLOR: finalSnapshot.canvasCenterColor || "NONE",

      CANONICAL_CANVAS_PIXEL_VISIBLE: finalSnapshot.canvasPixelVisible === true,
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: finalSnapshot.canonicalCanvasSurfaceAdmissible === true,

      TOTAL_CANVAS_COUNT: finalSnapshot.totalCanvasCount || 0,
      PIXEL_BEARING_CANVAS_FOUND: finalSnapshot.pixelBearingCanvasFound === true,
      PIXEL_BEARING_CANVAS_COUNT: finalSnapshot.pixelBearingCanvasCount || 0,
      PIXEL_BEARING_CANVAS_IS_CANONICAL: finalSnapshot.pixelBearingCanvasIsCanonical === true,
      PIXEL_BEARING_CANVAS_DESCRIPTOR: finalSnapshot.pixelBearingCanvasDescriptor || "NONE",
      PIXEL_BEARING_CANVAS_FINGERPRINT: finalSnapshot.pixelBearingCanvasFingerprint || "NONE",
      PIXEL_BEARING_CANVAS_RECT_NONZERO: finalSnapshot.pixelBearingCanvasRectNonzero === true,
      PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT: finalSnapshot.pixelBearingCanvasInCanonicalMount === true,
      NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT: finalSnapshot.nonCanonicalPixelBearingCanvasCount || 0,

      FIRST_SAMPLE_CANONICAL_CANVAS_SUMMARY: clonePlain(firstSnapshot.canonicalCanvasSummary || {}),
      FINAL_SAMPLE_CANONICAL_CANVAS_SUMMARY: clonePlain(finalSnapshot.canonicalCanvasSummary || {}),
      FIRST_SAMPLE_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(firstSnapshot.firstPixelBearingCanvasSummary || {}),
      FINAL_SAMPLE_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(finalSnapshot.firstPixelBearingCanvasSummary || {}),
      TEMPORAL_SNAPSHOTS: clonePlain(snapshots),

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: canonical.status,
      CANONICAL_CANVAS_SURFACE_TRUTH_STATUS: canonical.status,
      CANONICAL_CANVAS_SURFACE_TRUTH_FAILURE_CLASS: canonical.failureClass,
      CANONICAL_CANVAS_SURFACE_TRUTH_FAILURE_REASON: canonical.reason,

      CANVAS_SURFACE_TRUTH_LANE_STATUS: result.laneStatus,
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: result.clean,

      CANVAS_TRUTH_STATUS: result.status,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: result.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: result.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: result.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: result.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: result.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: result.action,

      FINAL_ARBITRATION_SOURCE_LANE: result.finalArbitrationSourceLane,
      DIAGNOSTIC_CERTAINTY: result.certainty,
      OBSERVABLE_CAUSE:
        `CANONICAL_TEMPORAL:${result.coordinate}:${result.failureClass}:${result.reason}`,
      RECOMMENDED_NEXT_FILE: result.file,
      RECOMMENDED_NEXT_ACTION: result.action,

      CONTROL_DUTY_LANE_STATUS: "NOT_EVALUATED_IN_V1_6_CANONICAL_TEMPORAL_SURFACE_FOCUS",
      DELEGATORY_PERMISSION_LANE_STATUS: "NOT_EVALUATED_IN_V1_6_CANONICAL_TEMPORAL_SURFACE_FOCUS",
      TRUTH_HUB_STATUS: "SIMPLIFIED_CANONICAL_TEMPORAL_SURFACE_TRUTH_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "2",
      TRUTH_HUB_RECEIPT_ROUTES:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE | TEMPORAL_VISIBLE_SURFACE_TRANSITION_LANE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      CANVAS_SURFACE_TRUTH_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    lastReport = clonePlain(report);
    lastReceipt = buildReceipt(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);

    publish();

    return clonePlain(report);
  }

  function makeAnchorReport() {
    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_ANCHOR_PACKET_v1_6",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      ROUTE_CONDUCTOR_FILE,
      INDEX_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "ANCHOR_READY",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "UNKNOWN",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_AND_TEMPORAL_TRANSITION_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "DOES_THE_PIXEL_BEARING_CANONICAL_CANVAS_REMAIN_STABLE_AFTER_INITIAL_FLASH",

      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

      TEMPORAL_VISIBLE_SURFACE_TRANSITION_ACTIVE: true,
      TEMPORAL_SAMPLE_PLAN,
      TEMPORAL_SAMPLE_COUNT: 0,
      TEMPORAL_SURFACE_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      TEMPORAL_SURFACE_FAILURE_CLASS: "NOT_RUN",
      TEMPORAL_SURFACE_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",

      CANVAS_SCRIPT_PRESENT: "UNKNOWN",
      CANVAS_SCRIPT_EXECUTION_INFERRED: "UNKNOWN",
      CANVAS_AUTHORITY_OBSERVED: "UNKNOWN",

      CANONICAL_MOUNT_FOUND: "UNKNOWN",
      CANONICAL_CANVAS_FOUND: "UNKNOWN",
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: "UNKNOWN",
      CANONICAL_CANVAS_PIXEL_VISIBLE: "UNKNOWN",

      CANVAS_ELEMENT_FOUND: "UNKNOWN",
      CANVAS_DOM_SURFACE_FOUND: "UNKNOWN",
      CANVAS_MOUNT_FOUND: "UNKNOWN",
      CANVAS_IN_MOUNT: "UNKNOWN",
      CANVAS_RECT_NONZERO: "UNKNOWN",
      CANVAS_COMPUTED_VISIBLE: "UNKNOWN",
      CANVAS_VIEWPORT_INTERSECTING: "UNKNOWN",
      CANVAS_CONTEXT_2D_READY: "UNKNOWN",
      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE_ANCHOR_ONLY",
      CANVAS_PIXEL_VISIBLE: "UNKNOWN",

      PIXEL_BEARING_CANVAS_FOUND: "UNKNOWN",
      PIXEL_BEARING_CANVAS_IS_CANONICAL: "UNKNOWN",
      NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT: "UNKNOWN",

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS:
        "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_SURFACE_TRUTH_LANE_STATUS:
        "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: "UNKNOWN",

      CANVAS_TRUTH_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_CLASS: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "NONE",
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE",
      CANVAS_TRUTH_RECOMMENDED_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      FINAL_ARBITRATION_SOURCE_LANE:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_AND_TEMPORAL_VISIBLE_SURFACE_TRANSITION_LANE",
      DIAGNOSTIC_CERTAINTY: "ANCHOR_ONLY",
      OBSERVABLE_CAUSE: "ANCHOR_PUBLISHED_TARGET_NOT_YET_PROBED",
      RECOMMENDED_NEXT_FILE: "NONE",
      RECOMMENDED_NEXT_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      CONTROL_DUTY_LANE_STATUS: "NOT_EVALUATED_IN_V1_6_CANONICAL_TEMPORAL_SURFACE_FOCUS",
      DELEGATORY_PERMISSION_LANE_STATUS: "NOT_EVALUATED_IN_V1_6_CANONICAL_TEMPORAL_SURFACE_FOCUS",
      TRUTH_HUB_STATUS: "SIMPLIFIED_CANONICAL_TEMPORAL_SURFACE_TRUTH_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "2",
      TRUTH_HUB_RECEIPT_ROUTES:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE | TEMPORAL_VISIBLE_SURFACE_TRANSITION_LANE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V1_6_ANCHOR_READY | TEMPORAL_VISIBLE_SURFACE_TRANSITION_ACTIVE | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_READY | TEMPORAL_TARGET_PROBE_NOT_RUN_DURING_PUBLISH",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildReceipt(report = lastReport || makeAnchorReport()) {
    const r = report || makeAnchorReport();

    return {
      packetType:
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TEMPORAL_VISIBLE_SURFACE_TRANSITION_RECEIPT_PACKET_v1_6",
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
      canvasFile: CANVAS_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      canonicalVisibleSurfaceDisambiguationActive: true,
      temporalVisibleSurfaceTransitionActive: true,
      focusedOnCanonicalCanvasIdentity: true,
      focusedOnFlashToFallbackTransition: true,
      controlsDutyLaneEvaluated: false,
      delegatoryMatrixEvaluated: false,
      southFingerBundleEvaluated: false,
      labCardinalReceiptsEvaluated: false,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      temporalSampleCount: getRaw(r, "TEMPORAL_SAMPLE_COUNT", "UNKNOWN"),
      temporalSurfaceStatus: getRaw(r, "TEMPORAL_SURFACE_STATUS", "UNKNOWN"),
      temporalSurfaceFailureClass: getRaw(r, "TEMPORAL_SURFACE_FAILURE_CLASS", "UNKNOWN"),
      temporalSurfaceFailureReason: getRaw(r, "TEMPORAL_SURFACE_FAILURE_REASON", "UNKNOWN"),
      temporalRectCollapsedAfterNonzero: getRaw(r, "TEMPORAL_RECT_COLLAPSED_AFTER_NONZERO", "UNKNOWN"),
      temporalPixelClearedAfterVisible: getRaw(r, "TEMPORAL_PIXEL_CLEARED_AFTER_VISIBLE", "UNKNOWN"),
      temporalCanvasCountChanged: getRaw(r, "TEMPORAL_CANVAS_COUNT_CHANGED", "UNKNOWN"),
      temporalMountChildCountChanged: getRaw(r, "TEMPORAL_MOUNT_CHILD_COUNT_CHANGED", "UNKNOWN"),
      temporalFallbackSurfaceSignalDetected: getRaw(r, "TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),
      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),

      canonicalMountFound: getRaw(r, "CANONICAL_MOUNT_FOUND", "UNKNOWN"),
      canonicalCanvasFound: getRaw(r, "CANONICAL_CANVAS_FOUND", "UNKNOWN"),
      canonicalCanvasSelector: getRaw(r, "CANONICAL_CANVAS_SELECTOR", "UNKNOWN"),
      canonicalCanvasDescriptor: getRaw(r, "CANONICAL_CANVAS_DESCRIPTOR", "UNKNOWN"),
      canonicalCanvasFingerprint: getRaw(r, "CANONICAL_CANVAS_FINGERPRINT", "UNKNOWN"),
      canonicalCanvasSurfaceAdmissible: getRaw(r, "CANONICAL_CANVAS_SURFACE_ADMISSIBLE", "UNKNOWN"),

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", "UNKNOWN"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", "UNKNOWN"),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", "UNKNOWN"),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN"),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN"),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", "UNKNOWN"),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", "UNKNOWN"),

      pixelBearingCanvasFound: getRaw(r, "PIXEL_BEARING_CANVAS_FOUND", "UNKNOWN"),
      pixelBearingCanvasCount: getRaw(r, "PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),
      pixelBearingCanvasIsCanonical: getRaw(r, "PIXEL_BEARING_CANVAS_IS_CANONICAL", "UNKNOWN"),
      pixelBearingCanvasDescriptor: getRaw(r, "PIXEL_BEARING_CANVAS_DESCRIPTOR", "NONE"),
      nonCanonicalPixelBearingCanvasCount: getRaw(r, "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),

      canvasIdentityDisambiguationStatus: getRaw(r, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "UNKNOWN"),
      canvasSurfaceTruthLaneStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_LANE_STATUS", "UNKNOWN"),
      canvasTruthStatus: getRaw(r, "CANVAS_TRUTH_STATUS", "UNKNOWN"),
      canvasTruthFirstFailedCoordinate: getRaw(r, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN"),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      canvasTruthFailureReason: getRaw(r, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN"),
      canvasTruthRecommendedOwner: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN"),
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN"),
      finalArbitrationSourceLane: getRaw(r, "FINAL_ARBITRATION_SOURCE_LANE", "UNKNOWN"),
      diagnosticCertainty: getRaw(r, "DIAGNOSTIC_CERTAINTY", "UNKNOWN"),
      observableCause: getRaw(r, "OBSERVABLE_CAUSE", "UNKNOWN"),

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
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
      "CANVAS_FILE",
      "ROUTE_CONDUCTOR_FILE",
      "INDEX_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_CANVAS_RENEWAL_CANDIDATE",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "CANVAS_SURFACE_TRUTH_SCOPE",
      "CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS",

      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",
      "TARGET_ACCESS_ERROR",

      "INDEX_SCRIPT_PRESENT",
      "INDEX_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_PRESENT",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",

      "CANVAS_SCRIPT_PRESENT",
      "CANVAS_SCRIPT_COUNT",
      "CANVAS_SCRIPT_SRC",
      "CANVAS_SCRIPT_CACHE_KEY",
      "CANVAS_SCRIPT_TAG_ORDER",
      "CANVAS_SCRIPT_LOAD_INFERRED",
      "CANVAS_SCRIPT_EXECUTION_INFERRED",

      "CANVAS_AUTHORITY_OBSERVED",
      "CANVAS_AUTHORITY_SCOPE",
      "CANVAS_AUTHORITY_SOURCE_PATH",
      "CANVAS_AUTHORITY_CONTRACT",
      "CANVAS_AUTHORITY_RECEIPT",

      "TEMPORAL_VISIBLE_SURFACE_TRANSITION_ACTIVE",
      "TEMPORAL_SAMPLE_COUNT",
      "TEMPORAL_SURFACE_STATUS",
      "TEMPORAL_SURFACE_FAILURE_CLASS",
      "TEMPORAL_SURFACE_FAILURE_REASON",
      "TEMPORAL_SURFACE_FIRST_FAILED_COORDINATE",
      "TEMPORAL_SURFACE_RECOMMENDED_OWNER",
      "TEMPORAL_SURFACE_RECOMMENDED_FILE",
      "TEMPORAL_SURFACE_RECOMMENDED_ACTION",
      "TEMPORAL_SURFACE_CERTAINTY",
      "TEMPORAL_FIRST_SAMPLE_ID",
      "TEMPORAL_LAST_SAMPLE_ID",
      "TEMPORAL_FIRST_PIXEL_VISIBLE_SAMPLE_ID",
      "TEMPORAL_LAST_PIXEL_VISIBLE_SAMPLE_ID",
      "TEMPORAL_FIRST_RECT_NONZERO_SAMPLE_ID",
      "TEMPORAL_LAST_RECT_NONZERO_SAMPLE_ID",
      "TEMPORAL_CANONICAL_CANVAS_FINGERPRINT_CHANGED",
      "TEMPORAL_PIXEL_BEARING_CANVAS_FINGERPRINT_CHANGED",
      "TEMPORAL_CANVAS_COUNT_CHANGED",
      "TEMPORAL_MOUNT_CHILD_COUNT_CHANGED",
      "TEMPORAL_RECT_COLLAPSED_AFTER_NONZERO",
      "TEMPORAL_PIXEL_CLEARED_AFTER_VISIBLE",
      "TEMPORAL_PIXEL_APPEARED_THEN_NON_CANONICAL",
      "TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED",
      "TEMPORAL_STABLE_CANONICAL_SURFACE_PASSED",

      "CANONICAL_MOUNT_SELECTOR",
      "CANONICAL_MOUNT_FOUND",
      "CANONICAL_MOUNT_DESCRIPTOR",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_MOUNT_RECT_WIDTH",
      "CANONICAL_MOUNT_RECT_HEIGHT",
      "CANONICAL_MOUNT_COMPUTED_VISIBLE",
      "CANONICAL_MOUNT_CHILD_ELEMENT_COUNT",
      "CANONICAL_MOUNT_CHILD_CANVAS_COUNT",
      "CANONICAL_MOUNT_TEXT_SIGNATURE",

      "CANONICAL_CANVAS_FOUND",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CANVAS_DESCRIPTOR",
      "CANONICAL_CANVAS_FINGERPRINT",
      "CANONICAL_CANVAS_INDEX",
      "CANONICAL_CANVAS_IN_CANONICAL_MOUNT",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_DOM_SURFACE_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_IN_MOUNT",
      "CANVAS_RECT_WIDTH",
      "CANVAS_RECT_HEIGHT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_CENTER_COLOR",

      "CANONICAL_CANVAS_PIXEL_VISIBLE",
      "CANONICAL_CANVAS_SURFACE_ADMISSIBLE",

      "TOTAL_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_FOUND",
      "PIXEL_BEARING_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_IS_CANONICAL",
      "PIXEL_BEARING_CANVAS_DESCRIPTOR",
      "PIXEL_BEARING_CANVAS_FINGERPRINT",
      "PIXEL_BEARING_CANVAS_RECT_NONZERO",
      "PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT",
      "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT",

      "CANVAS_IDENTITY_DISAMBIGUATION_STATUS",
      "CANONICAL_CANVAS_SURFACE_TRUTH_STATUS",
      "CANONICAL_CANVAS_SURFACE_TRUTH_FAILURE_CLASS",
      "CANONICAL_CANVAS_SURFACE_TRUTH_FAILURE_REASON",

      "CANVAS_SURFACE_TRUTH_LANE_STATUS",
      "CANVAS_SURFACE_TRUTH_LANE_CLEAN",
      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",
      "FINAL_ARBITRATION_SOURCE_LANE",
      "DIAGNOSTIC_CERTAINTY",
      "OBSERVABLE_CAUSE",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",

      "CONTROL_DUTY_LANE_STATUS",
      "DELEGATORY_PERMISSION_LANE_STATUS",
      "TRUTH_HUB_STATUS",
      "TRUTH_HUB_RECEIPT_LANE_COUNT",
      "TRUTH_HUB_RECEIPT_ROUTES",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",

      "SECONDARY_EVIDENCE_NOTES",
      "CANVAS_SURFACE_TRUTH_NOTES",

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

  function composePacketText(report = lastReport || makeAnchorReport()) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report = lastReport || makeAnchorReport()) {
    return [
      line("CONTRACT", getRaw(report, "CONTRACT", CONTRACT)),
      line("INTERNAL_RENEWAL_CONTRACT", getRaw(report, "INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT)),
      line("CANVAS_SURFACE_TRUTH_PROBE_STATUS", getRaw(report, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY")),
      line("TEMPORAL_SURFACE_STATUS", getRaw(report, "TEMPORAL_SURFACE_STATUS", "UNKNOWN")),
      line("TEMPORAL_SURFACE_FAILURE_CLASS", getRaw(report, "TEMPORAL_SURFACE_FAILURE_CLASS", "UNKNOWN")),
      line("TEMPORAL_RECT_COLLAPSED_AFTER_NONZERO", getRaw(report, "TEMPORAL_RECT_COLLAPSED_AFTER_NONZERO", "UNKNOWN")),
      line("TEMPORAL_PIXEL_CLEARED_AFTER_VISIBLE", getRaw(report, "TEMPORAL_PIXEL_CLEARED_AFTER_VISIBLE", "UNKNOWN")),
      line("TEMPORAL_CANVAS_COUNT_CHANGED", getRaw(report, "TEMPORAL_CANVAS_COUNT_CHANGED", "UNKNOWN")),
      line("TEMPORAL_MOUNT_CHILD_COUNT_CHANGED", getRaw(report, "TEMPORAL_MOUNT_CHILD_COUNT_CHANGED", "UNKNOWN")),
      line("TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED", getRaw(report, "TEMPORAL_FALLBACK_SURFACE_SIGNAL_DETECTED", "UNKNOWN")),
      line("CANVAS_IDENTITY_DISAMBIGUATION_STATUS", getRaw(report, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "UNKNOWN")),
      line("CANONICAL_MOUNT_FOUND", getRaw(report, "CANONICAL_MOUNT_FOUND", "UNKNOWN")),
      line("CANONICAL_CANVAS_FOUND", getRaw(report, "CANONICAL_CANVAS_FOUND", "UNKNOWN")),
      line("CANVAS_RECT_NONZERO", getRaw(report, "CANVAS_RECT_NONZERO", "UNKNOWN")),
      line("CANVAS_COMPUTED_VISIBLE", getRaw(report, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN")),
      line("CANVAS_VIEWPORT_INTERSECTING", getRaw(report, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN")),
      line("CANVAS_CONTEXT_2D_READY", getRaw(report, "CANVAS_CONTEXT_2D_READY", "UNKNOWN")),
      line("CANVAS_PIXEL_VISIBLE", getRaw(report, "CANVAS_PIXEL_VISIBLE", "UNKNOWN")),
      line("PIXEL_BEARING_CANVAS_FOUND", getRaw(report, "PIXEL_BEARING_CANVAS_FOUND", "UNKNOWN")),
      line("PIXEL_BEARING_CANVAS_IS_CANONICAL", getRaw(report, "PIXEL_BEARING_CANVAS_IS_CANONICAL", "UNKNOWN")),
      line("NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT", getRaw(report, "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_ACTION", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN")),
      line("DIAGNOSTIC_CERTAINTY", getRaw(report, "DIAGNOSTIC_CERTAINTY", "UNKNOWN")),
      "f13Claimed=false",
      "f21EligibleForNorth=false",
      "f21ClaimedByDiagnosticRail=false",
      "readyTextAllowed=false",
      "visualPassClaimed=false",
      "generatedImage=false",
      "graphicBox=false",
      "webGL=false"
    ].join("\n");
  }

  function getReport() {
    return clonePlain(lastReport || makeAnchorReport());
  }

  function getReceiptLight() {
    if (!lastReceipt) lastReceipt = buildReceipt(lastReport || makeAnchorReport());
    return clonePlain(lastReceipt);
  }

  function getReceipt() {
    const report = lastReport || makeAnchorReport();

    return {
      ...getReceiptLight(),
      report: clonePlain(report),
      firstSampleCanonicalCanvasSummary: clonePlain(getRaw(report, "FIRST_SAMPLE_CANONICAL_CANVAS_SUMMARY", {})),
      finalSampleCanonicalCanvasSummary: clonePlain(getRaw(report, "FINAL_SAMPLE_CANONICAL_CANVAS_SUMMARY", {})),
      firstSamplePixelBearingCanvasSummary: clonePlain(getRaw(report, "FIRST_SAMPLE_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      finalSamplePixelBearingCanvasSummary: clonePlain(getRaw(report, "FINAL_SAMPLE_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      temporalSnapshots: clonePlain(getRaw(report, "TEMPORAL_SNAPSHOTS", [])),
      canvasAuthorityCandidates: clonePlain(getRaw(report, "CANVAS_AUTHORITY_CANDIDATES", [])),
      canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS.slice(),
      canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES.slice(),
      temporalSamplePlan: TEMPORAL_SAMPLE_PLAN.slice(),
      supportsCanonicalVisibleSurfaceDisambiguation: true,
      supportsPixelBearingCanvasIdentityCheck: true,
      supportsCanonicalZeroRectCheck: true,
      supportsCanonicalBlankPixelCheck: true,
      supportsTemporalVisibleSurfaceTransition: true,
      supportsFlashToFallbackTransitionMeasurement: true,
      supportsRectCollapseAfterFirstPaintCheck: true,
      supportsPixelClearAfterFirstPaintCheck: true,
      supportsCanvasDomReplacementCheck: true,
      supportsFallbackSignalCheck: true,
      supportsSimplifiedF21Focus: true,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getPacketText() {
    if (!lastPacketText) lastPacketText = composePacketText(lastReport || makeAnchorReport());
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) lastCompactSummary = composeCompactSummary(lastReport || makeAnchorReport());
    return lastCompactSummary;
  }

  function getStatusText() {
    return getCompactSummary();
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    const aliasPaths = [
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthProbe",
      "HEARTH.diagnosticProbeCanvasTruth",
      "HEARTH.diagnosticCanvasTruthProbe",
      "HEARTH.diagnosticRailProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthReceiptHub",
      "HEARTH.diagnosticTruthHub",
      "HEARTH.diagnosticCanonicalCanvasSurfaceTruth",
      "HEARTH.diagnosticTemporalCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
      "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanonicalCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticTemporalCanvasSurfaceTruth",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_TEMPORAL_CANVAS_SURFACE_TRUTH"
    ];

    for (const path of aliasPaths) setPath(path, api);

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_TEMPORAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_TEMPORAL_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TEMPORAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY = lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_TEMPORAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY = lastCompactSummary || "";

    try {
      if (root.document && root.document.documentElement && root.document.documentElement.dataset) {
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeContract = CONTRACT;
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeRenewalContract =
          INTERNAL_RENEWAL_CONTRACT;
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeStatus =
          getRaw(lastReport || {}, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthFailureClass =
          getRaw(lastReport || {}, "CANVAS_TRUTH_FAILURE_CLASS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanonicalCanvasSurfaceTruthStatus =
          getRaw(lastReport || {}, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticTemporalCanvasSurfaceTruthStatus =
          getRaw(lastReport || {}, "TEMPORAL_SURFACE_STATUS", "ANCHOR_READY");
      }
    } catch (_error) {}

    return true;
  }

  async function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  async function runCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  async function runProbe(payload = {}) {
    return inspectSurface(payload);
  }

  async function inspect(payload = {}) {
    return inspectSurface(payload);
  }

  async function runDiagnostic(payload = {}) {
    return inspectSurface(payload);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
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
    canvasFile: CANVAS_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    canonicalVisibleSurfaceDisambiguationActive: true,
    temporalVisibleSurfaceTransitionActive: true,
    focusedOnCanonicalCanvasIdentity: true,
    focusedOnFlashToFallbackTransition: true,
    controlsDutyLaneEvaluated: false,
    delegatoryMatrixEvaluated: false,
    southFingerBundleEvaluated: false,
    labCardinalReceiptsEvaluated: false,

    runProbeCanvasSurfaceTruth,
    runCanvasSurfaceTruth,
    runProbe,
    inspect,
    runDiagnostic,

    getReport,
    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getPacketText,
    getCompactSummary,
    getStatusText,

    canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
    canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS,
    canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES,
    temporalSamplePlan: TEMPORAL_SAMPLE_PLAN,

    supportsCanonicalVisibleSurfaceDisambiguation: true,
    supportsPixelBearingCanvasIdentityCheck: true,
    supportsCanonicalZeroRectCheck: true,
    supportsCanonicalBlankPixelCheck: true,
    supportsTemporalVisibleSurfaceTransition: true,
    supportsFlashToFallbackTransitionMeasurement: true,
    supportsRectCollapseAfterFirstPaintCheck: true,
    supportsPixelClearAfterFirstPaintCheck: true,
    supportsCanvasDomReplacementCheck: true,
    supportsFallbackSignalCheck: true,
    supportsSimplifiedF21Focus: true,
    supportsCoordinateSpecificFailure: true,
    supportsCompactPacketText: true,

    ownsDiagnosticProbeOnly: true,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasRepair: false,
    ownsRouteRepair: false,
    ownsControlMutation: false,
    ownsRuntimeRestart: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get evidence() {
      return getReport();
    },

    get state() {
      return getReport();
    }
  });

  lastReport = makeAnchorReport();
  lastReceipt = buildReceipt(lastReport);
  lastPacketText = composePacketText(lastReport);
  lastCompactSummary = composeCompactSummary(lastReport);

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
