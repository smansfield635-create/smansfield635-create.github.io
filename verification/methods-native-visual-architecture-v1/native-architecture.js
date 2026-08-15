(() => {
  "use strict";

  const CONTRACT = "METHODS_NATIVE_VISUAL_ARCHITECTURE_REMEDIATION_PROTOTYPE_v1";
  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;

  const deck = root.querySelector("[data-mm-model-deck]");
  const cameraControls = root.querySelector("[data-mm-native-camera-controls]");
  const cameraButtons = Array.from(root.querySelectorAll("[data-mm-camera]"));
  const status = root.querySelector("[data-mm-native-stage-status]");
  const cameras = new Set(["overview", "browse"]);
  const nativeApi = globalThis.METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3;

  const state = {
    camera: "overview",
    pointer: null
  };

  function activeCoordinate() {
    const euclidean = nativeApi?.getState?.() || { x: 0, y: 0, z: 0 };
    return {
      x: Number(euclidean.x || 0),
      y: Number(euclidean.y || 0),
      z: Number(euclidean.z || 0)
    };
  }

  function publish(source) {
    const coordinate = activeCoordinate();
    const detail = Object.freeze({
      contract: CONTRACT,
      source,
      camera: state.camera,
      cameraNative: true,
      coordinate: Object.freeze(coordinate),
      display: document.body.dataset.mmDisplay || "expanded"
    });
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_NATIVE_CAMERA_CHANGED", { detail }));
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_NATIVE_ARCHITECTURE_STATE_CHANGED", { detail }));
    if (status) {
      status.textContent = `${state.camera === "overview" ? "Overview" : "Browse"} camera · X ${coordinate.x + 1} · Y ${coordinate.y + 1} · Z ${coordinate.z + 1}`;
    }
  }

  function setCamera(requested, source = "camera-control") {
    const camera = String(requested || "").toLowerCase();
    if (!cameras.has(camera)) return false;
    state.camera = camera;
    document.body.dataset.mmCamera = camera;
    root.dataset.mmCamera = camera;
    document.documentElement.dataset.methodsModelsCamera = camera;
    cameraButtons.forEach(button => {
      const selected = button.dataset.mmCamera === camera;
      button.setAttribute("aria-pressed", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    publish(source);
    return true;
  }

  cameraControls?.addEventListener("click", event => {
    const button = event.target.closest("[data-mm-camera]");
    if (!button) return;
    setCamera(button.dataset.mmCamera, "camera-button");
  });

  cameraControls?.addEventListener("keydown", event => {
    if (!cameraButtons.length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, cameraButtons.indexOf(document.activeElement));
    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + cameraButtons.length) % cameraButtons.length;
    if (event.key === "ArrowRight") next = (current + 1) % cameraButtons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = cameraButtons.length - 1;
    cameraButtons[next].focus();
    setCamera(cameraButtons[next].dataset.mmCamera, "camera-keyboard");
  });

  deck?.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    state.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }, true);

  deck?.addEventListener("pointerup", event => {
    const start = state.pointer;
    state.pointer = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 44 || Math.abs(dx) <= Math.abs(dy)) return;
    event.preventDefault();
    nativeApi?.moveModel?.(dx < 0 ? 1 : -1, "x-native-stage-swipe");
  }, true);

  deck?.addEventListener("pointercancel", () => { state.pointer = null; }, true);

  globalThis.addEventListener("METHODS_MODELS_EUCLIDEAN_STATE_CHANGED", () => publish("coordinate-change"));
  globalThis.addEventListener("METHODS_MODELS_SHOWROOM_CHANGED", () => publish("model-change"));

  globalThis.METHODS_MODELS_NATIVE_VISUAL_ARCHITECTURE_V1 = Object.freeze({
    contract: CONTRACT,
    getState: () => Object.freeze({
      camera: state.camera,
      ...activeCoordinate(),
      display: document.body.dataset.mmDisplay || "expanded"
    }),
    setCamera
  });

  document.documentElement.dataset.methodsModelsNativeArchitecture = "active";
  root.dataset.mmNativeArchitecture = "active";
  setCamera(document.body.dataset.mmCamera || "overview", "initialization");
})();
