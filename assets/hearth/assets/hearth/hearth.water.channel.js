// /assets/hearth/hearth.water.channel.js
// HEARTH_DEPLOYED_ROUTE_ALIGNED_WATER_CHILD_TNT_v1
// Full-file replacement.
// Water Child / deployed-route-aligned hydrosphere surface-depth authority only.
// Purpose:
// - Create the served Water Child at the exact deployed asset path.
// - Align the child to /showroom/globe/hearth/ without rewriting the route.
// - Export HEARTH_WATER_CHANNEL for canvas, Runtime Table, and Triple G validation.
// - Provide coordinate-valid, contract-valid, body-bound, surface-bound water samples.
// - Close the current load/export gap proven by v4.4 canvas diagnostics.
// Does not own:
// - canvas composition
// - deployed route orchestration
// - Runtime Table canonical standard
// - Triple G diagnostic canonical standard
// - land truth
// - air truth
// - materials authority
// - hydrology parent law
// - elevation
// - tectonics
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1";
  const RECEIPT = "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_RECEIPT_v1";
  const BUILD_CONTRACT = "HEARTH_DEPLOYED_ROUTE_ALIGNED_WATER_CHILD_TNT_v1";
  const PREVIOUS_BUILD_CONTRACT = "HEARTH_WATER_CHILD_HYDROSPHERE_SURFACE_DEPTH_CHANNEL_TNT_v1";
  const VERSION = "2026-05-29.hearth-deployed-route-aligned-water-child-v1";

  const ROUTE_PARENT = "/showroom/globe/hearth/";
  const EXPECTED_ROUTE_CONDUCTOR = "/showroom/globe/hearth/hearth.climate.route.js";
  const ASSET_AUTHORITY = "/assets/hearth/hearth.water.channel.js";
  const EXPECTED_CANVAS_CONSUMER = "/assets/hearth/hearth.canvas.js";
  const EXPECTED_RUNTIME_VALIDATOR = "/assets/lab/runtime-table.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const COLORS = Object.freeze({
    deepOcean: [4, 15, 46],
    openWater: [7, 35, 88],
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
    const u = lonToU(ll.lon);
    const v = latToV(ll.lat);
    const magnitude = Math.hypot(n.x, n.y, n.z) || 1;

    return {
      u,
      v,
      lon: ll.lon,
      lat: ll.lat,
      x: n.x,
      y: n.y,
      z: n.z,
      vectorMagnitude: magnitude,
      vectorMagnitudeError: Math.abs(1 - magnitude),
      uLaw: "u = wrap((lon + 180) / 360)",
      vLaw: "v = clamp((90 - lat) / 180)",
      coordinateBody: "shared-hearth-sphere-coordinate-body",
      coordinateCompatible: true
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
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-deployed-route-aligned-water-child",

      routeParent: ROUTE_PARENT,
      routeAligned: true,
      assetAuthority: ASSET_AUTHORITY,
      expectedRouteConductor: EXPECTED_ROUTE_CONDUCTOR,
      expectedCanvasConsumer: EXPECTED_CANVAS_CONSUMER,
      expectedRuntimeValidator: EXPECTED_RUNTIME_VALIDATOR,

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
      coordinateMapReady: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      canvasMutation: false,
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

  function getCoordinateMap() {
    return {
      contract: CONTRACT,
      buildContract: BUILD_CONTRACT,
      routeParent: ROUTE_PARENT,
      assetAuthority: ASSET_AUTHORITY,
      coordinates: [
        {
          id: "COORDINATE_0_SERVED_FILE",
          path: ASSET_AUTHORITY,
          expectedRequest: "/assets/hearth/hearth.water.channel.js?v=hearth-water-channel-load-export-v1",
          acceptance: "waterScriptLoaded=true"
        },
        {
          id: "COORDINATE_1_ROUTE_ALIGNMENT",
          routeParent: ROUTE_PARENT,
          expectedRouteConductor: EXPECTED_ROUTE_CONDUCTOR,
          acceptance: "routeAligned=true"
        },
        {
          id: "COORDINATE_2_GLOBAL_EXPORT",
          globals: ["HEARTH_WATER_CHANNEL", "HearthWaterChannel", "HEARTH.waterChannel"],
          acceptance: "waterGlobalPresent=true"
        },
        {
          id: "COORDINATE_3_API_METHODS",
          methods: ["sample", "read", "getReceipt"],
          aliases: ["sampleWater", "readWater", "waterAt", "getWater", "resolveWater"],
          acceptance: "waterSampleProbeOk=true"
        },
        {
          id: "COORDINATE_4_INPUT_ACCEPTANCE",
          acceptedInputs: ["{u,v}", "{lon,lat}", "{longitude,latitude}", "{x,y,z}", "x,y,z", "lon,lat"],
          directProbe: { u: 0.5, v: 0.5, x: 0, y: 0, z: 1 },
          acceptance: "probe returns object"
        },
        {
          id: "COORDINATE_5_PLANETARY_BODY",
          requiredFields: ["u", "v", "lon", "lat", "x", "y", "z"],
          laws: ["x²+y²+z²≈1", "u=(lon+180)/360", "v=(90-lat)/180"],
          acceptance: "waterSampleProbeCoordinatesOk=true"
        },
        {
          id: "COORDINATE_6_HYDROSPHERE_AUTHORITY",
          requiredFields: [
            "waterAlpha",
            "waterPresence",
            "hydrosphereBinding",
            "surfaceSeat",
            "depthBinding",
            "waterDepth",
            "waterDepthClass",
            "basinDepth",
            "oceanContinuity"
          ],
          acceptance: "packet is auditable as water"
        },
        {
          id: "COORDINATE_7_BODY_SEATED_ANTI_FLOAT",
          requiredFlags: {
            bodyBound: true,
            surfaceBound: true,
            floatsAboveBody: false,
            allowedToFloat: false,
            mayDefineLand: false,
            mayDefineAir: false
          },
          acceptance: "waterSampleProbeFlagsOk=true"
        },
        {
          id: "COORDINATE_8_COLOR_PACKET",
          requiredFields: ["rgb", "color", "waterRgb"],
          acceptance: "canvas can consume water color without fallback"
        },
        {
          id: "COORDINATE_9_DOCUMENT_DATASET",
          acceptance: "document root receives water child load receipt"
        },
        {
          id: "COORDINATE_10_RUNTIME_TABLE",
          acceptance: "Runtime Table water.status=READY"
        },
        {
          id: "COORDINATE_11_TRIPLE_G_RECEIPT",
          acceptance: "RECEIPT_VERIFICATION_CHECK=PASS"
        },
        {
          id: "COORDINATE_12_POST_WATER_PRIORITY",
          order: [
            "WATER_SURFACE_SEATING_CHECK",
            "CHANNEL_SEPARATION_CHECK",
            "LAND_BODY_BINDING_CHECK",
            "DISTRIBUTION_SHAPE_CHECK"
          ]
        }
      ]
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      buildContract: BUILD_CONTRACT,
      previousBuildContract: PREVIOUS_BUILD_CONTRACT,
      version: VERSION,
      authority: "hearth-deployed-route-aligned-water-child",
      primaryTarget: ASSET_AUTHORITY,
      status: "active",
      role: "Water Child / route-aligned hydrosphere surface-depth authority",

      routeParent: ROUTE_PARENT,
      routeAligned: true,
      assetAuthority: ASSET_AUTHORITY,
      expectedRouteConductor: EXPECTED_ROUTE_CONDUCTOR,
      expectedCanvasConsumer: EXPECTED_CANVAS_CONSUMER,
      expectedRuntimeValidator: EXPECTED_RUNTIME_VALIDATOR,

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
      coordinateMap: getCoordinateMap(),
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
        "water-coordinate-identity",
        "route-aligned-water-child-identity"
      ],
      doesNotOwn: [
        "canvas-composition",
        "deployed-route-orchestration",
        "Runtime Table canonical standard",
        "Triple G diagnostic canonical standard",
        "land-truth",
        "air-truth",
        "materials-authority",
        "hydrology-parent-law",
        "elevation",
        "tectonics",
        "runtime-motion",
        "controls",
        "final-visual-pass-claim"
      ],
      acceptanceTarget: [
        "waterScriptLoaded true",
        "waterGlobalPresent true",
        "waterActualContract matches HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
        "waterSampleProbeOk true",
        "waterSampleProbeCoordinatesOk true",
        "waterSampleProbeFlagsOk true",
        "Runtime Table water record READY",
        "RECEIPT_VERIFICATION_CHECK PASS"
      ],
      nextPostWaterPriority: [
        "WATER_SURFACE_SEATING_CHECK",
        "CHANNEL_SEPARATION_CHECK",
        "LAND_BODY_BINDING_CHECK",
        "DISTRIBUTION_SHAPE_CHECK"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      canvasMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    buildContract: BUILD_CONTRACT,
    previousBuildContract: PREVIOUS_BUILD_CONTRACT,
    version: VERSION,

    routeParent: ROUTE_PARENT,
    routeAligned: true,
    assetAuthority: ASSET_AUTHORITY,
    expectedRouteConductor: EXPECTED_ROUTE_CONDUCTOR,
    expectedCanvasConsumer: EXPECTED_CANVAS_CONSUMER,
    expectedRuntimeValidator: EXPECTED_RUNTIME_VALIDATOR,

    sample,
    read,
    sampleWater,
    readWater,
    waterAt,
    getWater,
    resolveWater,
    getReceipt,
    getCoordinateMap,

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
    routeAlignedWaterChild: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeMutation: false,
    canvasMutation: false,
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
  root.HEARTH_WATER_CHANNEL_ROUTE_ALIGNED = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthWaterChannelLoaded = "true";
    dataset.hearthWaterChannelContract = CONTRACT;
    dataset.hearthWaterChannelReceipt = RECEIPT;
    dataset.hearthWaterChildBuildContract = BUILD_CONTRACT;
    dataset.hearthWaterChildPreviousBuildContract = PREVIOUS_BUILD_CONTRACT;

    dataset.hearthWaterChannelRouteAligned = "true";
    dataset.hearthWaterChannelRouteParent = ROUTE_PARENT;
    dataset.hearthWaterChannelAssetAuthority = ASSET_AUTHORITY;
    dataset.hearthWaterChannelExpectedRouteConductor = EXPECTED_ROUTE_CONDUCTOR;
    dataset.hearthWaterChannelExpectedCanvasConsumer = EXPECTED_CANVAS_CONSUMER;
    dataset.hearthWaterChannelExpectedRuntimeValidator = EXPECTED_RUNTIME_VALIDATOR;

    dataset.hearthWaterChannelCoordinates = "true";
    dataset.hearthWaterChannelCoordinateMapReady = "true";
    dataset.hearthWaterChannelSampleReady = "true";
    dataset.hearthWaterChannelBodyBound = "true";
    dataset.hearthWaterChannelSurfaceBound = "true";
    dataset.hearthWaterChannelAllowedToFloat = "false";
    dataset.hearthWaterChannelMayDefineLand = "false";
    dataset.hearthWaterChannelMayDefineAir = "false";
    dataset.hearthWaterChannelDefinesLandTruth = "false";
    dataset.hearthWaterChannelDefinesAirTruth = "false";

    dataset.hearthWaterChannelPostWaterPriority = [
      "WATER_SURFACE_SEATING_CHECK",
      "CHANNEL_SEPARATION_CHECK",
      "LAND_BODY_BINDING_CHECK",
      "DISTRIBUTION_SHAPE_CHECK"
    ].join(",");

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.routeMutation = "false";
    dataset.canvasMutation = "false";
    dataset.runtimeMutation = "false";
    dataset.controlsMutation = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
