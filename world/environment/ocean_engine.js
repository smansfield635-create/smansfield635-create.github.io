import { createOceanDepthEngine } from "./ocean/depth_engine.js";
import { createOceanCurrentEngine } from "./ocean/current_engine.js";
import { createOceanSeaLifeEngine } from "./ocean/sea_life_engine.js";
import { createOceanBoatingLifeEngine } from "./ocean/boating_life_engine.js";

export function createOceanEngine() {
  const depthEngine = createOceanDepthEngine();
  const currentEngine = createOceanCurrentEngine();
  const seaLifeEngine = createOceanSeaLifeEngine();
  const boatingLifeEngine = createOceanBoatingLifeEngine();

  const classes = Object.freeze({
    depth: Object.freeze({ enabled: true, coverage: "256x256" }),
    current: Object.freeze({ enabled: true, coverage: "256x256" }),
    sea_life: Object.freeze({ enabled: true, coverage: "256x256" }),
    boating_life: Object.freeze({ enabled: true, coverage: "256x256" })
  });

  function renderBase(ctx, projector, runtime, state, terrainField) {
    depthEngine.render(ctx, projector, runtime, state, terrainField);
  }

  function renderDynamic(ctx, projector, runtime, state, terrainField) {
    currentEngine.render(ctx, projector, runtime, state, terrainField);
    seaLifeEngine.render(ctx, projector, runtime, state, terrainField);
    boatingLifeEngine.render(ctx, projector, runtime, state, terrainField);
  }

  return Object.freeze({
    classes,
    renderBase,
    renderDynamic
  });
}
