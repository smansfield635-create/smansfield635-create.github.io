/* TNT RENEWAL — /assets/sun/sun_canvas.js
   SUN ASSET SPINE · CANVAS B7 · DIMENSIONAL STELLAR PLASMA

   CONTRACT:
     - Render the Sun as a stellar body, not an orange planet.
     - Plasma texture, granulation, heat variation, limb radiance, controlled corona.
     - No hard circular outline.
     - No fake ring.
     - No decorative rays.
     - No image generation.
     - No external image dependency.
     - Preserve API: window.DGBSunCanvas.render and createCanvasSun.
*/

(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";
  var PROFILE = "stellar-plasma-b7";
  var TAU = Math.PI * 2;

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function createRng(seed) {
    var value = seed >>> 0;

    return function () {
      value += 0x6D2B79F5;
      var t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
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
    var amplitude = 0.5;
    var frequency = 1;
    var total = 0;
    var i;

    for (i = 0; i < octaves; i += 1) {
      value += valueNoise(x * frequency, y * frequency, seed + i * 19.17) * amplitude;
      total += amplitude;
      amplitude *= 0.52;
      frequency *= 2.03;
    }

    return total ? value / total : 0;
  }

  function resizeCanvas(canvas, cssSize) {
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.25 : 1.6));
    var pixelSize = Math.max(1, Math.floor(cssSize * dpr));
    var ctx;

    canvas.width = pixelSize;
    canvas.height = pixelSize;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    ctx = canvas.getContext("2d", { alpha: true });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    return {
      ctx: ctx,
      pixelSize: pixelSize,
      cssSize: cssSize,
      dpr: dpr
    };
  }

  function makeCanvas(size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  function solarColor(value, limb, hot, cool, intensity) {
    var r;
    var g;
    var b;
    var t;

    value = clamp(value, 0, 1);

    if (value < 0.24) {
      t = value / 0.24;
      r = lerp(168, 225, t);
      g = lerp(38, 72, t);
      b = lerp(7, 13, t);
    } else if (value < 0.55) {
      t = (value - 0.24) / 0.31;
      r = lerp(225, 255, t);
      g = lerp(72, 155, t);
      b = lerp(13, 32, t);
    } else if (value < 0.82) {
      t = (value - 0.55) / 0.27;
      r = lerp(255, 255, t);
      g = lerp(155, 224, t);
      b = lerp(32, 92, t);
    } else {
      t = (value - 0.82) / 0.18;
      r = lerp(255, 255, t);
      g = lerp(224, 255, t);
      b = lerp(92, 218, t);
    }

    r += hot * 42 * intensity - cool * 18;
    g += hot * 34 * intensity - cool * 14;
    b += hot * 12 * intensity - cool * 8;

    r += limb * 16;
    g += limb * 10;
    b -= limb * 8;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function buildActiveRegions(seed) {
    var rng = createRng(seed ^ 0x51A7E);
    var regions = [];
    var i;
    var angle;
    var distance;

    for (i = 0; i < 54; i += 1) {
      angle = rng() * TAU;
      distance = Math.sqrt(rng()) * 0.92;

      regions.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.026 + rng() * 0.10,
        strength: 0.05 + rng() * 0.24,
        hot: rng() > 0.38,
        stretch: 0.70 + rng() * 1.55,
        angle: rng() * Math.PI
      });
    }

    return regions;
  }

  function sampleRegions(nx, ny, regions) {
    var hot = 0;
    var cool = 0;
    var i;
    var region;
    var ca;
    var sa;
    var dx;
    var dy;
    var rx;
    var ry;
    var q;
    var influence;

    for (i = 0; i < regions.length; i += 1) {
      region = regions[i];
      ca = Math.cos(region.angle);
      sa = Math.sin(region.angle);

      dx = nx - region.x;
      dy = ny - region.y;
      rx = dx * ca + dy * sa;
      ry = -dx * sa + dy * ca;

      q = Math.sqrt((rx * rx) / region.stretch + (ry * ry) * region.stretch);
      influence = Math.exp(-(q * q) / (region.radius * region.radius));

      if (region.hot) {
        hot += influence * region.strength;
      } else {
        cool += influence * region.strength * 0.50;
      }
    }

    return {
      hot: clamp(hot, 0, 1),
      cool: clamp(cool, 0, 0.60)
    };
  }

  function buildSolarBody(pixelSize, seed, time, intensity) {
    var disc = makeCanvas(pixelSize);
    var ctx = disc.getContext("2d", { alpha: true });
    var image = ctx.createImageData(pixelSize, pixelSize);
    var data = image.data;
    var cx = pixelSize / 2;
    var cy = pixelSize / 2;
    var radius = pixelSize * 0.352;
    var regions = buildActiveRegions(seed);
    var rotation = time * 0.010;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);
    var x;
    var y;
    var dx;
    var dy;
    var d;
    var index;
    var nx;
    var ny;
    var nz;
    var gx;
    var gy;
    var gz;
    var alpha;
    var limb;
    var broad;
    var cells;
    var granules;
    var micro;
    var streaks;
    var region;
    var value;
    var centerHeat;
    var color;

    for (y = 0; y < pixelSize; y += 1) {
      for (x = 0; x < pixelSize; x += 1) {
        dx = (x + 0.5 - cx) / radius;
        dy = (y + 0.5 - cy) / radius;
        d = Math.sqrt(dx * dx + dy * dy);
        index = (y * pixelSize + x) * 4;

        if (d > 1.035) {
          data[index + 3] = 0;
          continue;
        }

        alpha = 1 - smoothstep(1.000, 1.035, d);
        nz = Math.sqrt(Math.max(0, 1 - Math.min(1, d * d)));

        nx = dx;
        ny = dy;

        gx = nx * cr - nz * sr;
        gy = ny;
        gz = nx * sr + nz * cr;

        limb = smoothstep(0.72, 1.00, d);
        centerHeat = 1 - smoothstep(0.08, 0.98, d);

        broad = fbm(gx * 2.3 + time * 0.006, gy * 2.3 - time * 0.004, seed, 5);
        cells = fbm(gx * 9.5 - time * 0.010, gy * 9.5 + time * 0.009, seed + 71, 4);
        granules = fbm(gx * 31.0 + time * 0.018, gy * 31.0 - time * 0.014, seed + 151, 3);
        micro = fbm(gx * 72.0 - time * 0.025, gy * 72.0 + time * 0.021, seed + 233, 2);
        streaks = fbm((gx + gz * 0.16) * 16.0 + time * 0.012, gy * 5.4 - time * 0.007, seed + 421, 3);

        region = sampleRegions(gx, gy, regions);

        value =
          0.58 +
          broad * 0.22 +
          cells * 0.24 +
          granules * 0.22 +
          micro * 0.10 +
          streaks * 0.08 +
          region.hot * 0.20 -
          region.cool * 0.13 +
          centerHeat * 0.10 -
          limb * 0.16;

        value = clamp(value * (0.94 + intensity * 0.12), 0.16, 1);

        color = solarColor(value, limb, region.hot, region.cool, intensity);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * alpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    return disc;
  }

  function drawCorona(ctx, side, seed, time, intensity) {
    var cx = side / 2;
    var cy = side / 2;
    var radius = side * 0.352;
    var glow;
    var halo;
    var rng = createRng(seed ^ 0xC0A1);
    var i;
    var angle;
    var length;
    var spread;
    var alpha;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    glow = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.74);
    glow.addColorStop(0.00, "rgba(255,255,226," + (0.18 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.18, "rgba(255,220,116," + (0.16 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.44, "rgba(255,135,34," + (0.072 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.78, "rgba(255,86,20," + (0.025 * intensity).toFixed(3) + ")");
    glow.addColorStop(1.00, "rgba(255,86,20,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.76, 0, TAU);
    ctx.fill();

    halo = ctx.createRadialGradient(cx, cy, radius * 0.96, cx, cy, radius * 1.08);
    halo.addColorStop(0.00, "rgba(255,255,230,0)");
    halo.addColorStop(0.45, "rgba(255,238,170," + (0.095 * intensity).toFixed(3) + ")");
    halo.addColorStop(1.00, "rgba(255,184,74,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.10, 0, TAU);
    ctx.fill();

    for (i = 0; i < 34; i += 1) {
      angle = rng() * TAU + Math.sin(time * 0.18 + i) * 0.018;
      length = radius * (1.05 + rng() * 0.42);
      spread = 0.018 + rng() * 0.060;
      alpha = (0.014 + rng() * 0.036) * intensity;

      ctx.strokeStyle = "rgba(255,205,104," + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.006 + rng() * 0.014);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, length, angle - spread, angle + spread);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawProminences(ctx, side, seed, time, intensity) {
    var cx = side / 2;
    var cy = side / 2;
    var radius = side * 0.352;
    var rng = createRng(seed ^ 0xE11B);
    var i;
    var angle;
    var arc;
    var alpha;
    var lift;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (i = 0; i < 28; i += 1) {
      angle = rng() * TAU + Math.sin(time * 0.12 + i) * 0.018;
      arc = 0.010 + rng() * 0.040;
      lift = 1.002 + rng() * 0.035;
      alpha = (0.030 + rng() * 0.070) * intensity;

      ctx.strokeStyle = "rgba(255,242,184," + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.003 + rng() * 0.008);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * lift, angle - arc, angle + arc);
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(700, Math.max(330, canvas.clientWidth || 500));
    var seed = Math.floor(config.seed || 4217);
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.96 : config.intensity, 0.55, 1);
    var prepared = resizeCanvas(canvas, cssSize);
    var ctx = prepared.ctx;
    var side = prepared.pixelSize;
    var bodySize = Math.max(380, Math.min(window.innerWidth <= 760 ? 460 : 560, side));
    var body;
    var cx = side / 2;
    var cy = side / 2;

    ctx.clearRect(0, 0, side, side);

    drawCorona(ctx, side, seed, time, intensity);

    body = buildSolarBody(bodySize, seed, time, intensity);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(body, cx - side / 2, cy - side / 2, side, side);
    ctx.restore();

    drawProminences(ctx, side, seed, time, intensity);

    canvas.setAttribute("data-sun-renderer-version", "sun-canvas-b7-stellar-plasma");
    canvas.setAttribute("data-sun-profile", PROFILE);
    canvas.setAttribute("data-sun-intensity", intensity.toFixed(2));

    return {
      ok: true,
      mode: "canvas",
      profile: PROFILE,
      size: cssSize,
      seed: seed,
      intensity: intensity,
      visualTarget: "dimensional stellar plasma body",
      coordinateSystem: "single-canvas-procedural-plasma",
      planetRead: false,
      flatCircleRead: false,
      fakeRing: false,
      decorativeRays: false,
      externalImageDependency: false,
      graphicGenerationUsed: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign({
      seed: 4217,
      size: 500,
      animate: true,
      intensity: 0.96,
      frameRate: 10
    }, options || {});
    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function tick(timestamp) {
      var minFrameGap;

      if (!active) return;

      minFrameGap = 1000 / clamp(config.frameRate || 10, 6, 14);

      if (!lastDraw || timestamp - lastDraw >= minFrameGap) {
        lastDraw = timestamp;
        render(canvas, {
          seed: config.seed,
          size: config.size,
          intensity: config.intensity,
          time: (Date.now() - start) / 1000
        });
      }

      if (config.animate) frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return {
      update: function (next) {
        config = Object.assign(config, next || {});

        if (config.animate && !frame) {
          frame = window.requestAnimationFrame(tick);
        }

        render(canvas, {
          seed: config.seed,
          size: config.size,
          intensity: config.intensity,
          time: (Date.now() - start) / 1000
        });
      },

      destroy: function () {
        active = false;
        if (frame) window.cancelAnimationFrame(frame);
        frame = null;
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
          visualTarget: "dimensional stellar plasma body",
          coordinateSystem: "single-canvas-procedural-plasma"
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    version: "sun-canvas-b7-stellar-plasma",
    profile: PROFILE,
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
