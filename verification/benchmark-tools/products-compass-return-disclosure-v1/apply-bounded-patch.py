from pathlib import Path
import hashlib
import json

ROOT = Path.cwd()
CONTROLLER = ROOT / "products/index.controller.js"
CRYSTALS = ROOT / "products/index.crystals.js"

EXPECTED_CONTROLLER_BLOB = "3bf31e29f6743a8660b12a30c5fb56d087ca3199"
EXPECTED_CRYSTALS_BLOB = "db6889500dccab53365a564feb1aa96f34b4200d"


def git_blob_sha(text: str) -> str:
    data = text.encode("utf-8")
    return hashlib.sha1(f"blob {len(data)}\0".encode("utf-8") + data).hexdigest()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}:EXPECTED_ONE_ANCHOR:OBSERVED_{count}")
    return text.replace(old, new, 1)


controller = CONTROLLER.read_text(encoding="utf-8")
crystals = CRYSTALS.read_text(encoding="utf-8")
controller_before = git_blob_sha(controller)
crystals_before = git_blob_sha(crystals)

controller_markers = [
    'setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.PRODUCT_SELECTED',
    'setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.CLUSTER_OPEN',
]
crystals_markers = [
    'CENTER_CONTROL: "CENTER_CONTROL"',
    'function centerControlAtPoint(clientX, clientY)',
    'function requestControllerCompassSelection()',
    'pointer.gestureScope === "center"',
    '"[data-products-center-control]",\n      "[data-products-enter]"',
]

already_patched = (
    all(marker in controller for marker in controller_markers)
    and all(marker in crystals for marker in crystals_markers)
)

if not already_patched:
    if controller_before != EXPECTED_CONTROLLER_BLOB:
        raise RuntimeError(
            f"CONTROLLER_BLOB_DRIFT:EXPECTED_{EXPECTED_CONTROLLER_BLOB}:OBSERVED_{controller_before}"
        )
    if crystals_before != EXPECTED_CRYSTALS_BLOB:
        raise RuntimeError(
            f"CRYSTALS_BLOB_DRIFT:EXPECTED_{EXPECTED_CRYSTALS_BLOB}:OBSERVED_{crystals_before}"
        )

    controller = replace_once(
        controller,
        '''    clearViewportSchedules();

    const transaction = beginAtomicTransition({
      state: STATES.PRODUCT_SELECTED,''',
        '''    clearViewportSchedules();
    setCenterDisclosure(false);

    const transaction = beginAtomicTransition({
      state: STATES.PRODUCT_SELECTED,''',
        "CONTROLLER_PRODUCT_SELECTION_DISCLOSURE_CLOSE",
    )

    controller = replace_once(
        controller,
        '''  function requestReturnToOrbit() {
    if (state.current !== STATES.PRODUCT_SELECTED) {
      return false;
    }

    clearViewportSchedules();

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,''',
        '''  function requestReturnToOrbit() {
    if (state.current !== STATES.PRODUCT_SELECTED) {
      return false;
    }

    clearViewportSchedules();
    setCenterDisclosure(false);

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,''',
        "CONTROLLER_RETURN_TO_ORBIT_DISCLOSURE_CLOSE",
    )

    crystals = replace_once(
        crystals,
        '''  const POINTER_TERRITORIES = Object.freeze({
    BLOCKED_CONTROL: "BLOCKED_CONTROL",''',
        '''  const POINTER_TERRITORIES = Object.freeze({
    CENTER_CONTROL: "CENTER_CONTROL",
    BLOCKED_CONTROL: "BLOCKED_CONTROL",''',
        "CRYSTALS_CENTER_TERRITORY",
    )

    crystals = replace_once(
        crystals,
        '''  const GESTURE_TYPES = Object.freeze({
    POINTER_DOWN: "pointerdown",
    TAP: "tap",''',
        '''  const GESTURE_TYPES = Object.freeze({
    POINTER_DOWN: "pointerdown",
    CENTER_TAP: "center-tap",
    TAP: "tap",''',
        "CRYSTALS_CENTER_GESTURE",
    )

    crystals = replace_once(
        crystals,
        '''    return target.closest([
      "[data-products-enter]",''',
        '''    return target.closest([
      "[data-products-center-control]",
      "[data-products-enter]",''',
        "CRYSTALS_CENTER_CONTROL_BLOCKED_SELECTOR",
    )

    crystals = replace_once(
        crystals,
        '''  function classifyPointerTerritory(event) {
    const rect = state.scene.getBoundingClientRect();''',
        '''  function centerControlAtPoint(clientX, clientY) {
    const control = state.root
      ? state.root.querySelector("[data-products-center-control]")
      : null;

    if (
      !control ||
      control.hidden ||
      control.disabled ||
      control.getAttribute("aria-hidden") === "true"
    ) {
      return null;
    }

    const rect = control.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    return inside ? control : null;
  }

  function classifyPointerTerritory(event) {
    const rect = state.scene.getBoundingClientRect();''',
        "CRYSTALS_CENTER_COORDINATE_HELPER",
    )

    crystals = replace_once(
        crystals,
        '''    if (!inside) {
      return {
        territory: POINTER_TERRITORIES.OUTSIDE_SCENE,
        nodeId: ""
      };
    }

    if (blockedSemanticControl(event.target)) {''',
        '''    if (!inside) {
      return {
        territory: POINTER_TERRITORIES.OUTSIDE_SCENE,
        nodeId: ""
      };
    }

    if (centerControlAtPoint(event.clientX, event.clientY)) {
      return {
        territory: POINTER_TERRITORIES.CENTER_CONTROL,
        nodeId: ""
      };
    }

    if (blockedSemanticControl(event.target)) {''',
        "CRYSTALS_CENTER_COORDINATE_PRIORITY",
    )

    crystals = replace_once(
        crystals,
        '''  function requestNodeSelection(node, territory) {
    const api = globalThis[CONTROLLER_SYMBOL];''',
        '''  function requestControllerCompassSelection() {
    const api = globalThis[CONTROLLER_SYMBOL];

    return Boolean(
      api &&
      typeof api.requestCompassSelection === "function" &&
      api.requestCompassSelection() !== false
    );
  }

  function requestNodeSelection(node, territory) {
    const api = globalThis[CONTROLLER_SYMBOL];''',
        "CRYSTALS_CENTER_CONTROLLER_BRIDGE",
    )

    crystals = replace_once(
        crystals,
        '''    if (
      classification.territory === POINTER_TERRITORIES.OUTSIDE_SCENE ||
      classification.territory === POINTER_TERRITORIES.BLOCKED_CONTROL
    ) {
      emitReceipt({
        lastPointerTerritory: classification.territory,
        lastGestureType: GESTURE_TYPES.BLOCKED
      });
      return;
    }

    const frameState = state.frame ? state.frame.state : "";''',
        '''    if (
      classification.territory === POINTER_TERRITORIES.OUTSIDE_SCENE ||
      classification.territory === POINTER_TERRITORIES.BLOCKED_CONTROL
    ) {
      emitReceipt({
        lastPointerTerritory: classification.territory,
        lastGestureType: GESTURE_TYPES.BLOCKED
      });
      return;
    }

    if (classification.territory === POINTER_TERRITORIES.CENTER_CONTROL) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (_) {}

      const now = performance.now();
      const startQuaternion = state.clusterQuaternion.slice();

      state.pointer = {
        id: event.pointerId,
        pointerType: event.pointerType || "unknown",
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        startTime: now,
        territory: classification.territory,
        nodeId: "",
        gestureScope: "center",
        dragging: false,
        controllerGestureBegan: false,
        startQuaternion,
        currentQuaternion: startQuaternion.slice(),
        samples: [{
          x: event.clientX,
          y: event.clientY,
          time: now
        }]
      };

      event.preventDefault();
      event.stopPropagation();

      emitReceipt({
        lastPointerTerritory: classification.territory,
        lastGestureType: GESTURE_TYPES.POINTER_DOWN
      });
      return;
    }

    const frameState = state.frame ? state.frame.state : "";''',
        "CRYSTALS_CENTER_POINTER_DOWN",
    )

    crystals = replace_once(
        crystals,
        '''    const distance = pointerDistance(pointer, event.clientX, event.clientY);

    if (!pointer.dragging && distance < GESTURE.dragDeadZonePx) {''',
        '''    const distance = pointerDistance(pointer, event.clientX, event.clientY);

    if (pointer.gestureScope === "center") {
      if (distance >= GESTURE.dragDeadZonePx) {
        pointer.dragging = true;
      }
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!pointer.dragging && distance < GESTURE.dragDeadZonePx) {''',
        "CRYSTALS_CENTER_POINTER_MOVE",
    )

    crystals = replace_once(
        crystals,
        '''    state.pointer = null;

    releasePointerCapture(event);
    clearGestureDatasets();

    if (pointer.dragging && pointer.gestureScope === "orbit") {''',
        '''    state.pointer = null;

    releasePointerCapture(event);
    clearGestureDatasets();

    if (pointer.gestureScope === "center") {
      state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs;
      state.semanticPointerBlockedUntil = state.suppressClickUntil;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const activated =
        !pointer.dragging &&
        metrics.distance <= GESTURE.maximumTapDistancePx &&
        requestControllerCompassSelection();

      emitReceipt({
        status: activated ? "available" : "available",
        lastPointerTerritory: pointer.territory,
        lastGestureType: activated
          ? GESTURE_TYPES.CENTER_TAP
          : GESTURE_TYPES.CANCELLED,
        lastGestureDistance: metrics.distance,
        lastGestureDurationMs: metrics.durationMs,
        gestureActive: false,
        glError: activated ? "NO_ERROR" : "CENTER_TAP_CANCELLED"
      });
      return;
    }

    if (pointer.dragging && pointer.gestureScope === "orbit") {''',
        "CRYSTALS_CENTER_POINTER_UP",
    )

    crystals = replace_once(
        crystals,
        '''    state.pointer = null;

    releasePointerCapture(event);

    if (pointer.controllerGestureBegan) {''',
        '''    state.pointer = null;

    releasePointerCapture(event);

    if (pointer.gestureScope === "center") {
      clearGestureDatasets();
      emitReceipt({
        lastPointerTerritory: pointer.territory,
        lastGestureType: GESTURE_TYPES.CANCELLED,
        gestureActive: false
      });
      return;
    }

    if (pointer.controllerGestureBegan) {''',
        "CRYSTALS_CENTER_POINTER_CANCEL",
    )

    CONTROLLER.write_text(controller, encoding="utf-8")
    CRYSTALS.write_text(crystals, encoding="utf-8")

controller_after = git_blob_sha(CONTROLLER.read_text(encoding="utf-8"))
crystals_after = git_blob_sha(CRYSTALS.read_text(encoding="utf-8"))

receipt = {
    "tool": "PRODUCTS_COMPASS_RETURN_DISCLOSURE_PATCH_v1",
    "status": "ALREADY_PATCHED" if already_patched else "PATCH_APPLIED",
    "controller": {
        "before": controller_before,
        "after": controller_after,
        "productSelectionClosesDisclosure": True,
        "returnToOrbitClosesDisclosure": True,
    },
    "crystals": {
        "before": crystals_before,
        "after": crystals_after,
        "centerCoordinateAuthority": True,
        "centerTapDragArbitration": True,
        "centerCallsExistingController": True,
        "syntheticClickSuppressed": True,
    },
    "prohibitedChanges": {
        "css": False,
        "compositor": False,
        "planet": False,
        "geometry": False,
        "routes": False,
    },
}
print(json.dumps(receipt, indent=2))
