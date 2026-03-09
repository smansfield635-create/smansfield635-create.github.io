function polygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

function polyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
}

function strokeWaveLine(ctx, y, xStart, xEnd, tick, amplitude, wavelength, alpha, step = 12) {
  ctx.beginPath();
  for (let x = xStart; x <= xEnd; x += step) {
    const yy = y + Math.sin((x * wavelength) + tick) * amplitude;
    if (x === xStart) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.strokeStyle = `rgba(236,244,248,${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function fillNoiseDots(ctx, bounds, count, color, seedOffset = 0, maxR = 1.1) {
  const { x, y, w, h } = bounds;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const px = x + (((i * 73) + (seedOffset * 31)) % w);
    const py = y + (((i * 137) + (seedOffset * 19)) % h);
    const r = 0.4 + ((i % 4) * (maxR / 5));
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_OUTLINE = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730], [576, 650],
  [632, 580], [694, 520], [758, 466], [822, 402], [890, 328], [958, 260], [1028, 208],
  [1094, 176], [1144, 164], [1150, 162], [1150, -220], [118, -220], [118, 150], [186, 220],
  [248, 300], [302, 390], [348, 486], [384, 584], [414, 676], [442, 760], [468, 842],
  [494, 928], [516, 1018], [530, 1096]
];

const WEST_SHORE = [
  [494, 1088], [472, 1010], [464, 928], [474, 844], [500, 762], [538, 682], [584, 610],
  [630, 548], [670, 486], [700, 420], [714, 352], [706, 288], [676, 228], [628, 176],
  [570, 136], [508, 108], [444, 82], [384, 52], [326, 16]
];

const EAST_SHORE = [
  [562, 1086], [586, 1008], [624, 932], [674, 858], [734, 788], [802, 720], [870, 650],
  [938, 576], [1006, 498], [1070, 424], [1128, 370], [1150, 350]
];

const HARBOR_COVE = [
  [488, 958], [512, 914], [554, 886], [606, 886], [644, 912], [656, 954],
  [646, 1000], [612, 1040], [562, 1054], [518, 1046], [492, 1010], [484, 980]
];

const BASIN_WATER = [
  [466, 596], [498, 548], [550, 506], [618, 488], [688, 502], [742, 544], [770, 598],
  [764, 656], [728, 708], [664, 744], [590, 754], [526, 732], [478, 692], [458, 640]
];

const BASIN_SHELF = [
  [460, 626], [500, 566], [562, 522], [636, 508], [706, 528], [760, 576], [784, 638],
  [770, 706], [724, 764], [650, 800], [572, 808], [508, 784], [462, 738], [444, 674]
];

const INNER_INLET = [
  [610, 912], [660, 878], [718, 826], [778, 758], [838, 678], [894, 596],
  [948, 518], [1000, 452], [1052, 398], [1102, 354], [1150, 320]
];

const NORTH_FOG = [
  [118, -34], [286, -82], [538, -116], [820, -108], [1052, -62], [1150, -10], [1150, 264], [118, 264]
];

const MOUNTAIN_FOOTHILLS = [
  [506, 652], [572, 580], [658, 514], [758, 456], [860, 414], [956, 398],
  [1034, 412], [1086, 454], [1102, 514], [1078, 578], [1014, 632],
  [922, 668], [814, 690], [700, 694], [590, 684]
];

const RIDGE_SHADOW = [
  [530, 708], [602, 640], [694, 582], [796, 538], [900, 516], [998, 526],
  [1072, 568], [1110, 628], [1100, 690], [1032, 740], [930, 770], [810, 782], [682, 772], [578, 748]
];

const WEST_SHELF = [
  [450, 1018], [436, 944], [444, 866], [470, 786], [508, 710], [554, 642], [604, 584],
  [644, 528], [668, 470], [672, 412], [656, 354], [622, 296], [570, 242], [512, 198], [452, 164], [392, 136]
];

const EAST_SHELF = [
  [620, 990], [666, 920], [724, 850], [786, 780], [850, 710], [916, 636], [982, 558],
  [1048, 482], [1110, 420], [1150, 388]
];

const CLIFF_WEST = [
  [430, 938], [466, 880], [514, 822], [568, 762], [622, 700], [666, 640], [696, 584]
];

const CLIFF_EAST = [
  [706, 904], [758, 842], [816, 776], [874, 704], [930, 628], [986, 554], [1038, 494]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOcean(ctx, width, height, tick);
    drawBathymetry(ctx, tick);
    drawPeninsulaShadow(ctx);
    drawPeninsulaMass(ctx);
    drawCoastalShelves(ctx);
    drawCoastalHighlights(ctx);
    drawCliffBands(ctx);
    drawHarborCove(ctx, tick);
    drawBasinShelf(ctx);
    drawBasinWater(ctx, tick);
    drawInnerInlet(ctx, tick);
    drawMountainMass(ctx);
    drawSurfaceSpeckle(ctx);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, -180, 0, height + 580);
    ocean.addColorStop(0, "rgba(160,214,230,1)");
    ocean.addColorStop(0.18, "rgba(126,194,214,1)");
    ocean.addColorStop(0.44, "rgba(78,140,176,1)");
    ocean.addColorStop(1, "rgba(18,68,98,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2200);

    for (let i = 0; i < 38; i += 1) {
      const y = 200 + (i * 36);
      strokeWaveLine(ctx, y, -380, width + 380, tick * 0.023 + (i * 0.36), 2.0, 0.021, 0.046 + ((i % 4) * 0.008), 10);
    }
  }

  function drawBathymetry(ctx, tick) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(224,246,252,0.18)";
    ctx.lineWidth = 46;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(224,246,252,0.18)";
    ctx.lineWidth = 54;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.10)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.10)";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 920 - (i * 108), 708 + (i * 46), 1150, tick * 0.036 + i, 1.15, 0.040, 0.04, 10);
      strokeWaveLine(ctx, 924 - (i * 132), 118, 488 - (i * 16), tick * 0.036 + (i * 0.7), 1.15, 0.040, 0.04, 10);
    }
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(26, 28);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.20)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 96, 0, 1160);
    land.addColorStop(0, "rgba(198,188,162,1)");
    land.addColorStop(0.20, "rgba(182,170,140,1)");
    land.addColorStop(0.44, "rgba(162,154,120,1)");
    land.addColorStop(0.78, "rgba(142,148,106,1)");
    land.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgba(248,240,220,0.34)";
    ctx.stroke();
  }

  function drawCoastalShelves(ctx) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(218,198,150,0.16)";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(218,198,150,0.16)";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawCoastalHighlights(ctx) {
    polyline(ctx, WEST_SHORE);
    ctx.strokeStyle = "rgba(252,246,230,0.28)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    polyline(ctx, EAST_SHORE);
    ctx.strokeStyle = "rgba(252,246,230,0.28)";
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  function drawCliffBands(ctx) {
    polyline(ctx, CLIFF_WEST);
    ctx.strokeStyle = "rgba(92,88,78,0.16)";
    ctx.lineWidth = 28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_WEST);
    ctx.strokeStyle = "rgba(242,228,196,0.10)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_EAST);
    ctx.strokeStyle = "rgba(92,88,78,0.16)";
    ctx.lineWidth = 28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_EAST);
    ctx.strokeStyle = "rgba(242,228,196,0.10)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 886, 656, 1054);
    harbor.addColorStop(0, "rgba(146,206,218,0.98)");
    harbor.addColorStop(0.38, "rgba(96,156,174,0.98)");
    harbor.addColorStop(1, "rgba(42,92,120,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(238,246,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 918 + (i * 13), 504, 636, tick * 0.05 + i, 1.45, 0.046, 0.11, 10);
    }
  }

  function drawBasinShelf(ctx) {
    polygon(ctx, BASIN_SHELF);
    const shelf = ctx.createRadialGradient(608, 654, 50, 608, 654, 210);
    shelf.addColorStop(0, "rgba(130,146,108,0.18)");
    shelf.addColorStop(1, "rgba(130,146,108,0.05)");
    ctx.fillStyle = shelf;
    ctx.fill();
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(466, 492, 760, 754);
    basin.addColorStop(0, "rgba(144,204,218,0.98)");
    basin.addColorStop(0.40, "rgba(96,154,174,0.98)");
    basin.addColorStop(1, "rgba(38,90,120,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(238,246,248,0.36)";
    ctx.stroke();

    for (let i = 0; i < 9; i += 1) {
      strokeWaveLine(ctx, 536 + (i * 16), 496, 714, tick * 0.042 + (i * 0.9), 1.6, 0.038, 0.10, 10);
    }
  }

  function drawInnerInlet(ctx, tick) {
    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(214,238,246,0.18)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(196,228,238,0.18)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 4; i += 1) {
      strokeWaveLine(ctx, 818 - (i * 108), 654 + (i * 70), 1094, tick * 0.038 + i, 1.0, 0.042, 0.042, 10);
    }
  }

  function drawMountainMass(ctx) {
    polygon(ctx, RIDGE_SHADOW);
    const ridgeShadow = ctx.createLinearGradient(0, 516, 0, 788);
    ridgeShadow.addColorStop(0, "rgba(100,98,92,0.20)");
    ridgeShadow.addColorStop(1, "rgba(74,82,78,0.05)");
    ctx.fillStyle = ridgeShadow;
    ctx.fill();

    polygon(ctx, MOUNTAIN_FOOTHILLS);
    const peak = ctx.createLinearGradient(0, 396, 0, 696);
    peak.addColorStop(0, "rgba(230,224,210,0.90)");
    peak.addColorStop(0.28, "rgba(202,190,172,0.52)");
    peak.addColorStop(0.62, "rgba(160,150,138,0.22)");
    peak.addColorStop(1, "rgba(120,126,116,0.06)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(842, 410, 230, 98, -0.08, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,246,238,0.06)";
    ctx.fill();
  }

  function drawSurfaceSpeckle(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.clip();
    fillNoiseDots(ctx, { x: 210, y: 150, w: 860, h: 970 }, 980, "rgba(110,120,84,0.05)", 1, 1.3);
    fillNoiseDots(ctx, { x: 250, y: 210, w: 800, h: 900 }, 620, "rgba(232,218,182,0.045)", 2, 1.0);
    fillNoiseDots(ctx, { x: 280, y: 250, w: 740, h: 840 }, 320, "rgba(154,168,112,0.035)", 3, 1.1);
    ctx.restore();
  }

  function drawRouteBeds(ctx, kernel) {
    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 30;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(84,72,56,0.14)";
      ctx.stroke();
    }
  }

  function drawRegionPads(ctx, kernel, projection, selection, destination, tick) {
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);
    const rows = [...kernel.regionsById.values()];

    for (const row of rows) {
      const [x, y] = row.centerPoint;
      const isActive = projection?.regionId === row.regionId;
      const isSelected = selection?.kind === "region" && selection.regionId === row.regionId;
      const isDestination = destination?.regionId === row.regionId;

      let fill = "rgba(112,128,102,0.18)";
      let rx = 88;
      let ry = 38;

      if (row.regionId === "harbor_village") {
        fill = "rgba(176,144,112,0.20)";
        rx = 112;
        ry = 38;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(176,146,102,0.18)";
        rx = 104;
        ry = 46;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(110,126,108,0.12)";
        rx = 152;
        ry = 70;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(210,206,198,0.18)";
        rx = 90;
        ry = 32;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 6, rx + 10 + (pulse * 5), ry + 6 + (pulse * 2), 0, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,244,220,0.92)"
          : isActive
            ? "rgba(255,232,188,0.72)"
            : "rgba(214,236,248,0.62)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  function drawNorthAtmosphere(ctx) {
    polygon(ctx, NORTH_FOG);
    const fog = ctx.createLinearGradient(0, -90, 0, 274);
    fog.addColorStop(0, "rgba(248,246,238,0.28)");
    fog.addColorStop(0.56, "rgba(232,238,242,0.08)");
    fog.addColorStop(1, "rgba(232,238,242,0)");
    ctx.fillStyle = fog;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(804, 116, 332, 50, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,238,0.05)";
    ctx.fill();
  }

  return Object.freeze({ draw });
}
