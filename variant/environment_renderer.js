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
  ctx.strokeStyle = `rgba(236,244,248,${alpha})`;
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

const ISLAND_OUTLINE = [
  [304, 648],
  [260, 620],
  [226, 574],
  [210, 516],
  [218, 452],
  [246, 396],
  [296, 348],
  [354, 308],
  [396, 264],
  [420, 206],
  [462, 150],
  [516, 110],
  [578, 96],
  [642, 116],
  [694, 154],
  [732, 208],
  [748, 274],
  [742, 344],
  [718, 412],
  [688, 474],
  [678, 546],
  [696, 604],
  [676, 646],
  [628, 680],
  [560, 696],
  [490, 692],
  [426, 682],
  [362, 670]
];

const HARBOR_WATER = [
  [430, 648],
  [452, 616],
  [492, 590],
  [544, 578],
  [596, 582],
  [632, 598],
  [648, 628],
  [646, 682],
  [430, 682]
];

const BASIN_WATER = [
  [444, 388],
  [470, 342],
  [512, 314],
  [566, 310],
  [616, 328],
  [650, 362],
  [660, 406],
  [642, 446],
  [602, 472],
  [548, 478],
  [494, 464],
  [458, 434]
];

const NORTH_RISE = [
  [474, 262],
  [498, 216],
  [528, 166],
  [566, 130],
  [604, 124],
  [632, 152],
  [642, 198],
  [634, 240],
  [610, 274],
  [574, 294],
  [528, 294],
  [492, 284]
];

const EAST_RIDGE = [
  [618, 420],
  [654, 404],
  [690, 408],
  [718, 438],
  [730, 488],
  [724, 544],
  [700, 594],
  [668, 622],
  [646, 592],
  [638, 534],
  [634, 474]
];

const WEST_LOWLANDS = [
  [280, 480],
  [308, 440],
  [352, 406],
  [404, 392],
  [440, 400],
  [430, 454],
  [398, 512],
  [354, 556],
  [312, 558],
  [286, 534]
];

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOceanField(ctx, width, height, tick);
    drawIslandShadow(ctx);
    drawIslandMass(ctx);
    drawBiomeMasses(ctx);
    drawHarborWater(ctx, tick);
    drawBasinWater(ctx, tick);
    drawShoreFoam(ctx, tick);
    drawRouteBeds(ctx, kernel);
    drawRegionPads(ctx, kernel, projection, selection, destination, pulse);
    drawAtmosphericDepth(ctx, tick);

    ctx.restore();
  }

  function drawOceanField(ctx, width, height, tick) {
    const ocean = ctx.createLinearGradient(0, 120, 0, height + 200);
    ocean.addColorStop(0, "rgba(94,142,170,1)");
    ocean.addColorStop(0.38, "rgba(58,108,138,1)");
    ocean.addColorStop(1, "rgba(24,58,84,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(-700, 80, width + 1400, height + 900);

    for (let i = 0; i < 12; i += 1) {
      strokeWaveLine(ctx, 300 + (i * 28), -260, width + 260, tick * 0.035 + i * 0.7, 3.4, 0.018, 0.05 + ((i % 3) * 0.01));
    }

    const swell = ctx.createRadialGradient(540, 420, 0, 540, 420, 520);
    swell.addColorStop(0, "rgba(210,232,240,0.08)");
    swell.addColorStop(0.46, "rgba(184,218,230,0.03)");
    swell.addColorStop(1, "rgba(184,218,230,0)");
    ctx.fillStyle = swell;
    ctx.fillRect(-300, -100, width + 600, height + 500);
  }

  function drawIslandShadow(ctx) {
    ctx.save();
    ctx.translate(14, 18);
    polygon(ctx, ISLAND_OUTLINE);
    ctx.fillStyle = "rgba(8,20,28,0.18)";
    ctx.fill();
    ctx.restore();
  }

  function drawIslandMass(ctx) {
    polygon(ctx, ISLAND_OUTLINE);
    const land = ctx.createLinearGradient(0, 96, 0, 700);
    land.addColorStop(0, "rgba(170,162,132,1)");
    land.addColorStop(0.30, "rgba(142,144,106,1)");
    land.addColorStop(0.62, "rgba(112,132,92,1)");
    land.addColorStop(1, "rgba(92,118,92,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgba(246,236,214,0.34)";
    ctx.stroke();
  }

  function drawBiomeMasses(ctx) {
    polygon(ctx, NORTH_RISE);
    ctx.fillStyle = "rgba(194,192,186,0.54)";
    ctx.fill();

    polygon(ctx, EAST_RIDGE);
    ctx.fillStyle = "rgba(156,118,86,0.22)";
    ctx.fill();

    polygon(ctx, WEST_LOWLANDS);
    ctx.fillStyle = "rgba(96,130,92,0.24)";
    ctx.fill();
  }

  function drawHarborWater(ctx, tick) {
    polygon(ctx, HARBOR_WATER);
    const harbor = ctx.createLinearGradient(430, 578, 648, 682);
    harbor.addColorStop(0, "rgba(118,176,188,0.98)");
    harbor.addColorStop(0.45, "rgba(80,134,154,0.98)");
    harbor.addColorStop(1, "rgba(44,92,118,1)");
    ctx.fillStyle = harbor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(232,244,248,0.32)";
    ctx.stroke();

    for (let i = 0; i < 3; i += 1) {
      strokeWaveLine(ctx, 620 + (i * 12), 450, 624, tick * 0.05 + i, 1.6, 0.042, 0.11);
    }
  }

  function drawBasinWater(ctx, tick) {
    polygon(ctx, BASIN_WATER);
    const basin = ctx.createLinearGradient(444, 310, 660, 478);
    basin.addColorStop(0, "rgba(124,182,192,0.98)");
    basin.addColorStop(0.48, "rgba(82,136,156,0.98)");
    basin.addColorStop(1, "rgba(42,90,118,1)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2.1;
    ctx.strokeStyle = "rgba(228,242,248,0.34)";
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      strokeWaveLine(ctx, 350 + (i * 16), 468, 632, tick * 0.046 + i * 0.8, 1.9, 0.038, 0.09);
    }
  }

  function drawShoreFoam(ctx, tick) {
    const harborFoam = [
      [450, 614],
      [488, 596],
      [538, 588],
      [588, 592],
      [624, 606]
    ];
    polyline(ctx, harborFoam);
    ctx.strokeStyle = `rgba(248,242,226,${0.22 + (0.08 * Math.sin(tick * 0.05))})`;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    const basinFoam = [
      [456, 430],
      [498, 456],
      [548, 466],
      [602, 458],
      [640, 438]
    ];
    polyline(ctx, basinFoam);
    ctx.strokeStyle = "rgba(242,246,248,0.24)";
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  function drawRouteBeds(ctx, kernel) {
    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 34;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(82,70,54,0.14)";
      ctx.stroke();
    }
  }

  function drawRegionPads(ctx, kernel, projection, selection, destination, pulse) {
    const rows = [...kernel.regionsById.values()];
    for (const row of rows) {
      const [x, y] = row.centerPoint;
      const isActive = projection?.regionId === row.regionId;
      const isSelected = selection?.kind === "region" && selection.regionId === row.regionId;
      const isDestination = destination?.regionId === row.regionId;

      let fill = "rgba(102,126,104,0.18)";
      let rx = 84;
      let ry = 42;

      if (row.regionId === "harbor_village") {
        fill = "rgba(170,136,102,0.26)";
        rx = 114;
        ry = 38;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(166,130,92,0.26)";
        rx = 92;
        ry = 44;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(106,126,112,0.14)";
        rx = 124;
        ry = 58;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(204,198,188,0.22)";
        rx = 78;
        ry = 34;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 8, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, rx + 10 + pulse * 5, ry + 6 + pulse * 2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,244,218,0.90)"
          : isActive
            ? "rgba(255,232,184,0.74)"
            : "rgba(214,236,248,0.64)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  function drawAtmosphericDepth(ctx, tick) {
    const haze = ctx.createLinearGradient(0, 100, 0, 320);
    haze.addColorStop(0, "rgba(255,244,228,0.14)");
    haze.addColorStop(0.6, "rgba(228,236,242,0.05)");
    haze.addColorStop(1, "rgba(228,236,242,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(180, 40, 720, 280);

    const driftX = 560 + Math.sin(tick * 0.012) * 8;
    ctx.beginPath();
    ctx.ellipse(driftX, 182, 140, 20, 0.02, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(244,242,236,0.06)";
    ctx.fill();
  }

  return Object.freeze({ draw });
}
