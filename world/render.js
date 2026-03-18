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

function sampleAt(grid, x, y) {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  if (!h || !w) return null;

  const yy = clamp(y, 0, h - 1);
  let xx = x;
  while (xx < 0) xx += w;
  while (xx >= w) xx -= w;

  return grid[yy]?.[xx] ?? null;
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

function pointFromSample(sample, projectPoint, radiusScale = 1) {
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const radiusOffset = radiusScale * elevation * 16;
  return projectPoint(sample.latDeg, sample.lonDeg, radiusOffset);
}

function shouldDrawQuad(points) {
  return points.some((point) => point?.visible === true);
}

function avg4(a, b, c, d) {
  return (a + b + c + d) * 0.25;
}

function rgba(r, g, b, a) {
  return `rgba(${clamp(Math.round(r), 0, 255)}, ${clamp(Math.round(g), 0, 255)}, ${clamp(Math.round(b), 0, 255)}, ${clamp(a, 0, 1).toFixed(4)})`;
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

function quadBounds(p00, p10, p11, p01) {
  const minX = Math.min(p00.x, p10.x, p11.x, p01.x);
  const maxX = Math.max(p00.x, p10.x, p11.x, p01.x);
  const minY = Math.min(p00.y, p10.y, p11.y, p01.y);
  const maxY = Math.max(p00.y, p10.y, p11.y, p01.y);
  return { minX, maxX, minY, maxY };
}

function drawGradientQuad(ctx, p00, p10, p11, p01, c0, c1, alpha = 1) {
  const bounds = quadBounds(p00, p10, p11, p01);
  const gradient = ctx.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  gradient.addColorStop(0, c0);
  gradient.addColorStop(1, c1);
  drawQuad(ctx, p00, p10, p11, p01, gradient, alpha);
}

function drawSpace(ctx, projectionState, viewState = {}) {
  ctx.save();

  const gradient = ctx.createLinearGradient(0, 0, 0, projectionState.height);
  gradient.addColorStop(0, "#020611");
  gradient.addColorStop(0.32, "#071121");
  gradient.addColorStop(0.68, "#0a1730");
  gradient.addColorStop(1, "#091325");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const nebulaA = ctx.createRadialGradient(
    projectionState.centerX * 0.58,
    projectionState.centerY * 0.32,
    projectionState.radius * 0.08,
    projectionState.centerX * 0.58,
    projectionState.centerY * 0.32,
    projectionState.radius * 1.18
  );
  nebulaA.addColorStop(0, "rgba(110,150,255,0.10)");
  nebulaA.addColorStop(0.5, "rgba(76,116,220,0.06)");
  nebulaA.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = nebulaA;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const nebulaB = ctx.createRadialGradient(
    projectionState.centerX * 1.36,
    projectionState.centerY * 0.88,
    projectionState.radius * 0.05,
    projectionState.centerX * 1.06,
    projectionState.centerY * 0.88,
    projectionState.radius * 1.02
  );
  nebulaB.addColorStop(0, "rgba(155,110,255,0.06)");
  nebulaB.addColorStop(0.48, "rgba(98,76,180,0.04)");
  nebulaB.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = nebulaB;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const seed = Math.round(
    (isFiniteNumber(viewState.seed) ? viewState.seed : 1) * 9973 +
    projectionState.width +
    projectionState.height
  );

  for (let i = 0; i < 180; i += 1) {
    const rx = Math.abs(Math.sin(seed + i * 13.17));
    const ry = Math.abs(Math.cos(seed + i * 7.91));
    const rs = 0.35 + (Math.abs(Math.sin(seed + i * 2.31)) * 1.9);
    const x = rx * projectionState.width;
    const y = ry * projectionState.height;
    const alpha = 0.12 + Math.abs(Math.cos(seed + i * 0.77)) * 0.46;

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
    projectionState.radius * 0.78,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  glow.addColorStop(0, "rgba(40,120,255,0.00)");
  glow.addColorStop(0.60, "rgba(44,138,255,0.09)");
  glow.addColorStop(0.82, "rgba(74,170,255,0.14)");
  glow.addColorStop(1, "rgba(126,206,255,0.20)");

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

  const rim = ctx.createRadialGradient(
    projectionState.centerX - projectionState.radius * 0.34,
    projectionState.centerY - projectionState.radius * 0.44,
    projectionState.radius * 0.12,
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.08
  );
  rim.addColorStop(0, "rgba(255,255,255,0.03)");
  rim.addColorStop(0.56, "rgba(120,195,255,0.04)");
  rim.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.06,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

function drawOceanBase(ctx, projectionState) {
  withPlanetClip(ctx, projectionState, () => {
    const oceanGradient = ctx.createRadialGradient(
      projectionState.centerX - projectionState.radius * 0.24,
      projectionState.centerY - projectionState.radius * 0.34,
      projectionState.radius * 0.10,
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius
    );

    oceanGradient.addColorStop(0, "rgb(70,132,205)");
    oceanGradient.addColorStop(0.38, "rgb(36,92,162)");
    oceanGradient.addColorStop(0.72, "rgb(18,54,110)");
    oceanGradient.addColorStop(1, "rgb(9,26,64)");

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

function surfaceBaseColor(sample) {
  const tc = terrainClass(sample);
  const biome = biomeType(sample);
  const surface = surfaceMaterial(sample);
  const climate = climateBand(sample);

  const elevation = clamp(sample?.elevation ?? 0, 0, 1);
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);

  let r = 98;
  let g = 114;
  let b = 88;

  if (biome === "TROPICAL_RAINFOREST") {
    r = 34; g = 88; b = 46;
  } else if (biome === "TROPICAL_GRASSLAND") {
    r = 132; g = 142; b = 80;
  } else if (biome === "TEMPERATE_FOREST") {
    r = 58; g = 98; b = 62;
  } else if (biome === "TEMPERATE_GRASSLAND") {
    r = 145; g = 150; b = 100;
  } else if (biome === "DESERT") {
    r = 184; g = 150; b = 96;
  } else if (biome === "TUNDRA") {
    r = 126; g = 128; b = 120;
  } else if (biome === "WETLAND") {
    r = 72; g = 102; b = 82;
  } else if (biome === "BOREAL_FOREST") {
    r = 66; g = 84; b = 70;
  } else if (biome === "GLACIER") {
    r = 212; g = 222; b = 234;
  }

  if (surface === "BEDROCK") {
    r += 18; g += 12; b += 10;
  } else if (surface === "GRAVEL") {
    r += 10; g += 8; b += 6;
  } else if (surface === "SAND") {
    r += 26; g += 20; b += 4;
  } else if (surface === "SILT") {
    r += 12; g += 10; b += 8;
  } else if (surface === "CLAY") {
    r += 18; g -= 6; b -= 4;
  } else if (surface === "SOIL") {
    r += 6; g += 8; b -= 4;
  } else if (surface === "ICE") {
    r = 218; g = 228; b = 238;
  } else if (surface === "SNOW") {
    r = 240; g = 242; b = 246;
  }

  if (tc === "BEACH") {
    r = 198; g = 176; b = 118;
  } else if (tc === "SHORELINE") {
    r += 14; g += 12; b += 4;
  } else if (tc === "BASIN") {
    r -= 10; g += 8; b -= 8;
  } else if (tc === "CANYON") {
    r += 30; g -= 14; b -= 16;
  } else if (tc === "RIDGE") {
    r += 10; g += 6; b += 4;
  } else if (tc === "PLATEAU") {
    r += 12; g += 10; b += 8;
  } else if (tc === "MOUNTAIN") {
    r += 28; g += 26; b += 28;
  } else if (tc === "SUMMIT") {
    r += 46; g += 44; b += 48;
  } else if (tc === "GLACIAL_HIGHLAND" || tc === "POLAR_ICE") {
    r = 214; g = 224; b = 236;
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    r += Math.round(freeze * 18);
    g += Math.round(freeze * 18);
    b += Math.round(freeze * 24);
  } else if (climate === "EQUATORIAL" || climate === "TROPICAL") {
    g += Math.round(rainfall * 10);
  }

  r += Math.round(elevation * 10 + ridge * 12 - basin * 6);
  g += Math.round(rainfall * 8 - freeze * 2);
  b += Math.round(freeze * 8);

  return { r, g, b };
}

function oceanBaseColor(sample) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? 0, -1, 0));
  const runoff = clamp(sample?.runoff ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const climate = climateBand(sample);
  const tc = terrainClass(sample);
  const shore = isShoreTransition(sample);

  let r = 22;
  let g = 78;
  let b = 150;

  if (tc === "SHELF") {
    r = 44; g = 106; b = 168;
  } else if (depth > 0.30 && depth <= 0.12) {
    r = 38; g = 96; b = 164;
  } else if (depth > 0.12 && depth <= 0.22) {
    r = 24; g = 76; b = 144;
  } else if (depth > 0.22 && depth <= 0.34) {
    r = 16; g = 52; b = 112;
  } else if (depth > 0.34) {
    r = 8; g = 28; b = 76;
  }

  g += Math.round(runoff * 20);
  if (shore) {
    r += 10; g += 14; b -= 8;
  }

  if (climate === "POLAR" || climate === "SUBPOLAR") {
    r += Math.round(freeze * 24);
    g += Math.round(freeze * 18);
    b += Math.round(freeze * 18);
  }

  return { r, g, b };
}

function computeSampleShade(sample, grid, x, y) {
  const left = sampleAt(grid, x - 1, y) ?? sample;
  const right = sampleAt(grid, x + 1, y) ?? sample;
  const up = sampleAt(grid, x, y - 1) ?? sample;
  const down = sampleAt(grid, x, y + 1) ?? sample;

  const eL = left.elevation ?? 0;
  const eR = right.elevation ?? 0;
  const eU = up.elevation ?? 0;
  const eD = down.elevation ?? 0;

  const dx = eR - eL;
  const dy = eD - eU;

  const nx = -dx * 2.15;
  const ny = -dy * 2.15;
  const nz = 1.0;
  const length = Math.max(1e-6, Math.sqrt(nx * nx + ny * ny + nz * nz));

  const nnx = nx / length;
  const nny = ny / length;
  const nnz = nz / length;

  const lx = -0.52;
  const ly = -0.66;
  const lz = 0.54;
  const light = clamp((nnx * lx) + (nny * ly) + (nnz * lz), -1, 1);

  const slope = clamp(sample?.slope ?? 0, 0, 1);
  const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
  const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
  const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);

  return Object.freeze({
    light,
    slope,
    ridge,
    basin,
    canyon,
    shadow: clamp((0.5 - light) * 0.62 + basin * 0.12 + canyon * 0.18, 0, 0.82),
    highlight: clamp((light - 0.04) * 0.56 + ridge * 0.08, 0, 0.58)
  });
}

function waterColorForSample(sample, shade) {
  const base = oceanBaseColor(sample);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const shoreline = isShoreTransition(sample);

  const lightMod = shade.light * 26;
  const depthDarken = Math.abs(clamp(sample?.oceanDepthField ?? 0, -1, 0)) * 34;
  const highlight = shade.highlight * 20;

  let r = base.r + lightMod + highlight - depthDarken * 0.10;
  let g = base.g + lightMod * 0.8 + highlight - depthDarken * 0.18;
  let b = base.b + lightMod * 0.6 + highlight - depthDarken * 0.10;

  if (shoreline) {
    r += 10;
    g += 8;
    b -= 8;
  }

  if (freeze > 0.45) {
    r += freeze * 18;
    g += freeze * 18;
    b += freeze * 14;
  }

  return { r, g, b };
}

function landColorForSample(sample, shade) {
  const base = surfaceBaseColor(sample);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const sediment = clamp(sample?.sedimentLoad ?? 0, 0, 1);
  const mountainBoost = Math.max(0, (sample?.elevation ?? 0) - 0.24);

  const lightMod = shade.light * 22;
  const ridgeLift = shade.ridge * 12;
  const basinDark = shade.basin * 12;
  const canyonDark = shade.canyon * 18;
  const sedimentWarm = sediment * 8;

  let r = base.r + lightMod + ridgeLift + sedimentWarm - basinDark - canyonDark;
  let g = base.g + lightMod * 0.82 + rainfall * 8 - canyonDark * 0.55;
  let b = base.b + lightMod * 0.68 + freeze * 12 + mountainBoost * 10 - sedimentWarm * 0.3;

  if (terrainClass(sample) === "SUMMIT") {
    r += 12;
    g += 12;
    b += 14;
  }

  return { r, g, b };
}

function alphaForSample(sample) {
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const magnetic = clamp(sample?.auroralPotential ?? 0, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const water = isWaterFamily(sample);
  const shore = isShoreTransition(sample);

  let alpha = water ? 0.82 : 0.70;
  alpha += rainfall * 0.05;
  alpha += magnetic * 0.02;
  alpha += freeze * 0.03;
  if (shore) alpha += 0.03;

  return clamp(alpha, 0.42, 0.96);
}

function colorForSample(sample, shade) {
  const base = isWaterFamily(sample)
    ? waterColorForSample(sample, shade)
    : landColorForSample(sample, shade);

  return rgba(base.r, base.g, base.b, 1);
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

      const p00 = pointFromSample(s00, projectPoint, 0.52);
      const p10 = pointFromSample(s10, projectPoint, 0.52);
      const p01 = pointFromSample(s01, projectPoint, 0.52);
      const p11 = pointFromSample(s11, projectPoint, 0.52);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const centerSample = {
        oceanDepthField: avg4(
          s00.oceanDepthField ?? 0,
          s10.oceanDepthField ?? 0,
          s11.oceanDepthField ?? 0,
          s01.oceanDepthField ?? 0
        ),
        runoff: avg4(
          s00.runoff ?? 0,
          s10.runoff ?? 0,
          s11.runoff ?? 0,
          s01.runoff ?? 0
        ),
        freezePotential: avg4(
          s00.freezePotential ?? 0,
          s10.freezePotential ?? 0,
          s11.freezePotential ?? 0,
          s01.freezePotential ?? 0
        ),
        waterMask: 1,
        terrainClass:
          terrainClass(s00) === "SHELF" ||
          terrainClass(s10) === "SHELF" ||
          terrainClass(s11) === "SHELF" ||
          terrainClass(s01) === "SHELF"
            ? "SHELF"
            : "WATER",
        shoreline:
          s00.shoreline || s10.shoreline || s11.shoreline || s01.shoreline,
        shorelineBand:
          s00.shorelineBand || s10.shorelineBand || s11.shorelineBand || s01.shorelineBand,
        climateBandField: climateBand(s00)
      };

      const shade = computeSampleShade(centerSample, grid, x, y);
      const fill = colorForSample(centerSample, shade);
      drawQuad(ctx, p00, p10, p11, p01, fill, alphaForSample(centerSample));

      if (terrainClass(centerSample) === "SHELF" || isShoreTransition(centerSample)) {
        drawGradientQuad(
          ctx,
          p00, p10, p11, p01,
          "rgba(255,255,255,0.06)",
          "rgba(255,255,255,0.00)",
          0.42
        );
      }
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

      const p00 = pointFromSample(s00, projectPoint, 1.06);
      const p10 = pointFromSample(s10, projectPoint, 1.06);
      const p01 = pointFromSample(s01, projectPoint, 1.06);
      const p11 = pointFromSample(s11, projectPoint, 1.06);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const centerSample = {
        landMask: 1,
        elevation: avg4(
          s00.elevation ?? 0,
          s10.elevation ?? 0,
          s11.elevation ?? 0,
          s01.elevation ?? 0
        ),
        rainfall: avg4(
          s00.rainfall ?? 0,
          s10.rainfall ?? 0,
          s11.rainfall ?? 0,
          s01.rainfall ?? 0
        ),
        freezePotential: avg4(
          s00.freezePotential ?? 0,
          s10.freezePotential ?? 0,
          s11.freezePotential ?? 0,
          s01.freezePotential ?? 0
        ),
        basinStrength: avg4(
          s00.basinStrength ?? 0,
          s10.basinStrength ?? 0,
          s11.basinStrength ?? 0,
          s01.basinStrength ?? 0
        ),
        ridgeStrength: avg4(
          s00.ridgeStrength ?? 0,
          s10.ridgeStrength ?? 0,
          s11.ridgeStrength ?? 0,
          s01.ridgeStrength ?? 0
        ),
        canyonStrength: avg4(
          s00.canyonStrength ?? 0,
          s10.canyonStrength ?? 0,
          s11.canyonStrength ?? 0,
          s01.canyonStrength ?? 0
        ),
        sedimentLoad: avg4(
          s00.sedimentLoad ?? 0,
          s10.sedimentLoad ?? 0,
          s11.sedimentLoad ?? 0,
          s01.sedimentLoad ?? 0
        ),
        slope: avg4(
          s00.slope ?? 0,
          s10.slope ?? 0,
          s11.slope ?? 0,
          s01.slope ?? 0
        ),
        terrainClass: terrainClass(s00),
        biomeType: biomeType(s00),
        surfaceMaterial: surfaceMaterial(s00),
        climateBandField: climateBand(s00)
      };

      const shade = computeSampleShade(centerSample, grid, x, y);
      const baseFill = colorForSample(centerSample, shade);
      drawQuad(ctx, p00, p10, p11, p01, baseFill, alphaForSample(centerSample));

      if (shade.highlight > 0.06) {
        const hi = clamp(shade.highlight * 0.46, 0, 0.34);
        drawGradientQuad(
          ctx,
          p00, p10, p11, p01,
          `rgba(255,255,255,${hi.toFixed(4)})`,
          "rgba(255,255,255,0.00)",
          0.9
        );
      }

      if (shade.shadow > 0.10) {
        const sh = clamp(shade.shadow * 0.42, 0, 0.34);
        drawGradientQuad(
          ctx,
          p00, p10, p11, p01,
          "rgba(0,0,0,0.00)",
          `rgba(0,0,0,${sh.toFixed(4)})`,
          1
        );
      }

      if (terrainClass(centerSample) === "CANYON" || terrainClass(centerSample) === "BASIN") {
        drawQuad(ctx, p00, p10, p11, p01, "rgba(30,20,18,0.10)", 0.65);
      }
    }
  }
}

function drawClouds(ctx, grid, projectPoint) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let y = 0; y < grid.length; y += 3) {
    for (let x = 0; x < grid[y].length; x += 3) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample?.rainfall ?? 0) * 0.66 +
        (sample?.evaporationPressure ?? 0) * 0.20 +
        (sample?.basinAccumulation ?? 0) * 0.10,
        0,
        1
      );

      if (cloudiness < 0.42) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, 12 + clamp(sample.elevation ?? 0, 0, 1) * 6);
      if (!point.visible) continue;

      const radius = 1.8 + cloudiness * 7.8;
      const gradient = ctx.createRadialGradient(
        point.x - radius * 0.28,
        point.y - radius * 0.36,
        radius * 0.12,
        point.x,
        point.y,
        radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.22)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0.08)");
      gradient.addColorStop(1, "rgba(255,255,255,0.00)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawLighting(ctx, projectionState) {
  ctx.save();

  const day = ctx.createRadialGradient(
    projectionState.centerX - projectionState.radius * 0.38,
    projectionState.centerY - projectionState.radius * 0.42,
    projectionState.radius * 0.04,
    projectionState.centerX - projectionState.radius * 0.18,
    projectionState.centerY - projectionState.radius * 0.14,
    projectionState.radius * 1.10
  );
  day.addColorStop(0, "rgba(255,255,255,0.18)");
  day.addColorStop(0.42, "rgba(255,255,255,0.06)");
  day.addColorStop(1, "rgba(255,255,255,0.00)");

  const night = ctx.createRadialGradient(
    projectionState.centerX + projectionState.radius * 0.34,
    projectionState.centerY + projectionState.radius * 0.30,
    projectionState.radius * 0.08,
    projectionState.centerX + projectionState.radius * 0.34,
    projectionState.centerY + projectionState.radius * 0.30,
    projectionState.radius * 1.06
  );
  night.addColorStop(0, "rgba(0,0,0,0.00)");
  night.addColorStop(0.56, "rgba(0,0,0,0.06)");
  night.addColorStop(1, "rgba(0,0,0,0.18)");

  withPlanetClip(ctx, projectionState, () => {
    ctx.fillStyle = day;
    ctx.fillRect(0, 0, projectionState.width, projectionState.height);
    ctx.fillStyle = night;
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
  ctx.strokeStyle = "rgba(182,220,255,0.38)";
  ctx.lineWidth = 1.15;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.014,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "rgba(110,182,255,0.12)";
  ctx.lineWidth = projectionState.radius * 0.018;
  ctx.stroke();

  ctx.restore();
}

function drawLimbShadow(ctx, projectionState) {
  ctx.save();

  const limb = ctx.createRadialGradient(
    projectionState.centerX + projectionState.radius * 0.28,
    projectionState.centerY + projectionState.radius * 0.22,
    projectionState.radius * 0.30,
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.05
  );
  limb.addColorStop(0.54, "rgba(0,0,0,0.00)");
  limb.addColorStop(0.82, "rgba(0,0,0,0.05)");
  limb.addColorStop(1, "rgba(0,0,0,0.16)");

  withPlanetClip(ctx, projectionState, () => {
    ctx.fillStyle = limb;
    ctx.fillRect(0, 0, projectionState.width, projectionState.height);
  });

  ctx.restore();
}

function normalizeOrbitalSystem(input, projectionState) {
  const source = normalizeObject(input);
  const phase = isFiniteNumber(source.phase) ? source.phase : 0;
  const objects = normalizeArray(source.objects);
  const altitudeFactor = isFiniteNumber(source.altitudeFactor)
    ? source.altitudeFactor
    : 0.42;
  const transition = normalizeObject(source.transition);

  return Object.freeze({
    phase,
    altitudePx: projectionState.radius * altitudeFactor,
    objects,
    transition
  });
}

function buildOrbitalProjections(orbitalSystem, projectPoint) {
  return orbitalSystem.objects.map((object, index) => {
    const source = normalizeObject(object);
    const baseLatDeg = isFiniteNumber(source.baseLatDeg) ? source.baseLatDeg : 0;
    const baseLonDeg = isFiniteNumber(source.baseLonDeg) ? source.baseLonDeg : 0;
    const bearingOffsetDeg = isFiniteNumber(source.bearingOffsetDeg) ? source.bearingOffsetDeg : 0;
    const spinOffsetRad = isFiniteNumber(source.spinOffsetRad) ? source.spinOffsetRad : 0;
    const spinMultiplier = isFiniteNumber(source.spinMultiplier) ? source.spinMultiplier : 1.25;
    const sizePx = isFiniteNumber(source.sizePx) ? source.sizePx : 54;

    const lonDeg = baseLonDeg + bearingOffsetDeg + ((orbitalSystem.phase * 180) / Math.PI);
    const point = projectPoint(baseLatDeg, lonDeg, orbitalSystem.altitudePx);
    const edgeVisibility = clamp((point.z + 0.10) / 0.34, 0, 1);
    const frontFacing = point.z >= 0;
    const scale = 0.84 + edgeVisibility * 0.30;
    const opacity = frontFacing
      ? 0.48 + edgeVisibility * 0.52
      : edgeVisibility * 0.30;

    return Object.freeze({
      id: typeof source.id === "string" ? source.id : `orbital-${index}`,
      label: typeof source.label === "string" ? source.label : "NODE",
      symbol: typeof source.symbol === "string" ? source.symbol : "",
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

function drawCompassGlowOrbital(ctx, object, interactive = false) {
  const { point, sizePx, spinRad, opacity, label, symbol } = object;
  const line = Math.max(1.1, sizePx * 0.036);
  const arm = sizePx * 0.72;
  const inner = sizePx * 0.20;
  const labelY = sizePx * 0.66;
  const symbolY = -sizePx * 0.66;

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.globalAlpha = opacity;

  const halo = ctx.createRadialGradient(0, 0, sizePx * 0.06, 0, 0, sizePx * 1.42);
  halo.addColorStop(0, "rgba(255,255,255,0.30)");
  halo.addColorStop(0.36, "rgba(170,208,255,0.12)");
  halo.addColorStop(0.68, "rgba(110,160,255,0.05)");
  halo.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 1.34, 0, Math.PI * 2);
  ctx.fill();

  const bloom = ctx.createRadialGradient(0, 0, sizePx * 0.03, 0, 0, sizePx * 0.46);
  bloom.addColorStop(0, "rgba(255,255,255,0.95)");
  bloom.addColorStop(0.34, "rgba(205,230,255,0.36)");
  bloom.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 0.46, 0, Math.PI * 2);
  ctx.fill();

  ctx.rotate(spinRad);

  ctx.lineCap = "round";
  ctx.strokeStyle = interactive ? "rgba(255,255,255,0.86)" : "rgba(235,242,255,0.64)";
  ctx.lineWidth = line;

  ctx.beginPath();
  ctx.moveTo(0, -arm);
  ctx.lineTo(0, -inner);
  ctx.moveTo(0, inner);
  ctx.lineTo(0, arm);
  ctx.moveTo(-arm, 0);
  ctx.lineTo(-inner, 0);
  ctx.moveTo(inner, 0);
  ctx.lineTo(arm, 0);
  ctx.stroke();

  ctx.lineWidth = Math.max(0.8, line * 0.68);
  ctx.strokeStyle = interactive ? "rgba(190,220,255,0.78)" : "rgba(170,200,255,0.52)";
  ctx.beginPath();
  ctx.moveTo(-arm * 0.58, -arm * 0.58);
  ctx.lineTo(-inner * 0.9, -inner * 0.9);
  ctx.moveTo(arm * 0.58, -arm * 0.58);
  ctx.lineTo(inner * 0.9, -inner * 0.9);
  ctx.moveTo(-arm * 0.58, arm * 0.58);
  ctx.lineTo(-inner * 0.9, inner * 0.9);
  ctx.moveTo(arm * 0.58, arm * 0.58);
  ctx.lineTo(inner * 0.9, inner * 0.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 0.075, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, sizePx * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = Math.max(0.8, line * 0.5);
  ctx.stroke();

  ctx.rotate(-spinRad);

  if (symbol) {
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = `900 ${Math.max(10, sizePx * 0.19)}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, 0, symbolY);
  }

  ctx.fillStyle = "rgba(248,250,255,0.96)";
  ctx.font = `900 ${Math.max(10, sizePx * 0.18)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, labelY);

  ctx.restore();
}

function drawOrbitalObjects(ctx, orbitalProjections, drawFront) {
  const hits = [];

  for (const object of orbitalProjections) {
    if (drawFront && !object.frontFacing) continue;
    if (!drawFront && object.frontFacing) continue;
    if (object.opacity <= 0.01) continue;

    drawCompassGlowOrbital(ctx, object, drawFront);

    if (drawFront && object.opacity > 0.22) {
      hits.push(Object.freeze({
        id: object.id,
        label: object.label,
        route: object.route,
        x: object.point.x,
        y: object.point.y,
        radius: object.sizePx * 0.76
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
      drawLimbShadow(ctx, projectionState);
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
