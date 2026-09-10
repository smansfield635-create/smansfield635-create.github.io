export const ADAPTER_ID = "TESTS_NEIGHBOR_PROJECTION_ADAPTER_v1";
export const CAPABILITY_ID = "C05";

function wrapDelta(value) {
  let delta = value;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function projectTestsNeighbors(objectIds, activeObject, orientationAngle, viewport) {
  const activeIndex = objectIds.indexOf(activeObject);
  if (activeIndex < 0) throw new Error("C05_ACTIVE_OBJECT_INVALID");
  const radiusX = viewport.radiusX;
  const radiusY = viewport.radiusY;
  return objectIds.map((id, index) => {
    const canonical = ((index - activeIndex) * Math.PI * 2) / objectIds.length;
    const angle = wrapDelta(canonical + orientationAngle);
    const front = (Math.cos(angle) + 1) / 2;
    const x = viewport.cx + Math.sin(angle) * radiusX;
    const y = viewport.cy + (1 - front) * radiusY - radiusY * 0.35;
    const scale = id === activeObject ? 1.16 : 0.78 + front * 0.12;
    const opacity = id === activeObject ? 1 : 0.58 + front * 0.22;
    return Object.freeze({ id, x, y, front, scale, opacity, semanticWeight: null });
  });
}
