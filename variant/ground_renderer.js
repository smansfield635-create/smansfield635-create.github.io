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
    const water = ctx.createLinearGradient(0, 240, 0, height + 260);
    water.addColorStop(0, "rgba(68,108,134,1)");
    water.addColorStop(0.42, "rgba(38,76,104,1)");
    water.addColorStop(1, "rgba(18,42,64,1)");
    ctx.fillStyle = water;
    ctx.fillRect(-600, 220, width + 1200, height + 500);
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

    roundedPolygon(ctx, island);
    const ground = ctx.createLinearGradient(0, 120, 0, 660);
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
    const harborRise = [
      [384, 620],[422, 560],[484, 508],[552, 484],[614, 494],[656, 534],[664, 592],[632, 632],[578, 644],[504, 646],[432, 640]
    ];
    const basinRise = [
      [434, 372],[460, 312],[500, 246],[538, 186],[566, 154],[552, 214],[516, 282],[482, 344],[460, 390]
    ];
    const summitMass = [
      [508, 206],[526, 164],[548, 128],[574, 110],[600, 126],[614, 164],[610, 204],[588, 226],[552, 224],[524, 220]
    ];

    roundedPolygon(ctx, harborRise);
    ctx.fillStyle = "rgba(126,136,100,0.42)";
    ctx.fill();

    roundedPolygon(ctx, basinRise);
    ctx.fillStyle = "rgba(112,118,96,0.46)";
    ctx.fill();

    roundedPolygon(ctx, summitMass);
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
      let rx = 74;
      let ry = 38;

      if (region.regionId === "harbor_village") {
        fill = "rgba(148,128,102,0.24)";
        rx = 102;
        ry = 40;
      }
      if (region.regionId === "market_district") {
        fill = "rgba(154,126,92,0.24)";
        rx = 90;
        ry = 44;
      }
      if (region.regionId === "exploration_basin") {
        fill = "rgba(98,122,108,0.22)";
        rx = 120;
        ry = 56;
      }
      if (region.regionId === "summit_plaza") {
        fill = "rgba(180,176,170,0.24)";
        rx = 74;
        ry = 34;
      }

      ctx.beginPath();
      ctx.ellipse(x, y + 8, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isActive || isSelected || isDestination) {
        ctx.beginPath();
        ctx.ellipse(x, y + 8, rx + 10 + pulse * 6, ry + 6 + pulse * 2, 0, 0, Math.PI * 2);
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
    ctx.ellipse(560, 320, 112, 72, 0, 0, Math.PI * 2);
    const basin = ctx.createLinearGradient(448, 248, 672, 392);
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
      [448, 648],
      [458, 610],
      [488, 584],
      [540, 572],
      [594, 580],
      [624, 604],
      [634, 648]
    ];

    roundedPolygon(ctx, harbor);
    const water = ctx.createLinearGradient(448, 570, 634, 650);
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
    const harborFoam = [
      [456, 606],[490, 584],[540, 574],[590, 582],[622, 606]
    ];
    const basinFoam = [
      [446, 382],[482, 402],[534, 412],[590, 408],[640, 390],[676, 360]
    ];

    drawPolyline(ctx, harborFoam);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(244,236,214,0.42)";
    ctx.stroke();

    drawPolyline(ctx, basinFoam);
    ctx.strokeStyle = "rgba(236,242,248,0.30)";
    ctx.stroke();
  }

  function drawLandmarks(ctx, kernel, pulse) {
    const regions = [...kernel.regionsById.values()];
    for (const region of regions) {
      const [x, y] = region.centerPoint;

      if (region.regionId === "harbor_village") {
        ctx.fillStyle = "rgba(98,74,56,0.94)";
        ctx.fillRect(x - 22, y + 16, 44, 8);
        ctx.fillRect(x - 3, y - 10, 6, 30);
        ctx.fillRect(x - 58, y + 18, 20, 8);
        ctx.fillRect(x + 38, y + 18, 20, 8);
      }

      if (region.regionId === "market_district") {
        ctx.fillStyle = "rgba(152,108,74,0.94)";
        ctx.fillRect(x - 26, y + 6, 52, 14);
        ctx.fillStyle = "rgba(212,180,132,0.86)";
        ctx.fillRect(x - 18, y - 8, 36, 10);
        ctx.fillRect(x - 42, y + 8, 10, 12);
        ctx.fillRect(x + 32, y + 8, 10, 12);
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
