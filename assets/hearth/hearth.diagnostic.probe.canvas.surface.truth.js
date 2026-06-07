// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
// Purpose:
// - Preserve the public NORTH-facing Canvas surface truth probe contract.
// - Publish F21 diagnostic authority synchronously before target probing.
// - Narrow the diagnostic focus to the current failed point:
//   Is the pixel-bearing canvas the same canvas that is canonically mounted,
//   nonzero, visible, readable, and admissible inside #hearthCanvasMount?
// - Distinguish:
//   1. CANONICAL_CANVAS_MOUNT_NOT_FOUND
//   2. CANONICAL_CANVAS_NOT_FOUND
//   3. CANONICAL_CANVAS_ZERO_RECT
//   4. PIXEL_BEARING_CANVAS_NOT_CANONICAL
//   5. CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK
//   6. CANONICAL_CANVAS_SURFACE_TRUTH_PASSED
// - Preserve Canvas as receiver/output carrier.
// - Preserve this file as diagnostic evidence only.
// - Do not inspect Controls duty, Route delegation matrix, South/Finger bundles,
//   Lab cardinal receipts, or broad handshake ownership.
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
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_RECEIPT_v1_5";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_TNT_v1_4";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_RECEIPT_v1_4";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-canvas-surface-truth-canonical-visible-surface-disambiguation-v1-5";

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
        return bounded(JSON.stringify(value), 24000) || fallback;
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

  function readField(source, keys, fallback = "") {
    if (!source || (!isObject(source) && !isFunction(source))) return fallback;

    for (const key of keys || []) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") return value;

      const lower = key.toLowerCase();

      try {
        for (const candidate of Object.keys(source)) {
          if (candidate.toLowerCase() === lower) {
            const candidateValue = source[candidate];
            if (candidateValue !== undefined && candidateValue !== null && candidateValue !== "") {
              return candidateValue;
            }
          }
        }
      } catch (_error) {}
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
        pointerEvents: "UNKNOWN"
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
        pointerEvents: safeString(style.pointerEvents, "UNKNOWN")
      };
    } catch (_error) {
      return {
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE"
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
          ? `.${Array.from(element.classList).slice(0, 4).join(".")}`
          : "";
    } catch (_error) {}

    return `${tag}${id}${classes}${index ? `[${index}]` : ""}` || "UNKNOWN_ELEMENT";
  }

  function canvasDataset(canvas) {
    if (!canvas || !canvas.dataset) {
      return {
        contract: "UNKNOWN",
        receipt: "UNKNOWN",
        visibleCanvas: "UNKNOWN",
        expressionSurface: "UNKNOWN",
        canvasHub: "UNKNOWN"
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
      canvasHub: firstKnown(canvas.dataset.hearthCanvasHub)
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
        [0.78, 0.5]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;
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

        if (alpha > 0) alphaPixelCount += 1;
        if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) {
          visiblePixelCount += 1;
        }

        unique.add(`${red},${green},${blue},${alpha}`);
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
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function describeCanvas(targetWindow, targetDocument, canvas, index, selector, canonicalMount) {
    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const dataset = canvasDataset(canvas);

    return {
      index,
      selector: selector || "canvas",
      descriptor: elementDescriptor(canvas, index),
      id: canvas && canvas.id ? canvas.id : "NONE",
      datasetContract: dataset.contract,
      datasetReceipt: dataset.receipt,
      datasetVisibleCanvas: dataset.visibleCanvas,
      datasetExpressionSurface: dataset.expressionSurface,
      datasetCanvasHub: dataset.canvasHub,
      inCanonicalMount: Boolean(canonicalMount && canvas && containsOrEquals(canonicalMount, canvas)),
      widthAttribute: canvas ? safeNumber(canvas.width, 0) : 0,
      heightAttribute: canvas ? safeNumber(canvas.height, 0) : 0,
      internalSizeNonzero: Boolean(canvas && safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0),
      rectLeft: rect.left,
      rectTop: rect.top,
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
      viewportIntersecting: viewportIntersecting(targetWindow, rect),
      context2dReady: ctx.ready,
      context2dStatus: ctx.status,
      pixelSampleStatus: pixels.status,
      pixelVisible: pixels.visible,
      pixelSampleCount: pixels.sampleCount,
      visiblePixelCount: pixels.visiblePixelCount,
      alphaPixelCount: pixels.alphaPixelCount,
      uniqueColorCount: pixels.uniqueColorCount,
      pixelSampleReason: pixels.reason
    };
  }

  function findCanonicalCanvas(targetDocument) {
    const found = firstElement(targetDocument, CANONICAL_CANVAS_SELECTORS);
    return found;
  }

  function inspectSurface(payload = {}) {
    const diagnosticTimestamp = nowIso();
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const canvasScript = scriptInfo(targetDocument, CANVAS_FILE);
    const indexScript = scriptInfo(targetDocument, INDEX_FILE);
    const routeScript = scriptInfo(targetDocument, ROUTE_CONDUCTOR_FILE);
    const canvasAuthority = inspectCanvasAuthority(targetWindow);

    const canonicalMount = q(targetDocument, CANONICAL_MOUNT_SELECTOR);
    const canonicalFound = findCanonicalCanvas(targetDocument);
    const canonicalCanvas = canonicalFound.element;

    const allCanvases = qa(targetDocument, ALL_CANVAS_SELECTOR);
    const allCanvasSummaries = allCanvases.map((canvas, index) =>
      describeCanvas(
        targetWindow,
        targetDocument,
        canvas,
        index + 1,
        canvas === canonicalCanvas ? canonicalFound.selector : "canvas",
        canonicalMount
      )
    );

    const pixelBearingSummaries = allCanvasSummaries.filter((entry) => entry.pixelVisible === true);
    const firstPixelBearingSummary = pixelBearingSummaries[0] || null;
    const firstPixelBearingCanvas = firstPixelBearingSummary
      ? allCanvases[firstPixelBearingSummary.index - 1]
      : null;

    const canonicalSummary = canonicalCanvas
      ? describeCanvas(
          targetWindow,
          targetDocument,
          canonicalCanvas,
          allCanvases.indexOf(canonicalCanvas) + 1 || 1,
          canonicalFound.selector,
          canonicalMount
        )
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

    const canonicalSurfaceAdmissible = Boolean(
      canonicalSummary &&
      canonicalSummary.inCanonicalMount &&
      canonicalSummary.internalSizeNonzero &&
      canonicalSummary.rectNonzero &&
      canonicalSummary.computedVisible &&
      canonicalSummary.viewportIntersecting &&
      canonicalSummary.context2dReady
    );

    const canonicalSurfaceTruthPassed = Boolean(
      canonicalSurfaceAdmissible &&
      canonicalSummary.pixelVisible &&
      pixelBearingCanvasIsCanonical
    );

    const result = resolveVerdict({
      context,
      canonicalMount,
      canonicalCanvas,
      canonicalSummary,
      pixelBearingCanvasFound,
      pixelBearingCanvasIsCanonical,
      nonCanonicalPixelBearingCanvasCount,
      firstPixelBearingSummary,
      canonicalSurfaceAdmissible,
      canonicalSurfaceTruthPassed
    });

    const notes = [
      "V1_5_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_ACTIVE",
      "FOCUS_LIMITED_TO_CANONICAL_CANVAS_AND_PIXEL_BEARING_CANVAS_IDENTITY",
      "CONTROLS_DUTY_LANE_NOT_EVALUATED_IN_THIS_RENEWAL",
      "ROUTE_DELEGATORY_MATRIX_NOT_EVALUATED_IN_THIS_RENEWAL",
      "SOUTH_FINGER_LAB_RECEIPT_BUNDLES_NOT_EVALUATED_IN_THIS_RENEWAL",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_REPAIR",
      "NO_ROUTE_REPAIR",
      "NO_RUNTIME_RESTART",
      `CANONICAL_MOUNT_FOUND:${Boolean(canonicalMount)}`,
      `CANONICAL_CANVAS_FOUND:${Boolean(canonicalCanvas)}`,
      `CANONICAL_CANVAS_RECT_NONZERO:${canonicalSummary ? canonicalSummary.rectNonzero : false}`,
      `CANONICAL_CANVAS_PIXEL_VISIBLE:${canonicalSummary ? canonicalSummary.pixelVisible : false}`,
      `PIXEL_BEARING_CANVAS_FOUND:${pixelBearingCanvasFound}`,
      `PIXEL_BEARING_CANVAS_IS_CANONICAL:${pixelBearingCanvasIsCanonical}`,
      `NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT:${nonCanonicalPixelBearingCanvasCount}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${result.failureClass}`
    ];

    const report = {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_PACKET_v1_5",
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
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "IS_PIXEL_BEARING_CANVAS_THE_CANONICAL_CANVAS_INSIDE_HEARTH_CANVAS_MOUNT",

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
            Boolean(canonicalCanvas) ||
            allCanvases.length > 0 ||
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

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_CANVAS_SELECTORS: CANONICAL_CANVAS_SELECTORS.slice(),
      CANONICAL_MOUNT_FOUND: Boolean(canonicalMount),
      CANONICAL_MOUNT_DESCRIPTOR: elementDescriptor(canonicalMount),
      CANONICAL_CANVAS_FOUND: Boolean(canonicalCanvas),
      CANONICAL_CANVAS_SELECTOR: canonicalFound.selector,
      CANONICAL_CANVAS_DESCRIPTOR: canonicalSummary ? canonicalSummary.descriptor : "NONE",
      CANONICAL_CANVAS_INDEX: canonicalSummary ? canonicalSummary.index : 0,
      CANONICAL_CANVAS_IN_CANONICAL_MOUNT: canonicalSummary ? canonicalSummary.inCanonicalMount : false,

      CANVAS_ELEMENT_FOUND: Boolean(canonicalCanvas),
      CANVAS_DOM_SURFACE_FOUND: Boolean(canonicalCanvas),
      CANVAS_SELECTOR: canonicalFound.selector,
      CANVAS_MOUNT_FOUND: Boolean(canonicalMount),
      CANVAS_MOUNT_SELECTOR: CANONICAL_MOUNT_SELECTOR,
      CANVAS_IN_MOUNT: canonicalSummary ? canonicalSummary.inCanonicalMount : false,

      CANVAS_WIDTH_ATTRIBUTE: canonicalSummary ? canonicalSummary.widthAttribute : 0,
      CANVAS_HEIGHT_ATTRIBUTE: canonicalSummary ? canonicalSummary.heightAttribute : 0,
      CANVAS_INTERNAL_SIZE_NONZERO: canonicalSummary ? canonicalSummary.internalSizeNonzero : false,

      CANVAS_RECT_LEFT: canonicalSummary ? canonicalSummary.rectLeft : 0,
      CANVAS_RECT_TOP: canonicalSummary ? canonicalSummary.rectTop : 0,
      CANVAS_RECT_WIDTH: canonicalSummary ? canonicalSummary.rectWidth : 0,
      CANVAS_RECT_HEIGHT: canonicalSummary ? canonicalSummary.rectHeight : 0,
      CANVAS_RECT_NONZERO: canonicalSummary ? canonicalSummary.rectNonzero : false,

      CANVAS_COMPUTED_VISIBLE: canonicalSummary ? canonicalSummary.computedVisible : false,
      CANVAS_COMPUTED_DISPLAY: canonicalSummary ? canonicalSummary.computedDisplay : "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: canonicalSummary ? canonicalSummary.computedVisibility : "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: canonicalSummary ? canonicalSummary.computedOpacity : "UNKNOWN",
      CANVAS_COMPUTED_POSITION: canonicalSummary ? canonicalSummary.computedPosition : "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: canonicalSummary ? canonicalSummary.computedZIndex : "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: canonicalSummary ? canonicalSummary.computedPointerEvents : "UNKNOWN",

      CANVAS_VIEWPORT_INTERSECTING: canonicalSummary ? canonicalSummary.viewportIntersecting : false,
      CANVAS_CONTEXT_2D_READY: canonicalSummary ? canonicalSummary.context2dReady : false,
      CANVAS_CONTEXT_2D_STATUS: canonicalSummary ? canonicalSummary.context2dStatus : "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: canonicalSummary ? canonicalSummary.pixelSampleStatus : "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_VISIBLE: canonicalSummary ? canonicalSummary.pixelVisible : false,
      CANVAS_PIXEL_SAMPLE_COUNT: canonicalSummary ? canonicalSummary.pixelSampleCount : 0,
      CANVAS_VISIBLE_PIXEL_COUNT: canonicalSummary ? canonicalSummary.visiblePixelCount : 0,
      CANVAS_ALPHA_PIXEL_COUNT: canonicalSummary ? canonicalSummary.alphaPixelCount : 0,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: canonicalSummary ? canonicalSummary.uniqueColorCount : 0,
      CANVAS_PIXEL_SAMPLE_REASON: canonicalSummary ? canonicalSummary.pixelSampleReason : "NO_CANONICAL_CANVAS",

      CANONICAL_CANVAS_DATASET_CONTRACT: canonicalSummary ? canonicalSummary.datasetContract : "UNKNOWN",
      CANONICAL_CANVAS_DATASET_RECEIPT: canonicalSummary ? canonicalSummary.datasetReceipt : "UNKNOWN",
      CANONICAL_CANVAS_PIXEL_VISIBLE: canonicalSummary ? canonicalSummary.pixelVisible : false,
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: canonicalSurfaceAdmissible,

      TOTAL_CANVAS_COUNT: allCanvases.length,
      PIXEL_BEARING_CANVAS_FOUND: pixelBearingCanvasFound,
      PIXEL_BEARING_CANVAS_COUNT: pixelBearingSummaries.length,
      PIXEL_BEARING_CANVAS_IS_CANONICAL: pixelBearingCanvasIsCanonical,
      PIXEL_BEARING_CANVAS_SELECTOR: firstPixelBearingSummary ? firstPixelBearingSummary.selector : "NONE",
      PIXEL_BEARING_CANVAS_DESCRIPTOR: firstPixelBearingSummary ? firstPixelBearingSummary.descriptor : "NONE",
      PIXEL_BEARING_CANVAS_INDEX: firstPixelBearingSummary ? firstPixelBearingSummary.index : 0,
      PIXEL_BEARING_CANVAS_RECT_NONZERO: firstPixelBearingSummary ? firstPixelBearingSummary.rectNonzero : false,
      PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT: firstPixelBearingSummary ? firstPixelBearingSummary.inCanonicalMount : false,
      NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT: nonCanonicalPixelBearingCanvasCount,

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: result.status,
      CANVAS_SURFACE_TRUTH_LANE_STATUS: result.laneStatus,
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: result.clean,

      CANVAS_TRUTH_STATUS: result.status,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: result.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: result.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: result.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: result.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: result.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: result.action,

      FINAL_ARBITRATION_SOURCE_LANE: "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE",
      DIAGNOSTIC_CERTAINTY: result.certainty,
      OBSERVABLE_CAUSE:
        `CANONICAL:${result.coordinate}:${result.failureClass}:${result.reason}`,
      RECOMMENDED_NEXT_FILE: result.file,
      RECOMMENDED_NEXT_ACTION: result.action,

      CANONICAL_CANVAS_SUMMARY: clonePlain(canonicalSummary || {}),
      FIRST_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(firstPixelBearingSummary || {}),
      PIXEL_BEARING_CANVAS_SUMMARIES: clonePlain(pixelBearingSummaries),
      ALL_CANVAS_SUMMARIES: clonePlain(allCanvasSummaries),

      CONTROL_DUTY_LANE_STATUS: "NOT_EVALUATED_IN_V1_5_CANONICAL_SURFACE_FOCUS",
      DELEGATORY_PERMISSION_LANE_STATUS: "NOT_EVALUATED_IN_V1_5_CANONICAL_SURFACE_FOCUS",
      TRUTH_HUB_STATUS: "SIMPLIFIED_CANONICAL_SURFACE_TRUTH_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "1",
      TRUTH_HUB_RECEIPT_ROUTES:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE",

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

  function resolveVerdict(input) {
    const context = input.context;
    const canonicalMount = input.canonicalMount;
    const canonicalCanvas = input.canonicalCanvas;
    const canonicalSummary = input.canonicalSummary;
    const pixelBearingCanvasFound = input.pixelBearingCanvasFound;
    const pixelBearingCanvasIsCanonical = input.pixelBearingCanvasIsCanonical;
    const nonCanonicalPixelBearingCanvasCount = input.nonCanonicalPixelBearingCanvasCount;
    const firstPixelBearingSummary = input.firstPixelBearingSummary;
    const canonicalSurfaceAdmissible = input.canonicalSurfaceAdmissible;
    const canonicalSurfaceTruthPassed = input.canonicalSurfaceTruthPassed;

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

    if (!canonicalMount) {
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

    if (!canonicalCanvas) {
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
      pixelBearingCanvasFound &&
      !pixelBearingCanvasIsCanonical &&
      nonCanonicalPixelBearingCanvasCount > 0 &&
      (!canonicalSummary || canonicalSummary.pixelVisible !== true)
    ) {
      return {
        status: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "PIXEL_BEARING_CANVAS_IS_CANONICAL",
        failureClass: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        reason: `VISIBLE_PIXELS_FOUND_ON_${firstPixelBearingSummary ? firstPixelBearingSummary.descriptor : "NON_CANONICAL_CANVAS"}_BUT_NOT_ON_CANONICAL_HEARTH_CANVAS_MOUNT_CANVAS`,
        owner: "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "ALIGN_PIXEL_BEARING_CANVAS_WITH_CANONICAL_HEARTH_CANVAS_MOUNT_CANVAS",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE"
      };
    }

    if (!canonicalSummary.rectNonzero) {
      return {
        status: "CANONICAL_CANVAS_ZERO_RECT",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_RECT_NONZERO",
        failureClass: "CANONICAL_CANVAS_ZERO_RECT",
        reason: canonicalSummary.pixelVisible
          ? "CANONICAL_CANVAS_HAS_PIXEL_DATA_BUT_BOUNDING_RECT_IS_ZERO"
          : "CANONICAL_CANVAS_EXISTS_BUT_BOUNDING_RECT_IS_ZERO",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT_INSIDE_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_RECT_FAILURE"
      };
    }

    if (!canonicalSummary.computedVisible) {
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

    if (!canonicalSummary.viewportIntersecting) {
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

    if (!canonicalSummary.context2dReady) {
      return {
        status: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_CONTEXT_2D_READY",
        failureClass: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        reason: canonicalSummary.context2dStatus,
        owner: "CANVAS_DOM_SURFACE",
        file: CANVAS_FILE,
        action: "VERIFY_CANONICAL_DOM_SURFACE_IS_STANDARD_2D_CANVAS",
        certainty: "DEFINITIVE_CANONICAL_CONTEXT_FAILURE"
      };
    }

    if (
      pixelBearingCanvasFound &&
      !pixelBearingCanvasIsCanonical &&
      nonCanonicalPixelBearingCanvasCount > 0
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

    if (canonicalSurfaceAdmissible && !canonicalSummary.pixelVisible) {
      return {
        status: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        laneStatus: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
        clean: false,
        coordinate: "CANVAS_PIXEL_VISIBLE",
        failureClass: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        reason: canonicalSummary.pixelSampleReason,
        owner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "AUDIT_CANONICAL_CANVAS_DRAW_PATH_AFTER_DOM_SURFACE_BINDING_IS_CONFIRMED",
        certainty: "DEFINITIVE_CANONICAL_PIXEL_FAILURE"
      };
    }

    if (canonicalSurfaceTruthPassed) {
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

  function makeAnchorReport() {
    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_ANCHOR_PACKET_v1_5",
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
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_ONLY",
      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

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
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE",
      DIAGNOSTIC_CERTAINTY: "ANCHOR_ONLY",
      OBSERVABLE_CAUSE: "ANCHOR_PUBLISHED_TARGET_NOT_YET_PROBED",
      RECOMMENDED_NEXT_FILE: "NONE",
      RECOMMENDED_NEXT_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      CONTROL_DUTY_LANE_STATUS: "NOT_EVALUATED_IN_V1_5_CANONICAL_SURFACE_FOCUS",
      DELEGATORY_PERMISSION_LANE_STATUS: "NOT_EVALUATED_IN_V1_5_CANONICAL_SURFACE_FOCUS",
      TRUTH_HUB_STATUS: "SIMPLIFIED_CANONICAL_SURFACE_TRUTH_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "1",
      TRUTH_HUB_RECEIPT_ROUTES:
        "CANONICAL_CANVAS_VISIBLE_SURFACE_DISAMBIGUATION_LANE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V1_5_ANCHOR_READY | CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_ONLY | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_READY | HEAVY_TARGET_PROBE_NOT_RUN_DURING_PUBLISH",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildReceipt(report = lastReport || makeAnchorReport()) {
    const r = report || makeAnchorReport();

    return {
      packetType:
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_RECEIPT_PACKET_v1_5",
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
      focusedOnCanonicalCanvasIdentity: true,
      controlsDutyLaneEvaluated: false,
      delegatoryMatrixEvaluated: false,
      southFingerBundleEvaluated: false,
      labCardinalReceiptsEvaluated: false,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),
      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),

      canonicalMountFound: getRaw(r, "CANONICAL_MOUNT_FOUND", "UNKNOWN"),
      canonicalCanvasFound: getRaw(r, "CANONICAL_CANVAS_FOUND", "UNKNOWN"),
      canonicalCanvasSelector: getRaw(r, "CANONICAL_CANVAS_SELECTOR", "UNKNOWN"),
      canonicalCanvasDescriptor: getRaw(r, "CANONICAL_CANVAS_DESCRIPTOR", "UNKNOWN"),
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
      "CANVAS_AUTHORITY_METHOD_COUNT",
      "CANVAS_AUTHORITY_METHODS",
      "CANVAS_AUTHORITY_CANDIDATE_COUNT",
      "CANVAS_AUTHORITY_CANDIDATES",

      "CANONICAL_MOUNT_SELECTOR",
      "CANONICAL_CANVAS_SELECTORS",
      "CANONICAL_MOUNT_FOUND",
      "CANONICAL_MOUNT_DESCRIPTOR",
      "CANONICAL_CANVAS_FOUND",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CANVAS_DESCRIPTOR",
      "CANONICAL_CANVAS_INDEX",
      "CANONICAL_CANVAS_IN_CANONICAL_MOUNT",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_DOM_SURFACE_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_IN_MOUNT",
      "CANVAS_WIDTH_ATTRIBUTE",
      "CANVAS_HEIGHT_ATTRIBUTE",
      "CANVAS_INTERNAL_SIZE_NONZERO",
      "CANVAS_RECT_LEFT",
      "CANVAS_RECT_TOP",
      "CANVAS_RECT_WIDTH",
      "CANVAS_RECT_HEIGHT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_COMPUTED_DISPLAY",
      "CANVAS_COMPUTED_VISIBILITY",
      "CANVAS_COMPUTED_OPACITY",
      "CANVAS_COMPUTED_POSITION",
      "CANVAS_COMPUTED_Z_INDEX",
      "CANVAS_COMPUTED_POINTER_EVENTS",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "CANONICAL_CANVAS_DATASET_CONTRACT",
      "CANONICAL_CANVAS_DATASET_RECEIPT",
      "CANONICAL_CANVAS_PIXEL_VISIBLE",
      "CANONICAL_CANVAS_SURFACE_ADMISSIBLE",

      "TOTAL_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_FOUND",
      "PIXEL_BEARING_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_IS_CANONICAL",
      "PIXEL_BEARING_CANVAS_SELECTOR",
      "PIXEL_BEARING_CANVAS_DESCRIPTOR",
      "PIXEL_BEARING_CANVAS_INDEX",
      "PIXEL_BEARING_CANVAS_RECT_NONZERO",
      "PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT",
      "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT",

      "CANVAS_IDENTITY_DISAMBIGUATION_STATUS",
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
      canonicalCanvasSummary: clonePlain(getRaw(report, "CANONICAL_CANVAS_SUMMARY", {})),
      firstPixelBearingCanvasSummary: clonePlain(getRaw(report, "FIRST_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      pixelBearingCanvasSummaries: clonePlain(getRaw(report, "PIXEL_BEARING_CANVAS_SUMMARIES", [])),
      allCanvasSummaries: clonePlain(getRaw(report, "ALL_CANVAS_SUMMARIES", [])),
      canvasAuthorityCandidates: clonePlain(getRaw(report, "CANVAS_AUTHORITY_CANDIDATES", [])),
      canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS.slice(),
      canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES.slice(),
      supportsCanonicalVisibleSurfaceDisambiguation: true,
      supportsPixelBearingCanvasIdentityCheck: true,
      supportsCanonicalZeroRectCheck: true,
      supportsCanonicalBlankPixelCheck: true,
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
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
      "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanonicalCanvasSurfaceTruth",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH"
    ];

    for (const path of aliasPaths) setPath(path, api);

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY = lastCompactSummary || "";

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
      }
    } catch (_error) {}

    return true;
  }

  function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  function runCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  function runProbe(payload = {}) {
    return inspectSurface(payload);
  }

  function inspect(payload = {}) {
    return inspectSurface(payload);
  }

  function runDiagnostic(payload = {}) {
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
    focusedOnCanonicalCanvasIdentity: true,
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

    supportsCanonicalVisibleSurfaceDisambiguation: true,
    supportsPixelBearingCanvasIdentityCheck: true,
    supportsCanonicalZeroRectCheck: true,
    supportsCanonicalBlankPixelCheck: true,
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
