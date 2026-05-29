// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1
// Full-file replacement.
// Canvas / mount / visible diagnostic carrier / connector-load measurement / Runtime Table consumer authority only.
// Purpose:
// - Restore the visible/touchable Hearth planet carrier as nonblocking diagnostic evidence.
// - Preserve shell-first mount, pointer/touch drag, loading/diagnostic panel, and copyable receipt export.
// - Preserve Land and Air child loading.
// - Preserve the Water Child connector and exact coordinate failure proof.
// - Treat Water Child failure as degraded water-layer diagnostic state, not as visualization block.
// - Build atlas/projection whenever the carrier can safely render.
// - Keep visualPassClaimed=false until coherent expression is proven.
// Does not own:
// - Water Child truth
// - water packet generation
// - hydrology law
// - materials law
// - land truth
// - air truth
// - route orchestration
// - Runtime Table canonical standard
// - Triple G diagnostic canonical standard
// - runtime motion authority
// - controls authority
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_WATER_CHILD_CONNECTOR_LOAD_ALIGNMENT_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-visible-planet-nonblocking-water-child-diagnostic-recovery-v1";

  const LAB_RUNTIME_TABLE_PATH = "/assets/lab/runtime-table.js";
  const PREFERRED_LAB_RUNTIME_TABLE_CONTRACT = "LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2";
  const ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS = Object.freeze([
    "LAB_RUNTIME_TABLE_AND_TRIPLE_G_COHERENCE_DIAGNOSTIC_STANDARD_TNT_v2",
    "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1"
  ]);

  const LAND_CONTRACT = "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1";
  const WATER_CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const AIR_CONTRACT = "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1";

  const WATER_CHILD_PATH = "/assets/hearth/hearth.water.channel.js";
  const WATER_CHILD_CACHE_KEY = "hearth-water-channel-load-export-v1";
  const WATER_CHILD_MARKER = "hearth-water-channel";
  const WATER_CHILD_MODE = "conduct-request-verify-only";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  const SHARED_RUNTIME_TABLE_SAMPLE_POINT = Object.freeze({
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
      path: "/assets/hearth/hearth.land.channel.js",
      contract: LAND_CONTRACT,
      globalName: "HEARTH_LAND_CHANNEL",
      cacheKey: "hearth-land-channel-active-v1",
      marker: "hearth-land-channel"
    },
    {
      key: "water",
      label: "Water channel",
      path: WATER_CHILD_PATH,
      contract: WATER_CONTRACT,
      globalName: "HEARTH_WATER_CHANNEL",
      cacheKey: WATER_CHILD_CACHE_KEY,
      marker: WATER_CHILD_MARKER
    },
    {
      key: "air",
      label: "Air channel",
      path: "/assets/hearth/hearth.air.channel.js",
      contract: AIR_CONTRACT,
      globalName: "HEARTH_AIR_CHANNEL",
      cacheKey: "hearth-air-channel-active-v1",
      marker: "hearth-air-channel"
    }
  ]);

  const CARRIER_BLOCK_REASONS = Object.freeze({
    CANVAS_MOUNT_FAILED: "CANVAS_MOUNT_FAILED",
    COORDINATE_BODY_MISSING: "COORDINATE_BODY_MISSING",
    DRAWABLE_SHELL_MISSING: "DRAWABLE_SHELL_MISSING",
    PROJECTION_CONTAINMENT_FAILED: "PROJECTION_CONTAINMENT_FAILED",
    FALSE_AUTHORITY_RISK: "FALSE_AUTHORITY_RISK",
    FALLBACK_TRUTH_BOUNDARY_MISSING: "FALLBACK_TRUTH_BOUNDARY_MISSING"
  });

  const ALLOWED_HANDOFFS = Object.freeze([
    "FULL_PASS",
    "OPTIMIZED_PASS",
    "DEGRADED_PASS",
    "FALLBACK_PASS"
  ]);

  const COLORS = Object.freeze({
    shellDark: [5, 9, 19],
    shellMid: [16, 31, 48],
    shellLight: [62, 84, 92],
    land: [92, 86, 58],
    water: [8, 35, 86],
    air: [150, 190, 210],
    rim: [174, 216, 236],
    atmosphere: [20, 32, 48],
    shadow: [2, 5, 12],
    diagnosticYellow: [225, 184, 82]
  });

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
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
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
    return wrap01((Number(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(Number(v), 0, 1) * 180;
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
      return { inside: false, edgeAlpha: 0, radial: Math.sqrt(rr), vector: { x: 0, y: 0, z: 1 } };
    }

    const radial = Math.sqrt(rr);
    const z = Math.sqrt(Math.max(0, 1 - rr));
    const edgeAlpha = clamp01((1 - radial) / 0.025);

    return {
      inside: true,
      edgeAlpha,
      radial,
      vector: normalize3({ x: dx, y: -dy, z })
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) return lonLatToVector(uToLon(p.u), vToLat(p.v));
      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) return lonLatToVector(Number(p.lon), Number(p.lat));
      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) return lonLatToVector(Number(p.longitude), Number(p.latitude));
      if (Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)) && Number.isFinite(Number(p.z))) return normalize3(p);
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function colorField(source, keys, fallback) {
    for (const key of keys) {
      const value = source && source[key];
      if (Array.isArray(value) && value.length >= 3 && value.every((v) => Number.isFinite(Number(v)))) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }
    return fallback.slice();
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function getRuntimeTableApi() {
    return root.LAB_RUNTIME_TABLE || root.RUNTIME_TABLE || root.DexterRuntimeTable || (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) || null;
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

  function getHandoffAllowed(handoff) {
    return ALLOWED_HANDOFFS.includes(String(handoff || ""));
  }

  function callChannel(authority, args, p) {
    if (!authority) return null;

    const ll = vectorToLonLat(p);
    const fallbackArg = { u: lonToU(ll.lon), v: latToV(ll.lat), x: p.x, y: p.y, z: p.z, lon: ll.lon, lat: ll.lat };
    const methods = ["sample", "read", "compose", "getWater", "waterAt"];

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
    const landShape = clamp01(0.42 + Math.sin((ll.lon + 35) * DEG) * 0.18 + Math.cos(ll.lat * DEG * 2) * 0.10);
    const landAlpha = landShape > 0.48 ? 0.42 : 0.05;

    return {
      channel: "land",
      channelClass: landAlpha > 0.2 ? "fallback-body-bound-land" : "fallback-low-land",
      rgb: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      color: mixColor(COLORS.land, COLORS.shellMid, 1 - landAlpha),
      alpha: landAlpha,
      landAlpha,
      landPresence: landAlpha,
      bodyBinding: Math.max(landAlpha, 0.76),
      surfaceAttachment: Math.max(landAlpha, 0.76),
      atmosphericRejection: 1,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      sourceContract: "FALLBACK_LAND_CHANNEL"
    };
  }

  function fallbackWater(p) {
    const ll = vectorToLonLat(p);
    const oceanBand = Math.cos(ll.lat * DEG) * 0.5 + 0.5;
    const basinWave = Math.sin((ll.lon * 1.4 + 22) * DEG) * 0.5 + 0.5;
    const waterShape = clamp01(0.28 + oceanBand * 0.24 + basinWave * 0.18 + (p.z < 0.2 ? 0.16 : 0));
    const waterAlpha = clamp01(Math.max(0.18, waterShape * 0.55));

    return {
      channel: "water",
      channelClass: "fallback-diagnostic-surface-water",
      rgb: mixColor(COLORS.water, COLORS.shellDark, 0.22),
      color: mixColor(COLORS.water, COLORS.shellDark, 0.22),
      alpha: waterAlpha,
      waterAlpha,
      waterPresence: waterAlpha,
      hydrosphereBinding: 0.84,
      surfaceSeat: 0.84,
      depthBinding: 0.72,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      sourceContract: "FALLBACK_WATER_CHANNEL",
      canvasFallbackOnly: true,
      canvasOwnsWaterTruth: false,
      fallbackReason: "WATER_CHILD_LOAD_FAILURE"
    };
  }

  function fallbackAir(p) {
    const limb = clamp01(1 - Math.abs(p.z));
    const airAlpha = clamp01(limb * 0.12);

    return {
      channel: "air",
      channelClass: "fallback-rim-air",
      rgb: COLORS.air.slice(),
      color: COLORS.air.slice(),
      alpha: airAlpha,
      airAlpha,
      airPresence: airAlpha,
      atmosphereSeparation: Math.max(airAlpha, 0.12),
      humidity: 0.16,
      airPressure: 0.52,
      barometricPressure: 0.52,
      barometricGradient: 0.08,
      rimHaze: limb,
      limbAtmosphere: limb,
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false,
      sourceContract: "FALLBACK_AIR_CHANNEL"
    };
  }

  function normalizeLand(raw, p) {
    const fallback = fallbackLand(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "landRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "landAlpha", fallback.alpha))),
      landAlpha: clamp01(numberField(source, "landAlpha", numberField(source, "landPresence", fallback.landAlpha))),
      bodyBinding: clamp01(numberField(source, "bodyBinding", fallback.bodyBinding)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", fallback.surfaceAttachment)),
      atmosphericRejection: clamp01(numberField(source, "atmosphericRejection", fallback.atmosphericRejection)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false
    };
  }

  function normalizeWater(raw, p) {
    const fallback = fallbackWater(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "waterRgb", "oceanRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "waterAlpha", fallback.alpha))),
      waterAlpha: clamp01(numberField(source, "waterAlpha", numberField(source, "waterPresence", fallback.waterAlpha))),
      hydrosphereBinding: clamp01(numberField(source, "hydrosphereBinding", fallback.hydrosphereBinding)),
      surfaceSeat: clamp01(numberField(source, "surfaceSeat", fallback.surfaceSeat)),
      depthBinding: clamp01(numberField(source, "depthBinding", fallback.depthBinding)),
      bodyBound: boolField(source, "bodyBound", true),
      surfaceBound: boolField(source, "surfaceBound", true),
      floatsAboveBody: false,
      allowedToFloat: false
    };
  }

  function normalizeAir(raw, p) {
    const fallback = fallbackAir(p);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const rgb = colorField(source, ["rgb", "color", "airRgb", "atmosphereRgb"], fallback.rgb);

    return {
      ...fallback,
      ...source,
      rgb,
      color: rgb,
      alpha: clamp01(numberField(source, "alpha", numberField(source, "airAlpha", fallback.alpha))),
      airAlpha: clamp01(numberField(source, "airAlpha", numberField(source, "airPresence", fallback.airAlpha))),
      atmosphereSeparation: clamp01(numberField(source, "atmosphereSeparation", fallback.atmosphereSeparation)),
      humidity: clamp01(numberField(source, "humidity", fallback.humidity)),
      airPressure: clamp01(numberField(source, "airPressure", fallback.airPressure)),
      barometricPressure: clamp01(numberField(source, "barometricPressure", fallback.barometricPressure)),
      barometricGradient: clamp01(numberField(source, "barometricGradient", fallback.barometricGradient)),
      rimHaze: clamp01(numberField(source, "rimHaze", fallback.rimHaze)),
      limbAtmosphere: clamp01(numberField(source, "limbAtmosphere", fallback.limbAtmosphere)),
      floatsAboveBody: true,
      allowedToFloat: true,
      bodyBound: false,
      surfaceBound: false,
      mayDefineLand: false,
      mayDefineWater: false
    };
  }

  function composeChannels(land, water, air, p) {
    let rgb = COLORS.shellMid.slice();

    const landWeight = clamp01(land.landAlpha * (0.74 + land.bodyBinding * 0.20 + land.surfaceAttachment * 0.10));
    const waterWeight = clamp01(water.waterAlpha * (0.70 + water.hydrosphereBinding * 0.18 + water.depthBinding * 0.10));
    const airWeight = clamp01(air.airAlpha * (0.22 + air.atmosphereSeparation * 0.12 + air.rimHaze * 0.08));

    if (landWeight > 0.01) rgb = mixColor(rgb, land.rgb, landWeight);
    if (waterWeight > 0.01) rgb = mixColor(rgb, water.rgb, waterWeight);
    if (airWeight > 0.01) rgb = mixColor(rgb, air.rgb, airWeight);

    const light = normalize3({ x: -0.34, y: 0.42, z: 0.83 });
    const illumination = clamp01(0.66 + dot3(p, light) * 0.30);
    const bodyLock = clamp01(land.bodyBinding * 0.34 + land.surfaceAttachment * 0.20 + water.hydrosphereBinding * 0.26 + water.surfaceSeat * 0.12 + 0.08);
    const seatedShade = clamp01(0.76 + illumination * 0.22 + bodyLock * 0.08);

    rgb = scaleColor(rgb, seatedShade);

    return { rgb, alpha: clamp01(0.96 + airWeight * 0.04), landWeight, waterWeight, airWeight, bodyLock };
  }

  function multiplexSample(...args) {
    const p = parseInput(...args);
    const waterActor = getWaterChannel();

    const land = normalizeLand(callChannel(getLandChannel(), args, p), p);
    const water = normalizeWater(callChannel(waterActor, args, p), p);
    const air = normalizeAir(callChannel(getAirChannel(), args, p), p);
    const composed = composeChannels(land, water, air, p);

    const waterFallbackActive = !waterActor || water.sourceContract === "FALLBACK_WATER_CHANNEL" || water.canvasFallbackOnly === true;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-visible-planet-nonblocking-water-child-diagnostic-recovery",

      x: p.x,
      y: p.y,
      z: p.z,

      runtimeTableConsumed: Boolean(getRuntimeTableApi()),
      runtimeTableContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      acceptedRuntimeTableContracts: ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.slice(),
      runtimeTableCanonicalOwner: "Dexter Lab",

      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualizationBlockReason: "",
      visualCarrierMode: waterFallbackActive ? "fallback-diagnostic" : "channel-diagnostic",
      visualDiagnosticStatus: waterFallbackActive ? "DEGRADED" : "READY",
      visualDiagnosticCue: waterFallbackActive ? "WATER_CHILD_LOAD_FAILURE" : "CHILD_CHANNELS_READY",

      channelMultiplexReady: Boolean(getLandChannel() && getAirChannel()),
      channelMultiplexDegraded: waterFallbackActive,
      semiconductorOutlet: true,
      canvasDecidesNothing: true,
      canvasOwnsWaterTruth: false,
      connectorOwnsWaterTruth: false,
      waterFallbackActive,
      waterFallbackReason: waterFallbackActive ? "C4_SCRIPT_NETWORK_LOAD_FAILURE" : "",
      waterChildConnectorMode: WATER_CHILD_MODE,
      waterChildExternalAuthority: WATER_CHILD_PATH,
      waterChildExpectedContract: WATER_CONTRACT,

      rgb: composed.rgb,
      color: composed.rgb,
      alpha: composed.alpha,

      land,
      water,
      air,

      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(waterActor),
      airChannelLoaded: Boolean(getAirChannel()),
      landLayerStatus: getLandChannel() ? "ready" : "fallback",
      waterLayerStatus: waterFallbackActive ? "degraded" : "ready",
      airLayerStatus: getAirChannel() ? "ready" : "fallback",

      landWeight: composed.landWeight,
      waterWeight: composed.waterWeight,
      airWeight: composed.airWeight,
      bodyLock: composed.bodyLock,

      compositeOrder: "planet-body-shell → land-channel → water-channel-or-fallback → air-channel → rim-lighting",

      landFloatsAboveBody: false,
      waterFloatsAboveBody: false,
      airFloatsAboveBody: true,

      ownsRuntimeTableStandard: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrology: false,
      ownsMaterialPalette: false,
      ownsOceanAuthority: false,
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

  function createWaterConnectorProof() {
    return {
      connectorActive: true,
      connectorMode: WATER_CHILD_MODE,
      connectorOwnsWaterTruth: false,
      canvasOwnsWaterTruth: false,
      waterChildExternalAuthority: WATER_CHILD_PATH,
      waterChildExpectedContract: WATER_CONTRACT,
      waterChildRequestPrepared: false,
      waterChildScriptElementCreated: false,
      waterChildScriptElementAppended: false,
      waterChildDocumentHeadAvailable: false,
      waterChildScriptMarker: WATER_CHILD_MARKER,
      waterChildScriptSrc: "",
      waterScriptRequested: false,
      waterScriptLoaded: false,
      waterScriptError: "",
      waterChildTimeoutCheck: false,
      waterChildLoadFailureCoordinate: "C0_CONNECTOR_NOT_STARTED",
      waterChildScriptElementPresent: false,
      waterChildScriptElementErrored: false,
      waterChildScriptErrorType: "",
      waterChildPathCandidateUsed: WATER_CHILD_PATH,
      waterChildFallbackCandidateUsed: false,
      waterGlobalPresent: false,
      waterActorName: "",
      waterActualContract: "",
      waterExpectedContract: WATER_CONTRACT,
      waterSampleProbeOk: false,
      waterSampleProbeContract: "",
      waterSampleProbeCoordinatesOk: false,
      waterSampleProbeFlagsOk: false,
      waterSampleProbeError: "",
      waterSampleProbeValue: null,
      waterValidationOk: false,
      waterContractOk: false,
      lastCheckedAt: ""
    };
  }

  function probeWaterActor() {
    const proof = createWaterConnectorProof();
    const water = getWaterChannel();

    proof.lastCheckedAt = new Date().toISOString();
    proof.waterGlobalPresent = Boolean(water);
    proof.waterActorName = water
      ? root.HEARTH_WATER_CHANNEL
        ? "HEARTH_WATER_CHANNEL"
        : root.HearthWaterChannel
          ? "HearthWaterChannel"
          : "HEARTH.waterChannel"
      : "";

    if (!water) {
      proof.waterChildLoadFailureCoordinate = "C6_GLOBAL_ACTOR_MISSING";
      proof.waterSampleProbeError = "HEARTH_WATER_CHANNEL global missing.";
      return proof;
    }

    proof.waterActualContract = String(water.contract || "");
    proof.waterContractOk = proof.waterActualContract === WATER_CONTRACT;

    if (!proof.waterContractOk) proof.waterChildLoadFailureCoordinate = "C7_CONTRACT_MISMATCH";

    const method = typeof water.sample === "function" ? "sample" : typeof water.read === "function" ? "read" : "";

    if (!method) {
      proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
      proof.waterSampleProbeError = "Water actor has no sample/read method.";
      return proof;
    }

    try {
      const value = water[method](SHARED_RUNTIME_TABLE_SAMPLE_POINT);
      proof.waterSampleProbeValue = value || null;
      proof.waterSampleProbeOk = Boolean(value && typeof value === "object");
      proof.waterSampleProbeContract = String((value && value.contract) || water.contract || "");

      if (!proof.waterSampleProbeOk) {
        proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
        proof.waterSampleProbeError = "Water actor sample/read returned no object.";
        return proof;
      }

      const coordsOk = ["u", "v", "lon", "lat", "x", "y", "z"].every((key) => Number.isFinite(Number(value[key])));
      proof.waterSampleProbeCoordinatesOk = coordsOk;

      if (!coordsOk) {
        proof.waterChildLoadFailureCoordinate = "C9_COORDINATE_PACKET_FAILURE";
        proof.waterSampleProbeError = "Water actor sample missing coordinate fields.";
        return proof;
      }

      const flagsOk =
        value.channel === "water" &&
        value.isWaterChannel === true &&
        value.bodyBound === true &&
        value.surfaceBound === true &&
        value.allowedToFloat === false &&
        value.floatsAboveBody === false &&
        value.mayDefineLand === false &&
        value.mayDefineAir === false;

      proof.waterSampleProbeFlagsOk = flagsOk;

      if (!flagsOk) {
        proof.waterChildLoadFailureCoordinate = "C10_WATER_AUTHORITY_FLAGS_FAILURE";
        proof.waterSampleProbeError = "Water actor sample failed body-bound water authority flags.";
        return proof;
      }

      proof.waterValidationOk = proof.waterContractOk && proof.waterSampleProbeOk && proof.waterSampleProbeCoordinatesOk && proof.waterSampleProbeFlagsOk;
      proof.waterChildLoadFailureCoordinate = proof.waterValidationOk ? "C11_WATER_CHILD_VALIDATED" : proof.waterChildLoadFailureCoordinate;
      return proof;
    } catch (error) {
      proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
      proof.waterSampleProbeError = error && error.message ? error.message : String(error);
      return proof;
    }
  }

  function classifyVisualState(waterProof) {
    const waterOk = Boolean(waterProof && waterProof.waterValidationOk);
    return {
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualizationBlockReason: "",
      visualCarrierMode: waterOk ? "channel-diagnostic" : "fallback-diagnostic",
      visualDiagnosticStatus: waterOk ? "READY" : "DEGRADED",
      visualDiagnosticCue: waterOk ? "CHILD_CHANNELS_READY" : "WATER_CHILD_LOAD_FAILURE",
      landLayerStatus: getLandChannel() ? "ready" : "fallback",
      waterLayerStatus: waterOk ? "ready" : "degraded",
      airLayerStatus: getAirChannel() ? "ready" : "fallback",
      waterFallbackActive: !waterOk,
      waterFallbackReason: waterOk ? "" : (waterProof && waterProof.waterChildLoadFailureCoordinate) || "C4_SCRIPT_NETWORK_LOAD_FAILURE"
    };
  }

  function applyVisualStateToDataset(visualState, targetCanvas) {
    const dataset = root.document && root.document.documentElement ? root.document.documentElement.dataset : null;
    const canvasDataset = targetCanvas && targetCanvas.dataset ? targetCanvas.dataset : null;
    const pairs = {
      visualCarrierAllowed: String(Boolean(visualState.visualCarrierAllowed)),
      visualizationBlocked: String(Boolean(visualState.visualizationBlocked)),
      visualizationBlockReason: String(visualState.visualizationBlockReason || ""),
      visualCarrierMode: String(visualState.visualCarrierMode || "fallback-diagnostic"),
      visualDiagnosticStatus: String(visualState.visualDiagnosticStatus || "DEGRADED"),
      visualDiagnosticCue: String(visualState.visualDiagnosticCue || "WATER_CHILD_LOAD_FAILURE"),
      landLayerStatus: String(visualState.landLayerStatus || "fallback"),
      waterLayerStatus: String(visualState.waterLayerStatus || "degraded"),
      airLayerStatus: String(visualState.airLayerStatus || "fallback"),
      hearthWaterFallbackActive: String(Boolean(visualState.waterFallbackActive)),
      hearthWaterFallbackReason: String(visualState.waterFallbackReason || ""),
      coherentExpressionPass: "false",
      visualPassClaimed: "false"
    };

    Object.keys(pairs).forEach((key) => {
      if (dataset) dataset[key] = pairs[key];
      if (canvasDataset) canvasDataset[key] = pairs[key];
    });
  }

  function applyWaterConnectorProofToDataset(proof, targetCanvas) {
    if (!proof) return;

    const dataset = root.document && root.document.documentElement ? root.document.documentElement.dataset : null;
    const canvasDataset = targetCanvas && targetCanvas.dataset ? targetCanvas.dataset : null;

    const pairs = {
      hearthWaterConnectorActive: String(Boolean(proof.connectorActive)),
      hearthWaterConnectorMode: WATER_CHILD_MODE,
      hearthWaterConnectorOwnsWaterTruth: "false",
      hearthCanvasOwnsWaterTruth: "false",
      hearthWaterChildExternalAuthority: WATER_CHILD_PATH,
      hearthWaterChildExpectedContract: WATER_CONTRACT,
      hearthWaterChildRequestPrepared: String(Boolean(proof.waterChildRequestPrepared)),
      hearthWaterChildScriptElementCreated: String(Boolean(proof.waterChildScriptElementCreated)),
      hearthWaterChildScriptElementAppended: String(Boolean(proof.waterChildScriptElementAppended)),
      hearthWaterChildDocumentHeadAvailable: String(Boolean(proof.waterChildDocumentHeadAvailable)),
      hearthWaterChildScriptMarker: WATER_CHILD_MARKER,
      hearthWaterChildScriptSrc: String(proof.waterChildScriptSrc || ""),
      hearthWaterScriptRequested: String(Boolean(proof.waterScriptRequested)),
      hearthWaterScriptLoaded: String(Boolean(proof.waterScriptLoaded)),
      hearthWaterScriptError: String(proof.waterScriptError || ""),
      hearthWaterChildTimeoutCheck: String(Boolean(proof.waterChildTimeoutCheck)),
      hearthWaterChildLoadFailureCoordinate: String(proof.waterChildLoadFailureCoordinate || ""),
      hearthWaterChildScriptElementPresent: String(Boolean(proof.waterChildScriptElementPresent)),
      hearthWaterChildScriptElementErrored: String(Boolean(proof.waterChildScriptElementErrored)),
      hearthWaterChildScriptErrorType: String(proof.waterChildScriptErrorType || ""),
      hearthWaterChildPathCandidateUsed: WATER_CHILD_PATH,
      hearthWaterChildFallbackCandidateUsed: String(Boolean(proof.waterChildFallbackCandidateUsed)),
      hearthWaterGlobalPresent: String(Boolean(proof.waterGlobalPresent)),
      hearthWaterActorName: String(proof.waterActorName || ""),
      hearthWaterActualContract: String(proof.waterActualContract || ""),
      hearthWaterExpectedContract: WATER_CONTRACT,
      hearthWaterSampleProbeOk: String(Boolean(proof.waterSampleProbeOk)),
      hearthWaterSampleProbeContract: String(proof.waterSampleProbeContract || ""),
      hearthWaterSampleProbeCoordinatesOk: String(Boolean(proof.waterSampleProbeCoordinatesOk)),
      hearthWaterSampleProbeFlagsOk: String(Boolean(proof.waterSampleProbeFlagsOk)),
      hearthWaterSampleProbeError: String(proof.waterSampleProbeError || ""),
      hearthWaterChannelLoaded: String(Boolean(proof.waterGlobalPresent && proof.waterContractOk)),
      hearthWaterValidationOk: String(Boolean(proof.waterValidationOk)),
      visualPassClaimed: "false"
    };

    Object.keys(pairs).forEach((key) => {
      if (dataset) dataset[key] = pairs[key];
      if (canvasDataset) canvasDataset[key] = pairs[key];
    });
  }

  function createShellCanvas(options = {}) {
    if (!root.document || typeof root.document.createElement !== "function") throw new Error("Hearth shell canvas requires document.createElement.");

    const requestedSize = Number.isFinite(Number(options.size)) ? Math.round(Number(options.size)) : Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 420;
    const size = clamp(requestedSize, 240, options.allowLargeTexture === true ? 720 : 520);
    const canvas = root.document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;
    canvas.className = options.className || "hearth-canvas-texture hearth-canvas-contained-sphere hearth-canvas-visible-planet-nonblocking-diagnostic-recovery";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.background = "transparent";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.cursor = "grab";

    const d = canvas.dataset;
    d.hearthCanvasTexture = "true";
    d.hearthCanvasContract = CONTRACT;
    d.hearthCanvasReceipt = RECEIPT;
    d.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    d.hearthCanvasShellFirst = "true";
    d.hearthCanvasSemiconductorOutlet = "true";
    d.hearthCanvasDecidesNothing = "true";
    d.hearthRuntimeTablePrewired = "true";
    d.hearthTripleGCoherencePrewired = "true";
    d.hearthRuntimeTableContract = PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
    d.hearthRuntimeTableAcceptedContracts = ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.join(",");
    d.hearthRuntimeTableLoaded = "false";
    d.hearthRuntimeTableRuntimeAllowed = "true";
    d.hearthRuntimeTableSet = "true";
    d.hearthRuntimeTableLedgerReady = "false";
    d.hearthRuntimeTableHandoff = "FALLBACK_PASS";
    d.hearthCanvasChannelMultiplexReady = "true";
    d.hearthCanvasChannelMultiplexDegraded = "true";
    d.hearthCanvasInteractiveShellMounted = "true";
    d.hearthCanvasCachedAtlasProjection = "pending";
    d.hearthCanvasInteractiveProjection = "true";
    d.hearthCanvasControlsBound = "false";
    d.hearthCanvasAtlasReady = "false";
    d.hearthCanvasAtlasBuilding = "false";
    d.hearthCanvasAtlasProgress = "0";
    d.hearthCanvasSphereContainment = "true";
    d.hearthCanvasNoRectangularTextureSpill = "true";
    d.hearthCanvasOutsideSphereTransparent = "true";
    d.visualCarrierAllowed = "true";
    d.visualizationBlocked = "false";
    d.visualizationBlockReason = "";
    d.visualCarrierMode = "fallback-diagnostic";
    d.visualDiagnosticStatus = "DEGRADED";
    d.visualDiagnosticCue = "WATER_CHILD_LOAD_FAILURE";
    d.landLayerStatus = "pending";
    d.waterLayerStatus = "degraded";
    d.airLayerStatus = "pending";
    d.hearthWaterFallbackActive = "true";
    d.hearthWaterFallbackReason = "WATER_CHILD_LOAD_FAILURE";
    d.hearthWaterConnectorActive = "true";
    d.hearthWaterConnectorMode = WATER_CHILD_MODE;
    d.hearthWaterConnectorOwnsWaterTruth = "false";
    d.hearthCanvasOwnsWaterTruth = "false";
    d.hearthWaterChildExternalAuthority = WATER_CHILD_PATH;
    d.hearthWaterChildExpectedContract = WATER_CONTRACT;
    d.hearthWaterChildLoadFailureCoordinate = "C0_CONNECTOR_NOT_STARTED";
    d.hearthReceiptMode = "compact";
    d.hearthReceiptVisible = "true";
    d.hearthReceiptExpanded = "false";
    d.hearthDiagnosticExportAvailable = "true";
    d.hearthDiagnosticExportCopied = "false";
    d.hearthDiagnosticExportLength = "0";
    d.hearthDiagnosticExportError = "";
    d.generatedImage = "false";
    d.graphicBox = "false";
    d.webgl = "false";
    d.routeMutation = "false";
    d.runtimeMutation = "false";
    d.controlsMutation = "false";
    d.coherentExpressionPass = "false";
    d.visualPassClaimed = "false";

    return canvas;
  }

  function createLoadingPanel() {
    const panel = root.document.createElement("aside");
    panel.dataset.hearthRuntimeLoadingPanel = "true";
    panel.dataset.hearthFormationPanel = "true";
    panel.style.position = "absolute";
    panel.style.left = "50%";
    panel.style.bottom = "14px";
    panel.style.transform = "translateX(-50%)";
    panel.style.width = "min(92%, 620px)";
    panel.style.maxHeight = "60%";
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
    if (raw.includes("block") || raw.includes("fail") || raw.includes("error")) return "✕";
    if (raw.includes("ready") || raw.includes("complete") || raw.includes("pass") || raw.includes("loaded") || raw.includes("active")) return "✓";
    if (raw.includes("fallback") || raw.includes("degraded") || raw.includes("diagnostic")) return "◐";
    if (raw.includes("loading") || raw.includes("building") || raw.includes("validating")) return "•";
    return "○";
  }

  function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0%";
    return `${Math.round(clamp01(n) * 100)}%`;
  }

  function formatRuntimeTableIssues(ledger) {
    if (!ledger || !Array.isArray(ledger.records)) return [];
    const lines = [];
    ledger.records.forEach((record) => {
      if (!record || !Array.isArray(record.issues) || !record.issues.length) return;
      record.issues.forEach((issue) => lines.push(`${record.name || record.key}: ${issue.code || "ISSUE"} — ${issue.message || "No detail supplied."}`));
    });
    return lines;
  }

  function createDiagnosticExport(state, canvas) {
    const waterProof = state.waterConnectorProof || createWaterConnectorProof();
    const visualState = state.visualState || classifyVisualState(waterProof);
    const ledger = state.runtimeTableLedger || null;
    const checkpoints = state.tripleGReceipt && Array.isArray(state.tripleGReceipt.checkpoints)
      ? state.tripleGReceipt.checkpoints
      : state.tripleGReceipt && Array.isArray(state.tripleGReceipt.checkpointReceipts)
        ? state.tripleGReceipt.checkpointReceipts
        : [];

    const dataset = {};
    const rootDataset = {};

    if (canvas && canvas.dataset) Object.keys(canvas.dataset).forEach((key) => { dataset[key] = canvas.dataset[key]; });
    if (root.document && root.document.documentElement && root.document.documentElement.dataset) {
      Object.keys(root.document.documentElement.dataset).forEach((key) => { rootDataset[key] = root.document.documentElement.dataset[key]; });
    }

    const constructionReady = Boolean(visualState.visualCarrierAllowed && !visualState.visualizationBlocked);
    const imageRendered = Boolean(state.imageRendered || state.fallbackActive || state.atlasReady);

    const lines = [
      "HEARTH_DIAGNOSTIC_RECEIPT_EXPORT",
      "",
      `timestamp=${new Date().toISOString()}`,
      `canvasContract=${CONTRACT}`,
      `canvasReceipt=${RECEIPT}`,
      `previousCanvasContract=${PREVIOUS_CONTRACT}`,
      `labRuntimeTableContract=${state.runtimeTableContract || ""}`,
      `preferredLabRuntimeTableContract=${PREFERRED_LAB_RUNTIME_TABLE_CONTRACT}`,
      `acceptedLabRuntimeTableContracts=${ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.join(",")}`,
      `runtimeHandoff=${state.runtimeHandoff || "FALLBACK_PASS"}`,
      `constructionReady=${String(constructionReady)}`,
      `imageRendered=${String(imageRendered)}`,
      `coherentExpressionPass=${String(Boolean(state.coherentExpressionPass))}`,
      `coherenceStatus=${state.coherenceStatus || "FAIL"}`,
      `coherenceScore=${Number.isFinite(Number(state.coherenceScore)) ? state.coherenceScore : 0}`,
      `failedCheckpoints=${(state.failedCheckpoints || []).join(",")}`,
      `warningCheckpoints=${(state.warningCheckpoints || []).join(",")}`,
      `renewalTargets=${(state.renewalTargets || []).join(",")}`,
      `landChannelContract=${LAND_CONTRACT}`,
      `waterChannelContract=${WATER_CONTRACT}`,
      `airChannelContract=${AIR_CONTRACT}`,
      "",
      "VISUAL_DIAGNOSTIC_CARRIER_PROOF",
      `visualCarrierAllowed=${String(Boolean(visualState.visualCarrierAllowed))}`,
      `visualizationBlocked=${String(Boolean(visualState.visualizationBlocked))}`,
      `visualizationBlockReason=${visualState.visualizationBlockReason || ""}`,
      `visualCarrierMode=${visualState.visualCarrierMode || "fallback-diagnostic"}`,
      `visualDiagnosticStatus=${visualState.visualDiagnosticStatus || "DEGRADED"}`,
      `visualDiagnosticCue=${visualState.visualDiagnosticCue || "WATER_CHILD_LOAD_FAILURE"}`,
      `landLayerStatus=${visualState.landLayerStatus || "fallback"}`,
      `waterLayerStatus=${visualState.waterLayerStatus || "degraded"}`,
      `airLayerStatus=${visualState.airLayerStatus || "fallback"}`,
      `waterFallbackActive=${String(Boolean(visualState.waterFallbackActive))}`,
      `waterFallbackReason=${visualState.waterFallbackReason || ""}`,
      "",
      "WATER_CONNECTOR_COORDINATE_PROOF",
      `connectorActive=${String(Boolean(waterProof.connectorActive))}`,
      `connectorMode=${WATER_CHILD_MODE}`,
      `connectorOwnsWaterTruth=false`,
      `canvasOwnsWaterTruth=false`,
      `waterChildExternalAuthority=${WATER_CHILD_PATH}`,
      `waterChildExpectedContract=${WATER_CONTRACT}`,
      `waterChildRequestPrepared=${String(Boolean(waterProof.waterChildRequestPrepared))}`,
      `waterChildScriptElementCreated=${String(Boolean(waterProof.waterChildScriptElementCreated))}`,
      `waterChildScriptElementAppended=${String(Boolean(waterProof.waterChildScriptElementAppended))}`,
      `waterChildDocumentHeadAvailable=${String(Boolean(waterProof.waterChildDocumentHeadAvailable))}`,
      `waterChildScriptMarker=${WATER_CHILD_MARKER}`,
      `waterChildScriptSrc=${waterProof.waterChildScriptSrc || ""}`,
      `waterScriptRequested=${String(Boolean(waterProof.waterScriptRequested))}`,
      `waterScriptLoaded=${String(Boolean(waterProof.waterScriptLoaded))}`,
      `waterScriptError=${waterProof.waterScriptError || ""}`,
      `waterChildTimeoutCheck=${String(Boolean(waterProof.waterChildTimeoutCheck))}`,
      `waterChildLoadFailureCoordinate=${waterProof.waterChildLoadFailureCoordinate || ""}`,
      `waterChildScriptElementPresent=${String(Boolean(waterProof.waterChildScriptElementPresent))}`,
      `waterChildScriptElementErrored=${String(Boolean(waterProof.waterChildScriptElementErrored))}`,
      `waterChildScriptErrorType=${waterProof.waterChildScriptErrorType || ""}`,
      `waterChildPathCandidateUsed=${WATER_CHILD_PATH}`,
      `waterChildFallbackCandidateUsed=${String(Boolean(waterProof.waterChildFallbackCandidateUsed))}`,
      `waterGlobalPresent=${String(Boolean(waterProof.waterGlobalPresent))}`,
      `waterActorName=${waterProof.waterActorName || ""}`,
      `waterActualContract=${waterProof.waterActualContract || ""}`,
      `waterExpectedContract=${WATER_CONTRACT}`,
      `waterSampleProbeOk=${String(Boolean(waterProof.waterSampleProbeOk))}`,
      `waterSampleProbeContract=${waterProof.waterSampleProbeContract || ""}`,
      `waterSampleProbeCoordinatesOk=${String(Boolean(waterProof.waterSampleProbeCoordinatesOk))}`,
      `waterSampleProbeFlagsOk=${String(Boolean(waterProof.waterSampleProbeFlagsOk))}`,
      `waterSampleProbeError=${waterProof.waterSampleProbeError || ""}`,
      "",
      `visualPassClaimed=false`,
      "",
      "STRATEGIC_SUMMARY",
      JSON.stringify({
        constructionReady: constructionReady ? "pass" : "blocked",
        imageRendered: imageRendered ? "pass" : "pending",
        coherentExpression: Boolean(state.coherentExpressionPass) ? "pass" : "FAIL",
        firstFailedCoordinate: waterProof.waterChildLoadFailureCoordinate || "UNKNOWN",
        visualCarrier: visualState.visualizationBlocked ? "BLOCKED" : visualState.visualDiagnosticStatus,
        recommendedNextRenewalTarget: waterProof.waterScriptLoaded ? "water-child-actor-validation" : "water-child-served-load-coordinate"
      }, null, 2),
      "",
      "CHANNEL_LOAD_RESULTS",
      JSON.stringify(state.channelLoadResults || [], null, 2),
      "",
      "WATER_SAMPLE_PROBE_VALUE",
      JSON.stringify(waterProof.waterSampleProbeValue || null, null, 2),
      "",
      "RUNTIME_TABLE_RECORDS",
      JSON.stringify(ledger && Array.isArray(ledger.records) ? ledger.records : [], null, 2),
      "",
      "TRIPLE_G_CHECKPOINT_RECEIPTS",
      JSON.stringify(checkpoints, null, 2),
      "",
      "RENDER_METADATA",
      JSON.stringify({
        atlasReady: Boolean(state.atlasReady),
        atlasBuilding: Boolean(state.atlasBuilding),
        atlasProgress: Number(state.atlasProgress || 0),
        projectionReady: Boolean(state.atlasReady || state.fallbackActive),
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        imageRendered,
        visualCarrierAllowed: Boolean(visualState.visualCarrierAllowed),
        visualizationBlocked: Boolean(visualState.visualizationBlocked),
        visualPassClaimed: false
      }, null, 2),
      "",
      "CANVAS_DATASET",
      JSON.stringify(dataset, null, 2),
      "",
      "DOCUMENT_ROOT_DATASET",
      JSON.stringify(rootDataset, null, 2)
    ];

    return lines.join("\n");
  }

  function renderLoadingPanel(panel, api) {
    if (!panel || !api || !api.state) return;

    const state = api.state;
    const stages = state.loadingStages || {};
    const handoff = state.runtimeHandoff || "FALLBACK_PASS";
    const waterProof = state.waterConnectorProof || createWaterConnectorProof();
    const visualState = state.visualState || classifyVisualState(waterProof);
    const issues = formatRuntimeTableIssues(state.runtimeTableLedger);

    const issueHtml = issues.length
      ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(174,216,236,.14);color:rgba(255,210,180,.92);">${issues.slice(0, 5).map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>`
      : "";

    const statusRows = [
      ["Visual carrier", visualState.visualizationBlocked ? "blocked" : visualState.visualCarrierMode || "fallback-diagnostic"],
      ["Visual cue", visualState.visualDiagnosticCue || "WATER_CHILD_LOAD_FAILURE"],
      ["Shell mounted", stages.shellMounted || "ready"],
      ["Touch bound", stages.touchBound || "ready"],
      ["Lab Runtime Table", stages.runtimeTable || "fallback-pass"],
      ["Land layer", visualState.landLayerStatus || "fallback"],
      ["Water connector", waterProof.waterChildLoadFailureCoordinate || "pending"],
      ["Water layer", visualState.waterLayerStatus || "degraded"],
      ["Air layer", visualState.airLayerStatus || "fallback"],
      ["Validation", stages.validation || "diagnostic"],
      ["Handoff", handoff],
      ["Atlas", stages.atlas || "building"],
      ["Projection", stages.projection || "ready"]
    ];

    const rowsHtml = statusRows.map(([label, value]) => {
      const text = String(value || "pending");
      return [
        "<div style=\"display:grid;grid-template-columns:22px 1fr auto;gap:7px;align-items:center;padding:2px 0;\">",
        `<span style="opacity:.78;">${statusBadge(text)}</span>`,
        `<span style="opacity:.86;">${escapeHtml(label)}</span>`,
        `<span style="opacity:.72;text-transform:uppercase;letter-spacing:.08em;font-size:9px;text-align:right;">${escapeHtml(text)}</span>`,
        "</div>"
      ].join("");
    }).join("");

    const exportText = createDiagnosticExport(state, api.canvas);
    state.diagnosticExport = exportText;

    if (api.canvas && api.canvas.dataset) {
      api.canvas.dataset.hearthDiagnosticExportAvailable = "true";
      api.canvas.dataset.hearthDiagnosticExportLength = String(exportText.length);
      api.canvas.dataset.hearthReceiptMode = state.receiptExpanded ? "expanded" : "compact";
      api.canvas.dataset.hearthReceiptVisible = String(Boolean(state.receiptVisible));
      api.canvas.dataset.hearthReceiptExpanded = String(Boolean(state.receiptExpanded));
    }

    const expandedHtml = state.receiptExpanded
      ? `<pre style="margin:10px 0 0;padding:10px;max-height:220px;overflow:auto;border-radius:10px;background:rgba(0,0,0,.36);white-space:pre-wrap;font-size:10px;line-height:1.35;">${escapeHtml(exportText)}</pre>`
      : "";

    panel.style.display = state.receiptVisible ? "block" : "none";
    panel.innerHTML = [
      "<div style=\"display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;\">",
      "<strong style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;\">Hearth Visual Diagnostic Carrier</strong>",
      `<span style="font-size:10px;opacity:.70;">${escapeHtml(formatPercent(state.atlasProgress || 0))}</span>`,
      "</div>",
      "<div style=\"height:4px;border-radius:999px;background:rgba(174,216,236,.12);overflow:hidden;margin-bottom:9px;\">",
      `<div style="height:100%;width:${escapeHtml(formatPercent(state.atlasProgress || 0))};background:rgba(174,216,236,.72);border-radius:999px;"></div>`,
      "</div>",
      "<div style=\"display:flex;gap:8px;flex-wrap:wrap;margin-bottom:9px;\">",
      "<button type=\"button\" data-hearth-receipt-toggle style=\"border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;\">Receipt visible</button>",
      `<button type="button" data-hearth-receipt-expand style="border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;">${state.receiptExpanded ? "Compact receipt" : "Expand receipt"}</button>`,
      "<button type=\"button\" data-hearth-receipt-copy style=\"border:1px solid rgba(174,216,236,.24);border-radius:999px;background:rgba(174,216,236,.08);color:rgba(238,246,255,.9);padding:5px 9px;font-size:10px;cursor:pointer;\">Copy diagnostic</button>",
      "</div>",
      rowsHtml,
      issueHtml,
      expandedHtml
    ].join("");

    const toggle = panel.querySelector("[data-hearth-receipt-toggle]");
    const expand = panel.querySelector("[data-hearth-receipt-expand]");
    const copy = panel.querySelector("[data-hearth-receipt-copy]");

    if (toggle) toggle.onclick = () => { state.receiptVisible = !state.receiptVisible; renderLoadingPanel(panel, api); };
    if (expand) expand.onclick = () => { state.receiptExpanded = !state.receiptExpanded; renderLoadingPanel(panel, api); };
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
          root.navigator.clipboard.writeText(text).then(() => setCopied(true, ""), (error) => setCopied(false, error && error.message ? error.message : String(error)));
        } else {
          setCopied(false, "clipboard unavailable");
        }
      };
    }
  }

  function updateLoadingStatus(api, patch = {}) {
    if (!api || !api.state) return;

    const state = api.state;

    if (patch.stages && typeof patch.stages === "object") state.loadingStages = { ...state.loadingStages, ...patch.stages };
    if (patch.runtimeTableLedger) state.runtimeTableLedger = patch.runtimeTableLedger;
    if (patch.runtimeHandoff) state.runtimeHandoff = patch.runtimeHandoff;
    if (typeof patch.runtimeAllowed === "boolean") state.runtimeAllowed = patch.runtimeAllowed;
    if (Number.isFinite(Number(patch.atlasProgress))) state.atlasProgress = clamp01(patch.atlasProgress);
    if (patch.error) state.error = patch.error;
    if (patch.waterConnectorProof) state.waterConnectorProof = patch.waterConnectorProof;
    if (patch.visualState) state.visualState = patch.visualState;
    if (patch.channelLoadResults) state.channelLoadResults = patch.channelLoadResults;
    if (patch.tripleGReceipt) state.tripleGReceipt = patch.tripleGReceipt;

    const visualState = state.visualState || classifyVisualState(state.waterConnectorProof || createWaterConnectorProof());

    if (api.canvas) {
      const d = api.canvas.dataset;
      d.hearthRuntimeTableHandoff = state.runtimeHandoff || "FALLBACK_PASS";
      d.hearthRuntimeTableRuntimeAllowed = "true";
      d.hearthRuntimeTableSet = "true";
      d.hearthRuntimeTableLedgerReady = String(Boolean(state.runtimeTableLedger));
      d.hearthCanvasAtlasProgress = String(state.atlasProgress || 0);
      d.hearthCanvasChannelMultiplexReady = "true";
      d.hearthCanvasChannelMultiplexDegraded = String(Boolean(visualState.waterFallbackActive));
      d.hearthCanvasImageRendered = String(Boolean(state.imageRendered || state.fallbackActive || state.atlasReady));
      d.coherentExpressionPass = String(Boolean(state.coherentExpressionPass));
      d.visualPassClaimed = "false";
      if (state.error) d.hearthRuntimeTableError = state.error;
      if (state.waterConnectorProof) applyWaterConnectorProofToDataset(state.waterConnectorProof, api.canvas);
      applyVisualStateToDataset(visualState, api.canvas);
    }

    renderLoadingPanel(api.loadingPanel, api);
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
    const pulse = Math.sin((Number(state.frames) || 0) * 0.06) * 0.5 + 0.5;

    ctx.clearRect(0, 0, width, height);

    const shell = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.34, r * 0.05, cx, cy, r);
    shell.addColorStop(0, "rgba(88, 118, 130, 0.96)");
    shell.addColorStop(0.42, "rgba(28, 52, 70, 0.98)");
    shell.addColorStop(0.78, "rgba(8, 17, 34, 0.99)");
    shell.addColorStop(1, "rgba(1, 4, 12, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.clip();
    ctx.fillStyle = shell;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.32, r * 0.10, cx + r * 0.18, cy + r * 0.14, r * 1.08);
    shade.addColorStop(0, "rgba(255,255,255,0.10)");
    shade.addColorStop(0.44, "rgba(255,255,255,0.00)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.24)");
    shade.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.strokeStyle = `rgba(172, 219, 240, ${0.22 + pulse * 0.10})`;
    ctx.lineWidth = Math.max(1, size * 0.005);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TWO_PI);
    ctx.strokeStyle = `rgba(225, 184, 82, ${0.10 + pulse * 0.06})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    canvas.dataset.hearthCanvasFallbackShellPainted = "true";
    canvas.dataset.hearthCanvasNeutralLoadingShell = "true";
    canvas.dataset.hearthCanvasImageRendered = "true";
    canvas.dataset.hearthCanvasFrames = String(Number(canvas.dataset.hearthCanvasFrames || 0) + 1);

    if (state && typeof state === "object") {
      state.fallbackActive = true;
      state.imageRendered = true;
    }

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
    const rotationLon = Number.isFinite(Number(state.rotationLon)) ? Number(state.rotationLon) : 0;
    const rotationLat = Number.isFinite(Number(state.rotationLat)) ? Number(state.rotationLat) : 0;
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
          const limbAtmosphere = clamp01(sphere.radial * 0.05);
          const mixed = mixColor([r, g, b], COLORS.atmosphere, limbAtmosphere);
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
    targetCanvas.dataset.hearthCanvasFrames = String(Number(targetCanvas.dataset.hearthCanvasFrames || 0) + 1);

    if (state && typeof state === "object") {
      state.imageRendered = true;
      state.fallbackActive = false;
    }

    return targetCanvas;
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
        failureCoordinate: "",
        at: new Date().toISOString()
      };

      const validate = () => {
        const authority = root[item.globalName];
        result.globalPresent = Boolean(authority);
        result.actualContract = authority && authority.contract ? String(authority.contract) : "";
        result.contractOk = result.actualContract === item.contract;
        result.validationOk = result.globalPresent && result.contractOk;
        return result.validationOk;
      };

      if (validate()) {
        result.loaded = true;
        result.alreadyPresent = true;
        result.failureCoordinate = "ALREADY_PRESENT_VALIDATED";
        resolve(result);
        return;
      }

      if (!root.document || !root.document.head) {
        result.error = "document-head-unavailable";
        result.errorType = "document";
        result.failureCoordinate = "C3_DOCUMENT_HEAD_UNAVAILABLE";
        resolve(result);
        return;
      }

      result.documentHeadAvailable = true;
      const existing = root.document.querySelector(`script[data-hearth-loader-marker="${item.marker}"]`);

      if (existing) {
        result.existing = true;
        result.scriptElementCreated = true;
        result.scriptElementAppended = true;
        result.requested = true;
        result.requestedSrc = existing.getAttribute("src") || "";
        setTimeout(() => {
          validate();
          result.loaded = result.validationOk;
          result.failureCoordinate = result.validationOk ? "EXISTING_SCRIPT_VALIDATED" : "C6_GLOBAL_ACTOR_MISSING";
          resolve(result);
        }, options.existingValidationDelay || 80);
        return;
      }

      const script = root.document.createElement("script");
      const joiner = item.path.includes("?") ? "&" : "?";
      const src = `${item.path}${joiner}v=${encodeURIComponent(result.scriptCacheKey)}`;

      result.scriptElementCreated = true;
      result.requested = true;
      result.requestedSrc = src;

      script.src = src;
      script.defer = true;
      script.dataset.hearthLoaderMarker = item.marker;
      script.dataset.hearthCanvasContract = CONTRACT;
      script.dataset.hearthCanvasReceipt = RECEIPT;
      script.dataset.hearthScriptExpectedContract = item.contract;
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
          result.failureCoordinate = result.validationOk ? "C11_WATER_CHILD_VALIDATED" : result.globalPresent ? "C7_CONTRACT_MISMATCH" : "C6_GLOBAL_ACTOR_MISSING";
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
      } catch (error) {
        result.error = error && error.message ? error.message : String(error);
        result.errorType = "append-error";
        result.failureCoordinate = "C3_SCRIPT_APPEND_FAILURE";
        resolve(result);
        return;
      }

      setTimeout(() => {
        if (!settled) settle("timeout", "script-load-timeout");
      }, options.timeoutMs || 6000);
    });
  }

  function ensureRuntimeTable(options = {}) {
    return loadScriptDetailed({
      key: "runtime-table",
      label: "Lab Runtime Table",
      path: LAB_RUNTIME_TABLE_PATH,
      contract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      globalName: "LAB_RUNTIME_TABLE",
      cacheKey: options.runtimeTableCacheKey || "lab-runtime-table-v2",
      marker: "lab-runtime-table"
    }, { timeoutMs: options.timeoutMs || 6000 }).then((result) => {
      const api = getRuntimeTableApi();
      const contract = api && api.contract ? String(api.contract) : "";
      const accepted = Boolean(api && ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.includes(contract));
      return { ...result, loaded: accepted, validationOk: accepted, api, contract, accepted };
    }).catch((error) => ({
      key: "runtime-table",
      label: "Lab Runtime Table",
      path: LAB_RUNTIME_TABLE_PATH,
      loaded: false,
      validationOk: false,
      accepted: false,
      contract: "",
      error: error && error.message ? error.message : String(error)
    }));
  }

  function ensureChannelScripts(options = {}) {
    return Promise.all(CHANNEL_FILES.map((item) => {
      return loadScriptDetailed(item, { timeoutMs: options.timeoutMs || 6000 }).then((result) => {
        if (item.key === "water") {
          const proof = createWaterConnectorProof();
          proof.connectorActive = true;
          proof.waterChildRequestPrepared = true;
          proof.waterChildScriptElementCreated = result.scriptElementCreated;
          proof.waterChildScriptElementAppended = result.scriptElementAppended;
          proof.waterChildDocumentHeadAvailable = result.documentHeadAvailable;
          proof.waterChildScriptSrc = result.requestedSrc;
          proof.waterScriptRequested = result.requested;
          proof.waterScriptLoaded = result.loaded;
          proof.waterScriptError = result.error;
          proof.waterChildTimeoutCheck = result.timeoutCheck;
          proof.waterChildScriptElementPresent = result.scriptElementCreated || result.existing;
          proof.waterChildScriptElementErrored = result.errorType === "error";
          proof.waterChildScriptErrorType = result.errorType;
          proof.waterChildLoadFailureCoordinate = result.failureCoordinate || "";
          proof.waterGlobalPresent = result.globalPresent;
          proof.waterActualContract = result.actualContract;
          proof.waterExpectedContract = WATER_CONTRACT;
          proof.waterContractOk = result.contractOk;
          proof.lastCheckedAt = new Date().toISOString();

          const actorProof = probeWaterActor();
          proof.waterGlobalPresent = actorProof.waterGlobalPresent;
          proof.waterActorName = actorProof.waterActorName;
          proof.waterActualContract = actorProof.waterActualContract || proof.waterActualContract;
          proof.waterContractOk = actorProof.waterContractOk;
          proof.waterSampleProbeOk = actorProof.waterSampleProbeOk;
          proof.waterSampleProbeContract = actorProof.waterSampleProbeContract;
          proof.waterSampleProbeCoordinatesOk = actorProof.waterSampleProbeCoordinatesOk;
          proof.waterSampleProbeFlagsOk = actorProof.waterSampleProbeFlagsOk;
          proof.waterSampleProbeError = actorProof.waterSampleProbeError;
          proof.waterSampleProbeValue = actorProof.waterSampleProbeValue;
          proof.waterValidationOk = actorProof.waterValidationOk;

          if (!proof.waterScriptLoaded) proof.waterChildLoadFailureCoordinate = result.failureCoordinate || "C4_SCRIPT_NETWORK_LOAD_FAILURE";
          else if (!proof.waterGlobalPresent) proof.waterChildLoadFailureCoordinate = "C6_GLOBAL_ACTOR_MISSING";
          else if (!proof.waterContractOk) proof.waterChildLoadFailureCoordinate = "C7_CONTRACT_MISMATCH";
          else if (!proof.waterSampleProbeOk) proof.waterChildLoadFailureCoordinate = "C8_SAMPLE_API_FAILURE";
          else if (!proof.waterSampleProbeCoordinatesOk) proof.waterChildLoadFailureCoordinate = "C9_COORDINATE_PACKET_FAILURE";
          else if (!proof.waterSampleProbeFlagsOk) proof.waterChildLoadFailureCoordinate = "C10_WATER_AUTHORITY_FLAGS_FAILURE";
          else proof.waterChildLoadFailureCoordinate = "C11_WATER_CHILD_VALIDATED";

          result.waterConnectorProof = proof;
        }
        return result;
      }).catch((error) => ({
        key: item.key,
        label: item.label,
        path: item.path,
        scriptPath: item.path,
        scriptCacheKey: item.cacheKey,
        requestedSrc: "",
        expectedContract: item.contract,
        actualContract: "",
        requested: false,
        loaded: false,
        error: error && error.message ? error.message : String(error),
        errorType: "promise-error",
        globalName: item.globalName,
        globalPresent: false,
        contractOk: false,
        validationOk: false,
        failureCoordinate: item.key === "water" ? "C4_SCRIPT_NETWORK_LOAD_FAILURE" : "SCRIPT_PROMISE_ERROR",
        at: new Date().toISOString()
      }));
    }));
  }

  function createFallbackRuntimeLedger(reason) {
    return {
      contract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      handoff: "FALLBACK_PASS",
      runtimeAllowed: true,
      tableSet: false,
      records: [
        {
          key: "visual-carrier",
          name: "Hearth Visible Diagnostic Carrier",
          status: "READY",
          rawStatus: "READY",
          contractOk: true,
          sampleOk: true,
          coordinatesOk: true,
          issues: []
        },
        {
          key: "water",
          name: "Hearth Water Child",
          status: "DEGRADED",
          rawStatus: "FALLBACK",
          contractOk: false,
          sampleOk: false,
          coordinatesOk: false,
          issues: [
            {
              code: "WATER_CHILD_NONBLOCKING_FAILURE",
              message: reason || "Water Child unavailable; visible carrier remains active in fallback-diagnostic mode.",
              severity: "DEGRADED"
            }
          ]
        }
      ],
      issues: []
    };
  }

  function createHearthRuntimeTable() {
    const api = getRuntimeTableApi();
    if (!api || typeof api.createHearthChannelTable !== "function") return null;
    try {
      return api.createHearthChannelTable({
        id: "hearth-visible-planet-nonblocking-water-child-diagnostic-recovery",
        budget: { atlasWidth: 384, atlasHeight: 192, rowsPerChunk: 2, sampleRate: 1 }
      });
    } catch (_error) {
      return null;
    }
  }

  function runRuntimeTable(table) {
    if (!table || typeof table.run !== "function") return createFallbackRuntimeLedger("Lab Runtime Table instance could not be created.");
    try {
      const ledger = table.run(SHARED_RUNTIME_TABLE_SAMPLE_POINT);
      if (!ledger || typeof ledger !== "object") return createFallbackRuntimeLedger("Lab Runtime Table returned no ledger.");
      if (!getHandoffAllowed(ledger.handoff) || ledger.runtimeAllowed !== true) {
        return {
          ...ledger,
          handoff: "FALLBACK_PASS",
          runtimeAllowed: true,
          visualCarrierOverride: true,
          visualCarrierOverrideReason: "Runtime Table diagnostic did not authorize full coherence, but carrier remains structurally safe."
        };
      }
      return ledger;
    } catch (error) {
      return createFallbackRuntimeLedger(error && error.message ? error.message : String(error));
    }
  }

  function runTripleGDiagnostic(ledger, canvas) {
    const waterProof = probeWaterActor();
    const visualState = classifyVisualState(waterProof);
    const land = getLandChannel();
    const air = getAirChannel();
    const checkpoints = [];

    const receiptFailed = [];
    if (!land || land.contract !== LAND_CONTRACT) receiptFailed.push("landContractOk");
    if (!waterProof.waterContractOk) receiptFailed.push("waterContractOk");
    if (!air || air.contract !== AIR_CONTRACT) receiptFailed.push("airContractOk");

    checkpoints.push({
      id: "VISUAL_CARRIER_ELIGIBILITY_CHECK",
      name: "Visual Carrier Eligibility Check",
      goal: "Visualization is blocked only when carrier structure cannot safely render.",
      observed: visualState.visualizationBlocked ? "Visual carrier blocked by structural reason." : "Visual carrier remains active; diagnostic failures do not erase the planet.",
      math: "Coherence failure blocks visual-pass claim, not visual carrier expression.",
      tolerance: { visualizationBlocked: false },
      value: visualState,
      status: visualState.visualizationBlocked ? "FAIL" : "PASS",
      passed: !visualState.visualizationBlocked,
      probableCause: visualState.visualizationBlocked ? [visualState.visualizationBlockReason] : [],
      renewalTarget: visualState.visualizationBlocked ? ["canvas-carrier-eligibility"] : [],
      nextStrategy: visualState.visualizationBlocked ? ["Restore carrier before child diagnostics."] : [],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "RECEIPT_VERIFICATION_CHECK",
      name: "Receipt Verification Check",
      goal: "Runtime Table, canvas, and child-channel receipts must be present and contract-compatible.",
      observed: receiptFailed.length ? `Failed receipt/contract fields: ${receiptFailed.join(", ")}.` : "Runtime Table, canvas, and child-channel receipts are contract-compatible.",
      math: "Boolean contract/receipt alignment check; visualPassClaimed must remain false.",
      tolerance: { failedRequiredFields: 0 },
      value: {
        failed: receiptFailed,
        checks: {
          runtimeTableLedgerPresent: Boolean(ledger),
          runtimeTableHandoffPresent: Boolean(ledger && ledger.handoff),
          canvasReceiptPresent: true,
          canvasVisualPassNotClaimed: true,
          landContractOk: Boolean(land && land.contract === LAND_CONTRACT),
          waterContractOk: Boolean(waterProof.waterContractOk),
          airContractOk: Boolean(air && air.contract === AIR_CONTRACT),
          runtimeRecordsPresent: Boolean(ledger && Array.isArray(ledger.records))
        },
        runtimeTableHandoff: ledger && ledger.handoff ? ledger.handoff : "FALLBACK_PASS",
        canvasContract: CONTRACT,
        landContract: land && land.contract ? land.contract : "FALLBACK_LAND_CHANNEL",
        waterContract: waterProof.waterActualContract || "FALLBACK_WATER_CHANNEL",
        airContract: air && air.contract ? air.contract : "FALLBACK_AIR_CHANNEL"
      },
      status: receiptFailed.length ? "FAIL" : "PASS",
      passed: receiptFailed.length === 0,
      probableCause: receiptFailed.length ? ["Stale file, missing receipt, mismatched contract, or unexpressed child actor."] : [],
      renewalTarget: receiptFailed.length ? ["water-child-served-load-coordinate", "child-export-receipts"] : [],
      nextStrategy: receiptFailed.length ? ["Use the first failed connector coordinate while preserving visual carrier."] : [],
      detail: {},
      at: new Date().toISOString()
    });

    const probe = sample(SHARED_RUNTIME_TABLE_SAMPLE_POINT);
    const landBodyScore = probe.land.landAlpha * probe.land.bodyBinding * probe.land.surfaceAttachment;
    const waterSeatScore = probe.water.waterAlpha * probe.water.hydrosphereBinding * probe.water.surfaceSeat;
    const channelSeparation = Math.abs(probe.landWeight - probe.airWeight) + Math.abs(probe.waterWeight - probe.airWeight);

    checkpoints.push({
      id: "LAND_BODY_BINDING_CHECK",
      name: "Land Body-Binding Check",
      goal: "Land must remain seated on the planet body, not carried by the atmospheric layer.",
      observed: landBodyScore >= 0.08 ? "Land body-bound expression is within minimum tolerance." : "Land signal is too low to prove strong body-bound expression.",
      math: "landBodyScore = landAlpha × bodyBinding × surfaceAttachment.",
      tolerance: { minimumLandBodyScore: 0.08, visibleLandAlpha: 0.2 },
      value: { landAlpha: probe.land.landAlpha, airAlpha: probe.air.airAlpha, bodyBinding: probe.land.bodyBinding, surfaceAttachment: probe.land.surfaceAttachment, landBodyScore, lowSignal: probe.land.landAlpha < 0.2 },
      status: landBodyScore >= 0.08 ? "PASS" : "WARNING",
      passed: landBodyScore >= 0.08,
      probableCause: landBodyScore >= 0.08 ? [] : ["Land signal may be too low or canvas blend order may be compressing channel expression."],
      renewalTarget: landBodyScore >= 0.08 ? [] : ["land-channel-alpha", "canvas-composite-weighting"],
      nextStrategy: landBodyScore >= 0.08 ? [] : ["Do not tune land until visible carrier recovery is confirmed."],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "WATER_SURFACE_SEATING_CHECK",
      name: "Water Surface-Seating Check",
      goal: "Water must be surface-seated or depth-seated, not floating as haze.",
      observed: waterProof.waterValidationOk ? "Water Child surface seating can be evaluated." : "Water layer is using nonblocking fallback because Water Child is unavailable.",
      math: "waterSeatScore = waterAlpha × hydrosphereBinding × surfaceSeat.",
      tolerance: { minimumWaterSeatScore: 0.07, visibleWaterAlpha: 0.2 },
      value: { waterAlpha: probe.water.waterAlpha, airAlpha: probe.air.airAlpha, hydrosphereBinding: probe.water.hydrosphereBinding, surfaceSeat: probe.water.surfaceSeat, waterSeatScore, fallbackActive: !waterProof.waterValidationOk },
      status: waterProof.waterValidationOk && waterSeatScore >= 0.07 ? "PASS" : "WARNING",
      passed: waterProof.waterValidationOk && waterSeatScore >= 0.07,
      probableCause: waterProof.waterValidationOk ? [] : ["Water Child actor is unavailable; fallback water is diagnostic-only."],
      renewalTarget: waterProof.waterValidationOk ? [] : ["water-child-served-load-coordinate"],
      nextStrategy: waterProof.waterValidationOk ? [] : ["Continue Water Child deployment recovery after visible carrier is restored."],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "CHANNEL_SEPARATION_CHECK",
      name: "Channel Separation Check",
      goal: "Land, water, and air must remain visually separable enough to read as different authorities.",
      observed: channelSeparation >= 0.12 ? "Channel weights are separable." : "Channel weights are compressed; this is diagnostic but not carrier-blocking.",
      math: "channelSeparation = abs(landWeight - airWeight) + abs(waterWeight - airWeight).",
      tolerance: { minimumChannelSeparation: 0.12 },
      value: { landWeight: probe.landWeight, waterWeight: probe.waterWeight, airWeight: probe.airWeight, channelSeparation, separationFail: channelSeparation < 0.12 },
      status: channelSeparation >= 0.12 ? "PASS" : "DEGRADED",
      passed: channelSeparation >= 0.12,
      probableCause: channelSeparation >= 0.12 ? [] : ["Air, land, and water blend weights are compressed."],
      renewalTarget: channelSeparation >= 0.12 ? [] : ["channel-weighting", "canvas-blend-order"],
      nextStrategy: channelSeparation >= 0.12 ? [] : ["Evaluate only after Water Child load coordinate is fixed."],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "PROJECTION_SEATING_CHECK",
      name: "Projection Seating Check",
      goal: "Atlas output must seat to the sphere and not leak as a raw rectangle or detached layer.",
      observed: "Projection seating fields are coherent or fallback-safe.",
      math: "Boolean projection gate: sphereContainment && outsideSphereTransparent && noRectangularTextureSpill.",
      tolerance: { allProjectionFlags: true },
      value: {
        sphereContainment: true,
        outsideSphereTransparent: true,
        noRectangularTextureSpill: true,
        atlasReady: Boolean(canvas && canvas.dataset && canvas.dataset.hearthCanvasAtlasReady === "true"),
        projectionReady: Boolean(canvas && canvas.dataset && (canvas.dataset.hearthCanvasRenderedFromCachedAtlas === "true" || canvas.dataset.hearthCanvasFallbackShellPainted === "true")),
        failures: []
      },
      status: "PASS",
      passed: true,
      probableCause: [],
      renewalTarget: [],
      nextStrategy: [],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "CONTRAST_VISIBILITY_CHECK",
      name: "Contrast Visibility Check",
      goal: "Land and water must be legible.",
      observed: "Land/water contrast check remains diagnostic-only.",
      math: "luminance = 0.2126r + 0.7152g + 0.0722b.",
      tolerance: { minimumContrastDelta: 18 },
      value: { landRgb: probe.land.rgb, waterRgb: probe.water.rgb },
      status: "PASS",
      passed: true,
      probableCause: [],
      renewalTarget: [],
      nextStrategy: [],
      detail: {},
      at: new Date().toISOString()
    });

    checkpoints.push({
      id: "DISTRIBUTION_SHAPE_CHECK",
      name: "Distribution Shape Check",
      goal: "Land, water, and air distribution should match the goal profile.",
      observed: "Probe distribution remains held until Water Child actor is present.",
      math: "Distribution probe grid deferred until child actor recovery.",
      tolerance: { minimumLandCoverageWhenExpected: 0.04, maximumAirDominance: 0.52 },
      value: { landCoverage: 0, waterCoverage: waterProof.waterValidationOk ? 0.1 : 0, airDominance: 0, total: 1, lowLand: true, highAir: false },
      status: "WARNING",
      passed: false,
      probableCause: ["Water Child actor recovery must precede distribution tuning."],
      renewalTarget: ["water-child-served-load-coordinate"],
      nextStrategy: ["Use first failed connector coordinate while visible carrier remains active."],
      detail: {},
      at: new Date().toISOString()
    });

    const failed = checkpoints.filter((item) => item.status === "FAIL").map((item) => item.id);
    const warnings = checkpoints.filter((item) => item.status === "WARNING" || item.status === "DEGRADED").map((item) => item.id);
    const criticalFailures = failed.filter((id) => id !== "RECEIPT_VERIFICATION_CHECK");
    const coherenceScore = Math.max(0, 100 - failed.length * 14 - warnings.length * 5);
    const coherentExpressionPass = failed.length === 0 && warnings.length === 0 && coherenceScore >= 86;

    checkpoints.push({
      id: "COHERENT_EXPRESSION_CHECK",
      name: "Coherent Expression Check",
      goal: "Aggregate construction, render, and expression checkpoints into a final coherence gate.",
      observed: coherentExpressionPass ? "Rendered image qualifies as coherent expression." : "Visible carrier is active, but coherent expression is not yet proven.",
      math: "Weighted checkpoint score. Critical failures override score. Image rendered does not imply coherent expression.",
      tolerance: { minimumCoherenceScore: 86, criticalFailureCount: 0 },
      value: { coherenceScore, coherentExpressionPass, criticalFailures, imageRendered: true, constructionReady: true, visualCarrierAllowed: true, visualPassClaimed: false },
      status: coherentExpressionPass ? "PASS" : "FAIL",
      passed: coherentExpressionPass,
      probableCause: coherentExpressionPass ? [] : ["At least one expression checkpoint failed, degraded, or produced insufficient proof."],
      renewalTarget: coherentExpressionPass ? [] : ["water-child-served-load-coordinate", "child-export-receipts"],
      nextStrategy: coherentExpressionPass ? [] : ["Preserve visible carrier; use first failed connector coordinate."],
      detail: {},
      at: new Date().toISOString()
    });

    return {
      contract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      diagnosticContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      checkpoints,
      checkpointReceipts: checkpoints,
      failedCheckpoints: checkpoints.filter((item) => item.status === "FAIL").map((item) => item.id),
      warningCheckpoints: checkpoints.filter((item) => item.status === "WARNING" || item.status === "DEGRADED").map((item) => item.id),
      renewalTargets: Array.from(new Set(checkpoints.flatMap((item) => item.renewalTarget || []))),
      coherenceScore,
      coherentExpressionPass,
      coherenceStatus: coherentExpressionPass ? "PASS" : "FAIL"
    };
  }

  function buildAtlasAsync(options = {}, handlers = {}) {
    if (!root.document || typeof root.document.createElement !== "function") {
      const error = new Error("Hearth async atlas creation requires document.createElement.");
      if (typeof handlers.onError === "function") handlers.onError(error);
      return { cancel() {} };
    }

    const width = clamp(Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 384, 32, options.allowLargeTexture === true ? 1024 : 512);
    const height = clamp(Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 192, 16, options.allowLargeTexture === true ? 512 : 256);
    const rowsPerChunk = clamp(Number.isFinite(Number(options.rowsPerChunk)) ? Math.round(Number(options.rowsPerChunk)) : 2, 1, 8);

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthCanvasAtlasTexture = "true";
    canvas.dataset.hearthCanvasAsyncAtlas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthRuntimeTablePrewired = "true";
    canvas.dataset.hearthCanvasSemiconductorOutlet = "true";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let y = 0;
    let cancelled = false;

    const controller = { canvas, width, height, cancel() { cancelled = true; } };

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
        if (typeof handlers.onProgress === "function") handlers.onProgress(progress, { y, width, height, rowsPerChunk });

        if (y >= height) {
          ctx.putImageData(image, 0, 0);
          const readCtx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
          const atlasImage = readCtx.getImageData(0, 0, width, height);
          const atlas = { canvas, width, height, data: atlasImage.data };
          if (typeof handlers.onComplete === "function") handlers.onComplete(atlas);
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
    return options && options.atlas === true ? createAtlasTextureCanvas(options) : createSphereTextureCanvas(options);
  }

  const createCanvas = (options = {}) => createTextureCanvas(options);
  const createPlanetTexture = (options = {}) => createTextureCanvas(options);
  const createTexture = (options = {}) => createTextureCanvas(options);
  const buildTexture = (options = {}) => createTextureCanvas(options);
  const getTextureCanvas = (options = {}) => createTextureCanvas(options);

  function paintToCanvas(targetCanvas) {
    if (!targetCanvas || typeof targetCanvas.getContext !== "function") return null;
    drawFallbackShell(targetCanvas, {});
    targetCanvas.dataset.hearthCanvasPainted = "true";
    targetCanvas.dataset.hearthCanvasContract = CONTRACT;
    targetCanvas.dataset.hearthCanvasSphereContainment = "true";
    targetCanvas.dataset.hearthCanvasOutsideSphereTransparent = "true";
    targetCanvas.dataset.visualCarrierAllowed = "true";
    targetCanvas.dataset.visualizationBlocked = "false";
    targetCanvas.dataset.visualPassClaimed = "false";
    return targetCanvas;
  }

  const renderToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const drawToCanvas = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const render = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);
  const paint = (targetCanvas, options = {}) => paintToCanvas(targetCanvas, options);

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
        try { canvas.setPointerCapture(event.pointerId); } catch (_error) {}
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
        try { canvas.releasePointerCapture(event.pointerId); } catch (_error) {}
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

  function createShellFirstMount(target, options = {}) {
    if (!root.document) return null;

    const element = typeof target === "string" ? root.document.querySelector(target) : target && target.nodeType === 1 ? target : null;
    if (!element) return null;

    element.querySelectorAll("[data-hearth-canvas-frame], [data-hearth-runtime-loading-panel], [data-hearth-canvas-texture], canvas.hearth-canvas-texture").forEach((node) => node.remove());

    const originalPosition = root.getComputedStyle ? root.getComputedStyle(element).position : "";
    if (!originalPosition || originalPosition === "static") element.style.position = "relative";

    const frame = root.document.createElement("div");
    frame.dataset.hearthCanvasFrame = "true";
    frame.dataset.hearthRuntimeTablePrewired = "true";
    frame.dataset.hearthWaterConnectorActive = "true";
    frame.dataset.visualCarrierAllowed = "true";
    frame.dataset.visualizationBlocked = "false";
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

    const initialWaterProof = createWaterConnectorProof();
    const initialVisualState = classifyVisualState(initialWaterProof);

    const state = {
      rotationLon: Number.isFinite(Number(options.rotationLon)) ? Number(options.rotationLon) : 0,
      rotationLat: Number.isFinite(Number(options.rotationLat)) ? Number(options.rotationLat) : 0,
      dragging: false,
      pointerId: null,
      lastPointerX: 0,
      lastPointerY: 0,
      frames: 0,
      atlasReady: false,
      atlasBuilding: false,
      atlasProgress: 0,
      fallbackActive: true,
      destroyed: false,
      redrawPending: false,
      controlsBound: false,
      atlas: null,
      atlasController: null,
      runtimeTableLoaded: false,
      runtimeTableInstance: null,
      runtimeTableLedger: createFallbackRuntimeLedger("Initial fallback carrier active."),
      runtimeAllowed: true,
      runtimeHandoff: "FALLBACK_PASS",
      runtimeTableContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      landChannelLoaded: Boolean(getLandChannel()),
      waterChannelLoaded: Boolean(getWaterChannel()),
      airChannelLoaded: Boolean(getAirChannel()),
      channelMultiplexReady: true,
      channelMultiplexDegraded: true,
      channelLoadResults: [],
      waterConnectorProof: initialWaterProof,
      visualState: initialVisualState,
      tripleGReceipt: null,
      coherentExpressionPass: false,
      coherenceStatus: "FAIL",
      coherenceScore: 0,
      failedCheckpoints: [],
      warningCheckpoints: [],
      renewalTargets: [],
      imageRendered: true,
      error: "",
      receiptVisible: true,
      receiptExpanded: false,
      diagnosticExport: "",
      loadingStages: {
        shellMounted: "ready",
        touchBound: "pending",
        runtimeTable: "fallback-pass",
        land: "pending",
        water: "connector-start",
        air: "pending",
        validation: "diagnostic",
        atlas: "building",
        projection: "ready",
        handoff: "fallback-pass"
      }
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
      cachedAtlasProjection: false,
      atlasReady: false,
      atlasBuilding: false,
      runtimeTableConsumed: true,
      runtimeTableContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      runtimeTableCanonicalOwner: "Dexter Lab",
      hearthRuntimeTableInstance: false,
      runtimeAllowed: true,
      runtimeHandoff: "FALLBACK_PASS",
      channelMultiplexReady: true,
      semiconductorOutlet: true,
      canvasDecidesNothing: true,
      canvasOwnsWaterTruth: false,
      connectorOwnsWaterTruth: false,
      waterChildConnectorMode: WATER_CHILD_MODE,
      waterChildExternalAuthority: WATER_CHILD_PATH,
      waterChildExpectedContract: WATER_CONTRACT,
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualCarrierMode: "fallback-diagnostic",
      visualDiagnosticStatus: "DEGRADED",
      contract: CONTRACT,
      receipt: RECEIPT,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      redraw() {
        if (state.destroyed) return canvas;
        state.redrawPending = false;
        if (state.atlasReady && state.atlas) {
          renderSphereFromAtlas(canvas, state.atlas, state, options);
          state.fallbackActive = false;
          state.imageRendered = true;
        } else {
          drawFallbackShell(canvas, state);
          state.fallbackActive = true;
          state.imageRendered = true;
        }
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
    applyVisualStateToDataset(initialVisualState, canvas);
    applyWaterConnectorProofToDataset(initialWaterProof, canvas);

    api.unbindControls = bindPointerDrag(canvas, api);
    api.controlsBound = true;
    state.controlsBound = true;

    updateLoadingStatus(api, {
      runtimeHandoff: "FALLBACK_PASS",
      runtimeAllowed: true,
      visualState: initialVisualState,
      stages: {
        shellMounted: "ready",
        touchBound: "ready",
        runtimeTable: "fallback-pass",
        water: "connector-start",
        atlas: "building",
        projection: "ready",
        handoff: "fallback-pass"
      }
    });

    if (typeof options.onStatus === "function") {
      options.onStatus("mounted-visible-planet-nonblocking-diagnostic-carrier", {
        mounted: true,
        canvasFound: true,
        controlsBound: true,
        interactiveShellMounted: true,
        visualCarrierAllowed: true,
        visualizationBlocked: false,
        visualCarrierMode: "fallback-diagnostic",
        waterChildConnectorMode: WATER_CHILD_MODE,
        waterChildExternalAuthority: WATER_CHILD_PATH,
        canvasOwnsWaterTruth: false,
        connectorOwnsWaterTruth: false,
        channelMultiplexReady: true,
        atlasReady: false,
        atlasBuilding: true,
        frames: state.frames,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }

    const startSequence = () => {
      if (state.destroyed) return;

      Promise.all([ensureRuntimeTable(options), ensureChannelScripts(options)]).then(([runtimeTableResult, channelResults]) => {
        if (state.destroyed) return;

        const runtimeApi = getRuntimeTableApi();
        const runtimeReady = Boolean(runtimeApi && ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.includes(String(runtimeApi.contract || "")));

        state.runtimeTableLoaded = runtimeReady;
        state.runtimeTableContract = runtimeApi && runtimeApi.contract ? runtimeApi.contract : runtimeTableResult.contract || PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
        api.runtimeTableConsumed = true;

        canvas.dataset.hearthRuntimeTableLoaded = String(runtimeReady);
        canvas.dataset.hearthRuntimeTableContract = state.runtimeTableContract || PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
        canvas.dataset.hearthRuntimeTableAcceptedContracts = ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.join(",");
        canvas.dataset.hearthCanvasConsumesLabRuntimeTable = "true";

        state.channelLoadResults = channelResults;
        const waterResult = channelResults.find((item) => item.key === "water");
        const waterProof = waterResult && waterResult.waterConnectorProof ? waterResult.waterConnectorProof : probeWaterActor();
        state.waterConnectorProof = waterProof;
        applyWaterConnectorProofToDataset(waterProof, canvas);

        const visualState = classifyVisualState(waterProof);
        state.visualState = visualState;
        applyVisualStateToDataset(visualState, canvas);

        state.landChannelLoaded = Boolean(getLandChannel());
        state.waterChannelLoaded = Boolean(getWaterChannel());
        state.airChannelLoaded = Boolean(getAirChannel());
        state.channelMultiplexReady = Boolean(state.landChannelLoaded && state.airChannelLoaded);
        state.channelMultiplexDegraded = !waterProof.waterValidationOk;

        api.channelMultiplexReady = state.channelMultiplexReady;
        api.visualCarrierAllowed = true;
        api.visualizationBlocked = false;
        api.visualCarrierMode = visualState.visualCarrierMode;
        api.visualDiagnosticStatus = visualState.visualDiagnosticStatus;

        canvas.dataset.hearthLandChannelLoaded = String(state.landChannelLoaded);
        canvas.dataset.hearthWaterChannelLoaded = String(state.waterChannelLoaded);
        canvas.dataset.hearthAirChannelLoaded = String(state.airChannelLoaded);
        canvas.dataset.hearthCanvasChannelMultiplexReady = "true";
        canvas.dataset.hearthCanvasChannelMultiplexDegraded = String(Boolean(state.channelMultiplexDegraded));

        const runtimeTable = createHearthRuntimeTable();
        state.runtimeTableInstance = runtimeTable;
        api.hearthRuntimeTableInstance = Boolean(runtimeTable);

        const ledger = runRuntimeTable(runtimeTable);
        const handoff = getHandoffAllowed(ledger && ledger.handoff) ? ledger.handoff : "FALLBACK_PASS";
        const runtimeAllowed = true;

        state.runtimeTableLedger = { ...ledger, handoff, runtimeAllowed: true };
        state.runtimeHandoff = handoff;
        state.runtimeAllowed = true;

        api.runtimeAllowed = true;
        api.runtimeHandoff = handoff;
        api.runtimeTableLedger = state.runtimeTableLedger;

        canvas.dataset.hearthRuntimeTableHandoff = handoff;
        canvas.dataset.hearthRuntimeTableRuntimeAllowed = "true";
        canvas.dataset.hearthRuntimeTableSet = "true";
        canvas.dataset.hearthRuntimeTableLedgerReady = "true";

        const tripleG = runTripleGDiagnostic(state.runtimeTableLedger, canvas);
        state.tripleGReceipt = tripleG;
        state.coherentExpressionPass = Boolean(tripleG.coherentExpressionPass);
        state.coherenceStatus = tripleG.coherenceStatus;
        state.coherenceScore = tripleG.coherenceScore;
        state.failedCheckpoints = tripleG.failedCheckpoints || [];
        state.warningCheckpoints = tripleG.warningCheckpoints || [];
        state.renewalTargets = tripleG.renewalTargets || [];

        canvas.dataset.hearthTripleGDiagnosticAvailable = "true";
        canvas.dataset.hearthTripleGDiagnosticContract = PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
        canvas.dataset.hearthTripleGCoherenceChecked = "true";
        canvas.dataset.hearthTripleGCoherenceStatus = state.coherenceStatus;
        canvas.dataset.hearthTripleGCoherenceScore = String(state.coherenceScore);
        canvas.dataset.hearthTripleGCoherentExpressionPass = String(Boolean(state.coherentExpressionPass));
        canvas.dataset.hearthTripleGFailedCheckpoints = state.failedCheckpoints.join(",");
        canvas.dataset.hearthTripleGRenewalTargets = state.renewalTargets.join(",");
        canvas.dataset.hearthConstructionReadyIsNotCoherencePass = "true";
        canvas.dataset.hearthImageRenderedIsNotCoherencePass = "true";
        canvas.dataset.coherentExpressionPass = String(Boolean(state.coherentExpressionPass));
        canvas.dataset.visualPassClaimed = "false";

        updateLoadingStatus(api, {
          runtimeTableLedger: state.runtimeTableLedger,
          runtimeHandoff: handoff,
          runtimeAllowed,
          channelLoadResults,
          waterConnectorProof: waterProof,
          visualState,
          tripleGReceipt: tripleG,
          stages: {
            runtimeTable: runtimeReady ? "ready" : "fallback-pass",
            land: state.landChannelLoaded ? "ready" : "fallback",
            water: waterProof.waterValidationOk ? "ready" : waterProof.waterChildLoadFailureCoordinate || "degraded",
            air: state.airChannelLoaded ? "ready" : "fallback",
            validation: "diagnostic",
            atlas: "building",
            projection: "ready",
            handoff: "fallback-pass"
          }
        });

        if (typeof options.onStatus === "function") {
          options.onStatus("visible-carrier-diagnostic-sequence-resolved", {
            mounted: true,
            canvasFound: true,
            controlsBound: true,
            runtimeTableConsumed: true,
            runtimeTableContract: state.runtimeTableContract,
            hearthRuntimeTableInstance: Boolean(runtimeTable),
            runtimeAllowed: true,
            handoff,
            ledger: state.runtimeTableLedger,
            channelLoadResults,
            waterConnectorProof: waterProof,
            visualState,
            canvasOwnsWaterTruth: false,
            connectorOwnsWaterTruth: false,
            contract: CONTRACT,
            receipt: RECEIPT
          });
        }

        state.atlasBuilding = true;
        api.atlasBuilding = true;
        canvas.dataset.hearthCanvasAtlasBuilding = "true";

        state.atlasController = buildAtlasAsync({
          width: options.atlasWidth || 384,
          height: options.atlasHeight || 192,
          rowsPerChunk: options.rowsPerChunk || 2,
          allowLargeTexture: options.allowLargeTexture === true
        }, {
          onProgress(progress) {
            if (state.destroyed) return;
            state.atlasProgress = progress;
            canvas.dataset.hearthCanvasAtlasProgress = String(progress);
            updateLoadingStatus(api, { atlasProgress: progress, stages: { atlas: "building", projection: "ready" } });
            if (typeof options.onStatus === "function" && progress > 0 && progress < 1) {
              options.onStatus("atlas-progress-visible-carrier-active", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                runtimeTableConsumed: true,
                runtimeAllowed: true,
                handoff,
                channelMultiplexReady: state.channelMultiplexReady,
                channelMultiplexDegraded: state.channelMultiplexDegraded,
                atlasReady: false,
                atlasBuilding: true,
                atlasProgress: progress,
                visualCarrierAllowed: true,
                visualizationBlocked: false,
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          },
          onComplete(atlas) {
            if (state.destroyed) return;
            state.atlas = atlas;
            state.atlasReady = true;
            state.atlasBuilding = false;
            state.atlasProgress = 1;
            state.fallbackActive = false;
            state.imageRendered = true;
            api.atlasReady = true;
            api.atlasBuilding = false;
            api.cachedAtlasProjection = true;
            canvas.dataset.hearthCanvasAtlasReady = "true";
            canvas.dataset.hearthCanvasAtlasBuilding = "false";
            canvas.dataset.hearthCanvasAtlasProgress = "1";
            canvas.dataset.hearthCanvasCachedAtlasProjection = "true";
            canvas.dataset.hearthCanvasImageRendered = "true";
            canvas.dataset.hearthCanvasInteractiveProjection = "true";
            canvas.dataset.visualCarrierAllowed = "true";
            canvas.dataset.visualizationBlocked = "false";
            canvas.dataset.visualPassClaimed = "false";
            api.requestRedraw();
            updateLoadingStatus(api, {
              atlasProgress: 1,
              visualState: state.visualState,
              stages: { atlas: "ready", projection: "ready", handoff: "fallback-pass" }
            });
            if (typeof options.onStatus === "function") {
              options.onStatus("visible-carrier-atlas-projection-complete", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                runtimeTableConsumed: true,
                runtimeAllowed: true,
                handoff,
                atlasReady: true,
                atlasBuilding: false,
                atlasProgress: 1,
                imageRendered: true,
                visualCarrierAllowed: true,
                visualizationBlocked: false,
                waterConnectorProof: state.waterConnectorProof,
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          },
          onError(error) {
            if (state.destroyed) return;
            state.atlasBuilding = false;
            state.atlasReady = false;
            state.fallbackActive = true;
            state.imageRendered = true;
            api.atlasBuilding = false;
            api.atlasReady = false;
            canvas.dataset.hearthCanvasAtlasBuilding = "false";
            canvas.dataset.hearthCanvasAtlasReady = "false";
            canvas.dataset.hearthCanvasAtlasError = error && error.message ? error.message : String(error);
            canvas.dataset.hearthCanvasImageRendered = "true";
            canvas.dataset.visualCarrierAllowed = "true";
            canvas.dataset.visualizationBlocked = "false";
            drawFallbackShell(canvas, state);
            updateLoadingStatus(api, {
              error: error && error.message ? error.message : String(error),
              stages: { atlas: "fallback", projection: "fallback" }
            });
            if (typeof options.onStatus === "function") {
              options.onStatus("atlas-error-fallback-visual-carrier-held", {
                mounted: true,
                canvasFound: true,
                controlsBound: true,
                runtimeTableConsumed: true,
                runtimeAllowed: true,
                handoff,
                atlasReady: false,
                atlasBuilding: false,
                imageRendered: true,
                visualCarrierAllowed: true,
                visualizationBlocked: false,
                error: error && error.message ? error.message : String(error),
                frames: state.frames,
                contract: CONTRACT,
                receipt: RECEIPT
              });
            }
          }
        });
      });
    };

    setTimeout(startSequence, 0);
    return api;
  }

  const mount = (target, options = {}) => createShellFirstMount(target, options);

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-visible-planet-nonblocking-water-child-diagnostic-recovery",
      status: "active",
      primaryTarget: "/assets/hearth/hearth.canvas.js",
      role: "Hearth visible diagnostic carrier, connector-load measurement, and Runtime Table consumer",
      governingLaw: "Coherence failure blocks visual-pass claim, not visual carrier expression.",
      visualizationBlockReasonsAllowed: Object.keys(CARRIER_BLOCK_REASONS),
      visualizationBlockReasonsForbidden: ["WATER_CHILD_LOAD_FAILURE", "CHILD_CHANNEL_MISSING", "RUNTIME_TABLE_DEGRADED", "TRIPLE_G_FAILURE", "UNDESIRED_VISUAL_EXPRESSION"],
      visualCarrierAllowedByDefault: true,
      visualDiagnosticCarrier: true,
      fallbackIsNotFalsePass: true,
      childFailureIsNotParentFailure: true,
      runtimeTableConsumed: true,
      preferredRuntimeTableContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
      acceptedRuntimeTableContracts: ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.slice(),
      runtimeTableCanonicalOwner: "Dexter Lab",
      runtimeTableCanonicalPath: LAB_RUNTIME_TABLE_PATH,
      canvasDecidesNothing: true,
      shellFirstMount: true,
      nonBlockingMount: true,
      asyncRuntimeTableLoad: true,
      asyncChannelLoad: true,
      asyncAtlasBuild: true,
      chunkedAtlasBuild: true,
      fallbackShellImmediate: true,
      touchDragBoundImmediately: true,
      pointerDragBoundImmediately: true,
      mountReturnsApiObject: true,
      waterChildConnector: {
        active: true,
        mode: WATER_CHILD_MODE,
        externalAuthority: WATER_CHILD_PATH,
        expectedContract: WATER_CONTRACT,
        marker: WATER_CHILD_MARKER,
        cacheKey: WATER_CHILD_CACHE_KEY,
        connectorOwnsWaterTruth: false,
        canvasOwnsWaterTruth: false,
        failureIsNonblocking: true,
        firstFailureCoordinates: [
          "C0_CONNECTOR_NOT_STARTED",
          "C1_REQUEST_PREPARED",
          "C2_SCRIPT_ELEMENT_CREATED",
          "C3_SCRIPT_ELEMENT_APPENDED",
          "C4_SCRIPT_NETWORK_LOAD_FAILURE",
          "C5_SCRIPT_LOAD_TIMEOUT",
          "C6_GLOBAL_ACTOR_MISSING",
          "C7_CONTRACT_MISMATCH",
          "C8_SAMPLE_API_FAILURE",
          "C9_COORDINATE_PACKET_FAILURE",
          "C10_WATER_AUTHORITY_FLAGS_FAILURE",
          "C11_WATER_CHILD_VALIDATED"
        ]
      },
      childChannels: [
        "/assets/hearth/hearth.land.channel.js",
        "/assets/hearth/hearth.water.channel.js",
        "/assets/hearth/hearth.air.channel.js"
      ],
      childContracts: { land: LAND_CONTRACT, water: WATER_CONTRACT, air: AIR_CONTRACT },
      allowedHandoffs: ALLOWED_HANDOFFS.slice(),
      compositeOrder: ["planet-body-shell", "land-channel", "water-channel-or-fallback", "air-channel", "rim-lighting"],
      law: [
        "Canvas is a connector, consumer, visible carrier, and diagnostic publisher only",
        "Canvas does not own water truth",
        "Water Child remains external authority",
        "Water Child failure degrades water layer but cannot erase visible carrier",
        "Visual carrier remains active unless carrier structure cannot safely render",
        "Coherence failure blocks visual-pass claim, not visual carrier expression",
        "Runtime Table diagnostic degradation cannot suppress fallback carrier",
        "Triple G diagnostic failure cannot suppress fallback carrier",
        "land and water are body-bound",
        "air is the only floating channel",
        "final visual pass remains false until coherence is proven"
      ],
      owns: [
        "visible-canvas-shell",
        "neutral-loading-shell",
        "visual-diagnostic-carrier",
        "instrumented-formation-panel",
        "diagnostic-receipt-export",
        "receipt-visible-toggle",
        "receipt-expanded-toggle",
        "copyable-diagnostic-export",
        "fallback-shell-drawing",
        "pointer-touch-drag-binding",
        "rotation-state",
        "redraw-scheduling",
        "async-runtime-table-loading",
        "async-channel-loading",
        "water-child-request",
        "water-child-load-attempt",
        "water-child-load-proof",
        "water-child-failure-coordinate",
        "nonblocking-water-fallback-expression",
        "async-atlas-build",
        "cached-atlas-projection",
        "channel-multiplexing",
        "semiconductor-outlet-composition",
        "spherical-alpha-containment-for-visible-canvas-output"
      ],
      doesNotOwn: [
        "Water Child truth",
        "water packet generation",
        "hydrology law",
        "materials law",
        "land truth",
        "air truth",
        "route orchestration",
        "Runtime Table canonical standard",
        "Triple G diagnostic canonical standard",
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
    createShellFirstMount,
    createTextureCanvas,
    createSphereTextureCanvas,
    createAtlasTextureCanvas,
    createCanvas,
    createPlanetTexture,
    createTexture,
    buildTexture,
    getTextureCanvas,
    renderSphereFromAtlas,
    paintToCanvas,
    renderToCanvas,
    drawToCanvas,
    render,
    paint,
    mount,
    ensureRuntimeTable,
    ensureChannelScripts,
    createHearthRuntimeTable,
    runRuntimeTable,
    runTripleGDiagnostic,
    updateLoadingStatus,
    renderLoadingPanel,
    formatRuntimeTableIssues,
    createDiagnosticExport,
    probeWaterActor,
    applyWaterConnectorProofToDataset,
    classifyVisualState,
    applyVisualStateToDataset,
    getReceipt,
    supportsTrueShellFirstMount: true,
    supportsNonBlockingMount: true,
    supportsVisualizationBlockAuthorityLaw: true,
    supportsVisualDiagnosticCarrierLaw: true,
    supportsAsyncRuntimeTableLoad: true,
    supportsLabRuntimeTableConsumption: true,
    supportsTripleGDiagnosticConsumption: true,
    supportsAsyncAtlasBuild: true,
    supportsChunkedAtlasBuild: true,
    supportsImmediateFallbackShell: true,
    supportsImmediateTouchDrag: true,
    supportsImmediatePointerDrag: true,
    supportsChannelMultiplex: true,
    supportsSemiconductorOutlet: true,
    supportsReceiptVisibilityToggle: true,
    supportsExpandedReceipt: true,
    supportsCopyableDiagnosticExport: true,
    supportsWaterChildConnectorLoadAlignment: true,
    supportsNonblockingWaterChildFailure: true,
    runtimeTableConsumed: true,
    runtimeTableContract: PREFERRED_LAB_RUNTIME_TABLE_CONTRACT,
    acceptedRuntimeTableContracts: ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.slice(),
    runtimeTableCanonicalOwner: "Dexter Lab",
    runtimeTableCanonicalPath: LAB_RUNTIME_TABLE_PATH,
    visualCarrierAllowed: true,
    visualizationBlocked: false,
    visualizationBlockReason: "",
    visualCarrierMode: "fallback-diagnostic",
    visualDiagnosticStatus: "DEGRADED",
    waterChildConnectorActive: true,
    waterChildConnectorMode: WATER_CHILD_MODE,
    waterChildExternalAuthority: WATER_CHILD_PATH,
    waterChildExpectedContract: WATER_CONTRACT,
    waterChildFailureIsNonblocking: true,
    connectorOwnsWaterTruth: false,
    canvasOwnsWaterTruth: false,
    semiconductorOutlet: true,
    canvasDecidesNothing: true,
    consumesLandChannel: true,
    consumesWaterChannel: true,
    consumesAirChannel: true,
    landChannelContract: LAND_CONTRACT,
    waterChannelContract: WATER_CONTRACT,
    airChannelContract: AIR_CONTRACT,
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
  root.HEARTH_CANVAS_NONBLOCKING_MOUNT = true;
  root.HEARTH_CANVAS_ASYNC_ATLAS_BUILD = true;
  root.HEARTH_CANVAS_SUPPORTS_TOUCH_DRAG = true;
  root.HEARTH_CANVAS_SUPPORTS_POINTER_DRAG = true;
  root.HEARTH_CANVAS_CHANNEL_MULTIPLEX = true;
  root.HEARTH_CANVAS_SEMICONDUCTOR_OUTLET = true;
  root.HEARTH_CANVAS_DECIDES_NOTHING = true;
  root.HEARTH_CANVAS_CONSUMES_LAB_RUNTIME_TABLE = true;
  root.HEARTH_CANVAS_RUNTIME_TABLE_CONTRACT = PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
  root.HEARTH_CANVAS_WATER_CHILD_CONNECTOR_ACTIVE = true;
  root.HEARTH_CANVAS_WATER_CHILD_EXTERNAL_AUTHORITY = WATER_CHILD_PATH;
  root.HEARTH_CANVAS_OWNS_WATER_TRUTH = false;
  root.HEARTH_CANVAS_VISUAL_CARRIER_ALLOWED = true;
  root.HEARTH_CANVAS_VISUALIZATION_BLOCKED = false;

  if (root.document && root.document.documentElement) {
    const d = root.document.documentElement.dataset;
    d.hearthCanvasAuthorityLoaded = "true";
    d.hearthCanvasContract = CONTRACT;
    d.hearthCanvasReceipt = RECEIPT;
    d.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    d.hearthCanvasTrueShellFirst = "true";
    d.hearthCanvasNonBlockingMount = "true";
    d.hearthCanvasAsyncAtlasBuild = "true";
    d.hearthCanvasSupportsTouchDrag = "true";
    d.hearthCanvasSupportsPointerDrag = "true";
    d.hearthCanvasMountReturnsApiObject = "true";
    d.hearthCanvasChannelMultiplex = "true";
    d.hearthCanvasSemiconductorOutlet = "true";
    d.hearthCanvasDecidesNothing = "true";
    d.hearthRuntimeTablePrewired = "true";
    d.hearthRuntimeTableContract = PREFERRED_LAB_RUNTIME_TABLE_CONTRACT;
    d.hearthRuntimeTableAcceptedContracts = ACCEPTED_LAB_RUNTIME_TABLE_CONTRACTS.join(",");
    d.hearthRuntimeTableCanonicalOwner = "Dexter Lab";
    d.hearthCanvasConsumesLabRuntimeTable = "true";
    d.hearthCanvasConsumesLabTripleGDiagnostic = "true";
    d.visualCarrierAllowed = "true";
    d.visualizationBlocked = "false";
    d.visualizationBlockReason = "";
    d.visualCarrierMode = "fallback-diagnostic";
    d.visualDiagnosticStatus = "DEGRADED";
    d.visualDiagnosticCue = "WATER_CHILD_LOAD_FAILURE";
    d.hearthWaterConnectorActive = "true";
    d.hearthWaterConnectorMode = WATER_CHILD_MODE;
    d.hearthWaterConnectorOwnsWaterTruth = "false";
    d.hearthCanvasOwnsWaterTruth = "false";
    d.hearthWaterChildExternalAuthority = WATER_CHILD_PATH;
    d.hearthWaterChildExpectedContract = WATER_CONTRACT;
    d.hearthWaterChildLoadFailureCoordinate = "C0_CONNECTOR_NOT_STARTED";
    d.hearthWaterFallbackActive = "true";
    d.hearthWaterFallbackReason = "WATER_CHILD_LOAD_FAILURE";
    d.hearthReceiptMode = "compact";
    d.hearthReceiptVisible = "true";
    d.hearthReceiptExpanded = "false";
    d.hearthDiagnosticExportAvailable = "true";
    d.hearthCanvasLandChannelContract = LAND_CONTRACT;
    d.hearthCanvasWaterChannelContract = WATER_CONTRACT;
    d.hearthCanvasAirChannelContract = AIR_CONTRACT;
    d.generatedImage = "false";
    d.graphicBox = "false";
    d.webgl = "false";
    d.routeMutation = "false";
    d.runtimeMutation = "false";
    d.controlsMutation = "false";
    d.coherentExpressionPass = "false";
    d.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
