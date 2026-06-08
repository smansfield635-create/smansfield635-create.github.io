// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6
// Full-file replacement.
// Diagnostic rail NORTH parent only.
//
// Purpose:
// - Preserve public NORTH v11 contract and receipt expected by the diagnostic route.
// - Preserve diagnostic receiver behavior: receiver still calls NORTH only.
// - Preserve nine-step diagnostic chronology.
// - Consume Canvas Surface Truth as a supporting read-only anchor.
// - Re-anchor post-evidence arbitration into a diagnostic-track redesign.
// - Prevent runtime-map contamination from being treated as endpoint proof.
// - Report cross-authority contamination before recommending production repairs.
// - Never mutate production, repair route files, draw Canvas, restart runtime,
//   release Canvas, claim F13/F21, claim ready text, claim visual pass,
//   generate image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_RECEIPT_v11_6";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POINTER_SURFACE_BISHOP_MAPPING_ARBITRATION_TNT_v11_5";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POINTER_SURFACE_BISHOP_MAPPING_ARBITRATION_RECEIPT_v11_5";

  const LINEAGE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_EVIDENCE_LANE_ARBITRATION_TNT_v11_4";
  const FOUNDATION_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_TNT_v11_3";
  const BASELINE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_ANCHOR_TNT_v11_2";

  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const VERSION =
    "2026-06-08.hearth-diagnostic-rail-north-reanchor-diagnostic-track-runtime-map-integrity-v11-6";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_POINTER_SURFACE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const EXPECTED_POINTER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PRODUCTION_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false
  });

  const CHRONOLOGY_STEPS = Object.freeze([
    {
      id: "NORTH_RAIL",
      order: 1,
      fibonacciStage: "F1",
      role: "north-reanchor-diagnostic-track-runtime-map-integrity-hub",
      file: FILE,
      expectedContract: CONTRACT,
      owner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
      paths: [
        "HEARTH.diagnosticRail",
        "HEARTH.parallelDiagnosticRail",
        "HEARTH.diagnosticNorth",
        "HEARTH.diagnosticRailNorth",
        "HEARTH.diagnosticNorthChronologyHub",
        "HEARTH.diagnosticNorthCanvasSurfaceTruthChronologyHub",
        "HEARTH.diagnosticNorthReanchorDiagnosticTrackRuntimeMapIntegrity",
        "HEARTH_DIAGNOSTIC_RAIL",
        "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
        "HEARTH_DIAGNOSTIC_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_NORTH",
        "HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
        "HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",
        "DEXTER_LAB.hearthDiagnosticRail",
        "DEXTER_LAB.hearthDiagnosticNorth",
        "DEXTER_LAB.hearthDiagnosticNorthChronologyHub",
        "DEXTER_LAB.hearthDiagnosticNorthReanchorDiagnosticTrackRuntimeMapIntegrity"
      ],
      methods: []
    },
    {
      id: "PROBE_NORTH",
      order: 2,
      fibonacciStage: "F2",
      role: "file-composition-zone-coordinator",
      file: PROBE_NORTH_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1",
      owner: "DIAGNOSTIC_PROBE_NORTH",
      paths: [
        "HEARTH.diagnosticProbeNorth",
        "HEARTH.diagnosticRailProbeNorth",
        "HEARTH_DIAGNOSTIC_PROBE_NORTH",
        "DEXTER_LAB.hearthDiagnosticProbeNorth"
      ],
      methods: ["runProbeNorth", "inspectFileComposition", "runProbe", "inspect", "runDiagnostic"]
    },
    {
      id: "RAIL_EAST",
      order: 3,
      fibonacciStage: "F3",
      role: "served-source-evidence",
      file: RAIL_EAST_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8",
      owner: "DIAGNOSTIC_RAIL_EAST",
      paths: [
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST",
        "DEXTER_LAB.hearthDiagnosticEast"
      ],
      methods: ["runEastSourceRead", "readServedSource", "runEast", "inspectSource", "inspect", "runDiagnostic"]
    },
    {
      id: "PROBE_EAST",
      order: 4,
      fibonacciStage: "F5",
      role: "served-source-file-composition-probe",
      file: PROBE_EAST_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1",
      owner: "DIAGNOSTIC_PROBE_EAST",
      paths: [
        "HEARTH.diagnosticProbeEast",
        "HEARTH.diagnosticEastProbe",
        "HEARTH_DIAGNOSTIC_PROBE_EAST",
        "DEXTER_LAB.hearthDiagnosticProbeEast"
      ],
      methods: ["runProbeEast", "inspectServedSourceComposition", "runProbe", "inspect", "runDiagnostic"]
    },
    {
      id: "RAIL_WEST",
      order: 5,
      fibonacciStage: "F8",
      role: "rendered-target-evidence",
      file: RAIL_WEST_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7",
      owner: "DIAGNOSTIC_RAIL_WEST",
      paths: [
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST",
        "DEXTER_LAB.hearthDiagnosticWest"
      ],
      methods: ["runWestRenderedRead", "readRenderedTarget", "runWest", "inspectRenderedTarget", "inspect", "runDiagnostic"]
    },
    {
      id: "PROBE_WEST",
      order: 6,
      fibonacciStage: "F13",
      role: "rendered-target-file-composition-probe",
      file: PROBE_WEST_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1",
      owner: "DIAGNOSTIC_PROBE_WEST",
      paths: [
        "HEARTH.diagnosticProbeWest",
        "HEARTH.diagnosticRailProbeWest",
        "HEARTH.diagnosticWestProbe",
        "HEARTH_DIAGNOSTIC_PROBE_WEST",
        "DEXTER_LAB.hearthDiagnosticProbeWest"
      ],
      methods: ["runProbeWest", "inspectRenderedTargetComposition", "runProbe", "inspect", "runDiagnostic"]
    },
    {
      id: "PROBE_CANVAS_SURFACE_TRUTH",
      order: 7,
      fibonacciStage: "F21",
      role: "canvas-surface-truth-supporting-anchor",
      file: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1",
      owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      paths: [
        "HEARTH.diagnosticProbeCanvasSurfaceTruth",
        "HEARTH.diagnosticCanvasSurfaceTruthProbe",
        "HEARTH.diagnosticTruthHub",
        "HEARTH.canvasSurfaceTruthProbe",
        "HEARTH.diagnosticCanvasParentChainUsedSizeBoundaryFactMatrix",
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
        "HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX",
        "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
        "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
        "DEXTER_LAB.hearthDiagnosticCanvasParentChainUsedSizeBoundaryFactMatrix"
      ],
      methods: [
        "runProbeCanvasSurfaceTruth",
        "runCanvasSurfaceTruth",
        "inspectCanvasSurfaceTruth",
        "runCanvasSurfaceTruthProbe",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "RAIL_SOUTH",
      order: 8,
      fibonacciStage: "F34",
      role: "packet-output",
      file: RAIL_SOUTH_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8",
      owner: "DIAGNOSTIC_RAIL_SOUTH",
      paths: [
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "DEXTER_LAB.hearthDiagnosticSouth"
      ],
      methods: ["composeSouthReport", "runSouth", "composeReport", "inspect", "runDiagnostic"]
    },
    {
      id: "PROBE_SOUTH",
      order: 9,
      fibonacciStage: "F55",
      role: "packet-meaning-file-composition-probe",
      file: PROBE_SOUTH_FILE,
      expectedContract: "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1",
      owner: "DIAGNOSTIC_PROBE_SOUTH",
      paths: [
        "HEARTH.diagnosticProbeSouth",
        "HEARTH.diagnosticRailProbeSouth",
        "HEARTH.diagnosticSouthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
        "DEXTER_LAB.hearthDiagnosticProbeSouth"
      ],
      methods: ["runProbeSouth", "inspectPacketMeaning", "inspectPacketComposition", "runProbe", "inspect", "runDiagnostic"]
    }
  ]);

  const RUNTIME_NODES = Object.freeze([
    {
      id: "ROUTE_CONDUCTOR",
      file: ROUTE_CONDUCTOR_FILE,
      role: "route-permission-and-active-scan-authority",
      family: "HEARTH_ROUTE_CONDUCTOR",
      expectedContracts: [
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_TNT_v10_8",
        "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
        "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
        "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
        "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
        "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1"
      ],
      aliases: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH.routeConductor",
        "HEARTH.routeNorthBishop",
        "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
        "HEARTH.routeConductorCanvasAssetTransactionReset",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteNorthBishop"
      ]
    },
    {
      id: "CONTROLS_QUEEN",
      file: CONTROL_FILE,
      role: "motion-input-and-view-control-gateway",
      family: "HEARTH_CONTROLS",
      expectedContracts: [
        EXPECTED_CONTROL_CONTRACT,
        EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
        "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
        "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
      ],
      aliases: [
        "HEARTH_CONTROLS",
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH.controls",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.planetaryControls",
        "HEARTH.controlFile",
        "HEARTH.controlsHexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthControls",
        "DEXTER_LAB.hearthQueenControls"
      ]
    },
    {
      id: "CANVAS_RECEIVER",
      file: CANVAS_FILE,
      role: "presentation-surface-output-carrier-and-return-receiver",
      family: "HEARTH_CANVAS",
      expectedContracts: [
        EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        EXPECTED_CANVAS_CONTRACT,
        "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
        "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
        "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
        "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
        "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
        "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
        "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
        "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7"
      ],
      aliases: [
        "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_HUB",
        "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHub",
        "HEARTH.canvas",
        "HEARTH.canvasParent",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasLocalStation",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasVisiblePlanet",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent"
      ]
    },
    {
      id: "HEX_AUTHORITY",
      file: HEX_AUTHORITY_FILE,
      role: "hex-four-pair-authority",
      family: "HEARTH_HEX_FOUR_PAIR",
      expectedContracts: [EXPECTED_HEX_AUTHORITY_CONTRACT],
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexPixelHandshakeAuthority",
        "HEARTH.hexAuthority",
        "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexAuthority"
      ]
    },
    {
      id: "HEX_SURFACE_GATE",
      file: HEX_SURFACE_FILE,
      role: "downstream-hex-surface-gate-before-pointer-surface",
      family: "HEARTH_HEX_SURFACE",
      expectedContracts: [
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
        EXPECTED_HEX_SURFACE_CONTRACT,
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v3",
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v2",
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v1"
      ],
      aliases: [
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
        "HEARTH.hexSurface",
        "HEARTH.hexSurfacePairPointerFingerGate",
        "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
        "HEARTH.hexGate",
        "HEARTH.hexRenderGate",
        "DEXTER_LAB.hearthHexSurface",
        "DEXTER_LAB.hearthHexGate"
      ]
    },
    {
      id: "POINTER_SURFACE_BISHOP",
      file: POINTER_SURFACE_FILE,
      role: "pointer-surface-bishop-gate-opening-child-expression-files",
      family: "HEARTH_CANVAS_FINGER_SURFACE",
      expectedContracts: [
        EXPECTED_POINTER_SURFACE_CONTRACT,
        "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3",
        "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2",
        "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1"
      ],
      aliases: [
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
        "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
        "HEARTH_CANVAS_SURFACE_BISHOP",
        "HEARTH_POINTER_SURFACE_BISHOP",
        "HEARTH.pointerSurfaceBishop",
        "HEARTH.canvasFingerSurface",
        "HEARTH.canvasFingerSurfaceBishop",
        "HEARTH.canvasBishopSurfacePointer",
        "HEARTH.canvasSurfaceBishop",
        "HEARTH.canvasFingerSurfacePointerBishop",
        "DEXTER_LAB.hearthPointerSurfaceBishop",
        "DEXTER_LAB.hearthCanvasFingerSurface",
        "DEXTER_LAB.hearthCanvasFingerSurfaceBishop",
        "DEXTER_LAB.hearthCanvasSurfaceBishop"
      ]
    },
    {
      id: "POINTER_INSPECT_PRIEST",
      file: POINTER_INSPECT_FILE,
      role: "pointer-surface-child-organizer-and-proofreader-not-primary-chain-gate",
      family: "HEARTH_CANVAS_FINGER_INSPECT",
      expectedContracts: [
        EXPECTED_POINTER_INSPECT_CONTRACT,
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
      ],
      aliases: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_POINTER",
        "HEARTH_POINTER_FINGER",
        "HEARTH.canvasFingerInspect",
        "HEARTH.canvasFingerPointer",
        "HEARTH.pointerFinger",
        "HEARTH.canvasPointerFinger",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthPointerFinger",
        "DEXTER_LAB.hearthCanvasPointerFinger"
      ],
      childOf: "POINTER_SURFACE_BISHOP",
      advisoryChild: true
    }
  ]);

  const RELATIONSHIPS = Object.freeze([
    {
      id: "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
      from: "ROUTE_CONDUCTOR",
      to: "CONTROLS_QUEEN",
      requiredForMotion: true,
      requiredForVisibleSurface: false,
      topLevelBlocking: true,
      requestSignals: ["controlHandshakePacket", "queenControlHandshakePacket", "controlHandshakeAuthorized"],
      grantSignals: ["handshakeAccepted", "inputAdmissionOpen", "HANDSHAKE_VALID"],
      returnSignals: ["controlHandshakeReceipt", "getControlHandshakeReceipt", "getControlHandshakeSummary"]
    },
    {
      id: "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE",
      from: "ROUTE_CONDUCTOR",
      to: "CANVAS_RECEIVER",
      requiredForMotion: false,
      requiredForVisibleSurface: true,
      topLevelBlocking: true,
      requestSignals: ["governedSourcePacket", "canvasHandoffPacket", "canvasReleasePacket"],
      grantSignals: ["governedSourceAccepted", "canvasReleaseAccepted", "receiveGovernedSourceStackPacket", "receiveRouteConductorCanvasTransactionPacket"],
      returnSignals: ["canvasGovernedSourceDeliveryStatus", "getCanvasStationReceipt", "getVisiblePlanetReceipt", "routeCanvasHandoffStatus"]
    },
    {
      id: "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
      from: "CONTROLS_QUEEN",
      to: "CANVAS_RECEIVER",
      requiredForMotion: true,
      requiredForVisibleSurface: false,
      topLevelBlocking: true,
      requestSignals: ["controlsViewPacket", "planetaryViewControlPacket", "receiveViewControlPacket"],
      grantSignals: ["CONTROL_PACKET_DELIVERED_TO_CANVAS_PUBLIC_RECEIVER_FOR_HEX_GATE", "receiveViewControlPacket", "consumeViewControlPacket"],
      returnSignals: ["canvasDeliveryStatus", "canvasDeliveryMethod", "getControlHandshakeReceipt"]
    },
    {
      id: "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
      from: "CANVAS_RECEIVER",
      to: "HEX_SURFACE_GATE",
      requiredForMotion: true,
      requiredForVisibleSurface: true,
      topLevelBlocking: true,
      requestSignals: ["hexGateTransmissionPacket", "canvasMayForwardToHexGate", "receiveCanvasHexGatePacket"],
      grantSignals: ["hexGateTransmissionAccepted", "gateReady", "surfaceReady", "receiveCanvasHexGatePacket"],
      returnSignals: ["getHexSurfaceReceipt", "hexSurfaceReceipt", "hexGateTransmissionDelivered"]
    },
    {
      id: "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP_GATE",
      from: "HEX_SURFACE_GATE",
      to: "POINTER_SURFACE_BISHOP",
      requiredForMotion: false,
      requiredForVisibleSurface: true,
      topLevelBlocking: true,
      requestSignals: ["pointerSurfacePacket", "pointerSurfaceBishopPacket", "POINTER_SURFACE_BISHOP", "hearth.canvas.finger.surface.js"],
      grantSignals: ["pointerSurfaceObserved", "pointerSurfaceReady", "surfaceBishopReady", "receivePointerSurfacePacket"],
      returnSignals: ["pointerSurfaceReceipt", "surfaceBishopReceipt", "getPointerSurfaceReceipt"]
    },
    {
      id: "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN_SOCKET",
      from: "POINTER_SURFACE_BISHOP",
      to: "CANVAS_RECEIVER",
      requiredForMotion: false,
      requiredForVisibleSurface: true,
      topLevelBlocking: true,
      requestSignals: ["canvasReturnPacket", "pointerSurfaceReturnPacket", "surfaceBishopReturnPacket", "returnToCanvas"],
      grantSignals: ["canvasReturnReceiverReady", "pointerSurfaceReturnAccepted", "receiveCanvasReturnPacket"],
      returnSignals: ["canvasReturnReceiptPublished", "getCanvasReturnReceipt", "canvasReturnArtifactApplied"]
    },
    {
      id: "POINTER_SURFACE_BISHOP_TO_INSPECT_PRIEST_CHILD_ORGANIZER",
      from: "POINTER_SURFACE_BISHOP",
      to: "POINTER_INSPECT_PRIEST",
      requiredForMotion: false,
      requiredForVisibleSurface: false,
      topLevelBlocking: false,
      requestSignals: ["inspectChild", "childOrganizer", "proofreader", "fingerInspect"],
      grantSignals: ["inspectReady", "childOrganizerReady", "fingerInspectReady"],
      returnSignals: ["inspectionReceipt", "fingerInspectReceipt", "getInspectionReceipt"]
    }
  ]);

  let lastState = null;
  let lastReport = null;
  let lastVerdict = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  const loadPromises = Object.create(null);

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function bounded(value, limit = 4000) {
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
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function packetValue(value, fallback = "UNKNOWN", limit = 50000) {
    if (value === undefined || value === null || value === "") return fallback;
    if (Array.isArray(value) || isObject(value)) {
      try {
        return JSON.stringify(value).slice(0, limit) || fallback;
      } catch (_error) {
        return bounded(value, Math.min(limit, 4000)) || fallback;
      }
    }
    return bounded(value, Math.min(limit, 4000)) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function textIsTrue(value) {
    return boolText(value, "false") === "true";
  }

  function textIsFalse(value) {
    return boolText(value, "UNKNOWN") === "false";
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = key.toLowerCase();
    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback, 8000);
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;
      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1600);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function addNote(state, note) {
    if (!state || !Array.isArray(state.notes)) return;
    const clean = bounded(note, 1600);
    if (!clean || state.notes.includes(clean)) return;
    state.notes.push(clean);
  }

  function readPath(base, path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = base || root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function findFirstPath(paths, bases) {
    const contexts = Array.isArray(bases) && bases.length
      ? bases
      : [{ label: "DIAGNOSTIC", root }];

    for (const context of contexts) {
      for (const path of paths || []) {
        const value = readPath(context.root, path);
        if (value) {
          return {
            path,
            value,
            contextLabel: context.label,
            fullPath: `${context.label}:${path}`
          };
        }
      }
    }

    return {
      path: "NONE",
      value: null,
      contextLabel: "NONE",
      fullPath: "NONE"
    };
  }

  function getDataset(targetDocument) {
    const d = targetDocument || doc;
    if (!d || !d.documentElement || !d.documentElement.dataset) return {};
    return d.documentElement.dataset;
  }

  function scriptMatchesPath(script, path) {
    if (!script || !path) return false;
    const src = safeString(script.getAttribute && script.getAttribute("src"));
    if (!src) return false;

    try {
      const base =
        root.location && root.location.origin
          ? root.location.origin
          : "https://diamondgatebridge.com";
      const url = new URL(src, base);
      return url.pathname === path || url.pathname.endsWith(path);
    } catch (_error) {
      return src.includes(path);
    }
  }

  function scriptInfo(path, targetDocument = doc) {
    if (!targetDocument || !targetDocument.querySelectorAll) {
      return {
        present: false,
        count: 0,
        src: "DOCUMENT_UNAVAILABLE",
        cacheKey: "NONE",
        matches: []
      };
    }

    const scripts = Array.from(targetDocument.querySelectorAll("script[src]")).filter((script) => {
      return scriptMatchesPath(script, path);
    });

    const matches = scripts.map((script, index) => {
      const rawSrc = script.getAttribute ? script.getAttribute("src") : "";
      let cacheKey = "NONE";

      try {
        const base =
          root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";
        const url = new URL(rawSrc, base);
        cacheKey =
          url.searchParams.get("v") ||
          url.searchParams.get("cache") ||
          url.searchParams.get("version") ||
          url.searchParams.get("northRecovery") ||
          "NONE";
      } catch (_error) {}

      return {
        order: index + 1,
        src: rawSrc || "NOT_FOUND",
        cacheKey,
        id: safeString(script.id, "NONE")
      };
    });

    const last = matches[matches.length - 1] || null;

    return {
      present: scripts.length > 0,
      count: scripts.length,
      src: last ? last.src : "NOT_FOUND",
      cacheKey: last ? last.cacheKey : "NONE",
      matches
    };
  }

  function appendDiagnosticScript(path, stepId) {
    if (!doc) {
      return Promise.resolve({
        attempted: false,
        loaded: false,
        status: "DOCUMENT_UNAVAILABLE",
        path,
        src: "DOCUMENT_UNAVAILABLE"
      });
    }

    const key = `${path}::${INTERNAL_RENEWAL_CONTRACT}`;
    if (loadPromises[key]) return loadPromises[key];

    loadPromises[key] = new Promise((resolve) => {
      try {
        const script = doc.createElement("script");
        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        script.id = `hearth-diagnostic-north-${safeString(stepId).toLowerCase()}-${stamp}`;
        script.src =
          `${path}?v=${encodeURIComponent(INTERNAL_RENEWAL_CONTRACT)}` +
          `&northRecovery=${encodeURIComponent("DIAGNOSTIC_CHILD_ONLY")}` +
          `&t=${encodeURIComponent(stamp)}`;
        script.async = false;
        script.defer = false;

        script.dataset.loadedBy = CONTRACT;
        script.dataset.internalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
        script.dataset.productionMutationPermissionGranted = "false";
        script.dataset.hearthRepairPermissionGranted = "false";
        script.dataset.runtimeRestartPermissionGranted = "false";
        script.dataset.canvasReleasePermissionGranted = "false";
        script.dataset.readyTextPermissionGranted = "false";
        script.dataset.visualPassClaimed = "false";
        script.dataset.generatedImage = "false";
        script.dataset.graphicBox = "false";
        script.dataset.webgl = "false";

        script.addEventListener("load", () => {
          resolve({
            attempted: true,
            loaded: true,
            status: "DIAGNOSTIC_CHILD_SCRIPT_LOAD_COMPLETE",
            path,
            src: script.src
          });
        }, { once: true });

        script.addEventListener("error", () => {
          resolve({
            attempted: true,
            loaded: false,
            status: "DIAGNOSTIC_CHILD_SCRIPT_LOAD_ERROR_OR_NOT_DEPLOYED",
            path,
            src: script.src
          });
        }, { once: true });

        (doc.head || doc.documentElement || doc.body).appendChild(script);
      } catch (error) {
        resolve({
          attempted: true,
          loaded: false,
          status: `DIAGNOSTIC_CHILD_SCRIPT_LOAD_EXCEPTION:${bounded(error && error.message ? error.message : error, 1000)}`,
          path,
          src: "SCRIPT_APPEND_EXCEPTION"
        });
      }
    });

    return loadPromises[key];
  }

  function findTargetFrame() {
    if (!doc || !doc.querySelector) return null;

    try {
      return (
        doc.querySelector("#hearthDiagnosticTargetFrame") ||
        doc.querySelector("iframe[data-hearth-diagnostic-target-frame='true']") ||
        doc.querySelector("iframe[src='/showroom/globe/hearth/']") ||
        doc.querySelector("iframe[src*='/showroom/globe/hearth/']")
      );
    } catch (_error) {
      return null;
    }
  }

  function getTargetContext(options = {}) {
    const frame = options.frameElement || findTargetFrame();
    let targetWindow = options.targetWindow || null;
    let targetDocument = options.targetDocument || null;
    let source = targetWindow || targetDocument ? "DIRECT_OPTIONS" : "DIRECT_OPTIONS_OR_NONE";
    let accessStatus = "TARGET_NOT_ATTACHED";

    if (!targetWindow && frame) {
      try {
        targetWindow = frame.contentWindow || null;
        source = "DIAGNOSTIC_IFRAME_CONTENT_WINDOW";
      } catch (error) {
        accessStatus = `TARGET_WINDOW_INACCESSIBLE:${bounded(error && error.message ? error.message : error, 300)}`;
      }
    }

    if (!targetDocument && frame) {
      try {
        targetDocument = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document) || null;
        if (targetDocument) source = "DIAGNOSTIC_IFRAME_CONTENT_DOCUMENT";
      } catch (error) {
        accessStatus = `TARGET_DOCUMENT_INACCESSIBLE:${bounded(error && error.message ? error.message : error, 300)}`;
      }
    }

    if (!targetDocument && targetWindow) {
      try {
        targetDocument = targetWindow.document || null;
      } catch (error) {
        accessStatus = `TARGET_DOCUMENT_FROM_WINDOW_INACCESSIBLE:${bounded(error && error.message ? error.message : error, 300)}`;
      }
    }

    if (targetWindow || targetDocument) accessStatus = "RENDERED_TARGET_ACCESSIBLE";

    return {
      targetWindow,
      targetDocument,
      frameElement: frame || null,
      source,
      accessStatus,
      accessError: accessStatus.includes("INACCESSIBLE") ? accessStatus : "UNKNOWN",
      bases: [
        { label: "TARGET", root: targetWindow || root },
        { label: "DIAGNOSTIC", root }
      ]
    };
  }

  function readField(source, keys, fallback = "") {
    const object = isObject(source) ? source : {};

    for (const key of keys) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(object)) {
        if (candidate.toLowerCase() === lower) {
          const value = object[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getNorthVerdict",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getPointerSurfaceReceipt",
      "getSurfaceBishopReceipt",
      "getPointerFingerReceipt",
      "getFingerReceipt",
      "getInspectionReceipt",
      "getCanvasReturnReceipt",
      "getReturnReceipt",
      "getCanvasSurfaceTruthReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function contractOf(receipt, authority) {
    return firstKnown(
      readField(receipt, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexSurfaceContract",
        "pointerSurfaceContract",
        "surfaceBishopContract",
        "pointerFingerContract",
        "fingerContract",
        "inspectionContract",
        "routeConductorContract",
        "currentRouteConductorContract",
        "servedRouteConductorContract",
        "contract",
        "CONTRACT",
        "sourceContract",
        "internalImplementationContract",
        "INTERNAL_IMPLEMENTATION_CONTRACT",
        "internalRenewalContract",
        "INTERNAL_RENEWAL_CONTRACT",
        "renewalContract",
        "RENEWAL_CONTRACT"
      ], ""),
      authority && authority.contract,
      authority && authority.CONTRACT,
      authority && authority.internalRenewalContract,
      authority && authority.INTERNAL_RENEWAL_CONTRACT
    );
  }

  function receiptOf(receipt, authority) {
    return firstKnown(
      readField(receipt, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexSurfaceReceipt",
        "pointerSurfaceReceipt",
        "surfaceBishopReceipt",
        "pointerFingerReceipt",
        "fingerReceipt",
        "inspectionReceipt",
        "routeConductorReceipt",
        "currentRouteConductorReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt",
        "internalImplementationReceipt",
        "INTERNAL_IMPLEMENTATION_RECEIPT",
        "internalRenewalReceipt",
        "INTERNAL_RENEWAL_RECEIPT",
        "renewalReceipt",
        "RENEWAL_RECEIPT"
      ], ""),
      authority && authority.receipt,
      authority && authority.RECEIPT
    );
  }

  function publicMethodNames(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 160);
    } catch (_error) {
      return [];
    }
  }

  function contractRecognized(contract, node) {
    const text = safeString(contract);
    if (!text || text === "UNKNOWN") return false;
    if ((node.expectedContracts || []).includes(text)) return true;
    if (node.family && text.includes(node.family)) return true;
    return false;
  }

  function expectedFamilyObserved(contract, node) {
    const text = safeString(contract);
    if (!text || text === "UNKNOWN") return false;
    if (!node || !node.family) return false;
    return text.includes(node.family);
  }

  function pathFamilyObserved(path, node) {
    const text = safeString(path);
    if (!text || text === "NONE") return false;
    if (!node || !node.family) return false;

    const family = node.family.toLowerCase()
      .replace(/^hearth_/, "")
      .replace(/_/g, "");

    const simplified = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    return simplified.includes(family) ||
      simplified.includes(node.id.toLowerCase().replace(/_/g, ""));
  }

  function buildAuthoritySignalText(authority, receipt, node) {
    const pieces = [];

    try {
      pieces.push(JSON.stringify(receipt || {}));
    } catch (_error) {}

    if (authority && isObject(authority)) {
      try {
        pieces.push(Object.keys(authority).join(" "));
      } catch (_error) {}

      for (const key of [
        "contract",
        "CONTRACT",
        "receipt",
        "RECEIPT",
        "internalRenewalContract",
        "renewalContract",
        "controlHandshakePacket",
        "queenControlHandshakePacket",
        "governedSourcePacket",
        "canvasHandoffPacket",
        "hexGateTransmissionPacket",
        "pointerSurfacePacket",
        "pointerSurfaceBishopPacket",
        "pointerFingerTransmissionPacket",
        "canvasReturnPacket"
      ]) {
        try {
          if (authority[key] !== undefined) pieces.push(`${key}:${packetValue(authority[key], "", 2000)}`);
        } catch (_error) {}
      }
    }

    if (node) {
      pieces.push(node.id);
      pieces.push(node.file);
      pieces.push((node.expectedContracts || []).join(" "));
    }

    return pieces.join(" | ").slice(0, 80000);
  }

  function readRuntimeNodeStrict(node, targetContext) {
    const targetDoc = targetContext.targetDocument || null;
    const ds = getDataset(targetDoc);
    const found = findFirstPath(node.aliases || [], targetContext.bases);

    const receipt = getReceiptFromAuthority(found.value) || {};
    const contract = contractOf(receipt, found.value);
    const receiptName = receiptOf(receipt, found.value);
    const methods = publicMethodNames(found.value);

    const scriptTarget = scriptInfo(node.file, targetDoc || doc);
    const scriptDiagnostic = targetDoc ? scriptInfo(node.file, doc) : {
      present: false,
      count: 0,
      src: "NOT_CHECKED",
      cacheKey: "NONE",
      matches: []
    };

    const authorityPresent = Boolean(found.value);
    const scriptPresent = Boolean(scriptTarget.present || scriptDiagnostic.present);
    const contractRecognizedForNode = contractRecognized(contract, node);
    const contractFamilyMatches = expectedFamilyObserved(contract, node);
    const aliasFamilyMatches = pathFamilyObserved(found.path, node);

    const datasetAdvisory = {
      hearthRouteConductorContract: ds.hearthRouteConductorContract || "UNKNOWN",
      hearthControlsContract: ds.hearthControlsContract || "UNKNOWN",
      hearthCanvasContract: ds.hearthCanvasContract || "UNKNOWN",
      hearthHexAuthorityContract: ds.hearthHexAuthorityContract || "UNKNOWN",
      hearthHexSurfaceContract: ds.hearthHexSurfaceContract || "UNKNOWN",
      hearthPointerSurfaceContract: ds.hearthPointerSurfaceContract || "UNKNOWN",
      hearthCanvasFingerSurfaceContract: ds.hearthCanvasFingerSurfaceContract || "UNKNOWN",
      hearthPointerFingerContract: ds.hearthPointerFingerContract || "UNKNOWN",
      hearthCanvasFingerInspectContract: ds.hearthCanvasFingerInspectContract || "UNKNOWN"
    };

    let strictObserved = false;
    let nodeStatus = "NOT_OBSERVED";
    let integrityClass = "FILE_NOT_OBSERVED";
    let contamination = false;
    let contaminationReason = "NONE";

    if (!authorityPresent && !scriptPresent) {
      strictObserved = false;
      nodeStatus = "NOT_OBSERVED";
      integrityClass = "FILE_NOT_OBSERVED";
    } else if (scriptPresent && !authorityPresent) {
      strictObserved = false;
      nodeStatus = "SCRIPT_PRESENT_AUTHORITY_DARK";
      integrityClass = "SCRIPT_PRESENT_AUTHORITY_NOT_PUBLISHED";
    } else if (authorityPresent && !aliasFamilyMatches) {
      strictObserved = false;
      contamination = true;
      nodeStatus = "CROSS_AUTHORITY_CONTAMINATION";
      integrityClass = "ALIAS_FAMILY_MISMATCH";
      contaminationReason = `AUTHORITY_ALIAS_PATH_DOES_NOT_MATCH_NODE_FAMILY:${found.path}`;
    } else if (authorityPresent && contract !== "UNKNOWN" && !contractFamilyMatches && !contractRecognizedForNode) {
      strictObserved = false;
      contamination = true;
      nodeStatus = "CROSS_AUTHORITY_CONTAMINATION";
      integrityClass = "CONTRACT_FAMILY_MISMATCH";
      contaminationReason = `AUTHORITY_CONTRACT_DOES_NOT_MATCH_NODE_FAMILY:${contract}`;
    } else if (authorityPresent && contract === "UNKNOWN") {
      strictObserved = false;
      nodeStatus = "AUTHORITY_OBSERVED_CONTRACT_UNKNOWN";
      integrityClass = "CONTRACT_UNKNOWN";
    } else if (authorityPresent && !contractRecognizedForNode) {
      strictObserved = false;
      nodeStatus = "AUTHORITY_OBSERVED_CONTRACT_UNRECOGNIZED";
      integrityClass = "CONTRACT_UNRECOGNIZED";
    } else {
      strictObserved = true;
      nodeStatus = "STRICT_RUNTIME_ENDPOINT_CONFIRMED";
      integrityClass = "STRICT_ENDPOINT_CONFIRMED";
    }

    return {
      id: node.id,
      role: node.role,
      file: node.file,
      family: node.family,
      expectedContracts: (node.expectedContracts || []).slice(),
      childOf: node.childOf || "NONE",
      advisoryChild: node.advisoryChild === true,

      strictObserved,
      observed: strictObserved,
      authorityPresent,
      scriptPresent,
      scriptCount: (scriptTarget.count || 0) + (scriptDiagnostic.count || 0),
      scriptTargetPresent: scriptTarget.present,
      scriptTargetSrc: scriptTarget.src,
      scriptTargetCacheKey: scriptTarget.cacheKey,
      scriptDiagnosticPresent: scriptDiagnostic.present,
      scriptDiagnosticSrc: scriptDiagnostic.src,
      scriptDiagnosticCacheKey: scriptDiagnostic.cacheKey,

      selectedAliasPath: found.path,
      selectedAliasFullPath: found.fullPath,
      contextLabel: found.contextLabel,
      aliasFamilyMatches,
      contract,
      receipt: receiptName,
      contractRecognized: contractRecognizedForNode,
      contractFamilyMatches,
      publicMethodCount: methods.length,
      publicMethods: methods,
      receiptObject: clonePlain(receipt),
      authorityText: buildAuthoritySignalText(found.value, receipt, node),

      datasetAdvisory,
      datasetIsAdvisoryOnly: true,
      datasetDoesNotProveEndpoint: true,

      nodeStatus,
      integrityClass,
      crossAuthorityContamination: contamination,
      contaminationReason,
      dark: integrityClass !== "STRICT_ENDPOINT_CONFIRMED",

      ...NO_CLAIMS
    };
  }

  function signalObserved(text, signals) {
    const hay = safeString(text).toUpperCase();

    for (const raw of signals || []) {
      const signal = safeString(raw).toUpperCase();
      if (!signal) continue;
      if (hay.includes(signal)) return true;
    }

    return false;
  }

  function evaluateRelationshipStrict(relationship, nodesById) {
    const fromNode = nodesById[relationship.from] || null;
    const toNode = nodesById[relationship.to] || null;

    const fromStrict = Boolean(fromNode && fromNode.strictObserved);
    const toStrict = Boolean(toNode && toNode.strictObserved);
    const fromAny = Boolean(fromNode && (fromNode.authorityPresent || fromNode.scriptPresent));
    const toAny = Boolean(toNode && (toNode.authorityPresent || toNode.scriptPresent));

    const joined = [
      fromNode && fromNode.authorityText,
      toNode && toNode.authorityText,
      fromNode && fromNode.contract,
      toNode && toNode.contract,
      fromNode && (fromNode.publicMethods || []).join(" "),
      toNode && (toNode.publicMethods || []).join(" ")
    ].join(" | ");

    const requestObserved = signalObserved(joined, relationship.requestSignals);
    const grantObserved = signalObserved(joined, relationship.grantSignals);
    const returnObserved = signalObserved(joined, relationship.returnSignals);

    let status = "RELATIONSHIP_NOT_EVALUATED";
    let varianceClass = "UNKNOWN";
    let clean = false;

    if (!fromStrict || !toStrict) {
      status = "RELATIONSHIP_BLOCKED_BY_RUNTIME_MAP_INTEGRITY";
      varianceClass =
        !fromStrict && !toStrict
          ? "BOTH_ENDPOINTS_NOT_STRICTLY_CONFIRMED"
          : !fromStrict
            ? "SOURCE_ENDPOINT_NOT_STRICTLY_CONFIRMED"
            : "TARGET_ENDPOINT_NOT_STRICTLY_CONFIRMED";
      clean = false;
    } else if (requestObserved && grantObserved && returnObserved) {
      status = "STRICT_RELATIONSHIP_HANDSHAKE_CONFIRMED";
      varianceClass = "STRICT_HANDSHAKE_COMPLETE";
      clean = true;
    } else if (requestObserved && grantObserved && relationship.topLevelBlocking === false) {
      status = "STRICT_ADVISORY_RELATIONSHIP_CONFIRMED";
      varianceClass = "STRICT_ADVISORY_CONFIRMED";
      clean = true;
    } else if (requestObserved && grantObserved) {
      status = "STRICT_RELATIONSHIP_FRONTPORT_CONFIRMED_RETURN_PENDING";
      varianceClass = "STRICT_FRONTPORT_ONLY";
      clean = false;
    } else if (requestObserved) {
      status = "STRICT_RELATIONSHIP_REQUEST_ONLY";
      varianceClass = "STRICT_REQUEST_ONLY";
      clean = false;
    } else {
      status = "STRICT_RELATIONSHIP_PERMISSION_NOT_CONFIRMED";
      varianceClass = "STRICT_PERMISSION_NOT_CONFIRMED";
      clean = false;
    }

    return {
      id: relationship.id,
      from: relationship.from,
      to: relationship.to,
      fromFile: fromNode ? fromNode.file : "UNKNOWN",
      toFile: toNode ? toNode.file : "UNKNOWN",
      requiredForMotion: relationship.requiredForMotion === true,
      requiredForVisibleSurface: relationship.requiredForVisibleSurface === true,
      topLevelBlocking: relationship.topLevelBlocking !== false,
      fromStrictObserved: fromStrict,
      toStrictObserved: toStrict,
      fromAnyObserved: fromAny,
      toAnyObserved: toAny,
      fromStatus: fromNode ? fromNode.nodeStatus : "UNKNOWN",
      toStatus: toNode ? toNode.nodeStatus : "UNKNOWN",
      fromIntegrityClass: fromNode ? fromNode.integrityClass : "UNKNOWN",
      toIntegrityClass: toNode ? toNode.integrityClass : "UNKNOWN",
      fromContract: fromNode ? fromNode.contract : "UNKNOWN",
      toContract: toNode ? toNode.contract : "UNKNOWN",
      requestObserved,
      grantObserved,
      returnObserved,
      relationshipClean: clean,
      relationshipPermissionGranted: clean,
      relationshipStatus: status,
      varianceClass,
      ...NO_CLAIMS
    };
  }

  function makeState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      foundationInternalRenewalContract: FOUNDATION_INTERNAL_RENEWAL_CONTRACT,
      baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,
      version: VERSION,

      packetName: REPORT_PACKET,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: nowIso(),

      northChronologyHubActive: true,
      northIsHubOnly: true,
      nineStepChronologyActive: true,
      diagnosticTrackRedesignActive: true,
      runtimeMapIntegrityActive: true,
      crossAuthorityContaminationGuardActive: true,
      datasetAdvisoryOnlyActive: true,
      canvasSurfaceTruthIsSupportingAnchor: true,
      canvasSurfaceTruthIsNotFinalArbiterWhenDiagnosticTrackCorrupt: true,
      receiverStillCallsNorthOnly: true,

      notes: [
        "NORTH_V11_PUBLIC_CONTRACT_PRESERVED",
        "NORTH_INTERNAL_V11_6_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_ACTIVE",
        "PREVIOUS_V11_5_POINTER_SURFACE_BISHOP_MAPPING_PRESERVED_AS_LINEAGE_ONLY",
        "CANVAS_SURFACE_TRUTH_CONSUMED_AS_SUPPORTING_ANCHOR",
        "RUNTIME_MAP_STRICT_ENDPOINT_PROOF_REQUIRED",
        "DATASET_CONTRACT_TEXT_IS_ADVISORY_ONLY",
        "BORROWED_AUTHORITY_CONTRACT_TEXT_DOES_NOT_PROVE_ENDPOINT",
        "CROSS_AUTHORITY_CONTAMINATION_DOMINATES_PRODUCTION_REPAIR_RECOMMENDATION",
        "NO_PRODUCTION_MUTATION_PERMISSION_GRANTED"
      ],

      targetContextStatus: "UNKNOWN",
      targetContextSource: "UNKNOWN",
      targetContextError: "UNKNOWN",

      chronology: [],
      evidenceByStep: {},

      diagnosticTrackHealthLaneStatus: "NOT_RUN",
      diagnosticTrackHealthLaneClean: "false",
      diagnosticTrackFirstFailureOwner: "UNKNOWN",
      diagnosticTrackFirstFailureFile: "UNKNOWN",
      diagnosticTrackFirstFailureClass: "UNKNOWN",
      diagnosticTrackFirstFailureReason: "UNKNOWN",

      targetSurfaceFactAnchorLaneStatus: "NOT_RUN",
      targetSurfaceFactAnchorLaneClean: "false",
      targetSurfaceFactAnchorStatus: "UNKNOWN",
      targetSurfaceFactAnchorClass: "UNKNOWN",
      targetSurfaceFactAnchorReason: "UNKNOWN",
      targetSurfaceFactAnchorOwner: "UNKNOWN",
      targetSurfaceFactAnchorFile: "UNKNOWN",
      targetSurfaceFactAnchorAction: "UNKNOWN",
      canvasSurfaceTruthProbeStatus: "NOT_RUN",
      canvasSurfaceTruthAvailable: "UNKNOWN",
      canvasElementFound: "UNKNOWN",
      canvasRectNonzero: "UNKNOWN",
      canvasContext2dReady: "UNKNOWN",
      canvasPixelVisible: "UNKNOWN",
      canvasViewportIntersecting: "UNKNOWN",
      canvasTruthFirstFailedCoordinate: "UNKNOWN",
      canvasTruthFailureClass: "UNKNOWN",
      canvasTruthFailureReason: "UNKNOWN",
      canvasTruthRecommendedOwner: "UNKNOWN",
      canvasTruthRecommendedFile: "UNKNOWN",
      canvasTruthRecommendedAction: "UNKNOWN",

      runtimeMapIntegrityLaneStatus: "NOT_RUN",
      runtimeMapIntegrityLaneClean: "false",
      runtimeMapFirstFailureOwner: "UNKNOWN",
      runtimeMapFirstFailureFile: "UNKNOWN",
      runtimeMapFirstFailureClass: "UNKNOWN",
      runtimeMapFirstFailureReason: "UNKNOWN",
      runtimeMapFirstRecommendedAction: "UNKNOWN",
      crossAuthorityContaminationCount: 0,
      firstCrossAuthorityContaminationOwner: "UNKNOWN",
      firstCrossAuthorityContaminationFile: "UNKNOWN",
      firstCrossAuthorityContaminationClass: "UNKNOWN",
      firstCrossAuthorityContaminationReason: "UNKNOWN",
      runtimeDarkFileCount: 0,
      runtimeDarkFiles: [],

      runtimeNodes: [],
      runtimeRelationships: [],
      strictRelationshipCleanCount: 0,
      strictRelationshipTotalCount: 0,
      strictRuntimeMapClean: false,

      finalArbitrationStatus: "NOT_RUN",
      finalArbitrationSource: "UNKNOWN",
      finalArbitrationReason: "UNKNOWN",

      zoneOfInflictionOwner: "UNKNOWN",
      zoneOfInflictionFile: "UNKNOWN",
      zoneOfInflictionClass: "UNKNOWN",
      zoneOfInflictionReason: "UNKNOWN",

      primaryCase: "INCONCLUSIVE_EVIDENCE",
      calibrationStatus: "CALIBRATION_NOT_RUN",
      calibrationHoldReason: "RUN_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",
      diagnosticChronologyClean: "false",
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      recommendedNextOwner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
      recommendedNextFile: FILE,
      recommendedNextAction: "RUN_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",

      reportObject: {},
      northVerdict: {},
      fullPacketText: "",
      compactSummary: "",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function extractEvidence(output) {
    if (!isObject(output)) return {};
    if (isObject(output.evidence)) return output.evidence;
    if (isObject(output.report)) return output.report;
    if (isObject(output.REPORT_OBJECT)) return output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.REPORT_OBJECT)) return output.output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.report)) return output.output.report;
    if (isObject(output.state) && isObject(output.state.reportObject)) return output.state.reportObject;
    if (isObject(output.canvasSurfaceTruth)) return output.canvasSurfaceTruth;
    return output;
  }

  function updateStateFromEvidence(state, step, evidence) {
    if (!isObject(evidence)) return;
    state.evidenceByStep[step.id] = clonePlain(evidence);

    state.canvasSurfaceTruthProbeStatus = firstKnown(
      getValue(evidence, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", ""),
      getValue(evidence, "CANVAS_SURFACE_TRUTH_STATUS", ""),
      state.canvasSurfaceTruthProbeStatus
    );
    state.canvasSurfaceTruthAvailable = firstKnown(getValue(evidence, "CANVAS_SURFACE_TRUTH_AVAILABLE", ""), state.canvasSurfaceTruthAvailable);
    state.canvasElementFound = firstKnown(getValue(evidence, "CANVAS_ELEMENT_FOUND", ""), state.canvasElementFound);
    state.canvasRectNonzero = firstKnown(getValue(evidence, "CANVAS_RECT_NONZERO", ""), state.canvasRectNonzero);
    state.canvasContext2dReady = firstKnown(getValue(evidence, "CANVAS_CONTEXT_2D_READY", ""), state.canvasContext2dReady);
    state.canvasPixelVisible = firstKnown(getValue(evidence, "CANVAS_PIXEL_VISIBLE", ""), state.canvasPixelVisible);
    state.canvasViewportIntersecting = firstKnown(getValue(evidence, "CANVAS_VIEWPORT_INTERSECTING", ""), state.canvasViewportIntersecting);

    state.canvasTruthFirstFailedCoordinate = firstKnown(getValue(evidence, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", ""), state.canvasTruthFirstFailedCoordinate);
    state.canvasTruthFailureClass = firstKnown(getValue(evidence, "CANVAS_TRUTH_FAILURE_CLASS", ""), state.canvasTruthFailureClass);
    state.canvasTruthFailureReason = firstKnown(getValue(evidence, "CANVAS_TRUTH_FAILURE_REASON", ""), state.canvasTruthFailureReason);
    state.canvasTruthRecommendedOwner = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_OWNER", ""), state.canvasTruthRecommendedOwner);
    state.canvasTruthRecommendedFile = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_FILE", ""), state.canvasTruthRecommendedFile);
    state.canvasTruthRecommendedAction = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_ACTION", ""), state.canvasTruthRecommendedAction);

    for (const note of normalizeNotes(
      getValue(evidence, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "CANVAS_SURFACE_TRUTH_NOTES", ""),
      getValue(evidence, "NOTES", "")
    )) {
      addNote(state, note);
    }
  }

  async function observeOrRecoverAuthority(step, entry, options) {
    const foundBefore = findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
    const scriptBefore = scriptInfo(step.file, doc);

    entry.scriptPresentBefore = scriptBefore.present;
    entry.scriptPresentAfter = scriptBefore.present;
    entry.scriptCountBefore = scriptBefore.count;
    entry.scriptCountAfter = scriptBefore.count;
    entry.scriptSrc = scriptBefore.src;
    entry.scriptCacheKey = scriptBefore.cacheKey;
    entry.observedBeforeLoad = Boolean(foundBefore.value);
    entry.authorityObservedBeforeRecovery = Boolean(foundBefore.value);
    entry.authorityRecoveryAttempted = false;
    entry.authorityRecoveryStatus = "NOT_REQUIRED";

    if (foundBefore.value) {
      entry.loadStatus = "ALREADY_OBSERVED";
      return foundBefore;
    }

    if (options.loadMissingScripts === false) {
      entry.loadStatus = "LOAD_SKIPPED_BY_OPTIONS";
      return findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
    }

    const load = await appendDiagnosticScript(step.file, step.id);
    entry.loadAttempted = load.attempted === true;
    entry.loadStatus = load.status;
    entry.scriptRecoverySrc = load.src;
    entry.authorityRecoveryAttempted = load.attempted === true;
    entry.authorityRecoveryStatus = load.status;

    const foundAfter = findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
    const scriptAfter = scriptInfo(step.file, doc);

    entry.scriptPresentAfter = scriptAfter.present;
    entry.scriptCountAfter = scriptAfter.count;
    entry.scriptSrc = scriptAfter.src;
    entry.scriptCacheKey = scriptAfter.cacheKey;
    entry.authorityObservedAfterRecovery = Boolean(foundAfter.value);

    if (foundAfter.value) {
      entry.authorityRecoveryStatus = `${load.status}_AUTHORITY_OBSERVED`;
    } else if (scriptAfter.present) {
      entry.authorityRecoveryStatus = `${load.status}_AUTHORITY_STILL_NOT_OBSERVED`;
    }

    return foundAfter;
  }

  async function processStep(state, step, targetContext, options = {}) {
    const entry = {
      order: step.order,
      id: step.id,
      fibonacciStage: step.fibonacciStage,
      role: step.role,
      file: step.file,
      expectedContract: step.expectedContract,
      owner: step.owner,
      expected: true,
      loadAttempted: false,
      loadStatus: step.id === "NORTH_RAIL" ? "SELF" : "NOT_ATTEMPTED",
      scriptPresentBefore: step.id === "NORTH_RAIL",
      scriptPresentAfter: step.id === "NORTH_RAIL",
      scriptCountBefore: step.id === "NORTH_RAIL" ? 1 : 0,
      scriptCountAfter: step.id === "NORTH_RAIL" ? 1 : 0,
      scriptSrc: step.id === "NORTH_RAIL" ? FILE : "UNKNOWN",
      scriptCacheKey: "NONE",
      authorityObservedBeforeRecovery: step.id === "NORTH_RAIL",
      authorityObservedAfterRecovery: step.id === "NORTH_RAIL",
      authorityRecoveryAttempted: false,
      authorityRecoveryStatus: step.id === "NORTH_RAIL" ? "SELF" : "NOT_ATTEMPTED",
      observedBeforeLoad: step.id === "NORTH_RAIL",
      observedAfterLoad: step.id === "NORTH_RAIL",
      observed: step.id === "NORTH_RAIL",
      sourcePath: step.id === "NORTH_RAIL" ? "SELF" : "NONE",
      contract: step.id === "NORTH_RAIL" ? CONTRACT : "UNKNOWN",
      receipt: step.id === "NORTH_RAIL" ? RECEIPT : "UNKNOWN",
      callAttempted: false,
      callMethod: "NONE",
      callReturned: false,
      callStatus: step.id === "NORTH_RAIL" ? "SELF_READY" : "NOT_CALLED",
      callError: "NONE",
      outputKeys: "NONE",
      status: step.id === "NORTH_RAIL" ? "COMPLETE" : "PENDING",
      ...NO_CLAIMS
    };

    if (step.id === "NORTH_RAIL") {
      state.chronology.push(entry);
      addNote(state, "CHRONOLOGY_STEP_COMPLETE:NORTH_RAIL");
      return { entry, output: {}, evidence: {} };
    }

    const found = await observeOrRecoverAuthority(step, entry, options);

    entry.observedAfterLoad = Boolean(found.value);
    entry.observed = Boolean(found.value);
    entry.sourcePath = found.path;

    if (!found.value) {
      entry.status = "NOT_OBSERVED";
      entry.callStatus = "NOT_CALLED_NOT_OBSERVED";
      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_NOT_OBSERVED:${step.id}:${step.file}`);
      return { entry, output: {}, evidence: {} };
    }

    const receipt = getReceiptFromAuthority(found.value) || {};
    entry.contract = contractOf(receipt, found.value);
    entry.receipt = receiptOf(receipt, found.value);

    const acceptedMethod = (step.methods || []).find((method) => isFunction(found.value[method]));

    if (!acceptedMethod) {
      entry.status = "OBSERVED_API_MISSING";
      entry.callStatus = "CALL_METHOD_NOT_FOUND";
      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_OBSERVED_API_MISSING:${step.id}`);
      updateStateFromEvidence(state, step, receipt || {});
      return { entry, output: receipt || {}, evidence: receipt || {} };
    }

    entry.callAttempted = true;
    entry.callMethod = acceptedMethod;

    try {
      const payload = {
        northContract: CONTRACT,
        northReceipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
        previousNorthContract: PREVIOUS_NORTH_CONTRACT,

        diagnosticTrackRedesignActive: true,
        runtimeMapIntegrityActive: true,
        crossAuthorityContaminationGuardActive: true,
        datasetAdvisoryOnlyActive: true,
        canvasSurfaceTruthIsSupportingAnchor: true,

        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        currentReport: clonePlain(state.reportObject || {}),
        chronology: clonePlain(state.chronology),
        evidenceByStep: clonePlain(state.evidenceByStep),

        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
        expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        expectedControlContract: EXPECTED_CONTROL_CONTRACT,
        expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
        expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
        expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
        expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
        expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

        pointerSurfaceFile: POINTER_SURFACE_FILE,
        pointerInspectFile: POINTER_INSPECT_FILE,

        targetWindow: targetContext.targetWindow,
        targetDocument: targetContext.targetDocument,
        frameElement: targetContext.frameElement,

        noClaims: clonePlain(NO_CLAIMS),
        options: {
          loadMissingScripts: options.loadMissingScripts !== false,
          source: "DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY"
        }
      };

      const output = await Promise.resolve(found.value[acceptedMethod](payload));
      const evidence = extractEvidence(output);

      entry.callReturned = true;
      entry.callStatus = "CALL_RETURNED";
      entry.status = "COMPLETE";
      entry.outputKeys = Object.keys(evidence || {}).slice(0, 120).join(",") || "OUTPUT_EMPTY";

      state.chronology.push(entry);
      updateStateFromEvidence(state, step, evidence);

      if (step.id === "PROBE_CANVAS_SURFACE_TRUTH") {
        state.canvasSurfaceTruthProbeStatus = firstKnown(state.canvasSurfaceTruthProbeStatus, "CALL_RETURNED");
        state.canvasSurfaceTruthAvailable = firstKnown(state.canvasSurfaceTruthAvailable, "true");
        addNote(state, "CANVAS_SURFACE_TRUTH_SUPPORTING_ANCHOR_RETURNED_TO_NORTH");
      }

      addNote(state, `CHRONOLOGY_STEP_COMPLETE:${step.id}:${acceptedMethod}`);
      return { entry, output, evidence };
    } catch (error) {
      entry.callReturned = false;
      entry.callStatus = "CALL_FAILED";
      entry.callError = bounded(error && error.message ? error.message : error, 1000);
      entry.status = "CALL_FAILED";

      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_CALL_FAILED:${step.id}:${entry.callError}`);

      return { entry, output: {}, evidence: {} };
    }
  }

  function classifyChronologyFailure(entry) {
    if (!entry) {
      return { className: "NONE", reason: "NONE", action: "NONE" };
    }

    if (entry.status === "NOT_OBSERVED") {
      if (entry.scriptPresentAfter && entry.authorityRecoveryAttempted) {
        return {
          className: "SCRIPT_PRESENT_AUTHORITY_NOT_PUBLISHED_AFTER_RECOVERY",
          reason: "SCRIPT_TAG_PRESENT_BUT_EXPECTED_PUBLIC_AUTHORITY_NOT_OBSERVED_AFTER_RECOVERY_LOAD",
          action: `RENEW_${entry.id}_PUBLIC_ALIAS_PUBLICATION_AND_SYNCHRONOUS_ANCHOR`
        };
      }

      return {
        className: "NOT_OBSERVED",
        reason: "EXPECTED_DIAGNOSTIC_FILE_NOT_OBSERVED_AFTER_LOAD_ATTEMPT",
        action: `CRAFT_OR_RENEW_${entry.id}_TO_CHRONOLOGY_STANDARD_AND_RERUN_DIAGNOSTIC`
      };
    }

    if (entry.status === "OBSERVED_API_MISSING") {
      return {
        className: "OBSERVED_API_MISSING",
        reason: "EXPECTED_DIAGNOSTIC_FILE_OBSERVED_BUT_REQUIRED_CALL_SURFACE_MISSING",
        action: `RENEW_${entry.id}_PUBLIC_API_SURFACE`
      };
    }

    if (entry.status === "CALL_FAILED") {
      return {
        className: "CALL_FAILED",
        reason: "EXPECTED_DIAGNOSTIC_FILE_CALL_FAILED",
        action: `RENEW_${entry.id}_CALL_GUARD_OR_RETURN_PACKET`
      };
    }

    return {
      className: entry.status || "UNKNOWN",
      reason: "CHRONOLOGY_STEP_FAILED",
      action: `AUDIT_${entry.id}`
    };
  }

  function resolveDiagnosticTrackHealthLane(state) {
    const firstFailure = state.chronology.find((entry) => {
      return (
        entry.id !== "NORTH_RAIL" &&
        (
          entry.status === "NOT_OBSERVED" ||
          entry.status === "CALL_FAILED" ||
          entry.status === "OBSERVED_API_MISSING"
        )
      );
    });

    if (firstFailure) {
      const classified = classifyChronologyFailure(firstFailure);

      state.diagnosticTrackHealthLaneStatus = "DIAGNOSTIC_TRACK_HEALTH_LANE_FAILED";
      state.diagnosticTrackHealthLaneClean = "false";
      state.diagnosticTrackFirstFailureOwner = firstFailure.owner;
      state.diagnosticTrackFirstFailureFile = firstFailure.file;
      state.diagnosticTrackFirstFailureClass = classified.className;
      state.diagnosticTrackFirstFailureReason = classified.reason;

      addNote(state, `DIAGNOSTIC_TRACK_HEALTH_LANE_FAILED:${firstFailure.id}:${classified.className}`);
      return;
    }

    state.diagnosticTrackHealthLaneStatus = "DIAGNOSTIC_TRACK_HEALTH_LANE_COMPLETE";
    state.diagnosticTrackHealthLaneClean = "true";
    state.diagnosticTrackFirstFailureOwner = "NONE";
    state.diagnosticTrackFirstFailureFile = "NONE";
    state.diagnosticTrackFirstFailureClass = "NONE";
    state.diagnosticTrackFirstFailureReason = "ALL_NINE_CHRONOLOGY_STEPS_RETURNED_OR_WERE_READABLE";

    addNote(state, "DIAGNOSTIC_TRACK_HEALTH_LANE_COMPLETE");
  }

  function resolveTargetSurfaceFactAnchorLane(state) {
    const probeEntry = state.chronology.find((entry) => entry.id === "PROBE_CANVAS_SURFACE_TRUTH");

    if (!probeEntry) {
      state.targetSurfaceFactAnchorLaneStatus = "TARGET_SURFACE_FACT_ANCHOR_NOT_RUN";
      state.targetSurfaceFactAnchorLaneClean = "false";
      state.targetSurfaceFactAnchorStatus = "CANVAS_SURFACE_TRUTH_PROBE_NOT_RUN";
      state.targetSurfaceFactAnchorClass = "CANVAS_SURFACE_TRUTH_PROBE_NOT_RUN";
      state.targetSurfaceFactAnchorReason = "NORTH_HAS_NOT_REACHED_CANVAS_SURFACE_TRUTH_PROBE";
      state.targetSurfaceFactAnchorOwner = "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH";
      state.targetSurfaceFactAnchorFile = PROBE_CANVAS_SURFACE_TRUTH_FILE;
      state.targetSurfaceFactAnchorAction = "RUN_NORTH_CHRONOLOGY_THROUGH_CANVAS_SURFACE_TRUTH_SUPPORTING_ANCHOR";
      return;
    }

    if (probeEntry.status !== "COMPLETE") {
      const classified = classifyChronologyFailure(probeEntry);

      state.targetSurfaceFactAnchorLaneStatus = "TARGET_SURFACE_FACT_ANCHOR_UNAVAILABLE";
      state.targetSurfaceFactAnchorLaneClean = "false";
      state.targetSurfaceFactAnchorStatus = "CANVAS_SURFACE_TRUTH_PROBE_UNAVAILABLE";
      state.targetSurfaceFactAnchorClass = classified.className;
      state.targetSurfaceFactAnchorReason = classified.reason;
      state.targetSurfaceFactAnchorOwner = probeEntry.owner;
      state.targetSurfaceFactAnchorFile = probeEntry.file;
      state.targetSurfaceFactAnchorAction = classified.action;
      return;
    }

    const pass =
      state.canvasTruthFailureClass === "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED" ||
      state.canvasTruthFailureClass === "CANVAS_SURFACE_TRUTH_CONFIRMED" ||
      state.canvasTruthFailureClass === "CANVAS_SURFACE_TRUTH_PASS" ||
      (
        textIsTrue(state.canvasElementFound) &&
        textIsTrue(state.canvasRectNonzero) &&
        textIsTrue(state.canvasContext2dReady) &&
        textIsTrue(state.canvasPixelVisible)
      );

    if (pass) {
      state.targetSurfaceFactAnchorLaneStatus = "TARGET_SURFACE_FACT_ANCHOR_PASSED";
      state.targetSurfaceFactAnchorLaneClean = "true";
      state.targetSurfaceFactAnchorStatus = "CANVAS_SURFACE_TRUTH_FACTS_CONFIRMED";
      state.targetSurfaceFactAnchorClass = "CANVAS_SURFACE_TRUTH_FACTS_CONFIRMED";
      state.targetSurfaceFactAnchorReason = "CANVAS_SURFACE_FACTS_PASSED_NO_FINAL_VISUAL_PASS_CLAIM";
      state.targetSurfaceFactAnchorOwner = "NONE";
      state.targetSurfaceFactAnchorFile = "NONE";
      state.targetSurfaceFactAnchorAction = "CONTINUE_TO_RUNTIME_MAP_INTEGRITY_LANE";
      addNote(state, "TARGET_SURFACE_FACT_ANCHOR_PASSED");
      return;
    }

    state.targetSurfaceFactAnchorLaneStatus = "TARGET_SURFACE_FACT_ANCHOR_FAILED";
    state.targetSurfaceFactAnchorLaneClean = "false";
    state.targetSurfaceFactAnchorStatus = firstKnown(state.canvasTruthFailureClass, "CANVAS_SURFACE_TRUTH_FACT_ANCHOR_FAILED");
    state.targetSurfaceFactAnchorClass = firstKnown(state.canvasTruthFailureClass, "CANVAS_SURFACE_TRUTH_FACT_ANCHOR_FAILED");
    state.targetSurfaceFactAnchorReason = firstKnown(state.canvasTruthFailureReason, "CANVAS_SURFACE_TRUTH_SUPPORTING_ANCHOR_REPORTED_FAILURE");
    state.targetSurfaceFactAnchorOwner = firstKnown(state.canvasTruthRecommendedOwner, "CANVAS_SURFACE_TRUTH_SUPPORTING_ANCHOR");
    state.targetSurfaceFactAnchorFile = firstKnown(state.canvasTruthRecommendedFile, "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN");
    state.targetSurfaceFactAnchorAction = firstKnown(state.canvasTruthRecommendedAction, "READ_TARGET_SURFACE_FACTS");

    addNote(state, `TARGET_SURFACE_FACT_ANCHOR_FAILED:${state.targetSurfaceFactAnchorClass}`);
  }

  function resolveRuntimeMapIntegrityLane(state, targetContext) {
    const nodes = RUNTIME_NODES.map((node) => readRuntimeNodeStrict(node, targetContext));
    const nodesById = {};
    nodes.forEach((node) => { nodesById[node.id] = node; });

    const relationships = RELATIONSHIPS.map((relationship) => evaluateRelationshipStrict(relationship, nodesById));
    const contaminated = nodes.filter((node) => node.crossAuthorityContamination === true);
    const dark = nodes.filter((node) => node.dark === true);
    const blockingRelationshipFailure = relationships.find((entry) => {
      return entry.topLevelBlocking === true && entry.relationshipClean !== true;
    }) || null;
    const firstFailure = contaminated[0] || dark[0] || blockingRelationshipFailure || null;

    state.runtimeNodes = nodes;
    state.runtimeRelationships = relationships;
    state.strictRelationshipCleanCount = relationships.filter((entry) => entry.relationshipClean === true).length;
    state.strictRelationshipTotalCount = relationships.length;

    state.crossAuthorityContaminationCount = contaminated.length;
    state.firstCrossAuthorityContaminationOwner = contaminated[0] ? contaminated[0].id : "NONE";
    state.firstCrossAuthorityContaminationFile = contaminated[0] ? contaminated[0].file : "NONE";
    state.firstCrossAuthorityContaminationClass = contaminated[0] ? contaminated[0].integrityClass : "NONE";
    state.firstCrossAuthorityContaminationReason = contaminated[0] ? contaminated[0].contaminationReason : "NONE";

    state.runtimeDarkFiles = dark.map((node) => ({
      id: node.id,
      role: node.role,
      file: node.file,
      childOf: node.childOf,
      advisoryChild: node.advisoryChild,
      strictObserved: node.strictObserved,
      authorityPresent: node.authorityPresent,
      scriptPresent: node.scriptPresent,
      selectedAliasPath: node.selectedAliasPath,
      aliasFamilyMatches: node.aliasFamilyMatches,
      contract: node.contract,
      contractRecognized: node.contractRecognized,
      contractFamilyMatches: node.contractFamilyMatches,
      nodeStatus: node.nodeStatus,
      integrityClass: node.integrityClass,
      crossAuthorityContamination: node.crossAuthorityContamination,
      contaminationReason: node.contaminationReason
    }));
    state.runtimeDarkFileCount = state.runtimeDarkFiles.length;

    if (!firstFailure) {
      state.runtimeMapIntegrityLaneStatus = "RUNTIME_MAP_INTEGRITY_LANE_COMPLETE";
      state.runtimeMapIntegrityLaneClean = "true";
      state.runtimeMapFirstFailureOwner = "NONE";
      state.runtimeMapFirstFailureFile = "NONE";
      state.runtimeMapFirstFailureClass = "NONE";
      state.runtimeMapFirstFailureReason = "STRICT_RUNTIME_ENDPOINTS_AND_RELATIONSHIPS_CONFIRMED";
      state.runtimeMapFirstRecommendedAction = "CONTINUE_TO_TARGET_SURFACE_FACT_REVIEW";
      state.strictRuntimeMapClean = true;
      addNote(state, "RUNTIME_MAP_INTEGRITY_LANE_COMPLETE");
      return;
    }

    if (firstFailure.crossAuthorityContamination) {
      state.runtimeMapIntegrityLaneStatus = "RUNTIME_MAP_INTEGRITY_LANE_FAILED_CROSS_AUTHORITY_CONTAMINATION";
      state.runtimeMapIntegrityLaneClean = "false";
      state.runtimeMapFirstFailureOwner = firstFailure.id;
      state.runtimeMapFirstFailureFile = firstFailure.file;
      state.runtimeMapFirstFailureClass = "CROSS_AUTHORITY_CONTAMINATION";
      state.runtimeMapFirstFailureReason = firstFailure.contaminationReason;
      state.runtimeMapFirstRecommendedAction =
        "RENEW_DIAGNOSTIC_TRACK_RUNTIME_NODE_READER_TO_REQUIRE_STRICT_ALIAS_FILE_CONTRACT_FAMILY_MATCH";
      state.strictRuntimeMapClean = false;
      addNote(state, `RUNTIME_MAP_CROSS_AUTHORITY_CONTAMINATION:${firstFailure.id}:${firstFailure.contaminationReason}`);
      return;
    }

    if (firstFailure.id && firstFailure.integrityClass) {
      state.runtimeMapIntegrityLaneStatus = "RUNTIME_MAP_INTEGRITY_LANE_FAILED_ENDPOINT_NOT_STRICT";
      state.runtimeMapIntegrityLaneClean = "false";
      state.runtimeMapFirstFailureOwner = firstFailure.id;
      state.runtimeMapFirstFailureFile = firstFailure.file;
      state.runtimeMapFirstFailureClass = firstFailure.integrityClass;
      state.runtimeMapFirstFailureReason = firstFailure.nodeStatus;
      state.runtimeMapFirstRecommendedAction =
        "CONFIRM_PUBLIC_AUTHORITY_ALIAS_SCRIPT_AND_OWN_CONTRACT_FOR_RUNTIME_ENDPOINT";
      state.strictRuntimeMapClean = false;
      addNote(state, `RUNTIME_MAP_ENDPOINT_NOT_STRICT:${firstFailure.id}:${firstFailure.integrityClass}`);
      return;
    }

    state.runtimeMapIntegrityLaneStatus = "RUNTIME_MAP_INTEGRITY_LANE_FAILED_RELATIONSHIP";
    state.runtimeMapIntegrityLaneClean = "false";
    state.runtimeMapFirstFailureOwner = firstFailure.to || firstFailure.from || "RUNTIME_RELATIONSHIP";
    state.runtimeMapFirstFailureFile = firstFailure.toFile || firstFailure.fromFile || "UNKNOWN";
    state.runtimeMapFirstFailureClass = firstFailure.varianceClass || "STRICT_RELATIONSHIP_FAILURE";
    state.runtimeMapFirstFailureReason = firstFailure.relationshipStatus || "STRICT_RELATIONSHIP_NOT_CONFIRMED";
    state.runtimeMapFirstRecommendedAction =
      "CONFIRM_STRICT_ENDPOINTS_BEFORE_USING_RELATIONSHIP_TEXT_AS_PERMISSION_PROOF";
    state.strictRuntimeMapClean = false;
    addNote(state, `RUNTIME_MAP_RELATIONSHIP_FAILED:${firstFailure.id}:${state.runtimeMapFirstFailureClass}`);
  }

  function runFinalArbitration(state) {
    if (state.diagnosticTrackHealthLaneClean !== "true") {
      state.finalArbitrationStatus = "FINAL_ARBITRATION_HOLD_DIAGNOSTIC_TRACK_HEALTH";
      state.finalArbitrationSource = "DIAGNOSTIC_TRACK_HEALTH_LANE";
      state.finalArbitrationReason = state.diagnosticTrackFirstFailureReason;

      state.zoneOfInflictionOwner = state.diagnosticTrackFirstFailureOwner;
      state.zoneOfInflictionFile = state.diagnosticTrackFirstFailureFile;
      state.zoneOfInflictionClass = state.diagnosticTrackFirstFailureClass;
      state.zoneOfInflictionReason = state.diagnosticTrackFirstFailureReason;

      state.primaryCase = "DIAGNOSTIC_TRACK_HEALTH_FAILURE";
      state.calibrationStatus = "CALIBRATION_HOLD_DIAGNOSTIC_TRACK_HEALTH";
      state.calibrationHoldReason = state.diagnosticTrackFirstFailureReason;
      state.diagnosticChronologyClean = "false";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = state.diagnosticTrackFirstFailureOwner;
      state.recommendedNextFile = state.diagnosticTrackFirstFailureFile;
      state.recommendedNextAction = "RENEW_FIRST_FAILED_DIAGNOSTIC_TRACK_STEP";
      return;
    }

    state.diagnosticChronologyClean = "true";

    if (state.runtimeMapIntegrityLaneClean !== "true") {
      state.finalArbitrationStatus = "FINAL_ARBITRATION_HOLD_RUNTIME_MAP_INTEGRITY";
      state.finalArbitrationSource = "RUNTIME_MAP_INTEGRITY_LANE";
      state.finalArbitrationReason = state.runtimeMapFirstFailureReason;

      state.zoneOfInflictionOwner = state.runtimeMapFirstFailureOwner;
      state.zoneOfInflictionFile = state.runtimeMapFirstFailureFile;
      state.zoneOfInflictionClass = state.runtimeMapFirstFailureClass;
      state.zoneOfInflictionReason = state.runtimeMapFirstFailureReason;

      state.primaryCase = state.crossAuthorityContaminationCount > 0
        ? "DIAGNOSTIC_TRACK_RUNTIME_MAP_CROSS_AUTHORITY_CONTAMINATION"
        : "DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_FAILURE";
      state.calibrationStatus = "CALIBRATION_HOLD_RUNTIME_MAP_INTEGRITY";
      state.calibrationHoldReason = state.runtimeMapFirstFailureReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = state.runtimeMapFirstRecommendedAction;

      addNote(state, "FINAL_ARBITRATION_SELECTED_RUNTIME_MAP_INTEGRITY_BEFORE_PRODUCTION_REPAIR");
      addNote(state, "TARGET_SURFACE_FACT_ANCHOR_RETAINED_AS_SUPPORTING_EVIDENCE_ONLY");
      return;
    }

    if (state.targetSurfaceFactAnchorLaneClean !== "true") {
      state.finalArbitrationStatus = "FINAL_ARBITRATION_HOLD_TARGET_SURFACE_FACT_ANCHOR";
      state.finalArbitrationSource = "TARGET_SURFACE_FACT_ANCHOR_LANE";
      state.finalArbitrationReason = state.targetSurfaceFactAnchorReason;

      state.zoneOfInflictionOwner = state.targetSurfaceFactAnchorOwner;
      state.zoneOfInflictionFile = state.targetSurfaceFactAnchorFile;
      state.zoneOfInflictionClass = state.targetSurfaceFactAnchorClass;
      state.zoneOfInflictionReason = state.targetSurfaceFactAnchorReason;

      state.primaryCase = "TARGET_SURFACE_FACT_ANCHOR_FAILURE_AFTER_RUNTIME_MAP_INTEGRITY_CONFIRMED";
      state.calibrationStatus = "CALIBRATION_HOLD_TARGET_SURFACE_FACT_ANCHOR";
      state.calibrationHoldReason = state.targetSurfaceFactAnchorReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = state.targetSurfaceFactAnchorOwner;
      state.recommendedNextFile = state.targetSurfaceFactAnchorFile;
      state.recommendedNextAction = state.targetSurfaceFactAnchorAction;

      addNote(state, "FINAL_ARBITRATION_SELECTED_TARGET_SURFACE_FACT_ANCHOR_AFTER_RUNTIME_MAP_CLEAN");
      return;
    }

    state.finalArbitrationStatus = "FINAL_ARBITRATION_COMPLETE";
    state.finalArbitrationSource = "ALL_REDESIGNED_DIAGNOSTIC_TRACK_LANES";
    state.finalArbitrationReason =
      "DIAGNOSTIC_TRACK_HEALTH_RUNTIME_MAP_INTEGRITY_AND_TARGET_SURFACE_FACT_ANCHOR_LANES_COMPLETE";

    state.zoneOfInflictionOwner = "NONE";
    state.zoneOfInflictionFile = "NONE";
    state.zoneOfInflictionClass = "NONE";
    state.zoneOfInflictionReason = "ALL_REDESIGNED_DIAGNOSTIC_TRACK_LANES_COMPLETE_NO_VISUAL_PASS_CLAIM";

    state.primaryCase = "DIAGNOSTIC_TRACK_REANCHORED_COMPLETE_NO_VISUAL_PASS_CLAIM";
    state.calibrationStatus = "CALIBRATION_TRACK_COMPLETE";
    state.calibrationHoldReason = "NONE";
    state.diagnosticRailClean = "true";
    state.calibrationPointReached = "true";
    state.recommendedNextOwner = "TEACHER_REVIEW";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "REVIEW_REANCHORED_DIAGNOSTIC_TRACK_NO_READY_OR_VISUAL_PASS_CLAIM";

    addNote(state, "FINAL_ARBITRATION_COMPLETE_ALL_REDESIGNED_LANES");
  }

  function chronologyText(state) {
    return state.chronology.map((entry) => {
      return [
        `${entry.order}.${entry.id}`,
        `fib:${entry.fibonacciStage}`,
        `file:${entry.file}`,
        `script:${entry.scriptPresentAfter}`,
        `recovery:${entry.authorityRecoveryStatus}`,
        `observed:${entry.observed}`,
        `call:${entry.callStatus}`,
        `status:${entry.status}`
      ].join(" ");
    }).join(" | ");
  }

  function buildNorthVerdict(state) {
    return {
      schema: "HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_VERDICT_SCHEMA_v11_6",
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      foundationInternalRenewalContract: FOUNDATION_INTERNAL_RENEWAL_CONTRACT,
      baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: state.diagnosticTimestamp,

      hub: {
        chronologyHubActive: true,
        northIsHubOnly: true,
        nineStepChronologyActive: true,
        diagnosticTrackRedesignActive: true,
        runtimeMapIntegrityActive: true,
        crossAuthorityContaminationGuardActive: true,
        datasetAdvisoryOnlyActive: true,
        canvasSurfaceTruthIsSupportingAnchor: true,
        canvasSurfaceTruthIsNotFinalArbiterWhenDiagnosticTrackCorrupt: true,
        receiverStillCallsNorthOnly: true
      },

      lanes: {
        diagnosticTrackHealth: {
          status: state.diagnosticTrackHealthLaneStatus,
          clean: state.diagnosticTrackHealthLaneClean,
          firstFailureOwner: state.diagnosticTrackFirstFailureOwner,
          firstFailureFile: state.diagnosticTrackFirstFailureFile,
          firstFailureClass: state.diagnosticTrackFirstFailureClass,
          firstFailureReason: state.diagnosticTrackFirstFailureReason
        },
        runtimeMapIntegrity: {
          status: state.runtimeMapIntegrityLaneStatus,
          clean: state.runtimeMapIntegrityLaneClean,
          firstFailureOwner: state.runtimeMapFirstFailureOwner,
          firstFailureFile: state.runtimeMapFirstFailureFile,
          firstFailureClass: state.runtimeMapFirstFailureClass,
          firstFailureReason: state.runtimeMapFirstFailureReason,
          firstRecommendedAction: state.runtimeMapFirstRecommendedAction,
          crossAuthorityContaminationCount: state.crossAuthorityContaminationCount
        },
        targetSurfaceFactAnchor: {
          status: state.targetSurfaceFactAnchorLaneStatus,
          clean: state.targetSurfaceFactAnchorLaneClean,
          anchorStatus: state.targetSurfaceFactAnchorStatus,
          anchorClass: state.targetSurfaceFactAnchorClass,
          anchorReason: state.targetSurfaceFactAnchorReason,
          owner: state.targetSurfaceFactAnchorOwner,
          file: state.targetSurfaceFactAnchorFile,
          action: state.targetSurfaceFactAnchorAction
        },
        finalArbitration: {
          status: state.finalArbitrationStatus,
          source: state.finalArbitrationSource,
          reason: state.finalArbitrationReason
        }
      },

      runtimeMapIntegrity: {
        runtimeNodes: clonePlain(state.runtimeNodes),
        runtimeRelationships: clonePlain(state.runtimeRelationships),
        runtimeDarkFiles: clonePlain(state.runtimeDarkFiles),
        crossAuthorityContaminationCount: state.crossAuthorityContaminationCount,
        firstCrossAuthorityContaminationOwner: state.firstCrossAuthorityContaminationOwner,
        firstCrossAuthorityContaminationFile: state.firstCrossAuthorityContaminationFile,
        firstCrossAuthorityContaminationClass: state.firstCrossAuthorityContaminationClass,
        firstCrossAuthorityContaminationReason: state.firstCrossAuthorityContaminationReason,
        strictRelationshipCleanCount: state.strictRelationshipCleanCount,
        strictRelationshipTotalCount: state.strictRelationshipTotalCount,
        strictRuntimeMapClean: state.strictRuntimeMapClean
      },

      canvasSurfaceTruthSupportingAnchor: {
        probeStatus: state.canvasSurfaceTruthProbeStatus,
        available: state.canvasSurfaceTruthAvailable,
        canvasElementFound: state.canvasElementFound,
        canvasRectNonzero: state.canvasRectNonzero,
        canvasContext2dReady: state.canvasContext2dReady,
        canvasPixelVisible: state.canvasPixelVisible,
        canvasViewportIntersecting: state.canvasViewportIntersecting,
        firstFailedCoordinate: state.canvasTruthFirstFailedCoordinate,
        failureClass: state.canvasTruthFailureClass,
        failureReason: state.canvasTruthFailureReason,
        recommendedOwner: state.canvasTruthRecommendedOwner,
        recommendedFile: state.canvasTruthRecommendedFile,
        recommendedAction: state.canvasTruthRecommendedAction
      },

      chronology: clonePlain(state.chronology),
      zoneOfInfliction: {
        owner: state.zoneOfInflictionOwner,
        file: state.zoneOfInflictionFile,
        class: state.zoneOfInflictionClass,
        reason: state.zoneOfInflictionReason
      },

      primaryCase: state.primaryCase,
      calibrationStatus: state.calibrationStatus,
      calibrationHoldReason: state.calibrationHoldReason,
      diagnosticChronologyClean: state.diagnosticChronologyClean,
      diagnosticRailClean: state.diagnosticRailClean,
      calibrationPointReached: state.calibrationPointReached,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      notes: normalizeNotes(state.notes),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildReportObject(state) {
    const notes = normalizeNotes(state.notes).join(" | ") || "none";

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: state.diagnosticTimestamp,

      NORTH_CONTRACT: CONTRACT,
      NORTH_RECEIPT: RECEIPT,
      NORTH_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      NORTH_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      NORTH_PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      NORTH_PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      NORTH_LINEAGE_INTERNAL_RENEWAL_CONTRACT: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      NORTH_FOUNDATION_INTERNAL_RENEWAL_CONTRACT: FOUNDATION_INTERNAL_RENEWAL_CONTRACT,
      NORTH_BASELINE_INTERNAL_RENEWAL_CONTRACT: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_NORTH_CONTRACT,
      PREVIOUS_NORTH_RECEIPT,

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      NINE_STEP_CHRONOLOGY_ACTIVE: true,
      DIAGNOSTIC_TRACK_REDESIGN_ACTIVE: true,
      RUNTIME_MAP_INTEGRITY_ACTIVE: true,
      CROSS_AUTHORITY_CONTAMINATION_GUARD_ACTIVE: true,
      DATASET_ADVISORY_ONLY_ACTIVE: true,
      CANVAS_SURFACE_TRUTH_IS_SUPPORTING_ANCHOR: true,
      CANVAS_SURFACE_TRUTH_IS_NOT_FINAL_ARBITER_WHEN_DIAGNOSTIC_TRACK_CORRUPT: true,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,

      RAIL_NORTH_FILE: FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_INSPECT_CONTRACT,

      TARGET_CONTEXT_STATUS: state.targetContextStatus,
      TARGET_CONTEXT_SOURCE: state.targetContextSource,
      TARGET_CONTEXT_ERROR: state.targetContextError,

      CHRONOLOGY_SEQUENCE: clonePlain(state.chronology),
      CHRONOLOGY_SEQUENCE_JSON: clonePlain(state.chronology),
      CHRONOLOGY_SEQUENCE_TEXT: chronologyText(state),

      DIAGNOSTIC_TRACK_HEALTH_LANE_STATUS: state.diagnosticTrackHealthLaneStatus,
      DIAGNOSTIC_TRACK_HEALTH_LANE_CLEAN: state.diagnosticTrackHealthLaneClean,
      DIAGNOSTIC_TRACK_FIRST_FAILURE_OWNER: state.diagnosticTrackFirstFailureOwner,
      DIAGNOSTIC_TRACK_FIRST_FAILURE_FILE: state.diagnosticTrackFirstFailureFile,
      DIAGNOSTIC_TRACK_FIRST_FAILURE_CLASS: state.diagnosticTrackFirstFailureClass,
      DIAGNOSTIC_TRACK_FIRST_FAILURE_REASON: state.diagnosticTrackFirstFailureReason,

      RUNTIME_MAP_INTEGRITY_LANE_STATUS: state.runtimeMapIntegrityLaneStatus,
      RUNTIME_MAP_INTEGRITY_LANE_CLEAN: state.runtimeMapIntegrityLaneClean,
      RUNTIME_MAP_FIRST_FAILURE_OWNER: state.runtimeMapFirstFailureOwner,
      RUNTIME_MAP_FIRST_FAILURE_FILE: state.runtimeMapFirstFailureFile,
      RUNTIME_MAP_FIRST_FAILURE_CLASS: state.runtimeMapFirstFailureClass,
      RUNTIME_MAP_FIRST_FAILURE_REASON: state.runtimeMapFirstFailureReason,
      RUNTIME_MAP_FIRST_RECOMMENDED_ACTION: state.runtimeMapFirstRecommendedAction,
      CROSS_AUTHORITY_CONTAMINATION_COUNT: state.crossAuthorityContaminationCount,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_OWNER: state.firstCrossAuthorityContaminationOwner,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_FILE: state.firstCrossAuthorityContaminationFile,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_CLASS: state.firstCrossAuthorityContaminationClass,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_REASON: state.firstCrossAuthorityContaminationReason,

      TARGET_SURFACE_FACT_ANCHOR_LANE_STATUS: state.targetSurfaceFactAnchorLaneStatus,
      TARGET_SURFACE_FACT_ANCHOR_LANE_CLEAN: state.targetSurfaceFactAnchorLaneClean,
      TARGET_SURFACE_FACT_ANCHOR_STATUS: state.targetSurfaceFactAnchorStatus,
      TARGET_SURFACE_FACT_ANCHOR_CLASS: state.targetSurfaceFactAnchorClass,
      TARGET_SURFACE_FACT_ANCHOR_REASON: state.targetSurfaceFactAnchorReason,
      TARGET_SURFACE_FACT_ANCHOR_OWNER: state.targetSurfaceFactAnchorOwner,
      TARGET_SURFACE_FACT_ANCHOR_FILE: state.targetSurfaceFactAnchorFile,
      TARGET_SURFACE_FACT_ANCHOR_ACTION: state.targetSurfaceFactAnchorAction,

      FINAL_ARBITRATION_STATUS: state.finalArbitrationStatus,
      FINAL_ARBITRATION_SOURCE: state.finalArbitrationSource,
      FINAL_ARBITRATION_REASON: state.finalArbitrationReason,

      ZONE_OF_INFLICTION_OWNER: state.zoneOfInflictionOwner,
      ZONE_OF_INFLICTION_FILE: state.zoneOfInflictionFile,
      ZONE_OF_INFLICTION_CLASS: state.zoneOfInflictionClass,
      ZONE_OF_INFLICTION_REASON: state.zoneOfInflictionReason,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: state.canvasSurfaceTruthProbeStatus,
      CANVAS_SURFACE_TRUTH_AVAILABLE: state.canvasSurfaceTruthAvailable,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_CONTEXT_2D_READY: state.canvasContext2dReady,
      CANVAS_PIXEL_VISIBLE: state.canvasPixelVisible,
      CANVAS_VIEWPORT_INTERSECTING: state.canvasViewportIntersecting,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: state.canvasTruthFirstFailedCoordinate,
      CANVAS_TRUTH_FAILURE_CLASS: state.canvasTruthFailureClass,
      CANVAS_TRUTH_FAILURE_REASON: state.canvasTruthFailureReason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: state.canvasTruthRecommendedOwner,
      CANVAS_TRUTH_RECOMMENDED_FILE: state.canvasTruthRecommendedFile,
      CANVAS_TRUTH_RECOMMENDED_ACTION: state.canvasTruthRecommendedAction,

      RUNTIME_DARK_FILE_COUNT: state.runtimeDarkFileCount,
      RUNTIME_DARK_FILES: clonePlain(state.runtimeDarkFiles),
      RUNTIME_NODES: clonePlain(state.runtimeNodes),
      RUNTIME_RELATIONSHIPS: clonePlain(state.runtimeRelationships),
      STRICT_RELATIONSHIP_CLEAN_COUNT: state.strictRelationshipCleanCount,
      STRICT_RELATIONSHIP_TOTAL_COUNT: state.strictRelationshipTotalCount,
      STRICT_RUNTIME_MAP_CLEAN: state.strictRuntimeMapClean,

      PRIMARY_CASE: state.primaryCase,
      CALIBRATION_STATUS: state.calibrationStatus,
      CALIBRATION_HOLD_REASON: state.calibrationHoldReason,
      DIAGNOSTIC_CHRONOLOGY_CLEAN: state.diagnosticChronologyClean,
      DIAGNOSTIC_RAIL_CLEAN: state.diagnosticRailClean,
      CALIBRATION_POINT_REACHED: state.calibrationPointReached,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      SECONDARY_EVIDENCE_NOTES: notes,
      NORTH_SECONDARY_EVIDENCE_NOTES: notes,
      NORTH_VERDICT: clonePlain(state.northVerdict),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "NORTH_INTERNAL_RENEWAL_CONTRACT",
      "NORTH_INTERNAL_RENEWAL_RECEIPT",
      "NORTH_PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_TRACK_REDESIGN_ACTIVE",
      "RUNTIME_MAP_INTEGRITY_ACTIVE",
      "CROSS_AUTHORITY_CONTAMINATION_GUARD_ACTIVE",
      "DATASET_ADVISORY_ONLY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_IS_SUPPORTING_ANCHOR",
      "DIAGNOSTIC_TRACK_HEALTH_LANE_STATUS",
      "RUNTIME_MAP_INTEGRITY_LANE_STATUS",
      "TARGET_SURFACE_FACT_ANCHOR_LANE_STATUS",
      "FINAL_ARBITRATION_STATUS",
      "FINAL_ARBITRATION_SOURCE",
      "FINAL_ARBITRATION_REASON",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",
      "RUNTIME_MAP_FIRST_FAILURE_OWNER",
      "RUNTIME_MAP_FIRST_FAILURE_FILE",
      "RUNTIME_MAP_FIRST_FAILURE_CLASS",
      "RUNTIME_MAP_FIRST_FAILURE_REASON",
      "CROSS_AUTHORITY_CONTAMINATION_COUNT",
      "FIRST_CROSS_AUTHORITY_CONTAMINATION_OWNER",
      "FIRST_CROSS_AUTHORITY_CONTAMINATION_FILE",
      "FIRST_CROSS_AUTHORITY_CONTAMINATION_CLASS",
      "FIRST_CROSS_AUTHORITY_CONTAMINATION_REASON",
      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_RECT_NONZERO",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "SECONDARY_EVIDENCE_NOTES",
      "NORTH_VERDICT",
      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("NORTH_CONTRACT", getValue(report, "NORTH_CONTRACT", CONTRACT)),
      line("NORTH_INTERNAL_RENEWAL_CONTRACT", getValue(report, "NORTH_INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT)),
      line("DIAGNOSTIC_TRACK_HEALTH_LANE_STATUS", getValue(report, "DIAGNOSTIC_TRACK_HEALTH_LANE_STATUS", "UNKNOWN")),
      line("RUNTIME_MAP_INTEGRITY_LANE_STATUS", getValue(report, "RUNTIME_MAP_INTEGRITY_LANE_STATUS", "UNKNOWN")),
      line("TARGET_SURFACE_FACT_ANCHOR_LANE_STATUS", getValue(report, "TARGET_SURFACE_FACT_ANCHOR_LANE_STATUS", "UNKNOWN")),
      line("FINAL_ARBITRATION_SOURCE", getValue(report, "FINAL_ARBITRATION_SOURCE", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_FILE", getValue(report, "ZONE_OF_INFLICTION_FILE", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_CLASS", getValue(report, "ZONE_OF_INFLICTION_CLASS", "UNKNOWN")),
      line("CROSS_AUTHORITY_CONTAMINATION_COUNT", getValue(report, "CROSS_AUTHORITY_CONTAMINATION_COUNT", "UNKNOWN")),
      line("FIRST_CROSS_AUTHORITY_CONTAMINATION_FILE", getValue(report, "FIRST_CROSS_AUTHORITY_CONTAMINATION_FILE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getValue(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  function publish(state) {
    const nextState = state || lastState || makeState();

    lastState = clonePlain(nextState);
    lastVerdict = clonePlain(
      nextState.northVerdict && Object.keys(nextState.northVerdict).length
        ? nextState.northVerdict
        : buildNorthVerdict(nextState)
    );
    lastReport = clonePlain(
      nextState.reportObject && Object.keys(nextState.reportObject).length
        ? nextState.reportObject
        : buildReportObject(nextState)
    );
    lastPacketText = nextState.fullPacketText || composePacketText(lastReport);
    lastCompactSummary = nextState.compactSummary || composeCompactSummary(lastReport);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticRail = api;
    root.HEARTH.parallelDiagnosticRail = api;
    root.HEARTH.diagnosticNorth = api;
    root.HEARTH.diagnosticRailNorth = api;
    root.HEARTH.diagnosticNorthChronologyHub = api;
    root.HEARTH.diagnosticNorthCanvasSurfaceTruthChronologyHub = api;
    root.HEARTH.diagnosticNorthReanchorDiagnosticTrackRuntimeMapIntegrity = api;

    root.DEXTER_LAB.hearthDiagnosticRail = api;
    root.DEXTER_LAB.hearthDiagnosticNorth = api;
    root.DEXTER_LAB.hearthDiagnosticNorthChronologyHub = api;
    root.DEXTER_LAB.hearthDiagnosticNorthCanvasSurfaceTruthChronologyHub = api;
    root.DEXTER_LAB.hearthDiagnosticNorthReanchorDiagnosticTrackRuntimeMapIntegrity = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;
    root.HEARTH_DIAGNOSTIC_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB = api;
    root.HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_VERDICT = clonePlain(lastVerdict);

    root.HEARTH_DIAGNOSTIC_RAIL_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_PACKET_TEXT = lastPacketText;

    return true;
  }

  async function runDiagnostic(options = {}) {
    const state = makeState();
    const targetContext = getTargetContext(options);

    state.targetContextStatus = targetContext.accessStatus;
    state.targetContextSource = targetContext.source;
    state.targetContextError = targetContext.accessError;

    try {
      for (const step of CHRONOLOGY_STEPS) {
        await processStep(state, step, targetContext, options);
      }

      resolveDiagnosticTrackHealthLane(state);
      resolveTargetSurfaceFactAnchorLane(state);
      resolveRuntimeMapIntegrityLane(state, targetContext);
      runFinalArbitration(state);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      state.fullPacketText = composePacketText(state.reportObject);
      state.compactSummary = composeCompactSummary(state.reportObject);

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
        diagnosticTrackRedesignActive: true,
        runtimeMapIntegrityActive: true,
        crossAuthorityContaminationGuardActive: true,
        canvasSurfaceTruthIsSupportingAnchor: true,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_NORTH_REANCHOR_DIAGNOSTIC_TRACK_TOP_LEVEL_ERROR";
      state.calibrationHoldReason = bounded(error && error.message ? error.message : error, 1000);
      state.diagnosticChronologyClean = "false";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.diagnosticTrackHealthLaneStatus = "DIAGNOSTIC_TRACK_HEALTH_LANE_TOP_LEVEL_ERROR";
      state.diagnosticTrackHealthLaneClean = "false";
      state.finalArbitrationStatus = "FINAL_ARBITRATION_TOP_LEVEL_ERROR";
      state.finalArbitrationSource = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.finalArbitrationReason = state.calibrationHoldReason;
      state.zoneOfInflictionOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.zoneOfInflictionFile = FILE;
      state.zoneOfInflictionClass = "NORTH_TOP_LEVEL_ERROR";
      state.zoneOfInflictionReason = state.calibrationHoldReason;
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_NORTH_TOP_LEVEL_ERROR_BEFORE_CHILD_RENEWAL";
      addNote(state, `NORTH_TOP_LEVEL_ERROR:${state.calibrationHoldReason}`);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      state.fullPacketText = composePacketText(state.reportObject);
      state.compactSummary = composeCompactSummary(state.reportObject);

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
        error: state.calibrationHoldReason,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }
  }

  function getReport() {
    return clonePlain(lastReport || buildReportObject(lastState || makeState()));
  }

  function getNorthVerdict() {
    return clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState()));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    const state = lastState || makeState();
    return composePacketText(buildReportObject(state));
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    const state = lastState || makeState();
    return composeCompactSummary(buildReportObject(state));
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceiptLight() {
    const state = lastState || makeState();

    return {
      parentRole: "NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_HUB",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      foundationInternalRenewalContract: FOUNDATION_INTERNAL_RENEWAL_CONTRACT,
      baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      chronologyHubActive: true,
      northIsHubOnly: true,
      northOwnsChronology: true,
      northOwnsChildEvidence: false,
      northOwnsProbeEvidence: false,
      nineStepChronologyActive: true,
      diagnosticTrackRedesignActive: true,
      runtimeMapIntegrityActive: true,
      strictRuntimeEndpointProofRequired: true,
      crossAuthorityContaminationGuardActive: true,
      datasetAdvisoryOnlyActive: true,
      canvasSurfaceTruthIsSupportingAnchor: true,
      canvasSurfaceTruthIsNotFinalArbiterWhenDiagnosticTrackCorrupt: true,
      receiverStillCallsNorthOnly: true,

      diagnosticTrackHealthLaneStatus: state.diagnosticTrackHealthLaneStatus,
      runtimeMapIntegrityLaneStatus: state.runtimeMapIntegrityLaneStatus,
      targetSurfaceFactAnchorLaneStatus: state.targetSurfaceFactAnchorLaneStatus,
      finalArbitrationStatus: state.finalArbitrationStatus,
      finalArbitrationSource: state.finalArbitrationSource,

      zoneOfInflictionOwner: state.zoneOfInflictionOwner,
      zoneOfInflictionFile: state.zoneOfInflictionFile,
      zoneOfInflictionClass: state.zoneOfInflictionClass,
      zoneOfInflictionReason: state.zoneOfInflictionReason,

      crossAuthorityContaminationCount: state.crossAuthorityContaminationCount,
      firstCrossAuthorityContaminationOwner: state.firstCrossAuthorityContaminationOwner,
      firstCrossAuthorityContaminationFile: state.firstCrossAuthorityContaminationFile,
      firstCrossAuthorityContaminationClass: state.firstCrossAuthorityContaminationClass,
      firstCrossAuthorityContaminationReason: state.firstCrossAuthorityContaminationReason,

      canvasSurfaceTruthProbeStatus: state.canvasSurfaceTruthProbeStatus,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasTruthFailureClass: state.canvasTruthFailureClass,
      canvasTruthFailureReason: state.canvasTruthFailureReason,

      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getNorthVerdictApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true,

      diagnosticUiAuthority: false,
      productionMutationPermissionGranted: false,
      hearthRepairPermissionGranted: false,
      runtimeRestartPermissionGranted: false,
      canvasReleasePermissionGranted: false,
      macroWestReleasePermissionGranted: false,
      canvasDrawingAuthority: false,
      routeConductorImplementationAuthority: false,
      controlImplementationAuthority: false,
      terrainTruthAuthority: false,
      hydrologyTruthAuthority: false,
      materialTruthAuthority: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      northContract: CONTRACT,
      northReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,

      railNorthFile: FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,

      chronology: clonePlain((lastState || makeState()).chronology),
      chronologySteps: clonePlain(CHRONOLOGY_STEPS),
      runtimeNodes: clonePlain((lastState || makeState()).runtimeNodes),
      runtimeRelationships: clonePlain((lastState || makeState()).runtimeRelationships),
      runtimeDarkFiles: clonePlain((lastState || makeState()).runtimeDarkFiles),
      runtimeNodeRegistry: clonePlain(RUNTIME_NODES),
      relationshipRegistry: clonePlain(RELATIONSHIPS),
      northVerdict: clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState())),
      reportObject: clonePlain(lastReport || buildReportObject(lastState || makeState())),

      supportsNineStepChronology: true,
      supportsCanvasSurfaceTruthSupportingAnchor: true,
      supportsDiagnosticTrackRedesign: true,
      supportsRuntimeMapIntegrityLane: true,
      supportsStrictRuntimeEndpointProof: true,
      supportsCrossAuthorityContaminationGuard: true,
      supportsDatasetAdvisoryOnly: true,
      supportsNoProductionRepairRecommendationBeforeDiagnosticTrackClean: true,
      supportsExistingDiagnosticRouteIntegration: true,
      supportsNorthOnlyReceiverCall: true,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
    foundationInternalRenewalContract: FOUNDATION_INTERNAL_RENEWAL_CONTRACT,
    baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
    previousNorthContract: PREVIOUS_NORTH_CONTRACT,
    previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    chronologyHubActive: true,
    northIsHubOnly: true,
    northOwnsChronology: true,
    northOwnsChildEvidence: false,
    northOwnsProbeEvidence: false,
    nineStepChronologyActive: true,
    diagnosticTrackRedesignActive: true,
    runtimeMapIntegrityActive: true,
    strictRuntimeEndpointProofRequired: true,
    crossAuthorityContaminationGuardActive: true,
    datasetAdvisoryOnlyActive: true,
    canvasSurfaceTruthIsSupportingAnchor: true,
    canvasSurfaceTruthIsNotFinalArbiterWhenDiagnosticTrackCorrupt: true,
    receiverStillCallsNorthOnly: true,

    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,

    railNorthFile: FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    chronologySteps: CHRONOLOGY_STEPS,
    runtimeNodeRegistry: RUNTIME_NODES,
    relationshipRegistry: RELATIONSHIPS,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
    expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

    runDiagnostic,
    runParallelDiagnostic: runDiagnostic,
    runDiagnosticRail: runDiagnostic,
    runNorthDiagnostic: runDiagnostic,
    runRail: runDiagnostic,

    getReport,
    getNorthVerdict,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getStatus: getReceiptLight,
    getState,

    supportsNineStepChronology: true,
    supportsCanvasSurfaceTruthSupportingAnchor: true,
    supportsDiagnosticTrackRedesign: true,
    supportsRuntimeMapIntegrityLane: true,
    supportsStrictRuntimeEndpointProof: true,
    supportsCrossAuthorityContaminationGuard: true,
    supportsDatasetAdvisoryOnly: true,
    supportsNoProductionRepairRecommendationBeforeDiagnosticTrackClean: true,
    supportsExistingDiagnosticRouteIntegration: true,
    supportsNorthOnlyReceiverCall: true,

    diagnosticUiAuthority: false,
    productionMutationPermissionGranted: false,
    hearthRepairPermissionGranted: false,
    runtimeRestartPermissionGranted: false,
    canvasReleasePermissionGranted: false,
    macroWestReleasePermissionGranted: false,
    canvasDrawingAuthority: false,
    routeConductorImplementationAuthority: false,
    controlImplementationAuthority: false,
    terrainTruthAuthority: false,
    hydrologyTruthAuthority: false,
    materialTruthAuthority: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get report() {
      return getReport();
    },

    get verdict() {
      return getNorthVerdict();
    },

    get packetText() {
      return getPacketText();
    },

    get compactSummary() {
      return getCompactSummary();
    }
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
