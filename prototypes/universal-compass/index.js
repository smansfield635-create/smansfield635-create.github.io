/*
 * Universal Compass browser bootstrap and DOM mount adapter.
 *
 * Owns no world, visual-geometry, camera, projection, controller-state,
 * interaction, target-acceptance, navigation, product, or production authority.
 * It constructs the accepted authorities, forwards browser input, and mounts
 * their published state and projection records into the route-local stage.
 */

import { createPlanetAuthority } from "./index.planet.js";
import {
  buildUvSphereShape,
  createCrystalAuthority
} from "./index.crystals.js";
import { createCompassController } from "./index.controller.js";
import { createCompositor } from "./index.compositor.js";
import { createInteractionAuthority } from "./index.interactions.js";

const root = document.documentElement;
const statusOutput = requireElement("[data-reference-status]");
const field = requireElement("[data-reference-field]");
const visualLayer = requireElement("[data-reference-visual]");
const semanticLayer = requireElement("[data-reference-semantic]");
const selectionOutput = requireElement("[data-reference-selection]");
const presentationOutput = requireElement("[data-reference-presentation]");
const primaryOutput = requireElement("[data-reference-primary]");
const worldRevisionOutput = requireElement("[data-reference-world-revision]");
const projectionRevisionOutput = requireElement("[data-reference-projection-revision]");
const controllerRevisionOutput = requireElement("[data-reference-controller-revision]");
const receiptOutput = requireElement("[data-reference-receipt]");
const constellationButton = requireElement("[data-reference-constellation]");
const clusterButton = requireElement("[data-reference-cluster]");
const holdButton = requireElement("[data-reference-hold]");
const reducedMotionButton = requireElement("[data-reference-reduced-motion]");

const CENTER = Object.freeze([0, 0, 10]);
const BASE_CAMERA_OFFSET = Object.freeze([0, 0, -10]);
const BASE_UP = Object.freeze([0, 1, 0]);
const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);

let planet = null;
let crystals = null;
let controller = null;
let compositor = null;
let interactions = null;
let worldSnapshot = null;
let crystalInput = null;
let lastProjection = null;
let lastFrameTime = 0;
let frameScheduled = false;
let cameraSignature = "";
let activePointerId = "";
let lastSelectionId = "";
let lastReceipt = "No local receipt yet.";

function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function assert(condition, code, details = null) {
  if (!condition) fail(code, details);
}

function requireElement(selector) {
  const element = document.querySelector(selector);
  assert(element, "COMPASS_BOOTSTRAP_MOUNT_REQUIRED", selector);
  return element;
}

function finite(value, code) {
  const admitted = Number(value);
  assert(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function normalizeQuaternion(value) {
  const admitted = Array.from(value || []).map(component =>
    finite(component, "COMPASS_BOOTSTRAP_QUATERNION_INVALID")
  );
  assert(admitted.length === 4, "COMPASS_BOOTSTRAP_QUATERNION_INVALID", value);
  const length = Math.hypot(...admitted);
  assert(length > 1e-8, "COMPASS_BOOTSTRAP_QUATERNION_INVALID", value);
  return admitted.map(component => component / length);
}

function conjugateQuaternion(value) {
  const quaternion = normalizeQuaternion(value);
  return [-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3]];
}

function rotateVectorByQuaternion(vector, value) {
  const [x, y, z, w] = normalizeQuaternion(value);
  const [vx, vy, vz] = vector.map(component =>
    finite(component, "COMPASS_BOOTSTRAP_VECTOR_INVALID")
  );
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + (y * tz - z * ty),
    vy + w * ty + (z * tx - x * tz),
    vz + w * tz + (x * ty - y * tx)
  ];
}

function add3(left, right) {
  return [
    left[0] + right[0],
    left[1] + right[1],
    left[2] + right[2]
  ];
}

function activeOrientation(state = controller.getState()) {
  if (state.presentation === "CONSTELLATION") return state.constellation;
  return state.clusters[state.activeCardinalId] || null;
}

function cameraForState(state = controller.getState()) {
  const orientation = activeOrientation(state);
  const inverse = conjugateQuaternion(
    orientation?.quaternion || IDENTITY_QUATERNION
  );
  return Object.freeze({
    position: Object.freeze(
      add3(CENTER, rotateVectorByQuaternion(BASE_CAMERA_OFFSET, inverse))
    ),
    target: CENTER,
    up: Object.freeze(rotateVectorByQuaternion(BASE_UP, inverse)),
    fieldOfViewYDegrees: 60,
    near: 0.1,
    far: 100
  });
}

function cameraDifference(camera, target) {
  const differences = [
    ...camera.position.map((value, index) =>
      Math.abs(value - target.position[index])
    ),
    ...camera.target.map((value, index) =>
      Math.abs(value - target.target[index])
    ),
    ...camera.up.map((value, index) =>
      Math.abs(value - target.up[index])
    )
  ];
  return Math.max(...differences);
}

function setReceipt(message) {
  lastReceipt = String(message || "No local receipt yet.");
  receiptOutput.textContent = lastReceipt;
}

function selectedLabel(state) {
  if (state.selectedChildId) return state.selectedChildId;
  if (state.activeCardinalId) return `${state.activeCardinalId} cluster`;
  return lastSelectionId || "No node selected";
}

function syncControls(state) {
  const constellation = state.presentation === "CONSTELLATION";
  constellationButton.setAttribute("aria-pressed", String(constellation));
  clusterButton.setAttribute("aria-pressed", String(!constellation));
  clusterButton.textContent = constellation
    ? `Open ${activeOrientation(state)?.primaryId || "North"} cluster`
    : `Cluster: ${state.activeCardinalId}`;
  holdButton.setAttribute("aria-pressed", String(state.held));
  holdButton.textContent = state.held
    ? "Leave held state"
    : "Enter held state";
  reducedMotionButton.setAttribute(
    "aria-pressed",
    String(state.reducedMotion)
  );
  reducedMotionButton.textContent =
    `Reduced motion: ${state.reducedMotion ? "on" : "off"}`;
  constellationButton.disabled = state.held;
  clusterButton.disabled = state.held;
}

function acceptLocalTarget(targetId, kind, source) {
  const state = controller.getState();
  if (state.held) {
    setReceipt(`TARGET_REJECTED_HELD · ${targetId}`);
    return;
  }

  if (kind === "CARDINAL" && state.presentation === "CONSTELLATION") {
    controller.openCluster(targetId);
    lastSelectionId = targetId;
    setReceipt(
      `LOCAL_ORCHESTRATION_OPENED_CLUSTER · ${targetId} · ${source}`
    );
  } else if (
    kind === "CHILD" &&
    state.presentation === "CLUSTER" &&
    planet.isChildOfCardinal(targetId, state.activeCardinalId)
  ) {
    controller.selectChild(targetId);
    lastSelectionId = targetId;
    setReceipt(
      `LOCAL_ORCHESTRATION_SELECTED_CHILD · ${targetId} · ${source}`
    );
  } else {
    setReceipt(`TARGET_PROPOSAL_NOT_ACCEPTED · ${targetId}`);
  }

  scheduleProjection();
}

function renderProjection(projection) {
  lastProjection = projection;
  const state = controller.getState();
  const visibleRecords = projection.records.filter(record => record.visible);
  const selectableRecords = projection.interactionProjectionRecords.filter(record =>
    state.presentation === "CONSTELLATION"
      ? record.kind === "CARDINAL"
      : record.kind === "CHILD" &&
        record.parentId === state.activeCardinalId
  );

  visualLayer.replaceChildren(
    ...visibleRecords.map(record => {
      const visual = document.createElement("div");
      visual.className = "reference-node-visual";
      visual.dataset.nodeId = record.id;
      visual.dataset.depth = record.depthLayer;
      visual.style.left = `${record.screenX}px`;
      visual.style.top = `${record.screenY}px`;
      const diameter = Math.max(
        18,
        Math.min(108, record.projectedSphere.radiusPx * 2)
      );
      visual.style.setProperty("--node-size", `${diameter}px`);
      return visual;
    })
  );

  semanticLayer.replaceChildren(
    ...selectableRecords.map(record => {
      const control = document.createElement("button");
      control.type = "button";
      control.className = "reference-node-control";
      control.dataset.nodeId = record.id;
      control.dataset.nodeKind = record.kind;
      control.style.left = `${record.projectedSemanticAnchor.screenX}px`;
      control.style.top = `${record.projectedSemanticAnchor.screenY}px`;
      control.textContent = record.id;
      control.setAttribute(
        "aria-pressed",
        String(
          record.id === state.activeCardinalId ||
          record.id === state.selectedChildId
        )
      );
      control.disabled = state.held;
      control.addEventListener("click", event => {
        if (event.detail !== 0) return;
        acceptLocalTarget(record.id, record.kind, "keyboard");
      });
      return control;
    })
  );

  const orientation = activeOrientation(state);
  selectionOutput.textContent = selectedLabel(state);
  presentationOutput.textContent = state.presentation;
  primaryOutput.textContent =
    orientation?.previewPrimaryId || orientation?.primaryId || "Pending";
  worldRevisionOutput.textContent = String(worldSnapshot.worldRevision);
  projectionRevisionOutput.textContent = String(projection.projectionRevision);
  controllerRevisionOutput.textContent = String(state.revision);
  receiptOutput.textContent = lastReceipt;
  syncControls(state);
  statusOutput.textContent =
    `Ready · ${visibleRecords.length} visible · projection ${projection.projectionRevision}`;
}

function projectFrame(timestamp) {
  frameScheduled = false;
  const state = controller.getState();
  const targetCamera = cameraForState(state);
  const signature = JSON.stringify(targetCamera);

  if (signature !== cameraSignature) {
    compositor.setCamera(targetCamera);
    cameraSignature = signature;
  }

  const rect = field.getBoundingClientRect();
  const deltaSeconds = lastFrameTime
    ? Math.min(0.1, Math.max(0, (timestamp - lastFrameTime) / 1000))
    : 1 / 60;
  lastFrameTime = timestamp;

  const projection = compositor.project({
    worldSnapshot,
    crystalInput,
    presentationContext: controller.getPresentationContext(),
    viewport: Object.freeze({
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
      pixelRatio: Math.max(1, window.devicePixelRatio || 1)
    }),
    timestampMs: Math.max(0, timestamp),
    deltaSeconds
  });

  renderProjection(projection);

  if (
    !state.reducedMotion &&
    cameraDifference(projection.camera, targetCamera) > 0.0005
  ) {
    scheduleProjection();
  }
}

function scheduleProjection() {
  if (frameScheduled) return;
  frameScheduled = true;
  requestAnimationFrame(projectFrame);
}

function localPoint(event) {
  const rect = field.getBoundingClientRect();
  return Object.freeze({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  });
}

function pointerKind(pointerType) {
  const admitted = String(pointerType || "mouse").toUpperCase();
  return ["MOUSE", "TOUCH", "PEN"].includes(admitted)
    ? admitted
    : "MOUSE";
}

function processInteractionResult(result) {
  if (!result) return;
  const mode = result.mode || result.reason || result.phase || "INTERACTION_RESULT";
  const target = result.targetProposal?.targetId || result.primaryId || "";
  setReceipt(
    `${mode}${target ? ` · ${target}` : ""} · input ${interactions.getInputRevision()}`
  );

  if (result.mode === "TAP_PROPOSAL" && result.targetProposal) {
    acceptLocalTarget(
      result.targetProposal.targetId,
      result.targetProposal.kind,
      "pointer-proposal"
    );
  }

  scheduleProjection();
}

function interruptActiveInput(reason) {
  if (!interactions?.getActive()) return;
  const result = interactions.interrupt(reason);
  activePointerId = "";
  processInteractionResult(result);
}

function bindControls() {
  constellationButton.addEventListener("click", () => {
    const state = controller.getState();
    if (state.presentation === "CLUSTER") {
      interruptActiveInput("constellation-control");
      controller.closeCluster();
      lastSelectionId = "";
      setReceipt("LOCAL_ORCHESTRATION_CLOSED_CLUSTER");
    }
    scheduleProjection();
  });

  clusterButton.addEventListener("click", () => {
    const state = controller.getState();
    if (state.presentation === "CONSTELLATION") {
      interruptActiveInput("cluster-control");
      const candidate = activeOrientation(state)?.primaryId;
      const cardinalId = planet.hasCardinal(candidate) ? candidate : "NORTH";
      controller.openCluster(cardinalId);
      lastSelectionId = cardinalId;
      setReceipt(`LOCAL_ORCHESTRATION_OPENED_CLUSTER · ${cardinalId}`);
    }
    scheduleProjection();
  });

  holdButton.addEventListener("click", () => {
    const state = controller.getState();
    if (state.held) {
      controller.leaveHeld();
      setReceipt("CONTROLLER_LEFT_HELD_STATE");
    } else {
      interruptActiveInput("held-control");
      controller.enterHeld("reference-control");
      setReceipt("CONTROLLER_ENTERED_HELD_STATE");
    }
    scheduleProjection();
  });

  reducedMotionButton.addEventListener("click", () => {
    const state = controller.getState();
    controller.setReducedMotion(!state.reducedMotion);
    setReceipt(
      `CONTROLLER_REDUCED_MOTION_${state.reducedMotion ? "DISABLED" : "ENABLED"}`
    );
    scheduleProjection();
  });
}

function bindPointerInput() {
  field.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const point = localPoint(event);
    const targetControl = event.target.closest?.("[data-node-id]");
    const result = interactions.begin({
      id: String(event.pointerId),
      kind: pointerKind(event.pointerType),
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      targetId: targetControl?.dataset.nodeId || ""
    });
    processInteractionResult(result);
    if (!result.accepted) return;
    activePointerId = String(event.pointerId);
    try {
      field.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is an enhancement; Interactions remains authoritative.
    }
    event.preventDefault();
  });

  field.addEventListener("pointermove", event => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    const result = interactions.move({
      id: String(event.pointerId),
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp)
    });
    processInteractionResult(result);
    event.preventDefault();
  });

  const endPointer = (event, cancel) => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    const result = interactions.end({
      id: String(event.pointerId),
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      cancel: Boolean(cancel)
    });
    activePointerId = "";
    processInteractionResult(result);
    event.preventDefault();
  };

  field.addEventListener("pointerup", event => endPointer(event, false));
  field.addEventListener("pointercancel", event => endPointer(event, true));
  field.addEventListener("lostpointercapture", () => {
    if (!activePointerId) return;
    processInteractionResult(
      interactions.interrupt("pointer-capture-lost")
    );
    activePointerId = "";
  });
}

function buildCrystalAuthority() {
  const materialRegionDefinitions = Object.freeze([
    Object.freeze({
      id: "NEUTRAL_SURFACE",
      semanticRole: "NEUTRAL_SURFACE"
    })
  ]);
  const shapeDefinitions = Object.freeze([
    buildUvSphereShape({
      id: "NEUTRAL_SPHERE",
      radius: 1,
      longitudeSegments: 8,
      latitudeSegments: 6,
      materialRegionId: "NEUTRAL_SURFACE"
    })
  ]);
  const visualProfile = Object.freeze({
    id: "DGB_UNIVERSAL_COMPASS_BROWSER_NEUTRAL_VISUAL_PROFILE_v1",
    byKind: Object.freeze({
      CENTER: Object.freeze({
        shapeId: "NEUTRAL_SPHERE",
        visualScale: Object.freeze([1, 1, 1]),
        materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"])
      }),
      CARDINAL: Object.freeze({
        shapeId: "NEUTRAL_SPHERE",
        visualScale: Object.freeze([0.8, 0.8, 0.8]),
        materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"])
      }),
      CHILD: Object.freeze({
        shapeId: "NEUTRAL_SPHERE",
        visualScale: Object.freeze([0.55, 0.55, 0.55]),
        materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"])
      })
    })
  });

  return createCrystalAuthority({
    visualProfile,
    shapeDefinitions,
    materialRegionDefinitions,
    crystalRevision: 1
  });
}

function publishBrowserReference() {
  Object.defineProperty(window, "__UNIVERSAL_COMPASS_REFERENCE__", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze({
      planet,
      crystals,
      controller,
      compositor,
      interactions,
      getLastProjection: () => lastProjection,
      getStatus: () => Object.freeze({
        runtime: root.dataset.compassRuntime,
        worldRevision: worldSnapshot.worldRevision,
        projectionRevision: lastProjection?.projectionRevision || 0,
        controllerRevision: controller.getRevision(),
        inputRevision: interactions.getInputRevision(),
        presentation: controller.getState().presentation,
        held: controller.getState().held,
        selectedChildId: controller.getState().selectedChildId
      })
    })
  });
}

function bootstrap() {
  planet = createPlanetAuthority();
  worldSnapshot = planet.getWorldSnapshot();

  crystals = buildCrystalAuthority();
  crystals.consumeWorldSnapshot(worldSnapshot);
  crystalInput = crystals.getCompositorInput();

  controller = createCompassController({
    planet,
    reducedMotion: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  });

  compositor = createCompositor({
    cameraConfig: cameraForState(controller.getState()),
    projectionConfig: {
      centerDepth: 10,
      depthHysteresis: 0.5,
      interpolationRate: 12,
      maxDeltaSeconds: 0.1,
      expectedRecordCount: 21,
      expectedKindCounts: {
        CENTER: 1,
        CARDINAL: 4,
        CHILD: 16
      }
    }
  });

  const rect = field.getBoundingClientRect();
  lastProjection = compositor.project({
    worldSnapshot,
    crystalInput,
    presentationContext: controller.getPresentationContext(),
    viewport: Object.freeze({
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
      pixelRatio: Math.max(1, window.devicePixelRatio || 1)
    }),
    timestampMs: Math.max(0, performance.now()),
    deltaSeconds: 1 / 60
  });

  interactions = createInteractionAuthority({
    controller,
    planet,
    compositor
  });

  bindControls();
  bindPointerInput();
  controller.subscribe(scheduleProjection);
  new ResizeObserver(scheduleProjection).observe(field);
  publishBrowserReference();

  root.dataset.compassRuntime = "ready";
  setReceipt(
    `FIVE_AUTHORITY_BROWSER_BOOTSTRAP_READY · world ${worldSnapshot.worldRevision}`
  );
  renderProjection(lastProjection);
  scheduleProjection();
}

try {
  bootstrap();
} catch (error) {
  root.dataset.compassRuntime = "error";
  statusOutput.textContent = "Initialization failed";
  receiptOutput.textContent =
    `${error?.code || error?.name || "ERROR"}: ${error?.message || String(error)}`;
  console.error(error);
}
