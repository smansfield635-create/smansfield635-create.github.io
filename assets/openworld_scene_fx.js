(function () {
  "use strict";

  function createState() {
    return {
      overlay: 0,
      bursts: [],
    };
  }

  function triggerOverlay(state, intensity) {
    if (!state) return;
    const v = typeof intensity === "number" && isFinite(intensity) ? intensity : 0;
    state.overlay = Math.max(state.overlay, v);
  }

  function burstAt(state, x, y, kind) {
    if (!state) return;
    state.bursts.push({
      x,
      y,
      kind: kind || "generic",
      life: 1,
    });
    if (state.bursts.length > 12) state.bursts.shift();
  }

  function decay(state) {
    if (!state) return;
    state.overlay *= 0.92;
    if (state.overlay < 0.01) state.overlay = 0;

    for (let i = state.bursts.length - 1; i >= 0; i--) {
      state.bursts[i].life *= 0.90;
      if (state.bursts[i].life < 0.05) state.bursts.splice(i, 1);
    }
  }

  function drawBursts(ctx, state) {
    if (!state || !state.bursts.length) return;

    ctx.save();
    for (let i = 0; i < state.bursts.length; i++) {
      const b = state.bursts[i];
      const alpha = b.life * 0.44;
      const radius = (1 - b.life) * 38 + 10;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle =
        b.kind === "fear"
          ? "rgba(255,138,98,0.88)"
          : b.kind === "align"
            ? "rgba(255,232,180,0.88)"
            : "rgba(255,216,156,0.88)";
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(b.x, b.y, radius * 0.58, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawNavigationOverlay(ctx, state) {
    if (!state || !state.overlay) return;
    ctx.save();
    ctx.globalAlpha = Math.min(0.18, state.overlay);
    ctx.fillStyle = "rgba(255,220,160,0.16)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  window.OPENWORLD_SCENE_FX = Object.freeze({
    version: "OPENWORLD_SCENE_FX_vSANITY1",
    createState,
    triggerOverlay,
    burstAt,
    decay,
    drawBursts,
    drawNavigationOverlay,
  });
})();
