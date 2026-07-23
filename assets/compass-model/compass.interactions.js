import { POINTER_KIND, assertContract } from "./compass.contracts.js";
import {
  cameraBasis,
  fixedBasisIncrement,
  multiplyQuaternion,
  normalizeQuaternion
} from "./compass.math.js";

export function createInteractionAuthority({ profile, controller, compositor }) {
  let active = null;
  const smoothingFor = kind =>
    profile.interactions.smoothing[kind] ??
    profile.interactions.smoothing[POINTER_KIND.MOUSE];

  function begin(pointer) {
    assertContract(!active, "COMPASS_POINTER_ALREADY_ACTIVE");
    active = {
      id: pointer.id,
      kind: pointer.kind,
      x: pointer.x,
      y: pointer.y,
      filteredDx: 0,
      filteredDy: 0,
      targetId: pointer.targetId || ""
    };
    controller.beginGesture();
    return Object.freeze({ accepted: true, pointerId: pointer.id });
  }

  function move(pointer) {
    if (!active || active.id !== pointer.id) {
      return Object.freeze({ accepted: false });
    }
    const alpha = smoothingFor(active.kind);
    const dx = pointer.x - active.x;
    const dy = pointer.y - active.y;
    active.filteredDx = active.filteredDx * (1 - alpha) + dx * alpha;
    active.filteredDy = active.filteredDy * (1 - alpha) + dy * alpha;
    active.x = pointer.x;
    active.y = pointer.y;

    const camera = compositor.getCamera();
    const basis = camera ? cameraBasis(camera) : { right: [1, 0, 0] };
    const state = controller.getState();
    const delta = fixedBasisIncrement({
      dx: active.filteredDx,
      dy: active.filteredDy,
      rightAxis: basis.right,
      radiansPerPixel: profile.interactions.radiansPerPixel,
      maximumAngle: profile.interactions.maximumIncrementalAngle
    });
    const quaternion = normalizeQuaternion(
      multiplyQuaternion(delta, state.orientation)
    );
    const primaryId = compositor.inferPrimary(
      quaternion,
      state.presentation
    );
    controller.preview({ quaternion, primaryId });
    return Object.freeze({
      accepted: true,
      quaternion: Object.freeze(quaternion),
      primaryId
    });
  }

  function end(pointer, { cancel = false } = {}) {
    if (!active || active.id !== pointer.id) {
      return Object.freeze({ accepted: false });
    }
    const completed = active;
    active = null;
    cancel ? controller.cancel("pointer-end") : controller.commit();
    return Object.freeze({
      accepted: true,
      cancelled: cancel,
      targetId: completed.targetId
    });
  }

  return Object.freeze({
    begin,
    move,
    end,
    interrupt(reason) {
      if (active) {
        controller.cancel(reason);
        active = null;
      }
    },
    getActive: () => active ? Object.freeze({ ...active }) : null
  });
}
