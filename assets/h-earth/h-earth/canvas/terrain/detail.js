// /assets/h-earth/h-earth/canvas/terrain/detail.js
// H_EARTH_G1_CANVAS_TERRAIN_DETAIL_CHILD_TNT_v1
// Full-file replacement.
// Downstream terrain-detail child only.
//
// Purpose:
// - Add visual terrain-detail amplification for H-Earth.
// - Break up low-definition 256-cell blob rendering.
// - Preserve parent truth.
// - Return deterministic visual samples only.
//
// Does not:
// - mutate parent truth
// - decide land/ocean truth
// - authorize ground level
// - authorize estate placement
// - touch DOM
// - create canvas
// - attach event listeners
// - start requestAnimationFrame
// - use Math.random
// - import parent modules

const H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT =
  "H_EARTH_G1_CANVAS_TERRAIN_DETAIL_CHILD_TNT_v1";

const H_EARTH_CANVAS_TERRAIN_DETAIL_PREVIOUS =
  "H_EARTH_G1_CANVAS_TERRAIN_ELEVATION_SEA_LEVEL_CHILD_TNT_v1";

const H_EARTH_CANVAS_TERRAIN_DETAIL_SCOPE =
  "downstream-visual-expression-only";

const DEFAULT_DETAIL_OPTIONS = Object.freeze({
  detailScale: 1,
  zoom: 1,
  coastHardening: 1,
  ridgeStrength: 1,
  valleyStrength: 1,
  oceanDepthStrength: 1,
  iceSoftness: 1,
  lowlandBreakup: 1,
  mountainRelief: 1
});

const DETAIL_STATUS = {
  contract: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
  previous: H_EARTH_CANVAS_TERRAIN_DETAIL_PREVIOUS,
  scope: H_EARTH_CANVAS_TERRAIN_DETAIL_SCOPE,
  status: "ready",
  parentMutationAuthorized: false,
  truthMutationAuthorized: false,
  groundLevelAuthorized: false,
  estatePlacementAuthorized: false,
  generatedImage: false,
  graphicBox: false,
  randomUsed: false,
  domTouched: false,
  rafStarted: false
};

function finiteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function hashString(input) {
  const text = String(input);
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function unitHash(seed, salt = "") {
  const hash = hashString(`${seed}|${salt}`);
  return hash / 4294967295;
}

function signedHash(seed, salt = "") {
  return unitHash(seed, salt) * 2 - 1;
}

function classifyVisual(input = {}) {
  const material = normalizeString(
    input.material ||
    input.surfaceMaterial ||
    input.materialClass ||
    input.terrainAspect ||
    input.kind ||
    input.type ||
    ""
  );

  const kind = normalizeString(input.kind || input.type || "");

  if (
    input.isOcean === true ||
    input.ocean === true ||
    input.water === true ||
    kind.includes("ocean") ||
    kind.includes("water") ||
    material.includes("ocean") ||
    material.includes("water") ||
    material.includes("shelf") ||
    material.includes("reef")
  ) {
    return "ocean";
  }

  if (
    input.isCoast === true ||
    input.coast === true ||
    kind.includes("coast") ||
    material.includes("coast") ||
    material.includes("beach") ||
    material.includes("shore") ||
    material.includes("sediment")
  ) {
    return "coast";
  }

  if (
    input.isIce === true ||
    input.ice === true ||
    input.snow === true ||
    kind.includes("ice") ||
    kind.includes("snow") ||
    kind.includes("glacier") ||
    material.includes("ice") ||
    material.includes("snow") ||
    material.includes("glacier")
  ) {
    return "ice";
  }

  if (
    input.isMountain === true ||
    input.mountain === true ||
    input.stone === true ||
    kind.includes("stone") ||
    kind.includes("mountain") ||
    kind.includes("ridge") ||
    kind.includes("cliff") ||
    kind.includes("canyon") ||
    kind.includes("volcanic") ||
    material.includes("stone") ||
    material.includes("mountain") ||
    material.includes("ridge") ||
    material.includes("cliff") ||
    material.includes("canyon") ||
    material.includes("volcanic") ||
    material.includes("mineral")
  ) {
    return "relief";
  }

  if (
    input.isLand === true ||
    input.land === true ||
    kind.includes("land") ||
    kind.includes("ground") ||
    kind.includes("forest") ||
    kind.includes("valley") ||
    kind.includes("basin") ||
    material.includes("land") ||
    material.includes("ground") ||
    material.includes("forest") ||
    material.includes("valley") ||
    material.includes("basin") ||
    material.includes("grass")
  ) {
    return "land";
  }

  return "unknown";
}

function buildSeed(input = {}, options = {}) {
  const index = finiteNumber(input.index ?? input.cellIndex ?? input.id, 0);
  const row = finiteNumber(input.row ?? input.r, Math.floor(index / 16));
  const col = finiteNumber(input.col ?? input.c, index % 16);
  const latitude = finiteNumber(input.latitude ?? input.lat, 90 - row * 12);
  const longitude = finiteNumber(input.longitude ?? input.lon, -180 + col * 24);
  const material = normalizeString(input.material || input.surfaceMaterial || input.terrainAspect || input.kind);
  const extra = normalizeString(options.seed || input.seed || "");

  return `${index}|${row}|${col}|${latitude.toFixed(3)}|${longitude.toFixed(3)}|${material}|${extra}`;
}

function normalizedElevation(input = {}, visualClass = "unknown") {
  const raw =
    input.elevation ??
    input.elevationRelativeToSeaLevel ??
    input.seaLevelElevation ??
    input.height ??
    input.altitude;

  if (Number.isFinite(Number(raw))) {
    return clamp(Number(raw), -1, 1);
  }

  if (visualClass === "ocean") return -0.55;
  if (visualClass === "coast") return 0.04;
  if (visualClass === "ice") return 0.46;
  if (visualClass === "relief") return 0.72;
  if (visualClass === "land") return 0.28;

  return 0;
}

function normalizedCoastDistance(input = {}, visualClass = "unknown") {
  const raw =
    input.distanceToCoast ??
    input.coastDistance ??
    input.shoreDistance ??
    input.distance_from_coast;

  if (Number.isFinite(Number(raw))) {
    return clamp(Number(raw), 0, 1);
  }

  if (visualClass === "coast") return 0.05;
  if (visualClass === "ocean") return 0.38;
  if (visualClass === "land") return 0.46;
  if (visualClass === "relief") return 0.62;
  if (visualClass === "ice") return 0.7;

  return 0.5;
}

function normalizedSlope(input = {}, seed = "") {
  const raw = input.slope ?? input.slopeMagnitude ?? input.gradient;

  if (Number.isFinite(Number(raw))) {
    return clamp(Number(raw), 0, 1);
  }

  return clamp(0.35 + signedHash(seed, "slope") * 0.22, 0, 1);
}

function sampleTerrainDetail(input = {}, options = {}) {
  const mergedOptions = {
    ...DEFAULT_DETAIL_OPTIONS,
    ...(options || {})
  };

  const visualClass = classifyVisual(input);
  const seed = buildSeed(input, mergedOptions);

  const zoom = clamp(finiteNumber(input.zoom ?? mergedOptions.zoom, 1), 0.5, 4);
  const detailScale = clamp(finiteNumber(mergedOptions.detailScale, 1), 0.25, 3) * clamp(zoom, 0.75, 2.25);

  const elevation = normalizedElevation(input, visualClass);
  const coastDistance = normalizedCoastDistance(input, visualClass);
  const slope = normalizedSlope(input, seed);

  const microA = signedHash(seed, "micro-a");
  const microB = signedHash(seed, "micro-b");
  const microC = signedHash(seed, "micro-c");
  const directional = signedHash(seed, "direction");
  const broken = unitHash(seed, "breakup");

  const baseGrain =
    visualClass === "ocean" ? 0.18 :
    visualClass === "coast" ? 0.72 :
    visualClass === "ice" ? 0.32 :
    visualClass === "relief" ? 0.88 :
    visualClass === "land" ? 0.58 :
    0.36;

  const grain = clamp((baseGrain + microA * 0.18) * detailScale, 0, 1.65);

  const ridge =
    visualClass === "relief"
      ? clamp((0.62 + slope * 0.32 + microB * 0.18) * mergedOptions.mountainRelief, 0, 1)
      : visualClass === "land"
        ? clamp((0.18 + slope * 0.22 + microB * 0.10) * mergedOptions.ridgeStrength, 0, 0.62)
        : visualClass === "coast"
          ? clamp(0.12 + microB * 0.08, 0, 0.4)
          : 0;

  const valley =
    visualClass === "relief" || visualClass === "land"
      ? clamp((0.28 + (1 - elevation) * 0.18 + Math.abs(microC) * 0.22) * mergedOptions.valleyStrength, 0, 1)
      : visualClass === "coast"
        ? clamp(0.18 + Math.abs(microC) * 0.12, 0, 0.5)
        : 0;

  const coastHardness =
    visualClass === "coast"
      ? clamp((0.72 + (1 - coastDistance) * 0.24 + Math.abs(microA) * 0.14) * mergedOptions.coastHardening, 0, 1)
      : visualClass === "ocean"
        ? clamp((1 - coastDistance) * 0.38 * mergedOptions.coastHardening, 0, 0.6)
        : visualClass === "land"
          ? clamp((1 - coastDistance) * 0.22 * mergedOptions.coastHardening, 0, 0.5)
          : 0;

  const oceanDepthHint =
    visualClass === "ocean"
      ? clamp((Math.abs(elevation) * 0.72 + coastDistance * 0.28 + microB * 0.08) * mergedOptions.oceanDepthStrength, 0, 1)
      : visualClass === "coast"
        ? clamp((1 - coastDistance) * 0.34, 0, 0.48)
        : 0;

  const iceSoftness =
    visualClass === "ice"
      ? clamp((0.55 + Math.abs(microC) * 0.25) * mergedOptions.iceSoftness, 0, 1)
      : 0;

  const elevationShade = clamp(
    elevation * 0.34 + slope * 0.22 + directional * 0.08,
    -0.55,
    0.72
  );

  const slopeShade = clamp(slope * directional, -0.55, 0.55);

  const colorLift =
    visualClass === "ice"
      ? clamp(0.16 + iceSoftness * 0.18, 0, 0.4)
      : visualClass === "coast"
        ? clamp(0.08 + coastHardness * 0.12, 0, 0.32)
        : visualClass === "land"
          ? clamp(0.04 + broken * 0.08, 0, 0.22)
          : visualClass === "relief"
            ? clamp(0.03 + ridge * 0.11, 0, 0.25)
            : 0;

  const colorDarken =
    visualClass === "ocean"
      ? clamp(0.10 + oceanDepthHint * 0.28, 0, 0.42)
      : visualClass === "relief"
        ? clamp(0.08 + valley * 0.22, 0, 0.35)
        : visualClass === "land"
          ? clamp(0.04 + valley * 0.12, 0, 0.24)
          : 0;

  const highlightAlpha =
    visualClass === "relief"
      ? clamp(0.10 + ridge * 0.30, 0, 0.44)
      : visualClass === "coast"
        ? clamp(0.09 + coastHardness * 0.22, 0, 0.34)
        : visualClass === "ice"
          ? clamp(0.14 + iceSoftness * 0.20, 0, 0.38)
          : visualClass === "land"
            ? clamp(0.05 + grain * 0.08, 0, 0.22)
            : clamp(0.02 + (1 - oceanDepthHint) * 0.06, 0, 0.12);

  const shadowAlpha =
    visualClass === "ocean"
      ? clamp(0.08 + oceanDepthHint * 0.22, 0, 0.34)
      : visualClass === "relief"
        ? clamp(0.12 + valley * 0.25, 0, 0.42)
        : visualClass === "land"
          ? clamp(0.06 + valley * 0.14, 0, 0.26)
          : visualClass === "coast"
            ? clamp(0.04 + coastHardness * 0.12, 0, 0.22)
            : 0.08;

  return {
    contract: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
    index: finiteNumber(input.index ?? input.cellIndex ?? input.id, 0),
    visualClass,

    grain,
    ridge,
    valley,
    slopeShade,
    elevationShade,
    coastHardness,
    oceanDepthHint,
    iceSoftness,

    colorLift,
    colorDarken,
    highlightAlpha,
    shadowAlpha,

    microVariation: {
      a: microA,
      b: microB,
      c: microC,
      breakup: broken,
      direction: directional
    },

    detailScale,
    zoom,
    elevation,
    slope,
    coastDistance,

    parentMutationAuthorized: false,
    truthMutationAuthorized: false,
    groundLevelAuthorized: false,
    estatePlacementAuthorized: false,
    visualExpressionOnly: true
  };
}

function createHEarthCanvasTerrainDetail(options = {}) {
  const mergedOptions = {
    ...DEFAULT_DETAIL_OPTIONS,
    ...(options || {})
  };

  return {
    contract: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
    receipt: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
    previous: H_EARTH_CANVAS_TERRAIN_DETAIL_PREVIOUS,
    scope: H_EARTH_CANVAS_TERRAIN_DETAIL_SCOPE,
    options: { ...mergedOptions },

    sample(input = {}) {
      return sampleTerrainDetail(input, mergedOptions);
    },

    sampleTerrainDetail(input = {}) {
      return sampleTerrainDetail(input, mergedOptions);
    },

    getStatus() {
      return getHEarthCanvasTerrainDetailStatus();
    },

    getHEarthCanvasTerrainDetailStatus() {
      return getHEarthCanvasTerrainDetailStatus();
    }
  };
}

function getHEarthCanvasTerrainDetailStatus() {
  return {
    ...DETAIL_STATUS,
    requiredExports: [
      "createHEarthCanvasTerrainDetail",
      "sampleTerrainDetail",
      "getHEarthCanvasTerrainDetailStatus"
    ],
    outputMode: "plain-data-only",
    deterministic: true,
    parentMutationAuthorized: false,
    truthMutationAuthorized: false,
    groundLevelAuthorized: false,
    estatePlacementAuthorized: false
  };
}

export {
  H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
  H_EARTH_CANVAS_TERRAIN_DETAIL_PREVIOUS,
  H_EARTH_CANVAS_TERRAIN_DETAIL_SCOPE,
  createHEarthCanvasTerrainDetail,
  sampleTerrainDetail,
  getHEarthCanvasTerrainDetailStatus
};

export default {
  contract: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
  receipt: H_EARTH_CANVAS_TERRAIN_DETAIL_CONTRACT,
  previous: H_EARTH_CANVAS_TERRAIN_DETAIL_PREVIOUS,
  scope: H_EARTH_CANVAS_TERRAIN_DETAIL_SCOPE,
  create: createHEarthCanvasTerrainDetail,
  createHEarthCanvasTerrainDetail,
  sample: sampleTerrainDetail,
  sampleTerrainDetail,
  status: getHEarthCanvasTerrainDetailStatus,
  getStatus: getHEarthCanvasTerrainDetailStatus,
  getHEarthCanvasTerrainDetailStatus
};
