import { createWorldRuntime } from "./world_runtime.js";
import { createPlanetProjection } from "./planet_projection.js";
import { renderGroundLayer } from "./ground_renderer.js";
import { renderEnvironmentLayer } from "./environment_renderer.js";

const META = Object.freeze({
  name: "SCENE",
  version: "G1_EXTERNAL_BASELINE",
  role: "canvas_scene_orchestrator",
  contract: "SCENE_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

function ensureCanvas(canvas) {
  if (canvas) return canvas;
  const next = document.createElement("canvas");
  next.id = "world-scene";
  next.style.display = "block";
  next.style.width = "100%";
  next.style.height = "100%";
  next.style.background = "#05070b";
  return next;
}

function sizeCanvas(canvas) {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round((rect.width || window.innerWidth) * dpr));
  const height = Math.max(1, Math.round((rect.height || window.innerHeight) * dpr));
  canvas.width = width;
  canvas.height = height;
  return { width, height, dpr };
}

export function createScene(config = {}) {
  const canvas = ensureCanvas(config.canvas || null);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("SCENE_2D_CONTEXT_UNAVAILABLE");

  const runtime = createWorldRuntime({
    sessionId: typeof config.sessionId === "string" ? config.sessionId : "SCENE_RUNTIME_SESSION"
  });

  const state = {
    running: false,
    frameId: 0,
    viewport: { width: canvas.width || 1280, height: canvas.height || 720, dpr: 1 },
    snapshot: null
  };

  function draw() {
    if (!state.snapshot) return;

    const projection = createPlanetProjection(
      state.viewport,
      state.snapshot.projection.projection
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#05070b");
    bg.addColorStop(1, "#08101a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderEnvironmentLayer(ctx, state.snapshot, projection);
    renderGroundLayer(ctx, state.snapshot, projection);
  }

  function frame() {
    if (!state.running) return;
    state.snapshot = runtime.update(state.viewport);
    draw();
    state.frameId = window.requestAnimationFrame(frame);
  }

  function resize() {
    state.viewport = sizeCanvas(canvas);
    state.snapshot = runtime.update(state.viewport);
    draw();
  }

  return {
    meta: META,

    mount(root) {
      if (root && canvas.parentNode !== root) {
        root.appendChild(canvas);
      }
      resize();
      return this;
    },

    start() {
      if (state.running) return this;
      state.running = true;
      state.snapshot = runtime.start(state.viewport);
      draw();
      state.frameId = window.requestAnimationFrame(frame);
      return this;
    },

    stop() {
      state.running = false;
      if (state.frameId) {
        window.cancelAnimationFrame(state.frameId);
        state.frameId = 0;
      }
      runtime.stop();
      return this;
    },

    resize,

    destroy() {
      this.stop();
      runtime.destroy();
    },

    getSnapshot() {
      return state.snapshot;
    },

    getCanvas() {
      return canvas;
    }
  };
}

export default {
  meta: META,
  createScene
};
