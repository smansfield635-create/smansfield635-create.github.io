// /assets/hearth/hearth.runtime.js
// HEARTH_G4_SOUTH_STAR_MOTION_RUNTIME_TNT_v2

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_SOUTH_STAR_MOTION_RUNTIME_TNT_v2";
  const RECEIPT = "HEARTH_G4_SOUTH_STAR_MOTION_RUNTIME_RECEIPT";
  const AXIS_TILT_DEGREES = 23.44;
  const TAU = Math.PI * 2;

  const subscribers = new Set();

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    generation: "G4",
    authority: "south-star-motion-only",
    axisTiltDegrees: AXIS_TILT_DEGREES,
    axisTiltRadians: AXIS_TILT_DEGREES * Math.PI / 180,
    rotationRadians: 0.28,
    spinVelocityRadiansPerSecond: 0,
    autoRotate: true,
    autoRadiansPerSecond: 0.075,
    isDragging: false,
    inputActive: false,
    frame: 0,
    elapsedSeconds: 0,
    deltaSeconds: 0,
    waterPhase: 0,
    atmospherePhase: 0,
    lightPhase: 0,
    weatherPhase: 0,
    cloudPhase: 0,
    staticTruthOccupiesRuntime: false,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  };

  let running = false;
  let raf = 0;
  let lastNow = 0;
  let frictionPerSecond = 1.85;
  let minVelocity = 0.00045;
  let maxVelocity = 11;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrap(value) {
    const out = value % TAU;
    return out < 0 ? out + TAU : out;
  }

  function notify() {
    subscribers.forEach((fn) => {
      try { fn(state); } catch (_) {}
    });
  }

  function stamp(status) {
    document.documentElement.dataset.hearthRuntimeLoaded = "true";
    document.documentElement.dataset.hearthRuntimeContract = CONTRACT;
    document.documentElement.dataset.hearthRuntimeReceipt = RECEIPT;
    document.documentElement.dataset.hearthRuntimeStatus = status;
    document.documentElement.dataset.hearthRuntimeAuthority = "south-star-motion-only";
    document.documentElement.dataset.hearthRuntimeStaticTruthOccupiesRuntime = "false";
    document.documentElement.dataset.hearthRuntimeAxisTiltDegrees = String(AXIS_TILT_DEGREES);

    window.HEARTH_RUNTIME_RECEIPT = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      generation: "G4",
      authority: "south-star-motion-only",
      staticTruthOccupiesRuntime: false,
      axisTiltDegrees: AXIS_TILT_DEGREES,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      status
    });
  }

  function tick(now) {
    if (!running) return;

    raf = 0;

    const safeNow = Number.isFinite(now) ? now : performance.now();
    const dt = lastNow ? Math.min(0.05, Math.max(0, (safeNow - lastNow) / 1000)) : 0;
    lastNow = safeNow;

    state.deltaSeconds = dt;
    state.elapsedSeconds += dt;
    state.frame += 1;

    if (!state.isDragging) {
      if (Math.abs(state.spinVelocityRadiansPerSecond) > minVelocity) {
        state.rotationRadians += state.spinVelocityRadiansPerSecond * dt;
        state.spinVelocityRadiansPerSecond *= Math.exp(-frictionPerSecond * dt);
      } else {
        state.spinVelocityRadiansPerSecond = 0;

        if (state.autoRotate) {
          state.rotationRadians += state.autoRadiansPerSecond * dt;
        }
      }
    }

    state.rotationRadians = wrap(state.rotationRadians);
    state.waterPhase = wrap(state.waterPhase + 0.2 * dt);
    state.atmospherePhase = wrap(state.atmospherePhase + 0.11 * dt);
    state.lightPhase = wrap(state.lightPhase + 0.028 * dt);
    state.weatherPhase = wrap(state.weatherPhase + 0.052 * dt);
    state.cloudPhase = wrap(state.cloudPhase + 0.074 * dt);

    notify();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    lastNow = performance.now();
    raf = requestAnimationFrame(tick);
    stamp("running");
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    stamp("stopped");
  }

  function dispose() {
    stop();
    subscribers.clear();
    stamp("disposed");
  }

  function subscribe(fn) {
    if (typeof fn !== "function") return () => {};
    subscribers.add(fn);
    try { fn(state); } catch (_) {}
    return () => subscribers.delete(fn);
  }

  function getState() {
    return state;
  }

  function configure(options = {}) {
    if (typeof options.autoRotate === "boolean") state.autoRotate = options.autoRotate;
    if (Number.isFinite(options.autoRadiansPerSecond)) state.autoRadiansPerSecond = options.autoRadiansPerSecond;
    if (Number.isFinite(options.frictionPerSecond)) frictionPerSecond = Math.max(0, options.frictionPerSecond);
    if (Number.isFinite(options.minVelocity)) minVelocity = Math.max(0, options.minVelocity);
    if (Number.isFinite(options.maxVelocity)) maxVelocity = Math.max(0.1, options.maxVelocity);
    stamp("configured");
    notify();
  }

  function dragStart() {
    state.isDragging = true;
    state.inputActive = true;
    state.spinVelocityRadiansPerSecond = 0;
    stamp("drag-start");
    notify();
  }

  function dragMove(deltaRadians, velocityRadiansPerSecond) {
    const delta = Number.isFinite(deltaRadians) ? deltaRadians : 0;
    const velocity = Number.isFinite(velocityRadiansPerSecond) ? velocityRadiansPerSecond : 0;

    state.rotationRadians = wrap(state.rotationRadians + delta);
    state.spinVelocityRadiansPerSecond = clamp(velocity, -maxVelocity, maxVelocity);
    state.isDragging = true;
    state.inputActive = true;

    notify();
  }

  function dragEnd() {
    state.isDragging = false;
    state.inputActive = false;
    stamp("drag-end");
    notify();
  }

  function setSpinVelocity(velocityRadiansPerSecond) {
    const velocity = Number.isFinite(velocityRadiansPerSecond) ? velocityRadiansPerSecond : 0;
    state.spinVelocityRadiansPerSecond = clamp(velocity, -maxVelocity, maxVelocity);
    notify();
  }

  function addSpin(velocityRadiansPerSecond) {
    const velocity = Number.isFinite(velocityRadiansPerSecond) ? velocityRadiansPerSecond : 0;
    state.spinVelocityRadiansPerSecond = clamp(
      state.spinVelocityRadiansPerSecond + velocity,
      -maxVelocity,
      maxVelocity
    );
    notify();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    axisTiltDegrees: AXIS_TILT_DEGREES,
    start,
    stop,
    dispose,
    subscribe,
    getState,
    configure,
    dragStart,
    dragMove,
    dragEnd,
    setSpinVelocity,
    addSpin
  });

  window.HEARTH_RUNTIME = api;
  window.__HEARTH_RUNTIME_DISPOSE__ = dispose;

  stamp("loaded");
})();
