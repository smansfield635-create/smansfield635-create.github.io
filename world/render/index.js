// /world/render/index.js
// MODE: RENDER CONTRACT RENEWAL
// STATUS: NON-DRIFT | FIELD-DRIVEN | NO SYNTHETIC MOTION | BACKEND-NEUTRAL
// OWNER: SEAN

/* =========================
   PRINCIPLE
========================= */
// Render expresses the field.
// It does NOT create motion.
// It consumes dynamic fields from planet_engine:
// - dynamicIllumination
// - dynamicCloudBias
// - dynamicStormBias
// - dynamicCurrentBias
// - dynamicAuroraBias
// - dynamicGlowBias

/* =========================
   UTIL
========================= */

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function normalizeObject(v) {
  return isObject(v) ? v : {};
}

/* =========================
   PROJECTION (STATIC — NO TIME)
========================= */

function project(latDeg, lonDeg, width, height) {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;

  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);

  return {
    x: (x * 0.5 + 0.5) * width,
    y: (-y * 0.5 + 0.5) * height
  };
}

/* =========================
   COLOR (FIELD-DRIVEN)
========================= */

function colorFromSample(sample) {
  const elevation = sample.elevation || 0;
  const water = sample.waterMask === 1;

  const illum = clamp(sample.dynamicIllumination ?? 0.5, 0, 1);
  const glow = clamp(sample.dynamicGlowBias ?? 0, 0, 1);
  const cloud = clamp(sample.dynamicCloudBias ?? 0, 0, 1);
  const aurora = clamp(sample.dynamicAuroraBias ?? 0, 0, 1);

  if (water) {
    const depth = clamp(sample.waterDepth || 0, 0, 1);

    let r = 10 + glow * 40;
    let g = 40 + depth * 80 + cloud * 40;
    let b = 120 + depth * 120 + glow * 80;

    return [
      clamp(r, 0, 255),
      clamp(g, 0, 255),
      clamp(b, 0, 255)
    ];
  }

  let r = 40 + elevation * 120 * illum;
  let g = 80 + elevation * 140 * illum;
  let b = 40 + elevation * 80 * illum;

  // aurora overlay
  r += aurora * 30;
  g += aurora * 80;
  b += aurora * 120;

  return [
    clamp(r, 0, 255),
    clamp(g, 0, 255),
    clamp(b, 0, 255)
  ];
}

/* =========================
   MAIN RENDER
========================= */

export function renderPlanet({
  ctx,
  canvas,
  planetField,
  viewState = {}
}) {
  if (!ctx || !planetField) {
    throw new Error("renderPlanet missing inputs");
  }

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // clear
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  const samples = planetField.samples;
  const h = samples.length;
  const w = samples[0]?.length || 0;

  const stepX = width / w;
  const stepY = height / h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = samples[y][x];

      const p = project(s.latDeg, s.lonDeg, width, height);
      const color = colorFromSample(s);

      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
      ctx.fillRect(p.x, p.y, stepX + 1, stepY + 1);
    }
  }

  return {
    projectionState: "SPHERE_STATIC",
    renderAuthority: "FIELD_EXPRESSION",
    density: w * h,
    audit: "FIELD_DRIVEN_RENDER"
  };
}

export default { renderPlanet };
