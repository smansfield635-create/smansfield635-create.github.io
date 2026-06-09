// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_TNT_v5_2
// Full-file replacement.
// Existing Surface Truth Probe renewal.
// Adds route script inclusion proof for /assets/hearth/hearth.canvas.js.
// No eleventh probe.
// Reader only.
// Does not mutate production, canvas, controls, runtime, route renderer, or visual pass.

(function hearthDiagnosticProbeCanvasSurfaceTruthRouteScriptInclusionReader(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_TNT_v5_2";
  var RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_RECEIPT_v5_2";
  var PREVIOUS_CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_READER_TNT_v5_1";

  var VERSION = "2026-06-09.hearth-canvas-surface-truth-route-script-inclusion-reader-v5-2";
  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  var BISHOP_FILE = "/assets/hearth/hearth.canvas.js";
  var BISHOP_EXPECTED_CONTRACT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_MOUNT_GOVERNOR_TNT_v2";

  var SYSTEM_CANON = "HEARTH_TWO_CHAPEL_CYCLE_ALIAS_REGISTRY_CANONICAL_BINDING_v1";
  var SYSTEM_MODEL = "CYCLICAL_TWO_CHAPEL_SYSTEM";

  var CYCLE_TEXT = "HTML_MOUNT -> CHAPEL_ONE_HEAD -> CHAPEL_ONE_WORKERS -> CHAPEL_ONE_PRIEST -> BRIDGE_AUTHORITY -> ACTIVE_CROSSING_BRIDGE -> CHAPEL_TWO_HEAD -> CHAPEL_TWO_WORKERS -> CHAPEL_TWO_PRIEST -> BRIDGE_RETURN -> CHAPEL_ONE_HEAD -> HTML_MOUNT";

  var NO_CLAIMS = {
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
    "#hearthPlaceholderCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-placeholder-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-planet='hearth']",
    "#hearthCanvas",
    "#hearth-canvas",
    "canvas"
  ];

  var REGISTRY = {
    chapelOneHead: {
      file: "/assets/hearth/hearth.canvas.js",
      role: "Chapel One Head / Canvas Bishop / Mount Platform Governor",
      chapel: "CHAPEL_ONE",
      chapelMember: true,
      primaryAlias: "HEARTH_CANVAS_BISHOP",
      aliases: [
        "HEARTH_CANVAS_BISHOP",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_AUTHORITY",
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
      ]
    },

    chapelOnePriest: {
      file: "/assets/hearth/hearth.canvas.hand.inspect.js",
      role: "Chapel One Priest / Inspect Hand",
      chapel: "CHAPEL_ONE",
      chapelMember: true,
      primaryAlias: "HEARTH_CANVAS_HAND_INSPECT",
      aliases: [
        "HEARTH_CANVAS_HAND_INSPECT",
        "HEARTH.canvasHandInspect",
        "DEXTER_LAB.hearthCanvasHandInspect"
      ]
    },

    chapelOneWorkers: [
      {
        file: "/assets/hearth/hearth.canvas.hand.geometry.js",
        role: "Geometry Hand",
        chapel: "CHAPEL_ONE",
        chapelMember: true,
        primaryAlias: "HEARTH_CANVAS_HAND_GEOMETRY",
        aliases: ["HEARTH_CANVAS_HAND_GEOMETRY", "HEARTH.canvasHandGeometry", "DEXTER_LAB.hearthCanvasHandGeometry"]
      },
      {
        file: "/assets/hearth/hearth.canvas.hand.context.js",
        role: "Context Hand",
        chapel: "CHAPEL_ONE",
        chapelMember: true,
        primaryAlias: "HEARTH_CANVAS_HAND_CONTEXT",
        aliases: ["HEARTH_CANVAS_HAND_CONTEXT", "HEARTH.canvasHandContext", "DEXTER_LAB.hearthCanvasHandContext"]
      },
      {
        file: "/assets/hearth/hearth.canvas.hand.paint.js",
        role: "Paint Hand",
        chapel: "CHAPEL_ONE",
        chapelMember: true,
        primaryAlias: "HEARTH_CANVAS_HAND_PAINT",
        aliases: ["HEARTH_CANVAS_HAND_PAINT", "HEARTH.canvasHandPaint", "DEXTER_LAB.hearthCanvasHandPaint"]
      },
      {
        file: "/assets/hearth/hearth.canvas.hand.view.js",
        role: "View Hand",
        chapel: "CHAPEL_ONE",
        chapelMember: true,
        primaryAlias: "HEARTH_CANVAS_HAND_VIEW",
        aliases: ["HEARTH_CANVAS_HAND_VIEW", "HEARTH.canvasHandView", "DEXTER_LAB.hearthCanvasHandView"]
      }
    ],

    bridgeAuthority: {
      file: "/assets/hearth/hearth.hex.four-pair.authority.js",
      role: "3D Authority / Tuple Truth",
      chapel: "NONE",
      chapelMember: false,
      primaryAlias: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
        "HEARTH.hexFourPair3dAuthority",
        "DEXTER_LAB.hearthHexFourPair3dAuthority",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexAuthority",
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "DEXTER_LAB.hearthHexFourPairAuthority"
      ]
    },

    activeCrossingBridge: {
      file: "/assets/hearth/hearth.hex.surface.js",
      role: "Active Chapel Bridge / Chapel One to Chapel Two Transmission",
      chapel: "NONE",
      chapelMember: false,
      primaryAlias: "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE",
      aliases: [
        "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE",
        "HEARTH.hexSurface3dChapelBridge",
        "DEXTER_LAB.hearthHexSurface3dChapelBridge",
        "HEARTH.hexSurface",
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_SURFACE_RENDERER",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
        "DEXTER_LAB.hearthHexSurface"
      ]
    },

    bridgeReturn: {
      file: "/assets/hearth/hearth.hex.bridge.return.js",
      role: "Bridge Return / Chapel Two to Chapel One Return Authority",
      chapel: "NONE",
      chapelMember: false,
      primaryAlias: "HEARTH_HEX_BRIDGE_RETURN",
      aliases: [
        "HEARTH_HEX_BRIDGE_RETURN",
        "HEARTH.hexBridgeReturn",
        "HEARTH.bridgeReturn",
        "HEARTH_BRIDGE_RETURN",
        "DEXTER_LAB.hearthHexBridgeReturn",
        "DEXTER_LAB.hearthBridgeReturn"
      ]
    },

    chapelTwoHead: {
      file: "/assets/hearth/hearth.canvas.finger.surface.js",
      role: "Chapel Two Head / Surface Finger Bishop",
      chapel: "CHAPEL_TWO",
      chapelMember: true,
      primaryAlias: "HEARTH_CANVAS_FINGER_SURFACE_3D_CHAPEL_2",
      aliases: [
        "HEARTH_CANVAS_FINGER_SURFACE_3D_CHAPEL_2",
        "HEARTH.canvasFingerSurface3dChapel2",
        "DEXTER_LAB.hearthCanvasFingerSurface3dChapel2",
        "HEARTH.canvasFingerSurface",
        "HEARTH.pointerFingerSurface",
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH_POINTER_FINGER_SURFACE",
        "DEXTER_LAB.hearthCanvasFingerSurface"
      ]
    },

    chapelTwoPriest: {
      file: "/assets/hearth/hearth.canvas.finger.inspect.js",
      role: "Chapel Two Priest / Inspect Finger",
      chapel: "CHAPEL_TWO",
      chapelMember: true,
      primaryAlias: "HEARTH_CANVAS_FINGER_INSPECT",
      aliases: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH.canvasFingerInspect",
        "HEARTH.pointerFingerInspect",
        "HEARTH_POINTER_FINGER_INSPECT",
        "DEXTER_LAB.hearthCanvasFingerInspect"
      ]
    },

    chapelTwoWorkers: [
      ["mass", "/assets/hearth/hearth.canvas.finger.mass.js", "HEARTH_CANVAS_FINGER_MASS"],
      ["elevation", "/assets/hearth/hearth.canvas.finger.elevation.js", "HEARTH_CANVAS_FINGER_ELEVATION"],
      ["landform", "/assets/hearth/hearth.canvas.finger.landform.js", "HEARTH_CANVAS_FINGER_LANDFORM"],
      ["hydrology", "/assets/hearth/hearth.canvas.finger.hydrology.js", "HEARTH_CANVAS_FINGER_HYDROLOGY"],
      ["material", "/assets/hearth/hearth.canvas.finger.material.js", "HEARTH_CANVAS_FINGER_MATERIAL"],
      ["light", "/assets/hearth/hearth.canvas.finger.light.js", "HEARTH_CANVAS_FINGER_LIGHT"],
      ["lighting", "/assets/hearth/hearth.canvas.finger.lighting.js", "HEARTH_CANVAS_FINGER_LIGHTING"],
      ["atmosphere", "/assets/hearth/hearth.canvas.finger.atmosphere.js", "HEARTH_CANVAS_FINGER_ATMOSPHERE"],
      ["composition", "/assets/hearth/hearth.canvas.finger.composition.js", "HEARTH_CANVAS_FINGER_COMPOSITION"],
      ["boundary", "/assets/hearth/hearth.canvas.finger.boundary.js", "HEARTH_CANVAS_FINGER_BOUNDARY"]
    ].map(function makeFinger(row) {
      var name = row[0];
      var file = row[1];
      var primary = row[2];
      var cap = name.charAt(0).toUpperCase() + name.slice(1);

      return {
        file: file,
        role: cap + " Finger",
        chapel: "CHAPEL_TWO",
        chapelMember: true,
        primaryAlias: primary,
        aliases: [
          primary,
          "HEARTH.canvasFinger" + cap,
          "HEARTH.pointerFinger" + cap,
          "DEXTER_LAB.hearthCanvasFinger" + cap
        ]
      };
    })
  };

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

  function compact(value, limit) {
    return asString(value).replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, limit || 12000);
  }

  function readPathFrom(scope, path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = scope;

    for (var i = 0; i < parts.length; i += 1) {
      try {
        if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return undefined;
        cursor = cursor[parts[i]];
      } catch (_error) {
        return undefined;
      }
    }

    return cursor;
  }

  function setPathOn(scope, path, value) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    var cursor = scope;

    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function ensureNamespace(name) {
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function methodKeys(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return [];
    try {
      return Object.keys(value).filter(function filter(key) {
        return isFunction(value[key]);
      });
    } catch (_error) {
      return [];
    }
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

  function descriptor(element) {
    if (!element) return "NONE";

    var tag = "unknown";
    var id = "";
    var cls = "";

    try { tag = (element.tagName || "unknown").toLowerCase(); } catch (_error) {}
    try { id = element.id ? "#" + element.id : ""; } catch (_error2) {}
    try {
      cls = typeof element.className === "string" && element.className
        ? "." + element.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error3) {}

    return compact(tag + id + cls, 400);
  }

  function getPath(win) {
    try { return win.location && win.location.pathname ? win.location.pathname : "UNKNOWN"; }
    catch (_error) { return "UNKNOWN"; }
  }

  function getHref(win) {
    try { return win.location && win.location.href ? win.location.href : "UNKNOWN"; }
    catch (_error) { return "UNKNOWN"; }
  }

  function getTitle(doc) {
    try { return doc && doc.title ? doc.title : "UNKNOWN"; }
    catch (_error) { return "UNKNOWN"; }
  }

  function routeMatch(path) {
    return path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "");
  }

  function diagnosticMatch(path) {
    return path.indexOf(DIAGNOSTIC_ROUTE.replace(/\/$/, "")) === 0;
  }

  function queryFirst(doc, selectors) {
    if (!doc || !isFunction(doc.querySelector)) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = doc.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }

    return null;
  }

  function queryFirstInside(element, selectors) {
    if (!element || !isFunction(element.querySelector)) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = element.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }

    return null;
  }

  function inspectDocumentSurface(label, sourceKind, win, doc) {
    var path = getPath(win);
    var href = getHref(win);

    var mount = queryFirst(doc, MOUNT_SELECTORS);
    var mountRect = rectOf(mount);

    var canvas = mount ? queryFirstInside(mount, CANVAS_SELECTORS) : null;
    if (!canvas) canvas = queryFirst(doc, CANVAS_SELECTORS);

    var canvasRect = rectOf(canvas);

    var score = 0;
    if (routeMatch(path)) score += 100;
    if (!diagnosticMatch(path)) score += 20;
    if (mount) score += 50;
    if (mountRect.width > 0 && mountRect.height > 0) score += 20;
    if (canvas) score += 15;
    if (canvasRect.width > 0 && canvasRect.height > 0) score += 15;
    if (diagnosticMatch(path)) score -= 30;

    return {
      label: label,
      sourceKind: sourceKind,
      windowRef: win,
      documentRef: doc,

      path: path,
      href: href,
      title: getTitle(doc),
      routeMatch: routeMatch(path),
      diagnosticMatch: diagnosticMatch(path),
      score: score,

      canonicalMountFound: Boolean(mount),
      canonicalMountDescriptor: descriptor(mount),
      canonicalMountRect: mountRect,
      canonicalMountRectNonZero: Boolean(mountRect.width > 0 && mountRect.height > 0),

      canonicalCanvasFound: Boolean(canvas),
      canonicalCanvasDescriptor: descriptor(canvas),
      canonicalCanvasRect: canvasRect,
      canonicalCanvasRectNonZero: Boolean(canvasRect.width > 0 && canvasRect.height > 0)
    };
  }

  function serialScope(scope) {
    if (!scope) return null;

    return {
      label: scope.label,
      sourceKind: scope.sourceKind,
      path: scope.path,
      href: scope.href,
      title: scope.title,
      routeMatch: scope.routeMatch,
      diagnosticMatch: scope.diagnosticMatch,
      score: scope.score,
      canonicalMountFound: scope.canonicalMountFound,
      canonicalMountDescriptor: scope.canonicalMountDescriptor,
      canonicalMountRect: scope.canonicalMountRect,
      canonicalMountRectNonZero: scope.canonicalMountRectNonZero,
      canonicalCanvasFound: scope.canonicalCanvasFound,
      canonicalCanvasDescriptor: scope.canonicalCanvasDescriptor,
      canonicalCanvasRect: scope.canonicalCanvasRect,
      canonicalCanvasRectNonZero: scope.canonicalCanvasRectNonZero
    };
  }

  function collectDocumentScopes() {
    var scopes = [];
    var seen = [];

    function push(label, sourceKind, win, doc) {
      if (!win || !doc) return;

      try {
        if (seen.indexOf(doc) !== -1) return;
        seen.push(doc);
        scopes.push(inspectDocumentSurface(label, sourceKind, win, doc));
      } catch (_error) {}
    }

    try { push("current.document", "CURRENT_DOCUMENT", root, root.document); } catch (_error1) {}

    try {
      if (root.parent && root.parent !== root && root.parent.document) {
        push("parent.document", "PARENT_DOCUMENT", root.parent, root.parent.document);
      }
    } catch (_error2) {}

    try {
      if (root.top && root.top !== root && root.top.document) {
        push("top.document", "TOP_DOCUMENT", root.top, root.top.document);
      }
    } catch (_error3) {}

    var docsToScan = scopes.slice();

    docsToScan.forEach(function scanFrames(scope) {
      var doc = scope.documentRef;
      if (!doc || !isFunction(doc.querySelectorAll)) return;

      var frames = [];
      try { frames = Array.prototype.slice.call(doc.querySelectorAll("iframe")); } catch (_error) { frames = []; }

      frames.forEach(function frameScan(frame, index) {
        try {
          var frameWin = frame.contentWindow;
          var frameDoc = frame.contentDocument || (frameWin && frameWin.document);
          if (frameWin && frameDoc) push(scope.label + ".iframe[" + index + "]", "IFRAME_DOCUMENT", frameWin, frameDoc);
        } catch (_error) {}
      });
    });

    scopes.sort(function sort(a, b) {
      return b.score - a.score;
    });

    return scopes;
  }

  function selectBestScope(scopes) {
    if (!Array.isArray(scopes) || !scopes.length) return null;

    for (var i = 0; i < scopes.length; i += 1) {
      if (scopes[i].routeMatch && !scopes[i].diagnosticMatch) return scopes[i];
    }

    return scopes[0];
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    var methods = ["getReceiptLight", "getReceipt", "getPacket", "getStatus", "getState", "getReport", "inspect", "measure"];

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];

      if (!isFunction(authority[method])) continue;

      try {
        var out = authority[method]();
        if (isObject(out)) return out;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.RECEIPT_OBJECT)) return authority.RECEIPT_OBJECT;

    return {};
  }

  function findAliasInWindow(win, aliases) {
    if (!win) {
      return {
        found: false,
        aliasPath: "NONE",
        windowLabel: "NONE",
        value: null
      };
    }

    for (var i = 0; i < aliases.length; i += 1) {
      var alias = aliases[i];
      var value = readPathFrom(win, alias);

      if (value && (isObject(value) || isFunction(value))) {
        return {
          found: true,
          aliasPath: alias,
          windowLabel: "target.window",
          value: value
        };
      }
    }

    return {
      found: false,
      aliasPath: "NONE",
      windowLabel: "target.window",
      value: null
    };
  }

  function readNode(win, node) {
    var found = findAliasInWindow(win, node.aliases || []);
    var receipt = readReceipt(found.value);
    var keys = methodKeys(found.value);

    return {
      file: node.file,
      role: node.role,
      chapel: node.chapel,
      chapelMember: Boolean(node.chapelMember),
      primaryAlias: node.primaryAlias,

      found: found.found,
      aliasPath: found.aliasPath,
      windowLabel: found.windowLabel,
      valueType: found.found ? typeof found.value : "undefined",
      methodCount: keys.length,
      methodKeys: keys.join(","),

      contract: asString(receipt.CONTRACT || receipt.contract || (found.value && found.value.CONTRACT) || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: asString(receipt.RECEIPT || receipt.receipt || (found.value && found.value.RECEIPT) || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: asString(receipt.COMPONENT_STATUS || receipt.componentStatus || receipt.BISHOP_STATUS || receipt.status || receipt.RUN_STATE || (found.found ? "OBSERVED" : "NOT_OBSERVED")),
      firstFailedCoordinate: asString(receipt.FIRST_FAILED_COORDINATE || receipt.firstFailedCoordinate || receipt.FIRST_HELD_COORDINATE || "UNKNOWN"),
      recommendedNextFile: asString(receipt.RECOMMENDED_NEXT_FILE || receipt.recommendedNextFile || node.file),
      recommendedNextAction: asString(receipt.RECOMMENDED_NEXT_ACTION || receipt.recommendedNextAction || "UNKNOWN"),
      rawReceipt: receipt
    };
  }

  function readRegistry(scope) {
    var win = scope && scope.windowRef ? scope.windowRef : root;

    var chapelOneHead = readNode(win, REGISTRY.chapelOneHead);
    var chapelOnePriest = readNode(win, REGISTRY.chapelOnePriest);
    var chapelOneWorkers = REGISTRY.chapelOneWorkers.map(function read(worker) { return readNode(win, worker); });

    var bridgeAuthority = readNode(win, REGISTRY.bridgeAuthority);
    var activeCrossingBridge = readNode(win, REGISTRY.activeCrossingBridge);
    var bridgeReturn = readNode(win, REGISTRY.bridgeReturn);

    var chapelTwoHead = readNode(win, REGISTRY.chapelTwoHead);
    var chapelTwoPriest = readNode(win, REGISTRY.chapelTwoPriest);
    var chapelTwoWorkers = REGISTRY.chapelTwoWorkers.map(function read(worker) { return readNode(win, worker); });

    var chapelOneWorkerCount = chapelOneWorkers.filter(function count(node) { return node.found; }).length;
    var chapelTwoWorkerCount = chapelTwoWorkers.filter(function count(node) { return node.found; }).length;

    return {
      chapelOneHead: chapelOneHead,
      chapelOnePriest: chapelOnePriest,
      chapelOneWorkers: chapelOneWorkers,

      bridgeAuthority: bridgeAuthority,
      activeCrossingBridge: activeCrossingBridge,
      bridgeReturn: bridgeReturn,

      chapelTwoHead: chapelTwoHead,
      chapelTwoPriest: chapelTwoPriest,
      chapelTwoWorkers: chapelTwoWorkers,

      chapelOneWorkerCount: chapelOneWorkerCount,
      chapelOneWorkerTotal: chapelOneWorkers.length,
      chapelOneComplete: Boolean(chapelOneHead.found && chapelOnePriest.found && chapelOneWorkerCount === chapelOneWorkers.length),

      chapelTwoWorkerCount: chapelTwoWorkerCount,
      chapelTwoWorkerTotal: chapelTwoWorkers.length,
      chapelTwoComplete: Boolean(chapelTwoHead.found && chapelTwoPriest.found && chapelTwoWorkerCount === chapelTwoWorkers.length)
    };
  }

  function syncFetchText(path) {
    var result = {
      attempted: false,
      ok: false,
      status: "NOT_ATTEMPTED",
      statusText: "NOT_ATTEMPTED",
      contentType: "UNKNOWN",
      byteLength: 0,
      text: "",
      error: "NONE"
    };

    if (!root.XMLHttpRequest) {
      result.status = "XMLHTTPREQUEST_UNAVAILABLE";
      result.statusText = "XMLHTTPREQUEST_UNAVAILABLE";
      result.error = "XMLHTTPREQUEST_UNAVAILABLE";
      return result;
    }

    try {
      result.attempted = true;

      var xhr = new root.XMLHttpRequest();
      xhr.open("GET", path + "?surfaceTruthProof=" + Date.now(), false);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.send(null);

      result.status = xhr.status;
      result.statusText = xhr.statusText || "";
      result.ok = xhr.status >= 200 && xhr.status < 300;
      result.contentType = xhr.getResponseHeader("content-type") || "UNKNOWN";
      result.text = xhr.responseText || "";
      result.byteLength = result.text.length;

      return result;
    } catch (error) {
      result.status = "FETCH_THROW";
      result.statusText = asString(error && error.message ? error.message : error);
      result.error = result.statusText;
      return result;
    }
  }

  function readRouteScriptInclusion(scope, registryObject) {
    var win = scope && scope.windowRef ? scope.windowRef : null;
    var doc = scope && scope.documentRef ? scope.documentRef : null;

    var scripts = [];
    var matches = [];

    if (doc && isFunction(doc.querySelectorAll)) {
      try {
        scripts = Array.prototype.slice.call(doc.scripts || []).map(function map(script) {
          return {
            src: script.src || "",
            type: script.type || "",
            async: Boolean(script.async),
            defer: Boolean(script.defer),
            nomodule: Boolean(script.noModule)
          };
        });

        matches = scripts.filter(function filter(script) {
          return script.src.indexOf(BISHOP_FILE) !== -1;
        });
      } catch (_error) {
        scripts = [];
        matches = [];
      }
    }

    var fetch = syncFetchText(BISHOP_FILE);
    var fetchText = fetch.text || "";

    var containsExpectedContract = fetchText.indexOf(BISHOP_EXPECTED_CONTRACT) !== -1;
    var containsAlias = fetchText.indexOf("HEARTH_CANVAS_BISHOP") !== -1;
    var containsPublishApi = fetchText.indexOf("publishApi") !== -1;
    var containsFileMarker = fetchText.indexOf("/assets/hearth/hearth.canvas.js") !== -1;

    var aliasNode = registryObject && registryObject.chapelOneHead ? registryObject.chapelOneHead : readNode(win, REGISTRY.chapelOneHead);
    var aliasPublished = Boolean(aliasNode && aliasNode.found);

    var loadedFlag = false;
    var contractFlag = "NONE";
    var versionFlag = "NONE";

    try {
      if (win) {
        loadedFlag = Boolean(win.__HEARTH_CANVAS_BISHOP_LOADED__);
        contractFlag = asString(win.__HEARTH_CANVAS_BISHOP_CONTRACT__ || "NONE");
        versionFlag = asString(win.__HEARTH_CANVAS_BISHOP_VERSION__ || "NONE");
      }
    } catch (_error2) {}

    var failureClass = "UNKNOWN";

    if (!win || !doc) {
      failureClass = "TARGET_ROUTE_NOT_ACCESSIBLE";
    } else if (!fetch.ok) {
      failureClass = "BISHOP_FILE_NOT_FETCHABLE";
    } else if (!containsExpectedContract || !containsAlias) {
      failureClass = "BISHOP_FILE_CONTENT_MISMATCH";
    } else if (!matches.length && !aliasPublished) {
      failureClass = "BISHOP_FILE_EXISTS_BUT_ROUTE_DOES_NOT_INCLUDE_SCRIPT";
    } else if (matches.length && !aliasPublished) {
      failureClass = "ROUTE_HAS_SCRIPT_BUT_ALIAS_NOT_PUBLISHED";
    } else if (!matches.length && aliasPublished) {
      failureClass = "BISHOP_ALIAS_PRESENT_WITHOUT_VISIBLE_SCRIPT_TAG";
    } else if (matches.length && aliasPublished) {
      failureClass = "BISHOP_INCLUDED_AND_ALIAS_PUBLISHED";
    }

    return {
      ROUTE_SCRIPT_INCLUSION_READER_ACTIVE: true,
      ROUTE_SCRIPT_INCLUSION_READER_STATUS: "READ_COMPLETE",

      BISHOP_FILE: BISHOP_FILE,
      BISHOP_EXPECTED_CONTRACT: BISHOP_EXPECTED_CONTRACT,

      BISHOP_SCRIPT_TAG_FOUND: Boolean(matches.length),
      BISHOP_SCRIPT_TAG_COUNT: matches.length,
      BISHOP_SCRIPT_SRC_MATCHES: matches,

      BISHOP_FILE_FETCH_ATTEMPTED: fetch.attempted,
      BISHOP_FILE_FETCH_OK: fetch.ok,
      BISHOP_FILE_FETCH_STATUS: fetch.status,
      BISHOP_FILE_FETCH_STATUS_TEXT: fetch.statusText,
      BISHOP_FILE_FETCH_CONTENT_TYPE: fetch.contentType,
      BISHOP_FILE_FETCH_BYTE_LENGTH: fetch.byteLength,
      BISHOP_FILE_FETCH_ERROR: fetch.error,

      BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT: containsExpectedContract,
      BISHOP_FILE_CONTENT_CONTAINS_ALIAS: containsAlias,
      BISHOP_FILE_CONTENT_CONTAINS_PUBLISH_API: containsPublishApi,
      BISHOP_FILE_CONTENT_CONTAINS_FILE_MARKER: containsFileMarker,
      BISHOP_FILE_CONTENT_FIRST_200: compact(fetchText.slice(0, 200), 300),

      BISHOP_ALIAS_PUBLISHED: aliasPublished,
      BISHOP_ALIAS_PATH: aliasNode ? aliasNode.aliasPath : "NONE",
      BISHOP_ALIAS_METHOD_COUNT: aliasNode ? aliasNode.methodCount : 0,
      BISHOP_ALIAS_CONTRACT: aliasNode ? aliasNode.contract : "UNKNOWN",
      BISHOP_ALIAS_RECEIPT: aliasNode ? aliasNode.receipt : "UNKNOWN",

      BISHOP_LOADED_FLAG: loadedFlag,
      BISHOP_CONTRACT_FLAG: contractFlag,
      BISHOP_VERSION_FLAG: versionFlag,

      BISHOP_LOAD_FAILURE_CLASS: failureClass
    };
  }

  function firstHeldCoordinate(surface, registry) {
    if (!surface.selectedScope) return "TARGET_DOCUMENT_SCOPE";
    if (!surface.selectedScope.canonicalMountFound) return "HEARTH_HTML_MOUNT_EXISTS";
    if (!surface.selectedScope.canonicalMountRectNonZero) return "HEARTH_HTML_MOUNT_RECT_NONZERO";
    if (!surface.selectedScope.canonicalCanvasFound) return "HEARTH_CANONICAL_CANVAS_EXISTS";
    if (!surface.selectedScope.canonicalCanvasRectNonZero) return "HEARTH_CANONICAL_CANVAS_RECT_NONZERO";
    if (!registry.chapelOneHead.found) return "CHAPEL_ONE_HEAD_PRESENT";
    if (!registry.chapelOnePriest.found) return "CHAPEL_ONE_PRIEST_PRESENT";
    if (registry.chapelOneWorkerCount < registry.chapelOneWorkerTotal) return "CHAPEL_ONE_WORKERS_COMPLETE";
    if (!registry.bridgeAuthority.found) return "BRIDGE_AUTHORITY_PRESENT";
    if (!registry.activeCrossingBridge.found) return "ACTIVE_CROSSING_BRIDGE_PRESENT";
    if (!registry.chapelTwoHead.found) return "CHAPEL_TWO_HEAD_PRESENT";
    if (!registry.chapelTwoPriest.found) return "CHAPEL_TWO_PRIEST_PRESENT";
    if (registry.chapelTwoWorkerCount < registry.chapelTwoWorkerTotal) return "CHAPEL_TWO_WORKERS_COMPLETE";
    if (!registry.bridgeReturn.found) return "BRIDGE_RETURN_PRESENT";
    return "NONE";
  }

  function statusFromHeld(held) {
    if (held === "TARGET_DOCUMENT_SCOPE") return "HELD_TARGET_DOCUMENT_SCOPE";
    if (held === "HEARTH_HTML_MOUNT_EXISTS") return "HELD_HTML_MOUNT_NOT_FOUND";
    if (held === "HEARTH_HTML_MOUNT_RECT_NONZERO") return "HELD_HTML_MOUNT_RECT_ZERO";
    if (held === "HEARTH_CANONICAL_CANVAS_EXISTS") return "HELD_CANONICAL_CANVAS_NOT_FOUND";
    if (held === "HEARTH_CANONICAL_CANVAS_RECT_NONZERO") return "HELD_CANONICAL_CANVAS_RECT_ZERO";
    if (held === "CHAPEL_ONE_HEAD_PRESENT") return "HELD_CHAPEL_ONE_HEAD_NOT_OBSERVED";
    if (held === "CHAPEL_ONE_PRIEST_PRESENT") return "HELD_CHAPEL_ONE_PRIEST_NOT_OBSERVED";
    if (held === "CHAPEL_ONE_WORKERS_COMPLETE") return "HELD_CHAPEL_ONE_WORKERS_INCOMPLETE";
    if (held === "BRIDGE_AUTHORITY_PRESENT") return "HELD_BRIDGE_AUTHORITY_NOT_OBSERVED";
    if (held === "ACTIVE_CROSSING_BRIDGE_PRESENT") return "HELD_ACTIVE_CROSSING_BRIDGE_NOT_OBSERVED";
    if (held === "CHAPEL_TWO_HEAD_PRESENT") return "HELD_CHAPEL_TWO_HEAD_NOT_OBSERVED";
    if (held === "CHAPEL_TWO_PRIEST_PRESENT") return "HELD_CHAPEL_TWO_PRIEST_NOT_OBSERVED";
    if (held === "CHAPEL_TWO_WORKERS_COMPLETE") return "HELD_CHAPEL_TWO_WORKERS_INCOMPLETE";
    if (held === "BRIDGE_RETURN_PRESENT") return "HELD_BRIDGE_RETURN_NOT_OBSERVED";
    return "CYCLE_READABLE";
  }

  function recommendedFileFromHeld(held) {
    if (held === "TARGET_DOCUMENT_SCOPE") return DIAGNOSTIC_ROUTE;
    if (held === "HEARTH_HTML_MOUNT_EXISTS") return "/showroom/globe/hearth/index.html";
    if (held === "HEARTH_HTML_MOUNT_RECT_NONZERO") return "/showroom/globe/hearth/index.html";
    if (held === "HEARTH_CANONICAL_CANVAS_EXISTS") return "/showroom/globe/hearth/index.js";
    if (held === "HEARTH_CANONICAL_CANVAS_RECT_NONZERO") return "/showroom/globe/hearth/index.css";
    if (held === "CHAPEL_ONE_HEAD_PRESENT") return "/assets/hearth/hearth.canvas.js";
    if (held === "CHAPEL_ONE_PRIEST_PRESENT") return "/assets/hearth/hearth.canvas.hand.inspect.js";
    if (held === "CHAPEL_ONE_WORKERS_COMPLETE") return "/assets/hearth/hearth.canvas.hand.geometry.js";
    if (held === "BRIDGE_AUTHORITY_PRESENT") return "/assets/hearth/hearth.hex.four-pair.authority.js";
    if (held === "ACTIVE_CROSSING_BRIDGE_PRESENT") return "/assets/hearth/hearth.hex.surface.js";
    if (held === "CHAPEL_TWO_HEAD_PRESENT") return "/assets/hearth/hearth.canvas.finger.surface.js";
    if (held === "CHAPEL_TWO_PRIEST_PRESENT") return "/assets/hearth/hearth.canvas.finger.inspect.js";
    if (held === "CHAPEL_TWO_WORKERS_COMPLETE") return "/assets/hearth/hearth.canvas.finger.mass.js";
    if (held === "BRIDGE_RETURN_PRESENT") return "/assets/hearth/hearth.hex.bridge.return.js";
    return FILE;
  }

  function recommendedActionFromHeld(held, scriptProof) {
    if (held === "TARGET_DOCUMENT_SCOPE") return "CONFIRM_TARGET_IFRAME_DOCUMENT_SCOPE";
    if (held === "HEARTH_HTML_MOUNT_EXISTS") return "RESTORE_HEARTH_HTML_MOUNT";
    if (held === "HEARTH_HTML_MOUNT_RECT_NONZERO") return "SETTLE_HEARTH_HTML_MOUNT_LAYOUT";
    if (held === "HEARTH_CANONICAL_CANVAS_EXISTS") return "RESTORE_ROUTE_NEIGHBOR_JS_TO_ATTACH_PLACEMENT_CANVAS";
    if (held === "HEARTH_CANONICAL_CANVAS_RECT_NONZERO") return "RESTORE_CANVAS_LAYOUT_DIMENSIONS";
    if (held === "CHAPEL_ONE_HEAD_PRESENT") {
      if (scriptProof && scriptProof.BISHOP_LOAD_FAILURE_CLASS) return "RESOLVE_" + scriptProof.BISHOP_LOAD_FAILURE_CLASS;
      return "LOAD_OR_RENEW_CANVAS_BISHOP_STANDARD";
    }
    if (held === "CHAPEL_ONE_PRIEST_PRESENT") return "LOAD_OR_RENEW_CHAPEL_ONE_PRIEST";
    if (held === "CHAPEL_ONE_WORKERS_COMPLETE") return "LOAD_OR_RENEW_CHAPEL_ONE_HANDS";
    if (held === "BRIDGE_AUTHORITY_PRESENT") return "LOAD_OR_RENEW_BRIDGE_AUTHORITY";
    if (held === "ACTIVE_CROSSING_BRIDGE_PRESENT") return "LOAD_OR_RENEW_ACTIVE_CROSSING_BRIDGE";
    if (held === "CHAPEL_TWO_HEAD_PRESENT") return "LOAD_OR_RENEW_CHAPEL_TWO_HEAD";
    if (held === "CHAPEL_TWO_PRIEST_PRESENT") return "LOAD_OR_RENEW_CHAPEL_TWO_PRIEST";
    if (held === "CHAPEL_TWO_WORKERS_COMPLETE") return "LOAD_OR_RENEW_CHAPEL_TWO_WORKERS";
    if (held === "BRIDGE_RETURN_PRESENT") return "LOAD_OR_RENEW_BRIDGE_RETURN";
    return "CONTINUE_TWO_CHAPEL_CYCLE";
  }

  function inspectSurfaceTruth() {
    var scopes = collectDocumentScopes();
    var selectedScope = selectBestScope(scopes);

    return {
      scopes: scopes.map(serialScope),
      selectedScope: serialScope(selectedScope),
      selectedScopeRaw: selectedScope,
      targetFrameDocumentScopeStatus: selectedScope ? "TARGET_DOCUMENT_SCOPE_RESOLVED" : "TARGET_DOCUMENT_SCOPE_NOT_RESOLVED",
      targetAccessStatus: selectedScope && selectedScope.routeMatch ? "TARGET_HEARTH_ROUTE_DOCUMENT_READABLE" : "TARGET_HEARTH_ROUTE_DOCUMENT_NOT_CONFIRMED"
    };
  }

  function composePacket() {
    var generatedAt = nowIso();
    var surface = inspectSurfaceTruth();
    var selected = surface.selectedScopeRaw;
    var registry = readRegistry(selected);
    var scriptProof = readRouteScriptInclusion(selected, registry);

    var held = firstHeldCoordinate(surface, registry);
    var cycleStatus = statusFromHeld(held);
    var nextFile = recommendedFileFromHeld(held);
    var nextAction = recommendedActionFromHeld(held, scriptProof);

    var packet = {
      PACKET: "HEARTH_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_PACKET_v5_2",
      PACKET_NAME: "HEARTH_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_PACKET_v5_2",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      MODE: "GET_RECEIPT",
      ROLE: "CANVAS_TRUTH_PROBE",
      COMPONENT: "SURFACE_TRUTH",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: generatedAt,
      UPDATED_AT: generatedAt,

      SYSTEM_CANON: SYSTEM_CANON,
      SYSTEM_MODEL: SYSTEM_MODEL,
      LINEAR_CHAIN: false,
      LAUNCH_LAYER_REMOVED: true,
      REMOVED_FILE: "/assets/hearth/hearth.canvas.launch.js",

      GRID_16X16_PURPOSE: "STRUCTURAL_STATE_TRUTH_256_STATES",
      GRID_19X19_PURPOSE: "CHRONOLOGY_AUDIT_MAP_361_COORDINATES",

      CYCLE: CYCLE_TEXT,

      ACTIVE_LANE: "LANE_1_PLACEMENT_GLOBE",
      ACTIVE_PLATFORM_STATE: "PLACEMENT_GLOBE",
      PLACEHOLDER_ONLY: true,
      EXPRESSION_ACCEPTED: false,

      RUN_STATE: "CANONICAL_TWO_CHAPEL_CYCLE_ROUTE_SCRIPT_INCLUSION_READ_COMPLETE",
      TRUST_STATE: cycleStatus === "CYCLE_READABLE" ? "CYCLE_READABLE" : "CYCLE_RETURNED_WITH_HOLD",
      BLOCKING: false,

      CYCLE_STATUS: cycleStatus,
      FIRST_HELD_COORDINATE: held,
      FIRST_FAILED_COORDINATE: held,
      RECOMMENDED_NEXT_FILE: nextFile,
      RECOMMENDED_NEXT_ACTION: nextAction,

      TARGET_FRAME_DOCUMENT_SCOPE_STATUS: surface.targetFrameDocumentScopeStatus,
      TARGET_ACCESS_STATUS: surface.targetAccessStatus,

      SELECTED_DOCUMENT_SCOPE: surface.selectedScope ? surface.selectedScope.label : "NONE",
      SELECTED_DOCUMENT_PATH: surface.selectedScope ? surface.selectedScope.path : "UNKNOWN",
      SELECTED_DOCUMENT_TITLE: surface.selectedScope ? surface.selectedScope.title : "UNKNOWN",
      SELECTED_DOCUMENT_ROUTE_MATCH: surface.selectedScope ? surface.selectedScope.routeMatch : false,
      SELECTED_DOCUMENT_DIAGNOSTIC_MATCH: surface.selectedScope ? surface.selectedScope.diagnosticMatch : false,

      CANONICAL_MOUNT_EXISTS: surface.selectedScope ? surface.selectedScope.canonicalMountFound : false,
      CANONICAL_MOUNT_DESCRIPTOR: surface.selectedScope ? surface.selectedScope.canonicalMountDescriptor : "NONE",
      CANONICAL_MOUNT_RECT: surface.selectedScope ? surface.selectedScope.canonicalMountRect : rectOf(null),
      CANONICAL_MOUNT_RECT_NONZERO: surface.selectedScope ? surface.selectedScope.canonicalMountRectNonZero : false,

      CANONICAL_CANVAS_EXISTS: surface.selectedScope ? surface.selectedScope.canonicalCanvasFound : false,
      CANONICAL_CANVAS_DESCRIPTOR: surface.selectedScope ? surface.selectedScope.canonicalCanvasDescriptor : "NONE",
      CANONICAL_CANVAS_RECT: surface.selectedScope ? surface.selectedScope.canonicalCanvasRect : rectOf(null),
      CANONICAL_CANVAS_RECT_NONZERO: surface.selectedScope ? surface.selectedScope.canonicalCanvasRectNonZero : false,

      CHAPEL_ONE_HEAD_PRESENT: registry.chapelOneHead.found,
      CHAPEL_ONE_HEAD_ALIAS: registry.chapelOneHead.aliasPath,
      CHAPEL_ONE_HEAD_STATUS: registry.chapelOneHead.componentStatus,

      CHAPEL_ONE_PRIEST_PRESENT: registry.chapelOnePriest.found,
      CHAPEL_ONE_PRIEST_ALIAS: registry.chapelOnePriest.aliasPath,

      CHAPEL_ONE_WORKER_COUNT: registry.chapelOneWorkerCount,
      CHAPEL_ONE_WORKER_TOTAL: registry.chapelOneWorkerTotal,
      CHAPEL_ONE_COMPLETE: registry.chapelOneComplete,

      BRIDGE_AUTHORITY_PRESENT: registry.bridgeAuthority.found,
      BRIDGE_AUTHORITY_ALIAS: registry.bridgeAuthority.aliasPath,

      ACTIVE_CROSSING_BRIDGE_PRESENT: registry.activeCrossingBridge.found,
      ACTIVE_CROSSING_BRIDGE_ALIAS: registry.activeCrossingBridge.aliasPath,
      ACTIVE_CROSSING_BRIDGE_STATUS: registry.activeCrossingBridge.componentStatus,

      CHAPEL_TWO_HEAD_PRESENT: registry.chapelTwoHead.found,
      CHAPEL_TWO_HEAD_ALIAS: registry.chapelTwoHead.aliasPath,
      CHAPEL_TWO_HEAD_STATUS: registry.chapelTwoHead.componentStatus,

      CHAPEL_TWO_PRIEST_PRESENT: registry.chapelTwoPriest.found,
      CHAPEL_TWO_PRIEST_ALIAS: registry.chapelTwoPriest.aliasPath,

      CHAPEL_TWO_WORKER_COUNT: registry.chapelTwoWorkerCount,
      CHAPEL_TWO_WORKER_TOTAL: registry.chapelTwoWorkerTotal,
      CHAPEL_TWO_COMPLETE: registry.chapelTwoComplete,

      BRIDGE_RETURN_PRESENT: registry.bridgeReturn.found,
      BRIDGE_RETURN_ALIAS: registry.bridgeReturn.aliasPath,
      BRIDGE_RETURN_STATUS: registry.bridgeReturn.componentStatus,

      ROUTE_SCRIPT_INCLUSION_READER_ACTIVE: scriptProof.ROUTE_SCRIPT_INCLUSION_READER_ACTIVE,
      ROUTE_SCRIPT_INCLUSION_READER_STATUS: scriptProof.ROUTE_SCRIPT_INCLUSION_READER_STATUS,

      BISHOP_FILE: scriptProof.BISHOP_FILE,
      BISHOP_EXPECTED_CONTRACT: scriptProof.BISHOP_EXPECTED_CONTRACT,

      BISHOP_SCRIPT_TAG_FOUND: scriptProof.BISHOP_SCRIPT_TAG_FOUND,
      BISHOP_SCRIPT_TAG_COUNT: scriptProof.BISHOP_SCRIPT_TAG_COUNT,
      BISHOP_SCRIPT_SRC_MATCHES: scriptProof.BISHOP_SCRIPT_SRC_MATCHES,

      BISHOP_FILE_FETCH_ATTEMPTED: scriptProof.BISHOP_FILE_FETCH_ATTEMPTED,
      BISHOP_FILE_FETCH_OK: scriptProof.BISHOP_FILE_FETCH_OK,
      BISHOP_FILE_FETCH_STATUS: scriptProof.BISHOP_FILE_FETCH_STATUS,
      BISHOP_FILE_FETCH_STATUS_TEXT: scriptProof.BISHOP_FILE_FETCH_STATUS_TEXT,
      BISHOP_FILE_FETCH_CONTENT_TYPE: scriptProof.BISHOP_FILE_FETCH_CONTENT_TYPE,
      BISHOP_FILE_FETCH_BYTE_LENGTH: scriptProof.BISHOP_FILE_FETCH_BYTE_LENGTH,
      BISHOP_FILE_FETCH_ERROR: scriptProof.BISHOP_FILE_FETCH_ERROR,

      BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT: scriptProof.BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT,
      BISHOP_FILE_CONTENT_CONTAINS_ALIAS: scriptProof.BISHOP_FILE_CONTENT_CONTAINS_ALIAS,
      BISHOP_FILE_CONTENT_CONTAINS_PUBLISH_API: scriptProof.BISHOP_FILE_CONTENT_CONTAINS_PUBLISH_API,
      BISHOP_FILE_CONTENT_CONTAINS_FILE_MARKER: scriptProof.BISHOP_FILE_CONTENT_CONTAINS_FILE_MARKER,
      BISHOP_FILE_CONTENT_FIRST_200: scriptProof.BISHOP_FILE_CONTENT_FIRST_200,

      BISHOP_ALIAS_PUBLISHED: scriptProof.BISHOP_ALIAS_PUBLISHED,
      BISHOP_ALIAS_PATH: scriptProof.BISHOP_ALIAS_PATH,
      BISHOP_ALIAS_METHOD_COUNT: scriptProof.BISHOP_ALIAS_METHOD_COUNT,
      BISHOP_ALIAS_CONTRACT: scriptProof.BISHOP_ALIAS_CONTRACT,
      BISHOP_ALIAS_RECEIPT: scriptProof.BISHOP_ALIAS_RECEIPT,

      BISHOP_LOADED_FLAG: scriptProof.BISHOP_LOADED_FLAG,
      BISHOP_CONTRACT_FLAG: scriptProof.BISHOP_CONTRACT_FLAG,
      BISHOP_VERSION_FLAG: scriptProof.BISHOP_VERSION_FLAG,

      BISHOP_LOAD_FAILURE_CLASS: scriptProof.BISHOP_LOAD_FAILURE_CLASS,

      REGISTRY_OBJECT: registry,
      SURFACE_TRUTH_OBJECT: {
        scopes: surface.scopes,
        selectedScope: surface.selectedScope,
        targetFrameDocumentScopeStatus: surface.targetFrameDocumentScopeStatus,
        targetAccessStatus: surface.targetAccessStatus
      },
      ROUTE_SCRIPT_INCLUSION_OBJECT: scriptProof,

      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_THIS_AS_EVIDENCE: true,
      TRUTH_PROBE_IS_READER_ONLY: true,
      CHAPEL_MEMBER: false,
      MISSIONARY_SUPPORT_COUNTED_AS_CHAPEL_MEMBER: false,

      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,ROUTE_RENDERER"
    };

    Object.keys(NO_CLAIMS).forEach(function each(key) {
      packet[key] = NO_CLAIMS[key];
    });

    return packet;
  }

  function getPacket() {
    return composePacket();
  }

  function getReport() {
    return composePacket();
  }

  function getReceipt() {
    return composePacket();
  }

  function inspect() {
    return composePacket();
  }

  function measure() {
    return composePacket();
  }

  function read() {
    return composePacket();
  }

  function run() {
    return composePacket();
  }

  function runDiagnostic() {
    return composePacket();
  }

  function getState() {
    return composePacket();
  }

  function getStatus() {
    var packet = composePacket();

    return {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      SYSTEM_CANON: SYSTEM_CANON,
      SYSTEM_MODEL: SYSTEM_MODEL,
      CYCLE_STATUS: packet.CYCLE_STATUS,
      FIRST_HELD_COORDINATE: packet.FIRST_HELD_COORDINATE,
      RECOMMENDED_NEXT_FILE: packet.RECOMMENDED_NEXT_FILE,
      RECOMMENDED_NEXT_ACTION: packet.RECOMMENDED_NEXT_ACTION,
      TARGET_ACCESS_STATUS: packet.TARGET_ACCESS_STATUS,
      CANONICAL_MOUNT_EXISTS: packet.CANONICAL_MOUNT_EXISTS,
      CANONICAL_MOUNT_RECT_NONZERO: packet.CANONICAL_MOUNT_RECT_NONZERO,
      CANONICAL_CANVAS_EXISTS: packet.CANONICAL_CANVAS_EXISTS,
      CANONICAL_CANVAS_RECT_NONZERO: packet.CANONICAL_CANVAS_RECT_NONZERO,
      CHAPEL_ONE_HEAD_PRESENT: packet.CHAPEL_ONE_HEAD_PRESENT,
      BISHOP_SCRIPT_TAG_FOUND: packet.BISHOP_SCRIPT_TAG_FOUND,
      BISHOP_FILE_FETCH_OK: packet.BISHOP_FILE_FETCH_OK,
      BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT: packet.BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT,
      BISHOP_ALIAS_PUBLISHED: packet.BISHOP_ALIAS_PUBLISHED,
      BISHOP_LOAD_FAILURE_CLASS: packet.BISHOP_LOAD_FAILURE_CLASS,
      UPDATED_AT: nowIso()
    };
  }

  function getReceiptLight() {
    return getStatus();
  }

  function toPacketText(packet) {
    var source = packet || composePacket();

    return Object.keys(source).map(function line(key) {
      var value = source[key];

      if (value === undefined || value === null || value === "") value = "UNKNOWN";
      else if (isFunction(value)) value = "[function]";
      else if (isObject(value) || Array.isArray(value)) {
        try { value = JSON.stringify(value); }
        catch (_error) { value = "[object]"; }
      }

      return key + "=" + compact(value, 40000);
    }).join("\n");
  }

  function getPacketText() {
    return toPacketText(composePacket());
  }

  function getSummary() {
    var packet = composePacket();

    return {
      status: packet.CYCLE_STATUS,
      firstHeldCoordinate: packet.FIRST_HELD_COORDINATE,
      recommendedNextFile: packet.RECOMMENDED_NEXT_FILE,
      recommendedNextAction: packet.RECOMMENDED_NEXT_ACTION,
      bishopLoadFailureClass: packet.BISHOP_LOAD_FAILURE_CLASS,
      bishopScriptTagFound: packet.BISHOP_SCRIPT_TAG_FOUND,
      bishopFileFetchOk: packet.BISHOP_FILE_FETCH_OK,
      bishopContentMatchesExpectedContract: packet.BISHOP_FILE_CONTENT_MATCHES_EXPECTED_CONTRACT,
      bishopAliasPublished: packet.BISHOP_ALIAS_PUBLISHED
    };
  }

  function publishApi() {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");

    var api = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,

      SYSTEM_CANON: SYSTEM_CANON,
      SYSTEM_MODEL: SYSTEM_MODEL,

      run: run,
      runDiagnostic: runDiagnostic,
      inspect: inspect,
      measure: measure,
      read: read,

      getReport: getReport,
      getReceipt: getReceipt,
      getReceiptLight: getReceiptLight,
      getStatus: getStatus,
      getState: getState,
      getPacket: getPacket,
      getPacketText: getPacketText,
      getSummary: getSummary,
      toPacketText: toPacketText,

      readRegistry: function exposedReadRegistry() {
        var scopes = collectDocumentScopes();
        var selected = selectBestScope(scopes);
        return readRegistry(selected);
      },

      inspectSurfaceTruth: function exposedInspectSurfaceTruth() {
        var surface = inspectSurfaceTruth();
        return {
          scopes: surface.scopes,
          selectedScope: surface.selectedScope,
          targetFrameDocumentScopeStatus: surface.targetFrameDocumentScopeStatus,
          targetAccessStatus: surface.targetAccessStatus
        };
      },

      collectDocumentScopes: function exposedCollectDocumentScopes() {
        return collectDocumentScopes().map(serialScope);
      },

      readRouteScriptInclusion: function exposedReadRouteScriptInclusion() {
        var scopes = collectDocumentScopes();
        var selected = selectBestScope(scopes);
        var registry = readRegistry(selected);
        return readRouteScriptInclusion(selected, registry);
      },

      runRouteScriptInclusionProof: function exposedRouteScriptInclusionProof() {
        return this.readRouteScriptInclusion();
      }
    };

    var aliases = [
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

    aliases.forEach(function publish(alias) {
      setPathOn(root, alias, api);
    });

    root.__HEARTH_SURFACE_TRUTH_PROBE_LOADED__ = true;
    root.__HEARTH_SURFACE_TRUTH_PROBE_CONTRACT__ = CONTRACT;
    root.__HEARTH_SURFACE_TRUTH_PROBE_VERSION__ = VERSION;

    return api;
  }

  publishApi();
})(typeof window !== "undefined" ? window : globalThis);
