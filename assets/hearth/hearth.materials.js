// /assets/hearth/hearth.materials.js
// HEARTH_4K_NATURAL_ORGANIC_MATERIALS_TNT_v1
// Full-file replacement / new file.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_4K_NATURAL_ORGANIC_MATERIALS_TNT_v1";
  const RECEIPT = "HEARTH_4K_NATURAL_ORGANIC_MATERIALS_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-4k-natural-organic-materials-v1";

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
    ocean: [5, 48, 86],
    shelf: [18, 102, 128],
    shallow: [38, 138, 142],
    foam: [138, 196, 182],
    beach: [202, 178, 113],
    wetSand: [156, 137, 93],
    forestDeep: [24, 78, 50],
    forest: [37, 112, 66],
    jungle: [20, 94, 58],
    plains: [128, 148, 82],
    grassland: [104, 136, 75],
    savanna: [164, 148, 78],
    desert: [190, 151, 84],
    drySteppe: [139, 122, 77],
    clay: [149, 96, 64],
    mountain: [93, 92, 84],
    granite: [119, 118, 109],
    cliff: [54, 59, 67],
    basalt: [43, 48, 56],
    highland: [120, 121, 94],
    tundra: [133, 144, 124],
    snow: [214, 225, 223],
    ice: [188, 216, 226],
    lake: [35, 110, 132],
    wetland: [48, 103, 74]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
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

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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

  function fbm(u, v, seed, octaves = 6) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4;

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
    let scale = 8;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
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

  function landField(u, v) {
    const lon = (u - 0.5) * TAU;
    const lat = (0.5 - v) * Math.PI;

    let best = {
      field: -20,
      body: MASSES[0],
      theta: 0,
      island: false
    };

    for (const body of MASSES) {
      const e = ellipseField(lon, lat, body);
      const angular =
        Math.sign(Math.sin(e.theta * (6 + body.seed % 6) + e.nx * 4.9 - e.ny * 4.2)) * 0.062 +
        Math.sin(e.theta * (10 + body.seed % 5) - body.seed * 0.007) * 0.045 +
        Math.sin(e.theta * (17 + body.seed % 3) + e.nx * 2.4) * 0.025;

      const fracture = (ridged(u + body.seed * 0.0009, v - body.seed * 0.0007, 18000 + body.seed, 6) - 0.5) * 0.22;
      const bay = smoothstep(0.44, 0.92, noise(u - body.seed * 0.0013, v + body.seed * 0.0017, 112, 21000 + body.seed)) * 0.13;
      const shelfTear = smoothstep(0.55, 0.96, ridged(u + body.seed * 0.0019, v - body.seed * 0.0011, 26000 + body.seed, 4)) * 0.055;
      const field = 1 - e.dist + angular + fracture - bay - shelfTear;

      if (field > best.field) {
        best = { field, body, theta: e.theta, island: false };
      }
    }

    for (const island of ISLANDS) {
      const e = ellipseField(lon, lat, island);
      const angular = Math.sin(e.theta * 6 + island.seed * 0.13) * 0.13 + Math.sin(e.theta * 11 - e.nx) * 0.06;
      const chip = (ridged(u + island.seed * 0.003, v - island.seed * 0.002, 41000 + island.seed, 4) - 0.5) * 0.12;
      const field = 0.38 + angular + chip - e.dist;

      if (field > best.field) {
        best = { field, body: MASSES[0], theta: e.theta, island: true };
      }
    }

    const coast = 1 - smoothstep(0.012, 0.135, Math.abs(best.field));
    const shelf = smoothstep(-0.36, 0.018, best.field) * (best.field <= 0 ? 1 : 0);
    const landEdge = smoothstep(-0.02, 0.06, best.field) * smoothstep(0.22, 0.035, best.field);

    return {
      lon,
      lat,
      field: best.field,
      isLand: best.field > 0,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      landEdge: clamp(landEdge, 0, 1),
      body: best.body,
      island: best.island
    };
  }

  function reliefField(u, v, land) {
    const bodySeed = land.body.seed;
    const ridgeA = ridged(u + bodySeed * 0.00081, v - bodySeed * 0.00062, 51000 + bodySeed, 7);
    const ridgeB = ridged(u * 1.72 - bodySeed * 0.00031, v * 1.28 + bodySeed * 0.00051, 52000 + bodySeed, 5);
    const grain = fbm(u * 2.3 + 0.17, v * 1.9 - 0.11, 53000 + bodySeed, 6);
    const mountain = smoothstep(0.58, 0.91, ridgeA);
    const foothill = smoothstep(0.43, 0.73, ridgeB);
    const basin = smoothstep(0.2, 0.46, 1 - grain) * smoothstep(0.18, 0.62, land.field);
    const cliff = land.coast * smoothstep(0.48, 0.86, ridgeA + ridgeB * 0.2);

    return {
      ridgeA,
      ridgeB,
      grain,
      mountain,
      foothill,
      basin,
      cliff,
      elevation: clamp(mountain * 0.78 + foothill * 0.22 + basin * 0.06, 0, 1)
    };
  }

  function biomeColor(u, v, land, relief) {
    const latCold = Math.abs(land.lat) / (Math.PI / 2);
    const heat = clamp(1 - latCold + (noise(u, v, 8, 33000) - 0.5) * 0.26 - relief.mountain * 0.22, 0, 1);
    const moisture =
      clamp(
        fbm(u + 0.17, v - 0.11, 34000, 6) * 0.68 +
          land.coast * 0.22 +
          (land.island ? 0.1 : 0) +
          relief.basin * 0.14 -
          relief.mountain * 0.12,
        0,
        1
      );

    const arid = clamp((1 - moisture) * 0.74 + heat * 0.32 - land.coast * 0.12, 0, 1);
    const snow = smoothstep(0.66, 0.98, latCold + relief.mountain * 0.24 - heat * 0.11);
    const wetland = smoothstep(0.62, 0.9, moisture + relief.basin * 0.34) * smoothstep(0.18, 0.76, heat);

    let color;

    if (snow > 0.62) {
      color = mix(C.tundra, C.ice, snow);
    } else if (relief.mountain > 0.68) {
      color = mix(C.highland, C.granite, relief.mountain);
    } else if (relief.foothill > 0.7 && moisture < 0.48) {
      color = C.highland;
    } else if (wetland > 0.66) {
      color = C.wetland;
    } else if (heat > 0.68 && arid > 0.72) {
      color = mix(C.desert, C.clay, noise(u, v, 36, 61000) * 0.18);
    } else if (heat > 0.56 && arid > 0.55) {
      color = C.savanna;
    } else if (moisture > 0.72 && heat > 0.44) {
      color = mix(C.jungle, C.wetForest, noise(u, v, 48, 62000) * 0.32);
    } else if (moisture > 0.56) {
      color = mix(C.forestDeep, C.forest, noise(u, v, 44, 63000) * 0.42);
    } else if (latCold > 0.54) {
      color = C.tundra;
    } else if (moisture < 0.34) {
      color = C.drySteppe;
    } else {
      color = mix(C.plains, C.grassland, noise(u, v, 54, 64000) * 0.45);
    }

    color = mix(color, C.beach, land.coast * 0.18);
    color = mix(color, C.cliff, relief.cliff * 0.36);
    color = mix(color, C.snow, snow * relief.mountain * 0.38);

    const organicGrain =
      (fbm(u * 4.2 + 0.13, v * 3.7 - 0.09, 70000, 5) - 0.5) * 15 +
      (noise(u, v, 192, 71000) - 0.5) * 8;

    const lightRelief = relief.mountain * 20 + relief.foothill * 10 - relief.basin * 9 - relief.cliff * 11;

    return shade(color, organicGrain + lightRelief - 5);
  }

  function sampleMaterial(u, v) {
    const land = landField(u, v);

    if (!land.isLand) {
      let water = mix(C.abyss, C.deepOcean, fbm(u, v, 91000, 5));
      water = mix(water, C.ocean, smoothstep(0.05, 0.86, land.shelf) * 0.55);
      water = mix(water, C.shelf, land.shelf * 0.56);
      water = mix(water, C.shallow, land.coast * land.shelf * 0.24);
      water = mix(water, C.foam, land.coast * land.shelf * 0.12);
      water = shade(water, (noise(u, v, 160, 92000) - 0.5) * 5);
      return water;
    }

    const relief = reliefField(u, v, land);
    return biomeColor(u, v, land, relief);
  }

  function createTextureCanvas(options = {}) {
    const width = clamp(Math.floor(options.width || 1536), 512, 4096);
    const height = clamp(Math.floor(options.height || 768), 256, 2048);

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

    return canvas;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-natural-organic-material-layer",
      naturalOrganicMaterialLayer: true,
      textureResolutionClass: "4k-capable-procedural",
      biomeBlending: true,
      organicCoastlines: true,
      mountainRelief: true,
      shelfGradients: true,
      forestDesertPlainsWetlandIceDifferentiation: true,
      bodyMassAssignedColoring: false,
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
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
