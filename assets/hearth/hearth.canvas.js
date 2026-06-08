// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_TNT_v12_5
// Full-file replacement.
// Hearth Canvas presentation platter only.
//
// Purpose:
// - Preserve the public v12_3 Canvas contract expected by Route Conductor, Controls,
//   diagnostics, Hex Surface, Pointer/Finger inspection, and Index.
// - Preserve the v12_4 live-surface identity lane.
// - Preserve v12_4_1 canonical DOM surface binding and zero-rect repair.
// - Preserve v12_4_2 downstream-surface admission and fallback suppression.
// - Preserve v12_4_3 canonical rect-lock frame.
// - Add the missing Canvas -> Hex Surface map-tuple bridge.
// - Stop terminating view/control math locally.
// - Compose and transmit a lawful Canvas Hex Gate packet to /assets/hearth/hearth.hex.surface.js.
// - Use the same canonical map tuple to request renderable surface expression samples
//   from the public Surface Pointer/Finger socket.
// - Draw only renderable downstream surface expression evidence into the canonical canvas.
// - Reject metadata-only downstream latches.
// - Keep local fallback available only as a pre-bridge placeholder.
// - Once renderable downstream surface evidence is drawn, suppress all later fallback repaint attempts.
// - Never treat fallback pixels or renderable expression pixels as final visual pass.
// - Do not own Route Conductor authority, Controls motion authority, terrain truth,
//   hydrology truth, elevation truth, material truth, Hex truth, Pointer/Finger truth,
//   F13 claim, F21 claim, ready text, final visual pass, generated image,
//   GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_RECEIPT_v12_5";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_TNT_v12_4_3";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_RECEIPT_v12_4_3";

  const LINEAGE_V12_4_3_CONTRACT =
    "HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_TNT_v12_4_3";
  const LINEAGE_V12_4_2_CONTRACT =
    "HEARTH_CANVAS_HUB_DOWNSTREAM_SURFACE_ADMISSION_FALLBACK_SUPPRESSION_TNT_v12_4_2";
  const LINEAGE_V12_4_1_CONTRACT =
    "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_TNT_v12_4_1";
  const LINEAGE_V12_4_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const LINEAGE_V12_3_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const LINEAGE_V12_3_2_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const LINEAGE_V12_3_1_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1";
  const LINEAGE_V12_2_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_V11_7_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";

  const VERSION =
    "2026-06-07.hearth-canvas-canonical-hex-gate-map-tuple-bridge-renderable-surface-return-v12-5";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANONICAL_MOUNT_ID = "hearthCanvasMount";
  const CANONICAL_FRAME_ID = "hearthCanvasRectLockFrame";
  const CANONICAL_CANVAS_ID = "hearthVisibleCanvas";

  const ROUTE_PACKET_TYPE =
    "HEARTH_ROUTE_CONDUCTOR_TO_CANVAS_PRESENTATION_PLATTER_PACKET_v10_4";
  const CANVAS_ACCEPTANCE_PACKET =
    "HEARTH_CANVAS_PRESENTATION_PLATTER_ACCEPTANCE_SCAN_PACKET_v12_5";
  const CANVAS_HEX_GATE_PACKET =
    "HEARTH_CANVAS_CANONICAL_HEX_GATE_MAP_TUPLE_PACKET_v12_5";
  const CANVAS_RENDERABLE_RETURN_PACKET =
    "HEARTH_CANVAS_RENDERABLE_SURFACE_RETURN_ADMISSION_PACKET_v12_5";
  const CONTROL_PACKET_TYPE =
    "HEARTH_CONTROLS_HEX_GATE_VIEW_DELTA_PACKET_v5";

  const FALLBACK_DELAY_MS = 180;
  const MIN_SURFACE_SIZE = 260;
  const MAX_SURFACE_SIZE = 680;
  const FAST_RENDER_RESOLUTION = 88;
  const STANDARD_RENDER_RESOLUTION = 128;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvas: false,
    f13ClaimedByRouteConductor: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByRouteConductor: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvas: false,
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

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_ELIGIBLE_FOR_CANVAS: false,
    F13_CLAIMED_BY_CANVAS: false,
    F13_CLAIMED_BY_ROUTE_CONDUCTOR: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_CANVAS: false,
    F21_CLAIMED_BY_ROUTE_CONDUCTOR: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_CANVAS: false,
    CONTROL_READY_CLAIMED: false,
    MOTION_READY_CLAIMED: false,
    TOUCH_READY_CLAIMED: false,
    DRAG_READY_CLAIMED: false,
    DOWNSTREAM_RELEASE_CLAIMED: false,
    COMPLETION_LATCHED: false,
    FINAL_COMPLETION_LATCHED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const ACCEPTED_ROUTE_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurface",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurface"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const SURFACE_EXPRESSION_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
    "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH.canvasFingerSurfacePointerBishopHexExpressionSocket",
    "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
    "HEARTH.canvasFingerSurfaceHexExpressionSocket",
    "HEARTH.hexSurfaceExpressionAuthority",
    "HEARTH.surfaceExpressionAuthority",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishopHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasSurfacePointerBishopHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasFingerSurfaceHexExpressionSocket",
    "DEXTER_LAB.hearthHexSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasPointerFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "CANVAS_V12_5_LOADED",

    canvasPresentationPlatterAuthority: true,
    liveSurfaceIdentityActive: true,
    unifiedVisible2dOutputActive: true,
    zeroRectCanonicalSurfaceBindingRepairActive: true,
    canonicalSurfaceRectLockActive: true,
    concreteSurfaceFrameActive: true,
    downstreamSurfaceAdmissionActive: true,
    fallbackSuppressionActive: true,
    fallbackDemotedToPlaceholder: true,
    canonicalCanvasSelectionActive: true,
    temporaryCanvasDisambiguationActive: true,
    domSurfaceCreationAuthority: true,
    canvasAcceptanceScanAuthority: true,
    bilateralRouteCanvasAcceptanceActive: true,
    routeConductorPacketReceiverActive: true,
    controlsViewPacketReceiverActive: true,

    canonicalHexGateMapTupleBridgeActive: true,
    canvasHexGatePacketBridgeActive: true,
    renderableSurfaceReturnAdmissionActive: true,
    metadataOnlyLatchRejectionActive: true,
    canvasLocalMathTerminationSuppressed: true,
    downstreamRenderableExpressionDrawingActive: true,
    mapTupleSequencePreserved: true,

    canvasOwnsDomSurface: true,
    canvasOwnsCanvasDrawing: true,
    canvasOwnsPresentationSurface: true,
    canvasDoesNotOwnSourceTruth: true,
    canvasDoesNotOwnRouteAuthority: true,
    canvasDoesNotOwnControlsAuthority: true,
    canvasDoesNotOwnHexTruth: true,
    canvasDoesNotOwnPointerFingerTruth: true,

    routeConductorObserved: false,
    routeConductorContract: "UNKNOWN",
    routeConductorReceipt: "UNKNOWN",
    routeConductorContractRecognized: false,

    controlObserved: false,
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "UNKNOWN",
    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    surfaceExpressionObserved: false,
    surfaceExpressionSource: "NONE",
    surfaceExpressionContract: "UNKNOWN",
    pointerFingerObserved: false,
    pointerFingerContract: "UNKNOWN",

    mountFound: false,
    mountCreated: false,
    mountSelector: "UNKNOWN",
    mountRectNonzero: false,
    mountComputedVisible: false,

    frameFound: false,
    frameCreated: false,
    frameSelector: "UNKNOWN",
    frameRectNonzero: false,
    frameComputedVisible: false,
    frameConcreteSize: "NONE",

    canvasElementFound: false,
    canvasCreated: false,
    canvasMovedIntoMount: false,
    canvasInMount: false,
    canvasInFrame: false,
    canvasSelector: "UNKNOWN",
    canvasSelectionMode: "CANONICAL_MOUNT_RECT_LOCK_VISIBLE_2D_SURFACE",
    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalMountId: CANONICAL_MOUNT_ID,
    canonicalFrameId: CANONICAL_FRAME_ID,
    nonCanonicalCanvasCount: 0,
    temporaryCanvasIgnoredCount: 0,

    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasContext2dReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVisible: false,
    canvasSurfaceReady: false,
    visibleSurfacePermissionGranted: false,

    zeroRectRepairAttempted: false,
    zeroRectRepairApplied: false,
    zeroRectRepairReason: "NOT_RUN",
    rectLockAttempted: false,
    rectLockApplied: false,
    rectLockReason: "NOT_RUN",
    concreteFallbackSizeApplied: false,
    concreteFallbackCssSize: "NONE",

    mapTupleId: "NONE",
    mapTupleVersion: "v12_5",
    mapTupleSequence: 0,
    mapTupleLastComposedAt: "",
    mapTupleLastReason: "NONE",
    mapTupleLastWidth: 0,
    mapTupleLastHeight: 0,
    mapTupleLastResolution: 0,
    mapTupleLastYaw: 0,
    mapTupleLastPitch: 0,
    mapTupleLastZoom: 1,
    mapTupleLastPhase: 0,

    hexGatePacketComposed: false,
    hexGatePacketSent: false,
    hexGatePacketAccepted: false,
    hexGatePacketRejected: false,
    hexGateTransmissionCount: 0,
    hexGateAcceptedCount: 0,
    hexGateRejectedCount: 0,
    hexGateLastSentAt: "",
    hexGateLastAcceptedAt: "",
    hexGateLastStatus: "WAITING_CANVAS_HEX_GATE_PACKET",
    hexGateLastReason: "WAITING_CANVAS_HEX_GATE_PACKET",
    hexGateLastReceiver: "NONE",
    hexGateLastReceiptContract: "UNKNOWN",

    renderableSurfaceRequestCount: 0,
    renderableSurfaceServedCount: 0,
    renderableSurfaceRejectedCount: 0,
    renderableSurfaceRenderCount: 0,
    renderableSurfaceRenderInProgress: false,
    renderableSurfaceLastRenderAt: "",
    renderableSurfaceLastResolution: 0,
    renderableSurfaceLastSampleCount: 0,
    renderableSurfaceLastDrawablePixels: 0,
    renderableSurfaceLastLandPixels: 0,
    renderableSurfaceLastWaterPixels: 0,
    renderableSurfaceLastStatus: "WAITING_HEX_GATE_AND_SURFACE_EXPRESSION",
    renderableSurfaceLastReason: "WAITING_HEX_GATE_AND_SURFACE_EXPRESSION",

    downstreamSurfaceObserved: false,
    downstreamSurfaceLatched: false,
    downstreamSurfaceObservedAt: "",
    downstreamSurfaceLastObservedAt: "",
    downstreamSurfaceSource: "NONE",
    downstreamSurfacePacketType: "NONE",
    downstreamSurfaceContract: "UNKNOWN",
    downstreamSurfaceDrawableApplied: false,
    downstreamSurfaceDrawableType: "NONE",
    downstreamSurfaceAdmissionCount: 0,
    downstreamSurfacePixelVisibleAfterAdmission: false,
    downstreamSurfaceMetadataOnlyRejectedCount: 0,
    downstreamSurfaceLastMetadataOnlyRejectedReason: "NONE",

    localFallbackAllowed: true,
    localFallbackSuppressed: false,
    localFallbackSuppressionReason: "NO_RENDERABLE_DOWNSTREAM_SURFACE_OBSERVED",
    localFallbackDrawAttemptCount: 0,
    localFallbackDrawSuppressedCount: 0,
    localFallbackDrawCount: 0,
    localFallbackLastDrawAt: "",
    localFallbackLastSuppressedAt: "",
    localFallbackMode: "PLACEHOLDER_ONLY_BEFORE_HEX_GATE_RENDERABLE_SURFACE_RETURN",

    canvasAcceptanceScanRequested: false,
    canvasAcceptanceScanConfirmed: false,
    bilateralRouteCanvasScanConfirmed: false,
    routePresentationPacketAccepted: false,
    routePresentationPacketAcceptedAt: "",
    routePresentationPacketSourceContract: "UNKNOWN",
    routePresentationPacketType: "NONE",

    controlPacketAccepted: false,
    controlPacketAcceptedAt: "",
    controlPacketCount: 0,

    viewYaw: 0,
    viewPitch: 0,
    viewZoom: 1,
    viewPhase: 0,

    renderCount: 0,
    packetCount: 0,
    acceptanceCount: 0,
    rejectionCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    resizeCount: 0,
    surfaceEnsureCount: 0,
    surfaceScanCount: 0,

    firstFailedCoordinate: "CANVAS_BOOT_NOT_RUN",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_PRESENTATION_PLATTER",
    postgameStatus: "CANVAS_LOADED_WAITING_BOOT",

    lastRoutePacket: null,
    lastControlPacket: null,
    lastHexGatePacket: null,
    lastHexGateReceipt: null,
    lastMapTuple: null,
    lastDownstreamPacket: null,
    lastAcceptancePacket: null,
    lastReceipt: null,

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let mountElement = null;
  let frameElement = null;
  let canvasElement = null;
  let context2d = null;
  let resizeRaf = 0;
  let fallbackTimer = 0;
  let renderSerial = 0;

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
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;

    const text = safeString(value).toLowerCase();
    if (text === "true" || text === "yes") return true;
    if (text === "false" || text === "no") return false;

    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
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
      if (!part) continue;
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
      if (!part) continue;
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
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

  function readField(source, keys, fallback = "") {
    const object = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys || []) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
        return object[key];
      }

      const lower = safeString(key).toLowerCase();

      try {
        for (const candidate of Object.keys(object)) {
          if (candidate.toLowerCase() === lower) {
            const value = object[candidate];
            if (value !== undefined && value !== null && value !== "") return value;
          }
        }
      } catch (_error) {}
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

  function contractOf(source) {
    return firstNonEmpty(
      readField(source, [
        "internalRenewalContract",
        "renewalContract",
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "pointerFingerContract",
        "surfaceContract",
        "routeConductorContract",
        "sourceContract",
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
        "internalRenewalReceipt",
        "renewalReceipt",
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "pointerFingerReceipt",
        "surfaceReceipt",
        "routeConductorReceipt",
        "sourceReceipt",
        "receipt",
        "RECEIPT"
      ], ""),
      source && source.receipt,
      source && source.RECEIPT
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getDebugReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlsReceipt",
      "getControlHandshakeReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasSurfaceReceipt",
      "getCanvasSurfaceSummary",
      "getPresentationReceipt",
      "getPresentationPlatterReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getHexReceipt",
      "getHexAuthorityReceipt",
      "getPointerFingerReceipt",
      "getPointerFingerSummary",
      "getSurfacePacket",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
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

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 200);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 140);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;

    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector, base = doc) {
    if (!base || !isFunction(base.querySelectorAll)) return [];

    try {
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function describeElement(element) {
    if (!element || !element.tagName) return "NONE";
    const tag = safeString(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    return `${tag}${id}`;
  }

  function setImportant(element, property, value) {
    if (!element || !element.style) return false;

    try {
      if (isFunction(element.style.setProperty)) {
        element.style.setProperty(property, value, "important");
      } else {
        element.style[property] = value;
      }

      return true;
    } catch (_error) {
      return false;
    }
  }

  function routeContractRecognized(contract) {
    const text = safeString(contract);
    return Boolean(
      text &&
      (
        ACCEPTED_ROUTE_CONTRACTS.includes(text) ||
        text.includes("HEARTH_ROUTE_CONDUCTOR")
      )
    );
  }

  function observeNeighborAuthorities() {
    const route = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
      "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH.routeConductor",
      "HEARTH.routeConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "DEXTER_LAB.hearthRouteConductor"
    ]);

    const routeReceipt = readAuthorityReceipt(route.value) || {};
    state.routeConductorObserved = Boolean(route.value);
    state.routeConductorContract = firstNonEmpty(contractOf(routeReceipt), route.value && route.value.contract, "UNKNOWN");
    state.routeConductorReceipt = firstNonEmpty(receiptOf(routeReceipt), route.value && route.value.receipt, "UNKNOWN");
    state.routeConductorContractRecognized = routeContractRecognized(state.routeConductorContract);

    const controls = firstGlobal([
      "HEARTH_CONTROLS",
      "HEARTH_CONTROLS_QUEEN",
      "HEARTH_QUEEN_CONTROLS",
      "HEARTH.controls",
      "HEARTH.controlsQueen",
      "DEXTER_LAB.hearthControls"
    ]);

    const controlsReceipt = readAuthorityReceipt(controls.value) || {};
    state.controlObserved = Boolean(controls.value);
    state.controlContract = firstNonEmpty(contractOf(controlsReceipt), controls.value && controls.value.contract, "UNKNOWN");
    state.controlReceipt = firstNonEmpty(receiptOf(controlsReceipt), controls.value && controls.value.receipt, "UNKNOWN");

    const hexAuthority = firstGlobal(HEX_AUTHORITY_ALIASES);
    const hexAuthorityReceipt = readAuthorityReceipt(hexAuthority.value) || {};
    state.hexAuthorityObserved = Boolean(hexAuthority.value);
    state.hexAuthoritySource = hexAuthority.path;
    state.hexAuthorityContract = firstNonEmpty(contractOf(hexAuthorityReceipt), hexAuthority.value && hexAuthority.value.contract, "UNKNOWN");

    const hexSurface = firstGlobal(HEX_SURFACE_ALIASES);
    const hexSurfaceReceipt = readAuthorityReceipt(hexSurface.value) || {};
    state.hexSurfaceObserved = Boolean(hexSurface.value);
    state.hexSurfaceSource = hexSurface.path;
    state.hexSurfaceContract = firstNonEmpty(contractOf(hexSurfaceReceipt), hexSurface.value && hexSurface.value.contract, "UNKNOWN");

    const surfaceExpression = firstGlobal(SURFACE_EXPRESSION_ALIASES);
    const surfaceExpressionReceipt = readAuthorityReceipt(surfaceExpression.value) || {};
    state.surfaceExpressionObserved = Boolean(surfaceExpression.value);
    state.surfaceExpressionSource = surfaceExpression.path;
    state.surfaceExpressionContract = firstNonEmpty(
      contractOf(surfaceExpressionReceipt),
      surfaceExpression.value && surfaceExpression.value.contract,
      "UNKNOWN"
    );

    const pointerFinger = firstGlobal([
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH_POINTER_FINGER",
      "HEARTH.pointerFingerReceiver",
      "HEARTH.canvasFingerInspect",
      "HEARTH.pointerFinger",
      "DEXTER_LAB.hearthCanvasFingerInspect"
    ]);

    const pointerFingerReceipt = readAuthorityReceipt(pointerFinger.value) || {};
    state.pointerFingerObserved = Boolean(pointerFinger.value);
    state.pointerFingerContract = firstNonEmpty(contractOf(pointerFingerReceipt), pointerFinger.value && pointerFinger.value.contract, "UNKNOWN");
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();

      return {
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0),
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0)
      };
    } catch (_error) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  function computedVisible(element) {
    if (!element) return false;

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(element) : null;
      if (!style) return true;

      return Boolean(
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.visibility !== "collapse" &&
        safeNumber(style.opacity, 1) > 0
      );
    } catch (_error) {
      return true;
    }
  }

  function viewportIntersecting(rect) {
    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);

    if (!rect || rect.width <= 0 || rect.height <= 0 || viewportWidth <= 0 || viewportHeight <= 0) {
      return false;
    }

    return !(
      rect.right <= 0 ||
      rect.bottom <= 0 ||
      rect.left >= viewportWidth ||
      rect.top >= viewportHeight
    );
  }

  function chooseSurfaceSize() {
    const viewportWidth = Math.max(320, safeNumber(root.innerWidth, 720));
    const viewportHeight = Math.max(320, safeNumber(root.innerHeight, 720));

    const parent =
      (mountElement && mountElement.parentElement) ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage='true']") ||
      q("#hearthPlanetStage") ||
      q("[data-hearth-planet-stage='true']") ||
      q("main") ||
      (doc && doc.body) ||
      null;

    const parentRect = getRect(parent);
    const parentWidth = parentRect.width > 0 ? parentRect.width : viewportWidth;

    return Math.floor(
      clamp(
        Math.min(viewportWidth * 0.84, viewportHeight * 0.58, parentWidth * 0.92, MAX_SURFACE_SIZE),
        MIN_SURFACE_SIZE,
        MAX_SURFACE_SIZE
      )
    );
  }

  function isCanvasElement(value) {
    return Boolean(value && value.tagName && safeString(value.tagName).toLowerCase() === "canvas");
  }

  function isDrawable(value) {
    if (!value) return false;

    const tag = safeString(value.tagName).toLowerCase();
    const ctor = value.constructor && value.constructor.name ? safeString(value.constructor.name) : "";

    return Boolean(
      tag === "canvas" ||
      tag === "img" ||
      tag === "video" ||
      ctor === "ImageBitmap" ||
      ctor === "OffscreenCanvas" ||
      ctor === "HTMLCanvasElement" ||
      ctor === "HTMLImageElement" ||
      ctor === "HTMLVideoElement"
    );
  }

  function findMount() {
    if (!doc) return null;

    return (
      q(`#${CANONICAL_MOUNT_ID}`) ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-visible-planet-mount='true']")
    );
  }

  function createMount() {
    if (!doc || !isFunction(doc.createElement)) return null;

    const target =
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage='true']") ||
      q("#hearthPlanetStage") ||
      q("[data-hearth-planet-stage='true']") ||
      q("main") ||
      doc.body ||
      doc.documentElement;

    if (!target) return null;

    const mount = doc.createElement("section");
    mount.id = CANONICAL_MOUNT_ID;
    mount.setAttribute("data-hearth-canvas-mount", "true");
    mount.setAttribute("data-hearth-visible-planet-mount", "true");
    mount.setAttribute("aria-label", "Hearth visible canvas mount");

    target.appendChild(mount);
    state.mountCreated = true;

    return mount;
  }

  function normalizePlacementChain(mount, size) {
    if (!mount) return false;

    const candidates = [
      q("#hearthGlobeStage"),
      q("[data-hearth-globe-stage='true']"),
      q("#hearthPlanetStage"),
      q("[data-hearth-planet-stage='true']"),
      mount.parentElement
    ].filter(Boolean);

    for (const element of candidates) {
      try {
        setImportant(element, "display", "block");
        setImportant(element, "position", "relative");
        setImportant(element, "visibility", "visible");
        setImportant(element, "opacity", "1");
        setImportant(element, "overflow", "visible");
        setImportant(element, "contain", "none");
        setImportant(element, "content-visibility", "visible");
        setImportant(element, "min-width", "0");
        setImportant(element, "min-height", `${Math.max(size, 300)}px`);
      } catch (_error) {}
    }

    return true;
  }

  function normalizeMountLayout(mount, size = chooseSurfaceSize()) {
    if (!mount) return false;

    try {
      if (!mount.id) mount.id = CANONICAL_MOUNT_ID;

      mount.setAttribute("data-hearth-canvas-mount", "true");
      mount.setAttribute("data-hearth-visible-planet-mount", "true");
      mount.setAttribute("data-hearth-canonical-canvas-mount", "true");
      mount.setAttribute("data-hearth-html-owned-mount", "true");
      mount.setAttribute("data-hearth-canvas-zero-rect-repair-mount", "true");
      mount.setAttribute("data-hearth-canvas-rect-lock-mount", "true");
      mount.setAttribute("data-hearth-downstream-surface-admission-target", "true");
      mount.setAttribute("data-hearth-hex-gate-map-tuple-bridge-target", "true");

      setImportant(mount, "position", "relative");
      setImportant(mount, "z-index", "4");
      setImportant(mount, "display", "flex");
      setImportant(mount, "align-items", "center");
      setImportant(mount, "justify-content", "center");
      setImportant(mount, "width", "100%");
      setImportant(mount, "max-width", "100%");
      setImportant(mount, "min-width", "0");
      setImportant(mount, "height", `${size}px`);
      setImportant(mount, "min-height", `${size}px`);
      setImportant(mount, "overflow", "visible");
      setImportant(mount, "visibility", "visible");
      setImportant(mount, "opacity", "1");
      setImportant(mount, "pointer-events", "auto");
      setImportant(mount, "touch-action", "none");
      setImportant(mount, "contain", "none");
      setImportant(mount, "content-visibility", "visible");
      setImportant(mount, "isolation", "isolate");

      normalizePlacementChain(mount, size);
    } catch (error) {
      recordError("CANVAS_MOUNT_LAYOUT_NORMALIZE_ERROR", error);
      return false;
    }

    return true;
  }

  function ensureMount() {
    if (mountElement && doc && isFunction(doc.contains) && doc.contains(mountElement)) {
      normalizeMountLayout(mountElement);
      return mountElement;
    }

    mountElement = findMount();

    if (!mountElement) {
      mountElement = createMount();
    }

    state.mountFound = Boolean(mountElement);
    state.mountSelector = mountElement
      ? (mountElement.id ? `#${mountElement.id}` : describeElement(mountElement))
      : "UNKNOWN";

    normalizeMountLayout(mountElement);
    return mountElement;
  }

  function findFrame(mount) {
    if (!mount) return null;

    const byId = q(`#${CANONICAL_FRAME_ID}`, mount);
    if (byId) return byId;

    return (
      q("[data-hearth-canvas-rect-lock-frame='true']", mount) ||
      q("[data-hearth-canvas-frame='true']", mount)
    );
  }

  function createFrame(mount) {
    if (!doc || !mount || !isFunction(doc.createElement)) return null;

    const frame = doc.createElement("div");
    frame.id = CANONICAL_FRAME_ID;
    frame.setAttribute("data-hearth-canvas-frame", "true");
    frame.setAttribute("data-hearth-canvas-rect-lock-frame", "true");
    frame.setAttribute("aria-hidden", "true");

    mount.appendChild(frame);
    state.frameCreated = true;

    return frame;
  }

  function normalizeFrameLayout(frame, size = chooseSurfaceSize()) {
    if (!frame) return false;

    try {
      if (!frame.id) frame.id = CANONICAL_FRAME_ID;

      frame.setAttribute("data-hearth-canvas-frame", "true");
      frame.setAttribute("data-hearth-canvas-rect-lock-frame", "true");
      frame.setAttribute("data-hearth-canvas-contract", CONTRACT);
      frame.setAttribute("data-hearth-canvas-renewal-contract", RENEWAL_CONTRACT);
      frame.setAttribute("data-hearth-canvas-internal-renewal-contract", INTERNAL_RENEWAL_CONTRACT);
      frame.setAttribute("data-hearth-canvas-map-tuple-bridge", "true");

      setImportant(frame, "position", "relative");
      setImportant(frame, "z-index", "5");
      setImportant(frame, "display", "block");
      setImportant(frame, "flex", `0 0 ${size}px`);
      setImportant(frame, "width", `${size}px`);
      setImportant(frame, "height", `${size}px`);
      setImportant(frame, "min-width", `${size}px`);
      setImportant(frame, "min-height", `${size}px`);
      setImportant(frame, "max-width", `${size}px`);
      setImportant(frame, "max-height", `${size}px`);
      setImportant(frame, "aspect-ratio", "1 / 1");
      setImportant(frame, "box-sizing", "border-box");
      setImportant(frame, "overflow", "visible");
      setImportant(frame, "visibility", "visible");
      setImportant(frame, "opacity", "1");
      setImportant(frame, "pointer-events", "auto");
      setImportant(frame, "touch-action", "none");
      setImportant(frame, "contain", "none");
      setImportant(frame, "content-visibility", "visible");
      setImportant(frame, "transform", "none");
      setImportant(frame, "translate", "none");
      setImportant(frame, "margin", "0 auto");
      setImportant(frame, "border-radius", "50%");

      state.frameConcreteSize = `${size}px`;
    } catch (error) {
      recordError("CANVAS_FRAME_LAYOUT_NORMALIZE_ERROR", error);
      return false;
    }

    return true;
  }

  function ensureFrame(mount) {
    if (!mount) return null;

    if (frameElement && isFunction(mount.contains) && mount.contains(frameElement)) {
      normalizeFrameLayout(frameElement);
      return frameElement;
    }

    frameElement = findFrame(mount);

    if (!frameElement) {
      frameElement = createFrame(mount);
    }

    if (frameElement && frameElement.parentNode !== mount) {
      try {
        mount.appendChild(frameElement);
      } catch (error) {
        recordError("CANVAS_FRAME_MOVE_FAILED", error);
      }
    }

    normalizeFrameLayout(frameElement);
    return frameElement;
  }

  function findCanonicalCanvas(mount, frame) {
    if (!doc) return null;

    const byId = q(`#${CANONICAL_CANVAS_ID}`);
    if (isCanvasElement(byId)) return byId;

    if (frame) {
      const local =
        q("canvas[data-hearth-visible-canvas='true']", frame) ||
        q("canvas[data-hearth-expression-surface='true']", frame) ||
        q("canvas[data-hearth-canvas-hub='true']", frame) ||
        q("canvas[data-hearth-canvas='true']", frame) ||
        q("canvas", frame);

      if (local && isCanvasElement(local)) return local;
    }

    if (mount) {
      const local =
        q("canvas[data-hearth-visible-canvas='true']", mount) ||
        q("canvas[data-hearth-expression-surface='true']", mount) ||
        q("canvas[data-hearth-canvas-hub='true']", mount) ||
        q("canvas[data-hearth-canvas='true']", mount) ||
        q("canvas", mount);

      if (local && isCanvasElement(local)) return local;
    }

    return null;
  }

  function createCanvas(frame) {
    if (!doc || !frame || !isFunction(doc.createElement)) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = CANONICAL_CANVAS_ID;
    canvas.width = 1024;
    canvas.height = 1024;
    canvas.setAttribute("aria-label", "Hearth visible 2D planet surface");
    canvas.setAttribute("role", "img");

    frame.appendChild(canvas);
    state.canvasCreated = true;

    return canvas;
  }

  function moveCanvasIntoFrameIfNeeded(canvas, frame) {
    if (!canvas || !frame) return false;

    try {
      if (canvas.parentNode !== frame) {
        frame.appendChild(canvas);
        state.canvasMovedIntoMount = true;
        return true;
      }
    } catch (error) {
      recordError("CANVAS_MOVE_INTO_FRAME_FAILED", error);
    }

    return false;
  }

  function markCanvas(canvas) {
    if (!canvas) return;

    try {
      canvas.id = CANONICAL_CANVAS_ID;
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-canonical-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-rect-lock", "true");
      canvas.setAttribute("data-hearth-canvas-selection-mode", state.canvasSelectionMode);
      canvas.setAttribute("data-hearth-canvas-contract", CONTRACT);
      canvas.setAttribute("data-hearth-canvas-receipt", RECEIPT);
      canvas.setAttribute("data-hearth-canvas-renewal-contract", RENEWAL_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-renewal-receipt", RENEWAL_RECEIPT);
      canvas.setAttribute("data-hearth-canvas-internal-renewal-contract", INTERNAL_RENEWAL_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-internal-renewal-receipt", INTERNAL_RENEWAL_RECEIPT);
      canvas.setAttribute("data-hearth-canvas-map-tuple-bridge", "true");
      canvas.setAttribute("data-hearth-canvas-hex-gate-packet-sent", String(state.hexGatePacketSent));
      canvas.setAttribute("data-hearth-canvas-hex-gate-packet-accepted", String(state.hexGatePacketAccepted));
      canvas.setAttribute("data-hearth-local-fallback-mode", state.localFallbackMode);
      canvas.setAttribute("data-hearth-local-fallback-suppressed", String(state.localFallbackSuppressed));
      canvas.setAttribute("data-hearth-downstream-surface-observed", String(state.downstreamSurfaceObserved));
      canvas.setAttribute("data-hearth-downstream-surface-latched", String(state.downstreamSurfaceLatched));
      canvas.setAttribute("data-hearth-renderable-surface-return-drawn", String(state.renderableSurfaceRenderCount > 0));
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
    } catch (error) {
      recordError("CANVAS_MARK_FAILED", error);
    }
  }

  function applyRectLock(canvas, frame, size, reason) {
    if (!canvas || !frame) return false;

    state.rectLockAttempted = true;
    state.zeroRectRepairAttempted = true;

    normalizeFrameLayout(frame, size);

    try {
      const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
      const pixelSize = Math.max(1, Math.floor(size * dpr));

      if (canvas.width !== pixelSize) canvas.width = pixelSize;
      if (canvas.height !== pixelSize) canvas.height = pixelSize;

      setImportant(canvas, "position", "absolute");
      setImportant(canvas, "inset", "0");
      setImportant(canvas, "z-index", "6");
      setImportant(canvas, "display", "block");
      setImportant(canvas, "visibility", "visible");
      setImportant(canvas, "opacity", "1");
      setImportant(canvas, "box-sizing", "border-box");
      setImportant(canvas, "width", `${size}px`);
      setImportant(canvas, "height", `${size}px`);
      setImportant(canvas, "min-width", `${size}px`);
      setImportant(canvas, "min-height", `${size}px`);
      setImportant(canvas, "max-width", `${size}px`);
      setImportant(canvas, "max-height", `${size}px`);
      setImportant(canvas, "aspect-ratio", "1 / 1");
      setImportant(canvas, "object-fit", "contain");
      setImportant(canvas, "margin", "0");
      setImportant(canvas, "padding", "0");
      setImportant(canvas, "border", "0");
      setImportant(canvas, "border-radius", "50%");
      setImportant(canvas, "transform", "none");
      setImportant(canvas, "translate", "none");
      setImportant(canvas, "pointer-events", "auto");
      setImportant(canvas, "touch-action", "none");
      setImportant(canvas, "user-select", "none");
      setImportant(canvas, "-webkit-user-select", "none");
      setImportant(canvas, "contain", "none");
      setImportant(canvas, "content-visibility", "visible");

      state.rectLockApplied = true;
      state.zeroRectRepairApplied = true;
      state.rectLockReason = reason || "CANONICAL_SURFACE_RECT_LOCK_APPLIED";
      state.zeroRectRepairReason = state.rectLockReason;
      state.concreteFallbackSizeApplied = true;
      state.concreteFallbackCssSize = `${size}px`;

      return true;
    } catch (error) {
      recordError("CANVAS_RECT_LOCK_FAILED", error, { reason, size });
      return false;
    }
  }

  function countNonCanonicalCanvases(canonical) {
    const canvases = qa("canvas");

    state.nonCanonicalCanvasCount = canvases.filter((canvas) => canvas !== canonical).length;
    state.temporaryCanvasIgnoredCount = canvases.filter((canvas) => {
      if (canvas === canonical) return false;

      if (canvas.dataset && (
        canvas.dataset.hearthTemporaryCanvas === "true" ||
        canvas.dataset.hearthGeneratedImage === "true" ||
        canvas.dataset.generatedImage === "true" ||
        canvas.dataset.graphicBox === "true"
      )) {
        return true;
      }

      if (!canvas.id && (!canvas.parentNode || canvas.parentNode !== frameElement)) return true;
      return false;
    }).length;
  }

  function getCanvas2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) return null;

    try {
      return canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_error) {
      try {
        return canvas.getContext("2d");
      } catch (__error) {
        return null;
      }
    }
  }

  function syncCanvasBufferToRect(canvas, ctx, rect) {
    if (!canvas || !ctx) return false;

    const rectWidth = Math.max(1, Math.floor(rect && rect.width ? rect.width : chooseSurfaceSize()));
    const rectHeight = Math.max(1, Math.floor(rect && rect.height ? rect.height : rectWidth));
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const pixelWidth = Math.max(1, Math.floor(rectWidth * dpr));
    const pixelHeight = Math.max(1, Math.floor(rectHeight * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      state.resizeCount += 1;
    }

    try {
      if (isFunction(ctx.setTransform)) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    } catch (_error) {}

    return true;
  }

  function sampleCanvasPixel(canvas, ctx) {
    if (!canvas || !ctx || canvas.width <= 0 || canvas.height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        alphaPixelCount: 0,
        visiblePixelCount: 0,
        sampleCount: 0
      };
    }

    const points = [
      [0.5, 0.5],
      [0.34, 0.5],
      [0.66, 0.5],
      [0.5, 0.34],
      [0.5, 0.66],
      [0.25, 0.25],
      [0.75, 0.75],
      [0.25, 0.75],
      [0.75, 0.25]
    ];

    let alpha = 0;
    let visible = 0;
    let sampled = 0;

    try {
      for (const point of points) {
        const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(canvas.width * point[0])));
        const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(canvas.height * point[1])));
        const data = ctx.getImageData(x, y, 1, 1).data;

        sampled += 1;

        const red = data[0] || 0;
        const green = data[1] || 0;
        const blue = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alpha += 1;
        if (a > 0 && (red > 4 || green > 4 || blue > 4)) visible += 1;
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        reason: safeString(error && error.message, "PIXEL_SAMPLE_ERROR"),
        alphaPixelCount: alpha,
        visiblePixelCount: visible,
        sampleCount: sampled
      };
    }

    if (visible > 0) {
      return {
        status: "PIXEL_SAMPLE_VISIBLE",
        visible: true,
        alphaPixelCount: alpha,
        visiblePixelCount: visible,
        sampleCount: sampled
      };
    }

    if (alpha > 0) {
      return {
        status: "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK",
        visible: false,
        alphaPixelCount: alpha,
        visiblePixelCount: visible,
        sampleCount: sampled
      };
    }

    return {
      status: "PIXEL_SAMPLE_BLANK",
      visible: false,
      alphaPixelCount: alpha,
      visiblePixelCount: visible,
      sampleCount: sampled
    };
  }

  function ensureCanvasSurface(reason = "manual") {
    state.surfaceEnsureCount += 1;

    const size = chooseSurfaceSize();
    const mount = ensureMount();

    if (!mount) {
      state.canvasElementFound = false;
      state.canvasSurfaceReady = false;
      state.visibleSurfacePermissionGranted = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HTML_CONTAINS_CANONICAL_CANVAS_MOUNT_OR_ALLOW_CANVAS_TO_CREATE_MOUNT";
      state.postgameStatus = "CANVAS_SURFACE_HELD_MOUNT_PENDING";
      updateDataset();
      return false;
    }

    normalizeMountLayout(mount, size);

    const frame = ensureFrame(mount);

    if (!frame) {
      state.frameFound = false;
      state.canvasElementFound = false;
      state.canvasSurfaceReady = false;
      state.visibleSurfacePermissionGranted = false;
      state.firstFailedCoordinate = "CANVAS_RECT_LOCK_FRAME_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CREATE_CANONICAL_CANVAS_RECT_LOCK_FRAME_INSIDE_HEARTH_CANVAS_MOUNT";
      state.postgameStatus = "CANVAS_SURFACE_HELD_FRAME_PENDING";
      updateDataset();
      return false;
    }

    normalizeFrameLayout(frame, size);

    let canvas = findCanonicalCanvas(mount, frame);

    if (!canvas) {
      canvas = createCanvas(frame);
    }

    if (!canvas) {
      state.canvasElementFound = false;
      state.canvasSurfaceReady = false;
      state.visibleSurfacePermissionGranted = false;
      state.firstFailedCoordinate = "CANVAS_ELEMENT_CREATE_OR_BIND_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_CANONICAL_CANVAS_DOM_SURFACE_CREATION";
      state.postgameStatus = "CANVAS_SURFACE_HELD_ELEMENT_PENDING";
      updateDataset();
      return false;
    }

    mountElement = mount;
    frameElement = frame;
    canvasElement = canvas;

    moveCanvasIntoFrameIfNeeded(canvasElement, frameElement);
    markCanvas(canvasElement);
    applyRectLock(canvasElement, frameElement, size, `ensure:${reason}`);

    context2d = getCanvas2d(canvasElement);
    syncCanvasBufferToRect(canvasElement, context2d, getRect(canvasElement));
    scanCanvasSurface({ repairIfZero: true });

    if (!state.canvasSurfaceReady) {
      state.firstFailedCoordinate = state.canvasRectNonzero
        ? "CANVAS_SURFACE_CREATED_BUT_NOT_READY"
        : "CANVAS_RECT_NONZERO";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = state.canvasRectNonzero
        ? "RECHECK_CANVAS_CONTEXT_AND_COMPUTED_VISIBILITY"
        : "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT_INSIDE_HEARTH_CANVAS_MOUNT";
      state.postgameStatus = "CANVAS_SURFACE_CREATED_PENDING_CONTEXT_RECT_OR_VISIBILITY";
    } else {
      state.firstFailedCoordinate = "NONE_CANVAS_DOM_SURFACE_READY";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "SEND_CANONICAL_MAP_TUPLE_TO_HEX_SURFACE";
      state.postgameStatus = state.downstreamSurfaceLatched
        ? "CANVAS_DOM_SURFACE_READY_RENDERABLE_SURFACE_LATCHED_FALLBACK_SUPPRESSED"
        : "CANVAS_DOM_SURFACE_READY_WAITING_CANONICAL_HEX_GATE_MAP_TUPLE";
    }

    record("CANONICAL_CANVAS_SURFACE_ENSURED", {
      reason,
      mountFound: state.mountFound,
      frameFound: state.frameFound,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasMovedIntoMount: state.canvasMovedIntoMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasSurfaceReady: state.canvasSurfaceReady,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed,
      rectLockApplied: state.rectLockApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize
    });

    updateDataset();
    return state.canvasSurfaceReady;
  }

  function scanCanvasSurface(options = {}) {
    state.surfaceScanCount += 1;

    const repairIfZero = options.repairIfZero !== false;
    const size = chooseSurfaceSize();

    const mount = mountElement || findMount();
    const frame = frameElement || (mount ? findFrame(mount) : null);
    const canvas = canvasElement || findCanonicalCanvas(mount, frame);

    mountElement = mount || mountElement;
    frameElement = frame || frameElement;
    canvasElement = canvas || canvasElement;

    if (mountElement) normalizeMountLayout(mountElement, size);
    if (frameElement) normalizeFrameLayout(frameElement, size);

    if (canvasElement) {
      markCanvas(canvasElement);

      if (frameElement && canvasElement.parentNode !== frameElement) {
        moveCanvasIntoFrameIfNeeded(canvasElement, frameElement);
      }

      applyRectLock(canvasElement, frameElement, size, repairIfZero ? "scan-rect-lock" : "scan-no-repair");
    }

    let mountRect = getRect(mountElement);
    let frameRect = getRect(frameElement);
    let canvasRect = getRect(canvasElement);

    if (repairIfZero && canvasElement && frameElement && (canvasRect.width <= 0 || canvasRect.height <= 0)) {
      applyRectLock(canvasElement, frameElement, size, "scan-zero-rect-repair");
      mountRect = getRect(mountElement);
      frameRect = getRect(frameElement);
      canvasRect = getRect(canvasElement);
    }

    context2d = context2d || getCanvas2d(canvasElement);
    syncCanvasBufferToRect(canvasElement, context2d, canvasRect);

    const pixel = sampleCanvasPixel(canvasElement, context2d);

    state.mountFound = Boolean(mountElement);
    state.mountSelector = mountElement ? (mountElement.id ? `#${mountElement.id}` : describeElement(mountElement)) : "UNKNOWN";
    state.mountRectNonzero = mountRect.width > 0 && mountRect.height > 0;
    state.mountComputedVisible = computedVisible(mountElement);

    state.frameFound = Boolean(frameElement);
    state.frameSelector = frameElement ? (frameElement.id ? `#${frameElement.id}` : describeElement(frameElement)) : "UNKNOWN";
    state.frameRectNonzero = frameRect.width > 0 && frameRect.height > 0;
    state.frameComputedVisible = computedVisible(frameElement);

    state.canvasElementFound = Boolean(canvasElement);
    state.canvasInMount = Boolean(mountElement && canvasElement && isFunction(mountElement.contains) && mountElement.contains(canvasElement));
    state.canvasInFrame = Boolean(frameElement && canvasElement && isFunction(frameElement.contains) && frameElement.contains(canvasElement));
    state.canvasSelector = canvasElement ? `#${CANONICAL_CANVAS_ID}` : "UNKNOWN";
    state.canvasRectNonzero = canvasRect.width > 0 && canvasRect.height > 0;
    state.canvasComputedVisible = computedVisible(canvasElement);
    state.canvasViewportIntersecting = viewportIntersecting(canvasRect);
    state.canvasContext2dReady = Boolean(context2d);
    state.canvasPixelVisible = Boolean(pixel.visible);
    state.canvasPixelSampleStatus = pixel.status;
    state.canvasSurfaceReady = Boolean(
      state.mountFound &&
      state.frameFound &&
      state.canvasElementFound &&
      state.canvasInMount &&
      state.canvasInFrame &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible &&
      state.canvasContext2dReady
    );
    state.visibleSurfacePermissionGranted = state.canvasSurfaceReady;

    if (state.downstreamSurfaceLatched && state.canvasPixelVisible) {
      state.downstreamSurfacePixelVisibleAfterAdmission = true;
    }

    countNonCanonicalCanvases(canvasElement);

    if (!state.canvasRectNonzero) {
      state.firstFailedCoordinate = "CANVAS_RECT_NONZERO";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT_INSIDE_HEARTH_CANVAS_MOUNT";
      state.postgameStatus = "CANVAS_RECT_LOCK_FAILED_CANONICAL_SURFACE_STILL_ZERO_RECT";
    }

    updateDataset();

    return {
      canvasMountFound: state.mountFound,
      canvasMountSelector: state.mountSelector,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasFrameFound: state.frameFound,
      canvasFrameSelector: state.frameSelector,
      canvasFrameRectNonzero: state.frameRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasInFrame: state.canvasInFrame,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSurfaceReady: state.canvasSurfaceReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      canvasSelector: state.canvasSelector,
      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      canonicalFrameId: CANONICAL_FRAME_ID,
      canvasSelectionMode: state.canvasSelectionMode,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      rectLockApplied: state.rectLockApplied,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize,
      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed
    };
  }

  function normalizeViewState(packet = {}) {
    const source = isObject(packet.viewState) ? packet.viewState : packet;

    const deltaYaw = safeNumber(packet.deltaYaw, 0);
    const deltaPitch = safeNumber(packet.deltaPitch, 0);
    const deltaZoom = safeNumber(packet.deltaZoom, 0);

    const yaw =
      source.yaw !== undefined
        ? safeNumber(source.yaw, state.viewYaw)
        : state.viewYaw + deltaYaw;

    const pitch =
      source.pitch !== undefined
        ? safeNumber(source.pitch, state.viewPitch)
        : state.viewPitch + deltaPitch;

    const zoom =
      source.zoom !== undefined
        ? safeNumber(source.zoom, state.viewZoom)
        : state.viewZoom + deltaZoom;

    return {
      yaw,
      pitch: clamp(pitch, -1.25, 1.25),
      zoom: clamp(zoom, 0.72, 1.65),
      phase: 0
    };
  }

  function composeMapTuple(reason = "manual", options = {}) {
    ensureCanvasSurface(`map-tuple:${reason}`);
    scanCanvasSurface({ repairIfZero: true });

    const rect = getRect(canvasElement);
    const resolution = clamp(
      Math.round(safeNumber(options.resolution, options.fast ? FAST_RENDER_RESOLUTION : STANDARD_RENDER_RESOLUTION)),
      48,
      192
    );

    state.mapTupleSequence += 1;

    const tuple = {
      tupleType: "HEARTH_CANVAS_CANONICAL_HEX_GATE_MAP_TUPLE_v12_5",
      tupleId: `HEARTH_CANVAS_MAP_TUPLE_${Date.now()}_${state.mapTupleSequence}`,
      tupleVersion: state.mapTupleVersion,
      sequence: state.mapTupleSequence,
      reason,
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      canvasFile: FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      surfaceExpressionFile: POINTER_FINGER_SURFACE_FILE,

      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      canonicalFrameId: CANONICAL_FRAME_ID,
      canvasSelectionMode: state.canvasSelectionMode,

      canvasRect: {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      },
      buffer: {
        width: canvasElement ? canvasElement.width : 0,
        height: canvasElement ? canvasElement.height : 0,
        dpr: clamp(root.devicePixelRatio || 1, 1, 2)
      },
      renderResolution: resolution,
      projectionSpace: "CANONICAL_CANVAS_DISC_TO_HEX_AUTHORITY_UV_LON_LAT",
      surfaceMapSpace: "SPHERE_VECTOR_TO_HEX_AUTHORITY_TO_SURFACE_EXPRESSION",
      handoffOrder: "CANVAS_TO_HEX_SURFACE_TO_POINTER_FINGER_SURFACE_RETURN_TO_CANVAS",
      yaw: state.viewYaw,
      pitch: state.viewPitch,
      zoom: state.viewZoom,
      phase: 0,
      viewState: {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      },
      canvasMustNotTerminateMathLocally: true,
      hexGateRequiredBeforeRenderableSurfaceAdmission: true,
      metadataOnlyLatchRejected: true,
      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    state.mapTupleId = tuple.tupleId;
    state.mapTupleLastComposedAt = tuple.composedAt;
    state.mapTupleLastReason = reason;
    state.mapTupleLastWidth = rect.width;
    state.mapTupleLastHeight = rect.height;
    state.mapTupleLastResolution = resolution;
    state.mapTupleLastYaw = state.viewYaw;
    state.mapTupleLastPitch = state.viewPitch;
    state.mapTupleLastZoom = state.viewZoom;
    state.mapTupleLastPhase = 0;
    state.lastMapTuple = clonePlain(tuple);

    updateDataset();

    return tuple;
  }

  function composeCanvasHexGatePacket(reason = "manual", options = {}) {
    const tuple = composeMapTuple(reason, options);

    const packet = {
      packetType: CANVAS_HEX_GATE_PACKET,
      type: CANVAS_HEX_GATE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: RENEWAL_CONTRACT,
      currentCanvasParentReceipt: RENEWAL_RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_PRESENTATION_PLATTER",
      sourceRole: "canvas-hex-gate-map-tuple-bridge",
      targetFile: HEX_SURFACE_FILE,
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",
      route: ROUTE,
      canvasFile: FILE,
      controlsFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,

      canvasHexGateAuthorized: true,
      hexSurfaceGateAuthorized: true,
      hexGateAdmissionAuthorized: true,
      pointerFingerTransmissionAuthorized: true,
      downstreamSurfaceReturnRequested: true,

      mapTuple: tuple,
      mapTupleId: tuple.tupleId,
      mapTupleVersion: tuple.tupleVersion,
      mapTupleSequence: tuple.sequence,
      viewState: clonePlain(tuple.viewState),
      yaw: tuple.yaw,
      pitch: tuple.pitch,
      zoom: tuple.zoom,
      phase: 0,

      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      canonicalFrameId: CANONICAL_FRAME_ID,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,

      expectedReturn:
        "RENDERABLE_SURFACE_EXPRESSION_OR_DRAWABLE_FRAME_ONLY_METADATA_DOES_NOT_LATCH",
      canvasMustNotTerminateMathLocally: true,
      localFallbackDemotedToPreBridgePlaceholder: true,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    state.hexGatePacketComposed = true;
    state.lastHexGatePacket = clonePlain(packet);
    updateDataset();

    return packet;
  }

  function resolveHexSurfaceReceiver(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "drawInteractiveFrame",
      "receivePlanetaryViewControlPacket",
      "receiveViewControlPacket"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function sendCanvasHexGatePacket(reason = "manual", options = {}) {
    observeNeighborAuthorities();

    const packet = composeCanvasHexGatePacket(reason, options);
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receiver = resolveHexSurfaceReceiver(found.value);

    state.hexGateTransmissionCount += 1;
    state.hexGatePacketSent = false;
    state.hexGatePacketAccepted = false;
    state.hexGatePacketRejected = false;
    state.hexGateLastReceiver = receiver || "NONE";
    state.hexGateLastSentAt = nowIso();

    if (!found.value || !receiver) {
      state.hexGateRejectedCount += 1;
      state.hexGatePacketRejected = true;
      state.hexGateLastStatus = "HEX_SURFACE_RECEIVER_NOT_AVAILABLE";
      state.hexGateLastReason = "NO_PUBLIC_HEX_SURFACE_RECEIVER_FOUND";
      state.firstFailedCoordinate = "HEX_SURFACE_RECEIVER_NOT_AVAILABLE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "LOAD_OR_RENEW_HEX_SURFACE_PUBLIC_CANVAS_GATE_RECEIVER";
      state.postgameStatus = "CANVAS_HEX_GATE_PACKET_COMPOSED_BUT_HEX_SURFACE_RECEIVER_MISSING";

      record("CANVAS_HEX_GATE_PACKET_NOT_SENT", {
        reason,
        receiver: state.hexGateLastReceiver,
        hexSurfaceObserved: state.hexSurfaceObserved,
        hexSurfaceSource: state.hexSurfaceSource
      });

      updateDataset();
      publishReceiptAliases();

      return {
        accepted: false,
        ok: false,
        reason: state.hexGateLastReason,
        packet,
        receipt: null,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }

    try {
      const receipt = found.value[receiver](clonePlain(packet), {
        receiver: "canvas-v12-5",
        reason,
        canvasMapTupleBridge: true,
        allowDirect: false
      });

      const accepted = Boolean(
        receipt &&
        (
          receipt.lastValidationStatus === "ACCEPTED" ||
          receipt.framePacket ||
          receipt.transmissionPacket ||
          receipt.pointerFingerTransmissionStatus === "POINTER_FINGER_TRANSMISSION_DELIVERED" ||
          receipt.postgameStatus === "HEX_SURFACE_GATE_ACCEPTED_AND_POINTER_FINGER_TRANSMISSION_DELIVERED" ||
          safeBool(receipt.accepted, false) ||
          safeBool(receipt.ok, false)
        )
      );

      state.hexGatePacketSent = true;
      state.hexGateLastReceiptContract = firstNonEmpty(contractOf(receipt), "UNKNOWN");
      state.lastHexGateReceipt = clonePlain(receipt);

      if (accepted) {
        state.hexGateAcceptedCount += 1;
        state.hexGatePacketAccepted = true;
        state.hexGatePacketRejected = false;
        state.hexGateLastAcceptedAt = nowIso();
        state.hexGateLastStatus = "HEX_GATE_PACKET_ACCEPTED";
        state.hexGateLastReason = "CANONICAL_MAP_TUPLE_ADMITTED_BY_HEX_SURFACE";
        state.firstFailedCoordinate = "NONE_CANVAS_HEX_GATE_PACKET_ACCEPTED";
        state.recommendedNextFile = POINTER_FINGER_SURFACE_FILE;
        state.recommendedNextAction = "REQUEST_RENDERABLE_SURFACE_EXPRESSION_WITH_SAME_MAP_TUPLE";
        state.postgameStatus = "CANVAS_HEX_GATE_PACKET_ACCEPTED_WAITING_RENDERABLE_SURFACE_RETURN";
      } else {
        state.hexGateRejectedCount += 1;
        state.hexGatePacketRejected = true;
        state.hexGatePacketAccepted = false;
        state.hexGateLastStatus = "HEX_GATE_PACKET_SENT_BUT_NOT_ACCEPTED";
        state.hexGateLastReason = safeString(
          receipt && (receipt.lastRejectionReason || receipt.reason || receipt.firstFailedCoordinate),
          "HEX_SURFACE_RECEIPT_DID_NOT_CONFIRM_ACCEPTANCE"
        );
        state.firstFailedCoordinate = "HEX_GATE_PACKET_NOT_ACCEPTED";
        state.recommendedNextFile = HEX_SURFACE_FILE;
        state.recommendedNextAction = "AUDIT_HEX_SURFACE_CANVAS_GATE_VALIDATION";
        state.postgameStatus = "CANVAS_HEX_GATE_PACKET_SENT_BUT_HEX_SURFACE_DID_NOT_CONFIRM_ACCEPTANCE";
      }

      record("CANVAS_HEX_GATE_PACKET_SENT", {
        reason,
        receiver,
        accepted,
        mapTupleId: state.mapTupleId,
        receiptContract: state.hexGateLastReceiptContract
      });

      updateDataset();
      publishReceiptAliases();

      return {
        accepted,
        ok: accepted,
        reason: state.hexGateLastReason,
        packet,
        receipt: clonePlain(receipt),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      state.hexGateRejectedCount += 1;
      state.hexGatePacketRejected = true;
      state.hexGateLastStatus = "HEX_GATE_PACKET_RECEIVER_THROWN";
      state.hexGateLastReason = error && error.message ? String(error.message) : String(error);
      state.firstFailedCoordinate = "HEX_SURFACE_RECEIVER_THROWN";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "AUDIT_HEX_SURFACE_RECEIVE_CANVAS_HEX_GATE_PACKET";
      state.postgameStatus = "CANVAS_HEX_GATE_PACKET_THROWN_BY_HEX_SURFACE_RECEIVER";

      recordError("CANVAS_HEX_GATE_PACKET_SEND_FAILED", error, {
        reason,
        receiver,
        mapTupleId: state.mapTupleId
      });

      updateDataset();
      publishReceiptAliases();

      return {
        accepted: false,
        ok: false,
        reason: state.hexGateLastReason,
        packet,
        receipt: null,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }
  }

  function resolveSurfaceSampleMethod(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    const methods = [
      "sampleHexSurfaceExpression",
      "sampleSurfaceExpression",
      "getRenderableSurfaceExpression",
      "getSurfaceExpressionAt",
      "receiveHexSurfaceExpressionRequest",
      "sample",
      "read"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function screenToWorld(nx, ny, viewState) {
    const dx = safeNumber(nx, 0);
    const dy = safeNumber(ny, 0);
    const r2 = dx * dx + dy * dy;

    if (r2 > 1) return null;

    const z = Math.sqrt(Math.max(0, 1 - r2));
    const sx = dx;
    const sy = -dy;
    const sz = z;

    const yaw = safeNumber(viewState.yaw, 0);
    const pitch = safeNumber(viewState.pitch, 0);

    const cy = Math.cos(yaw);
    const syaw = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const x1 = sx * cy + sz * syaw;
    const z1 = -sx * syaw + sz * cy;

    const y2 = sy * cp + z1 * sp;
    const z2 = -sy * sp + z1 * cp;

    const length = Math.hypot(x1, y2, z2) || 1;
    const x = x1 / length;
    const y = y2 / length;
    const worldZ = z2 / length;

    const lon = Math.atan2(x, worldZ) * 180 / Math.PI;
    const lat = Math.asin(clamp(y, -1, 1)) * 180 / Math.PI;
    const u = wrap01((lon + 180) / 360);
    const v = clamp01((90 - lat) / 180);

    return {
      x,
      y,
      z: worldZ,
      lon,
      lat,
      longitude: lon,
      latitude: lat,
      u,
      v
    };
  }

  function colorFromExpression(expression, world) {
    const e = isObject(expression) ? expression : {};
    const raw =
      Array.isArray(e.rgba) ? e.rgba :
      Array.isArray(e.rgb) ? e.rgb :
      Array.isArray(e.color) ? e.color :
      null;

    if (raw && raw.length >= 3) {
      return [
        clamp(Math.round(raw[0]), 0, 255),
        clamp(Math.round(raw[1]), 0, 255),
        clamp(Math.round(raw[2]), 0, 255),
        clamp(Math.round(raw[3] === undefined ? 255 : raw[3]), 0, 255)
      ];
    }

    const isLand = safeBool(e.isLand, false);
    const shelf = clamp01(e.shelf);
    const deep = clamp01(e.deep);
    const relief = clamp01(e.relief);
    const cold = clamp01(e.cold);
    const grain = clamp01(e.grain);
    const shade = clamp(0.82 + (world.z || 0) * 0.18 + (grain - 0.5) * 0.22, 0.58, 1.18);

    if (isLand) {
      const r = Math.round((70 + relief * 72 + cold * 60) * shade);
      const g = Math.round((96 + relief * 26 + cold * 42) * shade);
      const b = Math.round((62 + cold * 70) * shade);
      return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), 255];
    }

    const r = Math.round((4 + shelf * 38) * shade);
    const g = Math.round((44 + shelf * 98 - deep * 20) * shade);
    const b = Math.round((90 + shelf * 78 - deep * 38) * shade);

    return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), 255];
  }

  function requestSurfaceExpression(authority, method, request) {
    try {
      const result = authority[method](request, {
        sourceName: "CANVAS_V12_5_MAP_TUPLE_RENDER_REQUEST",
        canvasMapTupleBridge: true,
        renderableSurfaceReturnRequested: true
      });

      if (isObject(result) && result.ok !== false && result.rejected !== true) {
        return result;
      }
    } catch (error) {
      recordError("CANVAS_RENDERABLE_SURFACE_SAMPLE_FAILED", error, {
        method,
        cellId: request && request.cellId
      });
    }

    return null;
  }

  function renderSurfaceExpressionFromMapTuple(reason = "manual", options = {}) {
    if (state.renderableSurfaceRenderInProgress) {
      return {
        rendered: false,
        ok: false,
        reason: "RENDERABLE_SURFACE_RENDER_ALREADY_IN_PROGRESS",
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }

    ensureCanvasSurface(`renderable:${reason}`);
    scanCanvasSurface({ repairIfZero: true });
    observeNeighborAuthorities();

    if (!state.canvasSurfaceReady || !canvasElement || !context2d) {
      state.renderableSurfaceRejectedCount += 1;
      state.renderableSurfaceLastStatus = "CANVAS_SURFACE_NOT_READY";
      state.renderableSurfaceLastReason = "CANONICAL_CANVAS_SURFACE_NOT_READY_FOR_RENDERABLE_RETURN";
      state.firstFailedCoordinate = "CANONICAL_CANVAS_SURFACE_NOT_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "RESTORE_CANONICAL_CANVAS_SURFACE_BEFORE_HEX_GATE_RENDER";
      state.postgameStatus = "CANVAS_RENDERABLE_SURFACE_RETURN_HELD_CANONICAL_SURFACE_NOT_READY";
      updateDataset();
      publishReceiptAliases();

      return {
        rendered: false,
        ok: false,
        reason: state.renderableSurfaceLastReason,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }

    const hexGate = sendCanvasHexGatePacket(reason, options);

    if (!hexGate.accepted && options.allowSurfaceSampleWithoutHexGate !== true) {
      state.renderableSurfaceRejectedCount += 1;
      state.renderableSurfaceLastStatus = "HEX_GATE_NOT_ACCEPTED";
      state.renderableSurfaceLastReason = state.hexGateLastReason;
      updateDataset();
      publishReceiptAliases();

      if (!state.canvasPixelVisible && !state.downstreamSurfaceLatched) {
        scheduleLocalFallback(`hex-gate-not-accepted:${reason}`);
      }

      return {
        rendered: false,
        ok: false,
        reason: state.renderableSurfaceLastReason,
        hexGate,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }

    const surfaceFound = firstGlobal(SURFACE_EXPRESSION_ALIASES);
    const surfaceMethod = resolveSurfaceSampleMethod(surfaceFound.value);

    if (!surfaceFound.value || !surfaceMethod) {
      state.renderableSurfaceRejectedCount += 1;
      state.renderableSurfaceLastStatus = "SURFACE_EXPRESSION_SOCKET_NOT_AVAILABLE";
      state.renderableSurfaceLastReason = "NO_PUBLIC_SURFACE_EXPRESSION_SAMPLE_METHOD_FOUND";
      state.firstFailedCoordinate = "SURFACE_EXPRESSION_SOCKET_NOT_AVAILABLE";
      state.recommendedNextFile = POINTER_FINGER_SURFACE_FILE;
      state.recommendedNextAction = "LOAD_OR_RENEW_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET";
      state.postgameStatus = "CANVAS_HEX_GATE_ACCEPTED_BUT_SURFACE_EXPRESSION_SOCKET_MISSING";
      updateDataset();
      publishReceiptAliases();

      if (!state.canvasPixelVisible && !state.downstreamSurfaceLatched) {
        scheduleLocalFallback(`surface-expression-missing:${reason}`);
      }

      return {
        rendered: false,
        ok: false,
        reason: state.renderableSurfaceLastReason,
        hexGate,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }

    const hexAuthorityFound = firstGlobal(HEX_AUTHORITY_ALIASES);
    const hexAuthority = hexAuthorityFound.value;
    const hexSampleMethod =
      hexAuthority && isFunction(hexAuthority.sample) ? "sample" :
      hexAuthority && isFunction(hexAuthority.read) ? "read" :
      "";

    const tuple = state.lastMapTuple || composeMapTuple(reason, options);
    const rect = getRect(canvasElement);
    const cssWidth = Math.max(1, Math.floor(rect.width || chooseSurfaceSize()));
    const cssHeight = Math.max(1, Math.floor(rect.height || cssWidth));
    const size = Math.min(cssWidth, cssHeight);
    const resolution = clamp(
      Math.round(safeNumber(options.resolution, tuple.renderResolution || STANDARD_RENDER_RESOLUTION)),
      48,
      192
    );

    state.renderableSurfaceRequestCount += 1;
    state.renderableSurfaceRenderInProgress = true;
    renderSerial += 1;

    const localSerial = renderSerial;

    try {
      const scratch = doc && isFunction(doc.createElement)
        ? doc.createElement("canvas")
        : null;

      if (!scratch || !isFunction(scratch.getContext)) {
        throw new Error("SCRATCH_CANVAS_UNAVAILABLE_FOR_RENDERABLE_SURFACE_RETURN");
      }

      scratch.width = resolution;
      scratch.height = resolution;

      const scratchCtx = scratch.getContext("2d", { alpha: true, willReadFrequently: true });
      const image = scratchCtx.createImageData(resolution, resolution);
      const data = image.data;

      const viewState = clonePlain(tuple.viewState || {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      });

      let sampleCount = 0;
      let drawablePixels = 0;
      let landPixels = 0;
      let waterPixels = 0;
      let firstExpression = null;

      for (let y = 0; y < resolution; y += 1) {
        for (let x = 0; x < resolution; x += 1) {
          const nx = ((x + 0.5) / resolution - 0.5) * 2 / Math.max(0.001, viewState.zoom);
          const ny = ((y + 0.5) / resolution - 0.5) * 2 / Math.max(0.001, viewState.zoom);
          const world = screenToWorld(nx, ny, viewState);
          const offset = (y * resolution + x) * 4;

          if (!world) {
            data[offset] = 0;
            data[offset + 1] = 0;
            data[offset + 2] = 0;
            data[offset + 3] = 0;
            continue;
          }

          let hexSample = null;

          if (hexAuthority && hexSampleMethod) {
            try {
              hexSample = hexAuthority[hexSampleMethod](world);
            } catch (error) {
              recordError("CANVAS_HEX_AUTHORITY_SAMPLE_FAILED", error, {
                x,
                y,
                mapTupleId: tuple.tupleId
              });
            }
          }

          const request = {
            packetType: "HEARTH_CANVAS_RENDERABLE_SURFACE_EXPRESSION_SAMPLE_REQUEST_v12_5",
            sourceFile: FILE,
            sourceContract: CONTRACT,
            consumerFile: FILE,
            hexSurfaceFile: HEX_SURFACE_FILE,
            hexAuthorityFile: HEX_AUTHORITY_FILE,
            surfaceExpressionFile: POINTER_FINGER_SURFACE_FILE,
            mapTupleId: tuple.tupleId,
            mapTupleVersion: tuple.tupleVersion,
            sampleX: x,
            sampleY: y,
            resolution,
            coord: world,
            x: world.x,
            y: world.y,
            z: world.z,
            u: world.u,
            v: world.v,
            lon: world.lon,
            lat: world.lat,
            longitude: world.longitude,
            latitude: world.latitude,
            viewState,
            hexSampleAvailable: Boolean(hexSample),
            ...(isObject(hexSample) ? hexSample : {}),
            ...NO_CLAIMS,
            ...UPPER_NO_CLAIMS
          };

          const expression = requestSurfaceExpression(surfaceFound.value, surfaceMethod, request);

          if (!expression) {
            data[offset] = 0;
            data[offset + 1] = 0;
            data[offset + 2] = 0;
            data[offset + 3] = 0;
            continue;
          }

          if (!firstExpression) firstExpression = clonePlain(expression);

          const color = colorFromExpression(expression, world);

          data[offset] = color[0];
          data[offset + 1] = color[1];
          data[offset + 2] = color[2];
          data[offset + 3] = color[3];

          sampleCount += 1;
          drawablePixels += 1;

          if (safeBool(expression.isLand, false)) landPixels += 1;
          else waterPixels += 1;
        }
      }

      if (localSerial !== renderSerial) {
        state.renderableSurfaceRenderInProgress = false;
        return {
          rendered: false,
          ok: false,
          reason: "RENDER_SERIAL_SUPERSEDED",
          ...NO_CLAIMS,
          ...UPPER_NO_CLAIMS
        };
      }

      scratchCtx.putImageData(image, 0, 0);

      context2d.clearRect(0, 0, cssWidth, cssHeight);
      context2d.drawImage(scratch, 0, 0, cssWidth, cssHeight);

      state.renderCount += 1;
      state.renderableSurfaceServedCount += 1;
      state.renderableSurfaceRenderCount += 1;
      state.renderableSurfaceLastRenderAt = nowIso();
      state.renderableSurfaceLastResolution = resolution;
      state.renderableSurfaceLastSampleCount = sampleCount;
      state.renderableSurfaceLastDrawablePixels = drawablePixels;
      state.renderableSurfaceLastLandPixels = landPixels;
      state.renderableSurfaceLastWaterPixels = waterPixels;
      state.renderableSurfaceLastStatus = drawablePixels > 0
        ? "RENDERABLE_SURFACE_RETURN_DRAWN"
        : "RENDERABLE_SURFACE_RETURN_BLANK";
      state.renderableSurfaceLastReason = drawablePixels > 0
        ? "SURFACE_EXPRESSION_SAMPLES_DRAWN_WITH_CANONICAL_MAP_TUPLE"
        : "NO_DRAWABLE_SURFACE_EXPRESSION_PIXELS_RETURNED";

      if (drawablePixels > 0) {
        const now = nowIso();

        state.downstreamSurfaceObserved = true;
        state.downstreamSurfaceLatched = true;
        state.downstreamSurfaceObservedAt = state.downstreamSurfaceObservedAt || now;
        state.downstreamSurfaceLastObservedAt = now;
        state.downstreamSurfaceSource = surfaceFound.path;
        state.downstreamSurfacePacketType = CANVAS_RENDERABLE_RETURN_PACKET;
        state.downstreamSurfaceContract = firstNonEmpty(state.surfaceExpressionContract, contractOf(firstExpression), "UNKNOWN");
        state.downstreamSurfaceDrawableApplied = true;
        state.downstreamSurfaceDrawableType = "sampled-renderable-surface-expression-grid";
        state.downstreamSurfaceAdmissionCount += 1;

        suppressLocalFallback("RENDERABLE_SURFACE_RETURN_DRAWN_FROM_CANONICAL_HEX_GATE_MAP_TUPLE");

        state.firstFailedCoordinate = "NONE_RENDERABLE_SURFACE_RETURN_DRAWN";
        state.recommendedNextFile = POINTER_FINGER_INSPECT_FILE;
        state.recommendedNextAction = "AUDIT_POINTER_FINGER_INSPECT_SEQUENCE_AND_CANVAS_RETURN_EVIDENCE";
        state.postgameStatus = "CANVAS_HEX_GATE_MAP_TUPLE_RENDERABLE_SURFACE_RETURN_DRAWN_NO_FINAL_CLAIM";
      } else {
        state.firstFailedCoordinate = "RENDERABLE_SURFACE_RETURN_BLANK";
        state.recommendedNextFile = POINTER_FINGER_SURFACE_FILE;
        state.recommendedNextAction = "AUDIT_SURFACE_EXPRESSION_SAMPLE_RETURN_VALUES";
        state.postgameStatus = "CANVAS_HEX_GATE_ACCEPTED_BUT_RENDERABLE_SURFACE_RETURN_BLANK";
      }

      scanCanvasSurface({ repairIfZero: true });
      updateDataset();
      publishReceiptAliases();

      record("CANVAS_RENDERABLE_SURFACE_RETURN_DRAWN", {
        reason,
        mapTupleId: tuple.tupleId,
        resolution,
        sampleCount,
        drawablePixels,
        landPixels,
        waterPixels,
        hexGateAccepted: state.hexGatePacketAccepted,
        surfaceExpressionSource: surfaceFound.path,
        visualPassClaimed: false
      });

      return {
        packetType: CANVAS_RENDERABLE_RETURN_PACKET,
        rendered: drawablePixels > 0,
        ok: drawablePixels > 0,
        contract: CONTRACT,
        receipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        mapTupleId: tuple.tupleId,
        mapTupleVersion: tuple.tupleVersion,
        resolution,
        sampleCount,
        drawablePixels,
        landPixels,
        waterPixels,
        hexGateAccepted: state.hexGatePacketAccepted,
        surfaceExpressionSource: surfaceFound.path,
        canvasPixelVisible: state.canvasPixelVisible,
        canvasPixelSampleStatus: state.canvasPixelSampleStatus,
        downstreamSurfaceObserved: state.downstreamSurfaceObserved,
        downstreamSurfaceLatched: state.downstreamSurfaceLatched,
        localFallbackSuppressed: state.localFallbackSuppressed,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      state.renderableSurfaceRejectedCount += 1;
      state.renderableSurfaceLastStatus = "RENDERABLE_SURFACE_RENDER_FAILED";
      state.renderableSurfaceLastReason = error && error.message ? String(error.message) : String(error);
      state.firstFailedCoordinate = "RENDERABLE_SURFACE_RENDER_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "AUDIT_CANVAS_RENDERABLE_SURFACE_RETURN_DRAW_PATH";
      state.postgameStatus = "CANVAS_RENDERABLE_SURFACE_RETURN_RENDER_FAILED";

      recordError("CANVAS_RENDERABLE_SURFACE_RENDER_FAILED", error, {
        reason,
        mapTupleId: tuple && tuple.tupleId,
        resolution
      });

      updateDataset();
      publishReceiptAliases();

      if (!state.canvasPixelVisible && !state.downstreamSurfaceLatched) {
        scheduleLocalFallback(`renderable-surface-render-failed:${reason}`);
      }

      return {
        rendered: false,
        ok: false,
        reason: state.renderableSurfaceLastReason,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } finally {
      state.renderableSurfaceRenderInProgress = false;
      updateDataset();
    }
  }

  function clearFallbackTimer() {
    if (!fallbackTimer) return;

    try {
      if (root.clearTimeout) root.clearTimeout(fallbackTimer);
    } catch (_error) {}

    fallbackTimer = 0;
  }

  function suppressLocalFallback(reason) {
    clearFallbackTimer();

    state.localFallbackSuppressed = true;
    state.localFallbackAllowed = false;
    state.localFallbackSuppressionReason = reason || "RENDERABLE_DOWNSTREAM_SURFACE_OBSERVED";
    state.localFallbackLastSuppressedAt = nowIso();

    record("CANVAS_LOCAL_FALLBACK_SUPPRESSED", {
      reason: state.localFallbackSuppressionReason,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount
    });

    updateDataset();
  }

  function releaseLocalFallback(reason) {
    if (state.downstreamSurfaceLatched || state.renderableSurfaceRenderCount > 0) {
      suppressLocalFallback("RENDERABLE_SURFACE_LATCH_PREVENTS_FALLBACK_RELEASE");
      return false;
    }

    state.localFallbackSuppressed = false;
    state.localFallbackAllowed = true;
    state.localFallbackSuppressionReason = reason || "NO_RENDERABLE_DOWNSTREAM_SURFACE_OBSERVED";
    updateDataset();
    return true;
  }

  function shouldDrawLocalFallback(reason) {
    if (state.downstreamSurfaceLatched || state.downstreamSurfaceObserved || state.renderableSurfaceRenderCount > 0) {
      state.localFallbackDrawSuppressedCount += 1;
      suppressLocalFallback(`FALLBACK_BLOCKED_AFTER_RENDERABLE_SURFACE:${reason}`);
      return false;
    }

    if (!state.localFallbackAllowed || state.localFallbackSuppressed) {
      state.localFallbackDrawSuppressedCount += 1;
      state.localFallbackLastSuppressedAt = nowIso();

      record("CANVAS_LOCAL_FALLBACK_DRAW_SUPPRESSED", {
        reason,
        localFallbackAllowed: state.localFallbackAllowed,
        localFallbackSuppressed: state.localFallbackSuppressed
      });

      return false;
    }

    return true;
  }

  function scheduleLocalFallback(reason = "scheduled-placeholder") {
    if (state.downstreamSurfaceLatched || state.downstreamSurfaceObserved || state.renderableSurfaceRenderCount > 0) {
      suppressLocalFallback(`SCHEDULE_BLOCKED_AFTER_RENDERABLE_SURFACE:${reason}`);
      return false;
    }

    if (!root.setTimeout) {
      return drawLocalFallbackSurface(reason);
    }

    clearFallbackTimer();

    fallbackTimer = root.setTimeout(() => {
      fallbackTimer = 0;

      if (state.downstreamSurfaceLatched || state.downstreamSurfaceObserved || state.renderableSurfaceRenderCount > 0) {
        suppressLocalFallback(`DELAYED_FALLBACK_CANCELLED_AFTER_RENDERABLE_SURFACE:${reason}`);
        return;
      }

      scanCanvasSurface({ repairIfZero: true });

      if (!state.canvasPixelVisible) {
        drawLocalFallbackSurface(reason);
      } else {
        record("CANVAS_LOCAL_FALLBACK_DELAY_COMPLETED_EXISTING_PIXEL_PRESERVED", {
          reason,
          canvasPixelSampleStatus: state.canvasPixelSampleStatus
        });
      }
    }, FALLBACK_DELAY_MS);

    record("CANVAS_LOCAL_FALLBACK_SCHEDULED", {
      reason,
      delayMs: FALLBACK_DELAY_MS
    });

    return true;
  }

  function drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, ox, oy, sx, sy) {
    const points = 18;
    const x = cx + radius * (ox * Math.cos(yaw * 0.25) + Math.sin(yaw + ox) * 0.05) * zoom;
    const y = cy + radius * (oy + Math.sin(pitch + oy) * 0.045) * zoom;
    const rx = radius * sx * zoom;
    const ry = radius * sy * zoom;

    ctx.beginPath();

    for (let index = 0; index <= points; index += 1) {
      const angle = (Math.PI * 2 * index) / points;
      const irregular =
        1 +
        Math.sin(angle * 3 + yaw * 0.9 + ox * 10) * 0.13 +
        Math.cos(angle * 5 + pitch * 0.7 + oy * 12) * 0.08;

      const px = x + Math.cos(angle) * rx * irregular;
      const py = y + Math.sin(angle) * ry * irregular;

      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();

    const grad = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
    grad.addColorStop(0, "#9e8b52");
    grad.addColorStop(0.45, "#5f7d48");
    grad.addColorStop(1, "#3e5b3b");

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(218, 210, 148, 0.20)";
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.stroke();
  }

  function drawLocalFallbackSurface(reason = "manual-placeholder") {
    state.localFallbackDrawAttemptCount += 1;

    if (!shouldDrawLocalFallback(reason)) {
      return false;
    }

    ensureCanvasSurface(`fallback:${reason}`);

    if (!canvasElement || !context2d) return false;

    scanCanvasSurface({ repairIfZero: true });

    const rect = getRect(canvasElement);
    const width = Math.max(1, Math.floor(rect.width || chooseSurfaceSize()));
    const height = Math.max(1, Math.floor(rect.height || width));
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.max(80, Math.min(width, height) * 0.46);
    const yaw = state.viewYaw;
    const pitch = state.viewPitch;
    const zoom = state.viewZoom;
    const ctx = context2d;

    try {
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.24);
      bg.addColorStop(0, "rgba(9, 20, 32, 0.10)");
      bg.addColorStop(1, "rgba(9, 20, 32, 0.72)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - radius * 0.24,
        cy - radius * 0.22,
        radius * 0.08,
        cx,
        cy,
        radius * 1.1
      );

      ocean.addColorStop(0, "#4da9cc");
      ocean.addColorStop(0.46, "#1c668d");
      ocean.addColorStop(1, "#082f4d");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.globalAlpha = 0.78;
      drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.16, -0.22, 0.42, 0.20);
      drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, -0.34, -0.08, 0.30, 0.17);
      drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.05, 0.27, 0.34, 0.16);
      drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.42, 0.08, 0.18, 0.12);
      drawFallbackLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, -0.12, -0.46, 0.22, 0.08);
      ctx.globalAlpha = 1;

      const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      shade.addColorStop(0, "rgba(255,255,255,0.24)");
      shade.addColorStop(0.45, "rgba(255,255,255,0.02)");
      shade.addColorStop(1, "rgba(0,0,0,0.34)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(170, 225, 255, 0.34)";
      ctx.lineWidth = Math.max(1, radius * 0.012);
      ctx.stroke();

      state.renderCount += 1;
      state.localFallbackDrawCount += 1;
      state.localFallbackLastDrawAt = nowIso();
      state.updatedAt = state.localFallbackLastDrawAt;

      scanCanvasSurface({ repairIfZero: true });
      updateDataset();

      record("CANVAS_LOCAL_PLACEHOLDER_FALLBACK_DRAWN", {
        reason,
        localFallbackDrawCount: state.localFallbackDrawCount,
        downstreamSurfaceLatched: state.downstreamSurfaceLatched,
        renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
        visualPassClaimed: false
      });

      return true;
    } catch (error) {
      recordError("CANVAS_LOCAL_FALLBACK_RENDER_FAILED", error, { reason });
      scanCanvasSurface({ repairIfZero: true });
      updateDataset();
      return false;
    }
  }

  function packetText(packet) {
    if (!packet) return "";
    if (typeof packet === "string") return packet;

    try {
      return JSON.stringify(packet);
    } catch (_error) {
      return safeString(packet);
    }
  }

  function findDrawableSource(packet = {}) {
    const p = isObject(packet) ? packet : {};

    const directKeys = [
      "drawable",
      "surface",
      "surfaceCanvas",
      "sourceCanvas",
      "textureCanvas",
      "canvas",
      "frame",
      "image",
      "imageBitmap",
      "bitmap",
      "video"
    ];

    for (const key of directKeys) {
      if (isDrawable(p[key])) {
        return {
          drawable: p[key],
          type: key
        };
      }
    }

    if (isObject(p.payload)) {
      const nested = findDrawableSource(p.payload);
      if (nested.drawable) return nested;
    }

    if (isObject(p.framePacket)) {
      const nested = findDrawableSource(p.framePacket);
      if (nested.drawable) return nested;
    }

    if (isObject(p.surfacePacket)) {
      const nested = findDrawableSource(p.surfacePacket);
      if (nested.drawable) return nested;
    }

    return {
      drawable: null,
      type: "NONE"
    };
  }

  function findRenderableExpressionEvidence(packet = {}) {
    const p = isObject(packet) ? packet : {};

    const candidates = [
      p.renderableSurfaceExpression,
      p.surfaceExpression,
      p.expression,
      p.samplePreview,
      p.surfaceSample,
      p.payload && p.payload.renderableSurfaceExpression,
      p.payload && p.payload.surfaceExpression,
      p.payload && p.payload.expression,
      p.payload && p.payload.samplePreview
    ];

    for (const candidate of candidates) {
      if (!isObject(candidate)) continue;

      if (
        Array.isArray(candidate.rgba) ||
        Array.isArray(candidate.rgb) ||
        Array.isArray(candidate.color) ||
        candidate.materialClass ||
        candidate.isLand !== undefined ||
        candidate.isWater !== undefined
      ) {
        return candidate;
      }
    }

    return null;
  }

  function classifyDownstreamSurfacePacket(packet) {
    if (!packet) {
      return {
        renderable: false,
        metadataOnly: false,
        reason: "NO_PACKET"
      };
    }

    const p = isObject(packet) ? packet : {};
    const text = packetText(packet).toUpperCase();

    const packetType = safeString(p.packetType || p.type || p.PACKET_NAME || p.packetName).toUpperCase();
    const sourceFile = safeString(p.sourceFile || p.fromFile || p.file || p.FILE).toLowerCase();
    const sourceRole = safeString(p.sourceRole || p.role || p.owner || p.sourceAuthority).toUpperCase();
    const sourceContract = safeString(p.contract || p.sourceContract || p.hexSurfaceContract || p.pointerFingerContract || p.surfaceContract).toUpperCase();

    const drawable = findDrawableSource(p).drawable;
    const expression = findRenderableExpressionEvidence(p);

    if (drawable) {
      return {
        renderable: true,
        metadataOnly: false,
        reason: "DRAWABLE_SURFACE_FOUND"
      };
    }

    if (expression) {
      return {
        renderable: true,
        metadataOnly: false,
        reason: "RENDERABLE_SURFACE_EXPRESSION_FOUND"
      };
    }

    const downstreamMetadata = Boolean(
      safeBool(p.downstreamSurfaceReady, false) ||
      safeBool(p.downstreamSurfaceObserved, false) ||
      safeBool(p.hexSurfaceReady, false) ||
      safeBool(p.pointerFingerReady, false) ||
      safeBool(p.surfaceReady, false) ||
      safeBool(p.expressionSurfaceReady, false) ||
      safeBool(p.canvasExpressionSurfaceReady, false) ||
      safeBool(p.canvasSurfaceReady, false) ||
      safeBool(p.renderedPlanetProofReady, false) ||
      safeBool(p.visiblePlanetProofReady, false) ||
      safeBool(p.canvasPixelVisible, false) ||
      safeBool(p.CANVAS_PIXEL_VISIBLE, false) ||
      sourceFile.includes("hearth.hex.surface.js") ||
      sourceFile.includes("hearth.canvas.finger") ||
      sourceRole.includes("HEX_SURFACE") ||
      sourceRole.includes("POINTER") ||
      sourceRole.includes("FINGER") ||
      sourceRole.includes("EXPRESSION") ||
      sourceContract.includes("HEARTH_HEX_SURFACE") ||
      sourceContract.includes("HEARTH_CANVAS_FINGER") ||
      packetType.includes("HEX_SURFACE") ||
      packetType.includes("POINTER") ||
      packetType.includes("FINGER") ||
      packetType.includes("DOWNSTREAM") ||
      packetType.includes("EXPRESSION_SURFACE") ||
      packetType.includes("SURFACE_FRAME") ||
      packetType.includes("VISIBLE_SURFACE") ||
      (
        text.includes("HEX_SURFACE") &&
        text.includes("CANVAS") &&
        text.includes("READY")
      )
    );

    return {
      renderable: false,
      metadataOnly: downstreamMetadata,
      reason: downstreamMetadata
        ? "DOWNSTREAM_METADATA_ONLY_NO_DRAWABLE_OR_RENDERABLE_EXPRESSION"
        : "PACKET_NOT_DOWNSTREAM_SURFACE"
    };
  }

  function rejectMetadataOnlyDownstreamPacket(packet, source, reason) {
    state.downstreamSurfaceMetadataOnlyRejectedCount += 1;
    state.downstreamSurfaceLastMetadataOnlyRejectedReason = reason || "METADATA_ONLY_DOWNSTREAM_PACKET_REJECTED";
    state.lastDownstreamPacket = clonePlain(packet);
    state.firstFailedCoordinate = "DOWNSTREAM_SURFACE_METADATA_ONLY";
    state.recommendedNextFile = POINTER_FINGER_SURFACE_FILE;
    state.recommendedNextAction = "RETURN_DRAWABLE_FRAME_OR_RENDERABLE_SURFACE_EXPRESSION_SAMPLE";
    state.postgameStatus = "CANVAS_REJECTED_METADATA_ONLY_DOWNSTREAM_SURFACE_LATCH";

    record("CANVAS_REJECTED_METADATA_ONLY_DOWNSTREAM_SURFACE_PACKET", {
      source,
      reason: state.downstreamSurfaceLastMetadataOnlyRejectedReason
    });

    updateDataset();
    publishReceiptAliases();

    return {
      packetType: "HEARTH_CANVAS_METADATA_ONLY_DOWNSTREAM_SURFACE_REJECTION_v12_5",
      accepted: false,
      ok: false,
      rejected: true,
      reason: state.downstreamSurfaceLastMetadataOnlyRejectedReason,
      contract: CONTRACT,
      receipt: RECEIPT,
      source,
      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function applyImageDataPacket(packet = {}) {
    if (!context2d || !canvasElement || !isObject(packet)) return false;

    const candidate =
      packet.imageData ||
      packet.surfaceImageData ||
      packet.frameImageData ||
      (packet.payload && packet.payload.imageData);

    if (!candidate) return false;

    try {
      if (
        typeof ImageData !== "undefined" &&
        candidate instanceof ImageData
      ) {
        context2d.putImageData(candidate, 0, 0);
        return true;
      }
    } catch (_error) {}

    return false;
  }

  function applyDrawablePacket(packet = {}) {
    if (!canvasElement || !context2d || !isObject(packet)) return false;

    const found = findDrawableSource(packet);

    if (found.drawable) {
      try {
        ensureCanvasSurface("apply-drawable-packet");

        const rect = getRect(canvasElement);
        const width = Math.max(1, Math.floor(rect.width || chooseSurfaceSize()));
        const height = Math.max(1, Math.floor(rect.height || width));

        context2d.clearRect(0, 0, width, height);
        context2d.drawImage(found.drawable, 0, 0, width, height);

        state.downstreamSurfaceDrawableApplied = true;
        state.downstreamSurfaceDrawableType = found.type;
        state.renderCount += 1;

        scanCanvasSurface({ repairIfZero: true });

        return true;
      } catch (error) {
        recordError("CANVAS_DOWNSTREAM_DRAWABLE_APPLY_FAILED", error, {
          drawableType: found.type
        });
      }
    }

    if (applyImageDataPacket(packet)) {
      state.downstreamSurfaceDrawableApplied = true;
      state.downstreamSurfaceDrawableType = "imageData";
      state.renderCount += 1;
      scanCanvasSurface({ repairIfZero: true });
      return true;
    }

    return false;
  }

  function latchDownstreamSurface(packet = {}, source = "UNKNOWN") {
    const classification = classifyDownstreamSurfacePacket(packet);

    if (!classification.renderable) {
      return rejectMetadataOnlyDownstreamPacket(packet, source, classification.reason);
    }

    ensureCanvasSurface(`downstream:${source}`);

    clearFallbackTimer();

    const p = isObject(packet) ? packet : {};
    const now = nowIso();

    state.downstreamSurfaceObserved = true;
    state.downstreamSurfaceLatched = true;
    state.downstreamSurfaceObservedAt = state.downstreamSurfaceObservedAt || now;
    state.downstreamSurfaceLastObservedAt = now;
    state.downstreamSurfaceSource = safeString(source || p.sourceFile || p.fromFile || p.file || "UNKNOWN");
    state.downstreamSurfacePacketType = safeString(p.packetType || p.type || p.PACKET_NAME || p.packetName || "UNKNOWN");
    state.downstreamSurfaceContract = safeString(
      p.contract ||
      p.sourceContract ||
      p.hexSurfaceContract ||
      p.pointerFingerContract ||
      p.surfaceContract ||
      "UNKNOWN"
    );
    state.downstreamSurfaceAdmissionCount += 1;
    state.lastDownstreamPacket = clonePlain(packet);

    suppressLocalFallback(`DOWNSTREAM_RENDERABLE_SURFACE_LATCHED:${state.downstreamSurfaceSource}`);

    const applied = applyDrawablePacket(p);

    if (!applied && findRenderableExpressionEvidence(p)) {
      renderSurfaceExpressionFromMapTuple(`renderable-expression-packet:${source}`, {
        fast: false,
        allowSurfaceSampleWithoutHexGate: state.hexGatePacketAccepted
      });
    }

    state.downstreamSurfaceDrawableApplied = Boolean(state.downstreamSurfaceDrawableApplied || applied);

    scanCanvasSurface({ repairIfZero: true });

    state.firstFailedCoordinate = state.canvasRectNonzero
      ? "NONE_DOWNSTREAM_RENDERABLE_SURFACE_LATCHED"
      : "CANVAS_RECT_NONZERO";
    state.recommendedNextFile = state.canvasRectNonzero ? POINTER_FINGER_INSPECT_FILE : FILE;
    state.recommendedNextAction = state.canvasRectNonzero
      ? "AUDIT_POINTER_FINGER_INSPECT_SEQUENCE_AND_CANVAS_RETURN_EVIDENCE"
      : "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT_INSIDE_HEARTH_CANVAS_MOUNT";
    state.postgameStatus = state.canvasRectNonzero
      ? "CANVAS_DOWNSTREAM_RENDERABLE_SURFACE_LATCHED_LOCAL_FALLBACK_SUPPRESSED_NO_FINAL_CLAIM"
      : "CANVAS_DOWNSTREAM_RENDERABLE_SURFACE_LATCHED_BUT_CANONICAL_RECT_STILL_ZERO";

    record("CANVAS_DOWNSTREAM_RENDERABLE_SURFACE_LATCHED", {
      source: state.downstreamSurfaceSource,
      packetType: state.downstreamSurfacePacketType,
      contract: state.downstreamSurfaceContract,
      drawableApplied: applied,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasPixelVisible: state.canvasPixelVisible,
      visualPassClaimed: false
    });

    updateDataset();
    publishReceiptAliases();

    return {
      packetType: "HEARTH_CANVAS_DOWNSTREAM_RENDERABLE_SURFACE_ADMISSION_RECEIPT_v12_5",
      accepted: true,
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      downstreamSurfaceSource: state.downstreamSurfaceSource,
      downstreamSurfacePacketType: state.downstreamSurfacePacketType,
      downstreamSurfaceContract: state.downstreamSurfaceContract,
      downstreamSurfaceDrawableApplied: state.downstreamSurfaceDrawableApplied,
      localFallbackSuppressed: state.localFallbackSuppressed,
      localFallbackSuppressionReason: state.localFallbackSuppressionReason,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function routePacketLooksValid(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type);
    const destination = safeString(packet.destinationFile || packet.targetFile || packet.canvasFile);
    const sourceFile = safeString(packet.sourceFile || packet.fromFile);
    const contract = safeString(packet.contract || packet.routeConductorContract || packet.sourceContract);

    return Boolean(
      packetType === ROUTE_PACKET_TYPE ||
      packetType.includes("PRESENTATION_PLATTER") ||
      packetType.includes("CANVAS_HANDOFF") ||
      destination === FILE ||
      destination.endsWith("/hearth.canvas.js") ||
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR")
    );
  }

  function composeAcceptancePacket(packet = {}) {
    const p = isObject(packet) ? packet : {};
    const routeActiveScanConfirmed = safeBool(p.routeActiveScanConfirmed, false);
    const accepted = Boolean(state.canvasSurfaceReady && routePacketLooksValid(p));

    const acceptance = {
      packetType: CANVAS_ACCEPTANCE_PACKET,
      type: CANVAS_ACCEPTANCE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: RENEWAL_CONTRACT,
      currentCanvasParentReceipt: RENEWAL_RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_PRESENTATION_PLATTER",
      sourceRole: "canvas-presentation-platter-canonical-dom-surface-authority",
      targetFile: ROUTE_CONDUCTOR_FILE,
      destinationFile: ROUTE_CONDUCTOR_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      canvasFile: FILE,
      controlsFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,

      accepted,
      ok: accepted,
      routePresentationPacketAccepted: accepted,
      canvasAcceptanceScanConfirmed: accepted,
      canvasAcceptanceScanRequested: true,
      bilateralRouteCanvasScanConfirmed: Boolean(accepted && routeActiveScanConfirmed),

      canonicalCanvasSelectionActive: true,
      canonicalSurfaceRectLockActive: true,
      concreteSurfaceFrameActive: true,
      canonicalHexGateMapTupleBridgeActive: true,
      renderableSurfaceReturnAdmissionActive: true,
      metadataOnlyLatchRejectionActive: true,
      canvasLocalMathTerminationSuppressed: true,

      canvasSelectionMode: state.canvasSelectionMode,
      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      canonicalFrameId: CANONICAL_FRAME_ID,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,

      canvasMountFound: state.mountFound,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasFrameFound: state.frameFound,
      canvasFrameRectNonzero: state.frameRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasInFrame: state.canvasInFrame,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSurfaceReady: state.canvasSurfaceReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,

      hexGatePacketComposed: state.hexGatePacketComposed,
      hexGatePacketSent: state.hexGatePacketSent,
      hexGatePacketAccepted: state.hexGatePacketAccepted,
      hexGateLastStatus: state.hexGateLastStatus,
      mapTupleId: state.mapTupleId,
      mapTupleVersion: state.mapTupleVersion,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
      renderableSurfaceLastStatus: state.renderableSurfaceLastStatus,

      zeroRectRepairAttempted: state.zeroRectRepairAttempted,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      zeroRectRepairReason: state.zeroRectRepairReason,
      rectLockAttempted: state.rectLockAttempted,
      rectLockApplied: state.rectLockApplied,
      rectLockReason: state.rectLockReason,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize,

      downstreamSurfaceAdmissionActive: true,
      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      downstreamSurfaceSource: state.downstreamSurfaceSource,
      downstreamSurfaceMetadataOnlyRejectedCount: state.downstreamSurfaceMetadataOnlyRejectedCount,
      fallbackSuppressionActive: true,
      fallbackDemotedToPlaceholder: true,
      localFallbackAllowed: state.localFallbackAllowed,
      localFallbackSuppressed: state.localFallbackSuppressed,
      localFallbackSuppressionReason: state.localFallbackSuppressionReason,

      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasOwnsPresentationSurface: true,
      canvasDoesNotOwnSourceTruth: true,
      canvasDoesNotOwnRouteAuthority: true,
      canvasDoesNotOwnControlsAuthority: true,
      canvasDoesNotOwnHexTruth: true,
      canvasDoesNotOwnPointerFingerTruth: true,

      routePacketType: safeString(p.packetType || p.type || "UNKNOWN"),
      routePacketContract: safeString(p.contract || p.routeConductorContract || p.sourceContract || "UNKNOWN"),
      routeActiveScanConfirmed,
      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      firstFailedCoordinate: accepted ? "NONE_CANVAS_ACCEPTANCE_SCAN_CONFIRMED" : state.firstFailedCoordinate,
      recommendedNextFile: accepted ? HEX_SURFACE_FILE : state.recommendedNextFile,
      recommendedNextAction: accepted
        ? "SEND_CANONICAL_MAP_TUPLE_TO_HEX_SURFACE_AND_WAIT_FOR_RENDERABLE_SURFACE_RETURN"
        : state.recommendedNextAction,
      postgameStatus: accepted
        ? "CANVAS_PRESENTATION_PLATTER_ACCEPTED_ROUTE_PACKET_CANONICAL_SURFACE_READY_HEX_GATE_BRIDGE_ACTIVE_NO_FINAL_CLAIM"
        : state.postgameStatus,

      acceptedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    state.lastAcceptancePacket = clonePlain(acceptance);
    return acceptance;
  }

  function publishPacketAliases(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_PRESENTATION_PLATTER_ACCEPTANCE_PACKET = cloned;
    root.HEARTH_CANVAS_ACCEPTANCE_SCAN_PACKET = cloned;
    root.HEARTH_CANVAS_BILATERAL_ROUTE_SCAN_RECEIPT = cloned;

    hearth.canvasPresentationPlatterAcceptancePacket = cloned;
    hearth.canvasAcceptanceScanPacket = cloned;
    hearth.canvasBilateralRouteScanReceipt = cloned;

    lab.hearthCanvasPresentationPlatterAcceptancePacket = cloned;
    lab.hearthCanvasAcceptanceScanPacket = cloned;

    return true;
  }

  function receiveRoutePresentationPlatterPacket(packet) {
    state.packetCount += 1;
    state.canvasAcceptanceScanRequested = true;
    state.lastRoutePacket = clonePlain(packet || null);
    state.routePresentationPacketType = safeString(packet && (packet.packetType || packet.type), "UNKNOWN");
    state.routePresentationPacketSourceContract = safeString(
      packet && (packet.contract || packet.routeConductorContract || packet.sourceContract),
      "UNKNOWN"
    );

    observeNeighborAuthorities();
    ensureCanvasSurface("route-presentation-packet");

    const classification = classifyDownstreamSurfacePacket(packet);

    if (classification.renderable) {
      latchDownstreamSurface(packet, "ROUTE_PRESENTATION_PACKET_WITH_RENDERABLE_SURFACE_SIGNAL");
    } else if (classification.metadataOnly) {
      rejectMetadataOnlyDownstreamPacket(
        packet,
        "ROUTE_PRESENTATION_PACKET_METADATA_ONLY",
        classification.reason
      );
      renderSurfaceExpressionFromMapTuple("route-presentation-packet-metadata-only", { fast: true });
    } else {
      renderSurfaceExpressionFromMapTuple("route-presentation-packet", { fast: true });
    }

    const accepted = Boolean(state.canvasSurfaceReady && routePacketLooksValid(packet));

    state.routePresentationPacketAccepted = accepted;
    state.canvasAcceptanceScanConfirmed = accepted;
    state.bilateralRouteCanvasScanConfirmed = Boolean(
      accepted && safeBool(packet && packet.routeActiveScanConfirmed, false)
    );

    if (accepted) {
      state.acceptanceCount += 1;
      state.routePresentationPacketAcceptedAt = nowIso();
      state.firstFailedCoordinate = "NONE_CANVAS_PRESENTATION_PLATTER_ACCEPTED";
      state.recommendedNextFile = state.downstreamSurfaceLatched ? POINTER_FINGER_INSPECT_FILE : HEX_SURFACE_FILE;
      state.recommendedNextAction = state.downstreamSurfaceLatched
        ? "AUDIT_POINTER_FINGER_INSPECT_SEQUENCE_AND_CANVAS_RETURN_EVIDENCE"
        : "SEND_CANONICAL_MAP_TUPLE_TO_HEX_SURFACE_AND_WAIT_FOR_RENDERABLE_SURFACE_RETURN";
      state.postgameStatus = state.downstreamSurfaceLatched
        ? "CANVAS_ACCEPTED_ROUTE_PACKET_RENDERABLE_SURFACE_LATCHED_FALLBACK_SUPPRESSED"
        : "CANVAS_ACCEPTED_ROUTE_PACKET_WAITING_RENDERABLE_SURFACE_RETURN";
    } else {
      state.rejectionCount += 1;
      state.firstFailedCoordinate = state.canvasSurfaceReady
        ? "ROUTE_PRESENTATION_PACKET_NOT_RECOGNIZED"
        : "CANONICAL_CANVAS_DOM_SURFACE_NOT_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_ROUTE_PRESENTATION_PACKET_OR_CANONICAL_CANVAS_DOM_SURFACE";
      state.postgameStatus = "CANVAS_PRESENTATION_PACKET_HELD";
    }

    const acceptance = composeAcceptancePacket(packet);

    publishPacketAliases(acceptance);
    updateDataset();
    publishReceiptAliases();

    record("CANVAS_ROUTE_PRESENTATION_PACKET_RECEIVED", {
      accepted,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      routePacketType: state.routePresentationPacketType,
      hexGatePacketAccepted: state.hexGatePacketAccepted,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed
    });

    return acceptance;
  }

  function applyControlPacket(packet = {}) {
    state.controlPacketCount += 1;
    state.controlPacketAccepted = true;
    state.controlPacketAcceptedAt = nowIso();
    state.lastControlPacket = clonePlain(packet);

    const viewState = normalizeViewState(packet);

    state.viewYaw = viewState.yaw;
    state.viewPitch = viewState.pitch;
    state.viewZoom = viewState.zoom;
    state.viewPhase = 0;

    ensureCanvasSurface("control-view-packet");

    const classification = classifyDownstreamSurfacePacket(packet);

    if (classification.renderable) {
      latchDownstreamSurface(packet, "CONTROL_PACKET_WITH_RENDERABLE_SURFACE_SIGNAL");
    } else {
      renderSurfaceExpressionFromMapTuple("control-view-packet", { fast: true });
    }

    updateDataset();
    publishReceiptAliases();

    return {
      packetType: "HEARTH_CANVAS_CONTROL_VIEW_PACKET_HEX_GATE_ACCEPTANCE_v12_5",
      accepted: true,
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      controlPacketType: safeString(packet.packetType || packet.type || CONTROL_PACKET_TYPE),
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasElementFound: state.canvasElementFound,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canonicalHexGateMapTupleBridgeActive: true,
      hexGatePacketSent: state.hexGatePacketSent,
      hexGatePacketAccepted: state.hexGatePacketAccepted,
      hexGateLastStatus: state.hexGateLastStatus,
      mapTupleId: state.mapTupleId,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
      renderableSurfaceLastStatus: state.renderableSurfaceLastStatus,
      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed,
      viewState: {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      },
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receiveDownstreamSurfacePacket(packet) {
    return latchDownstreamSurface(packet, "DOWNSTREAM_SURFACE_PACKET");
  }

  function consumeDownstreamSurfacePacket(packet) {
    return receiveDownstreamSurfacePacket(packet);
  }

  function receiveHexSurfacePacket(packet) {
    return latchDownstreamSurface(packet, "HEX_SURFACE_PACKET");
  }

  function consumeHexSurfacePacket(packet) {
    return receiveHexSurfacePacket(packet);
  }

  function receiveHexSurfaceFrame(packet) {
    return latchDownstreamSurface(packet, "HEX_SURFACE_FRAME");
  }

  function consumeHexSurfaceFrame(packet) {
    return receiveHexSurfaceFrame(packet);
  }

  function receivePointerFingerPacket(packet) {
    return latchDownstreamSurface(packet, "POINTER_FINGER_PACKET");
  }

  function consumePointerFingerPacket(packet) {
    return receivePointerFingerPacket(packet);
  }

  function receivePointerFingerSurface(packet) {
    return latchDownstreamSurface(packet, "POINTER_FINGER_SURFACE");
  }

  function consumePointerFingerSurface(packet) {
    return receivePointerFingerSurface(packet);
  }

  function receiveExpressionSurfacePacket(packet) {
    return latchDownstreamSurface(packet, "EXPRESSION_SURFACE_PACKET");
  }

  function consumeExpressionSurfacePacket(packet) {
    return receiveExpressionSurfacePacket(packet);
  }

  function receiveSurfaceFrame(packet) {
    return latchDownstreamSurface(packet, "SURFACE_FRAME");
  }

  function consumeSurfaceFrame(packet) {
    return receiveSurfaceFrame(packet);
  }

  function receiveVisibleSurfacePacket(packet) {
    return latchDownstreamSurface(packet, "VISIBLE_SURFACE_PACKET");
  }

  function consumeVisibleSurfacePacket(packet) {
    return receiveVisibleSurfacePacket(packet);
  }

  function consumeRoutePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receivePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveBilateralRouteCanvasPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeBilateralRouteCanvasPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRouteConductorPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRouteConductorPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRouteConductorPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRouteConductorPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveGovernedPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeGovernedPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveGovernedSourcePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeGovernedSourcePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveCanvasHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeCanvasHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRoutePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRoutePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveHexGateViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeHexGateViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlsHexGatePacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeControlsHexGatePacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveQueenHexGateViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeQueenHexGateViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function receivePlanetaryViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumePlanetaryViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveCanvasViewState(packet) {
    return applyControlPacket(packet);
  }

  function consumeCanvasViewState(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewState(packet) {
    return applyControlPacket(packet);
  }

  function setViewState(packet) {
    return applyControlPacket(packet);
  }

  function applyViewState(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlPacket(packet) {
    if (routePacketLooksValid(packet)) return receiveRoutePresentationPlatterPacket(packet);
    return applyControlPacket(packet);
  }

  function receiveControlViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlsPacket(packet) {
    return applyControlPacket(packet);
  }

  function receivePlanetaryControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewDelta(packet) {
    return applyControlPacket(packet);
  }

  function applyViewDelta(packet) {
    return applyControlPacket(packet);
  }

  function setView(packet) {
    return applyControlPacket(packet);
  }

  function updateView(packet) {
    return applyControlPacket(packet);
  }

  function composeReceipt() {
    return {
      packetType: "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_RECEIPT_PACKET_v12_5",
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: RENEWAL_CONTRACT,
      currentCanvasParentReceipt: RENEWAL_RECEIPT,
      currentCanvasParentRecognized: true,
      canvasParentContractRecognized: true,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageV1243Contract: LINEAGE_V12_4_3_CONTRACT,
      lineageV1242Contract: LINEAGE_V12_4_2_CONTRACT,
      lineageV1241Contract: LINEAGE_V12_4_1_CONTRACT,
      lineageV124Contract: LINEAGE_V12_4_CONTRACT,
      lineageV123Contract: LINEAGE_V12_3_CONTRACT,
      lineageV1232Contract: LINEAGE_V12_3_2_CONTRACT,
      lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
      lineageV122Contract: LINEAGE_V12_2_CONTRACT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      version: VERSION,

      route: ROUTE,
      file: FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "canvas-presentation-platter-canonical-hex-gate-map-tuple-bridge-authority",

      canvasPresentationPlatterAuthority: true,
      liveSurfaceIdentityActive: true,
      unifiedVisible2dOutputActive: true,
      zeroRectCanonicalSurfaceBindingRepairActive: true,
      canonicalSurfaceRectLockActive: true,
      concreteSurfaceFrameActive: true,
      downstreamSurfaceAdmissionActive: true,
      fallbackSuppressionActive: true,
      fallbackDemotedToPlaceholder: true,
      canonicalCanvasSelectionActive: true,
      temporaryCanvasDisambiguationActive: true,
      domSurfaceCreationAuthority: true,
      canvasAcceptanceScanAuthority: true,
      bilateralRouteCanvasAcceptanceActive: true,
      routeConductorPacketReceiverActive: true,
      controlsViewPacketReceiverActive: true,

      canonicalHexGateMapTupleBridgeActive: true,
      canvasHexGatePacketBridgeActive: true,
      renderableSurfaceReturnAdmissionActive: true,
      metadataOnlyLatchRejectionActive: true,
      canvasLocalMathTerminationSuppressed: true,
      downstreamRenderableExpressionDrawingActive: true,
      mapTupleSequencePreserved: true,

      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasOwnsPresentationSurface: true,
      canvasDoesNotOwnSourceTruth: true,
      canvasDoesNotOwnRouteAuthority: true,
      canvasDoesNotOwnControlsAuthority: true,
      canvasDoesNotOwnHexTruth: true,
      canvasDoesNotOwnPointerFingerTruth: true,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,

      controlObserved: state.controlObserved,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      surfaceExpressionObserved: state.surfaceExpressionObserved,
      surfaceExpressionSource: state.surfaceExpressionSource,
      surfaceExpressionContract: state.surfaceExpressionContract,
      pointerFingerObserved: state.pointerFingerObserved,
      pointerFingerContract: state.pointerFingerContract,

      canvasMountFound: state.mountFound,
      canvasMountCreated: state.mountCreated,
      canvasMountSelector: state.mountSelector,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasMountComputedVisible: state.mountComputedVisible,

      canvasFrameFound: state.frameFound,
      canvasFrameCreated: state.frameCreated,
      canvasFrameSelector: state.frameSelector,
      canvasFrameRectNonzero: state.frameRectNonzero,
      canvasFrameComputedVisible: state.frameComputedVisible,
      canvasFrameConcreteSize: state.frameConcreteSize,

      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasMovedIntoMount: state.canvasMovedIntoMount,
      canvasInMount: state.canvasInMount,
      canvasInFrame: state.canvasInFrame,
      canvasSelector: state.canvasSelector,
      canvasSelectionMode: state.canvasSelectionMode,
      canonicalCanvasId: state.canonicalCanvasId,
      canonicalMountId: state.canonicalMountId,
      canonicalFrameId: state.canonicalFrameId,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,

      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasNamespacePresent: true,
      canvasNamespaceMatchesDomSurface: state.canvasElementFound,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,

      zeroRectRepairAttempted: state.zeroRectRepairAttempted,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      zeroRectRepairReason: state.zeroRectRepairReason,
      rectLockAttempted: state.rectLockAttempted,
      rectLockApplied: state.rectLockApplied,
      rectLockReason: state.rectLockReason,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize,

      mapTupleId: state.mapTupleId,
      mapTupleVersion: state.mapTupleVersion,
      mapTupleSequence: state.mapTupleSequence,
      mapTupleLastComposedAt: state.mapTupleLastComposedAt,
      mapTupleLastReason: state.mapTupleLastReason,
      mapTupleLastWidth: state.mapTupleLastWidth,
      mapTupleLastHeight: state.mapTupleLastHeight,
      mapTupleLastResolution: state.mapTupleLastResolution,
      mapTupleLastYaw: state.mapTupleLastYaw,
      mapTupleLastPitch: state.mapTupleLastPitch,
      mapTupleLastZoom: state.mapTupleLastZoom,
      mapTupleLastPhase: state.mapTupleLastPhase,

      hexGatePacketComposed: state.hexGatePacketComposed,
      hexGatePacketSent: state.hexGatePacketSent,
      hexGatePacketAccepted: state.hexGatePacketAccepted,
      hexGatePacketRejected: state.hexGatePacketRejected,
      hexGateTransmissionCount: state.hexGateTransmissionCount,
      hexGateAcceptedCount: state.hexGateAcceptedCount,
      hexGateRejectedCount: state.hexGateRejectedCount,
      hexGateLastSentAt: state.hexGateLastSentAt,
      hexGateLastAcceptedAt: state.hexGateLastAcceptedAt,
      hexGateLastStatus: state.hexGateLastStatus,
      hexGateLastReason: state.hexGateLastReason,
      hexGateLastReceiver: state.hexGateLastReceiver,
      hexGateLastReceiptContract: state.hexGateLastReceiptContract,

      renderableSurfaceRequestCount: state.renderableSurfaceRequestCount,
      renderableSurfaceServedCount: state.renderableSurfaceServedCount,
      renderableSurfaceRejectedCount: state.renderableSurfaceRejectedCount,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
      renderableSurfaceRenderInProgress: state.renderableSurfaceRenderInProgress,
      renderableSurfaceLastRenderAt: state.renderableSurfaceLastRenderAt,
      renderableSurfaceLastResolution: state.renderableSurfaceLastResolution,
      renderableSurfaceLastSampleCount: state.renderableSurfaceLastSampleCount,
      renderableSurfaceLastDrawablePixels: state.renderableSurfaceLastDrawablePixels,
      renderableSurfaceLastLandPixels: state.renderableSurfaceLastLandPixels,
      renderableSurfaceLastWaterPixels: state.renderableSurfaceLastWaterPixels,
      renderableSurfaceLastStatus: state.renderableSurfaceLastStatus,
      renderableSurfaceLastReason: state.renderableSurfaceLastReason,

      downstreamSurfaceObserved: state.downstreamSurfaceObserved,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      downstreamSurfaceObservedAt: state.downstreamSurfaceObservedAt,
      downstreamSurfaceLastObservedAt: state.downstreamSurfaceLastObservedAt,
      downstreamSurfaceSource: state.downstreamSurfaceSource,
      downstreamSurfacePacketType: state.downstreamSurfacePacketType,
      downstreamSurfaceContract: state.downstreamSurfaceContract,
      downstreamSurfaceDrawableApplied: state.downstreamSurfaceDrawableApplied,
      downstreamSurfaceDrawableType: state.downstreamSurfaceDrawableType,
      downstreamSurfaceAdmissionCount: state.downstreamSurfaceAdmissionCount,
      downstreamSurfacePixelVisibleAfterAdmission: state.downstreamSurfacePixelVisibleAfterAdmission,
      downstreamSurfaceMetadataOnlyRejectedCount: state.downstreamSurfaceMetadataOnlyRejectedCount,
      downstreamSurfaceLastMetadataOnlyRejectedReason: state.downstreamSurfaceLastMetadataOnlyRejectedReason,

      localFallbackAllowed: state.localFallbackAllowed,
      localFallbackSuppressed: state.localFallbackSuppressed,
      localFallbackSuppressionReason: state.localFallbackSuppressionReason,
      localFallbackMode: state.localFallbackMode,
      localFallbackDrawAttemptCount: state.localFallbackDrawAttemptCount,
      localFallbackDrawSuppressedCount: state.localFallbackDrawSuppressedCount,
      localFallbackDrawCount: state.localFallbackDrawCount,
      localFallbackLastDrawAt: state.localFallbackLastDrawAt,
      localFallbackLastSuppressedAt: state.localFallbackLastSuppressedAt,

      canvasAcceptanceScanRequested: state.canvasAcceptanceScanRequested,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      routePresentationPacketAccepted: state.routePresentationPacketAccepted,
      routePresentationPacketAcceptedAt: state.routePresentationPacketAcceptedAt,
      routePresentationPacketSourceContract: state.routePresentationPacketSourceContract,
      routePresentationPacketType: state.routePresentationPacketType,

      controlPacketAccepted: state.controlPacketAccepted,
      controlPacketAcceptedAt: state.controlPacketAcceptedAt,
      controlPacketCount: state.controlPacketCount,

      viewState: {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      },

      renderCount: state.renderCount,
      packetCount: state.packetCount,
      acceptanceCount: state.acceptanceCount,
      rejectionCount: state.rejectionCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      resizeCount: state.resizeCount,
      surfaceEnsureCount: state.surfaceEnsureCount,
      surfaceScanCount: state.surfaceScanCount,
      booted: state.booted,
      disposed: state.disposed,
      latestEvent: state.latestEvent,
      errorCount: state.errors.length,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      supportsRoutePresentationPlatterPacket: true,
      supportsBilateralRouteCanvasScan: true,
      supportsCanvasAcceptanceScanReturn: true,
      supportsCanvasDomSurfaceCreation: true,
      supportsCanonicalVisibleCanvasSelection: true,
      supportsCanonicalSurfaceRectLock: true,
      supportsConcreteSurfaceFrame: true,
      supportsTemporaryCanvasDisambiguation: true,
      supportsZeroRectRepair: true,
      supportsVisible2dOutput: true,
      supportsControlsViewPackets: true,
      supportsPixelSampleSurfaceProof: true,
      supportsDownstreamSurfaceAdmission: true,
      supportsFallbackSuppression: true,
      supportsPlaceholderFallbackOnlyBeforeDownstream: true,
      supportsCanonicalHexGateMapTupleBridge: true,
      supportsCanvasHexGatePacketTransmission: true,
      supportsRenderableSurfaceReturnAdmission: true,
      supportsMetadataOnlyLatchRejection: true,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    observeNeighborAuthorities();
    ensureCanvasSurface("receipt-light");
    scanCanvasSurface({ repairIfZero: true });

    const receipt = composeReceipt();
    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function getReceipt() {
    observeNeighborAuthorities();
    ensureCanvasSurface("receipt");
    scanCanvasSurface({ repairIfZero: true });

    const receipt = {
      ...composeReceipt(),
      lastRoutePacket: clonePlain(state.lastRoutePacket),
      lastControlPacket: clonePlain(state.lastControlPacket),
      lastHexGatePacket: clonePlain(state.lastHexGatePacket),
      lastHexGateReceipt: clonePlain(state.lastHexGateReceipt),
      lastMapTuple: clonePlain(state.lastMapTuple),
      lastDownstreamPacket: clonePlain(state.lastDownstreamPacket),
      lastAcceptancePacket: clonePlain(state.lastAcceptancePacket),
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
      "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("renewalContract", RENEWAL_CONTRACT),
      line("renewalReceipt", RENEWAL_RECEIPT),
      line("internalRenewalContract", INTERNAL_RENEWAL_CONTRACT),
      line("internalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT),
      line("previousInternalRenewalContract", PREVIOUS_INTERNAL_RENEWAL_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "ROLE",
      line("canvasPresentationPlatterAuthority", true),
      line("domSurfaceCreationAuthority", true),
      line("canvasAcceptanceScanAuthority", true),
      line("zeroRectCanonicalSurfaceBindingRepairActive", true),
      line("canonicalSurfaceRectLockActive", true),
      line("concreteSurfaceFrameActive", true),
      line("canonicalHexGateMapTupleBridgeActive", true),
      line("canvasHexGatePacketBridgeActive", true),
      line("renderableSurfaceReturnAdmissionActive", true),
      line("metadataOnlyLatchRejectionActive", true),
      line("canvasLocalMathTerminationSuppressed", true),
      "",
      "CANONICAL_SURFACE",
      line("canvasSelectionMode", r.canvasSelectionMode),
      line("canonicalCanvasId", r.canonicalCanvasId),
      line("canonicalMountId", r.canonicalMountId),
      line("canonicalFrameId", r.canonicalFrameId),
      line("nonCanonicalCanvasCount", r.nonCanonicalCanvasCount),
      line("temporaryCanvasIgnoredCount", r.temporaryCanvasIgnoredCount),
      "",
      "SURFACE",
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountRectNonzero", r.canvasMountRectNonzero),
      line("canvasFrameFound", r.canvasFrameFound),
      line("canvasFrameRectNonzero", r.canvasFrameRectNonzero),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasInFrame", r.canvasInFrame),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasSurfaceReady", r.canvasSurfaceReady),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      "",
      "HEX_GATE_MAP_TUPLE",
      line("mapTupleId", r.mapTupleId),
      line("mapTupleVersion", r.mapTupleVersion),
      line("mapTupleSequence", r.mapTupleSequence),
      line("hexGatePacketComposed", r.hexGatePacketComposed),
      line("hexGatePacketSent", r.hexGatePacketSent),
      line("hexGatePacketAccepted", r.hexGatePacketAccepted),
      line("hexGateLastStatus", r.hexGateLastStatus),
      line("hexGateLastReason", r.hexGateLastReason),
      line("hexGateLastReceiver", r.hexGateLastReceiver),
      "",
      "RENDERABLE_RETURN",
      line("renderableSurfaceRequestCount", r.renderableSurfaceRequestCount),
      line("renderableSurfaceServedCount", r.renderableSurfaceServedCount),
      line("renderableSurfaceRejectedCount", r.renderableSurfaceRejectedCount),
      line("renderableSurfaceRenderCount", r.renderableSurfaceRenderCount),
      line("renderableSurfaceLastResolution", r.renderableSurfaceLastResolution),
      line("renderableSurfaceLastSampleCount", r.renderableSurfaceLastSampleCount),
      line("renderableSurfaceLastDrawablePixels", r.renderableSurfaceLastDrawablePixels),
      line("renderableSurfaceLastLandPixels", r.renderableSurfaceLastLandPixels),
      line("renderableSurfaceLastWaterPixels", r.renderableSurfaceLastWaterPixels),
      line("renderableSurfaceLastStatus", r.renderableSurfaceLastStatus),
      line("renderableSurfaceLastReason", r.renderableSurfaceLastReason),
      "",
      "DOWNSTREAM_SURFACE",
      line("downstreamSurfaceObserved", r.downstreamSurfaceObserved),
      line("downstreamSurfaceLatched", r.downstreamSurfaceLatched),
      line("downstreamSurfaceSource", r.downstreamSurfaceSource),
      line("downstreamSurfacePacketType", r.downstreamSurfacePacketType),
      line("downstreamSurfaceContract", r.downstreamSurfaceContract),
      line("downstreamSurfaceDrawableApplied", r.downstreamSurfaceDrawableApplied),
      line("downstreamSurfaceAdmissionCount", r.downstreamSurfaceAdmissionCount),
      line("downstreamSurfaceMetadataOnlyRejectedCount", r.downstreamSurfaceMetadataOnlyRejectedCount),
      "",
      "LOCAL_FALLBACK",
      line("localFallbackMode", r.localFallbackMode),
      line("localFallbackAllowed", r.localFallbackAllowed),
      line("localFallbackSuppressed", r.localFallbackSuppressed),
      line("localFallbackSuppressionReason", r.localFallbackSuppressionReason),
      line("localFallbackDrawAttemptCount", r.localFallbackDrawAttemptCount),
      line("localFallbackDrawSuppressedCount", r.localFallbackDrawSuppressedCount),
      line("localFallbackDrawCount", r.localFallbackDrawCount),
      "",
      "ZERO_RECT_REPAIR",
      line("zeroRectRepairAttempted", r.zeroRectRepairAttempted),
      line("zeroRectRepairApplied", r.zeroRectRepairApplied),
      line("zeroRectRepairReason", r.zeroRectRepairReason),
      line("rectLockAttempted", r.rectLockAttempted),
      line("rectLockApplied", r.rectLockApplied),
      line("rectLockReason", r.rectLockReason),
      line("concreteFallbackSizeApplied", r.concreteFallbackSizeApplied),
      line("concreteFallbackCssSize", r.concreteFallbackCssSize),
      "",
      "BILATERAL_ACCEPTANCE",
      line("canvasAcceptanceScanRequested", r.canvasAcceptanceScanRequested),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("routePresentationPacketAccepted", r.routePresentationPacketAccepted),
      "",
      "NEIGHBORS",
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("controlObserved", r.controlObserved),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("surfaceExpressionObserved", r.surfaceExpressionObserved),
      line("pointerFingerObserved", r.pointerFingerObserved),
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
      "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("internalRenewalContract", r.internalRenewalContract),
      line("canvasSelectionMode", r.canvasSelectionMode),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasFrameFound", r.canvasFrameFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasSurfaceReady", r.canvasSurfaceReady),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("mapTupleId", r.mapTupleId),
      line("hexGatePacketSent", r.hexGatePacketSent),
      line("hexGatePacketAccepted", r.hexGatePacketAccepted),
      line("hexGateLastStatus", r.hexGateLastStatus),
      line("renderableSurfaceRenderCount", r.renderableSurfaceRenderCount),
      line("renderableSurfaceLastStatus", r.renderableSurfaceLastStatus),
      line("downstreamSurfaceObserved", r.downstreamSurfaceObserved),
      line("downstreamSurfaceLatched", r.downstreamSurfaceLatched),
      line("downstreamSurfaceMetadataOnlyRejectedCount", r.downstreamSurfaceMetadataOnlyRejectedCount),
      line("localFallbackAllowed", r.localFallbackAllowed),
      line("localFallbackSuppressed", r.localFallbackSuppressed),
      line("localFallbackSuppressionReason", r.localFallbackSuppressionReason),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("zeroRectRepairApplied", r.zeroRectRepairApplied),
      line("rectLockApplied", r.rectLockApplied),
      line("concreteFallbackCssSize", r.concreteFallbackCssSize),
      line("temporaryCanvasIgnoredCount", r.temporaryCanvasIgnoredCount),
      line("routePresentationPacketAccepted", r.routePresentationPacketAccepted),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      canvasElement: canvasElement ? describeElement(canvasElement) : "NONE",
      frameElement: frameElement ? describeElement(frameElement) : "NONE",
      mountElement: mountElement ? describeElement(mountElement) : "NONE"
    };
  }

  function getCanvasSurfaceReceipt() {
    return getReceiptLight();
  }

  function getCanvasSurfaceSummary() {
    return getReceiptLight();
  }

  function getPresentationReceipt() {
    return getReceiptLight();
  }

  function getPresentationPlatterReceipt() {
    return getReceiptLight();
  }

  function getCanvasStationReceiptLight() {
    return getReceiptLight();
  }

  function getCanvasStationReceipt() {
    return getReceipt();
  }

  function getCanvasStationSummary() {
    return getReceiptLight();
  }

  function getExpressionHubReceipt() {
    return getReceiptLight();
  }

  function getVisiblePlanetReceipt() {
    return getReceiptLight();
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasPreviousInternalRenewalContract", PREVIOUS_INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasPreviousInternalRenewalReceipt", PREVIOUS_INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasCurrentParentContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasParentContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasParentReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasPresentationPlatterAuthority", "true");
    setDataset("hearthCanvasLiveSurfaceIdentityActive", "true");
    setDataset("hearthCanvasUnifiedVisible2dOutputActive", "true");
    setDataset("hearthCanvasZeroRectCanonicalSurfaceBindingRepairActive", "true");
    setDataset("hearthCanvasCanonicalSurfaceRectLockActive", "true");
    setDataset("hearthCanvasConcreteSurfaceFrameActive", "true");
    setDataset("hearthCanvasDownstreamSurfaceAdmissionActive", "true");
    setDataset("hearthCanvasFallbackSuppressionActive", "true");
    setDataset("hearthCanvasFallbackDemotedToPlaceholder", "true");
    setDataset("hearthCanvasCanonicalCanvasSelectionActive", "true");
    setDataset("hearthCanvasTemporaryCanvasDisambiguationActive", "true");
    setDataset("hearthCanvasDomSurfaceCreationAuthority", "true");
    setDataset("hearthCanvasAcceptanceScanAuthority", "true");
    setDataset("hearthCanvasBilateralRouteCanvasAcceptanceActive", "true");

    setDataset("hearthCanvasCanonicalHexGateMapTupleBridgeActive", "true");
    setDataset("hearthCanvasHexGatePacketBridgeActive", "true");
    setDataset("hearthCanvasRenderableSurfaceReturnAdmissionActive", "true");
    setDataset("hearthCanvasMetadataOnlyLatchRejectionActive", "true");
    setDataset("hearthCanvasLocalMathTerminationSuppressed", "true");
    setDataset("hearthCanvasDownstreamRenderableExpressionDrawingActive", "true");
    setDataset("hearthCanvasMapTupleSequencePreserved", "true");

    setDataset("hearthCanvasSelectionMode", state.canvasSelectionMode);
    setDataset("hearthCanvasCanonicalCanvasId", state.canonicalCanvasId);
    setDataset("hearthCanvasCanonicalMountId", state.canonicalMountId);
    setDataset("hearthCanvasCanonicalFrameId", state.canonicalFrameId);
    setDataset("hearthCanvasNonCanonicalCanvasCount", String(state.nonCanonicalCanvasCount));
    setDataset("hearthCanvasTemporaryCanvasIgnoredCount", String(state.temporaryCanvasIgnoredCount));

    setDataset("hearthCanvasMountFound", String(state.mountFound));
    setDataset("hearthCanvasMountCreated", String(state.mountCreated));
    setDataset("hearthCanvasMountSelector", state.mountSelector);
    setDataset("hearthCanvasMountRectNonzero", String(state.mountRectNonzero));
    setDataset("hearthCanvasFrameFound", String(state.frameFound));
    setDataset("hearthCanvasFrameCreated", String(state.frameCreated));
    setDataset("hearthCanvasFrameSelector", state.frameSelector);
    setDataset("hearthCanvasFrameRectNonzero", String(state.frameRectNonzero));
    setDataset("hearthCanvasFrameConcreteSize", state.frameConcreteSize);

    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasMovedIntoMount", String(state.canvasMovedIntoMount));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasInFrame", String(state.canvasInFrame));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasSurfaceReady", String(state.canvasSurfaceReady));
    setDataset("hearthCanvasNamespacePresent", "true");
    setDataset("hearthCanvasNamespaceMatchesDomSurface", String(state.canvasElementFound));
    setDataset("hearthVisibleSurfacePermissionGranted", String(state.visibleSurfacePermissionGranted));

    setDataset("hearthCanvasZeroRectRepairAttempted", String(state.zeroRectRepairAttempted));
    setDataset("hearthCanvasZeroRectRepairApplied", String(state.zeroRectRepairApplied));
    setDataset("hearthCanvasZeroRectRepairReason", state.zeroRectRepairReason);
    setDataset("hearthCanvasRectLockAttempted", String(state.rectLockAttempted));
    setDataset("hearthCanvasRectLockApplied", String(state.rectLockApplied));
    setDataset("hearthCanvasRectLockReason", state.rectLockReason);
    setDataset("hearthCanvasConcreteFallbackSizeApplied", String(state.concreteFallbackSizeApplied));
    setDataset("hearthCanvasConcreteFallbackCssSize", state.concreteFallbackCssSize);

    setDataset("hearthCanvasMapTupleId", state.mapTupleId);
    setDataset("hearthCanvasMapTupleVersion", state.mapTupleVersion);
    setDataset("hearthCanvasMapTupleSequence", String(state.mapTupleSequence));
    setDataset("hearthCanvasMapTupleLastComposedAt", state.mapTupleLastComposedAt);
    setDataset("hearthCanvasMapTupleLastReason", state.mapTupleLastReason);
    setDataset("hearthCanvasMapTupleLastResolution", String(state.mapTupleLastResolution));

    setDataset("hearthCanvasHexGatePacketComposed", String(state.hexGatePacketComposed));
    setDataset("hearthCanvasHexGatePacketSent", String(state.hexGatePacketSent));
    setDataset("hearthCanvasHexGatePacketAccepted", String(state.hexGatePacketAccepted));
    setDataset("hearthCanvasHexGatePacketRejected", String(state.hexGatePacketRejected));
    setDataset("hearthCanvasHexGateTransmissionCount", String(state.hexGateTransmissionCount));
    setDataset("hearthCanvasHexGateAcceptedCount", String(state.hexGateAcceptedCount));
    setDataset("hearthCanvasHexGateRejectedCount", String(state.hexGateRejectedCount));
    setDataset("hearthCanvasHexGateLastStatus", state.hexGateLastStatus);
    setDataset("hearthCanvasHexGateLastReason", state.hexGateLastReason);
    setDataset("hearthCanvasHexGateLastReceiver", state.hexGateLastReceiver);

    setDataset("hearthCanvasRenderableSurfaceRequestCount", String(state.renderableSurfaceRequestCount));
    setDataset("hearthCanvasRenderableSurfaceServedCount", String(state.renderableSurfaceServedCount));
    setDataset("hearthCanvasRenderableSurfaceRejectedCount", String(state.renderableSurfaceRejectedCount));
    setDataset("hearthCanvasRenderableSurfaceRenderCount", String(state.renderableSurfaceRenderCount));
    setDataset("hearthCanvasRenderableSurfaceLastResolution", String(state.renderableSurfaceLastResolution));
    setDataset("hearthCanvasRenderableSurfaceLastSampleCount", String(state.renderableSurfaceLastSampleCount));
    setDataset("hearthCanvasRenderableSurfaceLastDrawablePixels", String(state.renderableSurfaceLastDrawablePixels));
    setDataset("hearthCanvasRenderableSurfaceLastLandPixels", String(state.renderableSurfaceLastLandPixels));
    setDataset("hearthCanvasRenderableSurfaceLastWaterPixels", String(state.renderableSurfaceLastWaterPixels));
    setDataset("hearthCanvasRenderableSurfaceLastStatus", state.renderableSurfaceLastStatus);
    setDataset("hearthCanvasRenderableSurfaceLastReason", state.renderableSurfaceLastReason);

    setDataset("hearthCanvasDownstreamSurfaceObserved", String(state.downstreamSurfaceObserved));
    setDataset("hearthCanvasDownstreamSurfaceLatched", String(state.downstreamSurfaceLatched));
    setDataset("hearthCanvasDownstreamSurfaceSource", state.downstreamSurfaceSource);
    setDataset("hearthCanvasDownstreamSurfacePacketType", state.downstreamSurfacePacketType);
    setDataset("hearthCanvasDownstreamSurfaceContract", state.downstreamSurfaceContract);
    setDataset("hearthCanvasDownstreamSurfaceDrawableApplied", String(state.downstreamSurfaceDrawableApplied));
    setDataset("hearthCanvasDownstreamSurfaceAdmissionCount", String(state.downstreamSurfaceAdmissionCount));
    setDataset("hearthCanvasDownstreamSurfaceMetadataOnlyRejectedCount", String(state.downstreamSurfaceMetadataOnlyRejectedCount));
    setDataset("hearthCanvasDownstreamSurfaceLastMetadataOnlyRejectedReason", state.downstreamSurfaceLastMetadataOnlyRejectedReason);

    setDataset("hearthCanvasLocalFallbackAllowed", String(state.localFallbackAllowed));
    setDataset("hearthCanvasLocalFallbackSuppressed", String(state.localFallbackSuppressed));
    setDataset("hearthCanvasLocalFallbackSuppressionReason", state.localFallbackSuppressionReason);
    setDataset("hearthCanvasLocalFallbackMode", state.localFallbackMode);
    setDataset("hearthCanvasLocalFallbackDrawCount", String(state.localFallbackDrawCount));
    setDataset("hearthCanvasLocalFallbackDrawSuppressedCount", String(state.localFallbackDrawSuppressedCount));

    setDataset("hearthCanvasAcceptanceScanRequested", String(state.canvasAcceptanceScanRequested));
    setDataset("hearthCanvasAcceptanceScanConfirmed", String(state.canvasAcceptanceScanConfirmed));
    setDataset("hearthBilateralRouteCanvasScanConfirmed", String(state.bilateralRouteCanvasScanConfirmed));
    setDataset("hearthRoutePresentationPacketAccepted", String(state.routePresentationPacketAccepted));

    setDataset("hearthCanvasRenderCount", String(state.renderCount));
    setDataset("hearthCanvasPacketCount", String(state.packetCount));
    setDataset("hearthCanvasControlPacketCount", String(state.controlPacketCount));
    setDataset("hearthCanvasSurfaceEnsureCount", String(state.surfaceEnsureCount));
    setDataset("hearthCanvasSurfaceScanCount", String(state.surfaceScanCount));

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasOwnsDomSurface", "true");
    setDataset("hearthCanvasOwnsCanvasDrawing", "true");
    setDataset("hearthCanvasDoesNotOwnSourceTruth", "true");
    setDataset("hearthCanvasDoesNotOwnRouteAuthority", "true");
    setDataset("hearthCanvasDoesNotOwnControlsAuthority", "true");
    setDataset("hearthCanvasDoesNotOwnHexTruth", "true");
    setDataset("hearthCanvasDoesNotOwnPointerFingerTruth", "true");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("hearthCanvasFinalVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const paths = [
      "HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN",
      "HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION",
      "HEARTH_CANVAS_HUB_DOWNSTREAM_SURFACE_ADMISSION_FALLBACK_SUPPRESSION",
      "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR",
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
      "HEARTH.canvasHubCanonicalHexGateMapTupleBridgeAndRenderableSurfaceReturn",
      "HEARTH.canvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppression",
      "HEARTH.canvasHubDownstreamSurfaceAdmissionFallbackSuppression",
      "HEARTH.canvasHubZeroRectCanonicalSurfaceBindingRepair",
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
      "DEXTER_LAB.hearthCanvasHubCanonicalHexGateMapTupleBridgeAndRenderableSurfaceReturn",
      "DEXTER_LAB.hearthCanvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppression",
      "DEXTER_LAB.hearthCanvasHubDownstreamSurfaceAdmissionFallbackSuppression",
      "DEXTER_LAB.hearthCanvasHubZeroRectCanonicalSurfaceBindingRepair",
      "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasAuthority",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasVisiblePlanet"
    ];

    for (const path of paths) setPath(path, api);

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = composeReceipt();

    state.receiptPublishCount += 1;
    state.lastReceipt = clonePlain(receipt);

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_AND_RENDERABLE_SURFACE_RETURN_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_CANONICAL_SURFACE_RECT_LOCK_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_DOWNSTREAM_SURFACE_ADMISSION_FALLBACK_SUPPRESSION_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_REPORT = receipt;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasHubCanonicalHexGateMapTupleBridgeAndRenderableSurfaceReturnReceipt = receipt;
    hearth.canvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppressionReceipt = receipt;
    hearth.canvasHubDownstreamSurfaceAdmissionFallbackSuppressionReceipt = receipt;
    hearth.canvasHubZeroRectCanonicalSurfaceBindingRepairReceipt = receipt;
    hearth.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasReport = receipt;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasHubCanonicalHexGateMapTupleBridgeAndRenderableSurfaceReturnReceipt = receipt;
    lab.hearthCanvasHubCanonicalSurfaceRectLockAndDownstreamFallbackSuppressionReceipt = receipt;
    lab.hearthCanvasHubDownstreamSurfaceAdmissionFallbackSuppressionReceipt = receipt;
    lab.hearthCanvasHubZeroRectCanonicalSurfaceBindingRepairReceipt = receipt;
    lab.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    lab.hearthCanvasReport = receipt;

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

    record("CANVAS_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      hexGatePacketAccepted: state.hexGatePacketAccepted,
      mapTupleId: state.mapTupleId,
      renderableSurfaceRenderCount: state.renderableSurfaceRenderCount,
      downstreamSurfaceLatched: state.downstreamSurfaceLatched,
      localFallbackSuppressed: state.localFallbackSuppressed,
      rectLockApplied: state.rectLockApplied,
      visualPassClaimed: false
    });

    return true;
  }

  function refresh() {
    observeNeighborAuthorities();
    ensureCanvasSurface("refresh");
    scanCanvasSurface({ repairIfZero: true });

    if (!state.downstreamSurfaceLatched) {
      renderSurfaceExpressionFromMapTuple("refresh", { fast: true });
    }

    if (!state.downstreamSurfaceLatched && !state.canvasPixelVisible) {
      scheduleLocalFallback("refresh-no-renderable-surface-no-pixels");
    }

    updateDataset();
    publishReceiptAliases();
    return getReceiptLight();
  }

  function mount() {
    return refresh();
  }

  function render() {
    ensureCanvasSurface("render");

    if (state.downstreamSurfaceLatched || state.downstreamSurfaceObserved) {
      suppressLocalFallback("RENDER_CALLED_AFTER_RENDERABLE_SURFACE_LATCH");
      renderSurfaceExpressionFromMapTuple("render-preserve-renderable", { fast: true });
    } else {
      renderSurfaceExpressionFromMapTuple("render", { fast: true });
    }

    if (!state.downstreamSurfaceLatched && !state.canvasPixelVisible) {
      scheduleLocalFallback("render-no-renderable-surface-no-pixels");
    }

    updateDataset();
    publishReceiptAliases();
    return getReceiptLight();
  }

  function drawFrame(packet) {
    if (packet && classifyDownstreamSurfacePacket(packet).renderable) {
      return receiveSurfaceFrame(packet);
    }

    return render();
  }

  function drawVisibleExpression(packet) {
    if (packet && classifyDownstreamSurfacePacket(packet).renderable) {
      return receiveExpressionSurfacePacket(packet);
    }

    return render();
  }

  function boot() {
    if (state.booting) return getReceiptLight();

    if (state.booted) {
      ensureCanvasSurface("boot-already-complete");
      publishGlobals("boot-already-complete");
      return getReceiptLight();
    }

    state.booting = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.postgameStatus = "CANVAS_BOOTING_CANONICAL_HEX_GATE_MAP_TUPLE_BRIDGE_RENDERABLE_SURFACE_RETURN";

    try {
      publishApiAliases();
      observeNeighborAuthorities();
      ensureCanvasSurface("boot");
      scanCanvasSurface({ repairIfZero: true });

      state.booted = true;
      state.booting = false;
      state.updatedAt = nowIso();

      state.firstFailedCoordinate = state.canvasSurfaceReady
        ? "NONE_CANVAS_BOOTED_CANONICAL_DOM_SURFACE_READY"
        : state.firstFailedCoordinate;
      state.recommendedNextFile = state.canvasSurfaceReady ? HEX_SURFACE_FILE : FILE;
      state.recommendedNextAction = state.canvasSurfaceReady
        ? "SEND_CANONICAL_MAP_TUPLE_TO_HEX_SURFACE"
        : state.recommendedNextAction;
      state.postgameStatus = state.canvasSurfaceReady
        ? "CANVAS_BOOTED_CANONICAL_SURFACE_RECT_LOCKED_HEX_GATE_MAP_TUPLE_BRIDGE_READY"
        : state.postgameStatus;

      renderSurfaceExpressionFromMapTuple("boot", { fast: true });

      if (!state.downstreamSurfaceLatched && !state.canvasPixelVisible) {
        scheduleLocalFallback("boot-delayed-placeholder");
      }

      publishGlobals("boot-complete");

      if (root.addEventListener) {
        root.addEventListener("resize", () => {
          if (resizeRaf && root.cancelAnimationFrame) root.cancelAnimationFrame(resizeRaf);

          const callback = () => {
            resizeRaf = 0;

            ensureCanvasSurface("resize");
            scanCanvasSurface({ repairIfZero: true });
            renderSurfaceExpressionFromMapTuple("resize", { fast: true });
            updateDataset();
            publishReceiptAliases();
          };

          resizeRaf = root.requestAnimationFrame
            ? root.requestAnimationFrame(callback)
            : root.setTimeout(callback, 33);
        }, { passive: true });
      }

      return getReceipt();
    } catch (error) {
      state.booting = false;
      recordError("CANVAS_BOOT_FAILED", error);
      updateDataset();
      publishReceiptAliases();
      return getReceipt();
    }
  }

  function start() {
    return boot();
  }

  function init() {
    return boot();
  }

  function run() {
    return boot();
  }

  function dispose(reason = "manual-dispose") {
    clearFallbackTimer();
    state.disposed = true;
    state.postgameStatus = "CANVAS_DISPOSED";
    record("CANVAS_DISPOSED", { reason });
    updateDataset();
    publishReceiptAliases();
    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    canvasContract: CONTRACT,
    canvasReceipt: RECEIPT,
    currentCanvasParentContract: RENEWAL_CONTRACT,
    currentCanvasParentReceipt: RENEWAL_RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalMountId: CANONICAL_MOUNT_ID,
    canonicalFrameId: CANONICAL_FRAME_ID,
    canvasSelectionMode: "CANONICAL_MOUNT_RECT_LOCK_VISIBLE_2D_SURFACE",

    canvasPresentationPlatterAuthority: true,
    liveSurfaceIdentityActive: true,
    unifiedVisible2dOutputActive: true,
    zeroRectCanonicalSurfaceBindingRepairActive: true,
    canonicalSurfaceRectLockActive: true,
    concreteSurfaceFrameActive: true,
    downstreamSurfaceAdmissionActive: true,
    fallbackSuppressionActive: true,
    fallbackDemotedToPlaceholder: true,
    canonicalCanvasSelectionActive: true,
    temporaryCanvasDisambiguationActive: true,
    domSurfaceCreationAuthority: true,
    canvasAcceptanceScanAuthority: true,
    bilateralRouteCanvasAcceptanceActive: true,
    routeConductorPacketReceiverActive: true,
    controlsViewPacketReceiverActive: true,
    canonicalHexGateMapTupleBridgeActive: true,
    canvasHexGatePacketBridgeActive: true,
    renderableSurfaceReturnAdmissionActive: true,
    metadataOnlyLatchRejectionActive: true,
    canvasLocalMathTerminationSuppressed: true,

    boot,
    start,
    init,
    run,
    refresh,
    mount,
    render,
    drawFrame,
    drawVisibleExpression,
    dispose,

    ensureCanvasSurface,
    scanCanvasSurface,
    drawPlanetSurface: drawLocalFallbackSurface,
    drawLocalFallbackSurface,
    scheduleLocalFallback,
    suppressLocalFallback,
    releaseLocalFallback,

    composeMapTuple,
    composeCanvasHexGatePacket,
    sendCanvasHexGatePacket,
    renderSurfaceExpressionFromMapTuple,
    requestHexGateRender: renderSurfaceExpressionFromMapTuple,
    requestRenderableSurfaceReturn: renderSurfaceExpressionFromMapTuple,

    receiveDownstreamSurfacePacket,
    consumeDownstreamSurfacePacket,
    receiveHexSurfacePacket,
    consumeHexSurfacePacket,
    receiveHexSurfaceFrame,
    consumeHexSurfaceFrame,
    receivePointerFingerPacket,
    consumePointerFingerPacket,
    receivePointerFingerSurface,
    consumePointerFingerSurface,
    receiveExpressionSurfacePacket,
    consumeExpressionSurfacePacket,
    receiveSurfaceFrame,
    consumeSurfaceFrame,
    receiveVisibleSurfacePacket,
    consumeVisibleSurfacePacket,

    receiveRoutePresentationPlatterPacket,
    consumeRoutePresentationPlatterPacket,
    receivePresentationPlatterPacket,
    consumePresentationPlatterPacket,
    receiveBilateralRouteCanvasPacket,
    consumeBilateralRouteCanvasPacket,
    receiveRouteConductorPresentationPacket,
    consumeRouteConductorPresentationPacket,
    receiveRouteConductorPacket,
    consumeRouteConductorPacket,
    receiveGovernedPresentationPacket,
    consumeGovernedPresentationPacket,
    receiveGovernedSourcePacket,
    consumeGovernedSourcePacket,
    receiveCanvasHandoffPacket,
    consumeCanvasHandoffPacket,
    receiveHandoffPacket,
    consumeHandoffPacket,
    receiveRoutePacket,
    consumeRoutePacket,

    receiveHexGateViewControlPacket,
    consumeHexGateViewControlPacket,
    receiveControlsHexGatePacket,
    consumeControlsHexGatePacket,
    receiveQueenHexGateViewPacket,
    consumeQueenHexGateViewPacket,
    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveCanvasViewState,
    consumeCanvasViewState,
    receiveViewState,
    setViewState,
    applyViewState,
    receiveControlPacket,
    receiveControlViewPacket,
    receiveControlsPacket,
    receivePlanetaryControlPacket,
    receiveViewDelta,
    applyViewDelta,
    setView,
    updateView,

    composeAcceptancePacket,
    getReceipt,
    getReceiptLight,
    getCanvasSurfaceReceipt,
    getCanvasSurfaceSummary,
    getPresentationReceipt,
    getPresentationPlatterReceipt,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getCanvasStationSummary,
    getExpressionHubReceipt,
    getVisiblePlanetReceipt,
    getReceiptText,
    getStatusText,
    getState,

    publishApiAliases,
    publishGlobals,
    publishReceiptAliases,
    updateDataset,

    supportsRoutePresentationPlatterPacket: true,
    supportsBilateralRouteCanvasScan: true,
    supportsCanvasAcceptanceScanReturn: true,
    supportsCanvasDomSurfaceCreation: true,
    supportsCanonicalVisibleCanvasSelection: true,
    supportsCanonicalSurfaceRectLock: true,
    supportsConcreteSurfaceFrame: true,
    supportsTemporaryCanvasDisambiguation: true,
    supportsZeroRectRepair: true,
    supportsVisible2dOutput: true,
    supportsControlsViewPackets: true,
    supportsPixelSampleSurfaceProof: true,
    supportsDownstreamSurfaceAdmission: true,
    supportsFallbackSuppression: true,
    supportsPlaceholderFallbackOnlyBeforeDownstream: true,
    supportsCanonicalHexGateMapTupleBridge: true,
    supportsCanvasHexGatePacketTransmission: true,
    supportsRenderableSurfaceReturnAdmission: true,
    supportsMetadataOnlyLatchRejection: true,

    ownsCanvasDomSurface: true,
    ownsCanvasDrawing: true,
    ownsPresentationSurface: true,
    ownsSourceTruth: false,
    ownsRouteAuthority: false,
    ownsControlsAuthority: false,
    ownsHexTruth: false,
    ownsPointerFingerTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

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
    recordError("CANVAS_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
