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

const ISLAND_CORE = [
  [326, 640],
  [284, 614],
  [248, 566],
  [234, 510],
  [240, 454],
  [268, 400],
  [312, 356],
  [368, 316],
  [408, 270],
  [432, 212],
  [470, 158],
  [520, 120],
  [576, 110],
  [632, 128],
  [678, 164],
  [710, 214],
  [724, 274],
  [718, 340],
  [698, 406],
  [670, 468],
  [660, 538],
  [674, 594],
  [656, 632],
  [614, 662],
  [554, 678],
  [490, 674],
  [428, 664],
  [372, 656]
];

const SUMMIT_MASS = [
  [486, 266],
  [508, 216],
  [536, 168],
  [570, 138],
  [604, 136],
  [626, 164],
  [632, 206],
  [624, 242],
  [602, 270],
  [568, 286],
  [528, 286],
  [498, 278]
];

const BASIN_SHADOW = [
  [452, 404],
  [486, 442],
  [538, 456],
  [592, 448],
  [632, 424],
  [618, 444],
  [578, 466],
  [524, 470],
  [476, 454]
];

const HARBOR_PLAIN = [
  [394, 556],
  [438, 540],
  [492, 534],
  [548, 538],
  [602, 554],
  [634, 582],
  [634, 622],
  [610, 652],
  [554, 670],
  [494, 668],
  [440, 654],
  [402, 628],
  [388, 594]
];

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { tick, viewportOffset, kernel, projection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawLandCore(ctx);
    drawElevation(ctx);
    drawSurfaceHighlights(ctx);
    drawPathBeds(ctx, kernel, projection, destination, pulse);
    drawLandmarks(ctx, kernel, pulse);

    ctx.restore();
  }

  function drawLandCore(ctx) {
    polygon(ctx, ISLAND_CORE);
    const ground = ctx.createLinearGradient(0, 110, 0, 680);
    ground.addColorStop(0, "rgba(176,164,128,1)");
    ground.addColorStop(0.34, "rgba(148,144,102,1)");
    ground.addColorStop(0.64, "rgba(118,134,88,1)");
    ground.addColorStop(1, "rgba(102,122,90,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(238,228,198,0.28)";
    ctx.stroke();
  }

  function drawElevation(ctx) {
    polygon(ctx, SUMMIT_MASS);
    const peak = ctx.createLinearGradient(560, 138, 560, 286);
    peak.addColorStop(0, "rgba(226,224,220,0.88)");
    peak.addColorStop(0.42, "rgba(196,192,184,0.72)");
    peak.addColorStop(1, "rgba(156,152,144,0.30)");
    ctx.fillStyle = peak;
    ctx.fill();

    polygon(ctx, BASIN_SHADOW);
    ctx.fillStyle = "rgba(54,72,74,0.10)";
    ctx.fill();

    polygon(ctx, HARBOR_PLAIN);
    ctx.fillStyle = "rgba(162,154,102,0.16)";
    ctx.fill();
  }

  function drawSurfaceHighlights(ctx) {
    const ridge = [
      [470, 298],
      [504, 302],
      [544, 298],
      [588, 288],
      [618, 268]
    ];
    polyline(ctx, ridge);
    ctx.strokeStyle = "rgba(246,240,228,0.24)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const harborBand = [
      [416, 610],
      [458, 596],
      [514, 590],
      [570, 594],
      [616, 608]
    ];
    polyline(ctx, harborBand);
    ctx.strokeStyle = "rgba(226,210,168,0.20)";
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
      ctx.strokeStyle = "rgba(90,72,50,0.30)";
      ctx.stroke();

      polyline(ctx, row.centerline);
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(214,190,142,0.26)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        row.fromRegionId === projection.regionId && row.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        polyline(ctx, row.centerline);
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(250,230,176,${0.24 + pulse * 0.20})`;
        ctx.stroke();
      }
    }
  }

  function drawLandmarks(ctx, kernel, pulse) {
    const rows = [...kernel.regionsById.values()];
    for (const row of rows) {
      const [x, y] = row.centerPoint;

      if (row.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(114,82,58,0.96)";
        ctx.fillRect(x - 34, y + 10, 68, 12);
        ctx.fillRect(x - 8, y - 8, 16, 22);
        ctx.fillRect(x - 50, y + 16, 12, 8);
        ctx.fillRect(x + 38, y + 16, 12, 8);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(160,112,78,0.96)";
        ctx.fillRect(x - 26, y + 4, 52, 14);
        ctx.fillStyle = "rgba(224,190,136,0.88)";
        ctx.fillRect(x - 16, y - 8, 32, 10);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 4, 8 + pulse * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.18)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 22);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(230,222,216,0.96)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 28, 6 + pulse * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.34)";
        ctx.fill();
      }
    }
  }

  return Object.freeze({ draw });
}
