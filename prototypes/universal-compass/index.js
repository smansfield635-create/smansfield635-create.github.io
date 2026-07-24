/* Universal Compass browser bootstrap and DOM mount adapter. */

import { createPlanetAuthority } from "./index.planet.js";
import { buildUvSphereShape, createCrystalAuthority } from "./index.crystals.js";
import { createCompassController } from "./index.controller.js";
import { createCompositor } from "./index.compositor.js";
import { createInteractionAuthority } from "./index.interactions.js";

const root = document.documentElement;
const requireElement = selector => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`COMPASS_MOUNT_MISSING:${selector}`);
  return element;
};

const ui = Object.freeze({
  status: requireElement("[data-reference-status]"),
  field: requireElement("[data-reference-field]"),
  visual: requireElement("[data-reference-visual]"),
  semantic: requireElement("[data-reference-semantic]"),
  selection: requireElement("[data-reference-selection]"),
  presentation: requireElement("[data-reference-presentation]"),
  primary: requireElement("[data-reference-primary]"),
  worldRevision: requireElement("[data-reference-world-revision]"),
  projectionRevision: requireElement("[data-reference-projection-revision]"),
  controllerRevision: requireElement("[data-reference-controller-revision]"),
  receipt: requireElement("[data-reference-receipt]"),
  constellation: requireElement("[data-reference-constellation]"),
  cluster: requireElement("[data-reference-cluster]"),
  hold: requireElement("[data-reference-hold]"),
  reducedMotion: requireElement("[data-reference-reduced-motion]")
});

const CENTER = Object.freeze([0, 0, 10]);
const CAMERA_OFFSET = Object.freeze([0, 0, -10]);
const CAMERA_UP = Object.freeze([0, 1, 0]);

let planet;
let controller;
let compositor;
let interactions;
let worldSnapshot;
let crystalInput;
let lastProjection;
let lastFrameTime = 0;
let framePending = false;
let activePointerId = "";
let receipt = "No local receipt yet.";

function activeOrientation(state = controller.getState()) {
  const orientation = state.presentation === "CONSTELLATION"
    ? state.constellation
    : state.clusters[state.activeCardinalId];
  if (!orientation) throw new Error("COMPASS_ACTIVE_ORIENTATION_MISSING");
  return orientation;
}

function normalizedQuaternion(value) {
  if (!Array.isArray(value) || value.length !== 4 || value.some(component => !Number.isFinite(component))) {
    throw new Error("COMPASS_BOOTSTRAP_QUATERNION_INVALID");
  }
  const length = Math.hypot(...value);
  if (!(length > 1e-8)) throw new Error("COMPASS_BOOTSTRAP_QUATERNION_INVALID");
  return value.map(component => component / length);
}

function rotateVector(vector, quaternion) {
  const [x, y, z, w] = normalizedQuaternion(quaternion);
  const [vx, vy, vz] = vector;
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + y * tz - z * ty,
    vy + w * ty + z * tx - x * tz,
    vz + w * tz + x * ty - y * tx
  ];
}

function cameraForState(state = controller.getState()) {
  const [x, y, z, w] = normalizedQuaternion(activeOrientation(state).quaternion);
  const inverse = [-x, -y, -z, w];
  const offset = rotateVector(CAMERA_OFFSET, inverse);
  return Object.freeze({
    position: Object.freeze(CENTER.map((component, index) => component + offset[index])),
    target: CENTER,
    up: Object.freeze(rotateVector(CAMERA_UP, inverse)),
    fieldOfViewYDegrees: 60,
    near: 0.1,
    far: 100
  });
}

function setReceipt(value) {
  receipt = String(value);
  ui.receipt.textContent = receipt;
}

function selectableRecords(projection, state) {
  return projection.interactionProjectionRecords.filter(record =>
    state.presentation === "CONSTELLATION"
      ? record.kind === "CARDINAL"
      : record.kind === "CHILD" && record.parentId === state.activeCardinalId
  );
}

function mountProjection(projection) {
  lastProjection = projection;
  const state = controller.getState();
  const visible = projection.records.filter(record => record.visible);
  const selectable = selectableRecords(projection, state);

  ui.visual.replaceChildren(...visible.map(record => {
    const node = document.createElement("div");
    node.className = "reference-node-visual";
    node.dataset.nodeId = record.id;
    node.dataset.depth = record.depthLayer;
    node.style.left = `${record.screenX}px`;
    node.style.top = `${record.screenY}px`;
    node.style.setProperty(
      "--node-size",
      `${Math.max(18, Math.min(108, record.projectedSphere.radiusPx * 2))}px`
    );
    return node;
  }));

  ui.semantic.replaceChildren(...selectable.map(record => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reference-node-control";
    button.dataset.nodeId = record.id;
    button.dataset.nodeKind = record.kind;
    button.style.left = `${record.projectedSemanticAnchor.screenX}px`;
    button.style.top = `${record.projectedSemanticAnchor.screenY}px`;
    button.textContent = record.id;
    button.disabled = state.held;
    button.setAttribute(
      "aria-pressed",
      String(record.id === state.activeCardinalId || record.id === state.selectedChildId)
    );
    return button;
  }));

  const orientation = activeOrientation(state);
  ui.selection.textContent = state.selectedChildId || state.activeCardinalId || "No node selected";
  ui.presentation.textContent = state.presentation;
  ui.primary.textContent = orientation.previewPrimaryId || orientation.primaryId || "Pending";
  ui.worldRevision.textContent = String(worldSnapshot.worldRevision);
  ui.projectionRevision.textContent = String(projection.projectionRevision);
  ui.controllerRevision.textContent = String(state.revision);
  ui.receipt.textContent = receipt;
  ui.status.textContent = `Ready · ${visible.length} visible`;

  const constellation = state.presentation === "CONSTELLATION";
  ui.constellation.disabled = state.held || constellation;
  ui.cluster.disabled = state.held || !constellation;
  ui.constellation.setAttribute("aria-pressed", String(constellation));
  ui.cluster.setAttribute("aria-pressed", String(!constellation));
  ui.hold.setAttribute("aria-pressed", String(state.held));
  ui.hold.textContent = state.held ? "Leave held state" : "Enter held state";
  ui.reducedMotion.setAttribute("aria-pressed", String(state.reducedMotion));
  ui.reducedMotion.textContent = `Reduced motion: ${state.reducedMotion ? "on" : "off"}`;
}

function projectFrame(timestamp) {
  framePending = false;
  compositor.setCamera(cameraForState());

  const bounds = ui.field.getBoundingClientRect();
  const deltaSeconds = lastFrameTime
    ? Math.min(0.1, Math.max(0, (timestamp - lastFrameTime) / 1000))
    : 1 / 60;
  lastFrameTime = timestamp;

  mountProjection(compositor.project({
    worldSnapshot,
    crystalInput,
    presentationContext: controller.getPresentationContext(),
    viewport: Object.freeze({
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      pixelRatio: Math.max(1, window.devicePixelRatio || 1)
    }),
    timestampMs: Math.max(0, timestamp),
    deltaSeconds
  }));
}

function scheduleProjection() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(projectFrame);
}

function forwardTargetProposal({ targetId, kind }) {
  if (kind === "CARDINAL") controller.openCluster(targetId);
  else if (kind === "CHILD") controller.selectChild(targetId);
}

function processInteraction(result) {
  if (!result) return;
  setReceipt(result.mode || result.reason || result.phase || "INTERACTION");
  if (result.mode === "TAP_PROPOSAL" && result.targetProposal) {
    forwardTargetProposal(result.targetProposal);
  }
  scheduleProjection();
}

function interrupt(reason) {
  if (!interactions.getActive()) return;
  processInteraction(interactions.interrupt(reason));
  activePointerId = "";
}

function localPoint(event) {
  const bounds = ui.field.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function pointerKind(value) {
  const kind = String(value || "mouse").toUpperCase();
  return ["MOUSE", "TOUCH", "PEN"].includes(kind) ? kind : "MOUSE";
}

function bindUi() {
  ui.constellation.addEventListener("click", () => {
    interrupt("constellation-control");
    if (controller.getState().presentation === "CLUSTER") controller.closeCluster();
  });

  ui.cluster.addEventListener("click", () => {
    interrupt("cluster-control");
    controller.openCluster(activeOrientation().primaryId || "NORTH");
  });

  ui.hold.addEventListener("click", () => {
    if (controller.getState().held) controller.leaveHeld();
    else {
      interrupt("held-control");
      controller.enterHeld("reference-control");
    }
  });

  ui.reducedMotion.addEventListener("click", () => {
    controller.setReducedMotion(!controller.getState().reducedMotion);
  });

  ui.semantic.addEventListener("click", event => {
    if (event.detail !== 0) return;
    const button = event.target.closest(".reference-node-control");
    if (button) forwardTargetProposal({
      targetId: button.dataset.nodeId,
      kind: button.dataset.nodeKind
    });
  });

  ui.field.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const point = localPoint(event);
    const target = event.target.closest(".reference-node-control");
    const result = interactions.begin({
      id: String(event.pointerId),
      kind: pointerKind(event.pointerType),
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      targetId: target?.dataset.nodeId || ""
    });
    processInteraction(result);
    if (!result.accepted) return;
    activePointerId = String(event.pointerId);
    ui.field.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  ui.field.addEventListener("pointermove", event => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    processInteraction(interactions.move({
      id: activePointerId,
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp)
    }));
    event.preventDefault();
  });

  const endPointer = (event, cancel) => {
    if (activePointerId !== String(event.pointerId)) return;
    const point = localPoint(event);
    processInteraction(interactions.end({
      id: activePointerId,
      x: point.x,
      y: point.y,
      timestamp: Math.max(0, event.timeStamp),
      cancel
    }));
    activePointerId = "";
    event.preventDefault();
  };

  ui.field.addEventListener("pointerup", event => endPointer(event, false));
  ui.field.addEventListener("pointercancel", event => endPointer(event, true));
  ui.field.addEventListener("lostpointercapture", () => interrupt("pointer-capture-lost"));
}

function initialize() {
  planet = createPlanetAuthority();
  worldSnapshot = planet.getWorldSnapshot();

  const materialRegionDefinitions = Object.freeze([
    Object.freeze({ id: "NEUTRAL_SURFACE", semanticRole: "NEUTRAL_SURFACE" })
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

  const crystals = createCrystalAuthority({
    visualProfile,
    shapeDefinitions,
    materialRegionDefinitions,
    crystalRevision: 1
  });
  crystals.consumeWorldSnapshot(worldSnapshot);
  crystalInput = crystals.getCompositorInput();

  controller = createCompassController({
    planet,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });
  compositor = createCompositor({
    cameraConfig: cameraForState(controller.getState()),
    projectionConfig: {
      centerDepth: 10,
      depthHysteresis: 0.5,
      interpolationRate: 0,
      maxDeltaSeconds: 0.1,
      expectedRecordCount: 21,
      expectedKindCounts: { CENTER: 1, CARDINAL: 4, CHILD: 16 }
    }
  });
  interactions = createInteractionAuthority({ controller, planet, compositor });

  bindUi();
  controller.subscribe(scheduleProjection);
  new ResizeObserver(scheduleProjection).observe(ui.field);

  Object.defineProperty(window, "__UNIVERSAL_COMPASS_REFERENCE__", {
    value: Object.freeze({
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

  projectFrame(performance.now());
  root.dataset.compassRuntime = "ready";
  setReceipt("BOOTSTRAP_READY");
}

try {
  initialize();
} catch (error) {
  root.dataset.compassRuntime = "error";
  ui.status.textContent = "Initialization failed";
  ui.receipt.textContent = error.message;
  console.error(error);
}
