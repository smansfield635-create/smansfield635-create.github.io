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

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function terrainStyle(terrainClass, ctx) {
  if (terrainClass === "outer_beach_band") {
    const gradient = ctx.createLinearGradient(260, 700, 860, 1020);
    gradient.addColorStop(0, "rgba(244,228,186,0.96)");
    gradient.addColorStop(0.48, "rgba(228,210,168,0.95)");
    gradient.addColorStop(1, "rgba(204,186,146,0.96)");
    return gradient;
  }

  if (terrainClass === "outer_shore_shoulder") {
    const gradient = ctx.createLinearGradient(300, 650, 860, 980);
    gradient.addColorStop(0, "rgba(210,198,156,0.92)");
    gradient.addColorStop(0.52, "rgba(184,176,134,0.94)");
    gradient.addColorStop(1, "rgba(156,154,116,0.96)");
    return gradient;
  }

  if (terrainClass === "coastal_lowland") {
    const gradient = ctx.createLinearGradient(260, 640, 780, 990);
    gradient.addColorStop(0, "rgba(236,222,186,0.96)");
    gradient.addColorStop(0.45, "rgba(212,196,156,0.95)");
    gradient.addColorStop(1, "rgba(176,164,126,0.98)");
    return gradient;
  }

  if (terrainClass === "harbor_edge_slope") {
    const gradient = ctx.createLinearGradient(360, 610, 780, 820);
    gradient.addColorStop(0, "rgba(232,218,186,0.94)");
    gradient.addColorStop(0.55, "rgba(198,182,142,0.95)");
    gradient.addColorStop(1, "rgba(168,154,118,0.98)");
    return gradient;
  }

  if (terrainClass === "dockside_hardscape") {
    const gradient = ctx.createLinearGradient(450, 700, 700, 840);
    gradient.addColorStop(0, "rgba(176,138,102,0.98)");
    gradient.addColorStop(1, "rgba(134,102,76,0.98)");
    return gradient;
  }

  if (terrainClass === "inland_harbor_rise") {
    const gradient = ctx.createLinearGradient(420, 690, 760, 910);
    gradient.addColorStop(0, "rgba(194,186,146,0.90)");
    gradient.addColorStop(0.5, "rgba(168,166,128,0.92)");
    gradient.addColorStop(1, "rgba(142,150,108,0.96)");
    return gradient;
  }

  if (terrainClass === "cliff_candidate_edge") {
    const gradient = ctx.createLinearGradient(640, 520, 870, 730);
    gradient.addColorStop(0, "rgba(176,168,154,0.92)");
    gradient.addColorStop(1, "rgba(134,134,132,0.94)");
    return gradient;
  }

  if (terrainClass === "market_hardscape") {
    const gradient = ctx.createLinearGradient(620, 610, 840, 770);
    gradient.addColorStop(0, "rgba(214,190,156,0.92)");
    gradient.addColorStop(1, "rgba(184,158,124,0.92)");
    return gradient;
  }

  if (terrainClass === "market_edge_transition") {
    const gradient = ctx.createLinearGradient(580, 620, 870, 790);
    gradient.addColorStop(0, "rgba(194,176,136,0.82)");
    gradient.addColorStop(1, "rgba(162,148,114,0.84)");
    return gradient;
  }

  if (terrainClass === "market_inner_ground") {
    const gradient = ctx.createLinearGradient(600, 620, 850, 790);
    gradient.addColorStop(0, "rgba(218,194,158,0.88)");
    gradient.addColorStop(1, "rgba(188,166,130,0.88)");
    return gradient;
  }

  if (terrainClass === "basin_floor") {
    const gradient = ctx.createLinearGradient(360, 250, 760, 440);
    gradient.addColorStop(0, "rgba(178,184,160,0.82)");
    gradient.addColorStop(0.5, "rgba(146,156,136,0.86)");
    gradient.addColorStop(1, "rgba(122,136,120,0.90)");
    return gradient;
  }

  if (terrainClass === "basin_edge_slope") {
    const gradient = ctx.createLinearGradient(340, 280, 760, 480);
    gradient.addColorStop(0, "rgba(194,184,150,0.80)");
    gradient.addColorStop(1, "rgba(164,160,132,0.82)");
    return gradient;
  }

  if (terrainClass === "basin_rise_transition") {
    const gradient = ctx.createLinearGradient(320, 320, 760, 530);
    gradient.addColorStop(0, "rgba(180,176,144,0.78)");
    gradient.addColorStop(1, "rgba(156,154,128,0.82)");
    return gradient;
  }

  if (terrainClass === "ridge_spine") {
    const gradient = ctx.createLinearGradient(240, 120, 560, 420);
    gradient.addColorStop(0, "rgba(186,178,160,0.88)");
    gradient.addColorStop(1, "rgba(156,150,140,0.88)");
    return gradient;
  }

  if (terrainClass === "ridge_slope") {
    const gradient = ctx.createLinearGradient(220, 120, 580, 460);
    gradient.addColorStop(0, "rgba(162,156,144,0.78)");
    gradient.addColorStop(1, "rgba(134,132,126,0.80)");
    return gradient;
  }

  if (terrainClass === "summit_platform") {
    const gradient = ctx.createLinearGradient(380, 40, 620, 220);
    gradient.addColorStop(0, "rgba(226,220,208,0.92)");
    gradient.addColorStop(1, "rgba(196,192,186,0.92)");
    return gradient;
  }

  return "rgba(160,160,140,0.8)";
}

function substrateStyle(substrateClass, ctx) {
  if (substrateClass === "wet_sand") {
    const gradient = ctx.createLinearGradient(320, 700, 760, 900);
    gradient.addColorStop(0, "rgba(202,186,144,0.88)");
    gradient.addColorStop(0.55, "rgba(174,156,120,0.92)");
    gradient.addColorStop(1, "rgba(150,132,102,0.96)");
    return gradient;
  }

  if (substrateClass === "dry_sand") {
    const gradient = ctx.createLinearGradient(320, 660, 790, 970);
    gradient.addColorStop(0, "rgba(232,214,170,0.92)");
    gradient.addColorStop(1, "rgba(210,192,150,0.92)");
    return gradient;
  }

  if (substrateClass === "mixed_gravel") {
    const gradient = ctx.createLinearGradient(420, 640, 760, 840);
    gradient.addColorStop(0, "rgba(164,158,142,0.90)");
    gradient.addColorStop(1, "rgba(136,132,120,0.92)");
    return gradient;
  }

  if (substrateClass === "bedrock_edge") {
    const gradient = ctx.createLinearGradient(650, 530, 870, 720);
    gradient.addColorStop(0, "rgba(132,138,148,0.90)");
    gradient.addColorStop(1, "rgba(108,112,122,0.92)");
    return gradient;
  }

  if (substrateClass === "dock_hard_surface") {
    const gradient = ctx.createLinearGradient(420, 650, 700, 860);
    gradient.addColorStop(0, "rgba(146,114,88,0.98)");
    gradient.addColorStop(1, "rgba(114,88,68,0.98)");
    return gradient;
  }

  if (substrateClass === "shallow_water_margin") {
    const gradient = ctx.createLinearGradient(320, 676, 780, 870);
    gradient.addColorStop(0, "rgba(136,186,208,0.42)");
    gradient.addColorStop(0.6, "rgba(104,158,188,0.46)");
    gradient.addColorStop(1, "rgba(72,126,160,0.58)");
    return gradient;
  }

  if (substrateClass === "market_stone_surface") {
    const gradient = ctx.createLinearGradient(610, 620, 840, 770);
    gradient.addColorStop(0, "rgba(182,166,142,0.90)");
    gradient.addColorStop(1, "rgba(154,142,122,0.90)");
    return gradient;
  }

  if (substrateClass === "market_dust_surface") {
    const gradient = ctx.createLinearGradient(600, 620, 850, 770);
    gradient.addColorStop(0, "rgba(206,188,148,0.82)");
    gradient.addColorStop(1, "rgba(180,162,126,0.84)");
    return gradient;
  }

  if (substrateClass === "basin_packed_earth") {
    const gradient = ctx.createLinearGradient(340, 270, 720, 460);
    gradient.addColorStop(0, "rgba(160,154,132,0.86)");
    gradient.addColorStop(1, "rgba(132,128,110,0.86)");
    return gradient;
  }

  if (substrateClass === "basin_moist_margin") {
    const gradient = ctx.createLinearGradient(340, 270, 760, 470);
    gradient.addColorStop(0, "rgba(126,150,154,0.62)");
    gradient.addColorStop(1, "rgba(94,124,132,0.68)");
    return gradient;
  }

  if (substrateClass === "basin_stone_edge") {
    const gradient = ctx.createLinearGradient(320, 250, 760, 500);
    gradient.addColorStop(0, "rgba(146,144,146,0.82)");
    gradient.addColorStop(1, "rgba(120,120,124,0.84)");
    return gradient;
  }

  if (substrateClass === "ridge_stone") {
    const gradient = ctx.createLinearGradient(220, 120, 580, 420);
    gradient.addColorStop(0, "rgba(156,150,144,0.86)");
    gradient.addColorStop(1, "rgba(128,124,120,0.86)");
    return gradient;
  }

  if (substrateClass === "summit_stone") {
    const gradient = ctx.createLinearGradient(380, 40, 620, 220);
    gradient.addColorStop(0, "rgba(220,216,208,0.92)");
    gradient.addColorStop(1, "rgba(194,190,186,0.92)");
    return gradient;
  }

  return "rgba(140,140,140,0.8)";
}

function waterStyle(waterClass, ctx) {
  if (waterClass === "harbor") {
    const gradient = ctx.createLinearGradient(180, 560, 1040, 940);
    gradient.addColorStop(0, "rgba(94,174,226,0.34)");
    gradient.addColorStop(0.38, "rgba(72,148,204,0.42)");
    gradient.addColorStop(0.72, "rgba(54,120,176,0.52)");
    gradient.addColorStop(1, "rgba(34,92,146,0.62)");
    return gradient;
  }

  if (waterClass === "basin") {
    const gradient = ctx.createLinearGradient(280, 270, 760, 470);
    gradient.addColorStop(0, "rgba(154,198,216,0.24)");
    gradient.addColorStop(0.5, "rgba(110,164,186,0.34)");
    gradient.addColorStop(1, "rgba(72,126,150,0.46)");
    return gradient;
  }

  const gradient = ctx.createLinearGradient(120, 500, 1080, 1120);
  gradient.addColorStop(0, "rgba(86,160,208,0.22)");
  gradient.addColorStop(1, "rgba(38,104,156,0.42)");
  return gradient;
}

function drawOpenSeaAtmosphere(ctx) {
  const gradient = ctx.createRadialGradient(680, 520, 80, 680, 520, 760);
  gradient.addColorStop(0, "rgba(122,214,255,0.12)");
  gradient.addColorStop(0.38, "rgba(82,170,224,0.08)");
  gradient.addColorStop(1, "rgba(18,62,108,0.00)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawHarborCoastGeometry(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  fillPolygon(ctx, coast.harborPeninsula, "rgba(170,162,126,0.28)");
  strokePolygon(ctx, coast.harborPeninsula, "rgba(254,244,226,0.18)", 1.8);

  if (Array.isArray(coast.reefZones)) {
    for (const reefPolygon of coast.reefZones) {
      fillPolygon(ctx, reefPolygon, "rgba(118,170,164,0.10)");
      strokePolygon(ctx, reefPolygon, "rgba(214,236,232,0.12)", 1);
    }
  }

  if (Array.isArray(coast.firmnessZones)) {
    for (const zone of coast.firmnessZones) {
      fillPolygon(ctx, zone.polygon, "rgba(220,210,176,0.04)");
    }
  }

  strokePolygon(ctx, coast.harborBasin, "rgba(246,250,255,0.28)", 1.7);
  strokePolygon(ctx, coast.harborChannel, "rgba(236,246,255,0.16)", 1.2);
}

function drawExposureZones(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.exposureZones)) return;

  for (const zone of coast.exposureZones) {
    fillPolygon(ctx, zone.polygon, "rgba(90,140,180,0.06)");
    strokePolygon(ctx, zone.polygon, "rgba(150,200,240,0.10)", 1);
  }
}

function drawFirmnessZones(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.firmnessZones)) return;

  for (const zone of coast.firmnessZones) {
    fillPolygon(ctx, zone.polygon, "rgba(226,210,160,0.08)");
    strokePolygon(ctx, zone.polygon, "rgba(255,236,182,0.12)", 1);
  }
}

function drawBasinDepthTint(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast?.harborBasin) return;

  polygon(ctx, coast.harborBasin);

  const gradient = ctx.createRadialGradient(590, 760, 16, 590, 760, 240);
  gradient.addColorStop(0, "rgba(56,114,156,0.26)");
  gradient.addColorStop(0.42, "rgba(44,98,140,0.14)");
  gradient.addColorStop(1, "rgba(28,72,116,0.02)");

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawWaterRows(ctx, rows) {
  for (const water of rows) {
    fillPolygon(ctx, water.polygon, waterStyle(water.waterClass, ctx));
    strokePolygon(ctx, water.polygon, "rgba(236,248,255,0.16)", 1.1);
  }
}

function drawWaterRipples(ctx, tick) {
  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.05);
  const lanes = [
    { x: 280, y: 724, w: 200, h: 32, a: 0.08 + (pulse * 0.02) },
    { x: 426, y: 754, w: 210, h: 36, a: 0.07 + (pulse * 0.02) },
    { x: 600, y: 738, w: 180, h: 32, a: 0.08 + (pulse * 0.02) },
    { x: 790, y: 714, w: 170, h: 30, a: 0.07 + (pulse * 0.02) },
    { x: 808, y: 828, w: 160, h: 28, a: 0.05 + (pulse * 0.01) },
    { x: 182, y: 842, w: 142, h: 26, a: 0.05 + (pulse * 0.01) }
  ];

  ctx.save();
  for (const lane of lanes) {
    const gradient = ctx.createLinearGradient(lane.x, lane.y, lane.x + lane.w, lane.y + lane.h);
    gradient.addColorStop(0, `rgba(236,248,255,${lane.a})`);
    gradient.addColorStop(0.5, `rgba(190,228,248,${lane.a * 0.72})`);
    gradient.addColorStop(1, "rgba(236,248,255,0.00)");
    ctx.fillStyle = gradient;
    roundRect(ctx, lane.x, lane.y, lane.w, lane.h, 18);
    ctx.fill();
  }
  ctx.restore();
}

function drawWetEdgeHighlights(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  strokePolygon(ctx, coast.harborPeninsula, "rgba(255,244,212,0.06)", 3.2);
  strokePolygon(ctx, coast.harborBasin, "rgba(168,214,236,0.10)", 5);
  strokePolygon(ctx, coast.harborChannel, "rgba(182,224,244,0.08)", 4);
}

function drawFoamBands(ctx) {
  const foamArcs = [
    { x: 372, y: 782, rx: 74, ry: 18, lw: 2.2, a: 0.22 },
    { x: 474, y: 804, rx: 92, ry: 24, lw: 2.4, a: 0.24 },
    { x: 614, y: 790, rx: 86, ry: 22, lw: 2.1, a: 0.22 },
    { x: 790, y: 708, rx: 66, ry: 18, lw: 1.8, a: 0.18 },
    { x: 882, y: 724, rx: 56, ry: 14, lw: 1.6, a: 0.16 }
  ];

  ctx.save();
  for (const arc of foamArcs) {
    ctx.beginPath();
    ctx.ellipse(arc.x, arc.y, arc.rx, arc.ry, 0, Math.PI * 1.06, Math.PI * 1.94);
    ctx.strokeStyle = `rgba(246,252,255,${arc.a})`;
    ctx.lineWidth = arc.lw;
    ctx.stroke();
  }
  ctx.restore();
}

function drawRegionBoundaries(ctx, kernel) {
  if (!kernel?.regionBoundariesById) return;

  for (const boundary of kernel.regionBoundariesById.values()) {
    if (boundary.parentRegion !== "harbor") continue;
    strokePolygon(ctx, boundary.polygon, "rgba(246,240,226,0.08)", 1);
  }
}

function drawTerrainRows(ctx, rows) {
  for (const terrain of rows) {
    fillPolygon(ctx, terrain.polygon, terrainStyle(terrain.terrainClass, ctx));
    strokePolygon(ctx, terrain.polygon, "rgba(252,246,232,0.06)", 1);
  }
}

function drawSubstrateRows(ctx, rows) {
  for (const substrate of rows) {
    fillPolygon(ctx, substrate.polygon, substrateStyle(substrate.substrateClass, ctx));
    strokePolygon(ctx, substrate.polygon, "rgba(255,248,236,0.05)", 0.9);
  }
}

function drawTerrainGrain(ctx) {
  const grains = [
    [332, 788], [366, 802], [404, 826], [452, 836], [498, 846], [540, 836],
    [586, 822], [628, 804], [670, 792], [708, 776], [748, 754], [530, 308],
    [562, 326], [604, 340], [644, 354], [282, 250], [316, 274], [352, 298]
  ];

  ctx.save();
  for (const [x, y] of grains) {
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(110,92,66,0.10)";
    ctx.fill();
  }
  ctx.restore();
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

function getDockTransferIds(kernel, activeHarborInstanceId) {
  if (!activeHarborInstanceId) return new Set();

  const transfers = kernel?.helpers?.getHarborDockTransfers?.(activeHarborInstanceId) ?? [];
  return new Set(transfers.map((transfer) => transfer.dockId));
}

function drawSeaHazards(ctx, kernel, traversalMode) {
  const seaHazardsById = kernel?.maritimeNetwork?.seaHazardsById;
  if (!seaHazardsById) return;

  for (const hazard of seaHazardsById.values()) {
    let fill = "rgba(86,132,164,0.04)";
    let stroke = "rgba(140,196,224,0.08)";

    if (hazard.hazardClass === "reef") {
      fill = traversalMode === "boat"
        ? "rgba(126,196,176,0.10)"
        : "rgba(126,196,176,0.05)";
      stroke = traversalMode === "boat"
        ? "rgba(196,244,226,0.16)"
        : "rgba(196,244,226,0.08)";
    }

    if (hazard.hazardClass === "current") {
      fill = traversalMode === "boat"
        ? "rgba(110,156,220,0.08)"
        : "rgba(110,156,220,0.04)";
      stroke = traversalMode === "boat"
        ? "rgba(198,226,255,0.14)"
        : "rgba(198,226,255,0.08)";
    }

    fillPolygon(ctx, hazard.polygon, fill);
    strokePolygon(ctx, hazard.polygon, stroke, 1);
  }
}

function drawHarborNavigationEdges(ctx, kernel, pulse, traversalMode) {
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationEdgesById) return;

  for (const edge of harborGraph.navigationEdgesById.values()) {
    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(4, (edge.nominalWidth || 20) * 0.16);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? `rgba(160,222,248,${0.18 + (pulse * 0.10)})`
      : "rgba(126,196,226,0.08)";
    ctx.stroke();

    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(1.25, (edge.nominalWidth || 20) * 0.04);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? `rgba(236,250,255,${0.30 + (pulse * 0.14)})`
      : `rgba(220,246,255,${0.12 + (pulse * 0.06)})`;
    ctx.stroke();
  }
}

function drawSeaRoutes(ctx, kernel, pulse, traversalMode) {
  const seaRoutesById = kernel?.maritimeNetwork?.seaRoutesById;
  if (!seaRoutesById) return;

  for (const route of seaRoutesById.values()) {
    polyline(ctx, route.centerline);
    ctx.lineWidth = Math.max(5, (route.nominalWidth || 24) * 0.18);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? `rgba(104,186,234,${0.22 + (pulse * 0.10)})`
      : "rgba(88,168,214,0.08)";
    ctx.stroke();

    polyline(ctx, route.centerline);
    ctx.lineWidth = Math.max(1.5, (route.nominalWidth || 24) * 0.05);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? `rgba(228,248,255,${0.34 + (pulse * 0.14)})`
      : `rgba(214,240,255,${0.10 + (pulse * 0.05)})`;
    ctx.stroke();
  }
}

function drawHarborNavigationNodes(ctx, runtime) {
  const { kernel, traversalMode, activeHarborInstanceId, selection, destination, tick } = runtime;
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationNodesById) return;

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);
  const dockTransferIds = getDockTransferIds(kernel, activeHarborInstanceId);

  for (const node of harborGraph.navigationNodesById.values()) {
    const [x, y] = node.centerPoint;
    const isDockTransfer = dockTransferIds.has(node.navNodeId);
    const isSelectedDockTransfer = selection?.kind === "dock_transfer" && selection.dockId === node.navNodeId;
    const isSelectedNode = selection?.kind === "harbor_nav_node" && selection.navNodeId === node.navNodeId;
    const isDestinationDockTransfer = destination?.kind === "dock_transfer" && destination.dockId === node.navNodeId;
    const isDestinationNode = destination?.kind === "harbor_nav_node" && destination.navNodeId === node.navNodeId;
    const isHighlighted = isDockTransfer || isSelectedDockTransfer || isSelectedNode || isDestinationDockTransfer || isDestinationNode;

    let radius = 4;
    let fill = "rgba(214,240,250,0.36)";
    let stroke = "rgba(255,255,255,0.08)";

    if (node.nodeClass === "mooring") {
      radius = 6;
      fill = "rgba(242,224,166,0.72)";
      stroke = "rgba(255,246,214,0.26)";
    }

    if (node.nodeClass === "transfer") {
      radius = 7;
      fill = "rgba(182,234,206,0.74)";
      stroke = "rgba(226,255,242,0.28)";
    }

    if (isDockTransfer) {
      ctx.beginPath();
      ctx.arc(x, y, 14 + (pulse * 2), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? `rgba(156,246,255,${0.40 + (pulse * 0.16)})`
        : `rgba(255,236,170,${0.34 + (pulse * 0.10)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 20 + (pulse * 2.5), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? `rgba(156,246,255,${0.18 + (pulse * 0.08)})`
        : `rgba(255,236,170,${0.14 + (pulse * 0.06)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 6 + (pulse * 1.5), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(248,250,255,0.24)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (isDockTransfer) {
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 5);
      ctx.strokeStyle = traversalMode === "boat"
        ? "rgba(230,252,255,0.58)"
        : "rgba(255,246,214,0.58)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}

function drawSeaNodes(ctx, runtime) {
  const { kernel, traversalMode, selection, destination, tick } = runtime;
  const seaNodesById = kernel?.maritimeNetwork?.seaNodesById;
  if (!seaNodesById) return;

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

  for (const node of seaNodesById.values()) {
    const [x, y] = node.centerPoint;
    const isSelected = selection?.kind === "sea_node" && selection.seaNodeId === node.seaNodeId;
    const isDestination = destination?.kind === "sea_node" && destination.seaNodeId === node.seaNodeId;

    if (isSelected || isDestination) {
      ctx.beginPath();
      ctx.arc(x, y, 15 + (pulse * 2), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? `rgba(188,240,255,${0.40 + (pulse * 0.16)})`
        : "rgba(188,240,255,0.12)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = traversalMode === "boat"
      ? "rgba(174,226,255,0.74)"
      : "rgba(154,204,236,0.34)";
    ctx.fill();
    ctx.strokeStyle = traversalMode === "boat"
      ? "rgba(242,250,255,0.24)"
      : "rgba(242,250,255,0.10)";
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
    ctx.strokeStyle = "rgba(82,72,60,0.28)";
    ctx.stroke();

    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(3, (path.nominalWidth || 56) * 0.11);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(222,198,146,0.22)";
    ctx.stroke();

    const isDestinationPath = destination && projection && destination.kind === "region"
      && path.fromRegionId === projection.regionId
      && path.toRegionId === destination.regionId;

    if (isDestinationPath) {
      polyline(ctx, path.centerline);
      ctx.lineWidth = Math.max(4, (path.nominalWidth || 56) * 0.1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(255,240,188,${0.16 + (pulse * 0.18)})`;
      ctx.stroke();
    }
  }
}

function drawHarborChartAccents(ctx, kernel) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  if (Array.isArray(coast.coastlineOuter) && coast.coastlineOuter.length) {
    strokePolygon(ctx, coast.coastlineOuter, "rgba(255,255,255,0.04)", 4);
  }

  strokePolygon(ctx, coast.harborPeninsula, "rgba(255,248,214,0.08)", 2.4);

  if (kernel?.regionBoundariesById) {
    const west = kernel.regionBoundariesById.get("harbor_inner_shore_west");
    const east = kernel.regionBoundariesById.get("harbor_inner_shore_east");
    if (west) strokePolygon(ctx, west.polygon, "rgba(255,244,214,0.10)", 1.2);
    if (east) strokePolygon(ctx, east.polygon, "rgba(255,244,214,0.10)", 1.2);
  }
}

function drawStructureShadows(ctx, kernel) {
  if (!kernel?.regionsById) return;

  for (const region of kernel.regionsById.values()) {
    const [x, y] = region.centerPoint;

    if (region.regionId === "harbor_village") {
      ctx.fillStyle = "rgba(22,34,48,0.16)";
      ctx.fillRect(x - 26, y + 20, 78, 12);
      ctx.fillRect(x - 2, y + 8, 24, 20);
    }

    if (region.regionId === "market_district") {
      ctx.fillStyle = "rgba(22,34,48,0.14)";
      ctx.fillRect(x - 18, y + 14, 54, 10);
    }

    if (region.regionId === "summit_plaza") {
      ctx.beginPath();
      ctx.ellipse(x + 6, y + 14, 24, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(22,34,48,0.12)";
      ctx.fill();
    }
  }
}

function drawHarborProps(ctx) {
  const props = [
    { kind: "post", x: 482, y: 768, h: 18 },
    { kind: "post", x: 506, y: 762, h: 16 },
    { kind: "post", x: 614, y: 762, h: 16 },
    { kind: "post", x: 638, y: 756, h: 18 },
    { kind: "crate", x: 548, y: 748, w: 11, h: 9 },
    { kind: "crate", x: 561, y: 744, w: 10, h: 8 },
    { kind: "crate", x: 692, y: 622, w: 10, h: 8 },
    { kind: "boat", x: 456, y: 784, w: 30, h: 10, a: -0.10 },
    { kind: "boat", x: 644, y: 778, w: 34, h: 11, a: 0.06 },
    { kind: "lantern", x: 706, y: 620, h: 12 }
  ];

  ctx.save();

  for (const prop of props) {
    if (prop.kind === "post") {
      ctx.beginPath();
      ctx.moveTo(prop.x, prop.y - prop.h);
      ctx.lineTo(prop.x, prop.y);
      ctx.strokeStyle = "rgba(92,66,46,0.82)";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(prop.x, prop.y - prop.h, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(182,146,96,0.78)";
      ctx.fill();
    }

    if (prop.kind === "crate") {
      ctx.fillStyle = "rgba(148,112,78,0.88)";
      ctx.fillRect(prop.x, prop.y, prop.w, prop.h);
      ctx.strokeStyle = "rgba(244,226,188,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(prop.x, prop.y, prop.w, prop.h);
    }

    if (prop.kind === "boat") {
      ctx.save();
      ctx.translate(prop.x, prop.y);
      ctx.rotate(prop.a);
      ctx.beginPath();
      ctx.ellipse(0, 0, prop.w * 0.5, prop.h * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(88,58,42,0.80)";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1, prop.w * 0.34, prop.h * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(196,170,126,0.56)";
      ctx.fill();
      ctx.restore();
    }

    if (prop.kind === "lantern") {
      ctx.beginPath();
      ctx.moveTo(prop.x, prop.y - prop.h);
      ctx.lineTo(prop.x, prop.y);
      ctx.strokeStyle = "rgba(106,84,60,0.82)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(prop.x, prop.y - prop.h, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,220,146,0.68)";
      ctx.fill();

      const glow = ctx.createRadialGradient(prop.x, prop.y - prop.h, 1, prop.x, prop.y - prop.h, 18);
      glow.addColorStop(0, "rgba(255,224,162,0.18)");
      glow.addColorStop(1, "rgba(255,224,162,0.00)");
      ctx.fillStyle = glow;
      ctx.fillRect(prop.x - 18, prop.y - prop.h - 18, 36, 36);
    }
  }

  ctx.restore();
}

function drawRegionPads(ctx, kernel) {
  if (!kernel?.regionsById) return;

  for (const region of kernel.regionsById.values()) {
    const [x, y] = region.centerPoint;
    let rx = 44;
    let ry = 22;
    let fill = "rgba(122,136,112,0.10)";

    if (region.regionId === "harbor_village") {
      rx = 66;
      ry = 26;
      fill = "rgba(120,170,196,0.12)";
      ctx.fillStyle = "rgba(150,108,82,0.96)";
      ctx.fillRect(x - 36, y + 9, 72, 13);
      ctx.fillRect(x - 10, y - 2, 20, 18);
      ctx.strokeStyle = "rgba(255,240,220,0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 36, y + 9, 72, 13);
      ctx.strokeRect(x - 10, y - 2, 20, 18);
    }

    if (region.regionId === "market_district") {
      rx = 58;
      ry = 24;
      fill = "rgba(176,146,102,0.14)";
      ctx.fillStyle = "rgba(172,124,84,0.92)";
      ctx.fillRect(x - 24, y + 4, 48, 12);
    }

    if (region.regionId === "exploration_basin") {
      rx = 76;
      ry = 30;
      fill = "rgba(112,128,112,0.06)";
    }

    if (region.regionId === "summit_approach") {
      rx = 56;
      ry = 24;
      fill = "rgba(198,194,184,0.08)";
    }

    if (region.regionId === "summit_plaza") {
      rx = 40;
      ry = 18;
      fill = "rgba(210,206,198,0.12)";
    }

    ctx.beginPath();
    ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

function drawAtmosphericVeil(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 1180, 1240);
  gradient.addColorStop(0, "rgba(255,255,255,0.04)");
  gradient.addColorStop(0.45, "rgba(180,220,244,0.02)");
  gradient.addColorStop(1, "rgba(18,32,52,0.06)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

export function createGroundRenderer() {
  function draw(ctx, runtime) {
    const {
      viewportOffset,
      kernel,
      projection,
      destination,
      tick,
      traversalMode = "foot",
      activeHarborInstanceId = null
    } = runtime;

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

    drawOpenSeaAtmosphere(ctx);
    drawSeaHazards(ctx, kernel, traversalMode);
    drawHarborCoastGeometry(ctx, kernel);
    drawExposureZones(ctx, kernel);
    drawFirmnessZones(ctx, kernel);
    drawBasinDepthTint(ctx, kernel);
    drawWaterRows(ctx, manualWaterRows);
    drawWaterRipples(ctx, tick);
    drawSeaRoutes(ctx, kernel, pulse, traversalMode);
    drawWetEdgeHighlights(ctx, kernel);
    drawFoamBands(ctx);
    drawTerrainRows(ctx, manualTerrainRows);
    drawTerrainRows(ctx, generatedTerrainRows);
    drawSubstrateRows(ctx, manualSubstrateRows);
    drawSubstrateRows(ctx, generatedSubstrateRows);
    drawTerrainGrain(ctx);
    drawStructureShadows(ctx, kernel);
    drawRegionBoundaries(ctx, kernel);
    drawHarborChartAccents(ctx, kernel);
    drawHarborNavigationEdges(ctx, kernel, pulse, traversalMode);
    drawSeaNodes(ctx, {
      ...runtime,
      kernel,
      tick,
      traversalMode,
      activeHarborInstanceId
    });
    drawHarborNavigationNodes(ctx, {
      ...runtime,
      kernel,
      tick,
      traversalMode,
      activeHarborInstanceId
    });
    drawHarborProps(ctx);
    drawTraversalPaths(ctx, kernel, projection, destination, pulse);
    drawRegionPads(ctx, kernel);
    drawAtmosphericVeil(ctx);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
