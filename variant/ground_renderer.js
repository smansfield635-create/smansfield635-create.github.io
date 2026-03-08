function roundedPolygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
}

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { width, height, tick, viewportOffset, kernel, projection, selection, destination } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawSeaBase(ctx, width, height);
    drawIslandMass(ctx);
    drawElevationBands(ctx);
    drawDistrictPads(ctx, kernel, projection, selection, destination, pulse);
    drawBasinWater(ctx);
    drawHarborWater(ctx);
    drawShoreHighlights(ctx);
    drawLandmarks(ctx, kernel, pulse);
    drawPathBeds(ctx, kernel, projection, destination, pulse);

    ctx.restore();
  }

  function drawSeaBase(ctx, width, height) {
    const water = ctx.createLinearGradient(0, 280, 0, height + 200);
    water.addColorStop(0, "rgba(68,108,134,1)");
    water.addColorStop(0.42, "rgba(38,76,104,1)");
    water.addColorStop(1, "rgba(18,42,64,1)");
    ctx.fillStyle = water;
    ctx.fillRect(-600, 220, width + 1200, height + 500);
  }

  function drawIslandMass(ctx) {
    const island = [
      [40, 520],
      [90, 445],
      [170, 380],
      [280, 340],
      [420, 305],
      [585, 250],
      [760, 185],
      [920, 120],
      [1010, 110],
      [1035, 150],
      [1010, 210],
      [960, 260],
      [910, 330],
      [860, 395],
      [785, 470],
      [690, 535],
      [575, 580],
      [450, 606],
      [320, 612],
      [210, 596],
      [120, 566]
    ];

    roundedPolygon(ctx, island);
    const ground = ctx.createLinearGradient(0, 120, 0, 640);
    ground.addColorStop(0, "rgba(158,144,114,1)");
    ground.addColorStop(0.38, "rgba(122,124,92,1)");
    ground.addColorStop(0.72, "rgba(86,108,82,1)");
    ground.addColorStop(1, "rgba(70,92,78,1)");
    ctx.fillStyle = ground;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(236,224,196,0.34)";
    ctx.stroke();
  }

  function drawElevationBands(ctx) {
    const ridge1 = [
      [170, 520],[250,470],[350,420],[470,380],[590,325],[710,270],[835,220],[930,200],[955,235],[910,290],
      [830,350],[730,410],[600,470],[470,520],[330,552],[220,550]
    ];
    const ridge2 = [
      [520,505],[610,455],[710,395],[810,332],[885,290],[910,315],[872,366],[810,428],[730,488],[650,530],[565,548]
    ];
    const summit = [
      [820,282],[860,238],[900,214],[930,226],[928,265],[902,305],[860,332],[820,320]
    ];

    roundedPolygon(ctx, ridge1);
    ctx.fillStyle = "rgba(126,136,100,0.42)";
    ctx.fill();

    roundedPolygon(ctx, ridge2);
    ctx.fillStyle = "rgba(112,118,96,0.46)";
    ctx.fill();

    roundedPolygon(ctx, summit);
    ctx.fillStyle = "rgba(186,182,170,0.55)";
    ctx.fill();
  }

  function drawDistrictPads(ctx, kernel, projection, selection, destination, pulse) {
    const regions = [...kernel.regionsById.values()];

    for (const region of regions) {
      const [x, y] = region.centerPoint;
      const isActive = projection?.regionId === region.regionId;
      const isSelected = selection?.kind === "region" && selection.regionId === region.regionId;
      const isDestination = destination?.regionId === region.regionId;

      let fill = "rgba(90,116,98,0.18)";
      if (region.regionId === "harbor_village") fill = "rgba(116,128,108,0.26)";
      if (region.regionId === "market_district") fill = "rgba(154,126,92,0.24)";
      if (region.regionId === "exploration_basin") fill = "rgba(98,122,108,0.22)";
      if (region.regionId === "summit_plaza") fill = "rgba(180,176,170,0.24)";

      ctx.beginPath();
      ctx.ellipse(x, y + 8, 74, 38, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 84 + pulse * 6, 44 + pulse * 2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? "rgba(255,240,210,0.88)"
          : isActive
            ? "rgba(255,228,184,0.72)"
            : "rgba(210,232,248,0.66)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  function drawBasinWater(ctx) {
    ctx.beginPath();
    ctx.ellipse(660, 330, 118, 70, -0.12, 0, Math.PI * 2);
    const basin = ctx.createLinearGradient(580, 250, 720, 400);
    basin.addColorStop(0, "rgba(104,156,170,0.92)");
    basin.addColorStop(0.5, "rgba(62,118,142,0.94)");
    basin.addColorStop(1, "rgba(34,84,112,0.96)");
    ctx.fillStyle = basin;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(214,236,246,0.34)";
    ctx.stroke();
  }

  function drawHarborWater(ctx) {
    const harbor = [
      [72, 518],
      [112, 470],
      [176, 430],
      [252, 404],
      [292, 430],
      [262, 484],
      [206, 526],
      [138, 550],
      [92, 544]
    ];

    roundedPolygon(ctx, harbor);
    const water = ctx.createLinearGradient(72, 404, 292, 560);
    water.addColorStop(0, "rgba(114,164,180,0.94)");
    water.addColorStop(0.45, "rgba(72,124,150,0.94)");
    water.addColorStop(1, "rgba(40,90,118,0.96)");
    ctx.fillStyle = water;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(222,238,248,0.34)";
    ctx.stroke();
  }

  function drawShoreHighlights(ctx) {
    const shoreA = [
      [88, 520],[124, 490],[174, 458],[230, 438],[264, 446]
    ];
    const shoreB = [
      [580, 368],[626, 392],[690, 392],[744, 368]
    ];

    drawPolyline(ctx, shoreA);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(244,236,214,0.42)";
    ctx.stroke();

    drawPolyline(ctx, shoreB);
    ctx.strokeStyle = "rgba(236,242,248,0.30)";
    ctx.stroke();
  }

  function drawLandmarks(ctx, kernel, pulse) {
    const regions = [...kernel.regionsById.values()];
    for (const region of regions) {
      const [x, y] = region.centerPoint;

      if (region.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(98,74,56,0.94)";
        ctx.fillRect(x - 18, y + 16, 36, 8);
        ctx.fillRect(x - 2, y - 8, 4, 28);
      }

      if (region.regionId === "market_district") {
        ctx.fillStyle = "rgba(152,108,74,0.94)";
        ctx.fillRect(x - 24, y + 6, 48, 14);
        ctx.fillStyle = "rgba(212,180,132,0.86)";
        ctx.fillRect(x - 16, y - 8, 32, 10);
      }

      if (region.regionId === "exploration_basin") {
        ctx.beginPath();
        ctx.arc(x, y - 6, 10 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,246,255,0.22)";
        ctx.fill();
      }

      if (region.regionId === "summit_plaza") {
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fillStyle = "rgba(220,214,208,0.94)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 34, 7 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,244,222,0.38)";
        ctx.fill();
      }
    }
  }

  function drawPathBeds(ctx, kernel, projection, destination, pulse) {
    const paths = [...kernel.pathsById.values()];

    for (const path of paths) {
      ctx.beginPath();
      path.centerline.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(80,68,52,0.28)";
      ctx.stroke();

      const isDestinationPath = destination && projection && (
        path.fromRegionId === projection.regionId && path.toRegionId === destination.regionId
      );

      if (isDestinationPath) {
        ctx.beginPath();
        path.centerline.forEach(([x, y], index) => {
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
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
