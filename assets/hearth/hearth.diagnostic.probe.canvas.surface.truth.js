// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_RENEWAL_TNT_v4_1
// Full-file replacement.
// SURFACE_TRUTH / direct-method publication renewal only.
//
// Receipt-forced reason:
// - 10 · SURFACE_TRUTH showed the renewed v4 field surface.
// - 10 · SURFACE_TRUTH still returned DIRECT_METHOD=NONE.
// - Therefore this renewal preserves the target-frame scope work and publishes callable direct methods
//   directly on the exact authority object:
//   HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH.
//
// Does not authorize:
// - production mutation
// - canvas repair
// - canvas build
// - canvas release
// - controls mutation
// - runtime restart
// - visual pass claim

(function hearthSurfaceTruthDirectMethodPublicationRenewal(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_RENEWAL_TNT_v4_1";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_RENEWAL_RECEIPT_v4_1";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_TNT_v4";
  var PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_RECEIPT_v4";

  var PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var VERSION =
    "2026-06-09.hearth-diagnostic-probe-canvas-surface-truth-direct-method-publication-renewal-v4-1";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

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
    publicSuperiorityClaim: false,
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

  var MOUNT_SELECTORS = [
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount='true']",
    "[data-hearth-showroom-surface='true']",
    "[data-hearth-visible-surface='true']",
    "[data-hearth-dom-surface='true']",
    "[data-hearth-canvas-stage='true']",
    "[data-canvas-mount='hearth']",
    "[data-planet='hearth'][data-canvas-mount]",
    ".hearth-canvas-mount",
    ".hearth-canvas-stage",
    ".canvas-mount",
    ".planet-stage-card .canvas-mount"
  ];

  var CANVAS_SELECTORS = [
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-dom-surface='true']",
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
    "getSummary"
  ];

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

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function compact(value, limit) {
    if (limit === undefined) limit = 6000;
    return asString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
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

    try {
      tag = (element.tagName || "unknown").toLowerCase();
    } catch (_error) {}

    try {
      id = element.id ? "#" + element.id : "";
    } catch (_error) {}

    try {
      cls = typeof element.className === "string" && element.className
        ? "." + element.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error) {}

    return compact(tag + id + cls, 400);
  }

  function documentPath(targetDoc) {
    try {
      return targetDoc.location && targetDoc.location.pathname
        ? targetDoc.location.pathname
        : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function documentHref(targetDoc) {
    try {
      return targetDoc.location && targetDoc.location.href
        ? targetDoc.location.href
        : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function documentTitle(targetDoc) {
    try {
      return targetDoc.title || "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function safeWindowDocument(win) {
    try {
      return win && win.document ? win.document : null;
    } catch (_error) {
      return null;
    }
  }

  function frameDocument(frame) {
    try {
      if (frame && frame.contentDocument) return frame.contentDocument;
    } catch (_error) {}

    try {
      if (frame && frame.contentWindow && frame.contentWindow.document) {
        return frame.contentWindow.document;
      }
    } catch (_error) {}

    return null;
  }

  function addScope(scopes, seen, label, targetDoc, sourceKind) {
    if (!targetDoc) return;

    for (var i = 0; i < seen.length; i += 1) {
      if (seen[i] === targetDoc) return;
    }

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
    try {
      frames = Array.prototype.slice.call(targetDoc.querySelectorAll("iframe"));
    } catch (_error) {
      frames = [];
    }

    frames.forEach(function eachFrame(frame, index) {
      addScope(scopes, seen, baseLabel + ".iframe[" + index + "]", frameDocument(frame), "IFRAME_DOCUMENT");
    });
  }

  function collectDocumentScopes() {
    var scopes = [];
    var seen = [];

    addScope(scopes, seen, "current.document", doc, "CURRENT_DOCUMENT");
    addFrameScopes(scopes, seen, "current.document", doc);

    var parentDoc = null;
    try {
      if (root.parent && root.parent !== root) parentDoc = safeWindowDocument(root.parent);
    } catch (_error) {}
    addScope(scopes, seen, "parent.document", parentDoc, "PARENT_DOCUMENT");
    addFrameScopes(scopes, seen, "parent.document", parentDoc);

    var topDoc = null;
    try {
      if (root.top && root.top !== root) topDoc = safeWindowDocument(root.top);
    } catch (_error) {}
    addScope(scopes, seen, "top.document", topDoc, "TOP_DOCUMENT");
    addFrameScopes(scopes, seen, "top.document", topDoc);

    var openerDoc = null;
    try {
      if (root.opener && root.opener !== root) openerDoc = safeWindowDocument(root.opener);
    } catch (_error) {}
    addScope(scopes, seen, "opener.document", openerDoc, "OPENER_DOCUMENT");
    addFrameScopes(scopes, seen, "opener.document", openerDoc);

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

    return inspections.slice().sort(function byScore(a, b) {
      return b.score - a.score;
    })[0];
  }

  function classify(best) {
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
    var result = classify(best);

    return {
      scopes: inspections,
      selectedScope: best,
      classification: result,
      targetFrameDocumentScopeStatus: best
        ? "TARGET_DOCUMENT_SCOPE_RESOLVED"
        : "TARGET_DOCUMENT_SCOPE_NOT_RESOLVED",
      targetAccessStatus: best && best.routeMatch
        ? "TARGET_HEARTH_ROUTE_DOCUMENT_READABLE"
        : best
          ? "TARGET_DOCUMENT_READABLE_ROUTE_MATCH_UNCONFIRMED"
          : "TARGET_DOCUMENT_NOT_READABLE"
    };
  }

  function makePacket(mode) {
    var inspected = inspectSurfaceTruthCore();
    var best = inspected.selectedScope || {};
    var result = inspected.classification;
    var passed = result.status === "SURFACE_CONTRACT_MEASUREMENT_PASSED";

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_PACKET_v4_1",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_PACKET_v4_1",
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
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
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

      RUN_STATE: "SURFACE_TRUTH_DIRECT_RUN_COMPLETE",
      TRUST_STATE: passed
        ? "SURFACE_TRUTH_MEASUREMENT_ACCEPTED"
        : "SURFACE_TRUTH_MEASUREMENT_RETURNED_WITH_HOLD",
      BLOCKING: false,

      targetFrameDocumentScopeRenewalActive: true,
      targetFrameDocumentScopeStatus: inspected.targetFrameDocumentScopeStatus,
      surfaceTruthStatus: result.status,
      surfaceTruthFailureClass: result.failureClass,
      surfaceTruthFirstFailedCoordinate: result.firstFailedCoordinate,
      selectedDocumentScope: best.label || "NONE",
      selectedDocumentPath: best.path || "UNKNOWN",
      canonicalMountExists: Boolean(best.canonicalMountFound),
      canonicalMountRectNonZero: Boolean(best.canonicalMountRectNonZero),
      canonicalCanvasExists: Boolean(best.canonicalCanvasFound),
      canonicalCanvasRectNonZero: Boolean(best.canonicalCanvasRectNonZero),
      productionMutationAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      runtimeRestartAuthorized: false,
      visualPassClaimed: false,

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

      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_SURFACE_TRUTH_AS_EVIDENCE: true,
      SURFACE_TRUTH_PROBE_RENEWAL_IS_CONTRACT_ALIGNMENT_NOT_CANVAS_REPAIR: true,
      CANVAS_BLAME_ELIGIBLE: false,
      CANVAS_PRODUCTION_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,

      RECOMMENDED_NEXT_FILE: passed
        ? "/assets/hearth/hearth.diagnostic.rail.js"
        : FILE,
      RECOMMENDED_NEXT_ACTION: passed
        ? "RUN_08_NORTH_CONSUMPTION_OF_SURFACE_TRUTH"
        : "RERUN_10_SURFACE_TRUTH_AFTER_SELECTOR_SCOPE_REVIEW",
      NEXT_FILE: passed
        ? "/assets/hearth/hearth.diagnostic.rail.js"
        : FILE,
      NEXT_ACTION: passed
        ? "RUN_08_NORTH_CONSUMPTION_OF_SURFACE_TRUTH"
        : "RERUN_10_SURFACE_TRUTH_AFTER_SELECTOR_SCOPE_REVIEW",
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
      try {
        return compact(JSON.stringify(value), 24000);
      } catch (_error) {
        return "[object]";
      }
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
      "DIRECT_AUTHORITY_PATH",
      "DIRECT_METHODS_PUBLISHED",
      "SURFACE_TRUTH_INSPECTED",
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

  function runDiagnostic() {
    return makePacket("RUN_DIAGNOSTIC");
  }

  function run() {
    return runDiagnostic();
  }

  function inspect() {
    return makePacket("INSPECT");
  }

  function inspectSurfaceTruth() {
    return makePacket("INSPECT_SURFACE_TRUTH");
  }

  function runSurfaceTruth() {
    return runDiagnostic();
  }

  function runSurfaceTruthDirectCheck() {
    return runDiagnostic();
  }

  function runSurfaceTruthProbe() {
    return runDiagnostic();
  }

  function runCanvasSurfaceTruthProbe() {
    return runDiagnostic();
  }

  function runProductionSurfaceLensAlignment() {
    return runDiagnostic();
  }

  function runTargetFrameDocumentScopeRenewal() {
    return runDiagnostic();
  }

  function runDirect() {
    return runDiagnostic();
  }

  function execute() {
    return runDiagnostic();
  }

  function diagnose() {
    return runDiagnostic();
  }

  function measure() {
    return runDiagnostic();
  }

  function measureSurfaceTruth() {
    return runDiagnostic();
  }

  function read() {
    return runDiagnostic();
  }

  function readSurfaceTruth() {
    return runDiagnostic();
  }

  function getReport() {
    return makePacket("GET_REPORT");
  }

  function getReceipt() {
    return makePacket("GET_RECEIPT");
  }

  function getReceiptLight() {
    var inspected = inspectSurfaceTruthCore();
    var best = inspected.selectedScope || {};
    var result = inspected.classification;

    return {
      role: ROLE,
      component: COMPONENT,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      directMethodPublicationRenewalActive: true,
      directMethodPublicationStatus: "DIRECT_METHODS_PUBLISHED_ON_EXACT_AUTHORITY_PATH",
      directAuthorityPath: AUTHORITY_PATH,
      directMethodsPublished: DIRECT_METHOD_NAMES.join(","),
      targetFrameDocumentScopeRenewalActive: true,
      targetFrameDocumentScopeStatus: inspected.targetFrameDocumentScopeStatus,
      surfaceTruthStatus: result.status,
      surfaceTruthFailureClass: result.failureClass,
      surfaceTruthFirstFailedCoordinate: result.firstFailedCoordinate,
      selectedDocumentScope: best.label || "NONE",
      selectedDocumentPath: best.path || "UNKNOWN",
      canonicalMountExists: Boolean(best.canonicalMountFound),
      canonicalMountRectNonZero: Boolean(best.canonicalMountRectNonZero),
      canonicalCanvasExists: Boolean(best.canonicalCanvasFound),
      canonicalCanvasRectNonZero: Boolean(best.canonicalCanvasRectNonZero),
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
      directMethodPublicationRenewalActive: packet.DIRECT_METHOD_PUBLICATION_RENEWAL_ACTIVE,
      directMethodPublicationStatus: packet.DIRECT_METHOD_PUBLICATION_STATUS,
      directAuthorityPath: packet.DIRECT_AUTHORITY_PATH,
      directMethodsPublished: packet.DIRECT_METHODS_PUBLISHED,
      surfaceTruthStatus: packet.SURFACE_TRUTH_STATUS,
      surfaceTruthFailureClass: packet.SURFACE_TRUTH_FAILURE_CLASS,
      surfaceTruthFirstFailedCoordinate: packet.SURFACE_TRUTH_FIRST_FAILED_COORDINATE,
      targetFrameDocumentScopeStatus: packet.TARGET_FRAME_DOCUMENT_SCOPE_STATUS,
      selectedDocumentScope: packet.SELECTED_DOCUMENT_SCOPE,
      selectedDocumentPath: packet.SELECTED_DOCUMENT_PATH,
      canonicalMountExists: packet.CANONICAL_MOUNT_EXISTS,
      canonicalMountRectNonZero: packet.CANONICAL_MOUNT_RECT_NONZERO,
      canonicalCanvasExists: packet.CANONICAL_CANVAS_EXISTS,
      canonicalCanvasRectNonZero: packet.CANONICAL_CANVAS_RECT_NONZERO,
      nextFile: packet.NEXT_FILE,
      nextAction: packet.NEXT_ACTION,
      updatedAt: packet.UPDATED_AT
    };
  }

  function getState() {
    return makePacket("GET_STATE");
  }

  function getPacket() {
    return getReceipt();
  }

  function getPacketText() {
    return toPacketText(makePacket("GET_PACKET_TEXT"));
  }

  function getSummary() {
    return getStatus();
  }

  function publishCallableSurface(api) {
    api.CONTRACT = CONTRACT;
    api.RECEIPT = RECEIPT;
    api.INTERNAL_RENEWAL_CONTRACT = INTERNAL_RENEWAL_CONTRACT;
    api.INTERNAL_RENEWAL_RECEIPT = INTERNAL_RENEWAL_RECEIPT;
    api.PREVIOUS_INTERNAL_RENEWAL_CONTRACT = PREVIOUS_INTERNAL_RENEWAL_CONTRACT;
    api.PREVIOUS_INTERNAL_RENEWAL_RECEIPT = PREVIOUS_INTERNAL_RENEWAL_RECEIPT;
    api.PREVIOUS_CONTRACT = PREVIOUS_CONTRACT;
    api.PREVIOUS_RECEIPT = PREVIOUS_RECEIPT;
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
    api.previousInternalRenewalContract = PREVIOUS_INTERNAL_RENEWAL_CONTRACT;
    api.previousContract = PREVIOUS_CONTRACT;
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

    api.directMethodPublicationRenewalActive = true;
    api.directMethodPublicationStatus = "DIRECT_METHODS_PUBLISHED_ON_EXACT_AUTHORITY_PATH";
    api.directAuthorityPath = AUTHORITY_PATH;
    api.directMethodsPublished = DIRECT_METHOD_NAMES.join(",");

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
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_CHECK = runSurfaceTruthDirectCheck;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT = getReceipt;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT_LIGHT = getReceiptLight;

    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INTERNAL_RENEWAL_CONTRACT__ =
      INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_METHOD_PUBLICATION_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DIRECT_AUTHORITY_PATH__ = AUTHORITY_PATH;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  var authority = publishCallableSurface(getExistingAuthorityObject());
  publishAliases(authority);
})(typeof window !== "undefined" ? window : globalThis);
