/* /assets/audrelia.climate-moon.render.js
   ADRALIA_MOON_SURFACE_WRAPPER_RENEWAL_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION_WRAPPER

   OWNS=
   ADRALIA_MOON_IDENTITY
   MOON_PROFILE
   CLIMATE_MECHANIZATION_OVERLAY
   PLATFORM_EXTENSION_CONTRACT
   MOON_EXTENSION_RECEIPT

   DEPENDS_ON=
   /assets/adralia.moon.surface.render.js

   DOES_NOT_OWN=
   BASE_LUNAR_SURFACE
   PLANET_SURFACE
   SUN_SURFACE
   ROUTE_COPY
   INSTRUMENT_STATE
   PLATFORM_PROJECTION
*/

(function bindAdraliaMoonClimateWrapper(global) {
  "use strict";

  const VERSION = "ADRALIA_MOON_SURFACE_WRAPPER_RENEWAL_TNT_v1";
  const ID = "audrelia-moon";
  const LABEL = "Adralia's Moon";
  const TYPE = "manufactured_climate_moon";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

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

  function surfaceApi() {
    return (
      global.DGBAdraliaMoonSurfaceRender ||
      (global.DiamondGateBridge && global.DiamondGateBridge.DGBAdraliaMoonSurfaceRender) ||
      null
    );
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
      axialTiltDeg: -6.68,
      lightModel: "moon",
      downstreamSurface: "/assets/adralia.moon.surface.render.js",
      earthMoonReference: true,
      manufactured: true,
      climateRegulation: true,
      mechanizedElement: "subtle-lunar-integrated",
      rimColor: "rgba(232,235,230,0.78)",
      glowColor: "rgba(174,184,192,0.20)",
      sourceDefinition: 4096,
      ownsBodyPixelsOnly: true,
      ownsBaseLunarSurface: false,
      profileMerge: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    };
  }

  function buildFallbackLunarHoldTexture() {
    const canvas = makeCanvas(1024, 512);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#c8c8c2");
    gradient.addColorStop(0.5, "#999b98");
    gradient.addColorStop(1, "#666d72");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function buildTexture() {
    if (cachedTexture) return cachedTexture;

    const surface = surfaceApi();
    const base = surface && typeof surface.buildTexture === "function"
      ? surface.buildTexture()
      : buildFallbackLunarHoldTexture();

    const canvas = makeCanvas(base.width, base.height);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(840316);

    ctx.putImageData(base, 0, 0);

    /*
      Climate mechanism overlay:
      deliberately faint. It should not create a climate-planet read.
    */
    for (let i = 0; i < 7; i += 1) {
      const lat = -50 + i * 16.5;
      const points = [];

      for (let lon = -180; lon <= 180; lon += 4) {
        const wave =
          Math.sin((lon * 0.050) + i) * 0.78 +
          Math.sin((lon * 0.111) - i) * 0.24;
        points.push([lon, lat + wave]);
      }

      drawStroke(ctx, points, "rgba(208,220,216,0.020)", 0.68);
    }

    for (let i = 0; i < 32; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -60 + random() * 120;
      const r = 0.16 + random() * 0.48;

      drawEllipse(ctx, lon, lat, r, r * 0.70, 0, "rgba(214,232,225,0.038)");
      drawEllipse(ctx, lon, lat, r * 0.28, r * 0.20, 0, "rgba(245,255,245,0.026)");
    }

    for (let i = 0; i < 28; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -54 + random() * 108;
      const length = 3 + random() * 10;
      const angle = random() * 360;
      const points = [];

      for (let p = 0; p < 5; p += 1) {
        const t = p / 4;
        points.push([
          lon + Math.cos(angle * DEG) * length * (t - 0.5),
          lat + Math.sin(angle * DEG) * length * (t - 0.5)
        ]);
      }

      drawStroke(ctx, points, "rgba(232,236,232,0.024)", 0.55);
    }

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = image.data;

    /*
      Final hard lunar enforcement.
    */
    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i] * 0.31 + data[i + 1] * 0.34 + data[i + 2] * 0.35;

      data[i] = clamp(avg * 0.992, 0, 255);
      data[i + 1] = clamp(avg * 0.998, 0, 255);
      data[i + 2] = clamp(avg * 1.010, 0, 255);
      data[i + 3] = 255;
    }

    cachedTexture = image;
    return cachedTexture;
  }

  function sampleSurface(texture, u, v, out) {
    const surface = surfaceApi();

    if (surface && typeof surface.sampleSurface === "function") {
      return surface.sampleSurface(texture, u, v, out);
    }

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

  function renderSurface() {
    return {
      ok: true,
      body: ID,
      label: LABEL,
      version: VERSION,
      renderDelegatedToPlatformProjection: true,
      downstreamSurface: "/assets/adralia.moon.surface.render.js",
      earthMoonReference: true,
      moonFirst: true,
      mechanizedSecond: true,
      blueGreenPlanetSurface: false,
      wrongBodyFallback: false,
      ownsBodyPixelsOnly: true,
      ownsBaseLunarSurface: false,
      profileMerge: false,
      generatedImage: false,
      graphicBox: false,
      streaming: false,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    const surface = surfaceApi();

    return {
      ok: true,
      id: ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audrelia.climate-moon.render.js",
      downstreamSurface: "/assets/adralia.moon.surface.render.js",
      downstreamSurfaceLoaded: Boolean(surface),
      earthMoonReference: true,
      manufacturedClimateMoon: true,
      subtleMechanizedElement: true,
      climateRegulationLattice: "subtle",
      moonFirstMachineSecond: true,
      blueGreenPlanetSurface: false,
      atmosphere: false,
      ocean: false,
      landmass: false,
      ownsBodyPixelsOnly: true,
      ownsBaseLunarSurface: false,
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
      "adralia's moon",
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
