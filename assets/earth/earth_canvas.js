/* ASSET GENERATION 2 TERMS RENEWAL
   FILE: /assets/earth/earth_canvas.js
   VERSION: ASSET_GENERATION_2_EARTH_VISIBILITY_AXIS_SPIN_TOUCH_TNT_v1

   ROLE:
   Demo Universe Earth asset renderer.
   Owns local Earth visual rendering, axis presentation, spin, and touch drag inside the asset layer.
   Does not claim visual pass or final lock-in.
*/

(function attachEarthAssetCanvasG2(global) {
  "use strict";

  var VERSION = "ASSET_GENERATION_2_EARTH_VISIBILITY_AXIS_SPIN_TOUCH_TNT_v1";
  var SURFACE_URL = "/assets/earth/earth_surface_2048.jpg";
  var CLOUDS_URL = "/assets/earth/earth_clouds_2048.jpg";

  var state = {
    ready: false,
    loading: null,
    surface: null,
    clouds: null,
    canvas: null,
    mount: null,
    ctx: null,
    running: false,
    raf: 0,
    lastTime: 0,
    viewLon: -82,
    viewLat: 4,
    speedDegPerSecond: 7.5,
    direction: 1,
    showAxis: true,
    touchEnabled: true,
    dragging: false,
    dragWasRunning: false,
    dragX: 0,
    dragY: 0,
    renderCount: 0,
    lastReceipt: null,
    lastError: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function radToDeg(value) {
    return value * 180 / Math.PI;
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("Image failed: " + src)); };
      img.src = src;
    });
  }

  function imageToData(img) {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d", { willReadFrequently: true });
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0, c.width, c.height);

    return {
      canvas: c,
      ctx: ctx,
      data: ctx.getImageData(0, 0, c.width, c.height).data,
      width: c.width,
      height: c.height
    };
  }

  function ensureAssets() {
    if (state.ready) return Promise.resolve(state);
    if (state.loading) return state.loading;

    state.loading = Promise.all([
      loadImage(SURFACE_URL),
      loadImage(CLOUDS_URL)
    ]).then(function (imgs) {
      state.surface = imageToData(imgs[0]);
      state.clouds = imageToData(imgs[1]);
      state.ready = true;
      state.loading = null;
      return state;
    }).catch(function (error) {
      state.loading = null;
      state.lastError = String(error && error.message ? error.message : error);
      throw error;
    });

    return state.loading;
  }

  function readPixel(img, u, v) {
    var x = Math.floor((((u % 1) + 1) % 1) * (img.width - 1));
    var y = Math.floor(clamp(v, 0, 1) * (img.height - 1));
    var i = (y * img.width + x) * 4;
    var d = img.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]];
  }

  function inverseOrthographic(x, y, viewLon, viewLat) {
    var rho = Math.sqrt(x * x + y * y);
    var c;
    var sinC;
    var cosC;
    var lat0;
    var lon0;
    var lat;
    var lon;

    if (rho > 1) return null;

    if (rho < 0.000001) {
      return { lon: normalizeLon(viewLon), lat: viewLat, limb: 1 };
    }

    c = Math.asin(rho);
    sinC = Math.sin(c);
    cosC = Math.cos(c);
    lat0 = degToRad(viewLat);
    lon0 = degToRad(viewLon);

    lat = Math.asin(cosC * Math.sin(lat0) + (y * sinC * Math.cos(lat0)) / rho);
    lon = lon0 + Math.atan2(
      x * sinC,
      rho * Math.cos(lat0) * cosC - y * Math.sin(lat0) * sinC
    );

    return {
      lon: normalizeLon(radToDeg(lon)),
      lat: clamp(radToDeg(lat), -89, 89),
      limb: Math.sqrt(Math.max(0, 1 - rho * rho))
    };
  }

  function shade(surface, cloud, limb, options) {
    options = options || {};

    var cloudAlpha = clamp((cloud[0] + cloud[1] + cloud[2]) / 765, 0, 1);
    var cloudStrength = clamp(options.cloudStrength == null ? 0.30 : options.cloudStrength, 0, 0.72);
    var brightness = clamp(options.brightness == null ? 1.10 : options.brightness, 0.65, 1.75);
    var contrast = clamp(options.contrast == null ? 1.08 : options.contrast, 0.70, 1.55);
    var limbShade = clamp(0.52 + limb * 0.58, 0.38, 1.10);
    var atmosphere = clamp((1 - limb) * 0.07, 0, 0.13);

    var r = (surface[0] - 128) * contrast + 128;
    var g = (surface[1] - 128) * contrast + 128;
    var b = (surface[2] - 128) * contrast + 128;

    r = r * brightness * limbShade;
    g = g * brightness * limbShade;
    b = b * brightness * limbShade;

    r = r * (1 - cloudAlpha * cloudStrength) + 247 * cloudAlpha * cloudStrength;
    g = g * (1 - cloudAlpha * cloudStrength) + 250 * cloudAlpha * cloudStrength;
    b = b * (1 - cloudAlpha * cloudStrength) + 255 * cloudAlpha * cloudStrength;

    r += 90 * atmosphere;
    g += 140 * atmosphere;
    b += 225 * atmosphere;

    return [
      Math.round(clamp(r, 0, 255)),
      Math.round(clamp(g, 0, 255)),
      Math.round(clamp(b, 0, 255)),
      255
    ];
  }

  function drawFallback() {
    if (!state.ctx || !state.canvas) return;

    var canvas = state.canvas;
    var ctx = state.ctx;
    var w = canvas.width;
    var h = canvas.height;
    var size = Math.min(w, h);
    var cx = w / 2;
    var cy = h / 2;
    var radius = size * 0.43;
    var g = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.34, radius * 0.05, cx, cy, radius);

    ctx.clearRect(0, 0, w, h);
    g.addColorStop(0, "#5f9fd4");
    g.addColorStop(0.45, "#0a579a");
    g.addColorStop(0.82, "#031d59");
    g.addColorStop(1, "#020814");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(145,190,255,.30)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();

    drawAxis(ctx, cx, cy, radius);

    state.lastReceipt = {
      ok: false,
      waitingForAssets: true,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    var halo = ctx.createRadialGradient(cx, cy, radius * 0.80, cx, cy, radius * 1.08);
    halo.addColorStop(0, "rgba(120,185,255,0)");
    halo.addColorStop(0.86, "rgba(120,185,255,.030)");
    halo.addColorStop(1, "rgba(120,185,255,.18)");

    ctx.save();
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawAxis(ctx, cx, cy, radius) {
    if (!state.showAxis) return;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.08);
    ctx.lineTo(0, radius * 1.08);
    ctx.strokeStyle = "rgba(242,199,111,.18)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -radius * 1.08, Math.max(2, radius * 0.012), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,199,111,.28)";
    ctx.fill();

    ctx.restore();
  }

  function draw(options) {
    options = options || {};
    if (!state.canvas || !state.ctx) return null;

    if (!state.ready) {
      drawFallback();
      return state.lastReceipt;
    }

    var canvas = state.canvas;
    var ctx = state.ctx;
    var dpr = Math.max(1, Math.min(2, global.devicePixelRatio || 1));
    var cssSize = Number(canvas.dataset.cssSize || 360);
    var renderSize = Math.max(320, Math.min(820, Math.round(cssSize * dpr * 0.92)));
    var off = document.createElement("canvas");
    var offCtx = off.getContext("2d", { willReadFrequently: true });
    var image;
    var data;
    var cx;
    var cy;
    var radius;
    var x;
    var y;
    var dx;
    var dy;
    var idx;
    var geo;
    var u;
    var v;
    var cloudU;
    var surface;
    var cloud;
    var color;

    off.width = renderSize;
    off.height = renderSize;
    image = offCtx.createImageData(renderSize, renderSize);
    data = image.data;
    cx = renderSize / 2;
    cy = renderSize / 2;
    radius = renderSize * 0.44;

    for (y = 0; y < renderSize; y += 1) {
      for (x = 0; x < renderSize; x += 1) {
        dx = (x - cx) / radius;
        dy = (cy - y) / radius;
        idx = (y * renderSize + x) * 4;

        if (dx * dx + dy * dy > 1) {
          data[idx + 3] = 0;
          continue;
        }

        geo = inverseOrthographic(dx, dy, state.viewLon, state.viewLat);
        if (!geo) {
          data[idx + 3] = 0;
          continue;
        }

        u = (normalizeLon(geo.lon) + 180) / 360;
        cloudU = (normalizeLon(geo.lon + 8) + 180) / 360;
        v = (90 - geo.lat) / 180;

        surface = readPixel(state.surface, u, v);
        cloud = readPixel(state.clouds, cloudU, v);
        color = shade(surface, cloud, geo.limb, options);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    offCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    drawAtmosphere(ctx, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.44);
    drawAxis(ctx, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.44);

    state.renderCount += 1;
    state.lastReceipt = {
      ok: true,
      version: VERSION,
      demoUniverseEarthBaseline: true,
      earthAssetSpineAdopted: true,
      axisVisible: state.showAxis,
      spinOperational: state.running,
      touchEnabled: state.touchEnabled,
      viewLon: state.viewLon,
      viewLat: state.viewLat,
      renderCount: state.renderCount,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return state.lastReceipt;
  }

  function frame(timestamp) {
    if (!state.running) return;

    if (!state.lastTime) state.lastTime = timestamp;
    var delta = Math.min(80, timestamp - state.lastTime);
    state.lastTime = timestamp;

    state.viewLon = normalizeLon(state.viewLon + state.direction * state.speedDegPerSecond * (delta / 1000));
    draw(state.lastOptions || {});

    state.raf = global.requestAnimationFrame(frame);
  }

  function start() {
    if (state.running) return getStatus();
    state.running = true;
    state.lastTime = 0;
    if (state.raf) global.cancelAnimationFrame(state.raf);
    state.raf = global.requestAnimationFrame(frame);
    return getStatus();
  }

  function pause() {
    state.running = false;
    if (state.raf) global.cancelAnimationFrame(state.raf);
    state.raf = 0;
    return getStatus();
  }

  function resume() {
    return start();
  }

  function reset() {
    state.viewLon = -82;
    state.viewLat = 4;
    draw(state.lastOptions || {});
    return getStatus();
  }

  function reverse() {
    state.direction = state.direction === 1 ? -1 : 1;
    return getStatus();
  }

  function slow() {
    state.speedDegPerSecond = 2.5;
    return getStatus();
  }

  function normal() {
    state.speedDegPerSecond = 7.5;
    return getStatus();
  }

  function fast() {
    state.speedDegPerSecond = 18;
    return getStatus();
  }

  function setSpeed(value) {
    var n = Number(value);
    if (n > 1) n = n / 100;
    state.speedDegPerSecond = clamp(n, 0, 1) * 24;
    return getStatus();
  }

  function setAxis(value) {
    state.showAxis = Boolean(value);
    draw(state.lastOptions || {});
    return getStatus();
  }

  function bindTouch(canvas) {
    if (!canvas || canvas.dataset.earthTouchBound === "true") return;

    canvas.dataset.earthTouchBound = "true";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    canvas.addEventListener("pointerdown", function (event) {
      if (!state.touchEnabled) return;
      state.dragging = true;
      state.dragWasRunning = state.running;
      pause();
      state.dragX = event.clientX;
      state.dragY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!state.dragging || !state.touchEnabled) return;

      var dx = event.clientX - state.dragX;
      var dy = event.clientY - state.dragY;
      state.dragX = event.clientX;
      state.dragY = event.clientY;

      state.viewLon = normalizeLon(state.viewLon - dx * 0.32);
      state.viewLat = clamp(state.viewLat + dy * 0.20, -62, 62);
      draw(state.lastOptions || {});
    });

    function endDrag(event) {
      if (!state.dragging) return;
      state.dragging = false;
      try { canvas.releasePointerCapture(event.pointerId); } catch (error) {}
      if (state.dragWasRunning) start();
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", endDrag);
  }

  function resolveMount(target) {
    if (typeof target === "string") return document.querySelector(target);
    if (target) return target;

    return document.getElementById("planet-one-render") ||
      document.querySelector("[data-earth-asset-mount='true']") ||
      document.querySelector("[data-planet-one-mount='true']");
  }

  function ensureCanvas(target, options) {
    var mount = resolveMount(target);
    var canvas;
    var rect;
    var cssSize;
    var dpr;

    options = options || {};
    if (!mount) return null;

    rect = mount.getBoundingClientRect();
    cssSize = Math.max(260, Math.min(720, Number(options.cssSize || rect.width || mount.clientWidth || 340)));
    dpr = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas = mount.querySelector("canvas[data-earth-asset-canvas='true']");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("data-earth-asset-canvas", "true");
      canvas.setAttribute("data-planet-one-render-canvas", "true");
      canvas.setAttribute("data-earth-asset-version", VERSION);
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Demo Universe Earth baseline");
      mount.innerHTML = "";
      mount.appendChild(canvas);
    }

    canvas.dataset.cssSize = String(cssSize);
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { willReadFrequently: true });
    state.mount = mount;

    bindTouch(canvas);

    return canvas;
  }

  function mount(target, options) {
    options = Object.assign({
      autoSpin: true,
      showAxis: true,
      touchEnabled: true,
      brightness: 1.10,
      contrast: 1.08,
      cloudStrength: 0.30
    }, options || {});

    state.lastOptions = options;
    state.showAxis = options.showAxis !== false;
    state.touchEnabled = options.touchEnabled !== false;

    var canvas = ensureCanvas(target, options);
    if (!canvas) {
      state.lastReceipt = {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    drawFallback();

    ensureAssets().then(function () {
      draw(options);
      if (options.autoSpin !== false) start();
    }).catch(function () {
      drawFallback();
    });

    return {
      ok: true,
      mounted: true,
      loading: !state.ready,
      version: VERSION,
      axisVisible: state.showAxis,
      touchEnabled: state.touchEnabled,
      visualPassClaimed: false
    };
  }

  function render(target, options) {
    if (target && target.getContext) {
      state.canvas = target;
      state.ctx = target.getContext("2d", { willReadFrequently: true });
      state.lastOptions = options || state.lastOptions || {};
      return draw(state.lastOptions);
    }

    return mount(target, options);
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      role: "DEMO_UNIVERSE_EARTH_ASSET_RENDERER",
      ready: state.ready,
      running: state.running,
      axisVisible: state.showAxis,
      touchEnabled: state.touchEnabled,
      viewLon: state.viewLon,
      viewLat: state.viewLat,
      speedDegPerSecond: state.speedDegPerSecond,
      direction: state.direction,
      renderCount: state.renderCount,
      earthAssetSpineAdopted: true,
      demoUniverseEarthBaseline: true,
      ownsRouteRuntime: false,
      ownsGauges: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      lastReceipt: state.lastReceipt,
      lastError: state.lastError
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    ensureAssets: ensureAssets,
    mount: mount,
    render: render,
    renderToCanvas: render,
    draw: draw,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    reverse: reverse,
    slow: slow,
    normal: normal,
    fast: fast,
    setSpeed: setSpeed,
    setAxis: setAxis,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBEarthAssetCanvas = api;
  global.DGBDemoUniverseEarthCanvas = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:earth-asset:g2-axis-spin-touch-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
