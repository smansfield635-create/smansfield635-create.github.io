// /showroom/runtime.js
export function createShowroomRuntime(config = {}) {
  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const state = {
    chamber: config.chamber || "05_SHOWROOM",
    route: config.route || "/showroom/",
    mode: config.mode || "controlled-baseline",
    generation: config.generation || "showroom-runtime-v2",
    started: false,
    reducedMotion,
    frame: 0,
    receipts: [
      "SHOWROOM_CHAMBER=HOUSE_PART_05",
      "SHOWROOM_RUNTIME=ACTIVE",
      "RUNTIME_AUTHORITY=STATE_AND_MODE_ONLY",
      "RENDER_AUTHORITY=SHOWROOM_RENDER_JS",
      "CSS_AUTHORITY=SHOWROOM_CSS"
    ]
  };

  let animationHandle = null;
  const listeners = new Set();

  function getSnapshot() {
    return {
      ...state,
      receipts: [...state.receipts]
    };
  }

  function notify() {
    const snapshot = getSnapshot();

    for (const listener of listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        console.warn("[Showroom runtime listener failed]", error);
      }
    }
  }

  function tick() {
    if (!state.started || state.reducedMotion) {
      return;
    }

    state.frame += 1;
    notify();
    animationHandle = window.requestAnimationFrame(tick);
  }

  function start() {
    if (state.started) {
      return getSnapshot();
    }

    state.started = true;

    if (!state.receipts.includes("SHOWROOM_RUNTIME_STARTED=TRUE")) {
      state.receipts.push("SHOWROOM_RUNTIME_STARTED=TRUE");
    }

    notify();

    if (!state.reducedMotion) {
      animationHandle = window.requestAnimationFrame(tick);
    }

    return getSnapshot();
  }

  function stop() {
    state.started = false;

    if (animationHandle !== null) {
      window.cancelAnimationFrame(animationHandle);
      animationHandle = null;
    }

    notify();
    return getSnapshot();
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }

    listeners.add(listener);
    listener(getSnapshot());

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    start,
    stop,
    subscribe,
    getState: getSnapshot
  };
}
