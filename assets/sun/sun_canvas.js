/* TNT RENEWAL — /assets/sun/sun_canvas.js
   DGB SUN CANVAS · SATELLITE OBSERVATIONAL SOLAR DISC B7
   PURPOSE:
     - Render a satellite-style solar disc.
     - No image generation.
     - No external image dependency.
     - No decorative symbol wheel.
     - No graphic box.
     - Canvas-only observational surface.
*/

(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";
  var PROFILE = "satellite-observational-solar-disc-b7";

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function hash2(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = x - ix;
    var fy = y - iy;

    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);

    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    var value = 0;
    var amplitude = 0.52;
    var frequency = 1;
    var total = 0;

    for (var i = 0; i < octaves; i += 1) {
      value += valueNoise(x * frequency, y * frequency, seed + i * 23.19) * amplitude;
      total += amplitude;
      amplitude *= 0.52;
      frequency *= 2.06;
    }

    return total ? value / total : 0;
  }

  function createCanvas(size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  function resizeCanvas(canvas, cssSize) {
    var dpr = clamp(window.devicePixelRatio || 1, 1, 1.75);
    var px = Math.floor(cssSize * dpr);

    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    var ctx = canvas.getContext("2d", { alpha: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { ctx: ctx, dpr: dpr, px: px };
  }

  function satelliteColor(value, limb, activity, spot) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (value < 0.28) {
      var a = value / 0.28;
      r = lerp(118, 210, a);
      g = lerp(28, 62, a);
      b = lerp(8, 14, a);
    } else if (value < 0.62) {
      var m = (value - 0.28) / 0.34;
      r = lerp(210, 246, m);
      g = lerp(62, 128, m);
      b = lerp(14, 34, m);
    } else if (value < 0.86) {
      var n = (value - 0.62) / 0.24;
      r = lerp(246, 255, n);
      g = lerp(128, 213, n);
      b = lerp(34, 88, n);
    } else {
      var p = (value - 0.86) / 0.14;
      r = lerp(255, 255, p);
      g = lerp(213, 250, p);
      b = lerp(88, 190, p);
    }

    r += activity * 42 - limb * 58 - spot * 92;
    g += activity * 28 - limb * 70 - spot * 72;
    b += activity * 10 - limb * 44 - spot * 38;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function activeRegion(nx, ny, cx, cy, sx, sy, strength) {
    var dx = nx - cx;
    var dy = ny - cy;
    return Math.exp(-((dx * dx) / sx + (dy * dy) / sy)) * strength;
  }

  function buildSolarDisc(pixelSize, seed, time, intensity) {
    var disc = createCanvas(pixelSize);
    var ctx = disc.getContext("2d", { alpha: true });
    var image = ctx.createImageData(pixelSize, pixelSize);
    var data = image.data;

    var cx = pixelSize * 0.5;
    var cy = pixelSize * 0.5;
    var radius = pixelSize * 0.43;
    var rotation = time * 0.008;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);

    for (var y = 0; y < pixelSize; y += 1) {
      for (var x = 0; x < pixelSize; x += 1) {
        var dx = (x + 0.5 - cx) / radius;
        var dy = (y + 0.5 - cy) / radius;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var index = (y * pixelSize + x) * 4;

        if (dist > 1.018) {
          data[index + 3] = 0;
          continue;
        }

        var nx = dx * cr - dy * sr;
        var ny = dx * sr + dy * cr;

        var alpha = 1 - smoothstep(1.0, 1.018, dist);
        var limb = smoothstep(0.70, 1.0, dist);
        var limbDarkening = 1 - limb * 0.44;

        var broad = fbm(nx * 2.8 + time * 0.002, ny * 2.8 - time * 0.001, seed, 5);
        var cells = fbm(nx * 13.5 - time * 0.003, ny * 13.5 + time * 0.003, seed + 71, 5);
        var granules = fbm(nx * 44.0 + time * 0.004, ny * 44.0 - time * 0.004, seed + 151, 4);
        var micro = fbm(nx * 92.0 - time * 0.005, ny * 92.0 + time * 0.005, seed + 233, 2);

        var activity =
          activeRegion(nx, ny, -0.30, 0.16, 0.018, 0.010, 0.24) +
          activeRegion(nx, ny, 0.24, -0.11, 0.014, 0.008, 0.22) +
          activeRegion(nx, ny, 0.05, 0.32, 0.026, 0.012, 0.14);

        var spot =
          activeRegion(nx, ny, 0.30, 0.03, 0.0042, 0.0032, 0.58) +
          activeRegion(nx, ny, -0.17, 0.24, 0.0036, 0.0030, 0.42);

        var texture = broad * 0.20 + cells * 0.34 + granules * 0.34 + micro * 0.12;
        var value = 0.68 + (texture - 0.5) * 0.70 + activity * 0.28 - spot * 0.36;

        value *= limbDarkening;
        value = clamp(value * intensity, 0.08, 1);

        var color = satelliteColor(value, limb, activity, spot);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * alpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    return disc;
  }

  function drawCorona(ctx, cx, cy, radius, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    var glow = ctx.createRadialGradient(cx, cy, radius * 0.90, cx, cy, radius * 1.42);
    glow.addColorStop(0.00, "rgba(255,235,170," + (0.18 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.32, "rgba(255,151,50," + (0.09 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.78, "rgba(255,181,70," + (0.032 * intensity).toFixed(3) + ")");
    glow.addColorStop(1.00, "rgba(255,181,70,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.42, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawObservationBloom(ctx, cx, cy, radius, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    var bloom = ctx.createRadialGradient(cx - radius * 0.16, cy - radius * 0.14, 0, cx, cy, radius);
    bloom.addColorStop(0, "rgba(255,255,226," + (0.18 * intensity).toFixed(3) + ")");
    bloom.addColorStop(0.25, "rgba(255,232,128," + (0.10 * intensity).toFixed(3) + ")");
    bloom.addColorStop(0.70, "rgba(255,182,74,0.025)");
    bloom.addColorStop(1, "rgba(255,182,74,0)");

    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(760, Math.max(320, canvas.clientWidth || 520));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.98 : config.intensity, 0.4, 1.2);

    var prepared = resizeCanvas(canvas, cssSize);
    var ctx = prepared.ctx;

    ctx.clearRect(0, 0, cssSize, cssSize);

    var cx = cssSize * 0.5;
    var cy = cssSize * 0.5;
    var radius = cssSize * 0.43;
    var pixelSize = Math.max(420, Math.floor(cssSize * Math.min(prepared.dpr, 1.28)));

    var disc = buildSolarDisc(pixelSize, seed, time, intensity);

    drawCorona(ctx, cx, cy, radius, intensity);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(disc, 0, 0, cssSize, cssSize);
    ctx.restore();

    drawObservationBloom(ctx, cx, cy, radius, intensity);

    return {
      ok: true,
      mode: "canvas",
      profile: PROFILE,
      size: cssSize,
      seed: seed,
      visualTarget: "satellite observational solar disc",
      externalImageDependency: false,
      graphicGenerationUsed: false,
      decorativeRays: false,
      illustrativeSwirls: false,
      darkLimb: true,
      granulation: true,
      activeRegions: true,
      sunspots: true
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign({
      seed: 4217,
      size: 520,
      animate: false,
      intensity: 0.98,
      frameRate: 8
    }, options || {});

    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function draw() {
      if (!active) return;

      return render(canvas, {
        seed: config.seed,
        size: config.size,
        intensity: config.intensity,
        time: (Date.now() - start) / 1000
      });
    }

    function tick(timestamp) {
      if (!active) return;

      var minFrameGap = 1000 / clamp(config.frameRate || 8, 4, 12);

      if (!lastDraw || timestamp - lastDraw >= minFrameGap) {
        lastDraw = timestamp;
        draw();
      }

      if (config.animate) frame = window.requestAnimationFrame(tick);
    }

    draw();

    if (config.animate) {
      frame = window.requestAnimationFrame(tick);
    }

    return {
      update: function (next) {
        config = Object.assign(config, next || {});
        return draw();
      },
      destroy: function () {
        active = false;
        if (frame) window.cancelAnimationFrame(frame);
      },
      getState: function () {
        return {
          active: active,
          seed: config.seed,
          size: config.size,
          animate: config.animate,
          intensity: config.intensity,
          frameRate: config.frameRate,
          profile: PROFILE,
          visualTarget: "satellite observational solar disc"
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    profile: PROFILE,
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
