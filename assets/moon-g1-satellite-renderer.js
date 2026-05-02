/* ==========================================================================
   DIAMOND GATE BRIDGE
   MOON G1 · SATELLITE-IMAGE PROCEDURAL RENDERER
   FILE: /assets/moon-g1-satellite-renderer.js

   PURPOSE:
   - Shared Moon G1 renderer for /showroom/globe/ and /nine-summits/universe/
   - Code only
   - No GraphicBox
   - No generated image asset
   - Full-moon satellite-image style
   ========================================================================== */

(function attachMoonG1SatelliteRenderer(window) {
  "use strict";

  var VERSION = "MOON_G1_SATELLITE_IMAGE_RENDERER_TNT_v1";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function randomFactory(seed) {
    var s = seed >>> 0;

    return function random() {
      s += 0x6D2B79F5;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawSoftPatch(ctx, cx, cy, rx, ry, rotation, colorInner, colorOuter, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(rx, ry);

    var gradient = ctx.createRadialGradient(0, 0, 0.02, 0, 0, 1);
    gradient.addColorStop(0.00, colorInner);
    gradient.addColorStop(0.58, colorOuter);
    gradient.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.globalAlpha = alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawMaria(ctx, center, radius) {
    /*
      Near-side lunar mare layout:
      - Oceanus Procellarum / Mare Imbrium mass on the left/upper-left
      - Serenitatis / Tranquillitatis / Fecunditatis upper-right/mid-right
      - Nubium / Humorum lower-left
      - Crisium near right limb
      This is built to read like a satellite full-moon image, not a generic crater ball.
    */

    var maria = [
      [-0.42, -0.04, 0.25, 0.36, -0.10, 0.74],
      [-0.28, -0.32, 0.22, 0.16, 0.08, 0.62],
      [-0.08, -0.38, 0.20, 0.14, -0.05, 0.56],
      [0.17, -0.28, 0.18, 0.13, 0.20, 0.52],
      [0.30, -0.10, 0.20, 0.14, -0.10, 0.52],
      [0.34, 0.14, 0.18, 0.12, 0.08, 0.42],
      [-0.22, 0.32, 0.22, 0.14, 0.15, 0.48],
      [-0.44, 0.34, 0.15, 0.11, -0.18, 0.42],
      [0.58, -0.28, 0.12, 0.10, 0.05, 0.46],
      [0.02, 0.02, 0.14, 0.11, 0.10, 0.32]
    ];

    maria.forEach(function (m) {
      drawSoftPatch(
        ctx,
        center + m[0] * radius,
        center + m[1] * radius,
        m[2] * radius,
        m[3] * radius,
        m[4],
        "rgba(32,34,38,0.98)",
        "rgba(70,74,82,0.76)",
        m[5]
      );
    });
  }

  function drawHighlands(ctx, center, radius) {
    drawSoftPatch(ctx, center + 0.10 * radius, center + 0.46 * radius, 0.30 * radius, 0.18 * radius, -0.22, "rgba(230,232,232,0.42)", "rgba(180,184,188,0.14)", 0.62);
    drawSoftPatch(ctx, center + 0.42 * radius, center + 0.38 * radius, 0.24 * radius, 0.18 * radius, 0.18, "rgba(236,238,238,0.35)", "rgba(178,182,188,0.12)", 0.52);
    drawSoftPatch(ctx, center + 0.10 * radius, center - 0.02 * radius, 0.18 * radius, 0.16 * radius, -0.16, "rgba(214,216,218,0.24)", "rgba(150,156,164,0.09)", 0.42);
  }

  function drawCrater(ctx, x, y, r, strength, lightAngle) {
    var lx = Math.cos(lightAngle);
    var ly = Math.sin(lightAngle);
    var rim = clamp(r * 0.075, 1.1, 12);

    ctx.save();

    ctx.globalAlpha = 0.15 * strength;
    ctx.fillStyle = "rgba(4,5,7,0.82)";
    ctx.beginPath();
    ctx.arc(x - lx * r * 0.10, y - ly * r * 0.10, r * 0.88, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.32 * strength;
    ctx.strokeStyle = "rgba(248,250,252,0.72)";
    ctx.lineWidth = rim;
    ctx.beginPath();
    ctx.arc(x + lx * r * 0.04, y + ly * r * 0.04, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.20 * strength;
    ctx.strokeStyle = "rgba(18,20,24,0.82)";
    ctx.lineWidth = rim * 0.58;
    ctx.beginPath();
    ctx.arc(x - lx * r * 0.06, y - ly * r * 0.06, r * 0.76, 0, Math.PI * 2);
    ctx.stroke();

    if (r > 42) {
      ctx.globalAlpha = 0.14 * strength;
      ctx.fillStyle = "rgba(255,255,255,0.52)";
      ctx.beginPath();
      ctx.arc(x + lx * r * 0.20, y + ly * r * 0.20, r * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawNamedCraters(ctx, center, radius) {
    var lightAngle = -0.78;

    var craters = [
      [-0.48, -0.42, 0.030, 0.65],
      [-0.35, -0.18, 0.060, 0.88],
      [-0.18, -0.02, 0.050, 0.78],
      [0.08, -0.15, 0.042, 0.68],
      [0.36, -0.30, 0.060, 0.78],
      [0.56, -0.52, 0.082, 0.86],
      [0.44, 0.08, 0.050, 0.70],
      [0.24, 0.34, 0.050, 0.76],
      [-0.34, 0.46, 0.065, 0.82],
      [0.12, 0.58, 0.048, 0.70],
      [0.42, 0.50, 0.085, 0.94],
      [-0.10, 0.24, 0.045, 0.66]
    ];

    craters.forEach(function (c) {
      drawCrater(
        ctx,
        center + c[0] * radius,
        center + c[1] * radius,
        c[2] * radius,
        c[3],
        lightAngle
      );
    });
  }

  function drawTychoRaySystem(ctx, center, radius, random) {
    var tx = center + 0.28 * radius;
    var ty = center + 0.52 * radius;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (var i = 0; i < 96; i += 1) {
      var angle = (Math.PI * 2 * i) / 96 + (random() - 0.5) * 0.10;
      var length = radius * mix(0.42, 1.38, random());
      var width = mix(1.2, 7.5, random()) * (radius / 1450);
      var ex = tx + Math.cos(angle) * length;
      var ey = ty + Math.sin(angle) * length;

      var gradient = ctx.createLinearGradient(tx, ty, ex, ey);
      gradient.addColorStop(0.00, "rgba(255,255,255,0.18)");
      gradient.addColorStop(0.42, "rgba(235,238,242,0.08)");
      gradient.addColorStop(1.00, "rgba(255,255,255,0)");

      ctx.globalAlpha = mix(0.20, 0.76, random());
      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    ctx.restore();

    drawCrater(ctx, tx, ty, radius * 0.040, 1.12, -0.78);
  }

  function drawCopernicusRaySystem(ctx, center, radius, random) {
    var cx = center - 0.30 * radius;
    var cy = center - 0.04 * radius;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (var i = 0; i < 54; i += 1) {
      var angle = (Math.PI * 2 * i) / 54 + (random() - 0.5) * 0.15;
      var length = radius * mix(0.18, 0.72, random());
      var ex = cx + Math.cos(angle) * length;
      var ey = cy + Math.sin(angle) * length;

      var gradient = ctx.createLinearGradient(cx, cy, ex, ey);
      gradient.addColorStop(0.00, "rgba(255,255,255,0.15)");
      gradient.addColorStop(1.00, "rgba(255,255,255,0)");

      ctx.globalAlpha = mix(0.15, 0.58, random());
      ctx.strokeStyle = gradient;
      ctx.lineWidth = mix(1, 5, random()) * (radius / 1450);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    ctx.restore();

    drawCrater(ctx, cx, cy, radius * 0.050, 0.92, -0.78);
  }

  function drawFineSatelliteTexture(ctx, center, radius, random, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalCompositeOperation = "overlay";

    for (var i = 0; i < 6500; i += 1) {
      var a = random() * Math.PI * 2;
      var d = Math.sqrt(random()) * radius * 0.99;
      var x = center + Math.cos(a) * d;
      var y = center + Math.sin(a) * d;
      var r = mix(0.65, 4.2, random()) * (size / 4096);
      var bright = random() > 0.48;

      ctx.globalAlpha = mix(0.018, 0.095, random());
      ctx.fillStyle = bright ? "rgba(255,255,255,1)" : "rgba(6,8,12,1)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    for (var j = 0; j < 1100; j += 1) {
      var aa = random() * Math.PI * 2;
      var dd = Math.sqrt(random()) * radius * 0.985;
      var xx = center + Math.cos(aa) * dd;
      var yy = center + Math.sin(aa) * dd;
      var rr = Math.pow(random(), 2.45) * radius * 0.012 + radius * 0.0012;

      drawCrater(ctx, xx, yy, rr, mix(0.12, 0.44, random()), -0.78);
    }

    ctx.restore();
  }

  function applyFullMoonSatelliteLighting(ctx, center, radius, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalCompositeOperation = "screen";

    var fullFace = ctx.createRadialGradient(
      center - radius * 0.08,
      center - radius * 0.12,
      radius * 0.04,
      center,
      center,
      radius
    );

    fullFace.addColorStop(0.00, "rgba(255,255,255,0.20)");
    fullFace.addColorStop(0.28, "rgba(246,248,250,0.14)");
    fullFace.addColorStop(0.62, "rgba(230,234,240,0.07)");
    fullFace.addColorStop(1.00, "rgba(220,226,236,0.025)");

    ctx.fillStyle = fullFace;
    ctx.fillRect(0, 0, size, size);

    var earthFill = ctx.createRadialGradient(
      center + radius * 0.12,
      center + radius * 0.28,
      radius * 0.05,
      center,
      center,
      radius * 1.08
    );

    earthFill.addColorStop(0.00, "rgba(110,158,235,0.08)");
    earthFill.addColorStop(0.52, "rgba(82,128,210,0.035)");
    earthFill.addColorStop(1.00, "rgba(82,128,210,0)");

    ctx.fillStyle = earthFill;
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = "multiply";

    var limb = ctx.createRadialGradient(
      center - radius * 0.02,
      center - radius * 0.04,
      radius * 0.18,
      center,
      center,
      radius
    );

    limb.addColorStop(0.00, "rgba(255,255,255,0)");
    limb.addColorStop(0.58, "rgba(255,255,255,0)");
    limb.addColorStop(0.82, "rgba(80,88,100,0.08)");
    limb.addColorStop(0.94, "rgba(30,36,48,0.18)");
    limb.addColorStop(1.00, "rgba(8,12,22,0.30)");

    ctx.fillStyle = limb;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();
  }

  function drawMoon(canvas, options) {
    options = options || {};

    var size = options.size || canvas.width || 4096;
    var random = randomFactory(options.seed || 19720720);

    canvas.width = size;
    canvas.height = size;

    var ctx = canvas.getContext("2d", { alpha: true });
    var center = size / 2;
    var radius = size * 0.405;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    var base = ctx.createRadialGradient(
      center - radius * 0.08,
      center - radius * 0.10,
      radius * 0.04,
      center,
      center,
      radius
    );

    base.addColorStop(0.00, "#f3f3f1");
    base.addColorStop(0.15, "#dedfdd");
    base.addColorStop(0.38, "#bfc3c7");
    base.addColorStop(0.62, "#9ca4ad");
    base.addColorStop(0.82, "#77828d");
    base.addColorStop(1.00, "#505c68");

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    drawMaria(ctx, center, radius);
    drawHighlands(ctx, center, radius);
    drawNamedCraters(ctx, center, radius);
    drawCopernicusRaySystem(ctx, center, radius, random);
    drawTychoRaySystem(ctx, center, radius, random);
    drawFineSatelliteTexture(ctx, center, radius, random, size);

    ctx.restore();

    applyFullMoonSatelliteLighting(ctx, center, radius, size);

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(245,248,255,0.34)";
    ctx.lineWidth = Math.max(2, size * 0.0012);
    ctx.beginPath();
    ctx.arc(center, center, radius - ctx.lineWidth, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    canvas.setAttribute("data-moon-g1-satellite-renderer", VERSION);
    canvas.setAttribute("data-moon-phase", "full-moon");
    canvas.setAttribute("data-generated-image", "false");
    canvas.setAttribute("data-graphic-box", "false");
    canvas.setAttribute("data-source-definition", String(size));

    return {
      ok: true,
      version: VERSION,
      phase: "full-moon",
      style: "satellite-image",
      sourceDefinition: size,
      generatedImage: false,
      graphicBox: false
    };
  }

  window.DGBMoonG1SatelliteRenderer = {
    VERSION: VERSION,
    version: VERSION,
    draw: drawMoon,
    getStatus: function () {
      return {
        ok: true,
        version: VERSION,
        role: "MOON_G1_SATELLITE_IMAGE_RENDERER",
        generatedImage: false,
        graphicBox: false,
        codeOnly: true
      };
    }
  };
})(window);
