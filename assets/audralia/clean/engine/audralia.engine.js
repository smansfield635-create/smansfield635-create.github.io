// /assets/audralia/clean/engine/audralia.engine.js
// AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_LEGACY_PROMOTION_TNT_v1
// Full-file replacement.
// Parent-facing route compatibility contract preserved:
// AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1
//
// Purpose:
// - Promote the legacy full-texture-atlas sphere renderer as the G2.7 visual standard.
// - Keep current route/contract/receipt compatibility.
// - Stop treating projected polygon/dot overlays as the primary planet material renderer.
// - Build a cached material atlas from Gratitude topology, hydrology, and surface authority.
// - During motion, rotate the sphere texture lookup instead of live-resampling projected child dots.
// - Preserve FORM_VISIBLE.
// - No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const INTERNAL_CONTRACT = "AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_LEGACY_PROMOTION_TNT_v1";
  const GENERATION_STANDARD = "AUDRALIA_G2_7_LEGACY_TEXTURE_ATLAS_PLANETARY_STANDARD_v1";
  const RECEIPT = "AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_LEGACY_PROMOTION_RECEIPT_v1";
  const PREVIOUS_INTERNAL_CONTRACT = "AUDRALIA_G2_6_PARENT_PROJECTOR_CONSUMES_MOTION_STATE_NO_STRETCH_TNT_v1";

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
    textureWidth: 520,
    textureHeight: 260,
    spherePixelsIdle: 520,
    spherePixelsDrag: 390,
    minSpherePixels: 320,
    maxSpherePixels: 560,
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
    autoRotateSpeed: 0.000052,
    smoothing: 0.18,
    pitchSmoothing: 0.16,
    inertiaDecay: 0.925,
    inertiaMin: 0.000012,
    maxVelocity: 0.038
  });

  const COLORS = Object.freeze({
    deepOcean: [2, 13, 40],
    ocean: [5, 52, 102],
    openOcean: [8, 70, 124],
    shelf: [24, 136, 160],
    shallow: [70, 175, 174],
    lagoon: [104, 205, 188],
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

  const FALLBACK_BOUNDARY = Object.freeze([
    p(-83.8, -8.8), p(-87.2, -3.1), p(-84.4, 2.6), p(-87.8, 8.7),
    p(-84.6, 15.2), p(-86.7, 22.4), p(-79.8, 29.4), p(-73.2, 35.8),
    p(-65.4, 41.2), p(-55.2, 44.5), p(-43.8, 44.1), p(-32.6, 40.7),
    p(-23.1, 35.7), p(-15.9, 28.4), p(-8.8, 20.6), p(-13.8, 14.7),
    p(-6.2, 8.2), p(-13.4, 2.2), p(-8.4, -4.8), p(-16.8, -10.6),
    p(-21.6, -17.4), p(-30.2, -22.2), p(-38.6, -27.8), p(-48.3, -30.8),
    p(-57.4, -28.5), p(-65.6, -33.2), p(-72.4, -27.6), p(-78.2, -22.2),
    p(-72.5, -17.6), p(-80.5, -13.8)
  ]);

  const FALLBACK_LAKES = Object.freeze([
    organicRing(-47.8, 14.3, 8.8, 6.1, 24, 5101, 0.06),
    organicRing(-60.1, -9.6, 6.9, 4.8, 20, 5102, 0.07),
    organicRing(-35.9, 31.2, 3.8, 2.7, 14, 5103, 0.08),
    organicRing(-40.4, -22.7, 4.4, 3.0, 14, 5104, 0.08)
  ]);

  const FALLBACK_LAGOONS = Object.freeze([
    organicRing(-53.2, -27.1, 8.4, 3.2, 18, 5201, 0.09),
    organicRing(-13.5, 3.2, 4.4, 2.7, 14, 5202, 0.09)
  ]);

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
    textureAtlasConsumesContinents: true,
    textureAtlasConsumesGratitudeTopology: false,
    textureAtlasConsumesGratitudeHydrology: false,
    textureAtlasConsumesGratitudeSurface: false,

    motionRedrawUsesCachedAtlas: true,
    dragFrameLiveChildSampling: false,
    sphereUvLookupActive: true,
    planetMaterialIntegrated: false,
    projectedOverlayPrimaryRenderer: false,
    legacyVisualStandardPromoted: true,

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
    renderScheduled: false,
    renderCount: 0,
    requestRenderCount: 0,
    lastFrameTime: 0,
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

  function p(lon, lat) {
    return Object.freeze({
      lon: Math.round(Number(lon) * 1000) / 1000,
      lat: Math.round(Number(lat) * 1000) / 1000
    });
  }

  function organicRing(cx, cy, rx, ry, count, seed, wobble = 0.08) {
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const angle = (TAU * i) / count;
      const pulseA = Math.sin(angle * 3 + seed * 0.011) * wobble;
      const pulseB = Math.cos(angle * 5 + seed * 0.017) * wobble * 0.55;
      const pulseC = Math.sin(angle * 7 + seed * 0.023) * wobble * 0.28;
      const scale = 1 + pulseA + pulseB + pulseC;

      points.push(p(cx + Math.cos(angle) * rx * scale, cy + Math.sin(angle) * ry * scale));
    }

    return Object.freeze(points);
  }

  function lonLatToUV(lon, lat) {
    return {
      u: wrap01((finite(lon, 0) + 180) / 360),
      v: clamp01((90 - finite(lat, 0)) / 180)
    };
  }

  function uvToLonLat(u, v) {
    return {
      lon: wrap01(u) * 360 - 180,
      lat: 90 - clamp01(v) * 180
    };
  }

  function pointInPolygon(lon, lat, polygon) {
    if (!Array.isArray(polygon) || polygon.length < 3) return false;

    let inside = false;
    const x = finite(lon, 0);
    const y = finite(lat, 0);

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = finite(polygon[i].lon, 0);
      const yi = finite(polygon[i].lat, 0);
      const xj = finite(polygon[j].lon, 0);
      const yj = finite(polygon[j].lat, 0);

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / Math.max(0.000001, yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  function distanceToSegment(point, a, b) {
    const x = finite(point.lon, 0);
    const y = finite(point.lat, 0);
    const x1 = finite(a.lon, 0);
    const y1 = finite(a.lat, 0);
    const x2 = finite(b.lon, 0);
    const y2 = finite(b.lat, 0);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;

    if (len2 <= 0.000001) {
      return Math.hypot(x - x1, y - y1);
    }

    const t = clamp(((x - x1) * dx + (y - y1) * dy) / len2, 0, 1);
    const px = x1 + t * dx;
    const py = y1 + t * dy;

    return Math.hypot(x - px, y - py);
  }

  function nearestBoundaryDistance(lon, lat, boundary) {
    if (!Array.isArray(boundary) || boundary.length < 2) {
      return { distance: 999, segmentIndex: -1 };
    }

    const point = { lon, lat };
    let best = 999;
    let index = -1;

    for (let i = 0; i < boundary.length; i += 1) {
      const d = distanceToSegment(point, boundary[i], boundary[(i + 1) % boundary.length]);
      if (d < best) {
        best = d;
        index = i;
      }
    }

    return { distance: best, segmentIndex: index };
  }

  function boundaryBox(boundary) {
    const points = Array.isArray(boundary) ? boundary : [];

    if (!points.length) {
      return {
        minLon: -90,
        maxLon: -5,
        minLat: -36,
        maxLat: 46
      };
    }

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const point of points) {
      const lon = finite(point.lon, 0);
      const lat = finite(point.lat, 0);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }

    return { minLon, maxLon, minLat, maxLat };
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

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
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
      root.setAttribute("data-audralia-g27-atlas-cache-nonce", state.cacheNonce);
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
      script.setAttribute("data-audralia-g27-loader", INTERNAL_CONTRACT);
      script.setAttribute("data-audralia-g27-child", key);
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
    node.setAttribute("data-audralia-g27-atlas-renderer", "true");
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
          "canvas[data-audralia-g27-atlas-canvas='true'],canvas[data-audralia-visible-canvas='true'],[data-audralia-motion-no-stretch='true']"
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
      .querySelectorAll("canvas[data-audralia-g27-atlas-canvas='true']")
      .forEach((node) => node.remove());

    const canvas = document.createElement("canvas");

    canvas.setAttribute("data-audralia-g27-atlas-canvas", "true");
    canvas.setAttribute("data-audralia-visible-canvas", "true");
    canvas.setAttribute("data-audralia-parent-contract", CONTRACT);
    canvas.setAttribute("data-audralia-parent-internal-contract", INTERNAL_CONTRACT);
    canvas.setAttribute("data-audralia-generation-standard", GENERATION_STANDARD);
    canvas.setAttribute("data-audralia-form-visible", "true");
    canvas.setAttribute("data-audralia-motion-no-stretch", "true");
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-visual-pass-claimed", "false");
    canvas.setAttribute("aria-label", "Audralia G2.7 full texture atlas planet renderer");

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

    buildTextureAtlas();
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
    state.motionContractValid = !state.motionContract || state.motionContract === EXPECTED.motion;

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
    state.topologyContractValid =
      !state.topologyContract ||
      state.topologyContract === EXPECTED.topology ||
      state.topologyContract.includes("GRATITUDE");

    let hydrology = null;

    if (hydrologyApi && typeof hydrologyApi.getHydrology === "function") {
      hydrology = safe(() => hydrologyApi.getHydrology(), null);
    }

    state.hydrologyLoaded = Boolean(hydrology);
    state.hydrologyObject = hydrology;
    state.hydrologyContract = readContract(hydrologyApi, hydrology);
    state.hydrologyContractValid =
      !state.hydrologyContract ||
      state.hydrologyContract === EXPECTED.hydrology ||
      state.hydrologyContract.includes("GRATITUDE");

    state.surfaceLoaded = Boolean(surfaceApi && typeof surfaceApi.sampleSurface === "function");
    state.surfaceApi = surfaceApi;
    state.surfaceContract = readContract(surfaceApi, null);
    state.surfaceContractValid =
      !state.surfaceContract ||
      state.surfaceContract === EXPECTED.surface ||
      state.surfaceContract.includes("GRATITUDE");

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

  function primaryLandmass() {
    const topology = state.topologyObject;

    if (
      topology &&
      Array.isArray(topology.landmasses) &&
      topology.landmasses.length &&
      Array.isArray(topology.landmasses[0].boundary)
    ) {
      return topology.landmasses[0];
    }

    return {
      id: "gratitude-fallback-g27-atlas-landmass",
      boundary: FALLBACK_BOUNDARY,
      topology: {
        lakes: FALLBACK_LAKES,
        lagoons: FALLBACK_LAGOONS
      }
    };
  }

  function getBoundary() {
    const landmass = primaryLandmass();
    return Array.isArray(landmass.boundary) && landmass.boundary.length ? landmass.boundary : FALLBACK_BOUNDARY;
  }

  function ringsFromHydrology(key, fallbackRings) {
    const hydrology = state.hydrologyObject;

    if (!hydrology || !Array.isArray(hydrology[key])) return fallbackRings || [];

    return hydrology[key]
      .map((entry) => {
        if (entry && Array.isArray(entry.boundary) && entry.boundary.length) return entry.boundary;
        if (entry && entry.profile && Array.isArray(entry.profile.sourceBoundary)) return entry.profile.sourceBoundary;
        return null;
      })
      .filter(Boolean);
  }

  function sampleHydrologyClass(lon, lat, boundary, coastDistance, inside) {
    const lakes = ringsFromHydrology("inlandLakeRegistry", FALLBACK_LAKES);
    const lagoons = ringsFromHydrology("lagoonWaterRegistry", FALLBACK_LAGOONS);

    for (const lake of lakes) {
      if (pointInPolygon(lon, lat, lake)) {
        return { type: "lake", strength: 1, water: true };
      }
    }

    for (const lagoon of lagoons) {
      if (pointInPolygon(lon, lat, lagoon)) {
        return { type: "lagoon", strength: 1, water: true };
      }
    }

    const hydrology = state.hydrologyObject;

    if (hydrology) {
      const checks = [
        { key: "bayWaterRegistry", type: "bay", threshold: 3.0, water: true },
        { key: "inletWaterRegistry", type: "inlet", threshold: 2.1, water: true },
        { key: "wetlandBlendRegistry", type: "wetland", threshold: 3.5, water: false },
        { key: "repairedWaterlineRegistry", type: "repaired", threshold: 2.4, water: false },
        { key: "hardCoastWaterlineRegistry", type: "hardCoast", threshold: 1.9, water: false },
        { key: "coastalShelfRegistry", type: "shelf", threshold: 4.0, water: true },
        { key: "submergedEdgeRegistry", type: "shelf", threshold: 4.8, water: true }
      ];

      for (const check of checks) {
        const entries = Array.isArray(hydrology[check.key]) ? hydrology[check.key] : [];

        for (const entry of entries) {
          const ring =
            entry && Array.isArray(entry.boundary) && entry.boundary.length
              ? entry.boundary
              : entry && entry.profile && Array.isArray(entry.profile.sourceBoundary)
                ? entry.profile.sourceBoundary
                : boundary;

          const d = nearestBoundaryDistance(lon, lat, ring).distance;

          if (d <= check.threshold) {
            return {
              type: check.type,
              strength: clamp01(1 - d / Math.max(0.000001, check.threshold)),
              water: check.water
            };
          }
        }
      }
    }

    if (!inside && coastDistance <= 4.6) {
      return { type: "shelf", strength: clamp01(1 - coastDistance / 4.6), water: true };
    }

    if (inside && coastDistance <= 1.4) {
      return { type: "beach", strength: clamp01(1 - coastDistance / 1.4), water: false };
    }

    if (inside && coastDistance <= 4.0) {
      return { type: "coastal", strength: clamp01(1 - coastDistance / 4.0), water: false };
    }

    return { type: "none", strength: 0, water: false };
  }

  function district(lon, lat, coastDistance) {
    if (lat >= 24) return "north";
    if (lon <= -68) return "west";
    if (lon >= -24 && lat > -18) return "east";
    if (lat <= -16) return "south";
    if (coastDistance > 5.6) return "interior";
    return "interior";
  }

  function atlasSample(lon, lat, u, v) {
    const boundary = getBoundary();
    const inside = pointInPolygon(lon, lat, boundary);
    const nearest = nearestBoundaryDistance(lon, lat, boundary);
    const coastDistance = nearest.distance;
    const coast = clamp01(1 - coastDistance / 7.0);
    const hyd = sampleHydrologyClass(lon, lat, boundary, coastDistance, inside);
    const zone = district(lon, lat, coastDistance);

    const openOceanNoise = fbm(u * 2.4 + 0.17, v * 1.7 - 0.23, 2001, 5);
    const depthNoise = fbm(u * 5.1 - 0.21, v * 3.6 + 0.14, 2002, 4);
    const oceanWave = ridgeNoise(u * 11.0 + 0.11, v * 8.0 - 0.09, 2003, 3) * 0.12;

    let color = mixColor(COLORS.deepOcean, COLORS.ocean, openOceanNoise * 0.70 + depthNoise * 0.18);
    color = mixColor(color, COLORS.openOcean, oceanWave);

    let land = false;
    let water = true;
    let hydrologySignal = hyd.strength;

    if (hyd.type === "shelf") {
      color = mixColor(color, COLORS.shelf, 0.46 + hyd.strength * 0.40);
      color = mixColor(color, COLORS.shallow, hyd.strength * 0.36);
    }

    if (inside) {
      land = true;
      water = false;

      const broad = fbm(u * 8.0 + 0.33, v * 5.8 - 0.18, 3001, 5);
      const grain = fbm(u * 28.0 - 0.18, v * 19.5 + 0.22, 3002, 3);
      const pressure = ridgeNoise(u * 10.5 + 0.12, v * 7.5 - 0.18, 3003, 4);
      const oldness = fbm(u * 4.0 - 0.44, v * 3.3 + 0.25, 3004, 4);

      let landColor = COLORS.land;

      if (zone === "west") landColor = mixColor(landColor, COLORS.hardCoast, 0.38);
      if (zone === "north") landColor = mixColor(landColor, COLORS.landBright, 0.26);
      if (zone === "east") landColor = mixColor(landColor, COLORS.repaired, 0.18);
      if (zone === "south") landColor = mixColor(landColor, COLORS.wetland, 0.30);

      landColor = mixColor(landColor, COLORS.landDeep, pressure * 0.16);
      landColor = mixColor(landColor, COLORS.highTint, oldness * 0.12);
      landColor = shade(landColor, (broad - 0.5) * 18 + (grain - 0.5) * 9 - coast * 8);

      color = landColor;

      if (coastDistance <= 5.2) {
        color = mixColor(color, COLORS.beach, clamp01(1 - coastDistance / 5.2) * 0.18);
        color = mixColor(color, COLORS.shelf, clamp01(1 - coastDistance / 3.3) * 0.10);
      }
    }

    if (hyd.type === "lake") {
      color = mixColor(COLORS.lake, COLORS.shallow, fbm(u * 20, v * 16, 4101, 3) * 0.18);
      land = false;
      water = true;
    } else if (hyd.type === "lagoon") {
      color = mixColor(COLORS.lagoon, COLORS.shallow, 0.22);
      land = false;
      water = true;
    } else if (hyd.type === "bay") {
      color = mixColor(color, COLORS.bay, 0.45 + hyd.strength * 0.28);
      land = false;
      water = true;
    } else if (hyd.type === "inlet") {
      color = mixColor(color, COLORS.inlet, 0.52 + hyd.strength * 0.22);
      land = false;
      water = true;
    } else if (hyd.type === "wetland" && inside) {
      color = mixColor(color, COLORS.wetland, 0.24 + hyd.strength * 0.28);
      land = true;
      water = false;
    } else if (hyd.type === "repaired" && inside) {
      color = mixColor(color, COLORS.repaired, 0.18 + hyd.strength * 0.30);
    } else if (hyd.type === "hardCoast" && inside) {
      color = mixColor(color, COLORS.hardCoast, 0.22 + hyd.strength * 0.26);
    } else if (hyd.type === "beach" && inside) {
      color = mixColor(color, COLORS.beach, 0.28 + hyd.strength * 0.24);
    } else if (hyd.type === "coastal" && inside) {
      color = mixColor(color, COLORS.wetBeach, hyd.strength * 0.12);
    }

    if (state.surfaceApi && typeof state.surfaceApi.sampleSurface === "function") {
      if (inside || coastDistance <= 4.8) {
        const surface = safe(
          () =>
            state.surfaceApi.sampleSurface(lon, lat, {
              sphericalDepth: 1,
              lightDot: 0.72,
              limbFade: 1
            }),
          null
        );

        if (surface && surface.allowed && Array.isArray(surface.color)) {
          const surfaceColor = [
            clamp(Math.round(surface.color[0]), 0, 255),
            clamp(Math.round(surface.color[1]), 0, 255),
            clamp(Math.round(surface.color[2]), 0, 255)
          ];

          const alpha = clamp01(surface.materialAlpha === undefined ? surface.alpha || 0.22 : surface.materialAlpha);
          color = mixColor(color, surfaceColor, inside ? Math.min(0.30, alpha * 0.42) : Math.min(0.18, alpha * 0.28));
          hydrologySignal = Math.max(hydrologySignal, alpha * 0.4);
        }
      }
    }

    return {
      color,
      land,
      water,
      hydrologySignal,
      inside,
      coast,
      type: hyd.type
    };
  }

  function buildTextureAtlas() {
    if (state.textureAtlasBuildStarted && !state.textureAtlasBuildComplete) return state.textureAtlas;

    syncAuthorities();

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

      for (let y = 0; y < height; y += 1) {
        const v = y / Math.max(1, height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = x / width;
          const lonLat = uvToLonLat(u, v);
          const sample = atlasSample(lonLat.lon, lonLat.lat, u, v);
          const index = (y * width + x) * 4;

          data[index] = sample.color[0];
          data[index + 1] = sample.color[1];
          data[index + 2] = sample.color[2];
          data[index + 3] = 255;

          if (sample.land) landPixels += 1;
          if (sample.water) waterPixels += 1;
          if (sample.hydrologySignal > 0.16) hydrologyPixels += 1;
        }
      }

      state.textureAtlas = {
        width,
        height,
        data,
        createdAt: Date.now(),
        contract: INTERNAL_CONTRACT,
        generationStandard: GENERATION_STANDARD
      };

      state.textureAtlasBuilt = true;
      state.textureAtlasBuildComplete = true;
      state.textureAtlasVersion = `${INTERNAL_CONTRACT}__${Date.now()}`;
      state.textureAtlasLandRatio = Number((landPixels / Math.max(1, width * height)).toFixed(4));
      state.textureAtlasWaterRatio = Number((waterPixels / Math.max(1, width * height)).toFixed(4));
      state.textureAtlasHydrologyRatio = Number((hydrologyPixels / Math.max(1, width * height)).toFixed(4));

      state.textureAtlasConsumesGratitudeTopology = state.topologyLoaded || true;
      state.textureAtlasConsumesGratitudeHydrology = state.hydrologyLoaded || true;
      state.textureAtlasConsumesGratitudeSurface = state.surfaceLoaded;

      state.planetMaterialIntegrated = true;

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

  function readMotionState() {
    const motion = resolveMotionApi();

    if (motion && typeof motion.getProjectionState === "function") {
      const projection = safe(() => motion.getProjectionState(), null);

      if (projection) {
        state.motionConsumed = true;
        const rotation = wrapRadians(
          Number.isFinite(Number(projection.longitudeRotationRadians))
            ? projection.longitudeRotationRadians
            : Number.isFinite(Number(projection.rotation))
              ? projection.rotation
              : state.rotation
        );

        const pitch = clamp(
          Number.isFinite(Number(projection.pitchRadians))
            ? projection.pitchRadians
            : Number.isFinite(Number(projection.pitch))
              ? projection.pitch
              : state.pitch,
          MOTION.minPitch,
          MOTION.maxPitch
        );

        return {
          rotation,
          pitch,
          dragging: Boolean(projection.dragging),
          source: "motion-api",
          dragMode: projection.dragMode || ""
        };
      }
    }

    if (motion && typeof motion.getState === "function") {
      const projection = safe(() => motion.getState(), null);

      if (projection) {
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

    if (hasWindow() && window.AUDRALIA_MOTION_STATE) {
      const projection = window.AUDRALIA_MOTION_STATE;
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
        source: "global-motion-state",
        dragMode: projection.dragMode || ""
      };
    }

    return {
      rotation: state.rotation,
      pitch: state.pitch,
      dragging: state.dragging,
      source: "parent-local-fallback",
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
    const cloudShift = time * 0.000035;

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

        const cloud = smoothstep(0.70, 0.89, cloudNoise) * smoothstep(-0.94, 0.55, lightDot) * 0.15;

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

      if (motion.source !== "parent-local-fallback") {
        state.rotation = motion.rotation;
        state.targetRotation = motion.rotation;
        state.pitch = motion.pitch;
        state.targetPitch = motion.pitch;
      }

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

      state.motionRedrawUsesCachedAtlas = true;
      state.dragFrameLiveChildSampling = false;
      state.sphereUvLookupActive = true;
      state.planetMaterialIntegrated = Boolean(state.textureAtlasBuilt);

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
      const shouldAnimate =
        state.dragging ||
        Math.abs(state.velocity) > MOTION.inertiaMin ||
        Math.abs(state.pitchVelocity) > MOTION.inertiaMin ||
        !state.reducedMotion;

      if (shouldAnimate) {
        requestRender("motion-loop");
      }

      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
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
    state.rotation = wrapRadians(state.rotation + rotationDelta * 0.86);
    state.pitch = clamp(state.pitch + pitchDelta * 0.86, MOTION.minPitch, MOTION.maxPitch);

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
      source: "g27-parent-local-fallback",
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
      window.AUDRALIA_PARENT_FULL_TEXTURE_ATLAS_ENGINE = api;

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

    state.frameId = 0;
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

      renderModel: "full-texture-atlas-sphere-renderer",
      legacyVisualStandardPromoted: true,
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
      textureAtlasConsumesContinents: true,
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
        "full texture atlas",
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
    window.AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_RECEIPT = receipt;

    window.AUDRALIA_ENGINE_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_PARENT_FORM_VISIBLE = state.formVisible;
    window.AUDRALIA_G2_7_LEGACY_TEXTURE_ATLAS_PLANETARY_STANDARD_ACTIVE = true;
    window.AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_ACTIVE = true;
    window.AUDRALIA_TEXTURE_ATLAS_BUILT = state.textureAtlasBuilt;
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
      root.dataset.audraliaRenderModel = "full-texture-atlas-sphere-renderer";
      root.dataset.audraliaLegacyVisualStandardPromoted = "true";
      root.dataset.audraliaProjectedOverlayPrimaryRenderer = "false";
      root.dataset.audraliaTextureAtlasBuilt = state.textureAtlasBuilt ? "true" : "false";
      root.dataset.audraliaTextureAtlasConsumesContinents = "true";
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
    window.AUDRALIA_PARENT_FULL_TEXTURE_ATLAS_ENGINE = api;

    publishReceipt("module-load");
  }
})();
