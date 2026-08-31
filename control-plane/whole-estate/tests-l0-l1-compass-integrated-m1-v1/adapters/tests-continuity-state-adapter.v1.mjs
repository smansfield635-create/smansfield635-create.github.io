export const ADAPTER_ID = "TESTS_CONTINUITY_STATE_ADAPTER_v1";
export const CAPABILITY_ID = "C09";

export function snapshotTestsContinuity(state) {
  return Object.freeze({
    activeObject: state.activeObject,
    previewObject: state.previewObject,
    orientation: Object.freeze({ angle: state.orientation.angle, depth: state.orientation.depth }),
    revision: state.revision,
    semanticMutation: false
  });
}

export function restoreTestsContinuity(state, snapshot) {
  if (!snapshot || !state.objectIds.includes(snapshot.activeObject)) throw new Error("C09_CONTINUITY_TARGET_INVALID");
  state.activeObject = snapshot.activeObject;
  state.previewObject = state.objectIds.includes(snapshot.previewObject) ? snapshot.previewObject : snapshot.activeObject;
  state.orientation.angle = Number.isFinite(snapshot.orientation?.angle) ? snapshot.orientation.angle : 0;
  state.orientation.depth = snapshot.orientation?.depth === "L0" ? "L0" : "L1";
  state.revision += 1;
  return Object.freeze({ restored: true, activeObject: state.activeObject, semanticMutation: false });
}
