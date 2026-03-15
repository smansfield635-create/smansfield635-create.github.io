import { WORLD_KERNEL } from "./world_kernel.js";
import { createSpaceEngine } from "./environment/space_engine.js";
import { createAtmosphereEngine } from "./environment/atmosphere_engine.js";
import { createSurfaceEngine } from "./environment/surface_engine.js";
import { createOceanEngine } from "./environment/ocean/index.js";
import { createMagneticFieldEngine } from "./environment/magnetic_field_engine.js";
import { createThermodynamicEngine } from "./environment/thermodynamic_engine.js";
import { createHydrologyEngine } from "./environment/hydrology_engine.js";
import { createTopologyEngine } from "./environment/topology_engine.js";

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

function createEnvironmentAudit(runtime, renderState, planetField) {
  return Object.freeze({
    activeDepth: renderState.activeDepth,
    gridBound: renderState.gridBound,
    zone: renderState.localSelection.zone,
    cellId: renderState.localSelection.cellId,
    branch: runtime?.resolvedState?.auditLabels?.branch ?? "external.harbor",
    exclusions: Object.freeze({
      npc: WORLD_KERNEL.scope.includeNPCs === false,
      events: WORLD_KERNEL.scope.includeEvents === false
    }),
    planetField
  });
}

export function createEnvironmentRenderer() {
  const spaceEngine = createSpaceEngine();
  const magneticFieldEngine = createMagneticFieldEngine();
  const thermodynamicEngine = createThermodynamicEngine();
  const hydrologyEngine = createHydrologyEngine();
  const atmosphereEngine = createAtmosphereEngine();
  const surfaceEngine = createSurfaceEngine();
  const topologyEngine = createTopologyEngine();
  const oceanEngine = createOceanEngine();

  const families = Object.freeze({
    space: Object.freeze({
      stars: true,
      nebula: true,
      orbits: true,
      bodies: true
    }),
    magnetic_field: Object.freeze({
      magnetic_intensity: true,
      shielding_gradient: true,
      auroral_potential: true,
      navigation_basis: true
    }),
    thermodynamic: Object.freeze({
      temperature: true,
      thermal_gradient: true,
      freeze_potential: true,
      melt_potential: true,
      evaporation_pressure: true
    }),
    hydrology: Object.freeze({
      rainfall: true,
      runoff: true,
      basin_accumulation: true,
      drainage: true,
      river_path: true,
      lake_formation: true
    }),
    topology: Object.freeze({
      elevation: true,
      slope: true,
      ridge: true,
      valley: true,
      cliff: true,
      canyon: true,
      hill: true,
      basin: true,
      plateau: true,
      cave_potential: true
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
      foliage: true,
      topology_visible_adoption: true
    })
  });

  function render(ctx, projector, runtime) {
    const renderState = getRenderState(runtime);
    const { width, height } = getCanvasMetrics(ctx);

    const terrainField = surfaceEngine.buildTerrainField(projector);
    const topologyField = topologyEngine.buildTopologyField(terrainField);
    const thermodynamicField = thermodynamicEngine.buildThermodynamicField(terrainField, topologyField);
    const hydrologyField = hydrologyEngine.buildHydrologyField(terrainField, topologyField, thermodynamicField);
    const magneticField = magneticFieldEngine.compute(projector, runtime, renderState);

    const planetField = runtime.spine.assemblePlanetField({
      terrainField,
      topologyField,
      thermodynamicField,
      hydrologyField,
      magneticField
    });

    runtime.planetField = planetField;
    runtime.magneticField = magneticField;
    runtime.thermodynamicField = thermodynamicField;
    runtime.hydrologyField = hydrologyField;
    runtime.topologyField = topologyField;

    const audit = createEnvironmentAudit(runtime, renderState, planetField);

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

    oceanEngine.renderBase(ctx, projector, runtime, renderState, planetField.terrainField, planetField.topologyField);
    surfaceEngine.renderBase(ctx, projector, runtime, renderState, planetField.terrainField, planetField.topologyField);
    atmosphereEngine.renderInner(ctx, projector, runtime, renderState);
    oceanEngine.renderDynamic(ctx, projector, runtime, renderState, planetField.terrainField, planetField.topologyField);
    surfaceEngine.renderOverlay(ctx, projector, runtime, renderState, planetField.topologyField);

    ctx.restore();

    atmosphereEngine.renderOutline(ctx, projector, runtime, renderState);

    return Object.freeze({
      width,
      height,
      families,
      audit,
      planetField
    });
  }

  return Object.freeze({
    families,
    render
  });
}
