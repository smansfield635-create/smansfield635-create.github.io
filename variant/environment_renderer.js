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
  for (let x = xStart; x <= xEnd; x += 18) {
    const yy = y + Math.sin((x * wavelength) + tick) * amplitude;
    if (x === xStart) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.strokeStyle = `rgba(232,242,246,${alpha})`;
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

const PENINSULA_OUTLINE = [
  [532, 1160],
  [504, 1096],
  [488, 1018],
  [486, 936],
  [498, 854],
  [522, 778],
  [558, 706],
  [604, 640],
  [658, 582],
  [716, 526],
  [772, 464],
  [826, 392],
  [882, 320],
  [948, 256],
  [1018, 206],
  [1088, 174],
  [1150, 154],
  [1150, -220],
  [118, -220],
  [118, 146],
  [176, 202],
  [232, 266],
  [282, 338],
  [324, 420],
  [362, 506],
  [398, 592],
  [432, 672],
  [462, 754],
  [488, 844],
  [510, 948],
  [526, 1058]
];

const WEST_SHORE = [
  [498, 1090],
  [474, 1020],
  [464, 946],
  [470, 868],
  [490, 790],
  [522, 714],
  [562, 642],
  [608, 576],
  [654, 510],
  [690, 442],
  [714, 372],
  [720, 306],
  [706, 244],
  [670, 186],
  [618, 138],
  [558, 102],
  [492, 72],
  [424, 42],
  [360, 12]
];

const EAST_SHORE = [
  [564, 1092],
  [578, 1022],
  [606, 954],
  [648, 886],
  [700, 822],
  [760, 756],
  [822, 686],
  [884, 610],
  [946, 528],
  [1010, 450],
  [1076, 382],
  [1140, 324]
];

const HARBOR_COVE = [
  [490, 954],
  [512, 918],
  [548, 894],
  [594, 892],
  [634, 912],
  [654, 948],
  [650, 990],
  [624, 1028],
  [582, 1048],
  [536, 1046],
  [502, 1020],
  [488, 986]
];

const BASIN_WATER = [
  [474, 594],
  [496, 558],
  [536, 526],
  [592, 510],
  [650, 514],
  [700, 536],
  [732, 572],
  [738, 616],
  [720, 658],
  [680, 690],
  [624, 708],
  [568, 704],
  [516, 686],
  [486, 650]
];

const INNER_INLET = [
  [592, 898],
  [638, 864],
  [692, 812],
  [746, 748],
  [794, 676],
  [838, 598],
  [876, 518],
  [912, 446],
  [952, 382],
  [996, 330],
  [1038, 292],
  [1078, 264],
  [1118, 248]
];

const NORTH_FOG = [
  [118, -30],
  [280, -64],
  [486, -94],
  [744, -96],
  [986, -62],
  [1150, -8],
  [1150, 256],
  [118, 256]
];

const MOUNTAIN_MASS = [
  [594, 484],
  [626, 426],
  [670, 372],
  [726, 322],
  [792, 278],
  [862, 248],
  [930, 238],
  [988, 252],
  [1024, 286],
  [1032, 336],
  [1006, 392],
  [958, 440],
  [896, 476],
  [822, 500],
  [744, 510],
  [668, 506]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOcean(ctx, width, height, tick);
    drawPeninsulaShadow(ctx);
    drawPeninsulaMass(ctx);
    drawCoastalHighlights(ctx);
    drawHarborCove(ctx, tick);
    drawBasinWater(ctx, tick);
    drawInnerInlet(ctx, tick);
    drawMountainAtmosphere(ctx);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, -180, 0, height + 480);
    ocean.addColorStop(0, "rgba(150,198,216,1)");
    ocean.addColorStop(0.24, "rgba(112,170,194,1)");
    ocean.addColorStop(0.56, "rgba(60,114,144,1)");
    ocean.addColorStop(1, "rgba(18,66,94,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2100);

    for (let i = 0; i < 24; i += 1) {
      const y = 230 + (i * 54);
      strokeWaveLine(ctx, y, -320, width + 320, tick * 0.026 + i * 0.55, 2.8, 0.019, 0.055 + ((i % 4) * 0.008));
    }

    const glow = ctx.createRadialGradient(650, 760, 80, 650, 760, 840);
    glow.addColorStop(0, "rgba(244,250,252,0.08)");
    glow.addColorStop(0.46, "rgba(224,238,246,0.03)");
    glow.addColorStop(1, "rgba(224,238,246,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-450, -320, width + 900, height + 1200);
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(18, 20);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.16)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 120, 0, 1160);
    land.addColorStop(0, "rgba(176,170,150,1)");
    land.addColorStop(0.20, "rgba(166,160,136,1)");
    land.addColorStop(0.48, "rgba(150,150,112,1)");
    land.addColorStop(0.76, "rgba(136,144,102,1)");
    land.addColorStop(1, "rgba(124,136,96,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(244,236,212,0.34)";
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
    const harbor = ctx.createLinearGradient(490, 892, 654, 1048);
    harbor.addColorStop(0, "rgba(122,188,200,0.98)");
    harbor.addColorStop(0.45, "rgba(82,140,160,0.98)");
    harbor.addColorStop(1, "rgba(46,92,118,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 5; i += 1) {
      strokeWaveLine(ctx, 920 + (i * 16), 504, 636, tick * 0.05 + i, 1.8, 0.046, 0.12);
    }
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(474, 510, 738, 708);
    basin.addColorStop(0, "rgba(122,186,198,0.98)");
    basin.addColorStop(0.46, "rgba(84,140,160,0.98)");
    basin.addColorStop(1, "rgba(42,94,122,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 544 + (i * 18), 496, 704, tick * 0.042 + i * 0.9, 2.1, 0.036, 0.10);
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
      strokeWaveLine(ctx, 820 - (i * 118), 640 + i * 74, 1088, tick * 0.038 + i, 1.4, 0.042, 0.05);
    }
  }

  function drawMountainAtmosphere(ctx) {
    polygon(ctx, MOUNTAIN_MASS);
    const peak = ctx.createLinearGradient(0, 238, 0, 510);
    peak.addColorStop(0, "rgba(220,214,204,0.70)");
    peak.addColorStop(0.40, "rgba(194,186,170,0.34)");
    peak.addColorStop(1, "rgba(160,150,136,0.10)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(852, 304, 180, 54, -0.16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,240,0.06)";
    ctx.fill();
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
