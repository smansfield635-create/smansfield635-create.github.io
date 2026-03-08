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

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOuterWater(ctx, width, height);
    drawIslandMass(ctx);
    drawElevationBands(ctx);
    drawRegionGrounds(ctx, kernel, projection, selection, destination, pulse);
    drawHarborWater(ctx);
    drawBasinWater(ctx);
    drawShoreEdges(ctx);
    drawStructures(ctx, kernel, pulse);
    drawAmbientDetails(ctx, tick);
    drawRouteBeds(ctx, kernel, projection, destination, pulse);

    ctx.restore();
  }

  function drawOuterWater(ctx, width, height) {
    const g = ctx.createLinearGradient(0, 240, 0, height + 260);
    g.addColorStop(0, "rgba(88,132,156,1)");
    g.addColorStop(0.42, "rgba(54,96,124,1)");
    g.addColorStop(1, "rgba(24,54,78,1)");
    ctx.fillStyle = g;
    ctx.fillRect(-700, 220, width + 1400, height + 600);

    for (let i = 0; i < 8; i += 1) {
      const y = 360 + i * 26;
      ctx.beginPath();
      for (let x = -300; x <= width + 300; x += 14) {
        const yy = y + Math.sin((x * 0.012) + i * 0.7) * (4 + i * 0.2);
        if (x === -300) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = `rgba(222,238,246,${0.04 + i * 0.01})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function drawIslandMass(ctx) {
    const island = [
      [30, 528],
      [78, 452],
      [154, 388],
      [258, 346],
      [392, 314],
      [548, 270],
      [708, 214],
      [848, 154],
      [966, 116],
      [1024, 118],
      [1038, 164],
      [1014, 226],
      [968, 288],
      [914, 354],
      [848, 426],
      [756, 492],
      [648, 546],
      [522, 586],
      [386, 610],
      [252, 610],
      [146, 590],
      [76, 560]
    ];

    polygon(ctx, island);
    const g = ctx.createLinearGradient(0, 120, 0, 640);
    g.addColorStop(0, "rgba(170,156,122,1)");
    g.addColorStop(0.32, "rgba(136,136,98,1)");
    g.addColorStop(0.68, "rgba(102,122,86,1)");
    g.addColorStop(1, "rgba(86,104,82,1)");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(244,232,206,0.30)";
    ctx.stroke();
  }

  function drawElevationBands(ctx) {
    const lowRise = [
      [150, 528],[238,480],[344,432],[466,392],[590,348],[708,300],[814,250],[900,220],[934,246],[914,300],
      [848,360],[762,418],[650,472],[520,522],[392,552],[266,554],[184,544]
    ];
    const highRise = [
      [520,510],[606,462],[694,406],[786,344],[856,300],[892,316],[872,358],[820,420],[746,482],[660,528],[570,548]
    ];
    const summitShelf = [
      [820,286],[858,244],[900,220],[934,232],[932,268],[904,308],[858,334],[816,322]
    ];

    polygon(ctx, lowRise);
    ctx.fillStyle = "rgba(124,134,98,0.42)";
    ctx.fill();

    polygon(ctx, highRise);
    ctx.fillStyle = "rgba(116,122,96,0.46)";
    ctx.fill();

    polygon(ctx, summitShelf);
    ctx.fillStyle = "rgba(188,186,178,0.56)";
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
        fill = "rgba(164,150,118,0.28)";
        rx = 92;
        ry = 48;
      }
      if (row.regionId === "market_district") {
        fill = "rgba(168,130,92,0.26)";
        rx = 86;
        ry = 42;
      }
      if (row.regionId === "exploration_basin") {
        fill = "rgba(98,118,106,0.20)";
        rx = 94;
        ry = 50;
      }
      if (row.regionId === "summit_plaza") {
        fill = "rgba(196,190,184,0.24)";
        rx = 74;
        ry = 36;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 10, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 10, rx + 10 + pulse * 4, ry + 6 + pulse * 2, 0, 0, Math.PI * 2);
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

  function drawHarborWater(ctx) {
    const harbor = [
      [74, 516],
      [112, 470],
      [176, 428],
      [252, 404],
      [296, 432],
      [262, 488],
      [206, 528],
      [136, 552],
      [90, 544]
    ];
    polygon(ctx, harbor);
    const g = ctx.createLinearGradient(80, 404, 296, 560);
    g.addColorStop(0, "rgba(116,170,186,0.96)");
    g.addColorStop(0.45, "rgba(76,130,154,0.96)");
    g.addColorStop(1, "rgba(42,92,120,0.98)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(230,242,248,0.38)";
    ctx.stroke();
  }

  function drawBasinWater(ctx) {
    ctx.beginPath();
    ctx.ellipse(660, 330, 124, 76, -0.12, 0, Math.PI * 2);
    const g = ctx.createLinearGradient(572, 248, 736, 404);
    g.addColorStop(0, "rgba(112,166,178,0.94)");
    g.addColorStop(0.52, "rgba(70,126,146,0.96)");
    g.addColorStop(1, "rgba(40,88,114,0.98)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(224,238,246,0.34)";
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(690, 328, 34, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(214,232,234,0.16)";
    ctx.fill();
  }

  function drawShoreEdges(ctx) {
    const harborShore = [[86,520],[122,492],[174,458],[230,438],[266,448]];
    const basinShore = [[574,368],[622,390],[690,392],[746,368]];

    polyline(ctx, harborShore);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(246,238,214,0.42)";
    ctx.stroke();

    polyline(ctx, basinShore);
    ctx.strokeStyle = "rgba(236,242,248,0.30)";
    ctx.stroke();
  }

  function drawStructures(ctx, kernel, pulse) {
    const rows = [...kernel.regionsById.values()];

    for (const row of rows) {
      const [x, y] = row.centerPoint;

      if (row.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(96,72,58,0.96)";
        ctx.fillRect(x - 24, y + 14, 48, 8);
        ctx.fillRect(x - 4, y - 8, 8, 28);
        ctx.fillRect(x - 36, y + 8, 10, 18);
        ctx.fillRect(x + 26, y + 8, 10, 18);
      }

      if (row.regionId === "market_district") {
        ctx.fillStyle = "rgba(150,106,76,0.96)";
        ctx.fillRect(x - 28, y + 4, 56, 14);
        ctx.fillStyle = "rgba(220,188,136,0.88)";
        ctx.fillRect(x - 18, y - 10, 36, 10);
        ctx.fillRect(x - 40, y + 8, 8, 14);
        ctx.fillRect(x + 32, y + 8, 8, 14);
      }

      if (row.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 8, 10 + pulse * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.22)";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - 18, y + 12);
        ctx.lineTo(x + 18, y + 12);
        ctx.lineTo(x, y - 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(92,108,88,0.42)";
        ctx.fill();
      }

      if (row.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + 14, y + 4);
        ctx.lineTo(x - 14, y + 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(224,216,210,0.96)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 36, 7 + pulse * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,224,0.40)";
        ctx.fill();
      }
    }
  }

  function drawAmbientDetails(ctx, tick) {
    const t = tick * 0.02;

    for (let i = 0; i < 7; i += 1) {
      const x = 132 + i * 126 + Math.sin(t + i) * 12;
      const y = 116 + Math.cos(t * 0.8 + i) * 18;
      const r = 2 + ((i + tick) % 3) * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,216,170,0.18)";
      ctx.fill();
    }

    for (let i = 0; i < 5; i += 1) {
      const x = 120 + i * 36 + Math.sin(t * 1.2 + i) * 6;
      const y = 494 + Math.cos(t * 0.9 + i) * 3;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244,248,252,0.26)";
      ctx.fill();
    }
  }

  function drawRouteBeds(ctx, kernel, projection, destination, pulse) {
    const rows = [...kernel.pathsById.values()];

    for (const row of rows) {
      polyline(ctx, row.centerline);
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(80,68,52,0.28)";
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
