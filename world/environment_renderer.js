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
  gradient.addColorStop(0.45, "#040914");
  gradient.addColorStop(1, "#02050b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStellar(ctx, width, height, time) {
  const count = 90;
  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 51.3) * 0.5 + 0.5) * height;
    const twinkle = 0.45 + 0.55 * Math.sin(time * 0.001 + i * 0.9);
    ctx.globalAlpha = twinkle * 0.75;
    ctx.fillStyle = "#dfe8ff";
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function drawAtmosphereShell(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;
  const thickness = radius * WORLD_KERNEL.constants.atmosphereThicknessFactor;
  const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + thickness * 2.4);

  gradient.addColorStop(0, "rgba(75, 145, 255, 0.00)");
  gradient.addColorStop(0.65, "rgba(75, 145, 255, 0.18)");
  gradient.addColorStop(1, "rgba(75, 145, 255, 0.00)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + thickness * 2.4, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawGlobeBase(ctx, projector) {
  const { centerX, centerY, radius } = projector.state;
  const globeGradient = ctx.createRadialGradient(
    centerX - radius * 0.35,
    centerY - radius * 0.35,
    radius * 0.1,
    centerX,
    centerY,
    radius
  );

  globeGradient.addColorStop(0, "#2f6eff");
  globeGradient.addColorStop(0.42, "#0c3a93");
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

function drawContinents(ctx, projector) {
  const continents = [
    { lon: -0.7, lat: 0.35, rx: 0.32, ry: 0.18, hue: "#52a163" },
    { lon: 1.15, lat: 0.05, rx: 0.25, ry: 0.14, hue: "#78b35b" },
    { lon: -2.2, lat: -0.25, rx: 0.18, ry: 0.12, hue: "#3f9159" },
    { lon: 2.55, lat: 0.48, rx: 0.15, ry: 0.10, hue: "#68aa6f" }
  ];

  continents.forEach((continent) => {
    const center = projector.projectSphere(continent.lon, continent.lat);
    if (!center.visible) return;

    ctx.beginPath();
    ctx.ellipse(
      center.x,
      center.y,
      projector.state.radius * continent.rx,
      projector.state.radius * continent.ry,
      continent.lon + projector.getOrientation().yaw * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = continent.hue;
    ctx.fill();
  });
}

function drawGrid(ctx, projector) {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;

  for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
    let first = true;
    ctx.beginPath();
    for (let lonDeg = 0; lonDeg <= 360; lonDeg += 10) {
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

function drawWaterHighlights(ctx, projector, time) {
  const { centerX, centerY, radius } = projector.state;
  const wave = 0.5 + 0.5 * Math.sin(time * 0.0014);

  ctx.strokeStyle = `rgba(130, 220, 255, ${0.12 + wave * 0.08})`;
  ctx.lineWidth = 2;

  for (let i = 0; i < 4; i += 1) {
    const y = centerY + (i - 1.5) * radius * 0.18;
    ctx.beginPath();
    ctx.arc(centerX, y, radius * (0.66 - i * 0.08), 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
  }
}

function drawSurfaceCellHighlight(ctx, projector, renderState) {
  if (!renderState.gridBound) return;

  const { centerX, centerY, radius } = projector.state;
  const row = renderState.localSelection.row;
  const col = renderState.localSelection.col;
  const cellWidth = (radius * 1.1) / 4;
  const cellHeight = (radius * 1.1) / 4;
  const x = centerX - (radius * 0.55) + col * cellWidth;
  const y = centerY - (radius * 0.55) + row * cellHeight;

  ctx.save();
  ctx.fillStyle = "rgba(121, 169, 255, 0.10)";
  ctx.strokeStyle = "rgba(121, 169, 255, 0.25)";
  ctx.lineWidth = 1;
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
    drawStellar(ctx, width, height, renderState.time);
    drawAtmosphereShell(ctx, projector);
    drawGlobeBase(ctx, projector);
    drawContinents(ctx, projector);
    drawGrid(ctx, projector);
    drawWaterHighlights(ctx, projector, renderState.time);
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
