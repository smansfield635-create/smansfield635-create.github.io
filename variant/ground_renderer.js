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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function terrainPriority(terrainClass) {
  if (terrainClass === "coastal_lowland") return 10;
  if (terrainClass === "outer_beach_band") return 20;
  if (terrainClass === "outer_shore_shoulder") return 30;
  if (terrainClass === "harbor_edge_slope") return 40;
  if (terrainClass === "inland_harbor_rise") return 50;
  if (terrainClass === "cliff_candidate_edge") return 60;
  if (terrainClass === "dockside_hardscape") return 70;
  if (terrainClass === "market_hardscape") return 80;
  if (terrainClass === "market_edge_transition") return 90;
  if (terrainClass === "market_inner_ground") return 100;
  if (terrainClass === "basin_floor") return 110;
  if (terrainClass === "basin_edge_slope") return 120;
  if (terrainClass === "basin_rise_transition") return 130;
  if (terrainClass === "ridge_spine") return 140;
  if (terrainClass === "ridge_slope") return 150;
  if (terrainClass === "summit_platform") return 160;
  return 1000;
}

function substratePriority(substrateClass) {
  if (substrateClass === "shallow_water_margin") return 10;
  if (substrateClass === "wet_sand") return 20;
  if (substrateClass === "dry_sand") return 30;
  if (substrateClass === "outer_beach_band") return 40;
  if (substrateClass === "mixed_gravel") return 50;
  if (substrateClass === "bedrock_edge") return 60;
  if (substrateClass === "dock_hard_surface") return 70;
  if (substrateClass === "market_stone_surface") return 80;
  if (substrateClass === "market_dust_surface") return 90;
  if (substrateClass === "basin_packed_earth") return 100;
  if (substrateClass === "basin_moist_margin") return 110;
  if (substrateClass === "basin_stone_edge") return 120;
  if (substrateClass === "ridge_stone") return 130;
  if (substrateClass === "summit_stone") return 140;
  return 1000;
}

function sortTerrainRows(rows) {
  return [...rows].sort((a, b) => {
    const pa = terrainPriority(a.terrainClass);
    const pb = terrainPriority(b.terrainClass);
    if (pa !== pb) return pa - pb;
    return String(a.terrainId).localeCompare(String(b.terrainId));
  });
}

function sortSubstrateRows(rows) {
  return [...rows].sort((a, b) => {
    const pa = substratePriority(a.substrateClass);
    const pb = substratePriority(b.substrateClass);
    if (pa !== pb) return pa - pb;
    return String(a.substrateId).localeCompare(String(b.substrateId));
  });
}

function getPhaseLabel(runtime) {
  return runtime?.phase?.globalPhase ?? "CALM";
}

function getPhaseIntensity(runtime) {
  const value = runtime?.phase?.intensity;
  return Number.isFinite(value) ? clamp(value, 0, 1) : 0.2;
}

function getGroundPhaseModifiers(phaseLabel, intensity) {
  if (phaseLabel === "CLEAR_WINDOW") {
    return Object.freeze({
      wash: -0.08,
      contrast: 0.12,
      desat: -0.04,
      glow: 0.12,
      pathGlow: 0.16,
      waterEdge: 0.08
    });
  }

  if (phaseLabel === "LOCKDOWN") {
    return Object.freeze({
      wash: 0.24 + (intensity * 0.10),
      contrast: -0.16,
      desat: 0.24,
      glow: -0.08,
      pathGlow: -0.04,
      waterEdge: 0.18
    });
  }

  if (phaseLabel === "SEVERE") {
    return Object.freeze({
      wash: 0.14 + (intensity * 0.06),
      contrast: -0.08,
      desat: 0.14,
      glow: -0.02,
      pathGlow: 0.02,
      waterEdge: 0.10
    });
  }

  if (phaseLabel === "UNSTABLE") {
    return Object.freeze({
      wash: 0.08,
      contrast: -0.03,
      desat: 0.07,
      glow: 0.02,
      pathGlow: 0.06,
      waterEdge: 0.06
    });
  }

  if (phaseLabel === "BUILDING") {
    return Object.freeze({
      wash: 0.03,
      contrast: 0.00,
      desat: 0.02,
      glow: 0.04,
      pathGlow: 0.08,
      waterEdge: 0.04
    });
  }

  if (phaseLabel === "RECOVERY") {
    return Object.freeze({
      wash: 0.01,
      contrast: 0.03,
      desat: 0.01,
      glow: 0.05,
      pathGlow: 0.08,
      waterEdge: 0.03
    });
  }

  return Object.freeze({
    wash: 0,
    contrast: 0,
    desat: 0,
    glow: 0,
    pathGlow: 0,
    waterEdge: 0
  });
}

function rgbaAdjusted(r, g, b, a, mods) {
  const gray = (r + g + b) / 3;
  let nr = lerp(r, gray, mods.desat);
  let ng = lerp(g, gray, mods.desat);
  let nb = lerp(b, gray, mods.desat);

  nr = lerp(nr, 255, Math.max(0, mods.glow * 0.45));
  ng = lerp(ng, 255, Math.max(0, mods.glow * 0.35));
  nb = lerp(nb, 255, Math.max(0, mods.glow * 0.28));

  nr = clamp(nr + (mods.wash * 30), 0, 255);
  ng = clamp(ng + (mods.wash * 26), 0, 255);
  nb = clamp(nb + (mods.wash * 22), 0, 255);

  return `rgba(${nr.toFixed(0)},${ng.toFixed(0)},${nb.toFixed(0)},${clamp(a, 0, 1).toFixed(3)})`;
}

function terrainStyle(terrainClass, ctx, mods) {
  if (terrainClass === "outer_beach_band") {
    const gradient = ctx.createLinearGradient(260, 700, 860, 1020);
    gradient.addColorStop(0, rgbaAdjusted(244, 228, 186, 0.96, mods));
    gradient.addColorStop(0.48, rgbaAdjusted(228, 210, 168, 0.95, mods));
    gradient.addColorStop(1, rgbaAdjusted(204, 186, 146, 0.96, mods));
    return gradient;
  }

  if (terrainClass === "outer_shore_shoulder") {
    const gradient = ctx.createLinearGradient(300, 650, 860, 980);
    gradient.addColorStop(0, rgbaAdjusted(210, 198, 156, 0.92, mods));
    gradient.addColorStop(0.52, rgbaAdjusted(184, 176, 134, 0.94, mods));
    gradient.addColorStop(1, rgbaAdjusted(156, 154, 116, 0.96, mods));
    return gradient;
  }

  if (terrainClass === "coastal_lowland") {
    const gradient = ctx.createLinearGradient(260, 640, 780, 990);
    gradient.addColorStop(0, rgbaAdjusted(236, 222, 186, 0.96, mods));
    gradient.addColorStop(0.45, rgbaAdjusted(212, 196, 156, 0.95, mods));
    gradient.addColorStop(1, rgbaAdjusted(176, 164, 126, 0.98, mods));
    return gradient;
  }

  if (terrainClass === "harbor_edge_slope") {
    const gradient = ctx.createLinearGradient(360, 610, 780, 820);
    gradient.addColorStop(0, rgbaAdjusted(232, 218, 186, 0.94, mods));
    gradient.addColorStop(0.55, rgbaAdjusted(198, 182, 142, 0.95, mods));
    gradient.addColorStop(1, rgbaAdjusted(168, 154, 118, 0.98, mods));
    return gradient;
  }

  if (terrainClass === "dockside_hardscape") {
    const gradient = ctx.createLinearGradient(450, 700, 700, 840);
    gradient.addColorStop(0, rgbaAdjusted(176, 138, 102, 0.98, mods));
    gradient.addColorStop(1, rgbaAdjusted(134, 102, 76, 0.98, mods));
    return gradient;
  }

  if (terrainClass === "inland_harbor_rise") {
    const gradient = ctx.createLinearGradient(420, 690, 760, 910);
    gradient.addColorStop(0, rgbaAdjusted(194, 186, 146, 0.90, mods));
    gradient.addColorStop(0.5, rgbaAdjusted(168, 166, 128, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(142, 150, 108, 0.96, mods));
    return gradient;
  }

  if (terrainClass === "cliff_candidate_edge") {
    const gradient = ctx.createLinearGradient(640, 520, 870, 730);
    gradient.addColorStop(0, rgbaAdjusted(176, 168, 154, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(134, 134, 132, 0.94, mods));
    return gradient;
  }

  if (terrainClass === "market_hardscape") {
    const gradient = ctx.createLinearGradient(620, 610, 840, 770);
    gradient.addColorStop(0, rgbaAdjusted(214, 190, 156, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(184, 158, 124, 0.92, mods));
    return gradient;
  }

  if (terrainClass === "market_edge_transition") {
    const gradient = ctx.createLinearGradient(580, 620, 870, 790);
    gradient.addColorStop(0, rgbaAdjusted(194, 176, 136, 0.82, mods));
    gradient.addColorStop(1, rgbaAdjusted(162, 148, 114, 0.84, mods));
    return gradient;
  }

  if (terrainClass === "market_inner_ground") {
    const gradient = ctx.createLinearGradient(600, 620, 850, 790);
    gradient.addColorStop(0, rgbaAdjusted(218, 194, 158, 0.88, mods));
    gradient.addColorStop(1, rgbaAdjusted(188, 166, 130, 0.88, mods));
    return gradient;
  }

  if (terrainClass === "basin_floor") {
    const gradient = ctx.createLinearGradient(360, 250, 760, 440);
    gradient.addColorStop(0, rgbaAdjusted(178, 184, 160, 0.82, mods));
    gradient.addColorStop(0.5, rgbaAdjusted(146, 156, 136, 0.86, mods));
    gradient.addColorStop(1, rgbaAdjusted(122, 136, 120, 0.90, mods));
    return gradient;
  }

  if (terrainClass === "basin_edge_slope") {
    const gradient = ctx.createLinearGradient(340, 280, 760, 480);
    gradient.addColorStop(0, rgbaAdjusted(194, 184, 150, 0.80, mods));
    gradient.addColorStop(1, rgbaAdjusted(164, 160, 132, 0.82, mods));
    return gradient;
  }

  if (terrainClass === "basin_rise_transition") {
    const gradient = ctx.createLinearGradient(320, 320, 760, 530);
    gradient.addColorStop(0, rgbaAdjusted(180, 176, 144, 0.78, mods));
    gradient.addColorStop(1, rgbaAdjusted(156, 154, 128, 0.82, mods));
    return gradient;
  }

  if (terrainClass === "ridge_spine") {
    const gradient = ctx.createLinearGradient(240, 120, 560, 420);
    gradient.addColorStop(0, rgbaAdjusted(186, 178, 160, 0.88, mods));
    gradient.addColorStop(1, rgbaAdjusted(156, 150, 140, 0.88, mods));
    return gradient;
  }

  if (terrainClass === "ridge_slope") {
    const gradient = ctx.createLinearGradient(220, 120, 580, 460);
    gradient.addColorStop(0, rgbaAdjusted(162, 156, 144, 0.78, mods));
    gradient.addColorStop(1, rgbaAdjusted(134, 132, 126, 0.80, mods));
    return gradient;
  }

  if (terrainClass === "summit_platform") {
    const gradient = ctx.createLinearGradient(380, 40, 620, 220);
    gradient.addColorStop(0, rgbaAdjusted(226, 220, 208, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(196, 192, 186, 0.92, mods));
    return gradient;
  }

  return rgbaAdjusted(160, 160, 140, 0.8, mods);
}

function substrateStyle(substrateClass, ctx, mods) {
  if (substrateClass === "wet_sand") {
    const gradient = ctx.createLinearGradient(320, 700, 760, 900);
    gradient.addColorStop(0, rgbaAdjusted(202, 186, 144, 0.88, mods));
    gradient.addColorStop(0.55, rgbaAdjusted(174, 156, 120, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(150, 132, 102, 0.96, mods));
    return gradient;
  }

  if (substrateClass === "dry_sand") {
    const gradient = ctx.createLinearGradient(320, 660, 790, 970);
    gradient.addColorStop(0, rgbaAdjusted(232, 214, 170, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(210, 192, 150, 0.92, mods));
    return gradient;
  }

  if (substrateClass === "outer_beach_band") {
    const gradient = ctx.createLinearGradient(300, 680, 820, 980);
    gradient.addColorStop(0, rgbaAdjusted(222, 204, 162, 0.90, mods));
    gradient.addColorStop(1, rgbaAdjusted(192, 174, 136, 0.92, mods));
    return gradient;
  }

  if (substrateClass === "mixed_gravel") {
    const gradient = ctx.createLinearGradient(420, 640, 760, 840);
    gradient.addColorStop(0, rgbaAdjusted(164, 158, 142, 0.90, mods));
    gradient.addColorStop(1, rgbaAdjusted(136, 132, 120, 0.92, mods));
    return gradient;
  }

  if (substrateClass === "bedrock_edge") {
    const gradient = ctx.createLinearGradient(650, 530, 870, 720);
    gradient.addColorStop(0, rgbaAdjusted(132, 138, 148, 0.90, mods));
    gradient.addColorStop(1, rgbaAdjusted(108, 112, 122, 0.92, mods));
    return gradient;
  }

  if (substrateClass === "dock_hard_surface") {
    const gradient = ctx.createLinearGradient(420, 650, 700, 860);
    gradient.addColorStop(0, rgbaAdjusted(146, 114, 88, 0.98, mods));
    gradient.addColorStop(1, rgbaAdjusted(114, 88, 68, 0.98, mods));
    return gradient;
  }

  if (substrateClass === "shallow_water_margin") {
    const edgeMods = {
      ...mods,
      glow: mods.glow + mods.waterEdge,
      wash: mods.wash * 0.7
    };
    const gradient = ctx.createLinearGradient(320, 676, 780, 870);
    gradient.addColorStop(0, rgbaAdjusted(136, 186, 208, 0.42, edgeMods));
    gradient.addColorStop(0.6, rgbaAdjusted(104, 158, 188, 0.46, edgeMods));
    gradient.addColorStop(1, rgbaAdjusted(72, 126, 160, 0.58, edgeMods));
    return gradient;
  }

  if (substrateClass === "market_stone_surface") {
    const gradient = ctx.createLinearGradient(610, 620, 840, 770);
    gradient.addColorStop(0, rgbaAdjusted(182, 166, 142, 0.90, mods));
    gradient.addColorStop(1, rgbaAdjusted(154, 142, 122, 0.90, mods));
    return gradient;
  }

  if (substrateClass === "market_dust_surface") {
    const gradient = ctx.createLinearGradient(600, 620, 850, 770);
    gradient.addColorStop(0, rgbaAdjusted(206, 188, 148, 0.82, mods));
    gradient.addColorStop(1, rgbaAdjusted(180, 162, 126, 0.84, mods));
    return gradient;
  }

  if (substrateClass === "basin_packed_earth") {
    const gradient = ctx.createLinearGradient(340, 270, 720, 460);
    gradient.addColorStop(0, rgbaAdjusted(160, 154, 132, 0.86, mods));
    gradient.addColorStop(1, rgbaAdjusted(132, 128, 110, 0.86, mods));
    return gradient;
  }

  if (substrateClass === "basin_moist_margin") {
    const edgeMods = {
      ...mods,
      glow: mods.glow + (mods.waterEdge * 0.6)
    };
    const gradient = ctx.createLinearGradient(340, 270, 760, 470);
    gradient.addColorStop(0, rgbaAdjusted(126, 150, 154, 0.62, edgeMods));
    gradient.addColorStop(1, rgbaAdjusted(94, 124, 132, 0.68, edgeMods));
    return gradient;
  }

  if (substrateClass === "basin_stone_edge") {
    const gradient = ctx.createLinearGradient(320, 250, 760, 500);
    gradient.addColorStop(0, rgbaAdjusted(146, 144, 146, 0.82, mods));
    gradient.addColorStop(1, rgbaAdjusted(120, 120, 124, 0.84, mods));
    return gradient;
  }

  if (substrateClass === "ridge_stone") {
    const gradient = ctx.createLinearGradient(220, 120, 580, 420);
    gradient.addColorStop(0, rgbaAdjusted(156, 150, 144, 0.86, mods));
    gradient.addColorStop(1, rgbaAdjusted(128, 124, 120, 0.86, mods));
    return gradient;
  }

  if (substrateClass === "summit_stone") {
    const gradient = ctx.createLinearGradient(380, 40, 620, 220);
    gradient.addColorStop(0, rgbaAdjusted(220, 216, 208, 0.92, mods));
    gradient.addColorStop(1, rgbaAdjusted(194, 190, 186, 0.92, mods));
    return gradient;
  }

  return rgbaAdjusted(140, 140, 140, 0.8, mods);
}

function waterStyle(waterClass, ctx, mods) {
  const edgeMods = {
    ...mods,
    glow: mods.glow + mods.waterEdge
  };

  if (waterClass === "harbor") {
    const gradient = ctx.createLinearGradient(180, 560, 1040, 940);
    gradient.addColorStop(0, rgbaAdjusted(94, 174, 226, 0.34, edgeMods));
    gradient.addColorStop(0.38, rgbaAdjusted(72, 148, 204, 0.42, edgeMods));
    gradient.addColorStop(0.72, rgbaAdjusted(54, 120, 176, 0.52, edgeMods));
    gradient.addColorStop(1, rgbaAdjusted(34, 92, 146, 0.62, edgeMods));
    return gradient;
  }

  if (waterClass === "basin") {
    const gradient = ctx.createLinearGradient(280, 270, 760, 470);
    gradient.addColorStop(0, rgbaAdjusted(154, 198, 216, 0.24, edgeMods));
    gradient.addColorStop(0.5, rgbaAdjusted(110, 164, 186, 0.34, edgeMods));
    gradient.addColorStop(1, rgbaAdjusted(72, 126, 150, 0.46, edgeMods));
    return gradient;
  }

  const gradient = ctx.createLinearGradient(120, 500, 1080, 1120);
  gradient.addColorStop(0, rgbaAdjusted(86, 160, 208, 0.22, edgeMods));
  gradient.addColorStop(1, rgbaAdjusted(38, 104, 156, 0.42, edgeMods));
  return gradient;
}

function drawOpenSeaAtmosphere(ctx, mods) {
  const gradient = ctx.createRadialGradient(680, 520, 80, 680, 520, 760);
  gradient.addColorStop(0, rgbaAdjusted(122, 214, 255, 0.12 + Math.max(0, mods.glow * 0.04), mods));
  gradient.addColorStop(0.38, rgbaAdjusted(82, 170, 224, 0.08 + Math.max(0, mods.glow * 0.03), mods));
  gradient.addColorStop(1, "rgba(18,62,108,0.00)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawHarborCoastGeometry(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  fillPolygon(ctx, coast.harborPeninsula, rgbaAdjusted(170, 162, 126, 0.18, mods));
  strokePolygon(ctx, coast.harborPeninsula, rgbaAdjusted(254, 244, 226, 0.14 + Math.max(0, mods.glow * 0.04), mods), 1.6);

  if (Array.isArray(coast.reefZones)) {
    for (const reefPolygon of coast.reefZones) {
      fillPolygon(ctx, reefPolygon, rgbaAdjusted(118, 170, 164, 0.10 + Math.max(0, mods.glow * 0.03), mods));
      strokePolygon(ctx, reefPolygon, rgbaAdjusted(214, 236, 232, 0.12 + Math.max(0, mods.glow * 0.04), mods), 1);
    }
  }

  if (Array.isArray(coast.firmnessZones)) {
    for (const zone of coast.firmnessZones) {
      fillPolygon(ctx, zone.polygon, rgbaAdjusted(220, 210, 176, 0.04 + Math.max(0, mods.wash * 0.05), mods));
    }
  }

  strokePolygon(ctx, coast.harborBasin, rgbaAdjusted(246, 250, 255, 0.22 + mods.waterEdge * 0.06, mods), 1.4);
  strokePolygon(ctx, coast.harborChannel, rgbaAdjusted(236, 246, 255, 0.14 + mods.waterEdge * 0.06, mods), 1.1);
}

function drawExposureZones(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.exposureZones)) return;

  for (const zone of coast.exposureZones) {
    fillPolygon(ctx, zone.polygon, rgbaAdjusted(90, 140, 180, 0.06 + mods.wash * 0.02, mods));
    strokePolygon(ctx, zone.polygon, rgbaAdjusted(150, 200, 240, 0.10 + Math.max(0, mods.glow * 0.03), mods), 1);
  }
}

function drawFirmnessZones(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast || !Array.isArray(coast.firmnessZones)) return;

  for (const zone of coast.firmnessZones) {
    fillPolygon(ctx, zone.polygon, rgbaAdjusted(226, 210, 160, 0.08 + mods.wash * 0.02, mods));
    strokePolygon(ctx, zone.polygon, rgbaAdjusted(255, 236, 182, 0.12 + Math.max(0, mods.glow * 0.02), mods), 1);
  }
}

function drawBasinDepthTint(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast?.harborBasin) return;

  polygon(ctx, coast.harborBasin);

  const gradient = ctx.createRadialGradient(590, 760, 16, 590, 760, 240);
  gradient.addColorStop(0, rgbaAdjusted(56, 114, 156, 0.26 + mods.waterEdge * 0.04, mods));
  gradient.addColorStop(0.42, rgbaAdjusted(44, 98, 140, 0.14 + mods.waterEdge * 0.03, mods));
  gradient.addColorStop(1, "rgba(28,72,116,0.02)");

  ctx.fillStyle = gradient;
  ctx.fill();
}

function getActiveTerrainRows(kernel) {
  return kernel?.terrainPolygonsById ? sortTerrainRows([...kernel.terrainPolygonsById.values()]) : [];
}

function getActiveSubstrateRows(kernel) {
  return kernel?.substratePolygonsById ? sortSubstrateRows([...kernel.substratePolygonsById.values()]) : [];
}

function getManualWaterRows(kernel) {
  return kernel?.watersById ? [...kernel.watersById.values()] : [];
}

function drawWaterRows(ctx, rows, mods) {
  for (const water of rows) {
    fillPolygon(ctx, water.polygon, waterStyle(water.waterClass, ctx, mods));
    strokePolygon(ctx, water.polygon, rgbaAdjusted(236, 248, 255, 0.16 + mods.waterEdge * 0.05, mods), 1.1);
  }
}

function drawWaterRipples(ctx, tick, mods, phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return;

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.05);
  const scale = phaseLabel === "SEVERE" ? 1.18 : phaseLabel === "UNSTABLE" ? 1.08 : phaseLabel === "CLEAR_WINDOW" ? 1.10 : 1;
  const alphaBoost = phaseLabel === "CLEAR_WINDOW" ? 0.02 : phaseLabel === "SEVERE" ? 0.015 : 0;

  const lanes = [
    { x: 280, y: 724, w: 200, h: 32, a: 0.08 + (pulse * 0.02) + alphaBoost },
    { x: 426, y: 754, w: 210, h: 36, a: 0.07 + (pulse * 0.02) + alphaBoost },
    { x: 600, y: 738, w: 180, h: 32, a: 0.08 + (pulse * 0.02) + alphaBoost },
    { x: 790, y: 714, w: 170, h: 30, a: 0.07 + (pulse * 0.02) + alphaBoost },
    { x: 808, y: 828, w: 160, h: 28, a: 0.05 + (pulse * 0.01) + alphaBoost },
    { x: 182, y: 842, w: 142, h: 26, a: 0.05 + (pulse * 0.01) + alphaBoost }
  ];

  ctx.save();
  for (const lane of lanes) {
    const gradient = ctx.createLinearGradient(lane.x, lane.y, lane.x + lane.w, lane.y + lane.h);
    gradient.addColorStop(0, rgbaAdjusted(236, 248, 255, lane.a * scale, mods));
    gradient.addColorStop(0.5, rgbaAdjusted(190, 228, 248, lane.a * 0.72 * scale, mods));
    gradient.addColorStop(1, "rgba(236,248,255,0.00)");
    ctx.fillStyle = gradient;
    roundRect(ctx, lane.x, lane.y, lane.w, lane.h, 18);
    ctx.fill();
  }
  ctx.restore();
}

function drawWetEdgeHighlights(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  strokePolygon(ctx, coast.harborPeninsula, rgbaAdjusted(255, 244, 212, 0.06 + mods.glow * 0.03, mods), 3.2);
  strokePolygon(ctx, coast.harborBasin, rgbaAdjusted(168, 214, 236, 0.10 + mods.waterEdge * 0.05, mods), 5);
  strokePolygon(ctx, coast.harborChannel, rgbaAdjusted(182, 224, 244, 0.08 + mods.waterEdge * 0.05, mods), 4);
}

function drawFoamBands(ctx, mods, phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return;

  const foamArcs = [
    { x: 372, y: 782, rx: 74, ry: 18, lw: 2.2, a: 0.22 },
    { x: 474, y: 804, rx: 92, ry: 24, lw: 2.4, a: 0.24 },
    { x: 614, y: 790, rx: 86, ry: 22, lw: 2.1, a: 0.22 },
    { x: 790, y: 708, rx: 66, ry: 18, lw: 1.8, a: 0.18 },
    { x: 882, y: 724, rx: 56, ry: 14, lw: 1.6, a: 0.16 }
  ];

  const multiplier = phaseLabel === "SEVERE" ? 1.18 : phaseLabel === "UNSTABLE" ? 1.08 : phaseLabel === "CLEAR_WINDOW" ? 0.94 : 1;

  ctx.save();
  for (const arc of foamArcs) {
    ctx.beginPath();
    ctx.ellipse(arc.x, arc.y, arc.rx, arc.ry, 0, Math.PI * 1.06, Math.PI * 1.94);
    ctx.strokeStyle = rgbaAdjusted(246, 252, 255, arc.a * multiplier, mods);
    ctx.lineWidth = arc.lw;
    ctx.stroke();
  }
  ctx.restore();
}

function drawTerrainRows(ctx, rows, mods) {
  for (const terrain of rows) {
    fillPolygon(ctx, terrain.polygon, terrainStyle(terrain.terrainClass, ctx, mods));
    strokePolygon(ctx, terrain.polygon, rgbaAdjusted(252, 246, 232, 0.06 + Math.max(0, mods.glow * 0.02), mods), 1);
  }
}

function drawSubstrateRows(ctx, rows, mods) {
  for (const substrate of rows) {
    fillPolygon(ctx, substrate.polygon, substrateStyle(substrate.substrateClass, ctx, mods));
    strokePolygon(ctx, substrate.polygon, rgbaAdjusted(255, 248, 236, 0.05 + Math.max(0, mods.glow * 0.02), mods), 0.9);
  }
}

function drawBeachReadBoost(ctx, substrateRows, terrainRows, mods) {
  for (const substrate of substrateRows) {
    if (
      substrate.substrateClass === "wet_sand" ||
      substrate.substrateClass === "dry_sand" ||
      substrate.substrateClass === "outer_beach_band"
    ) {
      strokePolygon(ctx, substrate.polygon, rgbaAdjusted(255, 244, 216, 0.12 + Math.max(0, mods.glow * 0.03), mods), 1.15);
    }

    if (substrate.substrateClass === "shallow_water_margin") {
      strokePolygon(ctx, substrate.polygon, rgbaAdjusted(214, 242, 255, 0.14 + mods.waterEdge * 0.04, mods), 1.25);
    }
  }

  for (const terrain of terrainRows) {
    if (terrain.terrainClass === "outer_beach_band" || terrain.terrainClass === "outer_shore_shoulder") {
      strokePolygon(ctx, terrain.polygon, rgbaAdjusted(248, 232, 196, 0.10 + Math.max(0, mods.glow * 0.03), mods), 1.1);
    }
  }
}

function drawTerrainGrain(ctx, mods, phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return;

  const grains = [
    [332, 788], [366, 802], [404, 826], [452, 836], [498, 846], [540, 836],
    [586, 822], [628, 804], [670, 792], [708, 776], [748, 754], [530, 308],
    [562, 326], [604, 340], [644, 354], [282, 250], [316, 274], [352, 298]
  ];

  const alpha = phaseLabel === "CLEAR_WINDOW" ? 0.08 : phaseLabel === "SEVERE" ? 0.12 : 0.10;

  ctx.save();
  for (const [x, y] of grains) {
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = rgbaAdjusted(110, 92, 66, alpha, mods);
    ctx.fill();
  }
  ctx.restore();
}

function getDockTransferIds(kernel, activeHarborInstanceId) {
  if (!activeHarborInstanceId) return new Set();
  const transfers = kernel?.helpers?.getHarborDockTransfers?.(activeHarborInstanceId) ?? [];
  return new Set(transfers.map((transfer) => transfer.dockId));
}

function drawSeaHazards(ctx, kernel, traversalMode, mods, phaseLabel) {
  const seaHazardsById = kernel?.maritimeNetwork?.seaHazardsById;
  if (!seaHazardsById) return;

  const phaseBoost = phaseLabel === "SEVERE" || phaseLabel === "LOCKDOWN"
    ? 0.06
    : phaseLabel === "UNSTABLE"
      ? 0.03
      : 0;

  for (const hazard of seaHazardsById.values()) {
    let fill = rgbaAdjusted(86, 132, 164, 0.04 + phaseBoost, mods);
    let stroke = rgbaAdjusted(140, 196, 224, 0.08 + phaseBoost, mods);

    if (hazard.hazardClass === "reef") {
      fill = traversalMode === "boat"
        ? rgbaAdjusted(126, 196, 176, 0.10 + phaseBoost, mods)
        : rgbaAdjusted(126, 196, 176, 0.05 + (phaseBoost * 0.5), mods);
      stroke = traversalMode === "boat"
        ? rgbaAdjusted(196, 244, 226, 0.16 + phaseBoost, mods)
        : rgbaAdjusted(196, 244, 226, 0.08 + (phaseBoost * 0.5), mods);
    }

    if (hazard.hazardClass === "current") {
      fill = traversalMode === "boat"
        ? rgbaAdjusted(110, 156, 220, 0.08 + phaseBoost, mods)
        : rgbaAdjusted(110, 156, 220, 0.04 + (phaseBoost * 0.5), mods);
      stroke = traversalMode === "boat"
        ? rgbaAdjusted(198, 226, 255, 0.14 + phaseBoost, mods)
        : rgbaAdjusted(198, 226, 255, 0.08 + (phaseBoost * 0.5), mods);
    }

    fillPolygon(ctx, hazard.polygon, fill);
    strokePolygon(ctx, hazard.polygon, stroke, 1);
  }
}

function drawHarborNavigationEdges(ctx, kernel, pulse, traversalMode, mods, phaseLabel) {
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationEdgesById) return;

  const pathGlow = mods.pathGlow + (phaseLabel === "CLEAR_WINDOW" ? 0.04 : 0);

  for (const edge of harborGraph.navigationEdgesById.values()) {
    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(4, (edge.nominalWidth || 20) * 0.16);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? rgbaAdjusted(160, 222, 248, 0.18 + (pulse * 0.10) + pathGlow, mods)
      : rgbaAdjusted(126, 196, 226, 0.08 + Math.max(0, pathGlow * 0.6), mods);
    ctx.stroke();

    polyline(ctx, edge.centerline);
    ctx.lineWidth = Math.max(1.25, (edge.nominalWidth || 20) * 0.04);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? rgbaAdjusted(236, 250, 255, 0.30 + (pulse * 0.14) + pathGlow, mods)
      : rgbaAdjusted(220, 246, 255, 0.12 + (pulse * 0.06) + Math.max(0, pathGlow * 0.5), mods);
    ctx.stroke();
  }
}

function drawSeaRoutes(ctx, kernel, pulse, traversalMode, mods, phaseLabel) {
  const seaRoutesById = kernel?.maritimeNetwork?.seaRoutesById;
  if (!seaRoutesById) return;

  const pathGlow = mods.pathGlow + (phaseLabel === "SEVERE" ? 0.03 : 0);

  for (const route of seaRoutesById.values()) {
    polyline(ctx, route.centerline);
    ctx.lineWidth = Math.max(5, (route.nominalWidth || 24) * 0.18);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? rgbaAdjusted(104, 186, 234, 0.22 + (pulse * 0.10) + pathGlow, mods)
      : rgbaAdjusted(88, 168, 214, 0.08 + Math.max(0, pathGlow * 0.5), mods);
    ctx.stroke();

    polyline(ctx, route.centerline);
    ctx.lineWidth = Math.max(1.5, (route.nominalWidth || 24) * 0.05);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = traversalMode === "boat"
      ? rgbaAdjusted(228, 248, 255, 0.34 + (pulse * 0.14) + pathGlow, mods)
      : rgbaAdjusted(214, 240, 255, 0.10 + (pulse * 0.05) + Math.max(0, pathGlow * 0.4), mods);
    ctx.stroke();
  }
}

function drawHarborNavigationNodes(ctx, runtime, mods, phaseLabel) {
  const { kernel, traversalMode, activeHarborInstanceId, selection, destination, tick } = runtime;
  const harborGraph = kernel?.harborNavigationGraph;
  if (!harborGraph?.navigationNodesById) return;

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);
  const dockTransferIds = getDockTransferIds(kernel, activeHarborInstanceId);
  const phaseGlow = phaseLabel === "CLEAR_WINDOW" ? 0.06 : phaseLabel === "SEVERE" ? 0.04 : 0;

  for (const node of harborGraph.navigationNodesById.values()) {
    const [x, y] = node.centerPoint;
    const isDockTransfer = dockTransferIds.has(node.navNodeId);
    const isSelectedDockTransfer = selection?.kind === "dock_transfer" && selection.dockId === node.navNodeId;
    const isSelectedNode = selection?.kind === "harbor_nav_node" && selection.navNodeId === node.navNodeId;
    const isDestinationDockTransfer = destination?.kind === "dock_transfer" && destination.dockId === node.navNodeId;
    const isDestinationNode = destination?.kind === "harbor_nav_node" && destination.navNodeId === node.navNodeId;
    const isHighlighted = isDockTransfer || isSelectedDockTransfer || isSelectedNode || isDestinationDockTransfer || isDestinationNode;

    let radius = 4;
    let fill = rgbaAdjusted(214, 240, 250, 0.36 + phaseGlow, mods);
    let stroke = rgbaAdjusted(255, 255, 255, 0.08 + phaseGlow, mods);

    if (node.nodeClass === "mooring") {
      radius = 6;
      fill = rgbaAdjusted(242, 224, 166, 0.72 + phaseGlow, mods);
      stroke = rgbaAdjusted(255, 246, 214, 0.26 + phaseGlow, mods);
    }

    if (node.nodeClass === "transfer") {
      radius = 7;
      fill = rgbaAdjusted(182, 234, 206, 0.74 + phaseGlow, mods);
      stroke = rgbaAdjusted(226, 255, 242, 0.28 + phaseGlow, mods);
    }

    if (isDockTransfer) {
      ctx.beginPath();
      ctx.arc(x, y, 14 + (pulse * 2), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? rgbaAdjusted(156, 246, 255, 0.40 + (pulse * 0.16) + phaseGlow, mods)
        : rgbaAdjusted(255, 236, 170, 0.34 + (pulse * 0.10) + phaseGlow, mods);
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 20 + (pulse * 2.5), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? rgbaAdjusted(156, 246, 255, 0.18 + (pulse * 0.08) + phaseGlow, mods)
        : rgbaAdjusted(255, 236, 170, 0.14 + (pulse * 0.06) + phaseGlow, mods);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 6 + (pulse * 1.5), 0, Math.PI * 2);
      ctx.strokeStyle = rgbaAdjusted(248, 250, 255, 0.24 + phaseGlow, mods);
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
        ? rgbaAdjusted(230, 252, 255, 0.58 + phaseGlow, mods)
        : rgbaAdjusted(255, 246, 214, 0.58 + phaseGlow, mods);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}

function drawSeaNodes(ctx, runtime, mods, phaseLabel) {
  const { kernel, traversalMode, selection, destination, tick } = runtime;
  const seaNodesById = kernel?.maritimeNetwork?.seaNodesById;
  if (!seaNodesById) return;

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);
  const phaseGlow = phaseLabel === "CLEAR_WINDOW" ? 0.06 : phaseLabel === "SEVERE" ? 0.03 : 0;

  for (const node of seaNodesById.values()) {
    const [x, y] = node.centerPoint;
    const isSelected = selection?.kind === "sea_node" && selection.seaNodeId === node.seaNodeId;
    const isDestination = destination?.kind === "sea_node" && destination.seaNodeId === node.seaNodeId;

    if (isSelected || isDestination) {
      ctx.beginPath();
      ctx.arc(x, y, 15 + (pulse * 2), 0, Math.PI * 2);
      ctx.strokeStyle = traversalMode === "boat"
        ? rgbaAdjusted(188, 240, 255, 0.40 + (pulse * 0.16) + phaseGlow, mods)
        : rgbaAdjusted(188, 240, 255, 0.12 + phaseGlow, mods);
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = traversalMode === "boat"
      ? rgbaAdjusted(174, 226, 255, 0.74 + phaseGlow, mods)
      : rgbaAdjusted(154, 204, 236, 0.34 + phaseGlow, mods);
    ctx.fill();
    ctx.strokeStyle = traversalMode === "boat"
      ? rgbaAdjusted(242, 250, 255, 0.24 + phaseGlow, mods)
      : rgbaAdjusted(242, 250, 255, 0.10 + phaseGlow, mods);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTraversalPaths(ctx, kernel, projection, destination, pulse, mods) {
  if (!kernel?.pathsById) return;

  const pathGlow = mods.pathGlow;

  for (const path of kernel.pathsById.values()) {
    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(6, (path.nominalWidth || 56) * 0.24);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgbaAdjusted(82, 72, 60, 0.28 + Math.max(0, mods.wash * 0.04), mods);
    ctx.stroke();

    polyline(ctx, path.centerline);
    ctx.lineWidth = Math.max(3, (path.nominalWidth || 56) * 0.11);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgbaAdjusted(222, 198, 146, 0.22 + Math.max(0, pathGlow * 0.4), mods);
    ctx.stroke();

    const isDestinationPath = destination && projection && destination.kind === "region"
      && path.fromRegionId === projection.regionId
      && path.toRegionId === destination.regionId;

    if (isDestinationPath) {
      polyline(ctx, path.centerline);
      ctx.lineWidth = Math.max(4, (path.nominalWidth || 56) * 0.1);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = rgbaAdjusted(255, 240, 188, 0.16 + (pulse * 0.18) + pathGlow, mods);
      ctx.stroke();
    }
  }
}

function drawHarborChartAccents(ctx, kernel, mods) {
  const coast = kernel?.coastlineModel;
  if (!coast) return;

  if (Array.isArray(coast.coastlineOuter) && coast.coastlineOuter.length) {
    strokePolygon(ctx, coast.coastlineOuter, rgbaAdjusted(255, 255, 255, 0.04 + Math.max(0, mods.glow * 0.02), mods), 4);
  }

  strokePolygon(ctx, coast.harborPeninsula, rgbaAdjusted(255, 248, 214, 0.08 + Math.max(0, mods.glow * 0.03), mods), 2.4);

  if (kernel?.regionBoundariesById) {
    const west = kernel.regionBoundariesById.get("harbor_inner_shore_west");
    const east = kernel.regionBoundariesById.get("harbor_inner_shore_east");
    if (west) strokePolygon(ctx, west.polygon, rgbaAdjusted(255, 244, 214, 0.10 + Math.max(0, mods.glow * 0.02), mods), 1.2);
    if (east) strokePolygon(ctx, east.polygon, rgbaAdjusted(255, 244, 214, 0.10 + Math.max(0, mods.glow * 0.02), mods), 1.2);
  }
}

function drawStructureShadows(ctx, kernel, mods, phaseLabel) {
  if (!kernel?.regionsById) return;

  const alphaScale = phaseLabel === "CLEAR_WINDOW" ? 0.80 : phaseLabel === "LOCKDOWN" ? 1.15 : 1.0;

  for (const region of kernel.regionsById.values()) {
    const [x, y] = region.centerPoint;

    if (region.regionId === "harbor_village") {
      ctx.fillStyle = rgbaAdjusted(22, 34, 48, 0.16 * alphaScale, mods);
      ctx.fillRect(x - 26, y + 20, 78, 12);
      ctx.fillRect(x - 2, y + 8, 24, 20);
    }

    if (region.regionId === "market_district") {
      ctx.fillStyle = rgbaAdjusted(22, 34, 48, 0.14 * alphaScale, mods);
      ctx.fillRect(x - 18, y + 14, 54, 10);
    }

    if (region.regionId === "summit_plaza") {
      ctx.beginPath();
      ctx.ellipse(x + 6, y + 14, 24, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgbaAdjusted(22, 34, 48, 0.12 * alphaScale, mods);
      ctx.fill();
    }
  }
}

function drawHarborProps(ctx, mods, phaseLabel) {
  if (phaseLabel === "LOCKDOWN") {
    ctx.save();
    ctx.globalAlpha = 0.78;
  }

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
      ctx.strokeStyle = rgbaAdjusted(92, 66, 46, 0.82, mods);
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(prop.x, prop.y - prop.h, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = rgbaAdjusted(182, 146, 96, 0.78, mods);
      ctx.fill();
    }

    if (prop.kind === "crate") {
      ctx.fillStyle = rgbaAdjusted(148, 112, 78, 0.88, mods);
      ctx.fillRect(prop.x, prop.y, prop.w, prop.h);
      ctx.strokeStyle = rgbaAdjusted(244, 226, 188, 0.12 + Math.max(0, mods.glow * 0.02), mods);
      ctx.lineWidth = 1;
      ctx.strokeRect(prop.x, prop.y, prop.w, prop.h);
    }

    if (prop.kind === "boat") {
      ctx.save();
      ctx.translate(prop.x, prop.y);
      ctx.rotate(prop.a);
      ctx.beginPath();
      ctx.ellipse(0, 0, prop.w * 0.5, prop.h * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgbaAdjusted(88, 58, 42, 0.80, mods);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1, prop.w * 0.34, prop.h * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgbaAdjusted(196, 170, 126, 0.56, mods);
      ctx.fill();
      ctx.restore();
    }

    if (prop.kind === "lantern") {
      ctx.beginPath();
      ctx.moveTo(prop.x, prop.y - prop.h);
      ctx.lineTo(prop.x, prop.y);
      ctx.strokeStyle = rgbaAdjusted(106, 84, 60, 0.82, mods);
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(prop.x, prop.y - prop.h, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = rgbaAdjusted(255, 220, 146, 0.68 + Math.max(0, mods.glow * 0.04), mods);
      ctx.fill();

      const glow = ctx.createRadialGradient(prop.x, prop.y - prop.h, 1, prop.x, prop.y - prop.h, 18);
      glow.addColorStop(0, rgbaAdjusted(255, 224, 162, 0.18 + Math.max(0, mods.glow * 0.05), mods));
      glow.addColorStop(1, "rgba(255,224,162,0.00)");
      ctx.fillStyle = glow;
      ctx.fillRect(prop.x - 18, prop.y - prop.h - 18, 36, 36);
    }
  }

  ctx.restore();

  if (phaseLabel === "LOCKDOWN") {
    ctx.restore();
  }
}

function drawRegionBoundaries(ctx, kernel, mods) {
  if (!kernel?.regionBoundariesById) return;

  for (const boundary of kernel.regionBoundariesById.values()) {
    if (boundary.parentRegion !== "harbor") continue;
    strokePolygon(ctx, boundary.polygon, rgbaAdjusted(246, 240, 226, 0.08 + Math.max(0, mods.glow * 0.02), mods), 1);
  }
}

function drawRegionPads(ctx, kernel, mods) {
  if (!kernel?.regionsById) return;

  for (const region of kernel.regionsById.values()) {
    const [x, y] = region.centerPoint;
    let rx = 44;
    let ry = 22;
    let fill = rgbaAdjusted(122, 136, 112, 0.10, mods);

    if (region.regionId === "harbor_village") {
      rx = 66;
      ry = 26;
      fill = rgbaAdjusted(120, 170, 196, 0.12, mods);
      ctx.fillStyle = rgbaAdjusted(150, 108, 82, 0.96, mods);
      ctx.fillRect(x - 36, y + 9, 72, 13);
      ctx.fillRect(x - 10, y - 2, 20, 18);
      ctx.strokeStyle = rgbaAdjusted(255, 240, 220, 0.08 + Math.max(0, mods.glow * 0.02), mods);
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 36, y + 9, 72, 13);
      ctx.strokeRect(x - 10, y - 2, 20, 18);
    }

    if (region.regionId === "market_district") {
      rx = 58;
      ry = 24;
      fill = rgbaAdjusted(176, 146, 102, 0.14, mods);
      ctx.fillStyle = rgbaAdjusted(172, 124, 84, 0.92, mods);
      ctx.fillRect(x - 24, y + 4, 48, 12);
    }

    if (region.regionId === "exploration_basin") {
      rx = 76;
      ry = 30;
      fill = rgbaAdjusted(112, 128, 112, 0.06, mods);
    }

    if (region.regionId === "summit_approach") {
      rx = 56;
      ry = 24;
      fill = rgbaAdjusted(198, 194, 184, 0.08, mods);
    }

    if (region.regionId === "summit_plaza") {
      rx = 40;
      ry = 18;
      fill = rgbaAdjusted(210, 206, 198, 0.12, mods);
    }

    ctx.beginPath();
    ctx.ellipse(x, y + 6, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

function drawAtmosphericVeil(ctx, mods, phaseLabel) {
  const gradient = ctx.createLinearGradient(0, 0, 1180, 1240);

  if (phaseLabel === "CLEAR_WINDOW") {
    gradient.addColorStop(0, rgbaAdjusted(255, 255, 255, 0.02, mods));
    gradient.addColorStop(0.45, rgbaAdjusted(196, 228, 250, 0.01, mods));
    gradient.addColorStop(1, rgbaAdjusted(18, 32, 52, 0.03, mods));
  } else if (phaseLabel === "LOCKDOWN") {
    gradient.addColorStop(0, rgbaAdjusted(255, 255, 255, 0.08, mods));
    gradient.addColorStop(0.45, rgbaAdjusted(180, 220, 244, 0.05, mods));
    gradient.addColorStop(1, rgbaAdjusted(18, 32, 52, 0.10, mods));
  } else {
    gradient.addColorStop(0, rgbaAdjusted(255, 255, 255, 0.04, mods));
    gradient.addColorStop(0.45, rgbaAdjusted(180, 220, 244, 0.02, mods));
    gradient.addColorStop(1, rgbaAdjusted(18, 32, 52, 0.06, mods));
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawPhaseGroundOverlay(ctx, phaseLabel, intensity) {
  if (phaseLabel === "CLEAR_WINDOW") {
    const gradient = ctx.createRadialGradient(620, 420, 80, 620, 420, 720);
    gradient.addColorStop(0, `rgba(255,248,228,${0.035 + (intensity * 0.04)})`);
    gradient.addColorStop(0.45, `rgba(218,238,255,${0.015 + (intensity * 0.02)})`);
    gradient.addColorStop(1, "rgba(218,238,255,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1180, 1240);
    return;
  }

  if (phaseLabel === "UNSTABLE" || phaseLabel === "SEVERE" || phaseLabel === "LOCKDOWN") {
    const alpha = phaseLabel === "LOCKDOWN"
      ? 0.08 + (intensity * 0.06)
      : phaseLabel === "SEVERE"
        ? 0.05 + (intensity * 0.04)
        : 0.03 + (intensity * 0.03);

    const gradient = ctx.createLinearGradient(0, 0, 1180, 1240);
    gradient.addColorStop(0, `rgba(188,214,255,${alpha})`);
    gradient.addColorStop(0.46, `rgba(110,144,196,${alpha * 0.56})`);
    gradient.addColorStop(1, "rgba(40,66,102,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1180, 1240);
  }
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

    const phaseLabel = getPhaseLabel(runtime);
    const phaseIntensity = getPhaseIntensity(runtime);
    const mods = getGroundPhaseModifiers(phaseLabel, phaseIntensity);
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.08);

    const activeTerrainRows = getActiveTerrainRows(kernel);
    const activeSubstrateRows = getActiveSubstrateRows(kernel);
    const manualWaterRows = getManualWaterRows(kernel);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawOpenSeaAtmosphere(ctx, mods);
    drawSeaHazards(ctx, kernel, traversalMode, mods, phaseLabel);
    drawHarborCoastGeometry(ctx, kernel, mods);
    drawExposureZones(ctx, kernel, mods);
    drawFirmnessZones(ctx, kernel, mods);
    drawBasinDepthTint(ctx, kernel, mods);
    drawWaterRows(ctx, manualWaterRows, mods);
    drawWaterRipples(ctx, tick, mods, phaseLabel);
    drawSeaRoutes(ctx, kernel, pulse, traversalMode, mods, phaseLabel);
    drawWetEdgeHighlights(ctx, kernel, mods);
    drawFoamBands(ctx, mods, phaseLabel);

    drawTerrainRows(ctx, activeTerrainRows, mods);
    drawSubstrateRows(ctx, activeSubstrateRows, mods);
    drawBeachReadBoost(ctx, activeSubstrateRows, activeTerrainRows, mods);

    drawTerrainGrain(ctx, mods, phaseLabel);
    drawStructureShadows(ctx, kernel, mods, phaseLabel);
    drawRegionBoundaries(ctx, kernel, mods);
    drawHarborChartAccents(ctx, kernel, mods);
    drawHarborNavigationEdges(ctx, kernel, pulse, traversalMode, mods, phaseLabel);
    drawSeaNodes(ctx, {
      ...runtime,
      kernel,
      tick,
      traversalMode,
      activeHarborInstanceId
    }, mods, phaseLabel);
    drawHarborNavigationNodes(ctx, {
      ...runtime,
      kernel,
      tick,
      traversalMode,
      activeHarborInstanceId
    }, mods, phaseLabel);
    drawHarborProps(ctx, mods, phaseLabel);
    drawTraversalPaths(ctx, kernel, projection, destination, pulse, mods);
    drawRegionPads(ctx, kernel, mods);
    drawPhaseGroundOverlay(ctx, phaseLabel, phaseIntensity);
    drawAtmosphericVeil(ctx, mods, phaseLabel);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
