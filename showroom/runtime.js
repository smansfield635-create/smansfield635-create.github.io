/*
  /showroom/runtime.js
  SHOWROOM_RUNTIME_STATUS_CONTRACT_CLEANUP_TNT_v1

  Purpose:
  - Keep runtime as state/receipt authority only.
  - Remove old active-looking Gen 1 / Gen 2 runtime language.
  - Align runtime receipts to the current no-orbital-scaffold Gen 3 object.
  - Preserve motionTick, rotationPhase, axis tilt, and CSS variables.
  - Preserve public API used by parent Showroom boot.

  Owns:
  - runtime state
  - runtime receipts
  - motion tick
  - rotation phase
  - CSS runtime variables

  Does not own:
  - DOM replacement
  - page layout
  - globe rendering
  - orbit/ring/scaffold emission
  - Earth image assets
  - Showroom copy
  - Gauges logic
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-runtime-status-contract-cleanup-v1";

  const AXIS_TILT_DEGREES = 23.5;
  const ROTATION_STEP_DEGREES = 6;
  const TICK_MS = 1000;

  const state = {
    generation1: "receipt-only-no-orbital-scaffold",
    generation2: "receipt-only-baseline-graphics",
    generation3: "context-isolated-no-orbital-scaffold-runtime",
    activeGlobeStatus: "pending",
    generation3MotionStatus: "pending",
    reducedMotion: false,
    started: false,
    axisTiltDegrees: AXIS_TILT_DEGREES,
    rotationDirection: "east-west",
    motionTick: 0,
    rotationPhase: 0,
    intervalId: null
  };

  function detectReducedMotion() {
    state.reducedMotion =
      Boolean(window.matchMedia) &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return state.reducedMotion;
  }

  function normalizeStatus(status, fallback) {
    const value = String(status || fallback || "active");

    if (
      value.indexOf("axis-rotation-depth") !== -1 ||
      value.indexOf("generation-2") !== -1 ||
      value.indexOf("active-globe-visible") !== -1
    ) {
      return "generation-3-no-orbital-scaffold-active";
    }

    if (value.indexOf("context-isolated") !== -1) return value;
    if (value.indexOf("no-orbital-scaffold") !== -1) return value;

    return value;
  }

  function nodes() {
    return [
      document.getElementById("showroom-root"),
      document.getElementById("showroom-main"),
      document.getElementById("showroom-globe-mount")
    ].filter(Boolean);
  }

  function setDataset(node, values) {
    if (!node) return;

    Object.entries(values || {}).forEach(function (entry) {
      node.dataset[entry[0]] = String(entry[1]);
    });
  }

  function writeRuntimeDataset(node) {
    setDataset(node, {
      showroomRuntime: VERSION,
      runtimeOwns: "state-and-receipts-only",
      runtimeDomReplacement: "false",
      runtimePageLayout: "false",
      runtimeVisualScaffold: "false",
      runtimeRingScaffold: "false",

      generation1NoGraphicBaseline: "receipt-only",
      generation1RingScaffold: "removed",
      generation1OrbitalScaffold: "removed",

      generation2BaselineGraphics: "receipt-only",
      generation2ActiveGlobe: "receipt-only",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "not-owned-by-runtime",

      generation3: state.generation3,
      generation3RuntimeMotion: state.generation3MotionStatus,
      generation3AxisRotation: "active",
      generation3AxisTiltDegrees: String(state.axisTiltDegrees),
      generation3RotationDirection: state.rotationDirection,
      generation3MotionTick: String(state.motionTick),
      generation3RotationPhase: String(state.rotationPhase),
      generation3RingScaffold: "removed",
      generation3OrbitalScaffold: "removed",
      generation3ContextIsolation: "active",

      activeGlobeStatus: state.activeGlobeStatus,
      reducedMotion: String(state.reducedMotion),
      runtimeStatusContract: "cleaned",
      runtimeCompatibility: "parent-showroom"
    });
  }

  function writeCssVariables() {
    const root = document.documentElement;
    if (!root || !root.style) return;

    root.style.setProperty("--showroom-runtime-phase", String(state.rotationPhase));
    root.style.setProperty("--showroom-axis-tilt", String(state.axisTiltDegrees) + "deg");
  }

  function writeAll() {
    detectReducedMotion();

    nodes().forEach(writeRuntimeDataset);
    writeCssVariables();
  }

  function tick() {
    state.motionTick += 1;

    if (!state.reducedMotion) {
      state.rotationPhase = (state.rotationPhase + ROTATION_STEP_DEGREES) % 360;
    }

    writeAll();
  }

  function start() {
    if (state.started) {
      writeAll();
      return getState();
    }

    detectReducedMotion();

    state.started = true;
    state.activeGlobeStatus = normalizeStatus(
      state.activeGlobeStatus,
      "generation-3-no-orbital-scaffold-mounted"
    );
    state.generation3MotionStatus = normalizeStatus(
      state.generation3MotionStatus,
      "generation-3-no-orbital-scaffold-motion-active"
    );

    writeAll();

    if (state.intervalId) {
      window.clearInterval(state.intervalId);
    }

    state.intervalId = window.setInterval(tick, TICK_MS);

    return getState();
  }

  function stop() {
    if (state.intervalId) {
      window.clearInterval(state.intervalId);
      state.intervalId = null;
    }

    state.started = false;
    writeAll();

    return getState();
  }

  function setActiveGlobeStatus(status) {
    state.activeGlobeStatus = normalizeStatus(
      status,
      "generation-3-no-orbital-scaffold-mounted"
    );

    writeAll();

    return getState();
  }

  function setGeneration3MotionStatus(status) {
    state.generation3MotionStatus = normalizeStatus(
      status,
      "generation-3-no-orbital-scaffold-motion-active"
    );

    writeAll();

    return getState();
  }

  function setRotationPhase(phase) {
    const parsed = Number(phase);

    if (Number.isFinite(parsed)) {
      state.rotationPhase = ((parsed % 360) + 360) % 360;
      writeAll();
    }

    return getState();
  }

  function resetRuntimeView() {
    state.motionTick = 0;
    state.rotationPhase = 0;
    state.activeGlobeStatus = "generation-3-no-orbital-scaffold-mounted";
    state.generation3MotionStatus = "generation-3-no-orbital-scaffold-motion-active";

    writeAll();

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
      rotationPhase: state.rotationPhase,
      ownsDomReplacement: false,
      ownsPageLayout: false,
      ownsVisualScaffold: false,
      ringScaffoldStatus: "removed",
      statusContract: "cleaned"
    };
  }

  window.DGBShowroomRuntime = Object.freeze({
    version: VERSION,
    start: start,
    stop: stop,
    getState: getState,
    setActiveGlobeStatus: setActiveGlobeStatus,
    setGeneration3MotionStatus: setGeneration3MotionStatus,
    setRotationPhase: setRotationPhase,
    resetRuntimeView: resetRuntimeView,
    writeAll: writeAll
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
