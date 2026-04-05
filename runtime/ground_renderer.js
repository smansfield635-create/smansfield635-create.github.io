DESTINATION: /runtime/ground_renderer.js
(() => {
  "use strict";

  const NOOP = () => {};
  const RETURN_FALSE = () => false;

  const groundRendererStub = {
    __type: "GROUND_RENDERER_STUB",
    __active: false,
    __authority: "DISABLED_FOR_COMPASS_BASELINE",
    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    render: NOOP,
    draw: NOOP,
    resize: NOOP,
    setContext: NOOP,
    setProjection: NOOP,
    setWorld: NOOP,
    clear: NOOP,
    getState: () => ({
      active: false,
      authority: "DISABLED_FOR_COMPASS_BASELINE"
    }),
    isActive: RETURN_FALSE
  };

  if (typeof window !== "undefined") {
    window.groundRenderer = groundRendererStub;
    window.GroundRenderer = groundRendererStub;
    window.__GROUND_RENDERER_DISABLED__ = true;
  }
})();
