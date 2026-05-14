// /assets/world/environment/scene.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_SKY_WATER_GROUND_MINIMAL_VISIBILITY_TNT_v1
// Purpose: draw only three visible fields: sky, water, ground.
// Forbidden here: Manor, foliage, rocks, path, flowers, birds, mountains, islets,
// clouds, foam detail, shimmer detail, texture detail, cinematic decoration.

export const ENVIRONMENT_SCENE_VERSION =
  "h-earth-sky-water-ground-minimal-visibility-v1";

export function createGroundEnvironmentScene(canvas, inputProfile = null, options = {}) {
  const ctx = canvas.getContext("2d", { alpha: false });

  const state = {
    running: false,
    raf: 0,
    receipt: null,
    lastSize: null
  };

  function resizeCanvas() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.5);
    const width = Math.max(options.minWidth || 720, Math.floor((box.width || 720) * dpr));
    const height = Math.max(options.minHeight || 900, Math.floor((box.height || 900) * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    state.lastSize = { width, height, dpr };
    return state.lastSize;
  }

  function draw() {
    if (!state.running) return;

    const { width, height } = resizeCanvas();

    const skyBottom = Math.round(height * 0.42);
    const waterBottom = Math.round(height * 0.62);

    ctx.clearRect(0, 0, width, height);

    drawSky(ctx, width, skyBottom);
    drawWater(ctx, width, skyBottom, waterBottom);
    drawGround(ctx, width, waterBottom, height);

    state.receipt = Object.freeze({
      sceneVersion: ENVIRONMENT_SCENE_VERSION,
      rendered: true,
      mode: "minimal",
      ownsOnly: ["sky", "water", "ground"],
      forbiddenRendered: {
        manor: false,
        foliage: false,
        rocks: false,
        path: false,
        flowers: false,
        birds: false,
        mountains: false,
        islets: false,
        clouds: false,
        shimmerDetail: false,
        foamDetail: false,
        textureDetail: false
      },
      bands: {
        sky: [0, skyBottom],
        water: [skyBottom, waterBottom],
        ground: [waterBottom, height]
      }
    });

    state.raf = requestAnimationFrame(draw);
  }

  return Object.freeze({
    start() {
      if (!ctx) throw new Error("Canvas 2D context unavailable.");
      if (!state.running) {
        state.running = true;
        state.raf = requestAnimationFrame(draw);
      }
      return this;
    },

    stop() {
      state.running = false;
      cancelAnimationFrame(state.raf);
    },

    status() {
      return Object.freeze({
        version: ENVIRONMENT_SCENE_VERSION,
        running: state.running,
        receipt: state.receipt,
        size: state.lastSize
      });
    }
  });
}

function drawSky(ctx, width, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, bottom);
  gradient.addColorStop(0, "rgb(93,125,148)");
  gradient.addColorStop(1, "rgb(224,202,154)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, bottom);
}

function drawWater(ctx, width, top, bottom) {
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);
  gradient.addColorStop(0, "rgb(82,145,157)");
  gradient.addColorStop(1, "rgb(18,82,116)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, top, width, bottom - top);
}

function drawGround(ctx, width, top, height) {
  const gradient = ctx.createLinearGradient(0, top, 0, height);
  gradient.addColorStop(0, "rgb(132,125,76)");
  gradient.addColorStop(1, "rgb(35,58,43)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, top, width, height - top);
}

export default createGroundEnvironmentScene;
