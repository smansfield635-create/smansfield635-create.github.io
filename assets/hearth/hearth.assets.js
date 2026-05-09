// /assets/hearth/hearth.assets.js
// HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_AUTHORITY_TNT_v1
// Assets do not adopt authority.
// Assets bind, separate, define, carry, and express visible material.
// Purpose:
// - Keep land, coast, shelf water, deep ocean, mountains, minerals, beaches,
//   islands, and atmosphere from globbing together.
// - Provide boundary-preserving material expression to canvas/render.
// - No runtime motion logic. No controls. No GraphicBox. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_G4_1_ASSET_BOUNDARY_EXPRESSION_RECEIPT";
  const VERSION = "2026-05-09.hearth-g4-1-asset-boundary-expression-v1";

  const MATERIAL = Object.freeze({
    deepOcean: [4, 24, 52],
    ocean: [8, 70, 116],
    shelf: [23, 150, 176],
    coastFoam: [104, 202, 205],
    beach: [196, 174, 112],
    lowland: [139, 132, 86],
    upland: [113, 121, 78],
    stone: [103, 104, 96],
    slate: [67, 78, 88],
    granite: [127, 119, 105],
    marble: [184, 178, 160],
    gold: [220, 176, 68],
    opal: [171, 216, 205],
    diamond: [196, 232, 242],
    shadow: [8, 13, 17]
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

  function mod(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function wrapDelta(value) {
    return mod(value + 0.5, 1) - 0.5;
  }

  function mixColor(a, b, t) {
    const x = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], x)),
      Math.round(lerp(a[1], b[1], x)),
      Math.round(lerp(a[2], b[2], x))
    ];
  }

  function addColor(a, amount) {
    return [
      clamp(Math.round(a[0] + amount), 0, 255),
      clamp(Math.round(a[1] + amount), 0, 255),
      clamp(Math.round(a[2] + amount), 0, 255)
    ];
  }

  function hash(a, b, seed) {
    let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(b ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
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
      lerp(hash(mod(x0, s), y0, seed), hash(mod(x1, s), y0, seed), sx),
      lerp(hash(mod(x0, s), y1, seed), hash(mod(x1, s), y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed) {
    let amp = 0.5;
    let total = 0;
    let norm = 0;
    let scale = 4;

    for (let i = 0; i < 5; i += 1) {
      total += noise(u, v, scale, seed + i * 97) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed) {
    let amp = 0.54;
    let total = 0;
    let norm = 0;
    let scale = 8;

    for (let i = 0; i < 4; i += 1) {
      const n = noise(u, v, scale, seed + i * 71);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ellipse(u, v, cx, cy, rx, ry, angle) {
    const dx = wrapDelta(u - cx);
    const dy = v - cy;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    return 1 - Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));
  }

  function maxOf(list) {
    let out = -999;
    for (let i = 0; i < list.length; i += 1) out = Math.max(out, list[i]);
    return out;
  }

  function landField(u, v) {
    const main = maxOf([
      ellipse(u, v, 0.315, 0.475, 0.205, 0.245, -0.25),
      ellipse(u, v, 0.275, 0.415, 0.105, 0.135, -0.8),
      ellipse(u, v, 0.392, 0.535, 0.115, 0.145, 0.35),
      ellipse(u, v, 0.255, 0.63, 0.07, 0.105, 0.1),
      ellipse(u, v, 0.365, 0.315, 0.052, 0.05, 0.1)
    ]);

    const right = maxOf([
      ellipse(u, v, 0.775, 0.585, 0.09, 0.315, 0.05),
      ellipse(u, v, 0.825, 0.695, 0.06, 0.17, -0.32),
      ellipse(u, v, 0.733, 0.46, 0.045, 0.105, 0.55)
    ]);

    const islandChain = maxOf([
      ellipse(u, v, 0.175, 0.66, 0.035, 0.062, -0.15),
      ellipse(u, v, 0.225, 0.705, 0.032, 0.055, 0.45),
      ellipse(u, v, 0.255, 0.735, 0.026, 0.04, -0.35),
      ellipse(u, v, 0.365, 0.24, 0.023, 0.017, 0.1),
      ellipse(u, v, 0.405, 0.225, 0.015, 0.011, -0.2)
    ]);

    return maxOf([main, right, islandChain])
      + (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.155
      + (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.072;
  }

  function classify(u, v) {
    const field = landField(u, v);
    const isLand = field > 0;
    const shelf = smoothstep(-0.18, 0.025, field);
    const coast = 1 - clamp(Math.abs(field) * 19, 0, 1);
    const ridge = ridged(u + 0.021, v - 0.015, 1409);
    const broad = fbm(u + 0.117, v + 0.039, 307);
    const micro = fbm(u - 0.082, v + 0.051, 907);
    const mineral = noise(u + 0.42, v - 0.18, 72, 9207);
    const seam = ridged(u * 1.7 + 0.03, v * 1.4 - 0.08, 6113);
    const islandSeat =
      ellipse(u, v, 0.175, 0.66, 0.035, 0.062, -0.15) > -0.02 ||
      ellipse(u, v, 0.225, 0.705, 0.032, 0.055, 0.45) > -0.02 ||
      ellipse(u, v, 0.255, 0.735, 0.026, 0.04, -0.35) > -0.02 ||
      ellipse(u, v, 0.365, 0.24, 0.023, 0.017, 0.1) > -0.02;

    const elevation = clamp(field * 1.25 + ridge * 0.58 + (broad - 0.5) * 0.22, 0, 1);
    const mountain = isLand ? smoothstep(0.45, 0.94, elevation) : 0;
    const beach = isLand ? smoothstep(0.03, 0.0, Math.abs(field)) * coast : 0;
    const coastline = smoothstep(0.0, 0.85, coast);
    const deepOcean = !isLand ? 1 - shelf : 0;
    const shelfWater = !isLand ? shelf : 0;

    return {
      field,
      isLand,
      shelf,
      coast,
      coastline,
      deepOcean,
      shelfWater,
      ridge,
      broad,
      micro,
      mineral,
      seam,
      elevation,
      mountain,
      beach,
      islandSeat
    };
  }

  function sample(u, v) {
    const c = classify(u, v);

    if (!c.isLand) {
      let color = mixColor(MATERIAL.deepOcean, MATERIAL.ocean, clamp(0.26 + c.micro * 0.58, 0, 1));
      color = mixColor(color, MATERIAL.shelf, c.shelfWater * 0.95);

      const current = (fbm(u * 0.92 + 0.13, v * 0.88 - 0.05, 4441) - 0.5) * 7;
      color = addColor(color, current - c.deepOcean * 4);

      color = mixColor(color, MATERIAL.coastFoam, c.coastline * c.shelfWater * 0.42);

      return {
        color,
        channels: {
          landBody: 0,
          coastline: c.coastline,
          shelfWater: c.shelfWater,
          deepOcean: c.deepOcean,
          mountainStone: 0,
          mineralSeam: 0,
          beach: 0,
          island: 0,
          atmospherePlasma: 0.2
        }
      };
    }

    let color = mixColor(MATERIAL.beach, MATERIAL.lowland, smoothstep(0.03, 0.24, c.field));
    color = mixColor(color, MATERIAL.upland, smoothstep(0.18, 0.56, c.elevation) * 0.56);
    color = mixColor(color, MATERIAL.stone, c.mountain * 0.35);
    color = mixColor(color, MATERIAL.slate, c.mountain * c.ridge * 0.34);
    color = mixColor(color, MATERIAL.granite, c.mountain * smoothstep(0.55, 0.9, c.ridge) * 0.30);
    color = mixColor(color, MATERIAL.marble, c.mountain * smoothstep(0.78, 0.98, c.ridge) * 0.23);

    const goldSeam = smoothstep(0.92, 0.992, c.mineral) * smoothstep(0.54, 0.98, c.seam);
    const opalSeat = smoothstep(0.965, 0.999, noise(u - 0.11, v + 0.17, 96, 3331));
    const diamondSeat = smoothstep(0.985, 0.9995, noise(u + 0.39, v - 0.22, 128, 8189));

    color = mixColor(color, MATERIAL.gold, goldSeam * 0.38);
    color = mixColor(color, MATERIAL.opal, opalSeat * 0.25);
    color = mixColor(color, MATERIAL.diamond, diamondSeat * 0.18);

    color = mixColor(color, MATERIAL.beach, c.beach * 0.72);
    color = addColor(color, c.coast * 8 + (c.micro - 0.5) * 12);

    if (c.islandSeat) {
      color = mixColor(color, MATERIAL.beach, 0.18);
      color = addColor(color, 8);
    }

    return {
      color,
      channels: {
        landBody: 1,
        coastline: c.coastline,
        shelfWater: 0,
        deepOcean: 0,
        mountainStone: c.mountain,
        mineralSeam: Math.max(goldSeam, opalSeat * 0.55, diamondSeat * 0.4),
        beach: c.beach,
        island: c.islandSeat ? 1 : 0,
        atmospherePlasma: 0.22
      }
    };
  }

  function createTextureCanvas(options = {}) {
    const mobile = window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
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
    canvas.dataset.hearthAssetsBoundaryChannels = "landBody,coastline,shelfWater,deepOcean,mountainStone,mineralSeam,beach,island,atmospherePlasma";
    canvas.dataset.hearthAssetsAdoptAuthority = "false";

    return canvas;
  }

  function getContract() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "material-boundary-expression",
      adoptsAuthority: false,
      verbs: ["bind", "separate", "define", "carry", "express"],
      channels: [
        "landBody",
        "coastline",
        "shelfWater",
        "deepOcean",
        "mountainStone",
        "mineralSeam",
        "beach",
        "island",
        "atmospherePlasma"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_ASSETS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    material: MATERIAL,
    sample,
    classify,
    createTextureCanvas,
    getContract
  });

  document.documentElement.dataset.hearthAssetsLoaded = "true";
  document.documentElement.dataset.hearthAssetsContract = CONTRACT;
  document.documentElement.dataset.hearthAssetsReceipt = RECEIPT;
  document.documentElement.dataset.hearthAssetsAdoptAuthority = "false";
  document.documentElement.dataset.hearthAssetsBoundaryExpression = "true";
})();
