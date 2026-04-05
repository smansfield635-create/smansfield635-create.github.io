DESTINATION: /index.js
(() => {
  "use strict";

  const JS_STAMP = "J11-VISIBILITY-PROOF-SAFE";
  const canvas = document.getElementById("scene");
  if (!canvas) throw new Error("Compass page requires #scene canvas");

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) throw new Error("2D canvas context unavailable");

  const DPR_CAP = 2;
  const TWO_PI = Math.PI * 2;

  const state = {
    dpr: 1,
    width: 1,
    height: 1,
    cx: 0,
    cy: 0,
    radius: 1,
    rafId: 0,
    startTime: performance.now(),
    stars: [],
    anchors: [],
    showStamp: true
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hashString(input) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(seedValue) {
    let seed = seedValue >>> 0;
    return function rand() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function getRectSize() {
    const rect = canvas.getBoundingClientRect();
    return {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height))
    };
  }

  function buildAnchors() {
    const r = state.radius;
    const d = r * 0.72;
    return [
      { key: "N",  x: state.cx,     y: state.cy - r, size: 22, glow: 120, rgb: [255, 245, 220] },
      { key: "NE", x: state.cx + d, y: state.cy - d, size: 18, glow: 96,  rgb: [220, 232, 255] },
      { key: "E",  x: state.cx + r, y: state.cy,     size: 18, glow: 96,  rgb: [220, 232, 255] },
      { key: "SE", x: state.cx + d, y: state.cy + d, size: 17, glow: 90,  rgb: [255, 222, 180] },
      { key: "S",  x: state.cx,     y: state.cy + r, size: 17, glow: 90,  rgb: [255, 222, 180] },
      { key: "SW", x: state.cx - d, y: state.cy + d, size: 16, glow: 84,  rgb: [255, 212, 170] },
      { key: "W",  x: state.cx - r, y: state.cy,     size: 18, glow: 96,  rgb: [220, 232, 255] },
      { key: "NW", x: state.cx - d, y: state.cy - d, size: 18, glow: 96,  rgb: [220, 232, 255] },
      { key: "C",  x: state.cx,     y: state.cy,     size: 26, glow: 150, rgb: [255, 255, 255] }
    ];
  }

  function buildStars(rand, count) {
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const pick = rand();
      stars.push({
        x: rand() * state.width,
        y: rand() * state.height,
        r: lerp(0.9, 2.2, Math.pow(rand(), 1.35)),
        a: lerp(0.45, 0.95, rand()),
        tw: rand() * TWO_PI,
        rgb: pick < 0.2 ? [255, 230, 190] : pick < 0.55 ? [255, 255, 255] : [200, 220, 255]
      });
    }
    return stars;
  }

  function buildScene() {
    const seed = hashString("diamondgatebridge:/index:" + state.width + "x" + state.height + ":" + JS_STAMP);
    const rand = createRng(seed ^ 0x51EE7712);
    state.stars = buildStars(rand, state.width < 700 ? 120 : 180);
    state.anchors = buildAnchors();
  }

  function resize() {
    const size = getRectSize();
    state.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    state.width = size.width;
    state.height = size.height;
    state.cx = state.width * 0.5;
    state.cy = state.height * 0.53;
    state.radius = Math.min(state.width, state.height) * (state.width < 700 ? 0.30 : 0.26);

    canvas.width = Math.max(1, Math.floor(state.width * state.dpr));
    canvas.height = Math.max(1, Math.floor(state.height * state.dpr));
    canvas.style.width = state.width + "px";
    canvas.style.height = state.height + "px";

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
  }

  function drawBackground() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawStars(timeSeconds) {
    for (let i = 0; i < state.stars.length; i += 1) {
      const s = state.stars[i];
      const a = clamp(s.a * (0.78 + Math.sin(timeSeconds * 0.9 + s.tw) * 0.22), 0, 1);
      ctx.fillStyle = "rgba(" + s.rgb[0] + "," + s.rgb[1] + "," + s.rgb[2] + "," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, TWO_PI);
      ctx.fill();
    }
  }

  function drawGuides() {
    const a = state.anchors;
    ctx.save();
    ctx.strokeStyle = "rgba(140,170,255,0.28)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(a[0].x, a[0].y);
    for (let i = 1; i < 8; i += 1) ctx.lineTo(a[i].x, a[i].y);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(140,170,255,0.18)";
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      ctx.moveTo(state.cx, state.cy);
      ctx.lineTo(a[i].x, a[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAnchor(anchor, timeSeconds, index) {
    const pulse = 0.9 + Math.sin(timeSeconds * 1.1 + index * 0.5) * 0.1;

    const glow = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, anchor.glow);
    glow.addColorStop(0, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0.22)");
    glow.addColorStop(0.22, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0.10)");
    glow.addColorStop(0.55, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0.04)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, anchor.glow * pulse, 0, TWO_PI);
    ctx.fill();

    const core = ctx.createRadialGradient(
      anchor.x - anchor.size * 0.25,
      anchor.y - anchor.size * 0.25,
      0,
      anchor.x,
      anchor.y,
      anchor.size * 3
    );
    core.addColorStop(0, "rgba(255,255,255,1)");
    core.addColorStop(0.2, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0.98)");
    core.addColorStop(0.7, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0.84)");
    core.addColorStop(1, "rgba(" + anchor.rgb[0] + "," + anchor.rgb[1] + "," + anchor.rgb[2] + ",0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, anchor.size * pulse, 0, TWO_PI);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.90)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(anchor.x - anchor.size * 5, anchor.y);
    ctx.lineTo(anchor.x + anchor.size * 5, anchor.y);
    ctx.moveTo(anchor.x, anchor.y - anchor.size * 5);
    ctx.lineTo(anchor.x, anchor.y + anchor.size * 5);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.98)";
    ctx.font = "700 " + (state.width < 640 ? 16 : 18) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(anchor.key, anchor.x, anchor.y - anchor.glow - 10);
  }

  function drawStamp() {
    if (!state.showStamp) return;

    const label = "JS " + JS_STAMP;
    const padX = 10;
    const padY = 7;
    const fontSize = 11;
    const x = 12;
    const y = state.height - 14;

    ctx.save();
    ctx.font = "700 " + fontSize + "px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    const width = ctx.measureText(label).width + padX * 2;
    const height = fontSize + padY * 2;

    ctx.fillStyle = "rgba(5,11,24,0.72)";
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;

    const rx = x - 4;
    const ry = y - height + 4;
    const rr = 10;

    ctx.beginPath();
    ctx.moveTo(rx + rr, ry);
    ctx.lineTo(rx + width - rr, ry);
    ctx.quadraticCurveTo(rx + width, ry, rx + width, ry + rr);
    ctx.lineTo(rx + width, ry + height - rr);
    ctx.quadraticCurveTo(rx + width, ry + height, rx + width - rr, ry + height);
    ctx.lineTo(rx + rr, ry + height);
    ctx.quadraticCurveTo(rx, ry + height, rx, ry + height - rr);
    ctx.lineTo(rx, ry + rr);
    ctx.quadraticCurveTo(rx, ry, rx + rr, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(235,242,255,0.92)";
    ctx.fillText(label, x + padX - 4, y - padY + 2);
    ctx.restore();
  }

  function drawFrame(now) {
    const timeSeconds = (now - state.startTime) * 0.001;

    ctx.clearRect(0, 0, state.width, state.height);
    drawBackground();
    drawStars(timeSeconds);
    drawGuides();

    for (let i = 0; i < state.anchors.length; i += 1) {
      drawAnchor(state.anchors[i], timeSeconds, i);
    }

    drawStamp();
    state.rafId = window.requestAnimationFrame(drawFrame);
  }

  function start() {
    resize();
    if (state.rafId) window.cancelAnimationFrame(state.rafId);
    state.startTime = performance.now();
    state.rafId = window.requestAnimationFrame(drawFrame);
    window.__ROOT_INDEX_JS_PROOF__ = true;
    window.__COMPASS_GALAXY_ACTIVE__ = true;
    window.__COMPASS_JS_STAMP__ = JS_STAMP;
  }

  let resizeTimer = 0;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 60);
  }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      return;
    }
    if (!state.rafId) {
      state.startTime = performance.now();
      state.rafId = window.requestAnimationFrame(drawFrame);
    }
  });

  canvas.addEventListener("click", () => {
    state.showStamp = !state.showStamp;
  });

  start();
})();
