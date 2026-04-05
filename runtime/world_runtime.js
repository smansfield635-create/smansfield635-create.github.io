DESTINATION: /world/runtime/world_runtime.js
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) {
    throw new Error("PROOF: /world/runtime/world_runtime.js reached, but #scene canvas was not found");
  }

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) {
    throw new Error("PROOF: /world/runtime/world_runtime.js reached, but 2D context was unavailable");
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = "#c00000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 34px Arial";
  ctx.fillText("WORLD/RUNTIME/WORLD_RUNTIME.JS IS LIVE", width * 0.5, height * 0.5 - 18);

  ctx.font = "bold 20px Arial";
  ctx.fillText("PROOF OVERRIDE SCREEN", width * 0.5, height * 0.5 + 28);

  window.__WORLD_RUNTIME_PROOF__ = true;
})();
