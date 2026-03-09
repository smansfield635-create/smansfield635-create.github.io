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
  [538, 1120],
  [514, 1062],
  [498, 992],
  [496, 918],
  [506, 844],
  [526, 774],
  [556, 708],
  [594, 650],
  [642, 594],
  [694, 540],
  [742, 480],
  [786, 414],
  [830, 346],
  [882, 282],
  [940, 228],
  [1002, 188],
  [1070, 162],
  [1140, 146],
  [1150, 146],
  [1150, -120],
  [132, -120],
  [132, 176],
  [188, 222],
  [240, 276],
  [286, 338],
  [328, 410],
  [362, 488],
  [396, 566],
  [434, 638],
  [474, 708],
  [504, 782],
  [526, 862],
  [544, 960],
  [554, 1050]
];

const SOUTH_BEACH = [
  [500, 978],
  [526, 944],
  [566, 930],
  [612, 934],
  [648, 956],
  [664, 994],
  [660, 1042],
  [628, 1080],
  [582, 1098],
  [536, 1090],
  [508, 1056],
  [498, 1014]
];

const BASIN_RING = [
  [482, 620],
  [508, 566],
  [552, 526],
  [610, 506],
  [674, 512],
  [724, 540],
  [754, 584],
  [756, 634],
  [732, 682],
  [686, 718],
  [626, 738],
  [564, 734],
  [514, 710],
  [488, 668]
];

const SUMMIT_RIDGE = [
  [600, 468],
  [632, 410],
  [672, 360],
  [722, 314],
  [778, 278],
  [842, 254],
  [904, 250],
  [952, 272],
  [980, 314],
  [980, 362],
  [956, 410],
  [914, 452],
  [858, 486],
  [792, 504],
  [722, 502],
  [656, 488]
];

const WEST_ASCENT_BELT = [
  [470, 876],
  [446, 812],
  [430, 744],
  [420, 680],
  [406, 612],
  [388, 546],
  [366, 480],
  [340, 416],
  [308, 356],
  [270, 296],
  [226, 244],
  [182, 202]
];

const EAST_ASCENT_BELT = [
  [618, 906],
  [654, 844],
  [698, 784],
  [748, 724],
  [798, 660],
  [850, 588],
  [906, 516],
  [968, 452],
  [1030, 394],
  [1092, 340],
  [1142, 300]
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
    const ground = ctx.createLinearGradient(0, 146, 0, 1120);
    ground.addColorStop(0, "rgba(178,170,148,1)");
    ground.addColorStop(0.20, "rgba(168,160,132,1)");
    ground.addColorStop(0.48, "rgba(150,148,112,1)");
    ground.addColorStop(0.78, "rgba(136,144,102,1)");
    ground.addColorStop(1, "rgba(124,136,96,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(244,232,204,0.28)";
    ctx.stroke();

    polygon(ctx, SOUTH_BEACH);
    ctx.fillStyle = "rgba(216,190,138,0.34)";
    ctx.fill();
  }

  function drawElevationBands(ctx) {
    polygon(ctx, BASIN_RING);
    const basin = ctx.createLinearGradient(0, 506, 0, 738);
    basin.addColorStop(0, "rgba(182,174,132,0.22)");
    basin.addColorStop(1, "rgba(108,122,88,0.14)");
    ctx.fillStyle = basin;
    ctx.fill();

    polygon(ctx, SUMMIT_RIDGE);
    const ridge = ctx.createLinearGradient(0, 250, 0, 504);
    ridge.addColorStop(0, "rgba(220,214,204,0.78)");
    ridge.addColorStop(0.40, "rgba(194,186,170,0.40)");
    ridge.addColorStop(1, "rgba(160,150,136,0.14)");
    ctx.fillStyle = ridge;
    ctx.fill();
  }

  function drawTraversalBelts(ctx) {
    polygon(ctx, WEST_ASCENT_BELT);
    ctx.fillStyle = "rgba(118,140,98,0.12)";
    ctx.fill();

    polygon(ctx, EAST_ASCENT_BELT);
    ctx.fillStyle = "rgba(190,176,126,0.12)";
    ctx.fill();

    const ridgeStroke = [
      [640, 490],
      [698, 484],
      [760, 468],
      [824, 438],
      [888, 392],
      [940, 344]
    ];
    polyline(ctx, ridgeStroke);
    ctx.strokeStyle = "rgba(246,240,228,0.24)";
    ctx.lineWidth = 2.1;
    ctx.stroke();

    const harborBand = [
      [512, 1008],
      [544, 988],
      [586, 986],
      [626, 1002]
    ];
    polyline(ctx, harborBand);
    ctx.strokeStyle = "rgba(230,214,174,0.18)";
    ctx.lineWidth = 2.8;
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
        ctx.fillRect(x - 34, y + 12, 68, 12);
        ctx.fillRect(x - 10, y - 2, 20, 18);
        ctx.fillRect(x - 46, y + 18, 12, 8);
        ctx.fillRect(x + 34, y + 18, 12, 8);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(162,114,76,0.98)";
        ctx.fillRect(x - 26, y + 6, 52, 14);
        ctx.fillStyle = "rgba(230,194,132,0.90)";
        ctx.fillRect(x - 18, y - 6, 36, 10);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 4, 8 + pulse * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.18)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 34);
        ctx.lineTo(x + 12, y + 2);
        ctx.lineTo(x - 12, y + 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(230,222,214,0.96)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 40, 6 + pulse * 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.36)";
        ctx.fill();
      }
    }
  }

  return Object.freeze({ draw });
}
