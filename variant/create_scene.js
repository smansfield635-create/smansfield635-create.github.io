import { createSceneRuntime } from "./world/scene_runtime.js";

export async function createScene(canvas, outputs) {
  if (!canvas) {
    throw new Error("Canvas element is required");
  }

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D canvas context unavailable");
  }

  function getViewport() {
    return {
      width: Math.max(1, window.innerWidth || canvas.clientWidth || 1),
      height: Math.max(1, window.innerHeight || canvas.clientHeight || 1)
    };
  }

  const runtime = await createSceneRuntime({
    canvas,
    context,
    outputs,
    getViewport
  });

  let running = false;
  let rafId = 0;
  let lastNow = 0;

  function applyCanvasViewport() {
    const viewport = getViewport();
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
  }

  function frame(now) {
    if (!running) return;

    const deltaMs = lastNow === 0 ? 16.67 : Math.max(1, now - lastNow);
    lastNow = now;

    runtime.frame(now, deltaMs);
    rafId = requestAnimationFrame(frame);
  }

  function onResize() {
    applyCanvasViewport();
    runtime.resize();
  }

  function start() {
    if (running) return;
    running = true;
    lastNow = 0;
    applyCanvasViewport();
    runtime.start();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }

    runtime.stop();
  }

  applyCanvasViewport();
  window.addEventListener("resize", onResize, { passive: true });

  return Object.freeze({
    start,
    stop
  });
}
