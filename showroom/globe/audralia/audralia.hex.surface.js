// /showroom/globe/audralia/audralia.hex.surface.js
// AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1
//
// Active renewal:
// - AUDRALIA_G8_HEX_CHILD_REMOVE_STALE_DEEP_OCEAN_BLOB_LOGIC_TNT_v1
//
// Role:
// - Child renderer for Audralia showroom globe route.
// - Owns hexagonal surface sampling and square-block artifact reduction.
// - Consumes only the parent-provided runtime texture and sphere state.
// - Does not import DeepOcean.
// - Does not classify Ocean / DeepOcean / shelf water at route level.
// - Does not recolor water classes.
// - Does not import runtime.
// - Does not create land.
// - Does not create water.
// - Does not mutate topology, terrain, hydration, climate, ecology, runtime, or route authority.
//
// Hard locks:
// - No runtime import.
// - No DeepOcean showroom import.
// - No route boot ownership.
// - No land generation.
// - No water generation.
// - No topology rewrite.
// - No terrain rewrite.
// - No hydration rewrite.
// - No climate rewrite.
// - No ecology.
// - No foliage.
// - No trees.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_G8_HEX_CHILD_REMOVE_STALE_DEEP_OCEAN_BLOB_LOGIC_TNT_v1";
const PARENT_RECEIPT = "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1";

const REMOVED_STALE_RECEIPTS = Object.freeze([
  "AUDRALIA_G8_HEX_CHILD_DEEP_OCEAN_SEPARATION_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_FEATHERED_DEPTH_BLEND_TNT_v1"
]);

const DEFAULTS = Object.freeze({
  minSize: 320,
  maxSize: 720,
  radiusRatio: 0.405,
  hexDensity: 196,
  minHexRadius: 1.9,
  maxHexRadius: 4.8,
  edgeDarkening: 0.052,
  seamSoftening: 0.070,
  textureOnlyBlend: 1,
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

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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

function isLandColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r >= 92 && r >= g * 0.86 && r > b * 1.08;
}

function isWaterColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return b > r * 1.02 && g > r * 0.66 && !isLandColor(color);
}

function isShelfLikeColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return isWaterColor(color) && g > 82 && b > 98 && Math.abs(g - b) < 96;
}

function isIceOrHighlightColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r > 185 && g > 185 && b > 185;
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
      const shade = clamp(edgeShadow * hemisphereShade, 0.44, 1.12);

      const localX = xRaw - center.x;
      const localY = yRaw - center.y;
      const edge = smoothstep(0.76, 0.99, hexDistance(localX, localY, hexRadius));

      indices[i] = (py * size + px) * 4;
      lonOffsets[i] = lonOffset;
      vCoords[i] = v;
      shades[i] = shade;
      edgeFactors[i] = edge;

      i += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    model: "hexagonal-orthographic-texture-only-surface-sampling",
    size,
    radius,
    hexRadius,
    count,
    indices,
    lonOffsets,
    vCoords,
    shades,
    edgeFactors
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

  highlight.addColorStop(0, "rgba(255,255,255,0.15)");
  highlight.addColorStop(0.32, "rgba(255,255,255,0.04)");
  highlight.addColorStop(0.74, "rgba(0,0,0,0.10)");
  highlight.addColorStop(1, "rgba(0,0,0,0.42)");

  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const edge = ctx.createRadialGradient(cx, cy, radius * 0.68, cx, cy, radius);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(0.78, "rgba(8,23,44,0.15)");
  edge.addColorStop(1, "rgba(4,10,20,0.56)");

  ctx.fillStyle = edge;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(190,226,255,0.28)";
  ctx.lineWidth = Math.max(1, size * 0.003);
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
    textureOnlyBlend: 1,
    lightX: Number(options.lightX) || DEFAULTS.lightX,
    lightY: Number(options.lightY) || DEFAULTS.lightY,
    lightZ: Number(options.lightZ) || DEFAULTS.lightZ
  });
}

function applyTextureOnlyHexShade(color, shade, edge, options) {
  const edgeShade = clamp(
    1 - edge * options.edgeDarkening + (1 - edge) * options.seamSoftening,
    0.72,
    1.08
  );

  const finalShade = clamp(shade * edgeShade, 0.48, 1.14);

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

  if (!state.hexGeometry || state.hexGeometry.size !== size) {
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

  for (let i = 0; i < geometry.count; i += 1) {
    const out = geometry.indices[i];
    const u = wrap01((Number(state.phase) || 0) + geometry.lonOffsets[i]);
    const v = geometry.vCoords[i];

    const rawColor = sampleTexture(state.texture, u, v);
    const color = applyTextureOnlyHexShade(
      rawColor,
      geometry.shades[i],
      geometry.edgeFactors[i],
      config
    );

    if (isLandColor(rawColor)) landPixels += 1;
    if (isWaterColor(rawColor)) waterPixels += 1;
    if (isShelfLikeColor(rawColor)) shelfLikePixels += 1;
    if (isIceOrHighlightColor(rawColor)) iceOrHighlightPixels += 1;

    sampledPixels += 1;

    data[out] = color[0];
    data[out + 1] = color[1];
    data[out + 2] = color[2];
    data[out + 3] = color[3];
  }

  state.ctx.putImageData(output, 0, 0);
  drawAtmosphere(state.ctx, size, config);

  state.canvas.dataset.hexSurfaceChild = RECEIPT;
  state.canvas.dataset.hexSurfaceActiveRenewal = ACTIVE_RENEWAL;
  state.canvas.dataset.hexSurfaceParentReceipt = PARENT_RECEIPT;
  state.canvas.dataset.hexSurfaceModel = "hexagonal-orthographic-texture-only-surface-sampling";
  state.canvas.dataset.hexRadius = geometry.hexRadius.toFixed(3);
  state.canvas.dataset.hexSamples = String(geometry.count);
  state.canvas.dataset.sampledPixels = String(sampledPixels);
  state.canvas.dataset.landPixels = String(landPixels);
  state.canvas.dataset.waterPixels = String(waterPixels);
  state.canvas.dataset.shelfLikePixels = String(shelfLikePixels);
  state.canvas.dataset.iceOrHighlightPixels = String(iceOrHighlightPixels);
  state.canvas.dataset.squareBlockArtifactReduction = "active";
  state.canvas.dataset.textureOnlySampling = "true";
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
    parentReceipt: PARENT_RECEIPT,
    removedStaleReceipts: REMOVED_STALE_RECEIPTS,
    ok: true,
    model: "hexagonal-orthographic-texture-only-surface-sampling",
    size,
    hexRadius: geometry.hexRadius,
    samples: geometry.count,
    sampledPixels,
    landPixels,
    waterPixels,
    shelfLikePixels,
    iceOrHighlightPixels,
    squareBlockArtifactReduction: true,
    textureOnlySampling: true,
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
    parentReceipt: PARENT_RECEIPT,
    removedStaleReceipts: REMOVED_STALE_RECEIPTS,
    role: "route-child-texture-only-hex-renderer",
    owns: Object.freeze([
      "hexagonal_surface_sampling",
      "square_block_artifact_reduction",
      "canvas_frame_paint_strategy",
      "sphere_shading",
      "atmospheric_rim"
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
  parentReceipt: PARENT_RECEIPT,
  removedStaleReceipts: REMOVED_STALE_RECEIPTS,
  drawAudraliaHexSurfaceFrame,
  getAudraliaHexSurfaceStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaHexSurfaceRenderer = api;
}

export default api;
