/* /products/index.compositor.js
   PRODUCTS_COMPASS_REAR_CENTER_FRONT_COMPOSITOR_v1
   Donor architecture: ARCHCOIN camera/depth-layer orchestration.
   Products adaptation: existing renderer remains the rear witness; a clipped
   front pass is reconstructed from the same rendered pixels for nodes whose
   projected depth places them in front of the fixed Main Compass plane.
*/
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_COMPASS_COMPOSITOR";
  const RECEIPT = "DGB_PRODUCTS_COMPASS_COMPOSITOR_RECEIPT";
  const ROOT = '[data-page-id="products"]';
  const SCENE = "[data-products-scene]";
  const SEMANTIC = "[data-products-semantic]";
  const SOURCE = "canvas[data-products-crystals-canvas]";
  const FRONT_ATTR = "data-products-front-crystals-canvas";
  const FRONT_ENTER = 0.56;
  const FRONT_EXIT = 0.50;

  if (globalThis[MODULE]?.initialized) return;

  const state = {
    initialized: false,
    root: null,
    scene: null,
    semantic: null,
    source: null,
    front: null,
    context: null,
    raf: 0,
    dpr: 1,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    depthClass: new Map(),
    frameCount: 0,
    lastError: ""
  };

  function publish(status, extra = {}) {
    const receipt = Object.freeze({
      module: MODULE,
      contract: "PRODUCTS_COMPASS_REAR_CENTER_FRONT_COMPOSITOR_v1",
      donor: "/products/archcoin/index.compositor.js",
      status,
      initialized: state.initialized,
      rearCanvas: Boolean(state.source),
      centerCompass: Boolean(state.scene?.querySelector("[data-products-center-layer]")),
      frontCanvas: Boolean(state.front),
      semanticLayer: Boolean(state.semantic),
      measuredCenter: Object.freeze([state.centerX, state.centerY]),
      frontNodeCount: Array.from(state.depthClass.values()).filter(Boolean).length,
      frameCount: state.frameCount,
      lastError: state.lastError,
      visualPassClaimed: false,
      ...extra
    });
    globalThis[RECEIPT] = receipt;
    if (state.root) {
      state.root.dataset.productsCompositorStatus = status;
      state.root.dataset.productsCompassCenter = `${state.centerX.toFixed(2)},${state.centerY.toFixed(2)}`;
      state.root.dataset.productsDepthComposition = "rear-center-front-semantic";
    }
    return receipt;
  }

  function createFrontCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute(FRONT_ATTR, "true");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.pointerEvents = "none";
    state.scene.append(canvas);
    return canvas;
  }

  function activeProducts() {
    return Array.from(state.semantic.querySelectorAll("[data-products-product]"))
      .filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true")
      .map(element => {
        const sceneRect = state.scene.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        const x = rect.left - sceneRect.left + rect.width / 2;
        const y = rect.top - sceneRect.top + rect.height / 2;
        const depth = Number.parseFloat(element.dataset.depth || "0");
        return {
          element,
          id: element.dataset.productId || element.dataset.destinationId || "",
          x,
          y,
          depth: Number.isFinite(depth) ? depth : 0,
          radius: Math.max(54, Math.min(112, Math.max(rect.width, rect.height) * 1.25))
        };
      })
      .filter(node => Number.isFinite(node.x) && Number.isFinite(node.y));
  }

  function measureCenter(nodes) {
    if (!nodes.length) return;
    const xs = nodes.map(node => node.x).sort((a, b) => a - b);
    const ys = nodes.map(node => node.y).sort((a, b) => a - b);
    const measuredX = (xs[0] + xs[xs.length - 1]) / 2;
    const measuredY = (ys[0] + ys[ys.length - 1]) / 2;
    const smoothing = state.frameCount < 12 ? 1 : 0.16;
    state.centerX += (measuredX - state.centerX) * smoothing;
    state.centerY += (measuredY - state.centerY) * smoothing;
    state.scene.style.setProperty("--products-compass-x", `${state.centerX}px`);
    state.scene.style.setProperty("--products-compass-y", `${state.centerY}px`);
  }

  function classify(node) {
    const previous = state.depthClass.get(node.id) || false;
    const next = previous ? node.depth >= FRONT_EXIT : node.depth >= FRONT_ENTER;
    state.depthClass.set(node.id, next);
    node.element.dataset.productsDepthLayer = next ? "front" : "rear";
    return next;
  }

  function resize() {
    const rect = state.scene.getBoundingClientRect();
    const dpr = Math.min(2, Math.max(1, globalThis.devicePixelRatio || 1));
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    state.dpr = dpr;
    state.width = rect.width;
    state.height = rect.height;
    if (state.front.width !== width || state.front.height !== height) {
      state.front.width = width;
      state.front.height = height;
      state.front.style.width = `${rect.width}px`;
      state.front.style.height = `${rect.height}px`;
    }
  }

  function drawFront(nodes) {
    const ctx = state.context;
    const source = state.source;
    if (!source.width || !source.height) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, state.front.width, state.front.height);
    const sx = source.width / Math.max(1, state.width);
    const sy = source.height / Math.max(1, state.height);
    const dx = state.front.width / Math.max(1, state.width);
    const dy = state.front.height / Math.max(1, state.height);

    nodes.filter(classify).forEach(node => {
      const sourceRadiusX = node.radius * sx;
      const sourceRadiusY = node.radius * sy;
      const destinationRadiusX = node.radius * dx;
      const destinationRadiusY = node.radius * dy;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(node.x * dx, node.y * dy, destinationRadiusX, destinationRadiusY, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        source,
        node.x * sx - sourceRadiusX,
        node.y * sy - sourceRadiusY,
        sourceRadiusX * 2,
        sourceRadiusY * 2,
        node.x * dx - destinationRadiusX,
        node.y * dy - destinationRadiusY,
        destinationRadiusX * 2,
        destinationRadiusY * 2
      );
      ctx.restore();
    });
  }

  function frame() {
    try {
      if (!state.source?.isConnected) {
        state.source = state.scene.querySelector(SOURCE);
      }
      resize();
      const nodes = activeProducts();
      if (nodes.length >= 2) measureCenter(nodes);
      if (state.source) drawFront(nodes);
      state.frameCount += 1;
      if (state.frameCount === 1 || state.frameCount % 120 === 0) publish("available");
      state.raf = requestAnimationFrame(frame);
    } catch (error) {
      state.lastError = error?.message || String(error);
      publish("held");
      state.raf = requestAnimationFrame(frame);
    }
  }

  function init() {
    state.root = document.querySelector(ROOT);
    state.scene = state.root?.querySelector(SCENE) || null;
    state.semantic = state.root?.querySelector(SEMANTIC) || null;
    if (!state.root || !state.scene || !state.semantic) return;
    state.source = state.scene.querySelector(SOURCE);
    state.front = createFrontCanvas();
    state.context = state.front.getContext("2d", { alpha: true, desynchronized: true });
    if (!state.context) {
      state.lastError = "PRODUCTS_FRONT_CANVAS_2D_CONTEXT_UNAVAILABLE";
      publish("held");
      return;
    }
    const rect = state.scene.getBoundingClientRect();
    state.centerX = rect.width / 2;
    state.centerY = rect.height / 2;
    state.initialized = true;
    globalThis[MODULE] = Object.freeze({
      initialized: true,
      receipt: () => globalThis[RECEIPT],
      stop: () => {
        if (state.raf) cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
    });
    publish("available", { lastAction: "initialized" });
    state.raf = requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
