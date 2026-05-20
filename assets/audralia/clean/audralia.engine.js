// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_CLEAN_CANVAS_ENGINE_MOUNT_CONTRACT_TNT_v1
// Full-file replacement.
// Purpose: expose a mountable AUDRALIA_ENGINE contract for the Audralia route bridge.
// This file owns the visible clean-canvas form handoff.
// It does not modify the parent Globe route.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_ENGINE_MOUNT_CONTRACT_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_ENGINE_MOUNT_RECEIPT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-clean-canvas-engine-mount-contract-v1";

  const state = {
    mounted: false,
    mountedAt: null,
    mountCount: 0,
    lastCanvas: null,
    lastRoot: null,
    lastMount: null,
    lastReceipt: null
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function doc(context) {
    return context?.document || (typeof document !== "undefined" ? document : null);
  }

  function now() {
    return new Date().toISOString();
  }

  function isElement(value) {
    const ElementCtor = win().Element;
    return Boolean(ElementCtor && value instanceof ElementCtor);
  }

  function resolveMount(input) {
    if (isElement(input)) return input;

    if (isElement(input?.mount)) return input.mount;
    if (isElement(input?.mountTarget)) return input.mountTarget;
    if (isElement(input?.target)) return input.target;

    const documentRef = doc(input);

    return (
      documentRef?.getElementById?.("audralia-clean-canvas-mount") ||
      documentRef?.querySelector?.("[data-audralia-clean-canvas-mount]") ||
      null
    );
  }

  function makeEl(documentRef, tag, className, attrs = {}) {
    const el = documentRef.createElement(tag);
    if (className) el.className = className;

    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }

    return el;
  }

  function styleRoot(root) {
    root.style.cssText = `
      width:100%;
      min-height:24rem;
      display:grid;
      place-items:center;
      position:relative;
      isolation:isolate;
      overflow:hidden;
      border-radius:1.25rem;
      background:
        radial-gradient(circle at 50% 35%,rgba(143,240,195,.16),transparent 16rem),
        radial-gradient(circle at 50% 58%,rgba(36,120,255,.10),transparent 24rem),
        linear-gradient(180deg,rgba(1,7,16,.26),rgba(1,4,12,.72));
    `;
  }

  function styleCanvas(canvas) {
    canvas.style.cssText = `
      width:min(78vw,28rem);
      height:min(78vw,28rem);
      max-width:100%;
      display:block;
      border-radius:50%;
      filter:
        drop-shadow(0 0 2.4rem rgba(143,240,195,.20))
        drop-shadow(0 1.8rem 2.4rem rgba(0,0,0,.42));
      touch-action:none;
    `;
  }

  function styleLabel(label) {
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(86%,24rem);
      padding:.78rem .9rem;
      border:1px solid rgba(143,240,195,.26);
      border-radius:1rem;
      background:rgba(1,7,16,.76);
      color:rgba(255,244,216,.94);
      font:850 .72rem/1.35 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      letter-spacing:.075em;
      text-align:center;
      text-transform:uppercase;
      backdrop-filter:blur(8px);
      z-index:5;
      pointer-events:none;
    `;
  }

  function drawAudralia(canvas) {
    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(260, Math.min(rect.width || 420, 520));
    const dpr = Math.max(1, Math.min(2.5, win().devicePixelRatio || 1));
    const size = Math.round(cssSize * dpr);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return false;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.43;

    const atmosphere = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.42, r * 0.05, cx, cy, r * 1.13);
    atmosphere.addColorStop(0, "rgba(255,255,255,0.26)");
    atmosphere.addColorStop(0.28, "rgba(143,240,195,0.18)");
    atmosphere.addColorStop(0.62, "rgba(36,120,255,0.10)");
    atmosphere.addColorStop(1, "rgba(143,240,195,0)");

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fillStyle = atmosphere;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.48, r * 0.08, cx + r * 0.18, cy + r * 0.22, r * 1.12);
    ocean.addColorStop(0, "rgba(232,255,237,0.82)");
    ocean.addColorStop(0.10, "rgba(143,240,195,0.72)");
    ocean.addColorStop(0.28, "rgba(35,150,123,0.76)");
    ocean.addColorStop(0.48, "rgba(13,78,82,0.88)");
    ocean.addColorStop(0.72, "rgba(4,31,50,0.96)");
    ocean.addColorStop(1, "rgba(1,8,22,1)");

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    drawLandMass(ctx, size, cx, cy, r, [
      [-0.62, -0.18],
      [-0.45, -0.42],
      [-0.18, -0.48],
      [0.02, -0.32],
      [-0.06, -0.05],
      [-0.30, 0.06],
      [-0.52, 0.02]
    ], "rgba(184,174,111,0.72)", "rgba(88,116,72,0.62)");

    drawLandMass(ctx, size, cx, cy, r, [
      [0.02, -0.04],
      [0.30, -0.28],
      [0.64, -0.18],
      [0.72, 0.16],
      [0.42, 0.38],
      [0.08, 0.26],
      [-0.06, 0.08]
    ], "rgba(126,164,93,0.74)", "rgba(59,116,86,0.66)");

    drawLandMass(ctx, size, cx, cy, r, [
      [-0.48, 0.36],
      [-0.22, 0.22],
      [0.02, 0.38],
      [-0.04, 0.62],
      [-0.34, 0.58]
    ], "rgba(208,180,104,0.55)", "rgba(78,112,83,0.55)");

    drawLandMass(ctx, size, cx, cy, r, [
      [0.36, 0.46],
      [0.58, 0.36],
      [0.70, 0.56],
      [0.52, 0.72],
      [0.30, 0.64]
    ], "rgba(135,184,108,0.54)", "rgba(62,118,92,0.54)");

    drawSoftBand(ctx, cx, cy, r, -0.24, 0.18, "rgba(255,244,216,0.16)");
    drawSoftBand(ctx, cx, cy, r, 0.14, -0.16, "rgba(143,240,195,0.13)");
    drawSoftBand(ctx, cx, cy, r, 0.42, 0.10, "rgba(141,216,255,0.10)");

    const shade = ctx.createRadialGradient(cx - r * 0.24, cy - r * 0.26, r * 0.16, cx + r * 0.38, cy + r * 0.36, r * 1.04);
    shade.addColorStop(0, "rgba(255,255,255,0.16)");
    shade.addColorStop(0.34, "rgba(255,255,255,0.02)");
    shade.addColorStop(0.70, "rgba(0,0,0,0.20)");
    shade.addColorStop(1, "rgba(0,0,0,0.62)");

    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(235,255,245,0.18)";
    ctx.lineWidth = Math.max(1, size * 0.0032);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(143,240,195,0.20)";
    ctx.lineWidth = Math.max(1, size * 0.004);
    ctx.stroke();

    return true;
  }

  function drawLandMass(ctx, size, cx, cy, r, points, fillA, fillB) {
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, fillA);
    grad.addColorStop(1, fillB);

    ctx.beginPath();

    points.forEach(([x, y], index) => {
      const px = cx + x * r;
      const py = cy + y * r;

      if (index === 0) {
        ctx.moveTo(px, py);
      } else {
        const [prevX, prevY] = points[index - 1];
        const cpx = cx + ((prevX + x) / 2) * r;
        const cpy = cy + ((prevY + y) / 2) * r;
        ctx.quadraticCurveTo(cpx, cpy, px, py);
      }
    });

    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,244,216,0.16)";
    ctx.lineWidth = Math.max(1, size * 0.0022);
    ctx.stroke();
  }

  function drawSoftBand(ctx, cx, cy, r, yOffset, tilt, color) {
    ctx.save();
    ctx.translate(cx, cy + yOffset * r);
    ctx.rotate(tilt);
    ctx.scale(1, 0.22);

    const grad = ctx.createLinearGradient(-r, 0, r, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.20, color);
    grad.addColorStop(0.52, color);
    grad.addColorStop(0.84, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.98, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }

  function createRender(context) {
    const documentRef = doc(context);
    if (!documentRef) throw new Error("Document unavailable for Audralia engine render.");

    const root = makeEl(documentRef, "section", "audralia-engine-root", {
      "data-audralia-engine-render": "true",
      "data-audralia-clean-canvas-render": "true",
      "data-contract": CONTRACT
    });

    styleRoot(root);

    const canvas = makeEl(documentRef, "canvas", "audralia-engine-canvas", {
      "data-audralia-form": "engine-canvas",
      "aria-label": "Audralia clean-canvas planet form"
    });

    styleCanvas(canvas);

    const label = makeEl(documentRef, "div", "audralia-engine-label");
    styleLabel(label);
    label.textContent = "Audralia clean-canvas engine · form mounted";

    root.appendChild(canvas);
    root.appendChild(label);

    return { root, canvas, label };
  }

  function requestDraw(canvas) {
    const draw = () => drawAudralia(canvas);

    if (typeof win().requestAnimationFrame === "function") {
      win().requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 0);
    }
  }

  function installResizeRedraw(root, canvas) {
    if (!root || !canvas) return;

    if (typeof win().ResizeObserver === "function") {
      const observer = new (win().ResizeObserver)(() => requestDraw(canvas));
      observer.observe(root);
      return;
    }

    win().addEventListener?.("resize", () => requestDraw(canvas), { passive: true });
  }

  function mount(input) {
    const mountTarget = resolveMount(input);
    const documentRef = doc(input);

    if (!mountTarget) {
      throw new Error("Audralia engine mount target missing.");
    }

    if (!documentRef) {
      throw new Error("Audralia engine document missing.");
    }

    const render = createRender(input);

    mountTarget.replaceChildren(render.root);

    requestDraw(render.canvas);

    state.mounted = true;
    state.mountedAt = now();
    state.mountCount += 1;
    state.lastCanvas = render.canvas;
    state.lastRoot = render.root;
    state.lastMount = mountTarget;

    mountTarget.dataset.audraliaFormVisible = "true";
    mountTarget.dataset.audraliaEngineMounted = "true";
    mountTarget.dataset.audraliaEngineContract = CONTRACT;

    const statusTarget = input?.statusTarget;
    if (isElement(statusTarget)) {
      statusTarget.textContent = "FORM_VISIBLE · Audralia clean-canvas engine mounted.";
      statusTarget.dataset.state = "pass";
    }

    state.lastReceipt = buildReceipt(true);

    installResizeRedraw(render.root, render.canvas);

    return {
      element: render.root,
      canvas: render.canvas,
      contract: CONTRACT,
      receipt: state.lastReceipt
    };
  }

  function buildReceipt(valid) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,
      valid,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      ownsVisibleFormHandoff: true,
      ownsParentGlobeRoute: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      lastReceipt: state.lastReceipt,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: ROUTE,
    mount,
    render: mount,
    start: mount,
    boot: mount,
    init: mount,
    create: mount,
    getStatus
  });

  const global = win();

  global.AUDRALIA_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_AUTHORITY = AUDRALIA_ENGINE;
  global.AudraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.audraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.mountAudraliaCleanCanvas = mount;
  global.renderAudraliaCleanCanvas = mount;
  global.mountAudralia = mount;
  global.renderAudralia = mount;
})();
