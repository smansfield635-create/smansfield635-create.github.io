// /assets/hearth/hearth.assets.js
// HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1
// Full-file replacement.
// First file in the two-file Assets <-> Canvas exchange.
// Purpose:
// - Convert /assets/hearth/hearth.assets.js into the active East-consumable material authority.
// - Publish the exact material contract already expected by Canvas East:
//   HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1.
// - Preserve climate / biome / region coloring from the prior Assets file.
// - Preserve seven body masses, jagged coastlines, island chains, elevation, runtime, controls, canvas, and route separation.
// - Publish all aliases already searched by Canvas East without requiring East, West, South, route conductor, index, or HTML renewal.
// - Expose sample/read/getMaterial/materialAt/getMaterialAt/getSurfaceMaterial/resolve/resolveMaterial/createTextureCanvas/createHearthTextureCanvas/classify/getReceipt/getStatus.
// - Repair prior undefined color reference by defining upland/highland material color.
// Owns:
// - material/color/biome/region expression
// - material sampling API
// - material authority aliases
// - texture canvas creation as an asset/material service
// Does not own:
// - Canvas parent
// - Canvas East atlas build
// - Canvas West inspection
// - Canvas South rendering
// - runtime-table governance
// - route orchestration
// - Macro West admissibility
// - NEWS finalization
// - F21
// - ready text
// - final visual pass claim
// No GraphicBox. No generated image. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const ASSETS_CONTRACT = "HEARTH_ASSETS_CLIMATE_BIOME_REGION_COLORING_MATERIAL_AUTHORITY_EXCHANGE_TNT_v12";
  const ASSETS_RECEIPT = "HEARTH_ASSETS_CLIMATE_BIOME_REGION_COLORING_MATERIAL_AUTHORITY_EXCHANGE_RECEIPT_v12";
  const PREVIOUS_ASSETS_CONTRACT = "HEARTH_ASSETS_CLIMATE_BIOME_REGION_COLORING_TNT_v11";
  const PREVIOUS_MATERIAL_CONTRACT = "HEARTH_ASSETS_CONSUME_DEDICATED_ELEVATION_TNT_v10";

  const REQUIRED_TERRAIN_EXTENSION = "HEARTH_TERRAIN_BASE_FOR_DEDICATED_ELEVATION_TNT_v6";
  const REQUIRED_ELEVATION = "HEARTH_TANGIBLE_ELEVATION_MOUNTAINS_FOOTHILLS_CLIFFS_TNT_v1";
  const REQUIRED_CLIMATE = "HEARTH_CLIMATE_REGION_BIOME_AUTHORITY_TNT_v1";
  const BLUEPRINT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_v1";

  const VERSION = "2026-06-01.hearth-assets-material-authority-exchange-v12";
  const FILE = "/assets/hearth/hearth.assets.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_MASSES = Object.freeze([
    { id: 1, key: "north-crown-mass", name: "North Crown Mass", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG, beach: 0.05, shelf: 0.46 },
    { id: 2, key: "equatorial-great-mass", name: "Equatorial Great Mass", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG, beach: 0.68, shelf: 0.72 },
    { id: 3, key: "northwest-temperate-mass", name: "Northwest Temperate Mass", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG, beach: 0.24, shelf: 0.42 },
    { id: 4, key: "northeast-broken-shelf-mass", name: "Northeast Broken Shelf Mass", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG, beach: 0.72, shelf: 0.92 },
    { id: 5, key: "southeast-warm-mass", name: "Southeast Warm Mass", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG, beach: 0.90, shelf: 0.84 },
    { id: 6, key: "southwest-ridge-mass", name: "Southwest Ridge Mass", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG, beach: 0.12, shelf: 0.24 },
    { id: 7, key: "south-transitional-mass", name: "South Transitional Mass", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG, beach: 0.26, shelf: 0.54 }
  ]);

  const C = Object.freeze({
    abyss: [2, 12, 30],
    deep: [3, 20, 50],
    ocean: [6, 58, 104],
    shelf: [27, 128, 148],
    shelfSoft: [58, 154, 158],
    foam: [116, 176, 166],

    beach: [202, 180, 116],
    wetBeach: [174, 158, 106],

    wetForest: [32, 96, 62],
    seasonalForest: [54, 116, 68],
    temperateForest: [62, 104, 68],
    highlandForest: [58, 96, 76],

    plains: [122, 142, 82],
    savanna: [154, 142, 78],
    steppe: [130, 122, 78],
    coldSteppe: [112, 120, 96],

    desert: [184, 148, 86],
    semiDesert: [160, 136, 82],
    dryHighland: [132, 118, 90],

    wetland: [55, 112, 92],
    lowland: [90, 124, 76],
    upland: [108, 122, 86],
    highland: [92, 104, 82],
    tundra: [128, 138, 118],

    ridge: [82, 86, 82],
    cliff: [50, 58, 68],
    cliffShadow: [28, 34, 42],
    granite: [122, 118, 110],
    graniteLight: [156, 152, 140],
    slate: [48, 60, 74],
    snow: [216, 232, 232],
    ice: [204, 224, 226],
    polar: [126, 140, 144],
    dark: [52, 50, 58],
    copper: [156, 88, 58],
    gold: [208, 164, 66],
    opal: [154, 190, 186],
    shadow: [16, 22, 28]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    assetsContract: ASSETS_CONTRACT,
    assetsReceipt: ASSETS_RECEIPT,
    previousAssetsContract: PREVIOUS_ASSETS_CONTRACT,
    previousMaterialContract: PREVIOUS_MATERIAL_CONTRACT,
    requiredTerrainExtension: REQUIRED_TERRAIN_EXTENSION,
    requiredElevation: REQUIRED_ELEVATION,
    requiredClimate: REQUIRED_CLIMATE,
    blueprint: BLUEPRINT,
    version: VERSION,
    file: FILE,
    role: "hearth-material-authority-assets-exchange",

    materialAuthorityPublished: true,
    materialAliasesPublished: false,
    eastConsumableMaterialApi: true,
    sampleObjectCompatible: true,
    sampleUvCompatible: true,
    sampleXyzCompatible: true,
    undefinedColorReferenceRepaired: true,
    climateBiomeRegionColoringActive: true,
    biomeColorNotBodyMassColor: true,
    bodyMassAssignedColoring: false,
    bodyMassCount: BODY_MASSES.length,

    terrainExtensionLoaded: false,
    elevationAuthorityLoaded: false,
    climateAuthorityLoaded: false,

    sampleCount: 0,
    textureBuildCount: 0,
    lastSampleAt: "",
    lastTextureBuildAt: "",
    lastTextureWidth: 0,
    lastTextureHeight: 0,
    lastError: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: nowIso()
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
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
    const x = u * s;
    const y = v * s;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.6;
    let scale = 8;

    for (let i = 0; i < 6; i += 1) {
      const n = noise(u, v, scale, seed + i * 83);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function terrainExtension() {
    const candidates = [
      root.HEARTH_TERRAIN_EXTENSION,
      root.HEARTH && root.HEARTH.terrainExtension,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthTerrainExtension
    ];

    for (const extension of candidates) {
      if (!extension || !isObject(extension)) continue;
      const contract = safeString(extension.contract, "");
      if (contract && !contract.includes(REQUIRED_TERRAIN_EXTENSION)) continue;
      if (isFunction(extension.sampleTerrain)) return extension;
    }

    return null;
  }

  function elevationAuthority() {
    const candidates = [
      root.HEARTH_ELEVATION,
      root.HEARTH && root.HEARTH.elevation,
      root.HEARTH && root.HEARTH.elevationAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthElevation
    ];

    for (const elevation of candidates) {
      if (!elevation || !isObject(elevation)) continue;
      const contract = safeString(elevation.contract, "");
      if (contract && !contract.includes(REQUIRED_ELEVATION)) continue;
      if (isFunction(elevation.sampleElevation)) return elevation;
    }

    return null;
  }

  function climateAuthority() {
    const candidates = [
      root.HEARTH_CLIMATE,
      root.HEARTH && root.HEARTH.climate,
      root.HEARTH && root.HEARTH.climateAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthClimate
    ];

    for (const climate of candidates) {
      if (!climate || !isObject(climate)) continue;
      const contract = safeString(climate.contract, "");
      if (contract && !contract.includes(REQUIRED_CLIMATE)) continue;
      if (isFunction(climate.sampleClimate)) return climate;
    }

    return null;
  }

  function lonLat(u, v) {
    return {
      lon: (u - 0.5) * TAU,
      lat: (0.5 - v) * Math.PI
    };
  }

  function uvFromLonLat(lon, lat) {
    return {
      u: ((safeNumber(lon, 0) / 360) + 0.5 + 1) % 1,
      v: clamp(0.5 - (safeNumber(lat, 0) / 180), 0, 1)
    };
  }

  function uvFromXyz(x, y, z) {
    const nx = safeNumber(x, 0);
    const ny = safeNumber(y, 0);
    const nz = safeNumber(z, 1);
    const m = Math.hypot(nx, ny, nz) || 1;
    const px = nx / m;
    const py = ny / m;
    const pz = nz / m;
    const lon = Math.atan2(px, pz) * 180 / Math.PI;
    const lat = Math.asin(clamp(py, -1, 1)) * 180 / Math.PI;
    return uvFromLonLat(lon, lat);
  }

  function normalizeInput(a, b, c) {
    if (isObject(a)) {
      if (Number.isFinite(Number(a.u)) && Number.isFinite(Number(a.v))) {
        return {
          u: ((safeNumber(a.u, 0.5) % 1) + 1) % 1,
          v: clamp(safeNumber(a.v, 0.5), 0, 1)
        };
      }

      if (Number.isFinite(Number(a.lon)) && Number.isFinite(Number(a.lat))) {
        return uvFromLonLat(safeNumber(a.lon, 0), safeNumber(a.lat, 0));
      }

      if (
        Number.isFinite(Number(a.x)) &&
        Number.isFinite(Number(a.y)) &&
        Number.isFinite(Number(a.z))
      ) {
        return uvFromXyz(a.x, a.y, a.z);
      }

      return { u: 0.5, v: 0.5 };
    }

    if (
      Number.isFinite(Number(a)) &&
      Number.isFinite(Number(b)) &&
      Number.isFinite(Number(c))
    ) {
      return uvFromXyz(a, b, c);
    }

    return {
      u: ((safeNumber(a, 0.5) % 1) + 1) % 1,
      v: clamp(safeNumber(b, 0.5), 0, 1)
    };
  }

  function angularMassField(lon, lat, u, v, mass) {
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

    const cornerWave =
      Math.sign(Math.sin(theta * (5 + mass.id) + mass.id * 0.67)) * 0.075 +
      Math.sign(Math.sin(theta * (9 + mass.id) - mass.id * 0.43)) * 0.042;

    const tectonicNoise = (ridged(u + mass.id * 0.053, v - mass.id * 0.061, 21000 + mass.id * 233) - 0.5) * 0.20;
    const bayCut = smoothstep(0.52, 0.94, noise(u - mass.id * 0.043, v + mass.id * 0.071, 110, 22000 + mass.id * 251)) * 0.11;

    let field = 1 - dist + cornerWave + tectonicNoise - bayCut;

    const extension = terrainExtension();
    let modifier = null;

    if (extension && isFunction(extension.sampleCoastlineModifier)) {
      try {
        modifier = extension.sampleCoastlineModifier(u, v, {
          primaryMassId: mass.id,
          primaryMassKey: mass.key,
          field,
          theta,
          nx,
          ny
        });

        if (modifier && Number.isFinite(Number(modifier.fieldDelta))) {
          field += Number(modifier.fieldDelta);
        }
      } catch (_error) {}
    }

    return { mass, field, theta, nx, ny, dist, modifier };
  }

  function fallbackTerrainExtensionSample(u, v, base) {
    const grain = ridged(u * 1.23 + 0.04, v * 1.17 - 0.02, 31000);
    const fracture = ridged(u * 2.4 - 0.08, v * 2.1 + 0.03, 32000);
    const edge = base.coast || 0;

    return {
      terrainClass: base.isLand
        ? edge > 0.55
          ? "coastal_land"
          : grain > 0.68
            ? "ridged_highland"
            : grain < 0.22
              ? "basin_lowland"
              : "continental_interior"
        : base.shelf > 0.32
          ? "shallow_shelf"
          : "ocean_basin",
      grainTexture: grain,
      islandEdge: base.isIsland ? edge : 0,
      fractureTexture: fracture,
      coastlineSharpness: clamp01(edge * 0.72 + fracture * 0.28)
    };
  }

  function fallbackElevationSample(u, v, base, terrain) {
    const ridge = ridged(u * 1.64 + 0.02, v * 1.42 - 0.05, 41000);
    const micro = noise(u, v, 96, 42000);
    const mountainRange = base.isLand ? smoothstep(0.58, 0.93, ridge) * (1 - base.coast * 0.26) : 0;
    const cliffWall = base.isLand ? smoothstep(0.42, 0.95, base.coast) * smoothstep(0.56, 0.88, ridge) : 0;
    const exposedRock = clamp01(mountainRange * 0.60 + cliffWall * 0.34 + terrain.fractureTexture * 0.18);
    const verticalRelief = base.isLand ? clamp01(ridge * 0.56 + mountainRange * 0.44) : 0;
    const valley = base.isLand ? smoothstep(0.18, 0.45, 1 - ridge) * 0.72 : 0;
    const basinShadow = base.isLand ? valley * 0.46 : base.deepOcean * 0.50;
    const peakHighlight = clamp01(mountainRange * smoothstep(0.72, 0.98, micro));
    const snowLine = clamp01(smoothstep(0.66, 0.93, Math.abs(base.lat) / (Math.PI / 2)) * 0.45 + peakHighlight * 0.55);

    return {
      elevation: base.isLand ? clamp01(0.20 + base.field * 0.60 + verticalRelief * 0.20) : -clamp01(base.deepOcean * 0.72 + base.shelf * 0.20),
      verticalRelief,
      mountainRange,
      foothills: base.isLand ? smoothstep(0.34, 0.62, ridge) * (1 - mountainRange * 0.40) : 0,
      cliffWall,
      escarpment: cliffWall * terrain.coastlineSharpness,
      cliffShadow: cliffWall * 0.64,
      basinShadow,
      valley,
      exposedRock,
      peakHighlight,
      snowLine,
      shelfDrop: base.isLand ? 0 : base.deepOcean * 0.60,
      mineralFace: exposedRock * smoothstep(0.54, 0.90, micro),
      micro
    };
  }

  function fallbackClimateSample(u, v, base, terrain, elevation) {
    const latAbs = Math.abs(base.lat) / (Math.PI / 2);
    const equatorWarmth = 1 - latAbs;
    const rainBand = noise(u * 1.7 + 0.13, v * 1.2 - 0.08, 24, 51000);
    const stormBand = ridged(u * 1.1 - 0.05, v * 1.8 + 0.07, 52000);

    const moisture = clamp01(
      0.30 +
      rainBand * 0.34 +
      base.coast * 0.20 +
      base.shelf * 0.14 +
      (base.isIsland ? 0.12 : 0) -
      elevation.mountainRange * 0.08
    );

    const temperature = clamp01(
      equatorWarmth * 0.86 +
      noise(u, v, 16, 53000) * 0.14 -
      elevation.verticalRelief * 0.16 -
      elevation.snowLine * 0.18
    );

    const aridity = clamp01(
      0.46 +
      (1 - moisture) * 0.42 +
      smoothstep(0.32, 0.74, temperature) * 0.18 -
      stormBand * 0.18
    );

    const wetness = clamp01(moisture * 0.66 + base.coast * 0.22 + stormBand * 0.12);
    const latitudeCold = clamp01(latAbs * 0.94 + elevation.snowLine * 0.30);
    const ice = clamp01(smoothstep(0.80, 0.98, latitudeCold) + elevation.snowLine * 0.42);

    let biome = "mixed-lowland";

    if (ice > 0.70) biome = "ice-cap";
    else if (elevation.peakHighlight > 0.46 && latitudeCold > 0.46) biome = "snowy-mountains";
    else if (elevation.mountainRange > 0.48) biome = moisture > 0.48 ? "highland-forest" : "rocky-mountains";
    else if (aridity > 0.78 && temperature > 0.48) biome = "hot-desert";
    else if (aridity > 0.62) biome = "semi-desert";
    else if (wetness > 0.72 && temperature > 0.42) biome = "wetland";
    else if (moisture > 0.70 && temperature > 0.52) biome = "wet-forest";
    else if (moisture > 0.58 && temperature > 0.44) biome = "seasonal-forest";
    else if (moisture > 0.48 && temperature > 0.28) biome = "temperate-forest";
    else if (temperature > 0.58 && moisture > 0.34) biome = "savanna";
    else if (latitudeCold > 0.66) biome = "tundra";
    else if (latitudeCold > 0.52) biome = "cold-steppe";
    else if (moisture < 0.38) biome = "steppe";
    else biome = "plains";

    return {
      biome,
      moisture,
      temperature,
      aridity,
      wetness,
      latitudeCold,
      ice
    };
  }

  function classify(a, b, c) {
    const input = normalizeInput(a, b, c);
    const u = input.u;
    const v = input.v;
    const p = lonLat(u, v);
    const extension = terrainExtension();
    const elevation = elevationAuthority();
    const climate = climateAuthority();

    state.terrainExtensionLoaded = Boolean(extension);
    state.elevationAuthorityLoaded = Boolean(elevation);
    state.climateAuthorityLoaded = Boolean(climate);

    const reads = BODY_MASSES
      .map((mass) => angularMassField(p.lon, p.lat, u, v, mass))
      .sort((x, y) => y.field - x.field);

    const best = reads[0];

    let island = null;

    if (extension && isFunction(extension.sampleIslandField)) {
      try {
        island = extension.sampleIslandField(u, v, p);
      } catch (_error) {
        island = null;
      }
    }

    const islandWins = Boolean(island && Number(island.field) > best.field && Number(island.field) > 0);
    const mass = islandWins ? BODY_MASSES.find((m) => m.key === island.key) || best.mass : best.mass;
    const field = islandWins ? Number(island.field) : best.field;
    const isLand = field > 0;

    const coast = smoothstep(0, 0.86, 1 - clamp(Math.abs(field) * 15, 0, 1));
    const shelfBase = smoothstep(-0.24, 0.04, field);
    const shelfTexture = smoothstep(0.16, 0.90, ridged(u * 1.7 + 0.05, v * 1.35 - 0.03, 23000));
    const shelf = isLand ? 0 : clamp(shelfBase * coast * (0.30 + mass.shelf * 0.70) * (0.46 + shelfTexture * 0.42), 0, 1);
    const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.82, 0, 1);

    const base = {
      u,
      v,
      lon: p.lon,
      lat: p.lat,
      lonDegrees: p.lon / DEG,
      latDegrees: p.lat / DEG,
      field,
      isLand,
      isWater: !isLand,
      primaryMassId: mass.id,
      primaryMassKey: mass.key,
      primaryMassName: mass.name,
      coast,
      shelf,
      shelfTexture,
      deepOcean,
      isIsland: islandWins,
      islandField: island ? Number(island.field) : -1,
      islandKey: island ? safeString(island.key) : "",
      coastlineModifier: best.modifier || null,
      noise: noise(u, v, 48, 26000)
    };

    let terrain = null;

    if (extension && isFunction(extension.sampleTerrain)) {
      try {
        terrain = extension.sampleTerrain(u, v, base);
      } catch (_error) {
        terrain = null;
      }
    }

    if (!terrain || !isObject(terrain)) {
      terrain = fallbackTerrainExtensionSample(u, v, base);
    }

    let elevationSample = null;

    if (elevation && isFunction(elevation.sampleElevation)) {
      try {
        elevationSample = elevation.sampleElevation(u, v, base, terrain);
      } catch (_error) {
        elevationSample = null;
      }
    }

    if (!elevationSample || !isObject(elevationSample)) {
      elevationSample = fallbackElevationSample(u, v, base, terrain);
    }

    let climateSample = null;

    if (climate && isFunction(climate.sampleClimate)) {
      try {
        climateSample = climate.sampleClimate(u, v, base, terrain, elevationSample);
      } catch (_error) {
        climateSample = null;
      }
    }

    if (!climateSample || !isObject(climateSample)) {
      climateSample = fallbackClimateSample(u, v, base, terrain, elevationSample);
    }

    return {
      ...base,
      terrainExtensionLoaded: Boolean(extension),
      elevationAuthorityLoaded: Boolean(elevation),
      climateAuthorityLoaded: Boolean(climate),
      terrain,
      elevation: elevationSample,
      climate: climateSample
    };
  }

  function biomeBaseColor(climate) {
    switch (climate && climate.biome) {
      case "ice-cap": return C.ice;
      case "snowy-mountains": return C.snow;
      case "rocky-mountains": return C.granite;
      case "highland-forest": return C.highlandForest;
      case "dry-highlands": return C.dryHighland;
      case "hot-desert": return C.desert;
      case "semi-desert": return C.semiDesert;
      case "wet-forest": return C.wetForest;
      case "seasonal-forest": return C.seasonalForest;
      case "savanna": return C.savanna;
      case "wetland": return C.wetland;
      case "temperate-forest": return C.temperateForest;
      case "plains": return C.plains;
      case "steppe": return C.steppe;
      case "tundra": return C.tundra;
      case "cold-steppe": return C.coldSteppe;
      case "mixed-lowland": return C.lowland;
      default: return C.lowland;
    }
  }

  function terrainClassFor(t, terrain, elevation, climate) {
    if (!t.isLand) {
      if (t.shelf > 0.42) return "shallow_shelf";
      if (t.deepOcean > 0.68) return "deep_ocean_basin";
      return "ocean_basin";
    }

    if ((climate.ice || 0) > 0.70) return "ice_cap";
    if ((elevation.peakHighlight || 0) > 0.42) return "snow_peak";
    if ((elevation.mountainRange || 0) > 0.52) return "mountain_range";
    if ((elevation.cliffWall || 0) > 0.42) return "cliff_wall";
    if (t.coast > 0.60) return "coastal_land";
    if (terrain && terrain.terrainClass) return terrain.terrainClass;
    return climate.biome || "continental_land";
  }

  function sample(a, b, c) {
    const t = classify(a, b, c);
    const terrain = t.terrain || {};
    const elevation = t.elevation || {};
    const climate = t.climate || {};

    let color;

    if (!t.isLand) {
      color = mix(C.abyss, C.deep, clamp(0.22 + t.noise * 0.44, 0, 1));
      color = mix(color, C.ocean, smoothstep(0.18, 0.76, 1 - t.deepOcean) * 0.42);
      color = mix(color, C.shelf, t.shelf * 0.62);
      color = mix(color, C.shelfSoft, t.shelf * t.coast * 0.28);
      color = mix(color, C.foam, t.shelf * t.coast * 0.10);
      color = lift(color, -8 * t.deepOcean + (t.noise - 0.5) * 5 - (elevation.shelfDrop || 0) * 5);
    } else {
      color = biomeBaseColor(climate);

      color = mix(color, C.wetForest, smoothstep(0.58, 0.92, climate.moisture || 0) * smoothstep(0.44, 0.82, climate.temperature || 0) * 0.24);
      color = mix(color, C.desert, smoothstep(0.62, 0.94, climate.aridity || 0) * 0.30);
      color = mix(color, C.plains, smoothstep(0.36, 0.62, climate.moisture || 0) * smoothstep(0.22, 0.62, climate.temperature || 0) * 0.18);
      color = mix(color, C.wetland, smoothstep(0.66, 0.96, climate.wetness || 0) * 0.20);
      color = mix(color, C.tundra, smoothstep(0.48, 0.86, climate.latitudeCold || 0) * (1 - (climate.ice || 0)) * 0.18);

      color = mix(color, C.upland, (elevation.verticalRelief || 0) * 0.24);
      color = mix(color, C.highland, (elevation.foothills || 0) * 0.14);
      color = mix(color, C.ridge, (elevation.mountainRange || 0) * 0.38);
      color = mix(color, C.granite, (elevation.exposedRock || 0) * 0.34);
      color = mix(color, C.graniteLight, (elevation.peakHighlight || 0) * 0.30);
      color = mix(color, C.slate, (elevation.exposedRock || 0) * 0.24);
      color = mix(color, C.cliff, clamp((elevation.cliffWall || 0) + (elevation.escarpment || 0) * 0.48, 0, 1) * 0.50);
      color = mix(color, C.cliffShadow, (elevation.cliffShadow || 0) * 0.42);
      color = mix(color, C.shadow, (elevation.basinShadow || 0) * 0.30);

      color = mix(color, C.wetBeach, t.coast * 0.14);
      color = mix(color, C.beach, clamp(t.coast + (terrain.islandEdge || 0) * 0.24, 0, 1) * 0.18);

      color = mix(color, C.polar, (elevation.snowLine || 0) * 0.22);
      color = mix(color, C.ice, (elevation.snowLine || 0) * 0.34);
      color = mix(color, C.snow, (elevation.peakHighlight || 0) * (elevation.snowLine || 0) * 0.42);

      color = mix(color, C.copper, (elevation.mineralFace || 0) * 0.08);
      color = mix(color, C.gold, (elevation.mineralFace || 0) * smoothstep(0.70, 0.96, elevation.micro || 0) * 0.12);
      color = mix(color, C.opal, (t.coast > 0.60 ? 0.14 : 0.04) * (elevation.mineralFace || 0));

      const climateLift =
        (climate.moisture || 0) * 2 -
        (climate.aridity || 0) * 4 -
        (climate.latitudeCold || 0) * 2;

      const depthLift =
        (elevation.verticalRelief || 0) * 11 +
        (elevation.peakHighlight || 0) * 17 +
        (elevation.foothills || 0) * 3 -
        (elevation.cliffShadow || 0) * 15 -
        (elevation.basinShadow || 0) * 9 -
        (elevation.valley || 0) * 6 -
        (elevation.cliffWall || 0) * 4 +
        (terrain.grainTexture || 0) * 4 -
        3;

      color = lift(color, depthLift + climateLift);
    }

    const terrainClass = terrainClassFor(t, terrain, elevation, climate);
    const rgb = [
      clamp(color[0], 0, 255),
      clamp(color[1], 0, 255),
      clamp(color[2], 0, 255)
    ];

    state.sampleCount += 1;
    state.lastSampleAt = nowIso();
    state.updatedAt = state.lastSampleAt;

    const waterDepth = !t.isLand ? clamp01(t.deepOcean * 0.70 + (1 - t.shelf) * 0.22) : 0;
    const waterFillStrength = !t.isLand ? clamp01(0.28 + t.deepOcean * 0.44 + t.shelf * 0.22) : 0;
    const relief = clamp01((elevation.verticalRelief || 0) + (elevation.mountainRange || 0) * 0.60 + (elevation.cliffWall || 0) * 0.44);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      assetsContract: ASSETS_CONTRACT,
      assetsReceipt: ASSETS_RECEIPT,
      version: VERSION,
      authority: "materials",
      role: "hearth-material-authority-assets-exchange",

      u: t.u,
      v: t.v,
      lon: t.lonDegrees,
      lat: t.latDegrees,
      x: Math.sin(t.lon) * Math.cos(t.lat),
      y: Math.sin(t.lat),
      z: Math.cos(t.lon) * Math.cos(t.lat),

      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
      alpha: 1,

      isLand: Boolean(t.isLand),
      isWater: !t.isLand,
      isCoast: t.coast > 0.48,
      isIsland: Boolean(t.isIsland),

      terrainClass,
      materialClass: t.isLand ? `biome.${climate.biome || "mixed-lowland"}` : (t.shelf > 0.42 ? "water.shallow_shelf" : "water.ocean_basin"),
      hydrologyClass: t.isLand ? "land_surface" : (t.shelf > 0.42 ? "shallow_shelf" : "open_ocean"),
      continentId: t.primaryMassKey,
      primaryMassId: t.primaryMassId,
      primaryMassKey: t.primaryMassKey,
      primaryMassName: t.primaryMassName,
      biome: climate.biome || "",

      field: t.field,
      elevation: Number.isFinite(Number(elevation.elevation)) ? Number(elevation.elevation) : (t.isLand ? t.field : -waterDepth),
      coast: t.coast,
      shelf: t.shelf,
      deepOcean: t.deepOcean,

      waterFillMaterialFeed: waterFillStrength,
      waterFillStrength,
      waterDepth,
      shallowShelfMaterialFeed: t.shelf,
      sandShelfMaterialFeed: t.shelf * t.coast,
      shelfTransition: t.shelf * (1 - t.deepOcean),
      waterlineMaterialFeed: t.coast,
      beachMaterialFeed: t.isLand ? t.coast * 0.54 : t.shelf * t.coast * 0.22,
      wetStoneMaterialFeed: t.coast * clamp01((elevation.cliffWall || 0) + 0.18),
      hardCoastMaterialFeed: t.coast * clamp01(elevation.cliffWall || 0),
      cliffWaterEdgeMaterialFeed: t.coast * clamp01(elevation.escarpment || 0),
      shorelineGrounding: t.coast,

      terrainRelief: relief,
      ridgeRelief: clamp01((elevation.verticalRelief || 0) + (elevation.foothills || 0) * 0.30),
      mountainRangeMaterialFeed: clamp01(elevation.mountainRange || 0),
      ridgeChainMaterialFeed: clamp01((elevation.mountainRange || 0) * 0.50 + (elevation.foothills || 0) * 0.28),
      peakMassifMaterialFeed: clamp01(elevation.peakHighlight || 0),
      coordinateSummitMaterialFeed: clamp01((elevation.peakHighlight || 0) * 0.72),
      canyonCarveMaterialFeed: clamp01((elevation.valley || 0) * 0.34 + (elevation.basinShadow || 0) * 0.22),
      canyonDepthMaterialFeed: clamp01((elevation.basinShadow || 0) * 0.42 + (elevation.cliffShadow || 0) * 0.18),
      exposedWaterCutMaterialFeed: clamp01(t.coast * (elevation.cliffWall || 0)),
      basinShade: clamp01(elevation.basinShadow || 0),

      submergedScarMaterialFeed: !t.isLand ? clamp01(t.shelf * (elevation.shelfDrop || 0)) : 0,
      submergedBlockMaterialFeed: !t.isLand ? clamp01(t.shelf * (terrain.fractureTexture || 0) * 0.50) : 0,
      oldCoastalTechUnderwaterMaterialFeed: !t.isLand ? clamp01(t.shelf * t.coast * 0.20) : 0,
      boundaryMorphologyFeed: clamp01((terrain.fractureTexture || 0) * 0.50 + t.coast * 0.30),

      climate,
      terrain,
      elevationPacket: elevation,
      terrainExtensionLoaded: state.terrainExtensionLoaded,
      elevationAuthorityLoaded: state.elevationAuthorityLoaded,
      climateAuthorityLoaded: state.climateAuthorityLoaded,

      materialAuthorityPublished: true,
      materialAliasesPublished: state.materialAliasesPublished,
      eastConsumableMaterialApi: true,
      sampleObjectCompatible: true,
      sampleUvCompatible: true,
      sampleXyzCompatible: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      materialAuthorityDoesNotOwnCanvas: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function read(a, b, c) {
    return sample(a, b, c);
  }

  function getMaterial(a, b, c) {
    return sample(a, b, c);
  }

  function materialAt(a, b, c) {
    return sample(a, b, c);
  }

  function getMaterialAt(a, b, c) {
    return sample(a, b, c);
  }

  function getSurfaceMaterial(a, b, c) {
    return sample(a, b, c);
  }

  function resolve(a, b, c) {
    return sample(a, b, c);
  }

  function resolveMaterial(a, b, c) {
    return sample(a, b, c);
  }

  function createTextureCanvas(options = {}) {
    if (!doc || !isFunction(doc.createElement)) {
      state.lastError = "document-createElement-unavailable";
      state.updatedAt = nowIso();
      return null;
    }

    const mobile =
      root.innerWidth <= 760 ||
      (root.matchMedia && root.matchMedia("(pointer: coarse)").matches);

    const width = Math.max(256, Math.round(safeNumber(options.width || options.atlasWidth, mobile ? 1024 : 2048)));
    const height = Math.max(128, Math.round(safeNumber(options.height || options.atlasHeight, Math.round(width / 2))));
    const canvas = doc.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });

    if (!ctx) {
      state.lastError = "2d-context-unavailable";
      state.updatedAt = nowIso();
      return null;
    }

    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0.5 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0.5 : x / (width - 1);
        const result = sample({ u, v });
        const i = (y * width + x) * 4;

        data[i] = result.rgb[0];
        data[i + 1] = result.rgb[1];
        data[i + 2] = result.rgb[2];
        data[i + 3] = 255;
      }

      if (isFunction(options.onProgress) && (y % 16 === 0 || y === height - 1)) {
        try {
          options.onProgress(Math.round(((y + 1) / height) * 100), getReceipt());
        } catch (_error) {}
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
    canvas.dataset.hearthAssetsContract = ASSETS_CONTRACT;
    canvas.dataset.hearthAssetsReceipt = ASSETS_RECEIPT;
    canvas.dataset.hearthMaterialAuthorityPublished = "true";
    canvas.dataset.hearthMaterialAliasesPublished = String(state.materialAliasesPublished);
    canvas.dataset.hearthEastConsumableMaterialApi = "true";
    canvas.dataset.hearthBiomeColorNotBodyMassColor = "true";
    canvas.dataset.hearthBodyMassAssignedColoring = "false";
    canvas.dataset.hearthBodyMassCount = String(BODY_MASSES.length);
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    state.textureBuildCount += 1;
    state.lastTextureBuildAt = nowIso();
    state.lastTextureWidth = width;
    state.lastTextureHeight = height;
    state.updatedAt = state.lastTextureBuildAt;

    updateDataset();

    return canvas;
  }

  function createHearthTextureCanvas(options = {}) {
    return createTextureCanvas(options);
  }

  function getStatus() {
    const extension = terrainExtension();
    const elevation = elevationAuthority();
    const climate = climateAuthority();

    state.terrainExtensionLoaded = Boolean(extension);
    state.elevationAuthorityLoaded = Boolean(elevation);
    state.climateAuthorityLoaded = Boolean(climate);
    state.updatedAt = nowIso();

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      assetsContract: ASSETS_CONTRACT,
      assetsReceipt: ASSETS_RECEIPT,
      previousAssetsContract: PREVIOUS_ASSETS_CONTRACT,
      previousMaterialContract: PREVIOUS_MATERIAL_CONTRACT,
      requiredTerrainExtension: REQUIRED_TERRAIN_EXTENSION,
      requiredElevation: REQUIRED_ELEVATION,
      requiredClimate: REQUIRED_CLIMATE,
      blueprint: BLUEPRINT,
      version: VERSION,
      file: FILE,
      role: state.role,

      materialAuthorityPublished: true,
      materialAliasesPublished: state.materialAliasesPublished,
      eastConsumableMaterialApi: true,
      sampleObjectCompatible: true,
      sampleUvCompatible: true,
      sampleXyzCompatible: true,

      terrainExtensionLoaded: state.terrainExtensionLoaded,
      elevationAuthorityLoaded: state.elevationAuthorityLoaded,
      climateAuthorityLoaded: state.climateAuthorityLoaded,

      assetsConsumeDedicatedElevation: true,
      assetsConsumeClimateAuthority: true,
      biomeColorNotBodyMassColor: true,
      bodyMassAssignedColoring: false,
      climateRegionDifferentiationActive: true,
      tangibleElevationLoaded: true,
      mountainRangeLoaded: true,
      foothillsLoaded: true,
      cliffSystemLoaded: true,
      visualDepthActive: true,
      undefinedColorReferenceRepaired: true,

      bodyMassCount: BODY_MASSES.length,
      uniqueMassProfiles: true,
      twoBodyRead: false,

      apiSurface: [
        "sample",
        "read",
        "getMaterial",
        "materialAt",
        "getMaterialAt",
        "getSurfaceMaterial",
        "resolve",
        "resolveMaterial",
        "createTextureCanvas",
        "createHearthTextureCanvas",
        "classify",
        "getReceipt",
        "getStatus"
      ],

      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      routeTouched: false,
      htmlTouched: false,
      ownsCanvas: false,
      ownsEastAtlasBuild: false,
      ownsSouthRendering: false,
      ownsWestInspection: false,
      ownsF21: false,
      ownsReadyText: false,

      sampleCount: state.sampleCount,
      textureBuildCount: state.textureBuildCount,
      lastSampleAt: state.lastSampleAt,
      lastTextureBuildAt: state.lastTextureBuildAt,
      lastTextureWidth: state.lastTextureWidth,
      lastTextureHeight: state.lastTextureHeight,
      lastError: state.lastError,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    });
  }

  function getReceipt() {
    return getStatus();
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `assetsContract=${r.assetsContract}`,
      `assetsReceipt=${r.assetsReceipt}`,
      `previousAssetsContract=${r.previousAssetsContract}`,
      `previousMaterialContract=${r.previousMaterialContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `materialAuthorityPublished=${r.materialAuthorityPublished}`,
      `materialAliasesPublished=${r.materialAliasesPublished}`,
      `eastConsumableMaterialApi=${r.eastConsumableMaterialApi}`,
      `sampleObjectCompatible=${r.sampleObjectCompatible}`,
      `sampleUvCompatible=${r.sampleUvCompatible}`,
      `sampleXyzCompatible=${r.sampleXyzCompatible}`,
      "",
      `requiredTerrainExtension=${r.requiredTerrainExtension}`,
      `requiredElevation=${r.requiredElevation}`,
      `requiredClimate=${r.requiredClimate}`,
      `terrainExtensionLoaded=${r.terrainExtensionLoaded}`,
      `elevationAuthorityLoaded=${r.elevationAuthorityLoaded}`,
      `climateAuthorityLoaded=${r.climateAuthorityLoaded}`,
      "",
      `biomeColorNotBodyMassColor=${r.biomeColorNotBodyMassColor}`,
      `bodyMassAssignedColoring=${r.bodyMassAssignedColoring}`,
      `climateRegionDifferentiationActive=${r.climateRegionDifferentiationActive}`,
      `undefinedColorReferenceRepaired=${r.undefinedColorReferenceRepaired}`,
      `bodyMassCount=${r.bodyMassCount}`,
      `twoBodyRead=${r.twoBodyRead}`,
      "",
      `runtimeTouched=${r.runtimeTouched}`,
      `controlsTouched=${r.controlsTouched}`,
      `canvasTouched=${r.canvasTouched}`,
      `routeTouched=${r.routeTouched}`,
      `htmlTouched=${r.htmlTouched}`,
      `ownsCanvas=${r.ownsCanvas}`,
      `ownsEastAtlasBuild=${r.ownsEastAtlasBuild}`,
      `ownsSouthRendering=${r.ownsSouthRendering}`,
      `ownsWestInspection=${r.ownsWestInspection}`,
      `ownsF21=${r.ownsF21}`,
      `ownsReadyText=${r.ownsReadyText}`,
      "",
      `sampleCount=${r.sampleCount}`,
      `textureBuildCount=${r.textureBuildCount}`,
      `lastSampleAt=${r.lastSampleAt}`,
      `lastTextureBuildAt=${r.lastTextureBuildAt}`,
      `lastTextureWidth=${r.lastTextureWidth}`,
      `lastTextureHeight=${r.lastTextureHeight}`,
      `lastError=${r.lastError}`,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthMaterialsLoaded = "true";
    dataset.hearthMaterialsContract = CONTRACT;
    dataset.hearthMaterialsReceipt = RECEIPT;
    dataset.hearthMaterialsVersion = VERSION;
    dataset.hearthMaterialAuthorityPublished = "true";
    dataset.hearthMaterialAliasesPublished = String(state.materialAliasesPublished);
    dataset.hearthEastConsumableMaterialApi = "true";
    dataset.hearthMaterialSampleObjectCompatible = "true";
    dataset.hearthMaterialSampleUvCompatible = "true";
    dataset.hearthMaterialSampleXyzCompatible = "true";

    dataset.hearthAssetsLoaded = "true";
    dataset.hearthAssetsContract = ASSETS_CONTRACT;
    dataset.hearthAssetsReceipt = ASSETS_RECEIPT;
    dataset.hearthAssetsPreviousContract = PREVIOUS_ASSETS_CONTRACT;
    dataset.hearthAssetsVersion = VERSION;

    dataset.hearthTerrainExtensionContract = REQUIRED_TERRAIN_EXTENSION;
    dataset.hearthElevationAuthorityContract = REQUIRED_ELEVATION;
    dataset.hearthClimateAuthorityContract = REQUIRED_CLIMATE;
    dataset.hearthTerrainExtensionLoaded = String(Boolean(terrainExtension()));
    dataset.hearthElevationAuthorityLoaded = String(Boolean(elevationAuthority()));
    dataset.hearthClimateAuthorityLoaded = String(Boolean(climateAuthority()));

    dataset.hearthBiomeColorNotBodyMassColor = "true";
    dataset.hearthBodyMassAssignedColoring = "false";
    dataset.hearthClimateRegionDifferentiationActive = "true";
    dataset.hearthUndefinedColorReferenceRepaired = "true";
    dataset.hearthBodyMassCount = String(BODY_MASSES.length);
    dataset.hearthTwoBodyRead = "false";

    dataset.hearthAssetsRuntimeTouched = "false";
    dataset.hearthAssetsControlsTouched = "false";
    dataset.hearthAssetsCanvasTouched = "false";
    dataset.hearthAssetsRouteTouched = "false";
    dataset.hearthAssetsHtmlTouched = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    const api = publicApi;

    root.HEARTH.materials = api;
    root.HEARTH.materialAuthority = api;
    root.HEARTH.materialsAuthority = api;
    root.HEARTH.surfaceMaterials = api;
    root.HEARTH.assets = api;
    root.HEARTH.assetsAuthority = api;

    root.HEARTH_MATERIALS = api;
    root.HEARTH_MATERIAL_AUTHORITY = api;
    root.HEARTH_MATERIALS_AUTHORITY = api;
    root.HEARTH_SURFACE_MATERIALS = api;
    root.HEARTH_ASSETS = api;
    root.HEARTH_ASSETS_AUTHORITY = api;

    root.HearthMaterials = api;
    root.HearthMaterialAuthority = api;
    root.HearthAssets = api;

    root.DEXTER_LAB.hearthMaterials = api;
    root.DEXTER_LAB.hearthMaterialAuthority = api;
    root.DEXTER_LAB.hearthMaterialsAuthority = api;
    root.DEXTER_LAB.hearthSurfaceMaterials = api;
    root.DEXTER_LAB.hearthAssets = api;
    root.DEXTER_LAB.hearthAssetsAuthority = api;

    root.__HEARTH_MATERIALS_CONTRACT__ = CONTRACT;
    root.__HEARTH_MATERIALS_RECEIPT__ = RECEIPT;
    root.__HEARTH_MATERIAL_AUTHORITY_PUBLISHED__ = true;
    root.__HEARTH_MATERIAL_ALIASES_PUBLISHED__ = true;
    root.__HEARTH_EAST_CONSUMABLE_MATERIAL_API__ = true;
    root.__HEARTH_ASSETS_VISUAL_PASS_CLAIMED__ = false;

    state.materialAliasesPublished = true;
    state.updatedAt = nowIso();

    const receipt = getReceipt();

    root.HEARTH_MATERIALS_RECEIPT = receipt;
    root.HEARTH_MATERIAL_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_ASSETS_RECEIPT = receipt;
    root.HEARTH.materialsReceipt = receipt;
    root.HEARTH.materialAuthorityReceipt = receipt;
    root.HEARTH.assetsReceipt = receipt;
    root.DEXTER_LAB.hearthMaterialsReceipt = receipt;
    root.DEXTER_LAB.hearthMaterialAuthorityReceipt = receipt;
    root.DEXTER_LAB.hearthAssetsReceipt = receipt;

    updateDataset();
  }

  const publicApi = {
    contract: CONTRACT,
    receipt: RECEIPT,
    assetsContract: ASSETS_CONTRACT,
    assetsReceipt: ASSETS_RECEIPT,
    previousAssetsContract: PREVIOUS_ASSETS_CONTRACT,
    previousMaterialContract: PREVIOUS_MATERIAL_CONTRACT,
    requiredTerrainExtension: REQUIRED_TERRAIN_EXTENSION,
    requiredElevation: REQUIRED_ELEVATION,
    requiredClimate: REQUIRED_CLIMATE,
    blueprint: BLUEPRINT,
    version: VERSION,
    file: FILE,

    bodyMasses: BODY_MASSES,
    colors: C,

    classify,
    sample,
    read,
    getMaterial,
    materialAt,
    getMaterialAt,
    getSurfaceMaterial,
    resolve,
    resolveMaterial,
    createTextureCanvas,
    createHearthTextureCanvas,
    getStatus,
    getReceipt,
    getReceiptText,

    materialAuthorityPublished: true,
    materialAliasesPublished: true,
    eastConsumableMaterialApi: true,
    sampleObjectCompatible: true,
    sampleUvCompatible: true,
    sampleXyzCompatible: true,
    undefinedColorReferenceRepaired: true,

    ownsMaterialExpression: true,
    ownsColorExpression: true,
    ownsBiomeRegionColoring: true,
    ownsCanvas: false,
    ownsEastAtlasBuild: false,
    ownsSouthRendering: false,
    ownsWestInspection: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteOrchestration: false,
    ownsNewsFinalization: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  try {
    publishGlobals();
    updateDataset();
  } catch (error) {
    state.lastError = error && error.message ? error.message : String(error);
    state.updatedAt = nowIso();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicApi;
  }
})();
