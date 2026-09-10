export const ADAPTER_ID = "TESTS_DEPTH_TRANSFORMATION_ADAPTER_v1";
export const CAPABILITY_ID = "C06";

const ALLOWED = new Set(["L0", "L1"]);

export function transitionTestsDepth(state, nextDepth) {
  if (!ALLOWED.has(nextDepth)) throw new Error(`C06_DEPTH_INVALID:${nextDepth}`);
  const previous = state.orientation.depth;
  state.orientation.depth = nextDepth;
  state.revision += previous === nextDepth ? 0 : 1;
  return Object.freeze({
    previous,
    next: nextDepth,
    preservedActiveObject: state.activeObject,
    preservedAngle: state.orientation.angle,
    semanticMutation: false
  });
}
