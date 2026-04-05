DESTINATION: /runtime/world_runtime.js
(() => {
  "use strict";

  const NOOP = () => {};
  const RETURN_NULL = () => null;
  const RETURN_FALSE = () => false;

  const worldRuntimeStub = {
    __type: "WORLD_RUNTIME_STUB",
    __active: false,
    __authority: "DISABLED_FOR_COMPASS_BASELINE",
    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    tick: NOOP,
    render: NOOP,
    resize: NOOP,
    attach: NOOP,
    detach: NOOP,
    mount: NOOP,
    unmount: NOOP,
    getWorld: RETURN_NULL,
    getScene: RETURN_NULL,
    setScene: NOOP,
    setCanvas: NOOP,
    getState: () => ({
      active: false,
      authority: "DISABLED_FOR_COMPASS_BASELINE"
    }),
    isActive: RETURN_FALSE
  };

  if (typeof window !== "undefined") {
    window.worldRuntime = worldRuntimeStub;
    window.WorldRuntime = worldRuntimeStub;
    window.__WORLD_RUNTIME_DISABLED__ = true;
  }
})();
