// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_CHILD_DEPLOYMENT_COORDINATE_RECOVERY_TNT_v1
// Full-file served asset placement.
// Deployment-coordinate recovery for the Water Child.
// Purpose:
// - Prove the browser can load /assets/hearth/hearth.water.channel.js.
// - Export the expected water actor at the exact coordinate the Canvas connector requests.
// - Preserve Runtime Table expected contract: HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1.
// - Keep this file water-only.
// Does not own:
// - Canvas
// - Runtime Table
// - Triple G
// - Route controller
// - Land Child
// - Air Child
// - Hydrology source law
// - Materials source law
// - Visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const BUILD_CONTRACT = "HEARTH_WATER_CHILD_DEPLOYMENT_COORDINATE_RECOVERY_TNT_v1";
  const PREVIOUS_BUILD_CONTRACT = "HEARTH_WATER_CHILD_SERVED_ASSET_COORDINATE_AND_WATER_ONLY_SEMICONDUCTOR_TNT_v1";
  const RECEIPT = "HEARTH_WATER_CHILD_DEPLOYMENT_COORDINATE_RECOVERY_RECEIPT_v1";
  const VERSION = "2026-05-29.hearth-water-child-deployment-coordinate-recovery-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const WATER_DIRECTORY = Object.freeze([
    "hydrosphere",
    "seaLevel",
    "waterline",
    "shoreline",
    "shallowShelf",
    "oceanContinuity",
    "basinDepth",
    "submergedBlock",
    "submergedScar",
    "beachBoundary",
    "wetStoneBoundary",
    "waterMaterials",
    "waterSurfaceSeat",
    "waterDepth"
  ]);

  const REJECTION_LAWS = Object.freeze({
    hydrologyHintIsNotFinalColor: true,
    wetMaterialIsNotHydrosphere: true,
    beachShelfIsNotOpenOcean: true,
    waterlineIsNotWholeOcean: true,
    submergedScarIsNotActiveSurfaceWater: true,
    seaLevelHintIsNotFinalVisualTruth: true,
    blueColorIsNotWaterAuthority: true
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

  function normalize3(input) {
    const x = Number.isFinite(Number(input && input.x)) ? Number(input.x) : 0;
    const y = Number.isFinite(Number(input && input.y)) ? Number(input.y) : 0;
    const z = Number.isFinite(Number(input && input.z)) ? Number(input.z) : 1;
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

  function vectorToLonLat(vector) {
    const p = normalize3(vector);

    return {
      lon: Math.atan2(p.x, p.z) / DEG,
      lat: Math.asin(clamp(p.y, -1, 1)) / DEG
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

  function parseCoordinateInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const input = args[0];

      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
        const u = wrap01(input.u);
        const v = clamp(Number(input.v), 0, 1);
        const lon = uToLon(u);
        const lat = vToLat(v);
        const vector = lonLatToVector(lon, lat);

        return { u, v, lon, lat, x: vector.x, y: vector.y, z: vector.z };
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        const lon = Number(input.lon);
        const lat = clamp(Number(input.lat), -90, 90);
        const vector = lonLatToVector(lon, lat);

        return { u: lonToU(lon), v: latToV(lat), lon, lat, x: vector.x, y: vector.y, z: vector.z };
      }

      if (Number.isFinite(Number(input.longitude)) && Number.isFinite(Number(input.latitude))) {
        const lon = Number(input.longitude);
        const lat = clamp(Number(input.latitude), -90, 90);
        const vector = lonLatToVector(lon, lat);

        return { u: lonToU(lon), v: latToV(lat), lon, lat, x: vector.x, y: vector.y, z: vector.z };
      }

      if (
        Number.isFinite(Number(input.x)) &&
        Number.isFinite(Number(input.y)) &&
        Number.isFinite(Number(input.z))
      ) {
        const vector = normalize3(input);
        const ll = vectorToLonLat(vector);

        return { u: lonToU(ll.lon), v: latToV(ll.lat), lon: ll.lon, lat: ll.lat, x: vector.x, y: vector.y, z: vector.z };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);

      return { u: lonToU(ll.lon), v: latToV(ll.lat), lon: ll.lon, lat: ll.lat, x: vector.x, y: vector.y, z: vector.z };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = clamp(Number(args[1]), -90, 90);
      const vector = lonLatToVector(lon, lat);

      return { u: lonToU(lon), v: latToV(lat), lon, lat, x: vector.x, y: vector.y, z: vector.z };
    }

    return { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 };
  }

  function waterSignal(coordinate) {
    const equatorialPull = Math.cos(coordinate.lat * DEG) * 0.5 + 0.5;
    const basinWave = Math.sin((coordinate.lon * 1.3 + 41) * DEG) * 0.5 + 0.5;
    const shelfWave = Math.cos((coordinate.lon * 0.8 - coordinate.lat * 1.5) * DEG) * 0.5 + 0.5;

    const basinDepth = clamp01(0.28 + equatorialPull * 0.30 + basinWave * 0.24);
    const shallowShelfStrength = clamp01(1 - Math.abs(shelfWave - 0.52) * 2.2);
    const waterlineStrength = clamp01(1 - Math.abs(basinDepth - 0.42) * 3.0);
    const shorelineBoundaryStrength = clamp01(waterlineStrength * 0.84);
    const oceanContinuity = clamp01(basinDepth * 0.78 + shallowShelfStrength * 0.12 + waterlineStrength * 0.10);
    const waterPresence = clamp01(0.24 + oceanContinuity * 0.58 + shallowShelfStrength * 0.10);

    return {
      waterAlpha: clamp01(Math.max(0.24, waterPresence * 0.82)),
      waterPresence,
      hydrosphereBinding: 0.96,
      surfaceSeat: 0.96,
      depthBinding: 0.88,
      waterDepth: basinDepth,
      waterDepthClass:
        basinDepth >= 0.74 ? "deep-basin" :
        basinDepth >= 0.48 ? "open-water" :
        basinDepth >= 0.24 ? "shallow-shelf" :
        basinDepth >= 0.08 ? "waterline-edge" :
        "trace-water",
      seaLevelRelation: clamp(basinDepth - 0.42, -1, 1),
      waterlineStrength,
      shorelineBoundaryStrength,
      shallowShelfStrength,
      oceanContinuity,
      basinDepth,
      submergedBlockSignal: clamp01(Math.max(0, basinDepth - 0.58) * 0.70),
      submergedScarSignal: clamp01(Math.max(0, shorelineBoundaryStrength - 0.52) * 0.65),
      wetStoneBoundarySignal: clamp01(shorelineBoundaryStrength * 0.46),
      waterRgb: [8, 34, 86]
    };
  }

  function buildWaterPacket(...args) {
    const coordinate = parseCoordinateInput(...args);
    const signal = waterSignal(coordinate);

    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-water-child-deployment-coordinate-recovery",

      channel: "water",
      isWaterChannel: true,

      u: coordinate.u,
      v: coordinate.v,
      lon: coordinate.lon,
      lat: coordinate.lat,
      x: coordinate.x,
      y: coordinate.y,
      z: coordinate.z,

      waterAlpha: signal.waterAlpha,
      waterPresence: signal.waterPresence,
      hydrosphereBinding: signal.hydrosphereBinding,
      surfaceSeat: signal.surfaceSeat,
      depthBinding: signal.depthBinding,

      waterDepth: signal.waterDepth,
      waterDepthClass: signal.waterDepthClass,
      seaLevelRelation: signal.seaLevelRelation,
      waterlineStrength: signal.waterlineStrength,
      shorelineBoundaryStrength: signal.shorelineBoundaryStrength,
      shallowShelfStrength: signal.shallowShelfStrength,
      oceanContinuity: signal.oceanContinuity,
      basinDepth: signal.basinDepth,
      submergedBlockSignal: signal.submergedBlockSignal,
      submergedScarSignal: signal.submergedScarSignal,
      wetStoneBoundarySignal: signal.wetStoneBoundarySignal,

      rgb: signal.waterRgb.slice(),
      color: signal.waterRgb.slice(),
      waterRgb: signal.waterRgb.slice(),

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      mayDefineLand: false,
      mayDefineAir: false,
      definesLandTruth: false,
      definesAirTruth: false,

      hydrologyHintIsNotFinalColor: true,
      wetMaterialIsNotHydrosphere: true,
      beachShelfIsNotOpenOcean: true,
      waterlineIsNotWholeOcean: true,
      submergedScarIsNotActiveSurfaceWater: true,
      seaLevelHintIsNotFinalVisualTruth: true,
      blueColorIsNotWaterAuthority: true,

      ownsCanvasComposition: false,
      ownsRouteOrchestration: false,
      ownsRuntimeMotion: false,
      ownsRuntimeTable: false,
      ownsTripleG: false,
      ownsHydrologySourceLaw: false,
      ownsMaterialsSourceLaw: false,
      ownsVisualPass: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sample(...args) {
    return buildWaterPacket(...args);
  }

  function read(...args) {
    return buildWaterPacket(...args);
  }

  function sampleWater(...args) {
    return buildWaterPacket(...args);
  }

  function readWater(...args) {
    return buildWaterPacket(...args);
  }

  function waterAt(...args) {
    return buildWaterPacket(...args);
  }

  function getWater(...args) {
    return buildWaterPacket(...args);
  }

  function resolveWater(...args) {
    return buildWaterPacket(...args);
  }

  function getDirectory() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      receipt: RECEIPT,
      authority: "water-only-semiconductor-child",
      jurisdiction: "water-only",
      lanes: WATER_DIRECTORY.slice(),
      visualPassClaimed: false
    };
  }

  function getCoordinateMap() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      receipt: RECEIPT,
      coordinateBody: "shared-hearth-planetary-body",
      acceptedInputs: [
        "{ u, v }",
        "{ lon, lat }",
        "{ longitude, latitude }",
        "{ x, y, z }",
        "x, y, z",
        "lon, lat"
      ],
      outputFields: ["u", "v", "lon", "lat", "x", "y", "z"],
      laws: {
        u: "wrap((lon + 180) / 360)",
        v: "clamp((90 - lat) / 180)",
        vector: "x² + y² + z² ≈ 1"
      }
    };
  }

  function getWaterMultiplexReceipt() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      receipt: RECEIPT,
      mode: "served-coordinate-water-only-semiconductor",
      directory: WATER_DIRECTORY.slice(),
      rejectionLaws: { ...REJECTION_LAWS },
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      status: "active",
      path: "/assets/hearth/hearth.water.channel.js",
      role: "Water Child served asset and water-only semiconductor actor",
      exports: [
        "window.HEARTH_WATER_CHANNEL",
        "window.HearthWaterChannel",
        "window.HEARTH.waterChannel"
      ],
      methods: [
        "sample",
        "read",
        "sampleWater",
        "readWater",
        "waterAt",
        "getWater",
        "resolveWater",
        "getReceipt",
        "getDirectory",
        "getCoordinateMap",
        "getWaterMultiplexReceipt"
      ],
      actorContractMustRemain: CONTRACT,
      canvasOwnsWaterTruth: false,
      connectorOwnsWaterTruth: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    buildContract: BUILD_CONTRACT,
    previousBuildContract: PREVIOUS_BUILD_CONTRACT,
    receipt: RECEIPT,
    version: VERSION,

    channel: "water",
    isWaterChannel: true,

    sample,
    read,
    sampleWater,
    readWater,
    waterAt,
    getWater,
    resolveWater,

    getReceipt,
    getDirectory,
    getCoordinateMap,
    getWaterMultiplexReceipt,

    directory: WATER_DIRECTORY.slice(),
    rejectionLaws: { ...REJECTION_LAWS },

    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,

    mayDefineLand: false,
    mayDefineAir: false,
    definesLandTruth: false,
    definesAirTruth: false,

    canvasOwnsWaterTruth: false,
    connectorOwnsWaterTruth: false,
    ownsCanvasComposition: false,
    ownsRouteOrchestration: false,
    ownsRuntimeMotion: false,
    ownsRuntimeTable: false,
    ownsTripleG: false,
    ownsHydrologySourceLaw: false,
    ownsMaterialsSourceLaw: false,
    ownsVisualPass: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.waterChannel = api;

  root.HEARTH_WATER_CHANNEL = api;
  root.HearthWaterChannel = api;
  root.HEARTH_WATER_CHANNEL_CONTRACT = CONTRACT;
  root.HEARTH_WATER_CHANNEL_RECEIPT = getReceipt();

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthWaterChannelLoaded = "true";
    dataset.hearthWaterChannelContract = CONTRACT;
    dataset.hearthWaterChannelBuildContract = BUILD_CONTRACT;
    dataset.hearthWaterChannelPreviousBuildContract = PREVIOUS_BUILD_CONTRACT;
    dataset.hearthWaterChannelReceipt = RECEIPT;
    dataset.hearthWaterChannelAuthority = "water-only-semiconductor-child";
    dataset.hearthWaterChildServedAsset = "true";
    dataset.hearthWaterChildPath = "/assets/hearth/hearth.water.channel.js";
    dataset.hearthWaterChildExportsGlobal = "true";
    dataset.hearthWaterChildDiagnosticContract = CONTRACT;
    dataset.hearthWaterChildWaterOnly = "true";
    dataset.hearthWaterChildBodyBound = "true";
    dataset.hearthWaterChildSurfaceBound = "true";
    dataset.hearthWaterChildAllowedToFloat = "false";
    dataset.hearthWaterChildFloatsAboveBody = "false";
    dataset.hearthWaterChildMayDefineLand = "false";
    dataset.hearthWaterChildMayDefineAir = "false";
    dataset.hearthWaterChildVisualPassClaimed = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
