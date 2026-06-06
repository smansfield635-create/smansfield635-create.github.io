// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_TNT_v5
// Full-file replacement.
// Hex Surface Renderer / paired spherical projection + Surface Pointer Bishop expression consumer.
// Previous:
// HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4
// Purpose:
// - Preserve the v4 Hex Surface Renderer public API.
// - Preserve paired Canvas/Hex motion path:
//   1. drawPairFrame(packet, options)
//   2. drawInteractiveFrame(packet, options)
//   3. drawSettledFrame(packet, options)
// - Preserve yaw, pitch, zoom, and phase inside spherical projection.
// - Prevent flat bitmap sliding by never translating an already-rendered planet image as motion response.
// - Consume Hex Four-Pair Authority only as the projection/addressing anchor.
// - Consume Surface Pointer Bishop / Canvas Finger Surface as the surface-expression authority.
// - Remove the internal terrain/water fallback planet construct from Hex Surface.
// - Render only from received surface-expression packets.
// - When surface authority is absent, return a transparent/error-safe miss receipt instead of constructing a backup planet.
// - Preserve renderer-only ownership: projection, frame drawing, canvas pixel output, receipts.
// Does not own:
// - Canvas Hub
// - Hex Four-Pair Authority
// - Surface Pointer Bishop
// - Canvas Finger Surface
// - Composite
// - land truth
// - water truth
// - air truth
// - hydrology
// - elevation
// - materials
// - atmosphere truth
// - lighting truth
// - canvas mounting
// - runtime motion
// - controls
// - route orchestration
// - diagnostic rail
// - F13
// - F21
// - ready text
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_TNT_v5";
  const RECEIPT = "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_RECEIPT_v5";

  const PREVIOUS_CONTRACT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const PREVIOUS_RECEIPT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT_v4";
  const LINEAGE_V3_CONTRACT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_TNT_v3";
  const LINEAGE_V3_RECEIPT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT_v3";
  const LINEAGE_V2_CONTRACT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const LINEAGE_V2_RECEIPT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_RECEIPT_v2";
  const BASELINE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-06.hearth-hex-surface-pointer-bishop-expression-consumer-renderer-v5";

  const REQUIRED_HEX_AUTHORITY_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const REQUIRED_HEX_AUTHORITY_RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const REQUIRED_HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const SURFACE_AUTHORITY_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const REQUIRED_SURFACE_AUTHORITY_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5";
  const ACCEPTED_SURFACE_AUTHORITY_CONTRACTS = Object.freeze([
    REQUIRED_SURFACE_AUTHORITY_CONTRACT,
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2",
    "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1"
  ]);

  const CANVAS_HUB_FILE = "/assets/hearth/hearth.canvas.js";
  const CURRENT_CANVAS_PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    CURRENT_CANVAS_PUBLIC_CONTRACT,
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6"
  ]);

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByHexSurface: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByHexSurface: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const DEFAULTS = Object.freeze({
    radiusRatio: 0.456,
    axialTilt: -0.22,
    yaw: 0,
    pitch: 0,
    zoom: 1,
    phase: 0,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4,
    interactiveMaxSide: 390,
    settledMaxSide: 720,
    interactiveHexDensity: 132,
    settledHexDensity: 226,
    interactiveAuthoritySampleLimit: 1300,
    settledAuthoritySampleLimit: 5400,
    hexEdgeStrength: 0.045,
    atmosphereStrength: 0.82,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84
  });

  const MISSING_COLOR = Object.freeze([0, 0, 0, 0]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV3Receipt: LINEAGE_V3_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    planetId: PLANET_ID,
    planetLabel: PLANET_LABEL,
    role: "hex-surface-pointer-bishop-expression-consumer-renderer",

    rendererLoaded: true,
    rendererActive: true,
    apiReady: true,

    pairRendererActive: true,
    sphericalProjectionActive: true,
    flatBitmapSlidingRejected: true,
    interactiveSphereRecomputationActive: true,
    settledSphereRecomputationActive: true,
    pairedCanvasHandshakeReady: true,

    internalFallbackPlanetRemoved: true,
    internalTerrainConstructRemoved: true,
    internalWaterConstructRemoved: true,
    surfaceExpressionAuthorityRequired: true,
    transparentMissWhenSurfaceAuthorityAbsent: true,

    canvasHubFile: CANVAS_HUB_FILE,
    canvasHubPresent: false,
    canvasHubContract: "UNKNOWN",
    canvasHubReceipt: "UNKNOWN",
    canvasHubRecognized: false,
    canvasHubStatus: "UNKNOWN",

    requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
    requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
    requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
    hexAuthorityPresent: false,
    hexAuthorityContract: "UNKNOWN",
    hexAuthorityReceipt: "UNKNOWN",
    hexAuthorityContractOk: false,
    hexAuthoritySampleOk: false,
    hexAuthorityWideProbeOk: false,
    hexAuthorityStatus: "UNKNOWN",

    surfaceAuthorityFile: SURFACE_AUTHORITY_FILE,
    requiredSurfaceAuthorityContract: REQUIRED_SURFACE_AUTHORITY_CONTRACT,
    surfaceAuthorityPresent: false,
    surfaceAuthoritySourcePath: "NONE",
    surfaceAuthorityContract: "UNKNOWN",
    surfaceAuthorityReceipt: "UNKNOWN",
    surfaceAuthorityRecognized: false,
    surfaceAuthorityMethod: "NONE",
    surfaceAuthoritySampleOk: false,
    surfaceAuthorityStatus: "UNKNOWN",
    surfaceAuthorityLastError: "",

    viewStateAccepted: false,
    viewStateSource: "NONE",
    viewYaw: 0,
    viewPitch: 0,
    viewZoom: 1,
    viewPhase: 0,
    viewStateLastAcceptedAt: "",
    viewStatePacketCount: 0,
    viewStateRejectedCount: 0,
    viewStateRejectionReason: "",

    drawCount: 0,
    pairDrawCount: 0,
    interactiveDrawCount: 0,
    settledDrawCount: 0,
    legacyDrawCount: 0,

    lastDrawAt: "",
    lastDrawOk: false,
    lastDrawMode: "NONE",
    lastDrawReason: "NONE",
    lastDrawWidth: 0,
    lastDrawHeight: 0,
    lastDrawRenderWidth: 0,
    lastDrawRenderHeight: 0,
    lastDrawSamples: 0,
    lastDrawVisiblePixels: 0,
    lastDrawTransparentMissPixels: 0,
    lastDrawExpressionPixels: 0,
    lastDrawSurfaceAuthorityHits: 0,
    lastDrawSurfaceAuthorityMisses: 0,
    lastDrawSurfaceAuthorityCalls: 0,
    lastDrawAuthorityHexPixels: 0,
    lastDrawFallbackHexPixels: 0,
    lastDrawAuthoritySampleCacheHits: 0,
    lastDrawAuthoritySampleCacheMisses: 0,
    lastDrawUsedScaledSurface: false,
    lastDrawViewStateApplied: false,
    lastDrawViewYaw: 0,
    lastDrawViewPitch: 0,
    lastDrawViewZoom: 1,
    lastDrawViewPhase: 0,
    lastDrawSphereProjectionFormula:
      "screen_xy_to_unit_sphere_xyz_to_yaw_pitch_phase_rotation_to_lon_lat_uv_to_hex_anchor_to_surface_authority_expression_to_rgba",
    lastError: "",

    lastCanvasNotifyOk: false,
    lastCanvasNotifyMethod: "NONE",

    datasetPublishCount: 0,
    receiptPublishCount: 0,
    updatedAt: "",

    ownsCanvasHub: false,
    ownsHexAuthority: false,
    ownsSurfaceAuthority: false,
    ownsSurfacePointerBishop: false,
    ownsCanvasFingerSurface: false,
    ownsComposite: false,
    ownsCanvasMounting: false,
    ownsRouteOrchestration: false,
    ownsRuntimeRestart: false,
    ownsControls: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsHydrology: false,
    ownsElevation: false,
    ownsMaterials: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,

    ...FINAL_FALSE
  };

  const surfacePool = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0
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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function norm3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return { x: x / length, y: y / length, z: z / length };
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x,
      y: v.y * c - v.z * s,
      z: v.y * s + v.z * c
    };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x * c + v.z * s,
      y: v.y,
      z: -v.x * s + v.z * c
    };
  }

  function vectorToCoordinate(v) {
    const n = norm3(v.x, v.y, v.z);
    const lon = Math.atan2(n.x, n.z);
    const lat = Math.asin(clamp(n.y, -1, 1));

    return {
      x: n.x,
      y: n.y,
      z: n.z,
      lon,
      lat,
      lonDegrees: lon / DEG,
      latDegrees: lat / DEG,
      u: wrap01((lon / DEG + 180) / 360),
      v: clamp01((90 - lat / DEG) / 180)
    };
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k)),
      Math.round(lerp(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], k))
    ];
  }

  function multiplyColor(color, amount) {
    const k = clamp(amount, 0, 2);
    return [
      clamp(Math.round(color[0] * k), 0, 255),
      clamp(Math.round(color[1] * k), 0, 255),
      clamp(Math.round(color[2] * k), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
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

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function firstGlobal(paths) {
    for (const path of paths) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function contractOf(candidate) {
    if (!isObject(candidate)) return "";
    return safeString(
      candidate.contract ||
      candidate.CONTRACT ||
      candidate.currentContract ||
      candidate.currentCanvasParentContract ||
      candidate.canvasContract ||
      candidate.hexSurfaceContract ||
      candidate.sourceContract ||
      "",
      ""
    );
  }

  function receiptOf(candidate) {
    if (!isObject(candidate)) return "";
    return safeString(
      candidate.receipt ||
      candidate.RECEIPT ||
      candidate.currentReceipt ||
      candidate.currentCanvasParentReceipt ||
      candidate.canvasReceipt ||
      candidate.hexSurfaceReceipt ||
      candidate.sourceReceipt ||
      "",
      ""
    );
  }

  function readReceipt(candidate) {
    if (!isObject(candidate)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "read"
    ];

    for (const method of methods) {
      if (!isFunction(candidate[method])) continue;

      try {
        const result = candidate[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(candidate.receipt)) return candidate.receipt;
    if (isObject(candidate.receiptPacket)) return candidate.receiptPacket;
    if (candidate.contract || candidate.CONTRACT || candidate.receipt || candidate.RECEIPT) return candidate;

    return null;
  }

  function resolveHexAuthorityWithPath() {
    return firstGlobal([
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_HANDSHAKE_AUTHORITY",
      "HEARTH_HEXGRID_AUTHORITY",
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hexAuthority",
      "DEXTER_LAB.hearthHexFourPairAuthority",
      "DEXTER_LAB.hearthHexAuthority"
    ]);
  }

  function resolveHexAuthority() {
    return resolveHexAuthorityWithPath().value;
  }

  function resolveSurfaceAuthorityWithPath() {
    return firstGlobal([
      "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
      "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
      "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
      "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",

      "HEARTH.canvasFingerSurfaceHexExpressionSocket",
      "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
      "HEARTH.canvasFingerSurfacePointerBishopHexExpressionSocket",
      "HEARTH.surfaceExpressionAuthority",
      "HEARTH.hexSurfaceExpressionAuthority",

      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasSurfaceFinger",
      "HEARTH.canvasFingerSurfacePointer",
      "HEARTH.canvasPointerFinger",
      "HEARTH.canvasBishopSurface",
      "HEARTH.canvasSurfaceBishop",
      "HEARTH.canvasBishopSurfacePointer",
      "HEARTH.canvasPointerBishop",

      "DEXTER_LAB.hearthCanvasFingerSurfaceHexExpressionSocket",
      "DEXTER_LAB.hearthCanvasSurfacePointerBishopHexExpressionSocket",
      "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishopHexExpressionSocket",
      "DEXTER_LAB.hearthSurfaceExpressionAuthority",
      "DEXTER_LAB.hearthHexSurfaceExpressionAuthority",

      "DEXTER_LAB.hearthCanvasFingerSurface",
      "DEXTER_LAB.hearthCanvasSurfaceFinger",
      "DEXTER_LAB.hearthCanvasFingerSurfacePointer",
      "DEXTER_LAB.hearthCanvasPointerFinger",
      "DEXTER_LAB.hearthCanvasBishopSurface",
      "DEXTER_LAB.hearthCanvasSurfaceBishop",
      "DEXTER_LAB.hearthCanvasBishopSurfacePointer",
      "DEXTER_LAB.hearthCanvasPointerBishop",

      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_CANVAS_SURFACE_FINGER",
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
      "HEARTH_CANVAS_POINTER_FINGER",
      "HEARTH_CANVAS_BISHOP_SURFACE",
      "HEARTH_CANVAS_SURFACE_BISHOP",
      "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
      "HEARTH_CANVAS_POINTER_BISHOP",
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP"
    ]);
  }

  function resolveSurfaceAuthority() {
    return resolveSurfaceAuthorityWithPath().value;
  }

  function resolveCanvasHub() {
    return firstGlobal([
      "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
      "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH.canvasHubRafSphereRotationPairReceiver",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
      "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
      "HEARTH.canvasPlanetaryViewControlReceiver",
      "HEARTH.canvasHub",
      "HEARTH.canvas",
      "HEARTH.canvasParent",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
      "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
      "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasVisiblePlanet"
    ]).value;
  }

  function validateHexAuthority() {
    const found = resolveHexAuthorityWithPath();
    const authority = found.value;
    const receipt = readReceipt(authority) || authority || {};
    const authorityContract =
      contractOf(receipt || authority) ||
      datasetValue("hearthHexFourPairAuthorityContract") ||
      datasetValue("hearthHexSurfaceRendererRequiredHexAuthorityContract") ||
      "UNKNOWN";
    const authorityReceipt =
      receiptOf(receipt || authority) ||
      datasetValue("hearthHexFourPairAuthorityReceipt") ||
      "UNKNOWN";

    const result = {
      authorityPresent: Boolean(authority),
      authoritySourcePath: found.path,
      authorityContract,
      authorityReceipt,
      contractOk: authorityContract === REQUIRED_HEX_AUTHORITY_CONTRACT,
      receiptOk: authorityReceipt === "UNKNOWN" || authorityReceipt === REQUIRED_HEX_AUTHORITY_RECEIPT,
      sampleOk: false,
      fourPairOk: false,
      bodyBoundOk: false,
      wideProbeOk: false,
      wideProbeTotal: 0,
      wideProbeFailedCount: 0,
      status: "MISSING",
      error: "",
      ...FINAL_FALSE
    };

    if (authority && isFunction(authority.sample)) {
      try {
        const sample = authority.sample({
          u: 0.5,
          v: 0.5,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          purpose: "hex-surface-v5-anchor-validation",
          ...FINAL_FALSE
        });

        result.sampleOk = Boolean(sample && typeof sample === "object");
        result.fourPairOk = Boolean(
          sample &&
          (
            sample.everyPixelHasFourPairSet === true ||
            sample.everyPixelHasNorthSouthEastWest === true ||
            (Array.isArray(sample.fourPairSet) && sample.fourPairSet.length === 4)
          )
        );
        result.bodyBoundOk = Boolean(
          sample &&
          sample.bodyBound !== false &&
          sample.surfaceBound !== false &&
          sample.floatsAboveBody !== true &&
          sample.allowedToFloat !== true
        );
      } catch (error) {
        result.error = error && error.message ? String(error.message) : String(error);
      }
    }

    if (authority && isFunction(authority.wideProbe)) {
      try {
        const probe = authority.wideProbe({
          rows: 5,
          columns: 9,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          ...FINAL_FALSE
        });

        result.wideProbeTotal = safeNumber(probe && probe.total, 0);
        result.wideProbeFailedCount = safeNumber(probe && probe.failedCount, 0);
        result.wideProbeOk = Boolean(
          probe &&
          probe.wideProbeReady === true &&
          probe.failedCount === 0
        );
      } catch (_error) {}
    }

    result.status = result.authorityPresent && result.sampleOk && result.bodyBoundOk
      ? result.contractOk
        ? "PASS"
        : "DEGRADED_CONTRACT_UNRECOGNIZED"
      : result.authorityPresent
        ? "DEGRADED_SAMPLE_OR_BODY_BOUND"
        : "MISSING";

    state.hexAuthorityPresent = result.authorityPresent;
    state.hexAuthorityContract = result.authorityContract;
    state.hexAuthorityReceipt = result.authorityReceipt;
    state.hexAuthorityContractOk = result.contractOk;
    state.hexAuthoritySampleOk = result.sampleOk;
    state.hexAuthorityWideProbeOk = result.wideProbeOk;
    state.hexAuthorityStatus = result.status;

    return result;
  }

  function getSurfaceExpressionMethod(authority) {
    if (!authority || typeof authority !== "object") return "NONE";

    const methods = [
      "sampleHexSurfaceExpression",
      "sampleSurfaceExpression",
      "getRenderableSurfaceExpression",
      "getSurfaceExpressionAt",
      "sampleSurface",
      "sample"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "NONE";
  }

  function validateSurfaceAuthority() {
    const found = resolveSurfaceAuthorityWithPath();
    const authority = found.value;
    const receipt = readReceipt(authority) || authority || {};
    const authorityContract =
      contractOf(receipt || authority) ||
      datasetValue("hearthCanvasFingerSurfaceContract") ||
      datasetValue("hearthCanvasFingerSurfaceHexExpressionSocketContract") ||
      "UNKNOWN";
    const authorityReceipt =
      receiptOf(receipt || authority) ||
      datasetValue("hearthCanvasFingerSurfaceReceipt") ||
      datasetValue("hearthCanvasFingerSurfaceHexExpressionSocketReceipt") ||
      "UNKNOWN";
    const method = getSurfaceExpressionMethod(authority);

    const recognized =
      ACCEPTED_SURFACE_AUTHORITY_CONTRACTS.includes(authorityContract) ||
      safeString(authorityContract).includes("HEARTH_CANVAS_FINGER_SURFACE") ||
      safeString(authorityContract).includes("HEARTH_CANVAS_SURFACE") ||
      found.path !== "NONE";

    const result = {
      authorityPresent: Boolean(authority),
      authoritySourcePath: found.path,
      authorityContract,
      authorityReceipt,
      recognized,
      method,
      sampleOk: false,
      status: "MISSING",
      error: "",
      ...FINAL_FALSE
    };

    if (authority && method !== "NONE") {
      try {
        const samplePacket = {
          packetType: "HEARTH_HEX_SURFACE_V5_SURFACE_AUTHORITY_VALIDATION_SAMPLE",
          sourceFile: FILE,
          sourceContract: CONTRACT,
          coord: {
            x: 0,
            y: 0,
            z: 1,
            u: 0.5,
            v: 0.5,
            lon: 0,
            lat: 0,
            lonDegrees: 0,
            latDegrees: 0
          },
          hexPacket: {
            cellId: "HEARTH_HEX_SURFACE_V5_VALIDATION_CELL",
            hexId: "HEARTH_HEX_SURFACE_V5_VALIDATION_CELL",
            stateId: 0,
            q: 0,
            r: 0,
            s: 0
          },
          screen: {
            x: 0.5,
            y: 0.5,
            width: 1,
            height: 1
          },
          viewState: {
            yaw: state.viewYaw,
            pitch: state.viewPitch,
            zoom: state.viewZoom,
            phase: state.viewPhase
          },
          requestedBy: CONTRACT,
          ...FINAL_FALSE
        };

        const sample = callSurfaceAuthority(authority, method, samplePacket);
        result.sampleOk = Boolean(sample && typeof sample === "object");
      } catch (error) {
        result.error = error && error.message ? String(error.message) : String(error);
      }
    }

    result.status = result.authorityPresent && method !== "NONE" && result.sampleOk
      ? recognized
        ? "PASS"
        : "DEGRADED_CONTRACT_UNRECOGNIZED"
      : result.authorityPresent && method !== "NONE"
        ? "DEGRADED_SAMPLE_NOT_CONFIRMED"
        : result.authorityPresent
          ? "DEGRADED_METHOD_NOT_FOUND"
          : "MISSING";

    state.surfaceAuthorityPresent = result.authorityPresent;
    state.surfaceAuthoritySourcePath = result.authoritySourcePath;
    state.surfaceAuthorityContract = result.authorityContract;
    state.surfaceAuthorityReceipt = result.authorityReceipt;
    state.surfaceAuthorityRecognized = result.recognized;
    state.surfaceAuthorityMethod = result.method;
    state.surfaceAuthoritySampleOk = result.sampleOk;
    state.surfaceAuthorityStatus = result.status;
    state.surfaceAuthorityLastError = result.error;

    return result;
  }

  function validateCanvasHub() {
    const hub = resolveCanvasHub();
    const receipt = readReceipt(hub) || hub || {};
    const hubContract =
      contractOf(receipt || hub) ||
      datasetValue("hearthCanvasContract") ||
      datasetValue("hearthCanvasCurrentParentContract") ||
      "UNKNOWN";
    const hubReceipt =
      receiptOf(receipt || hub) ||
      datasetValue("hearthCanvasReceipt") ||
      datasetValue("hearthCanvasCurrentParentReceipt") ||
      "UNKNOWN";

    const recognized =
      ACCEPTED_CANVAS_CONTRACTS.includes(hubContract) ||
      safeString(hubContract).includes("HEARTH_CANVAS");

    const result = {
      hubPresent: Boolean(hub || hubContract !== "UNKNOWN"),
      hubContract,
      hubReceipt,
      recognized,
      status: recognized
        ? "CANVAS_HUB_RECOGNIZED_FOR_PAIR_RENDERING"
        : hub
          ? "CANVAS_HUB_PRESENT_BUT_CONTRACT_UNRECOGNIZED"
          : "CANVAS_HUB_NOT_OBSERVED",
      ...FINAL_FALSE
    };

    state.canvasHubPresent = result.hubPresent;
    state.canvasHubContract = result.hubContract;
    state.canvasHubReceipt = result.hubReceipt;
    state.canvasHubRecognized = result.recognized;
    state.canvasHubStatus = result.status;

    return result;
  }

  function resolveCanvasAndContext(target) {
    const t = isObject(target) ? target : {};

    const canvas =
      t.canvas ||
      t.surface ||
      (target && target.nodeName && String(target.nodeName).toLowerCase() === "canvas" ? target : null);

    const ctx =
      t.ctx ||
      t.context ||
      t.context2d ||
      (canvas && isFunction(canvas.getContext) ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null);

    return { canvas, ctx };
  }

  function readGlobalViewState() {
    const candidates = [
      root.HEARTH_CANVAS_VIEW_STATE,
      root.HEARTH_CANVAS_LAST_VIEW_PACKET,
      root.HEARTH_CONTROLS_VIEW_PACKET,
      root.HEARTH_PLANETARY_VIEW_CONTROL_PACKET,
      root.HEARTH_QUEEN_CONTROLS_VIEW_PACKET,
      root.HEARTH && root.HEARTH.canvasViewState,
      root.HEARTH && root.HEARTH.canvasLastViewPacket,
      root.HEARTH && root.HEARTH.controlsViewPacket,
      root.HEARTH && root.HEARTH.planetaryViewControlPacket,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvasViewState,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthControlsViewPacket
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return candidate;
    }

    return null;
  }

  function normalizeViewState(target, options, sourceFallback) {
    const t = isObject(target) ? target : {};
    const o = isObject(options) ? options : {};
    const globalView = readGlobalViewState();

    const sourceObject =
      isObject(o.viewState) ? o.viewState :
      (o.yaw !== undefined || o.pitch !== undefined || o.zoom !== undefined || o.phase !== undefined) ? o :
      isObject(t.viewState) ? t.viewState :
      (t.yaw !== undefined || t.pitch !== undefined || t.zoom !== undefined || t.phase !== undefined) ? t :
      isObject(globalView && globalView.viewState) ? globalView.viewState :
      isObject(globalView) ? globalView :
      {};

    const carrier = isObject(o.viewState) || o.yaw !== undefined ? o :
      isObject(t.viewState) || t.yaw !== undefined ? t :
      isObject(globalView) ? globalView :
      {};

    const yaw = safeNumber(firstDefined(
      sourceObject.yaw,
      sourceObject.viewYaw,
      carrier.yaw,
      carrier.viewYaw,
      DEFAULTS.yaw
    ), DEFAULTS.yaw);

    const pitch = clamp(
      safeNumber(firstDefined(
        sourceObject.pitch,
        sourceObject.viewPitch,
        carrier.pitch,
        carrier.viewPitch,
        DEFAULTS.pitch
      ), DEFAULTS.pitch),
      safeNumber(firstDefined(sourceObject.minPitch, carrier.minPitch, DEFAULTS.minPitch), DEFAULTS.minPitch),
      safeNumber(firstDefined(sourceObject.maxPitch, carrier.maxPitch, DEFAULTS.maxPitch), DEFAULTS.maxPitch)
    );

    const zoom = clamp(
      safeNumber(firstDefined(
        sourceObject.zoom,
        sourceObject.viewZoom,
        carrier.zoom,
        carrier.viewZoom,
        DEFAULTS.zoom
      ), DEFAULTS.zoom),
      safeNumber(firstDefined(sourceObject.minZoom, carrier.minZoom, DEFAULTS.minZoom), DEFAULTS.minZoom),
      safeNumber(firstDefined(sourceObject.maxZoom, carrier.maxZoom, DEFAULTS.maxZoom), DEFAULTS.maxZoom)
    );

    const phase = safeNumber(firstDefined(
      sourceObject.phase,
      sourceObject.viewPhase,
      carrier.phase,
      carrier.viewPhase,
      DEFAULTS.phase
    ), DEFAULTS.phase);

    const source = safeString(firstDefined(
      o.viewStateSource,
      o.source,
      t.viewStateSource,
      t.source,
      carrier.viewStateSource,
      sourceFallback,
      "RESOLVED_VIEW_STATE"
    ));

    state.viewStateAccepted = true;
    state.viewStateSource = source;
    state.viewYaw = yaw;
    state.viewPitch = pitch;
    state.viewZoom = zoom;
    state.viewPhase = phase;
    state.viewStateLastAcceptedAt = nowIso();
    state.viewStatePacketCount += 1;
    state.viewStateRejectionReason = "";

    return {
      yaw,
      pitch,
      zoom,
      phase,
      source,
      minPitch: DEFAULTS.minPitch,
      maxPitch: DEFAULTS.maxPitch,
      minZoom: DEFAULTS.minZoom,
      maxZoom: DEFAULTS.maxZoom
    };
  }

  function normalizeRenderOptions(target, options, mode) {
    const o = isObject(options) ? options : {};
    const t = isObject(target) ? target : {};
    const view = normalizeViewState(t, o, `${mode.toUpperCase()}_SURFACE_AUTHORITY_RENDER_VIEW`);

    const interactive =
      mode === "interactive" ||
      o.interactive === true ||
      t.interactive === true ||
      /interactive|drag|touch|pointer|wheel|keyboard|view-state/i.test(safeString(o.reason || t.reason || o.inputType || t.inputType || ""));

    const maxSide = interactive
      ? clamp(safeNumber(firstDefined(o.maxSide, o.maxInteractiveSide, DEFAULTS.interactiveMaxSide), DEFAULTS.interactiveMaxSide), 220, 620)
      : clamp(safeNumber(firstDefined(o.maxSide, o.maxSettledSide, DEFAULTS.settledMaxSide), DEFAULTS.settledMaxSide), 320, 1180);

    const hexDensity = interactive
      ? clamp(safeNumber(firstDefined(o.hexDensity, DEFAULTS.interactiveHexDensity), DEFAULTS.interactiveHexDensity), 88, 250)
      : clamp(safeNumber(firstDefined(o.hexDensity, DEFAULTS.settledHexDensity), DEFAULTS.settledHexDensity), 118, 560);

    const authoritySampleLimit = interactive
      ? clamp(safeNumber(firstDefined(o.maxAuthoritySamplesPerFrame, DEFAULTS.interactiveAuthoritySampleLimit), DEFAULTS.interactiveAuthoritySampleLimit), 256, 6000)
      : clamp(safeNumber(firstDefined(o.maxAuthoritySamplesPerFrame, DEFAULTS.settledAuthoritySampleLimit), DEFAULTS.settledAuthoritySampleLimit), 512, 20000);

    const zoomRadius = clamp(1 + ((view.zoom - 1) * 0.14), 0.92, 1.18);

    return {
      mode: interactive ? "interactive" : "settled",
      reason: safeString(o.reason || t.reason || `${mode}-surface-authority-render`),
      interactive,
      maxSide,
      hexDensity,
      authoritySampleLimit,
      radiusRatio: clamp(safeNumber(firstDefined(o.radiusRatio, DEFAULTS.radiusRatio), DEFAULTS.radiusRatio) * zoomRadius, 0.32, 0.49),
      axialTilt: safeNumber(firstDefined(o.axialTilt, DEFAULTS.axialTilt), DEFAULTS.axialTilt) + view.pitch * 0.38,
      phase: safeNumber(firstDefined(o.phaseOffset, 0), 0) + view.phase + view.yaw,
      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      viewPhase: view.phase,
      viewSource: view.source,
      hexEdgeStrength: clamp(safeNumber(firstDefined(o.hexEdgeStrength, DEFAULTS.hexEdgeStrength), DEFAULTS.hexEdgeStrength), 0, 0.18),
      atmosphereStrength: clamp(safeNumber(firstDefined(o.atmosphereStrength, DEFAULTS.atmosphereStrength), DEFAULTS.atmosphereStrength), 0, 1.4),
      lightX: safeNumber(firstDefined(o.lightX, DEFAULTS.lightX), DEFAULTS.lightX),
      lightY: safeNumber(firstDefined(o.lightY, DEFAULTS.lightY), DEFAULTS.lightY),
      lightZ: safeNumber(firstDefined(o.lightZ, DEFAULTS.lightZ), DEFAULTS.lightZ)
    };
  }

  function createPooledSurface(width, height) {
    if (surfacePool.canvas && surfacePool.ctx && surfacePool.width === width && surfacePool.height === height) {
      return surfacePool;
    }

    surfacePool.canvas = null;
    surfacePool.ctx = null;
    surfacePool.width = width;
    surfacePool.height = height;

    try {
      if (doc && isFunction(doc.createElement)) {
        surfacePool.canvas = doc.createElement("canvas");
        surfacePool.canvas.width = width;
        surfacePool.canvas.height = height;
        surfacePool.ctx = surfacePool.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      }

      if (!surfacePool.ctx && typeof OffscreenCanvas !== "undefined") {
        surfacePool.canvas = new OffscreenCanvas(width, height);
        surfacePool.ctx = surfacePool.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      }
    } catch (_error) {
      surfacePool.canvas = null;
      surfacePool.ctx = null;
    }

    return surfacePool;
  }

  function createRenderSurface(canvas, destinationCtx, config) {
    const width = Math.max(1, Math.round(safeNumber(canvas && canvas.width, 0)));
    const height = Math.max(1, Math.round(safeNumber(canvas && canvas.height, 0)));
    const maxDimension = Math.max(width, height);
    const scale = Math.min(1, config.maxSide / Math.max(1, maxDimension));
    const renderWidth = Math.max(1, Math.round(width * scale));
    const renderHeight = Math.max(1, Math.round(height * scale));

    if (scale >= 0.999) {
      return {
        destinationCanvas: canvas,
        destinationCtx,
        canvas: null,
        ctx: destinationCtx,
        width,
        height,
        renderWidth: width,
        renderHeight: height,
        scale: 1,
        scaled: false
      };
    }

    const pooled = createPooledSurface(renderWidth, renderHeight);

    if (!pooled.canvas || !pooled.ctx) {
      return {
        destinationCanvas: canvas,
        destinationCtx,
        canvas: null,
        ctx: destinationCtx,
        width,
        height,
        renderWidth: width,
        renderHeight: height,
        scale: 1,
        scaled: false
      };
    }

    return {
      destinationCanvas: canvas,
      destinationCtx,
      canvas: pooled.canvas,
      ctx: pooled.ctx,
      width,
      height,
      renderWidth,
      renderHeight,
      scale,
      scaled: true
    };
  }

  function cubeRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs;
    else if (rDiff > sDiff) rr = -rq - rs;

    return { q: rq, r: rr };
  }

  function nearestHexCenter(xPx, yPx, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * xPx - (1 / 3) * yPx) / hexRadius;
    const r = ((2 / 3) * yPx) / hexRadius;
    const rounded = cubeRound(q, r);

    return {
      x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
      y: hexRadius * 1.5 * rounded.r,
      q: rounded.q,
      r: rounded.r
    };
  }

  function hexDistance(localX, localY, hexRadius) {
    const q = ((Math.sqrt(3) / 3) * localX - (1 / 3) * localY) / hexRadius;
    const r = ((2 / 3) * localY) / hexRadius;
    const s = -q - r;
    return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  }

  function fallbackHexAnchor(coord, q, r) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      fallbackHexAnchor: true,
      authorityHexPixel: false,
      cellId: `HEARTH_HEX_SURFACE_ANCHOR_MISS_Q${q}_R${r}`,
      hexId: `HEARTH_HEX_SURFACE_ANCHOR_MISS_Q${q}_R${r}`,
      q,
      r,
      s: -q - r,
      stateId: 0,
      stateClass: "state-000",
      u: coord.u,
      v: coord.v,
      lon: coord.lonDegrees,
      lat: coord.latDegrees,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      everyPixelHasNorthSouthEastWest: false,
      everyPixelHasFourPairSet: false,
      anchorMissOnly: true,
      ...FINAL_FALSE
    };
  }

  function sampleHexAuthority(coord, q, r, frameCache, config) {
    const cacheKey = `${q}:${r}`;

    if (frameCache.hex.has(cacheKey)) {
      frameCache.hexHits += 1;
      return frameCache.hex.get(cacheKey);
    }

    frameCache.hexMisses += 1;

    const authority = resolveHexAuthority();

    if (authority && isFunction(authority.sample) && frameCache.hexAuthorityCalls < config.authoritySampleLimit) {
      frameCache.hexAuthorityCalls += 1;

      try {
        const packet = authority.sample({
          x: coord.x,
          y: coord.y,
          z: coord.z,
          u: coord.u,
          v: coord.v,
          lon: coord.lonDegrees,
          lat: coord.latDegrees,
          q,
          r,
          s: -q - r,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          rendererContract: CONTRACT,
          surfaceAuthorityConsumer: true,
          ...FINAL_FALSE
        });

        if (packet && typeof packet === "object") {
          const normalized = {
            ...packet,
            fallbackHexAnchor: false,
            authorityHexPixel: true,
            q: packet.q !== undefined ? packet.q : q,
            r: packet.r !== undefined ? packet.r : r,
            s: packet.s !== undefined ? packet.s : -q - r,
            bodyBound: packet.bodyBound !== false,
            surfaceBound: packet.surfaceBound !== false,
            floatsAboveBody: false,
            allowedToFloat: false,
            ...FINAL_FALSE
          };

          frameCache.hex.set(cacheKey, normalized);
          return normalized;
        }
      } catch (_error) {}
    }

    const fallback = fallbackHexAnchor(coord, q, r);
    frameCache.hex.set(cacheKey, fallback);
    return fallback;
  }

  function buildSurfaceAuthorityPacket(coord, hexPacket, screen, config, center) {
    return {
      packetType: "HEARTH_HEX_SURFACE_V5_SURFACE_AUTHORITY_SAMPLE_REQUEST",
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      rendererFile: FILE,
      rendererContract: CONTRACT,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      coord: {
        x: coord.x,
        y: coord.y,
        z: coord.z,
        u: coord.u,
        v: coord.v,
        lon: coord.lonDegrees,
        lat: coord.latDegrees,
        lonDegrees: coord.lonDegrees,
        latDegrees: coord.latDegrees
      },
      hexPacket: clonePlain(hexPacket),
      screen: {
        x: screen.x,
        y: screen.y,
        px: screen.px,
        py: screen.py,
        width: screen.width,
        height: screen.height,
        sphereX: screen.sphereX,
        sphereY: screen.sphereY,
        sphereZ: screen.sphereZ
      },
      hexAddress: {
        q: center.q,
        r: center.r,
        s: -center.q - center.r
      },
      viewState: {
        yaw: config.yaw,
        pitch: config.pitch,
        zoom: config.zoom,
        phase: config.viewPhase,
        axialTilt: config.axialTilt
      },
      renderMode: config.mode,
      interactive: config.interactive,
      requestedBy: CONTRACT,
      internalFallbackPlanetRemoved: true,
      rendererOwnsProjectionOnly: true,
      rendererOwnsSurfaceTruth: false,
      surfaceAuthorityRequired: true,
      ...FINAL_FALSE
    };
  }

  function callSurfaceAuthority(authority, method, packet) {
    if (!authority || method === "NONE" || !isFunction(authority[method])) return null;

    if (method === "sample" || method === "sampleSurface") {
      const screen = packet.screen || {};
      return authority[method](screen.x, screen.y, {
        width: screen.width,
        height: screen.height,
        coord: packet.coord,
        hexPacket: packet.hexPacket,
        sourceFile: FILE,
        sourceContract: CONTRACT,
        requestedBy: CONTRACT,
        renderMode: packet.renderMode,
        interactive: packet.interactive,
        ...FINAL_FALSE
      });
    }

    return authority[method](clonePlain(packet));
  }

  function normalizeSurfaceExpression(value, packet) {
    if (!value || typeof value !== "object") {
      return {
        ok: false,
        status: "SURFACE_AUTHORITY_RETURNED_EMPTY",
        rgb: MISSING_COLOR.slice(),
        alpha: 0,
        transparentMiss: true,
        source: "surface-authority-empty",
        ...FINAL_FALSE
      };
    }

    const surface =
      isObject(value.surface) ? value.surface :
      isObject(value.expression) ? value.expression :
      isObject(value.surfaceExpression) ? value.surfaceExpression :
      isObject(value.payload) && (value.payload.rgb || value.payload.color || value.payload.materialClass) ? value.payload :
      value;

    const rgb =
      Array.isArray(surface.rgb) ? surface.rgb :
      Array.isArray(surface.color) ? surface.color :
      Array.isArray(value.rgb) ? value.rgb :
      Array.isArray(value.color) ? value.color :
      null;

    const alpha =
      surface.alpha !== undefined ? safeNumber(surface.alpha, 1) :
      value.alpha !== undefined ? safeNumber(value.alpha, 1) :
      surface.containment !== undefined ? safeNumber(surface.containment, 1) :
      1;

    return {
      ok: value.ok !== false && value.rejected !== true,
      status: safeString(value.status || surface.status || "SURFACE_EXPRESSION_ACCEPTED"),
      source: safeString(value.source || surface.source || state.surfaceAuthoritySourcePath || "SURFACE_AUTHORITY"),
      rgb: rgb ? normalizeRgb(rgb, alpha) : null,
      materialClass: safeString(surface.materialClass || value.materialClass || ""),
      isLand: surface.isLand === true || value.isLand === true || /land|soil|rock|terrain|ground|ridge|cliff|dry/i.test(safeString(surface.materialClass || value.materialClass || "")),
      isWater: surface.isWater === true || value.isWater === true || /water|ocean|basin|shelf|coast|shore|wet/i.test(safeString(surface.materialClass || value.materialClass || "")),
      surfaceValue: safeNumber(surface.surface ?? value.surfaceValue ?? value.value ?? 0, 0),
      containment: clamp01(surface.containment ?? value.containment ?? alpha),
      relief: clamp01(surface.relief ?? value.relief ?? surface.mass ?? 0),
      shade: clamp01(surface.shade ?? value.shade ?? 1),
      wetness: clamp01(surface.wetness ?? value.wetness ?? 0),
      materialTone: safeString(surface.materialTone || value.materialTone || ""),
      payload: clonePlain(value),
      request: clonePlain(packet),
      transparentMiss: false,
      ...FINAL_FALSE
    };
  }

  function normalizeRgb(rgb, alpha = 1) {
    return [
      clamp(Math.round(safeNumber(rgb[0], 0)), 0, 255),
      clamp(Math.round(safeNumber(rgb[1], 0)), 0, 255),
      clamp(Math.round(safeNumber(rgb[2], 0)), 0, 255),
      clamp(Math.round(rgb[3] === undefined ? safeNumber(alpha, 1) * 255 : safeNumber(rgb[3], 255)), 0, 255)
    ];
  }

  function surfaceClassColor(expression) {
    if (expression.rgb) return expression.rgb;

    const material = `${expression.materialClass} ${expression.materialTone}`.toLowerCase();

    let color;

    if (expression.isWater || /water|ocean|basin|shelf|coast|shore|wet/.test(material)) {
      color = /shelf|coast|shore/.test(material)
        ? [32, 126, 146, 255]
        : [6, 56, 110, 255];
    } else if (expression.isLand || /land|soil|rock|terrain|ground|ridge|cliff|dry/.test(material)) {
      if (/cliff|ridge|stone|granite/.test(material)) color = [116, 112, 96, 255];
      else if (/wet|green|forest/.test(material)) color = [58, 108, 66, 255];
      else if (/warm|dry|soil|sand/.test(material)) color = [136, 124, 78, 255];
      else color = [90, 116, 72, 255];
    } else if (expression.containment > 0) {
      const v = clamp01(expression.surfaceValue);
      color = mixColor([56, 78, 72, 255], [138, 124, 82, 255], v);
    } else {
      color = MISSING_COLOR.slice();
    }

    const alpha = clamp01(expression.containment) * 255;
    color[3] = clamp(Math.round(alpha), 0, 255);

    return color;
  }

  function composeColor(expression, shade, edgeFactor, config) {
    if (!expression || expression.ok === false || expression.transparentMiss === true) {
      return MISSING_COLOR.slice();
    }

    let color = surfaceClassColor(expression);

    if (color[3] <= 0) return MISSING_COLOR.slice();

    const light = clamp(0.70 + shade.light * 0.43, 0.52, 1.16);
    const limb = clamp(0.50 + shade.depth * 0.56, 0.44, 1.08);
    const relief = 1 + clamp01(expression.relief) * 0.12;
    const seam = clamp(1 - edgeFactor * config.hexEdgeStrength, 0.82, 1.04);
    const surfaceShade = clamp(safeNumber(expression.shade, 1), 0.55, 1.35);

    color = multiplyColor(color, light * limb * relief * seam * surfaceShade);

    return color;
  }

  function sampleSurfaceAuthorityExpression(coord, hexPacket, screen, config, center, frameCache) {
    const authority = resolveSurfaceAuthority();
    const method = state.surfaceAuthorityMethod !== "NONE"
      ? state.surfaceAuthorityMethod
      : getSurfaceExpressionMethod(authority);

    if (!authority || method === "NONE") {
      frameCache.surfaceMisses += 1;
      return {
        ok: false,
        status: "SURFACE_AUTHORITY_ABSENT",
        rgb: MISSING_COLOR.slice(),
        alpha: 0,
        transparentMiss: true,
        ...FINAL_FALSE
      };
    }

    const cacheKey = `${center.q}:${center.r}:${Math.round(coord.u * 512)}:${Math.round(coord.v * 256)}:${config.interactive ? "i" : "s"}`;

    if (frameCache.surface.has(cacheKey)) {
      frameCache.surfaceHits += 1;
      return frameCache.surface.get(cacheKey);
    }

    if (frameCache.surfaceCalls >= config.authoritySampleLimit) {
      frameCache.surfaceMisses += 1;
      return {
        ok: false,
        status: "SURFACE_AUTHORITY_SAMPLE_LIMIT_REACHED",
        rgb: MISSING_COLOR.slice(),
        alpha: 0,
        transparentMiss: true,
        ...FINAL_FALSE
      };
    }

    frameCache.surfaceCalls += 1;

    const packet = buildSurfaceAuthorityPacket(coord, hexPacket, screen, config, center);

    try {
      const raw = callSurfaceAuthority(authority, method, packet);
      const normalized = normalizeSurfaceExpression(raw, packet);

      if (normalized.ok && normalized.transparentMiss !== true) frameCache.surfaceHits += 1;
      else frameCache.surfaceMisses += 1;

      frameCache.surface.set(cacheKey, normalized);
      return normalized;
    } catch (error) {
      frameCache.surfaceMisses += 1;
      state.surfaceAuthorityLastError = error && error.message ? String(error.message) : String(error);
      state.lastError = state.surfaceAuthorityLastError;

      const miss = {
        ok: false,
        status: "SURFACE_AUTHORITY_SAMPLE_ERROR",
        error: state.surfaceAuthorityLastError,
        rgb: MISSING_COLOR.slice(),
        alpha: 0,
        transparentMiss: true,
        ...FINAL_FALSE
      };

      frameCache.surface.set(cacheKey, miss);
      return miss;
    }
  }

  function drawAtmosphere(ctx, width, height, cx, cy, radius, config, visiblePixels) {
    if (!visiblePixels) return;

    const strength = config.atmosphereStrength * (config.interactive ? 0.68 : 0.94);

    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.28);
    glow.addColorStop(0, "rgba(112,194,255,0.00)");
    glow.addColorStop(0.48, `rgba(114,198,255,${0.14 * strength})`);
    glow.addColorStop(1, "rgba(30,48,100,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.28, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, radius * 0.01), 0, TAU);
    ctx.strokeStyle = `rgba(190,226,255,${0.22 * strength})`;
    ctx.lineWidth = Math.max(1, radius * 0.01);
    ctx.stroke();

    ctx.restore();
  }

  function renderSphericalSurface(target, options, mode) {
    const resolved = resolveCanvasAndContext(target);

    if (!resolved.canvas || !resolved.ctx) {
      state.lastError = "HEARTH_HEX_SURFACE_V5_MISSING_CANVAS_OR_CONTEXT";
      state.lastDrawOk = false;
      state.updatedAt = nowIso();
      updateDataset();
      throw new Error(state.lastError);
    }

    const canvas = resolved.canvas;
    const destinationCtx = resolved.ctx;
    const config = normalizeRenderOptions(target, options, mode);
    const surface = createRenderSurface(canvas, destinationCtx, config);

    if (!surface.renderWidth || !surface.renderHeight || !surface.ctx) {
      state.lastError = "HEARTH_HEX_SURFACE_V5_INVALID_RENDER_SURFACE";
      state.lastDrawOk = false;
      state.updatedAt = nowIso();
      updateDataset();
      throw new Error(state.lastError);
    }

    validateHexAuthority();
    validateSurfaceAuthority();
    validateCanvasHub();

    const renderCtx = surface.ctx;
    const renderWidth = surface.renderWidth;
    const renderHeight = surface.renderHeight;
    const minSide = Math.min(renderWidth, renderHeight);
    const radius = minSide * config.radiusRatio;
    const cx = renderWidth / 2;
    const cy = renderHeight / 2;
    const hexRadius = clamp(minSide / config.hexDensity, 0.58, 6.0);
    const light = norm3(config.lightX, config.lightY, config.lightZ);

    const image = renderCtx.createImageData(renderWidth, renderHeight);
    const data = image.data;

    const frameCache = {
      hex: new Map(),
      surface: new Map(),
      hexHits: 0,
      hexMisses: 0,
      hexAuthorityCalls: 0,
      surfaceHits: 0,
      surfaceMisses: 0,
      surfaceCalls: 0
    };

    let samples = 0;
    let visiblePixels = 0;
    let transparentMissPixels = 0;
    let expressionPixels = 0;
    let fallbackHexPixels = 0;
    let authorityHexPixels = 0;

    try {
      for (let py = 0; py < renderHeight; py += 1) {
        const yRaw = py + 0.5 - cy;
        const ny = yRaw / radius;

        for (let px = 0; px < renderWidth; px += 1) {
          const xRaw = px + 0.5 - cx;
          const nx = xRaw / radius;
          const r2 = nx * nx + ny * ny;

          if (r2 > 1) continue;

          const z = Math.sqrt(Math.max(0, 1 - r2));

          let sphere = { x: nx, y: -ny, z };
          sphere = rotateX(sphere, config.axialTilt);
          sphere = rotateY(sphere, config.phase);

          const coord = vectorToCoordinate(sphere);
          const center = nearestHexCenter(xRaw, yRaw, hexRadius);
          const localX = xRaw - center.x;
          const localY = yRaw - center.y;
          const hexEdge = smoothstep(0.78, 1.08, hexDistance(localX, localY, hexRadius));

          const hexPacket = sampleHexAuthority(coord, center.q, center.r, frameCache, config);

          if (hexPacket.fallbackHexAnchor) fallbackHexPixels += 1;
          else authorityHexPixels += 1;

          const screen = {
            x: (px + 0.5) / renderWidth,
            y: (py + 0.5) / renderHeight,
            px,
            py,
            width: renderWidth,
            height: renderHeight,
            sphereX: sphere.x,
            sphereY: sphere.y,
            sphereZ: sphere.z
          };

          const expression = sampleSurfaceAuthorityExpression(coord, hexPacket, screen, config, center, frameCache);

          const rawNormal = norm3(nx, -ny, z);
          const lightValue = clamp01(
            rawNormal.x * light.x +
            rawNormal.y * light.y +
            rawNormal.z * light.z
          );

          const color = composeColor(
            expression,
            { light: lightValue, depth: z },
            hexEdge,
            config
          );

          const index = (py * renderWidth + px) * 4;

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];

          if (color[3] > 0) {
            visiblePixels += 1;
            expressionPixels += 1;
          } else {
            transparentMissPixels += 1;
          }

          samples += 1;
        }
      }

      renderCtx.clearRect(0, 0, renderWidth, renderHeight);
      renderCtx.putImageData(image, 0, 0);
      drawAtmosphere(renderCtx, renderWidth, renderHeight, cx, cy, radius, config, visiblePixels);

      if (surface.scaled && surface.canvas) {
        destinationCtx.save();
        destinationCtx.clearRect(0, 0, surface.width, surface.height);
        destinationCtx.imageSmoothingEnabled = true;
        destinationCtx.drawImage(surface.canvas, 0, 0, surface.width, surface.height);
        destinationCtx.restore();
      }

      const at = nowIso();

      const receipt = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        lineageV3Contract: LINEAGE_V3_CONTRACT,
        lineageV3Receipt: LINEAGE_V3_RECEIPT,
        lineageV2Contract: LINEAGE_V2_CONTRACT,
        lineageV2Receipt: LINEAGE_V2_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        baselineReceipt: BASELINE_RECEIPT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: "hex-surface-pointer-bishop-expression-consumer-renderer",
        packetType: "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_RENDER_FRAME_RECEIPT",

        pairRendererActive: true,
        sphericalProjectionActive: true,
        flatBitmapSlidingRejected: true,
        interactiveSphereRecomputationActive: true,
        settledSphereRecomputationActive: true,
        pairedCanvasHandshakeReady: true,

        internalFallbackPlanetRemoved: true,
        internalTerrainConstructRemoved: true,
        internalWaterConstructRemoved: true,
        surfaceExpressionAuthorityRequired: true,
        transparentMissWhenSurfaceAuthorityAbsent: true,

        canvasHubFile: CANVAS_HUB_FILE,
        canvasHubPresent: state.canvasHubPresent,
        canvasHubContract: state.canvasHubContract,
        canvasHubReceipt: state.canvasHubReceipt,
        canvasHubRecognized: state.canvasHubRecognized,
        canvasHubStatus: state.canvasHubStatus,

        requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
        requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
        requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
        hexAuthorityPresent: state.hexAuthorityPresent,
        hexAuthorityContract: state.hexAuthorityContract,
        hexAuthorityReceipt: state.hexAuthorityReceipt,
        hexAuthorityContractOk: state.hexAuthorityContractOk,
        hexAuthoritySampleOk: state.hexAuthoritySampleOk,
        hexAuthorityWideProbeOk: state.hexAuthorityWideProbeOk,
        hexAuthorityStatus: state.hexAuthorityStatus,

        surfaceAuthorityFile: SURFACE_AUTHORITY_FILE,
        requiredSurfaceAuthorityContract: REQUIRED_SURFACE_AUTHORITY_CONTRACT,
        surfaceAuthorityPresent: state.surfaceAuthorityPresent,
        surfaceAuthoritySourcePath: state.surfaceAuthoritySourcePath,
        surfaceAuthorityContract: state.surfaceAuthorityContract,
        surfaceAuthorityReceipt: state.surfaceAuthorityReceipt,
        surfaceAuthorityRecognized: state.surfaceAuthorityRecognized,
        surfaceAuthorityMethod: state.surfaceAuthorityMethod,
        surfaceAuthoritySampleOk: state.surfaceAuthoritySampleOk,
        surfaceAuthorityStatus: state.surfaceAuthorityStatus,
        surfaceAuthorityLastError: state.surfaceAuthorityLastError,

        mode: config.mode,
        reason: config.reason,
        interactive: config.interactive,
        viewStateAccepted: true,
        viewStateSource: config.viewSource,
        viewYaw: config.yaw,
        viewPitch: config.pitch,
        viewZoom: config.zoom,
        viewPhase: config.viewPhase,
        viewStateAppliedToSphericalProjection: true,
        projectionFormula:
          "screen_xy_to_unit_sphere_xyz_to_yaw_pitch_phase_rotation_to_lon_lat_uv_to_hex_anchor_to_surface_authority_expression_to_rgba",
        bitmapSlidingUsed: false,
        cssTranslationUsed: false,
        previousFrameTranslated: false,

        width: surface.width,
        height: surface.height,
        renderWidth,
        renderHeight,
        samples,
        radius,
        hexRadius,
        visiblePixels,
        transparentMissPixels,
        expressionPixels,
        fallbackHexPixels,
        authorityHexPixels,
        surfaceAuthorityHits: frameCache.surfaceHits,
        surfaceAuthorityMisses: frameCache.surfaceMisses,
        surfaceAuthorityCalls: frameCache.surfaceCalls,
        authoritySampleCacheHits: frameCache.hexHits,
        authoritySampleCacheMisses: frameCache.hexMisses,
        authoritySampleCalls: frameCache.hexAuthorityCalls,
        usedScaledSurface: surface.scaled,

        rendererDrewSurface: visiblePixels > 0,
        visibleSurfaceRendered: visiblePixels > 0,
        bodyBound: true,
        surfaceBound: true,
        highDensitySurfaceExpression: !config.interactive,
        interactiveSurfaceExpression: config.interactive,
        canvasHubOnlyAwarenessUpdate: true,

        ownsCanvasHub: false,
        ownsHexAuthority: false,
        ownsSurfaceAuthority: false,
        ownsSurfacePointerBishop: false,
        ownsCanvasFingerSurface: false,
        ownsComposite: false,
        ownsCanvasMounting: false,
        ownsRouteOrchestration: false,
        ownsRuntimeRestart: false,
        ownsControls: false,
        ownsLandTruth: false,
        ownsWaterTruth: false,
        ownsAirTruth: false,
        ownsHydrology: false,
        ownsElevation: false,
        ownsMaterials: false,
        ownsAtmosphereTruth: false,
        ownsLightingTruth: false,

        ...FINAL_FALSE,
        updatedAt: at
      };

      state.drawCount += 1;
      state.pairDrawCount += mode === "pair" ? 1 : 0;
      state.interactiveDrawCount += config.interactive ? 1 : 0;
      state.settledDrawCount += !config.interactive ? 1 : 0;
      state.legacyDrawCount += mode === "legacy" ? 1 : 0;

      state.lastDrawAt = at;
      state.lastDrawOk = true;
      state.lastDrawMode = config.interactive ? "INTERACTIVE_SPHERE_SURFACE_AUTHORITY_RECOMPUTE" : "SETTLED_SPHERE_SURFACE_AUTHORITY_RECOMPUTE";
      state.lastDrawReason = config.reason;
      state.lastDrawWidth = surface.width;
      state.lastDrawHeight = surface.height;
      state.lastDrawRenderWidth = renderWidth;
      state.lastDrawRenderHeight = renderHeight;
      state.lastDrawSamples = samples;
      state.lastDrawVisiblePixels = visiblePixels;
      state.lastDrawTransparentMissPixels = transparentMissPixels;
      state.lastDrawExpressionPixels = expressionPixels;
      state.lastDrawFallbackHexPixels = fallbackHexPixels;
      state.lastDrawAuthorityHexPixels = authorityHexPixels;
      state.lastDrawSurfaceAuthorityHits = frameCache.surfaceHits;
      state.lastDrawSurfaceAuthorityMisses = frameCache.surfaceMisses;
      state.lastDrawSurfaceAuthorityCalls = frameCache.surfaceCalls;
      state.lastDrawAuthoritySampleCacheHits = frameCache.hexHits;
      state.lastDrawAuthoritySampleCacheMisses = frameCache.hexMisses;
      state.lastDrawUsedScaledSurface = surface.scaled;
      state.lastDrawViewStateApplied = true;
      state.lastDrawViewYaw = config.yaw;
      state.lastDrawViewPitch = config.pitch;
      state.lastDrawViewZoom = config.zoom;
      state.lastDrawViewPhase = config.viewPhase;
      state.lastError = "";
      state.updatedAt = at;

      if (canvas.dataset) {
        canvas.dataset.hearthHexSurfaceRenderer = "true";
        canvas.dataset.hearthHexSurfaceRendererContract = CONTRACT;
        canvas.dataset.hearthHexSurfaceRendererReceipt = RECEIPT;
        canvas.dataset.hearthHexSurfaceRendererFile = FILE;
        canvas.dataset.hearthHexSurfaceRendererDrawOk = "true";
        canvas.dataset.hearthHexSurfaceRendererMode = receipt.mode;
        canvas.dataset.hearthHexSurfaceRendererInteractive = String(Boolean(receipt.interactive));
        canvas.dataset.hearthHexSurfaceRendererSphericalProjectionActive = "true";
        canvas.dataset.hearthHexSurfaceRendererFlatBitmapSlidingRejected = "true";
        canvas.dataset.hearthHexSurfaceRendererInternalFallbackPlanetRemoved = "true";
        canvas.dataset.hearthHexSurfaceRendererSurfaceAuthorityPresent = String(state.surfaceAuthorityPresent);
        canvas.dataset.hearthHexSurfaceRendererSurfaceAuthoritySourcePath = state.surfaceAuthoritySourcePath;
        canvas.dataset.hearthHexSurfaceRendererSurfaceAuthorityMethod = state.surfaceAuthorityMethod;
        canvas.dataset.hearthHexSurfaceRendererSurfaceAuthorityStatus = state.surfaceAuthorityStatus;
        canvas.dataset.hearthHexSurfaceRendererViewStateApplied = "true";
        canvas.dataset.hearthHexSurfaceRendererViewYaw = String(config.yaw);
        canvas.dataset.hearthHexSurfaceRendererViewPitch = String(config.pitch);
        canvas.dataset.hearthHexSurfaceRendererViewZoom = String(config.zoom);
        canvas.dataset.hearthHexSurfaceRendererViewPhase = String(config.viewPhase);
        canvas.dataset.hearthHexSurfaceRendererSamples = String(samples);
        canvas.dataset.hearthHexSurfaceRendererVisiblePixels = String(visiblePixels);
        canvas.dataset.hearthHexSurfaceRendererTransparentMissPixels = String(transparentMissPixels);
        canvas.dataset.hearthHexSurfaceRendererExpressionPixels = String(expressionPixels);
        canvas.dataset.hearthHexSurfaceRendererAuthorityHexPixels = String(authorityHexPixels);
        canvas.dataset.hearthHexSurfaceRendererFallbackHexPixels = String(fallbackHexPixels);
        canvas.dataset.generatedImage = "false";
        canvas.dataset.graphicBox = "false";
        canvas.dataset.webgl = "false";
        canvas.dataset.visualPassClaimed = "false";
      }

      updateDataset(receipt);
      publishGlobals(false);

      if (!config.interactive) notifyCanvasHub(receipt);

      return receipt;
    } catch (error) {
      state.lastDrawOk = false;
      state.lastError = error && error.message ? String(error.message) : String(error);
      state.updatedAt = nowIso();
      updateDataset();
      publishGlobals(false);
      throw error;
    }
  }

  function drawPairFrame(target, options = {}) {
    const o = isObject(options) ? options : {};
    const t = isObject(target) ? target : {};
    const mode = o.interactive === true || t.interactive === true ? "interactive" : "pair";
    return renderSphericalSurface(target, options, mode);
  }

  function drawInteractiveFrame(target, options = {}) {
    return renderSphericalSurface(
      target,
      { ...options, interactive: true, reason: options.reason || "interactive-surface-authority-frame" },
      "interactive"
    );
  }

  function drawSettledFrame(target, options = {}) {
    return renderSphericalSurface(
      target,
      { ...options, interactive: false, reason: options.reason || "settled-surface-authority-frame" },
      "settled"
    );
  }

  function drawHearthHexSurfaceFrame(target, options = {}) {
    return renderSphericalSurface(target, options, "legacy");
  }

  function drawFrame(target, options = {}) {
    return drawHearthHexSurfaceFrame(target, options);
  }

  function render(target, options = {}) {
    return drawHearthHexSurfaceFrame(target, options);
  }

  function renderFrame(target, options = {}) {
    return drawHearthHexSurfaceFrame(target, options);
  }

  function receiveCanvasViewState(packet = {}) {
    if (!isObject(packet)) {
      state.viewStateRejectedCount += 1;
      state.viewStateRejectionReason = "VIEW_STATE_PACKET_NOT_OBJECT";
      updateDataset();
      return getReceipt();
    }

    normalizeViewState(packet, {}, "DIRECT_CANVAS_VIEW_STATE_PACKET");
    updateDataset();
    publishGlobals(false);

    return getReceipt();
  }

  function consumeCanvasViewState(packet = {}) {
    return receiveCanvasViewState(packet);
  }

  function receiveViewControlPacket(packet = {}) {
    return receiveCanvasViewState(packet);
  }

  function consumeViewControlPacket(packet = {}) {
    return receiveCanvasViewState(packet);
  }

  function receivePairCanvasHandshake(packet = {}) {
    if (!isObject(packet)) {
      state.viewStateRejectedCount += 1;
      state.viewStateRejectionReason = "PAIR_CANVAS_HANDSHAKE_PACKET_NOT_OBJECT";
      updateDataset();
      return getReceipt();
    }

    const contract = safeString(packet.canvasContract || packet.contract || packet.sourceContract || "");
    state.canvasHubPresent = true;
    state.canvasHubContract = contract || state.canvasHubContract;
    state.canvasHubReceipt = safeString(packet.canvasReceipt || packet.receipt || packet.sourceReceipt || state.canvasHubReceipt);
    state.canvasHubRecognized = ACCEPTED_CANVAS_CONTRACTS.includes(state.canvasHubContract) || state.canvasHubContract.includes("HEARTH_CANVAS");
    state.canvasHubStatus = state.canvasHubRecognized
      ? "PAIR_CANVAS_HANDSHAKE_ACCEPTED"
      : "PAIR_CANVAS_HANDSHAKE_PRESENT_CONTRACT_UNRECOGNIZED";

    if (packet.viewState || packet.yaw !== undefined || packet.pitch !== undefined || packet.zoom !== undefined || packet.phase !== undefined) {
      normalizeViewState(packet, {}, "PAIR_CANVAS_HANDSHAKE_VIEW_STATE");
    }

    updateDataset();
    publishGlobals(false);

    return getReceipt();
  }

  function notifyCanvasHub(packet) {
    const hub = resolveCanvasHub();

    state.lastCanvasNotifyOk = false;
    state.lastCanvasNotifyMethod = "NONE";

    if (!hub || typeof hub !== "object") return false;

    const methods = [
      "receiveHexSurfacePointerBishopExpressionRendererReceipt",
      "receiveHexSurfacePairRendererReceipt",
      "receiveHexSurfaceRendererReceipt",
      "receiveHexSurfaceRendererPacket",
      "receiveHexSurfaceReceipt",
      "receiveHexSurfacePacket"
    ];

    for (const method of methods) {
      if (!isFunction(hub[method])) continue;

      try {
        hub[method]({
          ...clonePlain(packet),
          canvasHubOnlyAwarenessUpdate: true,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          ...FINAL_FALSE
        });

        state.lastCanvasNotifyOk = true;
        state.lastCanvasNotifyMethod = method;
        state.updatedAt = nowIso();
        return true;
      } catch (error) {
        state.lastCanvasNotifyOk = false;
        state.lastCanvasNotifyMethod = `${method}:ERROR`;
        state.lastError = error && error.message ? String(error.message) : String(error);
        state.updatedAt = nowIso();
        return false;
      }
    }

    return false;
  }

  function updateDataset(frameReceipt = null) {
    state.datasetPublishCount += 1;

    setDataset("hearthHexSurfaceRendererLoaded", "true");
    setDataset("hearthHexSurfaceRendererActive", "true");
    setDataset("hearthHexSurfaceRendererContract", CONTRACT);
    setDataset("hearthHexSurfaceRendererReceipt", RECEIPT);
    setDataset("hearthHexSurfaceRendererPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthHexSurfaceRendererPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthHexSurfaceRendererLineageV3Contract", LINEAGE_V3_CONTRACT);
    setDataset("hearthHexSurfaceRendererLineageV2Contract", LINEAGE_V2_CONTRACT);
    setDataset("hearthHexSurfaceRendererBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthHexSurfaceRendererVersion", VERSION);
    setDataset("hearthHexSurfaceRendererFile", FILE);
    setDataset("hearthHexSurfaceRendererRole", state.role);

    setDataset("hearthHexSurfacePairRendererActive", "true");
    setDataset("hearthHexSurfaceSphericalProjectionActive", "true");
    setDataset("hearthHexSurfaceFlatBitmapSlidingRejected", "true");
    setDataset("hearthHexSurfaceInteractiveSphereRecomputationActive", "true");
    setDataset("hearthHexSurfaceSettledSphereRecomputationActive", "true");
    setDataset("hearthHexSurfacePairedCanvasHandshakeReady", "true");

    setDataset("hearthHexSurfaceRendererInternalFallbackPlanetRemoved", "true");
    setDataset("hearthHexSurfaceRendererInternalTerrainConstructRemoved", "true");
    setDataset("hearthHexSurfaceRendererInternalWaterConstructRemoved", "true");
    setDataset("hearthHexSurfaceRendererSurfaceExpressionAuthorityRequired", "true");
    setDataset("hearthHexSurfaceRendererTransparentMissWhenSurfaceAuthorityAbsent", "true");

    setDataset("hearthHexSurfaceRendererCanvasHubFile", CANVAS_HUB_FILE);
    setDataset("hearthHexSurfaceRendererCanvasHubPresent", String(state.canvasHubPresent));
    setDataset("hearthHexSurfaceRendererCanvasHubContract", state.canvasHubContract);
    setDataset("hearthHexSurfaceRendererCanvasHubReceipt", state.canvasHubReceipt);
    setDataset("hearthHexSurfaceRendererCanvasHubRecognized", String(state.canvasHubRecognized));
    setDataset("hearthHexSurfaceRendererCanvasHubStatus", state.canvasHubStatus);

    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityContract", REQUIRED_HEX_AUTHORITY_CONTRACT);
    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityReceipt", REQUIRED_HEX_AUTHORITY_RECEIPT);
    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityFile", REQUIRED_HEX_AUTHORITY_FILE);
    setDataset("hearthHexSurfaceRendererHexAuthorityPresent", String(state.hexAuthorityPresent));
    setDataset("hearthHexSurfaceRendererHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthHexSurfaceRendererHexAuthorityReceipt", state.hexAuthorityReceipt);
    setDataset("hearthHexSurfaceRendererHexAuthorityContractOk", String(state.hexAuthorityContractOk));
    setDataset("hearthHexSurfaceRendererHexAuthoritySampleOk", String(state.hexAuthoritySampleOk));
    setDataset("hearthHexSurfaceRendererHexAuthorityWideProbeOk", String(state.hexAuthorityWideProbeOk));
    setDataset("hearthHexSurfaceRendererHexAuthorityStatus", state.hexAuthorityStatus);

    setDataset("hearthHexSurfaceRendererSurfaceAuthorityFile", SURFACE_AUTHORITY_FILE);
    setDataset("hearthHexSurfaceRendererRequiredSurfaceAuthorityContract", REQUIRED_SURFACE_AUTHORITY_CONTRACT);
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityPresent", String(state.surfaceAuthorityPresent));
    setDataset("hearthHexSurfaceRendererSurfaceAuthoritySourcePath", state.surfaceAuthoritySourcePath);
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityContract", state.surfaceAuthorityContract);
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityReceipt", state.surfaceAuthorityReceipt);
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityRecognized", String(state.surfaceAuthorityRecognized));
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityMethod", state.surfaceAuthorityMethod);
    setDataset("hearthHexSurfaceRendererSurfaceAuthoritySampleOk", String(state.surfaceAuthoritySampleOk));
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityStatus", state.surfaceAuthorityStatus);
    setDataset("hearthHexSurfaceRendererSurfaceAuthorityLastError", state.surfaceAuthorityLastError);

    setDataset("hearthHexSurfaceRendererViewStateAccepted", String(state.viewStateAccepted));
    setDataset("hearthHexSurfaceRendererViewStateSource", state.viewStateSource);
    setDataset("hearthHexSurfaceRendererViewYaw", String(state.viewYaw));
    setDataset("hearthHexSurfaceRendererViewPitch", String(state.viewPitch));
    setDataset("hearthHexSurfaceRendererViewZoom", String(state.viewZoom));
    setDataset("hearthHexSurfaceRendererViewPhase", String(state.viewPhase));
    setDataset("hearthHexSurfaceRendererViewStatePacketCount", String(state.viewStatePacketCount));
    setDataset("hearthHexSurfaceRendererViewStateRejectedCount", String(state.viewStateRejectedCount));
    setDataset("hearthHexSurfaceRendererViewStateRejectionReason", state.viewStateRejectionReason);

    setDataset("hearthHexSurfaceRendererDrawCount", String(state.drawCount));
    setDataset("hearthHexSurfaceRendererPairDrawCount", String(state.pairDrawCount));
    setDataset("hearthHexSurfaceRendererInteractiveDrawCount", String(state.interactiveDrawCount));
    setDataset("hearthHexSurfaceRendererSettledDrawCount", String(state.settledDrawCount));
    setDataset("hearthHexSurfaceRendererLegacyDrawCount", String(state.legacyDrawCount));
    setDataset("hearthHexSurfaceRendererLastDrawOk", String(state.lastDrawOk));
    setDataset("hearthHexSurfaceRendererLastDrawMode", state.lastDrawMode);
    setDataset("hearthHexSurfaceRendererLastDrawReason", state.lastDrawReason);
    setDataset("hearthHexSurfaceRendererLastDrawWidth", String(state.lastDrawWidth));
    setDataset("hearthHexSurfaceRendererLastDrawHeight", String(state.lastDrawHeight));
    setDataset("hearthHexSurfaceRendererLastDrawRenderWidth", String(state.lastDrawRenderWidth));
    setDataset("hearthHexSurfaceRendererLastDrawRenderHeight", String(state.lastDrawRenderHeight));
    setDataset("hearthHexSurfaceRendererLastDrawSamples", String(state.lastDrawSamples));
    setDataset("hearthHexSurfaceRendererLastDrawVisiblePixels", String(state.lastDrawVisiblePixels));
    setDataset("hearthHexSurfaceRendererLastDrawTransparentMissPixels", String(state.lastDrawTransparentMissPixels));
    setDataset("hearthHexSurfaceRendererLastDrawExpressionPixels", String(state.lastDrawExpressionPixels));
    setDataset("hearthHexSurfaceRendererLastDrawSurfaceAuthorityHits", String(state.lastDrawSurfaceAuthorityHits));
    setDataset("hearthHexSurfaceRendererLastDrawSurfaceAuthorityMisses", String(state.lastDrawSurfaceAuthorityMisses));
    setDataset("hearthHexSurfaceRendererLastDrawSurfaceAuthorityCalls", String(state.lastDrawSurfaceAuthorityCalls));
    setDataset("hearthHexSurfaceRendererLastDrawAuthorityHexPixels", String(state.lastDrawAuthorityHexPixels));
    setDataset("hearthHexSurfaceRendererLastDrawFallbackHexPixels", String(state.lastDrawFallbackHexPixels));
    setDataset("hearthHexSurfaceRendererLastDrawAuthoritySampleCacheHits", String(state.lastDrawAuthoritySampleCacheHits));
    setDataset("hearthHexSurfaceRendererLastDrawAuthoritySampleCacheMisses", String(state.lastDrawAuthoritySampleCacheMisses));
    setDataset("hearthHexSurfaceRendererLastDrawUsedScaledSurface", String(state.lastDrawUsedScaledSurface));
    setDataset("hearthHexSurfaceRendererLastDrawViewStateApplied", String(state.lastDrawViewStateApplied));
    setDataset("hearthHexSurfaceRendererLastDrawProjectionFormula", state.lastDrawSphereProjectionFormula);
    setDataset("hearthHexSurfaceRendererLastError", state.lastError);

    setDataset("hearthHexSurfaceRendererLastCanvasNotifyOk", String(state.lastCanvasNotifyOk));
    setDataset("hearthHexSurfaceRendererLastCanvasNotifyMethod", state.lastCanvasNotifyMethod);

    setDataset("hearthHexSurfaceRendererOwnsCanvasHub", "false");
    setDataset("hearthHexSurfaceRendererOwnsHexAuthority", "false");
    setDataset("hearthHexSurfaceRendererOwnsSurfaceAuthority", "false");
    setDataset("hearthHexSurfaceRendererOwnsSurfacePointerBishop", "false");
    setDataset("hearthHexSurfaceRendererOwnsCanvasFingerSurface", "false");
    setDataset("hearthHexSurfaceRendererOwnsComposite", "false");
    setDataset("hearthHexSurfaceRendererOwnsCanvasMounting", "false");
    setDataset("hearthHexSurfaceRendererOwnsRouteOrchestration", "false");
    setDataset("hearthHexSurfaceRendererOwnsRuntimeRestart", "false");
    setDataset("hearthHexSurfaceRendererOwnsControls", "false");
    setDataset("hearthHexSurfaceRendererOwnsLandTruth", "false");
    setDataset("hearthHexSurfaceRendererOwnsWaterTruth", "false");
    setDataset("hearthHexSurfaceRendererOwnsAirTruth", "false");
    setDataset("hearthHexSurfaceRendererOwnsHydrology", "false");
    setDataset("hearthHexSurfaceRendererOwnsElevation", "false");
    setDataset("hearthHexSurfaceRendererOwnsMaterials", "false");

    if (frameReceipt) {
      setDataset("hearthHexSurfaceRendererFrameReceipt", frameReceipt.receipt);
      setDataset("hearthHexSurfaceRendererFrameMode", frameReceipt.mode);
      setDataset("hearthHexSurfaceRendererFrameInteractive", String(Boolean(frameReceipt.interactive)));
      setDataset("hearthHexSurfaceRendererVisibleSurfaceRendered", String(Boolean(frameReceipt.visibleSurfaceRendered)));
      setDataset("hearthHexSurfaceRendererFrameViewStateApplied", String(Boolean(frameReceipt.viewStateAppliedToSphericalProjection)));
      setDataset("hearthHexSurfaceRendererFrameBitmapSlidingUsed", "false");
      setDataset("hearthHexSurfaceRendererFrameSurfaceAuthorityUsed", String(Boolean(frameReceipt.surfaceAuthorityPresent)));
    }

    setDataset("hearthHexSurfaceRendererF13Claimed", "false");
    setDataset("hearthHexSurfaceRendererF21EligibleForNorth", "false");
    setDataset("hearthHexSurfaceRendererF21Claimed", "false");
    setDataset("hearthHexSurfaceRendererReadyTextAllowed", "false");
    setDataset("hearthHexSurfaceRendererReadyTextClaimed", "false");
    setDataset("hearthHexSurfaceRendererVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function getStatus() {
    validateHexAuthority();
    validateSurfaceAuthority();
    validateCanvasHub();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV3Contract: LINEAGE_V3_CONTRACT,
      lineageV3Receipt: LINEAGE_V3_RECEIPT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      lineageV2Receipt: LINEAGE_V2_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      role: state.role,

      rendererLoaded: true,
      rendererActive: true,
      apiReady: true,

      pairRendererActive: true,
      sphericalProjectionActive: true,
      flatBitmapSlidingRejected: true,
      interactiveSphereRecomputationActive: true,
      settledSphereRecomputationActive: true,
      pairedCanvasHandshakeReady: true,

      internalFallbackPlanetRemoved: true,
      internalTerrainConstructRemoved: true,
      internalWaterConstructRemoved: true,
      surfaceExpressionAuthorityRequired: true,
      transparentMissWhenSurfaceAuthorityAbsent: true,

      canvasHubFile: CANVAS_HUB_FILE,
      canvasHubPresent: state.canvasHubPresent,
      canvasHubContract: state.canvasHubContract,
      canvasHubReceipt: state.canvasHubReceipt,
      canvasHubRecognized: state.canvasHubRecognized,
      canvasHubStatus: state.canvasHubStatus,
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),

      requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
      requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
      requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
      hexAuthorityPresent: state.hexAuthorityPresent,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityContractOk: state.hexAuthorityContractOk,
      hexAuthoritySampleOk: state.hexAuthoritySampleOk,
      hexAuthorityWideProbeOk: state.hexAuthorityWideProbeOk,
      hexAuthorityStatus: state.hexAuthorityStatus,

      surfaceAuthorityFile: SURFACE_AUTHORITY_FILE,
      requiredSurfaceAuthorityContract: REQUIRED_SURFACE_AUTHORITY_CONTRACT,
      acceptedSurfaceAuthorityContracts: ACCEPTED_SURFACE_AUTHORITY_CONTRACTS.slice(),
      surfaceAuthorityPresent: state.surfaceAuthorityPresent,
      surfaceAuthoritySourcePath: state.surfaceAuthoritySourcePath,
      surfaceAuthorityContract: state.surfaceAuthorityContract,
      surfaceAuthorityReceipt: state.surfaceAuthorityReceipt,
      surfaceAuthorityRecognized: state.surfaceAuthorityRecognized,
      surfaceAuthorityMethod: state.surfaceAuthorityMethod,
      surfaceAuthoritySampleOk: state.surfaceAuthoritySampleOk,
      surfaceAuthorityStatus: state.surfaceAuthorityStatus,
      surfaceAuthorityLastError: state.surfaceAuthorityLastError,

      viewStateAccepted: state.viewStateAccepted,
      viewStateSource: state.viewStateSource,
      viewYaw: state.viewYaw,
      viewPitch: state.viewPitch,
      viewZoom: state.viewZoom,
      viewPhase: state.viewPhase,
      viewStatePacketCount: state.viewStatePacketCount,
      viewStateRejectedCount: state.viewStateRejectedCount,
      viewStateRejectionReason: state.viewStateRejectionReason,

      drawCount: state.drawCount,
      pairDrawCount: state.pairDrawCount,
      interactiveDrawCount: state.interactiveDrawCount,
      settledDrawCount: state.settledDrawCount,
      legacyDrawCount: state.legacyDrawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawOk: state.lastDrawOk,
      lastDrawMode: state.lastDrawMode,
      lastDrawReason: state.lastDrawReason,
      lastDrawWidth: state.lastDrawWidth,
      lastDrawHeight: state.lastDrawHeight,
      lastDrawRenderWidth: state.lastDrawRenderWidth,
      lastDrawRenderHeight: state.lastDrawRenderHeight,
      lastDrawSamples: state.lastDrawSamples,
      lastDrawVisiblePixels: state.lastDrawVisiblePixels,
      lastDrawTransparentMissPixels: state.lastDrawTransparentMissPixels,
      lastDrawExpressionPixels: state.lastDrawExpressionPixels,
      lastDrawSurfaceAuthorityHits: state.lastDrawSurfaceAuthorityHits,
      lastDrawSurfaceAuthorityMisses: state.lastDrawSurfaceAuthorityMisses,
      lastDrawSurfaceAuthorityCalls: state.lastDrawSurfaceAuthorityCalls,
      lastDrawFallbackHexPixels: state.lastDrawFallbackHexPixels,
      lastDrawAuthorityHexPixels: state.lastDrawAuthorityHexPixels,
      lastDrawAuthoritySampleCacheHits: state.lastDrawAuthoritySampleCacheHits,
      lastDrawAuthoritySampleCacheMisses: state.lastDrawAuthoritySampleCacheMisses,
      lastDrawUsedScaledSurface: state.lastDrawUsedScaledSurface,
      lastDrawViewStateApplied: state.lastDrawViewStateApplied,
      lastDrawViewYaw: state.lastDrawViewYaw,
      lastDrawViewPitch: state.lastDrawViewPitch,
      lastDrawViewZoom: state.lastDrawViewZoom,
      lastDrawViewPhase: state.lastDrawViewPhase,
      lastDrawSphereProjectionFormula: state.lastDrawSphereProjectionFormula,
      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      previousFrameTranslated: false,
      lastError: state.lastError,

      lastCanvasNotifyOk: state.lastCanvasNotifyOk,
      lastCanvasNotifyMethod: state.lastCanvasNotifyMethod,

      supportsDrawPairFrame: true,
      supportsDrawInteractiveFrame: true,
      supportsDrawSettledFrame: true,
      supportsDrawHearthHexSurfaceFrame: true,
      supportsDrawFrame: true,
      supportsRender: true,
      supportsRenderFrame: true,
      supportsCanvasViewStateHandshake: true,
      supportsYawPitchZoomPhaseProjection: true,
      supportsSphereRecomputeDuringInteractiveMotion: true,
      supportsPerFrameHexAuthoritySampleCache: true,
      supportsSurfaceAuthorityExpressionCache: true,
      supportsInteractiveRenderScaling: true,
      supportsTransparentMissWhenSurfaceAuthorityAbsent: true,
      supportsGetStatus: true,
      supportsGetReceipt: true,
      supportsGetReceiptText: true,

      bodyBound: true,
      surfaceBound: true,
      highDensitySurfaceExpression: true,
      interactiveSurfaceExpression: true,
      canvasHubOnlyAwarenessUpdate: true,

      ownsCanvasHub: false,
      ownsHexAuthority: false,
      ownsSurfaceAuthority: false,
      ownsSurfacePointerBishop: false,
      ownsCanvasFingerSurface: false,
      ownsComposite: false,
      ownsCanvasMounting: false,
      ownsRouteOrchestration: false,
      ownsRuntimeRestart: false,
      ownsControls: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsMaterials: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,

      datasetPublishCount: state.datasetPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      updatedAt: state.updatedAt || nowIso(),

      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    state.receiptPublishCount += 1;

    return {
      ...getStatus(),
      packetType: "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_RECEIPT",
      destinationFile: FILE,
      purpose: [
        "Consume the Hex Four-Pair Authority as projection/address anchor.",
        "Consume Surface Pointer Bishop / Canvas Finger Surface as the renderable surface-expression authority.",
        "Render a body-bound visible planet surface only when Canvas Hub supplies a canvas/context.",
        "Apply yaw, pitch, zoom, and phase inside spherical projection.",
        "Render interactive drag/touch/wheel frames by recomputing the sphere rather than translating a bitmap.",
        "Remove the internal terrain/water fallback planet construct from Hex Surface.",
        "Return transparent/error-safe misses when surface authority is absent or rejects.",
        "Preserve renderer-only boundaries and no-claim posture."
      ],
      owns: [
        "visible frame projection",
        "interactive spherical projection",
        "settled spherical projection",
        "hex anchor consumption",
        "surface-expression consumption",
        "surface-expression-to-pixel rendering",
        "body-bound rendered frame receipts",
        "renderer-side view-state projection application"
      ],
      doesNotOwn: [
        "Canvas Hub",
        "Hex Four-Pair Authority",
        "Surface Pointer Bishop",
        "Canvas Finger Surface",
        "Composite",
        "land truth",
        "water truth",
        "air truth",
        "hydrology",
        "elevation",
        "materials",
        "atmosphere truth",
        "lighting truth",
        "canvas mounting",
        "runtime motion",
        "controls",
        "route orchestration",
        "diagnostic rail",
        "F13",
        "F21",
        "ready text",
        "final visual pass"
      ]
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getStatus();

    return [
      "HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("lineageV3Contract", r.lineageV3Contract),
      line("lineageV2Contract", r.lineageV2Contract),
      line("baselineContract", r.baselineContract),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("role", r.role),
      "",
      "PAIR_RENDERER",
      line("pairRendererActive", r.pairRendererActive),
      line("sphericalProjectionActive", r.sphericalProjectionActive),
      line("flatBitmapSlidingRejected", r.flatBitmapSlidingRejected),
      line("interactiveSphereRecomputationActive", r.interactiveSphereRecomputationActive),
      line("settledSphereRecomputationActive", r.settledSphereRecomputationActive),
      line("pairedCanvasHandshakeReady", r.pairedCanvasHandshakeReady),
      line("bitmapSlidingUsed", false),
      line("cssTranslationUsed", false),
      line("previousFrameTranslated", false),
      "",
      "FALLBACK_REMOVAL",
      line("internalFallbackPlanetRemoved", r.internalFallbackPlanetRemoved),
      line("internalTerrainConstructRemoved", r.internalTerrainConstructRemoved),
      line("internalWaterConstructRemoved", r.internalWaterConstructRemoved),
      line("surfaceExpressionAuthorityRequired", r.surfaceExpressionAuthorityRequired),
      line("transparentMissWhenSurfaceAuthorityAbsent", r.transparentMissWhenSurfaceAuthorityAbsent),
      "",
      "VIEW_STATE",
      line("viewStateAccepted", r.viewStateAccepted),
      line("viewStateSource", r.viewStateSource),
      line("viewYaw", r.viewYaw),
      line("viewPitch", r.viewPitch),
      line("viewZoom", r.viewZoom),
      line("viewPhase", r.viewPhase),
      line("viewStatePacketCount", r.viewStatePacketCount),
      line("viewStateRejectedCount", r.viewStateRejectedCount),
      line("viewStateRejectionReason", r.viewStateRejectionReason),
      "",
      "CANVAS_PAIR",
      line("canvasHubFile", r.canvasHubFile),
      line("canvasHubPresent", r.canvasHubPresent),
      line("canvasHubContract", r.canvasHubContract),
      line("canvasHubRecognized", r.canvasHubRecognized),
      line("canvasHubStatus", r.canvasHubStatus),
      "",
      "HEX_AUTHORITY_ANCHOR",
      line("requiredHexAuthorityContract", r.requiredHexAuthorityContract),
      line("requiredHexAuthorityReceipt", r.requiredHexAuthorityReceipt),
      line("requiredHexAuthorityFile", r.requiredHexAuthorityFile),
      line("hexAuthorityPresent", r.hexAuthorityPresent),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexAuthorityContractOk", r.hexAuthorityContractOk),
      line("hexAuthoritySampleOk", r.hexAuthoritySampleOk),
      line("hexAuthorityWideProbeOk", r.hexAuthorityWideProbeOk),
      line("hexAuthorityStatus", r.hexAuthorityStatus),
      "",
      "SURFACE_EXPRESSION_AUTHORITY",
      line("surfaceAuthorityFile", r.surfaceAuthorityFile),
      line("requiredSurfaceAuthorityContract", r.requiredSurfaceAuthorityContract),
      line("surfaceAuthorityPresent", r.surfaceAuthorityPresent),
      line("surfaceAuthoritySourcePath", r.surfaceAuthoritySourcePath),
      line("surfaceAuthorityContract", r.surfaceAuthorityContract),
      line("surfaceAuthorityRecognized", r.surfaceAuthorityRecognized),
      line("surfaceAuthorityMethod", r.surfaceAuthorityMethod),
      line("surfaceAuthoritySampleOk", r.surfaceAuthoritySampleOk),
      line("surfaceAuthorityStatus", r.surfaceAuthorityStatus),
      line("surfaceAuthorityLastError", r.surfaceAuthorityLastError),
      "",
      "DRAW",
      line("drawCount", r.drawCount),
      line("pairDrawCount", r.pairDrawCount),
      line("interactiveDrawCount", r.interactiveDrawCount),
      line("settledDrawCount", r.settledDrawCount),
      line("legacyDrawCount", r.legacyDrawCount),
      line("lastDrawAt", r.lastDrawAt),
      line("lastDrawOk", r.lastDrawOk),
      line("lastDrawMode", r.lastDrawMode),
      line("lastDrawReason", r.lastDrawReason),
      line("lastDrawWidth", r.lastDrawWidth),
      line("lastDrawHeight", r.lastDrawHeight),
      line("lastDrawRenderWidth", r.lastDrawRenderWidth),
      line("lastDrawRenderHeight", r.lastDrawRenderHeight),
      line("lastDrawSamples", r.lastDrawSamples),
      line("lastDrawVisiblePixels", r.lastDrawVisiblePixels),
      line("lastDrawTransparentMissPixels", r.lastDrawTransparentMissPixels),
      line("lastDrawExpressionPixels", r.lastDrawExpressionPixels),
      line("lastDrawSurfaceAuthorityHits", r.lastDrawSurfaceAuthorityHits),
      line("lastDrawSurfaceAuthorityMisses", r.lastDrawSurfaceAuthorityMisses),
      line("lastDrawSurfaceAuthorityCalls", r.lastDrawSurfaceAuthorityCalls),
      line("lastDrawAuthorityHexPixels", r.lastDrawAuthorityHexPixels),
      line("lastDrawFallbackHexPixels", r.lastDrawFallbackHexPixels),
      line("lastDrawAuthoritySampleCacheHits", r.lastDrawAuthoritySampleCacheHits),
      line("lastDrawAuthoritySampleCacheMisses", r.lastDrawAuthoritySampleCacheMisses),
      line("lastDrawUsedScaledSurface", r.lastDrawUsedScaledSurface),
      line("lastDrawViewStateApplied", r.lastDrawViewStateApplied),
      line("lastDrawSphereProjectionFormula", r.lastDrawSphereProjectionFormula),
      line("lastError", r.lastError),
      "",
      "BOUNDARY",
      line("ownsCanvasHub", false),
      line("ownsHexAuthority", false),
      line("ownsSurfaceAuthority", false),
      line("ownsSurfacePointerBishop", false),
      line("ownsCanvasFingerSurface", false),
      line("ownsComposite", false),
      line("ownsCanvasMounting", false),
      line("ownsRouteOrchestration", false),
      line("ownsRuntimeRestart", false),
      line("ownsControls", false),
      line("ownsLandTruth", false),
      line("ownsWaterTruth", false),
      line("ownsAirTruth", false),
      line("ownsHydrology", false),
      line("ownsElevation", false),
      line("ownsMaterials", false),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13EligibleForCanvas", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function publishGlobals(withReceipts = true) {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.hexSurface = api;
    root.HEARTH.hexSurfaceRenderer = api;
    root.HEARTH.hexSurfacePointerBishopExpressionRenderer = api;
    root.HEARTH.hexSurfaceInteractiveSpherePairRenderer = api;
    root.HEARTH.hexSurfacePlanetaryViewControlRenderer = api;

    root.DEXTER_LAB.hearthHexSurface = api;
    root.DEXTER_LAB.hearthHexSurfaceRenderer = api;
    root.DEXTER_LAB.hearthHexSurfacePointerBishopExpressionRenderer = api;
    root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer = api;
    root.DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer = api;

    root.HEARTH_HEX_SURFACE = api;
    root.HEARTH_HEX_SURFACE_RENDERER = api;
    root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_RENDERER = api;
    root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER = api;
    root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE = api;

    root.HEARTH_HEX_SURFACE_CONTRACT = CONTRACT;
    root.HEARTH_HEX_SURFACE_RECEIPT = RECEIPT;

    if (withReceipts) {
      const receipt = getReceipt();

      root.HEARTH_HEX_SURFACE_STATUS = getStatus();
      root.HEARTH_HEX_SURFACE_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT = receipt;

      root.HEARTH.hexSurfaceReceipt = receipt;
      root.HEARTH.hexSurfaceRendererReceipt = receipt;
      root.HEARTH.hexSurfacePointerBishopExpressionRendererReceipt = receipt;
      root.HEARTH.hexSurfaceInteractiveSpherePairRendererReceipt = receipt;
      root.HEARTH.hexSurfacePlanetaryViewControlRendererReceipt = receipt;

      root.DEXTER_LAB.hearthHexSurfaceReceipt = receipt;
      root.DEXTER_LAB.hearthHexSurfacePointerBishopExpressionRendererReceipt = receipt;
      root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRendererReceipt = receipt;
    }

    return api;
  }

  function dispose() {
    if (root.HEARTH && root.HEARTH.hexSurface === api) root.HEARTH.hexSurface = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceRenderer === api) root.HEARTH.hexSurfaceRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfacePointerBishopExpressionRenderer === api) root.HEARTH.hexSurfacePointerBishopExpressionRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceInteractiveSpherePairRenderer === api) root.HEARTH.hexSurfaceInteractiveSpherePairRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfacePlanetaryViewControlRenderer === api) root.HEARTH.hexSurfacePlanetaryViewControlRenderer = null;

    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurface === api) root.DEXTER_LAB.hearthHexSurface = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceRenderer === api) root.DEXTER_LAB.hearthHexSurfaceRenderer = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfacePointerBishopExpressionRenderer === api) root.DEXTER_LAB.hearthHexSurfacePointerBishopExpressionRenderer = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer === api) root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer = null;

    if (root.HEARTH_HEX_SURFACE === api) root.HEARTH_HEX_SURFACE = null;
    if (root.HEARTH_HEX_SURFACE_RENDERER === api) root.HEARTH_HEX_SURFACE_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_RENDERER === api) root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER === api) root.HEARTH_HEX_SURFACE_POINTER_BISHOP_EXPRESSION_CONSUMER_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER === api) root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER === api) root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = null;

    setDataset("hearthHexSurfaceRendererDisposed", "true");
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V3_CONTRACT,
    LINEAGE_V3_RECEIPT,
    LINEAGE_V2_CONTRACT,
    LINEAGE_V2_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    FILE,
    ROUTE,
    VERSION,
    REQUIRED_HEX_AUTHORITY_CONTRACT,
    REQUIRED_HEX_AUTHORITY_RECEIPT,
    REQUIRED_HEX_AUTHORITY_FILE,
    SURFACE_AUTHORITY_FILE,
    REQUIRED_SURFACE_AUTHORITY_CONTRACT,
    CANVAS_HUB_FILE,
    CURRENT_CANVAS_PUBLIC_CONTRACT,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV3Receipt: LINEAGE_V3_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hex-surface-pointer-bishop-expression-consumer-renderer",

    drawPairFrame,
    drawInteractiveFrame,
    drawSettledFrame,
    drawHearthHexSurfaceFrame,
    drawFrame,
    render,
    renderFrame,

    receiveCanvasViewState,
    consumeCanvasViewState,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receivePairCanvasHandshake,

    validateHexAuthority,
    validateSurfaceAuthority,
    validateCanvasHub,
    resolveSurfaceAuthority,
    resolveSurfaceAuthorityWithPath,
    notifyCanvasHub,
    updateDataset,
    publishGlobals,
    getStatus,
    getReceipt,
    getReceiptText,
    dispose,

    pairRendererActive: true,
    sphericalProjectionActive: true,
    flatBitmapSlidingRejected: true,
    interactiveSphereRecomputationActive: true,
    settledSphereRecomputationActive: true,
    pairedCanvasHandshakeReady: true,
    canvasHubOnlyAwarenessUpdate: true,
    bodyBound: true,
    surfaceBound: true,
    highDensitySurfaceExpression: true,
    interactiveSurfaceExpression: true,
    internalFallbackPlanetRemoved: true,
    internalTerrainConstructRemoved: true,
    internalWaterConstructRemoved: true,
    surfaceExpressionAuthorityRequired: true,
    transparentMissWhenSurfaceAuthorityAbsent: true,

    ownsCanvasHub: false,
    ownsHexAuthority: false,
    ownsSurfaceAuthority: false,
    ownsSurfacePointerBishop: false,
    ownsCanvasFingerSurface: false,
    ownsComposite: false,
    ownsCanvasMounting: false,
    ownsRouteOrchestration: false,
    ownsRuntimeRestart: false,
    ownsControls: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsHydrology: false,
    ownsElevation: false,
    ownsMaterials: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  };

  try {
    state.updatedAt = nowIso();

    validateHexAuthority();
    validateSurfaceAuthority();
    validateCanvasHub();

    const globalView = readGlobalViewState();
    if (globalView) normalizeViewState(globalView, {}, "INITIAL_GLOBAL_CANVAS_VIEW_STATE");

    updateDataset();
    publishGlobals(true);
  } catch (error) {
    state.lastError = error && error.message ? String(error.message) : String(error);
    state.updatedAt = nowIso();

    try {
      updateDataset();
      publishGlobals(false);
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
