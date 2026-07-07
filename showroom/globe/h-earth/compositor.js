// /showroom/globe/h-earth/compositor.js
// FULL-FILE REPLACEMENT
// H_EARTH_3D_CANDIDATE_PREVIEW_COMPOSITOR_STEP_018C_v1
//
// Purpose:
// Owns camera and viewport composition for the H-Earth 3D Candidate Preview route.
//
// This file manages the navigable candidate camera over the HTML/CSS scene.
// It does not own matrix facts, inspection readouts, source imports, receipts
// except compositor status, final renderer activation, WebGL/canvas activation,
// visual-pass validation, production validation, open-world traversal,
// survival simulation, swimming, manor interior access, distant traversal,
// or matrix collapse.

"use strict";

const COMPOSITOR_CONTRACT = "H_EARTH_3D_CANDIDATE_PREVIEW_COMPOSITOR_STEP_018C_v1";
const ROUTE = "/showroom/globe/h-earth/";

const DEFAULT_CAMERA = Object.freeze({
  x: 0,
  y: 0,
  z: 0,
  pan: 0,
  tilt: 0,
  zoom: 1
});

const CAMERA_LIMITS = Object.freeze({
  minX: -520,
  maxX: 520,
  minY: -280,
  maxY: 260,
  minZ: -240,
  maxZ: 220,
  minPan: -18,
  maxPan: 18,
  minTilt: -12,
  maxTilt: 12,
  minZoom: 0.78,
  maxZoom: 1.38
});

const CAMERA_STEPS = Object.freeze({
  keyboardMove: 42,
  buttonMove: 58,
  pointerMove: 0.72,
  pan: 2.2,
  tilt: 2.4,
  zoom: 0.08,
  wheelZoom: 0.0014
});

const CLAIMS = Object.freeze({
  threeDCandidatePreview: true,
  navigableCandidateScene: true,
  inspectableCandidateScene: true,
  compositorActive: true,
  finalRendererActivationClaim: false,
  webglActivationClaim: false,
  canvasActivationClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionDeploymentClaim: false,
  openWorldTraversal: false,
  survivalSimulation: false,
  swimming: false,
  manorInterior: false,
  distantTraversal: false,
  matrixCollapse: false
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function byId(id, root = document) {
  return root.getElementById ? root.getElementById(id) : document.getElementById(id);
}

function query(selector, root = document) {
  return root.querySelector(selector);
}

function queryAll(selector, root = document) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
}

function setDataset(node, key, value) {
  if (!node || !node.dataset) return;
  node.dataset[key] = String(value);
}

function setStyleProperty(node, key, value) {
  if (!node || !node.style) return;
  node.style.setProperty(key, String(value));
}

function getReducedMotionPreference() {
  return Boolean(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function normalizeCamera(input) {
  const next = Object.assign({}, DEFAULT_CAMERA, input || {});

  return Object.freeze({
    x: round(clamp(Number(next.x) || 0, CAMERA_LIMITS.minX, CAMERA_LIMITS.maxX)),
    y: round(clamp(Number(next.y) || 0, CAMERA_LIMITS.minY, CAMERA_LIMITS.maxY)),
    z: round(clamp(Number(next.z) || 0, CAMERA_LIMITS.minZ, CAMERA_LIMITS.maxZ)),
    pan: round(clamp(Number(next.pan) || 0, CAMERA_LIMITS.minPan, CAMERA_LIMITS.maxPan)),
    tilt: round(clamp(Number(next.tilt) || 0, CAMERA_LIMITS.minTilt, CAMERA_LIMITS.maxTilt)),
    zoom: round(clamp(Number(next.zoom) || 1, CAMERA_LIMITS.minZoom, CAMERA_LIMITS.maxZoom))
  });
}

function buildReceipt(state, extra = {}) {
  return Object.freeze(Object.assign({
    contract: COMPOSITOR_CONTRACT,
    route: ROUTE,
    camera: state.camera,
    reducedMotion: state.reducedMotion,
    ready: state.ready,
    navigationEnabled: state.navigationEnabled,
    pointerNavigationEnabled: state.pointerNavigationEnabled,
    keyboardNavigationEnabled: state.keyboardNavigationEnabled,
    buttonNavigationEnabled: state.buttonNavigationEnabled,
    moveCount: state.moveCount,
    resetCount: state.resetCount,
    claims: CLAIMS,
    timestamp: new Date().toISOString()
  }, extra));
}

function applyRouteMarkers(state, extra = {}) {
  const markers = Object.assign({
    route: ROUTE,
    compositorContract: COMPOSITOR_CONTRACT,
    compositorReady: state.ready ? "true" : "false",
    compositorActive: "true",
    cameraX: state.camera.x,
    cameraY: state.camera.y,
    cameraZ: state.camera.z,
    cameraPan: state.camera.pan,
    cameraTilt: state.camera.tilt,
    cameraZoom: state.camera.zoom,
    reducedMotion: state.reducedMotion ? "true" : "false",
    navigableCandidateScene: "true",
    finalRendererActivationClaim: "false",
    webglActivationClaim: "false",
    canvasActivationClaim: "false",
    visualPassClaim: "false",
    validationClaim: "false",
    openWorldTraversal: "false",
    survivalSimulation: "false",
    swimming: "false",
    manorInterior: "false",
    distantTraversal: "false",
    matrixCollapse: "false"
  }, extra);

  Object.keys(markers).forEach((key) => {
    setDataset(document.documentElement, key, markers[key]);
    setDataset(document.body, key, markers[key]);
  });
}

function createState(options = {}) {
  return {
    root: options.root || document,
    viewport: options.viewport || byId("hEarthViewport"),
    cameraNode: options.camera || byId("hEarthCamera"),
    scene: options.scene || byId("hEarthScene"),
    controlsRoot: options.controlsRoot || byId("hEarthCameraControls"),
    statusNode: options.statusNode || byId("hEarthRouteStatus"),
    camera: normalizeCamera(options.initialCamera),
    reducedMotion: getReducedMotionPreference(),
    ready: false,
    navigationEnabled: true,
    pointerNavigationEnabled: true,
    keyboardNavigationEnabled: true,
    buttonNavigationEnabled: true,
    dragging: false,
    pointerId: null,
    lastPointerX: 0,
    lastPointerY: 0,
    moveCount: 0,
    resetCount: 0,
    lastInput: "initial",
    listeners: []
  };
}

function rememberListener(state, node, type, handler, options) {
  if (!node || !node.addEventListener) return;
  node.addEventListener(type, handler, options);
  state.listeners.push(Object.freeze({ node, type, handler, options }));
}

function removeListeners(state) {
  state.listeners.forEach((entry) => {
    entry.node.removeEventListener(entry.type, entry.handler, entry.options);
  });
  state.listeners = [];
}

function applyCamera(state, source = "unknown") {
  const camera = normalizeCamera(state.camera);
  state.camera = camera;

  const x = `${camera.x}px`;
  const y = `${camera.y}px`;
  const z = `${camera.z}px`;
  const pan = `${camera.pan}deg`;
  const tilt = `${camera.tilt}deg`;
  const zoom = String(camera.zoom);

  const styleTargets = [
    document.documentElement,
    document.body,
    state.viewport,
    state.cameraNode,
    state.scene
  ].filter(Boolean);

  styleTargets.forEach((node) => {
    setStyleProperty(node, "--h-earth-camera-x", x);
    setStyleProperty(node, "--h-earth-camera-y", y);
    setStyleProperty(node, "--h-earth-camera-z", z);
    setStyleProperty(node, "--h-earth-camera-pan", pan);
    setStyleProperty(node, "--h-earth-camera-tilt", tilt);
    setStyleProperty(node, "--h-earth-camera-zoom", zoom);
  });

  if (state.cameraNode) {
    setDataset(state.cameraNode, "cameraX", camera.x);
    setDataset(state.cameraNode, "cameraY", camera.y);
    setDataset(state.cameraNode, "cameraZ", camera.z);
    setDataset(state.cameraNode, "cameraPan", camera.pan);
    setDataset(state.cameraNode, "cameraTilt", camera.tilt);
    setDataset(state.cameraNode, "cameraZoom", camera.zoom);
  }

  if (state.viewport) {
    setDataset(state.viewport, "lastCameraInput", source);
    setDataset(state.viewport, "compositorReady", state.ready ? "true" : "false");
  }

  state.lastInput = source;
  applyRouteMarkers(state, { lastCameraInput: source });

  window.DGBHEarth3DCandidateCompositorReceipt = buildReceipt(state, {
    lastCameraInput: source
  });

  return state.camera;
}

function moveCamera(state, delta, source) {
  if (!state.navigationEnabled) return state.camera;

  state.camera = normalizeCamera({
    x: state.camera.x + (delta.x || 0),
    y: state.camera.y + (delta.y || 0),
    z: state.camera.z + (delta.z || 0),
    pan: state.camera.pan + (delta.pan || 0),
    tilt: state.camera.tilt + (delta.tilt || 0),
    zoom: state.camera.zoom + (delta.zoom || 0)
  });

  state.moveCount += 1;
  return applyCamera(state, source);
}

function resetCamera(state, source = "reset") {
  state.camera = normalizeCamera(DEFAULT_CAMERA);
  state.resetCount += 1;
  return applyCamera(state, source);
}

function setDraggingState(state, value) {
  state.dragging = Boolean(value);

  if (state.viewport) {
    setDataset(state.viewport, "compositorState", state.dragging ? "dragging" : "ready");
  }

  setDataset(document.body, "compositorState", state.dragging ? "dragging" : "ready");
}

function handleControlAction(state, action) {
  const step = CAMERA_STEPS.buttonMove;

  switch (action) {
    case "forward":
      return moveCamera(state, { y: step }, "control-forward");

    case "back":
      return moveCamera(state, { y: -step }, "control-back");

    case "left":
      return moveCamera(state, { x: step }, "control-left");

    case "right":
      return moveCamera(state, { x: -step }, "control-right");

    case "tilt-up":
      return moveCamera(state, { tilt: CAMERA_STEPS.tilt }, "control-tilt-up");

    case "tilt-down":
      return moveCamera(state, { tilt: -CAMERA_STEPS.tilt }, "control-tilt-down");

    case "zoom-in":
      return moveCamera(state, { zoom: CAMERA_STEPS.zoom }, "control-zoom-in");

    case "zoom-out":
      return moveCamera(state, { zoom: -CAMERA_STEPS.zoom }, "control-zoom-out");

    case "reset":
      return resetCamera(state, "control-reset");

    default:
      return state.camera;
  }
}

function bindButtonControls(state) {
  if (!state.controlsRoot || !state.buttonNavigationEnabled) return;

  queryAll("[data-camera-control]", state.controlsRoot).forEach((button) => {
    if (button.dataset.compositorBound === "true") return;
    button.dataset.compositorBound = "true";

    rememberListener(state, button, "click", () => {
      handleControlAction(state, button.dataset.cameraControl);
    });
  });
}

function bindKeyboardNavigation(state) {
  if (!state.viewport || !state.keyboardNavigationEnabled) return;

  const handler = (event) => {
    const target = event.target;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : "";

    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const step = event.shiftKey
      ? CAMERA_STEPS.keyboardMove * 1.75
      : CAMERA_STEPS.keyboardMove;

    let handled = true;

    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        moveCamera(state, { y: step }, "keyboard-forward");
        break;

      case "ArrowDown":
      case "s":
      case "S":
        moveCamera(state, { y: -step }, "keyboard-back");
        break;

      case "ArrowLeft":
      case "a":
      case "A":
        moveCamera(state, { x: step }, "keyboard-left");
        break;

      case "ArrowRight":
      case "d":
      case "D":
        moveCamera(state, { x: -step }, "keyboard-right");
        break;

      case "q":
      case "Q":
        moveCamera(state, { pan: -CAMERA_STEPS.pan }, "keyboard-pan-left");
        break;

      case "e":
      case "E":
        moveCamera(state, { pan: CAMERA_STEPS.pan }, "keyboard-pan-right");
        break;

      case "r":
      case "R":
        moveCamera(state, { tilt: CAMERA_STEPS.tilt }, "keyboard-tilt-up");
        break;

      case "f":
      case "F":
        moveCamera(state, { tilt: -CAMERA_STEPS.tilt }, "keyboard-tilt-down");
        break;

      case "+":
      case "=":
        moveCamera(state, { zoom: CAMERA_STEPS.zoom }, "keyboard-zoom-in");
        break;

      case "-":
      case "_":
        moveCamera(state, { zoom: -CAMERA_STEPS.zoom }, "keyboard-zoom-out");
        break;

      case "0":
      case "Home":
        resetCamera(state, "keyboard-reset");
        break;

      default:
        handled = false;
        break;
    }

    if (handled) event.preventDefault();
  };

  rememberListener(state, state.viewport, "keydown", handler);
}

function bindPointerNavigation(state) {
  if (!state.viewport || !state.pointerNavigationEnabled) return;

  const pointerDown = (event) => {
    if (!state.navigationEnabled) return;
    if (event.button !== undefined && event.button !== 0) return;

    const interactive = event.target.closest
      ? event.target.closest("button, a, input, textarea, select, [data-controller-target='inspection']")
      : null;

    if (interactive) return;

    state.pointerId = event.pointerId;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;

    if (state.viewport.setPointerCapture) {
      state.viewport.setPointerCapture(event.pointerId);
    }

    setDraggingState(state, true);
  };

  const pointerMove = (event) => {
    if (!state.dragging) return;
    if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.lastPointerX;
    const dy = event.clientY - state.lastPointerY;

    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;

    moveCamera(state, {
      x: dx * CAMERA_STEPS.pointerMove,
      y: dy * CAMERA_STEPS.pointerMove
    }, "pointer-drag");
  };

  const pointerEnd = (event) => {
    if (state.pointerId !== null && event.pointerId !== state.pointerId) return;

    if (state.viewport.releasePointerCapture && state.pointerId !== null) {
      try {
        state.viewport.releasePointerCapture(state.pointerId);
      } catch (_error) {
        // Ignore stale pointer capture release.
      }
    }

    state.pointerId = null;
    setDraggingState(state, false);
  };

  rememberListener(state, state.viewport, "pointerdown", pointerDown);
  rememberListener(state, state.viewport, "pointermove", pointerMove);
  rememberListener(state, state.viewport, "pointerup", pointerEnd);
  rememberListener(state, state.viewport, "pointercancel", pointerEnd);
  rememberListener(state, state.viewport, "lostpointercapture", pointerEnd);
}

function bindWheelZoom(state) {
  if (!state.viewport) return;

  const wheel = (event) => {
    if (!state.navigationEnabled) return;

    const shouldZoom = event.ctrlKey || event.metaKey || event.shiftKey;
    if (!shouldZoom) return;

    event.preventDefault();

    moveCamera(state, {
      zoom: -event.deltaY * CAMERA_STEPS.wheelZoom
    }, "wheel-zoom");
  };

  rememberListener(state, state.viewport, "wheel", wheel, { passive: false });
}

function bindReducedMotionWatcher(state) {
  if (!window.matchMedia) return;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handler = (event) => {
    state.reducedMotion = Boolean(event.matches);
    setDataset(document.body, "reducedMotion", state.reducedMotion ? "true" : "false");
    setDataset(document.documentElement, "reducedMotion", state.reducedMotion ? "true" : "false");
    applyCamera(state, "reduced-motion-change");
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handler);
    state.listeners.push(Object.freeze({
      node: mediaQuery,
      type: "change",
      handler,
      options: undefined
    }));
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handler);
  }
}

function validateMounts(state) {
  const missing = [];

  if (!state.viewport) missing.push("hEarthViewport");
  if (!state.cameraNode) missing.push("hEarthCamera");
  if (!state.scene) missing.push("hEarthScene");

  return Object.freeze({
    ok: missing.length === 0,
    missing: Object.freeze(missing)
  });
}

function exposeAPI(state) {
  const api = Object.freeze({
    contract: COMPOSITOR_CONTRACT,
    route: ROUTE,

    status() {
      return buildReceipt(state, {
        mounts: validateMounts(state)
      });
    },

    camera() {
      return state.camera;
    },

    move(delta, source = "api-move") {
      return moveCamera(state, delta || {}, source);
    },

    reset(source = "api-reset") {
      return resetCamera(state, source);
    },

    setCamera(nextCamera, source = "api-set-camera") {
      state.camera = normalizeCamera(nextCamera);
      state.moveCount += 1;
      return applyCamera(state, source);
    },

    enableNavigation() {
      state.navigationEnabled = true;
      applyRouteMarkers(state, { navigationEnabled: "true" });
      return buildReceipt(state, { navigationEnabled: true });
    },

    disableNavigation() {
      state.navigationEnabled = false;
      applyRouteMarkers(state, { navigationEnabled: "false" });
      return buildReceipt(state, { navigationEnabled: false });
    },

    destroy() {
      removeListeners(state);
      state.ready = false;
      applyRouteMarkers(state, {
        compositorReady: "false",
        compositorDestroyed: "true"
      });
      return buildReceipt(state, { destroyed: true });
    }
  });

  window.DGBHEarth3DCandidateCompositor = api;
  return api;
}

export function bootHEarth3DCompositor(options = {}) {
  const state = createState(options);
  const mounts = validateMounts(state);

  applyRouteMarkers(state, {
    compositorBootAttempted: "true",
    compositorMountsOk: mounts.ok ? "true" : "false",
    compositorMissingMounts: mounts.missing.join(",")
  });

  if (!mounts.ok) {
    const receipt = buildReceipt(state, {
      ready: false,
      mounts
    });

    window.DGBHEarth3DCandidateCompositorReceipt = receipt;
    return receipt;
  }

  if (state.viewport) {
    state.viewport.dataset.compositorReady = "true";
    state.viewport.dataset.compositorState = "ready";
  }

  if (state.cameraNode) {
    state.cameraNode.dataset.compositorCamera = "true";
  }

  if (state.scene) {
    state.scene.dataset.compositorScene = "true";
  }

  bindButtonControls(state);
  bindKeyboardNavigation(state);
  bindPointerNavigation(state);
  bindWheelZoom(state);
  bindReducedMotionWatcher(state);

  state.ready = true;

  applyCamera(state, "initial-compositor-boot");
  exposeAPI(state);

  const receipt = buildReceipt(state, {
    ready: true,
    mounts
  });

  window.DGBHEarth3DCandidateCompositorReceipt = receipt;

  applyRouteMarkers(state, {
    compositorReady: "true",
    compositorBootComplete: "true"
  });

  return receipt;
}

export default bootHEarth3DCompositor;
