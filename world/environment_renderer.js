import { WORLD_KERNEL } from "./world_kernel.js";

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
  gradient.addColorStop(0.24, "#050c1b");
  gradient.addColorStop(0.58, "#040813");
  gradient.addColorStop(1, "#010309");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNebulaBands(ctx, width, height, time) {
  ctx.save();

  const bands = [
    { x: 0.14, y: 0.20, rx: 0.30, ry: 0.11, rot: -0.42, c0: "rgba(64,114,255,0.18)", c1: "rgba(36,60,145,0)" },
    { x: 0.77, y: 0.16, rx: 0.22, ry: 0.085, rot: 0.18, c0: "rgba(104,82,255,0.14)", c1: "rgba(58,38,145,0)" },
    { x: 0.74, y: 0.78, rx: 0.34, ry: 0.12, rot: 0.28, c0: "rgba(58,126,255,0.14)", c1: "rgba(28,72,155,0)" },
    { x: 0.24, y: 0.72, rx: 0.24, ry: 0.09, rot: -0.14, c0: "rgba(120,78,220,0.12)", c1: "rgba(64,32,122,0)" }
  ];

  bands.forEach((band, index) => {
    const wobbleX = Math.sin(time * 0.00012 + index * 1.31) * width * 0.018;
    const wobbleY = Math.cos(time * 0.0001 + index * 1.07) * height * 0.016;
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

  for (let i = 0; i < 7; i += 1) {
    const x = ((i + 1) / 8) * width + Math.sin(time * 0.00016 + i) * 14;
    const y = ((i % 4) / 4 + 0.12) * height + Math.cos(time * 0.00011 + i) * 10;
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
  ctx.strokeStyle = "rgba(120, 165, 255, 0.075)";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1.18 + i * 0.125), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createRadialGradient(
    centerX + radius * 0.26,
    centerY + radius * 0.20,
    radius * 0.06,
    centerX + radius * 0.22,
    centerY + radius * 0.18,
    radius * 1.08
  );

  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.46, "rgba(0,0,0,0.04)");
  gradient.addColorStop(0.72, "rgba(0,0,0,0.16)");
  gradient.addColorStop(1, "rgba(0,0,0,0.34)");

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
    radius * 1.34
  );

  gradient.addColorStop(0, "rgba(110,180,255,0)");
  gradient.addColorStop(0.58, "rgba(84,146,255,0.035)");
  gradient.addColorStop(0.78, "rgba(72,125,255,0.11)");
  gradient.addColorStop(1, "rgba(44,92,210,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.34, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawAtmosphereShell(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;
  const thickness = radius * WORLD_KERNEL.constants.atmosphereThicknessFactor;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.985,
    centerX,
    centerY,
    radius + thickness * 2.8
  );

  gradient.addColorStop(0, "rgba(75,145,255,0)");
  gradient.addColorStop(0.72, "rgba(84,168,255,0.04)");
  gradient.addColorStop(0.84, "rgba(112,216,255,0.28)");
  gradient.addColorStop(0.93, "rgba(135,225,255,0.18)");
  gradient.addColorStop(1, "rgba(75,145,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + thickness * 2.8, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawGlobeBase(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const globeGradient = ctx.createRadialGradient(
    centerX - radius * 0.34,
    centerY - radius * 0.34,
    radius * 0.08,
    centerX + radius * 0.08,
    centerY + radius * 0.04,
    radius * 1.02
  );

  globeGradient.addColorStop(0, "#47b8ff");
  globeGradient.addColorStop(0.16, "#1695ff");
  globeGradient.addColorStop(0.34, "#0d63cf");
  globeGradient.addColorStop(0.56, "#083f94");
  globeGradient.addColorStop(0.76, "#042353");
  globeGradient.addColorStop(1, "#010913");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = globeGradient;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawNightSideVignette(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius * 0.10,
    centerX + radius * 0.85,
    centerY + radius * 0.18
  );

  gradient.addColorStop(0, "rgba(0,0,0,0.34)");
  gradient.addColorStop(0.28, "rgba(0,0,0,0.22)");
  gradient.addColorStop(0.58, "rgba(0,0,0,0.07)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawOceanTone(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.18,
    centerY - radius * 0.18,
    radius * 0.03,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(122,232,255,0.12)");
  gradient.addColorStop(0.22, "rgba(66,190,255,0.08)");
  gradient.addColorStop(0.52, "rgba(20,118,214,0.05)");
  gradient.addColorStop(1, "rgba(4,34,90,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.988, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
}

function drawLatitudeBands(ctx, projector) {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
  ctx.strokeStyle = "rgba(190,220,255,0.035)";
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

function drawContinents(ctx, projector) {
  const continents = [
    { lon: -0.74, lat: 0.36, rx: 0.34, ry: 0.19, hue: "#92f06d", edge: "#efffcf" },
    { lon: 1.12, lat: 0.04, rx: 0.27, ry: 0.145, hue: "#b0f07a", edge: "#f4ffd8" },
    { lon: -2.18, lat: -0.26, rx: 0.19, ry: 0.12, hue: "#6fe07a", edge: "#e4ffd2" },
    { lon: 2.52, lat: 0.49, rx: 0.15, ry: 0.10, hue: "#98df7f", edge: "#efffd9" },
    { lon: 0.18, lat: -0.56, rx: 0.10, ry: 0.07, hue: "#c0f084", edge: "#f7ffde" }
  ];

  continents.forEach((continent, index) => {
    const center = projector.projectSphere(continent.lon, continent.lat);
    if (!center.visible) return;

    ctx.beginPath();
    ctx.ellipse(
      center.x,
      center.y,
      projector.state.radius * continent.rx,
      projector.state.radius * continent.ry,
      continent.lon + projector.getOrientation().yaw * 0.36 + index * 0.03,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = continent.hue;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = continent.edge;
    ctx.lineWidth = 1.15;
    ctx.stroke();
    ctx.restore();
  });
}

function drawPolarGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "rgba(220,245,255,0.56)";

  ctx.beginPath();
  ctx.ellipse(centerX, centerY - radius * 0.73, radius * 0.25, radius * 0.085, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(centerX, centerY + radius * 0.73, radius * 0.19, radius * 0.065, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCloudArcs(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.15;

  for (let i = 0; i < 5; i += 1) {
    const arcRadius = radius * (0.48 + i * 0.08);
    const start = 0.22 * Math.PI + Math.sin(time * 0.0007 + i * 0.8) * 0.08;
    const end = 0.8 * Math.PI + Math.cos(time * 0.00055 + i * 0.6) * 0.05;

    ctx.beginPath();
    ctx.arc(centerX, centerY - radius * 0.03, arcRadius, start, end);
    ctx.strokeStyle = "rgba(225,238,255,0.86)";
    ctx.lineWidth = 1.35;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCloudSoftMasses(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const bodies = [
    { x: -0.24, y: -0.18, rx: 0.20, ry: 0.065, rot: -0.22 },
    { x: 0.10, y: -0.02, rx: 0.28, ry: 0.08, rot: 0.08 },
    { x: -0.06, y: 0.18, rx: 0.25, ry: 0.075, rot: -0.12 }
  ];

  ctx.save();
  ctx.globalAlpha = 0.075;

  bodies.forEach((body, index) => {
    const wobbleX = Math.sin(time * 0.00018 + index) * radius * 0.025;
    const wobbleY = Math.cos(time * 0.00015 + index) * radius * 0.012;
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
    ctx.fillStyle = "rgba(240,248,255,0.75)";
    ctx.fill();
  });

  ctx.restore();
}

function drawAtmosphericSheen(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.34,
    centerY - radius * 0.34,
    radius * 0.04,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.14)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.07)");
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
    centerY - radius * 0.10,
    centerX + radius,
    centerY + radius * 0.15
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.34, "rgba(0,0,0,0.16)");
  gradient.addColorStop(0.48, "rgba(150,225,255,0.12)");
  gradient.addColorStop(0.58, "rgba(255,255,255,0.03)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.996, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawCurrents(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const wave = 0.5 + 0.5 * Math.sin(time * 0.0014);

  ctx.strokeStyle = `rgba(130,220,255,${0.10 + wave * 0.08})`;
  ctx.lineWidth = 2;

  for (let i = 0; i < 5; i += 1) {
    const y = centerY + (i - 2) * radius * 0.15;
    ctx.beginPath();
    ctx.arc(centerX, y, radius * (0.70 - i * 0.07), 0.16 * Math.PI, 0.84 * Math.PI);
    ctx.stroke();
  }
}

function drawCycleArc(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    radius * 0.8,
    time * 0.00045,
    time * 0.00045 + Math.PI * 0.72
  );
  ctx.strokeStyle = "rgba(255,255,255,0.68)";
  ctx.lineWidth = 1.1;
  ctx.stroke();
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
  ctx.fillStyle = "rgba(121,169,255,0.06)";
  ctx.strokeStyle = "rgba(121,169,255,0.22)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.rect(x, y, cellWidth, cellHeight);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlanetMaskOutline(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.restore();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1.45;
  ctx.stroke();
}

export function createEnvironmentRenderer() {
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
      surfaces: true,
      cycles: true
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
    drawGlobeBase(ctx, projector);
    drawNightSideVignette(ctx, projector);
    drawOceanTone(ctx, projector);
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
    drawContinents(ctx, projector);
    drawPolarGlow(ctx, projector);
    drawCloudArcs(ctx, projector, renderState.time);
    drawCloudSoftMasses(ctx, projector, renderState.time);
    drawAtmosphericSheen(ctx, projector);
    drawTerminatorGlow(ctx, projector);
    drawCurrents(ctx, projector, renderState.time);
    drawCycleArc(ctx, projector, renderState.time);
    drawSurfaceCellHighlight(ctx, projector, renderState);
    drawPlanetMaskOutline(ctx, projector);

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
