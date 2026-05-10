// /assets/hearth/hearth.assets.js
// HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v1
// Full-file replacement.
// Assets authority only.
// Purpose:
// - Define Hearth through seven primary body masses.
// - Preserve existing Hearth route, runtime, controls, and canvas.
// - Give the globe multiple coherent land/body anchors from swivel and rotation.
// - One North Crown Mass.
// - One Equatorial Great Mass.
// - Five methodically disposed secondary masses.
// - No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_TNT_v1";
  const RECEIPT = "HEARTH_G2_SEVEN_BODY_MASS_FORMATION_ASSETS_RECEIPT";
  const PREVIOUS_CONTRACT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_TNT_v1";
  const VERSION = "2026-05-10.hearth-seven-body-mass-formation";

  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  const BODY_MASSES = Object.freeze([
    {
      id: 1,
      key: "north-crown-mass",
      name: "North Crown Mass",
      role: "polar-anchor",
      lat: 78 * DEG,
      lon: -18 * DEG,
      rx: 64 * DEG,
      ry: 15 * DEG,
      angle: -8 * DEG,
      elevation: 0.76,
      mountain: 0.72,
      ice: 0.86,
      wetness: 0.28,
      mineral: 0.38
    },
    {
      id: 2,
      key: "equatorial-great-mass",
      name: "Equatorial Great Mass",
      role: "primary-habitable-body",
      lat: 2 * DEG,
      lon: 0 * DEG,
      rx: 58 * DEG,
      ry: 28 * DEG,
      angle: -11 * DEG,
      elevation: 0.54,
      mountain: 0.58,
      ice: 0.04,
      wetness: 0.64,
      mineral: 0.68
    },
    {
      id: 3,
      key: "northwest-temperate-mass",
      name: "Northwest Temperate Mass",
      role: "temperate-highland",
      lat: 44 * DEG,
      lon: -104 * DEG,
      rx: 30 * DEG,
      ry: 18 * DEG,
      angle: 24 * DEG,
      elevation: 0.48,
      mountain: 0.54,
      ice: 0.14,
      wetness: 0.56,
      mineral: 0.50
    },
    {
      id: 4,
      key: "northeast-broken-shelf-mass",
      name: "Northeast Broken Shelf Mass",
      role: "broken-shelf-bays",
      lat: 34 * DEG,
      lon: 104 * DEG,
      rx: 28 * DEG,
      ry: 16 * DEG,
      angle: -31 * DEG,
      elevation: 0.42,
      mountain: 0.34,
      ice: 0.06,
      wetness: 0.72,
      mineral: 0.42
    },
    {
      id: 5,
      key: "southeast-warm-mass",
      name: "Southeast Warm Mass",
      role: "warm-shelf-continent",
      lat: -24 * DEG,
      lon: 142 * DEG,
      rx: 32 * DEG,
      ry: 20 * DEG,
      angle: 18 * DEG,
      elevation: 0.40,
      mountain: 0.36,
      ice: 0.00,
      wetness: 0.78,
      mineral: 0.48
    },
    {
      id: 6,
      key: "southwest-ridge-mass",
      name: "Southwest Ridge Mass",
      role: "ridge-cliff-pressure",
      lat: -38 * DEG,
      lon: -122 * DEG,
      rx: 30 * DEG,
      ry: 19 * DEG,
      angle: -22 * DEG,
      elevation: 0.58,
      mountain: 0.74,
      ice: 0.12,
      wetness: 0.40,
      mineral: 0.70
    },
    {
      id: 7,
      key: "south-transitional-mass",
      name: "South Transitional Mass",
      role: "southern-counterweight",
      lat: -59 * DEG,
      lon: 36 * DEG,
      rx: 34 * DEG,
      ry: 15 * DEG,
      angle: 13 * DEG,
      elevation: 0.50,
      mountain: 0.48,
      ice: 0.52,
      wetness: 0.36,
      mineral: 0.44
    }
  ]);

  const MATERIAL = Object.freeze({
    abyss: [2, 12, 30],
    deepOcean: [3, 20, 50],
    ocean: [6, 58, 104],
    openOcean: [9, 76, 124],
    shelf: [27, 128, 148],
    shelfSoft: [58, 154, 158],
    coastFoam: [116, 176, 166],
    wetBeach: [174, 158, 106],
    beach: [202, 180, 116],
    dryBeach: [170, 146, 92],
    lowland: [92, 130, 76],
    temperate: [78, 120, 72],
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
    plasma: [76, 150, 184]
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

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function addColor(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function hash2(x, y, seed) {
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
      lerp(hash2(((x0 % s) + s) % s, y0, seed), hash2(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash2(((x0 % s) + s) % s, y1, seed), hash2(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed) {
    let amp = 0.52;
    let total = 0;
    let norm = 0;
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
    let amp = 0.58;
    let total = 0;
    let norm = 0;
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

  function lonLatFromUV(u, v) {
    return {
      lon: (u - 0.5) * TAU,
      lat: (0.5 - v) * Math.PI
    };
  }

  function localMassCoordinates(lon, lat, mass) {
    const dLon = wrapPi(lon - mass.lon) * Math.cos(mass.lat);
    const dLat = lat - mass.lat;

    const ca = Math.cos(mass.angle);
    const sa = Math.sin(mass.angle);

    const x = dLon * ca - dLat * sa;
    const y = dLon * sa + dLat * ca;

    const nx = x / mass.rx;
    const ny = y / mass.ry;
    const dist = Math.sqrt(nx * nx + ny * ny);
    const theta = Math.atan2(ny, nx);

    return { x, y, nx, ny, dist, theta, field: 1 - dist };
  }

  function massField(lon, lat, mass, u, v) {
    const p = localMassCoordinates(lon, lat, mass);

    const edgeNoise = (fbm(u + mass.id * 0.071, v - mass.id * 0.037, 1100 + mass.id * 31) - 0.5) * 0.17;
    const ridgeNoise = (ridged(u + mass.id * 0.043, v + mass.id * 0.029, 2100 + mass.id * 41) - 0.5) * 0.07;
    const brokenBays = Math.sin(p.theta * (3.0 + mass.id * 0.21) + p.dist * 4.1) * 0.025;

    const field = p.field + edgeNoise + ridgeNoise + brokenBays;

    return {
      mass,
      ...p,
      field,
      coast: 1 - clamp(Math.abs(field) * 19, 0, 1),
      landMask: smoothstep(-0.04, 0.13, field)
    };
  }

  function classifyHearth(u, v) {
    const { lon, lat } = lonLatFromUV(u, v);
    const fields = BODY_MASSES.map((mass) => massField(lon, lat, mass, u, v));
    fields.sort((a, b) => b.field - a.field);

    const primary = fields[0];
    const secondary = fields[1];
    const field = primary.field;
    const isLand = field > 0;

    const landMask = smoothstep(-0.045, 0.14, field);
    const coast = smoothstep(0.0, 0.84, primary.coast);
    const shelfBase = smoothstep(-0.25, 0.02, field);
    const shelfBand = smoothstep(0.18, 0.90, ridged(u * 1.7 + 0.05, v * 1.35 - 0.03, 7011));
    const shelf = isLand ? 0 : clamp(shelfBase * coast * (0.38 + shelfBand * 0.34), 0, 1);
    const deepOcean = isLand ? 0 : clamp(1 - shelfBase * 0.82, 0, 1);

    const latitudeCold = smoothstep(46 * DEG, 84 * DEG, Math.abs(lat));
    const polarCold = clamp(latitudeCold * 0.55 + primary.mass.ice * primary.landMask * 0.75, 0, 1);

    const ring = Math.exp(-Math.pow(primary.dist - 0.56, 2) / 0.012);
    const ridgeBreak = smoothstep(0.36, 0.94, ridged(u * 2.2 + primary.mass.id * 0.05, v * 2.1 - primary.mass.id * 0.04, 8060 + primary.mass.id * 23));
    const mountains = isLand
      ? clamp((primary.mass.mountain * ring * 0.62 + ridgeBreak * primary.mass.mountain * 0.42) * landMask, 0, 1)
      : 0;

    const basin = isLand
      ? clamp((1 - mountains) * smoothstep(0.10, 0.60, field) * (1 - ridgeBreak) * primary.mass.wetness, 0, 1)
      : 0;

    const cliffs = isLand
      ? clamp(coast * ridgeBreak * (0.32 + primary.mass.mountain * 0.48), 0, 1)
      : 0;

    const beach = clamp(coast * (isLand ? 0.82 : shelf * 0.55) * (0.35 + primary.mass.wetness * 0.55), 0, 1);

    const mineralNoise = smoothstep(0.80, 0.99, noise(u + primary.mass.id * 0.11, v - primary.mass.id * 0.08, 80, 9111));
    const mineral = isLand
      ? clamp(mineralNoise * primary.mass.mineral * (0.35 + mountains * 0.65), 0, 1)
      : 0;

    const secondaryPressure = secondary
      ? clamp(smoothstep(-0.05, 0.12, secondary.field) * 0.45, 0, 1)
      : 0;

    const bodySeparation = clamp(primary.landMask - secondaryPressure * 0.30, 0, 1);

    return {
      u,
      v,
      lon,
      lat,
      field,
      isLand,
      landMask,
      primaryMassId: primary.mass.id,
      primaryMassKey: primary.mass.key,
      primaryMassName: primary.mass.name,
      secondaryMassId: secondary ? secondary.mass.id : 0,
      coast,
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
      elevation: isLand
        ? clamp(0.18 + field * 0.55 + mountains * 0.55 - basin * 0.20 + primary.mass.elevation * 0.22, 0, 1)
        : 0,
      noise: fbm(u + 0.013, v - 0.071, 333),
      ridgeNoise: ridgeBreak,
      fields
    };
  }

  function sampleHearthAsset(u, v) {
    const t = classifyHearth(u, v);

    if (!t.isLand) {
      let color = mixColor(
        MATERIAL.abyss,
        MATERIAL.deepOcean,
        clamp(0.20 + t.noise * 0.46, 0, 1)
      );

      color = mixColor(color, MATERIAL.ocean, smoothstep(0.18, 0.76, 1 - t.deepOcean) * 0.40);
      color = mixColor(color, MATERIAL.openOcean, t.shelfBand * 0.12);
      color = mixColor(color, MATERIAL.shelf, t.shelf * 0.58);
      color = mixColor(color, MATERIAL.shelfSoft, t.shelf * t.coast * 0.22);
      color = mixColor(color, MATERIAL.coastFoam, t.shelf * t.coast * 0.08);

      const depthShade = -9 * t.deepOcean;
      const waterMotion = (t.noise - 0.5) * 4;
      color = addColor(color, depthShade + waterMotion);

      return {
        color,
        terrain: t,
        channels: {
          land: 0,
          ocean: 1,
          deepOcean: t.deepOcean,
          shelf: t.shelf,
          coast: t.coast,
          polarCold: 0,
          mountains: 0,
          basin: 0,
          cliffs: 0,
          beach: 0,
          mineral: 0,
          bodyMassId: 0
        }
      };
    }

    let color = mixColor(
      MATERIAL.lowland,
      MATERIAL.temperate,
      clamp(t.bodySeparation * 0.72 + t.noise * 0.18, 0, 1)
    );

    color = mixColor(color, MATERIAL.upland, t.elevation * 0.34);
    color = mixColor(color, MATERIAL.ridge, t.mountains * 0.42);
    color = mixColor(color, MATERIAL.slate, t.mountains * t.ridgeNoise * 0.32);
    color = mixColor(color, MATERIAL.granite, t.mountains * smoothstep(0.56, 0.96, t.ridgeNoise) * 0.34);
    color = mixColor(color, MATERIAL.cliff, t.cliffs * 0.55);
    color = mixColor(color, MATERIAL.wetBeach, t.beach * 0.34);
    color = mixColor(color, MATERIAL.beach, t.beach * 0.24);
    color = mixColor(color, MATERIAL.dryBeach, t.beach * t.ridgeNoise * 0.10);
    color = mixColor(color, MATERIAL.polarStone, t.polarCold * 0.30);
    color = mixColor(color, MATERIAL.ice, t.polarCold * 0.46);

    const copper = t.mineral * smoothstep(0.34, 0.72, t.ridgeNoise);
    const gold = t.mineral * smoothstep(0.76, 0.98, t.ridgeNoise);
    const opal = t.mineral * smoothstep(0.52, 0.92, t.noise);

    color = mixColor(color, MATERIAL.copper, copper * 0.12);
    color = mixColor(color, MATERIAL.gold, gold * 0.16);
    color = mixColor(color, MATERIAL.opal, opal * 0.08);

    const lightLift =
      t.elevation * 5 +
      t.mountains * 8 -
      t.basin * 5 -
      t.cliffs * 4 +
      t.beach * 2 +
      (t.noise - 0.5) * 5;

    color = addColor(color, lightLift);

    return {
      color,
      terrain: t,
      channels: {
        land: 1,
        ocean: 0,
        deepOcean: 0,
        shelf: 0,
        coast: t.coast,
        polarCold: t.polarCold,
        mountains: t.mountains,
        basin: t.basin,
        cliffs: t.cliffs,
        beach: t.beach,
        mineral: t.mineral,
        bodyMassId: t.primaryMassId
      }
    };
  }

  function createTextureCanvas(options = {}) {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    const mobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 760 || coarse);

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
        const sample = sampleHearthAsset(u, v);
        const i = (y * width + x) * 4;

        data[i] = sample.color[0];
        data[i + 1] = sample.color[1];
        data[i + 2] = sample.color[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.hearthAssetsContract = CONTRACT;
    canvas.dataset.hearthAssetsReceipt = RECEIPT;
    canvas.dataset.hearthAssetsPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthGeneration = "G2-seven-body-mass-formation";
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthNorthCrownMass = "true";
    canvas.dataset.hearthEquatorialGreatMass = "true";
    canvas.dataset.hearthSecondaryMasses = "5";
    canvas.dataset.hearthAssetsBoundaryExpression = "true";
    canvas.dataset.hearthAssetsAdoptAuthority = "false";
    canvas.dataset.hearthAssetsAbsorbAuthority = "false";
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
      version: VERSION,
      generation: "G2-seven-body-mass-formation",
      authority: "assets-material-expression",
      bodyMassCount: 7,
      onePolarMass: true,
      oneEquatorialGreatMass: true,
      secondaryMassCount: 5,
      bodyMasses: getBodyMasses(),
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      routeTouched: false,
      htmlTouched: false,
      absorbsAuthority: false,
      verbs: ["bind", "separate", "define", "carry", "express"],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_SEVEN_BODY_MASS_FORMATION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    bodyMasses: getBodyMasses(),
    classify: classifyHearth,
    sample: sampleHearthAsset
  });

  window.HEARTH_ASSETS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    createTextureCanvas,
    createHearthTextureCanvas: createTextureCanvas,
    sample: sampleHearthAsset,
    classify: classifyHearth,
    getBodyMasses,
    getStatus
  });

  window.HEARTH_ASSETS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthAssetsLoaded = "true";
  document.documentElement.dataset.hearthAssetsContract = CONTRACT;
  document.documentElement.dataset.hearthAssetsReceipt = RECEIPT;
  document.documentElement.dataset.hearthGeneration = "G2-seven-body-mass-formation";
  document.documentElement.dataset.hearthBodyMassCount = "7";
  document.documentElement.dataset.hearthNorthCrownMass = "true";
  document.documentElement.dataset.hearthEquatorialGreatMass = "true";
  document.documentElement.dataset.hearthSecondaryMasses = "5";
  document.documentElement.dataset.hearthAssetsBoundaryExpression = "true";
  document.documentElement.dataset.hearthAssetsAdoptAuthority = "false";
  document.documentElement.dataset.hearthAssetsAbsorbAuthority = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
