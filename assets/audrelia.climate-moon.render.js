/* /assets/audrelia.climate-moon.render.js
   ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   ADRALIA_MOON_PROFILE_LABEL
   EARTH_MOON_REFERENCE_SURFACE
   GRAY_LUNAR_REGOLITH
   LUNAR_MARIA
   CRATER_DENSITY
   SUBTLE_MECHANIZED_CLIMATE_TRACES
   MOON_EXTENSION_RECEIPT

   DESIGN=
   Earth’s Moon first.
   Mechanized/climate-regulation element second.
   No blue.
   No green.
   No ocean.
   No landmass.
   No atmosphere.
   No planet fallback.
*/

(function bindAdraliaMoonRenderExtension(global) {
  "use strict";

  const VERSION = "ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1";
  const ID = "audrelia-moon";
  const LABEL = "Adralia’s Moon";
  const TYPE = "manufactured_climate_moon";
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
    const dark = 0.055 + strength * 0.105;
    const bright = 0.030 + strength * 0.068;
    const inner = 0.018 + strength * 0.048;
    const skew = 0.58 + random() * 0.20;
    const rotation = random() * 180;

    drawEllipse(
      ctx,
      lon,
      lat,
      radius,
      radius * skew,
      rotation,
      "rgba(22,23,24," + dark.toFixed(4) + ")"
    );

    drawEllipse(
      ctx,
      lon - radius * 0.05,
      lat - radius * 0.055,
      radius * 0.78,
      radius * skew * 0.72,
      rotation,
      "rgba(245,245,238," + bright.toFixed(4) + ")"
    );

    drawEllipse(
      ctx,
      lon + radius * 0.08,
      lat + radius * 0.06,
      radius * 0.42,
      radius * skew * 0.36,
      rotation,
      "rgba(18,19,20," + inner.toFixed(4) + ")"
    );
  }

  function createProfile() {
    return {
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      axialTiltDeg: -6.68,
      lightModel: "moon",
      earthMoonReference: true,
      manufactured: true,
      climateRegulation: true,
      mechanizedElement: "subtle-lunar-integrated",
      rimColor: "rgba(232,235,230,0.78)",
      glowColor: "rgba(174,184,192,0.20)",
      sourceDefinition: 4096,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
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
    const random = makeSeededRandom(7350314);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#d7d6cf");
    base.addColorStop(0.20, "#c8c8c1");
    base.addColorStop(0.43, "#aaa9a3");
    base.addColorStop(0.64, "#8b8f90");
    base.addColorStop(0.82, "#737b7f");
    base.addColorStop(1.00, "#59646c");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    /*
      Lunar maria: dark basaltic plains after Earth’s Moon.
      These must read as lunar basins, not continents.
    */
    drawEllipse(ctx, -48, 24, 31, 13, -7, "rgba(43,45,47,0.36)");
    drawEllipse(ctx, -10, 18, 25, 10, 8, "rgba(49,51,53,0.31)");
    drawEllipse(ctx, 31, -2, 32, 14, 10, "rgba(48,50,52,0.34)");
    drawEllipse(ctx, -62, -25, 24, 10, -12, "rgba(42,44,46,0.28)");
    drawEllipse(ctx, 78, 29, 20, 8, -8, "rgba(58,60,62,0.22)");
    drawEllipse(ctx, 109, -23, 17, 7, -10, "rgba(60,62,64,0.17)");
    drawEllipse(ctx, -110, -8, 16, 6, 3, "rgba(43,46,48,0.18)");
    drawEllipse(ctx, 135, 9, 13, 5, 17, "rgba(50,52,54,0.14)");

    /*
      Large named-feel crater language.
    */
    const majorCraters = [
      [-80, 12, 8.5, 0.82],
      [-32, -18, 6.9, 0.72],
      [8, 34, 5.6, 0.68],
      [42, 18, 7.8, 0.78],
      [86, -14, 6.2, 0.72],
      [118, 42, 5.1, 0.62],
      [-132, -36, 6.6, 0.74],
      [152, -48, 8.2, 0.80]
    ];

    majorCraters.forEach(function crater(item) {
      drawCrater(ctx, item[0], item[1], item[2], item[3], random);
    });

    /*
      Dense crater field.
    */
    for (let i = 0; i < 6200; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -84 + random() * 168;
      const size = 0.10 + Math.pow(random(), 2.95) * 7.8;
      const strength = 0.08 + random() * 0.62;

      drawCrater(ctx, lon, lat, size, strength, random);
    }

    /*
      Regolith noise and albedo variation.
    */
    for (let i = 0; i < 2600; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -82 + random() * 164,
        0.06 + random() * 0.64,
        0.04 + random() * 0.35,
        random() * 180,
        random() > 0.52
          ? "rgba(248,248,240," + (0.014 + random() * 0.044).toFixed(4) + ")"
          : "rgba(16,18,20," + (0.014 + random() * 0.038).toFixed(4) + ")"
      );
    }

    /*
      Very subtle mechanized climate-regulation traces.
      These are intentionally faint and gray-green-neutral.
      They must not read as ocean/land/cloud.
    */
    for (let i = 0; i < 8; i += 1) {
      const lat = -52 + i * 14.5;
      const points = [];

      for (let lon = -180; lon <= 180; lon += 4) {
        const wave =
          Math.sin((lon * 0.050) + i) * 1.05 +
          Math.sin((lon * 0.111) - i) * 0.34;
        points.push([lon, lat + wave]);
      }

      drawStroke(ctx, points, "rgba(202,215,210,0.026)", 0.78);
    }

    for (let i = 0; i < 24; i += 1) {
      const lon = -180 + random() * 360;
      const points = [];

      for (let lat = -64; lat <= 64; lat += 5) {
        const wobble = Math.sin((lat * 0.078) + i) * 0.55;
        points.push([lon + wobble, lat]);
      }

      drawStroke(ctx, points, "rgba(198,214,208,0.020)", 0.62);
    }

    for (let i = 0; i < 54; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const r = 0.18 + random() * 0.62;

      drawEllipse(ctx, lon, lat, r, r * 0.70, 0, "rgba(215,232,225,0.050)");
      drawEllipse(ctx, lon, lat, r * 0.30, r * 0.21, 0, "rgba(245,255,245,0.038)");
    }

    /*
      Faint assembly scars from space-rock manufacturing.
      Not panels. Not sci-fi plating.
    */
    for (let i = 0; i < 42; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const length = 3.5 + random() * 12;
      const angle = random() * 360;
      const points = [];

      for (let p = 0; p < 6; p += 1) {
        const t = p / 5;
        points.push([
          lon + Math.cos(angle * DEG) * length * (t - 0.5),
          lat + Math.sin(angle * DEG) * length * (t - 0.5)
        ]);
      }

      drawStroke(ctx, points, "rgba(232,236,232,0.030)", 0.62);
    }

    /*
      Final desaturation pass: force lunar identity.
    */
    const image = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i] * 0.31 + data[i + 1] * 0.34 + data[i + 2] * 0.35;
      const cool = avg < 110 ? 2 : 0;
      data[i] = clamp(avg * 0.990, 0, 255);
      data[i + 1] = clamp(avg * 0.998, 0, 255);
      data[i + 2] = clamp(avg * 1.012 + cool, 0, 255);
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

    out[0] = clamp(avg * 0.990, 0, 255);
    out[1] = clamp(avg * 0.998, 0, 255);
    out[2] = clamp(avg * 1.012, 0, 255);

    return out;
  }

  function renderSurface() {
    return {
      ok: true,
      body: ID,
      label: LABEL,
      version: VERSION,
      renderDelegatedToPlatformProjection: true,
      earthMoonReference: true,
      moonFirst: true,
      mechanizedSecond: true,
      blueGreenPlanetSurface: false,
      wrongBodyFallback: false,
      climateRegulationVisibleOnInspection: true,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    return {
      ok: true,
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audrelia.climate-moon.render.js",
      earthMoonReference: true,
      lunarMaria: true,
      crateredRegolith: true,
      subtleMechanizedElement: true,
      climateRegulationLattice: "subtle",
      moonFirstMachineSecond: true,
      blueGreenPlanetSurface: false,
      atmosphere: false,
      ocean: false,
      landmass: false,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
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
    aliases: [
      "moon",
      "adralia-moon",
      "adralia’s moon",
      "adralias-moon",
      "audrelia-moon",
      "audrelia-climate-moon",
      "climate-moon",
      "manufactured-moon"
    ],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAdraliaMoonRenderExtension = api;
  global.DGBAudreliaClimateMoonRenderExtension = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAdraliaMoonRenderExtension = api;
  global.DiamondGateBridge.DGBAudreliaClimateMoonRenderExtension = api;

  if (global.DGBShowroomGlobeRender && typeof global.DGBShowroomGlobeRender.registerExtension === "function") {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:adralia:moon-extension-ready", { detail: getStatus() }));
    global.dispatchEvent(new CustomEvent("dgb:audrelia:climate-moon-extension-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
