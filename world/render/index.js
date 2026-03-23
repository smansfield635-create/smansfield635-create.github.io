// /world/render/index.js
// MODE: RENDER MASTER FILTER RENEWAL
// STATUS: AUTHORITATIVE SOUTH JUG (PURE) v4
// ROLE:
// - 4-channel master filter only
// - project + draw only
// - NO diagnostics authority
// - NO compensation
// - NO upstream mutation
// - NO semantic invention
// - NO camera authority
// - render preserves coherence through filtration
//
// CHANNELS:
// 1. PSYCHOLOGY
// 2. COSMOS
// 3. TERRAIN
// 4. ATMOSPHERE
//
// NOTES:
// - terrain absorbs elevation + cut internally
// - hydration collapses into atmosphere channel
// - botany/fauna are not top-level peers here
// - all channels are projections of one field

import { WORLD_KERNEL } from "../world_kernel.js";
import { resolveTerrainPacket } from "./terrain/index.js";
import { resolveElevationPacket } from "./terrain/elevation_render_engine.js";
import { resolveCutPacket } from "./terrain/cut_render_engine.js";

// Stub hydration until hydration_render_engine.js is implemented
function resolveHydrationPacket() {
  return null;
}

/* =========================
   UTIL
========================= */

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

function normalizeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function sampleGrid(field) {
  const rows = Array.isArray(field?.samples) ? field.samples : [];
  return Array.isArray(rows[0]) ? rows : [];
}

function getCanvasCssSize(ctx) {
  const canvas = ctx?.canvas;
  if (!canvas) return { width: 0, height: 0 };

  const rect =
    typeof canvas.getBoundingClientRect === "function"
      ? canvas.getBoundingClientRect()
      : null;

  const width =
    (rect?.width > 0 ? rect.width : 0) ||
    (canvas.clientWidth > 0 ? canvas.clientWidth : 0) ||
    (canvas.width > 0 ? canvas.width : 0);

  const height =
    (rect?.height > 0 ? rect.height : 0) ||
    (canvas.clientHeight > 0 ? canvas.clientHeight : 0) ||
    (canvas.height > 0 ? canvas.height : 0);

  return { width, height };
}

function withAlpha(color, alpha) {
  if (typeof color !== "string" || color.length === 0) {
    return `rgba(255,255,255,${clamp(alpha, 0, 1)})`;
  }

  const rgbaMatch = color.match(
    /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${clamp(alpha, 0, 1)})`;
  }

  const rgbMatch = color.match(
    /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${clamp(alpha, 0, 1)})`;
  }

  return color;
}

function parseColor(color) {
  if (typeof color !== "string") return null;

  const rgbaMatch = color.match(
    /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]),
      g: Number(rgbaMatch[2]),
      b: Number(rgbaMatch[3]),
      a: Number(rgbaMatch[4])
    };
  }

  const rgbMatch = color.match(
    /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: 1
    };
  }

  return null;
}

function mixColor(baseColor, overlayColor, t, alphaOverride = null) {
  const a = parseColor(baseColor);
  const b = parseColor(overlayColor);
  const blend = clamp(t, 0, 1);

  if (!a || !b) {
    if (alphaOverride === null) return overlayColor || baseColor || "rgba(255,255,255,1)";
    return withAlpha(overlayColor || baseColor || "rgba(255,255,255,1)", alphaOverride);
  }

  const r = Math.round(a.r + (b.r - a.r) * blend);
  const g = Math.round(a.g + (b.g - a.g) * blend);
  const blue = Math.round(a.b + (b.b - a.b) * blend);
  const alpha =
    alphaOverride === null
      ? clamp(a.a + (b.a - a.a) * blend, 0, 1)
      : clamp(alphaOverride, 0, 1);

  return `rgba(${r},${g},${blue},${alpha})`;
}

function packetRadius(packet, fallback) {
  return isFiniteNumber(packet?.radiusPx) ? packet.radiusPx : fallback;
}

function packetAlpha(packet, fallback = 0) {
  return isFiniteNumber(packet?.alpha) ? packet.alpha : fallback;
}

function packetColor(packet, fallback = "") {
  return typeof packet?.color === "string" && packet.color.length > 0
    ? packet.color
    : fallback;
}

function pointHash(a, b, c = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453123;
  return x - Math.floor(x);
}

function signedPointHash(a, b, c = 0) {
  return pointHash(a, b, c) * 2 - 1;
}

/* =========================
   PROJECTION
========================= */

function getProjectionState(viewState = {}, ctx) {
  const state = normalizeObject(viewState);
  const { width, height } = getCanvasCssSize(ctx);

  return {
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius: isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * (WORLD_KERNEL?.constants?.worldRadiusFactor ?? 0.36)
  };
}

function defaultProjectorFactory(p) {
  return function projectPoint(latDeg, lonDeg, offset = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const r = p.radius + offset;

    const nx = Math.cos(lat) * Math.sin(lon);
    const ny = Math.sin(lat);
    const nz = Math.cos(lat) * Math.cos(lon);

    return {
      x: p.centerX + nx * r,
      y: p.centerY - ny * r,
      z: nz,
      visible: nz >= 0
    };
  };
}

function resolveProjectPoint(projectPoint, projectionState) {
  return typeof projectPoint === "function"
    ? projectPoint
    : defaultProjectorFactory(projectionState);
}

/* =========================
   BASE DRAW
========================= */

function drawBackground(ctx, p) {
  const bg = ctx.createRadialGradient(
    p.centerX,
    p.centerY,
    p.radius * 0.2,
    p.centerX,
    p.centerY,
    Math.max(p.width, p.height) * 0.72
  );

  bg.addColorStop(0, "rgba(18,30,54,0.26)");
  bg.addColorStop(0.45, "rgba(8,14,28,0.16)");
  bg.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, p.width, p.height);
}

function drawPlanet(ctx, p) {
  const g = ctx.createRadialGradient(
    p.centerX - p.radius * 0.18,
    p.centerY - p.radius * 0.22,
    p.radius * 0.08,
    p.centerX,
    p.centerY,
    p.radius
  );

  g.addColorStop(0, "rgb(36,96,176)");
  g.addColorStop(0.52, "rgb(12,42,88)");
  g.addColorStop(1, "rgb(2,10,24)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const limb = ctx.createRadialGradient(
    p.centerX,
    p.centerY,
    p.radius * 0.78,
    p.centerX,
    p.centerY,
    p.radius * 1.08
  );
  limb.addColorStop(0, "rgba(88,164,255,0)");
  limb.addColorStop(0.72, "rgba(88,164,255,0.04)");
  limb.addColorStop(0.9, "rgba(110,190,255,0.16)");
  limb.addColorStop(1, "rgba(110,190,255,0)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius * 1.03, 0, Math.PI * 2);
  ctx.fillStyle = limb;
  ctx.fill();

  const gloss = ctx.createRadialGradient(
    p.centerX - p.radius * 0.24,
    p.centerY - p.radius * 0.26,
    p.radius * 0.04,
    p.centerX - p.radius * 0.24,
    p.centerY - p.radius * 0.26,
    p.radius * 0.52
  );
  gloss.addColorStop(0, "rgba(255,255,255,0.22)");
  gloss.addColorStop(0.24, "rgba(255,255,255,0.08)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = gloss;
  ctx.fillRect(p.centerX - p.radius, p.centerY - p.radius, p.radius * 2, p.radius * 2);
  ctx.restore();
}

/* =========================
   CHANNEL RESOLUTION
========================= */

function resolveTerrainChannel(sample, pointSizePx, grid, x, y, globalPrimitiveTime) {
  const terrainPacket = resolveTerrainPacket?.({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;
  const elevationPacket = resolveElevationPacket?.({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;
  const cutPacket = resolveCutPacket?.({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;

  return Object.freeze({
    terrainPacket,
    elevationPacket,
    cutPacket
  });
}

function resolveAtmosphereChannel(sample, pointSizePx, grid, x, y, globalPrimitiveTime) {
  const hydrationPacket =
    resolveHydrationPacket({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;

  return Object.freeze({
    hydrationPacket
  });
}

function resolveCosmosChannel(sample, pointSizePx) {
  return Object.freeze({
    radiusPx: pointSizePx,
    alpha: 1,
    color: "rgba(96,170,255,0.20)"
  });
}

function resolvePsychologyChannel(sample, pointSizePx) {
  return Object.freeze({
    radiusPx: pointSizePx,
    alpha: 1,
    color: "rgba(255,236,176,0.18)"
  });
}

function resolveChannels(sample, pointSizePx, grid, x, y, globalPrimitiveTime) {
  return Object.freeze({
    psychology: resolvePsychologyChannel(sample, pointSizePx),
    cosmos: resolveCosmosChannel(sample, pointSizePx),
    terrain: resolveTerrainChannel(sample, pointSizePx, grid, x, y, globalPrimitiveTime),
    atmosphere: resolveAtmosphereChannel(sample, pointSizePx, grid, x, y, globalPrimitiveTime)
  });
}

/* =========================
   MASTER FILTER EXPRESSION
========================= */

function classifyPrimitiveShape(sample, x, y) {
  const terrainClass = sample?.terrainClass ?? "NONE";
  const water = sample?.waterMask === 1;
  const shoreline = sample?.shoreline === true || sample?.shorelineBand === true;
  const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const plateau = clamp(sample?.plateauStrength ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);

  if (water) return shoreline ? "capsule" : "diamond";
  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") return "triangle";
  if (terrainClass === "RIDGE" || ridge > 0.22) return "sliver";
  if (terrainClass === "CANYON" || canyon > 0.24) return "slash";
  if (terrainClass === "PLATEAU" || plateau > 0.48) return "square";
  if (terrainClass === "BASIN" || basin > 0.26) return "kite";

  const selector = pointHash(x + 1.7, y + 9.3, ridge + canyon + plateau + basin);
  if (selector < 0.20) return "circle";
  if (selector < 0.38) return "diamond";
  if (selector < 0.56) return "triangle";
  if (selector < 0.74) return "kite";
  if (selector < 0.88) return "sliver";
  return "capsule";
}

function computeFragmentation(sample, x, y, depth) {
  const variation =
    clamp(Math.abs(sample?.curvature ?? 0), 0, 1) * 0.18 +
    clamp(sample?.slope ?? 0, 0, 1) * 0.24 +
    clamp(sample?.canyonStrength ?? 0, 0, 1) * 0.16 +
    clamp(sample?.ridgeStrength ?? 0, 0, 1) * 0.14 +
    clamp(sample?.elevation ?? 0, 0, 1) * 0.10;

  const fieldTension =
    clamp(sample?.continentality ?? 0, 0, 1) * 0.10 +
    clamp(sample?.rainShadowStrength ?? 0, 0, 1) * 0.08 +
    clamp(sample?.plateauStrength ?? 0, 0, 1) * 0.08;

  const localNoise =
    Math.abs(signedPointHash(sample?.latDeg ?? x, sample?.lonDeg ?? y, depth + 11.3)) * 0.16;

  return clamp(0.18 + variation + fieldTension + localNoise, 0, 1);
}

function computeShadowDensity(sample, depth, edgeRatio) {
  const elevation = clamp(sample?.elevation ?? 0, 0, 1);
  const slope = clamp(sample?.slope ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
  const summit = clamp(sample?.strongestSummitScore ?? 0, 0, 1);

  return clamp(
    0.10 +
      elevation * 0.16 +
      slope * 0.20 +
      ridge * 0.16 +
      canyon * 0.14 +
      summit * 0.10 +
      edgeRatio * 0.10 +
      (1 - depth) * 0.08,
    0,
    1
  );
}

function computeHighlightDensity(sample, depth, lightBias) {
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const maritime = clamp(sample?.maritimeInfluence ?? 0, 0, 1);
  const plateau = clamp(sample?.plateauStrength ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const cryo =
    sample?.biomeType === "GLACIER" ||
    sample?.terrainClass === "POLAR_ICE" ||
    sample?.terrainClass === "GLACIAL_HIGHLAND";

  return clamp(
    0.08 +
      depth * 0.12 +
      lightBias * 0.10 +
      rainfall * 0.08 +
      maritime * 0.08 +
      plateau * 0.06 +
      freeze * 0.10 +
      (cryo ? 0.18 : 0),
    0,
    1
  );
}

function computePsychologyWeight(sample) {
  return clamp(
    (sample?.navigationStability ?? 0) * 0.34 +
      (sample?.plateauStrength ?? 0) * 0.14 +
      (sample?.strongestSummitScore ?? 0) * 0.12 +
      (sample?.strongestBasinScore ?? 0) * 0.10 +
      (sample?.rainfall ?? 0) * 0.08,
    0,
    1
  );
}

function computeCosmosWeight(depth, edgeRatio, lightBias) {
  return clamp(
    0.16 +
      depth * 0.28 +
      (1 - edgeRatio) * 0.20 +
      lightBias * 0.18,
    0,
    1
  );
}

function computeAtmosphereWeight(sample) {
  return clamp(
    (sample?.waterMask === 1 ? 0.30 : 0) +
      (sample?.maritimeInfluence ?? 0) * 0.20 +
      (sample?.rainfall ?? 0) * 0.16 +
      (sample?.evaporationPressure ?? 0) * 0.12 +
      (sample?.shorelineBand === true ? 0.10 : 0) +
      (sample?.freezePotential ?? 0) * 0.06,
    0,
    1
  );
}

function buildPrimitiveOffsets(sample, x, y, radius, fragmentation) {
  const lat = sample?.latDeg ?? y;
  const lon = sample?.lonDeg ?? x;

  const jitterX =
    signedPointHash(lat * 0.19, lon * 0.13, 5.1) * radius * 0.22 * fragmentation;
  const jitterY =
    signedPointHash(lat * 0.11, lon * 0.17, 8.4) * radius * 0.22 * fragmentation;

  return Object.freeze({
    jitterX,
    jitterY,
    drawX: jitterX,
    drawY: jitterY
  });
}

function buildShadowColor(color, shadowDensity, alpha) {
  return mixColor(color, "rgba(0,0,0,1)", clamp(shadowDensity * 0.82, 0, 1), clamp(alpha, 0, 1));
}

function buildHighlightColor(color, highlightDensity, alpha) {
  return mixColor(
    color,
    "rgba(255,255,255,1)",
    clamp(highlightDensity * 0.88, 0, 1),
    clamp(alpha, 0, 1)
  );
}

/* =========================
   CHANNEL BLENDING
========================= */

function buildMasterStyle(sample, point, baseSize, channels, p, x, y) {
  const terrain = normalizeObject(channels.terrain);
  const atmosphere = normalizeObject(channels.atmosphere);
  const psychology = normalizeObject(channels.psychology);
  const cosmos = normalizeObject(channels.cosmos);

  const terrainPacket = normalizeObject(terrain.terrainPacket);
  const elevationPacket = normalizeObject(terrain.elevationPacket);
  const cutPacket = normalizeObject(terrain.cutPacket);
  const hydrationPacket = normalizeObject(atmosphere.hydrationPacket);

  const depth = clamp((point.z + 1) * 0.5, 0, 1);
  const edgeDistance = Math.hypot(point.x - p.centerX, point.y - p.centerY);
  const edgeRatio = p.radius > 0 ? clamp(edgeDistance / p.radius, 0, 1) : 1;
  const limbFade = clamp(1 - Math.pow(edgeRatio, 1.75), 0.12, 1);
  const lightBias = clamp(0.36 + depth * 0.86, 0.18, 1.18);
  const elevation = clamp(sample?.elevation ?? 0, 0, 1);

  const terrainScale = packetRadius(terrainPacket, baseSize) / Math.max(baseSize, 0.0001);
  const elevationScale = packetRadius(elevationPacket, baseSize) / Math.max(baseSize, 0.0001);
  const cutScale = packetRadius(cutPacket, baseSize) / Math.max(baseSize, 0.0001);
  const atmosphereScale = packetRadius(hydrationPacket, baseSize) / Math.max(baseSize, 0.0001);
  const psychologyScale = packetRadius(psychology, baseSize) / Math.max(baseSize, 0.0001);
  const cosmosScale = packetRadius(cosmos, baseSize) / Math.max(baseSize, 0.0001);

  const radius = clamp(
    baseSize *
      (0.76 +
        depth * 0.58 +
        elevation * 0.16 +
        (terrainScale - 1) * 0.20 +
        (elevationScale - 1) * 0.18 +
        (cutScale - 1) * 0.10 +
        (atmosphereScale - 1) * 0.10 +
        (psychologyScale - 1) * 0.05 +
        (cosmosScale - 1) * 0.05),
    0.9,
    6.8
  );

  const baseAlpha = sample?.waterMask === 1 ? 0.24 : 0.78;
  const terrainAlpha = packetAlpha(terrainPacket, 0);
  const elevationAlpha = packetAlpha(elevationPacket, 0);
  const cutAlpha = packetAlpha(cutPacket, 0);
  const atmosphereAlpha = packetAlpha(hydrationPacket, 0);
  const psychologyWeight = computePsychologyWeight(sample);
  const cosmosWeight = computeCosmosWeight(depth, edgeRatio, lightBias);
  const atmosphereWeight = computeAtmosphereWeight(sample);

  const alpha = clamp(
    (baseAlpha +
      terrainAlpha * 0.34 +
      elevationAlpha * 0.18 +
      cutAlpha * 0.14 +
      atmosphereAlpha * 0.20 +
      psychologyWeight * 0.08 +
      cosmosWeight * 0.08) *
      lightBias *
      limbFade,
    0.08,
    1
  );

  const blur = clamp(
    (1 - depth) * 0.9 +
      (1 - limbFade) * 0.8 +
      atmosphereWeight * 0.24 +
      cosmosWeight * 0.10,
    0,
    1.55
  );

  const terrainColor =
    packetColor(cutPacket) ||
    packetColor(elevationPacket) ||
    packetColor(terrainPacket) ||
    (sample?.waterMask === 1
      ? "rgba(68,146,232,0.90)"
      : "rgba(188,206,142,0.94)");

  const cosmosColor = packetColor(cosmos, "rgba(108,174,255,0.22)");
  const atmosphereColor =
    packetColor(hydrationPacket, sample?.waterMask === 1 ? "rgba(90,170,242,0.30)" : "rgba(214,235,255,0.12)");
  const psychologyColor = packetColor(psychology, "rgba(255,236,176,0.18)");

  const colorAfterCosmos = mixColor(terrainColor, cosmosColor, cosmosWeight * 0.24);
  const colorAfterTerrain = colorAfterCosmos;
  const colorAfterAtmosphere = mixColor(colorAfterTerrain, atmosphereColor, atmosphereWeight * 0.34);
  const finalColor = mixColor(colorAfterAtmosphere, psychologyColor, psychologyWeight * 0.18);

  const fragmentation = computeFragmentation(sample, x, y, depth);
  const shadowDensity = computeShadowDensity(sample, depth, edgeRatio);
  const highlightDensity = computeHighlightDensity(sample, depth, lightBias);
  const primitiveShape = classifyPrimitiveShape(sample, x, y);
  const offsets = buildPrimitiveOffsets(sample, x, y, radius, fragmentation);

  return Object.freeze({
    color: finalColor,
    shadowColor: buildShadowColor(finalColor, shadowDensity, alpha * (0.18 + shadowDensity * 0.16)),
    highlightColor: buildHighlightColor(finalColor, highlightDensity, alpha * (0.10 + highlightDensity * 0.12)),
    radius,
    alpha,
    blur,
    glowAlpha: clamp(alpha * (0.18 + depth * 0.18 + cosmosWeight * 0.08), 0, 0.36),
    primitiveShape,
    fragmentation,
    shadowDensity,
    highlightDensity,
    offsets,
    channelWeights: Object.freeze({
      psychology: psychologyWeight,
      cosmos: cosmosWeight,
      terrain: clamp(terrainAlpha + elevationAlpha + cutAlpha + 0.30, 0, 1),
      atmosphere: atmosphereWeight
    })
  });
}

/* =========================
   DRAW PRIMITIVES
========================= */

function drawCirclePrimitive(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

function drawDiamondPrimitive(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x + radius, y);
  ctx.lineTo(x, y + radius);
  ctx.lineTo(x - radius, y);
  ctx.closePath();
}

function drawSquarePrimitive(ctx, x, y, radius) {
  const size = radius * 1.44;
  ctx.beginPath();
  ctx.rect(x - size * 0.5, y - size * 0.5, size, size);
}

function drawTrianglePrimitive(ctx, x, y, radius, angle = -Math.PI * 0.5) {
  const a0 = angle;
  const a1 = angle + (Math.PI * 2) / 3;
  const a2 = angle + (Math.PI * 4) / 3;

  ctx.beginPath();
  ctx.moveTo(x + Math.cos(a0) * radius, y + Math.sin(a0) * radius);
  ctx.lineTo(x + Math.cos(a1) * radius, y + Math.sin(a1) * radius);
  ctx.lineTo(x + Math.cos(a2) * radius, y + Math.sin(a2) * radius);
  ctx.closePath();
}

function drawKitePrimitive(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x + radius * 0.72, y);
  ctx.lineTo(x, y + radius * 1.12);
  ctx.lineTo(x - radius * 0.58, y);
  ctx.closePath();
}

function drawSliverPrimitive(ctx, x, y, radius, angle) {
  const width = radius * 1.62;
  const height = Math.max(1, radius * 0.42);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-width * 0.5, 0);
  ctx.quadraticCurveTo(0, -height, width * 0.5, 0);
  ctx.quadraticCurveTo(0, height, -width * 0.5, 0);
  ctx.closePath();
  ctx.restore();
}

function drawSlashPrimitive(ctx, x, y, radius, angle) {
  const width = radius * 1.86;
  const height = Math.max(1, radius * 0.28);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.rect(-width * 0.5, -height * 0.5, width, height);
  ctx.restore();
}

function drawCapsulePrimitive(ctx, x, y, radius, angle) {
  const width = radius * 1.78;
  const height = Math.max(1.2, radius * 0.66);
  const rx = width * 0.5;
  const ry = height * 0.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-rx + ry, -ry);
  ctx.lineTo(rx - ry, -ry);
  ctx.arc(rx - ry, 0, ry, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.lineTo(-rx + ry, ry);
  ctx.arc(-rx + ry, 0, ry, Math.PI * 0.5, Math.PI * 1.5);
  ctx.closePath();
  ctx.restore();
}

function drawPrimitivePath(ctx, x, y, style) {
  const angleBase =
    signedPointHash(x * 0.011, y * 0.013, style.fragmentation * 17.1) * 0.32;

  if (style.primitiveShape === "diamond") {
    drawDiamondPrimitive(ctx, x, y, style.radius);
    return;
  }

  if (style.primitiveShape === "square") {
    drawSquarePrimitive(ctx, x, y, style.radius);
    return;
  }

  if (style.primitiveShape === "triangle") {
    drawTrianglePrimitive(ctx, x, y, style.radius * 1.08, angleBase - Math.PI * 0.5);
    return;
  }

  if (style.primitiveShape === "kite") {
    drawKitePrimitive(ctx, x, y, style.radius);
    return;
  }

  if (style.primitiveShape === "sliver") {
    drawSliverPrimitive(ctx, x, y, style.radius, angleBase);
    return;
  }

  if (style.primitiveShape === "slash") {
    drawSlashPrimitive(ctx, x, y, style.radius, angleBase + Math.PI * 0.25);
    return;
  }

  if (style.primitiveShape === "capsule") {
    drawCapsulePrimitive(ctx, x, y, style.radius, angleBase);
    return;
  }

  drawCirclePrimitive(ctx, x, y, style.radius);
}

function fillPrimitive(ctx, x, y, style, color, blur = 0) {
  ctx.save();
  ctx.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : "none";
  drawPrimitivePath(ctx, x, y, style);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawPoint(ctx, point, style) {
  const x = point.x + style.offsets.drawX;
  const y = point.y + style.offsets.drawY;

  if (style.glowAlpha > 0.01) {
    ctx.beginPath();
    ctx.fillStyle = withAlpha(style.color, style.glowAlpha);
    ctx.arc(x, y, style.radius * 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  const shadowOffsetX =
    style.offsets.jitterX * 0.18 +
    (style.shadowDensity - 0.5) * style.radius * 0.22;

  const shadowOffsetY =
    style.offsets.jitterY * 0.18 +
    style.shadowDensity * style.radius * 0.22;

  fillPrimitive(
    ctx,
    x + shadowOffsetX,
    y + shadowOffsetY,
    style,
    style.shadowColor,
    style.blur + style.shadowDensity * 0.5
  );

  fillPrimitive(ctx, x, y, style, withAlpha(style.color, style.alpha), style.blur);

  if (style.highlightDensity > 0.08) {
    const hx = x - style.radius * 0.22;
    const hy = y - style.radius * 0.22;

    ctx.beginPath();
    ctx.fillStyle = style.highlightColor;
    ctx.arc(
      hx,
      hy,
      Math.max(0.7, style.radius * (0.22 + style.highlightDensity * 0.08)),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

/* =========================
   MASTER FILTER CORE
========================= */

function drawSurface(ctx, grid, projector, p, globalPrimitiveTime) {
  if (!grid.length) return baseReturn();

  const rows = grid.length;
  const cols = grid[0].length;
  const count = rows * cols;
  const baseSize = clamp((p.radius / Math.sqrt(count)) * 1.28, 1.05, 4.2);

  let visible = 0;
  let emitted = 0;
  let landFamilyCount = 0;
  let waterFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;
  let terrainChannelCount = 0;
  let atmosphereChannelCount = 0;
  let cosmosChannelCount = 0;
  let psychologyChannelCount = 0;

  const queue = [];

  for (let y = 0; y < rows; y += 1) {
    const row = grid[y];

    for (let x = 0; x < cols; x += 1) {
      const sample = row[x];
      if (!sample) continue;

      const point = projector(sample.latDeg, sample.lonDeg, sample.elevation * 8);
      if (!point || !point.visible) continue;

      visible += 1;

      const channels = resolveChannels(sample, baseSize, grid, x, y, globalPrimitiveTime);
      const style = buildMasterStyle(sample, point, baseSize, channels, p, x, y);

      queue.push({ point, style, z: point.z });

      if (sample.waterMask === 1) waterFamilyCount += 1;
      if (sample.landMask === 1) landFamilyCount += 1;
      if (style.channelWeights.terrain > 0.01) terrainChannelCount += 1;
      if (style.channelWeights.atmosphere > 0.01) atmosphereChannelCount += 1;
      if (style.channelWeights.cosmos > 0.01) cosmosChannelCount += 1;
      if (style.channelWeights.psychology > 0.01) psychologyChannelCount += 1;

      if (
        sample.biomeType === "GLACIER" ||
        sample.terrainClass === "POLAR_ICE" ||
        sample.terrainClass === "GLACIAL_HIGHLAND"
      ) {
        cryosphereCount += 1;
      }

      if (sample.shoreline === true || sample.shorelineBand === true) {
        shorelineCount += 1;
      }

      emitted += 1;
    }
  }

  queue.sort((a, b) => a.z - b.z);

  for (let i = 0; i < queue.length; i += 1) {
    drawPoint(ctx, queue[i].point, queue[i].style);
  }

  return {
    visibleCellCount: visible,
    emittedCellCount: emitted,
    landFamilyCount,
    waterFamilyCount,
    cryosphereCount,
    shorelineCount,
    terrainChannelCount,
    atmosphereChannelCount,
    cosmosChannelCount,
    psychologyChannelCount,
    primitiveType: "MASTER_FILTER",
    primitivePath: "render.master.filter"
  };
}

/* =========================
   RETURNS
========================= */

function baseReturn() {
  return {
    visibleCellCount: 0,
    emittedCellCount: 0,
    landFamilyCount: 0,
    waterFamilyCount: 0,
    cryosphereCount: 0,
    shorelineCount: 0,
    terrainChannelCount: 0,
    atmosphereChannelCount: 0,
    cosmosChannelCount: 0,
    psychologyChannelCount: 0,
    primitiveType: "NONE",
    primitivePath: "none"
  };
}

function buildReturn(p, density) {
  return {
    projectionState: p,
    primitive: {
      primitiveType: density.primitiveType,
      primitivePath: density.primitivePath,
      centerAnchored: true,
      rowColumnPathActive: true,
      sectorBandPathActive: false
    },
    topology: {
      visibleCellCount: density.visibleCellCount,
      emittedCellCount: density.emittedCellCount,
      skippedCellCount: 0
    },
    renderAuthority: {
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "render.master.filter"
    },
    density: {
      averageCellSpanPx: 2,
      subdivisionTier: 1,
      densityTier: "BASELINE"
    },
    audit: {
      sampleCount: density.emittedCellCount,
      waterFamilyCount: density.waterFamilyCount,
      landFamilyCount: density.landFamilyCount,
      cryosphereCount: density.cryosphereCount,
      shorelineCount: density.shorelineCount,
      terrainChannelCount: density.terrainChannelCount,
      atmosphereChannelCount: density.atmosphereChannelCount,
      cosmosChannelCount: density.cosmosChannelCount,
      psychologyChannelCount: density.psychologyChannelCount
    }
  };
}

/* =========================
   ENTRY
========================= */

export function createRenderer() {
  function renderPlanet({ ctx, planetField, projectPoint, viewState = {} }) {
    if (!ctx) throw new Error("ctx required");

    const p = getProjectionState(viewState, ctx);

    ctx.clearRect(0, 0, p.width, p.height);
    drawBackground(ctx, p);
    drawPlanet(ctx, p);

    if (!planetField) return buildReturn(p, baseReturn());

    const grid = sampleGrid(planetField);
    const projector = resolveProjectPoint(projectPoint, p);
    const density = drawSurface(
      ctx,
      grid,
      projector,
      p,
      viewState?.globalPrimitiveTime || null
    );

    return buildReturn(p, density);
  }

  return { renderPlanet };
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}

export default DEFAULT_RENDERER;
