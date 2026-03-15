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
    const wobbleY = Math.cos(time * 0.0001 + index * 1.07) * height * 0.014;
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

function drawGlobeBase(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const globeGradient = ctx.createRadialGradient(
    centerX - radius * 0.30,
    centerY - radius * 0.26,
    radius * 0.05,
    centerX + radius * 0.08,
    centerY + radius * 0.08,
    radius * 1.02
  );

  globeGradient.addColorStop(0, "#3fb9ff");
  globeGradient.addColorStop(0.12, "#1690ff");
  globeGradient.addColorStop(0.26, "#0e62ca");
  globeGradient.addColorStop(0.44, "#083f94");
  globeGradient.addColorStop(0.68, "#04214d");
  globeGradient.addColorStop(1, "#010812");

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
    centerY - radius * 0.12,
    centerX + radius * 0.90,
    centerY + radius * 0.16
  );

  gradient.addColorStop(0, "rgba(0,0,0,0.28)");
  gradient.addColorStop(0.30, "rgba(0,0,0,0.18)");
  gradient.addColorStop(0.58, "rgba(0,0,0,0.05)");
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
    centerX - radius * 0.12,
    centerY - radius * 0.14,
    radius * 0.03,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(122,232,255,0.08)");
  gradient.addColorStop(0.20, "rgba(66,190,255,0.05)");
  gradient.addColorStop(0.46, "rgba(20,118,214,0.03)");
  gradient.addColorStop(1, "rgba(4,34,90,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.988, 0, Math.PI * 2);
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

function drawContinents(ctx, projector) {
  const continents = [
    { lon: -0.82, lat: 0.52, rx: 0.18, ry: 0.11, hue: "#b6ef72", edge: "#f6ffd6" },
    { lon: 1.08, lat: 0.06, rx: 0.30, ry: 0.16, hue: "#c3f06f", edge: "#fbffd8" },
    { lon: -2.14, lat: -0.20, rx: 0.13, ry: 0.10, hue: "#82e076", edge: "#ecffd8" },
    { lon: 2.44, lat: 0.62, rx: 0.12, ry: 0.08, hue: "#d0f27d", edge: "#fbffe2" },
    { lon: 0.14, lat: -0.58, rx: 0.08, ry: 0.06, hue: "#a6ea80", edge: "#f3ffdf" }
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
      continent.lon + projector.getOrientation().yaw * 0.34 + index * 0.03,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = continent.hue;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = continent.edge;
    ctx.lineWidth = 1.05;
    ctx.stroke();
    ctx.restore();
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

function drawCurrents(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const wave = 0.5 + 0.5 * Math.sin(time * 0.0014);

  ctx.strokeStyle = `rgba(130,220,255,${0.08 + wave * 0.06})`;
  ctx.lineWidth = 1.8;

  for (let i = 0; i < 4; i += 1) {
    const y = centerY + (i - 1.3) * radius * 0.11;
    ctx.beginPath();
    ctx.arc(centerX, y, radius * (0.58 - i * 0.055), 0.22 * Math.PI, 0.78 * Math.PI);
    ctx.stroke();
  }
}

function drawCycleArc(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY - radius * 0.10,
    radius * 0.72,
    time * 0.00045,
    time * 0.00045 + Math.PI * 0.60
  );
  ctx.strokeStyle = "rgba(255,255,255,0.54)";
  ctx.lineWidth = 1.0;
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
  ctx.fillStyle = "rgba(121,169,255,0.05)";
  ctx.strokeStyle = "rgba(121,169,255,0.18)";
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
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1.35;
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
    drawUpperAtmosphereAccent(ctx, projector);
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
