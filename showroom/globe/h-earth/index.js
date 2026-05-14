// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_CHILD_ROUTE_EARTH_WATER_AIR_CLASSIC_BOOT_TNT_v1
// Classic deferred runtime.
// Owns H-Earth child-route earth / water / air condition rendering.
// No module export. No parent selector authority. No cross-planet runtime.

(function () {
  "use strict";

  var CONTRACT = "H_EARTH_CHILD_ROUTE_EARTH_WATER_AIR_CLASSIC_BOOT_TNT_v1";
  var PREVIOUS_CONTRACT = "H_EARTH_CHILD_ROUTE_EARTH_WATER_AIR_PLACEMENT_TNT_v1";
  var ROUTE = "/showroom/globe/h-earth/";
  var TAU = Math.PI * 2;

  var state = {
    canvas: null,
    ctx: null,
    raf: 0,
    running: false,
    startedAt: performance.now(),
    width: 0,
    height: 0,
    dpr: 1,
    shiftX: 0,
    shiftY: 0,
    velocityX: 0,
    velocityY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    motion: true,
    detail: "standard",
    visible: document.visibilityState === "visible",
    lastTap: 0,
    renderedOnce: false
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = String(value);
  }

  function markDocument(extra) {
    var markers = Object.assign({
      route: ROUTE,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      page: "h-earth-ground-level",
      role: "h-earth-child-route-ground-level-environment",
      sceneModel: "earth-water-air-condition-stack",
      renderedBy: "classic-defer-condition-runtime",
      parentSelectorOwnsThisScene: "false",
      childRoutePlacement: "true",
      runtimeBoot: "classic-defer",
      motion: state.motion ? "on" : "off",
      detail: state.detail,
      renderedOnce: state.renderedOnce ? "true" : "false"
    }, extra || {});

    Object.keys(markers).forEach(function (key) {
      setDataset(document.documentElement, key, markers[key]);
      setDataset(document.body, key, markers[key]);
    });
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function updateSceneNote() {
    var detailText = state.detail === "high" ? "refined water shimmer and denser earth linework" : "clean baseline condition detail";
    var motionText = state.motion ? "motion active" : "motion paused";
    setText("[data-scene-note]", "Earth owns the foreground. Water owns the horizon band. Air owns the light, haze, and sky. Current runtime: " + detailText + ", " + motionText + ".");
  }

  function updateControls() {
    var motion = document.querySelector("[data-control='motion']");
    var detail = document.querySelector("[data-control='detail']");

    if (motion) {
      motion.textContent = "Motion: " + (state.motion ? "on" : "off");
      motion.classList.toggle("active", state.motion);
    }

    if (detail) {
      detail.textContent = "Detail: " + state.detail;
      detail.classList.toggle("active", state.detail === "high");
    }

    updateSceneNote();
    markDocument();
  }

  function resolveCanvas() {
    return document.querySelector("[data-scene-canvas]");
  }

  function resizeCanvas() {
    if (!state.canvas) return false;

    var rect = state.canvas.getBoundingClientRect();
    var parentRect = state.canvas.parentElement ? state.canvas.parentElement.getBoundingClientRect() : null;
    var cssWidth = rect.width || (parentRect && parentRect.width) || 640;
    var cssHeight = rect.height || (parentRect && parentRect.height) || 430;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    var width = Math.max(640, Math.floor(cssWidth * dpr));
    var height = Math.max(390, Math.floor(cssHeight * dpr));

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    return true;
  }

  function drawSky(ctx, width, height, time, horizonY) {
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, "rgba(8,28,62,1)");
    sky.addColorStop(0.38, "rgba(26,68,116,1)");
    sky.addColorStop(0.76, "rgba(100,151,185,1)");
    sky.addColorStop(1, "rgba(174,202,212,1)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, horizonY);

    var glowX = width * (0.68 + state.shiftX * 0.00002);
    var glow = ctx.createRadialGradient(glowX, horizonY * 0.44, 0, glowX, horizonY * 0.44, width * 0.34);
    glow.addColorStop(0, "rgba(248,226,164,0.42)");
    glow.addColorStop(0.34, "rgba(244,207,131,0.17)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, horizonY);

    var haze = ctx.createLinearGradient(0, horizonY * 0.62, 0, horizonY + height * 0.08);
    haze.addColorStop(0, "rgba(255,255,255,0)");
    haze.addColorStop(1, "rgba(236,224,204,0.20)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizonY * 0.62, width, height * 0.20);

    if (state.detail === "high") {
      for (var i = 0; i < 5; i += 1) {
        var x = (width * (0.16 + i * 0.18) + time * (0.018 + i * 0.004) + state.shiftX * 0.28) % (width + 240) - 120;
        var y = horizonY * (0.22 + i * 0.08);
        var rx = width * (0.075 + (i % 2) * 0.025);
        var ry = rx * 0.28;
        var cloud = ctx.createRadialGradient(x, y, 0, x, y, rx);
        cloud.addColorStop(0, "rgba(255,255,255,0.16)");
        cloud.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = cloud;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
        ctx.fill();
      }
    }
  }

  function drawWater(ctx, width, height, time, horizonY, shoreY) {
    var waterTop = horizonY;
    var waterBottom = Math.min(height, shoreY + height * 0.13);

    var water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
    water.addColorStop(0, "rgba(91,146,170,1)");
    water.addColorStop(0.30, "rgba(42,97,135,1)");
    water.addColorStop(0.72, "rgba(17,55,88,1)");
    water.addColorStop(1, "rgba(8,28,46,1)");
    ctx.fillStyle = water;
    ctx.fillRect(0, waterTop, width, waterBottom - waterTop);

    var shimmerBands = state.detail === "high" ? 28 : 17;
    for (var i = 0; i < shimmerBands; i += 1) {
      var ratio = i / shimmerBands;
      var y = waterTop + ratio * (waterBottom - waterTop);
      var alpha = 0.045 + (1 - ratio) * 0.085;
      var wobble = Math.sin(time * 0.0024 + i * 0.72) * 22 + state.shiftX * 0.16;
      var span = width * (0.16 + (1 - ratio) * 0.36);
      var grad = ctx.createLinearGradient(width * 0.5 - span + wobble, 0, width * 0.5 + span + wobble, 0);

      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(255,236,186," + alpha.toFixed(3) + ")");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, state.dpr * (state.detail === "high" ? 1.15 : 0.85));
      ctx.beginPath();
      ctx.moveTo(width * 0.5 - span + wobble, y);
      ctx.lineTo(width * 0.5 + span + wobble, y);
      ctx.stroke();
    }

    var waveRows = state.detail === "high" ? 7 : 4;
    for (var row = 0; row < waveRows; row += 1) {
      var rowY = waterTop + height * (0.045 + row * 0.045);
      var amp = 3.5 + row * 1.6;
      var freq = 0.010 + row * 0.0018;

      ctx.strokeStyle = "rgba(190,224,238," + (0.12 - row * 0.014).toFixed(3) + ")";
      ctx.lineWidth = Math.max(1, state.dpr * 0.75);
      ctx.beginPath();

      for (var x = 0; x <= width; x += 10) {
        var wave = Math.sin(x * freq + time * 0.0022 + row) * amp + Math.sin(x * freq * 0.42 + time * 0.0011) * amp * 0.45;
        var py = rowY + wave;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }

      ctx.stroke();
    }
  }

  function drawEarth(ctx, width, height, time, shoreY) {
    var groundGrad = ctx.createLinearGradient(0, shoreY, 0, height);
    groundGrad.addColorStop(0, "rgba(143,120,80,1)");
    groundGrad.addColorStop(0.24, "rgba(112,88,58,1)");
    groundGrad.addColorStop(0.68, "rgba(73,55,37,1)");
    groundGrad.addColorStop(1, "rgba(33,23,17,1)");
    ctx.fillStyle = groundGrad;

    var curve = height * 0.05;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, shoreY + curve);
    ctx.bezierCurveTo(
      width * 0.16,
      shoreY - 12 + state.shiftY * 0.20,
      width * 0.38,
      shoreY + 25 - state.shiftY * 0.12,
      width * 0.56,
      shoreY + 9
    );
    ctx.bezierCurveTo(
      width * 0.68,
      shoreY + 1,
      width * 0.84,
      shoreY + 22,
      width,
      shoreY + 8
    );
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    var shore = ctx.createLinearGradient(0, shoreY - 14, 0, shoreY + 20);
    shore.addColorStop(0, "rgba(240,220,178,0.34)");
    shore.addColorStop(0.45, "rgba(210,182,124,0.24)");
    shore.addColorStop(1, "rgba(86,64,42,0)");
    ctx.fillStyle = shore;
    ctx.fillRect(0, shoreY - 14, width, 30);

    var ridges = state.detail === "high" ? 7 : 4;
    for (var i = 0; i < ridges; i += 1) {
      var y = shoreY + 25 + i * 22;
      ctx.strokeStyle = "rgba(22,14,10," + (0.18 - i * 0.02).toFixed(3) + ")";
      ctx.lineWidth = Math.max(1, state.dpr * 1.05);
      ctx.beginPath();

      for (var x = 0; x <= width; x += 14) {
        var noise = Math.sin(x * 0.012 + i * 0.8 + time * 0.0007) * (4 + i * 1.1);
        var tilt = Math.sin(x * 0.004 + i) * 3;
        var py = y + noise + tilt;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }

      ctx.stroke();
    }
  }

  function paint(now) {
    if (!state.ctx || !state.canvas) return;

    resizeCanvas();

    var ctx = state.ctx;
    var width = state.width;
    var height = state.height;
    var time = now - state.startedAt;

    if (state.motion && !state.dragging) {
      state.shiftX += state.velocityX;
      state.shiftY += state.velocityY;
      state.velocityX *= 0.96;
      state.velocityY *= 0.94;

      if (Math.abs(state.velocityX) < 0.002) state.velocityX = 0;
      if (Math.abs(state.velocityY) < 0.002) state.velocityY = 0;
    }

    state.shiftX = clamp(state.shiftX, -120, 120);
    state.shiftY = clamp(state.shiftY, -60, 60);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var horizonY = clamp(height * 0.46 + state.shiftY * 0.32, height * 0.34, height * 0.56);
    var shoreY = clamp(height * 0.70 + state.shiftY * 0.24, height * 0.60, height * 0.82);

    drawSky(ctx, width, height, time, horizonY);
    drawWater(ctx, width, height, time, horizonY, shoreY);
    drawEarth(ctx, width, height, time, shoreY);

    state.renderedOnce = true;

    window.DGBHEarthGroundLevelReceipt = Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      scene: "earth-water-air",
      childRoutePlacement: true,
      parentSelectorOwnsThisScene: false,
      runtimeBoot: "classic-defer",
      motion: state.motion,
      detail: state.detail,
      rendered: true,
      width: width,
      height: height,
      shiftX: Number(state.shiftX.toFixed(2)),
      shiftY: Number(state.shiftY.toFixed(2))
    });

    markDocument({ renderedOnce: "true", canvasWidth: width, canvasHeight: height });
  }

  function loop(now) {
    if (!state.running || !state.visible) return;
    paint(now);
    state.raf = window.requestAnimationFrame(loop);
  }

  function stop() {
    state.running = false;
    if (state.raf) {
      window.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function start() {
    if (!state.ctx || !state.canvas || !state.visible) return;
    if (state.running) return;
    state.running = true;
    paint(performance.now());
    state.raf = window.requestAnimationFrame(loop);
  }

  function resetView() {
    state.shiftX = 0;
    state.shiftY = 0;
    state.velocityX = 0;
    state.velocityY = 0;
    paint(performance.now());
  }

  function bindControls() {
    var motion = document.querySelector("[data-control='motion']");
    var detail = document.querySelector("[data-control='detail']");
    var reset = document.querySelector("[data-control='reset']");

    if (motion) {
      motion.addEventListener("click", function () {
        state.motion = !state.motion;
        updateControls();

        if (state.motion) start();
        else {
          stop();
          paint(performance.now());
        }
      });
    }

    if (detail) {
      detail.addEventListener("click", function () {
        state.detail = state.detail === "standard" ? "high" : "standard";
        updateControls();
        paint(performance.now());
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        resetView();
        updateControls();
      });
    }
  }

  function bindCanvas() {
    var canvas = state.canvas;
    if (!canvas) return;

    canvas.addEventListener("pointerdown", function (event) {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.velocityX = 0;
      state.velocityY = 0;

      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }

      var now = performance.now();
      if (now - state.lastTap < 320) resetView();
      state.lastTap = now;
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;

      var dx = event.clientX - state.lastX;
      var dy = event.clientY - state.lastY;

      state.shiftX = clamp(state.shiftX + dx * state.dpr, -120, 120);
      state.shiftY = clamp(state.shiftY + dy * state.dpr * 0.55, -60, 60);
      state.velocityX = dx * 0.16;
      state.velocityY = dy * 0.08;

      state.lastX = event.clientX;
      state.lastY = event.clientY;

      paint(performance.now());
    });

    function release(event) {
      if (!state.dragging) return;
      state.dragging = false;
      if (event && canvas.releasePointerCapture) {
        canvas.releasePointerCapture(event.pointerId);
      }
      if (state.motion) start();
    }

    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", function () {
      state.dragging = false;
    });
  }

  function bindLifecycle() {
    window.addEventListener("resize", function () {
      resizeCanvas();
      paint(performance.now());
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      state.visible = document.visibilityState === "visible";
      if (state.visible) start();
      else stop();
    });

    window.addEventListener("pagehide", function () {
      stop();
    }, { once: true });

    document.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        stop();
      }, { capture: true, passive: true });
    });
  }

  function exposeStatus() {
    window.DGBHEarthGroundLevel = Object.freeze({
      status: function () {
        return Object.freeze({
          contract: CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          route: ROUTE,
          canvasFound: Boolean(state.canvas),
          contextFound: Boolean(state.ctx),
          childRoutePlacement: true,
          parentSelectorOwnsThisScene: false,
          runtimeBoot: "classic-defer",
          motion: state.motion,
          detail: state.detail,
          renderedOnce: state.renderedOnce,
          receipt: window.DGBHEarthGroundLevelReceipt || null
        });
      }
    });
  }

  function init() {
    state.canvas = resolveCanvas();

    if (!state.canvas) {
      markDocument({ rendered: "false", error: "canvas-not-found" });
      exposeStatus();
      return;
    }

    state.ctx = state.canvas.getContext("2d", { alpha: false });

    if (!state.ctx) {
      markDocument({ rendered: "false", error: "2d-context-not-found" });
      exposeStatus();
      return;
    }

    resizeCanvas();
    bindControls();
    bindCanvas();
    bindLifecycle();
    updateControls();
    markDocument({ rendered: "true", booted: "true" });
    exposeStatus();
    paint(performance.now());
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
