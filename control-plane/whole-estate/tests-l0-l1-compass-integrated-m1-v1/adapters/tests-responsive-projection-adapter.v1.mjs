export const ADAPTER_ID = "TESTS_RESPONSIVE_PROJECTION_ADAPTER_v1";
export const CAPABILITY_ID = "C08";

export function calculateTestsProjection(width, height, depth) {
  const safeWidth = Math.max(280, Number(width) || 0);
  const safeHeight = Math.max(360, Number(height) || 0);
  const compact = safeWidth < 620;
  const depthFactor = depth === "L0" ? 0.82 : 1;
  return Object.freeze({
    width: safeWidth,
    height: safeHeight,
    cx: safeWidth / 2,
    cy: safeHeight * (compact ? 0.48 : 0.5),
    radiusX: Math.min(safeWidth * (compact ? 0.34 : 0.39), 420) * depthFactor,
    radiusY: Math.min(safeHeight * (compact ? 0.28 : 0.31), 220) * depthFactor,
    nodeWidth: Math.min(compact ? safeWidth * 0.43 : safeWidth * 0.29, 300),
    compact,
    semanticMutation: false
  });
}
