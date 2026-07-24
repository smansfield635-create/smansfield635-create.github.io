/* Universal Compass browser bootstrap and DOM mount adapter. */

import { createPlanetAuthority } from "./index.planet.js";
import { buildUvSphereShape, createCrystalAuthority } from "./index.crystals.js";
import { createCompassController } from "./index.controller.js";
import { createCompositor } from "./index.compositor.js";
import { createInteractionAuthority } from "./index.interactions.js";

const root = document.documentElement;
const get = selector => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`COMPASS_MOUNT_MISSING:${selector}`);
  return element;
};

const ui = Object.freeze({
  status: get("[data-reference-status]"),
  field: get("[data-reference-field]"),
  visual: get("[data-reference-visual]"),
  semantic: get("[data-reference-semantic]"),
  selection: get("[data-reference-selection]"),
  presentation: get("[data-reference-presentation]"),
  primary: get("[data-reference-primary]"),
  worldRevision: get("[data-reference-world-revision]"),
  projectionRevision: get("[data-reference-projection-revision]"),
  controllerRevision: get("[data-reference-controller-revision]"),
  receipt: get("[data-reference-receipt]"),
  constellation: get("[data-reference-constellation]"),
  cluster: get("[data-reference-cluster]"),
  hold: get("[data-reference-hold]"),
  reducedMotion: get("[data-reference-reduced-motion]")
});

const CENTER = Object.freeze([0, 0, 10]);
const CAMERA_OFFSET = Object.freeze([0, 0, -10]);
const CAMERA_UP = Object.freeze([0, 1, 0]);
const IDENTITY = Object.freeze([0, 0, 0, 1]);

let planet;
let controller;
let compositor;
let interactions;
let worldSnapshot;
let crystalInput;
let lastProjection;
let lastFrameTime = 0;
let framePending = false;
let cameraSignature = "";
let activePointerId = "";
let receipt = "No local receipt yet.";

function normalizeQuaternion(value = IDENTITY) {
  const q = Array.from(value, Number);
  const length = Math.hypot(...q);
  return q.length === 4 && length > 1e-8
    ? q.map(component => component / length)
    : [...IDENTITY];
}

function rotate(vector, quaternion) {
  const [x, y, z, w] = normalizeQuaternion(quaternion);
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

function activeOrientation(state = controller.getState()) {
  return state.presentation === "CONSTELLATION"
    ? state.constellation
    : state.clusters[state.activeCardinalId];
}

function cameraFor(state = controller.getState()) {
  const [x, y, z, w] = normalizeQuaternion(activeOrientation(state)?.quaternion);
  const inverse = [-x, -y, -z, w];
  const offset = rotate(CAMERA_OFFSET, inverse);
  return Object.freeze({
    position: Object.freeze(CENTER.map((value, index) => value + offset[index])),
    target: CENTER,
    up: Object.freeze(rotate(CAMERA_UP, inverse)),
    fieldOfViewYDegrees: 60,
    near: 0.1,
    far: 100
  });
}

function cameraGap(a, b) {
  return Math.max(
    ...a.position.map((value, index) => Math.abs(value - b.position[index])),
    ...a.up.map((value, index) => Math.abs(value - b.up[index]))
  );
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

function mount(projection) {
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
    const anchor = record.projectedSemanticAnchor || record;
    button.type = "button";
    button.className = "reference-node-control";
    button.dataset.nodeId = record.id;
    button.dataset.nodeKind = record.kind;
    button.style.left = `${anchor.screenX}px`;
    button.style.top = `${anchor.screenY}px`;
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
  ui.primary.textContent = orientation?.previewPrimaryId || orientation?.primaryId || "Pending";
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
  const state = controller.getState();
  const targetCamera = cameraFor(state);
  const signature = JSON.stringify(targetCamera);
  if (signature !== cameraSignature) {
    compositor.setCamera(targetCamera);
    cameraSignature = signature;
  }

  const bounds = ui.field.getBoundingClientRect();
  const deltaSeconds = lastFrameTime
    ? Math.min(0.1, Math.max(0, (timestamp - lastFrameTime) / 1000))
    : 1 / 60;
  lastFrameTime = timestamp;

  const projection = compositor.project({
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
  });

  mount(projection);
  if (!state.reducedMotion && cameraGap(projection.camera, targetCamera) > 0.0005) scheduleProjection();
}

function scheduleProjection() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(projectFrame);
}

function acceptTarget({ targetId, kind }) {
  const state = controller.getState();
  if (state.held) return;
  if (kind === "CARDINAL" && state.presentation === "CONSTELLATION") {
    controller.openCluster(targetId);
    setReceipt(`OPENED_CLUSTER · ${targetId}`);
  } else if (
    kind === "CHILD" &&
    state.presentation === "CLUSTER" &&
    planet.isChildOfCardinal(targetId, state.activeCardinalId)
  ) {
    controller.selectChild(targetId);
    setReceipt(`SELECTED_CHILD · ${targetId}`);
  }
}

function processInteraction(result) {
  if (!result) return;
  setReceipt(result.mode || result.reason || result.phase || "INTERACTION");
  if (result.mode === "TAP_PROPOSAL" && result.targetProposal) {
    acceptTarget(result.targetProposal);
  }
  scheduleProjection();
}

function interrupt(reason) {
  if (!interactions.getActive()) return;
  processInteraction(interactions.interrupt(reason));
  activePointerId = "";
}

function point(event) {
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
    const state = controller.getState();
    const candidate = activeOrientation(state)?.primaryId;
    controller.openCluster(planet.hasCardinal(candidate) ? candidate : "NORTH");
  });

  ui.hold.addEventListener("click", () => {
    const state = controller.getState();
    if (state.held) controller.leaveHeld();
    else {
      interrupt("held-control");
      controller.enterHeld("reference-control");
    }
  });

  ui.reducedMotion.addEventListener("click", () => {
    const state = controller.getState();
    controller.setReducedMotion(!state.reducedMotion);
  });

  ui.semantic.addEventListener("click", event => {
    if (event.detail !== 0) return;
    const button = event.target.closest(".reference-node-control");
    if (button) acceptTarget({ targetId: button.dataset.nodeId, kind: button.dataset.nodeKind });
  });

  ui.field.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const local = point(event);
    const target = event.target.closest(".reference-node-control");
    const result = interactions.begin({
      id: String(event.pointerId),
      kind: pointerKind(event.pointerType),
      x: local.x,
      y: local.y,
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
    const local = point(event);
    processInteraction(interactions.move({
      id: activePointerId,
      x: local.x,
      y: local.y,
      timestamp: Math.max(0, event.timeStamp)
    }));
    event.preventDefault();
  });

  const endPointer = (event, cancel) => {
    if (activePointerId !== String(event.pointerId)) return;
    const local = point(event);
    processInteraction(interactions.end({
      id: activePointerId,
      x: local.x,
      y: local.y,
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
      CENTER: Object.freeze({ shapeId: "NEUTRAL_SPHERE", visualScale: Object.freeze([1, 1, 1]), materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"]) }),
      CARDINAL: Object.freeze({ shapeId: "NEUTRAL_SPHERE", visualScale: Object.freeze([0.8, 0.8, 0.8]), materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"]) }),
      CHILD: Object.freeze({ shapeId: "NEUTRAL_SPHERE", visualScale: Object.freeze([0.55, 0.55, 0.55]), materialRegionIds: Object.freeze(["NEUTRAL_SURFACE"]) })
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
    cameraConfig: cameraFor(controller.getState()),
    projectionConfig: {
      centerDepth: 10,
      depthHysteresis: 0.5,
      interpolationRate: 12,
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
