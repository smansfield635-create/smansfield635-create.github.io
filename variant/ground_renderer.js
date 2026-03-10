/* DESTINATION FILE: /variant/ground_renderer.js */

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

/* DRY BEACH LAYER */

function drawDryBeach(ctx, coast) {

  const beach = expandPolygon(coast, 0.985);

  ctx.save();
  polygon(ctx, beach);

  const sand = ctx.createLinearGradient(0,0,0,1200);
  sand.addColorStop(0,"rgba(236,210,152,0.95)");
  sand.addColorStop(1,"rgba(212,188,134,0.92)");

  ctx.fillStyle = sand;
  ctx.fill();

  ctx.restore();
}

/* TERRAIN */

function drawTerrain(ctx, landMask) {

  ctx.save();

  polygon(ctx, landMask);

  const terrain = ctx.createLinearGradient(0,0,0,1200);
  terrain.addColorStop(0,"rgba(214,206,176,1)");
  terrain.addColorStop(0.35,"rgba(194,180,132,1)");
  terrain.addColorStop(0.72,"rgba(150,158,104,1)");
  terrain.addColorStop(1,"rgba(126,140,92,1)");

  ctx.fillStyle = terrain;
  ctx.fill();

  ctx.restore();
}

export function createGroundRenderer() {

  function draw(ctx, runtime) {

    const { viewportOffset, kernel } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    const regions = [...kernel.regionsById.values()];

    const waters = [...kernel.watersById.values()];

    for (const row of waters) {

      if (!row.polygon) continue;

      drawDryBeach(ctx, row.polygon);

    }

    if (kernel.landMask) {
      drawTerrain(ctx, kernel.landMask);
    }

    ctx.restore();
  }

  return Object.freeze({ draw });
}
