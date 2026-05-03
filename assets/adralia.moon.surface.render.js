/* /assets/adralia.moon.surface.render.js
   ADRALIA_MOON_SURFACE_DOWNSTREAM_TNT_v1

   ROLE=
   DOWNSTREAM_LUNAR_SURFACE_EXTENSION

   OWNS=
   EARTH_MOON_DERIVED_LUNAR_SURFACE
   GRAY_REGOLITH
   LUNAR_MARIA
   CRATER_FIELD
   ALBEDO_VARIATION
   LUNAR_SURFACE_RECEIPT

   DOES_NOT_OWN=
   CLIMATE_WRAPPER
   ROUTE_LABELS
   INSTRUMENT_STATE
   PLATFORM_PROJECTION
   PLANET_SURFACE
   SUN_SURFACE
*/

(function bindAdraliaMoonSurfaceDownstream(global) {
  "use strict";

  const VERSION = "ADRALIA_MOON_SURFACE_DOWNSTREAM_TNT_v1";
  const ID = "adralia-moon-surface";
  const LABEL = "Adralia Moon Surface";
  const TYPE = "lunar_surface";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const SOURCE_WIDTH = 4096;
  const SOURCE_HEIGHT = 2048;

  let cachedTexture = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function makeSeededRandom(seed) {
    let s = seed >>> 0;

    return function random() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function lonLatToXY(lon, lat, width, height) {
    return {
      x: ((lon + 180) / 360) * width,
      y: ((90 - lat) / 180) * height
    };
  }

  function drawEllipse(ctx, lon, lat, lonRadius, latRadius, rotationDeg, fill, stroke, lineWidth) {
    const p = lonLatToXY(lon, lat, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((rotationDeg || 0) * DEG);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      Math.max(0.5, (lonRadius / 360) * ctx.canvas.width),
      Math.max(0.5, (latRadius / 180) * ctx.canvas.height),
      0,
      0,
      TAU
    );
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawStroke(ctx, points, stroke, lineWidth) {
    if (!points || points.length < 2) return;

    ctx.beginPath();

    points.forEach(function drawPoint(point, index) {
      const p = lonLatToXY(point[0], point[1], ctx.canvas.width, ctx.canvas.height);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawCrater(ctx, lon, lat, radius, strength, random) {
    const skew = 0.58 + random() * 0.24;
    const rotation = random() * 180;

    drawEllipse(
      ctx,
      lon,
      lat,
      radius,
      radius * skew,
      rotation,
      "rgba(22,23,24," + (0.048 + strength * 0.12).toFixed(4) + ")"
    );

    drawEllipse(
      ctx,
      lon - radius * 0.055,
      lat - radius * 0.060,
      radius * 0.78,
      radius * skew * 0.72,
      rotation,
      "rgba(245,245,238," + (0.028 + strength * 0.070).toFixed(4) + ")"
    );

    drawEllipse(
      ctx,
      lon + radius * 0.08,
      lat + radius * 0.06,
      radius * 0.42,
      radius * skew * 0.36,
      rotation,
      "rgba(18,19,20," + (0.018 + strength * 0.052).toFixed(4) + ")"
    );
  }

  function createSurfaceProfile() {
    return {
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      sourceDefinition: 4096,
      earthMoonReference: true,
      grayRegolith: true,
      lunarMaria: true,
      craterField: true,
      atmosphere: false,
      ocean: false,
      landmass: false,
      ownsLunarSurfaceOnly: true,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    };
  }

  function buildTexture() {
    if (cachedTexture) return cachedTexture;

    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(840315);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#d5d3cc");
    base.addColorStop(0.20, "#c4c3bd");
    base.addColorStop(0.42, "#aaa9a3");
    base.addColorStop(0.62, "#8d9090");
    base.addColorStop(0.82, "#72797d");
    base.addColorStop(1.00, "#59636a");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    /*
      Lunar maria: Earth-Moon reference basins.
      These are dark basaltic plains, not continents.
    */
    drawEllipse(ctx, -52, 26, 34, 14, -7, "rgba(39,41,43,0.40)");
    drawEllipse(ctx, -12, 18, 28, 11, 8, "rgba(44,46,48,0.35)");
    drawEllipse(ctx, 34, -3, 35, 15, 10, "rgba(42,44,46,0.37)");
    drawEllipse(ctx, -68, -27, 25, 10, -12, "rgba(38,40,42,0.30)");
    drawEllipse(ctx, 78, 30, 21, 8, -8, "rgba(54,56,58,0.24)");
    drawEllipse(ctx, 110, -24, 18, 7, -10, "rgba(56,58,60,0.18)");
    drawEllipse(ctx, -116, -9, 17, 6, 3, "rgba(40,43,45,0.19)");
    drawEllipse(ctx, 137, 9, 14, 5, 17, "rgba(48,50,52,0.15)");

    const majorCraters = [
      [-82, 13, 8.8, 0.86],
      [-34, -19, 7.1, 0.76],
      [10, 34, 5.8, 0.70],
      [45, 18, 8.1, 0.80],
      [88, -15, 6.4, 0.74],
      [120, 42, 5.2, 0.64],
      [-134, -37, 6.8, 0.76],
      [152, -49, 8.4, 0.82],
      [-6, -42, 6.2, 0.74],
      [64, 50, 4.8, 0.62]
    ];

    majorCraters.forEach(function crater(item) {
      drawCrater(ctx, item[0], item[1], item[2], item[3], random);
    });

    for (let i = 0; i < 7200; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -84 + random() * 168;
      const size = 0.08 + Math.pow(random(), 3.0) * 7.9;
      const strength = 0.07 + random() * 0.64;
      drawCrater(ctx, lon, lat, size, strength, random);
    }

    for (let i = 0; i < 3400; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -82 + random() * 164,
        0.05 + random() * 0.58,
        0.035 + random() * 0.32,
        random() * 180,
        random() > 0.52
          ? "rgba(248,248,240," + (0.012 + random() * 0.040).toFixed(4) + ")"
          : "rgba(16,18,20," + (0.012 + random() * 0.035).toFixed(4) + ")"
      );
    }

    /*
      Ray-like impact ejecta. Faint enough to stay lunar.
    */
    for (let i = 0; i < 26; i += 1) {
      const centerLon = -140 + random() * 280;
      const centerLat = -56 + random() * 112;
      const rayCount = 3 + Math.floor(random() * 5);

      for (let ray = 0; ray < rayCount; ray += 1) {
        const angle = random() * 360;
        const length = 8 + random() * 24;
        const points = [];

        for (let p = 0; p < 7; p += 1) {
          const t = p / 6;
          points.push([
            centerLon + Math.cos(angle * DEG) * length * t,
            centerLat + Math.sin(angle * DEG) * length * t
          ]);
        }

        drawStroke(ctx, points, "rgba(232,232,224,0.034)", 0.72);
      }
    }

    /*
      Forced lunar desaturation.
    */
    const image = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i] * 0.31 + data[i + 1] * 0.34 + data[i + 2] * 0.35;
      const cool = avg < 112 ? 1.5 : 0;

      data[i] = clamp(avg * 0.992, 0, 255);
      data[i + 1] = clamp(avg * 0.998, 0, 255);
      data[i + 2] = clamp(avg * 1.010 + cool, 0, 255);
      data[i + 3] = 255;
    }

    cachedTexture = image;
    return cachedTexture;
  }

  function sampleSurface(texture, u, v, out) {
    const width = texture.width;
    const height = texture.height;
    const data = texture.data;

    const x = ((u % 1 + 1) % 1) * width;
    const y = clamp(v, 0, 0.999999) * (height - 1);

    const x0 = Math.floor(x) % width;
    const x1 = (x0 + 1) % width;
    const y0 = Math.floor(y);
    const y1 = Math.min(height - 1, y0 + 1);

    const tx = x - Math.floor(x);
    const ty = y - y0;

    const i00 = (y0 * width + x0) * 4;
    const i10 = (y0 * width + x1) * 4;
    const i01 = (y1 * width + x0) * 4;
    const i11 = (y1 * width + x1) * 4;

    const r0 = data[i00] * (1 - tx) + data[i10] * tx;
    const g0 = data[i00 + 1] * (1 - tx) + data[i10 + 1] * tx;
    const b0 = data[i00 + 2] * (1 - tx) + data[i10 + 2] * tx;

    const r1 = data[i01] * (1 - tx) + data[i11] * tx;
    const g1 = data[i01 + 1] * (1 - tx) + data[i11 + 1] * tx;
    const b1 = data[i01 + 2] * (1 - tx) + data[i11 + 2] * tx;

    const r = r0 * (1 - ty) + r1 * ty;
    const g = g0 * (1 - ty) + g1 * ty;
    const b = b0 * (1 - ty) + b1 * ty;
    const avg = r * 0.31 + g * 0.34 + b * 0.35;

    out[0] = clamp(avg * 0.992, 0, 255);
    out[1] = clamp(avg * 0.998, 0, 255);
    out[2] = clamp(avg * 1.010, 0, 255);

    return out;
  }

  function getStatus() {
    return {
      ok: true,
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/adralia.moon.surface.render.js",
      ownsLunarSurfaceOnly: true,
      earthMoonReference: true,
      grayRegolith: true,
      lunarMaria: true,
      craterField: true,
      atmosphere: false,
      ocean: false,
      landmass: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    createSurfaceProfile,
    buildTexture,
    sampleSurface,
    getStatus
  };

  global.DGBAdraliaMoonSurfaceRender = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAdraliaMoonSurfaceRender = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:adralia:moon-surface-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
