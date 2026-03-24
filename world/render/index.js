// /world/render/index.js
// MODE: EXECUTION-ONLY | NON-DRIFT | VARIANT CHART AUTHORITY
// STATUS: FINAL TNT — SUPPRESSION CALIBRATION / STRUCTURE PRESERVED
// OWNER: SEAN
// ROLE:
// - render expresses variant truth only
// - no upstream mutation
// - no diagnostics authority
// - no camera authority
// - no semantic invention
// - preserves runtime-facing return shape
// - consumes canonical node authority from WORLD_KERNEL

import { WORLD_KERNEL } from "../world_kernel.js";
import { resolveTerrainPacket } from "./terrain/index.js";
import { resolveElevationPacket } from "./terrain/elevation_render_engine.js";
import { resolveCutPacket } from "./terrain/cut_render_engine.js";

// Hydration remains collapsed into atmosphere until a dedicated engine exists.
function resolveHydrationPacket() {
  return null;
}

/* =========================
   CONSTANTS
========================= */

const CHANNEL_BINDING = Object.freeze({
  NORTH: "psychology",
  SOUTH: "terrain",
  EAST: "cosmos",
  WEST: "atmosphere"
});

const OCTANTS = Object.freeze(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]);

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
    const fallback = overlayColor || baseColor || "rgba(255,255,255,1)";
    return alphaOverride === null ? fallback : withAlpha(fallback, alphaOverride);
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

function dominantOctant(octants) {
  let best = "N";
  let bestValue = -Infinity;

  for (let i = 0; i < OCTANTS.length; i += 1) {
    const key = OCTANTS[i];
    const value = isFiniteNumber(octants?.[key]) ? octants[key] : 0;
    if (value > bestValue) {
      bestValue = value;
      best = key;
    }
  }

  return best;
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
   TRAVERSAL
========================= */

function resolveTraversalBias(viewState = {}) {
  const bias = typeof viewState?.traversalBias === "string"
    ? viewState.traversalBias.toUpperCase()
    : "SOUTH";

  return bias === "NORTH" || bias === "SOUTH" || bias === "EAST" || bias === "WEST"
    ? bias
    : "SOUTH";
}

function computeTraversal(sample, viewState = {}) {
  const lat = clamp(sample?.latDeg ?? 0, -90, 90);
  const lon = clamp(sample?.lonDeg ?? 0, -180, 180);

  const north = clamp((lat + 90) / 180, 0, 1);
  const south = 1 - north;
  const east = clamp((lon + 180) / 360, 0, 1);
  const west = 1 - east;

  const bias = resolveTraversalBias(viewState);

  const biased = { north, south, east, west };
  const biasBoost = 0.16;

  if (bias === "NORTH") biased.north = clamp(biased.north + biasBoost, 0, 1);
  if (bias === "SOUTH") biased.south = clamp(biased.south + biasBoost, 0, 1);
  if (bias === "EAST") biased.east = clamp(biased.east + biasBoost, 0, 1);
  if (bias === "WEST") biased.west = clamp(biased.west + biasBoost, 0, 1);

  const nsMagnitude = clamp(Math.abs(biased.north - biased.south), 0, 1);
  const ewMagnitude = clamp(Math.abs(biased.east - biased.west), 0, 1);

  const octants = Object.freeze({
    N: clamp(biased.north * (1 - ewMagnitude * 0.5), 0, 1),
    NE: clamp(biased.north * biased.east, 0, 1),
    E: clamp(biased.east * (1 - nsMagnitude * 0.5), 0, 1),
    SE: clamp(biased.south * biased.east, 0, 1),
    S: clamp(biased.south * (1 - ewMagnitude * 0.5), 0, 1),
    SW: clamp(biased.south * biased.west, 0, 1),
    W: clamp(biased.west * (1 - nsMagnitude * 0.5), 0, 1),
    NW: clamp(biased.north * biased.west, 0, 1)
  });

  return Object.freeze({
    bias,
    cardinal: Object.freeze(biased),
    bilateral: Object.freeze({
      northVsSouth: biased.north - biased.south,
      eastVsWest: biased.east - biased.west,
      nsMagnitude,
      ewMagnitude
    }),
    octants,
    dominantOctant: dominantOctant(octants)
  });
}

/* =========================
   NODE AUTHORITY
========================= */

function resolveNodeRelation(sample) {
  const relation = WORLD_KERNEL.resolveNode(sample);
  if (!relation || relation.provisional !== false) {
    throw new Error("WORLD_KERNEL.resolveNode(sample) must return non-provisional node truth");
  }
  return Object.freeze(relation);
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
    hydrationPacket,
    radiusPx: pointSizePx * (sample?.waterMask === 1 ? 1.08 : 0.98),
    alpha:
      (sample?.waterMask === 1 ? 0.22 : 0.10) +
      clamp(sample?.maritimeInfluence ?? 0, 0, 1) * 0.18 +
      clamp(sample?.rainfall ?? 0, 0, 1) * 0.14,
    color:
      sample?.waterMask === 1
        ? "rgba(120,188,255,0.28)"
        : "rgba(204,226,255,0.18)"
  });
}

function resolveCosmosChannel(sample, pointSizePx) {
  return Object.freeze({
    radiusPx: pointSizePx,
    alpha: 0.18 + clamp(sample?.freezePotential ?? 0, 0, 1) * 0.10,
    color: "rgba(96,170,255,0.20)"
  });
}

function resolvePsychologyChannel(sample, pointSizePx) {
  return Object.freeze({
    radiusPx: pointSizePx,
    alpha:
      0.10 +
      clamp(sample?.navigationStability ?? 0, 0, 1) * 0.18 +
      clamp(sample?.strongestSummitScore ?? 0, 0, 1) * 0.08,
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
   TERRAIN ANCHOR TRANSFER LAW
========================= */

function buildTerrainGrammar(sample, point, baseSize, channels, traversal) {
  const terrain = normalizeObject(channels.terrain);
  const terrainPacket = normalizeObject(terrain.terrainPacket);
  const elevationPacket = normalizeObject(terrain.elevationPacket);
  const cutPacket = normalizeObject(terrain.cutPacket);

  const depth = clamp((point.z + 1) * 0.5, 0, 1);
  const south = traversal.cardinal.south;
  const eastWestBalance = 1 - traversal.bilateral.ewMagnitude;

  const terrainScale = packetRadius(terrainPacket, baseSize) / Math.max(baseSize, 0.0001);
  const elevationScale = packetRadius(elevationPacket, baseSize) / Math.max(baseSize, 0.0001);
  const cutScale = packetRadius(cutPacket, baseSize) / Math.max(baseSize, 0.0001);

  const grammarRadius = clamp(
    baseSize *
      (0.76 +
        depth * 0.50 +
        south * 0.16 +
        (terrainScale - 1) * 0.18 +
        (elevationScale - 1) * 0.16 +
        (cutScale - 1) * 0.10),
    0.9,
    6.8
  );

  const terrainAlpha = packetAlpha(terrainPacket, 0);
  const elevationAlpha = packetAlpha(elevationPacket, 0);
  const cutAlpha = packetAlpha(cutPacket, 0);

  const grammarAlpha = clamp(
    0.24 +
      terrainAlpha * 0.28 +
      elevationAlpha * 0.16 +
      cutAlpha * 0.12 +
      depth * 0.20 +
      south * 0.10 +
      eastWestBalance * 0.06,
    0.08,
    1
  );

  const grammarBlur = clamp(
    (1 - depth) * 0.84 +
      traversal.bilateral.ewMagnitude * 0.14 +
      traversal.bilateral.nsMagnitude * 0.10,
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

  return Object.freeze({
    radius: grammarRadius,
    alpha: grammarAlpha,
    blur: grammarBlur,
    baseColor: terrainColor
  });
}

/* =========================
   WEIGHTS / STYLE
========================= */

function computeChannelWeights(sample, traversal, channels, point) {
  const depth = clamp((point.z + 1) * 0.5, 0, 1);
  const psychologyPacket = normalizeObject(channels.psychology);
  const cosmosPacket = normalizeObject(channels.cosmos);
  const atmospherePacket = normalizeObject(channels.atmosphere);
  const terrain = normalizeObject(channels.terrain);

  const terrainPacket = normalizeObject(terrain.terrainPacket);
  const elevationPacket = normalizeObject(terrain.elevationPacket);
  const cutPacket = normalizeObject(terrain.cutPacket);

  const terrainWeight = clamp(
    0.26 +
      traversal.cardinal.south * 0.26 +
      packetAlpha(terrainPacket, 0) * 0.16 +
      packetAlpha(elevationPacket, 0) * 0.10 +
      packetAlpha(cutPacket, 0) * 0.08,
    0,
    1
  );

  const psychologyWeight = clamp(
    0.08 +
      traversal.cardinal.north * 0.26 +
      packetAlpha(psychologyPacket, 0) * 0.22,
    0,
    1
  );

  const cosmosWeight = clamp(
    0.08 +
      traversal.cardinal.east * 0.24 +
      depth * 0.16 +
      packetAlpha(cosmosPacket, 0) * 0.18,
    0,
    1
  );

  const atmosphereWeight = clamp(
    0.10 +
      traversal.cardinal.west * 0.26 +
      packetAlpha(atmospherePacket, 0) * 0.22 +
      (sample?.waterMask === 1 ? 0.10 : 0) +
      clamp(sample?.maritimeInfluence ?? 0, 0, 1) * 0.10,
    0,
    1
  );

  return Object.freeze({
    terrain: terrainWeight,
    psychology: psychologyWeight,
    cosmos: cosmosWeight,
    atmosphere: atmosphereWeight
  });
}

function classifyPrimitiveShape(sample, traversal, nodeRelation) {
  const octant = traversal.dominantOctant;
  const terrainClass = sample?.terrainClass ?? "NONE";
  const water = sample?.waterMask === 1;
  const shoreline = sample?.shoreline === true || sample?.shorelineBand === true;
  const nodeId = nodeRelation.id;

  if (water) return shoreline ? "capsule" : "diamond";
  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") return "triangle";
  if (terrainClass === "RIDGE") return "sliver";
  if (terrainClass === "CANYON") return "slash";
  if (terrainClass === "PLATEAU" && nodeId % 2 === 0) return "square";

  if (octant === "NE" || octant === "SW") return "diamond";
  if (octant === "NW" || octant === "SE") return "kite";
  if (octant === "E" || octant === "W") return "capsule";
  if (octant === "N") return nodeId % 2 === 0 ? "circle" : "diamond";
  if (octant === "S") return nodeId % 3 === 0 ? "square" : "triangle";

  if (nodeId % 4 === 0) return "square";
  if (nodeId % 4 === 1) return "diamond";
  if (nodeId % 4 === 2) return "kite";
  return "circle";
}

function buildPrimitiveOffsets(sample, x, y, radius, blur) {
  const lat = sample?.latDeg ?? y;
  const lon = sample?.lonDeg ?? x;

  const jitterX =
    signedPointHash(lat * 0.19, lon * 0.13, 5.1) * radius * 0.16 * clamp(blur + 0.2, 0, 1);
  const jitterY =
    signedPointHash(lat * 0.11, lon * 0.17, 8.4) * radius * 0.16 * clamp(blur + 0.2, 0, 1);

  return Object.freeze({
    jitterX,
    jitterY,
    drawX: jitterX,
    drawY: jitterY
  });
}

function buildMasterStyle(sample, point, baseSize, channels, traversal, nodeRelation, x, y) {
  const terrainGrammar = buildTerrainGrammar(sample, point, baseSize, channels, traversal);
  const weights = computeChannelWeights(sample, traversal, channels, point);

  const atmosphere = normalizeObject(channels.atmosphere);
  const cosmos = normalizeObject(channels.cosmos);
  const psychology = normalizeObject(channels.psychology);

  const depth = clamp((point.z + 1) * 0.5, 0, 1);
  const octants = traversal.octants;
  const nodeBoost = (nodeRelation.id % 4) * 0.03;
  const relationBoost = nodeRelation.relation_type === "state_index_membership" ? 0.04 : 0.02;

  const radius = clamp(
    terrainGrammar.radius *
      (1 +
        weights.cosmos * 0.06 +
        weights.psychology * 0.04 +
        weights.atmosphere * 0.08 +
        nodeBoost +
        relationBoost),
    0.9,
    7.0
  );

  const alpha = clamp(
    terrainGrammar.alpha *
      (1 +
        weights.psychology * 0.06 +
        weights.cosmos * 0.04 +
        weights.atmosphere * 0.10),
    0.08,
    1
  );

  const blur = clamp(
    terrainGrammar.blur +
      weights.atmosphere * 0.24 +
      octants.W * 0.16 +
      octants.NE * 0.08,
    0,
    1.8
  );

  const cosmosColor = packetColor(cosmos, "rgba(108,174,255,0.22)");
  const atmosphereColor = packetColor(
    atmosphere,
    sample?.waterMask === 1 ? "rgba(90,170,242,0.30)" : "rgba(214,235,255,0.12)"
  );
  const psychologyColor = packetColor(psychology, "rgba(255,236,176,0.18)");

  const colorAfterCosmos = mixColor(terrainGrammar.baseColor, cosmosColor, weights.cosmos * 0.22);
  const colorAfterAtmosphere = mixColor(colorAfterCosmos, atmosphereColor, weights.atmosphere * 0.34);
  const finalColor = mixColor(colorAfterAtmosphere, psychologyColor, weights.psychology * 0.18);

  const shadowMix = clamp(0.26 + traversal.bilateral.nsMagnitude * 0.20 + octants.SW * 0.14, 0, 1);
  const highlightMix = clamp(0.18 + depth * 0.16 + octants.NE * 0.18 + octants.NW * 0.08, 0, 1);

  const shadowColor = mixColor(
    finalColor,
    "rgba(0,0,0,1)",
    shadowMix,
    clamp(alpha * (0.16 + shadowMix * 0.14), 0, 1)
  );

  const highlightColor = mixColor(
    finalColor,
    "rgba(255,255,255,1)",
    highlightMix,
    clamp(alpha * (0.08 + highlightMix * 0.10), 0, 1)
  );

  const glowAlpha = clamp(
    alpha * (0.14 + weights.cosmos * 0.12 + weights.atmosphere * 0.08),
    0,
    0.38
  );

  return Object.freeze({
    color: finalColor,
    shadowColor,
    highlightColor,
    radius,
    alpha,
    blur,
    glowAlpha,
    primitiveShape: classifyPrimitiveShape(sample, traversal, nodeRelation),
    offsets: buildPrimitiveOffsets(sample, x, y, radius, blur),
    traversal,
    nodeRelation,
    channelWeights: weights
  });
}

/* =========================
   SUPPRESSION / ORDERING LAW
========================= */

function evaluateSuppression(sample, traversal, nodeRelation, style) {
  const weights = style.channelWeights;

  const readability =
    weights.terrain * 0.22 +
    weights.psychology * 0.14 +
    weights.cosmos * 0.14 +
    weights.atmosphere * 0.18 +
    (1 - traversal.bilateral.nsMagnitude) * 0.06 +
    (1 - traversal.bilateral.ewMagnitude) * 0.06;

  const focus =
    traversal.octants[traversal.dominantOctant] * 0.22 +
    (traversal.bias === "SOUTH" ? weights.terrain * 0.10 : 0) +
    (traversal.bias === "NORTH" ? weights.psychology * 0.10 : 0) +
    (traversal.bias === "EAST" ? weights.cosmos * 0.10 : 0) +
    (traversal.bias === "WEST" ? weights.atmosphere * 0.10 : 0);

  const nodeLegibility =
    0.06 +
    (nodeRelation.id % 4) * 0.008 +
    (nodeRelation.relation_type === "state_index_membership" ? 0.02 : 0.01);

  const faceLegibility =
    traversal.dominantOctant === "NE" ||
    traversal.dominantOctant === "SE" ||
    traversal.dominantOctant === "SW" ||
    traversal.dominantOctant === "NW"
      ? 0.08
      : 0.03;

  const atmosphericPresence = weights.atmosphere * 0.10;
  const terrainTransfer = weights.terrain * 0.06;
  const waterCoherence = sample?.waterMask === 1 ? 0.03 : 0;
  const summitClarity =
    sample?.terrainClass === "SUMMIT" || sample?.terrainClass === "MOUNTAIN" ? 0.04 : 0;

  const score =
    readability +
    focus +
    nodeLegibility +
    faceLegibility +
    atmosphericPresence +
    terrainTransfer +
    waterCoherence +
    summitClarity;

  const threshold =
    0.80 -
    weights.terrain * 0.08 -
    weights.atmosphere * 0.06 -
    faceLegibility * 0.12 -
    (traversal.dominantOctant === "NE" || traversal.dominantOctant === "NW" ? 0.03 : 0);

  return Object.freeze({
    emit: score >= threshold,
    score,
    threshold
  });
}

function computeOrderingDepth(point, traversal, style) {
  const octantBoost =
    traversal.octants.NE * 0.03 +
    traversal.octants.SE * 0.01 -
    traversal.octants.SW * 0.01 -
    traversal.octants.NW * 0.02;

  const westFogLift = style.channelWeights.atmosphere * 0.02;
  const northClarityLift = style.channelWeights.psychology * 0.01;

  return point.z + octantBoost + westFogLift + northClarityLift;
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
  const octant = style.traversal.dominantOctant;
  const angleBase =
    (octant === "NE" ? -Math.PI * 0.25 :
      octant === "SE" ? Math.PI * 0.25 :
      octant === "SW" ? Math.PI * 0.75 :
      octant === "NW" ? -Math.PI * 0.75 :
      octant === "E" ? 0 :
      octant === "W" ? Math.PI :
      octant === "S" ? Math.PI * 0.5 :
      -Math.PI * 0.5) +
    signedPointHash(x * 0.011, y * 0.013, style.radius * 17.1) * 0.16;

  if (style.primitiveShape === "diamond") {
    drawDiamondPrimitive(ctx, x, y, style.radius);
    return;
  }

  if (style.primitiveShape === "square") {
    drawSquarePrimitive(ctx, x, y, style.radius);
    return;
  }

  if (style.primitiveShape === "triangle") {
    drawTrianglePrimitive(ctx, x, y, style.radius * 1.08, angleBase);
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
    drawSlashPrimitive(ctx, x, y, style.radius, angleBase);
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
    ctx.arc(x, y, style.radius * (1.8 + style.channelWeights.atmosphere * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  const shadowOffsetX =
    style.offsets.jitterX * 0.18 +
    (style.channelWeights.cosmos - style.channelWeights.psychology) * style.radius * 0.14;

  const shadowOffsetY =
    style.offsets.jitterY * 0.18 +
    (style.channelWeights.atmosphere - style.channelWeights.terrain) * style.radius * 0.14;

  fillPrimitive(
    ctx,
    x + shadowOffsetX,
    y + shadowOffsetY,
    style,
    style.shadowColor,
    style.blur + style.channelWeights.atmosphere * 0.4
  );

  fillPrimitive(ctx, x, y, style, withAlpha(style.color, style.alpha), style.blur);

  if (style.channelWeights.psychology > 0.10 || style.channelWeights.cosmos > 0.10) {
    const hx = x - style.radius * 0.22;
    const hy = y - style.radius * 0.22;

    ctx.beginPath();
    ctx.fillStyle = style.highlightColor;
    ctx.arc(
      hx,
      hy,
      Math.max(0.7, style.radius * (0.18 + style.channelWeights.psychology * 0.08 + style.channelWeights.cosmos * 0.06)),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

/* =========================
   SURFACE
========================= */

function drawSurface(ctx, grid, projector, p, globalPrimitiveTime, viewState) {
  if (!grid.length) return baseDensity();

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
  let skippedCellCount = 0;

  const queue = [];

  for (let y = 0; y < rows; y += 1) {
    const row = grid[y];

    for (let x = 0; x < cols; x += 1) {
      const sample = row[x];
      if (!sample) continue;

      const point = projector(sample.latDeg, sample.lonDeg, sample.elevation * 8);
      if (!point || !point.visible) continue;

      visible += 1;

      const traversal = computeTraversal(sample, viewState);
      const nodeRelation = resolveNodeRelation(sample);
      const channels = resolveChannels(sample, baseSize, grid, x, y, globalPrimitiveTime);
      const style = buildMasterStyle(sample, point, baseSize, channels, traversal, nodeRelation, x, y);
      const suppression = evaluateSuppression(sample, traversal, nodeRelation, style);

      if (!suppression.emit) {
        skippedCellCount += 1;
        continue;
      }

      queue.push({
        point,
        style,
        z: computeOrderingDepth(point, traversal, style)
      });

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

  const effectiveSpan =
    emitted > 0 && p.radius > 0
      ? clamp((p.radius * 2) / Math.sqrt(emitted), 1, 12)
      : 2;

  const densityTier =
    emitted === 0 ? "NONE" :
    emitted > visible * 0.72 ? "HIGH" :
    emitted > visible * 0.40 ? "BASELINE" :
    "SUPPRESSED";

  return {
    visibleCellCount: visible,
    emittedCellCount: emitted,
    skippedCellCount,
    landFamilyCount,
    waterFamilyCount,
    cryosphereCount,
    shorelineCount,
    terrainChannelCount,
    atmosphereChannelCount,
    cosmosChannelCount,
    psychologyChannelCount,
    primitiveType: "TRAVERSAL_FILTER",
    primitivePath: "render.traversal.filter",
    averageCellSpanPx: effectiveSpan,
    subdivisionTier: emitted > visible * 0.72 ? 2 : 1,
    densityTier
  };
}

/* =========================
   RETURNS
========================= */

function baseDensity() {
  return {
    visibleCellCount: 0,
    emittedCellCount: 0,
    skippedCellCount: 0,
    landFamilyCount: 0,
    waterFamilyCount: 0,
    cryosphereCount: 0,
    shorelineCount: 0,
    terrainChannelCount: 0,
    atmosphereChannelCount: 0,
    cosmosChannelCount: 0,
    psychologyChannelCount: 0,
    primitiveType: "NONE",
    primitivePath: "none",
    averageCellSpanPx: 2,
    subdivisionTier: 1,
    densityTier: "BASELINE"
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
      skippedCellCount: density.skippedCellCount
    },
    renderAuthority: {
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "render.traversal.filter"
    },
    density: {
      averageCellSpanPx: density.averageCellSpanPx,
      subdivisionTier: density.subdivisionTier,
      densityTier: density.densityTier
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

    if (!planetField) return buildReturn(p, baseDensity());

    const grid = sampleGrid(planetField);
    const projector = resolveProjectPoint(projectPoint, p);
    const density = drawSurface(
      ctx,
      grid,
      projector,
      p,
      viewState?.globalPrimitiveTime || null,
      viewState
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
