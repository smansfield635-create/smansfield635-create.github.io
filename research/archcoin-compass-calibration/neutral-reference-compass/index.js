import {
  PRESENTATION,
  POINTER_KIND,
  deepFreeze
} from "../../../assets/compass-model/compass.contracts.js";
import {
  cameraBasis,
  dot3,
  subtract3
} from "../../../assets/compass-model/compass.math.js";
import { createNodeRegistry } from "../../../assets/compass-model/compass.nodes.js";
import { createWorldAuthority } from "../../../assets/compass-model/compass.world.js";
import { createCompassController } from "../../../assets/compass-model/compass.controller.js";
import { createInteractionAuthority } from "../../../assets/compass-model/compass.interactions.js";
import { createCompositor } from "../../../assets/compass-model/compass.compositor.js";
import { NEUTRAL_REFERENCE_PROFILE } from "../../../assets/compass-model/compass.profiles.js";
import {
  NAVIGATION_EFFECT,
  createAdapters
} from "../../../assets/compass-model/compass.adapters.js";

const root = document.querySelector("[data-reference-root]");
const field = document.querySelector("[data-reference-field]");
const visualLayer = document.querySelector("[data-reference-visual]");
const semanticLayer = document.querySelector("[data-reference-semantic]");
const statusOutput = document.querySelector("[data-reference-status]");
const receiptOutput = document.querySelector("[data-reference-receipt]");
const constellationButton = document.querySelector("[data-reference-constellation]");
const clusterButton = document.querySelector("[data-reference-cluster]");
const holdButton = document.querySelector("[data-reference-hold]");
const reducedMotionButton = document.querySelector("[data-reference-reduced-motion]");

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
    semantic: {
      label: `Coordinate ${index + 1}`,
      description: `Synthetic cardinal coordinate ${index + 1}.`
    }
  })),
  ...CLUSTER_VECTORS.map((baseVector, index) => ({
    id: `neutral-member-${index + 1}`,
    kind: "member",
    domain: "neutral-cluster",
    routeKey: `neutral-member-route-${index + 1}`,
    presentation: PRESENTATION.CLUSTER,
    baseVector,
    semantic: {
      label: `Member ${index + 1}`,
      description: `Synthetic cluster member ${index + 1}.`
    }
  }))
];

const nodes = createNodeRegistry(definitions);
let latestWorld = null;
let latestProjection = null;
let navigationReceipt = null;
let lastInteractionReceipt = null;
let publicCorridorReceipt = null;

function projectWorldPoint(input) {
  const basis = cameraBasis(input.camera);
  const relative = subtract3(input.worldPosition, input.camera.eye);
  const viewDepth = dot3(relative, basis.forward);
  const safeDepth = Math.max(input.camera.near, viewDepth);
  const rect = field.getBoundingClientRect();
  const focal = Math.max(1, Math.min(rect.width, rect.height) * 0.72);
  const screenX = rect.width * 0.5 +
    dot3(relative, basis.right) * focal / safeDepth;
  const screenY = rect.height * 0.5 -
    dot3(relative, basis.up) * focal / safeDepth;
  const normalizedDepth = Math.min(
    1,
    Math.max(
      0,
      (viewDepth - input.camera.near) /
        (input.camera.far - input.camera.near)
    )
  );

  return deepFreeze({
    nodeId: input.nodeId,
    worldRevision: input.worldRevision,
    screenX,
    screenY,
    radiusPx: Math.max(24, Math.min(54, focal * 0.16 / safeDepth)),
    viewDepth,
    normalizedDepth,
    visible:
      viewDepth >= input.camera.near &&
      viewDepth <= input.camera.far
  });
}

function renderFrame(snapshot) {
  visualLayer.replaceChildren();
  semanticLayer.replaceChildren();

  snapshot.records.forEach(composite => {
    const { world, visual, projection } = composite;
    if (!projection.visible || !visual.visible) return;

    const visualElement = document.createElement("span");
    visualElement.className = "reference-node-visual";
    visualElement.dataset.depth = projection.depthLayer;
    visualElement.style.left = `${projection.screenX}px`;
    visualElement.style.top = `${projection.screenY}px`;
    visualElement.style.opacity = String(visual.opacity);
    visualElement.style.setProperty(
      "--node-size",
      `${Math.max(34, projection.radiusPx * 1.15 * visual.scale)}px`
    );
    visualLayer.append(visualElement);

    const control = document.createElement("button");
    control.type = "button";
    control.className = "reference-node-control";
    control.dataset.nodeId = composite.id;
    control.style.left = `${projection.screenX}px`;
    control.style.top = `${projection.screenY}px`;
    control.textContent = world.semantic.label;
    control.setAttribute(
      "aria-label",
      `${world.semantic.label}. ${world.semantic.description}`
    );
    control.setAttribute(
      "aria-pressed",
      String(controller.getState().selectedId === composite.id)
    );
    control.addEventListener("click", () => {
      controller.select(composite.id);
      navigationReceipt = controller.navigate(world.routeKey);
      refresh("semantic-select");
    });
    semanticLayer.append(control);
  });

  return deepFreeze({ renderedRecordCount: snapshot.records.length });
}

const routes = deepFreeze(Object.fromEntries(
  definitions.map(definition => [definition.routeKey, `#${definition.id}`])
));

const adapters = createAdapters({
  routes,
  navigationEffect: NAVIGATION_EFFECT.LOCAL_RECEIPT,
  navigate(route) {
    return deepFreeze({
      accepted: true,
      mode: "LOCAL_FRAGMENT_RECEIPT_ONLY",
      route
    });
  },
  projectWorldPoint,
  renderFrame,
  semanticPublisher(snapshot) {
    return deepFreeze({
      published: true,
      recordCount: snapshot.records.length,
      worldRevision: snapshot.worldRevision
    });
  }
});

const world = createWorldAuthority({
  profile: NEUTRAL_REFERENCE_PROFILE,
  nodes
});
const compositor = createCompositor({
  profile: NEUTRAL_REFERENCE_PROFILE,
  adapters
});
const controller = createCompassController({
  profile: NEUTRAL_REFERENCE_PROFILE,
  adapters,
  nodes,
  world
});
const interactions = createInteractionAuthority({
  profile: NEUTRAL_REFERENCE_PROFILE,
  controller,
  compositor,
  world,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
});

function refresh(action = "refresh") {
  const state = controller.getState();
  latestWorld = world.evaluate({
    presentation: state.presentation,
    orientation: state.orientation
  });
  latestProjection = compositor.project(latestWorld);
  compositor.render(latestProjection);
  adapters.publishSemantic(latestProjection);

  outputs.selection.textContent = state.selectedId || "No node selected";
  outputs.presentation.textContent = state.presentation;
  outputs.primary.textContent = latestWorld.primaryId || "None";
  outputs.worldRevision.textContent = String(latestWorld.worldRevision);
  outputs.projectionRevision.textContent = String(
    latestProjection.projectionRevision
  );
  outputs.controllerRevision.textContent = String(state.revision);
  statusOutput.textContent = state.held ? "HELD" : state.orientationPhase;

  constellationButton.disabled =
    state.held || state.presentation === PRESENTATION.CONSTELLATION;
  clusterButton.disabled =
    state.held || state.presentation === PRESENTATION.CLUSTER;
  holdButton.textContent = state.held ? "Leave held state" : "Enter held state";
  holdButton.setAttribute("aria-pressed", String(state.held));
  reducedMotionButton.textContent = interactions.getReducedMotion()
    ? "Reduced motion: on"
    : "Reduced motion: off";
  reducedMotionButton.setAttribute(
    "aria-pressed",
    String(interactions.getReducedMotion())
  );

  const receipt = deepFreeze({
    action,
    modelStatus: "CANDIDATE_NOT_ADMITTED",
    presentation: state.presentation,
    held: state.held,
    controllerPrimaryId: state.primaryId,
    worldPrimaryId: latestWorld.primaryId,
    primaryAgreement:
      !state.primaryId || state.primaryId === latestWorld.primaryId,
    selectedId: state.selectedId,
    navigationReceipt,
    lastInteractionReceipt,
    publicCorridorReceipt,
    adapterReceipt: adapters.receipt(),
    optionalCapabilities: NEUTRAL_REFERENCE_PROFILE.optionalCapabilities,
    productionAuthority: false
  });

  receiptOutput.textContent = JSON.stringify(receipt);
  root.dataset.referenceStatus = "ready";
}

function transitionPresentation(presentation) {
  if (presentation === PRESENTATION.CLUSTER) {
    controller.openCluster();
  } else {
    controller.returnToConstellation();
  }
}

function executePublicCorridor() {
  const initial = controller.getState();
  controller.openCluster();
  const clusterState = controller.getState();
  const clusterSnapshot = world.evaluate({
    presentation: clusterState.presentation,
    orientation: clusterState.orientation
  });
  controller.returnToConstellation();
  const restored = controller.getState();
  const constellationSnapshot = world.evaluate({
    presentation: restored.presentation,
    orientation: restored.orientation
  });

  publicCorridorReceipt = deepFreeze({
    schema: "NEUTRAL_REFERENCE_PUBLIC_CORRIDOR_RECEIPT_v1",
    initialPresentation: initial.presentation,
    clusterPresentation: clusterState.presentation,
    clusterRecordCount: clusterSnapshot.records.length,
    restoredPresentation: restored.presentation,
    constellationRecordCount: constellationSnapshot.records.length,
    privateMutationUsed: false,
    pass:
      initial.presentation === PRESENTATION.CONSTELLATION &&
      clusterState.presentation === PRESENTATION.CLUSTER &&
      clusterSnapshot.records.length === 4 &&
      restored.presentation === PRESENTATION.CONSTELLATION &&
      constellationSnapshot.records.length === 4
  });
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
  lastInteractionReceipt = interactions.begin({
    id: event.pointerId,
    kind: pointerKind(event),
    x: event.clientX,
    y: event.clientY,
    timestamp: event.timeStamp,
    targetId: event.target.closest("[data-node-id]")?.dataset.nodeId || ""
  });
  refresh("pointer-begin");
});

field.addEventListener("pointermove", event => {
  if (!interactions.getActive()) return;
  lastInteractionReceipt = interactions.move({
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    timestamp: event.timeStamp
  });
  refresh("pointer-move");
});

function endPointer(event, cancel = false) {
  if (!interactions.getActive()) return;
  lastInteractionReceipt = interactions.end(
    {
      id: event.pointerId,
      timestamp: event.timeStamp
    },
    { cancel }
  );
  if (field.hasPointerCapture(event.pointerId)) {
    field.releasePointerCapture(event.pointerId);
  }
  refresh(cancel ? "pointer-cancel" : "pointer-end");
}

field.addEventListener("pointerup", event => endPointer(event, false));
field.addEventListener("pointercancel", event => endPointer(event, true));
window.addEventListener("blur", () => {
  lastInteractionReceipt = interactions.interrupt("window-blur");
  refresh("window-blur");
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  lastInteractionReceipt = interactions.interrupt("document-hidden");
  refresh("document-hidden");
});
window.addEventListener("resize", () => refresh("resize"));

constellationButton.addEventListener("click", () => {
  transitionPresentation(PRESENTATION.CONSTELLATION);
});
clusterButton.addEventListener("click", () => {
  transitionPresentation(PRESENTATION.CLUSTER);
});
holdButton.addEventListener("click", () => {
  if (controller.getState().held) {
    controller.leaveHeld();
  } else {
    controller.enterHeld("neutral-reference-control");
  }
});
reducedMotionButton.addEventListener("click", () => {
  interactions.setReducedMotion(!interactions.getReducedMotion());
  refresh("reduced-motion-toggle");
});

executePublicCorridor();
refresh("initialize");
