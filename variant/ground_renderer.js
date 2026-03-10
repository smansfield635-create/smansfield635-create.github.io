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

  if (terrainClass === "market_hardscape") {
    return "rgba(196,174,142,0.88)";
  }

  if (terrainClass === "market_edge_transition") {
    return "rgba(182,164,126,0.78)";
  }

  if (terrainClass === "market_inner_ground") {
    return "rgba(208,186,150,0.86)";
  }

  if (terrainClass === "basin_floor") {
    const gradient = ctx.createLinearGradient(0, 260, 0, 420);
    gradient.addColorStop(0, "rgba(170,178,154,0.78)");
    gradient.addColorStop(1, "rgba(132,144,126,0.86)");
    return gradient;
  }

  if (terrainClass === "basin_edge_slope") {
    return "rgba(188,180,146,0.74)";
  }

  if (terrainClass === "basin_rise_transition") {
    return "rgba(172,170,138,0.74)";
  }

  if (terrainClass === "ridge_spine") {
    return "rgba(176,168,152,0.84)";
  }

  if (terrainClass === "ridge_slope") {
    return "rgba(150,146,134,0.74)";
  }

  if (terrainClass === "summit_platform") {
    return "rgba(214,208,194,0.88)";
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

  if (substrateClass === "market_stone_surface") {
    return "rgba(172,156,132,0.88)";
  }

  if (substrateClass === "market_dust_surface") {
    return "rgba(198,180,142,0.78)";
  }

  if (substrateClass === "basin_packed_earth") {
    return "rgba(150,146,124,0.82)";
  }

  if (substrateClass === "basin_moist_margin") {
    return "rgba(118,142,146,0.58)";
  }

  if (substrateClass === "basin_stone_edge") {
    return "rgba(136,136,142,0.78)";
  }

  if (substrateClass === "ridge_stone") {
    return "rgba(148,144,138,0.82)";
  }

  if (substrateClass === "summit_stone") {
    return "rgba(210,208,202,0.90)";
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

function drawTerrainRows(ctx, rows) {
  for (const terrain of rows) {
    fillPolygon(ctx, terrain.polygon, terrainStyle(terrain.terrainClass, ctx));
    strokePolygon(ctx, terrain.polygon, "rgba(250,244,228,0.06)", 0.9);
  }
}

function drawSubstrateRows(ctx, rows) {
  for (const substrate of rows) {
    fillPolygon(ctx, substrate.polygon, substrateStyle(substrate.substrateClass, ctx));
    strokePolygon(ctx, substrate.polygon, "rgba(252,246,232,0.05)", 0.8);
  }
}

function getManualRegionIds(rowsMap) {
  const regionIds = new Set();
  if (!rowsMap) return regionIds;

  for (const row of rowsMap.values()) {
    if (row?.regionId) regionIds.add(row.regionId);
  }

  return regionIds;
}

function getGeneratedRowsForTemplateOnlyRegions(generatedMap, manualMap) {
  if (!generatedMap) return [];
  const manualRegionIds = getManualRegionIds(manualMap);
  const rows = [];

  for (const row of generatedMap.values()) {
    if (!manualRegionIds.has(row.regionId)) {
      rows.push(row);
    }
  }

  return rows;
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

    if (region.regionId === "summit_approach") {
      rx = 56;
      ry = 24;
      fill = "rgba(198,194,184,0.10)";
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

    const manualTerrainRows = kernel?.terrainPolygonsById ? [...kernel.terrainPolygonsById.values()] : [];
    const manualSubstrateRows = kernel?.substratePolygonsById ? [...kernel.substratePolygonsById.values()] : [];
    const generatedTerrainRows = getGeneratedRowsForTemplateOnlyRegions(
      kernel?.generatedTerrainPolygonsById,
      kernel?.terrainPolygonsById
    );
    const generatedSubstrateRows = getGeneratedRowsForTemplateOnlyRegions(
      kernel?.generatedSubstratePolygonsById,
      kernel?.substratePolygonsById
    );

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawHarborCoastGeometry(ctx, kernel);
    drawTerrainRows(ctx, manualTerrainRows);
    drawTerrainRows(ctx, generatedTerrainRows);
    drawSubstrateRows(ctx, manualSubstrateRows);
    drawSubstrateRows(ctx, generatedSubstrateRows);
    drawRegionBoundaries(ctx, kernel);
    drawTraversalPaths(ctx, kernel, projection, destination, pulse);
    drawRegionPads(ctx, kernel);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
