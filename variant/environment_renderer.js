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
  [530, 1140],
  [498, 1086],
  [476, 1022],
  [468, 946],
  [474, 870],
  [492, 800],
  [518, 734],
  [554, 674],
  [598, 618],
  [648, 562],
  [694, 500],
  [734, 432],
  [768, 356],
  [800, 278],
  [840, 200],
  [892, 126],
  [956, 74],
  [1010, 54],
  [1064, 38],
  [1112, 22],
  [1150, 10],
  [1150, -180],
  [124, -180],
  [124, 124],
  [176, 182],
  [230, 242],
  [278, 310],
  [318, 384],
  [350, 464],
  [378, 548],
  [410, 624],
  [442, 694],
  [472, 764],
  [498, 836],
  [522, 920],
  [540, 1010],
  [548, 1086]
];

const WEST_COAST = [
  [498, 1088],
  [474, 1028],
  [462, 960],
  [466, 890],
  [480, 818],
  [502, 750],
  [530, 688],
  [564, 630],
  [598, 572],
  [624, 514],
  [640, 452],
  [642, 386],
  [630, 324],
  [606, 262],
  [568, 202],
  [520, 148],
  [466, 104],
  [414, 70],
  [368, 46],
  [332, 24]
];

const EAST_COAST = [
  [564, 1090],
  [570, 1018],
  [586, 950],
  [614, 886],
  [654, 826],
  [704, 766],
  [760, 708],
  [812, 646],
  [858, 576],
  [900, 498],
  [944, 420],
  [994, 346],
  [1048, 280],
  [1100, 222],
  [1142, 166]
];

const HARBOR_COVE = [
  [488, 946],
  [506, 908],
  [540, 882],
  [586, 878],
  [626, 896],
  [646, 930],
  [644, 972],
  [622, 1008],
  [584, 1028],
  [538, 1030],
  [504, 1006],
  [486, 970]
];

const BASIN_WATER = [
  [464, 556],
  [486, 520],
  [526, 486],
  [580, 470],
  [636, 474],
  [684, 494],
  [716, 530],
  [722, 574],
  [704, 616],
  [664, 646],
  [610, 662],
  [554, 658],
  [504, 638],
  [472, 602]
];

const NORTH_FOG = [
  [144, 8],
  [300, -20],
  [482, -44],
  [704, -54],
  [910, -32],
  [1100, 14],
  [1150, 34],
  [1150, 244],
  [124, 244],
  [124, 38]
];

const MOUNTAIN_BASE = [
  [540, 398],
  [568, 346],
  [602, 302],
  [646, 262],
  [694, 232],
  [748, 216],
  [798, 220],
  [834, 244],
  [848, 286],
  [840, 336],
  [812, 384],
  [770, 426],
  [720, 456],
  [664, 472],
  [608, 466],
  [564, 444]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOcean(ctx, width, height, tick);
    drawPeninsulaShadow(ctx);
    drawPeninsulaMass(ctx);
    drawCoastalIrregularity(ctx);
    drawHarborCove(ctx, tick);
    drawBasinWater(ctx, tick);
    drawMountainAtmosphere(ctx);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, tick);
    drawNorthAtmosphere(ctx);

    ctx.restore();
  }

  function drawOcean(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, -140, 0, height + 400);
    ocean.addColorStop(0, "rgba(146,192,210,1)");
    ocean.addColorStop(0.26, "rgba(108,164,188,1)");
    ocean.addColorStop(0.58, "rgba(58,110,140,1)");
    ocean.addColorStop(1, "rgba(20,64,92,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-1200, -260, width + 2400, height + 1800);

    for (let i = 0; i < 22; i += 1) {
      const y = 220 + (i * 54);
      strokeWaveLine(ctx, y, -300, width + 300, tick * 0.026 + i * 0.55, 2.6, 0.020, 0.055 + ((i % 3) * 0.01));
    }

    const swell = ctx.createRadialGradient(620, 760, 60, 620, 760, 760);
    swell.addColorStop(0, "rgba(240,248,250,0.08)");
    swell.addColorStop(0.48, "rgba(220,236,244,0.03)");
    swell.addColorStop(1, "rgba(220,236,244,0)");
    ctx.fillStyle = swell;
    ctx.fillRect(-400, -260, width + 800, height + 1100);
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
    const land = ctx.createLinearGradient(0, 18, 0, 1140);
    land.addColorStop(0, "rgba(176,170,150,1)");
    land.addColorStop(0.22, "rgba(166,160,136,1)");
    land.addColorStop(0.52, "rgba(148,148,110,1)");
    land.addColorStop(0.82, "rgba(132,142,100,1)");
    land.addColorStop(1, "rgba(118,132,96,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(244,236,210,0.34)";
    ctx.stroke();
  }

  function drawCoastalIrregularity(ctx) {
    polyline(ctx, WEST_COAST);
    ctx.strokeStyle = "rgba(246,240,220,0.26)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    polyline(ctx, EAST_COAST);
    ctx.strokeStyle = "rgba(246,240,220,0.24)";
    ctx.lineWidth = 2.1;
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    polygon(ctx, HARBOR_COVE);
    const harbor = ctx.createLinearGradient(488, 878, 646, 1030);
    harbor.addColorStop(0, "rgba(122,188,200,0.98)");
    harbor.addColorStop(0.45, "rgba(82,140,160,0.98)");
    harbor.addColorStop(1, "rgba(46,92,118,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 5; i += 1) {
      strokeWaveLine(ctx, 914 + (i * 16), 504, 628, tick * 0.05 + i, 1.8, 0.046, 0.12);
    }
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(464, 470, 722, 662);
    basin.addColorStop(0, "rgba(122,186,198,0.98)");
    basin.addColorStop(0.46, "rgba(84,140,160,0.98)");
    basin.addColorStop(1, "rgba(42,94,122,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(236,244,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 7; i += 1) {
      strokeWaveLine(ctx, 510 + (i * 18), 490, 690, tick * 0.042 + i * 0.9, 2.1, 0.036, 0.10);
    }
  }

  function drawMountainAtmosphere(ctx) {
    polygon(ctx, MOUNTAIN_BASE);
    const peak = ctx.createLinearGradient(0, 216, 0, 472);
    peak.addColorStop(0, "rgba(214,210,204,0.54)");
    peak.addColorStop(0.48, "rgba(184,178,164,0.24)");
    peak.addColorStop(1, "rgba(156,150,140,0.08)");
    ctx.fillStyle = peak;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(724, 286, 126, 40, -0.18, 0, Math.PI * 2);
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
        rx = 110;
        ry = 36;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(176,146,102,0.18)";
        rx = 98;
        ry = 44;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(110,126,108,0.12)";
        rx = 148;
        ry = 66;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(210,206,198,0.18)";
        rx = 86;
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
    const fog = ctx.createLinearGradient(0, -40, 0, 250);
    fog.addColorStop(0, "rgba(248,246,238,0.24)");
    fog.addColorStop(0.58, "rgba(232,238,242,0.08)");
    fog.addColorStop(1, "rgba(232,238,242,0)");
    ctx.fillStyle = fog;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(702, 132, 260, 42, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,246,238,0.06)";
    ctx.fill();
  }

  return Object.freeze({ draw });
}
