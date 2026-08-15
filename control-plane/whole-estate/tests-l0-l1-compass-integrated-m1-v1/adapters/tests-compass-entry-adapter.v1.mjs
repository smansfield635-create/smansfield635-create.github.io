export const ADAPTER_ID = "TESTS_COMPASS_ENTRY_ADAPTER_v1";
export const CAPABILITY_ID = "C01";

function copyOrientation(value) {
  return Object.freeze({
    angle: Number.isFinite(value?.angle) ? value.angle : 0,
    depth: value?.depth === "L0" ? "L0" : "L1"
  });
}

export function preserveTestsEntryContext(state) {
  if (!state || state.projection !== "METHODS") throw new Error("C01_ENTRY_PROJECTION_INVALID");
  return Object.freeze({
    projection: "METHODS",
    activeObject: String(state.activeObject || ""),
    orientation: copyOrientation(state.orientation),
    source: "TESTS_NAVIGATION_CONTEXT",
    semanticMutation: false
  });
}

export function bindTestsEntry(snapshot, validObjectIds) {
  if (!snapshot || snapshot.projection !== "METHODS") throw new Error("C01_ENTRY_SNAPSHOT_INVALID");
  if (!validObjectIds.includes(snapshot.activeObject)) throw new Error("C01_ENTRY_TARGET_INVALID");
  return Object.freeze({
    projection: "METHODS",
    activeObject: snapshot.activeObject,
    orientation: copyOrientation(snapshot.orientation),
    semanticMutation: false
  });
}
