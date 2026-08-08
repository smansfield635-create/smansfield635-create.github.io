export const ADAPTER_ID = "TESTS_COMPASS_RETURN_ADAPTER_v1";
export const CAPABILITY_ID = "C02";

export function restoreTestsPriorContext(snapshot, validObjectIds) {
  if (!snapshot || snapshot.projection !== "METHODS") throw new Error("C02_RETURN_SNAPSHOT_INVALID");
  if (!validObjectIds.includes(snapshot.activeObject)) throw new Error("C02_RETURN_TARGET_INVALID");
  return Object.freeze({
    projection: "METHODS",
    activeObject: snapshot.activeObject,
    orientation: Object.freeze({
      angle: Number.isFinite(snapshot.orientation?.angle) ? snapshot.orientation.angle : 0,
      depth: snapshot.orientation?.depth === "L0" ? "L0" : "L1"
    }),
    semanticMutation: false
  });
}
