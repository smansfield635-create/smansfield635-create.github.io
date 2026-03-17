// TNT — /world/completion_engine.js
// PURPOSE: track progression, unlock zones, enforce mastery

export function createCompletionEngine() {

  function computeSummitCompletion(planetField) {
    if (!planetField?.samples) return 0;

    let completed = 0;
    let total = 0;

    for (const row of planetField.samples) {
      for (const s of row) {
        if (s?.stateCode !== undefined) {
          total++;
          if (s.stateCode !== 0) completed++;
        }
      }
    }

    return total > 0 ? completed / total : 0;
  }

  function computeConfusionLoad(planetField) {
    if (!planetField?.samples) return 0;

    let confusion = 0;

    for (const row of planetField.samples) {
      for (const s of row) {
        if (s?.eventFlags?.includes?.("CONFUSION")) {
          confusion++;
        }
      }
    }

    return confusion;
  }

  function update(runtime) {
    const summitCompletion = computeSummitCompletion(runtime.planetField);
    const confusionLoad = computeConfusionLoad(runtime.planetField);

    runtime.progress = {
      summitCompletion,
      confusionLoad,
      masteryPass: summitCompletion > 0.92 && confusionLoad === 0
    };

    runtime.unlocks = {
      underground: summitCompletion > 0.45,
      north: summitCompletion > 0.92 && confusionLoad === 0,
      south: summitCompletion > 0.92 && confusionLoad < 50
    };
  }

  return Object.freeze({
    update
  });
}
