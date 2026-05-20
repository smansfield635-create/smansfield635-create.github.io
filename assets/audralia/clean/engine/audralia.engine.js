// /assets/audralia/clean/engine/audralia.engine.js
// AUDRALIA_G2_8_PARENT_FIELD_ATLAS_RENDERER_TNT_v1
// Full-file replacement.
// Parent-facing route compatibility contract preserved:
// AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1
//
// Purpose:
// - Replace closed-boundary land containment with a continuous field-atlas renderer.
// - Build Gratitude as pressure, erosion, shelf, water-cut, lake, lagoon, wetland, and coastline fields.
// - Keep topology, hydrology, and surface children as authority inputs without depending on closed-containment drawing.
// - Keep motion cheap by rotating cached sphere texture lookup.
// - Preserve FORM_VISIBLE.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const INTERNAL_CONTRACT = "AUDRALIA_G2_8_PARENT_FIELD_ATLAS_RENDERER_TNT_v1";
  const GENERATION_STANDARD = "AUDRALIA_G2_8_FIELD_ATLAS_PLANETARY_STANDARD_v1";
  const RECEIPT = "AUDRALIA_G2_8_PARENT_FIELD_ATLAS_RENDERER_RECEIPT_v1";
  const PREVIOUS_INTERNAL_CONTRACT = "AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_LEGACY_PROMOTION_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia.engine.js";
  const ROUTE = "/showroom/globe/audralia/";

  const PATHS = Object.freeze({
    motion: "/assets/audralia/clean/engine/audralia/engine/motion.js",
    continents: "/assets/audralia/clean/engine/audralia/engine/continents.js",
    sky: "/assets/audralia/clean/engine/audralia/engine/sky.js",
    gratitudeTopology: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js",
    gratitudeHydrology: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js",
    gratitudeSurface: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.surface.js"
  });

  const EXPECTED = Object.freeze({
    motion: "AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_TNT_v1",
    continentsInternal: "AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HEX_SURFACE_RENDER_ADAPTER_TNT_v1",
    topology: "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1",
    hydrology: "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HYDROLOGY_SEA_LEVEL_INTEGRATION_TNT_v1",
    surface: "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HEX_SAMPLED_SURFACE_MATERIAL_TNT_v1"
  });

  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;

  const GEOMETRY = Object.freeze({
    centerX: 0.5,
    centerY: 0.50,
    radiusRatio: 0.382,
    minCanvasSize: 300,
    maxCanvasSize: 920,
    maxDpr: 1.35,
    textureWidth: 480,
    textureHeight: 240,
    spherePixelsIdle: 430,
    spherePixelsDrag: 310,
    minSpherePixels: 280,
    maxSpherePixels: 460,
    fallbackStageHeight: 520,
    atmosphereRadius: 1.13
  });

  const MOTION = Object.freeze({
    initialRotation: -0.92,
    initialPitch: -0.11,
    minPitch: -0.72,
    maxPitch: 0.62,
    dragRadiansPerPixel: 0.0105,
    pitchRadiansPerPixel: 0.0048,
    autoRotateSpeed: 0.000045,
    smoothing: 0.20,
    pitchSmoothing: 0.18,
    inertiaDecay: 0.925,
    inertiaMin: 0.000012,
    maxVelocity: 0.038,
    idleFrameMs: 58
  });

  const COLORS = Object.freeze({
    deepOcean: [2, 13, 40],
    ocean: [5, 52, 102],
    openOcean: [8, 72, 126],
    shelf: [25, 137, 160],
    shallow: [70, 176, 174],
    lagoon: [105, 205, 188],
    lake: [36, 136, 170],
    bay: [60, 176, 205],
    inlet: [86, 208, 224],
    wetland: [74, 132, 86],
    marsh: [98, 142, 92],
    beach: [202, 184, 118],
    wetBeach: [156, 158, 106],
    land: [62, 134, 76],
    landBright: [88, 158, 92],
    landDeep: [48, 104, 68],
    hardCoast: [66, 100, 78],
    repaired: [96, 176, 142],
    highTint: [128, 132, 92],
    shadow: [16, 28, 42],
    atmosphere: [96, 178, 222],
    atmosphereBright: [154, 224, 236],
    cloud: [225, 236, 234],
    gold: [198, 166, 91]
  });

  const FIELD_MODEL = Object.freeze({
    positive: Object.freeze([
      fieldNode(-49, 7, 45, 37, 1.05, -8, "main-survival-mass"),
      fieldNode(-70, 11, 20, 35, 0.56, -14, "west-adversity-wall"),
      fieldNode(-43, 31, 28, 15, 0.42, 3, "north-continuance-shoulder"),
      fieldNode(-18, 15, 18, 18, 0.36, 10, "east-reopening-reach"),
      fieldNode(-47, -23, 29, 13, 0.38, 2, "south-restoration-belt"),
      fieldNode(-33, -8, 19, 21, 0.26, 18, "interior-memory-rise")
    ]),
    cuts: Object.freeze([
      fieldNode(-9, 6, 14, 24, 0.60, 8, "east-inlet-cut"),
      fieldNode(-14, -8, 18, 13, 0.35, -18, "southeast-fracture-cut"),
      fieldNode(-55, -31, 20, 9, 0.45, 3, "south-lagoon-cut"),
      fieldNode(-80, -17, 13, 13, 0.25, -12, "west-pressure-bite"),
      fieldNode(-77, 4, 12, 11, 0.20, 18, "west-shelter-cut")
    ]),
    lakes: Object.freeze([
      fieldNode(-47.8, 14.3, 8.9, 6.2, 1.00, 4, "north-memory-lake"),
      fieldNode(-60.1, -9.6, 7.0, 4.8, 1.00, -8, "west-memory-lake"),
      fieldNode(-35.9, 31.2, 3.9, 2.8, 0.75, 0, "north-small-lake"),
      fieldNode(-40.4, -22.7, 4.6, 3.1, 0.75, 5, "south-small-lake")
    ]),
    lagoons: Object.freeze([
      fieldNode(-53.2, -27.1, 9.0, 3.6, 0.95, 2, "south-restoration-lagoon"),
      fieldNode(-13.5, 3.2, 4.9, 2.9, 0.82, 0, "east-reopening-lagoon")
    ]),
    wetlands: Object.freeze([
      fieldNode(-50, -23, 28, 10, 0.54, 2, "southern-soft-restoration"),
      fieldNode(-18, -5, 14, 11, 0.34, -8, "southeast-repaired-wetland")
    ]),
    hardCoast: Object.freeze([
      fieldNode(-76, 6, 14, 31, 0.60, -4, "western-hard-coast"),
      fieldNode(-67, -20, 14, 20, 0.40, 8, "southwest-hard-coast")
    ])
  });

  const state = {
    contract: CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    generationStandard: GENERATION_STANDARD,
    receipt: RECEIPT,
    target: TARGET,
    route: ROUTE,

    mounted: false,
    booted: false,
    disposed: false,
    formVisible: false,

    mountNode: null,
    canvas: null,
    ctx: null,
    sphereCanvas: null,
    sphereCtx: null,

    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    dpr: 1,
    cx: 0,
    cy: 0,
    radius: 0,
    sphereSize: 0,

    cacheNonce: "",
    childLoadStarted: false,
    childLoadComplete: false,

    textureAtlas: null,
    textureAtlasBuilt: false,
    textureAtlasBuildStarted: false,
    textureAtlasBuildComplete: false,
    textureAtlasError: "",
    textureAtlasVersion: "",
    textureAtlasLandRatio: 0,
    textureAtlasWaterRatio: 0,
    textureAtlasHydrologyRatio: 0,
    textureAtlasSurfaceRatio: 0,
    textureAtlasFieldCoverageRatio: 0,
    textureAtlasContainmentModel: "continuous-field",
    textureAtlasClosedContainmentUsed: false,
    textureAtlasConsumesContinents: false,
    textureAtlasConsumesGratitudeTopology: false,
    textureAtlasConsumesGratitudeHydrology: false,
    textureAtlasConsumesGratitudeSurface: false,
    textureAtlasLandContainmentProved: false,

    fieldAtlasActive: true,
    continuousFieldLandMask: true,
    closedBoundaryContainmentReleased: true,
    boundaryDrawingPrimary: false,
    projectedOverlayPrimaryRenderer: false,
    motionRedrawUsesCachedAtlas: true,
    dragFrameLiveChildSampling: false,
    sphereUvLookupActive: true,
    planetMaterialIntegrated: false,

    motionLoaded: false,
    motionContract: "",
    motionContractValid: false,
    motionConsumed: false,

    continentsLoaded: false,
    continentsContract: "",
    continentsInternalContract: "",
    continentsBrokerConsumed: false,

    topologyLoaded: false,
    topologyContract: "",
    topologyContractValid: false,
    topologyObject: null,

    hydrologyLoaded: false,
    hydrologyContract: "",
    hydrologyContractValid: false,
    hydrologyObject: null,

    surfaceLoaded: false,
    surfaceContract: "",
    surfaceContractValid: false,
    surfaceApi: null,

    skyLoaded: false,

    derivedPositiveNodes: [],
    derivedCutNodes: [],
    derivedLakeNodes: [],
    derivedLagoonNodes: [],
    derivedWetlandNodes: [],

    rotation: MOTION.initialRotation,
    targetRotation: MOTION.initialRotation,
    pitch: MOTION.initialPitch,
    targetPitch: MOTION.initialPitch,
    velocity: 0,
    pitchVelocity: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastPointerTime: 0,
    reducedMotion: false,

    frameId: 0,
    loopId: 0,
    renderScheduled: false,
    renderCount: 0,
    requestRenderCount: 0,
    lastFrameTime: 0,
    lastLoopRenderTime: 0,
    lastRenderTime: 0,
    lastMotionReason: "module-load",
    lastRenderReason: "",

    canvasTransformForbidden: true,
    cssTransformForbidden: true,
    bitmapStretchForbidden: true,
    screenPlaneDragForbidden: true,

    lastDrawError: "",
    errors: [],

    ownsCanvasComposition: true,
    ownsVisiblePlanetBody: true,
    ownsTextureAtlas: true,
    ownsSphereProjection: true,
    ownsAtmosphere: true,
    ownsRimLighting: true,

    ownsTopology: false,
    ownsHydrology: false,
    ownsSurface: false,
    ownsTerrain: false,
    ownsElevation: false,
    ownsContinentsTruth: false,
    ownsMotionState: false,
    ownsRoute: false,
    ownsHtml: false,

    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false
  };

  const loadPromises = new Map();

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function now() {
    if (hasWindow() && window.performance && typeof window.performance.now === "function") {
      return window.performance.now();
    }
    return Date.now();
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function wrapDegrees(value) {
    let out = finite(value, 0);
    while (out <= -180) out += 360;
    while (out > 180) out -= 360;
    return out;
  }

  function wrapRadians(value) {
    let out = finite(value, 0);
    while (out <= -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function lerp(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((finite(value, 0) - finite(edge0, 0)) / Math.max(0.000001, finite(edge1, 1) - finite(edge0, 0)));
    return t * t * (3 - 2 * t);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(finite(x, 0) * 127.1 + finite(y, 0) * 311.7 + finite(seed, 0) * 74.7) * 43758.5453123);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fract(x);
    const fy = fract(y);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves = 5) {
    let total = 0;
    let amp = 0.58;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * freq, y * freq, seed + i * 29.37) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(x, y, seed, octaves = 4) {
    let total = 0;
    let amp = 0.58;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      const n = valueNoise(x * freq, y * freq, seed + i * 41.7);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function fieldNode(lon, lat, radiusLon, radiusLat, weight, tilt, id) {
    return Object.freeze({
      id: String(id || "field-node"),
      lon: finite(lon, 0),
      lat: finite(lat, 0),
      radiusLon: Math.max(0.0001, finite(radiusLon, 1)),
      radiusLat: Math.max(0.0001, finite(radiusLat, 1)),
      weight: finite(weight, 1),
      tilt: finite(tilt, 0)
    });
  }

  function fieldScore(lon, lat, node) {
    const dx = wrapDegrees(finite(lon, 0) - node.lon);
    const dy = finite(lat, 0) - node.lat;
    const angle = node.tilt * Math.PI / 180;
    const c = Math.cos(-angle);
    const s = Math.sin(-angle);

    const x = dx * c - dy * s;
    const y = dx * s + dy * c;

    const q = (x * x) / (node.radiusLon * node.radiusLon) + (y * y) / (node.radiusLat * node.radiusLat);
    const core = smoothstep(1.18, -0.20, q);
    const fringe = smoothstep(1.85, 0.72, q) * 0.28;

    return clamp01(core + fringe) * node.weight;
  }

  function uvToLonLat(u, v) {
    return {
      lon: wrap01(u) * 360 - 180,
      lat: 90 - clamp01(v) * 180
    };
  }

  function ringStats(points) {
    const source = Array.isArray(points) ? points : [];

    if (!source.length) {
      return null;
    }

    let lonSum = 0;
    let latSum = 0;
    let count = 0;

    for (const point of source) {
      const lon = finite(point.lon, NaN);
      const lat = finite(point.lat, NaN);

      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

      lonSum += lon;
      latSum += lat;
      count += 1;
    }

    if (!count) return null;

    const lon = lonSum / count;
    const lat = latSum / count;

    let lonSpread = 0;
    let latSpread = 0;

    for (const point of source) {
      const pLon = finite(point.lon, lon);
      const pLat = finite(point.lat, lat);
      lonSpread = Math.max(lonSpread, Math.abs(wrapDegrees(pLon - lon)));
      latSpread = Math.max(latSpread, Math.abs(pLat - lat));
    }

    return {
      lon,
      lat,
      radiusLon: clamp(lonSpread * 0.72, 3, 46),
      radiusLat: clamp(latSpread * 0.72, 2, 38)
    };
  }

  function readBoundaryLike(entry) {
    if (entry && Array.isArray(entry.boundary) && entry.boundary.length) return entry.boundary;
    if (entry && entry.profile && Array.isArray(entry.profile.sourceBoundary) && entry.profile.sourceBoundary.length) {
      return entry.profile.sourceBoundary;
    }
    if (Array.isArray(entry) && entry.length) return entry;
    return [];
  }

  function deriveAuthorityField() {
    const positive = [];
    const cuts = [];
    const lakes = [];
    const lagoons = [];
    const wetlands = [];

    const topology = state.topologyObject;

    if (topology && Array.isArray(topology.landmasses)) {
      topology.landmasses.forEach((landmass, index) => {
        const stats = ringStats(landmass.boundary);

        if (stats) {
          positive.push(fieldNode(
            stats.lon,
            stats.lat,
            stats.radiusLon * 1.08,
            stats.radiusLat * 1.08,
            index === 0 ? 0.38 : 0.22,
            -6,
            `topology-body-${index}`
          ));
        }

        const local = landmass.topology || {};

        (local.lakes || []).forEach((ring, lakeIndex) => {
          const lake = ringStats(ring);
          if (lake) lakes.push(fieldNode(lake.lon, lake.lat, lake.radiusLon, lake.radiusLat, 0.82, 0, `topology-lake-${lakeIndex}`));
        });

        (local.lagoons || []).forEach((ring, lagoonIndex) => {
          const lagoon = ringStats(ring);
          if (lagoon) lagoons.push(fieldNode(lagoon.lon, lagoon.lat, lagoon.radiusLon, lagoon.radiusLat, 0.78, 0, `topology-lagoon-${lagoonIndex}`));
        });
      });
    }

    const hydrology = state.hydrologyObject;

    if (hydrology) {
      const hydrologyNodeMap = [
        ["bayWaterRegistry", cuts, 0.36, "bay-cut"],
        ["inletWaterRegistry", cuts, 0.42, "inlet-cut"],
        ["coastalShelfRegistry", cuts, 0.18, "shelf-soft-cut"],
        ["submergedEdgeRegistry", cuts, 0.20, "submerged-edge-cut"],
        ["inlandLakeRegistry", lakes, 0.90, "inland-lake"],
        ["lagoonWaterRegistry", lagoons, 0.86, "lagoon"],
        ["wetlandBlendRegistry", wetlands, 0.48, "wetland"],
        ["repairedWaterlineRegistry", wetlands, 0.36, "repaired-waterline"],
        ["hardCoastWaterlineRegistry", cuts, 0.22, "hard-coast-cut"]
      ];

      hydrologyNodeMap.forEach(([key, target, weight, label]) => {
        const entries = Array.isArray(hydrology[key]) ? hydrology[key] : [];

        entries.forEach((entry, index) => {
          const stats = ringStats(readBoundaryLike(entry));
          if (!stats) return;

          target.push(fieldNode(
            stats.lon,
            stats.lat,
            stats.radiusLon,
            stats.radiusLat,
            weight,
            0,
            `${label}-${index}`
          ));
        });
      });
    }

    state.derivedPositiveNodes = positive;
    state.derivedCutNodes = cuts;
    state.derivedLakeNodes = lakes;
    state.derivedLagoonNodes = lagoons;
    state.derivedWetlandNodes = wetlands;
  }

  function maxNodeScore(lon, lat, nodes) {
    let best = 0;

    for (const node of nodes) {
      best = Math.max(best, fieldScore(lon, lat, node));
    }

    return clamp01(best);
  }

  function sumNodeScore(lon, lat, nodes, cap = 2) {
    let total = 0;

    for (const node of nodes) {
      total += fieldScore(lon, lat, node);
    }

    return clamp(total, 0, cap);
  }

  function computeFieldSample(lon, lat, u, v) {
    const baseLand =
      sumNodeScore(lon, lat, FIELD_MODEL.positive, 2.2) +
      sumNodeScore(lon, lat, state.derivedPositiveNodes, 0.8);

    const baseCut =
      sumNodeScore(lon, lat, FIELD_MODEL.cuts, 1.5) +
      sumNodeScore(lon, lat, state.derivedCutNodes, 0.8);

    const lake =
      maxNodeScore(lon, lat, FIELD_MODEL.lakes) ||
      maxNodeScore(lon, lat, state.derivedLakeNodes);

    const lagoon =
      maxNodeScore(lon, lat, FIELD_MODEL.lagoons) ||
      maxNodeScore(lon, lat, state.derivedLagoonNodes);

    const wetland =
      maxNodeScore(lon, lat, FIELD_MODEL.wetlands) ||
      maxNodeScore(lon, lat, state.derivedWetlandNodes);

    const hardCoast = maxNodeScore(lon, lat, FIELD_MODEL.hardCoast);

    const oldPressure = fbm(u * 6.6 - 0.22, v * 4.9 + 0.14, 8101, 5);
    const fracture = ridgeNoise(u * 13.2 + 0.11, v * 9.4 - 0.18, 8102, 4);
    const coastBreak = ridgeNoise(u * 23.0 - 0.37, v * 17.5 + 0.24, 8103, 3);
    const grain = fbm(u * 32.0 + 0.18, v * 21.0 - 0.27, 8104, 3);

    const rawLand = baseLand - baseCut * 0.72 + oldPressure * 0.12 + fracture * 0.07 - 0.56;
    const fieldLand = rawLand > 0;
    const shore = smoothstep(-0.12, 0.10, rawLand) * (1 - smoothstep(0.10, 0.38, rawLand));
    const shelf = !fieldLand && rawLand > -0.25;
    const coast = clamp01(shore + shelf * 0.48 + hardCoast * 0.24);

    let type = "ocean";
    let land = false;
    let water = true;
    let hydrologySignal = 0;
    let fieldCoverage = clamp01(smoothstep(-0.26, 0.26, rawLand));

    let color = mixColor(
      COLORS.deepOcean,
      COLORS.ocean,
      fbm(u * 2.4 + 0.17, v * 1.7 - 0.23, 2001, 5) * 0.72
    );

    color = mixColor(color, COLORS.openOcean, ridgeNoise(u * 11.0 + 0.11, v * 8.0 - 0.09, 2003, 3) * 0.12);

    if (shelf) {
      type = "shelf";
      hydrologySignal = Math.max(hydrologySignal, 0.32 + coast * 0.52);
      color = mixColor(color, COLORS.shelf, 0.42 + coast * 0.34);
      color = mixColor(color, COLORS.shallow, coast * 0.28);
    }

    if (fieldLand) {
      type = "land";
      land = true;
      water = false;

      let landColor = COLORS.land;

      if (lon <= -68) landColor = mixColor(landColor, COLORS.hardCoast, 0.34 + hardCoast * 0.22);
      if (lat >= 24) landColor = mixColor(landColor, COLORS.landBright, 0.24);
      if (lon >= -24 && lat > -18) landColor = mixColor(landColor, COLORS.repaired, 0.18);
      if (lat <= -16) landColor = mixColor(landColor, COLORS.wetland, 0.24 + wetland * 0.20);

      landColor = mixColor(landColor, COLORS.landDeep, fracture * 0.14);
      landColor = mixColor(landColor, COLORS.highTint, oldPressure * 0.10);
      landColor = shade(landColor, (oldPressure - 0.5) * 16 + (grain - 0.5) * 9 - shore * 7);

      if (shore > 0.18) {
        landColor = mixColor(landColor, COLORS.beach, shore * 0.20);
        landColor = mixColor(landColor, COLORS.shelf, shore * 0.08);
      }

      if (wetland > 0.22) {
        landColor = mixColor(landColor, COLORS.wetland, wetland * 0.32);
        hydrologySignal = Math.max(hydrologySignal, wetland);
      }

      color = landColor;
    }

    if (lake > 0.54) {
      type = "lake";
      land = false;
      water = true;
      hydrologySignal = Math.max(hydrologySignal, lake);
      color = mixColor(COLORS.lake, COLORS.shallow, fbm(u * 20, v * 16, 4101, 3) * 0.18);
    }

    if (lagoon > 0.50) {
      type = "lagoon";
      land = false;
      water = true;
      hydrologySignal = Math.max(hydrologySignal, lagoon);
      color = mixColor(COLORS.lagoon, COLORS.shallow, 0.22);
    }

    if (!fieldLand && baseCut > 0.42 && rawLand > -0.38) {
      type = baseCut > 0.72 ? "inlet" : "bay";
      hydrologySignal = Math.max(hydrologySignal, baseCut);
      color = mixColor(color, type === "inlet" ? COLORS.inlet : COLORS.bay, clamp01(0.34 + baseCut * 0.32));
    }

    let surfaceUsed = false;

    if (state.surfaceApi && typeof state.surfaceApi.sampleSurface === "function") {
      if (fieldCoverage > 0.10 || hydrologySignal > 0.22) {
        const surface = safe(
          () =>
            state.surfaceApi.sampleSurface(lon, lat, {
              sphericalDepth: 1,
              lightDot: 0.72,
              limbFade: 1,
              fieldCoverage,
              fieldType: type,
              fieldLand: land,
              fieldWater: water,
              fieldHydrology: hydrologySignal,
              closedContainmentUsed: false
            }),
          null
        );

        if (surface && surface.allowed && Array.isArray(surface.color)) {
          const surfaceColor = [
            clamp(Math.round(surface.color[0]), 0, 255),
            clamp(Math.round(surface.color[1]), 0, 255),
            clamp(Math.round(surface.color[2]), 0, 255)
          ];

          const alpha = clamp01(surface.materialAlpha === undefined ? surface.alpha || 0.18 : surface.materialAlpha);
          color = mixColor(color, surfaceColor, Math.min(0.30, alpha * (land ? 0.48 : 0.30)));
          hydrologySignal = Math.max(hydrologySignal, alpha * 0.4);
          surfaceUsed = true;
        }
      }
    }

    return {
      color,
      land,
      water,
      hydrologySignal,
      surfaceUsed,
      fieldCoverage,
      type,
      rawLand,
      closedContainmentUsed: false
    };
  }

  function buildTextureAtlas() {
    if (state.textureAtlasBuildStarted && !state.textureAtlasBuildComplete) return state.textureAtlas;

    syncAuthorities();
    deriveAuthorityField();

    state.textureAtlasBuildStarted = true;
    state.textureAtlasBuildComplete = false;
    state.textureAtlasError = "";

    try {
      const width = GEOMETRY.textureWidth;
      const height = GEOMETRY.textureHeight;
      const data = new Uint8ClampedArray(width * height * 4);

      let landPixels = 0;
      let waterPixels = 0;
      let hydrologyPixels = 0;
      let surfacePixels = 0;
      let fieldPixels = 0;

      for (let y = 0; y < height; y += 1) {
        const v = y / Math.max(1, height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = x / width;
          const lonLat = uvToLonLat(u, v);
          const sample = computeFieldSample(lonLat.lon, lonLat.lat, u, v);
          const index = (y * width + x) * 4;

          data[index] = sample.color[0];
          data[index + 1] = sample.color[1];
          data[index + 2] = sample.color[2];
          data[index + 3] = 255;

          if (sample.land) landPixels += 1;
          if (sample.water) waterPixels += 1;
          if (sample.hydrologySignal > 0.16) hydrologyPixels += 1;
          if (sample.surfaceUsed) surfacePixels += 1;
          if (sample.fieldCoverage > 0.08) fieldPixels += 1;
        }
      }

      const total = Math.max(1, width * height);
      const landRatio = Number((landPixels / total).toFixed(4));
      const waterRatio = Number((waterPixels / total).toFixed(4));
      const hydrologyRatio = Number((hydrologyPixels / total).toFixed(4));
      const surfaceRatio = Number((surfacePixels / total).toFixed(4));
      const fieldCoverageRatio = Number((fieldPixels / total).toFixed(4));
      const landContainmentProved = landRatio >= 0.035 && fieldCoverageRatio >= 0.06;

      state.textureAtlas = {
        width,
        height,
        data,
        createdAt: Date.now(),
        contract: INTERNAL_CONTRACT,
        generationStandard: GENERATION_STANDARD,
        containmentModel: "continuous-field",
        closedContainmentUsed: false
      };

      state.textureAtlasBuilt = true;
      state.textureAtlasBuildComplete = true;
      state.textureAtlasVersion = `${INTERNAL_CONTRACT}__${Date.now()}`;
      state.textureAtlasLandRatio = landRatio;
      state.textureAtlasWaterRatio = waterRatio;
      state.textureAtlasHydrologyRatio = hydrologyRatio;
      state.textureAtlasSurfaceRatio = surfaceRatio;
      state.textureAtlasFieldCoverageRatio = fieldCoverageRatio;
      state.textureAtlasLandContainmentProved = landContainmentProved;

      state.textureAtlasConsumesContinents = state.continentsLoaded;
      state.textureAtlasConsumesGratitudeTopology = state.topologyLoaded && state.topologyContractValid;
      state.textureAtlasConsumesGratitudeHydrology = state.hydrologyLoaded && state.hydrologyContractValid;
      state.textureAtlasConsumesGratitudeSurface = state.surfaceLoaded && state.surfaceContractValid && surfaceRatio > 0;

      state.textureAtlasClosedContainmentUsed = false;
      state.planetMaterialIntegrated = landContainmentProved;

      publishReceipt("texture-atlas-built");
      requestRender("texture-atlas-built");

      return state.textureAtlas;
    } catch (error) {
      state.textureAtlasError = error && error.message ? error.message : String(error);
      recordError("buildTextureAtlas", error);
      state.textureAtlasBuildComplete = true;
      return null;
    }
  }

  function textureSample(texture, u, v) {
    if (!texture || !texture.data) return [8, 52, 104];

    const x = Math.floor(wrap01(u) * texture.width) % texture.width;
    const y = clamp(Math.floor(clamp01(v) * (texture.height - 1)), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    ];
  }

  function hasAcceptableMotionSource(projection) {
    if (!projection || typeof projection !== "object") return false;

    const dragMode = String(projection.dragMode || projection.mode || "").toLowerCase();
    const noStretch =
      projection.noStretch === true ||
      projection.spherical === true ||
      projection.screenPlaneDragForbidden === true ||
      dragMode.includes("spherical");

    return noStretch;
  }

  function readMotionState() {
    const motion = resolveMotionApi();

    if (motion && typeof motion.getProjectionState === "function") {
      const projection = safe(() => motion.getProjectionState(), null);

      if (hasAcceptableMotionSource(projection)) {
        state.motionConsumed = true;
        return {
          rotation: wrapRadians(
            Number.isFinite(Number(projection.longitudeRotationRadians))
              ? projection.longitudeRotationRadians
              : Number.isFinite(Number(projection.rotation))
                ? projection.rotation
                : state.rotation
          ),
          pitch: clamp(
            Number.isFinite(Number(projection.pitchRadians))
              ? projection.pitchRadians
              : Number.isFinite(Number(projection.pitch))
                ? projection.pitch
                : state.pitch,
            MOTION.minPitch,
            MOTION.maxPitch
          ),
          dragging: Boolean(projection.dragging),
          source: "motion-api",
          dragMode: projection.dragMode || ""
        };
      }
    }

    if (motion && typeof motion.getState === "function") {
      const projection = safe(() => motion.getState(), null);

      if (hasAcceptableMotionSource(projection)) {
        state.motionConsumed = true;

        return {
          rotation: wrapRadians(
            Number.isFinite(Number(projection.longitudeRotationRadians))
              ? projection.longitudeRotationRadians
              : Number.isFinite(Number(projection.rotation))
                ? projection.rotation
                : state.rotation
          ),
          pitch: clamp(
            Number.isFinite(Number(projection.pitchRadians))
              ? projection.pitchRadians
              : Number.isFinite(Number(projection.pitch))
                ? projection.pitch
                : state.pitch,
            MOTION.minPitch,
            MOTION.maxPitch
          ),
          dragging: Boolean(projection.dragging),
          source: "motion-state",
          dragMode: projection.dragMode || ""
        };
      }
    }

    return {
      rotation: state.rotation,
      pitch: state.pitch,
      dragging: state.dragging,
      source: "parent-field-atlas-local",
      dragMode: "spherical-state"
    };
  }

  function updateLocalMotion(dtMs) {
    const dt = clamp(dtMs, 0, 80);

    if (!state.dragging && !state.reducedMotion) {
      state.targetRotation = wrapRadians(state.targetRotation + MOTION.autoRotateSpeed * dt);
    }

    if (!state.dragging && Math.abs(state.velocity) > MOTION.inertiaMin) {
      state.targetRotation = wrapRadians(state.targetRotation + state.velocity * dt);
      state.velocity *= MOTION.inertiaDecay;
    } else if (!state.dragging) {
      state.velocity = 0;
    }

    if (!state.dragging && Math.abs(state.pitchVelocity) > MOTION.inertiaMin) {
      state.targetPitch = clamp(state.targetPitch + state.pitchVelocity * dt, MOTION.minPitch, MOTION.maxPitch);
      state.pitchVelocity *= MOTION.inertiaDecay;
    } else if (!state.dragging) {
      state.pitchVelocity = 0;
    }

    state.rotation = wrapRadians(state.rotation + wrapRadians(state.targetRotation - state.rotation) * MOTION.smoothing);
    state.pitch = clamp(state.pitch + (state.targetPitch - state.pitch) * MOTION.pitchSmoothing, MOTION.minPitch, MOTION.maxPitch);
  }

  function buildSphereImage(texture, motion, time) {
    if (!state.sphereCtx || !state.sphereCanvas) return false;

    const size = state.sphereSize || GEOMETRY.spherePixelsDrag;
    const radius = size * 0.5;
    const image = state.sphereCtx.createImageData(size, size);
    const out = image.data;

    const rotation = motion.rotation;
    const pitch = motion.pitch;
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);
    const light = [-0.46, 0.30, 0.84];
    const cloudShift = time * 0.000034;

    for (let y = 0; y < size; y += 1) {
      const ny = (y + 0.5 - radius) / radius;

      for (let x = 0; x < size; x += 1) {
        const nx = (x + 0.5 - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const index = (y * size + x) * 4;

        if (d2 > 1) {
          out[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);

        const y3 = -ny * cosPitch - z * sinPitch;
        const z3 = -ny * sinPitch + z * cosPitch;
        const x3 = nx;

        const latitude = Math.asin(clamp(y3, -1, 1));
        const longitude = Math.atan2(x3, z3) + rotation;
        const u = longitude / TAU + 0.5;
        const v = 0.5 - latitude / Math.PI;

        let color = textureSample(texture, u, v);

        const lightDot = clamp(x3 * light[0] + y3 * light[1] + z * light[2], -1, 1);
        const daylight = 0.31 + Math.max(0, lightDot) * 0.86;
        const night = smoothstep(-0.52, 0.13, lightDot);
        const limb = Math.pow(1 - z, 1.72);
        const rim = Math.pow(1 - z, 3.10);

        const cloudNoise = fbm(
          longitude * 1.85 + Math.sin(latitude * 4.0) * 0.30 + cloudShift,
          latitude * 2.7 - cloudShift,
          760000,
          4
        );

        const cloud = smoothstep(0.71, 0.90, cloudNoise) * smoothstep(-0.94, 0.55, lightDot) * 0.12;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.42, r, night);
        g = lerp(g * 0.50, g, night);
        b = lerp(b * 0.70, b, night);

        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);

        r = lerp(r, COLORS.atmosphere[0], limb * 0.24);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.20);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.26);

        r = lerp(r, COLORS.atmosphereBright[0], rim * 0.34);
        g = lerp(g, COLORS.atmosphereBright[1], rim * 0.30);
        b = lerp(b, COLORS.atmosphereBright[2], rim * 0.32);

        out[index] = clamp(Math.round(r), 0, 255);
        out[index + 1] = clamp(Math.round(g), 0, 255);
        out[index + 2] = clamp(Math.round(b), 0, 255);
        out[index + 3] = clamp(Math.round(255 * smoothstep(1.006, 0.985, d2)), 0, 255);
      }
    }

    state.sphereCtx.putImageData(image, 0, 0);

    return true;
  }

  function drawBackground(ctx) {
    ctx.clearRect(0, 0, state.width, state.height);

    const bg = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.radius * 0.08,
      state.cx,
      state.cy,
      Math.max(state.width, state.height) * 0.76
    );

    bg.addColorStop(0, "rgba(10, 50, 72, 0.72)");
    bg.addColorStop(0.38, "rgba(4, 15, 36, 0.98)");
    bg.addColorStop(1, "rgba(1, 4, 13, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.save();
    ctx.globalAlpha = 0.42;

    for (let i = 0; i < 64; i += 1) {
      const x = hash2(i, 13, 9101) * state.width;
      const y = hash2(i, 17, 9102) * state.height;
      const r = 0.55 + hash2(i, 19, 9103) * 1.5;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(214, 244, 238, 0.12)";
      ctx.fill();
    }

    ctx.restore();

    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.44, state.cx, state.cy, state.radius * 1.42);
    glow.addColorStop(0, "rgba(158, 240, 191, 0.018)");
    glow.addColorStop(0.56, "rgba(141, 216, 255, 0.08)");
    glow.addColorStop(0.82, "rgba(158, 240, 191, 0.11)");
    glow.addColorStop(1, "rgba(158, 240, 191, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.42, 0, TAU);
    ctx.fill();
  }

  function drawFallbackSphere(ctx, time) {
    const ocean = ctx.createRadialGradient(
      state.cx - state.radius * 0.28,
      state.cy - state.radius * 0.36,
      state.radius * 0.05,
      state.cx,
      state.cy,
      state.radius * 1.10
    );

    ocean.addColorStop(0, "rgb(35, 150, 190)");
    ocean.addColorStop(0.34, "rgb(7, 82, 135)");
    ocean.addColorStop(0.76, "rgb(3, 26, 70)");
    ocean.addColorStop(1, "rgb(2, 12, 36)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.clip();
    ctx.fillStyle = ocean;
    ctx.fillRect(state.cx - state.radius, state.cy - state.radius, state.radius * 2, state.radius * 2);

    const drift = Math.sin(time * 0.00035) * state.radius * 0.02;
    ctx.fillStyle = "rgba(80, 156, 94, 0.48)";
    ctx.beginPath();
    ctx.ellipse(state.cx - state.radius * 0.25 + drift, state.cy - state.radius * 0.04, state.radius * 0.32, state.radius * 0.48, -0.30, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawAtmosphere(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const halo = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.radius * 0.86,
      state.cx,
      state.cy,
      state.radius * GEOMETRY.atmosphereRadius
    );

    halo.addColorStop(0, "rgba(142, 202, 226, 0)");
    halo.addColorStop(0.40, "rgba(142, 202, 226, 0.042)");
    halo.addColorStop(0.76, "rgba(142, 202, 226, 0.110)");
    halo.addColorStop(1, "rgba(142, 202, 226, 0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * GEOMETRY.atmosphereRadius, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();

    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius + Math.max(1, state.width * 0.0014), 0, TAU);
    ctx.strokeStyle = "rgba(190, 226, 255, 0.30)";
    ctx.lineWidth = Math.max(1, state.width * 0.0025);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius + Math.max(2, state.width * 0.008), 0, TAU);
    ctx.strokeStyle = "rgba(108, 185, 232, 0.12)";
    ctx.lineWidth = Math.max(1, state.width * 0.0045);
    ctx.stroke();

    ctx.restore();
  }

  function drawFrame(reason = "render") {
    state.renderScheduled = false;

    if (state.disposed || !state.ctx || !state.canvas) return;

    const time = now();

    try {
      enforceNoStretch();
      resize();
      syncAuthorities();

      const ctx = state.ctx;
      const dt = clamp(time - (state.lastFrameTime || time), 0, 80);
      state.lastFrameTime = time;

      updateLocalMotion(dt);

      const motion = readMotionState();

      drawBackground(ctx);

      if (!state.textureAtlasBuilt || !state.textureAtlas) {
        buildTextureAtlas();
      }

      if (state.textureAtlas && buildSphereImage(state.textureAtlas, motion, time)) {
        const diameter = state.radius * 2;
        ctx.drawImage(state.sphereCanvas, state.cx - state.radius, state.cy - state.radius, diameter, diameter);
      } else {
        drawFallbackSphere(ctx, time);
      }

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.22;

      const spec = ctx.createRadialGradient(
        state.cx - state.radius * 0.25,
        state.cy - state.radius * 0.36,
        0,
        state.cx - state.radius * 0.25,
        state.cy - state.radius * 0.36,
        state.radius * 0.70
      );

      spec.addColorStop(0, "rgba(255, 255, 255, 0.52)");
      spec.addColorStop(0.28, "rgba(214, 255, 235, 0.17)");
      spec.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
      ctx.fill();
      ctx.restore();

      drawAtmosphere(ctx);

      state.renderCount += 1;
      state.formVisible = true;
      state.lastRenderTime = time;
      state.lastRenderReason = reason;
      state.lastDrawError = "";

      publishReceipt(`draw-${reason}`);
    } catch (error) {
      recordError("drawFrame", error);
    }
  }

  function requestRender(reason = "external") {
    state.requestRenderCount += 1;

    if (state.renderScheduled) return api;

    state.renderScheduled = true;

    if (hasWindow() && typeof window.requestAnimationFrame === "function") {
      state.frameId = window.requestAnimationFrame(() => drawFrame(String(reason || "request")));
    } else {
      setTimeout(() => drawFrame(String(reason || "request")), 16);
    }

    return api;
  }

  function startLoop() {
    if (!hasWindow()) return;

    function loop(t) {
      if (state.disposed) return;

      const time = Number.isFinite(Number(t)) ? Number(t) : now();

      if (
        state.dragging ||
        Math.abs(state.velocity) > MOTION.inertiaMin ||
        Math.abs(state.pitchVelocity) > MOTION.inertiaMin ||
        time - state.lastLoopRenderTime > MOTION.idleFrameMs
      ) {
        state.lastLoopRenderTime = time;
        requestRender("motion-loop");
      }

      state.loopId = window.requestAnimationFrame(loop);
    }

    state.loopId = window.requestAnimationFrame(loop);
  }

  function pointerDown(event) {
    state.dragging = true;
    state.lastX = finite(event.clientX, 0);
    state.lastY = finite(event.clientY, 0);
    state.lastPointerTime = now();
    state.velocity = 0;
    state.pitchVelocity = 0;
    state.lastMotionReason = "pointer-down";

    if (event.currentTarget && event.currentTarget.style) {
      event.currentTarget.style.cursor = "grabbing";
    }

    try {
      if (event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    } catch (_error) {}

    try {
      event.preventDefault();
    } catch (_error) {}

    requestRender("pointer-down");
  }

  function pointerMove(event) {
    if (!state.dragging) return;

    const x = finite(event.clientX, state.lastX);
    const y = finite(event.clientY, state.lastY);
    const t = now();
    const dx = x - state.lastX;
    const dy = y - state.lastY;
    const dt = Math.max(1, t - (state.lastPointerTime || t));

    state.lastX = x;
    state.lastY = y;
    state.lastPointerTime = t;

    const rotationDelta = dx * MOTION.dragRadiansPerPixel;
    const pitchDelta = dy * MOTION.pitchRadiansPerPixel;

    state.targetRotation = wrapRadians(state.targetRotation + rotationDelta);
    state.targetPitch = clamp(state.targetPitch + pitchDelta, MOTION.minPitch, MOTION.maxPitch);
    state.rotation = wrapRadians(state.rotation + rotationDelta * 0.90);
    state.pitch = clamp(state.pitch + pitchDelta * 0.90, MOTION.minPitch, MOTION.maxPitch);

    state.velocity = clamp(rotationDelta / dt, -MOTION.maxVelocity, MOTION.maxVelocity);
    state.pitchVelocity = clamp(pitchDelta / dt, -MOTION.maxVelocity, MOTION.maxVelocity);

    publishMotionState("pointer-move");

    try {
      event.preventDefault();
    } catch (_error) {}

    requestRender("pointer-move");
  }

  function pointerUp(event) {
    if (!state.dragging) return;

    state.dragging = false;
    state.lastMotionReason = "pointer-up";

    if (event && event.currentTarget && event.currentTarget.style) {
      event.currentTarget.style.cursor = "grab";
    }

    try {
      if (event && event.currentTarget && typeof event.currentTarget.releasePointerCapture === "function") {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_error) {}

    try {
      if (event && typeof event.preventDefault === "function") event.preventDefault();
    } catch (_error) {}

    publishMotionState("pointer-up");
    requestRender("pointer-up");
  }

  function wheel(event) {
    const delta = clamp(finite(event.deltaY, 0), -120, 120);
    state.targetPitch = clamp(state.targetPitch + delta * 0.0009, MOTION.minPitch, MOTION.maxPitch);

    try {
      event.preventDefault();
    } catch (_error) {}

    publishMotionState("wheel");
    requestRender("wheel");
  }

  function bindCanvasEvents(canvas) {
    if (!canvas || !canvas.addEventListener) return;

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });
    canvas.addEventListener("lostpointercapture", pointerUp, { passive: false });
    canvas.addEventListener("wheel", wheel, { passive: false });
  }

  function publishMotionState(reason) {
    if (!hasWindow()) return;

    window.AUDRALIA_MOTION_STATE = {
      contract: INTERNAL_CONTRACT,
      dragMode: "spherical-state",
      noStretch: true,
      spherical: true,
      screenPlaneDragForbidden: true,
      rotation: state.rotation,
      targetRotation: state.targetRotation,
      longitudeRotation: state.rotation,
      longitudeRotationRadians: state.rotation,
      yaw: state.rotation,
      yawRadians: state.rotation,
      pitch: state.pitch,
      targetPitch: state.targetPitch,
      pitchRadians: state.pitch,
      tilt: state.pitch,
      dragging: state.dragging,
      velocity: state.velocity,
      pitchVelocity: state.pitchVelocity,
      source: "g28-parent-field-atlas",
      reason
    };

    window.AUDRALIA_ROTATION = state.rotation;
    window.AUDRALIA_LONGITUDE_ROTATION = state.rotation;
    window.AUDRALIA_PITCH = state.pitch;
    window.AUDRALIA_TILT = state.pitch;

    try {
      window.dispatchEvent(new CustomEvent("audralia:motion:update", { detail: window.AUDRALIA_MOTION_STATE }));
    } catch (_error) {}
  }

  function hasAcceptableContract(actual, expected, fallbackTerm) {
    const value = String(actual || "");
    if (!value) return false;
    if (value === expected) return true;
    return fallbackTerm ? value.includes(fallbackTerm) : false;
  }

  function resolveMotionApi() {
    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_MOTION ||
      window.AUDRALIA_CLEAN_MOTION ||
      window.AUDRALIA_CLEAN_CANVAS_MOTION ||
      window.AUDRALIA_CLEAN_CANVAS_MOTION_ENGINE ||
      window.AUDRALIA_MOTION_ENGINE ||
      null
    );
  }

  function resolveContinentsApi() {
    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_CLEAN_CANVAS_CONTINENTS ||
      window.AUDRALIA_CONTINENTS_ENGINE ||
      window.AUDRALIA_CLEAN_CONTINENTS_ENGINE ||
      window.AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE ||
      window.AudraliaContinents ||
      window.audraliaContinents ||
      null
    );
  }

  function resolveTopologyApi() {
    if (!hasWindow()) return null;
    return window.AUDRALIA_TOPOLOGY_GRATITUDE || null;
  }

  function resolveHydrologyApi() {
    if (!hasWindow()) return null;
    return window.AUDRALIA_GRATITUDE_HYDROLOGY || null;
  }

  function resolveSurfaceApi() {
    if (!hasWindow()) return null;
    return window.AUDRALIA_GRATITUDE_SURFACE || null;
  }

  function readContract(api, objectValue) {
    if (api && typeof api.getStatus === "function") {
      const status = safe(() => api.getStatus(), null);
      if (status && status.contract) return String(status.contract);
      if (status && status.internalContract) return String(status.internalContract);
    }

    if (api && typeof api.status === "function") {
      const status = safe(() => api.status(), null);
      if (status && status.contract) return String(status.contract);
      if (status && status.internalContract) return String(status.internalContract);
    }

    return String(
      (api && (api.CONTRACT || api.contract || api.INTERNAL_CONTRACT || api.internalContract)) ||
        (objectValue && objectValue.contract) ||
        ""
    );
  }

  async function loadChildren() {
    if (state.childLoadStarted && state.childLoadComplete) return true;

    state.childLoadStarted = true;
    publishReceipt("child-load-start");

    await Promise.all([
      loadScript(PATHS.motion, "motion"),
      loadScript(PATHS.continents, "continents"),
      loadScript(PATHS.gratitudeTopology, "gratitude-topology"),
      loadScript(PATHS.gratitudeHydrology, "gratitude-hydrology"),
      loadScript(PATHS.gratitudeSurface, "gratitude-surface"),
      loadScript(PATHS.sky, "sky")
    ]);

    syncAuthorities();

    const motion = resolveMotionApi();

    if (motion && typeof motion.bind === "function") {
      safe(() => motion.bind(state.mountNode || state.canvas, { parent: api }), null);
    } else if (motion && typeof motion.mount === "function") {
      safe(() => motion.mount(state.mountNode || state.canvas, { parent: api }), null);
    }

    state.childLoadComplete = true;

    publishReceipt("child-load-complete");

    rebuildTextureAtlas();
    requestRender("child-load-complete");

    return true;
  }

  function syncAuthorities() {
    const motion = resolveMotionApi();
    const continents = resolveContinentsApi();
    const topologyApi = resolveTopologyApi();
    const hydrologyApi = resolveHydrologyApi();
    const surfaceApi = resolveSurfaceApi();

    state.motionLoaded = Boolean(motion);
    state.motionContract = readContract(motion, null);
    state.motionContractValid = hasAcceptableContract(state.motionContract, EXPECTED.motion, "MOTION");

    state.continentsLoaded = Boolean(continents);
    if (continents && typeof continents.getStatus === "function") {
      const status = safe(() => continents.getStatus(), {});
      state.continentsContract = String(status.contract || continents.contract || "");
      state.continentsInternalContract = String(status.internalContract || continents.INTERNAL_CONTRACT || "");
      state.continentsBrokerConsumed = true;
    } else if (continents) {
      state.continentsContract = String(continents.contract || continents.CONTRACT || "");
      state.continentsInternalContract = String(continents.internalContract || continents.INTERNAL_CONTRACT || "");
      state.continentsBrokerConsumed = true;
    }

    let topology = null;

    if (topologyApi && typeof topologyApi.getTopology === "function") {
      topology = safe(() => topologyApi.getTopology(), null);
    }

    state.topologyLoaded = Boolean(topology);
    state.topologyObject = topology;
    state.topologyContract = readContract(topologyApi, topology);
    state.topologyContractValid = hasAcceptableContract(state.topologyContract, EXPECTED.topology, "GRATITUDE");

    let hydrology = null;

    if (hydrologyApi && typeof hydrologyApi.getHydrology === "function") {
      hydrology = safe(() => hydrologyApi.getHydrology(), null);
    }

    state.hydrologyLoaded = Boolean(hydrology);
    state.hydrologyObject = hydrology;
    state.hydrologyContract = readContract(hydrologyApi, hydrology);
    state.hydrologyContractValid = hasAcceptableContract(state.hydrologyContract, EXPECTED.hydrology, "GRATITUDE");

    state.surfaceLoaded = Boolean(surfaceApi && typeof surfaceApi.sampleSurface === "function");
    state.surfaceApi = surfaceApi;
    state.surfaceContract = readContract(surfaceApi, null);
    state.surfaceContractValid = hasAcceptableContract(state.surfaceContract, EXPECTED.surface, "GRATITUDE");

    state.skyLoaded = Boolean(
      hasWindow() &&
        (
          window.AUDRALIA_SKY ||
          window.AUDRALIA_CLEAN_SKY ||
          window.AUDRALIA_CLEAN_CANVAS_SKY ||
          window.AUDRALIA_SKY_ENGINE
        )
    );
  }

  function getRoot() {
    return hasDocument() ? document.documentElement : null;
  }

  function getCacheNonce() {
    if (state.cacheNonce) return state.cacheNonce;

    const root = getRoot();

    const fromRoot =
      root &&
      (
        root.getAttribute("data-audralia-page-cache-nonce") ||
        root.getAttribute("data-audralia-route-bridge-cache-key") ||
        root.getAttribute("data-html-cache-key")
      );

    const fromBootstrap =
      hasWindow() &&
      window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT &&
      window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey
        ? String(window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey)
        : "";

    const fromWindow =
      hasWindow() && window.AUDRALIA_PAGE_CACHE_NONCE
        ? String(window.AUDRALIA_PAGE_CACHE_NONCE)
        : "";

    state.cacheNonce =
      fromWindow ||
      fromBootstrap ||
      fromRoot ||
      `${INTERNAL_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

    if (hasWindow()) window.AUDRALIA_PAGE_CACHE_NONCE = state.cacheNonce;

    if (root) {
      root.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce);
      root.setAttribute("data-audralia-g28-field-atlas-cache-nonce", state.cacheNonce);
    }

    return state.cacheNonce;
  }

  function versioned(path) {
    return `${path}?v=${encodeURIComponent(getCacheNonce())}`;
  }

  function scriptLoaded(path) {
    if (!hasDocument()) return false;

    return Array.from(document.scripts).some((script) => {
      const src = script.getAttribute("src") || "";
      return src === versioned(path) || src.startsWith(`${path}?`);
    });
  }

  function loadScript(path, key) {
    if (!hasDocument()) return Promise.resolve(false);

    if (scriptLoaded(path)) return Promise.resolve(true);

    const src = versioned(path);

    if (loadPromises.has(src)) return loadPromises.get(src);

    const promise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-g28-loader", INTERNAL_CONTRACT);
      script.setAttribute("data-audralia-g28-child", key);
      script.setAttribute("data-generated-image", "false");
      script.setAttribute("data-graphic-box", "false");
      script.setAttribute("data-visual-pass-claimed", "false");

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.head.appendChild(script);
    });

    loadPromises.set(src, promise);

    return promise;
  }

  function resolveMountNode(node) {
    if (node && node.nodeType === 1) return node;

    if (!hasDocument()) return null;

    return (
      document.querySelector("[data-audralia-form-mount='true']") ||
      document.querySelector("[data-audralia-mount='true']") ||
      document.querySelector("[data-audralia-stage='true']") ||
      document.querySelector("#audralia-form-mount") ||
      document.querySelector("#audralia-stage") ||
      document.querySelector("#main") ||
      document.body
    );
  }

  function prepareMount(node) {
    if (!node || !node.style) return;

    node.style.position = node.style.position || "relative";
    node.style.overflow = "hidden";
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.style.WebkitUserSelect = "none";

    if (!node.style.minHeight) {
      node.style.minHeight = `${GEOMETRY.fallbackStageHeight}px`;
    }

    node.setAttribute("data-audralia-parent-contract", CONTRACT);
    node.setAttribute("data-audralia-parent-internal-contract", INTERNAL_CONTRACT);
    node.setAttribute("data-audralia-generation-standard", GENERATION_STANDARD);
    node.setAttribute("data-audralia-g28-field-atlas-renderer", "true");
    node.setAttribute("data-audralia-motion-no-stretch", "true");

    suppressTransforms(node);
  }

  function suppressTransforms(node) {
    if (!node || !node.style) return 0;

    let count = 0;

    if (node.style.transform && node.style.transform !== "none") {
      node.style.transform = "none";
      count += 1;
    }

    if (node.style.translate && node.style.translate !== "none") {
      node.style.translate = "none";
      count += 1;
    }

    if (node.style.scale && node.style.scale !== "none") {
      node.style.scale = "none";
      count += 1;
    }

    if (node.style.rotate && node.style.rotate !== "none") {
      node.style.rotate = "none";
      count += 1;
    }

    node.style.transformOrigin = "50% 50%";

    return count;
  }

  function enforceNoStretch() {
    let count = 0;

    count += suppressTransforms(state.mountNode);
    count += suppressTransforms(state.canvas);

    if (hasDocument()) {
      document
        .querySelectorAll(
          "canvas[data-audralia-g27-atlas-canvas='true'],canvas[data-audralia-g28-field-atlas-canvas='true'],canvas[data-audralia-visible-canvas='true'],[data-audralia-motion-no-stretch='true']"
        )
        .forEach((node) => {
          count += suppressTransforms(node);
          if (node.style) {
            node.style.touchAction = "none";
            node.style.userSelect = "none";
            node.style.WebkitUserSelect = "none";
          }
        });
    }

    return count;
  }

  function ensureCanvas() {
    if (!hasDocument() || !state.mountNode) return false;

    state.mountNode
      .querySelectorAll("canvas[data-audralia-g27-atlas-canvas='true'], canvas[data-audralia-g28-field-atlas-canvas='true']")
      .forEach((node) => node.remove());

    const canvas = document.createElement("canvas");

    canvas.setAttribute("data-audralia-g28-field-atlas-canvas", "true");
    canvas.setAttribute("data-audralia-visible-canvas", "true");
    canvas.setAttribute("data-audralia-parent-contract", CONTRACT);
    canvas.setAttribute("data-audralia-parent-internal-contract", INTERNAL_CONTRACT);
    canvas.setAttribute("data-audralia-generation-standard", GENERATION_STANDARD);
    canvas.setAttribute("data-audralia-form-visible", "true");
    canvas.setAttribute("data-audralia-motion-no-stretch", "true");
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-visual-pass-claimed", "false");
    canvas.setAttribute("aria-label", "Audralia field atlas planet renderer");

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      minWidth: `${GEOMETRY.minCanvasSize}px`,
      minHeight: `${GEOMETRY.minCanvasSize}px`,
      display: "block",
      zIndex: "4",
      background: "transparent",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      cursor: "grab",
      transform: "none",
      transformOrigin: "50% 50%"
    });

    state.mountNode.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    state.sphereCanvas = document.createElement("canvas");
    state.sphereCtx = state.sphereCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });

    bindCanvasEvents(canvas);

    return Boolean(state.ctx && state.sphereCtx);
  }

  function getBestRect() {
    if (!state.mountNode || typeof state.mountNode.getBoundingClientRect !== "function") {
      const size = hasWindow() ? Math.min(window.innerWidth || 420, GEOMETRY.maxCanvasSize) : 420;
      return { width: size, height: size };
    }

    const mountRect = state.mountNode.getBoundingClientRect();
    const parentRect =
      state.mountNode.parentElement &&
      typeof state.mountNode.parentElement.getBoundingClientRect === "function"
        ? state.mountNode.parentElement.getBoundingClientRect()
        : null;

    const candidates = [mountRect, parentRect].filter(Boolean);
    const usable = candidates.find((rect) => rect.width >= 120 && rect.height >= 120);

    if (usable) return usable;

    const width = hasWindow() ? Math.min(window.innerWidth || 420, GEOMETRY.maxCanvasSize) : 420;

    return {
      width,
      height: Math.max(GEOMETRY.fallbackStageHeight, width)
    };
  }

  function resize() {
    if (!state.canvas || !state.ctx || !state.sphereCanvas) return false;

    const rect = getBestRect();
    const dpr = Math.min(GEOMETRY.maxDpr, hasWindow() ? window.devicePixelRatio || 1 : 1);

    const cssWidth = Math.max(GEOMETRY.minCanvasSize, Math.floor(rect.width || GEOMETRY.minCanvasSize));
    const cssHeight = Math.max(GEOMETRY.minCanvasSize, Math.floor(rect.height || rect.width || GEOMETRY.minCanvasSize));

    const width = Math.max(GEOMETRY.minCanvasSize, Math.floor(cssWidth * dpr));
    const height = Math.max(GEOMETRY.minCanvasSize, Math.floor(cssHeight * dpr));

    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.dpr = dpr;

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.width = width;
    state.height = height;

    const base = Math.min(width, height);
    state.cx = width * GEOMETRY.centerX;
    state.cy = height * GEOMETRY.centerY;
    state.radius = base * GEOMETRY.radiusRatio;

    const desiredSphere = clamp(
      Math.floor((state.dragging ? GEOMETRY.spherePixelsDrag : GEOMETRY.spherePixelsIdle) * clamp(base / 620, 0.72, 1.08)),
      GEOMETRY.minSpherePixels,
      GEOMETRY.maxSpherePixels
    );

    state.sphereSize = desiredSphere;

    if (state.sphereCanvas.width !== desiredSphere) state.sphereCanvas.width = desiredSphere;
    if (state.sphereCanvas.height !== desiredSphere) state.sphereCanvas.height = desiredSphere;

    return true;
  }

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.lastDrawError = `${scope}: ${message}`;
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
    publishReceipt(scope);
  }

  function mount(node, options = {}) {
    const mountNode = resolveMountNode(node);

    if (!mountNode) {
      recordError("mount", "mount_node_missing");
      return api;
    }

    state.mountNode = mountNode;
    state.disposed = false;
    state.mounted = true;
    state.booted = true;
    state.reducedMotion =
      hasWindow() &&
      window.matchMedia &&
      safe(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, false);

    prepareMount(mountNode);

    if (!ensureCanvas()) {
      recordError("mount", "canvas_context_unavailable");
      return api;
    }

    resize();

    if (hasWindow()) {
      window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
      window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
      window.AUDRALIA_CLEAN_ENGINE_PARENT = api;
      window.AUDRALIA_ENGINE = api;
      window.AUDRALIA_CLEAN_PARENT_ENGINE = api;
      window.AUDRALIA_PARENT_FIELD_ATLAS_ENGINE = api;

      window.addEventListener("resize", () => requestRender("resize"), { passive: true });
      window.addEventListener("audralia:motion:update", () => requestRender("motion-update"), { passive: true });
    }

    drawFrame("mount-fallback");

    loadChildren().catch((error) => recordError("loadChildren", error));

    startLoop();
    publishReceipt("mount");

    return api;
  }

  function render() {
    return requestRender("render");
  }

  function redraw() {
    return requestRender("redraw");
  }

  function start(node, options = {}) {
    return mount(node, options);
  }

  function boot(node, options = {}) {
    return mount(node, options);
  }

  function init(node, options = {}) {
    return mount(node, options);
  }

  function create(node, options = {}) {
    return mount(node, options);
  }

  function dispose() {
    state.disposed = true;

    if (state.frameId && hasWindow()) {
      window.cancelAnimationFrame(state.frameId);
    }

    if (state.loopId && hasWindow()) {
      window.cancelAnimationFrame(state.loopId);
    }

    state.frameId = 0;
    state.loopId = 0;
    state.renderScheduled = false;

    if (state.canvas && state.canvas.parentElement) {
      state.canvas.remove();
    }

    state.canvas = null;
    state.ctx = null;
    state.sphereCanvas = null;
    state.sphereCtx = null;
    state.mounted = false;
    state.formVisible = false;

    publishReceipt("dispose");

    return api;
  }

  function rebuildTextureAtlas() {
    state.textureAtlas = null;
    state.textureAtlasBuilt = false;
    state.textureAtlasBuildStarted = false;
    state.textureAtlasBuildComplete = false;
    buildTextureAtlas();
    return api;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      generationStandard: GENERATION_STANDARD,
      receipt: RECEIPT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      target: TARGET,
      route: ROUTE,

      renderModel: "field-atlas-sphere-renderer",
      fieldAtlasActive: true,
      continuousFieldLandMask: true,
      closedBoundaryContainmentReleased: true,
      boundaryDrawingPrimary: false,
      projectedOverlayPrimaryRenderer: false,
      projectedOverlayDemoted: true,

      mounted: state.mounted,
      booted: state.booted,
      disposed: state.disposed,
      formVisible: state.formVisible,

      geometry: {
        width: state.width,
        height: state.height,
        cssWidth: state.cssWidth,
        cssHeight: state.cssHeight,
        dpr: state.dpr,
        cx: state.cx,
        cy: state.cy,
        radius: state.radius,
        sphereSize: state.sphereSize,
        textureWidth: GEOMETRY.textureWidth,
        textureHeight: GEOMETRY.textureHeight
      },

      cacheNonce: state.cacheNonce || getCacheNonce(),

      textureAtlasBuilt: state.textureAtlasBuilt,
      textureAtlasBuildStarted: state.textureAtlasBuildStarted,
      textureAtlasBuildComplete: state.textureAtlasBuildComplete,
      textureAtlasVersion: state.textureAtlasVersion,
      textureAtlasError: state.textureAtlasError,
      textureAtlasLandRatio: state.textureAtlasLandRatio,
      textureAtlasWaterRatio: state.textureAtlasWaterRatio,
      textureAtlasHydrologyRatio: state.textureAtlasHydrologyRatio,
      textureAtlasSurfaceRatio: state.textureAtlasSurfaceRatio,
      textureAtlasFieldCoverageRatio: state.textureAtlasFieldCoverageRatio,
      textureAtlasContainmentModel: "continuous-field",
      textureAtlasClosedContainmentUsed: false,
      textureAtlasLandContainmentProved: state.textureAtlasLandContainmentProved,
      textureAtlasConsumesContinents: state.textureAtlasConsumesContinents,
      textureAtlasConsumesGratitudeTopology: state.textureAtlasConsumesGratitudeTopology,
      textureAtlasConsumesGratitudeHydrology: state.textureAtlasConsumesGratitudeHydrology,
      textureAtlasConsumesGratitudeSurface: state.textureAtlasConsumesGratitudeSurface,

      motionRedrawUsesCachedAtlas: true,
      dragFrameLiveChildSampling: false,
      sphereUvLookupActive: true,
      planetMaterialIntegrated: state.planetMaterialIntegrated,

      motionLoaded: state.motionLoaded,
      motionContract: state.motionContract,
      motionExpectedContract: EXPECTED.motion,
      motionContractValid: state.motionContractValid,
      motionConsumed: state.motionConsumed,

      continentsLoaded: state.continentsLoaded,
      continentsContract: state.continentsContract,
      continentsInternalContract: state.continentsInternalContract,
      continentsExpectedInternalContract: EXPECTED.continentsInternal,
      continentsBrokerConsumed: state.continentsBrokerConsumed,
      continentsDrawingPrimary: false,

      topologyLoaded: state.topologyLoaded,
      topologyContract: state.topologyContract,
      topologyExpectedContract: EXPECTED.topology,
      topologyContractValid: state.topologyContractValid,

      hydrologyLoaded: state.hydrologyLoaded,
      hydrologyContract: state.hydrologyContract,
      hydrologyExpectedContract: EXPECTED.hydrology,
      hydrologyContractValid: state.hydrologyContractValid,

      surfaceLoaded: state.surfaceLoaded,
      surfaceContract: state.surfaceContract,
      surfaceExpectedContract: EXPECTED.surface,
      surfaceContractValid: state.surfaceContractValid,

      skyLoaded: state.skyLoaded,

      rotation: state.rotation,
      pitch: state.pitch,
      dragging: state.dragging,

      canvasTransformForbidden: true,
      cssTransformForbidden: true,
      bitmapStretchForbidden: true,
      screenPlaneDragForbidden: true,

      renderCount: state.renderCount,
      requestRenderCount: state.requestRenderCount,
      lastRenderReason: state.lastRenderReason,
      lastDrawError: state.lastDrawError,

      owns: [
        "canvas composition",
        "visible planet body",
        "field atlas",
        "sphere UV lookup",
        "atmosphere",
        "rim lighting",
        "cheap motion redraw from cached atlas"
      ],

      doesNotOwn: [
        "Gratitude topology",
        "Gratitude hydrology",
        "Gratitude surface material authority",
        "continents truth",
        "terrain elevation",
        "mountains",
        "animals",
        "plants",
        "climate",
        "route bridge",
        "HTML shell"
      ],

      ownsTopology: false,
      ownsHydrology: false,
      ownsSurface: false,
      ownsTerrain: false,
      ownsElevation: false,
      ownsContinentsTruth: false,
      ownsMotionState: false,
      ownsRoute: false,
      ownsHtml: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaim: false,

      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = getStatus();
    receipt.scope = scope;

    window.AUDRALIA_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_PARENT_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_G2_8_PARENT_FIELD_ATLAS_RENDERER_RECEIPT = receipt;

    window.AUDRALIA_ENGINE_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_PARENT_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_G2_8_FIELD_ATLAS_PLANETARY_STANDARD_ACTIVE = true;
    window.AUDRALIA_G2_8_PARENT_FIELD_ATLAS_RENDERER_ACTIVE = true;
    window.AUDRALIA_TEXTURE_ATLAS_BUILT = state.textureAtlasBuilt;
    window.AUDRALIA_FIELD_ATLAS_ACTIVE = true;
    window.AUDRALIA_CONTINUOUS_FIELD_LAND_MASK = true;
    window.AUDRALIA_CLOSED_BOUNDARY_CONTAINMENT_RELEASED = true;
    window.AUDRALIA_BOUNDARY_DRAWING_PRIMARY = false;
    window.AUDRALIA_MOTION_REDRAW_USES_CACHED_ATLAS = true;
    window.AUDRALIA_DRAG_FRAME_LIVE_CHILD_SAMPLING = false;
    window.AUDRALIA_PROJECTED_OVERLAY_PRIMARY_RENDERER = false;

    const root = getRoot();

    if (root) {
      root.dataset.audraliaParentContract = CONTRACT;
      root.dataset.audraliaParentInternalContract = INTERNAL_CONTRACT;
      root.dataset.audraliaGenerationStandard = GENERATION_STANDARD;
      root.dataset.audraliaParentReceipt = RECEIPT;
      root.dataset.audraliaParentFormVisible = state.formVisible ? "true" : "false";
      root.dataset.audraliaRenderModel = "field-atlas-sphere-renderer";
      root.dataset.audraliaFieldAtlasActive = "true";
      root.dataset.audraliaContinuousFieldLandMask = "true";
      root.dataset.audraliaClosedBoundaryContainmentReleased = "true";
      root.dataset.audraliaBoundaryDrawingPrimary = "false";
      root.dataset.audraliaProjectedOverlayPrimaryRenderer = "false";
      root.dataset.audraliaTextureAtlasBuilt = state.textureAtlasBuilt ? "true" : "false";
      root.dataset.audraliaTextureAtlasContainmentModel = "continuous-field";
      root.dataset.audraliaTextureAtlasClosedContainmentUsed = "false";
      root.dataset.audraliaTextureAtlasLandContainmentProved = state.textureAtlasLandContainmentProved ? "true" : "false";
      root.dataset.audraliaTextureAtlasLandRatio = String(state.textureAtlasLandRatio);
      root.dataset.audraliaTextureAtlasWaterRatio = String(state.textureAtlasWaterRatio);
      root.dataset.audraliaTextureAtlasHydrologyRatio = String(state.textureAtlasHydrologyRatio);
      root.dataset.audraliaTextureAtlasSurfaceRatio = String(state.textureAtlasSurfaceRatio);
      root.dataset.audraliaTextureAtlasFieldCoverageRatio = String(state.textureAtlasFieldCoverageRatio);
      root.dataset.audraliaTextureAtlasConsumesContinents = state.textureAtlasConsumesContinents ? "true" : "false";
      root.dataset.audraliaTextureAtlasConsumesGratitudeTopology = state.textureAtlasConsumesGratitudeTopology ? "true" : "false";
      root.dataset.audraliaTextureAtlasConsumesGratitudeHydrology = state.textureAtlasConsumesGratitudeHydrology ? "true" : "false";
      root.dataset.audraliaTextureAtlasConsumesGratitudeSurface = state.textureAtlasConsumesGratitudeSurface ? "true" : "false";
      root.dataset.audraliaMotionRedrawUsesCachedAtlas = "true";
      root.dataset.audraliaDragFrameLiveChildSampling = "false";
      root.dataset.audraliaSphereUvLookupActive = "true";
      root.dataset.audraliaPlanetMaterialIntegrated = state.planetMaterialIntegrated ? "true" : "false";
      root.dataset.audraliaFormVisible = state.formVisible ? "true" : "false";
      root.dataset.generatedImage = "false";
      root.dataset.graphicBox = "false";
      root.dataset.visualPassClaimed = "false";
    }

    try {
      window.dispatchEvent(new CustomEvent("audralia:parent:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:parent:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    contract: CONTRACT,
    CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    INTERNAL_CONTRACT,
    generationStandard: GENERATION_STANDARD,
    receipt: RECEIPT,
    target: TARGET,
    route: ROUTE,

    mount,
    start,
    boot,
    init,
    create,
    dispose,

    render,
    redraw,
    requestRender,

    rebuildTextureAtlas,
    buildTextureAtlas,

    getStatus,
    status: getStatus,
    publishReceipt
  };

  if (hasWindow()) {
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
    window.AUDRALIA_CLEAN_ENGINE_PARENT = api;
    window.AUDRALIA_ENGINE = api;
    window.AUDRALIA_CLEAN_PARENT_ENGINE = api;
    window.AUDRALIA_PARENT_FIELD_ATLAS_ENGINE = api;

    publishReceipt("module-load");
  }
})();
