const DONOR_BINDINGS = Object.freeze({
  C01: Object.freeze({ donor: "MAIN_COMPASS_CONTROLLER", adapter: "TESTS_COMPASS_ENTRY_ADAPTER_v1", path: "assets/compass/compass.controller.js", blob: "83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46" }),
  C02: Object.freeze({ donor: "MAIN_COMPASS_CONTROLLER", adapter: "TESTS_COMPASS_RETURN_ADAPTER_v1", path: "assets/compass/compass.controller.js", blob: "83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46" }),
  C03: Object.freeze({ donor: "MAIN_COMPASS_CONTROLLER", adapter: "TESTS_FIELD_STATE_ADAPTER_v1", path: "assets/compass/compass.controller.js", blob: "83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46" }),
  C04: Object.freeze({ donor: "MAIN_COMPASS_CONTROLLER", adapter: "TESTS_FOCUS_ADAPTER_v1", path: "assets/compass/compass.controller.js", blob: "83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46" }),
  C05: Object.freeze({ donor: "MAIN_COMPASS_CRYSTALS", adapter: "TESTS_NEIGHBOR_PROJECTION_ADAPTER_v1", path: "assets/compass/compass.crystals.js", blob: "3d6427cbdb961576468d4aab05c0e4987549cea3" }),
  C06: Object.freeze({ donor: "LAWS_COMPASS_CONTROLLER", adapter: "TESTS_DEPTH_TRANSFORMATION_ADAPTER_v1", path: "laws/index.controller.js", blob: "e6eef54a8d808c12ea0e5db85539bc521f29f3b2" }),
  C07: Object.freeze({ donor: "MAIN_COMPASS_CRYSTALS", adapter: "TESTS_DIRECT_MANIPULATION_ADAPTER_v1", path: "assets/compass/compass.crystals.js", blob: "3d6427cbdb961576468d4aab05c0e4987549cea3" }),
  C08: Object.freeze({ donor: "MAIN_COMPASS_UPSTREAM_RENDERER", adapter: "TESTS_RESPONSIVE_PROJECTION_ADAPTER_v1", path: "assets/compass/upstream-compass.renderer.js", blob: "965376dd8a92686bc7008d1fea4846b5f8300872" }),
  C09: Object.freeze({ donor: "MAIN_COMPASS_CONTROLLER", adapter: "TESTS_CONTINUITY_STATE_ADAPTER_v1", path: "assets/compass/compass.controller.js", blob: "83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46" })
});

const VALID_DEPTHS = Object.freeze(["L_MINUS_1", "L0", "L1"]);
const STORAGE_KEY = "DGB_TESTS_M1_COMPASS_NAV_v1";

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function freezeSnapshot(value) {
  const copy = clone(value);
  return Object.freeze(copy || {});
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function assertAllowedObject(objectId, allowedObjectIds) {
  if (!allowedObjectIds.includes(objectId)) throw new Error(`UNAUTHORIZED_FOCUS_TARGET:${objectId}`);
  return objectId;
}

export function getApprovedAdapterBindings() {
  return DONOR_BINDINGS;
}

export function createCompassEntryAdapter({ destinationId, priorNavigationSnapshot }) {
  if (destinationId !== "TESTS") throw new Error("UNAUTHORIZED_TESTS_DESTINATION");
  return Object.freeze({
    capabilityId: "C01",
    adapterId: DONOR_BINDINGS.C01.adapter,
    testsEntryContext: Object.freeze({ destinationId: "TESTS", depth: "L_MINUS_1" }),
    returnTarget: freezeSnapshot(priorNavigationSnapshot),
    semanticMutation: false
  });
}

export function createCompassReturnAdapter(entryContext) {
  return Object.freeze({
    capabilityId: "C02",
    adapterId: DONOR_BINDINGS.C02.adapter,
    restore() {
      return freezeSnapshot(entryContext?.returnTarget || {});
    }
  });
}

export function createTestsFieldStateAdapter({ objectIds, initialFocus }) {
  const allowed = Object.freeze([...objectIds]);
  let state = {
    depth: "L_MINUS_1",
    focus: assertAllowedObject(initialFocus, allowed),
    orientationOffset: 0,
    objectIds: [...allowed]
  };
  return Object.freeze({
    capabilityId: "C03",
    adapterId: DONOR_BINDINGS.C03.adapter,
    getState: () => freezeSnapshot(state),
    replace(next) {
      const candidate = { ...state, ...clone(next) };
      if (!VALID_DEPTHS.includes(candidate.depth)) throw new Error(`INVALID_DEPTH:${candidate.depth}`);
      assertAllowedObject(candidate.focus, allowed);
      candidate.orientationOffset = finite(candidate.orientationOffset, 0);
      candidate.objectIds = [...allowed];
      state = candidate;
      return freezeSnapshot(state);
    }
  });
}

export function createTestsFocusAdapter({ fieldState, objectIds }) {
  const allowed = Object.freeze([...objectIds]);
  return Object.freeze({
    capabilityId: "C04",
    adapterId: DONOR_BINDINGS.C04.adapter,
    focus(objectId, modality = "PROGRAMMATIC") {
      const target = assertAllowedObject(objectId, allowed);
      const state = fieldState.replace({ focus: target, orientationOffset: 0 });
      return Object.freeze({ target, modality, state, semanticMutation: false });
    }
  });
}

export function createNeighborProjectionAdapter({ objectIds }) {
  const allowed = Object.freeze([...objectIds]);
  return Object.freeze({
    capabilityId: "C05",
    adapterId: DONOR_BINDINGS.C05.adapter,
    project({ focus, orientationOffset = 0, spread = 1 }) {
      const focusIndex = allowed.indexOf(assertAllowedObject(focus, allowed));
      return allowed.map((objectId, index) => {
        let relative = index - focusIndex + finite(orientationOffset, 0);
        const half = allowed.length / 2;
        while (relative > half) relative -= allowed.length;
        while (relative < -half) relative += allowed.length;
        const angle = relative * 0.92;
        const distance = Math.abs(relative);
        const x = Math.sin(angle) * 400 * spread;
        const z = (Math.cos(angle) - 1) * 320 * spread;
        const y = distance * 42;
        const prominence = clamp(1 - distance * 0.38, 0.50, 1);
        return Object.freeze({ objectId, relative, x, y, z, prominence, active: objectId === focus });
      });
    }
  });
}

export function createDepthTransformationAdapter({ fieldState }) {
  const transitions = Object.freeze({
    L_MINUS_1: Object.freeze(["L0"]),
    L0: Object.freeze(["L_MINUS_1", "L1"]),
    L1: Object.freeze(["L0"])
  });
  return Object.freeze({
    capabilityId: "C06",
    adapterId: DONOR_BINDINGS.C06.adapter,
    requestDepth(nextDepth) {
      const current = fieldState.getState().depth;
      if (!VALID_DEPTHS.includes(nextDepth) || !transitions[current].includes(nextDepth)) {
        throw new Error(`DEPTH_TRANSITION_WITHHELD:${current}->${nextDepth}`);
      }
      return fieldState.replace({ depth: nextDepth });
    }
  });
}

export function createDirectManipulationAdapter({ element, fieldState, objectIds, onFocusProposal, onProposal }) {
  const allowed = Object.freeze([...objectIds]);
  const gesture = { pointerId: null, startX: 0, lastX: 0, startTime: 0, dragging: false, captured: false };
  const deadZone = 6;
  const settleThreshold = 0.18;

  function resetGesture() {
    gesture.pointerId = null;
    gesture.dragging = false;
    gesture.captured = false;
  }

  function cancel() {
    const pointerId = gesture.pointerId;
    resetGesture();
    fieldState.replace({ orientationOffset: 0 });
    onProposal?.(fieldState.getState(), "CANCEL");
    if (pointerId !== null) {
      try { element.releasePointerCapture?.(pointerId); } catch {}
    }
  }

  function onPointerDown(event) {
    if (gesture.pointerId !== null) return;
    gesture.pointerId = event.pointerId;
    gesture.startX = gesture.lastX = event.clientX;
    gesture.startTime = performance.now();
    gesture.dragging = false;
    gesture.captured = false;
  }

  function onPointerMove(event) {
    if (event.pointerId !== gesture.pointerId) return;
    gesture.lastX = event.clientX;
    const delta = gesture.lastX - gesture.startX;
    if (!gesture.dragging && Math.abs(delta) >= deadZone) {
      gesture.dragging = true;
      try {
        element.setPointerCapture?.(event.pointerId);
        gesture.captured = true;
      } catch {}
    }
    if (!gesture.dragging) return;
    const viewport = Math.max(240, element.clientWidth || 1);
    const proposal = clamp(-delta / (viewport * 0.42), -1.25, 1.25);
    const state = fieldState.replace({ orientationOffset: proposal });
    onProposal?.(state, "DRAG");
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (event.pointerId !== gesture.pointerId) return;
    const offset = fieldState.getState().orientationOffset;
    const wasDragging = gesture.dragging;
    const wasCaptured = gesture.captured;
    const pointerId = gesture.pointerId;
    resetGesture();
    if (wasDragging && Math.abs(offset) >= settleThreshold) {
      const currentFocus = fieldState.getState().focus;
      const currentIndex = allowed.indexOf(currentFocus);
      const direction = offset > 0 ? -1 : 1;
      const nextIndex = (currentIndex + direction + allowed.length) % allowed.length;
      onFocusProposal?.(allowed[nextIndex], "DIRECT_MANIPULATION");
    } else {
      fieldState.replace({ orientationOffset: 0 });
      onProposal?.(fieldState.getState(), "SETTLE");
    }
    if (wasCaptured) {
      try { element.releasePointerCapture?.(pointerId); } catch {}
    }
  }

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", cancel);
  element.addEventListener("lostpointercapture", () => { if (gesture.pointerId !== null) cancel(); });
  window.addEventListener("blur", cancel);
  document.addEventListener("visibilitychange", () => { if (document.hidden && gesture.pointerId !== null) cancel(); });

  return Object.freeze({ capabilityId: "C07", adapterId: DONOR_BINDINGS.C07.adapter, cancel });
}

export function createResponsiveProjectionAdapter() {
  return Object.freeze({
    capabilityId: "C08",
    adapterId: DONOR_BINDINGS.C08.adapter,
    measure(viewportElement) {
      const width = Math.max(280, viewportElement.clientWidth || window.innerWidth || 280);
      const height = Math.max(420, viewportElement.clientHeight || window.innerHeight || 420);
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const compact = width < 560;
      const perspective = clamp(Math.round(width * (compact ? 2.65 : 2.15)), 760, 1500);
      const spread = compact ? 0.68 : clamp(width / 760, 0.78, 1.08);
      return Object.freeze({ width, height, dpr, compact, perspective, spread, promotionEligible: true });
    }
  });
}

export function createContinuityStateAdapter({ objectIds }) {
  const allowed = Object.freeze([...objectIds]);
  return Object.freeze({
    capabilityId: "C09",
    adapterId: DONOR_BINDINGS.C09.adapter,
    save(snapshot) {
      const copy = clone(snapshot);
      if (!VALID_DEPTHS.includes(copy.depth)) throw new Error("PERSIST_INVALID_DEPTH");
      assertAllowedObject(copy.focus, allowed);
      copy.objectIds = [...allowed];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
      return freezeSnapshot(copy);
    },
    restore() {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!VALID_DEPTHS.includes(parsed.depth)) return null;
      if (!allowed.includes(parsed.focus)) return null;
      if (JSON.stringify([...(parsed.objectIds || [])].sort()) !== JSON.stringify([...allowed].sort())) return null;
      return freezeSnapshot(parsed);
    },
    clear() { sessionStorage.removeItem(STORAGE_KEY); }
  });
}
