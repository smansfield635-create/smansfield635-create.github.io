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

function fillNoiseDots(ctx, bounds, count, color, seedOffset = 0) {
  const { x, y, w, h } = bounds;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const px = x + (((i * 71) + (seedOffset * 17)) % w);
    const py = y + (((i * 131) + (seedOffset * 23)) % h);
    const r = 0.55 + ((i % 4) * 0.28);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function fillMicroDots(ctx, bounds, count, color) {
  const { x, y, w, h } = bounds;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const px = x + ((i * 23) % w);
    const py = y + ((i * 41) % h);
    const r = 0.5 + ((i % 3) * 0.14);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_CORE = [
  [540, 1140], [514, 1076], [500, 998], [500, 914], [516, 830], [544, 750], [584, 678],
  [636, 614], [694, 556], [754, 502], [812, 438], [874, 362], [940, 292], [1012, 234],
  [1082, 194], [1146, 176], [1150, 176], [1150, -120], [132, -120], [132, 178], [192, 240],
  [248, 314], [298, 396], [340, 488], [376, 580], [408, 668], [438, 752], [466, 832],
  [492, 918], [514, 1012], [530, 1088]
];

const SOUTH_BEACH = [
  [504, 978], [528, 940], [572, 928], [620, 938], [656, 966], [666, 1008],
  [652, 1050], [616, 1086], [568, 1098], [524, 1084], [500, 1046], [496, 1000]
];

const BASIN_RING = [
  [482, 624], [514, 570], [566, 528], [632, 510], [700, 522], [752, 560], [778, 616],
  [770, 678], [734, 732], [672, 770], [598, 784], [532, 768], [484, 730], [462, 674]
];

const BASIN_INNER = [
  [520, 646], [548, 612], [592, 588], [644, 590], [688, 614], [710, 652],
  [698, 686], [662, 710], [614, 720], [566, 710], [530, 686]
];

const SUMMIT_RIDGE = [
  [494, 676], [572, 602], [668, 540], [778, 494], [890, 472], [994, 490],
  [1078, 540], [1120, 608], [1100, 676], [1020, 726], [906, 754],
  [776, 758], [638, 734]
];

const RIDGE_SHADOW = [
  [514, 734], [598, 658], [702, 596], [818, 556], [930, 546], [1030, 580],
  [1100, 640], [1120, 706], [1084, 768], [992, 808], [870, 824],
  [732, 816], [598, 786]
];

const FOOTHILL_STROKE_A = [
  [584, 676], [662, 628], [752, 590], [848, 570], [944, 580], [1030, 620], [1090, 674]
];

const FOOTHILL_STROKE_B = [
  [530, 770], [614, 714], [712, 668], [816, 644], [920, 652], [1014, 690]
];

const FOOTHILL_STROKE_C = [
  [482, 852], [572, 788], [676, 736], [786, 708], [896, 712], [1000, 744]
];

const WEST_ASCENT_BELT = [
  [464, 886], [438, 822], [422, 754], [410, 684], [396, 614], [378, 542],
  [354, 472], [324, 406], [290, 344], [248, 284], [206, 236]
];

const EAST_ASCENT_BELT = [
  [622, 908], [662, 846], [710, 784], [764, 718], [822, 646], [880, 570],
  [942, 496], [1004, 430], [1066, 380], [1122, 340]
];

const HARBOR_GRASS = [
  [474, 956], [500, 910], [546, 882], [600, 884], [642, 910],
  [654, 952], [642, 996], [600, 1028], [548, 1036], [498, 1014]
];

const SOUTH_CONTOUR = [
  [430, 930], [486, 892], [552, 864], [626, 852], [700, 860]
];

const TERRACE_A = [
  [424, 860], [504, 812], [596, 770], [696, 740], [798, 730], [892, 738]
];

const TERRACE_B = [
  [388, 748], [474, 694], [572, 646], [680, 612], [790, 600], [896, 608]
];

const TERRACE_C = [
  [352, 634], [444, 574], [552, 524], [670, 490], [788, 480], [908, 492]
];

const MICRO_FOREST_PATCHES = [
  { x: 458, y: 914, w: 78, h: 48, count: 38, color: "rgba(96,122,84,0.14)" },
  { x: 386, y: 754, w: 136, h: 70, count: 58, color: "rgba(96,122,84,0.12)" },
  { x: 456, y: 626, w: 116, h: 72, count: 52, color: "rgba(96,122,84,0.11)" },
  { x: 754, y: 634, w: 72, h: 44, count: 28, color: "rgba(96,122,84,0.10)" },
  { x: 888, y: 522, w: 60, h: 40, count: 22, color: "rgba(96,122,84,0.09)" }
];

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { tick, viewportOffset, kernel, projection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawPeninsulaCore(ctx);
    drawElevationBands(ctx);
    drawSurfaceTexture(ctx);
    drawForestPatches(ctx);
    drawTraversalBelts(ctx);
    drawPathBeds(ctx, kernel, projection, destination, pulse);
    drawLandmarks(ctx, kernel, pulse);

    ctx.restore();
  }

  function drawPeninsulaCore(ctx) {
    polygon(ctx, PENINSULA_CORE);
    const ground = ctx.createLinearGradient(0, 160, 0, 1140);
    ground.addColorStop(0, "rgba(194,186,162,1)");
    ground.addColorStop(0.18, "rgba(180,170,142,1)");
    ground.addColorStop(0.44, "rgba(160,154,120,1)");
    ground.addColorStop(0.76, "rgba(142,148,106,1)");
    ground.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(246,236,210,0.30)";
    ctx.stroke();

    polygon(ctx, SOUTH_BEACH);
    ctx.fillStyle = "rgba(220,194,140,0.38)";
    ctx.fill();

    polygon(ctx, HARBOR_GRASS);
    ctx.fillStyle = "rgba(150,162,106,0.14)";
    ctx.fill();
  }

  function drawElevationBands(ctx) {
    polygon(ctx, RIDGE_SHADOW);
    ctx.fillStyle = "rgba(78,84,78,0.12)";
    ctx.fill();

    polygon(ctx, BASIN_RING);
    const basin = ctx.createLinearGradient(0, 510, 0, 784);
    basin.addColorStop(0, "rgba(176,170,130,0.18)");
    basin.addColorStop(1, "rgba(96,116,86,0.22)");
    ctx.fillStyle = basin;
    ctx.fill();

    polygon(ctx, BASIN_INNER);
    ctx.fillStyle = "rgba(46,70,68,0.16)";
    ctx.fill();

    polygon(ctx, SUMMIT_RIDGE);
    const ridge = ctx.createLinearGradient(0, 470, 0, 760);
    ridge.addColorStop(0, "rgba(230,224,212,0.92)");
    ridge.addColorStop(0.34, "rgba(198,188,172,0.54)");
    ridge.addColorStop(0.70, "rgba(154,146,134,0.22)");
    ridge.addColorStop(1, "rgba(116,122,116,0.06)");
    ctx.fillStyle = ridge;
    ctx.fill();

    polyline(ctx, FOOTHILL_STROKE_A);
    ctx.strokeStyle = "rgba(248,242,228,0.22)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    polyline(ctx, FOOTHILL_STROKE_B);
    ctx.strokeStyle = "rgba(240,234,218,0.18)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    polyline(ctx, FOOTHILL_STROKE_C);
    ctx.strokeStyle = "rgba(236,230,212,0.16)";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  function drawSurfaceTexture(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_CORE);
    ctx.clip();

    fillNoiseDots(ctx, { x: 200, y: 170, w: 880, h: 960 }, 920, "rgba(108,118,84,0.05)", 1);
    fillNoiseDots(ctx, { x: 230, y: 200, w: 840, h: 900 }, 580, "rgba(230,216,182,0.044)", 2);
    fillNoiseDots(ctx, { x: 260, y: 240, w: 780, h: 840 }, 360, "rgba(150,164,110,0.034)", 3);

    polyline(ctx, SOUTH_CONTOUR);
    ctx.strokeStyle = "rgba(238,224,194,0.10)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    polyline(ctx, TERRACE_A);
    ctx.strokeStyle = "rgba(244,236,214,0.10)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    polyline(ctx, TERRACE_B);
    ctx.strokeStyle = "rgba(242,232,208,0.10)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    polyline(ctx, TERRACE_C);
    ctx.strokeStyle = "rgba(240,230,204,0.10)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.restore();
  }

  function drawForestPatches(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_CORE);
    ctx.clip();
    for (const patch of MICRO_FOREST_PATCHES) {
      fillMicroDots(ctx, patch, patch.count, patch.color);
    }
    ctx.restore();
  }

  function drawTraversalBelts(ctx) {
    polygon(ctx, WEST_ASCENT_BELT);
    ctx.fillStyle = "rgba(116,138,98,0.12)";
    ctx.fill();

    polygon(ctx, EAST_ASCENT_BELT);
    ctx.fillStyle = "rgba(190,176,126,0.12)";
    ctx.fill();
  }

  function drawPathBeds(ctx, kernel, projection, destination, pulse) {
    const rows = [...kernel.pathsById.values()];

    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(92,72,52,0.30)";
      ctx.stroke();

      polyline(ctx, row.centerline);
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(216,190,136,0.24)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        row.fromRegionId === projection.regionId && row.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        polyline(ctx, row.centerline);
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(250,230,176,${0.22 + (pulse * 0.22)})`;
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
        ctx.arc(x, y - 4, 8 + (pulse * 1.2), 0, Math.PI * 2);
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
        ctx.arc(x, y - 40, 6 + (pulse * 0.9), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.34)";
        ctx.fill();
      }
    }
  }

  return Object.freeze({ draw });
}
