// /assets/audralia/audralia.hex.surface.js
// AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1
// Active renewal: AUDRALIA_G9_HEX_CHILD_4K_MICRO_SURFACE_GLAZE_TNT_v1

const RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_G9_HEX_CHILD_4K_MICRO_SURFACE_GLAZE_TNT_v1";
const COMPATIBILITY_RENEWAL = "AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1";
const PARENT_RECEIPT = "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1";

const REMOVED_STALE_RECEIPTS = Object.freeze([
  "AUDRALIA_G8_HEX_CHILD_DEEP_OCEAN_SEPARATION_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_FEATHERED_DEPTH_BLEND_TNT_v1"
]);

const DEFAULTS = Object.freeze({
  minSize: 320,
  maxSize: 860,
  radiusRatio: 0.405,
  hexDensity: 236,
  minHexRadius: 1.35,
  maxHexRadius: 3.85,
  edgeDarkening: 0.036,
  seamSoftening: 0.052,
  globalGlazeStrength: 0.96,
  landGlazeOpacity: 0.092,
  waterGlazeOpacity: 0.176,
  shelfGlazeOpacity: 0.255,
  iceGlazeOpacity: 0.044,
  terrainRecovery: 0.46,
  microTerrainStrength: 0.24,
  coastlineSparkleStrength: 0.15,
  opalRefractionStrength: 0.12,
  diamondGlintStrength: 0.08,
  lightX: -0.42,
  lightY: 0.36,
  lightZ: 0.83
});

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed, octaves) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.000001, normalizer);
}

function cubeRound(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

function nearestHexCenter(xPx, yPx, hexRadius) {
  const q = (Math.sqrt(3) / 3 * xPx - 1 / 3 * yPx) / hexRadius;
  const r = (2 / 3 * yPx) / hexRadius;
  const rounded = cubeRound(q, r);

  return {
    x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
    y: hexRadius * 1.5 * rounded.r
  };
}

function hexDistance(localX, localY, hexRadius) {
  const q = (Math.sqrt(3) / 3 * localX - 1 / 3 * localY) / hexRadius;
  const r = (2 / 3 * localY) / hexRadius;
  const s = -q - r;

  return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
}

function sampleTexture(texture, u, v) {
  const width = texture && texture.width ? texture.width : 1;
  const height = texture && texture.height ? texture.height : 1;
  const data = texture && texture.data ? texture.data : null;

  if (!data) return [12, 66, 124, 255];

  const tx = Math.floor(wrap01(u) * (width - 1));
  const ty = Math.floor(clamp(v, 0, 1) * (height - 1));
  const index = (ty * width + tx) * 4;

  return [
    data[index] || 0,
    data[index + 1] || 0,
    data[index + 2] || 0,
    data[index + 3] === undefined ? 255 : data[index + 3]
  ];
}

function sampleTextureBilinear(texture, u, v) {
  const width = texture && texture.width ? texture.width : 1;
  const height = texture && texture.height ? texture.height : 1;
  const data = texture && texture.data ? texture.data : null;

  if (!data || width < 2 || height < 2) return sampleTexture(texture, u, v);

  const x = wrap01(u) * (width - 1);
  const y = clamp(v, 0, 1) * (height - 1);

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % width;
  const y1 = Math.min(height - 1, y0 + 1);

  const tx = x - x0;
  const ty = y - y0;

  const i00 = (y0 * width + x0) * 4;
  const i10 = (y0 * width + x1) * 4;
  const i01 = (y1 * width + x0) * 4;
  const i11 = (y1 * width + x1) * 4;

  const c00 = [data[i00] || 0, data[i00 + 1] || 0, data[i00 + 2] || 0, data[i00 + 3] === undefined ? 255 : data[i00 + 3]];
  const c10 = [data[i10] || 0, data[i10 + 1] || 0, data[i10 + 2] || 0, data[i10 + 3] === undefined ? 255 : data[i10 + 3]];
  const c01 = [data[i01] || 0, data[i01 + 1] || 0, data[i01 + 2] || 0, data[i01 + 3] === undefined ? 255 : data[i01 + 3]];
  const c11 = [data[i11] || 0, data[i11 + 1] || 0, data[i11 + 2] || 0, data[i11 + 3] === undefined ? 255 : data[i11 + 3]];

  return [
    clamp(Math.round(mix(mix(c00[0], c10[0], tx), mix(c01[0], c11[0], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[1], c10[1], tx), mix(c01[1], c11[1], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[2], c10[2], tx), mix(c01[2], c11[2], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[3], c10[3], tx), mix(c01[3], c11[3], tx), ty)), 0, 255)
  ];
}

function mixColor(base, overlay, amount) {
  const t = clamp(amount, 0, 1);

  return [
    clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
    clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
    clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
    base[3] === undefined ? 255 : base[3]
  ];
}

function multiplyColor(color, amount) {
  return [
    clamp(Math.round(color[0] * amount), 0, 255),
    clamp(Math.round(color[1] * amount), 0, 255),
    clamp(Math.round(color[2] * amount), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function colorLuma(color) {
  return (
    (Number(color[0]) || 0) * 0.2126 +
    (Number(color[1]) || 0) * 0.7152 +
    (Number(color[2]) || 0) * 0.0722
  ) / 255;
}

function chroma(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  return (max - min) / 255;
}

function isLandColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r >= 82 && g >= 62 && r >= b * 0.92 && g > b * 0.58;
}

function isWaterColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return b > r * 1.02 && g > r * 0.58 && !isLandColor(color);
}

function isShelfLikeColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return isWaterColor(color) && g > 78 && b > 94 && Math.abs(g - b) < 105;
}

function isIceOrHighlightColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r > 185 && g > 185 && b > 185;
}

function edgeContrast(texture, u, v) {
  const delta = 1 / Math.max(texture && texture.width ? texture.width : 256, texture && texture.height ? texture.height : 256);
  const c = sampleTextureBilinear(texture, u, v);
  const cx = sampleTextureBilinear(texture, u + delta * 2, v);
  const cy = sampleTextureBilinear(texture, u, v + delta * 2);
  const lx = Math.abs(colorLuma(c) - colorLuma(cx));
  const ly = Math.abs(colorLuma(c) - colorLuma(cy));

  return clamp((lx + ly) * 2.3, 0, 1);
}

function classifySurface(rawColor) {
  const land = isLandColor(rawColor);
  const water = isWaterColor(rawColor);
  const shelf = isShelfLikeColor(rawColor);
  const ice = isIceOrHighlightColor(rawColor);
  const luma = colorLuma(rawColor);
  const chromaValue = chroma(rawColor);

  let className = "void";
  if (ice) className = "ice-highlight";
  else if (shelf) className = "shelf-water";
  else if (water) className = "water";
  else if (land && luma > 0.62 && chromaValue < 0.22) className = "stone-highlight";
  else if (land) className = "land";

  return {
    land,
    water,
    shelf,
    ice,
    luma,
    chroma: chromaValue,
    className
  };
}

function applyGlobalAqueousGlaze(rawColor, u, v, options, edgeValue) {
  const surface = classifySurface(rawColor);
  const lon = wrap01(u) * 2 - 1;
  const lat = 1 - clamp(v, 0, 1) * 2;

  const broadGlaze =
    fbm(lon * 5.6 + 2.1, lat * 5.6 - 3.4, 8101, 4) * 0.50 +
    fbm(lon * 18.0 - 7.1, lat * 13.0 + 4.8, 8123, 3) * 0.24 +
    fbm(lon * 41.0 + 1.9, lat * 29.0 - 8.2, 8153, 2) * 0.10;

  const microMineral =
    fbm(lon * 88.0 + 5.3, lat * 74.0 - 2.7, 9013, 3) * 0.54 +
    fbm(lon * 151.0 - 1.8, lat * 126.0 + 8.9, 9029, 2) * 0.46;

  const sphericalVariation = clamp(0.82 + (broadGlaze - 0.5) * 0.24, 0.72, 1.10);

  const baseAqua = [38, 166, 204, rawColor[3]];
  const turquoise = [58, 205, 211, rawColor[3]];
  const oceanBlue = [18, 102, 178, rawColor[3]];
  const softSkyWater = [84, 188, 216, rawColor[3]];
  const opalSheen = [184, 235, 222, rawColor[3]];
  const diamondSheen = [238, 248, 255, rawColor[3]];
  const slateShadow = [58, 72, 82, rawColor[3]];

  let glazeColor = baseAqua;
  let opacity = options.landGlazeOpacity;

  if (surface.shelf) {
    glazeColor = turquoise;
    opacity = options.shelfGlazeOpacity;
  } else if (surface.water) {
    glazeColor = oceanBlue;
    opacity = options.waterGlazeOpacity;
  } else if (surface.ice) {
    glazeColor = softSkyWater;
    opacity = options.iceGlazeOpacity;
  } else if (surface.land) {
    glazeColor = baseAqua;
    opacity = options.landGlazeOpacity;
  }

  const globalMinimum = 0.045;
  const effectiveOpacity = clamp(
    Math.max(globalMinimum, opacity) *
      sphericalVariation *
      options.globalGlazeStrength,
    0,
    surface.shelf ? 0.31 : surface.water ? 0.24 : surface.land ? 0.145 : 0.11
  );

  let color = mixColor(rawColor, glazeColor, effectiveOpacity);

  if (surface.land) {
    const terrainRecover = clamp(options.terrainRecovery + edgeValue * 0.12, 0.22, 0.62);
    color = mixColor(color, rawColor, terrainRecover);

    const mineralLift = clamp((microMineral - 0.52) * options.microTerrainStrength, -0.075, 0.090);

    if (mineralLift > 0) {
      color = mixColor(color, surface.luma > 0.56 ? diamondSheen : opalSheen, mineralLift);
    } else {
      color = mixColor(color, slateShadow, Math.abs(mineralLift) * 0.72);
    }
  }

  if (surface.shelf) {
    color = mixColor(color, turquoise, clamp(0.042 + broadGlaze * 0.045 + edgeValue * 0.08, 0.04, 0.15));
  }

  if (surface.water) {
    const deepVariation = clamp((microMineral - 0.48) * 0.055, -0.035, 0.045);
    color = multiplyColor(color, 1 + deepVariation);
  }

  if (surface.ice) {
    color = mixColor(color, diamondSheen, clamp(0.08 + microMineral * 0.05, 0.06, 0.14));
  }

  return color;
}

function buildHexGeometry(size, options = {}) {
  const radius = size * (Number(options.radiusRatio) || DEFAULTS.radiusRatio);
  const cx = size / 2;
  const cy = size / 2;

  const hexRadius = clamp(
    size / (Number(options.hexDensity) || DEFAULTS.hexDensity),
    Number(options.minHexRadius) || DEFAULTS.minHexRadius,
    Number(options.maxHexRadius) || DEFAULTS.maxHexRadius
  );

  let count = 0;

  for (let py = 0; py < size; py += 1) {
    const y = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const x = (px + 0.5 - cx) / radius;
      if (x * x + y * y <= 1) count += 1;
    }
  }

  const indices = new Uint32Array(count);
  const lonOffsets = new Float32Array(count);
  const vCoords = new Float32Array(count);
  const shades = new Float32Array(count);
  const edgeFactors = new Float32Array(count);
  const microSeeds = new Float32Array(count);
  const sphericalDepths = new Float32Array(count);

  const lightX = Number(options.lightX) || DEFAULTS.lightX;
  const lightY = Number(options.lightY) || DEFAULTS.lightY;
  const lightZ = Number(options.lightZ) || DEFAULTS.lightZ;

  let i = 0;

  for (let py = 0; py < size; py += 1) {
    const yRaw = py + 0.5 - cy;
    const y = yRaw / radius;

    for (let px = 0; px < size; px += 1) {
      const xRaw = px + 0.5 - cx;
      const x = xRaw / radius;
      const r2 = x * x + y * y;

      if (r2 > 1) continue;

      const center = nearestHexCenter(xRaw, yRaw, hexRadius);

      let hx = center.x / radius;
      let hy = center.y / radius;
      let hr2 = hx * hx + hy * hy;

      if (hr2 > 0.999) {
        const scale = 0.999 / Math.sqrt(hr2);
        hx *= scale;
        hy *= scale;
        hr2 = hx * hx + hy * hy;
      }

      const z = Math.sqrt(Math.max(0, 1 - hr2));
      const lonOffset = Math.atan2(hx, z) / (Math.PI * 2);
      const latitude = Math.asin(clamp(-hy, -1, 1));
      const v = clamp(0.5 - latitude / Math.PI, 0, 1);

      const dot = clamp(hx * lightX + (-hy) * lightY + z * lightZ, -1, 1);
      const edgeShadow = clamp(1 - Math.pow(r2, 1.7) * 0.34, 0.52, 1);
      const hemisphereShade = clamp(0.70 + dot * 0.32, 0.46, 1.10);
      const depthRim = clamp(0.62 + z * 0.42, 0.52, 1.08);
      const shade = clamp(edgeShadow * hemisphereShade * depthRim, 0.42, 1.15);

      const localX = xRaw - center.x;
      const localY = yRaw - center.y;
      const edge = smoothstep(0.78, 1.02, hexDistance(localX, localY, hexRadius));

      indices[i] = (py * size + px) * 4;
      lonOffsets[i] = lonOffset;
      vCoords[i] = v;
      shades[i] = shade;
      edgeFactors[i] = edge;
      microSeeds[i] = hash2(px, py, 1709);
      sphericalDepths[i] = z;

      i += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    model: "hexagonal-orthographic-4k-micro-surface-global-aqueous-glaze",
    size,
    radius,
    hexRadius,
    count,
    indices,
    lonOffsets,
    vCoords,
    shades,
    edgeFactors,
    microSeeds,
    sphericalDepths
  });
}

function drawAtmosphere(ctx, size, options = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * (Number(options.radiusRatio) || DEFAULTS.radiusRatio);

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.36,
    radius * 0.02,
    cx,
    cy,
    radius * 1.16
  );

  highlight.addColorStop(0, "rgba(255,255,255,0.17)");
  highlight.addColorStop(0.28, "rgba(255,255,255,0.052)");
  highlight.addColorStop(0.72, "rgba(0,0,0,0.10)");
  highlight.addColorStop(1, "rgba(0,0,0,0.45)");

  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const edge = ctx.createRadialGradient(cx, cy, radius * 0.66, cx, cy, radius);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(0.78, "rgba(8,23,44,0.17)");
  edge.addColorStop(1, "rgba(4,10,20,0.60)");

  ctx.fillStyle = edge;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(190,226,255,0.30)";
  ctx.lineWidth = Math.max(1, size * 0.003);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(108,185,232,0.10)";
  ctx.lineWidth = Math.max(1, size * 0.006);
  ctx.stroke();
  ctx.restore();
}

function normalizeOptions(options = {}) {
  return Object.freeze({
    radiusRatio: Number(options.radiusRatio) || DEFAULTS.radiusRatio,
    hexDensity: Number(options.hexDensity) || DEFAULTS.hexDensity,
    minHexRadius: Number(options.minHexRadius) || DEFAULTS.minHexRadius,
    maxHexRadius: Number(options.maxHexRadius) || DEFAULTS.maxHexRadius,
    edgeDarkening: clamp(Number(options.edgeDarkening) || DEFAULTS.edgeDarkening, 0, 0.18),
    seamSoftening: clamp(Number(options.seamSoftening) || DEFAULTS.seamSoftening, 0, 0.18),
    globalGlazeStrength: clamp(
      options.globalGlazeStrength === undefined ? DEFAULTS.globalGlazeStrength : Number(options.globalGlazeStrength),
      0,
      1.4
    ),
    landGlazeOpacity: clamp(Number(options.landGlazeOpacity) || DEFAULTS.landGlazeOpacity, 0, 0.24),
    waterGlazeOpacity: clamp(Number(options.waterGlazeOpacity) || DEFAULTS.waterGlazeOpacity, 0, 0.34),
    shelfGlazeOpacity: clamp(Number(options.shelfGlazeOpacity) || DEFAULTS.shelfGlazeOpacity, 0, 0.42),
    iceGlazeOpacity: clamp(Number(options.iceGlazeOpacity) || DEFAULTS.iceGlazeOpacity, 0, 0.14),
    terrainRecovery: clamp(Number(options.terrainRecovery) || DEFAULTS.terrainRecovery, 0, 0.70),
    microTerrainStrength: clamp(Number(options.microTerrainStrength) || DEFAULTS.microTerrainStrength, 0, 0.44),
    coastlineSparkleStrength: clamp(Number(options.coastlineSparkleStrength) || DEFAULTS.coastlineSparkleStrength, 0, 0.30),
    opalRefractionStrength: clamp(Number(options.opalRefractionStrength) || DEFAULTS.opalRefractionStrength, 0, 0.28),
    diamondGlintStrength: clamp(Number(options.diamondGlintStrength) || DEFAULTS.diamondGlintStrength, 0, 0.24),
    lightX: Number(options.lightX) || DEFAULTS.lightX,
    lightY: Number(options.lightY) || DEFAULTS.lightY,
    lightZ: Number(options.lightZ) || DEFAULTS.lightZ
  });
}

function applyTextureOnlyHexShade(color, shade, edge, microSeed, zDepth, options) {
  const edgeShade = clamp(
    1 - edge * options.edgeDarkening + (1 - edge) * options.seamSoftening,
    0.74,
    1.08
  );

  const micro = clamp(0.965 + (microSeed - 0.5) * 0.044 + zDepth * 0.025, 0.92, 1.055);
  const finalShade = clamp(shade * edgeShade * micro, 0.48, 1.16);

  return [
    clamp(Math.round(color[0] * finalShade), 0, 255),
    clamp(Math.round(color[1] * finalShade), 0, 255),
    clamp(Math.round(color[2] * finalShade), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

export function drawAudraliaHexSurfaceFrame(state, options = {}) {
  if (!state || !state.canvas || !state.ctx || !state.texture) {
    throw new Error("AUDRALIA_HEX_SURFACE_MISSING_STATE");
  }

  const size = Number(state.canvas.width) || 0;

  if (!size) {
    throw new Error("AUDRALIA_HEX_SURFACE_MISSING_CANVAS_SIZE");
  }

  const config = normalizeOptions(options);

  if (!state.hexGeometry || state.hexGeometry.size !== size || state.hexGeometry.activeRenewal !== ACTIVE_RENEWAL) {
    state.hexGeometry = buildHexGeometry(size, config);
  }

  const geometry = state.hexGeometry;
  const output = state.ctx.createImageData(size, size);
  const data = output.data;

  let sampledPixels = 0;
  let landPixels = 0;
  let waterPixels = 0;
  let shelfLikePixels = 0;
  let iceOrHighlightPixels = 0;
  let glazedPixels = 0;
  let microDetailPixels = 0;
  let coastlineDetailPixels = 0;
  let opalRefractionPixels = 0;
  let diamondGlintPixels = 0;

  for (let i = 0; i < geometry.count; i += 1) {
    const out = geometry.indices[i];
    const u = wrap01((Number(state.phase) || 0) + geometry.lonOffsets[i]);
    const v = geometry.vCoords[i];
    const rawColor = sampleTextureBilinear(state.texture, u, v);
    const edgeValue = edgeContrast(state.texture, u, v);
    const surface = classifySurface(rawColor);

    let glazedColor = applyGlobalAqueousGlaze(rawColor, u, v, config, edgeValue);

    if (surface.land && edgeValue > 0.10) {
      coastlineDetailPixels += 1;
      glazedColor = mixColor(glazedColor, [246, 224, 170, rawColor[3]], clamp(edgeValue * config.coastlineSparkleStrength, 0, 0.16));
    }

    if (surface.land && surface.luma > 0.45 && geometry.microSeeds[i] > 0.78) {
      opalRefractionPixels += 1;
      glazedColor = mixColor(glazedColor, [184, 235, 222, rawColor[3]], clamp(config.opalRefractionStrength * geometry.microSeeds[i], 0, 0.18));
    }

    if ((surface.ice || surface.luma > 0.58) && geometry.microSeeds[i] > 0.91) {
      diamondGlintPixels += 1;
      glazedColor = mixColor(glazedColor, [246, 252, 255, rawColor[3]], clamp(config.diamondGlintStrength * geometry.microSeeds[i], 0, 0.16));
    }

    if (geometry.microSeeds[i] > 0.52) {
      microDetailPixels += 1;
    }

    const color = applyTextureOnlyHexShade(
      glazedColor,
      geometry.shades[i],
      geometry.edgeFactors[i],
      geometry.microSeeds[i],
      geometry.sphericalDepths[i],
      config
    );

    if (surface.land) landPixels += 1;
    if (surface.water) waterPixels += 1;
    if (surface.shelf) shelfLikePixels += 1;
    if (surface.ice) iceOrHighlightPixels += 1;

    sampledPixels += 1;
    glazedPixels += 1;

    data[out] = color[0];
    data[out + 1] = color[1];
    data[out + 2] = color[2];
    data[out + 3] = color[3];
  }

  state.ctx.putImageData(output, 0, 0);
  drawAtmosphere(state.ctx, size, config);

  state.canvas.dataset.hexSurfaceChild = RECEIPT;
  state.canvas.dataset.hexSurfaceActiveRenewal = ACTIVE_RENEWAL;
  state.canvas.dataset.hexSurfaceCompatibilityRenewal = COMPATIBILITY_RENEWAL;
  state.canvas.dataset.hexSurfaceParentReceipt = PARENT_RECEIPT;
  state.canvas.dataset.hexSurfaceModel = "hexagonal-orthographic-4k-micro-surface-global-aqueous-glaze";
  state.canvas.dataset.hexRadius = geometry.hexRadius.toFixed(3);
  state.canvas.dataset.hexSamples = String(geometry.count);
  state.canvas.dataset.sampledPixels = String(sampledPixels);
  state.canvas.dataset.landPixels = String(landPixels);
  state.canvas.dataset.waterPixels = String(waterPixels);
  state.canvas.dataset.shelfLikePixels = String(shelfLikePixels);
  state.canvas.dataset.iceOrHighlightPixels = String(iceOrHighlightPixels);
  state.canvas.dataset.glazedPixels = String(glazedPixels);
  state.canvas.dataset.microDetailPixels = String(microDetailPixels);
  state.canvas.dataset.coastlineDetailPixels = String(coastlineDetailPixels);
  state.canvas.dataset.opalRefractionPixels = String(opalRefractionPixels);
  state.canvas.dataset.diamondGlintPixels = String(diamondGlintPixels);
  state.canvas.dataset.squareBlockArtifactReduction = "active";
  state.canvas.dataset.textureOnlySampling = "true";
  state.canvas.dataset.globalAqueousGlaze = "active";
  state.canvas.dataset.globalAqueousGlazeLayer = "low-opacity-blue-turquoise-over-existing-surface";
  state.canvas.dataset.landGlazePreservation = "active";
  state.canvas.dataset.terrainContrastProtection = "active";
  state.canvas.dataset.fourKMicroSurface = "active";
  state.canvas.dataset.coastlineSparkle = "active";
  state.canvas.dataset.opalRefraction = "active";
  state.canvas.dataset.diamondGlint = "active";
  state.canvas.dataset.staleDeepOceanBlobLogicRemoved = "true";
  state.canvas.dataset.deepOceanShowroomImport = "removed";
  state.canvas.dataset.deepOceanRouteOverlay = "removed";
  state.canvas.dataset.oceanSeparation = "removed";
  state.canvas.dataset.deepOceanSeparation = "removed";
  state.canvas.dataset.shelfOceanSeparation = "removed";
  state.canvas.dataset.routeOwnedLandGeneration = "forbidden";
  state.canvas.dataset.routeOwnedWaterGeneration = "forbidden";
  state.canvas.dataset.runtimeImport = "forbidden";
  state.canvas.dataset.graphicBox = "false";
  state.canvas.dataset.imageGeneration = "false";
  state.canvas.dataset.visualPassClaimed = "false";

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    parentReceipt: PARENT_RECEIPT,
    removedStaleReceipts: REMOVED_STALE_RECEIPTS,
    ok: true,
    model: "hexagonal-orthographic-4k-micro-surface-global-aqueous-glaze",
    size,
    hexRadius: geometry.hexRadius,
    samples: geometry.count,
    sampledPixels,
    landPixels,
    waterPixels,
    shelfLikePixels,
    iceOrHighlightPixels,
    glazedPixels,
    microDetailPixels,
    coastlineDetailPixels,
    opalRefractionPixels,
    diamondGlintPixels,
    squareBlockArtifactReduction: true,
    textureOnlySampling: true,
    globalAqueousGlaze: true,
    landGlazePreservation: true,
    terrainContrastProtection: true,
    fourKMicroSurface: true,
    staleDeepOceanBlobLogicRemoved: true,
    deepOceanShowroomImport: false,
    deepOceanRouteOverlay: false,
    oceanSeparation: false,
    deepOceanSeparation: false,
    shelfOceanSeparation: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    runtimeImport: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function getAudraliaHexSurfaceStatus(state = null) {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    parentReceipt: PARENT_RECEIPT,
    removedStaleReceipts: REMOVED_STALE_RECEIPTS,
    role: "route-child-4k-micro-surface-global-aqueous-glaze-hex-renderer",
    owns: Object.freeze([
      "hexagonal_surface_sampling",
      "square_block_artifact_reduction",
      "4k_micro_surface_detail",
      "global_aqueous_glaze_layer",
      "land_preserving_blue_turquoise_finish",
      "canvas_frame_paint_strategy",
      "sphere_shading",
      "atmospheric_rim",
      "coastline_sparkle",
      "opal_refraction",
      "diamond_glint"
    ]),
    doesNotOwn: Object.freeze([
      "runtime_import",
      "deep_ocean_route_overlay",
      "ocean_classification",
      "land_generation",
      "water_generation",
      "topology",
      "terrain",
      "hydration",
      "climate",
      "ecology",
      "route_boot"
    ]),
    geometryLoaded: Boolean(state && state.hexGeometry),
    hexRadius: state && state.hexGeometry ? state.hexGeometry.hexRadius : null,
    hexSamples: state && state.hexGeometry ? state.hexGeometry.count : null,
    textureOnlySampling: true,
    globalAqueousGlaze: true,
    fourKMicroSurface: true,
    staleDeepOceanBlobLogicRemoved: true,
    deepOceanShowroomImport: false,
    deepOceanRouteOverlay: false,
    oceanSeparation: false,
    deepOceanSeparation: false,
    shelfOceanSeparation: false,
    runtimeImport: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  compatibilityRenewal: COMPATIBILITY_RENEWAL,
  parentReceipt: PARENT_RECEIPT,
  removedStaleReceipts: REMOVED_STALE_RECEIPTS,
  drawAudraliaHexSurfaceFrame,
  getAudraliaHexSurfaceStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaHexSurfaceRenderer = api;
}

export default api;
