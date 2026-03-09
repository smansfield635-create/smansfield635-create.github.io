function appendPolygonPath(ctx, points) {
  if (!points.length) return;
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

function polygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  appendPolygonPath(ctx, points);
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

function fillMicroVegetation(ctx, patches) {
  for (const patch of patches) {
    const { x, y, w, h, count, color } = patch;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i += 1) {
      const px = x + ((i * 29) % w);
      const py = y + ((i * 47) % h);
      const r = 0.55 + ((i % 3) * 0.18);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const PENINSULA_LAND_MASK = [
  [534, 1160], [500, 1088], [482, 1002], [482, 910], [500, 818], [532, 730], [576, 650],
  [632, 580], [694, 520], [758, 466], [822, 402], [890, 328], [958, 260], [1028, 208],
  [1094, 176], [1144, 164], [1150, 162], [1150, -220], [118, -220], [118, 150], [186, 220],
  [248, 300], [302, 390], [348, 486], [384, 584], [414, 676], [442, 760], [468, 842],
  [494, 928], [516, 1018], [530, 1096]
];

const COASTLINE_PATH_AUTHORITY = Object.freeze({
  west: [
    [534, 1160], [500, 1088], [472, 1010], [464, 928], [474, 844], [500, 762], [538, 682],
    [584, 610], [630, 548], [670, 486], [700, 420], [714, 352], [706, 288], [676, 228],
    [628, 176], [570, 136], [508, 108], [444, 82], [384, 52], [326, 16]
  ],
  east: [
    [534, 1160], [562, 1086], [586, 1008], [624, 932], [674, 858], [734, 788], [802, 720],
    [870, 650], [938, 576], [1006, 498], [1070, 424], [1128, 370], [1150, 350]
  ]
});

const WEST_SHELF = [
  [450, 1018], [436, 944], [444, 866], [470, 786], [508, 710], [554, 642], [604, 584],
  [644, 528], [668, 470], [672, 412], [656, 354], [622, 296], [570, 242], [512, 198], [452, 164], [392, 136]
];

const HARBOR_COVE = [
  [488, 958], [512, 914], [554, 886], [606, 886], [644, 912], [656, 954],
  [646, 1000], [612, 1040], [562, 1054], [518, 1046], [492, 1010], [484, 980]
];

const BASIN_WATER = [
  [466, 596], [498, 548], [550, 506], [618, 488], [688, 502], [742, 544], [770, 598],
  [764, 656], [728, 708], [664, 744], [590, 754], [526, 732], [478, 692], [458, 640]
];

const NORTH_FOG = [
  [118, -34], [286, -82], [538, -116], [820, -108], [1052, -62], [1150, -10], [1150, 264], [118, 264]
];

const INNER_INLET = [
  [610, 912], [660, 878], [718, 826], [778, 758], [838, 678], [894, 596],
  [948, 518], [1000, 452], [1052, 398], [1102, 354], [1150, 320]
];

const MICRO_VEGETATION_PATCHES = [
  { x: 462, y: 914, w: 84, h: 52, count: 44, color: "rgba(98,124,84,0.15)" },
  { x: 388, y: 754, w: 144, h: 72, count: 66, color: "rgba(98,124,84,0.13)" },
  { x: 458, y: 628, w: 122, h: 74, count: 60, color: "rgba(98,124,84,0.12)" },
  { x: 754, y: 632, w: 78, h: 48, count: 34, color: "rgba(98,124,84,0.11)" },
  { x: 886, y: 520, w: 68, h: 44, count: 26, color: "rgba(98,124,84,0.10)" }
];

const TERRAIN_BAND_HARBOR = [
  [494, 1088], [486, 1018], [490, 944], [510, 878], [544, 816], [592, 760],
  [648, 712], [708, 672], [772, 640], [836, 616], [898, 600], [946, 594],
  [930, 684], [874, 748], [806, 814], [732, 882], [658, 946], [588, 1008],
  [538, 1066]
];

const TERRAIN_BAND_MARKET = [
  [520, 974], [556, 910], [606, 848], [664, 786], [730, 728], [800, 676],
  [872, 632], [944, 600], [1006, 582], [1034, 574], [1030, 516], [982, 520],
  [916, 544], [844, 588], [772, 642], [704, 704], [642, 772], [588, 842],
  [548, 912]
];

const TERRAIN_BAND_BASIN = [
  [500, 768], [548, 706], [612, 648], [688, 594], [772, 550], [858, 516],
  [946, 492], [1024, 482], [1080, 488], [1102, 548], [1060, 606], [992, 648],
  [910, 680], [824, 704], [734, 724], [646, 746], [566, 770]
];

const TERRAIN_BAND_SUMMIT = [
  [532, 646], [590, 590], [666, 536], [756, 488], [850, 452], [946, 430],
  [1032, 428], [1094, 446], [1110, 506], [1068, 560], [992, 598], [900, 624],
  [804, 640], [708, 650], [614, 654]
];

const TERRAIN_CONTOUR_BASIN_A = [
  [552, 742], [624, 686], [708, 638], [798, 600], [890, 574], [980, 562]
];

const TERRAIN_CONTOUR_BASIN_B = [
  [584, 706], [660, 654], [748, 614], [840, 586], [932, 572], [1016, 572]
];

const TERRAIN_CONTOUR_SUMMIT_A = [
  [612, 628], [694, 576], [788, 532], [888, 500], [988, 486], [1068, 490]
];

const TERRAIN_CONTOUR_SUMMIT_B = [
  [650, 596], [738, 550], [836, 516], [938, 496], [1034, 494]
];

function clipOceanArea(ctx, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(-2400, -2400, width + 4800, height + 4800);
  appendPolygonPath(ctx, PENINSULA_LAND_MASK);
  ctx.clip("evenodd");
}

function drawShorelineSediment(ctx) {
  const SEDIMENT_WEST = [
    [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
    [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
    [702, 360], [690, 290], [662, 220], [620, 170]
  ];

  const SEDIMENT_EAST = [
    [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
    [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
  ];

  function sedimentBand(points, inset) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    for (let i = points.length - 1; i >= 0; i -= 1) ctx.lineTo(points[i][0] - inset, points[i][1]);
    ctx.closePath();

    const g = ctx.createLinearGradient(0, 0, 0, 1200);
    g.addColorStop(0, "rgba(156,132,96,0.22)");
    g.addColorStop(1, "rgba(120,104,78,0.14)");
    ctx.fillStyle = g;
    ctx.fill();
  }

  ctx.save();
  polygon(ctx, PENINSULA_LAND_MASK);
  ctx.clip();
  sedimentBand(SEDIMENT_WEST, 18);
  sedimentBand(SEDIMENT_EAST, 14);
  ctx.restore();
}

function drawTerrainBands(ctx) {
  ctx.save();
  polygon(ctx, PENINSULA_LAND_MASK);
  ctx.clip();

  polygon(ctx, TERRAIN_BAND_HARBOR);
  const harborLow = ctx.createLinearGradient(0, 600, 0, 1160);
  harborLow.addColorStop(0, "rgba(150,160,112,0.06)");
  harborLow.addColorStop(1, "rgba(112,130,88,0.16)");
  ctx.fillStyle = harborLow;
  ctx.fill();

  polygon(ctx, TERRAIN_BAND_MARKET);
  const coastalRise = ctx.createLinearGradient(0, 560, 0, 1040);
  coastalRise.addColorStop(0, "rgba(170,156,114,0.06)");
  coastalRise.addColorStop(1, "rgba(126,134,92,0.14)");
  ctx.fillStyle = coastalRise;
  ctx.fill();

  polygon(ctx, TERRAIN_BAND_BASIN);
  const basinRise = ctx.createLinearGradient(0, 480, 0, 820);
  basinRise.addColorStop(0, "rgba(194,184,148,0.16)");
  basinRise.addColorStop(0.55, "rgba(150,152,110,0.12)");
  basinRise.addColorStop(1, "rgba(118,132,96,0.05)");
  ctx.fillStyle = basinRise;
  ctx.fill();

  polygon(ctx, TERRAIN_BAND_SUMMIT);
  const summitRise = ctx.createLinearGradient(0, 420, 0, 700);
  summitRise.addColorStop(0, "rgba(228,220,202,0.22)");
  summitRise.addColorStop(0.45, "rgba(184,176,154,0.14)");
  summitRise.addColorStop(1, "rgba(126,134,114,0.04)");
  ctx.fillStyle = summitRise;
  ctx.fill();

  polyline(ctx, TERRAIN_CONTOUR_BASIN_A);
  ctx.strokeStyle = "rgba(246,238,218,0.08)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOUR_BASIN_B);
  ctx.strokeStyle = "rgba(240,232,210,0.07)";
  ctx.lineWidth = 1.25;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOUR_SUMMIT_A);
  ctx.strokeStyle = "rgba(248,242,226,0.10)";
  ctx.lineWidth = 1.35;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOUR_SUMMIT_B);
  ctx.strokeStyle = "rgba(244,236,220,0.08)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOcean(ctx, width, height, tick);
    drawInnerCoastalWater(ctx, tick);
    drawShorelineSediment(ctx);
    drawLandShadow(ctx);
    drawTerrainBands(ctx);
    drawVegetation(ctx);
    drawSurfaceSpeckle(ctx);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    clipOceanArea(ctx, width, height);

    const ocean = ctx.createLinearGradient(0, -180, 0, height + 580);
    ocean.addColorStop(0, "rgba(160,214,230,1)");
    ocean.addColorStop(0.18, "rgba(126,194,214,1)");
    ocean.addColorStop(0.44, "rgba(78,140,176,1)");
    ocean.addColorStop(1, "rgba(18,68,98,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1300, -320, width + 2600, height + 2200);

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(224,246,252,0.08)";
    ctx.lineWidth = 28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.04)";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, COASTLINE_PATH_AUTHORITY.west);
    ctx.strokeStyle = "rgba(252,246,230,0.16)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 930 - (i * 136), 118, 470 - (i * 12), tick * 0.036 + (i * 0.5), 0.8, 0.040, 0.022, 10);
    }

    ctx.restore();
  }

  function drawInnerCoastalWater(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 886, 656, 1054);
    harbor.addColorStop(0, "rgba(146,206,218,0.94)");
    harbor.addColorStop(0.38, "rgba(96,156,174,0.94)");
    harbor.addColorStop(1, "rgba(42,92,120,0.94)");
    ctx.fillStyle = harbor;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(238,246,248,0.08)";
    ctx.stroke();

    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(466, 492, 760, 754);
    basin.addColorStop(0, "rgba(144,204,218,0.96)");
    basin.addColorStop(0.40, "rgba(96,154,174,0.96)");
    basin.addColorStop(1, "rgba(38,90,120,0.96)");
    ctx.fillStyle = basin;
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(238,246,248,0.12)";
    ctx.stroke();

    for (let i = 0; i < 4; i += 1) {
      strokeWaveLine(ctx, 548 + (i * 18), 516, 690, tick * 0.042 + (i * 0.8), 0.8, 0.038, 0.035, 10);
    }

    clipOceanArea(ctx, 1400, 1400);
    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(196,228,238,0.03)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawLandShadow(ctx) {
    ctx.save();
    ctx.translate(26, 28);
    polygon(ctx, PENINSULA_LAND_MASK);
    ctx.fillStyle = "rgba(8,20,28,0.10)";
    ctx.fill();
    ctx.restore();
  }

  function drawVegetation(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_LAND_MASK);
    ctx.clip();
    fillMicroVegetation(ctx, MICRO_VEGETATION_PATCHES);
    ctx.restore();
  }

  function drawSurfaceSpeckle(ctx) {
    ctx.save();
    polygon(ctx, PENINSULA_LAND_MASK);
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
    fog.addColorStop(0, "rgba(248,246,238,0.12)");
    fog.addColorStop(0.56, "rgba(232,238,242,0.03)");
    fog.addColorStop(1, "rgba(232,238,242,0)");
    ctx.fillStyle = fog;
    ctx.fill();
  }

  return Object.freeze({ draw });
}
