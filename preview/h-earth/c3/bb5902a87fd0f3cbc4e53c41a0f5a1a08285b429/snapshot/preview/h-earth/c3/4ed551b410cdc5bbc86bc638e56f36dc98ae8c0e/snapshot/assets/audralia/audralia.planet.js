// /assets/audralia/audralia.planet.js
// AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1
// Full-file construction.
//
// Purpose:
// - Define the first canonical three-dimensional geometry authority for Audralia.
// - Generate a seamless geodesic planet without latitude-longitude seam ownership.
// - Produce deterministic terrain, seabed, coast, island, summit, hydrology,
//   ocean, cloud, and atmosphere geometry for downstream renderers.
//
// Owns:
// - canonical Audralia world seed
// - geodesic base topology
// - four macro land systems
// - sixteen primary land bodies
// - sixty-four island-cluster anchors
// - two-hundred-fifty-six micro-island influence points
// - nine summit-region anchors
// - deterministic terrain and seabed elevation
// - coast, shelf, basin, lake, inland-sea, and river classification
// - terrain, ocean, cloud, and atmosphere geometry packets
// - geometry metrics, bounds, validation, and receipt globals
//
// Does not own:
// - WebGL, Canvas, shaders, GPU buffers, cameras, lights, or animation
// - DOM mounting, public route coordination, controls, or CSS
// - product-engine adapter authority
// - F34, F55, F89, F144, F233, market, or North authority
// - final visual acceptance
// - Earth, Australia, or schoolroom-globe geography

(function installAudraliaPlanetGeometry(root) {
  "use strict";

  const CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  const RECEIPT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_RECEIPT_v1";

  const FILE = "/assets/audralia/audralia.planet.js";
  const VERSION = "1.0.0";
  const MODEL_ID = "audralia-planet-3d-g1";
  const WORLD_SEED = "AUDRALIA_G1_WORLD_SEED";

  const REFERENCE_RADIUS = 1.0;
  const CLOUD_RADIUS = 1.012;
  const ATMOSPHERE_RADIUS = 1.035;
  const MIN_TERRAIN_RADIUS = 0.965;
  const MAX_TERRAIN_RADIUS = 1.04;
  const TARGET_LAND_COVERAGE = 0.30;
  const COAST_SCORE_WIDTH = 0.075;

  const DETAIL_LEVELS = Object.freeze({
    atmosphere: 4,
    mobile: 5,
    desktop: 6,
    ocean: 5,
    clouds: 5
  });

  const WATER_CLASS = Object.freeze({
    NONE: 0,
    DEEP_OCEAN: 1,
    OPEN_OCEAN: 2,
    SHELF_WATER: 3,
    COASTAL_WATER: 4,
    INLAND_SEA: 5,
    LAKE: 6,
    CHANNEL: 7,
    RIVER_PATH: 8
  });

  const TERRAIN_CLASS = Object.freeze({
    DEEP_BASIN: 0,
    OCEAN_FLOOR: 1,
    CONTINENTAL_SHELF: 2,
    COAST: 3,
    LOWLAND: 4,
    UPLAND: 5,
    PLATEAU: 6,
    MOUNTAIN: 7,
    SUMMIT: 8,
    LAKE_BED: 9,
    INLAND_SEA_BED: 10
  });

  const MATERIAL_HINT = Object.freeze({
    DEEP_OCEAN: 0,
    OPEN_OCEAN: 1,
    SHELF: 2,
    COAST: 3,
    BEACH: 4,
    LOWLAND: 5,
    FOREST: 6,
    ARID: 7,
    UPLAND: 8,
    ROCK: 9,
    SNOW: 10,
    LAKE: 11,
    INLAND_SEA: 12
  });

  const state = {
    installedAt: nowIso(),
    updatedAt: "",

    topologyReady: false,
    thresholdReady: false,
    geometryReady: false,
    validationReady: false,

    landThreshold: 0,
    calibratedLandCoverage: 0,

    topologyHash: "",
    geometryHash: "",

    lastOptions: null,
    lastMetrics: null,
    lastValidation: null,
    lastReceipt: null,

    terrainCache: new Map(),
    shellCache: new Map(),
    geometryCache: new Map(),

    errors: [],
    events: []
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, safeNumber(value, minimum)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) {
      return value < edge0 ? 0 : 1;
    }

    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function smootherstep(edge0, edge1, value) {
    if (edge0 === edge1) {
      return value < edge0 ? 0 : 1;
    }

    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function clonePlain(value) {
    if (value === undefined) {
      return undefined;
    }

    if (ArrayBuffer.isView(value)) {
      return value.slice ? value.slice() : new value.constructor(value);
    }

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) {
        return value.map(clonePlain);
      }

      if (isObject(value)) {
        const copy = {};

        for (const [key, item] of Object.entries(value)) {
          if (typeof item !== "function") {
            copy[key] = clonePlain(item);
          }
        }

        return copy;
      }

      return value;
    }
  }

  function stableSortObject(value) {
    if (Array.isArray(value)) {
      return value.map(stableSortObject);
    }

    if (!isObject(value)) {
      return value;
    }

    const output = {};

    for (const key of Object.keys(value).sort()) {
      output[key] = stableSortObject(value[key]);
    }

    return output;
  }

  function stableStringify(value) {
    return JSON.stringify(stableSortObject(value));
  }

  function fnv1a(text) {
    let hash = 0x811c9dc5;

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }

    return `fnv1a32-${hash.toString(16).padStart(8, "0")}`;
  }

  function xmur3(text) {
    let hash = 1779033703 ^ text.length;

    for (let index = 0; index < text.length; index += 1) {
      hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }

    return function nextSeed() {
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      hash ^= hash >>> 16;
      return hash >>> 0;
    };
  }

  function mulberry32(seed) {
    let value = seed >>> 0;

    return function random() {
      value += 0x6d2b79f5;

      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);

      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededRandom(label) {
    const makeSeed = xmur3(`${WORLD_SEED}:${label}`);
    return mulberry32(makeSeed());
  }

  function recordEvent(type, detail = {}) {
    const event = {
      type,
      detail: clonePlain(detail),
      time: nowIso()
    };

    state.events.push(event);

    if (state.events.length > 128) {
      state.events.splice(0, state.events.length - 128);
    }

    state.updatedAt = event.time;
    return clonePlain(event);
  }

  function recordError(scope, error) {
    const entry = {
      scope,
      message: error && error.message ? error.message : String(error),
      time: nowIso()
    };

    state.errors.push(entry);

    if (state.errors.length > 64) {
      state.errors.splice(0, state.errors.length - 64);
    }

    recordEvent("AUDRALIA_PLANET_GEOMETRY_ERROR", entry);
    publishGlobals();

    return clonePlain(entry);
  }

  function dispatch(name, detail) {
    if (!root || typeof root.dispatchEvent !== "function") {
      return false;
    }

    try {
      if (typeof root.CustomEvent === "function") {
        root.dispatchEvent(
          new root.CustomEvent(name, {
            detail: clonePlain(detail)
          })
        );

        return true;
      }
    } catch (_error) {}

    return false;
  }

  function add3(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  function sub3(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function scale3(a, scalar) {
    return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function length3(a) {
    return Math.hypot(a[0], a[1], a[2]);
  }

  function normalize3(a, fallback = [0, 1, 0]) {
    const length = length3(a);

    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }

    return [a[0] / length, a[1] / length, a[2] / length];
  }

  function degreesToRadians(value) {
    return value * Math.PI / 180;
  }

  function latLonToDirection(latitudeDegrees, longitudeDegrees) {
    const latitude = degreesToRadians(latitudeDegrees);
    const longitude = degreesToRadians(longitudeDegrees);
    const cosineLatitude = Math.cos(latitude);

    return normalize3([
      cosineLatitude * Math.cos(longitude),
      Math.sin(latitude),
      cosineLatitude * Math.sin(longitude)
    ]);
  }

  function tangentBasis(direction) {
    const normal = normalize3(direction);
    const reference = Math.abs(normal[1]) < 0.92 ? [0, 1, 0] : [1, 0, 0];
    const tangent = normalize3(cross3(reference, normal), [1, 0, 0]);
    const bitangent = normalize3(cross3(normal, tangent), [0, 0, 1]);

    return { tangent, bitangent };
  }

  function offsetOnSphere(direction, angle, azimuth) {
    const center = normalize3(direction);
    const basis = tangentBasis(center);

    const radial = add3(
      scale3(basis.tangent, Math.cos(azimuth)),
      scale3(basis.bitangent, Math.sin(azimuth))
    );

    return normalize3(
      add3(
        scale3(center, Math.cos(angle)),
        scale3(radial, Math.sin(angle))
      )
    );
  }

  function angularDistance(a, b) {
    return Math.acos(clamp(dot3(a, b), -1, 1));
  }

  function anchorInfluence(direction, anchor) {
    const distance = angularDistance(direction, anchor.direction);
    const normalized = distance / Math.max(anchor.radius, 1e-5);

    if (normalized >= 1) {
      return 0;
    }

    return smootherstep(0, 1, 1 - normalized) * anchor.strength;
  }

  function hashInt3(x, y, z, seed = 0) {
    let hash = seed >>> 0;

    hash ^= Math.imul(x | 0, 374761393);
    hash = (hash << 13) | (hash >>> 19);

    hash ^= Math.imul(y | 0, 668265263);
    hash = (hash << 11) | (hash >>> 21);

    hash ^= Math.imul(z | 0, 2246822519);
    hash = Math.imul(hash ^ (hash >>> 15), 3266489917);

    return (hash ^ (hash >>> 16)) >>> 0;
  }

  function hashUnit3(x, y, z, seed = 0) {
    return hashInt3(x, y, z, seed) / 4294967295;
  }

  function fade(value) {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  function valueNoise3(x, y, z, seed = 0) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const z0 = Math.floor(z);

    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const z1 = z0 + 1;

    const tx = fade(x - x0);
    const ty = fade(y - y0);
    const tz = fade(z - z0);

    const n000 = hashUnit3(x0, y0, z0, seed);
    const n100 = hashUnit3(x1, y0, z0, seed);
    const n010 = hashUnit3(x0, y1, z0, seed);
    const n110 = hashUnit3(x1, y1, z0, seed);
    const n001 = hashUnit3(x0, y0, z1, seed);
    const n101 = hashUnit3(x1, y0, z1, seed);
    const n011 = hashUnit3(x0, y1, z1, seed);
    const n111 = hashUnit3(x1, y1, z1, seed);

    const nx00 = lerp(n000, n100, tx);
    const nx10 = lerp(n010, n110, tx);
    const nx01 = lerp(n001, n101, tx);
    const nx11 = lerp(n011, n111, tx);

    const nxy0 = lerp(nx00, nx10, ty);
    const nxy1 = lerp(nx01, nx11, ty);

    return lerp(nxy0, nxy1, tz) * 2 - 1;
  }

  function fbm3(x, y, z, options = {}) {
    const octaves = Math.max(1, Math.floor(safeNumber(options.octaves, 5)));
    const lacunarity = safeNumber(options.lacunarity, 2.03);
    const gain = safeNumber(options.gain, 0.5);
    const seed = Math.floor(safeNumber(options.seed, 0));

    let frequency = safeNumber(options.frequency, 1);
    let amplitude = 1;
    let total = 0;
    let normalization = 0;

    for (let octave = 0; octave < octaves; octave += 1) {
      total += valueNoise3(
        x * frequency,
        y * frequency,
        z * frequency,
        seed + octave * 1013
      ) * amplitude;

      normalization += amplitude;
      frequency *= lacunarity;
      amplitude *= gain;
    }

    return normalization > 0 ? total / normalization : 0;
  }

  function ridgedFbm3(x, y, z, options = {}) {
    return 1 - Math.abs(fbm3(x, y, z, options));
  }

  function warpedDirection(direction) {
    const amount = 0.10;
    const frequency = 1.55;

    const wx = fbm3(
      direction[0] + 17.3,
      direction[1] - 4.7,
      direction[2] + 9.1,
      { octaves: 3, frequency, gain: 0.52, seed: 911 }
    );

    const wy = fbm3(
      direction[0] - 7.9,
      direction[1] + 13.2,
      direction[2] - 3.4,
      { octaves: 3, frequency, gain: 0.52, seed: 1777 }
    );

    const wz = fbm3(
      direction[0] + 2.8,
      direction[1] + 5.6,
      direction[2] + 21.4,
      { octaves: 3, frequency, gain: 0.52, seed: 2729 }
    );

    return normalize3([
      direction[0] + wx * amount,
      direction[1] + wy * amount,
      direction[2] + wz * amount
    ]);
  }

  function buildTopology() {
    const macroSpecifications = [
      {
        id: 0,
        name: "Aster Reach",
        latitude: 27,
        longitude: -28,
        radius: 0.86,
        strength: 1.05
      },
      {
        id: 1,
        name: "Veyra Arc",
        latitude: 8,
        longitude: 116,
        radius: 0.78,
        strength: 0.98
      },
      {
        id: 2,
        name: "Lumen Belt",
        latitude: -17,
        longitude: -132,
        radius: 0.74,
        strength: 0.92
      },
      {
        id: 3,
        name: "Sable Crown",
        latitude: -43,
        longitude: 48,
        radius: 0.72,
        strength: 0.96
      }
    ];

    const macroLandSystems = macroSpecifications.map(specification => ({
      id: specification.id,
      name: specification.name,
      direction: latLonToDirection(
        specification.latitude,
        specification.longitude
      ),
      radius: specification.radius,
      strength: specification.strength
    }));

    const primaryLandBodies = [];

    for (const macro of macroLandSystems) {
      const random = seededRandom(`primary:${macro.id}`);

      for (let localIndex = 0; localIndex < 4; localIndex += 1) {
        const azimuth =
          localIndex * Math.PI * 0.5 +
          (random() - 0.5) * 0.58;

        const angle = 0.16 + random() * 0.28;
        const radius = 0.31 + random() * 0.16;
        const strength = 0.77 + random() * 0.20;
        const id = macro.id * 4 + localIndex;

        primaryLandBodies.push({
          id,
          macroId: macro.id,
          name: `${macro.name} Body ${localIndex + 1}`,
          direction: offsetOnSphere(macro.direction, angle, azimuth),
          radius,
          strength,
          elongation: 0.72 + random() * 0.55,
          twist: random() * Math.PI * 2
        });
      }
    }

    const islandClusters = [];

    for (const primary of primaryLandBodies) {
      const random = seededRandom(`island:${primary.id}`);

      for (let localIndex = 0; localIndex < 4; localIndex += 1) {
        const azimuth =
          localIndex * Math.PI * 0.5 +
          (random() - 0.5) * 0.88;

        const angle = primary.radius * (0.78 + random() * 0.62);
        const radius = 0.055 + random() * 0.052;
        const strength = 0.34 + random() * 0.18;
        const id = primary.id * 4 + localIndex;

        islandClusters.push({
          id,
          primaryId: primary.id,
          macroId: primary.macroId,
          direction: offsetOnSphere(primary.direction, angle, azimuth),
          radius,
          strength
        });
      }
    }

    const microIslandInfluences = [];

    for (const cluster of islandClusters) {
      const random = seededRandom(`micro:${cluster.id}`);

      for (let localIndex = 0; localIndex < 4; localIndex += 1) {
        const azimuth = random() * Math.PI * 2;
        const angle = cluster.radius * (0.55 + random() * 1.35);
        const radius = 0.016 + random() * 0.022;
        const strength = 0.12 + random() * 0.12;
        const id = cluster.id * 4 + localIndex;

        microIslandInfluences.push({
          id,
          clusterId: cluster.id,
          primaryId: cluster.primaryId,
          macroId: cluster.macroId,
          direction: offsetOnSphere(cluster.direction, angle, azimuth),
          radius,
          strength
        });
      }
    }

    const summitPrimaryIds = [0, 2, 5, 7, 8, 10, 12, 14, 15];

    const summitAnchors = summitPrimaryIds.map((primaryId, index) => {
      const primary = primaryLandBodies[primaryId];
      const random = seededRandom(`summit:${index}`);

      return {
        id: index,
        primaryId,
        macroId: primary.macroId,
        direction: offsetOnSphere(
          primary.direction,
          0.035 + random() * 0.085,
          random() * Math.PI * 2
        ),
        radius: 0.075 + random() * 0.055,
        strength: 0.86 + random() * 0.14,
        reliefType: [
          "dominant-mountain",
          "mountain-range",
          "raised-plateau",
          "high-island-system",
          "volcanic-ridge",
          "basin-rim"
        ][index % 6]
      };
    });

    const lakePrimaryIds = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 15];

    const lakeAnchors = lakePrimaryIds.map((primaryId, index) => {
      const primary = primaryLandBodies[primaryId];
      const random = seededRandom(`lake:${index}`);

      return {
        id: index,
        primaryId,
        macroId: primary.macroId,
        direction: offsetOnSphere(
          primary.direction,
          0.025 + random() * 0.10,
          random() * Math.PI * 2
        ),
        radius: 0.026 + random() * 0.032,
        strength: 0.70 + random() * 0.22,
        inlandSea: index % 5 === 0
      };
    });

    const basinAnchors = [
      { latitude: 48, longitude: 62, radius: 0.56, strength: 0.25 },
      { latitude: -7, longitude: -58, radius: 0.48, strength: 0.23 },
      { latitude: 39, longitude: -151, radius: 0.44, strength: 0.20 },
      { latitude: -52, longitude: -62, radius: 0.40, strength: 0.18 },
      { latitude: 4, longitude: 12, radius: 0.36, strength: 0.16 },
      { latitude: -28, longitude: 154, radius: 0.38, strength: 0.17 }
    ].map((specification, index) => ({
      id: index,
      direction: latLonToDirection(
        specification.latitude,
        specification.longitude
      ),
      radius: specification.radius,
      strength: specification.strength
    }));

    const topology = {
      contract: CONTRACT,
      worldSeed: WORLD_SEED,
      macroLandSystems,
      primaryLandBodies,
      islandClusters,
      microIslandInfluences,
      summitAnchors,
      lakeAnchors,
      basinAnchors,
      counts: {
        macroLandSystems: macroLandSystems.length,
        primaryLandBodies: primaryLandBodies.length,
        islandClusters: islandClusters.length,
        microIslandInfluences: microIslandInfluences.length,
        summitAnchors: summitAnchors.length,
        lakeAnchors: lakeAnchors.length,
        basinAnchors: basinAnchors.length
      }
    };

    topology.hash = fnv1a(
      stableStringify({
        worldSeed: topology.worldSeed,
        macroLandSystems: topology.macroLandSystems,
        primaryLandBodies: topology.primaryLandBodies,
        islandClusters: topology.islandClusters,
        microIslandInfluences: topology.microIslandInfluences,
        summitAnchors: topology.summitAnchors,
        lakeAnchors: topology.lakeAnchors,
        basinAnchors: topology.basinAnchors
      })
    );

    return topology;
  }

  const topology = buildTopology();

  state.topologyReady = true;
  state.topologyHash = topology.hash;

  function anisotropicInfluence(direction, anchor) {
    const basis = tangentBasis(anchor.direction);

    const relative = sub3(
      direction,
      scale3(anchor.direction, dot3(direction, anchor.direction))
    );

    const tangentCoordinate = dot3(relative, basis.tangent);
    const bitangentCoordinate = dot3(relative, basis.bitangent);

    const cosine = Math.cos(anchor.twist || 0);
    const sine = Math.sin(anchor.twist || 0);

    const rotatedX = tangentCoordinate * cosine - bitangentCoordinate * sine;
    const rotatedY = tangentCoordinate * sine + bitangentCoordinate * cosine;
    const elongation = Math.max(0.45, anchor.elongation || 1);

    const distance = Math.hypot(
      rotatedX / elongation,
      rotatedY * elongation
    );

    const normalized = distance / Math.max(anchor.radius, 1e-5);

    if (normalized >= 1) {
      return 0;
    }

    return smootherstep(0, 1, 1 - normalized) * anchor.strength;
  }

  function maximumInfluence(direction, anchors, anisotropic = false) {
    let maximum = 0;
    let bestId = -1;

    for (const anchor of anchors) {
      const influence = anisotropic
        ? anisotropicInfluence(direction, anchor)
        : anchorInfluence(direction, anchor);

      if (influence > maximum) {
        maximum = influence;
        bestId = anchor.id;
      }
    }

    return {
      value: maximum,
      id: bestId
    };
  }

  function basinSubtraction(direction) {
    let total = 0;

    for (const basin of topology.basinAnchors) {
      total = Math.max(total, anchorInfluence(direction, basin));
    }

    return total;
  }

  function rawLandPotential(inputDirection) {
    const direction = normalize3(inputDirection);
    const warped = warpedDirection(direction);

    const macro = maximumInfluence(
      warped,
      topology.macroLandSystems,
      false
    );

    const primary = maximumInfluence(
      warped,
      topology.primaryLandBodies,
      true
    );

    const island = maximumInfluence(
      warped,
      topology.islandClusters,
      false
    );

    const micro = maximumInfluence(
      warped,
      topology.microIslandInfluences,
      false
    );

    const continentalNoise = fbm3(
      warped[0],
      warped[1],
      warped[2],
      {
        octaves: 5,
        frequency: 1.2,
        gain: 0.54,
        seed: 3001
      }
    );

    const coastlineNoise = fbm3(
      warped[0],
      warped[1],
      warped[2],
      {
        octaves: 4,
        frequency: 5.8,
        gain: 0.5,
        seed: 6121
      }
    );

    const polarModeration = Math.pow(Math.abs(direction[1]), 3.2) * 0.10;
    const basin = basinSubtraction(warped);

    const score =
      macro.value * 0.49 +
      primary.value * 0.54 +
      island.value * 0.42 +
      micro.value * 0.28 +
      continentalNoise * 0.13 +
      coastlineNoise * 0.055 -
      basin * 0.72 -
      polarModeration;

    return {
      score,
      macroId: macro.id,
      primaryId: primary.id,
      islandId: island.id,
      microId: micro.id,
      continentalNoise,
      coastlineNoise,
      basin
    };
  }

  function fibonacciDirection(index, count) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - ((index + 0.5) / count) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;

    return [
      Math.cos(theta) * radius,
      y,
      Math.sin(theta) * radius
    ];
  }

  function calibrateLandThreshold(sampleCount = 8192) {
    const scores = new Float64Array(sampleCount);

    for (let index = 0; index < sampleCount; index += 1) {
      scores[index] = rawLandPotential(
        fibonacciDirection(index, sampleCount)
      ).score;
    }

    const sorted = Array.from(scores).sort((a, b) => a - b);
    const thresholdIndex = Math.floor(
      (1 - TARGET_LAND_COVERAGE) * (sorted.length - 1)
    );

    const threshold = sorted[thresholdIndex];
    let landCount = 0;

    for (const score of scores) {
      if (score >= threshold) {
        landCount += 1;
      }
    }

    state.landThreshold = threshold;
    state.calibratedLandCoverage = landCount / sampleCount;
    state.thresholdReady = true;

    recordEvent("AUDRALIA_LAND_THRESHOLD_CALIBRATED", {
      sampleCount,
      threshold,
      landCoverage: state.calibratedLandCoverage
    });

    return threshold;
  }

  calibrateLandThreshold();

  function nearestSummitInfluence(direction) {
    let maximum = 0;
    let summitId = -1;

    for (const summit of topology.summitAnchors) {
      const influence = anchorInfluence(direction, summit);

      if (influence > maximum) {
        maximum = influence;
        summitId = summit.id;
      }
    }

    return {
      value: maximum,
      id: summitId
    };
  }

  function nearestLakeInfluence(direction) {
    let maximum = 0;
    let lake = null;

    for (const anchor of topology.lakeAnchors) {
      const influence = anchorInfluence(direction, anchor);

      if (influence > maximum) {
        maximum = influence;
        lake = anchor;
      }
    }

    return {
      value: maximum,
      lake
    };
  }

  function classifyWaterAndTerrain(delta, lakeField, radius, summitInfluence) {
    let waterClass = WATER_CLASS.NONE;
    let terrainClass = TERRAIN_CLASS.LOWLAND;

    if (
      lakeField.lake &&
      lakeField.value > 0.63 &&
      delta > 0.02
    ) {
      if (lakeField.lake.inlandSea && lakeField.value > 0.72) {
        waterClass = WATER_CLASS.INLAND_SEA;
        terrainClass = TERRAIN_CLASS.INLAND_SEA_BED;
      } else {
        waterClass = WATER_CLASS.LAKE;
        terrainClass = TERRAIN_CLASS.LAKE_BED;
      }

      return {
        waterClass,
        terrainClass
      };
    }

    if (delta < 0) {
      if (radius <= 0.979) {
        waterClass = WATER_CLASS.DEEP_OCEAN;
        terrainClass = TERRAIN_CLASS.DEEP_BASIN;
      } else if (radius <= 0.992) {
        waterClass = WATER_CLASS.OPEN_OCEAN;
        terrainClass = TERRAIN_CLASS.OCEAN_FLOOR;
      } else if (radius <= 0.9987) {
        waterClass = WATER_CLASS.SHELF_WATER;
        terrainClass = TERRAIN_CLASS.CONTINENTAL_SHELF;
      } else {
        waterClass = WATER_CLASS.COASTAL_WATER;
        terrainClass = TERRAIN_CLASS.COAST;
      }

      return {
        waterClass,
        terrainClass
      };
    }

    if (radius < 1.0028) {
      terrainClass = TERRAIN_CLASS.COAST;
    } else if (summitInfluence > 0.80 || radius >= 1.035) {
      terrainClass = TERRAIN_CLASS.SUMMIT;
    } else if (radius >= 1.024) {
      terrainClass = TERRAIN_CLASS.MOUNTAIN;
    } else if (radius >= 1.015) {
      terrainClass = TERRAIN_CLASS.PLATEAU;
    } else if (radius >= 1.008) {
      terrainClass = TERRAIN_CLASS.UPLAND;
    } else {
      terrainClass = TERRAIN_CLASS.LOWLAND;
    }

    return {
      waterClass,
      terrainClass
    };
  }

  function selectMaterialHint(classification, radius, moisture, temperature) {
    if (classification.waterClass === WATER_CLASS.DEEP_OCEAN) {
      return MATERIAL_HINT.DEEP_OCEAN;
    }

    if (classification.waterClass === WATER_CLASS.OPEN_OCEAN) {
      return MATERIAL_HINT.OPEN_OCEAN;
    }

    if (
      classification.waterClass === WATER_CLASS.SHELF_WATER ||
      classification.waterClass === WATER_CLASS.COASTAL_WATER
    ) {
      return MATERIAL_HINT.SHELF;
    }

    if (classification.waterClass === WATER_CLASS.LAKE) {
      return MATERIAL_HINT.LAKE;
    }

    if (classification.waterClass === WATER_CLASS.INLAND_SEA) {
      return MATERIAL_HINT.INLAND_SEA;
    }

    if (classification.terrainClass === TERRAIN_CLASS.COAST) {
      return moisture > 0.08 ? MATERIAL_HINT.BEACH : MATERIAL_HINT.COAST;
    }

    if (classification.terrainClass === TERRAIN_CLASS.SUMMIT) {
      return temperature < -0.12 || radius > 1.037
        ? MATERIAL_HINT.SNOW
        : MATERIAL_HINT.ROCK;
    }

    if (classification.terrainClass === TERRAIN_CLASS.MOUNTAIN) {
      return MATERIAL_HINT.ROCK;
    }

    if (
      classification.terrainClass === TERRAIN_CLASS.UPLAND ||
      classification.terrainClass === TERRAIN_CLASS.PLATEAU
    ) {
      return MATERIAL_HINT.UPLAND;
    }

    if (moisture > 0.12) {
      return MATERIAL_HINT.FOREST;
    }

    if (moisture < -0.18 && temperature > -0.28) {
      return MATERIAL_HINT.ARID;
    }

    return MATERIAL_HINT.LOWLAND;
  }

  function sampleSurfaceCore(inputDirection) {
    const direction = normalize3(inputDirection);
    const raw = rawLandPotential(direction);
    const delta = raw.score - state.landThreshold;
    const coastDistance = delta / COAST_SCORE_WIDTH;
    const landMask = delta >= 0 ? 1 : 0;

    const summit = nearestSummitInfluence(direction);
    const lake = nearestLakeInfluence(direction);

    const continentalRelief = fbm3(
      direction[0],
      direction[1],
      direction[2],
      {
        octaves: 5,
        frequency: 2.0,
        gain: 0.52,
        seed: 8429
      }
    );

    const fineRelief = fbm3(
      direction[0],
      direction[1],
      direction[2],
      {
        octaves: 4,
        frequency: 11.5,
        gain: 0.47,
        seed: 12919
      }
    );

    const ridge = ridgedFbm3(
      direction[0],
      direction[1],
      direction[2],
      {
        octaves: 5,
        frequency: 4.1,
        gain: 0.52,
        seed: 17011
      }
    );

    const moisture = fbm3(
      direction[0],
      direction[1],
      direction[2],
      {
        octaves: 4,
        frequency: 3.0,
        gain: 0.5,
        seed: 22003
      }
    );

    const temperature =
      1 - Math.abs(direction[1]) * 1.45 + continentalRelief * 0.14;

    let radius;

    if (landMask) {
      const coastRise = smoothstep(0, 0.13, delta);
      const inlandRise = smoothstep(0.02, 0.38, delta);
      const plateau = smoothstep(0.34, 0.72, ridge) * inlandRise;

      const mountain = Math.pow(
        smoothstep(0.46, 0.94, ridge),
        1.8
      ) * inlandRise;

      const summitRelief = Math.pow(summit.value, 1.65);

      radius =
        1.0018 +
        coastRise * 0.0035 +
        inlandRise * (0.0048 + continentalRelief * 0.0032) +
        plateau * 0.0065 +
        mountain * 0.0105 +
        summitRelief * 0.0175 +
        fineRelief * 0.0015;

      if (
        lake.lake &&
        lake.value > 0.63 &&
        delta > 0.02
      ) {
        const depression = smoothstep(0.63, 0.95, lake.value);

        radius = Math.min(
          radius,
          lake.lake.inlandSea
            ? 0.9968 - depression * 0.0014
            : 0.9985 - depression * 0.0010
        );
      }
    } else {
      const shelf = smoothstep(-0.10, 0, delta);
      const deepness = smoothstep(-0.58, -0.08, -delta);
      const basin = raw.basin;

      radius =
        0.9968 +
        shelf * 0.0026 -
        deepness * 0.0165 -
        basin * 0.0135 +
        continentalRelief * 0.0022 +
        fineRelief * 0.0013;
    }

    radius = clamp(radius, MIN_TERRAIN_RADIUS, MAX_TERRAIN_RADIUS);

    const classification = classifyWaterAndTerrain(
      delta,
      lake,
      radius,
      summit.value
    );

    const materialHint = selectMaterialHint(
      classification,
      radius,
      moisture,
      temperature
    );

    const curvatureHint = clamp(
      (ridge - 0.5) * 1.6 + fineRelief * 0.35,
      -1,
      1
    );

    return {
      direction,
      radius,
      elevation: radius - REFERENCE_RADIUS,
      landScore: raw.score,
      landMask,
      coastDistance,
      waterClass: classification.waterClass,
      terrainClass: classification.terrainClass,
      macroRegionId: raw.macroId,
      primaryBodyId: raw.primaryId,
      summitInfluence: summit.value,
      summitId: summit.id,
      materialHint,
      moisture,
      temperature,
      curvatureHint
    };
  }

  function createBaseIcosahedron() {
    const t = (1 + Math.sqrt(5)) / 2;

    const vertices = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1]
    ].map(vertex => normalize3(vertex));

    const faces = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],

      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],

      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],

      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1]
    ];

    return {
      vertices,
      faces
    };
  }

  function createUnitIcosphere(level) {
    const subdivisionLevel = Math.max(
      0,
      Math.min(6, Math.floor(safeNumber(level, 5)))
    );

    const base = createBaseIcosahedron();
    const vertices = base.vertices.slice();
    let faces = base.faces.map(face => face.slice());

    for (
      let subdivision = 0;
      subdivision < subdivisionLevel;
      subdivision += 1
    ) {
      const midpointCache = new Map();
      const nextFaces = [];

      function midpointIndex(aIndex, bIndex) {
        const minimum = Math.min(aIndex, bIndex);
        const maximum = Math.max(aIndex, bIndex);
        const key = `${minimum}:${maximum}`;

        if (midpointCache.has(key)) {
          return midpointCache.get(key);
        }

        const midpoint = normalize3([
          (vertices[aIndex][0] + vertices[bIndex][0]) * 0.5,
          (vertices[aIndex][1] + vertices[bIndex][1]) * 0.5,
          (vertices[aIndex][2] + vertices[bIndex][2]) * 0.5
        ]);

        const index = vertices.length;
        vertices.push(midpoint);
        midpointCache.set(key, index);

        return index;
      }

      for (const face of faces) {
        const a = face[0];
        const b = face[1];
        const c = face[2];

        const ab = midpointIndex(a, b);
        const bc = midpointIndex(b, c);
        const ca = midpointIndex(c, a);

        nextFaces.push(
          [a, ab, ca],
          [b, bc, ab],
          [c, ca, bc],
          [ab, bc, ca]
        );
      }

      faces = nextFaces;
    }

    const directions = new Float32Array(vertices.length * 3);

    for (let index = 0; index < vertices.length; index += 1) {
      const vertex = vertices[index];
      directions[index * 3] = vertex[0];
      directions[index * 3 + 1] = vertex[1];
      directions[index * 3 + 2] = vertex[2];
    }

    const IndexArray = vertices.length > 65535 ? Uint32Array : Uint16Array;
    const indices = new IndexArray(faces.length * 3);

    for (let index = 0; index < faces.length; index += 1) {
      const face = faces[index];
      indices[index * 3] = face[0];
      indices[index * 3 + 1] = face[1];
      indices[index * 3 + 2] = face[2];
    }

    return {
      level: subdivisionLevel,
      vertexCount: vertices.length,
      triangleCount: faces.length,
      directions,
      indices
    };
  }

  function recalculateNormals(positions, indices) {
    const normals = new Float32Array(positions.length);

    for (let index = 0; index < indices.length; index += 3) {
      const ia = indices[index] * 3;
      const ib = indices[index + 1] * 3;
      const ic = indices[index + 2] * 3;

      const a = [positions[ia], positions[ia + 1], positions[ia + 2]];
      const b = [positions[ib], positions[ib + 1], positions[ib + 2]];
      const c = [positions[ic], positions[ic + 1], positions[ic + 2]];

      const normal = cross3(sub3(b, a), sub3(c, a));

      normals[ia] += normal[0];
      normals[ia + 1] += normal[1];
      normals[ia + 2] += normal[2];

      normals[ib] += normal[0];
      normals[ib + 1] += normal[1];
      normals[ib + 2] += normal[2];

      normals[ic] += normal[0];
      normals[ic + 1] += normal[1];
      normals[ic + 2] += normal[2];
    }

    for (let index = 0; index < normals.length; index += 3) {
      const normal = normalize3([
        normals[index],
        normals[index + 1],
        normals[index + 2]
      ]);

      normals[index] = normal[0];
      normals[index + 1] = normal[1];
      normals[index + 2] = normal[2];
    }

    return normals;
  }

  function computeBounds(positions) {
    const minimum = [Infinity, Infinity, Infinity];
    const maximum = [-Infinity, -Infinity, -Infinity];

    let minimumRadius = Infinity;
    let maximumRadius = 0;

    for (let index = 0; index < positions.length; index += 3) {
      const x = positions[index];
      const y = positions[index + 1];
      const z = positions[index + 2];
      const radius = Math.hypot(x, y, z);

      minimum[0] = Math.min(minimum[0], x);
      minimum[1] = Math.min(minimum[1], y);
      minimum[2] = Math.min(minimum[2], z);

      maximum[0] = Math.max(maximum[0], x);
      maximum[1] = Math.max(maximum[1], y);
      maximum[2] = Math.max(maximum[2], z);

      minimumRadius = Math.min(minimumRadius, radius);
      maximumRadius = Math.max(maximumRadius, radius);
    }

    return {
      minimum,
      maximum,
      center: [0, 0, 0],
      minimumRadius,
      maximumRadius,
      boundingRadius: maximumRadius
    };
  }

  function hashTerrainMesh(mesh) {
    const sampleCount = Math.min(mesh.vertexCount, 2048);
    const stride = Math.max(1, Math.floor(mesh.vertexCount / sampleCount));

    let text = `${mesh.level}:${mesh.vertexCount}:${mesh.triangleCount}:`;

    for (
      let vertexIndex = 0;
      vertexIndex < mesh.vertexCount;
      vertexIndex += stride
    ) {
      const offset = vertexIndex * 3;

      text +=
        `${mesh.positions[offset].toFixed(6)},` +
        `${mesh.positions[offset + 1].toFixed(6)},` +
        `${mesh.positions[offset + 2].toFixed(6)};`;
    }

    return fnv1a(text);
  }

  function createTerrainMesh(level = DETAIL_LEVELS.desktop) {
    const subdivisionLevel = Math.max(
      0,
      Math.min(6, Math.floor(safeNumber(level, DETAIL_LEVELS.desktop)))
    );

    if (state.terrainCache.has(subdivisionLevel)) {
      return state.terrainCache.get(subdivisionLevel);
    }

    const sphere = createUnitIcosphere(subdivisionLevel);
    const vertexCount = sphere.vertexCount;

    const positions = new Float32Array(vertexCount * 3);
    const elevations = new Float32Array(vertexCount);
    const slopes = new Float32Array(vertexCount);
    const curvatures = new Float32Array(vertexCount);
    const landScores = new Float32Array(vertexCount);
    const landMasks = new Uint8Array(vertexCount);
    const coastDistances = new Float32Array(vertexCount);
    const waterClasses = new Uint8Array(vertexCount);
    const terrainClasses = new Uint8Array(vertexCount);
    const macroRegionIds = new Uint8Array(vertexCount);
    const primaryBodyIds = new Uint8Array(vertexCount);
    const summitIds = new Int8Array(vertexCount);
    const summitInfluences = new Float32Array(vertexCount);
    const materialHints = new Uint8Array(vertexCount);
    const moistures = new Float32Array(vertexCount);
    const temperatures = new Float32Array(vertexCount);

    let landCount = 0;
    let oceanCount = 0;
    let isolatedIslandVertexCount = 0;
    let summitVertexCount = 0;

    for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex += 1) {
      const offset = vertexIndex * 3;

      const direction = [
        sphere.directions[offset],
        sphere.directions[offset + 1],
        sphere.directions[offset + 2]
      ];

      const sample = sampleSurfaceCore(direction);

      positions[offset] = sample.direction[0] * sample.radius;
      positions[offset + 1] = sample.direction[1] * sample.radius;
      positions[offset + 2] = sample.direction[2] * sample.radius;

      elevations[vertexIndex] = sample.elevation;
      curvatures[vertexIndex] = sample.curvatureHint;
      landScores[vertexIndex] = sample.landScore;
      landMasks[vertexIndex] = sample.landMask;
      coastDistances[vertexIndex] = sample.coastDistance;
      waterClasses[vertexIndex] = sample.waterClass;
      terrainClasses[vertexIndex] = sample.terrainClass;

      macroRegionIds[vertexIndex] =
        sample.macroRegionId < 0 ? 255 : sample.macroRegionId;

      primaryBodyIds[vertexIndex] =
        sample.primaryBodyId < 0 ? 255 : sample.primaryBodyId;

      summitIds[vertexIndex] = sample.summitId;
      summitInfluences[vertexIndex] = sample.summitInfluence;
      materialHints[vertexIndex] = sample.materialHint;
      moistures[vertexIndex] = sample.moisture;
      temperatures[vertexIndex] = sample.temperature;

      if (sample.landMask) {
        landCount += 1;

        if (sample.primaryBodyId < 0) {
          isolatedIslandVertexCount += 1;
        }
      } else {
        oceanCount += 1;
      }

      if (sample.terrainClass === TERRAIN_CLASS.SUMMIT) {
        summitVertexCount += 1;
      }
    }

    const normals = recalculateNormals(positions, sphere.indices);

    for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex += 1) {
      const offset = vertexIndex * 3;

      const direction = [
        sphere.directions[offset],
        sphere.directions[offset + 1],
        sphere.directions[offset + 2]
      ];

      const normal = [
        normals[offset],
        normals[offset + 1],
        normals[offset + 2]
      ];

      slopes[vertexIndex] = clamp01(
        (1 - clamp(dot3(direction, normal), -1, 1)) * 18
      );
    }

    const bounds = computeBounds(positions);
    const landCoverage = landCount / vertexCount;
    const oceanCoverage = oceanCount / vertexCount;

    const mesh = {
      contract: CONTRACT,
      modelId: MODEL_ID,
      kind: "terrain",
      level: subdivisionLevel,
      vertexCount,
      triangleCount: sphere.triangleCount,
      positions,
      normals,
      indices: sphere.indices,
      directions: sphere.directions,
      elevations,
      slopes,
      curvatures,
      landScores,
      landMasks,
      coastDistances,
      waterClasses,
      terrainClasses,
      macroRegionIds,
      primaryBodyIds,
      summitIds,
      summitInfluences,
      materialHints,
      moistures,
      temperatures,
      bounds,
      metrics: {
        landCoverage,
        oceanCoverage,
        landVertexCount: landCount,
        oceanVertexCount: oceanCount,
        isolatedIslandVertexCount,
        summitVertexCount,
        minimumRadius: bounds.minimumRadius,
        maximumRadius: bounds.maximumRadius
      }
    };

    mesh.geometryHash = hashTerrainMesh(mesh);

    state.terrainCache.set(subdivisionLevel, mesh);

    recordEvent("AUDRALIA_TERRAIN_MESH_CREATED", {
      level: subdivisionLevel,
      vertexCount,
      triangleCount: sphere.triangleCount,
      landCoverage,
      geometryHash: mesh.geometryHash
    });

    return mesh;
  }

  function createSphereShell(kind, level, radius) {
    const subdivisionLevel = Math.max(
      0,
      Math.min(6, Math.floor(safeNumber(level, 5)))
    );

    const key = `${kind}:${subdivisionLevel}:${radius}`;

    if (state.shellCache.has(key)) {
      return state.shellCache.get(key);
    }

    const sphere = createUnitIcosphere(subdivisionLevel);
    const positions = new Float32Array(sphere.directions.length);

    for (let index = 0; index < sphere.directions.length; index += 1) {
      positions[index] = sphere.directions[index] * radius;
    }

    const shell = {
      contract: CONTRACT,
      modelId: MODEL_ID,
      kind,
      level: subdivisionLevel,
      radius,
      vertexCount: sphere.vertexCount,
      triangleCount: sphere.triangleCount,
      positions,
      normals: sphere.directions.slice(),
      directions: sphere.directions,
      indices: sphere.indices,
      bounds: {
        minimum: [-radius, -radius, -radius],
        maximum: [radius, radius, radius],
        center: [0, 0, 0],
        minimumRadius: radius,
        maximumRadius: radius,
        boundingRadius: radius
      }
    };

    shell.geometryHash = fnv1a(
      `${kind}:${subdivisionLevel}:${radius}:${sphere.vertexCount}:${sphere.triangleCount}`
    );

    state.shellCache.set(key, shell);
    return shell;
  }

  function createOceanMesh(level = DETAIL_LEVELS.ocean) {
    return createSphereShell("ocean", level, REFERENCE_RADIUS);
  }

  function createCloudMesh(level = DETAIL_LEVELS.clouds) {
    return createSphereShell("clouds", level, CLOUD_RADIUS);
  }

  function createAtmosphereMesh(level = DETAIL_LEVELS.atmosphere) {
    return createSphereShell("atmosphere", level, ATMOSPHERE_RADIUS);
  }

  function descentDirection(direction, stepSize = 0.018) {
    let bestDirection = direction;
    let bestRadius = sampleSurfaceCore(direction).radius;

    for (let sampleIndex = 0; sampleIndex < 8; sampleIndex += 1) {
      const azimuth = sampleIndex * Math.PI * 0.25;
      const candidate = offsetOnSphere(direction, stepSize, azimuth);
      const radius = sampleSurfaceCore(candidate).radius;

      if (radius < bestRadius) {
        bestRadius = radius;
        bestDirection = candidate;
      }
    }

    return bestDirection;
  }

  function generateRivers() {
    const rivers = [];

    for (const summit of topology.summitAnchors) {
      const points = [];
      let direction = summit.direction.slice();
      let previousRadius = Infinity;

      for (let step = 0; step < 96; step += 1) {
        const sample = sampleSurfaceCore(direction);

        const pathRadius = Math.max(
          REFERENCE_RADIUS + 0.0008,
          sample.radius + 0.0006
        );

        points.push(
          direction[0] * pathRadius,
          direction[1] * pathRadius,
          direction[2] * pathRadius
        );

        if (
          sample.waterClass !== WATER_CLASS.NONE ||
          sample.radius <= REFERENCE_RADIUS + 0.0015 ||
          sample.radius > previousRadius + 0.0006
        ) {
          break;
        }

        previousRadius = sample.radius;
        direction = descentDirection(
          direction,
          0.014 + step * 0.00005
        );
      }

      rivers.push({
        id: summit.id,
        sourceSummitId: summit.id,
        pointCount: points.length / 3,
        points: new Float32Array(points)
      });
    }

    return rivers;
  }

  function createHydrologyPacket() {
    const rivers = generateRivers();

    const lakes = topology.lakeAnchors
      .filter(anchor => !anchor.inlandSea)
      .map(anchor => ({
        id: anchor.id,
        primaryId: anchor.primaryId,
        macroId: anchor.macroId,
        direction: anchor.direction.slice(),
        radius: anchor.radius,
        waterClass: WATER_CLASS.LAKE
      }));

    const inlandSeas = topology.lakeAnchors
      .filter(anchor => anchor.inlandSea)
      .map(anchor => ({
        id: anchor.id,
        primaryId: anchor.primaryId,
        macroId: anchor.macroId,
        direction: anchor.direction.slice(),
        radius: anchor.radius,
        waterClass: WATER_CLASS.INLAND_SEA
      }));

    return {
      contract: CONTRACT,
      modelId: MODEL_ID,
      rivers,
      lakes,
      inlandSeas,
      drainage: {
        method: "deterministic-local-descent",
        riverCount: rivers.length,
        sourceCount: topology.summitAnchors.length
      }
    };
  }

  function validateTopology() {
    const checks = [];

    function check(id, pass, expected, actual) {
      checks.push({
        id,
        pass: Boolean(pass),
        expected,
        actual
      });
    }

    check(
      "macro-land-system-count",
      topology.macroLandSystems.length === 4,
      4,
      topology.macroLandSystems.length
    );

    check(
      "primary-land-body-count",
      topology.primaryLandBodies.length === 16,
      16,
      topology.primaryLandBodies.length
    );

    check(
      "island-cluster-count",
      topology.islandClusters.length === 64,
      64,
      topology.islandClusters.length
    );

    check(
      "micro-island-count",
      topology.microIslandInfluences.length === 256,
      256,
      topology.microIslandInfluences.length
    );

    check(
      "summit-anchor-count",
      topology.summitAnchors.length === 9,
      9,
      topology.summitAnchors.length
    );

    check(
      "land-threshold-ready",
      state.thresholdReady,
      true,
      state.thresholdReady
    );

    check(
      "calibrated-land-coverage",
      state.calibratedLandCoverage >= 0.28 &&
      state.calibratedLandCoverage <= 0.32,
      "0.28-0.32",
      state.calibratedLandCoverage
    );

    check(
      "topology-hash-present",
      Boolean(topology.hash),
      true,
      topology.hash
    );

    return checks;
  }

  function finalizeValidation(checks, mesh, deep) {
    const failed = checks.filter(check => !check.pass);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      modelId: MODEL_ID,
      status: failed.length === 0 ? "READY" : "BLOCKED",
      passed: failed.length === 0,
      deep,
      level: mesh ? mesh.level : null,
      checkCount: checks.length,
      passCount: checks.length - failed.length,
      failCount: failed.length,
      checks,
      failed,
      validatedAt: nowIso()
    };
  }

  function validateMesh(mesh, options = {}) {
    const checks = validateTopology();
    const deep = options.deep === true;

    function check(id, pass, expected, actual) {
      checks.push({
        id,
        pass: Boolean(pass),
        expected,
        actual
      });
    }

    check("mesh-present", Boolean(mesh), true, Boolean(mesh));

    if (!mesh) {
      return finalizeValidation(checks, null, deep);
    }

    check(
      "vertex-count-nonzero",
      mesh.vertexCount > 0,
      ">0",
      mesh.vertexCount
    );

    check(
      "triangle-count-nonzero",
      mesh.triangleCount > 0,
      ">0",
      mesh.triangleCount
    );

    check(
      "position-length",
      mesh.positions.length === mesh.vertexCount * 3,
      mesh.vertexCount * 3,
      mesh.positions.length
    );

    check(
      "normal-length",
      mesh.normals.length === mesh.vertexCount * 3,
      mesh.vertexCount * 3,
      mesh.normals.length
    );

    check(
      "index-length",
      mesh.indices.length === mesh.triangleCount * 3,
      mesh.triangleCount * 3,
      mesh.indices.length
    );

    check(
      "minimum-radius",
      mesh.bounds.minimumRadius >= MIN_TERRAIN_RADIUS - 1e-5,
      `>=${MIN_TERRAIN_RADIUS}`,
      mesh.bounds.minimumRadius
    );

    check(
      "maximum-radius",
      mesh.bounds.maximumRadius <= MAX_TERRAIN_RADIUS + 1e-5,
      `<=${MAX_TERRAIN_RADIUS}`,
      mesh.bounds.maximumRadius
    );

    check(
      "land-coverage",
      mesh.metrics.landCoverage >= 0.26 &&
      mesh.metrics.landCoverage <= 0.34,
      "0.26-0.34",
      mesh.metrics.landCoverage
    );

    check(
      "ocean-coverage",
      mesh.metrics.oceanCoverage >= 0.66 &&
      mesh.metrics.oceanCoverage <= 0.74,
      "0.66-0.74",
      mesh.metrics.oceanCoverage
    );

    let maximumSummitInfluence = 0;

    for (let index = 0; index < mesh.summitInfluences.length; index += 1) {
      maximumSummitInfluence = Math.max(
        maximumSummitInfluence,
        mesh.summitInfluences[index]
      );
    }

    check(
      "summit-geometry-present",
      mesh.metrics.summitVertexCount > 0 ||
      maximumSummitInfluence > 0.25,
      "summit-class vertices or strong summit influence",
      {
        summitVertexCount: mesh.metrics.summitVertexCount,
        maximumSummitInfluence
      }
    );

    check(
      "geometry-hash-present",
      Boolean(mesh.geometryHash),
      true,
      mesh.geometryHash
    );

    let finitePositions = true;
    let finiteNormals = true;
    let normalsNormalized = true;
    let indicesInRange = true;
    let zeroAreaTriangles = 0;
    let inwardTriangles = 0;

    for (let index = 0; index < mesh.positions.length; index += 1) {
      if (!Number.isFinite(mesh.positions[index])) {
        finitePositions = false;
        break;
      }
    }

    for (let index = 0; index < mesh.normals.length; index += 3) {
      const x = mesh.normals[index];
      const y = mesh.normals[index + 1];
      const z = mesh.normals[index + 2];

      if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(z)
      ) {
        finiteNormals = false;
        normalsNormalized = false;
        break;
      }

      const length = Math.hypot(x, y, z);

      if (Math.abs(length - 1) > 0.015) {
        normalsNormalized = false;
      }
    }

    for (let index = 0; index < mesh.indices.length; index += 1) {
      if (mesh.indices[index] >= mesh.vertexCount) {
        indicesInRange = false;
        break;
      }
    }

    if (deep) {
      for (let index = 0; index < mesh.indices.length; index += 3) {
        const ia = mesh.indices[index] * 3;
        const ib = mesh.indices[index + 1] * 3;
        const ic = mesh.indices[index + 2] * 3;

        const a = [
          mesh.positions[ia],
          mesh.positions[ia + 1],
          mesh.positions[ia + 2]
        ];

        const b = [
          mesh.positions[ib],
          mesh.positions[ib + 1],
          mesh.positions[ib + 2]
        ];

        const c = [
          mesh.positions[ic],
          mesh.positions[ic + 1],
          mesh.positions[ic + 2]
        ];

        const faceNormal = cross3(sub3(b, a), sub3(c, a));
        const areaTwice = length3(faceNormal);

        if (areaTwice <= 1e-10) {
          zeroAreaTriangles += 1;
        }

        const center = normalize3([
          (a[0] + b[0] + c[0]) / 3,
          (a[1] + b[1] + c[1]) / 3,
          (a[2] + b[2] + c[2]) / 3
        ]);

        if (dot3(faceNormal, center) < 0) {
          inwardTriangles += 1;
        }
      }
    }

    check("positions-finite", finitePositions, true, finitePositions);
    check("normals-finite", finiteNormals, true, finiteNormals);
    check("normals-normalized", normalsNormalized, true, normalsNormalized);
    check("indices-in-range", indicesInRange, true, indicesInRange);

    if (deep) {
      check(
        "zero-area-triangles",
        zeroAreaTriangles === 0,
        0,
        zeroAreaTriangles
      );

      check(
        "outward-winding",
        inwardTriangles === 0,
        0,
        inwardTriangles
      );
    }

    return finalizeValidation(checks, mesh, deep);
  }

  function createGeometry(options = {}) {
    const terrainLevel = Math.max(
      0,
      Math.min(
        6,
        Math.floor(
          safeNumber(options.terrainLevel, DETAIL_LEVELS.desktop)
        )
      )
    );

    const oceanLevel = Math.max(
      0,
      Math.min(
        6,
        Math.floor(
          safeNumber(options.oceanLevel, DETAIL_LEVELS.ocean)
        )
      )
    );

    const cloudLevel = Math.max(
      0,
      Math.min(
        6,
        Math.floor(
          safeNumber(options.cloudLevel, DETAIL_LEVELS.clouds)
        )
      )
    );

    const atmosphereLevel = Math.max(
      0,
      Math.min(
        6,
        Math.floor(
          safeNumber(options.atmosphereLevel, DETAIL_LEVELS.atmosphere)
        )
      )
    );

    const includeHydrology = options.includeHydrology !== false;
    const deepValidation = options.deepValidation === true;

    const cacheKey =
      `${terrainLevel}:` +
      `${oceanLevel}:` +
      `${cloudLevel}:` +
      `${atmosphereLevel}:` +
      `${includeHydrology}`;

    if (state.geometryCache.has(cacheKey)) {
      return state.geometryCache.get(cacheKey);
    }

    try {
      const terrain = createTerrainMesh(terrainLevel);
      const ocean = createOceanMesh(oceanLevel);
      const clouds = createCloudMesh(cloudLevel);
      const atmosphere = createAtmosphereMesh(atmosphereLevel);

      const hydrology = includeHydrology
        ? createHydrologyPacket()
        : null;

      const validation = validateMesh(terrain, {
        deep: deepValidation
      });

      const metrics = {
        terrainVertexCount: terrain.vertexCount,
        terrainTriangleCount: terrain.triangleCount,
        oceanVertexCount: ocean.vertexCount,
        oceanTriangleCount: ocean.triangleCount,
        cloudVertexCount: clouds.vertexCount,
        cloudTriangleCount: clouds.triangleCount,
        atmosphereVertexCount: atmosphere.vertexCount,
        atmosphereTriangleCount: atmosphere.triangleCount,

        totalVertexCount:
          terrain.vertexCount +
          ocean.vertexCount +
          clouds.vertexCount +
          atmosphere.vertexCount,

        totalTriangleCount:
          terrain.triangleCount +
          ocean.triangleCount +
          clouds.triangleCount +
          atmosphere.triangleCount,

        landCoverage: terrain.metrics.landCoverage,
        oceanCoverage: terrain.metrics.oceanCoverage,

        riverCount: hydrology ? hydrology.rivers.length : 0,
        lakeCount: hydrology ? hydrology.lakes.length : 0,
        inlandSeaCount: hydrology ? hydrology.inlandSeas.length : 0,
        bounds: terrain.bounds
      };

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        version: VERSION,
        file: FILE,
        modelId: MODEL_ID,
        worldSeed: WORLD_SEED,
        coordinateSystem: "right-handed-y-up",
        units: "normalized-planet-radius",
        terrain,
        ocean,
        clouds,
        atmosphere,
        hydrology,
        topology: getTopology(),
        metrics,
        bounds: terrain.bounds,
        validation,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        createdAt: nowIso()
      };

      packet.geometryHash = fnv1a(
        stableStringify({
          terrainHash: terrain.geometryHash,
          oceanHash: ocean.geometryHash,
          cloudHash: clouds.geometryHash,
          atmosphereHash: atmosphere.geometryHash,
          topologyHash: topology.hash,
          metrics
        })
      );

      state.geometryReady = validation.passed;
      state.validationReady = true;
      state.geometryHash = packet.geometryHash;

      state.lastOptions = {
        terrainLevel,
        oceanLevel,
        cloudLevel,
        atmosphereLevel,
        includeHydrology,
        deepValidation
      };

      state.lastMetrics = clonePlain(metrics);
      state.lastValidation = clonePlain(validation);
      state.geometryCache.set(cacheKey, packet);

      recordEvent("AUDRALIA_PLANET_GEOMETRY_CREATED", {
        cacheKey,
        geometryHash: packet.geometryHash,
        terrainVertexCount: metrics.terrainVertexCount,
        terrainTriangleCount: metrics.terrainTriangleCount,
        validationStatus: validation.status
      });

      publishGlobals();
      return packet;
    } catch (error) {
      recordError("CREATE_AUDRALIA_GEOMETRY_FAILED", error);
      throw error;
    }
  }

  function sampleSurface(direction) {
    return clonePlain(sampleSurfaceCore(direction));
  }

  function classifySurface(direction) {
    const sample = sampleSurfaceCore(direction);

    return {
      landMask: sample.landMask,
      waterClass: sample.waterClass,
      terrainClass: sample.terrainClass,
      macroRegionId: sample.macroRegionId,
      primaryBodyId: sample.primaryBodyId,
      summitId: sample.summitId,
      summitInfluence: sample.summitInfluence,
      materialHint: sample.materialHint,
      coastDistance: sample.coastDistance
    };
  }

  function getTopology() {
    return clonePlain(topology);
  }

  function getMetrics() {
    return clonePlain(
      state.lastMetrics || {
        topology: topology.counts,
        calibratedLandCoverage: state.calibratedLandCoverage,
        landThreshold: state.landThreshold,
        terrainReady: false
      }
    );
  }

  function validate(options = {}) {
    const level = Math.max(
      0,
      Math.min(
        6,
        Math.floor(safeNumber(options.level, DETAIL_LEVELS.mobile))
      )
    );

    const mesh = createTerrainMesh(level);
    const validation = validateMesh(mesh, {
      deep: options.deep === true
    });

    state.validationReady = true;
    state.lastValidation = clonePlain(validation);
    state.geometryReady = validation.passed;

    publishGlobals();
    return validation;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      modelId: MODEL_ID,
      worldSeed: WORLD_SEED,
      installedAt: state.installedAt,
      updatedAt: state.updatedAt || state.installedAt,
      topologyReady: state.topologyReady,
      thresholdReady: state.thresholdReady,
      geometryReady: state.geometryReady,
      validationReady: state.validationReady,
      landThreshold: state.landThreshold,
      calibratedLandCoverage: state.calibratedLandCoverage,
      topologyHash: state.topologyHash,
      geometryHash: state.geometryHash,
      terrainCacheCount: state.terrainCache.size,
      shellCacheCount: state.shellCache.size,
      geometryCacheCount: state.geometryCache.size,
      errorCount: state.errors.length,
      eventCount: state.events.length,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    const status = getStatus();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      modelId: MODEL_ID,
      status:
        status.errorCount > 0
          ? "DEGRADED"
          : status.geometryReady && status.validationReady
            ? "READY"
            : status.topologyReady && status.thresholdReady
              ? "HELD"
              : "BLOCKED",
      ready: status.geometryReady && status.validationReady,
      topologyReady: status.topologyReady,
      geometryReady: status.geometryReady,
      validationReady: status.validationReady,
      calibratedLandCoverage: status.calibratedLandCoverage,
      topologyHash: status.topologyHash,
      geometryHash: status.geometryHash,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    const receipt = {
      ...getReceiptLight(),
      statusDetail: getStatus(),
      topology: getTopology(),
      metrics: getMetrics(),
      validation: clonePlain(state.lastValidation),
      errors: state.errors.map(clonePlain),
      recentEvents: state.events.slice(-32).map(clonePlain),
      composedAt: nowIso()
    };

    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function getReceiptText() {
    return JSON.stringify(getReceipt(), null, 2);
  }

  function clearCaches() {
    state.terrainCache.clear();
    state.shellCache.clear();
    state.geometryCache.clear();

    state.geometryReady = false;
    state.validationReady = false;
    state.geometryHash = "";
    state.lastOptions = null;
    state.lastMetrics = null;
    state.lastValidation = null;

    recordEvent("AUDRALIA_PLANET_GEOMETRY_CACHES_CLEARED", {});
    publishGlobals();

    return true;
  }

  function publishGlobals() {
    root.DGBAudraliaPlanetGeometry = api;
    root.AUDRALIA_PLANET_GEOMETRY_RECEIPT = getReceiptLight();

    root.__AUDRALIA_PLANET_GEOMETRY_LOADED__ = true;
    root.__AUDRALIA_PLANET_GEOMETRY_CONTRACT__ = CONTRACT;
    root.__AUDRALIA_PLANET_GEOMETRY_RECEIPT__ = RECEIPT;
    root.__AUDRALIA_PLANET_WORLD_SEED__ = WORLD_SEED;
    root.__AUDRALIA_PLANET_GEOMETRY_WEBGL__ = false;
    root.__AUDRALIA_PLANET_GEOMETRY_GENERATED_IMAGE__ = false;
    root.__AUDRALIA_PLANET_GEOMETRY_VISUAL_PASS_CLAIMED__ = false;

    dispatch(
      "audralia-planet-geometry-state",
      getReceiptLight()
    );

    return getReceiptLight();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    modelId: MODEL_ID,
    worldSeed: WORLD_SEED,
    coordinateSystem: "right-handed-y-up",
    units: "normalized-planet-radius",
    referenceRadius: REFERENCE_RADIUS,
    cloudRadius: CLOUD_RADIUS,
    atmosphereRadius: ATMOSPHERE_RADIUS,
    minimumTerrainRadius: MIN_TERRAIN_RADIUS,
    maximumTerrainRadius: MAX_TERRAIN_RADIUS,
    targetLandCoverage: TARGET_LAND_COVERAGE,
    DETAIL_LEVELS,
    WATER_CLASS,
    TERRAIN_CLASS,
    MATERIAL_HINT,
    createGeometry,
    createTerrainMesh,
    createOceanMesh,
    createCloudMesh,
    createAtmosphereMesh,
    sampleSurface,
    classifySurface,
    getTopology,
    getMetrics,
    validate,
    getStatus,
    status: getStatus,
    getReceiptLight,
    getReceipt,
    getReceiptText,
    clearCaches,
    publishGlobals,
    deterministicGeometry: true,
    seamlessGeodesicTopology: true,
    latitudeLongitudeSeamOwned: false,
    schoolroomGlobePartitionOwned: false,
    earthGeographyInherited: false,
    australiaGeographyInherited: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  recordEvent("AUDRALIA_PLANET_GEOMETRY_AUTHORITY_LOADED", {
    file: FILE,
    contract: CONTRACT,
    modelId: MODEL_ID,
    worldSeed: WORLD_SEED,
    topologyHash: topology.hash,
    macroLandSystems: topology.counts.macroLandSystems,
    primaryLandBodies: topology.counts.primaryLandBodies,
    islandClusters: topology.counts.islandClusters,
    microIslandInfluences: topology.counts.microIslandInfluences,
    summitAnchors: topology.counts.summitAnchors
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(
  typeof window !== "undefined"
    ? window
    : globalThis
);
