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
  gradient.addColorStop(0, "#050b18");
  gradient.addColorStop(0.28, "#061021");
  gradient.addColorStop(0.62, "#040914");
  gradient.addColorStop(1, "#02050b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNebulaBands(ctx, width, height, time) {
  ctx.save();

  const bands = [
    { x: 0.16, y: 0.24, rx: 0.28, ry: 0.10, rot: -0.42, a: 0.16, c0: "rgba(90,130,255,0.20)", c1: "rgba(55,85,210,0.00)" },
    { x: 0.72, y: 0.18, rx: 0.23, ry: 0.09, rot: 0.18, a: 0.14, c0: "rgba(110,90,255,0.16)", c1: "rgba(60,40,175,0.00)" },
    { x: 0.76, y: 0.72, rx: 0.34, ry: 0.12, rot: 0.32, a: 0.14, c0: "rgba(80,155,255,0.16)", c1: "rgba(35,90,180,0.00)" },
    { x: 0.28, y: 0.74, rx: 0.26, ry: 0.10, rot: -0.16, a: 0.12, c0: "rgba(120,80,220,0.14)", c1: "rgba(70,40,140,0.00)" }
  ];

  bands.forEach((band, index) => {
    const wobbleX = Math.sin(time * 0.00012 + index * 1.37) * width * 0.02;
    const wobbleY = Math.cos(time * 0.0001 + index * 1.11) * height * 0.018;
    const cx = width * band.x + wobbleX;
    const cy = height * band.y + wobbleY;
    const rx = width * band.rx;
    const ry = height * band.ry;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    gradient.addColorStop(0, band.c0);
    gradient.addColorStop(0.55, `rgba(90,120,255,${band.a * 0.45})`);
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
    const twinkle = 0.3 + 0.7 * Math.sin(time * 0.001 + i * 0.73);
    const size = i % 19 === 0 ? 2.8 : i % 7 === 0 ? 2.1 : 1.5;

    ctx.globalAlpha = twinkle * (i % 19 === 0 ? 0.95 : 0.78);
    ctx.fillStyle = i % 13 === 0 ? "rgba(225,235,255,0.98)" : "#dfe8ff";
    ctx.fillRect(x, y, size, size);
  }

  ctx.globalAlpha = 1;
}

function drawStarStreaks(ctx, width, height, time) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(215,230,255,0.55)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 8; i += 1) {
    const x = ((i + 1) / 9) * width + Math.sin(time * 0.00016 + i) * 18;
    const y = ((i % 4) / 4 + 0.12) * height + Math.cos(time * 0.00011 + i) * 12;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 3);
    ctx.lineTo(x + 8, y - 3);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDeepSpaceOrbits(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.strokeStyle = "rgba(140, 175, 255, 0.09)";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1.2 + i * 0.13), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  const gradient = ctx.createRadialGradient(
    centerX + radius * 0.22,
    centerY + radius * 0.18,
    radius * 0.08,
    centerX + radius * 0.2,
    centerY + radius * 0.18,
    radius * 1.08
  );

  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.65, "rgba(0,0,0,0.07)");
  gradient.addColorStop(1, "rgba(0,0,0,0.26)");

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
    radius * 0.95,
    centerX,
    centerY,
    radius * 1.36
  );

  gradient.addColorStop(0, "rgba(110,180,255,0)");
  gradient.addColorStop(0.52, "rgba(90,155,255,0.06)");
  gradient.addColorStop(0.78, "rgba(70,125,255,0.10)");
  gradient.addColorStop(1, "rgba(50,105,230,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.36, 0, Math.PI * 2);
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
    radius + thickness * 3.2
  );

  gradient.addColorStop(0, "rgba(75,145,255,0)");
  gradient.addColorStop(0.5, "rgba(75,145,255,0.16)");
  gradient.addColorStop(0.76, "rgba(105,205,255,0.20)");
  gradient.addColorStop(1, "rgba(75,145,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + thickness * 3.2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawGlobeBase(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  const globeGradient = ctx.createRadialGradient(
    centerX - radius * 0.36,
    centerY - radius * 0.36,
    radius * 0.08,
    centerX,
    centerY,
    radius
  );

  globeGradient.addColorStop(0, "#54b8ff");
  globeGradient.addColorStop(0.18, "#2999ff");
  globeGradient.addColorStop(0.42, "#1465d5");
  globeGradient.addColorStop(0.72, "#0b3386");
  globeGradient.addColorStop(1, "#071225");

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

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.22,
    centerY - radius * 0.22,
    radius * 0.04,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(110,220,255,0.18)");
  gradient.addColorStop(0.36, "rgba(70,185,255,0.10)");
  gradient.addColorStop(1, "rgba(25,120,220,0.02)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.988, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
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
    { lon: -0.74, lat: 0.36, rx: 0.34, ry: 0.19, hue: "#71db70", edge: "#d9ffbf" },
    { lon: 1.12, lat: 0.04, rx: 0.27, ry: 0.145, hue: "#94dd65", edge: "#ebffcb" },
    { lon: -2.18, lat: -0.26, rx: 0.19, ry: 0.12, hue: "#56bf66", edge: "#d7f7c4" },
    { lon: 2.52, lat: 0.49, rx: 0.15, ry: 0.10, hue: "#80cf74", edge: "#e7ffd0" },
    { lon: 0.18, lat: -0.56, rx: 0.10, ry: 0.07, hue: "#a6de74", edge: "#f0ffd7" }
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
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = continent.edge;
    ctx.lineWidth = 1.1;
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
    ctx.strokeStyle = "rgba(225,238,255,0.88)";
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
  ctx.globalAlpha = 0.08;

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
    centerX - radius * 0.36,
    centerY - radius * 0.36,
    radius * 0.05,
    centerX,
    centerY,
    radius
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.24)");
  gradient.addColorStop(0.24, "rgba(255,255,255,0.11)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawTerminatorGlow(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;

  ctx.save();
  ctx.globalAlpha = 0.14;
  const gradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius * 0.15,
    centerX + radius,
    centerY + radius * 0.15
  );
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.45, "rgba(165,220,255,0.16)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.02)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.995, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawCurrents(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const wave = 0.5 + 0.5 * Math.sin(time * 0.0014);

  ctx.strokeStyle = `rgba(130,220,255,${0.12 + wave * 0.09})`;
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
  ctx.globalAlpha = 0.14;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    radius * 0.8,
    time * 0.00045,
    time * 0.00045 + Math.PI * 0.72
  );
  ctx.strokeStyle = "rgba(255,255,255,0.76)";
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
  ctx.fillStyle = "rgba(121,169,255,0.08)";
  ctx.strokeStyle = "rgba(121,169,255,0.26)";
  ctx.lineWidth = 1.05;
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
    drawStarStreaks(ctx, width, height, renderState.time);
    drawDeepSpaceOrbits(ctx, projector);
    drawPlanetShadow(ctx, projector);
    drawPlanetOuterGlow(ctx, projector);
    drawAtmosphereShell(ctx, projector);
    drawGlobeBase(ctx, projector);
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
