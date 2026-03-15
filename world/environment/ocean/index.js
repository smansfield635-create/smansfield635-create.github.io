import { createDepthEngine } from "./depth_engine.js";
import { createCurrentEngine } from "./current_engine.js";
import { createSeaLifeEngine } from "./sea_life_engine.js";
import { createBoatingLifeEngine } from "./boating_life_engine.js";

export function createOceanEngine() {
  const depthEngine = createDepthEngine();
  const currentEngine = createCurrentEngine();
  const seaLifeEngine = createSeaLifeEngine();
  const boatingLifeEngine = createBoatingLifeEngine();

  function renderBase(ctx, projector, runtime, state) {
    depthEngine.render(ctx, projector, runtime, state);
  }

  function renderDynamic(ctx, projector, runtime, state) {
    currentEngine.render(ctx, projector, runtime, state);
    seaLifeEngine.render(ctx, projector, runtime, state);
    boatingLifeEngine.render(ctx, projector, runtime, state);
  }

  return Object.freeze({
    renderBase,
    renderDynamic
  });
}
