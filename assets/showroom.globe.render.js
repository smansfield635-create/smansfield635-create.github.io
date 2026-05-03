/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_REAL_MODEL_TEXTURE_RENDER_TNT_v1

   ROLE:
   Render authority only.

   PURPOSE:
   Use real Earth, Sun, and Moon source imagery as the model surface.
   Stop fantasy/procedural body surfaces.
   Preserve globe geometry, axis motion, shadows, and route/instrument split.

   OWNS:
   Real model body drawing.
   Texture projection.
   Globe/sphere visual render.

   DOES_NOT_OWN:
   Route copy.
   Labels.
   Buttons.
   Controls.
   Mount selection.
   Instrument API.
   Gauges.

   LOCAL 4K MODEL PATHS FIRST:
   /assets/textures/earth-blue-marble-4096x2048.jpg
   /assets/textures/earth-blue-marble-4096x2048.png
   /assets/textures/sun-sdo-4096.jpg
   /assets/textures/sun-sdo-4096.png
   /assets/textures/moon-lroc-4096x2048.jpg
   /assets/textures/moon-lroc-4096x2048.png

   OFFICIAL SOURCE FALLBACKS:
   Earth: NASA SVS Blue Marble equirectangular map.
   Sun: NASA/JPL SDO full-disk observation.
   Moon: NASA SVS CGI Moon Kit LRO color map.
*/

(function bindShowroomGlobeRealModelTextureRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_REAL_MODEL_TEXTURE_RENDER_TNT_v1";
  const TAU = Math.PI * 2;
  const BODY_SET = new Set(["earth", "sun", "moon"]);

  const MODEL_SOURCES = {
    earth: [
      "/assets/textures/earth-blue-marble-4096x2048.jpg",
      "/assets/textures/earth-blue-marble-4096x2048.png",
      "/assets/textures/earth-blue-marble-2048x1024.jpg",
      "/assets/textures/earth-blue-marble-2048x1024.png",
      "https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png"
    ],
    sun: [
      "/assets/textures/sun-sdo-4096.jpg",
      "/assets/textures/sun-sdo-4096.png",
      "/assets/textures/sun-sdo-real.jpg",
      "/assets/textures/sun-sdo-real.png",
      "https://d2pn8kiwq2w21t.cloudfront.net/original_images/contentdamsciencepsdphotojournalpiapia26pia26681PIA26681.jpg"
    ],
    moon: [
      "/assets/textures/moon-lroc-4096x2048.jpg",
      "/assets/textures/moon-lroc-4096x2048.png",
      "/assets/textures/moon-lroc-2048x1024.jpg",
      "/assets/textures/moon-lroc-2048x1024.png",
      "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg"
    ]
  };

  const modelCache = {
    earth: null,
    sun: null,
    moon: null
  };

  const modelStatus = {
    earth: { loaded: false, loading: false, source: "", error: "" },
    sun: { loaded: false, loading: false, source: "", error: "" },
    moon: { loaded: false, loading: false, source: "", error: "" }
  };

  const rendererRegistry = new Set();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeBody(body) {
    body = String(body || "earth").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function loadImageFromCandidates(body, done) {
    body = normalizeBody(body);

    if (modelCache[body]) {
      done(modelCache[body]);
      return;
    }

    if (modelStatus[body].loading) {
      const wait = global.setInterval(() => {
        if (modelCache[body]) {
          global.clearInterval(wait);
          done(modelCache[body]);
        }

        if (modelStatus[body].error === "ALL_MODEL_SOURCES_FAILED") {
          global.clearInterval(wait);
          done(null);
        }
      }, 40);
      return;
    }

    modelStatus[body].loading = true;
    modelStatus[body].error = "";

    const sources = MODEL_SOURCES[body].slice();
    let index = 0;

    function tryNext() {
      const src = sources[index];

      if (!src) {
        modelStatus[body].loading = false;
        modelStatus[body].loaded = false;
        modelStatus[body].error = "ALL_MODEL_SOURCES_FAILED";
        done(null);
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.loading = "eager";
      image.referrerPolicy = "no-referrer";

      image.onload = function onModelLoaded() {
        modelCache[body] = image;
        modelStatus[body].loading = false;
        modelStatus[body].loaded = true;
        modelStatus[body].source = src;
        modelStatus[body].error = "";
        done(image);
        redrawAll();
      };

      image.onerror = function onModelError() {
        index += 1;
        tryNext();
      };

      image.src = src;
    }

    tryNext();
  }

  function redrawAll() {
    rendererRegistry.forEach((renderer) => {
      try {
        renderer.render(renderer.lastOptions || {});
      } catch (_) {}
    });
  }

  function drawLoadingHold(ctx, canvas, body, radius, cx, cy) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
      cx - radius * 0.32,
      cy - radius * 0.36,
      radius * 0.04,
      cx,
      cy,
      radius
    );

    if (body === "sun") {
      gradient.addColorStop(0, "#fff0a3");
      gradient.addColorStop(0.4, "#f0a12f");
      gradient.addColorStop(1, "#4b1306");
    } else if (body === "moon") {
      gradient.addColorStop(0, "#f4f2df");
      gradient.addColorStop(0.5, "#b8bbb4");
      gradient.addColorStop(1, "#4d5660");
    } else {
      gradient.addColorStop(0, "#72d8ff");
      gradient.addColorStop(0.45, "#0b66ad");
      gradient.addColorStop(1, "#011735");
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    drawOptics(ctx, cx, cy, radius, body);

    ctx.save();
    ctx.fillStyle = "rgba(248,241,221,0.72)";
    ctx.font = `800 ${Math.max(12, radius * 0.045)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("REAL MODEL LOADING", cx, cy);
    ctx.restore();
  }

  function drawEquirectangularSphere(ctx, canvas, image, body, longitude, zoom) {
    const size = Math.min(canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = size * 0.395 * (zoom / 100);
    const sliceCount = Math.max(720, Math.floor(radius * 2.8));
    const naturalW = image.naturalWidth || image.width;
    const naturalH = image.naturalHeight || image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    for (let i = 0; i < sliceCount; i += 1) {
      const nx1 = -1 + (2 * i) / sliceCount;
      const nx2 = -1 + (2 * (i + 1)) / sliceCount;
      const nx = (nx1 + nx2) / 2;

      const z = Math.sqrt(Math.max(0, 1 - nx * nx));
      if (z <= 0.001) continue;

      let u = 0.5 + Math.atan2(nx, z) / TAU + longitude;
      u = ((u % 1) + 1) % 1;

      const sx = u * naturalW;
      const sw = Math.max(2, Math.ceil(naturalW / sliceCount) + 2);

      const destX = cx + nx1 * radius;
      const destW = Math.ceil((nx2 - nx1) * radius) + 2;
      const destH = 2 * radius * z;
      const destY = cy - destH / 2;

      drawWrappedStrip(ctx, image, sx, sw, naturalW, naturalH, destX, destY, destW, destH);
    }

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, body);
  }

  function drawWrappedStrip(ctx, image, sx, sw, naturalW, naturalH, dx, dy, dw, dh) {
    const sourceX = Math.floor(sx);
    const sourceW = Math.min(sw, naturalW);

    if (sourceX + sourceW <= naturalW) {
      ctx.drawImage(image, sourceX, 0, sourceW, naturalH, dx, dy, dw, dh);
      return;
    }

    const firstW = naturalW - sourceX;
    const secondW = sourceW - firstW;
    const firstDW = dw * (firstW / sourceW);
    const secondDW = dw - firstDW;

    ctx.drawImage(image, sourceX, 0, firstW, naturalH, dx, dy, firstDW, dh);
    ctx.drawImage(image, 0, 0, secondW, naturalH, dx + firstDW, dy, secondDW, dh);
  }

  function drawFullDiskRealModel(ctx, canvas, image, body, longitude, zoom) {
    const size = Math.min(canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = size * 0.395 * (zoom / 100);

    const sourceSize = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
    const sx = ((image.naturalWidth || image.width) - sourceSize) / 2;
    const sy = ((image.naturalHeight || image.height) - sourceSize) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    clipSphere(ctx, cx, cy, radius);
    ctx.translate(cx, cy);
    ctx.rotate(longitude * TAU * 0.16);
    ctx.translate(-cx, -cy);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      sx,
      sy,
      sourceSize,
      sourceSize,
      cx - radius,
      cy - radius,
      radius * 2,
      radius * 2
    );

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, body);
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function drawOptics(ctx, cx, cy, radius, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.36,
      cy - radius * 0.38,
      radius * 0.035,
      cx,
      cy,
      radius
    );

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.18)");
      highlight.addColorStop(0.28, "rgba(255,238,120,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.18)");
      highlight.addColorStop(0.3, "rgba(255,255,255,0.04)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const limb = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
    limb.addColorStop(0, "rgba(0,0,0,0)");
    limb.addColorStop(0.72, body === "sun" ? "rgba(70,10,0,0.02)" : "rgba(0,0,0,0.08)");
    limb.addColorStop(1, body === "sun" ? "rgba(70,10,0,0.12)" : "rgba(0,0,0,0.4)");

    ctx.fillStyle = limb;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    if (body === "earth") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.012, 0, TAU);
      ctx.strokeStyle = "rgba(126,219,255,0.48)";
      ctx.lineWidth = Math.max(2, radius * 0.024);
      ctx.shadowColor = "rgba(126,219,255,0.42)";
      ctx.shadowBlur = radius * 0.07;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      const corona = ctx.createRadialGradient(cx, cy, radius * 0.84, cx, cy, radius * 1.25);
      corona.addColorStop(0, "rgba(255,197,63,0.15)");
      corona.addColorStop(0.58, "rgba(255,114,26,0.11)");
      corona.addColorStop(1, "rgba(255,114,26,0)");

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    let stroke = "rgba(236,235,219,0.54)";
    let glow = "rgba(255,255,244,0.16)";

    if (body === "earth") {
      stroke = "rgba(134,225,255,0.66)";
      glow = "rgba(126,219,255,0.34)";
    }

    if (body === "sun") {
      stroke = "rgba(255,224,116,0.78)";
      glow = "rgba(255,166,34,0.52)";
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, radius * 0.009);
    ctx.shadowColor = glow;
    ctx.shadowBlur = radius * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const renderer = {
      VERSION,
      version: VERSION,
      lastOptions: {},
      render,
      resize,
      getStatus
    };

    rendererRegistry.add(renderer);

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cssSize = clamp(rect.width || canvas.clientWidth || 420, 260, 1080);
      const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
      const pixelSize = Math.round(cssSize * dpr);

      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }
    }

    function render(options) {
      resize();

      const body = normalizeBody(options && options.body);
      const longitude = Number(options && options.longitude) || 0;
      const zoom = clamp(Number(options && options.zoom) || 100, 70, 240);
      const size = Math.min(canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = size * 0.395 * (zoom / 100);

      renderer.lastOptions = { body, longitude, zoom };

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const image = modelCache[body];

      if (!image) {
        loadImageFromCandidates(body, function onLoaded() {});
        drawLoadingHold(ctx, canvas, body, radius, cx, cy);

        return {
          ok: false,
          version: VERSION,
          body,
          status: "REAL_MODEL_LOADING",
          modelSource: modelStatus[body].source,
          modelError: modelStatus[body].error,
          projection: body === "sun" ? "real-full-disk" : "real-equirectangular-sphere",
          rendererOwns: "body-drawing-only"
        };
      }

      if (body === "sun") {
        drawFullDiskRealModel(ctx, canvas, image, body, longitude, zoom);
      } else {
        drawEquirectangularSphere(ctx, canvas, image, body, longitude, zoom);
      }

      return {
        ok: true,
        version: VERSION,
        body,
        status: "REAL_MODEL_DRAWN",
        modelSource: modelStatus[body].source,
        projection: body === "sun" ? "real-full-disk" : "real-equirectangular-sphere",
        textureRequired: true,
        fantasySurface: false,
        rendererOwns: "body-drawing-only"
      };
    }

    function getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-authority",
        projection: "real-model-texture-sphere",
        ownsBodyDrawing: true,
        ownsRoute: false,
        ownsControls: false,
        ownsLabels: false,
        fantasySurface: false,
        modelStatus: {
          earth: { ...modelStatus.earth },
          sun: { ...modelStatus.sun },
          moon: { ...modelStatus.moon }
        }
      };
    }

    resize();
    return renderer;
  }

  function renderToCanvas(canvas, options) {
    return createRenderer(canvas).render(options || {});
  }

  const api = {
    VERSION,
    version: VERSION,
    createRenderer,
    renderToCanvas,
    getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-file",
        projection: "real-model-texture-sphere",
        ownsBodyDrawing: true,
        ownsRoute: false,
        ownsControls: false,
        ownsLabels: false,
        fantasySurface: false,
        modelStatus: {
          earth: { ...modelStatus.earth },
          sun: { ...modelStatus.sun },
          moon: { ...modelStatus.moon }
        }
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
