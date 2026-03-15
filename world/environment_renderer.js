import { WORLD_KERNEL } from "./world_kernel.js";
import { createOceanDepthEngine } from "./environment/ocean/depth_engine.js";
import { createOceanCurrentEngine } from "./environment/ocean/current_engine.js";
import { createOceanSeaLifeEngine } from "./environment/ocean/sea_life_engine.js";
import { createOceanBoatingLifeEngine } from "./environment/ocean/boating_life_engine.js";

function getCanvasMetrics(ctx) {
  return Object.freeze({
    width: ctx.canvas.width,
    height: ctx.canvas.height
  });
}

function getRenderState(runtime) {
  const resolvedState = runtime?.resolvedState ?? {};
  const localSelection = resolvedState.localSelection ?? {};
  const timing = runtime?.timing ?? {};
  const projection = runtime?.projection ?? {};
  const activeDepth = resolvedState.activeDepth ?? "harbor";

  return Object.freeze({
    time: timing.elapsedMs ?? 0,
    activeDepth,
    gridBound: resolvedState.gridBound === true,
    localSelection: Object.freeze({
      zone: localSelection.zone ?? "—",
      row: Number.isInteger(localSelection.row) ? localSelection.row : 0,
      col: Number.isInteger(localSelection.col) ? localSelection.col : 0,
      cellIndex: Number.isInteger(localSelection.cellIndex) ? localSelection.cellIndex : 0,
      cellId: localSelection.cellId ?? projection.cellId ?? "R0C0"
    }),
    projection: Object.freeze({
      row: Number.isInteger(projection.row) ? projection.row : 0,
      col: Number.isInteger(projection.col) ? projection.col : 0,
      cellIndex: Number.isInteger(projection.cellIndex) ? projection.cellIndex : 0,
      cellId: projection.cellId ?? "R0C0"
    })
  });
}

function createEnvironmentAudit(runtime, renderState) {
  return Object.freeze({
    activeDepth: renderState.activeDepth,
    gridBound: renderState.gridBound,
    zone: renderState.localSelection.zone,
    cellId: renderState.localSelection.cellId,
    branch: runtime?.resolvedState?.auditLabels?.branch ?? "external.harbor",
    exclusions: Object.freeze({
      npc: WORLD_KERNEL.scope.includeNPCs === false,
      events: WORLD_KERNEL.scope.includeEvents === false
    })
  });
}

function drawCosmicField(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#020611");
  gradient.addColorStop(0.22, "#06101f");
  gradient.addColorStop(0.58, "#040813");
  gradient.addColorStop(1, "#010309");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNebulaBands(ctx, width, height, time) {
  ctx.save();

  const bands = [
    { x: 0.18, y: 0.16, rx: 0.34, ry: 0.12, rot: -0.38, c0: "rgba(74,124,255,0.20)", c1: "rgba(36,60,145,0)" },
    { x: 0.72, y: 0.14, rx: 0.28, ry: 0.10, rot: 0.14, c0: "rgba(118,96,255,0.16)", c1: "rgba(58,38,145,0)" },
    { x: 0.60, y: 0.34, rx: 0.24, ry: 0.08, rot: -0.08, c0: "rgba(78,140,255,0.10)", c1: "rgba(28,72,155,0)" }
  ];

  bands.forEach((band, index) => {
    const wobbleX = Math.sin(time * 0.00012 + index * 1.31) * width * 0.018;
    const wobbleY = Math.cos(time * 0.00010 + index * 1.07) * height * 0.014;
    const cx = width * band.x + wobbleX;
    const cy = height * band.y + wobbleY;
    const rx = width * band.rx;
    const ry = height * band.ry;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    gradient.addColorStop(0, band.c0);
    gradient.addColorStop(0.48, "rgba(70,105,255,0.06)");
    gradient.addColorStop(1, band.c1);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, band.rot, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawStars(ctx, width, height, time) {
  const count = 180;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 51.3) * 0.5 + 0.5) * height;
    const twinkle = 0.28 + 0.72 * Math.sin(time * 0.001 + i * 0.73);
    const size = i % 19 === 0 ? 2.6 : i % 7 === 0 ? 2.0 : 1.45;

    ctx.globalAlpha = twinkle * (i % 19 === 0 ? 0.98 : 0.8);
    ctx.fillStyle = i % 13 === 0 ? "rgba(235,242,255,0.98)" : "#dfe8ff";
    ctx.fillRect(x, y, size, size);
  }

  ctx.globalAlpha = 1;
}

function drawStarStreaks(ctx, width, height, time) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "rgba(215,230,255,0.45)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 6; i += 1) {
    const x = ((i + 1) / 7) * width + Math.sin(time * 0.00016 + i) * 14;
    const y = (0.10 + (i % 3) * 0.12) * height + Math.cos(time * 0.00011 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 2.5);
    ctx.lineTo(x + 7, y - 2.5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDeepSpaceOrbits(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.strokeStyle = "rgba(120, 165, 255, 0.07)";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1.18 + i * 0.13), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createRadialGradient(
    centerX + radius * 0.24,
    centerY + radius * 0.18,
    radius * 0.06,
    centerX + radius * 0.22,
    centerY + radius * 0.18,
    radius * 1.06
  );

  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.44, "rgba(0,0,0,0.04)");
  gradient.addColorStop(0.70, "rgba(0,0,0,0.15)");
  gradient.addColorStop(1, "rgba(0,0,0,0.30)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.03, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawPlanetOuterGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.96,
    centerX,
    centerY,
    radius * 1.30
  );

  gradient.addColorStop(0, "rgba(110,180,255,0)");
  gradient.addColorStop(0.58, "rgba(84,146,255,0.03)");
  gradient.addColorStop(0.80, "rgba(72,125,255,0.10)");
  gradient.addColorStop(1, "rgba(44,92,210,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.30, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawAtmosphereShell(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;
  const thickness = radius * WORLD_KERNEL.constants.atmosphereThicknessFactor;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY - radius * 0.06,
    radius * 0.98,
    centerX,
    centerY - radius * 0.08,
    radius + thickness * 2.7
  );

  gradient.addColorStop(0, "rgba(75,145,255,0)");
  gradient.addColorStop(0.72, "rgba(84,168,255,0.03)");
  gradient.addColorStop(0.84, "rgba(112,216,255,0.22)");
  gradient.addColorStop(0.92, "rgba(160,235,255,0.22)");
  gradient.addColorStop(1, "rgba(75,145,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + thickness * 2.7, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawUpperAtmosphereAccent(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.16;
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY - radius * 0.44,
    radius * 0.04,
    centerX,
    centerY - radius * 0.44,
    radius * 0.42
  );
  gradient.addColorStop(0, "rgba(205,240,255,0.36)");
  gradient.addColorStop(0.55, "rgba(120,220,255,0.10)");
  gradient.addColorStop(1, "rgba(120,220,255,0)");

  ctx.beginPath();
  ctx.ellipse(centerX, centerY - radius * 0.46, radius * 0.42, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawLatitudeBands(ctx, projector) {
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;

  for (let latDeg = -60; latDeg <= 60; latDeg += 20) {
    let first = true;
    ctx.beginPath();

    for (let lonDeg = 0; lonDeg <= 360; lonDeg += 8) {
      const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);

      if (!point.visible) {
        first = true;
        continue;
      }

      if (first) {
        ctx.moveTo(point.x, point.y);
        first = false;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.stroke();
  }
}

function drawLongitudeBands(ctx, projector) {
  ctx.strokeStyle = "rgba(190,220,255,0.03)";
  ctx.lineWidth = 1;

  for (let lonDeg = 0; lonDeg < 360; lonDeg += 20) {
    let first = true;
    ctx.beginPath();

    for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
      const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);

      if (!point.visible) {
        first = true;
        continue;
      }

      if (first) {
        ctx.moveTo(point.x, point.y);
        first = false;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.stroke();
  }
}

function createLeafContour() {
  return Object.freeze([
    { x: -1.00, y: -0.05 },
    { x: -0.84, y: -0.34 },
    { x: -0.58, y: -0.56 },
    { x: -0.24, y: -0.68 },
    { x: 0.10, y: -0.62 },
    { x: 0.42, y: -0.44 },
    { x: 0.70, y: -0.16 },
    { x: 0.86, y: 0.16 },
    { x: 0.82, y: 0.42 },
    { x: 0.60, y: 0.66 },
    { x: 0.26, y: 0.82 },
    { x: -0.14, y: 0.84 },
    { x: -0.46, y: 0.68 },
    { x: -0.72, y: 0.42 },
    { x: -0.90, y: 0.12 }
  ]);
}

function createHookContour() {
  return Object.freeze([
    { x: -0.96, y: -0.18 },
    { x: -0.74, y: -0.50 },
    { x: -0.38, y: -0.72 },
    { x: 0.02, y: -0.74 },
    { x: 0.34, y: -0.54 },
    { x: 0.56, y: -0.18 },
    { x: 0.60, y: 0.10 },
    { x: 0.46, y: 0.40 },
    { x: 0.14, y: 0.66 },
    { x: -0.20, y: 0.78 },
    { x: -0.42, y: 0.70 },
    { x: -0.18, y: 0.44 },
    { x: 0.04, y: 0.20 },
    { x: 0.02, y: -0.02 },
    { x: -0.20, y: 0.04 },
    { x: -0.48, y: 0.18 },
    { x: -0.76, y: 0.08 }
  ]);
}

function createShardContour() {
  return Object.freeze([
    { x: -0.90, y: -0.10 },
    { x: -0.66, y: -0.44 },
    { x: -0.28, y: -0.70 },
    { x: 0.10, y: -0.64 },
    { x: 0.36, y: -0.30 },
    { x: 0.42, y: 0.08 },
    { x: 0.24, y: 0.44 },
    { x: -0.08, y: 0.72 },
    { x: -0.42, y: 0.80 },
    { x: -0.68, y: 0.56 },
    { x: -0.84, y: 0.24 }
  ]);
}

function createPebbleContour() {
  return Object.freeze([
    { x: -0.82, y: -0.06 },
    { x: -0.62, y: -0.42 },
    { x: -0.24, y: -0.66 },
    { x: 0.18, y: -0.64 },
    { x: 0.54, y: -0.40 },
    { x: 0.76, y: -0.04 },
    { x: 0.72, y: 0.28 },
    { x: 0.46, y: 0.58 },
    { x: 0.08, y: 0.76 },
    { x: -0.30, y: 0.72 },
    { x: -0.62, y: 0.48 },
    { x: -0.80, y: 0.16 }
  ]);
}

const LANDMASS_REGISTRY = Object.freeze([
  Object.freeze({
    id: "northwest_crown",
    anchorLon: -0.88,
    anchorLat: 0.52,
    lonScale: 0.30,
    latScale: 0.19,
    fill: "#b9ef79",
    edge: "#f5ffd8",
    highlight: "rgba(255,255,255,0.10)",
    contour: createLeafContour()
  }),
  Object.freeze({
    id: "eastern_main",
    anchorLon: 1.05,
    anchorLat: 0.04,
    lonScale: 0.38,
    latScale: 0.22,
    fill: "#c7f178",
    edge: "#fbffda",
    highlight: "rgba(255,255,255,0.10)",
    contour: createHookContour()
  }),
  Object.freeze({
    id: "southwest_shard",
    anchorLon: -2.08,
    anchorLat: -0.18,
    lonScale: 0.18,
    latScale: 0.15,
    fill: "#88e27c",
    edge: "#ecffd7",
    highlight: "rgba(255,255,255,0.08)",
    contour: createShardContour()
  }),
  Object.freeze({
    id: "northeast_isle",
    anchorLon: 2.42,
    anchorLat: 0.62,
    lonScale: 0.15,
    latScale: 0.10,
    fill: "#d3f37f",
    edge: "#fbffe2",
    highlight: "rgba(255,255,255,0.09)",
    contour: createPebbleContour()
  }),
  Object.freeze({
    id: "southern_isle",
    anchorLon: 0.14,
    anchorLat: -0.58,
    lonScale: 0.10,
    latScale: 0.08,
    fill: "#aeea82",
    edge: "#f3ffdf",
    highlight: "rgba(255,255,255,0.08)",
    contour: createPebbleContour()
  })
]);

function projectLandmassPoint(projector, landmass, point) {
  const lon = landmass.anchorLon + point.x * landmass.lonScale;
  const lat = landmass.anchorLat + point.y * landmass.latScale;
  const projected = projector.projectSphere(lon, lat);

  return Object.freeze({
    lon,
    lat,
    x: projected.x,
    y: projected.y,
    z: projected.z,
    visible: projected.visible
  });
}

function buildProjectedLandmass(projector, landmass) {
  const projectedPoints = landmass.contour.map((point) => projectLandmassPoint(projector, landmass, point));
  const visiblePoints = projectedPoints.filter((point) => point.visible);

  return Object.freeze({
    landmass,
    projectedPoints,
    visiblePoints,
    visibleRatio: projectedPoints.length ? visiblePoints.length / projectedPoints.length : 0
  });
}

function drawProjectedLandmass(ctx, projectedLandmass) {
  const { landmass, visiblePoints, visibleRatio } = projectedLandmass;
  if (visiblePoints.length < 4) return;
  if (visibleRatio < 0.45) return;

  ctx.beginPath();
  ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);

  for (let i = 1; i < visiblePoints.length; i += 1) {
    ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
  }

  ctx.closePath();
  ctx.fillStyle = landmass.fill;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = landmass.edge;
  ctx.lineWidth = 1.05;
  ctx.stroke();
  ctx.restore();

  const minX = Math.min(...visiblePoints.map((p) => p.x));
  const minY = Math.min(...visiblePoints.map((p) => p.y));
  const maxX = Math.max(...visiblePoints.map((p) => p.x));
  const maxY = Math.max(...visiblePoints.map((p) => p.y));

  const gradient = ctx.createLinearGradient(minX, minY, maxX, maxY);
  gradient.addColorStop(0, landmass.highlight);
  gradient.addColorStop(0.55, "rgba(255,255,255,0.00)");
  gradient.addColorStop(1, "rgba(0,0,0,0.04)");

  ctx.beginPath();
  ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);

  for (let i = 1; i < visiblePoints.length; i += 1) {
    ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
  }

  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawContinents(ctx, projector) {
  LANDMASS_REGISTRY.forEach((landmass) => {
    const projectedLandmass = buildProjectedLandmass(projector, landmass);
    drawProjectedLandmass(ctx, projectedLandmass);
  });
}

function drawPolarGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "rgba(220,245,255,0.58)";

  ctx.beginPath();
  ctx.ellipse(centerX, centerY - radius * 0.72, radius * 0.28, radius * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCloudArcs(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.16;

  for (let i = 0; i < 4; i += 1) {
    const arcRadius = radius * (0.44 + i * 0.08);
    const start = 0.14 * Math.PI + Math.sin(time * 0.0007 + i * 0.8) * 0.05;
    const end = 0.70 * Math.PI + Math.cos(time * 0.00055 + i * 0.6) * 0.04;

    ctx.beginPath();
    ctx.arc(centerX, centerY - radius * 0.22, arcRadius, start, end);
    ctx.strokeStyle = "rgba(225,238,255,0.84)";
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCloudSoftMasses(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const bodies = [
    { x: -0.10, y: -0.22, rx: 0.22, ry: 0.06, rot: -0.10 },
    { x: 0.12, y: -0.08, rx: 0.28, ry: 0.07, rot: 0.04 },
    { x: 0.04, y: 0.08, rx: 0.18, ry: 0.055, rot: -0.06 }
  ];

  ctx.save();
  ctx.globalAlpha = 0.07;

  bodies.forEach((body, index) => {
    const wobbleX = Math.sin(time * 0.00018 + index) * radius * 0.018;
    const wobbleY = Math.cos(time * 0.00015 + index) * radius * 0.010;
    ctx.beginPath();
    ctx.ellipse(
      centerX + radius * body.x + wobbleX,
      centerY + radius * body.y + wobbleY,
      radius * body.rx,
      radius * body.ry,
      body.rot,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(240,248,255,0.72)";
    ctx.fill();
  });

  ctx.restore();
}

function drawAtmosphericSheen(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.30,
    centerY - radius * 0.26,
    radius * 0.03,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.08)");
  gradient.addColorStop(0.14, "rgba(255,255,255,0.04)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawTerminatorGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.18;
  const gradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius * 0.14,
    centerX + radius,
    centerY + radius * 0.12
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.30, "rgba(0,0,0,0.14)");
  gradient.addColorStop(0.42, "rgba(150,225,255,0.14)");
  gradient.addColorStop(0.54, "rgba(255,255,255,0.025)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.996, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawSurfaceCellHighlight(ctx, projector, renderState) {
  if (!renderState.gridBound) return;

  const { centerX, centerY, radius } = projector.state;
  const row = renderState.localSelection.row;
  const col = renderState.localSelection.col;
  const cellWidth = (radius * 1.08) / 4;
  const cellHeight = (radius * 1.08) / 4;
  const x = centerX - radius * 0.54 + col * cellWidth;
  const y = centerY - radius * 0.54 + row * cellHeight;

  ctx.save();
  ctx.fillStyle = "rgba(121,169,255,0.05)";
  ctx.strokeStyle = "rgba(121,169,255,0.18)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.rect(x, y, cellWidth, cellHeight);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlanetOutline(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1.35;
  ctx.stroke();
}

export function createEnvironmentRenderer() {
  const depthEngine = createOceanDepthEngine();
  const currentEngine = createOceanCurrentEngine();
  const seaLifeEngine = createOceanSeaLifeEngine();
  const boatingLifeEngine = createOceanBoatingLifeEngine();

  const families = Object.freeze({
    space: Object.freeze({
      cosmic: true,
      stellar: true,
      orbital: true,
      deep_space: true
    }),
    atmosphere: Object.freeze({
      climate: true,
      weather: true,
      aerial: true,
      optics: true
    }),
    land: Object.freeze({
      continents: true,
      regions: true,
      topography: true,
      geography: true
    }),
    water: Object.freeze({
      oceans: true,
      currents: true,
      depth: true,
      sea_life: true,
      boating_life: true
    })
  });

  function render(ctx, projector, runtime) {
    const renderState = getRenderState(runtime);
    const audit = createEnvironmentAudit(runtime, renderState);
    const { width, height } = getCanvasMetrics(ctx);

    ctx.clearRect(0, 0, width, height);

    drawCosmicField(ctx, width, height);
    drawNebulaBands(ctx, width, height, renderState.time);
    drawStars(ctx, width, height, renderState.time);
    drawStarStreaks(ctx, width, height, renderState.time);
    drawDeepSpaceOrbits(ctx, projector);

    drawPlanetShadow(ctx, projector);
    drawPlanetOuterGlow(ctx, projector);
    drawAtmosphereShell(ctx, projector);
    drawUpperAtmosphereAccent(ctx, projector);

    depthEngine.render(ctx, projector, runtime, renderState);

    ctx.save();
    ctx.beginPath();
    ctx.arc(projector.state.centerX, projector.state.centerY, projector.state.radius, 0, Math.PI * 2);
    ctx.clip();

    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
    drawContinents(ctx, projector);
    drawPolarGlow(ctx, projector);
    drawCloudArcs(ctx, projector, renderState.time);
    drawCloudSoftMasses(ctx, projector, renderState.time);
    drawAtmosphericSheen(ctx, projector);
    drawTerminatorGlow(ctx, projector);

    currentEngine.render(ctx, projector, runtime, renderState);
    seaLifeEngine.render(ctx, projector, runtime, renderState);
    boatingLifeEngine.render(ctx, projector, runtime, renderState);

    drawSurfaceCellHighlight(ctx, projector, renderState);

    ctx.restore();

    drawPlanetOutline(ctx, projector);

    return Object.freeze({
      families,
      audit
    });
  }

  return Object.freeze({
    families,
    render
  });
}
