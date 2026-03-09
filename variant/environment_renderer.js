function polygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

const HARBOR_COVE = [
  [488, 958], [512, 914], [554, 886], [606, 886], [644, 912], [656, 954],
  [646, 1000], [612, 1040], [562, 1054], [518, 1046], [492, 1010], [484, 980]
];

const BASIN_WATER = [
  [466, 596], [498, 548], [550, 506], [618, 488], [688, 502], [742, 544], [770, 598],
  [764, 656], [728, 708], [664, 744], [590, 754], [526, 732], [478, 692], [458, 640]
];

const SEDIMENT_WEST = [
  [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
  [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
  [702, 360], [690, 290], [662, 220], [620, 170]
];

const SEDIMENT_EAST = [
  [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
  [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawCoastTransition(ctx);
    drawLocalWaterBodies(ctx);

    ctx.restore();
  }

  function drawCoastTransition(ctx) {
    sedimentBand(ctx, SEDIMENT_WEST, 18, 0.14, 0.08);
    sedimentBand(ctx, SEDIMENT_EAST, 14, 0.10, 0.06);
  }

  function sedimentBand(ctx, points, inset, alphaTop, alphaBottom) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    for (let i = points.length - 1; i >= 0; i -= 1) {
      ctx.lineTo(points[i][0] - inset, points[i][1]);
    }
    ctx.closePath();

    const g = ctx.createLinearGradient(0, 0, 0, 1200);
    g.addColorStop(0, `rgba(156,132,96,${alphaTop})`);
    g.addColorStop(1, `rgba(120,104,78,${alphaBottom})`);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function drawLocalWaterBodies(ctx) {
    drawHarborWater(ctx);
    drawBasinWater(ctx);
  }

  function drawHarborWater(ctx) {
    ctx.save();
    ctx.shadowColor = "rgba(126,198,210,0.18)";
    ctx.shadowBlur = 22;

    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 886, 656, 1054);
    harbor.addColorStop(0, "rgba(148,208,220,0.96)");
    harbor.addColorStop(0.40, "rgba(98,158,176,0.96)");
    harbor.addColorStop(1, "rgba(44,96,124,0.96)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.restore();

    polygon(ctx, HARBOR_COVE);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "rgba(238,246,248,0.08)";
    ctx.stroke();
  }

  function drawBasinWater(ctx) {
    ctx.save();
    ctx.shadowColor = "rgba(120,190,204,0.14)";
    ctx.shadowBlur = 18;

    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(466, 492, 760, 754);
    basin.addColorStop(0, "rgba(146,206,220,0.94)");
    basin.addColorStop(0.42, "rgba(96,154,176,0.94)");
    basin.addColorStop(1, "rgba(40,92,122,0.94)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.restore();

    polygon(ctx, BASIN_WATER);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "rgba(238,246,248,0.08)";
    ctx.stroke();
  }

  return Object.freeze({ draw });
}
