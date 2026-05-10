// /assets/hearth/hearth.materials.js
// HEARTH_EARTH_RATIO_HYDROLOGY_NINE_WONDERS_TERRAIN_MATERIALS_TNT_v4
// Full-file replacement.
// Scope:
// - Terrain-first material layer only.
// - Target land ratio: Earth-like, approximately 30% visible land.
// - Add inland lakes, inland seas, rivers, streams, brooks, marshes, swamps, fjords, archipelagos, mountain ridges, cliffs, dirt, rock, grass, wet grass, dry grass, mud, clay, snow, ice, shallow shelves, and ocean depth.
// - Add nine terrain wonder seats.
// - Add diamond/opal/mineral composition pressure as subtle inlay, not vegetation.
// - No trees. No bushes. No forest canopy. No animal/life topology.
// - Route, HTML, canvas, controls, and runtime remain untouched.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EARTH_RATIO_HYDROLOGY_NINE_WONDERS_TERRAIN_MATERIALS_TNT_v4";
  const RECEIPT = "HEARTH_EARTH_RATIO_HYDROLOGY_NINE_WONDERS_TERRAIN_MATERIALS_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_NATURAL_ORGANIC_MATERIAL_REALISM_TNT_v2";
  const VERSION = "2026-05-10.hearth-earth-ratio-hydrology-nine-wonders-terrain-v4";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const TARGETS = Object.freeze({
    targetLandRatio: 0.30,
    earthReferenceLandRatio: 0.29,
    vegetationTopology: "held",
    terrainStage: true,
    noTrees: true,
    noBushes: true,
    noForestCanopy: true,
    riversStreamsBrooks: true,
    inlandWater: true,
    marshSwampWetGround: true,
    nineWonders: true,
    nineToOneComposition: true,
    fahrenheit451Marker: 451,
    collapsePoint61: 61,
    successPoint91: 91,
    scales: [1, 4, 16, 64, 256]
  });

  const MASSES = Object.freeze([
    { key: "north-crown", lat: 74 * DEG, lon: -22 * DEG, rx: 35 * DEG, ry: 11 * DEG, angle: -8 * DEG, seed: 1101 },
    { key: "equatorial-great", lat: 0 * DEG, lon: -10 * DEG, rx: 55 * DEG, ry: 23 * DEG, angle: -8 * DEG, seed: 2202 },
    { key: "northwest-temperate", lat: 43 * DEG, lon: -106 * DEG, rx: 28 * DEG, ry: 14 * DEG, angle: 25 * DEG, seed: 3303 },
    { key: "northeast-broken-shelf", lat: 33 * DEG, lon: 104 * DEG, rx: 29 * DEG, ry: 13 * DEG, angle: -23 * DEG, seed: 4404 },
    { key: "southeast-warm", lat: -24 * DEG, lon: 142 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 18 * DEG, seed: 5505 },
    { key: "southwest-ridge", lat: -38 * DEG, lon: -123 * DEG, rx: 31 * DEG, ry: 15 * DEG, angle: -29 * DEG, seed: 6606 },
    { key: "south-transitional", lat: -58 * DEG, lon: 37 * DEG, rx: 33 * DEG, ry: 12 * DEG, angle: 9 * DEG, seed: 7707 }
  ]);

  const ISLANDS = Object.freeze([
    { key: "north-crown-fragment-a", lat: 69 * DEG, lon: -76 * DEG, rx: 5.4 * DEG, ry: 2.1 * DEG, angle: -20 * DEG, seed: 8101 },
    { key: "north-crown-fragment-b", lat: 71 * DEG, lon: 45 * DEG, rx: 4.7 * DEG, ry: 1.8 * DEG, angle: 18 * DEG, seed: 8102 },
    { key: "equatorial-isle-a", lat: 21 * DEG, lon: 66 * DEG, rx: 5.0 * DEG, ry: 2.0 * DEG, angle: -26 * DEG, seed: 8103 },
    { key: "equatorial-isle-b", lat: -19 * DEG, lon: 57 * DEG, rx: 5.8 * DEG, ry: 2.2 * DEG, angle: 20 * DEG, seed: 8104 },
    { key: "broken-shelf-a", lat: 44 * DEG, lon: 123 * DEG, rx: 6.7 * DEG, ry: 2.5 * DEG, angle: -18 * DEG, seed: 8105 },
    { key: "broken-shelf-b", lat: 34 * DEG, lon: 139 * DEG, rx: 5.2 * DEG, ry: 1.9 * DEG, angle: 31 * DEG, seed: 8106 },
    { key: "philippine-chain-a", lat: -9 * DEG, lon: 170 * DEG, rx: 6.0 * DEG, ry: 2.3 * DEG, angle: 34 * DEG, seed: 8107 },
    { key: "south-ridge-isle", lat: -55 * DEG, lon: -84 * DEG, rx: 5.1 * DEG, ry: 1.9 * DEG, angle: 11 * DEG, seed: 8108 },
    { key: "polar-fragment", lat: -70 * DEG, lon: 76 * DEG, rx: 5.6 * DEG, ry: 2.0 * DEG, angle: -20 * DEG, seed: 8109 },
    { key: "far-west-isle", lat: 18 * DEG, lon: -152 * DEG, rx: 4.0 * DEG, ry: 1.6 * DEG, angle: -41 * DEG, seed: 8110 },
    { key: "south-mid-isle", lat: -31 * DEG, lon: -36 * DEG, rx: 4.4 * DEG, ry: 1.5 * DEG, angle: 24 * DEG, seed: 8111 },
    { key: "east-south-isle", lat: -47 * DEG, lon: 162 * DEG, rx: 5.2 * DEG, ry: 2.0 * DEG, angle: -9 * DEG, seed: 8112 }
  ]);

  const INLAND_WATER = Object.freeze([
    { key: "great-inland-lake-a", lat: 43 * DEG, lon: -91 * DEG, rx: 7.8 * DEG, ry: 2.6 * DEG, angle: 8 * DEG, type: "great-lake", seed: 901 },
    { key: "great-inland-lake-b", lat: 47 * DEG, lon: -80 * DEG, rx: 6.6 * DEG, ry: 2.3 * DEG, angle: -18 * DEG, type: "great-lake", seed: 902 },
    { key: "great-inland-lake-c", lat: 39 * DEG, lon: -73 * DEG, rx: 5.9 * DEG, ry: 2.0 * DEG, angle: 18 * DEG, type: "great-lake", seed: 903 },
    { key: "summit-basin-lake", lat: 7 * DEG, lon: -16 * DEG, rx: 7.4 * DEG, ry: 2.2 * DEG, angle: -28 * DEG, type: "inland-sea", seed: 904 },
    { key: "marsh-basin-water", lat: -18 * DEG, lon: 72 * DEG, rx: 7.0 * DEG, ry: 3.0 * DEG, angle: 14 * DEG, type: "marsh-lake", seed: 905 },
    { key: "desert-glass-basin-lake", lat: 11 * DEG, lon: 23 * DEG, rx: 4.8 * DEG, ry: 1.7 * DEG, angle: 34 * DEG, type: "salt-lake", seed: 906 },
    { key: "polar-glacial-lake-a", lat: 69 * DEG, lon: -13 * DEG, rx: 4.4 * DEG, ry: 1.5 * DEG, angle: -11 * DEG, type: "glacial-lake", seed: 907 },
    { key: "polar-glacial-lake-b", lat: -63 * DEG, lon: 32 * DEG, rx: 5.2 * DEG, ry: 1.6 * DEG, angle: 18 * DEG, type: "glacial-lake", seed: 908 }
  ]);

  const RIVERS = Object.freeze([
    {
      key: "northwest-great-lakes-river",
      type: "river",
      width: 0.012,
      points: [
        [58 * DEG, -118 * DEG],
        [51 * DEG, -105 * DEG],
        [45 * DEG, -91 * DEG],
        [39 * DEG, -78 * DEG],
        [33 * DEG, -63 * DEG]
      ]
    },
    {
      key: "equatorial-main-river",
      type: "river",
      width: 0.013,
      points: [
        [19 * DEG, -44 * DEG],
        [13 * DEG, -31 * DEG],
        [7 * DEG, -15 * DEG],
        [2 * DEG, 3 * DEG],
        [-4 * DEG, 19 * DEG],
        [-9 * DEG, 36 * DEG]
      ]
    },
    {
      key: "marsh-basin-river",
      type: "river",
      width: 0.011,
      points: [
        [-3 * DEG, 53 * DEG],
        [-10 * DEG, 62 * DEG],
        [-18 * DEG, 72 * DEG],
        [-25 * DEG, 83 * DEG],
        [-31 * DEG, 96 * DEG]
      ]
    },
    {
      key: "southwest-ridge-river",
      type: "stream",
      width: 0.0075,
      points: [
        [-22 * DEG, -134 * DEG],
        [-30 * DEG, -127 * DEG],
        [-38 * DEG, -121 * DEG],
        [-46 * DEG, -111 * DEG],
        [-52 * DEG, -98 * DEG]
      ]
    },
    {
      key: "southeast-warm-river",
      type: "stream",
      width: 0.007,
      points: [
        [-8 * DEG, 134 * DEG],
        [-16 * DEG, 141 * DEG],
        [-23 * DEG, 149 * DEG],
        [-31 * DEG, 158 * DEG]
      ]
    },
    {
      key: "south-transitional-brook-system",
      type: "brook",
      width: 0.005,
      points: [
        [-48 * DEG, 14 * DEG],
        [-53 * DEG, 25 * DEG],
        [-58 * DEG, 37 * DEG],
        [-62 * DEG, 49 * DEG]
      ]
    },
    {
      key: "north-crown-glacial-brook",
      type: "brook",
      width: 0.0045,
      points: [
        [77 * DEG, -32 * DEG],
        [72 * DEG, -24 * DEG],
        [68 * DEG, -13 * DEG],
        [65 * DEG, 1 * DEG]
      ]
    }
  ]);

  const WONDERS = Object.freeze([
    { key: "great-inland-lake-system", lat: 44 * DEG, lon: -83 * DEG, radius: 16 * DEG, kind: "inland-water" },
    { key: "fjord-mountain-coast", lat: 57 * DEG, lon: -128 * DEG, radius: 15 * DEG, kind: "fjord-cliff" },
    { key: "archipelago-chain", lat: -7 * DEG, lon: 168 * DEG, radius: 19 * DEG, kind: "island-chain" },
    { key: "diamond-opal-summit-spine", lat: 7 * DEG, lon: -16 * DEG, radius: 17 * DEG, kind: "summit-mineral" },
    { key: "marsh-swamp-basin", lat: -18 * DEG, lon: 72 * DEG, radius: 16 * DEG, kind: "marsh-swamp" },
    { key: "marble-plateau", lat: 31 * DEG, lon: 103 * DEG, radius: 15 * DEG, kind: "marble-plateau" },
    { key: "slate-granite-cliff-wall", lat: -38 * DEG, lon: -124 * DEG, radius: 16 * DEG, kind: "cliff-wall" },
    { key: "desert-glass-basin", lat: 11 * DEG, lon: 23 * DEG, radius: 15 * DEG, kind: "dry-mineral-basin" },
    { key: "polar-ice-crown-glacial-field", lat: 73 * DEG, lon: -18 * DEG, radius: 18 * DEG, kind: "polar-glacial" }
  ]);

  const C = Object.freeze({
    abyss: [2, 7, 18],
    deepOcean: [3, 18, 43],
    ocean: [5, 45, 82],
    shelf: [15, 92, 118],
    shallow: [28, 124, 132],
    coastFoam: [118, 176, 164],

    grass: [104, 134, 76],
    darkGrass: [55, 104, 61],
    wetGrass: [64, 118, 72],
    dryGrass: [142, 132, 78],
    marshGrass: [72, 110, 70],
    swampMat: [54, 83, 61],
    mud: [92, 72, 48],
    peat: [60, 52, 42],
    silt: [128, 116, 88],
    dirt: [112, 86, 55],
    clay: [145, 94, 63],
    sand: [196, 171, 108],
    wetSand: [143, 127, 91],

    rock: [96, 98, 92],
    mountainStone: [103, 103, 97],
    granite: [124, 123, 114],
    slate: [68, 76, 86],
    marble: [184, 180, 164],
    cliffShadow: [52, 57, 65],
    basalt: [43, 48, 56],

    snow: [214, 226, 224],
    ice: [188, 216, 226],
    diamond: [208, 235, 240],
    opal: [160, 210, 210],
    platinum: [196, 198, 194],
    gold: [218, 176, 73],
    silver: [186, 192, 194]
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

  function lonLatDistance(lonA, latA, lonB, latB) {
    const dx = wrapPi(lonA - lonB) * Math.cos((latA + latB) * 0.5);
    const dy = latA - latB;
    return Math.sqrt(dx * dx + dy * dy);
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

  function fbm(u, v, seed, octaves = 5) {
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

  function ridged(u, v, seed, octaves = 5) {
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

  function domainWarp(u, v, seed, strength = 0.026) {
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

  function coastlineChip(u, v, body, e, lat) {
    const cosLat = Math.cos(Math.abs(lat));
    const polarDamp = smoothstep(0.06, 0.28, cosLat);

    const shelfNoise = ridged(u + body.seed * 0.0009, v - body.seed * 0.0007, 18000 + body.seed, 5);
    const cutNoise = fbm(u - body.seed * 0.0013, v + body.seed * 0.0017, 21000 + body.seed, 5);

    const angular =
      (
        Math.sign(Math.sin(e.theta * (6 + body.seed % 6) + e.nx * 4.9 - e.ny * 4.2)) * 0.035 +
        Math.sin(e.theta * (11 + body.seed % 5) - body.seed * 0.007) * 0.024
      ) * polarDamp;

    const fracture = (shelfNoise - 0.5) * 0.155;
    const bay = smoothstep(0.52, 0.92, cutNoise) * 0.105;
    const tear = smoothstep(0.62, 0.97, shelfNoise) * 0.035;

    return angular + fracture - bay - tear;
  }

  function landField(u, v) {
    const warped = domainWarp(u, v, 12000, 0.022);
    const lon = (warped.u - 0.5) * TAU;
    const lat = (0.5 - warped.v) * Math.PI;

    let best = {
      field: -20,
      body: MASSES[0],
      island: false
    };

    for (const body of MASSES) {
      const e = ellipseField(lon, lat, body);
      const field = 0.955 - e.dist + coastlineChip(warped.u, warped.v, body, e, lat);

      if (field > best.field) {
        best = { field, body, island: false };
      }
    }

    for (const island of ISLANDS) {
      const e = ellipseField(lon, lat, island);
      const chip =
        Math.sin(e.theta * 5.7 + island.seed * 0.13) * 0.045 +
        (ridged(warped.u + island.seed * 0.001, warped.v - island.seed * 0.001, 41000 + island.seed, 3) - 0.5) * 0.075;

      const field = 0.34 + chip - e.dist;

      if (field > best.field) {
        best = { field, body: MASSES[0], island: true };
      }
    }

    const coast = 1 - smoothstep(0.012, 0.12, Math.abs(best.field));
    const shelf = smoothstep(-0.32, 0.012, best.field) * (best.field <= 0 ? 1 : 0);

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

  function ellipseWater(lon, lat, body) {
    const e = ellipseField(lon, lat, body);
    const chip = (ridged(lon / TAU + body.seed * 0.0003, 0.5 - lat / Math.PI, 99000 + body.seed, 3) - 0.5) * 0.08;
    return 1 - e.dist + chip;
  }

  function riverDistance(lon, lat, points) {
    let best = 999;

    for (let i = 0; i < points.length - 1; i += 1) {
      const aLat = points[i][0];
      const aLon = points[i][1];
      const bLat = points[i + 1][0];
      const bLon = points[i + 1][1];

      const px = wrapPi(lon - aLon) * Math.cos((lat + aLat) * 0.5);
      const py = lat - aLat;
      const bx = wrapPi(bLon - aLon) * Math.cos((aLat + bLat) * 0.5);
      const by = bLat - aLat;

      const denom = bx * bx + by * by;
      const t = denom > 0 ? clamp((px * bx + py * by) / denom, 0, 1) : 0;
      const dx = px - bx * t;
      const dy = py - by * t;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < best) best = d;
    }

    return best;
  }

  function hydrologyField(u, v, land, relief) {
    let inlandWater = 0;
    let lakeType = "";
    let marsh = 0;
    let swamp = 0;
    let river = 0;
    let stream = 0;
    let brook = 0;

    for (const lake of INLAND_WATER) {
      const field = ellipseWater(land.lon, land.lat, lake);

      if (field > inlandWater) {
        inlandWater = field;
        lakeType = lake.type;
      }
    }

    for (const channel of RIVERS) {
      const d = riverDistance(land.lon, land.lat, channel.points);
      const width = channel.width;
      const channelValue = 1 - smoothstep(width * 0.22, width, d);

      if (channel.type === "river") river = Math.max(river, channelValue);
      if (channel.type === "stream") stream = Math.max(stream, channelValue);
      if (channel.type === "brook") brook = Math.max(brook, channelValue);
    }

    const basinWetness = smoothstep(0.42, 0.86, relief.basin + land.coast * 0.25);
    const lowlandWetness = smoothstep(0.32, 0.76, fbm(u - 0.21, v + 0.17, 101000, 5));
    const riverWetness = Math.max(river, stream * 0.8, brook * 0.55);

    marsh = clamp((basinWetness * 0.55 + lowlandWetness * 0.28 + riverWetness * 0.28) * smoothstep(0.12, 0.85, land.field), 0, 1);
    swamp = clamp(marsh * smoothstep(0.58, 0.92, lowlandWetness + basinWetness * 0.35), 0, 1);

    return {
      inlandWater: smoothstep(0.01, 0.18, inlandWater),
      inlandWaterRaw: inlandWater,
      lakeType,
      river,
      stream,
      brook,
      marsh,
      swamp,
      wetGround: clamp(Math.max(marsh, swamp, riverWetness * 0.7), 0, 1)
    };
  }

  function reliefField(u, v, land) {
    const seed = land.body.seed;
    const w1 = domainWarp(u + seed * 0.00013, v - seed * 0.00011, 51000 + seed, 0.04);
    const w2 = domainWarp(u - seed * 0.00017, v + seed * 0.00009, 52000 + seed, 0.024);

    const ridgeLong = ridged(w1.u * 0.92 + 0.03, w1.v * 1.08 - 0.02, 53000 + seed, 5);
    const ridgeBroken = ridged(w2.u * 1.7 - 0.09, w2.v * 1.35 + 0.07, 54000 + seed, 4);
    const rolling = fbm(u * 1.4 + 0.17, v * 1.2 - 0.11, 55000 + seed, 4);
    const basinNoise = fbm(u * 1.9 - 0.21, v * 1.6 + 0.14, 56000 + seed, 4);

    const mountain = smoothstep(0.63, 0.9, ridgeLong * 0.72 + ridgeBroken * 0.28);
    const foothill = smoothstep(0.48, 0.78, ridgeBroken * 0.62 + rolling * 0.38);
    const basin = smoothstep(0.18, 0.47, 1 - basinNoise) * smoothstep(0.12, 0.72, land.field);
    const cliff = land.coast * smoothstep(0.54, 0.88, ridgeLong + ridgeBroken * 0.16);
    const fjordCut = land.coast * smoothstep(0.64, 0.94, ridgeBroken) * smoothstep(0.34, 0.86, mountain + foothill);

    return {
      ridgeLong,
      ridgeBroken,
      rolling,
      basin,
      mountain,
      foothill,
      cliff,
      fjordCut,
      elevation: clamp(mountain * 0.75 + foothill * 0.28 + rolling * 0.08 - basin * 0.08, 0, 1)
    };
  }

  function wonderField(u, v, lon, lat) {
    let best = { key: "", kind: "", pressure: 0 };

    for (const wonder of WONDERS) {
      const d = lonLatDistance(lon, lat, wonder.lon, wonder.lat);
      const pressure = 1 - smoothstep(wonder.radius * 0.18, wonder.radius, d);

      if (pressure > best.pressure) {
        best = { key: wonder.key, kind: wonder.kind, pressure };
      }
    }

    return best;
  }

  function compositionTint(u, v, base, relief, wonder) {
    const summitPressure = clamp(relief.mountain * 0.45 + relief.foothill * 0.18 + wonder.pressure * 0.32 + ridged(u * 1.6, v * 1.3, 150000, 4) * 0.22, 0, 1);
    const summitLevel = clamp(Math.ceil(summitPressure * 9), 1, 9);
    const success = summitLevel >= 9 || summitPressure >= 0.91;
    const caution = summitPressure >= 0.61 && summitPressure < 0.91;

    const vein = smoothstep(0.72, 0.94, ridged(u * 3.0 + 0.13, v * 2.2 - 0.11, 160000, 4));
    const exposure = clamp(0.035 + summitPressure * 0.075 + vein * 0.08, 0.02, 0.18);

    let tone = C.granite;

    if (wonder.kind === "summit-mineral" || summitLevel >= 8) {
      tone = mix(C.diamond, C.opal, fbm(u, v, 161000, 3));
      tone = mix(tone, C.platinum, success ? 0.12 : 0.04);
      tone = mix(tone, C.gold, success ? 0.08 : caution ? 0.04 : 0.02);
    } else if (wonder.kind === "marble-plateau") {
      tone = C.marble;
    } else if (wonder.kind === "cliff-wall") {
      tone = mix(C.slate, C.granite, 0.36);
    } else if (wonder.kind === "dry-mineral-basin") {
      tone = mix(C.clay, C.gold, 0.12);
    } else if (relief.mountain > 0.68) {
      tone = mix(C.slate, C.granite, 0.5);
    }

    return mix(base, tone, exposure * smoothstep(0.4, 0.95, summitPressure));
  }

  function climateGround(u, v, land, relief, hydro, wonder) {
    const latitudeCold = Math.abs(land.lat) / (Math.PI / 2);

    const temperature = clamp(
      1 -
        latitudeCold * 0.92 +
        (fbm(u + 0.07, v - 0.09, 61000, 4) - 0.5) * 0.22 -
        relief.mountain * 0.26 -
        relief.elevation * 0.12,
      0,
      1
    );

    const moisture = clamp(
      fbm(u - 0.18, v + 0.12, 62000, 5) * 0.56 +
        land.coast * 0.18 +
        hydro.wetGround * 0.32 +
        relief.basin * 0.16 +
        (land.island ? 0.07 : 0) -
        relief.mountain * 0.1 -
        temperature * 0.07,
      0,
      1
    );

    const dry = clamp((1 - moisture) * 0.72 + temperature * 0.3 - land.coast * 0.12, 0, 1);
    const snow = smoothstep(0.65, 0.96, latitudeCold + relief.mountain * 0.24 - temperature * 0.11);

    let color = C.grass;

    color = mix(color, C.darkGrass, smoothstep(0.55, 0.88, moisture) * 0.55);
    color = mix(color, C.wetGrass, hydro.wetGround * 0.42);
    color = mix(color, C.marshGrass, hydro.marsh * 0.64);
    color = mix(color, C.swampMat, hydro.swamp * 0.72);
    color = mix(color, C.mud, hydro.wetGround * relief.basin * 0.52);
    color = mix(color, C.peat, hydro.swamp * 0.32);

    color = mix(color, C.dryGrass, smoothstep(0.38, 0.78, dry) * 0.54);
    color = mix(color, C.dirt, smoothstep(0.52, 0.9, dry) * 0.36);
    color = mix(color, C.clay, smoothstep(0.66, 0.94, dry) * 0.22);
    color = mix(color, C.sand, land.coast * 0.18);

    color = mix(color, C.rock, relief.foothill * 0.24);
    color = mix(color, C.mountainStone, relief.mountain * 0.48);
    color = mix(color, C.granite, relief.mountain * 0.28);
    color = mix(color, C.cliffShadow, relief.cliff * 0.38);
    color = mix(color, C.slate, relief.fjordCut * 0.28);

    if (wonder.kind === "fjord-cliff") color = mix(color, C.slate, wonder.pressure * relief.cliff * 0.35);
    if (wonder.kind === "marble-plateau") color = mix(color, C.marble, wonder.pressure * relief.foothill * 0.28);
    if (wonder.kind === "cliff-wall") color = mix(color, C.granite, wonder.pressure * relief.mountain * 0.36);
    if (wonder.kind === "marsh-swamp") color = mix(color, C.marshGrass, wonder.pressure * hydro.wetGround * 0.34);
    if (wonder.kind === "polar-glacial") color = mix(color, C.ice, wonder.pressure * snow * 0.34);

    color = mix(color, C.ice, snow * 0.52);
    color = mix(color, C.snow, snow * relief.mountain * 0.34);

    const fineGrain = (fbm(u * 3.1 + 0.11, v * 2.7 - 0.07, 81000, 4) - 0.5) * 9;
    const mineralGrain = (ridged(u * 2.0 - 0.14, v * 1.9 + 0.09, 82000, 4) - 0.5) * 6;
    const reliefLight = relief.mountain * 13 + relief.foothill * 6 - relief.basin * 7 - relief.cliff * 12;

    color = shade(color, fineGrain + mineralGrain + reliefLight - 4);
    color = compositionTint(u, v, color, relief, wonder);

    return color;
  }

  function waterColor(u, v, land, hydro) {
    if (hydro.inlandWater > 0.52) {
      let inland = C.ocean;

      if (hydro.lakeType === "great-lake") inland = mix(C.ocean, C.shelf, 0.42);
      if (hydro.lakeType === "inland-sea") inland = mix(C.deepOcean, C.ocean, 0.55);
      if (hydro.lakeType === "marsh-lake") inland = mix(C.shelf, C.swampMat, 0.22);
      if (hydro.lakeType === "salt-lake") inland = mix(C.shallow, C.silt, 0.24);
      if (hydro.lakeType === "glacial-lake") inland = mix(C.ice, C.ocean, 0.42);

      return mix(inland, C.coastFoam, land.coast * 0.08);
    }

    const channel = Math.max(hydro.river, hydro.stream * 0.84, hydro.brook * 0.65);

    if (channel > 0.42) {
      return mix(C.shelf, C.shallow, channel * 0.42);
    }

    let water = mix(C.abyss, C.deepOcean, fbm(u * 1.3 + 0.05, v * 1.2 - 0.04, 91000, 4));
    water = mix(water, C.ocean, smoothstep(0.1, 0.84, fbm(u * 2.1 - 0.17, v * 1.7 + 0.09, 92000, 4)) * 0.26);
    water = mix(water, C.shelf, land.shelf * 0.42);
    water = mix(water, C.shallow, land.shelf * land.coast * 0.18);
    water = mix(water, C.coastFoam, land.shelf * land.coast * 0.065);

    return shade(water, (noise(u, v, 160, 93000) - 0.5) * 4);
  }

  function sampleMaterial(u, v) {
    const land = landField(u, v);
    const relief = reliefField(u, v, land);
    const hydro = hydrologyField(u, v, land, relief);
    const wonder = wonderField(u, v, land.lon, land.lat);

    if (!land.isLand || hydro.inlandWater > 0.52 || hydro.river > 0.47 || hydro.stream > 0.52 || hydro.brook > 0.58) {
      return waterColor(u, v, land, hydro);
    }

    return climateGround(u, v, land, relief, hydro, wonder);
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
    canvas.dataset.hearthTargetLandRatio = String(TARGETS.targetLandRatio);
    canvas.dataset.hearthEarthReferenceLandRatio = String(TARGETS.earthReferenceLandRatio);
    canvas.dataset.hearthInlandWater = "true";
    canvas.dataset.hearthRiversStreamsBrooks = "true";
    canvas.dataset.hearthMarshSwampWetGround = "true";
    canvas.dataset.hearthNineWonders = "true";
    canvas.dataset.hearthVegetationTopologyHeld = "true";
    canvas.dataset.hearthNoTrees = "true";
    canvas.dataset.hearthNoBushes = "true";
    canvas.dataset.hearthNoForestCanopy = "true";
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
      authority: "hearth-terrain-materials",
      protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL + QUAD_A_STRIKE + MAPS_T_E_T",
      targetLandRatio: TARGETS.targetLandRatio,
      earthReferenceLandRatio: TARGETS.earthReferenceLandRatio,
      approximateLandRatioIntent: "30-percent-earth-reference",
      inlandWater: true,
      riversStreamsBrooks: true,
      marshSwampWetGround: true,
      nineWonders: true,
      nineWonderSeats: WONDERS.map((wonder) => wonder.key),
      nineToOneComposition: true,
      vegetationTopologyHeld: true,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      noAnimalSystems: true,
      terrainMaterials: [
        "grass",
        "dark-grass",
        "wet-grass",
        "dry-grass",
        "marsh-grass",
        "swamp-mat",
        "mud",
        "peat",
        "silt",
        "dirt",
        "clay",
        "sand",
        "rock",
        "mountain-stone",
        "granite",
        "slate",
        "marble",
        "cliff-shadow",
        "snow",
        "ice",
        "shallow-water",
        "inland-lakes",
        "rivers",
        "streams",
        "brooks",
        "ocean-depth"
      ],
      relevantNumbers: TARGETS,
      artificialDiagonalStripes: false,
      polarSpiralArtifact: false,
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
  document.documentElement.dataset.hearthTargetLandRatio = String(TARGETS.targetLandRatio);
  document.documentElement.dataset.hearthEarthReferenceLandRatio = String(TARGETS.earthReferenceLandRatio);
  document.documentElement.dataset.hearthInlandWater = "true";
  document.documentElement.dataset.hearthRiversStreamsBrooks = "true";
  document.documentElement.dataset.hearthMarshSwampWetGround = "true";
  document.documentElement.dataset.hearthNineWonders = "true";
  document.documentElement.dataset.hearthVegetationTopologyHeld = "true";
  document.documentElement.dataset.hearthNoTrees = "true";
  document.documentElement.dataset.hearthNoBushes = "true";
  document.documentElement.dataset.hearthNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
