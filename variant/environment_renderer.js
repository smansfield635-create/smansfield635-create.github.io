/* DESTINATION FILE: /variant/environment_renderer.js */

function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function expandPolygon(points, scale) {
  const [cx, cy] = centroid(points);
  return points.map(([x, y]) => [
    cx + ((x - cx) * scale),
    cy + ((y - cy) * scale)
  ]);
}

/* LAYER 2 — SURF BAND */

function drawSurf(ctx, coast) {
  const surf = expandPolygon(coast, 1.035);

  ctx.save();
  polygon(ctx, surf);

  const g = ctx.createLinearGradient(0,0,0,1200);
  g.addColorStop(0,"rgba(255,255,255,0.45)");
  g.addColorStop(0.5,"rgba(255,255,255,0.25)");
  g.addColorStop(1,"rgba(255,255,255,0.05)");

  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

/* LAYER 3 — WET SAND */

function drawWetSand(ctx, coast) {
  const wet = expandPolygon(coast, 1.015);

  ctx.save();
  polygon(ctx, wet);

  const g = ctx.createLinearGradient(0,0,0,1200);
  g.addColorStop(0,"rgba(198,178,132,0.55)");
  g.addColorStop(1,"rgba(168,150,110,0.35)");

  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

/* WATER BODIES */

function drawWater(ctx, polygonPoints) {
  ctx.save();
  polygon(ctx, polygonPoints);

  const [cx, cy] = centroid(polygonPoints);

  const g = ctx.createRadialGradient(cx,cy,20,cx,cy,200);
  g.addColorStop(0,"rgba(82,162,196,0.9)");
  g.addColorStop(1,"rgba(30,92,126,0.9)");

  ctx.fillStyle = g;
  ctx.fill();

  ctx.restore();
}

export function createEnvironmentRenderer() {

  function draw(ctx, runtime) {

    const { viewportOffset, kernel } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    const waters = [...kernel.watersById.values()];

    for (const row of waters) {

      if (!row.polygon) continue;

      drawSurf(ctx, row.polygon);
      drawWetSand(ctx, row.polygon);
      drawWater(ctx, row.polygon);

    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
