// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3
// Full-file replacement.
// Canvas Surface Truth Probe / production-surface lens alignment.
//
// Purpose:
// - Preserve Canvas Surface Truth Probe compatibility.
// - Align canonical mount/frame/canvas/context/pixel contract definitions to the consumed
//   South production-surface pointer lens.
// - Treat SOUTH_SURFACE_POINTER_LENS_CONSUMED as evidence that the inspected surface is
//   the production canvas surface.
// - Broaden canonical mount discovery beyond stale single-selector assumptions.
// - Resolve canonical mount by explicit mount, production-surface lens, canvas parent chain,
//   or production canvas surface container.
// - Report Surface Truth variance precisely before Canvas build.
// - Keep Canvas blame unknown unless contract facts make blame lawful.
//
// Does not:
// - force North rail receipt return
// - final-arbitrate
// - issue Canvas repair authorization
// - mutate production files
// - draw Canvas
// - build Canvas
// - replace North grammar
// - replace North rail
// - replace LabWest derivative diagnostic
// - claim ready / F13 / F21 / final visual pass
//

(function () {
  "use strict";

  var ROOT = typeof window !== "undefined" ? window : globalThis;
  var DOC = typeof document !== "undefined" ? document : null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT_v3";

  var PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_TNT_v2";
  var PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_RECEIPT_v2";

  var COMPAT_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  var VERSION =
    "2026-06-08.hearth-diagnostic-probe-canvas-surface-truth-production-surface-lens-alignment-v3";

  var UPSTREAM_CONSTRUCT = "LABWEST_DERIVATIVE_CONSTRUCT";
  var PROFILE_ROLE = "CANVAS_SURFACE_TRUTH_PROBE";
  var PROFILE_CLASS = "DIAGNOSTIC_CONTRACT_DEFINITION_INSTRUMENT";
  var CYCLE_POSITION =
    "DIAGNOSTIC_TRACK_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_STAGE";

  var SOUTH_LENS_REQUIRED_STATUS = "SOUTH_SURFACE_POINTER_LENS_CONSUMED";
  var PRODUCTION_SURFACE_CLASS = "PRODUCTION_CANVAS_SURFACE";

  var NO_CLAIMS = {
    OWNS_FINAL_ARBITRATION: false,
    OWNS_WEST_DERIVATIVE_MAP: false,
    OWNS_NORTH_GRAMMAR: false,
    OWNS_NORTH_RAIL: false,
    OWNS_CANVAS_PRODUCTION_REPAIR: false,
    OWNS_CANVAS_BUILD_AUTHORITY: false,
    MAY_FORCE_RECEIPT_RETURN: false,

    finalArbitrationClaimed: false,
    westDerivativeMapClaimed: false,
    northGrammarClaimed: false,
    northRailClaimed: false,
    canvasProductionRepairClaimed: false,
    canvasBuildAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    routeRepairAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  };

  var CANVAS_CYCLE = [
    "KING_ROUTE_CONDUCTOR",
    "QUEEN_CONTROLS",
    "CHAPEL_1_ASSETS_CANVAS_HUB",
    "HEX_SURFACE_GATE",
    "CHAPEL_2_POINTER_SURFACE_BISHOP",
    "CHAPEL_2_INSPECT_PRIEST",
    "CHAPEL_1_ASSETS_CANVAS_HUB_RETURN"
  ];

  var DIAGNOSTIC_CYCLE = [
    "LABWEST_CONSTRUCT",
    "NORTH_DIAGNOSTIC_TRACK_ALIGNMENT",
    "SOUTH_SURFACE_POINTER_LENS_CONSUMPTION",
    "CANVAS_SURFACE_TRUTH_CONTRACT_DEFINITION_ALIGNMENT",
    "NORTH_DIAGNOSTIC_TRACK_CONSUMPTION",
    "WEST_DERIVATIVE_MAP",
    "CANVAS_BUILD_DECISION"
  ];

  var MOUNT_SELECTOR_CANDIDATES = [
    "#hearthCanvasMount",
    "section#hearthCanvasMount.globe-mount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-mount]",
    "[data-canvas-mount]",
    "[data-production-canvas-surface]",
    "[data-hearth-production-surface]",
    ".hearth-canvas-mount",
    ".hearth-canvas-shell",
    ".hearth-canvas-frame",
    ".hearth-surface",
    ".hearth-surface-frame",
    ".production-canvas-surface",
    ".globe-mount",
    ".planet-mount",
    ".canvas-mount",
    ".canvas-frame",
    "#hearthGlobeMount",
    "#hearthSurfaceMount",
    "#globeMount",
    "#canvasMount"
  ];

  var CANVAS_SELECTOR_CANDIDATES = [
    "#hearthCanvas",
    "canvas#hearthCanvas",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas]",
    "canvas[data-hearth-canvas]",
    "[data-production-canvas-surface] canvas",
    "[data-hearth-production-surface] canvas",
    ".production-canvas-surface canvas",
    ".hearth-canvas-mount canvas",
    ".hearth-canvas-shell canvas",
    ".hearth-canvas-frame canvas",
    ".hearth-surface canvas",
    ".hearth-surface-frame canvas",
    ".globe-mount canvas",
    ".planet-mount canvas",
    ".canvas-mount canvas",
    ".canvas-frame canvas",
    "canvas"
  ];

  var SOUTH_SIDECAR_ALIASES = [
    "HEARTH.southSurfacePointerSidecar",
    "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH.southCanvasSurfacePointerSidecar",
    "HEARTH.diagnosticSouthSurfacePointerSidecar",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
    "SOUTH_SURFACE_POINTER_SIDECAR",
    "DEXTER_LAB.southSurfacePointerSidecar",
    "DEXTER_LAB.hearthSouthSurfacePointerSidecar"
  ];

  var EXPECTED_ENDPOINTS = {
    QUEEN_CONTROLS: {
      family: "HEARTH_CONTROLS",
      file: "/assets/hearth/hearth.controls.js",
      aliases: [
        "HEARTH.controls",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.QUEEN_CONTROLS",
        "HEARTH_CONTROLS",
        "HEARTH_CONTROLS_QUEEN"
      ],
      allowedContracts: [
        "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1",
        "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5",
        "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
        "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
        "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
      ]
    },
    CHAPEL_1_ASSETS_CANVAS_HUB: {
      family: "HEARTH_CANVAS_HUB",
      file: "/assets/hearth/hearth.canvas.js",
      aliases: [
        "HEARTH.canvas",
        "HEARTH.canvasHub",
        "HEARTH.assetsCanvasHub",
        "HEARTH.chapel1AssetsCanvasHub",
        "HEARTH.CHAPEL_1_ASSETS_CANVAS_HUB",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_HUB"
      ],
      allowedContracts: [
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3",
        "HEARTH_CANVAS_HUB_REC0_SETTLED_GEOMETRY_SINGLE_VIEW_APPLICATION_DEFERRED_HEX_OUTPUT_TNT_v12_4_1",
        "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4",
        "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
        "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4"
      ]
    },
    HEX_SURFACE_GATE: {
      family: "HEARTH_HEX_SURFACE",
      file: "/assets/hearth/hearth.hex.surface.js",
      aliases: [
        "HEARTH.hexSurface",
        "HEARTH.hexSurfaceGate",
        "HEARTH.HEX_SURFACE_GATE",
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_SURFACE_GATE"
      ],
      allowedContracts: [
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4"
      ]
    },
    CHAPEL_2_POINTER_SURFACE_BISHOP: {
      family: "HEARTH_CANVAS_FINGER_SURFACE",
      file: "/assets/hearth/hearth.canvas.finger.surface.js",
      aliases: [
        "HEARTH.canvasFingerSurface",
        "HEARTH.pointerSurfaceBishop",
        "HEARTH.chapel2PointerSurfaceBishop",
        "HEARTH.CHAPEL_2_POINTER_SURFACE_BISHOP",
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH_POINTER_SURFACE_BISHOP"
      ],
      allowedContracts: [
        "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_GATE_TNT_v5",
        "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4"
      ]
    },
    CHAPEL_2_INSPECT_PRIEST: {
      family: "HEARTH_CANVAS_FINGER_INSPECT",
      file: "/assets/hearth/hearth.canvas.finger.inspect.js",
      aliases: [
        "HEARTH.canvasFingerInspect",
        "HEARTH.pointerInspectPriest",
        "HEARTH.chapel2InspectPriest",
        "HEARTH.CHAPEL_2_INSPECT_PRIEST",
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_POINTER_INSPECT_PRIEST"
      ],
      allowedContracts: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1",
        "HEARTH_CANVAS_FINGER_INSPECT_CHAPEL_2_CHILD_ORGANIZER_TNT_v1"
      ]
    }
  };

  var CONTRACT_DEFINITIONS = {
    CANONICAL_MOUNT_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Production Canvas mount container",
      selectorCandidates: MOUNT_SELECTOR_CANDIDATES.slice(),
      productionSurfaceLensMaySatisfyMountIdentity: true,
      canvasParentChainMaySatisfyMountIdentity: true,
      requiredFacts: [
        "explicit mount exists OR production surface lens resolves mount OR canvas parent chain resolves mount",
        "resolved mount or canvas rect is nonzero",
        "resolved parent chain is readable"
      ],
      failureClasses: [
        "CANONICAL_MOUNT_MISSING",
        "CANONICAL_MOUNT_ZERO_RECT",
        "CANONICAL_MOUNT_PARENT_CHAIN_UNREADABLE",
        "PRODUCTION_SURFACE_LENS_TARGET_UNRESOLVED"
      ],
      repairAuthority: false
    },
    CANONICAL_FRAME_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Production Canvas viewport/intersection frame",
      requiredFacts: [
        "resolved mount or canvas rect intersects viewport",
        "canvas rect intersects viewport when mounted"
      ],
      failureClasses: [
        "CANONICAL_FRAME_OUT_OF_VIEWPORT",
        "CANONICAL_FRAME_ZERO_VIEWPORT_INTERSECTION"
      ],
      repairAuthority: false
    },
    CANONICAL_CANVAS_ELEMENT_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Production Canvas DOM element",
      selectorCandidates: CANVAS_SELECTOR_CANDIDATES.slice(),
      requiredFacts: [
        "canvas element exists",
        "canvas rect is nonzero",
        "canvas bitmap width and height are nonzero"
      ],
      failureClasses: [
        "CANONICAL_CANVAS_ELEMENT_MISSING",
        "CANONICAL_CANVAS_ELEMENT_ZERO_RECT",
        "CANVAS_BITMAP_ZERO_SIZE"
      ],
      repairAuthority: false
    },
    CANVAS_CONTEXT_2D_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Canvas 2D context availability",
      requiredFacts: [
        "2D context can be read",
        "context read does not draw"
      ],
      failureClasses: [
        "CANVAS_CONTEXT_2D_NOT_READY",
        "CANVAS_CONTEXT_2D_READ_ERROR"
      ],
      repairAuthority: false
    },
    CANVAS_PIXEL_VISIBILITY_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Visible pixel evidence",
      requiredFacts: [
        "sampled pixels are readable",
        "at least one sample is nontransparent or nonblack",
        "pixel read does not imply final visual pass"
      ],
      failureClasses: [
        "CANVAS_PIXEL_SAMPLE_UNREADABLE",
        "CANVAS_PIXEL_NOT_VISIBLE"
      ],
      repairAuthority: false,
      finalVisualPassAuthority: false
    },
    SOUTH_SURFACE_POINTER_LENS_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "PRODUCTION_SURFACE_LENS_CONTRACT",
      subject: "South sidecar production-surface pointer lens",
      requiredFacts: [
        "South sidecar lens is consumed when present",
        "surface class may identify PRODUCTION_CANVAS_SURFACE",
        "South lens is evidence, not final arbitration"
      ],
      consumedStatus: SOUTH_LENS_REQUIRED_STATUS,
      productionSurfaceClass: PRODUCTION_SURFACE_CLASS,
      repairAuthority: false,
      finalArbitrationAuthority: false
    },
    BORROWED_CONTRACT_TEXT_REJECTION_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "ANTI_COLLAPSE_CONTRACT",
      subject: "Borrowed contract text rejection",
      rule: "A container may quote, receive, relay, or contain another contract name without proving it owns that endpoint.",
      active: true
    },
    CROSS_CONTAINER_COLLAPSE_REJECTION_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "ANTI_COLLAPSE_CONTRACT",
      subject: "Cross-container collapse rejection",
      rule: "Receiver identity, child identity, and service identity are not transitive.",
      active: true
    },
    DUTY_LOAD_SELF_MEASUREMENT_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "DIAGNOSTIC_SELF_MEASUREMENT_CONTRACT",
      subject: "Surface Truth Probe duty load",
      required: true,
      active: true
    },
    DIAGNOSTIC_MALPRACTICE_GUARD_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "DIAGNOSTIC_MALPRACTICE_GUARD_CONTRACT",
      subject: "Prevents collapsed diagnostic output from issuing authority",
      active: true
    }
  };

  var PROFILE = {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    FILE: FILE,
    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
    VERSION: VERSION,

    UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
    PROFILE_ROLE: PROFILE_ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,

    SOUTH_SURFACE_POINTER_LENS_ALIGNMENT_ACTIVE: true,
    PRODUCTION_CANVAS_SURFACE_LENS_ACCEPTED_AS_EVIDENCE: true,
    CANVAS_PARENT_CHAIN_MAY_RESOLVE_CANONICAL_MOUNT: true,

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
    MAY_FORCE_RECEIPT_RETURN: false
  };

  var state = {
    publishedAt: "",
    lastInspectionAt: "",
    lastProfileReceipt: null,
    lastInspectionPacket: null,
    inspectionCount: 0,
    errorCount: 0,
    errors: []
  };

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

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function clone(value) {
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) {
        var out = {};
        Object.keys(value).forEach(function (key) {
          if (key === "element" || key === "context") return;
          out[key] = value[key];
        });
        return out;
      }
      return value;
    }
  }

  function ensureNamespace(name) {
    if (!ROOT[name] || typeof ROOT[name] !== "object") ROOT[name] = {};
    return ROOT[name];
  }

  function readPath(path) {
    if (!path || typeof path !== "string") return undefined;

    var parts = path.replace(/^window\./, "").split(".");
    var cursor = ROOT;

    for (var i = 0; i < parts.length; i += 1) {
      if (!parts[i]) continue;
      if (!cursor || (typeof cursor !== "object" && typeof cursor !== "function")) {
        return undefined;
      }
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function firstKnown() {
    for (var i = 0; i < arguments.length; i += 1) {
      var text = safeString(arguments[i], "").trim();
      if (!text) continue;
      if (
        text === "UNKNOWN" ||
        text === "NONE" ||
        text === "NOT_FOUND" ||
        text === "UNREADABLE" ||
        text === "NULL"
      ) {
        continue;
      }
      return text;
    }
    return "";
  }

  function readRaw(source, key, fallback) {
    if (fallback === undefined) fallback = undefined;
    if (!source || (typeof source !== "object" && typeof source !== "function")) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      var direct = source[key];
      return direct === undefined || direct === null ? fallback : direct;
    }

    var lower = key.toLowerCase();

    try {
      var keys = Object.keys(source);
      for (var i = 0; i < keys.length; i += 1) {
        if (keys[i].toLowerCase() === lower) {
          var value = source[keys[i]];
          return value === undefined || value === null ? fallback : value;
        }
      }
    } catch (_error) {}

    return fallback;
  }

  function safeBool(value, fallback) {
    if (fallback === undefined) fallback = false;
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;

    var text = safeString(value).trim().toLowerCase();
    if (["true", "yes", "ready", "active", "accepted", "complete", "consumed", "present"].indexOf(text) !== -1) {
      return true;
    }
    if (["false", "no", "held", "pending", "blocked", "missing", "none"].indexOf(text) !== -1) {
      return false;
    }

    return fallback;
  }

  function contractOf(value) {
    var v = value && (typeof value === "object" || typeof value === "function") ? value : {};
    return firstKnown(
      v.CONTRACT,
      v.contract,
      v.PUBLIC_CONTRACT,
      v.publicContract,
      v.INTERNAL_RENEWAL_CONTRACT,
      v.internalRenewalContract,
      v.COMPAT_CONTRACT,
      v.compatContract,
      v.sourceContract,
      v.surfaceTruthContract
    );
  }

  function receiptOf(value) {
    var v = value && (typeof value === "object" || typeof value === "function") ? value : {};
    return firstKnown(
      v.RECEIPT,
      v.receipt,
      v.PUBLIC_RECEIPT,
      v.publicReceipt,
      v.INTERNAL_RENEWAL_RECEIPT,
      v.internalRenewalReceipt,
      v.sourceReceipt,
      v.surfaceTruthReceipt
    );
  }

  function callMethod(authority, method) {
    if (!authority || !isFunction(authority[method])) {
      return { attempted: false, ok: false, output: null, error: "METHOD_NOT_AVAILABLE" };
    }

    try {
      var output = authority[method]();
      return { attempted: true, ok: true, output: output, error: "NONE" };
    } catch (error) {
      return {
        attempted: true,
        ok: false,
        output: null,
        error: safeString(error && error.message ? error.message : error, "CALL_ERROR")
      };
    }
  }

  function resolveAuthority(aliases) {
    var list = Array.isArray(aliases) ? aliases : [];

    for (var i = 0; i < list.length; i += 1) {
      var value = readPath(list[i]);
      if (value !== undefined && value !== null) {
        return {
          present: true,
          alias: list[i],
          authority: value,
          valueType: typeof value
        };
      }
    }

    return {
      present: false,
      alias: "NONE",
      authority: null,
      valueType: "undefined"
    };
  }

  function readAuthorityPacket(authority, methods) {
    if (!authority) {
      return { method: "NONE", packet: null, attempted: false, error: "NO_AUTHORITY" };
    }

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];
      if (!isFunction(authority[method])) continue;

      var call = callMethod(authority, method);

      if (!call.ok) {
        return {
          method: method,
          packet: null,
          attempted: true,
          error: call.error
        };
      }

      if (isObject(call.output)) {
        return {
          method: method,
          packet: clone(call.output),
          attempted: true,
          error: "NONE"
        };
      }

      if (typeof call.output === "string" && call.output.trim()) {
        return {
          method: method,
          packet: { statusText: call.output },
          attempted: true,
          error: "NONE"
        };
      }
    }

    if (isObject(authority.receipt)) {
      return { method: "receipt", packet: clone(authority.receipt), attempted: false, error: "NONE" };
    }
    if (isObject(authority.report)) {
      return { method: "report", packet: clone(authority.report), attempted: false, error: "NONE" };
    }
    if (isObject(authority.state)) {
      return { method: "state", packet: clone(authority.state), attempted: false, error: "NONE" };
    }

    if (contractOf(authority)) {
      return { method: "authorityObject", packet: clone(authority), attempted: false, error: "NONE" };
    }

    return { method: "NONE", packet: null, attempted: false, error: "NO_PACKET_RETURNED" };
  }

  function pickFirstElement(selectors) {
    if (!DOC) return null;

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = DOC.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }

    return null;
  }

  function elementSelectorSignature(element) {
    if (!element) return "NONE";

    var tag = element.tagName ? String(element.tagName).toLowerCase() : "node";
    var id = element.id ? "#" + element.id : "";
    var cls = "";

    try {
      if (element.className && typeof element.className === "string") {
        cls = "." + element.className.trim().replace(/\s+/g, ".");
      }
    } catch (_error) {}

    return tag + id + cls;
  }

  function readRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return {
        exists: Boolean(element),
        readable: false,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        nonzero: false,
        viewportIntersecting: false
      };
    }

    try {
      var rect = element.getBoundingClientRect();
      var width = Number(rect.width || rect.right - rect.left || 0);
      var height = Number(rect.height || rect.bottom - rect.top || 0);
      var viewportWidth =
        ROOT.innerWidth || (DOC && DOC.documentElement && DOC.documentElement.clientWidth) || 0;
      var viewportHeight =
        ROOT.innerHeight || (DOC && DOC.documentElement && DOC.documentElement.clientHeight) || 0;

      var viewportIntersecting =
        width > 0 &&
        height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < viewportWidth &&
        rect.top < viewportHeight;

      return {
        exists: true,
        readable: true,
        width: width,
        height: height,
        top: Number(rect.top || 0),
        right: Number(rect.right || 0),
        bottom: Number(rect.bottom || 0),
        left: Number(rect.left || 0),
        nonzero: width > 0 && height > 0,
        viewportIntersecting: viewportIntersecting
      };
    } catch (error) {
      return {
        exists: true,
        readable: false,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        nonzero: false,
        viewportIntersecting: false,
        error: safeString(error && error.message ? error.message : error)
      };
    }
  }

  function parentChain(element, limit) {
    var out = [];
    var cursor = element || null;
    var count = 0;
    var max = limit || 10;

    while (cursor && count < max) {
      out.push(elementSelectorSignature(cursor));
      cursor = cursor.parentElement || null;
      count += 1;
    }

    return out;
  }

  function closestMountLike(element) {
    if (!element) return null;

    var selectors = [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount]",
      "[data-hearth-mount]",
      "[data-canvas-mount]",
      "[data-production-canvas-surface]",
      "[data-hearth-production-surface]",
      ".production-canvas-surface",
      ".hearth-canvas-mount",
      ".hearth-canvas-shell",
      ".hearth-canvas-frame",
      ".hearth-surface",
      ".hearth-surface-frame",
      ".globe-mount",
      ".planet-mount",
      ".canvas-mount",
      ".canvas-frame",
      "section",
      "article",
      "div"
    ];

    if (isFunction(element.closest)) {
      for (var i = 0; i < selectors.length; i += 1) {
        try {
          var found = element.closest(selectors[i]);
          if (found) return found;
        } catch (_error) {}
      }
    }

    return element.parentElement || null;
  }

  function selectorFromLensValue(value) {
    var text = safeString(value).trim();
    if (!text) return "";
    if (text.indexOf("#") === 0 || text.indexOf(".") === 0 || text.indexOf("[") === 0) return text;
    if (/^[A-Za-z][\w-]*$/.test(text)) return "#" + text;
    return text;
  }

  function getLensSelectorCandidates(lensFacts, kind) {
    var candidates = [];
    var source = lensFacts.rawPacket || {};

    var keys =
      kind === "canvas"
        ? [
            "canvasSelector",
            "CANVAS_SELECTOR",
            "canvasTargetSelector",
            "CANVAS_TARGET_SELECTOR",
            "surfaceCanvasSelector",
            "SURFACE_CANVAS_SELECTOR",
            "canvasId",
            "CANVAS_ID",
            "targetCanvasId",
            "TARGET_CANVAS_ID"
          ]
        : [
            "mountSelector",
            "MOUNT_SELECTOR",
            "surfaceSelector",
            "SURFACE_SELECTOR",
            "surfaceTargetSelector",
            "SURFACE_TARGET_SELECTOR",
            "canonicalMountSelector",
            "CANONICAL_MOUNT_SELECTOR",
            "mountId",
            "MOUNT_ID",
            "targetMountId",
            "TARGET_MOUNT_ID"
          ];

    keys.forEach(function (key) {
      var selector = selectorFromLensValue(readRaw(source, key, ""));
      if (selector) candidates.push(selector);
    });

    var nested = [
      source.surface,
      source.surfaceLens,
      source.lens,
      source.report,
      source.sidecar,
      source.pointerLens,
      source.surfacePointerLens
    ];

    nested.forEach(function (item) {
      if (!isObject(item)) return;
      keys.forEach(function (key) {
        var selector = selectorFromLensValue(readRaw(item, key, ""));
        if (selector) candidates.push(selector);
      });
    });

    return candidates;
  }

  function readSouthSurfacePointerLens() {
    var resolved = resolveAuthority(SOUTH_SIDECAR_ALIASES);
    var authority = resolved.authority;

    var packetRead = readAuthorityPacket(authority, [
      "getSurfacePointerLensReport",
      "getSouthSurfacePointerLensReport",
      "getLensReport",
      "getReport",
      "getReceipt",
      "getReceiptLight",
      "getStatus",
      "getState"
    ]);

    var packet = packetRead.packet || {};

    var sidecarStatus = firstKnown(
      readRaw(packet, "SIDE_CAR", ""),
      readRaw(packet, "sideCar", ""),
      readRaw(packet, "sidecar", ""),
      readRaw(packet, "SOUTH_SURFACE_POINTER_LENS", ""),
      readRaw(packet, "southSurfacePointerLens", ""),
      readRaw(packet, "lensStatus", ""),
      readRaw(packet, "LENS_STATUS", "")
    );

    var surfaceClass = firstKnown(
      readRaw(packet, "SURFACE", ""),
      readRaw(packet, "surface", ""),
      readRaw(packet, "surfaceClass", ""),
      readRaw(packet, "SURFACE_CLASS", ""),
      readRaw(packet, "INSPECTED_SURFACE_CLASS", ""),
      readRaw(packet, "inspectedSurfaceClass", ""),
      readRaw(packet, "surfaceType", ""),
      readRaw(packet, "SURFACE_TYPE", "")
    );

    var canvasBlameGate = firstKnown(
      readRaw(packet, "CANVAS_BLAME_GATE", ""),
      readRaw(packet, "canvasBlameGate", ""),
      readRaw(packet, "CANVAS_BLAME_ELIGIBLE", ""),
      readRaw(packet, "canvasBlameEligible", ""),
      "UNKNOWN"
    );

    var consumed =
      sidecarStatus === SOUTH_LENS_REQUIRED_STATUS ||
      safeBool(readRaw(packet, "SOUTH_SURFACE_POINTER_LENS_CONSUMED", false), false) ||
      safeBool(readRaw(packet, "southSurfacePointerLensConsumed", false), false) ||
      safeBool(readRaw(packet, "SOUTH_SURFACE_POINTER_LENS_REPORT_PRESENT", false), false) ||
      safeBool(readRaw(packet, "southSidecarLensReportPresent", false), false);

    var productionSurface =
      surfaceClass === PRODUCTION_SURFACE_CLASS ||
      surfaceClass === "PRODUCTION_CANVAS" ||
      surfaceClass === "CANVAS_SURFACE" ||
      safeBool(readRaw(packet, "SOUTH_SURFACE_POINTER_LENS_CONSUMED", false), false);

    var facts = {
      sourceAlias: resolved.alias,
      authorityPresent: resolved.present,
      readMethod: packetRead.method,
      readAttempted: packetRead.attempted,
      readError: packetRead.error,
      sidecarStatus: sidecarStatus || "UNKNOWN",
      surfaceClass: surfaceClass || "UNKNOWN",
      canvasBlameGate: canvasBlameGate || "UNKNOWN",
      lensConsumed: Boolean(consumed),
      productionCanvasSurface: Boolean(productionSurface),
      rawPacket: clone(packet)
    };

    facts.mountSelectorCandidates = getLensSelectorCandidates(facts, "mount");
    facts.canvasSelectorCandidates = getLensSelectorCandidates(facts, "canvas");

    return facts;
  }

  function findCanvasElement(lensFacts, explicitMount) {
    var selectors = [];

    if (lensFacts && Array.isArray(lensFacts.canvasSelectorCandidates)) {
      selectors = selectors.concat(lensFacts.canvasSelectorCandidates);
    }

    selectors = selectors.concat(CANVAS_SELECTOR_CANDIDATES);

    if (explicitMount) {
      try {
        var mountedCanvas = explicitMount.querySelector("canvas");
        if (mountedCanvas) {
          return {
            element: mountedCanvas,
            source: "MOUNT_QUERY_CANVAS",
            selector: elementSelectorSignature(mountedCanvas)
          };
        }
      } catch (_error) {}
    }

    var found = pickFirstElement(selectors);

    return {
      element: found,
      source: found ? "SELECTOR_CANDIDATE" : "NONE",
      selector: found ? elementSelectorSignature(found) : "NONE"
    };
  }

  function findMountElement(lensFacts, canvas) {
    var selectors = [];

    if (lensFacts && Array.isArray(lensFacts.mountSelectorCandidates)) {
      selectors = selectors.concat(lensFacts.mountSelectorCandidates);
    }

    selectors = selectors.concat(MOUNT_SELECTOR_CANDIDATES);

    var explicit = pickFirstElement(selectors);

    if (explicit) {
      return {
        element: explicit,
        source: "EXPLICIT_OR_LENS_SELECTOR",
        selector: elementSelectorSignature(explicit)
      };
    }

    if (canvas) {
      var inferred = closestMountLike(canvas);
      if (inferred) {
        return {
          element: inferred,
          source: "INFERRED_FROM_CANVAS_PARENT_CHAIN",
          selector: elementSelectorSignature(inferred)
        };
      }
    }

    return {
      element: null,
      source: "NONE",
      selector: "NONE"
    };
  }

  function readCanvasContext(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) {
      return {
        ready: false,
        readable: false,
        reason: "CANVAS_ELEMENT_NOT_AVAILABLE"
      };
    }

    try {
      var ctx = canvas.getContext("2d", { willReadFrequently: true });
      return {
        ready: Boolean(ctx),
        readable: Boolean(ctx),
        contextType: ctx ? "2d" : "NONE",
        reason: ctx ? "CANVAS_CONTEXT_2D_READY" : "CANVAS_CONTEXT_2D_NOT_READY",
        context: ctx
      };
    } catch (error) {
      return {
        ready: false,
        readable: false,
        contextType: "ERROR",
        reason: "CANVAS_CONTEXT_2D_READ_ERROR",
        error: safeString(error && error.message ? error.message : error)
      };
    }
  }

  function sampleCanvasPixels(canvas, ctx) {
    if (!canvas || !ctx) {
      return {
        attempted: false,
        readable: false,
        visible: false,
        sampleCount: 0,
        visibleSampleCount: 0,
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    var width = Number(canvas.width || 0);
    var height = Number(canvas.height || 0);

    if (width <= 0 || height <= 0) {
      return {
        attempted: false,
        readable: false,
        visible: false,
        sampleCount: 0,
        visibleSampleCount: 0,
        reason: "CANVAS_BITMAP_ZERO_SIZE"
      };
    }

    var points = [
      [Math.floor(width / 2), Math.floor(height / 2)],
      [Math.floor(width * 0.25), Math.floor(height / 2)],
      [Math.floor(width * 0.75), Math.floor(height / 2)],
      [Math.floor(width / 2), Math.floor(height * 0.25)],
      [Math.floor(width / 2), Math.floor(height * 0.75)]
    ];

    var visibleCount = 0;
    var readCount = 0;

    try {
      for (var i = 0; i < points.length; i += 1) {
        var x = Math.max(0, Math.min(width - 1, points[i][0]));
        var y = Math.max(0, Math.min(height - 1, points[i][1]));
        var data = ctx.getImageData(x, y, 1, 1).data;
        readCount += 1;

        if (data && (data[3] > 0 || data[0] > 0 || data[1] > 0 || data[2] > 0)) {
          visibleCount += 1;
        }
      }

      return {
        attempted: true,
        readable: true,
        visible: visibleCount > 0,
        sampleCount: readCount,
        visibleSampleCount: visibleCount,
        reason: visibleCount > 0 ? "CANVAS_PIXEL_VISIBLE" : "CANVAS_PIXEL_NOT_VISIBLE"
      };
    } catch (error) {
      return {
        attempted: true,
        readable: false,
        visible: false,
        sampleCount: readCount,
        visibleSampleCount: visibleCount,
        reason: "CANVAS_PIXEL_SAMPLE_UNREADABLE",
        error: safeString(error && error.message ? error.message : error)
      };
    }
  }

  function detectContractFamily(contract) {
    var text = safeString(contract);

    if (!text) return "UNKNOWN";
    if (/HEARTH_ROUTE_CONDUCTOR/i.test(text)) return "HEARTH_ROUTE_CONDUCTOR";
    if (/HEARTH_CONTROLS/i.test(text)) return "HEARTH_CONTROLS";
    if (/HEARTH_HEX_FOUR_PAIR|HEX_FOUR_PAIR_PIXEL_HANDSHAKE/i.test(text)) return "HEARTH_HEX_AUTHORITY";
    if (/HEARTH_HEX_SURFACE/i.test(text)) return "HEARTH_HEX_SURFACE";
    if (/HEARTH_CANVAS_FINGER_INSPECT/i.test(text)) return "HEARTH_CANVAS_FINGER_INSPECT";
    if (/HEARTH_CANVAS_FINGER_SURFACE/i.test(text)) return "HEARTH_CANVAS_FINGER_SURFACE";
    if (/HEARTH_CANVAS_CHAPEL|HEARTH_CANVAS_HUB_INSPECT_ASSETS_CHAPEL/i.test(text)) return "HEARTH_CANVAS_CHAPEL_INSPECT";
    if (/HEARTH_CANVAS_HUB|HEARTH_CANVAS/i.test(text)) return "HEARTH_CANVAS_HUB";
    if (/HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH/i.test(text)) return "HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE";
    if (/HEARTH_DIAGNOSTIC_PROBE/i.test(text)) return "HEARTH_DIAGNOSTIC_PROBE";
    if (/HEARTH_DIAGNOSTIC/i.test(text)) return "HEARTH_DIAGNOSTIC";
    if (/LAB_RUNTIME_TABLE.*WEST|CARDINAL_WEST/i.test(text)) return "LAB_WEST";
    if (/LAB_RUNTIME_TABLE/i.test(text)) return "LAB_NORTH";

    return "UNKNOWN";
  }

  function readEndpoint(endpoint) {
    var resolved = resolveAuthority(endpoint.aliases || []);
    var observed = resolved.authority;

    if (!observed || (typeof observed !== "object" && typeof observed !== "function")) {
      return {
        observed: false,
        alias: resolved.alias,
        contract: "",
        receipt: "",
        family: "UNKNOWN"
      };
    }

    var packetRead = readAuthorityPacket(observed, [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getStatus",
      "getState"
    ]);

    var packet = packetRead.packet || {};
    var contract = firstKnown(contractOf(packet), contractOf(observed));
    var receipt = firstKnown(receiptOf(packet), receiptOf(observed));

    return {
      observed: true,
      alias: resolved.alias,
      contract: contract,
      receipt: receipt,
      family: detectContractFamily(contract),
      valueType: typeof observed,
      receiptReadMethod: packetRead.method,
      receiptReadError: packetRead.error
    };
  }

  function inspectContainerBoundaries() {
    var result = {};

    Object.keys(EXPECTED_ENDPOINTS).forEach(function (key) {
      var endpoint = EXPECTED_ENDPOINTS[key];
      var read = readEndpoint(endpoint);
      var status = "NOT_OBSERVED";
      var collapseRisk = false;
      var borrowedContractTextRejected = false;

      if (read.observed && read.family === endpoint.family) {
        status = "CONTAINER_CONFIRMED";
      } else if (read.observed && read.family !== endpoint.family) {
        status = "BORROWED_CONTRACT_TEXT_REJECTED";
        collapseRisk = true;
        borrowedContractTextRejected = true;
      }

      result[key] = {
        file: endpoint.file,
        expectedFamily: endpoint.family,
        observed: read.observed,
        observedAlias: read.alias,
        observedContract: read.contract,
        observedFamily: read.family,
        status: status,
        containerCollapseRisk: collapseRisk,
        borrowedContractTextRejected: borrowedContractTextRejected,
        finalArbitrationClaimed: false,
        repairAuthorized: false
      };
    });

    if (
      result.CHAPEL_2_INSPECT_PRIEST &&
      result.CHAPEL_2_INSPECT_PRIEST.status === "CONTAINER_CONFIRMED"
    ) {
      result.CHAPEL_2_INSPECT_PRIEST.maySatisfyChapel1Priest = false;
      result.CHAPEL_2_INSPECT_PRIEST.chapel1PriestSubstitutionRejected = true;
    }

    return result;
  }

  function resolveSurfaceElements(lensFacts) {
    var provisionalMount = pickFirstElement(
      (lensFacts.mountSelectorCandidates || []).concat(MOUNT_SELECTOR_CANDIDATES)
    );

    var canvasRecord = findCanvasElement(lensFacts, provisionalMount);
    var mountRecord = findMountElement(lensFacts, canvasRecord.element);

    return {
      mountRecord: mountRecord,
      canvasRecord: canvasRecord
    };
  }

  function inspectCanvasSurface() {
    var southLens = readSouthSurfacePointerLens();
    var resolved = resolveSurfaceElements(southLens);

    var mount = resolved.mountRecord.element;
    var canvas = resolved.canvasRecord.element;

    var mountRect = readRect(mount);
    var canvasRect = readRect(canvas);
    var contextRead = readCanvasContext(canvas);
    var pixelSample = sampleCanvasPixels(canvas, contextRead.context);

    delete contextRead.context;

    var canvasBitmapWidth = canvas ? Number(canvas.width || 0) : 0;
    var canvasBitmapHeight = canvas ? Number(canvas.height || 0) : 0;

    var canonicalMountResolved = Boolean(mount);
    var canonicalMountResolvedByProductionLens =
      Boolean(southLens.lensConsumed && southLens.productionCanvasSurface && mount);
    var canonicalMountResolvedByCanvasParent =
      resolved.mountRecord.source === "INFERRED_FROM_CANVAS_PARENT_CHAIN";

    var productionSurfaceLensConsumed = Boolean(
      southLens.lensConsumed && southLens.productionCanvasSurface
    );

    var frameIntersects = Boolean(
      mountRect.viewportIntersecting || canvasRect.viewportIntersecting
    );

    var mountOrCanvasRectNonzero = Boolean(mountRect.nonzero || canvasRect.nonzero);

    var status = "SURFACE_CONTRACT_MEASUREMENT_COMPLETE";
    var firstFailedCoordinate = "NONE";
    var failureClass = "NONE";

    if (!canonicalMountResolved) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_MOUNT_EXISTS";
      failureClass = productionSurfaceLensConsumed
        ? "PRODUCTION_SURFACE_LENS_TARGET_UNRESOLVED"
        : "CANONICAL_MOUNT_MISSING";
    } else if (!mountOrCanvasRectNonzero) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_MOUNT_OR_CANVAS_RECT_NONZERO";
      failureClass = "CANONICAL_MOUNT_ZERO_RECT";
    } else if (!canvas) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_CANVAS_ELEMENT_EXISTS";
      failureClass = "CANONICAL_CANVAS_ELEMENT_MISSING";
    } else if (!canvasRect.nonzero) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_CANVAS_ELEMENT_RECT_NONZERO";
      failureClass = "CANONICAL_CANVAS_ELEMENT_ZERO_RECT";
    } else if (!frameIntersects) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_FRAME_VIEWPORT_INTERSECTION";
      failureClass = "CANONICAL_FRAME_ZERO_VIEWPORT_INTERSECTION";
    } else if (canvasBitmapWidth <= 0 || canvasBitmapHeight <= 0) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANVAS_BITMAP_SIZE_NONZERO";
      failureClass = "CANVAS_BITMAP_ZERO_SIZE";
    } else if (!contextRead.ready) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANVAS_CONTEXT_2D_READY";
      failureClass = contextRead.reason || "CANVAS_CONTEXT_2D_NOT_READY";
    } else if (!pixelSample.visible) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANVAS_PIXEL_VISIBLE";
      failureClass = pixelSample.reason || "CANVAS_PIXEL_NOT_VISIBLE";
    }

    var canvasBlameEligible =
      status === "SURFACE_CONTRACT_MEASUREMENT_FAILED" &&
      firstFailedCoordinate !== "CANONICAL_MOUNT_EXISTS" &&
      southLens.canvasBlameGate !== "UNKNOWN" &&
      safeBool(southLens.canvasBlameGate, false);

    return {
      status: status,
      failureClass: failureClass,
      firstFailedCoordinate: firstFailedCoordinate,

      southSurfacePointerLens: southLens,
      productionSurfaceLensConsumed: productionSurfaceLensConsumed,
      productionCanvasSurfaceConfirmed: Boolean(southLens.productionCanvasSurface),
      canvasBlameGate: southLens.canvasBlameGate || "UNKNOWN",
      canvasBlameEligible: canvasBlameEligible,

      mountResolution: {
        found: Boolean(mount),
        source: resolved.mountRecord.source,
        selector: resolved.mountRecord.selector,
        resolvedByProductionSurfaceLens: canonicalMountResolvedByProductionLens,
        resolvedByCanvasParentChain: canonicalMountResolvedByCanvasParent,
        rect: mountRect,
        parentChain: parentChain(mount, 10)
      },

      canvasResolution: {
        found: Boolean(canvas),
        source: resolved.canvasRecord.source,
        selector: resolved.canvasRecord.selector,
        rect: canvasRect,
        bitmapWidth: canvasBitmapWidth,
        bitmapHeight: canvasBitmapHeight,
        parentChain: parentChain(canvas, 10)
      },

      context2d: contextRead,
      pixelSample: pixelSample,

      canvasElementFound: Boolean(canvas),
      canvasContext2dReady: Boolean(contextRead.ready),
      canvasRectNonzero: Boolean(canvasRect.nonzero),
      canvasMountRectNonzero: Boolean(mountRect.nonzero),
      canonicalMountResolved: canonicalMountResolved,
      canonicalMountResolvedByProductionLens: canonicalMountResolvedByProductionLens,
      canonicalMountResolvedByCanvasParent: canonicalMountResolvedByCanvasParent,
      canvasViewportIntersecting: frameIntersects,
      canvasPixelVisible: Boolean(pixelSample.visible),

      finalVisualPassClaimed: false,
      repairAuthorized: false
    };
  }

  function evaluateDutyLoad() {
    var metric = {
      PRIMARY_DUTY_COUNT: 1,
      SECONDARY_DUTY_COUNT: 5,
      OWNERSHIP_DOMAIN_COUNT: 1,
      MUTATION_AUTHORITY_COUNT: 0,
      WRITE_AUTHORITY_COUNT: 0,
      LIFECYCLE_METHOD_COUNT: 0,
      DOWNSTREAM_SERVICE_COUNT: 0,
      UPSTREAM_DEPENDENCY_COUNT: 2,
      FAN_IN_COUNT: 3,
      FAN_OUT_COUNT: 2,
      CONTRACT_FAMILY_REFERENCED_COUNT: Object.keys(EXPECTED_ENDPOINTS).length,
      ALIAS_SURFACE_COUNT:
        Object.keys(EXPECTED_ENDPOINTS).reduce(function (sum, key) {
          return sum + EXPECTED_ENDPOINTS[key].aliases.length;
        }, 0) + SOUTH_SIDECAR_ALIASES.length,
      RENDER_OR_INPUT_COUPLING_PRESENT: false
    };

    var score =
      metric.PRIMARY_DUTY_COUNT * 4 +
      metric.SECONDARY_DUTY_COUNT +
      metric.OWNERSHIP_DOMAIN_COUNT * 3 +
      metric.MUTATION_AUTHORITY_COUNT * 6 +
      metric.WRITE_AUTHORITY_COUNT * 5 +
      metric.FAN_OUT_COUNT +
      metric.CONTRACT_FAMILY_REFERENCED_COUNT;

    var status = "DUTY_LOAD_SAFE";
    if (score >= 18) status = "DUTY_LOAD_HEAVY_NON_COLLAPSED";
    if (score >= 28) status = "DUTY_LOAD_COLLAPSE_RISK";
    if (score >= 40 || metric.MUTATION_AUTHORITY_COUNT > 0 || metric.WRITE_AUTHORITY_COUNT > 0) {
      status = "DUTY_LOAD_COLLAPSE_DETECTED";
    }

    metric.DUTY_LOAD_SCORE = score;
    metric.DUTY_LOAD_STATUS = status;

    return metric;
  }

  function selfMeasureDiagnosticDuty() {
    var duty = evaluateDutyLoad();

    var dutyDrift =
      PROFILE.OWNS_FINAL_ARBITRATION ||
      PROFILE.OWNS_WEST_DERIVATIVE_MAP ||
      PROFILE.OWNS_NORTH_GRAMMAR ||
      PROFILE.OWNS_NORTH_RAIL ||
      PROFILE.OWNS_CANVAS_PRODUCTION_REPAIR ||
      PROFILE.OWNS_CANVAS_BUILD_AUTHORITY ||
      PROFILE.MAY_FORCE_RECEIPT_RETURN;

    var malpractice = duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_DETECTED" || dutyDrift === true;

    return {
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: PROFILE_ROLE,
      PROFILE_CLASS: PROFILE_CLASS,
      CYCLE_POSITION: CYCLE_POSITION,

      ALLOWED_DUTIES: [
        "DETAILED_CANVAS_CONTRACT_DEFINITION",
        "PRODUCTION_SURFACE_LENS_ALIGNMENT",
        "FINE_BOUNDARY_DISAMBIGUATION",
        "CROSS_CONTAINER_COLLAPSE_DETECTION",
        "DUTY_LOAD_SELF_MEASUREMENT",
        "DIAGNOSTIC_MALPRACTICE_GUARD"
      ],
      FORBIDDEN_DUTIES: [
        "FINAL_ARBITRATION",
        "WEST_DERIVATIVE_MAP",
        "NORTH_GRAMMAR",
        "NORTH_RAIL",
        "CANVAS_PRODUCTION_REPAIR",
        "CANVAS_BUILD_AUTHORITY",
        "FORCED_RECEIPT_RETURN"
      ],

      PRIMARY_DUTY_COUNT: duty.PRIMARY_DUTY_COUNT,
      SECONDARY_DUTY_COUNT: duty.SECONDARY_DUTY_COUNT,
      DUTY_LOAD_SCORE: duty.DUTY_LOAD_SCORE,
      DUTY_LOAD_STATUS: duty.DUTY_LOAD_STATUS,

      FORBIDDEN_DUTY_COUNT: dutyDrift ? 1 : 0,
      BORROWED_DUTY_COUNT: 0,

      ARBITRATION_AUTHORITY_ALLOWED: false,
      CONTRACT_DEFINITION_AUTHORITY_ALLOWED: true,
      MEASUREMENT_AUTHORITY_ALLOWED: true,
      PACKET_OUTPUT_AUTHORITY_ALLOWED: true,
      PRODUCTION_MUTATION_AUTHORITY_ALLOWED: false,

      DUTY_DRIFT_DETECTED: dutyDrift,
      DIAGNOSTIC_CONTAINER_COLLAPSE_RISK: duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_RISK",
      DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED: duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_DETECTED",
      DIAGNOSTIC_MALPRACTICE_DETECTED: malpractice,
      DIAGNOSTIC_OUTPUT_QUARANTINED: malpractice,
      SELF_MEASUREMENT_STATUS: malpractice
        ? "DIAGNOSTIC_MALPRACTICE_DETECTED"
        : duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_RISK"
          ? "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK"
          : duty.DUTY_LOAD_STATUS === "DUTY_LOAD_HEAVY_NON_COLLAPSED"
            ? "DIAGNOSTIC_SELF_DUTY_HEAVY_NON_COLLAPSED"
            : "DIAGNOSTIC_SELF_DUTY_CLEAN"
    };
  }

  function composeProfileReceipt() {
    return Object.assign(
      {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PROFILE_RECEIPT_PACKET_v3",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
        PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
        COMPAT_CONTRACT: COMPAT_CONTRACT,
        FILE: FILE,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        VERSION: VERSION,
        GENERATED_AT: nowIso(),

        UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
        PROFILE_ROLE: PROFILE_ROLE,
        PROFILE_CLASS: PROFILE_CLASS,
        CYCLE_POSITION: CYCLE_POSITION,

        SOUTH_SURFACE_POINTER_LENS_ALIGNMENT_ACTIVE: true,
        SOUTH_SURFACE_POINTER_LENS_REQUIRED_STATUS: SOUTH_LENS_REQUIRED_STATUS,
        PRODUCTION_SURFACE_CLASS: PRODUCTION_SURFACE_CLASS,
        PRODUCTION_CANVAS_SURFACE_LENS_ACCEPTED_AS_EVIDENCE: true,
        CANVAS_PARENT_CHAIN_MAY_RESOLVE_CANONICAL_MOUNT: true,
        CANONICAL_MOUNT_STALE_SELECTOR_FAILURE_PREVENTION_ACTIVE: true,

        LABWEST_CONSTRUCT_IS_CONTROLLING_DIAGNOSTIC_DERIVATIVE: true,
        NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_SURFACE_TRUTH_AS_EVIDENCE: true,
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
        MAY_FORCE_RECEIPT_RETURN: false,

        DIAGNOSTIC_CYCLE_DECLARED: DIAGNOSTIC_CYCLE.join(" -> "),
        CANVAS_CYCLE_DECLARED: CANVAS_CYCLE.join(" -> "),

        SELF_MEASUREMENT_STATUS: selfMeasureDiagnosticDuty().SELF_MEASUREMENT_STATUS,
        DIAGNOSTIC_MALPRACTICE_GUARD_ACTIVE: true
      },
      NO_CLAIMS
    );
  }

  function composeContractDefinitionPacket() {
    return Object.assign(
      {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT_DEFINITION_PACKET_v3",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
        COMPAT_CONTRACT: COMPAT_CONTRACT,
        FILE: FILE,
        GENERATED_AT: nowIso(),

        UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
        PROFILE_ROLE: PROFILE_ROLE,
        PROFILE_CLASS: PROFILE_CLASS,
        CYCLE_POSITION: CYCLE_POSITION,

        diagnosticCycle: DIAGNOSTIC_CYCLE.slice(),
        canvasCycle: CANVAS_CYCLE.slice(),
        profile: clone(PROFILE),
        contractDefinitions: clone(CONTRACT_DEFINITIONS),
        expectedEndpoints: clone(EXPECTED_ENDPOINTS),
        mountSelectorCandidates: MOUNT_SELECTOR_CANDIDATES.slice(),
        canvasSelectorCandidates: CANVAS_SELECTOR_CANDIDATES.slice(),
        southSidecarAliases: SOUTH_SIDECAR_ALIASES.slice(),
        selfMeasurement: selfMeasureDiagnosticDuty(),

        FINAL_ARBITRATION_EXPLICITLY_EXCLUDED: true,
        PRODUCTION_REPAIR_EXPLICITLY_EXCLUDED: true,
        WEST_DERIVATIVE_MAP_EXPLICITLY_EXCLUDED: true,
        NORTH_GRAMMAR_EXPLICITLY_EXCLUDED: true,
        NORTH_RAIL_EXPLICITLY_EXCLUDED: true,
        FORCED_RECEIPT_RETURN_EXPLICITLY_EXCLUDED: true
      },
      NO_CLAIMS
    );
  }

  function inspect() {
    state.inspectionCount += 1;
    state.lastInspectionAt = nowIso();

    try {
      var self = selfMeasureDiagnosticDuty();
      var surface = inspectCanvasSurface();
      var containers = inspectContainerBoundaries();

      var collapseRiskCount = Object.keys(containers).reduce(function (sum, key) {
        return sum + (containers[key].containerCollapseRisk ? 1 : 0);
      }, 0);

      var packet = Object.assign(
        {
          PACKET_NAME:
            "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_INSPECTION_PACKET_v3",
          CONTRACT: CONTRACT,
          RECEIPT: RECEIPT,
          PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
          COMPAT_CONTRACT: COMPAT_CONTRACT,
          FILE: FILE,
          TARGET_ROUTE: TARGET_ROUTE,
          DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
          INSPECTED_AT: state.lastInspectionAt,
          INSPECTION_COUNT: state.inspectionCount,

          UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
          PROFILE_ROLE: PROFILE_ROLE,
          PROFILE_CLASS: PROFILE_CLASS,
          CYCLE_POSITION: CYCLE_POSITION,

          PROFILE_RECEIPT_RETURNED: true,
          FORCED_NORTH_RAIL_RECEIPT_RETURN: false,

          SOUTH_SURFACE_POINTER_LENS_ALIGNMENT_ACTIVE: true,
          SOUTH_SURFACE_POINTER_LENS_CONSUMED:
            surface.southSurfacePointerLens && surface.southSurfacePointerLens.lensConsumed,
          INSPECTED_SURFACE_CLASS:
            surface.southSurfacePointerLens && surface.southSurfacePointerLens.surfaceClass,
          PRODUCTION_CANVAS_SURFACE_CONFIRMED: surface.productionCanvasSurfaceConfirmed,

          surfaceContractsDefined: clone(CONTRACT_DEFINITIONS),
          surfaceMeasurement: surface,
          containerBoundaryMeasurement: containers,
          selfMeasurement: self,

          CANVAS_SURFACE_TRUTH_STATUS: surface.status,
          CANVAS_SURFACE_TRUTH_FAILURE_CLASS: surface.failureClass,
          CANVAS_TRUTH_FIRST_FAILED_COORDINATE: surface.firstFailedCoordinate,

          CANONICAL_MOUNT_RESOLVED: surface.canonicalMountResolved,
          CANONICAL_MOUNT_RESOLVED_BY_PRODUCTION_LENS:
            surface.canonicalMountResolvedByProductionLens,
          CANONICAL_MOUNT_RESOLVED_BY_CANVAS_PARENT:
            surface.canonicalMountResolvedByCanvasParent,

          CANVAS_MOUNT_RECT_NONZERO: surface.canvasMountRectNonzero,
          CANVAS_RECT_NONZERO: surface.canvasRectNonzero,
          CANVAS_CONTEXT_2D_READY: surface.canvasContext2dReady,
          CANVAS_VIEWPORT_INTERSECTING: surface.canvasViewportIntersecting,
          CANVAS_PIXEL_VISIBLE: surface.canvasPixelVisible,

          CONTAINER_COLLAPSE_RISK_COUNT: collapseRiskCount,
          SURFACE_TRUTH_SELF_MEASUREMENT_STATUS: self.SELF_MEASUREMENT_STATUS,
          DIAGNOSTIC_MALPRACTICE_STATUS: self.DIAGNOSTIC_MALPRACTICE_DETECTED
            ? "DIAGNOSTIC_MALPRACTICE_DETECTED"
            : "NO_DIAGNOSTIC_MALPRACTICE",

          CANVAS_BLAME_GATE:
            surface.southSurfacePointerLens && surface.southSurfacePointerLens.canvasBlameGate
              ? surface.southSurfacePointerLens.canvasBlameGate
              : "UNKNOWN",
          CANVAS_BLAME_ELIGIBLE: surface.canvasBlameEligible,

          RECOMMENDED_NEXT_FILE:
            surface.status === "SURFACE_CONTRACT_MEASUREMENT_COMPLETE" ? "" : FILE,
          NEXT_PROCESS:
            surface.status === "SURFACE_CONTRACT_MEASUREMENT_COMPLETE"
              ? "RETURN_SURFACE_TRUTH_ALIGNMENT_TO_NORTH_AND_WEST"
              : "CONTINUE_SURFACE_TRUTH_CONTRACT_DEFINITION_ALIGNMENT_BEFORE_CANVAS_BUILD",
          NEXT_FILE_AUTHORIZATION: false,
          FINAL_ARBITRATION: false,
          PRODUCTION_REPAIR_AUTHORIZED: false
        },
        NO_CLAIMS
      );

      state.lastInspectionPacket = clone(packet);
      return clone(packet);
    } catch (error) {
      state.errorCount += 1;
      state.errors.push({
        at: nowIso(),
        message: safeString(error && error.message ? error.message : error)
      });

      return Object.assign(
        {
          PACKET_NAME:
            "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INSPECTION_ERROR_PACKET_v3",
          CONTRACT: CONTRACT,
          RECEIPT: RECEIPT,
          FILE: FILE,
          INSPECTED_AT: nowIso(),
          CANVAS_SURFACE_TRUTH_STATUS: "SURFACE_CONTRACT_MEASUREMENT_ERROR",
          CANVAS_SURFACE_TRUTH_FAILURE_CLASS: "SURFACE_TRUTH_PROBE_ERROR",
          CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "SURFACE_TRUTH_PROBE_EXECUTION",
          ERROR_MESSAGE: safeString(error && error.message ? error.message : error),
          FINAL_ARBITRATION: false,
          PRODUCTION_REPAIR_AUTHORIZED: false
        },
        NO_CLAIMS
      );
    }
  }

  function getProfile() {
    return clone(PROFILE);
  }

  function getContractDefinitions() {
    return clone(CONTRACT_DEFINITIONS);
  }

  function getExpectedEndpoints() {
    return clone(EXPECTED_ENDPOINTS);
  }

  function getDiagnosticCycle() {
    return DIAGNOSTIC_CYCLE.slice();
  }

  function getCanvasCycle() {
    return CANVAS_CYCLE.slice();
  }

  function getReceipt() {
    state.lastProfileReceipt = composeProfileReceipt();
    return clone(state.lastProfileReceipt);
  }

  function getReceiptLight() {
    return getReceipt();
  }

  function getReceiptText() {
    var receipt = composeProfileReceipt();
    return Object.keys(receipt)
      .map(function (key) {
        return key + "=" + String(receipt[key]);
      })
      .join("\n");
  }

  function getContractDefinitionReceipt() {
    return composeContractDefinitionPacket();
  }

  function getState() {
    return clone({
      publishedAt: state.publishedAt,
      lastInspectionAt: state.lastInspectionAt,
      inspectionCount: state.inspectionCount,
      errorCount: state.errorCount,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      compatContract: COMPAT_CONTRACT,
      profileRole: PROFILE_ROLE,
      profileClass: PROFILE_CLASS,
      cyclePosition: CYCLE_POSITION,
      southSurfacePointerLensAlignmentActive: true,
      ownsFinalArbitration: false,
      ownsCanvasBuildAuthority: false,
      ownsCanvasRepairAuthority: false,
      productionMutationAuthorized: false
    });
  }

  function noOpLifecycle() {
    return getReceipt();
  }

  var API = {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    FILE: FILE,
    VERSION: VERSION,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    compatContract: COMPAT_CONTRACT,
    file: FILE,
    version: VERSION,

    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

    UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
    PROFILE_ROLE: PROFILE_ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,

    SOUTH_SURFACE_POINTER_LENS_ALIGNMENT_ACTIVE: true,
    SOUTH_SURFACE_POINTER_LENS_REQUIRED_STATUS: SOUTH_LENS_REQUIRED_STATUS,
    PRODUCTION_SURFACE_CLASS: PRODUCTION_SURFACE_CLASS,

    boot: noOpLifecycle,
    init: noOpLifecycle,
    start: noOpLifecycle,
    mount: noOpLifecycle,
    refresh: getReceipt,

    run: inspect,
    inspect: inspect,
    probe: inspect,
    measure: inspect,
    inspectCanvasSurface: inspectCanvasSurface,
    inspectContainerBoundaries: inspectContainerBoundaries,
    readSouthSurfacePointerLens: readSouthSurfacePointerLens,

    getProfile: getProfile,
    getState: getState,
    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    getProfileReceipt: getReceipt,
    getReceiptText: getReceiptText,
    composeProfileReceipt: composeProfileReceipt,
    getContractDefinitions: getContractDefinitions,
    getContractDefinitionReceipt: getContractDefinitionReceipt,
    composeContractDefinitionPacket: composeContractDefinitionPacket,
    getExpectedEndpoints: getExpectedEndpoints,
    getDiagnosticCycle: getDiagnosticCycle,
    getCanvasCycle: getCanvasCycle,

    detectContractFamily: detectContractFamily,
    selfMeasureDiagnosticDuty: selfMeasureDiagnosticDuty,
    evaluateDutyLoad: evaluateDutyLoad,

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
    MAY_FORCE_RECEIPT_RETURN: false,

    finalArbitrationClaimed: false,
    westDerivativeMapClaimed: false,
    northGrammarClaimed: false,
    northRailClaimed: false,
    canvasProductionRepairClaimed: false,
    canvasBuildAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    routeRepairAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  };

  function publish() {
    var HEARTH = ensureNamespace("HEARTH");
    var DEXTER_LAB = ensureNamespace("DEXTER_LAB");

    state.publishedAt = nowIso();
    state.lastProfileReceipt = composeProfileReceipt();

    ROOT.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = API;
    ROOT.HEARTH_CANVAS_SURFACE_TRUTH_PROBE = API;
    ROOT.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE = API;
    ROOT.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT = API;

    HEARTH.diagnosticProbeCanvasSurfaceTruth = API;
    HEARTH.canvasSurfaceTruthProbe = API;
    HEARTH.CANVAS_SURFACE_TRUTH_PROBE = API;
    HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = API;
    HEARTH.diagnosticProbeCanvasSurfaceTruthProductionSurfaceLensAlignment = API;

    DEXTER_LAB.canvasSurfaceTruthProbe = API;
    DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth = API;
    DEXTER_LAB.canvasSurfaceTruthProductionSurfaceLensAlignment = API;

    ROOT.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PROFILE_RECEIPT =
      state.lastProfileReceipt;
    ROOT.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_RECEIPT =
      state.lastProfileReceipt;

    HEARTH.diagnosticProbeCanvasSurfaceTruthProfileReceipt = state.lastProfileReceipt;
    HEARTH.canvasSurfaceTruthProductionSurfaceLensAlignmentReceipt = state.lastProfileReceipt;

    DEXTER_LAB.canvasSurfaceTruthProbeProfileReceipt = state.lastProfileReceipt;
    DEXTER_LAB.canvasSurfaceTruthProductionSurfaceLensAlignmentReceipt =
      state.lastProfileReceipt;

    return API;
  }

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})();
