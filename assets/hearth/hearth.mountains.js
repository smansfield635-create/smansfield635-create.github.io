// /assets/hearth/hearth.mountains.js
// HEARTH_MOUNTAINS_NEWS_FIBONACCI_RANGE_CHILD_RESOLVER_TNT_v1
// Full-file replacement.
// Mountain range child resolver only.
// Purpose:
// - Consume existing landmass, elevation, composition, tectonics, and hydrology signals.
// - Mold existing elevated land into mountain ranges, ridge chains, summit cores, foothills, canyon-source feeds, valley feeds, and cliff feeds.
// - Preserve NEWS alignment and Fibonacci synchronization.
// - Preserve parent/child separation: elevation owns height truth; tectonics owns pressure truth; composition owns terrain identity; hydrology owns waterline truth; mountains own range grammar only.
// - Return downstream child feeds for valleys, cliffs, canyons, hydrology, and materials without owning those files.
// Does not own:
// - continent generation
// - landmass shape generation
// - elevation generation
// - tectonic pressure generation
// - hydrology classification
// - valley carving authority
// - cliff rendering authority
// - material expression
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_MOUNTAINS_NEWS_FIBONACCI_RANGE_CHILD_RESOLVER_TNT_v1";
  const RECEIPT = "HEARTH_MOUNTAINS_NEWS_FIBONACCI_RANGE_CHILD_RESOLVER_RECEIPT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_256_LATTICE_CHILD_ENGINE_SCOPE_v1";
  const VERSION = "2026-05-30.hearth-mountains-news-fibonacci-range-child-resolver-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const SEA_LEVEL = 0;

  const NEWS_DIRECTIONS = Object.freeze(["NORTH", "EAST", "WEST", "SOUTH", "CENTER"]);

  const FIBONACCI_GATES = Object.freeze([
    { gate: "F1", threshold: 0.08, role: "latent-relief" },
    { gate: "F2", threshold: 0.13, role: "foothill-emergence" },
    { gate: "F3", threshold: 0.21, role: "ridge-seed" },
    { gate: "F5", threshold: 0.34, role: "secondary-range" },
    { gate: "F8", threshold: 0.55, role: "primary-range" },
    { gate: "F13", threshold: 0.72, role: "alpine-belt" },
    { gate: "F21", threshold: 0.88, role: "summit-core" }
  ]);

  const RANGE_CLASS_ORDER = Object.freeze([
    "none",
    "foothill",
    "plateau-shoulder",
    "secondary-range",
    "primary-range",
    "alpine-belt",
    "summit-core"
  ]);

  const NEWS_RANGE_BEHAVIOR = Object.freeze({
    NORTH: {
      rangeBias: "summit-coldstone-primary-ridge",
      ridgeMultiplier: 1.0,
      summitMultiplier: 1.0,
      canyonMultiplier: 0.72,
      cliffMultiplier: 0.92,
      materialTone: "coldstone"
    },
    EAST: {
      rangeBias: "ascending-arc-fold-range",
      ridgeMultiplier: 0.92,
      summitMultiplier: 0.82,
      canyonMultiplier: 0.84,
      cliffMultiplier: 0.74,
      materialTone: "rising-arc-stone"
    },
    WEST: {
      rangeBias: "shielded-oldstone-broken-ridge",
      ridgeMultiplier: 0.82,
      summitMultiplier: 0.68,
      canyonMultiplier: 0.92,
      cliffMultiplier: 0.88,
      materialTone: "old-shield-stone"
    },
    SOUTH: {
      rangeBias: "harsh-escarpment-dry-range",
      ridgeMultiplier: 0.88,
      summitMultiplier: 0.74,
      canyonMultiplier: 1.0,
      cliffMultiplier: 1.0,
      materialTone: "dry-escarpment-stone"
    },
    CENTER: {
      rangeBias: "interior-wet-basin-shoulder",
      ridgeMultiplier: 0.72,
      summitMultiplier: 0.58,
      canyonMultiplier: 0.86,
      cliffMultiplier: 0.62,
      materialTone: "basin-shoulder-stone"
    }
  });

  const CHILD_REASSIGNMENT = Object.freeze({
    parentFiles: {
      elevation: "/assets/hearth/hearth.elevation.js",
      tectonics: "/assets/hearth/hearth.tectonics.js",
      composition: "/assets/hearth/hearth.composition.js",
      hydrology: "/assets/hearth/hearth.hydrology.js"
    },
    childFiles: {
      mountains: "/assets/hearth/hearth.mountains.js",
      cliffs: "/assets/hearth/hearth.cliffs.js",
      valleys: "/assets/hearth/hearth.valleys.js",
      materials: "/assets/hearth/hearth.materials.js",
      canvas: "/assets/hearth/hearth.canvas.js"
    },
    reassignmentRule:
      "Mountains consume parent truth and output range grammar. Valleys consume canyon/valley feeds. Cliffs consume cliff feeds. Hydrology owns water exposure. Materials express. Canvas receives only."
  });

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

  const mixNumber = (a, b, t) => {
    const k = clamp01(t);
    return a + (b - a) * k;
  };

  const safeNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const safeString = (value, fallback = "") => {
    if (value === undefined || value === null) return fallback;
    const text = String(value);
    return text ? text : fallback;
  };

  const safeBool = (value, fallback = false) => {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  };

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = safeNumber(lonDeg, 0) * DEG;
    const lat = safeNumber(latDeg, 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(v) {
    const p = normalize3(v);
    const lon = Math.atan2(p.x, p.z) * RAD;
    const lat = Math.asin(clamp(p.y, -1, 1)) * RAD;

    return {
      lon,
      lat,
      u: ((lon + 180) / 360 + 1) % 1,
      v: clamp01((90 - lat) / 180)
    };
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const source = args[0];

      if (
        Number.isFinite(Number(source.x)) &&
        Number.isFinite(Number(source.y)) &&
        Number.isFinite(Number(source.z))
      ) {
        const vector = normalize3(source);
        const ll = vectorToLonLat(vector);

        return {
          ...vector,
          ...ll,
          input: source
        };
      }

      if (Number.isFinite(Number(source.lon)) && Number.isFinite(Number(source.lat))) {
        const vector = lonLatToVector(Number(source.lon), Number(source.lat));

        return {
          ...vector,
          lon: Number(source.lon),
          lat: Number(source.lat),
          u: ((Number(source.lon) + 180) / 360 + 1) % 1,
          v: clamp01((90 - Number(source.lat)) / 180),
          input: source
        };
      }

      if (Number.isFinite(Number(source.longitude)) && Number.isFinite(Number(source.latitude))) {
        const lon = Number(source.longitude);
        const lat = Number(source.latitude);
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u: ((lon + 180) / 360 + 1) % 1,
          v: clamp01((90 - lat) / 180),
          input: source
        };
      }

      if (Number.isFinite(Number(source.u)) && Number.isFinite(Number(source.v))) {
        const u = clamp01(Number(source.u));
        const v = clamp01(Number(source.v));
        const lon = u * 360 - 180;
        const lat = 90 - v * 180;
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u,
          v,
          input: source
        };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);

      return {
        ...vector,
        ...ll,
        input: { x: args[0], y: args[1], z: args[2] }
      };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      const vector = lonLatToVector(lon, lat);

      return {
        ...vector,
        lon,
        lat,
        u: ((lon + 180) / 360 + 1) % 1,
        v: clamp01((90 - lat) / 180),
        input: { lon, lat }
      };
    }

    const vector = lonLatToVector(0, 0);

    return {
      ...vector,
      lon: 0,
      lat: 0,
      u: 0.5,
      v: 0.5,
      input: {}
    };
  }

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(
      safeNumber(x, 0) * 127.1 +
      safeNumber(y, 0) * 311.7 +
      safeNumber(z, 0) * 74.7 +
      safeNumber(salt, 0) * 91.13
    ) * 43758.5453123;

    return n - Math.floor(n);
  }

  function smoothNoise(x, y, salt = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hashNoise(ix, iy, 1, salt);
    const b = hashNoise(ix + 1, iy, 1, salt);
    const c = hashNoise(ix, iy + 1, 1, salt);
    const d = hashNoise(ix + 1, iy + 1, 1, salt);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return (
      a * (1 - ux) * (1 - uy) +
      b * ux * (1 - uy) +
      c * (1 - ux) * uy +
      d * ux * uy
    );
  }

  function fbm(x, y, salt = 0, octaves = 5) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let total = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += smoothNoise(x * frequency, y * frequency, salt + i * 17) * amplitude;
      total += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total ? value / total : value;
  }

  function getAuthority(names) {
    for (const name of names) {
      if (!name) continue;

      if (root[name]) return root[name];

      if (root.HEARTH && root.HEARTH[name]) {
        return root.HEARTH[name];
      }

      if (root.DEXTER_LAB && root.DEXTER_LAB[name]) {
        return root.DEXTER_LAB[name];
      }
    }

    return null;
  }

  function callAuthority(authority, methods, args, point) {
    if (!authority || typeof authority !== "object") return null;

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method].call(authority, point);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method].call(authority, point.x, point.y, point.z);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method].call(authority, point.lon, point.lat);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method].call(authority, point.u, point.v);
        if (result && typeof result === "object") return result;
      } catch (_error) {}
    }

    return null;
  }

  function readReceipt(authority) {
    if (!authority || typeof authority !== "object") return null;

    if (typeof authority.getReceipt === "function") {
      try {
        const receipt = authority.getReceipt();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    if (authority.receipt && typeof authority.receipt === "object") return authority.receipt;
    if (authority.receiptPacket && typeof authority.receiptPacket === "object") return authority.receiptPacket;

    return null;
  }

  function getElevationAuthority() {
    return getAuthority(["HEARTH_ELEVATION", "HearthElevation", "elevation"]);
  }

  function getCompositionAuthority() {
    return getAuthority(["HEARTH_COMPOSITION", "HearthComposition", "composition"]);
  }

  function getTectonicsAuthority() {
    return getAuthority(["HEARTH_TECTONICS", "HearthTectonics", "tectonics"]);
  }

  function getHydrologyAuthority() {
    return getAuthority(["HEARTH_HYDROLOGY", "HearthHydrology", "hydrology"]);
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function stringField(source, key, fallback = "") {
    return typeof (source && source[key]) === "string" && source[key]
      ? source[key]
      : fallback;
  }

  function normalizeNews(value, point) {
    const upper = safeString(value, "").toUpperCase();

    if (NEWS_DIRECTIONS.includes(upper)) return upper;

    if (point.lat > 38) return "NORTH";
    if (point.lat < -32) return "SOUTH";
    if (point.lon >= 0 && Math.abs(point.lat) <= 48) return "EAST";
    if (point.lon < 0 && Math.abs(point.lat) <= 48) return "WEST";

    return "CENTER";
  }

  function fibonacciForPressure(value) {
    const p = clamp01(value);
    let selected = FIBONACCI_GATES[0];

    for (const gate of FIBONACCI_GATES) {
      if (p >= gate.threshold) selected = gate;
    }

    return selected;
  }

  function normalizeElevation(raw, point) {
    const source = raw && typeof raw === "object" ? raw : {};
    const directInput = point.input && typeof point.input === "object" ? point.input : {};

    const elevation = numberField(
      source,
      "elevation",
      numberField(source, "height", numberField(directInput, "elevation", 0))
    );

    const seaLevel = numberField(source, "seaLevel", numberField(directInput, "seaLevel", SEA_LEVEL));
    const relativeElevation = elevation - seaLevel;

    const isWater = boolField(source, "isWater", relativeElevation <= 0);
    const isLand = boolField(source, "isLand", !isWater && relativeElevation > 0);

    return {
      contract: stringField(source, "contract", "HEARTH_MOUNTAINS_FALLBACK_ELEVATION_READ"),
      receipt: stringField(source, "receipt", "FALLBACK_ELEVATION_READ"),
      authorityPresent: Boolean(raw && typeof raw === "object"),
      elevation,
      seaLevel,
      relativeElevation,

      isLand,
      isWater,
      isShallowWater: boolField(source, "isShallowWater", isWater && relativeElevation > -0.2),
      isDeepWater: boolField(source, "isDeepWater", isWater && relativeElevation <= -0.2),

      landPotential: clamp01(numberField(source, "landPotential", isLand ? 0.62 : 0)),
      waterDepthPotential: clamp01(numberField(source, "waterDepthPotential", isWater ? Math.abs(relativeElevation) : 0)),
      coastPotential: clamp01(numberField(source, "coastPotential", Math.abs(relativeElevation) < 0.12 ? 0.34 : 0)),
      shelfPotential: clamp01(numberField(source, "shelfPotential", 0)),
      continentShelfPotential: clamp01(numberField(source, "continentShelfPotential", 0)),
      oceanBasinPotential: clamp01(numberField(source, "oceanBasinPotential", isWater ? 0.36 : 0)),

      terrainClassHint: stringField(source, "terrainClassHint", isLand ? "continent_mass" : "ocean_basin"),

      continentId: stringField(source, "continentId", isLand ? "unresolved_continent" : "open_ocean"),
      continentName: stringField(source, "continentName", isLand ? "Unresolved Continent" : "Open Ocean"),
      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : -1,

      bodySeatId: stringField(source, "bodySeatId", "none"),
      bodySeatName: stringField(source, "bodySeatName", "None"),
      bodySeatIndex: Number.isFinite(Number(source.bodySeatIndex)) ? Number(source.bodySeatIndex) : -1,
      bodySeatPressureId: stringField(source, "bodySeatPressureId", ""),
      bodySeatNews: normalizeNews(stringField(source, "bodySeatNews", ""), point),
      bodySeatFibonacci: stringField(source, "bodySeatFibonacci", "F0"),
      bodySeatDistanceDeg: numberField(source, "bodySeatDistanceDeg", 180),
      bodySeatPressure: clamp01(numberField(source, "bodySeatPressure", isLand ? 0.36 : 0)),
      bodyInteriorPressure: clamp01(numberField(source, "bodyInteriorPressure", isLand ? 0.24 : 0)),
      bodyEdgePressure: clamp01(numberField(source, "bodyEdgePressure", 0)),
      bodyBreadthPressure: clamp01(numberField(source, "bodyBreadthPressure", 0)),
      bodyRoughnessPressure: clamp01(numberField(source, "bodyRoughnessPressure", 0)),

      summitRegionHint: stringField(source, "summitRegionHint", "none"),
      summitRegionLabel: stringField(source, "summitRegionLabel", "None"),
      summitTerrainHint: stringField(source, "summitTerrainHint", "none"),
      summitBookSummit: stringField(source, "summitBookSummit", "none"),
      summitPotential: clamp01(numberField(source, "summitPotential", 0)),
      summitNews: normalizeNews(stringField(source, "summitNews", ""), point),
      summitFibonacci: stringField(source, "summitFibonacci", "F0"),

      mountainArcPotential: clamp01(numberField(source, "mountainArcPotential", 0)),
      ridgePotential: clamp01(numberField(source, "ridgePotential", 0)),
      plateauPotential: clamp01(numberField(source, "plateauPotential", 0)),
      canyonPotential: clamp01(numberField(source, "canyonPotential", 0)),
      escarpmentPotential: clamp01(numberField(source, "escarpmentPotential", 0)),
      waterfallCandidate: clamp01(numberField(source, "waterfallCandidate", 0)),
      basinPotential: clamp01(numberField(source, "basinPotential", 0)),
      saddlePotential: clamp01(numberField(source, "saddlePotential", 0)),
      scarPotential: clamp01(numberField(source, "scarPotential", 0)),
      channelCutPressure: clamp01(numberField(source, "channelCutPressure", 0)),

      newsProtocolActive: boolField(source, "newsProtocolActive", true),
      fibonacciAlignmentActive: boolField(source, "fibonacciAlignmentActive", true),
      coordinateBodyResolverActive: boolField(source, "coordinateBodyResolverActive", true)
    };
  }

  function normalizeComposition(raw, elevation) {
    const source = raw && typeof raw === "object" ? raw : {};
    const terrainClass =
      stringField(source, "worldTerrainClass") ||
      stringField(source, "expandedTerrainClass") ||
      stringField(source, "semanticTerrainClass") ||
      stringField(source, "terrainClass") ||
      stringField(source, "compatibilityTerrainClass") ||
      elevation.terrainClassHint ||
      (elevation.isLand ? "continent_mass" : "ocean_basin");

    return {
      contract: stringField(source, "contract", "HEARTH_MOUNTAINS_FALLBACK_COMPOSITION_READ"),
      receipt: stringField(source, "receipt", "FALLBACK_COMPOSITION_READ"),
      authorityPresent: Boolean(raw && typeof raw === "object"),

      terrainClass,
      worldTerrainClass: terrainClass,
      expandedTerrainClass: stringField(source, "expandedTerrainClass", terrainClass),
      semanticTerrainClass: stringField(source, "semanticTerrainClass", terrainClass),
      compatibilityTerrainClass: stringField(source, "compatibilityTerrainClass", terrainClass),

      continentId: stringField(source, "continentId", elevation.continentId),
      continentName: stringField(source, "continentName", elevation.continentName),
      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : elevation.continentIndex,
      continentClass: stringField(source, "continentClass", elevation.isLand ? `${elevation.continentId}_mass` : "open_ocean"),
      climateClass: stringField(source, "climateClass", "open_ocean"),

      isLand: boolField(source, "isLand", elevation.isLand),
      isWater: boolField(source, "isWater", elevation.isWater),

      landPotential: clamp01(numberField(source, "landPotential", elevation.landPotential)),
      coastPotential: clamp01(numberField(source, "coastPotential", elevation.coastPotential)),
      shelfPotential: clamp01(numberField(source, "shelfPotential", elevation.shelfPotential)),
      continentShelfPotential: clamp01(numberField(source, "continentShelfPotential", elevation.continentShelfPotential)),
      waterDepthPotential: clamp01(numberField(source, "waterDepthPotential", elevation.waterDepthPotential)),

      continentPotential: clamp01(numberField(source, "continentPotential", elevation.isLand ? 0.62 : 0)),
      continentSeparation: clamp01(numberField(source, "continentSeparation", 0)),

      massAnchor: clamp01(numberField(source, "massAnchor", elevation.bodySeatPressure * 0.58)),
      reliefStrength: clamp01(numberField(source, "reliefStrength", elevation.ridgePotential * 0.28 + elevation.bodyRoughnessPressure * 0.22)),
      slopePressure: clamp01(numberField(source, "slopePressure", elevation.bodyEdgePressure * 0.30 + elevation.ridgePotential * 0.18)),
      materialDensity: clamp01(numberField(source, "materialDensity", elevation.bodySeatPressure * 0.28 + elevation.landPotential * 0.18)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", elevation.isLand ? 0.60 : 0.18)),
      rimCompression: clamp01(numberField(source, "rimCompression", elevation.bodyEdgePressure * 0.22)),

      mountainArcPotential: clamp01(numberField(source, "mountainArcPotential", elevation.mountainArcPotential)),
      ridgePotential: clamp01(numberField(source, "ridgePotential", elevation.ridgePotential)),
      plateauPotential: clamp01(numberField(source, "plateauPotential", elevation.plateauPotential)),
      canyonPotential: clamp01(numberField(source, "canyonPotential", elevation.canyonPotential)),
      escarpmentPotential: clamp01(numberField(source, "escarpmentPotential", elevation.escarpmentPotential)),
      basinPotential: clamp01(numberField(source, "basinPotential", elevation.basinPotential)),
      saddlePotential: clamp01(numberField(source, "saddlePotential", elevation.saddlePotential)),
      scarPotential: clamp01(numberField(source, "scarPotential", elevation.scarPotential))
    };
  }

  function normalizeTectonics(raw, composition, elevation) {
    const source = raw && typeof raw === "object" ? raw : {};

    return {
      contract: stringField(source, "contract", "HEARTH_MOUNTAINS_FALLBACK_TECTONICS_READ"),
      receipt: stringField(source, "receipt", "FALLBACK_TECTONICS_READ"),
      authorityPresent: Boolean(raw && typeof raw === "object"),

      tectonicClass: stringField(source, "tectonicClass", composition.isLand ? "continental_range_candidate" : "ocean_basin"),
      plateClass: stringField(source, "plateClass", composition.isLand ? "continental_plate" : "oceanic_plate"),

      platePressure: clamp01(numberField(source, "platePressure", elevation.bodySeatPressure * 0.20)),
      continentalBodyPressure: clamp01(numberField(source, "continentalBodyPressure", elevation.bodySeatPressure * 0.48 + composition.continentPotential * 0.16)),
      continentEdgeCompression: clamp01(numberField(source, "continentEdgeCompression", elevation.bodyEdgePressure * 0.42 + composition.coastPotential * 0.10)),
      continentDivideStress: clamp01(numberField(source, "continentDivideStress", elevation.channelCutPressure * 0.26 + composition.continentSeparation * 0.24)),

      ridgeCompression: clamp01(numberField(source, "ridgeCompression", elevation.ridgePotential * 0.38 + elevation.bodyRoughnessPressure * 0.18)),
      mountainArcPressure: clamp01(numberField(source, "mountainArcPressure", elevation.mountainArcPotential * 0.52 + elevation.ridgePotential * 0.16)),
      summitTectonicPressure: clamp01(numberField(source, "summitTectonicPressure", elevation.summitPotential * 0.42)),
      plateauLiftPressure: clamp01(numberField(source, "plateauLiftPressure", elevation.plateauPotential * 0.36 + elevation.bodyInteriorPressure * 0.16)),

      canyonCutPressure: clamp01(numberField(source, "canyonCutPressure", elevation.canyonPotential * 0.42 + elevation.channelCutPressure * 0.16)),
      faultCutPressure: clamp01(numberField(source, "faultCutPressure", elevation.channelCutPressure * 0.34 + elevation.scarPotential * 0.18)),
      faultLinePressure: clamp01(numberField(source, "faultLinePressure", elevation.channelCutPressure * 0.28 + elevation.scarPotential * 0.14)),
      fractureDensity: clamp01(numberField(source, "fractureDensity", elevation.bodyRoughnessPressure * 0.22 + elevation.channelCutPressure * 0.18)),
      scarPressure: clamp01(numberField(source, "scarPressure", elevation.scarPotential * 0.30 + elevation.channelCutPressure * 0.12)),

      cliffPressure: clamp01(numberField(source, "cliffPressure", elevation.escarpmentPotential * 0.44 + elevation.bodyEdgePressure * 0.18)),
      escarpmentPressure: clamp01(numberField(source, "escarpmentPressure", elevation.escarpmentPotential * 0.52 + elevation.bodyEdgePressure * 0.18)),
      shelfDropPressure: clamp01(numberField(source, "shelfDropPressure", elevation.shelfPotential * 0.28 + elevation.bodyEdgePressure * 0.16)),
      coastalCompression: clamp01(numberField(source, "coastalCompression", elevation.coastPotential * 0.34 + elevation.bodyEdgePressure * 0.16)),

      basinCompression: clamp01(numberField(source, "basinCompression", elevation.basinPotential * 0.30)),
      basinSubsidence: clamp01(numberField(source, "basinSubsidence", elevation.basinPotential * 0.36)),
      lowlandStress: clamp01(numberField(source, "lowlandStress", elevation.basinPotential * 0.28)),

      hydrologyFeedPressure: clamp01(numberField(source, "hydrologyFeedPressure", Math.max(elevation.coastPotential, elevation.shelfPotential, elevation.basinPotential) * 0.32)),
      waterfallDropPressure: clamp01(numberField(source, "waterfallDropPressure", elevation.waterfallCandidate * 0.46)),
      drainageCutPotential: clamp01(numberField(source, "drainageCutPotential", Math.max(elevation.canyonPotential, elevation.channelCutPressure, elevation.basinPotential) * 0.38)),

      materialReliefFeed: clamp01(numberField(source, "materialReliefFeed", elevation.ridgePotential * 0.24 + elevation.bodyRoughnessPressure * 0.20)),
      materialDensityFeed: clamp01(numberField(source, "materialDensityFeed", elevation.bodySeatPressure * 0.26 + elevation.bodyBreadthPressure * 0.16))
    };
  }

  function normalizeHydrology(raw, elevation, tectonics) {
    const source = raw && typeof raw === "object" ? raw : {};

    const waterPresence = clamp01(numberField(
      source,
      "waterPresence",
      elevation.isWater ? 0.70 : Math.max(elevation.coastPotential, elevation.shelfPotential) * 0.18
    ));

    return {
      contract: stringField(source, "contract", "HEARTH_MOUNTAINS_FALLBACK_HYDROLOGY_READ"),
      receipt: stringField(source, "receipt", "FALLBACK_HYDROLOGY_READ"),
      authorityPresent: Boolean(raw && typeof raw === "object"),

      hydrologyClass: stringField(source, "hydrologyClass", elevation.isWater ? "water" : "land"),
      waterPresence,
      waterFill: boolField(source, "waterFill", elevation.isWater || waterPresence > 0.52),
      waterFillStrength: clamp01(numberField(source, "waterFillStrength", waterPresence)),
      waterDepth: clamp01(numberField(source, "waterDepth", elevation.waterDepthPotential)),
      waterDepthClass: stringField(source, "waterDepthClass", elevation.isWater ? "water" : "dry"),

      waterlineBoundary: boolField(source, "waterlineBoundary", elevation.coastPotential > 0.20),
      waterlineBoundaryStrength: clamp01(numberField(source, "waterlineBoundaryStrength", elevation.coastPotential * 0.44 + elevation.shelfPotential * 0.20)),
      shallowShelf: boolField(source, "shallowShelf", elevation.shelfPotential > 0.24),
      shallowShelfStrength: clamp01(numberField(source, "shallowShelfStrength", elevation.shelfPotential * 0.52)),

      drainagePotential: clamp01(numberField(source, "drainagePotential", tectonics.drainageCutPotential * 0.40 + elevation.channelCutPressure * 0.20)),
      riverPotential: clamp01(numberField(source, "riverPotential", tectonics.drainageCutPotential * 0.28)),
      canyonOutflowPotential: clamp01(numberField(source, "canyonOutflowPotential", tectonics.canyonCutPressure * 0.38)),
      waterfallFlowPotential: clamp01(numberField(source, "waterfallFlowPotential", tectonics.waterfallDropPressure * 0.42)),
      inletPotential: clamp01(numberField(source, "inletPotential", elevation.channelCutPressure * 0.14)),
      bayPotential: clamp01(numberField(source, "bayPotential", elevation.coastPotential * 0.20)),
      straitPotential: clamp01(numberField(source, "straitPotential", tectonics.continentDivideStress * 0.34)),
      coastNaturalizationFeed: clamp01(numberField(source, "coastNaturalizationFeed", Math.max(elevation.coastPotential, elevation.shelfPotential) * 0.30))
    };
  }

  function readElevation(point, args) {
    if (point.input && typeof point.input === "object" && Number.isFinite(Number(point.input.elevation))) {
      return normalizeElevation(point.input, point);
    }

    const authority = getElevationAuthority();
    const raw = callAuthority(
      authority,
      ["sample", "read", "getElevation", "sampleElevation", "readElevation", "resolve"],
      args,
      point
    );

    return normalizeElevation(raw, point);
  }

  function readComposition(point, args, elevation) {
    if (
      point.input &&
      typeof point.input === "object" &&
      (
        typeof point.input.worldTerrainClass === "string" ||
        typeof point.input.terrainClass === "string" ||
        typeof point.input.expandedTerrainClass === "string"
      )
    ) {
      return normalizeComposition(point.input, elevation);
    }

    const authority = getCompositionAuthority();
    const raw = callAuthority(
      authority,
      ["sample", "read", "sampleComposition", "compose", "resolve"],
      args,
      point
    );

    return normalizeComposition(raw, elevation);
  }

  function readTectonics(point, args, composition, elevation) {
    if (
      point.input &&
      typeof point.input === "object" &&
      (
        Number.isFinite(Number(point.input.platePressure)) ||
        Number.isFinite(Number(point.input.tectonicPressure)) ||
        Number.isFinite(Number(point.input.mountainArcPressure))
      )
    ) {
      return normalizeTectonics(point.input, composition, elevation);
    }

    const authority = getTectonicsAuthority();
    const raw = callAuthority(
      authority,
      ["sample", "read", "sampleTectonics", "getTectonics", "resolve"],
      args,
      point
    );

    return normalizeTectonics(raw, composition, elevation);
  }

  function readHydrology(point, args, elevation, tectonics) {
    const authority = getHydrologyAuthority();
    const raw = callAuthority(
      authority,
      ["sample", "read", "sampleHydrology", "getHydrology", "resolve"],
      args,
      point
    );

    return normalizeHydrology(raw, elevation, tectonics);
  }

  function rangeAxisField(point, news, elevation, tectonics) {
    const lon = point.lon * DEG;
    const lat = point.lat * DEG;
    const warpA = fbm(point.u * 4.0 + 3.1, point.v * 3.3 - 1.7, 401, 5) - 0.5;
    const warpB = fbm(point.u * 8.2 - 2.4, point.v * 7.4 + 1.1, 503, 4) - 0.5;

    let axis = 0;

    if (news === "NORTH") {
      axis = Math.sin(lon * 3.2 + lat * 0.70 + warpA * 2.6);
    } else if (news === "EAST") {
      axis = Math.sin((lon + lat * 0.74) * 2.75 + warpA * 2.2);
    } else if (news === "WEST") {
      axis = Math.sin((lon - lat * 0.82) * 2.55 - warpB * 2.0);
    } else if (news === "SOUTH") {
      axis = Math.sin(lon * 2.45 - lat * 1.20 + warpA * 2.4);
    } else {
      axis = Math.sin(lon * 1.85 + lat * 1.15 + warpA * 1.5 - warpB * 1.3);
    }

    const line = 1 - Math.abs(axis);
    const ridgeLine = smoothstep(0.50, 0.94, line);
    const fracturedLine = clamp01(ridgeLine * (0.66 + fbm(point.u * 18.0, point.v * 14.0, 607, 4) * 0.34));

    const compression = clamp01(
      tectonics.ridgeCompression * 0.28 +
      tectonics.mountainArcPressure * 0.24 +
      elevation.ridgePotential * 0.20 +
      elevation.bodyRoughnessPressure * 0.16 +
      elevation.summitPotential * 0.12
    );

    return {
      ridgeLine,
      fracturedLine,
      axisContinuity: clamp01(fracturedLine * 0.64 + compression * 0.36),
      warpA,
      warpB
    };
  }

  function resolveMountainClass(primary, secondary, summit, foothill, plateau) {
    const ranked = [
      { mountainClass: "summit-core", value: summit },
      { mountainClass: "alpine-belt", value: clamp01(summit * 0.72 + primary * 0.32) },
      { mountainClass: "primary-range", value: primary },
      { mountainClass: "secondary-range", value: secondary },
      { mountainClass: "plateau-shoulder", value: plateau },
      { mountainClass: "foothill", value: foothill },
      { mountainClass: "none", value: 0 }
    ].sort((a, b) => b.value - a.value);

    if (ranked[0].value < 0.12) return "none";
    return ranked[0].mountainClass;
  }

  function rangeOrdinal(mountainClass) {
    const index = RANGE_CLASS_ORDER.indexOf(mountainClass);
    return index >= 0 ? index : 0;
  }

  function computeMountain(point, elevation, composition, tectonics, hydrology) {
    const isLand = Boolean(
      elevation.isLand &&
      composition.isLand &&
      !hydrology.waterFill &&
      hydrology.waterFillStrength < 0.58
    );

    const news = normalizeNews(elevation.bodySeatNews || elevation.summitNews, point);
    const behavior = NEWS_RANGE_BEHAVIOR[news] || NEWS_RANGE_BEHAVIOR.CENTER;

    const relativeLift = clamp01((elevation.relativeElevation + 0.04) / 0.74);
    const highness = isLand ? relativeLift : 0;
    const landGate = isLand ? clamp01(0.50 + elevation.landPotential * 0.30 + composition.surfaceAttachment * 0.20) : 0;

    const axis = rangeAxisField(point, news, elevation, tectonics);

    const tectonicLift = clamp01(
      tectonics.platePressure * 0.08 +
      tectonics.continentalBodyPressure * 0.16 +
      tectonics.ridgeCompression * 0.20 +
      tectonics.mountainArcPressure * 0.22 +
      tectonics.summitTectonicPressure * 0.14 +
      tectonics.plateauLiftPressure * 0.08 +
      tectonics.fractureDensity * 0.08 +
      tectonics.continentEdgeCompression * 0.04
    );

    const inheritedRangePotential = clamp01(
      elevation.mountainArcPotential * 0.20 +
      elevation.ridgePotential * 0.22 +
      elevation.summitPotential * 0.12 +
      elevation.bodyRoughnessPressure * 0.16 +
      composition.reliefStrength * 0.10 +
      composition.slopePressure * 0.08 +
      tectonicLift * 0.12
    );

    const primaryRangePressure = clamp01(
      landGate *
      behavior.ridgeMultiplier *
      (
        highness * 0.18 +
        inheritedRangePotential * 0.32 +
        tectonicLift * 0.22 +
        axis.axisContinuity * 0.22 +
        elevation.bodySeatPressure * 0.06
      )
    );

    const secondaryRangePressure = clamp01(
      landGate *
      (
        primaryRangePressure * 0.38 +
        axis.fracturedLine * 0.20 +
        elevation.ridgePotential * 0.16 +
        tectonics.fractureDensity * 0.12 +
        tectonics.faultLinePressure * 0.08 +
        elevation.bodyRoughnessPressure * 0.06
      )
    );

    const ridgeChainPressure = clamp01(
      landGate *
      (
        primaryRangePressure * 0.34 +
        secondaryRangePressure * 0.22 +
        axis.ridgeLine * 0.22 +
        elevation.ridgePotential * 0.14 +
        tectonics.ridgeCompression * 0.08
      )
    );

    const branchRidgePressure = clamp01(
      landGate *
      (
        secondaryRangePressure * 0.36 +
        tectonics.fractureDensity * 0.20 +
        tectonics.faultLinePressure * 0.14 +
        fbm(point.u * 22.0 + 2.0, point.v * 18.0 - 4.0, 701, 4) * 0.12 +
        elevation.bodyRoughnessPressure * 0.10 +
        elevation.channelCutPressure * 0.08
      )
    );

    const summitCorePressure = clamp01(
      landGate *
      behavior.summitMultiplier *
      (
        highness * 0.24 +
        elevation.summitPotential * 0.22 +
        tectonics.summitTectonicPressure * 0.18 +
        primaryRangePressure * 0.20 +
        ridgeChainPressure * 0.10 +
        elevation.bodySeatPressure * 0.06
      )
    );

    const alpineBeltPressure = clamp01(
      landGate *
      (
        summitCorePressure * 0.42 +
        primaryRangePressure * 0.26 +
        highness * 0.14 +
        elevation.mountainArcPotential * 0.10 +
        axis.axisContinuity * 0.08
      )
    );

    const plateauShoulderPressure = clamp01(
      landGate *
      (
        elevation.plateauPotential * 0.24 +
        tectonics.plateauLiftPressure * 0.22 +
        highness * 0.14 +
        elevation.bodyInteriorPressure * 0.14 +
        primaryRangePressure * 0.12 +
        secondaryRangePressure * 0.08 +
        composition.massAnchor * 0.06
      )
    );

    const foothillFalloff = clamp01(
      landGate *
      (
        secondaryRangePressure * 0.22 +
        primaryRangePressure * 0.16 +
        (1 - summitCorePressure) * 0.16 +
        highness * 0.10 +
        composition.surfaceAttachment * 0.10 +
        elevation.landPotential * 0.10 +
        hydrology.waterlineBoundaryStrength * 0.06 +
        composition.coastPotential * 0.04
      )
    );

    const escarpmentCandidate = clamp01(
      landGate *
      behavior.cliffMultiplier *
      (
        tectonics.escarpmentPressure * 0.24 +
        tectonics.cliffPressure * 0.22 +
        elevation.escarpmentPotential * 0.18 +
        elevation.bodyEdgePressure * 0.12 +
        ridgeChainPressure * 0.10 +
        branchRidgePressure * 0.08 +
        tectonics.shelfDropPressure * 0.06
      )
    );

    const canyonSourcePressure = clamp01(
      landGate *
      behavior.canyonMultiplier *
      (
        primaryRangePressure * 0.18 +
        secondaryRangePressure * 0.16 +
        branchRidgePressure * 0.14 +
        tectonics.canyonCutPressure * 0.18 +
        tectonics.faultCutPressure * 0.12 +
        tectonics.drainageCutPotential * 0.10 +
        hydrology.drainagePotential * 0.08 +
        elevation.channelCutPressure * 0.04
      )
    );

    const valleyFeedPressure = clamp01(
      landGate *
      (
        canyonSourcePressure * 0.30 +
        hydrology.drainagePotential * 0.16 +
        hydrology.riverPotential * 0.12 +
        tectonics.basinSubsidence * 0.10 +
        elevation.basinPotential * 0.10 +
        branchRidgePressure * 0.08 +
        foothillFalloff * 0.08 +
        hydrology.waterfallFlowPotential * 0.06
      )
    );

    const cliffFeedPressure = clamp01(
      landGate *
      (
        escarpmentCandidate * 0.34 +
        tectonics.cliffPressure * 0.18 +
        primaryRangePressure * 0.12 +
        ridgeChainPressure * 0.10 +
        elevation.bodyEdgePressure * 0.10 +
        hydrology.waterlineBoundaryStrength * 0.06 +
        tectonics.shelfDropPressure * 0.06 +
        tectonics.fractureDensity * 0.04
      )
    );

    const hydrologyCarveFeed = clamp01(
      (
        canyonSourcePressure * 0.26 +
        valleyFeedPressure * 0.22 +
        tectonics.drainageCutPotential * 0.16 +
        hydrology.canyonOutflowPotential * 0.10 +
        hydrology.straitPotential * 0.08 +
        tectonics.continentDivideStress * 0.08 +
        elevation.channelCutPressure * 0.10
      ) * landGate
    );

    const waterExposureCutFeed = clamp01(
      (
        hydrologyCarveFeed * 0.32 +
        canyonSourcePressure * 0.20 +
        valleyFeedPressure * 0.16 +
        tectonics.faultCutPressure * 0.12 +
        hydrology.waterlineBoundaryStrength * 0.08 +
        composition.continentSeparation * 0.06 +
        elevation.scarPotential * 0.06
      ) * landGate
    );

    const materialReliefFeed = clamp01(
      primaryRangePressure * 0.20 +
      secondaryRangePressure * 0.16 +
      ridgeChainPressure * 0.16 +
      branchRidgePressure * 0.10 +
      summitCorePressure * 0.14 +
      alpineBeltPressure * 0.10 +
      cliffFeedPressure * 0.08 +
      plateauShoulderPressure * 0.06
    );

    const mountainIntensity = clamp01(
      primaryRangePressure * 0.22 +
      secondaryRangePressure * 0.14 +
      ridgeChainPressure * 0.14 +
      summitCorePressure * 0.18 +
      alpineBeltPressure * 0.14 +
      plateauShoulderPressure * 0.08 +
      foothillFalloff * 0.06 +
      cliffFeedPressure * 0.04
    );

    const mountainClass = resolveMountainClass(
      primaryRangePressure,
      secondaryRangePressure,
      summitCorePressure,
      foothillFalloff,
      plateauShoulderPressure
    );

    const fibonacciGate = fibonacciForPressure(mountainIntensity);
    const strictMountainRange = Boolean(
      isLand &&
      mountainIntensity >= 0.34 &&
      primaryRangePressure >= 0.18 &&
      ridgeChainPressure >= 0.16
    );

    const rangeQualified = Boolean(
      isLand &&
      mountainIntensity >= 0.18 &&
      (
        ridgeChainPressure >= 0.12 ||
        summitCorePressure >= 0.14 ||
        foothillFalloff >= 0.18 ||
        plateauShoulderPressure >= 0.16
      )
    );

    const childRouting = {
      valleyChildFeedActive: valleyFeedPressure > 0.12,
      cliffChildFeedActive: cliffFeedPressure > 0.12,
      hydrologyCarveFeedActive: hydrologyCarveFeed > 0.12,
      waterExposureCutFeedActive: waterExposureCutFeed > 0.16,
      materialsReliefFeedActive: materialReliefFeed > 0.12,
      canvasReceivesOnly: true
    };

    return {
      rangeActive: rangeQualified,
      strictMountainRange,
      mountainClass,
      mountainClassRank: rangeOrdinal(mountainClass),
      mountainIntensity,

      news,
      newsRangeBehavior: behavior.rangeBias,
      mountainFibonacciGate: fibonacciGate.gate,
      mountainFibonacciRole: fibonacciGate.role,
      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,

      primaryRangePressure,
      secondaryRangePressure,
      ridgeChainPressure,
      branchRidgePressure,
      summitCorePressure,
      alpineBeltPressure,
      foothillFalloff,
      plateauShoulderPressure,
      escarpmentCandidate,

      canyonSourcePressure,
      valleyFeedPressure,
      cliffFeedPressure,
      hydrologyCarveFeed,
      waterExposureCutFeed,
      materialReliefFeed,

      rangeAxisContinuity: axis.axisContinuity,
      rangeLinePressure: axis.ridgeLine,
      rangeFracturePressure: axis.fracturedLine,

      landGate,
      relativeLift,
      highness,
      tectonicLift,
      inheritedRangePotential,

      childRouting
    };
  }

  function sample(...args) {
    const point = parseInput(...args);
    const elevation = readElevation(point, args);
    const composition = readComposition(point, args, elevation);
    const tectonics = readTectonics(point, args, composition, elevation);
    const hydrology = readHydrology(point, args, elevation, tectonics);
    const mountain = computeMountain(point, elevation, composition, tectonics, hydrology);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "mountains",
      role: "news-fibonacci-range-child-resolver",

      lon: point.lon,
      lat: point.lat,
      u: point.u,
      v: point.v,
      x: point.x,
      y: point.y,
      z: point.z,

      continentId: composition.continentId,
      continentName: composition.continentName,
      continentIndex: composition.continentIndex,
      continentClass: composition.continentClass,
      terrainClass: composition.terrainClass,
      worldTerrainClass: composition.worldTerrainClass,
      compatibilityTerrainClass: composition.compatibilityTerrainClass,
      climateClass: composition.climateClass,

      elevation: elevation.elevation,
      seaLevel: elevation.seaLevel,
      relativeElevation: elevation.relativeElevation,
      isLand: elevation.isLand && composition.isLand,
      isWater: elevation.isWater || hydrology.waterFill,
      landPotential: elevation.landPotential,
      coastPotential: elevation.coastPotential,
      shelfPotential: elevation.shelfPotential,

      bodySeatId: elevation.bodySeatId,
      bodySeatName: elevation.bodySeatName,
      bodySeatIndex: elevation.bodySeatIndex,
      bodySeatPressureId: elevation.bodySeatPressureId,
      bodySeatNews: elevation.bodySeatNews,
      bodySeatFibonacci: elevation.bodySeatFibonacci,
      bodySeatPressure: elevation.bodySeatPressure,
      bodyInteriorPressure: elevation.bodyInteriorPressure,
      bodyEdgePressure: elevation.bodyEdgePressure,
      bodyBreadthPressure: elevation.bodyBreadthPressure,
      bodyRoughnessPressure: elevation.bodyRoughnessPressure,

      summitRegionHint: elevation.summitRegionHint,
      summitRegionLabel: elevation.summitRegionLabel,
      summitTerrainHint: elevation.summitTerrainHint,
      summitBookSummit: elevation.summitBookSummit,
      summitPotential: elevation.summitPotential,
      summitNews: elevation.summitNews,
      summitFibonacci: elevation.summitFibonacci,

      mountainArcPotential: elevation.mountainArcPotential,
      ridgePotential: elevation.ridgePotential,
      plateauPotential: elevation.plateauPotential,
      canyonPotential: elevation.canyonPotential,
      escarpmentPotential: elevation.escarpmentPotential,
      basinPotential: elevation.basinPotential,
      saddlePotential: elevation.saddlePotential,

      tectonicClass: tectonics.tectonicClass,
      plateClass: tectonics.plateClass,
      platePressure: tectonics.platePressure,
      continentalBodyPressure: tectonics.continentalBodyPressure,
      continentEdgeCompression: tectonics.continentEdgeCompression,
      ridgeCompression: tectonics.ridgeCompression,
      mountainArcPressure: tectonics.mountainArcPressure,
      summitTectonicPressure: tectonics.summitTectonicPressure,
      plateauLiftPressure: tectonics.plateauLiftPressure,
      canyonCutPressure: tectonics.canyonCutPressure,
      faultCutPressure: tectonics.faultCutPressure,
      faultLinePressure: tectonics.faultLinePressure,
      fractureDensity: tectonics.fractureDensity,
      cliffPressure: tectonics.cliffPressure,
      escarpmentPressure: tectonics.escarpmentPressure,
      drainageCutPotential: tectonics.drainageCutPotential,

      hydrologyClass: hydrology.hydrologyClass,
      waterFill: hydrology.waterFill,
      waterFillStrength: hydrology.waterFillStrength,
      waterDepth: hydrology.waterDepth,
      waterlineBoundary: hydrology.waterlineBoundary,
      waterlineBoundaryStrength: hydrology.waterlineBoundaryStrength,
      drainagePotential: hydrology.drainagePotential,
      riverPotential: hydrology.riverPotential,
      canyonOutflowPotential: hydrology.canyonOutflowPotential,
      waterfallFlowPotential: hydrology.waterfallFlowPotential,

      rangeActive: mountain.rangeActive,
      strictMountainRange: mountain.strictMountainRange,
      mountainClass: mountain.mountainClass,
      mountainClassRank: mountain.mountainClassRank,
      mountainIntensity: mountain.mountainIntensity,

      news: mountain.news,
      newsRangeBehavior: mountain.newsRangeBehavior,
      mountainFibonacciGate: mountain.mountainFibonacciGate,
      mountainFibonacciRole: mountain.mountainFibonacciRole,
      newsProtocolSynchronized: mountain.newsProtocolSynchronized,
      fibonacciAlignmentSynchronized: mountain.fibonacciAlignmentSynchronized,

      primaryRangePressure: mountain.primaryRangePressure,
      secondaryRangePressure: mountain.secondaryRangePressure,
      ridgeChainPressure: mountain.ridgeChainPressure,
      branchRidgePressure: mountain.branchRidgePressure,
      summitCorePressure: mountain.summitCorePressure,
      alpineBeltPressure: mountain.alpineBeltPressure,
      foothillFalloff: mountain.foothillFalloff,
      plateauShoulderPressure: mountain.plateauShoulderPressure,
      escarpmentCandidate: mountain.escarpmentCandidate,

      canyonSourcePressure: mountain.canyonSourcePressure,
      valleyFeedPressure: mountain.valleyFeedPressure,
      cliffFeedPressure: mountain.cliffFeedPressure,
      hydrologyCarveFeed: mountain.hydrologyCarveFeed,
      waterExposureCutFeed: mountain.waterExposureCutFeed,
      materialReliefFeed: mountain.materialReliefFeed,

      rangeAxisContinuity: mountain.rangeAxisContinuity,
      rangeLinePressure: mountain.rangeLinePressure,
      rangeFracturePressure: mountain.rangeFracturePressure,

      landGate: mountain.landGate,
      relativeLift: mountain.relativeLift,
      highness: mountain.highness,
      tectonicLift: mountain.tectonicLift,
      inheritedRangePotential: mountain.inheritedRangePotential,

      childRouting: mountain.childRouting,

      elevationContract: elevation.contract,
      compositionContract: composition.contract,
      tectonicsContract: tectonics.contract,
      hydrologyContract: hydrology.contract,
      elevationAuthorityPresent: elevation.authorityPresent,
      compositionAuthorityPresent: composition.authorityPresent,
      tectonicsAuthorityPresent: tectonics.authorityPresent,
      hydrologyAuthorityPresent: hydrology.authorityPresent,

      ownsRangeGrammar: true,
      ownsMountainChildResolution: true,
      ownsContinentGeneration: false,
      ownsLandmassShapeGeneration: false,
      ownsElevationGeneration: false,
      ownsTectonicPressureGeneration: false,
      ownsHydrologyClassification: false,
      ownsValleyCarvingAuthority: false,
      ownsCliffRenderingAuthority: false,
      ownsMaterialExpression: false,
      ownsCanvasDrawing: false,
      ownsRuntimeMotion: false,
      ownsRouteOrchestration: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const read = (...args) => sample(...args);
  const getMountain = (...args) => sample(...args);
  const mountainAt = (...args) => sample(...args);
  const getMountainAt = (...args) => sample(...args);
  const resolve = (...args) => sample(...args);
  const resolveMountain = (...args) => sample(...args);

  function getReceipt() {
    const elevation = getElevationAuthority();
    const composition = getCompositionAuthority();
    const tectonics = getTectonicsAuthority();
    const hydrology = getHydrologyAuthority();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      authority: "mountains",
      role: "news-fibonacci-range-child-resolver",
      status: "active",

      purpose:
        "consume existing elevation/tectonic/composition/hydrology truth and resolve mountain range grammar downstream",
      childReassignment: CHILD_REASSIGNMENT,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      newsDirections: NEWS_DIRECTIONS.slice(),
      fibonacciGates: FIBONACCI_GATES.map((gate) => ({ ...gate })),
      newsRangeBehavior: { ...NEWS_RANGE_BEHAVIOR },

      consumesElevation: true,
      consumesComposition: true,
      consumesTectonics: true,
      consumesHydrology: true,

      elevationAuthorityPresent: Boolean(elevation),
      compositionAuthorityPresent: Boolean(composition),
      tectonicsAuthorityPresent: Boolean(tectonics),
      hydrologyAuthorityPresent: Boolean(hydrology),

      elevationReceipt: readReceipt(elevation),
      compositionReceipt: readReceipt(composition),
      tectonicsReceipt: readReceipt(tectonics),
      hydrologyReceipt: readReceipt(hydrology),

      owns: [
        "mountain range grammar",
        "primary range pressure",
        "secondary range pressure",
        "ridge chain pressure",
        "branch ridge pressure",
        "summit core pressure",
        "alpine belt pressure",
        "foothill falloff",
        "plateau shoulder pressure",
        "mountain-to-valley feed",
        "mountain-to-cliff feed",
        "mountain-to-hydrology carve feed",
        "mountain-to-material relief feed",
        "NEWS/Fibonacci mountain classification"
      ],

      doesNotOwn: [
        "continent generation",
        "landmass shape generation",
        "elevation generation",
        "tectonic pressure generation",
        "hydrology classification",
        "valley carving authority",
        "cliff rendering authority",
        "material expression",
        "canvas drawing",
        "runtime motion",
        "controls",
        "route orchestration",
        "final visual pass claim"
      ],

      outputFields: [
        "rangeActive",
        "strictMountainRange",
        "mountainClass",
        "mountainIntensity",
        "news",
        "mountainFibonacciGate",
        "primaryRangePressure",
        "secondaryRangePressure",
        "ridgeChainPressure",
        "branchRidgePressure",
        "summitCorePressure",
        "alpineBeltPressure",
        "foothillFalloff",
        "plateauShoulderPressure",
        "escarpmentCandidate",
        "canyonSourcePressure",
        "valleyFeedPressure",
        "cliffFeedPressure",
        "hydrologyCarveFeed",
        "waterExposureCutFeed",
        "materialReliefFeed",
        "rangeAxisContinuity",
        "rangeLinePressure",
        "rangeFracturePressure"
      ],

      downstreamChildren: [
        "/assets/hearth/hearth.valleys.js",
        "/assets/hearth/hearth.cliffs.js",
        "/assets/hearth/hearth.hydrology.js",
        "/assets/hearth/hearth.materials.js",
        "/assets/hearth/hearth.canvas.js"
      ],

      designRules: [
        "existing landmass is preserved",
        "elevation remains parent height truth",
        "tectonics remains parent pressure truth",
        "mountains classify elevated land into range grammar only",
        "not every high point becomes a mountain",
        "mountain classification requires land gate, lift, pressure, ridge continuity, and NEWS/Fibonacci agreement",
        "canyons and water exposure are emitted as feeds, not executed here",
        "materials receive relief feed but remain expression authority",
        "canvas remains receiver only",
        "no final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,

    sample,
    read,
    getMountain,
    mountainAt,
    getMountainAt,
    resolve,
    resolveMountain,
    getReceipt,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    newsDirections: NEWS_DIRECTIONS.slice(),
    fibonacciGates: FIBONACCI_GATES.map((gate) => ({ ...gate })),
    newsRangeBehavior: { ...NEWS_RANGE_BEHAVIOR },
    childReassignment: CHILD_REASSIGNMENT,

    consumesElevation: true,
    consumesComposition: true,
    consumesTectonics: true,
    consumesHydrology: true,

    ownsRangeGrammar: true,
    ownsMountainChildResolution: true,
    ownsContinentGeneration: false,
    ownsLandmassShapeGeneration: false,
    ownsElevationGeneration: false,
    ownsTectonicPressureGeneration: false,
    ownsHydrologyClassification: false,
    ownsValleyCarvingAuthority: false,
    ownsCliffRenderingAuthority: false,
    ownsMaterialExpression: false,
    ownsCanvasDrawing: false,
    ownsRuntimeMotion: false,
    ownsRouteOrchestration: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.mountains = api;
  root.HEARTH.mountainAuthority = api;
  root.HEARTH.rangeResolver = api;

  root.HEARTH_MOUNTAINS = api;
  root.HEARTH_MOUNTAIN_AUTHORITY = api;
  root.HEARTH_RANGE_RESOLVER = api;
  root.HearthMountains = api;
  root.HEARTH_MOUNTAINS_RECEIPT = getReceipt();
  root.HEARTH_MOUNTAINS_CONTRACT = CONTRACT;

  root.HEARTH_MOUNTAINS_SUPPORTS_NEWS_FIBONACCI_RANGE_RESOLUTION = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_PRIMARY_RANGE_PRESSURE = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_SECONDARY_RANGE_PRESSURE = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_RIDGE_CHAIN_PRESSURE = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_SUMMIT_CORE_PRESSURE = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_FOOTHILL_FALLOFF = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_CANYON_SOURCE_FEED = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_VALLEY_FEED = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_CLIFF_FEED = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_WATER_EXPOSURE_FEED = true;
  root.HEARTH_MOUNTAINS_SUPPORTS_MATERIAL_RELIEF_FEED = true;

  if (doc && doc.documentElement) {
    const dataset = doc.documentElement.dataset;

    dataset.hearthMountainsAuthorityLoaded = "true";
    dataset.hearthMountainsContract = CONTRACT;
    dataset.hearthMountainsReceipt = RECEIPT;
    dataset.hearthMountainsFamilyContract = FAMILY_CONTRACT;
    dataset.hearthMountainsVersion = VERSION;
    dataset.hearthMountainsRole = "news-fibonacci-range-child-resolver";

    dataset.hearthMountainsNewsProtocolSynchronized = "true";
    dataset.hearthMountainsFibonacciAlignmentSynchronized = "true";

    dataset.hearthMountainsConsumesElevation = "true";
    dataset.hearthMountainsConsumesComposition = "true";
    dataset.hearthMountainsConsumesTectonics = "true";
    dataset.hearthMountainsConsumesHydrology = "true";

    dataset.hearthMountainsOwnsRangeGrammar = "true";
    dataset.hearthMountainsOwnsMountainChildResolution = "true";
    dataset.hearthMountainsOwnsContinentGeneration = "false";
    dataset.hearthMountainsOwnsLandmassShapeGeneration = "false";
    dataset.hearthMountainsOwnsElevationGeneration = "false";
    dataset.hearthMountainsOwnsTectonicPressureGeneration = "false";
    dataset.hearthMountainsOwnsHydrologyClassification = "false";
    dataset.hearthMountainsOwnsValleyCarvingAuthority = "false";
    dataset.hearthMountainsOwnsCliffRenderingAuthority = "false";
    dataset.hearthMountainsOwnsMaterialExpression = "false";
    dataset.hearthMountainsOwnsCanvasDrawing = "false";
    dataset.hearthMountainsOwnsRuntimeMotion = "false";
    dataset.hearthMountainsOwnsRouteOrchestration = "false";
    dataset.hearthMountainsOwnsFinalVisualPassClaim = "false";

    dataset.hearthMountainsSupportsPrimaryRangePressure = "true";
    dataset.hearthMountainsSupportsSecondaryRangePressure = "true";
    dataset.hearthMountainsSupportsRidgeChainPressure = "true";
    dataset.hearthMountainsSupportsSummitCorePressure = "true";
    dataset.hearthMountainsSupportsCanyonSourceFeed = "true";
    dataset.hearthMountainsSupportsValleyFeed = "true";
    dataset.hearthMountainsSupportsCliffFeed = "true";
    dataset.hearthMountainsSupportsWaterExposureFeed = "true";
    dataset.hearthMountainsSupportsMaterialReliefFeed = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
