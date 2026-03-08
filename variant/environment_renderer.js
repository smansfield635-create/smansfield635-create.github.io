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
  ctx.strokeStyle = `rgba(236,244,248,${alpha})`;
  ctx.lineWidth = 1.15;
  ctx.stroke();
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOuterWater(ctx, width, height, tick);
    drawDepthFog(ctx, tick);
    drawIslandMass(ctx);
    drawHarborCove(ctx, tick);
    drawHarborShore(ctx, tick);
    drawRouteBedCanyon(ctx, kernel);
    drawCentralBasin(ctx, tick);
    drawBasinShore(ctx, tick);
    drawNorthernRise(ctx);
    drawSummitPromontory(ctx);
    drawTerrainShadows(ctx, tick);
    drawRegionGrounds(ctx, kernel, projection, selection, destination, pulse);
    drawStructures(ctx, kernel, pulse);
    drawAmbient(ctx, tick);
    drawRouteHighlights(ctx, kernel, projection, destination, pulse);

    ctx.restore();
  }

  function drawOuterWater(ctx, width, height, tick) {
    const g = ctx.createLinearGradient(0, 180, 0, height + 340);
    g.addColorStop(0, "rgba(108,164,192,1)");
    g.addColorStop(0.34, "rgba(74,126,154,1)");
    g.addColorStop(0.72, "rgba(38,84,114,1)");
    g.addColorStop(1, "rgba(18,42,70,1)");
    ctx.fillStyle = g;
    ctx.fillRect(-700, 120, width + 1400, height + 900);

    for (let i = 0; i < 11; i += 1) {
      strokeWaveLine(ctx, 380 + i * 22, -320, width + 320, tick * 0.03 + i * 0.7, 3.6 + i * 0.18, 0.012, 0.05 + i * 0.01);
    }

    const reflect = ctx.createLinearGradient(560, 160, 560, 760);
    reflect.addColorStop(0, "rgba(255,236,184,0.00)");
    reflect.addColorStop(0.20, "rgba(255,230,172,0.08)");
    reflect.addColorStop(0.42, "rgba(255,222,160,0.16)");
    reflect.addColorStop(0.70, "rgba(255,216,150,0.20)");
    reflect.addColorStop(1, "rgba(255,216,150,0.00)");
    ctx.fillStyle = reflect;
    ctx.beginPath();
    ctx.moveTo(500, 200);
    ctx.lineTo(620, 200);
    ctx.lineTo(720, 780);
    ctx.lineTo(400, 780);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(560, 442, 78, 232, 0, 0, Math.PI * 2);
    const shimmer = ctx.createLinearGradient(560, 206, 560, 686);
    shimmer.addColorStop(0, "rgba(255,244,214,0.00)");
    shimmer.addColorStop(0.30, "rgba(255,238,202,0.06)");
    shimmer.addColorStop(0.60, "rgba(255,232,194,0.12)");
    shimmer.addColorStop(1, "rgba(255,232,194,0.00)");
    ctx.fillStyle = shimmer;
    ctx.fill();
  }

  function drawDepthFog(ctx, tick) {
    const haze = ctx.createLinearGradient(0, 110, 0, 520);
    haze.addColorStop(0, "rgba(255,240,224,0.00)");
    haze.addColorStop(0.54, "rgba(255,226,196,0.06)");
    haze.addColorStop(1, "rgba(214,230,238,0.02)");
    ctx.fillStyle = haze;
    ctx.fillRect(120, 70, 860, 480);

    const glowX = 560 + Math.sin(tick * 0.01) * 10;
    const glow = ctx.createRadialGradient(glowX, 330, 0, glowX, 330, 270);
    glow.addColorStop(0, "rgba(255,236,204,0.12)");
    glow.addColorStop(0.58, "rgba(248,234,210,0.05)");
    glow.addColorStop(1, "rgba(248,234,210,0.00)");
    ctx.fillStyle = glow;
    ctx.fillRect(220, 110, 680, 520);
  }

  function drawIslandMass(ctx) {
    const island = [
      [336, 638],
      [276, 614],
      [224, 572],
      [198, 524],
      [206, 468],
      [248, 426],
      [318, 398],
      [394, 366],
      [430, 324],
      [438, 260],
      [468, 198],
      [516, 144],
      [578, 116],
      [646, 126],
      [698, 154],
      [736, 206],
      [740, 270],
      [712, 330],
      [650, 390],
      [616, 446],
      [626, 520],
      [666, 574],
      [658, 620],
      [602, 644],
      [520, 650],
      [430, 648]
    ];

    polygon(ctx, island);
    const land = ctx.createLinearGradient(0, 110, 0, 670);
    land.addColorStop(0, "rgba(176,166,132,1)");
    land.addColorStop(0.28, "rgba(146,146,106,1)");
    land.addColorStop(0.58, "rgba(116,132,88,1)");
    land.addColorStop(0.82, "rgba(92,116,82,1)");
    land.addColorStop(1, "rgba(82,102,78,1)");
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(246,236,210,0.26)";
    polygon(ctx, island);
    ctx.stroke();
  }

  function drawHarborCove(ctx, tick) {
    const harborWater = [
      [438, 648],
      [450, 610],
      [488, 584],
      [540, 572],
      [594, 580],
      [628, 604],
      [638, 648]
    ];
    polygon(ctx, harborWater);
    const g = ctx.createLinearGradient(438, 568, 638, 650);
    g.addColorStop(0, "rgba(118,172,188,0.98)");
    g.addColorStop(0.52, "rgba(82,136,158,0.98)");
    g.addColorStop(1, "rgba(44,96,122,1)");
    ctx.fillStyle = g;
    ctx.fill();

    for (let i = 0; i < 4; i += 1) {
      strokeWaveLine(ctx, 596 + i * 10, 456, 622, tick * 0.05 + i, 1.8, 0.04, 0.10);
    }
  }

  function drawHarborShore(ctx, tick) {
    const foamPulse = 0.24 + (0.08 * Math.sin(tick * 0.05));

    ctx.beginPath();
    ctx.moveTo(450, 606);
    ctx.quadraticCurveTo(540, 560, 626, 606);
    ctx.strokeStyle = `rgba(250,242,220,${foamPulse + 0.14})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    const docksLine = [
      [474, 580],
      [506, 572],
      [540, 568],
      [576, 572],
      [608, 584]
    ];
    polyline(ctx, docksLine);
    ctx.strokeStyle = `rgba(244,236,214,${foamPulse * 0.78})`;
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  function drawRouteBedCanyon(ctx, kernel) {
    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 36;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(84,72,54,0.16)";
      ctx.stroke();
    }
  }

  function drawCentralBasin(ctx, tick) {
    ctx.beginPath();
    ctx.ellipse(560, 320, 154, 104, 0, 0, Math.PI * 2);
    const g = ctx.createLinearGradient(404, 214, 716, 430);
    g.addColorStop(0, "rgba(124,178,190,0.98)");
    g.addColorStop(0.46, "rgba(82,136,156,0.98)");
    g.addColorStop(1, "rgba(44,94,122,1)");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(232,242,248,0.32)";
    ctx.stroke();

    for (let i = 0; i < 8; i += 1) {
      strokeWaveLine(ctx, 274 + i * 16, 438, 682, tick * 0.04 + i * 0.7, 2.1, 0.03, 0.07 + i * 0.004);
    }

    ctx.beginPath();
    ctx.ellipse(592, 334, 56, 16, 0.05, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232,242,244,0.10)";
    ctx.fill();
  }

  function drawBasinShore(ctx, tick) {
    const foamPulse = 0.24 + (0.08 * Math.sin(tick * 0.05));
    const basinFoam = [
      [446, 382],
      [484, 404],
      [536, 414],
      [590, 410],
      [642, 392],
      [678, 360]
    ];
    polyline(ctx, basinFoam);
    ctx.strokeStyle = `rgba(244,248,250,${foamPulse})`;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    for (let i = 0; i < 8; i += 1) {
      const x = 462 + i * 26;
      const y = 386 + Math.sin(tick * 0.06 + i * 0.8) * 5;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,248,244,${foamPulse * 0.52})`;
      ctx.fill();
    }
  }

  function drawNorthernRise(ctx) {
    const leftRise = [
      [430, 354],
      [450, 304],
      [474, 248],
      [506, 190],
      [542, 148],
      [536, 212],
      [520, 274],
      [496, 330],
      [472, 374]
    ];
    const rightRise = [
      [618, 398],
      [640, 346],
      [662, 290],
      [682, 236],
      [694, 180],
      [660, 208],
      [632, 252],
      [614, 310],
      [604, 364]
    ];

    polygon(ctx, leftRise);
    ctx.fillStyle = "rgba(122,136,94,0.42)";
    ctx.fill();

    polygon(ctx, rightRise);
    ctx.fillStyle = "rgba(116,124,92,0.46)";
    ctx.fill();
  }

  function drawSummitPromontory(ctx) {
    const summitMass = [
      [508, 206],
      [526, 164],
      [548, 128],
      [574, 110],
      [600, 126],
      [614, 164],
      [610, 204],
      [588, 226],
      [552, 224],
      [524, 220]
    ];

    polygon(ctx, summitMass);
    ctx.fillStyle = "rgba(194,190,182,0.62)";
    ctx.fill();
  }

  function drawTerrainShadows(ctx, tick) {
    const lowerShadow = [
      [402, 628],
      [428, 570],
      [476, 520],
      [536, 488],
      [602, 484],
      [648, 510],
      [670, 560],
      [654, 618],
      [602, 640],
      [512, 644],
      [446, 640]
    ];
    const basinShadow = [
      [458, 376],
      [500, 398],
      [552, 406],
      [606, 400],
      [648, 378],
      [626, 392],
      [582, 404],
      [532, 406],
      [488, 396]
    ];

    polygon(ctx, lowerShadow);
    ctx.fillStyle = "rgba(68,72,60,0.16)";
    ctx.fill();

    polygon(ctx, basinShadow);
    ctx.fillStyle = "rgba(54,72,74,0.10)";
    ctx.fill();

    const mist = ctx.createLinearGradient(0, 154, 0, 422);
    mist.addColorStop(0, "rgba(255,246,236,0.04)");
    mist.addColorStop(1, "rgba(210,224,230,0.00)");
    ctx.fillStyle = mist;
    ctx.fillRect(360, 140, 420, 260);

    const driftX = 560 + Math.sin(tick * 0.012) * 6;
    ctx.beginPath();
    ctx.ellipse(driftX, 248, 100, 18, 0.02, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(236,236,232,0.07)";
    ctx.fill();
  }

  function drawRegionGrounds(ctx, kernel, projection, selection, destination, pulse) {
    const rows = [...kernel.regionsById.values()];
    for (const row of rows) {
      const [x, y] = row.centerPoint;
      const isActive = projection?.regionId === row.regionId;
      const isSelected = selection?.kind === "region" && selection.regionId === row.regionId;
      const isDestination = destination?.regionId === row.regionId;

      let fill = "rgba(102,126,104,0.20)";
      let rx = 82;
      let ry = 44;

      if (row.regionId === "harbor_village") {
        fill = "rgba(172,150,118,0.30)";
        rx = 110;
        ry = 40;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(164,132,98,0.30)";
        rx = 94;
        ry = 46;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(108,124,108,0.16)";
        rx = 124;
        ry = 58;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(202,196,190,0.28)";
        rx = 78;
        ry = 34;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 8, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (row.regionId === "market_district") {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 64, 28, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,198,164,0.16)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 54, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(238,234,228,0.16)";
        ctx.fill();
      }

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, rx + 10 + pulse * 4, ry + 6 + pulse * 2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,244,218,0.92)"
          : isActive
            ? "rgba(255,232,184,0.76)"
            : "rgba(214,236,248,0.64)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  function drawStructures(ctx, kernel, pulse) {
    const rows = [...kernel.regionsById.values()];
    for (const row of rows) {
      const [x, y] = row.centerPoint;

      if (row.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(104,76,60,0.96)";
        ctx.fillRect(x - 42, y + 10, 84, 10);
        ctx.fillRect(x - 6, y - 16, 12, 30);
        ctx.fillRect(x - 58, y + 16, 20, 8);
        ctx.fillRect(x + 38, y + 16, 20, 8);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(156,112,80,0.96)";
        ctx.fillRect(x - 30, y + 2, 60, 14);
        ctx.fillStyle = "rgba(224,192,138,0.90)";
        ctx.fillRect(x - 20, y - 10, 40, 10);
        ctx.fillRect(x - 44, y + 8, 10, 12);
        ctx.fillRect(x + 34, y + 8, 10, 12);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 10, 10 + pulse * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.22)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 26);
        ctx.lineTo(x + 14, y + 4);
        ctx.lineTo(x - 14, y + 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(226,218,212,0.98)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 32, 7 + pulse * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.42)";
        ctx.fill();
      }
    }
  }

  function drawAmbient(ctx, tick) {
    const t = tick * 0.02;

    for (let i = 0; i < 6; i += 1) {
      const x = 360 + i * 64 + Math.sin(t + i) * 8;
      const y = 132 + Math.cos(t * 0.8 + i) * 10;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 2), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,216,170,0.14)";
      ctx.fill();
    }

    const birdBaseX = 676 + Math.sin(t * 0.6) * 18;
    const birdBaseY = 174 + Math.cos(t * 0.7) * 6;
    for (let i = 0; i < 2; i += 1) {
      const bx = birdBaseX + i * 24;
      const by = birdBaseY + i * 6;
      ctx.beginPath();
      ctx.moveTo(bx - 8, by);
      ctx.quadraticCurveTo(bx - 2, by - 6, bx + 4, by);
      ctx.quadraticCurveTo(bx + 10, by - 6, bx + 16, by);
      ctx.strokeStyle = "rgba(64,76,82,0.24)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  function drawRouteHighlights(ctx, kernel, projection, destination, pulse) {
    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(156,132,98,0.14)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        row.fromRegionId === projection.regionId && row.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        polyline(ctx, row.centerline);
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(248,226,170,${0.22 + pulse * 0.18})`;
        ctx.stroke();
      }
    }
  }

  return Object.freeze({ draw });
}
