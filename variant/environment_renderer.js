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

function strokeWaveLine(ctx, y, xStart, xEnd, tick, amplitude, wavelength, alpha) {
  ctx.beginPath();
  for (let x = xStart; x <= xEnd; x += 14) {
    const yy = y + Math.sin((x * wavelength) + tick) * amplitude;
    if (x === xStart) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.strokeStyle = `rgba(232,242,246,${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function fillNoiseDots(ctx, bounds, count, color, seedOffset = 0) {
  const { x, y, w, h } = bounds;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const px = x + (((i * 73) + seedOffset * 31) % w);
    const py = y + (((i * 137) + seedOffset * 19) % h);
    const r = 0.6 + ((i % 3) * 0.35);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_OUTLINE = [
  [534, 1160],
  [504, 1092],
  [488, 1012],
  [488, 926],
  [502, 840],
  [530, 760],
  [570, 686],
  [620, 620],
  [678, 562],
  [738, 506],
  [794, 444],
  [850, 370],
  [910, 296],
  [982, 232],
  [1058, 186],
  [1130, 160],
  [1150, 154],
  [1150, -220],
  [118, -220],
  [118, 146],
  [178, 206],
  [236, 274],
  [286, 350],
  [330, 436],
  [368, 524],
  [404, 610],
  [438, 692],
  [466, 774],
  [490, 862],
  [512, 962],
  [528, 1064]
];

const WEST_SHORE = [
  [500, 1088],
  [478, 1016],
  [470, 942],
  [478, 864],
  [498, 784],
  [530, 708],
  [570, 638],
  [616, 574],
  [662, 510],
  [698, 444],
  [722, 374],
  [726, 306],
  [708, 240],
  [668, 180],
  [612, 132],
  [546, 98],
  [472, 70],
  [400, 36],
  [336, 6]
];

const EAST_SHORE = [
  [566, 1088],
  [582, 1018],
  [612, 950],
  [656, 884],
  [712, 820],
  [774, 754],
  [838, 682],
  [902, 604],
  [968, 520],
  [1034, 442],
  [1100, 378],
  [1150, 340]
];

const HARBOR_COVE = [
  [492, 954],
  [514, 918],
  [550, 894],
  [596, 894],
  [636, 916],
  [654, 952],
  [648, 994],
  [620, 1032],
  [578, 1050],
  [532, 1048],
  [500, 1020],
  [490, 986]
];

const BASIN_WATER = [
  [476, 590],
  [500, 552],
  [542, 518],
  [600, 500],
  [662, 506],
  [714, 534],
  [746, 574],
  [748, 620],
  [726, 664],
  [682, 696],
  [624, 712],
  [564, 708],
  [512, 686],
  [482, 646]
];

const INNER_INLET = [
  [602, 900],
  [650, 868],
  [708, 820],
  [766, 756],
  [820, 680],
  [870, 600],
  [918, 520],
  [968, 446],
  [1024, 384],
  [1084, 336],
  [1140, 300]
];

const NORTH_FOG = [
  [118, -36],
  [280, -74],
  [500, -104],
  [774, -104],
  [1024, -66],
  [1150, -8],
  [1150, 258],
  [118, 258]
];

const MOUNTAIN_FOOTHILLS = [
  [560, 520],
  [596, 466],
  [646, 414],
  [708, 362],
  [780, 316],
  [858, 284],
  [936, 272],
  [1002, 286],
  [1044, 324],
  [1052, 378],
  [1024, 434],
  [970, 478],
  [900, 506],
  [820, 522],
  [734, 528],
  [646, 530]
];

const BASIN_SHADOW = [
  [488, 628],
  [524, 666],
  [580, 684],
  [640, 680],
  [694, 660],
  [728, 624],
  [716, 654],
  [680, 686],
  [624, 704],
  [566, 700],
  [516, 680]
];

const WEST_SHELF = [
  [460, 1020],
  [448, 952],
  [456, 880],
  [480, 806],
  [516, 734],
  [560, 664],
  [610, 604],
  [652, 550],
  [682, 488],
  [698, 424],
  [694, 362],
  [672, 302],
  [634, 244],
  [582, 188],
  [526, 144],
  [470, 118],
  [414, 98]
];

const EAST_SHELF = [
  [610, 990],
  [654, 928],
  [708, 862],
  [766, 796],
  [828, 728],
  [892, 652],
  [956, 568],
  [1022, 486],
  [1086, 418],
  [1150, 376]
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
    drawHarborCove(ctx, tick);
    drawBasinWater(ctx, tick);
    drawInnerInlet(ctx, tick);
    drawMountainAtmosphere(ctx);
    drawSurfaceSpeckle(ctx);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, -180, 0, height + 520);
    ocean.addColorStop(0, "rgba(148,200,220,1)");
    ocean.addColorStop(0.24, "rgba(110,172,198,1)");
    ocean.addColorStop(0.56, "rgba(60,116,148,1)");
    ocean.addColorStop(1, "rgba(18,66,96,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2200);

    for (let i = 0; i < 28; i += 1) {
      const y = 220 + (i * 48);
      strokeWaveLine(ctx, y, -360, width + 360, tick * 0.026 + i * 0.45, 2.5, 0.019, 0.05 + ((i % 4) * 0.008));
    }
  }

  function drawBathymetry(ctx, tick) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(214,240,248,0.12)";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(214,240,248,0.12)";
    ctx.lineWidth = 42;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(226,246,252,0.10)";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(226,246,252,0.10)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 5; i += 1) {
      strokeWaveLine(ctx, 930 - (i * 118), 704 + i * 60, 1150, tick * 0.038 + i, 1.4, 0.04, 0.04);
      strokeWaveLine(ctx, 930 - (i * 144), 118, 486 - i * 18, tick * 0.038 + i * 0.8, 1.4, 0.04, 0.04);
    }
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(20, 22);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.18)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 120, 0, 1160);
    land.addColorStop(0, "rgba(184,176,154,1)");
    land.addColorStop(0.18, "rgba(174,166,142,1)");
    land.addColorStop(0.42, "rgba(158,154,120,1)");
    land.addColorStop(0.72, "rgba(142,148,106,1)");
    land.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(244,236,212,0.34)";
    ctx.stroke();

    polygon(ctx, BASIN_SHADOW);
    ctx.fillStyle = "rgba(44,72,68,0.10)";
    ctx.fill();
  }

  function drawCoastalShelves(ctx) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(208,190,148,0.10)";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(208,190,148,0.10)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawCoastalHighlights(ctx) {
    polyline(ctx, WEST_SHORE);
    ctx.strokeStyle = "rgba(246,240,220,0.24)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    polyline(ctx, EAST_SHORE);
    ctx.strokeStyle = "rgba(246,240,220,0.24)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(492, 894, 654, 1050);
    harbor.addColorStop(0, "rgba(126,192,204,0.98)");
    harbor.addColorStop(0.42, "rgba(86,144,164,0.98)");
    harbor.addColorStop(1, "rgba(46,92,120,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 920 + (i * 14), 506, 636, tick * 0.05 + i, 1.8, 0.046, 0.12);
    }
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(476, 500, 748, 712);
    basin.addColorStop(0, "rgba(126,188,202,0.98)");
    basin.addColorStop(0.46, "rgba(84,140,160,0.98)");
    basin.addColorStop(1, "rgba(42,94,122,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 540 + (i * 18), 500, 708, tick * 0.042 + i * 0.9, 2.1, 0.036, 0.10);
    }
  }

  function drawInnerInlet(ctx, tick) {
    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(214,236,246,0.16)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(194,226,238,0.18)";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 3; i += 1) {
      strokeWaveLine(ctx, 820 - (i * 118), 648 + i * 74, 1092, tick * 0.038 + i, 1.4, 0.042, 0.05);
    }
  }

  function drawMountainAtmosphere(ctx) {
    polygon(ctx, MOUNTAIN_FOOTHILLS);
    const peak = ctx.createLinearGradient(0, 272, 0, 530);
    peak.addColorStop(0, "rgba(220,214,204,0.76)");
    peak.addColorStop(0.34, "rgba(194,186,170,0.44)");
    peak.addColorStop(1, "rgba(160,150,136,0.12)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(850, 302, 184, 58, -0.16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,240,0.06)";
    ctx.fill();
  }

  function drawSurfaceSpeckle(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.clip();
    fillNoiseDots(ctx, { x: 220, y: 160, w: 850, h: 950 }, 420, "rgba(110,118,86,0.055)", 1);
    fillNoiseDots(ctx, { x: 260, y: 220, w: 760, h: 860 }, 280, "rgba(224,214,178,0.05)", 2);
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
        ctx.ellipse(x, y + 6, rx + 10 + pulse * 5, ry + 6 + pulse * 2, 0, 0, Math.PI * 2);
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
    const fog = ctx.createLinearGradient(0, -80, 0, 268);
    fog.addColorStop(0, "rgba(248,246,238,0.26)");
    fog.addColorStop(0.56, "rgba(232,238,242,0.08)");
    fog.addColorStop(1, "rgba(232,238,242,0)");
    ctx.fillStyle = fog;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(804, 114, 320, 48, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,238,0.05)";
    ctx.fill();
  }

  return Object.freeze({ draw });
}
