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
    gradient.addColorStop(0, "rgba(214,200,162,0.94)");
    gradient.addColorStop(1, "rgba(176,166,126,0.98)");
    return gradient;
  }

  if (terrainClass === "harbor_edge_slope") {
    const gradient = ctx.createLinearGradient(0, 600, 0, 720);
    gradient.addColorStop(0, "rgba(226,214,182,0.92)");
    gradient.addColorStop(1, "rgba(184,170,132,0.96)");
    return gradient;
  }

  if (terrainClass === "dockside_hardscape") {
    return "rgba(160,124,92,0.96)";
  }

  if (terrainClass === "inland_harbor_rise") {
    const gradient = ctx.createLinearGradient(0, 700, 0, 850);
    gradient.addColorStop(0, "rgba(188,180,142,0.88)");
    gradient.addColorStop(1, "rgba(148,154,112,0.94)");
    return gradient;
  }

  if (terrainClass === "cliff_candidate_edge") {
    return "rgba(170,162,146,0.90)";
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
    gradient.addColorStop(0, "rgba(192,176,136,0.86)");
    gradient.addColorStop(1, "rgba(158,142,110,0.94)");
    return gradient;
  }

  if (substrateClass === "dry_sand") {
    return "rgba(224,206,162,0.90)";
  }

  if (substrateClass === "mixed_gravel") {
    return "rgba(152,148,132,0.88)";
  }

  if (substrateClass === "bedrock_edge") {
    return "rgba(126,130,138,0.86)";
  }

  if (substrateClass === "dock_hard_surface") {
    return "rgba(132,102,80,0.98)";
  }

  if (substrateClass === "shallow_water_margin") {
    const gradient = ctx.createLinearGradient(0, 676, 0, 844);
    gradient.addColorStop(0, "rgba(94,152,186,0.38)");
    gradient.addColorStop(1, "rgba(66,118,156,0.56)");
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

function waterStyle(waterClass, ctx) {
  if (waterClass === "harbor") {
    const gradient = ctx.createLinearGradient(0, 650, 0, 860);
    gradient.addColorStop(0, "rgba(126,192,226,0.30)");
    gradient.addColorStop(1, "rgba(72,134,176,0.52)");
    return gradient;
  }

  if (waterClass === "basin") {
    const gradient = ctx.createLinearGradient(0, 330, 0, 400);
    gradient.addColorStop(0, "rgba(134,188,208,0.22)");
    gradient.addColorStop(1, "rgba(86,136,156,0.44)");
    return gradient;
  }

  return "rgba(90,150,190,0.34)";
}

function drawHarborCoastGeometry(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  fillPolygon(ctx, coast.harborPeninsula, "rgba(170,164,128,0.96)");
  strokePolygon(ctx, coast.harborPeninsula, "rgba(252,244,226,0.26)", 2.4);

  if (Array.isArray(coast.reefZones)) {
    for (const reefPolygon of coast.reefZones) {
      fillPolygon(ctx, reefPolygon, "rgba(118,170,164,0.10)");
      strokePolygon(ctx, reefPolygon, "rgba(214,236,232,0.12)", 1);
    }
  }

  if (Array.isArray(coast.firmnessZones)) {
    for (const zone of coast.firmnessZones) {
      fillPolygon(ctx, zone.polygon, "rgba(220,210,176,0.06)");
    }
  }

  strokePolygon(ctx, coast.harborBasin, "rgba(246,250,255,0.34)", 2.1);
  strokePolygon(ctx, coast.harborChannel, "rgba(236,246,255,0.20)", 1.4);
}

function drawExposureZones(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.exposureZones)) return;

  for (const zone of coast.exposureZones) {
    fillPolygon(ctx, zone.polygon, "rgba(90,140,180,0.08)");
    strokePolygon(ctx, zone.polygon, "rgba(150,200,240,0.12)", 1);
  }
}

function drawFirmnessZones(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.firmnessZones)) return;

  for (const zone of coast.firmnessZones) {
    fillPolygon(ctx, zone.polygon, "rgba(226,210,160,0.10)");
    strokePolygon(ctx, zone.polygon, "rgba(255,236,182,0.14)", 1);
  }
}

function drawBasinDepthTint(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast?.harborBasin) return;

  polygon(ctx, coast.harborBasin);

  const gradient = ctx.createRadialGradient(
    590, 760, 10,
    590, 760, 180
  );

  gradient.addColorStop(0, "rgba(70,120,160,0.16)");
  gradient.addColorStop(1, "rgba(40,90,130,0.04)");

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawWaterRows(ctx, rows) {
  for (const water of rows) {
    fillPolygon(ctx, water.polygon, waterStyle(water.waterClass, ctx));
    strokePolygon(ctx, water.polygon, "rgba(236,248,255,0.18)", 1.2);
  }
}

function drawRegionBoundaries(ctx, kernel) {
  if (!kernel?.regionBoundariesById) return;

  for (const boundary of kernel.regionBoundariesById.values()) {
    if (boundary.parentRegion !== "harbor") continue;
    strokePolygon(ctx, boundary.polygon, "rgba(246,240,226,0.10)", 1);
  }
}

function drawTerrainRows(ctx, rows) {
  for (const terrain of rows) {
    fillPolygon(ctx, terrain.polygon, terrainStyle(terrain.terrainClass, ctx));
    strokePolygon(ctx, terrain.polygon, "rgba(252,246,232,0.08)", 1);
  }
}

function drawSubstrateRows(ctx, rows) {
  for (const substrate of rows) {
    fillPolygon(ctx, substrate.polygon, substrateStyle(substrate.substrateClass, ctx));
    strokePolygon(ctx, substrate.polygon, "rgba(255,248,236,0.06)", 0.9);
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

function drawHarborNavigationEdges(ctx, kernel, pulse) {
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationEdgesById) return;

  for (const edge of harborGraph.navigationEdgesById.values()) {
    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(4, (edge.nominalWidth || 20) * 0.16);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(126,196,226,0.10)";
    ctx.stroke();

    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(1.25, (edge.nominalWidth || 20) * 0.04);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = `rgba(220,246,255,${0.14 + (pulse * 0.08)})`;
    ctx.stroke();
  }
}

function drawHarborNavigationNodes(ctx, kernel) {
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationNodesById) return;

  for (const node of harborGraph.navigationNodesById.values()) {
    const [x, y] = node.centerPoint;
    let radius = 4;
    let fill = "rgba(214,240,250,0.42)";
    let stroke = "rgba(255,255,255,0.10)";

    if (node.nodeClass === "mooring") {
      radius = 5;
      fill = "rgba(242,224,166,0.52)";
      stroke = "rgba(255,246,214,0.16)";
    }

    if (node.nodeClass === "transfer") {
      radius = 5.5;
      fill = "rgba(182,234,206,0.56)";
      stroke = "rgba(226,255,242,0.18)";
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTraversalPaths(ctx, kernel, projection, destination, pulse) {
  if (!kernel?.pathsById) return;

  for (const path of kernel.pathsById.values()) {
    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(6, (path.nominalWidth || 56) * 0.24);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(82,72,60,0.30)";
    ctx.stroke();

    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(3, (path.nominalWidth || 56) * 0.11);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(222,198,146,0.26)";
    ctx.stroke();

    const isDestinationPath = destination && projection && (
      path.fromRegionId === projection.regionId && path.toRegionId === destination.regionId
    );

    if (isDestinationPath) {
      polyline(ctx, path.centerline);
      ctx.lineWidth = Math.max(4, (path.nominalWidth || 56) * 0.1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(255,240,188,${0.18 + (pulse * 0.22)})`;
      ctx.stroke();
    }
  }
}

function drawHarborChartAccents(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  if (Array.isArray(coast.coastlineOuter) && coast.coastlineOuter.length) {
    strokePolygon(ctx, coast.coastlineOuter, "rgba(255,255,255,0.05)", 5);
  }

  strokePolygon(ctx, coast.harborPeninsula, "rgba(255,248,214,0.12)", 4);

  if (kernel?.regionBoundariesById) {
    const west = kernel.regionBoundariesById.get("harbor_inner_shore_west");
    const east = kernel.regionBoundariesById.get("harbor_inner_shore_east");
    if (west) strokePolygon(ctx, west.polygon, "rgba(255,244,214,0.12)", 1.4);
    if (east) strokePolygon(ctx, east.polygon, "rgba(255,244,214,0.12)", 1.4);
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
      fill = "rgba(120,170,196,0.14)";
      ctx.fillStyle = "rgba(136,94,66,0.96)";
      ctx.fillRect(x - 36, y + 9, 72, 13);
      ctx.fillRect(x - 10, y - 2, 20, 18);
      ctx.strokeStyle = "rgba(255,240,220,0.10)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 36, y + 9, 72, 13);
      ctx.strokeRect(x - 10, y - 2, 20, 18);
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
    const manualWaterRows = kernel?.watersById ? [...kernel.watersById.values()] : [];
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
    drawExposureZones(ctx, kernel);
    drawFirmnessZones(ctx, kernel);
    drawBasinDepthTint(ctx, kernel);
    drawWaterRows(ctx, manualWaterRows);
    drawTerrainRows(ctx, manualTerrainRows);
    drawTerrainRows(ctx, generatedTerrainRows);
    drawSubstrateRows(ctx, manualSubstrateRows);
    drawSubstrateRows(ctx, generatedSubstrateRows);
    drawRegionBoundaries(ctx, kernel);
    drawHarborChartAccents(ctx, kernel);
    drawHarborNavigationEdges(ctx, kernel, pulse);
    drawHarborNavigationNodes(ctx, kernel);
    drawTraversalPaths(ctx, kernel, projection, destination, pulse);
    drawRegionPads(ctx, kernel);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
