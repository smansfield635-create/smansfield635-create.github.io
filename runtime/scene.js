DESTINATION: /runtime/scene.js
(() => {
  "use strict";

  const NOOP = () => {};
  const RETURN_NULL = () => null;
  const RETURN_FALSE = () => false;

  const sceneStub = {
    __type: "SCENE_STUB",
    __active: false,
    __authority: "DISABLED_FOR_COMPASS_BASELINE",
    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    render: NOOP,
    resize: NOOP,
    update: NOOP,
    attach: NOOP,
    detach: NOOP,
    mount: NOOP,
    unmount: NOOP,
    setCanvas: NOOP,
    getCanvas: RETURN_NULL,
    getState: () => ({
      active: false,
      authority: "DISABLED_FOR_COMPASS_BASELINE"
    }),
    isActive: RETURN_FALSE
  };

  if (typeof window !== "undefined") {
    window.scene = sceneStub;
    window.SceneRuntime = sceneStub;
    window.__RUNTIME_SCENE_DISABLED__ = true;
  }
})();
