// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Full-file replacement.
// Diagnostic rail WEST child only.
// Implementation refinement:
// - HEARTH_DIAGNOSTIC_WEST_HIT_TEST_OBSERVABILITY_REFINEMENT_TNT_v1
// Purpose:
// - Provide rendered-target / interaction-authority evidence for the Hearth diagnostic rail.
// - Preserve WEST as read-only rendered-target evidence lane.
// - Add hit-test observability fields so UNREADABLE hit-test results can be diagnosed.
// - Inspect the rendered Hearth target where browser policy allows.
// - Support CASE_1, CASE_2, CASE_3, CASE_4, CASE_6, and CASE_7 evidence only for NORTH adjudication.
// - Preserve EAST as CASE_5 served-source evidence lane.
// - Preserve NORTH as final PRIMARY_CASE and recommendation authority.
// - Preserve protected production files as read-only observation targets.
// - Preserve no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
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

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";
  const IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_WEST_HIT_TEST_OBSERVABILITY_REFINEMENT_TNT_v1";
  const VERSION = "2026-06-02.hearth-diagnostic-west-hit-test-observability-refinement-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";

  const SHOW_RECEIPT_SELECTOR = "[data-hearth-toggle-receipt]";
  const RECEIPT_PANEL_SELECTOR = "#hearthReceiptPanel, [data-hearth-receipt-box]";
  const RECEIPT_TEXT_SELECTOR = "[data-hearth-receipt-text]";

  const VISIBLE_STATUS_SELECTORS = Object.freeze([
    "[data-hearth-latest-event]",
    "[data-hearth-heartbeat-text]",
    "#hearth-route-status",
    "[data-hearth-route-status]"
  ]);

  const STAGE_MOUNT_CANVAS_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "canvas"
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
    INSUFFICIENT_EVIDENCE: FALLBACK.INSUFFICIENT_EVIDENCE
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

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

  function bounded(value, limit = 1400) {
    return safeString(value).replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function safeBoolString(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === 0 || value === "0") return "false";
    return fallback;
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

  function normalizeError(error, prefix) {
    const name = error && error.name ? safeString(error.name) : "ERROR";
    const message = error && error.message ? safeString(error.message) : safeString(error, "UNKNOWN_ERROR");
    return `${prefix || "ERROR"}:${bounded(`${name}:${message}`, 700)}`;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1200);
    if (!clean) return;
    if (!state.westSecondaryEvidenceNotes.includes(clean)) {
      state.westSecondaryEvidenceNotes.push(clean);
    }
  }

  function cssEscape(value) {
    const text = safeString(value);
    try {
      if (root.CSS && isFunction(root.CSS.escape)) return root.CSS.escape(text);
    } catch (_error) {
      // Continue to fallback.
    }
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

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
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

  function readReceipt(authority) {
    try {
      if (!authority || !isObject(authority)) return null;

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      }

      if (isFunction(authority.getReport)) {
        const report = authority.getReport();
        return isObject(report) ? report : null;
      }

      if (isObject(authority.receiptPacket)) return authority.receiptPacket;
      if (isObject(authority.receipt)) return authority.receipt;
      if (authority.contract || authority.receipt || authority.version) return authority;

      return null;
    } catch (_error) {
      return null;
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

    return safeBoolString(
      point.x >= 0 &&
      point.y >= 0 &&
      point.x <= viewport.width &&
      point.y <= viewport.height
    );
  }

  function makeState() {
    return {
      westStatus: STATUS.READY,
      westContract: CONTRACT,
      westReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,

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

      syntheticActivationAllowedByDefault: false,
      syntheticActivationPermittedByNorth: false,
      syntheticActivationAttempted: false,
      syntheticActivationHeldReason: FALLBACK.HELD,

      readOnlyInspectionComplete: false,
      hearthTargetConfirmed: false,
      sourceMismatchControlling: false,

      case1Support: SUPPORT.UNKNOWN,
      case2Support: SUPPORT.UNKNOWN,
      case3Support: SUPPORT.UNKNOWN,
      case4Support: SUPPORT.UNKNOWN,
      case6Support: SUPPORT.UNKNOWN,
      case7Support: SUPPORT.UNKNOWN,

      westSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
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

      const route = safeString(html.getAttribute("data-route") || html.dataset.route || "");
      const page = safeString(html.getAttribute("data-page") || html.dataset.page || "");
      const bodyRoute = body ? safeString(body.getAttribute("data-route") || body.dataset.route || "") : "";

      if (route === TARGET_ROUTE || route === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (bodyRoute === TARGET_ROUTE || bodyRoute === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (/hearth/i.test(page)) return true;
      if (q(targetDocument, SHOW_RECEIPT_SELECTOR)) return true;
      if (q(targetDocument, "#hearthGlobeStage, [data-hearth-globe-stage], #hearthCanvasMount, [data-hearth-canvas-mount]")) return true;

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

      state.frameVisibleToDiagnosticRoute = safeBoolString(rect.width > 0 && rect.height > 0);

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
    if (options && options.sourceMismatchControlling === true) {
      state.sourceMismatchControlling = true;
      addNote(state, "CASE_5_CONTROLLING_FROM_NORTH_RENDERED_READ_STILL_ALLOWED_AS_SECONDARY_EVIDENCE_ONLY");
    }

    if (options && options.frameElement) {
      readFrameObservability(options.frameElement, state);
    }

    if (options && options.targetDocument && options.targetDocument.documentElement) {
      const targetDocument = options.targetDocument;
      const targetWindow = targetDocument.defaultView || (options && options.targetWindow) || null;

      state.diagnosticTargetAccessStatus = ACCESS.RENDERED_TARGET_ACCESSIBLE;
      state.diagnosticTargetAccessError = "";

      if (!validateHearthTarget(targetDocument, targetWindow, state)) {
        return { targetDocument: null, targetWindow: null, accessStatus: state.diagnosticTargetAccessStatus };
      }

      return { targetDocument, targetWindow, accessStatus: ACCESS.RENDERED_TARGET_ACCESSIBLE };
    }

    if (options && options.targetWindow) {
      try {
        const targetWindow = options.targetWindow;
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

    if (options && options.frameElement) {
      const frame = options.frameElement;
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

    state.showReceiptSelectorMatched = safeBoolString(Boolean(button));
    state.showReceiptButtonExists = safeBoolString(Boolean(button));
    state.receiptPanelExists = safeBoolString(Boolean(panel));
    state.receiptTextNodeExists = safeBoolString(Boolean(textNode));
    state.receiptPanelStateBeforeAction = readPanelState(panel);

    if (!button) addNote(state, "SHOW_RECEIPT_BUTTON_NOT_FOUND");
    if (!panel) addNote(state, "RECEIPT_PANEL_NOT_FOUND");
    if (!textNode) addNote(state, "RECEIPT_TEXT_NODE_NOT_FOUND");

    if (!button || !panel || !textNode) {
      state.case4Support = SUPPORT.TRUE;
    } else {
      state.case4Support = SUPPORT.FALSE;
    }

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
      state.targetViewportWidth = Number.isFinite(viewport.width) ? String(Math.round(viewport.width)) : FALLBACK.UNKNOWN;
      state.targetViewportHeight = Number.isFinite(viewport.height) ? String(Math.round(viewport.height)) : FALLBACK.UNKNOWN;

      if (!rect) {
        state.hitTestUnreadableReason = "SHOW_RECEIPT_RECT_UNREADABLE";
        return { error: "SHOW_RECEIPT_RECT_UNREADABLE" };
      }

      if (rect.width <= 0 || rect.height <= 0) {
        state.hitTestUnreadableReason = "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE";
        addNote(state, "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE");
        return { error: "SHOW_RECEIPT_RECT_EMPTY_OR_ZERO_SIZE", rect };
      }

      const x = Math.round(rect.left + rect.width / 2);
      const y = Math.round(rect.top + rect.height / 2);
      const point = { x, y };

      state.showReceiptCenterPoint = `x:${x};y:${y}`;
      state.centerPointInViewport = pointInViewport(point, viewport);

      if (state.centerPointInViewport !== "true") {
        state.hitTestUnreadableReason = "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT";
        addNote(state, "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT");
        return { error: "BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT", x, y, rect, targetDocument };
      }

      state.elementFromPointAvailable = safeBoolString(isFunction(targetDocument.elementFromPoint));

      if (!isFunction(targetDocument.elementFromPoint)) {
        state.hitTestUnreadableReason = "ELEMENT_FROM_POINT_UNAVAILABLE";
        return { error: "ELEMENT_FROM_POINT_UNAVAILABLE", x, y, rect, targetDocument };
      }

      const target = targetDocument.elementFromPoint(x, y);

      if (!target) {
        state.elementFromPointResult = "NULL";
        state.hitTestUnreadableReason = "ELEMENT_FROM_POINT_RETURNED_NULL";
        addNote(state, "ELEMENT_FROM_POINT_RETURNED_NULL");
        return { error: "ELEMENT_FROM_POINT_RETURNED_NULL", x, y, rect, targetDocument };
      }

      state.elementFromPointResult = selectorFor(target);
      state.hitTestUnreadableReason = "none";

      return { x, y, rect, target, targetDocument };
    } catch (error) {
      const normalized = normalizeError(error, "HIT_TEST_ERROR");
      state.hitTestUnreadableReason = normalized;
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
      return null;
    }

    const hit = centerHit(button, state);

    if (!hit || hit.error || !hit.target) {
      const error = hit && hit.error ? hit.error : "HIT_TEST_TARGET_UNREADABLE";
      state.showReceiptHitTestTarget = FALLBACK.UNREADABLE;
      state.showReceiptHitTestTargetSelector = FALLBACK.UNREADABLE;
      state.showReceiptHitTestTargetTag = FALLBACK.UNREADABLE;
      state.showReceiptTargetIsButton = FALLBACK.UNKNOWN;
      state.targetPointerEvents = FALLBACK.UNREADABLE;

      if (state.hitTestUnreadableReason === FALLBACK.UNKNOWN) {
        state.hitTestUnreadableReason = error;
      }

      addNote(state, `HIT_TEST_TARGET_UNREADABLE:${state.hitTestUnreadableReason}`);
      return null;
    }

    const target = hit.target;
    const targetIsButton = target === button || button.contains(target);

    state.showReceiptHitTestTarget = selectorFor(target);
    state.showReceiptHitTestTargetSelector = selectorFor(target);
    state.showReceiptHitTestTargetTag = target.tagName ? target.tagName.toLowerCase() : "node";
    state.showReceiptTargetIsButton = safeBoolString(targetIsButton);
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

    const ownerSignals = [];

    for (const candidate of STAGE_MOUNT_CANVAS_SELECTORS) {
      try {
        if (target.matches && target.matches(candidate)) ownerSignals.push(candidate);
        if (target.closest && target.closest(candidate)) ownerSignals.push(candidate);
      } catch (_error) {
        // Ignore selector failure.
      }
    }

    const selector = selectorFor(target);

    state.overlayAboveControl = "true";
    state.overlayOwner = ownerSignals.length
      ? `TARGET_MATCHES_OR_DESCENDS_FROM:${Array.from(new Set(ownerSignals)).join(",")};TARGET=${selector}`
      : `UNKNOWN_LAYER_TARGET=${selector}`;

    state.case1Support = SUPPORT.TRUE;
    addNote(state, `OVERLAY_OR_LAYER_ABOVE_SHOW_RECEIPT:${state.overlayOwner}`);
  }

  function readSafeDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function readGlobalSuppression(targetDocument, targetWindow, state) {
    try {
      const dataset = readSafeDataset(targetDocument);

      const indexSuppressesVisibleControls = (
        dataset.hearthIndexV53SuppressesNonCockpitControls === "true" ||
        dataset.indexSuppressesVisibleControls === "true" ||
        dataset.hearthIndexSuppressesVisibleControls === "true"
      );

      const indexShieldActive = (
        dataset.hearthIndexControlSurfaceEarlyActivationShieldActive === "true" ||
        dataset.indexControlSurfaceEarlyActivationShieldActive === "true" ||
        dataset.hearthIndexJsControlSurfaceEventShieldActive === "true"
      );

      if (indexSuppressesVisibleControls) {
        state.globalEventSuppressionFound = "true";
        state.likelySuppressionOwner = "/showroom/globe/hearth/index.js";
        state.indexSuppressesVisibleControls = "true";
        state.case3Support = state.showReceiptTargetIsButton === "true" ? SUPPORT.TRUE : SUPPORT.UNKNOWN;
        addNote(state, "INDEX_VISIBLE_CONTROL_SUPPRESSION_MARKER_FOUND");
        return;
      }

      const indexApi = readPath(targetWindow, "HEARTH.indexJs") ||
        readPath(targetWindow, "HEARTH_INDEX_JS") ||
        readPath(targetWindow, "HEARTH.indexRuntimeHost");

      const indexReceipt = readReceipt(indexApi);

      if (indexReceipt && indexReceipt.indexSuppressesVisibleControls === true) {
        state.globalEventSuppressionFound = "true";
        state.likelySuppressionOwner = "/showroom/globe/hearth/index.js";
        state.indexSuppressesVisibleControls = "true";
        state.case3Support = state.showReceiptTargetIsButton === "true" ? SUPPORT.TRUE : SUPPORT.UNKNOWN;
        addNote(state, "INDEX_RECEIPT_SUPPRESSION_MARKER_FOUND");
        return;
      }

      if (indexShieldActive) {
        state.globalEventSuppressionFound = FALLBACK.UNKNOWN;
        state.likelySuppressionOwner = "INDEX_SHIELD_ACTIVE_BUT_NO_GLOBAL_SUPPRESSION_PROOF";
        state.indexSuppressesVisibleControls = FALLBACK.UNKNOWN;
        addNote(state, "INDEX_CONTROL_SHIELD_MARKER_PRESENT");
        return;
      }

      state.globalEventSuppressionFound = FALLBACK.UNKNOWN;
      state.likelySuppressionOwner = FALLBACK.UNKNOWN;
      state.indexSuppressesVisibleControls = FALLBACK.UNKNOWN;
    } catch (error) {
      state.globalEventSuppressionFound = FALLBACK.UNREADABLE;
      state.likelySuppressionOwner = FALLBACK.UNKNOWN;
      state.indexSuppressesVisibleControls = FALLBACK.UNKNOWN;
      addNote(state, normalizeError(error, "GLOBAL_SUPPRESSION_READ_ERROR"));
    }
  }

  function readRuntimeRelease(targetDocument, targetWindow, state) {
    try {
      const dataset = readSafeDataset(targetDocument);

      const datasetState = [
        dataset.hearthRuntimeReleaseState,
        dataset.hearthRuntimeReleaseHeldReason,
        dataset.hearthPostgameStatus,
        dataset.hearthIndexPostgameStatus,
        dataset.hearthFirstFailedCoordinate
      ].filter(Boolean).join(" | ");

      let globalState = "";
      let functionalLockMarker = false;

      const candidates = [
        "HEARTH.indexJs",
        "HEARTH.indexRuntimeHost",
        "HEARTH.routeConductor",
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH_INDEX_JS",
        "LAB_RUNTIME_TABLE",
        "DEXTER_LAB.runtimeTable"
      ];

      for (const path of candidates) {
        const api = readPath(targetWindow, path);
        const receipt = readReceipt(api);
        if (!receipt) continue;

        const receiptState = [
          receipt.runtimeReleaseState,
          receipt.runtimeReleaseHeldReason,
          receipt.postgameStatus,
          receipt.firstFailedCoordinate,
          receipt.activeStageId,
          receipt.failure,
          receipt.failedCheckpoint
        ].filter(Boolean).join(" | ");

        if (receipt.runtimeReleaseIsLock === true || receipt.runtimeLock === true || receipt.queueBlocked === true) {
          functionalLockMarker = true;
        }

        if (receiptState) {
          globalState = receiptState;
          break;
        }
      }

      const visibleStatus = state.currentVisibleHearthStatus && state.currentVisibleHearthStatus !== FALLBACK.NOT_FOUND
        ? state.currentVisibleHearthStatus
        : "";

      const combined = safeTrim([datasetState, globalState, visibleStatus].filter(Boolean).join(" | "));

      state.runtimeReleaseState = combined || FALLBACK.UNKNOWN;

      const textShowsProgress = /RUNTIME_RELEASE_IN_PROGRESS|RUNTIME_RELEASE_STARTED|WAITING_RUNTIME_RELEASE|RELEASE_IN_PROGRESS/i.test(combined);
      const textShowsBlocking = /LOCK|BLOCK|HELD|STUCK|FAILED|ERROR|FIRST_FAILED|QUEUE_BLOCKED/i.test(combined);

      if (functionalLockMarker || (textShowsProgress && textShowsBlocking && Boolean(datasetState || globalState))) {
        state.runtimeReleaseIsLock = "true";
        state.case6Support = SUPPORT.TRUE;
        addNote(state, "RUNTIME_RELEASE_FUNCTIONAL_LOCK_EVIDENCE_PRESENT");
        return;
      }

      if (textShowsProgress && !functionalLockMarker) {
        state.runtimeReleaseIsLock = FALLBACK.UNKNOWN;
        state.case6Support = SUPPORT.UNKNOWN;
        addNote(state, "RUNTIME_RELEASE_IN_PROGRESS_VISIBLE_TEXT_ONLY_LOCK_NOT_PROVEN");
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

  function coreEvidenceComplete(state) {
    return Boolean(
      state.diagnosticTargetAccessStatus === ACCESS.RENDERED_TARGET_ACCESSIBLE &&
      state.hearthTargetConfirmed === true &&
      state.currentVisibleHearthStatus !== FALLBACK.UNKNOWN &&
      state.showReceiptButtonExists !== FALLBACK.UNKNOWN &&
      state.receiptPanelExists !== FALLBACK.UNKNOWN &&
      state.receiptTextNodeExists !== FALLBACK.UNKNOWN &&
      state.showReceiptTargetIsButton !== FALLBACK.UNKNOWN &&
      state.targetPointerEvents !== FALLBACK.UNKNOWN &&
      state.ancestorBlockerFound !== FALLBACK.UNKNOWN &&
      state.overlayAboveControl !== FALLBACK.UNKNOWN &&
      state.runtimeReleaseState !== FALLBACK.UNKNOWN &&
      state.hitTestUnreadableReason !== FALLBACK.UNKNOWN
    );
  }

  function readOnlyInspectionComplete(state) {
    const complete = coreEvidenceComplete(state);
    state.readOnlyInspectionComplete = complete;

    if (!complete) {
      addNote(state, "READ_ONLY_INSPECTION_PARTIAL");
    }

    return complete;
  }

  function controllingCaseBlocksSynthetic(state) {
    return Boolean(
      state.sourceMismatchControlling ||
      state.case1Support === SUPPORT.TRUE ||
      state.case4Support === SUPPORT.TRUE ||
      state.case6Support === SUPPORT.TRUE ||
      state.case7Support === SUPPORT.TRUE
    );
  }

  function syntheticActivationAllowed(options, state) {
    if (state.syntheticActivationAllowedByDefault !== false) return false;

    const northPermits = Boolean(
      options &&
      (
        options.allowSyntheticActivation === true ||
        options.northPermitsSyntheticActivation === true ||
        options.syntheticActivationPermittedByNorth === true
      )
    );

    state.syntheticActivationPermittedByNorth = northPermits;

    if (!northPermits) {
      state.syntheticActivationHeldReason = "HELD_REQUIRES_NORTH_PERMISSION";
      return false;
    }

    if (!state.hearthTargetConfirmed) {
      state.syntheticActivationHeldReason = "HELD_TARGET_NOT_CONFIRMED_AS_HEARTH";
      return false;
    }

    if (!state.readOnlyInspectionComplete) {
      state.syntheticActivationHeldReason = "HELD_READ_ONLY_INSPECTION_INCOMPLETE";
      return false;
    }

    if (state.showReceiptButtonExists !== "true") {
      state.syntheticActivationHeldReason = "HELD_SHOW_RECEIPT_BUTTON_MISSING";
      return false;
    }

    if (state.receiptPanelExists !== "true") {
      state.syntheticActivationHeldReason = "HELD_RECEIPT_PANEL_MISSING";
      return false;
    }

    if (state.receiptTextNodeExists !== "true") {
      state.syntheticActivationHeldReason = "HELD_RECEIPT_TEXT_NODE_MISSING";
      return false;
    }

    if (state.showReceiptTargetIsButton !== "true") {
      state.syntheticActivationHeldReason = "HELD_HIT_TEST_DOES_NOT_REACH_SHOW_RECEIPT";
      return false;
    }

    if (state.overlayAboveControl === "true" || state.ancestorBlockerFound === "true") {
      state.syntheticActivationHeldReason = "HELD_OVERLAY_OR_ANCESTOR_BLOCKER_CONTROLS";
      return false;
    }

    if (state.sourceMismatchControlling) {
      state.syntheticActivationHeldReason = "HELD_CASE_5_CONTROLLING_FROM_NORTH";
      return false;
    }

    if (state.runtimeReleaseIsLock === "true") {
      state.syntheticActivationHeldReason = "HELD_RUNTIME_LOCK_CONTROLS";
      return false;
    }

    if (state.globalEventSuppressionFound === "true" && state.showReceiptTargetIsButton === "true") {
      state.syntheticActivationHeldReason = "MAY_TEST_CASE_2_VS_CASE_3_WITH_NORTH_PERMISSION";
      return true;
    }

    state.syntheticActivationHeldReason = "MAY_TEST_HANDLER_EXECUTION_WITH_NORTH_PERMISSION";
    return true;
  }

  async function runSyntheticActivationIfAllowed(options, button, panel, textNode, state) {
    const allowed = syntheticActivationAllowed(options, state);

    if (!allowed) {
      state.showReceiptActionResult = FALLBACK.HELD;
      state.receiptPanelStateAfterAction = readPanelState(panel);
      addNote(state, `SYNTHETIC_ACTIVATION_HELD:${state.syntheticActivationHeldReason}`);
      return;
    }

    state.syntheticActivationAttempted = true;

    try {
      const beforePanelState = readPanelState(panel);
      const beforeText = textNode ? safeTrim(textNode.textContent) : "";

      if (isFunction(button.click)) {
        button.click();
      } else {
        const ownerWindow = button.ownerDocument && button.ownerDocument.defaultView
          ? button.ownerDocument.defaultView
          : root;

        const event = new ownerWindow.MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: ownerWindow
        });

        button.dispatchEvent(event);
      }

      await new Promise((resolve) => root.setTimeout(resolve, 120));

      const afterPanelState = readPanelState(panel);
      const afterText = textNode ? safeTrim(textNode.textContent) : "";

      state.receiptPanelStateAfterAction = afterPanelState;

      const panelChanged = beforePanelState !== afterPanelState;
      const textChanged = beforeText !== afterText || afterText.length > 0;

      if (panelChanged || textChanged) {
        state.showReceiptActionResult = panelChanged && textChanged
          ? "ACTION_TOGGLED_PANEL_AND_WROTE_TEXT"
          : panelChanged
            ? "ACTION_TOGGLED_PANEL_ONLY"
            : "ACTION_WROTE_TEXT_ONLY";
        state.case2Support = SUPPORT.FALSE;
        state.case3Support = SUPPORT.FALSE;
      } else {
        state.showReceiptActionResult = "ACTION_DID_NOT_CHANGE_PANEL_OR_TEXT";

        if (state.globalEventSuppressionFound === "true") {
          state.case3Support = SUPPORT.TRUE;
          state.case2Support = SUPPORT.UNKNOWN;
        } else {
          state.case2Support = SUPPORT.TRUE;
          state.case3Support = SUPPORT.UNKNOWN;
        }
      }

      addNote(state, `SYNTHETIC_ACTIVATION_OBSERVATIONAL_RESULT:${state.showReceiptActionResult}`);
    } catch (error) {
      state.showReceiptActionResult = "SYNTHETIC_ACTIVATION_ERROR";
      state.receiptPanelStateAfterAction = readPanelState(panel);
      state.case2Support = SUPPORT.UNKNOWN;
      state.case3Support = SUPPORT.UNKNOWN;
      addNote(state, normalizeError(error, "SYNTHETIC_ACTIVATION_ERROR"));
    }
  }

  function deriveSupportFlags(state) {
    if (state.case1Support !== SUPPORT.TRUE) {
      if (
        state.showReceiptButtonExists === "true" &&
        state.showReceiptTargetIsButton === "true" &&
        state.ancestorBlockerFound === "false" &&
        state.overlayAboveControl === "false"
      ) {
        state.case1Support = SUPPORT.FALSE;
      } else if (
        state.showReceiptButtonExists === FALLBACK.UNKNOWN ||
        state.showReceiptTargetIsButton === FALLBACK.UNKNOWN
      ) {
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

    if (state.case2Support === SUPPORT.UNKNOWN && state.showReceiptActionResult === FALLBACK.HELD) {
      state.case2Support = FALLBACK.HELD;
    }

    if (state.case3Support === SUPPORT.UNKNOWN && state.showReceiptActionResult === FALLBACK.HELD) {
      state.case3Support = FALLBACK.HELD;
    }
  }

  function deriveRenderedReadStatus(state) {
    if (state.diagnosticTargetAccessStatus !== ACCESS.RENDERED_TARGET_ACCESSIBLE) {
      state.westRenderedReadComplete = "false";
      state.westRenderedReadStatus = state.case7Support === SUPPORT.TRUE ? FALLBACK.PARTIAL : FALLBACK.FAILED;
      return;
    }

    if (coreEvidenceComplete(state)) {
      state.westRenderedReadComplete = "true";
      state.westRenderedReadStatus = FALLBACK.COMPLETE;
      return;
    }

    state.westRenderedReadComplete = "false";
    state.westRenderedReadStatus = FALLBACK.PARTIAL;
  }

  function makeEvidencePacket(state) {
    return {
      WEST_STATUS: state.westStatus,
      WEST_CONTRACT: CONTRACT,
      WEST_RECEIPT: RECEIPT,
      WEST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
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

      CASE_1_SUPPORT: state.case1Support,
      CASE_2_SUPPORT: state.case2Support,
      CASE_3_SUPPORT: state.case3Support,
      CASE_4_SUPPORT: state.case4Support,
      CASE_6_SUPPORT: state.case6Support,
      CASE_7_SUPPORT: state.case7Support,

      WEST_SECONDARY_EVIDENCE_NOTES: state.westSecondaryEvidenceNotes.length
        ? state.westSecondaryEvidenceNotes.join(" | ")
        : "none"
    };
  }

  async function runWestRenderedRead(options = {}) {
    const state = makeState();
    state.westStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const target = resolveTargetFromOptions(options, state);

      if (!target || !target.targetDocument) {
        deriveSupportFlags(state);
        deriveRenderedReadStatus(state);

        state.currentVisibleHearthStatus = state.currentVisibleHearthStatus === FALLBACK.UNKNOWN
          ? FALLBACK.INACCESSIBLE
          : state.currentVisibleHearthStatus;

        state.showReceiptSelectorMatched = FALLBACK.INACCESSIBLE;
        state.showReceiptButtonExists = FALLBACK.INACCESSIBLE;
        state.showReceiptHitTestTarget = FALLBACK.INACCESSIBLE;
        state.showReceiptHitTestTargetSelector = FALLBACK.INACCESSIBLE;
        state.showReceiptHitTestTargetTag = FALLBACK.INACCESSIBLE;
        state.showReceiptTargetIsButton = FALLBACK.INACCESSIBLE;
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

        deriveSupportFlags(state);
        deriveRenderedReadStatus(state);

        state.westStatus = state.westRenderedReadStatus === FALLBACK.FAILED ? STATUS.FAILED : STATUS.PARTIAL;
        state.updatedAt = nowIso();

        publish(state);

        return {
          ok: true,
          contract: CONTRACT,
          receipt: RECEIPT,
          implementationContract: IMPLEMENTATION_CONTRACT,
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
      readGlobalSuppression(targetDocument, targetWindow, state);
      readRuntimeRelease(targetDocument, targetWindow, state);

      readOnlyInspectionComplete(state);
      deriveSupportFlags(state);

      if (!controllingCaseBlocksSynthetic(state)) {
        await runSyntheticActivationIfAllowed(options, rendered.button, rendered.panel, rendered.textNode, state);
      } else {
        state.showReceiptActionResult = FALLBACK.HELD;
        state.receiptPanelStateAfterAction = readPanelState(rendered.panel);
        state.syntheticActivationHeldReason = state.sourceMismatchControlling
          ? "HELD_CASE_5_CONTROLLING_FROM_NORTH"
          : "HELD_CONTROLLING_CASE_EVIDENCE_PRESENT";
        addNote(state, `SYNTHETIC_ACTIVATION_HELD:${state.syntheticActivationHeldReason}`);
      }

      deriveSupportFlags(state);
      deriveRenderedReadStatus(state);

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
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getWestReceipt() {
    return {
      childRole: "WEST_RENDERED_TARGET_AUTHORITY_PROBE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,

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

      runWestRenderedReadApiAvailable: true,
      getWestReceiptApiAvailable: true,
      getWestStateApiAvailable: true,

      renderedTargetAuthorityProbeOwned: true,
      targetAccessResolutionOwned: true,
      hearthTargetValidityCheckOwned: true,
      showReceiptDetectionOwned: true,
      receiptPanelDetectionOwned: true,
      receiptTextNodeDetectionOwned: true,
      hitTestInspectionOwned: true,
      hitTestObservabilityRefinementOwned: true,
      pointerEventsInspectionOwned: true,
      blockerOverlayInspectionOwned: true,
      globalSuppressionReadOwnedWhereSafelyAvailable: true,
      runtimeReleaseReadOwnedWhereSafelyAvailable: true,
      syntheticActivationAllowedByDefault: false,

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastWestStatus: lastEvidencePacket ? lastEvidencePacket.WEST_STATUS : STATUS.READY,
      lastWestRenderedReadStatus: lastEvidencePacket ? lastEvidencePacket.WEST_RENDERED_READ_STATUS : FALLBACK.UNKNOWN,
      lastCase1Support: lastEvidencePacket ? lastEvidencePacket.CASE_1_SUPPORT : SUPPORT.UNKNOWN,
      lastCase2Support: lastEvidencePacket ? lastEvidencePacket.CASE_2_SUPPORT : SUPPORT.UNKNOWN,
      lastCase3Support: lastEvidencePacket ? lastEvidencePacket.CASE_3_SUPPORT : SUPPORT.UNKNOWN,
      lastCase4Support: lastEvidencePacket ? lastEvidencePacket.CASE_4_SUPPORT : SUPPORT.UNKNOWN,
      lastCase6Support: lastEvidencePacket ? lastEvidencePacket.CASE_6_SUPPORT : SUPPORT.UNKNOWN,
      lastCase7Support: lastEvidencePacket ? lastEvidencePacket.CASE_7_SUPPORT : SUPPORT.UNKNOWN,
      lastHitTestUnreadableReason: lastEvidencePacket ? lastEvidencePacket.HIT_TEST_UNREADABLE_REASON : FALLBACK.UNKNOWN,
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

    root.HEARTH_DIAGNOSTIC_WEST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_WEST = api;

    root.HEARTH_DIAGNOSTIC_WEST_RECEIPT = getWestReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_RECEIPT = getWestReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,

    runWestRenderedRead,
    getWestReceipt,
    getWestState,

    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
