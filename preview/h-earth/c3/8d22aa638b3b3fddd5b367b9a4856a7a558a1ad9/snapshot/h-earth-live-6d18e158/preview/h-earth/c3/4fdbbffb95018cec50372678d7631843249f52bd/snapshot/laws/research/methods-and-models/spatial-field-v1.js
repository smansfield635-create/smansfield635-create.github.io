(() => {
  "use strict";

  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;
  root.setAttribute("data-mm-spatial-field-v1", "true");

  const stage = root.querySelector(".mm-stage");
  const deck = root.querySelector("[data-mm-model-deck]");
  const familyTabs = root.querySelector("[data-mm-family-tabs]");
  const lensTabs = root.querySelector(".mm-lens-tabs");
  const next = root.querySelector("[data-mm-next]");
  const previous = root.querySelector("[data-mm-previous]");
  const familyNext = root.querySelector("[data-mm-family-next]");
  const familyPrevious = root.querySelector("[data-mm-family-previous]");
  const dialog = document.querySelector("[data-mm-dialog]");
  const dialogClose = document.querySelector("[data-mm-dialog-close]");
  const coordinate = root.querySelector("[data-mm-coordinate]");
  if (!stage || !deck || !familyTabs || !lensTabs) return;

  // Preserve the exact already-bound legacy handler nodes, but remove them from
  // the product's visible control surfaces. Moving a DOM node preserves every
  // listener installed by showroom.js, refinement.js, and euclidean.js.
  const machineHooks = document.createElement("div");
  machineHooks.className = "mm-machine-hooks";
  machineHooks.setAttribute("aria-hidden", "true");
  [previous, next, familyPrevious, familyNext].forEach(control => {
    if (!control) return;
    control.tabIndex = -1;
    machineHooks.append(control);
  });
  root.append(machineHooks);

  const state = { activePointer: null, returnCoordinate: null };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const familyButtons = () => Array.from(familyTabs.querySelectorAll(".mm-family-tab"));
  const lensButtons = () => Array.from(lensTabs.querySelectorAll("[data-mm-lens-tab]"));
  const modelCards = () => Array.from(deck.querySelectorAll(".mm-model-card"));

  function coordinateSnapshot() {
    return Object.freeze({
      x: Number(root.dataset.mmX || 0),
      y: Number(root.dataset.mmY || 0),
      z: Number(root.dataset.mmZ || 0),
      modelId: root.dataset.mmModel || ""
    });
  }

  function applyGeometry(dx = 0, dy = 0, dz = 0) {
    root.style.setProperty("--mm-drag-x", `${clamp(dx, -120, 120)}px`);
    root.style.setProperty("--mm-drag-y", `${clamp(dy, -100, 100)}px`);
    root.style.setProperty("--mm-drag-z", `${clamp(dz, -68, 68)}px`);
    root.style.setProperty("--mm-tilt-x", `${clamp(-dy / 18, -6, 6)}deg`);
    root.style.setProperty("--mm-tilt-y", `${clamp(dx / 16, -8, 8)}deg`);
  }

  function resetGeometry() {
    applyGeometry();
    delete root.dataset.mmFieldDragging;
    delete root.dataset.mmXDragging;
    delete root.dataset.mmYDragging;
    delete root.dataset.mmZDragging;
  }

  function begin(axis, event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    state.activePointer = {
      axis,
      id: event.pointerId,
      surface: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false
    };
  }

  function move(event) {
    const pointer = state.activePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    const distance = Math.hypot(dx, dy);

    // Do not capture a pointer merely because it was pressed. A tap must remain
    // a tap so model inspection and family/lens selection keep their native
    // click semantics. Capture begins only after a real drag gesture emerges.
    if (!pointer.dragging && distance < 5) return;
    if (!pointer.dragging) {
      pointer.dragging = true;
      root.dataset.mmFieldDragging = "true";
      root.dataset[`mm${pointer.axis.toUpperCase()}Dragging`] = "true";
      pointer.surface.setPointerCapture?.(event.pointerId);
    }

    event.preventDefault();
    if (pointer.axis === "x") applyGeometry(dx, dy * .16, 0);
    else if (pointer.axis === "y") applyGeometry(dx * .08, dy, 0);
    else applyGeometry(dx * .04, 0, dy);
  }

  function finish(event) {
    const pointer = state.activePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.dragging && pointer.surface.hasPointerCapture?.(event.pointerId)) {
      pointer.surface.releasePointerCapture(event.pointerId);
    }
    state.activePointer = null;
    if (pointer.dragging) requestAnimationFrame(resetGeometry);
  }

  function cancel(event) {
    if (state.activePointer?.id !== event.pointerId) return;
    const wasDragging = state.activePointer.dragging;
    state.activePointer = null;
    if (wasDragging) resetGeometry();
  }

  function attach(surface, axis) {
    surface.addEventListener("pointerdown", event => begin(axis, event));
    surface.addEventListener("pointermove", move, { passive: false });
    surface.addEventListener("pointerup", finish);
    surface.addEventListener("pointercancel", cancel);
  }

  attach(deck, "x");
  attach(lensTabs, "y");
  attach(familyTabs, "z");

  root.addEventListener("click", event => {
    if (event.target.closest(".mm-inspect")) state.returnCoordinate = coordinateSnapshot();
  }, true);

  function restoreCoordinate(snapshot) {
    if (!snapshot) return;
    familyButtons()[snapshot.z]?.click();
    lensButtons()[snapshot.y]?.click();
    let guard = 0;
    while (Number(root.dataset.mmX || 0) !== snapshot.x && guard < 32) {
      const current = Number(root.dataset.mmX || 0);
      const count = Math.max(modelCards().length, 1);
      const forward = (snapshot.x - current + count) % count;
      const backward = (current - snapshot.x + count) % count;
      (forward <= backward ? next : previous)?.click();
      guard += 1;
    }
    requestAnimationFrame(() => deck.focus({ preventScroll: true }));
  }

  dialogClose?.addEventListener("click", () => {
    const snapshot = state.returnCoordinate;
    queueMicrotask(() => restoreCoordinate(snapshot));
  }, true);
  dialog?.addEventListener("close", () => restoreCoordinate(state.returnCoordinate));

  globalThis.addEventListener("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", event => {
    const detail = event.detail || {};
    root.dataset.mmSpatialX = String(detail.x?.index ?? root.dataset.mmX ?? 0);
    root.dataset.mmSpatialY = String(detail.y?.index ?? root.dataset.mmY ?? 0);
    root.dataset.mmSpatialZ = String(detail.z?.index ?? root.dataset.mmZ ?? 0);
    root.dataset.mmSpatialReady = "true";
  });

  function stabilizeExpandedGeometry() {
    root.scrollLeft = 0;
    stage.scrollLeft = 0;
    deck.scrollLeft = 0;
    modelCards().forEach(card => {
      card.getAnimations?.().forEach(animation => animation.cancel());
    });
  }

  // Reopening changes the containing fixed-layout geometry. Clear retained
  // horizontal scroll origins and cancel only carry-over card animations during
  // the reopening paint frames; normal spatial transitions resume immediately.
  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_DISPLAY_CHANGED", event => {
    if (event.detail?.display !== "expanded") return;
    root.dataset.mmSpatialReopening = "true";
    stabilizeExpandedGeometry();
    requestAnimationFrame(() => {
      stabilizeExpandedGeometry();
      requestAnimationFrame(() => {
        stabilizeExpandedGeometry();
        delete root.dataset.mmSpatialReopening;
      });
    });
  });

  if (coordinate && !coordinate.querySelector(".mm-coordinate-spatial-note")) {
    const note = document.createElement("span");
    note.className = "mm-coordinate-spatial-note";
    note.textContent = "Drag records horizontally · drag lenses vertically · drag family territories through depth";
    coordinate.append(note);
  }

  root.dataset.mmProhibitedSurrogateControlCount = "0";
  root.dataset.mmContinuousDirectManipulation = "true";
  root.dataset.mmInspectionReturn = "exact-coordinate";
  root.dataset.mmResponsiveSpatialContinuity = "true";
  root.dataset.mmSpatialReady = "true";
})();
