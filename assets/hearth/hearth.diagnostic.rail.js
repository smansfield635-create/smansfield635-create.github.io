// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_RAIL_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_TNT_v11_3
// Full-file replacement.
// Diagnostic rail NORTH parent only.
//
// Purpose:
// - Preserve public NORTH v11 contract and receipt expected by diagnostic route.
// - Preserve diagnostic receiver behavior: receiver still calls NORTH only.
// - Preserve v11_2 route/canvas permission-gate pair audit.
// - Add full construct-level delegatory handshake / intended-handoff variance matrix.
// - Prevent one confirmed handshake from being treated as whole-chain permission.
// - Report each file relationship independently as permission granted, not granted, pending, or unobserved.
// - Distinguish handshake from handoff without forcing every edge to be bidirectional.
// - Preserve Controls as Queen motion/input authority.
// - Preserve Route Conductor / neighboring Showroom Bishop as upstream permission and active scan authority.
// - Preserve Canvas as presentation/output receiver, DOM surface owner, and bridge to downstream surface expression.
// - Preserve Hex Surface as downstream gate before Pointer Finger.
// - Preserve Pointer Finger as downstream expression/finger inspection authority.
// - Preserve source truth outside Canvas.
// - Preserve diagnostic-only authority: no production mutation, no repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
//
// Does not own:
// - diagnostic UI shell
// - production route repair
// - Hearth runtime restart
// - Route Conductor implementation
// - Controls implementation
// - Canvas drawing
// - Hex rendering
// - Pointer Finger implementation
// - terrain / hydrology / material / elevation truth
// - final visual pass
// - F21 latch

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
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_TNT_v11_3";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_RECEIPT_v11_3";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_ANCHOR_TNT_v11_2";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_ANCHOR_RECEIPT_v11_2";

  const LINEAGE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_SCRIPT_PRESENT_AUTHORITY_RECOVERY_AND_F21_FAILURE_TAXONOMY_TNT_v11_1";
  const LINEAGE_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_SCRIPT_PRESENT_AUTHORITY_RECOVERY_AND_F21_FAILURE_TAXONOMY_RECEIPT_v11_1";

  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const VERSION =
    "2026-06-07.hearth-diagnostic-rail-north-delegatory-handshake-handoff-variance-matrix-v11-3";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

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
  const EXPECTED_ROUTE_CONDUCTOR_RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_POINTER_FINGER_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT";

  const EXPECTED_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EXPECTED_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";
  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";

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
    webgl: false
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
    WEBGL: false
  });

  const CHRONOLOGY_STEPS = Object.freeze([
    {
      id: "NORTH_RAIL",
      order: 1,
      fibonacciStage: "F1",
      role: "north-delegatory-handshake-handoff-variance-hub",
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
        "HEARTH.diagnosticNorthDelegatoryHandshakeMatrix",
        "HEARTH_DIAGNOSTIC_RAIL",
        "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
        "HEARTH_DIAGNOSTIC_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_NORTH",
        "HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
        "HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB",
        "HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX",
        "DEXTER_LAB.hearthDiagnosticRail",
        "DEXTER_LAB.hearthDiagnosticNorth",
        "DEXTER_LAB.hearthDiagnosticNorthChronologyHub",
        "DEXTER_LAB.hearthDiagnosticNorthCanvasSurfaceTruthChronologyHub",
        "DEXTER_LAB.hearthDiagnosticNorthDelegatoryHandshakeMatrix"
      ],
      methods: []
    },
    {
      id: "PROBE_NORTH",
      order: 2,
      fibonacciStage: "F2",
      role: "file-composition-zone-coordinator",
      file: PROBE_NORTH_FILE,
      expectedContract: EXPECTED_PROBE_NORTH_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_NORTH",
      paths: [
        "HEARTH.diagnosticProbeNorth",
        "HEARTH.diagnosticRailProbeNorth",
        "HEARTH.diagnosticNorthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH",
        "DEXTER_LAB.hearthDiagnosticProbeNorth",
        "DEXTER_LAB.hearthDiagnosticRailProbeNorth"
      ],
      methods: [
        "runProbeNorth",
        "inspectFileComposition",
        "composeFileComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "RAIL_EAST",
      order: 3,
      fibonacciStage: "F3",
      role: "served-source-evidence",
      file: RAIL_EAST_FILE,
      expectedContract: EXPECTED_EAST_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_EAST",
      paths: [
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST",
        "DEXTER_LAB.hearthDiagnosticEast",
        "DEXTER_LAB.hearthDiagnosticRailEast"
      ],
      methods: [
        "runEastSourceRead",
        "readServedSource",
        "runEast",
        "inspectSource",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "PROBE_EAST",
      order: 4,
      fibonacciStage: "F5",
      role: "served-source-file-composition-probe",
      file: PROBE_EAST_FILE,
      expectedContract: EXPECTED_PROBE_EAST_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_EAST",
      paths: [
        "HEARTH.diagnosticProbeEast",
        "HEARTH.diagnosticEastProbe",
        "HEARTH.diagnosticProbeEastServedSourceFileComposition",
        "HEARTH_DIAGNOSTIC_PROBE_EAST",
        "HEARTH_DIAGNOSTIC_EAST_PROBE",
        "DEXTER_LAB.hearthDiagnosticProbeEast",
        "DEXTER_LAB.hearthDiagnosticEastProbe"
      ],
      methods: [
        "runProbeEast",
        "inspectServedSourceComposition",
        "inspectSourceComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "RAIL_WEST",
      order: 5,
      fibonacciStage: "F8",
      role: "rendered-target-evidence",
      file: RAIL_WEST_FILE,
      expectedContract: EXPECTED_WEST_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_WEST",
      paths: [
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST",
        "DEXTER_LAB.hearthDiagnosticWest",
        "DEXTER_LAB.hearthDiagnosticRailWest"
      ],
      methods: [
        "runWestRenderedRead",
        "readRenderedTarget",
        "runWest",
        "inspectRenderedTarget",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "PROBE_WEST",
      order: 6,
      fibonacciStage: "F13",
      role: "rendered-target-file-composition-probe",
      file: PROBE_WEST_FILE,
      expectedContract: EXPECTED_PROBE_WEST_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_WEST",
      paths: [
        "HEARTH.diagnosticProbeWest",
        "HEARTH.diagnosticRailProbeWest",
        "HEARTH.diagnosticWestProbe",
        "HEARTH_DIAGNOSTIC_PROBE_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_WEST",
        "DEXTER_LAB.hearthDiagnosticProbeWest",
        "DEXTER_LAB.hearthDiagnosticRailProbeWest"
      ],
      methods: [
        "runProbeWest",
        "inspectRenderedTargetComposition",
        "inspectRenderedComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "PROBE_CANVAS_SURFACE_TRUTH",
      order: 7,
      fibonacciStage: "F21",
      role: "canvas-surface-truth-probe",
      file: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      expectedContract: EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      paths: [
        "HEARTH.diagnosticProbeCanvasSurfaceTruth",
        "HEARTH.diagnosticCanvasSurfaceTruthProbe",
        "HEARTH.diagnosticProbeCanvasTruth",
        "HEARTH.diagnosticCanvasTruthProbe",
        "HEARTH.diagnosticRailProbeCanvasSurfaceTruth",
        "HEARTH.diagnosticCanvasSurfaceTruthReceiptHub",
        "HEARTH.diagnosticTruthHub",
        "HEARTH.canvasSurfaceTruthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB",
        "HEARTH_DIAGNOSTIC_TRUTH_HUB",
        "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
        "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
        "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
        "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
        "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthReceiptHub",
        "DEXTER_LAB.hearthDiagnosticTruthHub",
        "DEXTER_LAB.hearthCanvasSurfaceTruthProbe"
      ],
      methods: [
        "runProbeCanvasSurfaceTruth",
        "runCanvasSurfaceTruth",
        "inspectCanvasSurfaceTruth",
        "inspectCanvasSurface",
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
      expectedContract: EXPECTED_SOUTH_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_SOUTH",
      paths: [
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "DEXTER_LAB.hearthDiagnosticSouth",
        "DEXTER_LAB.hearthDiagnosticRailSouth"
      ],
      methods: [
        "composeSouthReport",
        "runSouth",
        "composeReport",
        "inspect",
        "runDiagnostic"
      ]
    },
    {
      id: "PROBE_SOUTH",
      order: 9,
      fibonacciStage: "F55",
      role: "packet-meaning-file-composition-probe",
      file: PROBE_SOUTH_FILE,
      expectedContract: EXPECTED_PROBE_SOUTH_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_SOUTH",
      paths: [
        "HEARTH.diagnosticProbeSouth",
        "HEARTH.diagnosticRailProbeSouth",
        "HEARTH.diagnosticSouthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
        "DEXTER_LAB.hearthDiagnosticProbeSouth",
        "DEXTER_LAB.hearthDiagnosticRailProbeSouth"
      ],
      methods: [
        "runProbeSouth",
        "inspectPacketMeaning",
        "inspectPacketComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    }
  ]);

  const NODE_REGISTRY = Object.freeze([
    {
      id: "ROUTE_CONDUCTOR",
      file: ROUTE_CONDUCTOR_FILE,
      role: "north-bishop-route-permission-and-active-scan-authority",
      expectedContracts: [
        EXPECTED_ROUTE_CONDUCTOR_RENEWAL_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
        "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
        "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
        "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
        "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
      ],
      family: "HEARTH_ROUTE_CONDUCTOR",
      aliases: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
        "HEARTH_ROUTE_NORTH_BISHOP",
        "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
        "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF",
        "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
        "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
        "HEARTH.routeConductor",
        "HEARTH.routeConductorPrimaryGate",
        "HEARTH.routeNorthBishop",
        "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
        "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
        "HEARTH.routeConductorHexGatePointerFingerTransmission",
        "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
        "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorPrimaryGate",
        "DEXTER_LAB.hearthRouteNorthBishop",
        "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
        "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
        "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
        "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
      ]
    },
    {
      id: "CONTROLS_QUEEN",
      file: CONTROL_FILE,
      role: "queen-motion-input-and-gateway-permission-authority",
      expectedContracts: [
        EXPECTED_CONTROL_CONTRACT,
        EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
        "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1"
      ],
      family: "HEARTH_CONTROLS",
      aliases: [
        "HEARTH_CONTROLS",
        "HEARTH_PLANETARY_CONTROLS",
        "HEARTH_CONTROL_FILE",
        "HEARTH_CONTROL_AUTHORITY",
        "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH_QUEEN_CONTROLS",
        "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
        "HEARTH.controls",
        "HEARTH.planetaryControls",
        "HEARTH.controlFile",
        "HEARTH.controlAuthority",
        "HEARTH.controlsPlanetaryViewInputHandshake",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.controlsHexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthControls",
        "DEXTER_LAB.hearthPlanetaryControls",
        "DEXTER_LAB.hearthControlFile",
        "DEXTER_LAB.hearthControlAuthority",
        "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
        "DEXTER_LAB.hearthQueenControls",
        "DEXTER_LAB.hearthControlsHexGatePointerFingerTransmission"
      ]
    },
    {
      id: "CANVAS_RECEIVER",
      file: CANVAS_FILE,
      role: "presentation-surface-output-carrier-and-downstream-bridge",
      expectedContracts: [
        EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        EXPECTED_CANVAS_CONTRACT,
        "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
        "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
        "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
        "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
        "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
        "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
        "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7"
      ],
      family: "HEARTH_CANVAS",
      aliases: [
        "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
        "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
        "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_AUTHORITY",
        "HEARTH_CANVAS_LOCAL_STATION",
        "HEARTH_CANVAS_STATION",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH_CANVAS_VISIBLE_PLANET",
        "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHubRafSphereRotationPairReceiver",
        "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
        "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
        "HEARTH.canvasPlanetaryViewControlReceiver",
        "HEARTH.canvasHub",
        "HEARTH.canvas",
        "HEARTH.canvasParent",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasLocalStation",
        "HEARTH.canvasStation",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasVisiblePlanet",
        "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
        "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
        "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
        "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
        "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
        "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasLocalStation",
        "DEXTER_LAB.hearthCanvasStation",
        "DEXTER_LAB.hearthCanvasExpressionHub",
        "DEXTER_LAB.hearthCanvasVisiblePlanet"
      ]
    },
    {
      id: "HEX_SURFACE_GATE",
      file: HEX_SURFACE_FILE,
      role: "hex-surface-render-gate-before-pointer-finger",
      expectedContracts: [
        EXPECTED_HEX_SURFACE_CONTRACT,
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5"
      ],
      family: "HEARTH_HEX_SURFACE",
      aliases: [
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
        "HEARTH_HEX_SURFACE_RENDERER",
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_GATE",
        "HEARTH_HEX_RENDER_GATE",
        "HEARTH.hexSurfacePairPointerFingerGate",
        "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
        "HEARTH.hexSurfaceRenderer",
        "HEARTH.hexSurface",
        "HEARTH.hexGate",
        "HEARTH.hexRenderGate",
        "DEXTER_LAB.hearthHexSurfacePairPointerFingerGate",
        "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
        "DEXTER_LAB.hearthHexSurfaceRenderer",
        "DEXTER_LAB.hearthHexSurface",
        "DEXTER_LAB.hearthHexGate"
      ]
    },
    {
      id: "HEX_AUTHORITY",
      file: HEX_AUTHORITY_FILE,
      role: "hex-pair-authority",
      expectedContracts: [EXPECTED_HEX_AUTHORITY_CONTRACT],
      family: "HEARTH_HEX_FOUR_PAIR",
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexPixelHandshakeAuthority",
        "HEARTH.hexAuthority",
        "HEARTH.hexFourPairAuthority",
        "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexAuthority"
      ]
    },
    {
      id: "POINTER_FINGER",
      file: POINTER_FINGER_FILE,
      role: "downstream-pointer-finger-expression",
      expectedContracts: [EXPECTED_POINTER_FINGER_CONTRACT],
      family: "HEARTH_CANVAS_FINGER",
      aliases: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_POINTER_FINGER",
        "HEARTH_POINTER_FINGER",
        "HEARTH_CANVAS_FINGER_POINTER",
        "HEARTH_CANVAS_FINGER_LIGHT",
        "HEARTH_CANVAS_FINGER_BOUNDARY",
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH.pointerFinger",
        "HEARTH.canvasPointerFinger",
        "HEARTH.canvasFingerInspect",
        "HEARTH.canvasFingerPointer",
        "HEARTH.canvasFingerLight",
        "HEARTH.canvasFingerBoundary",
        "HEARTH.canvasFingerSurface",
        "DEXTER_LAB.hearthPointerFinger",
        "DEXTER_LAB.hearthCanvasPointerFinger",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthCanvasFingerPointer",
        "DEXTER_LAB.hearthCanvasFingerLight",
        "DEXTER_LAB.hearthCanvasFingerBoundary",
        "DEXTER_LAB.hearthCanvasFingerSurface"
      ]
    }
  ]);

  const RELATIONSHIP_REGISTRY = Object.freeze([
    {
      id: "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
      from: "ROUTE_CONDUCTOR",
      to: "CONTROLS_QUEEN",
      intendedMode: "HANDSHAKE",
      requiredForMotion: true,
      requiredForVisibleSurface: false,
      requestSignals: [
        "controlHandshakePacket",
        "queenControlHandshakePacket",
        "routeConductorControlHandshakePacket",
        "controlHandshakeAuthorized",
        "controlsHandshakeAuthorized",
        "queenHandshakeAuthorized",
        "controlAdmissionAuthorized",
        "controlsAdmissionAuthorized",
        "planetaryControlAdmissionAuthorized"
      ],
      grantSignals: [
        "handshakeAccepted",
        "controlHandshakeAccepted",
        "controlHandshakeAcceptedByQueen",
        "inputAdmissionOpen",
        "inputBound",
        "CONTROL_HANDSHAKE_STATUS",
        "HANDSHAKE_VALID"
      ],
      returnSignals: [
        "routeConductorControlIntegrationStatus",
        "controlHandshakeAcceptedByQueen",
        "controlHandshakeReceipt",
        "controlsHandshakeReceipt",
        "getControlHandshakeReceipt",
        "getControlHandshakeSummary"
      ],
      expectedReturnPort: true
    },
    {
      id: "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE",
      from: "ROUTE_CONDUCTOR",
      to: "CANVAS_RECEIVER",
      intendedMode: "HANDSHAKE",
      requiredForMotion: false,
      requiredForVisibleSurface: true,
      requestSignals: [
        "governedSourcePacket",
        "governedSourcePacketPublished",
        "canvasHandoffPacket",
        "canvasReleasePacket",
        "canvasGovernedSourceHandoffPacket",
        "canvasReleaseAuthorized",
        "canvasMayRenderGovernedSource"
      ],
      grantSignals: [
        "governedSourcePacketAcceptedByCanvas",
        "canvasReleaseAccepted",
        "canvasGovernedSourceAccepted",
        "sourceAccepted",
        "governedSourceAccepted",
        "receiveGovernedSourceStackPacket",
        "consumeGovernedSourceStackPacket",
        "acceptGovernedSourceStackPacket"
      ],
      returnSignals: [
        "canvasGovernedSourceDeliveryStatus",
        "canvasGovernedSourceReceiverMethod",
        "sourceAccepted",
        "governedSourceAccepted",
        "getCanvasStationReceipt",
        "getVisiblePlanetReceipt"
      ],
      expectedReturnPort: true
    },
    {
      id: "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
      from: "CONTROLS_QUEEN",
      to: "CANVAS_RECEIVER",
      intendedMode: "HANDSHAKE",
      requiredForMotion: true,
      requiredForVisibleSurface: false,
      requestSignals: [
        "controlsViewPacket",
        "planetaryViewControlPacket",
        "queenHexGateViewPacket",
        "receiveViewControlPacket",
        "consumeViewControlPacket",
        "receivePlanetaryViewControlPacket",
        "consumePlanetaryViewControlPacket",
        "canvasDeliveryStatus",
        "canvasDeliveryMethod"
      ],
      grantSignals: [
        "canvasDeliveryStatus",
        "CONTROL_PACKET_DELIVERED_TO_CANVAS_PUBLIC_RECEIVER_FOR_HEX_GATE",
        "receiveViewControlPacket",
        "consumeViewControlPacket",
        "receivePlanetaryViewControlPacket",
        "consumePlanetaryViewControlPacket"
      ],
      returnSignals: [
        "canvasDeliveryStatus",
        "canvasDeliveryMethod",
        "canvasReceiverCacheMethod",
        "getControlHandshakeReceipt",
        "getControlSummary",
        "getCanvasStationReceipt"
      ],
      expectedReturnPort: true
    },
    {
      id: "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
      from: "CANVAS_RECEIVER",
      to: "HEX_SURFACE_GATE",
      intendedMode: "HANDSHAKE_OR_INTENDED_HANDOFF",
      requiredForMotion: true,
      requiredForVisibleSurface: true,
      requestSignals: [
        "hexGateTransmissionPacket",
        "hexGateTransmissionDelivered",
        "hexGateRequiredBeforePointerFinger",
        "canvasMayForwardToHexGate",
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket",
        "hexSurfaceFile",
        "HEX_SURFACE"
      ],
      grantSignals: [
        "hexGateTransmissionAccepted",
        "gateReady",
        "surfaceReady",
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket",
        "receiveViewControlPacket",
        "consumeViewControlPacket"
      ],
      returnSignals: [
        "hexGateTransmissionAccepted",
        "hexGateTransmissionDelivered",
        "getHexSurfaceReceipt",
        "getHexSurfaceSummary",
        "hexSurfaceReceipt"
      ],
      expectedReturnPort: false
    },
    {
      id: "HEX_SURFACE_TO_POINTER_FINGER_HANDOFF",
      from: "HEX_SURFACE_GATE",
      to: "POINTER_FINGER",
      intendedMode: "HANDOFF",
      requiredForMotion: false,
      requiredForVisibleSurface: false,
      requestSignals: [
        "pointerFingerTransmissionPacket",
        "pointerFingerAdmissionAuthorized",
        "hexGateRequiredBeforePointerFinger",
        "receiveHexGatePointerFingerTransmissionPacket",
        "consumeHexGatePointerFingerTransmissionPacket"
      ],
      grantSignals: [
        "pointerFingerObserved",
        "pointerFingerVocabulary",
        "receivePointerFingerTransmissionPacket",
        "consumePointerFingerTransmissionPacket",
        "acceptPointerFingerTransmissionPacket"
      ],
      returnSignals: [
        "pointerFingerAdmissionDelivered",
        "pointerFingerAdmissionAccepted",
        "getPointerFingerReceipt",
        "getFingerReceipt"
      ],
      expectedReturnPort: false
    },
    {
      id: "ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION",
      from: "ROUTE_CONDUCTOR",
      to: "HEX_SURFACE_GATE",
      intendedMode: "HANDSHAKE_OR_INTENDED_HANDOFF",
      requiredForMotion: false,
      requiredForVisibleSurface: false,
      requestSignals: [
        "hexGateTransmissionPacket",
        "hexSurfaceObserved",
        "hexGateRequiredBeforePointerFinger",
        "routeConductorBypassesHexGate",
        "receiveRouteConductorHexGateTransmissionPacket"
      ],
      grantSignals: [
        "hexSurfaceObserved",
        "hexSurfaceGateReady",
        "receiveRouteConductorHexGateTransmissionPacket",
        "consumeRouteConductorHexGateTransmissionPacket"
      ],
      returnSignals: [
        "hexGateTransmissionDelivered",
        "hexGateTransmissionAccepted",
        "getHexSurfaceReceipt",
        "getHexSurfaceSummary"
      ],
      expectedReturnPort: false
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
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function packetValue(value, fallback = "UNKNOWN", limit = 20000) {
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

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
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

  function readPath(base, path) {
    const parts = safeString(path).split(".");
    let cursor = base || root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function findFirstPath(paths, bases) {
    const contexts = Array.isArray(bases) && bases.length ? bases : [{ label: "DIAGNOSTIC", root }];

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

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const key = parts[index];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
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
      return url.pathname === path;
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
        cacheKey: "NONE"
      };
    }

    const scripts = Array.from(targetDocument.querySelectorAll("script[src]")).filter((script) => {
      return scriptMatchesPath(script, path);
    });

    const last = scripts[scripts.length - 1] || null;
    const rawSrc = last && last.getAttribute ? last.getAttribute("src") : "";

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
        "NONE";
    } catch (_error) {}

    return {
      present: scripts.length > 0,
      count: scripts.length,
      src: rawSrc || "NOT_FOUND",
      cacheKey
    };
  }

  function appendScript(path, stepId, mode) {
    if (!doc) {
      return Promise.resolve({
        attempted: false,
        loaded: false,
        status: "DOCUMENT_UNAVAILABLE",
        path,
        src: "DOCUMENT_UNAVAILABLE"
      });
    }

    const key = `${path}::${mode}`;

    if (loadPromises[key]) return loadPromises[key];

    loadPromises[key] = new Promise((resolve) => {
      try {
        const script = doc.createElement("script");
        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        script.id = `hearth-diagnostic-north-${stepId.toLowerCase()}-${mode.toLowerCase()}-${stamp}`;
        script.src =
          `${path}?v=${encodeURIComponent(INTERNAL_RENEWAL_CONTRACT)}` +
          `&northRecovery=${encodeURIComponent(mode)}` +
          `&t=${encodeURIComponent(stamp)}`;
        script.async = false;
        script.defer = false;

        script.dataset.loadedBy = CONTRACT;
        script.dataset.internalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
        script.dataset.previousInternalRenewalContract = PREVIOUS_INTERNAL_RENEWAL_CONTRACT;
        script.dataset.diagnosticNorthChronologyHub = "true";
        script.dataset.diagnosticScriptRecoveryMode = mode;
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
            status: `${mode}_SCRIPT_LOAD_COMPLETE`,
            path,
            src: script.src
          });
        }, { once: true });

        script.addEventListener("error", () => {
          resolve({
            attempted: true,
            loaded: false,
            status: `${mode}_SCRIPT_LOAD_ERROR_OR_NOT_DEPLOYED`,
            path,
            src: script.src
          });
        }, { once: true });

        (doc.head || doc.documentElement || doc.body).appendChild(script);
      } catch (error) {
        resolve({
          attempted: true,
          loaded: false,
          status: `${mode}_SCRIPT_LOAD_EXCEPTION:${bounded(error && error.message ? error.message : error, 1000)}`,
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
    let source = "DIRECT_OPTIONS_OR_NONE";
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

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getNorthVerdict",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlHandshakeSummary",
      "getControlSummary",
      "getQueenBridgeState",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getPointerFingerReceipt",
      "getFingerReceipt",
      "getProbeEastReceipt",
      "getProbeWestReceipt",
      "getProbeSouthReceipt",
      "getCanvasSurfaceTruthReceipt",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt"
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
    if (isObject(authority.controlReceipt)) return authority.controlReceipt;
    if (isObject(authority.canvasStationReceipt)) return authority.canvasStationReceipt;
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
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

  function contractOf(receipt, authority, datasetValues = []) {
    return firstKnown(
      readField(receipt, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexSurfaceContract",
        "pointerFingerContract",
        "fingerContract",
        "routeConductorContract",
        "currentRouteConductorContract",
        "servedRouteConductorContract",
        "contract",
        "CONTRACT",
        "sourceContract",
        "internalImplementationContract",
        "INTERNAL_IMPLEMENTATION_CONTRACT"
      ], ""),
      authority && authority.contract,
      authority && authority.CONTRACT,
      ...datasetValues
    );
  }

  function receiptOf(receipt, authority, datasetValues = []) {
    return firstKnown(
      readField(receipt, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexSurfaceReceipt",
        "pointerFingerReceipt",
        "fingerReceipt",
        "routeConductorReceipt",
        "currentRouteConductorReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt",
        "internalImplementationReceipt",
        "INTERNAL_IMPLEMENTATION_RECEIPT"
      ], ""),
      authority && authority.receipt,
      authority && authority.RECEIPT,
      ...datasetValues
    );
  }

  function publicMethodNames(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 120);
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

  function readNode(node, targetContext) {
    const ds = getDataset(targetContext.targetDocument);
    const found = findFirstPath(node.aliases || [], targetContext.bases);
    const receipt = getReceiptFromAuthority(found.value) || {};
    const script = scriptInfo(node.file, targetContext.targetDocument || doc);

    const datasetCandidates = [
      ds.hearthRouteConductorContract,
      ds.hearthRouteConductorRenewalContract,
      ds.hearthRouteConductorCurrent,
      ds.hearthControlsContract,
      ds.hearthControlsInternalImplementationContract,
      ds.hearthCanvasContract,
      ds.hearthCanvasCurrentParentContract,
      ds.hearthHexSurfaceContract,
      ds.hearthHexAuthorityContract,
      ds.hearthPointerFingerContract,
      ds.hearthCanvasFingerInspectContract
    ];

    const contract = contractOf(receipt, found.value, datasetCandidates);
    const receiptName = receiptOf(receipt, found.value, [
      ds.hearthRouteConductorReceipt,
      ds.hearthControlsReceipt,
      ds.hearthCanvasReceipt,
      ds.hearthHexSurfaceReceipt,
      ds.hearthHexAuthorityReceipt,
      ds.hearthPointerFingerReceipt,
      ds.hearthCanvasFingerInspectReceipt
    ]);

    const methods = publicMethodNames(found.value);
    const observed = Boolean(found.value || contract !== "UNKNOWN" || script.present);

    return {
      id: node.id,
      role: node.role,
      file: node.file,
      family: node.family,
      expectedContracts: (node.expectedContracts || []).slice(),
      observed,
      selectedAliasPath: found.path,
      selectedAliasFullPath: found.fullPath,
      contextLabel: found.contextLabel,
      scriptPresent: script.present,
      scriptCount: script.count,
      scriptSrc: script.src,
      scriptCacheKey: script.cacheKey,
      contract,
      receipt: receiptName,
      contractRecognized: contractRecognized(contract, node),
      publicMethodCount: methods.length,
      publicMethods: methods,
      receiptObject: clonePlain(receipt),
      authorityText: buildAuthoritySignalText(found.value, receipt, ds),
      ...NO_CLAIMS
    };
  }

  function buildAuthoritySignalText(authority, receipt, ds) {
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
        "controlHandshakePacket",
        "queenControlHandshakePacket",
        "governedSourcePacket",
        "canvasHandoffPacket",
        "hexGateTransmissionPacket",
        "pointerFingerTransmissionPacket"
      ]) {
        try {
          if (authority[key] !== undefined) pieces.push(`${key}:${packetValue(authority[key], "", 2000)}`);
        } catch (_error) {}
      }
    }

    try {
      pieces.push(JSON.stringify(ds || {}));
    } catch (_error) {}

    return pieces.join(" | ").slice(0, 60000);
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

  function evaluateRelationship(relationship, nodesById) {
    const fromNode = nodesById[relationship.from] || null;
    const toNode = nodesById[relationship.to] || null;

    const fromObserved = Boolean(fromNode && fromNode.observed);
    const toObserved = Boolean(toNode && toNode.observed);

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

    const endpointPermissionGranted = fromObserved && toObserved;
    const requestPermissionGranted = endpointPermissionGranted && requestObserved;
    const receiverPermissionGranted = endpointPermissionGranted && grantObserved;
    const returnPortPermissionGranted =
      relationship.expectedReturnPort === true
        ? endpointPermissionGranted && requestObserved && grantObserved && returnObserved
        : endpointPermissionGranted && (returnObserved || grantObserved || requestObserved);

    let relationshipStatus = "RELATIONSHIP_PERMISSION_PENDING";
    let varianceClass = "PERMISSION_PENDING";
    let permissionGranted = false;

    if (!fromObserved || !toObserved) {
      relationshipStatus = "RELATIONSHIP_ENDPOINT_UNOBSERVED";
      varianceClass = !fromObserved && !toObserved
        ? "BOTH_ENDPOINTS_UNOBSERVED"
        : !fromObserved
          ? "SOURCE_ENDPOINT_UNOBSERVED"
          : "TARGET_ENDPOINT_UNOBSERVED";
    } else if (relationship.intendedMode === "HANDSHAKE") {
      if (requestObserved && grantObserved && returnObserved) {
        relationshipStatus = "HANDSHAKE_PERMISSION_CONFIRMED_WITH_RETURN_PORT";
        varianceClass = "HANDSHAKE_COMPLETE";
        permissionGranted = true;
      } else if (requestObserved && grantObserved && !returnObserved) {
        relationshipStatus = "HANDSHAKE_PERMISSION_FRONTPORT_CONFIRMED_RETURN_PORT_PENDING";
        varianceClass = "HANDSHAKE_FRONTPORT_ONLY";
        permissionGranted = false;
      } else if (requestObserved && !grantObserved) {
        relationshipStatus = "HANDSHAKE_REQUEST_OBSERVED_PERMISSION_NOT_GRANTED";
        varianceClass = "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED";
      } else {
        relationshipStatus = "HANDSHAKE_PERMISSION_NOT_GRANTED_YET";
        varianceClass = "REQUEST_AND_GRANT_NOT_CONFIRMED";
      }
    } else if (relationship.intendedMode === "HANDOFF") {
      if (requestObserved || grantObserved) {
        relationshipStatus = "INTENDED_HANDOFF_PERMISSION_CONFIRMED";
        varianceClass = "INTENDED_ONE_WAY_HANDOFF_CONFIRMED";
        permissionGranted = true;
      } else {
        relationshipStatus = "INTENDED_HANDOFF_PERMISSION_NOT_GRANTED_YET";
        varianceClass = "HANDOFF_INTENT_NOT_CONFIRMED";
      }
    } else {
      if (requestObserved && grantObserved && returnObserved) {
        relationshipStatus = "HYBRID_RELATIONSHIP_CONFIRMED_AS_HANDSHAKE";
        varianceClass = "HYBRID_CONFIRMED_HANDSHAKE";
        permissionGranted = true;
      } else if (requestObserved && grantObserved) {
        relationshipStatus = "HYBRID_RELATIONSHIP_CONFIRMED_AS_INTENDED_HANDOFF";
        varianceClass = "HYBRID_CONFIRMED_HANDOFF";
        permissionGranted = true;
      } else if (requestObserved) {
        relationshipStatus = "HYBRID_RELATIONSHIP_REQUEST_OBSERVED_PERMISSION_PENDING";
        varianceClass = "HYBRID_REQUEST_ONLY";
      } else {
        relationshipStatus = "HYBRID_RELATIONSHIP_PERMISSION_NOT_GRANTED_YET";
        varianceClass = "HYBRID_UNCONFIRMED";
      }
    }

    return {
      id: relationship.id,
      from: relationship.from,
      to: relationship.to,
      fromFile: fromNode ? fromNode.file : "UNKNOWN",
      toFile: toNode ? toNode.file : "UNKNOWN",
      intendedMode: relationship.intendedMode,
      expectedReturnPort: relationship.expectedReturnPort === true,
      requiredForMotion: relationship.requiredForMotion === true,
      requiredForVisibleSurface: relationship.requiredForVisibleSurface === true,
      fromObserved,
      toObserved,
      fromContract: fromNode ? fromNode.contract : "UNKNOWN",
      toContract: toNode ? toNode.contract : "UNKNOWN",
      fromContractRecognized: fromNode ? fromNode.contractRecognized : false,
      toContractRecognized: toNode ? toNode.contractRecognized : false,
      requestObserved,
      grantObserved,
      returnObserved,
      endpointPermissionGranted,
      requestPermissionGranted,
      receiverPermissionGranted,
      returnPortPermissionGranted,
      relationshipPermissionGranted: permissionGranted,
      relationshipStatus,
      varianceClass,
      fromAlias: fromNode ? fromNode.selectedAliasFullPath : "NONE",
      toAlias: toNode ? toNode.selectedAliasFullPath : "NONE",
      ...NO_CLAIMS
    };
  }

  function runDelegatoryAudit(state, targetContext) {
    const nodes = NODE_REGISTRY.map((node) => readNode(node, targetContext));
    const nodesById = {};
    nodes.forEach((node) => { nodesById[node.id] = node; });

    const relationships = RELATIONSHIP_REGISTRY.map((relationship) => {
      return evaluateRelationship(relationship, nodesById);
    });

    const firstNotGranted = relationships.find((entry) => entry.relationshipPermissionGranted !== true) || null;
    const handshakeFrontOnly = relationships.filter((entry) => entry.varianceClass === "HANDSHAKE_FRONTPORT_ONLY");
    const missingEndpoints = relationships.filter((entry) => entry.varianceClass.includes("ENDPOINT_UNOBSERVED"));
    const complete = relationships.filter((entry) => entry.relationshipPermissionGranted === true);

    const motionRequired = relationships.filter((entry) => entry.requiredForMotion);
    const visibleRequired = relationships.filter((entry) => entry.requiredForVisibleSurface);

    const motionGranted = motionRequired.every((entry) => entry.relationshipPermissionGranted === true);
    const visibleGranted = visibleRequired.every((entry) => entry.relationshipPermissionGranted === true);

    let status = "DELEGATORY_PERMISSION_MATRIX_COMPLETE";
    let nextOwner = "TEACHER_REVIEW";
    let nextFile = CANVAS_FILE;
    let nextAction = "REVIEW_COMPLETED_DELEGATORY_MATRIX_WITHOUT_FINAL_VISUAL_PASS_CLAIM";

    if (firstNotGranted) {
      status = "DELEGATORY_PERMISSION_MATRIX_PARTIAL";
      nextOwner = firstNotGranted.fromObserved ? firstNotGranted.to : firstNotGranted.from;
      nextFile = firstNotGranted.fromObserved ? firstNotGranted.toFile : firstNotGranted.fromFile;
      nextAction =
        firstNotGranted.varianceClass === "HANDSHAKE_FRONTPORT_ONLY"
          ? "ADD_OR_CONFIRM_RETURN_PORT_RECEIPT_FOR_THIS_HANDSHAKE"
          : firstNotGranted.varianceClass.includes("ENDPOINT_UNOBSERVED")
            ? "CONFIRM_PUBLIC_AUTHORITY_PUBLICATION_FOR_UNOBSERVED_ENDPOINT"
            : "CONFIRM_RELATIONSHIP_PERMISSION_REQUEST_AND_GRANT_SIGNALS";
    }

    const canvasNode = nodesById.CANVAS_RECEIVER || {};
    const routeNode = nodesById.ROUTE_CONDUCTOR || {};
    const controlsNode = nodesById.CONTROLS_QUEEN || {};
    const hexSurfaceNode = nodesById.HEX_SURFACE_GATE || {};

    const routeCanvasPair = relationships.find((entry) => entry.id === "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE") || {};
    const controlCanvasPair = relationships.find((entry) => entry.id === "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE") || {};
    const canvasHexPair = relationships.find((entry) => entry.id === "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE") || {};

    const threeFileStrategy = {
      strategyName: "ROUTE_CONTROLS_CANVAS_HEX_SURFACE_DELEGATORY_PERMISSION_STRATEGY_v11_3",
      routeConductorActiveScanAuthority: true,
      controlsRemainMotionAndInputGatewayAuthority: true,
      canvasRemainsPresentationSurfaceAndBridgeAuthority: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      pointerFingerRemainsDownstreamExpressionAuthority: true,
      canvasDoesNotOwnSourceTruth: true,
      controlsDoNotOwnCanvasDrawing: true,
      routeDoesNotOwnCanvasDrawing: true,
      routeCanvasPairPermissionGranted: routeCanvasPair.relationshipPermissionGranted === true,
      controlsCanvasMotionPermissionGranted: controlCanvasPair.relationshipPermissionGranted === true,
      canvasHexSurfacePermissionGranted: canvasHexPair.relationshipPermissionGranted === true,
      routeObserved: routeNode.observed === true,
      controlsObserved: controlsNode.observed === true,
      canvasObserved: canvasNode.observed === true,
      hexSurfaceObserved: hexSurfaceNode.observed === true,
      recommendedConstructAction:
        canvasNode.observed !== true
          ? "RENEW_CANVAS_PUBLIC_AUTHORITY_AND_DOM_SURFACE_BINDING"
          : routeNode.observed !== true
            ? "RENEW_ROUTE_CONDUCTOR_PUBLIC_AUTHORITY_PUBLICATION_IN_TARGET_CONTEXT"
            : controlsNode.observed !== true
              ? "RENEW_CONTROLS_PUBLIC_AUTHORITY_PUBLICATION_IN_TARGET_CONTEXT"
              : hexSurfaceNode.observed !== true
                ? "RENEW_OR_LOAD_HEX_SURFACE_PUBLIC_GATE"
                : firstNotGranted
                  ? nextAction
                  : "PROCEED_TO_TARGETED_PAIR_OR_TRIAD_RENEWAL_WITH_MATRIX_AS_CONTROL_RECEIPT"
    };

    state.delegatoryHandshakeMatrixActive = true;
    state.multiHandshakeVarianceAuditActive = true;
    state.intendedHandoffVarianceIncluded = true;
    state.singleHandshakeGreenLightBlocked = true;

    state.delegatoryAuditStatus = status;
    state.delegatoryAuditCompleteRelationshipCount = complete.length;
    state.delegatoryAuditTotalRelationshipCount = relationships.length;
    state.delegatoryAuditFirstNotGrantedRelationship = firstNotGranted ? firstNotGranted.id : "NONE";
    state.delegatoryAuditFirstVarianceClass = firstNotGranted ? firstNotGranted.varianceClass : "NONE";
    state.delegatoryAuditFirstRecommendedFile = firstNotGranted ? nextFile : "NONE";
    state.delegatoryAuditFirstRecommendedAction = firstNotGranted ? nextAction : "NONE";

    state.motionPermissionGranted = motionGranted;
    state.visibleSurfacePermissionGranted = visibleGranted;
    state.pairPermissionGranted = routeCanvasPair.relationshipPermissionGranted === true;
    state.constructPermissionGranted = relationships.every((entry) => entry.relationshipPermissionGranted === true);

    state.handshakeFrontOnlyCount = handshakeFrontOnly.length;
    state.unobservedEndpointRelationshipCount = missingEndpoints.length;

    state.delegatoryNodes = nodes;
    state.delegatoryRelationships = relationships;
    state.threeFileConstructStrategy = threeFileStrategy;

    if (firstNotGranted) {
      addNote(state, `DELEGATORY_FIRST_PERMISSION_NOT_GRANTED:${firstNotGranted.id}:${firstNotGranted.varianceClass}`);
    }

    if (handshakeFrontOnly.length) {
      addNote(state, `HANDSHAKE_FRONTPORT_ONLY_COUNT:${handshakeFrontOnly.length}`);
    }

    if (missingEndpoints.length) {
      addNote(state, `UNOBSERVED_ENDPOINT_RELATIONSHIP_COUNT:${missingEndpoints.length}`);
    }

    return {
      packetType: "HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_PACKET_v11_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      status,
      completeRelationshipCount: complete.length,
      totalRelationshipCount: relationships.length,
      firstNotGrantedRelationship: state.delegatoryAuditFirstNotGrantedRelationship,
      firstVarianceClass: state.delegatoryAuditFirstVarianceClass,
      firstRecommendedFile: state.delegatoryAuditFirstRecommendedFile,
      firstRecommendedAction: state.delegatoryAuditFirstRecommendedAction,
      motionPermissionGranted: motionGranted,
      visibleSurfacePermissionGranted: visibleGranted,
      pairPermissionGranted: state.pairPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      handshakeFrontOnlyCount: state.handshakeFrontOnlyCount,
      unobservedEndpointRelationshipCount: state.unobservedEndpointRelationshipCount,
      nodes,
      relationships,
      threeFileConstructStrategy: threeFileStrategy,
      auditedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
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
      lineageInternalRenewalReceipt: LINEAGE_INTERNAL_RENEWAL_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,
      version: VERSION,

      packetName: REPORT_PACKET,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: nowIso(),

      chronologyHubActive: true,
      northIsHubOnly: true,
      nineStepChronologyActive: true,
      scriptPresentAuthorityRecoveryActive: true,
      f21FailureTaxonomyActive: true,
      routeCanvasPermissionGatePairAuditActive: true,
      delegatoryHandshakeMatrixActive: true,
      multiHandshakeVarianceAuditActive: true,
      intendedHandoffVarianceIncluded: true,
      singleHandshakeGreenLightBlocked: true,
      canvasSurfaceTruthProbeExpected: true,
      receiverStillCallsNorthOnly: true,
      diagnosticRouteHtmlRenewalRequired: false,

      chronology: [],
      evidenceByStep: {},
      notes: [
        "NORTH_V11_PUBLIC_CONTRACT_PRESERVED",
        "NORTH_INTERNAL_V11_3_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_ACTIVE",
        "PREVIOUS_V11_2_ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_PRESERVED",
        "PREVIOUS_V11_1_SCRIPT_PRESENT_AUTHORITY_RECOVERY_PRESERVED",
        "NORTH_IS_HUB_NOT_EVIDENCE_OWNER",
        "DIAGNOSTIC_RECEIVER_STILL_CALLS_NORTH_ONLY",
        "CHILDREN_AND_PROBES_RETAIN_SEPARATE_AUTHORITY",
        "CANVAS_SURFACE_TRUTH_PROBE_REMAINS_AFTER_WEST_BEFORE_SOUTH",
        "ONE_CONFIRMED_HANDSHAKE_DOES_NOT_GRANT_WHOLE_CHAIN_PERMISSION",
        "INTENDED_HANDOFF_VARIANCE_INCLUDED",
        "NO_PRODUCTION_MUTATION_PERMISSION_GRANTED"
      ],

      targetContextStatus: "UNKNOWN",
      targetContextSource: "UNKNOWN",
      targetContextError: "UNKNOWN",

      servedHtmlContract: "UNKNOWN",
      servedIndexJsContract: "UNKNOWN",
      servedRouteConductorContract: "UNKNOWN",
      indexScriptSrc: "UNKNOWN",
      routeConductorScriptSrc: "UNKNOWN",
      routeConductorScriptCacheKey: "UNKNOWN",
      cacheOrServedContractMismatch: "UNKNOWN",
      cacheKeyStaleNonBlocking: "UNKNOWN",
      servedContractMismatchIsBlocking: "UNKNOWN",
      currentVisibleHearthStatus: "UNKNOWN",

      diagnosticTargetAccessStatus: "UNKNOWN",
      diagnosticTargetAccessError: "UNKNOWN",
      renderedPlanetProofReady: "UNKNOWN",
      visiblePlanetProofReady: "UNKNOWN",
      visiblePlanetProofSource: "UNKNOWN",
      canvasExpressionProofStatus: "UNKNOWN",
      canvasExpressionBottleneckClass: "UNKNOWN",
      canvasExpressionSurfaceReady: "UNKNOWN",
      canvasExpressionRichnessReady: "UNKNOWN",
      domExpressionSurfaceProofReady: "UNKNOWN",
      canvasPixelVarianceStatus: "UNKNOWN",
      canvasFingerExpressionStatus: "UNKNOWN",
      fourWayCanvasHandoffStatus: "UNKNOWN",
      currentCanvasParentContract: "UNKNOWN",
      currentCanvasParentRecognized: "UNKNOWN",

      canvasSurfaceTruthProbeStatus: "NOT_RUN",
      canvasSurfaceTruthAvailable: "UNKNOWN",
      canvasElementFound: "UNKNOWN",
      canvasSelector: "UNKNOWN",
      canvasMountFound: "UNKNOWN",
      canvasMountSelector: "UNKNOWN",
      canvasInMount: "UNKNOWN",
      canvasRectNonzero: "UNKNOWN",
      canvasComputedVisible: "UNKNOWN",
      canvasViewportIntersecting: "UNKNOWN",
      canvasContext2dReady: "UNKNOWN",
      canvasPixelSampleStatus: "UNKNOWN",
      canvasPixelVisible: "UNKNOWN",
      canvasLayerBlocked: "UNKNOWN",
      canvasLayerBlocker: "UNKNOWN",
      canvasNamespacePresent: "UNKNOWN",
      canvasNamespaceMatchesDomSurface: "UNKNOWN",
      canvasParentContractRecognized: "UNKNOWN",
      canvasTruthFirstFailedCoordinate: "UNKNOWN",
      canvasTruthFailureClass: "UNKNOWN",
      canvasTruthFailureReason: "UNKNOWN",
      canvasTruthRecommendedOwner: "UNKNOWN",
      canvasTruthRecommendedFile: "UNKNOWN",
      canvasTruthRecommendedAction: "UNKNOWN",

      controlFileStatus: "UNKNOWN",
      controlFileLoaded: "UNKNOWN",
      controlGlobalPresent: "UNKNOWN",
      controlReceiptPresent: "UNKNOWN",
      controlHandshakeStatus: "UNKNOWN",
      motionTouchStatus: "UNKNOWN",
      dragStatus: "UNKNOWN",
      viewControlStatus: "UNKNOWN",
      visiblePlanetAllowedWithoutControls: "true",

      chronologyCompletionStatus: "NOT_RUN",
      firstChronologyFailureOwner: "UNKNOWN",
      firstChronologyFailureFile: "UNKNOWN",
      firstChronologyFailureClass: "UNKNOWN",
      firstChronologyFailureReason: "UNKNOWN",

      zoneOfInflictionOwner: "UNKNOWN",
      zoneOfInflictionFile: "UNKNOWN",
      zoneOfInflictionClass: "UNKNOWN",
      zoneOfInflictionReason: "UNKNOWN",

      delegatoryAuditStatus: "NOT_RUN",
      delegatoryAuditCompleteRelationshipCount: 0,
      delegatoryAuditTotalRelationshipCount: 0,
      delegatoryAuditFirstNotGrantedRelationship: "UNKNOWN",
      delegatoryAuditFirstVarianceClass: "UNKNOWN",
      delegatoryAuditFirstRecommendedFile: "UNKNOWN",
      delegatoryAuditFirstRecommendedAction: "UNKNOWN",
      motionPermissionGranted: false,
      visibleSurfacePermissionGranted: false,
      pairPermissionGranted: false,
      constructPermissionGranted: false,
      handshakeFrontOnlyCount: 0,
      unobservedEndpointRelationshipCount: 0,
      delegatoryNodes: [],
      delegatoryRelationships: [],
      threeFileConstructStrategy: {},

      primaryCase: "INCONCLUSIVE_EVIDENCE",
      calibrationStatus: "CALIBRATION_NOT_RUN",
      calibrationHoldReason: "RUN_NORTH_DELEGATORY_HANDSHAKE_MATRIX",
      diagnosticChronologyClean: "false",
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      diagnosticTrackNewsAlignmentStatus: "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_NOT_RUN",
      diagnosticTrackNewsAlignmentScore: 0,
      diagnosticTrackNewsAlignmentFirstFailedStage: "NORTH_NOT_RUN",
      diagnosticTrackFibonacciSynchronizationStatus: "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_NOT_RUN",
      diagnosticTrackFibonacciSynchronizationScore: 0,
      diagnosticTrackFibonacciSynchronizationFirstFailedStage: "F1",

      canvasStandardNewsAlignmentStatus: "CANVAS_STANDARD_NEWS_ALIGNMENT_NOT_RUN",
      canvasStandardNewsAlignmentScore: 0,
      canvasStandardNewsAlignmentFirstFailedStage: "CANVAS_TRUTH_PROBE_NOT_RUN",
      canvasStandardFibonacciSynchronizationStatus: "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_NOT_RUN",
      canvasStandardFibonacciSynchronizationScore: 0,
      canvasStandardFibonacciSynchronizationFirstFailedStage: "F1",

      recommendedNextOwner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
      recommendedNextFile: FILE,
      recommendedNextAction: "RUN_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX",

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

    state.servedHtmlContract = firstKnown(getValue(evidence, "SERVED_HTML_CONTRACT", ""), state.servedHtmlContract);
    state.servedIndexJsContract = firstKnown(getValue(evidence, "SERVED_INDEX_JS_CONTRACT", ""), state.servedIndexJsContract);
    state.servedRouteConductorContract = firstKnown(getValue(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT", ""), state.servedRouteConductorContract);
    state.indexScriptSrc = firstKnown(getValue(evidence, "INDEX_SCRIPT_SRC", ""), state.indexScriptSrc);
    state.routeConductorScriptSrc = firstKnown(getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC", ""), state.routeConductorScriptSrc);
    state.routeConductorScriptCacheKey = firstKnown(getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY", ""), state.routeConductorScriptCacheKey);
    state.cacheOrServedContractMismatch = firstKnown(getValue(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH", ""), state.cacheOrServedContractMismatch);
    state.currentVisibleHearthStatus = firstKnown(getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", ""), state.currentVisibleHearthStatus);

    state.diagnosticTargetAccessStatus = firstKnown(getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", ""), state.diagnosticTargetAccessStatus);
    state.diagnosticTargetAccessError = firstKnown(getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", ""), state.diagnosticTargetAccessError);
    state.renderedPlanetProofReady = firstKnown(getValue(evidence, "RENDERED_PLANET_PROOF_READY", ""), state.renderedPlanetProofReady);
    state.visiblePlanetProofReady = firstKnown(getValue(evidence, "VISIBLE_PLANET_PROOF_READY", ""), state.visiblePlanetProofReady);
    state.visiblePlanetProofSource = firstKnown(getValue(evidence, "VISIBLE_PLANET_PROOF_SOURCE", ""), state.visiblePlanetProofSource);
    state.canvasExpressionProofStatus = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_PROOF_STATUS", ""), state.canvasExpressionProofStatus);
    state.canvasExpressionBottleneckClass = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", ""), state.canvasExpressionBottleneckClass);
    state.canvasExpressionSurfaceReady = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_SURFACE_READY", ""), state.canvasExpressionSurfaceReady);
    state.canvasExpressionRichnessReady = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_RICHNESS_READY", ""), state.canvasExpressionRichnessReady);
    state.domExpressionSurfaceProofReady = firstKnown(getValue(evidence, "DOM_EXPRESSION_SURFACE_PROOF_READY", ""), state.domExpressionSurfaceProofReady);
    state.canvasPixelVarianceStatus = firstKnown(getValue(evidence, "CANVAS_PIXEL_VARIANCE_STATUS", ""), state.canvasPixelVarianceStatus);
    state.canvasFingerExpressionStatus = firstKnown(getValue(evidence, "CANVAS_FINGER_EXPRESSION_STATUS", ""), state.canvasFingerExpressionStatus);
    state.fourWayCanvasHandoffStatus = firstKnown(getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_STATUS", ""), state.fourWayCanvasHandoffStatus);
    state.currentCanvasParentContract = firstKnown(getValue(evidence, "CURRENT_CANVAS_PARENT_CONTRACT", ""), state.currentCanvasParentContract);
    state.currentCanvasParentRecognized = firstKnown(getValue(evidence, "CURRENT_CANVAS_PARENT_RECOGNIZED", ""), state.currentCanvasParentRecognized);

    state.canvasSurfaceTruthProbeStatus = firstKnown(
      getValue(evidence, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", ""),
      getValue(evidence, "CANVAS_SURFACE_TRUTH_STATUS", ""),
      state.canvasSurfaceTruthProbeStatus
    );
    state.canvasSurfaceTruthAvailable = firstKnown(getValue(evidence, "CANVAS_SURFACE_TRUTH_AVAILABLE", ""), state.canvasSurfaceTruthAvailable);
    state.canvasElementFound = firstKnown(getValue(evidence, "CANVAS_ELEMENT_FOUND", ""), state.canvasElementFound);
    state.canvasSelector = firstKnown(getValue(evidence, "CANVAS_SELECTOR", ""), state.canvasSelector);
    state.canvasMountFound = firstKnown(getValue(evidence, "CANVAS_MOUNT_FOUND", ""), state.canvasMountFound);
    state.canvasMountSelector = firstKnown(getValue(evidence, "CANVAS_MOUNT_SELECTOR", ""), state.canvasMountSelector);
    state.canvasInMount = firstKnown(getValue(evidence, "CANVAS_IN_MOUNT", ""), state.canvasInMount);
    state.canvasRectNonzero = firstKnown(getValue(evidence, "CANVAS_RECT_NONZERO", ""), state.canvasRectNonzero);
    state.canvasComputedVisible = firstKnown(getValue(evidence, "CANVAS_COMPUTED_VISIBLE", ""), state.canvasComputedVisible);
    state.canvasViewportIntersecting = firstKnown(getValue(evidence, "CANVAS_VIEWPORT_INTERSECTING", ""), state.canvasViewportIntersecting);
    state.canvasContext2dReady = firstKnown(getValue(evidence, "CANVAS_CONTEXT_2D_READY", ""), state.canvasContext2dReady);
    state.canvasPixelSampleStatus = firstKnown(getValue(evidence, "CANVAS_PIXEL_SAMPLE_STATUS", ""), state.canvasPixelSampleStatus);
    state.canvasPixelVisible = firstKnown(getValue(evidence, "CANVAS_PIXEL_VISIBLE", ""), state.canvasPixelVisible);
    state.canvasLayerBlocked = firstKnown(getValue(evidence, "CANVAS_LAYER_BLOCKED", ""), state.canvasLayerBlocked);
    state.canvasLayerBlocker = firstKnown(getValue(evidence, "CANVAS_LAYER_BLOCKER", ""), state.canvasLayerBlocker);
    state.canvasNamespacePresent = firstKnown(getValue(evidence, "CANVAS_NAMESPACE_PRESENT", ""), state.canvasNamespacePresent);
    state.canvasNamespaceMatchesDomSurface = firstKnown(getValue(evidence, "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE", ""), state.canvasNamespaceMatchesDomSurface);
    state.canvasParentContractRecognized = firstKnown(getValue(evidence, "CANVAS_PARENT_CONTRACT_RECOGNIZED", ""), state.canvasParentContractRecognized);
    state.canvasTruthFirstFailedCoordinate = firstKnown(getValue(evidence, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", ""), state.canvasTruthFirstFailedCoordinate);
    state.canvasTruthFailureClass = firstKnown(getValue(evidence, "CANVAS_TRUTH_FAILURE_CLASS", ""), state.canvasTruthFailureClass);
    state.canvasTruthFailureReason = firstKnown(getValue(evidence, "CANVAS_TRUTH_FAILURE_REASON", ""), state.canvasTruthFailureReason);
    state.canvasTruthRecommendedOwner = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_OWNER", ""), state.canvasTruthRecommendedOwner);
    state.canvasTruthRecommendedFile = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_FILE", ""), state.canvasTruthRecommendedFile);
    state.canvasTruthRecommendedAction = firstKnown(getValue(evidence, "CANVAS_TRUTH_RECOMMENDED_ACTION", ""), state.canvasTruthRecommendedAction);

    state.controlFileStatus = firstKnown(getValue(evidence, "CONTROL_FILE_STATUS", ""), state.controlFileStatus);
    state.controlFileLoaded = firstKnown(getValue(evidence, "CONTROL_FILE_LOADED", ""), state.controlFileLoaded);
    state.controlGlobalPresent = firstKnown(getValue(evidence, "CONTROL_GLOBAL_PRESENT", ""), state.controlGlobalPresent);
    state.controlReceiptPresent = firstKnown(getValue(evidence, "CONTROL_RECEIPT_PRESENT", ""), state.controlReceiptPresent);
    state.controlHandshakeStatus = firstKnown(getValue(evidence, "CONTROL_HANDSHAKE_STATUS", ""), state.controlHandshakeStatus);
    state.motionTouchStatus = firstKnown(getValue(evidence, "MOTION_TOUCH_STATUS", ""), state.motionTouchStatus);
    state.dragStatus = firstKnown(getValue(evidence, "DRAG_STATUS", ""), state.dragStatus);
    state.viewControlStatus = firstKnown(getValue(evidence, "VIEW_CONTROL_STATUS", ""), state.viewControlStatus);

    state.primaryCase = firstKnown(getValue(evidence, "PRIMARY_CASE", ""), state.primaryCase);
    state.calibrationStatus = firstKnown(getValue(evidence, "CALIBRATION_STATUS", ""), state.calibrationStatus);
    state.calibrationHoldReason = firstKnown(getValue(evidence, "CALIBRATION_HOLD_REASON", ""), state.calibrationHoldReason);
    state.recommendedNextOwner = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_OWNER", ""), state.recommendedNextOwner);
    state.recommendedNextFile = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_FILE", ""), state.recommendedNextFile);
    state.recommendedNextAction = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_ACTION", ""), state.recommendedNextAction);

    for (const note of normalizeNotes(
      getValue(evidence, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "SOUTH_SECONDARY_OUTPUT_NOTES", ""),
      getValue(evidence, "CANVAS_SURFACE_TRUTH_NOTES", "")
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

    if (!scriptBefore.present) {
      const load = await appendScript(step.file, step.id, "PRIMARY_LOAD");
      entry.loadAttempted = load.attempted === true;
      entry.loadStatus = load.status;
      entry.scriptRecoverySrc = load.src;

      const foundAfterPrimary = findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
      const scriptAfterPrimary = scriptInfo(step.file, doc);

      entry.scriptPresentAfter = scriptAfterPrimary.present;
      entry.scriptCountAfter = scriptAfterPrimary.count;
      entry.scriptSrc = scriptAfterPrimary.src;
      entry.scriptCacheKey = scriptAfterPrimary.cacheKey;

      if (foundAfterPrimary.value) {
        entry.authorityObservedAfterRecovery = true;
        entry.authorityRecoveryStatus = "PRIMARY_LOAD_PUBLISHED_AUTHORITY";
        return foundAfterPrimary;
      }
    } else {
      entry.loadStatus = "SCRIPT_ALREADY_PRESENT_AUTHORITY_NOT_OBSERVED";
    }

    const foundBeforeRecovery = findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
    if (foundBeforeRecovery.value) {
      entry.authorityObservedAfterRecovery = true;
      entry.authorityRecoveryStatus = "AUTHORITY_APPEARED_BEFORE_RECOVERY_RELOAD";
      return foundBeforeRecovery;
    }

    const recoveryLoad = await appendScript(step.file, step.id, "AUTHORITY_RECOVERY");
    entry.loadAttempted = entry.loadAttempted || recoveryLoad.attempted === true;
    entry.authorityRecoveryAttempted = recoveryLoad.attempted === true;
    entry.authorityRecoveryStatus = recoveryLoad.status;
    entry.recoveryScriptSrc = recoveryLoad.src;
    entry.loadStatus = recoveryLoad.status;

    const foundAfterRecovery = findFirstPath(step.paths, [{ label: "DIAGNOSTIC", root }]);
    const scriptAfterRecovery = scriptInfo(step.file, doc);

    entry.scriptPresentAfter = scriptAfterRecovery.present;
    entry.scriptCountAfter = scriptAfterRecovery.count;
    entry.scriptSrc = scriptAfterRecovery.src;
    entry.scriptCacheKey = scriptAfterRecovery.cacheKey;
    entry.authorityObservedAfterRecovery = Boolean(foundAfterRecovery.value);

    if (foundAfterRecovery.value) {
      entry.authorityRecoveryStatus = `${recoveryLoad.status}_AUTHORITY_OBSERVED`;
    } else if (scriptAfterRecovery.present) {
      entry.authorityRecoveryStatus = `${recoveryLoad.status}_AUTHORITY_STILL_NOT_OBSERVED`;
    }

    return foundAfterRecovery;
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
      status: step.id === "NORTH_RAIL" ? "COMPLETE" : "PENDING"
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
    entry.contract = firstKnown(
      receipt.contract,
      receipt.CONTRACT,
      receipt.implementationContract,
      receipt.INTERNAL_RENEWAL_CONTRACT,
      found.value.contract,
      found.value.CONTRACT
    );
    entry.receipt = firstKnown(
      receipt.receipt,
      receipt.RECEIPT,
      receipt.implementationReceipt,
      receipt.INTERNAL_RENEWAL_RECEIPT,
      found.value.receipt,
      found.value.RECEIPT
    );

    const acceptedMethod = (step.methods || []).find((method) => isFunction(found.value[method]));

    if (!acceptedMethod) {
      entry.status = "OBSERVED_API_MISSING";
      entry.callStatus = "CALL_METHOD_NOT_FOUND";
      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_OBSERVED_API_MISSING:${step.id}`);
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
        chronologyHubActive: true,
        nineStepChronologyActive: true,
        scriptPresentAuthorityRecoveryActive: true,
        f21FailureTaxonomyActive: true,
        routeCanvasPermissionGatePairAuditActive: true,
        delegatoryHandshakeMatrixActive: true,
        multiHandshakeVarianceAuditActive: true,
        intendedHandoffVarianceIncluded: true,
        singleHandshakeGreenLightBlocked: true,
        canvasSurfaceTruthProbeExpected: true,
        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        currentReport: clonePlain(state.reportObject || {}),
        chronology: clonePlain(state.chronology),
        evidenceByStep: clonePlain(state.evidenceByStep),
        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
        expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        expectedRouteConductorRenewalContract: EXPECTED_ROUTE_CONDUCTOR_RENEWAL_CONTRACT,
        expectedControlContract: EXPECTED_CONTROL_CONTRACT,
        expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
        expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
        expectedProbeCanvasSurfaceTruthContract: EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
        targetWindow: targetContext.targetWindow,
        targetDocument: targetContext.targetDocument,
        frameElement: targetContext.frameElement,
        noClaims: clonePlain(NO_CLAIMS),
        options: {
          loadMissingScripts: options.loadMissingScripts !== false,
          source: "DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX"
        }
      };

      const output = await Promise.resolve(found.value[acceptedMethod](payload));
      const evidence = extractEvidence(output);

      entry.callReturned = true;
      entry.callStatus = "CALL_RETURNED";
      entry.status = "COMPLETE";
      entry.outputKeys = Object.keys(evidence || {}).slice(0, 80).join(",") || "OUTPUT_EMPTY";

      state.chronology.push(entry);
      updateStateFromEvidence(state, step, evidence);

      if (step.id === "PROBE_CANVAS_SURFACE_TRUTH") {
        state.canvasSurfaceTruthProbeStatus = firstKnown(state.canvasSurfaceTruthProbeStatus, "CALL_RETURNED");
        state.canvasSurfaceTruthAvailable = firstKnown(state.canvasSurfaceTruthAvailable, "true");
        addNote(state, "CANVAS_SURFACE_TRUTH_PROBE_RETURNED_TO_NORTH");
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
      return {
        className: "NONE",
        reason: "NONE",
        action: "NONE"
      };
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

  function deriveCanvasTruthDisposition(state) {
    const probeEntry = state.chronology.find((entry) => entry.id === "PROBE_CANVAS_SURFACE_TRUTH");

    if (!probeEntry) {
      return {
        available: false,
        className: "CANVAS_SURFACE_TRUTH_PROBE_NOT_RUN",
        reason: "NORTH_HAS_NOT_REACHED_CANVAS_SURFACE_TRUTH_PROBE",
        owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        file: PROBE_CANVAS_SURFACE_TRUTH_FILE,
        action: "RUN_NORTH_CHRONOLOGY_HUB_THROUGH_CANVAS_SURFACE_TRUTH_PROBE"
      };
    }

    if (probeEntry.status !== "COMPLETE") {
      const classified = classifyChronologyFailure(probeEntry);

      return {
        available: false,
        className: classified.className,
        reason: classified.reason,
        owner: probeEntry.owner,
        file: probeEntry.file,
        action: classified.action
      };
    }

    if (
      textIsTrue(state.canvasElementFound) &&
      textIsTrue(state.canvasRectNonzero) &&
      textIsTrue(state.canvasComputedVisible) &&
      textIsTrue(state.canvasViewportIntersecting) &&
      textIsTrue(state.canvasContext2dReady) &&
      textIsTrue(state.canvasPixelVisible) &&
      !textIsTrue(state.canvasLayerBlocked)
    ) {
      return {
        available: true,
        className: "CANVAS_SURFACE_TRUTH_CONFIRMED",
        reason: "CANVAS_DOM_SURFACE_CONTEXT_VISIBILITY_AND_PIXEL_SAMPLE_CONFIRMED",
        owner: "NONE",
        file: "NONE",
        action: "REVIEW_WITH_CANVAS_SURFACE_TRUTH_CONFIRMED_NO_FINAL_VISUAL_PASS_CLAIM"
      };
    }

    if (textIsFalse(state.canvasElementFound)) {
      return {
        available: true,
        className: "CANVAS_DOM_SURFACE_NOT_FOUND",
        reason: "CANVAS_ELEMENT_FOUND_FALSE",
        owner: "CANVAS_EXPRESSION_SURFACE",
        file: CANVAS_FILE,
        action: "RENEW_CANVAS_TO_CREATE_OR_BIND_DOM_CANVAS_SURFACE"
      };
    }

    if (textIsFalse(state.canvasRectNonzero)) {
      return {
        available: true,
        className: "CANVAS_RECT_ZERO",
        reason: "CANVAS_RECT_NONZERO_FALSE",
        owner: "CANVAS_LAYOUT_SURFACE",
        file: CANVAS_FILE,
        action: "RENEW_CANVAS_OR_LAYOUT_TO_PRODUCE_NONZERO_SURFACE_RECT"
      };
    }

    if (textIsFalse(state.canvasContext2dReady)) {
      return {
        available: true,
        className: "CANVAS_CONTEXT_2D_NOT_READY",
        reason: "CANVAS_CONTEXT_2D_READY_FALSE",
        owner: "CANVAS_EXPRESSION_SURFACE",
        file: CANVAS_FILE,
        action: "RENEW_CANVAS_CONTEXT_CREATION_AND_SURFACE_BINDING"
      };
    }

    if (textIsFalse(state.canvasPixelVisible)) {
      return {
        available: true,
        className: "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE",
        reason: firstKnown(state.canvasPixelSampleStatus, "CANVAS_PIXEL_VISIBLE_FALSE"),
        owner: "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "AUDIT_CANVAS_DRAW_PATH_AND_DOWNSTREAM_EXPRESSION_ADAPTER"
      };
    }

    return {
      available: true,
      className: firstKnown(state.canvasTruthFailureClass, "CANVAS_SURFACE_TRUTH_INCONCLUSIVE"),
      reason: firstKnown(state.canvasTruthFailureReason, "CANVAS_SURFACE_TRUTH_RETURNED_BUT_NOT_CONCLUSIVE"),
      owner: firstKnown(state.canvasTruthRecommendedOwner, "CANVAS_EXPRESSION_SURFACE"),
      file: firstKnown(state.canvasTruthRecommendedFile, CANVAS_FILE),
      action: firstKnown(state.canvasTruthRecommendedAction, "AUDIT_CANVAS_SURFACE_TRUTH_OUTPUT")
    };
  }

  function resolveChronologyDisposition(state) {
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

      state.chronologyCompletionStatus = "CHRONOLOGY_STOPPED_AT_FIRST_FAILURE";
      state.firstChronologyFailureOwner = firstFailure.owner;
      state.firstChronologyFailureFile = firstFailure.file;
      state.firstChronologyFailureClass = classified.className;
      state.firstChronologyFailureReason = classified.reason;

      state.zoneOfInflictionOwner = firstFailure.owner;
      state.zoneOfInflictionFile = firstFailure.file;
      state.zoneOfInflictionClass = classified.className;
      state.zoneOfInflictionReason = classified.reason;

      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = `CALIBRATION_HOLD_${firstFailure.id}`;
      state.calibrationHoldReason = classified.reason;
      state.diagnosticChronologyClean = "false";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = firstFailure.owner;
      state.recommendedNextFile = firstFailure.file;
      state.recommendedNextAction = classified.action;

      addNote(state, `ZONE_OF_INFLICTION_FROM_CHRONOLOGY:${firstFailure.id}:${classified.className}`);
      return;
    }

    const canvasDisposition = deriveCanvasTruthDisposition(state);
    state.diagnosticChronologyClean = "true";

    if (canvasDisposition.className !== "CANVAS_SURFACE_TRUTH_CONFIRMED") {
      state.chronologyCompletionStatus = canvasDisposition.available
        ? "CHRONOLOGY_COMPLETE_CANVAS_SURFACE_TRUTH_FAILED"
        : "CHRONOLOGY_COMPLETE_CANVAS_SURFACE_TRUTH_UNAVAILABLE";

      state.firstChronologyFailureOwner = "NONE";
      state.firstChronologyFailureFile = "NONE";
      state.firstChronologyFailureClass = "NONE";
      state.firstChronologyFailureReason = "ALL_OBSERVED_CHRONOLOGY_STEPS_RETURNED_OR_WERE_READABLE";

      state.zoneOfInflictionOwner = canvasDisposition.owner;
      state.zoneOfInflictionFile = canvasDisposition.file;
      state.zoneOfInflictionClass = canvasDisposition.className;
      state.zoneOfInflictionReason = canvasDisposition.reason;

      state.primaryCase = canvasDisposition.available
        ? "CANVAS_SURFACE_TRUTH_FAILURE"
        : "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_CANVAS_SURFACE_TRUTH";
      state.calibrationHoldReason = canvasDisposition.reason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = canvasDisposition.owner;
      state.recommendedNextFile = canvasDisposition.file;
      state.recommendedNextAction = canvasDisposition.action;

      addNote(state, `ZONE_OF_INFLICTION_FROM_CANVAS_SURFACE_TRUTH:${canvasDisposition.className}`);
      return;
    }

    state.chronologyCompletionStatus = "CHRONOLOGY_COMPLETE_CANVAS_SURFACE_TRUTH_CONFIRMED";
    state.firstChronologyFailureOwner = "NONE";
    state.firstChronologyFailureFile = "NONE";
    state.firstChronologyFailureClass = "NONE";
    state.firstChronologyFailureReason = "NONE";

    state.zoneOfInflictionOwner = "NONE";
    state.zoneOfInflictionFile = "NONE";
    state.zoneOfInflictionClass = "NONE";
    state.zoneOfInflictionReason = "CANVAS_SURFACE_TRUTH_CONFIRMED_NO_DIAGNOSTIC_FILE_FAILURE_DETECTED";

    state.primaryCase = "DIAGNOSTIC_TRACK_AND_CANVAS_SURFACE_TRUTH_COMPLETE_NO_VISUAL_PASS_CLAIM";
    state.calibrationStatus = "CALIBRATION_TRACK_COMPLETE";
    state.calibrationHoldReason = "NONE";
    state.diagnosticRailClean = "true";
    state.calibrationPointReached = "true";
    state.recommendedNextOwner = "TEACHER_REVIEW";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction =
      "REVIEW_CANVAS_SURFACE_TRUTH_CONFIRMED_WITH_NO_READY_OR_VISUAL_PASS_CLAIM";

    addNote(state, "CHRONOLOGY_COMPLETE_AND_CANVAS_SURFACE_TRUTH_CONFIRMED");
  }

  function resolveAlignment(state) {
    const required = CHRONOLOGY_STEPS.length;
    const complete = state.chronology.filter((entry) => entry.status === "COMPLETE").length;
    const firstFailed = state.chronology.find((entry) => entry.status !== "COMPLETE");

    state.diagnosticTrackNewsAlignmentScore = Math.round((complete / required) * 100);
    state.diagnosticTrackNewsAlignmentStatus = firstFailed
      ? "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_PARTIAL"
      : "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_COMPLETE";
    state.diagnosticTrackNewsAlignmentFirstFailedStage = firstFailed ? firstFailed.id : "NONE";

    const fibStages = CHRONOLOGY_STEPS.map((step) => ({
      key: step.fibonacciStage,
      id: step.id,
      passed: Boolean(state.chronology.find((entry) => entry.id === step.id && entry.status === "COMPLETE"))
    }));

    const fibPassed = fibStages.filter((stage) => stage.passed).length;
    const fibFirstFailed = fibStages.find((stage) => !stage.passed);

    state.diagnosticTrackFibonacciSynchronizationScore = Math.round((fibPassed / fibStages.length) * 100);
    state.diagnosticTrackFibonacciSynchronizationStatus = fibFirstFailed
      ? "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_PARTIAL"
      : "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_COMPLETE";
    state.diagnosticTrackFibonacciSynchronizationFirstFailedStage = fibFirstFailed
      ? `${fibFirstFailed.key}:${fibFirstFailed.id}`
      : "NONE";

    const probeComplete = Boolean(
      state.chronology.find((entry) => entry.id === "PROBE_CANVAS_SURFACE_TRUTH" && entry.status === "COMPLETE")
    );

    const canvasStages = [
      { key: "SURFACE_PROBE_COMPLETE", passed: probeComplete },
      { key: "CANVAS_ELEMENT_FOUND", passed: textIsTrue(state.canvasElementFound) },
      { key: "CANVAS_IN_MOUNT", passed: textIsTrue(state.canvasInMount) || state.canvasInMount === "UNKNOWN" },
      { key: "CANVAS_RECT_NONZERO", passed: textIsTrue(state.canvasRectNonzero) },
      { key: "CANVAS_COMPUTED_VISIBLE", passed: textIsTrue(state.canvasComputedVisible) },
      { key: "CANVAS_VIEWPORT_INTERSECTING", passed: textIsTrue(state.canvasViewportIntersecting) },
      { key: "CANVAS_CONTEXT_2D_READY", passed: textIsTrue(state.canvasContext2dReady) },
      { key: "CANVAS_PIXEL_VISIBLE", passed: textIsTrue(state.canvasPixelVisible) },
      { key: "CANVAS_LAYER_NOT_BLOCKED", passed: !textIsTrue(state.canvasLayerBlocked) }
    ];

    const canvasPassed = canvasStages.filter((stage) => stage.passed).length;
    const canvasFirstFailed = canvasStages.find((stage) => !stage.passed);

    state.canvasStandardNewsAlignmentScore = Math.round((canvasPassed / canvasStages.length) * 100);
    state.canvasStandardNewsAlignmentStatus = canvasFirstFailed
      ? "CANVAS_STANDARD_NEWS_ALIGNMENT_PARTIAL"
      : "CANVAS_STANDARD_NEWS_ALIGNMENT_COMPLETE";
    state.canvasStandardNewsAlignmentFirstFailedStage = canvasFirstFailed ? canvasFirstFailed.key : "NONE";

    const canvasFibStages = [
      { key: "F1:PROBE_COMPLETE", passed: probeComplete },
      { key: "F2:DOM_SURFACE", passed: textIsTrue(state.canvasElementFound) },
      { key: "F3:MOUNT_BINDING", passed: textIsTrue(state.canvasInMount) || state.canvasInMount === "UNKNOWN" },
      { key: "F5:RECT_NONZERO", passed: textIsTrue(state.canvasRectNonzero) },
      { key: "F8:COMPUTED_VISIBLE", passed: textIsTrue(state.canvasComputedVisible) },
      { key: "F13:CONTEXT_2D", passed: textIsTrue(state.canvasContext2dReady) },
      { key: "F21:PIXEL_VISIBLE_NO_FINAL_CLAIM", passed: textIsTrue(state.canvasPixelVisible) && state.f21ClaimedByDiagnosticRail === false }
    ];

    const canvasFibPassed = canvasFibStages.filter((stage) => stage.passed).length;
    const canvasFibFirstFailed = canvasFibStages.find((stage) => !stage.passed);

    state.canvasStandardFibonacciSynchronizationScore = Math.round((canvasFibPassed / canvasFibStages.length) * 100);
    state.canvasStandardFibonacciSynchronizationStatus = canvasFibFirstFailed
      ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_PARTIAL"
      : "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_COMPLETE";
    state.canvasStandardFibonacciSynchronizationFirstFailedStage = canvasFibFirstFailed ? canvasFibFirstFailed.key : "NONE";
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
      schema: "HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_VERDICT_SCHEMA_v11_3",
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: state.diagnosticTimestamp,

      hub: {
        chronologyHubActive: true,
        northIsHubOnly: true,
        nineStepChronologyActive: true,
        scriptPresentAuthorityRecoveryActive: true,
        f21FailureTaxonomyActive: true,
        routeCanvasPermissionGatePairAuditActive: true,
        delegatoryHandshakeMatrixActive: true,
        multiHandshakeVarianceAuditActive: true,
        intendedHandoffVarianceIncluded: true,
        singleHandshakeGreenLightBlocked: true,
        canvasSurfaceTruthProbeExpected: true,
        receiverStillCallsNorthOnly: true,
        diagnosticRouteHtmlRenewalRequired: false
      },

      chronology: clonePlain(state.chronology),
      chronologyCompletionStatus: state.chronologyCompletionStatus,

      zoneOfInfliction: {
        owner: state.zoneOfInflictionOwner,
        file: state.zoneOfInflictionFile,
        class: state.zoneOfInflictionClass,
        reason: state.zoneOfInflictionReason
      },

      delegatoryAudit: {
        status: state.delegatoryAuditStatus,
        completeRelationshipCount: state.delegatoryAuditCompleteRelationshipCount,
        totalRelationshipCount: state.delegatoryAuditTotalRelationshipCount,
        firstNotGrantedRelationship: state.delegatoryAuditFirstNotGrantedRelationship,
        firstVarianceClass: state.delegatoryAuditFirstVarianceClass,
        firstRecommendedFile: state.delegatoryAuditFirstRecommendedFile,
        firstRecommendedAction: state.delegatoryAuditFirstRecommendedAction,
        motionPermissionGranted: state.motionPermissionGranted,
        visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
        pairPermissionGranted: state.pairPermissionGranted,
        constructPermissionGranted: state.constructPermissionGranted,
        handshakeFrontOnlyCount: state.handshakeFrontOnlyCount,
        unobservedEndpointRelationshipCount: state.unobservedEndpointRelationshipCount,
        nodes: clonePlain(state.delegatoryNodes),
        relationships: clonePlain(state.delegatoryRelationships),
        threeFileConstructStrategy: clonePlain(state.threeFileConstructStrategy)
      },

      canvasSurfaceTruth: {
        probeStatus: state.canvasSurfaceTruthProbeStatus,
        available: state.canvasSurfaceTruthAvailable,
        canvasElementFound: state.canvasElementFound,
        canvasMountFound: state.canvasMountFound,
        canvasInMount: state.canvasInMount,
        canvasRectNonzero: state.canvasRectNonzero,
        canvasComputedVisible: state.canvasComputedVisible,
        canvasViewportIntersecting: state.canvasViewportIntersecting,
        canvasContext2dReady: state.canvasContext2dReady,
        canvasPixelVisible: state.canvasPixelVisible,
        canvasLayerBlocked: state.canvasLayerBlocked,
        failureClass: state.canvasTruthFailureClass,
        failureReason: state.canvasTruthFailureReason
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
      NORTH_LINEAGE_INTERNAL_RENEWAL_RECEIPT: LINEAGE_INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_NORTH_CONTRACT,
      PREVIOUS_NORTH_RECEIPT,

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      NINE_STEP_CHRONOLOGY_ACTIVE: true,
      SCRIPT_PRESENT_AUTHORITY_RECOVERY_ACTIVE: true,
      F21_FAILURE_TAXONOMY_ACTIVE: true,
      ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_ACTIVE: true,
      DELEGATORY_HANDSHAKE_MATRIX_ACTIVE: true,
      MULTI_HANDSHAKE_VARIANCE_AUDIT_ACTIVE: true,
      INTENDED_HANDOFF_VARIANCE_INCLUDED: true,
      SINGLE_HANDSHAKE_GREEN_LIGHT_BLOCKED: true,
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: true,
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      TARGET_CONTEXT_STATUS: state.targetContextStatus,
      TARGET_CONTEXT_SOURCE: state.targetContextSource,
      TARGET_CONTEXT_ERROR: state.targetContextError,

      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_SURFACE_FILE,
      HEX_AUTHORITY_FILE,
      POINTER_FINGER_FILE,

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
      EXPECTED_ROUTE_CONDUCTOR_RENEWAL_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_POINTER_FINGER_CONTRACT,

      CHRONOLOGY_SEQUENCE: clonePlain(state.chronology),
      CHRONOLOGY_SEQUENCE_JSON: clonePlain(state.chronology),
      CHRONOLOGY_SEQUENCE_TEXT: chronologyText(state),
      CHRONOLOGY_COMPLETION_STATUS: state.chronologyCompletionStatus,
      FIRST_CHRONOLOGY_FAILURE_OWNER: state.firstChronologyFailureOwner,
      FIRST_CHRONOLOGY_FAILURE_FILE: state.firstChronologyFailureFile,
      FIRST_CHRONOLOGY_FAILURE_CLASS: state.firstChronologyFailureClass,
      FIRST_CHRONOLOGY_FAILURE_REASON: state.firstChronologyFailureReason,

      ZONE_OF_INFLICTION_OWNER: state.zoneOfInflictionOwner,
      ZONE_OF_INFLICTION_FILE: state.zoneOfInflictionFile,
      ZONE_OF_INFLICTION_CLASS: state.zoneOfInflictionClass,
      ZONE_OF_INFLICTION_REASON: state.zoneOfInflictionReason,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,
      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: state.routeConductorScriptCacheKey,
      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CACHE_KEY_STALE_NON_BLOCKING: state.cacheKeyStaleNonBlocking,
      SERVED_CONTRACT_MISMATCH_IS_BLOCKING: state.servedContractMismatchIsBlocking,
      CURRENT_VISIBLE_HEARTH_STATUS: state.currentVisibleHearthStatus,

      RENDERED_PLANET_PROOF_READY: state.renderedPlanetProofReady,
      VISIBLE_PLANET_PROOF_READY: state.visiblePlanetProofReady,
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      CANVAS_EXPRESSION_PROOF_STATUS: state.canvasExpressionProofStatus,
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: state.canvasExpressionBottleneckClass,
      CANVAS_EXPRESSION_SURFACE_READY: state.canvasExpressionSurfaceReady,
      CANVAS_EXPRESSION_RICHNESS_READY: state.canvasExpressionRichnessReady,
      DOM_EXPRESSION_SURFACE_PROOF_READY: state.domExpressionSurfaceProofReady,
      CANVAS_PIXEL_VARIANCE_STATUS: state.canvasPixelVarianceStatus,
      CANVAS_FINGER_EXPRESSION_STATUS: state.canvasFingerExpressionStatus,
      FOUR_WAY_CANVAS_HANDOFF_STATUS: state.fourWayCanvasHandoffStatus,
      CURRENT_CANVAS_PARENT_CONTRACT: state.currentCanvasParentContract,
      CURRENT_CANVAS_PARENT_RECOGNIZED: state.currentCanvasParentRecognized,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: state.canvasSurfaceTruthProbeStatus,
      CANVAS_SURFACE_TRUTH_AVAILABLE: state.canvasSurfaceTruthAvailable,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_SELECTOR: state.canvasSelector,
      CANVAS_MOUNT_FOUND: state.canvasMountFound,
      CANVAS_MOUNT_SELECTOR: state.canvasMountSelector,
      CANVAS_IN_MOUNT: state.canvasInMount,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_COMPUTED_VISIBLE: state.canvasComputedVisible,
      CANVAS_VIEWPORT_INTERSECTING: state.canvasViewportIntersecting,
      CANVAS_CONTEXT_2D_READY: state.canvasContext2dReady,
      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: state.canvasPixelVisible,
      CANVAS_LAYER_BLOCKED: state.canvasLayerBlocked,
      CANVAS_LAYER_BLOCKER: state.canvasLayerBlocker,
      CANVAS_NAMESPACE_PRESENT: state.canvasNamespacePresent,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: state.canvasNamespaceMatchesDomSurface,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: state.canvasParentContractRecognized,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: state.canvasTruthFirstFailedCoordinate,
      CANVAS_TRUTH_FAILURE_CLASS: state.canvasTruthFailureClass,
      CANVAS_TRUTH_FAILURE_REASON: state.canvasTruthFailureReason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: state.canvasTruthRecommendedOwner,
      CANVAS_TRUTH_RECOMMENDED_FILE: state.canvasTruthRecommendedFile,
      CANVAS_TRUTH_RECOMMENDED_ACTION: state.canvasTruthRecommendedAction,

      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_FILE_LOADED: state.controlFileLoaded,
      CONTROL_GLOBAL_PRESENT: state.controlGlobalPresent,
      CONTROL_RECEIPT_PRESENT: state.controlReceiptPresent,
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,
      VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS: state.visiblePlanetAllowedWithoutControls,

      DELEGATORY_AUDIT_STATUS: state.delegatoryAuditStatus,
      DELEGATORY_AUDIT_COMPLETE_RELATIONSHIP_COUNT: state.delegatoryAuditCompleteRelationshipCount,
      DELEGATORY_AUDIT_TOTAL_RELATIONSHIP_COUNT: state.delegatoryAuditTotalRelationshipCount,
      DELEGATORY_AUDIT_FIRST_NOT_GRANTED_RELATIONSHIP: state.delegatoryAuditFirstNotGrantedRelationship,
      DELEGATORY_AUDIT_FIRST_VARIANCE_CLASS: state.delegatoryAuditFirstVarianceClass,
      DELEGATORY_AUDIT_FIRST_RECOMMENDED_FILE: state.delegatoryAuditFirstRecommendedFile,
      DELEGATORY_AUDIT_FIRST_RECOMMENDED_ACTION: state.delegatoryAuditFirstRecommendedAction,
      MOTION_PERMISSION_GRANTED: state.motionPermissionGranted,
      VISIBLE_SURFACE_PERMISSION_GRANTED: state.visibleSurfacePermissionGranted,
      ROUTE_CANVAS_PAIR_PERMISSION_GRANTED: state.pairPermissionGranted,
      CONSTRUCT_PERMISSION_GRANTED: state.constructPermissionGranted,
      HANDSHAKE_FRONTPORT_ONLY_COUNT: state.handshakeFrontOnlyCount,
      UNOBSERVED_ENDPOINT_RELATIONSHIP_COUNT: state.unobservedEndpointRelationshipCount,
      DELEGATORY_NODES: clonePlain(state.delegatoryNodes),
      DELEGATORY_RELATIONSHIPS: clonePlain(state.delegatoryRelationships),
      THREE_FILE_CONSTRUCT_STRATEGY: clonePlain(state.threeFileConstructStrategy),

      PRIMARY_CASE: state.primaryCase,
      CALIBRATION_STATUS: state.calibrationStatus,
      CALIBRATION_HOLD_REASON: state.calibrationHoldReason,
      DIAGNOSTIC_CHRONOLOGY_CLEAN: state.diagnosticChronologyClean,
      DIAGNOSTIC_RAIL_CLEAN: state.diagnosticRailClean,
      CALIBRATION_POINT_REACHED: state.calibrationPointReached,

      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS: state.diagnosticTrackNewsAlignmentStatus,
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_SCORE: state.diagnosticTrackNewsAlignmentScore,
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.diagnosticTrackNewsAlignmentFirstFailedStage,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS: state.diagnosticTrackFibonacciSynchronizationStatus,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_SCORE: state.diagnosticTrackFibonacciSynchronizationScore,
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.diagnosticTrackFibonacciSynchronizationFirstFailedStage,

      CANVAS_STANDARD_NEWS_ALIGNMENT_STATUS: state.canvasStandardNewsAlignmentStatus,
      CANVAS_STANDARD_NEWS_ALIGNMENT_SCORE: state.canvasStandardNewsAlignmentScore,
      CANVAS_STANDARD_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.canvasStandardNewsAlignmentFirstFailedStage,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_STATUS: state.canvasStandardFibonacciSynchronizationStatus,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_SCORE: state.canvasStandardFibonacciSynchronizationScore,
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.canvasStandardFibonacciSynchronizationFirstFailedStage,

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
      "SCRIPT_PRESENT_AUTHORITY_RECOVERY_ACTIVE",
      "F21_FAILURE_TAXONOMY_ACTIVE",
      "ROUTE_CANVAS_PERMISSION_GATE_PAIR_AUDIT_ACTIVE",
      "DELEGATORY_HANDSHAKE_MATRIX_ACTIVE",
      "MULTI_HANDSHAKE_VARIANCE_AUDIT_ACTIVE",
      "INTENDED_HANDOFF_VARIANCE_INCLUDED",
      "SINGLE_HANDSHAKE_GREEN_LIGHT_BLOCKED",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "CHRONOLOGY_COMPLETION_STATUS",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",
      "DELEGATORY_AUDIT_STATUS",
      "DELEGATORY_AUDIT_FIRST_NOT_GRANTED_RELATIONSHIP",
      "DELEGATORY_AUDIT_FIRST_VARIANCE_CLASS",
      "DELEGATORY_AUDIT_FIRST_RECOMMENDED_FILE",
      "DELEGATORY_AUDIT_FIRST_RECOMMENDED_ACTION",
      "MOTION_PERMISSION_GRANTED",
      "VISIBLE_SURFACE_PERMISSION_GRANTED",
      "ROUTE_CANVAS_PAIR_PERMISSION_GRANTED",
      "CONSTRUCT_PERMISSION_GRANTED",
      "HANDSHAKE_FRONTPORT_ONLY_COUNT",
      "UNOBSERVED_ENDPOINT_RELATIONSHIP_COUNT",
      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_ELEMENT_FOUND",
      "CANVAS_RECT_NONZERO",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_PIXEL_VISIBLE",
      "CONTROL_HANDSHAKE_STATUS",
      "MOTION_TOUCH_STATUS",
      "DRAG_STATUS",
      "VIEW_CONTROL_STATUS",
      "THREE_FILE_CONSTRUCT_STRATEGY",
      "DELEGATORY_RELATIONSHIPS",
      "DELEGATORY_NODES",
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
      line("DELEGATORY_AUDIT_STATUS", getValue(report, "DELEGATORY_AUDIT_STATUS", "UNKNOWN")),
      line("DELEGATORY_AUDIT_FIRST_NOT_GRANTED_RELATIONSHIP", getValue(report, "DELEGATORY_AUDIT_FIRST_NOT_GRANTED_RELATIONSHIP", "UNKNOWN")),
      line("DELEGATORY_AUDIT_FIRST_VARIANCE_CLASS", getValue(report, "DELEGATORY_AUDIT_FIRST_VARIANCE_CLASS", "UNKNOWN")),
      line("MOTION_PERMISSION_GRANTED", getValue(report, "MOTION_PERMISSION_GRANTED", "false")),
      line("VISIBLE_SURFACE_PERMISSION_GRANTED", getValue(report, "VISIBLE_SURFACE_PERMISSION_GRANTED", "false")),
      line("ROUTE_CANVAS_PAIR_PERMISSION_GRANTED", getValue(report, "ROUTE_CANVAS_PAIR_PERMISSION_GRANTED", "false")),
      line("CONSTRUCT_PERMISSION_GRANTED", getValue(report, "CONSTRUCT_PERMISSION_GRANTED", "false")),
      line("CANVAS_SURFACE_TRUTH_PROBE_STATUS", getValue(report, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "UNKNOWN")),
      line("CANVAS_ELEMENT_FOUND", getValue(report, "CANVAS_ELEMENT_FOUND", "UNKNOWN")),
      line("CONTROL_HANDSHAKE_STATUS", getValue(report, "CONTROL_HANDSHAKE_STATUS", "UNKNOWN")),
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
    root.HEARTH.diagnosticNorthDelegatoryHandshakeMatrix = api;

    root.DEXTER_LAB.hearthDiagnosticRail = api;
    root.DEXTER_LAB.hearthDiagnosticNorth = api;
    root.DEXTER_LAB.hearthDiagnosticNorthChronologyHub = api;
    root.DEXTER_LAB.hearthDiagnosticNorthCanvasSurfaceTruthChronologyHub = api;
    root.DEXTER_LAB.hearthDiagnosticNorthDelegatoryHandshakeMatrix = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;
    root.HEARTH_DIAGNOSTIC_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB = api;
    root.HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX_VERDICT = clonePlain(lastVerdict);

    root.HEARTH_DIAGNOSTIC_RAIL_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_DELEGATORY_HANDSHAKE_MATRIX_PACKET_TEXT = lastPacketText;

    return true;
  }

  async function runDiagnostic(options = {}) {
    const state = makeState();
    const targetContext = getTargetContext(options);

    state.targetContextStatus = targetContext.accessStatus;
    state.targetContextSource = targetContext.source;
    state.targetContextError = targetContext.accessError;
    state.diagnosticTargetAccessStatus = targetContext.accessStatus;
    state.diagnosticTargetAccessError = targetContext.accessError;

    try {
      for (const step of CHRONOLOGY_STEPS) {
        await processStep(state, step, targetContext, options);
        resolveAlignment(state);
        resolveChronologyDisposition(state);
      }

      runDelegatoryAudit(state, targetContext);
      resolveAlignment(state);
      resolveChronologyDisposition(state);

      if (state.delegatoryAuditStatus === "DELEGATORY_PERMISSION_MATRIX_PARTIAL") {
        state.diagnosticRailClean = "false";
        state.calibrationPointReached = "false";
        state.primaryCase = state.primaryCase === "DIAGNOSTIC_TRACK_AND_CANVAS_SURFACE_TRUTH_COMPLETE_NO_VISUAL_PASS_CLAIM"
          ? "DELEGATORY_HANDSHAKE_VARIANCE_REQUIRES_REVIEW"
          : state.primaryCase;
        state.calibrationStatus = "CALIBRATION_HOLD_DELEGATORY_PERMISSION_MATRIX";
        state.calibrationHoldReason = state.delegatoryAuditFirstVarianceClass;
        state.recommendedNextOwner = "DELEGATORY_MATRIX_FIRST_NOT_GRANTED";
        state.recommendedNextFile = state.delegatoryAuditFirstRecommendedFile;
        state.recommendedNextAction = state.delegatoryAuditFirstRecommendedAction;
      }

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
        delegatoryHandshakeMatrixActive: true,
        multiHandshakeVarianceAuditActive: true,
        intendedHandoffVarianceIncluded: true,
        singleHandshakeGreenLightBlocked: true,
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
      state.calibrationStatus = "CALIBRATION_NORTH_DELEGATORY_HANDSHAKE_MATRIX_TOP_LEVEL_ERROR";
      state.calibrationHoldReason = bounded(error && error.message ? error.message : error, 1000);
      state.diagnosticChronologyClean = "false";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.chronologyCompletionStatus = "NORTH_DELEGATORY_HANDSHAKE_MATRIX_TOP_LEVEL_ERROR";
      state.zoneOfInflictionOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.zoneOfInflictionFile = FILE;
      state.zoneOfInflictionClass = "NORTH_TOP_LEVEL_ERROR";
      state.zoneOfInflictionReason = state.calibrationHoldReason;
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_NORTH_TOP_LEVEL_ERROR_BEFORE_CHILD_RENEWAL";
      addNote(state, `NORTH_TOP_LEVEL_ERROR:${state.calibrationHoldReason}`);

      resolveAlignment(state);

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
      parentRole: "NORTH_DELEGATORY_HANDSHAKE_HANDOFF_VARIANCE_MATRIX_HUB",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
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
      scriptPresentAuthorityRecoveryActive: true,
      f21FailureTaxonomyActive: true,
      routeCanvasPermissionGatePairAuditActive: true,
      delegatoryHandshakeMatrixActive: true,
      multiHandshakeVarianceAuditActive: true,
      intendedHandoffVarianceIncluded: true,
      singleHandshakeGreenLightBlocked: true,
      canvasSurfaceTruthProbeExpected: true,
      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

      chronologyCompletionStatus: state.chronologyCompletionStatus,
      zoneOfInflictionOwner: state.zoneOfInflictionOwner,
      zoneOfInflictionFile: state.zoneOfInflictionFile,
      zoneOfInflictionClass: state.zoneOfInflictionClass,
      zoneOfInflictionReason: state.zoneOfInflictionReason,

      delegatoryAuditStatus: state.delegatoryAuditStatus,
      delegatoryAuditCompleteRelationshipCount: state.delegatoryAuditCompleteRelationshipCount,
      delegatoryAuditTotalRelationshipCount: state.delegatoryAuditTotalRelationshipCount,
      delegatoryAuditFirstNotGrantedRelationship: state.delegatoryAuditFirstNotGrantedRelationship,
      delegatoryAuditFirstVarianceClass: state.delegatoryAuditFirstVarianceClass,
      delegatoryAuditFirstRecommendedFile: state.delegatoryAuditFirstRecommendedFile,
      delegatoryAuditFirstRecommendedAction: state.delegatoryAuditFirstRecommendedAction,
      motionPermissionGranted: state.motionPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      pairPermissionGranted: state.pairPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      handshakeFrontOnlyCount: state.handshakeFrontOnlyCount,
      unobservedEndpointRelationshipCount: state.unobservedEndpointRelationshipCount,

      canvasSurfaceTruthProbeStatus: state.canvasSurfaceTruthProbeStatus,
      canvasSurfaceTruthAvailable: state.canvasSurfaceTruthAvailable,
      canvasElementFound: state.canvasElementFound,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasLayerBlocked: state.canvasLayerBlocked,

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
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

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
      delegatoryNodes: clonePlain((lastState || makeState()).delegatoryNodes),
      delegatoryRelationships: clonePlain((lastState || makeState()).delegatoryRelationships),
      threeFileConstructStrategy: clonePlain((lastState || makeState()).threeFileConstructStrategy),
      northVerdict: clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState())),
      reportObject: clonePlain(lastReport || buildReportObject(lastState || makeState())),

      supportsCanvasSurfaceTruthProbe: true,
      supportsNineStepChronology: true,
      supportsScriptPresentAuthorityRecovery: true,
      supportsF21FailureTaxonomy: true,
      supportsRouteCanvasPermissionGatePairAudit: true,
      supportsDelegatoryHandshakeMatrix: true,
      supportsMultiHandshakeVarianceAudit: true,
      supportsIntendedHandoffVariance: true,
      supportsSingleHandshakeGreenLightBlock: true,
      supportsConstructWidePermissionAudit: true,
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
    scriptPresentAuthorityRecoveryActive: true,
    f21FailureTaxonomyActive: true,
    routeCanvasPermissionGatePairAuditActive: true,
    delegatoryHandshakeMatrixActive: true,
    multiHandshakeVarianceAuditActive: true,
    intendedHandoffVarianceIncluded: true,
    singleHandshakeGreenLightBlocked: true,
    canvasSurfaceTruthProbeExpected: true,
    diagnosticRouteHtmlRenewalRequired: false,
    receiverStillCallsNorthOnly: true,

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
    nodeRegistry: NODE_REGISTRY,
    relationshipRegistry: RELATIONSHIP_REGISTRY,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedRouteConductorRenewalContract: EXPECTED_ROUTE_CONDUCTOR_RENEWAL_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedPointerFingerContract: EXPECTED_POINTER_FINGER_CONTRACT,

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

    supportsCanvasSurfaceTruthProbe: true,
    supportsNineStepChronology: true,
    supportsScriptPresentAuthorityRecovery: true,
    supportsF21FailureTaxonomy: true,
    supportsRouteCanvasPermissionGatePairAudit: true,
    supportsDelegatoryHandshakeMatrix: true,
    supportsMultiHandshakeVarianceAudit: true,
    supportsIntendedHandoffVariance: true,
    supportsSingleHandshakeGreenLightBlock: true,
    supportsConstructWidePermissionAudit: true,
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
