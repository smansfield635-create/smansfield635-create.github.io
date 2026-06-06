// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4
// Full-file replacement.
// Hex Surface Renderer / paired interactive spherical renderer only.
// Purpose:
// - Preserve the v3 Hex Surface Renderer public API while renewing the renderer into a paired Canvas/Hex motion path.
// - Consume HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1 when available.
// - Accept Canvas Hub v12_3 / v12_3_1 / v12_2 / v12_1 / v12 lineage packets.
// - Expose paired renderer methods for Canvas:
//   1. drawPairFrame(packet, options)
//   2. drawInteractiveFrame(packet, options)
//   3. drawSettledFrame(packet, options)
// - Apply yaw, pitch, zoom, and phase inside spherical projection.
// - Prevent flat bitmap sliding by never translating the already-rendered planet image as the motion response.
// - Map every rendered pixel through:
//   screen x/y -> sphere x/y/z -> yaw/pitch/phase rotation -> lon/lat/u/v -> surface expression/color.
// - Use lower-cost spherical recomputation for active touch/drag/wheel frames.
// - Use higher-detail spherical recomputation for settled frames.
// - Preserve renderer-only ownership: no controls, no runtime loop, no DOM mounting, no route orchestration.
// - Preserve no F13, no F21, no ready text, no final visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - Canvas Hub
// - Hex Four-Pair Authority
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

  const CONTRACT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const RECEIPT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT_v4";

  const PREVIOUS_CONTRACT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_TNT_v3";
  const PREVIOUS_RECEIPT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT_v3";
  const LINEAGE_V2_CONTRACT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const LINEAGE_V2_RECEIPT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_RECEIPT_v2";
  const BASELINE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-06.hearth-hex-surface-interactive-sphere-pair-renderer-v4";

  const REQUIRED_HEX_AUTHORITY_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const REQUIRED_HEX_AUTHORITY_RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const REQUIRED_HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const CANVAS_HUB_FILE = "/assets/hearth/hearth.canvas.js";
  const CURRENT_CANVAS_PUBLIC_CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PAIR_CANVAS_INTERNAL_CONTRACT = "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    CURRENT_CANVAS_PUBLIC_CONTRACT,
    PAIR_CANVAS_INTERNAL_CONTRACT,
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
    interactiveMaxSide: 430,
    settledMaxSide: 760,
    interactiveHexDensity: 146,
    settledHexDensity: 238,
    interactiveAuthoritySampleLimit: 1600,
    settledAuthoritySampleLimit: 5200,
    hexEdgeStrength: 0.062,
    grainStrength: 0.31,
    materialStrength: 0.27,
    reliefStrength: 0.34,
    atmosphereStrength: 0.92,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84
  });

  const BODY_MASSES = Object.freeze([
    { key: "north-crown-mass", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG },
    { key: "equatorial-great-mass", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG },
    { key: "northwest-temperate-mass", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG },
    { key: "northeast-broken-shelf-mass", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG },
    { key: "southeast-warm-mass", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG },
    { key: "southwest-ridge-mass", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG },
    { key: "south-transitional-mass", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG }
  ]);

  const COLOR = Object.freeze({
    abyss: [2, 10, 28, 255],
    deep: [4, 28, 70, 255],
    ocean: [8, 68, 122, 255],
    shelf: [30, 128, 146, 255],
    foam: [104, 176, 170, 255],
    landLow: [86, 116, 70, 255],
    landWarm: [144, 132, 78, 255],
    landWet: [36, 104, 66, 255],
    ridge: [92, 88, 78, 255],
    granite: [138, 132, 118, 255],
    cliff: [42, 50, 60, 255],
    snow: [218, 230, 228, 255],
    copper: [158, 92, 60, 255],
    opal: [148, 194, 188, 255]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    planetId: PLANET_ID,
    planetLabel: PLANET_LABEL,
    role: "hex-surface-interactive-sphere-pair-renderer",

    rendererLoaded: true,
    rendererActive: true,
    apiReady: true,

    pairRendererActive: true,
    sphericalProjectionActive: true,
    flatBitmapSlidingRejected: true,
    interactiveSphereRecomputationActive: true,
    settledSphereRecomputationActive: true,
    pairedCanvasHandshakeReady: true,

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
    lastDrawLandPixels: 0,
    lastDrawWaterPixels: 0,
    lastDrawFallbackHexPixels: 0,
    lastDrawAuthorityHexPixels: 0,
    lastDrawAuthoritySampleCacheHits: 0,
    lastDrawAuthoritySampleCacheMisses: 0,
    lastDrawUsedScaledSurface: false,
    lastDrawViewStateApplied: false,
    lastDrawViewYaw: 0,
    lastDrawViewPitch: 0,
    lastDrawViewZoom: 1,
    lastDrawViewPhase: 0,
    lastDrawSphereProjectionFormula:
      "screen_xy_to_unit_sphere_xyz_to_yaw_pitch_phase_rotation_to_lon_lat_uv_to_surface_color",
    lastError: "",

    lastCanvasNotifyOk: false,
    lastCanvasNotifyMethod: "NONE",

    datasetPublishCount: 0,
    receiptPublishCount: 0,
    updatedAt: "",

    ownsCanvasHub: false,
    ownsHexAuthority: false,
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

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
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

  function hash2(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.54;
    let frequency = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2.03;
    }

    return total / Math.max(0.000001, norm);
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getCanvasVisibleProofReceipt",
      "getState"
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

  function resolveHexAuthority() {
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
    ]).value;
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
    const authority = resolveHexAuthority();
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
          purpose: "hex-surface-v4-validation",
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
    const view = normalizeViewState(t, o, `${mode.toUpperCase()}_PAIR_RENDER_VIEW`);

    const interactive =
      mode === "interactive" ||
      o.interactive === true ||
      t.interactive === true ||
      /interactive|drag|touch|pointer|wheel|keyboard|view-state/i.test(safeString(o.reason || t.reason || o.inputType || t.inputType || ""));

    const maxSide = interactive
      ? clamp(safeNumber(firstDefined(o.maxSide, o.maxInteractiveSide, DEFAULTS.interactiveMaxSide), DEFAULTS.interactiveMaxSide), 240, 640)
      : clamp(safeNumber(firstDefined(o.maxSide, o.maxSettledSide, DEFAULTS.settledMaxSide), DEFAULTS.settledMaxSide), 320, 1200);

    const hexDensity = interactive
      ? clamp(safeNumber(firstDefined(o.hexDensity, DEFAULTS.interactiveHexDensity), DEFAULTS.interactiveHexDensity), 90, 260)
      : clamp(safeNumber(firstDefined(o.hexDensity, DEFAULTS.settledHexDensity), DEFAULTS.settledHexDensity), 120, 560);

    const authoritySampleLimit = interactive
      ? clamp(safeNumber(firstDefined(o.maxAuthoritySamplesPerFrame, DEFAULTS.interactiveAuthoritySampleLimit), DEFAULTS.interactiveAuthoritySampleLimit), 256, 6000)
      : clamp(safeNumber(firstDefined(o.maxAuthoritySamplesPerFrame, DEFAULTS.settledAuthoritySampleLimit), DEFAULTS.settledAuthoritySampleLimit), 512, 20000);

    const zoomRadius = clamp(1 + ((view.zoom - 1) * 0.14), 0.92, 1.18);

    return {
      mode: interactive ? "interactive" : "settled",
      reason: safeString(o.reason || t.reason || `${mode}-pair-render`),
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
      hexEdgeStrength: clamp(safeNumber(firstDefined(o.hexEdgeStrength, DEFAULTS.hexEdgeStrength), DEFAULTS.hexEdgeStrength), 0, 0.24),
      grainStrength: clamp(safeNumber(firstDefined(o.grainStrength, DEFAULTS.grainStrength), DEFAULTS.grainStrength), 0, 0.9),
      materialStrength: clamp(safeNumber(firstDefined(o.materialStrength, DEFAULTS.materialStrength), DEFAULTS.materialStrength), 0, 0.8),
      reliefStrength: clamp(safeNumber(firstDefined(o.reliefStrength, DEFAULTS.reliefStrength), DEFAULTS.reliefStrength), 0, 0.9),
      atmosphereStrength: clamp(safeNumber(firstDefined(o.atmosphereStrength, DEFAULTS.atmosphereStrength), DEFAULTS.atmosphereStrength), 0, 1.6),
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

  function fallbackHexPacket(coord, q, r) {
    const stateId = Math.abs(((q * 37 + r * 19 + q * r * 7 + 113) | 0) % 256);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      fallbackHexAuthority: true,
      authorityHexPixel: false,
      cellId: `HEARTH_HEX_SURFACE_FALLBACK_Q${q}_R${r}`,
      hexId: `HEARTH_HEX_SURFACE_FALLBACK_Q${q}_R${r}`,
      q,
      r,
      s: -q - r,
      stateId,
      stateClass: `state-${String(stateId).padStart(3, "0")}`,
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

    if (authority && isFunction(authority.sample) && frameCache.authorityCalls < config.authoritySampleLimit) {
      frameCache.authorityCalls += 1;

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
          pairRendererActive: true,
          ...FINAL_FALSE
        });

        if (packet && typeof packet === "object") {
          const normalized = {
            ...packet,
            fallbackHexAuthority: false,
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

    const fallback = fallbackHexPacket(coord, q, r);
    frameCache.hex.set(cacheKey, fallback);
    return fallback;
  }

  function landField(coord) {
    let best = {
      field: -999,
      massKey: "",
      coast: 0,
      ridge: 0,
      basin: 0,
      mineral: 0
    };

    for (let i = 0; i < BODY_MASSES.length; i += 1) {
      const mass = BODY_MASSES[i];
      const dx = wrapPi(coord.lon - mass.lon) * Math.cos(mass.lat);
      const dy = coord.lat - mass.lat;
      const ca = Math.cos(mass.angle);
      const sa = Math.sin(mass.angle);
      const x = dx * ca - dy * sa;
      const y = dx * sa + dy * ca;
      const nx = x / mass.rx;
      const ny = y / mass.ry;
      const theta = Math.atan2(ny, nx);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const angularCut =
        Math.sin(theta * (5 + i) + i * 0.71) * 0.055 +
        Math.sin(theta * (9 + i) - i * 0.43) * 0.038;

      const fracture = (fbm(coord.u * 18 + i * 3.1, coord.v * 12 - i * 2.4, 710 + i * 53, 4) - 0.5) * 0.22;
      const bayCut = smoothstep(0.58, 0.92, fbm(coord.u * 36 - i * 2.7, coord.v * 26 + i * 4.2, 910 + i * 79, 3)) * 0.11;
      const field = 1 - dist + angularCut + fracture - bayCut;

      if (field > best.field) {
        const ridge = smoothstep(0.44, 0.91, fbm(coord.u * 12 + i, coord.v * 15 - i, 1200 + i * 41, 5));
        const basin = smoothstep(0.10, 0.38, 1 - ridge);
        const mineral = smoothstep(0.62, 0.96, fbm(coord.u * 44 + i * 2, coord.v * 41 - i * 3, 1500 + i * 83, 3));

        best = {
          field,
          massKey: mass.key,
          coast: smoothstep(0, 0.88, 1 - clamp(Math.abs(field) * 16, 0, 1)),
          ridge,
          basin,
          mineral
        };
      }
    }

    return best;
  }

  function fallbackExpression(coord, hexPacket, config) {
    const field = landField(coord);
    const isLand = field.field > 0;
    const stateId = safeNumber(hexPacket.stateId, 0);
    const grain = fbm(
      coord.u * 32 + stateId * 0.031,
      coord.v * 24 - stateId * 0.027,
      config.interactive ? 2201 : 2200,
      config.interactive ? 3 : 4
    );

    const latAbs = Math.abs(coord.latDegrees) / 90;
    const relief = isLand ? clamp01(field.ridge * 0.74 + grain * 0.26) : 0;
    const shelf = !isLand ? smoothstep(-0.24, 0.04, field.field) * (0.45 + grain * 0.35) : 0;
    const deep = !isLand ? clamp01(1 - shelf * 0.72) : 0;
    const cold = smoothstep(0.68, 0.98, latAbs);
    const arid = isLand ? smoothstep(0.62, 0.88, fbm(coord.u * 7, coord.v * 5, 2500, 3)) * (1 - cold * 0.4) : 0;
    const wet = isLand ? smoothstep(0.50, 0.86, fbm(coord.u * 9 + 8, coord.v * 8 - 4, 2600, 3)) * (1 - arid * 0.45) : 0;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "hex-surface-v4-fallback-expression",
      hubExpression: false,
      isLand,
      isWater: !isLand,
      massKey: field.massKey,
      field: field.field,
      coast: field.coast,
      ridge: field.ridge,
      relief,
      basin: field.basin,
      shelf,
      deep,
      cold,
      arid,
      wet,
      mineral: field.mineral,
      grain,
      bodyBound: true,
      surfaceBound: true,
      ...FINAL_FALSE
    };
  }

  function sampleHubExpression(coord, hexPacket) {
    const hub = resolveCanvasHub();

    if (!hub || !isFunction(hub.sampleHexSurfaceExpression)) return null;

    try {
      const packet = hub.sampleHexSurfaceExpression({
        contract: CONTRACT,
        receipt: RECEIPT,
        sourceFile: FILE,
        coord: {
          x: coord.x,
          y: coord.y,
          z: coord.z,
          u: coord.u,
          v: coord.v,
          lon: coord.lonDegrees,
          lat: coord.latDegrees
        },
        hexPacket: {
          cellId: hexPacket.cellId,
          hexId: hexPacket.hexId,
          stateId: hexPacket.stateId,
          q: hexPacket.q,
          r: hexPacket.r,
          s: hexPacket.s
        },
        ...FINAL_FALSE
      });

      if (packet && typeof packet === "object") return packet;
    } catch (_error) {}

    return null;
  }

  function normalizeExpression(value, coord, hexPacket, config) {
    const fallback = fallbackExpression(coord, hexPacket, config);

    if (!value || typeof value !== "object") return fallback;

    return {
      ...fallback,
      ...value,
      hubExpression: true,
      bodyBound: true,
      surfaceBound: true,
      f13Claimed: false,
      f13EligibleForCanvas: false,
      f13ClaimedByHexSurface: false,
      f21EligibleForNorth: false,
      f21Claimed: false,
      f21ClaimedByHexSurface: false,
      readyTextAllowed: false,
      readyTextClaimed: false,
      completionLatched: false,
      finalCompletionLatched: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webgl: false
    };
  }

  function composeColor(expression, coord, hexPacket, shade, config, edgeFactor) {
    const isLand = expression.isLand === true || safeNumber(expression.landPresence, 0) > 0.5;
    const stateId = safeNumber(hexPacket.stateId, 0);
    const stateSeed = (stateId + 1) / 257;
    const grain = clamp01(safeNumber(expression.grain, 0.5));
    const relief = clamp01(safeNumber(expression.relief, expression.ridge || 0));
    const coast = clamp01(safeNumber(expression.coast, 0));
    const mineral = clamp01(safeNumber(expression.mineral, 0));
    const cold = clamp01(safeNumber(expression.cold, 0));
    const arid = clamp01(safeNumber(expression.arid, 0));
    const wet = clamp01(safeNumber(expression.wet, 0));
    const shelf = clamp01(safeNumber(expression.shelf, 0));
    const deep = clamp01(safeNumber(expression.deep, 0.6));
    const basin = clamp01(safeNumber(expression.basin, 0));

    let color;

    if (Array.isArray(expression.rgb) && expression.rgb.length >= 3) {
      color = [
        clamp(Math.round(expression.rgb[0]), 0, 255),
        clamp(Math.round(expression.rgb[1]), 0, 255),
        clamp(Math.round(expression.rgb[2]), 0, 255),
        expression.rgb[3] === undefined ? 255 : clamp(Math.round(expression.rgb[3]), 0, 255)
      ];
    } else if (Array.isArray(expression.color) && expression.color.length >= 3) {
      color = [
        clamp(Math.round(expression.color[0]), 0, 255),
        clamp(Math.round(expression.color[1]), 0, 255),
        clamp(Math.round(expression.color[2]), 0, 255),
        expression.color[3] === undefined ? 255 : clamp(Math.round(expression.color[3]), 0, 255)
      ];
    } else if (isLand) {
      color = COLOR.landLow.slice();
      color = mixColor(color, COLOR.landWarm, arid * 0.42);
      color = mixColor(color, COLOR.landWet, wet * 0.38);
      color = mixColor(color, COLOR.ridge, relief * 0.34);
      color = mixColor(color, COLOR.granite, relief * relief * 0.30);
      color = mixColor(color, COLOR.cliff, clamp01(relief * coast) * 0.24);
      color = mixColor(color, COLOR.snow, cold * relief * 0.48);
      color = mixColor(color, COLOR.copper, mineral * 0.08);
      color = mixColor(color, COLOR.opal, mineral * coast * 0.10);
    } else {
      color = COLOR.ocean.slice();
      color = mixColor(color, COLOR.deep, deep * 0.55);
      color = mixColor(color, COLOR.abyss, deep * deep * 0.36);
      color = mixColor(color, COLOR.shelf, shelf * 0.58);
      color = mixColor(color, COLOR.foam, shelf * coast * 0.16);
    }

    const micro =
      (grain - 0.5) * config.grainStrength +
      (stateSeed - 0.5) * config.materialStrength +
      (relief - 0.5) * config.reliefStrength * (isLand ? 0.40 : 0.08);

    color = multiplyColor(color, clamp(1 + micro, 0.72, 1.28));

    const limb = clamp(0.50 + shade.depth * 0.56, 0.44, 1.08);
    const light = clamp(0.70 + shade.light * 0.43, 0.52, 1.16);
    const seam = clamp(1 - edgeFactor * config.hexEdgeStrength, 0.78, 1.04);
    const basinShade = isLand ? 1 - basin * 0.10 : 1;

    color = multiplyColor(color, limb * light * seam * basinShade);

    if (isLand && coast > 0.48) color = mixColor(color, COLOR.foam, (coast - 0.48) * 0.18);
    if (!isLand && shelf > 0.35) color = mixColor(color, COLOR.foam, shelf * coast * 0.08);

    return color;
  }

  function drawAtmosphere(ctx, width, height, cx, cy, radius, config) {
    const strength = config.atmosphereStrength * (config.interactive ? 0.74 : 1);

    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.33);
    glow.addColorStop(0, "rgba(112,194,255,0.02)");
    glow.addColorStop(0.46, `rgba(114,198,255,${0.18 * strength})`);
    glow.addColorStop(1, "rgba(30,48,100,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.33, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, radius * 0.012), 0, TAU);
    ctx.strokeStyle = `rgba(190,226,255,${0.28 * strength})`;
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();

    if (!config.interactive) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius + Math.max(2, radius * 0.036), 0, TAU);
      ctx.strokeStyle = `rgba(92,178,236,${0.10 * strength})`;
      ctx.lineWidth = Math.max(1, radius * 0.018);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderSphericalSurface(target, options, mode) {
    const resolved = resolveCanvasAndContext(target);

    if (!resolved.canvas || !resolved.ctx) {
      state.lastError = "HEARTH_HEX_SURFACE_V4_MISSING_CANVAS_OR_CONTEXT";
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
      state.lastError = "HEARTH_HEX_SURFACE_V4_INVALID_RENDER_SURFACE";
      state.lastDrawOk = false;
      state.updatedAt = nowIso();
      updateDataset();
      throw new Error(state.lastError);
    }

    validateHexAuthority();
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
      hexHits: 0,
      hexMisses: 0,
      authorityCalls: 0
    };

    let samples = 0;
    let landPixels = 0;
    let waterPixels = 0;
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
          const hubExpression = config.interactive ? null : sampleHubExpression(coord, hexPacket);
          const expression = normalizeExpression(hubExpression, coord, hexPacket, config);

          if (hexPacket.fallbackHexAuthority) fallbackHexPixels += 1;
          else authorityHexPixels += 1;

          if (expression.isLand === true || safeNumber(expression.landPresence, 0) > 0.5) landPixels += 1;
          else waterPixels += 1;

          const rawNormal = norm3(nx, -ny, z);
          const lightValue = clamp01(
            rawNormal.x * light.x +
            rawNormal.y * light.y +
            rawNormal.z * light.z
          );

          const color = composeColor(
            expression,
            coord,
            hexPacket,
            { light: lightValue, depth: z },
            config,
            hexEdge
          );

          const index = (py * renderWidth + px) * 4;

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];

          samples += 1;
        }
      }

      renderCtx.clearRect(0, 0, renderWidth, renderHeight);
      renderCtx.putImageData(image, 0, 0);
      drawAtmosphere(renderCtx, renderWidth, renderHeight, cx, cy, radius, config);

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
        lineageV2Contract: LINEAGE_V2_CONTRACT,
        lineageV2Receipt: LINEAGE_V2_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        baselineReceipt: BASELINE_RECEIPT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: "hex-surface-interactive-sphere-pair-renderer",
        packetType: "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDER_FRAME_RECEIPT",

        pairRendererActive: true,
        sphericalProjectionActive: true,
        flatBitmapSlidingRejected: true,
        interactiveSphereRecomputationActive: true,
        settledSphereRecomputationActive: true,
        pairedCanvasHandshakeReady: true,

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
        projectionFormula: "screen_xy_to_unit_sphere_xyz_to_yaw_pitch_phase_rotation_to_lon_lat_uv_to_surface_color",
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
        landPixels,
        waterPixels,
        fallbackHexPixels,
        authorityHexPixels,
        authoritySampleCacheHits: frameCache.hexHits,
        authoritySampleCacheMisses: frameCache.hexMisses,
        authoritySampleCalls: frameCache.authorityCalls,
        usedScaledSurface: surface.scaled,

        rendererDrewSurface: true,
        visibleSurfaceRendered: true,
        bodyBound: true,
        surfaceBound: true,
        highDensitySurfaceExpression: !config.interactive,
        interactiveSurfaceExpression: config.interactive,
        canvasHubOnlyAwarenessUpdate: true,

        ownsCanvasHub: false,
        ownsHexAuthority: false,
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
      state.lastDrawMode = config.interactive ? "INTERACTIVE_SPHERE_RECOMPUTE" : "SETTLED_SPHERE_RECOMPUTE";
      state.lastDrawReason = config.reason;
      state.lastDrawWidth = surface.width;
      state.lastDrawHeight = surface.height;
      state.lastDrawRenderWidth = renderWidth;
      state.lastDrawRenderHeight = renderHeight;
      state.lastDrawSamples = samples;
      state.lastDrawLandPixels = landPixels;
      state.lastDrawWaterPixels = waterPixels;
      state.lastDrawFallbackHexPixels = fallbackHexPixels;
      state.lastDrawAuthorityHexPixels = authorityHexPixels;
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
        canvas.dataset.hearthHexSurfaceRendererViewStateApplied = "true";
        canvas.dataset.hearthHexSurfaceRendererViewYaw = String(config.yaw);
        canvas.dataset.hearthHexSurfaceRendererViewPitch = String(config.pitch);
        canvas.dataset.hearthHexSurfaceRendererViewZoom = String(config.zoom);
        canvas.dataset.hearthHexSurfaceRendererViewPhase = String(config.viewPhase);
        canvas.dataset.hearthHexSurfaceRendererSamples = String(samples);
        canvas.dataset.hearthHexSurfaceRendererLandPixels = String(landPixels);
        canvas.dataset.hearthHexSurfaceRendererWaterPixels = String(waterPixels);
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
    return renderSphericalSurface(target, { ...options, interactive: true, reason: options.reason || "interactive-pair-frame" }, "interactive");
  }

  function drawSettledFrame(target, options = {}) {
    return renderSphericalSurface(target, { ...options, interactive: false, reason: options.reason || "settled-pair-frame" }, "settled");
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
    setDataset("hearthHexSurfaceRendererLastDrawLandPixels", String(state.lastDrawLandPixels));
    setDataset("hearthHexSurfaceRendererLastDrawWaterPixels", String(state.lastDrawWaterPixels));
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
    validateCanvasHub();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
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
      lastDrawLandPixels: state.lastDrawLandPixels,
      lastDrawWaterPixels: state.lastDrawWaterPixels,
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
      supportsInteractiveRenderScaling: true,
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
      packetType: "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT",
      destinationFile: FILE,
      purpose: [
        "Consume the Hex Four-Pair Authority when available.",
        "Render a body-bound visible planet surface only when Canvas Hub supplies a canvas/context.",
        "Accept yaw, pitch, zoom, and phase from Canvas Hub public draw state/options.",
        "Apply planetary view state inside spherical projection.",
        "Render interactive drag/touch/wheel frames by recomputing the sphere rather than translating a bitmap.",
        "Preserve renderer-only boundaries and no-claim posture."
      ],
      owns: [
        "visible surface rendering",
        "interactive spherical projection",
        "settled spherical projection",
        "hex authority consumption",
        "surface grain expression",
        "seam pressure expression",
        "body-bound rendered frame receipts",
        "renderer-side view-state projection application"
      ],
      doesNotOwn: [
        "Canvas Hub",
        "Hex Four-Pair Authority",
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
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
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
      "HEX_AUTHORITY",
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
      line("lastDrawLandPixels", r.lastDrawLandPixels),
      line("lastDrawWaterPixels", r.lastDrawWaterPixels),
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
    root.HEARTH.hexSurfaceInteractiveSpherePairRenderer = api;
    root.HEARTH.hexSurfacePlanetaryViewControlRenderer = api;

    root.DEXTER_LAB.hearthHexSurface = api;
    root.DEXTER_LAB.hearthHexSurfaceRenderer = api;
    root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer = api;
    root.DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer = api;

    root.HEARTH_HEX_SURFACE = api;
    root.HEARTH_HEX_SURFACE_RENDERER = api;
    root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE = api;

    root.HEARTH_HEX_SURFACE_CONTRACT = CONTRACT;
    root.HEARTH_HEX_SURFACE_RECEIPT = RECEIPT;

    if (withReceipts) {
      const receipt = getReceipt();

      root.HEARTH_HEX_SURFACE_STATUS = getStatus();
      root.HEARTH_HEX_SURFACE_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT = receipt;
      root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT_v3 = receipt;

      root.HEARTH.hexSurfaceReceipt = receipt;
      root.HEARTH.hexSurfaceRendererReceipt = receipt;
      root.HEARTH.hexSurfaceInteractiveSpherePairRendererReceipt = receipt;
      root.HEARTH.hexSurfacePlanetaryViewControlRendererReceipt = receipt;
      root.DEXTER_LAB.hearthHexSurfaceReceipt = receipt;
      root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRendererReceipt = receipt;
    }

    return api;
  }

  function dispose() {
    if (root.HEARTH && root.HEARTH.hexSurface === api) root.HEARTH.hexSurface = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceRenderer === api) root.HEARTH.hexSurfaceRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceInteractiveSpherePairRenderer === api) root.HEARTH.hexSurfaceInteractiveSpherePairRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfacePlanetaryViewControlRenderer === api) root.HEARTH.hexSurfacePlanetaryViewControlRenderer = null;

    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurface === api) root.DEXTER_LAB.hearthHexSurface = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceRenderer === api) root.DEXTER_LAB.hearthHexSurfaceRenderer = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer === api) root.DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer = null;

    if (root.HEARTH_HEX_SURFACE === api) root.HEARTH_HEX_SURFACE = null;
    if (root.HEARTH_HEX_SURFACE_RENDERER === api) root.HEARTH_HEX_SURFACE_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER === api) root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER === api) root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = null;

    setDataset("hearthHexSurfaceRendererDisposed", "true");
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
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
    CANVAS_HUB_FILE,
    CURRENT_CANVAS_PUBLIC_CONTRACT,
    PAIR_CANVAS_INTERNAL_CONTRACT,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    lineageV2Receipt: LINEAGE_V2_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hex-surface-interactive-sphere-pair-renderer",

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
    validateCanvasHub,
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

    ownsCanvasHub: false,
    ownsHexAuthority: false,
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
