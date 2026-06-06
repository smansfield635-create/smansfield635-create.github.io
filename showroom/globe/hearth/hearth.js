// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10
// Internal controlled renewal:
// HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3
// Full-file replacement.
// Route Conductor / North Bishop command authority only.
// Purpose:
// - Preserve served v10 public contract for EAST/NORTH diagnostic expectations.
// - Preserve v10_2 Hex Gate / Pointer Finger transmission lineage.
// - Add a definitive governed-source-stack admission gate before Canvas release.
// - Stop treating Canvas surface truth as source truth.
// - Prove whether the visible globe is receiving governed Hearth source truth or a Canvas fallback.
// - Admit and verify the source stack in chronological order:
//   elevation -> composition -> tectonics -> hydrology -> materials -> land/water/air child channels.
// - Publish a governed source packet only when required source authorities are observed.
// - Deliver governed source packets to Canvas only through public APIs.
// - Report a coordinate-specific choke point:
//   1. missing source file,
//   2. source observed but not ready,
//   3. Canvas source consumer missing,
//   4. Canvas using generic fallback receiver,
//   5. Hex/Pointer downstream gap.
// - Preserve motion/controls and existing visible Canvas surface.
// - Keep fallback visible surface lawful only as SOURCE_HELD / GOVERNED_SOURCE_PACKET_NOT_CONSUMED.
// - Do not mutate Canvas internals, Hex Surface internals, pointer-finger internals, diagnostics, HTML, or index.js.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - index priest / button authority implementation
// - diagnostic rail case selection
// - Queen/control implementation
// - Canvas drawing implementation
// - Canvas source rendering implementation
// - Hex rendering implementation
// - Hex authority truth
// - pointer-finger implementation truth
// - terrain/hydrology/elevation/material source generation
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10";

  const RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3";
  const RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT_v10_3";

  const PREVIOUS_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2";
  const PREVIOUS_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT_v10_2";

  const LINEAGE_V10_1_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1";
  const LINEAGE_V9_9_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const LINEAGE_V9_8_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const LINEAGE_V9_7_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const LINEAGE_V9_6_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const LINEAGE_V9_5_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const COMPAT_V9_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const COMPAT_V9_4_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const VERSION =
    "2026-06-06.hearth-route-conductor-governed-source-stack-admission-canvas-handoff-v10-3";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const ELEVATION_FILE = "/assets/hearth/hearth.elevation.js";
  const COMPOSITION_FILE = "/assets/hearth/hearth.composition.js";
  const TECTONICS_FILE = "/assets/hearth/hearth.tectonics.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.hydrology.js";
  const MATERIALS_FILE = "/assets/hearth/hearth.materials.js";
  const LAND_CHANNEL_FILE = "/assets/hearth/hearth.land.channel.js";
  const WATER_CHANNEL_FILE = "/assets/hearth/hearth.water.channel.js";
  const AIR_CHANNEL_FILE = "/assets/hearth/hearth.air.channel.js";

  const FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const FINGER_MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const FINGER_POINTER_FILE = "/assets/hearth/hearth.canvas.finger.pointer.js";
  const FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";

  const EXPECTED_ELEVATION_CONTRACT = "HEARTH_ELEVATION";
  const EXPECTED_COMPOSITION_CONTRACT = "HEARTH_COMPOSITION";
  const EXPECTED_TECTONICS_CONTRACT = "HEARTH_TECTONICS";
  const EXPECTED_HYDROLOGY_CONTRACT = "HEARTH_HYDROLOGY";
  const EXPECTED_MATERIALS_CONTRACT =
    "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const EXPECTED_LAND_CHANNEL_CONTRACT =
    "HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING_TNT_v1";
  const EXPECTED_WATER_CHANNEL_CONTRACT = "HEARTH_WATER_CHANNEL";
  const EXPECTED_AIR_CHANNEL_CONTRACT = "HEARTH_AIR_CHANNEL";

  const GOVERNED_SOURCE_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_PACKET_v10_3";
  const CANVAS_GOVERNED_HANDOFF_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_GOVERNED_SOURCE_HANDOFF_PACKET_v10_3";
  const SOURCE_HOLD_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_SOURCE_HELD_PACKET_v10_3";

  const CANVAS_MOUNT_SELECTOR = "#hearthCanvasMount";
  const GLOBE_STAGE_SELECTOR = "#hearthGlobeStage";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByRouteConductor: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByRouteConductor: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
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
    F21_CLAIMED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const INDEX_ALIASES = Object.freeze([
    "HEARTH_INDEX_JS",
    "HEARTH_INDEX_BRIDGE",
    "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH.indexJs",
    "HEARTH.indexBridge",
    "HEARTH.frontendButtonAuthorityReset",
    "HEARTH.buttonAuthority",
    "DEXTER_LAB.hearthIndexJs",
    "DEXTER_LAB.hearthIndexBridge",
    "DEXTER_LAB.hearthFrontendButtonAuthorityReset"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const CANVAS_ALIASES = Object.freeze([
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
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
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
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_GATE",
    "HEARTH_HEX_RENDER_GATE",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "HEARTH.hexGate",
    "HEARTH.hexRenderGate",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexGate"
  ]);

  const POINTER_FINGER_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_POINTER_FINGER",
    "HEARTH_CANVAS_FINGER_POINTER",
    "HEARTH_CANVAS_FINGER_LIGHT",
    "HEARTH_CANVAS_FINGER_BOUNDARY",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_EXPRESSION",
    "HEARTH.pointerFinger",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerPointer",
    "HEARTH.canvasFingerLight",
    "HEARTH.canvasFingerBoundary",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasFingerExpression",
    "DEXTER_LAB.hearthPointerFinger",
    "DEXTER_LAB.hearthCanvasPointerFinger",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerPointer",
    "DEXTER_LAB.hearthCanvasFingerLight",
    "DEXTER_LAB.hearthCanvasFingerBoundary",
    "DEXTER_LAB.hearthCanvasFingerSurface"
  ]);

  const SOURCE_STACK = Object.freeze([
    {
      order: 1,
      id: "ELEVATION",
      file: ELEVATION_FILE,
      expectedContract: EXPECTED_ELEVATION_CONTRACT,
      family: "HEARTH_ELEVATION",
      required: true,
      role: "governed-elevation-source",
      aliases: [
        "HEARTH_ELEVATION",
        "HEARTH_ELEVATION_AUTHORITY",
        "HEARTH_ELEVATION_SOURCE",
        "HEARTH.elevation",
        "HEARTH.elevationAuthority",
        "HEARTH.elevationSource",
        "DEXTER_LAB.hearthElevation",
        "DEXTER_LAB.hearthElevationAuthority",
        "DEXTER_LAB.hearthElevationSource"
      ],
      datasetContractKeys: [
        "hearthElevationContract",
        "hearthElevationAuthorityContract",
        "hearthSouthElevationContract"
      ],
      datasetReadyKeys: [
        "hearthElevationReady",
        "hearthElevationLoaded",
        "hearthElevationSourceReady"
      ]
    },
    {
      order: 2,
      id: "COMPOSITION",
      file: COMPOSITION_FILE,
      expectedContract: EXPECTED_COMPOSITION_CONTRACT,
      family: "HEARTH_COMPOSITION",
      required: true,
      role: "governed-composition-source",
      aliases: [
        "HEARTH_COMPOSITION",
        "HEARTH_COMPOSITION_AUTHORITY",
        "HEARTH_COMPOSITION_SOURCE",
        "HEARTH.composition",
        "HEARTH.compositionAuthority",
        "HEARTH.compositionSource",
        "DEXTER_LAB.hearthComposition",
        "DEXTER_LAB.hearthCompositionAuthority",
        "DEXTER_LAB.hearthCompositionSource"
      ],
      datasetContractKeys: [
        "hearthCompositionContract",
        "hearthCompositionAuthorityContract",
        "hearthSouthCompositionContract"
      ],
      datasetReadyKeys: [
        "hearthCompositionReady",
        "hearthCompositionLoaded",
        "hearthCompositionSourceReady"
      ]
    },
    {
      order: 3,
      id: "TECTONICS",
      file: TECTONICS_FILE,
      expectedContract: EXPECTED_TECTONICS_CONTRACT,
      family: "HEARTH_TECTONICS",
      required: true,
      role: "governed-tectonics-source",
      aliases: [
        "HEARTH_TECTONICS",
        "HEARTH_TECTONIC_AUTHORITY",
        "HEARTH_TECTONICS_AUTHORITY",
        "HEARTH_TECTONICS_SOURCE",
        "HEARTH.tectonics",
        "HEARTH.tectonicAuthority",
        "HEARTH.tectonicsAuthority",
        "HEARTH.tectonicsSource",
        "DEXTER_LAB.hearthTectonics",
        "DEXTER_LAB.hearthTectonicAuthority",
        "DEXTER_LAB.hearthTectonicsAuthority"
      ],
      datasetContractKeys: [
        "hearthTectonicsContract",
        "hearthTectonicContract",
        "hearthTectonicsAuthorityContract"
      ],
      datasetReadyKeys: [
        "hearthTectonicsReady",
        "hearthTectonicsLoaded",
        "hearthTectonicsSourceReady"
      ]
    },
    {
      order: 4,
      id: "HYDROLOGY",
      file: HYDROLOGY_FILE,
      expectedContract: EXPECTED_HYDROLOGY_CONTRACT,
      family: "HEARTH_HYDROLOGY",
      required: true,
      role: "governed-hydrology-source",
      aliases: [
        "HEARTH_HYDROLOGY",
        "HEARTH_HYDROLOGY_AUTHORITY",
        "HEARTH_HYDROLOGY_SOURCE",
        "HEARTH.hydrology",
        "HEARTH.hydrologyAuthority",
        "HEARTH.hydrologySource",
        "DEXTER_LAB.hearthHydrology",
        "DEXTER_LAB.hearthHydrologyAuthority",
        "DEXTER_LAB.hearthHydrologySource"
      ],
      datasetContractKeys: [
        "hearthHydrologyContract",
        "hearthHydrologyAuthorityContract",
        "hearthSouthHydrologyContract"
      ],
      datasetReadyKeys: [
        "hearthHydrologyReady",
        "hearthHydrologyLoaded",
        "hearthHydrologySourceReady",
        "atlasReady"
      ]
    },
    {
      order: 5,
      id: "MATERIALS",
      file: MATERIALS_FILE,
      expectedContract: EXPECTED_MATERIALS_CONTRACT,
      family: "HEARTH_MATERIALS",
      required: true,
      role: "governed-material-source",
      aliases: [
        "HEARTH_MATERIALS",
        "HEARTH_MATERIALS_AUTHORITY",
        "HEARTH_MATERIAL_SOURCE",
        "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS",
        "HEARTH.materials",
        "HEARTH.materialsAuthority",
        "HEARTH.materialSource",
        "HEARTH.nineSummits256GlobalMapMaterials",
        "DEXTER_LAB.hearthMaterials",
        "DEXTER_LAB.hearthMaterialsAuthority",
        "DEXTER_LAB.hearthNineSummits256GlobalMapMaterials"
      ],
      datasetContractKeys: [
        "hearthMaterialsContract",
        "hearthMaterialsAuthorityContract",
        "hearthSouthMaterialsContract"
      ],
      datasetReadyKeys: [
        "hearthMaterialsReady",
        "hearthMaterialsLoaded",
        "hearthMaterialsSourceReady",
        "materialClassesReady",
        "atlasReady"
      ]
    },
    {
      order: 6,
      id: "LAND_CHANNEL",
      file: LAND_CHANNEL_FILE,
      expectedContract: EXPECTED_LAND_CHANNEL_CONTRACT,
      family: "HEARTH_LAND",
      required: false,
      role: "land-child-channel",
      aliases: [
        "HEARTH_LAND_CHANNEL",
        "HEARTH_LAND_CHANNEL_AUTHORITY",
        "HEARTH_LAND_CORE_EXPANSION_OPAQUE_BODY_BINDING",
        "HEARTH.landChannel",
        "HEARTH.landChannelAuthority",
        "HEARTH.landCoreExpansionOpaqueBodyBinding",
        "DEXTER_LAB.hearthLandChannel",
        "DEXTER_LAB.hearthLandChannelAuthority"
      ],
      datasetContractKeys: [
        "hearthLandChannelContract",
        "hearthLandAuthorityContract"
      ],
      datasetReadyKeys: [
        "hearthLandChannelReady",
        "hearthLandChannelLoaded",
        "landChannelLoaded"
      ]
    },
    {
      order: 7,
      id: "WATER_CHANNEL",
      file: WATER_CHANNEL_FILE,
      expectedContract: EXPECTED_WATER_CHANNEL_CONTRACT,
      family: "HEARTH_WATER",
      required: false,
      role: "water-child-channel",
      aliases: [
        "HEARTH_WATER_CHANNEL",
        "HEARTH_WATER_CHANNEL_AUTHORITY",
        "HEARTH.waterChannel",
        "HEARTH.waterChannelAuthority",
        "DEXTER_LAB.hearthWaterChannel",
        "DEXTER_LAB.hearthWaterChannelAuthority"
      ],
      datasetContractKeys: [
        "hearthWaterChannelContract",
        "hearthWaterAuthorityContract"
      ],
      datasetReadyKeys: [
        "hearthWaterChannelReady",
        "hearthWaterChannelLoaded",
        "waterChannelLoaded"
      ]
    },
    {
      order: 8,
      id: "AIR_CHANNEL",
      file: AIR_CHANNEL_FILE,
      expectedContract: EXPECTED_AIR_CHANNEL_CONTRACT,
      family: "HEARTH_AIR",
      required: false,
      role: "air-child-channel",
      aliases: [
        "HEARTH_AIR_CHANNEL",
        "HEARTH_AIR_CHANNEL_AUTHORITY",
        "HEARTH.airChannel",
        "HEARTH.airChannelAuthority",
        "DEXTER_LAB.hearthAirChannel",
        "DEXTER_LAB.hearthAirChannelAuthority"
      ],
      datasetContractKeys: [
        "hearthAirChannelContract",
        "hearthAirAuthorityContract"
      ],
      datasetReadyKeys: [
        "hearthAirChannelReady",
        "hearthAirChannelLoaded",
        "airChannelLoaded"
      ]
    }
  ]);

  const TRANSMISSION_PATH = Object.freeze([
    INDEX_FILE,
    FILE,
    "GOVERNED_SOURCE_STACK",
    CONTROL_FILE,
    CANVAS_FILE,
    HEX_SURFACE_FILE,
    FINGER_INSPECT_FILE
  ]);

  const NEWS_CYCLES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS",
    TRANSMISSION_EXTENSION:
      "INDEX_ROUTE_GOVERNED_SOURCE_STACK_QUEEN_CANVAS_HEX_GATE_POINTER_FINGER"
  });

  const ACTIVE_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    CONTRACT,
    RENEWAL_CONTRACT,
    PREVIOUS_CONTRACT,
    LINEAGE_V10_1_CONTRACT,
    LINEAGE_V9_9_CONTRACT,
    LINEAGE_V9_8_CONTRACT,
    LINEAGE_V9_7_CONTRACT,
    LINEAGE_V9_6_CONTRACT,
    LINEAGE_V9_5_CONTRACT,
    COMPAT_V9_4_CONTRACT
  ]);

  const ACTIVE_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const SCRIPT_IDS = Object.freeze({
    elevation: "hearth-route-conductor-v10-3-admitted-elevation-script",
    composition: "hearth-route-conductor-v10-3-admitted-composition-script",
    tectonics: "hearth-route-conductor-v10-3-admitted-tectonics-script",
    hydrology: "hearth-route-conductor-v10-3-admitted-hydrology-script",
    materials: "hearth-route-conductor-v10-3-admitted-materials-script",
    land: "hearth-route-conductor-v10-3-admitted-land-channel-script",
    water: "hearth-route-conductor-v10-3-admitted-water-channel-script",
    air: "hearth-route-conductor-v10-3-admitted-air-channel-script",
    control: "hearth-route-conductor-v10-3-admitted-controls-script",
    canvas: "hearth-route-conductor-v10-3-admitted-canvas-script",
    hexAuthority: "hearth-route-conductor-v10-3-admitted-hex-authority-script",
    hexSurface: "hearth-route-conductor-v10-3-admitted-hex-surface-script",
    pointerFinger: "hearth-route-conductor-v10-3-admitted-pointer-finger-script"
  });

  const STRONG_CANVAS_SOURCE_RECEIVERS = Object.freeze([
    "receiveGovernedSourceStackPacket",
    "consumeGovernedSourceStackPacket",
    "acceptGovernedSourceStackPacket",
    "receiveGovernedSourcePacket",
    "consumeGovernedSourcePacket",
    "acceptGovernedSourcePacket",
    "receiveSourceStackPacket",
    "consumeSourceStackPacket",
    "acceptSourceStackPacket",
    "receiveSourceTruthPacket",
    "consumeSourceTruthPacket",
    "receiveRouteConductorGovernedSourcePacket",
    "consumeRouteConductorGovernedSourcePacket",
    "receiveRouteConductorSourceStackPacket",
    "consumeRouteConductorSourceStackPacket",
    "receiveRouteConductorCanvasGovernedHandoffPacket",
    "consumeRouteConductorCanvasGovernedHandoffPacket"
  ]);

  const WEAK_CANVAS_PACKET_RECEIVERS = Object.freeze([
    "receiveRouteConductorReleasePacket",
    "consumeRouteConductorReleasePacket",
    "receiveReleasePacket",
    "consumeReleasePacket",
    "acceptReleasePacket",
    "receivePacket",
    "receiveCanvasViewPacket",
    "receiveControlPacket",
    "drawInteractiveFrame",
    "drawPairFrame"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,

    route: ROUTE,
    file: FILE,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "ROUTE_CONDUCTOR_V10_3_LOADED",

    governedSourceStackGateActive: true,
    governedSourceStackRequiredBeforeCanvasRelease: true,
    canvasSurfaceTruthIsNotSourceTruth: true,

    sourceStackStatus: "WAITING_BOOT",
    sourceStackReady: false,
    sourceStackRequiredCount: 0,
    sourceStackRequiredReadyCount: 0,
    sourceStackObservedCount: 0,
    sourceStackReadyCount: 0,
    sourceStackFirstFailedId: "WAITING_BOOT",
    sourceStackFirstFailedFile: FILE,
    sourceStackFirstFailureClass: "WAITING_BOOT",
    sourceStackFirstFailureReason: "WAITING_BOOT",

    sourceHoldActive: true,
    sourceHoldReason: "WAITING_BOOT",
    fallbackVisibleAllowed: true,
    fallbackVisibleReason: "WAITING_SOURCE_STACK_AUDIT",
    fallbackIsNotGovernedSource: true,

    indexObserved: false,
    controlObserved: false,
    canvasObserved: false,
    hexAuthorityObserved: false,
    hexSurfaceObserved: false,
    pointerFingerObserved: false,

    canvasSurfaceTruthConfirmed: false,
    canvasElementFound: false,
    canvasMountFound: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasContext2DReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasVisiblePixelCount: 0,

    governedSourcePacketComposed: false,
    governedSourcePacketPublished: false,
    governedSourcePacketDeliveredToCanvas: false,
    governedSourcePacketAcceptedByCanvas: false,
    canvasGovernedSourceReceiverMethod: "NONE",
    canvasGovernedSourceDeliveryStatus: "WAITING_BOOT",
    canvasGovernedSourceDeliveryReason: "WAITING_BOOT",

    controlHandshakeDelivered: false,
    controlHandshakeAccepted: false,
    canvasReleaseDelivered: false,
    canvasReleaseAccepted: false,
    canvasReleaseHeld: true,
    canvasReleaseHoldReason: "WAITING_BOOT",
    hexGateTransmissionDelivered: false,
    hexGateTransmissionAccepted: false,
    pointerFingerAdmissionDelivered: false,
    pointerFingerAdmissionAccepted: false,

    currentPacket: null,
    currentReceiptText: "",
    currentGovernedSourcePacket: null,
    currentSourceHoldPacket: null,
    currentControlHandshakePacket: null,
    currentCanvasHandoffPacket: null,
    currentHexGateTransmissionPacket: null,
    currentPointerFingerTransmissionPacket: null,

    chronologicalGateCount: 0,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: "WAITING_BOOT",
    chronologicalFirstFailedCoordinate: "WAITING_BOOT",

    transmissionCommanded: false,
    transmissionCommended: false,
    transmissionHoldReason: "WAITING_BOOT",

    recommendedNextOwner: "ROUTE_CONDUCTOR",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_ROUTE_CONDUCTOR",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LOADED",

    receiptPublishCount: 0,
    eventCount: 0,
    errorCount: 0,
    watchdogTicks: 0,
    renderCount: 0,

    events: [],
    errors: [],

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  };

  let bootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;

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

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "ROUTE_CONDUCTOR_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 180);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ROUTE_CONDUCTOR_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 120);
    state.errorCount = state.errors.length;
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function q(selector) {
    if (!doc) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector) {
    if (!doc) return [];

    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function scriptByPath(path) {
    if (!doc) return null;

    return qa("script[src]").find((script) => {
      const src = safeString(script.getAttribute("src"), "");

      try {
        const base = root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com";
        const url = new URL(src, base);
        return url.pathname === path || url.pathname.endsWith(path);
      } catch (_error) {
        return src.includes(path);
      }
    }) || null;
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

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getSourceReceipt",
      "getSourcePacket",
      "getElevationReceipt",
      "getCompositionReceipt",
      "getTectonicsReceipt",
      "getHydrologyReceipt",
      "getMaterialsReceipt",
      "getLandChannelReceipt",
      "getWaterChannelReceipt",
      "getAirChannelReceipt",
      "getControlReceipt",
      "getControlSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getHexSurfaceReceipt",
      "getHexAuthorityReceipt",
      "getPointerFingerReceipt",
      "getFingerReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.sourceReceipt)) return authority.sourceReceipt;
    if (isObject(authority.sourcePacket)) return authority.sourcePacket;
    if (isObject(authority.elevationReceipt)) return authority.elevationReceipt;
    if (isObject(authority.compositionReceipt)) return authority.compositionReceipt;
    if (isObject(authority.tectonicsReceipt)) return authority.tectonicsReceipt;
    if (isObject(authority.hydrologyReceipt)) return authority.hydrologyReceipt;
    if (isObject(authority.materialsReceipt)) return authority.materialsReceipt;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(receipt, authority, datasetKeys = []) {
    const dsValues = datasetKeys.map((key) => datasetValue(key));

    return firstNonEmpty(
      readField(receipt, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexSurfaceContract",
        "pointerFingerContract",
        "fingerContract",
        "sourceContract",
        "elevationContract",
        "compositionContract",
        "tectonicsContract",
        "hydrologyContract",
        "materialsContract",
        "landChannelContract",
        "waterChannelContract",
        "airChannelContract",
        "contract",
        "CONTRACT"
      ]),
      authority && authority.contract,
      authority && authority.CONTRACT,
      ...dsValues
    );
  }

  function receiptOf(receipt, authority, datasetKeys = []) {
    const dsValues = datasetKeys.map((key) => datasetValue(key));

    return firstNonEmpty(
      readField(receipt, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexSurfaceReceipt",
        "pointerFingerReceipt",
        "fingerReceipt",
        "sourceReceipt",
        "elevationReceipt",
        "compositionReceipt",
        "tectonicsReceipt",
        "hydrologyReceipt",
        "materialsReceipt",
        "landChannelReceipt",
        "waterChannelReceipt",
        "airChannelReceipt",
        "receipt",
        "RECEIPT"
      ]),
      authority && authority.receipt,
      authority && authority.RECEIPT,
      ...dsValues
    );
  }

  function recognizedContract(contract, expected, family) {
    const text = safeString(contract);

    if (!text) return false;
    if (text === expected) return true;
    if (family && text.includes(family)) return true;
    if (family === "HEARTH_CANVAS" && ACTIVE_CANVAS_CONTRACTS.includes(text)) return true;
    if (expected && expected !== "UNKNOWN" && text.includes(expected)) return true;

    return false;
  }

  function sourceReadyFromReceipt(receipt, authority, config) {
    const readyFields = [
      "ready",
      "sourceReady",
      "sourceStackReady",
      "authorityReady",
      "loaded",
      "booted",
      "atlasReady",
      "imageRendered",
      "surfaceParentReady",
      "materialClassesReady",
      "terrainReady",
      "hydrologyReady",
      "compositionReady",
      "elevationReady",
      "tectonicsReady",
      "channelReady",
      "landChannelLoaded",
      "waterChannelLoaded",
      "airChannelLoaded",
      "runComplete",
      "complete"
    ];

    for (const field of readyFields) {
      const value = readField(receipt, [field], "");
      if (safeBool(value, false)) return true;
    }

    for (const key of config.datasetReadyKeys || []) {
      if (safeBool(datasetValue(key), false)) return true;
    }

    if (authority && isObject(authority)) {
      const candidateKeys = [
        "map",
        "atlas",
        "cells",
        "tiles",
        "samples",
        "states",
        "materials",
        "hydrology",
        "composition",
        "elevation",
        "tectonics",
        "packet",
        "sourcePacket",
        "receipt"
      ];

      for (const key of candidateKeys) {
        const value = authority[key];

        if (Array.isArray(value) && value.length > 0) return true;
        if (isObject(value) && Object.keys(value).length > 0) return true;
      }
    }

    return false;
  }

  function scanKnownContainersForFamily(family) {
    const containers = [
      { name: "window", value: root },
      { name: "HEARTH", value: root.HEARTH },
      { name: "DEXTER_LAB", value: root.DEXTER_LAB }
    ];

    const familyText = safeString(family).toUpperCase();

    for (const container of containers) {
      if (!container.value || !isObject(container.value)) continue;

      let keys = [];

      try {
        keys = Object.keys(container.value);
      } catch (_error) {
        keys = [];
      }

      for (const key of keys) {
        let value = null;

        try {
          value = container.value[key];
        } catch (_error) {
          value = null;
        }

        if (!value || (!isObject(value) && !isFunction(value))) continue;

        const receipt = readAuthorityReceipt(value) || {};
        const contract = contractOf(receipt, value);
        const receiptName = receiptOf(receipt, value);
        const combined = `${key} ${contract} ${receiptName}`.toUpperCase();

        if (combined.includes(familyText)) {
          return {
            path: container.name === "window" ? key : `${container.name}.${key}`,
            value
          };
        }
      }
    }

    return { path: "NONE", value: null };
  }

  function authoritySummary(config) {
    let found = firstGlobal(config.aliases || []);

    if (!found.value && config.family) {
      found = scanKnownContainersForFamily(config.family);
    }

    const receipt = readAuthorityReceipt(found.value) || {};
    const contract = contractOf(receipt, found.value, config.datasetContractKeys || []);
    const receiptName = receiptOf(receipt, found.value, config.datasetReceiptKeys || []);
    const script = scriptByPath(config.file);

    const contractRecognized = config.recognize
      ? config.recognize(contract, receipt, found.value)
      : recognizedContract(contract, config.expectedContract, config.family);

    const observed = Boolean(
      found.value ||
      contract ||
      receiptName ||
      script ||
      (config.extraObserved && config.extraObserved(receipt, found.value))
    );

    const publicApiReady = Boolean(
      found.value &&
      config.receiverMethods &&
      config.receiverMethods.some((method) => isFunction(found.value[method]))
    );

    const receiverMethod = found.value && config.receiverMethods
      ? (config.receiverMethods.find((method) => isFunction(found.value[method])) || "NONE")
      : "NONE";

    return {
      id: config.id,
      order: config.order || 0,
      role: config.role || "",
      file: config.file,
      required: config.required === true,
      expectedContract: config.expectedContract || "UNKNOWN",
      family: config.family || "",
      sourcePath: found.path,
      authority: found.value,
      receiptObject: receipt,
      observed,
      scriptPresent: Boolean(script),
      scriptSrc: script ? safeString(script.getAttribute("src")) : "",
      contract: contract || "UNKNOWN",
      receipt: receiptName || "UNKNOWN",
      contractRecognized,
      publicApiReady,
      receiverMethod
    };
  }

  function readSourceSummary(config) {
    const summary = authoritySummary({
      ...config,
      extraObserved: () => {
        for (const key of config.datasetReadyKeys || []) {
          if (datasetValue(key) !== "") return true;
        }
        return false;
      }
    });

    const ready = Boolean(
      summary.observed &&
      (
        summary.contractRecognized ||
        sourceReadyFromReceipt(summary.receiptObject, summary.authority, config)
      )
    );

    let status = "SOURCE_NOT_OBSERVED";
    let failureClass = "SOURCE_FILE_NOT_OBSERVED";
    let failureReason = `${config.id}_AUTHORITY_NOT_OBSERVED`;

    if (summary.observed && !ready) {
      status = "SOURCE_OBSERVED_NOT_READY";
      failureClass = "SOURCE_OBSERVED_BUT_READINESS_NOT_PROVEN";
      failureReason = `${config.id}_OBSERVED_BUT_NO_READY_RECEIPT_OR_RECOGNIZED_CONTRACT`;
    }

    if (ready) {
      status = "SOURCE_READY";
      failureClass = "NONE";
      failureReason = "NONE";
    }

    return {
      ...summary,
      ready,
      status,
      failureClass,
      failureReason,
      sourceOwnsTruth: true,
      routeConductorOwnsSourceTruth: false,
      canvasOwnsSourceTruth: false,
      ...NO_CLAIMS
    };
  }

  function readSourceStackSummary() {
    const sources = SOURCE_STACK.map(readSourceSummary);
    const required = sources.filter((source) => source.required);
    const requiredReady = required.filter((source) => source.ready);
    const observed = sources.filter((source) => source.observed);
    const ready = sources.filter((source) => source.ready);
    const firstFailedRequired = required.find((source) => !source.ready) || null;

    const optionalObserved = sources.filter((source) => !source.required && source.observed);
    const optionalReady = sources.filter((source) => !source.required && source.ready);

    let status = "GOVERNED_SOURCE_STACK_READY";
    let firstFailedId = "NONE";
    let firstFailedFile = "NONE";
    let firstFailureClass = "NONE";
    let firstFailureReason = "NONE";
    let sourceHoldReason = "NONE";
    let readyForCanvas = true;

    if (firstFailedRequired) {
      status = "GOVERNED_SOURCE_STACK_HELD";
      firstFailedId = firstFailedRequired.id;
      firstFailedFile = firstFailedRequired.file;
      firstFailureClass = firstFailedRequired.failureClass;
      firstFailureReason = firstFailedRequired.failureReason;
      sourceHoldReason = `${firstFailedRequired.id}:${firstFailedRequired.failureClass}`;
      readyForCanvas = false;
    }

    const detailGrade = optionalReady.length >= 2
      ? "CHILD_CHANNEL_DETAIL_AVAILABLE"
      : optionalObserved.length > 0
        ? "CHILD_CHANNEL_DETAIL_PARTIAL"
        : "PARENT_SOURCE_ONLY_OR_CHILD_CHANNELS_MISSING";

    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_SUMMARY_v10_3",
      status,
      readyForCanvas,
      requiredCount: required.length,
      requiredReadyCount: requiredReady.length,
      observedCount: observed.length,
      readyCount: ready.length,
      optionalObservedCount: optionalObserved.length,
      optionalReadyCount: optionalReady.length,
      detailGrade,
      firstFailedId,
      firstFailedFile,
      firstFailureClass,
      firstFailureReason,
      sourceHoldReason,
      sources: sources.map((source) => ({
        id: source.id,
        order: source.order,
        role: source.role,
        file: source.file,
        required: source.required,
        observed: source.observed,
        ready: source.ready,
        status: source.status,
        sourcePath: source.sourcePath,
        scriptPresent: source.scriptPresent,
        scriptSrc: source.scriptSrc,
        contract: source.contract,
        receipt: source.receipt,
        contractRecognized: source.contractRecognized,
        failureClass: source.failureClass,
        failureReason: source.failureReason
      })),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function readIndexSummary() {
    const summary = authoritySummary({
      id: "INDEX_PRIEST",
      file: INDEX_FILE,
      aliases: INDEX_ALIASES,
      expectedContract: EXPECTED_INDEX_CONTRACT,
      family: "HEARTH_INDEX_JS",
      datasetContractKeys: ["hearthIndexJsContract"],
      extraObserved: () =>
        datasetValue("hearthIndexJsLoaded") === "true" ||
        datasetValue("hearthFrontendButtonAuthorityRestored") === "true" ||
        datasetValue("hearthIndexPassiveButtonCorridorActive") === "true"
    });

    summary.passiveButtonCorridorActive = Boolean(
      safeBool(readField(summary.receiptObject, [
        "passiveButtonCorridorActive",
        "passiveReceiptCorridorActive"
      ], false), false) ||
      datasetValue("hearthIndexPassiveButtonCorridorActive") === "true" ||
      summary.observed
    );

    state.indexObserved = summary.observed;
    return summary;
  }

  function readControlSummary() {
    const summary = authoritySummary({
      id: "CONTROLS_QUEEN",
      file: CONTROL_FILE,
      aliases: CONTROL_ALIASES,
      expectedContract: EXPECTED_CONTROL_CONTRACT,
      family: "HEARTH_CONTROLS",
      datasetContractKeys: [
        "hearthControlContract",
        "hearthControlsContract",
        "hearthSouthControlFileContract"
      ],
      datasetReceiptKeys: [
        "hearthControlReceipt",
        "hearthControlsReceipt",
        "hearthSouthControlFileReceipt"
      ],
      receiverMethods: [
        "consumeRouteConductorControlHandshake",
        "receiveRouteConductorControlHandshake",
        "consumeControlHandshake",
        "receiveControlHandshake",
        "receiveControlHandshakePacket",
        "acceptControlHandshakePacket",
        "receiveQueenControlHandshake",
        "consumeQueenControlHandshake"
      ],
      extraObserved: () =>
        datasetValue("hearthControlsLoaded") === "true" ||
        datasetValue("hearthControlFilePresent") === "true" ||
        datasetValue("CONTROL_FILE_LOADED") === "true"
    });

    summary.handshakeAccepted = Boolean(
      safeBool(readField(summary.receiptObject, [
        "handshakeAccepted",
        "controlHandshakeAccepted",
        "controlHandshakeAcceptedByQueen",
        "routeConductorControlHandshakeAccepted",
        "inputAdmissionOpen",
        "inputBound"
      ], false), false) ||
      datasetValue("hearthControlHandshakeAccepted") === "true" ||
      datasetValue("hearthControlHandshakeAcceptedByQueen") === "true" ||
      datasetValue("CONTROL_HANDSHAKE_STATUS") === "HANDSHAKE_VALID"
    );

    state.controlObserved = summary.observed;
    return summary;
  }

  function scanCanvasSurface() {
    const empty = {
      canvasMountFound: false,
      canvasMountSelector: CANVAS_MOUNT_SELECTOR,
      canvasElementFound: false,
      canvasSelector: "UNKNOWN",
      canvasInMount: false,
      canvasRectNonzero: false,
      canvasComputedVisible: false,
      canvasContext2DReady: false,
      canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
      canvasVisiblePixelCount: 0,
      canvasSurfaceTruthConfirmed: false
    };

    if (!doc) return empty;

    const mount =
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]");

    const stage =
      doc.getElementById("hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]");

    const selectors = [
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-expression-surface='true']",
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "canvas"
    ];

    let canvas = null;
    let selector = "UNKNOWN";

    for (const candidate of selectors) {
      canvas = q(candidate);
      if (canvas) {
        selector = candidate;
        break;
      }
    }

    let rect = null;

    try {
      rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    const attrWidth = safeNumber(canvas && canvas.width, 0);
    const attrHeight = safeNumber(canvas && canvas.height, 0);
    const rectWidth = safeNumber(rect && rect.width, 0);
    const rectHeight = safeNumber(rect && rect.height, 0);
    const rectNonzero = Boolean(canvas && ((attrWidth > 0 && attrHeight > 0) || (rectWidth > 0 && rectHeight > 0)));

    let computedVisible = false;

    try {
      if (canvas && root.getComputedStyle) {
        const style = root.getComputedStyle(canvas);
        computedVisible = Boolean(
          style &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          safeNumber(style.opacity, 1) > 0
        );
      }
    } catch (_error) {
      computedVisible = rectNonzero;
    }

    let context2DReady = false;
    let pixelStatus = "NO_PIXEL_SAMPLE";
    let visiblePixelCount = 0;

    try {
      if (canvas && isFunction(canvas.getContext)) {
        const ctx = canvas.getContext("2d");
        context2DReady = Boolean(ctx);

        if (ctx && attrWidth > 0 && attrHeight > 0) {
          const points = [
            [0.16, 0.16],
            [0.34, 0.34],
            [0.50, 0.50],
            [0.66, 0.66],
            [0.84, 0.84]
          ];

          for (const point of points) {
            const x = Math.max(0, Math.min(attrWidth - 1, Math.round(attrWidth * point[0])));
            const y = Math.max(0, Math.min(attrHeight - 1, Math.round(attrHeight * point[1])));
            const data = ctx.getImageData(x, y, 1, 1).data;
            const r = data[0] || 0;
            const g = data[1] || 0;
            const b = data[2] || 0;
            const a = data[3] || 0;

            if (a > 0 && (r > 0 || g > 0 || b > 0)) visiblePixelCount += 1;
          }

          pixelStatus = visiblePixelCount > 0 ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_NO_VISIBLE_RGB";
        }
      }
    } catch (error) {
      pixelStatus = `PIXEL_SAMPLE_UNREADABLE:${safeString(error && error.message ? error.message : error).slice(0, 120)}`;
    }

    const canvasInMount = Boolean(canvas && mount && mount.contains(canvas));
    const confirmed = Boolean(canvas && rectNonzero && computedVisible && context2DReady);

    return {
      canvasMountFound: Boolean(mount || stage),
      canvasMountSelector: mount ? CANVAS_MOUNT_SELECTOR : stage ? GLOBE_STAGE_SELECTOR : "UNKNOWN",
      canvasElementFound: Boolean(canvas),
      canvasSelector: selector,
      canvasInMount,
      canvasRectNonzero: rectNonzero,
      canvasComputedVisible: computedVisible,
      canvasContext2DReady: context2DReady,
      canvasPixelSampleStatus: pixelStatus,
      canvasVisiblePixelCount: visiblePixelCount,
      canvasSurfaceTruthConfirmed: confirmed || visiblePixelCount > 0
    };
  }

  function readCanvasSummary() {
    const surface = scanCanvasSurface();

    const summary = authoritySummary({
      id: "CANVAS_RECEIVER",
      file: CANVAS_FILE,
      aliases: CANVAS_ALIASES,
      expectedContract: EXPECTED_CANVAS_CONTRACT,
      family: "HEARTH_CANVAS",
      datasetContractKeys: [
        "hearthCanvasContract",
        "hearthCanvasCurrentParentContract",
        "hearthCanvasParentContract",
        "hearthSouthCurrentCanvasParentContract"
      ],
      datasetReceiptKeys: [
        "hearthCanvasReceipt",
        "hearthCanvasCurrentParentReceipt",
        "hearthSouthCurrentCanvasParentReceipt"
      ],
      receiverMethods: STRONG_CANVAS_SOURCE_RECEIVERS.concat(WEAK_CANVAS_PACKET_RECEIVERS),
      extraObserved: () =>
        surface.canvasElementFound ||
        datasetValue("hearthCanvasLoaded") === "true" ||
        datasetValue("hearthCanvasHubActive") === "true" ||
        datasetValue("hearthCanvasExpressionHubActive") === "true"
    });

    summary.surface = surface;
    summary.surfaceTruthConfirmed = Boolean(
      surface.canvasSurfaceTruthConfirmed ||
      safeBool(readField(summary.receiptObject, [
        "visiblePlanetProofReady",
        "currentVisibleProofValid",
        "domVisiblePlanetProofReady",
        "canvasMounted",
        "canvasDrawComplete",
        "baseGlobeDrawComplete",
        "canvasPixelVisible",
        "pixelVisible"
      ], false), false) ||
      datasetValue("hearthSouthVisiblePlanetProofReady") === "true" ||
      datasetValue("CANVAS_PIXEL_VISIBLE") === "true"
    );

    summary.strongGovernedSourceReceiverMethod = summary.authority
      ? (STRONG_CANVAS_SOURCE_RECEIVERS.find((method) => isFunction(summary.authority[method])) || "NONE")
      : "NONE";

    summary.weakPacketReceiverMethod = summary.authority
      ? (WEAK_CANVAS_PACKET_RECEIVERS.find((method) => isFunction(summary.authority[method])) || "NONE")
      : "NONE";

    summary.hasStrongGovernedSourceReceiver = summary.strongGovernedSourceReceiverMethod !== "NONE";
    summary.hasWeakPacketReceiver = summary.weakPacketReceiverMethod !== "NONE";

    Object.assign(state, surface);
    state.canvasObserved = summary.observed;
    state.canvasSurfaceTruthConfirmed = summary.surfaceTruthConfirmed;

    return summary;
  }

  function readHexAuthoritySummary() {
    const summary = authoritySummary({
      id: "HEX_AUTHORITY",
      file: HEX_AUTHORITY_FILE,
      aliases: HEX_AUTHORITY_ALIASES,
      expectedContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      family: "HEARTH_HEX",
      datasetContractKeys: ["hearthHexAuthorityContract", "hearthHexFourPairAuthorityContract"],
      datasetReceiptKeys: ["hearthHexAuthorityReceipt", "hearthHexFourPairAuthorityReceipt"],
      receiverMethods: [
        "receiveRouteConductorHexGateTransmissionPacket",
        "consumeRouteConductorHexGateTransmissionPacket",
        "receiveHexGateTransmissionPacket",
        "consumeHexGateTransmissionPacket",
        "acceptHexGateTransmissionPacket",
        "getPairHandshake",
        "getAuthorityPacket"
      ],
      extraObserved: () =>
        datasetValue("hearthHexAuthorityLoaded") === "true" ||
        datasetValue("hexAuthorityLoaded") === "true"
    });

    state.hexAuthorityObserved = summary.observed;
    return summary;
  }

  function readHexSurfaceSummary() {
    const summary = authoritySummary({
      id: "HEX_SURFACE_GATE",
      file: HEX_SURFACE_FILE,
      aliases: HEX_SURFACE_ALIASES,
      expectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      family: "HEARTH_HEX_SURFACE",
      datasetContractKeys: ["hearthHexSurfaceContract", "hearthHexGateContract"],
      datasetReceiptKeys: ["hearthHexSurfaceReceipt", "hearthHexGateReceipt"],
      receiverMethods: [
        "receiveRouteConductorHexGateTransmissionPacket",
        "consumeRouteConductorHexGateTransmissionPacket",
        "receiveHexGateTransmissionPacket",
        "consumeHexGateTransmissionPacket",
        "acceptHexGateTransmissionPacket",
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket",
        "receiveCanvasViewPacket",
        "receiveViewControlPacket",
        "consumeViewControlPacket"
      ],
      extraObserved: () =>
        datasetValue("hearthHexSurfaceLoaded") === "true" ||
        datasetValue("hearthHexGateLoaded") === "true"
    });

    summary.gateReady = Boolean(summary.observed && (summary.publicApiReady || summary.contractRecognized));
    state.hexSurfaceObserved = summary.observed;
    return summary;
  }

  function readPointerFingerSummary() {
    const summary = authoritySummary({
      id: "POINTER_FINGER",
      file: FINGER_INSPECT_FILE,
      aliases: POINTER_FINGER_ALIASES,
      expectedContract: "HEARTH_CANVAS_FINGER_INSPECT",
      family: "HEARTH_CANVAS_FINGER",
      datasetContractKeys: [
        "hearthPointerFingerContract",
        "hearthCanvasFingerContract",
        "hearthCanvasFingerInspectContract"
      ],
      datasetReceiptKeys: [
        "hearthPointerFingerReceipt",
        "hearthCanvasFingerReceipt",
        "hearthCanvasFingerInspectReceipt"
      ],
      receiverMethods: [
        "receiveHexGatePointerFingerTransmissionPacket",
        "consumeHexGatePointerFingerTransmissionPacket",
        "receivePointerFingerTransmissionPacket",
        "consumePointerFingerTransmissionPacket",
        "acceptPointerFingerTransmissionPacket",
        "receiveCanvasFingerPacket",
        "consumeCanvasFingerPacket",
        "receiveInspectPacket"
      ],
      extraObserved: () =>
        datasetValue("hearthCanvasFingerObservedCount") !== "" ||
        datasetValue("hearthPointerFingerLoaded") === "true" ||
        datasetValue("hearthCanvasFingerInspectLoaded") === "true"
    });

    summary.vocabulary = {
      boundary: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_BOUNDARY", "HEARTH.canvasFingerBoundary", "DEXTER_LAB.hearthCanvasFingerBoundary"]).value || scriptByPath(FINGER_BOUNDARY_FILE)),
      mass: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_MASS", "HEARTH.canvasFingerMass", "DEXTER_LAB.hearthCanvasFingerMass"]).value || scriptByPath(FINGER_MASS_FILE)),
      surface: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_SURFACE", "HEARTH.canvasFingerSurface", "DEXTER_LAB.hearthCanvasFingerSurface"]).value || scriptByPath(FINGER_SURFACE_FILE)),
      pointer: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_POINTER", "HEARTH.canvasFingerPointer", "DEXTER_LAB.hearthCanvasFingerPointer"]).value || scriptByPath(FINGER_POINTER_FILE)),
      light: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_LIGHT", "HEARTH.canvasFingerLight", "DEXTER_LAB.hearthCanvasFingerLight"]).value || scriptByPath(FINGER_LIGHT_FILE)),
      inspect: Boolean(firstGlobal(["HEARTH_CANVAS_FINGER_INSPECT", "HEARTH.canvasFingerInspect", "DEXTER_LAB.hearthCanvasFingerInspect"]).value || scriptByPath(FINGER_INSPECT_FILE))
    };

    summary.vocabularyActive = Object.values(summary.vocabulary).some(Boolean);
    state.pointerFingerObserved = summary.observed || summary.vocabularyActive;

    return summary;
  }

  function admitScript(path, id, role, expectedContract) {
    if (!doc) {
      return {
        attempted: true,
        admitted: false,
        present: false,
        status: `${role}_ADMISSION_HELD_DOCUMENT_UNAVAILABLE`,
        reason: "DOCUMENT_UNAVAILABLE"
      };
    }

    const existing = scriptByPath(path) || (id ? doc.getElementById(id) : null);

    if (existing) {
      return {
        attempted: true,
        admitted: false,
        present: true,
        status: `${role}_SCRIPT_ALREADY_PRESENT`,
        reason: "SCRIPT_ALREADY_PRESENT",
        src: safeString(existing.getAttribute("src"))
      };
    }

    try {
      const script = doc.createElement("script");
      script.id = id;
      script.src = `${path}?v=${encodeURIComponent(expectedContract || RENEWAL_CONTRACT)}`;
      script.async = false;
      script.defer = true;
      script.dataset.admittedBy = CONTRACT;
      script.dataset.renewalAdmittedBy = RENEWAL_CONTRACT;
      script.dataset.role = role;
      script.dataset.routeConductorOwnsAdmission = "true";
      script.dataset.routeConductorOwnsImplementation = "false";
      script.dataset.routeConductorOwnsDrawing = "false";
      script.dataset.routeConductorOwnsSourceTruth = "false";
      script.dataset.governedSourceStackAdmission = "true";
      script.dataset.f13Claimed = "false";
      script.dataset.f21Claimed = "false";
      script.dataset.readyTextClaimed = "false";
      script.dataset.visualPassClaimed = "false";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";

      script.addEventListener("load", () => {
        record(`${role}_SCRIPT_LOAD_COMPLETE_BY_ROUTE_CONDUCTOR_V10_3`, { path });
        refresh({ allowAdmission: false, allowDelivery: true, reason: `${role.toLowerCase()}-script-load-v10-3` });
      }, { once: true });

      script.addEventListener("error", () => {
        recordError(`${role}_SCRIPT_LOAD_ERROR_BY_ROUTE_CONDUCTOR_V10_3`, `${role}_SCRIPT_LOAD_ERROR`, { path });
        refresh({ allowAdmission: false, allowDelivery: false, reason: `${role.toLowerCase()}-script-error-v10-3` });
      }, { once: true });

      (doc.head || doc.documentElement || doc.body).appendChild(script);

      return {
        attempted: true,
        admitted: true,
        present: true,
        status: `${role}_SCRIPT_ADMITTED_BY_ROUTE_CONDUCTOR_V10_3`,
        reason: "SCRIPT_APPENDED",
        src: script.src
      };
    } catch (error) {
      recordError(`${role}_SCRIPT_ADMISSION_FAILED_BY_ROUTE_CONDUCTOR_V10_3`, error, { path });

      return {
        attempted: true,
        admitted: false,
        present: false,
        status: `${role}_SCRIPT_ADMISSION_FAILED`,
        reason: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function admitRequiredScripts() {
    const sourceAdmission = [];

    for (const source of SOURCE_STACK) {
      const summary = readSourceSummary(source);
      const key = source.id.toLowerCase().replace("_channel", "");

      if (!summary.observed) {
        const result = admitScript(
          source.file,
          SCRIPT_IDS[key] || `hearth-route-conductor-v10-3-admitted-${source.id.toLowerCase()}-script`,
          `SOURCE_${source.id}`,
          source.expectedContract
        );

        sourceAdmission.push({
          id: source.id,
          file: source.file,
          required: source.required,
          status: result.status,
          reason: result.reason
        });
      } else {
        sourceAdmission.push({
          id: source.id,
          file: source.file,
          required: source.required,
          status: "SOURCE_AUTHORITY_ALREADY_PRESENT",
          reason: "OBSERVED_BEFORE_ADMISSION"
        });
      }
    }

    const control = readControlSummary();
    if (!control.observed) {
      admitScript(CONTROL_FILE, SCRIPT_IDS.control, "CONTROL", EXPECTED_CONTROL_CONTRACT);
    }

    const canvas = readCanvasSummary();
    if (!canvas.observed) {
      admitScript(CANVAS_FILE, SCRIPT_IDS.canvas, "CANVAS", EXPECTED_CANVAS_CONTRACT);
    }

    const hexAuthority = readHexAuthoritySummary();
    if (!hexAuthority.observed) {
      admitScript(HEX_AUTHORITY_FILE, SCRIPT_IDS.hexAuthority, "HEX_AUTHORITY", EXPECTED_HEX_AUTHORITY_CONTRACT);
    }

    const hexSurface = readHexSurfaceSummary();
    if (!hexSurface.observed) {
      admitScript(HEX_SURFACE_FILE, SCRIPT_IDS.hexSurface, "HEX_SURFACE_GATE", EXPECTED_HEX_SURFACE_CONTRACT);
    }

    const pointerFinger = readPointerFingerSummary();
    if (!pointerFinger.observed && !pointerFinger.vocabularyActive) {
      admitScript(FINGER_INSPECT_FILE, SCRIPT_IDS.pointerFinger, "POINTER_FINGER", "HEARTH_CANVAS_FINGER_INSPECT");
    }

    return sourceAdmission;
  }

  function extractSourcePublicPacket(source) {
    const authority = source.authority;
    const receipt = source.receiptObject || {};

    if (authority && isObject(authority)) {
      const methods = [
        "getSourcePacket",
        "getPacket",
        "getState",
        "getReport",
        "getReceipt",
        "getReceiptLight"
      ];

      for (const method of methods) {
        if (!isFunction(authority[method])) continue;

        try {
          const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
          if (isObject(result)) {
            return {
              sourceId: source.id,
              method,
              packet: clonePlain(result)
            };
          }
        } catch (_error) {}
      }

      const candidateKeys = [
        "sourcePacket",
        "packet",
        "state",
        "atlas",
        "map",
        "materials",
        "hydrology",
        "composition",
        "elevation",
        "tectonics"
      ];

      for (const key of candidateKeys) {
        if (authority[key] !== undefined && authority[key] !== null) {
          return {
            sourceId: source.id,
            method: `property:${key}`,
            packet: clonePlain(authority[key])
          };
        }
      }
    }

    return {
      sourceId: source.id,
      method: "receipt",
      packet: clonePlain(receipt)
    };
  }

  function composeGovernedSourcePacket(sourceStack) {
    const readySources = (sourceStack.sources || []).filter((source) => source.ready);

    const sourcePayloads = readySources.map((source) => extractSourcePublicPacket({
      ...source,
      authority: firstGlobal(
        (SOURCE_STACK.find((config) => config.id === source.id) || {}).aliases || []
      ).value,
      receiptObject: source.receiptObject || {}
    }));

    return {
      packetType: GOVERNED_SOURCE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceRole: "route-conductor-governed-source-stack-admission",
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      targetFile: CANVAS_FILE,
      destinationFile: CANVAS_FILE,

      route: ROUTE,
      indexFile: INDEX_FILE,
      routeConductorFile: FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      governedSourceStackStatus: sourceStack.status,
      governedSourceStackReady: sourceStack.readyForCanvas,
      governedSourceRequiredCount: sourceStack.requiredCount,
      governedSourceRequiredReadyCount: sourceStack.requiredReadyCount,
      governedSourceObservedCount: sourceStack.observedCount,
      governedSourceReadyCount: sourceStack.readyCount,
      governedSourceDetailGrade: sourceStack.detailGrade,

      sourceChronology: SOURCE_STACK.map((source) => ({
        id: source.id,
        order: source.order,
        file: source.file,
        role: source.role,
        required: source.required,
        expectedContract: source.expectedContract
      })),

      sourceStack: clonePlain(sourceStack),
      sourcePayloads,

      canvasReleaseAuthorized: sourceStack.readyForCanvas === true,
      canvasMayRenderGovernedSource: sourceStack.readyForCanvas === true,
      fallbackVisibleAllowed: sourceStack.readyForCanvas !== true,
      fallbackIsNotGovernedSource: true,

      routeConductorOwnsSourceTruth: false,
      canvasOwnsSourceTruth: false,
      sourceTruthOwnedBySourceFiles: true,
      canvasSurfaceTruthIsNotSourceTruth: true,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeSourceHoldPacket(sourceStack) {
    return {
      packetType: SOURCE_HOLD_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceRole: "route-conductor-source-hold",
      route: ROUTE,
      targetFile: CANVAS_FILE,

      sourceHoldActive: true,
      sourceHoldReason: sourceStack.sourceHoldReason,
      governedSourceStackStatus: sourceStack.status,
      governedSourceStackReady: false,
      firstFailedSourceId: sourceStack.firstFailedId,
      firstFailedSourceFile: sourceStack.firstFailedFile,
      firstSourceFailureClass: sourceStack.firstFailureClass,
      firstSourceFailureReason: sourceStack.firstFailureReason,

      canvasReleaseAuthorized: false,
      canvasGovernedSourceHandoffAuthorized: false,
      visibleFallbackMayRemain: true,
      visibleFallbackIsNotGovernedSource: true,

      sourceStack: clonePlain(sourceStack),

      recommendedNextOwner: "GOVERNED_SOURCE_STACK",
      recommendedNextFile: sourceStack.firstFailedFile,
      recommendedNextAction: "RENEW_OR_LOAD_FIRST_FAILED_GOVERNED_SOURCE_FILE",

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function deliverToAuthority(summary, methods, packet, label) {
    if (!summary || !summary.authority || (!isObject(summary.authority) && !isFunction(summary.authority))) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: `${label}_AUTHORITY_NOT_OBSERVED`
      };
    }

    for (const method of methods) {
      if (!isFunction(summary.authority[method])) continue;

      try {
        const result = summary.authority[method](clonePlain(packet), {
          source: "HEARTH_ROUTE_CONDUCTOR",
          renewalContract: RENEWAL_CONTRACT
        });

        const receipt = isObject(result) ? result : readAuthorityReceipt(summary.authority) || {};
        const accepted = Boolean(
          result === true ||
          safeBool(readField(receipt, [
            "accepted",
            "sourceAccepted",
            "governedSourceAccepted",
            "governedSourceStackAccepted",
            "canvasGovernedSourceAccepted",
            "handshakeAccepted",
            "releasePacketAccepted",
            "transmissionAccepted",
            "inputAdmissionOpen",
            "inputBound",
            "gateReady",
            "surfaceReady"
          ], false), false) ||
          /ACCEPTED|READY|ACTIVE|BOUND|CONFIRMED|CONSUMED/i.test(safeString(readField(receipt, [
            "status",
            "sourceStatus",
            "governedSourceStatus",
            "handshakeStatus",
            "controlStatus",
            "transmissionStatus",
            "postgameStatus"
          ], "")))
        );

        record(`${label}_DELIVERED_BY_ROUTE_CONDUCTOR_V10_3`, {
          method,
          accepted,
          target: summary.id,
          sourcePath: summary.sourcePath
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: accepted ? `${label}_ACCEPTED_BY_PUBLIC_API` : `${label}_DELIVERED_WAITING_ACCEPTANCE`,
          receipt: clonePlain(receipt)
        };
      } catch (error) {
        recordError(`${label}_PUBLIC_API_METHOD_FAILED`, error, {
          method,
          target: summary.id
        });
      }
    }

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: `${label}_PUBLIC_RECEIVER_MISSING_OR_FAILED`
    };
  }

  function deliverGovernedSourceToCanvas(canvas, governedPacket) {
    if (!canvas || !canvas.authority) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        status: "CANVAS_AUTHORITY_NOT_OBSERVED",
        reason: "CANVAS_AUTHORITY_NOT_OBSERVED"
      };
    }

    const strongMethod = STRONG_CANVAS_SOURCE_RECEIVERS.find((method) => isFunction(canvas.authority[method]));

    if (strongMethod) {
      const delivery = deliverToAuthority(
        canvas,
        [strongMethod],
        {
          packetType: CANVAS_GOVERNED_HANDOFF_PACKET,
          governedSourcePacket: clonePlain(governedPacket),
          ...governedPacket
        },
        "CANVAS_GOVERNED_SOURCE_HANDOFF"
      );

      return {
        ...delivery,
        status: delivery.accepted
          ? "CANVAS_GOVERNED_SOURCE_CONSUMED"
          : delivery.delivered
            ? "CANVAS_GOVERNED_SOURCE_DELIVERED_NOT_CONFIRMED_CONSUMED"
            : "CANVAS_GOVERNED_SOURCE_DELIVERY_FAILED",
        reason: delivery.reason
      };
    }

    const weakMethod = WEAK_CANVAS_PACKET_RECEIVERS.find((method) => isFunction(canvas.authority[method]));

    if (weakMethod) {
      const delivery = deliverToAuthority(
        canvas,
        [weakMethod],
        {
          packetType: CANVAS_GOVERNED_HANDOFF_PACKET,
          governedSourcePacket: clonePlain(governedPacket),
          ...governedPacket
        },
        "CANVAS_GENERIC_PACKET_HANDOFF"
      );

      return {
        ...delivery,
        accepted: false,
        status: "CANVAS_GENERIC_PACKET_RECEIVER_ONLY_GOVERNED_SOURCE_NOT_PROVEN_CONSUMED",
        reason: "CANVAS_HAS_GENERIC_PACKET_RECEIVER_BUT_NO_STRONG_GOVERNED_SOURCE_CONSUMER"
      };
    }

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      status: "CANVAS_GOVERNED_SOURCE_CONSUMER_MISSING",
      reason: "NO_CANVAS_PUBLIC_GOVERNED_SOURCE_RECEIVER_FOUND"
    };
  }

  function composeControlHandshakePacket(control, canvas, sourceStack) {
    const packet = {
      packetType: "ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_HANDSHAKE_PACKET_v10_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceRole: "route-conductor-north-bishop",
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      destinationFile: CONTROL_FILE,
      targetFile: CONTROL_FILE,

      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      controlHandshakeRequired: true,
      controlHandshakeAuthorized: true,
      queenHandshakeAuthorized: true,
      queenControlAdmissionAuthorized: true,
      controlAdmissionAuthorized: true,
      controlsAdmissionAuthorized: true,
      planetaryControlAdmissionAuthorized: true,

      governedSourceStackRequiredBeforeCanvasRelease: true,
      governedSourceStackReady: sourceStack.readyForCanvas,
      controlDoesNotCreateSourceTruth: true,
      visiblePlanetAllowedWithoutControls: true,
      controlDoesNotBlockVisiblePlanet: true,

      transmissionPath: TRANSMISSION_PATH.slice(),
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      canvasObserved: Boolean(canvas && canvas.observed),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      composedAt: nowIso()
    };

    state.currentControlHandshakePacket = clonePlain(packet);
    return packet;
  }

  function composeCanvasHandoffPacket(sourceStack, governedPacket, sourceHoldPacket, canvasDelivery) {
    const sourceReady = Boolean(sourceStack.readyForCanvas);
    const accepted = Boolean(canvasDelivery && canvasDelivery.accepted);

    const packet = {
      packetType: CANVAS_GOVERNED_HANDOFF_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,

      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      route: ROUTE,
      canvasFile: CANVAS_FILE,
      canvasMountSelector: CANVAS_MOUNT_SELECTOR,
      globeStageSelector: GLOBE_STAGE_SELECTOR,

      governedSourceStackRequiredBeforeCanvasRelease: true,
      governedSourceStackReady: sourceReady,
      governedSourcePacket: sourceReady ? clonePlain(governedPacket) : null,
      sourceHoldPacket: sourceReady ? null : clonePlain(sourceHoldPacket),

      canvasReleaseAuthorized: sourceReady,
      canvasGovernedSourceHandoffDelivered: Boolean(canvasDelivery && canvasDelivery.delivered),
      canvasGovernedSourceHandoffAccepted: accepted,
      canvasGovernedSourceReceiverMethod: canvasDelivery ? canvasDelivery.method : "NONE",
      canvasGovernedSourceDeliveryStatus: canvasDelivery ? canvasDelivery.status : "NOT_DELIVERED",
      canvasGovernedSourceDeliveryReason: canvasDelivery ? canvasDelivery.reason : "NOT_DELIVERED",

      fallbackVisibleAllowed: !accepted,
      fallbackVisibleReason: accepted
        ? "NONE_GOVERNED_SOURCE_CONSUMED_BY_CANVAS"
        : sourceReady
          ? "CANVAS_GOVERNED_SOURCE_CONSUMER_NOT_CONFIRMED"
          : sourceStack.sourceHoldReason,
      fallbackIsNotGovernedSource: true,

      canvasMustRemainReceiverOnly: true,
      canvasMayForwardToHexGate: accepted,
      canvasMustNotOwnSourceTruth: true,
      canvasSurfaceTruthIsNotSourceTruth: true,

      hexGateRequiredBeforePointerFinger: true,
      routeConductorBypassesHexGate: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      composedAt: nowIso()
    };

    state.currentCanvasHandoffPacket = clonePlain(packet);
    return packet;
  }

  function composeHexGateTransmissionPacket(index, control, canvas, hexAuthority, hexSurface, pointerFinger, sourceStack, canvasDelivery) {
    const sourceAcceptedByCanvas = Boolean(canvasDelivery && canvasDelivery.accepted);

    const packet = {
      packetType: "ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_PACKET_v10_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      destinationFile: HEX_SURFACE_FILE,
      targetFile: HEX_SURFACE_FILE,
      handoffTo: "HEX_SURFACE_GATE",

      route: ROUTE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: FINGER_INSPECT_FILE,

      transmissionPath: TRANSMISSION_PATH.slice(),

      indexObserved: Boolean(index && index.observed),
      controlObserved: Boolean(control && control.observed),
      controlHandshakeAccepted: Boolean(control && control.handshakeAccepted),
      canvasObserved: Boolean(canvas && canvas.observed),
      canvasSurfaceTruthConfirmed: Boolean(canvas && canvas.surfaceTruthConfirmed),
      governedSourceStackReady: sourceStack.readyForCanvas,
      governedSourceAcceptedByCanvas: sourceAcceptedByCanvas,
      hexAuthorityObserved: Boolean(hexAuthority && hexAuthority.observed),
      hexSurfaceObserved: Boolean(hexSurface && hexSurface.observed),
      hexSurfaceGateReady: Boolean(hexSurface && hexSurface.gateReady),
      pointerFingerObserved: Boolean(pointerFinger && (pointerFinger.observed || pointerFinger.vocabularyActive)),
      pointerFingerVocabulary: pointerFinger ? clonePlain(pointerFinger.vocabulary) : {},

      routeConductorOwnsCommandTransmission: true,
      routeConductorOwnsHexRendering: false,
      routeConductorOwnsPointerFingerImplementation: false,
      hexGateRequiredBeforePointerFinger: true,
      routeConductorBypassesHexGate: false,

      transmissionAuthorized: Boolean(sourceAcceptedByCanvas && canvas && canvas.surfaceTruthConfirmed),
      transmissionHeldReason: !sourceStack.readyForCanvas
        ? sourceStack.sourceHoldReason
        : !sourceAcceptedByCanvas
          ? "CANVAS_GOVERNED_SOURCE_CONSUMER_NOT_CONFIRMED"
          : !canvas || !canvas.surfaceTruthConfirmed
            ? "WAITING_CANVAS_SURFACE_TRUTH"
            : !hexSurface || !hexSurface.observed
              ? "WAITING_HEX_SURFACE_GATE"
              : "NONE_TRANSMISSION_AUTHORIZED",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      composedAt: nowIso()
    };

    state.currentHexGateTransmissionPacket = clonePlain(packet);
    return packet;
  }

  function composePointerFingerTransmissionPacket(hexSurface, pointerFinger, hexGateDelivery) {
    const hexAccepted = Boolean(hexGateDelivery && (hexGateDelivery.delivered || hexGateDelivery.accepted));

    const packet = {
      packetType: "ROUTE_CONDUCTOR_POINTER_FINGER_ADMISSION_NOTICE_v10_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      destinationFile: FINGER_INSPECT_FILE,
      targetFile: FINGER_INSPECT_FILE,
      handoffTo: "POINTER_FINGER_VIA_HEX_GATE",

      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: FINGER_INSPECT_FILE,
      fingerBoundaryFile: FINGER_BOUNDARY_FILE,
      fingerMassFile: FINGER_MASS_FILE,
      fingerSurfaceFile: FINGER_SURFACE_FILE,
      fingerPointerFile: FINGER_POINTER_FILE,
      fingerLightFile: FINGER_LIGHT_FILE,
      fingerInspectFile: FINGER_INSPECT_FILE,

      hexGateRequiredBeforePointerFinger: true,
      routeConductorBypassesHexGate: false,
      hexGateObserved: Boolean(hexSurface && hexSurface.observed),
      hexGateTransmissionDelivered: Boolean(hexGateDelivery && hexGateDelivery.delivered),
      hexGateTransmissionAccepted: Boolean(hexGateDelivery && hexGateDelivery.accepted),
      pointerFingerObserved: Boolean(pointerFinger && (pointerFinger.observed || pointerFinger.vocabularyActive)),
      pointerFingerVocabulary: pointerFinger ? clonePlain(pointerFinger.vocabulary) : {},

      pointerFingerAdmissionAuthorized: hexAccepted,
      pointerFingerAdmissionHeldReason: hexAccepted
        ? "NONE_HEX_GATE_TRANSMISSION_DELIVERED_OR_ACCEPTED"
        : "WAITING_HEX_GATE_TRANSMISSION_BEFORE_POINTER_FINGER",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      composedAt: nowIso()
    };

    state.currentPointerFingerTransmissionPacket = clonePlain(packet);
    return packet;
  }

  function composeGate(id, passed, coordinate, nextFile, evidence = {}) {
    return {
      id,
      passed: Boolean(passed),
      firstFailedCoordinate: passed ? `NONE_${id}_PASSED` : coordinate,
      recommendedNextFile: nextFile,
      evidence: clonePlain(evidence)
    };
  }

  function composeGateBoard(index, sourceStack, control, canvas, hexAuthority, hexSurface, pointerFinger, deliveries) {
    const htmlGate = composeGate(
      "HTML_VISIBLE_MOUNT_GATE",
      Boolean(doc && (q(CANVAS_MOUNT_SELECTOR) || q(GLOBE_STAGE_SELECTOR) || q("[data-hearth-canvas-mount]"))),
      "WAITING_HTML_VISIBLE_PLANET_MOUNT",
      HTML_FILE,
      { canvasMountSelector: CANVAS_MOUNT_SELECTOR, globeStageSelector: GLOBE_STAGE_SELECTOR }
    );

    const indexGate = composeGate(
      "INDEX_PRIEST_GATE",
      Boolean(index.observed && (index.contractRecognized || index.passiveButtonCorridorActive)),
      !index.observed ? "WAITING_INDEX_PRIEST_AUTHORITY" : "WAITING_INDEX_PRIEST_CURRENT_CONTRACT",
      INDEX_FILE,
      index
    );

    const routeGate = composeGate(
      "ROUTE_NORTH_BISHOP_GATE",
      true,
      "NONE_ROUTE_NORTH_BISHOP_READY",
      FILE,
      { contract: CONTRACT, renewalContract: RENEWAL_CONTRACT }
    );

    const sourceGate = composeGate(
      "GOVERNED_SOURCE_STACK_GATE",
      Boolean(sourceStack.readyForCanvas),
      sourceStack.firstFailureClass === "SOURCE_FILE_NOT_OBSERVED"
        ? `WAITING_GOVERNED_SOURCE_FILE:${sourceStack.firstFailedId}`
        : `WAITING_GOVERNED_SOURCE_READY:${sourceStack.firstFailedId}`,
      sourceStack.firstFailedFile === "NONE" ? MATERIALS_FILE : sourceStack.firstFailedFile,
      sourceStack
    );

    const controlGate = composeGate(
      "CONTROLS_QUEEN_GATE",
      Boolean(control.observed && (control.publicApiReady || control.handshakeAccepted)),
      !control.observed ? "WAITING_CONTROLS_QUEEN_AUTHORITY" : "WAITING_CONTROLS_QUEEN_PUBLIC_RECEIVER",
      CONTROL_FILE,
      control
    );

    const canvasAuthorityGate = composeGate(
      "CANVAS_AUTHORITY_GATE",
      Boolean(canvas.observed),
      "WAITING_CANVAS_AUTHORITY",
      CANVAS_FILE,
      canvas
    );

    const canvasSourceConsumerGate = composeGate(
      "CANVAS_GOVERNED_SOURCE_CONSUMER_GATE",
      Boolean(sourceStack.readyForCanvas && deliveries.canvasSource.accepted),
      !sourceStack.readyForCanvas
        ? sourceStack.sourceHoldReason
        : deliveries.canvasSource.status === "CANVAS_GENERIC_PACKET_RECEIVER_ONLY_GOVERNED_SOURCE_NOT_PROVEN_CONSUMED"
          ? "CANVAS_GENERIC_PACKET_RECEIVER_ONLY_SOURCE_NOT_PROVEN_CONSUMED"
          : "CANVAS_GOVERNED_SOURCE_CONSUMER_MISSING_OR_NOT_ACCEPTING",
      CANVAS_FILE,
      deliveries.canvasSource
    );

    const canvasSurfaceGate = composeGate(
      "CANVAS_VISIBLE_SURFACE_GATE",
      Boolean(canvas.observed && canvas.surfaceTruthConfirmed),
      !canvas.observed ? "WAITING_CANVAS_AUTHORITY_OR_DOM_SURFACE" : "WAITING_CANVAS_SURFACE_TRUTH",
      CANVAS_FILE,
      canvas.surface
    );

    const hexAuthorityGate = composeGate(
      "HEX_AUTHORITY_GATE",
      Boolean(hexAuthority.observed || hexSurface.observed),
      "WAITING_HEX_AUTHORITY_OR_HEX_SURFACE_GATE",
      HEX_AUTHORITY_FILE,
      hexAuthority
    );

    const hexSurfaceGate = composeGate(
      "HEX_SURFACE_GATE",
      Boolean(hexSurface.observed && (hexSurface.gateReady || hexSurface.publicApiReady || hexSurface.contractRecognized)),
      !hexSurface.observed ? "WAITING_HEX_SURFACE_GATE_AUTHORITY" : "WAITING_HEX_SURFACE_GATE_PUBLIC_RECEIVER",
      HEX_SURFACE_FILE,
      hexSurface
    );

    const pointerFingerGate = composeGate(
      "POINTER_FINGER_GATE",
      Boolean(pointerFinger.observed || pointerFinger.vocabularyActive),
      "WAITING_POINTER_FINGER_OR_FINGER_VOCABULARY",
      FINGER_INSPECT_FILE,
      pointerFinger
    );

    const transmissionGate = composeGate(
      "GOVERNED_SOURCE_CANVAS_HEX_POINTER_TRANSMISSION_GATE",
      Boolean(
        sourceStack.readyForCanvas &&
        deliveries.canvasSource.accepted &&
        canvas.surfaceTruthConfirmed &&
        hexSurfaceGate.passed &&
        (deliveries.hex.accepted || deliveries.hex.delivered)
      ),
      !sourceStack.readyForCanvas
        ? sourceStack.sourceHoldReason
        : !deliveries.canvasSource.accepted
          ? "WAITING_CANVAS_GOVERNED_SOURCE_CONSUMPTION"
          : !canvas.surfaceTruthConfirmed
            ? "WAITING_CANVAS_VISIBLE_SURFACE"
            : !hexSurfaceGate.passed
              ? hexSurfaceGate.firstFailedCoordinate
              : "WAITING_HEX_GATE_TRANSMISSION_ACCEPTANCE",
      !sourceStack.readyForCanvas
        ? sourceStack.firstFailedFile
        : !deliveries.canvasSource.accepted
          ? CANVAS_FILE
          : !hexSurfaceGate.passed
            ? HEX_SURFACE_FILE
            : FINGER_INSPECT_FILE,
      deliveries
    );

    const gates = [
      htmlGate,
      indexGate,
      routeGate,
      sourceGate,
      controlGate,
      canvasAuthorityGate,
      canvasSourceConsumerGate,
      canvasSurfaceGate,
      hexAuthorityGate,
      hexSurfaceGate,
      pointerFingerGate,
      transmissionGate
    ];

    const firstFailed = gates.find((gate) => !gate.passed) || null;

    return {
      gates,
      chronologicalGateCount: gates.length,
      chronologicalGatesSatisfied: gates.filter((gate) => gate.passed).length,
      chronologicalFirstFailedGate: firstFailed ? firstFailed.id : "NONE",
      chronologicalFirstFailedCoordinate: firstFailed
        ? firstFailed.firstFailedCoordinate
        : "NONE_GOVERNED_SOURCE_TO_CANVAS_TO_HEX_TO_POINTER_TRANSMISSION_COMMANDED",
      recommendedNextFile: firstFailed ? firstFailed.recommendedNextFile : LAB_NORTH_FILE
    };
  }

  function selectPostgame(board, sourceStack, canvas, canvasSourceDelivery, hexSurface, pointerFinger) {
    if (!sourceStack.readyForCanvas) {
      return {
        status: "SOURCE_HELD_GOVERNED_SOURCE_STACK_NOT_READY",
        owner: "GOVERNED_SOURCE_STACK",
        nextFile: sourceStack.firstFailedFile,
        nextAction: "RENEW_OR_LOAD_FIRST_FAILED_GOVERNED_SOURCE_FILE"
      };
    }

    if (!canvasSourceDelivery.accepted) {
      return {
        status: canvasSourceDelivery.status === "CANVAS_GENERIC_PACKET_RECEIVER_ONLY_GOVERNED_SOURCE_NOT_PROVEN_CONSUMED"
          ? "VISIBLE_GLOBE_IS_CANVAS_FALLBACK_GENERIC_PACKET_RECEIVER_ONLY"
          : "VISIBLE_GLOBE_SOURCE_NOT_CONSUMED_BY_CANVAS",
        owner: "CANVAS_RECEIVER",
        nextFile: CANVAS_FILE,
        nextAction: "ADD_CANVAS_PUBLIC_GOVERNED_SOURCE_STACK_CONSUMER_AND_RENDER_FROM_SOURCE_PACKET"
      };
    }

    if (canvas && !canvas.surfaceTruthConfirmed) {
      return {
        status: "GOVERNED_SOURCE_CONSUMED_WAITING_CANVAS_SURFACE_TRUTH",
        owner: "CANVAS_RECEIVER",
        nextFile: CANVAS_FILE,
        nextAction: "VERIFY_CANVAS_DRAWS_GOVERNED_SOURCE_TO_VISIBLE_2D_SURFACE"
      };
    }

    if (canvas && canvas.surfaceTruthConfirmed && (!hexSurface || !hexSurface.observed)) {
      return {
        status: "GOVERNED_CANVAS_READY_WAITING_HEX_SURFACE_GATE",
        owner: "HEX_SURFACE",
        nextFile: HEX_SURFACE_FILE,
        nextAction: "RENEW_HEX_SURFACE_GATE_PUBLIC_TRANSMISSION_RECEIVER"
      };
    }

    if (hexSurface && hexSurface.observed && pointerFinger && !pointerFinger.observed && !pointerFinger.vocabularyActive) {
      return {
        status: "HEX_SURFACE_GATE_PRESENT_WAITING_POINTER_FINGER",
        owner: "POINTER_FINGER",
        nextFile: FINGER_INSPECT_FILE,
        nextAction: "RENEW_POINTER_FINGER_PUBLIC_ADMISSION_RECEIVER"
      };
    }

    if (board.chronologicalFirstFailedGate === "NONE") {
      return {
        status: "GOVERNED_SOURCE_STACK_CANVAS_HEX_POINTER_TRANSMISSION_COMMANDED",
        owner: "TEACHER_REVIEW",
        nextFile: LAB_NORTH_FILE,
        nextAction: "RERUN_DIAGNOSTIC_RAIL_TO_CONFIRM_GOVERNED_SOURCE_STACK_CONSUMPTION"
      };
    }

    return {
      status: board.chronologicalFirstFailedCoordinate,
      owner: "FIRST_FAILED_GATE",
      nextFile: board.recommendedNextFile,
      nextAction: "RENEW_FIRST_FAILED_TRANSMISSION_COORDINATE"
    };
  }

  function composePrimaryPacket(options = {}) {
    const allowAdmission = options.allowAdmission !== false;
    const allowDelivery = options.allowDelivery !== false;

    let admissions = [];
    if (allowAdmission) admissions = admitRequiredScripts();

    let index = readIndexSummary();
    const sourceStack = readSourceStackSummary();
    let control = readControlSummary();
    let canvas = readCanvasSummary();
    let hexAuthority = readHexAuthoritySummary();
    let hexSurface = readHexSurfaceSummary();
    let pointerFinger = readPointerFingerSummary();

    const governedPacket = sourceStack.readyForCanvas ? composeGovernedSourcePacket(sourceStack) : null;
    const sourceHoldPacket = sourceStack.readyForCanvas ? null : composeSourceHoldPacket(sourceStack);

    state.currentGovernedSourcePacket = governedPacket ? clonePlain(governedPacket) : null;
    state.currentSourceHoldPacket = sourceHoldPacket ? clonePlain(sourceHoldPacket) : null;

    let canvasSourceDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      status: sourceStack.readyForCanvas ? "DELIVERY_NOT_REQUESTED" : "SOURCE_HELD_NOT_DELIVERED_TO_CANVAS",
      reason: sourceStack.readyForCanvas ? "DELIVERY_NOT_REQUESTED" : sourceStack.sourceHoldReason
    };

    const controlPacket = composeControlHandshakePacket(control, canvas, sourceStack);

    let controlDelivery = {
      delivered: false,
      accepted: Boolean(control.handshakeAccepted),
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (allowDelivery) {
      controlDelivery = deliverToAuthority(control, [
        "consumeRouteConductorControlHandshake",
        "receiveRouteConductorControlHandshake",
        "consumeControlHandshake",
        "receiveControlHandshake",
        "receiveControlHandshakePacket",
        "acceptControlHandshakePacket",
        "receiveQueenControlHandshake",
        "consumeQueenControlHandshake"
      ], controlPacket, "CONTROL_HANDSHAKE");

      if (sourceStack.readyForCanvas && governedPacket) {
        canvasSourceDelivery = deliverGovernedSourceToCanvas(canvas, governedPacket);
      }

      control = readControlSummary();
      canvas = readCanvasSummary();
      hexAuthority = readHexAuthoritySummary();
      hexSurface = readHexSurfaceSummary();
      pointerFinger = readPointerFingerSummary();
    }

    const canvasHandoffPacket = composeCanvasHandoffPacket(
      sourceStack,
      governedPacket,
      sourceHoldPacket,
      canvasSourceDelivery
    );

    let canvasReleaseDelivery = {
      delivered: false,
      accepted: false,
      method: canvasSourceDelivery.method,
      reason: sourceStack.readyForCanvas
        ? canvasSourceDelivery.reason
        : sourceStack.sourceHoldReason
    };

    if (canvasSourceDelivery.delivered) {
      canvasReleaseDelivery = {
        delivered: canvasSourceDelivery.delivered,
        accepted: canvasSourceDelivery.accepted,
        method: canvasSourceDelivery.method,
        reason: canvasSourceDelivery.reason
      };
    }

    const hexPacket = composeHexGateTransmissionPacket(
      index,
      control,
      canvas,
      hexAuthority,
      hexSurface,
      pointerFinger,
      sourceStack,
      canvasSourceDelivery
    );

    let hexDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (allowDelivery && canvasSourceDelivery.accepted && canvas.surfaceTruthConfirmed) {
      hexDelivery = deliverToAuthority(hexSurface, [
        "receiveRouteConductorHexGateTransmissionPacket",
        "consumeRouteConductorHexGateTransmissionPacket",
        "receiveHexGateTransmissionPacket",
        "consumeHexGateTransmissionPacket",
        "acceptHexGateTransmissionPacket",
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket"
      ], hexPacket, "HEX_GATE_TRANSMISSION");

      hexSurface = readHexSurfaceSummary();
      pointerFinger = readPointerFingerSummary();
    }

    const pointerPacket = composePointerFingerTransmissionPacket(hexSurface, pointerFinger, hexDelivery);

    let pointerDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (allowDelivery && pointerPacket.pointerFingerAdmissionAuthorized) {
      pointerDelivery = deliverToAuthority(pointerFinger, [
        "receiveHexGatePointerFingerTransmissionPacket",
        "consumeHexGatePointerFingerTransmissionPacket",
        "receivePointerFingerTransmissionPacket",
        "consumePointerFingerTransmissionPacket",
        "acceptPointerFingerTransmissionPacket",
        "receiveCanvasFingerPacket",
        "consumeCanvasFingerPacket",
        "receiveInspectPacket"
      ], pointerPacket, "POINTER_FINGER_ADMISSION");
    }

    const deliveries = {
      control: controlDelivery,
      canvasSource: canvasSourceDelivery,
      canvas: canvasReleaseDelivery,
      hex: hexDelivery,
      pointerFinger: pointerDelivery
    };

    const board = composeGateBoard(
      index,
      sourceStack,
      control,
      canvas,
      hexAuthority,
      hexSurface,
      pointerFinger,
      deliveries
    );

    const post = selectPostgame(board, sourceStack, canvas, canvasSourceDelivery, hexSurface, pointerFinger);

    const transmissionCommanded = Boolean(board.chronologicalFirstFailedGate === "NONE");
    const transmissionCommended = Boolean(
      sourceStack.readyForCanvas &&
      canvasSourceDelivery.accepted &&
      canvas.surfaceTruthConfirmed &&
      (hexDelivery.delivered || hexDelivery.accepted || hexSurface.observed)
    );

    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT_PACKET_v10_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,

      lineageV101Contract: LINEAGE_V10_1_CONTRACT,
      lineageV99Contract: LINEAGE_V9_9_CONTRACT,
      lineageV98Contract: LINEAGE_V9_8_CONTRACT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV96Contract: LINEAGE_V9_6_CONTRACT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,

      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: FINGER_INSPECT_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      activeNewsCycle: NEWS_CYCLES.TRANSMISSION_EXTENSION,
      activeFibonacci: "F13_HELD_F21_NORTH_ONLY",
      transmissionPath: TRANSMISSION_PATH.slice(),

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,

      cardinalBishops: {
        north: LAB_NORTH_FILE,
        east: LAB_EAST_FILE,
        south: LAB_SOUTH_FILE,
        west: LAB_WEST_FILE
      },

      admissions,

      index,
      sourceStack,
      control,
      canvas,
      hexAuthority,
      hexSurface,
      pointerFinger,

      indexObserved: index.observed,
      controlObserved: control.observed,
      canvasObserved: canvas.observed,
      hexAuthorityObserved: hexAuthority.observed,
      hexSurfaceObserved: hexSurface.observed,
      pointerFingerObserved: pointerFinger.observed || pointerFinger.vocabularyActive,

      governedSourceStackGateActive: true,
      governedSourceStackRequiredBeforeCanvasRelease: true,
      canvasSurfaceTruthIsNotSourceTruth: true,

      sourceStackStatus: sourceStack.status,
      sourceStackReady: sourceStack.readyForCanvas,
      sourceStackRequiredCount: sourceStack.requiredCount,
      sourceStackRequiredReadyCount: sourceStack.requiredReadyCount,
      sourceStackObservedCount: sourceStack.observedCount,
      sourceStackReadyCount: sourceStack.readyCount,
      sourceStackFirstFailedId: sourceStack.firstFailedId,
      sourceStackFirstFailedFile: sourceStack.firstFailedFile,
      sourceStackFirstFailureClass: sourceStack.firstFailureClass,
      sourceStackFirstFailureReason: sourceStack.firstFailureReason,

      sourceHoldActive: !sourceStack.readyForCanvas,
      sourceHoldReason: sourceStack.readyForCanvas ? "NONE" : sourceStack.sourceHoldReason,
      sourceHoldPacket: clonePlain(sourceHoldPacket),
      governedSourcePacket: clonePlain(governedPacket),
      governedSourcePacketComposed: Boolean(governedPacket),
      governedSourcePacketPublished: Boolean(governedPacket),

      fallbackVisibleAllowed: !canvasSourceDelivery.accepted,
      fallbackVisibleReason: canvasSourceDelivery.accepted
        ? "NONE_GOVERNED_SOURCE_CONSUMED_BY_CANVAS"
        : sourceStack.readyForCanvas
          ? canvasSourceDelivery.reason
          : sourceStack.sourceHoldReason,
      fallbackIsNotGovernedSource: true,

      controlHandshakePacket: clonePlain(controlPacket),
      controlHandshakeDelivered: controlDelivery.delivered,
      controlHandshakeAccepted: Boolean(controlDelivery.accepted || control.handshakeAccepted),
      controlHandshakeDeliveryMethod: controlDelivery.method,
      controlHandshakeDeliveryReason: controlDelivery.reason,

      canvasHandoffPacket: clonePlain(canvasHandoffPacket),
      canvasReleaseDelivered: canvasReleaseDelivery.delivered,
      canvasReleaseAccepted: canvasReleaseDelivery.accepted,
      canvasReleaseHeld: !canvasSourceDelivery.accepted,
      canvasReleaseHoldReason: canvasSourceDelivery.accepted
        ? "NONE"
        : sourceStack.readyForCanvas
          ? canvasSourceDelivery.reason
          : sourceStack.sourceHoldReason,

      governedSourcePacketDeliveredToCanvas: canvasSourceDelivery.delivered,
      governedSourcePacketAcceptedByCanvas: canvasSourceDelivery.accepted,
      canvasGovernedSourceReceiverMethod: canvasSourceDelivery.method,
      canvasGovernedSourceDeliveryStatus: canvasSourceDelivery.status,
      canvasGovernedSourceDeliveryReason: canvasSourceDelivery.reason,

      hexGateTransmissionPacket: clonePlain(hexPacket),
      hexGateTransmissionDelivered: hexDelivery.delivered,
      hexGateTransmissionAccepted: hexDelivery.accepted,
      hexGateTransmissionDeliveryMethod: hexDelivery.method,
      hexGateTransmissionDeliveryReason: hexDelivery.reason,

      pointerFingerTransmissionPacket: clonePlain(pointerPacket),
      pointerFingerAdmissionDelivered: pointerDelivery.delivered,
      pointerFingerAdmissionAccepted: pointerDelivery.accepted,
      pointerFingerAdmissionDeliveryMethod: pointerDelivery.method,
      pointerFingerAdmissionDeliveryReason: pointerDelivery.reason,

      canvasSurfaceTruthConfirmed: canvas.surfaceTruthConfirmed,
      visiblePlanetProofReady: canvas.surfaceTruthConfirmed,
      visiblePlanetProofSource: canvas.surfaceTruthConfirmed ? "DOM_CANVAS_2D_MOUNTED_PLANET_SURFACE" : "NONE",
      visiblePlanetProofIsSourceTruth: false,
      canvasElementFound: canvas.surface.canvasElementFound,
      canvasMountFound: canvas.surface.canvasMountFound,
      canvasRectNonzero: canvas.surface.canvasRectNonzero,
      canvasComputedVisible: canvas.surface.canvasComputedVisible,
      canvasContext2DReady: canvas.surface.canvasContext2DReady,
      canvasPixelSampleStatus: canvas.surface.canvasPixelSampleStatus,
      canvasVisiblePixelCount: canvas.surface.canvasVisiblePixelCount,

      hexGateRequiredBeforePointerFinger: true,
      routeConductorBypassesHexGate: false,
      canvasExpressionWithoutCanvasBishopAudit: true,
      canvasBishopInternalInspectionRequired: false,
      fingerImplementationInspectionRequired: false,

      gateBoard: clonePlain(board),
      gates: clonePlain(board.gates),
      chronologicalGateCount: board.chronologicalGateCount,
      chronologicalGatesSatisfied: board.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: board.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: board.chronologicalFirstFailedCoordinate,

      transmissionCommanded,
      transmissionCommended,
      transmissionHoldReason: transmissionCommanded
        ? "NONE_GOVERNED_SOURCE_TO_CANVAS_TO_HEX_TO_POINTER_TRANSMISSION_COMMANDED"
        : board.chronologicalFirstFailedCoordinate,

      f21EligibilityPosture: "HELD_BY_NORTH_ONLY_BOUNDARY",
      f21NorthOnly: true,
      routeMayPublishF21EligibilityOnly: true,

      firstFailedCoordinate: board.chronologicalFirstFailedCoordinate,
      recommendedNextOwner: post.owner,
      recommendedNextFile: post.nextFile,
      recommendedNextAction: post.nextAction,
      recommendedNextRenewalTarget: post.nextFile,
      postgameStatus: post.status,

      activeRouteConductorContracts: ACTIVE_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),

      routeConductorOwnsCommandTransmission: true,
      routeConductorOwnsFileAdmission: true,
      routeConductorOwnsPacketComposition: true,
      routeConductorOwnsReceiptPublication: true,
      routeConductorOwnsCanvasDrawing: false,
      routeConductorOwnsCanvasExpressionTruth: false,
      routeConductorOwnsSourceTruth: false,
      routeConductorOwnsHexRendering: false,
      routeConductorOwnsHexAuthorityTruth: false,
      routeConductorOwnsPointerFingerImplementation: false,

      latestReceiptAlwaysRepublished: true,
      staleReceiptPublicationBlocked: true,
      receiptPublishCount: state.receiptPublishCount,
      composedAt: nowIso(),
      updatedAt: nowIso(),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function updateStateFromPacket(packet) {
    state.currentPacket = clonePlain(packet);
    state.currentReceiptText = composeReceiptText(packet);

    state.indexObserved = packet.indexObserved;
    state.controlObserved = packet.controlObserved;
    state.canvasObserved = packet.canvasObserved;
    state.hexAuthorityObserved = packet.hexAuthorityObserved;
    state.hexSurfaceObserved = packet.hexSurfaceObserved;
    state.pointerFingerObserved = packet.pointerFingerObserved;

    state.sourceStackStatus = packet.sourceStackStatus;
    state.sourceStackReady = packet.sourceStackReady;
    state.sourceStackRequiredCount = packet.sourceStackRequiredCount;
    state.sourceStackRequiredReadyCount = packet.sourceStackRequiredReadyCount;
    state.sourceStackObservedCount = packet.sourceStackObservedCount;
    state.sourceStackReadyCount = packet.sourceStackReadyCount;
    state.sourceStackFirstFailedId = packet.sourceStackFirstFailedId;
    state.sourceStackFirstFailedFile = packet.sourceStackFirstFailedFile;
    state.sourceStackFirstFailureClass = packet.sourceStackFirstFailureClass;
    state.sourceStackFirstFailureReason = packet.sourceStackFirstFailureReason;

    state.sourceHoldActive = packet.sourceHoldActive;
    state.sourceHoldReason = packet.sourceHoldReason;
    state.fallbackVisibleAllowed = packet.fallbackVisibleAllowed;
    state.fallbackVisibleReason = packet.fallbackVisibleReason;
    state.fallbackIsNotGovernedSource = true;

    state.governedSourcePacketComposed = packet.governedSourcePacketComposed;
    state.governedSourcePacketPublished = packet.governedSourcePacketPublished;
    state.governedSourcePacketDeliveredToCanvas = packet.governedSourcePacketDeliveredToCanvas;
    state.governedSourcePacketAcceptedByCanvas = packet.governedSourcePacketAcceptedByCanvas;
    state.canvasGovernedSourceReceiverMethod = packet.canvasGovernedSourceReceiverMethod;
    state.canvasGovernedSourceDeliveryStatus = packet.canvasGovernedSourceDeliveryStatus;
    state.canvasGovernedSourceDeliveryReason = packet.canvasGovernedSourceDeliveryReason;

    state.controlHandshakeDelivered = packet.controlHandshakeDelivered;
    state.controlHandshakeAccepted = packet.controlHandshakeAccepted;
    state.canvasReleaseDelivered = packet.canvasReleaseDelivered;
    state.canvasReleaseAccepted = packet.canvasReleaseAccepted;
    state.canvasReleaseHeld = packet.canvasReleaseHeld;
    state.canvasReleaseHoldReason = packet.canvasReleaseHoldReason;
    state.hexGateTransmissionDelivered = packet.hexGateTransmissionDelivered;
    state.hexGateTransmissionAccepted = packet.hexGateTransmissionAccepted;
    state.pointerFingerAdmissionDelivered = packet.pointerFingerAdmissionDelivered;
    state.pointerFingerAdmissionAccepted = packet.pointerFingerAdmissionAccepted;

    state.canvasSurfaceTruthConfirmed = packet.canvasSurfaceTruthConfirmed;
    state.canvasElementFound = packet.canvasElementFound;
    state.canvasMountFound = packet.canvasMountFound;
    state.canvasRectNonzero = packet.canvasRectNonzero;
    state.canvasComputedVisible = packet.canvasComputedVisible;
    state.canvasContext2DReady = packet.canvasContext2DReady;
    state.canvasPixelSampleStatus = packet.canvasPixelSampleStatus;
    state.canvasVisiblePixelCount = packet.canvasVisiblePixelCount;

    state.currentGovernedSourcePacket = clonePlain(packet.governedSourcePacket);
    state.currentSourceHoldPacket = clonePlain(packet.sourceHoldPacket);
    state.currentControlHandshakePacket = clonePlain(packet.controlHandshakePacket);
    state.currentCanvasHandoffPacket = clonePlain(packet.canvasHandoffPacket);
    state.currentHexGateTransmissionPacket = clonePlain(packet.hexGateTransmissionPacket);
    state.currentPointerFingerTransmissionPacket = clonePlain(packet.pointerFingerTransmissionPacket);

    state.chronologicalGateCount = packet.chronologicalGateCount;
    state.chronologicalGatesSatisfied = packet.chronologicalGatesSatisfied;
    state.chronologicalFirstFailedGate = packet.chronologicalFirstFailedGate;
    state.chronologicalFirstFailedCoordinate = packet.chronologicalFirstFailedCoordinate;

    state.transmissionCommanded = packet.transmissionCommanded;
    state.transmissionCommended = packet.transmissionCommended;
    state.transmissionHoldReason = packet.transmissionHoldReason;

    state.recommendedNextOwner = packet.recommendedNextOwner;
    state.recommendedNextFile = packet.recommendedNextFile;
    state.recommendedNextAction = packet.recommendedNextAction;
    state.recommendedNextRenewalTarget = packet.recommendedNextRenewalTarget;
    state.postgameStatus = packet.postgameStatus;
    state.updatedAt = nowIso();

    updateDataset(packet);

    return packet;
  }

  function refresh(options = {}) {
    const packet = composePrimaryPacket({
      allowAdmission: options.allowAdmission !== false,
      allowDelivery: options.allowDelivery !== false,
      reason: options.reason || "refresh-v10-3"
    });

    updateStateFromPacket(packet);
    publishGlobals("refresh-v10-3", false);
    scheduleRender();

    return getReceiptLight(false);
  }

  function observePassive() {
    return refresh({
      allowAdmission: true,
      allowDelivery: true,
      reason: "passive-observation-v10-3"
    });
  }

  function composeReceipt(packet = state.currentPacket || composePrimaryPacket({ allowAdmission: false, allowDelivery: false })) {
    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-governed-source-stack-admission-canvas-handoff",
      receiptComposed: true,
      currentReceipt: true,
      noFinalClaimsPreserved: true,
      latestReceiptAlwaysRepublished: true,
      staleReceiptPublicationBlocked: true,
      localEventCount: state.events.length,
      errorCount: state.errors.length,
      watchdogTicks: state.watchdogTicks,
      renderCount: state.renderCount,
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeCompatibilityReceiptV94() {
    const p = state.currentPacket || composePrimaryPacket({ allowAdmission: false, allowDelivery: false });

    return {
      contract: COMPAT_V9_4_CONTRACT,
      receipt: COMPAT_V9_4_RECEIPT,
      compatibilityReceipt: true,
      supersededByContract: CONTRACT,
      supersededByReceipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,
      governedSourcePacket: clonePlain(p.governedSourcePacket),
      sourceHoldPacket: clonePlain(p.sourceHoldPacket),
      canvasReleasePacket: clonePlain(p.canvasHandoffPacket),
      routeConductorReleasePacket: clonePlain(p.canvasHandoffPacket),
      hexGateTransmissionPacket: clonePlain(p.hexGateTransmissionPacket),
      pointerFingerTransmissionPacket: clonePlain(p.pointerFingerTransmissionPacket),
      sourceStackReady: p.sourceStackReady === true,
      governedSourcePacketAcceptedByCanvas: p.governedSourcePacketAcceptedByCanvas === true,
      canvasSurfaceTruthConfirmed: p.canvasSurfaceTruthConfirmed === true,
      visiblePlanetProofReady: p.visiblePlanetProofReady === true,
      visiblePlanetProofIsSourceTruth: false,
      fallbackIsNotGovernedSource: true,
      hexGateRequiredBeforePointerFinger: true,
      routeConductorBypassesHexGate: false,
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh || !state.currentPacket) {
      updateStateFromPacket(composePrimaryPacket({ allowAdmission: false, allowDelivery: false }));
    }

    return composeReceipt(state.currentPacket);
  }

  function getReceipt() {
    const receipt = getReceiptLight(false);

    return {
      ...receipt,
      compatibilityReceiptV94: composeCompatibilityReceiptV94(),
      currentReceiptText: composeReceiptText(receipt),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      files: {
        html: HTML_FILE,
        indexPriest: INDEX_FILE,
        routeNorthBishop: FILE,
        elevation: ELEVATION_FILE,
        composition: COMPOSITION_FILE,
        tectonics: TECTONICS_FILE,
        hydrology: HYDROLOGY_FILE,
        materials: MATERIALS_FILE,
        landChannel: LAND_CHANNEL_FILE,
        waterChannel: WATER_CHANNEL_FILE,
        airChannel: AIR_CHANNEL_FILE,
        controlsQueen: CONTROL_FILE,
        canvasReceiver: CANVAS_FILE,
        hexAuthority: HEX_AUTHORITY_FILE,
        hexSurfaceGate: HEX_SURFACE_FILE,
        pointerFinger: FINGER_INSPECT_FILE,
        fingerBoundary: FINGER_BOUNDARY_FILE,
        fingerMass: FINGER_MASS_FILE,
        fingerSurface: FINGER_SURFACE_FILE,
        fingerPointer: FINGER_POINTER_FILE,
        fingerLight: FINGER_LIGHT_FILE,
        fingerInspect: FINGER_INSPECT_FILE,
        cardinalBishopNorth: LAB_NORTH_FILE,
        cardinalBishopEast: LAB_EAST_FILE,
        cardinalBishopSouth: LAB_SOUTH_FILE,
        cardinalBishopWest: LAB_WEST_FILE
      },
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    const sourceLines = (((r.sourceStack || {}).sources) || []).map((source) => [
      line(`SOURCE.${source.id}.required`, source.required),
      line(`SOURCE.${source.id}.observed`, source.observed),
      line(`SOURCE.${source.id}.ready`, source.ready),
      line(`SOURCE.${source.id}.file`, source.file),
      line(`SOURCE.${source.id}.contract`, source.contract),
      line(`SOURCE.${source.id}.status`, source.status),
      line(`SOURCE.${source.id}.failureClass`, source.failureClass),
      line(`SOURCE.${source.id}.failureReason`, source.failureReason)
    ].join("\n")).join("\n");

    const gateLines = (r.gates || []).map((gate) => [
      line(`${gate.id}.passed`, gate.passed),
      line(`${gate.id}.firstFailedCoordinate`, gate.firstFailedCoordinate),
      line(`${gate.id}.recommendedNextFile`, gate.recommendedNextFile)
    ].join("\n")).join("\n");

    return [
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("renewalContract", r.renewalContract || RENEWAL_CONTRACT),
      line("renewalReceipt", r.renewalReceipt || RENEWAL_RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("previousReceipt", r.previousReceipt || PREVIOUS_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "GOVERNED_SOURCE_STACK",
      line("governedSourceStackGateActive", true),
      line("governedSourceStackRequiredBeforeCanvasRelease", true),
      line("canvasSurfaceTruthIsNotSourceTruth", true),
      line("sourceStackStatus", r.sourceStackStatus),
      line("sourceStackReady", r.sourceStackReady),
      line("sourceStackRequiredCount", r.sourceStackRequiredCount),
      line("sourceStackRequiredReadyCount", r.sourceStackRequiredReadyCount),
      line("sourceStackObservedCount", r.sourceStackObservedCount),
      line("sourceStackReadyCount", r.sourceStackReadyCount),
      line("sourceStackFirstFailedId", r.sourceStackFirstFailedId),
      line("sourceStackFirstFailedFile", r.sourceStackFirstFailedFile),
      line("sourceStackFirstFailureClass", r.sourceStackFirstFailureClass),
      line("sourceStackFirstFailureReason", r.sourceStackFirstFailureReason),
      line("sourceHoldActive", r.sourceHoldActive),
      line("sourceHoldReason", r.sourceHoldReason),
      "",
      "SOURCE_FILES",
      sourceLines,
      "",
      "CANVAS_SOURCE_HANDOFF",
      line("governedSourcePacketComposed", r.governedSourcePacketComposed),
      line("governedSourcePacketPublished", r.governedSourcePacketPublished),
      line("governedSourcePacketDeliveredToCanvas", r.governedSourcePacketDeliveredToCanvas),
      line("governedSourcePacketAcceptedByCanvas", r.governedSourcePacketAcceptedByCanvas),
      line("canvasGovernedSourceReceiverMethod", r.canvasGovernedSourceReceiverMethod),
      line("canvasGovernedSourceDeliveryStatus", r.canvasGovernedSourceDeliveryStatus),
      line("canvasGovernedSourceDeliveryReason", r.canvasGovernedSourceDeliveryReason),
      line("canvasReleaseHeld", r.canvasReleaseHeld),
      line("canvasReleaseHoldReason", r.canvasReleaseHoldReason),
      "",
      "VISIBLE_SURFACE",
      line("canvasSurfaceTruthConfirmed", r.canvasSurfaceTruthConfirmed),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofIsSourceTruth", false),
      line("fallbackVisibleAllowed", r.fallbackVisibleAllowed),
      line("fallbackVisibleReason", r.fallbackVisibleReason),
      line("fallbackIsNotGovernedSource", true),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasContext2DReady", r.canvasContext2DReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasVisiblePixelCount", r.canvasVisiblePixelCount),
      "",
      "AUTHORITIES",
      line("indexObserved", r.indexObserved),
      line("controlObserved", r.controlObserved),
      line("canvasObserved", r.canvasObserved),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("pointerFingerObserved", r.pointerFingerObserved),
      "",
      "DELIVERIES",
      line("controlHandshakeDelivered", r.controlHandshakeDelivered),
      line("controlHandshakeAccepted", r.controlHandshakeAccepted),
      line("canvasReleaseDelivered", r.canvasReleaseDelivered),
      line("canvasReleaseAccepted", r.canvasReleaseAccepted),
      line("hexGateTransmissionDelivered", r.hexGateTransmissionDelivered),
      line("hexGateTransmissionAccepted", r.hexGateTransmissionAccepted),
      line("pointerFingerAdmissionDelivered", r.pointerFingerAdmissionDelivered),
      line("pointerFingerAdmissionAccepted", r.pointerFingerAdmissionAccepted),
      "",
      "GATES",
      gateLines,
      "",
      "TRANSMISSION",
      line("transmissionCommanded", r.transmissionCommanded),
      line("transmissionCommended", r.transmissionCommended),
      line("transmissionHoldReason", r.transmissionHoldReason),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13CanvasClaimed", false),
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("updatedAt", r.updatedAt || nowIso())
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("sourceStackStatus", r.sourceStackStatus),
      line("sourceStackReady", r.sourceStackReady),
      line("sourceStackFirstFailedId", r.sourceStackFirstFailedId),
      line("sourceStackFirstFailedFile", r.sourceStackFirstFailedFile),
      line("governedSourcePacketAcceptedByCanvas", r.governedSourcePacketAcceptedByCanvas),
      line("canvasGovernedSourceDeliveryStatus", r.canvasGovernedSourceDeliveryStatus),
      line("canvasSurfaceTruthConfirmed", r.canvasSurfaceTruthConfirmed),
      line("fallbackIsNotGovernedSource", true),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("pointerFingerObserved", r.pointerFingerObserved),
      line("transmissionCommanded", r.transmissionCommanded),
      line("transmissionHoldReason", r.transmissionHoldReason),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset(packet = state.currentPacket || {}) {
    setDataset("hearthRouteConductorMarkerPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthRouteNorthBishopActive", "true");
    setDataset("hearthRouteConductorGovernedSourceStackGateActive", "true");
    setDataset("hearthRouteConductorGovernedSourceStackRequiredBeforeCanvasRelease", "true");
    setDataset("hearthRouteCanvasSurfaceTruthIsNotSourceTruth", "true");
    setDataset("hearthRouteConductorOwnsSourceTruth", "false");
    setDataset("hearthRouteConductorOwnsCanvasDrawing", "false");

    setDataset("hearthTransmissionPath", TRANSMISSION_PATH.join(" -> "));
    setDataset("hearthTransmissionChronologyActive", "true");
    setDataset("hearthHexGateRequiredBeforePointerFinger", "true");

    setDataset("hearthSourceElevationFile", ELEVATION_FILE);
    setDataset("hearthSourceCompositionFile", COMPOSITION_FILE);
    setDataset("hearthSourceTectonicsFile", TECTONICS_FILE);
    setDataset("hearthSourceHydrologyFile", HYDROLOGY_FILE);
    setDataset("hearthSourceMaterialsFile", MATERIALS_FILE);
    setDataset("hearthSourceLandChannelFile", LAND_CHANNEL_FILE);
    setDataset("hearthSourceWaterChannelFile", WATER_CHANNEL_FILE);
    setDataset("hearthSourceAirChannelFile", AIR_CHANNEL_FILE);

    setDataset("hearthRouteSourceStackStatus", packet.sourceStackStatus || "");
    setDataset("hearthRouteSourceStackReady", String(packet.sourceStackReady === true));
    setDataset("hearthRouteSourceStackRequiredCount", String(packet.sourceStackRequiredCount || 0));
    setDataset("hearthRouteSourceStackRequiredReadyCount", String(packet.sourceStackRequiredReadyCount || 0));
    setDataset("hearthRouteSourceStackObservedCount", String(packet.sourceStackObservedCount || 0));
    setDataset("hearthRouteSourceStackReadyCount", String(packet.sourceStackReadyCount || 0));
    setDataset("hearthRouteSourceStackFirstFailedId", packet.sourceStackFirstFailedId || "");
    setDataset("hearthRouteSourceStackFirstFailedFile", packet.sourceStackFirstFailedFile || "");
    setDataset("hearthRouteSourceStackFirstFailureClass", packet.sourceStackFirstFailureClass || "");
    setDataset("hearthRouteSourceStackFirstFailureReason", packet.sourceStackFirstFailureReason || "");

    setDataset("hearthRouteSourceHoldActive", String(packet.sourceHoldActive === true));
    setDataset("hearthRouteSourceHoldReason", packet.sourceHoldReason || "");
    setDataset("hearthRouteFallbackVisibleAllowed", String(packet.fallbackVisibleAllowed === true));
    setDataset("hearthRouteFallbackVisibleReason", packet.fallbackVisibleReason || "");
    setDataset("hearthRouteFallbackIsNotGovernedSource", "true");

    setDataset("hearthRouteGovernedSourcePacketComposed", String(packet.governedSourcePacketComposed === true));
    setDataset("hearthRouteGovernedSourcePacketPublished", String(packet.governedSourcePacketPublished === true));
    setDataset("hearthRouteGovernedSourcePacketDeliveredToCanvas", String(packet.governedSourcePacketDeliveredToCanvas === true));
    setDataset("hearthRouteGovernedSourcePacketAcceptedByCanvas", String(packet.governedSourcePacketAcceptedByCanvas === true));
    setDataset("hearthRouteCanvasGovernedSourceReceiverMethod", packet.canvasGovernedSourceReceiverMethod || "");
    setDataset("hearthRouteCanvasGovernedSourceDeliveryStatus", packet.canvasGovernedSourceDeliveryStatus || "");
    setDataset("hearthRouteCanvasGovernedSourceDeliveryReason", packet.canvasGovernedSourceDeliveryReason || "");

    setDataset("hearthRouteControlObserved", String(packet.controlObserved === true));
    setDataset("hearthRouteCanvasObserved", String(packet.canvasObserved === true));
    setDataset("hearthRouteCanvasSurfaceTruthConfirmed", String(packet.canvasSurfaceTruthConfirmed === true));
    setDataset("hearthRouteVisiblePlanetProofIsSourceTruth", "false");
    setDataset("hearthRouteHexAuthorityObserved", String(packet.hexAuthorityObserved === true));
    setDataset("hearthRouteHexSurfaceObserved", String(packet.hexSurfaceObserved === true));
    setDataset("hearthRoutePointerFingerObserved", String(packet.pointerFingerObserved === true));

    setDataset("hearthRouteControlHandshakeDelivered", String(packet.controlHandshakeDelivered === true));
    setDataset("hearthRouteControlHandshakeAccepted", String(packet.controlHandshakeAccepted === true));
    setDataset("hearthRouteCanvasReleaseDelivered", String(packet.canvasReleaseDelivered === true));
    setDataset("hearthRouteCanvasReleaseAccepted", String(packet.canvasReleaseAccepted === true));
    setDataset("hearthRouteCanvasReleaseHeld", String(packet.canvasReleaseHeld === true));
    setDataset("hearthRouteCanvasReleaseHoldReason", packet.canvasReleaseHoldReason || "");
    setDataset("hearthRouteHexGateTransmissionDelivered", String(packet.hexGateTransmissionDelivered === true));
    setDataset("hearthRouteHexGateTransmissionAccepted", String(packet.hexGateTransmissionAccepted === true));
    setDataset("hearthRoutePointerFingerAdmissionDelivered", String(packet.pointerFingerAdmissionDelivered === true));
    setDataset("hearthRoutePointerFingerAdmissionAccepted", String(packet.pointerFingerAdmissionAccepted === true));

    setDataset("hearthRouteCanvasElementFound", String(packet.canvasElementFound === true));
    setDataset("hearthRouteCanvasMountFound", String(packet.canvasMountFound === true));
    setDataset("hearthRouteCanvasRectNonzero", String(packet.canvasRectNonzero === true));
    setDataset("hearthRouteCanvasComputedVisible", String(packet.canvasComputedVisible === true));
    setDataset("hearthRouteCanvasContext2DReady", String(packet.canvasContext2DReady === true));
    setDataset("hearthRouteCanvasPixelSampleStatus", packet.canvasPixelSampleStatus || "");
    setDataset("hearthRouteCanvasVisiblePixelCount", String(packet.canvasVisiblePixelCount || 0));

    setDataset("hearthRouteChronologicalGateCount", String(packet.chronologicalGateCount || 0));
    setDataset("hearthRouteChronologicalGatesSatisfied", String(packet.chronologicalGatesSatisfied || 0));
    setDataset("hearthRouteChronologicalFirstFailedGate", packet.chronologicalFirstFailedGate || "");
    setDataset("hearthRouteChronologicalFirstFailedCoordinate", packet.chronologicalFirstFailedCoordinate || "");

    setDataset("hearthRouteTransmissionCommanded", String(packet.transmissionCommanded === true));
    setDataset("hearthRouteTransmissionCommended", String(packet.transmissionCommended === true));
    setDataset("hearthRouteTransmissionHoldReason", packet.transmissionHoldReason || "");

    setDataset("hearthRouteRecommendedNextOwner", packet.recommendedNextOwner || "");
    setDataset("hearthRouteRecommendedNextFile", packet.recommendedNextFile || "");
    setDataset("hearthRouteRecommendedNextAction", packet.recommendedNextAction || "");
    setDataset("hearthRouteRecommendedNextRenewalTarget", packet.recommendedNextRenewalTarget || "");
    setDataset("hearthRoutePostgameStatus", packet.postgameStatus || "");

    setDataset("hearthRouteF13Claimed", "false");
    setDataset("hearthRouteF21EligibleForNorth", "false");
    setDataset("hearthRouteF21SubmittedToNorth", "false");
    setDataset("hearthRouteReadyTextAllowed", "false");
    setDataset("hearthRouteReadyTextClaimed", "false");
    setDataset("hearthRouteVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function render() {
    if (!doc) return;

    state.renderCount += 1;

    const r = state.currentPacket || getReceiptLight(false);
    const stage = q("[data-hearth-stage-label]");
    const heartbeat = q("[data-hearth-heartbeat-text]");
    const latest = q("[data-hearth-latest-event]");
    const fill = q("[data-hearth-main-progress-fill]");
    const percent = q("[data-hearth-main-progress-percent]");
    const status = doc.getElementById("hearth-route-status") || q("[data-hearth-route-status]");
    const receiptBox = q("[data-hearth-receipt-box]");
    const receiptText = q("[data-hearth-receipt-text]");

    const progress = r.chronologicalGateCount
      ? Math.round((r.chronologicalGatesSatisfied / r.chronologicalGateCount) * 100)
      : 0;

    if (stage) stage.textContent = `${NEWS_CYCLES.TRANSMISSION_EXTENSION} · governed source stack admission`;
    if (heartbeat) heartbeat.textContent = `${r.postgameStatus || "SOURCE_STACK_AUDIT_ACTIVE"} · next=${r.recommendedNextFile || CANVAS_FILE}`;
    if (latest) latest.textContent = `latest=${RENEWAL_CONTRACT}`;
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    if (percent) percent.textContent = `${Math.max(0, Math.min(100, progress))}%`;
    if (status) status.textContent = getStatusText();

    if (receiptBox && receiptText && receiptBox.dataset.visible === "true") {
      receiptText.textContent = getReceiptText();
    }
  }

  function scheduleRender() {
    if (renderTimer || !root.setTimeout) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_RENEWAL_CONTRACT__ = RENEWAL_CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_SURFACE_TRUTH_IS_NOT_SOURCE_TRUTH__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_BYPASSES_HEX_GATE__ = false;
    updateDataset(state.currentPacket || {});
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const aliases = [
      "HEARTH_ROUTE_CONDUCTOR",
      "HearthRouteConductor",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF",
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
      "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorPrimaryGate",
      "HEARTH.routeNorthBishop",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
      "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
      "HEARTH.routeConductorHexGatePointerFingerTransmission",
      "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
      "HEARTH.routeConductorControlHandshakeIntegration",
      "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorPrimaryGate",
      "DEXTER_LAB.hearthRouteNorthBishop",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
      "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
      "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
      "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ];

    for (const alias of aliases) setPath(alias, api);

    root.HEARTH.routeConductor = api;
    root.DEXTER_LAB.hearthRouteConductor = api;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const receipt = getReceiptLight(false);
    const compatibility = composeCompatibilityReceiptV94();

    state.receiptPublishCount += 1;

    const receiptAliases = [
      "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT",
      "HEARTH_ROUTE_NORTH_BISHOP_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT_v10_3",
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT",
      "HEARTH.routeConductorReceipt",
      "HEARTH.southRouteConductorReceipt",
      "HEARTH.routeConductorPrimaryGateReceipt",
      "HEARTH.routeNorthBishopReceipt",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt",
      "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoffReceipt",
      "HEARTH.routeConductorHexGatePointerFingerTransmissionReceipt",
      "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndReleaseReceipt",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnelReceipt",
      "HEARTH.routeConductorControlFileAdmissionAndHandshakeDeliveryReceipt",
      "HEARTH.routeConductorControlHandshakeIntegrationReceipt",
      "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronizationReceipt",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt",
      "DEXTER_LAB.hearthRouteConductorReceipt",
      "DEXTER_LAB.hearthSouthRouteConductorReceipt",
      "DEXTER_LAB.hearthRouteConductorPrimaryGateReceipt",
      "DEXTER_LAB.hearthRouteNorthBishopReceipt",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt",
      "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoffReceipt",
      "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmissionReceipt"
    ];

    for (const alias of receiptAliases) setPath(alias, receipt);

    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT = compatibility;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4 = compatibility;
    hearth.routeConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    if (state.currentGovernedSourcePacket) {
      const packet = clonePlain(state.currentGovernedSourcePacket);
      root.HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_PACKET = packet;
      root.HEARTH_GOVERNED_SOURCE_STACK_PACKET = packet;
      hearth.routeConductorGovernedSourceStackPacket = packet;
      hearth.governedSourceStackPacket = packet;
      lab.hearthRouteConductorGovernedSourceStackPacket = packet;
    }

    if (state.currentSourceHoldPacket) {
      const packet = clonePlain(state.currentSourceHoldPacket);
      root.HEARTH_ROUTE_CONDUCTOR_SOURCE_HELD_PACKET = packet;
      root.HEARTH_SOURCE_HELD_PACKET = packet;
      hearth.routeConductorSourceHeldPacket = packet;
      hearth.sourceHeldPacket = packet;
      lab.hearthRouteConductorSourceHeldPacket = packet;
    }

    if (state.currentControlHandshakePacket) {
      const packet = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET = packet;
      root.HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET = packet;
      root.HEARTH_CONTROL_HANDSHAKE_PACKET = packet;
      hearth.routeConductorControlHandshakePacket = packet;
      hearth.routeConductorQueenControlHandshakePacket = packet;
      hearth.controlHandshakePacket = packet;
    }

    if (state.currentCanvasHandoffPacket) {
      const packet = clonePlain(state.currentCanvasHandoffPacket);
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_GOVERNED_HANDOFF_PACKET = packet;
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = packet;
      root.HEARTH_CANVAS_RELEASE_PACKET = packet;
      hearth.routeConductorCanvasGovernedHandoffPacket = packet;
      hearth.routeConductorCanvasReleasePacket = packet;
      hearth.canvasReleasePacket = packet;
    }

    if (state.currentHexGateTransmissionPacket) {
      const packet = clonePlain(state.currentHexGateTransmissionPacket);
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_TRANSMISSION_PACKET = packet;
      root.HEARTH_HEX_GATE_TRANSMISSION_PACKET = packet;
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_PACKET = packet;
      hearth.routeConductorHexGateTransmissionPacket = packet;
      hearth.hexGateTransmissionPacket = packet;
      hearth.routeConductorHexGatePointerFingerTransmissionPacket = packet;
    }

    if (state.currentPointerFingerTransmissionPacket) {
      const packet = clonePlain(state.currentPointerFingerTransmissionPacket);
      root.HEARTH_ROUTE_CONDUCTOR_POINTER_FINGER_TRANSMISSION_PACKET = packet;
      root.HEARTH_POINTER_FINGER_TRANSMISSION_PACKET = packet;
      hearth.routeConductorPointerFingerTransmissionPacket = packet;
      hearth.pointerFingerTransmissionPacket = packet;
    }

    root.HEARTH_ROUTE_CONDUCTOR_TRANSMISSION_PATH = TRANSMISSION_PATH.slice();
    root.HEARTH_ROUTE_CONDUCTOR_SOURCE_STACK = clonePlain(SOURCE_STACK);
    hearth.routeConductorTransmissionPath = TRANSMISSION_PATH.slice();
    hearth.routeConductorSourceStack = clonePlain(SOURCE_STACK);
    lab.hearthRouteConductorTransmissionPath = TRANSMISSION_PATH.slice();
    lab.hearthRouteConductorSourceStack = clonePlain(SOURCE_STACK);

    updateDataset(receipt);
  }

  function publishGlobals(reason = "publish-globals-v10-3", force = false) {
    publishApiAliases();
    publishReceiptAliases();

    record(reason, {
      force,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      sourceStackReady: state.sourceStackReady,
      sourceStackStatus: state.sourceStackStatus,
      governedSourcePacketAcceptedByCanvas: state.governedSourcePacketAcceptedByCanvas,
      canvasSurfaceTruthConfirmed: state.canvasSurfaceTruthConfirmed,
      fallbackIsNotGovernedSource: true,
      hexSurfaceObserved: state.hexSurfaceObserved,
      pointerFingerObserved: state.pointerFingerObserved,
      transmissionCommanded: state.transmissionCommanded,
      transmissionCommended: state.transmissionCommended,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      postgameStatus: state.postgameStatus
    });

    return true;
  }

  function scheduleWatchdog() {
    if (!root.setInterval || watchdogTimer) return;

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh({
        allowAdmission: true,
        allowDelivery: true,
        reason: `watchdog-v10-3-${state.watchdogTicks}`
      });

      if (
        state.watchdogTicks >= 32 ||
        state.transmissionCommanded === true ||
        state.disposed === true
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("HEARTH_ROUTE_CONDUCTOR_V10_3_WATCHDOG_STOPPED", {
          watchdogTicks: state.watchdogTicks,
          sourceStackReady: state.sourceStackReady,
          governedSourcePacketAcceptedByCanvas: state.governedSourcePacketAcceptedByCanvas,
          transmissionCommanded: state.transmissionCommanded,
          transmissionCommended: state.transmissionCommended,
          postgameStatus: state.postgameStatus
        });
      }
    }, 750);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_V10_3";

      publishEarlyMarker();
      publishGlobals("boot-early-v10-3", true);

      refresh({
        allowAdmission: true,
        allowDelivery: true,
        reason: "boot-v10-3"
      });

      state.booting = false;
      state.booted = true;

      publishGlobals("boot-complete-v10-3", true);
      render();
      scheduleWatchdog();

      if (root.setTimeout) {
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-250ms-v10-3" }), 250);
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-900ms-v10-3" }), 900);
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-1800ms-v10-3" }), 1800);
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-3200ms-v10-3" }), 3200);
      }

      record("HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_V10_3_BOOTED", {
        route: ROUTE,
        contract: CONTRACT,
        renewalContract: RENEWAL_CONTRACT,
        transmissionPath: TRANSMISSION_PATH.slice(),
        sourceStackReady: state.sourceStackReady,
        sourceStackStatus: state.sourceStackStatus,
        governedSourcePacketAcceptedByCanvas: state.governedSourcePacketAcceptedByCanvas,
        canvasSurfaceTruthConfirmed: state.canvasSurfaceTruthConfirmed,
        fallbackIsNotGovernedSource: true,
        routeConductorBypassesHexGate: false,
        visualPassClaimed: false
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    state.disposed = true;
    record("HEARTH_ROUTE_CONDUCTOR_V10_3_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function getGovernedSourcePacket() {
    return clonePlain(state.currentGovernedSourcePacket || null);
  }

  function getSourceHoldPacket() {
    return clonePlain(state.currentSourceHoldPacket || null);
  }

  function getCanvasReleasePacket() {
    return clonePlain(state.currentCanvasHandoffPacket || (state.currentPacket && state.currentPacket.canvasHandoffPacket) || null);
  }

  function getReleasePacket() {
    return getCanvasReleasePacket();
  }

  function getControlHandshakePacket() {
    return clonePlain(state.currentControlHandshakePacket || (state.currentPacket && state.currentPacket.controlHandshakePacket) || null);
  }

  function getHexGateTransmissionPacket() {
    return clonePlain(state.currentHexGateTransmissionPacket || (state.currentPacket && state.currentPacket.hexGateTransmissionPacket) || null);
  }

  function getPointerFingerTransmissionPacket() {
    return clonePlain(state.currentPointerFingerTransmissionPacket || (state.currentPacket && state.currentPacket.pointerFingerTransmissionPacket) || null);
  }

  function getTransmissionPath() {
    return TRANSMISSION_PATH.slice();
  }

  function getSourceStack() {
    return clonePlain(SOURCE_STACK);
  }

  function getRouteCycleReceipt() {
    const r = getReceiptLight(false);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_CYCLE_RECEIPT_v10_3",
      cycleOneRoute: NEWS_CYCLES.CYCLE_1,
      cycleTwoRoute: NEWS_CYCLES.CYCLE_2,
      transmissionExtensionRoute: NEWS_CYCLES.TRANSMISSION_EXTENSION,
      activeNewsCycle: NEWS_CYCLES.TRANSMISSION_EXTENSION,
      transmissionPath: TRANSMISSION_PATH.slice(),
      sourceStackReady: r.sourceStackReady,
      governedSourcePacketAcceptedByCanvas: r.governedSourcePacketAcceptedByCanvas,
      canvasSurfaceTruthConfirmed: r.canvasSurfaceTruthConfirmed,
      visiblePlanetProofIsSourceTruth: false,
      fallbackIsNotGovernedSource: true,
      hexGateTransmissionDelivered: r.hexGateTransmissionDelivered,
      transmissionCommanded: r.transmissionCommanded,
      transmissionCommended: r.transmissionCommended,
      recommendedNextOwner: r.recommendedNextOwner,
      recommendedNextFile: r.recommendedNextFile,
      postgameStatus: r.postgameStatus,
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getRoutePrimaryGateReceipt() {
    return composeReceipt(getReceiptLight(false));
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    RENEWAL_CONTRACT,
    RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,

    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: FINGER_INSPECT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    elevationFile: ELEVATION_FILE,
    compositionFile: COMPOSITION_FILE,
    tectonicsFile: TECTONICS_FILE,
    hydrologyFile: HYDROLOGY_FILE,
    materialsFile: MATERIALS_FILE,
    landChannelFile: LAND_CHANNEL_FILE,
    waterChannelFile: WATER_CHANNEL_FILE,
    airChannelFile: AIR_CHANNEL_FILE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,

    NEWS_CYCLES,
    ACTIVE_ROUTE_CONDUCTOR_CONTRACTS,
    ACTIVE_CANVAS_CONTRACTS,
    SOURCE_STACK,
    TRANSMISSION_PATH,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    observePassive,
    render,

    readIndexSummary,
    readSourceStackSummary,
    readSourceSummary,
    readControlSummary,
    readCanvasSummary,
    readHexAuthoritySummary,
    readHexSurfaceSummary,
    readPointerFingerSummary,
    scanCanvasSurface,

    composeGovernedSourcePacket,
    composeSourceHoldPacket,
    composeControlHandshakePacket,
    composeCanvasHandoffPacket,
    composeHexGateTransmissionPacket,
    composePointerFingerTransmissionPacket,

    getGovernedSourcePacket,
    getSourceStackPacket: getGovernedSourcePacket,
    getSourceHoldPacket,

    getControlHandshakePacket,
    getControlsHandshakePacket: getControlHandshakePacket,
    getPlanetaryControlHandshakePacket: getControlHandshakePacket,
    getRouteConductorControlHandshakePacket: getControlHandshakePacket,
    getQueenControlHandshakePacket: getControlHandshakePacket,

    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket: getCanvasReleasePacket,
    getHandoffPacket: getCanvasReleasePacket,

    getHexGateTransmissionPacket,
    getHexTransmissionPacket: getHexGateTransmissionPacket,
    getRouteConductorHexGateTransmissionPacket: getHexGateTransmissionPacket,
    getPointerFingerTransmissionPacket,
    getRouteConductorPointerFingerTransmissionPacket: getPointerFingerTransmissionPacket,
    getTransmissionPath,
    getSourceStack,

    composeReceipt,
    composeReceiptText,
    composeCompatibilityReceiptV94,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    publishGlobals,
    publishApiAliases,
    publishReceiptAliases,
    updateDataset,

    supportsGovernedSourceStackAdmission: true,
    supportsSourceHoldClassification: true,
    supportsCanvasSourceTruthDistinction: true,
    supportsCanvasDomSurfaceAdmission: true,
    supportsCanvasFileAdmission: true,
    supportsQueenAdmissionNonBlockingForVisibleGlobe: true,
    supportsHexGatePointerFingerTransmission: true,
    supportsTransmissionChronology: true,
    supportsPointerFingerVocabularyRecognition: true,
    supportsCompatibilityReceiptV94: true,
    supportsAlwaysFreshReceiptPublication: true,
    supportsF21EligibilityPostureOnly: true,

    ownsRouteConductorRuntime: true,
    ownsRouteNorthBishopRecognitionFunnel: true,
    ownsNewsChronology: true,
    ownsFibonacciSynchronization: true,
    ownsCommandTransmission: true,
    ownsFileAdmission: true,
    ownsPacketComposition: true,
    ownsRouteReceiptPublication: true,

    ownsHtmlShell: false,
    ownsIndexPriestImplementation: false,
    ownsIndexButtonAuthority: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsQueenImplementation: false,
    ownsControlFileImplementation: false,
    ownsControlRuntimeTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasSourceRendering: false,
    ownsCanvasBishopInternals: false,
    ownsCanvasFingerTruth: false,
    ownsSourceTruth: false,
    ownsElevationTruth: false,
    ownsCompositionTruth: false,
    ownsTectonicsTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsHexRendering: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerImplementation: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    canvasSurfaceTruthIsNotSourceTruth: true,
    governedSourceStackRequiredBeforeCanvasRelease: true,
    fallbackIsNotGovernedSource: true,
    routeConductorBypassesHexGate: false,
    hexGateRequiredBeforePointerFinger: true,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  publishEarlyMarker();
  publishGlobals("immediate-v10-3-api-publication", true);

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
