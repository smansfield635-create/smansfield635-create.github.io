// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1
// Full-file replacement.
// Canvas / visible carrier / plan-consumer authority only.
// Purpose:
// - Keep Hearth visible immediately with pointer/touch drag.
// - Load the Hex Four-Pair Pixel Handshake Authority before atlas expression.
// - Use north/south/east/west pixel handshakes as the body-bound planetary boundary.
// - Keep land and water seated on the body while allowing air to render only as an outer/rim layer.
// - Improve opaque land/water legibility without letting canvas own land, water, air, hydrology, elevation, tectonics, or materials truth.
// Does not own:
// - hex handshake law
// - Runtime Table procedural law
// - Triple G diagnostic law
// - land truth
// - water truth
// - air truth
// - hydrology law
// - materials law
// - route orchestration
// - runtime motion authority
// - controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-hex-four-pair-body-boundary-carrier-v1";

  const LAB_RUNTIME_TABLE_PATH = "/assets/lab/runtime-table.js";
  const REQUIRED_RUNTIME_TABLE_CONTRACT = "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1";
  const RUNTIME_TABLE_CACHE_KEY = "lab-universal-planet-wide-probe-diagnostic-loading-standard-v1";

  const HEX_PATH = "/assets/hearth/hearth.hex.handshake.authority.js";
  const HEX_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const HEX_CACHE_KEY = "hearth-hex-four-pair-pixel-handshake-authority-v1";

  const LAND_PATH = "/assets/hearth/hearth.land.channel.js";
  const WATER_PATH = "/assets/hearth/hearth.water.channel.js";
  const AIR_PATH = "/assets/hearth/hearth.air.channel.js";

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const AIR_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const HEARTH_ROUTE_CONTROLLER_CONTRACT = "HEARTH_ELEVATION_COMPOSITION_MATERIAL_ROUTE_SYNC_TNT_v22";
  const HEARTH_ROUTE_PREVIOUS_CONTRACT = "HEARTH_TECTONIC_PARENT_CHAIN_ROUTE_TNT_v21";

  const DEFAULT_ATLAS_WIDTH = 384;
  const DEFAULT_ATLAS_HEIGHT = 192;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const COLORS = Object.freeze({
    shellDark: [3, 7, 16],
    shellMid: [11, 24, 43],
    shellLight: [60, 86, 102],
    waterDeep: [3, 24, 78],
    waterMid: [8, 55, 128],
    waterShelf: [16, 86, 148],
    landLow: [112, 94, 58],
    landHigh: [158, 132, 76],
    landShadow: [68, 58, 38],
    air: [140, 190, 218],
    rim: [178, 222, 242],
    shadow: [0, 2, 9]
  });

  const root = typeof window !== "undefined" ? window : globalThis;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = safeNumber(lonDeg, 0) * DEG;
    const lat = safeNumber(latDeg, 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);

    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((safeNumber(lon, 0) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - safeNumber(lat, 0)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp01(v) * 180;
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
  }

  function scaleColor(rgb, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;

    return [
      clamp(Math.round(rgb[0] * s), 0, 255),
      clamp(Math.round(rgb[1] * s), 0, 255),
      clamp(Math.round(rgb[2] * s), 0, 255)
    ];
  }

  function luminance(rgb) {
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }

  function ensureContrast(landRgb, waterRgb) {
    const delta = Math.abs(luminance(landRgb) - luminance(waterRgb));
    if (delta >= 24) return { landRgb, waterRgb, adjusted: false, contrastDelta: delta };

    const landBoost = mixColor(landRgb, COLORS.landHigh, 0.42);
    const waterDrop = mixColor(waterRgb, COLORS.waterDeep, 0.58);

    return {
      landRgb: landBoost,
      waterRgb: waterDrop,
      adjusted: true,
      contrastDelta: Math.abs(luminance(landBoost) - luminance(waterDrop))
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseInput(...args) {
    const p = args[0] && typeof args[0] === "object" ? args[0] : {};

    if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
      return lonLatToVector(uToLon(p.u), vToLat(p.v));
    }

    if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
      return lonLatToVector(p.lon, p.lat);
    }

    if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
      return lonLatToVector(p.longitude, p.latitude);
    }

    if (
      Number.isFinite(Number(p.x)) &&
      Number.isFinite(Number(p.y)) &&
      Number.isFinite(Number(p.z))
    ) {
      return normalize3(p);
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(args[0], args[1]);

    return lonLatToVector(0, 0);
  }

  function vectorPacket(p, options = {}) {
    const ll = vectorToLonLat(p);

    return {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,
      x: p.x,
      y: p.y,
      z: p.z,
      width: options.width || DEFAULT_ATLAS_WIDTH,
      height: options.height || DEFAULT_ATLAS_HEIGHT
    };
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((item) => Number.isFinite(Number(item)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return fallback.slice();
  }

  function getHexAuthority() {
    return root.HEARTH_HEX_HANDSHAKE_AUTHORITY || root.HearthHexHandshakeAuthority || (root.HEARTH && root.HEARTH.hexHandshakeAuthority) || null;
  }

  function getLandChannel() {
    return root.HEARTH_LAND_CHANNEL || root.HearthLandChannel || (root.HEARTH && root.HEARTH.landChannel) || null;
  }

  function getWaterChannel() {
    return root.HEARTH_WATER_CHANNEL || root.HearthWaterChannel || (root.HEARTH && root.HEARTH.waterChannel) || null;
  }

  function getAirChannel() {
    return root.HEARTH_AIR_CHANNEL || root.HearthAirChannel || (root.HEARTH && root.HEARTH.airChannel) || null;
  }

  function getRuntimePlanAuthority() {
    return (
      root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY ||
      root.LAB_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.visualCarrierPlanAuthority) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function readHandshake(p, options = {}) {
    const packet = vectorPacket(p, options);
    const authority = getHexAuthority();

    if (authority && typeof authority.read === "function") {
      try {
        const result = authority.read(packet, {
          width: packet.width,
          height: packet.height
        });

        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return {
      contract: "FALLBACK_HEX_HANDSHAKE_LOCAL_BODY_PACKET",
      receipt: "FALLBACK_HEX_HANDSHAKE_LOCAL_BODY_RECEIPT",
      authority: "fallback-local-body-coordinate-handshake",
      coordinate: packet,
      pixelId: `fallback_${Math.round(packet.u * packet.width)}_${Math.round(packet.v * packet.height)}`,
      fourPairSet: {},
      fourPairDirections: ["north", "south", "east", "west"],
      bodyBoundaryAuthority: true,
      planetaryBoundarySource: "body-coordinate-handshake-not-air",
      atmosphereMayRenderOutsideBoundary: true,
      atmosphereMayDefineBoundary: false,
      atmosphericBoundaryRejection: 1,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      coordinateContinuity: 0.75,
      fourPairContinuity: 0.75,
      handshakeReady: false,
      fallbackOnly: true,
      visualPassClaimed: false
    };
  }

  function callChannel(authority, args, p, options = {}) {
    if (!authority) return null;

    const packet = vectorPacket(p, options);
    const methods = ["sample", "read"];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const direct = authority[method].apply(authority, args);
        if (direct && typeof direct === "object") return direct;
      } catch (_error) {}

      try {
        const normalized = authority[method].call(authority, packet);
        if (normalized && typeof normalized === "object") return normalized;
      } catch (_error) {}
    }

    return null;
  }

  function fallbackLand(p) {
    const ll = vectorToLonLat(p);
    const continental =
      Math.sin((ll.lon * 1.9 + 21) * DEG) * 0.21 +
      Math.cos((ll.lat * 2.4 - 7) * DEG) * 0.18 +
      Math.sin((ll.lon * 0.8 + ll.lat * 1.6 + 90) * DEG) * 0.18;
    const core = clamp01((continental + 0.2) * 1.25);
    const landAlpha = core > 0.54 ? clamp01(0.35 + core * 0.5) : clamp01(core * 0.16);
    const relief = clamp01((core - 0.38) * 1.6);
    const rgb = mixColor(COLORS.landLow, COLORS.landHigh, relief);

    return {
      contract: "FALLBACK_BODY_BOUND_LAND_CARRIER",
      channel: "land",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,
      landAlpha,
      landPresence: landAlpha,
      landPotential: core,
      bodyBinding: 0.92,
      surfaceAttachment: 0.92,
      atmosphericRejection: 1,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineWater: false,
      mayDefineAir: false,
      rgb,
      color: rgb,
      alpha: landAlpha,
      opacityMode: "opaque-body-bound-land-fallback",
      canvasFallbackOnly: true,
      visualPassClaimed: false
    };
  }

  function fallbackWater(p) {
    const ll = vectorToLonLat(p);
    const basin = clamp01(
      0.48 +
      Math.cos((ll.lon * 1.2 - 22) * DEG) * 0.18 -
      Math.sin((ll.lat * 2.3 + 10) * DEG) * 0.15
    );
    const waterAlpha = clamp01(0.42 + basin * 0.43);
    const rgb = mixColor(COLORS.waterMid, COLORS.waterDeep, clamp01(basin * 0.75));

    return {
      contract: "FALLBACK_BODY_BOUND_WATER_CARRIER",
      channel: "water",
      isLandChannel: false,
      isWaterChannel: true,
      isAirChannel: false,
      waterAlpha,
      waterPresence: waterAlpha,
      waterDepth: basin,
      depthBinding: 0.9,
      hydrosphereBinding: 0.92,
      surfaceSeat: 0.92,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false,
      rgb,
      color: rgb,
      alpha: waterAlpha,
      canvasFallbackOnly: true,
      canvasOwnsWaterTruth: false,
      visualPassClaimed: false
    };
  }

  function fallbackAir(p) {
    const limb = clamp01(1 - Math.abs(p.z));
    const airAlpha = clamp01(0.025 + limb * 0.13);

    return {
      contract: "FALLBACK_RIM_AIR_CARRIER",
      channel: "air",
      isLandChannel: false,
      isWaterChannel: false,
      isAirChannel: true,
      airAlpha,
      airPresence: airAlpha,
      rimHaze: limb,
      limbAtmosphere: limb,
      atmosphereSeparation: airAlpha,
      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      mayDefineLand: false,
      mayDefineWater: false,
      rgb: COLORS.air.slice(),
      color: COLORS.air.slice(),
      alpha: airAlpha,
      canvasFallbackOnly: true,
      visualPassClaimed: false
    };
  }

  function normalizeLand(raw, p, handshake) {
    const fallback = fallbackLand(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "landRgb"], fallback.rgb);
    const landAlpha = clamp01(safeNumber(source.landAlpha ?? source.landPresence ?? source.alpha, fallback.landAlpha));
    const bodyBinding = clamp01(Math.max(safeNumber(source.bodyBinding, 0), source.bodyBound === true ? 1 : 0, fallback.bodyBinding));
    const surfaceAttachment = clamp01(Math.max(safeNumber(source.surfaceAttachment, 0), source.surfaceBound === true ? 1 : 0, fallback.surfaceAttachment));
    const handshakeSeat = clamp01(safeNumber(handshake && handshake.coordinateContinuity, 1));

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: landAlpha,
      landAlpha,
      landPresence: landAlpha,
      bodyBinding: clamp01(bodyBinding * (0.9 + handshakeSeat * 0.1)),
      surfaceAttachment: clamp01(surfaceAttachment * (0.9 + handshakeSeat * 0.1)),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineWater: false,
      mayDefineAir: false,
      atmosphericRejection: 1,
      planetaryBoundarySource: "hex-four-pair-body-handshake",
      visualPassClaimed: false
    };
  }

  function normalizeWater(raw, p, handshake) {
    const fallback = fallbackWater(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "waterRgb", "oceanRgb"], fallback.rgb);
    const waterAlpha = clamp01(safeNumber(source.waterAlpha ?? source.waterPresence ?? source.alpha, fallback.waterAlpha));
    const hydrosphereBinding = clamp01(Math.max(safeNumber(source.hydrosphereBinding, 0), source.bodyBound === true ? 1 : 0, fallback.hydrosphereBinding));
    const surfaceSeat = clamp01(Math.max(safeNumber(source.surfaceSeat, 0), source.surfaceBound === true ? 1 : 0, fallback.surfaceSeat));
    const handshakeSeat = clamp01(safeNumber(handshake && handshake.coordinateContinuity, 1));

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: waterAlpha,
      waterAlpha,
      waterPresence: waterAlpha,
      hydrosphereBinding: clamp01(hydrosphereBinding * (0.9 + handshakeSeat * 0.1)),
      surfaceSeat: clamp01(surfaceSeat * (0.9 + handshakeSeat * 0.1)),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false,
      planetaryBoundarySource: "hex-four-pair-body-handshake",
      visualPassClaimed: false
    };
  }

  function normalizeAir(raw, p) {
    const fallback = fallbackAir(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "airRgb", "atmosphereRgb"], fallback.rgb);
    const airAlpha = clamp01(safeNumber(source.airAlpha ?? source.airPresence ?? source.alpha, fallback.airAlpha));

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: airAlpha,
      airAlpha,
      airPresence: airAlpha,
      bodyBound: false,
      surfaceBound: false,
      floatsAboveBody: true,
      allowedToFloat: true,
      mayDefineLand: false,
      mayDefineWater: false,
      atmosphereMayDefineBoundary: false,
      boundaryAuthority: "rim-only-not-body-boundary",
      visualPassClaimed: false
    };
  }

  function composeChannels(land, water, air, p, handshake) {
    const landSeat = clamp01(land.bodyBinding * land.surfaceAttachment);
    const waterSeat = clamp01(water.hydrosphereBinding * water.surfaceSeat);
    const bodyHandshake = clamp01(safeNumber(handshake && handshake.coordinateContinuity, 1));

    const rawLandWeight = clamp01(land.landAlpha * (0.75 + landSeat * 0.28) * bodyHandshake);
    const rawWaterWeight = clamp01(water.waterAlpha * (0.72 + waterSeat * 0.24) * bodyHandshake);

    const landRgb0 = colorField(land, ["rgb", "color"], COLORS.landLow);
    const waterRgb0 = colorField(water, ["rgb", "color"], COLORS.waterMid);
    const contrast = ensureContrast(landRgb0, waterRgb0);
    const landRgb = contrast.landRgb;
    const waterRgb = contrast.waterRgb;

    let rgb = mixColor(COLORS.shellMid, waterRgb, clamp01(rawWaterWeight * 0.98));
    rgb = mixColor(rgb, landRgb, clamp01(rawLandWeight * 0.94));

    const light = normalize3({ x: -0.34, y: 0.44, z: 0.82 });
    const illumination = clamp01(0.68 + dot3(p, light) * 0.28);
    const bodyLock = clamp01(0.42 + rawLandWeight * 0.3 + rawWaterWeight * 0.22 + bodyHandshake * 0.18);
    const shade = clamp01(0.74 + illumination * 0.22 + bodyLock * 0.06);
    rgb = scaleColor(rgb, shade);

    const rimAirOnly = clamp01(air.airAlpha * (0.12 + safeNumber(air.rimHaze, 0) * 0.18));
    rgb = mixColor(rgb, air.rgb, rimAirOnly);

    return {
      rgb,
      alpha: 1,
      landWeight: rawLandWeight,
      waterWeight: rawWaterWeight,
      airWeight: rimAirOnly,
      bodyLock,
      contrastDelta: contrast.contrastDelta,
      contrastAdjusted: contrast.adjusted,
      planetaryBoundarySource: "hex-four-pair-body-handshake",
      atmosphereDefinesBoundary: false,
      opaqueBodyTexture: true
    };
  }

  function multiplexSample(...args) {
    const p = parseInput(...args);
    const first = args[0] && typeof args[0] === "object" ? args[0] : {};
    const options = {
      width: safeNumber(first.width, DEFAULT_ATLAS_WIDTH),
      height: safeNumber(first.height, DEFAULT_ATLAS_HEIGHT)
    };
    const handshake = readHandshake(p, options);
    const land = normalizeLand(callChannel(getLandChannel(), args, p, options), p, handshake);
    const water = normalizeWater(callChannel(getWaterChannel(), args, p, options), p, handshake);
    const air = normalizeAir(callChannel(getAirChannel(), args, p, options), p);
    const composed = composeChannels(land, water, air, p, handshake);
    const packet = vectorPacket(p, options);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-hex-four-pair-body-boundary-carrier",

      ...packet,
      rgb: composed.rgb,
      color: composed.rgb,
      alpha: composed.alpha,

      handshake,
      hexHandshakeLoaded: Boolean(getHexAuthority()),
      fourPairPixelSet: handshake.fourPairSet || {},
      fourPairContinuity: handshake.fourPairContinuity ?? handshake.coordinateContinuity,
      bodyBoundaryAuthority: true,
      planetaryBoundarySource: composed.planetaryBoundarySource,
      atmosphereDefinesBoundary: false,
      atmosphericBoundaryRejection: 1,

      land,
      water,
      air,
      landWeight: composed.landWeight,
      waterWeight: composed.waterWeight,
      airWeight: composed.airWeight,
      bodyLock: composed.bodyLock,
      contrastDelta: composed.contrastDelta,
      contrastAdjusted: composed.contrastAdjusted,
      opaqueBodyTexture: true,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),
      channelMultiplexReady: Boolean(getHexAuthority() && getLandChannel() && getWaterChannel() && getAirChannel()),
      channelMultiplexDegraded: !Boolean(getHexAuthority() && getWaterChannel()),

      canvasOwnsLandTruth: false,
      canvasOwnsWaterTruth: false,
      canvasOwnsAirTruth: false,
      canvasOwnsHexHandshakeLaw: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const sample = (...args) => multiplexSample(...args);
  const read = (...args) => multiplexSample(...args);
  const compose = (...args) => multiplexSample(...args);
  const composeSample = (...args) => multiplexSample(...args);
  const composePixel = (...args) => multiplexSample(...args);
  const getPixel = (...args) => multiplexSample(...args);
  const getColor = (...args) => multiplexSample(...args).rgb;

  function spherePixelToVector(x, y, width, height) {
    const size = Math.min(width, height);
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    const radius = size * 0.5 * 0.985;
    const dx = (x - cx) / radius;
    const dy = (y - cy) / radius;
    const rr = dx * dx + dy * dy;

    if (rr > 1) {
      return {
        inside: false,
        radial: Math.sqrt(rr),
        edgeAlpha: 0,
        vector: { x: 0, y: 0, z: 1 }
      };
    }

    const radial = Math.sqrt(rr);
    return {
      inside: true,
      radial,
      edgeAlpha: clamp01((1 - radial) / 0.018),
      vector: normalize3({ x: dx, y: -dy, z: Math.sqrt(Math.max(0, 1 - rr)) })
    };
  }

  function rotateY(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
  }

  function rotateX(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
  }

  function rotateForView(p, lon, lat) {
    return normalize3(rotateY(rotateX(p, lat), lon));
  }

  function sampleAtlasNearest(atlas, u, v) {
    const x = clamp(Math.round(wrap01(u) * (atlas.width - 1)), 0, atlas.width - 1);
    const y = clamp(Math.round(clamp01(v) * (atlas.height - 1)), 0, atlas.height - 1);
    const i = (y * atlas.width + x) * 4;
    return [atlas.data[i], atlas.data[i + 1], atlas.data[i + 2], atlas.data[i + 3]];
  }

  function renderSphereFromAtlas(targetCanvas, atlas, state = {}) {
    if (!targetCanvas || !atlas || !atlas.data || typeof targetCanvas.getContext !== "function") return targetCanvas;

    const ctx = targetCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;
    const rotationLon = safeNumber(state.rotationLon, 0);
    const rotationLat = safeNumber(state.rotationLat, 0);
    const light = normalize3({ x: -0.36, y: 0.45, z: 0.82 });

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sphere = spherePixelToVector(x, y, width, height);
        const i = (y * width + x) * 4;

        if (!sphere.inside) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const world = rotateForView(sphere.vector, rotationLon, rotationLat);
        const ll = vectorToLonLat(world);
        const src = sampleAtlasNearest(atlas, lonToU(ll.lon), latToV(ll.lat));
        const illumination = clamp01(0.67 + dot3(sphere.vector, light) * 0.29);
        const limbDark = clamp01(1 - sphere.radial * 0.16);
        const rim = clamp01((sphere.radial - 0.78) / 0.22) * 0.1;
        const shaded = scaleColor([src[0], src[1], src[2]], illumination * limbDark);
        const finalRgb = mixColor(shaded, COLORS.rim, rim);

        data[i] = finalRgb[0];
        data[i + 1] = finalRgb[1];
        data[i + 2] = finalRgb[2];
        data[i + 3] = Math.round(255 * sphere.edgeAlpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    targetCanvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    targetCanvas.dataset.hearthCanvasAtlasReady = "true";
    targetCanvas.dataset.hearthCanvasImageRendered = "true";
    targetCanvas.dataset.hearthCanvasFrames = String(safeNumber(targetCanvas.dataset.hearthCanvasFrames, 0) + 1);

    return targetCanvas;
  }

  function drawFallbackShell(canvas, state = {}) {
    if (!canvas || typeof canvas.getContext !== "function") return canvas;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size * 0.47;
    const pulse = Math.sin(safeNumber(state.frames, 0) * 0.06) * 0.5 + 0.5;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(cx - r * 0.26, cy - r * 0.34, r * 0.06, cx, cy, r);
    shell.addColorStop(0, "rgba(80, 105, 116, 0.98)");
    shell.addColorStop(0.32, "rgba(26, 52, 80, 1)");
    shell.addColorStop(0.72, "rgba(5, 16, 42, 1)");
    shell.addColorStop(1, "rgba(0, 2, 10, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = `rgba(178,222,242, ${0.22 + pulse * 0.08})`;
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasNeutralLoadingShell = "true";
    canvas.dataset.hearthCanvasImageRendered = "true";
    canvas.dataset.visualPassClaimed = "false";
    return canvas;
  }

  function scheduleWork(fn) {
    if (root.requestIdleCallback) {
      root.requestIdleCallback(fn, { timeout: 80 });
      return;
    }

    if (root.requestAnimationFrame) {
      root.requestAnimationFrame(fn);
      return;
    }

    setTimeout(fn, 0);
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth atlas requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(Math.round(safeNumber(options.width, DEFAULT_ATLAS_WIDTH)), 32, options.allowLargeTexture ? 1024 : 512);
    const height = clamp(Math.round(safeNumber(options.height, DEFAULT_ATLAS_HEIGHT)), 16, options.allowLargeTexture ? 512 : 256);
    const rowsPerChunk = clamp(Math.round(safeNumber(options.rowsPerChunk, 2)), 1, 8);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthHexFourPairBodyBoundary = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let y = 0;
    let cancelled = false;

    const controller = {
      canvas,
      width,
      height,
      cancel() {
        cancelled = true;
      }
    };

    const processChunk = () => {
      if (cancelled) return;

      try {
        const endY = Math.min(height, y + rowsPerChunk);

        for (; y < endY; y += 1) {
          const v = height <= 1 ? 0.5 : (y + 0.5) / height;

          for (let x = 0; x < width; x += 1) {
            const u = width <= 1 ? 0.5 : (x + 0.5) / width;
            const px = multiplexSample({ u, v, width, height });
            const i = (y * width + x) * 4;

            data[i] = px.rgb[0];
            data[i + 1] = px.rgb[1];
            data[i + 2] = px.rgb[2];
            data[i + 3] = 255;
          }
        }

        const progress = clamp01(y / height);
        if (typeof handlers.onProgress === "function") handlers.onProgress(progress, { y, width, height, rowsPerChunk });

        if (y >= height) {
          ctx.putImageData(image, 0, 0);
          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);
          if (typeof handlers.onComplete === "function") handlers.onComplete({ canvas, width, height, data: atlasImage.data });
          return;
        }

        scheduleWork(processChunk);
      } catch (error) {
        if (typeof handlers.onError === "function") handlers.onError(error);
      }
    };

    scheduleWork(processChunk);
    return controller;
  }

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas requires document.createElement.");
    }

    const size = clamp(Math.round(safeNumber(options.size ?? options.width, 420)), 240, options.allowLargeTexture ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-hex-four-pair-body-boundary-carrier";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    Object.assign(canvas.dataset, {
      hearthCanvasTexture: "true",
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
      hearthCanvasBaselineContract: BASELINE_CONTRACT,
      hearthCanvasVisibleCarrier: "true",
      hearthCanvasShellFirst: "true",
      hearthCanvasPlanConsumer: "true",
      hearthCanvasHexFourPairBoundary: "true",
      hearthCanvasOwnsHexHandshakeLaw: "false",
      hearthCanvasOwnsLandTruth: "false",
      hearthCanvasOwnsWaterTruth: "false",
      hearthCanvasOwnsAirTruth: "false",
      hearthPlanetBoundarySource: "hex-four-pair-body-handshake",
      hearthAtmosphereDefinesBoundary: "false",
      hearthOpaqueBodyTexture: "true",
      hearthRuntimeTableContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
      hearthHexHandshakeAuthorityContract: HEX_CONTRACT,
      hearthCanvasLandChannelContract: LAND_CONTRACT,
      hearthCanvasWaterChannelContract: WATER_CONTRACT,
      hearthCanvasAirChannelContract: AIR_CONTRACT,
      hearthRouteControllerContract: HEARTH_ROUTE_CONTROLLER_CONTRACT,
      hearthRoutePreviousContract: HEARTH_ROUTE_PREVIOUS_CONTRACT,
      visualCarrierAllowed: "true",
      visualizationBlocked: "false",
      visualCarrierMode: "hex-four-pair-atlas-carrier",
      visualDiagnosticStatus: "PENDING",
      visualDiagnosticCue: "SHELL_FIRST_HEX_BOUNDARY_LOADING",
      hearthCanvasAtlasReady: "false",
      hearthCanvasAtlasBuilding: "false",
      hearthCanvasAtlasProgress: "0",
      hearthCanvasSphereContainment: "true",
      hearthCanvasOutsideSphereTransparent: "true",
      hearthCanvasNoRectangularTextureSpill: "true",
      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      routeMutation: "false",
      runtimeMutation: "false",
      controlsMutation: "false",
      visualPassClaimed: "false"
    });

    return canvas;
  }

  function createLoadingPanel() {
    const panel = root.document.createElement("aside");
    panel.dataset.hearthRuntimeLoadingPanel = "true";
    panel.style.position = "absolute";
    panel.style.left = "50%";
    panel.style.bottom = "14px";
    panel.style.transform = "translateX(-50%)";
    panel.style.width = "min(92%, 580px)";
    panel.style.maxHeight = "58%";
    panel.style.overflow = "auto";
    panel.style.padding = "12px 14px";
    panel.style.border = "1px solid rgba(174,216,236,.22)";
    panel.style.borderRadius = "16px";
    panel.style.background = "linear-gradient(180deg, rgba(5,9,19,.84), rgba(2,5,12,.76))";
    panel.style.backdropFilter = "blur(10px)";
    panel.style.boxShadow = "0 18px 50px rgba(0,0,0,.36)";
    panel.style.color = "rgba(238,246,255,.9)";
    panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.fontSize = "11px";
    panel.style.lineHeight = "1.35";
    panel.style.pointerEvents = "auto";
    panel.style.zIndex = "4";
    return panel;
  }

  function statusBadge(value) {
    const text = String(value || "pending").toLowerCase();
    if (text.includes("fail") || text.includes("block") || text.includes("reject") || text.includes("error")) return "✕";
    if (text.includes("ready") || text.includes("pass") || text.includes("loaded") || text.includes("complete")) return "✓";
    if (text.includes("building") || text.includes("loading")) return "•";
    return "◐";
  }

  function formatPercent(value) {
    return `${Math.round(clamp01(value) * 100)}%`;
  }

  function createDiagnosticExport(state, canvas) {
    const dataset = {};
    if (canvas && canvas.dataset) {
      Object.keys(canvas.dataset).forEach((key) => {
        dataset[key] = canvas.dataset[key];
      });
    }

    return [
      "HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT",
      "",
      `timestamp=${nowIso()}`,
      `canvasContract=${CONTRACT}`,
      `canvasReceipt=${RECEIPT}`,
      `previousCanvasContract=${PREVIOUS_CONTRACT}`,
      `hexAuthorityContract=${HEX_CONTRACT}`,
      `hexAuthorityLoaded=${String(Boolean(getHexAuthority()))}`,
      `landChannelLoaded=${String(Boolean(getLandChannel()))}`,
      `waterChannelLoaded=${String(Boolean(getWaterChannel()))}`,
      `airChannelLoaded=${String(Boolean(getAirChannel()))}`,
      `planetaryBoundarySource=hex-four-pair-body-handshake`,
      `atmosphereDefinesBoundary=false`,
      `atlasReady=${String(Boolean(state.atlasReady))}`,
      `atlasProgress=${Number(state.atlasProgress || 0)}`,
      `imageRendered=${String(Boolean(state.imageRendered))}`,
      `visualPassClaimed=false`,
      "",
      "CANVAS_DATASET",
      JSON.stringify(dataset, null, 2),
      "",
      "ANCHOR_SAMPLE",
      JSON.stringify(sample({ u: 0.5, v: 0.5 }), null, 2)
    ].join("\n");
  }

  function renderLoadingPanel(panel, api) {
    if (!panel || !api || !api.state) return;

    const state = api.state;
    const exportText = createDiagnosticExport(state, api.canvas);
    const rows = [
      ["Hex authority", getHexAuthority() ? "loaded" : "loading"],
      ["Four-pair boundary", getHexAuthority() ? "ready" : "fallback"],
      ["Land channel", getLandChannel() ? "loaded" : "fallback"],
      ["Water channel", getWaterChannel() ? "loaded" : "fallback"],
      ["Air channel", getAirChannel() ? "loaded" : "fallback"],
      ["Atlas", state.atlasReady ? "complete" : state.atlasBuilding ? "building" : "pending"],
      ["Boundary source", "body handshake"],
      ["Air boundary", "rejected"]
    ];

    state.diagnosticExport = exportText;
    if (api.canvas && api.canvas.dataset) {
      api.canvas.dataset.hearthDiagnosticExportAvailable = "true";
      api.canvas.dataset.hearthDiagnosticExportLength = String(exportText.length);
    }

    const rowsHtml = rows.map(([label, value]) => [
      "<div style=\"display:grid;grid-template-columns:22px 1fr auto;gap:7px;align-items:center;padding:2px 0;\">",
      `<span style="opacity:.78;">${statusBadge(value)}</span>`,
      `<span style="opacity:.86;">${escapeHtml(label)}</span>`,
      `<span style="opacity:.72;text-transform:uppercase;letter-spacing:.08em;font-size:9px;text-align:right;">${escapeHtml(value)}</span>`,
      "</div>"
    ].join("")).join("");

    panel.innerHTML = [
      "<div style=\"display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;\">",
      "<strong style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;\">Hearth Hex Boundary Plan</strong>",
      `<span style="font-size:10px;opacity:.70;">${escapeHtml(formatPercent(state.atlasProgress || 0))}</span>`,
      "</div>",
      "<div style=\"height:4px;border-radius:999px;background:rgba(174,216,236,.12);overflow:hidden;margin-bottom:9px;\">",
      `<div style="height:100%;width:${escapeHtml(formatPercent(state.atlasProgress || 0))};background:rgba(174,216,236,.72);border-radius:999px;"></div>`,
      "</div>",
      "<div style=\"display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px;\">",
      "<button type=\"button\" data-hearth-receipt-copy style=\"border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;\">Copy diagnostic</button>",
      "</div>",
      rowsHtml
    ].join("");

    const copy = panel.querySelector("[data-hearth-receipt-copy]");
    if (copy) {
      copy.onclick = () => {
        const text = createDiagnosticExport(api.state, api.canvas);
        const setCopied = (ok, error) => {
          if (api.canvas && api.canvas.dataset) {
            api.canvas.dataset.hearthDiagnosticExportCopied = String(Boolean(ok));
            api.canvas.dataset.hearthDiagnosticExportError = error || "";
          }
        };

        if (root.navigator && root.navigator.clipboard && typeof root.navigator.clipboard.writeText === "function") {
          root.navigator.clipboard.writeText(text).then(
            () => setCopied(true, ""),
            (error) => setCopied(false, error && error.message ? error.message : String(error))
          );
        } else {
          setCopied(false, "clipboard unavailable");
        }
      };
    }
  }

  function loadScriptDetailed(item, options = {}) {
    return new Promise((resolve) => {
      const result = {
        key: item.key,
        label: item.label,
        path: item.path,
        requestedSrc: "",
        expectedContract: item.contract,
        actualContract: "",
        requested: false,
        loaded: false,
        alreadyPresent: false,
        globalName: item.globalName,
        globalPresent: false,
        contractOk: false,
        validationOk: false,
        error: "",
        errorType: "",
        failureCoordinate: "C0_NOT_STARTED",
        at: nowIso()
      };

      const validate = () => {
        const authority = root[item.globalName];
        result.globalPresent = Boolean(authority);
        result.actualContract = authority && authority.contract ? String(authority.contract) : "";
        result.contractOk = item.contract ? result.actualContract === item.contract : Boolean(authority);
        result.validationOk = result.globalPresent && result.contractOk;
        return result.validationOk;
      };

      if (validate()) {
        result.loaded = true;
        result.alreadyPresent = true;
        result.failureCoordinate = "C11_CHILD_VALIDATED";
        resolve(result);
        return;
      }

      if (!root.document || !root.document.head) {
        result.error = "document-head-unavailable";
        result.errorType = "document";
        result.failureCoordinate = "C3_SCRIPT_APPEND_UNAVAILABLE";
        resolve(result);
        return;
      }

      Array.from(root.document.querySelectorAll(`script[data-hearth-loader-marker="${item.marker}"]`)).forEach((script) => {
        try {
          if (script.parentNode) script.parentNode.removeChild(script);
        } catch (_error) {}
      });

      const script = root.document.createElement("script");
      const joiner = item.path.includes("?") ? "&" : "?";
      result.requestedSrc = `${item.path}${joiner}v=${encodeURIComponent(item.cacheKey || VERSION)}`;
      result.requested = true;
      result.failureCoordinate = "C1_SCRIPT_REQUEST_PREPARED";

      script.src = result.requestedSrc;
      script.defer = true;
      script.dataset.hearthLoaderMarker = item.marker;
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthScriptExpectedContract = item.contract || "";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;
      const settle = (kind, errorText) => {
        if (settled) return;
        settled = true;
        result.error = errorText || "";
        result.errorType = kind === "load" ? "" : kind;
        validate();
        result.loaded = result.validationOk;
        result.failureCoordinate = result.validationOk
          ? "C11_CHILD_VALIDATED"
          : kind === "error"
            ? "C4_SCRIPT_NETWORK_LOAD_FAILURE"
            : result.globalPresent
              ? "C7_CONTRACT_MISMATCH"
              : "C6_GLOBAL_ACTOR_MISSING";
        resolve(result);
      };

      script.onload = () => settle("load", "");
      script.onerror = () => settle("error", "load-error");

      try {
        root.document.head.appendChild(script);
        result.failureCoordinate = "C3_SCRIPT_APPENDED";
      } catch (error) {
        settle("append-error", error && error.message ? error.message : String(error));
        return;
      }

      setTimeout(() => settle("timeout", "script-load-timeout"), options.timeoutMs || 6000);
    });
  }

  function ensureAuthorityScripts(options = {}) {
    const files = [
      { key: "hex", label: "Hex handshake authority", path: HEX_PATH, contract: HEX_CONTRACT, globalName: "HEARTH_HEX_HANDSHAKE_AUTHORITY", marker: "hearth-hex-handshake-authority", cacheKey: HEX_CACHE_KEY },
      { key: "land", label: "Land channel", path: LAND_PATH, contract: LAND_CONTRACT, globalName: "HEARTH_LAND_CHANNEL", marker: "hearth-land-channel", cacheKey: "hearth-land-channel-active-v1" },
      { key: "water", label: "Water channel", path: WATER_PATH, contract: WATER_CONTRACT, globalName: "HEARTH_WATER_CHANNEL", marker: "hearth-water-channel", cacheKey: "hearth-water-channel-runtime-table-directed-v1" },
      { key: "air", label: "Air channel", path: AIR_PATH, contract: AIR_CONTRACT, globalName: "HEARTH_AIR_CHANNEL", marker: "hearth-air-channel", cacheKey: "hearth-air-channel-active-v1" }
    ];

    return Promise.all(files.map((item) => loadScriptDetailed(item, options)));
  }

  function ensureRuntimeTable(options = {}) {
    return loadScriptDetailed({
      key: "runtime-table",
      label: "Lab Runtime Table",
      path: LAB_RUNTIME_TABLE_PATH,
      contract: REQUIRED_RUNTIME_TABLE_CONTRACT,
      globalName: "LAB_RUNTIME_TABLE",
      marker: "lab-runtime-table",
      cacheKey: RUNTIME_TABLE_CACHE_KEY
    }, options);
  }

  function applyDataset(canvas, state = {}) {
    const rootDataset = root.document && root.document.documentElement ? root.document.documentElement.dataset : null;
    const pairs = {
      hearthCanvasAuthorityLoaded: "true",
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasPreviousContract: PREVIOUS_CONTRACT,
      hearthCanvasBaselineContract: BASELINE_CONTRACT,
      hearthHexHandshakeAuthorityLoaded: String(Boolean(getHexAuthority())),
      hearthHexHandshakeAuthorityContract: HEX_CONTRACT,
      hearthHexFourPairSet: "true",
      hearthHexDirections: "north,south,east,west",
      hearthPlanetBoundarySource: "hex-four-pair-body-handshake",
      hearthAtmosphereDefinesBoundary: "false",
      hearthCanvasOpaqueBodyTexture: "true",
      hearthLandChannelLoaded: String(Boolean(getLandChannel())),
      hearthWaterChannelLoaded: String(Boolean(getWaterChannel())),
      hearthAirChannelLoaded: String(Boolean(getAirChannel())),
      hearthCanvasAtlasReady: String(Boolean(state.atlasReady)),
      hearthCanvasAtlasBuilding: String(Boolean(state.atlasBuilding)),
      hearthCanvasAtlasProgress: String(state.atlasProgress || 0),
      hearthCanvasImageRendered: String(Boolean(state.imageRendered)),
      hearthRouteControllerContract: HEARTH_ROUTE_CONTROLLER_CONTRACT,
      hearthRoutePreviousContract: HEARTH_ROUTE_PREVIOUS_CONTRACT,
      waterFailureDoesNotBlockAtlas: "true",
      visualizationBlocksOnlyWhenCarrierUnsafe: "true",
      constructionReadyIsNotCoherencePass: "true",
      imageRenderedIsNotCoherencePass: "true",
      coherentExpressionPassIsNotVisualPassClaim: "true",
      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      routeMutation: "false",
      runtimeMutation: "false",
      controlsMutation: "false",
      visualPassClaimed: "false"
    };

    Object.keys(pairs).forEach((key) => {
      if (canvas && canvas.dataset) canvas.dataset[key] = pairs[key];
      if (rootDataset) rootDataset[key] = pairs[key];
    });
  }

  function bindPointerDrag(canvas, api) {
    const state = api.state;

    const down = (event) => {
      if (state.destroyed) return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      canvas.style.cursor = "grabbing";
      canvas.dataset.hearthCanvasDragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try { canvas.setPointerCapture(event.pointerId); } catch (_error) {}
      }

      if (event.cancelable) event.preventDefault();
    };

    const move = (event) => {
      if (state.destroyed || !state.dragging) return;
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.rotationLon -= dx * 0.01;
      state.rotationLat = clamp(state.rotationLat + dy * 0.008, -Math.PI * 0.42, Math.PI * 0.42);

      canvas.dataset.hearthCanvasRotationLon = String(state.rotationLon);
      canvas.dataset.hearthCanvasRotationLat = String(state.rotationLat);
      api.requestRedraw();

      if (event.cancelable) event.preventDefault();
    };

    const up = (event) => {
      if (state.destroyed) return;
      if (state.pointerId !== null && event && event.pointerId !== state.pointerId) return;

      state.dragging = false;
      state.pointerId = null;
      canvas.style.cursor = "grab";
      canvas.dataset.hearthCanvasDragging = "false";

      if (event && canvas.releasePointerCapture && event.pointerId !== undefined) {
        try { canvas.releasePointerCapture(event.pointerId); } catch (_error) {}
      }

      if (event && event.cancelable) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", down, { passive: false });
    canvas.addEventListener("pointermove", move, { passive: false });
    canvas.addEventListener("pointerup", up, { passive: false });
    canvas.addEventListener("pointercancel", up, { passive: false });
    canvas.addEventListener("lostpointercapture", up, { passive: false });
    canvas.dataset.hearthCanvasControlsBound = "true";

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);
      canvas.dataset.hearthCanvasControlsBound = "false";
    };
  }

  function startAtlas(api, options = {}) {
    const state = api.state;
    if (state.destroyed || state.atlasBuilding || state.atlasReady) return;

    state.atlasBuilding = true;
    state.atlasReady = false;
    state.atlasProgress = 0;
    state.atlasStartTimestamp = nowIso();
    api.canvas.dataset.atlasStartAttempted = "true";
    api.canvas.dataset.atlasStartTimestamp = state.atlasStartTimestamp;

    applyDataset(api.canvas, state);
    renderLoadingPanel(api.loadingPanel, api);

    state.atlasController = buildAtlasAsync({
      width: options.atlasWidth || DEFAULT_ATLAS_WIDTH,
      height: options.atlasHeight || DEFAULT_ATLAS_HEIGHT,
      rowsPerChunk: options.rowsPerChunk || 2,
      allowLargeTexture: options.allowLargeTexture === true
    }, {
      onProgress(progress) {
        if (state.destroyed) return;
        state.atlasProgress = progress;
        api.canvas.dataset.hearthCanvasAtlasProgress = String(progress);
        renderLoadingPanel(api.loadingPanel, api);
      },
      onComplete(atlas) {
        if (state.destroyed) return;
        state.atlas = atlas;
        state.atlasReady = true;
        state.atlasBuilding = false;
        state.atlasProgress = 1;
        state.imageRendered = true;
        renderSphereFromAtlas(api.canvas, atlas, state);
        applyDataset(api.canvas, state);
        renderLoadingPanel(api.loadingPanel, api);
      },
      onError(error) {
        if (state.destroyed) return;
        state.atlasReady = false;
        state.atlasBuilding = false;
        state.imageRendered = true;
        api.canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);
        drawFallbackShell(api.canvas, state);
        applyDataset(api.canvas, state);
        renderLoadingPanel(api.loadingPanel, api);
      }
    });
  }

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element = typeof target === "string" ? root.document.querySelector(target) : target && target.nodeType === 1 ? target : null;
    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-frame], [data-hearth-runtime-loading-panel], [data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => node.remove());

    const position = root.getComputedStyle ? root.getComputedStyle(element).position : "";
    if (!position || position === "static") element.style.position = "relative";

    const frame = root.document.createElement("div");
    frame.dataset.hearthCanvasFrame = "true";
    frame.dataset.hearthCanvasHexFourPairBodyBoundary = "true";
    frame.style.position = "relative";
    frame.style.display = "grid";
    frame.style.placeItems = "center";
    frame.style.width = "100%";
    frame.style.minHeight = "260px";
    frame.style.overflow = "hidden";

    const canvas = createShellCanvas(options);
    const loadingPanel = createLoadingPanel();

    frame.appendChild(canvas);
    frame.appendChild(loadingPanel);
    element.appendChild(frame);

    const state = {
      rotationLon: safeNumber(options.rotationLon, 0),
      rotationLat: safeNumber(options.rotationLat, 0),
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      destroyed: false,
      redrawPending: false,
      atlas: null,
      atlasController: null,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      imageRendered: true,
      authorityResults: [],
      diagnosticExport: ""
    };

    const api = {
      canvas,
      frame,
      loadingPanel,
      node: element,
      state,
      contract: CONTRACT,
      receipt: RECEIPT,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;
        state.redrawPending = false;

        if (state.atlasReady && state.atlas) renderSphereFromAtlas(canvas, state.atlas, state);
        else drawFallbackShell(canvas, state);

        state.frames += 1;
        canvas.dataset.hearthCanvasFrames = String(state.frames);
        return canvas;
      },
      requestRedraw() {
        if (state.destroyed || state.redrawPending) return;
        state.redrawPending = true;

        if (root.requestAnimationFrame) root.requestAnimationFrame(() => api.redraw());
        else setTimeout(() => api.redraw(), 16);
      },
      destroy() {
        state.destroyed = true;
        if (state.atlasController && typeof state.atlasController.cancel === "function") state.atlasController.cancel();
        if (typeof api.unbindControls === "function") api.unbindControls();
        if (frame.parentNode) frame.parentNode.removeChild(frame);
      },
      unbindControls: null
    };

    drawFallbackShell(canvas, state);
    api.unbindControls = bindPointerDrag(canvas, api);
    applyDataset(canvas, state);
    renderLoadingPanel(loadingPanel, api);

    setTimeout(() => {
      if (state.destroyed) return;

      Promise.all([
        ensureRuntimeTable(options).catch((error) => ({ key: "runtime-table", error: error && error.message ? error.message : String(error), validationOk: false })),
        ensureAuthorityScripts(options).catch((error) => [{ key: "authority-scripts", error: error && error.message ? error.message : String(error), validationOk: false }])
      ]).then(([runtimeResult, authorityResults]) => {
        if (state.destroyed) return;

        state.runtimeResult = runtimeResult;
        state.authorityResults = authorityResults;

        canvas.dataset.hearthRuntimeTableLoaded = String(Boolean(runtimeResult && runtimeResult.validationOk));
        canvas.dataset.hearthRuntimeTableActualContract = runtimeResult && runtimeResult.actualContract ? runtimeResult.actualContract : "";
        canvas.dataset.hearthAuthorityLoadResults = JSON.stringify(authorityResults.map((item) => ({ key: item.key, validationOk: item.validationOk, coordinate: item.failureCoordinate })));

        const planApi = getRuntimePlanAuthority();
        if (planApi && typeof planApi.createHearthVisualCarrierPlan === "function") {
          try {
            const centerSample = sample({ u: 0.5, v: 0.5 });

            state.runtimePlan = planApi.createHearthVisualCarrierPlan({
              routeMounted: true,
              canvasMounted: true,
              fallbackShellAvailable: true,
              imageRendered: true,
              canvasSample: centerSample,
              landSample: centerSample.land,
              waterSample: centerSample.water,
              airSample: centerSample.air,
              canvasReceipt: getReceipt()
            }, { runHearthTable: false, profile: "hearth-hex-four-pair-body-boundary" });

            canvas.dataset.hearthRuntimeTablePlanConsumed = "true";
          } catch (error) {
            canvas.dataset.hearthRuntimeTablePlanError = error && error.message ? error.message : String(error);
          }
        }

        applyDataset(canvas, state);
        renderLoadingPanel(loadingPanel, api);
        startAtlas(api, options);
      });
    }, 0);

    return api;
  }

  function createAtlasTextureCanvas(options = {}) {
    const controller = buildAtlasAsync(options);
    return controller.canvas;
  }

  function createSphereTextureCanvas(options = {}) {
    const canvas = createShellCanvas(options);
    drawFallbackShell(canvas, {});
    return canvas;
  }

  function createTextureCanvas(options = {}) {
    if (options && options.atlas === true) return createAtlasTextureCanvas(options);
    return createSphereTextureCanvas(options);
  }

  function paintToCanvas(targetCanvas) {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") return null;

    drawFallbackShell(targetCanvas, {});
    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthPlanetBoundarySource = "hex-four-pair-body-handshake";
    targetCanvas.dataset.hearthAtmosphereDefinesBoundary = "false";
    targetCanvas.dataset.visualPassClaimed = "false";

    return targetCanvas;
  }

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const mount = (target, options = {}) => createShellFirstMount(target, options);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-hex-four-pair-body-boundary-carrier",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      role: "Hearth visible carrier consuming Hex Four-Pair Pixel Handshake Authority",
      hexAuthorityPath: HEX_PATH,
      hexAuthorityContract: HEX_CONTRACT,
      childChannels: [LAND_PATH, WATER_PATH, AIR_PATH],
      childContracts: {
        land: LAND_CONTRACT,
        water: WATER_CONTRACT,
        air: AIR_CONTRACT
      },
      renderLaw: [
        "planetary boundary is the body-bound hex four-pair coordinate handshake",
        "every atlas pixel has north/south/east/west pair authority when the hex authority is loaded",
        "land and water are composited only after body seating and surface binding",
        "air is rim/atmosphere expression only and cannot define the body boundary",
        "opaque body texture is enforced at the canvas carrier",
        "land/water contrast is calibrated after child-channel sampling but canvas does not own child truth"
      ],
      owns: [
        "visible canvas shell",
        "pointer/touch drag binding",
        "hex authority script loading",
        "child channel script loading",
        "atlas build execution",
        "sphere projection expression",
        "opaque body compositing",
        "diagnostic export"
      ],
      doesNotOwn: [
        "hex handshake law",
        "Runtime Table procedural law",
        "Triple G diagnostic law",
        "land truth",
        "water truth",
        "air truth",
        "hydrology law",
        "materials law",
        "route orchestration",
        "runtime motion authority",
        "controls authority",
        "final visual pass claim"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    sample,
    read,
    compose,
    composeSample,
    composePixel,
    getPixel,
    getColor,

    createShellCanvas,
    drawFallbackShell,
    buildAtlasAsync,
    renderSphereFromAtlas,
    createShellFirstMount,
    createTextureCanvas,
    createSphereTextureCanvas,
    createAtlasTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,
    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,

    ensureRuntimeTable,
    ensureAuthorityScripts,
    createDiagnosticExport,
    getReceipt,

    supportsHexFourPairBoundary: true,
    supportsNorthSouthEastWestPixelHandshake: true,
    supportsOpaqueBodyTexture: true,
    supportsAtmosphericBoundaryRejection: true,
    supportsImmediateVisibleCarrier: true,
    supportsImmediatePointerDrag: true,
    supportsAsyncAtlasBuild: true,

    canvasOwnsHexHandshakeLaw: false,
    canvasOwnsLandTruth: false,
    canvasOwnsWaterTruth: false,
    canvasOwnsAirTruth: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_RECEIPT = getReceipt();
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY = true;
  root.HEARTH_CANVAS_ATMOSPHERE_DEFINES_BOUNDARY = false;

  if (root.document && root.document.documentElement) {
    applyDataset(null, {});
    const dataset = root.document.documentElement.dataset;

    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasConsumesHexHandshakeAuthority = "true";
    dataset.hearthHexHandshakeAuthorityPath = HEX_PATH;
    dataset.hearthHexHandshakeAuthorityExpectedContract = HEX_CONTRACT;
    dataset.hearthCanvasConsumesLabRuntimeTable = "true";
    dataset.hearthRuntimeTableContract = REQUIRED_RUNTIME_TABLE_CONTRACT;
    dataset.hearthCanvasLandChannelContract = LAND_CONTRACT;
    dataset.hearthCanvasWaterChannelContract = WATER_CONTRACT;
    dataset.hearthCanvasAirChannelContract = AIR_CONTRACT;
    dataset.hearthCanvasMountReturnsApiObject = "true";
    dataset.hearthCanvasSupportsTouchDrag = "true";
    dataset.hearthCanvasSupportsPointerDrag = "true";
    dataset.hearthCanvasAsyncAtlasBuild = "true";
    dataset.hearthCanvasVisibleCarrier = "true";
    dataset.hearthCanvasOpaqueBodyTexture = "true";
    dataset.hearthPlanetBoundarySource = "hex-four-pair-body-handshake";
    dataset.hearthAtmosphereDefinesBoundary = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
