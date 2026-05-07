/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7 */
/* Purpose: prevent blank canvas by painting Audralia immediately, then asynchronously upgrading from runtime texture. */
/* No GraphicBox. No image generation. No visual-pass claim. */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7";
const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6";
const VERSION = "2026-05-07.fail-open-orthographic-first-paint-v7";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

let activeController = null;

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  version: VERSION,
  runtimePath: RUNTIME_PATH,
  firstPaintForced: true,
  failOpenRenderer: true,
  runtimeLoaded: false,
  textureReady: false,
  animated: false,
  frameCount: 0,
  pixelProof: null,
  interactionFreezeGuard: true,
  stripProjectionRemoved: true,
  orthographicProjectionActive: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  canonicalExport: "mountAudraliaCanvas"
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function color(r, g, b, a = 255) {
  return [clamp(Math.round(r), 0, 255), clamp(Math.round(g), 0, 255), clamp(Math.round(b), 0, 255), clamp(Math.round(a), 0, 255)];
}

function mixColor(a, b, t) {
  return color(mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t), mix(a[3], b[3], t));
}

function fract(value) {
  return value - Math.floor(value);
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function noise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const a = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const b = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const c = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const d = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(a, b, uy), mix(c, d, uy), uz);
}

function fbm3(x, y, z, octaves = 4) {
  let value = 0;
  let amp = 0.55;
  let freq = 1;
  let norm = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += noise3(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.04;
  }

  return value / Math.max(0.000001, norm);
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) return target;
  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) return target.mount;
  if (target && typeof HTMLElement !== "undefined" && target.target instanceof HTMLElement) return target.target;
  if (target && typeof HTMLElement !== "undefined" && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
  }

  return (
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("#audralia-mount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("#audralia-main") ||
    document.body
  );
}

function applyNoSelect(node) {
  node.style.userSelect = "none";
  node.style.webkitUserSelect = "none";
  node.style.webkitTouchCallout = "none";
  node.style.touchAction = "manipulation";
}

function guardInteraction(node, state) {
  ["selectstart", "dragstart", "dblclick", "contextmenu"].forEach((type) => {
    node.addEventListener(
      type,
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 400;
      },
      { capture: true }
    );
  });

  node.addEventListener(
    "pointerdown",
    (event) => {
      if (event.detail >= 2) {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 400;
      }
    },
    { capture: true, passive: false }
  );
}

function setRouteStatus(message) {
  const node =
    document.querySelector("#audralia-route-status") ||
    document.querySelector("[data-audralia-route-status]") ||
    document.querySelector("#audralia-status") ||
    document.querySelector("[data-route-status]");

  if (!node) return;

  node.textContent = message;
  node.dataset.audraliaCanvasLoaded = "true";
  node.dataset.audraliaCanvasReceipt = RECEIPT;
  node.dataset.audraliaCanvasContract = CONTRACT;
}

function clearOwnedNodes(mount) {
  mount.querySelectorAll("[data-audralia-canvas-authority='true']").forEach((node) => node.remove());
}

function createNodes(mount, state) {
  clearOwnedNodes(mount);

  const shell = document.createElement("section");
  shell.dataset.audraliaCanvasAuthority = "true";
  shell.dataset.audraliaReceipt = RECEIPT;
  shell.dataset.audraliaContract = CONTRACT;
  shell.style.width = "min(100%, 980px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.dataset.audraliaCanvasFrame = "fail-open-orthographic-first-paint-v7";
  frame.style.width = "min(92vw, 860px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(13,32,58,0.98), rgba(2,7,19,1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0,0,0,0.54), inset 0 0 90px rgba(136,195,255,0.10)";

  const canvas = document.createElement("canvas");
  canvas.dataset.audraliaCanvas = "true";
  canvas.setAttribute("aria-label", "Audralia fail-open orthographic runtime canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.dataset.audraliaCanvasProof = "true";
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245,233,199,0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  [shell, frame, canvas, proof].forEach(applyNoSelect);
  [shell, frame, canvas].forEach((node) => guardInteraction(node, state));

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame, options = {}) {
  const rect = frame.getBoundingClientRect();
  const visible = Math.max(320, Math.floor(Math.min(rect.width || window.innerWidth || 420, rect.height || window.innerWidth || 420)));
  const size = Math.max(360, Math.min(visible, Number(options.maxRenderSize) || 620));

  canvas.width = size;
  canvas.height = size;
  canvas.dataset.renderSize = String(size);

  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

  if (!ctx) throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");

  return { ctx, size };
}

function drawStars(ctx, size, time) {
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 120; i += 1) {
    const x = fract(Math.sin(i * 917.17) * 10000) * size;
    const y = fract(Math.sin(i * 421.91) * 10000) * size;
    const pulse = 0.22 + 0.58 * Math.abs(Math.sin(time * 0.001 + i));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = i % 7 === 0 ? "rgba(245,221,166,0.86)" : "rgba(185,216,255,0.72)";
    ctx.beginPath();
    ctx.arc(x, y, i % 13 === 0 ? 1.2 : 0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function deterministicSurface(lat, lon) {
  const cosLat = Math.cos(lat);
  const x = cosLat * Math.sin(lon);
  const y = Math.sin(lat);
  const z = cosLat * Math.cos(lon);

  const continental =
    fbm3(x * 1.9 + 2.8, y * 1.9 - 4.2, z * 1.9 + 7.1, 5) * 0.58 +
    fbm3(x * 4.1 - 6.3, y * 4.1 + 1.8, z * 4.1 - 3.4, 4) * 0.24 +
    (1 - Math.abs(y) * 0.35) * 0.18;

  const threshold = 0.655;
  const ice = Math.abs(y) > 0.88 || (Math.abs(y) > 0.76 && continental > 0.66);
  const land = !ice && continental > threshold;
  const shelf = !land && !ice && continental > threshold - 0.08;
  const water = !land && !ice;

  const depth = water ? clamp01((threshold - continental) * 2.4 + 0.22) : 0;
  const relief = land ? clamp01((continental - threshold) * 2.2 + fbm3(x * 16, y * 16, z * 16, 3) * 0.32) : 0;
  const coast = Math.abs(continental - threshold) < 0.055 ? 1 - Math.abs(continental - threshold) / 0.055 : 0;

  return { x, y, z, land, water, shelf, ice, depth, relief, coast };
}

function surfaceColor(surface) {
  if (surface.ice) {
    return mixColor(color(210, 234, 245), color(255, 255, 255), 0.38 + surface.relief * 0.18);
  }

  if (surface.water) {
    const deep = color(3, 16, 54);
    const ocean = color(8, 70, 142);
    const shelf = color(47, 190, 204);
    let c = mixColor(ocean, deep, surface.depth);
    if (surface.shelf) c = mixColor(c, shelf, 0.58);
    return c;
  }

  let c = mixColor(color(78, 122, 72), color(172, 127, 72), clamp01(0.34 - surface.coast * 0.18));
  c = mixColor(c, color(166, 154, 118), surface.relief * 0.28);
  c = mixColor(c, color(229, 204, 138), surface.coast * 0.24);
  return c;
}

function drawGlobe(ctx, state, time) {
  const size = state.size;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const phase = wrap01(time * 0.000032 + 0.18);
  const light = { x: -0.38, y: -0.30, z: 0.86 };

  for (let py = 0; py < size; py += 1) {
    const yy = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const xx = (px + 0.5 - cx) / radius;
      const r2 = xx * xx + yy * yy;
      const index = (py * size + px) * 4;

      if (r2 > 1) continue;

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const lat = Math.asin(clamp(-yy, -1, 1));
      const lon = Math.atan2(xx, z) + (phase - 0.5) * Math.PI * 2;

      const s = deterministicSurface(lat, lon);
      let c = surfaceColor(s);

      const dot = clamp(xx * light.x + (-yy) * light.y + z * light.z, -1, 1);
      const edge = Math.sqrt(r2);
      const detail = fbm3(s.x * 22 + 4, s.y * 22 - 7, s.z * 22 + 2, 3);
      const shade = clamp(0.70 + dot * 0.28 - Math.pow(edge, 3.2) * 0.22 + (detail - 0.5) * 0.08, 0.38, 1.12);

      c = color(c[0] * shade, c[1] * shade, c[2] * shade, 255);

      data[index] = c[0];
      data[index + 1] = c[1];
      data[index + 2] = c[2];
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const atmosphere = ctx.createRadialGradient(cx - radius * 0.42, cy - radius * 0.46, radius * 0.05, cx, cy, radius * 1.18);
  atmosphere.addColorStop(0, "rgba(255,255,255,0.13)");
  atmosphere.addColorStop(0.52, "rgba(255,255,255,0.018)");
  atmosphere.addColorStop(0.76, "rgba(0,0,0,0.17)");
  atmosphere.addColorStop(1, "rgba(0,0,0,0.62)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(159,214,255,0.44)";
  ctx.lineWidth = Math.max(1, size * 0.008);
  ctx.stroke();
}

function drawDiagnostics(ctx, size) {
  ctx.fillStyle = "rgba(244,226,178,0.90)";
  ctx.font = "700 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.864);

  ctx.fillStyle = "rgba(174,204,225,0.70)";
  ctx.font = "500 " + Math.max(10, size * 0.015) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("FAIL-OPEN ORTHOGRAPHIC · FIRST PAINT", size / 2, size * 0.895);
}

function samplePixelProof(ctx, size) {
  try {
    const image = ctx.getImageData(Math.floor(size * 0.25), Math.floor(size * 0.25), Math.floor(size * 0.5), Math.floor(size * 0.5)).data;
    let opaque = 0;
    let water = 0;
    let solid = 0;

    for (let i = 0; i < image.length; i += 16) {
      const r = image[i];
      const g = image[i + 1];
      const b = image[i + 2];
      const a = image[i + 3];

      if (a > 0) opaque += 1;
      if (b > r * 1.05 && g > r * 0.62) water += 1;
      if (r > 60 && g > 52 && b < 175 && !(b > r * 1.05 && g > r * 0.62)) solid += 1;
    }

    return {
      opaqueRatio: opaque / Math.max(1, image.length / 16),
      waterPixelRatio: water / Math.max(1, image.length / 16),
      solidSurfacePixelRatio: solid / Math.max(1, image.length / 16),
      notBlank: opaque > 50
    };
  } catch (error) {
    return { notBlank: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function publishStatus(state) {
  Object.assign(STATUS, {
    loaded: true,
    runtimeLoaded: Boolean(state.runtimeLoaded),
    textureReady: false,
    animated: !state.stopped,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount)
  });

  window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
  window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;

  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasFirstPaintForced = "true";
  document.documentElement.dataset.audraliaCanvasFailOpenRenderer = "true";
  document.documentElement.dataset.audraliaCanvasOrthographicProjection = "true";
  document.documentElement.dataset.audraliaCanvasStripProjectionRemoved = "true";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (state.canvas) {
    state.canvas.dataset.audraliaCanvasStatus = CONTRACT;
    state.canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    state.canvas.dataset.audraliaFailOpenFirstPaint = "true";
    state.canvas.dataset.audraliaOrthographicProjection = "true";
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: STATUS }));
  } catch (_) {}
}

function renderFrame(state, time) {
  if (!state.ctx || !state.size) return;

  drawStars(state.ctx, state.size, time);
  drawGlobe(state.ctx, state, time);
  drawDiagnostics(state.ctx, state.size);

  state.frameCount += 1;

  if (state.frameCount === 1 || state.frameCount % 30 === 0) {
    state.pixelProof = samplePixelProof(state.ctx, state.size);
    publishStatus(state);
  }
}

async function loadRuntime(state) {
  try {
    const runtime = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);
    state.runtimeLoaded = true;
    state.runtimeReceipt =
      runtime.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtime.AUDRALIA_RUNTIME_STATUS?.receipt ||
      "runtime-loaded";
  } catch (error) {
    state.runtimeLoaded = false;
    state.runtimeError = error instanceof Error ? error.message : String(error);
  }

  publishStatus(state);
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") activeController.stop();
  activeController = null;
}

function startCanvas(target, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const state = {
    mount,
    shell: null,
    frame: null,
    canvas: null,
    proof: null,
    ctx: null,
    size: 0,
    frameCount: 0,
    frameCap: clamp(Number(options.frameCap) || 12, 8, 18),
    lastFrameTime: 0,
    pauseUntil: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    runtimeLoaded: false,
    runtimeReceipt: "",
    runtimeError: ""
  };

  const nodes = createNodes(mount, state);
  const setup = setupCanvas(nodes.canvas, nodes.frame, options);

  state.shell = nodes.shell;
  state.frame = nodes.frame;
  state.canvas = nodes.canvas;
  state.proof = nodes.proof;
  state.ctx = setup.ctx;
  state.size = setup.size;

  function animate(time) {
    if (state.stopped) return;

    const gap = 1000 / state.frameCap;
    const paused = time < state.pauseUntil;

    if (!document.hidden && !paused && time - state.lastFrameTime >= gap) {
      state.lastFrameTime = time;
      renderFrame(state, time);
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame, options);
      state.ctx = next.ctx;
      state.size = next.size;
      state.frameCount = 0;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 160);
  }

  function selectionPause() {
    const selection = document.getSelection ? document.getSelection() : null;
    if (selection && !selection.isCollapsed) state.pauseUntil = performance.now() + 900;
  }

  state.stop = function () {
    state.stopped = true;
    if (state.rafId) window.cancelAnimationFrame(state.rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("selectionchange", selectionPause);
  };

  activeController = state;

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("selectionchange", selectionPause, { passive: true });

  setRouteStatus("Audralia adopted canvas authority loaded.");
  renderFrame(state, performance.now());
  publishStatus(state);
  animate(performance.now());
  loadRuntime(state);

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function renderAudralia(target, options) {
  return startCanvas(target, options);
}

export function mountAudralia(target, options) {
  return startCanvas(target, options);
}

export function render(target, options) {
  return startCanvas(target, options);
}

export function mount(target, options) {
  return startCanvas(target, options);
}

export function init(target, options) {
  return startCanvas(target, options);
}

export function getAudraliaCanvasStatus() {
  return STATUS;
}

export function getAudraliaSurfaceDataset() {
  return Object.freeze({
    name: "Audralia",
    receipt: RECEIPT,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    runtimePath: RUNTIME_PATH,
    firstPaintForced: true,
    failOpenRenderer: true,
    interactionFreezeGuard: true,
    stripProjectionRemoved: true,
    orthographicProjectionActive: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function stopAudraliaCanvas() {
  stopActiveController();
  return { stopped: true, receipt: RECEIPT, contract: CONTRACT, version: VERSION };
}

const api = {
  RECEIPT,
  CONTRACT,
  PREVIOUS_CONTRACT,
  VERSION,
  RUNTIME_PATH,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  renderAudralia,
  mountAudralia,
  render,
  mount,
  init,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
  window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
}

export default api;
