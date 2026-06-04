// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_TNT_v3
// Full-file replacement.
// Hex Surface Renderer only.
// Purpose:
// - Preserve the v2 Hex Surface Renderer body-bound visible-expression path.
// - Consume HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1.
// - Recognize Canvas Hub v12_1 planetary view-control receiver as current.
// - Preserve Canvas Hub v12 as lineage.
// - Accept yaw, pitch, zoom, and phase from Canvas Hub public draw state/options.
// - Apply view state directly inside the rendered surface projection.
// - Reduce per-frame latency by caching per-hex authority samples during each draw.
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

  const CONTRACT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_TNT_v3";
  const RECEIPT = "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const PREVIOUS_RECEIPT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_RECEIPT_v2";
  const BASELINE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-04.hearth-hex-surface-planetary-view-control-renderer-handshake-v3";

  const REQUIRED_HEX_AUTHORITY_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const REQUIRED_HEX_AUTHORITY_RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const REQUIRED_HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const CURRENT_CANVAS_HUB_CONTRACT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const CURRENT_CANVAS_HUB_RECEIPT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT_v12_1";
  const LINEAGE_CANVAS_HUB_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_CANVAS_HUB_RECEIPT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12";
  const CANVAS_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const DEFAULTS = Object.freeze({
    radiusRatio: 0.456,
    axialTilt: -0.22,
    phase: 0,
    yaw: 0,
    pitch: 0,
    zoom: 1,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4,
    hexDensity: 238,
    hexEdgeStrength: 0.065,
    grainStrength: 0.32,
    materialStrength: 0.28,
    reliefStrength: 0.34,
    atmosphereStrength: 0.92,
    lightX: -0.48,
    lightY: 0.28,
    lightZ: 0.84,
    maxInteractiveSide: 768,
    maxAuthoritySamplesPerFrame: 4200
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
    opal: [148, 194, 188, 255],
    shadow: [10, 14, 22, 255],
    atmosphere: [154, 214, 248, 255]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    planetId: PLANET_ID,
    planetLabel: PLANET_LABEL,
    role: "Hex Surface Renderer / Planetary View-Control Renderer Handshake",

    rendererLoaded: true,
    rendererActive: true,
    apiReady: true,

    canvasHubCompatible: true,
    currentCanvasHubContract: CURRENT_CANVAS_HUB_CONTRACT,
    currentCanvasHubReceipt: CURRENT_CANVAS_HUB_RECEIPT,
    lineageCanvasHubContract: LINEAGE_CANVAS_HUB_CONTRACT,
    lineageCanvasHubReceipt: LINEAGE_CANVAS_HUB_RECEIPT,
    canvasHubFile: CANVAS_HUB_FILE,

    requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
    requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
    requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,

    hexAuthorityPresent: false,
    hexAuthorityContract: "",
    hexAuthorityReceipt: "",
    hexAuthorityContractOk: false,
    hexAuthoritySampleOk: false,
    hexAuthorityWideProbeOk: false,

    canvasHubPresent: false,
    canvasHubContract: "",
    canvasHubReceipt: "",
    canvasHubCurrentRecognized: false,
    canvasHubLineageAccepted: false,
    canvasHubStatus: "UNKNOWN",

    planetaryViewRendererHandshakeActive: true,
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
    lastDrawAt: "",
    lastDrawOk: false,
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
    lastDrawUsedInteractiveScale: false,
    lastDrawViewStateApplied: false,
    lastDrawViewYaw: 0,
    lastDrawViewPitch: 0,
    lastDrawViewZoom: 1,
    lastDrawViewPhase: 0,

    lastHubNotifyOk: false,
    lastHubNotifyMethod: "NONE",
    lastError: "",
    updatedAt: nowIso(),

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

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
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
    const number = safeNumber(value, 0);
    return ((number % 1) + 1) % 1;
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
    return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
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

  function contractOf(candidate) {
    if (!candidate || typeof candidate !== "object") return "";
    return safeString(candidate.contract || candidate.CONTRACT || candidate.currentContract || candidate.canvasContract || "");
  }

  function receiptOf(candidate) {
    if (!candidate || typeof candidate !== "object") return "";
    return safeString(candidate.receipt || candidate.RECEIPT || candidate.currentReceipt || candidate.canvasReceipt || "");
  }

  function readReceipt(candidate) {
    if (!candidate || typeof candidate !== "object") return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getControlViewReceipt",
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function resolveHexAuthority() {
    const candidates = [
      root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEX_FOUR_PAIR_AUTHORITY,
      root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH && root.HEARTH.hexFourPairAuthority,
      root.HEARTH && root.HEARTH.hexAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthHexFourPairAuthority
    ];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === "object") return candidate;
    }

    return null;
  }

  function resolveCanvasHub() {
    const candidates = [
      root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER,
      root.HEARTH_CANVAS,
      root.HEARTH_CANVAS_HUB,
      root.HEARTH_CANVAS_AUTHORITY,
      root.HEARTH && root.HEARTH.canvasPlanetaryViewControlReceiver,
      root.HEARTH && root.HEARTH.canvas,
      root.HEARTH && root.HEARTH.canvasHub,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvas
    ];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === "object") return candidate;
    }

    return null;
  }

  function validateHexAuthority() {
    const authority = resolveHexAuthority();
    const receipt = readReceipt(authority) || authority || {};
    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
      requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
      authorityPresent: Boolean(authority),
      authorityContract: contractOf(receipt || authority),
      authorityReceipt: receiptOf(receipt || authority),
      contractOk: false,
      receiptOk: false,
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

    result.contractOk = result.authorityContract === REQUIRED_HEX_AUTHORITY_CONTRACT;
    result.receiptOk = !result.authorityReceipt || result.authorityReceipt === REQUIRED_HEX_AUTHORITY_RECEIPT;

    if (!authority || !isFunction(authority.sample)) {
      result.status = "MISSING";
      updateHexAuthorityState(result);
      return result;
    }

    try {
      const sample = authority.sample({ u: 0.5, v: 0.5 });

      result.sampleOk = Boolean(sample && typeof sample === "object");
      result.fourPairOk = Boolean(
        sample &&
        sample.everyPixelHasFourPairSet === true &&
        Array.isArray(sample.fourPairSet) &&
        sample.fourPairSet.length === 4
      );
      result.bodyBoundOk = Boolean(
        sample &&
        sample.bodyBound === true &&
        sample.surfaceBound === true &&
        sample.floatsAboveBody === false &&
        sample.allowedToFloat === false
      );

      if (isFunction(authority.wideProbe)) {
        const probe = authority.wideProbe({ rows: 5, columns: 9 });
        result.wideProbeTotal = safeNumber(probe && probe.total, 0);
        result.wideProbeFailedCount = safeNumber(probe && probe.failedCount, 0);
        result.wideProbeOk = Boolean(
          probe &&
          probe.wideProbeReady === true &&
          probe.everyPixelHasNorthSouthEastWest === true &&
          probe.everyPixelHasFourPairSet === true &&
          result.wideProbeTotal >= 25 &&
          result.wideProbeFailedCount === 0
        );
      }
    } catch (error) {
      result.error = error && error.message ? String(error.message) : String(error);
    }

    result.status = result.authorityPresent && result.contractOk && result.sampleOk && result.fourPairOk && result.bodyBoundOk
      ? "PASS"
      : "DEGRADED";

    updateHexAuthorityState(result);
    return result;
  }

  function updateHexAuthorityState(result) {
    state.hexAuthorityPresent = Boolean(result.authorityPresent);
    state.hexAuthorityContract = safeString(result.authorityContract);
    state.hexAuthorityReceipt = safeString(result.authorityReceipt);
    state.hexAuthorityContractOk = Boolean(result.contractOk);
    state.hexAuthoritySampleOk = Boolean(result.sampleOk);
    state.hexAuthorityWideProbeOk = Boolean(result.wideProbeOk);
  }

  function validateCanvasHub() {
    const hub = resolveCanvasHub();
    const receipt = readReceipt(hub) || hub || {};
    const hubContract = contractOf(receipt || hub);
    const hubReceipt = receiptOf(receipt || hub);

    const current = hubContract === CURRENT_CANVAS_HUB_CONTRACT || hubReceipt === CURRENT_CANVAS_HUB_RECEIPT;
    const lineage = hubContract === LINEAGE_CANVAS_HUB_CONTRACT || hubReceipt === LINEAGE_CANVAS_HUB_RECEIPT;

    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      currentCanvasHubContract: CURRENT_CANVAS_HUB_CONTRACT,
      lineageCanvasHubContract: LINEAGE_CANVAS_HUB_CONTRACT,
      hubPresent: Boolean(hub),
      hubContract,
      hubReceipt,
      currentRecognized: current,
      lineageAccepted: lineage,
      status: "MISSING",
      ...FINAL_FALSE
    };

    result.status = result.hubPresent
      ? current
        ? "PASS_CURRENT_V12_1"
        : lineage
          ? "PASS_LINEAGE_V12"
          : "PRESENT_DIFFERENT_CONTRACT"
      : "MISSING";

    state.canvasHubPresent = result.hubPresent;
    state.canvasHubContract = hubContract;
    state.canvasHubReceipt = hubReceipt;
    state.canvasHubCurrentRecognized = current;
    state.canvasHubLineageAccepted = lineage;
    state.canvasHubStatus = result.status;

    return result;
  }

  function normalizeViewState(raw, source) {
    const input = isObject(raw) ? raw : {};
    const nested = isObject(input.viewState) ? input.viewState : input;

    const yaw = safeNumber(nested.yaw ?? input.yaw ?? DEFAULTS.yaw, DEFAULTS.yaw);
    const pitch = clamp(
      safeNumber(nested.pitch ?? input.pitch ?? DEFAULTS.pitch, DEFAULTS.pitch),
      safeNumber(nested.minPitch ?? input.minPitch ?? DEFAULTS.minPitch, DEFAULTS.minPitch),
      safeNumber(nested.maxPitch ?? input.maxPitch ?? DEFAULTS.maxPitch, DEFAULTS.maxPitch)
    );
    const zoom = clamp(
      safeNumber(nested.zoom ?? input.zoom ?? DEFAULTS.zoom, DEFAULTS.zoom),
      safeNumber(nested.minZoom ?? input.minZoom ?? DEFAULTS.minZoom, DEFAULTS.minZoom),
      safeNumber(nested.maxZoom ?? input.maxZoom ?? DEFAULTS.maxZoom, DEFAULTS.maxZoom)
    );
    const phase = safeNumber(nested.phase ?? input.phase ?? DEFAULTS.phase, DEFAULTS.phase);

    return {
      yaw,
      pitch,
      zoom,
      phase,
      minPitch: safeNumber(nested.minPitch ?? input.minPitch ?? DEFAULTS.minPitch, DEFAULTS.minPitch),
      maxPitch: safeNumber(nested.maxPitch ?? input.maxPitch ?? DEFAULTS.maxPitch, DEFAULTS.maxPitch),
      minZoom: safeNumber(nested.minZoom ?? input.minZoom ?? DEFAULTS.minZoom, DEFAULTS.minZoom),
      maxZoom: safeNumber(nested.maxZoom ?? input.maxZoom ?? DEFAULTS.maxZoom, DEFAULTS.maxZoom),
      source: source || "UNKNOWN"
    };
  }

  function readGlobalViewState() {
    const candidates = [
      root.HEARTH_CANVAS_VIEW_STATE,
      root.HEARTH_CANVAS_LAST_VIEW_PACKET,
      root.HEARTH && root.HEARTH.canvasViewState,
      root.HEARTH && root.HEARTH.canvasLastViewPacket,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvasViewState
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return normalizeViewState(candidate, "GLOBAL_CANVAS_VIEW_STATE");
    }

    return null;
  }

  function resolveViewState(target, options) {
    const optionView = isObject(options) && (
      isObject(options.viewState) ||
      options.yaw !== undefined ||
      options.pitch !== undefined ||
      options.zoom !== undefined ||
      options.phase !== undefined
    )
      ? normalizeViewState(options.viewState || options, "DRAW_OPTIONS")
      : null;

    const targetView = isObject(target) && (
      isObject(target.viewState) ||
      target.yaw !== undefined ||
      target.pitch !== undefined ||
      target.zoom !== undefined ||
      target.phase !== undefined
    )
      ? normalizeViewState(target.viewState || target, "CANVAS_HUB_DRAW_STATE")
      : null;

    const globalView = readGlobalViewState();

    const resolved = optionView || targetView || globalView || normalizeViewState({}, "DEFAULT_VIEW_STATE");

    state.viewStateAccepted = true;
    state.viewStateSource = resolved.source;
    state.viewYaw = resolved.yaw;
    state.viewPitch = resolved.pitch;
    state.viewZoom = resolved.zoom;
    state.viewPhase = resolved.phase;
    state.viewStateLastAcceptedAt = nowIso();
    state.viewStatePacketCount += 1;
    state.viewStateRejectionReason = "";

    return resolved;
  }

  function normalizeOptions(target, options = {}) {
    const view = resolveViewState(target, options);

    const interactive = safeString(options.reason || options.mode || target && target.mode || "").toLowerCase().includes("control") ||
      safeString(options.inputType || "").toLowerCase().includes("drag") ||
      safeString(options.inputType || "").toLowerCase().includes("pointer") ||
      state.viewStatePacketCount > 1;

    const zoomRadius = clamp(1 + ((view.zoom - 1) * 0.14), 0.92, 1.18);

    return {
      radiusRatio: clamp(safeNumber(options.radiusRatio ?? DEFAULTS.radiusRatio, DEFAULTS.radiusRatio) * zoomRadius, 0.32, 0.49),
      axialTilt: safeNumber(options.axialTilt ?? DEFAULTS.axialTilt, DEFAULTS.axialTilt) + view.pitch * 0.38,
      phase: safeNumber(options.phase ?? DEFAULTS.phase, DEFAULTS.phase) + view.phase + view.yaw,
      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      viewPhase: view.phase,
      viewSource: view.source,
      hexDensity: clamp(options.hexDensity ?? DEFAULTS.hexDensity, 120, 560),
      hexEdgeStrength: clamp(options.hexEdgeStrength ?? DEFAULTS.hexEdgeStrength, 0, 0.24),
      grainStrength: clamp(options.grainStrength ?? DEFAULTS.grainStrength, 0, 0.9),
      materialStrength: clamp(options.materialStrength ?? DEFAULTS.materialStrength, 0, 0.8),
      reliefStrength: clamp(options.reliefStrength ?? DEFAULTS.reliefStrength, 0, 0.9),
      atmosphereStrength: clamp(options.atmosphereStrength ?? DEFAULTS.atmosphereStrength, 0, 1.6),
      lightX: safeNumber(options.lightX ?? DEFAULTS.lightX, DEFAULTS.lightX),
      lightY: safeNumber(options.lightY ?? DEFAULTS.lightY, DEFAULTS.lightY),
      lightZ: safeNumber(options.lightZ ?? DEFAULTS.lightZ, DEFAULTS.lightZ),
      interactive,
      maxInteractiveSide: clamp(options.maxInteractiveSide ?? DEFAULTS.maxInteractiveSide, 320, 1024),
      maxAuthoritySamplesPerFrame: clamp(options.maxAuthoritySamplesPerFrame ?? DEFAULTS.maxAuthoritySamplesPerFrame, 256, 20000)
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
      authority: "Hex Surface Renderer fallback cell address",
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
      everyPixelHasNorthSouthEastWest: false,
      everyPixelHasFourPairSet: false,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function sampleHexAuthority(coord, q, r, frameCache, config) {
    const cacheKey = `${q}:${r}:${Math.round(coord.u * 96)}:${Math.round(coord.v * 48)}`;

    if (frameCache.hex.has(cacheKey)) {
      frameCache.hexHits += 1;
      return frameCache.hex.get(cacheKey);
    }

    frameCache.hexMisses += 1;

    const authority = resolveHexAuthority();

    if (authority && isFunction(authority.sample) && frameCache.hexMisses <= config.maxAuthoritySamplesPerFrame) {
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
          rendererContract: CONTRACT,
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

  function fallbackExpression(coord, hexPacket) {
    const field = landField(coord);
    const isLand = field.field > 0;
    const latAbs = Math.abs(coord.latDegrees) / 90;
    const grain = fbm(coord.u * 32 + safeNumber(hexPacket.stateId, 0) * 0.031, coord.v * 24 - safeNumber(hexPacket.stateId, 0) * 0.027, 2200, 4);
    const relief = isLand ? clamp01(field.ridge * 0.74 + grain * 0.26) : 0;
    const shelf = !isLand ? smoothstep(-0.24, 0.04, field.field) * (0.45 + grain * 0.35) : 0;
    const deep = !isLand ? clamp01(1 - shelf * 0.72) : 0;
    const cold = smoothstep(0.68, 0.98, latAbs);
    const arid = isLand ? smoothstep(0.62, 0.88, fbm(coord.u * 7, coord.v * 5, 2500, 3)) * (1 - cold * 0.4) : 0;
    const wet = isLand ? smoothstep(0.50, 0.86, fbm(coord.u * 9 + 8, coord.v * 8 - 4, 2600, 3)) * (1 - arid * 0.45) : 0;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "hex-surface-renderer-fallback-expression",
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

  function normalizeExpression(value, coord, hexPacket) {
    const fallback = fallbackExpression(coord, hexPacket);

    if (!value || typeof value !== "object") return fallback;

    return {
      ...fallback,
      ...value,
      hubExpression: true,
      bodyBound: true,
      surfaceBound: true,
      f13Claimed: false,
      f21EligibleForNorth: false,
      f21Claimed: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function composeColor(expression, coord, hexPacket, shade, config, edgeFactor) {
    const isLand = expression.isLand === true || expression.landPresence > 0.5;
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
    const strength = config.atmosphereStrength;

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

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, radius * 0.036), 0, TAU);
    ctx.strokeStyle = `rgba(92,178,236,${0.10 * strength})`;
    ctx.lineWidth = Math.max(1, radius * 0.018);
    ctx.stroke();

    ctx.restore();
  }

  function resolveCanvasAndContext(target) {
    const canvas = target && target.canvas
      ? target.canvas
      : target && target.nodeName && String(target.nodeName).toLowerCase() === "canvas"
        ? target
        : null;

    const ctx = target && target.ctx
      ? target.ctx
      : target && target.context
        ? target.context
        : canvas && isFunction(canvas.getContext)
          ? canvas.getContext("2d", { alpha: true, willReadFrequently: true })
          : null;

    return { canvas, ctx };
  }

  function createRenderSurface(width, height, config) {
    const maxSide = config.interactive ? config.maxInteractiveSide : Math.max(width, height);
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const renderWidth = Math.max(1, Math.round(width * scale));
    const renderHeight = Math.max(1, Math.round(height * scale));

    if (scale >= 0.999) {
      return {
        width,
        height,
        scale: 1,
        scaled: false,
        canvas: null,
        ctx: null
      };
    }

    let surfaceCanvas = null;
    let surfaceCtx = null;

    if (doc && isFunction(doc.createElement)) {
      surfaceCanvas = doc.createElement("canvas");
      surfaceCanvas.width = renderWidth;
      surfaceCanvas.height = renderHeight;
      surfaceCtx = surfaceCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    }

    if (!surfaceCtx && typeof OffscreenCanvas !== "undefined") {
      surfaceCanvas = new OffscreenCanvas(renderWidth, renderHeight);
      surfaceCtx = surfaceCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    }

    if (!surfaceCtx) {
      return {
        width,
        height,
        scale: 1,
        scaled: false,
        canvas: null,
        ctx: null
      };
    }

    return {
      width: renderWidth,
      height: renderHeight,
      scale,
      scaled: true,
      canvas: surfaceCanvas,
      ctx: surfaceCtx
    };
  }

  function drawHearthHexSurfaceFrame(target, options = {}) {
    const resolved = resolveCanvasAndContext(target);
    const canvas = resolved.canvas;
    const destinationCtx = resolved.ctx;

    if (!canvas || !destinationCtx) {
      state.lastError = "HEARTH_HEX_SURFACE_MISSING_CANVAS_OR_CONTEXT";
      state.lastDrawOk = false;
      state.updatedAt = nowIso();
      updateDataset();
      throw new Error(state.lastError);
    }

    const width = Math.max(1, Math.round(safeNumber(canvas.width, 0)));
    const height = Math.max(1, Math.round(safeNumber(canvas.height, 0)));

    if (!width || !height) {
      state.lastError = "HEARTH_HEX_SURFACE_MISSING_CANVAS_SIZE";
      state.lastDrawOk = false;
      state.updatedAt = nowIso();
      updateDataset();
      throw new Error(state.lastError);
    }

    const config = normalizeOptions(target || {}, options || {});
    const surface = createRenderSurface(width, height, config);
    const renderCtx = surface.ctx || destinationCtx;
    const renderWidth = surface.width;
    const renderHeight = surface.height;

    const minSide = Math.min(renderWidth, renderHeight);
    const radius = minSide * config.radiusRatio;
    const cx = renderWidth / 2;
    const cy = renderHeight / 2;
    const hexRadius = clamp(minSide / config.hexDensity, 0.55, 5.5);
    const light = norm3(config.lightX, config.lightY, config.lightZ);

    const hexValidation = validateHexAuthority();
    const hubValidation = validateCanvasHub();

    const image = renderCtx.createImageData(renderWidth, renderHeight);
    const data = image.data;

    const frameCache = {
      hex: new Map(),
      hexHits: 0,
      hexMisses: 0
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
          let vector = { x: nx, y: -ny, z };

          vector = rotateX(vector, config.axialTilt);
          vector = rotateY(vector, config.phase);

          const coord = vectorToCoordinate(vector);
          const center = nearestHexCenter(xRaw, yRaw, hexRadius);
          const localX = xRaw - center.x;
          const localY = yRaw - center.y;
          const hexEdge = smoothstep(0.78, 1.08, hexDistance(localX, localY, hexRadius));

          const hexPacket = sampleHexAuthority(coord, center.q, center.r, frameCache, config);
          const hubExpression = sampleHubExpression(coord, hexPacket);
          const expression = normalizeExpression(hubExpression, coord, hexPacket);

          if (hexPacket.fallbackHexAuthority) fallbackHexPixels += 1;
          else authorityHexPixels += 1;

          if (expression.isLand === true || expression.landPresence > 0.5) landPixels += 1;
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
        destinationCtx.clearRect(0, 0, width, height);
        destinationCtx.imageSmoothingEnabled = true;
        destinationCtx.drawImage(surface.canvas, 0, 0, width, height);
        destinationCtx.restore();
      }

      const receipt = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        baselineReceipt: BASELINE_RECEIPT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: "Hex Surface Renderer / Planetary View-Control Renderer Handshake",
        packetType: "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDER_FRAME_RECEIPT",

        canvasHubCompatible: true,
        currentCanvasHubContract: CURRENT_CANVAS_HUB_CONTRACT,
        currentCanvasHubReceipt: CURRENT_CANVAS_HUB_RECEIPT,
        lineageCanvasHubContract: LINEAGE_CANVAS_HUB_CONTRACT,
        canvasHubFile: CANVAS_HUB_FILE,
        canvasHubPresent: hubValidation.hubPresent,
        canvasHubCurrentRecognized: hubValidation.currentRecognized,
        canvasHubLineageAccepted: hubValidation.lineageAccepted,
        canvasHubStatus: hubValidation.status,

        requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
        requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
        requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
        hexAuthorityPresent: hexValidation.authorityPresent,
        hexAuthorityContractOk: hexValidation.contractOk,
        hexAuthoritySampleOk: hexValidation.sampleOk,
        hexAuthorityWideProbeOk: hexValidation.wideProbeOk,

        planetaryViewRendererHandshakeActive: true,
        viewStateAccepted: state.viewStateAccepted,
        viewStateSource: state.viewStateSource,
        viewYaw: config.yaw,
        viewPitch: config.pitch,
        viewZoom: config.zoom,
        viewPhase: config.viewPhase,
        viewStateAppliedToProjection: true,

        width,
        height,
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
        usedInteractiveScale: surface.scaled,

        rendererDrewSurface: true,
        rendererOwnsMounting: false,
        rendererOwnsCanvasHub: false,
        rendererOwnsHexAuthority: false,
        rendererOwnsTruth: false,
        rendererOwnsRuntimeMotion: false,
        rendererOwnsControls: false,
        rendererOwnsFinalPass: false,

        bodyBound: true,
        surfaceBound: true,
        visibleSurfaceRendered: true,
        highDensitySurfaceExpression: true,
        pixelAuthorityConsumed: hexValidation.authorityPresent === true,
        canvasHubOnlyAwarenessUpdate: true,

        ...FINAL_FALSE,
        updatedAt: nowIso()
      };

      state.drawCount += 1;
      state.lastDrawAt = receipt.updatedAt;
      state.lastDrawOk = true;
      state.lastDrawWidth = width;
      state.lastDrawHeight = height;
      state.lastDrawRenderWidth = renderWidth;
      state.lastDrawRenderHeight = renderHeight;
      state.lastDrawSamples = samples;
      state.lastDrawLandPixels = landPixels;
      state.lastDrawWaterPixels = waterPixels;
      state.lastDrawFallbackHexPixels = fallbackHexPixels;
      state.lastDrawAuthorityHexPixels = authorityHexPixels;
      state.lastDrawAuthoritySampleCacheHits = frameCache.hexHits;
      state.lastDrawAuthoritySampleCacheMisses = frameCache.hexMisses;
      state.lastDrawUsedInteractiveScale = surface.scaled;
      state.lastDrawViewStateApplied = true;
      state.lastDrawViewYaw = config.yaw;
      state.lastDrawViewPitch = config.pitch;
      state.lastDrawViewZoom = config.zoom;
      state.lastDrawViewPhase = config.viewPhase;
      state.lastError = "";
      state.updatedAt = receipt.updatedAt;

      updateDataset(receipt);
      publishGlobals();
      notifyCanvasHub(receipt);

      if (canvas.dataset) {
        canvas.dataset.hearthHexSurfaceRenderer = "true";
        canvas.dataset.hearthHexSurfaceRendererContract = CONTRACT;
        canvas.dataset.hearthHexSurfaceRendererReceipt = RECEIPT;
        canvas.dataset.hearthHexSurfaceRendererFile = FILE;
        canvas.dataset.hearthHexSurfaceRendererDrawOk = "true";
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

      return receipt;
    } catch (error) {
      state.lastDrawOk = false;
      state.lastError = error && error.message ? String(error.message) : String(error);
      state.updatedAt = nowIso();
      updateDataset();
      publishGlobals();
      throw error;
    }
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

    const normalized = normalizeViewState(packet, "DIRECT_CANVAS_VIEW_STATE_PACKET");

    state.viewStateAccepted = true;
    state.viewStateSource = normalized.source;
    state.viewYaw = normalized.yaw;
    state.viewPitch = normalized.pitch;
    state.viewZoom = normalized.zoom;
    state.viewPhase = normalized.phase;
    state.viewStateLastAcceptedAt = nowIso();
    state.viewStatePacketCount += 1;
    state.viewStateRejectionReason = "";

    updateDataset();
    publishGlobals();

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

  function notifyCanvasHub(packet) {
    const hub = resolveCanvasHub();

    state.lastHubNotifyOk = false;
    state.lastHubNotifyMethod = "NONE";

    if (!hub || typeof hub !== "object") return false;

    const methods = [
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
          ...FINAL_FALSE
        });

        state.lastHubNotifyOk = true;
        state.lastHubNotifyMethod = method;
        state.updatedAt = nowIso();
        return true;
      } catch (error) {
        state.lastHubNotifyOk = false;
        state.lastHubNotifyMethod = `${method}:ERROR`;
        state.lastError = error && error.message ? String(error.message) : String(error);
        state.updatedAt = nowIso();
        return false;
      }
    }

    return false;
  }

  function getStatus() {
    const hexValidation = validateHexAuthority();
    const hubValidation = validateCanvasHub();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: "Hex Surface Renderer / Planetary View-Control Renderer Handshake",

      rendererLoaded: true,
      rendererActive: true,
      apiReady: true,

      planetaryViewRendererHandshakeActive: true,
      viewStateAccepted: state.viewStateAccepted,
      viewStateSource: state.viewStateSource,
      viewYaw: state.viewYaw,
      viewPitch: state.viewPitch,
      viewZoom: state.viewZoom,
      viewPhase: state.viewPhase,
      viewStatePacketCount: state.viewStatePacketCount,
      viewStateRejectedCount: state.viewStateRejectedCount,
      viewStateRejectionReason: state.viewStateRejectionReason,

      canvasHubCompatible: true,
      currentCanvasHubContract: CURRENT_CANVAS_HUB_CONTRACT,
      currentCanvasHubReceipt: CURRENT_CANVAS_HUB_RECEIPT,
      lineageCanvasHubContract: LINEAGE_CANVAS_HUB_CONTRACT,
      lineageCanvasHubReceipt: LINEAGE_CANVAS_HUB_RECEIPT,
      canvasHubFile: CANVAS_HUB_FILE,
      canvasHubPresent: hubValidation.hubPresent,
      canvasHubContract: hubValidation.hubContract,
      canvasHubReceipt: hubValidation.hubReceipt,
      canvasHubCurrentRecognized: hubValidation.currentRecognized,
      canvasHubLineageAccepted: hubValidation.lineageAccepted,
      canvasHubStatus: hubValidation.status,

      requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
      requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
      requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
      hexAuthorityPresent: hexValidation.authorityPresent,
      hexAuthorityContract: hexValidation.authorityContract,
      hexAuthorityReceipt: hexValidation.authorityReceipt,
      hexAuthorityContractOk: hexValidation.contractOk,
      hexAuthorityReceiptOk: hexValidation.receiptOk,
      hexAuthoritySampleOk: hexValidation.sampleOk,
      hexAuthorityFourPairOk: hexValidation.fourPairOk,
      hexAuthorityBodyBoundOk: hexValidation.bodyBoundOk,
      hexAuthorityWideProbeOk: hexValidation.wideProbeOk,
      hexAuthorityStatus: hexValidation.status,

      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawOk: state.lastDrawOk,
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
      lastDrawUsedInteractiveScale: state.lastDrawUsedInteractiveScale,
      lastDrawViewStateApplied: state.lastDrawViewStateApplied,
      lastDrawViewYaw: state.lastDrawViewYaw,
      lastDrawViewPitch: state.lastDrawViewPitch,
      lastDrawViewZoom: state.lastDrawViewZoom,
      lastDrawViewPhase: state.lastDrawViewPhase,

      lastHubNotifyOk: state.lastHubNotifyOk,
      lastHubNotifyMethod: state.lastHubNotifyMethod,
      lastError: state.lastError,
      updatedAt: state.updatedAt,

      supportsDrawHearthHexSurfaceFrame: true,
      supportsDrawFrame: true,
      supportsRender: true,
      supportsRenderFrame: true,
      supportsCanvasViewStateHandshake: true,
      supportsYawPitchZoomPhaseProjection: true,
      supportsPerFrameHexAuthoritySampleCache: true,
      supportsInteractiveRenderScaling: true,
      supportsGetStatus: true,
      supportsGetReceipt: true,
      supportsGetReceiptText: true,

      bodyBound: true,
      surfaceBound: true,
      highDensitySurfaceExpression: true,
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

      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getStatus(),
      packetType: "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT",
      destinationFile: FILE,
      purpose: [
        "Consume the Hex Four-Pair Authority.",
        "Render a body-bound visible planet surface only when Canvas Hub supplies a canvas/context.",
        "Accept yaw, pitch, zoom, and phase from Canvas Hub public draw state/options.",
        "Apply planetary view state inside the rendered projection.",
        "Reduce per-frame latency through frame-local authority sample caching.",
        "Keep pixel authority isolated inside the three-file stretch.",
        "Preserve renderer-only boundaries and no-claim posture."
      ],
      owns: [
        "visible surface rendering",
        "high-density pixel surface expression",
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

  function getReceiptText() {
    const r = getStatus();

    return [
      "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `baselineReceipt=${r.baselineReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `rendererLoaded=${r.rendererLoaded}`,
      `rendererActive=${r.rendererActive}`,
      `apiReady=${r.apiReady}`,
      "",
      `planetaryViewRendererHandshakeActive=${r.planetaryViewRendererHandshakeActive}`,
      `viewStateAccepted=${r.viewStateAccepted}`,
      `viewStateSource=${r.viewStateSource}`,
      `viewYaw=${r.viewYaw}`,
      `viewPitch=${r.viewPitch}`,
      `viewZoom=${r.viewZoom}`,
      `viewPhase=${r.viewPhase}`,
      `viewStatePacketCount=${r.viewStatePacketCount}`,
      `viewStateRejectedCount=${r.viewStateRejectedCount}`,
      `viewStateRejectionReason=${r.viewStateRejectionReason}`,
      "",
      `canvasHubCompatible=${r.canvasHubCompatible}`,
      `currentCanvasHubContract=${r.currentCanvasHubContract}`,
      `lineageCanvasHubContract=${r.lineageCanvasHubContract}`,
      `canvasHubFile=${r.canvasHubFile}`,
      `canvasHubPresent=${r.canvasHubPresent}`,
      `canvasHubContract=${r.canvasHubContract}`,
      `canvasHubCurrentRecognized=${r.canvasHubCurrentRecognized}`,
      `canvasHubLineageAccepted=${r.canvasHubLineageAccepted}`,
      `canvasHubStatus=${r.canvasHubStatus}`,
      "",
      `requiredHexAuthorityContract=${r.requiredHexAuthorityContract}`,
      `requiredHexAuthorityReceipt=${r.requiredHexAuthorityReceipt}`,
      `requiredHexAuthorityFile=${r.requiredHexAuthorityFile}`,
      `hexAuthorityPresent=${r.hexAuthorityPresent}`,
      `hexAuthorityContract=${r.hexAuthorityContract}`,
      `hexAuthorityReceipt=${r.hexAuthorityReceipt}`,
      `hexAuthorityContractOk=${r.hexAuthorityContractOk}`,
      `hexAuthorityReceiptOk=${r.hexAuthorityReceiptOk}`,
      `hexAuthoritySampleOk=${r.hexAuthoritySampleOk}`,
      `hexAuthorityFourPairOk=${r.hexAuthorityFourPairOk}`,
      `hexAuthorityBodyBoundOk=${r.hexAuthorityBodyBoundOk}`,
      `hexAuthorityWideProbeOk=${r.hexAuthorityWideProbeOk}`,
      `hexAuthorityStatus=${r.hexAuthorityStatus}`,
      "",
      `drawCount=${r.drawCount}`,
      `lastDrawAt=${r.lastDrawAt}`,
      `lastDrawOk=${r.lastDrawOk}`,
      `lastDrawWidth=${r.lastDrawWidth}`,
      `lastDrawHeight=${r.lastDrawHeight}`,
      `lastDrawRenderWidth=${r.lastDrawRenderWidth}`,
      `lastDrawRenderHeight=${r.lastDrawRenderHeight}`,
      `lastDrawSamples=${r.lastDrawSamples}`,
      `lastDrawLandPixels=${r.lastDrawLandPixels}`,
      `lastDrawWaterPixels=${r.lastDrawWaterPixels}`,
      `lastDrawFallbackHexPixels=${r.lastDrawFallbackHexPixels}`,
      `lastDrawAuthorityHexPixels=${r.lastDrawAuthorityHexPixels}`,
      `lastDrawAuthoritySampleCacheHits=${r.lastDrawAuthoritySampleCacheHits}`,
      `lastDrawAuthoritySampleCacheMisses=${r.lastDrawAuthoritySampleCacheMisses}`,
      `lastDrawUsedInteractiveScale=${r.lastDrawUsedInteractiveScale}`,
      `lastDrawViewStateApplied=${r.lastDrawViewStateApplied}`,
      `lastDrawViewYaw=${r.lastDrawViewYaw}`,
      `lastDrawViewPitch=${r.lastDrawViewPitch}`,
      `lastDrawViewZoom=${r.lastDrawViewZoom}`,
      `lastDrawViewPhase=${r.lastDrawViewPhase}`,
      `lastHubNotifyOk=${r.lastHubNotifyOk}`,
      `lastHubNotifyMethod=${r.lastHubNotifyMethod}`,
      `lastError=${r.lastError}`,
      "",
      `bodyBound=${r.bodyBound}`,
      `surfaceBound=${r.surfaceBound}`,
      `highDensitySurfaceExpression=${r.highDensitySurfaceExpression}`,
      `canvasHubOnlyAwarenessUpdate=${r.canvasHubOnlyAwarenessUpdate}`,
      "",
      `ownsCanvasHub=${r.ownsCanvasHub}`,
      `ownsHexAuthority=${r.ownsHexAuthority}`,
      `ownsComposite=${r.ownsComposite}`,
      `ownsCanvasMounting=${r.ownsCanvasMounting}`,
      `ownsRouteOrchestration=${r.ownsRouteOrchestration}`,
      `ownsRuntimeRestart=${r.ownsRuntimeRestart}`,
      `ownsControls=${r.ownsControls}`,
      `ownsLandTruth=${r.ownsLandTruth}`,
      `ownsWaterTruth=${r.ownsWaterTruth}`,
      `ownsAirTruth=${r.ownsAirTruth}`,
      `ownsHydrology=${r.ownsHydrology}`,
      `ownsElevation=${r.ownsElevation}`,
      `ownsMaterials=${r.ownsMaterials}`,
      "",
      `f13Claimed=${r.f13Claimed}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21Claimed=${r.f21Claimed}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `finalVisualPassClaimed=${r.finalVisualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset(frameReceipt = null) {
    setDataset("hearthHexSurfaceRendererLoaded", "true");
    setDataset("hearthHexSurfaceRendererActive", "true");
    setDataset("hearthHexSurfaceRendererContract", CONTRACT);
    setDataset("hearthHexSurfaceRendererReceipt", RECEIPT);
    setDataset("hearthHexSurfaceRendererPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthHexSurfaceRendererPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthHexSurfaceRendererBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthHexSurfaceRendererBaselineReceipt", BASELINE_RECEIPT);
    setDataset("hearthHexSurfaceRendererVersion", VERSION);
    setDataset("hearthHexSurfaceRendererFile", FILE);
    setDataset("hearthHexSurfaceRendererRole", "Hex Surface Renderer / Planetary View-Control Renderer Handshake");

    setDataset("hearthHexSurfaceRendererCanvasHubCompatible", "true");
    setDataset("hearthHexSurfaceRendererCurrentCanvasHubContract", CURRENT_CANVAS_HUB_CONTRACT);
    setDataset("hearthHexSurfaceRendererCurrentCanvasHubReceipt", CURRENT_CANVAS_HUB_RECEIPT);
    setDataset("hearthHexSurfaceRendererLineageCanvasHubContract", LINEAGE_CANVAS_HUB_CONTRACT);
    setDataset("hearthHexSurfaceRendererCanvasHubFile", CANVAS_HUB_FILE);
    setDataset("hearthHexSurfaceRendererCanvasHubPresent", String(state.canvasHubPresent));
    setDataset("hearthHexSurfaceRendererCanvasHubContract", state.canvasHubContract);
    setDataset("hearthHexSurfaceRendererCanvasHubCurrentRecognized", String(state.canvasHubCurrentRecognized));
    setDataset("hearthHexSurfaceRendererCanvasHubLineageAccepted", String(state.canvasHubLineageAccepted));
    setDataset("hearthHexSurfaceRendererCanvasHubStatus", state.canvasHubStatus);
    setDataset("hearthHexSurfaceRendererCanvasHubOnlyAwarenessUpdate", "true");

    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityContract", REQUIRED_HEX_AUTHORITY_CONTRACT);
    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityReceipt", REQUIRED_HEX_AUTHORITY_RECEIPT);
    setDataset("hearthHexSurfaceRendererRequiredHexAuthorityFile", REQUIRED_HEX_AUTHORITY_FILE);
    setDataset("hearthHexSurfaceRendererHexAuthorityPresent", String(state.hexAuthorityPresent));
    setDataset("hearthHexSurfaceRendererHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthHexSurfaceRendererHexAuthorityContractOk", String(state.hexAuthorityContractOk));
    setDataset("hearthHexSurfaceRendererHexAuthoritySampleOk", String(state.hexAuthoritySampleOk));
    setDataset("hearthHexSurfaceRendererHexAuthorityWideProbeOk", String(state.hexAuthorityWideProbeOk));

    setDataset("hearthHexSurfaceRendererPlanetaryViewRendererHandshakeActive", "true");
    setDataset("hearthHexSurfaceRendererViewStateAccepted", String(state.viewStateAccepted));
    setDataset("hearthHexSurfaceRendererViewStateSource", state.viewStateSource);
    setDataset("hearthHexSurfaceRendererViewYaw", String(state.viewYaw));
    setDataset("hearthHexSurfaceRendererViewPitch", String(state.viewPitch));
    setDataset("hearthHexSurfaceRendererViewZoom", String(state.viewZoom));
    setDataset("hearthHexSurfaceRendererViewPhase", String(state.viewPhase));
    setDataset("hearthHexSurfaceRendererViewStatePacketCount", String(state.viewStatePacketCount));
    setDataset("hearthHexSurfaceRendererViewStateRejectedCount", String(state.viewStateRejectedCount));

    setDataset("hearthHexSurfaceRendererDrawCount", String(state.drawCount));
    setDataset("hearthHexSurfaceRendererLastDrawOk", String(state.lastDrawOk));
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
    setDataset("hearthHexSurfaceRendererLastDrawUsedInteractiveScale", String(state.lastDrawUsedInteractiveScale));
    setDataset("hearthHexSurfaceRendererLastDrawViewStateApplied", String(state.lastDrawViewStateApplied));
    setDataset("hearthHexSurfaceRendererLastHubNotifyOk", String(state.lastHubNotifyOk));
    setDataset("hearthHexSurfaceRendererLastHubNotifyMethod", state.lastHubNotifyMethod);
    setDataset("hearthHexSurfaceRendererLastError", state.lastError);

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

    if (frameReceipt) {
      setDataset("hearthHexSurfaceRendererFrameReceipt", frameReceipt.receipt);
      setDataset("hearthHexSurfaceRendererVisibleSurfaceRendered", String(Boolean(frameReceipt.visibleSurfaceRendered)));
      setDataset("hearthHexSurfaceRendererAuthorityHexPixels", String(frameReceipt.authorityHexPixels || 0));
      setDataset("hearthHexSurfaceRendererFallbackHexPixels", String(frameReceipt.fallbackHexPixels || 0));
      setDataset("hearthHexSurfaceRendererFrameViewStateApplied", String(Boolean(frameReceipt.viewStateAppliedToProjection)));
    }

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.hexSurface = api;
    root.HEARTH.hexSurfaceRenderer = api;
    root.HEARTH.hexSurfacePlanetaryViewControlRenderer = api;
    root.DEXTER_LAB.hearthHexSurface = api;
    root.DEXTER_LAB.hearthHexSurfaceRenderer = api;
    root.DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer = api;

    root.HEARTH_HEX_SURFACE = api;
    root.HEARTH_HEX_SURFACE_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = api;
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE = api;

    root.HEARTH_HEX_SURFACE_CONTRACT = CONTRACT;
    root.HEARTH_HEX_SURFACE_RECEIPT = RECEIPT;
    root.HEARTH_HEX_SURFACE_STATUS = getStatus();
    root.HEARTH_HEX_SURFACE_RENDERER_RECEIPT = getReceipt();
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT = getReceipt();
    root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_RECEIPT_v3 = getReceipt();

    root.HEARTH.hexSurfaceReceipt = getReceipt();
    root.HEARTH.hexSurfaceRendererReceipt = getReceipt();
    root.HEARTH.hexSurfacePlanetaryViewControlRendererReceipt = getReceipt();
    root.DEXTER_LAB.hearthHexSurfaceReceipt = getReceipt();

    return api;
  }

  function dispose() {
    if (root.HEARTH && root.HEARTH.hexSurface === api) root.HEARTH.hexSurface = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceRenderer === api) root.HEARTH.hexSurfaceRenderer = null;
    if (root.HEARTH && root.HEARTH.hexSurfacePlanetaryViewControlRenderer === api) root.HEARTH.hexSurfacePlanetaryViewControlRenderer = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurface === api) root.DEXTER_LAB.hearthHexSurface = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceRenderer === api) root.DEXTER_LAB.hearthHexSurfaceRenderer = null;
    if (root.HEARTH_HEX_SURFACE === api) root.HEARTH_HEX_SURFACE = null;
    if (root.HEARTH_HEX_SURFACE_RENDERER === api) root.HEARTH_HEX_SURFACE_RENDERER = null;
    if (root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER === api) root.HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER = null;

    setDataset("hearthHexSurfaceRendererDisposed", "true");
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    FILE,
    ROUTE,
    VERSION,
    REQUIRED_HEX_AUTHORITY_CONTRACT,
    REQUIRED_HEX_AUTHORITY_RECEIPT,
    REQUIRED_HEX_AUTHORITY_FILE,
    CURRENT_CANVAS_HUB_CONTRACT,
    CURRENT_CANVAS_HUB_RECEIPT,
    LINEAGE_CANVAS_HUB_CONTRACT,
    LINEAGE_CANVAS_HUB_RECEIPT,
    CANVAS_HUB_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Surface Renderer / Planetary View-Control Renderer Handshake",

    drawHearthHexSurfaceFrame,
    drawFrame,
    render,
    renderFrame,

    receiveCanvasViewState,
    consumeCanvasViewState,
    receiveViewControlPacket,
    consumeViewControlPacket,

    validateHexAuthority,
    validateCanvasHub,
    getStatus,
    getReceipt,
    getReceiptText,
    notifyCanvasHub,
    updateDataset,
    publishGlobals,
    dispose,

    canvasHubCompatible: true,
    canvasHubOnlyAwarenessUpdate: true,
    planetaryViewRendererHandshakeActive: true,
    bodyBound: true,
    surfaceBound: true,
    highDensitySurfaceExpression: true,

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
    validateHexAuthority();
    validateCanvasHub();

    const globalView = readGlobalViewState();
    if (globalView) {
      state.viewStateAccepted = true;
      state.viewStateSource = globalView.source;
      state.viewYaw = globalView.yaw;
      state.viewPitch = globalView.pitch;
      state.viewZoom = globalView.zoom;
      state.viewPhase = globalView.phase;
      state.viewStateLastAcceptedAt = nowIso();
    }

    updateDataset();
    publishGlobals();
  } catch (error) {
    state.lastError = error && error.message ? String(error.message) : String(error);
    state.updatedAt = nowIso();

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
