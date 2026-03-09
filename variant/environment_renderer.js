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
    const px = x + (((i * 73) + seedOffset * 31) % w);
    const py = y + (((i * 137) + seedOffset * 19) % h);
    const r = 0.55 + ((i % 3) * 0.35);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PENINSULA_OUTLINE = [
  [534, 1160],
  [502, 1090],
  [484, 1008],
  [484, 920],
  [498, 832],
  [528, 748],
  [570, 672],
  [624, 604],
  [684, 544],
  [744, 490],
  [804, 426],
  [866, 350],
  [932, 278],
  [1006, 218],
  [1082, 178],
  [1140, 158],
  [1150, 154],
  [1150, -220],
  [118, -220],
  [118, 148],
  [180, 210],
  [238, 282],
  [290, 362],
  [336, 452],
  [374, 546],
  [408, 636],
  [438, 720],
  [466, 804],
  [492, 894],
  [514, 992],
  [528, 1070]
];

const WEST_SHORE = [
  [498, 1086],
  [476, 1014],
  [468, 938],
  [476, 858],
  [500, 780],
  [534, 704],
  [578, 634],
  [624, 570],
  [666, 506],
  [700, 438],
  [720, 368],
  [720, 300],
  [698, 234],
  [654, 176],
  [598, 132],
  [534, 102],
  [464, 74],
  [398, 42],
  [334, 10]
];

const EAST_SHORE = [
  [564, 1084],
  [584, 1010],
  [618, 938],
  [664, 868],
  [720, 800],
  [786, 732],
  [852, 662],
  [920, 586],
  [988, 504],
  [1054, 428],
  [1116, 370],
  [1150, 342]
];

const HARBOR_COVE = [
  [492, 956],
  [514, 916],
  [552, 890],
  [598, 890],
  [636, 912],
  [652, 950],
  [646, 994],
  [616, 1034],
  [572, 1052],
  [526, 1048],
  [496, 1018],
  [488, 984]
];

const BASIN_WATER = [
  [472, 592],
  [500, 550],
  [546, 514],
  [608, 496],
  [672, 504],
  [724, 536],
  [754, 582],
  [754, 632],
  [728, 678],
  [678, 714],
  [614, 732],
  [552, 724],
  [502, 696],
  [476, 648]
];

const BASIN_SHELF = [
  [468, 624],
  [502, 574],
  [556, 536],
  [622, 520],
  [688, 530],
  [742, 566],
  [770, 618],
  [764, 674],
  [730, 724],
  [670, 758],
  [600, 770],
  [534, 756],
  [486, 724],
  [462, 674]
];

const INNER_INLET = [
  [604, 904],
  [652, 870],
  [708, 820],
  [768, 754],
  [826, 678],
  [880, 596],
  [934, 514],
  [990, 442],
  [1048, 384],
  [1104, 340],
  [1150, 308]
];

const NORTH_FOG = [
  [118, -36],
  [280, -76],
  [520, -108],
  [798, -104],
  [1038, -64],
  [1150, -8],
  [1150, 258],
  [118, 258]
];

const MOUNTAIN_FOOTHILLS = [
  [540, 546],
  [584, 490],
  [642, 434],
  [714, 380],
  [794, 330],
  [876, 296],
  [954, 282],
  [1020, 296],
  [1064, 334],
  [1078, 392],
  [1052, 452],
  [992, 502],
  [914, 532],
  [828, 548],
  [736, 554],
  [642, 554]
];

const RIDGE_SHADOW = [
  [560, 590],
  [616, 534],
  [684, 484],
  [762, 438],
  [846, 402],
  [930, 386],
  [1008, 392],
  [1062, 420],
  [1084, 464],
  [1068, 510],
  [1012, 546],
  [934, 568],
  [846, 580],
  [752, 584],
  [654, 586]
];

const WEST_SHELF = [
  [458, 1016],
  [444, 946],
  [450, 872],
  [472, 796],
  [506, 722],
  [550, 654],
  [598, 594],
  [640, 536],
  [668, 474],
  [678, 410],
  [666, 348],
  [636, 288],
  [588, 230],
  [530, 182],
  [468, 148],
  [406, 120]
];

const EAST_SHELF = [
  [614, 988],
  [658, 922],
  [714, 854],
  [774, 786],
  [838, 716],
  [904, 638],
  [970, 556],
  [1038, 478],
  [1102, 412],
  [1150, 372]
];

const HILL_PATCH_A = [
  [468, 942],
  [510, 900],
  [574, 880],
  [636, 890],
  [682, 926],
  [688, 970],
  [652, 1004],
  [594, 1022],
  [530, 1018],
  [482, 990]
];

const HILL_PATCH_B = [
  [390, 798],
  [432, 748],
  [494, 714],
  [566, 706],
  [630, 726],
  [662, 764],
  [650, 808],
  [598, 842],
  [524, 856],
  [450, 844]
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
    ocean.addColorStop(0, "rgba(150,206,224,1)");
    ocean.addColorStop(0.20, "rgba(116,182,206,1)");
    ocean.addColorStop(0.48, "rgba(68,128,164,1)");
    ocean.addColorStop(1, "rgba(18,66,96,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2200);

    for (let i = 0; i < 30; i += 1) {
      const y = 214 + (i * 44);
      strokeWaveLine(ctx, y, -360, width + 360, tick * 0.024 + i * 0.42, 2.3, 0.020, 0.05 + ((i % 4) * 0.008));
    }
  }

  function drawBathymetry(ctx, tick) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(214,240,248,0.14)";
    ctx.lineWidth = 38;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(214,240,248,0.14)";
    ctx.lineWidth = 46;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(232,248,252,0.10)";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(232,248,252,0.10)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    for (let i = 0; i < 5; i += 1) {
      strokeWaveLine(ctx, 930 - (i * 122), 710 + i * 54, 1150, tick * 0.036 + i, 1.2, 0.04, 0.04);
      strokeWaveLine(ctx, 930 - (i * 142), 118, 486 - i * 20, tick * 0.036 + i * 0.7, 1.2, 0.04, 0.04);
    }
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(22, 24);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.18)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 110, 0, 1160);
    land.addColorStop(0, "rgba(188,180,158,1)");
    land.addColorStop(0.20, "rgba(176,166,140,1)");
    land.addColorStop(0.44, "rgba(160,154,120,1)");
    land.addColorStop(0.76, "rgba(142,148,106,1)");
    land.addColorStop(1, "rgba(126,140,98,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(248,238,216,0.34)";
    ctx.stroke();

    polygon(ctx, HILL_PATCH_A);
    ctx.fillStyle = "rgba(110,132,92,0.10)";
    ctx.fill();

    polygon(ctx, HILL_PATCH_B);
    ctx.fillStyle = "rgba(128,144,98,0.08)";
    ctx.fill();
  }

  function drawCoastalShelves(ctx) {
    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(208,190,148,0.12)";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, EAST_SHELF);
    ctx.strokeStyle = "rgba(208,190,148,0.12)";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function drawCoastalHighlights(ctx) {
    polyline(ctx, WEST_SHORE);
    ctx.strokeStyle = "rgba(248,242,224,0.24)";
    ctx.lineWidth = 2.3;
    ctx.stroke();

    polyline(ctx, EAST_SHORE);
    ctx.strokeStyle = "rgba(248,242,224,0.24)";
    ctx.lineWidth = 2.3;
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(492, 890, 652, 1052);
    harbor.addColorStop(0, "rgba(132,198,210,0.98)");
    harbor.addColorStop(0.40, "rgba(88,148,168,0.98)");
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
    ctx.fillStyle = "rgba(132,154,118,0.10)";
    ctx.fill();
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(472, 496, 754, 732);
    basin.addColorStop(0, "rgba(132,196,210,0.98)");
    basin.addColorStop(0.42, "rgba(88,146,168,0.98)");
    basin.addColorStop(1, "rgba(40,92,120,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2.1;
    ctx.strokeStyle = "rgba(236,244,248,0.36)";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 540 + (i * 18), 500, 710, tick * 0.042 + i * 0.9, 1.9, 0.038, 0.10);
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
      strokeWaveLine(ctx, 818 - (i * 116), 652 + i * 74, 1092, tick * 0.038 + i, 1.2, 0.042, 0.045);
    }
  }

  function drawMountainMass(ctx) {
    polygon(ctx, RIDGE_SHADOW);
    const ridgeShadow = ctx.createLinearGradient(0, 388, 0, 590);
    ridgeShadow.addColorStop(0, "rgba(116,112,102,0.14)");
    ridgeShadow.addColorStop(1, "rgba(82,90,84,0.04)");
    ctx.fillStyle = ridgeShadow;
    ctx.fill();

    polygon(ctx, MOUNTAIN_FOOTHILLS);
    const peak = ctx.createLinearGradient(0, 280, 0, 556);
    peak.addColorStop(0, "rgba(224,218,206,0.82)");
    peak.addColorStop(0.30, "rgba(198,188,170,0.46)");
    peak.addColorStop(0.64, "rgba(162,154,138,0.18)");
    peak.addColorStop(1, "rgba(120,126,116,0.06)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(846, 320, 196, 68, -0.12, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,246,238,0.05)";
    ctx.fill();
  }

  function drawSurfaceSpeckle(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.clip();
    fillNoiseDots(ctx, { x: 210, y: 150, w: 860, h: 960 }, 620, "rgba(108,118,84,0.05)", 1);
    fillNoiseDots(ctx, { x: 250, y: 210, w: 800, h: 880 }, 420, "rgba(230,216,182,0.045)", 2);
    fillNoiseDots(ctx, { x: 280, y: 250, w: 740, h: 820 }, 240, "rgba(154,166,112,0.035)", 3);
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
