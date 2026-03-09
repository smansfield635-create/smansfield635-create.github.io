/* DESTINATION FILE: /variant/ground_renderer.js */

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

function fillNoiseDots(ctx, bounds, count, color, seedOffset = 0, maxR = 1.0) {
  const { x, y, w, h } = bounds;
  ctx.fillStyle = color;

  for (let i = 0; i < count; i += 1) {
    const px = x + (((i * 71) + (seedOffset * 17)) % w);
    const py = y + (((i * 131) + (seedOffset * 23)) % h);
    const r = 0.32 + ((i % 4) * (maxR / 5));
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
    const r = 0.46 + ((i % 3) * 0.14);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730],
  [576, 650], [632, 580], [694, 520], [758, 466], [822, 402], [890, 328],
  [958, 260], [1028, 208], [1094, 176], [1144, 164], [1150, 162], [1150, -220],
  [118, -220], [118, 150], [186, 220], [248, 300], [302, 390], [348, 486],
  [384, 584], [414, 676], [442, 760], [468, 842], [494, 928], [516, 1018], [530, 1096]
];

const LOWLAND_ZONE = [
  [492, 1088], [486, 1020], [492, 952], [510, 888], [542, 824], [590, 764],
  [652, 712], [724, 674], [804, 650], [886, 638], [964, 636], [1028, 640],
  [1044, 716], [992, 786], [916, 850], [832, 910], [744, 966], [654, 1016], [570, 1060]
];

const MIDLAND_ZONE = [
  [530, 974], [570, 914], [624, 856], [690, 802], [766, 752], [846, 712],
  [928, 682], [1006, 662], [1070, 656], [1090, 592], [1048, 560], [978, 556],
  [892, 574], [804, 606], [722, 652], [648, 708], [588, 776], [544, 848]
];

const UPLAND_ZONE = [
  [532, 784], [590, 724], [662, 670], [746, 626], [836, 594], [930, 574],
  [1018, 566], [1084, 572], [1112, 520], [1088, 470], [1022, 444], [934, 442],
  [840, 458], [748, 490], [664, 534], [592, 592], [546, 662]
];

const HIGHLAND_ZONE = [
  [566, 640], [632, 582], [714, 530], [808, 490], [908, 464], [1004, 454],
  [1080, 462], [1114, 420], [1094, 376], [1038, 352], [954, 346], [858, 360],
  [762, 392], [676, 438], [610, 496], [572, 560]
];

const CONTOUR_A = [
  [582, 734], [652, 680], [734, 638], [824, 610], [918, 594], [1008, 590]
];

const CONTOUR_B = [
  [618, 688], [694, 642], [782, 608], [874, 590], [966, 588], [1048, 596]
];

const CONTOUR_C = [
  [634, 560], [714, 512], [806, 476], [904, 456], [1000, 456], [1072, 470]
];

const CONTOUR_D = [
  [676, 518], [760, 482], [854, 462], [950, 460], [1038, 472]
];

const VEGETATION_PATCHES = [
  { x: 462, y: 914, w: 84, h: 52, count: 44, color: "rgba(98,124,84,0.15)" },
  { x: 388, y: 754, w: 144, h: 72, count: 66, color: "rgba(98,124,84,0.13)" },
  { x: 458, y: 628, w: 122, h: 74, count: 60, color: "rgba(98,124,84,0.12)" },
  { x: 754, y: 632, w: 78, h: 48, count: 34, color: "rgba(98,124,84,0.11)" },
  { x: 886, y: 520, w: 68, h: 44, count: 26, color: "rgba(98,124,84,0.10)" }
];

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, kernel, projection, destination, tick } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawLandBase(ctx);
    drawTerrainZones(ctx);
    drawSurfaceDetail(ctx);
    drawPaths(ctx, kernel, projection, destination, pulse);
    drawStructuresAndPads(ctx, kernel);

    ctx.restore();
  }

  function drawLandBase(ctx) {
    polygon(ctx, LAND_MASK);

    const base = ctx.createLinearGradient(0, 120, 0, 1120);
    base.addColorStop(0, "rgba(214,206,176,1)");
    base.addColorStop(0.35, "rgba(194,180,132,1)");
    base.addColorStop(0.72, "rgba(150,158,104,1)");
    base.addColorStop(1, "rgba(126,140,92,1)");
    ctx.fillStyle = base;
    ctx.fill();

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(246,236,210,0.22)";
    ctx.stroke();
  }

  function drawTerrainZones(ctx) {
    ctx.save();
    polygon(ctx, LAND_MASK);
    ctx.clip();

    polygon(ctx, LOWLAND_ZONE);
    const low = ctx.createLinearGradient(0, 620, 0, 1160);
    low.addColorStop(0, "rgba(164,170,120,0.04)");
    low.addColorStop(1, "rgba(122,142,94,0.10)");
    ctx.fillStyle = low;
    ctx.fill();

    polygon(ctx, MIDLAND_ZONE);
    const mid = ctx.createLinearGradient(0, 560, 0, 1040);
    mid.addColorStop(0, "rgba(182,170,126,0.06)");
    mid.addColorStop(1, "rgba(134,144,98,0.12)");
    ctx.fillStyle = mid;
    ctx.fill();

    polygon(ctx, UPLAND_ZONE);
    const up = ctx.createLinearGradient(0, 450, 0, 840);
    up.addColorStop(0, "rgba(204,194,160,0.10)");
    up.addColorStop(0.55, "rgba(154,156,116,0.10)");
    up.addColorStop(1, "rgba(118,132,96,0.04)");
    ctx.fillStyle = up;
    ctx.fill();

    polygon(ctx, HIGHLAND_ZONE);
    const high = ctx.createLinearGradient(0, 360, 0, 700);
    high.addColorStop(0, "rgba(230,222,204,0.16)");
    high.addColorStop(0.45, "rgba(186,178,156,0.10)");
    high.addColorStop(1, "rgba(126,134,114,0.03)");
    ctx.fillStyle = high;
    ctx.fill();

    polyline(ctx, CONTOUR_A);
    ctx.strokeStyle = "rgba(244,236,216,0.06)";
    ctx.lineWidth = 1.35;
    ctx.stroke();

    polyline(ctx, CONTOUR_B);
    ctx.strokeStyle = "rgba(238,230,208,0.05)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    polyline(ctx, CONTOUR_C);
    ctx.strokeStyle = "rgba(248,242,226,0.08)";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    polyline(ctx, CONTOUR_D);
    ctx.strokeStyle = "rgba(242,236,220,0.06)";
    ctx.lineWidth = 1.15;
    ctx.stroke();

    ctx.restore();
  }

  function drawSurfaceDetail(ctx) {
    ctx.save();
    polygon(ctx, LAND_MASK);
    ctx.clip();

    for (const patch of VEGETATION_PATCHES) {
      fillMicroDots(ctx, patch, patch.count, patch.color);
    }

    fillNoiseDots(ctx, { x: 210, y: 150, w: 860, h: 970 }, 980, "rgba(110,120,84,0.05)", 1);
    fillNoiseDots(ctx, { x: 250, y: 210, w: 800, h: 900 }, 620, "rgba(232,218,182,0.045)", 2);
    fillNoiseDots(ctx, { x: 280, y: 250, w: 740, h: 840 }, 320, "rgba(154,168,112,0.035)", 3);

    ctx.restore();
  }

  function drawPaths(ctx, kernel, projection, destination, pulse) {
    if (!kernel?.pathsById) return;

    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 24;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(92,72,52,0.24)";
      ctx.stroke();

      polyline(ctx, row.centerline);
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(216,190,136,0.20)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        row.fromRegionId === projection.regionId && row.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        polyline(ctx, row.centerline);
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(250,230,176,${0.18 + (pulse * 0.18)})`;
        ctx.stroke();
      }
    }
  }

  function drawStructuresAndPads(ctx, kernel) {
    if (!kernel?.regionsById) return;

    const rows = [...kernel.regionsById.values()];
    for (const row of rows) {
      const [x, y] = row.centerPoint;

      let fill = "rgba(112,128,102,0.16)";
      let rx = 88;
      let ry = 38;

      if (row.regionId === "harbor_village") {
        fill = "rgba(176,144,112,0.18)";
        rx = 112;
        ry = 38;

        ctx.fillStyle = "rgba(122,84,58,0.94)";
        ctx.fillRect(x - 34, y + 12, 68, 12);
        ctx.fillRect(x - 10, y - 2, 20, 18);
        ctx.fillRect(x - 46, y + 18, 12, 8);
        ctx.fillRect(x + 34, y + 18, 12, 8);
      }

      if (row.regionId === "market_district") {
        fill = "rgba(176,146,102,0.18)";
        rx = 104;
        ry = 46;

        ctx.fillStyle = "rgba(162,114,76,0.96)";
        ctx.fillRect(x - 26, y + 6, 52, 14);
        ctx.fillStyle = "rgba(230,194,132,0.88)";
        ctx.fillRect(x - 18, y - 6, 36, 10);
      }

      if (row.regionId === "exploration_basin") {
        fill = "rgba(110,126,108,0.10)";
        rx = 152;
        ry = 70;
      }

      if (row.regionId === "summit_plaza") {
        fill = "rgba(210,206,198,0.16)";
        rx = 90;
        ry = 32;

        ctx.beginPath();
        ctx.moveTo(x, y - 34);
        ctx.lineTo(x + 12, y + 2);
        ctx.lineTo(x - 12, y + 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(230,222,214,0.92)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }

  return Object.freeze({ draw });
}
