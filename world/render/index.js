// /world/render/index.js
// MODE: BASELINE RENEWAL
// STATUS: FIELD-EXPRESSION-ONLY | NON-DRIFT
// OWNER: SEAN

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgba(r, g, b, a = 1) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function colorFromSample(sample) {
  const illumination = clamp(sample.dynamicIllumination ?? 0.5, 0, 1);
  const cloudBias = clamp(sample.dynamicCloudBias ?? 0, 0, 1);
  const stormBias = clamp(sample.dynamicStormBias ?? 0, 0, 1);
  const currentBias = clamp(sample.dynamicCurrentBias ?? 0, 0, 1);
  const auroraBias = clamp(sample.dynamicAuroraBias ?? 0, 0, 1);
  const glowBias = clamp(sample.dynamicGlowBias ?? 0, 0, 1);

  if (sample.waterMask === 1) {
    const depth = clamp(Math.abs(sample.oceanDepthField ?? 0), 0, 1);
    const r = 8 + glowBias * 24 + stormBias * 12;
    const g = 28 + depth * 60 + currentBias * 36 + cloudBias * 18;
    const b = 90 + depth * 110 + glowBias * 40 + currentBias * 24;
    return rgba(r, g, b, 1);
  }

  const elevation = clamp(sample.elevation ?? 0, 0, 1);
  let r = 38 + elevation * 118 * illumination;
  let g = 62 + elevation * 126 * illumination;
  let b = 34 + elevation * 72 * illumination;

  if (sample.terrainClass === "BEACH") {
    r += 42;
    g += 30;
    b += 8;
  } else if (sample.terrainClass === "POLAR_ICE" || sample.terrainClass === "GLACIAL_HIGHLAND") {
    r = 180 + auroraBias * 20;
    g = 205 + auroraBias * 25;
    b = 225 + auroraBias * 30;
  } else if (sample.biomeType === "TEMPERATE_FOREST" || sample.biomeType === "BOREAL_FOREST" || sample.biomeType === "TROPICAL_RAINFOREST") {
    g += 26;
  } else if (sample.biomeType === "DESERT") {
    r += 34;
    g += 16;
  }

  r += auroraBias * 18 + glowBias * 10;
  g += auroraBias * 44 + cloudBias * 6;
  b += auroraBias * 58 + stormBias * 10;

  return rgba(r, g, b, 1);
}

function drawPlanetMask(ctx, width, height) {
  const radius = Math.min(width, height) * 0.42;
  const cx = width * 0.5;
  const cy = height * 0.5;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  return { cx, cy, radius };
}

function project(latDeg, lonDeg, sphere) {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;

  const x3 = Math.cos(lat) * Math.sin(lon);
  const y3 = Math.sin(lat);
  const z3 = Math.cos(lat) * Math.cos(lon);

  return {
    x: sphere.cx + x3 * sphere.radius,
    y: sphere.cy - y3 * sphere.radius,
    visible: z3 >= 0,
    scale: clamp(0.35 + z3 * 0.65, 0.2, 1)
  };
}

export function renderPlanet({ ctx, planetField }) {
  if (!ctx || !planetField || !Array.isArray(planetField.samples)) {
    throw new Error("renderPlanet missing required field inputs");
  }

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const samples = planetField.samples;
  const rows = samples.length;
  const cols = samples[0]?.length ?? 0;

  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  const sphere = drawPlanetMask(ctx, width, height);
  const cellSize = Math.max(1, sphere.radius * 2 / Math.max(cols, rows));

  for (let y = 0; y < rows; y += 1) {
    const row = samples[y];
    for (let x = 0; x < cols; x += 1) {
      const sample = row[x];
      const projected = project(sample.latDeg, sample.lonDeg, sphere);
      if (!projected.visible) continue;

      const size = Math.max(1, cellSize * projected.scale * 1.15);
      ctx.fillStyle = colorFromSample(sample);
      ctx.fillRect(projected.x - size * 0.5, projected.y - size * 0.5, size, size);
    }
  }

  const rim = ctx.createRadialGradient(
    sphere.cx,
    sphere.cy,
    sphere.radius * 0.65,
    sphere.cx,
    sphere.cy,
    sphere.radius
  );
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(255,255,255,0.08)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(sphere.cx, sphere.cy, sphere.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  return {
    projectionState: "SPHERE_CLIPPED_FRONT_HEMISPHERE",
    renderAuthority: "FIELD_EXPRESSION_ONLY",
    density: rows * cols,
    audit: "RENDER_OK"
  };
}

export default { renderPlanet };
