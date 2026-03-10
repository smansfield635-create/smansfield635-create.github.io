function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function polyline(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
}

function fillPolygon(ctx, points, fillStyle) {
  polygon(ctx, points);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokePolygon(ctx, points, strokeStyle, lineWidth = 1) {
  polygon(ctx, points);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function terrainStyle(terrainClass, ctx) {
  if (terrainClass === "coastal_lowland") {
    const gradient = ctx.createLinearGradient(0, 690, 0, 990);
    gradient.addColorStop(0, "rgba(186,176,132,0.88)");
    gradient.addColorStop(1, "rgba(142,152,104,0.96)");
    return gradient;
  }

  if (terrainClass === "harbor_edge_slope") {
    const gradient = ctx.createLinearGradient(0, 600, 0, 700);
    gradient.addColorStop(0, "rgba(206,196,164,0.86)");
    gradient.addColorStop(1, "rgba(164,156,126,0.92)");
    return gradient;
  }

  if (terrainClass === "dockside_hardscape") {
    return "rgba(148,126,108,0.92)";
  }

  if (terrainClass === "inland_harbor_rise") {
    const gradient = ctx.createLinearGradient(0, 700, 0, 850);
    gradient.addColorStop(0, "rgba(172,166,126,0.82)");
    gradient.addColorStop(1, "rgba(132,144,102,0.90)");
    return gradient;
  }

  if (terrainClass === "cliff_candidate_edge") {
    return "rgba(162,154,138,0.86)";
  }

  return "rgba(160,160,140,0.8)";
}

function substrateStyle(substrateClass, ctx) {
  if (substrateClass === "wet_sand") {
    const gradient = ctx.createLinearGradient(0, 720, 0, 840);
    gradient.addColorStop(0, "rgba(180,166,132,0.82)");
    gradient.addColorStop(1, "rgba(150,136,108,0.92)");
    return gradient;
  }

  if (substrateClass === "dry_sand") {
    return "rgba(212,194,152,0.88)";
  }

  if (substrateClass === "mixed_gravel") {
    return "rgba(146,142,128,0.86)";
  }

  if (substrateClass === "bedrock_edge") {
    return "rgba(124,126,132,0.84)";
  }

  if (substrateClass === "dock_hard_surface") {
    return "rgba(124,102,84,0.96)";
  }

  if (substrateClass === "shallow_water_margin") {
    const gradient = ctx.createLinearGradient(0, 676, 0, 844);
    gradient.addColorStop(0, "rgba(78,134,168,0.44)");
    gradient.addColorStop(1, "rgba(58,108,146,0.62)");
    return gradient;
  }

  return "rgba(140,140,140,0.8)";
}

function drawHarborCoastGeometry(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  fillPolygon(ctx, coast.harborPeninsula, "rgba(164,160,126,0.94)");
  strokePolygon(ctx, coast.harborPeninsula, "rgba(248,238,214,0.24)", 2.2);

  if (Array.isArray(coast.reefZones)) {
    for (const reefPolygon of coast.reefZones) {
      fillPolygon(ctx, reefPolygon, "rgba(124,164,156,0.12)");
      strokePolygon(ctx, reefPolygon, "rgba(212,232,230,0.14)", 1.1);
    }
  }

  if (Array.isArray(coast.firmnessZones)) {
    for (const zone of coast.firmnessZones) {
      fillPolygon(ctx, zone.polygon, "rgba(214,204,168,0.08)");
    }
  }

  strokePolygon(ctx, coast.harborBasin, "rgba(228,242,246,0.22)", 1.6);
  strokePolygon(ctx, coast.harborChannel, "rgba(228,242,246,0.16)", 1.25);
}

function drawRegionBoundaries(ctx, kernel) {
  if (!kernel?.regionBoundariesById) return;

  for (const boundary of kernel.regionBoundariesById.values()) {
    if (boundary.parentRegion !== "harbor") continue;
    strokePolygon(ctx, boundary.polygon, "rgba(244,238,222,0.08)", 1);
  }
}

function drawTerrainPolygons(ctx, kernel) {
  if (!kernel?.terrainPolygonsById) return;

  for (const terrain of kernel.terrainPolygonsById.values()) {
    fillPolygon(ctx, terrain.polygon, terrainStyle(terrain.terrainClass, ctx));
    strokePolygon(ctx, terrain.polygon, "rgba(250,244,228,0.06)", 0.9);
  }
}

function drawSubstratePolygons(ctx, kernel) {
  if (!kernel?.substratePolygonsById) return;

  for (const substrate of kernel.substratePolygonsById.values()) {
    fillPolygon(ctx, substrate.polygon, substrateStyle(substrate.substrateClass, ctx));
    strokePolygon(ctx, substrate.polygon, "rgba(252,246,232,0.05)", 0.8);
  }
}

function drawTraversalPaths(ctx, kernel, projection, destination, pulse) {
  if (!kernel?.pathsById) return;

  for (const path of kernel.pathsById.values()) {
    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(6, (path.nominalWidth || 56) * 0.24);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(88,74,58,0.28)";
    ctx.stroke();

    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(3, (path.nominalWidth || 56) * 0.11);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(214,188,136,0.22)";
    ctx.stroke();

    const isDestinationPath = destination && projection && (
      path.fromRegionId === projection.regionId && path.toRegionId === destination.regionId
    );

    if (isDestinationPath) {
      polyline(ctx, path.centerline);
      ctx.lineWidth = Math.max(4, (path.nominalWidth || 56) * 0.1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(252,234,182,${0.18 + (pulse * 0.2)})`;
      ctx.stroke();
    }
  }
}

function drawRegionPads(ctx, kernel) {
  if (!kernel?.regionsById) return;

  for (const region of kernel.regionsById.values()) {
    const [x, y] = region.centerPoint;
    let rx = 44;
    let ry = 22;
    let fill = "rgba(122,136,112,0.12)";

    if (region.regionId === "harbor_village") {
      rx = 66;
      ry = 26;
      fill = "rgba(176,150,118,0.18)";
      ctx.fillStyle = "rgba(126,88,62,0.94)";
      ctx.fillRect(x - 34, y + 10, 68, 12);
      ctx.fillRect(x - 10, y - 2, 20, 18);
    }

    if (region.regionId === "market_district") {
      rx = 58;
      ry = 24;
      fill = "rgba(176,146,102,0.16)";
      ctx.fillStyle = "rgba(160,114,76,0.92)";
      ctx.fillRect(x - 24, y + 4, 48, 12);
    }

    if (region.regionId === "exploration_basin") {
      rx = 76;
      ry = 30;
      fill = "rgba(112,128,112,0.08)";
    }

    if (region.regionId === "summit_plaza") {
      rx = 40;
      ry = 18;
      fill = "rgba(210,206,198,0.14)";
    }

    ctx.beginPath();
    ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, kernel, projection, destination, tick } = runtime;
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawHarborCoastGeometry(ctx, kernel);
    drawTerrainPolygons(ctx, kernel);
    drawSubstratePolygons(ctx, kernel);
    drawRegionBoundaries(ctx, kernel);
    drawTraversalPaths(ctx, kernel, projection, destination, pulse);
    drawRegionPads(ctx, kernel);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
