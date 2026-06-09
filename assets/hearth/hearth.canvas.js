// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_MOUNT_GOVERNOR_TNT_v2
// Full-file replacement.
// Chapel One Head / Canvas Bishop / Mount Platform Governor.
// Owns:
// - Chapel One Head aliases
// - mount discovery
// - mount state reporting
// - Chapel One hand registry
// - bridge expectation registry
// - bridge-return acceptance
// - platform packet composition
//
// Does not own:
// - route layout
// - CSS sizing
// - initial HTML structure
// - hand geometry math
// - hand paint expression
// - final globe expression
// - Chapel Two expression package
// - controls
// - runtime restart
// - canvas release
// - final visual pass
// - generated image / GraphicBox / WebGL

(function hearthCanvasBishopChapelOneHeadMountGovernor(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_MOUNT_GOVERNOR_TNT_v2";
  var RECEIPT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_MOUNT_GOVERNOR_RECEIPT_v2";
  var PREVIOUS_CONTRACT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HANDS_BRIDGE_STANDARD_TNT_v1";

  var VERSION = "2026-06-09.hearth-canvas-bishop-chapel-one-head-mount-governor-v2";
  var FILE = "/assets/hearth/hearth.canvas.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";

  var ROLE = "CHAPEL_ONE_HEAD";
  var TITLE = "Canvas Bishop / Mount Platform Governor";

  var NO_CLAIMS = {
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    routeRepairAuthorized: false,
    routeLayoutMutationAuthorized: false,
    cssSizingMutationAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    PRODUCTION_MUTATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_BUILD_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    READY_TEXT_CLAIMED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
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

  var ALIASES = [
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
  ];

  var HAND_REGISTRY = {
    geometry: {
      role: "Geometry Hand",
      file: "/assets/hearth/hearth.canvas.hand.geometry.js",
      primaryAlias: "HEARTH_CANVAS_HAND_GEOMETRY",
      aliases: ["HEARTH_CANVAS_HAND_GEOMETRY", "HEARTH.canvasHandGeometry", "DEXTER_LAB.hearthCanvasHandGeometry"]
    },
    context: {
      role: "Context Hand",
      file: "/assets/hearth/hearth.canvas.hand.context.js",
      primaryAlias: "HEARTH_CANVAS_HAND_CONTEXT",
      aliases: ["HEARTH_CANVAS_HAND_CONTEXT", "HEARTH.canvasHandContext", "DEXTER_LAB.hearthCanvasHandContext"]
    },
    paint: {
      role: "Paint Hand",
      file: "/assets/hearth/hearth.canvas.hand.paint.js",
      primaryAlias: "HEARTH_CANVAS_HAND_PAINT",
      aliases: ["HEARTH_CANVAS_HAND_PAINT", "HEARTH.canvasHandPaint", "DEXTER_LAB.hearthCanvasHandPaint"]
    },
    view: {
      role: "View Hand",
      file: "/assets/hearth/hearth.canvas.hand.view.js",
      primaryAlias: "HEARTH_CANVAS_HAND_VIEW",
      aliases: ["HEARTH_CANVAS_HAND_VIEW", "HEARTH.canvasHandView", "DEXTER_LAB.hearthCanvasHandView"]
    },
    inspect: {
      role: "Chapel One Priest / Inspect Hand",
      file: "/assets/hearth/hearth.canvas.hand.inspect.js",
      primaryAlias: "HEARTH_CANVAS_HAND_INSPECT",
      aliases: ["HEARTH_CANVAS_HAND_INSPECT", "HEARTH.canvasHandInspect", "DEXTER_LAB.hearthCanvasHandInspect"]
    }
  };

  var BRIDGE_REGISTRY = {
    authority: {
      role: "Bridge Authority / 3D Tuple Truth",
      file: "/assets/hearth/hearth.hex.four-pair.authority.js",
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
    crossing: {
      role: "Active Crossing Bridge",
      file: "/assets/hearth/hearth.hex.surface.js",
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
      role: "Bridge Return",
      file: "/assets/hearth/hearth.hex.bridge.return.js",
      primaryAlias: "HEARTH_HEX_BRIDGE_RETURN",
      aliases: [
        "HEARTH_HEX_BRIDGE_RETURN",
        "HEARTH.hexBridgeReturn",
        "HEARTH.bridgeReturn",
        "HEARTH_BRIDGE_RETURN",
        "DEXTER_LAB.hearthHexBridgeReturn",
        "DEXTER_LAB.hearthBridgeReturn"
      ]
    }
  };

  var acceptedHandReceipts = {};
  var acceptedBridgeReturnPacket = null;
  var lastPlatformPacket = null;

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
    return asString(value).replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, limit || 8000);
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

  function findMount() {
    return queryFirst(doc, MOUNT_SELECTORS);
  }

  function findCanvas(mount) {
    var inside = mount ? queryFirst(mount, CANVAS_SELECTORS) : null;
    if (inside) return inside;
    return queryFirst(doc, CANVAS_SELECTORS);
  }

  function getLocationPath() {
    try { return root.location && root.location.pathname ? root.location.pathname : "UNKNOWN"; }
    catch (_error) { return "UNKNOWN"; }
  }

  function routeMatch() {
    var path = getLocationPath();
    return path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "");
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

  function firstGlobal(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value && (isObject(value) || isFunction(value))) {
        return {
          found: true,
          aliasPath: paths[i],
          value: value
        };
      }
    }

    return {
      found: false,
      aliasPath: "NONE",
      value: null
    };
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    var methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport", "inspect", "measure"];

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];

      if (!isFunction(authority[method])) continue;

      try {
        var out = authority[method]();
        if (isObject(out)) return out;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    return {};
  }

  function readRegisteredNode(node) {
    var found = firstGlobal(node.aliases || []);
    var receipt = readReceipt(found.value);
    var keys = methodKeys(found.value);

    return {
      role: node.role,
      file: node.file,
      primaryAlias: node.primaryAlias,
      found: found.found,
      aliasPath: found.aliasPath,
      valueType: found.found ? typeof found.value : "undefined",
      methodCount: keys.length,
      methodKeys: keys.join(","),
      contract: asString(receipt.CONTRACT || receipt.contract || (found.value && found.value.CONTRACT) || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: asString(receipt.RECEIPT || receipt.receipt || (found.value && found.value.RECEIPT) || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: asString(receipt.componentStatus || receipt.status || receipt.RUN_STATE || receipt.runState || (found.found ? "OBSERVED" : "NOT_OBSERVED")),
      firstFailedCoordinate: asString(receipt.firstFailedCoordinate || receipt.FIRST_FAILED_COORDINATE || "UNKNOWN"),
      recommendedNextFile: asString(receipt.recommendedNextFile || receipt.RECOMMENDED_NEXT_FILE || node.file),
      recommendedNextAction: asString(receipt.recommendedNextAction || receipt.RECOMMENDED_NEXT_ACTION || "UNKNOWN"),
      rawReceipt: receipt
    };
  }

  function readHands() {
    var output = {};
    var count = 0;

    Object.keys(HAND_REGISTRY).forEach(function each(key) {
      output[key] = readRegisteredNode(HAND_REGISTRY[key]);
      if (output[key].found) count += 1;
    });

    output.observedCount = count;
    output.totalCount = Object.keys(HAND_REGISTRY).length;
    output.complete = count === output.totalCount;

    return output;
  }

  function readBridges() {
    var authority = readRegisteredNode(BRIDGE_REGISTRY.authority);
    var crossing = readRegisteredNode(BRIDGE_REGISTRY.crossing);
    var bridgeReturn = readRegisteredNode(BRIDGE_REGISTRY.bridgeReturn);

    return {
      authority: authority,
      crossing: crossing,
      bridgeReturn: bridgeReturn,
      observedCount: [authority, crossing, bridgeReturn].filter(function count(item) { return item.found; }).length,
      totalCount: 3,
      complete: authority.found && crossing.found && bridgeReturn.found
    };
  }

  function inspectMount() {
    var mount = findMount();
    var mountRect = rectOf(mount);
    var canvas = findCanvas(mount);
    var canvasRect = rectOf(canvas);

    var mountExists = Boolean(mount);
    var mountRectNonZero = Boolean(mountRect.width > 0 && mountRect.height > 0);
    var canvasExists = Boolean(canvas);
    var canvasRectNonZero = Boolean(canvasRect.width > 0 && canvasRect.height > 0);

    var status = "UNKNOWN";
    var firstHeld = "NONE";
    var nextFile = FILE;
    var nextAction = "INSPECT_CHAPEL_ONE_HEAD";

    if (!mountExists) {
      status = "HELD_CANONICAL_MOUNT_NOT_FOUND";
      firstHeld = "CANONICAL_MOUNT_EXISTS";
      nextFile = "/showroom/globe/hearth/index.html";
      nextAction = "RESTORE_HEARTH_HTML_MOUNT";
    } else if (!mountRectNonZero) {
      status = "HELD_CANONICAL_MOUNT_RECT_ZERO";
      firstHeld = "CANONICAL_MOUNT_RECT_NONZERO";
      nextFile = "/showroom/globe/hearth/index.css";
      nextAction = "RESTORE_ROUTE_NEIGHBOR_LAYOUT_TO_MAKE_MOUNT_MEASURABLE";
    } else if (!canvasExists) {
      status = "HELD_CANONICAL_CANVAS_NOT_FOUND";
      firstHeld = "CANONICAL_CANVAS_EXISTS";
      nextFile = "/showroom/globe/hearth/index.js";
      nextAction = "RESTORE_ROUTE_NEIGHBOR_JS_TO_ATTACH_PLACEMENT_CANVAS";
    } else if (!canvasRectNonZero) {
      status = "HELD_CANONICAL_CANVAS_RECT_ZERO";
      firstHeld = "CANONICAL_CANVAS_RECT_NONZERO";
      nextFile = "/showroom/globe/hearth/index.css";
      nextAction = "RESTORE_CANVAS_LAYOUT_DIMENSIONS";
    } else {
      status = "MOUNT_PLATFORM_MEASURABLE";
      firstHeld = "NONE";
      nextFile = FILE;
      nextAction = "CONTINUE_CHAPEL_ONE_HAND_COORDINATION";
    }

    return {
      routePath: getLocationPath(),
      targetRouteMatch: routeMatch(),

      mountExists: mountExists,
      mountDescriptor: descriptor(mount),
      mountRect: mountRect,
      mountRectNonZero: mountRectNonZero,

      canvasExists: canvasExists,
      canvasDescriptor: descriptor(canvas),
      canvasRect: canvasRect,
      canvasRectNonZero: canvasRectNonZero,

      platformStatus: status,
      firstHeldCoordinate: firstHeld,
      recommendedNextFile: nextFile,
      recommendedNextAction: nextAction,

      placementGlobeAllowed: mountRectNonZero && canvasExists && canvasRectNonZero,
      placementGlobeReleased: false,
      expressionGlobeAccepted: Boolean(acceptedBridgeReturnPacket && asBool(acceptedBridgeReturnPacket.expressionAuthorized)),
      expressionGlobeReleased: false
    };
  }

  function classifyBishopStatus(mountState, hands, bridges) {
    if (!mountState.mountExists) return "HELD_MOUNT_NOT_FOUND";
    if (!mountState.mountRectNonZero) return "HELD_MOUNT_RECT_ZERO";
    if (!mountState.canvasExists) return "HELD_CANVAS_NOT_FOUND";
    if (!hands.complete) return "HELD_CHAPEL_ONE_HANDS_INCOMPLETE";
    if (!bridges.authority.found) return "HELD_BRIDGE_AUTHORITY_NOT_OBSERVED";
    if (!bridges.crossing.found) return "HELD_ACTIVE_CROSSING_BRIDGE_NOT_OBSERVED";
    return "CHAPEL_ONE_HEAD_READY_FOR_HAND_PACKETING";
  }

  function firstHeldFrom(status, mountState, hands, bridges) {
    if (status === "HELD_MOUNT_NOT_FOUND") return "CANONICAL_MOUNT_EXISTS";
    if (status === "HELD_MOUNT_RECT_ZERO") return "CANONICAL_MOUNT_RECT_NONZERO";
    if (status === "HELD_CANVAS_NOT_FOUND") return "CANONICAL_CANVAS_EXISTS";

    if (status === "HELD_CHAPEL_ONE_HANDS_INCOMPLETE") {
      var missing = Object.keys(HAND_REGISTRY).filter(function filter(key) {
        return !hands[key] || !hands[key].found;
      })[0];
      return missing ? "CHAPEL_ONE_HAND_" + missing.toUpperCase() + "_PRESENT" : "CHAPEL_ONE_HANDS_COMPLETE";
    }

    if (status === "HELD_BRIDGE_AUTHORITY_NOT_OBSERVED") return "BRIDGE_AUTHORITY_PRESENT";
    if (status === "HELD_ACTIVE_CROSSING_BRIDGE_NOT_OBSERVED") return "ACTIVE_CROSSING_BRIDGE_PRESENT";

    return mountState.firstHeldCoordinate || "NONE";
  }

  function recommendedFileFrom(status, mountState, hands, bridges) {
    if (status === "HELD_MOUNT_NOT_FOUND") return "/showroom/globe/hearth/index.html";
    if (status === "HELD_MOUNT_RECT_ZERO") return "/showroom/globe/hearth/index.css";
    if (status === "HELD_CANVAS_NOT_FOUND") return "/showroom/globe/hearth/index.js";

    if (status === "HELD_CHAPEL_ONE_HANDS_INCOMPLETE") {
      var missing = Object.keys(HAND_REGISTRY).filter(function filter(key) {
        return !hands[key] || !hands[key].found;
      })[0];
      return missing ? HAND_REGISTRY[missing].file : HAND_REGISTRY.inspect.file;
    }

    if (status === "HELD_BRIDGE_AUTHORITY_NOT_OBSERVED") return BRIDGE_REGISTRY.authority.file;
    if (status === "HELD_ACTIVE_CROSSING_BRIDGE_NOT_OBSERVED") return BRIDGE_REGISTRY.crossing.file;

    if (mountState && mountState.recommendedNextFile) return mountState.recommendedNextFile;
    if (bridges && bridges.bridgeReturn && !bridges.bridgeReturn.found) return BRIDGE_REGISTRY.bridgeReturn.file;

    return FILE;
  }

  function recommendedActionFrom(status, mountState) {
    if (status === "HELD_MOUNT_NOT_FOUND") return "RESTORE_HEARTH_HTML_MOUNT";
    if (status === "HELD_MOUNT_RECT_ZERO") return "RESTORE_ROUTE_NEIGHBOR_CSS_TO_MAKE_MOUNT_NONZERO";
    if (status === "HELD_CANVAS_NOT_FOUND") return "RESTORE_ROUTE_NEIGHBOR_JS_TO_ATTACH_PLACEMENT_CANVAS";
    if (status === "HELD_CHAPEL_ONE_HANDS_INCOMPLETE") return "LOAD_OR_RENEW_CHAPEL_ONE_HANDS";
    if (status === "HELD_BRIDGE_AUTHORITY_NOT_OBSERVED") return "LOAD_OR_RENEW_BRIDGE_AUTHORITY";
    if (status === "HELD_ACTIVE_CROSSING_BRIDGE_NOT_OBSERVED") return "LOAD_OR_RENEW_ACTIVE_CROSSING_BRIDGE";

    if (mountState && mountState.recommendedNextAction) return mountState.recommendedNextAction;
    return "CONTINUE_CHAPEL_ONE_HEAD_GOVERNANCE";
  }

  function composePlatformPacket() {
    var mountState = inspectMount();
    var hands = readHands();
    var bridges = readBridges();
    var bishopStatus = classifyBishopStatus(mountState, hands, bridges);
    var firstHeld = firstHeldFrom(bishopStatus, mountState, hands, bridges);
    var nextFile = recommendedFileFrom(bishopStatus, mountState, hands, bridges);
    var nextAction = recommendedActionFrom(bishopStatus, mountState);

    var packet = {
      PACKET: "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_PLATFORM_PACKET_v2",
      PACKET_NAME: "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HEAD_PLATFORM_PACKET_v2",
      RECEIPT_LEVEL: "3_CHAPEL_ONE_HEAD_GOVERNANCE",
      ROLE: ROLE,
      TITLE: TITLE,
      COMPONENT: "HEARTH_CANVAS_BISHOP",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      GENERATED_AT: nowIso(),
      UPDATED_AT: nowIso(),

      CHAPEL: "CHAPEL_ONE",
      CHAPEL_HEAD: true,
      CHAPEL_ONE_HEAD: true,
      CHAPEL_ONE_BISHOP: true,
      CHAPEL_MEMBER: true,

      PRIEST_FILE: HAND_REGISTRY.inspect.file,
      PRIEST_ALIAS: HAND_REGISTRY.inspect.primaryAlias,

      SYSTEM_MODEL: "HEARTH_TWO_CHAPEL_CYCLE",
      LANE_1: "PLACEMENT_GLOBE",
      LANE_2: "EXPRESSION_GLOBE",
      ACTIVE_PLATFORM_STATE: acceptedBridgeReturnPacket ? "BRIDGE_RETURN_ACCEPTED_PENDING_RELEASE" : "PLACEMENT_PLATFORM_GOVERNANCE",
      PLACEHOLDER_ONLY: true,
      FINAL_GLOBE: false,

      RUN_STATE: "CHAPEL_ONE_HEAD_PLATFORM_PACKET_COMPOSED",
      TRUST_STATE: bishopStatus.indexOf("HELD_") === 0 ? "RETURNED_WITH_HOLD" : "READY_FOR_NEXT_COORDINATE",
      BISHOP_STATUS: bishopStatus,
      COMPONENT_STATUS: bishopStatus,
      FIRST_HELD_COORDINATE: firstHeld,
      FIRST_FAILED_COORDINATE: firstHeld,
      RECOMMENDED_NEXT_FILE: nextFile,
      RECOMMENDED_NEXT_ACTION: nextAction,

      CANONICAL_MOUNT_EXISTS: mountState.mountExists,
      CANONICAL_MOUNT_DESCRIPTOR: mountState.mountDescriptor,
      CANONICAL_MOUNT_RECT: mountState.mountRect,
      CANONICAL_MOUNT_RECT_NONZERO: mountState.mountRectNonZero,

      CANONICAL_CANVAS_EXISTS: mountState.canvasExists,
      CANONICAL_CANVAS_DESCRIPTOR: mountState.canvasDescriptor,
      CANONICAL_CANVAS_RECT: mountState.canvasRect,
      CANONICAL_CANVAS_RECT_NONZERO: mountState.canvasRectNonZero,

      PLACEMENT_GLOBE_ALLOWED: mountState.placementGlobeAllowed,
      PLACEMENT_GLOBE_RELEASED: false,
      EXPRESSION_GLOBE_ACCEPTED: mountState.expressionGlobeAccepted,
      EXPRESSION_GLOBE_RELEASED: false,

      HAND_GEOMETRY_OBSERVED: hands.geometry.found,
      HAND_CONTEXT_OBSERVED: hands.context.found,
      HAND_PAINT_OBSERVED: hands.paint.found,
      HAND_VIEW_OBSERVED: hands.view.found,
      HAND_INSPECT_OBSERVED: hands.inspect.found,
      HAND_OBSERVED_COUNT: hands.observedCount,
      HAND_TOTAL_COUNT: hands.totalCount,
      CHAPEL_ONE_HANDS_COMPLETE: hands.complete,

      HEX_AUTHORITY_BRIDGE_OBSERVED: bridges.authority.found,
      HEX_SURFACE_BRIDGE_OBSERVED: bridges.crossing.found,
      HEX_BRIDGE_RETURN_OBSERVED: bridges.bridgeReturn.found,
      BRIDGE_OBSERVED_COUNT: bridges.observedCount,
      BRIDGE_TOTAL_COUNT: bridges.totalCount,

      ACCEPTED_HAND_RECEIPTS: acceptedHandReceipts,
      ACCEPTED_BRIDGE_RETURN_PACKET: acceptedBridgeReturnPacket,

      MOUNT_STATE_OBJECT: mountState,
      CHAPEL_ONE_HANDS_OBJECT: hands,
      BRIDGE_OBJECT: bridges,

      ROUTE_LAYOUT_OWNERSHIP: "/showroom/globe/hearth/index.css",
      ROUTE_PLACEMENT_JS_OWNERSHIP: "/showroom/globe/hearth/index.js",
      BISHOP_OWNS_ROUTE_LAYOUT: false,
      BISHOP_OWNS_ROUTE_CANVAS_ATTACHMENT: false,
      BISHOP_OWNS_FINAL_VISUAL_PASS: false,

      DO_NOT_TOUCH: "PRODUCTION,ROUTE_LAYOUT,CSS_SIZING,CANVAS_DRAWING,CONTROLS,RUNTIME_ROUTE,FINAL_VISUAL_PASS"
    };

    Object.keys(NO_CLAIMS).forEach(function each(key) {
      packet[key] = NO_CLAIMS[key];
    });

    lastPlatformPacket = packet;
    return packet;
  }

  function receiveHandReceipt(packet) {
    if (!isObject(packet)) {
      return {
        accepted: false,
        reason: "HAND_RECEIPT_NOT_OBJECT",
        updatedAt: nowIso()
      };
    }

    var key = asString(packet.handKey || packet.HAND_KEY || packet.component || packet.COMPONENT || packet.role || packet.ROLE || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");

    acceptedHandReceipts[key] = {
      acceptedAt: nowIso(),
      packet: packet
    };

    return {
      accepted: true,
      handKey: key,
      updatedAt: nowIso(),
      bishopStatus: composePlatformPacket().BISHOP_STATUS
    };
  }

  function receiveBridgeReturnPacket(packet) {
    if (!isObject(packet)) {
      return {
        accepted: false,
        reason: "BRIDGE_RETURN_PACKET_NOT_OBJECT",
        updatedAt: nowIso()
      };
    }

    acceptedBridgeReturnPacket = {
      acceptedAt: nowIso(),
      packet: packet,
      expressionAuthorized: asBool(packet.expressionAuthorized || packet.EXPRESSION_AUTHORIZED),
      replacementEligible: asBool(packet.replacementEligible || packet.REPLACEMENT_ELIGIBLE),
      releaseRequested: asBool(packet.releaseRequested || packet.RELEASE_REQUESTED)
    };

    return {
      accepted: true,
      bridgeReturnAccepted: true,
      expressionAuthorized: acceptedBridgeReturnPacket.expressionAuthorized,
      replacementEligible: acceptedBridgeReturnPacket.replacementEligible,
      releaseRequested: acceptedBridgeReturnPacket.releaseRequested,
      canvasReleaseAuthorized: false,
      finalVisualPassClaimed: false,
      updatedAt: nowIso(),
      bishopStatus: composePlatformPacket().BISHOP_STATUS
    };
  }

  function acceptBridgeReturnPacket(packet) {
    return receiveBridgeReturnPacket(packet);
  }

  function receive(packet) {
    if (isObject(packet) && (packet.bridgeReturn || packet.BRIDGE_RETURN || packet.expressionAuthorized || packet.EXPRESSION_AUTHORIZED)) {
      return receiveBridgeReturnPacket(packet);
    }

    return receiveHandReceipt(packet);
  }

  function inspect() {
    return composePlatformPacket();
  }

  function measure() {
    return composePlatformPacket();
  }

  function read() {
    return composePlatformPacket();
  }

  function run() {
    return composePlatformPacket();
  }

  function runDiagnostic() {
    return composePlatformPacket();
  }

  function getState() {
    return composePlatformPacket();
  }

  function getStatus() {
    var packet = composePlatformPacket();

    return {
      role: ROLE,
      title: TITLE,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      chapelOneHead: true,
      chapelMember: true,
      bishopStatus: packet.BISHOP_STATUS,
      componentStatus: packet.COMPONENT_STATUS,
      firstHeldCoordinate: packet.FIRST_HELD_COORDINATE,
      recommendedNextFile: packet.RECOMMENDED_NEXT_FILE,
      recommendedNextAction: packet.RECOMMENDED_NEXT_ACTION,
      canonicalMountExists: packet.CANONICAL_MOUNT_EXISTS,
      canonicalMountRectNonzero: packet.CANONICAL_MOUNT_RECT_NONZERO,
      canonicalCanvasExists: packet.CANONICAL_CANVAS_EXISTS,
      canonicalCanvasRectNonzero: packet.CANONICAL_CANVAS_RECT_NONZERO,
      placementGlobeAllowed: packet.PLACEMENT_GLOBE_ALLOWED,
      placementGlobeReleased: false,
      canvasReleaseAuthorized: false,
      finalVisualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    var packet = composePlatformPacket();

    return {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      ROLE: ROLE,
      TITLE: TITLE,
      CHAPEL_ONE_HEAD: true,
      CHAPEL_ONE_BISHOP: true,
      CHAPEL_MEMBER: true,
      BISHOP_STATUS: packet.BISHOP_STATUS,
      COMPONENT_STATUS: packet.COMPONENT_STATUS,
      FIRST_HELD_COORDINATE: packet.FIRST_HELD_COORDINATE,
      FIRST_FAILED_COORDINATE: packet.FIRST_FAILED_COORDINATE,
      RECOMMENDED_NEXT_FILE: packet.RECOMMENDED_NEXT_FILE,
      RECOMMENDED_NEXT_ACTION: packet.RECOMMENDED_NEXT_ACTION,
      CANONICAL_MOUNT_EXISTS: packet.CANONICAL_MOUNT_EXISTS,
      CANONICAL_MOUNT_RECT_NONZERO: packet.CANONICAL_MOUNT_RECT_NONZERO,
      CANONICAL_CANVAS_EXISTS: packet.CANONICAL_CANVAS_EXISTS,
      CANONICAL_CANVAS_RECT_NONZERO: packet.CANONICAL_CANVAS_RECT_NONZERO,
      HAND_OBSERVED_COUNT: packet.HAND_OBSERVED_COUNT,
      HAND_TOTAL_COUNT: packet.HAND_TOTAL_COUNT,
      HEX_AUTHORITY_BRIDGE_OBSERVED: packet.HEX_AUTHORITY_BRIDGE_OBSERVED,
      HEX_SURFACE_BRIDGE_OBSERVED: packet.HEX_SURFACE_BRIDGE_OBSERVED,
      HEX_BRIDGE_RETURN_OBSERVED: packet.HEX_BRIDGE_RETURN_OBSERVED,
      PLACEMENT_GLOBE_ALLOWED: packet.PLACEMENT_GLOBE_ALLOWED,
      PLACEMENT_GLOBE_RELEASED: false,
      EXPRESSION_GLOBE_ACCEPTED: packet.EXPRESSION_GLOBE_ACCEPTED,
      EXPRESSION_GLOBE_RELEASED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      VISUAL_PASS_CLAIMED: false,
      FINAL_VISUAL_PASS_CLAIMED: false,
      UPDATED_AT: nowIso()
    };
  }

  function getReceipt() {
    return composePlatformPacket();
  }

  function getReport() {
    return composePlatformPacket();
  }

  function getPacket() {
    return composePlatformPacket();
  }

  function toPacketText(packet) {
    var source = packet || composePlatformPacket();
    return Object.keys(source).map(function line(key) {
      var value = source[key];

      if (value === undefined || value === null || value === "") value = "UNKNOWN";
      else if (isFunction(value)) value = "[function]";
      else if (isObject(value) || Array.isArray(value)) {
        try { value = JSON.stringify(value); }
        catch (_error) { value = "[object]"; }
      }

      return key + "=" + compact(value, 28000);
    }).join("\n");
  }

  function getReceiptText() {
    return toPacketText(composePlatformPacket());
  }

  function getPacketText() {
    return getReceiptText();
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
      ROLE: ROLE,
      TITLE: TITLE,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      role: ROLE,
      title: TITLE,

      aliases: ALIASES,
      handRegistry: HAND_REGISTRY,
      bridgeRegistry: BRIDGE_REGISTRY,

      run: run,
      runDiagnostic: runDiagnostic,
      inspect: inspect,
      measure: measure,
      read: read,

      inspectMount: inspectMount,
      readHands: readHands,
      readBridges: readBridges,
      composePlatformPacket: composePlatformPacket,

      receiveHandReceipt: receiveHandReceipt,
      receiveBridgeReturnPacket: receiveBridgeReturnPacket,
      acceptBridgeReturnPacket: acceptBridgeReturnPacket,
      receive: receive,

      getState: getState,
      getStatus: getStatus,
      getReport: getReport,
      getReceipt: getReceipt,
      getReceiptLight: getReceiptLight,
      getReceiptText: getReceiptText,
      getPacket: getPacket,
      getPacketText: getPacketText,
      toPacketText: toPacketText,

      getAcceptedHandReceipts: function getAcceptedHandReceipts() { return acceptedHandReceipts; },
      getAcceptedBridgeReturnPacket: function getAcceptedBridgeReturnPacket() { return acceptedBridgeReturnPacket; },
      getLastPlatformPacket: function getLastPlatformPacket() { return lastPlatformPacket; }
    };

    Object.keys(NO_CLAIMS).forEach(function each(key) {
      api[key] = NO_CLAIMS[key];
    });

    ALIASES.forEach(function each(path) {
      setPath(path, api);
    });

    root.HEARTH_CANVAS_BISHOP_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_RECEIPT = root.HEARTH_CANVAS_BISHOP_RECEIPT;
    root.HEARTH_CANVAS_BISHOP_STATUS = getStatus();
    root.HEARTH_CANVAS_STATUS = root.HEARTH_CANVAS_BISHOP_STATUS;

    root.__HEARTH_CANVAS_BISHOP_LOADED__ = true;
    root.__HEARTH_CANVAS_BISHOP_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_BISHOP_VERSION__ = VERSION;
    root.__HEARTH_CHAPEL_ONE_HEAD_PRESENT__ = true;
    root.__HEARTH_CANVAS_BISHOP_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_CANVAS_BISHOP_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_CANVAS_BISHOP_VISUAL_PASS_CLAIMED__ = false;

    return api;
  }

  publishApi();
})(typeof window !== "undefined" ? window : globalThis);
