// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_TNT_v2
// Full-file replacement.
// Canvas Surface Truth Probe profile renewal.
// Diagnostic contract-definition instrument only.
// Fixed construct:
//   LabWest Construct -> Diagnostic Track Alignment -> Canvas Surface Truth Probe Profile
//   -> North Diagnostic Rail Consumption -> West Derivative Map -> Canvas Build
//
// Purpose:
// - Define delicate Canvas-cycle boundary contracts.
// - Measure Canvas mount/frame/canvas/context/pixel-surface facts when invoked.
// - Detect cross-container collapse and borrowed-contract substitution risk.
// - Publish Surface Truth Probe self-duty measurement.
// - Publish diagnostic-malpractice guard status.
// - Provide contract-definition packets for the diagnostic track and LabWest derivative diagnostic.
//
// Does not:
// - force North rail receipt return
// - final-arbitrate
// - issue Canvas repair authorization
// - mutate production files
// - draw Canvas
// - build Canvas
// - replace North grammar
// - replace LabWest derivative diagnostic
// - claim ready / F13 / F21 / final visual pass
//

(function () {
  "use strict";

  var ROOT = typeof window !== "undefined" ? window : globalThis;
  var DOC = typeof document !== "undefined" ? document : null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_TNT_v2";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_RECEIPT_v2";

  var COMPAT_CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";

  var FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var UPSTREAM_CONSTRUCT = "LABWEST_DERIVATIVE_CONSTRUCT";
  var PROFILE_ROLE = "CANVAS_SURFACE_TRUTH_PROBE";
  var PROFILE_CLASS = "DIAGNOSTIC_CONTRACT_DEFINITION_INSTRUMENT";
  var CYCLE_POSITION = "DIAGNOSTIC_TRACK_SURFACE_TRUTH_CONTRACT_DEFINITION_STAGE";

  var NO_CLAIMS = {
    OWNS_FINAL_ARBITRATION: false,
    OWNS_WEST_DERIVATIVE_MAP: false,
    OWNS_NORTH_GRAMMAR: false,
    OWNS_CANVAS_PRODUCTION_REPAIR: false,
    OWNS_CANVAS_BUILD_AUTHORITY: false,
    MAY_FORCE_RECEIPT_RETURN: false,

    finalArbitrationClaimed: false,
    westDerivativeMapClaimed: false,
    northGrammarClaimed: false,
    canvasProductionRepairClaimed: false,
    canvasBuildAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
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

  var PROFILE = {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    FILE: FILE,
    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

    UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
    PROFILE_ROLE: PROFILE_ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,

    OWNS_DETAILED_CANVAS_CONTRACT_DEFINITION: true,
    OWNS_FINE_BOUNDARY_DISAMBIGUATION: true,
    OWNS_CROSS_CONTAINER_COLLAPSE_DETECTION: true,
    OWNS_DUTY_LOAD_SELF_MEASUREMENT: true,
    OWNS_DIAGNOSTIC_MALPRACTICE_GUARD: true,

    OWNS_FINAL_ARBITRATION: false,
    OWNS_WEST_DERIVATIVE_MAP: false,
    OWNS_NORTH_GRAMMAR: false,
    OWNS_CANVAS_PRODUCTION_REPAIR: false,
    OWNS_CANVAS_BUILD_AUTHORITY: false,
    MAY_FORCE_RECEIPT_RETURN: false
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
    "EAST_SERVED_SOURCE_READ",
    "WEST_RENDERED_TARGET_READ",
    "CANVAS_SURFACE_TRUTH_CONTRACT_DEFINITION",
    "SOUTH_PACKET_MEANING",
    "NORTH_DIAGNOSTIC_TRACK_CONSUMPTION"
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
        "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4"
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
        "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
      ]
    }
  };

  var CONTRACT_DEFINITIONS = {
    CANONICAL_MOUNT_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Canvas mount container",
      selectorCandidates: ["#hearthCanvasMount", "section#hearthCanvasMount.globe-mount", ".globe-mount"],
      requiredFacts: [
        "mount element exists",
        "mount rect is nonzero",
        "mount parent chain is readable"
      ],
      failureClasses: [
        "CANONICAL_MOUNT_MISSING",
        "CANONICAL_MOUNT_ZERO_RECT",
        "CANONICAL_MOUNT_PARENT_CHAIN_UNREADABLE"
      ],
      repairAuthority: false
    },
    CANONICAL_FRAME_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "SURFACE_BOUNDARY_CONTRACT",
      subject: "Canvas viewport/intersection frame",
      requiredFacts: [
        "mount rect intersects viewport",
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
      subject: "Canvas DOM element",
      selectorCandidates: ["#hearthCanvas", "#hearthCanvasMount canvas", "canvas[data-hearth-canvas]", "canvas"],
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
        "context read does not require drawing"
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
    CHAPEL_1_CANVAS_HUB_CONTAINER_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "CONTAINER_BOUNDARY_CONTRACT",
      subject: "Chapel 1 assets Canvas hub",
      expectedFamily: "HEARTH_CANVAS_HUB",
      childMayReportToParent: true,
      childMayBecomeParent: false,
      siblingMaySubstitute: false
    },
    HEX_SURFACE_GATE_CONTAINER_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "CONTAINER_BOUNDARY_CONTRACT",
      subject: "Hex Surface Gate",
      expectedFamily: "HEARTH_HEX_SURFACE",
      mayReceiveCanvasText: true,
      mayUseCanvasTextAsOwnEndpointProof: false,
      borrowedContractTextRejected: true
    },
    CHAPEL_2_POINTER_SURFACE_BISHOP_CONTAINER_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "CONTAINER_BOUNDARY_CONTRACT",
      subject: "Chapel 2 Pointer Surface Bishop",
      expectedFamily: "HEARTH_CANVAS_FINGER_SURFACE",
      priestMayReportToBishop: true,
      priestMayBecomeBishop: false
    },
    CHAPEL_2_INSPECT_PRIEST_CONTAINER_CONTRACT: {
      owner: PROFILE_ROLE,
      class: "CONTAINER_BOUNDARY_CONTRACT",
      subject: "Chapel 2 Inspect Priest",
      expectedFamily: "HEARTH_CANVAS_FINGER_INSPECT",
      maySatisfyChapel1Priest: false,
      mayBecomePointerSurfaceBishop: false
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

  var state = {
    publishedAt: "",
    lastInspectionAt: "",
    lastProfileReceipt: null,
    lastInspectionPacket: null,
    inspectionCount: 0
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      if (Array.isArray(value)) return value.slice();
      if (value && typeof value === "object") {
        var out = {};
        Object.keys(value).forEach(function (key) {
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
    var parts = path.split(".");
    var cursor = ROOT;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || typeof cursor !== "object") return undefined;
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function pickFirstElement(selectors) {
    if (!DOC) return null;
    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = DOC.querySelector(selectors[i]);
        if (found) return found;
      } catch (_) {
        // Selector may be unsupported in an older browser.
      }
    }
    return null;
  }

  function readRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
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
        error: String(error && error.message ? error.message : error)
      };
    }
  }

  function parentChain(element, limit) {
    var out = [];
    var cursor = element || null;
    var count = 0;
    var max = limit || 8;

    while (cursor && count < max) {
      var tag = cursor.tagName ? String(cursor.tagName).toLowerCase() : "node";
      var id = cursor.id ? "#" + cursor.id : "";
      var cls =
        cursor.className && typeof cursor.className === "string"
          ? "." + cursor.className.trim().replace(/\s+/g, ".")
          : "";
      out.push(tag + id + cls);
      cursor = cursor.parentElement || null;
      count += 1;
    }

    return out;
  }

  function getMountElement() {
    return pickFirstElement([
      "#hearthCanvasMount",
      "section#hearthCanvasMount.globe-mount",
      ".globe-mount"
    ]);
  }

  function getCanvasElement(mount) {
    if (!DOC) return null;

    if (mount) {
      try {
        var mountedCanvas = mount.querySelector("canvas");
        if (mountedCanvas) return mountedCanvas;
      } catch (_) {
        // Continue to global selector candidates.
      }
    }

    return pickFirstElement([
      "#hearthCanvas",
      "canvas#hearthCanvas",
      "canvas[data-hearth-canvas]",
      "[data-hearth-canvas] canvas",
      "canvas"
    ]);
  }

  function readCanvasContext(canvas) {
    if (!canvas || typeof canvas.getContext !== "function") {
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
        error: String(error && error.message ? error.message : error)
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
        error: String(error && error.message ? error.message : error)
      };
    }
  }

  function detectContractFamily(contract) {
    var text = String(contract || "");

    if (!text) return "UNKNOWN";
    if (/HEARTH_ROUTE_CONDUCTOR/i.test(text)) return "HEARTH_ROUTE_CONDUCTOR";
    if (/HEARTH_CONTROLS/i.test(text)) return "HEARTH_CONTROLS";
    if (/HEARTH_HEX_FOUR_PAIR|HEX_FOUR_PAIR_PIXEL_HANDSHAKE/i.test(text)) {
      return "HEARTH_HEX_AUTHORITY";
    }
    if (/HEARTH_HEX_SURFACE/i.test(text)) return "HEARTH_HEX_SURFACE";
    if (/HEARTH_CANVAS_FINGER_INSPECT/i.test(text)) return "HEARTH_CANVAS_FINGER_INSPECT";
    if (/HEARTH_CANVAS_FINGER_SURFACE/i.test(text)) return "HEARTH_CANVAS_FINGER_SURFACE";
    if (/HEARTH_CANVAS_CHAPEL|HEARTH_CANVAS_HUB_INSPECT_ASSETS_CHAPEL/i.test(text)) {
      return "HEARTH_CANVAS_CHAPEL_INSPECT";
    }
    if (/HEARTH_CANVAS_HUB|HEARTH_CANVAS/i.test(text)) return "HEARTH_CANVAS_HUB";
    if (/HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH/i.test(text)) {
      return "HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE";
    }
    if (/HEARTH_DIAGNOSTIC/i.test(text)) return "HEARTH_DIAGNOSTIC";
    if (/LAB_RUNTIME_TABLE.*WEST|CARDINAL_WEST/i.test(text)) return "LAB_WEST";
    if (/LAB_RUNTIME_TABLE/i.test(text)) return "LAB_NORTH";

    return "UNKNOWN";
  }

  function readEndpoint(endpoint) {
    var aliases = endpoint && endpoint.aliases ? endpoint.aliases : [];
    var observed = null;
    var alias = "NONE";

    for (var i = 0; i < aliases.length; i += 1) {
      var candidate = readPath(aliases[i]);
      if (candidate !== undefined && candidate !== null) {
        observed = candidate;
        alias = aliases[i];
        break;
      }
    }

    if (!observed || typeof observed !== "object") {
      return {
        observed: false,
        alias: alias,
        contract: "",
        receipt: "",
        family: "UNKNOWN"
      };
    }

    var contract =
      observed.CONTRACT ||
      observed.contract ||
      observed.INTERNAL_RENEWAL_CONTRACT ||
      observed.internalRenewalContract ||
      observed.PUBLIC_CONTRACT ||
      "";

    var receipt =
      observed.RECEIPT ||
      observed.receipt ||
      observed.INTERNAL_RENEWAL_RECEIPT ||
      observed.internalRenewalReceipt ||
      "";

    return {
      observed: true,
      alias: alias,
      contract: String(contract || ""),
      receipt: String(receipt || ""),
      family: detectContractFamily(contract),
      valueType: typeof observed
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

  function inspectCanvasSurface() {
    var mount = getMountElement();
    var canvas = getCanvasElement(mount);
    var mountRect = readRect(mount);
    var canvasRect = readRect(canvas);
    var contextRead = readCanvasContext(canvas);
    var pixelSample = sampleCanvasPixels(canvas, contextRead.context);

    delete contextRead.context;

    var canvasBitmapWidth = canvas ? Number(canvas.width || 0) : 0;
    var canvasBitmapHeight = canvas ? Number(canvas.height || 0) : 0;

    var status = "SURFACE_CONTRACT_MEASUREMENT_COMPLETE";
    var firstFailedCoordinate = "NONE";
    var failureClass = "NONE";

    if (!mount) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_MOUNT_EXISTS";
      failureClass = "CANONICAL_MOUNT_MISSING";
    } else if (!mountRect.nonzero) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_MOUNT_RECT_NONZERO";
      failureClass = "CANONICAL_MOUNT_ZERO_RECT";
    } else if (!canvas) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_CANVAS_ELEMENT_EXISTS";
      failureClass = "CANONICAL_CANVAS_ELEMENT_MISSING";
    } else if (!canvasRect.nonzero) {
      status = "SURFACE_CONTRACT_MEASUREMENT_FAILED";
      firstFailedCoordinate = "CANONICAL_CANVAS_ELEMENT_RECT_NONZERO";
      failureClass = "CANONICAL_CANVAS_ELEMENT_ZERO_RECT";
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

    return {
      status: status,
      failureClass: failureClass,
      firstFailedCoordinate: firstFailedCoordinate,

      mount: {
        found: Boolean(mount),
        rect: mountRect,
        parentChain: parentChain(mount, 8)
      },
      canvas: {
        found: Boolean(canvas),
        rect: canvasRect,
        bitmapWidth: canvasBitmapWidth,
        bitmapHeight: canvasBitmapHeight,
        parentChain: parentChain(canvas, 8)
      },
      context2d: contextRead,
      pixelSample: pixelSample,

      canvasElementFound: Boolean(canvas),
      canvasContext2dReady: Boolean(contextRead.ready),
      canvasRectNonzero: Boolean(canvasRect.nonzero),
      canvasMountRectNonzero: Boolean(mountRect.nonzero),
      canvasViewportIntersecting: Boolean(canvasRect.viewportIntersecting || mountRect.viewportIntersecting),
      canvasPixelVisible: Boolean(pixelSample.visible),

      finalVisualPassClaimed: false,
      repairAuthorized: false
    };
  }

  function evaluateDutyLoad() {
    var metric = {
      PRIMARY_DUTY_COUNT: 1,
      SECONDARY_DUTY_COUNT: 4,
      OWNERSHIP_DOMAIN_COUNT: 1,
      MUTATION_AUTHORITY_COUNT: 0,
      WRITE_AUTHORITY_COUNT: 0,
      LIFECYCLE_METHOD_COUNT: 0,
      DOWNSTREAM_SERVICE_COUNT: 0,
      UPSTREAM_DEPENDENCY_COUNT: 1,
      FAN_IN_COUNT: 2,
      FAN_OUT_COUNT: 2,
      CONTRACT_FAMILY_REFERENCED_COUNT: Object.keys(EXPECTED_ENDPOINTS).length,
      ALIAS_SURFACE_COUNT: Object.keys(EXPECTED_ENDPOINTS).reduce(function (sum, key) {
        return sum + EXPECTED_ENDPOINTS[key].aliases.length;
      }, 0),
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
      PROFILE.OWNS_CANVAS_PRODUCTION_REPAIR ||
      PROFILE.OWNS_CANVAS_BUILD_AUTHORITY ||
      PROFILE.MAY_FORCE_RECEIPT_RETURN;

    var malpractice =
      duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_DETECTED" ||
      dutyDrift === true;

    return {
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: PROFILE_ROLE,
      PROFILE_CLASS: PROFILE_CLASS,
      CYCLE_POSITION: CYCLE_POSITION,

      ALLOWED_DUTIES: [
        "DETAILED_CANVAS_CONTRACT_DEFINITION",
        "FINE_BOUNDARY_DISAMBIGUATION",
        "CROSS_CONTAINER_COLLAPSE_DETECTION",
        "DUTY_LOAD_SELF_MEASUREMENT",
        "DIAGNOSTIC_MALPRACTICE_GUARD"
      ],
      FORBIDDEN_DUTIES: [
        "FINAL_ARBITRATION",
        "WEST_DERIVATIVE_MAP",
        "NORTH_GRAMMAR",
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
      DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED:
        duty.DUTY_LOAD_STATUS === "DUTY_LOAD_COLLAPSE_DETECTED",
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
          "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PROFILE_RECEIPT_PACKET_v2",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        COMPAT_CONTRACT: COMPAT_CONTRACT,
        FILE: FILE,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        GENERATED_AT: nowIso(),

        UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
        PROFILE_ROLE: PROFILE_ROLE,
        PROFILE_CLASS: PROFILE_CLASS,
        CYCLE_POSITION: CYCLE_POSITION,

        LABWEST_CONSTRUCT_IS_CONTROLLING_DIAGNOSTIC_DERIVATIVE: true,
        NORTH_DIAGNOSTIC_TRACK_MUST_ALIGN_TO_LABWEST_CONSTRUCT: true,
        ANCHOR_FILE_RETURN_IS_TARGET_HOPPING_UNLESS_CONSTRUCT_REQUIRES_IT: true,
        SURFACE_TRUTH_PROBE_RENEWAL_IS_INSIDE_THE_CONSTRUCT_NOT_A_PATH_CHANGE: true,

        OWNS_DETAILED_CANVAS_CONTRACT_DEFINITION: true,
        OWNS_FINE_BOUNDARY_DISAMBIGUATION: true,
        OWNS_CROSS_CONTAINER_COLLAPSE_DETECTION: true,
        OWNS_DUTY_LOAD_SELF_MEASUREMENT: true,
        OWNS_DIAGNOSTIC_MALPRACTICE_GUARD: true,

        OWNS_FINAL_ARBITRATION: false,
        OWNS_WEST_DERIVATIVE_MAP: false,
        OWNS_NORTH_GRAMMAR: false,
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
          "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT_DEFINITION_PACKET_v2",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
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
        selfMeasurement: selfMeasureDiagnosticDuty(),

        FINAL_ARBITRATION_EXPLICITLY_EXCLUDED: true,
        PRODUCTION_REPAIR_EXPLICITLY_EXCLUDED: true,
        WEST_DERIVATIVE_MAP_EXPLICITLY_EXCLUDED: true,
        NORTH_GRAMMAR_EXPLICITLY_EXCLUDED: true,
        FORCED_RECEIPT_RETURN_EXPLICITLY_EXCLUDED: true
      },
      NO_CLAIMS
    );
  }

  function inspect() {
    state.inspectionCount += 1;
    state.lastInspectionAt = nowIso();

    var self = selfMeasureDiagnosticDuty();
    var surface = inspectCanvasSurface();
    var containers = inspectContainerBoundaries();

    var collapseRiskCount = Object.keys(containers).reduce(function (sum, key) {
      return sum + (containers[key].containerCollapseRisk ? 1 : 0);
    }, 0);

    var packet = Object.assign(
      {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_INSPECTION_PACKET_v2",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
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

        surfaceContractsDefined: clone(CONTRACT_DEFINITIONS),
        surfaceMeasurement: surface,
        containerBoundaryMeasurement: containers,
        selfMeasurement: self,

        CANVAS_SURFACE_TRUTH_STATUS: surface.status,
        CANVAS_SURFACE_TRUTH_FAILURE_CLASS: surface.failureClass,
        CANVAS_TRUTH_FIRST_FAILED_COORDINATE: surface.firstFailedCoordinate,

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

        RECOMMENDED_NEXT_FILE: "",
        NEXT_FILE_AUTHORIZATION: false,
        FINAL_ARBITRATION: false,
        PRODUCTION_REPAIR_AUTHORIZED: false
      },
      NO_CLAIMS
    );

    state.lastInspectionPacket = packet;
    return clone(packet);
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
      contract: CONTRACT,
      profileRole: PROFILE_ROLE,
      profileClass: PROFILE_CLASS,
      cyclePosition: CYCLE_POSITION,
      ownsFinalArbitration: false,
      ownsCanvasBuildAuthority: false
    });
  }

  function noOpLifecycle() {
    return getReceipt();
  }

  var API = {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    FILE: FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    compatContract: COMPAT_CONTRACT,
    file: FILE,

    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

    UPSTREAM_CONSTRUCT: UPSTREAM_CONSTRUCT,
    PROFILE_ROLE: PROFILE_ROLE,
    PROFILE_CLASS: PROFILE_CLASS,
    CYCLE_POSITION: CYCLE_POSITION,

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

    getProfile: getProfile,
    getState: getState,
    getReceipt: getReceipt,
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
    OWNS_CANVAS_PRODUCTION_REPAIR: false,
    OWNS_CANVAS_BUILD_AUTHORITY: false,
    MAY_FORCE_RECEIPT_RETURN: false,

    finalArbitrationClaimed: false,
    westDerivativeMapClaimed: false,
    northGrammarClaimed: false,
    canvasProductionRepairClaimed: false,
    canvasBuildAuthorityClaimed: false,
    forcedReceiptReturnClaimed: false,

    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
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

    HEARTH.diagnosticProbeCanvasSurfaceTruth = API;
    HEARTH.canvasSurfaceTruthProbe = API;
    HEARTH.CANVAS_SURFACE_TRUTH_PROBE = API;
    HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = API;

    DEXTER_LAB.canvasSurfaceTruthProbe = API;
    DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth = API;

    ROOT.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PROFILE_RECEIPT =
      state.lastProfileReceipt;

    HEARTH.diagnosticProbeCanvasSurfaceTruthProfileReceipt = state.lastProfileReceipt;
    DEXTER_LAB.canvasSurfaceTruthProbeProfileReceipt = state.lastProfileReceipt;

    return API;
  }

  publish();
})();
