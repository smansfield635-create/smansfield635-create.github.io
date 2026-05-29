// /assets/hearth/hearth.water.channel.js
// HEARTH_WATER_CHILD_SERVED_ASSET_COORDINATE_AND_WATER_ONLY_SEMICONDUCTOR_TNT_v1
// Full-file replacement.
// Water Child / water-only semiconductor authority.
// Purpose:
// - Exist and execute at /assets/hearth/hearth.water.channel.js.
// - Export HEARTH_WATER_CHANNEL, HearthWaterChannel, and HEARTH.waterChannel.
// - Satisfy the Runtime Table expected contract: HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1.
// - Normalize water-only signals into one body-bound hydrosphere packet.
// - Preserve downstream water files as optional nonblocking inputs.
// Does not own:
// - canvas composition
// - route orchestration
// - runtime motion
// - Runtime Table
// - Triple G
// - hydrology source law
// - materials source law
// - visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const BUILD_CONTRACT = "HEARTH_WATER_CHILD_SERVED_ASSET_COORDINATE_AND_WATER_ONLY_SEMICONDUCTOR_TNT_v1";
  const RECEIPT = "HEARTH_WATER_CHILD_SERVED_ASSET_COORDINATE_AND_WATER_ONLY_SEMICONDUCTOR_RECEIPT_v1";
  const VERSION = "2026-05-29.hearth-water-child-served-asset-coordinate-water-only-semiconductor-v1";

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

  const WATER_RGB = Object.freeze([8, 34, 86]);
  const DEEP_WATER_RGB = Object.freeze([4, 12, 38]);
  const SHALLOW_WATER_RGB = Object.freeze([18, 76, 126]);
  const WATERLINE_RGB = Object.freeze([42, 103, 142]);

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

  function mixRgb(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(mixNumber(a[0], b[0], k)), 0, 255),
      clamp(Math.round(mixNumber(a[1], b[1], k)), 0, 255),
      clamp(Math.round(mixNumber(a[2], b[2], k)), 0, 255)
    ];
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

        return {
          u,
          v,
          lon,
          lat,
          x: vector.x,
          y: vector.y,
          z: vector.z
        };
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        const lon = Number(input.lon);
        const lat = clamp(Number(input.lat), -90, 90);
        const vector = lonLatToVector(lon, lat);

        return {
          u: lonToU(lon),
          v: latToV(lat),
          lon,
          lat,
          x: vector.x,
          y: vector.y,
          z: vector.z
        };
      }

      if (Number.isFinite(Number(input.longitude)) && Number.isFinite(Number(input.latitude))) {
        const lon = Number(input.longitude);
        const lat = clamp(Number(input.latitude), -90, 90);
        const vector = lonLatToVector(lon, lat);

        return {
          u: lonToU(lon),
          v: latToV(lat),
          lon,
          lat,
          x: vector.x,
          y: vector.y,
          z: vector.z
        };
      }

      if (
        Number.isFinite(Number(input.x)) &&
        Number.isFinite(Number(input.y)) &&
        Number.isFinite(Number(input.z))
      ) {
        const vector = normalize3(input);
        const ll = vectorToLonLat(vector);

        return {
          u: lonToU(ll.lon),
          v: latToV(ll.lat),
          lon: ll.lon,
          lat: ll.lat,
          x: vector.x,
          y: vector.y,
          z: vector.z
        };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);

      return {
        u: lonToU(ll.lon),
        v: latToV(ll.lat),
        lon: ll.lon,
        lat: ll.lat,
        x: vector.x,
        y: vector.y,
        z: vector.z
      };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = clamp(Number(args[1]), -90, 90);
      const vector = lonLatToVector(lon, lat);

      return {
        u: lonToU(lon),
        v: latToV(lat),
        lon,
        lat,
        x: vector.x,
        y: vector.y,
        z: vector.z
      };
    }

    return {
      u: 0.5,
      v: 0.5,
      lon: 0,
      lat: 0,
      x: 0,
      y: 0,
      z: 1
    };
  }

  function getGlobalCandidate(name) {
    return root[name] || null;
  }

  function getNestedCandidate(name) {
    return root.HEARTH && root.HEARTH[name] ? root.HEARTH[name] : null;
  }

  function callOptionalSource(source, coordinate) {
    if (!source || typeof source !== "object") return null;

    const methods = [
      "sampleWater",
      "readWater",
      "waterAt",
      "getWater",
      "resolveWater",
      "sample",
      "read"
    ];

    for (const method of methods) {
      if (typeof source[method] !== "function") continue;

      try {
        const result = source[method](coordinate);
        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return null;
  }

  function collectWaterSources(coordinate) {
    const sources = [
      getNestedCandidate("hydrology"),
      getGlobalCandidate("HEARTH_HYDROLOGY"),
      getNestedCandidate("materials"),
      getGlobalCandidate("HEARTH_MATERIALS"),
      getNestedCandidate("composition"),
      getGlobalCandidate("HEARTH_COMPOSITION"),
      getNestedCandidate("elevation"),
      getGlobalCandidate("HEARTH_ELEVATION")
    ];

    return sources
      .map((source) => callOptionalSource(source, coordinate))
      .filter((source) => source && typeof source === "object");
  }

  function numberFromAny(sources, keys, fallback) {
    for (const source of sources) {
      for (const key of keys) {
        const value = Number(source && source[key]);
        if (Number.isFinite(value)) return value;
      }
    }

    return fallback;
  }

  function booleanFromAny(sources, keys, fallback) {
    for (const source of sources) {
      for (const key of keys) {
        if (typeof source[key] === "boolean") return source[key];
      }
    }

    return fallback;
  }

  function rgbFromAny(sources, keys, fallback) {
    for (const source of sources) {
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
    }

    return fallback.slice();
  }

  function waterBandSignal(coordinate) {
    const equatorialBasin = Math.cos(coordinate.lat * DEG);
    const longitudinalPulse = Math.sin((coordinate.lon * 1.7 + 34) * DEG) * 0.5 + 0.5;
    const meridianPulse = Math.cos((coordinate.lon * 0.9 - coordinate.lat * 1.2) * DEG) * 0.5 + 0.5;

    const basin = clamp01(0.34 + equatorialBasin * 0.22 + longitudinalPulse * 0.16);
    const shelf = clamp01(1 - Math.abs(0.52 - meridianPulse) * 2.4);
    const waterline = clamp01(1 - Math.abs(0.48 - basin) * 3.2);

    return {
      basin,
      shelf,
      waterline
    };
  }

  function classifyDepth(depth) {
    if (depth >= 0.74) return "deep-basin";
    if (depth >= 0.48) return "open-water";
    if (depth >= 0.24) return "shallow-shelf";
    if (depth >= 0.08) return "waterline-edge";
    return "trace-water";
  }

  function resolveWaterSignals(coordinate) {
    const optionalSources = collectWaterSources(coordinate);
    const band = waterBandSignal(coordinate);

    const sourceWaterPresence = clamp01(numberFromAny(optionalSources, [
      "waterPresence",
      "waterAlpha",
      "hydrospherePresence",
      "oceanPresence",
      "openOcean",
      "surfaceWater"
    ], band.basin));

    const sourceDepth = clamp01(numberFromAny(optionalSources, [
      "waterDepth",
      "depth",
      "basinDepth",
      "oceanDepth",
      "hydrosphereDepth"
    ], band.basin * 0.72 + band.shelf * 0.18));

    const seaLevelRelation = clamp(numberFromAny(optionalSources, [
      "seaLevelRelation",
      "seaLevelDelta",
      "relativeSeaLevel",
      "waterlineRelation"
    ], sourceDepth - 0.42), -1, 1);

    const waterlineStrength = clamp01(numberFromAny(optionalSources, [
      "waterlineStrength",
      "waterline",
      "coastalWaterline",
      "shorelineStrength"
    ], band.waterline));

    const shorelineBoundaryStrength = clamp01(numberFromAny(optionalSources, [
      "shorelineBoundaryStrength",
      "shoreline",
      "coastStrength",
      "coastalBoundary"
    ], waterlineStrength * 0.82));

    const shallowShelfStrength = clamp01(numberFromAny(optionalSources, [
      "shallowShelfStrength",
      "shallowShelf",
      "shelf",
      "beachShelf"
    ], band.shelf));

    const oceanContinuity = clamp01(numberFromAny(optionalSources, [
      "oceanContinuity",
      "hydrologyContinuity",
      "waterContinuity",
      "openOceanContinuity"
    ], sourceWaterPresence * 0.76 + sourceDepth * 0.20));

    const basinDepth = clamp01(numberFromAny(optionalSources, [
      "basinDepth",
      "deepBasin",
      "basin",
      "waterBasin"
    ], sourceDepth));

    const submergedBlockSignal = clamp01(numberFromAny(optionalSources, [
      "submergedBlockSignal",
      "submergedBlock",
      "underwaterBlock"
    ], Math.max(0, sourceDepth - 0.58) * 0.70));

    const submergedScarSignal = clamp01(numberFromAny(optionalSources, [
      "submergedScarSignal",
      "submergedScar",
      "underwaterScar"
    ], Math.max(0, shorelineBoundaryStrength - 0.52) * 0.65));

    const wetStoneBoundarySignal = clamp01(numberFromAny(optionalSources, [
      "wetStoneBoundarySignal",
      "wetStoneBoundary",
      "wetStone",
      "waterEdgeStone"
    ], shorelineBoundaryStrength * 0.46));

    const hydrosphereBinding = clamp01(numberFromAny(optionalSources, [
      "hydrosphereBinding",
      "waterBinding",
      "bodyBinding"
    ], 0.96));

    const surfaceSeat = clamp01(numberFromAny(optionalSources, [
      "surfaceSeat",
      "waterSurfaceSeat",
      "surfaceBinding"
    ], 0.96));

    const depthBinding = clamp01(numberFromAny(optionalSources, [
      "depthBinding",
      "basinBinding",
      "waterDepthBinding"
    ], 0.88));

    const waterPresence = clamp01(
      sourceWaterPresence * 0.46 +
      oceanContinuity * 0.22 +
      basinDepth * 0.16 +
      shallowShelfStrength * 0.08 +
      waterlineStrength * 0.08
    );

    const waterAlpha = clamp01(numberFromAny(optionalSources, [
      "alpha",
      "waterAlpha",
      "hydrosphereAlpha"
    ], Math.max(0.24, waterPresence * 0.82)));

    const sourceRgb = rgbFromAny(optionalSources, [
      "waterRgb",
      "oceanRgb",
      "hydrosphereRgb",
      "rgb",
      "color"
    ], WATER_RGB);

    const depthRgb = mixRgb(SHALLOW_WATER_RGB, DEEP_WATER_RGB, basinDepth);
    const lineRgb = mixRgb(depthRgb, WATERLINE_RGB, waterlineStrength * 0.26);
    const waterRgb = mixRgb(lineRgb, sourceRgb, 0.38);

    return {
      optionalSourceCount: optionalSources.length,
      sourceWaterPresence,
      sourceDepth,
      waterAlpha,
      waterPresence,
      hydrosphereBinding,
      surfaceSeat,
      depthBinding,
      waterDepth: sourceDepth,
      waterDepthClass: classifyDepth(sourceDepth),
      seaLevelRelation,
      waterlineStrength,
      shorelineBoundaryStrength,
      shallowShelfStrength,
      oceanContinuity,
      basinDepth,
      submergedBlockSignal,
      submergedScarSignal,
      wetStoneBoundarySignal,
      waterRgb
    };
  }

  function buildWaterPacket(...args) {
    const coordinate = parseCoordinateInput(...args);
    const signals = resolveWaterSignals(coordinate);
    const waterRgb = signals.waterRgb.slice();

    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-water-child-served-asset-coordinate-water-only-semiconductor",

      channel: "water",
      isWaterChannel: true,

      u: coordinate.u,
      v: coordinate.v,
      lon: coordinate.lon,
      lat: coordinate.lat,
      x: coordinate.x,
      y: coordinate.y,
      z: coordinate.z,

      waterAlpha: signals.waterAlpha,
      waterPresence: signals.waterPresence,
      hydrosphereBinding: signals.hydrosphereBinding,
      surfaceSeat: signals.surfaceSeat,
      depthBinding: signals.depthBinding,

      waterDepth: signals.waterDepth,
      waterDepthClass: signals.waterDepthClass,
      seaLevelRelation: signals.seaLevelRelation,
      waterlineStrength: signals.waterlineStrength,
      shorelineBoundaryStrength: signals.shorelineBoundaryStrength,
      shallowShelfStrength: signals.shallowShelfStrength,
      oceanContinuity: signals.oceanContinuity,
      basinDepth: signals.basinDepth,
      submergedBlockSignal: signals.submergedBlockSignal,
      submergedScarSignal: signals.submergedScarSignal,
      wetStoneBoundarySignal: signals.wetStoneBoundarySignal,

      rgb: waterRgb,
      color: waterRgb,
      waterRgb,

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

      optionalWaterSourceCount: signals.optionalSourceCount,
      sourceWaterPresence: signals.sourceWaterPresence,
      sourceDepth: signals.sourceDepth,

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
      receipt: RECEIPT,
      authority: "water-only-semiconductor-child",
      lanes: WATER_DIRECTORY.slice(),
      jurisdiction: "water-only",
      acceptsOptionalSources: [
        "HEARTH.hydrology",
        "HEARTH_HYDROLOGY",
        "HEARTH.materials",
        "HEARTH_MATERIALS",
        "HEARTH.composition",
        "HEARTH_COMPOSITION",
        "HEARTH.elevation",
        "HEARTH_ELEVATION"
      ],
      nonblockingOptionalSources: true,
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
      receipt: RECEIPT,
      mode: "water-only-signal-normalization",
      directory: WATER_DIRECTORY.slice(),
      rejectionLaws: { ...REJECTION_LAWS },
      outputPacket: [
        "waterAlpha",
        "waterPresence",
        "hydrosphereBinding",
        "surfaceSeat",
        "depthBinding",
        "waterDepth",
        "waterDepthClass",
        "seaLevelRelation",
        "waterlineStrength",
        "shorelineBoundaryStrength",
        "shallowShelfStrength",
        "oceanContinuity",
        "basinDepth",
        "submergedBlockSignal",
        "submergedScarSignal",
        "wetStoneBoundarySignal",
        "rgb",
        "color",
        "waterRgb"
      ],
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
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
      directory: WATER_DIRECTORY.slice(),
      rejectionLaws: { ...REJECTION_LAWS },
      actorContractMustRemain: CONTRACT,
      canvasOwnsWaterTruth: false,
      connectorOwnsWaterTruth: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    buildContract: BUILD_CONTRACT,
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
