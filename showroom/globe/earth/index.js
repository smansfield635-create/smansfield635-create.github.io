// /showroom/globe/earth/index.js
// EARTH_ROUTE_HTML_JS_PAIR_RENEWAL_TNT_v1
// Full-file replacement.
// Purpose:
// - Pair with /showroom/globe/earth/index.html.
// - Resolve /showroom/globe/earth/ route.
// - Draw a self-contained procedural Earth reference canvas.
// - No external image. No JPG. No generated image. No missing asset dependency.

(() => {
  "use strict";

  const CONTRACT = "EARTH_ROUTE_HTML_JS_PAIR_RENEWAL_TNT_v1";
  const VERSION = "2026-05-08.earth-route-html-js-pair-renewal";
  const RECEIPT = "EARTH_ROUTE_CONTROLLER_RECEIPT";

  const TAU = Math.PI * 2;

  const state = {
    booted: false,
    raf: 0,
    mount: null,
    canvas: null,
    ctx: null,
    resizeObserver: null,
    width: 0,
    height: 0
  };

  function stamp(status) {
    document.documentElement.dataset.earthRouteControllerLoaded = "true";
    document.documentElement.dataset.earthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.earthRouteControllerVersion = VERSION;
    document.documentElement.dataset.earthRouteControllerStatus = status;
    document.documentElement.dataset.earthExpectedRoute = "/showroom/globe/earth/";
    document.documentElement.dataset.earthHtmlOwner = "/showroom/globe/earth/index.html";
    document.documentElement.dataset.earthJsOwner = "/showroom/globe/earth/index.js";
    document.documentElement.dataset.earthExternalImages = "false";
    document.documentElement.dataset.earthGeneratedImage = "false";
  }

  function ensureMount() {
    let mount = document.getElementById("earthCanvasMount");

    if (!mount) {
      const main = document.getElementById("earth-main") || document.querySelector("main") || document.body;
      mount = document.createElement("section");
      mount.id = "earthCanvasMount";
      mount.dataset.earthMount = "";
      mount.dataset.earthRender = "";
      mount.dataset.render = "earth";
      mount.dataset.planet = "earth";
      mount.dataset.body = "earth";
      mount.dataset.contract = CONTRACT;
      mount.dataset.earthMountReady = "true";
      mount.setAttribute("aria-label", "Earth canvas render mount");
      main.appendChild(mount);
    }

    mount.dataset.earthMountReady = "true";
    mount.dataset.earthRouteController = CONTRACT;
    mount.dataset.earthRouteControllerReceipt = RECEIPT;

    return mount;
  }

  function installStyle() {
    const prior = document.getElementById("earth-route-controller-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "earth-route-controller-style";
    style.textContent = `
      #earthCanvasMount {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 280px;
        overflow: hidden;
        isolation: isolate;
      }

      #earthCanvasMount canvas[data-earth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        touch-action: manipulation;
      }
    `;

    document.head.appendChild(style);
  }

  function resize() {
    if (!state.mount || !state.canvas) return;

    const rect = state.mount.getBoundingClientRect();
    const size = Math.max(280, Math.floor(Math.min(rect.width || 280, rect.height || rect.width || 280)));
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    state.width = Math.floor(size * dpr);
    state.height = Math.floor(size * dpr);

    state.canvas.width = state.width;
    state.canvas.height = state.height;
  }

  function drawBackplate(ctx, w, h, time) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.04, w * 0.5, h * 0.5, w * 0.7);
    bg.addColorStop(0, "rgba(40,82,116,0.40)");
    bg.addColorStop(0.56, "rgba(11,27,48,0.82)");
    bg.addColorStop(1, "rgba(2,7,14,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.001);

    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.39 + i * 0.035), 0, TAU);
      ctx.strokeStyle = `rgba(103,174,229,${0.08 - i * 0.016 + pulse * 0.012})`;
      ctx.lineWidth = Math.max(1, w * (0.006 - i * 0.001));
      ctx.stroke();
    }
  }

  function drawEarth(ctx, w, h, time) {
    const cx = w * 0.5;
    const cy = h * 0.505;
    const r = Math.min(w, h) * 0.405;
    const spin = time * 0.00008;

    const ocean = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.24, r * 0.05, cx, cy, r);
    ocean.addColorStop(0, "#2d91cb");
    ocean.addColorStop(0.35, "#0b5f99");
    ocean.addColorStop(0.72, "#053b70");
    ocean.addColorStop(1, "#021b3a");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const land = [
      { x: -0.46, y: -0.18, sx: 0.24, sy: 0.34, rot: -0.35 },
      { x: -0.35, y: 0.22, sx: 0.16, sy: 0.32, rot: 0.18 },
      { x: 0.08, y: -0.02, sx: 0.20, sy: 0.38, rot: -0.08 },
      { x: 0.38, y: -0.25, sx: 0.42, sy: 0.24, rot: 0.12 },
      { x: 0.48, y: 0.18, sx: 0.22, sy: 0.20, rot: 0.18 },
      { x: 0.30, y: 0.44, sx: 0.18, sy: 0.10, rot: -0.20 }
    ];

    land.forEach((p, i) => {
      const sx = Math.sin(spin + i * 1.4) * 0.10;
      const px = cx + (p.x + sx) * r;
      const py = cy + p.y * r;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot + Math.sin(spin * 0.5 + i) * 0.06);
      ctx.scale(p.sx * r, p.sy * r);

      const grad = ctx.createRadialGradient(-0.2, -0.2, 0.05, 0, 0, 1);
      grad.addColorStop(0, "rgba(185,176,118,0.96)");
      grad.addColorStop(0.45, "rgba(90,136,90,0.95)");
      grad.addColorStop(1, "rgba(112,91,54,0.88)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 1, 1, 0, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = "rgba(84,210,218,0.38)";
      ctx.lineWidth = 0.08;
      ctx.stroke();
      ctx.restore();
    });

    for (let i = 0; i < 8; i += 1) {
      const y = cy - r * 0.55 + i * r * 0.16;
      const phase = spin * 2 + i * 0.8;

      ctx.beginPath();
      for (let x = cx - r * 0.9; x <= cx + r * 0.9; x += r * 0.08) {
        const yy = y + Math.sin((x / r) * 3 + phase) * r * 0.025;
        if (x === cx - r * 0.9) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }

      ctx.strokeStyle = "rgba(238,246,255,0.10)";
      ctx.lineWidth = Math.max(1, r * 0.012);
      ctx.stroke();
    }

    const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.38, r * 0.08, cx + r * 0.22, cy + r * 0.18, r * 1.05);
    shade.addColorStop(0, "rgba(255,255,255,0.18)");
    shade.addColorStop(0.48, "rgba(255,255,255,0)");
    shade.addColorStop(0.78, "rgba(0,16,42,0.20)");
    shade.addColorStop(1, "rgba(0,5,16,0.72)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.002, 0, TAU);
    ctx.strokeStyle = "rgba(116,207,255,0.40)";
    ctx.lineWidth = Math.max(1, r * 0.015);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.06, 0, TAU);
    ctx.strokeStyle = "rgba(91,174,236,0.16)";
    ctx.lineWidth = Math.max(1, r * 0.030);
    ctx.stroke();
    ctx.restore();
  }

  function frame(time) {
    if (!state.ctx || !state.width || !state.height) {
      state.raf = requestAnimationFrame(frame);
      return;
    }

    drawBackplate(state.ctx, state.width, state.height, time);
    drawEarth(state.ctx, state.width, state.height, time);

    state.raf = requestAnimationFrame(frame);
  }

  function exposeReceipt() {
    window.EARTH_ROUTE_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      expectedRoute: "/showroom/globe/earth/",
      htmlOwner: "/showroom/globe/earth/index.html",
      jsOwner: "/showroom/globe/earth/index.js",
      mount: "#earthCanvasMount",
      externalImages: false,
      generatedImage: false,
      status: "booted"
    });
  }

  function boot() {
    if (state.booted) return;

    state.booted = true;
    stamp("booting");
    installStyle();

    const mount = ensureMount();
    mount.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.earthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Earth procedural route canvas");

    mount.appendChild(canvas);

    state.mount = mount;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

    state.resizeObserver = new ResizeObserver(resize);
    state.resizeObserver.observe(mount);
    window.addEventListener("resize", resize, { passive: true });

    exposeReceipt();
    resize();

    stamp("ready");
    document.body.dataset.earthRouteReady = "true";

    state.raf = requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
