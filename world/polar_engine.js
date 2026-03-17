// TNT — /world/polar_engine.js
// PURPOSE: north/south pole rendering logic (separate from planet renderer)

function drawNorth(ctx, w, h) {
  ctx.save();

  const cx = w * 0.5;
  const cy = h * 0.5;

  for (let i = 0; i < 40; i++) {
    const r = 20 + i * 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(180,220,255,${0.04 + i * 0.01})`;
    ctx.stroke();
  }

  ctx.restore();
}

function drawSouth(ctx, w, h) {
  ctx.save();

  const cx = w * 0.5;
  const cy = h * 0.5;

  for (let i = 0; i < 60; i++) {
    const r = 10 + i * 5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,80,80,${0.03 + i * 0.01})`;
    ctx.stroke();
  }

  ctx.restore();
}

export function createPolarEngine() {

  function render(runtime, ctx) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    if (runtime.zone?.currentZone === "north") {
      drawNorth(ctx, w, h);
    }

    if (runtime.zone?.currentZone === "south") {
      drawSouth(ctx, w, h);
    }
  }

  return Object.freeze({
    render
  });
}
