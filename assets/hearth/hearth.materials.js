// /assets/hearth/hearth.materials.js
// HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7
// Full-file replacement.
// Materials authority only.
// Consumes HEARTH_COMPOSITION and HEARTH_HYDROLOGY when available.
// Purpose:
// - Renew Hearth landform authority into a coordinate-addressed Nine Summits / 256-state global map.
// - Preserve the active route/canvas consumer API.
// - Replace loose oval landmass reads with summit pressure, bridge corridors, tectonic deformation, basin carving, and lattice modulation.
// - Preserve v6 material refinements: hydrology as wet ground first, softened shelf glow, suppressed blue guide-lines, believable grass/dirt/rock/mountain/mud transitions.
// No trees. No bushes. No forest canopy. No animal/life topology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const RECEIPT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_RECEIPT_v7";
  const PREVIOUS_CONTRACT = "HEARTH_NATURAL_TERRAIN_MATERIAL_REFINEMENT_TNT_v6";
  const VERSION = "2026-05-27.hearth-nine-summits-256-global-map-materials-v7";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const LATTICE_SIZE = 16;

  const BODY_MASSES = Object.freeze([
    { key: "north-crown", lat: 74 * DEG, lon: -22 * DEG, rx: 34 * DEG, ry: 10.5 * DEG, angle: -8 * DEG, seed: 1101, role: "polar-crown-and-glacial-shoulder" },
    { key: "equatorial-great", lat: 0 * DEG, lon: -10 * DEG, rx: 53 * DEG, ry: 22 * DEG, angle: -8 * DEG, seed: 2202, role: "central-spine-and-major-body" },
    { key: "northwest-temperate", lat: 43 * DEG, lon: -106 * DEG, rx: 27 * DEG, ry: 13.5 * DEG, angle: 25 * DEG, seed: 3303, role: "lake-fjord-temperate-body" },
    { key: "northeast-broken-shelf", lat: 33 * DEG, lon: 104 * DEG, rx: 28 * DEG, ry: 12.5 * DEG, angle: -23 * DEG, seed: 4404, role: "marble-plateau-broken-shelf" },
    { key: "southeast-warm", lat: -24 * DEG, lon: 142 * DEG, rx: 31 * DEG, ry: 16 * DEG, angle: 18 * DEG, seed: 5505, role: "archipelago-and-wet-basin-body" },
    { key: "southwest-ridge", lat: -38 * DEG, lon: -123 * DEG, rx: 30 * DEG, ry: 14 * DEG, angle: -29 * DEG, seed: 6606, role: "slate-granite-cliff-wall" },
    { key: "south-transitional", lat: -58 * DEG, lon: 37 * DEG, rx: 32 * DEG, ry: 11.5 * DEG, angle: 9 * DEG, seed: 7707, role: "cold-southern-transition" }
  ]);

  const NINE_SUMMITS = Object.freeze([
    { id: "S01", key: "polar-ice-crown-glacial-field", label: "Polar Ice Crown / Glacial Field", lat: 73 * DEG, lon: -18 * DEG, radius: 18 * DEG, material: "ice", functionText: "polar crown, ice compression, high-latitude survival pressure", seed: 9101 },
    { id: "S02", key: "fjord-mountain-coast", label: "Fjord Mountain Coast", lat: 57 * DEG, lon: -128 * DEG, radius: 15 * DEG, material: "slate", functionText: "cliff coast, fractured ridge, glacial cut, hard boundary", seed: 9102 },
    { id: "S03", key: "great-inland-lake-system", label: "Great Inland Lake System", lat: 44 * DEG, lon: -83 * DEG, radius: 16 * DEG, material: "inland-water", functionText: "inland water memory, basin continuity, lake network", seed: 9103 },
    { id: "S04", key: "marble-plateau", label: "Marble Plateau", lat: 31 * DEG, lon: 103 * DEG, radius: 15 * DEG, material: "marble", functionText: "bright uplift plateau, stable highland, exposed mineral authority", seed: 9104 },
    { id: "S05", key: "diamond-opal-summit-spine", label: "Diamond / Opal Summit Spine", lat: 7 * DEG, lon: -16 * DEG, radius: 17 * DEG, material: "summit-mineral", functionText: "central world spine, highest symbolic summit, structural crown", seed: 9105 },
    { id: "S06", key: "desert-glass-basin", label: "Desert Glass Basin", lat: 11 * DEG, lon: 23 * DEG, radius: 15 * DEG, material: "dry-mineral-basin", functionText: "dry basin, heat pressure, mineral exposure, scarcity field", seed: 9106 },
    { id: "S07", key: "marsh-swamp-basin", label: "Marsh / Swamp Basin", lat: -18 * DEG, lon: 72 * DEG, radius: 16 * DEG, material: "marsh-swamp", functionText: "wetland transition, basin softness, retained water memory", seed: 9107 },
    { id: "S08", key: "slate-granite-cliff-wall", label: "Slate / Granite Cliff Wall", lat: -38 * DEG, lon: -124 * DEG, radius: 16 * DEG, material: "cliff-wall", functionText: "hard western wall, tectonic resistance, cliff boundary", seed: 9108 },
    { id: "S09", key: "archipelago-chain", label: "Archipelago Chain", lat: -7 * DEG, lon: 168 * DEG, radius: 19 * DEG, material: "island-chain", functionText: "island/key chain, oceanic crossing field, broken land bridge", seed: 9109 }
  ]);

  const SUMMIT_BY_ID = NINE_SUMMITS.reduce((acc, summit) => {
    acc[summit.id] = summit;
    return acc;
  }, Object.create(null));

  const BRIDGE_CORRIDORS = Object.freeze([
    { key: "S05-S03", a: "S05", b: "S03", kind: "lake-spine", width: 8.5 * DEG, strength: 0.72, role: "central spine to inland lake system" },
    { key: "S05-S06", a: "S05", b: "S06", kind: "dry-mineral", width: 7.5 * DEG, strength: 0.62, role: "central summit to dry mineral basin" },
    { key: "S05-S07", a: "S05", b: "S07", kind: "wet-basin", width: 8 * DEG, strength: 0.66, role: "central summit to wet basin" },
    { key: "S03-S02", a: "S03", b: "S02", kind: "lake-fjord", width: 7.5 * DEG, strength: 0.74, role: "lake system to fjord mountain coast" },
    { key: "S02-S01", a: "S02", b: "S01", kind: "glacial-ridge", width: 7 * DEG, strength: 0.76, role: "fjord coast to polar crown" },
    { key: "S04-S05", a: "S04", b: "S05", kind: "plateau-spine", width: 8 * DEG, strength: 0.68, role: "marble plateau to summit spine" },
    { key: "S04-S09", a: "S04", b: "S09", kind: "plateau-island", width: 7.2 * DEG, strength: 0.58, role: "plateau to island chain" },
    { key: "S07-S09", a: "S07", b: "S09", kind: "swamp-archipelago", width: 8.2 * DEG, strength: 0.7, role: "swamp basin to archipelago" },
    { key: "S08-S02", a: "S08", b: "S02", kind: "western-cliff", width: 8.8 * DEG, strength: 0.78, role: "western cliff wall to fjord coast" },
    { key: "S08-S05", a: "S08", b: "S05", kind: "granite-spine", width: 7.2 * DEG, strength: 0.64, role: "cliff wall to central summit spine" },
    { key: "S06-S04", a: "S06", b: "S04", kind: "dry-plateau", width: 7 * DEG, strength: 0.6, role: "desert basin to marble plateau" },
    { key: "S06-S07", a: "S06", b: "S07", kind: "dry-wet-transition", width: 7.5 * DEG, strength: 0.66, role: "dry basin to wet basin transition" },
    { key: "S01-S03", a: "S01", b: "S03", kind: "meltwater-memory", width: 7 * DEG, strength: 0.58, role: "polar melt and water memory corridor" },
    { key: "S09-S05", a: "S09", b: "S05", kind: "oceanic-return", width: 7.8 * DEG, strength: 0.62, role: "oceanic return corridor to central spine" }
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
    const rowAddress = String(row + 1).padStart(2, "0");
    const columnAddress = String(column + 1).padStart(2, "0");

    return Object.freeze({
      row,
      column,
      cell,
      rowAddress,
      columnAddress,
      address: `${rowAddress}-${columnAddress}`,
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

  function summitPressure(lon, lat, summit) {
    const d = lonLatDistance(lon, lat, summit.lon, summit.lat);
    const core = 1 - smoothstep(0, summit.radius * 0.38, d);
    const field = 1 - smoothstep(summit.radius * 0.22, summit.radius, d);
    const skirt = 1 - smoothstep(summit.radius * 0.66, summit.radius * 1.72, d);

    return {
      distance: d,
      core: clamp(core, 0, 1),
      field: clamp(field, 0, 1),
      skirt: clamp(skirt, 0, 1),
      pressure: clamp(field * 0.78 + skirt * 0.22, 0, 1)
    };
  }

  function nearestSummit(lon, lat) {
    let best = null;

    for (const summit of NINE_SUMMITS) {
      const pressure = summitPressure(lon, lat, summit);
      if (!best || pressure.pressure > best.pressure) {
        best = {
          ...summit,
          distance: pressure.distance,
          core: pressure.core,
          field: pressure.field,
          skirt: pressure.skirt,
          pressure: pressure.pressure
        };
      }
    }

    return best;
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
    const pA = localProjectedPoint(a.lon, a.lat, referenceLat);
    const pB = localProjectedPoint(b.lon, b.lat, referenceLat);
    const vx = pB.x - pA.x;
    const vy = pB.y - pA.y;
    const wx = p.x - pA.x;
    const wy = p.y - pA.y;
    const lengthSq = vx * vx + vy * vy;
    const t = lengthSq > 0 ? clamp((wx * vx + wy * vy) / lengthSq, 0, 1) : 0;
    const cx = pA.x + vx * t;
    const cy = pA.y + vy * t;
    const dx = p.x - cx;
    const dy = p.y - cy;

    return {
      distance: Math.sqrt(dx * dx + dy * dy),
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
      const pressure = (1 - smoothstep(corridor.width * 0.22, corridor.width, d.distance)) * centerFade * corridor.strength;
      const clean = clamp(pressure, 0, 1);

      if (clean > 0) {
        results.push({ ...corridor, pressure: clean, t: d.t, distance: d.distance });
      }

      if (!strongest || clean > strongest.pressure) {
        strongest = { ...corridor, pressure: clean, t: d.t, distance: d.distance };
      }

      if (corridor.kind.includes("ridge") || corridor.kind.includes("spine") || corridor.kind.includes("cliff") || corridor.kind.includes("plateau")) {
        ridge = Math.max(ridge, clean);
      }

      if (corridor.kind.includes("lake") || corridor.kind.includes("meltwater") || corridor.kind.includes("wet") || corridor.kind.includes("swamp")) {
        wet = Math.max(wet, clean);
        basin = Math.max(basin, clean * 0.82);
      }

      if (corridor.kind.includes("dry")) {
        dry = Math.max(dry, clean);
      }

      if (corridor.kind.includes("island") || corridor.kind.includes("archipelago") || corridor.kind.includes("oceanic")) {
        shelf = Math.max(shelf, clean * 0.78);
        island = Math.max(island, clean);
      }

      if (corridor.kind.includes("fjord") || corridor.kind.includes("cliff") || corridor.kind.includes("granite")) {
        fracture = Math.max(fracture, clean);
      }
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

  function sampleGlobalMap(u, v) {
    const base = coordinateFromUV(u, v);
    const warp = domainWarp(base.u, base.v, 12000, 0.018);
    const coord = coordinateFromUV(warp.u, warp.v);
    const summit = nearestSummit(coord.lon, coord.lat);
    const bridge = bridgePressure(coord.lon, coord.lat);
    const cellNoise = hash(coord.lattice.column + 1, coord.lattice.row + 1, 256007);
    const cellRidge = hash(coord.lattice.column + 17, coord.lattice.row + 31, 256137);
    const cellBasin = hash(coord.lattice.column + 41, coord.lattice.row + 53, 256251);

    return Object.freeze({
      base,
      coord,
      summit,
      bridge,
      lattice: coord.lattice,
      cellNoise,
      cellRidge,
      cellBasin,
      coordinateSystem: "lon-lat-u-v-16x16",
      lattice256: true
    });
  }

  function coastlineChip(u, v, body, e, lat, global) {
    const cosLat = Math.cos(Math.abs(lat));
    const polarDamp = smoothstep(0.06, 0.28, cosLat);
    const shelfNoise = ridged(u + body.seed * 0.0009, v - body.seed * 0.0007, 18000 + body.seed, 5);
    const cutNoise = fbm(u - body.seed * 0.0013, v + body.seed * 0.0017, 21000 + body.seed, 5);
    const latticeCut = (global.cellNoise - 0.5) * 0.038 + (global.cellRidge - 0.5) * 0.026;

    const angular =
      (
        Math.sign(Math.sin(e.theta * (6 + body.seed % 6) + e.nx * 4.9 - e.ny * 4.2)) * 0.032 +
        Math.sin(e.theta * (11 + body.seed % 5) - body.seed * 0.007) * 0.021
      ) * polarDamp;

    const summitCut = global.summit ? global.summit.pressure * 0.018 : 0;
    const bridgeFracture = global.bridge.fracture * 0.042 + global.bridge.wet * 0.02 + global.bridge.shelf * 0.026;

    return angular +
      (shelfNoise - 0.5) * 0.142 +
      latticeCut +
      summitCut +
      bridgeFracture -
      smoothstep(0.52, 0.92, cutNoise) * 0.096 -
      smoothstep(0.62, 0.97, shelfNoise) * 0.03;
  }

  function landField(u, v) {
    const global = sampleGlobalMap(u, v);
    const lon = global.coord.lon;
    const lat = global.coord.lat;

    let best = {
      field: -20,
      body: BODY_MASSES[0],
      island: false,
      islandKey: "",
      theta: 0
    };

    for (const body of BODY_MASSES) {
      const e = ellipseField(lon, lat, body);
      const summitLift = global.summit.pressure * 0.052;
      const ridgeLift = global.bridge.ridge * 0.058;
      const wetCut = global.bridge.wet * smoothstep(0.42, 0.94, fbm(global.coord.u + 0.2, global.coord.v - 0.1, 22700 + body.seed, 4)) * 0.034;
      const dryCut = global.bridge.dry * smoothstep(0.55, 0.96, fbm(global.coord.u - 0.1, global.coord.v + 0.2, 23700 + body.seed, 4)) * 0.024;
      const latticeLift = (global.cellNoise - 0.5) * 0.018;
      const field = 0.938 - e.dist + coastlineChip(global.coord.u, global.coord.v, body, e, lat, global) + summitLift + ridgeLift + latticeLift - wetCut - dryCut;

      if (field > best.field) {
        best = { field, body, island: false, islandKey: "", theta: e.theta };
      }
    }

    for (const island of ISLAND_KEYS) {
      const e = ellipseField(lon, lat, island);
      const islandChainBoost = global.bridge.island * 0.04;
      const summitBoost = global.summit && (global.summit.id === "S09" || island.chain.includes(global.summit.id)) ? global.summit.pressure * 0.035 : 0;
      const chip =
        Math.sin(e.theta * 5.7 + island.seed * 0.13) * 0.04 +
        (ridged(global.coord.u + island.seed * 0.001, global.coord.v - island.seed * 0.001, 41000 + island.seed, 3) - 0.5) * 0.07;
      const field = 0.31 + chip + islandChainBoost + summitBoost - e.dist;

      if (field > best.field) {
        best = { field, body: BODY_MASSES[0], island: true, islandKey: island.key, theta: e.theta };
      }
    }

    const coast = 1 - smoothstep(0.012, 0.115, Math.abs(best.field));
    const shelf = smoothstep(-0.31, 0.012, best.field) * (best.field <= 0 ? 1 : 0);

    return Object.freeze({
      lon,
      lat,
      u: global.coord.u,
      v: global.coord.v,
      field: best.field,
      isLand: best.field > 0,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      body: best.body,
      island: best.island,
      islandKey: best.islandKey,
      global,
      lattice: global.lattice,
      summit: global.summit,
      bridge: global.bridge
    });
  }

  function reliefField(u, v, land) {
    const seed = land.body.seed;
    const global = land.global;
    const w1 = domainWarp(u + seed * 0.00013, v - seed * 0.00011, 51000 + seed, 0.034);
    const w2 = domainWarp(u - seed * 0.00017, v + seed * 0.00009, 52000 + seed, 0.02);

    const ridgeLong = ridged(w1.u * 0.92 + 0.03, w1.v * 1.08 - 0.02, 53000 + seed, 5);
    const ridgeBroken = ridged(w2.u * 1.7 - 0.09, w2.v * 1.35 + 0.07, 54000 + seed, 4);
    const rolling = fbm(u * 1.4 + 0.17, v * 1.2 - 0.11, 55000 + seed, 4);
    const basinNoise = fbm(u * 1.9 - 0.21, v * 1.6 + 0.14, 56000 + seed, 4);

    const summitMountain = global.summit.pressure * (
      global.summit.id === "S05" ||
      global.summit.id === "S02" ||
      global.summit.id === "S04" ||
      global.summit.id === "S08" ? 0.8 : 0.34
    );

    const summitBasin = global.summit.pressure * (
      global.summit.id === "S03" ||
      global.summit.id === "S06" ||
      global.summit.id === "S07" ? 0.72 : 0.12
    );

    const summitIce = global.summit.pressure * (global.summit.id === "S01" ? 0.86 : 0.06);
    const corridorRidge = global.bridge.ridge * 0.56 + global.bridge.fracture * 0.5;
    const corridorBasin = global.bridge.basin * 0.48 + global.bridge.wet * 0.42;

    const mountain = smoothstep(0.6, 0.91, ridgeLong * 0.65 + ridgeBroken * 0.25 + summitMountain * 0.34 + corridorRidge * 0.26 + global.cellRidge * 0.08);
    const foothill = smoothstep(0.47, 0.78, ridgeBroken * 0.58 + rolling * 0.34 + corridorRidge * 0.2);
    const basin = smoothstep(0.18, 0.48, 1 - basinNoise) * smoothstep(0.12, 0.72, land.field) + summitBasin * 0.18 + corridorBasin * 0.18;
    const cliff = land.coast * smoothstep(0.52, 0.88, ridgeLong + ridgeBroken * 0.16 + global.bridge.fracture * 0.3);
    const fjordCut = land.coast * smoothstep(0.62, 0.94, ridgeBroken + global.bridge.fracture * 0.34) * smoothstep(0.34, 0.86, mountain + foothill);
    const glacialBridge = global.bridge.strongest && global.bridge.strongest.kind === "glacial-ridge"
      ? global.bridge.strongest.pressure * 0.18
      : 0;
    const glacial = clamp(summitIce + glacialBridge, 0, 1);

    return Object.freeze({
      ridgeLong,
      ridgeBroken,
      rolling,
      basin: clamp(basin, 0, 1),
      mountain: clamp(mountain, 0, 1),
      foothill: clamp(foothill, 0, 1),
      cliff: clamp(cliff, 0, 1),
      fjordCut: clamp(fjordCut, 0, 1),
      glacial,
      corridorRidge: clamp(corridorRidge, 0, 1),
      corridorBasin: clamp(corridorBasin, 0, 1),
      elevation: clamp(mountain * 0.74 + foothill * 0.27 + rolling * 0.08 + summitMountain * 0.11 + corridorRidge * 0.08 - basin * 0.08, 0, 1)
    });
  }

  function fallbackHydrology(land, relief) {
    return Object.freeze({
      inlandWater: clamp(
        (land.summit.id === "S03" ? land.summit.pressure * 0.58 : 0) +
        (land.summit.id === "S07" ? land.summit.pressure * 0.18 : 0) +
        relief.basin * land.bridge.wet * 0.16,
        0,
        1
      ),
      lakeType: land.summit.id === "S03" ? "great-lake" : land.summit.id === "S07" ? "marsh-lake" : "",
      lakeKey: land.summit.id === "S03" ? "great-inland-lake-system" : "",
      lakeShore: clamp(land.summit.id === "S03" ? land.summit.skirt : 0, 0, 1),
      river: 0,
      stream: 0,
      brook: 0,
      channelCorridor: clamp(land.bridge.wet * 0.3 + relief.basin * 0.12, 0, 1),
      erosionCorridor: clamp(land.bridge.fracture * 0.2 + relief.fjordCut * 0.16, 0, 1),
      marsh: clamp(relief.basin * 0.2 + (land.summit.id === "S07" ? land.summit.pressure * 0.42 : 0), 0, 1),
      swamp: clamp(relief.basin * 0.1 + (land.summit.id === "S07" ? land.summit.pressure * 0.3 : 0), 0, 1),
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
        isLand: land.isLand,
        coast: land.coast,
        basin: relief.basin,
        mountain: relief.mountain,
        summit: land.summit,
        bridge: land.bridge,
        lattice: land.lattice,
        coordinateSystem: "lon-lat-u-v-16x16"
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
        lattice256: true
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
    if (summit.id === "S02") next = mix(next, C.slate, summit.pressure * relief.cliff * 0.3);
    if (summit.id === "S03") next = mix(next, C.silt, summit.pressure * hydro.wetGround * 0.18);
    if (summit.id === "S04") next = mix(next, C.marble, summit.pressure * (relief.foothill + relief.mountain) * 0.2);
    if (summit.id === "S05") {
      next = mix(next, C.diamond, summit.core * relief.mountain * 0.12);
      next = mix(next, C.opal, summit.pressure * relief.foothill * 0.1);
    }
    if (summit.id === "S06") next = mix(next, C.sand, summit.pressure * 0.18);
    if (summit.id === "S07") next = mix(next, C.marshGrass, summit.pressure * hydro.wetGround * 0.26);
    if (summit.id === "S08") next = mix(next, C.granite, summit.pressure * relief.mountain * 0.28);
    if (summit.id === "S09") next = mix(next, C.sand, summit.pressure * 0.1);

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
        hydro.wetGround * 0.4 +
        relief.basin * 0.12 +
        land.bridge.wet * 0.18 +
        (land.island ? 0.05 : 0) -
        relief.mountain * 0.1 -
        temperature * 0.06 -
        land.bridge.dry * 0.18 -
        (summit.id === "S06" ? summit.pressure * 0.16 : 0),
      0,
      1
    );

    const dry = clamp((1 - moisture) * 0.72 + temperature * 0.3 - land.coast * 0.1 + land.bridge.dry * 0.14, 0, 1);
    const snow = smoothstep(0.65, 0.96, latitudeCold + relief.mountain * 0.24 + relief.glacial * 0.28 - temperature * 0.11);

    let color = C.grass;

    color = mix(color, C.darkGrass, smoothstep(0.58, 0.9, moisture) * 0.32);
    color = mix(color, C.wetGrass, hydro.wetGround * 0.3);
    color = mix(color, C.marshGrass, hydro.marsh * 0.5);
    color = mix(color, C.swampMat, hydro.swamp * 0.58);
    color = mix(color, C.mud, hydro.wetGround * relief.basin * 0.44);
    color = mix(color, C.peat, hydro.swamp * 0.24);

    color = mix(color, C.dryGrass, smoothstep(0.42, 0.8, dry) * 0.42);
    color = mix(color, C.dirt, smoothstep(0.56, 0.91, dry) * 0.28);
    color = mix(color, C.clay, smoothstep(0.68, 0.95, dry) * 0.15);
    color = mix(color, C.sand, land.coast * 0.105 + land.bridge.shelf * 0.035);

    color = mix(color, C.rock, relief.foothill * 0.2);
    color = mix(color, C.mountainStone, relief.mountain * 0.38);
    color = mix(color, C.granite, relief.mountain * 0.2);
    color = mix(color, C.cliffShadow, relief.cliff * 0.28);
    color = mix(color, C.slate, relief.fjordCut * 0.18 + land.bridge.fracture * 0.12);

    color = mix(color, C.mud, hydro.channelCorridor * 0.16);
    color = mix(color, C.wetGrass, hydro.channelCorridor * 0.11);
    color = mix(color, C.cliffShadow, hydro.erosionCorridor * 0.08);

    color = tintBySummit(color, summit, relief, hydro);

    color = mix(color, C.ice, snow * 0.4);
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
    if (hydro.inlandWater > 0.52) {
      let inland = mix(C.ocean, C.shelf, 0.28);

      if (hydro.lakeType === "great-lake") inland = mix(C.ocean, C.shelf, 0.28);
      if (hydro.lakeType === "inland-lake") inland = mix(C.deepOcean, C.ocean, 0.48);
      if (hydro.lakeType === "marsh-lake") inland = mix(C.shelf, C.swampMat, 0.14);
      if (hydro.lakeType === "glacial-lake") inland = mix(C.ice, C.ocean, 0.34);

      return mix(inland, C.coastFoam, hydro.lakeShore * 0.045);
    }

    let water = mix(C.abyss, C.deepOcean, fbm(u * 1.25 + 0.05, v * 1.15 - 0.04, 91000, 4));
    water = mix(water, C.ocean, smoothstep(0.1, 0.84, fbm(u * 2.1 - 0.17, v * 1.7 + 0.09, 92000, 4)) * 0.2);
    water = mix(water, C.shelf, land.shelf * 0.28 + land.bridge.shelf * land.shelf * 0.06);
    water = mix(water, C.shallow, land.shelf * land.coast * 0.09);
    water = mix(water, C.coastFoam, land.shelf * land.coast * 0.026);

    return shade(water, (noise(u, v, 120, 93000) - 0.5) * 2.4);
  }

  function sampleMaterial(u, v) {
    const land = landField(u, v);
    const relief = reliefField(u, v, land);
    const hydro = sampleHydrology(u, v, land, relief);
    const summit = nearestSummit(land.lon, land.lat);
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
    canvas.dataset.hearthConsumesComposition = String(Boolean(window.HEARTH_COMPOSITION));
    canvas.dataset.hearthConsumesHydrology = String(Boolean(window.HEARTH_HYDROLOGY));
    canvas.dataset.hearthParentAligned = "true";
    canvas.dataset.hearthNineSummitsGlobalMap = "true";
    canvas.dataset.hearthLattice256 = "true";
    canvas.dataset.hearthCoordinateSystem = "lon-lat-u-v-16x16";
    canvas.dataset.hearthSummitAnchorCount = "9";
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthBridgeCorridorCount = "14";
    canvas.dataset.hearthIslandKeyCount = "9";
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
      authority: "terrain-materials-nine-summits-256-global-map",
      consumesComposition: Boolean(window.HEARTH_COMPOSITION),
      consumesHydrology: Boolean(window.HEARTH_HYDROLOGY),
      parentAligned: true,
      nineSummitsGlobalMap: true,
      lattice256: true,
      coordinateSystem: "lon-lat-u-v-16x16",
      summitAnchorCount: NINE_SUMMITS.length,
      bodyMassCount: BODY_MASSES.length,
      bridgeCorridorCount: BRIDGE_CORRIDORS.length,
      islandKeyCount: ISLAND_KEYS.length,
      targetLandRatio: 0.3,
      earthReferenceLandRatio: 0.29,
      hydrologyRenderedAsWetGroundFirst: true,
      visibleBlueLineSuppressed: true,
      shelfGlowSoftened: true,
      terrainInteriorRefined: true,
      summitAnchors: NINE_SUMMITS.map((summit) => ({
        id: summit.id,
        key: summit.key,
        label: summit.label,
        latDeg: Math.round(summit.lat * RAD * 1000) / 1000,
        lonDeg: Math.round(summit.lon * RAD * 1000) / 1000,
        material: summit.material
      })),
      bridgeCorridors: BRIDGE_CORRIDORS.map((corridor) => ({
        key: corridor.key,
        a: corridor.a,
        b: corridor.b,
        kind: corridor.kind,
        role: corridor.role
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
    getStatus
  });

  window.HEARTH_MATERIALS_RECEIPT = getStatus();
  window.HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_RECEIPT = getStatus();

  document.documentElement.dataset.hearthMaterialsLoaded = "true";
  document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
  document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
  document.documentElement.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthParentAlignedMaterials = "true";
  document.documentElement.dataset.hearthNineSummitsGlobalMap = "true";
  document.documentElement.dataset.hearthLattice256 = "true";
  document.documentElement.dataset.hearthCoordinateSystem = "lon-lat-u-v-16x16";
  document.documentElement.dataset.hearthSummitAnchorCount = String(NINE_SUMMITS.length);
  document.documentElement.dataset.hearthBodyMassCount = String(BODY_MASSES.length);
  document.documentElement.dataset.hearthBridgeCorridorCount = String(BRIDGE_CORRIDORS.length);
  document.documentElement.dataset.hearthIslandKeyCount = String(ISLAND_KEYS.length);
  document.documentElement.dataset.hearthConsumesComposition = String(Boolean(window.HEARTH_COMPOSITION));
  document.documentElement.dataset.hearthConsumesHydrology = String(Boolean(window.HEARTH_HYDROLOGY));
  document.documentElement.dataset.hearthVisibleBlueLineSuppressed = "true";
  document.documentElement.dataset.hearthShelfGlowSoftened = "true";
  document.documentElement.dataset.hearthTerrainInteriorRefined = "true";
  document.documentElement.dataset.hearthNoTrees = "true";
  document.documentElement.dataset.hearthNoBushes = "true";
  document.documentElement.dataset.hearthNoForestCanopy = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
