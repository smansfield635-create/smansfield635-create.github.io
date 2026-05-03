/* /assets/audrelia.sun.render.js
   AUDRELIA_SUN_RENDER_EXTENSION_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRELIA_SUN_PROFILE
   AUDRELIA_SUN_PLASMA_LAW
   AUDRELIA_SUN_SURFACE_COLOR
   AUDRELIA_SUN_EXTENSION_RECEIPT

   DOES_NOT_OWN=
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   PLANET_PIXELS
   MOON_PIXELS
*/

(function bindAudreliaSunRenderExtension(global) {
  "use strict";

  const VERSION = "AUDRELIA_SUN_RENDER_EXTENSION_TNT_v1";
  const ID = "audrelia-sun";
  const LABEL = "Audrelia’s Sun";
  const TYPE = "local_star";
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

  function drawEllipse(ctx, lon, lat, lonRadius, latRadius, rotationDeg, fill) {
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
      axialTiltDeg: -9.0,
      lightModel: "star",
      corona: true,
      rimColor: "rgba(255,214,132,0.76)",
      glowColor: "rgba(255,156,62,0.38)",
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
    const random = makeSeededRandom(6350202);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#ffe7a3");
    base.addColorStop(0.22, "#ffc66f");
    base.addColorStop(0.48, "#f6963d");
    base.addColorStop(0.74, "#d85b22");
    base.addColorStop(1.00, "#80230e");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 6200; i += 1) {
      const x = random() * SOURCE_WIDTH;
      const y = random() * SOURCE_HEIGHT;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(random() * TAU);
      ctx.beginPath();
      ctx.ellipse(0, 0, 2 + random() * 12, 1 + random() * 5, 0, 0, TAU);
      ctx.fillStyle = random() > 0.34
        ? "rgba(255,248,190," + (0.022 + random() * 0.10).toFixed(4) + ")"
        : "rgba(255,112,35," + (0.018 + random() * 0.075).toFixed(4) + ")";
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";

    for (let row = -64; row <= 64; row += 12) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wave =
          Math.sin((lon + row * 1.7) * 0.105) * 3.0 +
          Math.sin((lon - row) * 0.045) * 1.7;
        points.push([lon, row + wave]);
      }

      drawStroke(ctx, points, "rgba(255,230,190,0.105)", 2.4);
    }

    for (let i = 0; i < 160; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -62 + random() * 124,
        3 + random() * 14,
        1.4 + random() * 6,
        random() * 180,
        "rgba(255,244,170," + (0.04 + random() * 0.14).toFixed(4) + ")"
      );
    }

    for (let i = 0; i < 90; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -58 + random() * 116,
        4 + random() * 14,
        1.6 + random() * 7,
        random() * 180,
        "rgba(110,32,10," + (0.03 + random() * 0.06).toFixed(4) + ")"
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
      file: "/assets/audrelia.sun.render.js",
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
    aliases: ["sun", "solar-system-sun", "solar-sun", "audrelia-local-sun"],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAudreliaSunRenderExtension = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaSunRenderExtension = api;

  if (global.DGBShowroomGlobeRender && typeof global.DGBShowroomGlobeRender.registerExtension === "function") {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:audrelia:sun-extension-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
