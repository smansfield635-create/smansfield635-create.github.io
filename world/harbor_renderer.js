(function () {
  "use strict";

  function draw(ctx, w, h, tick, preset) {
    const horizon = h * preset.horizon;
    const baseY = horizon + 26;

    ctx.save();
    ctx.globalAlpha = 0.92;

    const houses = [
      { x: w * 0.18, y: baseY, w: 44, h: 30 },
      { x: w * 0.24, y: baseY + 6, w: 36, h: 24 },
      { x: w * 0.70, y: baseY + 2, w: 40, h: 28 },
      { x: w * 0.76, y: baseY + 8, w: 32, h: 22 },
    ];

    for (let i = 0; i < houses.length; i++) {
      const hs = houses[i];

      ctx.fillStyle = "rgba(22,14,18,0.92)";
      ctx.fillRect(hs.x, hs.y, hs.w, hs.h);

      ctx.beginPath();
      ctx.moveTo(hs.x - 4, hs.y);
      ctx.lineTo(hs.x + hs.w * 0.5, hs.y - 16);
      ctx.lineTo(hs.x + hs.w + 4, hs.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(80,24,18,0.94)";
      ctx.fill();

      ctx.fillStyle = "rgba(255,214,130,0.84)";
      ctx.fillRect(hs.x + hs.w * 0.36, hs.y + hs.h * 0.30, 8, 10);
    }

    ctx.restore();
  }

  window.HARBOR_RENDERER = Object.freeze({
    version: "HARBOR_RENDERER_vSANITY1",
    draw,
  });
})();
