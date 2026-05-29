// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1
// Full-file replacement.
// Purpose:
// - Make Hearth canvas the visible carrier authority.
// - Consume the route conductor plan from /showroom/globe/hearth/hearth.js.
// - Consume Runtime Table output as diagnostic/procedural-plan input only.
// - Never blank the visible carrier because Runtime Table, child channels, source authorities, atlas, or wide-probe diagnostics are missing/degraded.
// - Mount a draggable visible planet immediately.
// - Render fallback carrier first, then progressively upgrade from source materials/children when available.
// - Preserve atlas sequencing, visible-carrier-first law, deferred wide-probe law, and non-final visual-pass posture.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - material palette
// - land truth
// - water truth
// - air truth
// - route orchestration
// - runtime motion authority
// - controls authority
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_ATLAS_START_SEQUENCING_HARDENING_TNT_v1";
  const ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_RUNTIME_TABLE_VISIBLE_CARRIER_TNT_v1";
  const RUNTIME_TABLE_CONTRACT = "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1";
  const VERSION = "2026-05-29.hearth-canvas-runtime-table-directed-visible-carrier-v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const DEFAULT_ROWS_PER_CHUNK = 4;
  const WIDE_PROBE_MINIMUM = 25;

  const EXPECTED = Object.freeze({
    route: ROUTE_CONDUCTOR_CONTRACT,
    runtimeTable: RUNTIME_TABLE_CONTRACT,
    materials: "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1",
    hexSurface: "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1",
    land: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
    water: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
    air: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1"
  });

  const PALETTE = Object.freeze({
    abyss: [2, 8, 18],
    deep: [4, 20, 46],
    ocean: [7, 46, 86],
    shelf: [21, 94, 118],
    shallow: [39, 123, 133],
    foam: [112, 165, 148],
    sand: [164, 142, 91],
    wetStone: [54, 61, 55],
    hardCoast: [38, 42, 40],
    land: [96, 92, 59],
    plains: [124, 137, 78],
    forest: [42, 92, 58],
    wetForest: [28, 78, 55],
    highland: [112, 110, 86],
    mountain: [96, 96, 88],
    cliff: [50, 54, 58],
    desert: [166, 134, 82],
    tundra: [126, 135, 120],
    ice: [196, 218, 224],
    snow: [220, 230, 230],
    atmosphere: [140, 196, 230],
    shadow: [4, 12, 24]
  });

  const FALLBACK_MASSES = Object.freeze([
    { key: "western-shield", lat: 20 * DEG, lon: -118 * DEG, rx: 48 * DEG, ry: 23 * DEG, angle: 18 * DEG, seed: 11 },
    { key: "eastern-basin", lat: 4 * DEG, lon: 28 * DEG, rx: 45 * DEG, ry: 24 * DEG, angle: -10 * DEG, seed: 22 },
    { key: "northern-cold", lat: 60 * DEG, lon: -38 * DEG, rx: 38 * DEG, ry: 16 * DEG, angle: 8 * DEG, seed: 33 },
    { key: "southern-harsh", lat: -44 * DEG, lon: 84 * DEG, rx: 42 * DEG, ry: 20 * DEG, angle: -18 * DEG, seed: 44 },
    { key: "equatorial-wet", lat: -10 * DEG, lon: -34 * DEG, rx: 40 * DEG, ry: 20 * DEG, angle: 24 * DEG, seed: 55 },
    { key: "mountain-arc", lat: 22 * DEG, lon: 138 * DEG, rx: 39 * DEG, ry: 17 * DEG, angle: -28 * DEG, seed: 66 },
    { key: "broken-archipelago", lat: -31 * DEG, lon: -164 * DEG, rx: 35 * DEG, ry: 14 * DEG, angle: 12 * DEG, seed: 77 }
  ]);

  const FALLBACK_ISLANDS = Object.freeze([
    { lat: 69 * DEG, lon: -76 * DEG, rx: 6 * DEG, ry: 2.4 * DEG, angle: -20 * DEG, seed: 101 },
    { lat: 72 * DEG, lon: 44 * DEG, rx: 5 * DEG, ry: 2 * DEG, angle: 18 * DEG, seed: 102 },
    { lat: 21 * DEG, lon: 66 * DEG, rx: 5.5 * DEG, ry: 2.3 * DEG, angle: -26 * DEG, seed: 103 },
    { lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, seed: 104 },
    { lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, seed: 105 },
    { lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, seed: 106 },
    { lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, seed: 107 },
    { lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2 * DEG, angle: 11 * DEG, seed: 108 },
    { lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, seed: 109 }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    mounted: false,
    running: false,
    disposed: false,
    canvasReady: false,
    controlsBound: false,
    imageRendered: false,

    mount: null,
    canvas: null,
    ctx: null,
    statusNode: null,

    width: 0,
    height: 0,
    cssSize: 0,

    yaw: -0.34,
    tilt: -0.18,
    yawVelocity: 0.0018,
    tiltVelocity: 0,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    lastRenderAt: 0,
    frameCount: 0,

    routePayload: null,
    runtimeTablePlan: null,
    runtimeTablePlanConsumed: false,
    runtimeTablePlanStatus: "UNSET",
    runtimeTableAvailable: false,
    constructionReady: false,
    coherentExpressionPass: false,

    atlas: null,
    atlasBuildStarted: false,
    atlasReady: false,
    atlasProgress: 0,
    atlasRowsCompleted: 0,
    atlasSource: "fallback",
    atlasStartAuthorized: true,
    atlasStartAttempted: false,
    atlasBuilderEntered: false,
    atlasProgressObserved: false,
    atlasProjectedToSphere: false,

    materialsAuthorityPresent: false,
    materialsContractOk: false,
    hexSurfacePresent: false,
    hexSurfaceContractOk: false,
    landChannelPresent: false,
    waterChannelPresent: false,
    airChannelPresent: false,

    wideProbeScheduled: false,
    wideProbeComplete: false,
    wideProbeSampleCount: 0,
    wideProbeReport: null,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    lastFrameReceipt: null,
    lastStatus: "INITIAL",
    lastError: "",
    ledger: []
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      clamp(Math.round(lerp(a[0], b[0], k)), 0, 255),
      clamp(Math.round(lerp(a[1], b[1], k)), 0, 255),
      clamp(Math.round(lerp(a[2], b[2], k)), 0, 255)
    ];
  }

  function scaleColor(c, s) {
    return [
      clamp(Math.round(c[0] * s), 0, 255),
      clamp(Math.round(c[1] * s), 0, 255),
      clamp(Math.round(c[2] * s), 0, 255)
    ];
  }

  function liftColor(c, amount) {
    return [
      clamp(Math.round(c[0] + amount), 0, 255),
      clamp(Math.round(c[1] + amount), 0, 255),
      clamp(Math.round(c[2] + amount), 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
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

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function log(event, detail = {}) {
    const entry = Object.freeze({
      event,
      detail: clone(detail),
      at: nowIso()
    });

    state.ledger.push(entry);
    state.lastStatus = event;
    publishDataset(event);

    return entry;
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";

    return String(
      value.contract ||
      value.CONTRACT ||
      value.canvasContract ||
      value.runtimeTableContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return null;

    if (isFunction(value.getReceipt)) {
      try {
        const receipt = value.getReceipt();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    if (value.receiptPacket && typeof value.receiptPacket === "object") return value.receiptPacket;
    if (value.receipt && typeof value.receipt === "object") return value.receipt;

    return null;
  }

  function resolveMaterials() {
    return (
      root.HEARTH_MATERIALS ||
      root.HearthMaterials ||
      (root.HEARTH && root.HEARTH.materials) ||
      null
    );
  }

  function resolveHexSurface() {
    return (
      root.HEARTH_HEX_SURFACE ||
      (root.HEARTH && root.HEARTH.hexSurface) ||
      (root.HEARTH && root.HEARTH.hexSurfaceConsumer) ||
      null
    );
  }

  function resolveLandChannel() {
    return (
      root.HEARTH_LAND_CHANNEL ||
      (root.HEARTH && root.HEARTH.landChannel) ||
      null
    );
  }

  function resolveWaterChannel() {
    return (
      root.HEARTH_WATER_CHANNEL ||
      (root.HEARTH && root.HEARTH.waterChannel) ||
      null
    );
  }

  function resolveAirChannel() {
    return (
      root.HEARTH_AIR_CHANNEL ||
      (root.HEARTH && root.HEARTH.airChannel) ||
      null
    );
  }

  function resolveRuntimeTable() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function vectorFromUV(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = Math.PI / 2 - clamp(Number(v), 0, 1) * Math.PI;
    const cosLat = Math.cos(lat);

    return {
      x: Math.sin(lon) * cosLat,
      y: Math.sin(lat),
      z: Math.cos(lon) * cosLat,
      lon: lon / DEG,
      lat: lat / DEG,
      u: wrap01(u),
      v: clamp(Number(v), 0, 1)
    };
  }

  function normalizeVector(p) {
    const x = Number(p && p.x) || 0;
    const y = Number(p && p.y) || 0;
    const z = Number(p && p.z) || 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function vectorToUV(p) {
    const n = normalizeVector(p);
    const lon = Math.atan2(n.x, n.z) / DEG;
    const lat = Math.asin(clamp(n.y, -1, 1)) / DEG;

    return {
      x: n.x,
      y: n.y,
      z: n.z,
      lon,
      lat,
      u: wrap01((lon + 180) / 360),
      v: clamp((90 - lat) / 180, 0, 1)
    };
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x,
      y: v.y * c - v.z * s,
      z: v.y * s + v.z * c
    };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x * c + v.z * s,
      y: v.y,
      z: -v.x * s + v.z * c
    };
  }

  function hash(x, y, seed) {
    let h = Math.imul((x | 0) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul((y | 0) ^ (seed | 0) ^ 0xc2b2ae35, 0x27d4eb2f);
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

    return lerp(
      lerp(hash(ax0, y0, seed), hash(ax1, y0, seed), sx),
      lerp(hash(ax0, y1, seed), hash(ax1, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let normalizer = 0;
    let amp = 0.58;
    let scale = 8;

    for (let i = 0; i < 5; i += 1) {
      const n = noise(u, v, scale, seed + i * 113);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      normalizer += amp;
      amp *= 0.53;
      scale *= 2;
    }

    return total / Math.max(0.000001, normalizer);
  }

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
    const lon = (wrap01(u) - 0.5) * TAU;
    const lat = (0.5 - clamp(v, 0, 1)) * Math.PI;

    let best = {
      field: -10,
      mass: FALLBACK_MASSES[0],
      theta: 0,
      island: false
    };

    for (const mass of FALLBACK_MASSES) {
      const e = ellipseField(lon, lat, mass);
      const chip =
        Math.sign(Math.sin(e.theta * (7 + mass.seed % 5) + e.nx * 4.7 - e.ny * 3.8)) * 0.055 +
        Math.sin(e.theta * (11 + mass.seed % 3) - mass.seed * 0.11) * 0.04;
      const fracture = (ridged(u + mass.seed * 0.011, v - mass.seed * 0.009, 19000 + mass.seed) - 0.5) * 0.16;
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
    }

    for (const island of FALLBACK_ISLANDS) {
      const e = ellipseField(lon, lat, island);
      const chip = Math.sin(e.theta * 6 + island.seed * 0.13) * 0.13 + Math.sin(e.theta * 10) * 0.06;
      const field = 0.34 + chip - e.dist;

      if (field > best.field) {
        best = {
          field,
          mass: FALLBACK_MASSES[0],
          theta: e.theta,
          island: true
        };
      }
    }

    const coast = 1 - smoothstep(0.012, 0.15, Math.abs(best.field));
    const shelf = smoothstep(-0.30, 0.035, best.field) * (best.field <= 0 ? 1 : 0);

    return {
      field: best.field,
      isLand: best.field > 0,
      coast: clamp01(coast),
      shelf: clamp01(shelf),
      mass: best.mass,
      island: best.island,
      lon,
      lat
    };
  }

  function fallbackTextureColor(u, v) {
    const land = fallbackLandField(u, v);

    if (!land.isLand) {
      let c = mixColor(PALETTE.abyss, PALETTE.deep, noise(u, v, 12, 31000));
      c = mixColor(c, PALETTE.ocean, smoothstep(0.2, 0.9, land.shelf) * 0.48);
      c = mixColor(c, PALETTE.shelf, land.shelf * 0.54);
      c = mixColor(c, PALETTE.foam, land.coast * land.shelf * 0.14);
      return c;
    }

    const latCold = Math.abs(land.lat) / (Math.PI / 2);
    const heat = clamp01(1 - latCold + (noise(u, v, 8, 33000) - 0.5) * 0.24);
    const moisture = clamp01(noise(u + 0.17, v - 0.11, 10, 34000) * 0.72 + land.coast * 0.22 + (land.island ? 0.08 : 0));
    const ridge = ridged(u + land.mass.seed * 0.021, v - land.mass.seed * 0.017, 35000);
    const mountain = smoothstep(0.58, 0.92, ridge);
    const highland = smoothstep(0.46, 0.82, ridge);
    const ice = smoothstep(0.68, 0.95, latCold + mountain * 0.16 - heat * 0.12);

    let c;

    if (ice > 0.58) {
      c = mixColor(PALETTE.tundra, PALETTE.ice, ice);
    } else if (mountain > 0.68) {
      c = mixColor(PALETTE.highland, PALETTE.mountain, mountain);
    } else if (heat > 0.66 && moisture < 0.32) {
      c = PALETTE.desert;
    } else if (heat > 0.58 && moisture < 0.48) {
      c = mixColor(PALETTE.desert, PALETTE.plains, 0.38);
    } else if (moisture > 0.72 && heat > 0.46) {
      c = PALETTE.wetForest;
    } else if (moisture > 0.56) {
      c = PALETTE.forest;
    } else if (latCold > 0.52) {
      c = PALETTE.tundra;
    } else if (moisture < 0.35) {
      c = mixColor(PALETTE.land, PALETTE.desert, 0.32);
    } else {
      c = PALETTE.plains;
    }

    c = mixColor(c, PALETTE.sand, land.coast * 0.22);
    c = mixColor(c, PALETTE.cliff, land.coast * mountain * 0.3);
    c = mixColor(c, PALETTE.snow, ice * mountain * 0.34);

    const fine = noise(u + 0.41, v - 0.33, 128, 36000);
    const relief = mountain * 18 + highland * 8 + fine * 8 - land.coast * 4;

    return liftColor(c, relief - 6);
  }

  function extractRgb(packet, fallback) {
    const keys = [
      "rgb",
      "color",
      "baseColor",
      "finalColorHint",
      "landRgb",
      "waterRgb",
      "oceanRgb",
      "surfaceRgb"
    ];

    for (const key of keys) {
      const value = packet && packet[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        Number.isFinite(Number(value[0])) &&
        Number.isFinite(Number(value[1])) &&
        Number.isFinite(Number(value[2]))
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

  function callSample(authority, coord) {
    if (!authority || typeof authority !== "object") return null;

    const methods = [
      "sample",
      "read",
      "getMaterial",
      "materialAt",
      "getMaterialAt",
      "getSurfaceMaterial",
      "resolve",
      "resolveMaterial"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](coord);

        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return null;
  }

  function sampleSourceMaterial(u, v) {
    const materials = resolveMaterials();

    state.materialsAuthorityPresent = Boolean(materials);
    state.materialsContractOk = contractOf(materials) === EXPECTED.materials;

    if (!materials) return null;

    const coord = vectorFromUV(u, v);
    const packet = callSample(materials, coord);

    if (!packet || typeof packet !== "object") return null;

    const fallback = fallbackTextureColor(u, v);
    let rgb = extractRgb(packet, fallback);

    const waterDepth = clamp01(Number(packet.waterDepth ?? packet.waterDepthShade ?? 0));
    const wetStone = clamp01(Number(packet.wetStoneMaterialFeed ?? packet.wetStoneStrength ?? 0));
    const beach = clamp01(Number(packet.beachMaterialFeed ?? packet.beachStrength ?? 0));
    const scar = clamp01(Number(packet.submergedScarMaterialFeed ?? packet.submergedScarStrength ?? 0));
    const block = clamp01(Number(packet.submergedBlockMaterialFeed ?? packet.submergedBlockStrength ?? 0));
    const port = clamp01(Number(packet.submergedPortBasinMaterialFeed ?? 0));

    if (packet.isWater || packet.isWaterOccupied) {
      rgb = mixColor(rgb, PALETTE.deep, waterDepth * 0.18);
      rgb = mixColor(rgb, PALETTE.wetStone, wetStone * 0.10);
      rgb = mixColor(rgb, PALETTE.shadow, Math.max(scar, block, port) * 0.11);
    } else {
      rgb = mixColor(rgb, PALETTE.sand, beach * 0.12);
      rgb = mixColor(rgb, PALETTE.wetStone, wetStone * 0.10);
    }

    return {
      rgb,
      packet
    };
  }

  function createAtlas(width = DEFAULT_ATLAS_WIDTH, height = DEFAULT_ATLAS_HEIGHT) {
    const w = Math.max(64, Math.round(width));
    const h = Math.max(32, Math.round(height));
    const data = new Uint8ClampedArray(w * h * 4);

    for (let y = 0; y < h; y += 1) {
      const v = y / Math.max(1, h - 1);

      for (let x = 0; x < w; x += 1) {
        const u = x / w;
        const c = fallbackTextureColor(u, v);
        const index = (y * w + x) * 4;

        data[index] = c[0];
        data[index + 1] = c[1];
        data[index + 2] = c[2];
        data[index + 3] = 255;
      }
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      width: w,
      height: h,
      data,
      source: "fallback-immediate",
      fallbackReady: true,
      sourceRowsCompleted: 0,
      sourceReady: false,
      progress: 0,
      atlasReady: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function buildAtlasChunk() {
    if (!state.atlas || state.disposed) return;

    const materials = resolveMaterials();

    if (!materials) {
      state.atlasReady = true;
      state.atlas.atlasReady = true;
      state.atlas.sourceReady = false;
      state.atlas.source = "fallback-source-materials-missing";
      state.atlasProgress = 1;
      state.atlas.progress = 1;
      publishDataset("atlas-fallback-ready");
      return;
    }

    state.materialsAuthorityPresent = true;
    state.materialsContractOk = contractOf(materials) === EXPECTED.materials;
    state.atlasBuilderEntered = true;
    state.atlasStartAttempted = true;

    const width = state.atlas.width;
    const height = state.atlas.height;
    const start = state.atlasRowsCompleted;
    const end = Math.min(height, start + DEFAULT_ROWS_PER_CHUNK);

    for (let y = start; y < end; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const source = sampleSourceMaterial(u, v);
        const c = source ? source.rgb : fallbackTextureColor(u, v);
        const index = (y * width + x) * 4;

        state.atlas.data[index] = c[0];
        state.atlas.data[index + 1] = c[1];
        state.atlas.data[index + 2] = c[2];
        state.atlas.data[index + 3] = 255;
      }
    }

    state.atlasRowsCompleted = end;
    state.atlas.sourceRowsCompleted = end;
    state.atlasProgress = clamp01(end / height);
    state.atlas.progress = state.atlasProgress;
    state.atlasProgressObserved = true;
    state.atlas.source = state.materialsContractOk ? "materials-authority" : "materials-authority-contract-degraded";

    if (end >= height) {
      state.atlasReady = true;
      state.atlas.atlasReady = true;
      state.atlas.sourceReady = true;
      state.atlas.progress = 1;
      state.atlasProgress = 1;
      state.atlasProjectedToSphere = true;

      log("ATLAS_SOURCE_BUILD_COMPLETE", {
        source: state.atlas.source,
        materialsContractOk: state.materialsContractOk,
        width,
        height
      });

      scheduleWideProbe();
      return;
    }

    if (state.frameCount < 2 || end % 32 === 0) {
      publishDataset("atlas-source-building");
    }

    root.setTimeout(buildAtlasChunk, 0);
  }

  function startAtlasBuild() {
    if (state.atlasBuildStarted) return;

    state.atlasBuildStarted = true;
    state.atlasStartAuthorized = true;
    state.atlasStartAttempted = true;
    state.atlas = createAtlas(DEFAULT_ATLAS_WIDTH, DEFAULT_ATLAS_HEIGHT);
    state.atlasSource = state.atlas.source;
    state.atlasReady = false;
    state.atlasProgress = 0;
    state.atlasRowsCompleted = 0;

    log("ATLAS_FALLBACK_READY_SOURCE_BUILD_START", {
      width: state.atlas.width,
      height: state.atlas.height,
      visibleCarrierFirst: true,
      wideProbeDeferred: true
    });

    root.setTimeout(buildAtlasChunk, 0);
  }

  function sampleAtlas(u, v) {
    if (!state.atlas) {
      return fallbackTextureColor(u, v);
    }

    const width = state.atlas.width;
    const height = state.atlas.height;
    const x = Math.floor(wrap01(u) * width) % width;
    const y = clamp(Math.floor(clamp(v, 0, 0.999999) * height), 0, height - 1);
    const index = (y * width + x) * 4;

    return [
      state.atlas.data[index],
      state.atlas.data[index + 1],
      state.atlas.data[index + 2]
    ];
  }

  function resolveMount(input) {
    if (!doc) return null;

    if (input && input.mount && input.mount.nodeType === 1) return input.mount;
    if (input && input.mountNode && input.mountNode.nodeType === 1) return input.mountNode;

    const id = input && input.mountId ? input.mountId : "hearthCanvasMount";

    return (
      doc.getElementById(id) ||
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-carrier-mount]")
    );
  }

  function ensureMount(input = {}) {
    if (!doc) return null;

    let mount = resolveMount(input);

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = input.mountId || "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";

      const parent =
        doc.getElementById("hearth-main") ||
        doc.querySelector("main") ||
        doc.body ||
        doc.documentElement;

      parent.appendChild(mount);
    }

    mount.id = "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCanvasCarrier = "true";
    mount.dataset.hearthCanvasContract = CONTRACT;
    mount.dataset.hearthCanvasReceipt = RECEIPT;
    mount.dataset.hearthCanvasVisibleCarrierFirst = "true";
    mount.dataset.hearthCanvasRuntimeTableDirected = "true";
    mount.dataset.hearthCanvasRuntimeTableCannotBlankCarrier = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    if (!mount.style.position) mount.style.position = "relative";
    if (!mount.style.minHeight) mount.style.minHeight = "360px";

    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.overflow = "hidden";

    return mount;
  }

  function disposePreviousVisibleRecovery() {
    if (isFunction(root.__HEARTH_VISIBLE_RECOVERY_DISPOSE__)) {
      try {
        root.__HEARTH_VISIBLE_RECOVERY_DISPOSE__();
      } catch (_error) {}
    }
  }

  function removePriorCanvas(mount) {
    if (!mount) return;

    mount.querySelectorAll("[data-hearth-canvas-runtime-table-carrier]").forEach((node) => {
      if (node !== state.canvas) node.remove();
    });

    mount.querySelectorAll("[data-hearth-recovery-canvas]").forEach((node) => {
      if (node !== state.canvas) node.remove();
    });
  }

  function hideRouteFallback(mount) {
    if (!mount) return;

    mount.querySelectorAll("[data-hearth-route-fallback-shell], [data-hearth-mount-fallback]").forEach((node) => {
      node.hidden = true;
      node.style.display = "none";
      node.dataset.hearthCanvasCarrierTookOver = "true";
    });
  }

  function ensureCanvas(mount) {
    if (!doc || !mount) return null;

    let canvas = mount.querySelector("[data-hearth-canvas-runtime-table-carrier]");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.dataset.hearthCanvasRuntimeTableCarrier = "true";
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasRouteConductorContract = ROUTE_CONDUCTOR_CONTRACT;
    canvas.dataset.hearthCanvasRuntimeTableContract = RUNTIME_TABLE_CONTRACT;
    canvas.dataset.hearthCanvasVisibleCarrierFirst = "true";
    canvas.dataset.hearthCanvasAtlasStartAuthorized = "true";
    canvas.dataset.hearthCanvasWideProbeDeferred = "true";
    canvas.dataset.hearthCanvasImageRenderedIsNotCoherencePass = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    state.canvasReady = Boolean(state.ctx);

    return canvas;
  }

  function resizeCanvas() {
    if (!state.canvas || !state.mount) return false;

    const box = state.mount.getBoundingClientRect();
    const cssSize = Math.max(280, Math.floor(Math.min(box.width || 420, box.height || box.width || 420)));
    const dpr = Math.min(1.65, root.devicePixelRatio || 1);
    const size = Math.min(620, Math.max(340, Math.floor(cssSize * dpr)));

    state.cssSize = cssSize;

    if (state.canvas.width !== size || state.canvas.height !== size) {
      state.canvas.width = size;
      state.canvas.height = size;
      state.width = size;
      state.height = size;
      return true;
    }

    state.width = state.canvas.width;
    state.height = state.canvas.height;

    return false;
  }

  function readRuntimePlan(payload = {}) {
    const supplied = payload.runtimeTablePlan || payload.visualCarrierPlan || null;

    if (supplied && typeof supplied === "object") {
      state.runtimeTablePlan = supplied;
      state.runtimeTablePlanConsumed = true;
      state.runtimeTablePlanStatus = supplied.coherenceStatus || supplied.visualDiagnosticStatus || "SUPPLIED";
      state.runtimeTableAvailable = true;
      state.constructionReady = supplied.constructionReady !== false && supplied.visualCarrierAllowed !== false;
      state.coherentExpressionPass = supplied.coherentExpressionPass === true;

      return supplied;
    }

    const runtimeTable = resolveRuntimeTable();

    state.runtimeTableAvailable = Boolean(runtimeTable);

    if (!runtimeTable) {
      state.runtimeTablePlan = {
        contract: CONTRACT,
        receipt: RECEIPT,
        planContract: "HEARTH_CANVAS_LOCAL_VISIBLE_CARRIER_PLAN_RUNTIME_TABLE_MISSING_v1",
        planReceipt: "HEARTH_CANVAS_LOCAL_VISIBLE_CARRIER_PLAN_RUNTIME_TABLE_MISSING_RECEIPT_v1",
        runtimeTableAvailable: false,
        constructionReady: true,
        visualCarrierAllowed: true,
        atlasStartAuthorized: true,
        coherentExpressionPass: false,
        runtimeTableMissingDoesNotBlockCarrier: true,
        visualPassClaimed: false
      };
      state.runtimeTablePlanStatus = "RUNTIME_TABLE_MISSING_LOCAL_PLAN";
      state.constructionReady = true;
      return state.runtimeTablePlan;
    }

    try {
      let plan = null;

      if (isFunction(runtimeTable.createHearthVisualCarrierPlan)) {
        plan = runtimeTable.createHearthVisualCarrierPlan({
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: true,
            fallbackShellAvailable: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            imageRendered: state.imageRendered,
            atlasReady: state.atlasReady,
            projectionReady: state.atlasProjectedToSphere
          }
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(runtimeTable.createVisualCarrierPlan)) {
        plan = runtimeTable.createVisualCarrierPlan({
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      }

      if (plan && typeof plan === "object") {
        plan.runtimeTableMissingDoesNotBlockCarrier = true;
        plan.visualPassClaimed = false;
        state.runtimeTablePlan = plan;
        state.runtimeTablePlanConsumed = true;
        state.runtimeTablePlanStatus = plan.coherenceStatus || plan.visualDiagnosticStatus || "CREATED";
        state.constructionReady = plan.constructionReady !== false && plan.visualCarrierAllowed !== false;
        state.coherentExpressionPass = plan.coherentExpressionPass === true;
        return plan;
      }
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      log("RUNTIME_TABLE_PLAN_ERROR_NON_BLOCKING", {
        error: state.lastError
      });
    }

    state.runtimeTablePlan = {
      contract: CONTRACT,
      receipt: RECEIPT,
      planContract: "HEARTH_CANVAS_LOCAL_VISIBLE_CARRIER_PLAN_RUNTIME_TABLE_DEGRADED_v1",
      planReceipt: "HEARTH_CANVAS_LOCAL_VISIBLE_CARRIER_PLAN_RUNTIME_TABLE_DEGRADED_RECEIPT_v1",
      runtimeTableAvailable: true,
      constructionReady: true,
      visualCarrierAllowed: true,
      atlasStartAuthorized: true,
      coherentExpressionPass: false,
      runtimeTablePlanErrorDoesNotBlockCarrier: true,
      visualPassClaimed: false
    };

    state.runtimeTablePlanStatus = "RUNTIME_TABLE_DEGRADED_LOCAL_PLAN";
    state.constructionReady = true;

    return state.runtimeTablePlan;
  }

  function bindControls() {
    if (!state.canvas || state.controlsBound) return;

    const canvas = state.canvas;

    function pointerDown(event) {
      state.dragging = true;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.yawVelocity = 0;
      state.tiltVelocity = 0;

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
    }

    function pointerMove(event) {
      if (!state.dragging) return;

      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      state.yaw += dx * 0.0086;
      state.tilt += dy * 0.0072;
      state.tilt = clamp(state.tilt, -1.35, 1.35);

      state.yawVelocity = dx * 0.00078;
      state.tiltVelocity = dy * 0.00048;

      event.preventDefault();
    }

    function pointerUp(event) {
      state.dragging = false;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });
    canvas.addEventListener("lostpointercapture", pointerUp, { passive: false });

    state.controlsBound = true;

    state.removeControls = () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("lostpointercapture", pointerUp);
      state.controlsBound = false;
    };
  }

  function publishDataset(status = "ready") {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasAuthorityLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasVersion = VERSION;
    dataset.hearthCanvasFile = FILE;

    dataset.hearthCanvasRouteConductorContract = ROUTE_CONDUCTOR_CONTRACT;
    dataset.hearthCanvasRuntimeTableContract = RUNTIME_TABLE_CONTRACT;
    dataset.hearthCanvasRuntimeTableFile = RUNTIME_TABLE_FILE;

    dataset.hearthCanvasMounted = String(Boolean(state.mounted));
    dataset.hearthCanvasRunning = String(Boolean(state.running));
    dataset.hearthCanvasReady = String(Boolean(state.canvasReady));
    dataset.hearthCanvasControlsBound = String(Boolean(state.controlsBound));
    dataset.hearthCanvasImageRendered = String(Boolean(state.imageRendered));

    dataset.hearthCanvasRuntimeTablePlanConsumed = String(Boolean(state.runtimeTablePlanConsumed));
    dataset.hearthCanvasRuntimeTablePlanStatus = state.runtimeTablePlanStatus || "";
    dataset.hearthCanvasRuntimeTableAvailable = String(Boolean(state.runtimeTableAvailable));
    dataset.hearthCanvasRuntimeTableCannotBlankCarrier = "true";

    dataset.hearthCanvasConstructionReady = String(Boolean(state.constructionReady));
    dataset.hearthCanvasCoherentExpressionPass = String(Boolean(state.coherentExpressionPass));
    dataset.hearthCanvasCoherentExpressionPassIsNotVisualPassClaim = "true";
    dataset.hearthCanvasImageRenderedIsNotCoherencePass = "true";

    dataset.hearthCanvasAtlasStartAuthorized = String(Boolean(state.atlasStartAuthorized));
    dataset.hearthCanvasAtlasStartAttempted = String(Boolean(state.atlasStartAttempted));
    dataset.hearthCanvasAtlasBuilderEntered = String(Boolean(state.atlasBuilderEntered));
    dataset.hearthCanvasAtlasProgressObserved = String(Boolean(state.atlasProgressObserved));
    dataset.hearthCanvasAtlasProjectedToSphere = String(Boolean(state.atlasProjectedToSphere));
    dataset.hearthCanvasAtlasReady = String(Boolean(state.atlasReady));
    dataset.hearthCanvasAtlasProgress = String(state.atlasProgress || 0);
    dataset.hearthCanvasAtlasSource = state.atlas ? state.atlas.source : state.atlasSource;

    dataset.hearthCanvasMaterialsAuthorityPresent = String(Boolean(state.materialsAuthorityPresent));
    dataset.hearthCanvasMaterialsContractOk = String(Boolean(state.materialsContractOk));
    dataset.hearthCanvasHexSurfacePresent = String(Boolean(state.hexSurfacePresent));
    dataset.hearthCanvasHexSurfaceContractOk = String(Boolean(state.hexSurfaceContractOk));
    dataset.hearthCanvasLandChannelPresent = String(Boolean(state.landChannelPresent));
    dataset.hearthCanvasWaterChannelPresent = String(Boolean(state.waterChannelPresent));
    dataset.hearthCanvasAirChannelPresent = String(Boolean(state.airChannelPresent));

    dataset.hearthCanvasWideProbeScheduled = String(Boolean(state.wideProbeScheduled));
    dataset.hearthCanvasWideProbeComplete = String(Boolean(state.wideProbeComplete));
    dataset.hearthCanvasWideProbeSampleCount = String(state.wideProbeSampleCount || 0);
    dataset.hearthCanvasWideProbeDeferred = "true";
    dataset.hearthCanvasWideProbeNeverBlocksFirstVisibleRender = "true";
    dataset.hearthCanvasSingleAnchorIsLocalProofOnly = "true";

    dataset.hearthCanvasVisibleCarrierFirst = "true";
    dataset.hearthCanvasChildFailureDoesNotEraseVisualization = "true";
    dataset.hearthCanvasVisualizationBlocksOnlyWhenCarrierUnsafe = "true";
    dataset.hearthCanvasSphereContainment = "true";
    dataset.hearthCanvasOutsideSphereTransparent = "true";
    dataset.hearthCanvasNoRectangularTextureSpill = "true";
    dataset.hearthCanvasStatus = status;
    dataset.hearthCanvasLastError = state.lastError || "";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishStatusNode(status = "ready") {
    if (!doc) return;

    const node =
      state.statusNode ||
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]") ||
      doc.getElementById("hearth-status") ||
      doc.querySelector("[data-hearth-status]");

    if (!node) return;

    state.statusNode = node;

    node.textContent = [
      "Hearth canvas carrier active.",
      `Status ${status}`,
      `Canvas ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Route conductor ${ROUTE_CONDUCTOR_CONTRACT}`,
      `Runtime Table ${RUNTIME_TABLE_CONTRACT}`,
      `Mounted ${state.mounted}`,
      `Running ${state.running}`,
      `Frames ${state.frameCount}`,
      `Image rendered ${state.imageRendered}`,
      `Atlas ready ${state.atlasReady}`,
      `Atlas progress ${Math.round((state.atlasProgress || 0) * 100)}%`,
      `Atlas source ${state.atlas ? state.atlas.source : state.atlasSource}`,
      `Runtime Table plan consumed ${state.runtimeTablePlanConsumed}`,
      `Construction ready ${state.constructionReady}`,
      `Coherent expression pass ${state.coherentExpressionPass}`,
      "Visual pass claimed false",
      "Wide-probe deferred true",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      state.lastError ? `Error ${state.lastError}` : ""
    ].filter(Boolean).join("\n");
  }

  function refreshAuthorityStatus() {
    const materials = resolveMaterials();
    const hexSurface = resolveHexSurface();
    const land = resolveLandChannel();
    const water = resolveWaterChannel();
    const air = resolveAirChannel();

    state.materialsAuthorityPresent = Boolean(materials);
    state.materialsContractOk = contractOf(materials) === EXPECTED.materials;

    state.hexSurfacePresent = Boolean(hexSurface);
    state.hexSurfaceContractOk = contractOf(hexSurface) === EXPECTED.hexSurface;

    state.landChannelPresent = Boolean(land);
    state.waterChannelPresent = Boolean(water);
    state.airChannelPresent = Boolean(air);
  }

  function renderFrame() {
    if (state.disposed || !state.running || !state.canvas || !state.ctx) return;

    resizeCanvas();

    const width = state.canvas.width;
    const height = state.canvas.height;
    const ctx = state.ctx;
    const image = ctx.createImageData(width, height);
    const data = image.data;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.444;
    const inverseRadius = 1 / Math.max(1, radius);

    const cosTilt = Math.cos(state.tilt);
    const sinTilt = Math.sin(state.tilt);

    for (let y = 0; y < height; y += 1) {
      const sy = (y + 0.5 - cy) * inverseRadius;

      for (let x = 0; x < width; x += 1) {
        const sx = (x + 0.5 - cx) * inverseRadius;
        const rr = sx * sx + sy * sy;
        const index = (y * width + x) * 4;

        if (rr > 1) {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));

        const yTilted = sy * cosTilt + z * sinTilt;
        const zTilted = z * cosTilt - sy * sinTilt;

        const lon = Math.atan2(sx, zTilted) + state.yaw;
        const lat = Math.asin(clamp(yTilted, -1, 1));
        const u = lon / TAU + 0.5;
        const v = 0.5 - lat / Math.PI;

        let c = sampleAtlas(u, v);

        const light = clamp(0.42 + z * 0.60 + sx * -0.08 + sy * -0.08, 0.18, 1.10);
        const limb = clamp(0.34 + z * 0.80, 0.20, 1);
        const terminator = clamp(0.72 + (sx * -0.32 + sy * -0.18 + z * 0.88) * 0.28, 0.48, 1.12);

        c = scaleColor(c, light * limb * terminator);

        const rim = smoothstep(0.74, 1, rr);
        c = mixColor(c, PALETTE.shadow, rim * 0.48);

        const atmosphere = smoothstep(0.70, 1, rr);
        c = mixColor(c, PALETTE.atmosphere, atmosphere * 0.045);

        data[index] = c[0];
        data[index + 1] = c[1];
        data[index + 2] = c[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    drawAtmosphereRim(ctx, width, height, radius);

    state.imageRendered = true;
    state.frameCount += 1;
    state.lastRenderAt = Date.now();

    if (!state.dragging) {
      state.yaw += state.yawVelocity;
      state.tilt += state.tiltVelocity;
      state.yawVelocity *= 0.993;
      state.tiltVelocity *= 0.93;

      if (Math.abs(state.yawVelocity) < 0.00135) state.yawVelocity = 0.00135;

      if (state.tilt > 1.28) {
        state.tilt = 1.28;
        state.tiltVelocity *= -0.18;
      }

      if (state.tilt < -1.28) {
        state.tilt = -1.28;
        state.tiltVelocity *= -0.18;
      }
    }

    state.lastFrameReceipt = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-visible-carrier",
      frame: state.frameCount,
      width,
      height,
      imageRendered: true,
      constructionReady: state.constructionReady,
      coherentExpressionPass: state.coherentExpressionPass,
      atlasReady: state.atlasReady,
      atlasProgress: state.atlasProgress,
      atlasSource: state.atlas ? state.atlas.source : state.atlasSource,
      sphereContainment: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,
      runtimeTablePlanConsumed: state.runtimeTablePlanConsumed,
      runtimeTableCannotBlankCarrier: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      at: nowIso()
    };

    if (state.frameCount < 4 || state.frameCount % 120 === 0) {
      publishDataset("rendering");
      publishStatusNode("rendering");
    }

    root.requestAnimationFrame(renderFrame);
  }

  function drawAtmosphereRim(ctx, width, height, radius) {
    const cx = width / 2;
    const cy = height / 2;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, width * 0.003), 0, TAU);
    ctx.strokeStyle = "rgba(170,215,245,0.24)";
    ctx.lineWidth = Math.max(1, width * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, width * 0.010), 0, TAU);
    ctx.strokeStyle = "rgba(95,170,220,0.09)";
    ctx.lineWidth = Math.max(1, width * 0.006);
    ctx.stroke();

    ctx.restore();
  }

  function sampleChannel(channel, coord) {
    const packet = callSample(channel, coord);
    return packet && typeof packet === "object" ? packet : {};
  }

  function buildProbeSamples() {
    const points = [];
    const rows = 5;
    const columns = 5;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        points.push({
          u: (x + 0.5) / columns,
          v: (y + 0.5) / rows
        });
      }
    }

    const land = resolveLandChannel();
    const water = resolveWaterChannel();
    const air = resolveAirChannel();
    const materials = resolveMaterials();

    return points.map((point) => {
      const coord = vectorFromUV(point.u, point.v);
      const material = sampleSourceMaterial(point.u, point.v);
      const landSample = sampleChannel(land, coord);
      const waterSample = sampleChannel(water, coord);
      const airSample = sampleChannel(air, coord);
      const materialPacket = material && material.packet ? material.packet : callSample(materials, coord) || {};

      const landWeight = clamp01(Number(
        landSample.landAlpha ??
        landSample.landPresence ??
        (materialPacket.isLand ? 0.66 : 0)
      ));

      const waterWeight = clamp01(Number(
        waterSample.waterAlpha ??
        waterSample.waterPresence ??
        (materialPacket.isWater || materialPacket.isWaterOccupied ? 0.66 : 0)
      ));

      const airWeight = clamp01(Number(
        airSample.airAlpha ??
        airSample.airPresence ??
        0.16
      ));

      return {
        point,
        canvas: {
          contract: CONTRACT,
          receipt: RECEIPT,
          x: coord.x,
          y: coord.y,
          z: coord.z,
          lon: coord.lon,
          lat: coord.lat,
          u: coord.u,
          v: coord.v,
          landWeight,
          waterWeight,
          airWeight,
          rgb: material ? material.rgb : fallbackTextureColor(point.u, point.v),
          imageRendered: state.imageRendered,
          atlasReady: state.atlasReady,
          sphereContainment: true,
          outsideSphereTransparent: true,
          noRectangularTextureSpill: true,
          visualPassClaimed: false
        },
        land: landSample,
        water: waterSample,
        air: airSample,
        material: materialPacket
      };
    });
  }

  function scheduleWideProbe() {
    if (state.wideProbeScheduled) return;

    state.wideProbeScheduled = true;

    const runLater = root.requestIdleCallback
      ? (fn) => root.requestIdleCallback(fn, { timeout: 1800 })
      : (fn) => root.setTimeout(fn, 120);

    runLater(() => {
      if (state.disposed) return;

      try {
        const probeSamples = buildProbeSamples();

        state.wideProbeSampleCount = probeSamples.length;

        const runtimeTable = resolveRuntimeTable();

        if (runtimeTable && isFunction(runtimeTable.runPlanetWideProbe)) {
          state.wideProbeReport = runtimeTable.runPlanetWideProbe({
            planetId: "hearth",
            planetLabel: "Hearth",
            runtimeTableLedger: state.runtimeTablePlan && state.runtimeTablePlan.runtimeTableLedger ? state.runtimeTablePlan.runtimeTableLedger : null,
            canvasReceipt: getReceipt(),
            renderMetadata: {
              routeMounted: true,
              canvasMounted: true,
              fallbackShellAvailable: true,
              imageRendered: state.imageRendered,
              atlasReady: state.atlasReady,
              projectionReady: state.atlasProjectedToSphere,
              sphereContainment: true,
              outsideSphereTransparent: true,
              noRectangularTextureSpill: true
            },
            probeSamples,
            imageRendered: state.imageRendered
          }, {
            planetId: "hearth",
            planetLabel: "Hearth",
            minimumWideProbePoints: WIDE_PROBE_MINIMUM
          });
        } else if (runtimeTable && isFunction(runtimeTable.runCoherenceDiagnostic)) {
          state.wideProbeReport = runtimeTable.runCoherenceDiagnostic({
            planetId: "hearth",
            planetLabel: "Hearth",
            canvasReceipt: getReceipt(),
            renderMetadata: {
              imageRendered: state.imageRendered,
              atlasReady: state.atlasReady,
              projectionReady: state.atlasProjectedToSphere,
              sphereContainment: true,
              outsideSphereTransparent: true,
              noRectangularTextureSpill: true
            },
            probeSamples,
            imageRendered: state.imageRendered
          }, {
            profile: "hearth-channel-expression",
            planetId: "hearth",
            planetLabel: "Hearth"
          });
        } else {
          state.wideProbeReport = {
            contract: CONTRACT,
            receipt: RECEIPT,
            authority: "hearth-canvas-local-wide-probe-summary",
            sampleCount: probeSamples.length,
            minimumWideProbePoints: WIDE_PROBE_MINIMUM,
            wideProbeReady: probeSamples.length >= WIDE_PROBE_MINIMUM,
            runtimeTableDiagnosticAvailable: false,
            firstVisibleRenderWasNotBlocked: true,
            visualPassClaimed: false,
            generatedImage: false,
            graphicBox: false,
            webGL: false
          };
        }

        state.wideProbeComplete = true;

        if (
          state.wideProbeReport &&
          state.wideProbeReport.coherentExpressionPass === true
        ) {
          state.coherentExpressionPass = true;
        }

        log("WIDE_PROBE_COMPLETE_NON_BLOCKING", {
          sampleCount: state.wideProbeSampleCount,
          runtimeTableDiagnosticAvailable: Boolean(runtimeTable),
          coherenceStatus: state.wideProbeReport && state.wideProbeReport.coherenceStatus ? state.wideProbeReport.coherenceStatus : "",
          coherentExpressionPass: state.coherentExpressionPass
        });

        publishStatusNode("wide-probe-complete");
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        state.wideProbeComplete = false;

        log("WIDE_PROBE_ERROR_NON_BLOCKING", {
          error: state.lastError
        });
      }
    });
  }

  function mount(input = {}) {
    if (!doc) {
      state.lastError = "DOCUMENT_UNAVAILABLE";
      return getStatus();
    }

    if (state.running && state.mounted) {
      return getStatus();
    }

    state.routePayload = input || {};
    state.disposed = false;

    disposePreviousVisibleRecovery();

    const mountNode = ensureMount(input);

    state.mount = mountNode;
    state.mounted = Boolean(mountNode);

    removePriorCanvas(mountNode);
    hideRouteFallback(mountNode);

    const canvas = ensureCanvas(mountNode);

    if (!canvas || !state.ctx) {
      state.lastError = "CANVAS_CONTEXT_UNAVAILABLE";
      log("MOUNT_FAILED_CANVAS_CONTEXT_UNAVAILABLE", {
        mountPresent: Boolean(mountNode)
      });
      return getStatus();
    }

    readRuntimePlan(input);
    refreshAuthorityStatus();

    bindControls();
    resizeCanvas();
    startAtlasBuild();

    state.running = true;
    state.canvasReady = true;
    state.lastError = "";

    publishDataset("mounted");
    publishStatusNode("mounted");

    log("CANVAS_MOUNTED_VISIBLE_CARRIER_FIRST", {
      mountId: mountNode.id || "",
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      runtimeTablePlanConsumed: state.runtimeTablePlanConsumed,
      constructionReady: state.constructionReady,
      atlasStartAuthorized: state.atlasStartAuthorized
    });

    root.requestAnimationFrame(renderFrame);

    return getStatus();
  }

  function boot(input = {}) {
    return mount(input);
  }

  function start(input = {}) {
    return mount(input);
  }

  function attach(input = {}) {
    return mount(input);
  }

  function drawFrame(input = {}) {
    if (!state.running || !state.mounted) {
      mount(input);
    }

    return state.lastFrameReceipt || getStatus();
  }

  function drawHearthCanvasFrame(input = {}) {
    return drawFrame(input);
  }

  function draw(input = {}) {
    return drawFrame(input);
  }

  function render(input = {}) {
    return drawFrame(input);
  }

  function getStatus() {
    refreshAuthorityStatus();

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
      runtimeTableContract: RUNTIME_TABLE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",
      destinationFile: FILE,

      mounted: state.mounted,
      running: state.running,
      disposed: state.disposed,
      canvasReady: state.canvasReady,
      controlsBound: state.controlsBound,
      imageRendered: state.imageRendered,
      frameCount: state.frameCount,

      width: state.width,
      height: state.height,
      cssSize: state.cssSize,

      runtimeTablePlanConsumed: state.runtimeTablePlanConsumed,
      runtimeTablePlanStatus: state.runtimeTablePlanStatus,
      runtimeTableAvailable: state.runtimeTableAvailable,
      runtimeTableMissingDoesNotBlockCarrier: true,
      constructionReady: state.constructionReady,
      coherentExpressionPass: state.coherentExpressionPass,
      coherentExpressionPassIsNotVisualPassClaim: true,
      imageRenderedIsNotCoherencePass: true,

      atlasStartAuthorized: state.atlasStartAuthorized,
      atlasStartAttempted: state.atlasStartAttempted,
      atlasBuilderEntered: state.atlasBuilderEntered,
      atlasProgressObserved: state.atlasProgressObserved,
      atlasProjectedToSphere: state.atlasProjectedToSphere,
      atlasReady: state.atlasReady,
      atlasProgress: state.atlasProgress,
      atlasSource: state.atlas ? state.atlas.source : state.atlasSource,

      materialsAuthorityPresent: state.materialsAuthorityPresent,
      materialsContractOk: state.materialsContractOk,
      hexSurfacePresent: state.hexSurfacePresent,
      hexSurfaceContractOk: state.hexSurfaceContractOk,
      landChannelPresent: state.landChannelPresent,
      waterChannelPresent: state.waterChannelPresent,
      airChannelPresent: state.airChannelPresent,

      wideProbeScheduled: state.wideProbeScheduled,
      wideProbeComplete: state.wideProbeComplete,
      wideProbeSampleCount: state.wideProbeSampleCount,
      wideProbeDeferred: true,
      wideProbeNeverBlocksFirstVisibleRender: true,
      singleAnchorIsLocalProofOnly: true,

      visibleCarrierFirst: true,
      childFailureDoesNotEraseVisualization: true,
      visualizationBlocksOnlyWhenCarrierUnsafe: true,
      sphereContainment: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrologyClassification: false,
      ownsMaterialPalette: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsRouteOrchestration: false,
      ownsRuntimeMotion: false,
      ownsControlsAuthority: false,

      lastFrameReceipt: clone(state.lastFrameReceipt),
      lastRuntimeTablePlan: clone(state.runtimeTablePlan),
      wideProbeReport: clone(state.wideProbeReport),
      ledger: clone(state.ledger),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      lastStatus: state.lastStatus,
      lastError: state.lastError || ""
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
      runtimeTableContract: RUNTIME_TABLE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-runtime-table-directed-visible-carrier",
      status: "active",
      destinationFile: FILE,

      purpose: [
        "mount Hearth visible carrier immediately",
        "consume Runtime Table plan without allowing it to blank the carrier",
        "render fallback atlas first",
        "progressively upgrade atlas from source materials",
        "project atlas to a draggable spherical planet",
        "defer wide-probe diagnostics until after first visible render",
        "export diagnostic receipts without claiming final visual pass"
      ],

      expectedContracts: { ...EXPECTED },

      sequence: [
        "receive route conductor payload",
        "dispose old visible recovery if present",
        "mount or find Hearth canvas mount",
        "hide route fallback shell",
        "create canvas carrier",
        "consume Runtime Table plan or create local non-blocking fallback plan",
        "bind pointer controls",
        "build fallback atlas immediately",
        "render visible planet",
        "progressively rebuild atlas from materials authority",
        "project atlas to sphere",
        "run non-blocking wide-probe diagnostic later"
      ],

      coreLaw: [
        "visible carrier first",
        "Runtime Table is diagnostic/procedural-plan input only",
        "Runtime Table absence cannot blank carrier",
        "child channel absence degrades coherence but does not erase visualization",
        "imageRendered is not coherence pass",
        "coherentExpressionPass is not visualPassClaimed",
        "wide-probe never blocks first visible render",
        "single anchor is local proof only",
        "canvas displays but does not own upstream truth"
      ],

      owns: [
        "visible canvas carrier",
        "fallback atlas expression",
        "source atlas consumption",
        "sphere projection",
        "local pointer drag carrier",
        "frame receipts",
        "non-blocking wide-probe scheduling"
      ],

      doesNotOwn: [
        "tectonic cause",
        "elevation generation",
        "composition classification",
        "hydrology classification",
        "material palette",
        "land truth",
        "water truth",
        "air truth",
        "route orchestration",
        "runtime motion authority",
        "controls authority",
        "final visual pass claim"
      ],

      runtimeTablePlanConsumed: state.runtimeTablePlanConsumed,
      runtimeTableAvailable: state.runtimeTableAvailable,
      constructionReady: state.constructionReady,
      coherentExpressionPass: state.coherentExpressionPass,
      imageRendered: state.imageRendered,
      atlasReady: state.atlasReady,
      atlasProgress: state.atlasProgress,
      wideProbeComplete: state.wideProbeComplete,
      sphereContainment: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function dispose() {
    state.disposed = true;
    state.running = false;

    if (isFunction(state.removeControls)) {
      try {
        state.removeControls();
      } catch (_error) {}
    }

    if (state.canvas && state.canvas.parentNode) {
      try {
        state.canvas.remove();
      } catch (_error) {}
    }

    state.canvas = null;
    state.ctx = null;
    state.canvasReady = false;
    state.mounted = false;

    publishDataset("disposed");

    if (root.HEARTH_CANVAS === api) {
      try {
        delete root.HEARTH_CANVAS;
      } catch (_error) {
        root.HEARTH_CANVAS = null;
      }
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
    runtimeTableContract: RUNTIME_TABLE_CONTRACT,
    version: VERSION,

    mount,
    boot,
    start,
    attach,
    render,
    draw,
    drawFrame,
    drawHearthCanvasFrame,

    getStatus,
    getReceipt,
    dispose,

    createAtlas,
    sampleAtlas,
    sampleSourceMaterial,

    visibleCarrierFirst: true,
    runtimeTableDirected: true,
    runtimeTableDiagnosticOnly: true,
    runtimeTableCannotBlankCarrier: true,
    childFailureDoesNotEraseVisualization: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,
    imageRenderedIsNotCoherencePass: true,
    constructionReadyIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,
    singleAnchorIsLocalProofOnly: true,
    wideProbeDeferred: true,
    wideProbeNeverBlocksFirstVisibleRender: true,

    sphereContainment: true,
    outsideSphereTransparent: true,
    noRectangularTextureSpill: true,

    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyClassification: false,
    ownsMaterialPalette: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsRouteOrchestration: false,
    ownsRuntimeMotion: false,
    ownsControlsAuthority: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH.canvasCarrier = api;

  root.HEARTH_CANVAS = api;
  root.HearthCanvas = api;
  root.HEARTH_CANVAS_CONTRACT = CONTRACT;
  root.HEARTH_CANVAS_RECEIPT = RECEIPT;
  root.HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER = api;
  root.__HEARTH_CANVAS_DISPOSE__ = dispose;

  publishDataset("loaded");

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
