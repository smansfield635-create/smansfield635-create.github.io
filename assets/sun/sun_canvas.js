/* DGB SUN CANVAS — SATELLITE OBSERVATIONAL SOLAR DISC B9
   FILE: /assets/sun/sun_canvas.js
   PURPOSE:
   - Render a satellite-style solar disc.
   - Remove cheesecake/thin-slice/conic wedge visual read.
   - Use mottled photosphere, sunspot clusters, active regions, limb darkening, and subtle corona.
   - No external image.
   - No generated image dependency.
*/

(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";
  var VERSION = "sun-canvas-b9-satellite-observational-disc";
  var PROFILE = "satellite-observational-solar-disc-b9";
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
      value += valueNoise(x * frequency, y * frequency, seed + i * 31.77) * amplitude;
      total += amplitude;
      amplitude *= 0.53;
      frequency *= 2.07;
    }

    return total ? value / total : 0;
  }

  function resizeCanvas(canvas, cssSize) {
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.25 : 1.7));
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

    return { ctx: ctx, pixelSize: pixelSize, cssSize: cssSize, dpr: dpr };
  }

  function makeCanvas(size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  function buildRegions(seed) {
    var rng = createRng(seed ^ 0x51A7E);
    var regions = [];
    var i;
    var angle;
    var distance;

    for (i = 0; i < 42; i += 1) {
      angle = rng() * TAU;
      distance = Math.sqrt(rng()) * 0.88;

      regions.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 0.028 + rng() * 0.095,
        strength: 0.05 + rng() * 0.24,
        hot: rng() > 0.42,
        stretch: 0.72 + rng() * 1.85,
        angle: rng() * Math.PI
      });
    }

    return regions;
  }

  function buildSunspots(seed) {
    var rng = createRng(seed ^ 0xA51F);
    var spots = [];
    var groups = 7;
    var group;
    var i;
    var j;
    var baseAngle;
    var baseDistance;
    var baseX;
    var baseY;

    for (i = 0; i < groups; i += 1) {
      baseAngle = rng() * TAU;
      baseDistance = Math.sqrt(rng()) * 0.78;
      baseX = Math.cos(baseAngle) * baseDistance;
      baseY = Math.sin(baseAngle) * baseDistance;

      group = 2 + Math.floor(rng() * 5);

      for (j = 0; j < group; j += 1) {
        spots.push({
          x: baseX + (rng() - 0.5) * 0.18,
          y: baseY + (rng() - 0.5) * 0.12,
          radius: 0.012 + rng() * 0.038,
          darkness: 0.25 + rng() * 0.55,
          penumbra: 1.85 + rng() * 1.25
        });
      }
    }

    return spots;
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
        cool += influence * region.strength * 0.58;
      }
    }

    return { hot: clamp(hot, 0, 1), cool: clamp(cool, 0, 0.75) };
  }

  function sampleSunspots(nx, ny, spots) {
    var dark = 0;
    var penumbra = 0;
    var i;
    var spot;
    var dx;
    var dy;
    var q;
    var core;
    var halo;

    for (i = 0; i < spots.length; i += 1) {
      spot = spots[i];
      dx = nx - spot.x;
      dy = ny - spot.y;
      q = Math.sqrt(dx * dx + dy * dy);

      core = Math.exp(-(q * q) / (spot.radius * spot.radius));
      halo = Math.exp(-(q * q) / ((spot.radius * spot.penumbra) * (spot.radius * spot.penumbra)));

      dark += core * spot.darkness;
      penumbra += halo * spot.darkness * 0.42;
    }

    return {
      dark: clamp(dark, 0, 0.92),
      penumbra: clamp(penumbra, 0, 0.62)
    };
  }

  function solarColor(value, limb, hot, cool, spot) {
    var r;
    var g;
    var b;
    var t;

    value = clamp(value, 0, 1);

    if (value < 0.22) {
      t = value / 0.22;
      r = lerp(116, 190, t);
      g = lerp(31, 58, t);
      b = lerp(9, 11, t);
    } else if (value < 0.55) {
      t = (value - 0.22) / 0.33;
      r = lerp(190, 238, t);
      g = lerp(58, 112, t);
      b = lerp(11, 24, t);
    } else if (value < 0.84) {
      t = (value - 0.55) / 0.29;
      r = lerp(238, 255, t);
      g = lerp(112, 191, t);
      b = lerp(24, 68, t);
    } else {
      t = (value - 0.84) / 0.16;
      r = lerp(255, 255, t);
      g = lerp(191, 246, t);
      b = lerp(68, 168, t);
    }

    r += hot * 28 - cool * 16;
    g += hot * 22 - cool * 13;
    b += hot * 8 - cool * 6;

    r -= limb * 30;
    g -= limb * 22;
    b -= limb * 10;

    r -= spot * 92;
    g -= spot * 66;
    b -= spot * 22;

    return [
      clamp(Math.round(r), 0, 255),
      clamp(Math.round(g), 0, 255),
      clamp(Math.round(b), 0, 255)
    ];
  }

  function buildSolarDisc(pixelSize, seed, time, intensity) {
    var disc = makeCanvas(pixelSize);
    var ctx = disc.getContext("2d", { alpha: true });
    var image = ctx.createImageData(pixelSize, pixelSize);
    var data = image.data;
    var cx = pixelSize / 2;
    var cy = pixelSize / 2;
    var radius = pixelSize * 0.392;
    var regions = buildRegions(seed);
    var spots = buildSunspots(seed);
    var rotation = time * 0.006;
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
    var rx;
    var ry;
    var alpha;
    var limb;
    var center;
    var global;
    var cells;
    var granules;
    var micro;
    var network;
    var region;
    var spot;
    var value;
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

        alpha = 1 - smoothstep(1.0, 1.035, d);
        nx = dx;
        ny = dy;

        rx = nx * cr - ny * sr;
        ry = nx * sr + ny * cr;

        limb = smoothstep(0.62, 1.0, d);
        center = 1 - smoothstep(0.0, 0.98, d);

        global = fbm(rx * 2.0 + time * 0.004, ry * 2.0 - time * 0.003, seed, 5);
        cells = fbm(rx * 8.5 - time * 0.006, ry * 8.5 + time * 0.005, seed + 97, 5);
        granules = fbm(rx * 28.0 + time * 0.012, ry * 28.0 - time * 0.010, seed + 211, 4);
        micro = fbm(rx * 76.0 - time * 0.018, ry * 76.0 + time * 0.015, seed + 503, 3);
        network = fbm(rx * 15.0 + granules * 0.8, ry * 15.0 + cells * 0.7, seed + 809, 3);

        region = sampleRegions(rx, ry, regions);
        spot = sampleSunspots(rx, ry, spots);

        value =
          0.42 +
          global * 0.20 +
          cells * 0.22 +
          granules * 0.19 +
          micro * 0.07 +
          network * 0.08 +
          region.hot * 0.18 -
          region.cool * 0.12 +
          center * 0.08 -
          limb * 0.17 -
          spot.dark * 0.32 -
          spot.penumbra * 0.16;

        value = clamp(value * (0.98 + intensity * 0.09), 0.08, 1.0);
        color = solarColor(value, limb, region.hot, region.cool, spot.dark + spot.penumbra * 0.45);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = Math.round(255 * alpha);
      }
    }

    ctx.putImageData(image, 0, 0);
    return disc;
  }

  function drawAtmosphere(ctx, side, seed, time, intensity) {
    var cx = side / 2;
    var cy = side / 2;
    var radius = side * 0.392;
    var glow;
    var limb;
    var rng = createRng(seed ^ 0xC0A1);
    var i;
    var angle;
    var length;
    var alpha;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    glow = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.58);
    glow.addColorStop(0.0, "rgba(255,244,196," + (0.13 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.20, "rgba(255,191,83," + (0.085 * intensity).toFixed(3) + ")");
    glow.addColorStop(0.55, "rgba(255,112,32," + (0.034 * intensity).toFixed(3) + ")");
    glow.addColorStop(1.0, "rgba(255,90,24,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.6, 0, TAU);
    ctx.fill();

    limb = ctx.createRadialGradient(cx, cy, radius * 0.97, cx, cy, radius * 1.05);
    limb.addColorStop(0.0, "rgba(255,255,230,0)");
    limb.addColorStop(0.62, "rgba(255,234,172," + (0.12 * intensity).toFixed(3) + ")");
    limb.addColorStop(1.0, "rgba(255,184,80,0)");
    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.07, 0, TAU);
    ctx.fill();

    for (i = 0; i < 20; i += 1) {
      angle = rng() * TAU + Math.sin(time * 0.11 + i) * 0.018;
      length = radius * (1.005 + rng() * 0.035);
      alpha = (0.018 + rng() * 0.042) * intensity;
      ctx.strokeStyle = "rgba(255,230,160," + alpha.toFixed(3) + ")";
      ctx.lineWidth = radius * (0.0025 + rng() * 0.006);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, length, angle - 0.018, angle + 0.028);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawOpticalFinish(ctx, side) {
    var cx = side / 2;
    var cy = side / 2;
    var radius = side * 0.392;
    var vignette;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    vignette = ctx.createRadialGradient(cx, cy, radius * 0.18, cx, cy, radius * 1.03);
    vignette.addColorStop(0.0, "rgba(255,255,255,0.020)");
    vignette.addColorStop(0.56, "rgba(255,255,255,0.000)");
    vignette.addColorStop(0.84, "rgba(42,8,2,0.14)");
    vignette.addColorStop(1.0, "rgba(0,0,0,0.34)");

    ctx.fillStyle = vignette;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.04, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function render(canvas, options) {
    var config = options || {};
    var cssSize = config.size || Math.min(720, Math.max(340, canvas.clientWidth || 540));
    var seed = Math.floor(config.seed || 4217);
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.9 : config.intensity, 0.55, 1);
    var prepared = resizeCanvas(canvas, cssSize);
    var ctx = prepared.ctx;
    var side = prepared.pixelSize;
    var disc;
    var cx = side / 2;
    var cy = side / 2;

    ctx.clearRect(0, 0, side, side);

    drawAtmosphere(ctx, side, seed, time, intensity);

    disc = buildSolarDisc(side, seed, time, intensity);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(disc, 0, 0, side, side);
    ctx.restore();

    drawOpticalFinish(ctx, side);

    canvas.setAttribute("data-sun-renderer-version", VERSION);
    canvas.setAttribute("data-sun-profile", PROFILE);
    canvas.setAttribute("data-sun-intensity", intensity.toFixed(2));
    canvas.setAttribute("data-visual-target", "satellite observational solar disc");
    canvas.setAttribute("data-cheesecake-slices", "false");
    canvas.setAttribute("data-conic-wedges", "false");

    return {
      ok: true,
      mode: "canvas",
      profile: PROFILE,
      version: VERSION,
      size: cssSize,
      seed: seed,
      intensity: intensity,
      visualTarget: "satellite observational solar disc",
      texture: "mottled photosphere granulation sunspots limb-darkening",
      conicWedges: false,
      cheesecakeSliceRead: false,
      externalImageDependency: false,
      graphicGenerationUsed: false
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign({
      seed: 4217,
      size: 540,
      animate: true,
      intensity: 0.9,
      frameRate: 8
    }, options || {});

    var active = true;
    var frame = null;
    var lastDraw = 0;
    var start = Date.now();

    function tick(timestamp) {
      var minFrameGap;

      if (!active) return;

      minFrameGap = 1000 / clamp(config.frameRate || 8, 4, 12);

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
      } else {
        frame = null;
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

        if (config.animate && !frame) {
          frame = window.requestAnimationFrame(tick);
        }
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
          version: VERSION,
          visualTarget: "satellite observational solar disc",
          cheesecakeSliceRead: false,
          conicWedges: false
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    version: VERSION,
    profile: PROFILE,
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
