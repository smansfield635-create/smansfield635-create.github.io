// /assets/hearth/hearth.assets.js
// HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v2
// Full-file replacement.
// Assets authority only.
// Defines seven Hearth body masses and generates the material texture.
// Runtime, controls, route, HTML, and canvas authority remain separate.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v2";
  const RECEIPT = "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.hearth-seven-body-mass-hard-renewal-v2";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_MASSES = Object.freeze([
    { id: 1, key: "north-crown-mass", name: "North Crown Mass", lat: 78 * DEG, lon: -18 * DEG, rx: 64 * DEG, ry: 15 * DEG, angle: -8 * DEG, mountain: 0.72, ice: 0.86, wet: 0.28, mineral: 0.38 },
    { id: 2, key: "equatorial-great-mass", name: "Equatorial Great Mass", lat: 2 * DEG, lon: 0 * DEG, rx: 58 * DEG, ry: 28 * DEG, angle: -11 * DEG, mountain: 0.58, ice: 0.04, wet: 0.64, mineral: 0.68 },
    { id: 3, key: "northwest-temperate-mass", name: "Northwest Temperate Mass", lat: 44 * DEG, lon: -104 * DEG, rx: 30 * DEG, ry: 18 * DEG, angle: 24 * DEG, mountain: 0.54, ice: 0.14, wet: 0.56, mineral: 0.50 },
    { id: 4, key: "northeast-broken-shelf-mass", name: "Northeast Broken Shelf Mass", lat: 34 * DEG, lon: 104 * DEG, rx: 28 * DEG, ry: 16 * DEG, angle: -31 * DEG, mountain: 0.34, ice: 0.06, wet: 0.72, mineral: 0.42 },
    { id: 5, key: "southeast-warm-mass", name: "Southeast Warm Mass", lat: -24 * DEG, lon: 142 * DEG, rx: 32 * DEG, ry: 20 * DEG, angle: 18 * DEG, mountain: 0.36, ice: 0.00, wet: 0.78, mineral: 0.48 },
    { id: 6, key: "southwest-ridge-mass", name: "Southwest Ridge Mass", lat: -38 * DEG, lon: -122 * DEG, rx: 30 * DEG, ry: 19 * DEG, angle: -22 * DEG, mountain: 0.74, ice: 0.12, wet: 0.40, mineral: 0.70 },
    { id: 7, key: "south-transitional-mass", name: "South Transitional Mass", lat: -59 * DEG, lon: 36 * DEG, rx: 34 * DEG, ry: 15 * DEG, angle: 13 * DEG, mountain: 0.48, ice: 0.52, wet: 0.36, mineral: 0.44 }
  ]);

  const MATERIAL = Object.freeze({
    abyss: [2, 12, 30],
    deepOcean: [3, 20, 50],
    ocean: [6, 58, 104],
    shelf: [27, 128, 148],
    shelfSoft: [58, 154, 158],
    foam: [116, 176, 166],
    wetBeach: [174, 158, 106],
    beach: [202, 180, 116],
    lowland: [92, 130, 76],
    temperate: [78, 120, 72],
    upland: [100, 112, 78],
    ridge: [86, 88, 84],
    cliff: [58, 66, 76],
    granite: [118, 112, 102],
    slate: [48, 62, 76],
    ice: [204, 224, 226],
    polarStone: [126, 140, 144],
    copper: [156, 88, 58],
    gold: [208, 164, 66],
    opal: [154, 190, 186]
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

    for (let i = 0; i < 5; i += 1) {
      total += noise(u, v, scale, seed + i * 101) * amp;
      norm += amp;
      amp *= 0.53;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 6;

    for (let i = 0; i < 5; i += 1) {
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
    const fracture = (fbm(u + mass.id * 0.071, v - mass.id * 0.037, 1100 + mass.id * 31) - 0.5) * 0.17;
    const ridge = (ridged(u + mass.id * 0.043, v + mass.id * 0.029, 2100 + mass.id * 41) - 0.5) * 0.07;
    const bay = Math.sin(theta * (3.0 + mass.id * 0.21) + dist * 4.1) * 0.025;
    const field = 1 - dist + fracture + ridge + bay;

    return {
      mass,
      field,
      dist,
      theta,
      landMask: smoothstep(-0.04, 0.13, field),
      coast: smoothstep(0, 0.84, 1 - clamp(Math.abs(field) * 19, 0, 1))
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
    const shelfBand = smoothstep(0.18, 0.90, ridged(u * 1.7 + 0.05, v * 1.35 - 0.03, 7011));
    const shelf = isLand ? 0 : clamp(shelfBase * primary.coast * (0.38 + shelfBand * 0.34), 0, 1);
    const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.82, 0, 1);
    const latitudeCold = smoothstep(46 * DEG, 84 * DEG, Math.abs(p.lat));
    const polarCold = clamp(latitudeCold * 0.55 + primary.mass.ice * primary.landMask * 0.75, 0, 1);
    const ring = Math.exp(-Math.pow(primary.dist - 0.56, 2) / 0.012);
    const ridgeNoise = smoothstep(0.36, 0.94, ridged(u * 2.2 + primary.mass.id * 0.05, v * 2.1 - primary.mass.id * 0.04, 8060 + primary.mass.id * 23));
    const mountains = isLand ? clamp((primary.mass.mountain * ring * 0.62 + ridgeNoise * primary.mass.mountain * 0.42) * primary.landMask, 0, 1) : 0;
    const basin = isLand ? clamp((1 - mountains) * smoothstep(0.10, 0.60, field) * (1 - ridgeNoise) * primary.mass.wet, 0, 1) : 0;
    const cliffs = isLand ? clamp(primary.coast * ridgeNoise * (0.32 + primary.mass.mountain * 0.48), 0, 1) : 0;
    const beach = clamp(primary.coast * (isLand ? 0.82 : shelf * 0.55) * (0.35 + primary.mass.wet * 0.55), 0, 1);
    const mineralNoise = smoothstep(0.80, 0.99, noise(u + primary.mass.id * 0.11, v - primary.mass.id * 0.08, 80, 9111));
    const mineral = isLand ? clamp(mineralNoise * primary.mass.mineral * (0.35 + mountains * 0.65), 0, 1) : 0;
    const bodySeparation = clamp(primary.landMask - smoothstep(-0.05, 0.12, secondary.field) * 0.13, 0, 1);

    return {
      u,
      v,
      field,
      isLand,
      primaryMassId: primary.mass.id,
      primaryMassKey: primary.mass.key,
      primaryMassName: primary.mass.name,
      secondaryMassId: secondary.mass.id,
      coast: primary.coast,
      shelf,
      shelfBand,
      deepOcean,
      polarCold,
      mountains,
      basin,
      cliffs,
      beach,
      mineral,
      bodySeparation,
      ridgeNoise,
      noise: fbm(u + 0.013, v - 0.071, 333),
      elevation: isLand ? clamp(0.18 + field * 0.55 + mountains * 0.55 - basin * 0.2, 0, 1) : 0
    };
  }

  function sample(u, v) {
    const t = classify(u, v);

    if (!t.isLand) {
      let color = mix(MATERIAL.abyss, MATERIAL.deepOcean, clamp(0.2 + t.noise * 0.46, 0, 1));
      color = mix(color, MATERIAL.ocean, smoothstep(0.18, 0.76, 1 - t.deepOcean) * 0.4);
      color = mix(color, MATERIAL.shelf, t.shelf * 0.58);
      color = mix(color, MATERIAL.shelfSoft, t.shelf * t.coast * 0.22);
      color = mix(color, MATERIAL.foam, t.shelf * t.coast * 0.08);
      color = lift(color, -9 * t.deepOcean + (t.noise - 0.5) * 4);

      return { color, terrain: t };
    }

    let color = mix(MATERIAL.lowland, MATERIAL.temperate, clamp(t.bodySeparation * 0.72 + t.noise * 0.18, 0, 1));
    color = mix(color, MATERIAL.upland, t.elevation * 0.34);
    color = mix(color, MATERIAL.ridge, t.mountains * 0.42);
    color = mix(color, MATERIAL.slate, t.mountains * t.ridgeNoise * 0.32);
    color = mix(color, MATERIAL.granite, t.mountains * smoothstep(0.56, 0.96, t.ridgeNoise) * 0.34);
    color = mix(color, MATERIAL.cliff, t.cliffs * 0.55);
    color = mix(color, MATERIAL.wetBeach, t.beach * 0.34);
    color = mix(color, MATERIAL.beach, t.beach * 0.24);
    color = mix(color, MATERIAL.polarStone, t.polarCold * 0.30);
    color = mix(color, MATERIAL.ice, t.polarCold * 0.46);
    color = mix(color, MATERIAL.copper, t.mineral * smoothstep(0.34, 0.72, t.ridgeNoise) * 0.12);
    color = mix(color, MATERIAL.gold, t.mineral * smoothstep(0.76, 0.98, t.ridgeNoise) * 0.16);
    color = mix(color, MATERIAL.opal, t.mineral * smoothstep(0.52, 0.92, t.noise) * 0.08);
    color = lift(color, t.elevation * 5 + t.mountains * 8 - t.basin * 5 - t.cliffs * 4 + t.beach * 2 + (t.noise - 0.5) * 5);

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
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthSevenBodyMassFormation = "true";
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
      bodyMassCount: 7,
      northCrownMass: true,
      equatorialGreatMass: true,
      secondaryMasses: 5,
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
  document.documentElement.dataset.hearthBodyMassCount = "7";
  document.documentElement.dataset.hearthSevenBodyMassFormation = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
