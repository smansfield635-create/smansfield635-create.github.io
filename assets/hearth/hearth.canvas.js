// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1
// Full-file replacement.
// Canvas / visible carrier / plan-consumer authority only.
// Purpose:
// - Restore visible Hearth planet carrier immediately.
// - Keep pointer/touch drag active immediately.
// - Consume Runtime Table v3 procedural visual-carrier plan.
// - Let Runtime Table decide visual carrier eligibility, atlas-start authorization, mode, coordinates, and renewal target.
// - Start atlas when the Runtime Table plan authorizes it.
// - Preserve water-child failure as diagnostic degradation, not visualization erasure.
// - Keep water child as external truth authority.
// Does not own:
// - Runtime Table procedural law
// - Triple G diagnostic law
// - water truth
// - land truth
// - air truth
// - hydrology law
// - materials law
// - route orchestration
// - runtime motion authority
// - controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_ATLAS_START_SEQUENCING_HARDENING_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-runtime-table-directed-visible-carrier-v1";

  const LAB_RUNTIME_TABLE_PATH = "/assets/lab/runtime-table.js";
  const REQUIRED_RUNTIME_TABLE_CONTRACT = "LAB_RUNTIME_TABLE_VISUAL_CARRIER_ATLAS_SEQUENCE_STANDARD_TNT_v3";
  const PREVIOUS_RUNTIME_TABLE_CONTRACT = "LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2";
  const RUNTIME_TABLE_CACHE_KEY = "lab-runtime-table-visual-carrier-plan-v3";

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const AIR_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const LAND_PATH = "/assets/hearth/hearth.land.channel.js";
  const WATER_PATH = "/assets/hearth/hearth.water.channel.js";
  const AIR_PATH = "/assets/hearth/hearth.air.channel.js";

  const DEFAULT_SAMPLE_POINT = Object.freeze({
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0,
    x: 0,
    y: 0,
    z: 1
  });

  const CHANNEL_FILES = Object.freeze([
    {
      key: "land",
      label: "Land channel",
      path: LAND_PATH,
      contract: LAND_CONTRACT,
      globalName: "HEARTH_LAND_CHANNEL",
      marker: "hearth-land-channel",
      cacheKey: "hearth-land-channel-active-v1"
    },
    {
      key: "water",
      label: "Water channel",
      path: WATER_PATH,
      contract: WATER_CONTRACT,
      globalName: "HEARTH_WATER_CHANNEL",
      marker: "hearth-water-channel",
      cacheKey: "hearth-water-channel-runtime-table-directed-v1"
    },
    {
      key: "air",
      label: "Air channel",
      path: AIR_PATH,
      contract: AIR_CONTRACT,
      globalName: "HEARTH_AIR_CHANNEL",
      marker: "hearth-air-channel",
      cacheKey: "hearth-air-channel-active-v1"
    }
  ]);

  const COLORS = Object.freeze({
    shellDark: [4, 8, 18],
    shellMid: [15, 30, 48],
    shellLight: [67, 94, 104],
    landBase: [96, 88, 58],
    landBright: [132, 114, 72],
    waterBase: [7, 30, 78],
    waterBright: [12, 58, 132],
    air: [145, 190, 215],
    rim: [174, 216, 236],
    shadow: [1, 4, 12]
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!value || typeof value !== "object") return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
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

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
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
    return 90 - clamp(safeNumber(v, 0), 0, 1) * 180;
  }

  function rotateY(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x * c + p.z * s,
      y: p.y,
      z: -p.x * s + p.z * c
    };
  }

  function rotateX(p, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: p.x,
      y: p.y * c - p.z * s,
      z: p.y * s + p.z * c
    };
  }

  function rotateForView(p, rotationLon, rotationLat) {
    return normalize3(rotateY(rotateX(p, rotationLat), rotationLon));
  }

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
        edgeAlpha: 0,
        radial: Math.sqrt(rr),
        vector: { x: 0, y: 0, z: 1 }
      };
    }

    const radial = Math.sqrt(rr);
    const z = Math.sqrt(Math.max(0, 1 - rr));

    return {
      inside: true,
      edgeAlpha: clamp01((1 - radial) / 0.025),
      radial,
      vector: normalize3({
        x: dx,
        y: -dy,
        z
      })
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

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
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(args[0], args[1]);

    return lonLatToVector(0, 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((v) => Number.isFinite(Number(v)))
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
    const api =
      root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY ||
      root.LAB_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.visualCarrierPlanAuthority) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    return api || null;
  }

  function callChannel(authority, args, p) {
    if (!authority) return null;

    const ll = vectorToLonLat(p);
    const fallbackArg = {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      x: p.x,
      y: p.y,
      z: p.z,
      lon: ll.lon,
      lat: ll.lat
    };

    const methods = ["sample", "read"];

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {
        try {
          const result = authority[method].call(authority, fallbackArg);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}
      }
    }

    return null;
  }

  function fallbackLand(p) {
    const ll = vectorToLonLat(p);
    const ridge = Math.sin((ll.lon * 2.1 + 33) * DEG) * Math.cos((ll.lat * 1.7 - 14) * DEG);
    const continent = Math.sin((ll.lon + 82) * DEG) * 0.22 + Math.cos((ll.lat * 2.8 + 11) * DEG) * 0.18 + ridge * 0.18;
    const band = Math.cos((ll.lat + 7) * DEG) * 0.13;
    const signal = continent + band;
    const landAlpha = signal > 0.18 ? clamp01(0.28 + signal * 0.46) : clamp01(0.035 + Math.max(0, signal + 0.16) * 0.18);
    const high = clamp01((signal - 0.12) * 2.4);

    return {
      contract: "FALLBACK_LAND_DIAGNOSTIC_CARRIER",
      channel: "land",
      isLandChannel: true,
      isWaterChannel: false,
      isAirChannel: false,
      channelClass: landAlpha > 0.2 ? "fallback-body-bound-land" : "fallback-low-land",
      landClass: landAlpha > 0.2 ? "fallback-body-bound-land" : "fallback-low-land",
      landPresence: landAlpha,
      landAlpha,
      landPotential: landAlpha,
      bodyBinding: 0.86,
      surfaceAttachment: 0.86,
      atmosphericRejection: 0.8,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineWater: false,
      mayDefineAir: false,
      elevation: high,
      rgb: mixColor(COLORS.landBase, COLORS.landBright, high),
      color: mixColor(COLORS.landBase, COLORS.landBright, high),
      alpha: landAlpha,
      canvasFallbackOnly: true,
      visualDiagnosticOnly: true,
      visualPassClaimed: false
    };
  }

  function fallbackWater(p) {
    const ll = vectorToLonLat(p);
    const oceanGate = Math.sin((ll.lon - 12) * DEG) * 0.18 - Math.cos((ll.lat * 2.3 + 22) * DEG) * 0.22;
    const basin = p.z > -0.92 ? 0.42 + oceanGate : 0.22;
    const waterAlpha = clamp01(0.24 + basin * 0.44);
    const depth = clamp01(0.3 + basin * 0.5);

    return {
      contract: "FALLBACK_WATER_DIAGNOSTIC_CARRIER",
      channel: "water",
      isLandChannel: false,
      isWaterChannel: true,
      isAirChannel: false,
      channelClass: "fallback-surface-seated-water",
      waterClass: "fallback-surface-seated-water",
      waterPresence: waterAlpha,
      waterAlpha,
      hydrosphereBinding: 0.84,
      surfaceSeat: 0.84,
      depthBinding: 0.76,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false,
      depth,
      rgb: mixColor(COLORS.waterBase, COLORS.waterBright, depth),
      color: mixColor(COLORS.waterBase, COLORS.waterBright, depth),
      alpha: waterAlpha,
      canvasFallbackOnly: true,
      canvasOwnsWaterTruth: false,
      visualDiagnosticOnly: true,
      visualPassClaimed: false
    };
  }

  function fallbackAir(p) {
    const limb = clamp01(1 - Math.abs(p.z));
    const airAlpha = clamp01(0.035 + limb * 0.12);

    return {
      contract: "FALLBACK_AIR_DIAGNOSTIC_CARRIER",
      channel: "air",
      isLandChannel: false,
      isWaterChannel: false,
      isAirChannel: true,
      channelClass: "fallback-rim-air",
      airClass: "fallback-rim-air",
      airPresence: airAlpha,
      airAlpha,
      atmosphereSeparation: airAlpha,
      humidity: 0.18,
      airPressure: 0.52,
      barometricPressure: 0.52,
      rimHaze: limb,
      limbAtmosphere: limb,
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
      visualDiagnosticOnly: true,
      visualPassClaimed: false
    };
  }

  function normalizeLand(raw, p) {
    const fallback = fallbackLand(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "landRgb"], fallback.rgb);
    const landAlpha = clamp01(safeNumber(source.landAlpha ?? source.landPresence ?? source.alpha, fallback.landAlpha));
    const bodyBinding = clamp01(Math.max(safeNumber(source.bodyBinding, 0), source.bodyBound === true ? 1 : 0, fallback.bodyBinding * 0.45));
    const surfaceAttachment = clamp01(Math.max(safeNumber(source.surfaceAttachment, 0), source.surfaceBound === true ? 1 : 0, fallback.surfaceAttachment * 0.45));

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: landAlpha,
      landAlpha,
      landPresence: landAlpha,
      bodyBinding,
      surfaceAttachment,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineWater: false,
      mayDefineAir: false
    };
  }

  function normalizeWater(raw, p) {
    const fallback = fallbackWater(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "waterRgb", "oceanRgb"], fallback.rgb);
    const waterAlpha = clamp01(safeNumber(source.waterAlpha ?? source.waterPresence ?? source.alpha, fallback.waterAlpha));
    const hydrosphereBinding = clamp01(Math.max(safeNumber(source.hydrosphereBinding, 0), source.bodyBound === true ? 1 : 0, fallback.hydrosphereBinding * 0.45));
    const surfaceSeat = clamp01(Math.max(safeNumber(source.surfaceSeat, 0), source.surfaceBound === true ? 1 : 0, fallback.surfaceSeat * 0.45));

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: waterAlpha,
      waterAlpha,
      waterPresence: waterAlpha,
      hydrosphereBinding,
      surfaceSeat,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineAir: false
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
      mayDefineWater: false
    };
  }

  function composeChannels(land, water, air, p) {
    const landWeight = clamp01(land.landAlpha * (0.72 + land.bodyBinding * 0.22 + land.surfaceAttachment * 0.14));
    const waterWeight = clamp01(water.waterAlpha * (0.68 + water.hydrosphereBinding * 0.2 + water.surfaceSeat * 0.14));
    const airWeight = clamp01(air.airAlpha * (0.18 + safeNumber(air.rimHaze, 0) * 0.1));
    let rgb = COLORS.shellMid.slice();

    if (waterWeight > 0.01) rgb = mixColor(rgb, water.rgb, clamp01(waterWeight * 0.92));
    if (landWeight > 0.01) rgb = mixColor(rgb, land.rgb, clamp01(landWeight * 0.96));
    if (airWeight > 0.01) rgb = mixColor(rgb, air.rgb, clamp01(airWeight * 0.52));

    const light = normalize3({ x: -0.32, y: 0.42, z: 0.84 });
    const illumination = clamp01(0.66 + dot3(p, light) * 0.31);
    const bodyLock = clamp01(
      land.bodyBinding * landWeight * 0.35 +
      water.hydrosphereBinding * waterWeight * 0.30 +
      0.35
    );
    const shade = clamp01(0.72 + illumination * 0.24 + bodyLock * 0.08);

    return {
      rgb: scaleColor(rgb, shade),
      alpha: clamp01(0.96 + airWeight * 0.04),
      landWeight,
      waterWeight,
      airWeight,
      bodyLock
    };
  }

  function multiplexSample(...args) {
    const p = parseInput(...args);
    const land = normalizeLand(callChannel(getLandChannel(), args, p), p);
    const water = normalizeWater(callChannel(getWaterChannel(), args, p), p);
    const air = normalizeAir(callChannel(getAirChannel(), args, p), p);
    const composed = composeChannels(land, water, air, p);
    const ll = vectorToLonLat(p);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",

      x: p.x,
      y: p.y,
      z: p.z,
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,

      rgb: composed.rgb,
      color: composed.rgb,
      alpha: composed.alpha,

      land,
      water,
      air,
      landWeight: composed.landWeight,
      waterWeight: composed.waterWeight,
      airWeight: composed.airWeight,
      bodyLock: composed.bodyLock,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),
      channelMultiplexReady: Boolean(getLandChannel() && getAirChannel()),
      channelMultiplexDegraded: !Boolean(getWaterChannel()),

      runtimeTablePlanConsumer: true,
      canvasDecidesProceduralPlan: false,
      canvasOwnsWaterTruth: false,
      connectorOwnsWaterTruth: false,
      waterFailureDoesNotBlockAtlas: true,

      compositeOrder: "planet-body-shell → fallback-or-child-water → child-or-fallback-land → air-channel → rim-lighting",

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

  function createWaterProofFromResult(result = {}) {
    const validationOk = Boolean(result.validationOk && result.actualContract === WATER_CONTRACT);

    return {
      connectorActive: true,
      connectorMode: "conduct-request-verify-only",
      connectorOwnsWaterTruth: false,
      canvasOwnsWaterTruth: false,
      waterChildExternalAuthority: WATER_PATH,
      waterChildExpectedContract: WATER_CONTRACT,
      waterChildRequestPrepared: Boolean(result.requested),
      waterChildScriptElementCreated: Boolean(result.scriptElementCreated),
      waterChildScriptElementAppended: Boolean(result.scriptElementAppended),
      waterChildDocumentHeadAvailable: Boolean(result.documentHeadAvailable),
      waterChildScriptMarker: "hearth-water-channel",
      waterChildScriptSrc: String(result.requestedSrc || ""),
      waterScriptRequested: Boolean(result.requested),
      waterScriptLoaded: Boolean(result.loaded),
      waterScriptError: String(result.error || ""),
      waterChildTimeoutCheck: Boolean(result.timeoutCheck),
      waterChildLoadFailureCoordinate: result.failureCoordinate || (validationOk ? "C11_CHILD_VALIDATED" : "C6_GLOBAL_ACTOR_MISSING"),
      waterChildScriptElementPresent: Boolean(result.scriptElementCreated || result.existing),
      waterChildScriptElementErrored: result.errorType === "error",
      waterChildScriptErrorType: String(result.errorType || ""),
      waterChildPathCandidateUsed: WATER_PATH,
      waterChildFallbackCandidateUsed: false,
      waterGlobalPresent: Boolean(result.globalPresent),
      waterActorName: result.globalPresent ? "HEARTH_WATER_CHANNEL" : "",
      waterActualContract: String(result.actualContract || ""),
      waterExpectedContract: WATER_CONTRACT,
      waterSampleProbeOk: false,
      waterSampleProbeContract: "",
      waterSampleProbeCoordinatesOk: false,
      waterSampleProbeFlagsOk: false,
      waterSampleProbeError: validationOk ? "" : "HEARTH_WATER_CHANNEL global missing.",
      waterSampleProbeValue: null,
      waterValidationOk: validationOk,
      waterContractOk: Boolean(result.contractOk),
      waterFailureDoesNotBlockAtlas: true,
      lastCheckedAt: nowIso()
    };
  }

  function probeWaterActor(existingProof) {
    const proof = {
      ...(existingProof || createWaterProofFromResult({}))
    };

    const water = getWaterChannel();

    proof.lastCheckedAt = nowIso();
    proof.waterGlobalPresent = Boolean(water);
    proof.waterActorName = water ? "HEARTH_WATER_CHANNEL" : "";
    proof.waterActualContract = water && water.contract ? String(water.contract) : proof.waterActualContract || "";
    proof.waterContractOk = proof.waterActualContract === WATER_CONTRACT;

    if (!water) {
      proof.waterSampleProbeError = "HEARTH_WATER_CHANNEL global missing.";
      proof.waterValidationOk = false;
      if (!proof.waterChildLoadFailureCoordinate || proof.waterChildLoadFailureCoordinate === "C11_CHILD_VALIDATED") {
        proof.waterChildLoadFailureCoordinate = "C6_GLOBAL_ACTOR_MISSING";
      }
      return proof;
    }

    const method = typeof water.sample === "function" ? "sample" : typeof water.read === "function" ? "read" : "";

    if (!method) {
      proof.waterSampleProbeError = "Water actor has no sample/read method.";
      proof.waterValidationOk = false;
      proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
      return proof;
    }

    try {
      const value = water[method](DEFAULT_SAMPLE_POINT);
      proof.waterSampleProbeValue = value || null;
      proof.waterSampleProbeOk = Boolean(value && typeof value === "object");
      proof.waterSampleProbeContract = String((value && value.contract) || water.contract || "");

      const coordsOk = Boolean(
        value &&
        ["u", "v", "lon", "lat", "x", "y", "z"].every((key) => Number.isFinite(Number(value[key])))
      );

      proof.waterSampleProbeCoordinatesOk = coordsOk;

      const flagsOk = Boolean(
        value &&
        value.channel === "water" &&
        value.isWaterChannel === true &&
        value.allowedToFloat === false &&
        value.floatsAboveBody === false
      );

      proof.waterSampleProbeFlagsOk = flagsOk;
      proof.waterValidationOk = proof.waterContractOk && proof.waterSampleProbeOk && coordsOk && flagsOk;

      if (!proof.waterContractOk) proof.waterChildLoadFailureCoordinate = "C7_CONTRACT_MISMATCH";
      else if (!proof.waterSampleProbeOk) proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
      else if (!coordsOk) proof.waterChildLoadFailureCoordinate = "C9_COORDINATE_PACKET_FAILURE";
      else if (!flagsOk) proof.waterChildLoadFailureCoordinate = "C10_AUTHORITY_FLAG_FAILURE";
      else proof.waterChildLoadFailureCoordinate = "C11_CHILD_VALIDATED";

      proof.waterSampleProbeError = proof.waterValidationOk ? "" : proof.waterSampleProbeError;
      return proof;
    } catch (error) {
      proof.waterValidationOk = false;
      proof.waterSampleProbeError = error && error.message ? error.message : String(error);
      proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
      return proof;
    }
  }

  function applyPairsToDataset(targetCanvas, pairs) {
    const rootDataset = root.document && root.document.documentElement ? root.document.documentElement.dataset : null;
    const canvasDataset = targetCanvas && targetCanvas.dataset ? targetCanvas.dataset : null;

    Object.keys(pairs || {}).forEach((key) => {
      const value = String(pairs[key]);
      if (rootDataset) rootDataset[key] = value;
      if (canvasDataset) canvasDataset[key] = value;
    });
  }

  function applyPlanToDataset(plan, targetCanvas) {
    if (!plan) return;

    applyPairsToDataset(targetCanvas, {
      hearthRuntimeTablePlanConsumed: "true",
      hearthRuntimeTablePlanContract: plan.planContract || "",
      hearthRuntimeTablePlanReceipt: plan.planReceipt || "",
      hearthRuntimeCoordinate: plan.runtimeCoordinate || "",
      visualCoordinate: plan.visualCoordinate || "",
      atlasStartCoordinate: plan.atlasStartCoordinate || "",
      firstFailedCoordinate: plan.firstFailedCoordinate || "",
      recommendedNextRenewalTarget: plan.recommendedNextRenewalTarget || "",

      visualCarrierAllowed: Boolean(plan.visualCarrierAllowed),
      visualizationBlocked: Boolean(plan.visualizationBlocked),
      visualizationBlockReason: plan.visualizationBlockReason || "",
      visualCarrierMode: plan.visualCarrierMode || "",
      visualDiagnosticStatus: plan.visualDiagnosticStatus || "",
      visualDiagnosticCue: plan.visualDiagnosticCue || "",

      atlasStartAuthorized: Boolean(plan.atlasStartAuthorized),
      atlasStartMode: plan.atlasStartMode || "",
      atlasStartAttempted: Boolean(plan.atlasStartAttempted),
      atlasStartActive: Boolean(plan.atlasStartActive),
      atlasBuilderEntered: Boolean(plan.atlasBuilderEntered),
      atlasProgressObserved: Boolean(plan.atlasProgressObserved),
      atlasProgressFirstValue: Number(plan.atlasProgressFirstValue || 0),
      atlasProgressLastValue: Number(plan.atlasProgressLastValue || 0),
      atlasStartBlockedReason: plan.atlasStartBlockedReason || "",

      waterFailureDoesNotBlockAtlas: "true",
      coherentExpressionPass: Boolean(plan.coherentExpressionPass),
      hearthTripleGCoherenceStatus: plan.coherenceStatus || "UNKNOWN",
      hearthTripleGCoherenceScore: Number(plan.coherenceScore || 0),
      hearthTripleGFailedCheckpoints: Array.isArray(plan.failedCheckpoints) ? plan.failedCheckpoints.join(",") : "",
      hearthTripleGWarningCheckpoints: Array.isArray(plan.warningCheckpoints) ? plan.warningCheckpoints.join(",") : "",
      hearthTripleGRenewalTargets: Array.isArray(plan.renewalTargets) ? plan.renewalTargets.join(",") : "",

      hearthWaterFallbackActive: Boolean(plan.waterConnectorProof && !plan.waterConnectorProof.waterValidationOk),
      hearthWaterFallbackReason: plan.waterConnectorProof ? plan.waterConnectorProof.waterChildLoadFailureCoordinate || "" : "",
      hearthWaterChildLoadFailureCoordinate: plan.waterConnectorProof ? plan.waterConnectorProof.waterChildLoadFailureCoordinate || "" : "",
      hearthWaterScriptLoaded: plan.waterConnectorProof ? Boolean(plan.waterConnectorProof.waterScriptLoaded) : false,
      hearthWaterGlobalPresent: plan.waterConnectorProof ? Boolean(plan.waterConnectorProof.waterGlobalPresent) : false,
      hearthWaterValidationOk: plan.waterConnectorProof ? Boolean(plan.waterConnectorProof.waterValidationOk) : false,

      constructionReadyIsNotCoherencePass: "true",
      imageRenderedIsNotCoherencePass: "true",
      coherentExpressionPassIsNotVisualPassClaim: "true",
      visualPassClaimed: "false"
    });
  }

  function applyChannelProofsToDataset(results, waterProof, targetCanvas) {
    const landResult = (results || []).find((item) => item.key === "land") || {};
    const waterResult = (results || []).find((item) => item.key === "water") || {};
    const airResult = (results || []).find((item) => item.key === "air") || {};

    applyPairsToDataset(targetCanvas, {
      hearthLandChannelLoaded: Boolean(landResult.validationOk || getLandChannel()),
      hearthWaterChannelLoaded: Boolean(waterProof && waterProof.waterValidationOk),
      hearthAirChannelLoaded: Boolean(airResult.validationOk || getAirChannel()),

      hearthWaterConnectorActive: "true",
      hearthWaterConnectorMode: "conduct-request-verify-only",
      hearthWaterConnectorOwnsWaterTruth: "false",
      hearthCanvasOwnsWaterTruth: "false",
      hearthWaterChildExternalAuthority: WATER_PATH,
      hearthWaterChildExpectedContract: WATER_CONTRACT,

      hearthWaterChildRequestPrepared: waterProof ? Boolean(waterProof.waterChildRequestPrepared) : false,
      hearthWaterChildScriptElementCreated: waterProof ? Boolean(waterProof.waterChildScriptElementCreated) : false,
      hearthWaterChildScriptElementAppended: waterProof ? Boolean(waterProof.waterChildScriptElementAppended) : false,
      hearthWaterChildDocumentHeadAvailable: waterProof ? Boolean(waterProof.waterChildDocumentHeadAvailable) : false,
      hearthWaterChildScriptMarker: "hearth-water-channel",
      hearthWaterChildScriptSrc: waterProof ? waterProof.waterChildScriptSrc || "" : "",
      hearthWaterScriptRequested: waterProof ? Boolean(waterProof.waterScriptRequested) : false,
      hearthWaterScriptLoaded: waterProof ? Boolean(waterProof.waterScriptLoaded) : false,
      hearthWaterScriptError: waterProof ? waterProof.waterScriptError || "" : "",
      hearthWaterChildTimeoutCheck: waterProof ? Boolean(waterProof.waterChildTimeoutCheck) : false,
      hearthWaterChildScriptElementPresent: waterProof ? Boolean(waterProof.waterChildScriptElementPresent) : false,
      hearthWaterChildScriptElementErrored: waterProof ? Boolean(waterProof.waterChildScriptElementErrored) : false,
      hearthWaterChildScriptErrorType: waterProof ? waterProof.waterChildScriptErrorType || "" : "",
      hearthWaterChildPathCandidateUsed: WATER_PATH,
      hearthWaterChildFallbackCandidateUsed: "false",
      hearthWaterActualContract: waterProof ? waterProof.waterActualContract || "" : "",
      hearthWaterExpectedContract: WATER_CONTRACT,
      hearthWaterSampleProbeOk: waterProof ? Boolean(waterProof.waterSampleProbeOk) : false,
      hearthWaterSampleProbeContract: waterProof ? waterProof.waterSampleProbeContract || "" : "",
      hearthWaterSampleProbeCoordinatesOk: waterProof ? Boolean(waterProof.waterSampleProbeCoordinatesOk) : false,
      hearthWaterSampleProbeFlagsOk: waterProof ? Boolean(waterProof.waterSampleProbeFlagsOk) : false,
      hearthWaterSampleProbeError: waterProof ? waterProof.waterSampleProbeError || "" : ""
    });

    if (targetCanvas && targetCanvas.dataset) {
      targetCanvas.dataset.hearthCanvasChannelMultiplexReady = String(Boolean(getLandChannel() && getAirChannel()));
      targetCanvas.dataset.hearthCanvasChannelMultiplexDegraded = String(!Boolean(getWaterChannel()));
      targetCanvas.dataset.landLayerStatus = getLandChannel() ? "ready" : "fallback";
      targetCanvas.dataset.waterLayerStatus = waterProof && waterProof.waterValidationOk ? "ready" : "degraded";
      targetCanvas.dataset.airLayerStatus = getAirChannel() ? "ready" : "fallback";
    }
  }

  function createDiagnosticExport(state, canvas) {
    const dataset = {};
    const rootDataset = {};

    if (canvas && canvas.dataset) {
      Object.keys(canvas.dataset).forEach((key) => {
        dataset[key] = canvas.dataset[key];
      });
    }

    if (root.document && root.document.documentElement && root.document.documentElement.dataset) {
      Object.keys(root.document.documentElement.dataset).forEach((key) => {
        rootDataset[key] = root.document.documentElement.dataset[key];
      });
    }

    const plan = state.plan || {};
    const waterProof = state.waterProof || {};

    return [
      "HEARTH_DIAGNOSTIC_RECEIPT_EXPORT",
      "",
      `timestamp=${nowIso()}`,
      `canvasContract=${CONTRACT}`,
      `canvasReceipt=${RECEIPT}`,
      `previousCanvasContract=${PREVIOUS_CONTRACT}`,
      `baselineCanvasContract=${BASELINE_CONTRACT}`,
      `labRuntimeTableContract=${state.runtimeTableContract || ""}`,
      `preferredLabRuntimeTableContract=${REQUIRED_RUNTIME_TABLE_CONTRACT}`,
      `runtimeHandoff=${state.runtimeHandoff || "PENDING"}`,
      `constructionReady=${String(Boolean(plan.constructionReady || state.runtimeAllowed))}`,
      `imageRendered=${String(Boolean(state.imageRendered))}`,
      `coherentExpressionPass=${String(Boolean(plan.coherentExpressionPass))}`,
      `coherenceStatus=${plan.coherenceStatus || "UNKNOWN"}`,
      `coherenceScore=${Number(plan.coherenceScore || 0)}`,
      `failedCheckpoints=${Array.isArray(plan.failedCheckpoints) ? plan.failedCheckpoints.join(",") : ""}`,
      `warningCheckpoints=${Array.isArray(plan.warningCheckpoints) ? plan.warningCheckpoints.join(",") : ""}`,
      `renewalTargets=${Array.isArray(plan.renewalTargets) ? plan.renewalTargets.join(",") : ""}`,
      `landChannelContract=${LAND_CONTRACT}`,
      `waterChannelContract=${WATER_CONTRACT}`,
      `airChannelContract=${AIR_CONTRACT}`,
      "",
      "RUNTIME_TABLE_PROCEDURAL_PLAN_PROOF",
      `planGenerated=${String(Boolean(plan.planGenerated))}`,
      `planValid=${String(Boolean(plan.planValid))}`,
      `runtimeCoordinate=${plan.runtimeCoordinate || ""}`,
      `visualCoordinate=${plan.visualCoordinate || ""}`,
      `atlasStartCoordinate=${plan.atlasStartCoordinate || ""}`,
      `firstFailedCoordinate=${plan.firstFailedCoordinate || ""}`,
      `recommendedNextRenewalTarget=${plan.recommendedNextRenewalTarget || ""}`,
      "",
      "VISUAL_DIAGNOSTIC_CARRIER_PROOF",
      `visualCarrierAllowed=${String(Boolean(plan.visualCarrierAllowed))}`,
      `visualizationBlocked=${String(Boolean(plan.visualizationBlocked))}`,
      `visualizationBlockReason=${plan.visualizationBlockReason || ""}`,
      `visualCarrierMode=${plan.visualCarrierMode || ""}`,
      `visualDiagnosticStatus=${plan.visualDiagnosticStatus || ""}`,
      `visualDiagnosticCue=${plan.visualDiagnosticCue || ""}`,
      `waterFailureDoesNotBlockAtlas=true`,
      "",
      "ATLAS_START_COORDINATE_PROOF",
      `atlasStartAuthorized=${String(Boolean(plan.atlasStartAuthorized))}`,
      `atlasStartAttempted=${String(Boolean(state.atlasStartAttempted))}`,
      `atlasStartActive=${String(Boolean(state.atlasBuilding))}`,
      `atlasBuilderEntered=${String(Boolean(state.atlasBuilderEntered))}`,
      `atlasStartTimestamp=${state.atlasStartTimestamp || ""}`,
      `atlasStartFailureCoordinate=${plan.atlasStartCoordinate || ""}`,
      `atlasStartBlockedReason=${plan.atlasStartBlockedReason || ""}`,
      `atlasProgressObserved=${String(Boolean(state.atlasProgressObserved))}`,
      `atlasProgressFirstValue=${Number(state.atlasProgressFirstValue || 0)}`,
      `atlasProgressLastValue=${Number(state.atlasProgress || 0)}`,
      "",
      "WATER_CONNECTOR_COORDINATE_PROOF",
      `connectorActive=${String(Boolean(waterProof.connectorActive))}`,
      `connectorMode=${waterProof.connectorMode || "conduct-request-verify-only"}`,
      `connectorOwnsWaterTruth=false`,
      `canvasOwnsWaterTruth=false`,
      `waterChildExternalAuthority=${WATER_PATH}`,
      `waterChildExpectedContract=${WATER_CONTRACT}`,
      `waterChildRequestPrepared=${String(Boolean(waterProof.waterChildRequestPrepared))}`,
      `waterChildScriptElementCreated=${String(Boolean(waterProof.waterChildScriptElementCreated))}`,
      `waterChildScriptElementAppended=${String(Boolean(waterProof.waterChildScriptElementAppended))}`,
      `waterChildDocumentHeadAvailable=${String(Boolean(waterProof.waterChildDocumentHeadAvailable))}`,
      `waterChildScriptMarker=hearth-water-channel`,
      `waterChildScriptSrc=${waterProof.waterChildScriptSrc || ""}`,
      `waterScriptRequested=${String(Boolean(waterProof.waterScriptRequested))}`,
      `waterScriptLoaded=${String(Boolean(waterProof.waterScriptLoaded))}`,
      `waterScriptError=${waterProof.waterScriptError || ""}`,
      `waterChildTimeoutCheck=${String(Boolean(waterProof.waterChildTimeoutCheck))}`,
      `waterChildLoadFailureCoordinate=${waterProof.waterChildLoadFailureCoordinate || ""}`,
      `waterChildScriptElementPresent=${String(Boolean(waterProof.waterChildScriptElementPresent))}`,
      `waterChildScriptElementErrored=${String(Boolean(waterProof.waterChildScriptElementErrored))}`,
      `waterChildScriptErrorType=${waterProof.waterChildScriptErrorType || ""}`,
      `waterGlobalPresent=${String(Boolean(waterProof.waterGlobalPresent))}`,
      `waterActualContract=${waterProof.waterActualContract || ""}`,
      `waterExpectedContract=${WATER_CONTRACT}`,
      `waterSampleProbeOk=${String(Boolean(waterProof.waterSampleProbeOk))}`,
      `waterSampleProbeCoordinatesOk=${String(Boolean(waterProof.waterSampleProbeCoordinatesOk))}`,
      `waterSampleProbeFlagsOk=${String(Boolean(waterProof.waterSampleProbeFlagsOk))}`,
      `waterSampleProbeError=${waterProof.waterSampleProbeError || ""}`,
      "",
      `visualPassClaimed=false`,
      "",
      "STRATEGIC_SUMMARY",
      JSON.stringify({
        constructionReady: plan.constructionReady || state.runtimeAllowed ? "pass" : "blocked",
        imageRendered: state.imageRendered ? "pass" : "pending",
        coherentExpression: plan.coherentExpressionPass ? "pass" : "FAIL",
        runtimePlan: plan.planValid ? "pass" : "blocked",
        atlasStart: plan.atlasStartAuthorized ? "authorized" : "blocked",
        visualCarrier: plan.visualDiagnosticStatus || "UNKNOWN",
        firstFailedCoordinate: plan.firstFailedCoordinate || "",
        recommendedNextRenewalTarget: plan.recommendedNextRenewalTarget || ""
      }, null, 2),
      "",
      "CHANNEL_LOAD_RESULTS",
      JSON.stringify(state.channelLoadResults || [], null, 2),
      "",
      "RUNTIME_TABLE_PLAN",
      JSON.stringify(plan, null, 2),
      "",
      "RUNTIME_TABLE_RECORDS",
      JSON.stringify(state.runtimeTableLedger && Array.isArray(state.runtimeTableLedger.records) ? state.runtimeTableLedger.records : [], null, 2),
      "",
      "TRIPLE_G_CHECKPOINT_RECEIPTS",
      JSON.stringify(Array.isArray(plan.tripleGCheckpoints) ? plan.tripleGCheckpoints : [], null, 2),
      "",
      "RENDER_METADATA",
      JSON.stringify({
        atlasReady: Boolean(state.atlasReady),
        atlasBuilding: Boolean(state.atlasBuilding),
        atlasProgress: Number(state.atlasProgress || 0),
        projectionReady: Boolean(state.projectionReady),
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        imageRendered: Boolean(state.imageRendered),
        visualCarrierAllowed: Boolean(plan.visualCarrierAllowed),
        visualizationBlocked: Boolean(plan.visualizationBlocked),
        atlasStartAuthorized: Boolean(plan.atlasStartAuthorized),
        waterFailureDoesNotBlockAtlas: true,
        visualPassClaimed: false
      }, null, 2),
      "",
      "CANVAS_DATASET",
      JSON.stringify(dataset, null, 2),
      "",
      "DOCUMENT_ROOT_DATASET",
      JSON.stringify(rootDataset, null, 2)
    ].join("\n");
  }

  function loadScriptDetailed(item, options = {}) {
    return new Promise((resolve) => {
      const result = {
        key: item.key,
        label: item.label,
        path: item.path,
        scriptPath: item.path,
        scriptCacheKey: item.cacheKey || options.cacheKey || VERSION,
        requestedSrc: "",
        expectedContract: item.contract,
        actualContract: "",
        requested: false,
        loaded: false,
        alreadyPresent: false,
        existing: false,
        timeoutCheck: false,
        error: "",
        errorType: "",
        globalName: item.globalName,
        globalPresent: false,
        contractOk: false,
        validationOk: false,
        scriptElementCreated: false,
        scriptElementAppended: false,
        documentHeadAvailable: false,
        failureCoordinate: "C0_CHILD_CONNECTOR_NOT_STARTED",
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
        result.failureCoordinate = "C3_SCRIPT_APPENDED";
        resolve(result);
        return;
      }

      result.documentHeadAvailable = true;

      const existingScripts = Array.from(root.document.querySelectorAll(`script[data-hearth-loader-marker="${item.marker}"]`));
      existingScripts.forEach((script) => {
        if (!result.validationOk && script.parentNode) {
          try {
            script.parentNode.removeChild(script);
          } catch (_error) {}
        }
      });

      const script = root.document.createElement("script");
      const joiner = item.path.includes("?") ? "&" : "?";
      const src = `${item.path}${joiner}v=${encodeURIComponent(result.scriptCacheKey)}`;

      result.scriptElementCreated = true;
      result.requested = true;
      result.requestedSrc = src;
      result.failureCoordinate = "C1_CHILD_REQUEST_PREPARED";

      script.src = src;
      script.defer = true;
      script.dataset.hearthLoaderMarker = item.marker;
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthCanvasReceipt = RECEIPT;
      script.dataset.hearthScriptExpectedContract = item.contract || "";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const settle = (kind, errorText) => {
        if (settled) return;
        settled = true;

        result.timeoutCheck = kind === "timeout";
        result.error = errorText || "";
        result.errorType = kind === "load" ? "" : kind;

        validate();

        if (kind === "load") {
          result.loaded = result.validationOk;
          result.failureCoordinate = result.validationOk
            ? "C11_CHILD_VALIDATED"
            : result.globalPresent
              ? "C7_CONTRACT_MISMATCH"
              : "C6_GLOBAL_ACTOR_MISSING";
        } else if (kind === "error") {
          result.loaded = false;
          result.failureCoordinate = "C4_SCRIPT_NETWORK_LOAD_FAILURE";
        } else {
          result.loaded = false;
          result.failureCoordinate = "C5_SCRIPT_LOAD_TIMEOUT";
        }

        resolve(result);
      };

      script.onload = () => settle("load", "");
      script.onerror = () => settle("error", "load-error");

      try {
        root.document.head.appendChild(script);
        result.scriptElementAppended = true;
        result.failureCoordinate = "C3_SCRIPT_APPENDED";
      } catch (error) {
        result.error = error && error.message ? error.message : String(error);
        result.errorType = "append-error";
        result.failureCoordinate = "C3_SCRIPT_APPENDED";
        resolve(result);
        return;
      }

      setTimeout(() => {
        if (!settled) settle("timeout", "script-load-timeout");
      }, options.timeoutMs || 6000);
    });
  }

  function ensureRuntimeTable(options = {}) {
    return loadScriptDetailed(
      {
        key: "runtime-table",
        label: "Lab Runtime Table",
        path: LAB_RUNTIME_TABLE_PATH,
        contract: REQUIRED_RUNTIME_TABLE_CONTRACT,
        globalName: "LAB_RUNTIME_TABLE",
        cacheKey: options.runtimeTableCacheKey || RUNTIME_TABLE_CACHE_KEY,
        marker: "lab-runtime-table"
      },
      { timeoutMs: options.timeoutMs || 6000 }
    ).then((result) => {
      const api = getRuntimePlanAuthority();
      const contract = api && api.contract ? String(api.contract) : "";
      const planReady = Boolean(
        api &&
        contract === REQUIRED_RUNTIME_TABLE_CONTRACT &&
        typeof api.createHearthVisualCarrierPlan === "function"
      );

      return {
        ...result,
        loaded: planReady,
        validationOk: planReady,
        api,
        actualContract: contract,
        contractOk: planReady,
        planReady
      };
    });
  }

  function ensureChannelScripts(options = {}) {
    return Promise.all(
      CHANNEL_FILES.map((item) => loadScriptDetailed(item, { timeoutMs: options.timeoutMs || 6000 }))
    ).then((results) => {
      const waterResult = results.find((item) => item.key === "water") || {};
      const waterProof = probeWaterActor(createWaterProofFromResult(waterResult));
      return {
        results,
        waterProof
      };
    });
  }

  function createRuntimeLedger(planApi, options = {}) {
    if (!planApi || typeof planApi.createHearthChannelTable !== "function") return null;

    try {
      const table = planApi.createHearthChannelTable({
        id: "hearth-canvas-runtime-table-directed-visible-carrier",
        budget: {
          atlasWidth: options.atlasWidth || 384,
          atlasHeight: options.atlasHeight || 192,
          rowsPerChunk: options.rowsPerChunk || 2,
          sampleRate: 1
        }
      });

      if (table && typeof table.run === "function") {
        return table.run(DEFAULT_SAMPLE_POINT);
      }
    } catch (_error) {}

    return null;
  }

  function createPlan(planApi, state, options = {}) {
    if (!planApi || typeof planApi.createHearthVisualCarrierPlan !== "function") {
      return {
        contract: CONTRACT,
        planGenerated: false,
        planValid: false,
        runtimeCoordinate: "R0_RUNTIME_TABLE_NOT_LOADED",
        visualCoordinate: "V2_DIAGNOSTIC_CARRIER_VISIBLE",
        atlasStartCoordinate: "A0_ATLAS_SEQUENCE_NOT_STARTED",
        firstFailedCoordinate: "R0_RUNTIME_TABLE_NOT_LOADED",
        recommendedNextRenewalTarget: "runtime-table-plan-authority-load",
        visualCarrierAllowed: true,
        visualizationBlocked: false,
        visualizationBlockReason: "",
        visualCarrierMode: "fallback-diagnostic",
        visualDiagnosticStatus: "DEGRADED",
        visualDiagnosticCue: "RUNTIME_TABLE_PLAN_AUTHORITY_MISSING",
        atlasStartAuthorized: false,
        atlasStartBlockedReason: "runtime-table-plan-authority-missing",
        waterFailureDoesNotBlockAtlas: true,
        coherentExpressionPass: false,
        coherenceStatus: "UNKNOWN",
        coherenceScore: 0,
        failedCheckpoints: [],
        warningCheckpoints: [],
        renewalTargets: ["runtime-table-plan-authority-load"],
        nextStrategy: ["Load Runtime Table v3 before atlas plan consumption."],
        waterConnectorProof: state.waterProof || {},
        channelPlan: {},
        runtimeTableLedger: state.runtimeTableLedger || null,
        tripleGCheckpoints: [],
        visualPassClaimed: false
      };
    }

    const canvasSample = sample(DEFAULT_SAMPLE_POINT);
    const plan = planApi.createHearthVisualCarrierPlan(
      {
        runtimeTableLedger: state.runtimeTableLedger,
        channelLoadResults: state.channelLoadResults,
        waterConnectorProof: state.waterProof,
        routeMounted: true,
        canvasMounted: true,
        fallbackShellAvailable: true,
        atlasStartAttempted: state.atlasStartAttempted,
        atlasBuilderEntered: state.atlasBuilderEntered,
        atlasProgressObserved: state.atlasProgressObserved,
        atlasProgressFirstValue: state.atlasProgressFirstValue,
        atlasProgressLastValue: state.atlasProgress,
        externalStatusCallbackSafe: state.externalStatusCallbackSafe,
        externalStatusCallbackErrors: state.externalStatusCallbackErrors,
        imageRendered: state.imageRendered,
        renderMetadata: {
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true,
          sphereContainment: true,
          outsideSphereTransparent: true,
          noRectangularTextureSpill: true,
          imageRendered: state.imageRendered,
          atlasReady: state.atlasReady,
          atlasBuilding: state.atlasBuilding,
          atlasProgress: state.atlasProgress,
          projectionReady: state.projectionReady,
          atlasStartAttempted: state.atlasStartAttempted,
          atlasBuilderEntered: state.atlasBuilderEntered,
          atlasProgressObserved: state.atlasProgressObserved,
          atlasProgressFirstValue: state.atlasProgressFirstValue,
          atlasProgressLastValue: state.atlasProgress
        },
        canvasReceipt: {
          contract: CONTRACT,
          receipt: RECEIPT,
          previousContract: PREVIOUS_CONTRACT,
          baselineContract: BASELINE_CONTRACT,
          sphereContainment: true,
          outsideSphereTransparent: true,
          noRectangularTextureSpill: true,
          projectionReady: state.projectionReady || state.imageRendered,
          visualPassClaimed: false
        },
        canvasSample,
        landSample: canvasSample.land || {},
        waterSample: state.waterProof && state.waterProof.waterValidationOk ? canvasSample.water || {} : {},
        airSample: canvasSample.air || {}
      },
      {
        runHearthTable: false,
        profile: "hearth-channel-expression",
        ...options.planOptions
      }
    );

    return plan;
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

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth canvas requires document.createElement.");
    }

    const requestedSize = Number.isFinite(Number(options.size))
      ? Math.round(Number(options.size))
      : Number.isFinite(Number(options.width))
        ? Math.round(Number(options.width))
        : 420;

    const size = clamp(requestedSize, 240, options.allowLargeTexture === true ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-runtime-table-directed-visible-carrier";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;

    canvas.dataset.hearthCanvasShellFirst = "true";
    canvas.dataset.hearthCanvasVisibleCarrier = "true";
    canvas.dataset.hearthCanvasRuntimeTableDirected = "true";
    canvas.dataset.hearthCanvasPlanConsumer = "true";
    canvas.dataset.hearthCanvasOwnsProceduralPlan = "false";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.hearthCanvasDecidesNothing = "true";
    canvas.dataset.hearthCanvasOwnsWaterTruth = "false";
    canvas.dataset.hearthWaterConnectorOwnsWaterTruth = "false";

    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthRuntimeTableContract = REQUIRED_RUNTIME_TABLE_CONTRACT;
    canvas.dataset.hearthRuntimeTablePreviousContract = PREVIOUS_RUNTIME_TABLE_CONTRACT;
    canvas.dataset.hearthRuntimeTableLoaded = "false";
    canvas.dataset.hearthRuntimeTablePlanConsumed = "false";
    canvas.dataset.hearthRuntimeTableRuntimeAllowed = "false";
    canvas.dataset.hearthRuntimeTableHandoff = "PENDING";

    canvas.dataset.hearthCanvasChannelMultiplexReady = "false";
    canvas.dataset.hearthCanvasChannelMultiplexDegraded = "true";
    canvas.dataset.hearthCanvasInteractiveShellMounted = "true";
    canvas.dataset.hearthCanvasInteractiveProjection = "true";
    canvas.dataset.hearthCanvasControlsBound = "false";
    canvas.dataset.hearthCanvasAtlasReady = "false";
    canvas.dataset.hearthCanvasAtlasBuilding = "false";
    canvas.dataset.hearthCanvasAtlasProgress = "0";
    canvas.dataset.hearthCanvasSphereContainment = "true";
    canvas.dataset.hearthCanvasNoRectangularTextureSpill = "true";
    canvas.dataset.hearthCanvasOutsideSphereTransparent = "true";

    canvas.dataset.visualCarrierAllowed = "true";
    canvas.dataset.visualizationBlocked = "false";
    canvas.dataset.visualCarrierMode = "fallback-diagnostic";
    canvas.dataset.visualDiagnosticStatus = "PENDING";
    canvas.dataset.visualDiagnosticCue = "SHELL_FIRST_VISIBLE_CARRIER";

    canvas.dataset.atlasStartAuthorized = "false";
    canvas.dataset.atlasStartAttempted = "false";
    canvas.dataset.atlasStartActive = "false";
    canvas.dataset.atlasBuilderEntered = "false";
    canvas.dataset.atlasProgressObserved = "false";
    canvas.dataset.atlasProgressFirstValue = "0";
    canvas.dataset.atlasProgressLastValue = "0";
    canvas.dataset.waterFailureDoesNotBlockAtlas = "true";

    canvas.dataset.hearthReceiptMode = "compact";
    canvas.dataset.hearthReceiptVisible = "true";
    canvas.dataset.hearthReceiptExpanded = "false";
    canvas.dataset.hearthDiagnosticExportAvailable = "true";
    canvas.dataset.hearthDiagnosticExportCopied = "false";
    canvas.dataset.hearthDiagnosticExportLength = "0";
    canvas.dataset.hearthDiagnosticExportError = "";

    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.routeMutation = "false";
    canvas.dataset.runtimeMutation = "false";
    canvas.dataset.controlsMutation = "false";
    canvas.dataset.coherentExpressionPass = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function drawFallbackShell(canvas, state = {}) {
    if (!canvas || typeof canvas.getContext !== "function") return null;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size * 0.47;
    const pulse = Math.sin((safeNumber(state.frames, 0)) * 0.06) * 0.5 + 0.5;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.34, r * 0.05, cx, cy, r);
    shell.addColorStop(0, "rgba(92, 126, 136, 0.98)");
    shell.addColorStop(0.34, "rgba(28, 54, 76, 0.98)");
    shell.addColorStop(0.68, "rgba(8, 18, 38, 1)");
    shell.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const waterBand = ctx.createRadialGradient(cx + r * 0.18, cy + r * 0.08, r * 0.12, cx, cy, r * 0.92);
    waterBand.addColorStop(0, "rgba(18, 74, 140, 0.28)");
    waterBand.addColorStop(0.46, "rgba(9, 35, 80, 0.18)");
    waterBand.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = waterBand;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createRadialGradient(cx - r * 0.26, cy - r * 0.34, r * 0.1, cx + r * 0.2, cy + r * 0.16, r * 1.08);
    shade.addColorStop(0, "rgba(255,255,255,0.10)");
    shade.addColorStop(0.44, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.24)");
    shade.addColorStop(1, "rgba(0,0,0,0.56)");

    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = `rgba(174,216,236, ${0.24 + pulse * 0.10})`;
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TWO_PI);
    ctx.strokeStyle = `rgba(174,216,236, ${0.12 + pulse * 0.06})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasNeutralLoadingShell = "true";
    canvas.dataset.hearthCanvasImageRendered = "true";
    canvas.dataset.hearthCanvasFrames = String(safeNumber(canvas.dataset.hearthCanvasFrames, 0) + 1);

    return canvas;
  }

  function sampleAtlasNearest(atlas, u, v) {
    const x = clamp(Math.round(wrap01(u) * (atlas.width - 1)), 0, atlas.width - 1);
    const y = clamp(Math.round(clamp(v, 0, 1) * (atlas.height - 1)), 0, atlas.height - 1);
    const i = (y * atlas.width + x) * 4;

    return [atlas.data[i], atlas.data[i + 1], atlas.data[i + 2], atlas.data[i + 3]];
  }

  function renderSphereFromAtlas(targetCanvas, atlas, state = {}, options = {}) {
    if (!targetCanvas || !atlas || !atlas.data) return targetCanvas;

    const ctx = targetCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const image = ctx.createImageData(width, height);
    const data = image.data;
    const rotationLon = safeNumber(state.rotationLon, 0);
    const rotationLat = safeNumber(state.rotationLat, 0);
    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const useSoftLighting = options.softProjectionLighting !== false;

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
        const color = sampleAtlasNearest(atlas, lonToU(ll.lon), latToV(ll.lat));

        let r = color[0];
        let g = color[1];
        let b = color[2];

        if (useSoftLighting) {
          const illumination = clamp01(0.64 + dot3(sphere.vector, light) * 0.30);
          const edgeShade = clamp01(1 - sphere.radial * 0.13);
          const shade = clamp01(illumination * edgeShade);
          r = clamp(Math.round(r * shade), 0, 255);
          g = clamp(Math.round(g * shade), 0, 255);
          b = clamp(Math.round(b * shade), 0, 255);

          const limbAtmosphere = clamp01(sphere.radial * 0.07);
          const mixed = mixColor([r, g, b], [20, 32, 48], limbAtmosphere);
          r = mixed[0];
          g = mixed[1];
          b = mixed[2];
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(clamp01(color[3] / 255) * 255 * sphere.edgeAlpha);
      }
    }

    ctx.putImageData(image, 0, 0);

    targetCanvas.dataset.hearthCanvasRenderedFromCachedAtlas = "true";
    targetCanvas.dataset.hearthCanvasInteractiveProjection = "true";
    targetCanvas.dataset.hearthCanvasAtlasReady = "true";
    targetCanvas.dataset.hearthCanvasImageRendered = "true";
    targetCanvas.dataset.hearthCanvasFrames = String(safeNumber(targetCanvas.dataset.hearthCanvasFrames, 0) + 1);

    return targetCanvas;
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth async atlas creation requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(
      Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384,
      32,
      options.allowLargeTexture === true ? 1024 : 512
    );

    const height = clamp(
      Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192,
      16,
      options.allowLargeTexture === true ? 512 : 256
    );

    const rowsPerChunk = clamp(
      Number.isFinite(Number(options.rowsPerChunk)) ? Math.round(Number(options.rowsPerChunk)) : 2,
      1,
      8
    );

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasRuntimeTableDirected = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
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
          const v = height <= 1 ? 0 : y / (height - 1);

          for (let x = 0; x < width; x += 1) {
            const u = width <= 1 ? 0 : x / (width - 1);
            const px = multiplexSample({ u, v });
            const i = (y * width + x) * 4;

            data[i] = px.rgb[0];
            data[i + 1] = px.rgb[1];
            data[i + 2] = px.rgb[2];
            data[i + 3] = Math.round(clamp01(px.alpha) * 255);
          }
        }

        const progress = clamp01(y / height);

        if (typeof handlers.onProgress === "function") {
          handlers.onProgress(progress, { y, width, height, rowsPerChunk });
        }

        if (y >= height) {
          ctx.putImageData(image, 0, 0);

          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);

          if (typeof handlers.onComplete === "function") {
            handlers.onComplete({
              canvas,
              width,
              height,
              data: atlasImage.data
            });
          }

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

  function createLoadingPanel() {
    const panel = root.document.createElement("aside");

    panel.dataset.hearthRuntimeLoadingPanel = "true";
    panel.dataset.hearthFormationPanel = "true";
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
    panel.style.color = "rgba(238,246,255,.90)";
    panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.fontSize = "11px";
    panel.style.lineHeight = "1.35";
    panel.style.pointerEvents = "auto";
    panel.style.zIndex = "4";

    return panel;
  }

  function statusBadge(value) {
    const raw = String(value || "pending").toLowerCase();

    if (raw.includes("reject") || raw.includes("block") || raw.includes("fail") || raw.includes("error")) return "✕";
    if (raw.includes("ready") || raw.includes("complete") || raw.includes("pass") || raw.includes("authorized") || raw.includes("loaded")) return "✓";
    if (raw.includes("fallback") || raw.includes("degraded") || raw.includes("pending")) return "◐";
    if (raw.includes("loading") || raw.includes("building") || raw.includes("validating")) return "•";
    return "○";
  }

  function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0%";
    return `${Math.round(clamp01(n) * 100)}%`;
  }

  function renderLoadingPanel(panel, api) {
    if (!panel || !api || !api.state) return;

    const state = api.state;
    const plan = state.plan || {};
    const waterProof = state.waterProof || {};
    const expanded = state.receiptExpanded;
    const visible = state.receiptVisible;
    const exportText = createDiagnosticExport(state, api.canvas);

    state.diagnosticExport = exportText;

    if (api.canvas && api.canvas.dataset) {
      api.canvas.dataset.hearthDiagnosticExportAvailable = "true";
      api.canvas.dataset.hearthDiagnosticExportLength = String(exportText.length);
      api.canvas.dataset.hearthReceiptMode = expanded ? "expanded" : "compact";
      api.canvas.dataset.hearthReceiptVisible = String(Boolean(visible));
      api.canvas.dataset.hearthReceiptExpanded = String(Boolean(expanded));
    }

    const rows = [
      ["Visible carrier", plan.visualCarrierAllowed ? plan.visualCarrierMode || "ready" : "blocked"],
      ["Runtime Table plan", plan.planValid ? "ready" : "pending"],
      ["Runtime coordinate", plan.runtimeCoordinate || "pending"],
      ["Visual coordinate", plan.visualCoordinate || "pending"],
      ["Water connector", waterProof.waterChildLoadFailureCoordinate || "pending"],
      ["Atlas authorization", plan.atlasStartAuthorized ? "authorized" : plan.atlasStartBlockedReason || "pending"],
      ["Atlas progress", state.atlasReady ? "complete" : state.atlasBuilding ? "building" : "pending"],
      ["First failed coordinate", plan.firstFailedCoordinate || "pending"],
      ["Next target", plan.recommendedNextRenewalTarget || "pending"]
    ];

    const rowsHtml = rows.map(([label, value]) => {
      const text = String(value || "pending");

      return [
        "<div style=\"display:grid;grid-template-columns:22px 1fr auto;gap:7px;align-items:center;padding:2px 0;\">",
        `<span style="opacity:.78;">${statusBadge(text)}</span>`,
        `<span style="opacity:.86;">${escapeHtml(label)}</span>`,
        `<span style="opacity:.72;text-transform:uppercase;letter-spacing:.08em;font-size:9px;text-align:right;">${escapeHtml(text)}</span>`,
        "</div>"
      ].join("");
    }).join("");

    const expandedHtml = expanded
      ? [
          "<pre style=\"margin:10px 0 0;padding:10px;max-height:220px;overflow:auto;border-radius:10px;background:rgba(0,0,0,.36);white-space:pre-wrap;font-size:10px;line-height:1.35;\">",
          escapeHtml(exportText),
          "</pre>"
        ].join("")
      : "";

    panel.style.display = visible ? "block" : "none";

    panel.innerHTML = [
      "<div style=\"display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;\">",
      "<strong style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;\">Hearth Runtime Plan</strong>",
      `<span style="font-size:10px;opacity:.70;">${escapeHtml(formatPercent(state.atlasProgress || 0))}</span>`,
      "</div>",
      "<div style=\"height:4px;border-radius:999px;background:rgba(174,216,236,.12);overflow:hidden;margin-bottom:9px;\">",
      `<div style="height:100%;width:${escapeHtml(formatPercent(state.atlasProgress || 0))};background:rgba(174,216,236,.72);border-radius:999px;"></div>`,
      "</div>",
      "<div style=\"display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px;\">",
      "<button type=\"button\" data-hearth-receipt-toggle style=\"border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;\">Receipt visible</button>",
      `<button type="button" data-hearth-receipt-expand style="border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;">${expanded ? "Compact receipt" : "Expand receipt"}</button>`,
      "<button type=\"button\" data-hearth-receipt-copy style=\"border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;\">Copy diagnostic</button>",
      "</div>",
      rowsHtml,
      expandedHtml
    ].join("");

    const toggle = panel.querySelector("[data-hearth-receipt-toggle]");
    const expand = panel.querySelector("[data-hearth-receipt-expand]");
    const copy = panel.querySelector("[data-hearth-receipt-copy]");

    if (toggle) {
      toggle.onclick = () => {
        state.receiptVisible = !state.receiptVisible;
        renderLoadingPanel(panel, api);
      };
    }

    if (expand) {
      expand.onclick = () => {
        state.receiptExpanded = !state.receiptExpanded;
        renderLoadingPanel(panel, api);
      };
    }

    if (copy) {
      copy.onclick = () => {
        const text = createDiagnosticExport(state, api.canvas);

        const setCopied = (ok, error) => {
          if (api.canvas) {
            api.canvas.dataset.hearthDiagnosticExportCopied = String(Boolean(ok));
            api.canvas.dataset.hearthDiagnosticExportError = error || "";
            api.canvas.dataset.hearthDiagnosticExportLength = String(text.length);
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

  function updateStatus(api, patch = {}) {
    if (!api || !api.state) return;

    const state = api.state;

    if (patch.runtimeTableContract !== undefined) state.runtimeTableContract = patch.runtimeTableContract;
    if (patch.runtimeTableLedger !== undefined) state.runtimeTableLedger = patch.runtimeTableLedger;
    if (patch.runtimeAllowed !== undefined) state.runtimeAllowed = Boolean(patch.runtimeAllowed);
    if (patch.runtimeHandoff !== undefined) state.runtimeHandoff = patch.runtimeHandoff;
    if (patch.channelLoadResults !== undefined) state.channelLoadResults = patch.channelLoadResults;
    if (patch.waterProof !== undefined) state.waterProof = patch.waterProof;
    if (patch.plan !== undefined) state.plan = patch.plan;
    if (patch.atlasProgress !== undefined) state.atlasProgress = clamp01(patch.atlasProgress);
    if (patch.atlasReady !== undefined) state.atlasReady = Boolean(patch.atlasReady);
    if (patch.atlasBuilding !== undefined) state.atlasBuilding = Boolean(patch.atlasBuilding);
    if (patch.projectionReady !== undefined) state.projectionReady = Boolean(patch.projectionReady);
    if (patch.imageRendered !== undefined) state.imageRendered = Boolean(patch.imageRendered);

    if (api.canvas) {
      api.canvas.dataset.hearthRuntimeTableContract = state.runtimeTableContract || "";
      api.canvas.dataset.hearthRuntimeTableRuntimeAllowed = String(Boolean(state.runtimeAllowed));
      api.canvas.dataset.hearthRuntimeTableHandoff = state.runtimeHandoff || "PENDING";
      api.canvas.dataset.hearthRuntimeTableLedgerReady = String(Boolean(state.runtimeTableLedger));
      api.canvas.dataset.hearthCanvasAtlasProgress = String(state.atlasProgress || 0);
      api.canvas.dataset.hearthCanvasAtlasReady = String(Boolean(state.atlasReady));
      api.canvas.dataset.hearthCanvasAtlasBuilding = String(Boolean(state.atlasBuilding));
      api.canvas.dataset.hearthCanvasImageRendered = String(Boolean(state.imageRendered));
    }

    if (state.waterProof) applyChannelProofsToDataset(state.channelLoadResults, state.waterProof, api.canvas);
    if (state.plan) applyPlanToDataset(state.plan, api.canvas);

    renderLoadingPanel(api.loadingPanel, api);
  }

  function safeEmit(options, event, detail) {
    if (!options || typeof options.onStatus !== "function") return true;

    try {
      options.onStatus(event, detail);
      return true;
    } catch (error) {
      return error && error.message ? error.message : String(error);
    }
  }

  function bindPointerDrag(canvas, api) {
    const state = api.state;

    const handlePointerDown = (event) => {
      if (state.destroyed) return;

      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      canvas.style.cursor = "grabbing";
      canvas.dataset.hearthCanvasDragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_error) {}
      }

      if (event.cancelable) event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (state.destroyed || !state.dragging) return;
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      state.rotationLon -= dx * 0.010;
      state.rotationLat += dy * 0.008;
      state.rotationLat = clamp(state.rotationLat, -Math.PI * 0.42, Math.PI * 0.42);

      canvas.dataset.hearthCanvasRotationLon = String(state.rotationLon);
      canvas.dataset.hearthCanvasRotationLat = String(state.rotationLat);

      api.requestRedraw();

      if (event.cancelable) event.preventDefault();
    };

    const endDrag = (event) => {
      if (state.destroyed) return;
      if (state.pointerId !== null && event && event.pointerId !== state.pointerId) return;

      state.dragging = false;
      canvas.style.cursor = "grab";
      canvas.dataset.hearthCanvasDragging = "false";

      if (event && canvas.releasePointerCapture && event.pointerId !== undefined) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_error) {}
      }

      state.pointerId = null;
      if (event && event.cancelable) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    canvas.addEventListener("pointerup", endDrag, { passive: false });
    canvas.addEventListener("pointercancel", endDrag, { passive: false });
    canvas.addEventListener("lostpointercapture", endDrag, { passive: false });

    canvas.dataset.hearthCanvasControlsBound = "true";
    state.controlsBound = true;

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.dataset.hearthCanvasControlsBound = "false";
      state.controlsBound = false;
    };
  }

  function startAtlas(api, options = {}) {
    const state = api.state;

    if (state.destroyed || state.atlasBuilding || state.atlasReady) return;

    state.atlasStartAttempted = true;
    state.atlasBuilderEntered = true;
    state.atlasStartTimestamp = nowIso();
    state.atlasBuilding = true;
    state.atlasReady = false;

    if (api.canvas) {
      api.canvas.dataset.atlasStartAttempted = "true";
      api.canvas.dataset.atlasStartActive = "true";
      api.canvas.dataset.atlasBuilderEntered = "true";
      api.canvas.dataset.atlasStartTimestamp = state.atlasStartTimestamp;
      api.canvas.dataset.hearthCanvasAtlasBuilding = "true";
      api.canvas.dataset.hearthCanvasAtlasReady = "false";
    }

    updateStatus(api, { atlasBuilding: true, atlasReady: false });

    const emitResult = safeEmit(options, "runtime-table-directed-atlas-start", {
      contract: CONTRACT,
      receipt: RECEIPT,
      plan: clonePlain(state.plan),
      visualPassClaimed: false
    });

    if (emitResult !== true) {
      state.externalStatusCallbackSafe = false;
      state.externalStatusCallbackErrors.push(emitResult);
    }

    state.atlasController = buildAtlasAsync(
      {
        width: options.atlasWidth || 384,
        height: options.atlasHeight || 192,
        rowsPerChunk: options.rowsPerChunk || 2,
        allowLargeTexture: options.allowLargeTexture === true
      },
      {
        onProgress(progress) {
          if (state.destroyed) return;

          if (!state.atlasProgressObserved && progress > 0) {
            state.atlasProgressObserved = true;
            state.atlasProgressFirstValue = progress;
          }

          state.atlasProgress = progress;

          if (api.canvas) {
            api.canvas.dataset.atlasProgressObserved = String(Boolean(state.atlasProgressObserved));
            api.canvas.dataset.atlasProgressFirstValue = String(state.atlasProgressFirstValue || 0);
            api.canvas.dataset.atlasProgressLastValue = String(progress);
            api.canvas.dataset.hearthCanvasAtlasProgress = String(progress);
          }

          updateStatus(api, { atlasProgress: progress });
        },
        onComplete(atlas) {
          if (state.destroyed) return;

          state.atlas = atlas;
          state.atlasReady = true;
          state.atlasBuilding = false;
          state.atlasProgress = 1;
          state.projectionReady = true;
          state.imageRendered = true;

          if (api.canvas) {
            api.canvas.dataset.hearthCanvasAtlasReady = "true";
            api.canvas.dataset.hearthCanvasAtlasBuilding = "false";
            api.canvas.dataset.hearthCanvasAtlasProgress = "1";
            api.canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
            api.canvas.dataset.hearthCanvasImageRendered = "true";
            api.canvas.dataset.atlasStartActive = "false";
            api.canvas.dataset.atlasProgressObserved = "true";
            api.canvas.dataset.atlasProgressLastValue = "1";
          }

          api.requestRedraw();

          const planApi = getRuntimePlanAuthority();
          state.plan = createPlan(planApi, state, options);
          updateStatus(api, {
            plan: state.plan,
            atlasReady: true,
            atlasBuilding: false,
            atlasProgress: 1,
            projectionReady: true,
            imageRendered: true
          });

          safeEmit(options, "runtime-table-directed-atlas-complete", {
            contract: CONTRACT,
            receipt: RECEIPT,
            plan: clonePlain(state.plan),
            atlasReady: true,
            visualPassClaimed: false
          });
        },
        onError(error) {
          if (state.destroyed) return;

          state.atlasBuilding = false;
          state.atlasReady = false;
          state.projectionReady = true;
          state.imageRendered = true;

          if (api.canvas) {
            api.canvas.dataset.hearthCanvasAtlasBuilding = "false";
            api.canvas.dataset.hearthCanvasAtlasReady = "false";
            api.canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);
            api.canvas.dataset.atlasStartActive = "false";
          }

          drawFallbackShell(api.canvas, state);
          updateStatus(api, {
            atlasBuilding: false,
            atlasReady: false,
            projectionReady: true,
            imageRendered: true
          });

          safeEmit(options, "runtime-table-directed-atlas-error-fallback-held", {
            contract: CONTRACT,
            receipt: RECEIPT,
            error: error && error.message ? error.message : String(error),
            visualPassClaimed: false
          });
        }
      }
    );
  }

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element =
      typeof target === "string"
        ? root.document.querySelector(target)
        : target && target.nodeType === 1
          ? target
          : null;

    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-frame], [data-hearth-runtime-loading-panel], [data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => {
      node.remove();
    });

    const originalPosition = root.getComputedStyle ? root.getComputedStyle(element).position : "";

    if (!originalPosition || originalPosition === "static") {
      element.style.position = "relative";
    }

    const frame = root.document.createElement("div");
    frame.dataset.hearthCanvasFrame = "true";
    frame.dataset.hearthCanvasRuntimeTableDirected = "true";
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
      rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
      rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0,
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      destroyed: false,
      redrawPending: false,

      runtimeTableContract: "",
      runtimeTableLedger: null,
      runtimeAllowed: false,
      runtimeHandoff: "PENDING",
      channelLoadResults: [],
      waterProof: null,
      plan: null,

      atlas: null,
      atlasController: null,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      atlasStartAttempted: false,
      atlasBuilderEntered: false,
      atlasProgressObserved: false,
      atlasProgressFirstValue: 0,
      atlasStartTimestamp: "",
      projectionReady: true,
      imageRendered: true,

      externalStatusCallbackSafe: true,
      externalStatusCallbackErrors: [],

      receiptVisible: true,
      receiptExpanded: false,
      diagnosticExport: ""
    };

    const api = {
      canvas,
      frame,
      loadingPanel,
      node: element,
      state,
      mounted: true,
      canvasFound: true,
      controlsBound: false,
      interactiveShellMounted: true,
      runtimeTableDirected: true,
      planConsumer: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;

        state.redrawPending = false;

        if (state.atlasReady && state.atlas) {
          renderSphereFromAtlas(canvas, state.atlas, state, options);
          state.imageRendered = true;
          state.projectionReady = true;
        } else {
          drawFallbackShell(canvas, state);
          state.imageRendered = true;
          state.projectionReady = true;
        }

        state.frames += 1;
        canvas.dataset.hearthCanvasFrames = String(state.frames);

        return canvas;
      },
      requestRedraw() {
        if (state.destroyed || state.redrawPending) return;
        state.redrawPending = true;

        if (root.requestAnimationFrame) {
          root.requestAnimationFrame(() => api.redraw());
        } else {
          setTimeout(() => api.redraw(), 16);
        }
      },
      destroy() {
        state.destroyed = true;

        if (state.atlasController && typeof state.atlasController.cancel === "function") {
          state.atlasController.cancel();
        }

        if (typeof api.unbindControls === "function") api.unbindControls();

        if (frame.parentNode) frame.parentNode.removeChild(frame);
      },
      unbindControls: null
    };

    drawFallbackShell(canvas, state);
    api.unbindControls = bindPointerDrag(canvas, api);
    api.controlsBound = true;

    updateStatus(api, {
      imageRendered: true,
      projectionReady: true
    });

    safeEmit(options, "hearth-visible-carrier-shell-first-mounted", {
      contract: CONTRACT,
      receipt: RECEIPT,
      mounted: true,
      canvasFound: true,
      controlsBound: true,
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      imageRendered: true,
      visualPassClaimed: false
    });

    setTimeout(() => {
      if (state.destroyed) return;

      ensureRuntimeTable(options).then((runtimeResult) => {
        if (state.destroyed) return;

        const planApi = getRuntimePlanAuthority();
        state.runtimeTableContract = runtimeResult.actualContract || "";
        canvas.dataset.hearthRuntimeTableLoaded = String(Boolean(runtimeResult.planReady));
        canvas.dataset.hearthRuntimeTableContract = state.runtimeTableContract || "";

        updateStatus(api, {
          runtimeTableContract: state.runtimeTableContract
        });

        return ensureChannelScripts(options).then(({ results, waterProof }) => {
          if (state.destroyed) return;

          state.channelLoadResults = results;
          state.waterProof = waterProof;

          applyChannelProofsToDataset(results, waterProof, canvas);

          state.runtimeTableLedger = createRuntimeLedger(planApi, options);
          state.runtimeAllowed = Boolean(state.runtimeTableLedger && state.runtimeTableLedger.runtimeAllowed);
          state.runtimeHandoff = state.runtimeTableLedger && state.runtimeTableLedger.handoff ? state.runtimeTableLedger.handoff : "PENDING";

          state.plan = createPlan(planApi, state, options);

          updateStatus(api, {
            channelLoadResults: results,
            waterProof,
            runtimeTableLedger: state.runtimeTableLedger,
            runtimeAllowed: state.runtimeAllowed,
            runtimeHandoff: state.runtimeHandoff,
            plan: state.plan,
            imageRendered: true,
            projectionReady: true
          });

          safeEmit(options, "hearth-runtime-table-directed-plan-consumed", {
            contract: CONTRACT,
            receipt: RECEIPT,
            runtimeTableContract: state.runtimeTableContract,
            runtimeHandoff: state.runtimeHandoff,
            plan: clonePlain(state.plan),
            visualPassClaimed: false
          });

          if (state.plan && state.plan.atlasStartAuthorized) {
            startAtlas(api, options);
          } else {
            drawFallbackShell(canvas, state);
            updateStatus(api, {
              imageRendered: true,
              projectionReady: true
            });
          }
        });
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
    targetCanvas.dataset.hearthCanvasSphereContainment = "true";
    targetCanvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
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
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      role: "Hearth visible planet carrier and Runtime Table procedural plan consumer",

      runtimeTableDirected: true,
      runtimeTablePlanConsumer: true,
      runtimeTableRequiredContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
      runtimeTablePreviousContract: PREVIOUS_RUNTIME_TABLE_CONTRACT,
      runtimeTablePath: LAB_RUNTIME_TABLE_PATH,

      shellFirstMount: true,
      visibleCarrierImmediate: true,
      fallbackDiagnosticCarrierImmediate: true,
      touchDragBoundImmediately: true,
      pointerDragBoundImmediately: true,
      asyncRuntimeTableLoad: true,
      asyncChannelLoad: true,
      asyncAtlasBuild: true,
      chunkedAtlasBuild: true,
      mountReturnsApiObject: true,

      waterFailureDoesNotBlockAtlas: true,
      visualizationBlocksOnlyWhenCarrierUnsafe: true,
      constructionReadyIsNotCoherencePass: true,
      imageRenderedIsNotCoherencePass: true,
      coherentExpressionPassIsNotVisualPassClaim: true,

      childChannels: [
        LAND_PATH,
        WATER_PATH,
        AIR_PATH
      ],
      childContracts: {
        land: LAND_CONTRACT,
        water: WATER_CONTRACT,
        air: AIR_CONTRACT
      },

      owns: [
        "visible-canvas-shell",
        "fallback-diagnostic-carrier",
        "pointer-touch-drag-binding",
        "rotation-state",
        "redraw-scheduling",
        "script-load-measurement",
        "Runtime-Table-plan-consumption",
        "atlas-build-execution-when-authorized",
        "sphere-projection-expression",
        "diagnostic-receipt-export",
        "receipt-visible-toggle",
        "receipt-expanded-toggle",
        "copyable-diagnostic-export"
      ],
      doesNotOwn: [
        "Runtime Table procedural law",
        "Triple G diagnostic law",
        "water truth",
        "land truth",
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
    bindPointerDrag,
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
    ensureChannelScripts,
    createRuntimeLedger,
    createPlan,
    createDiagnosticExport,
    updateStatus,
    renderLoadingPanel,
    probeWaterActor,
    getReceipt,

    supportsTrueShellFirstMount: true,
    supportsVisibleCarrierImmediate: true,
    supportsFallbackDiagnosticCarrier: true,
    supportsImmediateTouchDrag: true,
    supportsImmediatePointerDrag: true,
    supportsRuntimeTablePlanConsumption: true,
    supportsRuntimeTableDirectedAtlasStart: true,
    supportsAsyncRuntimeTableLoad: true,
    supportsAsyncChannelLoad: true,
    supportsAsyncAtlasBuild: true,
    supportsChunkedAtlasBuild: true,
    supportsReceiptVisibilityToggle: true,
    supportsExpandedReceipt: true,
    supportsCopyableDiagnosticExport: true,

    runtimeTableDirected: true,
    runtimeTablePlanConsumer: true,
    runtimeTableRequiredContract: REQUIRED_RUNTIME_TABLE_CONTRACT,
    runtimeTablePath: LAB_RUNTIME_TABLE_PATH,

    canvasOwnsProceduralPlan: false,
    canvasOwnsWaterTruth: false,
    connectorOwnsWaterTruth: false,
    semiconductorOutlet: true,
    canvasDecidesNothing: true,

    consumesLandChannel: true,
    consumesWaterChannel: true,
    consumesAirChannel: true,
    landChannelContract: LAND_CONTRACT,
    waterChannelContract: WATER_CONTRACT,
    airChannelContract: AIR_CONTRACT,

    waterFailureDoesNotBlockAtlas: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,
    constructionReadyIsNotCoherencePass: true,
    imageRenderedIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,

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

  root.HEARTH_CANVAS_TRUE_SHELL_FIRST = true;
  root.HEARTH_CANVAS_VISIBLE_CARRIER = true;
  root.HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED = true;
  root.HEARTH_CANVAS_PLAN_CONSUMER = true;
  root.HEARTH_CANVAS_ASYNC_ATLAS_BUILD = true;
  root.HEARTH_CANVAS_SUPPORTS_TOUCH_DRAG = true;
  root.HEARTH_CANVAS_SUPPORTS_POINTER_DRAG = true;
  root.HEARTH_CANVAS_WATER_FAILURE_DOES_NOT_BLOCK_ATLAS = true;
  root.HEARTH_CANVAS_VISUALIZATION_BLOCKS_ONLY_WHEN_CARRIER_UNSAFE = true;
  root.HEARTH_CANVAS_OWNS_WATER_TRUTH = false;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;

    dataset.hearthCanvasTrueShellFirst = "true";
    dataset.hearthCanvasVisibleCarrier = "true";
    dataset.hearthCanvasRuntimeTableDirected = "true";
    dataset.hearthCanvasPlanConsumer = "true";
    dataset.hearthCanvasOwnsProceduralPlan = "false";
    dataset.hearthCanvasNonBlockingMount = "true";
    dataset.hearthCanvasAsyncAtlasBuild = "true";
    dataset.hearthCanvasSupportsTouchDrag = "true";
    dataset.hearthCanvasSupportsPointerDrag = "true";
    dataset.hearthCanvasMountReturnsApiObject = "true";
    dataset.hearthCanvasChannelMultiplex = "true";
    dataset.hearthCanvasSemiconductorOutlet = "true";
    dataset.hearthCanvasDecidesNothing = "true";

    dataset.hearthRuntimeTablePrewired = "true";
    dataset.hearthRuntimeTableContract = REQUIRED_RUNTIME_TABLE_CONTRACT;
    dataset.hearthRuntimeTablePreviousContract = PREVIOUS_RUNTIME_TABLE_CONTRACT;
    dataset.hearthCanvasConsumesLabRuntimeTable = "true";
    dataset.hearthCanvasConsumesLabTripleGDiagnostic = "true";
    dataset.hearthCanvasConsumesRuntimeTableProceduralPlan = "true";

    dataset.visualCarrierAllowed = "true";
    dataset.visualizationBlocked = "false";
    dataset.visualCarrierMode = "fallback-diagnostic";
    dataset.visualDiagnosticStatus = "PENDING";
    dataset.visualDiagnosticCue = "SHELL_FIRST_VISIBLE_CARRIER";

    dataset.hearthWaterConnectorActive = "true";
    dataset.hearthWaterConnectorMode = "conduct-request-verify-only";
    dataset.hearthWaterConnectorOwnsWaterTruth = "false";
    dataset.hearthCanvasOwnsWaterTruth = "false";
    dataset.hearthWaterChildExternalAuthority = WATER_PATH;
    dataset.hearthWaterChildExpectedContract = WATER_CONTRACT;

    dataset.waterFailureDoesNotBlockAtlas = "true";
    dataset.visualizationBlocksOnlyWhenCarrierUnsafe = "true";
    dataset.constructionReadyIsNotCoherencePass = "true";
    dataset.imageRenderedIsNotCoherencePass = "true";
    dataset.coherentExpressionPassIsNotVisualPassClaim = "true";

    dataset.hearthCanvasLandChannelContract = LAND_CONTRACT;
    dataset.hearthCanvasWaterChannelContract = WATER_CONTRACT;
    dataset.hearthCanvasAirChannelContract = AIR_CONTRACT;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.routeMutation = "false";
    dataset.runtimeMutation = "false";
    dataset.controlsMutation = "false";
    dataset.coherentExpressionPass = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
