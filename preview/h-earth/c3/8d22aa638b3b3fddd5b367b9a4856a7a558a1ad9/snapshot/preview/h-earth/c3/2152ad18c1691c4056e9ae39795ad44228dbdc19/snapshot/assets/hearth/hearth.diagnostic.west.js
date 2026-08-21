// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_TNT_v10
// Full-file replacement.
// West Diagnostic / rendered-target authority probe / strict runtime endpoint-family reader only.
//
// Purpose:
// - Preserve the public West Diagnostic contract.
// - Replace the found-but-not-runnable v9 implementation surface.
// - Publish callable direct methods for the diagnostic chamber.
// - Read rendered-target, endpoint-family, canvas-boundary, and target-access evidence.
// - Keep LabWest separate from West Diagnostic.
// - Return receipt fields expected by the chamber.
// - Do not mutate production, canvas, controls, runtime route, showroom HTML, or diagnostic HTML.
//
// Does not authorize:
// - production mutation
// - canvas build
// - canvas release
// - controls mutation
// - runtime restart
// - visual pass claim
// - generated image claim
// - public superiority claim

(function hearthDiagnosticWestDirectMethodSurfaceFactory(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var documentRef = root.document || null;

  var PUBLIC_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  var PUBLIC_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";

  var IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_TNT_v10";
  var IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_DIRECT_METHOD_SURFACE_RECEIPT_v10";

  var PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_TNT_v9";

  var VERSION =
    "2026-06-09.hearth-diagnostic-west-strict-runtime-endpoint-family-reader-direct-method-surface-v10";

  var FILE = "/assets/hearth/hearth.diagnostic.west.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var ROLE = "WEST_DIAGNOSTIC_DIRECT_METHOD_SURFACE";
  var COMPONENT = "WEST_DIAGNOSTIC";
  var NEWS_ROLE = "WEST";
  var NEWS_DUTY = "BOUNDARY_RENDERED_TARGET_ENDPOINT_FAMILY_READER";

  var NO_TOUCH = Object.freeze({
    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CONTROLS_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    F55_CLAIMED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PUBLIC_SUPERIORITY_CLAIM: false
  });

  var TARGET_FRAME_SELECTORS = Object.freeze([
    "iframe[data-hearth-target-frame]",
    "iframe[data-hearth-production-frame]",
    "iframe[data-diagnostic-target-frame]",
    "iframe#hearthTargetFrame",
    "iframe#hearthProductionFrame",
    "iframe#targetFrame",
    "iframe[src*='/showroom/globe/hearth/']"
  ]);

  var CANVAS_MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount='true']",
    "[data-hearth-showroom-surface='true']",
    "[data-hearth-visible-surface='true']",
    ".hearth-canvas-mount",
    ".canvas-mount"
  ]);

  var CANVAS_SELECTORS = Object.freeze([
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-dom-surface='true']",
    "canvas"
  ]);

  var SURFACE_TRUTH_ALIASES = Object.freeze([
    "HEARTH.canvasSurfaceTruthProbe",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
    "DEXTER_LAB.canvasSurfaceTruthProbe",
    "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
  ]);

  var CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.chapel1AssetsCanvasHub",
    "HEARTH.CHAPEL_1_ASSETS_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasAuthority"
  ]);

  var LABWEST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.labRuntimeTableWest",
    "HEARTH.labWestConstruct",
    "HEARTH.diagnosticLabWest",
    "HEARTH.diagnosticLabWestConstruct",
    "HEARTH_DIAGNOSTIC_LABWEST",
    "HEARTH_DIAGNOSTIC_LABWEST_CONSTRUCT",
    "DEXTER_LAB.hearthDiagnosticLabWest"
  ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function compact(value, limit) {
    if (limit === undefined) limit = 5000;
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
      if (isObject(value)) {
        var out = {};
        Object.keys(value).forEach(function copyKey(key) {
          var item = value[key];
          if (typeof item !== "function") out[key] = item;
        });
        return out;
      }
      return value;
    }
  }

  function readPath(path) {
    var parts = safeString(path).replace(/^window\./, "").split(".");
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i];
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) {
        return null;
      }
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function ensureNamespace(name) {
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function setPath(path, value) {
    var parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    var cursor = root;
    for (var i = 0; i < parts.length - 1; i += 1) {
      var part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstAlias(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value) return { path: paths[i], value: value };
    }
    return { path: "NONE", value: null };
  }

  function getRaw(source, key, fallback) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      var direct = source[key];
      return direct === undefined || direct === null ? fallback : direct;
    }

    var lower = key.toLowerCase();
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i += 1) {
      if (keys[i].toLowerCase() === lower) {
        var value = source[keys[i]];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function callReadMethod(authority) {
    if (!authority) {
      return {
        called: false,
        method: "NONE",
        error: "NO_AUTHORITY",
        output: null
      };
    }

    var methods = [
      "runDiagnostic",
      "run",
      "inspect",
      "getReport",
      "getReceipt",
      "getReceiptLight",
      "getStatus",
      "getState",
      "getSummary"
    ];

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];
      if (!isFunction(authority[method])) continue;

      try {
        var output = method === "getReport"
          ? authority[method]({ refresh: true })
          : authority[method]();

        return {
          called: true,
          method: method,
          error: "NONE",
          output: output
        };
      } catch (error) {
        return {
          called: true,
          method: method,
          error: compact(error && error.message ? error.message : error),
          output: null
        };
      }
    }

    return {
      called: false,
      method: "NONE",
      error: "NO_READ_METHOD",
      output: null
    };
  }

  function queryFirst(selectors, context) {
    var base = context || documentRef;
    if (!base || !isFunction(base.querySelector)) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = base.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }

    return null;
  }

  function rectOf(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }

    try {
      var rect = element.getBoundingClientRect();
      return {
        width: Number(rect.width) || 0,
        height: Number(rect.height) || 0,
        left: Number(rect.left) || 0,
        top: Number(rect.top) || 0,
        right: Number(rect.right) || 0,
        bottom: Number(rect.bottom) || 0
      };
    } catch (_error) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  function getFrameDocument(frame) {
    if (!frame) return null;

    try {
      if (frame.contentDocument) return frame.contentDocument;
      if (frame.contentWindow && frame.contentWindow.document) {
        return frame.contentWindow.document;
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  function inspectTargetAccess() {
    var localMount = queryFirst(CANVAS_MOUNT_SELECTORS, documentRef);
    var localCanvas = queryFirst(CANVAS_SELECTORS, localMount || documentRef);

    if (localMount || localCanvas) {
      return {
        targetAccessStatus: "LOCAL_DOCUMENT_TARGET_SURFACE_READABLE",
        targetSurfaceKind: "LOCAL_DOCUMENT",
        targetFrameFound: false,
        targetFrameReadable: false,
        targetDocumentReadable: Boolean(documentRef),
        targetMountFound: Boolean(localMount),
        targetCanvasFound: Boolean(localCanvas),
        targetMountRect: rectOf(localMount),
        targetCanvasRect: rectOf(localCanvas)
      };
    }

    var frame = queryFirst(TARGET_FRAME_SELECTORS, documentRef);
    var frameDoc = getFrameDocument(frame);
    var frameMount = frameDoc ? queryFirst(CANVAS_MOUNT_SELECTORS, frameDoc) : null;
    var frameCanvas = frameDoc ? queryFirst(CANVAS_SELECTORS, frameMount || frameDoc) : null;

    if (frame) {
      return {
        targetAccessStatus: frameDoc
          ? "IFRAME_TARGET_DOCUMENT_READABLE"
          : "IFRAME_TARGET_DOCUMENT_NOT_READABLE",
        targetSurfaceKind: "IFRAME",
        targetFrameFound: true,
        targetFrameReadable: Boolean(frameDoc),
        targetDocumentReadable: Boolean(frameDoc),
        targetMountFound: Boolean(frameMount),
        targetCanvasFound: Boolean(frameCanvas),
        targetFrameRect: rectOf(frame),
        targetMountRect: rectOf(frameMount),
        targetCanvasRect: rectOf(frameCanvas)
      };
    }

    return {
      targetAccessStatus: "TARGET_SURFACE_NOT_FOUND",
      targetSurfaceKind: "NONE",
      targetFrameFound: false,
      targetFrameReadable: false,
      targetDocumentReadable: Boolean(documentRef),
      targetMountFound: false,
      targetCanvasFound: false,
      targetMountRect: rectOf(null),
      targetCanvasRect: rectOf(null)
    };
  }

  function inspectRenderedTarget() {
    var access = inspectTargetAccess();
    var mountRect = access.targetMountRect || rectOf(null);
    var canvasRect = access.targetCanvasRect || rectOf(null);

    var mountRectNonZero = Boolean(mountRect.width > 0 && mountRect.height > 0);
    var canvasRectNonZero = Boolean(canvasRect.width > 0 && canvasRect.height > 0);

    var renderedReadStatus = "UNKNOWN";
    if (access.targetMountFound && access.targetCanvasFound && mountRectNonZero && canvasRectNonZero) {
      renderedReadStatus = "TARGET_SURFACE_AND_CANVAS_RECT_READABLE";
    } else if (access.targetMountFound && mountRectNonZero) {
      renderedReadStatus = "TARGET_SURFACE_RECT_READABLE_CANVAS_UNCONFIRMED";
    } else if (access.targetMountFound && !mountRectNonZero) {
      renderedReadStatus = "TARGET_SURFACE_FOUND_RECT_ZERO";
    } else if (access.targetCanvasFound && !canvasRectNonZero) {
      renderedReadStatus = "TARGET_CANVAS_FOUND_RECT_ZERO";
    } else if (!access.targetMountFound && !access.targetCanvasFound) {
      renderedReadStatus = "TARGET_SURFACE_NOT_VISIBLE_TO_WEST";
    }

    return {
      targetAccessStatus: access.targetAccessStatus,
      targetSurfaceKind: access.targetSurfaceKind,
      targetFrameFound: access.targetFrameFound,
      targetFrameReadable: access.targetFrameReadable,
      targetDocumentReadable: access.targetDocumentReadable,
      targetMountFound: access.targetMountFound,
      targetCanvasFound: access.targetCanvasFound,
      targetMountRect: mountRect,
      targetCanvasRect: canvasRect,
      targetMountRectNonZero: mountRectNonZero,
      targetCanvasRectNonZero: canvasRectNonZero,
      renderedReadStatus: renderedReadStatus
    };
  }

  function inspectSurfaceTruth() {
    var found = firstAlias(SURFACE_TRUTH_ALIASES);
    var call = callReadMethod(found.value);
    var output = call.output;

    var status = "UNKNOWN";
    if (!found.value) {
      status = "SURFACE_TRUTH_AUTHORITY_NOT_FOUND";
    } else if (call.called && call.error === "NONE") {
      status = "SURFACE_TRUTH_AUTHORITY_READABLE";
    } else if (call.called && call.error !== "NONE") {
      status = "SURFACE_TRUTH_AUTHORITY_READ_ERROR";
    } else {
      status = "SURFACE_TRUTH_AUTHORITY_FOUND_NO_READ_METHOD";
    }

    return {
      surfaceTruthPath: found.path,
      surfaceTruthPresent: Boolean(found.value),
      surfaceTruthReadMethod: call.method,
      surfaceTruthReadError: call.error,
      canvasSurfaceTruthStatus: status,
      surfaceTruthOutput: clonePlain(output)
    };
  }

  function inspectCanvasBoundary() {
    var found = firstAlias(CANVAS_AUTHORITY_ALIASES);

    return {
      canvasAuthorityPath: found.path,
      canvasAuthorityPresent: Boolean(found.value),
      canvasBoundaryStatus: "CANVAS_BOUNDARY_PROTECTED_READ_ONLY",
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasMutationAuthorized: false
    };
  }

  function inspectLabWestSeparation() {
    var found = firstAlias(LABWEST_ALIASES);

    return {
      labWestPath: found.path,
      labWestPresent: Boolean(found.value),
      labWestSeparatedFromWestDiagnostic: true,
      labWestStatus: found.value ? "LABWEST_FOUND_SEPARATE" : "LABWEST_NOT_FOUND_SEPARATE_STILL_TRUE"
    };
  }

  function computeRecommendation(rendered, surfaceTruth) {
    if (!rendered.targetMountFound && !rendered.targetCanvasFound) {
      return {
        nextFile: "/showroom/globe/hearth/index.html",
        nextAction: "VERIFY_SHOWROOM_HEARTH_HTML_CANVAS_MOUNT_AND_ROUTE_SCRIPT"
      };
    }

    if (rendered.targetMountFound && !rendered.targetMountRectNonZero) {
      return {
        nextFile: "/showroom/globe/hearth/index.html",
        nextAction: "RENEW_HEARTH_SHOWROOM_HTML_STAGE_LAYOUT_NONZERO_MOUNT"
      };
    }

    if (surfaceTruth.canvasSurfaceTruthStatus === "SURFACE_TRUTH_AUTHORITY_NOT_FOUND") {
      return {
        nextFile: "/assets/hearth/hearth.diagnostic.south.surface.pointer.js",
        nextAction: "VERIFY_SURFACE_TRUTH_OR_SOUTH_POINTER_DIAGNOSTIC_ADAPTER_LOAD"
      };
    }

    return {
      nextFile: "/assets/hearth/hearth.diagnostic.rail.js",
      nextAction: "RUN_NORTH_SYNTHESIS_WITH_WEST_DIRECT_RECEIPT"
    };
  }

  function createPacket(mode) {
    var rendered = inspectRenderedTarget();
    var surfaceTruth = inspectSurfaceTruth();
    var canvasBoundary = inspectCanvasBoundary();
    var labWest = inspectLabWestSeparation();
    var recommendation = computeRecommendation(rendered, surfaceTruth);

    var visiblePlanetProofReady = Boolean(
      rendered.targetMountFound &&
      rendered.targetCanvasFound &&
      rendered.targetMountRectNonZero &&
      rendered.targetCanvasRectNonZero
    );

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_WEST_DIRECT_METHOD_SURFACE_PACKET_v10",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      NEWS_ROLE: NEWS_ROLE,
      NEWS_DUTY: NEWS_DUTY,
      MODE: mode || "RUN_DIAGNOSTIC",

      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: IMPLEMENTATION_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: IMPLEMENTATION_RECEIPT,
      PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      RUN_STATE: "WEST_DIAGNOSTIC_DIRECT_RUN_COMPLETE",
      TRUST_STATE: "WEST_DIRECT_METHOD_SURFACE_ACTIVE",
      BLOCKING: false,

      WEST_DIAGNOSTIC_AUTHORITY_PATH: "HEARTH.diagnosticWest",
      WEST_DIAGNOSTIC_PRESENT: true,
      WEST_DIAGNOSTIC_STATUS: "AUTHORITY_FOUND",
      WEST_DIAGNOSTIC_RUN_EXECUTED: true,
      WEST_DIAGNOSTIC_DIRECT_METHOD: "runDiagnostic",
      WEST_DIAGNOSTIC_DIRECT_ERROR: "NONE",

      WEST_DIAGNOSTIC_CONTRACT: PUBLIC_CONTRACT,
      WEST_DIAGNOSTIC_RECEIPT: PUBLIC_RECEIPT,
      WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_DIAGNOSTIC_INTERNAL_RENEWAL_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_DIAGNOSTIC_FILE: FILE,

      WEST_DIAGNOSTIC_RENDERED_READ_STATUS: rendered.renderedReadStatus,
      WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS: rendered.targetAccessStatus,
      WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY: visiblePlanetProofReady,
      WEST_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_STATUS: surfaceTruth.canvasSurfaceTruthStatus,
      WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE: recommendation.nextFile,
      WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION: recommendation.nextAction,

      TARGET_SURFACE_KIND: rendered.targetSurfaceKind,
      TARGET_FRAME_FOUND: rendered.targetFrameFound,
      TARGET_FRAME_READABLE: rendered.targetFrameReadable,
      TARGET_DOCUMENT_READABLE: rendered.targetDocumentReadable,
      TARGET_MOUNT_FOUND: rendered.targetMountFound,
      TARGET_CANVAS_FOUND: rendered.targetCanvasFound,
      TARGET_MOUNT_RECT_NONZERO: rendered.targetMountRectNonZero,
      TARGET_CANVAS_RECT_NONZERO: rendered.targetCanvasRectNonZero,
      TARGET_MOUNT_RECT: rendered.targetMountRect,
      TARGET_CANVAS_RECT: rendered.targetCanvasRect,

      SURFACE_TRUTH_AUTHORITY_PATH: surfaceTruth.surfaceTruthPath,
      SURFACE_TRUTH_PRESENT: surfaceTruth.surfaceTruthPresent,
      SURFACE_TRUTH_READ_METHOD: surfaceTruth.surfaceTruthReadMethod,
      SURFACE_TRUTH_READ_ERROR: surfaceTruth.surfaceTruthReadError,

      CANVAS_AUTHORITY_PATH: canvasBoundary.canvasAuthorityPath,
      CANVAS_AUTHORITY_PRESENT: canvasBoundary.canvasAuthorityPresent,
      CANVAS_BOUNDARY_STATUS: canvasBoundary.canvasBoundaryStatus,

      LABWEST_GATE_IS_SEPARATE_RECEIPT: "07 · LabWest Gate",
      WEST_DIAGNOSTIC_IS_SEPARATE_RECEIPT: "12 · West Diagnostic Direct",
      LABWEST_PATH: labWest.labWestPath,
      LABWEST_PRESENT: labWest.labWestPresent,
      LABWEST_COLLAPSED_WITH_WEST_DIAGNOSTIC: false,
      LABWEST_SEPARATED_FROM_WEST_DIAGNOSTIC: true,

      NEXT_FILE: recommendation.nextFile,
      NEXT_ACTION: recommendation.nextAction,
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,SHOWROOM_HTML,DIAGNOSTIC_HTML",
      UPDATED_AT: nowIso()
    };

    Object.keys(NO_TOUCH).forEach(function copyNoTouch(key) {
      packet[key] = NO_TOUCH[key];
    });

    return packet;
  }

  function packetValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (Array.isArray(value)) return value.map(packetValue).join(" | ");
    if (isObject(value)) {
      try {
        return compact(JSON.stringify(value), 20000);
      } catch (_error) {
        return compact(value);
      }
    }
    return compact(value);
  }

  function toPacketText(packet) {
    var priority = [
      "PACKET",
      "RECEIPT_LEVEL",
      "ROLE",
      "COMPONENT",
      "NEWS_ROLE",
      "NEWS_DUTY",
      "CONTRACT",
      "RECEIPT",
      "IMPLEMENTATION_CONTRACT",
      "IMPLEMENTATION_RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_IMPLEMENTATION_CONTRACT",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "WEST_DIAGNOSTIC_AUTHORITY_PATH",
      "WEST_DIAGNOSTIC_PRESENT",
      "WEST_DIAGNOSTIC_STATUS",
      "WEST_DIAGNOSTIC_RUN_EXECUTED",
      "WEST_DIAGNOSTIC_DIRECT_METHOD",
      "WEST_DIAGNOSTIC_DIRECT_ERROR",
      "WEST_DIAGNOSTIC_CONTRACT",
      "WEST_DIAGNOSTIC_IMPLEMENTATION_CONTRACT",
      "WEST_DIAGNOSTIC_INTERNAL_RENEWAL_CONTRACT",
      "WEST_DIAGNOSTIC_RENDERED_READ_STATUS",
      "WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY",
      "WEST_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_STATUS",
      "WEST_DIAGNOSTIC_RECOMMENDED_NEXT_FILE",
      "WEST_DIAGNOSTIC_RECOMMENDED_NEXT_ACTION",
      "LABWEST_GATE_IS_SEPARATE_RECEIPT",
      "WEST_DIAGNOSTIC_IS_SEPARATE_RECEIPT",
      "LABWEST_COLLAPSED_WITH_WEST_DIAGNOSTIC",
      "NEXT_FILE",
      "NEXT_ACTION",
      "DO_NOT_TOUCH",
      "UPDATED_AT"
    ];

    var seen = {};
    var keys = priority.concat(Object.keys(packet || {})).filter(function unique(key) {
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    return keys.map(function makeLine(key) {
      return key + "=" + packetValue(packet[key]);
    }).join("\n");
  }

  function getStatus() {
    var packet = createPacket("GET_STATUS");
    return {
      status: packet.WEST_DIAGNOSTIC_STATUS,
      runState: packet.RUN_STATE,
      trustState: packet.TRUST_STATE,
      blocking: packet.BLOCKING,
      renderedReadStatus: packet.WEST_DIAGNOSTIC_RENDERED_READ_STATUS,
      targetAccessStatus: packet.WEST_DIAGNOSTIC_TARGET_ACCESS_STATUS,
      visiblePlanetProofReady: packet.WEST_DIAGNOSTIC_VISIBLE_PLANET_PROOF_READY,
      canvasSurfaceTruthStatus: packet.WEST_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_STATUS,
      nextFile: packet.NEXT_FILE,
      nextAction: packet.NEXT_ACTION,
      updatedAt: packet.UPDATED_AT
    };
  }

  function getState() {
    return createPacket("GET_STATE");
  }

  function getReceiptLight() {
    return {
      role: ROLE,
      component: COMPONENT,
      newsRole: NEWS_ROLE,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      internalRenewalContract: IMPLEMENTATION_CONTRACT,
      internalRenewalReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      authorityPath: "HEARTH.diagnosticWest",
      directMethodSurfaceActive: true,
      callableMethods: [
        "runDiagnostic",
        "run",
        "inspect",
        "getReport",
        "getReceipt",
        "getReceiptLight",
        "getStatus",
        "getState"
      ],
      updatedAt: nowIso(),
      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,
      PUBLIC_SUPERIORITY_CLAIM: false
    };
  }

  function getReceipt() {
    return createPacket("GET_RECEIPT");
  }

  function getReport(options) {
    var packet = createPacket(options && options.mode ? options.mode : "GET_REPORT");
    return packet;
  }

  function inspect() {
    return createPacket("INSPECT");
  }

  function runDiagnostic() {
    return createPacket("RUN_DIAGNOSTIC");
  }

  function run() {
    return runDiagnostic();
  }

  var api = {
    CONTRACT: PUBLIC_CONTRACT,
    RECEIPT: PUBLIC_RECEIPT,
    IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
    IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
    INTERNAL_RENEWAL_CONTRACT: IMPLEMENTATION_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: IMPLEMENTATION_RECEIPT,
    PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,
    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
    ROLE: ROLE,
    COMPONENT: COMPONENT,
    NEWS_ROLE: NEWS_ROLE,
    NEWS_DUTY: NEWS_DUTY,

    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    internalRenewalContract: IMPLEMENTATION_CONTRACT,
    internalRenewalReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,

    runDiagnostic: runDiagnostic,
    run: run,
    inspect: inspect,
    getReport: getReport,
    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    getStatus: getStatus,
    getState: getState,
    getPacket: getReceipt,
    getPacketText: function getPacketText() {
      return toPacketText(createPacket("GET_PACKET_TEXT"));
    },
    toPacketText: toPacketText,

    inspectTargetAccess: inspectTargetAccess,
    inspectRenderedTarget: inspectRenderedTarget,
    inspectSurfaceTruth: inspectSurfaceTruth,
    inspectCanvasBoundary: inspectCanvasBoundary,
    inspectLabWestSeparation: inspectLabWestSeparation,

    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CONTROLS_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    F55_CLAIMED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PUBLIC_SUPERIORITY_CLAIM: false
  };

  function publishAliases() {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");

    var paths = [
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "HEARTH.diagnosticWestRenderedTargetProbe",
      "HEARTH.diagnosticWestRuntimeEndpointFamilyReader",
      "HEARTH.WEST_DIAGNOSTIC",
      "HEARTH.WEST_DIAGNOSTIC_DIRECT",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST",
      "HEARTH_DIAGNOSTIC_WEST_RENDERED_TARGET_AUTHORITY_PROBE",
      "HEARTH_DIAGNOSTIC_WEST_RUNTIME_ENDPOINT_FAMILY_READER",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest",
      "DEXTER_LAB.hearthDiagnosticWestRenderedTargetProbe"
    ];

    paths.forEach(function publish(path) {
      setPath(path, api);
    });

    root.__HEARTH_DIAGNOSTIC_WEST_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_WEST_CONTRACT__ = PUBLIC_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_IMPLEMENTATION_CONTRACT__ = IMPLEMENTATION_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_INTERNAL_RENEWAL_CONTRACT__ = IMPLEMENTATION_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_WEST_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_WEST_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_WEST_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  api.publishAliases = publishAliases;

  publishAliases();
})(typeof window !== "undefined" ? window : globalThis);
