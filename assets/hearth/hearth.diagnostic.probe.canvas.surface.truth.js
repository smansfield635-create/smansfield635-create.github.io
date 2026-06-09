// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_READER_TNT_v5_1
// Full-file replacement.
// Diagnostic reader only.
// Owns: canonical alias registry reading, two-chapel cycle inspection, mount/surface truth measurement,
// lane classification, first-held-coordinate reporting.
// Does not own: production mutation, canvas repair, canvas build, canvas release, controls,
// runtime restart, route repair, final visual pass, generated image, GraphicBox, WebGL.

(function hearthCanvasSurfaceTruthCanonicalRegistryReader(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_READER_TNT_v5_1";
  var RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_READER_RECEIPT_v5_1";
  var PREVIOUS_CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TARGET_IFRAME_BISHOP_RESOLVER_TNT_v4_3";

  var VERSION = "2026-06-09.hearth-canvas-surface-truth-canonical-two-chapel-cycle-registry-reader-v5-1";
  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var ROLE = "CANVAS_TRUTH_PROBE";
  var COMPONENT = "SURFACE_TRUTH";
  var AUTHORITY_PATH = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH";

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

  var REGISTRY = {
    diagnosticUpline: {
      file: FILE,
      role: "Canvas Truth Probe / Registry Reader",
      chapelMember: false,
      primaryAlias: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      aliases: [
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
        "HEARTH.diagnosticProbeCanvasSurfaceTruth",
        "HEARTH.canvasSurfaceTruthProbe",
        "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
        "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        "DEXTER_LAB.canvasSurfaceTruthProbe",
        "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
      ]
    },

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
      ],
      readerMethods: ["measure", "run", "runDiagnostic", "inspect", "read", "getReceipt", "getReceiptLight", "getStatus", "getState"],
      receiverMethods: ["receiveHandReceipt", "acceptBridgeReturnPacket", "receiveBridgeReturnPacket", "composePlatformPacket"]
    },

    chapelOnePriest: {
      file: "/assets/hearth/hearth.canvas.hand.inspect.js",
      role: "Chapel One Priest / Inspect Hand",
      chapel: "CHAPEL_ONE",
      chapelMember: true,
      primaryAlias: "HEARTH_CANVAS_HAND_INSPECT",
      aliases: ["HEARTH_CANVAS_HAND_INSPECT", "HEARTH.canvasHandInspect", "DEXTER_LAB.hearthCanvasHandInspect"]
    },

    chapelOneWorkers: [
      {
        key: "geometry",
        file: "/assets/hearth/hearth.canvas.hand.geometry.js",
        role: "Geometry Hand",
        primaryAlias: "HEARTH_CANVAS_HAND_GEOMETRY",
        aliases: ["HEARTH_CANVAS_HAND_GEOMETRY", "HEARTH.canvasHandGeometry", "DEXTER_LAB.hearthCanvasHandGeometry"]
      },
      {
        key: "context",
        file: "/assets/hearth/hearth.canvas.hand.context.js",
        role: "Context Hand",
        primaryAlias: "HEARTH_CANVAS_HAND_CONTEXT",
        aliases: ["HEARTH_CANVAS_HAND_CONTEXT", "HEARTH.canvasHandContext", "DEXTER_LAB.hearthCanvasHandContext"]
      },
      {
        key: "paint",
        file: "/assets/hearth/hearth.canvas.hand.paint.js",
        role: "Paint Hand",
        primaryAlias: "HEARTH_CANVAS_HAND_PAINT",
        aliases: ["HEARTH_CANVAS_HAND_PAINT", "HEARTH.canvasHandPaint", "DEXTER_LAB.hearthCanvasHandPaint"]
      },
      {
        key: "view",
        file: "/assets/hearth/hearth.canvas.hand.view.js",
        role: "View Hand",
        primaryAlias: "HEARTH_CANVAS_HAND_VIEW",
        aliases: ["HEARTH_CANVAS_HAND_VIEW", "HEARTH.canvasHandView", "DEXTER_LAB.hearthCanvasHandView"]
      }
    ],

    bridgeAuthority: {
      file: "/assets/hearth/hearth.hex.four-pair.authority.js",
      role: "3D Authority / Tuple Truth",
      chapelMember: false,
      primaryAlias: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
        "HEARTH.hexFourPair3dAuthority",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexAuthority",
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "DEXTER_LAB.hearthHexFourPair3dAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority"
      ]
    },

    activeCrossingBridge: {
      file: "/assets/hearth/hearth.hex.surface.js",
      role: "Active Chapel Bridge / Chapel One to Chapel Two Transmission",
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
      ],
      receiverMethods: [
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket",
        "acceptCanvasHexGatePacket",
        "receiveCanvasViewPacket",
        "receiveChapel1Packet",
        "receive"
      ]
    },

    bridgeReturn: {
      file: "/assets/hearth/hearth.hex.bridge.return.js",
      role: "Bridge Return / Chapel Two to Chapel One Return Authority",
      chapelMember: false,
      primaryAlias: "HEARTH_HEX_BRIDGE_RETURN",
      aliases: [
        "HEARTH_HEX_BRIDGE_RETURN",
        "HEARTH.hexBridgeReturn",
        "HEARTH.bridgeReturn",
        "HEARTH_BRIDGE_RETURN",
        "DEXTER_LAB.hearthHexBridgeReturn",
        "DEXTER_LAB.hearthBridgeReturn"
      ],
      receiverMethods: [
        "receiveChapelTwoPacket",
        "receiveFingerSurfacePacket",
        "receiveExpressionPacket",
        "receive"
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
      ],
      receiverMethods: [
        "receiveHexSurface3dTransmissionPacket",
        "receiveChapelBridgePacket",
        "receiveFingerSurfacePacket",
        "receive"
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
      ["mass", "HEARTH_CANVAS_FINGER_MASS", "/assets/hearth/hearth.canvas.finger.mass.js"],
      ["elevation", "HEARTH_CANVAS_FINGER_ELEVATION", "/assets/hearth/hearth.canvas.finger.elevation.js"],
      ["landform", "HEARTH_CANVAS_FINGER_LANDFORM", "/assets/hearth/hearth.canvas.finger.landform.js"],
      ["hydrology", "HEARTH_CANVAS_FINGER_HYDROLOGY", "/assets/hearth/hearth.canvas.finger.hydrology.js"],
      ["material", "HEARTH_CANVAS_FINGER_MATERIAL", "/assets/hearth/hearth.canvas.finger.material.js"],
      ["light", "HEARTH_CANVAS_FINGER_LIGHT", "/assets/hearth/hearth.canvas.finger.light.js"],
      ["lighting", "HEARTH_CANVAS_FINGER_LIGHTING", "/assets/hearth/hearth.canvas.finger.lighting.js"],
      ["atmosphere", "HEARTH_CANVAS_FINGER_ATMOSPHERE", "/assets/hearth/hearth.canvas.finger.atmosphere.js"],
      ["composition", "HEARTH_CANVAS_FINGER_COMPOSITION", "/assets/hearth/hearth.canvas.finger.composition.js"],
      ["boundary", "HEARTH_CANVAS_FINGER_BOUNDARY", "/assets/hearth/hearth.canvas.finger.boundary.js"]
    ].map(function makeWorker(item) {
      var key = item[0];
      var upper = key.charAt(0).toUpperCase() + key.slice(1);
      return {
        key: key,
        file: item[2],
        role: upper + " Finger",
        primaryAlias: item[1],
        aliases: [
          item[1],
          "HEARTH.canvasFinger" + upper,
          "HEARTH.pointerFinger" + upper,
          "DEXTER_LAB.hearthCanvasFinger" + upper
        ]
      };
    })
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
    if (limit === undefined) limit = 8000;
    return asString(value).replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return Object.assign({}, value);
      return value;
    }
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

  function ensureNamespace(name) {
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function safeDocumentWindow(targetDoc) {
    try { return targetDoc && targetDoc.defaultView ? targetDoc.defaultView : null; }
    catch (_error) { return null; }
  }

  function frameDocument(frame) {
    try { if (frame && frame.contentDocument) return frame.contentDocument; } catch (_error) {}
    try { if (frame && frame.contentWindow && frame.contentWindow.document) return frame.contentWindow.document; } catch (_error2) {}
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

  function collectDocumentScopes() {
    var scopes = [];
    var seenDocs = [];

    function addScope(label, targetDoc, sourceKind) {
      if (!targetDoc) return;
      for (var i = 0; i < seenDocs.length; i += 1) if (seenDocs[i] === targetDoc) return;
      seenDocs.push(targetDoc);
      scopes.push({
        label: label,
        sourceKind: sourceKind,
        doc: targetDoc,
        win: safeDocumentWindow(targetDoc),
        path: documentPath(targetDoc),
        href: documentHref(targetDoc),
        title: documentTitle(targetDoc)
      });
    }

    function addFrames(baseLabel, targetDoc) {
      if (!targetDoc || !isFunction(targetDoc.querySelectorAll)) return;
      var frames = [];
      try { frames = Array.prototype.slice.call(targetDoc.querySelectorAll("iframe")); }
      catch (_error) { frames = []; }

      frames.forEach(function eachFrame(frame, index) {
        addScope(baseLabel + ".iframe[" + index + "]", frameDocument(frame), "IFRAME_DOCUMENT");
      });
    }

    addScope("current.document", doc, "CURRENT_DOCUMENT");
    addFrames("current.document", doc);

    try {
      if (root.parent && root.parent !== root && root.parent.document) {
        addScope("parent.document", root.parent.document, "PARENT_DOCUMENT");
        addFrames("parent.document", root.parent.document);
      }
    } catch (_error2) {}

    try {
      if (root.top && root.top !== root && root.top.document) {
        addScope("top.document", root.top.document, "TOP_DOCUMENT");
        addFrames("top.document", root.top.document);
      }
    } catch (_error3) {}

    return scopes;
  }

  function collectWindows() {
    var windows = [];
    var seen = [];

    function add(label, win) {
      if (!win) return;
      for (var i = 0; i < seen.length; i += 1) if (seen[i] === win) return;
      seen.push(win);
      windows.push({ label: label, win: win });
    }

    add("diagnostic.window", root);

    collectDocumentScopes().forEach(function eachScope(scope) {
      add(scope.label + ".window", scope.win);
    });

    return windows;
  }

  function firstGlobal(paths) {
    var windows = collectWindows();

    for (var w = 0; w < windows.length; w += 1) {
      for (var p = 0; p < paths.length; p += 1) {
        var value = readPathFrom(windows[w].win, paths[p]);
        if (value && (isObject(value) || isFunction(value))) {
          return {
            found: true,
            path: paths[p],
            windowLabel: windows[w].label,
            value: value
          };
        }
      }
    }

    return { found: false, path: "NONE", windowLabel: "NONE", value: null };
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

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    var methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport", "inspect", "measure"];
    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];
      if (!isFunction(authority[method])) continue;
      try {
        var out = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(out)) return out;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;
    return {};
  }

  function readNode(node) {
    var found = firstGlobal(node.aliases || []);
    var receipt = readReceipt(found.value);
    var keys = methodKeys(found.value);

    return {
      file: node.file,
      role: node.role,
      chapel: node.chapel || "NONE",
      chapelMember: Boolean(node.chapelMember),
      primaryAlias: node.primaryAlias,
      found: found.found,
      aliasPath: found.path,
      windowLabel: found.windowLabel,
      valueType: found.found ? typeof found.value : "undefined",
      methodCount: keys.length,
      methodKeys: keys.join(","),
      contract: asString(receipt.contract || receipt.CONTRACT || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: asString(receipt.receipt || receipt.RECEIPT || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: asString(receipt.componentStatus || receipt.status || receipt.postgameStatus || (found.found ? "OBSERVED" : "NOT_OBSERVED")),
      firstFailedCoordinate: asString(receipt.firstFailedCoordinate || receipt.FIRST_FAILED_COORDINATE || "UNKNOWN"),
      recommendedNextFile: asString(receipt.recommendedNextFile || receipt.RECOMMENDED_NEXT_FILE || node.file),
      recommendedNextAction: asString(receipt.recommendedNextAction || receipt.RECOMMENDED_NEXT_ACTION || "UNKNOWN"),
      rawReceipt: receipt
    };
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
    try { id = element.id ? "#" + element.id : ""; } catch (_error2) {}
    try {
      cls = typeof element.className === "string" && element.className
        ? "." + element.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error3) {}

    return compact(tag + id + cls, 400);
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

    var score = 0;
    if (routeMatch && !diagnosticMatch) score += 100;
    if (mount) score += 50;
    if (canvas) score += 35;
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
    return inspections.slice().sort(function sort(a, b) { return b.score - a.score; })[0];
  }

  function readRegistry() {
    var chapelOneHead = readNode(REGISTRY.chapelOneHead);
    var chapelOnePriest = readNode(REGISTRY.chapelOnePriest);
    var chapelOneWorkers = REGISTRY.chapelOneWorkers.map(readNode);

    var bridgeAuthority = readNode(REGISTRY.bridgeAuthority);
    var activeCrossingBridge = readNode(REGISTRY.activeCrossingBridge);
    var bridgeReturn = readNode(REGISTRY.bridgeReturn);

    var chapelTwoHead = readNode(REGISTRY.chapelTwoHead);
    var chapelTwoPriest = readNode(REGISTRY.chapelTwoPriest);
    var chapelTwoWorkers = REGISTRY.chapelTwoWorkers.map(readNode);

    return {
      chapelOneHead: chapelOneHead,
      chapelOnePriest: chapelOnePriest,
      chapelOneWorkers: chapelOneWorkers,
      bridgeAuthority: bridgeAuthority,
      activeCrossingBridge: activeCrossingBridge,
      bridgeReturn: bridgeReturn,
      chapelTwoHead: chapelTwoHead,
      chapelTwoPriest: chapelTwoPriest,
      chapelTwoWorkers: chapelTwoWorkers
    };
  }

  function countFound(list) {
    return list.filter(function found(item) { return item.found; }).length;
  }

  function classifyLane(registry) {
    var headReceipt = registry.chapelOneHead.rawReceipt || {};
    var returnReceipt = registry.bridgeReturn.rawReceipt || {};

    var expressionAccepted =
      asBool(headReceipt.expressionAccepted) ||
      asBool(headReceipt.expressionAuthorized) ||
      asBool(returnReceipt.expressionAuthorized) ||
      asBool(returnReceipt.globeReleasePathComplete) ||
      asBool(returnReceipt.GLOBE_RELEASE_PATH_COMPLETE);

    if (expressionAccepted) {
      return {
        activeLane: "LANE_2_EXPRESSION_GLOBE",
        activePlatformState: "EXPRESSION_GLOBE",
        placeholderOnly: false,
        expressionAccepted: true
      };
    }

    return {
      activeLane: "LANE_1_PLACEMENT_GLOBE",
      activePlatformState: "PLACEMENT_GLOBE",
      placeholderOnly: true,
      expressionAccepted: false
    };
  }

  function classifyCycle(registry, surface) {
    var c1WorkersFound = countFound(registry.chapelOneWorkers);
    var c2WorkersFound = countFound(registry.chapelTwoWorkers);

    if (!surface || !surface.canonicalMountFound) {
      return ["HELD_HTML_MOUNT", "HEARTH_HTML_MOUNT_PRESENT", "/showroom/globe/hearth/index.html", "RENEW_HEARTH_HTML_ROUTE_WITH_HEARTH_CANVAS_MOUNT"];
    }

    if (!surface.canonicalMountRectNonZero) {
      return ["HELD_HTML_MOUNT_RECT_ZERO", "HEARTH_HTML_MOUNT_RECT_NONZERO", "/showroom/globe/hearth/index.html", "SETTLE_HEARTH_HTML_MOUNT_LAYOUT"];
    }

    if (!registry.chapelOneHead.found) {
      return ["HELD_CHAPEL_ONE_HEAD", "CHAPEL_ONE_HEAD_PRESENT", REGISTRY.chapelOneHead.file, "LOAD_OR_RENEW_CHAPEL_ONE_HEAD_CANVAS_BISHOP"];
    }

    if (!surface.canonicalCanvasFound) {
      return ["HELD_SHARED_CANVAS", "CHAPEL_ONE_SHARED_CANVAS_PRESENT", REGISTRY.chapelOneHead.file, "ALLOW_CHAPEL_ONE_HEAD_TO_ATTACH_SHARED_CANVAS"];
    }

    if (!surface.canonicalCanvasRectNonZero) {
      return ["HELD_SHARED_CANVAS_RECT_ZERO", "CHAPEL_ONE_SHARED_CANVAS_RECT_NONZERO", REGISTRY.chapelOneHead.file, "SETTLE_SHARED_CANVAS_RECT"];
    }

    if (c1WorkersFound < registry.chapelOneWorkers.length) {
      var missingC1 = registry.chapelOneWorkers.filter(function missing(item) { return !item.found; })[0];
      return ["HELD_CHAPEL_ONE_WORKER", "CHAPEL_ONE_WORKER_PRESENT_" + missingC1.primaryAlias, missingC1.file, "LOAD_OR_RENEW_" + missingC1.primaryAlias];
    }

    if (!registry.chapelOnePriest.found) {
      return ["HELD_CHAPEL_ONE_PRIEST", "CHAPEL_ONE_PRIEST_PRESENT", REGISTRY.chapelOnePriest.file, "LOAD_OR_RENEW_CHAPEL_ONE_PRIEST"];
    }

    if (!registry.bridgeAuthority.found) {
      return ["HELD_BRIDGE_AUTHORITY", "BRIDGE_AUTHORITY_PRESENT", REGISTRY.bridgeAuthority.file, "LOAD_OR_RENEW_BRIDGE_AUTHORITY"];
    }

    if (!registry.activeCrossingBridge.found) {
      return ["HELD_ACTIVE_CROSSING_BRIDGE", "ACTIVE_CROSSING_BRIDGE_PRESENT", REGISTRY.activeCrossingBridge.file, "LOAD_OR_RENEW_ACTIVE_CROSSING_BRIDGE"];
    }

    if (!registry.chapelTwoHead.found) {
      return ["HELD_CHAPEL_TWO_HEAD", "CHAPEL_TWO_HEAD_PRESENT", REGISTRY.chapelTwoHead.file, "LOAD_OR_RENEW_CHAPEL_TWO_HEAD_SURFACE_FINGER_BISHOP"];
    }

    if (c2WorkersFound < registry.chapelTwoWorkers.length) {
      var missingC2 = registry.chapelTwoWorkers.filter(function missing(item) { return !item.found; })[0];
      return ["HELD_CHAPEL_TWO_WORKER", "CHAPEL_TWO_WORKER_PRESENT_" + missingC2.primaryAlias, missingC2.file, "LOAD_OR_RENEW_" + missingC2.primaryAlias];
    }

    if (!registry.chapelTwoPriest.found) {
      return ["HELD_CHAPEL_TWO_PRIEST", "CHAPEL_TWO_PRIEST_PRESENT", REGISTRY.chapelTwoPriest.file, "LOAD_OR_RENEW_CHAPEL_TWO_PRIEST"];
    }

    if (!registry.bridgeReturn.found) {
      return ["HELD_BRIDGE_RETURN", "BRIDGE_RETURN_PRESENT", REGISTRY.bridgeReturn.file, "LOAD_OR_RENEW_BRIDGE_RETURN"];
    }

    return ["CYCLE_READABLE", "NONE", REGISTRY.chapelOneHead.file, "ALLOW_CHAPEL_ONE_HEAD_TO_CLASSIFY_MOUNT_RELEASE_STATE"];
  }

  function inspectSurfaceTruth() {
    var scopes = collectDocumentScopes();
    var inspections = scopes.map(inspectScope);
    var best = bestInspection(inspections);

    return {
      scopes: inspections,
      selectedScope: best,
      targetFrameDocumentScopeStatus: best ? "TARGET_DOCUMENT_SCOPE_RESOLVED" : "TARGET_DOCUMENT_SCOPE_NOT_RESOLVED",
      targetAccessStatus: best && best.routeMatch
        ? "TARGET_HEARTH_ROUTE_DOCUMENT_READABLE"
        : best
          ? "TARGET_DOCUMENT_READABLE_ROUTE_MATCH_UNCONFIRMED"
          : "TARGET_DOCUMENT_NOT_READABLE"
    };
  }

  function makePacket(mode) {
    var registry = readRegistry();
    var surfaceTruth = inspectSurfaceTruth();
    var surface = surfaceTruth.selectedScope || null;
    var lane = classifyLane(registry);
    var cycle = classifyCycle(registry, surface);

    var chapelOneWorkerCount = countFound(registry.chapelOneWorkers);
    var chapelTwoWorkerCount = countFound(registry.chapelTwoWorkers);

    var packet = {
      PACKET: "HEARTH_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_PACKET_v5_1",
      PACKET_NAME: "HEARTH_CANVAS_SURFACE_TRUTH_CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_PACKET_v5_1",
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      MODE: mode || "RUN_DIAGNOSTIC",
      ROLE: ROLE,
      COMPONENT: COMPONENT,

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      UPDATED_AT: nowIso(),

      SYSTEM_CANON: "HEARTH_TWO_CHAPEL_CYCLE_ALIAS_REGISTRY_CANONICAL_BINDING_v1",
      SYSTEM_MODEL: "CYCLICAL_TWO_CHAPEL_SYSTEM",
      LINEAR_CHAIN: false,
      LAUNCH_LAYER_REMOVED: true,
      REMOVED_FILE: "/assets/hearth/hearth.canvas.launch.js",

      GRID_16X16_PURPOSE: "STRUCTURAL_STATE_TRUTH_256_STATES",
      GRID_19X19_PURPOSE: "CHRONOLOGY_AUDIT_MAP_361_COORDINATES",

      CYCLE:
        "HTML_MOUNT -> CHAPEL_ONE_HEAD -> CHAPEL_ONE_WORKERS -> CHAPEL_ONE_PRIEST -> BRIDGE_AUTHORITY -> ACTIVE_CROSSING_BRIDGE -> CHAPEL_TWO_HEAD -> CHAPEL_TWO_WORKERS -> CHAPEL_TWO_PRIEST -> BRIDGE_RETURN -> CHAPEL_ONE_HEAD -> HTML_MOUNT",

      ACTIVE_LANE: lane.activeLane,
      ACTIVE_PLATFORM_STATE: lane.activePlatformState,
      PLACEHOLDER_ONLY: lane.placeholderOnly,
      EXPRESSION_ACCEPTED: lane.expressionAccepted,

      RUN_STATE: "CANONICAL_TWO_CHAPEL_CYCLE_REGISTRY_READ_COMPLETE",
      TRUST_STATE: cycle[0] === "CYCLE_READABLE" ? "CYCLE_READABLE" : "CYCLE_RETURNED_WITH_HOLD",
      BLOCKING: false,

      CYCLE_STATUS: cycle[0],
      FIRST_HELD_COORDINATE: cycle[1],
      FIRST_FAILED_COORDINATE: cycle[1],
      RECOMMENDED_NEXT_FILE: cycle[2],
      RECOMMENDED_NEXT_ACTION: cycle[3],

      TARGET_FRAME_DOCUMENT_SCOPE_STATUS: surfaceTruth.targetFrameDocumentScopeStatus,
      TARGET_ACCESS_STATUS: surfaceTruth.targetAccessStatus,

      SELECTED_DOCUMENT_SCOPE: surface ? surface.label : "NONE",
      SELECTED_DOCUMENT_PATH: surface ? surface.path : "UNKNOWN",
      SELECTED_DOCUMENT_TITLE: surface ? surface.title : "UNKNOWN",
      SELECTED_DOCUMENT_ROUTE_MATCH: surface ? surface.routeMatch : false,
      SELECTED_DOCUMENT_DIAGNOSTIC_MATCH: surface ? surface.diagnosticMatch : false,

      CANONICAL_MOUNT_EXISTS: surface ? surface.canonicalMountFound : false,
      CANONICAL_MOUNT_DESCRIPTOR: surface ? surface.canonicalMountDescriptor : "NONE",
      CANONICAL_MOUNT_RECT: surface ? surface.canonicalMountRect : rectOf(null),
      CANONICAL_MOUNT_RECT_NONZERO: surface ? surface.canonicalMountRectNonZero : false,

      CANONICAL_CANVAS_EXISTS: surface ? surface.canonicalCanvasFound : false,
      CANONICAL_CANVAS_DESCRIPTOR: surface ? surface.canonicalCanvasDescriptor : "NONE",
      CANONICAL_CANVAS_RECT: surface ? surface.canonicalCanvasRect : rectOf(null),
      CANONICAL_CANVAS_RECT_NONZERO: surface ? surface.canonicalCanvasRectNonZero : false,

      CHAPEL_ONE_HEAD_PRESENT: registry.chapelOneHead.found,
      CHAPEL_ONE_HEAD_ALIAS: registry.chapelOneHead.aliasPath,
      CHAPEL_ONE_HEAD_STATUS: registry.chapelOneHead.componentStatus,

      CHAPEL_ONE_PRIEST_PRESENT: registry.chapelOnePriest.found,
      CHAPEL_ONE_PRIEST_ALIAS: registry.chapelOnePriest.aliasPath,

      CHAPEL_ONE_WORKER_COUNT: chapelOneWorkerCount,
      CHAPEL_ONE_WORKER_TOTAL: registry.chapelOneWorkers.length,
      CHAPEL_ONE_COMPLETE: registry.chapelOneHead.found && registry.chapelOnePriest.found && chapelOneWorkerCount === registry.chapelOneWorkers.length,

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

      CHAPEL_TWO_WORKER_COUNT: chapelTwoWorkerCount,
      CHAPEL_TWO_WORKER_TOTAL: registry.chapelTwoWorkers.length,
      CHAPEL_TWO_COMPLETE: registry.chapelTwoHead.found && registry.chapelTwoPriest.found && chapelTwoWorkerCount === registry.chapelTwoWorkers.length,

      BRIDGE_RETURN_PRESENT: registry.bridgeReturn.found,
      BRIDGE_RETURN_ALIAS: registry.bridgeReturn.aliasPath,
      BRIDGE_RETURN_STATUS: registry.bridgeReturn.componentStatus,

      REGISTRY_OBJECT: registry,
      SURFACE_TRUTH_OBJECT: surfaceTruth,

      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_THIS_AS_EVIDENCE: true,
      TRUTH_PROBE_IS_READER_ONLY: true,
      CHAPEL_MEMBER: false,
      MISSIONARY_SUPPORT_COUNTED_AS_CHAPEL_MEMBER: false,

      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,ROUTE_RENDERER"
    };

    Object.keys(NO_TOUCH).forEach(function addNoTouch(key) {
      packet[key] = NO_TOUCH[key];
    });

    return packet;
  }

  function packetValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (Array.isArray(value)) return value.map(packetValue).join(" | ");
    if (isObject(value)) {
      try { return compact(JSON.stringify(value), 28000); }
      catch (_error) { return "[object]"; }
    }
    return compact(value);
  }

  function toPacketText(packet) {
    var priority = [
      "PACKET","RECEIPT_LEVEL","ROLE","COMPONENT","CONTRACT","RECEIPT","PREVIOUS_CONTRACT",
      "FILE","TARGET_ROUTE","DIAGNOSTIC_ROUTE","VERSION","SYSTEM_CANON","SYSTEM_MODEL",
      "ACTIVE_LANE","ACTIVE_PLATFORM_STATE","RUN_STATE","TRUST_STATE","CYCLE_STATUS",
      "FIRST_HELD_COORDINATE","RECOMMENDED_NEXT_FILE","RECOMMENDED_NEXT_ACTION",
      "CANONICAL_MOUNT_EXISTS","CANONICAL_MOUNT_RECT_NONZERO","CANONICAL_CANVAS_EXISTS",
      "CANONICAL_CANVAS_RECT_NONZERO","CHAPEL_ONE_HEAD_PRESENT","CHAPEL_ONE_PRIEST_PRESENT",
      "CHAPEL_ONE_WORKER_COUNT","CHAPEL_ONE_WORKER_TOTAL","BRIDGE_AUTHORITY_PRESENT",
      "ACTIVE_CROSSING_BRIDGE_PRESENT","CHAPEL_TWO_HEAD_PRESENT","CHAPEL_TWO_PRIEST_PRESENT",
      "CHAPEL_TWO_WORKER_COUNT","CHAPEL_TWO_WORKER_TOTAL","BRIDGE_RETURN_PRESENT",
      "DO_NOT_TOUCH","UPDATED_AT"
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
  function measure() { return makePacket("MEASURE"); }
  function read() { return makePacket("READ"); }
  function getReport() { return makePacket("GET_REPORT"); }
  function getReceipt() { return makePacket("GET_RECEIPT"); }
  function getState() { return makePacket("GET_STATE"); }
  function getPacket() { return getReceipt(); }
  function getPacketText() { return toPacketText(getReceipt()); }

  function getReceiptLight() {
    var packet = makePacket("GET_RECEIPT_LIGHT");

    return {
      role: ROLE,
      component: COMPONENT,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      systemCanon: packet.SYSTEM_CANON,
      activeLane: packet.ACTIVE_LANE,
      activePlatformState: packet.ACTIVE_PLATFORM_STATE,
      cycleStatus: packet.CYCLE_STATUS,
      firstHeldCoordinate: packet.FIRST_HELD_COORDINATE,
      recommendedNextFile: packet.RECOMMENDED_NEXT_FILE,
      recommendedNextAction: packet.RECOMMENDED_NEXT_ACTION,
      canonicalMountExists: packet.CANONICAL_MOUNT_EXISTS,
      canonicalMountRectNonzero: packet.CANONICAL_MOUNT_RECT_NONZERO,
      canonicalCanvasExists: packet.CANONICAL_CANVAS_EXISTS,
      canonicalCanvasRectNonzero: packet.CANONICAL_CANVAS_RECT_NONZERO,
      chapelOneHeadPresent: packet.CHAPEL_ONE_HEAD_PRESENT,
      chapelOneComplete: packet.CHAPEL_ONE_COMPLETE,
      activeCrossingBridgePresent: packet.ACTIVE_CROSSING_BRIDGE_PRESENT,
      chapelTwoHeadPresent: packet.CHAPEL_TWO_HEAD_PRESENT,
      chapelTwoComplete: packet.CHAPEL_TWO_COMPLETE,
      bridgeReturnPresent: packet.BRIDGE_RETURN_PRESENT,
      truthProbeReaderOnly: true,
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
      cycleStatus: packet.CYCLE_STATUS,
      firstHeldCoordinate: packet.FIRST_HELD_COORDINATE,
      nextFile: packet.RECOMMENDED_NEXT_FILE,
      nextAction: packet.RECOMMENDED_NEXT_ACTION,
      activeLane: packet.ACTIVE_LANE,
      activePlatformState: packet.ACTIVE_PLATFORM_STATE,
      updatedAt: packet.UPDATED_AT
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
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      ROLE: ROLE,
      COMPONENT: COMPONENT,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      role: ROLE,
      component: COMPONENT,

      registry: REGISTRY,

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
      toPacketText: toPacketText,

      readRegistry: readRegistry,
      inspectSurfaceTruth: inspectSurfaceTruth,
      collectDocumentScopes: collectDocumentScopes,

      ...NO_TOUCH
    };

    REGISTRY.diagnosticUpline.aliases.forEach(function publish(path) {
      setPath(path, api);
    });

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUN = run;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUN_DIAGNOSTIC = runDiagnostic;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT = getReceipt;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_GET_RECEIPT_LIGHT = getReceiptLight;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_STATUS = getStatus();
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();

    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;
    root.__HEARTH_CANVAS_TWO_CHAPEL_CYCLE_REGISTRY_READER_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RUNTIME_RESTART_AUTHORIZED__ = false;

    return api;
  }

  publishApi();
})(typeof window !== "undefined" ? window : globalThis);
