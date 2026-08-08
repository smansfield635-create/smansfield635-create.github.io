export const ADAPTER_ID = "TESTS_FIELD_STATE_ADAPTER_v1";
export const CAPABILITY_ID = "C03";

export function createTestsFieldState(objectIds, activeObject) {
  if (!Array.isArray(objectIds) || objectIds.length !== 3) throw new Error("C03_OBJECT_SET_INVALID");
  if (!objectIds.includes(activeObject)) throw new Error("C03_ACTIVE_OBJECT_INVALID");
  return {
    objectIds: Object.freeze([...objectIds]),
    activeObject,
    previewObject: activeObject,
    orientation: { angle: 0, depth: "L1" },
    revision: 0
  };
}

export function cloneTestsFieldState(state) {
  return Object.freeze({
    objectIds: Object.freeze([...state.objectIds]),
    activeObject: state.activeObject,
    previewObject: state.previewObject,
    orientation: Object.freeze({ angle: state.orientation.angle, depth: state.orientation.depth }),
    revision: state.revision
  });
}
