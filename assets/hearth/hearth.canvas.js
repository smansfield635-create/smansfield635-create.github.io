// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_VISIBLE_PLANET_CARRIER_LOAD_SCREEN_COMPATIBLE_TNT_v1
// Full-file replacement.
// Canvas / visible-carrier authority only.
// Purpose:
// - Restore a functional visible Hearth planet carrier.
// - Preserve the loading screen and diagnostic receipt layer mounted by Hearth.js.
// - Keep canvas lifecycle independent from receipt/loading-screen lifecycle.
// - Accept route conductor handoff from /showroom/globe/hearth/hearth.js.
// - Draw immediately even if Runtime Table or child diagnostics are missing.
// - Consume source authorities opportunistically when present.
// - Preserve drag inspection.
// Does not own:
// - route shell
// - route orchestration
// - Runtime Table truth
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_VISIBLE_PLANET_CARRIER_LOAD_SCREEN_COMPATIBLE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_VISIBLE_PLANET_CARRIER_LOAD_SCREEN_COMPATIBLE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_LOAD_SCREEN_CANVAS_HANDOFF_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DYNAMIC_ROUTE_CONDUCTOR_RUNTIME_TABLE_CANVAS_REBALANCE_PREGAME_TO_POSTGAME_BINDING_v1";
  const VERSION = "2026-05-29.hearth-canvas-visible-planet-carrier-load-screen-compatible-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const DESTINATION_FILE = "/assets/hearth/hearth.canvas.js";
  const CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const EPSILON = 0.000001;

  const COLOR = Object.freeze({
    space: [0, 0, 0, 0],
    abyss: [2, 9, 22],
    deep: [4, 23, 52],
    ocean: [7, 54, 96],
    shelf: [24, 112, 137],
    waterline: [94, 166, 162],
    foam: [130, 184, 166],
    wetStone: [55, 69, 76],
    beach: [190, 170, 112],
    grass: [80, 128, 70],
    forest: [34, 95, 60],
    wetForest: [26, 82, 58],
    plains: [124, 145, 86],
    savanna: [156, 140, 78],
    desert: [178, 142, 82],
    steppe: [130, 120, 82],
    highland: [114, 116, 94],
    mountain: [92, 91, 86],
    cliff: [50, 56, 66],
    basalt: [38, 45, 55],
    tundra: [132, 140, 122],
    snow: [212, 228, 230],
    ice: [192, 218, 226],
    rim: [5, 16, 30],
    glow: [141, 216, 255]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    conductorContract: CONDUCTOR_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    route: ROUTE,
    destinationFile: DESTINATION_FILE,
    activeRouteConductor: CONDUCTOR_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,

    mounted: false,
    mountId: "hearthCanvasMount",
    mountPresent: false,
    canvasCreated: false,
    canvasCarrierMounted: false,
    visibleCarrierMounted: false,
    loadingScreenPreserved: true,
    receiptOverlayIndependent: true,

    runtimeTableOptional: true,
    runtimeTablePlanConsumed: false,
    runtimeTableMissingDoesNotBlockCarrier: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    sourceAuthorityHeld: true,

    conductorPayloadReceived: false,
    conductorReceiptPresent: false,

    sourceAvailability: {
      tectonics: false,
      elevation: false,
      composition: false,
      hydrology: false,
      materials: false,
      hexAuthority: false,
      hexSurface: false,
      runtimeTable: false
    },

    textureBuilt: false,
    textureWidth: 0,
    textureHeight: 0,
    textureSourceMode: "not-built",

    animationActive: false,
    frames: 0,
    lastFrameAt: 0,
    dragging: false,
    dragInspectionBound: false,
    pointerControlsBound: false,

    imageRendered: false,
    coherentExpressionPass: false,
    visualPassClaimed: false,

    postgameStatus: "CANVAS_NOT_MOUNTED",
    firstFailedCoordinate: "CANVAS_NOT_MOUNTED",
    recommendedNextRenewalTarget: "canvas-mount",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    errors: [],
    events: [],
    updatedAt: ""
  };

  let activeInstance = null;

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

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mix(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function lift(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(EPSILON, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function softBand(value, center, width) {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(EPSILON, width), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function log(event, detail = {}) {
    const entry = {
      event,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.events.push(entry);
    state.updatedAt = entry.at;

    if (state.events.length > 50) {
      state.events.splice(0, state.events.length - 50);
    }

    return entry;
  }

  function addError(code, message, detail = {}) {
    const item = {
      code,
      message,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);

    if (state.errors.length > 20) {
      state.errors.splice(0, state.errors.length - 20);
    }

    log("ERROR", item);
    return item;
  }

  function getDataset() {
    return doc && doc.documentElement ? doc.documentElement.dataset : null;
  }

  function publishDataset() {
    const dataset = getDataset();
    if (!dataset) return;

    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasConductorContract = CONDUCTOR_CONTRACT;
    dataset.hearthCanvasDestinationFile = DESTINATION_FILE;

    dataset.hearthCanvasMountPresent = String(state.mountPresent);
    dataset.hearthCanvasMounted = String(state.mounted);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthVisibleCarrierMounted = String(state.visibleCarrierMounted);
    dataset.hearthCanvasImageRendered = String(state.imageRendered);
    dataset.hearthImageRendered = String(state.imageRendered);

    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthControlsBound = String(state.pointerControlsBound);

    dataset.hearthLoadingScreenPreserved = "true";
    dataset.hearthReceiptOverlayIndependent = "true";
    dataset.hearthRuntimeTableOptional = "true";
    dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthSourceAuthorityHeld = "true";

    dataset.hearthCanvasTextureBuilt = String(state.textureBuilt);
    dataset.hearthCanvasTextureSourceMode = state.textureSourceMode;
    dataset.hearthCanvasFrames = String(state.frames);

    dataset.hearthCanvasPostgameStatus = state.postgameStatus;
    dataset.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthCanvasRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthCoherentExpressionPass = "false";
    dataset.hearthVisualPassClaimed = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publish(reason) {
    state.updatedAt = nowIso();

    publishDataset();

    root.HEARTH_CANVAS_POSTGAME_RECEIPT = getReceipt(reason);
    root.HEARTH_CANVAS_RECEIPT = root.HEARTH_CANVAS_POSTGAME_RECEIPT;
    root.HEARTH_CANVAS_CONTRACT = CONTRACT;

    const statusNode =
      doc &&
      (
        doc.getElementById("hearth-route-status") ||
        doc.querySelector("[data-hearth-route-status='true']") ||
        doc.querySelector("[data-hearth-route-status]")
      );

    if (statusNode) {
      const existing = statusNode.textContent || "";

      if (!existing.includes(CONTRACT) || state.frames < 3 || state.frames % 120 === 0) {
        statusNode.textContent = [
          "Hearth canvas visible carrier active.",
          `Canvas contract ${CONTRACT}`,
          `Receipt ${RECEIPT}`,
          `Previous canvas ${PREVIOUS_CONTRACT}`,
          `Conductor expected ${CONDUCTOR_CONTRACT}`,
          `Status ${state.postgameStatus}`,
          `Reason ${reason}`,
          `Mount present ${state.mountPresent}`,
          `Canvas carrier mounted ${state.canvasCarrierMounted}`,
          `Visible carrier mounted ${state.visibleCarrierMounted}`,
          `Loading screen preserved ${state.loadingScreenPreserved}`,
          `Receipt overlay independent ${state.receiptOverlayIndependent}`,
          `Runtime Table optional ${state.runtimeTableOptional}`,
          `Runtime Table missing does not block carrier ${state.runtimeTableMissingDoesNotBlockCarrier}`,
          `Texture built ${state.textureBuilt}`,
          `Texture source mode ${state.textureSourceMode}`,
          `Drag inspection bound ${state.dragInspectionBound}`,
          `Image rendered ${state.imageRendered}`,
          "Coherent expression pass false",
          "Visual pass claimed false",
          `First failed coordinate ${state.firstFailedCoordinate}`,
          `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
          `Frames ${state.frames}`,
          `Updated ${state.updatedAt}`
        ].join("\n");
      }
    }

    log("PUBLISH", {
      reason,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget
    });
  }

  function getAuthority(name) {
    switch (name) {
      case "runtimeTable":
        return (
          root.LAB_RUNTIME_TABLE ||
          root.DexterRuntimeTable ||
          root.RUNTIME_TABLE ||
          root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
          (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
          null
        );

      case "tectonics":
        return root.HEARTH_TECTONICS || root.HearthTectonics || (root.HEARTH && root.HEARTH.tectonics) || null;

      case "elevation":
        return root.HEARTH_ELEVATION || root.HearthElevation || (root.HEARTH && root.HEARTH.elevation) || null;

      case "composition":
        return root.HEARTH_COMPOSITION || root.HearthComposition || (root.HEARTH && root.HEARTH.composition) || null;

      case "hydrology":
        return root.HEARTH_HYDROLOGY || root.HearthHydrology || (root.HEARTH && root.HEARTH.hydrology) || null;

      case "materials":
        return root.HEARTH_MATERIALS || root.HearthMaterials || (root.HEARTH && root.HEARTH.materials) || null;

      case "hexAuthority":
        return root.HEARTH_HEX_FOUR_PAIR_AUTHORITY || root.HEARTH_HEX_AUTHORITY || (root.HEARTH && root.HEARTH.hexAuthority) || null;

      case "hexSurface":
        return root.HEARTH_HEX_SURFACE || root.HearthHexSurface || (root.HEARTH && root.HEARTH.hexSurface) || null;

      default:
        return null;
    }
  }

  function updateSourceAvailability() {
    state.sourceAvailability.runtimeTable = Boolean(getAuthority("runtimeTable"));
    state.sourceAvailability.tectonics = Boolean(getAuthority("tectonics"));
    state.sourceAvailability.elevation = Boolean(getAuthority("elevation"));
    state.sourceAvailability.composition = Boolean(getAuthority("composition"));
    state.sourceAvailability.hydrology = Boolean(getAuthority("hydrology"));
    state.sourceAvailability.materials = Boolean(getAuthority("materials"));
    state.sourceAvailability.hexAuthority = Boolean(getAuthority("hexAuthority"));
    state.sourceAvailability.hexSurface = Boolean(getAuthority("hexSurface"));

    return { ...state.sourceAvailability };
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

  function vectorFromUv(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = Math.PI / 2 - clamp(v, 0, 1) * Math.PI;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function uvFromLonLat(lon, lat) {
    return {
      u: wrap01((lon / DEG + 180) / 360),
      v: clamp((90 - lat / DEG) / 180, 0, 1)
    };
  }

  function hash(x, y, seed) {
    let h = Math.imul((x | 0) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul((y | 0) ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const ax0 = ((x0 % s) + s) % s;
    const ax1 = ((x1 % s) + s) % s;

    const n00 = hash(ax0, y0, seed);
    const n10 = hash(ax1, y0, seed);
    const n01 = hash(ax0, y1, seed);
    const n11 = hash(ax1, y1, seed);

    return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.56;
    let scale = 3;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u + i * 0.013, v - i * 0.017, scale, seed + i * 173) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(EPSILON, norm);
  }

  function ridged(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.60;
    let scale = 7;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u + i * 0.019, v - i * 0.011, scale, seed + i * 241);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.53;
      scale *= 2;
    }

    return total / Math.max(EPSILON, norm);
  }

  const FALLBACK_MASSES = Object.freeze([
    { key: "western-shield", lat: 18 * DEG, lon: -118 * DEG, rx: 48 * DEG, ry: 23 * DEG, angle: 20 * DEG, seed: 11 },
    { key: "eastern-basin", lat: 6 * DEG, lon: 28 * DEG, rx: 45 * DEG, ry: 24 * DEG, angle: -10 * DEG, seed: 22 },
    { key: "northern-cold", lat: 61 * DEG, lon: -38 * DEG, rx: 42 * DEG, ry: 18 * DEG, angle: 12 * DEG, seed: 33 },
    { key: "southern-harsh", lat: -45 * DEG, lon: 84 * DEG, rx: 43 * DEG, ry: 20 * DEG, angle: -18 * DEG, seed: 44 },
    { key: "equatorial-wet", lat: -10 * DEG, lon: -34 * DEG, rx: 38 * DEG, ry: 19 * DEG, angle: 28 * DEG, seed: 55 },
    { key: "mountain-arc", lat: 21 * DEG, lon: 138 * DEG, rx: 39 * DEG, ry: 17 * DEG, angle: -24 * DEG, seed: 66 },
    { key: "broken-archipelago", lat: -31 * DEG, lon: -164 * DEG, rx: 36 * DEG, ry: 14 * DEG, angle: 14 * DEG, seed: 77 }
  ]);

  const FALLBACK_ISLANDS = Object.freeze([
    { lat: 69 * DEG, lon: -76 * DEG, rx: 6.5 * DEG, ry: 2.6 * DEG, angle: -20 * DEG, seed: 101 },
    { lat: 72 * DEG, lon: 44 * DEG, rx: 5.2 * DEG, ry: 2.1 * DEG, angle: 18 * DEG, seed: 102 },
    { lat: 21 * DEG, lon: 66 * DEG, rx: 5.8 * DEG, ry: 2.4 * DEG, angle: -26 * DEG, seed: 103 },
    { lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, seed: 104 },
    { lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, seed: 105 },
    { lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, seed: 106 },
    { lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, seed: 107 },
    { lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2.0 * DEG, angle: 11 * DEG, seed: 108 },
    { lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, seed: 109 }
  ]);

  function ellipseField(lon, lat, mass) {
    const dx = wrapPi(lon - mass.lon) * Math.cos(mass.lat);
    const dy = lat - mass.lat;
    const ca = Math.cos(mass.angle);
    const sa = Math.sin(mass.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / mass.rx;
    const ny = y / mass.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);

    return { theta, dist, nx, ny };
  }

  function fallbackLandField(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = Math.PI / 2 - clamp(v, 0, 1) * Math.PI;

    let best = {
      field: -10,
      mass: FALLBACK_MASSES[0],
      theta: 0,
      island: false
    };

    FALLBACK_MASSES.forEach((mass) => {
      const e = ellipseField(lon, lat, mass);
      const chip =
        Math.sin(e.theta * (7 + mass.seed % 5) + e.nx * 4.7 - e.ny * 3.8) * 0.055 +
        Math.sin(e.theta * (11 + mass.seed % 3) - mass.seed * 0.11) * 0.045;

      const fracture = (ridged(u + mass.seed * 0.011, v - mass.seed * 0.009, 19000 + mass.seed, 5) - 0.5) * 0.18;
      const bayCut = smoothstep(0.52, 0.94, noise(u - mass.seed * 0.013, v + mass.seed * 0.017, 96, 20000 + mass.seed)) * 0.10;
      const field = 1 - e.dist + chip + fracture - bayCut;

      if (field > best.field) {
        best = {
          field,
          mass,
          theta: e.theta,
          island: false
        };
      }
    });

    FALLBACK_ISLANDS.forEach((island) => {
      const e = ellipseField(lon, lat, island);
      const chip = Math.sin(e.theta * 6 + island.seed * 0.13) * 0.13 + Math.sin(e.theta * 10) * 0.06;
      const field = 0.35 + chip - e.dist;

      if (field > best.field) {
        best = {
          field,
          mass: FALLBACK_MASSES[6],
          theta: e.theta,
          island: true
        };
      }
    });

    const coast = clamp01(1 - smoothstep(0.015, 0.16, Math.abs(best.field)));
    const shelf = clamp01(smoothstep(-0.28, 0.04, best.field) * (best.field <= 0 ? 1 : 0));
    const elevation = clamp(-0.42 + best.field * 0.55 + fbm(u, v, 24000, 4) * 0.10, -1, 1);

    return {
      field: best.field,
      elevation,
      isLand: best.field > 0,
      isWater: best.field <= 0,
      coast,
      shelf,
      mass: best.mass,
      island: best.island,
      lon,
      lat
    };
  }

  function safeSampleAuthority(authority, methods, packet) {
    if (!authority || !isObject(authority)) return null;

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](packet);

        if (result && isObject(result)) {
          return result;
        }
      } catch (_error) {
        try {
          const result = authority[method](packet.u, packet.v);

          if (result && isObject(result)) {
            return result;
          }
        } catch (_error2) {}
      }
    }

    return null;
  }

  function sampleSourcePacket(u, v) {
    const vector = vectorFromUv(u, v);
    const lon = wrap01(u) * 360 - 180;
    const lat = 90 - clamp(v, 0, 1) * 180;

    const packet = {
      u,
      v,
      lon,
      lat,
      longitude: lon,
      latitude: lat,
      x: vector.x,
      y: vector.y,
      z: vector.z
    };

    const elevationAuthority = getAuthority("elevation");
    const compositionAuthority = getAuthority("composition");
    const hydrologyAuthority = getAuthority("hydrology");
    const materialsAuthority = getAuthority("materials");
    const hexSurfaceAuthority = getAuthority("hexSurface");

    const elevation = safeSampleAuthority(elevationAuthority, ["sample", "read", "getElevation", "sampleElevation"], packet);
    const composition = safeSampleAuthority(compositionAuthority, ["sample", "read", "compose", "sampleComposition", "readComposition"], elevation || packet);
    const hydrology = safeSampleAuthority(hydrologyAuthority, ["sample", "read", "sampleHydrology", "readHydrology", "getHydrology"], composition || elevation || packet);
    const materials = safeSampleAuthority(materialsAuthority, ["sample", "read", "sampleMaterial", "getMaterial", "resolve"], {
      ...packet,
      elevation,
      composition,
      hydrology
    });
    const hexSurface = safeSampleAuthority(hexSurfaceAuthority, ["sample", "read", "sampleSurface", "getSurface"], {
      ...packet,
      elevation,
      composition,
      hydrology,
      materials
    });

    return {
      packet,
      elevation,
      composition,
      hydrology,
      materials,
      hexSurface
    };
  }

  function extractRgb(source) {
    if (!source || !isObject(source)) return null;

    const keys = [
      "rgb",
      "color",
      "materialRgb",
      "surfaceRgb",
      "finalRgb",
      "finalColor",
      "finalColorHint",
      "baseColor",
      "landRgb",
      "waterRgb",
      "oceanRgb"
    ];

    for (const key of keys) {
      const value = source[key];

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

    return null;
  }

  function colorFromSource(sample, u, v) {
    const elevation = sample.elevation || {};
    const composition = sample.composition || {};
    const hydrology = sample.hydrology || {};
    const materials = sample.materials || {};
    const hexSurface = sample.hexSurface || {};

    const direct =
      extractRgb(hexSurface) ||
      extractRgb(materials);

    if (direct) return direct;

    const elevationValue = Number.isFinite(Number(composition.elevation))
      ? Number(composition.elevation)
      : Number.isFinite(Number(elevation.elevation))
        ? Number(elevation.elevation)
        : 0;

    const isLand =
      composition.isLand === true ||
      elevation.isLand === true ||
      elevationValue > 0;

    const isWater =
      composition.isWater === true ||
      elevation.isWater === true ||
      elevationValue <= 0;

    const hydrologyClass = hydrology.hydrologyClass || hydrology.waterBoundaryClass || "";
    const terrainClass = composition.worldTerrainClass || composition.terrainClass || elevation.terrainClassHint || "";
    const climateClass = composition.climateClass || elevation.climateHint || "";
    const coast = clamp01(
      Number(composition.coastPotential || 0) ||
      Number(elevation.coastPotential || 0) ||
      Number(hydrology.waterlineBoundaryStrength || 0) ||
      Number(hydrology.beachStrength || 0)
    );
    const shelf = clamp01(
      Number(hydrology.shelfGradient || 0) ||
      Number(hydrology.shallowShelfStrength || 0) ||
      Number(composition.shelfPotential || 0) ||
      Number(elevation.shelfPotential || 0)
    );
    const relief = clamp01(
      Number(composition.reliefStrength || 0) ||
      Number(composition.mountainArcPotential || 0) ||
      Number(elevation.mountainArcPotential || 0) ||
      Number(composition.escarpmentPotential || 0)
    );

    if (isWater) {
      let c = mix(COLOR.abyss, COLOR.deep, clamp01((Number(elevation.waterDepthPotential || 0) + Number(hydrology.waterDepth || 0)) * 0.5));
      c = mix(c, COLOR.ocean, smoothstep(-0.36, -0.04, elevationValue) * 0.52);
      c = mix(c, COLOR.shelf, shelf * 0.60);
      c = mix(c, COLOR.waterline, clamp01(Number(hydrology.waterlineBoundaryStrength || 0)) * 0.38);
      c = mix(c, COLOR.foam, coast * shelf * 0.18);
      return c;
    }

    let c = COLOR.plains;

    if (
      terrainClass.includes("mountain") ||
      terrainClass.includes("ridge") ||
      terrainClass.includes("summit") ||
      climateClass.includes("alpine")
    ) {
      c = mix(COLOR.highland, COLOR.mountain, clamp01(relief * 0.85 + elevationValue * 0.35));
    } else if (terrainClass.includes("cliff") || terrainClass.includes("escarpment")) {
      c = COLOR.cliff;
    } else if (terrainClass.includes("canyon")) {
      c = mix(COLOR.basalt, COLOR.desert, 0.35);
    } else if (terrainClass.includes("basin") || climateClass.includes("rainforest") || climateClass.includes("monsoon")) {
      c = mix(COLOR.wetForest, COLOR.forest, 0.35);
    } else if (climateClass.includes("arid") || terrainClass.includes("plateau")) {
      c = mix(COLOR.savanna, COLOR.desert, 0.48);
    } else if (climateClass.includes("polar") || terrainClass.includes("ice")) {
      c = COLOR.ice;
    } else if (climateClass.includes("tundra")) {
      c = COLOR.tundra;
    } else if (climateClass.includes("temperate")) {
      c = mix(COLOR.grass, COLOR.highland, 0.30);
    }

    if (hydrologyClass.includes("wet_stone")) c = mix(c, COLOR.wetStone, 0.36);
    if (hydrologyClass.includes("cliff")) c = mix(c, COLOR.cliff, 0.30);
    if (hydrologyClass.includes("beach") || hydrologyClass.includes("sand")) c = mix(c, COLOR.beach, 0.42);

    c = mix(c, COLOR.beach, coast * 0.20);
    c = lift(c, relief * 20 + fbm(u, v, 41000, 4) * 8 - 5);

    return c;
  }

  function fallbackColor(u, v) {
    const land = fallbackLandField(u, v);

    if (!land.isLand) {
      let c = mix(COLOR.abyss, COLOR.deep, noise(u, v, 12, 31000));
      c = mix(c, COLOR.ocean, smoothstep(0.20, 0.90, land.shelf) * 0.48);
      c = mix(c, COLOR.shelf, land.shelf * 0.58);
      c = mix(c, COLOR.foam, land.coast * land.shelf * 0.16);
      return c;
    }

    const latCold = Math.abs(land.lat) / (Math.PI / 2);
    const heat = clamp01(1 - latCold + (noise(u, v, 8, 33000) - 0.5) * 0.24);
    const moisture = clamp01(noise(u + 0.17, v - 0.11, 10, 34000) * 0.72 + land.coast * 0.22 + (land.island ? 0.08 : 0));
    const ridge = ridged(u + land.mass.seed * 0.021, v - land.mass.seed * 0.017, 35000, 5);
    const mountain = smoothstep(0.58, 0.92, ridge);
    const highland = smoothstep(0.46, 0.82, ridge);
    const ice = smoothstep(0.68, 0.95, latCold + mountain * 0.16 - heat * 0.12);

    let c;

    if (ice > 0.58) {
      c = mix(COLOR.tundra, COLOR.ice, ice);
    } else if (mountain > 0.68) {
      c = mix(COLOR.highland, COLOR.mountain, mountain);
    } else if (heat > 0.66 && moisture < 0.32) {
      c = COLOR.desert;
    } else if (heat > 0.58 && moisture < 0.48) {
      c = COLOR.savanna;
    } else if (moisture > 0.72 && heat > 0.46) {
      c = COLOR.wetForest;
    } else if (moisture > 0.56) {
      c = COLOR.forest;
    } else if (latCold > 0.52) {
      c = COLOR.tundra;
    } else if (moisture < 0.35) {
      c = COLOR.steppe;
    } else {
      c = COLOR.plains;
    }

    c = mix(c, COLOR.beach, land.coast * 0.22);
    c = mix(c, COLOR.cliff, land.coast * mountain * 0.30);
    c = mix(c, COLOR.snow, ice * mountain * 0.34);

    const fine = noise(u + 0.41, v - 0.33, 128, 36000);
    const relief = mountain * 18 + highland * 8 + fine * 8 - land.coast * 4;

    return lift(c, relief - 6);
  }

  function sourceColor(u, v) {
    const availability = updateSourceAvailability();

    if (
      availability.elevation ||
      availability.composition ||
      availability.hydrology ||
      availability.materials ||
      availability.hexSurface
    ) {
      try {
        const sample = sampleSourcePacket(u, v);
        return colorFromSource(sample, u, v);
      } catch (error) {
        addError("SOURCE_SAMPLE_FAILED", error && error.message ? error.message : String(error), { u, v });
      }
    }

    return fallbackColor(u, v);
  }

  function createTexture(width, height) {
    const canvas = doc.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const availability = updateSourceAvailability();
    const usingSources =
      availability.elevation ||
      availability.composition ||
      availability.hydrology ||
      availability.materials ||
      availability.hexSurface;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const c = usingSources ? sourceColor(u, v) : fallbackColor(u, v);
        const i = (y * width + x) * 4;

        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    state.textureBuilt = true;
    state.textureWidth = width;
    state.textureHeight = height;
    state.textureSourceMode = usingSources ? "source-authority-opportunistic" : "fallback-visible-carrier";
    log("TEXTURE_BUILT", {
      width,
      height,
      sourceMode: state.textureSourceMode,
      availability
    });

    return {
      width,
      height,
      data
    };
  }

  function ensureMount(payload = {}) {
    if (!doc) return null;

    let mount = payload.mount && payload.mount.nodeType === 1
      ? payload.mount
      : null;

    if (!mount && payload.mountId) {
      mount = doc.getElementById(payload.mountId);
    }

    if (!mount) {
      mount =
        doc.getElementById("hearthCanvasMount") ||
        doc.querySelector("[data-hearth-canvas-mount='true']") ||
        doc.querySelector("[data-hearth-canvas-mount]");
    }

    if (!mount) {
      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasCreatedByCanvasAuthority = "true";
      mount.style.position = "relative";
      mount.style.minHeight = "320px";
      mount.style.aspectRatio = "1 / 1";
      mount.style.overflow = "hidden";
      parent.appendChild(mount);
    }

    mount.id = mount.id || "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCanvasAuthority = CONTRACT;
    mount.dataset.hearthCanvasAuthorityLoaded = "true";
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.runtimeTableOptional = "true";
    mount.dataset.runtimeTableMissingDoesNotBlockCarrier = "true";
    mount.dataset.receiptOverlayIndependent = "true";
    mount.dataset.hearthVisibleCarrierMounted = String(state.visibleCarrierMounted);
    mount.dataset.hearthCanvasMounted = String(state.canvasCarrierMounted);

    mount.style.position = mount.style.position || "relative";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    state.mountPresent = true;
    state.mountId = mount.id || "hearthCanvasMount";

    return mount;
  }

  function hideFallbackOnly(mount) {
    if (!mount) return;

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });
  }

  function removePriorCanvasOnly(mount) {
    if (!mount) return;

    mount.querySelectorAll("canvas[data-hearth-canvas-carrier='true'], canvas[data-hearth-visible-carrier='true']").forEach((canvas) => {
      canvas.remove();
    });
  }

  function createCarrierCanvas(mount) {
    removePriorCanvasOnly(mount);

    const canvas = doc.createElement("canvas");
    canvas.dataset.hearthCanvasCarrier = "true";
    canvas.dataset.hearthVisibleCarrier = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.zIndex = "3";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.webkitTouchCallout = "none";

    mount.appendChild(canvas);
    hideFallbackOnly(mount);

    state.canvasCreated = true;
    state.canvasCarrierMounted = true;
    state.visibleCarrierMounted = true;
    state.mounted = true;

    mount.dataset.hearthCanvasMounted = "true";
    mount.dataset.hearthVisibleCarrierMounted = "true";

    log("CARRIER_CANVAS_CREATED", {
      mountId: mount.id
    });

    return canvas;
  }

  function computeCanvasSize(mount, canvas) {
    const box = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 420, height: 420 };
    const cssSize = Math.max(280, Math.floor(Math.min(box.width || 420, box.height || box.width || 420)));
    const dpr = Math.min(1.75, root.devicePixelRatio || 1);
    const size = Math.min(640, Math.max(340, Math.floor(cssSize * dpr)));

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }

    return {
      width: size,
      height: size
    };
  }

  function sampleTexture(texture, u, v) {
    const tx = Math.floor(wrap01(u) * texture.width) % texture.width;
    const ty = clamp(Math.floor(clamp(v, 0, 0.999999) * texture.height), 0, texture.height - 1);
    const i = (ty * texture.width + tx) * 4;

    return [
      texture.data[i],
      texture.data[i + 1],
      texture.data[i + 2]
    ];
  }

  function createInstance(payload = {}) {
    const mount = ensureMount(payload);
    const canvas = createCarrierCanvas(mount);
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    const textureWidth = clamp(Number(payload.textureWidth || 768), 256, 1400);
    const textureHeight = clamp(Number(payload.textureHeight || 384), 128, 700);
    const texture = createTexture(textureWidth, textureHeight);

    const instance = {
      mount,
      canvas,
      ctx,
      texture,
      disposed: false,
      yaw: -0.28,
      tilt: -0.18,
      yawVelocity: 0.0022,
      tiltVelocity: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      frameHandle: 0,
      payload: clonePlain({
        hasRuntimeTablePlan: Boolean(payload.runtimeTablePlan),
        conductorContract: payload.contract || "",
        route: payload.route || ROUTE
      })
    };

    return instance;
  }

  function renderFrame(instance) {
    if (!instance || instance.disposed) return;

    const { mount, canvas, ctx, texture } = instance;
    const size = computeCanvasSize(mount, canvas);
    const width = size.width;
    const height = size.height;

    const image = ctx.createImageData(width, height);
    const data = image.data;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.44;
    const cosT = Math.cos(instance.tilt);
    const sinT = Math.sin(instance.tilt);

    for (let y = 0; y < height; y += 1) {
      const sy = (y - cy) / radius;

      for (let x = 0; x < width; x += 1) {
        const sx = (x - cx) / radius;
        const rr = sx * sx + sy * sy;
        const i = (y * width + x) * 4;

        if (rr > 1) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - rr);
        const yy = sy * cosT + z * sinT;
        const zz = z * cosT - sy * sinT;
        const lon = Math.atan2(sx, zz) + instance.yaw;
        const lat = Math.asin(clamp(yy, -1, 1));
        const u = lon / TAU + 0.5;
        const v = 0.5 - lat / Math.PI;

        let c = sampleTexture(texture, u, v);

        const light = clamp(0.42 + z * 0.58 + sx * -0.08 + sy * -0.08, 0.18, 1.08);
        const limb = clamp(0.35 + z * 0.78, 0.2, 1);
        const atmosphericRim = smoothstep(0.72, 1, rr);

        c = [
          Math.round(c[0] * light * limb),
          Math.round(c[1] * light * limb),
          Math.round(c[2] * light * limb)
        ];

        c = mix(c, COLOR.rim, atmosphericRim * 0.44);
        c = mix(c, COLOR.glow, atmosphericRim * 0.08);

        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    if (!instance.dragging) {
      instance.yaw += instance.yawVelocity;
      instance.tilt += instance.tiltVelocity;
      instance.yawVelocity *= 0.992;
      instance.tiltVelocity *= 0.93;

      if (Math.abs(instance.yawVelocity) < 0.0014) {
        instance.yawVelocity = instance.yawVelocity < 0 ? -0.0014 : 0.0014;
      }

      if (instance.tilt > 1.25) {
        instance.tilt = 1.25;
        instance.tiltVelocity *= -0.2;
      }

      if (instance.tilt < -1.25) {
        instance.tilt = -1.25;
        instance.tiltVelocity *= -0.2;
      }
    }

    state.frames += 1;
    state.lastFrameAt = Date.now();
    state.imageRendered = true;
    state.animationActive = true;
    state.canvasCarrierMounted = true;
    state.visibleCarrierMounted = true;
    state.postgameStatus = state.sourceAvailability.runtimeTable
      ? "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY"
      : "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING";
    state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

    if (state.frames < 4 || state.frames % 120 === 0) {
      publish(`render-frame-${state.frames}`);
    }

    instance.frameHandle = root.requestAnimationFrame(() => renderFrame(instance));
  }

  function bindControls(instance) {
    if (!instance || !instance.canvas || instance.controlsBound) return;

    const canvas = instance.canvas;

    function pointerDown(event) {
      instance.dragging = true;
      state.dragging = true;
      instance.lastX = event.clientX;
      instance.lastY = event.clientY;
      instance.yawVelocity = 0;
      instance.tiltVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!instance.dragging) return;

      const dx = event.clientX - instance.lastX;
      const dy = event.clientY - instance.lastY;

      instance.lastX = event.clientX;
      instance.lastY = event.clientY;

      instance.yaw += dx * 0.009;
      instance.tilt += dy * 0.0075;
      instance.tilt = clamp(instance.tilt, -1.35, 1.35);

      instance.yawVelocity = dx * 0.00085;
      instance.tiltVelocity = dy * 0.00055;

      event.preventDefault();
    }

    function pointerUp(event) {
      instance.dragging = false;
      state.dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });

    instance.disposeControls = () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
    };

    instance.controlsBound = true;
    state.pointerControlsBound = true;
    state.dragInspectionBound = true;

    if (instance.mount) {
      instance.mount.dataset.hearthControlsBound = "true";
      instance.mount.dataset.hearthDragInspectionBound = "true";
    }

    log("POINTER_CONTROLS_BOUND", {
      canvasCarrierMounted: state.canvasCarrierMounted,
      receiptOverlayIndependent: true
    });
  }

  function disposeActiveInstance(reason = "manual-dispose") {
    if (!activeInstance) return false;

    try {
      activeInstance.disposed = true;

      if (activeInstance.frameHandle) {
        root.cancelAnimationFrame(activeInstance.frameHandle);
      }

      if (isFunction(activeInstance.disposeControls)) {
        activeInstance.disposeControls();
      }

      if (activeInstance.canvas && activeInstance.canvas.parentNode) {
        activeInstance.canvas.parentNode.removeChild(activeInstance.canvas);
      }

      log("DISPOSE_ACTIVE_INSTANCE", { reason });
    } catch (error) {
      addError("DISPOSE_FAILED", error && error.message ? error.message : String(error), { reason });
    }

    activeInstance = null;
    state.animationActive = false;
    state.canvasCarrierMounted = false;
    state.visibleCarrierMounted = false;
    state.imageRendered = false;
    state.postgameStatus = "CANVAS_DISPOSED";
    state.firstFailedCoordinate = "CANVAS_DISPOSED";
    state.recommendedNextRenewalTarget = "canvas-remount";

    publish(`dispose-${reason}`);

    return true;
  }

  function mountVisibleCarrier(payload = {}) {
    state.conductorPayloadReceived = true;
    state.conductorReceiptPresent = Boolean(payload.conductorReceipt || payload.contract === CONDUCTOR_CONTRACT);
    state.runtimeTablePlanConsumed = Boolean(payload.runtimeTablePlan);

    updateSourceAvailability();

    if (activeInstance) {
      disposeActiveInstance("remount");
    }

    const instance = createInstance(payload);
    activeInstance = instance;

    bindControls(instance);

    state.postgameStatus = "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING";
    state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

    state.loadingScreenPreserved = true;
    state.receiptOverlayIndependent = true;
    state.canvasCarrierMounted = true;
    state.visibleCarrierMounted = true;
    state.imageRendered = false;
    state.coherentExpressionPass = false;
    state.visualPassClaimed = false;

    publish("visible-carrier-mounted-before-first-frame");

    if (isObject(payload.callbacks) && isFunction(payload.callbacks.onMounted)) {
      try {
        payload.callbacks.onMounted(getReceipt("on-mounted-callback"));
      } catch (error) {
        addError("ON_MOUNTED_CALLBACK_FAILED", error && error.message ? error.message : String(error));
      }
    }

    root.requestAnimationFrame(() => {
      renderFrame(instance);

      if (isObject(payload.callbacks) && isFunction(payload.callbacks.onRendered)) {
        try {
          payload.callbacks.onRendered(getReceipt("on-rendered-callback"));
        } catch (error) {
          addError("ON_RENDERED_CALLBACK_FAILED", error && error.message ? error.message : String(error));
        }
      }
    });

    return getReceipt("mount-visible-carrier-return");
  }

  function boot(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function mount(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function bootVisibleCarrier(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function start(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function init(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function render(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function conduct(payload = {}) {
    return mountVisibleCarrier(payload);
  }

  function refresh(reason = "manual-refresh") {
    updateSourceAvailability();

    if (activeInstance) {
      state.canvasCarrierMounted = Boolean(activeInstance.canvas && activeInstance.canvas.parentNode);
      state.visibleCarrierMounted = state.canvasCarrierMounted;
      state.imageRendered = state.imageRendered || state.frames > 0;
      state.dragInspectionBound = Boolean(activeInstance.controlsBound);
      state.pointerControlsBound = Boolean(activeInstance.controlsBound);
    }

    publish(reason);
    return getReceipt(reason);
  }

  function getReceipt(reason = "receipt-read") {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      conductorContract: CONDUCTOR_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-visible-carrier",
      destinationFile: DESTINATION_FILE,
      route: ROUTE,

      activeRouteConductor: CONDUCTOR_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false,

      mounted: state.mounted,
      mountId: state.mountId,
      mountPresent: state.mountPresent,
      canvasCreated: state.canvasCreated,
      canvasCarrierMounted: state.canvasCarrierMounted,
      visibleCarrierMounted: state.visibleCarrierMounted,

      loadingScreenPreserved: true,
      receiptOverlayIndependent: true,
      receiptRemovalDoesNotRemoveCanvas: true,

      runtimeTableOptional: true,
      runtimeTablePlanConsumed: state.runtimeTablePlanConsumed,
      runtimeTableMissingDoesNotBlockCarrier: true,

      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true,

      sourceAvailability: { ...state.sourceAvailability },
      textureBuilt: state.textureBuilt,
      textureWidth: state.textureWidth,
      textureHeight: state.textureHeight,
      textureSourceMode: state.textureSourceMode,

      conductorPayloadReceived: state.conductorPayloadReceived,
      conductorReceiptPresent: state.conductorReceiptPresent,

      animationActive: state.animationActive,
      frames: state.frames,
      lastFrameAt: state.lastFrameAt,
      dragging: state.dragging,
      dragInspectionBound: state.dragInspectionBound,
      pointerControlsBound: state.pointerControlsBound,

      imageRendered: state.imageRendered,
      coherentExpressionPass: false,
      visualPassClaimed: false,

      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,

      ownsRouteShell: false,
      ownsRouteOrchestration: false,
      ownsRuntimeTableTruth: false,
      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrologyTruth: false,
      ownsMaterialPalette: false,
      ownsFinalVisualPassClaim: false,

      reason,
      errors: clonePlain(state.errors),
      events: clonePlain(state.events),
      updatedAt: nowIso()
    };
  }

  function getReceiptText(reason = "receipt-text") {
    const receipt = getReceipt(reason);

    return [
      "HEARTH_CANVAS_VISIBLE_PLANET_CARRIER_LOAD_SCREEN_COMPATIBLE_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `conductorContract=${receipt.conductorContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `destinationFile=${receipt.destinationFile}`,
      `route=${receipt.route}`,
      "",
      `activeRouteConductor=${receipt.activeRouteConductor}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `retiredClimateRouteActiveCarrier=${receipt.retiredClimateRouteActiveCarrier}`,
      "",
      `mountPresent=${receipt.mountPresent}`,
      `mounted=${receipt.mounted}`,
      `canvasCreated=${receipt.canvasCreated}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `visibleCarrierMounted=${receipt.visibleCarrierMounted}`,
      "",
      `loadingScreenPreserved=${receipt.loadingScreenPreserved}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      `receiptRemovalDoesNotRemoveCanvas=${receipt.receiptRemovalDoesNotRemoveCanvas}`,
      "",
      `runtimeTableOptional=${receipt.runtimeTableOptional}`,
      `runtimeTablePlanConsumed=${receipt.runtimeTablePlanConsumed}`,
      `runtimeTableMissingDoesNotBlockCarrier=${receipt.runtimeTableMissingDoesNotBlockCarrier}`,
      `visibleCarrierFirst=${receipt.visibleCarrierFirst}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      "",
      `textureBuilt=${receipt.textureBuilt}`,
      `textureWidth=${receipt.textureWidth}`,
      `textureHeight=${receipt.textureHeight}`,
      `textureSourceMode=${receipt.textureSourceMode}`,
      "",
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `pointerControlsBound=${receipt.pointerControlsBound}`,
      `animationActive=${receipt.animationActive}`,
      `frames=${receipt.frames}`,
      `imageRendered=${receipt.imageRendered}`,
      `coherentExpressionPass=${receipt.coherentExpressionPass}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      "",
      "SOURCE_AVAILABILITY",
      ...Object.keys(receipt.sourceAvailability).map((key) => `${key}=${receipt.sourceAvailability[key]}`),
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    conductorContract: CONDUCTOR_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    destinationFile: DESTINATION_FILE,

    boot,
    mount,
    mountVisibleCarrier,
    bootVisibleCarrier,
    start,
    init,
    render,
    conduct,
    refresh,
    dispose: disposeActiveInstance,
    getReceipt,
    getReceiptText,

    supportsVisibleCarrierFirst: true,
    supportsLoadScreenCompatibility: true,
    supportsReceiptOverlayIndependence: true,
    supportsDragInspection: true,
    supportsRuntimeTableOptionalMode: true,
    supportsRuntimeTableMissingDoesNotBlockCarrier: true,
    supportsWideProbeDeferred: true,
    supportsSourceAuthorityOpportunisticConsumption: true,

    runtimeTableOptional: true,
    runtimeTableMissingDoesNotBlockCarrier: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    sourceAuthorityHeld: true,
    loadingScreenPreserved: true,
    receiptOverlayIndependent: true,

    ownsRouteShell: false,
    ownsRouteOrchestration: false,
    ownsRuntimeTableTruth: false,
    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyTruth: false,
    ownsMaterialPalette: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = getReceipt("initial-export");
  root.HEARTH_CANVAS_SUPPORTS_VISIBLE_CARRIER_FIRST = true;
  root.HEARTH_CANVAS_SUPPORTS_LOAD_SCREEN_COMPATIBILITY = true;
  root.HEARTH_CANVAS_SUPPORTS_RECEIPT_OVERLAY_INDEPENDENCE = true;
  root.HEARTH_CANVAS_SUPPORTS_RUNTIME_TABLE_OPTIONAL_MODE = true;

  updateSourceAvailability();
  publishDataset();

  if (doc && doc.documentElement) {
    doc.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
    doc.documentElement.dataset.hearthCanvasContract = CONTRACT;
    doc.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
    doc.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    doc.documentElement.dataset.hearthCanvasConductorContract = CONDUCTOR_CONTRACT;
    doc.documentElement.dataset.hearthCanvasSupportsLoadScreenCompatibility = "true";
    doc.documentElement.dataset.hearthCanvasSupportsReceiptOverlayIndependence = "true";
    doc.documentElement.dataset.hearthCanvasSupportsRuntimeTableOptionalMode = "true";
    doc.documentElement.dataset.generatedImage = "false";
    doc.documentElement.dataset.graphicBox = "false";
    doc.documentElement.dataset.webgl = "false";
    doc.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
