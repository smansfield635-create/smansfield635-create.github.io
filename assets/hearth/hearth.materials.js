// /assets/hearth/hearth.materials.js
// HEARTH_NATURAL_ORGANIC_MATERIAL_REALISM_TNT_v2
// Full-file replacement.
// Purpose:
// - Remove artificial diagonal stripe artifacts.
// - Remove polar spiral artifacts.
// - Preserve seven body masses, jagged coastlines, shelves, and island chains.
// - Restore natural organic biome blending: forest, desert, plains, mountains, wetlands, tundra, ice.
// - Keep route, canvas, controls, runtime, and HTML untouched.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_NATURAL_ORGANIC_MATERIAL_REALISM_TNT_v2";
  const RECEIPT = "HEARTH_NATURAL_ORGANIC_MATERIAL_REALISM_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_4K_NATURAL_ORGANIC_MATERIALS_TNT_v1";
  const VERSION = "2026-05-10.hearth-natural-organic-material-realism-v2";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const MASSES = Object.freeze([
    { key: "north-crown", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG, seed: 1101 },
    { key: "equatorial-great", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG, seed: 2202 },
    { key: "northwest-temperate", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG, seed: 3303 },
    { key: "northeast-broken-shelf", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG, seed: 4404 },
    { key: "southeast-warm", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG, seed: 5505 },
    { key: "southwest-ridge", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG, seed: 6606 },
    { key: "south-transitional", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG, seed: 7707 }
  ]);

  const ISLANDS = Object.freeze([
    { lat: 69 * DEG, lon: -76 * DEG, rx: 6 * DEG, ry: 2.4 * DEG, angle: -20 * DEG, seed: 8101 },
    { lat: 72 * DEG, lon: 44 * DEG, rx: 5 * DEG, ry: 2 * DEG, angle: 18 * DEG, seed: 8102 },
    { lat: 21 * DEG, lon: 66 * DEG, rx: 5.5 * DEG, ry: 2.3 * DEG, angle: -26 * DEG, seed: 8103 },
    { lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, seed: 8104 },
    { lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, seed: 8105 },
    { lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, seed: 8106 },
    { lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, seed: 8107 },
    { lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2 * DEG, angle: 11 * DEG, seed: 8108 },
    { lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, seed: 8109 },
    { lat: 18 * DEG, lon: -152 * DEG, rx: 4.4 * DEG, ry: 1.8 * DEG, angle: -41 * DEG, seed: 8110 },
    { lat: -31 * DEG, lon: -36 * DEG, rx: 4.8 * DEG, ry: 1.7 * DEG, angle: 24 * DEG, seed: 8111 },
    { lat: -47 * DEG, lon: 162 * DEG, rx: 5.8 * DEG, ry: 2.2 * DEG, angle: -9 * DEG, seed: 8112 }
  ]);

  const C = Object.freeze({
    abyss: [2, 7, 18],
    deepOcean: [3, 18, 43],
    ocean: [5, 46, 84],
    shelf: [15, 93, 119],
    shallow: [28, 126, 132],
    coastFoam: [126, 184, 169],
    beach: [198, 176, 116],
    wetSand: [144, 128, 92],

    forestDeep: [22, 72, 47],
    forest: [36, 105, 62],
    wetForest: [25, 92, 58],
    jungle: [18, 86, 53],
    plains: [119, 142, 82],
    grassland: [92, 129, 73],
    savanna: [158, 143, 81],
    desert: [184, 148, 88],
    drySteppe: [135, 121, 80],
    clay: [145, 100, 67],
    wetland: [45, 96, 72],

    mountain: [93, 92, 86],
    granite: [119, 118, 110],
    basalt: [49, 53, 60],
    cliff: [55, 60, 67],
    highland: [116, 118, 94],

    tundra: [132, 143, 125],
    snow: [214, 226, 224],
    ice: [188, 216, 226]
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
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed, octaves = 6) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed, octaves = 6) {
    let total = 0;
    let norm = 0;
    let amp = 0.62;
    let scale = 6.5;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function domainWarp(u, v, seed, strength = 0.035) {
    const a = fbm(u + 0.17, v - 0.11, seed + 17, 4) - 0.5;
    const b = fbm(u - 0.13, v + 0.19, seed + 31, 4) - 0.5;
    return {
      u: wrap01(u + a * strength),
      v: clamp(v + b * strength, 0, 1)
    };
  }

  function ellipseField(lon, lat, body) {
    const dx = wrapPi(lon - body.lon) * Math.cos(body.lat);
    const dy = lat - body.lat;
    const ca = Math.cos(body.angle);
    const sa = Math.sin(body.angle);

    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / body.rx;
    const ny = y / body.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);

    return { nx, ny, theta, dist };
  }

  function coastlineChip(u, v, body, e) {
    const shelfNoise = ridged(u + body.seed * 0.0009, v - body.seed * 0.0007, 18000 + body.seed, 5);
    const cutNoise = fbm(u - body.seed * 0.0013, v + body.seed * 0.0017, 21000 + body.seed, 5);

    const angular =
      Math.sign(Math.sin(e.theta * (6 + body.seed % 6) + e.nx * 4.9 - e.ny * 4.2)) * 0.045 +
      Math.sin(e.theta * (11 + body.seed % 5) - body.seed * 0.007) * 0.032;

    const fracture = (shelfNoise - 0.5) * 0.18;
    const bay = smoothstep(0.5, 0.92, cutNoise) * 0.115;
    const tear = smoothstep(0.58, 0.96, shelfNoise) * 0.045;

    return angular + fracture - bay - tear;
  }

  function landField(u, v) {
    const warped = domainWarp(u, v, 12000, 0.024);
    const lon = (warped.u - 0.5) * TAU;
    const lat = (0.5 - warped.v) * Math.PI;

    let best = {
      field: -20,
      body: MASSES[0],
      island: false
    };

    for (const body of MASSES) {
      const e = ellipseField(lon, lat, body);
      const field = 1 - e.dist + coastlineChip(warped.u, warped.v, body, e);

      if (field > best.field) {
        best = { field, body, island: false };
      }
    }

    for (const island of ISLANDS) {
      const e = ellipseField(lon, lat, island);
      const chip =
        Math.sin(e.theta * 5.7 + island.seed * 0.13) * 0.065 +
        (ridged(warped.u + island.seed * 0.001, warped.v - island.seed * 0.001, 41000 + island.seed, 3) - 0.5) * 0.09;

      const field = 0.38 + chip - e.dist;

      if (field > best.field) {
        best = { field, body: MASSES[0], island: true };
      }
    }

    const coast = 1 - smoothstep(0.012, 0.13, Math.abs(best.field));
    const shelf = smoothstep(-0.34, 0.015, best.field) * (best.field <= 0 ? 1 : 0);

    return {
      lon,
      lat,
      u: warped.u,
      v: warped.v,
      field: best.field,
      isLand: best.field > 0,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      body: best.body,
      island: best.island
    };
  }

  function reliefField(u, v, land) {
    const seed = land.body.seed;
    const w1 = domainWarp(u + seed * 0.00013, v - seed * 0.00011, 51000 + seed, 0.045);
    const w2 = domainWarp(u - seed * 0.00017, v + seed * 0.00009, 52000 + seed, 0.026);

    const ridgeLong = ridged(w1.u * 0.92 + 0.03, w1.v * 1.08 - 0.02, 53000 + seed, 6);
    const ridgeBroken = ridged(w2.u * 1.7 - 0.09, w2.v * 1.35 + 0.07, 54000 + seed, 5);
    const rolling = fbm(u * 1.4 + 0.17, v * 1.2 - 0.11, 55000 + seed, 5);
    const basinNoise = fbm(u * 1.9 - 0.21, v * 1.6 + 0.14, 56000 + seed, 5);

    const mountain = smoothstep(0.63, 0.9, ridgeLong * 0.72 + ridgeBroken * 0.28);
    const foothill = smoothstep(0.48, 0.78, ridgeBroken * 0.62 + rolling * 0.38);
    const basin = smoothstep(0.18, 0.47, 1 - basinNoise) * smoothstep(0.14, 0.7, land.field);
    const cliff = land.coast * smoothstep(0.54, 0.88, ridgeLong + ridgeBroken * 0.16);

    return {
      ridgeLong,
      ridgeBroken,
      rolling,
      basin,
      mountain,
      foothill,
      cliff,
      elevation: clamp(mountain * 0.75 + foothill * 0.28 + rolling * 0.08 - basin * 0.08, 0, 1)
    };
  }

  function climateField(u, v, land, relief) {
    const latitudeCold = Math.abs(land.lat) / (Math.PI / 2);

    const temperature = clamp(
      1 -
        latitudeCold * 0.92 +
        (fbm(u + 0.07, v - 0.09, 61000, 5) - 0.5) * 0.22 -
        relief.mountain * 0.26 -
        relief.elevation * 0.12,
      0,
      1
    );

    const moisture = clamp(
      fbm(u - 0.18, v + 0.12, 62000, 6) * 0.64 +
        land.coast * 0.22 +
        relief.basin * 0.2 +
        (land.island ? 0.08 : 0) -
        relief.mountain * 0.1 -
        temperature * 0.08,
      0,
      1
    );

    const aridity = clamp((1 - moisture) * 0.72 + temperature * 0.3 - land.coast * 0.12, 0, 1);
    const snow = smoothstep(0.65, 0.96, latitudeCold + relief.mountain * 0.24 - temperature * 0.11);
    const wetland = smoothstep(0.62, 0.94, moisture + relief.basin * 0.32) * smoothstep(0.18, 0.72, temperature);
    const forest = smoothstep(0.48, 0.83, moisture) * smoothstep(0.22, 0.78, temperature);
    const desert = smoothstep(0.58, 0.92, aridity) * smoothstep(0.44, 0.86, temperature);
    const plains = smoothstep(0.22, 0.7, temperature) * (1 - Math.max(forest * 0.52, desert * 0.45, wetland * 0.45, relief.mountain * 0.48));

    return {
      latitudeCold,
      temperature,
      moisture,
      aridity,
      snow,
      wetland,
      forest,
      desert,
      plains
    };
  }

  function landColor(u, v, land) {
    const relief = reliefField(u, v, land);
    const climate = climateField(u, v, land, relief);

    const patch = domainWarp(u, v, 70000, 0.055);
    const forestPatch = fbm(patch.u * 1.2, patch.v * 1.1, 71000, 6);
    const desertPatch = fbm(patch.u * 0.9 + 0.11, patch.v * 1.15 - 0.08, 72000, 5);
    const grassPatch = fbm(patch.u * 1.6 - 0.13, patch.v * 1.3 + 0.09, 73000, 5);

    const forestInfluence = clamp(climate.forest * smoothstep(0.34, 0.78, forestPatch), 0, 1);
    const desertInfluence = clamp(climate.desert * smoothstep(0.36, 0.82, desertPatch), 0, 1);
    const wetlandInfluence = clamp(climate.wetland * smoothstep(0.38, 0.82, forestPatch + relief.basin * 0.22), 0, 1);
    const mountainInfluence = clamp(relief.mountain, 0, 1);
    const snowInfluence = clamp(climate.snow, 0, 1);

    let color = mix(C.plains, C.grassland, smoothstep(0.32, 0.78, grassPatch));

    color = mix(color, C.savanna, clamp(climate.temperature * (1 - climate.moisture) * 0.9, 0, 1));
    color = mix(color, C.drySteppe, clamp((1 - climate.moisture) * 0.42, 0, 1));
    color = mix(color, C.desert, desertInfluence * 0.86);
    color = mix(color, C.clay, desertInfluence * smoothstep(0.6, 0.92, desertPatch) * 0.22);

    color = mix(color, C.forest, forestInfluence * 0.82);
    color = mix(color, C.forestDeep, forestInfluence * smoothstep(0.62, 0.9, climate.moisture) * 0.34);
    color = mix(color, C.wetForest, forestInfluence * smoothstep(0.58, 0.92, climate.temperature) * 0.22);
    color = mix(color, C.wetland, wetlandInfluence * 0.62);

    color = mix(color, C.highland, relief.foothill * 0.3);
    color = mix(color, C.granite, mountainInfluence * 0.58);
    color = mix(color, C.basalt, relief.cliff * 0.34);
    color = mix(color, C.tundra, climate.latitudeCold * smoothstep(0.24, 0.7, 1 - climate.temperature) * 0.4);
    color = mix(color, C.ice, snowInfluence * 0.58);
    color = mix(color, C.snow, snowInfluence * mountainInfluence * 0.38);

    color = mix(color, C.beach, land.coast * 0.16);
    color = mix(color, C.wetSand, land.coast * climate.moisture * 0.12);
    color = mix(color, C.cliff, relief.cliff * 0.32);

    const fineGrain = (fbm(u * 3.4 + 0.11, v * 3.1 - 0.07, 81000, 5) - 0.5) * 12;
    const mineral = (ridged(u * 2.1 - 0.14, v * 2.2 + 0.09, 82000, 4) - 0.5) * 8;
    const reliefLight = relief.mountain * 15 + relief.foothill * 7 - relief.basin * 8 - relief.cliff * 12;

    return shade(color, fineGrain + mineral + reliefLight - 4);
  }

  function oceanColor(u, v, land) {
    const current = fbm(u * 1.4 + 0.05, v * 1.2 - 0.04, 91000, 5);
    const depthNoise = fbm(u * 2.2 - 0.17, v * 1.8 + 0.09, 92000, 4);

    let color = mix(C.abyss, C.deepOcean, current * 0.72);
    color = mix(color, C.ocean, smoothstep(0.1, 0.84, depthNoise) * 0.26);
    color = mix(color, C.shelf, land.shelf * 0.45);
    color = mix(color, C.shallow, land.shelf * land.coast * 0.2);
    color = mix(color, C.coastFoam, land.shelf * land.coast * 0.08);

    return shade(color, (noise(u, v, 170, 93000) - 0.5) * 4);
  }

  function sampleMaterial(u, v) {
    const land = landField(u, v);

    if (!land.isLand) {
      return oceanColor(u, v, land);
    }

    return landColor(u, v, land);
  }

  function createTextureCanvas(options = {}) {
    const requestedWidth = Math.floor(options.width || 1536);
    const requestedHeight = Math.floor(options.height || 768);

    const width = clamp(requestedWidth, 768, 4096);
    const height = clamp(requestedHeight, 384, 2048);

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
        const color = sampleMaterial(u, v);
        const index = (y * width + x) * 4;

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
    canvas.dataset.hearthNaturalOrganicMaterialLayer = "true";
    canvas.dataset.hearthArtificialDiagonalStripes = "false";
    canvas.dataset.hearthPolarSpiralArtifact = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-natural-organic-material-layer",
      naturalOrganicMaterialLayer: true,
      textureResolutionClass: "4k-capable-procedural",
      artificialDiagonalStripes: false,
      polarSpiralArtifact: false,
      bodyMassAssignedColoring: false,
      organicBiomePatches: true,
      biomeBlending: true,
      organicCoastlines: true,
      jaggedCoastlinesPreserved: true,
      islandChainsPreserved: true,
      shelfGradients: true,
      mountainRelief: true,
      wetlandForestDesertPlainsTundraIceDifferentiation: true,
      routeOwner: false,
      canvasOwner: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_MATERIALS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    createTextureCanvas,
    sampleMaterial,
    getStatus
  });

  window.HEARTH_MATERIALS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthMaterialsLoaded = "true";
  document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
  document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
  document.documentElement.dataset.hearthNaturalOrganicMaterialLayer = "true";
  document.documentElement.dataset.hearthArtificialDiagonalStripes = "false";
  document.documentElement.dataset.hearthPolarSpiralArtifact = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
