// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_CHILD_HYDROSPHERE_SURFACE_DEPTH_CHANNEL_TNT_v1
// Full-file replacement.
// Water Child / hydrosphere surface-depth authority only.
// Purpose:
// - Create the missing served Water Child file.
// - Export HEARTH_WATER_CHANNEL at the exact path the v4.4 canvas requests.
// - Provide coordinate-valid, contract-valid, body-bound water samples.
// - Satisfy Runtime Table child validation.
// - Give Triple G a real water child to audit.
// Does not own:
// - canvas composition
// - Runtime Table canonical standard
// - Triple G diagnostic canonical standard
// - land truth
// - air truth
// - route orchestration
// - runtime motion
// - controls
// - materials authority
// - hydrology parent law
// - elevation
// - tectonics
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_RECEIPT_v1";
  const BUILD_CONTRACT = "HEARTH_WATER_CHILD_HYDROSPHERE_SURFACE_DEPTH_CHANNEL_TNT_v1";
  const VERSION = "2026-05-29.hearth-water-child-hydrosphere-surface-depth-channel-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const COLORS = Object.freeze({
    deepOcean: [4, 16, 48],
    openWater: [7, 36, 88],
    shelf: [18, 70, 112],
    coastal: [34, 94, 124],
    lowWater: [7, 20, 38],
    foam: [116, 160, 174],
    shadow: [2, 6, 15]
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

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
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

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(uToLon(p.u), vToLat(p.v));
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3({
          x: Number(p.x),
          y: Number(p.y),
          z: Number(p.z)
        });
      }
    }

    if (args.length >= 3) {
      return normalize3({
        x: Number(args[0]),
        y: Number(args[1]),
        z: Number(args[2])
      });
    }

    if (args.length >= 2) {
      return lonLatToVector(Number(args[0]), Number(args[1]));
    }

    return lonLatToVector(0, 0);
  }

  function coordinatePacket(p) {
    const n = normalize3(p);
    const ll = vectorToLonLat(n);

    return {
      u: lonToU(ll.lon),
      v: latToV(ll.lat),
      lon: ll.lon,
      lat: ll.lat,
      x: n.x,
      y: n.y,
      z: n.z
    };
  }

  function softBand(value, center, width) {
    const d = Math.abs(Number(value) - Number(center));
    return clamp01(1 - d / Math.max(0.0001, Number(width)));
  }

  function waterPotential(coords) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    const frontalBasin = clamp01(0.42 + coords.z * 0.38);
    const equatorialSea = clamp01(0.24 + Math.cos(lat * 1.35) * 0.22);
    const westernBasin = clamp01(0.20 + Math.sin(lon * 1.15 - lat * 0.42) * 0.16);
    const easternShelf = clamp01(0.16 + Math.cos(lon * 2.05 + lat * 0.62) * 0.14);
    const polarMute = clamp01(1 - Math.abs(coords.y) * 0.24);

    const straits = clamp01(
      softBand(Math.sin(lon * 2.8 + lat * 1.1), 0.12, 0.42) * 0.13 +
        softBand(Math.cos(lon * 1.7 - lat * 1.5), -0.08, 0.36) * 0.11
    );

    return clamp01(
      (
        frontalBasin * 0.47 +
        equatorialSea * 0.20 +
        westernBasin * 0.13 +
        easternShelf * 0.10 +
        straits * 0.10
      ) * polarMute
    );
  }

  function shelfPotential(coords, waterValue) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    return clamp01(
      softBand(waterValue, 0.42, 0.26) * 0.46 +
        softBand(Math.sin(lon * 2.1 + lat * 0.75), 0.0, 0.52) * 0.18 +
        softBand(Math.cos(lon * 1.3 - lat * 1.2), 0.16, 0.48) * 0.14
    );
  }

  function shorelinePotential(coords, waterValue) {
    const lon = coords.lon * DEG;
    const lat = coords.lat * DEG;

    return clamp01(
      softBand(waterValue, 0.34, 0.14) * 0.58 +
        softBand(Math.sin(lon * 3.2 - lat * 1.4), 0.05, 0.32) * 0.16 +
        softBand(Math.cos(lon * 2.4 + lat * 1.8), -0.14, 0.30) * 0.12
    );
  }

  function classifyWater(waterAlpha, waterDepth, shelf, shoreline) {
    if (waterAlpha >= 0.72 && waterDepth >= 0.62) return "deep-ocean";
    if (waterAlpha >= 0.52) return "open-water";
    if (waterAlpha >= 0.32 || shelf >= 0.34) return "shallow-shelf";
    if (waterAlpha >= 0.16 || shoreline >= 0.26) return "coastal-boundary";
    return "low-water";
  }

  function colorForWater(depthClass, waterAlpha, shelf, shoreline) {
    let rgb = COLORS.lowWater.slice();

    if (depthClass === "deep-ocean") {
      rgb = mixColor(COLORS.openWater, COLORS.deepOcean, 0.72);
    } else if (depthClass === "open-water") {
      rgb = COLORS.openWater.slice();
    } else if (depthClass === "shallow-shelf") {
      rgb = mixColor(COLORS.openWater, COLORS.shelf, clamp01(0.42 + shelf * 0.38));
    } else if (depthClass === "coastal-boundary") {
      rgb = mixColor(COLORS.shelf, COLORS.coastal, clamp01(0.36 + shoreline * 0.42));
    } else {
      rgb = mixColor(COLORS.shadow, COLORS.lowWater, clamp01(waterAlpha * 1.8));
    }

    if (shoreline > 0.22) {
      rgb = mixColor(rgb, COLORS.foam, shoreline * 0.08);
    }

    return rgb;
  }

  function buildWaterSample(p) {
    const coords = coordinatePacket(p);
    const potential = waterPotential(coords);
    const shelf = shelfPotential(coords, potential);
    const shoreline = shorelinePotential(coords, potential);

    const waterAlpha = clamp01(
      potential * 0.80 +
        shelf * 0.12 +
        shoreline * 0.06
    );

    const waterPresence = clamp01(
      waterAlpha * 0.86 +
        potential * 0.10 +
        shoreline * 0.04
    );

    const waterDepth = clamp01(
      waterAlpha * 0.62 +
        potential * 0.22 -
        shelf * 0.08 -
        shoreline * 0.04
    );

    const waterDepthClass = classifyWater(waterAlpha, waterDepth, shelf, shoreline);
    const isVisibleWater = waterAlpha > 0.08;
    const isMajorWater = waterAlpha > 0.24;

    const hydrosphereBinding = isVisibleWater ? clamp01(0.76 + waterAlpha * 0.22) : 0.64;
    const surfaceSeat = isVisibleWater ? clamp01(0.78 + waterPresence * 0.20) : 0.62;
    const depthBinding = isVisibleWater ? clamp01(0.60 + waterDepth * 0.36) : 0.46;

    let rgb = colorForWater(waterDepthClass, waterAlpha, shelf, shoreline);
    const bodyShade = clamp01(0.72 + coords.z * 0.12 + hydrosphereBinding * 0.10);
    rgb = scaleColor(rgb, bodyShade);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      buildContract: BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-water-child-hydrosphere-surface-depth-channel",

      ...coords,

      channel: "water",
      channelClass: waterDepthClass,
      isWaterChannel: true,

      rgb,
      color: rgb,
      waterRgb: rgb,

      alpha: waterAlpha,
      waterAlpha,
      waterPresence,
      hydrosphereBinding,
      surfaceSeat,
      depthBinding,

      waterDepth,
      waterDepthClass,
      basinDepth: clamp01(waterDepth * 0.82 + potential * 0.12),
      oceanContinuity: clamp01(potential * 0.72 + waterPresence * 0.20),
      surfaceTension: clamp01(0.52 + shoreline * 0.22 + shelf * 0.08),

      shorelineBoundary: shoreline > 0.22,
      shorelineBoundaryStrength: shoreline,
      shallowShelf: shelf > 0.24,
      shallowShelfStrength: shelf,

      belowSeaLevel: isVisibleWater,
      belowSeaLevelStrength: waterPresence,
      nearSeaLevel: shoreline > 0.18 || shelf > 0.22,
      nearSeaLevelStrength: clamp01(shoreline * 0.62 + shelf * 0.28),

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      mayDefineLand: false,
      mayDefineAir: false,
      definesLandTruth: false,
      definesAirTruth: false,

      atmosphericRejection: clamp01(0.76 + waterAlpha * 0.18),
      airSuppression: clamp01(0.58 + waterPresence * 0.28),
      landRejection: clamp01(isMajorWater ? 0.62 + waterAlpha * 0.22 : 0.24 + shoreline * 0.26),

      surfaceNormalLock: true,
      coordinateLock: true,
      coordinateCompatible: true,
      vectorMagnitude: 1,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  function sample(...args) {
    return buildWaterSample(parseInput(...args));
  }

  function read(...args) {
    return sample(...args);
  }

  function sampleWater(...args) {
    return sample(...args);
  }

  function readWater(...args) {
    return sample(...args);
  }

  function waterAt(...args) {
    return sample(...args);
  }

  function getWater(...args) {
    return sample(...args);
  }

  function resolveWater(...args) {
    return sample(...args);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      buildContract: BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-water-child-hydrosphere-surface-depth-channel",
      primaryTarget: "/assets/hearth/hearth.water.channel.js",
      status: "active",
      role: "Water Child / hydrosphere surface-depth authority",
      globalExports: [
        "HEARTH_WATER_CHANNEL",
        "HearthWaterChannel",
        "HEARTH.waterChannel"
      ],
      requiredMethods: [
        "sample",
        "read",
        "getReceipt"
      ],
      aliases: [
        "sampleWater",
        "readWater",
        "waterAt",
        "getWater",
        "resolveWater"
      ],
      coordinateFields: [
        "u",
        "v",
        "lon",
        "lat",
        "x",
        "y",
        "z"
      ],
      waterFields: [
        "waterAlpha",
        "waterPresence",
        "hydrosphereBinding",
        "surfaceSeat",
        "depthBinding",
        "waterDepth",
        "waterDepthClass",
        "basinDepth",
        "oceanContinuity",
        "shorelineBoundary",
        "shorelineBoundaryStrength",
        "shallowShelf",
        "shallowShelfStrength",
        "surfaceTension"
      ],
      waterClasses: [
        "deep-ocean",
        "open-water",
        "shallow-shelf",
        "coastal-boundary",
        "low-water"
      ],
      channelTruth: {
        channel: "water",
        isWaterChannel: true,
        bodyBound: true,
        surfaceBound: true,
        floatsAboveBody: false,
        allowedToFloat: false,
        mayDefineLand: false,
        mayDefineAir: false,
        definesLandTruth: false,
        definesAirTruth: false
      },
      owns: [
        "water-presence",
        "water-alpha",
        "hydrosphere-binding",
        "surface-seat",
        "depth-binding",
        "water-depth-class",
        "basin-depth",
        "ocean-continuity",
        "shoreline-boundary-signal",
        "shallow-shelf-signal",
        "water-color-packet",
        "water-coordinate-identity"
      ],
      doesNotOwn: [
        "canvas-composition",
        "Runtime Table canonical standard",
        "Triple G diagnostic canonical standard",
        "land-truth",
        "air-truth",
        "route-orchestration",
        "runtime-motion",
        "controls",
        "materials-authority",
        "hydrology-parent-law",
        "elevation",
        "tectonics",
        "final-visual-pass-claim"
      ],
      acceptanceTarget: [
        "waterScriptLoaded true",
        "waterGlobalPresent true",
        "waterActualContract matches",
        "waterSampleProbeOk true",
        "waterSampleProbeCoordinatesOk true",
        "waterSampleProbeFlagsOk true",
        "Runtime Table water record READY",
        "RECEIPT_VERIFICATION_CHECK PASS"
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
    buildContract: BUILD_CONTRACT,
    version: VERSION,

    sample,
    read,
    sampleWater,
    readWater,
    waterAt,
    getWater,
    resolveWater,
    getReceipt,

    isWaterChannel: true,
    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,
    mayDefineLand: false,
    mayDefineAir: false,
    definesLandTruth: false,
    definesAirTruth: false,
    coordinateCompatible: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.waterChannel = api;

  root.HEARTH_WATER_CHANNEL = api;
  root.HearthWaterChannel = api;
  root.HEARTH_WATER_CHANNEL_RECEIPT = getReceipt();
  root.HEARTH_WATER_CHANNEL_CONTRACT = CONTRACT;
  root.HEARTH_WATER_CHANNEL_LOADED = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthWaterChannelLoaded = "true";
    root.document.documentElement.dataset.hearthWaterChannelContract = CONTRACT;
    root.document.documentElement.dataset.hearthWaterChannelReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthWaterChildBuildContract = BUILD_CONTRACT;
    root.document.documentElement.dataset.hearthWaterChannelCoordinates = "true";
    root.document.documentElement.dataset.hearthWaterChannelSampleReady = "true";
    root.document.documentElement.dataset.hearthWaterChannelBodyBound = "true";
    root.document.documentElement.dataset.hearthWaterChannelSurfaceBound = "true";
    root.document.documentElement.dataset.hearthWaterChannelAllowedToFloat = "false";
    root.document.documentElement.dataset.hearthWaterChannelMayDefineLand = "false";
    root.document.documentElement.dataset.hearthWaterChannelMayDefineAir = "false";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.routeMutation = "false";
    root.document.documentElement.dataset.runtimeMutation = "false";
    root.document.documentElement.dataset.controlsMutation = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
