// /assets/hearth/hearth.materials.js
// HEARTH_ELEVATION_FIRST_256_NINE_SUMMITS_MATERIALS_TNT_v8
// Full-file replacement.
// Materials authority only.
//
// Purpose:
// - Replace shape-first/oval-first land generation with elevation-first terrain generation.
// - Use the 256-state lattice, Nine Summits, summit pressure, tectonic ridges, basin carving,
//   hydrology, material tint, and sea-level cutting to determine landform.
// - Correct the “long strips of dough” failure by building elevation first, then deriving land.
// - Preserve active route/canvas consumer API.
// - Preserve v6/v7 material refinements: wet-ground-first hydrology, softened shelf glow,
//   suppressed blue guide-lines, believable grass/dirt/rock/mountain/mud transitions.
//
// Owns:
// - Hearth material texture generation
// - elevation-first land/water decision
// - Nine Summits / 256-state global map material sampling
// - terrain material color
// - public HEARTH_MATERIALS API
//
// Does not own:
// - HTML route shell
// - route orchestration
// - canvas projection
// - controls
// - map portal
// - generated image
// - GraphicBox
// - WebGL
//
// No trees. No bushes. No forest canopy. No animal/life topology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ELEVATION_FIRST_256_NINE_SUMMITS_MATERIALS_TNT_v8";
  const RECEIPT = "HEARTH_ELEVATION_FIRST_256_NINE_SUMMITS_MATERIALS_RECEIPT_v8";
  const PREVIOUS_CONTRACT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const VERSION = "2026-05-27.hearth-elevation-first-256-nine-summits-materials-v8";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const LATTICE_SIZE = 16;
  const SEA_LEVEL = 0.08;

  const NINE_SUMMITS = Object.freeze([
    { id: "S01", key: "polar-ice-crown-glacial-field", label: "Polar Ice Crown / Glacial Field", lat: 73 * DEG, lon: -18 * DEG, radius: 18 * DEG, material: "ice", kind: "glacial-crown", seed: 9101 },
    { id: "S02", key: "fjord-mountain-coast", label: "Fjord Mountain Coast", lat: 57 * DEG, lon: -128 * DEG, radius: 15 * DEG, material: "slate", kind: "fjord-cliff", seed: 9102 },
    { id: "S03", key: "great-inland-lake-system", label: "Great Inland Lake System", lat: 44 * DEG, lon: -83 * DEG, radius: 16 * DEG, material: "inland-water", kind: "great-lake-basin", seed: 9103 },
    { id: "S04", key: "marble-plateau", label: "Marble Plateau", lat: 31 * DEG, lon: 103 * DEG, radius: 15 * DEG, material: "marble", kind: "uplift-plateau", seed: 9104 },
    { id: "S05", key: "diamond-opal-summit-spine", label: "Diamond / Opal Summit Spine", lat: 7 * DEG, lon: -16 * DEG, radius: 17 * DEG, material: "summit-mineral", kind: "central-spine", seed: 9105 },
    { id: "S06", key: "desert-glass-basin", label: "Desert Glass Basin", lat: 11 * DEG, lon: 23 * DEG, radius: 15 * DEG, material: "dry-mineral-basin", kind: "dry-basin", seed: 9106 },
    { id: "S07", key: "marsh-swamp-basin", label: "Marsh / Swamp Basin", lat: -18 * DEG, lon: 72 * DEG, radius: 16 * DEG, material: "marsh-swamp", kind: "wet-basin", seed: 9107 },
    { id: "S08", key: "slate-granite-cliff-wall", label: "Slate / Granite Cliff Wall", lat: -38 * DEG, lon: -124 * DEG, radius: 16 * DEG, material: "cliff-wall", kind: "granite-cliff-wall", seed: 9108 },
    { id: "S09", key: "archipelago-chain", label: "Archipelago Chain", lat: -7 * DEG, lon: 168 * DEG, radius: 19 * DEG, material: "island-chain", kind: "archipelago", seed: 9109 }
  ]);

  const SUMMIT_BY_ID = NINE_SUMMITS.reduce((acc, summit) => {
    acc[summit.id] = summit;
    return acc;
  }, Object.create(null));

  const PLATE_DOMAINS = Object.freeze([
    { key: "central-broad-plate", lat: 4 * DEG, lon: -18 * DEG, rx: 58 * DEG, ry: 34 * DEG, angle: -7 * DEG, seed: 1201, role: "central hearth body" },
    { key: "northwest-lake-fjord-plate", lat: 40 * DEG, lon: -96 * DEG, rx: 48 * DEG, ry: 31 * DEG, angle: 15 * DEG, seed: 1302, role: "lake and fjord plate" },
    { key: "northeast-plateau-plate", lat: 28 * DEG, lon: 98 * DEG, rx: 44 * DEG, ry: 28 * DEG, angle: -18 * DEG, seed: 1403, role: "marble plateau plate" },
    { key: "southeast-wet-archipelago-plate", lat: -18 * DEG, lon: 132 * DEG, rx: 40 * DEG, ry: 28 * DEG, angle: 12 * DEG, seed: 1504, role: "wet basin and archipelago plate" },
    { key: "southwest-ridge-plate", lat: -36 * DEG, lon: -112 * DEG, rx: 42 * DEG, ry: 27 * DEG, angle: -22 * DEG, seed: 1605, role: "granite ridge plate" },
    { key: "southern-cold-transition-plate", lat: -57 * DEG, lon: 34 * DEG, rx: 38 * DEG, ry: 22 * DEG, angle: 8 * DEG, seed: 1706, role: "southern cold transition plate" },
    { key: "polar-crown-shoulder", lat: 73 * DEG, lon: -18 * DEG, rx: 34 * DEG, ry: 18 * DEG, angle: -8 * DEG, seed: 1807, role: "polar crown shoulder" }
  ]);

  const BRIDGE_CORRIDORS = Object.freeze([
    { key: "S05-S03", a: "S05", b: "S03", kind: "lake-spine", width: 8.5 * DEG, strength: 0.56 },
    { key: "S05-S06", a: "S05", b: "S06", kind: "dry-mineral", width: 7.5 * DEG, strength: 0.48 },
    { key: "S05-S07", a: "S05", b: "S07", kind: "wet-basin", width: 8.0 * DEG, strength: 0.52 },
    { key: "S03-S02", a: "S03", b: "S02", kind: "lake-fjord", width: 7.5 * DEG, strength: 0.58 },
    { key: "S02-S01", a: "S02", b: "S01", kind: "glacial-ridge", width: 7.0 * DEG, strength: 0.62 },
    { key: "S04-S05", a: "S04", b: "S05", kind: "plateau-spine", width: 8.0 * DEG, strength: 0.54 },
    { key: "S04-S09", a: "S04", b: "S09", kind: "plateau-island", width: 7.2 * DEG, strength: 0.46 },
    { key: "S07-S09", a: "S07", b: "S09", kind: "swamp-archipelago", width: 8.2 * DEG, strength: 0.56 },
    { key: "S08-S02", a: "S08", b: "S02", kind: "western-cliff", width: 8.8 * DEG, strength: 0.60 },
    { key: "S08-S05", a: "S08", b: "S05", kind: "granite-spine", width: 7.2 * DEG, strength: 0.50 },
    { key: "S06-S04", a: "S06", b: "S04", kind: "dry-plateau", width: 7.0 * DEG, strength: 0.46 },
    { key: "S06-S07", a: "S06", b: "S07", kind: "dry-wet-transition", width: 7.5 * DEG, strength: 0.52 },
    { key: "S01-S03", a: "S01", b: "S03", kind: "meltwater-memory", width: 7.0 * DEG, strength: 0.42 },
    { key: "S09-S05", a: "S09", b: "S05", kind: "oceanic-return", width: 7.8 * DEG, strength: 0.44 }
  ]);

  const ISLAND_KEYS = Object.freeze([
    { key: "northwest-cold-key", lat: 69 * DEG, lon: -76 * DEG, rx: 5.2 * DEG, ry: 2.0 * DEG, angle: -20 * DEG, seed: 8101, chain: "S02-S01" },
    { key: "polar-east-key", lat: 71 * DEG, lon: 45 * DEG, rx: 4.5 * DEG, ry: 1.7 * DEG, angle: 18 * DEG, seed: 8102, chain: "S01-S03" },
    { key: "plateau-shelf-key", lat: 21 * DEG, lon: 66 * DEG, rx: 4.8 * DEG, ry: 1.9 * DEG, angle: -26 * DEG, seed: 8103, chain: "S04-S06" },
    { key: "wet-basin-key", lat: -19 * DEG, lon: 57 * DEG, rx: 5.6 * DEG, ry: 2.1 * DEG, angle: 20 * DEG, seed: 8104, chain: "S06-S07" },
    { key: "eastern-broken-shelf-key", lat: 44 * DEG, lon: 123 * DEG, rx: 6.4 * DEG, ry: 2.3 * DEG, angle: -18 * DEG, seed: 8105, chain: "S04-S09" },
    { key: "marble-reef-key", lat: 34 * DEG, lon: 139 * DEG, rx: 5.0 * DEG, ry: 1.8 * DEG, angle: 31 * DEG, seed: 8106, chain: "S04-S09" },
    { key: "archipelago-prime-key", lat: -9 * DEG, lon: 170 * DEG, rx: 5.8 * DEG, ry: 2.2 * DEG, angle: 34 * DEG, seed: 8107, chain: "S09" },
    { key: "southwest-ridge-key", lat: -55 * DEG, lon: -84 * DEG, rx: 4.9 * DEG, ry: 1.8 * DEG, angle: 11 * DEG, seed: 8108, chain: "S08" },
    { key: "southern-cold-key", lat: -70 * DEG, lon: 76 * DEG, rx: 5.4 * DEG, ry: 1.9 * DEG, angle: -20 * DEG, seed: 8109, chain: "S07-S09" }
  ]);

  const C = Object.freeze({
    abyss: [2, 7, 18],
    deepOcean: [3, 18, 42],
    ocean: [5, 42, 78],
    shelf: [14, 78, 101],
    shallow: [24, 106, 114],
    coastFoam: [96, 144, 137],

    grass: [102, 132, 76],
    darkGrass: [57, 101, 61],
    wetGrass: [65, 111, 71],
    dryGrass: [139, 128, 78],
    marshGrass: [73, 105, 69],
    swampMat: [54, 79, 59],
    mud: [89, 70, 48],
    peat: [58, 51, 42],
    silt: [123, 112, 87],
    dirt: [108, 84, 56],
    clay: [139, 92, 63],
    sand: [187, 165, 110],
    wetSand: [132, 120, 91],

    rock: [94, 96, 91],
    mountainStone: [101, 101, 96],
    granite: [121, 120, 112],
    slate: [67, 75, 84],
    marble: [177, 173, 158],
    cliffShadow: [51, 56, 64],
    basalt: [43, 48, 56],
    opal: [154, 178, 172],
    diamond: [194, 206, 196],
    gold: [178, 141, 68],

    snow: [209, 223, 222],
    ice: [181, 209, 220]
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

  function domainWarp(u, v, seed, strength = 0.02) {
    const a = fbm(u + 0.17, v - 0.11, seed + 17, 4) - 0.5;
    const b = fbm(u - 0.13, v + 0.19, seed + 31, 4) - 0.5;

    return {
      u: wrap01(u + a * strength),
      v: clamp(v + b * strength, 0, 1)
    };
  }

  function latticeAddress(u, v) {
    const cleanU = wrap01(u);
    const cleanV = clamp(v, 0, 0.999999);
    const column = clamp(Math.floor(cleanU * LATTICE_SIZE), 0, LATTICE_SIZE - 1);
    const row = clamp(Math.floor(cleanV * LATTICE_SIZE), 0, LATTICE_SIZE - 1);
    const cell = row * LATTICE_SIZE + column + 1;

    return Object.freeze({
      row,
      column,
      cell,
      rowAddress: String(row + 1).padStart(2, "0"),
      columnAddress: String(column + 1).padStart(2, "0"),
      address: `${String(row + 1).padStart(2, "0")}-${String(column + 1).padStart(2, "0")}`,
      state: `ST-${String(cell).padStart(3, "0")}`,
      quadrant: row < 8 ? (column < 8 ? "northwest" : "northeast") : (column < 8 ? "southwest" : "southeast")
    });
  }

  function coordinateFromUV(u, v) {
    const cleanU = wrap01(u);
    const cleanV = clamp(v, 0, 1);
    const lonDeg = cleanU * 360 - 180;
    const latDeg = 90 - cleanV * 180;

    return Object.freeze({
      u: cleanU,
      v: cleanV,
      lonDeg,
      latDeg,
      lon: lonDeg * DEG,
      lat: latDeg * DEG,
      lattice: latticeAddress(cleanU, cleanV)
    });
  }

  function summitPressure(lon, lat, summit) {
    const d = lonLatDistance(lon, lat, summit.lon, summit.lat);

    return Object.freeze({
      distance: d,
      core: clamp(1 - smoothstep(0, summit.radius * 0.35, d), 0, 1),
      field: clamp(1 - smoothstep(summit.radius * 0.22, summit.radius, d), 0, 1),
      skirt: clamp(1 - smoothstep(summit.radius * 0.62, summit.radius * 1.74, d), 0, 1)
    });
  }

  function nearestSummit(lon, lat) {
    let best = null;

    for (const summit of NINE_SUMMITS) {
      const pressure = summitPressure(lon, lat, summit);
      const combined = pressure.field * 0.78 + pressure.skirt * 0.22;

      if (!best || combined > best.pressure) {
        best = {
          ...summit,
          distance: pressure.distance,
          core: pressure.core,
          field: pressure.field,
          skirt: pressure.skirt,
          pressure: clamp(combined, 0, 1)
        };
      }
    }

    return Object.freeze(best);
  }

  function localProjectedPoint(lon, lat, referenceLat) {
    return {
      x: lon * Math.cos(referenceLat),
      y: lat
    };
  }

  function distanceToSegment(lon, lat, a, b) {
    const referenceLat = (a.lat + b.lat + lat) / 3;
    const p = localProjectedPoint(lon, lat, referenceLat);
    const pa = localProjectedPoint(a.lon, a.lat, referenceLat);
    const pb = localProjectedPoint(b.lon, b.lat, referenceLat);

    const vx = pb.x - pa.x;
    const vy = pb.y - pa.y;
    const wx = p.x - pa.x;
    const wy = p.y - pa.y;
    const lengthSq = vx * vx + vy * vy;
    const t = lengthSq > 0 ? clamp((wx * vx + wy * vy) / lengthSq, 0, 1) : 0;
    const cx = pa.x + vx * t;
    const cy = pa.y + vy * t;

    return {
      distance: Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy)),
      t
    };
  }

  function bridgePressure(lon, lat) {
    const results = [];
    let ridge = 0;
    let basin = 0;
    let wet = 0;
    let dry = 0;
    let shelf = 0;
    let fracture = 0;
    let island = 0;
    let strongest = null;

    for (const corridor of BRIDGE_CORRIDORS) {
      const a = SUMMIT_BY_ID[corridor.a];
      const b = SUMMIT_BY_ID[corridor.b];
      if (!a || !b) continue;

      const d = distanceToSegment(lon, lat, a, b);
      const centerFade = Math.sin(Math.PI * d.t);
      const pressure = (1 - smoothstep(corridor.width * 0.20, corridor.width, d.distance)) * centerFade * corridor.strength;
      const clean = clamp(pressure, 0, 1);
      const item = { ...corridor, pressure: clean, t: d.t, distance: d.distance };

      results.push(item);
      if (!strongest || clean > strongest.pressure) strongest = item;

      if (corridor.kind.includes("ridge") || corridor.kind.includes("spine") || corridor.kind.includes("cliff") || corridor.kind.includes("plateau")) ridge = Math.max(ridge, clean);
      if (corridor.kind.includes("lake") || corridor.kind.includes("meltwater") || corridor.kind.includes("wet") || corridor.kind.includes("swamp")) {
        wet = Math.max(wet, clean);
        basin = Math.max(basin, clean * 0.78);
      }
      if (corridor.kind.includes("dry")) dry = Math.max(dry, clean);
      if (corridor.kind.includes("island") || corridor.kind.includes("archipelago") || corridor.kind.includes("oceanic")) {
        shelf = Math.max(shelf, clean * 0.72);
        island = Math.max(island, clean);
      }
      if (corridor.kind.includes("fjord") || corridor.kind.includes("cliff") || corridor.kind.includes("granite")) fracture = Math.max(fracture, clean);
    }

    return Object.freeze({
      strongest,
      results,
      ridge: clamp(ridge, 0, 1),
      basin: clamp(basin, 0, 1),
      wet: clamp(wet, 0, 1),
      dry: clamp(dry, 0, 1),
      shelf: clamp(shelf, 0, 1),
      fracture: clamp(fracture, 0, 1),
      island: clamp(island, 0, 1),
      pressure: clamp(Math.max(ridge, wet, dry, shelf, fracture, island), 0, 1)
    });
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

  function platePressure(coord) {
    let maxPressure = 0;
    let sumPressure = 0;
    let strongest = PLATE_DOMAINS[0];

    for (const plate of PLATE_DOMAINS) {
      const e = ellipseField(coord.lon, coord.lat, plate);
      const broad = 1 - smoothstep(0.50, 1.0, e.dist);
      const skirt = 1 - smoothstep(0.88, 1.65, e.dist);
      const rough = (ridged(coord.u + plate.seed * 0.0007, coord.v - plate.seed * 0.0005, 26000 + plate.seed, 4) - 0.5) * 0.08;
      const pressure = clamp(broad * 0.78 + skirt * 0.22 + rough, 0, 1);

      sumPressure += pressure;
      if (pressure > maxPressure) {
        maxPressure = pressure;
        strongest = plate;
      }
    }

    return Object.freeze({
      strongest,
      max: clamp(maxPressure, 0, 1),
      sum: clamp(sumPressure, 0, 4),
      blended: clamp(maxPressure * 0.82 + Math.min(sumPressure, 2.3) * 0.08, 0, 1)
    });
  }

  function islandPressure(coord, summit, bridge) {
    let pressure = 0;
    let strongest = null;

    for (const island of ISLAND_KEYS) {
      const e = ellipseField(coord.lon, coord.lat, island);
      const brokenEdge =
        Math.sin(e.theta * 5.7 + island.seed * 0.13) * 0.04 +
        (ridged(coord.u + island.seed * 0.001, coord.v - island.seed * 0.001, 41000 + island.seed, 3) - 0.5) * 0.07;

      const chainBoost =
        bridge.island * 0.08 +
        (summit && (summit.id === "S09" || island.chain.includes(summit.id)) ? summit.pressure * 0.10 : 0);

      const raw = 0.34 + brokenEdge + chainBoost - e.dist;
      const clean = smoothstep(0.01, 0.20, raw);

      if (clean > pressure) {
        pressure = clean;
        strongest = island;
      }
    }

    return Object.freeze({
      pressure: clamp(pressure, 0, 1),
      strongest
    });
  }

  function sampleGlobalMap(u, v) {
    const base = coordinateFromUV(u, v);
    const warp = domainWarp(base.u, base.v, 12000, 0.020);
    const coord = coordinateFromUV(warp.u, warp.v);
    const summit = nearestSummit(coord.lon, coord.lat);
    const bridge = bridgePressure(coord.lon, coord.lat);
    const lattice = coord.lattice;

    const cellNoise = hash(lattice.column + 1, lattice.row + 1, 256007);
    const cellRidge = hash(lattice.column + 17, lattice.row + 31, 256137);
    const cellBasin = hash(lattice.column + 41, lattice.row + 53, 256251);
    const cellShear = hash(lattice.column + 61, lattice.row + 73, 256509);
    const plate = platePressure(coord);
    const islands = islandPressure(coord, summit, bridge);

    return Object.freeze({
      base,
      coord,
      summit,
      bridge,
      lattice,
      cellNoise,
      cellRidge,
      cellBasin,
      cellShear,
      plate,
      islands,
      coordinateSystem: "lon-lat-u-v-16x16",
      lattice256: true,
      elevationFirst: true
    });
  }

  function summitElevationEffect(summit) {
    let uplift = 0;
    let depression = 0;
    let dry = 0;
    let wet = 0;
    let glacial = 0;
    let fracture = 0;

    if (summit.id === "S01") {
      uplift += summit.pressure * 0.10;
      glacial += summit.pressure * 0.86;
    }

    if (summit.id === "S02") {
      uplift += summit.pressure * 0.18;
      fracture += summit.pressure * 0.46;
    }

    if (summit.id === "S03") {
      depression += summit.core * 0.30 + summit.field * 0.08;
      wet += summit.pressure * 0.76;
    }

    if (summit.id === "S04") {
      uplift += summit.pressure * 0.18;
    }

    if (summit.id === "S05") {
      uplift += summit.pressure * 0.26;
      fracture += summit.pressure * 0.20;
    }

    if (summit.id === "S06") {
      depression += summit.field * 0.12;
      dry += summit.pressure * 0.74;
    }

    if (summit.id === "S07") {
      depression += summit.core * 0.20 + summit.field * 0.08;
      wet += summit.pressure * 0.82;
    }

    if (summit.id === "S08") {
      uplift += summit.pressure * 0.18;
      fracture += summit.pressure * 0.56;
    }

    if (summit.id === "S09") {
      uplift += summit.pressure * 0.06;
      wet += summit.pressure * 0.34;
    }

    return Object.freeze({
      uplift: clamp(uplift, 0, 1),
      depression: clamp(depression, 0, 1),
      dry: clamp(dry, 0, 1),
      wet: clamp(wet, 0, 1),
      glacial: clamp(glacial, 0, 1),
      fracture: clamp(fracture, 0, 1)
    });
  }

  function elevationField(u, v) {
    const global = sampleGlobalMap(u, v);
    const coord = global.coord;
    const summitFx = summitElevationEffect(global.summit);

    const crust =
      (fbm(coord.u * 1.15 + 0.07, coord.v * 1.10 - 0.03, 30000, 5) - 0.5) * 0.18 +
      (ridged(coord.u * 1.4 - 0.11, coord.v * 1.25 + 0.09, 31000, 4) - 0.5) * 0.10;

    const crossAxisSpread =
      (fbm(coord.u * 0.72 + 0.33, coord.v * 1.86 - 0.17, 32000, 4) - 0.5) * 0.08 +
      (fbm(coord.u * 1.88 - 0.25, coord.v * 0.74 + 0.21, 33000, 4) - 0.5) * 0.08;

    const cellLift =
      (global.cellNoise - 0.5) * 0.028 +
      (global.cellRidge - 0.5) * 0.020 -
      (global.cellBasin - 0.5) * 0.018;

    const plateLift = global.plate.blended * 0.70;
    const islandLift = global.islands.pressure * 0.54;

    const corridorLift =
      global.bridge.ridge * 0.050 +
      global.bridge.fracture * 0.035 +
      global.bridge.island * global.islands.pressure * 0.065;

    const basinCut =
      global.bridge.basin * 0.060 +
      global.bridge.wet * 0.045 +
      summitFx.depression * 0.74;

    const dryBasinCut =
      global.bridge.dry * 0.035 +
      summitFx.dry * 0.070;

    const oceanCarve =
      smoothstep(0.0, 0.22, 1 - global.plate.blended) * 0.10 *
      smoothstep(0.0, 0.32, 1 - global.islands.pressure);

    const raw =
      -0.37 +
      plateLift +
      islandLift +
      crust +
      crossAxisSpread +
      cellLift +
      summitFx.uplift +
      corridorLift -
      basinCut -
      dryBasinCut -
      oceanCarve;

    const aboveSea = raw - SEA_LEVEL;

    return Object.freeze({
      raw,
      aboveSea,
      seaLevel: SEA_LEVEL,
      isLand: aboveSea > 0,
      global,
      coord,
      summitFx,
      plateLift,
      islandLift,
      corridorLift,
      basinCut,
      crust,
      crossAxisSpread,
      cellLift
    });
  }

  function landField(u, v) {
    const elevation = elevationField(u, v);
    const global = elevation.global;
    const coord = elevation.coord;
    const coast = 1 - smoothstep(0.012, 0.085, Math.abs(elevation.aboveSea));
    const shelf = smoothstep(-0.28, 0.012, elevation.aboveSea) * (elevation.aboveSea <= 0 ? 1 : 0);

    return Object.freeze({
      lon: coord.lon,
      lat: coord.lat,
      u: coord.u,
      v: coord.v,
      elevation: elevation.raw,
      elevationAboveSea: elevation.aboveSea,
      field: elevation.aboveSea,
      isLand: elevation.isLand,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      body: global.plate.strongest,
      island: global.islands.pressure > 0.58,
      islandKey: global.islands.strongest ? global.islands.strongest.key : "",
      global,
      lattice: global.lattice,
      summit: global.summit,
      bridge: global.bridge,
      summitFx: elevation.summitFx,
      elevationFirst: true
    });
  }

  function reliefField(u, v, land) {
    const seed = land.body.seed || 50000;
    const global = land.global;

    const w1 = domainWarp(u + seed * 0.00013, v - seed * 0.00011, 51000 + seed, 0.034);
    const w2 = domainWarp(u - seed * 0.00017, v + seed * 0.00009, 52000 + seed, 0.020);

    const ridgeLong = ridged(w1.u * 0.92 + 0.03, w1.v * 1.08 - 0.02, 53000 + seed, 5);
    const ridgeBroken = ridged(w2.u * 1.7 - 0.09, w2.v * 1.35 + 0.07, 54000 + seed, 4);
    const rolling = fbm(u * 1.4 + 0.17, v * 1.2 - 0.11, 55000 + seed, 4);
    const basinNoise = fbm(u * 1.9 - 0.21, v * 1.6 + 0.14, 56000 + seed, 4);

    const summitMountain = land.summitFx.uplift * 1.08;
    const summitBasin = land.summitFx.depression * 0.92;
    const corridorRidge = global.bridge.ridge * 0.50 + global.bridge.fracture * 0.54;
    const corridorBasin = global.bridge.basin * 0.46 + global.bridge.wet * 0.40;

    const elevationRise = smoothstep(0.01, 0.42, land.elevationAboveSea);

    const mountain = smoothstep(
      0.59,
      0.91,
      ridgeLong * 0.56 +
        ridgeBroken * 0.24 +
        summitMountain * 0.36 +
        corridorRidge * 0.28 +
        global.cellRidge * 0.08 +
        elevationRise * 0.20
    );

    const foothill = smoothstep(
      0.44,
      0.78,
      ridgeBroken * 0.52 +
        rolling * 0.32 +
        corridorRidge * 0.20 +
        elevationRise * 0.16
    );

    const basin = clamp(
      smoothstep(0.18, 0.48, 1 - basinNoise) * smoothstep(-0.04, 0.42, land.elevationAboveSea) +
        summitBasin * 0.30 +
        corridorBasin * 0.20,
      0,
      1
    );

    const cliff = clamp(
      land.coast * smoothstep(0.50, 0.88, ridgeLong + ridgeBroken * 0.16 + global.bridge.fracture * 0.30),
      0,
      1
    );

    const fjordCut = clamp(
      land.coast *
        smoothstep(0.62, 0.94, ridgeBroken + global.bridge.fracture * 0.34) *
        smoothstep(0.34, 0.86, mountain + foothill),
      0,
      1
    );

    const glacialBridge = global.bridge.strongest && global.bridge.strongest.kind === "glacial-ridge"
      ? global.bridge.strongest.pressure * 0.18
      : 0;

    const glacial = clamp(land.summitFx.glacial + glacialBridge, 0, 1);

    return Object.freeze({
      ridgeLong,
      ridgeBroken,
      rolling,
      basin,
      mountain: clamp(mountain, 0, 1),
      foothill: clamp(foothill, 0, 1),
      cliff,
      fjordCut,
      glacial,
      corridorRidge: clamp(corridorRidge, 0, 1),
      corridorBasin: clamp(corridorBasin, 0, 1),
      elevation: clamp(
        land.elevationAboveSea * 0.72 +
          mountain * 0.40 +
          foothill * 0.18 +
          rolling * 0.08 -
          basin * 0.10,
        0,
        1
      )
    });
  }

  function fallbackHydrology(land, relief) {
    const lakeCore =
      (land.summit.id === "S03" ? land.summit.core * 0.82 + land.summit.field * 0.16 : 0) +
      (land.summit.id === "S07" ? land.summit.core * 0.22 : 0);

    const depressedLake = smoothstep(-0.03, 0.08, 0.08 - land.elevationAboveSea) * relief.basin * land.bridge.wet * 0.32;

    return Object.freeze({
      inlandWater: clamp(lakeCore + depressedLake, 0, 1),
      lakeType: land.summit.id === "S03" ? "great-lake" : land.summit.id === "S07" ? "marsh-lake" : "",
      lakeKey: land.summit.id === "S03" ? "great-inland-lake-system" : "",
      lakeShore: clamp(land.summit.id === "S03" ? land.summit.skirt : relief.basin * 0.18, 0, 1),
      river: 0,
      stream: 0,
      brook: 0,
      channelCorridor: clamp(land.bridge.wet * 0.30 + relief.basin * 0.12, 0, 1),
      erosionCorridor: clamp(land.bridge.fracture * 0.20 + relief.fjordCut * 0.16, 0, 1),
      marsh: clamp(relief.basin * 0.20 + (land.summit.id === "S07" ? land.summit.pressure * 0.42 : 0), 0, 1),
      swamp: clamp(relief.basin * 0.10 + (land.summit.id === "S07" ? land.summit.pressure * 0.30 : 0), 0, 1),
      wetGround: clamp(relief.basin * 0.24 + land.coast * 0.06 + land.bridge.wet * 0.18, 0, 1),
      visibleWaterCore: 0,
      visibleBlueLineSuppressed: true
    });
  }

  function normalizeHydrology(hydro, fallback) {
    const source = hydro && typeof hydro === "object" ? hydro : {};
    const numeric = (key) => Number.isFinite(Number(source[key])) ? Number(source[key]) : fallback[key];

    return Object.freeze({
      inlandWater: numeric("inlandWater"),
      lakeType: source.lakeType || fallback.lakeType,
      lakeKey: source.lakeKey || fallback.lakeKey,
      lakeShore: numeric("lakeShore"),
      river: numeric("river"),
      stream: numeric("stream"),
      brook: numeric("brook"),
      channelCorridor: numeric("channelCorridor"),
      erosionCorridor: numeric("erosionCorridor"),
      marsh: numeric("marsh"),
      swamp: numeric("swamp"),
      wetGround: numeric("wetGround"),
      visibleWaterCore: numeric("visibleWaterCore"),
      visibleBlueLineSuppressed: source.visibleBlueLineSuppressed !== false
    });
  }

  function sampleHydrology(u, v, land, relief) {
    const fallback = fallbackHydrology(land, relief);

    if (window.HEARTH_HYDROLOGY && typeof window.HEARTH_HYDROLOGY.sampleHydrology === "function") {
      const external = window.HEARTH_HYDROLOGY.sampleHydrology(u, v, {
        lon: land.lon,
        lat: land.lat,
        field: land.field,
        elevation: land.elevation,
        elevationAboveSea: land.elevationAboveSea,
        isLand: land.isLand,
        coast: land.coast,
        basin: relief.basin,
        mountain: relief.mountain,
        summit: land.summit,
        bridge: land.bridge,
        lattice: land.lattice,
        coordinateSystem: "lon-lat-u-v-16x16",
        elevationFirst: true
      });

      return normalizeHydrology(external, fallback);
    }

    return fallback;
  }

  function sampleComposition(u, v, relief, summit) {
    if (window.HEARTH_COMPOSITION && typeof window.HEARTH_COMPOSITION.sampleComposition === "function") {
      return window.HEARTH_COMPOSITION.sampleComposition(u, v, {
        elevation: relief.elevation,
        mountain: relief.mountain,
        cliff: relief.cliff,
        wonderPressure: summit.pressure,
        summit,
        lattice256: true,
        elevationFirst: true
      });
    }

    return null;
  }

  function tintByComposition(color, composition) {
    if (window.HEARTH_COMPOSITION && typeof window.HEARTH_COMPOSITION.tintTerrain === "function") {
      return window.HEARTH_COMPOSITION.tintTerrain(color, composition, 0.048);
    }

    return color;
  }

  function tintBySummit(color, summit, relief, hydro) {
    let next = color;

    if (summit.id === "S01") next = mix(next, C.ice, summit.pressure * 0.28);
    if (summit.id === "S02") next = mix(next, C.slate, summit.pressure * relief.cliff * 0.30);
    if (summit.id === "S03") next = mix(next, C.silt, summit.pressure * hydro.wetGround * 0.18);
    if (summit.id === "S04") next = mix(next, C.marble, summit.pressure * (relief.foothill + relief.mountain) * 0.20);
    if (summit.id === "S05") {
      next = mix(next, C.diamond, summit.core * relief.mountain * 0.12);
      next = mix(next, C.opal, summit.pressure * relief.foothill * 0.10);
    }
    if (summit.id === "S06") next = mix(next, C.sand, summit.pressure * 0.18);
    if (summit.id === "S07") next = mix(next, C.marshGrass, summit.pressure * hydro.wetGround * 0.26);
    if (summit.id === "S08") next = mix(next, C.granite, summit.pressure * relief.mountain * 0.28);
    if (summit.id === "S09") next = mix(next, C.sand, summit.pressure * 0.10);

    return next;
  }

  function groundColor(u, v, land, relief, hydro, summit, composition) {
    const latitudeCold = Math.abs(land.lat) / (Math.PI / 2);

    const temperature = clamp(
      1 -
        latitudeCold * 0.92 +
        (fbm(u + 0.07, v - 0.09, 61000, 4) - 0.5) * 0.18 -
        relief.mountain * 0.26 -
        relief.elevation * 0.12 -
        relief.glacial * 0.24 +
        (summit.id === "S06" ? summit.pressure * 0.12 : 0),
      0,
      1
    );

    const moisture = clamp(
      fbm(u - 0.18, v + 0.12, 62000, 5) * 0.46 +
        land.coast * 0.12 +
        hydro.wetGround * 0.40 +
        relief.basin * 0.12 +
        land.bridge.wet * 0.18 +
        (land.island ? 0.05 : 0) -
        relief.mountain * 0.10 -
        temperature * 0.06 -
        land.bridge.dry * 0.18 -
        (summit.id === "S06" ? summit.pressure * 0.16 : 0),
      0,
      1
    );

    const dry = clamp((1 - moisture) * 0.72 + temperature * 0.30 - land.coast * 0.10 + land.bridge.dry * 0.14, 0, 1);
    const snow = smoothstep(0.65, 0.96, latitudeCold + relief.mountain * 0.24 + relief.glacial * 0.28 - temperature * 0.11);

    let color = C.grass;

    color = mix(color, C.darkGrass, smoothstep(0.58, 0.9, moisture) * 0.32);
    color = mix(color, C.wetGrass, hydro.wetGround * 0.30);
    color = mix(color, C.marshGrass, hydro.marsh * 0.50);
    color = mix(color, C.swampMat, hydro.swamp * 0.58);
    color = mix(color, C.mud, hydro.wetGround * relief.basin * 0.44);
    color = mix(color, C.peat, hydro.swamp * 0.24);

    color = mix(color, C.dryGrass, smoothstep(0.42, 0.8, dry) * 0.42);
    color = mix(color, C.dirt, smoothstep(0.56, 0.91, dry) * 0.28);
    color = mix(color, C.clay, smoothstep(0.68, 0.95, dry) * 0.15);
    color = mix(color, C.sand, land.coast * 0.105 + land.bridge.shelf * 0.035);

    color = mix(color, C.rock, relief.foothill * 0.20);
    color = mix(color, C.mountainStone, relief.mountain * 0.38);
    color = mix(color, C.granite, relief.mountain * 0.20);
    color = mix(color, C.cliffShadow, relief.cliff * 0.28);
    color = mix(color, C.slate, relief.fjordCut * 0.18 + land.bridge.fracture * 0.12);

    color = mix(color, C.mud, hydro.channelCorridor * 0.16);
    color = mix(color, C.wetGrass, hydro.channelCorridor * 0.11);
    color = mix(color, C.cliffShadow, hydro.erosionCorridor * 0.08);

    color = tintBySummit(color, summit, relief, hydro);

    color = mix(color, C.ice, snow * 0.40);
    color = mix(color, C.snow, snow * relief.mountain * 0.24 + relief.glacial * 0.16);

    const broadVariation = (fbm(u * 1.35 + 0.11, v * 1.25 - 0.07, 80000, 5) - 0.5) * 4;
    const fineGrain = (fbm(u * 3.2 + 0.17, v * 2.9 - 0.19, 81000, 4) - 0.5) * 5;
    const mineralGrain = (ridged(u * 1.8 - 0.14, v * 1.7 + 0.09, 82000, 4) - 0.5) * 4;
    const latticeShade = (land.global.cellNoise - 0.5) * 1.8 + (land.global.cellRidge - 0.5) * 1.4;
    const reliefLight = relief.mountain * 9 + relief.foothill * 4 - relief.basin * 5 - relief.cliff * 8 - hydro.erosionCorridor * 2;

    color = shade(color, broadVariation + fineGrain + mineralGrain + latticeShade + reliefLight - 2);
    color = tintByComposition(color, composition);

    return color;
  }

  function waterColor(u, v, land, hydro) {
    if (hydro.inlandWater > 0.52 && land.isLand) {
      let inland = mix(C.ocean, C.shelf, 0.28);

      if (hydro.lakeType === "great-lake") inland = mix(C.ocean, C.shelf, 0.28);
      if (hydro.lakeType === "inland-lake") inland = mix(C.deepOcean, C.ocean, 0.48);
      if (hydro.lakeType === "marsh-lake") inland = mix(C.shelf, C.swampMat, 0.14);
      if (hydro.lakeType === "glacial-lake") inland = mix(C.ice, C.ocean, 0.34);

      return mix(inland, C.coastFoam, hydro.lakeShore * 0.045);
    }

    let water = mix(C.abyss, C.deepOcean, fbm(u * 1.25 + 0.05, v * 1.15 - 0.04, 91000, 4));
    water = mix(water, C.ocean, smoothstep(0.1, 0.84, fbm(u * 2.1 - 0.17, v * 1.7 + 0.09, 92000, 4)) * 0.20);
    water = mix(water, C.shelf, land.shelf * 0.30 + land.bridge.shelf * land.shelf * 0.06);
    water = mix(water, C.shallow, land.shelf * land.coast * 0.09);
    water = mix(water, C.coastFoam, land.shelf * land.coast * 0.026);

    return shade(water, (noise(u, v, 120, 93000) - 0.5) * 2.4);
  }

  function sampleMaterial(u, v) {
    const land = landField(u, v);
    const relief = reliefField(u, v, land);
    const hydro = sampleHydrology(u, v, land, relief);
    const summit = land.summit;
    const composition = sampleComposition(u, v, relief, summit);

    if (!land.isLand || hydro.inlandWater > 0.52) {
      return waterColor(u, v, land, hydro);
    }

    return groundColor(u, v, land, relief, hydro, summit, composition);
  }

  function createTextureCanvas(options = {}) {
    const width = clamp(Math.floor(options.width || 1536), 768, 4096);
    const height = clamp(Math.floor(options.height || 768), 384, 2048);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let landSamples = 0;
    let waterSamples = 0;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const land = landField(u, v);
        const color = sampleMaterial(u, v);
        const index = (y * width + x) * 4;

        if (land.isLand) landSamples += 1;
        else waterSamples += 1;

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    const landRatio = landSamples / Math.max(1, landSamples + waterSamples);

    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
    canvas.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthConsumesComposition = String(Boolean(window.HEARTH_COMPOSITION));
    canvas.dataset.hearthConsumesHydrology = String(Boolean(window.HEARTH_HYDROLOGY));
    canvas.dataset.hearthParentAligned = "true";
    canvas.dataset.hearthElevationFirst = "true";
    canvas.dataset.hearthLandFromElevation = "true";
    canvas.dataset.hearthSeaLevel = String(SEA_LEVEL);
    canvas.dataset.hearthMeasuredLandRatio = String(Math.round(landRatio * 10000) / 10000);
    canvas.dataset.hearthNineSummitsGlobalMap = "true";
    canvas.dataset.hearthLattice256 = "true";
    canvas.dataset.hearthCoordinateSystem = "lon-lat-u-v-16x16";
    canvas.dataset.hearthSummitAnchorCount = String(NINE_SUMMITS.length);
    canvas.dataset.hearthPlateDomainCount = String(PLATE_DOMAINS.length);
    canvas.dataset.hearthBridgeCorridorCount = String(BRIDGE_CORRIDORS.length);
    canvas.dataset.hearthIslandKeyCount = String(ISLAND_KEYS.length);
    canvas.dataset.hearthTargetLandRatio = "0.30";
    canvas.dataset.hearthVisibleBlueLineSuppressed = "true";
    canvas.dataset.hearthShelfGlowSoftened = "true";
    canvas.dataset.hearthTerrainInteriorRefined = "true";
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
      authority: "terrain-materials-elevation-first-nine-summits-256-global-map",
      consumesComposition: Boolean(window.HEARTH_COMPOSITION),
      consumesHydrology: Boolean(window.HEARTH_HYDROLOGY),
      parentAligned: true,
      elevationFirst: true,
      landFromElevation: true,
      seaLevel: SEA_LEVEL,
      nineSummitsGlobalMap: true,
      lattice256: true,
      coordinateSystem: "lon-lat-u-v-16x16",
      summitAnchorCount: NINE_SUMMITS.length,
      plateDomainCount: PLATE_DOMAINS.length,
      bridgeCorridorCount: BRIDGE_CORRIDORS.length,
      islandKeyCount: ISLAND_KEYS.length,
      targetLandRatio: 0.3,
      earthReferenceLandRatio: 0.29,
      hydrologyRenderedAsWetGroundFirst: true,
      visibleBlueLineSuppressed: true,
      shelfGlowSoftened: true,
      terrainInteriorRefined: true,
      correctedFailure: "long-strip-landform-from-shape-first-generation",
      correctionMethod: "elevation-first-sea-level-cut",
      summitAnchors: NINE_SUMMITS.map((summit) => ({
        id: summit.id,
        key: summit.key,
        label: summit.label,
        latDeg: Math.round(summit.lat * RAD * 1000) / 1000,
        lonDeg: Math.round(summit.lon * RAD * 1000) / 1000,
        material: summit.material,
        kind: summit.kind
      })),
      bridgeCorridors: BRIDGE_CORRIDORS.map((corridor) => ({
        key: corridor.key,
        a: corridor.a,
        b: corridor.b,
        kind: corridor.kind
      })),
      vegetationTopologyHeld: true,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      terrainOnly: true,
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
    sampleGlobalMap,
    coordinateFromUV,
    latticeAddress,
    elevationField,
    landField,
    getStatus
  });

  window.HEARTH_MATERIALS_RECEIPT = getStatus();
  window.HEARTH_ELEVATION_FIRST_256_NINE_SUMMITS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthMaterialsLoaded = "true";
  document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
  document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
  document.documentElement.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthParentAlignedMaterials = "true";
  document.documentElement.dataset.hearthElevationFirst = "true";
  document.documentElement.dataset.hearthLandFromElevation = "true";
  document.documentElement.dataset.hearthSeaLevel = String(SEA_LEVEL);
  document.documentElement.dataset.hearthNineSummitsGlobalMap = "true";
  document.documentElement.dataset.hearthLattice256 = "true";
  document.documentElement.dataset.hearthCoordinateSystem = "lon-lat-u-v-16x16";
  document.documentElement.dataset.hearthSummitAnchorCount = String(NINE_SUMMITS.length);
  document.documentElement.dataset.hearthPlateDomainCount = String(PLATE_DOMAINS.length);
  document.documentElement.dataset.hearthBridgeCorridorCount = String(BRIDGE_CORRIDORS.length);
  document.documentElement.dataset.hearthIslandKeyCount = String(ISLAND_KEYS.length);
  document.documentElement.dataset.hearthConsumesComposition = String(Boolean(window.HEARTH_COMPOSITION));
  document.documentElement.dataset.hearthConsumesHydrology = String(Boolean(window.HEARTH_HYDROLOGY));
  document.documentElement.dataset.hearthVisibleBlueLineSuppressed = "true";
  document.documentElement.dataset.hearthShelfGlowSoftened = "true";
  document.documentElement.dataset.hearthTerrainInteriorRefined = "true";
  document.documentElement.dataset.hearthCorrectedFailure = "long-strip-landform-from-shape-first-generation";
  document.documentElement.dataset.hearthCorrectionMethod = "elevation-first-sea-level-cut";
  document.documentElement.dataset.hearthNoTrees = "true";
  document.documentElement.dataset.hearthNoBushes = "true";
  document.documentElement.dataset.hearthNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
