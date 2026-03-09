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
  [520, 910],
  [476, 888],
  [438, 850],
  [418, 796],
  [420, 740],
  [438, 690],
  [470, 644],
  [506, 604],
  [546, 560],
  [594, 516],
  [646, 468],
  [698, 410],
  [744, 338],
  [784, 254],
  [814, 164],
  [846, 74],
  [906, 74],
  [906, -120],
  [176, -120],
  [176, 94],
  [228, 132],
  [270, 182],
  [306, 246],
  [334, 324],
  [362, 404],
  [392, 486],
  [430, 560],
  [470, 632],
  [500, 708],
  [520, 792]
];

const WEST_COAST_SHELF = [
  [430, 794],
  [410, 744],
  [414, 694],
  [432, 650],
  [460, 610],
  [490, 574],
  [526, 538],
  [512, 586],
  [488, 640],
  [462, 706],
  [452, 760],
  [458, 812]
];

const EAST_COAST_SHELF = [
  [574, 788],
  [598, 732],
  [630, 680],
  [670, 626],
  [716, 570],
  [760, 504],
  [798, 430],
  [826, 344],
  [842, 262],
  [848, 188],
  [854, 120],
  [866, 120],
  [874, 192],
  [870, 278],
  [848, 372],
  [812, 466],
  [770, 544],
  [722, 606],
  [674, 662],
  [624, 722],
  [592, 788]
];

const HARBOR_COVE = [
  [470, 836],
  [490, 812],
  [520, 796],
  [558, 792],
  [592, 804],
  [614, 828],
  [618, 858],
  [606, 892],
  [578, 916],
  [540, 924],
  [500, 914],
  [474, 888]
];

const BASIN_WATER = [
  [460, 472],
  [484, 430],
  [530, 392],
  [592, 372],
  [654, 380],
  [702, 414],
  [722, 462],
  [714, 516],
  [684, 560],
  [632, 588],
  [570, 590],
  [514, 566],
  [476, 524]
];

const NORTH_FOG = [
  [224, 40],
  [330, 10],
  [482, -12],
  [648, -18],
  [806, 4],
  [906, 34],
  [906, 188],
  [176, 188],
  [176, 70]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOcean(ctx, width, height, tick);
    drawPeninsulaShadow(ctx);
    drawPeninsulaMass(ctx);
    drawCoastalShelves(ctx);
    drawHarborCove(ctx, tick);
    drawBasinWater(ctx, tick);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, -60, 0, height + 260);
    ocean.addColorStop(0, "rgba(126,176,200,1)");
    ocean.addColorStop(0.28, "rgba(94,150,176,1)");
    ocean.addColorStop(0.62, "rgba(54,106,136,1)");
    ocean.addColorStop(1, "rgba(18,58,86,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-900, -180, width + 1800, height + 1400);

    for (let i = 0; i < 16; i += 1) {
      const y = 220 + (i * 46);
      strokeWaveLine(ctx, y, -260, width + 260, tick * 0.028 + i * 0.55, 2.5, 0.022, 0.06 + ((i % 3) * 0.008));
    }

    const swell = ctx.createRadialGradient(560, 520, 40, 560, 520, 640);
    swell.addColorStop(0, "rgba(240,248,250,0.08)");
    swell.addColorStop(0.48, "rgba(220,236,244,0.03)");
    swell.addColorStop(1, "rgba(220,236,244,0)");
    ctx.fillStyle = swell;
    ctx.fillRect(-320, -180, width + 640, height + 700);
  }

  function drawPeninsulaShadow(ctx) {
    ctx.save();
    ctx.translate(16, 18);
    polygon(ctx, PENINSULA_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.16)";
    ctx.fill();
    ctx.restore();
  }

  function drawPeninsulaMass(ctx) {
    polygon(ctx, PENINSULA_OUTLINE);
    const land = ctx.createLinearGradient(0, 74, 0, 930);
    land.addColorStop(0, "rgba(170,168,150,0.98)");
    land.addColorStop(0.26, "rgba(154,154,126,0.98)");
    land.addColorStop(0.58, "rgba(130,142,98,1)");
    land.addColorStop(1, "rgba(112,128,92,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(242,236,210,0.32)";
    ctx.stroke();
  }

  function drawCoastalShelves(ctx) {
    polygon(ctx, WEST_COAST_SHELF);
    ctx.fillStyle = "rgba(188,176,132,0.16)";
    ctx.fill();

    polygon(ctx, EAST_COAST_SHELF);
    ctx.fillStyle = "rgba(192,174,136,0.16)";
    ctx.fill();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(470, 792, 620, 930);
    harbor.addColorStop(0, "rgba(120,184,196,0.98)");
    harbor.addColorStop(0.45, "rgba(82,138,158,0.98)");
    harbor.addColorStop(1, "rgba(46,92,118,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(234,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 4; i += 1) {
      strokeWaveLine(ctx, 824 + (i * 14), 488, 600, tick * 0.048 + i, 1.6, 0.046, 0.12);
    }
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(460, 372, 722, 590);
    basin.addColorStop(0, "rgba(122,186,198,0.98)");
    basin.addColorStop(0.46, "rgba(84,140,160,0.98)");
    basin.addColorStop(1, "rgba(42,94,122,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 416 + (i * 20), 492, 686, tick * 0.042 + i * 0.9, 2.1, 0.036, 0.10);
    }
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
        rx = 98;
        ry = 34;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(176,146,102,0.18)";
        rx = 96;
        ry = 42;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(110,126,108,0.12)";
        rx = 136;
        ry = 64;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(210,206,198,0.18)";
        rx = 82;
        ry = 30;
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
    const fog = ctx.createLinearGradient(0, -20, 0, 196);
    fog.addColorStop(0, "rgba(248,246,238,0.22)");
    fog.addColorStop(0.58, "rgba(232,238,242,0.08)");
    fog.addColorStop(1, "rgba(232,238,242,0)");
    ctx.fillStyle = fog;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(564, 138, 212, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,238,0.06)";
    ctx.fill();
  }

  return Object.freeze({ draw });
}
