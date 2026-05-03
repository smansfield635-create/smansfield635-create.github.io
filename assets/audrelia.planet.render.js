/* /assets/audrelia.planet.render.js
   AUDRELIA_PLANET_RENDER_EXTENSION_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   AUDRELIA_PLANET_PROFILE
   AUDRELIA_PLANET_TEXTURE_LAW
   AUDRELIA_PLANET_SURFACE_COLOR
   AUDRELIA_PLANET_EXTENSION_RECEIPT

   DOES_NOT_OWN=
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   SUN_PIXELS
   MOON_PIXELS
*/

(function bindAudreliaPlanetRenderExtension(global) {
  "use strict";

  const VERSION = "AUDRELIA_PLANET_RENDER_EXTENSION_TNT_v1";
  const ID = "audrelia";
  const LABEL = "Audrelia";
  const TYPE = "planet";
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
      axialTiltDeg: -18.5,
      lightModel: "planet",
      atmosphere: true,
      rimColor: "rgba(154,224,255,0.78)",
      glowColor: "rgba(90,190,255,0.38)",
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
    const random = makeSeededRandom(6350101);

    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#122957");
    ocean.addColorStop(0.22, "#0d638f");
    ocean.addColorStop(0.43, "#137f96");
    ocean.addColorStop(0.62, "#0f4a78");
    ocean.addColorStop(0.82, "#0a2d55");
    ocean.addColorStop(1.00, "#06162f");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 1800; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -74 + random() * 148,
        0.6 + random() * 7.5,
        0.25 + random() * 2.8,
        random() * 180,
        "rgba(145,226,255," + (0.018 + random() * 0.07).toFixed(4) + ")"
      );
    }

    const landColors = [
      "rgba(72,112,85,0.92)",
      "rgba(104,118,90,0.90)",
      "rgba(132,118,102,0.88)",
      "rgba(168,155,130,0.86)",
      "rgba(72,102,94,0.84)"
    ];

    for (let i = 0; i < 54; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -58 + random() * 116,
        7 + random() * 34,
        3 + random() * 15,
        random() * 180,
        landColors[Math.floor(random() * landColors.length)],
        "rgba(255,255,220,0.055)",
        1
      );
    }

    for (let i = 0; i < 64; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -65 + random() * 130;
      const angle = random() * 360;
      const length = 14 + random() * 38;
      const points = [];

      for (let p = 0; p < 13; p += 1) {
        const t = p / 12;
        points.push([
          lon + Math.cos(angle * DEG) * length * (t - 0.5) + Math.sin(t * TAU) * 2.2,
          lat + Math.sin(angle * DEG) * length * (t - 0.5) + Math.cos(t * TAU) * 1.3
        ]);
      }

      drawStroke(
        ctx,
        points,
        random() > 0.52 ? "rgba(232,236,242,0.18)" : "rgba(218,174,82,0.16)",
        2.2
      );
    }

    for (let i = 0; i < 680; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -68 + random() * 136,
        0.4 + random() * 2.8,
        0.18 + random() * 1.2,
        random() * 180,
        random() > 0.55
          ? "rgba(255,255,255," + (0.025 + random() * 0.07).toFixed(4) + ")"
          : "rgba(16,22,30," + (0.02 + random() * 0.06).toFixed(4) + ")"
      );
    }

    for (let band = -56; band <= 56; band += 13) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.5) * 0.08) * 3.4 +
          Math.sin((lon - band * 1.2) * 0.15) * 1.2;
        points.push([lon, band + wobble]);
      }

      drawStroke(ctx, points, "rgba(255,255,255,0.10)", 3);
    }

    for (let i = 0; i < 860; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -62 + random() * 124,
        1 + random() * 10,
        0.35 + random() * 2.2,
        random() * 180,
        "rgba(255,255,255," + (0.025 + random() * 0.11).toFixed(4) + ")"
      );
    }

    const polarNorth = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    polarNorth.addColorStop(0, "rgba(245,250,255,0.30)");
    polarNorth.addColorStop(1, "rgba(245,250,255,0)");
    ctx.fillStyle = polarNorth;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const polarSouth = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.78);
    polarSouth.addColorStop(0, "rgba(245,250,255,0.28)");
    polarSouth.addColorStop(1, "rgba(245,250,255,0)");
    ctx.fillStyle = polarSouth;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.78, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

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
      file: "/assets/audrelia.planet.render.js",
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
    aliases: ["earth", "planet", "audrelia-planet"],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAudreliaPlanetRenderExtension = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaPlanetRenderExtension = api;

  if (global.DGBShowroomGlobeRender && typeof global.DGBShowroomGlobeRender.registerExtension === "function") {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:audrelia:planet-extension-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
