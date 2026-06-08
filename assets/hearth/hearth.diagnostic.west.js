// /assets/hearth/hearth.diagnostic.west.js
// HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1
// Full-file replacement.
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_TNT_v9
//
// Purpose:
// - Preserve the public WEST diagnostic rail contract expected by NORTH chronology.
// - Preserve WEST as rendered-target evidence authority only.
// - Upgrade WEST to strict runtime endpoint reading.
// - Separate primary endpoint contract proof from borrowed/nested/dataset contract text.
// - Prevent cross-authority contamination from being created by WEST evidence.
// - Read the real Hearth target document, not the diagnostic receiver document.
// - Track Route -> Controls -> Canvas -> Hex Surface -> Pointer Surface -> Canvas return.
// - Admit Pointer Surface as Bishop gate and Inspect as child organizer/priest only.
// - Preserve no production mutation, no runtime restart, no canvas repair, no lifecycle ignition,
//   no F13 claim, no F21 claim, no ready text, no final visual pass, no generated image,
//   no GraphicBox, and no WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_TNT_v9";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER_RECEIPT_v9";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_LABWEST_CHRONOLOGY_CYCLE_BRIDGE_OBSERVATORY_TNT_v8";
  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_BISHOP_QUEEN_CANVAS_RENDERED_PROOF_ALIGNMENT_TNT_v6";

  const VERSION =
    "2026-06-08.hearth-diagnostic-west-strict-runtime-endpoint-family-reader-v9";

  const FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const CURRENT_INDEX_CONTRACT =
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

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    CURRENT_HTML_CONTRACT,
    "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5",
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4",
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3"
  ]);

  const ACCEPTED_INDEX_CONTRACTS = Object.freeze([
    CURRENT_INDEX_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1",
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_TNT_v10_8",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const CONTROL_CONTRACTS = Object.freeze([
    EXPECTED_CONTROL_CONTRACT,
    EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
  ]);

  const CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const HEX_AUTHORITY_CONTRACTS = Object.freeze([
    EXPECTED_HEX_AUTHORITY_CONTRACT
  ]);

  const HEX_SURFACE_CONTRACTS = Object.freeze([
    EXPECTED_HEX_SURFACE_CONTRACT,
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION_TNT_v4_4",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_TNT_v4_3"
  ]);

  const POINTER_SURFACE_CONTRACTS = Object.freeze([
    EXPECTED_POINTER_SURFACE_CONTRACT,
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_GATE_TNT_v3",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_SOCKET_TNT_v2"
  ]);

  const POINTER_INSPECT_CONTRACTS = Object.freeze([
    EXPECTED_POINTER_INSPECT_CONTRACT,
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
  ]);

  const LABWEST_CONTRACTS = Object.freeze([
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2"
  ]);

  const TARGET_FRAME_SELECTORS = Object.freeze([
    "#hearthDiagnosticTargetFrame",
    "iframe[data-hearth-diagnostic-target-frame='true']",
    "iframe[data-hearth-target-frame='true']",
    "iframe[data-diagnostic-target-frame='true']",
    "iframe[src='/showroom/globe/hearth/']",
    "iframe[src*='/showroom/globe/hearth/']"
  ]);

  const STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-visible-globe-stage]",
    "[data-hearth-planet-engine-stage]",
    "[data-hearth-expression-stage]",
    "[data-hearth-canvas-stage]"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-expression-mount]",
    "[data-hearth-canvas-expression-mount]"
  ]);

  const FRAME_SELECTORS = Object.freeze([
    "#hearthCanvasRectLockFrame",
    "[data-hearth-canvas-rect-lock-frame]",
    "[data-hearth-canvas-frame]",
    "[data-hearth-visible-canvas-frame]"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-expression-mount] canvas",
    "canvas"
  ]);

  const EXPRESSION_SURFACE_SELECTORS = Object.freeze([
    "[data-hearth-expression-surface]",
    "[data-hearth-canvas-surface]",
    "[data-hearth-visible-planet='true']",
    "[data-hearth-visible-globe='true']",
    "[data-hearth-base-globe-carrier]",
    "[data-hearth-visible-globe-carrier]",
    "[data-hearth-surface-layer]",
    "[data-hearth-land-layer]",
    "[data-hearth-water-layer]",
    "[data-hearth-ocean-layer]",
    "[data-hearth-atmosphere-layer]",
    "svg[data-hearth-planet-svg]",
    "svg[data-hearth-visible-globe]"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByDiagnosticRail: false,
    f13ClaimedByProbeWest: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedByProbeWest: false,
    f21SubmittedToNorth: false,
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
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    syntheticActivationAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CANVAS_CLAIMED: false,
    F13_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F13_CLAIMED_BY_PROBE_WEST: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_PROBE_WEST: false,
    F21_SUBMITTED_TO_NORTH: false,
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
    RUNTIME_RESTART_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    MACRO_WEST_RELEASE_AUTHORIZED: false,
    SYNTHETIC_ACTIVATION_AUTHORIZED: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};
  let lastState = null;
  let lastEvidencePacket = null;

  const NODE_SPECS = Object.freeze([
    {
      id: "ROUTE_CONDUCTOR",
      role: "route-permission-and-active-scan-authority",
      file: ROUTE_CONDUCTOR_FILE,
      family: "HEARTH_ROUTE_CONDUCTOR",
      expectedContracts: ROUTE_CONDUCTOR_CONTRACTS,
      aliases: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH.routeConductor",
        "HEARTH.routeNorthBishop",
        "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
        "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
        "HEARTH.routeConductorHexGatePointerFingerTransmission",
        "HEARTH.routeConductorPassiveUiSafeManualScan",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteNorthBishop"
      ],
      datasetKeys: ["hearthRouteConductorContract", "hearthRouteContract"],
      endpointKeys: [
        "routeConductorContract",
        "currentRouteConductorContract",
        "primaryRouteConductorContract",
        "contract",
        "CONTRACT",
        "renewalContract",
        "internalRenewalContract",
        "implementationContract"
      ],
      receiptKeys: ["routeConductorReceipt", "receipt", "RECEIPT", "renewalReceipt"],
      internalKeys: ["renewalContract", "internalRenewalContract", "implementationContract"]
    },
    {
      id: "CONTROLS_QUEEN",
      role: "motion-input-and-view-control-gateway",
      file: CONTROL_FILE,
      family: "HEARTH_CONTROLS",
      expectedContracts: CONTROL_CONTRACTS,
      aliases: [
        "HEARTH_CONTROLS",
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH_QUEEN_CONTROLS",
        "HEARTH.controls",
        "HEARTH.planetaryControls",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.controlsPlanetaryViewInputHandshake",
        "DEXTER_LAB.hearthControls",
        "DEXTER_LAB.hearthQueenControls",
        "DEXTER_LAB.hearthPlanetaryControls"
      ],
      datasetKeys: ["hearthControlsContract", "hearthControlContract"],
      endpointKeys: [
        "controlContract",
        "controlsContract",
        "CONTROL_FILE_CONTRACT",
        "CONTROL_CONTRACT",
        "contract",
        "CONTRACT",
        "internalImplementationContract",
        "implementationContract"
      ],
      receiptKeys: ["controlReceipt", "controlsReceipt", "receipt", "RECEIPT", "internalImplementationReceipt"],
      internalKeys: [
        "internalImplementationContract",
        "implementationContract",
        "previousImplementationContract",
        "lineageImplementationContract"
      ]
    },
    {
      id: "CANVAS_RECEIVER",
      role: "canvas-public-receiver-and-visible-output-carrier",
      file: CANVAS_FILE,
      family: "HEARTH_CANVAS",
      expectedContracts: CANVAS_CONTRACTS,
      aliases: [
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_LOCAL_STATION",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH.canvas",
        "HEARTH.canvasHub",
        "HEARTH.canvasParent",
        "HEARTH.canvasLocalStation",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasFingerManager",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
        "HEARTH.canvasPlanetaryViewControlReceiver",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasLocalStation",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ],
      datasetKeys: ["hearthCanvasContract", "hearthCanvasParentContract"],
      endpointKeys: [
        "canvasContract",
        "currentCanvasParentContract",
        "canvasParentContract",
        "contract",
        "CONTRACT",
        "internalImplementationContract",
        "implementationContract"
      ],
      receiptKeys: ["canvasReceipt", "currentCanvasParentReceipt", "receipt", "RECEIPT", "internalImplementationReceipt"],
      internalKeys: [
        "internalImplementationContract",
        "implementationContract",
        "previousImplementationContract",
        "lineageImplementationContract"
      ]
    },
    {
      id: "HEX_AUTHORITY",
      role: "hex-four-pair-pixel-handshake-authority",
      file: HEX_AUTHORITY_FILE,
      family: "HEARTH_HEX_FOUR_PAIR",
      expectedContracts: HEX_AUTHORITY_CONTRACTS,
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority",
        "DEXTER_LAB.hearthHexAuthority"
      ],
      datasetKeys: ["hearthHexAuthorityContract", "hearthHexFourPairAuthorityContract"],
      endpointKeys: [
        "hearthHexFourPairAuthorityContract",
        "hexAuthorityContract",
        "hexFourPairAuthorityContract",
        "contract",
        "CONTRACT"
      ],
      receiptKeys: [
        "hearthHexFourPairAuthorityReceipt",
        "hexAuthorityReceipt",
        "receipt",
        "RECEIPT"
      ],
      internalKeys: ["internalImplementationContract", "implementationContract"]
    },
    {
      id: "HEX_SURFACE_GATE",
      role: "downstream-hex-surface-gate-before-pointer-surface",
      file: HEX_SURFACE_FILE,
      family: "HEARTH_HEX_SURFACE",
      expectedContracts: HEX_SURFACE_CONTRACTS,
      aliases: [
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_SURFACE_GATE",
        "HEARTH.hexSurface",
        "HEARTH.hexSurfaceGate",
        "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
        "DEXTER_LAB.hearthHexSurface",
        "DEXTER_LAB.hearthHexSurfaceGate"
      ],
      datasetKeys: ["hearthHexSurfaceContract"],
      endpointKeys: [
        "hearthHexSurfaceContract",
        "hexSurfaceContract",
        "contract",
        "CONTRACT",
        "internalImplementationContract",
        "implementationContract"
      ],
      receiptKeys: [
        "hearthHexSurfaceReceipt",
        "hexSurfaceReceipt",
        "receipt",
        "RECEIPT",
        "internalImplementationReceipt"
      ],
      internalKeys: [
        "internalImplementationContract",
        "implementationContract",
        "previousImplementationContract"
      ]
    },
    {
      id: "POINTER_SURFACE_BISHOP",
      role: "pointer-surface-bishop-gate-opening-child-expression-files",
      file: POINTER_SURFACE_FILE,
      family: "HEARTH_CANVAS_FINGER_SURFACE",
      expectedContracts: POINTER_SURFACE_CONTRACTS,
      aliases: [
        "HEARTH_CANVAS_FINGER_SURFACE",
        "HEARTH_POINTER_SURFACE_BISHOP",
        "HEARTH.canvasFingerSurface",
        "HEARTH.pointerSurfaceBishop",
        "HEARTH.canvasFingerSurfacePointer",
        "DEXTER_LAB.hearthCanvasFingerSurface",
        "DEXTER_LAB.hearthPointerSurfaceBishop"
      ],
      datasetKeys: [
        "hearthPointerSurfaceContract",
        "hearthCanvasFingerSurfaceContract",
        "hearthPointerFingerContract"
      ],
      endpointKeys: [
        "pointerSurfaceContract",
        "canvasFingerSurfaceContract",
        "surfacePointerContract",
        "contract",
        "CONTRACT",
        "internalImplementationContract",
        "implementationContract"
      ],
      receiptKeys: [
        "pointerSurfaceReceipt",
        "canvasFingerSurfaceReceipt",
        "surfacePointerReceipt",
        "receipt",
        "RECEIPT"
      ],
      internalKeys: [
        "internalImplementationContract",
        "implementationContract",
        "previousImplementationContract"
      ]
    },
    {
      id: "POINTER_INSPECT_PRIEST",
      role: "pointer-surface-child-organizer-and-proofreader-not-primary-chain-gate",
      file: POINTER_INSPECT_FILE,
      family: "HEARTH_CANVAS_FINGER_INSPECT",
      expectedContracts: POINTER_INSPECT_CONTRACTS,
      childOf: "POINTER_SURFACE_BISHOP",
      advisoryChild: true,
      aliases: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_POINTER_INSPECT_PRIEST",
        "HEARTH.canvasFingerInspect",
        "HEARTH.pointerInspectPriest",
        "HEARTH.pointerFinger",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthPointerInspectPriest"
      ],
      datasetKeys: [
        "hearthCanvasFingerInspectContract",
        "hearthPointerInspectContract"
      ],
      endpointKeys: [
        "pointerInspectContract",
        "canvasFingerInspectContract",
        "inspectContract",
        "contract",
        "CONTRACT",
        "internalImplementationContract",
        "implementationContract"
      ],
      receiptKeys: [
        "pointerInspectReceipt",
        "canvasFingerInspectReceipt",
        "inspectReceipt",
        "receipt",
        "RECEIPT"
      ],
      internalKeys: [
        "internalImplementationContract",
        "implementationContract",
        "previousImplementationContract"
      ]
    },
    {
      id: "LABWEST",
      role: "lab-west-admissibility-observatory-supporting-read-only-node",
      file: LABWEST_FILE,
      family: "LAB_RUNTIME_TABLE_CARDINAL_WEST",
      expectedContracts: LABWEST_CONTRACTS,
      aliases: [
        "LAB_RUNTIME_TABLE_WEST",
        "RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "LAB_RUNTIME_TABLE_CARDINAL_WEST",
        "HEARTH_RUNTIME_TABLE_WEST",
        "HEARTH_WEST_ADMISSIBILITY",
        "HEARTH_MACRO_WEST_AUTHORITY",
        "LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
        "HEARTH_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
        "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
        "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
        "HEARTH.runtimeTableWest",
        "HEARTH.westRuntimeTable",
        "HEARTH.westAdmissibility",
        "HEARTH.macroWestAuthority",
        "HEARTH.westCanvasV123PointerSurfaceBishopReleaseBridge",
        "HEARTH.westBishopChordCanvasReleaseBridge",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.hearthRuntimeTableWest",
        "DEXTER_LAB.westAdmissibility",
        "DEXTER_LAB.hearthWestCanvasV123PointerSurfaceBishopReleaseBridge"
      ],
      datasetKeys: ["hearthLabWestContract", "hearthRuntimeTableWestContract"],
      endpointKeys: [
        "labWestContract",
        "westContract",
        "contract",
        "CONTRACT",
        "implementationContract"
      ],
      receiptKeys: [
        "labWestReceipt",
        "westReceipt",
        "receipt",
        "RECEIPT",
        "implementationReceipt"
      ],
      internalKeys: ["implementationContract", "internalImplementationContract"]
    }
  ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function text(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value).replace(/\s+/g, " ").trim();
  }

  function bounded(value, limit = 2000) {
    return text(value).slice(0, limit);
  }

  function toBool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
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

  function readPath(base, path) {
    try {
      const parts = String(path || "").split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function setPath(path, value) {
    try {
      const parts = String(path || "").split(".");
      let cursor = root;

      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index];
        if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
        cursor = cursor[part];
      }

      cursor[parts[parts.length - 1]] = value;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function qFirst(context, selectors) {
    for (const selector of selectors || []) {
      const found = q(context, selector);
      if (found) return found;
    }
    return null;
  }

  function dataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function bodyDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.body
        ? targetDocument.body.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function getCase(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys || []) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];

      const lower = String(key).toLowerCase();
      for (const candidate of Object.keys(source)) {
        if (candidate.toLowerCase() !== lower) continue;
        const value = source[candidate];
        if (value !== undefined && value !== null && value !== "") return value;
      }
    }

    return fallback;
  }

  function addNote(state, note) {
    const n = bounded(note, 1400);
    if (!n || !state || !Array.isArray(state.notes)) return;
    if (!state.notes.includes(n)) state.notes.push(n);
  }

  function familyMatches(contract, family) {
    const c = text(contract);
    const f = text(family);
    if (!c || !f) return false;
    return c === f || c.startsWith(`${f}_`);
  }

  function contractRecognized(contract, spec) {
    const c = text(contract);
    if (!c || !spec) return false;
    if ((spec.expectedContracts || []).includes(c)) return true;
    return familyMatches(c, spec.family);
  }

  function normalizeSrc(rawSrc, targetWindow) {
    const raw = text(rawSrc);
    if (!raw) return "";

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(raw, origin);
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return raw;
    }
  }

  function cacheKeyFromSrc(rawSrc, targetWindow) {
    const raw = text(rawSrc);

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(raw, origin);
      return url.searchParams.get("v") || url.searchParams.get("cache") || url.searchParams.get("version") || "";
    } catch (_error) {
      const match = raw.match(/[?&](?:v|cache|version)=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
  }

  function scriptInfo(targetDocument, targetWindow, filePath) {
    const scripts = qa(targetDocument, "script[src]");
    const fileName = String(filePath || "").split("/").filter(Boolean).pop();

    const found = scripts.find((script) => {
      const src = normalizeSrc(script.getAttribute("src"), targetWindow);
      return src.includes(filePath) || (fileName && src.includes(`/${fileName}`));
    });

    if (!found) {
      return {
        present: false,
        src: "NOT_FOUND",
        cacheKey: ""
      };
    }

    const rawSrc = found.getAttribute("src") || "";

    return {
      present: true,
      src: normalizeSrc(rawSrc, targetWindow),
      cacheKey: cacheKeyFromSrc(rawSrc, targetWindow)
    };
  }

  function safeCallReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getWestReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getControlReceipt",
      "getControlsReceipt",
      "getControlSummary",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getRouteCycleReceipt",
      "getRoutePrimaryGateReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.version
    ) {
      return authority;
    }

    return {};
  }

  function collectContractStrings(value, limit = 80, depth = 0, output = []) {
    if (output.length >= limit || depth > 5 || value === undefined || value === null) return output;

    if (typeof value === "string") {
      const v = text(value);
      if (/_TNT_|_RECEIPT/i.test(v) && !output.includes(v)) output.push(v);
      return output;
    }

    if (Array.isArray(value)) {
      for (const item of value) collectContractStrings(item, limit, depth + 1, output);
      return output;
    }

    if (isObject(value)) {
      for (const key of Object.keys(value)) {
        if (output.length >= limit) break;
        collectContractStrings(value[key], limit, depth + 1, output);
      }
    }

    return output;
  }

  function pickContractFromKeys(source, keys, spec) {
    if (!isObject(source)) {
      return { value: "", key: "NONE", familyMatch: false, recognized: false };
    }

    for (const key of keys || []) {
      const raw = getCase(source, [key], "");
      const value = text(raw);

      if (!value || !/_TNT_/i.test(value)) continue;

      if (familyMatches(value, spec.family)) {
        return {
          value,
          key,
          familyMatch: true,
          recognized: contractRecognized(value, spec)
        };
      }
    }

    for (const key of keys || []) {
      const raw = getCase(source, [key], "");
      const value = text(raw);

      if (!value || !/_TNT_/i.test(value)) continue;

      return {
        value,
        key,
        familyMatch: false,
        recognized: false
      };
    }

    return { value: "", key: "NONE", familyMatch: false, recognized: false };
  }

  function pickReceiptName(source, keys) {
    if (!isObject(source)) return "";
    for (const key of keys || []) {
      const value = text(getCase(source, [key], ""));
      if (value && /_RECEIPT/i.test(value)) return value;
    }
    return "";
  }

  function buildDatasetAdvisory(spec, targetDocument) {
    const ds = dataset(targetDocument);
    const bds = bodyDataset(targetDocument);

    for (const key of spec.datasetKeys || []) {
      const value = text(firstDefined(ds[key], bds[key]), "");
      if (value) return value;
    }

    return "UNKNOWN";
  }

  function buildAuthorityCandidates(spec, targetWindow) {
    const contexts = [];

    if (targetWindow) contexts.push(["TARGET", targetWindow]);
    contexts.push(["DIAGNOSTIC", root]);

    const candidates = [];

    for (const [contextLabel, context] of contexts) {
      for (const alias of spec.aliases || []) {
        const authority = readPath(context, alias);
        if (!authority || !isObject(authority)) continue;

        const receipt = safeCallReceipt(authority);
        const endpointPick = pickContractFromKeys(receipt, spec.endpointKeys, spec);
        const authorityEndpointPick = pickContractFromKeys(authority, spec.endpointKeys, spec);
        const internalPick = pickContractFromKeys(receipt, spec.internalKeys, spec);
        const receiptName = pickReceiptName(receipt, spec.receiptKeys) || pickReceiptName(authority, spec.receiptKeys);

        const primaryPick =
          endpointPick.familyMatch
            ? endpointPick
            : authorityEndpointPick.familyMatch
              ? authorityEndpointPick
              : endpointPick.value
                ? endpointPick
                : authorityEndpointPick.value
                  ? authorityEndpointPick
                  : internalPick;

        const allContracts = collectContractStrings([receipt, authority], 100);
        const borrowedContracts = allContracts.filter((contract) => !familyMatches(contract, spec.family));
        const familyContracts = allContracts.filter((contract) => familyMatches(contract, spec.family));

        const aliasFamilyMatches = true;
        const contractFamilyMatches = Boolean(primaryPick.familyMatch);
        const recognized = Boolean(primaryPick.recognized);

        let score = 0;
        if (contextLabel === "TARGET") score += 20;
        if (aliasFamilyMatches) score += 10;
        if (contractFamilyMatches) score += 30;
        if (recognized) score += 20;
        if (familyContracts.length > 0) score += 5;
        if (borrowedContracts.length > 0) score -= 3;

        candidates.push({
          contextLabel,
          alias,
          selectedAliasFullPath: `${contextLabel}:${alias}`,
          authority,
          receipt,
          receiptName,
          primaryEndpointContract: primaryPick.value || "UNKNOWN",
          primaryEndpointContractSourceKey: primaryPick.key || "NONE",
          internalImplementationContract: internalPick.familyMatch ? internalPick.value : "UNKNOWN",
          allContracts,
          borrowedContracts,
          nestedDownstreamObservedContract: borrowedContracts[0] || "NONE",
          aliasFamilyMatches,
          contractFamilyMatches,
          contractRecognized: recognized,
          score
        });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  function readStrictNode(spec, targetDocument, targetWindow) {
    const script = scriptInfo(targetDocument, targetWindow, spec.file);
    const datasetAdvisory = buildDatasetAdvisory(spec, targetDocument);
    const candidates = buildAuthorityCandidates(spec, targetWindow);
    const selected = candidates[0] || null;

    const authorityPresent = Boolean(selected && selected.authority);
    const scriptPresent = Boolean(script.present);
    const selectedPrimary = selected ? selected.primaryEndpointContract : "UNKNOWN";
    const selectedReceipt = selected ? selected.receiptName || "UNKNOWN" : "UNKNOWN";
    const cacheKeyContract = text(script.cacheKey, "");

    const cacheKeyFamilyMatch = familyMatches(cacheKeyContract, spec.family);
    const cacheKeyRecognized = cacheKeyContract ? contractRecognized(cacheKeyContract, spec) : false;

    const primaryEndpointContract =
      selected && selected.contractFamilyMatches
        ? selectedPrimary
        : cacheKeyFamilyMatch
          ? cacheKeyContract
          : "UNKNOWN";

    const primaryEndpointContractSource =
      selected && selected.contractFamilyMatches
        ? selected.primaryEndpointContractSourceKey
        : cacheKeyFamilyMatch
          ? "SCRIPT_CACHE_KEY"
          : "NONE";

    const contractFamilyMatches = familyMatches(primaryEndpointContract, spec.family);
    const contractRecognizedValue =
      contractFamilyMatches && (contractRecognized(primaryEndpointContract, spec) || cacheKeyRecognized);

    const strictObserved = Boolean(
      authorityPresent &&
      scriptPresent &&
      selected &&
      selected.aliasFamilyMatches &&
      contractFamilyMatches &&
      contractRecognizedValue
    );

    const borrowedContracts = selected ? selected.borrowedContracts.slice(0, 16) : [];
    const foreignAuthorityContract =
      selected && selected.primaryEndpointContract !== "UNKNOWN" && !selected.contractFamilyMatches
        ? selected.primaryEndpointContract
        : "NONE";

    const crossAuthorityContamination = Boolean(
      authorityPresent &&
      !strictObserved &&
      (
        foreignAuthorityContract !== "NONE" ||
        (borrowedContracts.length > 0 && !contractFamilyMatches)
      )
    );

    const nodeStatus =
      strictObserved
        ? "STRICT_RUNTIME_ENDPOINT_CONFIRMED"
        : crossAuthorityContamination
          ? "CROSS_AUTHORITY_CONTAMINATION"
          : authorityPresent && !scriptPresent
            ? "AUTHORITY_OBSERVED_SCRIPT_NOT_PRESENT"
            : scriptPresent && !authorityPresent
              ? "SCRIPT_PRESENT_AUTHORITY_NOT_OBSERVED"
              : authorityPresent
                ? "AUTHORITY_OBSERVED_ENDPOINT_CONTRACT_NOT_STRICTLY_CONFIRMED"
                : "NOT_OBSERVED";

    const integrityClass =
      strictObserved
        ? "STRICT_ENDPOINT_CONFIRMED"
        : crossAuthorityContamination
          ? "CONTRACT_FAMILY_MISMATCH"
          : scriptPresent && !authorityPresent
            ? "AUTHORITY_NOT_OBSERVED"
            : authorityPresent && !contractFamilyMatches
              ? "ENDPOINT_CONTRACT_NOT_CONFIRMED"
              : "FILE_NOT_OBSERVED";

    return {
      id: spec.id,
      role: spec.role,
      file: spec.file,
      family: spec.family,
      expectedContracts: (spec.expectedContracts || []).slice(),
      childOf: spec.childOf || "NONE",
      advisoryChild: Boolean(spec.advisoryChild),
      strictObserved,
      observed: Boolean(strictObserved || authorityPresent || scriptPresent),
      authorityPresent,
      scriptPresent,
      scriptCount: scriptPresent ? 1 : 0,
      scriptTargetPresent: scriptPresent,
      scriptTargetSrc: script.src || "NOT_FOUND",
      scriptTargetCacheKey: cacheKeyContract || "NONE",
      scriptDiagnosticPresent: false,
      scriptDiagnosticSrc: "NOT_FOUND",
      scriptDiagnosticCacheKey: "NONE",
      selectedAliasPath: selected ? selected.alias : "NONE",
      selectedAliasFullPath: selected ? selected.selectedAliasFullPath : "NONE",
      contextLabel: selected ? selected.contextLabel : "NONE",
      aliasFamilyMatches: selected ? selected.aliasFamilyMatches : false,
      primaryEndpointContract,
      primaryEndpointContractSource,
      primaryEndpointReceipt: selectedReceipt,
      contract: primaryEndpointContract,
      receipt: selectedReceipt,
      internalImplementationContract: selected ? selected.internalImplementationContract : "UNKNOWN",
      datasetAdvisoryContract: datasetAdvisory,
      datasetIsAdvisoryOnly: true,
      datasetDoesNotProveEndpoint: true,
      borrowedObservedContract: foreignAuthorityContract,
      nestedDownstreamObservedContract: selected ? selected.nestedDownstreamObservedContract : "NONE",
      borrowedObservedContracts: borrowedContracts,
      contractRecognized: contractRecognizedValue,
      contractFamilyMatches,
      nodeStatus,
      integrityClass,
      crossAuthorityContamination,
      contaminationReason: crossAuthorityContamination
        ? `AUTHORITY_CONTRACT_DOES_NOT_MATCH_NODE_FAMILY:${foreignAuthorityContract !== "NONE" ? foreignAuthorityContract : borrowedContracts[0]}`
        : "NONE",
      publicMethodCount: selected && selected.authority
        ? Object.keys(selected.authority).filter((key) => isFunction(selected.authority[key])).length
        : 0,
      publicMethods: selected && selected.authority
        ? Object.keys(selected.authority).filter((key) => isFunction(selected.authority[key])).sort()
        : [],
      receiptObject: selected ? clonePlain(selected.receipt) : {},
      authorityText: selected
        ? bounded(JSON.stringify(selected.receipt || {}).slice(0, 8000), 8000)
        : "",
      dark: !strictObserved,
      ...NO_CLAIMS
    };
  }

  function pathMatches(targetWindow, route) {
    try {
      const path = targetWindow && targetWindow.location ? targetWindow.location.pathname : "";
      const normal = String(route || "").replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
    }
  }

  function documentIsDiagnostic(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const ds = dataset(targetDocument);
      const html = targetDocument.documentElement;
      const route = text(firstDefined(ds.route, html.getAttribute("data-route")), "");
      const page = text(firstDefined(ds.page, html.getAttribute("data-page")), "");
      const contract = text(firstDefined(ds.contract, html.getAttribute("data-contract")), "");

      return Boolean(
        pathMatches(targetWindow, DIAGNOSTIC_ROUTE) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /diagnostic/i.test(page) ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract)
      );
    } catch (_error) {
      return false;
    }
  }

  function documentLooksLikeHearth(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (documentIsDiagnostic(targetDocument, targetWindow)) return false;

      const ds = dataset(targetDocument);
      const bds = bodyDataset(targetDocument);
      const html = targetDocument.documentElement;
      const body = targetDocument.body;

      const route = text(firstDefined(ds.route, bds.route, html.getAttribute("data-route"), body && body.getAttribute("data-route")), "");
      const page = text(firstDefined(ds.page, html.getAttribute("data-page")), "");
      const alias = text(firstDefined(ds.pageAlias, html.getAttribute("data-page-alias")), "");
      const context = text(firstDefined(ds.pageContext, html.getAttribute("data-page-context")), "");

      return Boolean(
        pathMatches(targetWindow, TARGET_ROUTE) ||
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet engine|visible globe|canvas expression|mirrorland formation/i.test(context) ||
        qFirst(targetDocument, STAGE_SELECTORS) ||
        qFirst(targetDocument, MOUNT_SELECTORS) ||
        qFirst(targetDocument, CANVAS_SELECTORS) ||
        qFirst(targetDocument, EXPRESSION_SURFACE_SELECTORS)
      );
    } catch (_error) {
      return false;
    }
  }

  function readFrame(frame, state) {
    try {
      if (!frame || !frame.contentWindow) return null;

      const targetWindow = frame.contentWindow;
      const targetDocument = targetWindow.document;

      if (!targetDocument || !targetDocument.documentElement) {
        addNote(state, "WEST_TARGET_FRAME_DOCUMENT_INACCESSIBLE");
        return null;
      }

      if (!documentLooksLikeHearth(targetDocument, targetWindow)) {
        addNote(state, "WEST_TARGET_FRAME_REJECTED_NOT_HEARTH_TARGET");
        return null;
      }

      return {
        targetDocument,
        targetWindow,
        frameElement: frame,
        source: "FRAME"
      };
    } catch (error) {
      addNote(state, `WEST_TARGET_FRAME_BLOCKED:${bounded(error && error.message ? error.message : error, 1000)}`);
      return null;
    }
  }

  function findTargetFrame(sourceDocument, state) {
    if (!sourceDocument) return null;

    for (const selector of TARGET_FRAME_SELECTORS) {
      const frame = q(sourceDocument, selector);
      if (!frame) continue;

      const target = readFrame(frame, state);
      if (target) {
        target.source = `FRAME_SELECTOR:${selector}`;
        return target;
      }
    }

    const frames = qa(sourceDocument, "iframe");

    for (const frame of frames) {
      const src = normalizeSrc(frame.getAttribute("src") || "", root);
      if (!src.includes("/showroom/globe/hearth/")) continue;

      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_SRC_SCAN";
        return target;
      }
    }

    for (const frame of frames) {
      const target = readFrame(frame, state);
      if (target) {
        target.source = "FRAME_HEARTH_SIGNAL_SCAN";
        return target;
      }
    }

    return null;
  }

  function resolveTarget(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetDocument = opts.targetDocument;
      const targetWindow = opts.targetWindow || targetDocument.defaultView || null;

      if (documentLooksLikeHearth(targetDocument, targetWindow)) {
        return {
          targetDocument,
          targetWindow,
          frameElement: opts.frameElement || null,
          source: "OPTIONS_TARGET_DOCUMENT"
        };
      }

      addNote(state, "WEST_OPTIONS_TARGET_DOCUMENT_REJECTED");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && documentLooksLikeHearth(targetDocument, targetWindow)) {
          return {
            targetDocument,
            targetWindow,
            frameElement: opts.frameElement || null,
            source: "OPTIONS_TARGET_WINDOW"
          };
        }

        addNote(state, "WEST_OPTIONS_TARGET_WINDOW_REJECTED");
      } catch (error) {
        addNote(state, `WEST_OPTIONS_TARGET_WINDOW_BLOCKED:${bounded(error && error.message ? error.message : error, 1000)}`);
      }
    }

    if (opts.frameElement) {
      const target = readFrame(opts.frameElement, state);
      if (target) {
        target.source = "OPTIONS_FRAME_ELEMENT";
        return target;
      }
    }

    const currentDocument = root.document || null;

    if (currentDocument && currentDocument.documentElement && documentLooksLikeHearth(currentDocument, root)) {
      return {
        targetDocument: currentDocument,
        targetWindow: root,
        frameElement: null,
        source: "CURRENT_HEARTH_DOCUMENT"
      };
    }

    const frameTarget = findTargetFrame(currentDocument, state);
    if (frameTarget) return frameTarget;

    return {
      targetDocument: null,
      targetWindow: null,
      frameElement: null,
      source: "NONE"
    };
  }

  function rectPacket(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return "NOT_FOUND";
      const rect = el.getBoundingClientRect();

      return [
        `left:${Math.round(rect.left)}`,
        `top:${Math.round(rect.top)}`,
        `right:${Math.round(rect.right)}`,
        `bottom:${Math.round(rect.bottom)}`,
        `width:${Math.round(rect.width)}`,
        `height:${Math.round(rect.height)}`
      ].join(";");
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function rectNonZero(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;
      const rect = el.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function sizeNonZero(el) {
    try {
      if (!el) return false;
      return Boolean(
        rectNonZero(el) ||
        Number(el.offsetWidth || 0) > 0 ||
        Number(el.offsetHeight || 0) > 0 ||
        Number(el.clientWidth || 0) > 0 ||
        Number(el.clientHeight || 0) > 0
      );
    } catch (_error) {
      return false;
    }
  }

  function viewportIntersecting(el, targetWindow) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;

      const win = targetWindow || root;
      const rect = el.getBoundingClientRect();
      const width = Number(win.innerWidth || 0);
      const height = Number(win.innerHeight || 0);

      return Boolean(
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < width &&
        rect.top < height
      );
    } catch (_error) {
      return false;
    }
  }

  function selectorName(el) {
    try {
      if (!el) return "NOT_FOUND";
      const tag = el.tagName ? el.tagName.toLowerCase() : "node";
      if (el.id) return `${tag}#${el.id}`;
      const attrs = [
        "data-hearth-globe-stage",
        "data-hearth-canvas-mount",
        "data-hearth-canvas-rect-lock-frame",
        "data-hearth-expression-surface",
        "data-hearth-canvas-surface",
        "data-hearth-visible-canvas",
        "data-hearth-canvas",
        "data-hearth-canvas-texture",
        "data-hearth-visible-planet",
        "data-hearth-visible-globe"
      ];

      for (const attr of attrs) {
        if (el.hasAttribute && el.hasAttribute(attr)) return `${tag}[${attr}]`;
      }

      return tag;
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function readPixelSample(canvas, state) {
    if (!canvas) {
      state.canvasPixelSampleStatus = "NO_CANVAS_ELEMENT";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "false";
      state.canvasPixelNonEmpty = "false";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      return;
    }

    const w = Number(canvas.width || 0);
    const h = Number(canvas.height || 0);

    if (!(w > 0 && h > 0)) {
      state.canvasPixelSampleStatus = "CANVAS_ZERO_ATTRIBUTE_SIZE";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "false";
      state.canvasPixelNonEmpty = "false";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_ZERO_SIZE";
      return;
    }

    if (!isFunction(canvas.getContext)) {
      state.canvasPixelSampleStatus = "CANVAS_GET_CONTEXT_UNAVAILABLE";
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "UNKNOWN";
      state.canvasPixelNonEmpty = "UNKNOWN";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_NO_CONTEXT";
      return;
    }

    try {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || !isFunction(ctx.getImageData)) {
        state.canvasPixelSampleStatus = "CANVAS_2D_CONTEXT_UNAVAILABLE";
        state.canvasPixelSampleReadable = "false";
        state.canvasPixelVisible = "UNKNOWN";
        state.canvasPixelNonEmpty = "UNKNOWN";
        state.canvasPixelUniqueColorCount = "0";
        state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNAVAILABLE_NO_2D_CONTEXT";
        return;
      }

      const cols = Math.max(1, Math.min(10, Math.floor(w)));
      const rows = Math.max(1, Math.min(10, Math.floor(h)));
      const colors = new Set();
      let alphaCount = 0;
      let total = 0;
      let minLum = 255;
      let maxLum = 0;

      for (let yy = 0; yy < rows; yy += 1) {
        for (let xx = 0; xx < cols; xx += 1) {
          const x = Math.max(0, Math.min(w - 1, Math.round((xx + 0.5) * w / cols)));
          const y = Math.max(0, Math.min(h - 1, Math.round((yy + 0.5) * h / rows)));
          const data = ctx.getImageData(x, y, 1, 1).data;

          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;

          total += 1;
          if (a > 0) alphaCount += 1;
          colors.add(`${r >> 4},${g >> 4},${b >> 4},${a > 0 ? 1 : 0}`);

          const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
          minLum = Math.min(minLum, lum);
          maxLum = Math.max(maxLum, lum);
        }
      }

      const range = Math.max(0, maxLum - minLum);
      const visible = alphaCount > 0 && colors.size >= 2;

      state.canvasPixelSampleStatus = "PIXEL_SAMPLE_READ";
      state.canvasPixelSampleReadable = "true";
      state.canvasPixelVisible = boolText(visible);
      state.canvasPixelNonEmpty = boolText(alphaCount > 0);
      state.canvasPixelUniqueColorCount = String(colors.size);
      state.canvasPixelLuminanceRange = String(range);
      state.canvasPixelVarianceStatus =
        alphaCount > 0 && colors.size >= 4 && range >= 8
          ? "PIXEL_VARIANCE_PRESENT"
          : alphaCount > 0
            ? "PIXEL_NONEMPTY_LOW_VARIANCE"
            : "PIXEL_EMPTY_OR_TRANSPARENT";

      if (visible) addNote(state, "CANVAS_PIXEL_VISIBLE_BY_WEST_SAMPLE");
      if (state.canvasPixelVarianceStatus === "PIXEL_EMPTY_OR_TRANSPARENT") {
        addNote(state, "CANVAS_PIXEL_SAMPLE_BLANK_OR_TRANSPARENT");
      }
    } catch (error) {
      state.canvasPixelSampleStatus = `PIXEL_SAMPLE_BLOCKED:${bounded(error && error.message ? error.message : error, 900)}`;
      state.canvasPixelSampleReadable = "false";
      state.canvasPixelVisible = "UNKNOWN";
      state.canvasPixelNonEmpty = "UNKNOWN";
      state.canvasPixelUniqueColorCount = "0";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNREADABLE_NON_CONTROLLING";
      addNote(state, "CANVAS_PIXEL_SAMPLE_UNREADABLE_NON_CONTROLLING");
    }
  }

  function makeState() {
    return {
      westStatus: "READY",
      westRenderedReadComplete: "false",
      westRenderedReadStatus: "WAITING_RUN",
      diagnosticTargetAccessStatus: "UNKNOWN",
      diagnosticTargetAccessError: "UNKNOWN",
      targetSource: "UNKNOWN",
      hearthTargetConfirmed: false,

      renderedHtmlContract: "UNKNOWN",
      renderedHtmlContractRecognized: "UNKNOWN",
      renderedIndexScriptPresent: "UNKNOWN",
      renderedIndexScriptSrc: "UNKNOWN",
      renderedIndexContract: "UNKNOWN",
      renderedIndexContractRecognized: "UNKNOWN",

      runtimeNodes: [],
      runtimeRelationships: [],
      runtimeDarkFiles: [],
      strictRuntimeMapClean: false,
      strictRuntimeEndpointConfirmedCount: 0,
      strictRuntimeEndpointTotalCount: 0,
      strictRelationshipCleanCount: 0,
      strictRelationshipTotalCount: 0,
      crossAuthorityContaminationCount: 0,
      firstCrossAuthorityContaminationOwner: "NONE",
      firstCrossAuthorityContaminationFile: "NONE",
      firstCrossAuthorityContaminationClass: "NONE",
      firstCrossAuthorityContaminationReason: "NONE",

      routeNode: null,
      controlsNode: null,
      canvasNode: null,
      hexAuthorityNode: null,
      hexSurfaceNode: null,
      pointerSurfaceNode: null,
      pointerInspectNode: null,
      labWestNode: null,

      labWestReadMethod: "NONE",
      labWestDecision: "UNKNOWN",
      labWestGapClass: "UNKNOWN",
      labWestNorthC2Aligned: "UNKNOWN",
      labWestCycleRoute: "UNKNOWN",
      labWestCycleTwoSouthOutputAdmissible: "UNKNOWN",
      labWestBishopChordAdmissible: "UNKNOWN",
      labWestPreReleaseCarrierAdmissible: "UNKNOWN",
      labWestCanvasReleaseApproved: "UNKNOWN",
      labWestReleasePacketReady: "UNKNOWN",
      labWestRecommendedNextFile: "UNKNOWN",
      labWestPostgameStatus: "UNKNOWN",
      labWestDiagnosticTrackConnectionStatus: "UNKNOWN",

      planetStagePresent: "UNKNOWN",
      planetStageSelector: "UNKNOWN",
      planetStageRect: "UNKNOWN",
      planetStageRectNonzero: "UNKNOWN",
      canvasMountPresent: "UNKNOWN",
      canvasMountSelector: "UNKNOWN",
      canvasMountRect: "UNKNOWN",
      canvasMountRectNonzero: "UNKNOWN",
      canvasFramePresent: "UNKNOWN",
      canvasFrameSelector: "UNKNOWN",
      canvasFrameRect: "UNKNOWN",
      canvasFrameRectNonzero: "UNKNOWN",
      canvasElementPresent: "UNKNOWN",
      canvasElementFound: "UNKNOWN",
      canvasElementSelector: "UNKNOWN",
      canvasRect: "UNKNOWN",
      canvasRectNonzero: "UNKNOWN",
      canvasInMount: "UNKNOWN",
      canvasInFrame: "UNKNOWN",
      canvasComputedVisible: "UNKNOWN",
      canvasViewportIntersecting: "UNKNOWN",
      canvasContext2dReady: "UNKNOWN",
      expressionSurfacePresent: "UNKNOWN",
      expressionSurfaceSelector: "UNKNOWN",
      expressionSurfaceRect: "UNKNOWN",
      expressionSurfaceRectNonzero: "UNKNOWN",

      canvasPixelSampleStatus: "UNKNOWN",
      canvasPixelSampleReadable: "UNKNOWN",
      canvasPixelVisible: "UNKNOWN",
      canvasPixelNonEmpty: "UNKNOWN",
      canvasPixelUniqueColorCount: "0",
      canvasPixelLuminanceRange: "UNKNOWN",
      canvasPixelVarianceStatus: "UNKNOWN",

      canvasSurfaceTruthStatus: "UNKNOWN",
      canvasSurfaceTruthAvailable: "UNKNOWN",
      canvasSurfaceTruthFirstFailedCoordinate: "UNKNOWN",
      canvasSurfaceTruthFailureClass: "UNKNOWN",
      canvasSurfaceTruthFailureReason: "UNKNOWN",
      canvasSurfaceTruthRecommendedOwner: "UNKNOWN",
      canvasSurfaceTruthRecommendedFile: "UNKNOWN",
      canvasSurfaceTruthRecommendedAction: "UNKNOWN",

      renderedPlanetProofReady: "UNKNOWN",
      renderedPlanetProofInspected: "UNKNOWN",
      renderedPlanetProofFullyInspected: "UNKNOWN",
      visiblePlanetProofReady: "UNKNOWN",
      visiblePlanetProofSource: "UNKNOWN",
      westRenderedProofSpreadComplete: "UNKNOWN",
      canvasExpressionSurfaceReady: "UNKNOWN",
      canvasExpressionRichnessReady: "UNKNOWN",
      canvasExpressionProofStatus: "UNKNOWN",
      canvasExpressionBottleneckClass: "UNKNOWN",

      productionCycleObserved: "false",
      productionCycleStatus: "UNKNOWN",
      productionCycleFirstGap: "UNKNOWN",
      threeFileConstructStrategy: {},

      diagnosticTrackNewsAlignmentStatus: "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_COMPLETE",
      diagnosticTrackNewsAlignmentScore: "100",
      diagnosticTrackNewsAlignmentFirstFailedStage: "NONE",
      diagnosticTrackFibonacciSynchronizationStatus: "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_COMPLETE",
      diagnosticTrackFibonacciSynchronizationScore: "100",
      diagnosticTrackFibonacciSynchronizationFirstFailedStage: "NONE",
      canvasStandardNewsAlignmentStatus: "UNKNOWN",
      canvasStandardNewsAlignmentScore: "0",
      canvasStandardNewsAlignmentFirstFailedStage: "UNKNOWN",
      canvasStandardFibonacciSynchronizationStatus: "UNKNOWN",
      canvasStandardFibonacciSynchronizationScore: "0",
      canvasStandardFibonacciSynchronizationFirstFailedStage: "UNKNOWN",

      primaryCaseCandidate: "UNKNOWN",
      recommendedNextOwner: "UNKNOWN",
      recommendedNextFile: "UNKNOWN",
      recommendedNextAction: "UNKNOWN",
      notes: [],
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function readContracts(targetDocument, targetWindow, state) {
    const ds = dataset(targetDocument);
    const bds = bodyDataset(targetDocument);
    const html = targetDocument.documentElement;

    const htmlContract = text(firstDefined(
      ds.contract,
      ds.hearthHtmlContract,
      ds.hearthShellContract,
      html && html.getAttribute("data-contract"),
      bds.hearthHtmlContract
    ), "UNKNOWN");

    state.renderedHtmlContract = htmlContract;
    state.renderedHtmlContractRecognized = boolText(ACCEPTED_HTML_CONTRACTS.includes(htmlContract), "UNKNOWN");

    const indexScript = scriptInfo(targetDocument, targetWindow, INDEX_FILE);
    const indexContract = text(firstDefined(
      indexScript.cacheKey,
      ds.hearthIndexJsContract,
      ds.expectedIndexJsContract,
      bds.hearthIndexJsContract
    ), "UNKNOWN");

    state.renderedIndexScriptPresent = boolText(indexScript.present);
    state.renderedIndexScriptSrc = indexScript.src;
    state.renderedIndexContract = indexContract;
    state.renderedIndexContractRecognized = boolText(ACCEPTED_INDEX_CONTRACTS.includes(indexContract), "UNKNOWN");

    if (state.renderedHtmlContractRecognized === "true") addNote(state, "WEST_RENDERED_HTML_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    if (state.renderedIndexContractRecognized === "true") addNote(state, "WEST_RENDERED_INDEX_JS_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
  }

  function readRuntimeMap(targetDocument, targetWindow, state) {
    const nodes = NODE_SPECS.map((spec) => readStrictNode(spec, targetDocument, targetWindow));
    state.runtimeNodes = nodes;

    state.routeNode = nodes.find((node) => node.id === "ROUTE_CONDUCTOR") || null;
    state.controlsNode = nodes.find((node) => node.id === "CONTROLS_QUEEN") || null;
    state.canvasNode = nodes.find((node) => node.id === "CANVAS_RECEIVER") || null;
    state.hexAuthorityNode = nodes.find((node) => node.id === "HEX_AUTHORITY") || null;
    state.hexSurfaceNode = nodes.find((node) => node.id === "HEX_SURFACE_GATE") || null;
    state.pointerSurfaceNode = nodes.find((node) => node.id === "POINTER_SURFACE_BISHOP") || null;
    state.pointerInspectNode = nodes.find((node) => node.id === "POINTER_INSPECT_PRIEST") || null;
    state.labWestNode = nodes.find((node) => node.id === "LABWEST") || null;

    const topLevelNodes = nodes.filter((node) => !node.advisoryChild && node.id !== "LABWEST");
    const strictCount = topLevelNodes.filter((node) => node.strictObserved).length;
    const contaminationNodes = nodes.filter((node) => node.crossAuthorityContamination);
    const darkFiles = nodes.filter((node) => !node.strictObserved && node.id !== "LABWEST");

    state.strictRuntimeEndpointConfirmedCount = strictCount;
    state.strictRuntimeEndpointTotalCount = topLevelNodes.length;
    state.crossAuthorityContaminationCount = contaminationNodes.length;
    state.strictRuntimeMapClean = contaminationNodes.length === 0;
    state.runtimeDarkFiles = darkFiles.map((node) => ({
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
      contract: node.primaryEndpointContract,
      contractRecognized: node.contractRecognized,
      contractFamilyMatches: node.contractFamilyMatches,
      nodeStatus: node.nodeStatus,
      integrityClass: node.integrityClass,
      crossAuthorityContamination: node.crossAuthorityContamination,
      contaminationReason: node.contaminationReason
    }));

    if (contaminationNodes[0]) {
      state.firstCrossAuthorityContaminationOwner = contaminationNodes[0].id;
      state.firstCrossAuthorityContaminationFile = contaminationNodes[0].file;
      state.firstCrossAuthorityContaminationClass = contaminationNodes[0].integrityClass;
      state.firstCrossAuthorityContaminationReason = contaminationNodes[0].contaminationReason;
      addNote(state, `WEST_STRICT_RUNTIME_MAP_CROSS_AUTHORITY_CONTAMINATION:${contaminationNodes[0].id}`);
    } else {
      addNote(state, "WEST_STRICT_RUNTIME_MAP_NO_CROSS_AUTHORITY_CONTAMINATION");
    }

    if (state.controlsNode && state.controlsNode.strictObserved) {
      addNote(state, "WEST_CONTROLS_ENDPOINT_STRICTLY_CONFIRMED");
    }

    if (state.hexSurfaceNode && state.hexSurfaceNode.strictObserved) {
      addNote(state, "WEST_HEX_SURFACE_ENDPOINT_STRICTLY_CONFIRMED");
    }

    if (state.pointerSurfaceNode && !state.pointerSurfaceNode.strictObserved) {
      addNote("POINTER_SURFACE_BISHOP_STATUS:SCRIPT_OR_AUTHORITY_NOT_STRICTLY_CONFIRMED");
    }

    readLabWestState(state);
  }

  function readLabWestState(state) {
    const node = state.labWestNode;

    if (!node || !node.authorityPresent) {
      state.labWestReadMethod = "NONE";
      state.labWestDiagnosticTrackConnectionStatus = node && node.scriptPresent
        ? "SCRIPT_PRESENT_AUTHORITY_NOT_OBSERVED"
        : "NOT_CONNECTED_TO_WEST_DIAGNOSTIC_READ";
      addNote(state, "LABWEST_NOT_OBSERVED_BY_WEST_DIAGNOSTIC_READ");
      return;
    }

    const receipt = node.receiptObject || {};

    state.labWestReadMethod = "SAFE_RECEIPT_METHOD_ONLY_NO_CLASSIFY_RUN";
    state.labWestDecision = text(getCase(receipt, ["westDecision", "decision"], ""), "UNKNOWN");
    state.labWestGapClass = text(getCase(receipt, ["westGapClass", "gapClass"], ""), "UNKNOWN");
    state.labWestNorthC2Aligned = boolText(getCase(receipt, ["northC2WestAuditAligned", "northC2Aligned"], "UNKNOWN"), "UNKNOWN");
    state.labWestCycleRoute = text(getCase(receipt, ["cycleRoute", "activeCycleRoute", "northActiveCycleRoute"], ""), "UNKNOWN");
    state.labWestCycleTwoSouthOutputAdmissible = boolText(getCase(receipt, ["cycleTwoSouthOutputAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestBishopChordAdmissible = boolText(getCase(receipt, ["bishopChordAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestPreReleaseCarrierAdmissible = boolText(getCase(receipt, ["preReleaseCarrierAdmissible"], "UNKNOWN"), "UNKNOWN");
    state.labWestCanvasReleaseApproved = boolText(getCase(receipt, ["westCanvasReleaseApproved", "canvasReleaseApprovedByWest"], "UNKNOWN"), "UNKNOWN");
    state.labWestReleasePacketReady = boolText(getCase(receipt, ["canvasReleasePacketReady", "releaseToCanvas"], "UNKNOWN"), "UNKNOWN");
    state.labWestRecommendedNextFile = text(getCase(receipt, ["recommendedNextFile", "recommendedNextRenewalTarget"], ""), "UNKNOWN");
    state.labWestPostgameStatus = text(getCase(receipt, ["postgameStatus"], ""), "UNKNOWN");
    state.labWestDiagnosticTrackConnectionStatus = node.strictObserved
      ? "CONNECTED_SAFE_RECEIPT_READ_STRICT_ENDPOINT_CONFIRMED"
      : "CONNECTED_SAFE_RECEIPT_READ_ENDPOINT_NOT_STRICTLY_CONFIRMED";

    addNote(state, "LABWEST_OBSERVED_AND_CONNECTED_TO_WEST_DIAGNOSTIC_READ");
  }

  function readDomSurface(targetDocument, targetWindow, state) {
    const stage = qFirst(targetDocument, STAGE_SELECTORS);
    const mount = qFirst(targetDocument, MOUNT_SELECTORS);
    const frame = qFirst(targetDocument, FRAME_SELECTORS);
    const canvas = qFirst(targetDocument, CANVAS_SELECTORS);
    const expressionSurface = qFirst(targetDocument, EXPRESSION_SURFACE_SELECTORS);

    const stageNonzero = sizeNonZero(stage);
    const mountNonzero = sizeNonZero(mount);
    const frameNonzero = sizeNonZero(frame);
    const canvasNonzero = Boolean(canvas && ((Number(canvas.width || 0) > 0 && Number(canvas.height || 0) > 0) || sizeNonZero(canvas)));
    const expressionNonzero = sizeNonZero(expressionSurface);

    state.planetStagePresent = boolText(Boolean(stage));
    state.planetStageSelector = selectorName(stage);
    state.planetStageRect = rectPacket(stage);
    state.planetStageRectNonzero = boolText(stageNonzero);

    state.canvasMountPresent = boolText(Boolean(mount));
    state.canvasMountSelector = selectorName(mount);
    state.canvasMountRect = rectPacket(mount);
    state.canvasMountRectNonzero = boolText(mountNonzero);

    state.canvasFramePresent = boolText(Boolean(frame));
    state.canvasFrameSelector = selectorName(frame);
    state.canvasFrameRect = rectPacket(frame);
    state.canvasFrameRectNonzero = boolText(frameNonzero);

    state.canvasElementPresent = boolText(Boolean(canvas));
    state.canvasElementFound = boolText(Boolean(canvas));
    state.canvasElementSelector = selectorName(canvas);
    state.canvasRect = rectPacket(canvas);
    state.canvasRectNonzero = boolText(canvasNonzero);
    state.canvasInMount = boolText(Boolean(canvas && mount && mount.contains(canvas)));
    state.canvasInFrame = boolText(Boolean(canvas && frame && frame.contains(canvas)));
    state.canvasViewportIntersecting = boolText(viewportIntersecting(canvas || frame || mount || stage, targetWindow));

    try {
      const styleOwner = canvas && canvas.ownerDocument && canvas.ownerDocument.defaultView
        ? canvas.ownerDocument.defaultView
        : targetWindow || root;
      const style = canvas && styleOwner && isFunction(styleOwner.getComputedStyle)
        ? styleOwner.getComputedStyle(canvas)
        : null;

      state.canvasComputedVisible = boolText(Boolean(
        canvas &&
        style &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) !== 0
      ));
    } catch (_error) {
      state.canvasComputedVisible = "UNKNOWN";
    }

    try {
      state.canvasContext2dReady = boolText(Boolean(canvas && isFunction(canvas.getContext) && canvas.getContext("2d")));
    } catch (_error) {
      state.canvasContext2dReady = "false";
    }

    state.expressionSurfacePresent = boolText(Boolean(expressionSurface));
    state.expressionSurfaceSelector = selectorName(expressionSurface);
    state.expressionSurfaceRect = rectPacket(expressionSurface);
    state.expressionSurfaceRectNonzero = boolText(expressionNonzero);

    if (stageNonzero) addNote(state, "PLANET_STAGE_NONZERO_DOM_PROOF");
    if (mountNonzero) addNote(state, "CANVAS_MOUNT_NONZERO_DOM_PROOF");
    if (frameNonzero) addNote(state, "CANVAS_FRAME_NONZERO_DOM_PROOF");
    if (canvasNonzero) addNote(state, "CANVAS_ELEMENT_NONZERO_DOM_PROOF");
    if (expressionNonzero) addNote(state, "EXPRESSION_SURFACE_NONZERO_DOM_PROOF");

    readPixelSample(canvas, state);
  }

  function buildRelationship(id, fromNode, toNode, mode, requiredForMotion, requiredForVisibleSurface, topLevelBlocking, requestObserved, grantObserved, returnObserved) {
    const fromStrict = Boolean(fromNode && fromNode.strictObserved);
    const toStrict = Boolean(toNode && toNode.strictObserved);
    const fromAny = Boolean(fromNode && fromNode.observed);
    const toAny = Boolean(toNode && toNode.observed);
    const relationshipClean = Boolean(fromStrict && toStrict && requestObserved && grantObserved);
    const relationshipPermissionGranted = relationshipClean;

    return {
      id,
      from: fromNode ? fromNode.id : "UNKNOWN",
      to: toNode ? toNode.id : "UNKNOWN",
      fromFile: fromNode ? fromNode.file : "UNKNOWN",
      toFile: toNode ? toNode.file : "UNKNOWN",
      intendedMode: mode,
      requiredForMotion,
      requiredForVisibleSurface,
      topLevelBlocking,
      fromStrictObserved: fromStrict,
      toStrictObserved: toStrict,
      fromAnyObserved: fromAny,
      toAnyObserved: toAny,
      fromStatus: fromNode ? fromNode.nodeStatus : "UNKNOWN",
      toStatus: toNode ? toNode.nodeStatus : "UNKNOWN",
      fromIntegrityClass: fromNode ? fromNode.integrityClass : "UNKNOWN",
      toIntegrityClass: toNode ? toNode.integrityClass : "UNKNOWN",
      fromContract: fromNode ? fromNode.primaryEndpointContract : "UNKNOWN",
      toContract: toNode ? toNode.primaryEndpointContract : "UNKNOWN",
      requestObserved: Boolean(requestObserved),
      grantObserved: Boolean(grantObserved),
      returnObserved: Boolean(returnObserved),
      relationshipClean,
      relationshipPermissionGranted,
      relationshipStatus: relationshipClean
        ? mode === "HANDOFF"
          ? "STRICT_INTENDED_ONE_WAY_HANDOFF_CONFIRMED"
          : "STRICT_RELATIONSHIP_HANDSHAKE_CONFIRMED"
        : !fromStrict && !toStrict
          ? "RELATIONSHIP_BLOCKED_BOTH_ENDPOINTS_NOT_STRICTLY_CONFIRMED"
          : !fromStrict
            ? "RELATIONSHIP_BLOCKED_SOURCE_ENDPOINT_NOT_STRICTLY_CONFIRMED"
            : !toStrict
              ? "RELATIONSHIP_BLOCKED_TARGET_ENDPOINT_NOT_STRICTLY_CONFIRMED"
              : "RELATIONSHIP_REQUEST_OR_GRANT_NOT_CONFIRMED",
      varianceClass: relationshipClean
        ? mode === "HANDOFF"
          ? "STRICT_ONE_WAY_HANDOFF_COMPLETE"
          : "STRICT_HANDSHAKE_COMPLETE"
        : !fromStrict && !toStrict
          ? "BOTH_ENDPOINTS_NOT_STRICTLY_CONFIRMED"
          : !fromStrict
            ? "SOURCE_ENDPOINT_NOT_STRICTLY_CONFIRMED"
            : !toStrict
              ? "TARGET_ENDPOINT_NOT_STRICTLY_CONFIRMED"
              : "REQUEST_OR_GRANT_NOT_CONFIRMED",
      ...NO_CLAIMS
    };
  }

  function buildRuntimeRelationships(state) {
    const route = state.routeNode;
    const controls = state.controlsNode;
    const canvas = state.canvasNode;
    const hexSurface = state.hexSurfaceNode;
    const pointerSurface = state.pointerSurfaceNode;
    const pointerInspect = state.pointerInspectNode;

    const controlsHandshake =
      controls &&
      controls.strictObserved &&
      /ACCEPTED|VALID|READY|ACTIVE/i.test(JSON.stringify(controls.receiptObject || {}));

    const canvasHandshake =
      canvas &&
      canvas.strictObserved &&
      /HANDSHAKE|RECEIVER|ROUTE_CANVAS|CANVAS_PUBLIC|VISIBLE|ACTIVE/i.test(JSON.stringify(canvas.receiptObject || {}));

    const hexHandshake =
      hexSurface &&
      hexSurface.strictObserved &&
      /GATE|CANVAS|POINTER|TRANSMISSION|SURFACE|ACTIVE/i.test(JSON.stringify(hexSurface.receiptObject || {}));

    const pointerHandshake =
      pointerSurface &&
      pointerSurface.strictObserved &&
      /BISHOP|SOCKET|RETURN|CANVAS|SURFACE|ACTIVE/i.test(JSON.stringify(pointerSurface.receiptObject || {}));

    const relationships = [
      buildRelationship(
        "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
        route,
        controls,
        "HANDSHAKE",
        true,
        false,
        true,
        Boolean(route && route.strictObserved),
        Boolean(controlsHandshake || controls && controls.strictObserved),
        Boolean(controlsHandshake)
      ),
      buildRelationship(
        "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE",
        route,
        canvas,
        "HANDSHAKE",
        false,
        true,
        true,
        Boolean(route && route.strictObserved),
        Boolean(canvasHandshake || canvas && canvas.strictObserved),
        Boolean(canvasHandshake)
      ),
      buildRelationship(
        "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
        controls,
        canvas,
        "HANDSHAKE",
        true,
        false,
        true,
        Boolean(controls && controls.strictObserved),
        Boolean(canvas && canvas.strictObserved),
        Boolean(controls && canvas && controls.strictObserved && canvas.strictObserved)
      ),
      buildRelationship(
        "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
        canvas,
        hexSurface,
        "HANDSHAKE_OR_INTENDED_HANDOFF",
        true,
        true,
        true,
        Boolean(canvas && canvas.strictObserved),
        Boolean(hexHandshake || hexSurface && hexSurface.strictObserved),
        Boolean(hexHandshake)
      ),
      buildRelationship(
        "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP_GATE",
        hexSurface,
        pointerSurface,
        "HANDOFF",
        false,
        true,
        true,
        Boolean(hexSurface && hexSurface.strictObserved),
        Boolean(pointerHandshake || pointerSurface && pointerSurface.strictObserved),
        false
      ),
      buildRelationship(
        "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN_SOCKET",
        pointerSurface,
        canvas,
        "HANDSHAKE_OR_INTENDED_HANDOFF",
        false,
        true,
        true,
        Boolean(pointerSurface && pointerSurface.strictObserved),
        Boolean(canvas && canvas.strictObserved),
        Boolean(pointerHandshake && canvas && canvas.strictObserved)
      ),
      buildRelationship(
        "POINTER_SURFACE_BISHOP_TO_INSPECT_PRIEST_CHILD_ORGANIZER",
        pointerSurface,
        pointerInspect,
        "CHILD_ORGANIZER",
        false,
        false,
        false,
        Boolean(pointerSurface && pointerSurface.strictObserved),
        Boolean(pointerInspect && pointerInspect.observed),
        false
      )
    ];

    state.runtimeRelationships = relationships;
    state.strictRelationshipCleanCount = relationships.filter((item) => item.relationshipClean).length;
    state.strictRelationshipTotalCount = relationships.length;

    const firstGap = relationships.find((item) => !item.relationshipClean && item.topLevelBlocking);

    state.productionCycleObserved = boolText(Boolean(
      route && route.observed ||
      controls && controls.observed ||
      canvas && canvas.observed ||
      hexSurface && hexSurface.observed ||
      pointerSurface && pointerSurface.observed
    ));

    state.productionCycleStatus =
      !firstGap
        ? "PRODUCTION_CYCLE_COMPLETE_ROUTE_CONTROLS_CANVAS_HEX_POINTER_CANVAS"
        : state.strictRelationshipCleanCount > 0
          ? "PRODUCTION_CYCLE_PARTIAL_STRICT_ENDPOINT_GAP"
          : "PRODUCTION_CYCLE_NOT_STRICTLY_CONFIRMED";

    state.productionCycleFirstGap = firstGap ? firstGap.id : "NONE";

    state.threeFileConstructStrategy = {
      strategyName: "ROUTE_CONTROLS_CANVAS_HEX_SURFACE_POINTER_SURFACE_STRICT_RUNTIME_MAP_STRATEGY_v9",
      routeConductorActiveScanAuthority: true,
      controlsRemainMotionAndInputGatewayAuthority: true,
      canvasRemainsPublicReceiverAndPresentationSurfaceAuthority: true,
      hexSurfaceRemainsDownstreamGateBeforePointerSurface: true,
      pointerSurfaceIsBishopGate: true,
      pointerInspectIsChildOrganizerPriest: true,
      inspectFileNotPrimaryChainEndpoint: true,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      strictEndpointProofRequired: true,
      datasetContractTextIsAdvisoryOnly: true,
      borrowedContractTextIgnoredForEndpointProof: true,
      crossAuthorityContaminationCount: state.crossAuthorityContaminationCount,
      firstCrossAuthorityContaminationOwner: state.firstCrossAuthorityContaminationOwner,
      relationshipGrantedCount: state.strictRelationshipCleanCount,
      relationshipTotalCount: state.strictRelationshipTotalCount,
      productionCycleStatus: state.productionCycleStatus,
      productionCycleFirstGap: state.productionCycleFirstGap,
      recommendedConstructAction: firstGap
        ? "CONFIRM_STRICT_ENDPOINT_CONTRACT_FAMILY_AND_RELATIONSHIP_PERMISSION_SIGNALS"
        : "VERIFY_CANVAS_SURFACE_TRUTH_AND_PIXEL_VISIBILITY"
    };
  }

  function deriveCanvasSurfaceTruth(state) {
    const canvasScriptStrict = Boolean(state.canvasNode && state.canvasNode.strictObserved);
    const canvasDomReady = state.canvasElementFound === "true" && state.canvasRectNonzero === "true";
    const contextReady = state.canvasContext2dReady === "true";
    const pixelVisible = state.canvasPixelVisible === "true";

    state.canvasSurfaceTruthAvailable = boolText(Boolean(canvasScriptStrict || canvasDomReady || contextReady));

    if (!canvasScriptStrict) {
      state.canvasSurfaceTruthStatus = "FAILED";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_STRICT_RUNTIME_ENDPOINT";
      state.canvasSurfaceTruthFailureClass = "CANVAS_ENDPOINT_NOT_STRICTLY_CONFIRMED";
      state.canvasSurfaceTruthFailureReason = "CANVAS_PUBLIC_RECEIVER_STRICT_ALIAS_FILE_CONTRACT_FAMILY_MATCH_NOT_CONFIRMED";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_PUBLIC_RECEIVER";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "CONFIRM_CANVAS_PUBLIC_RECEIVER_STRICT_ENDPOINT_CONTRACT_PUBLICATION";
      return;
    }

    if (!canvasDomReady) {
      state.canvasSurfaceTruthStatus = "PARTIAL";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANONICAL_CANVAS_RECT_NONZERO";
      state.canvasSurfaceTruthFailureClass = "CANONICAL_CANVAS_ZERO_RECT";
      state.canvasSurfaceTruthFailureReason = "#hearthVisibleCanvas_EXISTS_BUT_RECT_IS_ZERO_OR_ATTRIBUTE_SIZE_ONLY";
      state.canvasSurfaceTruthRecommendedOwner = "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY";
      state.canvasSurfaceTruthRecommendedFile = "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN";
      state.canvasSurfaceTruthRecommendedAction = "READ_PARENT_CHAIN_AND_STAGE_USED_SIZE_FACTS";
      return;
    }

    if (!pixelVisible) {
      state.canvasSurfaceTruthStatus = "PARTIAL";
      state.canvasSurfaceTruthFirstFailedCoordinate = "CANVAS_PIXEL_VISIBLE";
      state.canvasSurfaceTruthFailureClass = "PIXEL_EMPTY_OR_TRANSPARENT";
      state.canvasSurfaceTruthFailureReason = "CANVAS_ELEMENT_AND_CONTEXT_EXIST_BUT_PIXEL_SAMPLE_IS_NOT_VISIBLE";
      state.canvasSurfaceTruthRecommendedOwner = "CANVAS_PUBLIC_RECEIVER";
      state.canvasSurfaceTruthRecommendedFile = CANVAS_FILE;
      state.canvasSurfaceTruthRecommendedAction = "CONFIRM_CANVAS_RENDER_LOOP_PAINTS_VISIBLE_PIXEL_SURFACE";
      return;
    }

    state.canvasSurfaceTruthStatus = "PASS";
    state.canvasSurfaceTruthFirstFailedCoordinate = "NONE";
    state.canvasSurfaceTruthFailureClass = "NONE";
    state.canvasSurfaceTruthFailureReason = "CANVAS_STRICT_ENDPOINT_DOM_CONTEXT_AND_PIXEL_SURFACE_CONFIRMED";
    state.canvasSurfaceTruthRecommendedOwner = "NONE";
    state.canvasSurfaceTruthRecommendedFile = "NONE";
    state.canvasSurfaceTruthRecommendedAction = "NONE";
  }

  function deriveRenderedProof(state) {
    const stageMountReady = state.planetStageRectNonzero === "true" && state.canvasMountRectNonzero === "true";
    const domCanvasReady = state.canvasElementFound === "true" && state.canvasRectNonzero === "true";
    const expressionSurfaceReady = state.expressionSurfacePresent === "true" && state.expressionSurfaceRectNonzero === "true";
    const pixelReady = state.canvasPixelVisible === "true";
    const routeProof = Boolean(state.routeNode && state.routeNode.strictObserved);
    const canvasProof = Boolean(state.canvasNode && state.canvasNode.strictObserved);
    const labWestProof = state.labWestDiagnosticTrackConnectionStatus.indexOf("CONNECTED_SAFE_RECEIPT_READ") === 0;

    const surfaceReady = Boolean(domCanvasReady || expressionSurfaceReady || pixelReady || canvasProof);
    const richnessReady = Boolean(pixelReady || canvasProof || state.productionCycleStatus !== "PRODUCTION_CYCLE_NOT_STRICTLY_CONFIRMED");

    state.canvasExpressionSurfaceReady = boolText(surfaceReady);
    state.canvasExpressionRichnessReady = boolText(richnessReady);

    if (surfaceReady && richnessReady) {
      state.canvasExpressionProofStatus = "ACTIVE";
      state.canvasExpressionBottleneckClass = "EXPRESSION_SURFACE_AND_STRICT_NAMESPACE_OR_PIXEL_VARIANCE_PRESENT";
    } else if (surfaceReady) {
      state.canvasExpressionProofStatus = "ACTIVE_DEGRADED";
      state.canvasExpressionBottleneckClass = "EXPRESSION_SURFACE_PRESENT_DEGRADED_OR_OPAQUE_NAMESPACE";
    } else if (stageMountReady) {
      state.canvasExpressionProofStatus = "HANDSHAKE_PENDING";
      state.canvasExpressionBottleneckClass = "STAGE_AND_MOUNT_PRESENT_EXPRESSION_SURFACE_NOT_PROVEN";
    } else {
      state.canvasExpressionProofStatus = "EXPECTED_NOT_YET_WIRED";
      state.canvasExpressionBottleneckClass = "NO_STAGE_MOUNT_CANVAS_OR_EXPRESSION_SURFACE_PROVEN";
    }

    const inspected = Boolean(stageMountReady || surfaceReady || routeProof || labWestProof);
    const ready = Boolean(
      pixelReady ||
      (domCanvasReady && expressionSurfaceReady) ||
      (surfaceReady && routeProof) ||
      (stageMountReady && routeProof) ||
      (stageMountReady && labWestProof)
    );

    state.renderedPlanetProofInspected = boolText(inspected);
    state.renderedPlanetProofReady = boolText(ready);
    state.renderedPlanetProofFullyInspected = boolText(inspected);
    state.westRenderedProofSpreadComplete = boolText(inspected || ready);
    state.visiblePlanetProofReady = boolText(ready);
    state.visiblePlanetProofSource = ready
      ? pixelReady
        ? "CANVAS_PIXEL_VISIBLE"
        : domCanvasReady && expressionSurfaceReady
          ? "DOM_STAGE_MOUNT_CANVAS_EXPRESSION_SURFACE_NONZERO"
          : surfaceReady && routeProof
            ? "DOM_SURFACE_AND_STRICT_ROUTE_CONDUCTOR_RENDERED_PROOF"
            : stageMountReady && labWestProof
              ? "STAGE_MOUNT_AND_LABWEST_TRACK_CONNECTED"
              : "RENDERED_TARGET_COMPOSITE_PROOF"
      : inspected
        ? "RENDERED_PROOF_INSPECTED_NOT_READY"
        : "UNKNOWN";

    if (ready) addNote(state, `RENDERED_PLANET_PROOF_READY:${state.visiblePlanetProofSource}`);
    if (inspected) addNote(state, "WEST_RENDERED_PROOF_SPREAD_COMPLETE");
  }

  function deriveAlignment(state) {
    let newsScore = 0;
    let fibScore = 0;
    let newsFailed = "NONE";
    let fibFailed = "NONE";

    const checks = [
      ["ROUTE_CONDUCTOR", Boolean(state.routeNode && state.routeNode.strictObserved)],
      ["CONTROLS_QUEEN", Boolean(state.controlsNode && state.controlsNode.strictObserved)],
      ["CANVAS_PUBLIC_RECEIVER", Boolean(state.canvasNode && state.canvasNode.strictObserved)],
      ["HEX_SURFACE_GATE", Boolean(state.hexSurfaceNode && state.hexSurfaceNode.strictObserved)],
      ["POINTER_SURFACE_BISHOP", Boolean(state.pointerSurfaceNode && state.pointerSurfaceNode.strictObserved)],
      ["CANVAS_ARTIFACT_RETURN", state.canvasElementFound === "true" && state.canvasRectNonzero === "true"]
    ];

    const fibChecks = [
      ["F1:ROUTE", checks[0][1]],
      ["F2:CONTROLS", checks[1][1]],
      ["F3:CANVAS_PUBLIC_RECEIVER", checks[2][1]],
      ["F5:HEX_SURFACE", checks[3][1]],
      ["F8:POINTER_SURFACE_BISHOP", checks[4][1]],
      ["F13:CANVAS_ARTIFACT_RETURN", checks[5][1]],
      ["F21:PIXEL_VISIBLE_NO_FINAL_CLAIM", state.canvasPixelVisible === "true"]
    ];

    checks.forEach(([name, pass]) => {
      if (pass) newsScore += 1;
      else if (newsFailed === "NONE") newsFailed = name;
    });

    fibChecks.forEach(([name, pass]) => {
      if (pass) fibScore += 1;
      else if (fibFailed === "NONE") fibFailed = name;
    });

    const newsPct = Math.round((newsScore / checks.length) * 100);
    const fibPct = Math.round((fibScore / fibChecks.length) * 100);

    state.canvasStandardNewsAlignmentScore = String(newsPct);
    state.canvasStandardNewsAlignmentStatus = newsPct === 100
      ? "CANVAS_STANDARD_NEWS_ALIGNMENT_COMPLETE"
      : newsPct > 0
        ? "CANVAS_STANDARD_NEWS_ALIGNMENT_PARTIAL"
        : "CANVAS_STANDARD_NEWS_ALIGNMENT_NOT_CONFIRMED";
    state.canvasStandardNewsAlignmentFirstFailedStage = newsFailed;

    state.canvasStandardFibonacciSynchronizationScore = String(fibPct);
    state.canvasStandardFibonacciSynchronizationStatus = fibPct === 100
      ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_COMPLETE"
      : fibPct > 0
        ? "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_PARTIAL"
        : "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_NOT_CONFIRMED";
    state.canvasStandardFibonacciSynchronizationFirstFailedStage = fibFailed;
  }

  function deriveRecommendation(state) {
    if (state.crossAuthorityContaminationCount > 0) {
      const first = state.runtimeNodes.find((node) => node.crossAuthorityContamination);
      state.primaryCaseCandidate = "WEST_STRICT_RUNTIME_MAP_CROSS_AUTHORITY_CONTAMINATION";
      state.recommendedNextOwner = first ? first.id : "DIAGNOSTIC_WEST";
      state.recommendedNextFile = first ? first.file : FILE;
      state.recommendedNextAction = "CONFIRM_ENDPOINT_ALIAS_FILE_PRIMARY_CONTRACT_FAMILY_PUBLICATION";
      return;
    }

    if (state.canvasSurfaceTruthStatus === "FAILED") {
      state.primaryCaseCandidate = "CANVAS_SURFACE_TRUTH_FAILURE";
      state.recommendedNextOwner = state.canvasSurfaceTruthRecommendedOwner;
      state.recommendedNextFile = state.canvasSurfaceTruthRecommendedFile;
      state.recommendedNextAction = state.canvasSurfaceTruthRecommendedAction;
      return;
    }

    if (state.canvasSurfaceTruthStatus === "PARTIAL") {
      state.primaryCaseCandidate = "CANVAS_SURFACE_TRUTH_PARTIAL";
      state.recommendedNextOwner = state.canvasSurfaceTruthRecommendedOwner;
      state.recommendedNextFile = state.canvasSurfaceTruthRecommendedFile;
      state.recommendedNextAction = state.canvasSurfaceTruthRecommendedAction;
      return;
    }

    if (state.productionCycleStatus !== "PRODUCTION_CYCLE_COMPLETE_ROUTE_CONTROLS_CANVAS_HEX_POINTER_CANVAS") {
      state.primaryCaseCandidate = "PRODUCTION_CYCLE_PERMISSION_PARTIAL";
      state.recommendedNextOwner = "STRICT_RUNTIME_RELATIONSHIP_OWNER";
      state.recommendedNextFile =
        state.productionCycleFirstGap.includes("CONTROLS")
          ? CONTROL_FILE
          : state.productionCycleFirstGap.includes("HEX")
            ? HEX_SURFACE_FILE
            : state.productionCycleFirstGap.includes("POINTER")
              ? POINTER_SURFACE_FILE
              : state.productionCycleFirstGap.includes("CANVAS")
                ? CANVAS_FILE
                : ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "CONFIRM_STRICT_ENDPOINT_RELATIONSHIP_PERMISSION_REQUEST_AND_GRANT_SIGNALS";
      return;
    }

    state.primaryCaseCandidate = "WEST_STRICT_RENDERED_TARGET_EVIDENCE_COMPLETE";
    state.recommendedNextOwner = "NORTH_FINAL_ARBITRATION";
    state.recommendedNextFile = "NONE";
    state.recommendedNextAction = "ALLOW_NORTH_TO_SELECT_FINAL_PRIMARY_CASE";
  }

  function makeEvidencePacket(state) {
    const nodeById = {};
    (state.runtimeNodes || []).forEach((node) => {
      nodeById[node.id] = node;
    });

    const route = nodeById.ROUTE_CONDUCTOR || {};
    const controls = nodeById.CONTROLS_QUEEN || {};
    const canvas = nodeById.CANVAS_RECEIVER || {};
    const hexAuthority = nodeById.HEX_AUTHORITY || {};
    const hexSurface = nodeById.HEX_SURFACE_GATE || {};
    const pointerSurface = nodeById.POINTER_SURFACE_BISHOP || {};
    const pointerInspect = nodeById.POINTER_INSPECT_PRIEST || {};
    const labWest = nodeById.LABWEST || {};

    return {
      WEST_STATUS: state.westStatus,
      WEST_CONTRACT: CONTRACT,
      WEST_RECEIPT: RECEIPT,
      WEST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      WEST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      WEST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      WEST_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      WEST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      WEST_VERSION: VERSION,
      WEST_FILE: FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      WEST_RENDERED_READ_COMPLETE: state.westRenderedReadComplete,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,

      STRICT_RUNTIME_ENDPOINT_FAMILY_READER_ACTIVE: true,
      CROSS_AUTHORITY_CONTAMINATION_GUARD_ACTIVE: true,
      DATASET_ADVISORY_ONLY_ACTIVE: true,
      BORROWED_CONTRACT_TEXT_IGNORED_FOR_ENDPOINT_PROOF: true,
      POINTER_SURFACE_BISHOP_MAPPING_ACTIVE: true,
      POINTER_INSPECT_PRIEST_DEMOTION_ACTIVE: true,
      INSPECT_FILE_NOT_PRIMARY_CHAIN_ENDPOINT: true,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      TARGET_SOURCE: state.targetSource,
      HEARTH_TARGET_CONFIRMED: state.hearthTargetConfirmed,

      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,
      POINTER_FINGER_FILE: POINTER_SURFACE_FILE,
      POINTER_FINGER_FILE_LEGACY: POINTER_INSPECT_FILE,
      LABWEST_FILE,

      CURRENT_HTML_CONTRACT,
      CURRENT_INDEX_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_INSPECT_CONTRACT,
      EXPECTED_POINTER_FINGER_CONTRACT: EXPECTED_POINTER_SURFACE_CONTRACT,

      RENDERED_HTML_CONTRACT: state.renderedHtmlContract,
      RENDERED_HTML_CONTRACT_RECOGNIZED: state.renderedHtmlContractRecognized,
      RENDERED_INDEX_JS_SCRIPT_PRESENT: state.renderedIndexScriptPresent,
      RENDERED_INDEX_JS_SCRIPT_SRC: state.renderedIndexScriptSrc,
      RENDERED_INDEX_JS_CONTRACT: state.renderedIndexContract,
      RENDERED_INDEX_JS_CONTRACT_RECOGNIZED: state.renderedIndexContractRecognized,

      ROUTE_CONDUCTOR_SCRIPT_PRESENT: boolText(route.scriptPresent),
      ROUTE_CONDUCTOR_SCRIPT_SRC: route.scriptTargetSrc || "UNKNOWN",
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: route.scriptTargetCacheKey || "UNKNOWN",
      ROUTE_CONDUCTOR_AUTHORITY_OBSERVED: boolText(route.authorityPresent),
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: route.selectedAliasFullPath || "UNKNOWN",
      ROUTE_CONDUCTOR_CONTRACT: route.primaryEndpointContract || "UNKNOWN",
      ROUTE_CONDUCTOR_RECEIPT: route.primaryEndpointReceipt || "UNKNOWN",
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: boolText(route.contractRecognized),

      CONTROL_SCRIPT_PRESENT: boolText(controls.scriptPresent),
      CONTROL_SCRIPT_SRC: controls.scriptTargetSrc || "UNKNOWN",
      CONTROL_AUTHORITY_OBSERVED: boolText(controls.authorityPresent),
      CONTROL_AUTHORITY_SOURCE: controls.selectedAliasFullPath || "UNKNOWN",
      CONTROL_CONTRACT: controls.primaryEndpointContract || "UNKNOWN",
      CONTROL_RECEIPT: controls.primaryEndpointReceipt || "UNKNOWN",
      CONTROL_CONTRACT_RECOGNIZED: boolText(controls.contractRecognized),
      CONTROL_FILE_STATUS: controls.strictObserved
        ? "CONTROL_FILE_STRICTLY_CONFIRMED_AND_MOTION_TOUCH_READY"
        : controls.observed
          ? "CONTROL_FILE_OBSERVED_NOT_STRICTLY_CONFIRMED"
          : "EXPECTED_NOT_YET_BUILT",
      CONTROL_HANDSHAKE_STATUS: controls.strictObserved ? "HANDSHAKE_VALID" : "HANDSHAKE_BLOCKED_BY_STRICT_RUNTIME_MAP",
      MOTION_TOUCH_STATUS: controls.strictObserved ? "ACTIVE" : "WAITING_STRICT_CONTROL_ENDPOINT",
      DRAG_STATUS: controls.strictObserved ? "ACTIVE" : "WAITING_STRICT_CONTROL_ENDPOINT",
      VIEW_CONTROL_STATUS: controls.strictObserved ? "ACTIVE" : "WAITING_STRICT_CONTROL_ENDPOINT",

      CANVAS_SCRIPT_PRESENT: boolText(canvas.scriptPresent),
      CANVAS_SCRIPT_SRC: canvas.scriptTargetSrc || "UNKNOWN",
      CANVAS_AUTHORITY_OBSERVED: boolText(canvas.authorityPresent),
      CANVAS_AUTHORITY_SOURCE: canvas.selectedAliasFullPath || "UNKNOWN",
      CANVAS_CONTRACT: canvas.primaryEndpointContract || "UNKNOWN",
      CANVAS_RECEIPT: canvas.primaryEndpointReceipt || "UNKNOWN",
      CURRENT_CANVAS_PARENT_CONTRACT: canvas.primaryEndpointContract || "UNKNOWN",
      CURRENT_CANVAS_PARENT_RECOGNIZED: boolText(canvas.contractRecognized),
      CANVAS_PARENT_CONTRACT_RECOGNIZED: boolText(canvas.contractRecognized),
      CANVAS_NAMESPACE_PRESENT: boolText(canvas.authorityPresent),
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: boolText(canvas.strictObserved && state.canvasElementFound === "true"),

      HEX_AUTHORITY_SCRIPT_PRESENT: boolText(hexAuthority.scriptPresent),
      HEX_AUTHORITY_SCRIPT_SRC: hexAuthority.scriptTargetSrc || "UNKNOWN",
      HEX_AUTHORITY_OBSERVED: boolText(hexAuthority.authorityPresent),
      HEX_AUTHORITY_SOURCE: hexAuthority.selectedAliasFullPath || "UNKNOWN",
      HEX_AUTHORITY_CONTRACT: hexAuthority.primaryEndpointContract || "UNKNOWN",
      HEX_AUTHORITY_RECOGNIZED: boolText(hexAuthority.contractRecognized),

      HEX_SURFACE_SCRIPT_PRESENT: boolText(hexSurface.scriptPresent),
      HEX_SURFACE_SCRIPT_SRC: hexSurface.scriptTargetSrc || "UNKNOWN",
      HEX_SURFACE_OBSERVED: boolText(hexSurface.authorityPresent),
      HEX_SURFACE_SOURCE: hexSurface.selectedAliasFullPath || "UNKNOWN",
      HEX_SURFACE_CONTRACT: hexSurface.primaryEndpointContract || "UNKNOWN",
      HEX_SURFACE_RECOGNIZED: boolText(hexSurface.contractRecognized),

      POINTER_SURFACE_BISHOP_SCRIPT_PRESENT: boolText(pointerSurface.scriptPresent),
      POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT: boolText(pointerSurface.authorityPresent),
      POINTER_SURFACE_BISHOP_AUTHORITY_SOURCE: pointerSurface.selectedAliasFullPath || "UNKNOWN",
      POINTER_SURFACE_BISHOP_CONTRACT: pointerSurface.primaryEndpointContract || "UNKNOWN",
      POINTER_SURFACE_BISHOP_RECEIPT: pointerSurface.primaryEndpointReceipt || "UNKNOWN",
      POINTER_SURFACE_BISHOP_RECOGNIZED: boolText(pointerSurface.contractRecognized),
      POINTER_SURFACE_BISHOP_STATUS: pointerSurface.nodeStatus || "UNKNOWN",

      POINTER_INSPECT_PRIEST_SCRIPT_PRESENT: boolText(pointerInspect.scriptPresent),
      POINTER_INSPECT_PRIEST_AUTHORITY_PRESENT: boolText(pointerInspect.authorityPresent),
      POINTER_INSPECT_PRIEST_AUTHORITY_SOURCE: pointerInspect.selectedAliasFullPath || "UNKNOWN",
      POINTER_INSPECT_PRIEST_CONTRACT: pointerInspect.primaryEndpointContract || "UNKNOWN",
      POINTER_INSPECT_PRIEST_RECEIPT: pointerInspect.primaryEndpointReceipt || "UNKNOWN",
      POINTER_INSPECT_PRIEST_RECOGNIZED: boolText(pointerInspect.contractRecognized),
      POINTER_INSPECT_PRIEST_STATUS: pointerInspect.nodeStatus || "UNKNOWN",

      POINTER_FINGER_SCRIPT_PRESENT: boolText(pointerSurface.scriptPresent),
      POINTER_FINGER_SCRIPT_SRC: pointerSurface.scriptTargetSrc || "UNKNOWN",
      POINTER_FINGER_OBSERVED: boolText(pointerSurface.authorityPresent),
      POINTER_FINGER_SOURCE: pointerSurface.selectedAliasFullPath || "UNKNOWN",
      POINTER_FINGER_CONTRACT: pointerSurface.primaryEndpointContract || "UNKNOWN",
      POINTER_FINGER_RECOGNIZED: boolText(pointerSurface.contractRecognized),

      LABWEST_SCRIPT_PRESENT: boolText(labWest.scriptPresent),
      LABWEST_SCRIPT_SRC: labWest.scriptTargetSrc || "UNKNOWN",
      LABWEST_OBSERVED: boolText(labWest.authorityPresent || labWest.scriptPresent),
      LABWEST_AUTHORITY_SOURCE: labWest.selectedAliasFullPath || "UNKNOWN",
      LABWEST_CONTRACT: labWest.primaryEndpointContract || "UNKNOWN",
      LABWEST_RECEIPT: labWest.primaryEndpointReceipt || "UNKNOWN",
      LABWEST_CONTRACT_RECOGNIZED: boolText(labWest.contractRecognized),
      LABWEST_READ_METHOD: state.labWestReadMethod,
      LABWEST_DECISION: state.labWestDecision,
      LABWEST_GAP_CLASS: state.labWestGapClass,
      LABWEST_NORTH_C2_ALIGNED: state.labWestNorthC2Aligned,
      LABWEST_CYCLE_ROUTE: state.labWestCycleRoute,
      LABWEST_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBLE: state.labWestCycleTwoSouthOutputAdmissible,
      LABWEST_BISHOP_CHORD_ADMISSIBLE: state.labWestBishopChordAdmissible,
      LABWEST_PRE_RELEASE_CARRIER_ADMISSIBLE: state.labWestPreReleaseCarrierAdmissible,
      LABWEST_CANVAS_RELEASE_APPROVED: state.labWestCanvasReleaseApproved,
      LABWEST_RELEASE_PACKET_READY: state.labWestReleasePacketReady,
      LABWEST_RECOMMENDED_NEXT_FILE: state.labWestRecommendedNextFile,
      LABWEST_POSTGAME_STATUS: state.labWestPostgameStatus,
      LABWEST_DIAGNOSTIC_TRACK_CONNECTION_STATUS: state.labWestDiagnosticTrackConnectionStatus,

      PLANET_STAGE_PRESENT: state.planetStagePresent,
      PLANET_STAGE_SELECTOR: state.planetStageSelector,
      PLANET_STAGE_RECT: state.planetStageRect,
      PLANET_STAGE_RECT_NONZERO: state.planetStageRectNonzero,
      CANVAS_MOUNT_PRESENT: state.canvasMountPresent,
      CANVAS_MOUNT_SELECTOR: state.canvasMountSelector,
      CANVAS_MOUNT_RECT: state.canvasMountRect,
      CANVAS_MOUNT_RECT_NONZERO: state.canvasMountRectNonzero,
      CANVAS_FRAME_PRESENT: state.canvasFramePresent,
      CANVAS_FRAME_SELECTOR: state.canvasFrameSelector,
      CANVAS_FRAME_RECT: state.canvasFrameRect,
      CANVAS_FRAME_RECT_NONZERO: state.canvasFrameRectNonzero,
      CANVAS_ELEMENT_PRESENT: state.canvasElementPresent,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_ELEMENT_SELECTOR: state.canvasElementSelector,
      CANVAS_RECT: state.canvasRect,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_IN_MOUNT: state.canvasInMount,
      CANVAS_IN_FRAME: state.canvasInFrame,
      CANVAS_COMPUTED_VISIBLE: state.canvasComputedVisible,
      CANVAS_VIEWPORT_INTERSECTING: state.canvasViewportIntersecting,
      CANVAS_CONTEXT_2D_READY: state.canvasContext2dReady,
      EXPRESSION_SURFACE_PRESENT: state.expressionSurfacePresent,
      EXPRESSION_SURFACE_SELECTOR: state.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT: state.expressionSurfaceRect,
      EXPRESSION_SURFACE_RECT_NONZERO: state.expressionSurfaceRectNonzero,

      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PIXEL_SAMPLE_READABLE: state.canvasPixelSampleReadable,
      CANVAS_PIXEL_VISIBLE: state.canvasPixelVisible,
      CANVAS_PIXEL_NONEMPTY: state.canvasPixelNonEmpty,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: state.canvasPixelUniqueColorCount,
      CANVAS_PIXEL_LUMINANCE_RANGE: state.canvasPixelLuminanceRange,
      CANVAS_PIXEL_VARIANCE_STATUS: state.canvasPixelVarianceStatus,

      CANVAS_SURFACE_TRUTH_STATUS: state.canvasSurfaceTruthStatus,
      CANVAS_SURFACE_TRUTH_AVAILABLE: state.canvasSurfaceTruthAvailable,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: state.canvasSurfaceTruthFirstFailedCoordinate,
      CANVAS_TRUTH_FAILURE_CLASS: state.canvasSurfaceTruthFailureClass,
      CANVAS_TRUTH_FAILURE_REASON: state.canvasSurfaceTruthFailureReason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: state.canvasSurfaceTruthRecommendedOwner,
      CANVAS_TRUTH_RECOMMENDED_FILE: state.canvasSurfaceTruthRecommendedFile,
      CANVAS_TRUTH_RECOMMENDED_ACTION: state.canvasSurfaceTruthRecommendedAction,

      CANVAS_EXPRESSION_SURFACE_READY: state.canvasExpressionSurfaceReady,
      CANVAS_EXPRESSION_RICHNESS_READY: state.canvasExpressionRichnessReady,
      CANVAS_EXPRESSION_PROOF_STATUS: state.canvasExpressionProofStatus,
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: state.canvasExpressionBottleneckClass,
      RENDERED_PLANET_PROOF_INSPECTED: state.renderedPlanetProofInspected,
      RENDERED_PLANET_PROOF_READY: state.renderedPlanetProofReady,
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: state.renderedPlanetProofFullyInspected,
      WEST_RENDERED_PROOF_SPREAD_COMPLETE: state.westRenderedProofSpreadComplete,
      VISIBLE_PLANET_PROOF_READY: state.visiblePlanetProofReady,
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,

      RUNTIME_NODES: clonePlain(state.runtimeNodes),
      RUNTIME_RELATIONSHIPS: clonePlain(state.runtimeRelationships),
      RUNTIME_DARK_FILES: clonePlain(state.runtimeDarkFiles),
      RUNTIME_DARK_FILE_COUNT: state.runtimeDarkFiles.length,
      STRICT_RUNTIME_MAP_CLEAN: state.strictRuntimeMapClean,
      STRICT_RUNTIME_ENDPOINT_CONFIRMED_COUNT: state.strictRuntimeEndpointConfirmedCount,
      STRICT_RUNTIME_ENDPOINT_TOTAL_COUNT: state.strictRuntimeEndpointTotalCount,
      STRICT_RELATIONSHIP_CLEAN_COUNT: state.strictRelationshipCleanCount,
      STRICT_RELATIONSHIP_TOTAL_COUNT: state.strictRelationshipTotalCount,
      CROSS_AUTHORITY_CONTAMINATION_COUNT: state.crossAuthorityContaminationCount,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_OWNER: state.firstCrossAuthorityContaminationOwner,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_FILE: state.firstCrossAuthorityContaminationFile,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_CLASS: state.firstCrossAuthorityContaminationClass,
      FIRST_CROSS_AUTHORITY_CONTAMINATION_REASON: state.firstCrossAuthorityContaminationReason,

      PRODUCTION_CYCLE_OBSERVED: state.productionCycleObserved,
      PRODUCTION_CYCLE_STATUS: state.productionCycleStatus,
      PRODUCTION_CYCLE_FIRST_GAP: state.productionCycleFirstGap,
      DELEGATORY_RELATIONSHIPS: clonePlain(state.runtimeRelationships),
      THREE_FILE_CONSTRUCT_STRATEGY: clonePlain(state.threeFileConstructStrategy),

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

      PRIMARY_CASE_CANDIDATE: state.primaryCaseCandidate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      WEST_SECONDARY_EVIDENCE_NOTES: state.notes.length ? state.notes.join(" | ") : "none",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: state.updatedAt
    };
  }

  function runWestRenderedRead(options = {}) {
    const state = makeState();
    state.westStatus = "RUNNING";
    state.westRenderedReadStatus = "RUNNING";
    state.updatedAt = nowIso();

    try {
      const target = resolveTarget(options, state);
      state.targetSource = target.source || "NONE";

      if (!target.targetDocument || !target.targetWindow) {
        state.diagnosticTargetAccessStatus = "SOURCE_ONLY";
        state.diagnosticTargetAccessError = "NO_RENDERED_HEARTH_TARGET_DOCUMENT_WINDOW_OR_FRAME";
        state.hearthTargetConfirmed = false;
        state.westStatus = "PARTIAL";
        state.westRenderedReadComplete = "false";
        state.westRenderedReadStatus = "PARTIAL";
        state.renderedPlanetProofReady = "false";
        state.renderedPlanetProofInspected = "false";
        state.visiblePlanetProofReady = "false";
        state.visiblePlanetProofSource = "RENDERED_TARGET_NOT_RESOLVED";
        state.primaryCaseCandidate = "WEST_RENDERED_TARGET_NOT_RESOLVED";
        state.recommendedNextOwner = "DIAGNOSTIC_TARGET_RESOLUTION";
        state.recommendedNextFile = DIAGNOSTIC_ROUTE;
        state.recommendedNextAction = "SUPPLY_OR_LOAD_RENDERED_HEARTH_TARGET_FRAME";
        addNote(state, "WEST_RENDERED_TARGET_NOT_RESOLVED");

        publish(state);

        return {
          ok: true,
          contract: CONTRACT,
          receipt: RECEIPT,
          implementationContract: IMPLEMENTATION_CONTRACT,
          implementationReceipt: IMPLEMENTATION_RECEIPT,
          evidence: clonePlain(lastEvidencePacket),
          state: clonePlain(lastState)
        };
      }

      state.diagnosticTargetAccessStatus = "RENDERED_TARGET_ACCESSIBLE";
      state.diagnosticTargetAccessError = "NONE";
      state.hearthTargetConfirmed = true;

      readContracts(target.targetDocument, target.targetWindow, state);
      readRuntimeMap(target.targetDocument, target.targetWindow, state);
      readDomSurface(target.targetDocument, target.targetWindow, state);
      buildRuntimeRelationships(state);
      deriveCanvasSurfaceTruth(state);
      deriveRenderedProof(state);
      deriveAlignment(state);
      deriveRecommendation(state);

      state.westRenderedReadComplete = "true";
      state.westRenderedReadStatus = "COMPLETE";
      state.westStatus = "COMPLETE";
      state.updatedAt = nowIso();

      addNote(state, "WEST_RENDERED_READ_COMPLETE_BY_STRICT_RUNTIME_ENDPOINT_FAMILY_READER");

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.westStatus = "FAILED";
      state.westRenderedReadComplete = "false";
      state.westRenderedReadStatus = "FAILED";
      state.diagnosticTargetAccessStatus = state.diagnosticTargetAccessStatus || "UNKNOWN";
      state.diagnosticTargetAccessError = `WEST_RENDERED_READ_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1200)}`;
      state.primaryCaseCandidate = "WEST_RENDERED_READ_FAILED";
      state.recommendedNextOwner = "DIAGNOSTIC_WEST";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "INSPECT_WEST_RENDERED_READ_TOP_LEVEL_ERROR";
      state.updatedAt = nowIso();
      addNote(state, state.diagnosticTargetAccessError);

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getWestReceipt() {
    return {
      childRole: "WEST_RENDERED_TARGET_AUTHORITY_PROBE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      pointerFingerFile: POINTER_SURFACE_FILE,
      pointerFingerFileLegacy: POINTER_INSPECT_FILE,
      labWestFile: LABWEST_FILE,

      strictRuntimeEndpointFamilyReaderActive: true,
      crossAuthorityContaminationGuardActive: true,
      datasetAdvisoryOnlyActive: true,
      borrowedContractTextIgnoredForEndpointProof: true,
      pointerSurfaceBishopMappingActive: true,
      pointerInspectPriestDemotionActive: true,
      inspectFileNotPrimaryChainEndpoint: true,

      acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
      acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ROUTE_CONDUCTOR_CONTRACTS.slice(),
      acceptedControlContracts: CONTROL_CONTRACTS.slice(),
      acceptedCanvasContracts: CANVAS_CONTRACTS.slice(),
      acceptedHexAuthorityContracts: HEX_AUTHORITY_CONTRACTS.slice(),
      acceptedHexSurfaceContracts: HEX_SURFACE_CONTRACTS.slice(),
      acceptedPointerSurfaceContracts: POINTER_SURFACE_CONTRACTS.slice(),
      acceptedPointerInspectContracts: POINTER_INSPECT_CONTRACTS.slice(),
      acceptedLabWestContracts: LABWEST_CONTRACTS.slice(),

      servesNorth: true,
      servesProbeWest: true,
      renderedTargetAuthorityOwned: true,
      strictRuntimeMapReadOwned: true,
      labWestBridgeReadOwned: true,
      labWestMutationOwned: false,
      labWestClassificationRunOwned: false,
      routeConductorRenderedReadOwned: true,
      controlsRenderedReadOwned: true,
      canvasPublicReceiverRenderedReadOwned: true,
      hexGateSurfaceRenderedReadOwned: true,
      pointerSurfaceBishopRenderedReadOwned: true,
      pointerInspectPriestReadOwned: true,
      productionCycleEvidenceOwned: true,
      canvasSurfaceTruthEvidenceOwned: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      case5Authority: false,
      servedSourceAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      syntheticActivationAuthorized: false,

      runWestRenderedReadApiAvailable: true,
      getWestReceiptApiAvailable: true,
      getWestStateApiAvailable: true,
      getStatusApiAvailable: true,
      getReportApiAvailable: true,

      lastWestStatus: lastEvidencePacket ? lastEvidencePacket.WEST_STATUS : "READY",
      lastWestRenderedReadStatus: lastEvidencePacket ? lastEvidencePacket.WEST_RENDERED_READ_STATUS : "WAITING_RUN",
      lastStrictRuntimeMapClean: lastEvidencePacket ? lastEvidencePacket.STRICT_RUNTIME_MAP_CLEAN : false,
      lastCrossAuthorityContaminationCount: lastEvidencePacket ? lastEvidencePacket.CROSS_AUTHORITY_CONTAMINATION_COUNT : 0,
      lastFirstCrossAuthorityContaminationOwner: lastEvidencePacket ? lastEvidencePacket.FIRST_CROSS_AUTHORITY_CONTAMINATION_OWNER : "NONE",
      lastLabWestConnectionStatus: lastEvidencePacket ? lastEvidencePacket.LABWEST_DIAGNOSTIC_TRACK_CONNECTION_STATUS : "UNKNOWN",
      lastCanvasSurfaceTruthStatus: lastEvidencePacket ? lastEvidencePacket.CANVAS_SURFACE_TRUTH_STATUS : "UNKNOWN",
      lastCanvasTruthFailureClass: lastEvidencePacket ? lastEvidencePacket.CANVAS_TRUTH_FAILURE_CLASS : "UNKNOWN",
      lastProductionCycleStatus: lastEvidencePacket ? lastEvidencePacket.PRODUCTION_CYCLE_STATUS : "UNKNOWN",
      lastVisiblePlanetProofReady: lastEvidencePacket ? lastEvidencePacket.VISIBLE_PLANET_PROOF_READY : "UNKNOWN",
      lastRecommendedNextFile: lastEvidencePacket ? lastEvidencePacket.RECOMMENDED_NEXT_FILE : "UNKNOWN",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: nowIso()
    };
  }

  function getWestState() {
    return clonePlain(lastState || makeState());
  }

  function getStatus() {
    return clonePlain(lastEvidencePacket || makeEvidencePacket(makeState()));
  }

  function getReport() {
    return getStatus();
  }

  function getReceipt() {
    return getWestReceipt();
  }

  function getReceiptLight() {
    return getWestReceipt();
  }

  function publish(state) {
    lastState = clonePlain(state || makeState());
    lastEvidencePacket = makeEvidencePacket(lastState);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticWest = api;
    root.HEARTH.diagnosticRailWest = api;
    root.HEARTH.diagnosticWestCanvasExpressionRenderedRangeObservatory = api;
    root.HEARTH.diagnosticWestStrictRuntimeEndpointFamilyReader = api;
    root.HEARTH.diagnosticWestEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticRailWestEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticWestReceipt = getWestReceipt();
    root.HEARTH.diagnosticRailWestReceipt = getWestReceipt();

    root.DEXTER_LAB.hearthDiagnosticWest = api;
    root.DEXTER_LAB.hearthDiagnosticRailWest = api;
    root.DEXTER_LAB.hearthDiagnosticWestStrictRuntimeEndpointFamilyReader = api;
    root.DEXTER_LAB.hearthDiagnosticWestEvidence = clonePlain(lastEvidencePacket);
    root.DEXTER_LAB.hearthDiagnosticWestReceipt = getWestReceipt();

    root.HEARTH_DIAGNOSTIC_WEST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_WEST = api;
    root.HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY = api;
    root.HEARTH_DIAGNOSTIC_WEST_STRICT_RUNTIME_ENDPOINT_FAMILY_READER = api;
    root.HEARTH_DIAGNOSTIC_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_WEST_RECEIPT = getWestReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_WEST_RECEIPT = getWestReceipt();

    try {
      const documentRef = root.document || null;
      if (documentRef && documentRef.documentElement && documentRef.documentElement.dataset) {
        const ds = documentRef.documentElement.dataset;
        ds.hearthDiagnosticWestLoaded = "true";
        ds.hearthDiagnosticWestContract = CONTRACT;
        ds.hearthDiagnosticWestReceipt = RECEIPT;
        ds.hearthDiagnosticWestImplementationContract = IMPLEMENTATION_CONTRACT;
        ds.hearthDiagnosticWestStrictRuntimeEndpointFamilyReaderActive = "true";
        ds.hearthDiagnosticWestCrossAuthorityContaminationGuardActive = "true";
        ds.hearthDiagnosticWestDatasetAdvisoryOnlyActive = "true";
        ds.hearthDiagnosticWestLastStatus = lastEvidencePacket.WEST_STATUS;
        ds.hearthDiagnosticWestLastRenderedReadStatus = lastEvidencePacket.WEST_RENDERED_READ_STATUS;
        ds.hearthDiagnosticWestLastStrictRuntimeMapClean = String(lastEvidencePacket.STRICT_RUNTIME_MAP_CLEAN);
        ds.hearthDiagnosticWestLastCrossAuthorityContaminationCount = String(lastEvidencePacket.CROSS_AUTHORITY_CONTAMINATION_COUNT);
        ds.hearthDiagnosticWestLastCanvasSurfaceTruthStatus = lastEvidencePacket.CANVAS_SURFACE_TRUTH_STATUS;
      }
    } catch (_error) {}

    return api;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,
    pointerFingerFile: POINTER_SURFACE_FILE,
    pointerFingerFileLegacy: POINTER_INSPECT_FILE,
    labWestFile: LABWEST_FILE,

    acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
    acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
    acceptedRouteConductorContracts: ROUTE_CONDUCTOR_CONTRACTS.slice(),
    acceptedControlContracts: CONTROL_CONTRACTS.slice(),
    acceptedCanvasContracts: CANVAS_CONTRACTS.slice(),
    acceptedHexAuthorityContracts: HEX_AUTHORITY_CONTRACTS.slice(),
    acceptedHexSurfaceContracts: HEX_SURFACE_CONTRACTS.slice(),
    acceptedPointerSurfaceContracts: POINTER_SURFACE_CONTRACTS.slice(),
    acceptedPointerInspectContracts: POINTER_INSPECT_CONTRACTS.slice(),
    acceptedLabWestContracts: LABWEST_CONTRACTS.slice(),

    runWestRenderedRead,
    run: runWestRenderedRead,
    read: runWestRenderedRead,
    inspect: runWestRenderedRead,
    getWestReceipt,
    getWestState,
    getStatus,
    getReport,
    getReceipt,
    getReceiptLight,

    supportsStrictRuntimeEndpointFamilyReader: true,
    supportsCrossAuthorityContaminationGuard: true,
    supportsDatasetAdvisoryOnly: true,
    supportsBorrowedContractTextDemotion: true,
    supportsLabWestChronologyCycleBridge: true,
    supportsLabWestSafeReceiptRead: true,
    supportsRouteControlsCanvasHexPointerCanvasCycleRead: true,
    supportsPointerSurfaceBishopGate: true,
    supportsPointerInspectPriestDemotion: true,
    supportsCanvasSurfaceTruthEvidence: true,
    supportsCanvasDomSurfaceRead: true,
    supportsCanvasPixelSampleReadWhenSafe: true,
    supportsNoLifecycleIgnition: true,
    supportsNorthOnlyFinalAdjudication: true,

    ownsRenderedTargetEvidence: true,
    ownsStrictRuntimeMapRead: true,
    ownsLabWestBridgeRead: true,
    ownsProductionCycleEvidence: true,
    ownsCanvasSurfaceTruthEvidence: true,
    ownsFinalPrimaryCase: false,
    ownsFinalRecommendation: false,
    ownsCase5: false,
    ownsServedSourceAuthority: false,
    ownsRepair: false,
    ownsProductionMutation: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsF13: false,
    ownsF21: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
