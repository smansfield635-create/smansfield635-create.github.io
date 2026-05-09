// /assets/audralia/audralia.assets.js
// AUDRALIA_V18_ASSET_BOUNDARY_EXPRESSION_AUTHORITY_TNT_v1
// Assets bind, separate, define, carry, and express.
// Assets do not absorb authority.
// Assets do not own runtime motion.
// Assets do not own surface truth.
// No GraphicBox. No generated image. No visual-pass claim.

const CONTRACT = "AUDRALIA_V18_ASSET_BOUNDARY_EXPRESSION_AUTHORITY_TNT_v1";
const RECEIPT = "AUDRALIA_V18_ASSET_BOUNDARY_EXPRESSION_RECEIPT";
const VERSION = "2026-05-09.audralia-v18-asset-boundary-expression";

const MATERIAL = Object.freeze({
  deepOcean: [4, 26, 58],
  ocean: [8, 76, 128],
  shelf: [26, 157, 183],
  coast: [122, 207, 205],
  beach: [195, 174, 112],
  lowland: [132, 136, 84],
  upland: [97, 126, 78],
  ridge: [91, 96, 88],
  slate: [64, 78, 90],
  granite: [126, 119, 105],
  marble: [184, 178, 160],
  copper: [174, 104, 63],
  gold: [220, 176, 68],
  opal: [171, 216, 205],
  plasma: [90, 175, 205]
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

function maxOf(values) {
  let out = -999;
  for (let i = 0; i < values.length; i += 1) out = Math.max(out, values[i]);
  return out;
}

function audraliaField(u, v) {
  const mainland = maxOf([
    ellipse(u, v, 0.33, 0.50, 0.22, 0.25, -0.28),
    ellipse(u, v, 0.26, 0.42, 0.11, 0.14, -0.85),
    ellipse(u, v, 0.42, 0.57, 0.12, 0.14, 0.42),
    ellipse(u, v, 0.27, 0.66, 0.07, 0.10, 0.10)
  ]);

  const easternBody = maxOf([
    ellipse(u, v, 0.77, 0.58, 0.10, 0.31, 0.04),
    ellipse(u, v, 0.82, 0.69, 0.06, 0.17, -0.30),
    ellipse(u, v, 0.72, 0.45, 0.05, 0.11, 0.55)
  ]);

  const islandSeats = maxOf([
    ellipse(u, v, 0.18, 0.68, 0.034, 0.060, -0.16),
    ellipse(u, v, 0.23, 0.72, 0.030, 0.052, 0.45),
    ellipse(u, v, 0.37, 0.25, 0.025, 0.018, 0.10),
    ellipse(u, v, 0.41, 0.23, 0.018, 0.013, -0.25)
  ]);

  const base = maxOf([mainland, easternBody, islandSeats]);
  const coastlineBreak = (fbm(u + 0.013, v - 0.027, 1011) - 0.5) * 0.150;
  const reliefBreak = (ridged(u - 0.041, v + 0.062, 2027) - 0.5) * 0.074;

  return base + coastlineBreak + reliefBreak;
}

function classify(u, v) {
  const field = audraliaField(u, v);
  const isLand = field > 0;
  const coast = 1 - clamp(Math.abs(field) * 19, 0, 1);
  const shelf = smoothstep(-0.18, 0.025, field);
  const broad = fbm(u + 0.117, v + 0.039, 307);
  const micro = fbm(u - 0.082, v + 0.051, 907);
  const ridge = ridged(u + 0.021, v - 0.015, 1409);
  const seam = ridged(u * 1.7 + 0.03, v * 1.4 - 0.08, 6113);
  const mineral = noise(u + 0.42, v - 0.18, 72, 9207);
  const elevation = clamp(field * 1.25 + ridge * 0.58 + (broad - 0.5) * 0.22, 0, 1);

  const island =
    ellipse(u, v, 0.18, 0.68, 0.034, 0.060, -0.16) > -0.02 ||
    ellipse(u, v, 0.23, 0.72, 0.030, 0.052, 0.45) > -0.02 ||
    ellipse(u, v, 0.37, 0.25, 0.025, 0.018, 0.10) > -0.02 ||
    ellipse(u, v, 0.41, 0.23, 0.018, 0.013, -0.25) > -0.02;

  return {
    field,
    isLand,
    coast,
    shelf,
    broad,
    micro,
    ridge,
    seam,
    mineral,
    elevation,
    mountain: isLand ? smoothstep(0.45, 0.94, elevation) : 0,
    beach: isLand ? smoothstep(0.05, 0.0, Math.abs(field)) * coast : 0,
    shelfWater: !isLand ? shelf : 0,
    deepOcean: !isLand ? 1 - shelf : 0,
    coastline: smoothstep(0.0, 0.85, coast),
    island
  };
}

function sampleAudraliaAsset(u, v) {
  const c = classify(u, v);

  if (!c.isLand) {
    let color = mixColor(MATERIAL.deepOcean, MATERIAL.ocean, clamp(0.26 + c.micro * 0.58, 0, 1));
    color = mixColor(color, MATERIAL.shelf, c.shelfWater * 0.95);
    color = mixColor(color, MATERIAL.coast, c.coastline * c.shelfWater * 0.42);
    color = addColor(color, (fbm(u * 0.92 + 0.13, v * 0.88 - 0.05, 4441) - 0.5) * 7 - c.deepOcean * 4);

    return {
      color,
      channels: {
        deepOcean: c.deepOcean,
        shelfWater: c.shelfWater,
        coastline: c.coastline,
        landBody: 0,
        ridge: 0,
        mineral: 0,
        beach: 0,
        island: 0,
        plasma: 0.18
      }
    };
  }

  let color = mixColor(MATERIAL.beach, MATERIAL.lowland, smoothstep(0.03, 0.24, c.field));
  color = mixColor(color, MATERIAL.upland, smoothstep(0.18, 0.56, c.elevation) * 0.56);
  color = mixColor(color, MATERIAL.ridge, c.mountain * 0.35);
  color = mixColor(color, MATERIAL.slate, c.mountain * c.ridge * 0.34);
  color = mixColor(color, MATERIAL.granite, c.mountain * smoothstep(0.55, 0.9, c.ridge) * 0.30);
  color = mixColor(color, MATERIAL.marble, c.mountain * smoothstep(0.78, 0.98, c.ridge) * 0.22);

  const copperSeam = smoothstep(0.86, 0.98, c.mineral) * smoothstep(0.42, 0.95, c.seam);
  const goldSeam = smoothstep(0.93, 0.994, c.mineral) * smoothstep(0.58, 0.99, c.seam);
  const opalSeat = smoothstep(0.965, 0.999, noise(u - 0.11, v + 0.17, 96, 3331));

  color = mixColor(color, MATERIAL.copper, copperSeam * 0.22);
  color = mixColor(color, MATERIAL.gold, goldSeam * 0.28);
  color = mixColor(color, MATERIAL.opal, opalSeat * 0.20);
  color = mixColor(color, MATERIAL.beach, c.beach * 0.72);
  color = addColor(color, c.coast * 8 + (c.micro - 0.5) * 12);

  if (c.island) color = addColor(mixColor(color, MATERIAL.beach, 0.16), 6);

  return {
    color,
    channels: {
      deepOcean: 0,
      shelfWater: 0,
      coastline: c.coastline,
      landBody: 1,
      ridge: c.mountain,
      mineral: Math.max(copperSeam, goldSeam, opalSeat * 0.45),
      beach: c.beach,
      island: c.island ? 1 : 0,
      plasma: 0.20
    }
  };
}

function createAudraliaAssetTexture(options = {}) {
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
      const result = sampleAudraliaAsset(u, v);
      const i = (y * width + x) * 4;

      data[i] = result.color[0];
      data[i + 1] = result.color[1];
      data[i + 2] = result.color[2];
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  canvas.dataset.audraliaAssetsContract = CONTRACT;
  canvas.dataset.audraliaAssetsReceipt = RECEIPT;
  canvas.dataset.audraliaAssetsBoundaryExpression = "true";
  canvas.dataset.audraliaAssetsAbsorbAuthority = "false";

  return canvas;
}

function getAudraliaAssetsStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    authority: "asset-boundary-expression",
    absorbsAuthority: false,
    verbs: ["bind", "separate", "define", "carry", "express"],
    channels: [
      "deepOcean",
      "shelfWater",
      "coastline",
      "landBody",
      "ridge",
      "mineral",
      "beach",
      "island",
      "plasma"
    ],
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const AUDRALIA_ASSETS_STATUS = getAudraliaAssetsStatus();
const AUDRALIA_ASSETS_RECEIPT_VALUE = RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_ASSETS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    material: MATERIAL,
    sample: sampleAudraliaAsset,
    classify,
    createTextureCanvas: createAudraliaAssetTexture,
    createAudraliaAssetTexture,
    getStatus: getAudraliaAssetsStatus
  });

  window.__AUDRALIA_ASSETS_STATUS__ = AUDRALIA_ASSETS_STATUS;

  document.documentElement.dataset.audraliaAssetsLoaded = "true";
  document.documentElement.dataset.audraliaAssetsContract = CONTRACT;
  document.documentElement.dataset.audraliaAssetsReceipt = RECEIPT;
  document.documentElement.dataset.audraliaAssetsBoundaryExpression = "true";
  document.documentElement.dataset.audraliaAssetsAbsorbAuthority = "false";
}

export {
  CONTRACT,
  RECEIPT,
  VERSION,
  MATERIAL,
  AUDRALIA_ASSETS_STATUS,
  AUDRALIA_ASSETS_RECEIPT_VALUE,
  classify,
  sampleAudraliaAsset,
  createAudraliaAssetTexture,
  getAudraliaAssetsStatus
};

export default Object.freeze({
  contract: CONTRACT,
  receipt: RECEIPT,
  material: MATERIAL,
  sample: sampleAudraliaAsset,
  classify,
  createTextureCanvas: createAudraliaAssetTexture,
  createAudraliaAssetTexture,
  getStatus: getAudraliaAssetsStatus
});
