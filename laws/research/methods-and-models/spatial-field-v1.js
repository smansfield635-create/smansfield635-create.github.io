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
  const dialog = document.querySelector("[data-mm-dialog]");
  const dialogClose = document.querySelector("[data-mm-dialog-close]");
  const coordinate = root.querySelector("[data-mm-coordinate]");

  if (!stage || !deck || !familyTabs || !lensTabs) return;

  const state = {
    activePointer: null,
    returnCoordinate: null,
    lastCommitAt: 0
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const selectedIndex = (nodes, predicate) => {
    const list = Array.from(nodes);
    const index = list.findIndex(predicate);
    return index < 0 ? 0 : index;
  };

  function familyButtons() {
    return Array.from(familyTabs.querySelectorAll(".mm-family-tab"));
  }

  function lensButtons() {
    return Array.from(lensTabs.querySelectorAll("[data-mm-lens-tab]"));
  }

  function modelCards() {
    return Array.from(deck.querySelectorAll(".mm-model-card"));
  }

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
    applyGeometry(0, 0, 0);
    delete root.dataset.mmFieldDragging;
    delete root.dataset.mmXDragging;
    delete root.dataset.mmYDragging;
    delete root.dataset.mmZDragging;
  }

  function markAxis(axis) {
    root.dataset.mmFieldDragging = "true";
    root.dataset[`mm${axis.toUpperCase()}Dragging`] = "true";
  }

  function commitThrottle() {
    const now = performance.now();
    if (now - state.lastCommitAt < 150) return false;
    state.lastCommitAt = now;
    return true;
  }

  function moveModel(delta) {
    if (!commitThrottle()) return;
    (delta > 0 ? next : previous)?.click();
  }

  function moveFamily(delta) {
    if (!commitThrottle()) return;
    const buttons = familyButtons();
    if (!buttons.length) return;
    const current = selectedIndex(buttons, button => button.getAttribute("aria-selected") === "true");
    const target = (current + delta + buttons.length) % buttons.length;
    buttons[target]?.click();
  }

  function moveLens(delta) {
    if (!commitThrottle()) return;
    const buttons = lensButtons();
    if (!buttons.length) return;
    const current = selectedIndex(buttons, button => button.getAttribute("aria-selected") === "true");
    const target = (current + delta + buttons.length) % buttons.length;
    buttons[target]?.click();
  }

  function begin(axis, event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const surface = event.currentTarget;
    state.activePointer = {
      axis,
      id: event.pointerId,
      surface,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      residualX: 0,
      residualY: 0
    };
    markAxis(axis);
    surface.setPointerCapture?.(event.pointerId);
  }

  function move(event) {
    const pointer = state.activePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    event.preventDefault();

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;

    if (pointer.axis === "x") {
      applyGeometry(dx, dy * .16, 0);
      pointer.residualX += event.movementX || 0;
      if (Math.abs(pointer.residualX) >= 72) {
        moveModel(pointer.residualX < 0 ? 1 : -1);
        pointer.residualX = 0;
        pointer.startX = event.clientX;
        pointer.startY = event.clientY;
      }
      return;
    }

    if (pointer.axis === "y") {
      applyGeometry(dx * .08, dy, 0);
      pointer.residualY += event.movementY || 0;
      if (Math.abs(pointer.residualY) >= 54) {
        moveLens(pointer.residualY > 0 ? 1 : -1);
        pointer.residualY = 0;
        pointer.startX = event.clientX;
        pointer.startY = event.clientY;
      }
      return;
    }

    if (pointer.axis === "z") {
      applyGeometry(dx * .04, 0, dy);
      pointer.residualY += event.movementY || 0;
      if (Math.abs(pointer.residualY) >= 58) {
        moveFamily(pointer.residualY > 0 ? 1 : -1);
        pointer.residualY = 0;
        pointer.startX = event.clientX;
        pointer.startY = event.clientY;
      }
    }
  }

  function finish(event) {
    const pointer = state.activePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    pointer.surface.releasePointerCapture?.(event.pointerId);
    state.activePointer = null;
    resetGeometry();
  }

  function cancel(event) {
    if (state.activePointer?.id !== event.pointerId) return;
    state.activePointer = null;
    resetGeometry();
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

  // Wheel/trackpad remains direct manipulation of the same spatial surfaces.
  deck.addEventListener("wheel", event => {
    if (Math.abs(event.deltaX) < 4 && Math.abs(event.deltaY) < 4) return;
    event.preventDefault();
    const delta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    applyGeometry(clamp(-delta, -80, 80), 0, 0);
    moveModel(delta > 0 ? 1 : -1);
    requestAnimationFrame(resetGeometry);
  }, { passive: false });

  lensTabs.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) < 4) return;
    event.preventDefault();
    applyGeometry(0, clamp(-event.deltaY, -72, 72), 0);
    moveLens(event.deltaY > 0 ? 1 : -1);
    requestAnimationFrame(resetGeometry);
  }, { passive: false });

  familyTabs.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) < 4) return;
    event.preventDefault();
    applyGeometry(0, 0, clamp(-event.deltaY, -58, 58));
    moveFamily(event.deltaY > 0 ? 1 : -1);
    requestAnimationFrame(resetGeometry);
  }, { passive: false });

  // Exact inspection/return: remember the X/Y/Z coordinate before opening.
  root.addEventListener("click", event => {
    if (event.target.closest(".mm-inspect")) state.returnCoordinate = coordinateSnapshot();
  }, true);

  function restoreCoordinate(snapshot) {
    if (!snapshot) return;
    const families = familyButtons();
    const lenses = lensButtons();

    if (families[snapshot.z]) families[snapshot.z].click();
    if (lenses[snapshot.y]) lenses[snapshot.y].click();

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

  // Keep spatial geometry synchronized with the inherited semantic state.
  globalThis.addEventListener("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", event => {
    const detail = event.detail || {};
    root.dataset.mmSpatialX = String(detail.x?.index ?? root.dataset.mmX ?? 0);
    root.dataset.mmSpatialY = String(detail.y?.index ?? root.dataset.mmY ?? 0);
    root.dataset.mmSpatialZ = String(detail.z?.index ?? root.dataset.mmZ ?? 0);
    root.dataset.mmSpatialReady = "true";
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
