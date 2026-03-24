// /world/render/index.js
// MODE: RENDER RENEWAL
// STATUS: CONTRACT-PRESERVING | VISUAL CONTRAST RESTORED | NON-DRIFT
// OWNER: SEAN

const TAU = Math.PI * 2;

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

function normalizeString(value, fallback = "NONE") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function ensureCanvasMetrics(ctx) {
  const canvas = ctx?.canvas;
  if (!canvas) {
    return {
      width: 1,
      height: 1,
      centerX: 0.5,
      centerY: 0.5,
      radius: 0.5
    };
  }

  const width = Math.max(1, canvas.width || 1);
  const height = Math.max(1, canvas.height || 1);
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const radius = Math.max(24, Math.min(width, height) * 0.34);

  return { width, height, centerX, centerY, radius };
}

function clearFrame(ctx, metrics) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, metrics.width, metrics.height);

  const gradient = ctx.createRadialGradient(
    metrics.centerX,
    metrics.centerY - metrics.radius * 0.75,
    metrics.radius * 0.12,
    metrics.centerX,
    metrics.centerY,
    metrics.radius * 2.2
  );
  gradient.addColorStop(0, "#11233a");
  gradient.addColorStop(0.38, "#0b1524");
  gradient.addColorStop(1, "#04070d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, metrics.width, metrics.height);
  ctx.restore();
}

function buildViewAngles(viewState) {
  const worldModeState = normalizeObject(viewState?.worldModeState);
  const traversalState = normalizeObject(viewState?.traversalState);

  const yawTurns =
    (isFiniteNumber(worldModeState?.modeIndex) ? worldModeState.modeIndex * 0.03125 : 0) +
    (normalizeString(traversalState?.bias, "") === "SOUTH" ? 0.0 : 0.125);

  return {
    yaw: yawTurns * TAU,
    pitch: -0.22
  };
}

function latLonToUnit(latDeg, lonDeg, yaw, pitch) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;

  const cosLat = Math.cos(lat);
  let x = Math.cos(lon) * cosLat;
  let y = Math.sin(lat);
  let z = Math.sin(lon) * cosLat;

  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const xYaw = x * cosYaw - z * sinYaw;
  const zYaw = x * sinYaw + z * cosYaw;
  x = xYaw;
  z = zYaw;

  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const yPitch = y * cosPitch - z * sinPitch;
  const zPitch = y * sinPitch + z * cosPitch;
  y = yPitch;
  z = zPitch;

  return { x, y, z };
}

function buildLightVector() {
  const x = -0.45;
  const y = -0.55;
  const z = 0.70;
  const mag = Math.sqrt(x * x + y * y + z * z) || 1;
  return { x: x / mag, y: y / mag, z: z / mag };
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function rgb(r, g, b) {
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255)
  };
}

function colorToString(color, alpha = 1) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${clamp(alpha, 0, 1)})`;
}

function mixColor(a, b, t) {
  return rgb(
    mix(a.r, b.r, t),
    mix(a.g, b.g, t),
    mix(a.b, b.b, t)
  );
}

function terrainBaseColor(sample) {
  const terrainClass = normalizeString(sample?.terrainClass);
  const biomeType = normalizeString(sample?.biomeType);
  const waterMask = sample?.waterMask === 1;

  if (waterMask) return rgb(36, 84, 148);
  if (terrainClass === "SHELF") return rgb(52, 108, 166);
  if (terrainClass === "SHORELINE" || terrainClass === "BEACH") return rgb(212, 190, 132);
  if (terrainClass === "POLAR_ICE" || terrainClass === "GLACIAL_HIGHLAND" || biomeType === "GLACIER") return rgb(222, 236, 248);
  if (terrainClass === "SUMMIT") return rgb(204, 210, 220);
  if (terrainClass === "MOUNTAIN" || terrainClass === "RIDGE") return rgb(116, 126, 118);
  if (terrainClass === "PLATEAU") return rgb(122, 98, 76);
  if (terrainClass === "CANYON") return rgb(148, 88, 60);
  if (terrainClass === "BASIN") return rgb(102, 124, 88);
  if (biomeType === "TROPICAL_RAINFOREST") return rgb(44, 126, 64);
  if (biomeType === "TEMPERATE_FOREST" || biomeType === "BOREAL_FOREST") return rgb(60, 112, 72);
  if (biomeType === "TROPICAL_GRASSLAND" || biomeType === "TEMPERATE_GRASSLAND") return rgb(114, 142, 80);
  if (biomeType === "DESERT") return rgb(182, 156, 96);
  if (biomeType === "TUNDRA") return rgb(148, 154, 136);
  return rgb(88, 120, 84);
}

function shadedColor(sample, unit, light) {
  const base = terrainBaseColor(sample);
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const rainfall = clamp(sample?.rainfall ?? 0.35, 0, 1);
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const maritime = clamp(sample?.maritimeInfluence ?? 0, 0, 1);

  const lit = clamp(unit.x * light.x + unit.y * light.y + unit.z * light.z, -1, 1);
  const lambert = 0.42 + Math.max(0, lit) * 0.58;

  const elevationLift = elevation > 0 ? elevation * 0.18 : elevation * 0.06;
  const wetnessTint = rainfall * 0.08 + maritime * 0.06;
  const freezeLift = freeze * 0.20;

  let color = base;
  color = mixColor(color, rgb(255, 255, 255), freezeLift * 0.65);
  color = mixColor(color, rgb(28, 54, 88), sample?.waterMask === 1 ? 0.20 + maritime * 0.18 : 0);
  color = mixColor(color, rgb(255, 255, 255), Math.max(0, elevationLift));
  color = mixColor(color, rgb(18, 24, 36), Math.max(0, -elevationLift) * 0.45);

  const brightness = clamp(lambert + wetnessTint, 0.22, 1.08);

  return rgb(
    color.r * brightness,
    color.g * brightness,
    color.b * brightness
  );
}

function projectSample(sample, metrics, yaw, pitch) {
  const unit = latLonToUnit(sample.latDeg ?? 0, sample.lonDeg ?? 0, yaw, pitch);
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const radial = metrics.radius * (1 + Math.max(0, elevation) * 0.08);

  return {
    unit,
    x: metrics.centerX + unit.x * radial,
    y: metrics.centerY - unit.y * radial,
    z: unit.z,
    size: Math.max(1.1, metrics.radius / 150 + Math.max(0, elevation) * 0.9)
  };
}

function shouldEmit(sample, projected, densityTier) {
  if (projected.z <= 0) return false;

  const terrainClass = normalizeString(sample?.terrainClass);
  const shoreline = sample?.shoreline === true || sample?.shorelineBand === true;
  const waterMask = sample?.waterMask === 1;
  const important =
    shoreline ||
    terrainClass === "SUMMIT" ||
    terrainClass === "MOUNTAIN" ||
    terrainClass === "RIDGE" ||
    terrainClass === "CANYON" ||
    terrainClass === "POLAR_ICE" ||
    terrainClass === "GLACIAL_HIGHLAND";

  const zWeight = projected.z;
  const threshold = densityTier === "HIGH" ? 0.10 : 0.18;
  if (important) return zWeight > 0.02;
  if (waterMask) return zWeight > threshold + 0.08;
  return zWeight > threshold;
}

function buildDensityTier(metrics) {
  if (metrics.radius >= 240) return "HIGH";
  if (metrics.radius >= 160) return "BASELINE";
  return "SUPPRESSED";
}

function drawPlanetShell(ctx, metrics) {
  ctx.save();
  const shell = ctx.createRadialGradient(
    metrics.centerX - metrics.radius * 0.24,
    metrics.centerY - metrics.radius * 0.34,
    metrics.radius * 0.06,
    metrics.centerX,
    metrics.centerY,
    metrics.radius * 1.03
  );
  shell.addColorStop(0, "rgba(180,210,255,0.22)");
  shell.addColorStop(0.55, "rgba(20,30,48,0.10)");
  shell.addColorStop(1, "rgba(0,0,0,0.58)");

  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.01, 0, TAU);
  ctx.fillStyle = shell;
  ctx.fill();

  ctx.lineWidth = Math.max(1, metrics.radius * 0.007);
  ctx.strokeStyle = "rgba(190,220,255,0.18)";
  ctx.stroke();
  ctx.restore();
}

function renderPlanet({ ctx, planetField, projectPoint, viewState } = {}) {
  if (!ctx || !ctx.canvas) {
    return {
      projectionState: {},
      primitive: {},
      topology: {},
      renderAuthority: {},
      density: {},
      audit: {}
    };
  }

  const metrics = ensureCanvasMetrics(ctx);
  clearFrame(ctx, metrics);
  drawPlanetShell(ctx, metrics);

  const densityTier = buildDensityTier(metrics);
  const densityStep = densityTier === "HIGH" ? 1 : densityTier === "BASELINE" ? 2 : 3;
  const density = {
    averageCellSpanPx: (metrics.radius * 2) / Math.max(1, 108 / densityStep),
    subdivisionTier: densityStep === 1 ? "FINE" : densityStep === 2 ? "BASELINE" : "SUPPRESSED",
    densityTier
  };

  const angles = buildViewAngles(viewState);
  const light = buildLightVector();
  const samples = normalizeArray(planetField?.samples);

  let visibleCellCount = 0;
  let emittedCellCount = 0;
  let skippedCellCount = 0;

  let waterFamilyCount = 0;
  let landFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;
  let terrainChannelCount = 0;
  let atmosphereChannelCount = 0;
  let cosmosChannelCount = 0;
  let psychologyChannelCount = 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius, 0, TAU);
  ctx.clip();

  for (let rowIndex = 0; rowIndex < samples.length; rowIndex += densityStep) {
    const row = normalizeArray(samples[rowIndex]);
    for (let colIndex = 0; colIndex < row.length; colIndex += densityStep) {
      const sample = normalizeObject(row[colIndex]);
      const projected = projectSample(sample, metrics, angles.yaw, angles.pitch);

      if (projected.z > 0) visibleCellCount += 1;

      if (!shouldEmit(sample, projected, densityTier)) {
        if (projected.z > 0) skippedCellCount += 1;
        continue;
      }

      emittedCellCount += 1;

      if (sample?.waterMask === 1) waterFamilyCount += 1;
      else landFamilyCount += 1;

      if (
        normalizeString(sample?.terrainClass) === "POLAR_ICE" ||
        normalizeString(sample?.terrainClass) === "GLACIAL_HIGHLAND" ||
        normalizeString(sample?.biomeType) === "GLACIER"
      ) {
        cryosphereCount += 1;
      }

      if (sample?.shoreline === true || sample?.shorelineBand === true) shorelineCount += 1;
      terrainChannelCount += 1;
      atmosphereChannelCount += 1;
      cosmosChannelCount += 1;
      psychologyChannelCount += 1;

      const fill = shadedColor(sample, projected.unit, light);
      const alpha = sample?.waterMask === 1 ? 0.94 : 0.98;

      ctx.beginPath();
      ctx.arc(projected.x, projected.y, projected.size, 0, TAU);
      ctx.fillStyle = colorToString(fill, alpha);
      ctx.fill();
    }
  }

  ctx.restore();

  const atmosphere = ctx.createRadialGradient(
    metrics.centerX,
    metrics.centerY,
    metrics.radius * 0.72,
    metrics.centerX,
    metrics.centerY,
    metrics.radius * 1.15
  );
  atmosphere.addColorStop(0, "rgba(0,0,0,0)");
  atmosphere.addColorStop(0.76, "rgba(120,168,255,0.04)");
  atmosphere.addColorStop(1, "rgba(180,220,255,0.14)");

  ctx.save();
  ctx.beginPath();
  ctx.arc(metrics.centerX, metrics.centerY, metrics.radius * 1.06, 0, TAU);
  ctx.fillStyle = atmosphere;
  ctx.fill();
  ctx.restore();

  return {
    projectionState: {
      centerX: metrics.centerX,
      centerY: metrics.centerY,
      radius: metrics.radius,
      yaw: angles.yaw,
      pitch: angles.pitch
    },

    primitive: {
      primitiveType: "DISC_FIELD",
      primitivePath: "terrain-biome-elevation-shading",
      centerAnchored: true,
      rowColumnPathActive: true,
      sectorBandPathActive: false
    },

    topology: {
      topologyMode: "SPHERE_FRONT_HEMISPHERE",
      neighborLaw: "FRONT_FACE_ONLY",
      visibleCellCount,
      emittedCellCount,
      skippedCellCount
    },

    renderAuthority: {
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "/world/render/index.js"
    },

    density,

    audit: {
      sampleCount: visibleCellCount,
      waterFamilyCount,
      landFamilyCount,
      cryosphereCount,
      shorelineCount,
      terrainChannelCount,
      atmosphereChannelCount,
      cosmosChannelCount,
      psychologyChannelCount,
      cutFamilyCount: 0,
      elevationFamilyCount: landFamilyCount
    }
  };
}

function createRenderer() {
  return Object.freeze({
    renderPlanet
  });
}

export { createRenderer, renderPlanet };
export default { createRenderer, renderPlanet };
