// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10
// Internal controlled renewal:
// HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_TNT_v10_6
// Full-file replacement.
// Showroom Globe Hearth route conductor only.
//
// Purpose:
// - Preserve public v10 Route Conductor contract expected by diagnostics, Controls, Canvas, and Index.
// - Correct current fault class: CANVAS_SCRIPT_NOT_PRESENT.
// - Admit only required downstream runtime asset scripts by file path:
//   1. /assets/hearth/hearth.controls.js
//   2. /assets/hearth/hearth.hex.four-pair.authority.js
//   3. /assets/hearth/hearth.hex.surface.js
//   4. /assets/hearth/hearth.canvas.js
// - Never call Canvas lifecycle methods: boot/start/init/mount/render/run.
// - Never direct-load Pointer Finger.
// - Never direct-load governed source stack.
// - Never append duplicate scripts when a matching path is already present.
// - Use file-path script load locks.
// - Publish route → controls, route → hex, and route → canvas packets as evidence.
// - Deliver only to explicit packet receiver methods.
// - Keep Controls as motion/input gateway authority.
// - Keep Hex Surface as downstream expression gate.
// - Keep Canvas as presentation platter / DOM surface authority.
// - Preserve no Canvas drawing ownership, no source truth ownership, no F13 claim, no F21 claim,
//   no ready text, no final visual pass, no generated image, no GraphicBox, and no WebGL.

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
    "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_TNT_v10_6";
  const RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_RECEIPT_v10_6";

  const PREVIOUS_RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5";
  const PREVIOUS_RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_RECEIPT_v10_5";

  const LINEAGE_V10_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4";
  const LINEAGE_V10_3_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3";
  const LINEAGE_V10_2_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2";
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

  const VERSION =
    "2026-06-07.hearth-route-conductor-safe-asset-admission-no-lifecycle-ignition-v10-6";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
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
  const EXPECTED_POINTER_FINGER_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const CONTROL_HANDSHAKE_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_HEX_GATE_HANDSHAKE_PACKET_v10_6";
  const HEX_SCAN_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_HEX_SURFACE_ACTIVE_SCAN_PACKET_v10_6";
  const PRESENTATION_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_CANVAS_PRESENTATION_PLATTER_PACKET_v10_6";
  const GOVERNED_SOURCE_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_PACKET_v10_6";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByRouteConductor: false,
    f13ClaimedByCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByRouteConductor: false,
    f21ClaimedByCanvas: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByRouteConductor: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const REQUIRED_ASSET_CHAIN = Object.freeze([
    Object.freeze({
      id: "CONTROLS_QUEEN",
      role: "motion-input-gateway-authority",
      file: CONTROL_FILE,
      loadEligible: true,
      aliases: [
        "HEARTH_CONTROLS",
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH_QUEEN_CONTROLS",
        "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
        "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
        "HEARTH.controls",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.controlsPlanetaryViewInputHandshake",
        "HEARTH.controlsHexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthControls",
        "DEXTER_LAB.hearthQueenControls",
        "DEXTER_LAB.hearthControlsHexGatePointerFingerTransmission"
      ],
      expectedContracts: [
        EXPECTED_CONTROL_CONTRACT,
        EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
        "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
        "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
      ]
    }),
    Object.freeze({
      id: "HEX_AUTHORITY",
      role: "hex-four-pair-authority",
      file: HEX_AUTHORITY_FILE,
      loadEligible: true,
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_AUTHORITY",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexPixelHandshakeAuthority",
        "HEARTH.hexAuthority",
        "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority",
        "DEXTER_LAB.hearthHexAuthority"
      ],
      expectedContracts: [EXPECTED_HEX_AUTHORITY_CONTRACT]
    }),
    Object.freeze({
      id: "HEX_SURFACE_GATE",
      role: "downstream-expression-gate-authority",
      file: HEX_SURFACE_FILE,
      loadEligible: true,
      aliases: [
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
        "HEARTH_HEX_SURFACE_RENDERER",
        "HEARTH_HEX_SURFACE",
        "HEARTH_HEX_GATE",
        "HEARTH_HEX_PAIR_RENDERER",
        "HEARTH_HEX_INTERACTIVE_SURFACE",
        "HEARTH.hexSurfacePairPointerFingerGate",
        "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
        "HEARTH.hexSurfaceRenderer",
        "HEARTH.hexSurface",
        "HEARTH.hexGate",
        "HEARTH.hexPairRenderer",
        "HEARTH.hexInteractiveSurface",
        "DEXTER_LAB.hearthHexSurfacePairPointerFingerGate",
        "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
        "DEXTER_LAB.hearthHexSurfaceRenderer",
        "DEXTER_LAB.hearthHexSurface",
        "DEXTER_LAB.hearthHexGate"
      ],
      expectedContracts: [
        EXPECTED_HEX_SURFACE_CONTRACT,
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
        "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
        "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v3",
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v2",
        "HEARTH_HEX_SURFACE_RENDERER_TNT_v1"
      ]
    }),
    Object.freeze({
      id: "CANVAS_PLATTER",
      role: "presentation-platter-and-dom-surface-authority",
      file: CANVAS_FILE,
      loadEligible: true,
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
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasVisiblePlanet",
        "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ],
      expectedContracts: [
        EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        EXPECTED_CANVAS_CONTRACT,
        "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
        "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
        "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
        "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
        "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
        "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
        "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
        "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
        "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5"
      ]
    })
  ]);

  const OBSERVED_ONLY_NODES = Object.freeze([
    Object.freeze({
      id: "INDEX_PRIEST",
      role: "passive-front-end-button-and-receipt-corridor",
      file: INDEX_FILE,
      aliases: [
        "HEARTH_INDEX_JS",
        "HEARTH.indexJs",
        "HEARTH.index",
        "DEXTER_LAB.hearthIndexJs"
      ],
      expectedContracts: [EXPECTED_INDEX_CONTRACT]
    }),
    Object.freeze({
      id: "POINTER_FINGER",
      role: "downstream-expression-authority-observed-only",
      file: POINTER_FINGER_FILE,
      aliases: [
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_POINTER",
        "HEARTH_POINTER_FINGER",
        "HEARTH_CANVAS_POINTER_FINGER",
        "HEARTH.canvasFingerInspect",
        "HEARTH.canvasFingerPointer",
        "HEARTH.pointerFinger",
        "HEARTH.canvasPointerFinger",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthCanvasFingerPointer",
        "DEXTER_LAB.hearthPointerFinger"
      ],
      expectedContracts: [
        EXPECTED_POINTER_FINGER_CONTRACT,
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
      ]
    })
  ]);

  const SOURCE_STACK = Object.freeze([
    Object.freeze({ id: "ELEVATION", file: "/assets/hearth/hearth.elevation.js", required: true, aliases: ["HEARTH_ELEVATION", "HEARTH.elevation", "DEXTER_LAB.hearthElevation"] }),
    Object.freeze({ id: "COMPOSITION", file: "/assets/hearth/hearth.composition.js", required: true, aliases: ["HEARTH_COMPOSITION", "HEARTH.composition", "DEXTER_LAB.hearthComposition"] }),
    Object.freeze({ id: "TECTONICS", file: "/assets/hearth/hearth.tectonics.js", required: true, aliases: ["HEARTH_TECTONICS", "HEARTH.tectonics", "DEXTER_LAB.hearthTectonics"] }),
    Object.freeze({ id: "HYDROLOGY", file: "/assets/hearth/hearth.hydrology.js", required: true, aliases: ["HEARTH_HYDROLOGY", "HEARTH.hydrology", "DEXTER_LAB.hearthHydrology"] }),
    Object.freeze({ id: "MATERIALS", file: "/assets/hearth/hearth.materials.js", required: true, aliases: ["HEARTH_MATERIALS", "HEARTH.materials", "DEXTER_LAB.hearthMaterials"] }),
    Object.freeze({ id: "LAND_CHANNEL", file: "/assets/hearth/hearth.land.channel.js", required: false, aliases: ["HEARTH_LAND_CHANNEL", "HEARTH.landChannel", "DEXTER_LAB.hearthLandChannel"] }),
    Object.freeze({ id: "WATER_CHANNEL", file: "/assets/hearth/hearth.water.channel.js", required: false, aliases: ["HEARTH_WATER_CHANNEL", "HEARTH.waterChannel", "DEXTER_LAB.hearthWaterChannel"] }),
    Object.freeze({ id: "AIR_CHANNEL", file: "/assets/hearth/hearth.air.channel.js", required: false, aliases: ["HEARTH_AIR_CHANNEL", "HEARTH.airChannel", "DEXTER_LAB.hearthAirChannel"] })
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    safeAssetAdmissionActive: true,
    safePacketBridgeActive: true,
    requiredRuntimeAssetAdmissionActive: true,
    lifecycleIgnitionSuppressed: true,
    canvasLifecycleMethodsSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    governedSourceStackDirectLoadSuppressed: true,
    duplicateScriptAppendSuppressed: true,
    filePathLoadLocksActive: true,
    reasonBasedLoadLocksRetired: true,

    routeConductorActiveScanAuthority: true,
    bilateralRouteCanvasScanActive: true,
    triangleScanActive: true,
    controlsRemainMotionInputGatewayAuthority: true,
    canvasRemainsPresentationPlatterAuthority: true,
    hexSurfaceRemainsDownstreamGateAuthority: true,
    pointerFingerRemainsDownstreamExpressionAuthority: true,
    pointerFingerDirectBridgePermissionGranted: false,
    singleHandshakeGreenLightBlocked: true,
    intendedHandoffVarianceIncluded: true,

    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "ROUTE_CONDUCTOR_V10_6_LOADED",

    nodes: {},
    sourceStack: [],
    relationships: [],
    assetAdmissions: [],
    events: [],
    errors: [],

    routeActiveScanConfirmed: false,
    routeControlsHandshakePermissionGranted: false,
    controlsGatewayPermissionGranted: false,
    routeHexScanPermissionGranted: false,
    hexSurfaceScanPermissionGranted: false,
    routeCanvasPresentationPermissionGranted: false,
    canvasAcceptanceScanRequested: false,
    canvasAcceptanceScanConfirmed: false,
    bilateralRouteCanvasScanConfirmed: false,
    sourceStackObserved: false,
    sourceStackPermissionGranted: false,
    constructPermissionGranted: false,
    visibleSurfacePermissionGranted: false,
    motionPermissionGranted: false,

    controlsAssetAdmissionStatus: "NOT_RUN",
    hexAuthorityAssetAdmissionStatus: "NOT_RUN",
    hexSurfaceAssetAdmissionStatus: "NOT_RUN",
    canvasAssetAdmissionStatus: "NOT_RUN",
    requiredAssetAdmissionStatus: "NOT_RUN",

    controlHandshakeDeliveryStatus: "NOT_RUN",
    controlHandshakeMethod: "NONE",
    canvasDeliveryStatus: "NOT_RUN",
    canvasDeliveryMethod: "NONE",
    canvasDeliveryReason: "NOT_RUN",
    hexScanDeliveryStatus: "NOT_RUN",
    hexScanDeliveryMethod: "NONE",

    canvasMountFound: false,
    canvasElementFound: false,
    canvasInMount: false,
    canvasRectNonzero: false,
    canvasContext2dReady: false,
    canvasPixelVisible: false,
    canvasSelector: "UNKNOWN",
    canvasMountSelector: "UNKNOWN",

    firstFailedCoordinate: "ROUTE_SAFE_ASSET_ADMISSION_NOT_RUN",
    recommendedNextFile: FILE,
    recommendedNextAction: "RUN_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_SCAN",
    postgameStatus: "ROUTE_CONDUCTOR_LOADED_SAFE_ASSET_ADMISSION_WAITING_SCAN",

    packetCount: 0,
    deliveryCount: 0,
    scanCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    scriptLoadCount: 0,
    duplicateScriptSuppressCount: 0,
    lifecycleSuppressionCount: 0,

    lastPresentationPacket: null,
    lastControlHandshakePacket: null,
    lastHexScanPacket: null,
    lastReceipt: null,

    ...NO_CLAIMS
  };

  const loadPromisesByPath = Object.create(null);
  let bootPromise = null;

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
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

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : safeString(value)}`;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path, base = root) {
    const parts = safeString(path).split(".");
    let cursor = base;

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
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths, base = root) {
    for (const path of paths || []) {
      const value = readPath(path, base);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readField(source, keys, fallback = "") {
    const object = isObject(source) ? source : {};

    for (const key of keys || []) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
        return object[key];
      }

      const lower = safeString(key).toLowerCase();

      for (const candidate of Object.keys(object)) {
        if (candidate.toLowerCase() === lower) {
          const value = object[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }

    return "";
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "ROUTE_CONDUCTOR_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 160);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ROUTE_CONDUCTOR_ERROR"),
      message: error && error.message ? String(error.message) : bounded(error, 1200),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 100);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    if (!doc) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function scriptMatchesPath(script, path) {
    if (!script || !path) return false;
    const raw = script.getAttribute ? safeString(script.getAttribute("src")) : "";

    if (!raw) return false;

    try {
      const base =
        root.location && root.location.origin
          ? root.location.origin
          : "https://diamondgatebridge.com";
      const url = new URL(raw, base);
      return url.pathname === path;
    } catch (_error) {
      return raw.includes(path);
    }
  }

  function scriptInfo(path) {
    if (!doc || !doc.querySelectorAll) {
      return {
        present: false,
        count: 0,
        src: "DOCUMENT_UNAVAILABLE",
        cacheKey: "NONE"
      };
    }

    const scripts = Array.from(doc.querySelectorAll("script[src]")).filter((script) => {
      return scriptMatchesPath(script, path);
    });

    const last = scripts[scripts.length - 1] || null;
    const rawSrc = last && last.getAttribute ? safeString(last.getAttribute("src")) : "";

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

  function appendScriptOnceByPath(path, reason = "SAFE_REQUIRED_ASSET_ADMISSION") {
    if (!doc) {
      return Promise.resolve({
        file: path,
        attempted: false,
        loaded: false,
        status: "DOCUMENT_UNAVAILABLE",
        src: "DOCUMENT_UNAVAILABLE",
        duplicateSuppressed: false
      });
    }

    const before = scriptInfo(path);

    if (before.present) {
      state.duplicateScriptSuppressCount += 1;
      return Promise.resolve({
        file: path,
        attempted: false,
        loaded: false,
        status: "SCRIPT_ALREADY_PRESENT_NO_APPEND",
        src: before.src,
        duplicateSuppressed: true
      });
    }

    if (loadPromisesByPath[path]) return loadPromisesByPath[path];

    loadPromisesByPath[path] = new Promise((resolve) => {
      let settled = false;

      function finish(output) {
        if (settled) return;
        settled = true;
        resolve(output);
      }

      try {
        const script = doc.createElement("script");
        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        script.id = `hearth-route-conductor-v10-6-${bounded(reason, 38).toLowerCase()}-${stamp}`;
        script.src =
          `${path}?v=${encodeURIComponent(RENEWAL_CONTRACT)}` +
          `&safeAssetAdmission=${encodeURIComponent(reason)}` +
          `&t=${encodeURIComponent(stamp)}`;
        script.async = false;
        script.defer = false;

        script.dataset.loadedBy = CONTRACT;
        script.dataset.routeConductorRenewalContract = RENEWAL_CONTRACT;
        script.dataset.routeConductorSafeAssetAdmission = "true";
        script.dataset.lifecycleIgnitionPermissionGranted = "false";
        script.dataset.canvasLifecycleIgnitionSuppressed = "true";
        script.dataset.pointerFingerDirectLoadSuppressed = "true";
        script.dataset.sourceStackDirectLoadSuppressed = "true";
        script.dataset.readyTextPermissionGranted = "false";
        script.dataset.visualPassClaimed = "false";
        script.dataset.generatedImage = "false";
        script.dataset.graphicBox = "false";
        script.dataset.webgl = "false";

        const timeout = root.setTimeout(() => {
          finish({
            file: path,
            attempted: true,
            loaded: false,
            status: "SCRIPT_LOAD_TIMEOUT_NON_FATAL",
            src: script.src,
            duplicateSuppressed: false
          });
        }, 6000);

        script.addEventListener("load", () => {
          try {
            root.clearTimeout(timeout);
          } catch (_error) {}

          state.scriptLoadCount += 1;
          finish({
            file: path,
            attempted: true,
            loaded: true,
            status: "SCRIPT_LOAD_COMPLETE",
            src: script.src,
            duplicateSuppressed: false
          });
        }, { once: true });

        script.addEventListener("error", () => {
          try {
            root.clearTimeout(timeout);
          } catch (_error) {}

          finish({
            file: path,
            attempted: true,
            loaded: false,
            status: "SCRIPT_LOAD_ERROR_OR_NOT_DEPLOYED",
            src: script.src,
            duplicateSuppressed: false
          });
        }, { once: true });

        (doc.head || doc.documentElement || doc.body).appendChild(script);
      } catch (error) {
        finish({
          file: path,
          attempted: true,
          loaded: false,
          status: `SCRIPT_APPEND_EXCEPTION:${bounded(error && error.message ? error.message : error, 900)}`,
          src: "SCRIPT_APPEND_EXCEPTION",
          duplicateSuppressed: false
        });
      }
    });

    return loadPromisesByPath[path];
  }

  async function admitRequiredRuntimeAssets() {
    const admissions = [];

    state.requiredAssetAdmissionStatus = "RUNNING";

    for (const def of REQUIRED_ASSET_CHAIN) {
      const before = scriptInfo(def.file);
      const foundBefore = firstGlobal(def.aliases || []);

      let admission = {
        id: def.id,
        file: def.file,
        role: def.role,
        scriptPresentBefore: before.present,
        authorityObservedBefore: Boolean(foundBefore.value),
        attempted: false,
        loaded: false,
        status: before.present ? "SCRIPT_ALREADY_PRESENT_NO_APPEND" : "NOT_ATTEMPTED",
        src: before.src,
        duplicateSuppressed: false,
        lifecycleIgnitionSuppressed: true,
        pointerFingerDirectLoadSuppressed: true,
        sourceStackDirectLoadSuppressed: true,
        ...NO_CLAIMS
      };

      if (!before.present && def.loadEligible === true) {
        const load = await appendScriptOnceByPath(def.file, `${def.id}_REQUIRED_ASSET_ADMISSION`);
        admission = {
          ...admission,
          attempted: load.attempted === true,
          loaded: load.loaded === true,
          status: load.status,
          src: load.src,
          duplicateSuppressed: load.duplicateSuppressed === true
        };
      }

      const after = scriptInfo(def.file);
      const foundAfter = firstGlobal(def.aliases || []);

      admission.scriptPresentAfter = after.present;
      admission.scriptCountAfter = after.count;
      admission.scriptSrcAfter = after.src;
      admission.scriptCacheKeyAfter = after.cacheKey;
      admission.authorityObservedAfter = Boolean(foundAfter.value);
      admission.selectedAliasPath = foundAfter.path;

      admissions.push(admission);

      if (def.id === "CONTROLS_QUEEN") state.controlsAssetAdmissionStatus = admission.status;
      if (def.id === "HEX_AUTHORITY") state.hexAuthorityAssetAdmissionStatus = admission.status;
      if (def.id === "HEX_SURFACE_GATE") state.hexSurfaceAssetAdmissionStatus = admission.status;
      if (def.id === "CANVAS_PLATTER") state.canvasAssetAdmissionStatus = admission.status;
    }

    state.assetAdmissions = admissions;

    const allScriptsPresent = admissions.every((entry) => entry.scriptPresentAfter === true);
    state.requiredAssetAdmissionStatus = allScriptsPresent
      ? "REQUIRED_RUNTIME_ASSET_ADMISSION_COMPLETE"
      : "REQUIRED_RUNTIME_ASSET_ADMISSION_PARTIAL";

    record("ROUTE_CONDUCTOR_REQUIRED_ASSET_ADMISSION_COMPLETE", {
      status: state.requiredAssetAdmissionStatus,
      admissions
    });

    return admissions;
  }

  function contractOf(source) {
    return firstNonEmpty(
      readField(source, [
        "renewalContract",
        "internalImplementationContract",
        "currentCanvasParentContract",
        "canvasContract",
        "controlsContract",
        "controlContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "pointerFingerContract",
        "routeConductorContract",
        "contract",
        "CONTRACT"
      ], ""),
      source && source.contract,
      source && source.CONTRACT
    );
  }

  function receiptOf(source) {
    return firstNonEmpty(
      readField(source, [
        "renewalReceipt",
        "internalImplementationReceipt",
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlsReceipt",
        "controlReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "pointerFingerReceipt",
        "routeConductorReceipt",
        "receipt",
        "RECEIPT"
      ], ""),
      source && source.receipt,
      source && source.RECEIPT
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const passiveMethods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlsReceipt",
      "getControlHandshakeReceipt",
      "getControlHandshakeSummary",
      "getQueenBridgeState",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getCanvasSurfaceReceipt",
      "getCanvasSurfaceSummary",
      "getPresentationReceipt",
      "getPresentationPlatterReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getHexReceipt",
      "getPointerFingerReceipt",
      "getPointerFingerSummary",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of passiveMethods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function contractRecognized(contract, accepted, family) {
    const text = safeString(contract);

    return Boolean(
      text &&
      (
        (accepted || []).includes(text) ||
        (family && text.includes(family))
      )
    );
  }

  function methodsOf(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    return Object.keys(authority)
      .filter((key) => isFunction(authority[key]))
      .sort();
  }

  async function scanNode(def) {
    const script = scriptInfo(def.file);
    const found = firstGlobal(def.aliases || []);
    const authority = found.value;
    const receiptObject = readAuthorityReceipt(authority) || {};
    const contract = firstNonEmpty(
      contractOf(receiptObject),
      authority && authority.contract,
      authority && authority.CONTRACT
    );
    const receiptName = firstNonEmpty(
      receiptOf(receiptObject),
      authority && authority.receipt,
      authority && authority.RECEIPT
    );

    const family =
      def.id === "CONTROLS_QUEEN"
        ? "HEARTH_CONTROLS"
        : def.id === "CANVAS_PLATTER"
          ? "HEARTH_CANVAS"
          : def.id === "HEX_SURFACE_GATE"
            ? "HEARTH_HEX_SURFACE"
            : def.id === "HEX_AUTHORITY"
              ? "HEARTH_HEX"
              : def.id === "POINTER_FINGER"
                ? "FINGER"
                : def.id === "INDEX_PRIEST"
                  ? "HEARTH_INDEX"
                  : "";

    const publicMethods = methodsOf(authority);

    const node = {
      id: def.id,
      role: def.role || "",
      file: def.file,
      required: REQUIRED_ASSET_CHAIN.includes(def),
      loadEligible: def.loadEligible === true,
      expectedContracts: clonePlain(def.expectedContracts || []),

      scriptPresent: script.present,
      scriptCount: script.count,
      scriptSrc: script.src,
      scriptCacheKey: script.cacheKey,

      observed: Boolean(authority),
      selectedAliasPath: found.path,
      contract: contract || "UNKNOWN",
      receipt: receiptName || "UNKNOWN",
      contractRecognized: contractRecognized(contract, def.expectedContracts || [], family),
      publicMethodCount: publicMethods.length,
      publicMethods,
      lifecycleMethodsObserved: publicMethods.filter((method) => {
        return ["boot", "start", "init", "mount", "render", "run"].includes(method);
      }),
      lifecycleIgnitionSuppressedByRoute: true,
      receiptObject: clonePlain(receiptObject),
      ...NO_CLAIMS
    };

    state.nodes[def.id] = node;
    return { node, authority, receipt: receiptObject };
  }

  async function scanSourceStack() {
    const out = [];

    for (const source of SOURCE_STACK) {
      const info = scriptInfo(source.file);
      const found = firstGlobal(source.aliases || []);
      const authority = found.value;
      const receipt = readAuthorityReceipt(authority) || {};

      out.push({
        id: source.id,
        file: source.file,
        required: source.required === true,
        scriptPresent: info.present,
        scriptCount: info.count,
        scriptSrc: info.src,
        loadAttempted: false,
        loadStatus: "SOURCE_STACK_DIRECT_LOAD_SUPPRESSED_BY_ROUTE_CONDUCTOR",
        status: authority
          ? "SOURCE_AUTHORITY_PRESENT"
          : source.required
            ? "SOURCE_AUTHORITY_REQUIRED_PENDING"
            : "SOURCE_AUTHORITY_OPTIONAL_PENDING",
        reason: authority ? "OBSERVED_PASSIVELY_BY_ROUTE_CONDUCTOR" : "AUTHORITY_NOT_OBSERVED_PASSIVE_ONLY",
        sourcePath: found.path,
        contract: contractOf(receipt) || "UNKNOWN",
        receipt: receiptOf(receipt) || "UNKNOWN",
        ...NO_CLAIMS
      });
    }

    state.sourceStack = out;
    state.sourceStackObserved = out.some((entry) => entry.status === "SOURCE_AUTHORITY_PRESENT");
    state.sourceStackPermissionGranted = out.every((entry) => {
      return entry.required !== true || entry.status === "SOURCE_AUTHORITY_PRESENT";
    });

    return out;
  }

  function composeControlHandshakePacket() {
    const packet = {
      packetType: CONTROL_HANDSHAKE_PACKET,
      type: CONTROL_HANDSHAKE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-safe-asset-admission-bridge",
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,

      targetFile: CONTROL_FILE,
      destinationFile: CONTROL_FILE,
      controlsFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      safeAssetAdmissionActive: true,
      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      triangleScanActive: true,

      controlHandshakePermissionGranted: true,
      controlsHandshakePermissionGranted: true,
      planetaryControlHandshakePermissionGranted: true,
      queenHandshakePermissionGranted: true,
      queenControlAdmissionPermissionGranted: true,
      controlAdmissionPermissionGranted: true,
      controlsAdmissionPermissionGranted: true,
      planetaryControlAdmissionPermissionGranted: true,

      routeConductorOwnsControlFileAdmission: true,
      routeConductorOwnsControlHandshakeDelivery: true,
      controlsRemainMotionInputGatewayAuthority: true,
      canvasPublicReceiverRequired: true,
      hexGateRequiredBeforePointerFinger: true,
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,
      sourceStackDirectLoadSuppressed: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastControlHandshakePacket = clonePlain(packet);
    return packet;
  }

  function controlHandshakeMethods() {
    return [
      "receiveRouteConductorControlHandshake",
      "consumeRouteConductorControlHandshake",
      "receiveHexGateControlHandshake",
      "consumeHexGateControlHandshake",
      "receiveQueenControlHandshake",
      "consumeQueenControlHandshake",
      "receiveControlHandshakePacket",
      "acceptControlHandshakePacket",
      "receiveControlHandshake",
      "consumeControlHandshake"
    ];
  }

  function publishPacketAliases(packet, lane) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    if (lane === "control") {
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE_PACKET = cloned;
      hearth.routeConductorControlHandshakePacket = cloned;
      hearth.routeConductorQueenControlHandshakePacket = cloned;
      hearth.routeConductorHexGateControlHandshakePacket = cloned;
      lab.hearthRouteConductorControlHandshakePacket = cloned;
      return;
    }

    if (lane === "hex") {
      root.HEARTH_ROUTE_CONDUCTOR_HEX_SURFACE_SCAN_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_TRANSMISSION_PACKET = cloned;
      hearth.routeConductorHexSurfaceScanPacket = cloned;
      hearth.routeConductorHexGateTransmissionPacket = cloned;
      lab.hearthRouteConductorHexSurfaceScanPacket = cloned;
      return;
    }

    root.HEARTH_ROUTE_CONDUCTOR_PRESENTATION_PLATTER_PACKET = cloned;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_PACKET = cloned;
    root.HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_PACKET = cloned;
    root.HEARTH_CANVAS_PRESENTATION_PLATTER_PACKET = cloned;

    hearth.routeConductorPresentationPlatterPacket = cloned;
    hearth.routeConductorCanvasHandoffPacket = cloned;
    hearth.routeConductorGovernedSourcePacket = cloned;
    hearth.canvasPresentationPlatterPacket = cloned;

    lab.hearthRouteConductorPresentationPlatterPacket = cloned;
    lab.hearthRouteConductorCanvasHandoffPacket = cloned;
  }

  function deliverControlHandshake(packet) {
    const controls = firstGlobal(REQUIRED_ASSET_CHAIN[0].aliases || []).value;

    if (!controls || !isObject(controls)) {
      state.controlHandshakeDeliveryStatus = "CONTROL_AUTHORITY_PENDING_HANDSHAKE_PACKET_PUBLISHED";
      state.controlHandshakeMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "control");
      return false;
    }

    const method = controlHandshakeMethods().find((name) => isFunction(controls[name]));

    if (!method) {
      state.controlHandshakeDeliveryStatus = "CONTROL_AUTHORITY_OBSERVED_HANDSHAKE_METHOD_PENDING_PACKET_PUBLISHED";
      state.controlHandshakeMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "control");
      return false;
    }

    try {
      controls[method](clonePlain(packet));
      state.controlHandshakeDeliveryStatus = "CONTROL_HANDSHAKE_PACKET_DELIVERED";
      state.controlHandshakeMethod = method;
      publishPacketAliases(packet, "control");
      return true;
    } catch (error) {
      recordError("ROUTE_CONTROL_HANDSHAKE_DELIVERY_FAILED", error, { method });

      state.controlHandshakeDeliveryStatus = "CONTROL_HANDSHAKE_PACKET_DELIVERY_FAILED_PACKET_PUBLISHED";
      state.controlHandshakeMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "control");
      return false;
    }
  }

  function composeHexScanPacket() {
    const packet = {
      packetType: HEX_SCAN_PACKET,
      type: HEX_SCAN_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-safe-asset-admission-bridge",
      targetFile: HEX_SURFACE_FILE,
      destinationFile: HEX_SURFACE_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      intendedMode: "ACTIVE_SCAN_PACKET_ONLY",
      expectedReturnPort: false,
      routeHexScanPermissionGranted: true,
      safeAssetAdmissionActive: true,
      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      routeDoesNotOwnHexTruth: true,
      routeDoesNotDeliverDirectlyToPointerFinger: true,
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastHexScanPacket = clonePlain(packet);
    return packet;
  }

  function hexSurfaceScanMethods() {
    return [
      "receiveRouteConductorHexSurfaceScan",
      "consumeRouteConductorHexSurfaceScan",
      "receiveHexSurfaceScanPacket",
      "consumeHexSurfaceScanPacket",
      "receiveRouteConductorHexGateTransmissionPacket",
      "consumeRouteConductorHexGateTransmissionPacket",
      "receiveHexGateTransmissionPacket",
      "consumeHexGateTransmissionPacket",
      "receiveHexTransmissionPacket",
      "consumeHexTransmissionPacket",
      "receiveRouteScanPacket",
      "consumeRouteScanPacket"
    ];
  }

  function deliverHexScan(packet) {
    const hex = firstGlobal(REQUIRED_ASSET_CHAIN[2].aliases || []).value;

    if (!hex || !isObject(hex)) {
      state.hexScanDeliveryStatus = "HEX_SURFACE_AUTHORITY_PENDING_SCAN_PACKET_PUBLISHED";
      state.hexScanDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "hex");
      return false;
    }

    const method = hexSurfaceScanMethods().find((name) => isFunction(hex[name]));

    if (!method) {
      state.hexScanDeliveryStatus = "HEX_SURFACE_OBSERVED_SCAN_METHOD_PENDING_PACKET_PUBLISHED";
      state.hexScanDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "hex");
      return false;
    }

    try {
      hex[method](clonePlain(packet));
      state.hexScanDeliveryStatus = "HEX_SURFACE_SCAN_PACKET_DELIVERED";
      state.hexScanDeliveryMethod = method;
      publishPacketAliases(packet, "hex");
      return true;
    } catch (error) {
      recordError("ROUTE_HEX_SURFACE_SCAN_DELIVERY_FAILED", error, { method });

      state.hexScanDeliveryStatus = "HEX_SURFACE_SCAN_DELIVERY_FAILED_PACKET_PUBLISHED";
      state.hexScanDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      publishPacketAliases(packet, "hex");
      return false;
    }
  }

  function composeGovernedSourcePacket() {
    return {
      packetType: GOVERNED_SOURCE_PACKET,
      type: GOVERNED_SOURCE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      route: ROUTE,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      safeAssetAdmissionActive: true,
      safePacketBridgeActive: true,
      sourceStackDirectLoadSuppressed: true,
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      sourceStack: clonePlain(state.sourceStack),
      nodes: clonePlain(state.nodes),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composePresentationPacket() {
    const packet = {
      packetType: PRESENTATION_PACKET,
      type: PRESENTATION_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      routeConductorContract: CONTRACT,
      routeConductorReceipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,

      route: ROUTE,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-safe-asset-admission-bridge",
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      handoffTo: "CANVAS_PRESENTATION_PLATTER",
      canvasFile: CANVAS_FILE,
      controlsFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      canvasAcceptanceScanRequested: true,
      bilateralRouteCanvasScanActive: true,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      safeAssetAdmissionActive: true,
      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      canvasLifecycleMethodsSuppressed: true,

      triangleScanActive: true,
      triangleMembers: ["ROUTE_CONDUCTOR", "CONTROLS_QUEEN", "HEX_SURFACE_GATE"],
      triangleFunnelsToCanvasPlatterByRoute: true,

      controlsRemainMotionInputGatewayAuthority: true,
      canvasRemainsPresentationPlatterAuthority: true,
      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasDoesNotOwnSourceTruth: true,
      routeDoesNotOwnCanvasDrawing: true,
      routeDoesNotOwnTerrainTruth: true,
      routeDoesNotOwnHydrologyTruth: true,
      routeDoesNotOwnMaterialTruth: true,
      routeDoesNotOwnHexTruth: true,
      routeDoesNotOwnPointerFingerTruth: true,

      routeToControlsHandshakePermissionGranted: state.routeControlsHandshakePermissionGranted,
      controlsGatewayPermissionGranted: state.controlsGatewayPermissionGranted,
      routeHexScanPermissionGranted: state.routeHexScanPermissionGranted,
      hexSurfaceScanPermissionGranted: state.hexSurfaceScanPermissionGranted,
      routeCanvasPresentationPermissionGranted: state.routeCanvasPresentationPermissionGranted,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      motionPermissionGranted: state.motionPermissionGranted,

      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      governedSourcePacket: composeGovernedSourcePacket(),
      controlHandshakePacket: clonePlain(state.lastControlHandshakePacket),
      hexScanPacket: clonePlain(state.lastHexScanPacket),
      delegatoryRelationships: clonePlain(state.relationships),
      delegatoryNodes: clonePlain(state.nodes),
      sourceStack: clonePlain(state.sourceStack),

      presentationSurfaceRequest: {
        mountSelector: "#hearthCanvasMount",
        canvasSelectors: [
          "#hearthCanvasMount canvas",
          "#hearthVisibleCanvas",
          "canvas[data-hearth-expression-surface='true']",
          "canvas[data-hearth-visible-canvas='true']",
          "canvas[data-hearth-canvas='true']",
          "canvas[data-hearth-planet-canvas='true']"
        ],
        canvasAcceptanceScanRequested: true,
        routeActiveScanConfirmed: state.routeActiveScanConfirmed,
        bilateralReturnPortExpected: true,
        lifecycleIgnitionPermissionGranted: false
      },

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.packetCount += 1;
    state.lastPresentationPacket = clonePlain(packet);
    return packet;
  }

  function canvasPacketReceiverMethods() {
    return [
      "receiveRoutePresentationPlatterPacket",
      "consumeRoutePresentationPlatterPacket",
      "receivePresentationPlatterPacket",
      "consumePresentationPlatterPacket",
      "receiveBilateralRouteCanvasPacket",
      "consumeBilateralRouteCanvasPacket",
      "receiveRouteConductorPresentationPacket",
      "consumeRouteConductorPresentationPacket",
      "receiveRouteConductorPacket",
      "consumeRouteConductorPacket",
      "receiveGovernedPresentationPacket",
      "consumeGovernedPresentationPacket",
      "receiveGovernedSourcePacket",
      "consumeGovernedSourcePacket",
      "acceptGovernedSourceStackPacket",
      "receiveCanvasHandoffPacket",
      "consumeCanvasHandoffPacket",
      "receiveHandoffPacket",
      "consumeHandoffPacket",
      "receiveRoutePacket",
      "consumeRoutePacket",
      "receiveControlPacket",
      "receiveControlsPacket",
      "receiveViewControlPacket",
      "receivePlanetaryViewControlPacket"
    ];
  }

  function deliverPresentationPacketToCanvas(packet) {
    const canvas = firstGlobal(REQUIRED_ASSET_CHAIN[3].aliases || []).value;

    state.canvasAcceptanceScanRequested = true;

    if (!canvas || !isObject(canvas)) {
      state.canvasDeliveryStatus = "CANVAS_AUTHORITY_PENDING_PRESENTATION_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_AUTHORITY_NOT_OBSERVED";
      publishPacketAliases(packet, "canvas");
      return {
        delivered: false,
        accepted: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }

    const lifecycleMethods = ["boot", "start", "init", "mount", "render", "run"].filter((name) => {
      return isFunction(canvas[name]);
    });

    if (lifecycleMethods.length) {
      state.lifecycleSuppressionCount += lifecycleMethods.length;
      record("CANVAS_LIFECYCLE_METHODS_OBSERVED_AND_SUPPRESSED", {
        lifecycleMethods,
        lifecycleIgnitionPermissionGranted: false
      });
    }

    const method = canvasPacketReceiverMethods().find((name) => isFunction(canvas[name]));

    if (!method) {
      state.canvasDeliveryStatus = "CANVAS_AUTHORITY_OBSERVED_EXPLICIT_PACKET_RECEIVER_PENDING_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_EXPLICIT_PACKET_RECEIVER_METHOD_NOT_OBSERVED_LIFECYCLE_METHODS_SUPPRESSED";
      publishPacketAliases(packet, "canvas");
      return {
        delivered: false,
        accepted: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }

    try {
      const output = canvas[method](clonePlain(packet));
      const resolved = isObject(output) ? output : {};
      const accepted = Boolean(
        safeBool(resolved.canvasAcceptanceScanConfirmed, false) ||
        safeBool(resolved.bilateralRouteCanvasScanConfirmed, false) ||
        safeBool(resolved.routePresentationPacketAccepted, false) ||
        safeBool(resolved.accepted, false) ||
        safeBool(resolved.ok, false)
      );

      state.canvasDeliveryStatus = "PRESENTATION_PACKET_DELIVERED_TO_CANVAS_EXPLICIT_PACKET_RECEIVER";
      state.canvasDeliveryMethod = method;
      state.canvasDeliveryReason = accepted
        ? "CANVAS_ACCEPTANCE_SCAN_CONFIRMED_BY_PACKET_RECEIVER_RETURN"
        : "CANVAS_PACKET_RECEIVER_CALLED_ACCEPTANCE_CONFIRMATION_PENDING";
      state.deliveryCount += 1;
      state.canvasAcceptanceScanConfirmed = accepted;

      publishPacketAliases(packet, "canvas");

      return {
        delivered: true,
        accepted,
        method,
        reason: state.canvasDeliveryReason,
        output: clonePlain(resolved)
      };
    } catch (error) {
      recordError("ROUTE_CANVAS_PRESENTATION_PACKET_DELIVERY_FAILED", error, { method });

      state.canvasDeliveryStatus = "CANVAS_PRESENTATION_PACKET_RECEIVER_FAILED_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_PACKET_RECEIVER_THROWN";
      publishPacketAliases(packet, "canvas");

      return {
        delivered: false,
        accepted: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }
  }

  function scanCanvasSurface() {
    const mount =
      q("#hearthCanvasMount") ||
      q("[data-hearth-canvas-mount]") ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-visible-planet-mount]");

    const canvas =
      q("#hearthCanvasMount canvas") ||
      q("#hearthVisibleCanvas") ||
      q("[data-hearth-canvas-mount] canvas") ||
      q("#hearthGlobeStage canvas") ||
      q("[data-hearth-globe-stage] canvas") ||
      q("canvas[data-hearth-expression-surface='true']") ||
      q("canvas[data-hearth-visible-canvas='true']") ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-planet-canvas='true']");

    let canvasRectNonzero = false;
    let contextReady = false;
    let pixelVisible = false;

    try {
      if (canvas && canvas.getBoundingClientRect) {
        const rect = canvas.getBoundingClientRect();
        canvasRectNonzero = rect.width > 0 && rect.height > 0;
      }
    } catch (_error) {}

    try {
      if (canvas && isFunction(canvas.getContext)) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        contextReady = Boolean(ctx);

        if (ctx && canvas.width > 0 && canvas.height > 0) {
          const data = ctx.getImageData(
            Math.max(0, Math.floor(canvas.width / 2)),
            Math.max(0, Math.floor(canvas.height / 2)),
            1,
            1
          ).data;
          pixelVisible = Boolean(data && (data[0] || data[1] || data[2] || data[3]));
        }
      }
    } catch (_error) {}

    state.canvasMountFound = Boolean(mount);
    state.canvasElementFound = Boolean(canvas);
    state.canvasInMount = Boolean(mount && canvas && mount.contains && mount.contains(canvas));
    state.canvasRectNonzero = canvasRectNonzero;
    state.canvasContext2dReady = contextReady;
    state.canvasPixelVisible = pixelVisible;
    state.canvasSelector = canvas
      ? (canvas.id ? `#${canvas.id}` : "canvas")
      : "UNKNOWN";
    state.canvasMountSelector = mount
      ? (mount.id ? `#${mount.id}` : "data-or-stage-mount")
      : "UNKNOWN";

    state.visibleSurfacePermissionGranted = Boolean(
      state.canvasMountFound &&
      state.canvasElementFound &&
      state.canvasRectNonzero &&
      state.canvasContext2dReady
    );

    return {
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasSelector: state.canvasSelector,
      canvasMountSelector: state.canvasMountSelector
    };
  }

  function relationship(id, fromNode, toNode, options = {}) {
    const from = state.nodes[fromNode] || {};
    const to = state.nodes[toNode] || {};

    const endpointPermissionGranted = Boolean(from.observed && to.observed);
    const requestPermissionGranted = options.requestObserved !== false;
    const receiverPermissionGranted = Boolean(to.observed);
    const returnPortPermissionGranted =
      options.expectedReturnPort === true
        ? options.returnObserved === true
        : true;

    const relationshipPermissionGranted = Boolean(
      endpointPermissionGranted &&
      requestPermissionGranted &&
      receiverPermissionGranted &&
      returnPortPermissionGranted
    );

    return {
      id,
      from: fromNode,
      to: toNode,
      fromFile: from.file || "UNKNOWN",
      toFile: to.file || "UNKNOWN",
      intendedMode: options.intendedMode || "HANDSHAKE",
      expectedReturnPort: options.expectedReturnPort === true,
      requiredForMotion: options.requiredForMotion === true,
      requiredForVisibleSurface: options.requiredForVisibleSurface === true,

      fromObserved: Boolean(from.observed),
      toObserved: Boolean(to.observed),
      fromContract: from.contract || "UNKNOWN",
      toContract: to.contract || "UNKNOWN",
      fromContractRecognized: Boolean(from.contractRecognized),
      toContractRecognized: Boolean(to.contractRecognized),

      requestObserved: requestPermissionGranted,
      grantObserved: receiverPermissionGranted,
      returnObserved: options.expectedReturnPort === true ? options.returnObserved === true : options.returnObserved !== false,

      endpointPermissionGranted,
      requestPermissionGranted,
      receiverPermissionGranted,
      returnPortPermissionGranted,
      relationshipPermissionGranted,

      relationshipStatus: relationshipPermissionGranted
        ? options.expectedReturnPort === true
          ? "HANDSHAKE_PERMISSION_CONFIRMED_WITH_RETURN_PORT"
          : "INTENDED_PACKET_HANDOFF_PERMISSION_CONFIRMED"
        : "RELATIONSHIP_PERMISSION_NOT_GRANTED",
      varianceClass: relationshipPermissionGranted
        ? options.expectedReturnPort === true
          ? "HANDSHAKE_COMPLETE"
          : "INTENDED_ONE_WAY_PACKET_HANDOFF_CONFIRMED"
        : "RELATIONSHIP_VARIANCE_PRESENT",

      fromAlias: from.selectedAliasPath || "NONE",
      toAlias: to.selectedAliasPath || "NONE",
      lifecycleIgnitionSuppressed: true,
      ...NO_CLAIMS
    };
  }

  function resolveRelationships() {
    const controlReceipt = state.nodes.CONTROLS_QUEEN && state.nodes.CONTROLS_QUEEN.receiptObject
      ? state.nodes.CONTROLS_QUEEN.receiptObject
      : {};
    const canvasReceipt = state.nodes.CANVAS_PLATTER && state.nodes.CANVAS_PLATTER.receiptObject
      ? state.nodes.CANVAS_PLATTER.receiptObject
      : {};
    const hexReceipt = state.nodes.HEX_SURFACE_GATE && state.nodes.HEX_SURFACE_GATE.receiptObject
      ? state.nodes.HEX_SURFACE_GATE.receiptObject
      : {};

    const controlReturnObserved = Boolean(
      safeBool(controlReceipt.handshakeAccepted, false) ||
      safeBool(controlReceipt.controlHandshakeAccepted, false) ||
      safeBool(controlReceipt.routeConductorControlHandshakeAccepted, false) ||
      /ACCEPTED|READY|ACTIVE/i.test(safeString(controlReceipt.handshakeStatus || controlReceipt.controlHandshakeStatus || ""))
    );

    const canvasReturnObserved = Boolean(
      state.canvasAcceptanceScanConfirmed ||
      safeBool(canvasReceipt.canvasAcceptanceScanConfirmed, false) ||
      safeBool(canvasReceipt.bilateralRouteCanvasScanConfirmed, false) ||
      safeBool(canvasReceipt.routePresentationPacketAccepted, false)
    );

    const hexReturnObserved = Boolean(
      safeBool(hexReceipt.hexSurfaceObserved, false) ||
      safeBool(hexReceipt.hexGateStatus, false) ||
      /HEX|GATE|READY|ACTIVE|OBSERVED/i.test(safeString(hexReceipt.hexGateStatus || hexReceipt.status || ""))
    );

    const rels = [
      relationship("ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE", "ROUTE_CONDUCTOR", "CONTROLS_QUEEN", {
        intendedMode: "PACKET_HANDSHAKE",
        expectedReturnPort: true,
        requiredForMotion: true,
        returnObserved: controlReturnObserved
      }),
      relationship("ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION", "ROUTE_CONDUCTOR", "HEX_SURFACE_GATE", {
        intendedMode: "PACKET_SCAN",
        expectedReturnPort: false,
        requiredForMotion: true,
        requiredForVisibleSurface: true,
        returnObserved: hexReturnObserved
      }),
      relationship("CONTROLS_TO_HEX_SURFACE_GATEWAY_SCAN", "CONTROLS_QUEEN", "HEX_SURFACE_GATE", {
        intendedMode: "HANDSHAKE_OR_GATEWAY_SCAN",
        expectedReturnPort: false,
        requiredForMotion: true,
        returnObserved: hexReturnObserved
      }),
      relationship("ROUTE_TO_CANVAS_PRESENTATION_PLATTER_PACKET", "ROUTE_CONDUCTOR", "CANVAS_PLATTER", {
        intendedMode: "EXPLICIT_PACKET_HANDOFF",
        expectedReturnPort: true,
        requiredForVisibleSurface: true,
        returnObserved: canvasReturnObserved
      }),
      relationship("HEX_SURFACE_TO_POINTER_FINGER_INTENDED_HANDOFF", "HEX_SURFACE_GATE", "POINTER_FINGER", {
        intendedMode: "DOWNSTREAM_HANDOFF_OBSERVED_ONLY",
        expectedReturnPort: false,
        requiredForMotion: false,
        requiredForVisibleSurface: false,
        returnObserved: true
      })
    ];

    state.relationships = rels;

    const byId = Object.fromEntries(rels.map((rel) => [rel.id, rel]));

    state.routeControlsHandshakePermissionGranted =
      byId.ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE.relationshipPermissionGranted;
    state.controlsGatewayPermissionGranted =
      state.routeControlsHandshakePermissionGranted;
    state.routeHexScanPermissionGranted =
      byId.ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION.relationshipPermissionGranted;
    state.hexSurfaceScanPermissionGranted =
      byId.ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION.relationshipPermissionGranted &&
      byId.CONTROLS_TO_HEX_SURFACE_GATEWAY_SCAN.relationshipPermissionGranted;
    state.routeCanvasPresentationPermissionGranted =
      byId.ROUTE_TO_CANVAS_PRESENTATION_PLATTER_PACKET.relationshipPermissionGranted;

    state.motionPermissionGranted = Boolean(
      state.routeControlsHandshakePermissionGranted &&
      state.hexSurfaceScanPermissionGranted
    );

    state.constructPermissionGranted = Boolean(
      state.routeControlsHandshakePermissionGranted &&
      state.routeHexScanPermissionGranted &&
      state.hexSurfaceScanPermissionGranted &&
      state.nodes.CANVAS_PLATTER &&
      state.nodes.CANVAS_PLATTER.observed
    );

    state.bilateralRouteCanvasScanConfirmed = Boolean(
      state.routeActiveScanConfirmed &&
      state.canvasAcceptanceScanConfirmed
    );

    return rels;
  }

  function resolveDisposition() {
    const requiredNodes = ["CONTROLS_QUEEN", "HEX_AUTHORITY", "HEX_SURFACE_GATE", "CANVAS_PLATTER"];
    const missingScript = requiredNodes.find((id) => {
      const node = state.nodes[id];
      return !node || node.scriptPresent !== true;
    });

    if (missingScript) {
      const node = state.nodes[missingScript] || {};
      state.firstFailedCoordinate = `${missingScript}_SCRIPT_NOT_PRESENT_AFTER_SAFE_ASSET_ADMISSION`;
      state.recommendedNextFile = node.file || FILE;
      state.recommendedNextAction = "VERIFY_DEPLOYED_ASSET_PATH_AND_SERVER_RESPONSE_FOR_REQUIRED_RUNTIME_SCRIPT";
      state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_HELD_SCRIPT_NOT_PRESENT";
      return;
    }

    const missingAuthority = requiredNodes.find((id) => {
      const node = state.nodes[id];
      return !node || !node.observed;
    });

    if (missingAuthority) {
      const node = state.nodes[missingAuthority] || {};
      state.firstFailedCoordinate = `${missingAuthority}_AUTHORITY_NOT_OBSERVED_AFTER_SCRIPT_ADMISSION`;
      state.recommendedNextFile = node.file || FILE;
      state.recommendedNextAction =
        missingAuthority === "CANVAS_PLATTER"
          ? "CONFIRM_CANVAS_PUBLIC_AUTHORITY_PUBLICATION_AND_EXPLICIT_PACKET_RECEIVER_NO_LIFECYCLE_CALL"
          : `CONFIRM_${missingAuthority}_PUBLIC_AUTHORITY_PUBLICATION`;
      state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_HELD_AUTHORITY_PENDING";
      return;
    }

    if (!state.routeControlsHandshakePermissionGranted) {
      state.firstFailedCoordinate = "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE_RETURN_PENDING";
      state.recommendedNextFile = CONTROL_FILE;
      state.recommendedNextAction = "REVIEW_CONTROLS_EXPLICIT_HANDSHAKE_RETURN_PORT";
      state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_HELD_CONTROL_HANDSHAKE_PENDING";
      return;
    }

    if (!state.hexSurfaceScanPermissionGranted) {
      state.firstFailedCoordinate = "HEX_SURFACE_SCAN_PERMISSION_NOT_GRANTED";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "REVIEW_HEX_SURFACE_GATE_SCAN_RECEIPT";
      state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_HELD_HEX_GATE_SCAN_PENDING";
      return;
    }

    if (!state.routeCanvasPresentationPermissionGranted) {
      state.firstFailedCoordinate = "ROUTE_TO_CANVAS_PRESENTATION_PLATTER_PACKET_RETURN_PENDING";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "RENEW_CANVAS_EXPLICIT_PACKET_RECEIVER_AND_DOM_SURFACE_BINDING_WITHOUT_ROUTE_LIFECYCLE_CALLS";
      state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_HELD_CANVAS_PACKET_ACCEPTANCE_PENDING";
      return;
    }

    if (!state.visibleSurfacePermissionGranted) {
      state.firstFailedCoordinate = state.canvasElementFound
        ? "CANVAS_SURFACE_PRESENT_BUT_NOT_READY"
        : "CANVAS_DOM_SURFACE_NOT_FOUND";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "RENEW_CANVAS_TO_CREATE_OR_BIND_DOM_CANVAS_SURFACE_AS_PRESENTATION_PLATTER";
      state.postgameStatus = "ROUTE_SAFE_SCAN_COMPLETE_CANVAS_SURFACE_STILL_PENDING";
      return;
    }

    state.firstFailedCoordinate = "NONE";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "REVIEW_SAFE_ASSET_ADMISSION_CONFIRMED_WITH_NO_FINAL_VISUAL_PASS_CLAIM";
    state.postgameStatus = "ROUTE_SAFE_ASSET_ADMISSION_COMPLETE_PRESENTATION_SURFACE_READY_NO_FINAL_CLAIM";
  }

  async function runSafePacketBridgeScan() {
    state.scanCount += 1;
    state.updatedAt = nowIso();

    await scanSourceStack();
    await admitRequiredRuntimeAssets();

    state.nodes.ROUTE_CONDUCTOR = {
      id: "ROUTE_CONDUCTOR",
      role: "route-permission-safe-asset-admission-bridge",
      file: FILE,
      required: true,
      loadEligible: false,
      expectedContracts: [
        CONTRACT,
        RENEWAL_CONTRACT,
        PREVIOUS_RENEWAL_CONTRACT,
        LINEAGE_V10_4_CONTRACT,
        LINEAGE_V10_3_CONTRACT,
        LINEAGE_V10_2_CONTRACT,
        LINEAGE_V10_1_CONTRACT,
        LINEAGE_V9_9_CONTRACT,
        LINEAGE_V9_8_CONTRACT,
        LINEAGE_V9_7_CONTRACT,
        LINEAGE_V9_6_CONTRACT,
        LINEAGE_V9_5_CONTRACT,
        COMPAT_V9_4_CONTRACT
      ],
      scriptPresent: true,
      scriptCount: scriptInfo(FILE).count || 1,
      scriptSrc: scriptInfo(FILE).src || FILE,
      scriptCacheKey: scriptInfo(FILE).cacheKey || RENEWAL_CONTRACT,
      observed: true,
      selectedAliasPath: "HEARTH_ROUTE_CONDUCTOR",
      contract: CONTRACT,
      receipt: RECEIPT,
      contractRecognized: true,
      publicMethodCount: Object.keys(api).filter((key) => isFunction(api[key])).length,
      publicMethods: Object.keys(api).filter((key) => isFunction(api[key])).sort(),
      lifecycleMethodsObserved: ["boot", "init", "render", "run", "start"],
      lifecycleIgnitionSuppressedByRoute: true,
      receiptObject: {},
      ...NO_CLAIMS
    };

    for (const def of OBSERVED_ONLY_NODES) {
      await scanNode(def);
    }

    for (const def of REQUIRED_ASSET_CHAIN) {
      await scanNode(def);
    }

    state.routeActiveScanConfirmed = Boolean(
      state.nodes.ROUTE_CONDUCTOR &&
      state.nodes.ROUTE_CONDUCTOR.observed &&
      state.nodes.CONTROLS_QUEEN &&
      state.nodes.CONTROLS_QUEEN.observed &&
      state.nodes.HEX_SURFACE_GATE &&
      state.nodes.HEX_SURFACE_GATE.observed
    );

    const controlPacket = composeControlHandshakePacket();
    deliverControlHandshake(controlPacket);

    const hexPacket = composeHexScanPacket();
    deliverHexScan(hexPacket);

    const presentationPacket = composePresentationPacket();
    const delivery = deliverPresentationPacketToCanvas(presentationPacket);

    if (delivery.accepted) {
      state.canvasAcceptanceScanConfirmed = true;
    }

    for (const def of REQUIRED_ASSET_CHAIN) {
      await scanNode(def);
    }

    for (const def of OBSERVED_ONLY_NODES) {
      await scanNode(def);
    }

    scanCanvasSurface();
    resolveRelationships();
    resolveDisposition();
    updateDataset();
    publishReceiptAliases();

    record("ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_SCAN_COMPLETE", {
      requiredAssetAdmissionStatus: state.requiredAssetAdmissionStatus,
      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      controlsGatewayPermissionGranted: state.controlsGatewayPermissionGranted,
      hexSurfaceScanPermissionGranted: state.hexSurfaceScanPermissionGranted,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      lifecycleIgnitionSuppressed: true,
      pointerFingerDirectLoadSuppressed: true,
      sourceStackDirectLoadSuppressed: true
    });

    return getReceipt();
  }

  function readIndexSummary() {
    return clonePlain(state.nodes.INDEX_PRIEST || {});
  }

  function readControlSummary() {
    return clonePlain(state.nodes.CONTROLS_QUEEN || {});
  }

  function readCanvasSummary() {
    return clonePlain(state.nodes.CANVAS_PLATTER || {});
  }

  function readHexAuthoritySummary() {
    return clonePlain(state.nodes.HEX_AUTHORITY || {});
  }

  function readHexSurfaceSummary() {
    return clonePlain(state.nodes.HEX_SURFACE_GATE || {});
  }

  function readPointerFingerSummary() {
    return clonePlain(state.nodes.POINTER_FINGER || {});
  }

  function readSourceStackSummary() {
    return clonePlain(state.sourceStack);
  }

  function readSourceSummary() {
    return readSourceStackSummary();
  }

  function getTransmissionPath() {
    return [
      INDEX_FILE,
      FILE,
      CONTROL_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      CANVAS_FILE,
      `${HEX_SURFACE_FILE} -> ${POINTER_FINGER_FILE}`,
      "GOVERNED_SOURCE_STACK_OBSERVED_ONLY"
    ];
  }

  function composeSourceHoldPacket() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_SOURCE_HOLD_PACKET_v10_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      route: ROUTE,
      file: FILE,
      sourceStackDirectLoadSuppressed: true,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      sourceStack: clonePlain(state.sourceStack),
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      ...NO_CLAIMS
    };
  }

  function getSourceHoldPacket() {
    return composeSourceHoldPacket();
  }

  function getSourceStack() {
    return clonePlain(state.sourceStack);
  }

  function getSourceStackPacket() {
    return composeGovernedSourcePacket();
  }

  function getGovernedSourcePacket() {
    return composeGovernedSourcePacket();
  }

  function getCanvasHandoffPacket() {
    return clonePlain(state.lastPresentationPacket || composePresentationPacket());
  }

  function getHandoffPacket() {
    return getCanvasHandoffPacket();
  }

  function getCanvasReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getControlHandshakePacket() {
    return clonePlain(state.lastControlHandshakePacket || composeControlHandshakePacket());
  }

  function getControlsHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getPlanetaryControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getQueenControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getRouteConductorControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getHexGateTransmissionPacket() {
    return clonePlain(state.lastHexScanPacket || composeHexScanPacket());
  }

  function getHexTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getRouteConductorHexGateTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getPointerFingerTransmissionPacket() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_POINTER_FINGER_OBSERVATION_PACKET_v10_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      sourceFile: FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      pointerFingerObserved: Boolean(state.nodes.POINTER_FINGER && state.nodes.POINTER_FINGER.observed),
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,
      intendedPath: `${HEX_SURFACE_FILE} -> ${POINTER_FINGER_FILE}`,
      ...NO_CLAIMS
    };
  }

  function getRouteConductorPointerFingerTransmissionPacket() {
    return getPointerFingerTransmissionPacket();
  }

  function composeCompatibilityReceiptV94() {
    return {
      contract: COMPAT_V9_4_CONTRACT,
      receipt: "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4",
      compatibilityBridgePreserved: true,
      currentContract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      route: ROUTE,
      file: FILE,
      canvasFile: CANVAS_FILE,
      lifecycleIgnitionSuppressed: true,
      ...NO_CLAIMS
    };
  }

  function getRouteCycleReceipt() {
    return getReceiptLight();
  }

  function getRoutePrimaryGateReceipt() {
    return getReceiptLight();
  }

  function composeReceipt() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_RECEIPT_PACKET_v10_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
      lineageV104Contract: LINEAGE_V10_4_CONTRACT,
      lineageV103Contract: LINEAGE_V10_3_CONTRACT,
      lineageV102Contract: LINEAGE_V10_2_CONTRACT,
      lineageV101Contract: LINEAGE_V10_1_CONTRACT,
      lineageV99Contract: LINEAGE_V9_9_CONTRACT,
      lineageV98Contract: LINEAGE_V9_8_CONTRACT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV96Contract: LINEAGE_V9_6_CONTRACT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      version: VERSION,

      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedPointerFingerContract: EXPECTED_POINTER_FINGER_CONTRACT,

      activeNewsCycle: "ROUTE_CONTROLS_HEX_SURFACE_CANVAS_SAFE_ASSET_ADMISSION",
      activeFibonacci: "F13_HELD_F21_NORTH_ONLY",

      safeAssetAdmissionActive: true,
      requiredRuntimeAssetAdmissionActive: true,
      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      canvasLifecycleMethodsSuppressed: true,
      pointerFingerDirectLoadSuppressed: true,
      governedSourceStackDirectLoadSuppressed: true,
      duplicateScriptAppendSuppressed: true,
      filePathLoadLocksActive: true,
      reasonBasedLoadLocksRetired: true,

      routeConductorActiveScanAuthority: true,
      bilateralRouteCanvasScanActive: true,
      triangleScanActive: true,
      triangleMembers: ["ROUTE_CONDUCTOR", "CONTROLS_QUEEN", "HEX_SURFACE_GATE"],
      triangleFunnelsToCanvasPlatterByRoute: true,

      controlsRemainMotionInputGatewayAuthority: true,
      canvasRemainsPresentationPlatterAuthority: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      pointerFingerRemainsDownstreamExpressionAuthority: true,
      pointerFingerDirectDeliveryPermissionGranted: false,

      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      transmissionPath: getTransmissionPath(),

      requiredAssetAdmissionStatus: state.requiredAssetAdmissionStatus,
      controlsAssetAdmissionStatus: state.controlsAssetAdmissionStatus,
      hexAuthorityAssetAdmissionStatus: state.hexAuthorityAssetAdmissionStatus,
      hexSurfaceAssetAdmissionStatus: state.hexSurfaceAssetAdmissionStatus,
      canvasAssetAdmissionStatus: state.canvasAssetAdmissionStatus,
      assetAdmissions: clonePlain(state.assetAdmissions),

      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      controlsGatewayPermissionGranted: state.controlsGatewayPermissionGranted,
      routeControlsHandshakePermissionGranted: state.routeControlsHandshakePermissionGranted,
      routeHexScanPermissionGranted: state.routeHexScanPermissionGranted,
      hexSurfaceScanPermissionGranted: state.hexSurfaceScanPermissionGranted,
      routeCanvasPresentationPermissionGranted: state.routeCanvasPresentationPermissionGranted,
      canvasAcceptanceScanRequested: state.canvasAcceptanceScanRequested,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      motionPermissionGranted: state.motionPermissionGranted,

      controlHandshakeDeliveryStatus: state.controlHandshakeDeliveryStatus,
      controlHandshakeMethod: state.controlHandshakeMethod,
      canvasDeliveryStatus: state.canvasDeliveryStatus,
      canvasDeliveryMethod: state.canvasDeliveryMethod,
      canvasDeliveryReason: state.canvasDeliveryReason,
      hexScanDeliveryStatus: state.hexScanDeliveryStatus,
      hexScanDeliveryMethod: state.hexScanDeliveryMethod,

      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasSelector: state.canvasSelector,
      canvasMountSelector: state.canvasMountSelector,

      nodes: clonePlain(state.nodes),
      delegatoryNodes: clonePlain(state.nodes),
      relationships: clonePlain(state.relationships),
      delegatoryRelationships: clonePlain(state.relationships),
      sourceStack: clonePlain(state.sourceStack),
      admissions: clonePlain(state.sourceStack),

      lastPresentationPacket: clonePlain(state.lastPresentationPacket),
      lastControlHandshakePacket: clonePlain(state.lastControlHandshakePacket),
      lastHexScanPacket: clonePlain(state.lastHexScanPacket),

      packetCount: state.packetCount,
      deliveryCount: state.deliveryCount,
      scanCount: state.scanCount,
      scriptLoadCount: state.scriptLoadCount,
      duplicateScriptSuppressCount: state.duplicateScriptSuppressCount,
      lifecycleSuppressionCount: state.lifecycleSuppressionCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      booted: state.booted,
      disposed: state.disposed,
      latestEvent: state.latestEvent,
      errorCount: state.errors.length,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsRoutePermissionCoordination: true,
      ownsActiveScan: true,
      ownsRequiredAssetAdmission: true,
      ownsControlHandshakeDelivery: true,
      ownsHexSurfaceScan: true,
      ownsCanvasPresentationPacketIssue: true,
      ownsCanvasDrawing: false,
      ownsCanvasDomSurface: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
      ownsPointerFingerTruth: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    const receipt = composeReceipt();
    delete receipt.lastPresentationPacket;
    delete receipt.lastControlHandshakePacket;
    delete receipt.lastHexScanPacket;
    delete receipt.events;
    delete receipt.errors;
    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function getReceipt() {
    const receipt = {
      ...composeReceipt(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };

    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function composeReceiptText(receipt = getReceiptLight()) {
    const r = isObject(receipt) ? receipt : getReceiptLight();

    return [
      "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("renewalContract", RENEWAL_CONTRACT),
      line("renewalReceipt", RENEWAL_RECEIPT),
      line("previousRenewalContract", PREVIOUS_RENEWAL_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "FILES",
      line("indexFile", INDEX_FILE),
      line("controlFile", CONTROL_FILE),
      line("canvasFile", CANVAS_FILE),
      line("hexAuthorityFile", HEX_AUTHORITY_FILE),
      line("hexSurfaceFile", HEX_SURFACE_FILE),
      line("pointerFingerFile", POINTER_FINGER_FILE),
      "",
      "SAFE_ASSET_ADMISSION",
      line("safeAssetAdmissionActive", true),
      line("requiredRuntimeAssetAdmissionActive", true),
      line("requiredAssetAdmissionStatus", r.requiredAssetAdmissionStatus),
      line("controlsAssetAdmissionStatus", r.controlsAssetAdmissionStatus),
      line("hexAuthorityAssetAdmissionStatus", r.hexAuthorityAssetAdmissionStatus),
      line("hexSurfaceAssetAdmissionStatus", r.hexSurfaceAssetAdmissionStatus),
      line("canvasAssetAdmissionStatus", r.canvasAssetAdmissionStatus),
      line("lifecycleIgnitionSuppressed", true),
      line("canvasLifecycleMethodsSuppressed", true),
      line("pointerFingerDirectLoadSuppressed", true),
      line("governedSourceStackDirectLoadSuppressed", true),
      line("duplicateScriptAppendSuppressed", true),
      line("filePathLoadLocksActive", true),
      line("scriptLoadCount", r.scriptLoadCount),
      line("duplicateScriptSuppressCount", r.duplicateScriptSuppressCount),
      line("lifecycleSuppressionCount", r.lifecycleSuppressionCount),
      "",
      "BILATERAL_SCAN",
      line("routeConductorActiveScanAuthority", true),
      line("bilateralRouteCanvasScanActive", true),
      line("routeActiveScanConfirmed", r.routeActiveScanConfirmed),
      line("canvasAcceptanceScanRequested", r.canvasAcceptanceScanRequested),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("singleHandshakeGreenLightBlocked", true),
      "",
      "TRIANGLE",
      line("triangleScanActive", true),
      line("triangleMembers", "ROUTE_CONDUCTOR,CONTROLS_QUEEN,HEX_SURFACE_GATE"),
      line("controlsGatewayPermissionGranted", r.controlsGatewayPermissionGranted),
      line("hexSurfaceScanPermissionGranted", r.hexSurfaceScanPermissionGranted),
      line("routeCanvasPresentationPermissionGranted", r.routeCanvasPresentationPermissionGranted),
      line("constructPermissionGranted", r.constructPermissionGranted),
      line("motionPermissionGranted", r.motionPermissionGranted),
      "",
      "CANVAS_SURFACE",
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("canvasDeliveryReason", r.canvasDeliveryReason),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight());
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("requiredAssetAdmissionStatus", r.requiredAssetAdmissionStatus),
      line("safeAssetAdmissionActive", true),
      line("lifecycleIgnitionSuppressed", true),
      line("routeActiveScanConfirmed", r.routeActiveScanConfirmed),
      line("controlsGatewayPermissionGranted", r.controlsGatewayPermissionGranted),
      line("hexSurfaceScanPermissionGranted", r.hexSurfaceScanPermissionGranted),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("constructPermissionGranted", r.constructPermissionGranted),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthRouteConductorCurrent", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthRouteConductorSafeAssetAdmissionActive", "true");
    setDataset("hearthRequiredRuntimeAssetAdmissionActive", "true");
    setDataset("hearthRequiredAssetAdmissionStatus", state.requiredAssetAdmissionStatus);
    setDataset("hearthControlsAssetAdmissionStatus", state.controlsAssetAdmissionStatus);
    setDataset("hearthHexAuthorityAssetAdmissionStatus", state.hexAuthorityAssetAdmissionStatus);
    setDataset("hearthHexSurfaceAssetAdmissionStatus", state.hexSurfaceAssetAdmissionStatus);
    setDataset("hearthCanvasAssetAdmissionStatus", state.canvasAssetAdmissionStatus);

    setDataset("hearthRouteConductorSafePacketBridgeActive", "true");
    setDataset("hearthRouteConductorLifecycleIgnitionSuppressed", "true");
    setDataset("hearthRouteConductorCanvasLifecycleMethodsSuppressed", "true");
    setDataset("hearthRouteConductorPointerFingerDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorSourceStackDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorDuplicateScriptAppendSuppressed", "true");
    setDataset("hearthRouteConductorFilePathLoadLocksActive", "true");
    setDataset("hearthRouteConductorReasonBasedLoadLocksRetired", "true");

    setDataset("hearthRouteActiveScanConfirmed", String(state.routeActiveScanConfirmed));
    setDataset("hearthControlsGatewayPermissionGranted", String(state.controlsGatewayPermissionGranted));
    setDataset("hearthRouteHexScanPermissionGranted", String(state.routeHexScanPermissionGranted));
    setDataset("hearthHexSurfaceScanPermissionGranted", String(state.hexSurfaceScanPermissionGranted));
    setDataset("hearthRouteCanvasPresentationPermissionGranted", String(state.routeCanvasPresentationPermissionGranted));
    setDataset("hearthCanvasAcceptanceScanRequested", String(state.canvasAcceptanceScanRequested));
    setDataset("hearthCanvasAcceptanceScanConfirmed", String(state.canvasAcceptanceScanConfirmed));
    setDataset("hearthBilateralRouteCanvasScanConfirmed", String(state.bilateralRouteCanvasScanConfirmed));
    setDataset("hearthConstructPermissionGranted", String(state.constructPermissionGranted));
    setDataset("hearthVisibleSurfacePermissionGranted", String(state.visibleSurfacePermissionGranted));
    setDataset("hearthMotionPermissionGranted", String(state.motionPermissionGranted));

    setDataset("hearthControlHandshakeDeliveryStatus", state.controlHandshakeDeliveryStatus);
    setDataset("hearthControlHandshakeMethod", state.controlHandshakeMethod);
    setDataset("hearthCanvasDeliveryStatus", state.canvasDeliveryStatus);
    setDataset("hearthCanvasDeliveryMethod", state.canvasDeliveryMethod);
    setDataset("hearthCanvasDeliveryReason", state.canvasDeliveryReason);
    setDataset("hearthHexScanDeliveryStatus", state.hexScanDeliveryStatus);
    setDataset("hearthHexScanDeliveryMethod", state.hexScanDeliveryMethod);

    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);

    setDataset("hearthRouteConductorFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthRouteConductorRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthRouteConductorRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthRouteConductorPostgameStatus", state.postgameStatus);

    setDataset("hearthRouteConductorF13Claimed", "false");
    setDataset("hearthRouteConductorF21EligibleForNorth", "false");
    setDataset("hearthRouteConductorReadyTextAllowed", "false");
    setDataset("hearthRouteConductorReadyTextClaimed", "false");
    setDataset("hearthRouteConductorVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const paths = [
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION",
      "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF",
      "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE",
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
      "HEARTH.routeConductor",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
      "HEARTH.routeConductorSafeAssetAdmissionNoLifecycleIgnition",
      "HEARTH.routeConductorSafePacketBridgeNoLifecycleIgnition",
      "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
      "HEARTH.routeConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "HEARTH.routeConductorHexGatePointerFingerTransmission",
      "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeNorthBishop",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorPrimaryGate",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
      "DEXTER_LAB.hearthRouteConductorSafeAssetAdmissionNoLifecycleIgnition",
      "DEXTER_LAB.hearthRouteConductorSafePacketBridgeNoLifecycleIgnition",
      "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
      "DEXTER_LAB.hearthRouteConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
      "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ];

    for (const path of paths) setPath(path, api);

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();

    state.receiptPublishCount += 1;

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SAFE_ASSET_ADMISSION_NO_LIFECYCLE_IGNITION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_REPORT = receipt;

    hearth.routeConductorReceipt = receipt;
    hearth.routeConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt = receipt;
    hearth.routeConductorSafeAssetAdmissionNoLifecycleIgnitionReceipt = receipt;
    hearth.routeConductorSafePacketBridgeNoLifecycleIgnitionReceipt = receipt;
    hearth.routeConductorGovernedSourceStackAdmissionCanvasHandoffReceipt = receipt;
    hearth.routeConductorBilateralTriangleScanCanvasPlatterPacketBridgeReceipt = receipt;
    hearth.routeConductorReport = receipt;

    lab.hearthRouteConductorReceipt = receipt;
    lab.hearthRouteConductorSafeAssetAdmissionNoLifecycleIgnitionReceipt = receipt;
    lab.hearthRouteConductorSafePacketBridgeNoLifecycleIgnitionReceipt = receipt;
    lab.hearthRouteConductorBilateralTriangleScanCanvasPlatterPacketBridgeReceipt = receipt;
    lab.hearthRouteConductorReport = receipt;

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

    record("ROUTE_CONDUCTOR_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      requiredAssetAdmissionStatus: state.requiredAssetAdmissionStatus,
      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      lifecycleIgnitionSuppressed: true,
      visualPassClaimed: false
    });

    return true;
  }

  function refresh() {
    return runSafePacketBridgeScan();
  }

  function observePassive() {
    updateDataset();
    publishReceiptAliases();
    return getReceiptLight();
  }

  function loadMissingDirectChain() {
    return runSafePacketBridgeScan();
  }

  function run() {
    return boot();
  }

  function start() {
    return boot();
  }

  function init() {
    return boot();
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(async () => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "ROUTE_CONDUCTOR_BOOTING_SAFE_ASSET_ADMISSION_SCAN";

      publishApiAliases();
      updateDataset();

      await runSafePacketBridgeScan();

      state.booted = true;
      state.booting = false;
      state.updatedAt = nowIso();

      publishGlobals("boot-complete");

      return getReceipt();
    }).catch((error) => {
      state.booting = false;
      recordError("ROUTE_CONDUCTOR_BOOT_FAILED", error);
      updateDataset();
      publishReceiptAliases();
      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "ROUTE_CONDUCTOR_DISPOSED";
    record("ROUTE_CONDUCTOR_DISPOSED", { reason });
    updateDataset();
    publishReceiptAliases();
    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    activeNewsCycle: "ROUTE_CONTROLS_HEX_SURFACE_CANVAS_SAFE_ASSET_ADMISSION",
    activeFibonacci: "F13_HELD_F21_NORTH_ONLY",

    safeAssetAdmissionActive: true,
    requiredRuntimeAssetAdmissionActive: true,
    safePacketBridgeActive: true,
    lifecycleIgnitionSuppressed: true,
    canvasLifecycleMethodsSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    governedSourceStackDirectLoadSuppressed: true,
    duplicateScriptAppendSuppressed: true,
    filePathLoadLocksActive: true,
    reasonBasedLoadLocksRetired: true,

    routeConductorActiveScanAuthority: true,
    bilateralRouteCanvasScanActive: true,
    triangleScanActive: true,
    controlsRemainMotionInputGatewayAuthority: true,
    canvasRemainsPresentationPlatterAuthority: true,
    hexSurfaceRemainsDownstreamGateAuthority: true,
    pointerFingerRemainsDownstreamExpressionAuthority: true,
    pointerFingerDirectBridgePermissionGranted: false,
    singleHandshakeGreenLightBlocked: true,
    intendedHandoffVarianceIncluded: true,

    boot,
    start,
    init,
    run,
    refresh,
    render: refresh,
    observePassive,
    dispose,

    runSafePacketBridgeScan,
    runBilateralScan: runSafePacketBridgeScan,
    admitRequiredRuntimeAssets,
    loadMissingDirectChain,
    scanCanvasSurface,
    scanSourceStack,
    scanNode,

    composeReceipt,
    composeReceiptText,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    composeControlHandshakePacket,
    getControlHandshakePacket,
    getControlsHandshakePacket,
    getPlanetaryControlHandshakePacket,
    getQueenControlHandshakePacket,
    getRouteConductorControlHandshakePacket,

    composeGovernedSourcePacket,
    getGovernedSourcePacket,
    getSourceStack,
    getSourceStackPacket,
    getSourceHoldPacket,
    composeSourceHoldPacket,

    composePresentationPacket,
    composeCanvasHandoffPacket: composePresentationPacket,
    getCanvasHandoffPacket,
    getHandoffPacket,
    getCanvasReleasePacket,
    getReleasePacket,

    composeHexGateTransmissionPacket: composeHexScanPacket,
    getHexGateTransmissionPacket,
    getHexTransmissionPacket,
    getRouteConductorHexGateTransmissionPacket,

    composePointerFingerTransmissionPacket: getPointerFingerTransmissionPacket,
    getPointerFingerTransmissionPacket,
    getRouteConductorPointerFingerTransmissionPacket,

    composeCompatibilityReceiptV94,
    getTransmissionPath,

    readIndexSummary,
    readControlSummary,
    readCanvasSummary,
    readHexAuthoritySummary,
    readHexSurfaceSummary,
    readPointerFingerSummary,
    readSourceStackSummary,
    readSourceSummary,

    publishApiAliases,
    publishGlobals,
    publishReceiptAliases,
    updateDataset,

    ownsRoutePermissionCoordination: true,
    ownsActiveScan: true,
    ownsRequiredAssetAdmission: true,
    ownsControlHandshakeDelivery: true,
    ownsHexSurfaceScan: true,
    ownsCanvasPresentationPacketIssue: true,
    ownsCanvasDrawing: false,
    ownsCanvasDomSurface: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexTruth: false,
    ownsPointerFingerTruth: false,
    ownsFinalVisualPassClaim: false,

    supportsSafeAssetAdmission: true,
    supportsSafePacketBridge: true,
    supportsNoLifecycleIgnition: true,
    supportsBilateralRouteCanvasScan: true,
    supportsTriangleRouteControlsHexScan: true,
    supportsCanvasPresentationPlatterPacket: true,
    supportsControlsGatewayBaseline: true,
    supportsHexSurfaceActiveScan: true,
    supportsIntendedHandoffVariance: true,
    supportsSingleHandshakeGreenLightBlocked: true,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get receiptObject() {
      return getReceiptLight();
    },

    get report() {
      return getReceipt();
    }
  });

  try {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("ROUTE_CONDUCTOR_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
