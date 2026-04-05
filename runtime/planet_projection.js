DESTINATION: /runtime/planet_projection.js
(() => {
  "use strict";

  const NOOP = () => {};
  const IDENTITY = (value) => value;
  const RETURN_NULL = () => null;

  const projectionStub = {
    __type: "PLANET_PROJECTION_STUB",
    __active: false,
    __authority: "DISABLED_FOR_COMPASS_BASELINE",
    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    project: IDENTITY,
    unproject: IDENTITY,
    projectPoint: IDENTITY,
    projectPath: IDENTITY,
    setContext: NOOP,
    setCamera: NOOP,
    setViewport: NOOP,
    resize: NOOP,
    getCamera: RETURN_NULL,
    getViewport: RETURN_NULL,
    getState: () => ({
      active: false,
      authority: "DISABLED_FOR_COMPASS_BASELINE"
    })
  };

  if (typeof window !== "undefined") {
    window.planetProjection = projectionStub;
    window.PlanetProjection = projectionStub;
    window.__PLANET_PROJECTION_DISABLED__ = true;
  }
})();
