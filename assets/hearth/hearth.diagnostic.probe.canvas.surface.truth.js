// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
// Purpose:
// - Inspect the rendered Hearth target for concrete Canvas surface truth.
// - Determine whether a real canvas element exists, is mounted, has nonzero geometry,
//   is visible/intersecting, exposes a 2D context, contains visible pixels, and is not
//   blocked by an overlay.
// - Compare DOM canvas evidence against published Canvas namespace / receipt evidence.
// - Return a coordinate-specific failure class so NORTH can stop repeating the same
//   broad “expression surface not proven” result.
// - Preserve no production mutation, no drawing, no repair, no control mutation,
//   no route mutation, no runtime restart, no F13, no F21, no ready text,
//   no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - route conductor implementation
// - controls implementation
// - terrain/material/hydrology/elevation truth
// - diagnostic UI shell
// - final readiness or visual pass

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-probe-canvas-surface-truth-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
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

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const CANVAS_NAMESPACE_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",

    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",

    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};
  let lastReport = null;
  let lastReceipt = null;

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

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 900)).filter(Boolean).join(" | ");
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

  function boolText(value) {
    return value ? "true" : "false";
  }

  function readPath(baseWindow, path) {
    const parts = safeString(path).split(".");
    let cursor = baseWindow || root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
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

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCarrierReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output =
          method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
            ? authority[method](false)
            : authority[method]();

        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.summary)) return authority.summary;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(value) {
    if (!isObject(value)) return "";
    return firstKnown(
      value.currentCanvasParentContract,
      value.canvasLocalStationContract,
      value.canvasContract,
      value.hearthCanvasContract,
      value.contract,
      value.CONTRACT,
      value.internalRenewalContract,
      value.sourceContract,
      ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";
    return firstKnown(
      value.currentCanvasParentReceipt,
      value.canvasLocalStationReceipt,
      value.canvasReceipt,
      value.hearthCanvasReceipt,
      value.receipt,
      value.RECEIPT,
      value.internalRenewalReceipt,
      value.sourceReceipt,
      ""
    );
  }

  function getTargetContext(payload = {}) {
    const ownDocument = root.document || null;

    let targetWindow = null;
    let targetDocument = null;
    let targetSource = "UNKNOWN";

    if (payload && payload.targetWindow && payload.targetDocument) {
      targetWindow = payload.targetWindow;
      targetDocument = payload.targetDocument;
      targetSource = "PAYLOAD_TARGET_WINDOW_DOCUMENT";
    } else if (payload && payload.targetWindow && payload.targetWindow.document) {
      targetWindow = payload.targetWindow;
      targetDocument = payload.targetWindow.document;
      targetSource = "PAYLOAD_TARGET_WINDOW";
    } else if (payload && payload.targetDocument) {
      targetWindow = payload.targetDocument.defaultView || root;
      targetDocument = payload.targetDocument;
      targetSource = "PAYLOAD_TARGET_DOCUMENT";
    }

    if (!targetDocument && payload && payload.frameElement) {
      try {
        const frameWindow = payload.frameElement.contentWindow;
        const frameDocument = payload.frameElement.contentDocument || (frameWindow && frameWindow.document);
        if (frameWindow && frameDocument) {
          targetWindow = frameWindow;
          targetDocument = frameDocument;
          targetSource = "PAYLOAD_FRAME_ELEMENT";
        }
      } catch (_error) {}
    }

    if (!targetDocument && ownDocument) {
      try {
        const sameRouteFrame = Array.from(ownDocument.querySelectorAll("iframe")).find((frame) => {
          try {
            const src = safeString(frame.getAttribute("src"));
            return src.includes(TARGET_ROUTE) || src === TARGET_ROUTE;
          } catch (_error) {
            return false;
          }
        });

        if (sameRouteFrame) {
          const frameWindow = sameRouteFrame.contentWindow;
          const frameDocument = sameRouteFrame.contentDocument || (frameWindow && frameWindow.document);
          if (frameWindow && frameDocument) {
            targetWindow = frameWindow;
            targetDocument = frameDocument;
            targetSource = "DISCOVERED_TARGET_IFRAME";
          }
        }
      } catch (_error) {}
    }

    if (!targetDocument && ownDocument) {
      targetWindow = root;
      targetDocument = ownDocument;
      targetSource = "CURRENT_DOCUMENT_FALLBACK";
    }

    return {
      targetWindow,
      targetDocument,
      targetSource,
      targetAvailable: Boolean(targetWindow && targetDocument)
    };
  }

  function q(doc, selector) {
    if (!doc || !isFunction(doc.querySelector)) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(doc, selectors) {
    for (const selector of selectors) {
      const element = q(doc, selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        left: safeNumber(rect.left),
        top: safeNumber(rect.top),
        right: safeNumber(rect.right),
        bottom: safeNumber(rect.bottom),
        width: safeNumber(rect.width),
        height: safeNumber(rect.height),
        x: safeNumber(rect.x),
        y: safeNumber(rect.y)
      };
    } catch (_error) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
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

  function computedVisible(targetWindow, element) {
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) return false;

    try {
      const style = targetWindow.getComputedStyle(element);
      if (!style) return false;

      const display = safeString(style.display);
      const visibility = safeString(style.visibility);
      const opacity = safeNumber(style.opacity, 1);
      const pointerEvents = safeString(style.pointerEvents);

      return Boolean(
        display !== "none" &&
        visibility !== "hidden" &&
        visibility !== "collapse" &&
        opacity > 0 &&
        pointerEvents !== "none"
      );
    } catch (_error) {
      return false;
    }
  }

  function cssSummary(targetWindow, element) {
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return {
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
      return {
        display: safeString(style.display, "UNKNOWN"),
        visibility: safeString(style.visibility, "UNKNOWN"),
        opacity: safeString(style.opacity, "UNKNOWN"),
        position: safeString(style.position, "UNKNOWN"),
        zIndex: safeString(style.zIndex, "UNKNOWN"),
        pointerEvents: safeString(style.pointerEvents, "UNKNOWN")
      };
    } catch (_error) {
      return {
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

  function elementDescriptor(element) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "UNKNOWN").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes = element.classList && element.classList.length
        ? `.${Array.from(element.classList).slice(0, 5).join(".")}`
        : "";
    } catch (_error) {}

    const dataRole =
      element.dataset && element.dataset.role
        ? `[data-role="${element.dataset.role}"]`
        : "";

    return `${tag}${id}${classes}${dataRole}` || "UNKNOWN_ELEMENT";
  }

  function inspectLayerBlock(targetWindow, targetDocument, canvas, rect) {
    if (!targetDocument || !canvas || !rectNonzero(rect) || !isFunction(targetDocument.elementFromPoint)) {
      return {
        blocked: false,
        blocker: "UNREADABLE",
        hitTarget: "UNREADABLE",
        hitWithinCanvas: false
      };
    }

    const points = [
      [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
      [rect.left + rect.width * 0.33, rect.top + rect.height * 0.33],
      [rect.left + rect.width * 0.67, rect.top + rect.height * 0.33],
      [rect.left + rect.width * 0.33, rect.top + rect.height * 0.67],
      [rect.left + rect.width * 0.67, rect.top + rect.height * 0.67]
    ];

    const viewportWidth = safeNumber(targetWindow && targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow && targetWindow.innerHeight, 0);

    const hits = [];

    for (const [rawX, rawY] of points) {
      const x = Math.max(0, Math.min(viewportWidth - 1, rawX));
      const y = Math.max(0, Math.min(viewportHeight - 1, rawY));

      if (!Number.isFinite(x) || !Number.isFinite(y) || viewportWidth <= 0 || viewportHeight <= 0) continue;

      try {
        const hit = targetDocument.elementFromPoint(x, y);
        if (hit) hits.push(hit);
      } catch (_error) {}
    }

    if (!hits.length) {
      return {
        blocked: false,
        blocker: "NO_HIT_TARGET",
        hitTarget: "NO_HIT_TARGET",
        hitWithinCanvas: false
      };
    }

    const canvasHits = hits.filter((hit) => containsOrEquals(canvas, hit) || containsOrEquals(hit, canvas));
    const firstHit = hits[0];
    const firstBlockingHit = hits.find((hit) => !containsOrEquals(canvas, hit) && !containsOrEquals(hit, canvas));

    return {
      blocked: Boolean(canvasHits.length === 0 && firstBlockingHit),
      blocker: firstBlockingHit ? elementDescriptor(firstBlockingHit) : "NONE",
      hitTarget: elementDescriptor(firstHit),
      hitWithinCanvas: Boolean(canvasHits.length > 0)
    };
  }

  function getCanvas2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) {
      return { ready: false, ctx: null, status: "CANVAS_GET_CONTEXT_UNAVAILABLE" };
    }

    try {
      const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      return {
        ready: Boolean(ctx),
        ctx,
        status: ctx ? "CONTEXT_2D_READY" : "CONTEXT_2D_NULL"
      };
    } catch (error) {
      return {
        ready: false,
        ctx: null,
        status: `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 500)}`
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
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "CANVAS_INTERNAL_WIDTH_HEIGHT_ZERO"
      };
    }

    if (!isFunction(ctx.getImageData)) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "GET_IMAGE_DATA_UNAVAILABLE"
      };
    }

    try {
      const sampleSize = Math.max(4, Math.min(32, Math.floor(Math.min(width, height) / 28)));

      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.5, 0.25],
        [0.5, 0.75],
        [0.25, 0.5],
        [0.75, 0.5]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - sampleSize, Math.floor(width * px - sampleSize / 2)));
        const y = Math.max(0, Math.min(height - sampleSize, Math.floor(height * py - sampleSize / 2)));
        const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;

        sampleCount += data.length / 4;

        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const alpha = data[index + 3];

          if (alpha > 0) alphaPixelCount += 1;
          if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;
        }
      }

      const visible = visiblePixelCount > 0;

      return {
        status: visible ? "PIXEL_SAMPLE_VISIBLE" : alphaPixelCount > 0 ? "PIXEL_SAMPLE_ALPHA_ONLY" : "PIXEL_SAMPLE_BLANK",
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        reason: visible ? "VISIBLE_NON_BLANK_PIXELS_FOUND" : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function findCanvasNamespace(targetWindow) {
    const candidates = [];

    for (const path of CANVAS_NAMESPACE_PATHS) {
      const authority = readPath(targetWindow, path);
      if (!authority || !isObject(authority)) continue;

      const receipt = getReceiptFromAuthority(authority) || {};
      const contract = contractOf(receipt) || contractOf(authority);
      const receiptName = receiptOf(receipt) || receiptOf(authority);

      candidates.push({
        path,
        authority,
        receipt,
        contract,
        receiptName
      });
    }

    const selected =
      candidates.find((candidate) => ACCEPTED_CANVAS_CONTRACTS.includes(candidate.contract)) ||
      candidates[0] ||
      null;

    return {
      namespacePresent: Boolean(selected),
      namespacePath: selected ? selected.path : "NONE",
      namespaceContract: selected ? selected.contract || "UNKNOWN" : "UNKNOWN",
      namespaceReceipt: selected ? selected.receiptName || "UNKNOWN" : "UNKNOWN",
      namespaceReceiptObject: selected ? selected.receipt || {} : {},
      recognized: Boolean(selected && ACCEPTED_CANVAS_CONTRACTS.includes(selected.contract)),
      candidates: candidates.map((candidate) => ({
        path: candidate.path,
        contract: candidate.contract || "UNKNOWN",
        receipt: candidate.receiptName || "UNKNOWN"
      }))
    };
  }

  function namespaceMatchesDomSurface(namespaceInfo, canvas) {
    if (!namespaceInfo || !namespaceInfo.namespacePresent || !canvas) return false;

    const receipt = namespaceInfo.namespaceReceiptObject || {};

    const selectorMatch = firstKnown(
      receipt.canvasSelector,
      receipt.expressionSurfaceSelector,
      receipt.domCanvasSelector,
      ""
    );

    const width = safeNumber(firstKnown(receipt.canvasWidth, receipt.width, ""), -1);
    const height = safeNumber(firstKnown(receipt.canvasHeight, receipt.height, ""), -1);

    const contract = namespaceInfo.namespaceContract;
    const datasetContract =
      canvas.dataset
        ? firstKnown(
            canvas.dataset.hearthCanvasContract,
            canvas.dataset.contract,
            canvas.dataset.hearthCanvasInternalRenewalContract,
            ""
          )
        : "";

    const selectorConsistent =
      selectorMatch === "UNKNOWN" ||
      selectorMatch === "NONE" ||
      selectorMatch === "ARGUMENT" ||
      selectorMatch === "CREATED_BY_CANVAS_HUB" ||
      Boolean(selectorMatch && selectorMatch !== "UNKNOWN");

    const sizeConsistent =
      width < 0 ||
      height < 0 ||
      (safeNumber(canvas.width, 0) === width && safeNumber(canvas.height, 0) === height) ||
      (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0);

    const contractConsistent =
      ACCEPTED_CANVAS_CONTRACTS.includes(contract) ||
      ACCEPTED_CANVAS_CONTRACTS.includes(datasetContract);

    return Boolean(selectorConsistent && sizeConsistent && contractConsistent);
  }

  function resolveFailure(report) {
    const checks = [
      {
        failed: report.CANVAS_ELEMENT_FOUND !== true,
        coord: "CANVAS_ELEMENT_FOUND",
        cls: "CANVAS_ELEMENT_NOT_FOUND",
        reason: "NO_CANVAS_ELEMENT_MATCHED_EXPECTED_SELECTORS",
        owner: "CANVAS_EXPRESSION_SURFACE",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_FILE_CREATES_OR_MOUNTS_A_REAL_CANVAS_SURFACE"
      },
      {
        failed: report.CANVAS_MOUNT_FOUND !== true,
        coord: "CANVAS_MOUNT_FOUND",
        cls: "CANVAS_MOUNT_NOT_FOUND",
        reason: "NO_EXPECTED_HEARTH_CANVAS_MOUNT_FOUND",
        owner: "HTML_SHELL_OR_STAGE_MARKUP",
        file: "/showroom/globe/hearth/index.html",
        action: "RESTORE_EXPECTED_CANVAS_MOUNT_SELECTOR_OR_STAGE_MARKUP"
      },
      {
        failed: report.CANVAS_IN_MOUNT !== true,
        coord: "CANVAS_IN_MOUNT",
        cls: "CANVAS_OUTSIDE_EXPECTED_MOUNT",
        reason: "CANVAS_EXISTS_BUT_IS_NOT_CONTAINED_BY_EXPECTED_HEARTH_MOUNT",
        owner: "CANVAS_PLACEMENT_OR_HTML_MOUNT_ALIGNMENT",
        file: CANVAS_FILE,
        action: "ALIGN_CANVAS_PLACEMENT_WITH_HEARTH_CANVAS_MOUNT"
      },
      {
        failed: report.CANVAS_RECT_NONZERO !== true,
        coord: "CANVAS_RECT_NONZERO",
        cls: "CANVAS_ZERO_RECT",
        reason: "CANVAS_ELEMENT_EXISTS_BUT_BOUNDING_RECT_IS_ZERO",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT"
      },
      {
        failed: report.CANVAS_COMPUTED_VISIBLE !== true,
        coord: "CANVAS_COMPUTED_VISIBLE",
        cls: "CANVAS_COMPUTED_STYLE_HIDDEN",
        reason: "CANVAS_COMPUTED_STYLE_IS_NOT_VISIBLE",
        owner: "CSS_LAYOUT_OR_VISIBILITY_RULE",
        file: "/showroom/globe/hearth/index.html",
        action: "AUDIT_COMPUTED_STYLE_DISPLAY_VISIBILITY_OPACITY_POINTER_EVENTS"
      },
      {
        failed: report.CANVAS_VIEWPORT_INTERSECTING !== true,
        coord: "CANVAS_VIEWPORT_INTERSECTING",
        cls: "CANVAS_OUTSIDE_VIEWPORT",
        reason: "CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        owner: "CSS_LAYOUT_OR_SCROLL_POSITION",
        file: "/showroom/globe/hearth/index.html",
        action: "AUDIT_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION"
      },
      {
        failed: report.CANVAS_CONTEXT_2D_READY !== true,
        coord: "CANVAS_CONTEXT_2D_READY",
        cls: "CANVAS_CONTEXT_2D_NOT_READY",
        reason: "CANVAS_DOES_NOT_EXPOSE_A_2D_CONTEXT",
        owner: "CANVAS_EXPRESSION_SURFACE",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_ELEMENT_IS_A_STANDARD_2D_CANVAS_AND_NOT_WEBGL_ONLY"
      },
      {
        failed: report.CANVAS_PIXEL_VISIBLE !== true,
        coord: "CANVAS_PIXEL_VISIBLE",
        cls: "CANVAS_PIXEL_PROOF_NOT_VISIBLE",
        reason: "CANVAS_EXISTS_AND_CONTEXT_IS_READABLE_BUT_PIXEL_SAMPLE_HAS_NO_VISIBLE_NON_BLANK_PIXELS",
        owner: "CANVAS_DRAWING_OR_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_DRAW_PATH_EXECUTES_AND_WRITES_VISIBLE_PIXELS"
      },
      {
        failed: report.CANVAS_LAYER_BLOCKED === true,
        coord: "CANVAS_LAYER_BLOCKED",
        cls: "CANVAS_LAYER_OBSTRUCTED",
        reason: "CANVAS_IS_PRESENT_BUT_ELEMENT_FROM_POINT_HIT_TEST_INDICATES_OVERLAY_BLOCKAGE",
        owner: "CSS_LAYERING_OR_OVERLAY",
        file: "/showroom/globe/hearth/index.html",
        action: "AUDIT_Z_INDEX_POINTER_LAYER_AND_OVERLAY_ELEMENTS"
      },
      {
        failed: report.CANVAS_NAMESPACE_PRESENT !== true,
        coord: "CANVAS_NAMESPACE_PRESENT",
        cls: "CANVAS_NAMESPACE_NOT_PRESENT",
        reason: "DOM_CANVAS_EXISTS_BUT_CANVAS_AUTHORITY_NAMESPACE_NOT_FOUND",
        owner: "CANVAS_ALIAS_PUBLICATION",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_FILE_PUBLISHES_EXPECTED_GLOBAL_ALIASES"
      },
      {
        failed: report.CANVAS_PARENT_CONTRACT_RECOGNIZED !== true,
        coord: "CANVAS_PARENT_CONTRACT_RECOGNIZED",
        cls: "CANVAS_PARENT_CONTRACT_UNRECOGNIZED",
        reason: "CANVAS_NAMESPACE_EXISTS_BUT_CONTRACT_IS_NOT_IN_ACCEPTED_CANVAS_LINEAGE",
        owner: "CANVAS_CONTRACT_PUBLICATION",
        file: CANVAS_FILE,
        action: "VERIFY_CANVAS_PARENT_CONTRACT_AND_ACCEPTED_LINEAGE"
      },
      {
        failed: report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE !== true,
        coord: "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",
        cls: "CANVAS_NAMESPACE_DOM_MISMATCH",
        reason: "CANVAS_NAMESPACE_RECEIPT_DOES_NOT_MATCH_THE_DOM_CANVAS_SURFACE",
        owner: "CANVAS_RECEIPT_PUBLICATION",
        file: CANVAS_FILE,
        action: "ALIGN_CANVAS_RECEIPT_WITH_DOM_SURFACE_PROOF"
      }
    ];

    const first = checks.find((check) => check.failed);

    if (!first) {
      return {
        coordinate: "NONE",
        failureClass: "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM",
        reason: "DOM_CANVAS_NAMESPACE_PIXEL_AND_LAYER_PROOF_PASSED",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_STANDARD_CHECK"
      };
    }

    return {
      coordinate: first.coord,
      failureClass: first.cls,
      reason: first.reason,
      owner: first.owner,
      file: first.file,
      action: first.action
    };
  }

  function inspectCanvasSurfaceTruth(payload = {}) {
    const startedAt = nowIso();
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const baseReport = {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PACKET_v1",
      CONTRACT,
      RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      EXPECTED_CANVAS_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: startedAt,

      TARGET_CONTEXT_STATUS: context.targetAvailable ? "TARGET_CONTEXT_AVAILABLE" : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: context.targetSource,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      CANVAS_ELEMENT_FOUND: false,
      CANVAS_SELECTOR: "NONE",
      CANVAS_TAG: "NONE",
      CANVAS_ID: "NONE",
      CANVAS_CLASS: "NONE",
      CANVAS_DATASET_CONTRACT: "UNKNOWN",
      CANVAS_DATASET_RECEIPT: "UNKNOWN",

      CANVAS_MOUNT_FOUND: false,
      CANVAS_MOUNT_SELECTOR: "NONE",
      CANVAS_MOUNT_DESCRIPTOR: "NONE",
      CANVAS_IN_MOUNT: false,

      CANVAS_WIDTH_ATTRIBUTE: 0,
      CANVAS_HEIGHT_ATTRIBUTE: 0,
      CANVAS_RECT_LEFT: 0,
      CANVAS_RECT_TOP: 0,
      CANVAS_RECT_WIDTH: 0,
      CANVAS_RECT_HEIGHT: 0,
      CANVAS_RECT_NONZERO: false,

      CANVAS_COMPUTED_VISIBLE: false,
      CANVAS_COMPUTED_DISPLAY: "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: "UNKNOWN",
      CANVAS_COMPUTED_POSITION: "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: "UNKNOWN",

      CANVAS_VIEWPORT_WIDTH: 0,
      CANVAS_VIEWPORT_HEIGHT: 0,
      CANVAS_VIEWPORT_INTERSECTING: false,

      CANVAS_CONTEXT_2D_READY: false,
      CANVAS_CONTEXT_2D_STATUS: "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_VISIBLE: false,
      CANVAS_PIXEL_SAMPLE_COUNT: 0,
      CANVAS_VISIBLE_PIXEL_COUNT: 0,
      CANVAS_ALPHA_PIXEL_COUNT: 0,
      CANVAS_PIXEL_SAMPLE_REASON: "NOT_RUN",

      CANVAS_LAYER_BLOCKED: false,
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_LAYER_HIT_TARGET: "UNKNOWN",
      CANVAS_LAYER_HIT_WITHIN_CANVAS: false,

      CANVAS_NAMESPACE_PRESENT: false,
      CANVAS_NAMESPACE_PATH: "NONE",
      CANVAS_NAMESPACE_CONTRACT: "UNKNOWN",
      CANVAS_NAMESPACE_RECEIPT: "UNKNOWN",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: false,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: false,
      CANVAS_NAMESPACE_CANDIDATES: [],

      CANVAS_TRUTH_STATUS: "CANVAS_TRUTH_NOT_RUN",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "TARGET_CONTEXT_STATUS",
      CANVAS_TRUTH_FAILURE_CLASS: "TARGET_CONTEXT_UNAVAILABLE",
      CANVAS_TRUTH_FAILURE_REASON: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "DIAGNOSTIC_TARGET_ACCESS",
      CANVAS_TRUTH_RECOMMENDED_FILE: FILE,
      CANVAS_TRUTH_RECOMMENDED_ACTION: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE",

      SECONDARY_EVIDENCE_NOTES: "CANVAS_SURFACE_TRUTH_PROBE_STARTED",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    if (!context.targetAvailable) {
      lastReport = clonePlain(baseReport);
      lastReceipt = buildReceipt(baseReport);
      publish();
      return clonePlain(baseReport);
    }

    const canvasResult = firstElement(targetDocument, CANVAS_SELECTORS);
    const canvas = canvasResult.element;
    const mountResult = firstElement(targetDocument, MOUNT_SELECTORS);
    const mount = mountResult.element;

    const notes = [
      "CANVAS_SURFACE_TRUTH_PROBE_ACTIVE",
      "NO_PRODUCTION_MUTATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_CREATION",
      "NO_ROUTE_REPAIR",
      "NO_CONTROL_MUTATION",
      "NO_F13_OR_F21_CLAIM"
    ];

    const report = { ...baseReport };

    report.CANVAS_ELEMENT_FOUND = Boolean(canvas);
    report.CANVAS_SELECTOR = canvasResult.selector;
    report.CANVAS_TAG = canvas ? safeString(canvas.tagName, "UNKNOWN").toLowerCase() : "NONE";
    report.CANVAS_ID = canvas && canvas.id ? canvas.id : "NONE";

    try {
      report.CANVAS_CLASS = canvas && canvas.className ? safeString(canvas.className) : "NONE";
    } catch (_error) {
      report.CANVAS_CLASS = "UNREADABLE";
    }

    if (canvas && canvas.dataset) {
      report.CANVAS_DATASET_CONTRACT = firstKnown(
        canvas.dataset.hearthCanvasContract,
        canvas.dataset.contract,
        canvas.dataset.hearthCanvasInternalRenewalContract,
        "UNKNOWN"
      );
      report.CANVAS_DATASET_RECEIPT = firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt,
        "UNKNOWN"
      );
    }

    report.CANVAS_MOUNT_FOUND = Boolean(mount);
    report.CANVAS_MOUNT_SELECTOR = mountResult.selector;
    report.CANVAS_MOUNT_DESCRIPTOR = elementDescriptor(mount);
    report.CANVAS_IN_MOUNT = Boolean(canvas && mount && containsOrEquals(mount, canvas));

    if (canvas) {
      const rect = getRect(canvas);
      const css = cssSummary(targetWindow, canvas);
      const ctx = getCanvas2d(canvas);
      const pixel = samplePixels(canvas, ctx.ctx);
      const layer = inspectLayerBlock(targetWindow, targetDocument, canvas, rect);
      const namespace = findCanvasNamespace(targetWindow);
      const namespaceDomMatch = namespaceMatchesDomSurface(namespace, canvas);

      report.CANVAS_WIDTH_ATTRIBUTE = safeNumber(canvas.width, 0);
      report.CANVAS_HEIGHT_ATTRIBUTE = safeNumber(canvas.height, 0);
      report.CANVAS_RECT_LEFT = rect.left;
      report.CANVAS_RECT_TOP = rect.top;
      report.CANVAS_RECT_WIDTH = rect.width;
      report.CANVAS_RECT_HEIGHT = rect.height;
      report.CANVAS_RECT_NONZERO = rectNonzero(rect);

      report.CANVAS_COMPUTED_VISIBLE = computedVisible(targetWindow, canvas);
      report.CANVAS_COMPUTED_DISPLAY = css.display;
      report.CANVAS_COMPUTED_VISIBILITY = css.visibility;
      report.CANVAS_COMPUTED_OPACITY = css.opacity;
      report.CANVAS_COMPUTED_POSITION = css.position;
      report.CANVAS_COMPUTED_Z_INDEX = css.zIndex;
      report.CANVAS_COMPUTED_POINTER_EVENTS = css.pointerEvents;

      report.CANVAS_VIEWPORT_WIDTH = safeNumber(targetWindow.innerWidth, 0);
      report.CANVAS_VIEWPORT_HEIGHT = safeNumber(targetWindow.innerHeight, 0);
      report.CANVAS_VIEWPORT_INTERSECTING = viewportIntersecting(targetWindow, rect);

      report.CANVAS_CONTEXT_2D_READY = ctx.ready;
      report.CANVAS_CONTEXT_2D_STATUS = ctx.status;

      report.CANVAS_PIXEL_SAMPLE_STATUS = pixel.status;
      report.CANVAS_PIXEL_VISIBLE = pixel.visible;
      report.CANVAS_PIXEL_SAMPLE_COUNT = pixel.sampleCount;
      report.CANVAS_VISIBLE_PIXEL_COUNT = pixel.visiblePixelCount;
      report.CANVAS_ALPHA_PIXEL_COUNT = pixel.alphaPixelCount;
      report.CANVAS_PIXEL_SAMPLE_REASON = pixel.reason;

      report.CANVAS_LAYER_BLOCKED = layer.blocked;
      report.CANVAS_LAYER_BLOCKER = layer.blocker;
      report.CANVAS_LAYER_HIT_TARGET = layer.hitTarget;
      report.CANVAS_LAYER_HIT_WITHIN_CANVAS = layer.hitWithinCanvas;

      report.CANVAS_NAMESPACE_PRESENT = namespace.namespacePresent;
      report.CANVAS_NAMESPACE_PATH = namespace.namespacePath;
      report.CANVAS_NAMESPACE_CONTRACT = namespace.namespaceContract;
      report.CANVAS_NAMESPACE_RECEIPT = namespace.namespaceReceipt;
      report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE = namespaceDomMatch;
      report.CANVAS_PARENT_CONTRACT_RECOGNIZED = namespace.recognized;
      report.CANVAS_NAMESPACE_CANDIDATES = namespace.candidates;

      if (report.CANVAS_ELEMENT_FOUND) notes.push(`CANVAS_ELEMENT_FOUND:${report.CANVAS_SELECTOR}`);
      if (report.CANVAS_MOUNT_FOUND) notes.push(`CANVAS_MOUNT_FOUND:${report.CANVAS_MOUNT_SELECTOR}`);
      if (report.CANVAS_RECT_NONZERO) notes.push("CANVAS_RECT_NONZERO");
      if (report.CANVAS_CONTEXT_2D_READY) notes.push("CANVAS_CONTEXT_2D_READY");
      if (report.CANVAS_PIXEL_VISIBLE) notes.push("CANVAS_PIXEL_VISIBLE");
      if (report.CANVAS_NAMESPACE_PRESENT) notes.push(`CANVAS_NAMESPACE_PRESENT:${report.CANVAS_NAMESPACE_PATH}`);
      if (report.CANVAS_PARENT_CONTRACT_RECOGNIZED) notes.push("CANVAS_PARENT_CONTRACT_RECOGNIZED");
      if (report.CANVAS_LAYER_BLOCKED) notes.push(`CANVAS_LAYER_BLOCKED:${report.CANVAS_LAYER_BLOCKER}`);
    } else {
      const namespace = findCanvasNamespace(targetWindow);

      report.CANVAS_NAMESPACE_PRESENT = namespace.namespacePresent;
      report.CANVAS_NAMESPACE_PATH = namespace.namespacePath;
      report.CANVAS_NAMESPACE_CONTRACT = namespace.namespaceContract;
      report.CANVAS_NAMESPACE_RECEIPT = namespace.namespaceReceipt;
      report.CANVAS_PARENT_CONTRACT_RECOGNIZED = namespace.recognized;
      report.CANVAS_NAMESPACE_CANDIDATES = namespace.candidates;

      if (report.CANVAS_NAMESPACE_PRESENT) notes.push(`CANVAS_NAMESPACE_PRESENT_WITHOUT_DOM_CANVAS:${report.CANVAS_NAMESPACE_PATH}`);
    }

    const failure = resolveFailure(report);

    report.CANVAS_TRUTH_FIRST_FAILED_COORDINATE = failure.coordinate;
    report.CANVAS_TRUTH_FAILURE_CLASS = failure.failureClass;
    report.CANVAS_TRUTH_FAILURE_REASON = failure.reason;
    report.CANVAS_TRUTH_RECOMMENDED_OWNER = failure.owner;
    report.CANVAS_TRUTH_RECOMMENDED_FILE = failure.file;
    report.CANVAS_TRUTH_RECOMMENDED_ACTION = failure.action;

    report.CANVAS_TRUTH_STATUS =
      failure.coordinate === "NONE"
        ? "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM"
        : "CANVAS_SURFACE_TRUTH_FAILED_AT_COORDINATE";

    notes.push(`CANVAS_TRUTH_STATUS:${report.CANVAS_TRUTH_STATUS}`);
    notes.push(`CANVAS_TRUTH_FIRST_FAILED_COORDINATE:${report.CANVAS_TRUTH_FIRST_FAILED_COORDINATE}`);
    notes.push(`CANVAS_TRUTH_FAILURE_CLASS:${report.CANVAS_TRUTH_FAILURE_CLASS}`);

    report.SECONDARY_EVIDENCE_NOTES = notes.join(" | ");

    lastReport = clonePlain(report);
    lastReceipt = buildReceipt(report);
    publish();

    return clonePlain(report);
  }

  function buildReceipt(report = lastReport) {
    const r = report || {};

    return {
      packetType: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      diagnosticOnly: true,
      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", false),
      canvasSelector: getRaw(r, "CANVAS_SELECTOR", "NONE"),
      canvasMountFound: getRaw(r, "CANVAS_MOUNT_FOUND", false),
      canvasMountSelector: getRaw(r, "CANVAS_MOUNT_SELECTOR", "NONE"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", false),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", false),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", false),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", false),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", false),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", false),
      canvasLayerBlocked: getRaw(r, "CANVAS_LAYER_BLOCKED", false),
      canvasLayerBlocker: getRaw(r, "CANVAS_LAYER_BLOCKER", "UNKNOWN"),
      canvasNamespacePresent: getRaw(r, "CANVAS_NAMESPACE_PRESENT", false),
      canvasNamespacePath: getRaw(r, "CANVAS_NAMESPACE_PATH", "NONE"),
      canvasNamespaceContract: getRaw(r, "CANVAS_NAMESPACE_CONTRACT", "UNKNOWN"),
      canvasNamespaceMatchesDomSurface: getRaw(r, "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE", false),
      canvasParentContractRecognized: getRaw(r, "CANVAS_PARENT_CONTRACT_RECOGNIZED", false),

      canvasTruthStatus: getRaw(r, "CANVAS_TRUTH_STATUS", "CANVAS_TRUTH_NOT_RUN"),
      canvasTruthFirstFailedCoordinate: getRaw(r, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN"),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      canvasTruthFailureReason: getRaw(r, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN"),
      canvasTruthRecommendedOwner: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN"),
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN"),

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getPacketTextApiAvailable: true,

      ...NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "CANVAS_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "DIAGNOSTIC_TIMESTAMP",

      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_TAG",
      "CANVAS_ID",
      "CANVAS_CLASS",
      "CANVAS_DATASET_CONTRACT",
      "CANVAS_DATASET_RECEIPT",

      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_MOUNT_DESCRIPTOR",
      "CANVAS_IN_MOUNT",

      "CANVAS_WIDTH_ATTRIBUTE",
      "CANVAS_HEIGHT_ATTRIBUTE",
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

      "CANVAS_VIEWPORT_WIDTH",
      "CANVAS_VIEWPORT_HEIGHT",
      "CANVAS_VIEWPORT_INTERSECTING",

      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",

      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "CANVAS_LAYER_BLOCKED",
      "CANVAS_LAYER_BLOCKER",
      "CANVAS_LAYER_HIT_TARGET",
      "CANVAS_LAYER_HIT_WITHIN_CANVAS",

      "CANVAS_NAMESPACE_PRESENT",
      "CANVAS_NAMESPACE_PATH",
      "CANVAS_NAMESPACE_CONTRACT",
      "CANVAS_NAMESPACE_RECEIPT",
      "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",
      "CANVAS_PARENT_CONTRACT_RECOGNIZED",
      "CANVAS_NAMESPACE_CANDIDATES",

      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",

      "SECONDARY_EVIDENCE_NOTES",

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

  function composePacketText(report = lastReport) {
    const r = report || inspectCanvasSurfaceTruth({});

    return orderedFields(r)
      .map((field) => line(field, getRaw(r, field, "UNKNOWN")))
      .join("\n");
  }

  function getReport() {
    return clonePlain(lastReport || inspectCanvasSurfaceTruth({}));
  }

  function getReceiptLight() {
    return clonePlain(lastReceipt || buildReceipt(lastReport || {}));
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      report: clonePlain(lastReport || {}),
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice(),
      canvasNamespacePaths: CANVAS_NAMESPACE_PATHS.slice(),
      supportsCanvasElementProbe: true,
      supportsCanvasMountProbe: true,
      supportsCanvasRectProbe: true,
      supportsComputedVisibilityProbe: true,
      supportsViewportIntersectionProbe: true,
      supportsContext2dProbe: true,
      supportsPixelSampleProbe: true,
      supportsLayerObstructionProbe: true,
      supportsNamespaceDomMatchProbe: true,
      supportsCoordinateSpecificFailure: true,
      ...NO_CLAIMS
    };
  }

  function getPacketText() {
    return composePacketText(lastReport || inspectCanvasSurfaceTruth({}));
  }

  function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runProbe(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function inspect(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runDiagnostic(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthProbe = api;
    root.HEARTH.diagnosticProbeCanvasTruth = api;
    root.HEARTH.diagnosticCanvasTruthProbe = api;
    root.HEARTH.diagnosticRailProbeCanvasSurfaceTruth = api;

    root.DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT =
      lastReport ? composePacketText(lastReport) : "";

    return true;
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    canvasFile: CANVAS_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    diagnosticOnly: true,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,

    runProbeCanvasSurfaceTruth,
    runCanvasSurfaceTruth,
    runProbe,
    inspect,
    runDiagnostic,

    getReport,
    getReceiptLight,
    getReceipt,
    getPacketText,

    canvasSelectors: CANVAS_SELECTORS,
    mountSelectors: MOUNT_SELECTORS,
    canvasNamespacePaths: CANVAS_NAMESPACE_PATHS,
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS,

    supportsCanvasElementProbe: true,
    supportsCanvasMountProbe: true,
    supportsCanvasRectProbe: true,
    supportsComputedVisibilityProbe: true,
    supportsViewportIntersectionProbe: true,
    supportsContext2dProbe: true,
    supportsPixelSampleProbe: true,
    supportsLayerObstructionProbe: true,
    supportsNamespaceDomMatchProbe: true,
    supportsCoordinateSpecificFailure: true,

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

    ...NO_CLAIMS
  });

  lastReceipt = buildReceipt({});
  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
