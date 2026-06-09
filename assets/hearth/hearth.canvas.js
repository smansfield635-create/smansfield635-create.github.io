// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_TNT_v5
// Full-file replacement.
// Diagnostic reader only.
// Reads: Chapel One, Bridge, Chapel Two, Bridge Return, Chapel One Mount.
// No production mutation. No canvas repair. No build. No release.

(function hearthCanvasSurfaceTruthTwoChapelOneBridgeReader(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";
  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_TNT_v5";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_RECEIPT_v5";
  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_IFRAME_BISHOP_RESOLVER_TNT_v4_3";

  var VERSION =
    "2026-06-09.hearth-diagnostic-probe-canvas-surface-truth-two-chapel-one-bridge-reader-v5";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var CANVAS_BISHOP_FILE = "/assets/hearth/hearth.canvas.js";
  var HTML_FILE = "/showroom/globe/hearth/index.html";

  var HAND_GEOMETRY_FILE = "/assets/hearth/hearth.canvas.hand.geometry.js";
  var HAND_CONTEXT_FILE = "/assets/hearth/hearth.canvas.hand.context.js";
  var HAND_PAINT_FILE = "/assets/hearth/hearth.canvas.hand.paint.js";
  var HAND_VIEW_FILE = "/assets/hearth/hearth.canvas.hand.view.js";
  var HAND_INSPECT_FILE = "/assets/hearth/hearth.canvas.hand.inspect.js";

  var HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  var HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  var BRIDGE_RETURN_FILE = "/assets/hearth/hearth.hex.bridge.return.js";

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

  var PLACEHOLDER_SELECTORS = [
    "#hearthPlaceholderCanvas",
    "[data-hearth-placeholder-canvas='true']",
    "[data-hearth-bishop-placeholder='true']",
    "[data-hearth-placeholder='true']",
    ".hearth-placeholder-canvas",
    ".hearth-bishop-placeholder"
  ];

  var CANVAS_SELECTORS = [
    "#hearthVisibleCanvas",
    "#hearthPlaceholderCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-placeholder-canvas='true']",
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
    "HEARTH_CANVAS_BISHOP",
    "HEARTH_CANVAS_CHAPEL_ONE_BISHOP",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH.canvasBishop",
    "HEARTH.chapelOneBishop",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "DEXTER_LAB.hearthCanvasBishop",
    "DEXTER_LAB.hearthChapelOneBishop",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub"
  ];

  var HAND_ALIASES = {
    geometry: ["HEARTH.canvasHandGeometry", "HEARTH_CANVAS_HAND_GEOMETRY", "DEXTER_LAB.hearthCanvasHandGeometry"],
    context: ["HEARTH.canvasHandContext", "HEARTH_CANVAS_HAND_CONTEXT", "DEXTER_LAB.hearthCanvasHandContext"],
    paint: ["HEARTH.canvasHandPaint", "HEARTH_CANVAS_HAND_PAINT", "DEXTER_LAB.hearthCanvasHandPaint"],
    view: ["HEARTH.canvasHandView", "HEARTH_CANVAS_HAND_VIEW", "DEXTER_LAB.hearthCanvasHandView"],
    inspect: ["HEARTH.canvasHandInspect", "HEARTH_CANVAS_HAND_INSPECT", "DEXTER_LAB.hearthCanvasHandInspect"]
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

  var BRIDGE_RETURN_ALIASES = [
    "HEARTH.hexBridgeReturn",
    "HEARTH.bridgeReturn",
    "HEARTH_HEX_BRIDGE_RETURN",
    "HEARTH_BRIDGE_RETURN",
    "DEXTER_LAB.hearthHexBridgeReturn",
    "DEXTER_LAB.hearthBridgeReturn"
  ];

  var FINGER_ALIASES = {
    surface: ["HEARTH.canvasFingerSurface", "HEARTH.pointerFingerSurface", "HEARTH_CANVAS_FINGER_SURFACE", "HEARTH_POINTER_FINGER_SURFACE", "DEXTER_LAB.hearthCanvasFingerSurface"],
    boundary: ["HEARTH.canvasFingerBoundary", "HEARTH.pointerFingerBoundary", "HEARTH_CANVAS_FINGER_BOUNDARY", "HEARTH_POINTER_FINGER_BOUNDARY", "DEXTER_LAB.hearthCanvasFingerBoundary"],
    inspect: ["HEARTH.canvasFingerInspect", "HEARTH.pointerFingerInspect", "HEARTH_CANVAS_FINGER_INSPECT", "HEARTH_POINTER_FINGER_INSPECT", "DEXTER_LAB.hearthCanvasFingerInspect"],
    light: ["HEARTH.canvasFingerLight", "HEARTH.pointerFingerLight", "HEARTH_CANVAS_FINGER_LIGHT", "HEARTH_POINTER_FINGER_LIGHT", "DEXTER_LAB.hearthCanvasFingerLight"]
  };

  var DIRECT_METHOD_NAMES = [
    "run","runDiagnostic","inspect","inspectSurfaceTruth","runSurfaceTruth",
    "runSurfaceTruthDirectCheck","runSurfaceTruthProbe","runCanvasSurfaceTruthProbe",
    "runProductionSurfaceLensAlignment","runTargetFrameDocumentScopeRenewal",
    "runDirect","execute","diagnose","measure","measureSurfaceTruth",
    "read","readSurfaceTruth","getReport","getReceipt","getReceiptLight",
    "getStatus","getState","getPacket","getPacketText","getSummary",
    "toPacketText","collectDocumentScopes","readChapelOne","readBridge",
    "readChapelTwo","readBridgeReturn","readReleasePath","readCanvasBishop",
    "readChapelOneHands","readHexBridge","readChapelTwoFingers"
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

  function readPathFrom(base, path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = base;

    for (var i = 0; i < parts.length; i += 1) {
      try {
        if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
        cursor = cursor[parts[i]];
      } catch (_error) {
        return null;
      }
    }

    return cursor || null;
  }

  function readPath(path) {
    return readPathFrom(root, path);
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

  function ensureNamespace(path) {
    if (!root[path] || typeof root[path] !== "object") root[path] = {};
    return root[path];
  }

  function safeDocumentWindow(targetDoc) {
    try { return targetDoc && targetDoc.defaultView ? targetDoc.defaultView : null; }
    catch (_error) { return null; }
  }

  function frameDocument(frame) {
    try { if (frame && frame.contentDocument) return frame.contentDocument; } catch (_error) {}
    try { if (frame && frame.contentWindow && frame.contentWindow.document) return frame.contentWindow.document; } catch (_error) {}
    return null;
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

  function addScope(scopes, seen, label, targetDoc, sourceKind) {
    if (!targetDoc) return;
    for (var i = 0; i < seen.length; i += 1) if (seen[i] === targetDoc) return;

    seen.push(targetDoc);
    scopes.push({
      label: label,
      sourceKind: sourceKind || "DOCUMENT",
      doc: targetDoc,
      win: safeDocumentWindow(targetDoc),
      path: documentPath(targetDoc),
      href: documentHref(targetDoc),
      title: documentTitle(targetDoc)
    });
  }

  function addFrameScopes(scopes, seen, baseLabel, targetDoc) {
    if (!targetDoc || !isFunction(targetDoc.querySelectorAll)) return;

    var frames = [];
    try { frames = Array.prototype.slice.call(targetDoc.querySelectorAll("iframe")); }
    catch (_error) { frames = []; }

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
      if (root.parent && root.parent !== root && root.parent.document) {
        addScope(scopes, seen, "parent.document", root.parent.document, "PARENT_DOCUMENT");
        addFrameScopes(scopes, seen, "parent.document", root.parent.document);
      }
    } catch (_error) {}

    try {
      if (root.top && root.top !== root && root.top.document) {
        addScope(scopes, seen, "top.document", root.top.document, "TOP_DOCUMENT");
        addFrameScopes(scopes, seen, "top.document", root.top.document);
      }
    } catch (_error) {}

    return scopes;
  }

  function firstGlobalInWindows(paths) {
    var scopes = collectDocumentScopes();
    var windows = [];
    var seen = [];

    function addWin(label, win) {
      if (!win) return;
      for (var i = 0; i < seen.length; i += 1) if (seen[i] === win) return;
      seen.push(win);
      windows.push({ label: label, win: win });
    }

    addWin("diagnostic.window", root);

    scopes.forEach(function addScopeWindow(scope) {
      addWin(scope.label + ".window", scope.win);
    });

    for (var w = 0; w < windows.length; w += 1) {
      for (var p = 0; p < paths.length; p += 1) {
        var value = readPathFrom(windows[w].win, paths[p]);
        if (value && (isObject(value) || isFunction(value))) {
          return { found: true, path: paths[p], windowLabel: windows[w].label, value: value };
        }
      }
    }

    return { found: false, path: "NONE", windowLabel: "NONE", value: null };
  }

  function firstGlobal(paths) {
    return firstGlobalInWindows(paths);
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

  function readAuthority(paths, expectedFile) {
    var found = firstGlobal(paths);
    var receipt = readReceipt(found.value);

    return {
      found: found.found,
      aliasPath: found.path,
      windowLabel: found.windowLabel,
      file: expectedFile,
      contract: asString(receipt.contract || receipt.CONTRACT || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: asString(receipt.receipt || receipt.RECEIPT || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: asString(receipt.componentStatus || receipt.status || (found.found ? "OBSERVED" : "NOT_OBSERVED")),
      firstFailedCoordinate: asString(receipt.firstFailedCoordinate || "UNKNOWN"),
      recommendedNextFile: asString(receipt.recommendedNextFile || expectedFile),
      recommendedNextAction: asString(receipt.recommendedNextAction || "UNKNOWN"),
      rawReceipt: receipt
    };
  }

  function inspectScope(scope) {
    var targetDoc = scope.doc;
    var mount = queryFirst(targetDoc, MOUNT_SELECTORS);
    var mountRect = rectOf(mount);
    var placeholder = mount ? queryFirst(mount, PLACEHOLDER_SELECTORS) : null;
    if (!placeholder) placeholder = queryFirst(targetDoc, PLACEHOLDER_SELECTORS);

    var placeholderRect = rectOf(placeholder);
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
    if (placeholder) score += 20;
    if (canvas) score += 25;
    if (mountRect.width > 0 && mountRect.height > 0) score += 20;
    if (placeholderRect.width > 0 && placeholderRect.height > 0) score += 10;
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

      hearthHtmlPresent: routeMatch && !diagnosticMatch,
      canonicalMountFound: Boolean(mount),
      canonicalMountDescriptor: elementDescriptor(mount),
      canonicalMountRect: mountRect,
      canonicalMountRectNonZero: Boolean(mountRect.width > 0 && mountRect.height > 0),

      placeholderFound: Boolean(placeholder),
      placeholderDescriptor: elementDescriptor(placeholder),
      placeholderRect: placeholderRect,
      placeholderRectNonZero: Boolean(placeholderRect.width > 0 && placeholderRect.height > 0),

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
    if (!best) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "TARGET_DOCUMENT_SCOPE_UNREADABLE",
      firstFailedCoordinate: "TARGET_DOCUMENT_SCOPE_READABLE",
      acceptedAsEvidence: false
    };

    if (!best.hearthHtmlPresent) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "HEARTH_HTML_ROUTE_NOT_CONFIRMED",
      firstFailedCoordinate: "HEARTH_HTML_PRESENT",
      acceptedAsEvidence: false
    };

    if (!best.canonicalMountFound) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "CANONICAL_MOUNT_MISSING",
      firstFailedCoordinate: "CANONICAL_MOUNT_EXISTS",
      acceptedAsEvidence: false
    };

    if (!best.canonicalMountRectNonZero) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "CANONICAL_MOUNT_RECT_ZERO",
      firstFailedCoordinate: "CANONICAL_MOUNT_RECT_NONZERO",
      acceptedAsEvidence: false
    };

    if (!best.placeholderFound && !best.canonicalCanvasFound) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "PLACEHOLDER_OR_CANVAS_MISSING",
      firstFailedCoordinate: "HEARTH_PLACEHOLDER_OR_CANVAS_EXISTS",
      acceptedAsEvidence: false
    };

    if (best.canonicalCanvasFound && !best.canonicalCanvasRectNonZero) return {
      status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
      failureClass: "CANONICAL_CANVAS_RECT_ZERO",
      firstFailedCoordinate: "CANONICAL_CANVAS_RECT_NONZERO",
      acceptedAsEvidence: false
    };

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

  function readCanvasBishop() {
    var authority = readAuthority(CANVAS_BISHOP_ALIASES, CANVAS_BISHOP_FILE);
    var raw = authority.rawReceipt || {};

    return {
      present: authority.found,
      aliasPath: authority.aliasPath,
      windowLabel: authority.windowLabel,
      file: CANVAS_BISHOP_FILE,
      contract: authority.contract,
      receipt: authority.receipt,
      chapelOne: true,
      chapelOneBishop: asBool(raw.chapelOneBishop) || asBool(raw.canvasBishopPresent) || authority.found,
      componentStatus: authority.componentStatus,
      firstFailedCoordinate: authority.firstFailedCoordinate,
      recommendedNextFile: authority.recommendedNextFile,
      recommendedNextAction: authority.recommendedNextAction,
      handGeometryObserved: asBool(raw.handGeometryObserved),
      handContextObserved: asBool(raw.handContextObserved),
      handPaintObserved: asBool(raw.handPaintObserved),
      handViewObserved: asBool(raw.handViewObserved),
      handInspectObserved: asBool(raw.handInspectObserved),
      hexAuthorityBridgeObserved: asBool(raw.hexAuthorityBridgeObserved),
      hexSurfaceBridgeObserved: asBool(raw.hexSurfaceBridgeObserved),
      bridgeReturnObserved: asBool(raw.bridgeReturnObserved) || asBool(raw.hexBridgeReturnObserved),
      rawReceipt: raw
    };
  }

  function readChapelOneHands() {
    return {
      geometry: readAuthority(HAND_ALIASES.geometry, HAND_GEOMETRY_FILE),
      context: readAuthority(HAND_ALIASES.context, HAND_CONTEXT_FILE),
      paint: readAuthority(HAND_ALIASES.paint, HAND_PAINT_FILE),
      view: readAuthority(HAND_ALIASES.view, HAND_VIEW_FILE),
      inspect: readAuthority(HAND_ALIASES.inspect, HAND_INSPECT_FILE)
    };
  }

  function readHexBridge() {
    return {
      authority: readAuthority(HEX_AUTHORITY_ALIASES, HEX_AUTHORITY_FILE),
      surface: readAuthority(HEX_SURFACE_ALIASES, HEX_SURFACE_FILE)
    };
  }

  function readBridgeReturn() {
    return readAuthority(BRIDGE_RETURN_ALIASES, BRIDGE_RETURN_FILE);
  }

  function readChapelTwoFingers() {
    return {
      surface: readAuthority(FINGER_ALIASES.surface, FINGER_SURFACE_FILE),
      boundary: readAuthority(FINGER_ALIASES.boundary, FINGER_BOUNDARY_FILE),
      inspect: readAuthority(FINGER_ALIASES.inspect, FINGER_INSPECT_FILE),
      light: readAuthority(FINGER_ALIASES.light, FINGER_LIGHT_FILE)
    };
  }

  function readChapelOne(best) {
    var bishop = readCanvasBishop();
    var hands = readChapelOneHands();

    var handObservedCount = [
      bishop.handGeometryObserved || hands.geometry.found,
      bishop.handContextObserved || hands.context.found,
      bishop.handPaintObserved || hands.paint.found,
      bishop.handViewObserved || hands.view.found,
      bishop.handInspectObserved || hands.inspect.found
    ].filter(Boolean).length;

    var htmlPresent = Boolean(best && best.hearthHtmlPresent);
    var mountPresent = Boolean(best && best.canonicalMountFound);
    var mountRectNonzero = Boolean(best && best.canonicalMountRectNonZero);
    var placeholderPresent = Boolean(best && (best.placeholderFound || best.canonicalCanvasFound));
    var canvasPresent = Boolean(best && best.canonicalCanvasFound);
    var canvasRectNonzero = Boolean(best && best.canonicalCanvasRectNonZero);

    var ready = htmlPresent && mountPresent && mountRectNonzero && placeholderPresent &&
      bishop.present && handObservedCount === 5;

    var status = ready ? "CHAPEL_ONE_READY" : "CHAPEL_ONE_HELD";
    var failed = "NONE";
    var nextFile = HEX_AUTHORITY_FILE;
    var nextAction = "MEASURE_BRIDGE";

    if (!htmlPresent) {
      failed = "CHAPEL_ONE_HTML_PRESENT";
      nextFile = HTML_FILE;
      nextAction = "RENEW_HEARTH_HTML_ROUTE_AS_CHAPEL_ONE_MEMBER";
    } else if (!mountPresent) {
      failed = "CHAPEL_ONE_MOUNT_PRESENT";
      nextFile = HTML_FILE;
      nextAction = "EXPOSE_HEARTH_CANVAS_MOUNT";
    } else if (!mountRectNonzero) {
      failed = "CHAPEL_ONE_MOUNT_RECT_NONZERO";
      nextFile = HTML_FILE;
      nextAction = "SETTLE_HEARTH_CANVAS_MOUNT_LAYOUT";
    } else if (!bishop.present) {
      failed = "CANVAS_BISHOP_PRESENT";
      nextFile = CANVAS_BISHOP_FILE;
      nextAction = "LOAD_OR_RENEW_CANVAS_BISHOP";
    } else if (!placeholderPresent) {
      failed = "CHAPEL_ONE_PLACEHOLDER_PRESENT";
      nextFile = CANVAS_BISHOP_FILE;
      nextAction = "ALLOW_BISHOP_PLACEHOLDER_TO_FEED_HTML_MOUNT";
    } else if (handObservedCount < 5) {
      failed = "CHAPEL_ONE_HANDS_COMPLETE";
      nextFile =
        !hands.geometry.found ? HAND_GEOMETRY_FILE :
        !hands.context.found ? HAND_CONTEXT_FILE :
        !hands.paint.found ? HAND_PAINT_FILE :
        !hands.view.found ? HAND_VIEW_FILE :
        HAND_INSPECT_FILE;
      nextAction = "COMPLETE_CHAPEL_ONE_HANDS";
    }

    return {
      status: status,
      ready: ready,
      firstFailedCoordinate: failed,
      recommendedNextFile: nextFile,
      recommendedNextAction: nextAction,

      htmlPresent: htmlPresent,
      htmlFile: HTML_FILE,
      mountPresent: mountPresent,
      mountRectNonzero: mountRectNonzero,
      placeholderPresent: placeholderPresent,
      canvasPresent: canvasPresent,
      canvasRectNonzero: canvasRectNonzero,

      bishop: bishop,
      hands: hands,
      handObservedCount: handObservedCount
    };
  }

  function readBridge(chapelOne) {
    var bridge = readHexBridge();
    var returnBridge = readBridgeReturn();

    var authorityPresent = bridge.authority.found || Boolean(chapelOne && chapelOne.bishop.hexAuthorityBridgeObserved);
    var surfacePresent = bridge.surface.found || Boolean(chapelOne && chapelOne.bishop.hexSurfaceBridgeObserved);
    var returnPresent = returnBridge.found || Boolean(chapelOne && chapelOne.bishop.bridgeReturnObserved);

    var ready = authorityPresent && surfacePresent;
    var returnReady = returnPresent;

    var status = ready ? "BRIDGE_READY" : "BRIDGE_HELD";
    var failed = "NONE";
    var nextFile = FINGER_SURFACE_FILE;
    var nextAction = "MEASURE_CHAPEL_TWO";

    if (!authorityPresent) {
      failed = "BRIDGE_HEX_AUTHORITY_PRESENT";
      nextFile = HEX_AUTHORITY_FILE;
      nextAction = "LOAD_OR_RENEW_HEX_AUTHORITY_BRIDGE";
    } else if (!surfacePresent) {
      failed = "BRIDGE_HEX_SURFACE_PRESENT";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "LOAD_OR_RENEW_HEX_SURFACE_BRIDGE";
    }

    return {
      status: status,
      ready: ready,
      returnReady: returnReady,
      firstFailedCoordinate: failed,
      recommendedNextFile: nextFile,
      recommendedNextAction: nextAction,
      authorityPresent: authorityPresent,
      surfacePresent: surfacePresent,
      returnPresent: returnPresent,
      authority: bridge.authority,
      surface: bridge.surface,
      returnBridge: returnBridge
    };
  }

  function readChapelTwo() {
    var fingers = readChapelTwoFingers();

    var fingerObservedCount = [
      fingers.surface.found,
      fingers.boundary.found,
      fingers.inspect.found,
      fingers.light.found
    ].filter(Boolean).length;

    var ready = fingerObservedCount === 4;

    var status = ready ? "CHAPEL_TWO_READY" : "CHAPEL_TWO_HELD";
    var failed = "NONE";
    var nextFile = BRIDGE_RETURN_FILE;
    var nextAction = "MEASURE_BRIDGE_RETURN";

    if (!fingers.surface.found) {
      failed = "CHAPEL_TWO_FINGER_SURFACE_PRESENT";
      nextFile = FINGER_SURFACE_FILE;
      nextAction = "LOAD_OR_RENEW_FINGER_SURFACE";
    } else if (!fingers.boundary.found) {
      failed = "CHAPEL_TWO_FINGER_BOUNDARY_PRESENT";
      nextFile = FINGER_BOUNDARY_FILE;
      nextAction = "LOAD_OR_RENEW_FINGER_BOUNDARY";
    } else if (!fingers.inspect.found) {
      failed = "CHAPEL_TWO_FINGER_INSPECT_PRESENT";
      nextFile = FINGER_INSPECT_FILE;
      nextAction = "LOAD_OR_RENEW_FINGER_INSPECT";
    } else if (!fingers.light.found) {
      failed = "CHAPEL_TWO_FINGER_LIGHT_PRESENT";
      nextFile = FINGER_LIGHT_FILE;
      nextAction = "LOAD_OR_RENEW_FINGER_LIGHT";
    }

    return {
      status: status,
      ready: ready,
      firstFailedCoordinate: failed,
      recommendedNextFile: nextFile,
      recommendedNextAction: nextAction,
      fingers: fingers,
      fingerObservedCount: fingerObservedCount
    };
  }

  function readReleasePath(chapelOne, bridge, chapelTwo) {
    var bridgeReturnReady = Boolean(bridge && bridge.returnReady);
    var bishopReturnReady = Boolean(chapelOne && chapelOne.bishop && chapelOne.bishop.present);
    var mountReturnReady = Boolean(chapelOne && chapelOne.mountPresent && chapelOne.mountRectNonzero);

    var complete =
      Boolean(chapelOne && chapelOne.ready) &&
      Boolean(bridge && bridge.ready) &&
      Boolean(chapelTwo && chapelTwo.ready) &&
      bridgeReturnReady &&
      bishopReturnReady &&
      mountReturnReady;

    var failed = "NONE";
    var nextFile = CANVAS_BISHOP_FILE;
    var nextAction = "ALLOW_CANVAS_BISHOP_TO_ACCEPT_BRIDGE_RETURN_WHEN_READY";

    if (!chapelOne.ready) {
      failed = "CHAPEL_ONE_READY";
      nextFile = chapelOne.recommendedNextFile;
      nextAction = chapelOne.recommendedNextAction;
    } else if (!bridge.ready) {
      failed = "BRIDGE_READY";
      nextFile = bridge.recommendedNextFile;
      nextAction = bridge.recommendedNextAction;
    } else if (!chapelTwo.ready) {
      failed = "CHAPEL_TWO_READY";
      nextFile = chapelTwo.recommendedNextFile;
      nextAction = chapelTwo.recommendedNextAction;
    } else if (!bridgeReturnReady) {
      failed = "BRIDGE_RETURN_READY";
      nextFile = BRIDGE_RETURN_FILE;
      nextAction = "CREATE_OR_LOAD_BRIDGE_RETURN_PACKET_AUTHORITY";
    } else if (!bishopReturnReady) {
      failed = "BISHOP_RETURN_ACCEPTOR_READY";
      nextFile = CANVAS_BISHOP_FILE;
      nextAction = "RENEW_BISHOP_RETURN_ACCEPTOR";
    } else if (!mountReturnReady) {
      failed = "CHAPEL_ONE_MOUNT_RETURN_READY";
      nextFile = HTML_FILE;
      nextAction = "RENEW_HTML_MOUNT_RETURN_TARGET";
    }

    return {
      complete: complete,
      status: complete ? "GLOBE_RELEASE_PATH_COMPLETE" : "GLOBE_RELEASE_PATH_HELD",
      firstFailedCoordinate: failed,
      recommendedNextFile: nextFile,
      recommendedNextAction: nextAction,
      chapelOneReady: chapelOne.ready,
      bridgeReady: bridge.ready,
      chapelTwoReady: chapelTwo.ready,
      bridgeReturnReady: bridgeReturnReady,
      bishopReturnReady: bishopReturnReady,
      mountReturnReady: mountReturnReady,
      directFingerToHtmlBypassAllowed: false,
      requiredReturnPath: "CHAPEL_TWO_TO_BRIDGE_RETURN_TO_CANVAS_BISHOP_TO_HTML_MOUNT"
    };
  }

  function makePacket(mode) {
    var inspected = inspectSurfaceTruthCore();
    var best = inspected.selectedScope || {};
    var surface = inspected.classification;

    var chapelOne = readChapelOne(best);
    var bridge = readBridge(chapelOne);
    var chapelTwo = readChapelTwo();
    var releasePath = readReleasePath(chapelOne, bridge, chapelTwo);

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_PACKET_v5",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_PACKET_v5",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: ROLE,
      COMPONENT: COMPONENT,
      MODE: mode || "RUN_DIAGNOSTIC",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      UPDATED_AT: nowIso(),

      DIRECT_AUTHORITY_PATH: AUTHORITY_PATH,
      DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE: true,
      DIRECT_METHOD_PUBLICATION_STATUS: "DIRECT_METHODS_PUBLISHED_ON_EXACT_AUTHORITY_PATH",
      DIRECT_METHODS_PUBLISHED: DIRECT_METHOD_NAMES.join(","),

      TWO_CHAPEL_ONE_BRIDGE_READER_ACTIVE: true,
      ARCHITECTURE: "DIAGNOSTIC_UPLINE_TO_CHAPEL_ONE_TO_BRIDGE_TO_CHAPEL_TWO_TO_BRIDGE_RETURN_TO_CHAPEL_ONE_MOUNT",
      TRUTH_PROBE_ROLE: "DIAGNOSTIC_READER_ONLY_NOT_CHAPEL_MEMBER",

      TARGET_FRAME_DOCUMENT_SCOPE_STATUS: inspected.targetFrameDocumentScopeStatus,
      TARGET_ACCESS_STATUS: inspected.targetAccessStatus,
      SELECTED_DOCUMENT_SCOPE: best.label || "NONE",
      SELECTED_DOCUMENT_KIND: best.sourceKind || "NONE",
      SELECTED_DOCUMENT_PATH: best.path || "UNKNOWN",
      SELECTED_DOCUMENT_TITLE: best.title || "UNKNOWN",
      SELECTED_DOCUMENT_ROUTE_MATCH: Boolean(best.routeMatch),
      SELECTED_DOCUMENT_DIAGNOSTIC_MATCH: Boolean(best.diagnosticMatch),

      SURFACE_TRUTH_INSPECTED: true,
      SURFACE_TRUTH_STATUS: surface.status,
      SURFACE_TRUTH_FAILURE_CLASS: surface.failureClass,
      SURFACE_TRUTH_FIRST_FAILED_COORDINATE: surface.firstFailedCoordinate,
      PRODUCTION_CANVAS_SURFACE_LENS_ACCEPTED_AS_EVIDENCE: surface.acceptedAsEvidence,

      HEARTH_HTML_PRESENT: chapelOne.htmlPresent,
      HEARTH_HTML_FILE: HTML_FILE,
      HEARTH_HTML_MOUNT_PRESENT: chapelOne.mountPresent,
      HEARTH_HTML_MOUNT_RECT_NONZERO: chapelOne.mountRectNonzero,
      HEARTH_HTML_PLACEHOLDER_PRESENT: chapelOne.placeholderPresent,
      HEARTH_HTML_CANVAS_PRESENT: chapelOne.canvasPresent,
      HEARTH_HTML_CANVAS_RECT_NONZERO: chapelOne.canvasRectNonzero,
      HEARTH_HTML_READY_FOR_BISHOP_HANDOFF: chapelOne.htmlPresent && chapelOne.mountPresent && chapelOne.mountRectNonzero,

      CANONICAL_MOUNT_EXISTS: Boolean(best.canonicalMountFound),
      CANONICAL_MOUNT_DESCRIPTOR: best.canonicalMountDescriptor || "NONE",
      CANONICAL_MOUNT_RECT: best.canonicalMountRect || rectOf(null),
      CANONICAL_MOUNT_RECT_NONZERO: Boolean(best.canonicalMountRectNonZero),

      CANONICAL_PLACEHOLDER_EXISTS: Boolean(best.placeholderFound),
      CANONICAL_PLACEHOLDER_DESCRIPTOR: best.placeholderDescriptor || "NONE",
      CANONICAL_PLACEHOLDER_RECT: best.placeholderRect || rectOf(null),
      CANONICAL_PLACEHOLDER_RECT_NONZERO: Boolean(best.placeholderRectNonZero),

      CANONICAL_CANVAS_EXISTS: Boolean(best.canonicalCanvasFound),
      CANONICAL_CANVAS_DESCRIPTOR: best.canonicalCanvasDescriptor || "NONE",
      CANONICAL_CANVAS_RECT: best.canonicalCanvasRect || rectOf(null),
      CANONICAL_CANVAS_RECT_NONZERO: Boolean(best.canonicalCanvasRectNonZero),

      CHAPEL_ONE_STATUS: chapelOne.status,
      CHAPEL_ONE_READY: chapelOne.ready,
      CHAPEL_ONE_FIRST_FAILED_COORDINATE: chapelOne.firstFailedCoordinate,
      CHAPEL_ONE_RECOMMENDED_NEXT_FILE: chapelOne.recommendedNextFile,
      CHAPEL_ONE_RECOMMENDED_NEXT_ACTION: chapelOne.recommendedNextAction,

      CANVAS_BISHOP_PRESENT: chapelOne.bishop.present,
      CANVAS_BISHOP_ALIAS_PATH: chapelOne.bishop.aliasPath,
      CANVAS_BISHOP_WINDOW_LABEL: chapelOne.bishop.windowLabel,
      CANVAS_BISHOP_CONTRACT: chapelOne.bishop.contract,
      CANVAS_BISHOP_COMPONENT_STATUS: chapelOne.bishop.componentStatus,

      CHAPEL_ONE_HAND_GEOMETRY_OBSERVED: chapelOne.bishop.handGeometryObserved || chapelOne.hands.geometry.found,
      CHAPEL_ONE_HAND_CONTEXT_OBSERVED: chapelOne.bishop.handContextObserved || chapelOne.hands.context.found,
      CHAPEL_ONE_HAND_PAINT_OBSERVED: chapelOne.bishop.handPaintObserved || chapelOne.hands.paint.found,
      CHAPEL_ONE_HAND_VIEW_OBSERVED: chapelOne.bishop.handViewObserved || chapelOne.hands.view.found,
      CHAPEL_ONE_HAND_INSPECT_OBSERVED: chapelOne.bishop.handInspectObserved || chapelOne.hands.inspect.found,
      CHAPEL_ONE_HAND_OBSERVED_COUNT: chapelOne.handObservedCount,

      BRIDGE_STATUS: bridge.status,
      BRIDGE_READY: bridge.ready,
      BRIDGE_FIRST_FAILED_COORDINATE: bridge.firstFailedCoordinate,
      BRIDGE_RECOMMENDED_NEXT_FILE: bridge.recommendedNextFile,
      BRIDGE_RECOMMENDED_NEXT_ACTION: bridge.recommendedNextAction,
      HEX_AUTHORITY_BRIDGE_OBSERVED: bridge.authorityPresent,
      HEX_SURFACE_BRIDGE_OBSERVED: bridge.surfacePresent,
      BRIDGE_RETURN_OBSERVED: bridge.returnPresent,
      BRIDGE_RETURN_READY: bridge.returnReady,

      CHAPEL_TWO_STATUS: chapelTwo.status,
      CHAPEL_TWO_READY: chapelTwo.ready,
      CHAPEL_TWO_FIRST_FAILED_COORDINATE: chapelTwo.firstFailedCoordinate,
      CHAPEL_TWO_RECOMMENDED_NEXT_FILE: chapelTwo.recommendedNextFile,
      CHAPEL_TWO_RECOMMENDED_NEXT_ACTION: chapelTwo.recommendedNextAction,
      FINGER_SURFACE_OBSERVED: chapelTwo.fingers.surface.found,
      FINGER_BOUNDARY_OBSERVED: chapelTwo.fingers.boundary.found,
      FINGER_INSPECT_OBSERVED: chapelTwo.fingers.inspect.found,
      FINGER_LIGHT_OBSERVED: chapelTwo.fingers.light.found,
      FINGER_OBSERVED_COUNT: chapelTwo.fingerObservedCount,

      RELEASE_PATH_STATUS: releasePath.status,
      GLOBE_RELEASE_PATH_COMPLETE: releasePath.complete,
      RELEASE_PATH_FIRST_FAILED_COORDINATE: releasePath.firstFailedCoordinate,
      RELEASE_PATH_RECOMMENDED_NEXT_FILE: releasePath.recommendedNextFile,
      RELEASE_PATH_RECOMMENDED_NEXT_ACTION: releasePath.recommendedNextAction,
      REQUIRED_RETURN_PATH: releasePath.requiredReturnPath,
      DIRECT_FINGER_TO_HTML_BYPASS_ALLOWED: false,

      RUN_STATE: "SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_DIRECT_RUN_COMPLETE",
      TRUST_STATE: releasePath.complete
        ? "TWO_CHAPEL_ONE_BRIDGE_RELEASE_PATH_ACCEPTED"
        : "TWO_CHAPEL_ONE_BRIDGE_RELEASE_PATH_RETURNED_WITH_HOLD",
      BLOCKING: false,

      DOCUMENT_SCOPE_SCAN_COUNT: inspected.scopes.length,
      DOCUMENT_SCOPE_SCAN: inspected.scopes.map(function scopeLine(scope) {
        return {
          label: scope.label,
          sourceKind: scope.sourceKind,
          path: scope.path,
          title: scope.title,
          routeMatch: scope.routeMatch,
          diagnosticMatch: scope.diagnosticMatch,
          hearthHtmlPresent: scope.hearthHtmlPresent,
          canonicalMountFound: scope.canonicalMountFound,
          canonicalMountRectNonZero: scope.canonicalMountRectNonZero,
          placeholderFound: scope.placeholderFound,
          placeholderRectNonZero: scope.placeholderRectNonZero,
          canonicalCanvasFound: scope.canonicalCanvasFound,
          canonicalCanvasRectNonZero: scope.canonicalCanvasRectNonZero,
          score: scope.score
        };
      }),

      CHAPEL_ONE_OBJECT: chapelOne,
      BRIDGE_OBJECT: bridge,
      CHAPEL_TWO_OBJECT: chapelTwo,
      RELEASE_PATH_OBJECT: releasePath,

      RECOMMENDED_NEXT_FILE: releasePath.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: releasePath.recommendedNextAction,
      NEXT_FILE_AUTHORIZATION_SCOPE: "DIAGNOSTIC_RENEWAL_ONLY",
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,TARGET_RENDERER"
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
      "PACKET","RECEIPT_LEVEL","ROLE","COMPONENT","CONTRACT","RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT","PREVIOUS_INTERNAL_RENEWAL_CONTRACT","FILE",
      "TARGET_ROUTE","DIAGNOSTIC_ROUTE","VERSION","ARCHITECTURE","RUN_STATE",
      "TRUST_STATE","SURFACE_TRUTH_STATUS","SURFACE_TRUTH_FAILURE_CLASS",
      "HEARTH_HTML_PRESENT","HEARTH_HTML_MOUNT_PRESENT","HEARTH_HTML_MOUNT_RECT_NONZERO",
      "HEARTH_HTML_PLACEHOLDER_PRESENT","CHAPEL_ONE_STATUS","CHAPEL_ONE_READY",
      "CANVAS_BISHOP_PRESENT","CHAPEL_ONE_HAND_OBSERVED_COUNT","BRIDGE_STATUS",
      "BRIDGE_READY","HEX_AUTHORITY_BRIDGE_OBSERVED","HEX_SURFACE_BRIDGE_OBSERVED",
      "BRIDGE_RETURN_READY","CHAPEL_TWO_STATUS","CHAPEL_TWO_READY",
      "FINGER_OBSERVED_COUNT","RELEASE_PATH_STATUS","GLOBE_RELEASE_PATH_COMPLETE",
      "RELEASE_PATH_FIRST_FAILED_COORDINATE","RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION","DO_NOT_TOUCH","UPDATED_AT"
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
    var packet = makePacket("GET_RECEIPT_LIGHT");

    return {
      role: ROLE,
      component: COMPONENT,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,
      file: FILE,

      twoChapelOneBridgeReaderActive: true,
      architecture: packet.ARCHITECTURE,

      surfaceTruthStatus: packet.SURFACE_TRUTH_STATUS,
      surfaceTruthFailureClass: packet.SURFACE_TRUTH_FAILURE_CLASS,
      hearthHtmlPresent: packet.HEARTH_HTML_PRESENT,
      hearthHtmlMountPresent: packet.HEARTH_HTML_MOUNT_PRESENT,
      hearthHtmlPlaceholderPresent: packet.HEARTH_HTML_PLACEHOLDER_PRESENT,

      chapelOneStatus: packet.CHAPEL_ONE_STATUS,
      chapelOneReady: packet.CHAPEL_ONE_READY,
      canvasBishopPresent: packet.CANVAS_BISHOP_PRESENT,
      chapelOneHandObservedCount: packet.CHAPEL_ONE_HAND_OBSERVED_COUNT,

      bridgeStatus: packet.BRIDGE_STATUS,
      bridgeReady: packet.BRIDGE_READY,
      bridgeReturnReady: packet.BRIDGE_RETURN_READY,

      chapelTwoStatus: packet.CHAPEL_TWO_STATUS,
      chapelTwoReady: packet.CHAPEL_TWO_READY,
      fingerObservedCount: packet.FINGER_OBSERVED_COUNT,

      globeReleasePathComplete: packet.GLOBE_RELEASE_PATH_COMPLETE,
      releasePathStatus: packet.RELEASE_PATH_STATUS,
      releasePathFirstFailedCoordinate: packet.RELEASE_PATH_FIRST_FAILED_COORDINATE,
      recommendedNextFile: packet.RECOMMENDED_NEXT_FILE,
      recommendedNextAction: packet.RECOMMENDED_NEXT_ACTION,

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
      twoChapelOneBridgeReaderActive: true,
      surfaceTruthStatus: packet.SURFACE_TRUTH_STATUS,
      chapelOneStatus: packet.CHAPEL_ONE_STATUS,
      bridgeStatus: packet.BRIDGE_STATUS,
      chapelTwoStatus: packet.CHAPEL_TWO_STATUS,
      releasePathStatus: packet.RELEASE_PATH_STATUS,
      globeReleasePathComplete: packet.GLOBE_RELEASE_PATH_COMPLETE,
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
    api.VERSION = VERSION;
    api.FILE = FILE;
    api.TARGET_ROUTE = TARGET_ROUTE;
    api.DIAGNOSTIC_ROUTE = DIAGNOSTIC_ROUTE;
    api.ROLE = ROLE;
    api.COMPONENT = COMPONENT;

    api.contract = CONTRACT;
    api.receipt = RECEIPT;
    api.internalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    api.version = VERSION;
    api.file = FILE;
    api.targetRoute = TARGET_ROUTE;
    api.diagnosticRoute = DIAGNOSTIC_ROUTE;
    api.role = ROLE;
    api.component = COMPONENT;

    api.DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE = true;
    api.TWO_CHAPEL_ONE_BRIDGE_READER_ACTIVE = true;
    api.DIRECT_AUTHORITY_PATH = AUTHORITY_PATH;
    api.DIRECT_METHODS_PUBLISHED = DIRECT_METHOD_NAMES.join(",");

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
    api.readChapelOne = function () {
      var inspected = inspectSurfaceTruthCore();
      return readChapelOne(inspected.selectedScope || {});
    };
    api.readBridge = function () {
      var inspected = inspectSurfaceTruthCore();
      var chapelOne = readChapelOne(inspected.selectedScope || {});
      return readBridge(chapelOne);
    };
    api.readChapelTwo = readChapelTwo;
    api.readBridgeReturn = readBridgeReturn;
    api.readReleasePath = function () {
      var inspected = inspectSurfaceTruthCore();
      var chapelOne = readChapelOne(inspected.selectedScope || {});
      var bridge = readBridge(chapelOne);
      var chapelTwo = readChapelTwo();
      return readReleasePath(chapelOne, bridge, chapelTwo);
    };

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
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TWO_CHAPEL_ONE_BRIDGE_READER_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  var authority = publishCallableSurface(getExistingAuthorityObject());
  publishAliases(authority);
})(typeof window !== "undefined" ? window : globalThis);
