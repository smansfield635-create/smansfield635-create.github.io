(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";
  var PROFILE = "luminous-centered-plasma-b5";

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

  function createCanvas(size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  function solarColor(value, rimFire, activeHeat) {
    var r;
    var g;
    var b;

    if (value < 0.24) {
      var a = value / 0.24;
      r = lerp(236, 255, a);
      g = lerp(82, 126, a);
      b = lerp(12, 20, a);
    } else if (value < 0.58) {
      var m = (value - 0.24) / 0.34;
      r = lerp(255, 255, m);
      g = lerp(126, 194, m);
      b = lerp(20, 48, m);
    } else if (value < 0.86) {
      var n = (value - 0.58) / 0.28;
      r = lerp(255, 255, n);
      g = lerp(194, 240, n);
      b = lerp(48, 118, n);
    } else {
      var p = (value - 0.86) / 0.14;
      r = lerp(255, 255, p);
      g = lerp(240, 255, p);
      b = lerp(118, 235, p);
    }

    r += rimFire * 44 + activeHeat * 28;
    g += rimFire * 40 + activeHeat * 22;
    b += rimFire * 18 + activeHeat * 8;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function buildActiveZones(seed) {
    var rng = createRng(seed ^ 0x9917);
    var zones = [];

    for (var i = 0; i < 48; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * 0.92;

      zones.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.026 + rng() * 0.115,
        strength: 0.04 + rng() * 0.20,
        stretch: 0.65 + rng() * 1.35,
        angle: rng() * Math.PI
      });
    }

    return zones;
  }

  function sampleActiveZones(nx, ny, zones) {
    var heat = 0;

    for (var i = 0; i < zones.length; i += 1) {
      var zone = zones[i];
      var ca = Math.cos(zone.angle);
      var sa = Math.sin(zone.angle);
      var dx = nx - zone.x;
      var dy = ny - zone.y;
      var rx = dx * ca + dy * sa;
      var ry = -dx * sa + dy * ca;
      var q = Math.sqrt((rx * rx) / zone.stretch + (ry * ry) * zone.stretch);
      var influence = Math.exp(-(q * q) / (zone.radius * zone.radius));
      heat += influence * zone.strength;
    }

    return clamp(heat, 0, 1);
  }

  function buildPlasmaDiscCanvas(pixelSize, seed, time, intensity) {
    var canvas = createCanvas(pixelSize);
    var ctx = canvas.getContext("2d", { alpha: true });
    var image = ctx.createImageData(pixelSize, pixelSize);
    var data = image.data;
    var cx = pixelSize / 2;
    var cy = pixelSize / 2;
    var radius = pixelSize * 0.338;
    var zones = buildActiveZones(seed);

    var rotation = time * 0.012;
    var cr = Math.cos(rotation);
    var sr = Math.sin(rotation);

    for (var y = 0; y < pixelSize; y += 1) {
      for (var x = 0; x < pixelSize; x += 1) {
        var dx = (x + 0.5 - cx) / radius;
        var dy = (y + 0.5 - cy) / radius;
        var d = Math.sqrt(dx * dx + dy * dy);
        var index = (y * pixelSize + x) * 4;

        if (d > 1.045) {
          data[index + 3] = 0;
          continue;
        }

        var nx = dx * cr - dy * sr;
        var ny = dx * sr + dy * cr;

        var fade = 1 - smoothstep(1.01, 1.045, d);
        var rimFire = smoothstep(0.74, 1.0, d) * intensity;
        var expansionEdge = smoothstep(0.86, 1.0, d);

        var broad = fbm(nx * 2.1 + time * 0.008, ny * 2.1 - time * 0.006, seed, 5);
        var cells = fbm(nx * 9.0 - time * 0.017, ny * 9.0 + time * 0.013, seed + 77, 4);
        var granules = fbm(nx * 31.0 + time * 0.026, ny * 31.0 - time * 0.021, seed + 151, 3);
        var ion = fbm(nx * 64.0 - time * 0.030, ny * 64.0 + time * 0.025, seed + 239, 2);

        var activeHeat = sampleActiveZones(nx, ny, zones);

        var turbulence =
          broad * 0.25 +
          cells * 0.31 +
          granules * 0.30 +
          ion * 0.14;

        var value =
          0.80 +
          (turbulence - 0.5) * 0.54 +
          activeHeat * 0.20 +
          rimFire * 0.31 +
          expansionEdge * 0.12;

        value = clamp(value, 0.18, 1);

        var color = solarColor(value, rimFire, activeHeat);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * fade);
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  function drawExpansionGlow(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xEAA771);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    var pulse = 0.5 + Math.sin(time * 1.4) * 0.5;

    var glow = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 2.28);
    glow.addColorStop(0.00, "rgba(255, 255, 238, " + (0.14 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.18, "rgba(255, 226, 122, " + (0.24 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.38, "rgba(255, 154, 43, " + (0.16 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.68, "rgba(255, 96, 24, " + (0.075 * intensity).toFixed(3) + ")");
    glow.addColorStop(1.00, "rgba(255, 96, 24, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (2.10 + pulse * 0.10), 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < 72; i += 1) {
      var angle = (Math.PI * 2 * i) / 72 + rng() * 0.25 + time * 0.011;
      var base = radius * (0.96 + rng() * 0.07);
      var length = radius * (0.16 + rng() * 0.44) * intensity;
      var width = radius * (0.012 + rng() * 0.030);

      var x = cx + Math.cos(angle) * base;
      var y = cy + Math.sin(angle) * base;

      var plume = ctx.createRadialGradient(x, y, 0, x, y, width + length);
      plume.addColorStop(0, "rgba(255, 251, 204, 0.075)");
      plume.addColorStop(0.42, "rgba(255, 180, 65, 0.050)");
      plume.addColorStop(1, "rgba(255, 120, 34, 0)");

      ctx.fillStyle = plume;
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

  function drawEdgeIgnition(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xF13E);
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (var i = 0; i < 64; i += 1) {
      var angle = rng() * Math.PI * 2 + Math.sin(time * 0.16 + i) * 0.022;
      var arc = 0.014 + rng() * 0.060;
      var alpha = (0.055 + rng() * 0.100) * intensity;

      ctx.strokeStyle = "rgba(255, 251, 204, " + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.005 + rng() * 0.012);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * (0.988 + rng() * 0.022), angle - arc, angle + arc);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSurfaceBloom(ctx, cx, cy, radius, seed, time, intensity) {
    var rng = createRng(seed ^ 0xB1004);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (var i = 0; i < 52; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * radius * 0.92;
      var x = cx + Math.cos(angle + time * 0.007) * distance;
      var y = cy + Math.sin(angle - time * 0.006) * distance;
      var size = radius * (0.024 + rng() * 0.095);
      var alpha = (0.015 + rng() * 0.044) * intensity;

      var bloom = ctx.createRadialGradient(x, y, 0, x, y, size);
      bloom.addColorStop(0, "rgba(255, 255, 232, " + alpha.toFixed(3) + ")");
      bloom.addColorStop(0.42, "rgba(255, 224, 112, " + (alpha * 0.54).toFixed(3) + ")");
      bloom.addColorStop(1, "rgba(255, 224, 112, 0)");

      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(700, Math.max(330, canvas.clientWidth || 500));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.96 : config.intensity, 0, 1);

    var prepared = resizeCanvas(canvas, cssSize);
    var ctx = prepared.ctx;
    var dpr = Math.max(1, Math.min(prepared.dpr, 1.35));

    ctx.clearRect(0, 0, cssSize, cssSize);

    var cx = cssSize / 2;
    var cy = cssSize / 2;
    var radius = cssSize * 0.338;
    var plasmaPixels = Math.max(360, Math.floor(cssSize * dpr));
    var plasmaCanvas = buildPlasmaDiscCanvas(plasmaPixels, seed, time, intensity);

    drawExpansionGlow(ctx, cx, cy, radius, seed, time, intensity);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(plasmaCanvas, 0, 0, cssSize, cssSize);
    ctx.restore();

    drawSurfaceBloom(ctx, cx, cy, radius, seed, time, intensity);
    drawEdgeIgnition(ctx, cx, cy, radius, seed, time, intensity);

    return {
      ok: true,
      mode: "canvas",
      profile: PROFILE,
      size: cssSize,
      seed: seed,
      coordinateSystem: "offscreen-centered-drawImage",
      planetRead: false,
      eclipseRead: false,
      darkLimb: false,
      decorativeRays: false,
      illustrativeSwirls: false,
      externalImageDependency: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign(
      {
        seed: 4217,
        size: 500,
        animate: true,
        intensity: 0.96,
        frameRate: 14
      },
      options || {}
    );

    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function tick(timestamp) {
      if (!active) return;

      var minFrameGap = 1000 / clamp(config.frameRate || 14, 6, 24);

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
          profile: PROFILE,
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
