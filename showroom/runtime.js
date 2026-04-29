/*
  /showroom/runtime.js
  SHOWROOM_GENERATION_3_RUNTIME_MOTION_STATE_TNT_v1

  Runtime owns state and receipts only.
  No DOM replacement.
  No page layout.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-runtime-motion-state-v1";

  const state = {
    generation1: "no-graphic-baseline-preserved",
    generation2: "baseline-graphics-preserved",
    generation3: "axis-rotation-depth-refinement-active",
    activeGlobeStatus: "pending",
    generation3MotionStatus: "pending",
    reducedMotion: false,
    started: false,
    axisTiltDegrees: 23.5,
    rotationDirection: "east-west",
    motionTick: 0,
    rotationPhase: 0,
    intervalId: null
  };

  function nodes() {
    return [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      document.getElementById("showroom-globe-mount")
    ].filter(Boolean);
  }

  function detectReducedMotion() {
    state.reducedMotion =
      Boolean(window.matchMedia) &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
  }

  function writeReceipts(status) {
    state.activeGlobeStatus = status || state.activeGlobeStatus;

    nodes().forEach(function (node) {
      node.dataset.showroomRuntime = VERSION;
      node.dataset.generation1NoGraphicBaseline = "preserved";
      node.dataset.generation2BaselineGraphics = "preserved";
      node.dataset.generation2ActiveGlobe = state.activeGlobeStatus;
      node.dataset.generation3 = state.generation3;
      node.dataset.generation3RuntimeMotion = state.generation3MotionStatus;
      node.dataset.generation3AxisRotation = state.reducedMotion ? "paused-reduced-motion" : "active";
      node.dataset.generation3AxisTiltDegrees = String(state.axisTiltDegrees);
      node.dataset.generation3RotationDirection = state.rotationDirection;
      node.dataset.generation3MotionTick = String(state.motionTick);
      node.dataset.generation3RotationPhase = String(state.rotationPhase);
      node.dataset.reducedMotion = state.reducedMotion ? "true" : "false";

      node.style.setProperty("--showroom-runtime-phase", String(state.rotationPhase));
      node.style.setProperty("--showroom-axis-tilt", state.axisTiltDegrees + "deg");
    });
  }

  function stepMotion() {
    if (state.reducedMotion) {
      state.generation3MotionStatus = "paused-reduced-motion";
      writeReceipts(state.activeGlobeStatus);
      return;
    }

    state.motionTick += 1;
    state.rotationPhase = (state.rotationPhase + 6) % 360;
    state.generation3MotionStatus = "axis-rotation-active";
    writeReceipts(state.activeGlobeStatus || "visible-target-mounted");
  }

  function startMotionLoop() {
    if (state.intervalId || state.reducedMotion) return;

    state.intervalId = window.setInterval(stepMotion, 1000);
    stepMotion();
  }

  function stopMotionLoop() {
    if (!state.intervalId) return;

    window.clearInterval(state.intervalId);
    state.intervalId = null;
  }

  function start() {
    detectReducedMotion();
    state.started = true;
    state.generation3MotionStatus = state.reducedMotion ? "paused-reduced-motion" : "runtime-started";
    writeReceipts("runtime-started");
    startMotionLoop();

    return getState();
  }

  function setActiveGlobeStatus(status) {
    writeReceipts(status || "visible-target-mounted");
    return getState();
  }

  function setGeneration3MotionStatus(status) {
    state.generation3MotionStatus = status || "axis-rotation-depth-mounted";
    writeReceipts(state.activeGlobeStatus || "visible-target-mounted");
    startMotionLoop();

    return getState();
  }

  function getState() {
    return {
      version: VERSION,
      generation1: state.generation1,
      generation2: state.generation2,
      generation3: state.generation3,
      activeGlobeStatus: state.activeGlobeStatus,
      generation3MotionStatus: state.generation3MotionStatus,
      reducedMotion: state.reducedMotion,
      started: state.started,
      axisTiltDegrees: state.axisTiltDegrees,
      rotationDirection: state.rotationDirection,
      motionTick: state.motionTick,
      rotationPhase: state.rotationPhase
    };
  }

  window.addEventListener("pagehide", stopMotionLoop);

  window.DGBShowroomRuntime = Object.freeze({
    version: VERSION,
    start,
    setActiveGlobeStatus,
    setGeneration3MotionStatus,
    getState
  });
})();
