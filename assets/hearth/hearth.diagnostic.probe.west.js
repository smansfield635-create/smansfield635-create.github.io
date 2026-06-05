// /assets/hearth/hearth.diagnostic.probe.west.js
// HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1
// Full-file addition.
// Probe WEST only.
// Purpose:
// - Add an under-hood probe bridge without renewing /assets/hearth/hearth.diagnostic.west.js.
// - Resolve the real Hearth rendered target from the diagnostic rail context.
// - Reject the diagnostic receiver document as a target.
// - Call the already-loaded WEST diagnostic rail API:
//   /assets/hearth/hearth.diagnostic.west.js
//   HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// - Normalize WEST rendered-target evidence for NORTH / probe-NORTH consumption.
// - Preserve WEST as rendered-target authority.
// - Preserve NORTH as final adjudication authority.
// - Preserve EAST as served-source / CASE_5 lane.
// - Preserve SOUTH as packet-output / meaning-preservation lane.
// Does not own:
// - WEST origin renewal
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
// - control implementation
// - bishop implementation
// - terrain/material/hydrology truth
// - expression repair
// - F13 claim
// - F21 claim
// - ready text
// - visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_RECEIPT_v1";

  const TARGET_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const TARGET_WEST_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";

  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-west-rendered-target-bridge-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const ORIGIN_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";

  const FRAME_SELECTORS = Object.freeze([
    "#hearthDiagnosticTargetFrame",
    "iframe[data-hearth-diagnostic-target-frame='true']",
    "iframe[data-hearth-target-frame='true']",
    "iframe[data-diagnostic-target-frame='true']",
    "iframe[src='/showroom/globe/hearth/']",
    "iframe[src*='/showroom/globe/hearth/']"
  ]);

  const TARGET_STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-visible-globe-stage]",
    "[data-hearth-expression-stage]",
    "[data-hearth-canvas-stage]",
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-expression-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-visible-globe-mount]",
    "[data-hearth-expression-surface]",
    "[data-hearth-canvas-surface]",
    "[data-hearth-visible-globe='true']",
    "[data-hearth-visible-planet='true']"
  ]);

  const WEST_API_PATHS = Object.freeze([
    "HEARTH.diagnosticWest",
    "HEARTH.diagnosticRailWest",
    "HEARTH.diagnosticWestCanvasExpressionRenderedRangeObservatory",
    "HEARTH_DIAGNOSTIC_WEST",
    "HEARTH_DIAGNOSTIC_RAIL_WEST",
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY",
    "DEXTER_LAB.hearthDiagnosticWest",
    "DEXTER_LAB.hearthDiagnosticRailWest",
    "DEXTER_LAB.hearthDiagnosticWestCanvasExpressionRenderedRangeObservatory"
  ]);

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NONE: "none",
    NOT_FOUND: "NOT_FOUND",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    BLOCKED: "BLOCKED",
    SOURCE_ONLY: "SOURCE_ONLY",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    ACTIVE_DEGRADED: "ACTIVE_DEGRADED",
    HANDSHAKE_PENDING: "HANDSHAKE_PENDING",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    HELD: "HELD"
  });

  const NO_CLAIM_FIELDS = Object.freeze({
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

  const UPPER_NO_CLAIM_FIELDS = Object.freeze({
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastEvidence = null;

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

  function clean(value, limit = 1800) {
    return safeString(value)
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

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
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

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      return source[key] === undefined || source[key] === null ? fallback : source[key];
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        return source[candidate] === undefined || source[candidate] === null
          ? fallback
          : source[candidate];
      }
    }

    return fallback;
  }

  function getValue(source, key, fallback = FALLBACK.UNKNOWN) {
    const value = getRaw(source, key, undefined);
    if (value === undefined || value === null || value === "") return fallback;

    if (isObject(value) || Array.isArray(value)) {
      try {
        return JSON.stringify(value).slice(0, 6000);
      } catch (_error) {
        return fallback;
      }
    }

    return clean(value, 3000) || fallback;
  }

  function addNote(state, note) {
    const value = clean(note, 1500);
    if (!value) return;
    if (!state.probeWestNotes.includes(value)) state.probeWestNotes.push(value);
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function currentPath(win) {
    try {
      return win && win.location ? safeString(win.location.pathname, "") : "";
    } catch (_error) {
      return "";
    }
  }

  function isTargetRoute(win) {
    const path = currentPath(win);
    return path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "");
  }

  function isDiagnosticRoute(win) {
    const path = currentPath(win);
    return path === DIAGNOSTIC_ROUTE || path === DIAGNOSTIC_ROUTE.replace(/\/$/, "");
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

  function documentLooksDiagnostic(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const dataset = readDataset(targetDocument);
      const html = targetDocument.documentElement;
      const route = safeString(dataset.route || html.getAttribute("data-route") || "");
      const page = safeString(dataset.page || html.getAttribute("data-page") || "");
      const contract = safeString(dataset.contract || html.getAttribute("data-contract") || "");

      return Boolean(
        isDiagnosticRoute(targetWindow) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /diagnostic/i.test(page) ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract)
      );
    } catch (_error) {
      return false;
    }
  }

  function documentLooksHearthTarget(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (documentLooksDiagnostic(targetDocument, targetWindow)) return false;

      const dataset = readDataset(targetDocument);
      const html = targetDocument.documentElement;
      const body = targetDocument.body;

      const route = safeString(dataset.route || html.getAttribute("data-route") || "");
      const page = safeString(dataset.page || html.getAttribute("data-page") || "");
      const alias = safeString(dataset.pageAlias || html.getAttribute("data-page-alias") || "");
      const context = safeString(dataset.pageContext || html.getAttribute("data-page-context") || "");

      if (isTargetRoute(targetWindow)) return true;
      if (route === TARGET_ROUTE || route === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (body) {
        const bodyRoute = safeString(body.getAttribute("data-route") || "");
        if (bodyRoute === TARGET_ROUTE || bodyRoute === TARGET_ROUTE.replace(/\/$/, "")) return true;
      }

      if (/hearth/i.test(page)) return true;
      if (/hearth/i.test(alias)) return true;
      if (/visible globe|visible planet|planet engine|planet factory|canvas expression/i.test(context)) return true;

      return TARGET_STAGE_SELECTORS.some((selector) => Boolean(q(targetDocument, selector)));
    } catch (_error) {
      return false;
    }
  }

  function normalizeFrameSrc(frame) {
    try {
      const raw = frame && frame.getAttribute ? frame.getAttribute("src") : "";
      if (!raw) return "";
      const origin = root.location && root.location.origin
        ? root.location.origin
        : "https://diamondgatebridge.com";
      const url = new URL(raw, origin);
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return "";
    }
  }

  function frameMatchesTarget(frame) {
    const src = normalizeFrameSrc(frame);
    return Boolean(
      src === TARGET_ROUTE ||
      src.startsWith(`${TARGET_ROUTE}?`) ||
      src === TARGET_ROUTE.replace(/\/$/, "") ||
      src.includes("/showroom/globe/hearth/")
    );
  }

  function readFrame(frame, state) {
    try {
      if (!frame) return null;

      const targetWindow = frame.contentWindow || null;
      const targetDocument = targetWindow ? targetWindow.document : null;

      if (!targetDocument || !targetDocument.documentElement) {
        addNote(state, "PROBE_WEST_FRAME_PRESENT_DOCUMENT_INACCESSIBLE");
        return null;
      }

      if (!documentLooksHearthTarget(targetDocument, targetWindow)) {
        addNote(state, "PROBE_WEST_FRAME_DOCUMENT_REJECTED_NOT_HEARTH_TARGET");
        return null;
      }

      return {
        targetDocument,
        targetWindow,
        frameElement: frame,
        source: "FRAME"
      };
    } catch (error) {
      addNote(state, `PROBE_WEST_FRAME_BLOCKED:${clean(error && error.message ? error.message : error, 900)}`);
      return null;
    }
  }

  function findTargetFrame(sourceDocument, state) {
    if (!sourceDocument) return null;

    for (const selector of FRAME_SELECTORS) {
      const frame = q(sourceDocument, selector);
      if (!frame) continue;

      const read = readFrame(frame, state);
      if (read) {
        addNote(state, `PROBE_WEST_TARGET_FRAME_RESOLVED_BY_SELECTOR:${selector}`);
        return read;
      }
    }

    const frames = qa(sourceDocument, "iframe");

    for (const frame of frames) {
      if (!frameMatchesTarget(frame)) continue;

      const read = readFrame(frame, state);
      if (read) {
        addNote(state, "PROBE_WEST_TARGET_FRAME_RESOLVED_BY_SRC_SCAN");
        return read;
      }
    }

    for (const frame of frames) {
      const read = readFrame(frame, state);
      if (read) {
        addNote(state, "PROBE_WEST_TARGET_FRAME_RESOLVED_BY_HEARTH_SIGNAL_SCAN");
        return read;
      }
    }

    return null;
  }

  function resolveTarget(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetDocument = opts.targetDocument;
      const targetWindow = targetDocument.defaultView || opts.targetWindow || null;

      if (documentLooksHearthTarget(targetDocument, targetWindow)) {
        addNote(state, "PROBE_WEST_TARGET_DOCUMENT_SUPPLIED_AND_ACCEPTED");
        return {
          targetDocument,
          targetWindow,
          frameElement: opts.frameElement || null,
          source: "OPTIONS_TARGET_DOCUMENT"
        };
      }

      addNote(state, "PROBE_WEST_SUPPLIED_TARGET_DOCUMENT_REJECTED");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && documentLooksHearthTarget(targetDocument, targetWindow)) {
          addNote(state, "PROBE_WEST_TARGET_WINDOW_SUPPLIED_AND_ACCEPTED");
          return {
            targetDocument,
            targetWindow,
            frameElement: opts.frameElement || null,
            source: "OPTIONS_TARGET_WINDOW"
          };
        }

        addNote(state, "PROBE_WEST_SUPPLIED_TARGET_WINDOW_REJECTED");
      } catch (error) {
        addNote(state, `PROBE_WEST_SUPPLIED_TARGET_WINDOW_BLOCKED:${clean(error && error.message ? error.message : error, 900)}`);
      }
    }

    if (opts.frameElement) {
      const fromOptionFrame = readFrame(opts.frameElement, state);
      if (fromOptionFrame) {
        fromOptionFrame.source = "OPTIONS_FRAME_ELEMENT";
        addNote(state, "PROBE_WEST_FRAME_ELEMENT_SUPPLIED_AND_ACCEPTED");
        return fromOptionFrame;
      }
    }

    const currentDocument = root.document || null;

    if (currentDocument && currentDocument.documentElement && documentLooksHearthTarget(currentDocument, root)) {
      addNote(state, "PROBE_WEST_CURRENT_DOCUMENT_IS_HEARTH_TARGET");
      return {
        targetDocument: currentDocument,
        targetWindow: root,
        frameElement: null,
        source: "CURRENT_HEARTH_DOCUMENT"
      };
    }

    const frameResolved = findTargetFrame(currentDocument, state);
    if (frameResolved) return frameResolved;

    addNote(state, "PROBE_WEST_NO_RENDERED_HEARTH_TARGET_RESOLVED");
    return {
      targetDocument: null,
      targetWindow: null,
      frameElement: null,
      source: "NONE"
    };
  }

  function findWestApi(state) {
    for (const path of WEST_API_PATHS) {
      const found = readPath(root, path);
      if (!found || !isObject(found)) continue;

      const contract = safeString(found.contract || "");
      const hasRun = isFunction(found.runWestRenderedRead);
      const hasReceipt = isFunction(found.getWestReceipt);
      const receipt = hasReceipt ? safeWestReceipt(found) : {};

      if (hasRun) {
        addNote(state, `PROBE_WEST_ORIGIN_API_FOUND:${path}`);
        return {
          path,
          api: found,
          contract: contract || safeString(receipt.contract || ""),
          receipt
        };
      }
    }

    addNote(state, "PROBE_WEST_ORIGIN_API_NOT_FOUND");
    return {
      path: "NONE",
      api: null,
      contract: FALLBACK.NOT_FOUND,
      receipt: {}
    };
  }

  function safeWestReceipt(westApi) {
    try {
      if (westApi && isFunction(westApi.getWestReceipt)) {
        const receipt = westApi.getWestReceipt();
        return isObject(receipt) ? receipt : {};
      }
    } catch (_error) {}

    return {};
  }

  function normalizeEvidence(rawEvidence, state) {
    const evidence = isObject(rawEvidence) ? rawEvidence : {};

    const normalized = {
      PROBE_WEST_STATUS: state.probeWestStatus,
      PROBE_WEST_CONTRACT: CONTRACT,
      PROBE_WEST_RECEIPT: RECEIPT,
      PROBE_WEST_VERSION: VERSION,
      PROBE_WEST_FILE: FILE,

      PROBE_WEST_ORIGIN_FILE: ORIGIN_WEST_FILE,
      PROBE_WEST_ORIGIN_CONTRACT: state.originWestContract,
      PROBE_WEST_ORIGIN_IMPLEMENTATION_CONTRACT: state.originWestImplementationContract,
      PROBE_WEST_ORIGIN_API_PATH: state.originWestApiPath,
      PROBE_WEST_ORIGIN_API_AVAILABLE: state.originWestApiAvailable,

      PROBE_WEST_TARGET_RESOLUTION_STATUS: state.targetResolutionStatus,
      PROBE_WEST_TARGET_SOURCE: state.targetSource,
      PROBE_WEST_TARGET_DOCUMENT_AVAILABLE: state.targetDocumentAvailable,
      PROBE_WEST_TARGET_WINDOW_AVAILABLE: state.targetWindowAvailable,
      PROBE_WEST_FRAME_ELEMENT_AVAILABLE: state.frameElementAvailable,

      WEST_STATUS: getValue(evidence, "WEST_STATUS", FALLBACK.UNKNOWN),
      WEST_CONTRACT: getValue(evidence, "WEST_CONTRACT", TARGET_WEST_CONTRACT),
      WEST_RECEIPT: getValue(evidence, "WEST_RECEIPT", FALLBACK.UNKNOWN),
      WEST_IMPLEMENTATION_CONTRACT: getValue(
        evidence,
        "WEST_IMPLEMENTATION_CONTRACT",
        TARGET_WEST_IMPLEMENTATION_CONTRACT
      ),
      WEST_RENDERED_READ_STATUS: getValue(evidence, "WEST_RENDERED_READ_STATUS", FALLBACK.UNKNOWN),
      WEST_RENDERED_READ_COMPLETE: getValue(evidence, "WEST_RENDERED_READ_COMPLETE", FALLBACK.UNKNOWN),

      DIAGNOSTIC_TARGET_ACCESS_STATUS: getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", FALLBACK.UNKNOWN),
      DIAGNOSTIC_TARGET_ACCESS_ERROR: getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", FALLBACK.UNKNOWN),
      HEARTH_TARGET_CONFIRMED: getValue(evidence, "HEARTH_TARGET_CONFIRMED", FALLBACK.UNKNOWN),
      CURRENT_VISIBLE_HEARTH_STATUS: getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", FALLBACK.UNKNOWN),

      RENDERED_PLANET_PROOF_INSPECTED: getValue(evidence, "RENDERED_PLANET_PROOF_INSPECTED", FALLBACK.UNKNOWN),
      RENDERED_PLANET_PROOF_READY: getValue(evidence, "RENDERED_PLANET_PROOF_READY", FALLBACK.UNKNOWN),
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: getValue(evidence, "RENDERED_PLANET_PROOF_FULLY_INSPECTED", FALLBACK.UNKNOWN),
      WEST_RENDERED_PROOF_SPREAD_COMPLETE: getValue(evidence, "WEST_RENDERED_PROOF_SPREAD_COMPLETE", FALLBACK.UNKNOWN),
      VISIBLE_PLANET_PROOF_READY: getValue(evidence, "VISIBLE_PLANET_PROOF_READY", FALLBACK.UNKNOWN),
      VISIBLE_PLANET_PROOF_SOURCE: getValue(evidence, "VISIBLE_PLANET_PROOF_SOURCE", FALLBACK.UNKNOWN),

      CANVAS_EXPRESSION_OBSERVATORY_ACTIVE: getValue(evidence, "CANVAS_EXPRESSION_OBSERVATORY_ACTIVE", FALLBACK.UNKNOWN),
      CANVAS_EXPRESSION_SURFACE_READY: getValue(evidence, "CANVAS_EXPRESSION_SURFACE_READY", FALLBACK.UNKNOWN),
      CANVAS_EXPRESSION_RICHNESS_READY: getValue(evidence, "CANVAS_EXPRESSION_RICHNESS_READY", FALLBACK.UNKNOWN),
      CANVAS_EXPRESSION_PROOF_STATUS: getValue(evidence, "CANVAS_EXPRESSION_PROOF_STATUS", FALLBACK.UNKNOWN),
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: getValue(evidence, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", FALLBACK.UNKNOWN),
      CANVAS_EXPRESSION_DATA_SIGNALS_PRESENT: getValue(evidence, "CANVAS_EXPRESSION_DATA_SIGNALS_PRESENT", FALLBACK.UNKNOWN),

      PLANET_STAGE_PRESENT: getValue(evidence, "PLANET_STAGE_PRESENT", FALLBACK.UNKNOWN),
      PLANET_STAGE_RECT_NONZERO: getValue(evidence, "PLANET_STAGE_RECT_NONZERO", FALLBACK.UNKNOWN),
      CANVAS_MOUNT_PRESENT: getValue(evidence, "CANVAS_MOUNT_PRESENT", FALLBACK.UNKNOWN),
      CANVAS_MOUNT_RECT_NONZERO: getValue(evidence, "CANVAS_MOUNT_RECT_NONZERO", FALLBACK.UNKNOWN),
      CANVAS_ELEMENT_PRESENT: getValue(evidence, "CANVAS_ELEMENT_PRESENT", FALLBACK.UNKNOWN),
      CANVAS_ELEMENT_FOUND: getValue(evidence, "CANVAS_ELEMENT_FOUND", FALLBACK.UNKNOWN),
      CANVAS_RECT_NONZERO: getValue(evidence, "CANVAS_RECT_NONZERO", FALLBACK.UNKNOWN),
      EXPRESSION_SURFACE_PRESENT: getValue(evidence, "EXPRESSION_SURFACE_PRESENT", FALLBACK.UNKNOWN),
      EXPRESSION_SURFACE_RECT_NONZERO: getValue(evidence, "EXPRESSION_SURFACE_RECT_NONZERO", FALLBACK.UNKNOWN),
      DOM_EXPRESSION_SURFACE_PROOF_READY: getValue(evidence, "DOM_EXPRESSION_SURFACE_PROOF_READY", FALLBACK.UNKNOWN),

      CANVAS_PIXEL_SAMPLE_STATUS: getValue(evidence, "CANVAS_PIXEL_SAMPLE_STATUS", FALLBACK.UNKNOWN),
      CANVAS_PIXEL_SAMPLE_READABLE: getValue(evidence, "CANVAS_PIXEL_SAMPLE_READABLE", FALLBACK.UNKNOWN),
      CANVAS_PIXEL_NONEMPTY: getValue(evidence, "CANVAS_PIXEL_NONEMPTY", FALLBACK.UNKNOWN),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: getValue(evidence, "CANVAS_PIXEL_UNIQUE_COLOR_COUNT", FALLBACK.UNKNOWN),
      CANVAS_PIXEL_VARIANCE_STATUS: getValue(evidence, "CANVAS_PIXEL_VARIANCE_STATUS", FALLBACK.UNKNOWN),

      CANVAS_FINGER_OBSERVED_COUNT: getValue(evidence, "CANVAS_FINGER_OBSERVED_COUNT", FALLBACK.UNKNOWN),
      CANVAS_FINGER_ACTIVE_COUNT: getValue(evidence, "CANVAS_FINGER_ACTIVE_COUNT", FALLBACK.UNKNOWN),
      CANVAS_FINGER_EXPRESSION_STATUS: getValue(evidence, "CANVAS_FINGER_EXPRESSION_STATUS", FALLBACK.UNKNOWN),

      NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND: getValue(evidence, "NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND", FALLBACK.UNKNOWN),
      NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED: getValue(evidence, "NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED", FALLBACK.UNKNOWN),

      ROUTE_CONDUCTOR_CONTRACT: getValue(evidence, "ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: getValue(evidence, "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET: getValue(
        evidence,
        "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET",
        FALLBACK.UNKNOWN
      ),
      ROUTE_CONDUCTOR_V9_9_DETECTED: getValue(evidence, "ROUTE_CONDUCTOR_V9_9_DETECTED", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_V9_8_TRANSITION_DETECTED: getValue(evidence, "ROUTE_CONDUCTOR_V9_8_TRANSITION_DETECTED", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_V9_7_TRANSITION_DETECTED: getValue(evidence, "ROUTE_CONDUCTOR_V9_7_TRANSITION_DETECTED", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_V9_6_TRANSITION_DETECTED: getValue(evidence, "ROUTE_CONDUCTOR_V9_6_TRANSITION_DETECTED", FALLBACK.UNKNOWN),
      ROUTE_CONDUCTOR_V9_5_COMPAT_DETECTED: getValue(evidence, "ROUTE_CONDUCTOR_V9_5_COMPAT_DETECTED", FALLBACK.UNKNOWN),

      CURRENT_CANVAS_PARENT_CONTRACT: getValue(evidence, "CURRENT_CANVAS_PARENT_CONTRACT", FALLBACK.UNKNOWN),
      CURRENT_CANVAS_PARENT_RECOGNIZED: getValue(evidence, "CURRENT_CANVAS_PARENT_RECOGNIZED", FALLBACK.UNKNOWN),

      LAB_BRIDGE_PRESENT: getValue(evidence, "LAB_BRIDGE_PRESENT", FALLBACK.UNKNOWN),
      LAB_BRIDGE_CYCLE_LANGUAGE_READABLE: getValue(evidence, "LAB_BRIDGE_CYCLE_LANGUAGE_READABLE", FALLBACK.UNKNOWN),
      LAB_BRIDGE_CANVAS_HANDOFF_LANGUAGE_READABLE: getValue(evidence, "LAB_BRIDGE_CANVAS_HANDOFF_LANGUAGE_READABLE", FALLBACK.UNKNOWN),

      CONTROL_FILE_STATUS: getValue(evidence, "CONTROL_FILE_STATUS", FALLBACK.UNKNOWN),
      CONTROL_FILE_LOADED: getValue(evidence, "CONTROL_FILE_LOADED", FALLBACK.UNKNOWN),
      CONTROL_GLOBAL_PRESENT: getValue(evidence, "CONTROL_GLOBAL_PRESENT", FALLBACK.UNKNOWN),
      CONTROL_RECEIPT_PRESENT: getValue(evidence, "CONTROL_RECEIPT_PRESENT", FALLBACK.UNKNOWN),
      CONTROL_HANDSHAKE_STATUS: getValue(evidence, "CONTROL_HANDSHAKE_STATUS", FALLBACK.UNKNOWN),
      HEARTH_JS_CONTROL_HANDSHAKE_STATUS: getValue(evidence, "HEARTH_JS_CONTROL_HANDSHAKE_STATUS", FALLBACK.UNKNOWN),
      MOTION_TOUCH_STATUS: getValue(evidence, "MOTION_TOUCH_STATUS", FALLBACK.UNKNOWN),
      DRAG_STATUS: getValue(evidence, "DRAG_STATUS", FALLBACK.UNKNOWN),
      VIEW_CONTROL_STATUS: getValue(evidence, "VIEW_CONTROL_STATUS", FALLBACK.UNKNOWN),

      BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_ACTIVE: getValue(
        evidence,
        "BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_ACTIVE",
        FALLBACK.UNKNOWN
      ),
      BISHOP_LANE_HUB_COUNT: getValue(evidence, "BISHOP_LANE_HUB_COUNT", FALLBACK.UNKNOWN),
      BISHOP_LANE_RENDERED_BRIDGE_STATUS: getValue(evidence, "BISHOP_LANE_RENDERED_BRIDGE_STATUS", FALLBACK.UNKNOWN),
      QUEEN_CANVAS_STATUS: getValue(evidence, "QUEEN_CANVAS_STATUS", FALLBACK.UNKNOWN),

      FOUR_WAY_CANVAS_HANDOFF_EXPECTED: getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_EXPECTED", FALLBACK.UNKNOWN),
      FOUR_WAY_CANVAS_HANDOFF_STATUS: getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_STATUS", FALLBACK.UNKNOWN),

      SHOW_RECEIPT_BUTTON_EXISTS: getValue(evidence, "SHOW_RECEIPT_BUTTON_EXISTS", FALLBACK.UNKNOWN),
      SHOW_RECEIPT_HIT_TEST_TARGET: getValue(evidence, "SHOW_RECEIPT_HIT_TEST_TARGET", FALLBACK.UNKNOWN),
      HIT_TEST_UNREADABLE_REASON: getValue(evidence, "HIT_TEST_UNREADABLE_REASON", FALLBACK.UNKNOWN),
      SHOW_RECEIPT_HIT_TEST_NON_CONTROLLING: getValue(evidence, "SHOW_RECEIPT_HIT_TEST_NON_CONTROLLING", FALLBACK.UNKNOWN),

      RUNTIME_RELEASE_STATE: getValue(evidence, "RUNTIME_RELEASE_STATE", FALLBACK.UNKNOWN),
      RUNTIME_RELEASE_IS_LOCK: getValue(evidence, "RUNTIME_RELEASE_IS_LOCK", FALLBACK.UNKNOWN),

      CASE_1_SUPPORT: getValue(evidence, "CASE_1_SUPPORT", FALLBACK.UNKNOWN),
      CASE_2_SUPPORT: getValue(evidence, "CASE_2_SUPPORT", FALLBACK.HELD),
      CASE_3_SUPPORT: getValue(evidence, "CASE_3_SUPPORT", FALLBACK.HELD),
      CASE_4_SUPPORT: getValue(evidence, "CASE_4_SUPPORT", FALLBACK.UNKNOWN),
      CASE_6_SUPPORT: getValue(evidence, "CASE_6_SUPPORT", FALLBACK.UNKNOWN),
      CASE_7_SUPPORT: getValue(evidence, "CASE_7_SUPPORT", FALLBACK.UNKNOWN),

      PROBE_WEST_NOTES: state.probeWestNotes.join(" | ") || FALLBACK.NONE,
      WEST_SECONDARY_EVIDENCE_NOTES: getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", FALLBACK.NONE),

      ...NO_CLAIM_FIELDS,
      ...UPPER_NO_CLAIM_FIELDS
    };

    normalized.PROBE_WEST_NORMALIZED_RENDERED_PROOF_READY =
      normalized.RENDERED_PLANET_PROOF_READY === "true" ||
      normalized.VISIBLE_PLANET_PROOF_READY === "true"
        ? "true"
        : "false";

    normalized.PROBE_WEST_NORMALIZED_CANVAS_EXPRESSION_ANCHOR =
      normalized.CANVAS_EXPRESSION_BOTTLENECK_CLASS !== FALLBACK.UNKNOWN
        ? normalized.CANVAS_EXPRESSION_BOTTLENECK_CLASS
        : normalized.CANVAS_EXPRESSION_PROOF_STATUS !== FALLBACK.UNKNOWN
          ? normalized.CANVAS_EXPRESSION_PROOF_STATUS
          : FALLBACK.UNKNOWN;

    normalized.PROBE_WEST_OUTPUT_STATUS =
      normalized.WEST_RENDERED_READ_STATUS === FALLBACK.COMPLETE ||
      normalized.DIAGNOSTIC_TARGET_ACCESS_STATUS === "RENDERED_TARGET_ACCESSIBLE"
        ? FALLBACK.COMPLETE
        : state.probeWestStatus === STATUS.FAILED
          ? FALLBACK.FAILED
          : FALLBACK.PARTIAL;

    return normalized;
  }

  function makeState() {
    return {
      probeWestStatus: STATUS.READY,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      originWestFile: ORIGIN_WEST_FILE,
      originWestContract: FALLBACK.UNKNOWN,
      originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,
      originWestApiPath: FALLBACK.UNKNOWN,
      originWestApiAvailable: "false",

      targetResolutionStatus: FALLBACK.UNKNOWN,
      targetSource: FALLBACK.UNKNOWN,
      targetDocumentAvailable: "false",
      targetWindowAvailable: "false",
      frameElementAvailable: "false",

      westRunOk: FALLBACK.UNKNOWN,
      westRunError: FALLBACK.UNKNOWN,

      evidence: {},
      probeWestNotes: [],
      updatedAt: nowIso(),

      ...NO_CLAIM_FIELDS
    };
  }

  async function runProbeWest(options = {}) {
    const state = makeState();
    state.probeWestStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const west = findWestApi(state);

      state.originWestApiPath = west.path;
      state.originWestContract = west.contract || FALLBACK.UNKNOWN;
      state.originWestImplementationContract = safeString(
        west.receipt && west.receipt.implementationContract,
        TARGET_WEST_IMPLEMENTATION_CONTRACT
      );
      state.originWestApiAvailable = boolText(Boolean(west.api && isFunction(west.api.runWestRenderedRead)), "false");

      if (!west.api || !isFunction(west.api.runWestRenderedRead)) {
        state.probeWestStatus = STATUS.FAILED;
        state.westRunOk = "false";
        state.westRunError = "WEST_ORIGIN_API_NOT_AVAILABLE";
        state.targetResolutionStatus = "HELD_ORIGIN_WEST_API_MISSING";
        state.evidence = normalizeEvidence({}, state);
        publish(state);

        return {
          ok: false,
          contract: CONTRACT,
          receipt: RECEIPT,
          error: state.westRunError,
          evidence: clonePlain(lastEvidence),
          state: clonePlain(lastState)
        };
      }

      const target = resolveTarget(options, state);

      state.targetSource = target.source || FALLBACK.UNKNOWN;
      state.targetDocumentAvailable = boolText(Boolean(target.targetDocument), "false");
      state.targetWindowAvailable = boolText(Boolean(target.targetWindow), "false");
      state.frameElementAvailable = boolText(Boolean(target.frameElement), "false");

      if (target.targetDocument && target.targetWindow) {
        state.targetResolutionStatus = "RENDERED_HEARTH_TARGET_RESOLVED";
      } else {
        state.targetResolutionStatus = "RENDERED_HEARTH_TARGET_NOT_RESOLVED";
      }

      const westOptions = {
        targetDocument: target.targetDocument || undefined,
        targetWindow: target.targetWindow || undefined,
        frameElement: target.frameElement || undefined,
        sourceMismatchControlling: Boolean(options.sourceMismatchControlling),
        allowSyntheticActivation: false,
        northPermitsSyntheticActivation: false,
        syntheticActivationPermittedByNorth: false,
        probeWestBridge: true,
        probeWestContract: CONTRACT
      };

      const westResult = await Promise.resolve(west.api.runWestRenderedRead(westOptions));
      const westEvidence = isObject(westResult && westResult.evidence) ? westResult.evidence : {};

      state.westRunOk = boolText(Boolean(westResult && westResult.ok !== false), "false");
      state.westRunError = westResult && westResult.error ? clean(westResult.error, 1200) : FALLBACK.NONE;

      state.evidence = normalizeEvidence(westEvidence, state);

      const westStatus = state.evidence.WEST_RENDERED_READ_STATUS;
      const targetAccess = state.evidence.DIAGNOSTIC_TARGET_ACCESS_STATUS;

      state.probeWestStatus =
        westStatus === FALLBACK.COMPLETE || targetAccess === "RENDERED_TARGET_ACCESSIBLE"
          ? STATUS.COMPLETE
          : westResult && westResult.ok === false
            ? STATUS.FAILED
            : STATUS.PARTIAL;

      state.updatedAt = nowIso();
      publish(state);

      return {
        ok: state.probeWestStatus !== STATUS.FAILED,
        contract: CONTRACT,
        receipt: RECEIPT,
        originWestContract: state.originWestContract,
        originWestImplementationContract: state.originWestImplementationContract,
        targetResolutionStatus: state.targetResolutionStatus,
        evidence: clonePlain(lastEvidence),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.probeWestStatus = STATUS.FAILED;
      state.westRunOk = "false";
      state.westRunError = `PROBE_WEST_TOP_LEVEL_ERROR:${clean(error && error.message ? error.message : error, 1000)}`;
      addNote(state, state.westRunError);
      state.evidence = normalizeEvidence({}, state);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: state.westRunError,
        evidence: clonePlain(lastEvidence),
        state: clonePlain(lastState)
      };
    }
  }

  function getProbeWestEvidence() {
    return clonePlain(lastEvidence || normalizeEvidence({}, makeState()));
  }

  function getProbeWestState() {
    return clonePlain(lastState || makeState());
  }

  function getProbeWestReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "PROBE_WEST_RENDERED_TARGET_BRIDGE",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      originWestFile: ORIGIN_WEST_FILE,
      originWestContract: TARGET_WEST_CONTRACT,
      originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,
      originWestRenewalRequired: false,

      bridgePurpose:
        "resolve rendered Hearth target and call existing WEST diagnostic rail without renewing origin WEST",
      servesNorth: true,
      servesProbeNorth: true,
      servesWestOrigin: false,

      runProbeWestApiAvailable: true,
      getProbeWestReceiptApiAvailable: true,
      getProbeWestStateApiAvailable: true,
      getProbeWestEvidenceApiAvailable: true,

      targetFrameResolutionOwned: true,
      diagnosticReceiverRejectionOwned: true,
      renderedTargetDeliveryToWestOwned: true,
      westEvidenceNormalizationOwned: true,
      northConsumableProbeEvidenceOwned: true,

      renderedTargetAuthorityOwned: false,
      servedSourceAuthorityOwned: false,
      case5AuthorityOwned: false,
      finalPrimaryCaseAuthorityOwned: false,
      finalRecommendationAuthorityOwned: false,
      packetFormattingAuthorityOwned: false,
      diagnosticUiAuthorityOwned: false,
      westOriginRenewalOwned: false,

      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      syntheticActivationAuthorized: false,

      lastProbeWestStatus: state.probeWestStatus,
      lastOriginWestApiPath: state.originWestApiPath,
      lastOriginWestApiAvailable: state.originWestApiAvailable,
      lastTargetResolutionStatus: state.targetResolutionStatus,
      lastTargetSource: state.targetSource,
      lastWestRunOk: state.westRunOk,
      lastWestRunError: state.westRunError,

      ...NO_CLAIM_FIELDS,
      updatedAt: nowIso()
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidence = clonePlain(state.evidence || normalizeEvidence({}, state));

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticProbeWest = api;
    root.HEARTH.diagnosticRailProbeWest = api;
    root.HEARTH.probeWest = api;
    root.HEARTH.probeWestRenderedTargetBridge = api;
    root.HEARTH.diagnosticProbeWestReceipt = getProbeWestReceipt();
    root.HEARTH.diagnosticProbeWestEvidence = clonePlain(lastEvidence);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticProbeWest = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeWest = api;
    root.DEXTER_LAB.hearthProbeWestRenderedTargetBridge = api;

    root.HEARTH_DIAGNOSTIC_PROBE_WEST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_WEST = api;
    root.HEARTH_PROBE_WEST = api;
    root.HEARTH_PROBE_WEST_RENDERED_TARGET_BRIDGE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_WEST_RECEIPT = getProbeWestReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_WEST_EVIDENCE = clonePlain(lastEvidence);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    originWestFile: ORIGIN_WEST_FILE,
    originWestContract: TARGET_WEST_CONTRACT,
    originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,

    runProbeWest,
    getProbeWestReceipt,
    getProbeWestState,
    getProbeWestEvidence,

    supportsRenderedTargetFrameResolution: true,
    supportsDiagnosticReceiverRejection: true,
    supportsExistingWestApiBridge: true,
    supportsWestEvidenceNormalization: true,
    supportsNorthConsumableProbeEvidence: true,

    ownsTargetResolution: true,
    ownsWestApiInvocation: true,
    ownsProbeEvidenceNormalization: true,

    ownsWestOriginRenewal: false,
    ownsRenderedTargetAuthority: false,
    ownsServedSourceAuthority: false,
    ownsCase5Authority: false,
    ownsFinalPrimaryCase: false,
    ownsRecommendation: false,
    ownsPacketFormatting: false,
    ownsDiagnosticUi: false,
    ownsRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsSyntheticActivation: false,
    ownsF13: false,
    ownsF21: false,

    ...NO_CLAIM_FIELDS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
