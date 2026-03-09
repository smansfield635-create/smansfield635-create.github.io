function polygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function polyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
}

const PENINSULA_CORE = [
  [534, 900],
  [494, 878],
  [460, 840],
  [444, 792],
  [446, 742],
  [462, 696],
  [490, 650],
  [526, 602],
  [574, 552],
  [628, 500],
  [680, 442],
  [724, 376],
  [760, 300],
  [788, 220],
  [806, 136],
  [822, 44],
  [878, 44],
  [878, -92],
  [206, -92],
  [206, 72],
  [254, 116],
  [294, 176],
  [324, 248],
  [352, 332],
  [384, 418],
  [420, 502],
  [458, 580],
  [496, 654],
  [526, 730]
];

const SOUTH_BEACH = [
  [484, 842],
  [512, 826],
  [550, 822],
  [586, 832],
  [610, 856],
  [610, 900],
  [494, 900]
];

const BASIN_RING = [
  [476, 498],
  [500, 448],
  [548, 410],
  [606, 396],
  [660, 408],
  [696, 444],
  [706, 492],
  [688, 538],
  [648, 568],
  [594, 578],
  [540, 570],
  [500, 544]
];

const NORTH_ASCENT = [
  [552, 338],
  [580, 280],
  [616, 230],
  [662, 188],
  [706, 166],
  [746, 170],
  [760, 204],
  [752, 250],
  [728, 292],
  [694, 326],
  [652, 352],
  [602, 364]
];

const EAST_CIVIC_RISE = [
  [650, 676],
  [692, 632],
  [734, 580],
  [772, 516],
  [804, 438],
  [826, 348],
  [838, 248],
  [838, 176],
  [858, 176],
  [862, 250],
  [852, 356],
  [824, 454],
  [786, 536],
  [742, 602],
  [694, 654]
];

const WEST_SOLEMN_RISE = [
  [452, 658],
  [424, 610],
  [400, 548],
  [378, 482],
  [354, 414],
  [328, 338],
  [300, 268],
  [270, 204],
  [240, 152],
  [226, 132],
  [244, 198],
  [272, 266],
  [304, 342],
  [336, 422],
  [368, 504],
  [404, 582],
  [438, 644]
];

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { tick, viewportOffset, kernel, projection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawPeninsulaCore(ctx);
    drawElevationBands(ctx);
    drawTraversalBelts(ctx);
    drawPathBeds(ctx, kernel, projection, destination, pulse);
    drawLandmarks(ctx, kernel, pulse);

    ctx.restore();
  }

  function drawPeninsulaCore(ctx) {
    polygon(ctx, PENINSULA_CORE);
    const ground = ctx.createLinearGradient(0, 44, 0, 900);
    ground.addColorStop(0, "rgba(176,170,146,1)");
    ground.addColorStop(0.24, "rgba(164,160,128,1)");
    ground.addColorStop(0.56, "rgba(144,148,104,1)");
    ground.addColorStop(1, "rgba(126,136,96,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(242,232,204,0.28)";
    ctx.stroke();

    polygon(ctx, SOUTH_BEACH);
    ctx.fillStyle = "rgba(214,188,138,0.30)";
    ctx.fill();
  }

  function drawElevationBands(ctx) {
    polygon(ctx, BASIN_RING);
    const basin = ctx.createLinearGradient(0, 396, 0, 578);
    basin.addColorStop(0, "rgba(176,170,132,0.22)");
    basin.addColorStop(1, "rgba(100,118,86,0.14)");
    ctx.fillStyle = basin;
    ctx.fill();

    polygon(ctx, NORTH_ASCENT);
    const north = ctx.createLinearGradient(0, 166, 0, 364);
    north.addColorStop(0, "rgba(218,214,206,0.72)");
    north.addColorStop(0.42, "rgba(196,190,174,0.44)");
    north.addColorStop(1, "rgba(156,150,136,0.18)");
    ctx.fillStyle = north;
    ctx.fill();
  }

  function drawTraversalBelts(ctx) {
    polygon(ctx, EAST_CIVIC_RISE);
    ctx.fillStyle = "rgba(186,174,126,0.12)";
    ctx.fill();

    polygon(ctx, WEST_SOLEMN_RISE);
    ctx.fillStyle = "rgba(118,138,96,0.12)";
    ctx.fill();

    const ridge = [
      [564, 344],
      [610, 330],
      [656, 302],
      [700, 264],
      [736, 220]
    ];
    polyline(ctx, ridge);
    ctx.strokeStyle = "rgba(246,240,228,0.24)";
    ctx.lineWidth = 2.1;
    ctx.stroke();

    const harborBand = [
      [486, 820],
      [520, 808],
      [560, 808],
      [594, 820]
    ];
    polyline(ctx, harborBand);
    ctx.strokeStyle = "rgba(230,214,174,0.18)";
    ctx.lineWidth = 2.6;
    ctx.stroke();
  }

  function drawPathBeds(ctx, kernel, projection, destination, pulse) {
    const rows = [...kernel.pathsById.values()];

    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 24;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(92,72,52,0.30)";
      ctx.stroke();

      polyline(ctx, row.centerline);
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(214,188,136,0.24)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        row.fromRegionId === projection.regionId && row.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        polyline(ctx, row.centerline);
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(250,230,176,${0.24 + pulse * 0.22})`;
        ctx.stroke();
      }
    }
  }

  function drawLandmarks(ctx, kernel, pulse) {
    const rows = [...kernel.regionsById.values()];

    for (const row of rows) {
      const [x, y] = row.centerPoint;

      if (row.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(122,84,58,0.96)";
        ctx.fillRect(x - 34, y + 10, 68, 12);
        ctx.fillRect(x - 10, y - 4, 20, 18);
        ctx.fillRect(x - 46, y + 16, 12, 8);
        ctx.fillRect(x + 34, y + 16, 12, 8);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(162,114,76,0.98)";
        ctx.fillRect(x - 26, y + 4, 52, 14);
        ctx.fillStyle = "rgba(230,194,132,0.90)";
        ctx.fillRect(x - 18, y - 8, 36, 10);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 4, 8 + pulse * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.18)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 28);
        ctx.lineTo(x + 12, y + 2);
        ctx.lineTo(x - 12, y + 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(230,222,214,0.96)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 34, 6 + pulse * 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.36)";
        ctx.fill();
      }
    }
  }

  return Object.freeze({ draw });
}
