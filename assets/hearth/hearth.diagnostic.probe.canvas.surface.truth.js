// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_TNT_v4
// Full-file replacement.
// SURFACE TRUTH / production-surface lens alignment / target-frame document-scope renewal only.
//
// Purpose:
// - Preserve the public Surface Truth probe contract.
// - Renew target-frame document-scope resolution.
// - Find Hearth’s canonical canvas mount without stale selector failure.
// - Read same-document, target iframe, parent, top, opener, and accessible nested frames.
// - Return direct callable receipts for the diagnostic chamber.
// - Feed NORTH / JUDGE_NORTH with surface-truth evidence.
// - Keep this as diagnostic renewal only.
//
// Does not authorize:
// - production mutation
// - canvas build
// - canvas release
// - canvas repair
// - controls mutation
// - runtime restart
// - visual pass claim
// - generated image claim
// - public superiority claim

(function hearthSurfaceTruthTargetFrameDocumentScopeRenewal(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var documentRef = root.document || null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_TNT_v4";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_RECEIPT_v4";

  var PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var COMPAT_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";

  var VERSION =
    "2026-06-09.hearth-diagnostic-probe-canvas-surface-truth-target-frame-document-scope-renewal-v4";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var ROLE = "SURFACE_TRUTH";
  var PROFILE_ROLE = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH";
  var PROFILE_CLASS = "READ_ONLY_PRODUCTION_SURFACE_LENS";
  var CYCLE_POSITION = "SURFACE_TRUTH_TO_NORTH_DIAGNOSTIC_TRACK";

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

  var CANONICAL_MOUNT_SELECTORS = Object.freeze([
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
  ]);

  var CANONICAL_CANVAS_SELECTORS = Object.freeze([
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-dom-surface='true']",
    "canvas[data-planet='hearth']",
    "#hearthCanvas",
    "#hearth-canvas",
    "canvas"
  ]);

  var TARGET_FRAME_SELECTORS = Object.freeze([
    "iframe[data-hearth-target-frame]",
    "iframe[data-hearth-production-frame]",
    "iframe[data-diagnostic-target-frame]",
    "iframe[data-target-route='/showroom/globe/hearth/']",
    "iframe#hearthTargetFrame",
    "iframe#hearthProductionFrame",
    "iframe#targetFrame",
    "iframe[src*='/showroom/globe/hearth/']",
    "iframe"
  ]);

  var SOUTH_SURFACE_POINTER_ALIASES = Object.freeze([
    "HEARTH.southSurfacePointerSidecar",
    "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH.southCanvasSurfacePointerSidecar",
    "HEARTH.diagnosticSouthSurfacePointer",
    "HEARTH.diagnosticSouthScopeLens",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS",
    "DEXTER_LAB.southSurfacePointerSidecar",
    "DEXTER_LAB.hearthSouthSurfacePointerSidecar",
    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer"
  ]);

  var NORTH_ALIASES = Object.freeze([
    "JUDGE_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER",
    "HEARTH.diagnosticRail",
    "HEARTH.diagnosticNorth",
    "HEARTH.diagnosticNorthRail",
    "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
    "DEXTER_LAB.hearthDiagnosticRail",
    "DEXTER_LAB.hearthDiagnosticNorth",
    "DEXTER_LAB.hearthDiagnosticNorthRail"
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

  function compact(value, limit) {
    if (limit === undefined) limit = 6000;
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function readPath(path) {
    var parts = safeString(path).replace(/^window\./, "").split(".");
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i];
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
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

  function queryFirst(selectors, context) {
    if (!context || !isFunction(context.querySelector)) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = context.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }

    return null;
  }

  function queryAll(selectors, context) {
    var out = [];
    if (!context || !isFunction(context.querySelectorAll)) return out;

    selectors.forEach(function scanSelector(selector) {
      try {
        var list = context.querySelectorAll(selector);
        for (var i = 0; i < list.length; i += 1) {
          if (out.indexOf(list[i]) === -1) out.push(list[i]);
        }
      } catch (_error) {}
    });

    return out;
  }

  function rectOf(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
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
      return {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
    }
  }

  function elementDescriptor(element) {
    if (!element) return "NONE";

    var tag = "UNKNOWN";
    var id = "";
    var className = "";
    var data = [];

    try {
      tag = element.tagName || "UNKNOWN";
    } catch (_error) {}

    try {
      id = element.id ? "#" + element.id : "";
    } catch (_error) {}

    try {
      className = typeof element.className === "string" && element.className
        ? "." + element.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error) {}

    try {
      if (element.dataset) {
        Object.keys(element.dataset).slice(0, 12).forEach(function addData(key) {
          data.push("data-" + key + "=" + element.dataset[key]);
        });
      }
    } catch (_error) {}

    return compact([tag.toLowerCase(), id, className, data.join(";")].filter(Boolean).join(""));
  }

  function getDocumentPath(doc) {
    try {
      return doc.location && doc.location.pathname ? doc.location.pathname : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function getDocumentHref(doc) {
    try {
      return doc.location && doc.location.href ? doc.location.href : "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function getDocumentTitle(doc) {
    try {
      return doc.title || "UNKNOWN";
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function getFrameDocument(frame) {
    if (!frame) return null;

    try {
      if (frame.contentDocument) return frame.contentDocument;
    } catch (_error) {}

    try {
      if (frame.contentWindow && frame.contentWindow.document) {
        return frame.contentWindow.document;
      }
    } catch (_error) {}

    return null;
  }

  function tryWindowDocument(win) {
    if (!win) return null;
    try {
      return win.document || null;
    } catch (_error) {
      return null;
    }
  }

  function collectFrameScopesFromDocument(doc, labelPrefix, scopes, seenDocs) {
    if (!doc || !isFunction(doc.querySelectorAll)) return;

    var frames = [];
    try {
      frames = Array.prototype.slice.call(doc.querySelectorAll("iframe"));
    } catch (_error) {
      frames = [];
    }

    frames.forEach(function addFrameScope(frame, index) {
      var frameDoc = getFrameDocument(frame);
      var frameSrc = "UNKNOWN";

      try {
        frameSrc = frame.getAttribute("src") || frame.src || "UNKNOWN";
      } catch (_error) {}

      addDocumentScope(
        scopes,
        seenDocs,
        labelPrefix + ".iframe[" + index + "]",
        frameDoc,
        {
          sourceKind: "IFRAME",
          frameSrc: frameSrc,
          frameRect: rectOf(frame)
        }
      );
    });
  }

  function addDocumentScope(scopes, seenDocs, label, doc, meta) {
    if (!doc) return;

    for (var i = 0; i < seenDocs.length; i += 1) {
      if (seenDocs[i] === doc) return;
    }

    seenDocs.push(doc);

    scopes.push({
      label: label,
      doc: doc,
      sourceKind: meta && meta.sourceKind ? meta.sourceKind : "DOCUMENT",
      frameSrc: meta && meta.frameSrc ? meta.frameSrc : "NONE",
      frameRect: meta && meta.frameRect ? meta.frameRect : rectOf(null),
      path: getDocumentPath(doc),
      href: getDocumentHref(doc),
      title: getDocumentTitle(doc)
    });
  }

  function collectDocumentScopes() {
    var scopes = [];
    var seenDocs = [];

    addDocumentScope(scopes, seenDocs, "current.document", documentRef, {
      sourceKind: "CURRENT_DOCUMENT"
    });

    collectFrameScopesFromDocument(documentRef, "current.document", scopes, seenDocs);

    var parentDoc = null;
    try {
      if (root.parent && root.parent !== root) parentDoc = tryWindowDocument(root.parent);
    } catch (_error) {}
    addDocumentScope(scopes, seenDocs, "parent.document", parentDoc, {
      sourceKind: "PARENT_DOCUMENT"
    });
    collectFrameScopesFromDocument(parentDoc, "parent.document", scopes, seenDocs);

    var topDoc = null;
    try {
      if (root.top && root.top !== root) topDoc = tryWindowDocument(root.top);
    } catch (_error) {}
    addDocumentScope(scopes, seenDocs, "top.document", topDoc, {
      sourceKind: "TOP_DOCUMENT"
    });
    collectFrameScopesFromDocument(topDoc, "top.document", scopes, seenDocs);

    var openerDoc = null;
    try {
      if (root.opener && root.opener !== root) openerDoc = tryWindowDocument(root.opener);
    } catch (_error) {}
    addDocumentScope(scopes, seenDocs, "opener.document", openerDoc, {
      sourceKind: "OPENER_DOCUMENT"
    });
    collectFrameScopesFromDocument(openerDoc, "opener.document", scopes, seenDocs);

    return scopes;
  }

  function inspectDocumentScope(scope) {
    var doc = scope.doc;
    var mount = queryFirst(CANONICAL_MOUNT_SELECTORS, doc);
    var mountRect = rectOf(mount);
    var canvas = null;

    if (mount) {
      canvas = queryFirst(CANONICAL_CANVAS_SELECTORS, mount);
    }

    if (!canvas) {
      canvas = queryFirst(CANONICAL_CANVAS_SELECTORS, doc);
    }

    var canvasRect = rectOf(canvas);

    var routeMatch = scope.path === TARGET_ROUTE ||
      scope.path === TARGET_ROUTE.replace(/\/$/, "") ||
      scope.href.indexOf(TARGET_ROUTE) !== -1;

    var diagnosticMatch = scope.href.indexOf(DIAGNOSTIC_ROUTE) !== -1 ||
      scope.path.indexOf("/diagnostic") !== -1;

    var titleMatch = /hearth/i.test(scope.title || "");
    var mountFound = Boolean(mount);
    var canvasFound = Boolean(canvas);
    var mountRectNonZero = Boolean(mountRect.width > 0 && mountRect.height > 0);
    var canvasRectNonZero = Boolean(canvasRect.width > 0 && canvasRect.height > 0);

    var score = 0;
    if (routeMatch && !diagnosticMatch) score += 80;
    if (titleMatch) score += 20;
    if (mountFound) score += 45;
    if (canvasFound) score += 24;
    if (mountRectNonZero) score += 18;
    if (canvasRectNonZero) score += 14;
    if (diagnosticMatch && !mountFound) score -= 12;

    return {
      label: scope.label,
      sourceKind: scope.sourceKind,
      frameSrc: scope.frameSrc,
      frameRect: scope.frameRect,
      path: scope.path,
      href: scope.href,
      title: scope.title,
      routeMatch: routeMatch,
      diagnosticMatch: diagnosticMatch,
      titleMatch: titleMatch,
      canonicalMountFound: mountFound,
      canonicalMountDescriptor: elementDescriptor(mount),
      canonicalMountRect: mountRect,
      canonicalMountRectNonZero: mountRectNonZero,
      canonicalCanvasFound: canvasFound,
      canonicalCanvasDescriptor: elementDescriptor(canvas),
      canonicalCanvasRect: canvasRect,
      canonicalCanvasRectNonZero: canvasRectNonZero,
      score: score
    };
  }

  function pickBestScope(inspections) {
    if (!inspections.length) return null;

    var sorted = inspections.slice().sort(function byScore(a, b) {
      return b.score - a.score;
    });

    return sorted[0];
  }

  function classifySurfaceTruth(best, inspections) {
    if (!best) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "TARGET_DOCUMENT_SCOPE_UNREADABLE",
        firstFailedCoordinate: "TARGET_DOCUMENT_SCOPE_READABLE",
        acceptedAsEvidence: false,
        readable: false
      };
    }

    if (!best.canonicalMountFound) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_MOUNT_MISSING",
        firstFailedCoordinate: "CANONICAL_MOUNT_EXISTS",
        acceptedAsEvidence: false,
        readable: false
      };
    }

    if (!best.canonicalMountRectNonZero) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_MOUNT_RECT_ZERO",
        firstFailedCoordinate: "CANONICAL_MOUNT_RECT_NONZERO",
        acceptedAsEvidence: false,
        readable: false
      };
    }

    if (!best.canonicalCanvasFound) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_CANVAS_MISSING",
        firstFailedCoordinate: "CANONICAL_CANVAS_EXISTS",
        acceptedAsEvidence: false,
        readable: false
      };
    }

    if (!best.canonicalCanvasRectNonZero) {
      return {
        status: "SURFACE_CONTRACT_MEASUREMENT_FAILED",
        failureClass: "CANONICAL_CANVAS_RECT_ZERO",
        firstFailedCoordinate: "CANONICAL_CANVAS_RECT_NONZERO",
        acceptedAsEvidence: false,
        readable: false
      };
    }

    return {
      status: "SURFACE_CONTRACT_MEASUREMENT_PASSED",
      failureClass: "NONE",
      firstFailedCoordinate: "NONE",
      acceptedAsEvidence: true,
      readable: true
    };
  }

  function inspectSouthSurfacePointer() {
    var found = firstAlias(SOUTH_SURFACE_POINTER_ALIASES);
    var method = "NONE";
    var error = "NONE";
    var output = null;

    if (found.value) {
      var methods = [
        "getReceiptLight",
        "getReceipt",
        "getReport",
        "getStatus",
        "getState",
        "run",
        "inspect",
        "refresh"
      ];

      for (var i = 0; i < methods.length; i += 1) {
        if (!isFunction(found.value[methods[i]])) continue;
        method = methods[i];

        try {
          output = found.value[methods[i]]();
        } catch (callError) {
          error = compact(callError && callError.message ? callError.message : callError);
        }

        break;
      }
    }

    return {
      path: found.path,
      present: Boolean(found.value),
      readMethod: method,
      readError: error,
      output: clonePlain(output)
    };
  }

  function inspectNorth() {
    var found = firstAlias(NORTH_ALIASES);
    return {
      path: found.path,
      present: Boolean(found.value),
      contract:
        getRaw(found.value, "CONTRACT", "UNKNOWN") ||
        getRaw(found.value, "contract", "UNKNOWN"),
      internalRenewalContract:
        getRaw(found.value, "INTERNAL_RENEWAL_CONTRACT", "UNKNOWN") ||
        getRaw(found.value, "internalRenewalContract", "UNKNOWN")
    };
  }

  function inspectSurfaceTruth() {
    var scopes = collectDocumentScopes();
    var inspections = scopes.map(inspectDocumentScope);
    var best = pickBestScope(inspections);
    var classification = classifySurfaceTruth(best, inspections);
    var southPointer = inspectSouthSurfacePointer();
    var north = inspectNorth();

    var targetFrameDocumentScopeStatus = best
      ? "TARGET_DOCUMENT_SCOPE_RESOLVED"
      : "TARGET_DOCUMENT_SCOPE_NOT_RESOLVED";

    var targetAccessStatus = best && best.routeMatch
      ? "TARGET_HEARTH_ROUTE_DOCUMENT_READABLE"
      : best
        ? "TARGET_DOCUMENT_READABLE_ROUTE_MATCH_UNCONFIRMED"
        : "TARGET_DOCUMENT_NOT_READABLE";

    var recommendedNextFile = classification.readable
      ? "/assets/hearth/hearth.diagnostic.rail.js"
      : FILE;

    var recommendedNextAction = classification.readable
      ? "RUN_NORTH_SYNTHESIS_WITH_SURFACE_TRUTH_RECEIPT"
      : "REVIEW_SURFACE_TRUTH_SCOPE_SELECTORS_AND_TARGET_FRAME_ACCESS";

    return {
      scopes: inspections,
      selectedScope: best,
      classification: classification,
      targetFrameDocumentScopeStatus: targetFrameDocumentScopeStatus,
      targetAccessStatus: targetAccessStatus,
      southPointer: southPointer,
      north: north,
      recommendedNextFile: recommendedNextFile,
      recommendedNextAction: recommendedNextAction
    };
  }

  function createPacket(mode) {
    var inspected = inspectSurfaceTruth();
    var best = inspected.selectedScope || {};
    var classification = inspected.classification;

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_PACKET_v4",
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_PACKET_v4",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      ROLE: ROLE,
      COMPONENT: "SURFACE_TRUTH",
      MODE: mode || "RUN_DIAGNOSTIC",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
      COMPAT_CONTRACT: COMPAT_CONTRACT,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      VERSION: VERSION,
      GENERATED_AT: nowIso(),

      UPSTREAM_CONSTRUCT: "LABWEST_CONSTRUCT_TO_SURFACE_TRUTH_TO_NORTH_DIAGNOSTIC_TRACK",
      PROFILE_ROLE: PROFILE_ROLE,
      PROFILE_CLASS: PROFILE_CLASS,
      CYCLE_POSITION: CYCLE_POSITION,

      RUN_STATE: "SURFACE_TRUTH_DIRECT_RUN_COMPLETE",
      TRUST_STATE: classification.readable
        ? "SURFACE_TRUTH_MEASUREMENT_ACCEPTED"
        : "SURFACE_TRUTH_MEASUREMENT_RETURNED_WITH_HOLD",
      BLOCKING: false,

      TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_ACTIVE: true,
      TARGET_FRAME_DOCUMENT_SCOPE_STATUS: inspected.targetFrameDocumentScopeStatus,
      TARGET_ACCESS_STATUS: inspected.targetAccessStatus,

      SOUTH_SURFACE_POINTER_LENS_ALIGNMENT_ACTIVE: true,
      SOUTH_SURFACE_POINTER_LENS_REQUIRED_STATUS: "INTERNAL_LENS_OPTIONAL_FOR_DIRECT_SURFACE_TRUTH",
      SOUTH_SURFACE_POINTER_PATH: inspected.southPointer.path,
      SOUTH_SURFACE_POINTER_PRESENT: inspected.southPointer.present,
      SOUTH_SURFACE_POINTER_READ_METHOD: inspected.southPointer.readMethod,
      SOUTH_SURFACE_POINTER_READ_ERROR: inspected.southPointer.readError,

      PRODUCTION_SURFACE_CLASS: "HEARTH_SHOWROOM_CANONICAL_CANVAS_MOUNT",
      PRODUCTION_CANVAS_SURFACE_LENS_ACCEPTED_AS_EVIDENCE: classification.acceptedAsEvidence,
      CANVAS_PARENT_CHAIN_MAY_RESOLVE_CANONICAL_MOUNT: true,
      CANONICAL_MOUNT_STALE_SELECTOR_FAILURE_PREVENTION_ACTIVE: true,

      CANONICAL_MOUNT_EXISTS: Boolean(best.canonicalMountFound),
      CANONICAL_MOUNT_DESCRIPTOR: best.canonicalMountDescriptor || "NONE",
      CANONICAL_MOUNT_RECT: best.canonicalMountRect || rectOf(null),
      CANONICAL_MOUNT_RECT_NONZERO: Boolean(best.canonicalMountRectNonZero),

      CANONICAL_CANVAS_EXISTS: Boolean(best.canonicalCanvasFound),
      CANONICAL_CANVAS_DESCRIPTOR: best.canonicalCanvasDescriptor || "NONE",
      CANONICAL_CANVAS_RECT: best.canonicalCanvasRect || rectOf(null),
      CANONICAL_CANVAS_RECT_NONZERO: Boolean(best.canonicalCanvasRectNonZero),

      SELECTED_DOCUMENT_SCOPE: best.label || "NONE",
      SELECTED_DOCUMENT_KIND: best.sourceKind || "NONE",
      SELECTED_DOCUMENT_PATH: best.path || "UNKNOWN",
      SELECTED_DOCUMENT_TITLE: best.title || "UNKNOWN",
      SELECTED_DOCUMENT_ROUTE_MATCH: Boolean(best.routeMatch),
      SELECTED_DOCUMENT_DIAGNOSTIC_MATCH: Boolean(best.diagnosticMatch),

      DOCUMENT_SCOPE_SCAN_COUNT: inspected.scopes.length,
      DOCUMENT_SCOPE_SCAN: inspected.scopes.map(function compactScope(scope) {
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

      LABWEST_CONSTRUCT_IS_CONTROLLING_DIAGNOSTIC_DERIVATIVE: true,
      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_SURFACE_TRUTH_AS_EVIDENCE: true,
      NORTH_RAIL_PATH: inspected.north.path,
      NORTH_RAIL_PRESENT: inspected.north.present,
      NORTH_RAIL_CONTRACT: inspected.north.contract,
      NORTH_RAIL_INTERNAL_RENEWAL_CONTRACT: inspected.north.internalRenewalContract,

      SURFACE_TRUTH_PROBE_RENEWAL_IS_CONTRACT_ALIGNMENT_NOT_CANVAS_REPAIR: true,
      OWNS_DETAILED_CANVAS_CONTRACT_DEFINITION: true,
      OWNS_FINE_BOUNDARY_DISAMBIGUATION: true,
      OWNS_CROSS_CONTAINER_COLLAPSE_DETECTION: true,
      OWNS_DUTY_LOAD_SELF_MEASUREMENT: true,
      OWNS_DIAGNOSTIC_MALPRACTICE_GUARD: true,
      OWNS_FINAL_ARBITRATION: false,
      OWNS_WEST_DERIVATIVE_MAP: false,
      OWNS_NORTH_GRAMMAR: false,
      OWNS_NORTH_RAIL: false,
      OWNS_CANVAS_PRODUCTION_REPAIR: false,
      OWNS_CANVAS_BUILD_AUTHORITY: false,
      MAY_FORCE_RECEIPT_RETURN: true,

      DIAGNOSTIC_CYCLE_DECLARED: "SURFACE_TRUTH_TO_NORTH_DIAGNOSTIC_TRACK",
      CANVAS_CYCLE_DECLARED: "READ_ONLY_CANONICAL_MOUNT_AND_CANVAS_RECT_MEASUREMENT",
      SELF_MEASUREMENT_STATUS: "SELF_MEASUREMENT_COMPLETE",
      DIAGNOSTIC_MALPRACTICE_GUARD_ACTIVE: true,
      finalArbitrationClaimed: false,
      westDerivativeMapClaimed: false,

      SURFACE_TRUTH_INSPECTED: true,
      SURFACE_TRUTH_STATUS: classification.status,
      SURFACE_TRUTH_FAILURE_CLASS: classification.failureClass,
      SURFACE_TRUTH_FIRST_FAILED_COORDINATE: classification.firstFailedCoordinate,
      SURFACE_TRUTH_CANONICAL_MOUNT_READABLE: Boolean(
        best.canonicalMountFound && best.canonicalMountRectNonZero
      ),
      SURFACE_TRUTH_CANONICAL_CANVAS_READABLE: Boolean(
        best.canonicalCanvasFound && best.canonicalCanvasRectNonZero
      ),

      CANVAS_BLAME_ELIGIBLE: false,
      CANVAS_PRODUCTION_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,

      RECOMMENDED_NEXT_FILE: inspected.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: inspected.recommendedNextAction,
      NEXT_FILE: inspected.recommendedNextFile,
      NEXT_ACTION: inspected.recommendedNextAction,
      NEXT_FILE_AUTHORIZATION: true,
      NEXT_FILE_AUTHORIZATION_SCOPE: "DIAGNOSTIC_RENEWAL_ONLY",
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE",
      UPDATED_AT: nowIso()
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
        return compact(value);
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
      "PREVIOUS_CONTRACT",
      "PREVIOUS_RECEIPT",
      "COMPAT_CONTRACT",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "VERSION",
      "GENERATED_AT",
      "RUN_STATE",
      "TRUST_STATE",
      "BLOCKING",
      "TARGET_FRAME_DOCUMENT_SCOPE_RENEWAL_ACTIVE",
      "TARGET_FRAME_DOCUMENT_SCOPE_STATUS",
      "TARGET_ACCESS_STATUS",
      "SURFACE_TRUTH_INSPECTED",
      "SURFACE_TRUTH_STATUS",
      "SURFACE_TRUTH_FAILURE_CLASS",
      "SURFACE_TRUTH_FIRST_FAILED_COORDINATE",
      "CANONICAL_MOUNT_EXISTS",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_CANVAS_EXISTS",
      "CANONICAL_CANVAS_RECT_NONZERO",
      "SELECTED_DOCUMENT_SCOPE",
      "SELECTED_DOCUMENT_PATH",
      "SELECTED_DOCUMENT_TITLE",
      "SOUTH_SURFACE_POINTER_PATH",
      "SOUTH_SURFACE_POINTER_PRESENT",
      "NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_SURFACE_TRUTH_AS_EVIDENCE",
      "CANVAS_BLAME_ELIGIBLE",
      "CANVAS_PRODUCTION_REPAIR_AUTHORIZED",
      "CANVAS_BUILD_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
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

  function getReceiptLight() {
    var inspected = inspectSurfaceTruth();
    var best = inspected.selectedScope || {};
    var classification = inspected.classification;

    return {
      role: ROLE,
      component: "SURFACE_TRUTH",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      targetFrameDocumentScopeRenewalActive: true,
      targetFrameDocumentScopeStatus: inspected.targetFrameDocumentScopeStatus,
      surfaceTruthStatus: classification.status,
      surfaceTruthFailureClass: classification.failureClass,
      surfaceTruthFirstFailedCoordinate: classification.firstFailedCoordinate,
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

  function getReceipt() {
    return createPacket("GET_RECEIPT");
  }

  function getReport() {
    return createPacket("GET_REPORT");
  }

  function getStatus() {
    var packet = createPacket("GET_STATUS");

    return {
      runState: packet.RUN_STATE,
      trustState: packet.TRUST_STATE,
      blocking: packet.BLOCKING,
      surfaceTruthStatus: packet.SURFACE_TRUTH_STATUS,
      surfaceTruthFailureClass: packet.SURFACE_TRUTH_FAILURE_CLASS,
      surfaceTruthFirstFailedCoordinate: packet.SURFACE_TRUTH_FIRST_FAILED_COORDINATE,
      targetFrameDocumentScopeStatus: packet.TARGET_FRAME_DOCUMENT_SCOPE_STATUS,
      targetAccessStatus: packet.TARGET_ACCESS_STATUS,
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
    return createPacket("GET_STATE");
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
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,
    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
    ROLE: ROLE,
    PROFILE_ROLE: PROFILE_ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,

    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
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
    getSummary: getStatus,
    getPacket: getReceipt,
    getPacketText: function getPacketText() {
      return toPacketText(createPacket("GET_PACKET_TEXT"));
    },
    toPacketText: toPacketText,

    inspectSurfaceTruth: inspectSurfaceTruth,
    collectDocumentScopes: collectDocumentScopes,

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

    paths.forEach(function publish(path) {
      setPath(path, api);
    });

    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INTERNAL_RENEWAL_CONTRACT__ =
      INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  api.publishAliases = publishAliases;

  publishAliases();
})(typeof window !== "undefined" ? window : globalThis);
