// /assets/hearth/hearth.assets.js
// HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_ASSETS_TNT_v3
// Full-file replacement.
// Assets authority only.
// Purpose:
// - Convert HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_v1 into deterministic material fields.
// - Give every Hearth body mass a unique scaled design profile.
// - Preserve runtime, controls, canvas, route separation.
// - Prevent two-body read.
// - No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_ASSETS_TNT_v3";
  const RECEIPT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_ASSETS_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v2";
  const BLUEPRINT = "HEARTH_SEVEN_BODY_MASS_BLUEPRINT_TO_SCALE_v1";
  const VERSION = "2026-05-10.hearth-seven-body-mass-blueprint-to-scale-v3";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_MASSES = Object.freeze([
    {
      id: 1,
      key: "north-crown-mass",
      name: "North Crown Mass",
      landWeight: 0.11,
      lat: 78 * DEG,
      lon: -18 * DEG,
      rx: 66 * DEG,
      ry: 15 * DEG,
      angle: -8 * DEG,
      profile: "broken-polar-crown",
      prongs: 3,
      crownBreak: 0.82,
      shelf: 0.46,
      mountain: 0.72,
      cliff: 0.52,
      basin: 0.12,
      beach: 0.08,
      wet: 0.28,
      ice: 0.86,
      mineral: 0.38,
      ridgeBias: 0.72,
      bayBias: 0.72,
      asymmetry: 0.78,
      palette: "polar-slate-ice"
    },
    {
      id: 2,
      key: "equatorial-great-mass",
      name: "Equatorial Great Mass",
      landWeight: 0.34,
      lat: 2 * DEG,
      lon: 0 * DEG,
      rx: 62 * DEG,
      ry: 29 * DEG,
      angle: -11 * DEG,
      profile: "great-equatorial-continent",
      prongs: 5,
      crownBreak: 0.24,
      shelf: 0.70,
      mountain: 0.58,
      cliff: 0.38,
      basin: 0.72,
      beach: 0.66,
      wet: 0.64,
      ice: 0.04,
      mineral: 0.68,
      ridgeBias: 0.58,
      bayBias: 0.50,
      asymmetry: 0.62,
      palette: "habitable-upland-basin"
    },
    {
      id: 3,
      key: "northwest-temperate-mass",
      name: "Northwest Temperate Mass",
      landWeight: 0.10,
      lat: 44 * DEG,
      lon: -104 * DEG,
      rx: 32 * DEG,
      ry: 18 * DEG,
      angle: 24 * DEG,
      profile: "temperate-highland-plate",
      prongs: 4,
      crownBreak: 0.30,
      shelf: 0.42,
      mountain: 0.54,
      cliff: 0.36,
      basin: 0.48,
      beach: 0.26,
      wet: 0.56,
      ice: 0.14,
      mineral: 0.50,
      ridgeBias: 0.66,
      bayBias: 0.24,
      asymmetry: 0.48,
      palette: "temperate-stone-green"
    },
    {
      id: 4,
      key: "northeast-broken-shelf-mass",
      name: "Northeast Broken Shelf Mass",
      landWeight: 0.09,
      lat: 34 * DEG,
      lon: 104 * DEG,
      rx: 30 * DEG,
      ry: 16 * DEG,
      angle: -31 * DEG,
      profile: "broken-shelf-archipelago",
      prongs: 7,
      crownBreak: 0.74,
      shelf: 0.88,
      mountain: 0.34,
      cliff: 0.24,
      basin: 0.26,
      beach: 0.62,
      wet: 0.72,
      ice: 0.06,
      mineral: 0.42,
      ridgeBias: 0.34,
      bayBias: 0.92,
      asymmetry: 0.86,
      palette: "turquoise-shelf-bays"
    },
    {
      id: 5,
      key: "southeast-warm-mass",
      name: "Southeast Warm Mass",
      landWeight: 0.13,
      lat: -24 * DEG,
      lon: 142 * DEG,
      rx: 36 * DEG,
      ry: 20 * DEG,
      angle: 18 * DEG,
      profile: "warm-crescent-shelf-continent",
      prongs: 4,
      crownBreak: 0.36,
      shelf: 0.82,
      mountain: 0.36,
      cliff: 0.26,
      basin: 0.42,
      beach: 0.86,
      wet: 0.78,
      ice: 0.00,
      mineral: 0.48,
      ridgeBias: 0.36,
      bayBias: 0.68,
      asymmetry: 0.72,
      palette: "warm-beach-lowland"
    },
    {
      id: 6,
      key: "southwest-ridge-mass",
      name: "Southwest Ridge Mass",
      landWeight: 0.14,
      lat: -38 * DEG,
      lon: -122 * DEG,
      rx: 34 * DEG,
      ry: 20 * DEG,
      angle: -22 * DEG,
      profile: "dark-ridge-cliff-pressure",
      prongs: 5,
      crownBreak: 0.40,
      shelf: 0.24,
      mountain: 0.82,
      cliff: 0.82,
      basin: 0.22,
      beach: 0.16,
      wet: 0.40,
      ice: 0.12,
      mineral: 0.78,
      ridgeBias: 0.94,
      bayBias: 0.32,
      asymmetry: 0.66,
      palette: "dark-ridge-mineral"
    },
    {
      id: 7,
      key: "south-transitional-mass",
      name: "South Transitional Mass",
      landWeight: 0.09,
      lat: -59 * DEG,
      lon: 36 * DEG,
      rx: 38 * DEG,
      ry: 15 * DEG,
      angle: 13 * DEG,
      profile: "cold-transitional-counterweight",
      prongs: 4,
      crownBreak: 0.58,
      shelf: 0.52,
      mountain: 0.48,
      cliff: 0.46,
      basin: 0.20,
      beach: 0.28,
      wet: 0.36,
      ice: 0.52,
      mineral: 0.44,
      ridgeBias: 0.50,
      bayBias: 0.56,
      asymmetry: 0.58,
      palette: "cold-storm-shelf"
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

  function massRead(lon, lat, mass, u, v) {
    const dx = wrapPi(lon - mass.lon) * Math.cos(mass.lat);
    const dy = lat - mass.lat;

    const ca = Math.cos(mass.angle);
    const sa = Math.sin(mass.angle);

    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;

    const nx = x / mass.rx;
    const ny = y / mass.ry;
    const dist = Math.sqrt(nx * nx + ny * ny);
    const theta = Math.atan2(ny, nx);

    const coastlineNoise = (fbm(u + mass.id * 0.071, v - mass.id * 0.037, 1100 + mass.id * 31) - 0.5) * (0.10 + mass.asymmetry * 0.10);
    const ridgeNoise = (ridged(u + mass.id * 0.043, v + mass.id * 0.029, 2100 + mass.id * 41) - 0.5) * (0.04 + mass.ridgeBias * 0.06);
    const bayWave = Math.sin(theta * mass.prongs + dist * (3.2 + mass.id * 0.27)) * 0.035 * mass.bayBias;
    const crownWave = Math.cos(theta * Math.max(3, mass.prongs - 1) - dist * 2.1) * 0.026 * mass.crownBreak;
    const asymmetryWave = Math.sin(theta * 2.0 + mass.id * 1.77) * 0.025 * mass.asymmetry;

    let field = 1 - dist + coastlineNoise + ridgeNoise + bayWave + crownWave + asymmetryWave;

    if (mass.key === "north-crown-mass") {
      const prongCut = Math.sin(theta * 3.0 + 0.7) * 0.10;
      const southernFracture = smoothstep(-0.70, -0.05, ny) * 0.14;
      field += prongCut - southernFracture;
    }

    if (mass.key === "equatorial-great-mass") {
      const westernShoulder = smoothstep(-0.95, -0.15, nx) * 0.10;
      const easternSplit = smoothstep(0.15, 0.95, nx) * Math.sin(theta * 4.0 + 1.2) * 0.075;
      const centralRift = Math.exp(-Math.pow(nx * 1.7 + ny * 0.35, 2) / 0.09) * 0.075;
      field += westernShoulder + easternSplit - centralRift;
    }

    if (mass.key === "northeast-broken-shelf-mass") {
      const archipelagoCut = noise(u + 0.31, v + 0.17, 34, 4488);
      field -= smoothstep(0.48, 0.86, archipelagoCut) * 0.18;
      field += Math.sin(theta * 7.0 + dist * 5.4) * 0.052;
    }

    if (mass.key === "southeast-warm-mass") {
      const crescent = Math.sin(theta + 1.4) * 0.12 - Math.cos(theta * 2.0) * 0.045;
      field += crescent;
    }

    if (mass.key === "southwest-ridge-mass") {
      const ridgeScar = Math.exp(-Math.pow(ny + nx * 0.34, 2) / 0.045) * 0.13;
      field += ridgeScar;
    }

    if (mass.key === "south-transitional-mass") {
      const elongatedShelf = Math.cos(theta * 2.0 - 0.9) * 0.06;
      const southBreak = smoothstep(0.20, 0.92, -ny) * 0.07;
      field += elongatedShelf - southBreak;
    }

    const coast = smoothstep(0, 0.86, 1 - clamp(Math.abs(field) * 18, 0, 1));

    return {
      mass,
      field,
      dist,
      theta,
      nx,
      ny,
      landMask: smoothstep(-0.04, 0.13, field),
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

    const shelfBase = smoothstep(-0.25, 0.02, field);
    const shelfTexture = smoothstep(0.18, 0.90, ridged(u * 1.7 + 0.05, v * 1.35 - 0.03, 7011));
    const shelf = isLand ? 0 : clamp(shelfBase * primary.coast * (0.30 + primary.mass.shelf * 0.70) * (0.48 + shelfTexture * 0.36), 0, 1);
    const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.82, 0, 1);

    const latitudeCold = smoothstep(46 * DEG, 84 * DEG, Math.abs(p.lat));
    const polarCold = clamp(latitudeCold * 0.55 + primary.mass.ice * primary.landMask * 0.75, 0, 1);

    const ridgeLine = Math.exp(-Math.pow(primary.ny + primary.nx * 0.28, 2) / 0.07);
    const ring = Math.exp(-Math.pow(primary.dist - 0.56, 2) / 0.014);
    const ridgeNoise = smoothstep(0.34, 0.94, ridged(u * 2.2 + primary.mass.id * 0.05, v * 2.1 - primary.mass.id * 0.04, 8060 + primary.mass.id * 23));

    const mountains = isLand
      ? clamp((primary.mass.mountain * ring * 0.44 + primary.mass.ridgeBias * ridgeLine * 0.34 + ridgeNoise * primary.mass.mountain * 0.38) * primary.landMask, 0, 1)
      : 0;

    const basin =
      isLand && primary.mass.basin > 0
        ? clamp((1 - mountains) * smoothstep(0.10, 0.62, field) * (1 - ridgeNoise) * primary.mass.basin, 0, 1)
        : 0;

    const cliffs = isLand
      ? clamp(primary.coast * ridgeNoise * (0.16 + primary.mass.cliff * 0.80), 0, 1)
      : 0;

    const beach = clamp(primary.coast * (isLand ? 0.82 : shelf * 0.55) * (0.18 + primary.mass.beach * 0.82), 0, 1);

    const bay = clamp(primary.coast * primary.mass.bayBias * smoothstep(0.30, 0.92, noise(u + primary.mass.id * 0.31, v - primary.mass.id * 0.23, 48, 5221)), 0, 1);

    const mineralNoise = smoothstep(0.78, 0.99, noise(u + primary.mass.id * 0.11, v - primary.mass.id * 0.08, 86, 9111));
    const mineral = isLand ? clamp(mineralNoise * primary.mass.mineral * (0.24 + mountains * 0.76), 0, 1) : 0;

    const secondaryPressure = secondary ? smoothstep(-0.05, 0.12, secondary.field) * 0.12 : 0;
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
      noise: fbm(u + 0.013, v - 0.071, 333),
      elevation: isLand ? clamp(0.18 + field * 0.55 + mountains * 0.55 - basin * 0.20, 0, 1) : 0
    };
  }

  function paletteBase(t) {
    switch (t.primaryMassKey) {
      case "north-crown-mass":
        return mix(MATERIAL.slate, MATERIAL.polarStone, 0.46);
      case "equatorial-great-mass":
        return mix(MATERIAL.lowland, MATERIAL.upland, 0.34);
      case "northwest-temperate-mass":
        return mix(MATERIAL.temperate, MATERIAL.granite, 0.24);
      case "northeast-broken-shelf-mass":
        return mix(MATERIAL.greenLowland, MATERIAL.beach, 0.22);
      case "southeast-warm-mass":
        return mix(MATERIAL.warmLowland, MATERIAL.beach, 0.26);
      case "southwest-ridge-mass":
        return mix(MATERIAL.darkMineral, MATERIAL.ridge, 0.30);
      case "south-transitional-mass":
        return mix(MATERIAL.stormShelf, MATERIAL.polarStone, 0.26);
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
  document.documentElement.dataset.hearthSymmetricalDotDistribution = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
