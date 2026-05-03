/* /assets/audrelia.climate-moon.render.js
   ADRALIA_MOON_EARTH_MOON_MECHANIZED_RENEWAL_TNT_v1

   ROLE=
   DOWNSTREAM_RENDER_EXTENSION

   OWNS=
   ADRALIA_MOON_PROFILE_LABEL
   EARTH_MOON_REFERENCE_SURFACE
   LUNAR_MARIA_LANGUAGE
   CRATERED_REGOLITH
   SUBTLE_MECHANIZED_CLIMATE_ELEMENTS
   MOON_EXTENSION_RECEIPT

   DESIGN=
   Designed after Earth’s Moon first.
   Mechanized/climate-regulation element second.
   No clean Death-Star read.
   No fantasy color body.
   No generic gray ball.
*/

(function bindAdraliaMoonRenderExtension(global) {
  "use strict";

  const VERSION = "ADRALIA_MOON_EARTH_MOON_MECHANIZED_RENEWAL_TNT_v1";
  const ID = "audrelia-moon";
  const LABEL = "Adralia’s Moon";
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
      axialTiltDeg: -6.68,
      lightModel: "moon",
      earthMoonReference: true,
      manufactured: true,
      climateRegulation: true,
      mechanizedElement: "subtle-surface-integrated",
      rimColor: "rgba(230,236,232,0.76)",
      glowColor: "rgba(165,185,205,0.24)",
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
    const random = makeSeededRandom(6350314);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#d9d8d0");
    base.addColorStop(0.24, "#c4c4bd");
    base.addColorStop(0.50, "#a3a49f");
    base.addColorStop(0.74, "#81878a");
    base.addColorStop(1.00, "#5d6870");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    /*
      Earth-Moon reference maria:
      large dark basaltic basins first, not machinery first.
    */
    drawEllipse(ctx, -42, 24, 28, 12, -7, "rgba(48,51,53,0.34)");
    drawEllipse(ctx, -7, 18, 24, 10, 8, "rgba(54,57,59,0.31)");
    drawEllipse(ctx, 32, -2, 30, 13, 10, "rgba(52,55,57,0.33)");
    drawEllipse(ctx, -58, -24, 22, 9, -12, "rgba(45,48,50,0.28)");
    drawEllipse(ctx, 78, 28, 20, 8, -8, "rgba(60,62,64,0.21)");
    drawEllipse(ctx, 106, -22, 16, 6, -10, "rgba(65,67,69,0.16)");
    drawEllipse(ctx, -102, -8, 15, 6, 3, "rgba(46,50,52,0.18)");

    /*
      Lunar crater field:
      dense, varied, natural impact language.
    */
    for (let i = 0; i < 4300; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -82 + random() * 164;
      const size = 0.16 + Math.pow(random(), 2.75) * 8.4;
      const strength = 0.10 + random() * 0.60;

      drawEllipse(
        ctx,
        lon,
        lat,
        size,
        size * (0.56 + random() * 0.22),
        random() * 180,
        "rgba(24,26,28," + (0.038 + strength * 0.105).toFixed(4) + ")"
      );

      drawEllipse(
        ctx,
        lon - size * 0.06,
        lat - size * 0.06,
        size * 0.72,
        size * 0.47,
        random() * 180,
        "rgba(255,255,246," + (0.026 + strength * 0.060).toFixed(4) + ")"
      );
    }

    /*
      Regolith grain and mineral variation.
    */
    for (let i = 0; i < 1400; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -78 + random() * 156,
        0.08 + random() * 0.72,
        0.05 + random() * 0.38,
        random() * 180,
        random() > 0.52
          ? "rgba(255,255,255," + (0.018 + random() * 0.052).toFixed(4) + ")"
          : "rgba(18,21,23," + (0.016 + random() * 0.044).toFixed(4) + ")"
      );
    }

    /*
      Mechanized climate element:
      integrated into the lunar surface as faint alignment arcs and embedded nodes.
      This must read as moon first, machine second.
    */
    for (let i = 0; i < 10; i += 1) {
      const lat = -58 + i * 12.5;
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wave =
          Math.sin((lon * 0.051) + i) * 1.35 +
          Math.sin((lon * 0.117) - i) * 0.48;
        points.push([lon, lat + wave]);
      }

      drawStroke(ctx, points, "rgba(206,226,218,0.040)", 0.95);
    }

    for (let i = 0; i < 36; i += 1) {
      const lon = -180 + random() * 360;
      const points = [];

      for (let lat = -68; lat <= 68; lat += 4) {
        const wobble = Math.sin((lat * 0.08) + i) * 0.72;
        points.push([lon + wobble, lat]);
      }

      drawStroke(ctx, points, "rgba(182,215,205,0.026)", 0.72);
    }

    for (let i = 0; i < 88; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -62 + random() * 124;
      const r = 0.22 + random() * 0.82;

      drawEllipse(ctx, lon, lat, r, r * 0.70, 0, "rgba(208,236,224,0.072)");
      drawEllipse(ctx, lon, lat, r * 0.32, r * 0.22, 0, "rgba(245,255,245,0.060)");
    }

    /*
      Assembly evidence:
      not panels; faint rubble-bond lines suggesting manufactured assembly from space rock.
    */
    for (let i = 0; i < 54; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const length = 4 + random() * 15;
      const angle = random() * 360;
      const points = [];

      for (let p = 0; p < 7; p += 1) {
        const t = p / 6;
        points.push([
          lon + Math.cos(angle * DEG) * length * (t - 0.5),
          lat + Math.sin(angle * DEG) * length * (t - 0.5)
        ]);
      }

      drawStroke(ctx, points, "rgba(230,238,235,0.040)", 0.82);
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
      earthMoonReference: true,
      moonFirst: true,
      mechanizedSecond: true,
      climateRegulationVisibleOnInspection: true,
      ownsBodyPixelsOnly: true,
      profileMerge: false,
      generatedImage: false,
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
      manufacturedClimateMoon: true,
      assembledSpaceRockSurface: true,
      subtleMechanizedElement: true,
      climateRegulationLattice: true,
      moonFirstMachineSecond: true,
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

  global.DGBAudreliaClimateMoonRenderExtension = api;
  global.DGBAdraliaMoonRenderExtension = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaClimateMoonRenderExtension = api;
  global.DiamondGateBridge.DGBAdraliaMoonRenderExtension = api;

  if (global.DGBShowroomGlobeRender && typeof global.DGBShowroomGlobeRender.registerExtension === "function") {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:audrelia:climate-moon-extension-ready", { detail: getStatus() }));
    global.dispatchEvent(new CustomEvent("dgb:adralia:moon-extension-ready", { detail: getStatus() }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
