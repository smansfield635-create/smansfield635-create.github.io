// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_TNT_v1_7
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
//
// Purpose:
// - Preserve the public NORTH-facing Canvas surface truth probe contract.
// - Upgrade the probe from “canvas has pixels but rect is zero” into a coordinate-specific
//   layout-math / connection / blind-spot arbitration instrument.
// - Identify whether the failure is:
//   1. target context access,
//   2. canonical mount absence,
//   3. canonical canvas absence,
//   4. canonical selector mismatch,
//   5. parent-chain layout collapse,
//   6. CSS used-size zero,
//   7. frame/mount/canvas connection mismatch,
//   8. canvas buffer/pixel truth disconnected from DOM geometry,
//   9. viewport displacement,
//   10. layer obstruction,
//   11. fallback/cartoon settlement,
//   12. authority/DOM receipt mismatch,
//   13. diagnostic blind spot.
// - Return a valid packet even if a probe coordinate throws.
// - Keep F21 as diagnostic evidence only; do not claim F21 authority.
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
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_TNT_v1_7";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_RECEIPT_v1_7";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_TNT_v1_6";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_RECEIPT_v1_6";

  const LINEAGE_V1_5_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5";

  const VERSION =
    "2026-06-08.hearth-diagnostic-probe-canvas-surface-truth-layout-math-connection-blindspot-arbitration-v1-7";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";

  const CANONICAL_MOUNT_SELECTOR = "#hearthCanvasMount";
  const CANONICAL_FRAME_SELECTOR = "#hearthCanvasRectLockFrame";
  const CANONICAL_CANVAS_ID = "hearthVisibleCanvas";

  const CANONICAL_CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas",
    "#hearthCanvasMount #hearthCanvasRectLockFrame #hearthVisibleCanvas",
    "#hearthCanvasMount #hearthVisibleCanvas",
    "#hearthCanvasMount canvas[data-hearth-canonical-visible-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-visible-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-expression-surface='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas-hub='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas='true']",
    "#hearthCanvasMount canvas"
  ]);

  const STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "#hearthPlanetStage",
    "#hearthStage",
    "#hearthCanvasStage",
    "[data-hearth-globe-stage='true']",
    "[data-hearth-planet-stage='true']",
    "[data-hearth-stage='true']",
    "[data-hearth-canvas-stage='true']",
    ".hearth-stage",
    ".hearth-canvas-stage"
  ]);

  const SCRIPT_PATHS = Object.freeze({
    html: HTML_FILE,
    index: INDEX_FILE,
    routeConductor: ROUTE_CONDUCTOR_FILE,
    controls: CONTROL_FILE,
    canvas: CANVAS_FILE,
    hexAuthority: HEX_AUTHORITY_FILE,
    hexSurface: HEX_SURFACE_FILE,
    pointerFinger: POINTER_FINGER_FILE
  });

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION",
    "HEARTH_CANVAS_HUB_DOWNSTREAM_SURFACE_ADMISSION_FALLBACK_SUPPRESSION",
    "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR",
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppression",
    "HEARTH.canvasHubDownstreamSurfaceAdmissionFallbackSuppression",
    "HEARTH.canvasHubZeroRectCanonicalSurfaceBindingRepair",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppression",
    "DEXTER_LAB.hearthCanvasHubDownstreamSurfaceAdmissionFallbackSuppression",
    "DEXTER_LAB.hearthCanvasHubZeroRectCanonicalSurfaceBindingRepair",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const ROUTE_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
    "HEARTH.routeConductor",
    "DEXTER_LAB.hearthRouteConductor"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority"
  ]);

  const FALLBACK_PATTERNS = Object.freeze([
    /fallback/i,
    /cartoon/i,
    /placeholder/i,
    /static/i,
    /demo/i,
    /sample/i,
    /temporary/i
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
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
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
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
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false
  });

  let lastReport = null;
  let lastReceipt = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastSettledReport = null;
  let settledSampleScheduled = false;

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

  function bounded(value, limit = 5000) {
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
        return bounded(value, 5000) || fallback;
      }
    }

    return bounded(value, 5000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value);
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

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
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
        q(doc, "canvas")
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

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasSurfaceReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasSurfaceSummary",
      "getPresentationReceipt",
      "getPresentationPlatterReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
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
      value.INTERNAL_RENEWAL_CONTRACT,
      value.internalRenewalContract,
      value.RENEWAL_CONTRACT,
      value.renewalContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.routeConductorContract,
      value.hexSurfaceContract,
      value.sourceContract
    );
  }

  function receiptOf(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.INTERNAL_RENEWAL_RECEIPT,
      value.internalRenewalReceipt,
      value.RENEWAL_RECEIPT,
      value.renewalReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.routeConductorReceipt,
      value.hexSurfaceReceipt,
      value.sourceReceipt
    );
  }

  function authorityMethods(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 120);
    } catch (_error) {
      return [];
    }
  }

  function inspectAuthority(targetWindow, aliases) {
    const scopes = [
      { scope: "TARGET_WINDOW", base: targetWindow || null },
      { scope: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of aliases) {
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
          methods
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
        readable: false,
        visible: false,
        display: "UNKNOWN",
        visibility: "UNKNOWN",
        opacity: "UNKNOWN",
        position: "UNKNOWN",
        zIndex: "UNKNOWN",
        pointerEvents: "UNKNOWN",
        transform: "UNKNOWN",
        overflow: "UNKNOWN",
        overflowX: "UNKNOWN",
        overflowY: "UNKNOWN",
        contain: "UNKNOWN",
        contentVisibility: "UNKNOWN",
        width: "UNKNOWN",
        height: "UNKNOWN",
        minWidth: "UNKNOWN",
        minHeight: "UNKNOWN",
        maxWidth: "UNKNOWN",
        maxHeight: "UNKNOWN",
        flex: "UNKNOWN",
        flexBasis: "UNKNOWN",
        alignItems: "UNKNOWN",
        justifyContent: "UNKNOWN",
        boxSizing: "UNKNOWN"
      };
    }

    try {
      const style = targetWindow.getComputedStyle(element);
      const display = safeString(style.display, "UNKNOWN");
      const visibility = safeString(style.visibility, "UNKNOWN");
      const opacity = safeString(style.opacity, "UNKNOWN");

      return {
        readable: true,
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
        overflow: safeString(style.overflow, "UNKNOWN"),
        overflowX: safeString(style.overflowX, "UNKNOWN"),
        overflowY: safeString(style.overflowY, "UNKNOWN"),
        contain: safeString(style.contain, "UNKNOWN"),
        contentVisibility: safeString(style.contentVisibility, "UNKNOWN"),
        width: safeString(style.width, "UNKNOWN"),
        height: safeString(style.height, "UNKNOWN"),
        minWidth: safeString(style.minWidth, "UNKNOWN"),
        minHeight: safeString(style.minHeight, "UNKNOWN"),
        maxWidth: safeString(style.maxWidth, "UNKNOWN"),
        maxHeight: safeString(style.maxHeight, "UNKNOWN"),
        flex: safeString(style.flex, "UNKNOWN"),
        flexBasis: safeString(style.flexBasis, "UNKNOWN"),
        alignItems: safeString(style.alignItems, "UNKNOWN"),
        justifyContent: safeString(style.justifyContent, "UNKNOWN"),
        boxSizing: safeString(style.boxSizing, "UNKNOWN")
      };
    } catch (_error) {
      return {
        readable: false,
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE",
        transform: "UNREADABLE",
        overflow: "UNREADABLE",
        overflowX: "UNREADABLE",
        overflowY: "UNREADABLE",
        contain: "UNREADABLE",
        contentVisibility: "UNREADABLE",
        width: "UNREADABLE",
        height: "UNREADABLE",
        minWidth: "UNREADABLE",
        minHeight: "UNREADABLE",
        maxWidth: "UNREADABLE",
        maxHeight: "UNREADABLE",
        flex: "UNREADABLE",
        flexBasis: "UNREADABLE",
        alignItems: "UNREADABLE",
        justifyContent: "UNREADABLE",
        boxSizing: "UNREADABLE"
      };
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
          ? `.${Array.from(element.classList).slice(0, 5).join(".")}`
          : "";
    } catch (_error) {}

    return `${tag}${id}${classes}${index ? `[${index}]` : ""}` || "UNKNOWN_ELEMENT";
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

  function canvasDataset(canvas) {
    if (!canvas || !canvas.dataset) {
      return {
        contract: "UNKNOWN",
        receipt: "UNKNOWN",
        visibleCanvas: "UNKNOWN",
        expressionSurface: "UNKNOWN",
        canonicalVisibleCanvas: "UNKNOWN",
        canvasHub: "UNKNOWN",
        fallback: "UNKNOWN",
        cartoon: "UNKNOWN",
        downstreamObserved: "UNKNOWN",
        downstreamLatched: "UNKNOWN",
        selectionMode: "UNKNOWN"
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
      canonicalVisibleCanvas: firstKnown(canvas.dataset.hearthCanonicalVisibleCanvas),
      canvasHub: firstKnown(canvas.dataset.hearthCanvasHub),
      fallback: firstKnown(canvas.dataset.hearthFallback, canvas.dataset.fallback),
      cartoon: firstKnown(canvas.dataset.hearthCartoon, canvas.dataset.cartoon),
      downstreamObserved: firstKnown(canvas.dataset.hearthDownstreamSurfaceObserved),
      downstreamLatched: firstKnown(canvas.dataset.hearthDownstreamSurfaceLatched),
      selectionMode: firstKnown(canvas.dataset.hearthCanvasSelectionMode)
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
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
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
        [0.5, 0.18],
        [0.5, 0.82],
        [0.18, 0.5],
        [0.82, 0.5],
        [0.12, 0.12],
        [0.88, 0.12],
        [0.12, 0.88],
        [0.88, 0.88]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;
      let brightnessTotal = 0;
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
        const brightness = (red + green + blue) / 3;

        brightnessTotal += brightness;

        if (alpha > 0) alphaPixelCount += 1;
        if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;

        unique.add(`${red},${green},${blue},${alpha}`);
      }

      const visible = visiblePixelCount > 0;
      const averageBrightness = sampleCount ? Math.round(brightnessTotal / sampleCount) : 0;

      return {
        status: visible
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
            : "PIXEL_SAMPLE_BLANK",
        readable: true,
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        averageBrightness,
        reason: visible
          ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
          : alphaPixelCount > 0
            ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
            : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function fallbackSignals(targetDocument, element) {
    const text = bounded(
      [
        element && element.getAttribute ? element.getAttribute("aria-label") : "",
        element && element.getAttribute ? element.getAttribute("title") : "",
        element && element.getAttribute ? element.getAttribute("data-label") : "",
        element && element.dataset ? JSON.stringify(element.dataset) : "",
        targetDocument && targetDocument.body ? targetDocument.body.innerText : ""
      ].join(" "),
      9000
    );

    const matched = FALLBACK_PATTERNS.some((pattern) => pattern.test(text));

    return {
      fallbackTextObserved: matched,
      fallbackTextBasis: matched
        ? "FALLBACK_OR_CARTOON_TEXT_PATTERN_OBSERVED"
        : "NO_FALLBACK_TEXT_PATTERN_OBSERVED"
    };
  }

  function parentChain(targetWindow, element, stopAt) {
    const chain = [];
    let cursor = element || null;
    let depth = 0;

    while (cursor && depth < 14) {
      const rect = getRect(cursor);
      const css = cssSummary(targetWindow, cursor);
      const parent = cursor.parentElement || null;

      chain.push({
        depth,
        descriptor: elementDescriptor(cursor),
        id: cursor.id || "NONE",
        rectNonzero: rectNonzero(rect),
        rectWidth: rect.width,
        rectHeight: rect.height,
        rectLeft: rect.left,
        rectTop: rect.top,
        computedVisible: css.visible,
        display: css.display,
        visibility: css.visibility,
        opacity: css.opacity,
        position: css.position,
        zIndex: css.zIndex,
        overflow: css.overflow,
        contain: css.contain,
        contentVisibility: css.contentVisibility,
        width: css.width,
        height: css.height,
        minWidth: css.minWidth,
        minHeight: css.minHeight,
        flex: css.flex,
        flexBasis: css.flexBasis,
        parentDescriptor: elementDescriptor(parent)
      });

      if (cursor === stopAt) break;
      cursor = parent;
      depth += 1;
    }

    return chain;
  }

  function classifyParentChain(chain) {
    if (!Array.isArray(chain) || !chain.length) {
      return {
        status: "PARENT_CHAIN_UNAVAILABLE",
        firstCollapsedDepth: -1,
        firstCollapsedDescriptor: "NONE",
        firstHiddenDepth: -1,
        firstHiddenDescriptor: "NONE",
        firstContainmentRiskDepth: -1,
        firstContainmentRiskDescriptor: "NONE"
      };
    }

    const collapsed = chain.find((item) => item.rectNonzero === false);
    const hidden = chain.find((item) => item.computedVisible === false);
    const containmentRisk = chain.find((item) =>
      /paint|layout|strict|content/i.test(item.contain) ||
      /hidden|auto/i.test(item.contentVisibility)
    );

    return {
      status:
        collapsed || hidden || containmentRisk
          ? "PARENT_CHAIN_HAS_LAYOUT_RISK"
          : "PARENT_CHAIN_LAYOUT_READABLE",
      firstCollapsedDepth: collapsed ? collapsed.depth : -1,
      firstCollapsedDescriptor: collapsed ? collapsed.descriptor : "NONE",
      firstCollapsedWidth: collapsed ? collapsed.rectWidth : 0,
      firstCollapsedHeight: collapsed ? collapsed.rectHeight : 0,
      firstHiddenDepth: hidden ? hidden.depth : -1,
      firstHiddenDescriptor: hidden ? hidden.descriptor : "NONE",
      firstContainmentRiskDepth: containmentRisk ? containmentRisk.depth : -1,
      firstContainmentRiskDescriptor: containmentRisk ? containmentRisk.descriptor : "NONE",
      firstContainmentRiskContain: containmentRisk ? containmentRisk.contain : "NONE",
      firstContainmentRiskContentVisibility: containmentRisk ? containmentRisk.contentVisibility : "NONE"
    };
  }

  function describeCanvas(targetWindow, targetDocument, canvas, index, selector, canonicalMount, canonicalFrame) {
    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const dataset = canvasDataset(canvas);
    const fallback = fallbackSignals(targetDocument, canvas);

    const internalSizeNonzero = Boolean(
      canvas && safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0
    );

    const rectOk = rectNonzero(rect);
    const viewportOk = viewportIntersecting(targetWindow, rect);
    const inMount = Boolean(canonicalMount && canvas && containsOrEquals(canonicalMount, canvas));
    const inFrame = Boolean(canonicalFrame && canvas && containsOrEquals(canonicalFrame, canvas));

    const bufferCssWidthRatio =
      rect.width > 0 ? safeNumber(canvas && canvas.width, 0) / rect.width : 0;
    const bufferCssHeightRatio =
      rect.height > 0 ? safeNumber(canvas && canvas.height, 0) / rect.height : 0;

    return {
      index,
      selector: selector || "canvas",
      descriptor: elementDescriptor(canvas, index),
      id: canvas && canvas.id ? canvas.id : "NONE",
      datasetContract: dataset.contract,
      datasetReceipt: dataset.receipt,
      datasetVisibleCanvas: dataset.visibleCanvas,
      datasetExpressionSurface: dataset.expressionSurface,
      datasetCanonicalVisibleCanvas: dataset.canonicalVisibleCanvas,
      datasetCanvasHub: dataset.canvasHub,
      datasetFallback: dataset.fallback,
      datasetCartoon: dataset.cartoon,
      datasetDownstreamObserved: dataset.downstreamObserved,
      datasetDownstreamLatched: dataset.downstreamLatched,
      datasetSelectionMode: dataset.selectionMode,
      inCanonicalMount: inMount,
      inCanonicalFrame: inFrame,
      directParentDescriptor: elementDescriptor(canvas && canvas.parentElement),
      widthAttribute: canvas ? safeNumber(canvas.width, 0) : 0,
      heightAttribute: canvas ? safeNumber(canvas.height, 0) : 0,
      internalSizeNonzero,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectRight: rect.right,
      rectBottom: rect.bottom,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectOk,
      bufferCssWidthRatio,
      bufferCssHeightRatio,
      computedVisible: css.visible,
      computedDisplay: css.display,
      computedVisibility: css.visibility,
      computedOpacity: css.opacity,
      computedPosition: css.position,
      computedZIndex: css.zIndex,
      computedPointerEvents: css.pointerEvents,
      computedTransform: css.transform,
      computedOverflow: css.overflow,
      computedContain: css.contain,
      computedContentVisibility: css.contentVisibility,
      computedWidth: css.width,
      computedHeight: css.height,
      computedMinWidth: css.minWidth,
      computedMinHeight: css.minHeight,
      computedFlex: css.flex,
      computedFlexBasis: css.flexBasis,
      computedBoxSizing: css.boxSizing,
      viewportIntersecting: viewportOk,
      context2dReady: ctx.ready,
      context2dStatus: ctx.status,
      pixelSampleStatus: pixels.status,
      pixelSampleReadable: pixels.readable,
      pixelVisible: pixels.visible,
      pixelSampleCount: pixels.sampleCount,
      visiblePixelCount: pixels.visiblePixelCount,
      alphaPixelCount: pixels.alphaPixelCount,
      uniqueColorCount: pixels.uniqueColorCount,
      averageBrightness: pixels.averageBrightness,
      pixelSampleReason: pixels.reason,
      fallbackTextObserved: fallback.fallbackTextObserved,
      fallbackTextBasis: fallback.fallbackTextBasis,
      surfaceAdmissible: Boolean(
        internalSizeNonzero &&
        rectOk &&
        css.visible &&
        viewportOk &&
        ctx.ready
      ),
      surfaceVisibleAdmissible: Boolean(
        internalSizeNonzero &&
        rectOk &&
        css.visible &&
        viewportOk &&
        ctx.ready &&
        pixels.visible
      )
    };
  }

  function inspectLayering(targetWindow, targetDocument, canonicalCanvas) {
    if (!targetDocument || !targetWindow || !canonicalCanvas) {
      return {
        status: "NOT_EVALUATED",
        centerElementDescriptor: "NONE",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: "UNKNOWN"
      };
    }

    const rect = getRect(canonicalCanvas);
    if (!rectNonzero(rect)) {
      return {
        status: "CANONICAL_RECT_ZERO",
        centerElementDescriptor: "NONE",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: "UNKNOWN"
      };
    }

    try {
      const x = Math.max(1, Math.floor(rect.left + rect.width / 2));
      const y = Math.max(1, Math.floor(rect.top + rect.height / 2));
      const element = isFunction(targetDocument.elementFromPoint)
        ? targetDocument.elementFromPoint(x, y)
        : null;

      const same = element === canonicalCanvas;
      const contains = containsOrEquals(element, canonicalCanvas);
      const canvasContains = containsOrEquals(canonicalCanvas, element);
      const descriptor = elementDescriptor(element);

      return {
        status: "EVALUATED",
        centerX: x,
        centerY: y,
        centerElementDescriptor: descriptor,
        centerElementIsCanonicalCanvas: same,
        centerElementContainsCanonicalCanvas: contains,
        canonicalCanvasContainsCenterElement: canvasContains,
        possibleLayerBlocker: same || canvasContains ? "false" : descriptor
      };
    } catch (error) {
      return {
        status: "UNREADABLE",
        centerElementDescriptor: "UNKNOWN",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function findStage(targetDocument) {
    return firstElement(targetDocument, STAGE_SELECTORS);
  }

  function findCanonicalCanvas(targetDocument) {
    return firstElement(targetDocument, CANONICAL_CANVAS_SELECTORS);
  }

  function inspectScripts(targetDocument) {
    const out = {};
    for (const [key, path] of Object.entries(SCRIPT_PATHS)) {
      out[key] = scriptInfo(targetDocument, path);
    }
    return out;
  }

  function captureSurfaceSnapshot(payload = {}, phase = "IMMEDIATE_SYNC") {
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const scripts = inspectScripts(targetDocument);

    const canvasAuthority = inspectAuthority(targetWindow, CANVAS_AUTHORITY_ALIASES);
    const routeAuthority = inspectAuthority(targetWindow, ROUTE_AUTHORITY_ALIASES);
    const hexSurfaceAuthority = inspectAuthority(targetWindow, HEX_SURFACE_ALIASES);

    const stageFound = findStage(targetDocument);
    const stageElement = stageFound.element;
    const stageRect = getRect(stageElement);
    const stageCss = cssSummary(targetWindow, stageElement);

    const canonicalMount = q(targetDocument, CANONICAL_MOUNT_SELECTOR);
    const canonicalFrame = q(targetDocument, CANONICAL_FRAME_SELECTOR);
    const canonicalFound = findCanonicalCanvas(targetDocument);
    const canonicalCanvas = canonicalFound.element;

    const mountRect = getRect(canonicalMount);
    const mountCss = cssSummary(targetWindow, canonicalMount);
    const frameRect = getRect(canonicalFrame);
    const frameCss = cssSummary(targetWindow, canonicalFrame);

    const allCanvases = qa(targetDocument, "canvas");

    const allCanvasSummaries = allCanvases.map((canvas, index) =>
      describeCanvas(
        targetWindow,
        targetDocument,
        canvas,
        index + 1,
        canvas === canonicalCanvas ? canonicalFound.selector : "canvas",
        canonicalMount,
        canonicalFrame
      )
    );

    const canonicalSummary = canonicalCanvas
      ? describeCanvas(
          targetWindow,
          targetDocument,
          canonicalCanvas,
          allCanvases.indexOf(canonicalCanvas) + 1 || 1,
          canonicalFound.selector,
          canonicalMount,
          canonicalFrame
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

    const canonicalParentChain = parentChain(targetWindow, canonicalCanvas, canonicalMount || stageElement || null);
    const canonicalParentChainClassification = classifyParentChain(canonicalParentChain);

    const mountParentChain = parentChain(targetWindow, canonicalMount, stageElement || null);
    const mountParentChainClassification = classifyParentChain(mountParentChain);

    const canonicalSurfaceAdmissible = Boolean(
      canonicalSummary &&
      canonicalSummary.inCanonicalMount &&
      canonicalSummary.surfaceAdmissible
    );

    const canonicalSurfaceTruthPassed = Boolean(
      canonicalSurfaceAdmissible &&
      canonicalSummary &&
      canonicalSummary.pixelVisible &&
      pixelBearingCanvasIsCanonical
    );

    const fallbackObserved = Boolean(
      canonicalSummary &&
      (
        canonicalSummary.fallbackTextObserved ||
        canonicalSummary.datasetFallback === "true" ||
        canonicalSummary.datasetCartoon === "true"
      )
    );

    const layering = inspectLayering(targetWindow, targetDocument, canonicalCanvas);

    return {
      phase,
      capturedAt: nowIso(),

      context,
      targetWindow,
      targetDocument,

      scripts,
      canvasAuthority,
      routeAuthority,
      hexSurfaceAuthority,

      stageFound: Boolean(stageElement),
      stageSelector: stageFound.selector,
      stageDescriptor: elementDescriptor(stageElement),
      stageRectNonzero: rectNonzero(stageRect),
      stageRectWidth: stageRect.width,
      stageRectHeight: stageRect.height,
      stageComputedVisible: stageCss.visible,
      stageComputedDisplay: stageCss.display,
      stageComputedPosition: stageCss.position,
      stageComputedOverflow: stageCss.overflow,

      canonicalMount,
      canonicalMountFound: Boolean(canonicalMount),
      canonicalMountDescriptor: elementDescriptor(canonicalMount),
      canonicalMountRectNonzero: rectNonzero(mountRect),
      canonicalMountRectWidth: mountRect.width,
      canonicalMountRectHeight: mountRect.height,
      canonicalMountComputedVisible: mountCss.visible,
      canonicalMountComputedDisplay: mountCss.display,
      canonicalMountComputedPosition: mountCss.position,
      canonicalMountComputedOverflow: mountCss.overflow,
      canonicalMountComputedContain: mountCss.contain,
      canonicalMountComputedContentVisibility: mountCss.contentVisibility,
      canonicalMountComputedWidth: mountCss.width,
      canonicalMountComputedHeight: mountCss.height,

      canonicalFrame,
      canonicalFrameFound: Boolean(canonicalFrame),
      canonicalFrameDescriptor: elementDescriptor(canonicalFrame),
      canonicalFrameRectNonzero: rectNonzero(frameRect),
      canonicalFrameRectWidth: frameRect.width,
      canonicalFrameRectHeight: frameRect.height,
      canonicalFrameComputedVisible: frameCss.visible,
      canonicalFrameComputedDisplay: frameCss.display,
      canonicalFrameComputedPosition: frameCss.position,
      canonicalFrameComputedOverflow: frameCss.overflow,
      canonicalFrameComputedContain: frameCss.contain,
      canonicalFrameComputedContentVisibility: frameCss.contentVisibility,
      canonicalFrameComputedWidth: frameCss.width,
      canonicalFrameComputedHeight: frameCss.height,

      canonicalCanvas,
      canonicalFound,
      canonicalSummary,
      canonicalParentChain,
      canonicalParentChainClassification,
      mountParentChain,
      mountParentChainClassification,

      allCanvases,
      allCanvasSummaries,
      pixelBearingSummaries,
      firstPixelBearingSummary,
      firstPixelBearingCanvas,
      pixelBearingCanvasFound,
      pixelBearingCanvasIsCanonical,
      nonCanonicalPixelBearingCanvasCount,
      canonicalSurfaceAdmissible,
      canonicalSurfaceTruthPassed,
      fallbackObserved,
      layering
    };
  }

  function resolveLayoutMathFailure(snapshot) {
    const canonicalSummary = snapshot.canonicalSummary || {};
    const chain = snapshot.canonicalParentChainClassification || {};
    const mountChain = snapshot.mountParentChainClassification || {};

    if (!snapshot.context.targetAvailable) {
      return {
        status: "TARGET_CONTEXT_UNAVAILABLE",
        clean: false,
        coordinate: "TARGET_CONTEXT_STATUS",
        failureClass: "TARGET_CONTEXT_UNAVAILABLE",
        owner: "DIAGNOSTIC_TARGET_ACCESS",
        file: FILE,
        reason: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        action: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE",
        certainty: "DEFINITIVE_TARGET_CONTEXT_FAILURE"
      };
    }

    if (!snapshot.canonicalMountFound) {
      return {
        status: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_MOUNT_FOUND",
        failureClass: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        owner: "HTML_SHELL_OR_CANVAS_PLACEMENT",
        file: HTML_FILE,
        reason: "#hearthCanvasMount_WAS_NOT_FOUND_IN_TARGET_DOCUMENT",
        action: "RESTORE_OR_CONFIRM_CANONICAL_HEARTH_CANVAS_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_MOUNT_FAILURE"
      };
    }

    if (snapshot.canonicalMountFound && !snapshot.canonicalMountRectNonzero) {
      return {
        status: "CANONICAL_MOUNT_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_MOUNT_RECT_NONZERO",
        failureClass: "CANONICAL_MOUNT_ZERO_RECT",
        owner: "HTML_SHELL_OR_STAGE_LAYOUT",
        file: HTML_FILE,
        reason: `#hearthCanvasMount_EXISTS_BUT_RECT_IS_ZERO_PARENT_CHAIN:${mountChain.firstCollapsedDescriptor || "UNKNOWN"}`,
        action: "AUDIT_HEARTH_CANVAS_MOUNT_PARENT_LAYOUT_AND_STAGE_SIZE",
        certainty: "DEFINITIVE_MOUNT_LAYOUT_MATH_FAILURE"
      };
    }

    if (!snapshot.canonicalFrameFound) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_FRAME_FOUND",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        owner: "CANVAS_DOM_BINDING",
        file: CANVAS_FILE,
        reason: "#hearthCanvasMount_EXISTS_BUT_#hearthCanvasRectLockFrame_IS_MISSING",
        action: "VERIFY_CANVAS_FILE_BINDS_OR_CREATES_CANONICAL_RECT_LOCK_FRAME_WITHOUT_MUTATING_SOURCE_TRUTH",
        certainty: "DEFINITIVE_CANONICAL_FRAME_CONNECTION_FAILURE"
      };
    }

    if (snapshot.canonicalFrameFound && !snapshot.canonicalFrameRectNonzero) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_FRAME_RECT_NONZERO",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        owner: "CANVAS_DOM_BINDING_OR_CSS_LAYOUT",
        file: CANVAS_FILE,
        reason: "#hearthCanvasRectLockFrame_EXISTS_BUT_RECT_IS_ZERO",
        action: "AUDIT_RECT_LOCK_FRAME_STYLE_WIDTH_HEIGHT_FLEX_BASIS_AND_PARENT_LAYOUT",
        certainty: "DEFINITIVE_CANONICAL_FRAME_LAYOUT_MATH_FAILURE"
      };
    }

    if (!snapshot.canonicalCanvas) {
      return {
        status: "CANONICAL_CANVAS_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_CANVAS_FOUND",
        failureClass: "CANONICAL_CANVAS_NOT_FOUND",
        owner: "CANVAS_DOM_BINDING",
        file: CANVAS_FILE,
        reason: "#hearthCanvasMount_EXISTS_BUT_NO_CANONICAL_CANVAS_SELECTOR_MATCHED",
        action: "BIND_THE_PIXEL_BEARING_CANVAS_TO_THE_CANONICAL_SELECTOR_CHAIN",
        certainty: "DEFINITIVE_CANONICAL_CANVAS_CONNECTION_FAILURE"
      };
    }

    if (
      snapshot.pixelBearingCanvasFound &&
      !snapshot.pixelBearingCanvasIsCanonical &&
      snapshot.nonCanonicalPixelBearingCanvasCount > 0
    ) {
      return {
        status: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        clean: false,
        coordinate: "PIXEL_BEARING_CANVAS_IS_CANONICAL",
        failureClass: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        owner: "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        reason: "VISIBLE_PIXELS_EXIST_BUT_THE_PIXEL_BEARING_CANVAS_IS_NOT_THE_CANONICAL_CANVAS",
        action: "ALIGN_RENDERED_PIXEL_SURFACE_WITH_#hearthCanvasMount_#hearthCanvasRectLockFrame_#hearthVisibleCanvas",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE"
      };
    }

    if (!canonicalSummary.inCanonicalMount) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_CANONICAL_MOUNT",
        clean: false,
        coordinate: "CANVAS_IN_MOUNT",
        failureClass: "CANONICAL_CANVAS_CONNECTION_MISMATCH",
        owner: "CANVAS_DOM_BINDING",
        file: CANVAS_FILE,
        reason: "CANONICAL_CANVAS_SELECTOR_MATCHED_BUT_CANVAS_IS_NOT_INSIDE_#hearthCanvasMount",
        action: "MOVE_OR_SELECT_CANVAS_THROUGH_THE_CANONICAL_MOUNT_CHAIN",
        certainty: "DEFINITIVE_CANVAS_CONNECTION_FAILURE"
      };
    }

    if (!canonicalSummary.inCanonicalFrame) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_RECT_LOCK_FRAME",
        clean: false,
        coordinate: "CANVAS_IN_FRAME",
        failureClass: "CANONICAL_CANVAS_FRAME_CONNECTION_MISMATCH",
        owner: "CANVAS_DOM_BINDING",
        file: CANVAS_FILE,
        reason: "CANONICAL_CANVAS_IS_IN_MOUNT_BUT_NOT_IN_#hearthCanvasRectLockFrame",
        action: "PLACE_CANONICAL_CANVAS_UNDER_THE_RECT_LOCK_FRAME_CHAIN",
        certainty: "DEFINITIVE_CANVAS_FRAME_CONNECTION_FAILURE"
      };
    }

    if (!canonicalSummary.internalSizeNonzero) {
      return {
        status: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        clean: false,
        coordinate: "CANVAS_INTERNAL_SIZE_NONZERO",
        failureClass: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        owner: "CANVAS_DOM_SURFACE",
        file: CANVAS_FILE,
        reason: "CANONICAL_CANVAS_WIDTH_OR_HEIGHT_ATTRIBUTE_IS_ZERO",
        action: "VERIFY_CANONICAL_CANVAS_BUFFER_WIDTH_AND_HEIGHT_ATTRIBUTES",
        certainty: "DEFINITIVE_CANVAS_BUFFER_MATH_FAILURE"
      };
    }

    if (!canonicalSummary.rectNonzero) {
      const collapsedDescriptor =
        chain.firstCollapsedDescriptor && chain.firstCollapsedDescriptor !== "NONE"
          ? chain.firstCollapsedDescriptor
          : canonicalSummary.descriptor;

      return {
        status: "CANONICAL_CANVAS_ZERO_RECT",
        clean: false,
        coordinate: "CANVAS_RECT_NONZERO",
        failureClass: "CANONICAL_CANVAS_ZERO_RECT",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        reason: canonicalSummary.pixelVisible
          ? `CANONICAL_CANVAS_HAS_PIXEL_DATA_BUT_BOUNDING_RECT_IS_ZERO_COLLAPSED_AT:${collapsedDescriptor}`
          : `CANONICAL_CANVAS_EXISTS_BUT_BOUNDING_RECT_IS_ZERO_COLLAPSED_AT:${collapsedDescriptor}`,
        action: "AUDIT_CANONICAL_CANVAS_CSS_USED_SIZE_PARENT_CHAIN_AND_RECT_LOCK_MATH",
        certainty: "DEFINITIVE_CANONICAL_RECT_MATH_FAILURE"
      };
    }

    if (!canonicalSummary.computedVisible) {
      return {
        status: "CANONICAL_CANVAS_HIDDEN",
        clean: false,
        coordinate: "CANVAS_COMPUTED_VISIBLE",
        failureClass: "CANONICAL_CANVAS_COMPUTED_STYLE_HIDDEN",
        owner: "CSS_VISIBILITY_OR_ROUTE_SHELL",
        file: HTML_FILE,
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_COMPUTED_STYLE_IS_NOT_VISIBLE",
        action: "AUDIT_DISPLAY_VISIBILITY_OPACITY_AND_ROUTE_STAGE_VISIBILITY",
        certainty: "DEFINITIVE_CANONICAL_VISIBILITY_FAILURE"
      };
    }

    if (!canonicalSummary.viewportIntersecting) {
      return {
        status: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        clean: false,
        coordinate: "CANVAS_VIEWPORT_INTERSECTING",
        failureClass: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        owner: "CSS_LAYOUT_OR_SCROLL_POSITION",
        file: HTML_FILE,
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        action: "AUDIT_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION",
        certainty: "DEFINITIVE_CANONICAL_VIEWPORT_FAILURE"
      };
    }

    if (!canonicalSummary.context2dReady) {
      return {
        status: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        clean: false,
        coordinate: "CANVAS_CONTEXT_2D_READY",
        failureClass: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        owner: "CANVAS_DOM_SURFACE",
        file: CANVAS_FILE,
        reason: canonicalSummary.context2dStatus,
        action: "VERIFY_CANONICAL_DOM_SURFACE_IS_STANDARD_2D_CANVAS",
        certainty: "DEFINITIVE_CANONICAL_CONTEXT_FAILURE"
      };
    }

    if (
      snapshot.layering.status === "EVALUATED" &&
      snapshot.layering.possibleLayerBlocker !== "false"
    ) {
      return {
        status: "CANONICAL_CANVAS_LAYER_BLOCKED_OR_NOT_TOPMOST",
        clean: false,
        coordinate: "CANVAS_LAYER_TOPMOST",
        failureClass: "CANONICAL_CANVAS_LAYER_BLOCKED_OR_NOT_TOPMOST",
        owner: "CSS_LAYERING_OR_ROUTE_STAGE",
        file: HTML_FILE,
        reason: `CENTER_POINT_TOP_ELEMENT_IS_${snapshot.layering.centerElementDescriptor}`,
        action: "AUDIT_CANVAS_LAYERING_Z_INDEX_AND_OVERLAY_ELEMENTS",
        certainty: "DEFINITIVE_CANONICAL_LAYERING_FAILURE"
      };
    }

    if (snapshot.fallbackObserved) {
      return {
        status: "CANONICAL_CANVAS_VISIBLE_BUT_FALLBACK_OR_CARTOON_INDICATED",
        clean: false,
        coordinate: "FALLBACK_CARTOON_SIGNAL",
        failureClass: "CANONICAL_CANVAS_FALLBACK_OR_CARTOON_SURFACE",
        owner: "CANVAS_FALLBACK_PATH_OR_ROUTE_CONDUCTOR_SETTLED_STATE",
        file: CANVAS_FILE,
        reason: "CANONICAL_CANVAS_IS_VISIBLE_AND_PIXEL_BEARING_BUT_FALLBACK_OR_CARTOON_SIGNAL_IS_PRESENT",
        action: "AUDIT_ROUTE_SETTLED_STATE_AND_DOWNSTREAM_FALLBACK_SUPPRESSION",
        certainty: "DEFINITIVE_FALLBACK_SURFACE_SIGNAL"
      };
    }

    if (snapshot.canonicalSurfaceAdmissible && !canonicalSummary.pixelVisible) {
      return {
        status: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        clean: false,
        coordinate: "CANVAS_PIXEL_VISIBLE",
        failureClass: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        owner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        reason: canonicalSummary.pixelSampleReason,
        action: "AUDIT_CANONICAL_CANVAS_DRAW_PATH_AFTER_DOM_SURFACE_BINDING_IS_CONFIRMED",
        certainty: "DEFINITIVE_CANONICAL_PIXEL_FAILURE"
      };
    }

    if (snapshot.canonicalSurfaceTruthPassed) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        clean: true,
        coordinate: "NONE",
        failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        owner: "NONE",
        file: "NONE",
        reason: "CANONICAL_CANVAS_IS_MOUNTED_FRAMED_NONZERO_VISIBLE_VIEWPORT_INTERSECTING_CONTEXT_READY_AND_PIXEL_BEARING",
        action: "RETURN_CANONICAL_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_LAWFUL_CHECK",
        certainty: "DEFINITIVE_CANONICAL_SURFACE_PASS_NO_FINAL_CLAIM"
      };
    }

    return {
      status: "DIAGNOSTIC_BLIND_SPOT",
      clean: false,
      coordinate: "UNCLASSIFIED_CANVAS_SURFACE_TRUTH_STATE",
      failureClass: "DIAGNOSTIC_BLIND_SPOT",
      owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      file: FILE,
      reason: "CANONICAL_CANVAS_STATE_DID_NOT_MATCH_ANY_DEFINED_FAILURE_OR_PASS_CLASS",
      action: "EXPAND_DIAGNOSTIC_CLASSIFIER_FOR_THIS_SURFACE_STATE",
      certainty: "BLIND_SPOT_IDENTIFIED"
    };
  }

  function compareImmediateToSettled(immediate, settled) {
    if (!immediate || !settled) {
      return {
        status: "TRANSITION_COMPARISON_UNAVAILABLE",
        class: "NO_SETTLED_SAMPLE",
        reason: "SETTLED_SAMPLE_NOT_AVAILABLE"
      };
    }

    const fields = [
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_RECT_NONZERO",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "PIXEL_BEARING_CANVAS_IS_CANONICAL",
      "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED",
      "CANVAS_LAYER_POSSIBLE_BLOCKER"
    ];

    const changed = fields
      .map((field) => ({
        field,
        before: getRaw(immediate, field, "UNKNOWN"),
        after: getRaw(settled, field, "UNKNOWN")
      }))
      .filter((entry) => String(entry.before) !== String(entry.after));

    if (changed.length) {
      return {
        status: "TRANSITION_STATE_CHANGED",
        class: "IMMEDIATE_TO_SETTLED_COORDINATE_CHANGED",
        reason: changed.map((entry) => `${entry.field}:${entry.before}>${entry.after}`).join("|"),
        changed
      };
    }

    return {
      status: "TRANSITION_STATE_STABLE",
      class: "IMMEDIATE_AND_SETTLED_SURFACE_MATCH",
      reason: getRaw(immediate, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      changed: []
    };
  }

  function buildReportFromSnapshot(snapshot, transitionMode = "IMMEDIATE_SYNC") {
    const verdict = resolveLayoutMathFailure(snapshot);
    const canonicalSummary = snapshot.canonicalSummary || {};
    const firstPixelBearingSummary = snapshot.firstPixelBearingSummary || {};
    const scripts = snapshot.scripts || {};
    const canvasAuthority = snapshot.canvasAuthority || {};
    const routeAuthority = snapshot.routeAuthority || {};
    const hexSurfaceAuthority = snapshot.hexSurfaceAuthority || {};
    const layering = snapshot.layering || {};
    const chain = snapshot.canonicalParentChainClassification || {};
    const mountChain = snapshot.mountParentChainClassification || {};
    const comparison = compareImmediateToSettled(lastReport, lastSettledReport);

    const notes = [
      "V1_7_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_ACTIVE",
      "V1_6_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_PRESERVED",
      "V1_5_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_PRESERVED",
      "RUN_PROBE_RETURNS_PACKET_UNDER_COORDINATE_FAILURE_GUARD",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_REPAIR",
      "NO_ROUTE_REPAIR",
      "NO_CONTROL_MUTATION",
      "NO_RUNTIME_RESTART",
      `CANONICAL_MOUNT_FOUND:${snapshot.canonicalMountFound}`,
      `CANONICAL_MOUNT_RECT_NONZERO:${snapshot.canonicalMountRectNonzero}`,
      `CANONICAL_FRAME_FOUND:${snapshot.canonicalFrameFound}`,
      `CANONICAL_FRAME_RECT_NONZERO:${snapshot.canonicalFrameRectNonzero}`,
      `CANONICAL_CANVAS_FOUND:${Boolean(snapshot.canonicalCanvas)}`,
      `CANONICAL_CANVAS_IN_MOUNT:${canonicalSummary.inCanonicalMount === true}`,
      `CANONICAL_CANVAS_IN_FRAME:${canonicalSummary.inCanonicalFrame === true}`,
      `CANONICAL_CANVAS_RECT_NONZERO:${canonicalSummary.rectNonzero === true}`,
      `CANONICAL_CANVAS_PIXEL_VISIBLE:${canonicalSummary.pixelVisible === true}`,
      `PIXEL_BEARING_CANVAS_FOUND:${snapshot.pixelBearingCanvasFound}`,
      `PIXEL_BEARING_CANVAS_IS_CANONICAL:${snapshot.pixelBearingCanvasIsCanonical}`,
      `NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT:${snapshot.nonCanonicalPixelBearingCanvasCount}`,
      `PARENT_CHAIN_STATUS:${chain.status || "UNKNOWN"}`,
      `MOUNT_PARENT_CHAIN_STATUS:${mountChain.status || "UNKNOWN"}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${verdict.failureClass}`,
      `DIAGNOSTIC_CERTAINTY:${verdict.certainty}`
    ];

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_PACKET_v1_7",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_V1_5_CONTRACT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_FINGER_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: snapshot.context.targetAvailable ? "true" : "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CANONICAL_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "DEFINE_DEFUNCT_LAYOUT_MATH_CONNECTION_OR_DIAGNOSTIC_BLIND_SPOT",

      TRANSITION_MEASUREMENT_MODE: transitionMode,
      TRANSITION_SAMPLE_PHASE: snapshot.phase,
      TRANSITION_SETTLED_SAMPLE_SCHEDULED: transitionMode === "IMMEDIATE_SYNC",
      TRANSITION_SETTLED_SAMPLE_AVAILABLE: Boolean(lastSettledReport),
      TRANSITION_COMPARISON_STATUS: comparison.status,
      TRANSITION_COMPARISON_CLASS: comparison.class,
      TRANSITION_COMPARISON_REASON: comparison.reason,

      TARGET_CONTEXT_STATUS: snapshot.context.targetAvailable
        ? "TARGET_CONTEXT_AVAILABLE"
        : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: snapshot.context.targetSource,
      TARGET_ACCESS_ERROR: snapshot.context.targetAccessError,

      INDEX_SCRIPT_PRESENT: scripts.index ? scripts.index.present : false,
      INDEX_SCRIPT_SRC: scripts.index ? scripts.index.src : "NONE",
      ROUTE_CONDUCTOR_SCRIPT_PRESENT: scripts.routeConductor ? scripts.routeConductor.present : false,
      ROUTE_CONDUCTOR_SCRIPT_SRC: scripts.routeConductor ? scripts.routeConductor.src : "NONE",
      CONTROL_SCRIPT_PRESENT: scripts.controls ? scripts.controls.present : false,
      CONTROL_SCRIPT_SRC: scripts.controls ? scripts.controls.src : "NONE",
      CANVAS_SCRIPT_PRESENT: scripts.canvas ? scripts.canvas.present : false,
      CANVAS_SCRIPT_COUNT: scripts.canvas ? scripts.canvas.count : 0,
      CANVAS_SCRIPT_SRC: scripts.canvas ? scripts.canvas.src : "NONE",
      CANVAS_SCRIPT_CACHE_KEY: scripts.canvas ? scripts.canvas.cacheKey : "NONE",
      CANVAS_SCRIPT_TAG_ORDER: scripts.canvas ? scripts.canvas.lastOrder : 0,
      CANVAS_SCRIPT_LOAD_INFERRED: Boolean(scripts.canvas && scripts.canvas.present),
      CANVAS_SCRIPT_EXECUTION_INFERRED: Boolean(
        scripts.canvas &&
        scripts.canvas.present &&
        (
          canvasAuthority.observed ||
          Boolean(snapshot.canonicalCanvas) ||
          snapshot.allCanvases.length > 0 ||
          dataValue(snapshot.targetDocument, "hearthCanvasLoaded") === "true"
        )
      ),

      CANVAS_AUTHORITY_OBSERVED: canvasAuthority.observed || false,
      CANVAS_AUTHORITY_SCOPE: canvasAuthority.scope || "NONE",
      CANVAS_AUTHORITY_SOURCE_PATH: canvasAuthority.path || "NONE",
      CANVAS_AUTHORITY_CONTRACT: canvasAuthority.contract || "UNKNOWN",
      CANVAS_AUTHORITY_RECEIPT: canvasAuthority.receipt || "UNKNOWN",
      CANVAS_AUTHORITY_METHOD_COUNT: canvasAuthority.methodCount || 0,
      CANVAS_AUTHORITY_METHODS: Array.isArray(canvasAuthority.methods)
        ? canvasAuthority.methods.join(",") || "NONE"
        : "NONE",
      CANVAS_AUTHORITY_CANDIDATE_COUNT: Array.isArray(canvasAuthority.candidates)
        ? canvasAuthority.candidates.length
        : 0,
      CANVAS_AUTHORITY_CANDIDATES: clonePlain(canvasAuthority.candidates || []),

      ROUTE_AUTHORITY_OBSERVED: routeAuthority.observed || false,
      ROUTE_AUTHORITY_SOURCE_PATH: routeAuthority.path || "NONE",
      ROUTE_AUTHORITY_CONTRACT: routeAuthority.contract || "UNKNOWN",
      ROUTE_AUTHORITY_RECEIPT: routeAuthority.receipt || "UNKNOWN",

      HEX_SURFACE_AUTHORITY_OBSERVED: hexSurfaceAuthority.observed || false,
      HEX_SURFACE_AUTHORITY_SOURCE_PATH: hexSurfaceAuthority.path || "NONE",
      HEX_SURFACE_AUTHORITY_CONTRACT: hexSurfaceAuthority.contract || "UNKNOWN",
      HEX_SURFACE_AUTHORITY_RECEIPT: hexSurfaceAuthority.receipt || "UNKNOWN",

      STAGE_PRESENT: snapshot.stageFound,
      STAGE_SELECTOR: snapshot.stageSelector,
      STAGE_DESCRIPTOR: snapshot.stageDescriptor,
      STAGE_RECT_NONZERO: snapshot.stageRectNonzero,
      STAGE_RECT_WIDTH: snapshot.stageRectWidth,
      STAGE_RECT_HEIGHT: snapshot.stageRectHeight,
      STAGE_COMPUTED_VISIBLE: snapshot.stageComputedVisible,
      STAGE_COMPUTED_DISPLAY: snapshot.stageComputedDisplay,
      STAGE_COMPUTED_POSITION: snapshot.stageComputedPosition,
      STAGE_COMPUTED_OVERFLOW: snapshot.stageComputedOverflow,

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_FRAME_SELECTOR,
      CANONICAL_CANVAS_ID,
      CANONICAL_CANVAS_SELECTORS: CANONICAL_CANVAS_SELECTORS.slice(),

      CANONICAL_MOUNT_FOUND: snapshot.canonicalMountFound,
      CANONICAL_MOUNT_DESCRIPTOR: snapshot.canonicalMountDescriptor,
      CANONICAL_MOUNT_RECT_NONZERO: snapshot.canonicalMountRectNonzero,
      CANONICAL_MOUNT_RECT_WIDTH: snapshot.canonicalMountRectWidth,
      CANONICAL_MOUNT_RECT_HEIGHT: snapshot.canonicalMountRectHeight,
      CANONICAL_MOUNT_COMPUTED_VISIBLE: snapshot.canonicalMountComputedVisible,
      CANONICAL_MOUNT_COMPUTED_DISPLAY: snapshot.canonicalMountComputedDisplay,
      CANONICAL_MOUNT_COMPUTED_POSITION: snapshot.canonicalMountComputedPosition,
      CANONICAL_MOUNT_COMPUTED_OVERFLOW: snapshot.canonicalMountComputedOverflow,
      CANONICAL_MOUNT_COMPUTED_CONTAIN: snapshot.canonicalMountComputedContain,
      CANONICAL_MOUNT_COMPUTED_CONTENT_VISIBILITY: snapshot.canonicalMountComputedContentVisibility,
      CANONICAL_MOUNT_COMPUTED_WIDTH: snapshot.canonicalMountComputedWidth,
      CANONICAL_MOUNT_COMPUTED_HEIGHT: snapshot.canonicalMountComputedHeight,

      CANONICAL_FRAME_FOUND: snapshot.canonicalFrameFound,
      CANONICAL_FRAME_DESCRIPTOR: snapshot.canonicalFrameDescriptor,
      CANONICAL_FRAME_RECT_NONZERO: snapshot.canonicalFrameRectNonzero,
      CANONICAL_FRAME_RECT_WIDTH: snapshot.canonicalFrameRectWidth,
      CANONICAL_FRAME_RECT_HEIGHT: snapshot.canonicalFrameRectHeight,
      CANONICAL_FRAME_COMPUTED_VISIBLE: snapshot.canonicalFrameComputedVisible,
      CANONICAL_FRAME_COMPUTED_DISPLAY: snapshot.canonicalFrameComputedDisplay,
      CANONICAL_FRAME_COMPUTED_POSITION: snapshot.canonicalFrameComputedPosition,
      CANONICAL_FRAME_COMPUTED_OVERFLOW: snapshot.canonicalFrameComputedOverflow,
      CANONICAL_FRAME_COMPUTED_CONTAIN: snapshot.canonicalFrameComputedContain,
      CANONICAL_FRAME_COMPUTED_CONTENT_VISIBILITY: snapshot.canonicalFrameComputedContentVisibility,
      CANONICAL_FRAME_COMPUTED_WIDTH: snapshot.canonicalFrameComputedWidth,
      CANONICAL_FRAME_COMPUTED_HEIGHT: snapshot.canonicalFrameComputedHeight,

      CANONICAL_CANVAS_FOUND: Boolean(snapshot.canonicalCanvas),
      CANONICAL_CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANONICAL_CANVAS_DESCRIPTOR: canonicalSummary.descriptor || "NONE",
      CANONICAL_CANVAS_INDEX: canonicalSummary.index || 0,
      CANONICAL_CANVAS_IN_CANONICAL_MOUNT: canonicalSummary.inCanonicalMount || false,
      CANONICAL_CANVAS_IN_CANONICAL_FRAME: canonicalSummary.inCanonicalFrame || false,

      CANVAS_ELEMENT_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_DOM_SURFACE_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANVAS_MOUNT_FOUND: snapshot.canonicalMountFound,
      CANVAS_MOUNT_SELECTOR: CANONICAL_MOUNT_SELECTOR,
      CANVAS_FRAME_FOUND: snapshot.canonicalFrameFound,
      CANVAS_FRAME_SELECTOR: CANONICAL_FRAME_SELECTOR,
      CANVAS_IN_MOUNT: canonicalSummary.inCanonicalMount || false,
      CANVAS_IN_FRAME: canonicalSummary.inCanonicalFrame || false,

      CANVAS_WIDTH_ATTRIBUTE: canonicalSummary.widthAttribute || 0,
      CANVAS_HEIGHT_ATTRIBUTE: canonicalSummary.heightAttribute || 0,
      CANVAS_INTERNAL_SIZE_NONZERO: canonicalSummary.internalSizeNonzero || false,

      CANVAS_RECT_LEFT: canonicalSummary.rectLeft || 0,
      CANVAS_RECT_TOP: canonicalSummary.rectTop || 0,
      CANVAS_RECT_RIGHT: canonicalSummary.rectRight || 0,
      CANVAS_RECT_BOTTOM: canonicalSummary.rectBottom || 0,
      CANVAS_RECT_WIDTH: canonicalSummary.rectWidth || 0,
      CANVAS_RECT_HEIGHT: canonicalSummary.rectHeight || 0,
      CANVAS_RECT_NONZERO: canonicalSummary.rectNonzero || false,
      CANVAS_BUFFER_CSS_WIDTH_RATIO: canonicalSummary.bufferCssWidthRatio || 0,
      CANVAS_BUFFER_CSS_HEIGHT_RATIO: canonicalSummary.bufferCssHeightRatio || 0,

      CANVAS_COMPUTED_VISIBLE: canonicalSummary.computedVisible || false,
      CANVAS_COMPUTED_DISPLAY: canonicalSummary.computedDisplay || "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: canonicalSummary.computedVisibility || "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: canonicalSummary.computedOpacity || "UNKNOWN",
      CANVAS_COMPUTED_POSITION: canonicalSummary.computedPosition || "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: canonicalSummary.computedZIndex || "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: canonicalSummary.computedPointerEvents || "UNKNOWN",
      CANVAS_COMPUTED_TRANSFORM: canonicalSummary.computedTransform || "UNKNOWN",
      CANVAS_COMPUTED_OVERFLOW: canonicalSummary.computedOverflow || "UNKNOWN",
      CANVAS_COMPUTED_CONTAIN: canonicalSummary.computedContain || "UNKNOWN",
      CANVAS_COMPUTED_CONTENT_VISIBILITY: canonicalSummary.computedContentVisibility || "UNKNOWN",
      CANVAS_COMPUTED_WIDTH: canonicalSummary.computedWidth || "UNKNOWN",
      CANVAS_COMPUTED_HEIGHT: canonicalSummary.computedHeight || "UNKNOWN",
      CANVAS_COMPUTED_MIN_WIDTH: canonicalSummary.computedMinWidth || "UNKNOWN",
      CANVAS_COMPUTED_MIN_HEIGHT: canonicalSummary.computedMinHeight || "UNKNOWN",
      CANVAS_COMPUTED_FLEX: canonicalSummary.computedFlex || "UNKNOWN",
      CANVAS_COMPUTED_FLEX_BASIS: canonicalSummary.computedFlexBasis || "UNKNOWN",
      CANVAS_COMPUTED_BOX_SIZING: canonicalSummary.computedBoxSizing || "UNKNOWN",

      CANVAS_VIEWPORT_INTERSECTING: canonicalSummary.viewportIntersecting || false,
      CANVAS_CONTEXT_2D_READY: canonicalSummary.context2dReady || false,
      CANVAS_CONTEXT_2D_STATUS: canonicalSummary.context2dStatus || "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: canonicalSummary.pixelSampleStatus || "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_SAMPLE_READABLE: canonicalSummary.pixelSampleReadable || false,
      CANVAS_PIXEL_VISIBLE: canonicalSummary.pixelVisible || false,
      CANVAS_PIXEL_SAMPLE_COUNT: canonicalSummary.pixelSampleCount || 0,
      CANVAS_VISIBLE_PIXEL_COUNT: canonicalSummary.visiblePixelCount || 0,
      CANVAS_ALPHA_PIXEL_COUNT: canonicalSummary.alphaPixelCount || 0,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: canonicalSummary.uniqueColorCount || 0,
      CANVAS_PIXEL_AVERAGE_BRIGHTNESS: canonicalSummary.averageBrightness || 0,
      CANVAS_PIXEL_SAMPLE_REASON: canonicalSummary.pixelSampleReason || "NO_CANONICAL_CANVAS",

      CANONICAL_CANVAS_DATASET_CONTRACT: canonicalSummary.datasetContract || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_RECEIPT: canonicalSummary.datasetReceipt || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_FALLBACK: canonicalSummary.datasetFallback || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_CARTOON: canonicalSummary.datasetCartoon || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_DOWNSTREAM_OBSERVED: canonicalSummary.datasetDownstreamObserved || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_DOWNSTREAM_LATCHED: canonicalSummary.datasetDownstreamLatched || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_SELECTION_MODE: canonicalSummary.datasetSelectionMode || "UNKNOWN",
      CANONICAL_CANVAS_PIXEL_VISIBLE: canonicalSummary.pixelVisible || false,
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: snapshot.canonicalSurfaceAdmissible,

      CANONICAL_PARENT_CHAIN_STATUS: chain.status || "UNKNOWN",
      CANONICAL_PARENT_FIRST_COLLAPSED_DEPTH: chain.firstCollapsedDepth,
      CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR: chain.firstCollapsedDescriptor,
      CANONICAL_PARENT_FIRST_COLLAPSED_WIDTH: chain.firstCollapsedWidth,
      CANONICAL_PARENT_FIRST_COLLAPSED_HEIGHT: chain.firstCollapsedHeight,
      CANONICAL_PARENT_FIRST_HIDDEN_DEPTH: chain.firstHiddenDepth,
      CANONICAL_PARENT_FIRST_HIDDEN_DESCRIPTOR: chain.firstHiddenDescriptor,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DEPTH: chain.firstContainmentRiskDepth,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DESCRIPTOR: chain.firstContainmentRiskDescriptor,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTAIN: chain.firstContainmentRiskContain,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTENT_VISIBILITY:
        chain.firstContainmentRiskContentVisibility,

      MOUNT_PARENT_CHAIN_STATUS: mountChain.status || "UNKNOWN",
      MOUNT_PARENT_FIRST_COLLAPSED_DEPTH: mountChain.firstCollapsedDepth,
      MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR: mountChain.firstCollapsedDescriptor,
      MOUNT_PARENT_FIRST_HIDDEN_DEPTH: mountChain.firstHiddenDepth,
      MOUNT_PARENT_FIRST_HIDDEN_DESCRIPTOR: mountChain.firstHiddenDescriptor,

      FALLBACK_OR_CARTOON_SIGNAL_OBSERVED: snapshot.fallbackObserved,
      FALLBACK_OR_CARTOON_SIGNAL_BASIS: canonicalSummary.fallbackTextBasis || "UNKNOWN",

      CANVAS_LAYER_CHECK_STATUS: layering.status || "NOT_EVALUATED",
      CANVAS_LAYER_CENTER_ELEMENT_DESCRIPTOR: layering.centerElementDescriptor || "NONE",
      CANVAS_LAYER_CENTER_ELEMENT_IS_CANONICAL_CANVAS: layering.centerElementIsCanonicalCanvas || false,
      CANVAS_LAYER_CENTER_ELEMENT_CONTAINS_CANONICAL_CANVAS:
        layering.centerElementContainsCanonicalCanvas || false,
      CANVAS_LAYER_CANONICAL_CANVAS_CONTAINS_CENTER_ELEMENT:
        layering.canonicalCanvasContainsCenterElement || false,
      CANVAS_LAYER_POSSIBLE_BLOCKER: layering.possibleLayerBlocker || "UNKNOWN",

      TOTAL_CANVAS_COUNT: snapshot.allCanvases.length,
      PIXEL_BEARING_CANVAS_FOUND: snapshot.pixelBearingCanvasFound,
      PIXEL_BEARING_CANVAS_COUNT: snapshot.pixelBearingSummaries.length,
      PIXEL_BEARING_CANVAS_IS_CANONICAL: snapshot.pixelBearingCanvasIsCanonical,
      PIXEL_BEARING_CANVAS_SELECTOR: firstPixelBearingSummary.selector || "NONE",
      PIXEL_BEARING_CANVAS_DESCRIPTOR: firstPixelBearingSummary.descriptor || "NONE",
      PIXEL_BEARING_CANVAS_INDEX: firstPixelBearingSummary.index || 0,
      PIXEL_BEARING_CANVAS_RECT_NONZERO: firstPixelBearingSummary.rectNonzero || false,
      PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT:
        firstPixelBearingSummary.inCanonicalMount || false,
      NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT: snapshot.nonCanonicalPixelBearingCanvasCount,

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: verdict.status,
      CANVAS_SURFACE_TRUTH_LANE_STATUS: verdict.clean
        ? "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM"
        : "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: verdict.clean,

      CANVAS_TRUTH_STATUS: verdict.status,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: verdict.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: verdict.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: verdict.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: verdict.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: verdict.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: verdict.action,

      FINAL_ARBITRATION_SOURCE_LANE:
        "LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_LANE",
      DIAGNOSTIC_CERTAINTY: verdict.certainty,
      OBSERVABLE_CAUSE:
        `CANONICAL:${verdict.coordinate}:${verdict.failureClass}:${verdict.reason}`,
      RECOMMENDED_NEXT_FILE: verdict.file,
      RECOMMENDED_NEXT_ACTION: verdict.action,

      CANONICAL_CANVAS_SUMMARY: clonePlain(canonicalSummary),
      FIRST_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(firstPixelBearingSummary),
      PIXEL_BEARING_CANVAS_SUMMARIES: clonePlain(snapshot.pixelBearingSummaries),
      ALL_CANVAS_SUMMARIES: clonePlain(snapshot.allCanvasSummaries),
      CANONICAL_PARENT_CHAIN: clonePlain(snapshot.canonicalParentChain),
      MOUNT_PARENT_CHAIN: clonePlain(snapshot.mountParentChain),

      CONTROL_DUTY_LANE_STATUS: "NOT_EVALUATED_IN_V1_7_CANONICAL_SURFACE_FOCUS",
      DELEGATORY_PERMISSION_LANE_STATUS: "NOT_EVALUATED_IN_V1_7_CANONICAL_SURFACE_FOCUS",
      ROUTE_CONDUCTOR_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      HEX_SURFACE_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      TRUTH_HUB_STATUS: "CANONICAL_SURFACE_LAYOUT_MATH_CONNECTION_BLINDSPOT_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "1",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_LANE",

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
  }

  function makeErrorReport(error, payload = {}) {
    const message = bounded(error && error.message ? error.message : error, 1200);

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ERROR_PACKET_v1_7",
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
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED_WITH_INTERNAL_ERROR_PACKET",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_CANONICAL_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_ONLY",
      TARGET_CONTEXT_STATUS: "UNKNOWN",
      TARGET_CONTEXT_SOURCE: "UNKNOWN",
      TARGET_ACCESS_ERROR: "UNKNOWN",

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_SURFACE_TRUTH_LANE_STATUS: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: false,

      CANVAS_TRUTH_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "PROBE_CALL_GUARD",
      CANVAS_TRUTH_FAILURE_CLASS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FAILURE_REASON: message || "UNKNOWN_INTERNAL_ERROR",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      CANVAS_TRUTH_RECOMMENDED_FILE: FILE,
      CANVAS_TRUTH_RECOMMENDED_ACTION:
        "RENEW_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARD_OR_RETURN_PACKET",

      FINAL_ARBITRATION_SOURCE_LANE:
        "LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_LANE",
      DIAGNOSTIC_CERTAINTY: "DEFINITIVE_PROBE_INTERNAL_ERROR",
      OBSERVABLE_CAUSE: `PROBE_CALL_GUARD:${message || "UNKNOWN_INTERNAL_ERROR"}`,
      RECOMMENDED_NEXT_FILE: FILE,
      RECOMMENDED_NEXT_ACTION:
        "RENEW_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARD_OR_RETURN_PACKET",

      CALL_GUARD_ACTIVE: true,
      CALL_GUARD_CAUGHT_ERROR: message || "UNKNOWN_INTERNAL_ERROR",
      PAYLOAD_KEYS: isObject(payload)
        ? Object.keys(payload).join(",") || "NONE"
        : "NON_OBJECT_PAYLOAD",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V1_7_CALL_GUARD_RETURNED_ERROR_PACKET | NO_THROW_TO_NORTH | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "CALL_GUARD_PREVENTED_CHRONOLOGY_HARD_FAILURE",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function scheduleSettledSample(payload) {
    if (settledSampleScheduled) return;
    settledSampleScheduled = true;

    const run = () => {
      try {
        const snapshot = captureSurfaceSnapshot(payload, "SETTLED_PASSIVE_DELAYED");
        const report = buildReportFromSnapshot(snapshot, "SETTLED_PASSIVE_DELAYED");
        const comparison = compareImmediateToSettled(lastReport, report);

        report.TRANSITION_SETTLED_SAMPLE_AVAILABLE = true;
        report.TRANSITION_COMPARISON_STATUS = comparison.status;
        report.TRANSITION_COMPARISON_CLASS = comparison.class;
        report.TRANSITION_COMPARISON_REASON = comparison.reason;

        lastSettledReport = clonePlain(report);

        root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
          clonePlain(lastSettledReport);
        root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
          clonePlain(lastSettledReport);

        publish();
      } catch (error) {
        lastSettledReport = makeErrorReport(error, payload);
        publish();
      }
    };

    try {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => {
          try {
            root.setTimeout(run, 280);
          } catch (_error) {
            run();
          }
        });
      } else if (isFunction(root.setTimeout)) {
        root.setTimeout(run, 280);
      }
    } catch (_error) {}
  }

  function inspectSurface(payload = {}) {
    try {
      const snapshot = captureSurfaceSnapshot(payload, "IMMEDIATE_SYNC");
      const report = buildReportFromSnapshot(snapshot, "IMMEDIATE_SYNC");

      lastReport = clonePlain(report);
      lastReceipt = buildReceipt(lastReport);
      lastPacketText = composePacketText(lastReport);
      lastCompactSummary = composeCompactSummary(lastReport);

      scheduleSettledSample(payload);
      publish();

      return clonePlain(report);
    } catch (error) {
      const report = makeErrorReport(error, payload);

      lastReport = clonePlain(report);
      lastReceipt = buildReceipt(lastReport);
      lastPacketText = composePacketText(lastReport);
      lastCompactSummary = composeCompactSummary(lastReport);

      publish();

      return clonePlain(report);
    }
  }

  function makeAnchorReport() {
    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ANCHOR_PACKET_v1_7",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_V1_5_CONTRACT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "ANCHOR_READY",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "UNKNOWN",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_CANONICAL_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_ONLY",
      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

      TRANSITION_MEASUREMENT_MODE: "ANCHOR_ONLY",
      TRANSITION_SAMPLE_PHASE: "ANCHOR_ONLY",
      TRANSITION_SETTLED_SAMPLE_SCHEDULED: false,
      TRANSITION_SETTLED_SAMPLE_AVAILABLE: false,
      TRANSITION_COMPARISON_STATUS: "NOT_RUN",
      TRANSITION_COMPARISON_CLASS: "NOT_RUN",
      TRANSITION_COMPARISON_REASON: "ANCHOR_ONLY",

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

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V1_7_ANCHOR_READY | CALL_GUARDED | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
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
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_RECEIPT_PACKET_v1_7",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageV15Contract: LINEAGE_V1_5_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      callGuardActive: true,
      layoutMathArbitrationActive: true,
      connectionArbitrationActive: true,
      blindSpotArbitrationActive: true,
      canonicalVisibleSurfaceDisambiguationActive: true,
      transitionSurfaceDisambiguationActive: true,
      flashToFallbackMeasurementActive: true,
      focusedOnCanonicalCanvasIdentity: true,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      transitionMeasurementMode: getRaw(r, "TRANSITION_MEASUREMENT_MODE", "UNKNOWN"),
      transitionSamplePhase: getRaw(r, "TRANSITION_SAMPLE_PHASE", "UNKNOWN"),
      transitionSettledSampleScheduled: getRaw(r, "TRANSITION_SETTLED_SAMPLE_SCHEDULED", false),
      transitionSettledSampleAvailable: Boolean(lastSettledReport),
      transitionComparisonStatus: getRaw(r, "TRANSITION_COMPARISON_STATUS", "UNKNOWN"),
      transitionComparisonClass: getRaw(r, "TRANSITION_COMPARISON_CLASS", "UNKNOWN"),
      transitionComparisonReason: getRaw(r, "TRANSITION_COMPARISON_REASON", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),
      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),

      canonicalMountFound: getRaw(r, "CANONICAL_MOUNT_FOUND", "UNKNOWN"),
      canonicalMountRectNonzero: getRaw(r, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN"),
      canonicalFrameFound: getRaw(r, "CANONICAL_FRAME_FOUND", "UNKNOWN"),
      canonicalFrameRectNonzero: getRaw(r, "CANONICAL_FRAME_RECT_NONZERO", "UNKNOWN"),
      canonicalCanvasFound: getRaw(r, "CANONICAL_CANVAS_FOUND", "UNKNOWN"),
      canonicalCanvasSelector: getRaw(r, "CANONICAL_CANVAS_SELECTOR", "UNKNOWN"),
      canonicalCanvasDescriptor: getRaw(r, "CANONICAL_CANVAS_DESCRIPTOR", "UNKNOWN"),
      canonicalCanvasSurfaceAdmissible: getRaw(r, "CANONICAL_CANVAS_SURFACE_ADMISSIBLE", "UNKNOWN"),

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", "UNKNOWN"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", "UNKNOWN"),
      canvasInFrame: getRaw(r, "CANVAS_IN_FRAME", "UNKNOWN"),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", "UNKNOWN"),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN"),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN"),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", "UNKNOWN"),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", "UNKNOWN"),

      canonicalParentChainStatus: getRaw(r, "CANONICAL_PARENT_CHAIN_STATUS", "UNKNOWN"),
      canonicalParentFirstCollapsedDescriptor:
        getRaw(r, "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),
      mountParentChainStatus: getRaw(r, "MOUNT_PARENT_CHAIN_STATUS", "UNKNOWN"),
      mountParentFirstCollapsedDescriptor:
        getRaw(r, "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),

      fallbackOrCartoonSignalObserved: getRaw(r, "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED", "UNKNOWN"),
      canvasLayerCheckStatus: getRaw(r, "CANVAS_LAYER_CHECK_STATUS", "UNKNOWN"),
      canvasLayerPossibleBlocker: getRaw(r, "CANVAS_LAYER_POSSIBLE_BLOCKER", "UNKNOWN"),

      pixelBearingCanvasFound: getRaw(r, "PIXEL_BEARING_CANVAS_FOUND", "UNKNOWN"),
      pixelBearingCanvasCount: getRaw(r, "PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),
      pixelBearingCanvasIsCanonical: getRaw(r, "PIXEL_BEARING_CANVAS_IS_CANONICAL", "UNKNOWN"),
      nonCanonicalPixelBearingCanvasCount:
        getRaw(r, "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),

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

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getSettledReportApiAvailable: true,
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
      "LINEAGE_V1_5_CONTRACT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "HTML_FILE",
      "INDEX_FILE",
      "ROUTE_CONDUCTOR_FILE",
      "CONTROL_FILE",
      "CANVAS_FILE",
      "HEX_AUTHORITY_FILE",
      "HEX_SURFACE_FILE",
      "POINTER_FINGER_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_CANVAS_RENEWAL_CANDIDATE",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "CANVAS_SURFACE_TRUTH_SCOPE",
      "CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS",

      "TRANSITION_MEASUREMENT_MODE",
      "TRANSITION_SAMPLE_PHASE",
      "TRANSITION_SETTLED_SAMPLE_SCHEDULED",
      "TRANSITION_SETTLED_SAMPLE_AVAILABLE",
      "TRANSITION_COMPARISON_STATUS",
      "TRANSITION_COMPARISON_CLASS",
      "TRANSITION_COMPARISON_REASON",

      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",
      "TARGET_ACCESS_ERROR",

      "INDEX_SCRIPT_PRESENT",
      "INDEX_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_PRESENT",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",
      "CONTROL_SCRIPT_PRESENT",
      "CONTROL_SCRIPT_SRC",
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

      "ROUTE_AUTHORITY_OBSERVED",
      "ROUTE_AUTHORITY_SOURCE_PATH",
      "ROUTE_AUTHORITY_CONTRACT",
      "ROUTE_AUTHORITY_RECEIPT",

      "HEX_SURFACE_AUTHORITY_OBSERVED",
      "HEX_SURFACE_AUTHORITY_SOURCE_PATH",
      "HEX_SURFACE_AUTHORITY_CONTRACT",
      "HEX_SURFACE_AUTHORITY_RECEIPT",

      "STAGE_PRESENT",
      "STAGE_SELECTOR",
      "STAGE_DESCRIPTOR",
      "STAGE_RECT_NONZERO",
      "STAGE_RECT_WIDTH",
      "STAGE_RECT_HEIGHT",

      "CANONICAL_MOUNT_SELECTOR",
      "CANONICAL_FRAME_SELECTOR",
      "CANONICAL_CANVAS_ID",
      "CANONICAL_CANVAS_SELECTORS",

      "CANONICAL_MOUNT_FOUND",
      "CANONICAL_MOUNT_DESCRIPTOR",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_MOUNT_RECT_WIDTH",
      "CANONICAL_MOUNT_RECT_HEIGHT",
      "CANONICAL_MOUNT_COMPUTED_VISIBLE",
      "CANONICAL_MOUNT_COMPUTED_DISPLAY",
      "CANONICAL_MOUNT_COMPUTED_POSITION",
      "CANONICAL_MOUNT_COMPUTED_OVERFLOW",
      "CANONICAL_MOUNT_COMPUTED_CONTAIN",
      "CANONICAL_MOUNT_COMPUTED_CONTENT_VISIBILITY",
      "CANONICAL_MOUNT_COMPUTED_WIDTH",
      "CANONICAL_MOUNT_COMPUTED_HEIGHT",

      "CANONICAL_FRAME_FOUND",
      "CANONICAL_FRAME_DESCRIPTOR",
      "CANONICAL_FRAME_RECT_NONZERO",
      "CANONICAL_FRAME_RECT_WIDTH",
      "CANONICAL_FRAME_RECT_HEIGHT",
      "CANONICAL_FRAME_COMPUTED_VISIBLE",
      "CANONICAL_FRAME_COMPUTED_DISPLAY",
      "CANONICAL_FRAME_COMPUTED_POSITION",
      "CANONICAL_FRAME_COMPUTED_OVERFLOW",
      "CANONICAL_FRAME_COMPUTED_CONTAIN",
      "CANONICAL_FRAME_COMPUTED_CONTENT_VISIBILITY",
      "CANONICAL_FRAME_COMPUTED_WIDTH",
      "CANONICAL_FRAME_COMPUTED_HEIGHT",

      "CANONICAL_CANVAS_FOUND",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CANVAS_DESCRIPTOR",
      "CANONICAL_CANVAS_INDEX",
      "CANONICAL_CANVAS_IN_CANONICAL_MOUNT",
      "CANONICAL_CANVAS_IN_CANONICAL_FRAME",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_DOM_SURFACE_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_FRAME_FOUND",
      "CANVAS_FRAME_SELECTOR",
      "CANVAS_IN_MOUNT",
      "CANVAS_IN_FRAME",

      "CANVAS_WIDTH_ATTRIBUTE",
      "CANVAS_HEIGHT_ATTRIBUTE",
      "CANVAS_INTERNAL_SIZE_NONZERO",
      "CANVAS_RECT_LEFT",
      "CANVAS_RECT_TOP",
      "CANVAS_RECT_RIGHT",
      "CANVAS_RECT_BOTTOM",
      "CANVAS_RECT_WIDTH",
      "CANVAS_RECT_HEIGHT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_BUFFER_CSS_WIDTH_RATIO",
      "CANVAS_BUFFER_CSS_HEIGHT_RATIO",

      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_COMPUTED_DISPLAY",
      "CANVAS_COMPUTED_VISIBILITY",
      "CANVAS_COMPUTED_OPACITY",
      "CANVAS_COMPUTED_POSITION",
      "CANVAS_COMPUTED_Z_INDEX",
      "CANVAS_COMPUTED_POINTER_EVENTS",
      "CANVAS_COMPUTED_TRANSFORM",
      "CANVAS_COMPUTED_OVERFLOW",
      "CANVAS_COMPUTED_CONTAIN",
      "CANVAS_COMPUTED_CONTENT_VISIBILITY",
      "CANVAS_COMPUTED_WIDTH",
      "CANVAS_COMPUTED_HEIGHT",
      "CANVAS_COMPUTED_MIN_WIDTH",
      "CANVAS_COMPUTED_MIN_HEIGHT",
      "CANVAS_COMPUTED_FLEX",
      "CANVAS_COMPUTED_FLEX_BASIS",
      "CANVAS_COMPUTED_BOX_SIZING",

      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_SAMPLE_READABLE",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_AVERAGE_BRIGHTNESS",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "CANONICAL_CANVAS_DATASET_CONTRACT",
      "CANONICAL_CANVAS_DATASET_RECEIPT",
      "CANONICAL_CANVAS_DATASET_FALLBACK",
      "CANONICAL_CANVAS_DATASET_CARTOON",
      "CANONICAL_CANVAS_DATASET_DOWNSTREAM_OBSERVED",
      "CANONICAL_CANVAS_DATASET_DOWNSTREAM_LATCHED",
      "CANONICAL_CANVAS_DATASET_SELECTION_MODE",
      "CANONICAL_CANVAS_PIXEL_VISIBLE",
      "CANONICAL_CANVAS_SURFACE_ADMISSIBLE",

      "CANONICAL_PARENT_CHAIN_STATUS",
      "CANONICAL_PARENT_FIRST_COLLAPSED_DEPTH",
      "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR",
      "CANONICAL_PARENT_FIRST_COLLAPSED_WIDTH",
      "CANONICAL_PARENT_FIRST_COLLAPSED_HEIGHT",
      "CANONICAL_PARENT_FIRST_HIDDEN_DEPTH",
      "CANONICAL_PARENT_FIRST_HIDDEN_DESCRIPTOR",
      "CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DEPTH",
      "CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DESCRIPTOR",
      "CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTAIN",
      "CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTENT_VISIBILITY",

      "MOUNT_PARENT_CHAIN_STATUS",
      "MOUNT_PARENT_FIRST_COLLAPSED_DEPTH",
      "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR",
      "MOUNT_PARENT_FIRST_HIDDEN_DEPTH",
      "MOUNT_PARENT_FIRST_HIDDEN_DESCRIPTOR",

      "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED",
      "FALLBACK_OR_CARTOON_SIGNAL_BASIS",
      "CANVAS_LAYER_CHECK_STATUS",
      "CANVAS_LAYER_CENTER_ELEMENT_DESCRIPTOR",
      "CANVAS_LAYER_CENTER_ELEMENT_IS_CANONICAL_CANVAS",
      "CANVAS_LAYER_CENTER_ELEMENT_CONTAINS_CANONICAL_CANVAS",
      "CANVAS_LAYER_CANONICAL_CANVAS_CONTAINS_CENTER_ELEMENT",
      "CANVAS_LAYER_POSSIBLE_BLOCKER",

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
      "ROUTE_CONDUCTOR_LANE_STATUS",
      "HEX_SURFACE_LANE_STATUS",
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
      line("TRANSITION_COMPARISON_STATUS", getRaw(report, "TRANSITION_COMPARISON_STATUS", "UNKNOWN")),
      line("CANVAS_IDENTITY_DISAMBIGUATION_STATUS", getRaw(report, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "UNKNOWN")),
      line("CANONICAL_MOUNT_FOUND", getRaw(report, "CANONICAL_MOUNT_FOUND", "UNKNOWN")),
      line("CANONICAL_MOUNT_RECT_NONZERO", getRaw(report, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN")),
      line("CANONICAL_FRAME_FOUND", getRaw(report, "CANONICAL_FRAME_FOUND", "UNKNOWN")),
      line("CANONICAL_FRAME_RECT_NONZERO", getRaw(report, "CANONICAL_FRAME_RECT_NONZERO", "UNKNOWN")),
      line("CANONICAL_CANVAS_FOUND", getRaw(report, "CANONICAL_CANVAS_FOUND", "UNKNOWN")),
      line("CANVAS_IN_MOUNT", getRaw(report, "CANVAS_IN_MOUNT", "UNKNOWN")),
      line("CANVAS_IN_FRAME", getRaw(report, "CANVAS_IN_FRAME", "UNKNOWN")),
      line("CANVAS_RECT_NONZERO", getRaw(report, "CANVAS_RECT_NONZERO", "UNKNOWN")),
      line("CANVAS_COMPUTED_VISIBLE", getRaw(report, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN")),
      line("CANVAS_VIEWPORT_INTERSECTING", getRaw(report, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN")),
      line("CANVAS_CONTEXT_2D_READY", getRaw(report, "CANVAS_CONTEXT_2D_READY", "UNKNOWN")),
      line("CANVAS_PIXEL_VISIBLE", getRaw(report, "CANVAS_PIXEL_VISIBLE", "UNKNOWN")),
      line("CANONICAL_PARENT_CHAIN_STATUS", getRaw(report, "CANONICAL_PARENT_CHAIN_STATUS", "UNKNOWN")),
      line("CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR", getRaw(report, "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN")),
      line("PIXEL_BEARING_CANVAS_IS_CANONICAL", getRaw(report, "PIXEL_BEARING_CANVAS_IS_CANONICAL", "UNKNOWN")),
      line("CANVAS_LAYER_POSSIBLE_BLOCKER", getRaw(report, "CANVAS_LAYER_POSSIBLE_BLOCKER", "UNKNOWN")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_REASON", getRaw(report, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN")),
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

  function getSettledReport() {
    return clonePlain(lastSettledReport || {});
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
      settledReport: clonePlain(lastSettledReport || {}),
      canonicalCanvasSummary: clonePlain(getRaw(report, "CANONICAL_CANVAS_SUMMARY", {})),
      firstPixelBearingCanvasSummary: clonePlain(getRaw(report, "FIRST_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      pixelBearingCanvasSummaries: clonePlain(getRaw(report, "PIXEL_BEARING_CANVAS_SUMMARIES", [])),
      allCanvasSummaries: clonePlain(getRaw(report, "ALL_CANVAS_SUMMARIES", [])),
      canonicalParentChain: clonePlain(getRaw(report, "CANONICAL_PARENT_CHAIN", [])),
      mountParentChain: clonePlain(getRaw(report, "MOUNT_PARENT_CHAIN", [])),
      canvasAuthorityCandidates: clonePlain(getRaw(report, "CANVAS_AUTHORITY_CANDIDATES", [])),
      canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS.slice(),
      canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES.slice(),
      routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES.slice(),
      hexSurfaceAliases: HEX_SURFACE_ALIASES.slice(),
      supportsCallGuardedReturnPacket: true,
      supportsLayoutMathArbitration: true,
      supportsConnectionArbitration: true,
      supportsBlindSpotArbitration: true,
      supportsCanonicalVisibleSurfaceDisambiguation: true,
      supportsTransitionSurfaceDisambiguation: true,
      supportsFlashToFallbackMeasurement: true,
      supportsPixelBearingCanvasIdentityCheck: true,
      supportsCanonicalZeroRectCheck: true,
      supportsParentChainCollapseCheck: true,
      supportsCanonicalBlankPixelCheck: true,
      supportsLayerBlockerCheck: true,
      supportsFallbackCartoonSignalCheck: true,
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
    if (!lastCompactSummary) {
      lastCompactSummary = composeCompactSummary(lastReport || makeAnchorReport());
    }

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
      "HEARTH.diagnosticCanvasLayoutMathConnectionBlindspot",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
      "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanonicalCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasLayoutMathConnectionBlindspot",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT"
    ];

    for (const path of aliasPaths) setPath(path, api);

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_REPORT =
      clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY =
      lastCompactSummary || "";

    if (lastSettledReport) {
      root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
    }

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
        root.document.documentElement.dataset.hearthDiagnosticCanvasTransitionComparisonStatus =
          getRaw(lastReport || {}, "TRANSITION_COMPARISON_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasLayoutMathCoordinate =
          getRaw(lastReport || {}, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "ANCHOR_READY");
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
    lineageV15Contract: LINEAGE_V1_5_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    callGuardActive: true,
    layoutMathArbitrationActive: true,
    connectionArbitrationActive: true,
    blindSpotArbitrationActive: true,
    canonicalVisibleSurfaceDisambiguationActive: true,
    transitionSurfaceDisambiguationActive: true,
    flashToFallbackMeasurementActive: true,
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
    getSettledReport,
    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getPacketText,
    getCompactSummary,
    getStatusText,

    canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
    canonicalFrameSelector: CANONICAL_FRAME_SELECTOR,
    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS,
    canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES,
    routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES,
    hexSurfaceAliases: HEX_SURFACE_ALIASES,

    supportsCallGuardedReturnPacket: true,
    supportsLayoutMathArbitration: true,
    supportsConnectionArbitration: true,
    supportsBlindSpotArbitration: true,
    supportsCanonicalVisibleSurfaceDisambiguation: true,
    supportsTransitionSurfaceDisambiguation: true,
    supportsFlashToFallbackMeasurement: true,
    supportsPixelBearingCanvasIdentityCheck: true,
    supportsCanonicalZeroRectCheck: true,
    supportsParentChainCollapseCheck: true,
    supportsCanonicalBlankPixelCheck: true,
    supportsLayerBlockerCheck: true,
    supportsFallbackCartoonSignalCheck: true,
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
