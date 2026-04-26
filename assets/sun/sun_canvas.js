(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";

  function clamp(value, min, max) {
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

    for (var i = 0; i < octaves; i += 1) {
      value += valueNoise(x * frequency, y * frequency, seed + i * 19.17) * amplitude;
      total += amplitude;
      amplitude *= 0.52;
      frequency *= 2.03;
    }

    return total ? value / total : 0;
  }

  function resizeCanvas(canvas, size) {
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    var ctx = canvas.getContext("2d", { alpha: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return ctx;
  }

  function buildPlasmaRegions(seed) {
    var rng = createRng(seed ^ 0xB15A2E);
    var regions = [];

    for (var i = 0; i < 38; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * 0.86;

      regions.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.028 + rng() * 0.092,
        heat: rng() > 0.33 ? 1 : -1,
        strength: 0.08 + rng() * 0.26,
        stretch: 0.72 + rng() * 1.18,
        angle: rng() * Math.PI
      });
    }

    return regions;
  }

  function samplePlasmaRegions(nx, ny, regions) {
    var hot = 0;
    var cool = 0;

    for (var i = 0; i < regions.length; i += 1) {
      var region = regions[i];
      var ca = Math.cos(region.angle);
      var sa = Math.sin(region.angle);
      var dx = nx - region.x;
      var dy = ny - region.y;
      var rx = dx * ca + dy * sa;
      var ry = -dx * sa + dy * ca;
      var q = Math.sqrt((rx * rx) / region.stretch + (ry * ry) * region.stretch);
      var influence = Math.exp(-(q * q) / (region.radius * region.radius));

      if (region.heat > 0) hot += influence * region.strength;
      else cool += influence * region.strength;
    }

    return {
      hot: clamp(hot, 0, 1),
      cool: clamp(cool, 0, 1)
    };
  }

  function solarColor(t, hot, cool, limbFire) {
    var r;
    var g;
    var b;

    if (t < 0.20) {
      var a = t / 0.20;
      r = lerp(196, 234, a);
      g = lerp(46, 76, a);
      b = lerp(8, 12, a);
    } else if (t < 0.52) {
      var m = (t - 0.20) / 0.32;
      r = lerp(234, 255, m);
      g = lerp(76, 146, m);
      b = lerp(12, 27, m);
    } else if (t < 0.80) {
      var n = (t - 0.52) / 0.28;
      r = lerp(255, 255, n);
      g = lerp(146, 220, n);
      b = lerp(27, 74, n);
    } else {
      var p = (t - 0.80) / 0.20;
      r = lerp(255, 255, p);
      g = lerp(220, 255, p);
      b = lerp(74, 224, p);
    }

    r += hot * 40 - cool * 24 + limbFire * 58;
    g += hot * 34 - cool * 18 + limbFire * 36;
    b += hot * 14 - cool * 8 + limbFire * 10;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function renderSolarPlasmaDisc(ctx, size, seed, time, intensity) {
    var image = ctx.createImageData(size, size);
    var data = image.data;
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.355;
    var regions = buildPlasmaRegions(seed);
    var rotation = time * 0.014;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);

    for (var y = 0; y < size; y += 1) {
      for (var x = 0; x < size; x += 1) {
        var dx = (x + 0.5 - cx) / radius;
        var dy = (y + 0.5 - cy) / radius;
        var d = Math.sqrt(dx * dx + dy * dy);
        var index = (y * size + x) * 4;

        if (d > 1.045) {
          data[index + 3] = 0;
          continue;
        }

        var nx = dx * cr - dy * sr;
        var ny = dx * sr + dy * cr;
        var radial = clamp(d, 0, 1.045);
        var edgeFade = 1 - smoothstep(1.005, 1.045, radial);
        var luminousEdge = smoothstep(0.82, 1.0, radial);

        var broad = fbm(nx * 2.6 + time * 0.009, ny * 2.6 - time * 0.006, seed, 5);
        var cells = fbm(nx * 9.4 - time * 0.018, ny * 9.4 + time * 0.014, seed + 71, 4);
        var granules = fbm(nx * 26.0 + time * 0.028, ny * 26.0 - time * 0.022, seed + 137, 3);
        var micro = fbm(nx * 52.0 - time * 0.031, ny * 52.0 + time * 0.024, seed + 233, 2);

        var plasma = samplePlasmaRegions(nx, ny, regions);
        var turbulence = broad * 0.28 + cells * 0.32 + granules * 0.28 + micro * 0.12;

        var value =
          0.76 +
          (turbulence - 0.5) * 0.64 +
          plasma.hot * 0.20 -
          plasma.cool * 0.13 +
          luminousEdge * 0.22 * intensity;

        value -= smoothstep(0.95, 1.03, radial) * 0.015;
        value = clamp(value, 0, 1);

        var color = solarColor(value, plasma.hot, plasma.cool, luminousEdge * intensity);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * edgeFade);
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function drawLuminousCorona(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xC0A12A);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    var outer = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 2.08);
    outer.addColorStop(0.00, "rgba(255, 247, 188, " + (0.24 * intensity).toFixed(3) + ")");
    outer.addColorStop(0.18, "rgba(255, 196, 78, " + (0.16 * intensity).toFixed(3) + ")");
    outer.addColorStop(0.48, "rgba(255, 112, 30, " + (0.070 * intensity).toFixed(3) + ")");
    outer.addColorStop(1.00, "rgba(255, 112, 30, 0)");

    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.08, 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < 78; i += 1) {
      var angle = (Math.PI * 2 * i) / 78 + rng() * 0.22 + time * 0.011;
      var base = radius * (0.96 + rng() * 0.07);
      var length = radius * (0.18 + rng() * 0.48) * intensity;
      var width = radius * (0.018 + rng() * 0.048);
      var x = cx + Math.cos(angle) * base;
      var y = cy + Math.sin(angle) * base;

      var gradient = ctx.createRadialGradient(x, y, 0, x, y, width + length);
      gradient.addColorStop(0, "rgba(255, 239, 170, 0.075)");
      gradient.addColorStop(0.42, "rgba(255, 150, 45, 0.045)");
      gradient.addColorStop(1, "rgba(255, 150, 45, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(angle) * length * 0.18,
        y + Math.sin(angle) * length * 0.18,
        width + length * 0.36,
        width,
        angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  function drawEdgeFire(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xE9F11);
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (var i = 0; i < 44; i += 1) {
      var angle = rng() * Math.PI * 2 + Math.sin(time * 0.15 + i) * 0.018;
      var arc = 0.022 + rng() * 0.070;
      var alpha = (0.055 + rng() * 0.105) * intensity;

      ctx.strokeStyle = "rgba(255, 242, 174, " + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.007 + rng() * 0.016);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * (0.994 + rng() * 0.016), angle - arc, angle + arc);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSurfaceIonization(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0x51EED);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (var i = 0; i < 52; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * radius * 0.92;
      var x = cx + Math.cos(angle + time * 0.008) * distance;
      var y = cy + Math.sin(angle - time * 0.006) * distance;
      var size = radius * (0.030 + rng() * 0.128);
      var alpha = (0.018 + rng() * 0.062) * intensity;

      var gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, "rgba(255, 255, 232, " + alpha.toFixed(3) + ")");
      gradient.addColorStop(0.42, "rgba(255, 221, 102, " + (alpha * 0.55).toFixed(3) + ")");
      gradient.addColorStop(1, "rgba(255, 221, 102, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(660, Math.max(320, canvas.clientWidth || 480));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.92 : config.intensity, 0, 1);

    var ctx = resizeCanvas(canvas, cssSize);
    ctx.clearRect(0, 0, cssSize, cssSize);

    var cx = cssSize / 2;
    var cy = cssSize / 2;
    var radius = cssSize * 0.355;

    drawLuminousCorona(ctx, cx, cy, radius, seed, time, intensity);

    ctx.save();
    ctx.translate(cx - cssSize / 2, cy - cssSize / 2);
    renderSolarPlasmaDisc(ctx, Math.floor(cssSize), seed, time, intensity);
    ctx.restore();

    drawSurfaceIonization(ctx, cx, cy, radius, seed, time, intensity);
    drawEdgeFire(ctx, cx, cy, radius, seed, time, intensity);

    return {
      ok: true,
      mode: "canvas",
      profile: "luminous-plasma-sun-no-dark-limb",
      size: cssSize,
      seed: seed,
      decorativeRays: false,
      illustrativeSwirls: false,
      darkLimb: false,
      externalImageDependency: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign(
      {
        seed: 4217,
        size: 480,
        animate: true,
        intensity: 0.92,
        frameRate: 18
      },
      options || {}
    );

    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function tick(timestamp) {
      if (!active) return;

      var minFrameGap = 1000 / clamp(config.frameRate || 18, 6, 30);

      if (!lastDraw || timestamp - lastDraw >= minFrameGap) {
        lastDraw = timestamp;
        render(canvas, {
          seed: config.seed,
          size: config.size,
          intensity: config.intensity,
          time: (Date.now() - start) / 1000
        });
      }

      if (config.animate) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    frame = window.requestAnimationFrame(tick);

    return {
      update: function (next) {
        config = Object.assign(config, next || {});
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
      },
      getState: function () {
        return {
          active: active,
          seed: config.seed,
          size: config.size,
          animate: config.animate,
          intensity: config.intensity,
          frameRate: config.frameRate,
          profile: "luminous-plasma-sun-no-dark-limb"
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
