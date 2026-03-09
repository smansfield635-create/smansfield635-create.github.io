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
    sedimentBand(ctx, SEDIMENT_WEST, 18, 0.16, 0.10);
    sedimentBand(ctx, SEDIMENT_EAST, 14, 0.12, 0.08);
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
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 886, 656, 1054);
    harbor.addColorStop(0, "rgba(146,206,218,0.94)");
    harbor.addColorStop(0.38, "rgba(96,156,174,0.94)");
    harbor.addColorStop(1, "rgba(42,92,120,0.94)");
    ctx.fillStyle = harbor;
    ctx.fill();
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "rgba(238,246,248,0.06)";
    ctx.stroke();

    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(466, 492, 760, 754);
    basin.addColorStop(0, "rgba(144,204,218,0.96)");
    basin.addColorStop(0.40, "rgba(96,154,174,0.96)");
    basin.addColorStop(1, "rgba(38,90,120,0.96)");
    ctx.fillStyle = basin;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(238,246,248,0.10)";
    ctx.stroke();
  }

  return Object.freeze({ draw });
}
