export const ADAPTER_ID = "TESTS_DIRECT_MANIPULATION_ADAPTER_v1";
export const CAPABILITY_ID = "C07";

export function createTestsManipulationSession(pointerId, x, y, initialAngle) {
  return {
    pointerId,
    startX: x,
    startY: y,
    lastX: x,
    lastY: y,
    initialAngle,
    angle: initialAngle,
    moved: false,
    cancelled: false
  };
}

export function updateTestsManipulation(session, x, y, width) {
  if (session.cancelled) return session;
  const dx = x - session.startX;
  const dy = y - session.startY;
  session.lastX = x;
  session.lastY = y;
  session.moved ||= Math.hypot(dx, dy) >= 7;
  session.angle = session.initialAngle + (dx / Math.max(240, width)) * Math.PI * 1.35;
  return session;
}

export function cancelTestsManipulation(session) {
  session.cancelled = true;
  return Object.freeze({ cancelled: true, semanticMutation: false });
}

export function settleTestsManipulation(session, objectIds, activeObject) {
  if (session.cancelled || !session.moved) {
    return Object.freeze({ angle: session.initialAngle, focusProposal: activeObject, semanticMutation: false });
  }
  const activeIndex = objectIds.indexOf(activeObject);
  const step = (Math.PI * 2) / objectIds.length;
  const shifted = Math.round(session.angle / step);
  const targetIndex = ((activeIndex - shifted) % objectIds.length + objectIds.length) % objectIds.length;
  return Object.freeze({ angle: 0, focusProposal: objectIds[targetIndex], semanticMutation: false });
}
