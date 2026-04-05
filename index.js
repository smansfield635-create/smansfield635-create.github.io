(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) {
    throw new Error("Compass baseline requires #scene canvas");
  }

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) {
    throw new Error("2D canvas context unavailable");
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
  ctx.font = "bold 32px Arial";
  ctx.fillText("ROOT INDEX.JS IS RUNNING", width * 0.5, height * 0.5);

  ctx.font = "bold 18px Arial";
  ctx.fillText("EXECUTION PROOF SCREEN", width * 0.5, height * 0.5 + 44);

  window.__ROOT_INDEX_JS_PROOF__ = true;
})();
