import { createSceneRuntime } from "./world/scene_runtime.js";

function requireCanvas(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("BOOT_FAILURE: #scene canvas missing.");
  }
  return canvas;
}

function requireOutputs(outputs) {
  const required = [
    "region",
    "cell",
    "sector",
    "band",
    "encoding",
    "byte",
    "selectedName",
    "selectedType",
    "destination",
    "selectionHint"
  ];

  for (const key of required) {
    if (!outputs?.[key]) {
      throw new Error(`BOOT_FAILURE: Missing output binding for ${key}.`);
    }
  }
  return outputs;
}

function fitCanvas(canvas) {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const width = Math.max(1, Math.floor(canvas.clientWidth || window.innerWidth));
  const height = Math.max(1, Math.floor(canvas.clientHeight || window.innerHeight));

  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));

  return {
    width,
    height,
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    dpr
  };
}

export async function createScene(canvas, outputs) {
  const safeCanvas = requireCanvas(canvas);
  const safeOutputs = requireOutputs(outputs);

  const context = safeCanvas.getContext("2d", {
    alpha: false,
    desynchronized: true
  });

  if (!context) {
    throw new Error("BOOT_FAILURE: Could not acquire 2D context.");
  }

  let viewport = fitCanvas(safeCanvas);

  const sceneRuntime = await createSceneRuntime({
    canvas: safeCanvas,
    context,
    outputs: safeOutputs,
    getViewport: () => viewport
  });

  function handleResize() {
    viewport = fitCanvas(safeCanvas);
    sceneRuntime.resize(viewport);
  }

  window.addEventListener("resize", handleResize, { passive: true });
  handleResize();

  let rafId = 0;
  let started = false;
  let lastNow = 0;

  function frame(now) {
    const deltaMs = started ? Math.max(0, now - lastNow) : 0;
    lastNow = now;
    sceneRuntime.frame(now, deltaMs);
    rafId = window.requestAnimationFrame(frame);
  }

  return {
    start() {
      if (started) return;
      started = true;
      sceneRuntime.start();
      rafId = window.requestAnimationFrame(frame);
    },
    stop() {
      if (rafId) window.cancelAnimationFrame(rafId);
      sceneRuntime.stop();
    }
  };
}
