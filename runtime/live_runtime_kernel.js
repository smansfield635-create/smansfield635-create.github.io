DESTINATION: /runtime/live_runtime_kernel.js
(() => {
  "use strict";

  const NOOP = () => {};
  const RETURN_NULL = () => null;
  const RETURN_FALSE = () => false;

  if (typeof window !== "undefined" && typeof window.__COMPASS_BASELINE_RAF__ === "number") {
    cancelAnimationFrame(window.__COMPASS_BASELINE_RAF__);
    window.__COMPASS_BASELINE_RAF__ = null;
  }

  const liveRuntimeKernelStub = {
    __type: "LIVE_RUNTIME_KERNEL_STUB",
    __active: false,
    __authority: "DISABLED_FOR_COMPASS_BASELINE",
    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    mount: NOOP,
    unmount: NOOP,
    render: NOOP,
    tick: NOOP,
    resize: NOOP,
    attach: NOOP,
    detach: NOOP,
    clear: NOOP,
    getKernel: RETURN_NULL,
    getRuntime: RETURN_NULL,
    getState: () => ({
      active: false,
      authority: "DISABLED_FOR_COMPASS_BASELINE"
    }),
    isActive: RETURN_FALSE
  };

  if (typeof window !== "undefined") {
    window.liveRuntimeKernel = liveRuntimeKernelStub;
    window.LiveRuntimeKernel = liveRuntimeKernelStub;
    window.__LIVE_RUNTIME_KERNEL_DISABLED__ = true;
  }
})();
