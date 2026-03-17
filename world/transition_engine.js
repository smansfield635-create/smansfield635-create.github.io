// TNT — /world/transition_engine.js
// PURPOSE: deterministic zone transitions (NO UI drift)

export function createTransitionEngine() {

  function canTransition(runtime, targetZone) {
    if (runtime.zone?.transitioning) return false;

    if (targetZone === "underground") return runtime.unlocks?.underground;
    if (targetZone === "north") return runtime.unlocks?.north;
    if (targetZone === "south") return runtime.unlocks?.south;

    return true;
  }

  function requestTransition(runtime, targetZone) {
    if (!canTransition(runtime, targetZone)) {
      runtime.failure = {
        phase: "transition_blocked",
        message: "Transition not admissible"
      };
      return false;
    }

    runtime.zone = runtime.zone || {};
    runtime.zone.transitioning = true;
    runtime.zone.targetZone = targetZone;

    return true;
  }

  function step(runtime) {
    if (!runtime.zone?.transitioning) return;

    // simple deterministic step (no animation yet)
    runtime.zone.currentZone = runtime.zone.targetZone;
    runtime.zone.targetZone = null;
    runtime.zone.transitioning = false;
  }

  return Object.freeze({
    requestTransition,
    step
  });
}
