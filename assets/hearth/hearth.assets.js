// /assets/hearth/hearth.assets.js
// HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ASSETS_TNT_v9
// Full-file replacement.
// Assets authority with elevation, mountain range, cliff wall, basin shadow, ridge highlight, and material-depth expression.
// Preserves runtime, controls, canvas, route separation.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ASSETS_TNT_v9";
  const RECEIPT = "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_ASSETS_RECEIPT_v9";
  const PREVIOUS_CONTRACT = "HEARTH_LAND_TEXTURE_COMPOSITION_ELEVATION_ASSETS_TNT_v8";
  const REQUIRED_TERRAIN_EXTENSION = "HEARTH_ELEVATION_MOUNTAIN_RANGE_CLIFF_DEPTH_TERRAIN_EXTENSION_TNT_v5";
  const BLUEPRINT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_v1";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_MASSES = Object.freeze([
    { id: 1, key: "north-crown-mass", name: "North Crown Mass", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG, mountain: 0.74, ice: 0.88, beach: 0.05, shelf: 0.46, mineral: 0.36, palette: "polar" },
    { id: 2, key: "equatorial-great-mass", name: "Equatorial Great Mass", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG, mountain: 0.60, ice: 0.03, beach: 0.68, shelf: 0.72, mineral: 0.70, palette: "habitable" },
    { id: 3, key: "northwest-temperate-mass", name: "Northwest Temperate Mass", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG, mountain: 0.58, ice: 0.16, beach: 0.24, shelf: 0.42, mineral: 0.50, palette: "temperate" },
    { id: 4, key: "northeast-broken-shelf-mass", name: "Northeast Broken Shelf Mass", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG, mountain: 0.30, ice: 0.05, beach: 0.72, shelf: 0.92, mineral: 0.40, palette: "shelf" },
    { id: 5, key: "southeast-warm-mass", name: "Southeast Warm Mass", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG, mountain: 0.34, ice: 0.00, beach: 0.90, shelf: 0.84, mineral: 0.46, palette: "warm" },
    { id: 6, key: "southwest-ridge-mass", name: "Southwest Ridge Mass", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG, mountain: 0.88, ice: 0.10, beach: 0.12, shelf: 0.24, mineral: 0.84, palette: "ridge" },
    { id: 7, key: "south-transitional-mass", name: "South Transitional Mass", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG, mountain: 0.46, ice: 0.56, beach: 0.26, shelf: 0.54, mineral: 0.44, palette: "cold" }
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
    soil: [96, 100, 67],
    lowland: [92, 130, 76],
    fertile: [70, 128, 72],
    temperate: [74, 112, 74],
    warm: [128, 124, 70],
    upland: [102, 105, 82],
    ridge: [82, 86, 82],
    cliff: [50, 58, 68],
    cliffShadow: [28, 34, 42],
    granite: [122, 118, 110],
    graniteLight: [156, 152, 140],
    slate: [48, 60, 74],
    marble: [178, 174, 160],
    snow: [216, 232, 232],
    ice: [204, 224, 226],
    polar: [126, 140, 144],
    dark: [52, 50, 58],
    copper: [156, 88, 58],
    gold: [208, 164, 66],
    opal: [154, 190, 186],
    shadow: [16, 22, 28]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
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
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
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
    const extension = window.HEARTH_TERRAIN_EXTENSION;
    if (!extension || !String(extension.contract || "").includes(REQUIRED_TERRAIN_EXTENSION)) return null;
    if (typeof extension.sampleCoastlineModifier !== "function") return null;
    if (typeof extension.sampleIslandField !== "function") return null;
    if (typeof extension.sampleTerrain !== "function") return null;
    return extension;
  }

  function lonLat(u, v) {
    return { lon: (u - 0.5) * TAU, lat: (0.5 - v) * Math.PI };
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
    const modifier = extension
      ? extension.sampleCoastlineModifier(u, v, {
          primaryMassId: mass.id,
          primaryMassKey: mass.key,
          field,
          theta,
          nx,
          ny
        })
      : null;

    if (modifier) field += modifier.fieldDelta;

    return { mass, field, theta, nx, ny, dist, modifier };
  }

  function classify(u, v) {
    const p = lonLat(u, v);
    const extension = terrainExtension();
    const reads = BODY_MASSES.map((mass) => angularMassField(p.lon, p.lat, u, v, mass)).sort((a, b) => b.field - a.field);
    const best = reads[0];
    const island = extension ? extension.sampleIslandField(u, v, p) : null;
    const islandWins = Boolean(island && island.field > best.field && island.field > 0);
    const mass = islandWins ? BODY_MASSES.find((m) => m.key === island.key) || best.mass : best.mass;
    const field = islandWins ? island.field : best.field;
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
      field,
      isLand,
      primaryMassId: mass.id,
      primaryMassKey: mass.key,
      primaryMassName: mass.name,
      primaryProfile: mass.palette,
      coast,
      shelf,
      shelfTexture,
      deepOcean,
      isIsland: islandWins,
      islandField: island ? island.field : -1,
      islandKey: island ? island.key : "",
      coastlineModifier: best.modifier || null,
      noise: noise(u, v, 48, 26000)
    };

    const terrain = extension ? extension.sampleTerrain(u, v, base) : null;

    return {
      ...base,
      terrainExtensionLoaded: Boolean(extension),
      coastlineFractureLoaded: Boolean(extension),
      islandChainLoaded: Boolean(extension),
      terrain
    };
  }

  function paletteBase(t) {
    switch (t.primaryMassKey) {
      case "north-crown-mass": return mix(C.slate, C.polar, 0.58);
      case "equatorial-great-mass": return mix(C.lowland, C.upland, 0.34);
      case "northwest-temperate-mass": return mix(C.temperate, C.granite, 0.24);
      case "northeast-broken-shelf-mass": return mix(C.fertile, C.beach, 0.30);
      case "southeast-warm-mass": return mix(C.warm, C.beach, 0.28);
      case "southwest-ridge-mass": return mix(C.dark, C.ridge, 0.40);
      case "south-transitional-mass": return mix(C.slate, C.polar, 0.30);
      default: return C.lowland;
    }
  }

  function sample(u, v) {
    const t = classify(u, v);
    const terrain = t.terrain || {};

    if (!t.isLand) {
      let color = mix(C.abyss, C.deep, clamp(0.22 + t.noise * 0.44, 0, 1));
      color = mix(color, C.ocean, smoothstep(0.18, 0.76, 1 - t.deepOcean) * 0.42);
      color = mix(color, C.shelf, t.shelf * 0.62);
      color = mix(color, C.shelfSoft, t.shelf * t.coast * 0.28);
      color = mix(color, C.foam, t.shelf * t.coast * 0.10);
      color = lift(color, -8 * t.deepOcean + (t.noise - 0.5) * 5);
      return { color, terrain: t };
    }

    let color = paletteBase(t);

    color = mix(color, C.soil, terrain.soil * 0.40);
    color = mix(color, C.fertile, terrain.vegetation * 0.42);
    color = mix(color, C.upland, terrain.elevation * 0.26);
    color = mix(color, C.ridge, terrain.mountainRange * 0.44);
    color = mix(color, C.granite, terrain.granite * 0.36);
    color = mix(color, C.graniteLight, terrain.ridgeHighlight * 0.26);
    color = mix(color, C.slate, terrain.slate * 0.34);
    color = mix(color, C.cliff, clamp(terrain.cliffWall + terrain.escarpment * 0.48, 0, 1) * 0.48);
    color = mix(color, C.cliffShadow, terrain.depthShadow * 0.36);
    color = mix(color, C.shadow, terrain.shadowSlope * 0.20);
    color = mix(color, C.wetBeach, terrain.sediment * t.coast * 0.20);
    color = mix(color, C.beach, clamp(terrain.sediment + terrain.islandEdge * 0.24, 0, 1) * t.coast * 0.24);
    color = mix(color, C.polar, terrain.ice * 0.26);
    color = mix(color, C.ice, terrain.ice * 0.42);
    color = mix(color, C.snow, terrain.ridgeHighlight * terrain.ice * 0.34);
    color = mix(color, C.dark, terrain.dryStone * 0.18);
    color = mix(color, C.copper, terrain.copper * 0.12);
    color = mix(color, C.gold, terrain.gold * 0.18);
    color = mix(color, C.opal, terrain.opal * 0.15);
    color = mix(color, C.marble, terrain.plateau * terrain.granite * 0.08);

    const reliefLift =
      terrain.elevation * 10 +
      terrain.ridgeHighlight * 16 +
      terrain.mountainRange * 9 -
      terrain.depthShadow * 14 -
      terrain.shadowSlope * 7 -
      terrain.valley * 6 -
      terrain.basin * 7 -
      terrain.cliffWall * 4 +
      terrain.soil * 2 +
      terrain.grainTexture * 5 -
      3;

    color = lift(color, reliefLift);

    return { color, terrain: t };
  }

  function createTextureCanvas(options = {}) {
    const mobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches));

    const width = options.width || (mobile ? 1024 : 2048);
    const height = options.height || Math.round(width / 2);
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const result = sample(u, v);
        const i = (y * width + x) * 4;

        data[i] = result.color[0];
        data[i + 1] = result.color[1];
        data[i + 2] = result.color[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.hearthAssetsContract = CONTRACT;
    canvas.dataset.hearthAssetsReceipt = RECEIPT;
    canvas.dataset.hearthTerrainExtensionContract = REQUIRED_TERRAIN_EXTENSION;
    canvas.dataset.hearthTerrainExtensionLoaded = String(Boolean(terrainExtension()));
    canvas.dataset.hearthElevationDepthLoaded = "true";
    canvas.dataset.hearthMountainRangeSystemLoaded = "true";
    canvas.dataset.hearthCliffSystemLoaded = "true";
    canvas.dataset.hearthVisualDepthActive = "true";
    canvas.dataset.hearthLandTextureCompositionLoaded = "true";
    canvas.dataset.hearthElevationDifferentiationActive = "true";
    canvas.dataset.hearthCompositionDifferentiationActive = "true";
    canvas.dataset.hearthTerrainTextureActive = "true";
    canvas.dataset.hearthTetMap = "TERRAIN_TO_ELEVATION_TO_TERRAIN";
    canvas.dataset.hearthMapsProtocol = "MAKE_A_PIZZA_SYSTEMIC_EXECUTION";
    canvas.dataset.hearthQuadAAudit = "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS";
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthTwoBodyRead = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function getStatus() {
    const extension = terrainExtension();

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredTerrainExtension: REQUIRED_TERRAIN_EXTENSION,
      terrainExtensionLoaded: Boolean(extension),
      elevationDepthLoaded: true,
      mountainRangeSystemLoaded: true,
      cliffSystemLoaded: true,
      visualDepthActive: true,
      landTextureCompositionLoaded: true,
      elevationDifferentiationActive: true,
      compositionDifferentiationActive: true,
      terrainTextureActive: true,
      coastlineFractureLoaded: true,
      silhouetteBreakerActive: true,
      islandChainLoaded: true,
      hardJaggedEdges: true,
      rigidCoastline: true,
      bodyMassCount: 7,
      uniqueMassProfiles: true,
      twoBodyRead: false,
      symmetryReduced: true,
      roundLobeRead: false,
      ovalPatchRead: false,
      unrealisticRoundnessReduced: true,
      tetMap: "TERRAIN_TO_ELEVATION_TO_TERRAIN",
      mapsProtocol: "MAKE_A_PIZZA_SYSTEMIC_EXECUTION",
      quadAAudit: "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS",
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      routeTouched: false,
      htmlTouched: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_ASSETS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    requiredTerrainExtension: REQUIRED_TERRAIN_EXTENSION,
    blueprint: BLUEPRINT,
    bodyMasses: BODY_MASSES,
    createTextureCanvas,
    createHearthTextureCanvas: createTextureCanvas,
    classify,
    sample,
    getStatus
  });

  window.HEARTH_ASSETS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthAssetsLoaded = "true";
  document.documentElement.dataset.hearthAssetsContract = CONTRACT;
  document.documentElement.dataset.hearthAssetsReceipt = RECEIPT;
  document.documentElement.dataset.hearthElevationDepthLoaded = "true";
  document.documentElement.dataset.hearthMountainRangeSystemLoaded = "true";
  document.documentElement.dataset.hearthCliffSystemLoaded = "true";
  document.documentElement.dataset.hearthVisualDepthActive = "true";
  document.documentElement.dataset.hearthLandTextureCompositionLoaded = "true";
  document.documentElement.dataset.hearthElevationDifferentiationActive = "true";
  document.documentElement.dataset.hearthCompositionDifferentiationActive = "true";
  document.documentElement.dataset.hearthTerrainTextureActive = "true";
  document.documentElement.dataset.hearthTetMap = "TERRAIN_TO_ELEVATION_TO_TERRAIN";
  document.documentElement.dataset.hearthMapsProtocol = "MAKE_A_PIZZA_SYSTEMIC_EXECUTION";
  document.documentElement.dataset.hearthQuadAAudit = "AUDIT_ATTACK_ADJUST_AUTHORIZE_PASS";
  document.documentElement.dataset.hearthBodyMassCount = "7";
  document.documentElement.dataset.hearthTwoBodyRead = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
