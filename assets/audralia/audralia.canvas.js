/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_CANARY */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1 */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1";
const VERSION = "2026-05-06.minimal-canary";

let activeController = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    return target;
  }

  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) {
    return target.mount;
  }

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
  }

  const selectors = [
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (let i = 0; i < selectors.length; i += 1) {
    const selected = document.querySelector(selectors[i]);
    if (selected) return selected;
  }

  return document.body;
}

function setRouteStatus(message) {
  const selectors = [
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ];

  for (let i = 0; i < selectors.length; i += 1) {
    const node = document.querySelector(selectors[i]);

    if (node) {
      node.textContent = message;
      node.setAttribute("data-audralia-canvas-loaded", "true");
      node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
      return;
    }
  }
}

function removeResidue() {
  const badText = {
    "Loading Audralia": true,
    "Audralia canvas authority import failed.": true,
    "Audralia canvas authority import failed. missing ) after argument list": true,
    "Canvas authority imported · no render export found": true,
    "Audralia canvas authority imported, but no render export was found.": true,
    "Audralia doorway is loading the current adopted canvas authority.": true
  };

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && badText[text]) {
      node.remove();
    }
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");

  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i].remove();
  }
}

function createCanvas(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.style.width = "min(100%, 920px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";

  const frame = document.createElement("div");
  frame.style.width = "min(92vw, 760px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "28px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.28)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(22, 55, 88, 0.95), rgba(2, 7, 19, 1) 70%)";
  frame.style.boxShadow = "0 28px 90px rgba(0, 0, 0, 0.48)";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia minimal canary canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.86)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return {
    shell: shell,
    frame: frame,
    canvas: canvas,
    proof: proof
  };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 720, 760);
  const size = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Audralia canvas context unavailable.");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return {
    ctx: ctx,
    size: size,
    ratio: ratio
  };
}

function drawStars(ctx, size, time) {
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i += 1) {
    const sx = Math.sin(i * 917.17) * 10000;
    const sy = Math.sin(i * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.35 + 0.5 * Math.abs(Math.sin(time * 0.001 + i));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = i % 7 === 0 ? "rgba(245, 221, 166, 0.85)" : "rgba(185, 216, 255, 0.70)";
    ctx.beginPath();
    ctx.arc(x, y, i % 11 === 0 ? 1.25 : 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawGlobe(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;
  const spin = time * 0.0012;

  const ocean = ctx.createRadialGradient(
    cx - radius * 0.35,
    cy - radius * 0.45,
    radius * 0.05,
    cx,
    cy,
    radius * 1.2
  );

  ocean.addColorStop(0, "rgba(150, 220, 255, 1)");
  ocean.addColorStop(0.35, "rgba(32, 118, 184, 1)");
  ocean.addColorStop(0.72, "rgba(5, 45, 98, 1)");
  ocean.addColorStop(1, "rgba(1, 12, 38, 1)");

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const landSets = [
    { x: -0.45, y: -0.05, w: 0.55, h: 0.34, fill: "rgba(95, 123, 87, 0.95)" },
    { x: 0.05, y: 0.00, w: 0.46, h: 0.30, fill: "rgba(133, 121, 86, 0.95)" },
    { x: -0.18, y: -0.52, w: 0.58, h: 0.24, fill: "rgba(218, 238, 244, 0.86)" },
    { x: -0.28, y: 0.42, w: 0.62, h: 0.26, fill: "rgba(115, 129, 104, 0.94)" },
    { x: 0.38, y: -0.20, w: 0.25, h: 0.42, fill: "rgba(120, 105, 83, 0.94)" }
  ];

  for (let i = 0; i < landSets.length; i += 1) {
    const land = landSets[i];
    const shift = Math.sin(spin + i) * radius * 0.18;

    ctx.fillStyle = land.fill;
    ctx.beginPath();
    ctx.ellipse(
      cx + land.x * radius + shift,
      cy + land.y * radius,
      land.w * radius,
      land.h * radius,
      spin * 0.4 + i,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "rgba(242, 218, 158, 0.34)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(238, 205, 125, 0.34)";
  ctx.lineWidth = 1.1;

  for (let j = 0; j < 6; j += 1) {
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      radius * (0.82 - j * 0.045),
      radius * (0.16 + j * 0.018),
      spin * 0.22 + j * 0.2,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();

  const atmosphere = ctx.createRadialGradient(
    cx - radius * 0.4,
    cy - radius * 0.45,
    radius * 0.05,
    cx,
    cy,
    radius * 1.18
  );

  atmosphere.addColorStop(0, "rgba(255, 255, 255, 0.12)");
  atmosphere.addColorStop(0.55, "rgba(255, 255, 255, 0.02)");
  atmosphere.addColorStop(0.78, "rgba(0, 0, 0, 0.14)");
  atmosphere.addColorStop(1, "rgba(0, 0, 0, 0.62)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(159, 214, 255, 0.52)";
  ctx.lineWidth = size * 0.012;
  ctx.stroke();
}

function drawLabel(ctx, size) {
  ctx.fillStyle = "rgba(244, 226, 178, 0.90)";
  ctx.font = "700 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.865);

  ctx.fillStyle = "rgba(174, 204, 225, 0.66)";
  ctx.font = "500 " + Math.max(10, size * 0.016) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("CANARY CANVAS AUTHORITY", size / 2, size * 0.895);
}

function samplePixelProof(ctx, size) {
  try {
    const sample = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;

    return {
      r: sample[0],
      g: sample[1],
      b: sample[2],
      a: sample[3],
      notBlank: sample[3] > 0 && sample[0] + sample[1] + sample[2] > 12
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state) {
  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    autoBoot: false,
    routeOwnsCall: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    canonicalExport: "mountAudraliaCanvas",
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: true,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof || null
  };

  window.__AUDRALIA_CANVAS_STATUS__ = status;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
  window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: status }));

  return status;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;

  ctx.clearRect(0, 0, size, size);
  drawStars(ctx, size, time);
  drawGlobe(ctx, size, time);
  drawLabel(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

function startCanvas(target, options) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvas(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    mount: mount,
    options: options || {},
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    resizeTimer: null
  };

  function animate(time) {
    if (state.stopped) return;

    renderFrame(state, time || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);

    state.resizeTimer = window.setTimeout(function () {
      const nextSetup = setupCanvas(state.canvas, state.frame);
      state.ctx = nextSetup.ctx;
      state.size = nextSetup.size;
      state.ratio = nextSetup.ratio;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function () {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;

  setRouteStatus("Audralia adopted canvas authority loaded.");
  publishStatus(state);
  animate(performance.now());

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function mountAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function render(target, options) {
  return startCanvas(target, options || {});
}

export function mount(target, options) {
  return startCanvas(target, options || {});
}

export function init(target, options) {
  return startCanvas(target, options || {});
}

export function getAudraliaCanvasStatus() {
  return window.__AUDRALIA_CANVAS_STATUS__ || {
    loaded: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    canonicalExport: "mountAudraliaCanvas"
  };
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION
  };
}

const api = {
  RECEIPT: RECEIPT,
  CONTRACT: CONTRACT,
  VERSION: VERSION,
  mountAudraliaCanvas: mountAudraliaCanvas,
  renderAudraliaCanvas: renderAudraliaCanvas,
  bootAudraliaCanvas: bootAudraliaCanvas,
  createAudraliaCanvas: createAudraliaCanvas,
  initAudraliaCanvas: initAudraliaCanvas,
  renderAudralia: renderAudralia,
  mountAudralia: mountAudralia,
  render: render,
  mount: mount,
  init: init,
  getAudraliaCanvasStatus: getAudraliaCanvasStatus,
  stopAudraliaCanvas: stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
}

export default api;
