import { WORLD_KERNEL } from "./world_kernel.js";
import { createSpaceEngine } from "./environment/space_engine.js";
import { createAtmosphereEngine } from "./environment/atmosphere_engine.js";
import { createSurfaceEngine } from "./environment/surface_engine.js";
import { createOceanEngine } from "./environment/ocean/index.js";

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

export function createEnvironmentRenderer() {
  const spaceEngine = createSpaceEngine();
  const atmosphereEngine = createAtmosphereEngine();
  const surfaceEngine = createSurfaceEngine();
  const oceanEngine = createOceanEngine();

  const families = Object.freeze({
    space: Object.freeze({
      stars: true,
      nebula: true,
      orbits: true,
      bodies: true
    }),
    atmosphere: Object.freeze({
      wind: true,
      atmospheric_discharge: true,
      moisture: true,
      temperature: true
    }),
    ocean: Object.freeze({
      depth: true,
      current: true,
      sea_life: true,
      boating_life: true
    }),
    surface: Object.freeze({
      shoreline: true,
      infrastructure: true,
      terrain: true,
      foliage: true
    })
  });

  function render(ctx, projector, runtime) {
    const renderState = getRenderState(runtime);
    const audit = createEnvironmentAudit(runtime, renderState);
    const { width, height } = getCanvasMetrics(ctx);
    const terrainField = surfaceEngine.buildTerrainField(projector);

    ctx.clearRect(0, 0, width, height);

    spaceEngine.render(ctx, projector, runtime, renderState);
    atmosphereEngine.renderOuter(ctx, projector, runtime, renderState);

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      projector.state.centerX,
      projector.state.centerY,
      projector.state.radius,
      0,
      Math.PI * 2
    );
    ctx.clip();

    surfaceEngine.renderBase(ctx, projector, runtime, renderState, terrainField);
    oceanEngine.renderBase(ctx, projector, runtime, renderState, terrainField);
    atmosphereEngine.renderInner(ctx, projector, runtime, renderState);
    oceanEngine.renderDynamic(ctx, projector, runtime, renderState, terrainField);
    surfaceEngine.renderOverlay(ctx, projector, runtime, renderState);

    ctx.restore();

    atmosphereEngine.renderOutline(ctx, projector, runtime, renderState);

    return Object.freeze({
      width,
      height,
      families,
      audit
    });
  }

  return Object.freeze({
    families,
    render
  });
}
