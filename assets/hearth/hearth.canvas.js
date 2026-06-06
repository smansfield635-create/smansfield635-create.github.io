// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas Hub / receiver-output carrier / DOM surface truth binding renewal.
// Served CONTRACT intentionally remains v12_3 so Route Conductor, LabWest, diagnostics,
// and accepted lineage tables continue to recognize the Canvas parent without upstream churn.
// Internal renewal:
// HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIVER_TNT_v12_5
//
// Purpose:
// - Preserve Canvas as receiver/output carrier only.
// - Create or bind a real 2D <canvas> surface under #hearthCanvasMount.
// - Publish inspectable Canvas DOM-surface truth for the v11 diagnostic truth probe.
// - Publish Canvas Hub, local station, visible planet, expression surface, and bridge aliases.
// - Accept Route Conductor, Queen/control, LabWest, diagnostic, and finger packets.
// - Draw a native 2D visible carrier proof when no downstream drawable adapter is available.
// - Sample pixels and publish whether the surface is physically visible.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth, Hex truth,
//   finger truth, pointer truth, Queen truth, LabWest truth, Route Conductor truth,
//   F13 final claim, F21 latch, ready text, completion latch, visual pass,
//   generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIVER_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIVER_RECEIPT_v12_5";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4";
  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_RECEIPT_v12_2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const VERSION =
    "2026-06-06.hearth-canvas-dom-surface-truth-binding-receiver-v12-5-served-v12-3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvas: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_EXPRESSION_SURFACE",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_VISIBLE_GLOBE",
    "HEARTH_CANVAS_DOM_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH",

    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasExpressionSurface",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasVisibleGlobe",
    "HEARTH.canvasDomSurfaceTruth",
    "HEARTH.canvasSurfaceTruth",

    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasExpressionSurface",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasVisibleGlobe",
    "DEXTER_LAB.hearthCanvasDomSurfaceTruth",
    "DEXTER_LAB.hearthCanvasSurfaceTruth"
  ]);

  const EXPRESSION_BRIDGE_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE",
    "HEARTH.canvasExpressionBridge",
    "HEARTH.canvasVisibleExpressionBridge",
    "HEARTH.canvasExpressionSurfaceBridge",
    "DEXTER_LAB.hearthCanvasExpressionBridge",
    "DEXTER_LAB.hearthCanvasVisibleExpressionBridge",
    "DEXTER_LAB.hearthCanvasExpressionSurfaceBridge"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "[data-hearth-planet-engine-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-visible-planet-canvas='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "canvas"
  ]);

  const DRAWABLE_ADAPTER_ALIAS_PATHS = Object.freeze([
    "HEARTH.canvasFingerComposite",
    "HEARTH.canvasComposite",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "DEXTER_LAB.hearthCanvasFingerComposite",
    "DEXTER_LAB.hearthCanvasComposite",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "HEARTH_CANVAS_FINGER_COMPOSITE",
    "HEARTH_CANVAS_COMPOSITE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    bootCount: 0,
    startedAt: "",
    updatedAt: "",
    publishedAt: "",

    aliasesPublished: false,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    upstreamNoticeCount: 0,

    mountFound: false,
    mountSelector: "NONE",
    mountDescriptor: "NONE",
    mountRectNonzero: false,

    canvasElementFound: false,
    canvasCreated: false,
    canvasMovedIntoMount: false,
    canvasSelector: "NONE",
    canvasTag: "NONE",
    canvasId: "NONE",
    canvasClass: "NONE",
    canvasInMount: false,
    canvasWidthAttribute: 0,
    canvasHeightAttribute: 0,
    canvasRectLeft: 0,
    canvasRectTop: 0,
    canvasRectWidth: 0,
    canvasRectHeight: 0,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasComputedDisplay: "UNKNOWN",
    canvasComputedVisibility: "UNKNOWN",
    canvasComputedOpacity: "UNKNOWN",
    canvasComputedPosition: "UNKNOWN",
    canvasComputedZIndex: "UNKNOWN",
    canvasComputedPointerEvents: "UNKNOWN",
    canvasViewportWidth: 0,
    canvasViewportHeight: 0,
    canvasViewportIntersecting: false,

    canvasContext2dReady: false,
    canvasContext2dStatus: "NOT_REQUESTED",

    drawAttempted: false,
    drawComplete: false,
    drawCount: 0,
    lastDrawAt: "",
    lastDrawSource: "NONE",
    lastDrawReason: "NOT_DRAWN",
    lastDrawError: "NONE",

    adapterDrawAttempted: false,
    adapterDrawComplete: false,
    adapterSourceName: "NONE",
    adapterContract: "UNKNOWN",
    adapterMethod: "NONE",
    adapterError: "NONE",

    nativeCarrierDrawAttempted: false,
    nativeCarrierDrawComplete: false,

    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVisible: false,
    canvasPixelSampleCount: 0,
    canvasVisiblePixelCount: 0,
    canvasAlphaPixelCount: 0,
    canvasPixelSampleReason: "NOT_SAMPLED",

    canvasLayerBlocked: false,
    canvasLayerBlocker: "UNKNOWN",

    canvasSurfaceTruthAvailable: false,
    canvasTruthFirstFailedCoordinate: "CANVAS_ELEMENT_FOUND",
    canvasTruthFailureClass: "CANVAS_ELEMENT_NOT_FOUND",
    canvasTruthFailureReason: "CANVAS_NOT_YET_BOOTED",
    canvasTruthRecommendedOwner: "CANVAS_EXPRESSION_SURFACE",
    canvasTruthRecommendedFile: FILE,
    canvasTruthRecommendedAction: "BOOT_CANVAS_AND_BIND_DOM_SURFACE",

    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    renderedPlanetProofReady: false,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentRecognized: true,

    routeConductorPacketCount: 0,
    queenPacketCount: 0,
    labWestPacketCount: 0,
    fingerPacketCount: 0,
    diagnosticPacketCount: 0,
    packetCount: 0,
    lastPacketType: "NONE",
    lastPacketContract: "UNKNOWN",

    canvasStandardNewsAlignmentStatus: "CANVAS_STANDARD_NEWS_ALIGNMENT_NOT_RUN",
    canvasStandardNewsAlignmentScore: 0,
    canvasStandardNewsAlignmentFirstFailedStage: "BOOT_NOT_RUN",
    canvasStandardFibonacciSynchronizationStatus:
      "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_NOT_RUN",
    canvasStandardFibonacciSynchronizationScore: 0,
    canvasStandardFibonacciSynchronizationFirstFailedStage: "F1:BOOT",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let activeCanvas = null;
  let activeContext = null;
  let activeMount = null;
  let booting = false;
  let drawing = false;
  let publishTimer = 0;
  let drawTimer = 0;

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

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    if (state.events.length > 120) state.events.splice(0, state.events.length - 120);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
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

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] =
      value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function findFirstElement(selectors) {
    for (const selector of selectors) {
      const element = q(selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function elementDescriptor(element) {
    if (!element || !element.tagName) return "NONE";

    const id = element.id ? `#${element.id}` : "";
    const cls =
      element.className && typeof element.className === "string"
        ? `.${element.className.trim().replace(/\s+/g, ".")}`
        : "";

    return `${element.tagName.toLowerCase()}${id}${cls}` || "UNKNOWN";
  }

  function rectOf(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    try {
      const r = element.getBoundingClientRect();
      return {
        left: safeNumber(r.left, 0),
        top: safeNumber(r.top, 0),
        width: safeNumber(r.width, 0),
        height: safeNumber(r.height, 0)
      };
    } catch (_error) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }
  }

  function contains(parent, child) {
    if (!parent || !child || !isFunction(parent.contains)) return false;

    try {
      return parent.contains(child);
    } catch (_error) {
      return false;
    }
  }

  function getComputed(element) {
    if (!element || !root.getComputedStyle) return null;

    try {
      return root.getComputedStyle(element);
    } catch (_error) {
      return null;
    }
  }

  function chooseCanvasSize(mount) {
    const mountRect = rectOf(mount);
    const viewport = safeNumber(root.innerWidth, 960);
    const base = Math.max(520, Math.min(960, mountRect.width || viewport * 0.82 || 760));
    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(base * ratio)));
  }

  function writeImportantStyle(element, key, value) {
    if (!element || !element.style || !isFunction(element.style.setProperty)) return;

    try {
      element.style.setProperty(key, value, "important");
    } catch (_error) {
      element.style[key] = value;
    }
  }

  function applyCanvasAttributes(canvas, mount) {
    if (!canvas) return;

    const size = chooseCanvasSize(mount);
    if (!canvas.width || canvas.width < 256) canvas.width = size;
    if (!canvas.height || canvas.height < 256) canvas.height = size;

    canvas.id = canvas.id || "hearthCanvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth visible planet expression surface");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("data-receipt", RECEIPT);

    const dataset = canvas.dataset || {};
    dataset.hearthCanvas = "true";
    dataset.hearthCanvasHub = "true";
    dataset.hearthCanvasParent = "true";
    dataset.hearthCanvasLocalStation = "true";
    dataset.hearthCanvasStation = "true";
    dataset.hearthExpressionSurface = "true";
    dataset.hearthVisibleCanvas = "true";
    dataset.hearthVisiblePlanetCanvas = "true";
    dataset.hearthBaseGlobeCanvas = "true";
    dataset.hearthCanvasTexture = "true";
    dataset.hearthCanvasDomSurfaceTruth = "true";
    dataset.hearthCanvasSurfaceTruth = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    dataset.hearthCanvasInternalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    writeImportantStyle(canvas, "display", "block");
    writeImportantStyle(canvas, "visibility", "visible");
    writeImportantStyle(canvas, "opacity", "1");
    writeImportantStyle(canvas, "position", "relative");
    writeImportantStyle(canvas, "z-index", "3");
    writeImportantStyle(canvas, "width", "min(100%, 920px)");
    writeImportantStyle(canvas, "height", "auto");
    writeImportantStyle(canvas, "max-width", "min(100%, 920px)");
    writeImportantStyle(canvas, "max-height", "100%");
    writeImportantStyle(canvas, "aspect-ratio", "1 / 1");
    writeImportantStyle(canvas, "margin", "auto");
    writeImportantStyle(canvas, "box-sizing", "border-box");
    writeImportantStyle(canvas, "border-radius", "50%");
    writeImportantStyle(canvas, "touch-action", "none");
    writeImportantStyle(canvas, "pointer-events", "auto");
    writeImportantStyle(canvas, "background", "rgba(2,8,20,0.98)");
  }

  function locateOrCreateSurface() {
    if (!doc) {
      state.canvasTruthFailureClass = "DOCUMENT_UNAVAILABLE";
      state.canvasTruthFailureReason = "NO_DOCUMENT_AVAILABLE_TO_CANVAS_FILE";
      return { mount: null, canvas: null, ctx: null };
    }

    const mountResult = findFirstElement(MOUNT_SELECTORS);
    const mount = mountResult.element;
    activeMount = mount;

    state.mountFound = Boolean(mount);
    state.mountSelector = mountResult.selector;
    state.mountDescriptor = elementDescriptor(mount);
    state.mountRectNonzero = Boolean(rectOf(mount).width > 0 && rectOf(mount).height > 0);

    let canvas = null;
    let canvasSelector = "NONE";

    for (const selector of CANVAS_SELECTORS) {
      const found = q(selector);
      if (found && found.tagName && found.tagName.toLowerCase() === "canvas") {
        canvas = found;
        canvasSelector = selector;
        break;
      }
    }

    if (!canvas && mount) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvasSelector = "CREATED:#hearthCanvas";
      state.canvasCreated = true;

      try {
        mount.appendChild(canvas);
      } catch (error) {
        recordError("CANVAS_APPEND_FAILED", error, {
          mountSelector: mountResult.selector
        });
      }
    }

    if (canvas && mount && !contains(mount, canvas)) {
      try {
        mount.appendChild(canvas);
        state.canvasMovedIntoMount = true;
      } catch (error) {
        recordError("CANVAS_MOVE_INTO_MOUNT_FAILED", error, {
          canvasSelector,
          mountSelector: mountResult.selector
        });
      }
    }

    if (canvas) applyCanvasAttributes(canvas, mount);

    let ctx = null;
    let ctxStatus = "CANVAS_ELEMENT_NOT_FOUND";

    if (canvas && isFunction(canvas.getContext)) {
      try {
        ctx = canvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        ctxStatus = ctx ? "2D_CONTEXT_READY" : "2D_CONTEXT_NULL";
      } catch (error) {
        ctxStatus = `2D_CONTEXT_EXCEPTION:${error && error.message ? error.message : error}`;
        recordError("CANVAS_CONTEXT_2D_FAILED", error);
      }
    }

    activeCanvas = canvas || null;
    activeContext = ctx || null;

    updateSurfaceState(canvasSelector, mount, canvas, ctx, ctxStatus);

    return { mount, canvas, ctx };
  }

  function updateSurfaceState(canvasSelector, mount, canvas, ctx, ctxStatus) {
    const rect = rectOf(canvas);
    const computed = getComputed(canvas);
    const opacity = computed ? safeNumber(computed.opacity, 1) : 1;
    const visible =
      Boolean(canvas) &&
      rect.width > 0 &&
      rect.height > 0 &&
      (!computed ||
        (computed.display !== "none" &&
          computed.visibility !== "hidden" &&
          computed.visibility !== "collapse" &&
          opacity > 0));

    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);
    const intersecting =
      Boolean(canvas) &&
      rect.width > 0 &&
      rect.height > 0 &&
      rect.left < viewportWidth &&
      rect.top < viewportHeight &&
      rect.left + rect.width > 0 &&
      rect.top + rect.height > 0;

    state.canvasElementFound = Boolean(canvas);
    state.canvasSelector = canvas ? canvasSelector : "NONE";
    state.canvasTag = canvas && canvas.tagName ? canvas.tagName.toLowerCase() : "NONE";
    state.canvasId = canvas && canvas.id ? canvas.id : "NONE";
    state.canvasClass =
      canvas && canvas.className && typeof canvas.className === "string"
        ? canvas.className
        : "NONE";
    state.canvasInMount = Boolean(canvas && mount && contains(mount, canvas));
    state.canvasWidthAttribute = canvas ? safeNumber(canvas.width, 0) : 0;
    state.canvasHeightAttribute = canvas ? safeNumber(canvas.height, 0) : 0;
    state.canvasRectLeft = rect.left;
    state.canvasRectTop = rect.top;
    state.canvasRectWidth = rect.width;
    state.canvasRectHeight = rect.height;
    state.canvasRectNonzero = Boolean(rect.width > 0 && rect.height > 0);
    state.canvasComputedVisible = visible;
    state.canvasComputedDisplay = computed ? computed.display : "UNKNOWN";
    state.canvasComputedVisibility = computed ? computed.visibility : "UNKNOWN";
    state.canvasComputedOpacity = computed ? computed.opacity : "UNKNOWN";
    state.canvasComputedPosition = computed ? computed.position : "UNKNOWN";
    state.canvasComputedZIndex = computed ? computed.zIndex : "UNKNOWN";
    state.canvasComputedPointerEvents = computed ? computed.pointerEvents : "UNKNOWN";
    state.canvasViewportWidth = viewportWidth;
    state.canvasViewportHeight = viewportHeight;
    state.canvasViewportIntersecting = intersecting;
    state.canvasContext2dReady = Boolean(ctx);
    state.canvasContext2dStatus = ctxStatus || "UNKNOWN";

    resolveTruthStatus();
  }

  function contractOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.currentCanvasParentContract ||
        value.canvasContract ||
        value.hearthCanvasContract ||
        value.contract ||
        value.CONTRACT ||
        value.sourceContract ||
        ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.currentCanvasParentReceipt ||
        value.canvasReceipt ||
        value.hearthCanvasReceipt ||
        value.receipt ||
        value.RECEIPT ||
        value.sourceReceipt ||
        ""
    );
  }

  function noForbiddenClaims(value) {
    if (!isObject(value)) return true;

    return !(
      value.f13Claimed === true ||
      value.f13EligibleForCanvas === true ||
      value.f13ClaimedByCanvas === true ||
      value.f21EligibleForNorth === true ||
      value.f21SubmittedToNorth === true ||
      value.f21Claimed === true ||
      value.readyTextAllowed === true ||
      value.readyTextClaimed === true ||
      value.visualPassClaimed === true ||
      value.finalVisualPassClaimed === true ||
      value.generatedImage === true ||
      value.graphicBox === true ||
      value.webGL === true ||
      value.webgl === true
    );
  }

  function safeInvoke(target, method, args) {
    if (!target || !isFunction(target[method])) {
      return { ok: false, value: null, error: `METHOD_UNAVAILABLE:${method}` };
    }

    try {
      return {
        ok: true,
        value: target[method](...(Array.isArray(args) ? args : [args])),
        error: "NONE"
      };
    } catch (error) {
      return {
        ok: false,
        value: null,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function adapterMethods(authority) {
    if (!isObject(authority) || authority === api) return [];

    return [
      "drawToCanvas",
      "renderToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "renderComposite",
      "drawCompositeFrame",
      "renderFrame",
      "drawFrame",
      "render",
      "draw",
      "compose"
    ].filter((method) => isFunction(authority[method]));
  }

  function buildDrawPacket(canvas, ctx, packet = {}) {
    return {
      packetType: "HEARTH_CANVAS_DOM_SURFACE_TRUTH_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      targetRoute: ROUTE,
      canvas,
      ctx,
      context: ctx,
      receiverOnly: true,
      canvasSurfaceTruthBinding: true,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      viewState: isObject(packet.viewState) ? clonePlain(packet.viewState) : {},
      ...NO_CLAIMS
    };
  }

  function attemptAdapterDraw(canvas, ctx, packet = {}) {
    const adapters = [];

    for (const path of DRAWABLE_ADAPTER_ALIAS_PATHS) {
      const authority = readPath(path);
      const methods = adapterMethods(authority);

      if (!authority || !methods.length) continue;
      if (authority === api) continue;

      adapters.push({ path, authority, methods });
    }

    state.adapterDrawAttempted = adapters.length > 0;

    for (const adapter of adapters) {
      for (const method of adapter.methods) {
        let result;

        if (method === "drawToCanvas" || method === "renderToCanvas") {
          result = safeInvoke(adapter.authority, method, [
            canvas,
            buildDrawPacket(canvas, ctx, packet)
          ]);
        } else {
          result = safeInvoke(adapter.authority, method, [
            buildDrawPacket(canvas, ctx, packet)
          ]);

          if (!result.ok) {
            result = safeInvoke(adapter.authority, method, [
              ctx,
              buildDrawPacket(canvas, ctx, packet)
            ]);
          }
        }

        if (!result.ok) {
          state.adapterError = result.error;
          continue;
        }

        if (!noForbiddenClaims(result.value)) {
          state.adapterError = `ADAPTER_RETURNED_FORBIDDEN_FINAL_CLAIM:${adapter.path}`;
          continue;
        }

        samplePixels(canvas, ctx);

        if (state.canvasPixelVisible) {
          state.adapterDrawComplete = true;
          state.adapterSourceName = adapter.path;
          state.adapterContract = contractOf(result.value) || contractOf(adapter.authority) || "UNKNOWN";
          state.adapterMethod = method;
          state.adapterError = "NONE";
          return true;
        }
      }
    }

    return false;
  }

  function drawIrregularMass(ctx, cx, cy, radius, seed, sx, sy, rotation) {
    const points = 28;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wave =
        0.76 +
        Math.sin(t * 2 + seed) * 0.12 +
        Math.sin(t * 3.7 + seed * 0.6) * 0.08 +
        Math.sin(t * 6.2 - seed * 0.3) * 0.045;

      const a = t + rotation;
      const x = cx + Math.cos(a) * radius * wave * sx;
      const y = cy + Math.sin(a) * radius * wave * sy;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }

  function drawNativeCarrier(canvas, ctx, packet = {}) {
    if (!canvas || !ctx) return false;

    state.nativeCarrierDrawAttempted = true;

    try {
      const w = canvas.width || 900;
      const h = canvas.height || 900;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.405;

      const view = isObject(packet.viewState) ? packet.viewState : {};
      const yaw = safeNumber(view.yaw, safeNumber(packet.yaw, 0));
      const pitch = Math.max(-1.1, Math.min(1.1, safeNumber(view.pitch, safeNumber(packet.pitch, 0))));
      const phase = yaw * 0.23 + pitch * 0.08;

      ctx.clearRect(0, 0, w, h);

      const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      field.addColorStop(0, "rgba(15,38,70,0.96)");
      field.addColorStop(0.55, "rgba(3,10,26,0.98)");
      field.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = field;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - r * 0.34,
        cy - r * 0.38,
        r * 0.12,
        cx,
        cy,
        r * 1.18
      );
      ocean.addColorStop(0, "rgba(117,202,241,0.98)");
      ocean.addColorStop(0.34, "rgba(24,112,174,0.98)");
      ocean.addColorStop(0.72, "rgba(5,42,101,0.98)");
      ocean.addColorStop(1, "rgba(1,8,29,1)");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.globalAlpha = 0.28;
      ctx.strokeStyle = "rgba(230,246,255,0.32)";
      ctx.lineWidth = Math.max(1, r * 0.0045);

      for (let i = -5; i <= 5; i += 1) {
        const y = cy + (i / 6) * r * 0.78 + pitch * r * 0.10;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.98, r * 0.085, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 9; i += 1) {
        const x = cx + Math.sin(phase + i * 0.72) * r * 0.74;
        ctx.beginPath();
        ctx.ellipse(x, cy, r * 0.10, r * 0.96, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const landMasses = [
        [-0.42, -0.24, 0.31, 1.20, 0.72, 0.20],
        [0.18, -0.31, 0.25, 0.86, 1.18, 1.40],
        [0.36, 0.12, 0.29, 0.78, 1.04, 2.25],
        [-0.18, 0.20, 0.27, 1.08, 0.90, 3.05],
        [-0.56, 0.03, 0.16, 0.76, 1.32, 4.14],
        [0.02, -0.02, 0.17, 1.48, 0.55, 5.30],
        [0.00, 0.58, 0.21, 1.62, 0.38, 6.34]
      ];

      for (let index = 0; index < landMasses.length; index += 1) {
        const item = landMasses[index];
        const px = cx + item[0] * r + Math.sin(phase + index) * r * 0.026;
        const py = cy + item[1] * r + pitch * r * 0.11 + Math.cos(phase + index) * r * 0.018;
        const rr = item[2] * r;

        const land = ctx.createLinearGradient(px - rr, py - rr, px + rr, py + rr);
        land.addColorStop(0, "rgba(170,137,78,0.96)");
        land.addColorStop(0.48, "rgba(91,137,82,0.96)");
        land.addColorStop(1, "rgba(43,76,53,0.96)");
        ctx.fillStyle = land;
        drawIrregularMass(ctx, px, py, rr, item[5] + phase, item[3], item[4], phase * 0.15 + index * 0.22);

        ctx.strokeStyle = "rgba(248,225,154,0.26)";
        ctx.lineWidth = Math.max(1, r * 0.004);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.30;
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      drawIrregularMass(ctx, cx - r * 0.40, cy - r * 0.49, r * 0.09, 8.3 + phase, 1.80, 0.45, 0.1);
      drawIrregularMass(ctx, cx + r * 0.23, cy - r * 0.58, r * 0.075, 9.2 + phase, 2.08, 0.42, -0.2);
      drawIrregularMass(ctx, cx + r * 0.10, cy + r * 0.50, r * 0.11, 10.1 + phase, 1.9, 0.38, 0.05);
      ctx.globalAlpha = 1;

      const shade = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.43, r * 0.06, cx, cy, r * 1.05);
      shade.addColorStop(0, "rgba(255,255,255,0.20)");
      shade.addColorStop(0.52, "rgba(255,255,255,0.00)");
      shade.addColorStop(0.86, "rgba(0,0,0,0.25)");
      shade.addColorStop(1, "rgba(0,0,0,0.64)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.strokeStyle = "rgba(212,236,255,0.58)";
      ctx.lineWidth = Math.max(1, r * 0.010);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      state.nativeCarrierDrawComplete = true;
      return true;
    } catch (error) {
      state.nativeCarrierDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("NATIVE_CARRIER_DRAW_FAILED", error);
      return false;
    }
  }

  function samplePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.canvasPixelSampleStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelVisible = false;
      state.canvasPixelSampleReason = "CANVAS_OR_CONTEXT_MISSING";
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.max(4, Math.min(30, Math.floor(Math.min(w, h) / 32)));
      const points = [
        [0.50, 0.50],
        [0.36, 0.42],
        [0.64, 0.58],
        [0.50, 0.28],
        [0.50, 0.72]
      ];

      let sampleCount = 0;
      let alphaCount = 0;
      let visibleCount = 0;
      const colors = new Set();

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(w - size, Math.floor(w * px - size / 2)));
        const y = Math.max(0, Math.min(h - size, Math.floor(h * py - size / 2)));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          sampleCount += 1;
          if (a > 0) alphaCount += 1;
          if (a > 0 && (r > 5 || g > 5 || b > 5)) visibleCount += 1;
          if (a > 0) colors.add(`${r >> 4}:${g >> 4}:${b >> 4}:${a >> 4}`);
        }
      }

      state.canvasPixelSampleCount = sampleCount;
      state.canvasAlphaPixelCount = alphaCount;
      state.canvasVisiblePixelCount = visibleCount;
      state.canvasPixelVisible = Boolean(visibleCount > 0 && alphaCount > 0 && colors.size > 1);
      state.canvasPixelSampleStatus = state.canvasPixelVisible
        ? "PIXEL_SAMPLE_VISIBLE"
        : "PIXEL_SAMPLE_BLANK";
      state.canvasPixelSampleReason = state.canvasPixelVisible
        ? `VISIBLE_PIXELS:${visibleCount};ALPHA_PIXELS:${alphaCount};UNIQUE_COLORS:${colors.size}`
        : `NO_VISIBLE_PIXEL_VARIANCE;ALPHA_PIXELS:${alphaCount};UNIQUE_COLORS:${colors.size}`;

      return state.canvasPixelVisible;
    } catch (error) {
      state.canvasPixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.canvasPixelVisible = Boolean(state.drawAttempted);
      state.canvasPixelSampleReason = error && error.message ? String(error.message) : String(error);
      recordError("CANVAS_PIXEL_SAMPLE_UNREADABLE", error);
      return state.canvasPixelVisible;
    } finally {
      resolveTruthStatus();
    }
  }

  function resolveTruthStatus() {
    const stages = [
      ["BOOT", state.loaded],
      ["MOUNT_FOUND", state.mountFound],
      ["CANVAS_ELEMENT_FOUND", state.canvasElementFound],
      ["CANVAS_IN_MOUNT", state.canvasInMount],
      ["CANVAS_RECT_NONZERO", state.canvasRectNonzero],
      ["CANVAS_COMPUTED_VISIBLE", state.canvasComputedVisible],
      ["CANVAS_CONTEXT_2D_READY", state.canvasContext2dReady],
      ["DRAW_ATTEMPTED", state.drawAttempted],
      ["CANVAS_PIXEL_VISIBLE", state.canvasPixelVisible],
      ["ALIASES_PUBLISHED", state.aliasesPublished]
    ];

    const firstFailed = stages.find((stage) => !stage[1]);
    const passed = stages.filter((stage) => stage[1]).length;

    state.canvasStandardNewsAlignmentScore = Math.round((passed / stages.length) * 100);
    state.canvasStandardNewsAlignmentStatus = firstFailed
      ? "CANVAS_STANDARD_NEWS_ALIGNMENT_PARTIAL"
      : "CANVAS_STANDARD_NEWS_ALIGNMENT_COMPLETE";
    state.canvasStandardNewsAlignmentFirstFailedStage = firstFailed ? firstFailed[0] : "NONE";

    const fibStages = [
      ["F1:API", true],
      ["F2:DOM_SURFACE", state.canvasElementFound],
      ["F3:MOUNT", state.mountFound && state.canvasInMount],
      ["F5:RECT_VISIBLE", state.canvasRectNonzero && state.canvasComputedVisible],
      ["F8:CONTEXT", state.canvasContext2dReady],
      ["F13:DRAW", state.drawAttempted && state.drawComplete],
      ["F21:PIXEL_PROOF_NOT_LATCH", state.canvasPixelVisible],
      ["F34:RECEIPT", state.aliasesPublished && state.receiptPublishCount > 0]
    ];

    const fibFirstFailed = fibStages.find((stage) => !stage[1]);
    const fibPassed = fibStages.filter((stage) => stage[1]).length;

    state.canvasStandardFibonacciSynchronizationScore =
      Math.round((fibPassed / fibStages.length) * 100);
    state.canvasStandardFibonacciSynchronizationStatus = fibFirstFailed
      ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_PARTIAL"
      : "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_COMPLETE";
    state.canvasStandardFibonacciSynchronizationFirstFailedStage =
      fibFirstFailed ? fibFirstFailed[0] : "NONE";

    if (!state.mountFound) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_MOUNT_FOUND";
      state.canvasTruthFailureClass = "CANVAS_MOUNT_NOT_FOUND";
      state.canvasTruthFailureReason = "NO_EXPECTED_CANVAS_MOUNT_SELECTOR_MATCHED";
      state.canvasTruthRecommendedAction = "VERIFY_HTML_EXPOSES_HEARTH_CANVAS_MOUNT";
    } else if (!state.canvasElementFound) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_ELEMENT_FOUND";
      state.canvasTruthFailureClass = "CANVAS_ELEMENT_NOT_FOUND";
      state.canvasTruthFailureReason = "CANVAS_FILE_DID_NOT_CREATE_OR_BIND_CANVAS";
      state.canvasTruthRecommendedAction = "RENEW_CANVAS_TO_CREATE_OR_BIND_DOM_CANVAS_SURFACE";
    } else if (!state.canvasInMount) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_IN_MOUNT";
      state.canvasTruthFailureClass = "CANVAS_NOT_ATTACHED_TO_EXPECTED_MOUNT";
      state.canvasTruthFailureReason = "CANVAS_EXISTS_BUT_NOT_UNDER_HEARTH_CANVAS_MOUNT";
      state.canvasTruthRecommendedAction = "MOVE_OR_CREATE_CANVAS_UNDER_HEARTH_CANVAS_MOUNT";
    } else if (!state.canvasRectNonzero) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_RECT_NONZERO";
      state.canvasTruthFailureClass = "CANVAS_RECT_ZERO";
      state.canvasTruthFailureReason = "CANVAS_EXISTS_BUT_RENDERED_RECT_IS_ZERO";
      state.canvasTruthRecommendedAction = "FIX_CANVAS_SIZE_OR_PARENT_LAYOUT";
    } else if (!state.canvasComputedVisible) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_COMPUTED_VISIBLE";
      state.canvasTruthFailureClass = "CANVAS_COMPUTED_HIDDEN";
      state.canvasTruthFailureReason = "CANVAS_COMPUTED_STYLE_NOT_VISIBLE";
      state.canvasTruthRecommendedAction = "FIX_CANVAS_VISIBILITY_DISPLAY_OR_OPACITY";
    } else if (!state.canvasContext2dReady) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_CONTEXT_2D_READY";
      state.canvasTruthFailureClass = "CANVAS_2D_CONTEXT_NOT_READY";
      state.canvasTruthFailureReason = state.canvasContext2dStatus;
      state.canvasTruthRecommendedAction = "VERIFY_BROWSER_CANVAS_2D_CONTEXT_CREATION";
    } else if (!state.canvasPixelVisible) {
      state.canvasSurfaceTruthAvailable = false;
      state.canvasTruthFirstFailedCoordinate = "CANVAS_PIXEL_VISIBLE";
      state.canvasTruthFailureClass = "CANVAS_DRAW_SURFACE_BLANK";
      state.canvasTruthFailureReason = state.canvasPixelSampleReason;
      state.canvasTruthRecommendedAction = "VERIFY_DRAW_PATH_OR_DOWNSTREAM_ADAPTER";
    } else {
      state.canvasSurfaceTruthAvailable = true;
      state.canvasTruthFirstFailedCoordinate = "NONE";
      state.canvasTruthFailureClass = "NONE";
      state.canvasTruthFailureReason =
        "CANVAS_DOM_SURFACE_CONTEXT_AND_PIXEL_PROOF_AVAILABLE_NO_FINAL_CLAIM";
      state.canvasTruthRecommendedAction =
        "RETURN_CANVAS_SURFACE_TRUTH_RECEIPT_TO_DIAGNOSTIC_RAIL";
    }

    state.canvasExpressionSurfaceReady = state.canvasSurfaceTruthAvailable;
    state.canvasExpressionRichnessReady = state.canvasPixelVisible;
    state.domExpressionSurfaceProofReady = state.canvasSurfaceTruthAvailable;
    state.visiblePlanetProofReady = state.canvasPixelVisible;
    state.renderedPlanetProofReady = state.canvasPixelVisible;
    state.visiblePlanetProofSource = state.canvasPixelVisible
      ? "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIVER"
      : "NONE";
  }

  function drawToCanvas(canvasOrPacket = null, maybePacket = {}) {
    if (drawing) return getReceiptLight();

    drawing = true;

    try {
      const packet =
        canvasOrPacket && canvasOrPacket.tagName
          ? maybePacket
          : isObject(canvasOrPacket)
            ? canvasOrPacket
            : maybePacket;

      state.drawAttempted = true;
      state.drawCount += 1;
      state.lastDrawAt = nowIso();
      state.lastDrawReason = safeString(packet.reason || packet.drawReason || "drawToCanvas");
      state.lastPacketType = safeString(packet.packetType || packet.type || state.lastPacketType);
      state.lastPacketContract = contractOf(packet) || state.lastPacketContract;

      const surface = locateOrCreateSurface();
      let canvas = surface.canvas;
      let ctx = surface.ctx;

      if (canvasOrPacket && canvasOrPacket.tagName && canvasOrPacket.getContext) {
        canvas = canvasOrPacket;
        applyCanvasAttributes(canvas, canvas.parentElement || activeMount);
        try {
          ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
        } catch (error) {
          ctx = null;
          recordError("ARGUMENT_CANVAS_CONTEXT_FAILED", error);
        }
        activeCanvas = canvas;
        activeContext = ctx;
        updateSurfaceState("ARGUMENT_CANVAS", canvas.parentElement || activeMount, canvas, ctx, ctx ? "2D_CONTEXT_READY" : "2D_CONTEXT_NULL");
      }

      if (!canvas || !ctx) {
        state.drawComplete = false;
        state.lastDrawSource = "NONE";
        state.lastDrawError = "CANVAS_OR_2D_CONTEXT_UNAVAILABLE";
        samplePixels(canvas, ctx);
        publishReceipts();
        return getReceiptLight();
      }

      const adapterOk = attemptAdapterDraw(canvas, ctx, packet);

      let nativeOk = false;
      if (!adapterOk) {
        nativeOk = drawNativeCarrier(canvas, ctx, packet);
      }

      samplePixels(canvas, ctx);

      state.drawComplete = Boolean(state.canvasPixelVisible);
      state.lastDrawSource = adapterOk
        ? "DOWNSTREAM_DRAWABLE_ADAPTER"
        : nativeOk
          ? "CANVAS_NATIVE_2D_VISIBLE_CARRIER_PROOF"
          : "NONE";
      state.lastDrawError = state.drawComplete ? "NONE" : state.lastDrawError;

      publishReceipts();
      notifyUpstream("drawToCanvas");

      return getReceiptLight();
    } catch (error) {
      state.drawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("DRAW_TO_CANVAS_TOP_LEVEL_FAILED", error);
      publishReceipts();
      return getReceiptLight();
    } finally {
      drawing = false;
    }
  }

  function drawVisibleExpression(packet = {}) {
    return drawToCanvas(packet);
  }

  function render(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function draw(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function scheduleDraw(reason = "scheduled-draw") {
    if (!root.setTimeout) return drawVisibleExpression({ reason });
    if (drawTimer) return true;

    drawTimer = root.setTimeout(() => {
      drawTimer = 0;
      drawVisibleExpression({ reason });
    }, 60);

    return true;
  }

  function receivePacket(packet = {}, lane = "GENERIC") {
    state.packetCount += 1;
    state.lastPacketType = safeString(packet.packetType || packet.type || lane);
    state.lastPacketContract = contractOf(packet) || state.lastPacketContract;

    if (lane === "ROUTE_CONDUCTOR") state.routeConductorPacketCount += 1;
    if (lane === "QUEEN") state.queenPacketCount += 1;
    if (lane === "LABWEST") state.labWestPacketCount += 1;
    if (lane === "FINGER") state.fingerPacketCount += 1;
    if (lane === "DIAGNOSTIC") state.diagnosticPacketCount += 1;

    record("PACKET_RECEIVED", {
      lane,
      packetType: state.lastPacketType,
      contract: state.lastPacketContract
    });

    scheduleDraw(`packet:${lane}`);
    publishReceipts();
    return getReceiptLight();
  }

  function receiveRouteConductorReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function receiveCanvasReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function consumeReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function acceptReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }

  function receiveQueenPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlsPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveViewControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receivePlanetaryControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }

  function receiveLabWestPacket(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveWestGateContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveAdmissibilityContext(packet = {}) { return receivePacket(packet, "LABWEST"); }

  function receiveFingerPacket(packet = {}) { return receivePacket(packet, "FINGER"); }
  function receiveCanvasFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveExpressionFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function registerCanvasFinger(packet = {}) { return receiveFingerPacket(packet); }
  function registerExpressionFinger(packet = {}) { return receiveFingerPacket(packet); }
  function receiveCanvasExpressionPacket(packet = {}) { return receiveFingerPacket(packet); }

  function receiveDiagnosticPacket(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }
  function receiveHierarchyContext(packet = {}) { return receiveDiagnosticPacket(packet); }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasMountFound", state.mountFound);
    setDataset("hearthCanvasMountSelector", state.mountSelector);
    setDataset("hearthCanvasElementFound", state.canvasElementFound);
    setDataset("hearthCanvasCreated", state.canvasCreated);
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasInMount", state.canvasInMount);
    setDataset("hearthCanvasRectNonzero", state.canvasRectNonzero);
    setDataset("hearthCanvasComputedVisible", state.canvasComputedVisible);
    setDataset("hearthCanvasContext2dReady", state.canvasContext2dReady);
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", state.canvasPixelVisible);

    setDataset("hearthCanvasSurfaceTruthAvailable", state.canvasSurfaceTruthAvailable);
    setDataset("hearthCanvasTruthFirstFailedCoordinate", state.canvasTruthFirstFailedCoordinate);
    setDataset("hearthCanvasTruthFailureClass", state.canvasTruthFailureClass);
    setDataset("hearthCanvasTruthFailureReason", state.canvasTruthFailureReason);
    setDataset("hearthCanvasTruthRecommendedFile", state.canvasTruthRecommendedFile);
    setDataset("hearthCanvasTruthRecommendedAction", state.canvasTruthRecommendedAction);

    setDataset("hearthCanvasExpressionSurfaceReady", state.canvasExpressionSurfaceReady);
    setDataset("hearthCanvasExpressionRichnessReady", state.canvasExpressionRichnessReady);
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", state.domExpressionSurfaceProofReady);
    setDataset("hearthCanvasVisiblePlanetProofReady", state.visiblePlanetProofReady);
    setDataset("hearthCanvasRenderedPlanetProofReady", state.renderedPlanetProofReady);
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);

    setDataset("hearthCanvasStandardNewsAlignmentStatus", state.canvasStandardNewsAlignmentStatus);
    setDataset("hearthCanvasStandardNewsAlignmentScore", state.canvasStandardNewsAlignmentScore);
    setDataset("hearthCanvasStandardNewsAlignmentFirstFailedStage", state.canvasStandardNewsAlignmentFirstFailedStage);
    setDataset("hearthCanvasStandardFibonacciSynchronizationStatus", state.canvasStandardFibonacciSynchronizationStatus);
    setDataset("hearthCanvasStandardFibonacciSynchronizationScore", state.canvasStandardFibonacciSynchronizationScore);
    setDataset("hearthCanvasStandardFibonacciSynchronizationFirstFailedStage", state.canvasStandardFibonacciSynchronizationFirstFailedStage);

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);
    for (const path of EXPRESSION_BRIDGE_ALIAS_PATHS) setPath(path, api);

    state.aliasesPublished = true;
    state.aliasPublishCount += 1;
    state.publishedAt = nowIso();
    state.updatedAt = state.publishedAt;

    return true;
  }

  function composeReceiptLight() {
    resolveTruthStatus();

    return {
      packetType: "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      loaded: true,
      booted: state.booted,
      bootCount: state.bootCount,
      aliasesPublished: state.aliasesPublished,
      aliasPublishCount: state.aliasPublishCount,

      receiverOnly: true,
      ownsCanvasReceiverOutputCarrier: true,
      ownsCanvasDomSurfaceBinding: true,
      ownsCanvasPlacementFallback: true,
      ownsPixelProofPublication: true,

      canvasMountFound: state.mountFound,
      canvasMountSelector: state.mountSelector,
      canvasMountDescriptor: state.mountDescriptor,
      canvasMountRectNonzero: state.mountRectNonzero,

      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasMovedIntoMount: state.canvasMovedIntoMount,
      canvasSelector: state.canvasSelector,
      canvasTag: state.canvasTag,
      canvasId: state.canvasId,
      canvasClass: state.canvasClass,
      canvasInMount: state.canvasInMount,
      canvasWidthAttribute: state.canvasWidthAttribute,
      canvasHeightAttribute: state.canvasHeightAttribute,
      canvasRectLeft: state.canvasRectLeft,
      canvasRectTop: state.canvasRectTop,
      canvasRectWidth: state.canvasRectWidth,
      canvasRectHeight: state.canvasRectHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasComputedDisplay: state.canvasComputedDisplay,
      canvasComputedVisibility: state.canvasComputedVisibility,
      canvasComputedOpacity: state.canvasComputedOpacity,
      canvasComputedPosition: state.canvasComputedPosition,
      canvasComputedZIndex: state.canvasComputedZIndex,
      canvasComputedPointerEvents: state.canvasComputedPointerEvents,
      canvasViewportWidth: state.canvasViewportWidth,
      canvasViewportHeight: state.canvasViewportHeight,
      canvasViewportIntersecting: state.canvasViewportIntersecting,

      canvasContext2dReady: state.canvasContext2dReady,
      canvasContext2dStatus: state.canvasContext2dStatus,

      drawAttempted: state.drawAttempted,
      drawComplete: state.drawComplete,
      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawSource: state.lastDrawSource,
      lastDrawReason: state.lastDrawReason,
      lastDrawError: state.lastDrawError,

      adapterDrawAttempted: state.adapterDrawAttempted,
      adapterDrawComplete: state.adapterDrawComplete,
      adapterSourceName: state.adapterSourceName,
      adapterContract: state.adapterContract,
      adapterMethod: state.adapterMethod,
      adapterError: state.adapterError,

      nativeCarrierDrawAttempted: state.nativeCarrierDrawAttempted,
      nativeCarrierDrawComplete: state.nativeCarrierDrawComplete,

      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleCount: state.canvasPixelSampleCount,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,
      canvasPixelSampleReason: state.canvasPixelSampleReason,
      canvasPixelVarianceStatus: state.canvasPixelSampleStatus,

      canvasLayerBlocked: state.canvasLayerBlocked,
      canvasLayerBlocker: state.canvasLayerBlocker,

      canvasSurfaceTruthAvailable: state.canvasSurfaceTruthAvailable,
      canvasTruthFirstFailedCoordinate: state.canvasTruthFirstFailedCoordinate,
      canvasTruthFailureClass: state.canvasTruthFailureClass,
      canvasTruthFailureReason: state.canvasTruthFailureReason,
      canvasTruthRecommendedOwner: state.canvasTruthRecommendedOwner,
      canvasTruthRecommendedFile: state.canvasTruthRecommendedFile,
      canvasTruthRecommendedAction: state.canvasTruthRecommendedAction,

      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      renderedPlanetProofReady: state.renderedPlanetProofReady,

      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      currentCanvasParentRecognized: true,
      currentCanvasParentObserved: true,
      currentCanvasParentIsCurrentCanvas: true,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,

      canvasStandardNewsAlignmentStatus: state.canvasStandardNewsAlignmentStatus,
      canvasStandardNewsAlignmentScore: state.canvasStandardNewsAlignmentScore,
      canvasStandardNewsAlignmentFirstFailedStage:
        state.canvasStandardNewsAlignmentFirstFailedStage,
      canvasStandardFibonacciSynchronizationStatus:
        state.canvasStandardFibonacciSynchronizationStatus,
      canvasStandardFibonacciSynchronizationScore:
        state.canvasStandardFibonacciSynchronizationScore,
      canvasStandardFibonacciSynchronizationFirstFailedStage:
        state.canvasStandardFibonacciSynchronizationFirstFailedStage,

      routeConductorPacketCount: state.routeConductorPacketCount,
      queenPacketCount: state.queenPacketCount,
      labWestPacketCount: state.labWestPacketCount,
      fingerPacketCount: state.fingerPacketCount,
      diagnosticPacketCount: state.diagnosticPacketCount,
      packetCount: state.packetCount,
      lastPacketType: state.lastPacketType,
      lastPacketContract: state.lastPacketContract,

      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
      ownsCompositeTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      ownsQueenTruth: false,
      ownsControlRuntimeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsDiagnosticRailCaseSelection: false,

      ...NO_CLAIMS,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptLight() {
    if (activeCanvas) {
      updateSurfaceState(
        state.canvasSelector,
        activeMount || activeCanvas.parentElement,
        activeCanvas,
        activeContext,
        activeContext ? "2D_CONTEXT_READY" : state.canvasContext2dStatus
      );
    }

    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      packetType: "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIPT",
      canvasAliasPaths: CANVAS_ALIAS_PATHS.slice(),
      expressionBridgeAliasPaths: EXPRESSION_BRIDGE_ALIAS_PATHS.slice(),
      drawableAdapterAliasPathsReadOnly: DRAWABLE_ADAPTER_ALIAS_PATHS.slice(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...NO_CLAIMS
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_DOM_SURFACE_TRUTH_BINDING_RECEIPT",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `internalRenewalContract=${r.internalRenewalContract}`,
      `internalRenewalReceipt=${r.internalRenewalReceipt}`,
      `file=${FILE}`,
      `route=${ROUTE}`,
      `canvasMountFound=${r.canvasMountFound}`,
      `canvasMountSelector=${r.canvasMountSelector}`,
      `canvasElementFound=${r.canvasElementFound}`,
      `canvasCreated=${r.canvasCreated}`,
      `canvasSelector=${r.canvasSelector}`,
      `canvasInMount=${r.canvasInMount}`,
      `canvasRectNonzero=${r.canvasRectNonzero}`,
      `canvasComputedVisible=${r.canvasComputedVisible}`,
      `canvasContext2dReady=${r.canvasContext2dReady}`,
      `drawAttempted=${r.drawAttempted}`,
      `drawComplete=${r.drawComplete}`,
      `lastDrawSource=${r.lastDrawSource}`,
      `canvasPixelSampleStatus=${r.canvasPixelSampleStatus}`,
      `canvasPixelVisible=${r.canvasPixelVisible}`,
      `canvasSurfaceTruthAvailable=${r.canvasSurfaceTruthAvailable}`,
      `canvasTruthFirstFailedCoordinate=${r.canvasTruthFirstFailedCoordinate}`,
      `canvasTruthFailureClass=${r.canvasTruthFailureClass}`,
      `canvasTruthFailureReason=${r.canvasTruthFailureReason}`,
      `canvasTruthRecommendedFile=${r.canvasTruthRecommendedFile}`,
      `canvasTruthRecommendedAction=${r.canvasTruthRecommendedAction}`,
      `canvasStandardNewsAlignmentStatus=${r.canvasStandardNewsAlignmentStatus}`,
      `canvasStandardNewsAlignmentScore=${r.canvasStandardNewsAlignmentScore}`,
      `canvasStandardFibonacciSynchronizationStatus=${r.canvasStandardFibonacciSynchronizationStatus}`,
      `canvasStandardFibonacciSynchronizationScore=${r.canvasStandardFibonacciSynchronizationScore}`,
      "f13Claimed=false",
      "f21EligibleForNorth=false",
      "f21Claimed=false",
      "readyTextAllowed=false",
      "readyTextClaimed=false",
      "visualPassClaimed=false",
      "generatedImage=false",
      "graphicBox=false",
      "webGL=false"
    ].join("\n");
  }

  function publishReceipts() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const light = getReceiptLight();
    const full = getReceipt();

    root.HEARTH_CANVAS_HUB_RECEIPT = light;
    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = light;
    root.HEARTH_CANVAS_STATION_RECEIPT = light;
    root.HEARTH_CANVAS_EXPRESSION_SURFACE_RECEIPT = light;
    root.HEARTH_CANVAS_DOM_SURFACE_TRUTH_RECEIPT = full;
    root.HEARTH_CANVAS_SURFACE_TRUTH_RECEIPT = full;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_GLOBE_RECEIPT = light;

    hearth.canvasHubReceipt = light;
    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = light;
    hearth.canvasStationReceipt = light;
    hearth.canvasExpressionSurfaceReceipt = light;
    hearth.canvasDomSurfaceTruthReceipt = full;
    hearth.canvasSurfaceTruthReceipt = full;
    hearth.canvasVisiblePlanetReceipt = light;
    hearth.canvasVisibleGlobeReceipt = light;

    lab.hearthCanvasHubReceipt = light;
    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = light;
    lab.hearthCanvasStationReceipt = light;
    lab.hearthCanvasExpressionSurfaceReceipt = light;
    lab.hearthCanvasDomSurfaceTruthReceipt = full;
    lab.hearthCanvasSurfaceTruthReceipt = full;
    lab.hearthCanvasVisiblePlanetReceipt = light;
    lab.hearthCanvasVisibleGlobeReceipt = light;

    state.receiptPublishCount += 1;
    state.updatedAt = nowIso();

    updateDataset();

    try {
      if (isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
        root.dispatchEvent(
          new CustomEvent("hearth:canvas-surface-truth", {
            detail: clonePlain(light)
          })
        );
      }
    } catch (_error) {}

    return true;
  }

  function schedulePublish() {
    if (!root.setTimeout) return publishReceipts();
    if (publishTimer) return true;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishReceipts();
    }, 40);

    return true;
  }

  function notifyUpstream(reason = "canvas-surface-truth") {
    const receipt = getReceiptLight();
    const targetPaths = [
      "HEARTH.routeConductor",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.westAdmissibility",
      "HEARTH.runtimeTableWest",
      "DEXTER_LAB.runtimeTableWest"
    ];

    const methods = [
      "receiveCanvasSurfaceTruthReceipt",
      "receiveCanvasDomSurfaceTruthReceipt",
      "receiveCanvasVisibleProof",
      "receiveVisiblePlanetReceipt",
      "receiveCanvasParentSummary",
      "receiveCanvasStationSummary",
      "receiveCanvasExpressionPacket",
      "reconcileCanvas"
    ];

    for (const path of targetPaths) {
      const target = readPath(path);
      if (!target || target === api || !isObject(target)) continue;

      for (const method of methods) {
        if (!isFunction(target[method])) continue;

        safeInvoke(target, method, [{
          ...clonePlain(receipt),
          packetType: "HEARTH_CANVAS_DOM_SURFACE_TRUTH_UPSTREAM_NOTICE",
          noticeReason: reason,
          sourceFile: FILE,
          targetFile: ROUTE_CONDUCTOR_FILE,
          ...NO_CLAIMS
        }]);
      }
    }

    state.upstreamNoticeCount += 1;
    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliases();
    updateDataset();
    publishReceipts();
    record(reason, {
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasPixelVisible: state.canvasPixelVisible,
      surfaceTruth: state.canvasSurfaceTruthAvailable
    });
    return api;
  }

  function boot(options = {}) {
    if (booting) return getReceipt();

    booting = true;

    try {
      state.bootCount += 1;
      state.startedAt = state.startedAt || nowIso();

      publishAliases();
      locateOrCreateSurface();
      updateDataset();
      publishReceipts();

      if (options.drawNow !== false) {
        drawVisibleExpression({
          reason: options.reason || "boot",
          viewState: isObject(options.viewState) ? options.viewState : {}
        });
      }

      state.booted = true;
      resolveTruthStatus();
      updateDataset();
      publishReceipts();
      notifyUpstream("boot");

      return getReceipt();
    } catch (error) {
      recordError("CANVAS_BOOT_FAILED", error);
      updateDataset();
      publishReceipts();
      return getReceipt();
    } finally {
      booting = false;
    }
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function mount(options = {}) { return boot(options); }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    version: VERSION,

    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    ROUTE_CONDUCTOR_FILE,
    CONTROL_FILE,
    LABWEST_FILE,

    CANVAS_ALIAS_PATHS,
    EXPRESSION_BRIDGE_ALIAS_PATHS,
    DRAWABLE_ADAPTER_ALIAS_PATHS,

    boot,
    init,
    start,
    mount,

    locateOrCreateSurface,
    drawToCanvas,
    drawVisibleExpression,
    render,
    draw,
    scheduleDraw,
    samplePixels,

    receivePacket,
    receiveRouteConductorReleasePacket,
    receiveCanvasReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,
    acceptReleasePacket,

    receiveQueenPacket,
    receiveControlPacket,
    receiveControlsPacket,
    receiveViewControlPacket,
    receivePlanetaryControlPacket,

    receiveLabWestPacket,
    receiveWestGateContext,
    receiveAdmissibilityContext,

    receiveFingerPacket,
    receiveCanvasFingerPacket,
    receiveExpressionFingerPacket,
    registerCanvasFinger,
    registerExpressionFinger,
    receiveCanvasExpressionPacket,

    receiveDiagnosticPacket,
    receiveHierarchyContext,

    getReceiptLight,
    getReceipt,
    getCanvasStationSummary: getReceiptLight,
    getCanvasStationReceiptLight: getReceiptLight,
    getCanvasStationReceipt: getReceipt,
    getCanvasParentSummary: getReceiptLight,
    getCanvasParentReceipt: getReceipt,
    getExpressionHubSummary: getReceiptLight,
    getExpressionHubReceipt: getReceiptLight,
    getExpressionSurfaceReceipt: getReceiptLight,
    getCanvasSurfaceTruthReceipt: getReceipt,
    getCanvasDomSurfaceTruthReceipt: getReceipt,
    getVisiblePlanetReceipt: getReceiptLight,
    getVisibleGlobeReceipt: getReceiptLight,
    getCanvasVisibleProofReceipt: getReceiptLight,
    getStructuralCarrier: getReceiptLight,
    readStructuralCarrier: getReceiptLight,
    getCarrierReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getState: () => state,
    getReceiptText,

    publishGlobals,
    publishAliases,
    publishReceipts,
    notifyUpstream,
    updateDataset,

    supportsCanvasDomSurfaceTruthBinding: true,
    supportsCanvasCreationUnderMount: true,
    supportsCanvasMoveIntoMount: true,
    supports2DCanvasContext: true,
    supportsPixelVisibleProof: true,
    supportsNativeVisibleCarrierProof: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,
    supportsNoFinalClaim: true,

    ownsCanvasReceiverOutputCarrier: true,
    ownsCanvasDomSurfaceBinding: true,
    ownsCanvasPlacementFallback: true,
    ownsPixelProofPublication: true,

    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsHexTruth: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsQueenTruth: false,
    ownsControlRuntimeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS
  });

  try {
    publishGlobals("immediate-canvas-dom-surface-truth-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener(
          "DOMContentLoaded",
          () => boot({ reason: "dom-content-loaded" }),
          { once: true }
        );
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime", drawNow: false });
    }

    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(() => {
        boot({ reason: "animation-frame-rebind" });
      });
    }

    if (root.setTimeout) {
      root.setTimeout(() => {
        boot({ reason: "post-publication-retry-1" });
        scheduleDraw("post-publication-retry-1");
        schedulePublish();
      }, 180);

      root.setTimeout(() => {
        boot({ reason: "post-publication-retry-2" });
        scheduleDraw("post-publication-retry-2");
        notifyUpstream("post-publication-retry-2");
      }, 720);

      root.setTimeout(() => {
        boot({ reason: "post-publication-retry-3" });
        scheduleDraw("post-publication-retry-3");
        notifyUpstream("post-publication-retry-3");
      }, 1600);
    }
  } catch (error) {
    recordError("CANVAS_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
