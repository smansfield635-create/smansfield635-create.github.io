/* SUN TERMS RENEWAL
   FILE: /assets/sun/sun_canvas.js
   VERSION: SUN_TERMS_RENEWAL_TNT_v1

   ROLE:
   Self-contained Demo Universe Sun asset renderer.
   Owns Sun visual body only: plasma surface, controlled corona, and mobile-safe motion.
   Does not own Earth G1, Moon, Planet 1, route runtime, Gauges, or lock-in.
*/

(function attachSunAssetCanvas(global) {
  "use strict";

  var VERSION = "SUN_TERMS_RENEWAL_TNT_v1";
  var ROLE = "DEMO_UNIVERSE_SUN_ASSET_RENDERER";

  var state = {
    mounted: false,
    running: false,
    ready: true,
    canvas: null,
    ctx: null,
    mount: null,
    raf: 0,
    lastTime: 0,
    phase: 0,
    speed: 0.34,
    renderCount: 0,
    lastReceipt: null,
    lastError: null,
    options: {
      size: 520,
      corona: true,
      coronaStrength: 0.42,
      plasmaStrength: 1,
      granulation: 1,
      brightness: 1,
      fps: 24
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

  function valueNoise(x, y, seed) {
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
      valueNoise(x, y, seed) * 0.40 +
      valueNoise(x * 2.1, y * 2.1, seed + 17) * 0.27 +
      valueNoise(x * 4.2, y * 4.2, seed + 31) * 0.18 +
      valueNoise(x * 8.4, y * 8.4, seed + 53) * 0.10 +
      valueNoise(x * 16.8, y * 16.8, seed + 79) * 0.05
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

  function ensureCanvas(target, options) {
    var mount = resolveMount(target);
    var canvas;
    var rect;
    var cssSize;
    var dpr;

    options = Object.assign({}, state.options, options || {});

    if (!mount || !global.document) return null;

    rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 0 };
    cssSize = Math.max(260, Math.min(760, Number(options.size || rect.width || mount.clientWidth || state.options.size)));
    dpr = Math.max(1, Math.min(2, global.devicePixelRatio || 1));

    canvas = mount.querySelector("canvas[data-sun-asset-canvas='true']");
    if (!canvas) {
      canvas = global.document.createElement("canvas");
      canvas.setAttribute("data-sun-asset-canvas", "true");
      canvas.setAttribute("data-sun-version", VERSION);
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("aria-label", "Demo Universe Sun asset");
      mount.innerHTML = "";
      mount.appendChild(canvas);
    }

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
    state.mounted = true;
    state.options = options;

    return canvas;
  }

  function plasmaColor(intensity, heat, edge) {
    var core = [255, 242, 166];
    var gold = [255, 186, 58];
    var orange = [242, 103, 28];
    var red = [118, 32, 22];

    var color;

    if (intensity > 0.72) {
      color = [
        mix(gold[0], core[0], (intensity - 0.72) / 0.28),
        mix(gold[1], core[1], (intensity - 0.72) / 0.28),
        mix(gold[2], core[2], (intensity - 0.72) / 0.28)
      ];
    } else if (intensity > 0.38) {
      color = [
        mix(orange[0], gold[0], (intensity - 0.38) / 0.34),
        mix(orange[1], gold[1], (intensity - 0.38) / 0.34),
        mix(orange[2], gold[2], (intensity - 0.38) / 0.34)
      ];
    } else {
      color = [
        mix(red[0], orange[0], intensity / 0.38),
        mix(red[1], orange[1], intensity / 0.38),
        mix(red[2], orange[2], intensity / 0.38)
      ];
    }

    color[0] = color[0] * (0.82 + heat * 0.22) * (1 - edge * 0.12);
    color[1] = color[1] * (0.82 + heat * 0.16) * (1 - edge * 0.10);
    color[2] = color[2] * (0.78 + heat * 0.12) * (1 - edge * 0.18);

    return [
      Math.round(clamp(color[0], 0, 255)),
      Math.round(clamp(color[1], 0, 255)),
      Math.round(clamp(color[2], 0, 255)),
      255
    ];
  }

  function drawCorona(ctx, cx, cy, radius, options) {
    if (options.corona === false) return;

    var strength = clamp(options.coronaStrength == null ? 0.42 : options.coronaStrength, 0, 0.75);
    var outer = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.65);

    outer.addColorStop(0, "rgba(255,214,96," + (0.22 * strength) + ")");
    outer.addColorStop(0.42, "rgba(255,148,50," + (0.16 * strength) + ")");
    outer.addColorStop(0.72, "rgba(255,93,35," + (0.08 * strength) + ")");
    outer.addColorStop(1, "rgba(255,93,35,0)");

    ctx.save();
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawDisc(ctx, size, options) {
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.31;
    var image = ctx.createImageData(size, size);
    var data = image.data;
    var phase = state.phase;
    var x;
    var y;
    var dx;
    var dy;
    var dist;
    var idx;
    var angle;
    var swirlX;
    var swirlY;
    var band;
    var grain;
    var flare;
    var edge;
    var intensity;
    var heat;
    var color;

    for (y = 0; y < size; y += 1) {
      for (x = 0; x < size; x += 1) {
        dx = (x - cx) / radius;
        dy = (y - cy) / radius;
        dist = Math.sqrt(dx * dx + dy * dy);
        idx = (y * size + x) * 4;

        if (dist > 1) {
          data[idx + 3] = 0;
          continue;
        }

        angle = Math.atan2(dy, dx);
        swirlX = dx * 2.8 + Math.cos(angle * 3 + phase * 0.7) * 0.22 + phase * 0.16;
        swirlY = dy * 2.8 + Math.sin(angle * 2 - phase * 0.6) * 0.22 - phase * 0.10;

        band = Math.sin(angle * 9 + dist * 9 - phase * 1.8) * 0.5 + 0.5;
        grain = fbm(swirlX * 1.35, swirlY * 1.35, 101);
        flare = fbm(swirlX * 3.2 + phase, swirlY * 2.4 - phase, 211);

        edge = clamp((dist - 0.72) / 0.28, 0, 1);
        heat = clamp(0.52 + grain * 0.36 + band * 0.18 + flare * 0.20, 0, 1);
        intensity = clamp(0.36 + heat * 0.54 - edge * 0.24 + options.plasmaStrength * 0.08, 0, 1);

        color = plasmaColor(intensity, heat, edge);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = color[3];
      }
    }

    ctx.putImageData(image, 0, 0);

    var limb = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.34, radius * 0.10, cx, cy, radius);
    limb.addColorStop(0, "rgba(255,255,210,0.18)");
    limb.addColorStop(0.48, "rgba(255,255,210,0.04)");
    limb.addColorStop(0.82, "rgba(90,12,6,0.10)");
    limb.addColorStop(1, "rgba(70,8,4,0.34)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = limb;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255, 224, 145, 0.32)";
    ctx.lineWidth = Math.max(1, size * 0.004);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawCorona(ctx, cx, cy, radius, options);
  }

  function draw(options) {
    options = Object.assign({}, state.options, options || {});

    if (!state.canvas || !state.ctx) {
      state.lastReceipt = {
        ok: false,
        reason: "NO_CANVAS",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastReceipt;
    }

    var canvas = state.canvas;
    var ctx = state.ctx;
    var size = Math.min(canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCorona(ctx, canvas.width / 2, canvas.height / 2, size * 0.31, options);
    drawDisc(ctx, size, options);

    state.renderCount += 1;
    state.lastReceipt = {
      ok: true,
      version: VERSION,
      role: ROLE,
      sun: true,
      plasma: true,
      controlledCorona: true,
      mobileSafeMotion: true,
      earthRendererInheritance: false,
      moonQueued: true,
      planetOneReservedForFutureNineSummitsUniverse: true,
      running: state.running,
      phase: state.phase,
      renderCount: state.renderCount,
      visualPassClaimed: false,
      renderedAt: new Date().toISOString()
    };

    return state.lastReceipt;
  }

  function frame(timestamp) {
    var minInterval = 1000 / clamp(state.options.fps || 24, 6, 30);
    var delta;

    if (!state.running) return;

    if (!state.lastTime) state.lastTime = timestamp;
    delta = Math.min(90, timestamp - state.lastTime);

    if (delta >= minInterval) {
      state.phase += state.speed * (delta / 1000);
      state.lastTime = timestamp;
      draw();
    }

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
    state.phase = 0;
    draw();
    return getStatus();
  }

  function slow() {
    state.speed = 0.12;
    return getStatus();
  }

  function normal() {
    state.speed = 0.34;
    return getStatus();
  }

  function fast() {
    state.speed = 0.72;
    return getStatus();
  }

  function setSpeed(value) {
    var n = Number(value);
    if (n > 1) n = n / 100;
    state.speed = clamp(n, 0, 1) * 1.2;
    return getStatus();
  }

  function mount(target, options) {
    options = Object.assign({}, state.options, options || {});
    state.options = options;

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

    draw(options);

    if (options.autoStart !== false) {
      start();
    }

    return {
      ok: true,
      mounted: true,
      version: VERSION,
      sun: true,
      plasma: true,
      controlledCorona: true,
      visualPassClaimed: false
    };
  }

  function render(target, options) {
    if (target && target.getContext) {
      state.canvas = target;
      state.ctx = target.getContext("2d", { willReadFrequently: true });
      state.options = Object.assign({}, state.options, options || {});
      return draw(state.options);
    }

    return mount(target, options);
  }

  function destroy() {
    pause();

    if (state.canvas && state.canvas.parentNode) {
      state.canvas.parentNode.removeChild(state.canvas);
    }

    state.canvas = null;
    state.ctx = null;
    state.mount = null;
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
      active: true,
      VERSION: VERSION,
      version: VERSION,
      role: ROLE,
      ready: state.ready,
      mounted: state.mounted,
      running: state.running,
      phase: state.phase,
      speed: state.speed,
      renderCount: state.renderCount,
      sun: true,
      plasma: true,
      controlledCorona: true,
      mobileSafeMotion: true,
      earthG1Complete: true,
      earthRendererInheritance: false,
      moonQueued: true,
      planetOneReservedForFutureNineSummitsUniverse: true,
      generatedImageDependency: false,
      graphicBox: false,
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
    global.dispatchEvent(new CustomEvent("dgb:sun:terms-renewal-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);
