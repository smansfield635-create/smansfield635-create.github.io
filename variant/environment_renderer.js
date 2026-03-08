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
    drawIslandRing(ctx);
    drawBasinWater(ctx, tick);
    drawHarborMouth(ctx, tick);
    drawElevation(ctx);
    drawRegionGrounds(ctx, kernel, projection, selection, destination, pulse);
    drawStructures(ctx, kernel, pulse);
    drawAmbient(ctx, tick);
    drawRouteBeds(ctx, kernel, projection, destination, pulse);

    ctx.restore();
  }

  function drawOuterWater(ctx, width, height, tick) {
    const g = ctx.createLinearGradient(0, 200, 0, height + 300);
    g.addColorStop(0, "rgba(100,156,182,1)");
    g.addColorStop(0.35, "rgba(70,122,150,1)");
    g.addColorStop(0.72, "rgba(38,84,114,1)");
    g.addColorStop(1, "rgba(20,46,72,1)");
    ctx.fillStyle = g;
    ctx.fillRect(-700, 180, width + 1400, height + 800);

    for (let i = 0; i < 10; i += 1) {
      strokeWaveLine(ctx, 360 + i * 24, -320, width + 320, tick * 0.03 + i * 0.7, 3.5 + i * 0.2, 0.012, 0.05 + i * 0.01);
    }

    const reflect = ctx.createLinearGradient(650, 240, 650, 740);
    reflect.addColorStop(0, "rgba(255,238,188,0.00)");
    reflect.addColorStop(0.22, "rgba(255,234,178,0.09)");
    reflect.addColorStop(0.46, "rgba(255,224,162,0.16)");
    reflect.addColorStop(1, "rgba(255,224,162,0.00)");
    ctx.fillStyle = reflect;
    ctx.beginPath();
    ctx.moveTo(590, 250);
    ctx.lineTo(710, 250);
    ctx.lineTo(820, 760);
    ctx.lineTo(470, 760);
    ctx.closePath();
    ctx.fill();
  }

  function drawIslandRing(ctx) {
    const outerRing = [
      [440, 620],[350, 600],[260, 556],[190, 488],[160, 420],[176, 334],[226, 244],[300, 176],[396, 126],[502, 98],
      [610, 94],[712, 116],[808, 160],[888, 230],[936, 316],[942, 402],[912, 486],[842, 552],[742, 602],[624, 632],
      [520, 634]
    ];

    const innerBasinEdge = [
      [458, 478],[396, 456],[342, 408],[324, 354],[340, 294],[382, 244],[446, 214],[522, 202],[600, 204],[672, 226],
      [730, 268],[766, 322],[772, 382],[752, 432],[708, 470],[646, 494],[572, 504],[510, 500]
    ];

    polygon(ctx, outerRing);
    const land = ctx.createLinearGradient(0, 90, 0, 660);
    land.addColorStop(0, "rgba(176,166,132,1)");
    land.addColorStop(0.28, "rgba(146,146,106,1)");
    land.addColorStop(0.58, "rgba(116,132,88,1)");
    land.addColorStop(0.82, "rgba(92,116,82,1)");
    land.addColorStop(1, "rgba(82,102,78,1)");
    ctx.fillStyle = land;
    ctx.fill();

    polygon(ctx, innerBasinEdge);
    const basinCut = ctx.createLinearGradient(0, 180, 0, 520);
    basinCut.addColorStop(0, "rgba(176,164,128,0.92)");
    basinCut.addColorStop(1, "rgba(142,134,102,0.92)");
    ctx.fillStyle = basinCut;
    ctx.fill("evenodd");

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "rgba(246,236,210,0.26)";
    polygon(ctx, outerRing);
    ctx.stroke();
  }

  function drawBasinWater(ctx, tick) {
    ctx.beginPath();
    ctx.ellipse(560, 340, 212, 146, 0, 0, Math.PI * 2);
    const g = ctx.createLinearGradient(340, 210, 760, 500);
    g.addColorStop(0, "rgba(124,178,190,0.98)");
    g.addColorStop(0.46, "rgba(82,136,156,0.98)");
    g.addColorStop(1, "rgba(44,94,122,1)");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(232,242,248,0.32)";
    ctx.stroke();

    for (let i = 0; i < 8; i += 1) {
      strokeWaveLine(ctx, 280 + i * 18, 374, 746, tick * 0.04 + i * 0.7, 2.1, 0.03, 0.07 + i * 0.004);
    }
  }

  function drawHarborMouth(ctx, tick) {
    const harborWater = [
      [454, 610],[484, 600],[520, 588],[560, 584],[600, 588],[634, 600],[660, 618],[656, 650],[454, 650]
    ];
    polygon(ctx, harborWater);
    const g = ctx.createLinearGradient(450, 580, 650, 660);
    g.addColorStop(0, "rgba(118,172,188,0.98)");
    g.addColorStop(0.5, "rgba(82,136,158,0.98)");
    g.addColorStop(1, "rgba(44,96,122,1)");
    ctx.fillStyle = g;
    ctx.fill();

    for (let i = 0; i < 4; i += 1) {
      strokeWaveLine(ctx, 604 + i * 10, 462, 650, tick * 0.05 + i, 1.8, 0.04, 0.10);
    }

    ctx.beginPath();
    ctx.moveTo(452, 606);
    ctx.quadraticCurveTo(560, 570, 658, 606);
    ctx.strokeStyle = `rgba(248,240,216,${0.30 + 0.08 * Math.sin(tick * 0.05)})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawElevation(ctx) {
    const leftRidge = [
      [246, 488],[214, 430],[224, 348],[264, 266],[324, 204],[404, 162],[490, 144],[478, 184],[430, 218],[382, 266],
      [344, 322],[318, 384],[310, 444],[316, 498]
    ];
    const rightRidge = [
      [736, 486],[784, 434],[814, 372],[822, 304],[804, 240],[760, 186],[692, 144],[620, 126],[628, 170],[674, 206],
      [716, 256],[742, 316],[748, 386]
    ];
    const summitMass = [
      [458, 188],[494, 132],[540, 88],[592, 96],[632, 142],[650, 198],[626, 222],[578, 200],[530, 194],[482, 212]
    ];

    polygon(ctx, leftRidge);
    ctx.fillStyle = "rgba(122,136,94,0.42)";
    ctx.fill();

    polygon(ctx, rightRidge);
    ctx.fillStyle = "rgba(116,124,92,0.46)";
    ctx.fill();

    polygon(ctx, summitMass);
    ctx.fillStyle = "rgba(194,190,182,0.62)";
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
        rx = 98;
        ry = 42;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(164,132,98,0.30)";
        rx = 88;
        ry = 44;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(108,124,108,0.16)";
        rx = 112;
        ry = 54;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(202,196,190,0.28)";
        rx = 74;
        ry = 36;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 8, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (row.regionId === "market_district") {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 60, 28, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,198,164,0.16)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 52, 22, 0, 0, Math.PI * 2);
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
        ctx.fillRect(x - 36, y + 8, 72, 10);
        ctx.fillRect(x - 6, y - 14, 12, 28);
        ctx.fillRect(x - 54, y + 14, 18, 8);
        ctx.fillRect(x + 36, y + 14, 18, 8);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(156,112,80,0.96)";
        ctx.fillRect(x - 28, y + 2, 56, 14);
        ctx.fillStyle = "rgba(224,192,138,0.90)";
        ctx.fillRect(x - 18, y - 10, 36, 10);
        ctx.fillRect(x - 42, y + 6, 10, 12);
        ctx.fillRect(x + 32, y + 6, 10, 12);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 10, 10 + pulse * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.22)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 28);
        ctx.lineTo(x + 14, y + 4);
        ctx.lineTo(x - 14, y + 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(226,218,212,0.98)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 34, 7 + pulse * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.42)";
        ctx.fill();
      }
    }
  }

  function drawAmbient(ctx, tick) {
    const t = tick * 0.02;

    for (let i = 0; i < 6; i += 1) {
      const x = 260 + i * 78 + Math.sin(t + i) * 8;
      const y = 116 + Math.cos(t * 0.8 + i) * 12;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 2), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,216,170,0.14)";
      ctx.fill();
    }

    const birdBaseX = 700 + Math.sin(t * 0.6) * 18;
    const birdBaseY = 150 + Math.cos(t * 0.7) * 6;
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

  function drawRouteBeds(ctx, kernel, projection, destination, pulse) {
    const rows = [...kernel.pathsById.values()];
    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(86,72,54,0.30)";
      ctx.stroke();

      polyline(ctx, row.centerline);
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(156,132,98,0.16)";
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
