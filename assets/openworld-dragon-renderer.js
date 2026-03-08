(function () {
  "use strict";

  const TAU = Math.PI * 2;

  function drawDragonBody(ctx, x, y, tick, colorA, colorB, direction) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const px = x + direction * (t * 140);
      const py = y + Math.sin(t * 8 + tick * 0.06) * (18 - t * 10) + t * 26;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.lineWidth = 10;
    ctx.strokeStyle = colorA;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const px = x + direction * (t * 140);
      const py = y + Math.sin(t * 8 + tick * 0.06) * (18 - t * 10) + t * 26;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = colorB;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 12, 0, TAU);
    ctx.fillStyle = colorB;
    ctx.fill();

    ctx.restore();
  }

  function drawDragons(ctx, sceneState, tick) {
    if (!sceneState) return;

    if (sceneState.dragonFearActive && sceneState.moonLeftHot) {
      drawDragonBody(
        ctx,
        sceneState.moonLeftHot.x - 6,
        sceneState.moonLeftHot.y + sceneState.moonLeftHot.r + 18,
        tick,
        "rgba(120,24,18,0.88)",
        "rgba(255,180,120,0.94)",
        1
      );
    }

    if (sceneState.dragonAlignActive && sceneState.moonRightHot) {
      drawDragonBody(
        ctx,
        sceneState.moonRightHot.x + 6,
        sceneState.moonRightHot.y + sceneState.moonRightHot.r + 18,
        tick + 20,
        "rgba(130,104,26,0.88)",
        "rgba(255,240,200,0.94)",
        -1
      );
    }
  }

  window.OPENWORLD_DRAGON_RENDERER = Object.freeze({
    version: "OPENWORLD_DRAGON_RENDERER_vSANITY1",
    drawDragons,
  });
})();
