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

    return {
      ctx: ctx,
      dpr: dpr,
      pixelWidth: canvas.width,
      pixelHeight: canvas.height,
      cssSize: size
    };
  }

  function buildActiveRegions(seed) {
    var rng = createRng(seed ^ 0xA53A9);
    var regions = [];

    for (var i = 0; i < 26; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * 0.72;

      regions.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.035 + rng() * 0.105,
        heat: rng() > 0.45 ? 1 : -1,
        strength: 0.16 + rng() * 0.34,
        stretch: 0.65 + rng() * 1.55,
        angle: rng() * Math.PI
      });
    }

    return regions;
  }

  function sampleRegionInfluence(nx, ny, regions) {
    var hot = 0;
    var dark = 0;

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

      if (region.heat > 0) {
        hot += influence * region.strength;
      } else {
        dark += influence * region.strength;
      }
    }

    return {
      hot: clamp(hot, 0, 1),
      dark: clamp(dark, 0, 1)
    };
  }

  function colorRamp(t, hot, dark, limb) {
    var r;
    var g;
    var b;

    if (t < 0.30) {
      var a = t / 0.30;
      r = lerp(118, 214, a);
      g = lerp(22, 64, a);
      b = lerp(5, 10, a);
    } else if (t < 0.62) {
      var b1 = (t - 0.30) / 0.32;
      r = lerp(214, 255, b1);
      g = lerp(64, 137, b1);
      b = lerp(10, 25, b1);
    } else if (t < 0.86) {
      var c = (t - 0.62) / 0.24;
      r = lerp(255, 255, c);
      g = lerp(137, 213, c);
      b = lerp(25, 74, c);
    } else {
      var d = (t - 0.86) / 0.14;
      r = lerp(255, 255, d);
      g = lerp(213, 253, d);
      b = lerp(74, 202, d);
    }

    r += hot * 44 - dark * 62;
    g += hot * 38 - dark * 54;
    b += hot * 18 - dark * 26;

    r += limb * 28;
    g += limb * 18;
    b += limb * 4;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function renderSolarDisc(ctx, size, seed, time, intensity) {
    var image = ctx.createImageData(size, size);
    var data = image.data;
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.345;
    var regions = buildActiveRegions(seed);

    var rotation = time * 0.018;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);

    for (var y = 0; y < size; y += 1) {
      for (var x = 0; x < size; x += 1) {
        var dx = (x + 0.5 - cx) / radius;
        var dy = (y + 0.5 - cy) / radius;
        var d = Math.sqrt(dx * dx + dy * dy);
        var index = (y * size + x) * 4;

        if (d > 1.035) {
          data[index + 3] = 0;
          continue;
        }

        var nx = dx * cr - dy * sr;
        var ny = dx * sr + dy * cr;

        var limb = smoothstep(0.72, 1.0, d);
        var edgeFade = 1 - smoothstep(0.985, 1.035, d);

        var broad = fbm(nx * 2.2 + time * 0.010, ny * 2.2 - time * 0.006, seed, 5);
        var cells = fbm(nx * 8.4 - time * 0.018, ny * 8.4 + time * 0.014, seed + 71, 4);
        var granules = fbm(nx * 22.0 + time * 0.028, ny * 22.0 - time * 0.022, seed + 137, 3);
        var filament = fbm(nx * 5.2 + Math.sin(ny * 5.0) * 0.32, ny * 12.0, seed + 211, 4);

        var regionsSample = sampleRegionInfluence(nx, ny, regions);

        var turbulence =
          broad * 0.36 +
          cells * 0.30 +
          granules * 0.22 +
          filament * 0.12;

        var radialHeat =
          0.86 -
          d * 0.16 +
          (1 - limb) * 0.10 +
          limb * 0.02;

        var value =
          radialHeat +
          (turbulence - 0.5) * 0.52 +
          regionsSample.hot * 0.22 -
          regionsSample.dark * 0.34;

        var limbGlow = smoothstep(0.84, 1.0, d) * 0.28 * intensity;
        value += limbGlow;

        var color = colorRamp(clamp(value, 0, 1), regionsSample.hot, regionsSample.dark, limbGlow);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * edgeFade);
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function drawSoftCorona(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xC0A12A);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    var halo = ctx.createRadialGradient(cx, cy, radius * 0.70, cx, cy, radius * 2.05);
    halo.addColorStop(0.00, "rgba(255, 224, 136, " + (0.18 * intensity).toFixed(3) + ")");
    halo.addColorStop(0.22, "rgba(255, 139, 44, " + (0.105 * intensity).toFixed(3) + ")");
    halo.addColorStop(0.58, "rgba(255, 98, 32, " + (0.045 * intensity).toFixed(3) + ")");
    halo.addColorStop(1.00, "rgba(255, 98, 32, 0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.05, 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < 84; i += 1) {
      var angle = (Math.PI * 2 * i) / 84 + rng() * 0.18 + time * 0.012;
      var width = radius * (0.022 + rng() * 0.05);
      var length = radius * (0.20 + rng() * 0.72) * intensity;
      var offset = radius * (0.98 + rng() * 0.08);

      var x = cx + Math.cos(angle) * offset;
      var y = cy + Math.sin(angle) * offset;

      var gradient = ctx.createRadialGradient(x, y, 0, x, y, width + length);
      gradient.addColorStop(0, "rgba(255, 222, 142, 0.065)");
      gradient.addColorStop(0.36, "rgba(255, 126, 38, 0.035)");
      gradient.addColorStop(1, "rgba(255, 126, 38, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(angle) * length * 0.18,
        y + Math.sin(angle) * length * 0.18,
        width + length * 0.44,
        width,
        angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  function drawProminenceFlares(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xF1A43);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (var i = 0; i < 16; i += 1) {
      var angle = rng() * Math.PI * 2 + Math.sin(time * 0.18 + i) * 0.025;
      var arcSize = 0.05 + rng() * 0.15;
      var start = angle - arcSize;
      var end = angle + arcSize;
      var flareRadius = radius * (1.005 + rng() * 0.035);
      var alpha = (0.035 + rng() * 0.065) * intensity;

      ctx.strokeStyle = "rgba(255, 218, 132, " + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.010 + rng() * 0.016);
      ctx.beginPath();
      ctx.arc(cx, cy, flareRadius, start, end);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSurfaceHeatVeil(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0x51EED);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (var i = 0; i < 34; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * radius * 0.86;
      var x = cx + Math.cos(angle + time * 0.01) * distance;
      var y = cy + Math.sin(angle - time * 0.008) * distance;
      var size = radius * (0.045 + rng() * 0.18);
      var alpha = (0.025 + rng() * 0.055) * intensity;

      var gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, "rgba(255, 255, 218, " + alpha.toFixed(3) + ")");
      gradient.addColorStop(0.48, "rgba(255, 205, 89, " + (alpha * 0.50).toFixed(3) + ")");
      gradient.addColorStop(1, "rgba(255, 205, 89, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(620, Math.max(300, canvas.clientWidth || 460));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.86 : config.intensity, 0, 1);

    var info = resizeCanvas(canvas, cssSize);
    var ctx = info.ctx;
    var size = Math.floor(cssSize);

    ctx.clearRect(0, 0, cssSize, cssSize);

    var cx = cssSize / 2;
    var cy = cssSize / 2;
    var radius = cssSize * 0.345;

    drawSoftCorona(ctx, cx, cy, radius, seed, time, intensity);
    drawProminenceFlares(ctx, cx, cy, radius, seed, time, intensity);

    ctx.save();
    ctx.translate(cx - size / 2, cy - size / 2);
    renderSolarDisc(ctx, size, seed, time, intensity);
    ctx.restore();

    drawSurfaceHeatVeil(ctx, cx, cy, radius, seed, time, intensity);

    return {
      ok: true,
      mode: "canvas",
      profile: "satellite-style-turbulent-sun",
      size: cssSize,
      seed: seed,
      decorativeRays: false,
      illustrativeSwirls: false,
      externalImageDependency: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign(
      {
        seed: 4217,
        size: 460,
        animate: true,
        intensity: 0.86,
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
          profile: "satellite-style-turbulent-sun"
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
