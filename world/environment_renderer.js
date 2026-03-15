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
  gradient.addColorStop(0, "#06111f");
  gradient.addColorStop(0.32, "#040914");
  gradient.addColorStop(0.72, "#030610");
  gradient.addColorStop(1, "#02050b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNebulaBands(ctx, width, height, time) {
  ctx.save();

  for (let i = 0; i < 3; i += 1) {
    const x = width * (0.2 + i * 0.28);
    const y = height * (0.18 + i * 0.19);
    const wobbleX = Math.sin(time * 0.00018 + i * 1.7) * width * 0.035;
    const wobbleY = Math.cos(time * 0.00015 + i * 1.3) * height * 0.03;
    const radiusX = width * (0.18 + i * 0.03);
    const radiusY = height * (0.08 + i * 0.018);

    const gradient = ctx.createRadialGradient(
      x + wobbleX,
      y + wobbleY,
      0,
      x + wobbleX,
      y + wobbleY,
      radiusX
    );

    gradient.addColorStop(0, "rgba(90, 120, 255, 0.13)");
    gradient.addColorStop(0.45, "rgba(70, 110, 230, 0.07)");
    gradient.addColorStop(1, "rgba(40, 80, 170, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x + wobbleX, y + wobbleY, radiusX, radiusY, -0.35 + i * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStars(ctx, width, height, time) {
  const count = 140;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 51.3) * 0.5 + 0.5) * height;
    const twinkle = 0.35 + 0.65 * Math.sin(time * 0.001 + i * 0.73);

    ctx.globalAlpha = twinkle * 0.82;
    ctx.fillStyle = i % 9 === 0 ? "rgba(210,230,255,0.95)" : "#dfe8ff";
    ctx.fillRect(x, y, i % 11 === 0 ? 2.5 : 2, i % 11 === 0 ? 2.5 : 2);
  }

  ctx.globalAlpha = 1;
}

function drawDeepSpaceOrbits(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.strokeStyle = "rgba(140, 175, 255, 0.08)";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1.18 + i * 0.12), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createRadialGradient(
    centerX + radius * 0.2,
    centerY + radius * 0.18,
    radius * 0.1,
    centerX + radius * 0.18,
    centerY + radius * 0.18,
    radius * 1.05
  );

  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.65, "rgba(0,0,0,0.06)");
  gradient.addColorStop(1, "rgba(0,0,0,0.24)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.02, 0, Math.PI * 2);
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
    radius,
    centerX,
    centerY,
    radius + thickness * 2.8
  );

  gradient.addColorStop(0, "rgba(75,145,255,0)");
  gradient.addColorStop(0.56, "rgba(75,145,255,0.14)");
  gradient.addColorStop(0.76, "rgba(95,185,255,0.16)");
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
    centerX,
    centerY,
    radius
  );

  globeGradient.addColorStop(0, "#3b7dff");
  globeGradient.addColorStop(0.26, "#215fd2");
  globeGradient.addColorStop(0.52, "#123f9d");
  globeGradient.addColorStop(1, "#08142c");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = globeGradient;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawOceanTone(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.985, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80,170,255,0.55)";
  ctx.fill();
  ctx.restore();
}

function drawLatitudeBands(ctx, projector) {
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
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
  ctx.strokeStyle = "rgba(190,220,255,0.045)";
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
    { lon: -0.74, lat: 0.36, rx: 0.34, ry: 0.19, hue: "#58a66a" },
    { lon: 1.12, lat: 0.04, rx: 0.27, ry: 0.145, hue: "#7cb85d" },
    { lon: -2.18, lat: -0.26, rx: 0.19, ry: 0.12, hue: "#45955b" },
    { lon: 2.52, lat: 0.49, rx: 0.15, ry: 0.10, hue: "#6fae73" },
    { lon: 0.18, lat: -0.56, rx: 0.10, ry: 0.07, hue: "#89bb6f" }
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
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#dfeccf";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  });
}

function drawPolarGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "rgba(210,240,255,0.5)";

  ctx.beginPath();
  ctx.ellipse(centerX, centerY - radius * 0.72, radius * 0.22, radius * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(centerX, centerY + radius * 0.72, radius * 0.18, radius * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCloudArcs(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.13;

  for (let i = 0; i < 4; i += 1) {
    const arcRadius = radius * (0.5 + i * 0.09);
    const start = 0.23 * Math.PI + Math.sin(time * 0.0007 + i * 0.8) * 0.08;
    const end = 0.79 * Math.PI + Math.cos(time * 0.00055 + i * 0.6) * 0.05;

    ctx.beginPath();
    ctx.arc(centerX, centerY - radius * 0.03, arcRadius, start, end);
    ctx.strokeStyle = "rgba(225,238,255,0.85)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  ctx.restore();
}

function drawAtmosphericSheen(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.34,
    centerY - radius * 0.34,
    radius * 0.05,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.22)");
  gradient.addColorStop(0.28, "rgba(255,255,255,0.09)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawCurrents(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const wave = 0.5 + 0.5 * Math.sin(time * 0.0014);

  ctx.strokeStyle = `rgba(130,220,255,${0.12 + wave * 0.08})`;
  ctx.lineWidth = 2;

  for (let i = 0; i < 4; i += 1) {
    const y = centerY + (i - 1.5) * radius * 0.18;
    ctx.beginPath();
    ctx.arc(centerX, y, radius * (0.67 - i * 0.08), 0.17 * Math.PI, 0.83 * Math.PI);
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
    radius * 0.79,
    time * 0.00045,
    time * 0.00045 + Math.PI * 0.72
  );
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 1.15;
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
  ctx.fillStyle = "rgba(121,169,255,0.10)";
  ctx.strokeStyle = "rgba(121,169,255,0.28)";
  ctx.lineWidth = 1.1;
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
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.5;
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
    drawDeepSpaceOrbits(ctx, projector);
    drawPlanetShadow(ctx, projector);
    drawAtmosphereShell(ctx, projector);
    drawGlobeBase(ctx, projector);
    drawOceanTone(ctx, projector);
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
    drawContinents(ctx, projector);
    drawPolarGlow(ctx, projector);
    drawCloudArcs(ctx, projector, renderState.time);
    drawAtmosphericSheen(ctx, projector);
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
