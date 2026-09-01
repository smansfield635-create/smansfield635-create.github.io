// /assets/hearth/hearth.canvas.finger.landform.js
// HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_AUTHORITY_TNT_v1
// Full-file replacement.
// Canvas Finger / Landform / Primary Land Definition Authority / 256 Global Economy.
// Purpose:
// - Establish Landform as the first expansion authority downstream from the Surface Pointer Finger.
// - Receive routed landform donor intelligence from Surface without becoming the external socket.
// - Build an organic 16 × 16 / 256-node landform economy for Hearth’s Planet Factory.
// - Use Audralia as story grammar: a clean-slate world-body forming before hydrology, elevation, material, atmosphere, lighting, and composite expression.
// - Define continents, islands, shelves, basins, land bridges, rifts, drainage-prep corridors, above-water eligibility, and below-water landform eligibility.
// - Publish downstream prep packets for elevation, hydrology, material, atmosphere, lighting, and composite.
// - Preserve Canvas Parent, Surface Pointer Finger, diagnostics, route conductor, and downstream file boundaries.
// - Do not claim final terrain truth, final elevation truth, final hydrology truth, final material truth, F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - external donor socket authority
// - Canvas parent mount authority
// - route conductor release authority
// - diagnostic rail case authority
// - final elevation truth
// - final hydrology truth
// - final material truth
// - final atmosphere truth
// - final lighting truth
// - final composite truth
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_AUTHORITY_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_PACKET_v1";
  const VERSION = "2026-06-03.hearth-canvas-finger-landform-256-global-economy-authority-v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.landform.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const ELEVATION_FILE = "/assets/hearth/hearth.canvas.finger.elevation.js";
  const HYDROLOGY_FILE = "/assets/hearth/hearth.canvas.finger.hydrology.js";
  const MATERIAL_FILE = "/assets/hearth/hearth.canvas.finger.material.js";
  const ATMOSPHERE_FILE = "/assets/hearth/hearth.canvas.finger.atmosphere.js";
  const LIGHTING_FILE = "/assets/hearth/hearth.canvas.finger.lighting.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const FINGER_NAME = "landform";
  const FINGER_ROLE = "primary-land-definition-authority";
  const GRID_SIZE = 16;
  const NODE_TOTAL = 256;
  const STORY_REFERENCE = "AUDRALIA_CLEAN_SLATE_WORLD_FORMATION_GRAMMAR";
  const WORLD_NAME = "Hearth";
  const WORLD_ALIAS = "Aelith";
  const PAGE_CONTEXT = "Planet Factory · Mirrorland Formation Site";

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    terrainTruthClaimed: false,
    landformTruthClaimed: false,
    elevationTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    atmosphereTruthClaimed: false,
    lightingTruthClaimed: false,
    compositeTruthClaimed: false,
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const DOWNSTREAM_FILES = Object.freeze({
    surface: SURFACE_FILE,
    boundary: BOUNDARY_FILE,
    mass: MASS_FILE,
    elevation: ELEVATION_FILE,
    hydrology: HYDROLOGY_FILE,
    material: MATERIAL_FILE,
    atmosphere: ATMOSPHERE_FILE,
    lighting: LIGHTING_FILE,
    composite: COMPOSITE_FILE,
    inspect: INSPECT_FILE
  });

  const LANDFORM_CLASSES = Object.freeze({
    CONTINENT_CORE: "CONTINENT_CORE",
    CONTINENT_BODY: "CONTINENT_BODY",
    UPLIFT_CORE: "UPLIFT_CORE",
    PLATEAU_BODY: "PLATEAU_BODY",
    ISLAND_ARC: "ISLAND_ARC",
    LAND_BRIDGE: "LAND_BRIDGE",
    CONTINENTAL_SHELF: "CONTINENTAL_SHELF",
    SUBMERGED_SHELF: "SUBMERGED_SHELF",
    BASIN_FLOOR: "BASIN_FLOOR",
    RIFT_SCAR: "RIFT_SCAR",
    DRAINAGE_PREP: "DRAINAGE_PREP",
    DEEP_BASIN_PREP: "DEEP_BASIN_PREP"
  });

  const ECONOMY_ROLES = Object.freeze({
    GENERATOR: "GENERATOR",
    RECEIVER: "RECEIVER",
    CONVERTER: "CONVERTER",
    GATEWAY: "GATEWAY",
    ARCHIVE: "ARCHIVE",
    THRESHOLD: "THRESHOLD",
    RESERVE: "RESERVE"
  });

  const STORY_DISTRICTS = Object.freeze([
    {
      key: "AUREN_SANCTUARY_SHELF",
      title: "Auren Sanctuary Shelf",
      phrase: "the first safe ledge where the clean-slate world can hold life before it explains itself",
      compass: "NW"
    },
    {
      key: "DEXTRION_FORGE_RIDGE",
      title: "Dextrion Forge Ridge",
      phrase: "the laboratory ridge where restoration pressure becomes usable structure",
      compass: "N"
    },
    {
      key: "ALARIC_LATTICE_STEPPE",
      title: "Alaric Lattice Steppe",
      phrase: "the orientation field where distant survival paths become mapped terrain",
      compass: "NE"
    },
    {
      key: "TARIAN_WATER_BASIN",
      title: "Tarian Water Basin",
      phrase: "the lowland promise that will later teach hydrology where to gather",
      compass: "W"
    },
    {
      key: "ELARA_SHIMMER_COAST",
      title: "Elara Shimmer Coast",
      phrase: "the future public edge where hidden landform becomes visible expression",
      compass: "E"
    },
    {
      key: "SOREN_SEAL_SCAR",
      title: "Soren Seal Scar",
      phrase: "the boundary wound that keeps the world honest about waste, consequence, and closure",
      compass: "SW"
    },
    {
      key: "JEEVES_WINDOW_STRAIT",
      title: "Jeeves Window Strait",
      phrase: "the safe passage where visitors can look in without taking control",
      compass: "SE"
    },
    {
      key: "AUDRALIA_CLEAN_SEED",
      title: "Audralia Clean Seed",
      phrase: "the central unfinished body: not yet water, not yet mountain, not yet civilization, but already coherent",
      compass: "CENTER"
    }
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    worldName: WORLD_NAME,
    worldAlias: WORLD_ALIAS,
    pageContext: PAGE_CONTEXT,
    storyReference: STORY_REFERENCE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerLoaded: true,
    fingerActive: true,
    primaryLandDefinitionAuthority: true,
    surfacePointerReceiver: true,
    externalSocketAuthority: false,
    canvasParentAuthority: false,

    gridSize: GRID_SIZE,
    diagnosticScope: NODE_TOTAL,
    diagnosticScopeLabel: "16 × 16 / 256 landform economy nodes",
    diagnostic256Active: true,

    donorPacketsReceived: 0,
    donorPacketsAccepted: 0,
    donorPacketsRejected: 0,
    donorInfluenceActive: false,
    donorCategoryMap: {},
    donorQueue: [],
    rejectedDonors: [],

    landformModelReady: false,
    landformEconomyReady: false,
    diagnostic256Ready: false,
    aboveWaterEligibilityMapReady: false,
    belowWaterEligibilityMapReady: false,
    basinStructureMapReady: false,
    shelfCandidateMapReady: false,
    coastlineCandidateMapReady: false,
    drainagePrepMapReady: false,
    elevationPrepPacketReady: false,
    hydrologyPrepPacketReady: false,
    materialPrepPacketReady: false,
    atmospherePrepPacketReady: false,
    lightingPrepPacketReady: false,
    compositePrepPacketReady: false,

    landformModel: null,
    landformPacket: null,
    elevationPrepPacket: null,
    hydrologyPrepPacket: null,
    materialPrepPacket: null,
    atmospherePrepPacket: null,
    lightingPrepPacket: null,
    compositePrepPacket: null,
    diagnostic256Packet: null,

    nodeCount: 0,
    classCounts: {},
    economyCounts: {},
    districtCounts: {},
    firstFailedCoordinate: "LANDFORM_NOT_BUILT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LANDFORM_WAITING_BUILD",

    localEvents: [],
    errors: [],

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places = 4) {
    const factor = Math.pow(10, places);
    return Math.round(safeNumber(value, 0) * factor) / factor;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LANDFORM_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "LANDFORM_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 80);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function hashString(input) {
    const text = safeString(input, "HEARTH_LANDFORM");
    let hash = 2166136261;

    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    const n = Math.sin((x * 127.1) + (y * 311.7) + (seed * 0.013)) * 43758.5453123;
    return fract(n);
  }

  function smooth(value) {
    const x = clamp(value, 0, 1);
    return x * x * (3 - (2 * x));
  }

  function lerp(a, b, t) {
    return safeNumber(a, 0) + ((safeNumber(b, 0) - safeNumber(a, 0)) * t);
  }

  function valueNoise(x, y, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const a = hash2(xi, yi, seed);
    const b = hash2(xi + 1, yi, seed);
    const c = hash2(xi, yi + 1, seed);
    const d = hash2(xi + 1, yi + 1, seed);

    const u = smooth(xf);
    const v = smooth(yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm(x, y, seed, octaves = 5) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    let total = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += valueNoise(x * freq, y * freq, seed + (i * 997)) * amp;
      total += amp;
      amp *= 0.52;
      freq *= 2.07;
    }

    return total ? value / total : 0;
  }

  function ellipseInfluence(x, y, cx, cy, rx, ry, rotation = 0, falloff = 1.9) {
    const dx = x - cx;
    const dy = y - cy;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const px = (dx * cos) + (dy * sin);
    const py = (-dx * sin) + (dy * cos);
    const nx = px / Math.max(0.0001, rx);
    const ny = py / Math.max(0.0001, ry);
    const d = Math.sqrt((nx * nx) + (ny * ny));
    return clamp(1 - Math.pow(d, falloff), 0, 1);
  }

  function ridgeInfluence(x, y, ax, ay, bx, by, width) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = x - ax;
    const wy = y - ay;
    const len2 = (vx * vx) + (vy * vy) || 1;
    const t = clamp(((wx * vx) + (wy * vy)) / len2, 0, 1);
    const px = ax + (vx * t);
    const py = ay + (vy * t);
    const dx = x - px;
    const dy = y - py;
    const d = Math.sqrt((dx * dx) + (dy * dy));
    return clamp(1 - (d / Math.max(0.0001, width)), 0, 1);
  }

  function compassFor(x, y) {
    const angle = Math.atan2(-y, x);
    const deg = ((angle * 180) / Math.PI + 360) % 360;

    if (deg >= 337.5 || deg < 22.5) return "E";
    if (deg < 67.5) return "NE";
    if (deg < 112.5) return "N";
    if (deg < 157.5) return "NW";
    if (deg < 202.5) return "W";
    if (deg < 247.5) return "SW";
    if (deg < 292.5) return "S";
    return "SE";
  }

  function storyDistrictFor(x, y, bodyScore, basinDepth, upliftPressure) {
    const compass = Math.abs(x) < 0.18 && Math.abs(y) < 0.18 ? "CENTER" : compassFor(x, y);
    let district = STORY_DISTRICTS.find((entry) => entry.compass === compass) || STORY_DISTRICTS[7];

    if (basinDepth > 0.72 && x < 0) {
      district = STORY_DISTRICTS.find((entry) => entry.key === "TARIAN_WATER_BASIN") || district;
    } else if (upliftPressure > 0.74 && y < -0.1) {
      district = STORY_DISTRICTS.find((entry) => entry.key === "DEXTRION_FORGE_RIDGE") || district;
    } else if (bodyScore > 0.72 && x < -0.15 && y < -0.1) {
      district = STORY_DISTRICTS.find((entry) => entry.key === "AUREN_SANCTUARY_SHELF") || district;
    }

    return district;
  }

  function classifyLandform(values) {
    const {
      bodyScore,
      upliftPressure,
      basinDepth,
      shelfScore,
      riftScore,
      islandScore,
      landBridgeScore,
      drainageDemand
    } = values;

    if (riftScore > 0.76 && bodyScore > 0.28) return LANDFORM_CLASSES.RIFT_SCAR;
    if (landBridgeScore > 0.72 && bodyScore > 0.38) return LANDFORM_CLASSES.LAND_BRIDGE;
    if (islandScore > 0.65 && bodyScore > 0.42) return LANDFORM_CLASSES.ISLAND_ARC;
    if (bodyScore > 0.74 && upliftPressure > 0.62) return LANDFORM_CLASSES.UPLIFT_CORE;
    if (bodyScore > 0.69) return LANDFORM_CLASSES.CONTINENT_CORE;
    if (bodyScore > 0.57 && upliftPressure > 0.47) return LANDFORM_CLASSES.PLATEAU_BODY;
    if (bodyScore > 0.51) return LANDFORM_CLASSES.CONTINENT_BODY;
    if (shelfScore > 0.66 && bodyScore > 0.36) return LANDFORM_CLASSES.CONTINENTAL_SHELF;
    if (shelfScore > 0.48 && bodyScore > 0.25) return LANDFORM_CLASSES.SUBMERGED_SHELF;
    if (basinDepth > 0.66) return LANDFORM_CLASSES.BASIN_FLOOR;
    if (drainageDemand > 0.67) return LANDFORM_CLASSES.DRAINAGE_PREP;
    return LANDFORM_CLASSES.DEEP_BASIN_PREP;
  }

  function economyRoleFor(values, landformClass) {
    const {
      bodyScore,
      upliftPressure,
      basinDepth,
      shelfScore,
      drainageDemand,
      landBridgeScore,
      materialPromise
    } = values;

    if (landformClass === LANDFORM_CLASSES.LAND_BRIDGE || landBridgeScore > 0.7) return ECONOMY_ROLES.GATEWAY;
    if (landformClass === LANDFORM_CLASSES.RIFT_SCAR) return ECONOMY_ROLES.THRESHOLD;
    if (upliftPressure > 0.68 && materialPromise > 0.54) return ECONOMY_ROLES.GENERATOR;
    if (basinDepth > 0.66 || drainageDemand > 0.72) return ECONOMY_ROLES.RECEIVER;
    if (shelfScore > 0.55 && bodyScore > 0.32) return ECONOMY_ROLES.CONVERTER;
    if (bodyScore < 0.28 && basinDepth > 0.5) return ECONOMY_ROLES.ARCHIVE;
    return ECONOMY_ROLES.RESERVE;
  }

  function nodeLabel(row, col, landformClass, district) {
    const id = String((row * GRID_SIZE) + col).padStart(3, "0");
    const shortClass = landformClass
      .replace("CONTINENT_", "CT_")
      .replace("CONTINENTAL_", "SHELF_")
      .replace("DEEP_BASIN_PREP", "DEEP_PREP")
      .replace("DRAINAGE_PREP", "DRAINAGE")
      .replace("SUBMERGED_SHELF", "SUB_SHELF");

    return `L${id} · ${district.title} · ${shortClass}`;
  }

  function buildNode(row, col, seed, donorBias) {
    const index = (row * GRID_SIZE) + col;
    const u = (col + 0.5) / GRID_SIZE;
    const v = (row + 0.5) / GRID_SIZE;
    const x = (u * 2) - 1;
    const y = (v * 2) - 1;

    const broad = fbm((u * 2.1) + 10.4, (v * 2.1) - 4.3, seed, 5);
    const fine = fbm((u * 8.0) + 1.9, (v * 8.0) + 7.2, seed + 41, 4);

    const sanctuaryMass = ellipseInfluence(x, y, -0.36, -0.24, 0.56, 0.42, -0.35, 1.65);
    const centralCleanSeed = ellipseInfluence(x, y, -0.02, 0.05, 0.42, 0.36, 0.18, 1.9);
    const easternShimmerMass = ellipseInfluence(x, y, 0.46, -0.04, 0.35, 0.58, 0.38, 1.75);
    const southernSealMass = ellipseInfluence(x, y, -0.12, 0.58, 0.52, 0.28, 0.06, 1.85);
    const islandArc = ridgeInfluence(x, y, 0.28, -0.72, 0.78, 0.68, 0.19);

    const tarianBasin = ellipseInfluence(x, y, -0.52, 0.12, 0.34, 0.42, -0.12, 1.7);
    const centralBasin = ellipseInfluence(x, y, 0.06, 0.26, 0.34, 0.22, 0.2, 1.75);
    const eastTrench = ridgeInfluence(x, y, 0.58, -0.72, 0.82, 0.62, 0.12);
    const sealScar = ridgeInfluence(x, y, -0.78, 0.62, 0.12, 0.24, 0.1);
    const forgeRidge = ridgeInfluence(x, y, -0.44, -0.68, 0.28, -0.12, 0.15);
    const latticeRidge = ridgeInfluence(x, y, 0.04, -0.78, 0.74, -0.34, 0.12);
    const windowStrait = ridgeInfluence(x, y, 0.18, 0.74, 0.72, 0.36, 0.11);
    const landBridge = ridgeInfluence(x, y, -0.48, -0.05, 0.34, 0.2, 0.12);

    const donorLandBoost = clamp(safeNumber(donorBias.landform, 0), 0, 0.22);
    const donorBasinBoost = clamp(safeNumber(donorBias.basin, 0), 0, 0.18);
    const donorShelfBoost = clamp(safeNumber(donorBias.shelf, 0), 0, 0.16);
    const donorRiftBoost = clamp(safeNumber(donorBias.rift, 0), 0, 0.18);

    const bodyScore = clamp(
      (sanctuaryMass * 0.30) +
      (centralCleanSeed * 0.20) +
      (easternShimmerMass * 0.19) +
      (southernSealMass * 0.14) +
      (islandArc * 0.10) +
      (landBridge * 0.08) +
      (broad * 0.18) +
      (fine * 0.08) -
      (tarianBasin * 0.12) -
      (centralBasin * 0.08) -
      (eastTrench * 0.07) +
      donorLandBoost,
      0,
      1
    );

    const basinDepth = clamp(
      (tarianBasin * 0.32) +
      (centralBasin * 0.26) +
      (eastTrench * 0.22) +
      ((1 - bodyScore) * 0.18) +
      ((1 - broad) * 0.08) +
      donorBasinBoost,
      0,
      1
    );

    const upliftPressure = clamp(
      (forgeRidge * 0.32) +
      (latticeRidge * 0.24) +
      (sealScar * 0.10) +
      (bodyScore * 0.28) +
      (fine * 0.16),
      0,
      1
    );

    const shelfScore = clamp(
      ((1 - Math.abs(bodyScore - 0.47)) * 0.48) +
      (tarianBasin * 0.12) +
      (centralBasin * 0.10) +
      (islandArc * 0.14) +
      donorShelfBoost,
      0,
      1
    );

    const riftScore = clamp(
      (sealScar * 0.36) +
      (eastTrench * 0.24) +
      (windowStrait * 0.14) +
      ((1 - bodyScore) * basinDepth * 0.18) +
      donorRiftBoost,
      0,
      1
    );

    const islandScore = clamp((islandArc * 0.58) + (easternShimmerMass * 0.14) + (fine * 0.18), 0, 1);
    const landBridgeScore = clamp((landBridge * 0.72) + (bodyScore * 0.10) + (shelfScore * 0.15), 0, 1);
    const drainageDemand = clamp((basinDepth * 0.45) + (upliftPressure * 0.22) + (shelfScore * 0.18) + ((1 - bodyScore) * 0.08), 0, 1);
    const materialPromise = clamp((bodyScore * 0.38) + (upliftPressure * 0.26) + (fine * 0.22) + (shelfScore * 0.10), 0, 1);

    const aboveWaterEligibility = clamp((bodyScore * 0.76) + (upliftPressure * 0.18) - (basinDepth * 0.22), 0, 1);
    const belowWaterLandformEligibility = clamp((shelfScore * 0.54) + (basinDepth * 0.22) + (bodyScore * 0.18) - (aboveWaterEligibility * 0.14), 0, 1);
    const seaLevelCandidate = clamp((shelfScore * 0.46) + (basinDepth * 0.22) + ((1 - Math.abs(bodyScore - 0.5)) * 0.24), 0, 1);
    const coastlineCandidate = clamp((shelfScore * 0.45) + (aboveWaterEligibility * 0.24) + (belowWaterLandformEligibility * 0.20), 0, 1);

    const values = {
      bodyScore,
      basinDepth,
      upliftPressure,
      shelfScore,
      riftScore,
      islandScore,
      landBridgeScore,
      drainageDemand,
      materialPromise,
      aboveWaterEligibility,
      belowWaterLandformEligibility,
      seaLevelCandidate,
      coastlineCandidate
    };

    const landformClass = classifyLandform(values);
    const economyRole = economyRoleFor(values, landformClass);
    const district = storyDistrictFor(x, y, bodyScore, basinDepth, upliftPressure);

    const landformCapital = clamp((bodyScore * 0.42) + (upliftPressure * 0.24) + (materialPromise * 0.20) + (landBridgeScore * 0.08), 0, 1);
    const basinDebt = clamp((basinDepth * 0.52) + (drainageDemand * 0.18) + ((1 - aboveWaterEligibility) * 0.12), 0, 1);
    const shelfCredit = clamp((shelfScore * 0.55) + (coastlineCandidate * 0.24) + (belowWaterLandformEligibility * 0.12), 0, 1);
    const formationLiquidity = clamp((landformCapital * 0.34) + (shelfCredit * 0.28) + (drainageDemand * 0.18) + (seaLevelCandidate * 0.12), 0, 1);
    const scarcityPressure = clamp((basinDebt * 0.32) + ((1 - materialPromise) * 0.20) + (riftScore * 0.16) + ((1 - bodyScore) * 0.12), 0, 1);

    return {
      id: `L${String(index).padStart(3, "0")}`,
      index,
      row,
      col,
      coordinate: { u: round(u), v: round(v), x: round(x), y: round(y) },
      compass: Math.abs(x) < 0.18 && Math.abs(y) < 0.18 ? "CENTER" : compassFor(x, y),
      districtKey: district.key,
      districtTitle: district.title,
      storyPhrase: district.phrase,
      label: nodeLabel(row, col, landformClass, district),

      landformClass,
      economyRole,

      bodyScore: round(bodyScore),
      basinDepth: round(basinDepth),
      upliftPressure: round(upliftPressure),
      shelfScore: round(shelfScore),
      riftScore: round(riftScore),
      islandScore: round(islandScore),
      landBridgeScore: round(landBridgeScore),
      drainageDemand: round(drainageDemand),
      materialPromise: round(materialPromise),

      aboveWaterEligibility: round(aboveWaterEligibility),
      belowWaterLandformEligibility: round(belowWaterLandformEligibility),
      seaLevelCandidate: round(seaLevelCandidate),
      coastlineCandidate: round(coastlineCandidate),

      landformCapital: round(landformCapital),
      basinDebt: round(basinDebt),
      shelfCredit: round(shelfCredit),
      formationLiquidity: round(formationLiquidity),
      scarcityPressure: round(scarcityPressure),

      elevationPrep: {
        upliftCandidate: round(upliftPressure),
        plateauCandidate: round(clamp((bodyScore * 0.38) + (upliftPressure * 0.42), 0, 1)),
        lowlandCandidate: round(clamp((basinDepth * 0.46) + (shelfScore * 0.22), 0, 1)),
        ridgeCandidate: round(clamp((upliftPressure * 0.50) + (riftScore * 0.18), 0, 1)),
        escarpmentCandidate: round(clamp((coastlineCandidate * 0.22) + (upliftPressure * 0.24) + (shelfScore * 0.18), 0, 1))
      },

      hydrologyPrep: {
        oceanBasinCandidate: round(clamp((basinDepth * 0.50) + (belowWaterLandformEligibility * 0.22), 0, 1)),
        inlandSeaCandidate: round(clamp((basinDepth * 0.34) + (seaLevelCandidate * 0.22) - (coastlineCandidate * 0.08), 0, 1)),
        riverCorridorCandidate: round(drainageDemand),
        wetlandCandidate: round(clamp((drainageDemand * 0.35) + (shelfScore * 0.22) + (basinDepth * 0.18), 0, 1)),
        deltaCandidate: round(clamp((drainageDemand * 0.25) + (coastlineCandidate * 0.35), 0, 1))
      },

      materialPrep: {
        exposedRockCandidate: round(clamp((upliftPressure * 0.36) + (riftScore * 0.22), 0, 1)),
        sedimentPlainCandidate: round(clamp((basinDepth * 0.25) + (shelfScore * 0.26) + (drainageDemand * 0.16), 0, 1)),
        shelfSedimentCandidate: round(shelfScore),
        weatheredLowlandCandidate: round(clamp((bodyScore * 0.20) + (basinDepth * 0.22) + (materialPromise * 0.18), 0, 1)),
        volcanicOrRiftCandidate: round(riftScore)
      },

      compositePrep: {
        priority: round(clamp((aboveWaterEligibility * 0.30) + (coastlineCandidate * 0.20) + (upliftPressure * 0.18) + (basinDepth * 0.12), 0, 1)),
        visibleSilhouetteWeight: round(clamp((aboveWaterEligibility * 0.62) + (coastlineCandidate * 0.18), 0, 1)),
        basinSilhouetteWeight: round(basinDepth),
        shelfLineWeight: round(shelfScore),
        storyWeight: round(clamp((formationLiquidity * 0.36) + (scarcityPressure * 0.18) + (landformCapital * 0.20), 0, 1))
      },

      finalTruthClaimed: false,
      finalVisualPassClaimed: false
    };
  }

  function normalizeDonorText(packet) {
    try {
      return JSON.stringify(packet || {}).toLowerCase();
    } catch (_error) {
      return safeString(packet, "").toLowerCase();
    }
  }

  function classifyDonor(packet) {
    const text = normalizeDonorText(packet);

    const categories = {
      landform: /\blandform\b|\bcontinent\b|\bisland\b|\bcoast\b|\bshelf\b|\bbasin\b|\brift\b|\bridge\b|\bplateau\b|\bland bridge\b|\bterrain body\b/.test(text),
      basin: /\bbasin\b|\bdepression\b|\binland sea\b|\bocean basin\b|\btrough\b|\bvalley\b/.test(text),
      shelf: /\bshelf\b|\bcoast\b|\bshore\b|\bcontinental edge\b|\bmargin\b/.test(text),
      rift: /\brift\b|\bscar\b|\bcrack\b|\bfault\b|\bseam\b|\bplate\b|\btectonic\b/.test(text),
      elevation: /\belevation\b|\bheight\b|\bmountain\b|\buplift\b|\brelief\b/.test(text),
      hydrology: /\bhydrology\b|\bwater\b|\bocean\b|\briver\b|\blake\b|\bwetland\b|\bdelta\b/.test(text),
      material: /\bmaterial\b|\brock\b|\bsoil\b|\bsediment\b|\bvegetation\b|\bmineral\b/.test(text),
      composite: /\bcomposite\b|\bcanvas-ready\b|\bvisible\b|\bsilhouette\b|\bmask\b/.test(text)
    };

    const accepted = categories.landform || categories.basin || categories.shelf || categories.rift || categories.elevation || categories.hydrology || categories.material || categories.composite;

    return { accepted, categories };
  }

  function hasForbiddenFinalClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13Claimed === true ||
      packet.f21Claimed === true ||
      packet.f21EligibleForNorth === true ||
      packet.finalVisualPassClaimed === true ||
      packet.visualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.readyTextClaimed === true ||
      packet.readyTextAllowed === true
    );
  }

  function donorBias() {
    const bias = {
      landform: 0,
      basin: 0,
      shelf: 0,
      rift: 0
    };

    for (const item of state.donorQueue) {
      const categories = item.categories || {};
      if (categories.landform) bias.landform += 0.035;
      if (categories.basin) bias.basin += 0.03;
      if (categories.shelf) bias.shelf += 0.028;
      if (categories.rift) bias.rift += 0.026;
    }

    return {
      landform: clamp(bias.landform, 0, 0.22),
      basin: clamp(bias.basin, 0, 0.18),
      shelf: clamp(bias.shelf, 0, 0.16),
      rift: clamp(bias.rift, 0, 0.18)
    };
  }

  function countBy(nodes, key) {
    const counts = {};
    for (const node of nodes) {
      const value = safeString(node[key], "UNKNOWN");
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }

  function mapGrid(nodes, key) {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row += 1) {
      const line = [];
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const node = nodes[(row * GRID_SIZE) + col];
        line.push(node ? node[key] : null);
      }
      grid.push(line);
    }
    return grid;
  }

  function valueGrid(nodes, key) {
    return mapGrid(nodes, key).map((row) => row.map((value) => round(value)));
  }

  function topNodes(nodes, key, count = 16) {
    return nodes
      .slice()
      .sort((a, b) => safeNumber(b[key], 0) - safeNumber(a[key], 0))
      .slice(0, count)
      .map((node) => ({
        id: node.id,
        label: node.label,
        district: node.districtTitle,
        landformClass: node.landformClass,
        economyRole: node.economyRole,
        value: node[key]
      }));
  }

  function buildExchangeRoutes(nodes) {
    const routes = [];

    function nodeAt(row, col) {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return null;
      return nodes[(row * GRID_SIZE) + col] || null;
    }

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const a = nodeAt(row, col);
        if (!a) continue;

        const neighbors = [
          nodeAt(row, col + 1),
          nodeAt(row + 1, col),
          nodeAt(row + 1, col + 1),
          nodeAt(row + 1, col - 1)
        ].filter(Boolean);

        for (const b of neighbors) {
          const gradient = Math.abs(safeNumber(a.landformCapital, 0) - safeNumber(b.basinDebt, 0));
          const shelfTrade = (safeNumber(a.shelfCredit, 0) + safeNumber(b.shelfCredit, 0)) / 2;
          const drainageTrade = (safeNumber(a.drainageDemand, 0) + safeNumber(b.drainageDemand, 0)) / 2;
          const routeStrength = clamp((gradient * 0.32) + (shelfTrade * 0.28) + (drainageTrade * 0.22), 0, 1);

          if (routeStrength >= 0.42) {
            routes.push({
              from: a.id,
              to: b.id,
              routeType: routeStrength > 0.68 ? "PRIMARY_FORMATION_EXCHANGE" : "SECONDARY_FORMATION_EXCHANGE",
              routeStrength: round(routeStrength),
              carries: routeStrength > 0.68
                ? "uplift-pressure / basin-debt / shelf-credit"
                : "sediment-promise / drainage-demand / coast-candidate"
            });
          }
        }
      }
    }

    return routes
      .sort((a, b) => b.routeStrength - a.routeStrength)
      .slice(0, 96);
  }

  function buildLandformModel(options = {}) {
    const seed = hashString(`${CONTRACT}:${WORLD_NAME}:${STORY_REFERENCE}:${safeString(options.seed, "v1")}`);
    const bias = donorBias();
    const nodes = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        nodes.push(buildNode(row, col, seed, bias));
      }
    }

    const exchangeRoutes = buildExchangeRoutes(nodes);

    const classCounts = countBy(nodes, "landformClass");
    const economyCounts = countBy(nodes, "economyRole");
    const districtCounts = countBy(nodes, "districtKey");

    const model = {
      modelType: "HEARTH_LANDFORM_256_GLOBAL_ECONOMY_MODEL",
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      worldName: WORLD_NAME,
      worldAlias: WORLD_ALIAS,
      pageContext: PAGE_CONTEXT,
      storyReference: STORY_REFERENCE,

      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      nodeCount: nodes.length,
      generatedAt: nowIso(),

      formationPremise: "The planet is treated as a physical body before water is restored. Hydrology later fills landform-defined basins, shelves, channels, and waterline candidates.",
      storyPremise: "Audralia supplies the clean-slate story grammar: the world is not empty; it is waiting for coherent formation to become visible.",

      donorInfluenceActive: state.donorQueue.length > 0,
      donorBias: clonePlain(bias),
      donorPacketsAccepted: state.donorPacketsAccepted,

      storyDistricts: clonePlain(STORY_DISTRICTS),
      nodes,
      exchangeRoutes,

      maps: {
        landformClassMap: mapGrid(nodes, "landformClass"),
        economyRoleMap: mapGrid(nodes, "economyRole"),
        districtMap: mapGrid(nodes, "districtKey"),
        bodyScoreMap: valueGrid(nodes, "bodyScore"),
        aboveWaterEligibilityMap: valueGrid(nodes, "aboveWaterEligibility"),
        belowWaterLandformEligibilityMap: valueGrid(nodes, "belowWaterLandformEligibility"),
        basinDepthMap: valueGrid(nodes, "basinDepth"),
        shelfScoreMap: valueGrid(nodes, "shelfScore"),
        coastlineCandidateMap: valueGrid(nodes, "coastlineCandidate"),
        drainageDemandMap: valueGrid(nodes, "drainageDemand"),
        upliftPressureMap: valueGrid(nodes, "upliftPressure"),
        landformCapitalMap: valueGrid(nodes, "landformCapital"),
        basinDebtMap: valueGrid(nodes, "basinDebt"),
        shelfCreditMap: valueGrid(nodes, "shelfCredit")
      },

      summary: {
        classCounts,
        economyCounts,
        districtCounts,
        topContinentCores: topNodes(nodes, "bodyScore", 12),
        topBasins: topNodes(nodes, "basinDepth", 12),
        topShelves: topNodes(nodes, "shelfScore", 12),
        topUplifts: topNodes(nodes, "upliftPressure", 12),
        topGateways: topNodes(nodes, "landBridgeScore", 8),
        strongestExchangeRoutes: exchangeRoutes.slice(0, 16)
      },

      downstreamFiles: clonePlain(DOWNSTREAM_FILES),

      ownsLandformDefinition: true,
      ownsSurfaceSocket: false,
      ownsCanvasParent: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsFinalVisualPass: false,

      ...FINAL_FALSE
    };

    state.landformModel = clonePlain(model);
    state.landformModelReady = true;
    state.landformEconomyReady = true;
    state.diagnostic256Ready = nodes.length === NODE_TOTAL;
    state.aboveWaterEligibilityMapReady = true;
    state.belowWaterEligibilityMapReady = true;
    state.basinStructureMapReady = true;
    state.shelfCandidateMapReady = true;
    state.coastlineCandidateMapReady = true;
    state.drainagePrepMapReady = true;

    state.nodeCount = nodes.length;
    state.classCounts = clonePlain(classCounts);
    state.economyCounts = clonePlain(economyCounts);
    state.districtCounts = clonePlain(districtCounts);

    state.firstFailedCoordinate = nodes.length === NODE_TOTAL ? "NONE" : "LANDFORM_256_SCOPE_INCOMPLETE";
    state.recommendedNextFile = ELEVATION_FILE;
    state.recommendedNextRenewalTarget = ELEVATION_FILE;
    state.postgameStatus = nodes.length === NODE_TOTAL
      ? "LANDFORM_256_GLOBAL_ECONOMY_READY_FOR_ELEVATION_HYDROLOGY_MATERIAL_COMPOSITE"
      : "LANDFORM_HELD_256_SCOPE_INCOMPLETE";

    return model;
  }

  function buildElevationPrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_ELEVATION_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: ELEVATION_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      elevationPrepReady: true,
      upliftCandidates: topNodes(source.nodes, "upliftPressure", 32),
      plateauCandidates: source.nodes
        .filter((node) => node.elevationPrep.plateauCandidate >= 0.52)
        .map((node) => ({ id: node.id, value: node.elevationPrep.plateauCandidate, district: node.districtTitle })),
      lowlandCandidates: source.nodes
        .filter((node) => node.elevationPrep.lowlandCandidate >= 0.54)
        .map((node) => ({ id: node.id, value: node.elevationPrep.lowlandCandidate, district: node.districtTitle })),
      ridgeCandidateMap: source.nodes.map((node) => ({ id: node.id, value: node.elevationPrep.ridgeCandidate })),
      escarpmentCandidateMap: source.nodes.map((node) => ({ id: node.id, value: node.elevationPrep.escarpmentCandidate })),
      noFinalElevationTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.elevationPrepPacket = clonePlain(packet);
    state.elevationPrepPacketReady = true;
    return packet;
  }

  function buildHydrologyPrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_HYDROLOGY_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: HYDROLOGY_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      hydrologyPrepReady: true,
      governingPrinciple: "Hydrology fills landform-defined basins, shelves, drainage corridors, and waterline candidates; it does not invent the land body.",
      oceanBasinCandidates: source.nodes
        .filter((node) => node.hydrologyPrep.oceanBasinCandidate >= 0.52)
        .map((node) => ({ id: node.id, value: node.hydrologyPrep.oceanBasinCandidate, district: node.districtTitle })),
      inlandSeaCandidates: source.nodes
        .filter((node) => node.hydrologyPrep.inlandSeaCandidate >= 0.48)
        .map((node) => ({ id: node.id, value: node.hydrologyPrep.inlandSeaCandidate, district: node.districtTitle })),
      riverCorridorCandidates: source.nodes
        .filter((node) => node.hydrologyPrep.riverCorridorCandidate >= 0.55)
        .map((node) => ({ id: node.id, value: node.hydrologyPrep.riverCorridorCandidate, district: node.districtTitle })),
      wetlandCandidates: source.nodes
        .filter((node) => node.hydrologyPrep.wetlandCandidate >= 0.52)
        .map((node) => ({ id: node.id, value: node.hydrologyPrep.wetlandCandidate, district: node.districtTitle })),
      deltaCandidates: source.nodes
        .filter((node) => node.hydrologyPrep.deltaCandidate >= 0.50)
        .map((node) => ({ id: node.id, value: node.hydrologyPrep.deltaCandidate, district: node.districtTitle })),
      seaLevelCandidateMap: source.maps.seaLevelCandidateMap || valueGrid(source.nodes, "seaLevelCandidate"),
      noFinalHydrologyTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.hydrologyPrepPacket = clonePlain(packet);
    state.hydrologyPrepPacketReady = true;
    return packet;
  }

  function buildMaterialPrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_MATERIAL_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: MATERIAL_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      materialPrepReady: true,
      exposedRockCandidates: source.nodes
        .filter((node) => node.materialPrep.exposedRockCandidate >= 0.50)
        .map((node) => ({ id: node.id, value: node.materialPrep.exposedRockCandidate, district: node.districtTitle })),
      sedimentPlainCandidates: source.nodes
        .filter((node) => node.materialPrep.sedimentPlainCandidate >= 0.50)
        .map((node) => ({ id: node.id, value: node.materialPrep.sedimentPlainCandidate, district: node.districtTitle })),
      shelfSedimentCandidates: source.nodes
        .filter((node) => node.materialPrep.shelfSedimentCandidate >= 0.50)
        .map((node) => ({ id: node.id, value: node.materialPrep.shelfSedimentCandidate, district: node.districtTitle })),
      volcanicOrRiftCandidates: source.nodes
        .filter((node) => node.materialPrep.volcanicOrRiftCandidate >= 0.50)
        .map((node) => ({ id: node.id, value: node.materialPrep.volcanicOrRiftCandidate, district: node.districtTitle })),
      noFinalMaterialTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.materialPrepPacket = clonePlain(packet);
    state.materialPrepPacketReady = true;
    return packet;
  }

  function buildAtmospherePrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_ATMOSPHERE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: ATMOSPHERE_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      atmospherePrepReady: true,
      horizonReadableEdges: source.nodes
        .filter((node) => node.coastlineCandidate >= 0.56 || node.upliftPressure >= 0.62)
        .map((node) => ({ id: node.id, coastlineCandidate: node.coastlineCandidate, upliftPressure: node.upliftPressure, district: node.districtTitle })),
      atmosphericDepthZones: source.nodes
        .filter((node) => node.basinDepth >= 0.52 || node.belowWaterLandformEligibility >= 0.52)
        .map((node) => ({ id: node.id, basinDepth: node.basinDepth, belowWaterLandformEligibility: node.belowWaterLandformEligibility })),
      noFinalAtmosphereTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.atmospherePrepPacket = clonePlain(packet);
    state.atmospherePrepPacketReady = true;
    return packet;
  }

  function buildLightingPrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_LIGHTING_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: LIGHTING_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      lightingPrepReady: true,
      rimLightCandidateEdges: source.nodes
        .filter((node) => node.compositePrep.visibleSilhouetteWeight >= 0.52 || node.elevationPrep.escarpmentCandidate >= 0.5)
        .map((node) => ({
          id: node.id,
          visibleSilhouetteWeight: node.compositePrep.visibleSilhouetteWeight,
          escarpmentCandidate: node.elevationPrep.escarpmentCandidate,
          district: node.districtTitle
        })),
      shadowReliefCandidates: source.nodes
        .filter((node) => node.upliftPressure >= 0.56 || node.riftScore >= 0.52)
        .map((node) => ({ id: node.id, upliftPressure: node.upliftPressure, riftScore: node.riftScore })),
      noFinalLightingTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.lightingPrepPacket = clonePlain(packet);
    state.lightingPrepPacketReady = true;
    return packet;
  }

  function buildCompositePrepPacket(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_TO_COMPOSITE_PREP_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: COMPOSITE_FILE,
      route: ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      compositePrepReady: true,
      landformCompositeMask: source.nodes.map((node) => ({
        id: node.id,
        row: node.row,
        col: node.col,
        class: node.landformClass,
        role: node.economyRole,
        priority: node.compositePrep.priority,
        visibleSilhouetteWeight: node.compositePrep.visibleSilhouetteWeight,
        basinSilhouetteWeight: node.compositePrep.basinSilhouetteWeight,
        shelfLineWeight: node.compositePrep.shelfLineWeight,
        storyWeight: node.compositePrep.storyWeight
      })),
      continentSilhouetteMap: valueGrid(source.nodes, "aboveWaterEligibility"),
      basinSilhouetteMap: valueGrid(source.nodes, "basinDepth"),
      shelfEdgeMap: valueGrid(source.nodes, "shelfScore"),
      coastCandidateLinework: source.nodes
        .filter((node) => node.coastlineCandidate >= 0.52)
        .map((node) => ({ id: node.id, row: node.row, col: node.col, weight: node.coastlineCandidate })),
      majorBodyPriorityMap: source.nodes
        .filter((node) => node.compositePrep.priority >= 0.5)
        .map((node) => ({ id: node.id, priority: node.compositePrep.priority, district: node.districtTitle })),
      noFinalCompositeTruthClaimed: true,
      ...FINAL_FALSE
    };

    state.compositePrepPacket = clonePlain(packet);
    state.compositePrepPacketReady = true;
    return packet;
  }

  function buildDiagnostic256Packet(model) {
    const source = model || state.landformModel || buildLandformModel();

    const packet = {
      packetType: "HEARTH_LANDFORM_256_DIAGNOSTIC_SCOPE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      nodeCount: source.nodes.length,
      diagnostic256Ready: source.nodes.length === NODE_TOTAL,
      classCounts: clonePlain(source.summary.classCounts),
      economyCounts: clonePlain(source.summary.economyCounts),
      districtCounts: clonePlain(source.summary.districtCounts),
      mapReadiness: {
        landformModelReady: state.landformModelReady,
        landformEconomyReady: state.landformEconomyReady,
        aboveWaterEligibilityMapReady: state.aboveWaterEligibilityMapReady,
        belowWaterEligibilityMapReady: state.belowWaterEligibilityMapReady,
        basinStructureMapReady: state.basinStructureMapReady,
        shelfCandidateMapReady: state.shelfCandidateMapReady,
        coastlineCandidateMapReady: state.coastlineCandidateMapReady,
        drainagePrepMapReady: state.drainagePrepMapReady,
        elevationPrepPacketReady: state.elevationPrepPacketReady,
        hydrologyPrepPacketReady: state.hydrologyPrepPacketReady,
        materialPrepPacketReady: state.materialPrepPacketReady,
        atmospherePrepPacketReady: state.atmospherePrepPacketReady,
        lightingPrepPacketReady: state.lightingPrepPacketReady,
        compositePrepPacketReady: state.compositePrepPacketReady
      },
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      postgameStatus: state.postgameStatus,
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.diagnostic256Packet = clonePlain(packet);
    state.diagnostic256Ready = packet.diagnostic256Ready;
    return packet;
  }

  function buildAllPackets(options = {}) {
    const model = buildLandformModel(options);
    buildElevationPrepPacket(model);
    buildHydrologyPrepPacket(model);
    buildMaterialPrepPacket(model);
    buildAtmospherePrepPacket(model);
    buildLightingPrepPacket(model);
    buildCompositePrepPacket(model);
    buildDiagnostic256Packet(model);

    state.landformPacket = {
      packetType: "HEARTH_LANDFORM_PRIMARY_LAND_DEFINITION_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      sourceFile: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      worldName: WORLD_NAME,
      worldAlias: WORLD_ALIAS,
      pageContext: PAGE_CONTEXT,
      storyReference: STORY_REFERENCE,
      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      landformModelReady: true,
      landformEconomyReady: true,
      primaryLandDefinitionAuthority: true,
      surfacePointerReceiver: true,
      canvasParentAuthority: false,
      externalSocketAuthority: false,
      landformModel: clonePlain(model),
      downstreamPrepPackets: {
        elevation: clonePlain(state.elevationPrepPacket),
        hydrology: clonePlain(state.hydrologyPrepPacket),
        material: clonePlain(state.materialPrepPacket),
        atmosphere: clonePlain(state.atmospherePrepPacket),
        lighting: clonePlain(state.lightingPrepPacket),
        composite: clonePlain(state.compositePrepPacket)
      },
      diagnostic256Packet: clonePlain(state.diagnostic256Packet),
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };

    updateDataset();
    publishGlobals();

    record("LANDFORM_256_GLOBAL_ECONOMY_BUILT", {
      nodeCount: state.nodeCount,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return clonePlain(state.landformPacket);
  }

  function receiveSurfacePointerPacket(packet = {}) {
    if (!isObject(packet)) {
      state.donorPacketsRejected += 1;
      const rejection = {
        at: nowIso(),
        reason: "DONOR_PACKET_NOT_OBJECT",
        packetType: typeof packet
      };
      state.rejectedDonors.push(rejection);
      trimArray(state.rejectedDonors, 80);
      return { ok: false, reason: rejection.reason, receipt: getLandformReceiptLight() };
    }

    if (hasForbiddenFinalClaim(packet)) {
      state.donorPacketsRejected += 1;
      const rejection = {
        at: nowIso(),
        reason: "DONOR_PACKET_REJECTED_FALSE_FINAL_CLAIM",
        packet: clonePlain(packet)
      };
      state.rejectedDonors.push(rejection);
      trimArray(state.rejectedDonors, 80);
      record("LANDFORM_DONOR_REJECTED_FALSE_FINAL_CLAIM", { reason: rejection.reason });
      return { ok: false, reason: rejection.reason, receipt: getLandformReceiptLight() };
    }

    const classification = classifyDonor(packet);

    if (!classification.accepted) {
      state.donorPacketsRejected += 1;
      const rejection = {
        at: nowIso(),
        reason: "DONOR_PACKET_NO_LANDFORM_RELEVANT_CATEGORY",
        categories: clonePlain(classification.categories)
      };
      state.rejectedDonors.push(rejection);
      trimArray(state.rejectedDonors, 80);
      return { ok: false, reason: rejection.reason, receipt: getLandformReceiptLight() };
    }

    state.donorPacketsReceived += 1;
    state.donorPacketsAccepted += 1;
    state.donorInfluenceActive = true;
    state.donorCategoryMap = clonePlain(classification.categories);

    const donorRecord = {
      at: nowIso(),
      source: safeString(packet.sourceFile || packet.file || packet.contract || "SURFACE_POINTER_PACKET"),
      categories: clonePlain(classification.categories),
      packet: clonePlain(packet)
    };

    state.donorQueue.push(donorRecord);
    trimArray(state.donorQueue, 24);

    const built = buildAllPackets({ seed: `donor-${state.donorPacketsAccepted}` });

    record("LANDFORM_SURFACE_POINTER_PACKET_ACCEPTED", {
      donorPacketsAccepted: state.donorPacketsAccepted,
      categories: classification.categories
    });

    return {
      ok: true,
      accepted: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: clonePlain(built),
      landformReceipt: getLandformReceiptLight(),
      ...FINAL_FALSE
    };
  }

  function receiveExternalLandformPacket(packet = {}) {
    return receiveSurfacePointerPacket({
      ...packet,
      routedBy: packet.routedBy || "SURFACE_POINTER_COMPATIBILITY_METHOD",
      routedTo: "landform"
    });
  }

  function receiveDonorLandformIntelligence(packet = {}) {
    return receiveSurfacePointerPacket({
      ...packet,
      donorIntelligence: true,
      routedTo: "landform"
    });
  }

  function receiveLandformSeed(packet = {}) {
    return receiveSurfacePointerPacket({
      ...packet,
      landformSeed: true,
      routedTo: "landform"
    });
  }

  function sampleLandform(x, y, options = {}) {
    const model = state.landformModel || buildLandformModel(options);
    const width = safeNumber(options.width, 1);
    const height = safeNumber(options.height, 1);

    let nx = safeNumber(x, 0);
    let ny = safeNumber(y, 0);

    if (nx > 1 || ny > 1) {
      nx = width ? nx / width : nx;
      ny = height ? ny / height : ny;
    }

    nx = clamp(nx, 0, 1);
    ny = clamp(ny, 0, 1);

    const col = clamp(Math.floor(nx * GRID_SIZE), 0, GRID_SIZE - 1);
    const row = clamp(Math.floor(ny * GRID_SIZE), 0, GRID_SIZE - 1);
    const node = model.nodes[(row * GRID_SIZE) + col];

    return {
      packetType: "HEARTH_LANDFORM_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      x: round(nx),
      y: round(ny),
      row,
      col,
      node: clonePlain(node),
      ...FINAL_FALSE
    };
  }

  function getLandformNode(identifier) {
    const model = state.landformModel || buildLandformModel();

    if (typeof identifier === "number") {
      return clonePlain(model.nodes[clamp(identifier, 0, NODE_TOTAL - 1)]);
    }

    const id = safeString(identifier).trim().toUpperCase();
    return clonePlain(model.nodes.find((node) => node.id === id) || null);
  }

  function getLandformPacket(options = {}) {
    if (!state.landformPacket || options.rebuild === true) return buildAllPackets(options);
    return clonePlain(state.landformPacket);
  }

  function getElevationPrepPacket() {
    if (!state.elevationPrepPacket) buildAllPackets();
    return clonePlain(state.elevationPrepPacket);
  }

  function getHydrologyPrepPacket() {
    if (!state.hydrologyPrepPacket) buildAllPackets();
    return clonePlain(state.hydrologyPrepPacket);
  }

  function getMaterialPrepPacket() {
    if (!state.materialPrepPacket) buildAllPackets();
    return clonePlain(state.materialPrepPacket);
  }

  function getAtmospherePrepPacket() {
    if (!state.atmospherePrepPacket) buildAllPackets();
    return clonePlain(state.atmospherePrepPacket);
  }

  function getLightingPrepPacket() {
    if (!state.lightingPrepPacket) buildAllPackets();
    return clonePlain(state.lightingPrepPacket);
  }

  function getCompositePrepPacket() {
    if (!state.compositePrepPacket) buildAllPackets();
    return clonePlain(state.compositePrepPacket);
  }

  function getDiagnostic256Packet() {
    if (!state.diagnostic256Packet) buildAllPackets();
    return clonePlain(state.diagnostic256Packet);
  }

  function getLandformState() {
    return clonePlain(state);
  }

  function read() {
    return getLandformReceiptLight();
  }

  function getLandformReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      worldName: WORLD_NAME,
      worldAlias: WORLD_ALIAS,
      pageContext: PAGE_CONTEXT,
      storyReference: STORY_REFERENCE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerLoaded: state.fingerLoaded,
      fingerActive: state.fingerActive,
      primaryLandDefinitionAuthority: state.primaryLandDefinitionAuthority,
      surfacePointerReceiver: state.surfacePointerReceiver,
      externalSocketAuthority: state.externalSocketAuthority,
      canvasParentAuthority: state.canvasParentAuthority,

      gridSize: GRID_SIZE,
      diagnosticScope: NODE_TOTAL,
      diagnosticScopeLabel: state.diagnosticScopeLabel,
      diagnostic256Active: state.diagnostic256Active,
      diagnostic256Ready: state.diagnostic256Ready,
      nodeCount: state.nodeCount,

      donorPacketsReceived: state.donorPacketsReceived,
      donorPacketsAccepted: state.donorPacketsAccepted,
      donorPacketsRejected: state.donorPacketsRejected,
      donorInfluenceActive: state.donorInfluenceActive,

      landformModelReady: state.landformModelReady,
      landformEconomyReady: state.landformEconomyReady,
      aboveWaterEligibilityMapReady: state.aboveWaterEligibilityMapReady,
      belowWaterEligibilityMapReady: state.belowWaterEligibilityMapReady,
      basinStructureMapReady: state.basinStructureMapReady,
      shelfCandidateMapReady: state.shelfCandidateMapReady,
      coastlineCandidateMapReady: state.coastlineCandidateMapReady,
      drainagePrepMapReady: state.drainagePrepMapReady,

      elevationPrepPacketReady: state.elevationPrepPacketReady,
      hydrologyPrepPacketReady: state.hydrologyPrepPacketReady,
      materialPrepPacketReady: state.materialPrepPacketReady,
      atmospherePrepPacketReady: state.atmospherePrepPacketReady,
      lightingPrepPacketReady: state.lightingPrepPacketReady,
      compositePrepPacketReady: state.compositePrepPacketReady,

      classCounts: clonePlain(state.classCounts),
      economyCounts: clonePlain(state.economyCounts),
      districtCounts: clonePlain(state.districtCounts),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getLandformReceipt() {
    return {
      ...getLandformReceiptLight(),
      currentReceipt: true,
      downstreamFiles: clonePlain(DOWNSTREAM_FILES),
      landformPacket: clonePlain(state.landformPacket),
      diagnostic256Packet: clonePlain(state.diagnostic256Packet),
      elevationPrepPacket: clonePlain(state.elevationPrepPacket),
      hydrologyPrepPacket: clonePlain(state.hydrologyPrepPacket),
      materialPrepPacket: clonePlain(state.materialPrepPacket),
      atmospherePrepPacket: clonePlain(state.atmospherePrepPacket),
      lightingPrepPacket: clonePlain(state.lightingPrepPacket),
      compositePrepPacket: clonePlain(state.compositePrepPacket),
      donorQueue: clonePlain(state.donorQueue),
      rejectedDonors: clonePlain(state.rejectedDonors),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getLandformReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_AUTHORITY_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      "",
      "IDENTITY",
      line("worldName", r.worldName),
      line("worldAlias", r.worldAlias),
      line("pageContext", r.pageContext),
      line("storyReference", r.storyReference),
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("primaryLandDefinitionAuthority", r.primaryLandDefinitionAuthority),
      line("surfacePointerReceiver", r.surfacePointerReceiver),
      line("externalSocketAuthority", r.externalSocketAuthority),
      line("canvasParentAuthority", r.canvasParentAuthority),
      "",
      "256_DIAGNOSTIC_SCOPE",
      line("gridSize", r.gridSize),
      line("diagnosticScope", r.diagnosticScope),
      line("diagnostic256Active", r.diagnostic256Active),
      line("diagnostic256Ready", r.diagnostic256Ready),
      line("nodeCount", r.nodeCount),
      "",
      "DONOR_STATUS",
      line("donorPacketsReceived", r.donorPacketsReceived),
      line("donorPacketsAccepted", r.donorPacketsAccepted),
      line("donorPacketsRejected", r.donorPacketsRejected),
      line("donorInfluenceActive", r.donorInfluenceActive),
      "",
      "LANDFORM_READINESS",
      line("landformModelReady", r.landformModelReady),
      line("landformEconomyReady", r.landformEconomyReady),
      line("aboveWaterEligibilityMapReady", r.aboveWaterEligibilityMapReady),
      line("belowWaterEligibilityMapReady", r.belowWaterEligibilityMapReady),
      line("basinStructureMapReady", r.basinStructureMapReady),
      line("shelfCandidateMapReady", r.shelfCandidateMapReady),
      line("coastlineCandidateMapReady", r.coastlineCandidateMapReady),
      line("drainagePrepMapReady", r.drainagePrepMapReady),
      "",
      "DOWNSTREAM_PREP",
      line("elevationPrepPacketReady", r.elevationPrepPacketReady),
      line("hydrologyPrepPacketReady", r.hydrologyPrepPacketReady),
      line("materialPrepPacketReady", r.materialPrepPacketReady),
      line("atmospherePrepPacketReady", r.atmospherePrepPacketReady),
      line("lightingPrepPacketReady", r.lightingPrepPacketReady),
      line("compositePrepPacketReady", r.compositePrepPacketReady),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noFinalClaimsPreserved", r.noFinalClaimsPreserved),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("terrainTruthClaimed", false),
      line("landformTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("atmosphereTruthClaimed", false),
      line("lightingTruthClaimed", false),
      line("compositeTruthClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerLandformLoaded", "true");
    setDataset("hearthCanvasFingerLandformContract", CONTRACT);
    setDataset("hearthCanvasFingerLandformReceipt", RECEIPT);
    setDataset("hearthCanvasFingerLandformFile", FILE);
    setDataset("hearthCanvasFingerLandformRole", FINGER_ROLE);
    setDataset("hearthCanvasFingerLandformPrimaryLandDefinitionAuthority", String(state.primaryLandDefinitionAuthority));
    setDataset("hearthCanvasFingerLandformSurfacePointerReceiver", String(state.surfacePointerReceiver));
    setDataset("hearthCanvasFingerLandformExternalSocketAuthority", "false");
    setDataset("hearthCanvasFingerLandformCanvasParentAuthority", "false");

    setDataset("hearthCanvasFingerLandformDiagnostic256Active", "true");
    setDataset("hearthCanvasFingerLandformDiagnostic256Ready", String(state.diagnostic256Ready));
    setDataset("hearthCanvasFingerLandformGridSize", String(GRID_SIZE));
    setDataset("hearthCanvasFingerLandformNodeCount", String(state.nodeCount));

    setDataset("hearthCanvasFingerLandformModelReady", String(state.landformModelReady));
    setDataset("hearthCanvasFingerLandformEconomyReady", String(state.landformEconomyReady));
    setDataset("hearthCanvasFingerLandformAboveWaterEligibilityMapReady", String(state.aboveWaterEligibilityMapReady));
    setDataset("hearthCanvasFingerLandformBelowWaterEligibilityMapReady", String(state.belowWaterEligibilityMapReady));
    setDataset("hearthCanvasFingerLandformBasinStructureMapReady", String(state.basinStructureMapReady));
    setDataset("hearthCanvasFingerLandformShelfCandidateMapReady", String(state.shelfCandidateMapReady));
    setDataset("hearthCanvasFingerLandformCoastlineCandidateMapReady", String(state.coastlineCandidateMapReady));
    setDataset("hearthCanvasFingerLandformDrainagePrepMapReady", String(state.drainagePrepMapReady));

    setDataset("hearthCanvasFingerLandformElevationPrepPacketReady", String(state.elevationPrepPacketReady));
    setDataset("hearthCanvasFingerLandformHydrologyPrepPacketReady", String(state.hydrologyPrepPacketReady));
    setDataset("hearthCanvasFingerLandformMaterialPrepPacketReady", String(state.materialPrepPacketReady));
    setDataset("hearthCanvasFingerLandformAtmospherePrepPacketReady", String(state.atmospherePrepPacketReady));
    setDataset("hearthCanvasFingerLandformLightingPrepPacketReady", String(state.lightingPrepPacketReady));
    setDataset("hearthCanvasFingerLandformCompositePrepPacketReady", String(state.compositePrepPacketReady));

    setDataset("hearthCanvasFingerLandformDonorPacketsReceived", String(state.donorPacketsReceived));
    setDataset("hearthCanvasFingerLandformDonorPacketsAccepted", String(state.donorPacketsAccepted));
    setDataset("hearthCanvasFingerLandformDonorPacketsRejected", String(state.donorPacketsRejected));
    setDataset("hearthCanvasFingerLandformDonorInfluenceActive", String(state.donorInfluenceActive));

    setDataset("hearthCanvasFingerLandformFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerLandformRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerLandformPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerLandformF13Claimed", "false");
    setDataset("hearthCanvasFingerLandformF21Claimed", "false");
    setDataset("hearthCanvasFingerLandformReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerLandformTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerLandformLandformTruthClaimed", "false");
    setDataset("hearthCanvasFingerLandformElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerLandformHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerLandformMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerLandformVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerLandformGeneratedImage", "false");
    setDataset("hearthCanvasFingerLandformGraphicBox", "false");
    setDataset("hearthCanvasFingerLandformWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerLandform = api;
    hearth.canvasLandformFinger = api;
    hearth.landformFinger = api;
    hearth.hearthLandformEconomy = api;

    lab.hearthCanvasFingerLandform = api;
    lab.hearthLandformFinger = api;
    lab.hearthLandformEconomy = api;

    root.HEARTH_CANVAS_FINGER_LANDFORM = api;
    root.HEARTH_CANVAS_LANDFORM_FINGER = api;
    root.HEARTH_LANDFORM_FINGER = api;
    root.HEARTH_LANDFORM_256_GLOBAL_ECONOMY = api;

    const light = getLandformReceiptLight();
    const full = getLandformReceipt();

    hearth.canvasFingerLandformReceipt = light;
    hearth.landformFingerReceipt = light;
    hearth.landformPacket = clonePlain(state.landformPacket);
    hearth.landformDiagnostic256Packet = clonePlain(state.diagnostic256Packet);

    lab.hearthCanvasFingerLandformReceipt = light;
    lab.hearthLandformPacket = clonePlain(state.landformPacket);

    root.HEARTH_CANVAS_FINGER_LANDFORM_RECEIPT = light;
    root.HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_RECEIPT = full;
    root.HEARTH_CANVAS_FINGER_LANDFORM_256_GLOBAL_ECONOMY_RECEIPT_v1 = full;
    root.HEARTH_CANVAS_FINGER_LANDFORM_PACKET = clonePlain(state.landformPacket);
    root.HEARTH_LANDFORM_256_DIAGNOSTIC_SCOPE_PACKET = clonePlain(state.diagnostic256Packet);

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();
    const packet = buildAllPackets(options);
    updateDataset();
    publishGlobals();

    record("LANDFORM_FINGER_BOOT_COMPLETE", {
      contract: CONTRACT,
      nodeCount: state.nodeCount,
      diagnostic256Ready: state.diagnostic256Ready,
      postgameStatus: state.postgameStatus
    });

    return packet;
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function mount(options = {}) {
    return boot(options);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    VERSION,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,

    SURFACE_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    ELEVATION_FILE,
    HYDROLOGY_FILE,
    MATERIAL_FILE,
    ATMOSPHERE_FILE,
    LIGHTING_FILE,
    COMPOSITE_FILE,
    INSPECT_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    worldName: WORLD_NAME,
    worldAlias: WORLD_ALIAS,
    pageContext: PAGE_CONTEXT,
    storyReference: STORY_REFERENCE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    gridSize: GRID_SIZE,
    diagnosticScope: NODE_TOTAL,

    boot,
    init,
    start,
    mount,

    buildLandformModel,
    buildAllPackets,

    receiveSurfacePointerPacket,
    receiveExternalLandformPacket,
    receiveDonorLandformIntelligence,
    receiveLandformSeed,

    sampleLandform,
    getLandformNode,

    getLandformPacket,
    getElevationPrepPacket,
    getHydrologyPrepPacket,
    getMaterialPrepPacket,
    getAtmospherePrepPacket,
    getLightingPrepPacket,
    getCompositePrepPacket,
    getDiagnostic256Packet,

    getLandformState,
    read,
    getLandformReceipt,
    getLandformReceiptLight,
    getReceipt: getLandformReceipt,
    getReceiptLight: getLandformReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsSurfacePointerReceiver: true,
    supportsPrimaryLandDefinitionAuthority: true,
    supports256DiagnosticScope: true,
    supportsLandformGlobalEconomy: true,
    supportsAudraliaStoryGrammar: true,
    supportsAboveWaterEligibilityMap: true,
    supportsBelowWaterLandformEligibilityMap: true,
    supportsBasinStructureMap: true,
    supportsShelfCandidateMap: true,
    supportsCoastlineCandidateMap: true,
    supportsDrainagePrepMap: true,
    supportsElevationPrepPacket: true,
    supportsHydrologyPrepPacket: true,
    supportsMaterialPrepPacket: true,
    supportsAtmospherePrepPacket: true,
    supportsLightingPrepPacket: true,
    supportsCompositePrepPacket: true,
    supportsNoFinalClaims: true,

    ownsLandformDefinition: true,
    ownsLandformEconomy: true,
    ownsSurfaceSocket: false,
    ownsExternalSocket: false,
    ownsCanvasParent: false,
    ownsDiagnosticRail: false,
    ownsRouteConductor: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();
    buildAllPackets();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => {
          try {
            boot({});
          } catch (error) {
            recordError("LANDFORM_DOM_BOOT_FAILED", error);
            updateDataset();
            publishGlobals();
          }
        }, { once: true });
      } else {
        boot({});
      }
    }
  } catch (error) {
    recordError("LANDFORM_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
