// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2
// Full-file replacement.
// Final file in the three-file Canvas Hub <-> Hex Authority <-> Hex Surface stretch.
// Hex Surface Renderer only.
// Purpose:
// - Consume HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1.
// - Render a body-bound 2D canvas planet surface when the Canvas Hub supplies a canvas/context.
// - Use pixel/cell/four-pair data as rendering intelligence without making other Hearth files pixel-aware.
// - Report only to the Canvas Hub when a compatible hub receiver is present.
// - Preserve the old donor value: high-density surface expression, body-bound grain, seam pressure, atmosphere edge, and visible globe surface.
// - Keep this file as renderer-only: no mounting, no route orchestration, no runtime restart, no controls, no F13/F21/ready/final claim.
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
// - F13
// - F21
// - ready text
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const RECEIPT = "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const PREVIOUS_RECEIPT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_RECEIPT_v1";
  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-03.hearth-hex-surface-canvas-hub-three-file-visible-expression-renderer-v2";

  const REQUIRED_HEX_AUTHORITY_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const REQUIRED_HEX_AUTHORITY_RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const REQUIRED_HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const CANVAS_HUB_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
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
    hexDensity: 238,
    hexEdgeStrength: 0.065,
    grainStrength: 0.32,
    materialStrength: 0.28,
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
    opal: [148, 194, 188, 255],
    shadow: [10, 14, 22, 255],
    atmosphere: [154, 214, 248, 255]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Surface Renderer",

    rendererLoaded: true,
    canvasHubCompatible: true,
    canvasHubContract: CANVAS_HUB_CONTRACT,
    canvasHubFile: CANVAS_HUB_FILE,
    requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
    requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
    requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,

    hexAuthorityPresent: false,
    hexAuthorityContractOk: false,
    hexAuthoritySampleOk: false,
    hexAuthorityWideProbeOk: false,
    canvasHubPresent: false,
    canvasHubContractOk: false,

    drawCount: 0,
    lastDrawAt: "",
    lastDrawOk: false,
    lastDrawWidth: 0,
    lastDrawHeight: 0,
    lastDrawSamples: 0,
    lastDrawLandPixels: 0,
    lastDrawWaterPixels: 0,
    lastDrawFallbackHexPixels: 0,
    lastDrawAuthorityHexPixels: 0,
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

  function normalizeOptions(options = {}) {
    return {
      radiusRatio: clamp(options.radiusRatio ?? DEFAULTS.radiusRatio, 0.32, 0.49),
      axialTilt: safeNumber(options.axialTilt ?? DEFAULTS.axialTilt, DEFAULTS.axialTilt),
      phase: safeNumber(options.phase ?? DEFAULTS.phase, DEFAULTS.phase),
      hexDensity: clamp(options.hexDensity ?? DEFAULTS.hexDensity, 120, 560),
      hexEdgeStrength: clamp(options.hexEdgeStrength ?? DEFAULTS.hexEdgeStrength, 0, 0.24),
      grainStrength: clamp(options.grainStrength ?? DEFAULTS.grainStrength, 0, 0.9),
      materialStrength: clamp(options.materialStrength ?? DEFAULTS.materialStrength, 0, 0.8),
      reliefStrength: clamp(options.reliefStrength ?? DEFAULTS.reliefStrength, 0, 0.9),
      atmosphereStrength: clamp(options.atmosphereStrength ?? DEFAULTS.atmosphereStrength, 0, 1.6),
      lightX: safeNumber(options.lightX ?? DEFAULTS.lightX, DEFAULTS.lightX),
      lightY: safeNumber(options.lightY ?? DEFAULTS.lightY, DEFAULTS.lightY),
      lightZ: safeNumber(options.lightZ ?? DEFAULTS.lightZ, DEFAULTS.lightZ)
    };
  }

  function norm3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return {
      x: x / length,
      y: y / length,
      z: z / length
    };
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

  function contractOf(candidate) {
    if (!candidate || typeof candidate !== "object") return "";
    return safeString(candidate.contract || candidate.CONTRACT || "");
  }

  function receiptOf(candidate) {
    if (!candidate || typeof candidate !== "object") return "";
    return safeString(candidate.receipt || candidate.RECEIPT || "");
  }

  function resolveHexAuthority() {
    const candidates = [
      root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH && root.HEARTH.hexFourPairAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthHexFourPairAuthority
    ];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === "object") return candidate;
    }

    return null;
  }

  function resolveCanvasHub() {
    const candidates = [
      root.HEARTH_CANVAS,
      root.HEARTH && root.HEARTH.canvas,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvas
    ];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === "object") return candidate;
    }

    return null;
  }

  function validateHexAuthority() {
    const authority = resolveHexAuthority();
    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
      requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
      authorityPresent: Boolean(authority),
      authorityContract: contractOf(authority),
      authorityReceipt: receiptOf(authority),
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
      return result;
    }

    try {
      const sample = authority.sample({ u: 0.5, v: 0.5 });

      result.sampleOk = Boolean(sample && typeof sample === "object");
      result.fourPairOk = Boolean(
        sample &&
        sample.everyPixelHasFourPairSet === true &&
        Array.isArray(sample.fourPairSet) &&
        sample.fourPairSet.length === 4 &&
        sample.north &&
        sample.south &&
        sample.east &&
        sample.west
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

    state.hexAuthorityPresent = result.authorityPresent;
    state.hexAuthorityContractOk = result.contractOk;
    state.hexAuthoritySampleOk = result.sampleOk;
    state.hexAuthorityWideProbeOk = result.wideProbeOk;

    return result;
  }

  function validateCanvasHub() {
    const hub = resolveCanvasHub();
    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      requiredCanvasHubContract: CANVAS_HUB_CONTRACT,
      hubPresent: Boolean(hub),
      hubContract: contractOf(hub),
      contractOk: contractOf(hub) === CANVAS_HUB_CONTRACT,
      status: "MISSING",
      ...FINAL_FALSE
    };

    result.status = result.hubPresent
      ? result.contractOk
        ? "PASS"
        : "PRESENT_DIFFERENT_CONTRACT"
      : "MISSING";

    state.canvasHubPresent = result.hubPresent;
    state.canvasHubContractOk = result.contractOk;

    return result;
  }

  function sampleHexAuthority(coord, fallbackQ, fallbackR) {
    const authority = resolveHexAuthority();

    if (authority && isFunction(authority.sample)) {
      try {
        const packet = authority.sample({
          x: coord.x,
          y: coord.y,
          z: coord.z,
          u: coord.u,
          v: coord.v,
          lon: coord.lonDegrees,
          lat: coord.latDegrees
        });

        if (packet && typeof packet === "object") {
          return {
            ...packet,
            fallbackHexAuthority: false,
            authorityHexPixel: true
          };
        }
      } catch (_error) {}
    }

    const stateId = Math.abs(((fallbackQ * 37 + fallbackR * 19 + fallbackQ * fallbackR * 7 + 113) | 0) % 256);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Surface Renderer fallback cell address",
      fallbackHexAuthority: true,
      authorityHexPixel: false,
      cellId: `HEARTH_HEX_SURFACE_FALLBACK_Q${fallbackQ}_R${fallbackR}`,
      hexId: `HEARTH_HEX_SURFACE_FALLBACK_Q${fallbackQ}_R${fallbackR}`,
      q: fallbackQ,
      r: fallbackR,
      s: -fallbackQ - fallbackR,
      stateId,
      stateClass: `state-${String(stateId).padStart(3, "0")}`,
      everyPixelHasNorthSouthEastWest: false,
      everyPixelHasFourPairSet: false,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
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

    if (isLand && coast > 0.48) {
      color = mixColor(color, COLOR.foam, (coast - 0.48) * 0.18);
    }

    if (!isLand && shelf > 0.35) {
      color = mixColor(color, COLOR.foam, shelf * coast * 0.08);
    }

    return color;
  }

  function cubeRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

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

  function drawHearthHexSurfaceFrame(target, options = {}) {
    const resolved = resolveCanvasAndContext(target);
    const canvas = resolved.canvas;
    const ctx = resolved.ctx;

    if (!canvas || !ctx) {
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

    const config = normalizeOptions({
      ...options,
      phase: options.phase !== undefined ? options.phase : target && target.phase !== undefined ? target.phase : DEFAULTS.phase
    });

    const minSide = Math.min(width, height);
    const radius = minSide * config.radiusRatio;
    const cx = width / 2;
    const cy = height / 2;
    const hexRadius = clamp(minSide / config.hexDensity, 0.55, 5.5);
    const light = norm3(config.lightX, config.lightY, config.lightZ);

    const hexValidation = validateHexAuthority();
    const hubValidation = validateCanvasHub();

    const image = ctx.createImageData(width, height);
    const data = image.data;

    let samples = 0;
    let landPixels = 0;
    let waterPixels = 0;
    let fallbackHexPixels = 0;
    let authorityHexPixels = 0;

    try {
      for (let py = 0; py < height; py += 1) {
        const yRaw = py + 0.5 - cy;
        const ny = yRaw / radius;

        for (let px = 0; px < width; px += 1) {
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

          const hexPacket = sampleHexAuthority(coord, center.q, center.r);
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

          const index = (py * width + px) * 4;

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];

          samples += 1;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(image, 0, 0);
      drawAtmosphere(ctx, width, height, cx, cy, radius, config);

      const receipt = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: "Hex Surface Renderer",
        packetType: "HEARTH_HEX_SURFACE_RENDER_FRAME_RECEIPT",

        canvasHubCompatible: true,
        canvasHubContract: CANVAS_HUB_CONTRACT,
        canvasHubFile: CANVAS_HUB_FILE,
        canvasHubPresent: hubValidation.hubPresent,
        canvasHubContractOk: hubValidation.contractOk,

        requiredHexAuthorityContract: REQUIRED_HEX_AUTHORITY_CONTRACT,
        requiredHexAuthorityReceipt: REQUIRED_HEX_AUTHORITY_RECEIPT,
        requiredHexAuthorityFile: REQUIRED_HEX_AUTHORITY_FILE,
        hexAuthorityPresent: hexValidation.authorityPresent,
        hexAuthorityContractOk: hexValidation.contractOk,
        hexAuthoritySampleOk: hexValidation.sampleOk,
        hexAuthorityWideProbeOk: hexValidation.wideProbeOk,

        width,
        height,
        samples,
        radius,
        hexRadius,
        landPixels,
        waterPixels,
        fallbackHexPixels,
        authorityHexPixels,

        rendererDrewSurface: true,
        rendererOwnsMounting: false,
        rendererOwnsCanvasHub: false,
        rendererOwnsHexAuthority: false,
        rendererOwnsTruth: false,
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
      state.lastDrawSamples = samples;
      state.lastDrawLandPixels = landPixels;
      state.lastDrawWaterPixels = waterPixels;
      state.lastDrawFallbackHexPixels = fallbackHexPixels;
      state.lastDrawAuthorityHexPixels = authorityHexPixels;
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
        canvas.dataset.hearthHexSurfaceRendererSamples = String(samples);
        canvas.dataset.hearthHexSurfaceRendererLandPixels = String(landPixels);
        canvas.dataset.hearthHexSurfaceRendererWaterPixels = String(waterPixels);
        canvas.dataset.hearthHexSurfaceRendererAuthorityHexPixels = String(authorityHexPixels);
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
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: "Hex Surface Renderer",

      rendererLoaded: true,
      apiReady: true,
      canvasHubCompatible: true,
      canvasHubContract: CANVAS_HUB_CONTRACT,
      canvasHubFile: CANVAS_HUB_FILE,
      canvasHubPresent: hubValidation.hubPresent,
      canvasHubContractOk: hubValidation.contractOk,
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
      lastDrawSamples: state.lastDrawSamples,
      lastDrawLandPixels: state.lastDrawLandPixels,
      lastDrawWaterPixels: state.lastDrawWaterPixels,
      lastDrawFallbackHexPixels: state.lastDrawFallbackHexPixels,
      lastDrawAuthorityHexPixels: state.lastDrawAuthorityHexPixels,
      lastHubNotifyOk: state.lastHubNotifyOk,
      lastHubNotifyMethod: state.lastHubNotifyMethod,
      lastError: state.lastError,
      updatedAt: state.updatedAt,

      supportsDrawHearthHexSurfaceFrame: true,
      supportsDrawFrame: true,
      supportsRender: true,
      supportsRenderFrame: true,
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
      packetType: "HEARTH_HEX_SURFACE_RENDERER_RECEIPT",
      destinationFile: FILE,
      purpose: [
        "Consume the Hex Four-Pair Authority.",
        "Render a body-bound visible planet surface only when Canvas Hub supplies a canvas/context.",
        "Keep pixel authority isolated inside the three-file stretch.",
        "Update Canvas Hub awareness without teaching other files pixel language.",
        "Preserve renderer-only boundaries and no-claim posture."
      ],
      owns: [
        "visible surface rendering",
        "high-density pixel surface expression",
        "hex authority consumption",
        "surface grain expression",
        "seam pressure expression",
        "body-bound rendered frame receipts"
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
      "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `rendererLoaded=${r.rendererLoaded}`,
      `apiReady=${r.apiReady}`,
      `canvasHubCompatible=${r.canvasHubCompatible}`,
      `canvasHubContract=${r.canvasHubContract}`,
      `canvasHubFile=${r.canvasHubFile}`,
      `canvasHubPresent=${r.canvasHubPresent}`,
      `canvasHubContractOk=${r.canvasHubContractOk}`,
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
      `lastDrawSamples=${r.lastDrawSamples}`,
      `lastDrawLandPixels=${r.lastDrawLandPixels}`,
      `lastDrawWaterPixels=${r.lastDrawWaterPixels}`,
      `lastDrawFallbackHexPixels=${r.lastDrawFallbackHexPixels}`,
      `lastDrawAuthorityHexPixels=${r.lastDrawAuthorityHexPixels}`,
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
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const dataset = doc.documentElement.dataset;

    dataset.hearthHexSurfaceRendererLoaded = "true";
    dataset.hearthHexSurfaceRendererContract = CONTRACT;
    dataset.hearthHexSurfaceRendererReceipt = RECEIPT;
    dataset.hearthHexSurfaceRendererPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthHexSurfaceRendererVersion = VERSION;
    dataset.hearthHexSurfaceRendererFile = FILE;
    dataset.hearthHexSurfaceRendererRole = "Hex Surface Renderer";

    dataset.hearthHexSurfaceRendererCanvasHubCompatible = "true";
    dataset.hearthHexSurfaceRendererCanvasHubContract = CANVAS_HUB_CONTRACT;
    dataset.hearthHexSurfaceRendererCanvasHubFile = CANVAS_HUB_FILE;
    dataset.hearthHexSurfaceRendererCanvasHubOnlyAwarenessUpdate = "true";

    dataset.hearthHexSurfaceRendererRequiredHexAuthorityContract = REQUIRED_HEX_AUTHORITY_CONTRACT;
    dataset.hearthHexSurfaceRendererRequiredHexAuthorityReceipt = REQUIRED_HEX_AUTHORITY_RECEIPT;
    dataset.hearthHexSurfaceRendererRequiredHexAuthorityFile = REQUIRED_HEX_AUTHORITY_FILE;
    dataset.hearthHexSurfaceRendererHexAuthorityPresent = String(state.hexAuthorityPresent);
    dataset.hearthHexSurfaceRendererHexAuthorityContractOk = String(state.hexAuthorityContractOk);
    dataset.hearthHexSurfaceRendererHexAuthoritySampleOk = String(state.hexAuthoritySampleOk);
    dataset.hearthHexSurfaceRendererHexAuthorityWideProbeOk = String(state.hexAuthorityWideProbeOk);

    dataset.hearthHexSurfaceRendererDrawCount = String(state.drawCount);
    dataset.hearthHexSurfaceRendererLastDrawOk = String(state.lastDrawOk);
    dataset.hearthHexSurfaceRendererLastDrawWidth = String(state.lastDrawWidth);
    dataset.hearthHexSurfaceRendererLastDrawHeight = String(state.lastDrawHeight);
    dataset.hearthHexSurfaceRendererLastDrawSamples = String(state.lastDrawSamples);
    dataset.hearthHexSurfaceRendererLastDrawLandPixels = String(state.lastDrawLandPixels);
    dataset.hearthHexSurfaceRendererLastDrawWaterPixels = String(state.lastDrawWaterPixels);
    dataset.hearthHexSurfaceRendererLastHubNotifyOk = String(state.lastHubNotifyOk);
    dataset.hearthHexSurfaceRendererLastHubNotifyMethod = state.lastHubNotifyMethod;
    dataset.hearthHexSurfaceRendererLastError = state.lastError;

    dataset.hearthHexSurfaceRendererOwnsCanvasHub = "false";
    dataset.hearthHexSurfaceRendererOwnsHexAuthority = "false";
    dataset.hearthHexSurfaceRendererOwnsComposite = "false";
    dataset.hearthHexSurfaceRendererOwnsCanvasMounting = "false";
    dataset.hearthHexSurfaceRendererOwnsRouteOrchestration = "false";
    dataset.hearthHexSurfaceRendererOwnsRuntimeRestart = "false";
    dataset.hearthHexSurfaceRendererOwnsControls = "false";
    dataset.hearthHexSurfaceRendererOwnsLandTruth = "false";
    dataset.hearthHexSurfaceRendererOwnsWaterTruth = "false";
    dataset.hearthHexSurfaceRendererOwnsAirTruth = "false";

    if (frameReceipt) {
      dataset.hearthHexSurfaceRendererFrameReceipt = frameReceipt.receipt;
      dataset.hearthHexSurfaceRendererVisibleSurfaceRendered = String(Boolean(frameReceipt.visibleSurfaceRendered));
      dataset.hearthHexSurfaceRendererAuthorityHexPixels = String(frameReceipt.authorityHexPixels || 0);
      dataset.hearthHexSurfaceRendererFallbackHexPixels = String(frameReceipt.fallbackHexPixels || 0);
    }

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    return true;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.hexSurface = api;
    root.HEARTH.hexSurfaceRenderer = api;
    root.DEXTER_LAB.hearthHexSurface = api;
    root.DEXTER_LAB.hearthHexSurfaceRenderer = api;

    root.HEARTH_HEX_SURFACE = api;
    root.HEARTH_HEX_SURFACE_RENDERER = api;
    root.HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER = api;

    root.HEARTH_HEX_SURFACE_CONTRACT = CONTRACT;
    root.HEARTH_HEX_SURFACE_RECEIPT = RECEIPT;
    root.HEARTH_HEX_SURFACE_STATUS = getStatus();
    root.HEARTH_HEX_SURFACE_RENDERER_RECEIPT = getReceipt();

    root.HEARTH.hexSurfaceReceipt = getReceipt();
    root.HEARTH.hexSurfaceRendererReceipt = getReceipt();
    root.DEXTER_LAB.hearthHexSurfaceReceipt = getReceipt();

    return api;
  }

  function dispose() {
    if (root.HEARTH && root.HEARTH.hexSurface === api) root.HEARTH.hexSurface = null;
    if (root.HEARTH && root.HEARTH.hexSurfaceRenderer === api) root.HEARTH.hexSurfaceRenderer = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurface === api) root.DEXTER_LAB.hearthHexSurface = null;
    if (root.DEXTER_LAB && root.DEXTER_LAB.hearthHexSurfaceRenderer === api) root.DEXTER_LAB.hearthHexSurfaceRenderer = null;
    if (root.HEARTH_HEX_SURFACE === api) root.HEARTH_HEX_SURFACE = null;
    if (root.HEARTH_HEX_SURFACE_RENDERER === api) root.HEARTH_HEX_SURFACE_RENDERER = null;

    if (doc && doc.documentElement && doc.documentElement.dataset) {
      doc.documentElement.dataset.hearthHexSurfaceRendererDisposed = "true";
    }
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    FILE,
    ROUTE,
    VERSION,
    REQUIRED_HEX_AUTHORITY_CONTRACT,
    REQUIRED_HEX_AUTHORITY_RECEIPT,
    REQUIRED_HEX_AUTHORITY_FILE,
    CANVAS_HUB_CONTRACT,
    CANVAS_HUB_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Surface Renderer",

    drawHearthHexSurfaceFrame,
    drawFrame,
    render,
    renderFrame,
    validateHexAuthority,
    validateCanvasHub,
    getStatus,
    getReceipt,
    getReceiptText,
    notifyCanvasHub,
    dispose,

    canvasHubCompatible: true,
    canvasHubOnlyAwarenessUpdate: true,
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
