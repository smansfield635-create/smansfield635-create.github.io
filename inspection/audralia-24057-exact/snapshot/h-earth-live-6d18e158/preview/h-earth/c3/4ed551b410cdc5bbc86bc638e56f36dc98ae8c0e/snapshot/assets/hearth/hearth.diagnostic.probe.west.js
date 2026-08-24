// /assets/hearth/hearth.diagnostic.probe.west.js
// HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_WEST_CHRONOLOGY_ANCHOR_AND_RENDERED_TARGET_BRIDGE_TNT_v1_1
// Full-file replacement.
// Probe WEST only.
// Purpose:
// - Preserve the public Probe WEST contract expected by North chronology.
// - Fix the observed failure class where the script tag is already present but the probe global is not observed.
// - Publish a stable chronology anchor immediately under all expected aliases.
// - Resolve the real rendered Hearth target from diagnostic context.
// - Reject the diagnostic receiver document as a rendered target.
// - Call the already-loaded WEST diagnostic rail API when available.
// - Normalize WEST rendered-target evidence for NORTH / Probe NORTH consumption.
// - Preserve WEST rail as rendered-target authority.
// - Preserve NORTH as final adjudication authority.
// - Preserve EAST as served-source / source-composition authority.
// - Preserve SOUTH as packet-output / meaning-preservation authority.
// - Preserve no production mutation, no runtime restart, no canvas repair, no route mutation,
//   no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_CHRONOLOGY_ANCHOR_AND_RENDERED_TARGET_BRIDGE_TNT_v1_1";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_CHRONOLOGY_ANCHOR_AND_RENDERED_TARGET_BRIDGE_RECEIPT_v1_1";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1";

  const TARGET_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const TARGET_WEST_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-west-chronology-anchor-rendered-target-bridge-v1-1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const ORIGIN_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";

  const ANCHOR_SOURCE_PATH_PRIMARY = "HEARTH.diagnosticProbeWest";

  const ANCHOR_SOURCE_PATHS = Object.freeze([
    "HEARTH.diagnosticProbeWest",
    "HEARTH.diagnosticWestProbe",
    "HEARTH.diagnosticRailProbeWest",
    "HEARTH.probeWest",
    "HEARTH.probeWestRenderedTargetBridge",
    "HEARTH.diagnosticProbeWestRenderedTargetBridge",
    "HEARTH_DIAGNOSTIC_PROBE_WEST",
    "HEARTH_DIAGNOSTIC_WEST_PROBE",
    "HEARTH_DIAGNOSTIC_RAIL_PROBE_WEST",
    "HEARTH_PROBE_WEST",
    "HEARTH_PROBE_WEST_RENDERED_TARGET_BRIDGE",
    "DEXTER_LAB.hearthDiagnosticProbeWest",
    "DEXTER_LAB.hearthDiagnosticWestProbe",
    "DEXTER_LAB.hearthDiagnosticRailProbeWest",
    "DEXTER_LAB.hearthProbeWestRenderedTargetBridge"
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

  const WEST_RUN_METHODS = Object.freeze([
    "runWestRenderedRead",
    "runRenderedRead",
    "readRenderedTarget",
    "runWest",
    "run",
    "read"
  ]);

  const FRAME_SELECTORS = Object.freeze([
    "#hearthDiagnosticTargetFrame",
    "iframe[data-hearth-diagnostic-target-frame='true']",
    "iframe[data-hearth-target-frame='true']",
    "iframe[data-diagnostic-target-frame='true']",
    "iframe[src='/showroom/globe/hearth/']",
    "iframe[src*='/showroom/globe/hearth/']"
  ]);

  const TARGET_SIGNAL_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "#hearthCanvasMount",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "[data-hearth-globe-stage]",
    "[data-hearth-visible-globe-stage]",
    "[data-hearth-planet-engine-stage]",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-expression-mount]",
    "[data-hearth-expression-surface]",
    "[data-hearth-canvas-surface]",
    "[data-hearth-visible-planet='true']",
    "[data-hearth-visible-globe='true']"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByProbeWest: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedByProbeWest: false,
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
    F21_CLAIMED: false,
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastEvidence = null;
  let anchorPublishCount = 0;

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

  function clean(value, limit = 3000) {
    return safeString(value)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
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

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
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

  function setPath(path, value) {
    try {
      const parts = safeString(path).split(".");
      let cursor = root;

      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index];
        if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
        cursor = cursor[part];
      }

      cursor[parts[parts.length - 1]] = value;
      return true;
    } catch (_error) {
      return false;
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

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
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

  function currentPath(targetWindow) {
    try {
      return targetWindow && targetWindow.location
        ? safeString(targetWindow.location.pathname)
        : "";
    } catch (_error) {
      return "";
    }
  }

  function pathIsRoute(targetWindow, route) {
    const path = currentPath(targetWindow);
    const normal = safeString(route).replace(/\/$/, "");
    return path === route || path === normal;
  }

  function documentRoute(targetDocument) {
    try {
      const data = readDataset(targetDocument);
      const html = targetDocument && targetDocument.documentElement;
      const body = targetDocument && targetDocument.body;

      return clean(firstDefined(
        data.route,
        html && html.getAttribute("data-route"),
        body && body.getAttribute("data-route")
      ), 500);
    } catch (_error) {
      return "";
    }
  }

  function documentLooksDiagnostic(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const data = readDataset(targetDocument);
      const html = targetDocument.documentElement;
      const route = documentRoute(targetDocument);
      const page = clean(firstDefined(data.page, html.getAttribute("data-page")), 500);
      const contract = clean(firstDefined(data.contract, html.getAttribute("data-contract")), 800);

      return Boolean(
        pathIsRoute(targetWindow, DIAGNOSTIC_ROUTE) ||
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

      const data = readDataset(targetDocument);
      const html = targetDocument.documentElement;
      const body = targetDocument.body;

      const route = documentRoute(targetDocument);
      const page = clean(firstDefined(data.page, html.getAttribute("data-page")), 500);
      const alias = clean(firstDefined(data.pageAlias, html.getAttribute("data-page-alias")), 500);
      const context = clean(firstDefined(
        data.pageContext,
        html.getAttribute("data-page-context"),
        body && body.getAttribute("data-page-context")
      ), 1500);

      if (pathIsRoute(targetWindow, TARGET_ROUTE)) return true;
      if (route === TARGET_ROUTE || route === TARGET_ROUTE.replace(/\/$/, "")) return true;
      if (/hearth/i.test(page)) return true;
      if (/hearth/i.test(alias)) return true;
      if (/visible planet|visible globe|planet engine|planet factory|canvas expression|mirrorland formation/i.test(context)) return true;

      return TARGET_SIGNAL_SELECTORS.some((selector) => Boolean(q(targetDocument, selector)));
    } catch (_error) {
      return false;
    }
  }

  function normalizeFrameSrc(frame) {
    try {
      const raw = frame && frame.getAttribute ? frame.getAttribute("src") : "";
      if (!raw) return "";

      const origin =
        root.location && root.location.origin
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
    const normal = TARGET_ROUTE.replace(/\/$/, "");

    return Boolean(
      src === TARGET_ROUTE ||
      src === normal ||
      src.startsWith(`${TARGET_ROUTE}?`) ||
      src.startsWith(`${normal}?`) ||
      src.includes("/showroom/globe/hearth/")
    );
  }

  function addNote(state, note) {
    const value = clean(note, 1600);
    if (!value || !state || !Array.isArray(state.notes)) return;
    if (!state.notes.includes(value)) state.notes.push(value);
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

      const target = readFrame(frame, state);
      if (target) {
        target.source = `FRAME_SELECTOR:${selector}`;
        addNote(state, `PROBE_WEST_TARGET_FRAME_RESOLVED_BY_SELECTOR:${selector}`);
        return target;
      }
    }

    const frames = qa(sourceDocument, "iframe");

    for (const frame of frames) {
      if (!frameMatchesTarget(frame)) continue;

      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_SRC_SCAN";
        addNote(state, "PROBE_WEST_TARGET_FRAME_RESOLVED_BY_SRC_SCAN");
        return target;
      }
    }

    for (const frame of frames) {
      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_HEARTH_SIGNAL_SCAN";
        addNote(state, "PROBE_WEST_TARGET_FRAME_RESOLVED_BY_HEARTH_SIGNAL_SCAN");
        return target;
      }
    }

    return null;
  }

  function resolveTarget(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetDocument = opts.targetDocument;
      const targetWindow = opts.targetWindow || targetDocument.defaultView || null;

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
      const target = readFrame(opts.frameElement, state);
      if (target) {
        target.source = "OPTIONS_FRAME_ELEMENT";
        addNote(state, "PROBE_WEST_FRAME_ELEMENT_SUPPLIED_AND_ACCEPTED");
        return target;
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

    const frameTarget = findTargetFrame(currentDocument, state);
    if (frameTarget) return frameTarget;

    addNote(state, "PROBE_WEST_NO_RENDERED_HEARTH_TARGET_RESOLVED");
    return {
      targetDocument: null,
      targetWindow: null,
      frameElement: null,
      source: "NONE"
    };
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    const methods = [
      "getWestReceipt",
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getStatus",
      "getState",
      "getSummary"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const value = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(value)) return value;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return {};
  }

  function readContract(authority, receipt) {
    const r = isObject(receipt) ? receipt : {};
    const a = isObject(authority) ? authority : {};

    return clean(firstDefined(
      r.contract,
      r.CONTRACT,
      r.westContract,
      r.WEST_CONTRACT,
      r.implementationContract,
      r.WEST_IMPLEMENTATION_CONTRACT,
      a.contract,
      a.CONTRACT,
      a.westContract,
      a.implementationContract
    ), 800);
  }

  function findWestApiInContext(context, contextName, state) {
    for (const path of WEST_API_PATHS) {
      const found = readPath(context, path);
      if (!found || !isObject(found)) continue;

      const method = WEST_RUN_METHODS.find((name) => isFunction(found[name])) || "";
      const receipt = readReceipt(found);
      const contract = readContract(found, receipt);

      if (method) {
        addNote(state, `PROBE_WEST_ORIGIN_API_FOUND:${contextName}:${path}:${method}`);
        return {
          path,
          contextName,
          api: found,
          method,
          receipt,
          contract: contract || TARGET_WEST_CONTRACT
        };
      }
    }

    return null;
  }

  function findWestApi(targetWindow, state) {
    const rootFound = findWestApiInContext(root, "root", state);
    if (rootFound) return rootFound;

    if (targetWindow && targetWindow !== root) {
      const targetFound = findWestApiInContext(targetWindow, "targetWindow", state);
      if (targetFound) return targetFound;
    }

    addNote(state, "PROBE_WEST_ORIGIN_API_NOT_FOUND");
    return {
      path: "NONE",
      contextName: "NONE",
      api: null,
      method: "NONE",
      receipt: {},
      contract: "NOT_FOUND"
    };
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null || value === "" ? fallback : value;
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null || value === "" ? fallback : value;
      }
    }

    return fallback;
  }

  function getValue(source, key, fallback = "UNKNOWN") {
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

  function extractWestEvidence(result) {
    if (!isObject(result)) return {};

    if (isObject(result.evidence)) return result.evidence;
    if (isObject(result.report)) return result.report;
    if (isObject(result.receipt)) return result.receipt;
    if (isObject(result.state) && Object.keys(result.state).some((key) => /^WEST_|^CANVAS_|^RENDERED_/.test(key))) {
      return result.state;
    }

    if (Object.keys(result).some((key) => /^WEST_|^CANVAS_|^RENDERED_|^VISIBLE_|^PLANET_|^CURRENT_/.test(key))) {
      return result;
    }

    return result;
  }

  function normalizeWestEvidence(rawEvidence, state) {
    const evidence = isObject(rawEvidence) ? rawEvidence : {};

    const normalized = {
      WEST_STATUS: getValue(evidence, "WEST_STATUS", "UNKNOWN"),
      WEST_CONTRACT: getValue(evidence, "WEST_CONTRACT", TARGET_WEST_CONTRACT),
      WEST_RECEIPT: getValue(evidence, "WEST_RECEIPT", "UNKNOWN"),
      WEST_IMPLEMENTATION_CONTRACT: getValue(
        evidence,
        "WEST_IMPLEMENTATION_CONTRACT",
        TARGET_WEST_IMPLEMENTATION_CONTRACT
      ),
      WEST_RENDERED_READ_STATUS: getValue(evidence, "WEST_RENDERED_READ_STATUS", "UNKNOWN"),
      WEST_RENDERED_READ_COMPLETE: getValue(evidence, "WEST_RENDERED_READ_COMPLETE", "UNKNOWN"),

      DIAGNOSTIC_TARGET_ACCESS_STATUS: getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", "UNKNOWN"),
      DIAGNOSTIC_TARGET_ACCESS_ERROR: getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", "UNKNOWN"),
      HEARTH_TARGET_CONFIRMED: getValue(evidence, "HEARTH_TARGET_CONFIRMED", "UNKNOWN"),
      CURRENT_VISIBLE_HEARTH_STATUS: getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", "UNKNOWN"),

      CURRENT_HTML_CONTRACT: getValue(evidence, "CURRENT_HTML_CONTRACT", "UNKNOWN"),
      CURRENT_INDEX_JS_CONTRACT: getValue(evidence, "CURRENT_INDEX_JS_CONTRACT", "UNKNOWN"),
      CURRENT_ROUTE_CONDUCTOR_CONTRACT: getValue(evidence, "CURRENT_ROUTE_CONDUCTOR_CONTRACT", "UNKNOWN"),
      CURRENT_ROUTE_CONDUCTOR_RECEIPT: getValue(evidence, "CURRENT_ROUTE_CONDUCTOR_RECEIPT", "UNKNOWN"),

      RENDERED_HTML_CONTRACT: getValue(evidence, "RENDERED_HTML_CONTRACT", "UNKNOWN"),
      RENDERED_HTML_CONTRACT_RECOGNIZED: getValue(evidence, "RENDERED_HTML_CONTRACT_RECOGNIZED", "UNKNOWN"),
      RENDERED_INDEX_JS_SCRIPT_PRESENT: getValue(evidence, "RENDERED_INDEX_JS_SCRIPT_PRESENT", "UNKNOWN"),
      RENDERED_INDEX_JS_SCRIPT_SRC: getValue(evidence, "RENDERED_INDEX_JS_SCRIPT_SRC", "UNKNOWN"),
      RENDERED_INDEX_JS_CONTRACT: getValue(evidence, "RENDERED_INDEX_JS_CONTRACT", "UNKNOWN"),
      RENDERED_INDEX_JS_CONTRACT_RECOGNIZED: getValue(evidence, "RENDERED_INDEX_JS_CONTRACT_RECOGNIZED", "UNKNOWN"),

      RENDERED_PLANET_PROOF_INSPECTED: getValue(evidence, "RENDERED_PLANET_PROOF_INSPECTED", "UNKNOWN"),
      RENDERED_PLANET_PROOF_READY: getValue(evidence, "RENDERED_PLANET_PROOF_READY", "UNKNOWN"),
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: getValue(evidence, "RENDERED_PLANET_PROOF_FULLY_INSPECTED", "UNKNOWN"),
      WEST_RENDERED_PROOF_SPREAD_COMPLETE: getValue(evidence, "WEST_RENDERED_PROOF_SPREAD_COMPLETE", "UNKNOWN"),
      VISIBLE_PLANET_PROOF_READY: getValue(evidence, "VISIBLE_PLANET_PROOF_READY", "UNKNOWN"),
      VISIBLE_PLANET_PROOF_SOURCE: getValue(evidence, "VISIBLE_PLANET_PROOF_SOURCE", "UNKNOWN"),

      CANVAS_EXPRESSION_OBSERVATORY_ACTIVE: getValue(evidence, "CANVAS_EXPRESSION_OBSERVATORY_ACTIVE", "UNKNOWN"),
      CANVAS_EXPRESSION_SURFACE_READY: getValue(evidence, "CANVAS_EXPRESSION_SURFACE_READY", "UNKNOWN"),
      CANVAS_EXPRESSION_RICHNESS_READY: getValue(evidence, "CANVAS_EXPRESSION_RICHNESS_READY", "UNKNOWN"),
      CANVAS_EXPRESSION_PROOF_STATUS: getValue(evidence, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN"),
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: getValue(evidence, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN"),
      CANVAS_EXPRESSION_DATA_SIGNALS_PRESENT: getValue(evidence, "CANVAS_EXPRESSION_DATA_SIGNALS_PRESENT", "UNKNOWN"),

      PLANET_STAGE_PRESENT: getValue(evidence, "PLANET_STAGE_PRESENT", "UNKNOWN"),
      PLANET_STAGE_RECT_NONZERO: getValue(evidence, "PLANET_STAGE_RECT_NONZERO", "UNKNOWN"),
      CANVAS_MOUNT_PRESENT: getValue(evidence, "CANVAS_MOUNT_PRESENT", "UNKNOWN"),
      CANVAS_MOUNT_RECT_NONZERO: getValue(evidence, "CANVAS_MOUNT_RECT_NONZERO", "UNKNOWN"),
      CANVAS_ELEMENT_PRESENT: getValue(evidence, "CANVAS_ELEMENT_PRESENT", "UNKNOWN"),
      CANVAS_ELEMENT_FOUND: getValue(evidence, "CANVAS_ELEMENT_FOUND", "UNKNOWN"),
      CANVAS_RECT_NONZERO: getValue(evidence, "CANVAS_RECT_NONZERO", "UNKNOWN"),
      EXPRESSION_SURFACE_PRESENT: getValue(evidence, "EXPRESSION_SURFACE_PRESENT", "UNKNOWN"),
      EXPRESSION_SURFACE_RECT_NONZERO: getValue(evidence, "EXPRESSION_SURFACE_RECT_NONZERO", "UNKNOWN"),
      DOM_EXPRESSION_SURFACE_PROOF_READY: getValue(evidence, "DOM_EXPRESSION_SURFACE_PROOF_READY", "UNKNOWN"),

      CANVAS_PIXEL_SAMPLE_STATUS: getValue(evidence, "CANVAS_PIXEL_SAMPLE_STATUS", "UNKNOWN"),
      CANVAS_PIXEL_SAMPLE_READABLE: getValue(evidence, "CANVAS_PIXEL_SAMPLE_READABLE", "UNKNOWN"),
      CANVAS_PIXEL_NONEMPTY: getValue(evidence, "CANVAS_PIXEL_NONEMPTY", "UNKNOWN"),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: getValue(evidence, "CANVAS_PIXEL_UNIQUE_COLOR_COUNT", "UNKNOWN"),
      CANVAS_PIXEL_VARIANCE_STATUS: getValue(evidence, "CANVAS_PIXEL_VARIANCE_STATUS", "UNKNOWN"),

      CANVAS_FINGER_OBSERVED_COUNT: getValue(evidence, "CANVAS_FINGER_OBSERVED_COUNT", "UNKNOWN"),
      CANVAS_FINGER_ACTIVE_COUNT: getValue(evidence, "CANVAS_FINGER_ACTIVE_COUNT", "UNKNOWN"),
      CANVAS_FINGER_EXPRESSION_STATUS: getValue(evidence, "CANVAS_FINGER_EXPRESSION_STATUS", "UNKNOWN"),

      NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND: getValue(evidence, "NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND", "UNKNOWN"),
      NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED: getValue(evidence, "NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED", "UNKNOWN"),

      ROUTE_CONDUCTOR_CONTRACT: getValue(evidence, "ROUTE_CONDUCTOR_CONTRACT", "UNKNOWN"),
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: getValue(evidence, "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED", "UNKNOWN"),
      ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET: getValue(
        evidence,
        "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET",
        "UNKNOWN"
      ),

      CURRENT_CANVAS_PARENT_CONTRACT: getValue(evidence, "CURRENT_CANVAS_PARENT_CONTRACT", "UNKNOWN"),
      CURRENT_CANVAS_PARENT_RECOGNIZED: getValue(evidence, "CURRENT_CANVAS_PARENT_RECOGNIZED", "UNKNOWN"),

      LAB_BRIDGE_PRESENT: getValue(evidence, "LAB_BRIDGE_PRESENT", "UNKNOWN"),
      LAB_BRIDGE_CYCLE_LANGUAGE_READABLE: getValue(evidence, "LAB_BRIDGE_CYCLE_LANGUAGE_READABLE", "UNKNOWN"),
      LAB_BRIDGE_CANVAS_HANDOFF_LANGUAGE_READABLE: getValue(evidence, "LAB_BRIDGE_CANVAS_HANDOFF_LANGUAGE_READABLE", "UNKNOWN"),

      CONTROL_FILE_STATUS: getValue(evidence, "CONTROL_FILE_STATUS", "UNKNOWN"),
      CONTROL_FILE_LOADED: getValue(evidence, "CONTROL_FILE_LOADED", "UNKNOWN"),
      CONTROL_GLOBAL_PRESENT: getValue(evidence, "CONTROL_GLOBAL_PRESENT", "UNKNOWN"),
      CONTROL_RECEIPT_PRESENT: getValue(evidence, "CONTROL_RECEIPT_PRESENT", "UNKNOWN"),
      CONTROL_HANDSHAKE_STATUS: getValue(evidence, "CONTROL_HANDSHAKE_STATUS", "UNKNOWN"),
      MOTION_TOUCH_STATUS: getValue(evidence, "MOTION_TOUCH_STATUS", "UNKNOWN"),
      DRAG_STATUS: getValue(evidence, "DRAG_STATUS", "UNKNOWN"),
      VIEW_CONTROL_STATUS: getValue(evidence, "VIEW_CONTROL_STATUS", "UNKNOWN"),

      BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_ACTIVE: getValue(
        evidence,
        "BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_ACTIVE",
        "UNKNOWN"
      ),
      BISHOP_LANE_HUB_COUNT: getValue(evidence, "BISHOP_LANE_HUB_COUNT", "UNKNOWN"),
      BISHOP_LANE_RENDERED_BRIDGE_STATUS: getValue(evidence, "BISHOP_LANE_RENDERED_BRIDGE_STATUS", "UNKNOWN"),
      QUEEN_CANVAS_STATUS: getValue(evidence, "QUEEN_CANVAS_STATUS", "UNKNOWN"),

      FOUR_WAY_CANVAS_HANDOFF_EXPECTED: getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_EXPECTED", "UNKNOWN"),
      FOUR_WAY_CANVAS_HANDOFF_STATUS: getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_STATUS", "UNKNOWN"),

      SHOW_RECEIPT_BUTTON_EXISTS: getValue(evidence, "SHOW_RECEIPT_BUTTON_EXISTS", "UNKNOWN"),
      SHOW_RECEIPT_HIT_TEST_TARGET: getValue(evidence, "SHOW_RECEIPT_HIT_TEST_TARGET", "UNKNOWN"),
      HIT_TEST_UNREADABLE_REASON: getValue(evidence, "HIT_TEST_UNREADABLE_REASON", "UNKNOWN"),
      SHOW_RECEIPT_HIT_TEST_NON_CONTROLLING: getValue(evidence, "SHOW_RECEIPT_HIT_TEST_NON_CONTROLLING", "UNKNOWN"),

      RUNTIME_RELEASE_STATE: getValue(evidence, "RUNTIME_RELEASE_STATE", "UNKNOWN"),
      RUNTIME_RELEASE_IS_LOCK: getValue(evidence, "RUNTIME_RELEASE_IS_LOCK", "UNKNOWN"),

      WEST_SECONDARY_EVIDENCE_NOTES: getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", "none")
    };

    normalized.PROBE_WEST_NORMALIZED_RENDERED_PROOF_READY =
      normalized.RENDERED_PLANET_PROOF_READY === "true" ||
      normalized.VISIBLE_PLANET_PROOF_READY === "true"
        ? "true"
        : "false";

    normalized.PROBE_WEST_NORMALIZED_CANVAS_EXPRESSION_ANCHOR =
      normalized.CANVAS_EXPRESSION_BOTTLENECK_CLASS !== "UNKNOWN"
        ? normalized.CANVAS_EXPRESSION_BOTTLENECK_CLASS
        : normalized.CANVAS_EXPRESSION_PROOF_STATUS !== "UNKNOWN"
          ? normalized.CANVAS_EXPRESSION_PROOF_STATUS
          : "UNKNOWN";

    normalized.PROBE_WEST_NORMALIZED_CANVAS_DOM_SURFACE_STATUS =
      normalized.CANVAS_ELEMENT_FOUND === "true" ||
      normalized.CANVAS_ELEMENT_PRESENT === "true" ||
      normalized.CANVAS_RECT_NONZERO === "true"
        ? "CANVAS_DOM_SURFACE_OBSERVED"
        : "CANVAS_DOM_SURFACE_NOT_OBSERVED_BY_WEST";

    normalized.PROBE_WEST_OUTPUT_STATUS =
      normalized.WEST_RENDERED_READ_STATUS === "COMPLETE" ||
      normalized.DIAGNOSTIC_TARGET_ACCESS_STATUS === "RENDERED_TARGET_ACCESSIBLE"
        ? "COMPLETE"
        : state.probeWestStatus === "FAILED"
          ? "FAILED"
          : "PARTIAL";

    return normalized;
  }

  function makeState() {
    return {
      packetName: "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_PACKET_v1_1",
      probeWestStatus: "READY",
      probeWestRunComplete: "false",
      probeWestRunStatus: "WAITING_RUN",

      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      anchorStatus: "ANCHOR_PUBLISHED",
      anchorObserved: true,
      anchorSourcePathPrimary: ANCHOR_SOURCE_PATH_PRIMARY,
      anchorSourcePaths: ANCHOR_SOURCE_PATHS.join(","),
      chronologyObservationGuard: "PUBLISHES_IMMEDIATELY_BEFORE_TARGET_ORIGIN_READ_AND_AFTER_EACH_RUN",
      chronologyFailureClassAddressed: "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE",

      originWestFile: ORIGIN_WEST_FILE,
      originWestContract: "UNKNOWN",
      originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,
      originWestApiPath: "UNKNOWN",
      originWestApiContext: "UNKNOWN",
      originWestApiMethod: "UNKNOWN",
      originWestApiAvailable: "false",

      targetResolutionStatus: "UNKNOWN",
      targetSource: "UNKNOWN",
      targetDocumentAvailable: "false",
      targetWindowAvailable: "false",
      frameElementAvailable: "false",

      westRunOk: "UNKNOWN",
      westRunError: "UNKNOWN",
      westEvidenceAvailable: "false",

      notes: [],
      normalizedWestEvidence: {},
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function makeEvidencePacket(state) {
    const normalized = normalizeWestEvidence(state.normalizedWestEvidence || {}, state);

    return {
      PACKET_NAME: state.packetName,

      PROBE_WEST_STATUS: state.probeWestStatus,
      PROBE_WEST_CONTRACT: CONTRACT,
      PROBE_WEST_RECEIPT: RECEIPT,
      PROBE_WEST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_WEST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_WEST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      PROBE_WEST_VERSION: VERSION,
      PROBE_WEST_FILE: FILE,

      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,

      PROBE_WEST_ANCHOR_STATUS: state.anchorStatus,
      PROBE_WEST_ANCHOR_OBSERVED: boolText(state.anchorObserved, "false"),
      PROBE_WEST_ANCHOR_SOURCE_PATH_PRIMARY: state.anchorSourcePathPrimary,
      PROBE_WEST_ANCHOR_SOURCE_PATHS: state.anchorSourcePaths,
      PROBE_WEST_CHRONOLOGY_OBSERVATION_GUARD: state.chronologyObservationGuard,
      PROBE_WEST_CHRONOLOGY_FAILURE_CLASS_ADDRESSED: state.chronologyFailureClassAddressed,
      PROBE_WEST_ANCHOR_PUBLISH_COUNT: String(anchorPublishCount),

      PROBE_WEST_RUN_COMPLETE: state.probeWestRunComplete,
      PROBE_WEST_RUN_STATUS: state.probeWestRunStatus,

      PROBE_WEST_ORIGIN_FILE: ORIGIN_WEST_FILE,
      PROBE_WEST_ORIGIN_CONTRACT: state.originWestContract,
      PROBE_WEST_ORIGIN_IMPLEMENTATION_CONTRACT: state.originWestImplementationContract,
      PROBE_WEST_ORIGIN_API_PATH: state.originWestApiPath,
      PROBE_WEST_ORIGIN_API_CONTEXT: state.originWestApiContext,
      PROBE_WEST_ORIGIN_API_METHOD: state.originWestApiMethod,
      PROBE_WEST_ORIGIN_API_AVAILABLE: state.originWestApiAvailable,

      PROBE_WEST_TARGET_RESOLUTION_STATUS: state.targetResolutionStatus,
      PROBE_WEST_TARGET_SOURCE: state.targetSource,
      PROBE_WEST_TARGET_DOCUMENT_AVAILABLE: state.targetDocumentAvailable,
      PROBE_WEST_TARGET_WINDOW_AVAILABLE: state.targetWindowAvailable,
      PROBE_WEST_FRAME_ELEMENT_AVAILABLE: state.frameElementAvailable,

      PROBE_WEST_WEST_RUN_OK: state.westRunOk,
      PROBE_WEST_WEST_RUN_ERROR: state.westRunError,
      PROBE_WEST_WEST_EVIDENCE_AVAILABLE: state.westEvidenceAvailable,

      ...normalized,

      PROBE_WEST_NOTES: state.notes.length ? state.notes.join(" | ") : "none",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      MACRO_WEST_RELEASE_AUTHORIZED: false,
      SYNTHETIC_ACTIVATION_AUTHORIZED: false,
      WEST_ORIGIN_RENEWAL_AUTHORIZED: false,
      RENDERED_TARGET_AUTHORITY: false,
      FINAL_PRIMARY_CASE_AUTHORITY: false,
      FINAL_RECOMMENDATION_AUTHORITY: false,
      PACKET_FORMATTING_AUTHORITY: false,
      DIAGNOSTIC_UI_AUTHORITY: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: state.updatedAt
    };
  }

  function publish(state, reason = "publish") {
    const nextState = state || lastState || makeState();
    nextState.updatedAt = nowIso();

    lastState = clonePlain(nextState);
    lastEvidence = makeEvidencePacket(nextState);

    publishAnchor(reason);

    return lastEvidence;
  }

  function publishAnchor(reason = "anchor") {
    anchorPublishCount += 1;

    api.contract = CONTRACT;
    api.CONTRACT = CONTRACT;
    api.receipt = RECEIPT;
    api.RECEIPT = RECEIPT;
    api.implementationContract = IMPLEMENTATION_CONTRACT;
    api.implementationReceipt = IMPLEMENTATION_RECEIPT;
    api.version = VERSION;
    api.file = FILE;
    api.targetRoute = TARGET_ROUTE;
    api.diagnosticRoute = DIAGNOSTIC_ROUTE;

    api.PROBE_WEST_ANCHOR_STATUS = "ANCHOR_PUBLISHED";
    api.PROBE_WEST_ANCHOR_OBSERVED = true;
    api.PROBE_WEST_ANCHOR_SOURCE_PATH_PRIMARY = ANCHOR_SOURCE_PATH_PRIMARY;
    api.PROBE_WEST_ANCHOR_SOURCE_PATHS = ANCHOR_SOURCE_PATHS.join(",");
    api.PROBE_WEST_CHRONOLOGY_OBSERVATION_GUARD =
      "PUBLISHES_IMMEDIATELY_BEFORE_TARGET_ORIGIN_READ_AND_AFTER_EACH_RUN";
    api.PROBE_WEST_CHRONOLOGY_FAILURE_CLASS_ADDRESSED =
      "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE";
    api.PROBE_WEST_ANCHOR_PUBLISH_COUNT = anchorPublishCount;
    api.PROBE_WEST_ANCHOR_LAST_REASON = reason;
    api.PROBE_WEST_ANCHOR_LAST_PUBLISHED_AT = nowIso();

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    for (const path of ANCHOR_SOURCE_PATHS) setPath(path, api);

    root.HEARTH.diagnosticProbeWestReceipt = getProbeWestReceipt();
    root.HEARTH.diagnosticProbeWestEvidence = getProbeWestEvidence();
    root.HEARTH.diagnosticProbeWestState = getProbeWestState();

    root.DEXTER_LAB.hearthDiagnosticProbeWestReceipt = getProbeWestReceipt();
    root.DEXTER_LAB.hearthDiagnosticProbeWestEvidence = getProbeWestEvidence();

    root.HEARTH_DIAGNOSTIC_PROBE_WEST_RECEIPT = getProbeWestReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_WEST_EVIDENCE = getProbeWestEvidence();

    try {
      const doc = root.document || null;
      if (doc && doc.documentElement && doc.documentElement.dataset) {
        doc.documentElement.dataset.hearthDiagnosticProbeWestObserved = "true";
        doc.documentElement.dataset.hearthDiagnosticProbeWestContract = CONTRACT;
        doc.documentElement.dataset.hearthDiagnosticProbeWestReceipt = RECEIPT;
        doc.documentElement.dataset.hearthDiagnosticProbeWestImplementationContract = IMPLEMENTATION_CONTRACT;
        doc.documentElement.dataset.hearthDiagnosticProbeWestAnchorStatus = "ANCHOR_PUBLISHED";
        doc.documentElement.dataset.hearthDiagnosticProbeWestChronologyFailureClassAddressed =
          "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE";
      }
    } catch (_error) {}

    return true;
  }

  function finalize(state, status, runStatus) {
    state.probeWestStatus = status;
    state.probeWestRunStatus = runStatus;
    state.probeWestRunComplete = status === "COMPLETE" || status === "PARTIAL" ? "true" : "false";
    state.updatedAt = nowIso();

    const evidence = publish(state, `finalize:${status}`);

    return {
      ok: status !== "FAILED",
      ...evidence,
      evidence: clonePlain(evidence),
      state: clonePlain(lastState)
    };
  }

  function invokeWestApi(west, westOptions, state) {
    if (!west || !west.api || !west.method || !isFunction(west.api[west.method])) {
      state.westRunOk = "false";
      state.westRunError = "WEST_ORIGIN_API_NOT_AVAILABLE";
      state.westEvidenceAvailable = "false";
      state.normalizedWestEvidence = {};
      addNote(state, "PROBE_WEST_HELD_ORIGIN_WEST_API_NOT_AVAILABLE");
      return finalize(state, "FAILED", "FAILED_ORIGIN_WEST_API_NOT_AVAILABLE");
    }

    let result;

    try {
      result = west.api[west.method](westOptions);
    } catch (error) {
      state.westRunOk = "false";
      state.westRunError = `WEST_ORIGIN_API_THROWN:${clean(error && error.message ? error.message : error, 1200)}`;
      state.westEvidenceAvailable = "false";
      state.normalizedWestEvidence = {};
      addNote(state, state.westRunError);
      return finalize(state, "FAILED", "FAILED_WEST_ORIGIN_API_THROWN");
    }

    if (result && isFunction(result.then)) {
      return result
        .then((resolved) => completeWestResult(resolved, state))
        .catch((error) => {
          state.westRunOk = "false";
          state.westRunError = `WEST_ORIGIN_API_ASYNC_REJECTED:${clean(error && error.message ? error.message : error, 1200)}`;
          state.westEvidenceAvailable = "false";
          state.normalizedWestEvidence = {};
          addNote(state, state.westRunError);
          return finalize(state, "FAILED", "FAILED_WEST_ORIGIN_API_ASYNC_REJECTED");
        });
    }

    return completeWestResult(result, state);
  }

  function completeWestResult(result, state) {
    const westEvidence = extractWestEvidence(result);
    const evidenceAvailable = Boolean(westEvidence && Object.keys(westEvidence).length);

    state.westRunOk = boolText(Boolean(!result || result.ok !== false), "false");
    state.westRunError = result && result.error ? clean(result.error, 1200) : "none";
    state.westEvidenceAvailable = boolText(evidenceAvailable, "false");
    state.normalizedWestEvidence = westEvidence || {};

    const normalized = normalizeWestEvidence(westEvidence, state);

    const complete =
      normalized.WEST_RENDERED_READ_STATUS === "COMPLETE" ||
      normalized.DIAGNOSTIC_TARGET_ACCESS_STATUS === "RENDERED_TARGET_ACCESSIBLE" ||
      normalized.RENDERED_PLANET_PROOF_READY === "true" ||
      normalized.VISIBLE_PLANET_PROOF_READY === "true";

    if (complete) {
      addNote(state, "PROBE_WEST_RENDERED_TARGET_EVIDENCE_NORMALIZED_COMPLETE");
      return finalize(state, "COMPLETE", "COMPLETE");
    }

    addNote(state, "PROBE_WEST_RENDERED_TARGET_EVIDENCE_NORMALIZED_PARTIAL");
    return finalize(state, "PARTIAL", "PARTIAL_WEST_EVIDENCE_NORMALIZED_BUT_NOT_COMPLETE");
  }

  function runProbeWest(options = {}) {
    const state = makeState();

    state.probeWestStatus = "RUNNING";
    state.probeWestRunStatus = "RUNNING";
    state.probeWestRunComplete = "false";
    state.updatedAt = nowIso();

    publish(state, "run-start-anchor");

    try {
      const target = resolveTarget(options, state);

      state.targetSource = target.source || "NONE";
      state.targetDocumentAvailable = boolText(Boolean(target.targetDocument), "false");
      state.targetWindowAvailable = boolText(Boolean(target.targetWindow), "false");
      state.frameElementAvailable = boolText(Boolean(target.frameElement), "false");

      state.targetResolutionStatus =
        target.targetDocument && target.targetWindow
          ? "RENDERED_HEARTH_TARGET_RESOLVED"
          : "RENDERED_HEARTH_TARGET_NOT_RESOLVED";

      const west = findWestApi(target.targetWindow, state);

      state.originWestApiPath = west.path || "NONE";
      state.originWestApiContext = west.contextName || "NONE";
      state.originWestApiMethod = west.method || "NONE";
      state.originWestContract = west.contract || "UNKNOWN";
      state.originWestImplementationContract =
        clean(firstDefined(
          west.receipt && west.receipt.implementationContract,
          west.receipt && west.receipt.WEST_IMPLEMENTATION_CONTRACT,
          TARGET_WEST_IMPLEMENTATION_CONTRACT
        ), 900) || TARGET_WEST_IMPLEMENTATION_CONTRACT;
      state.originWestApiAvailable = boolText(Boolean(west.api && isFunction(west.api[west.method])), "false");

      const westOptions = {
        targetDocument: target.targetDocument || undefined,
        targetWindow: target.targetWindow || undefined,
        frameElement: target.frameElement || undefined,

        sourceMismatchControlling: Boolean(options.sourceMismatchControlling),
        allowSyntheticActivation: false,
        northPermitsSyntheticActivation: false,
        syntheticActivationPermittedByNorth: false,

        probeWestBridge: true,
        probeWestContract: CONTRACT,
        probeWestImplementationContract: IMPLEMENTATION_CONTRACT,
        probeWestChronologyAnchorObserved: true,
        probeWestChronologyFailureClassAddressed: "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE"
      };

      return invokeWestApi(west, westOptions, state);
    } catch (error) {
      state.westRunOk = "false";
      state.westRunError = `PROBE_WEST_TOP_LEVEL_ERROR:${clean(error && error.message ? error.message : error, 1200)}`;
      state.westEvidenceAvailable = "false";
      state.normalizedWestEvidence = {};
      addNote(state, state.westRunError);

      return finalize(state, "FAILED", "FAILED_PROBE_WEST_TOP_LEVEL_ERROR");
    }
  }

  function getProbeWestEvidence() {
    if (lastEvidence) return clonePlain(lastEvidence);
    return makeEvidencePacket(makeState());
  }

  function getProbeWestState() {
    return clonePlain(lastState || makeState());
  }

  function getProbeWestReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "PROBE_WEST_RENDERED_TARGET_BRIDGE",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      probeWestAnchorStatus: "ANCHOR_PUBLISHED",
      probeWestAnchorObserved: true,
      probeWestAnchorSourcePathPrimary: ANCHOR_SOURCE_PATH_PRIMARY,
      probeWestAnchorSourcePaths: ANCHOR_SOURCE_PATHS.join(","),
      probeWestChronologyObservationGuard:
        "PUBLISHES_IMMEDIATELY_BEFORE_TARGET_ORIGIN_READ_AND_AFTER_EACH_RUN",
      probeWestChronologyFailureClassAddressed:
        "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE",
      probeWestAnchorPublishCount: anchorPublishCount,

      originWestFile: ORIGIN_WEST_FILE,
      originWestContract: TARGET_WEST_CONTRACT,
      originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,
      originWestRenewalRequired: false,

      bridgePurpose:
        "Resolve rendered Hearth target and call existing WEST diagnostic rail without renewing origin WEST.",
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
      lastProbeWestRunStatus: state.probeWestRunStatus,
      lastProbeWestRunComplete: state.probeWestRunComplete,
      lastOriginWestApiPath: state.originWestApiPath,
      lastOriginWestApiAvailable: state.originWestApiAvailable,
      lastTargetResolutionStatus: state.targetResolutionStatus,
      lastTargetSource: state.targetSource,
      lastWestRunOk: state.westRunOk,
      lastWestRunError: state.westRunError,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return getProbeWestReceipt();
  }

  function getReceiptLight() {
    return getProbeWestReceipt();
  }

  function getStatus() {
    return getProbeWestEvidence();
  }

  function getReport() {
    return getProbeWestEvidence();
  }

  function getState() {
    return getProbeWestState();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    originWestFile: ORIGIN_WEST_FILE,
    originWestContract: TARGET_WEST_CONTRACT,
    originWestImplementationContract: TARGET_WEST_IMPLEMENTATION_CONTRACT,

    PROBE_WEST_ANCHOR_STATUS: "ANCHOR_PUBLISHED",
    PROBE_WEST_ANCHOR_OBSERVED: true,
    PROBE_WEST_ANCHOR_SOURCE_PATH_PRIMARY: ANCHOR_SOURCE_PATH_PRIMARY,
    PROBE_WEST_ANCHOR_SOURCE_PATHS: ANCHOR_SOURCE_PATHS.join(","),
    PROBE_WEST_CHRONOLOGY_OBSERVATION_GUARD:
      "PUBLISHES_IMMEDIATELY_BEFORE_TARGET_ORIGIN_READ_AND_AFTER_EACH_RUN",
    PROBE_WEST_CHRONOLOGY_FAILURE_CLASS_ADDRESSED:
      "SCRIPT_ALREADY_PRESENT_OBSERVED_FALSE",

    runProbeWest,
    getProbeWestReceipt,
    getProbeWestState,
    getProbeWestEvidence,
    getReceipt,
    getReceiptLight,
    getStatus,
    getReport,
    getState,
    publishAnchor,

    supportsChronologyAnchor: true,
    supportsScriptAlreadyPresentObservedFalseRepair: true,
    supportsRenderedTargetFrameResolution: true,
    supportsDiagnosticReceiverRejection: true,
    supportsExistingWestApiBridge: true,
    supportsWestEvidenceNormalization: true,
    supportsNorthConsumableProbeEvidence: true,

    ownsChronologyAnchorPublication: true,
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

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    syntheticActivationAuthorized: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  });

  try {
    publish(makeState(), "initial-chronology-anchor-publication");
  } catch (_error) {
    try {
      publishAnchor("initial-anchor-fallback");
    } catch (__error) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
