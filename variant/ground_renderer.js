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
    const px = x + (((i * 71) + seedOffset * 17) % w);
    const py = y + (((i * 131) + seedOffset * 23) % h);
    const r = 0.6 + ((i % 4) * 0.3);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_CORE = [
  [540, 1140],
  [516, 1078],
  [502, 1002],
  [502, 920],
  [516, 838],
  [542, 760],
  [580, 688],
  [630, 624],
  [688, 566],
  [748, 512],
  [806, 450],
  [864, 378],
  [926, 308],
  [998, 248],
  [1072, 206],
  [1144, 182],
  [1150, 180],
  [1150, -120],
  [132, -120],
  [132, 176],
  [190, 234],
  [244, 302],
  [292, 380],
  [334, 468],
  [370, 558],
  [404, 646],
  [434, 730],
  [462, 812],
  [490, 900],
  [516, 1000],
  [534, 1088]
];

const SOUTH_BEACH = [
  [504, 980],
  [530, 946],
  [570, 934],
  [616, 940],
  [650, 964],
  [664, 1002],
  [654, 1046],
  [620, 1082],
  [572, 1096],
  [528, 1084],
  [504, 1048],
  [498, 1004]
];

const BASIN_RING = [
  [486, 622],
  [514, 568],
  [560, 528],
  [620, 508],
  [684, 516],
  [736, 548],
  [764, 592],
  [762, 642],
  [734, 688],
  [684, 722],
  [620, 738],
  [556, 732],
  [508, 706],
  [486, 664]
];

const BASIN_INNER = [
  [522, 644],
  [548, 612],
  [592, 590],
  [642, 592],
  [684, 612],
  [706, 646],
  [696, 674],
  [662, 696],
  [616, 706],
  [570, 700],
  [534, 680]
];

const SUMMIT_RIDGE = [
  [598, 496],
  [634, 436],
  [682, 382],
  [744, 332],
  [816, 292],
  [894, 266],
  [970, 260],
  [1030, 278],
  [1068, 318],
  [1072, 370],
  [1042, 426],
  [986, 472],
  [912, 502],
  [826, 520],
  [734, 524],
  [648, 516]
];

const FOOTHILL_STROKE_A = [
  [614, 518],
  [658, 494],
  [710, 458],
  [772, 420],
  [842, 390],
  [916, 372],
  [990, 370]
];

const FOOTHILL_STROKE_B = [
  [574, 564],
  [626, 532],
  [686, 496],
  [754, 466],
  [830, 444],
  [908, 434]
];

const RIDGE_HIGHLIGHT = [
  [676, 408],
  [720, 368],
  [778, 334],
  [846, 310],
  [918, 298],
  [986, 300]
];

const WEST_ASCENT_BELT = [
  [470, 882],
  [446, 818],
  [432, 750],
  [422, 684],
  [408, 616],
  [390, 548],
  [366, 480],
  [336, 414],
  [300, 352],
  [258, 292],
  [212, 238]
];

const EAST_ASCENT_BELT = [
  [620, 908],
  [658, 846],
  [704, 786],
  [756, 724],
  [810, 658],
  [866, 582],
  [926, 502],
  [992, 430],
  [1060, 374],
  [1124, 334]
];

const HARBOR_GRASS = [
  [478, 954],
  [500, 914],
  [540, 888],
  [588, 888],
  [626, 908],
  [642, 946],
  [632, 988],
  [594, 1018],
  [548, 1028],
  [504, 1008]
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
    drawTraversalBelts(ctx);
    drawPathBeds(ctx, kernel, projection, destination, pulse);
    drawLandmarks(ctx, kernel, pulse);

    ctx.restore();
  }

  function drawPeninsulaCore(ctx) {
    polygon(ctx, PENINSULA_CORE);
    const ground = ctx.createLinearGradient(0, 180, 0, 1140);
    ground.addColorStop(0, "rgba(184,176,152,1)");
    ground.addColorStop(0.18, "rgba(174,164,136,1)");
    ground.addColorStop(0.42, "rgba(158,152,118,1)");
    ground.addColorStop(0.74, "rgba(142,146,104,1)");
    ground.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(244,232,204,0.28)";
    ctx.stroke();

    polygon(ctx, SOUTH_BEACH);
    ctx.fillStyle = "rgba(216,190,138,0.36)";
    ctx.fill();

    polygon(ctx, HARBOR_GRASS);
    ctx.fillStyle = "rgba(152,162,104,0.12)";
    ctx.fill();
  }

  function drawElevationBands(ctx) {
    polygon(ctx, BASIN_RING);
    const basin = ctx.createLinearGradient(0, 508, 0, 738);
    basin.addColorStop(0, "rgba(176,170,128,0.24)");
    basin.addColorStop(1, "rgba(110,124,88,0.14)");
    ctx.fillStyle = basin;
    ctx.fill();

    polygon(ctx, BASIN_INNER);
    ctx.fillStyle = "rgba(64,86,82,0.10)";
    ctx.fill();

    polygon(ctx, SUMMIT_RIDGE);
    const ridge = ctx.createLinearGradient(0, 260, 0, 524);
    ridge.addColorStop(0, "rgba(222,216,206,0.86)");
    ridge.addColorStop(0.40, "rgba(194,186,170,0.44)");
    ridge.addColorStop(1, "rgba(160,150,136,0.16)");
    ctx.fillStyle = ridge;
    ctx.fill();

    polyline(ctx, FOOTHILL_STROKE_A);
    ctx.strokeStyle = "rgba(244,238,224,0.22)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    polyline(ctx, FOOTHILL_STROKE_B);
    ctx.strokeStyle = "rgba(238,232,216,0.18)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    polyline(ctx, RIDGE_HIGHLIGHT);
    ctx.strokeStyle = "rgba(250,246,236,0.16)";
    ctx.lineWidth = 2.6;
    ctx.stroke();
  }

  function drawSurfaceTexture(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_CORE);
    ctx.clip();

    fillNoiseDots(ctx, { x: 220, y: 200, w: 860, h: 900 }, 520, "rgba(102,116,78,0.05)", 1);
    fillNoiseDots(ctx, { x: 240, y: 220, w: 820, h: 860 }, 360, "rgba(230,216,180,0.045)", 2);

    const contourA = [
      [454, 920], [492, 878], [544, 838], [606, 804], [674, 770], [746, 726], [818, 666], [884, 592]
    ];
    const contourB = [
      [430, 816], [470, 772], [526, 726], [596, 688], [668, 656], [742, 618], [814, 564], [884, 500]
    ];
    const contourC = [
      [404, 706], [448, 664], [508, 624], [582, 592], [658, 566], [736, 534], [812, 486], [888, 430]
    ];

    polyline(ctx, contourA);
    ctx.strokeStyle = "rgba(244,238,220,0.08)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    polyline(ctx, contourB);
    ctx.strokeStyle = "rgba(244,238,220,0.08)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    polyline(ctx, contourC);
    ctx.strokeStyle = "rgba(244,238,220,0.08)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.restore();
  }

  function drawTraversalBelts(ctx) {
    polygon(ctx, WEST_ASCENT_BELT);
    ctx.fillStyle = "rgba(118,140,98,0.12)";
    ctx.fill();

    polygon(ctx, EAST_ASCENT_BELT);
    ctx.fillStyle = "rgba(190,176,126,0.12)";
    ctx.fill();

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
