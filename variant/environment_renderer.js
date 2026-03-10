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

function beachBand(ctx, points, width, innerAlpha, outerAlpha) {
  if (!points || points.length < 2) return;

  ctx.beginPath();

  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }

  for (let i = points.length - 1; i >= 0; i--) {
    ctx.lineTo(points[i][0] - width, points[i][1]);
  }

  ctx.closePath();

  const g = ctx.createLinearGradient(0, 0, 0, 1200);
  g.addColorStop(0, `rgba(238,218,170,${innerAlpha})`);
  g.addColorStop(1, `rgba(214,192,142,${outerAlpha})`);

  ctx.fillStyle = g;
  ctx.fill();
}

/* coastline segments already defined in your file */
const SEDIMENT_WEST = [
  [520,1080],[500,1000],[498,920],[508,840],[530,760],
  [560,690],[596,620],[636,560],[670,500],[692,430],
  [702,360],[690,290],[662,220],[620,170]
];

const SEDIMENT_EAST = [
  [548,1080],[580,1000],[620,920],[670,850],[730,780],
  [790,710],[850,640],[912,560],[972,480],[1030,420],[1086,370]
];

export function createEnvironmentRenderer() {

  function draw(ctx, runtime) {
    const { viewportOffset, kernel, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawBeach(ctx);
    drawWaterBodies(ctx, kernel, tick);

    ctx.restore();
  }

  function drawBeach(ctx) {

    const BEACH_WIDTH = 85;

    beachBand(ctx, SEDIMENT_WEST, BEACH_WIDTH, 0.88, 0.46);
    beachBand(ctx, SEDIMENT_EAST, BEACH_WIDTH, 0.88, 0.46);

  }

  function drawWaterBodies(ctx, kernel, tick) {

    if (!kernel?.watersById) return;

    const rows = [...kernel.watersById.values()];

    for (const row of rows) {
      if (!Array.isArray(row.polygon)) continue;

      polygon(ctx, row.polygon);

      const g = ctx.createLinearGradient(0,0,0,1000);
      g.addColorStop(0,"rgba(42,116,168,0.96)");
      g.addColorStop(1,"rgba(18,70,128,0.96)");

      ctx.fillStyle = g;
      ctx.fill();
    }

  }

  return Object.freeze({ draw });
}
