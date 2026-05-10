// /assets/hearth/hearth.assets.js
// HEARTH_ASYMMETRIC_LANDMASS_NATURALIZATION_ASSETS_TNT_v4
// Full-file replacement.
// Assets authority only.
// Purpose:
// - Break excessive symmetry in Hearth landmass formation.
// - Preserve seven body masses.
// - Convert oval/patch read into pressure-shaped landmasses.
// - Give each mass a different deformation engine.
// - Preserve runtime, controls, canvas, and route separation.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ASYMMETRIC_LANDMASS_NATURALIZATION_ASSETS_TNT_v4";
  const RECEIPT = "HEARTH_ASYMMETRIC_LANDMASS_NATURALIZATION_ASSETS_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_ASSETS_TNT_v3";
  const BLUEPRINT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_v1";
  const VERSION = "2026-05-10.hearth-asymmetric-landmass-naturalization-v4";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_MASSES = Object.freeze([
    {
      id: 1,
      key: "north-crown-mass",
      name: "North Crown Mass",
      profile: "fractured-polar-crown",
      lat: 78 * DEG,
      lon: -20 * DEG,
      landWeight: 0.11,
      palette: "polar-slate-ice",
      ice: 0.88,
      wet: 0.24,
      shelf: 0.48,
      mountain: 0.74,
      cliff: 0.58,
      basin: 0.10,
      beach: 0.06,
      mineral: 0.36,
      ridgeBias: 0.76,
      bayBias: 0.84,
      asymmetry: 0.96,
      lobes: [
        { lat: 80 * DEG, lon: -52 * DEG, rx: 32 * DEG, ry: 10 * DEG, angle: -18 * DEG, power: 1.00 },
        { lat: 82 * DEG, lon: -4 * DEG, rx: 26 * DEG, ry: 9 * DEG, angle: 9 * DEG, power: 0.92 },
        { lat: 74 * DEG, lon: 34 * DEG, rx: 30 * DEG, ry: 10 * DEG, angle: 24 * DEG, power: 0.78 },
        { lat: 69 * DEG, lon: -25 * DEG, rx: 42 * DEG, ry: 8 * DEG, angle: -4 * DEG, power: 0.52 }
      ],
      cuts: [
        { lat: 72 * DEG, lon: -5 * DEG, rx: 18 * DEG, ry: 7 * DEG, angle: 14 * DEG, power: 0.44 },
        { lat: 70 * DEG, lon: 54 * DEG, rx: 24 * DEG, ry: 7 * DEG, angle: -20 * DEG, power: 0.36 },
        { lat: 73 * DEG, lon: -74 * DEG, rx: 18 * DEG, ry: 6 * DEG, angle: 30 * DEG, power: 0.34 }
      ]
    },
    {
      id: 2,
      key: "equatorial-great-mass",
      name: "Equatorial Great Mass",
      profile: "rifted-equatorial-continent",
      lat: 1 * DEG,
      lon: -6 * DEG,
      landWeight: 0.34,
      palette: "habitable-upland-basin",
      ice: 0.03,
      wet: 0.66,
      shelf: 0.72,
      mountain: 0.60,
      cliff: 0.38,
      basin: 0.78,
      beach: 0.68,
      mineral: 0.70,
      ridgeBias: 0.58,
      bayBias: 0.62,
      asymmetry: 0.86,
      lobes: [
        { lat: 8 * DEG, lon: -46 * DEG, rx: 30 * DEG, ry: 24 * DEG, angle: -22 * DEG, power: 1.00 },
        { lat: -5 * DEG, lon: -12 * DEG, rx: 38 * DEG, ry: 22 * DEG, angle: 5 * DEG, power: 0.96 },
        { lat: 13 * DEG, lon: 32 * DEG, rx: 28 * DEG, ry: 18 * DEG, angle: -18 * DEG, power: 0.74 },
        { lat: -16 * DEG, lon: 48 * DEG, rx: 24 * DEG, ry: 15 * DEG, angle: 34 * DEG, power: 0.54 },
        { lat: 19 * DEG, lon: 68 * DEG, rx: 15 * DEG, ry: 10 * DEG, angle: -12 * DEG, power: 0.34 }
      ],
      cuts: [
        { lat: 4 * DEG, lon: 7 * DEG, rx: 13 * DEG, ry: 24 * DEG, angle: -26 * DEG, power: 0.31 },
        { lat: -22 * DEG, lon: 20 * DEG, rx: 18 * DEG, ry: 9 * DEG, angle: 20 * DEG, power: 0.24 },
        { lat: 24 * DEG, lon: 51 * DEG, rx: 12 * DEG, ry: 9 * DEG, angle: -40 * DEG, power: 0.26 }
      ]
    },
    {
      id: 3,
      key: "northwest-temperate-mass",
      name: "Northwest Temperate Mass",
      profile: "diagonal-temperate-highland-plate",
      lat: 44 * DEG,
      lon: -104 * DEG,
      landWeight: 0.10,
      palette: "temperate-stone-green",
      ice: 0.16,
      wet: 0.54,
      shelf: 0.42,
      mountain: 0.58,
      cliff: 0.38,
      basin: 0.46,
      beach: 0.24,
      mineral: 0.50,
      ridgeBias: 0.70,
      bayBias: 0.28,
      asymmetry: 0.62,
      lobes: [
        { lat: 51 * DEG, lon: -124 * DEG, rx: 18 * DEG, ry: 13 * DEG, angle: 35 * DEG, power: 0.82 },
        { lat: 41 * DEG, lon: -103 * DEG, rx: 25 * DEG, ry: 15 * DEG, angle: 28 * DEG, power: 1.00 },
        { lat: 32 * DEG, lon: -82 * DEG, rx: 17 * DEG, ry: 10 * DEG, angle: 19 * DEG, power: 0.52 }
      ],
      cuts: [
        { lat: 35 * DEG, lon: -68 * DEG, rx: 10 * DEG, ry: 18 * DEG, angle: 4 * DEG, power: 0.28 },
        { lat: 56 * DEG, lon: -94 * DEG, rx: 12 * DEG, ry: 7 * DEG, angle: -22 * DEG, power: 0.22 }
      ]
    },
    {
      id: 4,
      key: "northeast-broken-shelf-mass",
      name: "Northeast Broken Shelf Mass",
      profile: "fractured-shelf-archipelago",
      lat: 34 * DEG,
      lon: 104 * DEG,
      landWeight: 0.09,
      palette: "turquoise-shelf-bays",
      ice: 0.05,
      wet: 0.76,
      shelf: 0.92,
      mountain: 0.30,
      cliff: 0.22,
      basin: 0.22,
      beach: 0.72,
      mineral: 0.40,
      ridgeBias: 0.26,
      bayBias: 0.98,
      asymmetry: 1.00,
      lobes: [
        { lat: 38 * DEG, lon: 88 * DEG, rx: 17 * DEG, ry: 11 * DEG, angle: -34 * DEG, power: 0.72 },
        { lat: 31 * DEG, lon: 110 * DEG, rx: 18 * DEG, ry: 10 * DEG, angle: -18 * DEG, power: 0.88 },
        { lat: 42 * DEG, lon: 128 * DEG, rx: 12 * DEG, ry: 8 * DEG, angle: 26 * DEG, power: 0.46 },
        { lat: 24 * DEG, lon: 136 * DEG, rx: 11 * DEG, ry: 7 * DEG, angle: -6 * DEG, power: 0.36 },
        { lat: 29 * DEG, lon: 75 * DEG, rx: 10 * DEG, ry: 6 * DEG, angle: 12 * DEG, power: 0.30 }
      ],
      cuts: [
        { lat: 35 * DEG, lon: 101 * DEG, rx: 11 * DEG, ry: 7 * DEG, angle: 13 * DEG, power: 0.42 },
        { lat: 27 * DEG, lon: 121 * DEG, rx: 12 * DEG, ry: 6 * DEG, angle: -28 * DEG, power: 0.36 },
        { lat: 45 * DEG, lon: 112 * DEG, rx: 9 * DEG, ry: 5 * DEG, angle: 12 * DEG, power: 0.25 }
      ]
    },
    {
      id: 5,
      key: "southeast-warm-mass",
      name: "Southeast Warm Mass",
      profile: "warm-crescent-shelf-continent",
      lat: -24 * DEG,
      lon: 142 * DEG,
      landWeight: 0.13,
      palette: "warm-beach-lowland",
      ice: 0.00,
      wet: 0.80,
      shelf: 0.84,
      mountain: 0.34,
      cliff: 0.28,
      basin: 0.42,
      beach: 0.90,
      mineral: 0.46,
      ridgeBias: 0.32,
      bayBias: 0.74,
      asymmetry: 0.88,
      lobes: [
        { lat: -17 * DEG, lon: 124 * DEG, rx: 19 * DEG, ry: 14 * DEG, angle: 34 * DEG, power: 0.74 },
        { lat: -27 * DEG, lon: 148 * DEG, rx: 30 * DEG, ry: 16 * DEG, angle: 20 * DEG, power: 1.00 },
        { lat: -37 * DEG, lon: 170 * DEG, rx: 16 * DEG, ry: 10 * DEG, angle: -12 * DEG, power: 0.46 },
        { lat: -8 * DEG, lon: 165 * DEG, rx: 11 * DEG, ry: 7 * DEG, angle: 36 * DEG, power: 0.24 }
      ],
      cuts: [
        { lat: -20 * DEG, lon: 139 * DEG, rx: 13 * DEG, ry: 20 * DEG, angle: 38 * DEG, power: 0.28 },
        { lat: -42 * DEG, lon: 130 * DEG, rx: 12 * DEG, ry: 8 * DEG, angle: -16 * DEG, power: 0.22 }
      ]
    },
    {
      id: 6,
      key: "southwest-ridge-mass",
      name: "Southwest Ridge Mass",
      profile: "dark-tectonic-ridge-scar",
      lat: -38 * DEG,
      lon: -122 * DEG,
      landWeight: 0.14,
      palette: "dark-ridge-mineral",
      ice: 0.10,
      wet: 0.36,
      shelf: 0.24,
      mountain: 0.86,
      cliff: 0.90,
      basin: 0.16,
      beach: 0.12,
      mineral: 0.84,
      ridgeBias: 1.00,
      bayBias: 0.28,
      asymmetry: 0.82,
      lobes: [
        { lat: -25 * DEG, lon: -136 * DEG, rx: 15 * DEG, ry: 12 * DEG, angle: -45 * DEG, power: 0.54 },
        { lat: -38 * DEG, lon: -119 * DEG, rx: 31 * DEG, ry: 12 * DEG, angle: -29 * DEG, power: 1.00 },
        { lat: -52 * DEG, lon: -101 * DEG, rx: 20 * DEG, ry: 10 * DEG, angle: -19 * DEG, power: 0.58 },
        { lat: -44 * DEG, lon: -154 * DEG, rx: 13 * DEG, ry: 8 * DEG, angle: 6 * DEG, power: 0.34 }
      ],
      cuts: [
        { lat: -31 * DEG, lon: -112 * DEG, rx: 10 * DEG, ry: 20 * DEG, angle: -35 * DEG, power: 0.24 },
        { lat: -53 * DEG, lon: -134 * DEG, rx: 11 * DEG, ry: 7 * DEG, angle: 30 * DEG, power: 0.20 }
      ]
    },
    {
      id: 7,
      key: "south-transitional-mass",
      name: "South Transitional Mass",
      profile: "cold-storm-shelf-counterweight",
      lat: -59 * DEG,
      lon: 36 * DEG,
      landWeight: 0.09,
      palette: "cold-storm-shelf",
      ice: 0.56,
      wet: 0.34,
      shelf: 0.54,
      mountain: 0.46,
      cliff: 0.48,
      basin: 0.18,
      beach: 0.26,
      mineral: 0.44,
      ridgeBias: 0.48,
      bayBias: 0.62,
      asymmetry: 0.76,
      lobes: [
        { lat: -52 * DEG, lon: 14 * DEG, rx: 18 * DEG, ry: 9 * DEG, angle: 18 * DEG, power: 0.56 },
        { lat: -61 * DEG, lon: 42 * DEG, rx: 30 * DEG, ry: 11 * DEG, angle: 9 * DEG, power: 1.00 },
        { lat: -67 * DEG, lon: 72 * DEG, rx: 13 * DEG, ry: 7 * DEG, angle: -18 * DEG, power: 0.34 }
      ],
      cuts: [
        { lat: -58 * DEG, lon: 30 * DEG, rx: 13 * DEG, ry: 6 * DEG, angle: 8 * DEG, power: 0.26 },
        { lat: -70 * DEG, lon: 50 * DEG, rx: 18 * DEG, ry: 5 * DEG, angle: -10 * DEG, power: 0.20 }
      ]
    }
  ]);

  const MATERIAL = Object.freeze({
    abyss: [2, 12, 30],
    deepOcean: [3, 20, 50],
    ocean: [6, 58, 104],
    oceanBlue: [9, 76, 124],
    shelf: [27, 128, 148],
    shelfSoft: [58, 154, 158],
    foam: [116, 176, 166],
    wetBeach: [174, 158, 106],
    beach: [202, 180, 116],
    dryBeach: [170, 146, 92],
    lowland: [92, 130, 76],
    greenLowland: [78, 132, 82],
    temperate: [78, 120, 72],
    warmLowland: [126, 126, 72],
    upland: [100, 112, 78],
    ridge: [86, 88, 84],
    cliff: [58, 66, 76],
    granite: [118, 112, 102],
    slate: [48, 62, 76],
    marble: [176, 170, 154],
    ice: [204, 224, 226],
    polarStone: [126, 140, 144],
    copper: [156, 88, 58],
    gold: [208, 164, 66],
    opal: [154, 190, 186],
    darkMineral: [54, 52, 58],
    stormShelf: [88, 104, 112]
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

  function fbm(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.52;
    let scale = 4;

    for (let i = 0; i < 6; i += 1) {
      total += noise(u, v, scale, seed + i * 101) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 6;

    for (let i = 0; i < 6; i += 1) {
      const n = noise(u, v, scale, seed + i * 73);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function lonLat(u, v) {
    return {
      lon: (u - 0.5) * TAU,
      lat: (0.5 - v) * Math.PI
    };
  }

  function lobeValue(lon, lat, lobe) {
    const dx = wrapPi(lon - lobe.lon) * Math.cos(lobe.lat);
    const dy = lat - lobe.lat;
    const ca = Math.cos(lobe.angle);
    const sa = Math.sin(lobe.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / lobe.rx;
    const ny = y / lobe.ry;
    const dist = Math.sqrt(nx * nx + ny * ny);
    return {
      value: lobe.power * (1 - dist),
      dist,
      nx,
      ny,
      theta: Math.atan2(ny, nx)
    };
  }

  function massRead(lon, lat, mass, u, v) {
    const lobeReads = mass.lobes.map((lobe) => lobeValue(lon, lat, lobe));
    const cutReads = mass.cuts.map((cut) => lobeValue(lon, lat, cut));
    const main = lobeReads.reduce((best, current) => (current.value > best.value ? current : best), lobeReads[0]);

    let field = -1.0;

    for (const read of lobeReads) {
      field = Math.max(field, read.value);
      field += smoothstep(-0.42, 0.48, read.value) * 0.085;
    }

    for (const cut of cutReads) {
      field -= smoothstep(-0.28, 0.58, cut.value) * cut.value * 0.55;
    }

    const coastlineNoise = (fbm(u + mass.id * 0.071, v - mass.id * 0.037, 1100 + mass.id * 31) - 0.5) * (0.12 + mass.asymmetry * 0.18);
    const biteNoise = noise(u + mass.id * 0.211, v - mass.id * 0.191, 54, 4800 + mass.id * 91);
    const ridgeNoise = (ridged(u + mass.id * 0.043, v + mass.id * 0.029, 2100 + mass.id * 41) - 0.5) * (0.04 + mass.ridgeBias * 0.07);
    const bayBite = smoothstep(0.58, 0.94, biteNoise) * mass.bayBias * 0.12;
    const tectonicPull = Math.sin(main.theta * (1.7 + mass.id * 0.23) + main.nx * 2.4 - main.ny * 1.8) * 0.045 * mass.asymmetry;

    field += coastlineNoise + ridgeNoise + tectonicPull;
    field -= bayBite * smoothstep(-0.10, 0.22, field);

    if (mass.key === "north-crown-mass") {
      const fracture = Math.sin(main.theta * 3.0 + main.dist * 5.6) * 0.11;
      const glacierMouths = smoothstep(0.60, 0.95, noise(u + 0.18, v - 0.23, 46, 9118)) * 0.13;
      field += fracture;
      field -= glacierMouths * smoothstep(-0.08, 0.26, field);
    }

    if (mass.key === "equatorial-great-mass") {
      const rift = Math.exp(-Math.pow(main.nx * 1.3 + main.ny * 0.52, 2) / 0.045) * 0.16;
      const westernShoulder = smoothstep(-1.15, -0.05, main.nx) * 0.10;
      const tornEast = Math.sin(main.theta * 4.5 + main.dist * 3.2) * smoothstep(0.08, 0.95, main.nx) * 0.08;
      field += westernShoulder + tornEast - rift;
    }

    if (mass.key === "northeast-broken-shelf-mass") {
      const archipelagoSplit = smoothstep(0.48, 0.88, noise(u + 0.31, v + 0.17, 34, 4488));
      const shallowCuts = smoothstep(0.52, 0.92, noise(u - 0.11, v + 0.27, 61, 7781));
      field -= archipelagoSplit * 0.16;
      field -= shallowCuts * 0.10 * smoothstep(-0.12, 0.25, field);
    }

    if (mass.key === "southwest-ridge-mass") {
      const tectonicScar = Math.exp(-Math.pow(main.ny + main.nx * 0.42, 2) / 0.032) * 0.15;
      const hardCut = smoothstep(0.56, 0.90, noise(u - 0.29, v + 0.09, 42, 8862)) * 0.08;
      field += tectonicScar;
      field -= hardCut * smoothstep(-0.06, 0.22, field);
    }

    const coast = smoothstep(0, 0.86, 1 - clamp(Math.abs(field) * 17, 0, 1));

    return {
      mass,
      field,
      dist: main.dist,
      theta: main.theta,
      nx: main.nx,
      ny: main.ny,
      landMask: smoothstep(-0.045, 0.13, field),
      coast
    };
  }

  function classify(u, v) {
    const p = lonLat(u, v);
    const reads = BODY_MASSES.map((m) => massRead(p.lon, p.lat, m, u, v)).sort((a, b) => b.field - a.field);
    const primary = reads[0];
    const secondary = reads[1];
    const field = primary.field;
    const isLand = field > 0;

    const shelfBase = smoothstep(-0.26, 0.03, field);
    const shelfTexture = smoothstep(0.16, 0.90, ridged(u * 1.7 + 0.05, v * 1.35 - 0.03, 7011));
    const shelf = isLand ? 0 : clamp(shelfBase * primary.coast * (0.30 + primary.mass.shelf * 0.70) * (0.48 + shelfTexture * 0.38), 0, 1);
    const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.82, 0, 1);

    const latitudeCold = smoothstep(46 * DEG, 84 * DEG, Math.abs(p.lat));
    const polarCold = clamp(latitudeCold * 0.55 + primary.mass.ice * primary.landMask * 0.75, 0, 1);

    const ridgeLine = Math.exp(-Math.pow(primary.ny + primary.nx * 0.34, 2) / 0.058);
    const ridgeNoise = smoothstep(0.34, 0.94, ridged(u * 2.2 + primary.mass.id * 0.05, v * 2.1 - primary.mass.id * 0.04, 8060 + primary.mass.id * 23));
    const fractureNoise = smoothstep(0.54, 0.94, noise(u + primary.mass.id * 0.19, v - primary.mass.id * 0.21, 72, 9922));

    const mountains = isLand
      ? clamp((primary.mass.mountain * ridgeLine * 0.45 + ridgeNoise * primary.mass.mountain * 0.40 + fractureNoise * primary.mass.ridgeBias * 0.24) * primary.landMask, 0, 1)
      : 0;

    const basin =
      isLand && primary.mass.basin > 0
        ? clamp((1 - mountains) * smoothstep(0.10, 0.64, field) * (1 - ridgeNoise) * primary.mass.basin, 0, 1)
        : 0;

    const cliffs = isLand
      ? clamp(primary.coast * ridgeNoise * (0.16 + primary.mass.cliff * 0.84), 0, 1)
      : 0;

    const beach = clamp(primary.coast * (isLand ? 0.82 : shelf * 0.55) * (0.18 + primary.mass.beach * 0.82), 0, 1);

    const bay = clamp(
      primary.coast *
        primary.mass.bayBias *
        smoothstep(0.30, 0.92, noise(u + primary.mass.id * 0.31, v - primary.mass.id * 0.23, 48, 5221)),
      0,
      1
    );

    const mineralNoise = smoothstep(0.78, 0.99, noise(u + primary.mass.id * 0.11, v - primary.mass.id * 0.08, 86, 9111));
    const mineral = isLand ? clamp(mineralNoise * primary.mass.mineral * (0.24 + mountains * 0.76), 0, 1) : 0;

    const secondaryPressure = secondary ? smoothstep(-0.05, 0.12, secondary.field) * 0.08 : 0;
    const bodySeparation = clamp(primary.landMask - secondaryPressure, 0, 1);

    return {
      u,
      v,
      lon: p.lon,
      lat: p.lat,
      field,
      isLand,
      primaryMassId: primary.mass.id,
      primaryMassKey: primary.mass.key,
      primaryMassName: primary.mass.name,
      primaryProfile: primary.mass.profile,
      secondaryMassId: secondary ? secondary.mass.id : 0,
      coast: primary.coast,
      shelf,
      shelfTexture,
      deepOcean,
      polarCold,
      mountains,
      basin,
      cliffs,
      beach,
      bay,
      mineral,
      bodySeparation,
      ridgeNoise,
      fractureNoise,
      noise: fbm(u + 0.013, v - 0.071, 333),
      elevation: isLand ? clamp(0.18 + field * 0.56 + mountains * 0.55 - basin * 0.20, 0, 1) : 0
    };
  }

  function paletteBase(t) {
    switch (t.primaryMassKey) {
      case "north-crown-mass":
        return mix(MATERIAL.slate, MATERIAL.polarStone, 0.52);
      case "equatorial-great-mass":
        return mix(MATERIAL.lowland, MATERIAL.upland, 0.34);
      case "northwest-temperate-mass":
        return mix(MATERIAL.temperate, MATERIAL.granite, 0.24);
      case "northeast-broken-shelf-mass":
        return mix(MATERIAL.greenLowland, MATERIAL.beach, 0.26);
      case "southeast-warm-mass":
        return mix(MATERIAL.warmLowland, MATERIAL.beach, 0.28);
      case "southwest-ridge-mass":
        return mix(MATERIAL.darkMineral, MATERIAL.ridge, 0.34);
      case "south-transitional-mass":
        return mix(MATERIAL.stormShelf, MATERIAL.polarStone, 0.30);
      default:
        return MATERIAL.lowland;
    }
  }

  function sample(u, v) {
    const t = classify(u, v);

    if (!t.isLand) {
      let color = mix(MATERIAL.abyss, MATERIAL.deepOcean, clamp(0.20 + t.noise * 0.46, 0, 1));
      color = mix(color, MATERIAL.ocean, smoothstep(0.18, 0.76, 1 - t.deepOcean) * 0.42);
      color = mix(color, MATERIAL.oceanBlue, t.shelfTexture * 0.12);
      color = mix(color, MATERIAL.shelf, t.shelf * 0.62);
      color = mix(color, MATERIAL.shelfSoft, t.shelf * t.coast * 0.26);
      color = mix(color, MATERIAL.foam, t.shelf * t.coast * 0.10);
      color = lift(color, -9 * t.deepOcean + (t.noise - 0.5) * 4);

      return { color, terrain: t };
    }

    let color = paletteBase(t);

    color = mix(color, MATERIAL.lowland, clamp(t.bodySeparation * 0.25 + t.noise * 0.10, 0, 1));
    color = mix(color, MATERIAL.upland, t.elevation * 0.30);
    color = mix(color, MATERIAL.ridge, t.mountains * 0.38);
    color = mix(color, MATERIAL.slate, t.mountains * t.ridgeNoise * 0.30);
    color = mix(color, MATERIAL.granite, t.mountains * smoothstep(0.56, 0.96, t.ridgeNoise) * 0.34);
    color = mix(color, MATERIAL.cliff, t.cliffs * 0.58);
    color = mix(color, MATERIAL.wetBeach, t.beach * 0.36);
    color = mix(color, MATERIAL.beach, t.beach * 0.30);
    color = mix(color, MATERIAL.dryBeach, t.beach * t.ridgeNoise * 0.10);
    color = mix(color, MATERIAL.shelfSoft, t.bay * 0.10);
    color = mix(color, MATERIAL.polarStone, t.polarCold * 0.28);
    color = mix(color, MATERIAL.ice, t.polarCold * 0.50);

    color = mix(color, MATERIAL.copper, t.mineral * smoothstep(0.34, 0.72, t.ridgeNoise) * 0.12);
    color = mix(color, MATERIAL.gold, t.mineral * smoothstep(0.76, 0.98, t.ridgeNoise) * 0.16);
    color = mix(color, MATERIAL.opal, t.mineral * smoothstep(0.52, 0.92, t.noise) * 0.08);
    color = mix(color, MATERIAL.marble, t.mineral * smoothstep(0.88, 1.0, t.noise) * 0.06);

    color = lift(
      color,
      t.elevation * 5 +
        t.mountains * 8 -
        t.basin * 5 -
        t.cliffs * 4 +
        t.beach * 2 +
        (t.noise - 0.5) * 5
    );

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
    canvas.dataset.hearthBlueprint = BLUEPRINT;
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthNorthCrownMass = "true";
    canvas.dataset.hearthEquatorialGreatMass = "true";
    canvas.dataset.hearthSecondaryMasses = "5";
    canvas.dataset.hearthUniqueMassProfiles = "true";
    canvas.dataset.hearthTwoBodyRead = "false";
    canvas.dataset.hearthSymmetryReduced = "true";
    canvas.dataset.hearthOvalPatchRead = "false";
    canvas.dataset.hearthNaturalCoastlinePressure = "true";
    canvas.dataset.hearthSymmetricalDotDistribution = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function getBodyMasses() {
    return BODY_MASSES.map((mass) => Object.freeze({ ...mass }));
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      blueprint: BLUEPRINT,
      version: VERSION,
      authority: "assets-material-expression",
      bodyMassCount: 7,
      northCrownMass: true,
      equatorialGreatMass: true,
      secondaryMasses: 5,
      uniqueMassProfiles: true,
      twoBodyRead: false,
      symmetryReduced: true,
      ovalPatchRead: false,
      naturalCoastlinePressure: true,
      symmetricalDotDistribution: false,
      landDistributionTarget: {
        northCrownMass: 0.11,
        equatorialGreatMass: 0.34,
        northwestTemperateMass: 0.10,
        northeastBrokenShelfMass: 0.09,
        southeastWarmMass: 0.13,
        southwestRidgeMass: 0.14,
        southTransitionalMass: 0.09
      },
      bodyMasses: getBodyMasses(),
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
    blueprint: BLUEPRINT,
    bodyMasses: BODY_MASSES,
    createTextureCanvas,
    createHearthTextureCanvas: createTextureCanvas,
    classify,
    sample,
    getBodyMasses,
    getStatus
  });

  window.HEARTH_SEVEN_BODY_MASS_BLUEPRINT = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    blueprint: BLUEPRINT,
    bodyMasses: BODY_MASSES,
    classify,
    sample,
    getStatus
  });

  window.HEARTH_ASSETS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthAssetsLoaded = "true";
  document.documentElement.dataset.hearthAssetsContract = CONTRACT;
  document.documentElement.dataset.hearthAssetsReceipt = RECEIPT;
  document.documentElement.dataset.hearthBlueprint = BLUEPRINT;
  document.documentElement.dataset.hearthBodyMassCount = "7";
  document.documentElement.dataset.hearthNorthCrownMass = "true";
  document.documentElement.dataset.hearthEquatorialGreatMass = "true";
  document.documentElement.dataset.hearthSecondaryMasses = "5";
  document.documentElement.dataset.hearthUniqueMassProfiles = "true";
  document.documentElement.dataset.hearthTwoBodyRead = "false";
  document.documentElement.dataset.hearthSymmetryReduced = "true";
  document.documentElement.dataset.hearthOvalPatchRead = "false";
  document.documentElement.dataset.hearthNaturalCoastlinePressure = "true";
  document.documentElement.dataset.hearthSymmetricalDotDistribution = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
