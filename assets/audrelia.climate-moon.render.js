/* /assets/audrelia.climate-moon.render.js
   AUDRELIA_CLIMATE_MOON_DESIGN_EXTENSION_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRELIA_MANUFACTURED_CLIMATE_MOON_PROFILE
   EARTH_MOON_REFERENCE_LANGUAGE
   ASSEMBLED_SPACE_ROCK_SURFACE
   CLIMATE_REGULATION_LATTICE
   AUDRELIA_CLIMATE_MOON_EXTENSION_RECEIPT

   DESIGN=
   Believable moon first.
   Manufactured climate body second.
   No clean Death-Star read.
   No pasted sci-fi panels.
   No generic crater ball.

   DOES_NOT_OWN=
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   PLANET_PIXELS
   SUN_PIXELS
*/

(function bindAudreliaClimateMoonRenderExtension(global) {
  "use strict";

  const VERSION = "AUDRELIA_CLIMATE_MOON_DESIGN_EXTENSION_TNT_v1";
  const ID = "audrelia-moon";
  const LABEL = "Audrelia Manufactured Climate Moon";
  const TYPE = "manufactured_climate_moon";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const SOURCE_WIDTH = 3072;
  const SOURCE_HEIGHT = 1536;

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

  function createProfile() {
    return {
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      axialTiltDeg: -6.8,
      lightModel: "moon",
      manufactured: true,
      earthMoonReference: true,
      assembledSpaceRockSurface: true,
      climateRegulation: true,
      rimColor: "rgba(230,236,232,0.70)",
      glowColor: "rgba(170,190,205,0.24)",
      sourceDefinition: 3072,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function buildTexture() {
    if (cachedTexture) return cachedTexture;

    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(6350304);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#dfdfd8");
    base.addColorStop(0.26, "#c9cac4");
    base.addColorStop(0.55, "#a6a8a4");
    base.addColorStop(0.78, "#7d8487");
    base.addColorStop(1.00, "#566168");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const maria = "rgba(56,60,62,0.34)";
    drawEllipse(ctx, -30, 26, 22, 10, -8, maria);
    drawEllipse(ctx, 12, 18, 20, 9, 6, maria);
    drawEllipse(ctx, 42, -6, 25, 11, 10, maria);
    drawEllipse(ctx, -52, -20, 19, 8, -12, maria);
    drawEllipse(ctx, 82, 30, 18, 7, -8, "rgba(70,72,74,0.22)");
    drawEllipse(ctx, -88, -8, 12, 5.8, 3, "rgba(50,54,56,0.19)");
    drawEllipse(ctx, 102, -24, 15, 6.5, -10, "rgba(66,68,70,0.16)");

    for (let i = 0; i < 3200; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -82 + random() * 164;
      const size = 0.18 + Math.pow(random(), 2.55) * 7.4;
      const strength = 0.12 + random() * 0.55;

      drawEllipse(
        ctx,
        lon,
        lat,
        size,
        size * 0.66,
        random() * 180,
        "rgba(34,36,38," + (0.045 + strength * 0.10).toFixed(4) + ")"
      );

      drawEllipse(
        ctx,
        lon - size * 0.05,
        lat - size * 0.05,
        size * 0.76,
        size * 0.50,
        random() * 180,
        "rgba(255,255,245," + (0.028 + strength * 0.065).toFixed(4) + ")"
      );
    }

    for (let i = 0; i < 14; i += 1) {
      const lat = -66 + i * 10.2;
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wave =
          Math.sin((lon * 0.052) + i) * 1.8 +
          Math.sin((lon * 0.119) - i) * 0.72;
        points.push([lon, lat + wave]);
      }

      drawStroke(ctx, points, "rgba(205,218,216,0.052)", 1.15);
    }

    for (let i = 0; i < 52; i += 1) {
      const lon = -180 + random() * 360;
      const points = [];

      for (let lat = -70; lat <= 70; lat += 4) {
        const wobble = Math.sin((lat * 0.08) + i) * 0.95;
        points.push([lon + wobble, lat]);
      }

      drawStroke(ctx, points, "rgba(180,215,205,0.035)", 0.9);
    }

    for (let i = 0; i < 144; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -64 + random() * 128;
      const r = 0.28 + random() * 1.05;

      drawEllipse(ctx, lon, lat, r, r * 0.72, 0, "rgba(210,235,225,0.085)");
      drawEllipse(ctx, lon, lat, r * 0.32, r * 0.23, 0, "rgba(245,255,245,0.075)");
    }

    for (let i = 0; i < 48; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const length = 5 + random() * 18;
      const angle = random() * 360;
      const points = [];

      for (let p = 0; p < 8; p += 1) {
        const t = p / 7;
        points.push([
          lon + Math.cos(angle * DEG) * length * (t - 0.5),
          lat + Math.sin(angle * DEG) * length * (t - 0.5)
        ]);
      }

      drawStroke(ctx, points, "rgba(225,238,235,0.050)", 1.1);
    }

    for (let i = 0; i < 360; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -72 + random() * 144,
        0.10 + random() * 0.75,
        0.07 + random() * 0.42,
        random() * 180,
        random() > 0.55
          ? "rgba(255,255,255," + (0.022 + random() * 0.055).toFixed(4) + ")"
          : "rgba(20,24,26," + (0.018 + random() * 0.046).toFixed(4) + ")"
      );
    }

    cachedTexture = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
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

    out[0] = r0 * (1 - ty) + r1 * ty;
    out[1] = g0 * (1 - ty) + g1 * ty;
    out[2] = b0 * (1 - ty) + b1 * ty;

    return out;
  }

  function renderSurface() {
    return {
      ok: true,
      body: ID,
      label: LABEL,
      version: VERSION,
      renderDelegatedToPlatformProjection: true,
      manufacturedClimateMoon: true,
      believableMoonFirst: true,
      climateRegulationVisibleOnInspection: true,
      ownsBodyPixelsOnly: true,
      profileMerge: false
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
      manufacturedClimateMoon: true,
      assembledSpaceRockSurface: true,
      subtleAssemblyTraces: true,
      climateRegulationLattice: true,
      believableMoonFirst: true,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: ["moon", "audrelia-climate-moon", "climate-moon", "manufactured-moon", "adralia-moon", "audralia-moon"],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAudreliaClimateMoonRenderExtension = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaClimateMoonRenderExtension = api;

  if (global.DGBShowroomGlobeRender && typeof global.DGBShowroomGlobeRender.registerExtension === "function") {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:audrelia:climate-moon-extension-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
