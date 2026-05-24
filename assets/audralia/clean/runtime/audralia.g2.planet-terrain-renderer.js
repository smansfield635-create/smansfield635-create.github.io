// /assets/audralia/clean/runtime/audralia.g2.planet-terrain-renderer.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_TNT_v1
//
// Scope:
// G2 PTR / planet terrain renderer only.
//
// Source authorities:
// AUDRALIA_TRUE_GLOBE_DATUM
// AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD
// AUDRALIA_G2_SURFACE_MATERIAL_CHILD
//
// Purpose:
// - Consume validated G2 datum, terrain, and surface/material packets.
// - Render one visible dry Audralia planet inside the existing planet inspection mount.
// - Own drawing, texture sampling, lens rendering, interaction controls, and receipts only.
// - Own no datum truth, terrain truth, surface truth, hydration truth, HTML, route JS, clouds, ecology, settlement, or final visual pass.
// - Activate no hydration and no active water.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_TNT_v1";
  var SPEC_OPS = "AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_SPEC_OPS_v1";
  var NEWS = "AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_NEWS_ALIGNMENT_v1";
  var CCR = "AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_CCR_v1";

  var FILE = "/assets/audralia/clean/runtime/audralia.g2.planet-terrain-renderer.js";
  var ROUTE = "/showroom/globe/audralia/planet/";

  var DATUM_GLOBAL = "AUDRALIA_TRUE_GLOBE_DATUM";
  var TERRAIN_GLOBAL = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD";
  var SURFACE_GLOBAL = "AUDRALIA_G2_SURFACE_MATERIAL_CHILD";
  var CHILD_NAME = "audralia-g2-planet-terrain-renderer";

  var TAU = Math.PI * 2;
  var RADIAL_NODES = 16;
  var FIBONACCI_BANDS = 16;
  var SOURCE_SEAT_COUNT = 256;
  var TEXTURE_WIDTH = 384;
  var TEXTURE_HEIGHT = 192;
  var STATUS_THROTTLE_MS = 240;

  var ZOOM = Object.freeze({ min: 0.72, defaultValue: 1.0, max: 2.65 });

  var LENSES = Object.freeze({
    body: "Body",
    surface: "Surface",
    terrain: "Terrain",
    lattice: "Lattice",
    receipt: "Receipt"
  });

  var LENS_ALIAS = Object.freeze({
    body: "body",
    surface: "surface",
    terrain: "terrain",
    ptr: "terrain",
    lattice: "lattice",
    boundary: "lattice",
    full: "surface",
    receipt: "receipt"
  });

  var SURFACE_PALETTE = Object.freeze({
    dry_highland_crust: Object.freeze({ r: 151, g: 139, b: 92 }),
    summit_bright_crust: Object.freeze({ r: 223, g: 197, b: 122 }),
    mountain_shadow_crust: Object.freeze({ r: 116, g: 96, b: 74 }),
    ridge_lit_crust: Object.freeze({ r: 181, g: 156, b: 96 }),
    upland_mineral_plateau: Object.freeze({ r: 133, g: 130, b: 83 }),
    stable_craton_skin: Object.freeze({ r: 95, g: 118, b: 76 }),
    valley_dry_green_brown: Object.freeze({ r: 87, g: 111, b: 72 }),
    basin_dark_dry_floor: Object.freeze({ r: 63, g: 74, b: 59 }),
    trench_shadow_floor: Object.freeze({ r: 42, g: 38, b: 34 }),
    shelf_dust_terrace: Object.freeze({ r: 127, g: 121, b: 83 }),
    escarpment_edge_crust: Object.freeze({ r: 120, g: 88, b: 61 }),
    lowland_muted_gap: Object.freeze({ r: 64, g: 80, b: 65 }),
    former_seabed_matte: Object.freeze({ r: 54, g: 69, b: 67 }),
    future_fill_suppressed_floor: Object.freeze({ r: 51, g: 66, b: 62 })
  });

  var TERRAIN_PALETTE = Object.freeze({
    summit_pressure_zone: Object.freeze({ r: 223, g: 195, b: 118 }),
    mountain_belt: Object.freeze({ r: 162, g: 139, b: 91 }),
    ridge_chain: Object.freeze({ r: 151, g: 134, b: 86 }),
    highland_mass: Object.freeze({ r: 136, g: 130, b: 87 }),
    upland_plateau: Object.freeze({ r: 113, g: 124, b: 77 }),
    stable_craton: Object.freeze({ r: 94, g: 119, b: 76 }),
    valley_corridor: Object.freeze({ r: 83, g: 105, b: 70 }),
    dry_basin_floor: Object.freeze({ r: 64, g: 76, b: 59 }),
    trench_corridor: Object.freeze({ r: 42, g: 38, b: 34 }),
    shelf_terrace: Object.freeze({ r: 121, g: 120, b: 81 }),
    escarpment_rim: Object.freeze({ r: 125, g: 92, b: 65 }),
    lowland_gap: Object.freeze({ r: 60, g: 74, b: 61 }),
    former_seabed: Object.freeze({ r: 50, g: 66, b: 66 }),
    future_fill_candidate: Object.freeze({ r: 50, g: 64, b: 60 })
  });

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    sphereCanvas: null,
    sphereCtx: null,
    width: 0,
    height: 0,
    dpr: 1,

    activeLens: "surface",
    yaw: -0.62,
    pitch: -0.16,
    vx: 0,
    vy: 0,
    zoom: ZOOM.defaultValue,

    pointers: new Map(),
    dragging: false,
    pinching: false,
    px: 0,
    py: 0,
    pinchStartDistance: 0,
    pinchStartZoom: ZOOM.defaultValue,
    lastTap: 0,

    raf: 0,
    renderCount: 0,
    stopped: false,
    initialized: false,
    started: false,

    datumApi: null,
    datumDetected: false,
    datumValidated: false,
    datumPacket: null,
    datumStatus: null,
    datumSeats: [],
    datumFailureReason: "datum not checked",

    terrainApi: null,
    terrainDetected: false,
    terrainValidated: false,
    terrainPacket: null,
    terrainSeats: [],
    terrainFailureReason: "terrain not checked",

    surfaceApi: null,
    surfaceDetected: false,
    surfaceValidated: false,
    surfacePacket: null,
    surfaceSeats: [],
    surfaceFailureReason: "surface not checked",

    visualIncomplete: true,
    dryBodyFallbackActive: false,

    textureCache: {},
    textureBuilt: false,
    textureSeatCount: 0,
    textureBuildCount: 0,
    textureSource: "none",
    textureCoverage: 0,
    textureContrastAverage: 0,

    latticeSeats: [],
    latticeLinks: [],
    latticeReady: false,

    oneCanvasMounted: false,
    onePlanetRendered: false,
    renderReady: false,
    sourceValidationReceipt: null,
    carrierConsumptionReceipt: null,
    renderReceipt: null,

    lastStatusPublishedAt: 0,
    lastStatusPayload: null,
    errors: []
  };

  if (typeof window !== "undefined") {
    [
      "__AUDRALIA_G2_PTR_CONTROLLER__",
      "__AUDRALIA_G2_PLANET_TERRAIN_RENDERER_CONTROLLER__",
      "__AUDRALIA_G2_PLANET_BODY_CLEAN_PAIR_CONTROLLER__"
    ].forEach(function (key) {
      if (window[key] && typeof window[key].stop === "function") {
        try { window[key].stop(); } catch (_error) {}
      }
    });
  }

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function round(value, places) {
    var scale = Math.pow(10, places || 4);
    return Math.round(finite(value, 0) * scale) / scale;
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mixColor(a, b, t) {
    var k = clamp01(t);
    return {
      r: Math.round(mix(a.r, b.r, k)),
      g: Math.round(mix(a.g, b.g, k)),
      b: Math.round(mix(a.b, b.b, k))
    };
  }

  function shadeColor(color, amount) {
    return {
      r: Math.round(clamp(color.r + amount, 0, 255)),
      g: Math.round(clamp(color.g + amount, 0, 255)),
      b: Math.round(clamp(color.b + amount, 0, 255))
    };
  }

  function rgba(color, alpha) {
    return "rgba(" +
      Math.round(clamp(color.r, 0, 255)) + "," +
      Math.round(clamp(color.g, 0, 255)) + "," +
      Math.round(clamp(color.b, 0, 255)) + "," +
      clamp01(alpha).toFixed(3) + ")";
  }

  function fract(value) {
    return finite(value, 0) - Math.floor(finite(value, 0));
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(finite(x, 0) * 127.1 + finite(y, 0) * 311.7 + finite(seed, 0) * 74.7) * 43758.5453123);
  }

  function noise2(x, y, seed) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = fract(x);
    var fy = fract(y);
    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);
    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    var total = 0;
    var amp = 0.58;
    var freq = 1;
    var norm = 0;

    for (var i = 0; i < (octaves || 4); i += 1) {
      total += noise2(x * freq, y * freq, seed + i * 31.77) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 1.618033988749895;
    }

    return total / Math.max(0.000001, norm);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp01((finite(value, 0) - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function safeClone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return value; }
  }

  function recordError(scope, error) {
    var message = error && error.message ? error.message : String(error || scope);
    state.errors.push({ scope: scope, message: message, time: new Date().toISOString() });
    return message;
  }

  function safeCall(scope, api, method) {
    if (!api || typeof api[method] !== "function") return null;

    try {
      return api[method].apply(api, Array.prototype.slice.call(arguments, 3));
    } catch (error) {
      recordError(scope + "." + method, error);
      return null;
    }
  }

  function normalizeRoute(value) {
    var text = String(value || "");
    return text.endsWith("/") ? text : text + "/";
  }

  function routeAllowed() {
    if (typeof document === "undefined" || typeof window === "undefined") return false;
    var htmlRoute = normalizeRoute(document.documentElement.getAttribute("data-route") || "");
    var path = normalizeRoute(window.location ? window.location.pathname : "");
    return htmlRoute === ROUTE || path === ROUTE;
  }

  function normalizeLens(value) {
    var key = String(value || "surface").toLowerCase().replace(/\s+/g, "-");
    return LENS_ALIAS[key] || "surface";
  }

  function normalizeDatumSeats(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.seats)) return packet.seats;
    if (packet.receiveMap && Array.isArray(packet.receiveMap.seats)) return packet.receiveMap.seats;
    if (Array.isArray(packet.chronologicalSeatRegistry)) return packet.chronologicalSeatRegistry;
    if (Array.isArray(packet.datumSeats)) return packet.datumSeats;
    return [];
  }

  function normalizeTerrainSeats(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.seats)) return packet.seats;
    if (Array.isArray(packet.terrainSeats)) return packet.terrainSeats;
    if (packet.terrainPacket && Array.isArray(packet.terrainPacket.seats)) return packet.terrainPacket.seats;
    if (packet.planetPhysicalTerrainPacket && Array.isArray(packet.planetPhysicalTerrainPacket.seats)) return packet.planetPhysicalTerrainPacket.seats;
    return [];
  }

  function normalizeSurfaceSeats(packet) {
    if (!packet) return [];
    if (Array.isArray(packet.seats)) return packet.seats;
    if (Array.isArray(packet.surfaceSeats)) return packet.surfaceSeats;
    if (packet.surfacePacket && Array.isArray(packet.surfacePacket.seats)) return packet.surfacePacket.seats;
    if (packet.carrierSurfacePacket && Array.isArray(packet.carrierSurfacePacket.seats)) return packet.carrierSurfacePacket.seats;
    return [];
  }

  function validateDatum() {
    var api = typeof window !== "undefined" ? window[DATUM_GLOBAL] : null;
    var status = null;
    var packet = null;
    var seats = [];

    state.datumApi = api;
    state.datumDetected = Boolean(api);
    state.datumValidated = false;
    state.datumStatus = null;
    state.datumPacket = null;
    state.datumSeats = [];

    if (!api) {
      state.datumFailureReason = "AUDRALIA_TRUE_GLOBE_DATUM missing";
      return false;
    }

    status = typeof api.status === "function" ? safeCall("datum", api, "status", { verbose: false }) : null;

    if (typeof api.getChildReceivePacket === "function") {
      packet = safeCall("datum", api, "getChildReceivePacket", CHILD_NAME, { compact: false });
    }

    if (!packet && typeof api.receive === "function") {
      packet = safeCall("datum", api, "receive", { compact: false });
    }

    seats = normalizeDatumSeats(packet);

    state.datumStatus = status;
    state.datumPacket = packet;
    state.datumSeats = seats;

    state.datumValidated = Boolean(
      packet &&
      seats.length === SOURCE_SEAT_COUNT &&
      (
        packet.newsComplete === true ||
        (status && status.newsComplete === true) ||
        seats.every(function (seat) { return seat && (seat.newsComplete === true || seat.news); })
      ) &&
      (
        packet.ackStackComplete === true ||
        (status && status.ackStackComplete === true) ||
        seats.every(function (seat) { return seat && (seat.ackStackComplete === true || seat.ackStack || seat.childReceiveEligible === true); })
      ) &&
      packet.visualPassClaimed !== true &&
      packet.finalVisualPassClaim !== true &&
      (!status || status.visualPassClaimed !== true)
    );

    state.datumFailureReason = state.datumValidated ? "" : "datum packet failed PTR validation";
    return state.datumValidated;
  }

  function validateTerrain() {
    var api = typeof window !== "undefined" ? window[TERRAIN_GLOBAL] : null;
    var packet = null;
    var seats = [];

    state.terrainApi = api;
    state.terrainDetected = Boolean(api);
    state.terrainValidated = false;
    state.terrainPacket = null;
    state.terrainSeats = [];

    if (!api) {
      state.terrainFailureReason = "AUDRALIA_G2_PHYSICAL_TERRAIN_CHILD missing";
      return false;
    }

    if (typeof api.getCarrierTerrainPacket === "function") {
      packet = safeCall("terrain", api, "getCarrierTerrainPacket", CHILD_NAME, { compact: false });
    }

    if (!packet && typeof api.getTerrainPacket === "function") {
      packet = safeCall("terrain", api, "getTerrainPacket", CHILD_NAME, { compact: false });
    }

    seats = normalizeTerrainSeats(packet);

    state.terrainPacket = packet;
    state.terrainSeats = seats;

    state.terrainValidated = Boolean(
      packet &&
      seats.length === SOURCE_SEAT_COUNT &&
      packet.carrierTerrainPacketReady !== false &&
      packet.carrierMayConsume !== false &&
      packet.carrierMayDisplayPacket !== false &&
      packet.carrierDisplaysOnly !== false &&
      packet.carrierInventsTerrain !== true &&
      packet.carrierOwnsTerrainTruth !== true &&
      packet.carrierOwnsHydrationTruth !== true &&
      packet.activeHydration !== true &&
      packet.activeWater !== true &&
      packet.finalVisualPassClaim !== true
    );

    state.terrainFailureReason = state.terrainValidated ? "" : "carrier terrain packet failed PTR validation";
    return state.terrainValidated;
  }

  function validateSurface() {
    var api = typeof window !== "undefined" ? window[SURFACE_GLOBAL] : null;
    var packet = null;
    var seats = [];

    state.surfaceApi = api;
    state.surfaceDetected = Boolean(api);
    state.surfaceValidated = false;
    state.surfacePacket = null;
    state.surfaceSeats = [];

    if (!api) {
      state.surfaceFailureReason = "AUDRALIA_G2_SURFACE_MATERIAL_CHILD missing";
      return false;
    }

    if (typeof api.getCarrierSurfacePacket === "function") {
      packet = safeCall("surface", api, "getCarrierSurfacePacket", CHILD_NAME, { compact: false });
    }

    if (!packet && typeof api.getSurfacePacket === "function") {
      packet = safeCall("surface", api, "getSurfacePacket", CHILD_NAME, { compact: false });
    }

    seats = normalizeSurfaceSeats(packet);

    state.surfacePacket = packet;
    state.surfaceSeats = seats;

    state.surfaceValidated = Boolean(
      packet &&
      seats.length === SOURCE_SEAT_COUNT &&
      packet.carrierSurfacePacketReady !== false &&
      packet.carrierMayConsume !== false &&
      packet.carrierMayDisplayPacket !== false &&
      packet.carrierDisplaysOnly !== false &&
      packet.carrierInventsSurface !== true &&
      packet.carrierOwnsSurfaceTruth !== true &&
      packet.carrierOwnsTerrainTruth !== true &&
      packet.carrierOwnsHydrationTruth !== true &&
      packet.activeHydration !== true &&
      packet.activeWater !== true &&
      packet.finalSurfacePassClaim !== true &&
      packet.finalVisualPassClaim !== true
    );

    state.surfaceFailureReason = state.surfaceValidated ? "" : "carrier surface packet failed PTR validation";
    return state.surfaceValidated;
  }

  function refreshSources() {
    validateDatum();
    validateTerrain();
    validateSurface();

    state.visualIncomplete = !(state.datumValidated && state.terrainValidated && state.surfaceValidated);
    state.dryBodyFallbackActive = Boolean(state.datumValidated && state.terrainValidated && !state.surfaceValidated);

    state.textureCache = {};
    state.textureBuilt = false;
    state.textureSeatCount = 0;
    state.textureSource = state.surfaceValidated ? "surface" : state.terrainValidated ? "terrain-fallback" : "none";

    state.sourceValidationReceipt = buildSourceValidationReceipt();
    state.carrierConsumptionReceipt = buildCarrierConsumptionReceipt();

    publishStatus({ force: true });
    requestRender();
  }

  function sequenceVersionOf(seat, index) {
    return Math.round(clamp(
      finite(seat && seat.datumSequenceVersion, finite(seat && seat.sequenceVersion, Math.floor(index / RADIAL_NODES))),
      0,
      FIBONACCI_BANDS - 1
    ));
  }

  function nodeIndexOf(seat, index) {
    return Math.round(clamp(
      finite(seat && seat.datumNodeIndex, finite(seat && seat.nodeIndex, index % RADIAL_NODES)),
      0,
      RADIAL_NODES - 1
    ));
  }

  function buildGrid(seats) {
    var grid = [];

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) grid[y] = [];

    (seats || []).forEach(function (seat, index) {
      grid[sequenceVersionOf(seat, index)][nodeIndexOf(seat, index)] = seat;
    });

    return grid;
  }

  function gridSeat(grid, x, y) {
    var xx = ((Math.round(x) % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES;
    var yy = Math.round(clamp(y, 0, FIBONACCI_BANDS - 1));
    return grid[yy] && grid[yy][xx] ? grid[yy][xx] : null;
  }

  function terrainColor(seat) {
    var cls = String(seat && seat.terrainClass || "stable_craton");
    var base = TERRAIN_PALETTE[cls] || TERRAIN_PALETTE.stable_craton;
    var elevation = clamp01(finite(seat && seat.dryElevation, 0.5));
    var ridge = clamp01(finite(seat && seat.ridgePressure, 0) + finite(seat && seat.mountainPressure, 0) * 0.7 + finite(seat && seat.summitPressure, 0) * 0.6);
    var basin = clamp01(finite(seat && seat.basinPressure, 0) + finite(seat && seat.trenchPressure, 0) * 0.5);
    var futureFill = clamp01(finite(seat && seat.futureFillPressure, 0));
    var color = base;

    color = mixColor(color, { r: 228, g: 198, b: 124 }, ridge * 0.22);
    color = mixColor(color, { r: 41, g: 50, b: 45 }, basin * 0.18);
    color = mixColor(color, { r: 45, g: 60, b: 58 }, futureFill * 0.18);

    return shadeColor(color, (elevation - 0.5) * 42);
  }

  function surfaceColor(seat, lens) {
    var cls = String(seat && seat.surfaceMaterialClass || "stable_craton_skin");
    var base = SURFACE_PALETTE[cls] || SURFACE_PALETTE.stable_craton_skin;
    var brightness = clamp01(finite(seat && seat.materialBrightness, 0.48));
    var contrast = clamp01(finite(seat && seat.materialContrast, 0.32));
    var ridge = clamp01(finite(seat && seat.ridgeHighlight, 0));
    var basin = clamp01(finite(seat && seat.basinShadow, 0));
    var trench = clamp01(finite(seat && seat.trenchDeepShadow, 0));
    var shelf = clamp01(finite(seat && seat.shelfTransitionTone, 0));
    var former = clamp01(finite(seat && seat.formerSeabedTone, 0));
    var future = clamp01(finite(seat && seat.futureFillSuppression, 0));
    var color = base;

    color = mixColor(color, { r: 232, g: 205, b: 132 }, ridge * 0.20);
    color = mixColor(color, { r: 40, g: 46, b: 42 }, basin * 0.18 + trench * 0.22);
    color = mixColor(color, { r: 126, g: 116, b: 82 }, shelf * 0.12);
    color = mixColor(color, { r: 50, g: 66, b: 64 }, former * 0.20 + future * 0.16);
    color = shadeColor(color, (brightness - 0.5) * 46 + (contrast - 0.35) * 22);

    if (lens === "body") color = mixColor(color, { r: 32, g: 43, b: 43 }, 0.24);
    if (lens === "terrain") color = shadeColor(color, 10);
    if (lens === "lattice") color = mixColor(color, { r: 13, g: 22, b: 38 }, 0.42);
    if (lens === "receipt") color = mixColor(color, { r: 16, g: 26, b: 34 }, 0.34);

    return color;
  }

  function colorForSeat(seat, lens, useSurface) {
    return useSurface ? surfaceColor(seat, lens) : terrainColor(seat);
  }

  function sampleGridColor(grid, gx, gy, lens, useSurface) {
    var x0 = Math.floor(gx);
    var y0 = Math.floor(gy);
    var x1 = x0 + 1;
    var y1 = Math.min(FIBONACCI_BANDS - 1, y0 + 1);
    var tx = gx - x0;
    var ty = gy - y0;
    var a = gridSeat(grid, x0, y0) || gridSeat(grid, x1, y0) || gridSeat(grid, x0, y1) || gridSeat(grid, x1, y1);
    var b = gridSeat(grid, x1, y0) || a;
    var c = gridSeat(grid, x0, y1) || a;
    var d = gridSeat(grid, x1, y1) || b || c || a;
    var ca = colorForSeat(a, lens, useSurface);
    var cb = colorForSeat(b, lens, useSurface);
    var cc = colorForSeat(c, lens, useSurface);
    var cd = colorForSeat(d, lens, useSurface);
    var top = mixColor(ca, cb, tx);
    var bottom = mixColor(cc, cd, tx);

    return mixColor(top, bottom, ty);
  }

  function buildTexture(lens) {
    var mode = normalizeLens(lens);
    var cacheKey = mode + ":" + (state.surfaceValidated ? "surface" : state.terrainValidated ? "terrain" : "none");

    if (state.textureCache[cacheKey]) return state.textureCache[cacheKey];

    var useSurface = state.surfaceValidated;
    var seats = useSurface ? state.surfaceSeats : state.terrainValidated ? state.terrainSeats : [];
    var grid = buildGrid(seats);
    var data = new Uint8ClampedArray(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4);
    var coverage = 0;
    var contrastTotal = 0;

    for (var y = 0; y < TEXTURE_HEIGHT; y += 1) {
      var v = y / Math.max(1, TEXTURE_HEIGHT - 1);
      var latNorm = Math.sin((0.5 - v) * Math.PI);
      var gy = v * (FIBONACCI_BANDS - 1);

      for (var x = 0; x < TEXTURE_WIDTH; x += 1) {
        var u = x / TEXTURE_WIDTH;
        var gx = u * RADIAL_NODES - 0.5;
        var color = seats.length ? sampleGridColor(grid, gx, gy, mode, useSurface) : { r: 28, g: 38, b: 42 };
        var grain = fbm(u * 19.0 + 0.11, v * 13.0 - 0.07, 9101, 4);
        var fracture = fbm(u * 46.0 - 0.33, v * 24.0 + 0.19, 9107, 3);
        var latitudeShade = Math.abs(latNorm) * 8;
        var grainShade = (grain - 0.5) * 18 + (fracture - 0.5) * 10;

        color = shadeColor(color, grainShade + latitudeShade);

        if (mode === "terrain") color = shadeColor(color, (fracture - 0.45) * 16);
        if (mode === "body") color = mixColor(color, { r: 24, g: 36, b: 40 }, 0.12);

        var index = (y * TEXTURE_WIDTH + x) * 4;
        data[index] = clamp(Math.round(color.r), 0, 255);
        data[index + 1] = clamp(Math.round(color.g), 0, 255);
        data[index + 2] = clamp(Math.round(color.b), 0, 255);
        data[index + 3] = 255;

        coverage += seats.length ? 1 : 0;
        contrastTotal += Math.abs(grain - 0.5) + Math.abs(fracture - 0.5);
      }
    }

    var total = TEXTURE_WIDTH * TEXTURE_HEIGHT;

    var texture = Object.freeze({
      contract: CONTRACT,
      lens: mode,
      source: useSurface ? "surface-material" : state.terrainValidated ? "physical-terrain-fallback" : "none",
      width: TEXTURE_WIDTH,
      height: TEXTURE_HEIGHT,
      seatCount: seats.length,
      data: data,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    });

    state.textureCache[cacheKey] = texture;
    state.textureBuilt = true;
    state.textureSeatCount = seats.length;
    state.textureBuildCount += 1;
    state.textureSource = texture.source;
    state.textureCoverage = round(coverage / Math.max(1, total), 4);
    state.textureContrastAverage = round(contrastTotal / Math.max(1, total), 4);

    return texture;
  }

  function textureSample(texture, u, v) {
    if (!texture || !texture.data) return [28, 38, 42];

    var x = Math.floor((((u % 1) + 1) % 1) * texture.width) % texture.width;
    var y = Math.floor(clamp01(v) * (texture.height - 1));
    var index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    ];
  }

  function lonLatPoint(lonDeg, latDeg) {
    var lon = lonDeg * Math.PI / 180;
    var lat = latDeg * Math.PI / 180;
    var clat = Math.cos(lat);

    return {
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon)
    };
  }

  function rotate(point) {
    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x1 = point.x * cy + point.z * sy;
    var z1 = -point.x * sy + point.z * cy;
    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);

    return {
      x: x1,
      y: point.y * cp - z1 * sp,
      z: point.y * sp + z1 * cp
    };
  }

  function inverseProjectedLonLat(nx, ny, z) {
    var yCam = -ny;
    var xCam = nx;
    var zCam = z;
    var cp = Math.cos(state.pitch);
    var sp = Math.sin(state.pitch);
    var y0 = yCam * cp + zCam * sp;
    var z1 = -yCam * sp + zCam * cp;
    var cy = Math.cos(state.yaw);
    var sy = Math.sin(state.yaw);
    var x0 = xCam * cy - z1 * sy;
    var z0 = xCam * sy + z1 * cy;

    return {
      lon: Math.atan2(z0, x0),
      lat: Math.asin(clamp(y0, -1, 1))
    };
  }

  function metrics() {
    var min = Math.min(state.width, state.height);
    var baseRadius = min * 0.405;

    return {
      cx: state.width / 2,
      cy: state.height * 0.365,
      baseRadius: baseRadius,
      r: baseRadius * state.zoom,
      camera: 3.92
    };
  }

  function project(point) {
    var m = metrics();
    var p = rotate(point);
    var scale = m.camera / Math.max(0.72, m.camera - p.z);

    return {
      x: m.cx + p.x * m.r * scale,
      y: m.cy - p.y * m.r * scale,
      z: p.z,
      front: p.z >= -0.055,
      scale: scale
    };
  }

  function clipSphere() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.clip();
  }

  function drawBackground() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.clearRect(0, 0, state.width, state.height);

    var bg = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.12, m.cx, m.cy, Math.max(state.width, state.height) * 0.78);
    bg.addColorStop(0.00, "rgba(23,42,55,0.92)");
    bg.addColorStop(0.40, "rgba(5,13,30,0.98)");
    bg.addColorStop(1.00, "rgba(1,4,12,1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.save();
    ctx.globalAlpha = 0.32;

    for (var i = 0; i < 58; i += 1) {
      var x = hash2(i, 11, 301) * state.width;
      var y = hash2(i, 19, 302) * state.height;
      var r = 0.45 + hash2(i, 29, 303) * 1.4;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(214,244,238,0.14)";
      ctx.fill();
    }

    ctx.restore();

    var glow = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.32, m.cx, m.cy, m.r * 1.62);
    glow.addColorStop(0.00, "rgba(143,240,195,0.030)");
    glow.addColorStop(0.58, "rgba(141,216,255,0.080)");
    glow.addColorStop(0.86, "rgba(243,200,111,0.040)");
    glow.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.62, 0, TAU);
    ctx.fill();
  }

  function drawSphere() {
    if (!state.sphereCanvas || !state.sphereCtx) return;

    var m = metrics();
    var maxDiameter = state.dragging || state.pinching ? 440 : 560;
    var diameter = Math.max(240, Math.min(maxDiameter, Math.floor(m.r * 2)));
    var radius = diameter / 2;
    var mode = state.activeLens;

    if (state.sphereCanvas.width !== diameter) state.sphereCanvas.width = diameter;
    if (state.sphereCanvas.height !== diameter) state.sphereCanvas.height = diameter;

    var texture = buildTexture(mode);
    var image = state.sphereCtx.createImageData(diameter, diameter);
    var out = image.data;
    var light = { x: -0.42, y: 0.34, z: 0.84 };

    for (var y = 0; y < diameter; y += 1) {
      var ny = (y + 0.5 - radius) / radius;

      for (var x = 0; x < diameter; x += 1) {
        var nx = (x + 0.5 - radius) / radius;
        var d2 = nx * nx + ny * ny;
        var index = (y * diameter + x) * 4;

        if (d2 > 1) {
          out[index + 3] = 0;
          continue;
        }

        var z = Math.sqrt(1 - d2);
        var ll = inverseProjectedLonLat(nx, ny, z);
        var u = ll.lon / TAU + 0.5;
        var v = 0.5 - ll.lat / Math.PI;
        var color = textureSample(texture, u, v);
        var lightDot = clamp(nx * light.x + (-ny) * light.y + z * light.z, -1, 1);
        var daylight = 0.36 + Math.max(0, lightDot) * 0.92;
        var night = smoothstep(-0.50, 0.12, lightDot);
        var limb = Math.pow(1 - z, 1.72);
        var rim = Math.pow(1 - z, 3.20);

        var r = color[0] * daylight;
        var g = color[1] * daylight;
        var b = color[2] * daylight;

        r = mix(r * 0.43, r, night);
        g = mix(g * 0.48, g, night);
        b = mix(b * 0.60, b, night);

        if (mode === "surface") {
          r *= 1.06;
          g *= 1.06;
          b *= 1.03;
        }

        if (mode === "terrain") {
          r *= 1.09;
          g *= 1.07;
          b *= 1.02;
        }

        if (mode === "body") {
          r *= 0.92;
          g *= 0.96;
          b *= 0.98;
        }

        r = mix(r, 92, limb * 0.16);
        g = mix(g, 176, limb * 0.14);
        b = mix(b, 220, limb * 0.18);

        r = mix(r, 154, rim * 0.34);
        g = mix(g, 224, rim * 0.30);
        b = mix(b, 236, rim * 0.32);

        out[index] = clamp(Math.round(r), 0, 255);
        out[index + 1] = clamp(Math.round(g), 0, 255);
        out[index + 2] = clamp(Math.round(b), 0, 255);
        out[index + 3] = clamp(Math.round(255 * smoothstep(1.006, 0.984, d2)), 0, 255);
      }
    }

    state.sphereCtx.putImageData(image, 0, 0);
    state.ctx.drawImage(state.sphereCanvas, m.cx - m.r, m.cy - m.r, m.r * 2, m.r * 2);
    state.onePlanetRendered = Boolean(state.datumValidated && state.terrainValidated && (state.surfaceValidated || state.dryBodyFallbackActive));
  }

  function buildLatticeGeometry() {
    var seats = [];
    var links = [];

    function makeSeat(band, radial) {
      var v = (band + 0.5) / FIBONACCI_BANDS;
      var lat = Math.asin(1 - 2 * v);
      var lon = (radial / RADIAL_NODES) * TAU - Math.PI;
      var clat = Math.cos(lat);

      return {
        index: band * RADIAL_NODES + radial,
        band: band,
        radial: radial,
        x: clat * Math.cos(lon),
        y: Math.sin(lat),
        z: clat * Math.sin(lon),
        major: radial % 4 === 0 || band % 4 === 0,
        secondary: radial % 2 === 0 || band % 2 === 0
      };
    }

    function seat(band, radial) {
      return seats[band * RADIAL_NODES + ((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    function addLink(a, b, family, major) {
      links.push({ a: a, b: b, family: family, major: Boolean(major) });
    }

    for (var band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (var radial = 0; radial < RADIAL_NODES; radial += 1) seats.push(makeSeat(band, radial));
    }

    for (var y = 0; y < FIBONACCI_BANDS; y += 1) {
      for (var x = 0; x < RADIAL_NODES; x += 1) {
        addLink(seat(y, x), seat(y, x + 1), "ring", y % 4 === 0 || x % 4 === 0);

        if (y < FIBONACCI_BANDS - 1) {
          addLink(seat(y, x), seat(y + 1, x), "spine", x % 4 === 0);
          addLink(seat(y, x), seat(y + 1, x + [1, 2, 3, 5, 8, 13][y % 6]), "fibonacci", y % 4 === 0 || x % 4 === 0);
        }
      }
    }

    state.latticeSeats = Object.freeze(seats);
    state.latticeLinks = Object.freeze(links);
    state.latticeReady = seats.length === SOURCE_SEAT_COUNT;
  }

  function drawLatticeLayer(layer) {
    if (!state.latticeReady || !state.ctx) return;

    var ctx = state.ctx;

    ctx.save();
    clipSphere();

    state.latticeLinks.forEach(function (link) {
      var a = project(link.a);
      var b = project(link.b);
      var avgZ = (a.z + b.z) / 2;
      var isFront = avgZ >= 0;

      if (layer === "back" && isFront) return;
      if (layer === "front" && !isFront) return;

      var alpha = layer === "front" ? (link.major ? 0.50 : 0.22) : (link.major ? 0.075 : 0.038);
      var color = link.family === "fibonacci" ? "244,207,131" : "141,216,255";

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(" + color + "," + alpha.toFixed(3) + ")";
      ctx.lineWidth = link.major ? Math.max(0.62, state.dpr * 0.64) : Math.max(0.32, state.dpr * 0.34);
      ctx.stroke();
    });

    state.latticeSeats.forEach(function (seat) {
      var p = project(seat);
      var front = p.z >= 0;

      if (layer === "back" && front) return;
      if (layer === "front" && !front) return;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.62, state.dpr * (seat.major ? 1.50 : seat.secondary ? 1.05 : 0.78) * p.scale), 0, TAU);
      ctx.fillStyle = layer === "front"
        ? (seat.major ? "rgba(244,207,131,0.72)" : "rgba(141,216,255,0.42)")
        : (seat.major ? "rgba(141,216,255,0.080)" : "rgba(141,216,255,0.040)");
      ctx.fill();
    });

    ctx.restore();
  }

  function terrainDefinitionSeat(index) {
    return state.terrainSeats[index] || state.surfaceSeats[index] || null;
  }

  function drawTerrainDefinitionPoints() {
    if (!state.ctx || (!state.terrainValidated && !state.surfaceValidated)) return;
    if (state.activeLens !== "terrain" && state.activeLens !== "receipt") return;

    var ctx = state.ctx;
    var m = metrics();
    var stride = state.activeLens === "terrain" ? 2 : 4;

    ctx.save();
    clipSphere();

    for (var i = 0; i < SOURCE_SEAT_COUNT; i += stride) {
      var seat = terrainDefinitionSeat(i);
      if (!seat) continue;

      var seq = sequenceVersionOf(seat, i);
      var node = nodeIndexOf(seat, i);
      var lon = -180 + ((node + 0.5) / RADIAL_NODES) * 360;
      var lat = 80 - ((seq + 0.5) / FIBONACCI_BANDS) * 160;
      var ridge = finite(seat.ridgePressure, finite(seat.ridgeHighlight, 0));
      var basin = finite(seat.basinPressure, finite(seat.basinShadow, 0));
      var point = lonLatPoint(lon, lat);
      var p = project(point);

      if (!p.front) continue;

      var color = ridge >= basin ? { r: 236, g: 204, b: 132 } : { r: 98, g: 126, b: 111 };
      var alpha = state.activeLens === "terrain" ? 0.115 : 0.060;
      var radius = Math.max(0.72, m.r * 0.0032 * p.scale * (1 + Math.max(ridge, basin) * 0.65));

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = rgba(color, alpha);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawAtmosphereRim() {
    var ctx = state.ctx;
    var m = metrics();

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    var halo = ctx.createRadialGradient(m.cx, m.cy, m.r * 0.88, m.cx, m.cy, m.r * 1.14);
    halo.addColorStop(0.00, "rgba(141,216,255,0)");
    halo.addColorStop(0.50, "rgba(141,216,255,0.030)");
    halo.addColorStop(0.82, "rgba(141,216,255,0.120)");
    halo.addColorStop(1.00, "rgba(141,216,255,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.14, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    ctx.beginPath();
    ctx.arc(m.cx, m.cy, m.r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,0.22)";
    ctx.lineWidth = Math.max(0.75, state.dpr * 0.72);
    ctx.stroke();

    ctx.restore();
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawReceipt() {
    if (state.activeLens !== "receipt" || !state.ctx) return;

    var ctx = state.ctx;
    var m = metrics();
    var receipt = getRenderReceipt();
    var source = getSourceValidationReceipt();
    var w = Math.min(state.width * 0.92, m.baseRadius * 2.96);
    var h = Math.min(state.height * 0.70, m.baseRadius * 1.92);
    var x = m.cx - w / 2;
    var y = m.cy - h / 2;

    ctx.save();

    ctx.fillStyle = "rgba(2,8,20,.86)";
    ctx.strokeStyle = "rgba(167,243,198,.54)";
    ctx.lineWidth = Math.max(1, state.dpr);

    roundedRect(ctx, x, y, w, h, 22 * state.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 " + Math.max(10, 12.4 * state.dpr) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(167,243,198,.94)";
    ctx.fillText("G2 PTR · PACKET-DERIVED VISUAL RUNTIME", m.cx, y + h * 0.072);

    ctx.font = "900 " + Math.max(7, 8.1 * state.dpr) + "px ui-monospace, monospace";

    var rows = [
      "CONTRACT " + CONTRACT,
      "DATUM " + String(source.datumValidated).toUpperCase() + " · SEATS " + source.datumSeatCount,
      "TERRAIN " + String(source.terrainValidated).toUpperCase() + " · SEATS " + source.terrainSeatCount,
      "SURFACE " + String(source.surfaceValidated).toUpperCase() + " · SEATS " + source.surfaceSeatCount,
      "CANVAS " + String(receipt.oneCanvasMounted).toUpperCase() + " · PLANET " + String(receipt.onePlanetRendered).toUpperCase(),
      "TEXTURE " + String(receipt.textureBuilt).toUpperCase() + " · SOURCE " + state.textureSource,
      "BODY/SURFACE/TERRAIN/LATTICE/RECEIPT LENSES READY",
      "PACKET DISPLAY ONLY · NO SOURCE TRUTH OWNERSHIP",
      "HYDRATION HELD TRUE · ACTIVE WATER FALSE",
      "FINAL VISUAL PASS FALSE"
    ];

    rows.forEach(function (text, index) {
      ctx.fillStyle = index === 0 ? "rgba(244,207,131,.90)" : index % 2 ? "rgba(238,244,255,.78)" : "rgba(141,216,255,.78)";
      ctx.fillText(text, m.cx, y + h * (0.18 + index * 0.074));
    });

    if (state.visualIncomplete) {
      ctx.fillStyle = "rgba(244,207,131,.84)";
      ctx.fillText("VISUAL INCOMPLETE: " + incompleteReason(), m.cx, y + h * 0.940);
    }

    ctx.restore();
  }

  function incompleteReason() {
    if (!state.datumValidated) return state.datumFailureReason;
    if (!state.terrainValidated) return state.terrainFailureReason;
    if (!state.surfaceValidated) return state.surfaceFailureReason;
    return "none";
  }

  function frame() {
    if (state.stopped || !state.ctx) return;

    state.raf = 0;

    if (!state.dragging && !state.pinching) {
      state.yaw += state.vx;
      state.pitch = clamp(state.pitch + state.vy, -1.16, 1.16);
      state.vx *= 0.94;
      state.vy *= 0.94;
      if (Math.abs(state.vx) < 0.00008) state.vx = 0;
      if (Math.abs(state.vy) < 0.00008) state.vy = 0;
    }

    drawBackground();

    if (state.activeLens === "lattice") {
      drawLatticeLayer("back");
      drawSphere();
      drawLatticeLayer("front");
    } else {
      drawSphere();
      drawTerrainDefinitionPoints();
    }

    drawReceipt();
    drawAtmosphereRim();

    state.renderCount += 1;
    state.renderReceipt = buildRenderReceipt();

    publishStatus();

    if (state.dragging || state.pinching || Math.abs(state.vx) > 0 || Math.abs(state.vy) > 0) requestRender();
  }

  function requestRender() {
    if (!state.raf && !state.stopped && typeof window !== "undefined") state.raf = window.requestAnimationFrame(frame);
  }

  function resize() {
    if (!state.stage || !state.canvas) return;

    var rect = state.stage.getBoundingClientRect();
    var dpr = Math.max(1, Math.min(2.25, window.devicePixelRatio || 1));

    state.dpr = dpr;
    state.width = Math.max(320, Math.floor(rect.width * dpr));
    state.height = Math.max(600, Math.floor(rect.height * dpr));
    state.canvas.width = state.width;
    state.canvas.height = state.height;

    requestRender();
  }

  function pointerDistance() {
    var points = Array.from(state.pointers.values());
    if (points.length < 2) return 0;

    var dx = points[0].x - points[1].x;
    var dy = points[0].y - points[1].y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function setZoom(nextZoom) {
    state.zoom = clamp(nextZoom, ZOOM.min, ZOOM.max);
    publishStatus({ force: true });
    requestRender();
  }

  function resetCamera() {
    state.yaw = -0.62;
    state.pitch = -0.16;
    state.vx = 0;
    state.vy = 0;
    state.zoom = ZOOM.defaultValue;
    publishStatus({ force: true });
    requestRender();
  }

  function setLens(value) {
    var lens = normalizeLens(value);
    if (!LENSES[lens]) lens = "surface";

    state.activeLens = lens;

    if (typeof document !== "undefined") {
      document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
        var buttonLens = normalizeLens(button.dataset.audraliaPlanetLens);
        button.setAttribute("aria-pressed", buttonLens === lens ? "true" : "false");
      });

      var label = document.querySelector("[data-audralia-planet-stage-label]");

      if (label) {
        if (lens === "body") label.innerHTML = "<strong>Body</strong> → G2 packet-derived dry planet body";
        else if (lens === "surface") label.innerHTML = "<strong>Surface</strong> → G2 surface/material packet display";
        else if (lens === "terrain") label.innerHTML = "<strong>Terrain</strong> → G2 terrain relief and dry physical structure";
        else if (lens === "lattice") label.innerHTML = "<strong>Lattice</strong> → 256-seat inspection overlay; not a second planet";
        else if (lens === "receipt") label.innerHTML = "<strong>Receipt</strong> → PTR source validation and carrier posture proof";
      }
    }

    publishStatus({ force: true });
    requestRender();
  }

  function bindControls() {
    if (!state.stage) return;

    if (typeof document !== "undefined") {
      document.querySelectorAll("[data-audralia-planet-lens]").forEach(function (button) {
        button.addEventListener("click", function () { setLens(button.dataset.audraliaPlanetLens); });
      });
    }

    state.stage.addEventListener("pointerdown", function (event) {
      var tapTime = Date.now();

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size === 2) {
        state.pinching = true;
        state.dragging = false;
        state.pinchStartDistance = pointerDistance();
        state.pinchStartZoom = state.zoom;
      } else if (state.pointers.size === 1) {
        if (tapTime - state.lastTap < 320) resetCamera();
        state.lastTap = tapTime;

        state.dragging = true;
        state.pinching = false;
        state.px = event.clientX;
        state.py = event.clientY;
        state.vx = 0;
        state.vy = 0;
      }

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

      event.preventDefault();
      requestRender();
    }, { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointers.has(event.pointerId)) return;

      state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (state.pointers.size >= 2 && state.pinching) {
        var distance = pointerDistance();
        if (state.pinchStartDistance > 0) setZoom(state.pinchStartZoom * (distance / state.pinchStartDistance));
        event.preventDefault();
        return;
      }

      if (!state.dragging) return;

      var dx = event.clientX - state.px;
      var dy = event.clientY - state.py;

      state.px = event.clientX;
      state.py = event.clientY;
      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0054, -1.16, 1.16);
      state.vx = clamp(dx * 0.0022, -0.048, 0.048);
      state.vy = clamp(dy * 0.0014, -0.038, 0.038);

      event.preventDefault();
      requestRender();
    }, { passive: false });

    function release(event) {
      state.pointers.delete(event.pointerId);

      try { state.stage.releasePointerCapture(event.pointerId); } catch (_error) {}

      if (state.pointers.size < 2) {
        state.pinching = false;
        state.pinchStartDistance = 0;
      }

      if (state.pointers.size === 0) state.dragging = false;

      requestRender();
    }

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });

    state.stage.addEventListener("wheel", function (event) {
      var factor = Math.exp(-event.deltaY * 0.0012);
      setZoom(state.zoom * factor);
      event.preventDefault();
    }, { passive: false });

    state.stage.addEventListener("dblclick", function (event) {
      resetCamera();
      event.preventDefault();
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      var target = event.target && String(event.target.tagName || "").toLowerCase();
      if (target === "input" || target === "textarea" || target === "select") return;

      if (event.key === "+" || event.key === "=") {
        setZoom(state.zoom * 1.10);
        event.preventDefault();
      } else if (event.key === "-" || event.key === "_") {
        setZoom(state.zoom / 1.10);
        event.preventDefault();
      } else if (event.key === "0") {
        resetCamera();
        event.preventDefault();
      }
    }, { passive: false });
  }

  function mountCanvas() {
    if (typeof document === "undefined") return false;

    state.stage = document.querySelector("#audraliaPlanetInspectionStage") || document.querySelector("[data-audralia-planet-inspection-stage]");
    state.mount = document.querySelector("#audraliaPlanetInspectionMount") || document.querySelector("[data-audralia-planet-inspection-mount]");

    if (!state.stage || !state.mount) return false;

    state.stage.style.touchAction = "none";

    state.canvas = document.createElement("canvas");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-spec-ops", SPEC_OPS);
    state.canvas.setAttribute("data-news", NEWS);
    state.canvas.setAttribute("data-ccr", CCR);
    state.canvas.setAttribute("data-file", FILE);
    state.canvas.setAttribute("data-renderer", "audralia-g2-ptr");
    state.canvas.setAttribute("data-carrier-consumes-packets-for-display-only", "true");
    state.canvas.setAttribute("data-carrier-invents-terrain", "false");
    state.canvas.setAttribute("data-carrier-invents-surface", "false");
    state.canvas.setAttribute("data-carrier-owns-terrain-truth", "false");
    state.canvas.setAttribute("data-carrier-owns-surface-truth", "false");
    state.canvas.setAttribute("data-carrier-owns-hydration-truth", "false");
    state.canvas.setAttribute("data-hydration-held", "true");
    state.canvas.setAttribute("data-active-hydration", "false");
    state.canvas.setAttribute("data-active-water", "false");
    state.canvas.setAttribute("data-final-visual-pass-claim", "false");
    state.canvas.setAttribute("aria-label", "Audralia G2 packet-derived planet terrain renderer");

    state.mount.innerHTML = "";
    state.mount.appendChild(state.canvas);

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.sphereCanvas = document.createElement("canvas");
    state.sphereCtx = state.sphereCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    state.oneCanvasMounted = true;

    return true;
  }

  function buildSourceValidationReceipt() {
    return {
      contract: CONTRACT,

      datumDetected: state.datumDetected,
      datumValidated: state.datumValidated,
      datumFailureReason: state.datumFailureReason,
      datumSeatCount: state.datumSeats.length,
      datumNewsComplete: state.datumValidated,
      datumAckStackComplete: state.datumValidated,
      datumVisualPassClaim: false,

      terrainDetected: state.terrainDetected,
      terrainValidated: state.terrainValidated,
      terrainFailureReason: state.terrainFailureReason,
      terrainSeatCount: state.terrainSeats.length,

      surfaceDetected: state.surfaceDetected,
      surfaceValidated: state.surfaceValidated,
      surfaceFailureReason: state.surfaceFailureReason,
      surfaceSeatCount: state.surfaceSeats.length,

      sourceSeatCount: state.datumSeats.length,
      visualIncomplete: state.visualIncomplete,
      dryBodyFallbackActive: state.dryBodyFallbackActive,

      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function buildCarrierConsumptionReceipt() {
    return {
      contract: CONTRACT,
      carrierConsumesPacketsForDisplayOnly: true,
      carrierMayRenderPackets: true,
      carrierInventsTerrain: false,
      carrierInventsSurface: false,
      carrierOwnsDatumTruth: false,
      carrierOwnsTerrainTruth: false,
      carrierOwnsSurfaceTruth: false,
      carrierOwnsHydrationTruth: false,
      carrierMutatesSourceTruth: false,
      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function buildRenderReceipt() {
    return {
      contract: CONTRACT,
      target: FILE,
      route: ROUTE,

      oneCanvasMounted: state.oneCanvasMounted,
      onePlanetRendered: state.onePlanetRendered,
      textureBuilt: state.textureBuilt,
      textureSeatCount: state.textureSeatCount,
      textureBuildCount: state.textureBuildCount,
      textureSource: state.textureSource,
      textureCoverage: state.textureCoverage,
      textureContrastAverage: state.textureContrastAverage,

      bodyLensReady: true,
      surfaceLensReady: true,
      terrainLensReady: true,
      latticeLensReady: true,
      receiptLensReady: true,
      dragRotateReady: true,
      zoomReady: true,

      activeLens: state.activeLens,
      zoom: round(state.zoom, 4),
      renderCount: state.renderCount,
      visualIncomplete: state.visualIncomplete,
      dryBodyFallbackActive: state.dryBodyFallbackActive,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false
    };
  }

  function getSourceValidationReceipt() {
    state.sourceValidationReceipt = buildSourceValidationReceipt();
    return safeClone(state.sourceValidationReceipt);
  }

  function getCarrierConsumptionReceipt() {
    state.carrierConsumptionReceipt = buildCarrierConsumptionReceipt();
    return safeClone(state.carrierConsumptionReceipt);
  }

  function getRenderReceipt() {
    state.renderReceipt = buildRenderReceipt();
    return safeClone(state.renderReceipt);
  }

  function publishStatus(options) {
    var force = Boolean(options && options.force);
    var now = (typeof window !== "undefined" && window.performance && typeof window.performance.now === "function") ? window.performance.now() : Date.now();

    if (!force && state.lastStatusPayload && now - state.lastStatusPublishedAt < STATUS_THROTTLE_MS) return state.lastStatusPayload;

    var source = buildSourceValidationReceipt();
    var carrier = buildCarrierConsumptionReceipt();
    var render = buildRenderReceipt();

    var payload = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      file: FILE,
      route: ROUTE,

      initialized: state.initialized,
      started: state.started,
      routeAllowed: routeAllowed(),

      sourceValidationReceipt: source,
      carrierConsumptionReceipt: carrier,
      renderReceipt: render,

      datumDetected: source.datumDetected,
      datumValidated: source.datumValidated,
      terrainDetected: source.terrainDetected,
      terrainValidated: source.terrainValidated,
      surfaceDetected: source.surfaceDetected,
      surfaceValidated: source.surfaceValidated,

      sourceSeatCount: source.datumSeatCount,
      terrainSeatCount: source.terrainSeatCount,
      surfaceSeatCount: source.surfaceSeatCount,

      oneCanvasMounted: render.oneCanvasMounted,
      onePlanetRendered: render.onePlanetRendered,
      textureBuilt: render.textureBuilt,
      textureSeatCount: render.textureSeatCount,

      bodyLensReady: render.bodyLensReady,
      surfaceLensReady: render.surfaceLensReady,
      terrainLensReady: render.terrainLensReady,
      latticeLensReady: render.latticeLensReady,
      receiptLensReady: render.receiptLensReady,
      dragRotateReady: render.dragRotateReady,
      zoomReady: render.zoomReady,

      carrierConsumesPacketsForDisplayOnly: true,
      carrierInventsTerrain: false,
      carrierInventsSurface: false,
      carrierOwnsTerrainTruth: false,
      carrierOwnsSurfaceTruth: false,
      carrierOwnsHydrationTruth: false,

      hydrationHeld: true,
      activeHydration: false,
      activeWater: false,
      finalVisualPassClaim: false,

      activeLens: state.activeLens,
      zoom: round(state.zoom, 4),
      renderCount: state.renderCount,

      visualRuntimeReady: state.oneCanvasMounted && state.datumValidated && state.terrainValidated,
      routeCutoverCandidate: true,
      visualIncomplete: state.visualIncomplete,
      dryBodyFallbackActive: state.dryBodyFallbackActive,

      errors: state.errors.slice(),
      deployMarker: "AUDRALIA_G2_PLANET_TERRAIN_RENDERER_PTR_DEPLOY_MARKER_v1"
    };

    state.lastStatusPublishedAt = now;
    state.lastStatusPayload = payload;

    if (typeof window !== "undefined") {
      window.AUDRALIA_G2_PLANET_RENDERER_STATUS = payload;
      window.AUDRALIA_G2_PLANET_RENDERER_RECEIPT = render;
      window.AUDRALIA_G2_PTR_SOURCE_VALIDATION_RECEIPT = source;
      window.AUDRALIA_G2_PTR_CARRIER_CONSUMPTION_RECEIPT = carrier;
    }

    if (typeof document !== "undefined") {
      try {
        document.documentElement.dataset.audraliaG2PtrContract = CONTRACT;
        document.documentElement.dataset.audraliaG2PtrDatumValidated = String(state.datumValidated);
        document.documentElement.dataset.audraliaG2PtrTerrainValidated = String(state.terrainValidated);
        document.documentElement.dataset.audraliaG2PtrSurfaceValidated = String(state.surfaceValidated);
        document.documentElement.dataset.audraliaG2PtrOneCanvasMounted = String(state.oneCanvasMounted);
        document.documentElement.dataset.audraliaG2PtrOnePlanetRendered = String(state.onePlanetRendered);
        document.documentElement.dataset.audraliaG2PtrTextureBuilt = String(state.textureBuilt);
        document.documentElement.dataset.audraliaG2PtrFinalVisualPassClaim = "false";
        document.documentElement.dataset.audraliaG2PtrActiveWater = "false";
      } catch (_error) {}
    }

    return payload;
  }

  function status() {
    return publishStatus({ force: true });
  }

  function render() {
    requestRender();
    return getRenderReceipt();
  }

  function stop() {
    state.stopped = true;
    state.started = false;

    if (state.raf && typeof window !== "undefined") window.cancelAnimationFrame(state.raf);

    state.raf = 0;
  }

  function start() {
    state.stopped = false;
    state.started = true;
    refreshSources();
    requestRender();
    return status();
  }

  function refresh() {
    refreshSources();
    return status();
  }

  function init() {
    state.initialized = true;

    buildLatticeGeometry();
    refreshSources();

    if (routeAllowed() && mountCanvas()) {
      resize();
      bindControls();
      window.addEventListener("resize", resize, { passive: true });
      setLens("surface");
      state.started = true;
      requestRender();
    }

    publishStatus({ force: true });

    if (typeof window !== "undefined") {
      window.setTimeout(refreshSources, 180);
      window.setTimeout(refreshSources, 640);
      window.setTimeout(refreshSources, 1200);
      window.setTimeout(refreshSources, 1800);
    }

    return status();
  }

  function publish() {
    var api = {
      contract: CONTRACT,
      specOps: SPEC_OPS,
      newsAlignment: NEWS,
      ccr: CCR,
      file: FILE,
      route: ROUTE,

      status: status,
      refresh: refresh,
      start: start,
      stop: stop,
      render: render,
      setLens: setLens,
      setZoom: setZoom,
      resetCamera: resetCamera,
      getRenderReceipt: getRenderReceipt,
      getSourceValidationReceipt: getSourceValidationReceipt,
      getCarrierConsumptionReceipt: getCarrierConsumptionReceipt
    };

    if (typeof window !== "undefined") {
      window.AUDRALIA_G2_PLANET_TERRAIN_RENDERER = api;
      window.AUDRALIA_G2_PTR = api;
      window.__AUDRALIA_G2_PTR_CONTROLLER__ = api;
      window.__AUDRALIA_G2_PLANET_TERRAIN_RENDERER_CONTROLLER__ = api;
    }

    return api;
  }

  publish();

  if (typeof document !== "undefined" && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
