(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";
  var PROFILE = "satellite-solar-disc-b6";

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

  function resizeCanvas(canvas, cssSize) {
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    var ctx = canvas.getContext("2d", { alpha: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return {
      ctx: ctx,
      dpr: dpr
    };
  }

  function makeCanvas(size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  function satelliteColor(value, edge, active) {
    var r;
    var g;
    var b;

    if (value < 0.20) {
      var a = value / 0.20;
      r = lerp(205, 242, a);
      g = lerp(58, 92, a);
      b = lerp(10, 18, a);
    } else if (value < 0.52) {
      var m = (value - 0.20) / 0.32;
      r = lerp(242, 255, m);
      g = lerp(92, 174, m);
      b = lerp(18, 42, m);
    } else if (value < 0.82) {
      var n = (value - 0.52) / 0.30;
      r = lerp(255, 255, n);
      g = lerp(174, 235, n);
      b = lerp(42, 112, n);
    } else {
      var p = (value - 0.82) / 0.18;
      r = lerp(255, 255, p);
      g = lerp(235, 255, p);
      b = lerp(112, 226, p);
    }

    r += edge * 34 + active * 28;
    g += edge * 30 + active * 20;
    b += edge * 10 + active * 6;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function buildActiveRegions(seed) {
    var rng = createRng(seed ^ 0x51A7E);
    var regions = [];

    for (var i = 0; i < 42; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * 0.90;

      regions.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.030 + rng() * 0.105,
        strength: 0.05 + rng() * 0.22,
        hot: rng() > 0.35,
        stretch: 0.70 + rng() * 1.40,
        angle: rng() * Math.PI
      });
    }

    return regions;
  }

  function sampleRegions(nx, ny, regions) {
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

      if (region.hot) hot += influence * region.strength;
      else cool += influence * region.strength * 0.45;
    }

    return {
      hot: clamp(hot, 0, 1),
      cool: clamp(cool, 0, 0.55)
    };
  }

  function buildSolarDisc(pixelSize, seed, time, intensity) {
    var disc = makeCanvas(pixelSize);
    var ctx = disc.getContext("2d", { alpha: true });
    var image = ctx.createImageData(pixelSize, pixelSize);
    var data = image.data;
    var cx = pixelSize / 2;
    var cy = pixelSize / 2;
    var radius = pixelSize * 0.365;
    var regions = buildActiveRegions(seed);

    var rotation = time * 0.004;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);

    for (var y = 0; y < pixelSize; y += 1) {
      for (var x = 0; x < pixelSize; x += 1) {
        var dx = (x + 0.5 - cx) / radius;
        var dy = (y + 0.5 - cy) / radius;
        var d = Math.sqrt(dx * dx + dy * dy);
        var index = (y * pixelSize + x) * 4;

        if (d > 1.028) {
          data[index + 3] = 0;
          continue;
        }

        var nx = dx * cr - dy * sr;
        var ny = dx * sr + dy * cr;

        var alpha = 1 - smoothstep(1.002, 1.028, d);
        var edge = smoothstep(0.84, 1.0, d) * intensity;

        var broad = fbm(nx * 2.6 + time * 0.003, ny * 2.6 - time * 0.002, seed, 5);
        var cells = fbm(nx * 10.5 - time * 0.004, ny * 10.5 + time * 0.004, seed + 71, 4);
        var granules = fbm(nx * 35.0 + time * 0.006, ny * 35.0 - time * 0.005, seed + 151, 3);
        var micro = fbm(nx * 78.0 - time * 0.007, ny * 78.0 + time * 0.006, seed + 233, 2);

        var region = sampleRegions(nx, ny, regions);

        var texture =
          broad * 0.26 +
          cells * 0.32 +
          granules * 0.30 +
          micro * 0.12;

        var value =
          0.76 +
          (texture - 0.5) * 0.64 +
          region.hot * 0.22 -
          region.cool * 0.10 +
          edge * 0.18;

        value = clamp(value, 0.22, 1);

        var color = satelliteColor(value, edge, region.hot);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * alpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    return disc;
  }

  function drawSatelliteGlow(ctx, cx, cy, radius, time, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    var glow = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.65);
    glow.addColorStop(0.00, "rgba(255, 255, 230, " + (0.18 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.16, "rgba(255, 226, 125, " + (0.18 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.42, "rgba(255, 148, 38, " + (0.070 * intensity).toFixed(3) + ")");
    glow.addColorStop(1.00, "rgba(255, 128, 26, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawFineLimbFire(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xE11B);
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (var i = 0; i < 52; i += 1) {
      var angle = rng() * Math.PI * 2 + Math.sin(time * 0.08 + i) * 0.014;
      var arc = 0.012 + rng() * 0.045;
      var alpha = (0.040 + rng() * 0.075) * intensity;

      ctx.strokeStyle = "rgba(255, 248, 188, " + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.0035 + rng() * 0.008);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * (0.994 + rng() * 0.012), angle - arc, angle + arc);
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(700, Math.max(330, canvas.clientWidth || 500));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.98 : config.intensity, 0, 1);

    var prepared = resizeCanvas(canvas, cssSize);
    var ctx = prepared.ctx;
    var dpr = Math.max(1, Math.min(prepared.dpr, 1.35));

    ctx.clearRect(0, 0, cssSize, cssSize);

    var cx = cssSize / 2;
    var cy = cssSize / 2;
    var radius = cssSize * 0.365;
    var pixelSize = Math.max(420, Math.floor(cssSize * dpr));
    var disc = buildSolarDisc(pixelSize, seed, time, intensity);

    drawSatelliteGlow(ctx, cx, cy, radius, time, intensity);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(disc, 0, 0, cssSize, cssSize);
    ctx.restore();

    drawFineLimbFire(ctx, cx, cy, radius, seed, time, intensity);

    return {
      ok: true,
      mode: "canvas",
      profile: PROFILE,
      size: cssSize,
      seed: seed,
      visualTarget: "satellite-style solar disc",
      coordinateSystem: "offscreen-centered-drawImage",
      planetRead: false,
      eclipseRead: false,
      darkLimb: false,
      decorativeRays: false,
      illustrativeSwirls: false,
      externalImageDependency: false,
      graphicGenerationUsed: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign(
      {
        seed: 4217,
        size: 500,
        animate: true,
        intensity: 0.98,
        frameRate: 10
      },
      options || {}
    );

    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function tick(timestamp) {
      if (!active) return;

      var minFrameGap = 1000 / clamp(config.frameRate || 10, 4, 18);

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
          profile: PROFILE,
          visualTarget: "satellite-style solar disc",
          coordinateSystem: "offscreen-centered-drawImage"
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
