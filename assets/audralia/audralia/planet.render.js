/*
  /assets/audralia/audralia.planet.render.js
  AUDRALIA_PARENT_4K_BASELINE_CHILD_HANDOFF_TNT_v2

  Purpose:
  - Preserve Audralia parent authority without parent overreach.
  - Parent owns only:
    1. Audralia identity
    2. baseline planet body
    3. baseline land/water divide
    4. simple sphere projection
    5. child-system handoff receipts
  - 4K visual refinement is allowed only as baseline texture quality, lighting, coastline softness, and sphere projection stability.
  - Terrain pressure, topology details, hydration, climate, oceans, deep ocean, hex surface, runtime, and ecology remain downstream child responsibilities.

  API preserved:
  - createProfile
  - buildTexture
  - sampleSurface
  - renderSurface
  - getStatus
  - registerExtension
*/

(function () {
  "use strict";

  const VERSION = "AUDRALIA_PARENT_4K_BASELINE_CHILD_HANDOFF_TNT_v2";
  const COMPATIBILITY_VERSION = "AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1";

  const CHILD_RECEIPTS = Object.freeze({
    topology: "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    terrain: "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v3",
    climate: "AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2",
    runtime: "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    hexSurface: "AUDRALIA_G9_HEX_CHILD_4K_MICRO_SURFACE_GLAZE_TNT_v1",
    canvas: "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1"
  });

  const BODY = Object.freeze({
    id: "audralia",
    legacyId: "audrelia",
    label: "Audralia",
    publicLabel: "Audralia",
    classification: "constructed-home-world-body",
    parentAuthority: "/assets/audralia/audralia.planet.render.js",
    generation: "G3_PARENT_4K_BASELINE_CHILD_HANDOFF",
    generationClaim: "G3_PARENT_BASELINE",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const CONTRACT = Object.freeze({
    parentOwns: [
      "identity",
      "baseline_sphere",
      "baseline_land_water_divide",
      "simple_projection",
      "child_handoff",
      "baseline_texture_quality"
    ],
    parentDoesNotOwn: [
      "topology_land_void_authority",
      "terrain_pressure",
      "full_island_density",
      "region_elevation_engine",
      "hydration_network",
      "ocean_authority",
      "deep_ocean_authority",
      "full_climate_model",
      "hex_surface_child",
      "runtime_composition",
      "biome_ecology_expansion",
      "heavy_world_simulation"
    ],
    topologyChildRequired: true,
    terrainChildRequired: true,
    hydrationChildRequired: true,
    climateChildRequired: true,
    runtimeChildRequired: true,
    hexSurfaceChildRequired: true,
    ecologyChildLater: true,
    southPoleIceOnly: true,
    northPoleLandAllowed: true,
    noParentBloat: true,
    imageGeneration: false,
    graphicBox: false,
    staticPictureReplacement: false,
    visualPass: BODY.visualPass
  });

  const BASELINE_LAND_BODIES = Object.freeze([
    {
      id: "dominant-mainland",
      lon: 0.43,
      lat: 0.49,
      radiusX: 0.155,
      radiusY: 0.185,
      height: 0.56,
      moisture: 0.08,
      tone: "granite-slate-mainland"
    },
    {
      id: "western-body",
      lon: 0.18,
      lat: 0.49,
      radiusX: 0.115,
      radiusY: 0.145,
      height: 0.42,
      moisture: 0.04,
      tone: "weathered-western-stone"
    },
    {
      id: "eastern-body",
      lon: 0.70,
      lat: 0.51,
      radiusX: 0.115,
      radiusY: 0.145,
      height: 0.40,
      moisture: 0.12,
      tone: "opal-coastal-rise"
    },
    {
      id: "southern-island-body",
      lon: 0.58,
      lat: 0.66,
      radiusX: 0.088,
      radiusY: 0.073,
      height: 0.30,
      moisture: 0.18,
      tone: "south-shelf-body"
    },
    {
      id: "north-polar-land",
      lon: 0.50,
      lat: 0.08,
      radiusX: 0.18,
      radiusY: 0.078,
      height: 0.34,
      moisture: -0.02,
      tone: "north-polar-land"
    }
  ]);

  const BASELINE_ISLANDS = Object.freeze([
    { lon: 0.09, lat: 0.54, radius: 0.026, height: 0.22 },
    { lon: 0.14, lat: 0.58, radius: 0.018, height: 0.18 },
    { lon: 0.34, lat: 0.56, radius: 0.024, height: 0.20 },
    { lon: 0.39, lat: 0.62, radius: 0.018, height: 0.18 },
    { lon: 0.53, lat: 0.68, radius: 0.024, height: 0.20 },
    { lon: 0.61, lat: 0.70, radius: 0.020, height: 0.18 },
    { lon: 0.76, lat: 0.46, radius: 0.022, height: 0.20 },
    { lon: 0.82, lat: 0.52, radius: 0.018, height: 0.18 },
    { lon: 0.49, lat: 0.20, radius: 0.020, height: 0.18 },
    { lon: 0.56, lat: 0.22, radius: 0.018, height: 0.18 }
  ]);

  const PALETTE = Object.freeze({
    deepOcean: "#05143f",
    openOcean: "#0b3f78",
    midOcean: "#12689d",
    shelf: "#27b8c3",
    reef: "#72d6c3",
    lowland: "#6f8a54",
    greenBasin: "#3f8c58",
    dryUpland: "#ad8351",
    highland: "#8f7f67",
    granite: "#aaa07f",
    coast: "#d1b878",
    opalSand: "#eadfb8",
    blackSand: "#292724",
    southIce: "#edf8fb",
    northIce: "#d8ebf2",
    snow: "#ffffff",
    atmosphere: "#b8ddff"
  });

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const d = edge1 - edge0;
    if (Math.abs(d) < 0.000001) return x >= edge1 ? 1 : 0;
    const t = clamp((x - edge0) / d, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((Number(value) % 1) + 1) % 1;
  }

  function wrapDistance(a, b) {
    const direct = Math.abs(a - b);
    return Math.min(direct, 1 - direct);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
  }

  function noise(x, y, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const a = hash2(xi, yi, seed);
    const b = hash2(xi + 1, yi, seed);
    const c = hash2(xi, yi + 1, seed);
    const d = hash2(xi + 1, yi + 1, seed);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function fbm(x, y, octaves, seed) {
    let total = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(x * freq, y * freq, seed + i * 31.17) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function colorToBytes(hex) {
    const normalized = String(hex || "#000000").replace("#", "");

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function mixColor(a, b, amount) {
    const ca = typeof a === "string" ? colorToBytes(a) : a;
    const cb = typeof b === "string" ? colorToBytes(b) : b;
    const t = clamp(amount, 0, 1);

    return {
      r: Math.round(lerp(ca.r, cb.r, t)),
      g: Math.round(lerp(ca.g, cb.g, t)),
      b: Math.round(lerp(ca.b, cb.b, t))
    };
  }

  function shadeColor(color, amount) {
    return {
      r: clamp(Math.round(color.r * amount), 0, 255),
      g: clamp(Math.round(color.g * amount), 0, 255),
      b: clamp(Math.round(color.b * amount), 0, 255)
    };
  }

  function ellipseInfluence(x, y, body, noiseScale) {
    const dx = wrapDistance(x, body.lon) / body.radiusX;
    const dy = Math.abs(y - body.lat) / body.radiusY;
    const d = Math.sqrt(dx * dx + dy * dy);
    const wobble =
      (fbm(x * noiseScale + body.lon * 31, y * noiseScale + body.lat * 41, 4, 1100) - 0.5) * 0.18 +
      (fbm(x * noiseScale * 2.2 + body.lon * 11, y * noiseScale * 2.2 + body.lat * 13, 2, 1200) - 0.5) * 0.05;

    return smoothstep(1.08, 0.34, d + wobble);
  }

  function islandInfluence(x, y, island) {
    const dx = wrapDistance(x, island.lon) / island.radius;
    const dy = Math.abs(y - island.lat) / (island.radius * 0.82);
    const d = Math.sqrt(dx * dx + dy * dy);
    const wobble =
      (fbm(x * 80 + island.lon * 17, y * 80 + island.lat * 19, 3, 2100) - 0.5) * 0.13;

    return smoothstep(1.0, 0.28, d + wobble);
  }

  function baseElevation(x, y) {
    let elevation = -0.46;
    let moisture = 0;
    let dominant = "open-ocean";
    let strength = 0;
    let tone = "ocean";

    for (let i = 0; i < BASELINE_LAND_BODIES.length; i += 1) {
      const body = BASELINE_LAND_BODIES[i];
      const influence = ellipseInfluence(x, y, body, 34);

      elevation += body.height * influence;
      moisture += body.moisture * influence;

      if (influence > strength) {
        strength = influence;
        dominant = body.id;
        tone = body.tone;
      }
    }

    for (let i = 0; i < BASELINE_ISLANDS.length; i += 1) {
      const island = BASELINE_ISLANDS[i];
      const influence = islandInfluence(x, y, island);

      elevation += island.height * influence;
      moisture += 0.12 * influence;

      if (influence > strength) {
        strength = influence;
        dominant = "misc-island";
        tone = "island-shelf";
      }
    }

    const broadRelief = (fbm(x * 5.5 + 4, y * 5.5 + 8, 5, 3100) - 0.5) * 0.105 * clamp(strength + 0.15, 0, 1);
    const erosion = (fbm(x * 22 + 11, y * 19 + 7, 4, 3200) - 0.5) * 0.052 * clamp(strength + 0.2, 0, 1);
    const micro = (fbm(x * 96 + 9, y * 88 + 4, 3, 3300) - 0.5) * 0.018 * clamp(strength + 0.35, 0, 1);

    return {
      elevation: clamp(elevation + broadRelief + erosion + micro, -0.95, 0.82),
      moisture: clamp(0.45 + moisture, 0, 1),
      dominant,
      strength,
      tone
    };
  }

  function normalizeSampleInput(input, yInput) {
    let x;
    let y;

    if (typeof input === "object" && input !== null) {
      if (Number.isFinite(input.u) || Number.isFinite(input.v)) {
        x = wrap01(Number(input.u) || 0);
        y = clamp(Number(input.v) || 0, 0, 1);
      } else if (Number.isFinite(input.x) || Number.isFinite(input.y)) {
        x = wrap01(Number(input.x) || 0);
        y = clamp(Number(input.y) || 0, 0, 1);
      } else if (Number.isFinite(input.lonDeg) || Number.isFinite(input.latDeg)) {
        x = wrap01((Number(input.lonDeg) || 0) / 360 + 0.5);
        y = clamp(0.5 - (Number(input.latDeg) || 0) / 180, 0, 1);
      } else if (Number.isFinite(input.lon) || Number.isFinite(input.lat)) {
        const latValue = Number(input.lat) || 0;
        const lonValue = Number(input.lon) || 0;
        const latDeg = Math.abs(latValue) <= Math.PI / 2 + 0.01 ? latValue * 180 / Math.PI : latValue;
        const lonDeg = Math.abs(lonValue) <= Math.PI * 2 + 0.01 ? lonValue * 180 / Math.PI : lonValue;

        x = wrap01(lonDeg / 360 + 0.5);
        y = clamp(0.5 - latDeg / 180, 0, 1);
      } else {
        x = 0.5;
        y = 0.5;
      }
    } else {
      x = wrap01(Number(input) || 0);
      y = clamp(Number(yInput) || 0, 0, 1);
    }

    return { x, y };
  }

  function sampleSurface(input, yInput) {
    const point = normalizeSampleInput(input, yInput);
    const x = point.x;
    const y = point.y;
    const base = baseElevation(x, y);

    const southPolar = smoothstep(0.82, 0.98, y);
    const northPolar = smoothstep(0.78, 0.98, 1 - y);
    const equatorial = 1 - smoothstep(0.08, 0.54, Math.abs(y - 0.5));
    const coastNoise = fbm(x * 52 + 5, y * 46 + 17, 3, 4100);
    const reefNoise = fbm(x * 42 + 5, y * 42 + 17, 3, 4200);

    const southIce = southPolar > 0.32;
    const elevation = southIce ? Math.min(base.elevation, -0.10) : base.elevation;
    const isLand = elevation >= 0 && !southIce;
    const isWater = !isLand && !southIce;
    const isIce = southIce || (northPolar > 0.72 && isLand);

    const depth = isWater ? clamp(Math.abs(elevation), 0, 1) : 0;
    const shelf = isWater && elevation > -0.22 ? clamp(1 - Math.abs(elevation + 0.09) / 0.13, 0, 1) : 0;
    const coast = isLand ? clamp(1 - Math.abs(elevation) / 0.16, 0, 1) : 0;
    const reef = clamp(shelf * equatorial * smoothstep(0.48, 0.78, reefNoise), 0, 1);
    const beach = clamp((coast * 0.75 + shelf * 0.35) * smoothstep(0.2, 0.88, coastNoise), 0, 1);
    const mineral = fbm(x * 66 + 3, y * 59 + 29, 4, 4300);
    const opalSignal = clamp(beach * 0.44 + mineral * 0.26 + reef * 0.18, 0, 1);
    const diamondSignal = clamp(isIce ? 0.50 : isLand ? mineral * 0.32 + coast * 0.16 : 0.05, 0, 1);
    const graniteSignal = clamp(isLand ? base.strength * 0.38 + elevation * 0.24 : 0, 0, 1);
    const slateSignal = clamp(isLand ? (1 - base.moisture) * 0.22 + mineral * 0.20 : 0.08, 0, 1);

    let biome = "deep-ocean";

    if (isIce && southIce) biome = "south-polar-ice-only";
    else if (isIce) biome = "north-polar-land-ice";
    else if (isWater && shelf > 0.25) biome = reef > 0.35 ? "reef-shelf" : "shallow-shelf";
    else if (isWater) biome = depth > 0.48 ? "deep-ocean" : "open-ocean";
    else if (isLand && elevation > 0.45) biome = "highland";
    else if (isLand && base.moisture > 0.62) biome = "green-basin";
    else if (isLand && base.moisture < 0.36) biome = "dry-upland";
    else if (isLand) biome = "temperate-land";

    return {
      x,
      y,
      u: x,
      v: y,
      lonDeg: (x - 0.5) * 360,
      latDeg: (0.5 - y) * 180,
      elevation,
      maxElevation: elevation,
      terrainRelief: isLand || isIce ? clamp(elevation, 0, 1) : 0,
      terrainReliefIndex: isLand || isIce ? clamp(elevation, 0, 1) : 0,
      moisture: base.moisture,
      isLand,
      land: isLand,
      exposedTerrainLand: isLand,
      visibleLand: isLand,
      solidSurfaceLand: isLand || isIce,
      topologyLand: isLand || isIce,
      isWater,
      water: isWater,
      liquidWater: isWater,
      ocean: isWater && shelf <= 0.25,
      isIce,
      ice: isIce,
      glacier: isIce,
      southIce,
      depth,
      maxDepth: depth,
      shelf,
      reef,
      coast,
      coastal: coast > 0 || shelf > 0,
      beach: beach > 0.18,
      beachIndex: beach,
      northPolar,
      southPolar,
      equatorial,
      biome,
      visualSurfaceClass: isIce
        ? "glacier_ice_snowpack_surface"
        : isLand
          ? "inland_terrain_land_surface"
          : shelf > 0.25
            ? "shelf_water_surface"
            : "ocean_water_surface",
      surfaceClass: biome,
      segment: base.dominant,
      segmentStrength: base.strength,
      tone: base.tone,
      turquoise: shelf > 0.25 ? clamp(0.34 + shelf * 0.46 + reef * 0.18, 0, 1) : isWater ? clamp(0.12 + (1 - depth) * 0.24, 0, 1) : 0.08,
      turquoiseIndex: shelf > 0.25 ? clamp(0.34 + shelf * 0.46 + reef * 0.18, 0, 1) : isWater ? clamp(0.12 + (1 - depth) * 0.24, 0, 1) : 0.08,
      blueWaterIndex: isWater ? clamp(0.35 + depth * 0.45, 0, 1) : 0,
      coastlineIndex: clamp(coast * 0.68 + shelf * 0.28, 0, 1),
      shelfIndex: shelf,
      mineralIndex: clamp(mineral, 0, 1),
      opalSignal,
      diamondSignal,
      graniteSignal,
      slateSignal,
      generation: BODY.generation,
      parentRole: "baseline-land-water-only",
      terrainPressure: "child-authority",
      hydrationPressure: "child-authority",
      climatePressure: "child-authority",
      topologyPressure: "child-authority",
      runtimePressure: "child-authority",
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    };
  }

  function surfaceColor(surface) {
    if (surface.isIce) {
      return surface.southIce
        ? mixColor(PALETTE.southIce, PALETTE.snow, 0.62)
        : mixColor(PALETTE.northIce, PALETTE.snow, 0.38);
    }

    if (surface.isWater) {
      let color = mixColor(PALETTE.midOcean, PALETTE.deepOcean, clamp(surface.depth * 1.16, 0, 1));
      color = mixColor(color, PALETTE.shelf, surface.shelf * 0.72);
      color = mixColor(color, PALETTE.reef, surface.reef * 0.66);
      return color;
    }

    let color;

    if (surface.biome === "highland") color = colorToBytes(PALETTE.highland);
    else if (surface.biome === "green-basin") color = colorToBytes(PALETTE.greenBasin);
    else if (surface.biome === "dry-upland") color = colorToBytes(PALETTE.dryUpland);
    else color = colorToBytes(PALETTE.lowland);

    color = mixColor(color, PALETTE.coast, surface.coast * 0.18);
    color = mixColor(color, PALETTE.opalSand, surface.opalSignal * 0.07);
    color = mixColor(color, PALETTE.granite, surface.graniteSignal * 0.08);

    return color;
  }

  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.body = BODY.id;
    canvas.dataset.legacyBody = BODY.legacyId;
    canvas.dataset.label = BODY.label;
    canvas.dataset.version = VERSION;
    canvas.dataset.compatibilityVersion = COMPATIBILITY_VERSION;
    canvas.dataset.generation = BODY.generation;
    canvas.dataset.parentRole = "baseline-land-water-only";
    canvas.dataset.topologyPressure = "child-authority";
    canvas.dataset.terrainPressure = "child-authority";
    canvas.dataset.hydrationPressure = "child-authority";
    canvas.dataset.climatePressure = "child-authority";
    canvas.dataset.runtimePressure = "child-authority";
    canvas.dataset.hexSurfacePressure = "child-authority";
    canvas.dataset.southPole = "ice-only";
    canvas.dataset.visualPass = BODY.visualPass;
    canvas.dataset.graphicBox = "false";
    canvas.dataset.imageGeneration = "false";
    return canvas;
  }

  function buildTexture(options) {
    const config = options || {};
    const width = Math.max(256, Math.min(4096, Number(config.width) || 2048));
    const height = Math.max(128, Math.min(2048, Number(config.height) || 1024));

    const canvas =
      config.canvas && typeof config.canvas.getContext === "function"
        ? config.canvas
        : createCanvas(width, height);

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: false });
    const image = context.createImageData(width, height);
    const data = image.data;

    for (let py = 0; py < height; py += 1) {
      const y = height === 1 ? 0.5 : py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const x = width === 1 ? 0.5 : px / width;
        const surface = sampleSurface(x, y);
        let color = surfaceColor(surface);

        const micro = fbm(x * 120 + 41, y * 112 + 83, 3, 5100);
        const broad = fbm(x * 9 + 13, y * 9 + 19, 4, 5200);
        const terrainLift = surface.isLand ? (micro - 0.5) * 0.055 + (broad - 0.5) * 0.04 : 0;
        const waterMotion = surface.isWater ? (micro - 0.5) * 0.035 + surface.reef * 0.04 : 0;
        const iceLift = surface.isIce ? (micro - 0.5) * 0.045 + 0.05 : 0;

        const light =
          0.91 +
          surface.coast * 0.045 +
          surface.reef * 0.065 -
          surface.depth * 0.038 +
          terrainLift +
          waterMotion +
          iceLift;

        color = shadeColor(color, light);

        if (surface.beach) {
          color = mixColor(color, surface.opalSignal > 0.32 ? PALETTE.opalSand : PALETTE.blackSand, surface.beachIndex * 0.12);
        }

        if (surface.diamondSignal > 0.42 && micro > 0.84) {
          color = mixColor(color, PALETTE.snow, clamp((surface.diamondSignal - 0.42) * 0.10, 0, 0.08));
        }

        const index = (py * width + px) * 4;
        data[index] = clamp(Math.round(color.r), 0, 255);
        data[index + 1] = clamp(Math.round(color.g), 0, 255);
        data[index + 2] = clamp(Math.round(color.b), 0, 255);
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    canvas.dataset.textureStatus = "AUDRALIA_PARENT_4K_BASELINE_LAND_WATER_READY";
    canvas.dataset.childHandoffReceipts = JSON.stringify(CHILD_RECEIPTS);
    canvas.dataset.staticPictureReplacement = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.imageGeneration = "false";

    if (config.returnObject === true) {
      return {
        canvas,
        width,
        height,
        body: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        version: VERSION,
        compatibilityVersion: COMPATIBILITY_VERSION,
        generation: BODY.generation,
        childReceipts: CHILD_RECEIPTS,
        status: getStatus()
      };
    }

    return canvas;
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase) {
    const size = ctx.canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(1, Math.floor(size / 520));
    const sourceHeight = texture.height || 1024;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.9));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.36,
      cy - radius * 0.34,
      radius * 0.03,
      cx,
      cy,
      radius * 1.15
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.34, "rgba(255,255,255,0.055)");
    light.addColorStop(0.74, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.82, "rgba(12,28,48,0.10)");
    rim.addColorStop(1, "rgba(94,160,214,0.24)");

    ctx.fillStyle = rim;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(176,218,255,0.27)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(91,171,225,0.10)";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  function createReceiptNode(status) {
    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-parent-baseline-receipt";
    receipt.dataset.body = BODY.id;
    receipt.dataset.legacyBody = BODY.legacyId;
    receipt.dataset.version = VERSION;
    receipt.dataset.compatibilityVersion = COMPATIBILITY_VERSION;
    receipt.dataset.generation = BODY.generation;
    receipt.dataset.parentRole = "baseline-land-water-only";
    receipt.dataset.topologyPressure = "child-authority";
    receipt.dataset.terrainPressure = "child-authority";
    receipt.dataset.hydrationPressure = "child-authority";
    receipt.dataset.climatePressure = "child-authority";
    receipt.dataset.runtimePressure = "child-authority";
    receipt.dataset.hexSurfacePressure = "child-authority";
    receipt.dataset.visualPass = BODY.visualPass;
    receipt.dataset.graphicBox = "false";
    receipt.dataset.imageGeneration = "false";
    receipt.dataset.childReceipts = JSON.stringify(CHILD_RECEIPTS);
    receipt.textContent = [
      "AUDRALIA_PARENT=4K_BASELINE_LAND_WATER_ONLY",
      "TOPOLOGY=CHILD_AUTHORITY",
      "TERRAIN=CHILD_AUTHORITY",
      "HYDRATION=CHILD_AUTHORITY",
      "CLIMATE=CHILD_AUTHORITY",
      "RUNTIME=CHILD_AUTHORITY",
      "HEX_SURFACE=CHILD_AUTHORITY",
      "VISUAL_PASS=HELD"
    ].join(" · ");

    if (status && status.mountId) {
      receipt.dataset.mountId = status.mountId;
    }

    return receipt;
  }

  function renderSurface(mount, options) {
    const config = options || {};
    const target =
      typeof mount === "string"
        ? document.querySelector(mount)
        : mount && mount.nodeType === 1
          ? mount
          : null;

    const texture = buildTexture({
      width: Number(config.textureWidth) || 2048,
      height: Number(config.textureHeight) || 1024
    });

    const size = Math.max(320, Math.min(1440, Number(config.size) || 820));
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.className = [
      "audralia-world-body-canvas",
      "audralia-parent-baseline",
      "audralia-land-water-baseline",
      "audralia-parent-4k-baseline"
    ].join(" ");

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Audralia 4K baseline parent body with land and water divide restored"
    );

    canvas.style.width = "100%";
    canvas.style.maxWidth = config.maxWidth || "820px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    canvas.style.objectFit = "cover";
    canvas.style.background = "transparent";

    drawSphere(ctx, texture, Number(config.phase) || 0.18);

    const status = getStatus();
    status.mountId = target && target.id ? target.id : "";

    if (target) {
      target.replaceChildren();

      target.dataset.body = BODY.id;
      target.dataset.legacyBody = BODY.legacyId;
      target.dataset.label = BODY.label;
      target.dataset.version = VERSION;
      target.dataset.compatibilityVersion = COMPATIBILITY_VERSION;
      target.dataset.generation = BODY.generation;
      target.dataset.parentRole = "baseline-land-water-only";
      target.dataset.topologyPressure = "child-authority";
      target.dataset.terrainPressure = "child-authority";
      target.dataset.hydrationPressure = "child-authority";
      target.dataset.climatePressure = "child-authority";
      target.dataset.runtimePressure = "child-authority";
      target.dataset.hexSurfacePressure = "child-authority";
      target.dataset.southPole = "ice-only";
      target.dataset.visualPass = BODY.visualPass;
      target.dataset.graphicBox = "false";
      target.dataset.imageGeneration = "false";
      target.dataset.childReceipts = JSON.stringify(CHILD_RECEIPTS);

      target.appendChild(canvas);

      if (config.receipt !== false) {
        target.appendChild(createReceiptNode(status));
      }
    }

    return canvas;
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: BODY.id,
        legacyId: BODY.legacyId,
        label: BODY.label,
        publicLabel: BODY.publicLabel,
        classification: BODY.classification,
        parentAuthority: BODY.parentAuthority,
        version: VERSION,
        compatibilityVersion: COMPATIBILITY_VERSION,
        generation: BODY.generation,
        generationClaim: BODY.generationClaim,
        parentRole: "baseline-land-water-only",
        parentOwns: CONTRACT.parentOwns,
        parentDoesNotOwn: CONTRACT.parentDoesNotOwn,
        topologyChildRequired: true,
        terrainChildRequired: true,
        hydrationChildRequired: true,
        climateChildRequired: true,
        runtimeChildRequired: true,
        hexSurfaceChildRequired: true,
        ecologyChildLater: true,
        southPoleIceOnly: true,
        noParentBloat: true,
        childReceipts: CHILD_RECEIPTS,
        contract: CONTRACT,
        api: {
          createProfile: true,
          buildTexture: true,
          sampleSurface: true,
          renderSurface: true,
          getStatus: true,
          registerExtension: true
        }
      },
      overrides || {}
    );
  }

  function getStatus() {
    return {
      version: VERSION,
      compatibilityVersion: COMPATIBILITY_VERSION,
      body: BODY.id,
      legacyId: BODY.legacyId,
      label: BODY.label,
      parentAuthority: BODY.parentAuthority,
      generation: BODY.generation,
      generationClaim: BODY.generationClaim,
      parentRole: "BASELINE_LAND_WATER_ONLY",
      parentOwns: CONTRACT.parentOwns,
      parentDoesNotOwn: CONTRACT.parentDoesNotOwn,
      topologyPressure: "CHILD_AUTHORITY",
      terrainPressure: "CHILD_AUTHORITY",
      hydrationPressure: "CHILD_AUTHORITY",
      climatePressure: "CHILD_AUTHORITY",
      runtimePressure: "CHILD_AUTHORITY",
      hexSurfacePressure: "CHILD_AUTHORITY",
      topologyChildRequired: true,
      terrainChildRequired: true,
      hydrationChildRequired: true,
      climateChildRequired: true,
      runtimeChildRequired: true,
      hexSurfaceChildRequired: true,
      ecologyChildLater: true,
      southPole: "ICE_ONLY",
      northPole: "LAND_ALLOWED",
      noParentBloat: true,
      visualPass: BODY.visualPass,
      graphicBox: CONTRACT.graphicBox,
      imageGeneration: CONTRACT.imageGeneration,
      staticPictureReplacement: CONTRACT.staticPictureReplacement,
      childReceipts: CHILD_RECEIPTS,
      protectedNonJurisdiction: [
        "Earth",
        "Showroom selector",
        "Showroom CSS",
        "Gauges",
        "Products",
        "Sun",
        "Moon",
        "global files"
      ],
      returnReceipt:
        "AUDRALIA_PARENT_4K_BASELINE_RESTORED_CHILD_HANDOFFS_PRESERVED"
    };
  }

  function registerExtension(target) {
    const api = window.DGBAudraliaPlanetRender;
    const profile = createProfile();

    if (!target) return api;
    if (target === api) return api;

    if (typeof target.registerPlanet === "function") {
      target.registerPlanet(profile, api);
    }

    if (typeof target.registerRenderer === "function") {
      target.registerRenderer(BODY.id, api);
      target.registerRenderer(BODY.legacyId, api);
    }

    if (typeof target.registerExtension === "function") {
      target.registerExtension(BODY.id, api);
    }

    if (typeof target.addExtension === "function") {
      target.addExtension(BODY.id, api);
    }

    if (target.extensions && typeof target.extensions === "object") {
      target.extensions[BODY.id] = api;
      target.extensions[BODY.legacyId] = api;
    }

    if (target.planets && typeof target.planets === "object") {
      target.planets[BODY.id] = profile;
      target.planets[BODY.legacyId] = profile;
    }

    return api;
  }

  function autoRegister() {
    const api = window.DGBAudraliaPlanetRender;

    [
      window.DGBPlanetRegistry,
      window.DGBShowroomPlanetRegistry,
      window.DGBShowroomGlobeInstrument,
      window.DGBAudraliaRegistry,
      window.DGBAudreliaRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-parent-baseline-ready", {
        detail: {
          body: BODY.id,
          legacyId: BODY.legacyId,
          label: BODY.label,
          version: VERSION,
          compatibilityVersion: COMPATIBILITY_VERSION,
          generation: BODY.generation,
          parentRole: "baseline-land-water-only",
          childReceipts: CHILD_RECEIPTS,
          api
        }
      })
    );
  }

  function autoMount() {
    const mount =
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-audrelia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]") ||
      document.querySelector("[data-body='audrelia'][data-render-mount]");

    if (!mount) return;

    renderSurface(mount, {
      size: 820,
      textureWidth: 2048,
      textureHeight: 1024,
      receipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    compatibilityVersion: COMPATIBILITY_VERSION,
    body: BODY,
    contract: CONTRACT,
    childReceipts: CHILD_RECEIPTS,
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus,
    registerExtension
  });

  window.DGBAudraliaPlanetRender = api;
  window.AudraliaPlanetRender = api;
  window.audraliaPlanetRender = api;

  window.DGBAudreliaPlanetRender = api;
  window.AudreliaPlanetRender = api;
  window.audreliaPlanetRender = api;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        autoRegister();
        autoMount();
      },
      { once: true }
    );
  } else {
    autoRegister();
    autoMount();
  }
})();
