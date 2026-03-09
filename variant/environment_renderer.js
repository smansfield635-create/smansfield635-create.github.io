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
  for (let x = xStart; x <= xEnd; x += 12) {
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
    const px = x + (((i * 73) + (seedOffset * 31)) % w);
    const py = y + (((i * 137) + (seedOffset * 19)) % h);
    const r = 0.55 + ((i % 3) * 0.35);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_OUTLINE = [
  [532, 1160], [500, 1088], [482, 1006], [482, 916], [498, 826], [528, 740], [572, 662],
  [626, 592], [686, 532], [748, 478], [810, 414], [876, 340], [944, 272], [1016, 216],
  [1088, 178], [1142, 160], [1150, 158], [1150, -220], [118, -220], [118, 146], [182, 210],
  [242, 286], [294, 370], [340, 462], [378, 556], [410, 646], [440, 732], [468, 816],
  [492, 906], [514, 1000], [528, 1074]
];

const WEST_SHORE = [
  [496, 1084], [474, 1012], [466, 934], [474, 852], [500, 772], [536, 694], [580, 624],
  [626, 560], [668, 496], [702, 428], [720, 358], [716, 290], [690, 224], [644, 170],
  [588, 130], [526, 102], [458, 76], [394, 46], [332, 12]
];

const EAST_SHORE = [
  [562, 1082], [584, 1006], [620, 932], [668, 860], [726, 790], [792, 722], [860, 652],
  [930, 576], [998, 496], [1062, 422], [1120, 366], [1150, 340]
];

const HARBOR_COVE = [
  [490, 956], [514, 914], [554, 888], [602, 888], [640, 912], [654, 952],
  [646, 998], [614, 1038], [568, 1054], [522, 1048], [494, 1014], [486, 982]
];

const BASIN_WATER = [
  [468, 594], [498, 550], [546, 510], [612, 492], [678, 504], [732, 540], [760, 590],
  [756, 646], [724, 694], [666, 730], [596, 742], [530, 726], [482, 690], [462, 642]
];

const BASIN_SHELF = [
  [462, 624], [500, 568], [558, 528], [628, 514], [696, 530], [750, 572], [776, 628],
  [766, 688], [726, 742], [660, 778], [586, 790], [522, 770], [474, 730], [452, 672]
];

const INNER_INLET = [
  [606, 906], [654, 872], [712, 822], [772, 756], [830, 680], [886, 598],
  [940, 518], [994, 448], [1050, 390], [1104, 344], [1150, 308]
];

const NORTH_FOG = [
  [118, -34], [282, -78], [526, -110], [804, -104], [1040, -64], [1150, -8], [1150, 258], [118, 258]
];

const MOUNTAIN_FOOTHILLS = [
  [522, 594], [574, 532], [642, 472], [724, 414], [810, 366], [896, 332], [974, 320],
  [1036, 334], [1078, 372], [1092, 430], [1068, 492], [1008, 546], [926, 580],
  [834, 600], [736, 608], [632, 606]
];

const RIDGE_SHADOW = [
  [548, 646], [608, 582], [686, 526], [774, 482], [864, 454], [952, 454], [1028, 480],
  [1078, 524], [1086, 578], [1056, 628], [980, 662], [884, 680], [780, 684], [664, 678]
];

const WEST_SHELF = [
  [454, 1014], [440, 944], [446, 868], [470, 790], [506, 714], [550, 646], [598, 586],
  [640, 530], [666, 470], [674, 408], [660, 348], [628, 288], [578, 232],
  [520, 186], [458, 152], [398, 126]
];

const EAST_SHELF = [
  [616, 986], [662, 918], [718, 850], [778, 782], [842, 712], [908, 636],
  [974, 556], [1040, 480], [1104, 416], [1150, 376]
];

const CLIFF_WEST = [
  [436, 928], [466, 876], [506, 824], [552, 768], [602, 708], [648, 646], [684, 582]
];

const CLIFF_EAST = [
  [706, 894], [754, 836], [808, 772], [862, 700], [916, 626], [970, 552], [1020, 490]
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
    const ocean = ctx.createLinearGradient(0, -180, 0, height + 560);
    ocean.addColorStop(0, "rgba(154,210,226,1)");
    ocean.addColorStop(0.18, "rgba(120,188,210,1)");
    ocean.addColorStop(0.46, "rgba(72,134,170,1)");
    ocean.addColorStop(1, "rgba(18,66,96,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2200);

    for (let i = 0; i < 34; i += 1) {
      const y = 210 + (i * 40);
      strokeWaveLine(ctx, y, -360, width + 360, tick * 0.024 + i * 0.4, 2.2, 0.021, 0.05 + ((i % 4) * 0.008));
    }
  }

  function drawBathymetry(ctx, tick) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(220,244,250,0.16)";
    ctx.lineWidth = 42;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(220,244,250,0.16)";
    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.10)";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.10)";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 924 - (i * 116), 704 + (i * 50), 1150, tick * 0.036 + i, 1.2, 0.04, 0.04);
      strokeWaveLine(ctx, 930 - (i * 138), 118, 486 - (i * 18), tick * 0.036 + (i * 0.7), 1.2, 0.04, 0.04);
    }
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(24, 26);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.18)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 100, 0, 1160);
    land.addColorStop(0, "rgba(192,184,160,1)");
    land.addColorStop(0.20, "rgba(178,168,140,1)");
    land.addColorStop(0.46, "rgba(160,154,120,1)");
    land.addColorStop(0.78, "rgba(142,148,106,1)");
    land.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(248,238,216,0.34)";
    ctx.stroke();
  }

  function drawCoastalShelves(ctx) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(214,196,150,0.14)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(214,196,150,0.14)";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawCoastalHighlights(ctx) {
    polyline(ctx, WEST_SHORE);
    ctx.strokeStyle = "rgba(250,244,226,0.24)";
    ctx.lineWidth = 2.3;
    ctx.stroke();

    polyline(ctx, EAST_SHORE);
    ctx.strokeStyle = "rgba(250,244,226,0.24)";
    ctx.lineWidth = 2.3;
    ctx.stroke();
  }

  function drawCliffBands(ctx) {
    polyline(ctx, CLIFF_WEST);
    ctx.strokeStyle = "rgba(98,92,82,0.12)";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_WEST);
    ctx.strokeStyle = "rgba(236,224,194,0.10)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_EAST);
    ctx.strokeStyle = "rgba(98,92,82,0.12)";
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, CLIFF_EAST);
    ctx.strokeStyle = "rgba(236,224,194,0.10)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(490, 888, 654, 1054);
    harbor.addColorStop(0, "rgba(138,202,214,0.98)");
    harbor.addColorStop(0.40, "rgba(92,152,170,0.98)");
    harbor.addColorStop(1, "rgba(44,92,120,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 920 + (i * 14), 504, 636, tick * 0.05 + i, 1.6, 0.046, 0.11);
    }
  }

  function drawBasinShelf(ctx) {
    polygon(ctx, BASIN_SHELF);
    const shelf = ctx.createRadialGradient(610, 642, 60, 610, 642, 190);
    shelf.addColorStop(0, "rgba(124,142,108,0.14)");
    shelf.addColorStop(1, "rgba(124,142,108,0.04)");
    ctx.fillStyle = shelf;
    ctx.fill();
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(468, 492, 760, 742);
    basin.addColorStop(0, "rgba(138,200,214,0.98)");
    basin.addColorStop(0.42, "rgba(92,150,170,0.98)");
    basin.addColorStop(1, "rgba(40,92,120,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2.1;
    ctx.strokeStyle = "rgba(236,244,248,0.36)";
    ctx.stroke();

    for (let i = 0; i < 8; i += 1) {
      strokeWaveLine(ctx, 540 + (i * 17), 496, 712, tick * 0.042 + (i * 0.9), 1.8, 0.038, 0.10);
    }
  }

  function drawInnerInlet(ctx, tick) {
    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(214,236,246,0.18)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(194,226,238,0.18)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 3; i += 1) {
      strokeWaveLine(ctx, 818 - (i * 116), 652 + (i * 74), 1092, tick * 0.038 + i, 1.2, 0.042, 0.045);
    }
  }

  function drawMountainMass(ctx) {
    polygon(ctx, RIDGE_SHADOW);
    const ridgeShadow = ctx.createLinearGradient(0, 454, 0, 684);
    ridgeShadow.addColorStop(0, "rgba(112,108,100,0.18)");
    ridgeShadow.addColorStop(1, "rgba(80,88,84,0.05)");
    ctx.fillStyle = ridgeShadow;
    ctx.fill();

    polygon(ctx, MOUNTAIN_FOOTHILLS);
    const peak = ctx.createLinearGradient(0, 320, 0, 610);
    peak.addColorStop(0, "rgba(226,220,208,0.88)");
    peak.addColorStop(0.28, "rgba(198,188,170,0.50)");
    peak.addColorStop(0.62, "rgba(160,152,138,0.20)");
    peak.addColorStop(1, "rgba(120,126,116,0.06)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(846, 350, 214, 86, -0.10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,246,238,0.06)";
    ctx.fill();
  }

  function drawSurfaceSpeckle(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.clip();
    fillNoiseDots(ctx, { x: 210, y: 150, w: 860, h: 960 }, 760, "rgba(108,118,84,0.05)", 1);
    fillNoiseDots(ctx, { x: 250, y: 210, w: 800, h: 880 }, 460, "rgba(230,216,182,0.045)", 2);
    fillNoiseDots(ctx, { x: 280, y: 250, w: 740, h: 820 }, 280, "rgba(154,166,112,0.035)", 3);
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
