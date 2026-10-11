export const ADAPTER_ID = "TESTS_FOCUS_ADAPTER_v1";
export const CAPABILITY_ID = "C04";

export function proposeTestsFocus(state, target, mode = "COMMIT") {
  if (!state.objectIds.includes(target)) throw new Error(`C04_FOCUS_TARGET_INVALID:${target}`);
  if (!new Set(["PREVIEW", "COMMIT"]).has(mode)) throw new Error("C04_FOCUS_MODE_INVALID");
  if (mode === "PREVIEW") {
    state.previewObject = target;
  } else {
    state.activeObject = target;
    state.previewObject = target;
    state.revision += 1;
  }
  return Object.freeze({
    operation: "FOCUS",
    target,
    mode,
    navigationRevision: state.revision,
    semanticMutation: false
  });
}
