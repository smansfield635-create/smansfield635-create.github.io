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

const TERRAIN_ZONES = Object.freeze({
  lowland: [
    [492, 1088], [486, 1020], [492, 952], [510, 888], [542, 824], [590, 764],
    [652, 712], [724, 674], [804, 650], [886, 638], [964, 636], [1028, 640],
    [1044, 716], [992, 786], [916, 850], [832, 910], [744, 966], [654, 1016],
    [570, 1060]
  ],
  midland: [
    [530, 974], [570, 914], [624, 856], [690, 802], [766, 752], [846, 712],
    [928, 682], [1006, 662], [1070, 656], [1090, 592], [1048, 560], [978, 556],
    [892, 574], [804, 606], [722, 652], [648, 708], [588, 776], [544, 848]
  ],
  upland: [
    [532, 784], [590, 724], [662, 670], [746, 626], [836, 594], [930, 574],
    [1018, 566], [1084, 572], [1112, 520], [1088, 470], [1022, 444], [934, 442],
    [840, 458], [748, 490], [664, 534], [592, 592], [546, 662]
  ],
  highland: [
    [566, 640], [632, 582], [714, 530], [808, 490], [908, 464], [1004, 454],
    [1080, 462], [1114, 420], [1094, 376], [1038, 352], [954, 346], [858, 360],
    [762, 392], [676, 438], [610, 496], [572, 560]
  ]
});

const TERRAIN_CONTOURS = Object.freeze({
  uplandA: [
    [582, 734], [652, 680], [734, 638], [824, 610], [918, 594], [1008, 590]
  ],
  uplandB: [
    [618, 688], [694, 642], [782, 608], [874, 590], [966, 588], [1048, 596]
  ],
  highlandA: [
    [634, 560], [714, 512], [806, 476], [904, 456], [1000, 456], [1072, 470]
  ],
  highlandB: [
    [676, 518], [760, 482], [854, 462], [950, 460], [1038, 472]
  ]
});

function clipOceanArea(ctx, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(-2400, -2400, width + 4800, height + 4800);
  appendPolygonPath(ctx, PENINSULA_LAND_MASK);
  ctx.clip("evenodd");
}

function clipLandArea(ctx) {
  ctx.save();
  polygon(ctx, PENINSULA_LAND_MASK);
  ctx.clip();
}

function drawShorelineSediment(ctx) {
  const west = [
    [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
    [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
    [702, 360], [690, 290], [662, 220], [620, 170]
  ];

  const east = [
    [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
    [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
  ];

  function sedimentBand(points, inset, alphaTop, alphaBottom) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    for (let i = points.length - 1; i >= 0; i -= 1) ctx.lineTo(points[i][0] - inset, points[i][1]);
    ctx.closePath();

    const g = ctx.createLinearGradient(0, 0, 0, 1200);
    g.addColorStop(0, `rgba(156,132,96,${alphaTop})`);
    g.addColorStop(1, `rgba(120,104,78,${alphaBottom})`);
    ctx.fillStyle = g;
    ctx.fill();
  }

  clipLandArea(ctx);
  sedimentBand(west, 18, 0.16, 0.10);
  sedimentBand(east, 14, 0.12, 0.08);
  ctx.restore();
}

function drawTerrainFoundation(ctx) {
  clipLandArea(ctx);

  polygon(ctx, TERRAIN_ZONES.lowland);
  const lowland = ctx.createLinearGradient(0, 620, 0, 1160);
  lowland.addColorStop(0, "rgba(164,170,120,0.04)");
  lowland.addColorStop(1, "rgba(122,142,94,0.10)");
  ctx.fillStyle = lowland;
  ctx.fill();

  polygon(ctx, TERRAIN_ZONES.midland);
  const midland = ctx.createLinearGradient(0, 560, 0, 1040);
  midland.addColorStop(0, "rgba(182,170,126,0.06)");
  midland.addColorStop(1, "rgba(134,144,98,0.12)");
  ctx.fillStyle = midland;
  ctx.fill();

  polygon(ctx, TERRAIN_ZONES.upland);
  const upland = ctx.createLinearGradient(0, 450, 0, 840);
  upland.addColorStop(0, "rgba(204,194,160,0.10)");
  upland.addColorStop(0.55, "rgba(154,156,116,0.10)");
  upland.addColorStop(1, "rgba(118,132,96,0.04)");
  ctx.fillStyle = upland;
  ctx.fill();

  polygon(ctx, TERRAIN_ZONES.highland);
  const highland = ctx.createLinearGradient(0, 360, 0, 700);
  highland.addColorStop(0, "rgba(230,222,204,0.16)");
  highland.addColorStop(0.45, "rgba(186,178,156,0.10)");
  highland.addColorStop(1, "rgba(126,134,114,0.03)");
  ctx.fillStyle = highland;
  ctx.fill();

  polyline(ctx, TERRAIN_CONTOURS.uplandA);
  ctx.strokeStyle = "rgba(244,236,216,0.06)";
  ctx.lineWidth = 1.35;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOURS.uplandB);
  ctx.strokeStyle = "rgba(238,230,208,0.05)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOURS.highlandA);
  ctx.strokeStyle = "rgba(248,242,226,0.08)";
  ctx.lineWidth = 1.3;
  ctx.stroke();

  polyline(ctx, TERRAIN_CONTOURS.highlandB);
  ctx.strokeStyle = "rgba(242,236,220,0.06)";
  ctx.lineWidth = 1.15;
  ctx.stroke();

  ctx.restore();
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawWaterBase(ctx, width, height, tick);
    drawCoastTransition(ctx);
    drawTerrainFoundation(ctx);
    drawSurfaceDetail(ctx);
    drawPathsAndStructures(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawWaterBase(ctx, width, height, tick) {
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
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, WEST_SHELF);
    ctx.strokeStyle = "rgba(236,250,252,0.035)";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    polyline(ctx, COASTLINE_PATH_AUTHORITY.west);
    ctx.strokeStyle = "rgba(252,246,230,0.14)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    for (let i = 0; i < 5; i += 1) {
      strokeWaveLine(ctx, 930 - (i * 140), 118, 460 - (i * 10), tick * 0.036 + (i * 0.5), 0.7, 0.040, 0.018, 10);
    }

    ctx.restore();

    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 886, 656, 1054);
    harbor.addColorStop(0, "rgba(146,206,218,0.94)");
    harbor.addColorStop(0.38, "rgba(96,156,174,0.94)");
    harbor.addColorStop(1, "rgba(42,92,120,0.94)");
    ctx.fillStyle = harbor;
    ctx.fill();
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "rgba(238,246,248,0.06)";
    ctx.stroke();

    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(466, 492, 760, 754);
    basin.addColorStop(0, "rgba(144,204,218,0.96)");
    basin.addColorStop(0.40, "rgba(96,154,174,0.96)");
    basin.addColorStop(1, "rgba(38,90,120,0.96)");
    ctx.fillStyle = basin;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(238,246,248,0.10)";
    ctx.stroke();

    for (let i = 0; i < 3; i += 1) {
      strokeWaveLine(ctx, 550 + (i * 20), 520, 684, tick * 0.042 + (i * 0.8), 0.7, 0.038, 0.028, 10);
    }

    clipOceanArea(ctx, 1400, 1400);
    polyline(ctx, INNER_INLET);
    ctx.strokeStyle = "rgba(196,228,238,0.02)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawCoastTransition(ctx) {
    drawShorelineSediment(ctx);
  }

  function drawSurfaceDetail(ctx) {
    clipLandArea(ctx);
    fillMicroVegetation(ctx, MICRO_VEGETATION_PATCHES);
    fillNoiseDots(ctx, { x: 210, y: 150, w: 860, h: 970 }, 980, "rgba(110,120,84,0.05)", 1, 1.3);
    fillNoiseDots(ctx, { x: 250, y: 210, w: 800, h: 900 }, 620, "rgba(232,218,182,0.045)", 2, 1.0);
    fillNoiseDots(ctx, { x: 280, y: 250, w: 740, h: 840 }, 320, "rgba(154,168,112,0.035)", 3, 1.1);
    ctx.restore();
  }

  function drawPathsAndStructures(ctx, kernel) {
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
