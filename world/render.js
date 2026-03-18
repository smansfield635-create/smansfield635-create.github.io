import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function sampleGrid(planetField) {
  const rows = Array.isArray(planetField?.samples) ? planetField.samples : [];
  return Array.isArray(rows[0]) ? rows : [];
}

function getProjectionState(viewState = {}, ctx) {
  const state = normalizeObject(viewState);
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const radius =
    isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * WORLD_KERNEL.constants.worldRadiusFactor;

  return Object.freeze({
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.58,
    radius,
    observeMode: state.observeMode === true,
    starfieldSuppressed: state.starfieldSuppressed === true
  });
}

function defaultProjectorFactory(projectionState) {
  return function projectPoint(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const resolvedRadius = projectionState.radius + radiusOffsetPx;

    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);

    return Object.freeze({
      x: projectionState.centerX + x * resolvedRadius,
      y: projectionState.centerY - y * resolvedRadius,
      z,
      visible: z >= 0,
      resolvedRadius
    });
  };
}

function resolveProjectPoint(projectPoint, projectionState) {
  return typeof projectPoint === "function"
    ? projectPoint
    : defaultProjectorFactory(projectionState);
}

function withPlanetClip(ctx, projectionState, drawFn) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius,
    0,
    Math.PI * 2
  );
  ctx.clip();
  drawFn();
  ctx.restore();
}

function terrainClass(sample) {
  return typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
}

function biomeType(sample) {
  return typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
}

function surfaceMaterial(sample) {
  return typeof sample?.surfaceMaterial === "string" ? sample.surfaceMaterial : "NONE";
}

function climateBand(sample) {
  return typeof sample?.climateBandField === "string" ? sample.climateBandField : "TEMPERATE";
}

function seasonPhase(sample) {
  return isFiniteNumber(sample?.seasonPhase) ? sample.seasonPhase : 0;
}

function seasonName(sample) {
  return typeof sample?.hemisphereSeason === "string" ? sample.hemisphereSeason : "NONE";
}

function isWaterFamily(sample) {
  return sample?.waterMask === 1 ||
    terrainClass(sample) === "WATER" ||
    terrainClass(sample) === "SHELF";
}

function isLandFamily(sample) {
  return sample?.landMask === 1;
}

function isCryosphere(sample) {
  const tc = terrainClass(sample);
  return (
    tc === "POLAR_ICE" ||
    tc === "GLACIAL_HIGHLAND" ||
    biomeType(sample) === "GLACIER" ||
    surfaceMaterial(sample) === "ICE" ||
    surfaceMaterial(sample) === "SNOW"
  );
}

function isShoreTransition(sample) {
  const tc = terrainClass(sample);
  return tc === "SHORELINE" || tc === "BEACH" || sample?.shoreline === true || sample?.shorelineBand === true;
}

function projectionStateOffset(sample) {
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  return 10 + elevation * 12;
}

function pointFromSample(sample, projectPoint, radiusScale = 1) {
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const radiusOffset = radiusScale * elevation * 18;
  return projectPoint(sample.latDeg, sample.lonDeg, radiusOffset);
}

function shouldDrawQuad(points) {
  return points.some((point) => point?.visible === true);
}

function hashNoise(seed, a, b, c = 0) {
  const v = Math.sin((seed * 0.001) + (a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function signedNoise(seed, a, b, c = 0) {
  return hashNoise(seed, a, b, c) * 2 - 1;
}

function sampleVisualNoise(sample, seed, latScale, lonScale) {
  const lat = (sample?.latDeg ?? 0) / latScale;
  const lon = (sample?.lonDeg ?? 0) / lonScale;
  return signedNoise(seed, lat, lon, 0);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixRgb(a, b, t) {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t)
  };
}

function rgb(r, g, b) {
  return { r, g, b };
}

function rgbString(color) {
  return `rgb(${Math.round(clamp(color.r, 0, 255))}, ${Math.round(clamp(color.g, 0, 255))}, ${Math.round(clamp(color.b, 0, 255))})`;
}

function addColor(color, dr, dg, db) {
  return rgb(color.r + dr, color.g + dg, color.b + db);
}

function mulColor(color, factor) {
  return rgb(color.r * factor, color.g * factor, color.b * factor);
}

function getSlopeLight(sample) {
  const slope = clamp(sample?.slope ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const curvature = clamp(sample?.curvature ?? 0, -1, 1);
  const signed = ridge * 0.74 - basin * 0.50 + curvature * 0.22;
  return clamp(0.94 + signed - slope * 0.20, 0.66, 1.24);
}

function getSeasonalTemperature(sample) {
  return clamp(
    isFiniteNumber(sample?.seasonalTemperature) ? sample.seasonalTemperature : (sample?.temperature ?? 0.5),
    0,
    1
  );
}

function getSeasonalMoisture(sample) {
  return clamp(
    isFiniteNumber(sample?.seasonalMoisture) ? sample.seasonalMoisture : (sample?.rainfall ?? 0.5),
    0,
    1
  );
}

function getMacroReliefNoise(sample) {
  const n1 = sampleVisualNoise(sample, 8101, 5.8, 7.2);
  const n2 = sampleVisualNoise(sample, 9203, 11.5, 15.5);
  const n3 = sampleVisualNoise(sample, 10427, 24.0, 28.0);
  return clamp((n1 * 0.55) + (n2 * 0.30) + (n3 * 0.15), -1, 1);
}

function getMicroReliefNoise(sample) {
  const n1 = sampleVisualNoise(sample, 14021, 2.8, 3.4);
  const n2 = sampleVisualNoise(sample, 15331, 4.2, 5.6);
  return clamp((n1 * 0.64) + (n2 * 0.36), -1, 1);
}

function getReliefMix(sample) {
  const macro = getMacroReliefNoise(sample);
  const micro = getMicroReliefNoise(sample);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
  return clamp(macro * 0.58 + micro * 0.42 + ridge * 0.18 - basin * 0.10 - canyon * 0.08, -1, 1);
}

function getCoastBreakFactor(sample) {
  if (!isShoreTransition(sample)) return 0;
  const noise = getReliefMix(sample);
  const slope = clamp(sample?.slope ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  return clamp(0.52 + noise * 0.36 + ridge * 0.16 - basin * 0.10 - slope * 0.06, 0, 1);
}

function getWaterLight(point) {
  return clamp(0.82 + point.z * 0.30, 0.58, 1.10);
}

function getLandLight(point, sample) {
  const slopeLight = getSlopeLight(sample);
  const facing = clamp(0.76 + point.z * 0.34, 0.56, 1.16);
  return clamp(slopeLight * facing, 0.52, 1.28);
}

function waterColorForSample(sample, point) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? 0, -1, 0));
  const runoff = clamp(sample?.runoff ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const climate = climateBand(sample);
  const seasonalTemp = getSeasonalTemperature(sample);
  const seasonalMoisture = getSeasonalMoisture(sample);
  const shore = isShoreTransition(sample);
  const shelf = terrainClass(sample) === "SHELF";
  const reliefNoise = getReliefMix(sample);

  let color = rgb(18, 70, 136);

  color = mixRgb(color, rgb(44, 112, 184), clamp(1 - depth * 1.72, 0, 1));
  color = mixRgb(color, rgb(8, 28, 72), clamp(depth * 0.88, 0, 1));

  if (shelf) {
    color = mixRgb(color, rgb(66, 134, 180), 0.42);
  }

  if (shore) {
    color = mixRgb(color, rgb(84, 146, 184), 0.18 + getCoastBreakFactor(sample) * 0.22);
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    color = mixRgb(color, rgb(154, 188, 214), freeze * 0.46);
  }

  color = mixRgb(color, rgb(62, 132, 204), seasonalTemp * 0.10);
  color = mixRgb(color, rgb(24, 88, 140), seasonalMoisture * 0.08);
  color = addColor(color, reliefNoise * 6, reliefNoise * 7, reliefNoise * 9);
  color = addColor(color, runoff * 4, runoff * 5, runoff * 2);

  return mulColor(color, getWaterLight(point));
}

function landColorForSample(sample, point) {
  const tc = terrainClass(sample);
  const biome = biomeType(sample);
  const surface = surfaceMaterial(sample);
  const climate = climateBand(sample);

  const elevation = clamp(sample?.elevation ?? 0, 0, 1);
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const sediment = clamp(sample?.sedimentLoad ?? 0, 0, 1);
  const seasonalTemp = getSeasonalTemperature(sample);
  const seasonalMoisture = getSeasonalMoisture(sample);
  const continentality = clamp(sample?.continentality ?? 0, 0, 1);
  const maritimeInfluence = clamp(sample?.maritimeInfluence ?? 0, 0, 1);
  const rainShadowStrength = clamp(sample?.rainShadowStrength ?? 0, 0, 1);
  const season = seasonName(sample);
  const reliefNoise = getReliefMix(sample);
  const strongRelief = clamp(ridge * 0.54 + basin * 0.22 + elevation * 0.28, 0, 1);

  let color = rgb(118, 132, 92);

  if (biome === "TROPICAL_RAINFOREST") {
    color = rgb(36, 94, 50);
  } else if (biome === "TROPICAL_GRASSLAND") {
    color = rgb(144, 148, 84);
  } else if (biome === "TEMPERATE_FOREST") {
    color = rgb(64, 100, 66);
  } else if (biome === "TEMPERATE_GRASSLAND") {
    color = rgb(150, 150, 100);
  } else if (biome === "DESERT") {
    color = rgb(174, 144, 94);
  } else if (biome === "TUNDRA") {
    color = rgb(126, 128, 120);
  } else if (biome === "WETLAND") {
    color = rgb(78, 104, 84);
  } else if (biome === "BOREAL_FOREST") {
    color = rgb(70, 88, 72);
  } else if (biome === "GLACIER") {
    color = rgb(220, 228, 236);
  }

  if (surface === "BEDROCK") {
    color = mixRgb(color, rgb(134, 128, 124), 0.36);
  } else if (surface === "GRAVEL") {
    color = mixRgb(color, rgb(150, 140, 122), 0.24);
  } else if (surface === "SAND") {
    color = mixRgb(color, rgb(198, 176, 122), 0.34);
  } else if (surface === "SILT") {
    color = mixRgb(color, rgb(160, 144, 120), 0.28);
  } else if (surface === "CLAY") {
    color = mixRgb(color, rgb(156, 114, 90), 0.30);
  } else if (surface === "SOIL") {
    color = mixRgb(color, rgb(106, 86, 62), 0.16);
  } else if (surface === "ICE") {
    color = rgb(228, 234, 240);
  } else if (surface === "SNOW") {
    color = rgb(244, 246, 250);
  }

  if (tc === "BEACH") {
    color = rgb(202, 180, 128);
  } else if (tc === "SHORELINE") {
    color = mixRgb(color, rgb(182, 166, 118), 0.26);
  } else if (tc === "BASIN") {
    color = mixRgb(color, rgb(92, 108, 80), 0.28);
  } else if (tc === "CANYON") {
    color = mixRgb(color, rgb(158, 102, 78), 0.42);
  } else if (tc === "RIDGE") {
    color = mixRgb(color, rgb(126, 120, 108), 0.24);
  } else if (tc === "PLATEAU") {
    color = mixRgb(color, rgb(146, 132, 102), 0.24);
  } else if (tc === "MOUNTAIN") {
    color = mixRgb(color, rgb(150, 146, 140), 0.42);
  } else if (tc === "SUMMIT") {
    color = mixRgb(color, rgb(194, 192, 192), 0.52);
  } else if (tc === "GLACIAL_HIGHLAND" || tc === "POLAR_ICE") {
    color = rgb(214, 224, 236);
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    color = mixRgb(color, rgb(200, 210, 224), freeze * 0.36);
  } else if (climate === "EQUATORIAL" || climate === "TROPICAL") {
    color = mixRgb(color, rgb(82, 124, 68), rainfall * 0.12);
  }

  if (season === "SUMMER") {
    color = mixRgb(color, rgb(184, 168, 92), continentality * 0.12);
    color = mixRgb(color, rgb(82, 118, 64), seasonalMoisture * 0.14);
  } else if (season === "SPRING") {
    color = mixRgb(color, rgb(128, 156, 92), seasonalMoisture * 0.14);
  } else if (season === "AUTUMN") {
    color = mixRgb(color, rgb(176, 124, 76), 0.10 + continentality * 0.10);
  } else if (season === "WINTER") {
    color = mixRgb(color, rgb(210, 216, 226), freeze * 0.24);
  }

  color = mixRgb(color, rgb(198, 162, 104), rainShadowStrength * 0.14);
  color = mixRgb(color, rgb(84, 122, 92), maritimeInfluence * 0.06);
  color = mixRgb(color, rgb(184, 190, 198), clamp((elevation - 0.40) * 1.8, 0, 1) * 0.20);

  color = addColor(
    color,
    reliefNoise * 12 + ridge * 12 - basin * 8 + strongRelief * 4,
    reliefNoise * 9 + rainfall * 5 - freeze * 2,
    reliefNoise * 4 + freeze * 9
  );

  color = addColor(color, sediment * 4, sediment * 3, sediment * 1);

  return mulColor(color, getLandLight(point, sample));
}

function colorForSample(sample, point) {
  return isWaterFamily(sample)
    ? waterColorForSample(sample, point)
    : landColorForSample(sample, point);
}

function alphaForSample(sample) {
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const magnetic = clamp(sample?.auroralPotential ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const water = isWaterFamily(sample);
  const shore = isShoreTransition(sample);

  let alpha = water ? 0.88 : 0.76;
  alpha += rainfall * 0.03;
  alpha += magnetic * 0.02;
  alpha += freeze * 0.02;
  if (shore) alpha += 0.02;

  return clamp(alpha, 0.48, 0.96);
}

function edgeBreakAlpha(sample) {
  if (!isShoreTransition(sample)) return 1;
  const coast = getCoastBreakFactor(sample);
  const tc = terrainClass(sample);
  if (tc === "BEACH") return clamp(0.72 + coast * 0.22, 0.64, 0.95);
  if (tc === "SHORELINE") return clamp(0.64 + coast * 0.24, 0.56, 0.90);
  return clamp(0.80 + coast * 0.16, 0.68, 0.94);
}

function drawQuad(ctx, p00, p10, p11, p01, fillStyle, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(p00.x, p00.y);
  ctx.lineTo(p10.x, p10.y);
  ctx.lineTo(p11.x, p11.y);
  ctx.lineTo(p01.x, p01.y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

function drawSpace(ctx, projectionState, viewState = {}) {
  ctx.save();

  const gradient = ctx.createLinearGradient(0, 0, 0, projectionState.height);
  gradient.addColorStop(0, "#030714");
  gradient.addColorStop(0.50, "#08152a");
  gradient.addColorStop(1, "#0a1831");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const nebulaA = ctx.createRadialGradient(
    projectionState.centerX - projectionState.radius * 0.85,
    projectionState.centerY - projectionState.radius * 0.95,
    0,
    projectionState.centerX - projectionState.radius * 0.85,
    projectionState.centerY - projectionState.radius * 0.95,
    projectionState.radius * 1.7
  );
  nebulaA.addColorStop(0, "rgba(92,110,255,0.10)");
  nebulaA.addColorStop(0.55, "rgba(90,60,180,0.05)");
  nebulaA.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = nebulaA;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const nebulaB = ctx.createRadialGradient(
    projectionState.centerX + projectionState.radius * 0.72,
    projectionState.centerY - projectionState.radius * 0.34,
    0,
    projectionState.centerX + projectionState.radius * 0.72,
    projectionState.centerY - projectionState.radius * 0.34,
    projectionState.radius * 1.25
  );
  nebulaB.addColorStop(0, "rgba(255,88,88,0.05)");
  nebulaB.addColorStop(0.45, "rgba(160,72,130,0.04)");
  nebulaB.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = nebulaB;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  if (viewState.starfieldSuppressed !== true) {
    const seed = Math.round(
      (isFiniteNumber(viewState.seed) ? viewState.seed : 1) * 9973 +
      projectionState.width +
      projectionState.height
    );

    for (let i = 0; i < 150; i += 1) {
      const rx = Math.abs(Math.sin(seed + i * 13.17));
      const ry = Math.abs(Math.cos(seed + i * 7.91));
      const rs = 0.28 + (Math.abs(Math.sin(seed + i * 2.31)) * 1.4);
      const x = rx * projectionState.width;
      const y = ry * projectionState.height;
      const alpha = 0.08 + Math.abs(Math.cos(seed + i * 0.77)) * 0.28;

      ctx.beginPath();
      ctx.arc(x, y, rs, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawAtmosphere(ctx, projectionState) {
  ctx.save();

  const outerRadius =
    projectionState.radius *
    (1 + WORLD_KERNEL.constants.atmosphereThicknessFactor);

  const glow = ctx.createRadialGradient(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 0.82,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  glow.addColorStop(0, "rgba(40,120,255,0.00)");
  glow.addColorStop(0.66, "rgba(62,146,255,0.10)");
  glow.addColorStop(1, "rgba(96,180,255,0.22)");

  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    outerRadius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.restore();
}

function drawOceanBase(ctx, projectionState) {
  withPlanetClip(ctx, projectionState, () => {
    const oceanGradient = ctx.createRadialGradient(
      projectionState.centerX - projectionState.radius * 0.24,
      projectionState.centerY - projectionState.radius * 0.28,
      projectionState.radius * 0.06,
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius
    );

    oceanGradient.addColorStop(0, "rgb(64,128,196)");
    oceanGradient.addColorStop(0.45, "rgb(34,92,162)");
    oceanGradient.addColorStop(0.82, "rgb(14,48,104)");
    oceanGradient.addColorStop(1, "rgb(8,24,62)");

    ctx.beginPath();
    ctx.arc(
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = oceanGradient;
    ctx.fill();
  });
}

function drawOceanMesh(ctx, grid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length - 1; x += 1) {
      const s00 = row[x];
      const s10 = row[x + 1];
      const s01 = nextRow[x];
      const s11 = nextRow[x + 1];

      const waterBias =
        (isWaterFamily(s00) ? 1 : 0) +
        (isWaterFamily(s10) ? 1 : 0) +
        (isWaterFamily(s01) ? 1 : 0) +
        (isWaterFamily(s11) ? 1 : 0);

      if (waterBias === 0) continue;

      const p00 = pointFromSample(s00, projectPoint, 0.45);
      const p10 = pointFromSample(s10, projectPoint, 0.45);
      const p01 = pointFromSample(s01, projectPoint, 0.45);
      const p11 = pointFromSample(s11, projectPoint, 0.45);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      drawQuad(
        ctx,
        p00,
        p10,
        p11,
        p01,
        rgbString(colorForSample(s00, p00)),
        alphaForSample(s00)
      );
    }
  }
}

function drawTerrainMesh(ctx, grid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length - 1; x += 1) {
      const s00 = row[x];
      const s10 = row[x + 1];
      const s01 = nextRow[x];
      const s11 = nextRow[x + 1];

      const landBias =
        (isLandFamily(s00) ? 1 : 0) +
        (isLandFamily(s10) ? 1 : 0) +
        (isLandFamily(s01) ? 1 : 0) +
        (isLandFamily(s11) ? 1 : 0);

      if (landBias === 0) continue;

      const p00 = pointFromSample(s00, projectPoint, 1.0);
      const p10 = pointFromSample(s10, projectPoint, 1.0);
      const p01 = pointFromSample(s01, projectPoint, 1.0);
      const p11 = pointFromSample(s11, projectPoint, 1.0);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const alpha = alphaForSample(s00) * edgeBreakAlpha(s00);

      drawQuad(
        ctx,
        p00,
        p10,
        p11,
        p01,
        rgbString(colorForSample(s00, p00)),
        alpha
      );
    }
  }
}

function drawCoastHighlights(ctx, grid, projectPoint) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 2) {
    for (let x = 0; x < grid[y].length; x += 2) {
      const sample = grid[y][x];
      if (!isShoreTransition(sample)) continue;

      const point = pointFromSample(sample, projectPoint, 1.04);
      if (!point.visible) continue;

      const coast = getCoastBreakFactor(sample);
      const radius = 0.8 + coast * 1.8;
      const alpha = terrainClass(sample) === "BEACH"
        ? 0.10 + coast * 0.12
        : 0.06 + coast * 0.10;

      ctx.globalAlpha = clamp(alpha, 0.04, 0.18);
      ctx.fillStyle = terrainClass(sample) === "BEACH"
        ? "rgba(244,226,182,1)"
        : "rgba(214,232,238,1)";

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawReliefRidges(ctx, grid, projectPoint) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 3) {
    for (let x = 0; x < grid[y].length; x += 3) {
      const sample = grid[y][x];
      if (!isLandFamily(sample)) continue;

      const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
      const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
      const plateau = clamp(sample?.plateauStrength ?? 0, 0, 1);
      const point = pointFromSample(sample, projectPoint, 1.08);

      if (!point.visible) continue;

      const local = ridge * 0.84 + canyon * 0.58 + plateau * 0.16;
      if (local < 0.16) continue;

      const radiusX = 0.8 + local * 2.2;
      const radiusY = 0.4 + local * 1.0;

      ctx.translate(point.x, point.y);
      ctx.rotate((sampleVisualNoise(sample, 7013, 8, 9) * 0.50) + (sample?.latDeg ?? 0) * 0.004);

      ctx.globalAlpha = clamp(local * 0.06, 0.018, 0.08);
      ctx.fillStyle = canyon > ridge
        ? "rgba(62,42,34,1)"
        : "rgba(250,246,238,1)";

      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  ctx.restore();
}

function drawClouds(ctx, grid, projectPoint) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 4) {
    for (let x = 0; x < grid[y].length; x += 4) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample?.rainfall ?? 0) * 0.54 +
        (sample?.evaporationPressure ?? 0) * 0.16 +
        (sample?.maritimeInfluence ?? 0) * 0.14,
        0,
        1
      );

      if (cloudiness < 0.50) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, projectionStateOffset(sample) + 5);
      if (!point.visible) continue;

      const radius = 1.2 + cloudiness * 4.8;
      const alpha = 0.03 + cloudiness * 0.10;

      const grad = ctx.createRadialGradient(
        point.x - radius * 0.2,
        point.y - radius * 0.25,
        radius * 0.15,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(255,255,255,${(alpha * 1.30).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(248,250,255,${alpha.toFixed(3)})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPolarGlow(ctx, grid, projectPoint) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 5) {
    for (let x = 0; x < grid[y].length; x += 5) {
      const sample = grid[y][x];
      const aurora = clamp(sample?.auroralPotential ?? 0, 0, 1);
      if (aurora < 0.46) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, projectionStateOffset(sample) + 8);
      if (!point.visible) continue;

      const radius = 1.4 + aurora * 4.4;
      const alpha = 0.02 + aurora * 0.08;

      const grad = ctx.createRadialGradient(
        point.x,
        point.y,
        radius * 0.12,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(136,255,186,${(alpha * 1.16).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(96,220,255,${(alpha * 0.92).toFixed(3)})`);
      grad.addColorStop(1, "rgba(96,220,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawLighting(ctx, projectionState) {
  ctx.save();

  const light = ctx.createRadialGradient(
    projectionState.centerX - projectionState.radius * 0.36,
    projectionState.centerY - projectionState.radius * 0.42,
    projectionState.radius * 0.04,
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.12
  );

  light.addColorStop(0, "rgba(255,255,255,0.18)");
  light.addColorStop(0.42, "rgba(255,255,255,0.06)");
  light.addColorStop(1, "rgba(0,0,0,0.14)");

  withPlanetClip(ctx, projectionState, () => {
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, projectionState.width, projectionState.height);
  });

  ctx.restore();
}

function drawPlanetOutline(ctx, projectionState) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "rgba(190,220,255,0.42)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function normalizeOrbitalSystem(input, projectionState) {
  const source = normalizeObject(input);
  const phase = isFiniteNumber(source.phase) ? source.phase : 0;
  const objects = normalizeArray(source.objects);
  const altitudeFactor = isFiniteNumber(source.altitudeFactor)
    ? source.altitudeFactor
    : 0.42;

  return Object.freeze({
    phase,
    altitudePx: projectionState.radius * altitudeFactor,
    objects
  });
}

function buildOrbitalProjections(orbitalSystem, projectPoint) {
  return orbitalSystem.objects.map((object, index) => {
    const source = normalizeObject(object);
    const baseLatDeg = isFiniteNumber(source.baseLatDeg) ? source.baseLatDeg : 0;
    const baseLonDeg = isFiniteNumber(source.baseLonDeg) ? source.baseLonDeg : 0;
    const bearingOffsetDeg = isFiniteNumber(source.bearingOffsetDeg) ? source.bearingOffsetDeg : 0;
    const spinOffsetRad = isFiniteNumber(source.spinOffsetRad) ? source.spinOffsetRad : 0;
    const spinMultiplier = isFiniteNumber(source.spinMultiplier) ? source.spinMultiplier : 1.35;
    const sizePx = isFiniteNumber(source.sizePx) ? source.sizePx : 52;

    const lonDeg = baseLonDeg + bearingOffsetDeg + ((orbitalSystem.phase * 180) / Math.PI);
    const point = projectPoint(baseLatDeg, lonDeg, orbitalSystem.altitudePx);
    const edgeVisibility = clamp((point.z + 0.08) / 0.30, 0, 1);
    const frontFacing = point.z >= 0;
    const scale = 0.82 + edgeVisibility * 0.34;
    const opacity = frontFacing
      ? 0.42 + edgeVisibility * 0.58
      : edgeVisibility * 0.34;

    return Object.freeze({
      id: typeof source.id === "string" ? source.id : `orbital-${index}`,
      label: typeof source.label === "string" ? source.label : "NODE",
      route: typeof source.route === "string" ? source.route : "/",
      point,
      frontFacing,
      opacity,
      scale,
      sizePx: sizePx * scale,
      spinRad: orbitalSystem.phase * spinMultiplier + spinOffsetRad
    });
  });
}

function drawStarCompass(ctx, object, interactive = false) {
  const { point, sizePx, spinRad, opacity, label } = object;
  const outerW = sizePx * 0.94;
  const outerH = sizePx * 1.16;
  const innerW = sizePx * 0.56;
  const innerH = sizePx * 0.68;

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(spinRad);
  ctx.globalAlpha = opacity;

  const halo = ctx.createRadialGradient(0, 0, sizePx * 0.12, 0, 0, sizePx * 1.55);
  halo.addColorStop(0, "rgba(255,244,210,0.34)");
  halo.addColorStop(0.55, "rgba(212,175,74,0.12)");
  halo.addColorStop(1, "rgba(212,175,74,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 1.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = interactive ? "rgba(248,228,172,0.96)" : "rgba(238,214,160,0.72)";
  ctx.lineWidth = Math.max(1.3, sizePx * 0.05);

  ctx.beginPath();
  ctx.moveTo(0, -outerH);
  ctx.lineTo(outerW * 0.18, -innerH);
  ctx.lineTo(outerW, 0);
  ctx.lineTo(outerW * 0.18, innerH);
  ctx.lineTo(0, outerH);
  ctx.lineTo(-outerW * 0.18, innerH);
  ctx.lineTo(-outerW, 0);
  ctx.lineTo(-outerW * 0.18, -innerH);
  ctx.closePath();

  const fill = ctx.createLinearGradient(-outerW, -outerH, outerW, outerH);
  fill.addColorStop(0, "rgba(112,34,38,0.92)");
  fill.addColorStop(0.48, "rgba(152,84,58,0.88)");
  fill.addColorStop(1, "rgba(182,138,88,0.88)");
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -outerH);
  ctx.lineTo(0, outerH);
  ctx.moveTo(-outerW, 0);
  ctx.lineTo(outerW, 0);
  ctx.moveTo(-outerW * 0.18, -innerH);
  ctx.lineTo(outerW * 0.18, innerH);
  ctx.moveTo(outerW * 0.18, -innerH);
  ctx.lineTo(-outerW * 0.18, innerH);
  ctx.strokeStyle = "rgba(248,228,172,0.92)";
  ctx.lineWidth = Math.max(1.0, sizePx * 0.035);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, Math.max(2.4, sizePx * 0.10), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(250,240,220,0.94)";
  ctx.fill();

  ctx.rotate(-spinRad);
  ctx.fillStyle = "rgba(255,248,236,0.96)";
  ctx.font = `900 ${Math.max(10, sizePx * 0.19)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, 0);

  ctx.restore();
}

function drawOrbitalObjects(ctx, orbitalProjections, drawFront) {
  const hits = [];

  for (const object of orbitalProjections) {
    if (drawFront && !object.frontFacing) continue;
    if (!drawFront && object.frontFacing) continue;
    if (object.opacity <= 0.01) continue;

    drawStarCompass(ctx, object, drawFront);

    if (drawFront && object.opacity > 0.22) {
      hits.push(Object.freeze({
        id: object.id,
        label: object.label,
        route: object.route,
        x: object.point.x,
        y: object.point.y,
        radius: object.sizePx * 0.72
      }));
    }
  }

  return hits;
}

function buildRenderAudit(planetField) {
  const grid = sampleGrid(planetField);
  let waterFamilyCount = 0;
  let landFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;

  for (const row of grid) {
    for (const sample of row) {
      if (isWaterFamily(sample)) waterFamilyCount += 1;
      if (isLandFamily(sample)) landFamilyCount += 1;
      if (isCryosphere(sample)) cryosphereCount += 1;
      if (isShoreTransition(sample)) shorelineCount += 1;
    }
  }

  return Object.freeze({
    sampleCount: Array.isArray(planetField?.samples)
      ? planetField.samples.reduce((total, row) => total + (Array.isArray(row) ? row.length : 0), 0)
      : 0,
    waterFamilyCount,
    landFamilyCount,
    cryosphereCount,
    shorelineCount,
    summary: normalizeObject(planetField?.summary)
  });
}

export function createRenderer() {
  function renderPlanet({
    ctx,
    planetField,
    projectPoint,
    viewState = {},
    orbitalSystem = null
  }) {
    if (!ctx || !planetField) {
      throw new Error("renderPlanet requires ctx and planetField.");
    }

    const grid = sampleGrid(planetField);
    const projectionState = getProjectionState(viewState, ctx);
    const projector = resolveProjectPoint(projectPoint, projectionState);
    const orbitalConfig = orbitalSystem
      ? normalizeOrbitalSystem(orbitalSystem, projectionState)
      : null;
    const orbitalProjections = orbitalConfig
      ? buildOrbitalProjections(orbitalConfig, projector)
      : [];

    ctx.clearRect(0, 0, projectionState.width, projectionState.height);

    drawSpace(ctx, projectionState, viewState);
    drawOrbitalObjects(ctx, orbitalProjections, false);
    drawAtmosphere(ctx, projectionState);
    drawOceanBase(ctx, projectionState);

    withPlanetClip(ctx, projectionState, () => {
      drawOceanMesh(ctx, grid, projector);
      drawTerrainMesh(ctx, grid, projector);
      drawCoastHighlights(ctx, grid, projector);
      drawReliefRidges(ctx, grid, projector);
      drawClouds(ctx, grid, projector);
      drawPolarGlow(ctx, grid, projector);
      drawLighting(ctx, projectionState);
    });

    drawPlanetOutline(ctx, projectionState);

    const orbitalHits = drawOrbitalObjects(ctx, orbitalProjections, true);

    return Object.freeze({
      projectionState,
      orbitalHits: Object.freeze(orbitalHits),
      orbitalAudit: Object.freeze({
        count: orbitalProjections.length,
        frontVisibleCount: orbitalHits.length
      }),
      audit: buildRenderAudit(planetField)
    });
  }

  return Object.freeze({
    renderPlanet
  });
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}
