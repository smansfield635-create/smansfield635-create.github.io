import { createSceneRuntime } from "./world/scene_runtime.js";

function requireElement(id, expectedTagName) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`BOOT_FAILURE: Missing required element #${id}.`);
  }

  if (
    expectedTagName &&
    element.tagName.toLowerCase() !== expectedTagName.toLowerCase()
  ) {
    throw new Error(
      `BOOT_FAILURE: Element #${id} must be <${expectedTagName}>.`,
    );
  }

  return element;
}

function fitCanvas(canvas) {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const cssWidth = Math.max(1, Math.floor(canvas.clientWidth || window.innerWidth));
  const cssHeight = Math.max(1, Math.floor(canvas.clientHeight || window.innerHeight));
  const pixelWidth = Math.max(1, Math.floor(cssWidth * dpr));
  const pixelHeight = Math.max(1, Math.floor(cssHeight * dpr));

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  return { cssWidth, cssHeight, pixelWidth, pixelHeight, dpr };
}

export async function bootScene() {
  const canvas = requireElement("world-canvas", "canvas");
  const statusRoot = requireElement("runtime-status", "pre");

  const context = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
  });

  if (!context) {
    throw new Error("BOOT_FAILURE: Canvas2D context could not be created.");
  }

  let viewport = fitCanvas(canvas);

  const sceneRuntime = await createSceneRuntime({
    canvas,
    context,
    statusRoot,
    getViewport: () => viewport,
  });

  function handleResize() {
    viewport = fitCanvas(canvas);
    sceneRuntime.resize(viewport);
  }

  window.addEventListener("resize", handleResize, { passive: true });
  handleResize();

  let rafId = 0;
  let lastNow = performance.now();

  function frame(now) {
    const deltaMs = Math.max(0, now - lastNow);
    lastNow = now;
    sceneRuntime.frame(now, deltaMs);
    rafId = window.requestAnimationFrame(frame);
  }

  sceneRuntime.start();
  rafId = window.requestAnimationFrame(frame);

  window.addEventListener("beforeunload", () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    sceneRuntime.stop();
  });
}

bootScene().catch((error) => {
  const statusRoot = document.getElementById("runtime-status");
  const message =
    error instanceof Error ? error.message : "BOOT_FAILURE: Unknown error.";

  if (statusRoot) {
    statusRoot.textContent = [
      "boot: fail",
      "payload: pending",
      "render: pending",
      "coherence: pending",
      "",
      message,
    ].join("\n");
  }

  throw error;
});
