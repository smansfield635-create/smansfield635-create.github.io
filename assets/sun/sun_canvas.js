(function () {
  "use strict";

  var GLOBAL_NAME = "DGBSunCanvas";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
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

  function resizeCanvas(canvas, size) {
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawCorona(ctx, cx, cy, radius, rng, time, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < 42; i += 1) {
      var angle = (Math.PI * 2 * i) / 42 + time * 0.04 + rng() * 0.22;
      var length = radius * (0.42 + rng() * 0.30) * intensity;
      var width = radius * (0.014 + rng() * 0.018);
      var inner = radius * (0.84 + rng() * 0.08);
      var outer = inner + length;
      var x1 = cx + Math.cos(angle) * inner;
      var y1 = cy + Math.sin(angle) * inner;
      var x2 = cx + Math.cos(angle) * outer;
      var y2 = cy + Math.sin(angle) * outer;

      var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, "rgba(255, 226, 135, 0.18)");
      gradient.addColorStop(0.45, "rgba(255, 129, 35, 0.10)");
      gradient.addColorStop(1, "rgba(255, 129, 35, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSunDisc(ctx, cx, cy, radius) {
    var gradient = ctx.createRadialGradient(
      cx - radius * 0.20,
      cy - radius * 0.24,
      radius * 0.05,
      cx,
      cy,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,238,1)");
    gradient.addColorStop(0.14, "rgba(255,239,150,0.98)");
    gradient.addColorStop(0.38, "rgba(255,154,42,0.96)");
    gradient.addColorStop(0.66, "rgba(197,55,13,0.90)");
    gradient.addColorStop(1, "rgba(48,11,4,0.96)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTexture(ctx, cx, cy, radius, rng, time) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalCompositeOperation = "overlay";

    for (var i = 0; i < 120; i += 1) {
      var angle = rng() * Math.PI * 2;
      var distance = Math.sqrt(rng()) * radius * 0.94;
      var x = cx + Math.cos(angle) * distance;
      var y = cy + Math.sin(angle) * distance;
      var spotRadius = radius * (0.012 + rng() * 0.052);
      var hot = rng() > 0.48;

      var gradient = ctx.createRadialGradient(x, y, 0, x, y, spotRadius);
      if (hot) {
        gradient.addColorStop(0, "rgba(255,255,220,0.28)");
        gradient.addColorStop(0.45, "rgba(255,216,96,0.14)");
        gradient.addColorStop(1, "rgba(255,120,28,0)");
      } else {
        gradient.addColorStop(0, "rgba(92,21,5,0.28)");
        gradient.addColorStop(0.55, "rgba(150,38,8,0.12)");
        gradient.addColorStop(1, "rgba(92,21,5,0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        spotRadius * (1.25 + rng() * 1.8),
        spotRadius * (0.45 + rng() * 0.7),
        angle + time * 0.02,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    for (var j = 0; j < 18; j += 1) {
      var a = rng() * Math.PI * 2;
      var r = radius * (0.10 + rng() * 0.74);
      var sx = cx + Math.cos(a) * r;
      var sy = cy + Math.sin(a) * r;
      var length = radius * (0.16 + rng() * 0.40);

      ctx.strokeStyle = rng() > 0.5 ? "rgba(255,235,142,0.17)" : "rgba(90,20,5,0.18)";
      ctx.lineWidth = radius * (0.012 + rng() * 0.026);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(sx - Math.cos(a) * length * 0.5, sy - Math.sin(a) * length * 0.5);
      ctx.quadraticCurveTo(
        sx + Math.cos(a + 1.4) * length * 0.18,
        sy + Math.sin(a + 1.4) * length * 0.18,
        sx + Math.cos(a) * length * 0.5,
        sy + Math.sin(a) * length * 0.5
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLimbDarkening(ctx, cx, cy, radius) {
    var gradient = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.66, "rgba(0,0,0,0.04)");
    gradient.addColorStop(1, "rgba(12,3,1,0.56)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,246,202,0.22)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function render(canvas, options) {
    var config = options || {};
    var size = config.size || Math.min(520, Math.max(280, canvas.clientWidth || 420));
    var seed = config.seed || 4217;
    var time = typeof config.time === "number" ? config.time : 0;
    var intensity = clamp(config.intensity == null ? 0.72 : config.intensity, 0, 1);

    var ctx = resizeCanvas(canvas, size);
    var rng = createRng(seed);

    ctx.clearRect(0, 0, size, size);

    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.31;

    drawCorona(ctx, cx, cy, radius, rng, time, 0.76 + intensity * 0.42);
    drawSunDisc(ctx, cx, cy, radius);
    drawTexture(ctx, cx, cy, radius, rng, time);
    drawLimbDarkening(ctx, cx, cy, radius);

    return {
      ok: true,
      mode: "canvas",
      size: size,
      seed: seed
    };
  }

  function createCanvasSun(canvas, options) {
    var config = Object.assign(
      {
        seed: 4217,
        size: 420,
        animate: true,
        intensity: 0.72
      },
      options || {}
    );

    var active = true;
    var frame = null;
    var start = Date.now();

    function tick() {
      if (!active) return;

      var time = (Date.now() - start) / 1000;
      render(canvas, {
        seed: config.seed,
        size: config.size,
        intensity: config.intensity,
        time: time
      });

      if (config.animate) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    tick();

    return {
      update: function (next) {
        config = Object.assign(config, next || {});
        tick();
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
          intensity: config.intensity
        };
      }
    };
  }

  window[GLOBAL_NAME] = Object.freeze({
    render: render,
    createCanvasSun: createCanvasSun
  });
})();
