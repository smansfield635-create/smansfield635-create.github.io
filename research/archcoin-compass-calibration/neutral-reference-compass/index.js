import { PRESENTATION, POINTER_KIND } from "../../../assets/compass-model/compass.contracts.js";
import { cameraBasis, dot3, normalize3, subtract3 } from "../../../assets/compass-model/compass.math.js";
import { createNodeRegistry } from "../../../assets/compass-model/compass.nodes.js";
import { createWorldAuthority } from "../../../assets/compass-model/compass.world.js";
import { createCompassController } from "../../../assets/compass-model/compass.controller.js";
import { createInteractionAuthority } from "../../../assets/compass-model/compass.interactions.js";
import { createCompositor } from "../../../assets/compass-model/compass.compositor.js";
import { NEUTRAL_REFERENCE_PROFILE } from "../../../assets/compass-model/compass.profiles.js";
import { createAdapters } from "../../../assets/compass-model/compass.adapters.js";

const root = document.querySelector("[data-reference-root]");
const field = document.querySelector("[data-reference-field]");
const visualLayer = document.querySelector("[data-reference-visual]");
const semanticLayer = document.querySelector("[data-reference-semantic]");
const statusOutput = document.querySelector("[data-reference-status]");
const receiptOutput = document.querySelector("[data-reference-receipt]");

const outputs = Object.freeze({
  selection: document.querySelector("[data-reference-selection]"),
  presentation: document.querySelector("[data-reference-presentation]"),
  primary: document.querySelector("[data-reference-primary]"),
  worldRevision: document.querySelector("[data-reference-world-revision]"),
  projectionRevision: document.querySelector("[data-reference-projection-revision]"),
  controllerRevision: document.querySelector("[data-reference-controller-revision]")
});

const CONSTELLATION_VECTORS = Object.freeze([
  [0, 1, 0],
  [1, 0, 0],
  [0, -1, 0],
  [-1, 0, 0]
]);

const CLUSTER_VECTORS = Object.freeze([
  [0, 0.48, -0.88],
  [0.88, -0.18, 0.44],
  [0, -0.48, 0.88],
  [-0.88, -0.18, 0.44]
]);

const definitions = [
  ...CONSTELLATION_VECTORS.map((baseVector, index) => ({
    id: `neutral-cardinal-${index + 1}`,
    kind: "cardinal",
    domain: `neutral-domain-${index + 1}`,
    routeKey: `neutral-route-${index + 1}`,
    presentation: PRESENTATION.CONSTELLATION,
    baseVector,
    semantic: { label: `Coordinate ${index + 1}`, description: `Synthetic cardinal coordinate ${index + 1}.` }
  })),
  ...CLUSTER_VECTORS.map((baseVector, index) => ({
    id: `neutral-member-${index + 1}`,
    kind: "member",
    domain: "neutral-cluster",
    routeKey: `neutral-member-route-${index + 1}`,
    presentation: PRESENTATION.CLUSTER,
    baseVector,
    semantic: { label: `Member ${index + 1}`, description: `Synthetic cluster member ${index + 1}.` }
  }))
];

const nodes = createNodeRegistry(definitions);
let controller;
let world;
let compositor;
let interactions;
let latestWorld = null;
let latestProjection = null;
let navigationReceipt = null;
let clusterValidation = null;

function projectWorldPoint(worldPosition, camera) {
  const basis = cameraBasis(camera);
  const relative = subtract3(worldPosition, camera.eye);
  const viewDepth = dot3(relative, basis.forward);
  const safeDepth = Math.max(0.35, viewDepth);
  const rect = field.getBoundingClientRect();
  const focal = Math.min(rect.width, rect.height) * 0.72;
  const x = rect.width * 0.5 + dot3(relative, basis.right) * focal / safeDepth;
  const y = rect.height * 0.5 - dot3(relative, basis.up) * focal / safeDepth;
  return Object.freeze({
    x,
    y,
    viewDepth,
    radiusPx: Math.max(24, Math.min(54, focal * 0.16 / safeDepth)),
    visible: viewDepth > camera.near && viewDepth < camera.far
  });
}

function renderFrame(snapshot) {
  visualLayer.replaceChildren();
  semanticLayer.replaceChildren();

  snapshot.records.forEach(record => {
    const visual = document.createElement("span");
    visual.className = "reference-node-visual";
    visual.dataset.depth = record.depthLayer;
    visual.style.left = `${record.x}px`;
    visual.style.top = `${record.y}px`;
    visual.style.setProperty("--node-size", `${Math.max(34, record.radiusPx * 1.15)}px`);
    visualLayer.append(visual);

    const control = document.createElement("button");
    control.type = "button";
    control.className = "reference-node-control";
    control.dataset.nodeId = record.id;
    control.style.left = `${record.x}px`;
    control.style.top = `${record.y}px`;
    control.textContent = record.semantic.label;
    control.setAttribute("aria-label", `${record.semantic.label}. ${record.semantic.description}`);
    control.setAttribute("aria-pressed", String(controller.getState().selectedId === record.id));
    control.addEventListener("click", () => {
      controller.select(record.id);
      navigationReceipt = controller.navigate(record.routeKey);
      refresh("semantic-select");
    });
    semanticLayer.append(control);
  });

  return Object.freeze({ renderedRecordCount: snapshot.records.length });
}

const routes = Object.freeze(Object.fromEntries(
  definitions.map(definition => [definition.routeKey, `#${definition.id}`])
));

const adapters = createAdapters({
  routes,
  navigate(route) {
    return Object.freeze({ accepted: true, mode: "LOCAL_FRAGMENT_RECEIPT_ONLY", route });
  },
  projectWorldPoint,
  renderFrame,
  semanticPublisher(snapshot) {
    return Object.freeze({ published: true, recordCount: snapshot.records.length });
  }
});

world = createWorldAuthority({ profile: NEUTRAL_REFERENCE_PROFILE, nodes });
compositor = createCompositor({ profile: NEUTRAL_REFERENCE_PROFILE, adapters, nodes });
controller = createCompassController({ profile: NEUTRAL_REFERENCE_PROFILE, adapters, nodes });
interactions = createInteractionAuthority({ profile: NEUTRAL_REFERENCE_PROFILE, controller, compositor });

function validateClusterRecords() {
  const snapshot = world.evaluate({
    presentation: PRESENTATION.CLUSTER,
    orientation: [0, 0, 0, 1]
  });
  const uniqueIds = new Set(snapshot.records.map(record => record.id));
  clusterValidation = Object.freeze({
    recordCount: snapshot.records.length,
    uniqueIdCount: uniqueIds.size,
    finiteWorldPositions: snapshot.records.every(record => record.worldPosition.every(Number.isFinite)),
    publicControllerTransitionAvailable: typeof controller.setPresentation === "function"
  });
}

function refresh(action = "refresh") {
  const state = controller.getState();
  latestWorld = world.evaluate({ presentation: state.presentation, orientation: state.orientation });
  latestProjection = compositor.project(latestWorld);
  compositor.render(latestProjection);
  adapters.publishSemantic(latestProjection);

  outputs.selection.textContent = state.selectedId || "No node selected";
  outputs.presentation.textContent = state.presentation;
  outputs.primary.textContent = latestWorld.primaryId || "None";
  outputs.worldRevision.textContent = String(latestWorld.worldRevision);
  outputs.projectionRevision.textContent = String(latestProjection.projectionRevision);
  outputs.controllerRevision.textContent = String(state.revision);
  statusOutput.textContent = state.held ? "HELD" : state.orientationPhase;

  const receipt = Object.freeze({
    action,
    modelStatus: "CANDIDATE_NOT_ADMITTED",
    controllerPrimaryId: state.primaryId,
    worldPrimaryId: latestWorld.primaryId,
    primaryAgreement: !state.primaryId || state.primaryId === latestWorld.primaryId,
    selectedId: state.selectedId,
    navigationReceipt,
    clusterValidation,
    adapterReceipt: adapters.receipt(),
    optionalCapabilities: NEUTRAL_REFERENCE_PROFILE.optionalCapabilities,
    productionAuthority: false
  });
  receiptOutput.textContent = JSON.stringify(receipt);
  root.dataset.referenceStatus = "ready";
}

controller.subscribe(() => refresh("controller-publication"));

function pointerKind(event) {
  if (event.pointerType === "touch") return POINTER_KIND.TOUCH;
  if (event.pointerType === "pen") return POINTER_KIND.PEN;
  return POINTER_KIND.MOUSE;
}

field.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  field.setPointerCapture(event.pointerId);
  interactions.begin({ id: event.pointerId, kind: pointerKind(event), x: event.clientX, y: event.clientY });
});

field.addEventListener("pointermove", event => {
  if (!interactions.getActive()) return;
  interactions.move({ id: event.pointerId, x: event.clientX, y: event.clientY });
});

function endPointer(event, cancel = false) {
  if (!interactions.getActive()) return;
  interactions.end({ id: event.pointerId }, { cancel });
  if (field.hasPointerCapture(event.pointerId)) field.releasePointerCapture(event.pointerId);
}

field.addEventListener("pointerup", event => endPointer(event, false));
field.addEventListener("pointercancel", event => endPointer(event, true));
window.addEventListener("blur", () => interactions.interrupt("window-blur"));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) interactions.interrupt("document-hidden");
});
window.addEventListener("resize", () => refresh("resize"));

validateClusterRecords();
refresh("initialize");
