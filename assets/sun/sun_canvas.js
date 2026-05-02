/* SUN_AND_UNIVERSE_G1_STANDARD_RENEWAL_TNT_v1
   FILE: /assets/sun/sun_canvas.js
   ROLE: Self-contained Sun G1 renderer.
*/

(function attachSunG1Renderer(global) {
  "use strict";

  var VERSION = "SUN_AND_UNIVERSE_G1_STANDARD_RENEWAL_TNT_v1";
  var ROLE = "DEMO_UNIVERSE_SUN_G1_RENDERER";

  var state = {
    mounted: false,
    running: false,
    canvas: null,
    ctx: null,
    mountNode: null,
    frame: 0,
    lastTime: 0,
    phase: 0,
    speed: 0.28,
    renderCount: 0,
    lastReceipt: null,
    lastError: null,
    options: {
      visualSize: 560,
      pixelSize: 400,
      fps: 22,
      coronaStrength: 0.38,
      surfaceStrength: 1
    }
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function hash2(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function noise(x, y, seed) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var xf = x - x0;
    var yf = y - y0;
    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);

    var a = hash2(x0, y0, seed);
    var b = hash2(x0 + 1, y0, seed);
    var c = hash2(x0, y0 + 1, seed);
    var d = hash2(x0 + 1, y0 + 1, seed);

    return mix(mix(a, b, u), mix(c, d, u), v);
  }

  function fbm(x, y, seed) {
    return (
      noise(x, y, seed) * 0.42 +
      noise(x * 2.1, y * 2.1, seed + 13) * 0.26 +
      noise(x * 4.2, y * 4.2, seed + 29) * 0.18 +
      noise(x * 8.4, y * 8.4, seed + 47) * 0.10 +
      noise(x * 16.8, y * 16.8, seed + 71) * 0.04
    );
  }

  function resolveMount(target) {
    if (typeof target === "string" && global.document) return global.document.querySelector(target);
    if (target) return target;
    if (!global.document) return null;

    return global.document.getElementById("sun-render") ||
      global.document.querySelector("[data-sun-mount='true']") ||
      global.document.querySelector("[data-demo-universe-sun='true']");
  }

  function prepareMount(target, options) {
    var mount = resolveMount(target);
    var rect;
    var visualSize;
    var pixelSize;
    var canvas;

    if (!mount || !global.document) return null;

    options = Object.assign({}, state.options, options || {});
    rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 0 };

    visualSize = clamp(options.visualSize || rect.width || mount.clientWidth || 560, 260, 720);
    if (global.innerWidth && global.innerWidth < 760) visualSize = clamp(global.innerWidth * 0.82, 260, 430);

    pixelSize = clamp(options.pixelSize || visualSize, 280, 440);

    mount.setAttribute("data-sun-render-active", "true");
    mount.setAttribute("data-sun-g1-active", "true");
    mount.style.display = "grid";
    mount.style.placeItems = "center";
    mount.style.aspectRatio = "1 / 1";
    mount.style.overflow = "visible";

    canvas = mount.querySelector("canvas[data-sun-asset-canvas='true']");
    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-sun-asset-canvas", "true");
      canvas.setAttribute("data-sun-version", VERSION);
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Sun G1 renderer");
      mount.innerHTML = "";
      mount.appendChild(canvas);
    }

    canvas.width = pixelSize;
    canvas.height = pixelSize;
    canvas.style.width = visualSize + "px";
    canvas.style.height = visualSize + "px";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.objectFit = "contain";
    canvas.style.background = "transparent";

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { willReadFrequently: true });
    state.mountNode = mount;
    state.mounted = true;
    state.options = Object.assign({}, options, {
      visualSize: visualSize,
      pixelSize: pixelSize
    });

    return canvas;
  }

  function plasmaColor(value, edge) {
    var red = [128, 36, 18];
    var orange = [235, 94, 28];
    var gold = [255, 176, 50];
    var yellow = [255, 226, 112];
    var white = [255, 246, 190];
    var c;

    if (value > 0.82) {
      c = [
        mix(yellow[0], white[0], (value - 0.82) / 0.18),
        mix(yellow[1], white[1], (value - 0.82) / 0.18),
        mix(yellow[2], white[2], (value - 0.82) / 0.18)
      ];
    } else if (value > 0.58) {
      c = [
        mix(gold[0], yellow[0], (value - 0.58) / 0.24),
        mix(gold[1], yellow[1], (value - 0.58) / 0.24),
        mix(gold[2], yellow[2], (value - 0.58) / 0.24)
      ];
    } else if (value > 0.32) {
      c = [
        mix(orange[0], gold[0], (value - 0.32) / 0.26),
        mix(orange[1], gold[1], (value - 0.32) / 0.26),
        mix(orange[2], gold[2], (value - 0.32) / 0.26)
      ];
    } else {
      c = [
        mix(red[0], orange[0], value / 0.32),
        mix(red[1], orange[1], value / 0.32),
        mix(red[2], orange[2], value / 0.32)
      ];
    }

    c[0] *= 1 - edge * 0.16;
    c[1] *= 1 - edge * 0.12;
    c[2] *= 1 - edge * 0.22;

    return [
      Math.round(clamp(c[0], 0, 255)),
      Math.round(clamp(c[1], 0, 255)),
      Math.round(clamp(c[2], 0, 255)),
      255
    ];
  }

  function drawCorona(ctx, size) {
    var cx = size / 2;
    var cy = size / 2;
    var r = size * 0.32;
    var strength = clamp(state.options.coronaStrength, 0, 0.72);
    var g = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.72);

    g.addColorStop(0, "rgba(255,226,120," + (0.25 * strength) + ")");
    g.addColorStop(0.32, "rgba(255,162,58," + (0.18 * strength) + ")");
    g.addColorStop(0.68, "rgba(255,96,42," + (0.08 * strength) + ")");
    g.addColorStop(1, "rgba(255,96,42,0)");

    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSurface(ctx, size) {
    var cx = size / 2;
    var cy = size / 2;
    var r = size * 0.32;
    var image = ctx.createImageData(size, size);
    var data = image.data;
    var phase = state.phase;
    var x;
    var y;
    var dx;
    var dy;
    var dist;
    var edge;
    var angle;
    var swirl;
    var band;
    var grain;
    var cell;
    var heat;
    var idx;
    var color;

    for (y = 0; y < size; y += 1) {
      for (x = 0; x < size; x += 1) {
        dx = (x - cx) / r;
        dy = (y - cy) / r;
        dist = Math.sqrt(dx * dx + dy * dy);
        idx = (y * size + x) * 4;

        if (dist > 1) {
          data[idx + 3] = 0;
          continue;
        }

        angle = Math.atan2(dy, dx);
        edge = clamp((dist - 0.72) / 0.28, 0, 1);
        swirl = Math.sin(angle * 7 + dist * 8.5 - phase * 1.8) * 0.5 + 0.5;
        band = Math.sin((dx * 3.2 - dy * 1.4) + phase * 0.95 + Math.sin(angle * 5) * 0.35) * 0.5 + 0.5;
        grain = fbm(dx * 3.2 + phase * 0.18, dy * 3.2 - phase * 0.12, 41);
        cell = fbm(dx * 8.0 - phase * 0.20, dy * 8.0 + phase * 0.16, 97);

        heat = clamp(0.30 + grain * 0.38 + cell * 0.20 + swirl * 0.18 + band * 0.16 - edge * 0.18, 0, 1);
        color = plasmaColor(heat, edge);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    ctx.putImageData(image, 0, 0);

    var shade = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.36, r * 0.06, cx, cy, r);
    shade.addColorStop(0, "rgba(255,255,220,0.22)");
    shade.addColorStop(0.42, "rgba(255,255,220,0.05)");
    shade.addColorStop(0.86, "rgba(110,28,10,0.16)");
    shade.addColorStop(1, "rgba(60,9,4,0.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255, 222, 136, 0.34)";
    ctx.lineWidth = Math.max(1, size * 0.004);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    var canvas = state.canvas;
    var ctx = state.ctx;
    var size;

    if (!canvas || !ctx) {
      state.lastReceipt = {
        ok: false,
        reason: "NO_CANVAS",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    size = Math.min(canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCorona(ctx, size);
    drawSurface(ctx, size);

    state.renderCount += 1;
    state.lastReceipt = {
      ok: true,
      version: VERSION,
      role: ROLE,
      sunG1: true,
      circular: true,
      plasma: true,
      controlledRadiance: true,
      mobileSafeMotion: true,
      earthRendererInheritance: false,
      moonQueued: true,
      visualPassClaimed: false,
      renderCount: state.renderCount,
      timestamp: new Date().toISOString()
    };

    return state.lastReceipt;
  }

  function tick(time) {
    var fps = clamp(state.options.fps || 22, 8, 28);
    var minDelta = 1000 / fps;
    var delta;

    if (!state.running) return;

    if (!state.lastTime) state.lastTime = time;
    delta = time - state.lastTime;

    if (delta >= minDelta) {
      state.phase += state.speed * Math.min(delta, 80) / 1000;
      state.lastTime = time;
      draw();
    }

    state.frame = global.requestAnimationFrame(tick);
  }

  function start() {
    if (state.running) return getStatus();

    state.running = true;
    state.lastTime = 0;

    if (state.frame) global.cancelAnimationFrame(state.frame);
    state.frame = global.requestAnimationFrame(tick);

    return getStatus();
  }

  function pause() {
    state.running = false;
    if (state.frame) global.cancelAnimationFrame(state.frame);
    state.frame = 0;
    return getStatus();
  }

  function resume() {
    return start();
  }

  function reset() {
    state.phase = 0;
    draw();
    return getStatus();
  }

  function slow() {
    state.speed = 0.12;
    return getStatus();
  }

  function normal() {
    state.speed = 0.28;
    return getStatus();
  }

  function fast() {
    state.speed = 0.64;
    return getStatus();
  }

  function setSpeed(value) {
    var n = Number(value);
    if (n > 1) n = n / 100;
    state.speed = clamp(n, 0, 1) * 0.85;
    return getStatus();
  }

  function mount(target, options) {
    var canvas = prepareMount(target, options);

    if (!canvas) {
      state.lastReceipt = {
        ok: false,
        reason: "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    draw();

    if (!options || options.autoStart !== false) {
      start();
    }

    return {
      ok: true,
      mounted: true,
      version: VERSION,
      sunG1: true,
      circular: true,
      plasma: true,
      visualPassClaimed: false
    };
  }

  function render(target, options) {
    if (target && target.getContext) {
      state.canvas = target;
      state.ctx = target.getContext("2d", { willReadFrequently: true });
      state.options = Object.assign({}, state.options, options || {});
      draw();
      return getStatus();
    }

    return mount(target, options);
  }

  function destroy() {
    pause();

    if (state.canvas && state.canvas.parentNode) {
      state.canvas.parentNode.removeChild(state.canvas);
    }

    if (state.mountNode) {
      state.mountNode.removeAttribute("data-sun-render-active");
      state.mountNode.removeAttribute("data-sun-g1-active");
    }

    state.canvas = null;
    state.ctx = null;
    state.mountNode = null;
    state.mounted = false;

    return {
      ok: true,
      destroyed: true,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    return {
      ok: true,
      VERSION: VERSION,
      version: VERSION,
      role: ROLE,
      active: true,
      mounted: state.mounted,
      running: state.running,
      phase: state.phase,
      speed: state.speed,
      renderCount: state.renderCount,
      sunG1: true,
      circular: true,
      plasma: true,
      controlledRadiance: true,
      earthG1Complete: true,
      earthRendererInheritance: false,
      moonQueued: true,
      planetOneReservedForFutureNineSummitsUniverse: true,
      generatedImageDependency: false,
      visualPassClaimed: false,
      lastReceipt: state.lastReceipt,
      lastError: state.lastError
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    ROLE: ROLE,
    mount: mount,
    render: render,
    draw: draw,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    slow: slow,
    normal: normal,
    fast: fast,
    setSpeed: setSpeed,
    destroy: destroy,
    getStatus: getStatus,
    status: getStatus,
    visualPassClaimed: false
  };

  global.DGBSunAssetCanvas = api;
  global.DGBDemoUniverseSunCanvas = api;
  global.DGBSun = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:sun:g1-standard-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
