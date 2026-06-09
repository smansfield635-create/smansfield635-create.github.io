// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_BISHOP_BRIDGE_READER_TNT_v4_2
// Full-file replacement.
// SURFACE_TRUTH / Chapel context / Canvas Bishop / Bridge reader only.
// No production mutation. No canvas repair. No build. No release.

(function hearthSurfaceTruthChapelContextBishopBridgeReader(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_BISHOP_BRIDGE_READER_TNT_v4_2";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_BISHOP_BRIDGE_READER_RECEIPT_v4_2";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_RENEWAL_TNT_v4_1";
  var PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_RENEWAL_RECEIPT_v4_1";

  var VERSION =
    "2026-06-09.hearth-diagnostic-probe-canvas-surface-truth-chapel-context-bishop-bridge-reader-v4-2";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var CANVAS_BISHOP_FILE = "/assets/hearth/hearth.canvas.js";
  var HAND_GEOMETRY_FILE = "/assets/hearth/hearth.canvas.hand.geometry.js";
  var HAND_CONTEXT_FILE = "/assets/hearth/hearth.canvas.hand.context.js";
  var HAND_PAINT_FILE = "/assets/hearth/hearth.canvas.hand.paint.js";
  var HAND_VIEW_FILE = "/assets/hearth/hearth.canvas.hand.view.js";
  var HAND_INSPECT_FILE = "/assets/hearth/hearth.canvas.hand.inspect.js";

  var HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  var HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  var FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  var FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  var FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  var FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  var AUTHORITY_PATH = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH";
  var ROLE = "SURFACE_TRUTH";
  var COMPONENT = "SURFACE_TRUTH";

  var NO_TOUCH = {
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    controlsMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasBuildAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    f13Claimed: false,
    f21Claimed: false,
    f55Claimed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    publicSuperiorityClaim: false,
    PRODUCTION_MUTATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  };

  var MOUNT_SELECTORS = [
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount='true']",
    "[data-hearth-showroom-surface='true']",
    "[data-hearth-visible-surface='true']",
    "[data-hearth-dom-surface='true']",
    "[data-hearth-canvas-stage='true']",
    ".hearth-canvas-mount",
    ".hearth-canvas-stage",
    ".canvas-mount"
  ];

  var CANVAS_SELECTORS = [
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-planet='hearth']",
    "#hearthCanvas",
    "#hearth-canvas",
    "canvas"
  ];

  var ALIAS_PATHS = [
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH.canvasSurfaceTruthProbe",
    "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "DEXTER_LAB.canvasSurfaceTruthProbe",
    "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
  ];

  var CANVAS_BISHOP_ALIASES = [
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_BISHOP",
    "HEARTH_CANVAS_CHAPEL_ONE_BISHOP",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasBishop",
    "HEARTH.chapelOneBishop",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasBishop",
    "DEXTER_LAB.hearthChapelOneBishop"
  ];

  var HAND_ALIASES = {
    geometry: [
      "HEARTH.canvasHandGeometry",
      "HEARTH_CANVAS_HAND_GEOMETRY",
      "DEXTER_LAB.hearthCanvasHandGeometry"
    ],
    context: [
      "HEARTH.canvasHandContext",
      "HEARTH_CANVAS_HAND_CONTEXT",
      "DEXTER_LAB.hearthCanvasHandContext"
    ],
    paint: [
      "HEARTH.canvasHandPaint",
      "HEARTH_CANVAS_HAND_PAINT",
      "DEXTER_LAB.hearthCanvasHandPaint"
    ],
    view: [
      "HEARTH.canvasHandView",
      "HEARTH_CANVAS_HAND_VIEW",
      "DEXTER_LAB.hearthCanvasHandView"
    ],
    inspect: [
      "HEARTH.canvasHandInspect",
      "HEARTH_CANVAS_HAND_INSPECT",
      "DEXTER_LAB.hearthCanvasHandInspect"
    ]
  };

  var HEX_AUTHORITY_ALIASES = [
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexAuthority",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ];

  var HEX_SURFACE_ALIASES = [
    "HEARTH.hexSurface",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "DEXTER_LAB.hearthHexSurface"
  ];

  var FINGER_ALIASES = {
    surface: [
      "HEARTH.canvasFingerSurface",
      "HEARTH.pointerFingerSurface",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_POINTER_FINGER_SURFACE",
      "DEXTER_LAB.hearthCanvasFingerSurface"
    ],
    boundary: [
      "HEARTH.canvasFingerBoundary",
      "HEARTH.pointerFingerBoundary",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "HEARTH_POINTER_FINGER_BOUNDARY",
      "DEXTER_LAB.hearthCanvasFingerBoundary"
    ],
    inspect: [
      "HEARTH.canvasFingerInspect",
      "HEARTH.pointerFingerInspect",
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH_POINTER_FINGER_INSPECT",
      "DEXTER_LAB.hearthCanvasFingerInspect"
    ],
    light: [
      "HEARTH.canvasFingerLight",
      "HEARTH.pointerFingerLight",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "HEARTH_POINTER_FINGER_LIGHT",
      "DEXTER_LAB.hearthCanvasFingerLight"
    ]
  };

  var DIRECT_METHOD_NAMES = [
    "run",
    "runDiagnostic",
    "inspect",
    "inspectSurfaceTruth",
    "runSurfaceTruth",
    "runSurfaceTruthDirectCheck",
    "runSurfaceTruthProbe",
    "runCanvasSurfaceTruthProbe",
    "runProductionSurfaceLensAlignment",
    "runTargetFrameDocumentScopeRenewal",
    "runDirect",
    "execute",
    "diagnose",
    "measure",
    "measureSurfaceTruth",
    "read",
    "readSurfaceTruth",
    "getReport",
    "getReceipt",
    "getReceiptLight",
    "getStatus",
    "getState",
    "getPacket",
    "getPacketText",
    "getSummary",
    "toPacketText",
    "collectDocumentScopes",
    "readChapelContext",
    "readCanvasBishop",
    "readChapelOneHands",
    "readHexBridge",
    "readChapelTwoFingers"
  ];

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try { return String(value); } catch (_error) { return fallback; }
  }

  function asBool(value) {
    return value === true || value === "true" || value === "TRUE" || value === 1 || value === "1";
  }

  function compact(value, limit) {
    if (limit === undefined) limit = 6000;
    return asString(value).replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) {
        var out = {};
        Object.keys(value).forEach(function copy(key) { out[key] = value[key]; });
        return out;
      }
      return value;
    }
  }

  function ensureNamespace(path) {
    if (!root[path] || typeof root[path] !== "object") root[path] = {};
    return root[path];
  }

  function readPath(path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;
    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
      cursor = cursor[parts[i]];
    }
    return cursor || null;
  }

  function setPath(path, value) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;
    var cursor = root;
    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value && (isObject(value) || isFunction(value))) {
        return { found: true, path: paths[i], value: value };
      }
    }
    return { found: false, path: "NONE", value: null };
  }

  function getExistingAuthorityObject() {
    for (var i = 0; i < ALIAS_PATHS.length; i += 1) {
      var found = readPath(ALIAS_PATHS[i]);
      if (isObject(found)) return found;
    }
    return {};
  }

  function queryFirst(context, selectors) {
    if (!context || !isFunction(context.querySelector)) return null;
    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = context.querySelector(selectors[i]);
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

  function elementDescriptor(element) {
    if (!element) return "NONE";
    var tag = "unknown";
    var id = "";
    var cls = "";
    try { tag = (element.tagName || "unknown").toLowerCase(); } catch (_error) {}
    try { id = element.id ? "#" + element.id : ""; } catch (_error) {}
    try {
      cls = typeof element.className === "string" && element.className
        ? "." + element.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error) {}
    return compact(tag + id + cls, 400);
  }

  function documentPath(targetDoc) {
    try { return targetDoc.location && targetDoc.location.pathname ? targetDoc.location.pathname : "UNKNOWN"; }
    catch (_error) { return "UNREADABLE"; }
  }

  function documentHref(targetDoc) {
    try { return targetDoc.location && targetDoc.location.href ? targetDoc.location.href : "UNKNOWN"; }
    catch (_error) { return "UNREADABLE"; }
  }

  function documentTitle(targetDoc) {
    try { return targetDoc.title || "UNKNOWN"; } catch (_error) { return "UNREADABLE"; }
  }

  function safeWindowDocument(win) {
    try { return win && win.document ? win.document : null; } catch (_error) { return null; }
  }

  function frameDocument(frame) {
    try { if (frame && frame.contentDocument) return frame.contentDocument; } catch (_error) {}
    try { if (frame && frame.contentWindow && frame.contentWindow.document) return frame.contentWindow.document; } catch (_error) {}
    return null;
  }

  function addScope(scopes, seen, label, targetDoc, sourceKind) {
    if (!targetDoc) return;
    for (var i = 0; i < seen.length; i += 1) if (seen[i] === targetDoc) return;
    seen.push(targetDoc);
    scopes.push({
      label: label,
      sourceKind: sourceKind || "DOCUMENT",
      doc: targetDoc,
      path: documentPath(targetDoc),
      href: documentHref(targetDoc),
      title: documentTitle(targetDoc)
    });
  }

  function addFrameScopes(scopes, seen, baseLabel, targetDoc) {
    if (!targetDoc || !isFunction(targetDoc.querySelectorAll)) return;
    var frames = [];
    try { frames = Array.prototype.slice.call(targetDoc.querySelectorAll("iframe")); } catch (_error) { frames = []; }
    frames.forEach(function eachFrame(frame, index) {
      addScope(scopes, seen, baseLabel + ".iframe[" + index + "]", frameDocument(frame), "IFRAME_DOCUMENT");
    });
  }

  function collectDocumentScopes() {
    var scopes = [];
    var seen = [];

    addScope(scopes, seen, "current.document", doc, "CURRENT_DOCUMENT");
    addFrameScopes(scopes, seen, "current.document", doc);

    try {
      if (root.parent && root.parent !== root) {
        var parentDoc = safeWindowDocument(root.parent);
        addScope(scopes, seen, "parent.document", parentDoc, "PARENT_DOCUMENT");
        addFrameScopes(scopes, seen, "parent.document", parentDoc);
      }
    } catch (_error) {}

    try {
      if (root.top && root.top !== root) {
        var topDoc = safeWindowDocument(root.top);
        addScope(scopes, seen, "top.document", topDoc, "TOP_DOCUMENT");
        addFrameScopes(scopes, seen, "top.document", topDoc);
      }
    } catch (_error) {}

    return scopes;
  }

  function inspectScope(scope) {
    var targetDoc = scope.doc;
    var mount = queryFirst(targetDoc, MOUNT_SELECTORS);
    var mountRect = rectOf(mount);
    var canvas = mount ? queryFirst(mount, CANVAS_SELECTORS) : null;
    if (!canvas) canvas = queryFirst(targetDoc, CANVAS_SELECTORS);

    var canvasRect = rectOf(canvas);
    var routeMatch =
      scope.path === TARGET_ROUTE ||
      scope.path === TARGET_ROUTE.replace(/\/$/, "") ||
      scope.href.indexOf(TARGET_ROUTE) !== -1;
    var diagnosticMatch =
      scope.path.indexOf("/diagnostic") !== -1 ||
      scope.href.indexOf(DIAGNOSTIC_ROUTE) !== -1;
    var titleMatch = /hearth/i.test(scope.title || "");

    var score = 0;
    if (routeMatch && !diagnosticMatch) score += 80;
    if (titleMatch) score += 20;
    if (mount) score += 45;
    if (canvas) score += 25;
    if (mountRect.width > 0 && mountRect.height > 0) score += 20;
    if (canvasRect.width > 0 && canvasRect.height > 0) score += 15;
    if (diagnosticMatch && !mount) score -= 10;

    return {
      label: scope.label,
      sourceKind: scope.sourceKind,
      path: scope.path,
      href: scope.href,
      title: scope.title,
      routeMatch: routeMatch,
      diagnosticMatch: diagnosticMatch,
      titleMatch: titleMatch,
      score: score,
      canonicalMountFound: Boolean(mount),
      canonicalMountDescriptor: elementDescriptor(mount),
      canonicalMountRect: mountRect,
      canonicalMountRectNonZero: Boolean(mountRect.width > 0 && mountRect.height > 0),
      canonicalCanvasFound: Boolean(canvas),
      canonicalCanvasDescriptor: elementDescriptor(canvas),
      canonicalCanvasRect: canvasRect,
      canonicalCanvasRectNonZero: Boolean(canvasRect.width > 0 && canvasRect.height > 0)
    };
  }

  function bestInspection(inspections) {
    if (!inspections.length) return null;
    return inspections.slice().sort(function byScore(a, b) { return b.score - a.score; })[0];
  }

  function classifySurface(best) {
    if (!best) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "TARGET_DOCUMENT_SCOPE_UNREADABLE",
        firstFailedCoordinate: "TARGET_DOCUMENT_SCOPE_READABLE",
        acceptedAsEvidence: false
      };
    }

    if (!best.canonicalMountFound) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_MOUNT_MISSING",
        firstFailedCoordinate: "CANONICAL_MOUNT_EXISTS",
        acceptedAsEvidence: false
      };
    }

    if (!best.canonicalMountRectNonZero) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_MOUNT_RECT_ZERO",
        firstFailedCoordinate: "CANONICAL_MOUNT_RECT_NONZERO",
        acceptedAsEvidence: false
      };
    }

    if (!best.canonicalCanvasFound) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_CANVAS_MISSING",
        firstFailedCoordinate: "CANONICAL_CANVAS_EXISTS",
        acceptedAsEvidence: false
      };
    }

    if (!best.canonicalCanvasRectNonZero) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_CANVAS_RECT_ZERO",
        firstFailedCoordinate: "CANONICAL_CANVAS_RECT_NONZERO",
        acceptedAsEvidence: false
      };
    }

    return {
      status: "SURFACE_CONTRACT_MEASUREMENT_PASSED",
      failureClass: "NONE",
      firstFailedCoordinate: "NONE",
      acceptedAsEvidence: true
    };
  }

  function inspectSurfaceTruthCore() {
    var scopes = collectDocumentScopes();
    var inspections = scopes.map(inspectScope);
    var best = bestInspection(inspections);
    var result = classifySurface(best);

    return {
      scopes: inspections,
      selectedScope: best,
      classification: result,
      targetFrameDocumentScopeStatus: best ? "TARGET_DOCUMENT_SCOPE_RESOLVED" : "TARGET_DOCUMENT_SCOPE_NOT_RESOLVED",
      targetAccessStatus: best && best.routeMatch
        ? "TARGET_HEARTH_ROUTE_DOCUMENT_READABLE"
        : best
          ? "TARGET_DOCUMENT_READABLE_ROUTE_MATCH_UNCONFIRMED"
          : "TARGET_DOCUMENT_NOT_READABLE"
    };
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};
    var methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport"];
    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];
      if (!isFunction(authority[method])) continue;
      try {
        var out = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(out)) return out;
      } catch (_error) {}
    }
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt) return authority;
    return {};
  }

  function readDataset(key) {
    try {
      return doc && doc.documentElement && doc.documentElement.dataset
        ? doc.documentElement.dataset[key]
        : "";
    } catch (_error) {
      return "";
    }
  }

  function readAuthority(paths, expectedFile) {
    var found = firstGlobal(paths);
    var receipt = readReceipt(found.value);

    return {
      found: found.found,
      aliasPath: found.path,
      file: expectedFile,
      contract: asString(receipt.contract || receipt.CONTRACT || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: asString(receipt.receipt || receipt.RECEIPT || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: asString(
        receipt.componentStatus ||
        receipt.postgameStatus ||
        receipt.status ||
        (found.found ? "OBSERVED" : "NOT_OBSERVED")
      ),
      firstFailedCoordinate: asString(receipt.firstFailedCoordinate || "UNKNOWN"),
      recommendedNextFile: asString(receipt.recommendedNextFile || expectedFile),
      recommendedNextAction: asString(receipt.recommendedNextAction || "UNKNOWN"),
      rawReceipt: receipt
    };
  }

  function readCanvasBishop() {
    var authority = readAuthority(CANVAS_BISHOP_ALIASES, CANVAS_BISHOP_FILE);
    var raw = authority.rawReceipt || {};

    var datasetContract = readDataset("hearthCanvasContract");
    var datasetStatus = readDataset("hearthCanvasComponentStatus");
    var datasetFailed = readDataset("hearthCanvasFirstFailedCoordinate");
    var datasetNextFile = readDataset("hearthCanvasRecommendedNextFile");
    var datasetNextAction = readDataset("hearthCanvasRecommendedNextAction");

    return {
      present: authority.found || Boolean(datasetContract),
      aliasPath: authority.aliasPath,
      file: CANVAS_BISHOP_FILE,
      contract: datasetContract || authority.contract,
      receipt: authority.receipt,
      chapelOneBishop: asBool(raw.chapelOneBishop) || readDataset("hearthChapelOneBishop") === "true",
      chapelOneCongregation: asString(raw.chapelOneCongregation || readDataset("hearthChapelOneCongregation") || "UNKNOWN"),
      componentStatus: datasetStatus || authority.componentStatus,
      firstFailedCoordinate: datasetFailed || authority.firstFailedCoordinate,
      recommendedNextFile: datasetNextFile || authority.recommendedNextFile,
      recommendedNextAction: datasetNextAction || authority.recommendedNextAction,
      handGeometryObserved: asBool(raw.handGeometryObserved) || readDataset("hearthCanvasHandGeometryObserved") === "true",
      handContextObserved: asBool(raw.handContextObserved) || readDataset("hearthCanvasHandContextObserved") === "true",
      handPaintObserved: asBool(raw.handPaintObserved) || readDataset("hearthCanvasHandPaintObserved") === "true",
      handViewObserved: asBool(raw.handViewObserved) || readDataset("hearthCanvasHandViewObserved") === "true",
      handInspectObserved: asBool(raw.handInspectObserved) || readDataset("hearthCanvasHandInspectObserved") === "true",
      hexAuthorityBridgeObserved: asBool(raw.hexAuthorityBridgeObserved) || readDataset("hearthCanvasHexAuthorityBridgeObserved") === "true",
      hexSurfaceBridgeObserved: asBool(raw.hexSurfaceBridgeObserved) || readDataset("hearthCanvasHexSurfaceBridgeObserved") === "true"
    };
  }

  function readChapelOneHands() {
    return {
      congregation: "hands",
      geometry: readAuthority(HAND_ALIASES.geometry, HAND_GEOMETRY_FILE),
      context: readAuthority(HAND_ALIASES.context, HAND_CONTEXT_FILE),
      paint: readAuthority(HAND_ALIASES.paint, HAND_PAINT_FILE),
      view: readAuthority(HAND_ALIASES.view, HAND_VIEW_FILE),
      inspect: readAuthority(HAND_ALIASES.inspect, HAND_INSPECT_FILE)
    };
  }

  function readHexBridge() {
    return {
      congressionalBridge: readAuthority(HEX_AUTHORITY_ALIASES, HEX_AUTHORITY_FILE),
      surfaceBridgeGate: readAuthority(HEX_SURFACE_ALIASES, HEX_SURFACE_FILE)
    };
  }

  function readChapelTwoFingers() {
    return {
      congregation: "fingers",
      surface: readAuthority(FINGER_ALIASES.surface, FINGER_SURFACE_FILE),
      boundary: readAuthority(FINGER_ALIASES.boundary, FINGER_BOUNDARY_FILE),
      inspect: readAuthority(FINGER_ALIASES.inspect, FINGER_INSPECT_FILE),
      light: readAuthority(FINGER_ALIASES.light, FINGER_LIGHT_FILE)
    };
  }

  function readChapelContext() {
    var bishop = readCanvasBishop();
    var hands = readChapelOneHands();
    var bridge = readHexBridge();
    var fingers = readChapelTwoFingers();

    var handObservedCount = [
      bishop.handGeometryObserved || hands.geometry.found,
      bishop.handContextObserved || hands.context.found,
      bishop.handPaintObserved || hands.paint.found,
      bishop.handViewObserved || hands.view.found,
      bishop.handInspectObserved || hands.inspect.found
    ].filter(Boolean).length;

    var fingerObservedCount = [
      fingers.surface.found,
      fingers.boundary.found,
      fingers.inspect.found,
      fingers.light.found
    ].filter(Boolean).length;

    var status = "CHAPEL_CONTEXT_READY";
    var firstFailedCoordinate = "NONE";
    var recommendedNextFile = HEX_SURFACE_FILE;
    var recommendedNextAction = "RUN_CANVAS_BISHOP_TO_HEX_BRIDGE_MEASUREMENT";

    if (!bishop.present) {
      status = "HELD_CANVAS_BISHOP_NOT_OBSERVED";
      firstFailedCoordinate = "CANVAS_BISHOP_PRESENT";
      recommendedNextFile = CANVAS_BISHOP_FILE;
      recommendedNextAction = "LOAD_OR_RENEW_CANVAS_BISHOP_STANDARD";
    } else if (handObservedCount < 5) {
      status = "HELD_CHAPEL_ONE_HAND_CONGREGATION_INCOMPLETE";
      firstFailedCoordinate = "CHAPEL_ONE_HAND_CONGREGATION_COMPLETE";
      recommendedNextFile = bishop.recommendedNextFile || HAND_GEOMETRY_FILE;
      recommendedNextAction = bishop.recommendedNextAction || "CRAFT_NEXT_CHAPEL_ONE_HAND_FILE";
    } else if (!bridge.congressionalBridge.found && !bishop.hexAuthorityBridgeObserved) {
      status = "HELD_HEX_AUTHORITY_CONGRESSIONAL_BRIDGE_NOT_OBSERVED";
      firstFailedCoordinate = "HEX_AUTHORITY_BRIDGE_PRESENT";
      recommendedNextFile = HEX_AUTHORITY_FILE;
      recommendedNextAction = "LOAD_OR_RENEW_HEX_AUTHORITY_CONGRESSIONAL_BRIDGE";
    } else if (!bridge.surfaceBridgeGate.found && !bishop.hexSurfaceBridgeObserved) {
      status = "HELD_HEX_SURFACE_BRIDGE_GATE_NOT_OBSERVED";
      firstFailedCoordinate = "HEX_SURFACE_BRIDGE_GATE_PRESENT";
      recommendedNextFile = HEX_SURFACE_FILE;
      recommendedNextAction = "LOAD_OR_RENEW_HEX_SURFACE_BRIDGE_GATE";
    } else if (fingerObservedCount === 0) {
      status = "CHAPEL_ONE_READY_CHAPEL_TWO_FINGERS_NOT_OBSERVED";
      firstFailedCoordinate = "CHAPEL_TWO_FINGER_CONGREGATION_PRESENT";
      recommendedNextFile = FINGER_SURFACE_FILE;
      recommendedNextAction = "MEASURE_OR_BUILD_CHAPEL_TWO_FINGER_CONGREGATION_AFTER_BRIDGE";
    }

    return {
      status: status,
      firstFailedCoordinate: firstFailedCoordinate,
      recommendedNextFile: recommendedNextFile,
      recommendedNextAction: recommendedNextAction,
      canvasBishop: bishop,
      chapelOneHands: hands,
      hexBridge: bridge,
      chapelTwoFingers: fingers,
      handObservedCount: handObservedCount,
      fingerObservedCount: fingerObservedCount
    };
  }

  function makePacket(mode) {
    var inspected = inspectSurfaceTruthCore();
    var best = inspected.selectedScope || {};
    var result = inspected.classification;
    var passed = result.status === "SURFACE_CONTRACT_MEASUREMENT_PASSED";
    var chapel = readChapelContext();

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_BISHOP_BRIDGE_READER_PACKET_v4_2",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_BISHOP_BRIDGE_READER_PACKET_v4_2",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      MODE: mode || "RUN_DIAGNOSTIC",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      UPDATED_AT: nowIso(),

      DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE: true,
      DIRECT_METHOD_PUBLICATION_STATUS: "DIRECT_METHODS_PUBLISHED_ON_EXACT_AUTHORITY_PATH",
      DIRECT_AUTHORITY_PATH: AUTHORITY_PATH,
      DIRECT_METHODS_PUBLISHED: DIRECT_METHOD_NAMES.join(","),

      CHAPEL_CONTEXT_READER_ACTIVE: true,
      CHAPEL_CONTEXT_STATUS: chapel.status,
      CHAPEL_CONTEXT_FIRST_FAILED_COORDINATE: chapel.firstFailedCoordinate,
      CHAPEL_CONTEXT_RECOMMENDED_NEXT_FILE: chapel.recommendedNextFile,
      CHAPEL_CONTEXT_RECOMMENDED_NEXT_ACTION: chapel.recommendedNextAction,

      CANVAS_BISHOP_PRESENT: chapel.canvasBishop.present,
      CANVAS_BISHOP_ALIAS_PATH: chapel.canvasBishop.aliasPath,
      CANVAS_BISHOP_FILE: CANVAS_BISHOP_FILE,
      CANVAS_BISHOP_CONTRACT: chapel.canvasBishop.contract,
      CANVAS_BISHOP_RECEIPT: chapel.canvasBishop.receipt,
      CANVAS_BISHOP_COMPONENT_STATUS: chapel.canvasBishop.componentStatus,
      CANVAS_BISHOP_FIRST_FAILED_COORDINATE: chapel.canvasBishop.firstFailedCoordinate,
      CANVAS_BISHOP_RECOMMENDED_NEXT_FILE: chapel.canvasBishop.recommendedNextFile,
      CANVAS_BISHOP_RECOMMENDED_NEXT_ACTION: chapel.canvasBishop.recommendedNextAction,

      CHAPEL_ONE_BISHOP: chapel.canvasBishop.chapelOneBishop,
      CHAPEL_ONE_CONGREGATION: "hands",
      HAND_GEOMETRY_OBSERVED: chapel.canvasBishop.handGeometryObserved || chapel.chapelOneHands.geometry.found,
      HAND_CONTEXT_OBSERVED: chapel.canvasBishop.handContextObserved || chapel.chapelOneHands.context.found,
      HAND_PAINT_OBSERVED: chapel.canvasBishop.handPaintObserved || chapel.chapelOneHands.paint.found,
      HAND_VIEW_OBSERVED: chapel.canvasBishop.handViewObserved || chapel.chapelOneHands.view.found,
      HAND_INSPECT_OBSERVED: chapel.canvasBishop.handInspectObserved || chapel.chapelOneHands.inspect.found,
      HAND_OBSERVED_COUNT: chapel.handObservedCount,

      HEX_AUTHORITY_BRIDGE_OBSERVED:
        chapel.canvasBishop.hexAuthorityBridgeObserved || chapel.hexBridge.congressionalBridge.found,
      HEX_AUTHORITY_BRIDGE_FILE: HEX_AUTHORITY_FILE,
      HEX_AUTHORITY_BRIDGE_CONTRACT: chapel.hexBridge.congressionalBridge.contract,

      HEX_SURFACE_BRIDGE_OBSERVED:
        chapel.canvasBishop.hexSurfaceBridgeObserved || chapel.hexBridge.surfaceBridgeGate.found,
      HEX_SURFACE_BRIDGE_FILE: HEX_SURFACE_FILE,
      HEX_SURFACE_BRIDGE_CONTRACT: chapel.hexBridge.surfaceBridgeGate.contract,

      CHAPEL_TWO_CONGREGATION: "fingers",
      FINGER_SURFACE_OBSERVED: chapel.chapelTwoFingers.surface.found,
      FINGER_BOUNDARY_OBSERVED: chapel.chapelTwoFingers.boundary.found,
      FINGER_INSPECT_OBSERVED: chapel.chapelTwoFingers.inspect.found,
      FINGER_LIGHT_OBSERVED: chapel.chapelTwoFingers.light.found,
      FINGER_OBSERVED_COUNT: chapel.fingerObservedCount,

      RUN_STATE: "SURFACE_TRUTH_CHAPEL_CONTEXT_DIRECT_RUN_COMPLETE",
      TRUST_STATE: passed
        ? "SURFACE_TRUTH_MEASUREMENT_ACCEPTED"
        : "SURFACE_TRUTH_MEASUREMENT_RETURNED_WITH_HOLD",
      BLOCKING: false,

      TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_ACTIVE: true,
      TARGET_FRAME_DOCUMENT_SCOPE_STATUS: inspected.targetFrameDocumentScopeStatus,
      TARGET_ACCESS_STATUS: inspected.targetAccessStatus,

      SURFACE_TRUTH_INSPECTED: true,
      SURFACE_TRUTH_STATUS: result.status,
      SURFACE_TRUTH_FAILURE_CLASS: result.failureClass,
      SURFACE_TRUTH_FIRST_FAILED_COORDINATE: result.firstFailedCoordinate,
      PRODUCTION_CANVAS_SURFACE_LENS_ACCEPTED_AS_EVIDENCE: result.acceptedAsEvidence,

      SELECTED_DOCUMENT_SCOPE: best.label || "NONE",
      SELECTED_DOCUMENT_KIND: best.sourceKind || "NONE",
      SELECTED_DOCUMENT_PATH: best.path || "UNKNOWN",
      SELECTED_DOCUMENT_TITLE: best.title || "UNKNOWN",
      SELECTED_DOCUMENT_ROUTE_MATCH: Boolean(best.routeMatch),
      SELECTED_DOCUMENT_DIAGNOSTIC_MATCH: Boolean(best.diagnosticMatch),

      CANONICAL_MOUNT_EXISTS: Boolean(best.canonicalMountFound),
      CANONICAL_MOUNT_DESCRIPTOR: best.canonicalMountDescriptor || "NONE",
      CANONICAL_MOUNT_RECT: best.canonicalMountRect || rectOf(null),
      CANONICAL_MOUNT_RECT_NONZERO: Boolean(best.canonicalMountRectNonZero),

      CANONICAL_CANVAS_EXISTS: Boolean(best.canonicalCanvasFound),
      CANONICAL_CANVAS_DESCRIPTOR: best.canonicalCanvasDescriptor || "NONE",
      CANONICAL_CANVAS_RECT: best.canonicalCanvasRect || rectOf(null),
      CANONICAL_CANVAS_RECT_NONZERO: Boolean(best.canonicalCanvasRectNonZero),

      DOCUMENT_SCOPE_SCAN_COUNT: inspected.scopes.length,
      DOCUMENT_SCOPE_SCAN: inspected.scopes.map(function scopeLine(scope) {
        return {
          label: scope.label,
          sourceKind: scope.sourceKind,
          path: scope.path,
          title: scope.title,
          routeMatch: scope.routeMatch,
          diagnosticMatch: scope.diagnosticMatch,
          canonicalMountFound: scope.canonicalMountFound,
          canonicalMountRectNonZero: scope.canonicalMountRectNonZero,
          canonicalCanvasFound: scope.canonicalCanvasFound,
          canonicalCanvasRectNonZero: scope.canonicalCanvasRectNonZero,
          score: scope.score
        };
      }),

      CHAPEL_CONTEXT_OBJECT: chapel,
      CANVAS_BISHOP_OBJECT: chapel.canvasBishop,
      CHAPEL_ONE_HANDS_OBJECT: chapel.chapelOneHands,
      HEX_BRIDGE_OBJECT: chapel.hexBridge,
      CHAPEL_TWO_FINGERS_OBJECT: chapel.chapelTwoFingers,

      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_SURFACE_TRUTH_AS_EVIDENCE: true,
      SURFACE_TRUTH_PROBE_RENEWAL_IS_CONTRACT_ALIGNMENT_NOT_CANVAS_REPAIR: true,
      CANVAS_PRODUCTION_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,

      RECOMMENDED_NEXT_FILE:
        chapel.status !== "CHAPEL_CONTEXT_READY"
          ? chapel.recommendedNextFile
          : passed
            ? "/assets/hearth/hearth.diagnostic.rail.js"
            : FILE,
      RECOMMENDED_NEXT_ACTION:
        chapel.status !== "CHAPEL_CONTEXT_READY"
          ? chapel.recommendedNextAction
          : passed
            ? "RUN_08_NORTH_CONSUMPTION_OF_SURFACE_TRUTH_AND_CHAPEL_CONTEXT"
            : "RERUN_SURFACE_TRUTH_AFTER_SELECTOR_SCOPE_REVIEW",
      NEXT_FILE_AUTHORIZATION_SCOPE: "DIAGNOSTIC_RENEWAL_ONLY",
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE"
    };

    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      packet[key] = NO_TOUCH[key];
    });

    return packet;
  }

  function packetValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (Array.isArray(value)) return value.map(packetValue).join(" | ");
    if (isObject(value)) {
      try { return compact(JSON.stringify(value), 24000); }
      catch (_error) { return "[object]"; }
    }
    return compact(value);
  }

  function toPacketText(packet) {
    var priority = [
      "PACKET",
      "PACKET_NAME",
      "RECEIPT_LEVEL",
      "ROLE",
      "COMPONENT",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "VERSION",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE",
      "DIRECT_METHOD_PUBLICATION_STATUS",
      "CHAPEL_CONTEXT_READER_ACTIVE",
      "CHAPEL_CONTEXT_STATUS",
      "CHAPEL_CONTEXT_FIRST_FAILED_COORDINATE",
      "CHAPEL_CONTEXT_RECOMMENDED_NEXT_FILE",
      "CHAPEL_CONTEXT_RECOMMENDED_NEXT_ACTION",
      "CANVAS_BISHOP_PRESENT",
      "CANVAS_BISHOP_CONTRACT",
      "CANVAS_BISHOP_COMPONENT_STATUS",
      "CANVAS_BISHOP_FIRST_FAILED_COORDINATE",
      "CANVAS_BISHOP_RECOMMENDED_NEXT_FILE",
      "CANVAS_BISHOP_RECOMMENDED_NEXT_ACTION",
      "CHAPEL_ONE_CONGREGATION",
      "HAND_GEOMETRY_OBSERVED",
      "HAND_CONTEXT_OBSERVED",
      "HAND_PAINT_OBSERVED",
      "HAND_VIEW_OBSERVED",
      "HAND_INSPECT_OBSERVED",
      "HEX_AUTHORITY_BRIDGE_OBSERVED",
      "HEX_SURFACE_BRIDGE_OBSERVED",
      "CHAPEL_TWO_CONGREGATION",
      "FINGER_SURFACE_OBSERVED",
      "FINGER_BOUNDARY_OBSERVED",
      "FINGER_INSPECT_OBSERVED",
      "FINGER_LIGHT_OBSERVED",
      "SURFACE_TRUTH_STATUS",
      "SURFACE_TRUTH_FAILURE_CLASS",
      "SURFACE_TRUTH_FIRST_FAILED_COORDINATE",
      "CANONICAL_MOUNT_EXISTS",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_CANVAS_EXISTS",
      "CANONICAL_CANVAS_RECT_NONZERO",
      "TARGET_FRAME_DOCUMENT_SCOPE_STATUS",
      "SELECTED_DOCUMENT_SCOPE",
      "SELECTED_DOCUMENT_PATH",
      "CANVAS_PRODUCTION_REPAIR_AUTHORIZED",
      "CANVAS_BUILD_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "DO_NOT_TOUCH",
      "UPDATED_AT"
    ];

    var seen = {};
    var keys = priority.concat(Object.keys(packet || {})).filter(function unique(key) {
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    return keys.map(function line(key) {
      return key + "=" + packetValue(packet[key]);
    }).join("\n");
  }

  function runDiagnostic() { return makePacket("RUN_DIAGNOSTIC"); }
  function run() { return runDiagnostic(); }
  function inspect() { return makePacket("INSPECT"); }
  function inspectSurfaceTruth() { return makePacket("INSPECT_SURFACE_TRUTH"); }
  function runSurfaceTruth() { return runDiagnostic(); }
  function runSurfaceTruthDirectCheck() { return runDiagnostic(); }
  function runSurfaceTruthProbe() { return runDiagnostic(); }
  function runCanvasSurfaceTruthProbe() { return runDiagnostic(); }
  function runProductionSurfaceLensAlignment() { return runDiagnostic(); }
  function runTargetFrameDocumentScopeRenewal() { return runDiagnostic(); }
  function runDirect() { return runDiagnostic(); }
  function execute() { return runDiagnostic(); }
  function diagnose() { return runDiagnostic(); }
  function measure() { return runDiagnostic(); }
  function measureSurfaceTruth() { return runDiagnostic(); }
  function read() { return runDiagnostic(); }
  function readSurfaceTruth() { return runDiagnostic(); }
  function getReport() { return makePacket("GET_REPORT"); }
  function getReceipt() { return makePacket("GET_RECEIPT"); }
  function getPacket() { return getReceipt(); }
  function getPacketText() { return toPacketText(makePacket("GET_PACKET_TEXT")); }

  function getReceiptLight() {
    var inspected = inspectSurfaceTruthCore();
    var best = inspected.selectedScope || {};
    var result = inspected.classification;
    var chapel = readChapelContext();

    return {
      role: ROLE,
      component: COMPONENT,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      directMethodPublicationRenewalActive: true,
      chapelContextReaderActive: true,

      surfaceTruthStatus: result.status,
      surfaceTruthFailureClass: result.failureClass,
      surfaceTruthFirstFailedCoordinate: result.firstFailedCoordinate,
      selectedDocumentScope: best.label || "NONE",
      selectedDocumentPath: best.path || "UNKNOWN",
      canonicalMountExists: Boolean(best.canonicalMountFound),
      canonicalMountRectNonZero: Boolean(best.canonicalMountRectNonZero),
      canonicalCanvasExists: Boolean(best.canonicalCanvasFound),
      canonicalCanvasRectNonZero: Boolean(best.canonicalCanvasRectNonZero),

      chapelContextStatus: chapel.status,
      chapelContextFirstFailedCoordinate: chapel.firstFailedCoordinate,
      chapelContextRecommendedNextFile: chapel.recommendedNextFile,
      chapelContextRecommendedNextAction: chapel.recommendedNextAction,

      canvasBishopPresent: chapel.canvasBishop.present,
      canvasBishopContract: chapel.canvasBishop.contract,
      canvasBishopComponentStatus: chapel.canvasBishop.componentStatus,
      canvasBishopFirstFailedCoordinate: chapel.canvasBishop.firstFailedCoordinate,
      canvasBishopRecommendedNextFile: chapel.canvasBishop.recommendedNextFile,
      canvasBishopRecommendedNextAction: chapel.canvasBishop.recommendedNextAction,

      chapelOneCongregation: "hands",
      handGeometryObserved: chapel.canvasBishop.handGeometryObserved || chapel.chapelOneHands.geometry.found,
      handContextObserved: chapel.canvasBishop.handContextObserved || chapel.chapelOneHands.context.found,
      handPaintObserved: chapel.canvasBishop.handPaintObserved || chapel.chapelOneHands.paint.found,
      handViewObserved: chapel.canvasBishop.handViewObserved || chapel.chapelOneHands.view.found,
      handInspectObserved: chapel.canvasBishop.handInspectObserved || chapel.chapelOneHands.inspect.found,

      hexAuthorityBridgeObserved:
        chapel.canvasBishop.hexAuthorityBridgeObserved || chapel.hexBridge.congressionalBridge.found,
      hexSurfaceBridgeObserved:
        chapel.canvasBishop.hexSurfaceBridgeObserved || chapel.hexBridge.surfaceBridgeGate.found,

      chapelTwoCongregation: "fingers",
      fingerSurfaceObserved: chapel.chapelTwoFingers.surface.found,
      fingerBoundaryObserved: chapel.chapelTwoFingers.boundary.found,
      fingerInspectObserved: chapel.chapelTwoFingers.inspect.found,
      fingerLightObserved: chapel.chapelTwoFingers.light.found,

      productionMutationAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      runtimeRestartAuthorized: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getStatus() {
    var packet = makePacket("GET_STATUS");
    return {
      runState: packet.RUN_STATE,
      trustState: packet.TRUST_STATE,
      blocking: packet.BLOCKING,
      surfaceTruthStatus: packet.SURFACE_TRUTH_STATUS,
      surfaceTruthFailureClass: packet.SURFACE_TRUTH_FAILURE_CLASS,
      surfaceTruthFirstFailedCoordinate: packet.SURFACE_TRUTH_FIRST_FAILED_COORDINATE,
      chapelContextStatus: packet.CHAPEL_CONTEXT_STATUS,
      canvasBishopPresent: packet.CANVAS_BISHOP_PRESENT,
      canvasBishopComponentStatus: packet.CANVAS_BISHOP_COMPONENT_STATUS,
      handObservedCount: packet.HAND_OBSERVED_COUNT,
      fingerObservedCount: packet.FINGER_OBSERVED_COUNT,
      nextFile: packet.RECOMMENDED_NEXT_FILE,
      nextAction: packet.RECOMMENDED_NEXT_ACTION,
      updatedAt: packet.UPDATED_AT
    };
  }

  function getState() { return makePacket("GET_STATE"); }
  function getSummary() { return getStatus(); }

  function publishCallableSurface(api) {
    api.CONTRACT = CONTRACT;
    api.RECEIPT = RECEIPT;
    api.INTERNAL_RENEWAL_CONTRACT = INTERNAL_RENEWAL_CONTRACT;
    api.INTERNAL_RENEWAL_RECEIPT = INTERNAL_RENEWAL_RECEIPT;
    api.PREVIOUS_INTERNAL_RENEWAL_CONTRACT = PREVIOUS_INTERNAL_RENEWAL_CONTRACT;
    api.PREVIOUS_INTERNAL_RENEWAL_RECEIPT = PREVIOUS_INTERNAL_RENEWAL_RECEIPT;
    api.VERSION = VERSION;
    api.FILE = FILE;
    api.TARGET_ROUTE = TARGET_ROUTE;
    api.DIAGNOSTIC_ROUTE = DIAGNOSTIC_ROUTE;
    api.ROLE = ROLE;
    api.COMPONENT = COMPONENT;

    api.contract = CONTRACT;
    api.receipt = RECEIPT;
    api.internalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    api.internalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    api.version = VERSION;
    api.file = FILE;
    api.targetRoute = TARGET_ROUTE;
    api.diagnosticRoute = DIAGNOSTIC_ROUTE;
    api.role = ROLE;
    api.component = COMPONENT;

    api.DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE = true;
    api.DIRECT_METHOD_PUBLICATION_STATUS = "DIRECT_METHODS_PUBLISHED_ON_EXACT_AUTHORITY_PATH";
    api.DIRECT_AUTHORITY_PATH = AUTHORITY_PATH;
    api.DIRECT_METHODS_PUBLISHED = DIRECT_METHOD_NAMES.join(",");
    api.CHAPEL_CONTEXT_READER_ACTIVE = true;

    api.run = run;
    api.runDiagnostic = runDiagnostic;
    api.inspect = inspect;
    api.inspectSurfaceTruth = inspectSurfaceTruth;
    api.runSurfaceTruth = runSurfaceTruth;
    api.runSurfaceTruthDirectCheck = runSurfaceTruthDirectCheck;
    api.runSurfaceTruthProbe = runSurfaceTruthProbe;
    api.runCanvasSurfaceTruthProbe = runCanvasSurfaceTruthProbe;
    api.runProductionSurfaceLensAlignment = runProductionSurfaceLensAlignment;
    api.runTargetFrameDocumentScopeRenewal = runTargetFrameDocumentScopeRenewal;
    api.runDirect = runDirect;
    api.execute = execute;
    api.diagnose = diagnose;
    api.measure = measure;
    api.measureSurfaceTruth = measureSurfaceTruth;
    api.read = read;
    api.readSurfaceTruth = readSurfaceTruth;
    api.getReport = getReport;
    api.getReceipt = getReceipt;
    api.getReceiptLight = getReceiptLight;
    api.getStatus = getStatus;
    api.getState = getState;
    api.getPacket = getPacket;
    api.getPacketText = getPacketText;
    api.getSummary = getSummary;
    api.toPacketText = toPacketText;
    api.collectDocumentScopes = collectDocumentScopes;

    api.readChapelContext = readChapelContext;
    api.readCanvasBishop = readCanvasBishop;
    api.readChapelOneHands = readChapelOneHands;
    api.readHexBridge = readHexBridge;
    api.readChapelTwoFingers = readChapelTwoFingers;

    Object.keys(NO_TOUCH).forEach(function applyNoTouch(key) {
      api[key] = NO_TOUCH[key];
    });

    return api;
  }

  function publishAliases(api) {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");

    ALIAS_PATHS.forEach(function publish(path) {
      setPath(path, api);
    });

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUN = run;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUN_DIAGNOSTIC = runDiagnostic;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT = getReceipt;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT_LIGHT = getReceiptLight;

    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INTERNAL_RENEWAL_CONTRACT__ =
      INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CHAPEL_CONTEXT_READER_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  var authority = publishCallableSurface(getExistingAuthorityObject());
  publishAliases(authority);
})(typeof window !== "undefined" ? window : globalThis);
