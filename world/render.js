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
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius
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
  return 10 + elevation * 10;
}

function pointFromSample(sample, projectPoint, radiusScale = 1) {
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const radiusOffset = radiusScale * elevation * 16;
  return projectPoint(sample.latDeg, sample.lonDeg, radiusOffset);
}

function shouldDrawQuad(points) {
  return points.some((point) => point?.visible === true);
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
  gradient.addColorStop(0, "#020612");
  gradient.addColorStop(0.55, "#071428");
  gradient.addColorStop(1, "#0a1730");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const seed = Math.round(
    (isFiniteNumber(viewState.seed) ? viewState.seed : 1) * 9973 +
      projectionState.width +
      projectionState.height
  );

  for (let i = 0; i < 120; i += 1) {
    const rx = Math.abs(Math.sin(seed + i * 13.17));
    const ry = Math.abs(Math.cos(seed + i * 7.91));
    const rs = 0.4 + (Math.abs(Math.sin(seed + i * 2.31)) * 1.8);
    const x = rx * projectionState.width;
    const y = ry * projectionState.height;
    const alpha = 0.18 + Math.abs(Math.cos(seed + i * 0.77)) * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, rs, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fill();
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
    projectionState.radius * 0.8,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  glow.addColorStop(0, "rgba(40,120,255,0.00)");
  glow.addColorStop(0.65, "rgba(50,140,255,0.08)");
  glow.addColorStop(1, "rgba(80,170,255,0.18)");

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
      projectionState.centerX - projectionState.radius * 0.2,
      projectionState.centerY - projectionState.radius * 0.25,
      projectionState.radius * 0.1,
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius
    );

    oceanGradient.addColorStop(0, "rgb(56,118,190)");
    oceanGradient.addColorStop(0.55, "rgb(33,86,150)");
    oceanGradient.addColorStop(1, "rgb(16,45,92)");

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

function waterColorForSample(sample) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? 0, -1, 0));
  const runoff = clamp(sample?.runoff ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const climate = climateBand(sample);
  const shore = isShoreTransition(sample);

  let r = 28;
  let g = 86;
  let b = 155;

  b += Math.round(depth * 55);
  g += Math.round(runoff * 24);

  if (terrainClass(sample) === "SHELF") {
    r += 10;
    g += 18;
    b -= 8;
  }

  if (shore) {
    r += 12;
    g += 16;
    b -= 10;
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    r += Math.round(freeze * 28);
    g += Math.round(freeze * 18);
    b += Math.round(freeze * 20);
  }

  return `rgb(${clamp(r, 0, 255)}, ${clamp(g, 0, 255)}, ${clamp(b, 0, 255)})`;
}

function landColorForSample(sample) {
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

  let r = 92;
  let g = 112;
  let b = 88;

  if (biome === "TROPICAL_RAINFOREST") {
    r = 36; g = 92; b = 48;
  } else if (biome === "TROPICAL_GRASSLAND") {
    r = 128; g = 140; b = 78;
  } else if (biome === "TEMPERATE_FOREST") {
    r = 58; g = 98; b = 62;
  } else if (biome === "TEMPERATE_GRASSLAND") {
    r = 138; g = 146; b = 96;
  } else if (biome === "DESERT") {
    r = 176; g = 148; b = 96;
  } else if (biome === "TUNDRA") {
    r = 124; g = 128; b = 118;
  } else if (biome === "WETLAND") {
    r = 72; g = 102; b = 78;
  } else if (biome === "BOREAL_FOREST") {
    r = 66; g = 86; b = 70;
  } else if (biome === "GLACIER") {
    r = 208; g = 220; b = 232;
  }

  if (surface === "BEDROCK") {
    r += 18; g += 12; b += 10;
  } else if (surface === "GRAVEL") {
    r += 10; g += 8; b += 6;
  } else if (surface === "SAND") {
    r += 22; g += 18; b += 6;
  } else if (surface === "SILT") {
    r += 12; g += 10; b += 8;
  } else if (surface === "CLAY") {
    r += 18; g -= 6; b -= 2;
  } else if (surface === "SOIL") {
    r += 6; g += 8; b -= 4;
  } else if (surface === "ICE") {
    r = 218; g = 228; b = 238;
  } else if (surface === "SNOW") {
    r = 238; g = 240; b = 244;
  }

  if (tc === "BEACH") {
    r = 198; g = 176; b = 120;
  } else if (tc === "SHORELINE") {
    r += 16; g += 14; b += 2;
  } else if (tc === "BASIN") {
    r -= 10; g += 8; b -= 6;
  } else if (tc === "CANYON") {
    r += 28; g -= 10; b -= 10;
  } else if (tc === "RIDGE") {
    r += 8; g += 4; b += 2;
  } else if (tc === "PLATEAU") {
    r += 12; g += 10; b += 8;
  } else if (tc === "MOUNTAIN") {
    r += 24; g += 22; b += 24;
  } else if (tc === "SUMMIT") {
    r += 44; g += 42; b += 46;
  } else if (tc === "GLACIAL_HIGHLAND" || tc === "POLAR_ICE") {
    r = 210; g = 220; b = 232;
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    r += Math.round(freeze * 18);
    g += Math.round(freeze * 18);
    b += Math.round(freeze * 24);
  } else if (climate === "EQUATORIAL" || climate === "TROPICAL") {
    g += Math.round(rainfall * 12);
  }

  r += Math.round(elevation * 12 + ridge * 14 + sediment * 6 - basin * 8);
  g += Math.round(rainfall * 10 - freeze * 4);
  b += Math.round(freeze * 10);

  return `rgb(${clamp(r, 0, 255)}, ${clamp(g, 0, 255)}, ${clamp(b, 0, 255)})`;
}

function colorForSample(sample) {
  return isWaterFamily(sample) ? waterColorForSample(sample) : landColorForSample(sample);
}

function alphaForSample(sample) {
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const magnetic = clamp(sample?.auroralPotential ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const water = isWaterFamily(sample);
  const shore = isShoreTransition(sample);

  let alpha = water ? 0.78 : 0.62;
  alpha += rainfall * 0.06;
  alpha += magnetic * 0.03;
  alpha += freeze * 0.04;
  if (shore) alpha += 0.04;

  return clamp(alpha, 0.35, 0.92);
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

      drawQuad(ctx, p00, p10, p11, p01, colorForSample(s00), alphaForSample(s00));
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

      const p00 = pointFromSample(s00, projectPoint, 1);
      const p10 = pointFromSample(s10, projectPoint, 1);
      const p01 = pointFromSample(s01, projectPoint, 1);
      const p11 = pointFromSample(s11, projectPoint, 1);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      drawQuad(ctx, p00, p10, p11, p01, colorForSample(s00), alphaForSample(s00));
    }
  }
}

function drawClouds(ctx, grid, projectPoint) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.18)";

  for (let y = 0; y < grid.length; y += 3) {
    for (let x = 0; x < grid[y].length; x += 3) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample?.rainfall ?? 0) * 0.65 + (sample?.evaporationPressure ?? 0) * 0.2,
        0,
        1
      );

      if (cloudiness < 0.42) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, projectionStateOffset(sample));
      if (!point.visible) continue;

      const radius = 1.5 + cloudiness * 6.5;
      ctx.globalAlpha = 0.08 + cloudiness * 0.18;

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
    projectionState.centerX - projectionState.radius * 0.35,
    projectionState.centerY - projectionState.radius * 0.4,
    projectionState.radius * 0.05,
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.1
  );

  light.addColorStop(0, "rgba(255,255,255,0.22)");
  light.addColorStop(0.45, "rgba(255,255,255,0.08)");
  light.addColorStop(1, "rgba(0,0,0,0.16)");

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
  ctx.strokeStyle = "rgba(190,220,255,0.38)";
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

function drawStarCube(ctx, object, interactive = false) {
  const { point, sizePx, spinRad, opacity, label } = object;
  const coreHalfW = sizePx * 0.82;
  const coreHalfH = sizePx * 1.04;
  const inset = sizePx * 0.34;

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(spinRad);
  ctx.globalAlpha = opacity;

  const glow = ctx.createRadialGradient(0, 0, sizePx * 0.1, 0, 0, sizePx * 1.55);
  glow.addColorStop(0, "rgba(255,255,255,0.40)");
  glow.addColorStop(0.55, "rgba(255,255,255,0.08)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 1.45, 0, Math.PI * 2);
  ctx.fill();

  const outer = ctx.createLinearGradient(-coreHalfW, -coreHalfH, coreHalfW, coreHalfH);
  outer.addColorStop(0, "rgba(255,255,255,0.92)");
  outer.addColorStop(0.28, "rgba(230,236,245,0.88)");
  outer.addColorStop(1, "rgba(120,132,164,0.78)");

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.moveTo(0, -coreHalfH);
  ctx.lineTo(inset * 0.62, -inset);
  ctx.lineTo(coreHalfW, 0);
  ctx.lineTo(inset * 0.62, inset);
  ctx.lineTo(0, coreHalfH);
  ctx.lineTo(-inset * 0.62, inset);
  ctx.lineTo(-coreHalfW, 0);
  ctx.lineTo(-inset * 0.62, -inset);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = interactive ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.56)";
  ctx.lineWidth = Math.max(1.2, sizePx * 0.04);
  ctx.stroke();

  const inner = ctx.createRadialGradient(0, 0, sizePx * 0.06, 0, 0, sizePx * 0.92);
  inner.addColorStop(0, "rgba(18,24,36,0.96)");
  inner.addColorStop(0.55, "rgba(28,34,48,0.94)");
  inner.addColorStop(1, "rgba(58,68,92,0.58)");

  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.moveTo(0, -coreHalfH * 0.68);
  ctx.lineTo(inset * 0.34, -inset * 0.48);
  ctx.lineTo(coreHalfW * 0.68, 0);
  ctx.lineTo(inset * 0.34, inset * 0.48);
  ctx.lineTo(0, coreHalfH * 0.68);
  ctx.lineTo(-inset * 0.34, inset * 0.48);
  ctx.lineTo(-coreHalfW * 0.68, 0);
  ctx.lineTo(-inset * 0.34, -inset * 0.48);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = Math.max(0.8, sizePx * 0.018);
  ctx.beginPath();
  ctx.moveTo(0, -coreHalfH * 0.82);
  ctx.lineTo(0, coreHalfH * 0.82);
  ctx.moveTo(-coreHalfW * 0.82, 0);
  ctx.lineTo(coreHalfW * 0.82, 0);
  ctx.stroke();

  ctx.rotate(-spinRad);
  ctx.fillStyle = "rgba(9,13,22,0.92)";
  ctx.font = `900 ${Math.max(10, sizePx * 0.24)}px system-ui`;
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

    drawStarCube(ctx, object, drawFront);

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
      drawClouds(ctx, grid, projector);
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
