import { createWorldRuntime } from "../../world/runtime/world_runtime.js";

export async function createSceneRuntime({
  canvas,
  context,
  statusRoot,
  getViewport,
}) {
  const worldRuntime = await createWorldRuntime({
    canvas,
    context,
    statusRoot,
    getViewport,
  });

  return {
    start() {
      worldRuntime.start();
    },

    stop() {
      worldRuntime.stop();
    },

    resize(viewport) {
      worldRuntime.resize(viewport);
    },

    frame(now, deltaMs) {
      worldRuntime.frame(now, deltaMs);
    },
  };
}
