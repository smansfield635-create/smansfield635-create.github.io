import { preserveTestsEntryContext, bindTestsEntry } from "./adapters/tests-compass-entry-adapter.v1.mjs";
import { restoreTestsPriorContext } from "./adapters/tests-compass-return-adapter.v1.mjs";
import { createTestsFieldState, cloneTestsFieldState } from "./adapters/tests-field-state-adapter.v1.mjs";
import { proposeTestsFocus } from "./adapters/tests-focus-adapter.v1.mjs";
import { projectTestsNeighbors } from "./adapters/tests-neighbor-projection-adapter.v1.mjs";
import { transitionTestsDepth } from "./adapters/tests-depth-transformation-adapter.v1.mjs";
import { createTestsManipulationSession, updateTestsManipulation, cancelTestsManipulation, settleTestsManipulation } from "./adapters/tests-direct-manipulation-adapter.v1.mjs";
import { calculateTestsProjection } from "./adapters/tests-responsive-projection-adapter.v1.mjs";
import { snapshotTestsContinuity, restoreTestsContinuity } from "./adapters/tests-continuity-state-adapter.v1.mjs";

const REGISTRY_URL = new URL("../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", import.meta.url);
const AUTHORIZED_DEPTHS = Object.freeze(["L0", "L1"]);

const EXPECTED = Object.freeze({
  projection: "METHODS",
  objects: Object.freeze([
    Object.freeze({ id: "METHODS", className: "METHOD" }),
    Object.freeze({ id: "ROUTE_OPERATOR_PLATFORM", className: "METHOD" }),
    Object.freeze({ id: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO", className: "TEST_INSTANCE" })
  ]),
  relations: Object.freeze([
    Object.freeze({ id: "METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", source: "METHODS", relation: "GOVERNS_PROCEDURE_FOR", target: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO" }),
    Object.freeze({ id: "ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", source: "ROUTE_OPERATOR_PLATFORM", relation: "EXECUTES", target: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO" })
  ])
});

const els = {
  viewport: document.querySelector("#spatial-viewport"),
  objectLayer: document.querySelector("#object-layer"),
  relationSvg: document.querySelector("#relation-layer"),
  relationPaths: document.querySelector("#relation-paths"),
  relationLabels: document.querySelector("#relation-label-layer"),
  relationKey: document.querySelector("#relation-key-items"),
  failure: document.querySelector("#field-failure"),
  focusStatus: document.querySelector("#focus-status"),
  focusReadout: document.querySelector("#focus-readout"),
  trailFocus: document.querySelector("#trail-focus"),
  depthReadout: document.querySelector("#depth-readout"),
  previous: document.querySelector("#focus-previous"),
  next: document.querySelector("#focus-next"),
  restore: document.querySelector("#restore-entry-context"),
  depthButtons: [...document.querySelectorAll("[data-depth]")]
};

let registry = null;
let fieldState = null;
let entrySnapshot = null;
let continuitySnapshot = null;
let manipulation = null;
let projection = null;
let resizeFrame = 0;
let layoutFrame = 0;
let wheelLock = false;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function sorted(values) {
  return [...values].sort();
}

function relationSignature(value) {
  return `${value.SOURCE_OBJECT}|${value.RELATION}|${value.TARGET_OBJECT}`;
}

function expectedRelationSignature(value) {
  return `${value.source}|${value.relation}|${value.target}`;
}

function validateRegistry(value) {
  invariant(value?.schema === "WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1", "REGISTRY_SCHEMA_MISMATCH");
  invariant(value?.projectionSelection?.PROJECTION === EXPECTED.projection, "PROJECTION_MISMATCH");
  invariant(value?.projectionSelection?.objectCount === 3, "OBJECT_COUNT_METADATA_MISMATCH");
  invariant(Array.isArray(value.objects) && value.objects.length === 3, "OBJECT_COUNT_MISMATCH");
  invariant(Array.isArray(value.relations) && value.relations.length === 2, "RELATION_COUNT_MISMATCH");

  const actualObjectIds = sorted(value.objects.map((object) => object.OBJECT_ID));
  const expectedObjectIds = sorted(EXPECTED.objects.map((object) => object.id));
  invariant(JSON.stringify(actualObjectIds) === JSON.stringify(expectedObjectIds), "OBJECT_ID_SET_MISMATCH");

  for (const expected of EXPECTED.objects) {
    const object = value.objects.find((candidate) => candidate.OBJECT_ID === expected.id);
    invariant(Boolean(object), `OBJECT_MISSING:${expected.id}`);
    invariant(object.OBJECT_CLASS === expected.className, `OBJECT_CLASS_MISMATCH:${expected.id}`);
    invariant(object.PROJECTION === EXPECTED.projection, `OBJECT_PROJECTION_MISMATCH:${expected.id}`);
    invariant(object.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `OBJECT_AUTHORITY_SOURCE_MISMATCH:${expected.id}`);
    invariant(Boolean(object.AUTHORITY_POINTER), `OBJECT_AUTHORITY_POINTER_MISSING:${expected.id}`);
    invariant(object.DEEP_ENTRY_AVAILABLE === false, `DEEP_ENTRY_MUST_REMAIN_FALSE:${expected.id}`);
    invariant(object.DEEP_ENTRY_TARGET === null, `DEEP_ENTRY_TARGET_MUST_REMAIN_NULL:${expected.id}`);
  }

  const actualRelationIds = sorted(value.relations.map((relation) => relation.RELATION_ID));
  const expectedRelationIds = sorted(EXPECTED.relations.map((relation) => relation.id));
  invariant(JSON.stringify(actualRelationIds) === JSON.stringify(expectedRelationIds), "RELATION_ID_SET_MISMATCH");

  const actualSignatures = sorted(value.relations.map(relationSignature));
  const expectedSignatures = sorted(EXPECTED.relations.map(expectedRelationSignature));
  invariant(JSON.stringify(actualSignatures) === JSON.stringify(expectedSignatures), "RELATION_DIRECTION_OR_IDENTITY_MISMATCH");

  for (const relation of value.relations) {
    invariant(relation.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `RELATION_AUTHORITY_SOURCE_MISMATCH:${relation.RELATION_ID}`);
    invariant(Boolean(relation.AUTHORITY_POINTER), `RELATION_AUTHORITY_POINTER_MISSING:${relation.RELATION_ID}`);
  }

  invariant(value.populationBoundary?.researchContentCopied === false, "RESEARCH_CONTENT_COPY_PROHIBITED");
  invariant(value.publicMutationAuthorized === false, "PUBLIC_MUTATION_MUST_REMAIN_FALSE");
  invariant(value.scientificClaimUpgrade === false, "SCIENTIFIC_CLAIM_UPGRADE_MUST_REMAIN_FALSE");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function humanizeRelation(relation) {
  if (relation === "GOVERNS_PROCEDURE_FOR") return "governs procedure for";
  if (relation === "EXECUTES") return "executes";
  return relation.toLowerCase().replaceAll("_", " ");
}

function objectById(id) {
  return registry.objects.find((object) => object.OBJECT_ID === id);
}

function activeLabel() {
  return objectById(fieldState.activeObject)?.DISPLAY_LABEL || fieldState.activeObject;
}

function createObjectNode(object) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "object-node";
  button.dataset.objectId = object.OBJECT_ID;
  button.dataset.objectClass = object.OBJECT_CLASS;
  button.dataset.active = "false";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `${object.DISPLAY_LABEL}, ${object.OBJECT_CLASS}. Focus object.`);

  const className = document.createElement("span");
  className.className = "object-node-class";
  className.textContent = object.OBJECT_CLASS;

  const label = document.createElement("span");
  label.className = "object-node-label";
  label.textContent = object.DISPLAY_LABEL;

  const id = document.createElement("span");
  id.className = "object-node-id";
  id.textContent = object.OBJECT_ID;

  button.append(className, label, id);
  button.addEventListener("click", () => commitFocus(object.OBJECT_ID, "POINTER_OR_ACTIVATION"));
  button.addEventListener("keydown", handleObjectKeydown);
  return button;
}

function renderObjects() {
  els.objectLayer.replaceChildren();
  for (const expected of EXPECTED.objects) {
    els.objectLayer.append(createObjectNode(objectById(expected.id)));
  }
}

function renderRelations() {
  els.relationPaths.replaceChildren();
  els.relationLabels.replaceChildren();
  els.relationKey.replaceChildren();

  for (const relation of registry.relations) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.dataset.relationId = relation.RELATION_ID;
    path.dataset.sourceObject = relation.SOURCE_OBJECT;
    path.dataset.targetObject = relation.TARGET_OBJECT;
    path.dataset.relation = relation.RELATION;
    path.dataset.incident = "false";
    path.setAttribute("marker-end", "url(#relation-arrow)");
    els.relationPaths.append(path);

    const label = document.createElement("div");
    label.className = "relation-label";
    label.dataset.relationId = relation.RELATION_ID;
    label.dataset.incident = "false";
    label.textContent = humanizeRelation(relation.RELATION);
    els.relationLabels.append(label);

    const source = objectById(relation.SOURCE_OBJECT);
    const target = objectById(relation.TARGET_OBJECT);
    const key = document.createElement("div");
    key.className = "relation-key-item";
    key.dataset.relationId = relation.RELATION_ID;
    key.innerHTML = `<strong>${escapeHtml(source.DISPLAY_LABEL)}</strong> → ${escapeHtml(humanizeRelation(relation.RELATION))} → <strong>${escapeHtml(target.DISPLAY_LABEL)}</strong>`;
    els.relationKey.append(key);
  }
}

function updateProjection() {
  const rect = els.viewport.getBoundingClientRect();
  projection = calculateTestsProjection(rect.width, rect.height, fieldState.orientation.depth);
  const placements = projectTestsNeighbors(fieldState.objectIds, fieldState.activeObject, fieldState.orientation.angle, projection);

  for (const placement of placements) {
    const node = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(placement.id)}"]`);
    if (!node) continue;
    const active = placement.id === fieldState.activeObject;
    node.dataset.active = active ? "true" : "false";
    node.setAttribute("aria-pressed", active ? "true" : "false");
    node.tabIndex = active ? 0 : -1;
    node.style.width = `${projection.nodeWidth}px`;
    node.style.left = `${placement.x}px`;
    node.style.top = `${placement.y}px`;
    node.style.opacity = String(placement.opacity);
    node.style.transform = `translate(-50%, -50%) scale(${placement.scale})`;
    node.style.zIndex = String(active ? 6 : Math.round(2 + placement.front * 2));
  }

  updateIncidentPresentation();
  scheduleRelationLayout();
}

function updateIncidentPresentation() {
  for (const path of els.relationPaths.querySelectorAll("path[data-relation-id]")) {
    const incident = path.dataset.sourceObject === fieldState.activeObject || path.dataset.targetObject === fieldState.activeObject;
    path.dataset.incident = incident ? "true" : "false";
    const label = els.relationLabels.querySelector(`[data-relation-id="${CSS.escape(path.dataset.relationId)}"]`);
    if (label) label.dataset.incident = incident ? "true" : "false";
  }
}

function rectWithinViewport(element) {
  const viewportRect = els.viewport.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    cx: rect.left - viewportRect.left + rect.width / 2,
    cy: rect.top - viewportRect.top + rect.height / 2
  };
}

function boundaryDistance(rect, ux, uy) {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  const dx = Math.abs(ux) < 1e-9 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(ux);
  const dy = Math.abs(uy) < 1e-9 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(uy);
  return Math.min(dx, dy);
}

function clippedEndpoints(sourceNode, targetNode) {
  const source = rectWithinViewport(sourceNode);
  const target = rectWithinViewport(targetNode);
  const dx = target.cx - source.cx;
  const dy = target.cy - source.cy;
  const length = Math.hypot(dx, dy);
  invariant(length > 0, "RELATION_ZERO_LENGTH");
  const ux = dx / length;
  const uy = dy / length;
  const sourceDistance = boundaryDistance(source, ux, uy);
  const targetDistance = boundaryDistance(target, ux, uy);
  return {
    x1: source.cx + ux * (sourceDistance + 5),
    y1: source.cy + uy * (sourceDistance + 5),
    x2: target.cx - ux * (targetDistance + 12),
    y2: target.cy - uy * (targetDistance + 12)
  };
}

function scheduleRelationLayout() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(layoutRelations);
}

function layoutRelations() {
  const width = els.viewport.clientWidth;
  const height = els.viewport.clientHeight;
  els.relationSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  for (const path of els.relationPaths.querySelectorAll("path[data-relation-id]")) {
    const source = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(path.dataset.sourceObject)}"]`);
    const target = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(path.dataset.targetObject)}"]`);
    invariant(source && target, `RELATION_ENDPOINT_NODE_MISSING:${path.dataset.relationId}`);
    const endpoints = clippedEndpoints(source, target);
    path.setAttribute("d", `M ${endpoints.x1.toFixed(3)} ${endpoints.y1.toFixed(3)} L ${endpoints.x2.toFixed(3)} ${endpoints.y2.toFixed(3)}`);
    const label = els.relationLabels.querySelector(`[data-relation-id="${CSS.escape(path.dataset.relationId)}"]`);
    if (label) {
      label.style.left = `${((endpoints.x1 + endpoints.x2) / 2).toFixed(3)}px`;
      label.style.top = `${((endpoints.y1 + endpoints.y2) / 2).toFixed(3)}px`;
    }
  }
}

function recordNavigation(modality) {
  continuitySnapshot = snapshotTestsContinuity(fieldState);
  const receipt = Object.freeze({
    candidate: "M1_COMPASS_INTEGRATED",
    operation: "FOCUS",
    projection: "METHODS",
    activeObject: fieldState.activeObject,
    depth: fieldState.orientation.depth,
    modality,
    objectCount: fieldState.objectIds.length,
    relationCount: registry.relations.length,
    semanticMutation: false,
    scientificStateMutation: false,
    publicRouteMutation: false
  });
  window.__M1_COMPASS_INTEGRATED_RECEIPT__ = receipt;
}

function updateReadouts(modality) {
  const label = activeLabel();
  els.focusReadout.textContent = label;
  els.trailFocus.textContent = label;
  els.depthReadout.textContent = fieldState.orientation.depth === "L0" ? "L0 orientation" : "L1 field";
  els.viewport.dataset.depth = fieldState.orientation.depth;
  for (const button of els.depthButtons) {
    button.setAttribute("aria-pressed", button.dataset.depth === fieldState.orientation.depth ? "true" : "false");
  }
  els.focusStatus.textContent = `Focus moved to ${label}. Navigation changed; scientific state unchanged.`;
  recordNavigation(modality);
}

function commitFocus(target, modality) {
  const receipt = proposeTestsFocus(fieldState, target, "COMMIT");
  invariant(receipt.semanticMutation === false, "FOCUS_SEMANTIC_MUTATION_PROHIBITED");
  fieldState.orientation.angle = 0;
  updateProjection();
  updateReadouts(modality);
}

function moveFocus(delta, modality) {
  const currentIndex = fieldState.objectIds.indexOf(fieldState.activeObject);
  const nextIndex = (currentIndex + delta + fieldState.objectIds.length) % fieldState.objectIds.length;
  commitFocus(fieldState.objectIds[nextIndex], modality);
}

function handleObjectKeydown(event) {
  const keys = new Set(["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"]);
  if (!keys.has(event.key)) return;
  event.preventDefault();
  let target = fieldState.activeObject;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    const index = (fieldState.objectIds.indexOf(fieldState.activeObject) + 1) % fieldState.objectIds.length;
    target = fieldState.objectIds[index];
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    const index = (fieldState.objectIds.indexOf(fieldState.activeObject) - 1 + fieldState.objectIds.length) % fieldState.objectIds.length;
    target = fieldState.objectIds[index];
  } else if (event.key === "Home") {
    target = fieldState.objectIds[0];
  } else if (event.key === "End") {
    target = fieldState.objectIds[fieldState.objectIds.length - 1];
  }
  commitFocus(target, "KEYBOARD");
  els.objectLayer.querySelector(`[data-object-id="${CSS.escape(target)}"]`)?.focus();
}

function setDepth(nextDepth, modality) {
  invariant(AUTHORIZED_DEPTHS.includes(nextDepth), `DEPTH_TARGET_INVALID:${nextDepth}`);
  const receipt = transitionTestsDepth(fieldState, nextDepth);
  invariant(receipt.semanticMutation === false, "DEPTH_SEMANTIC_MUTATION_PROHIBITED");
  updateProjection();
  updateReadouts(modality);
}

function handlePointerDown(event) {
  if (event.button !== 0 || event.target.closest(".object-node")) return;
  manipulation = createTestsManipulationSession(event.pointerId, event.clientX, event.clientY, fieldState.orientation.angle);
  els.viewport.dataset.dragging = "true";
  els.viewport.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event) {
  if (!manipulation || manipulation.pointerId !== event.pointerId) return;
  updateTestsManipulation(manipulation, event.clientX, event.clientY, els.viewport.clientWidth);
  fieldState.orientation.angle = manipulation.angle;
  updateProjection();
}

function finishPointer(event, cancelled = false) {
  if (!manipulation || manipulation.pointerId !== event.pointerId) return;
  const session = manipulation;
  manipulation = null;
  els.viewport.dataset.dragging = "false";
  if (els.viewport.hasPointerCapture?.(event.pointerId)) els.viewport.releasePointerCapture(event.pointerId);
  if (cancelled) {
    cancelTestsManipulation(session);
    fieldState.orientation.angle = session.initialAngle;
    updateProjection();
    return;
  }
  const settled = settleTestsManipulation(session, fieldState.objectIds, fieldState.activeObject);
  fieldState.orientation.angle = settled.angle;
  if (session.moved) commitFocus(settled.focusProposal, "DIRECT_MANIPULATION");
  else updateProjection();
}

function handleWheel(event) {
  if (Math.abs(event.deltaY) < 8 || wheelLock) return;
  event.preventDefault();
  wheelLock = true;
  moveFocus(event.deltaY > 0 ? 1 : -1, "WHEEL");
  window.setTimeout(() => { wheelLock = false; }, 180);
}

function restoreEntryContext() {
  const restored = restoreTestsPriorContext(entrySnapshot, fieldState.objectIds);
  restoreTestsContinuity(fieldState, {
    activeObject: restored.activeObject,
    previewObject: restored.activeObject,
    orientation: restored.orientation,
    revision: fieldState.revision
  });
  updateProjection();
  updateReadouts("RETURN_CONTEXT_RESTORE");
  els.objectLayer.querySelector(`[data-object-id="${CSS.escape(fieldState.activeObject)}"]`)?.focus();
}

function bindEvents() {
  els.previous.addEventListener("click", () => moveFocus(-1, "CONTROL"));
  els.next.addEventListener("click", () => moveFocus(1, "CONTROL"));
  els.restore.addEventListener("click", restoreEntryContext);
  for (const button of els.depthButtons) {
    button.addEventListener("click", () => setDepth(button.dataset.depth, "DEPTH_CONTROL"));
  }

  els.viewport.addEventListener("pointerdown", handlePointerDown);
  els.viewport.addEventListener("pointermove", handlePointerMove);
  els.viewport.addEventListener("pointerup", (event) => finishPointer(event, false));
  els.viewport.addEventListener("pointercancel", (event) => finishPointer(event, true));
  els.viewport.addEventListener("lostpointercapture", (event) => {
    if (manipulation?.pointerId === event.pointerId) finishPointer(event, true);
  });
  els.viewport.addEventListener("wheel", handleWheel, { passive: false });
  els.viewport.addEventListener("keydown", (event) => {
    if (event.target.closest(".object-node")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(1, "VIEWPORT_KEYBOARD");
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(-1, "VIEWPORT_KEYBOARD");
    }
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(updateProjection);
  });
}

function failClosed(error) {
  console.error("M1_COMPASS_INTEGRATED_FAIL_CLOSED", error);
  els.objectLayer.replaceChildren();
  els.relationPaths.replaceChildren();
  els.relationLabels.replaceChildren();
  els.relationKey.replaceChildren();
  els.failure.hidden = false;
  els.failure.textContent = "Authority-bound registry validation failed. Candidate field withheld.";
  window.__M1_COMPASS_INTEGRATED_RECEIPT__ = Object.freeze({
    candidate: "M1_COMPASS_INTEGRATED",
    status: "WITHHELD",
    reason: String(error?.message || error),
    semanticMutation: false,
    publicRouteMutation: false
  });
}

async function init() {
  try {
    const response = await fetch(REGISTRY_URL, { cache: "no-store" });
    invariant(response.ok, `REGISTRY_FETCH_FAILED:${response.status}`);
    registry = await response.json();
    validateRegistry(registry);

    const ids = EXPECTED.objects.map((object) => object.id);
    fieldState = createTestsFieldState(ids, ids[0]);
    renderObjects();
    renderRelations();
    bindEvents();

    const initial = cloneTestsFieldState(fieldState);
    entrySnapshot = preserveTestsEntryContext({
      projection: "METHODS",
      activeObject: initial.activeObject,
      orientation: initial.orientation
    });
    bindTestsEntry(entrySnapshot, fieldState.objectIds);
    continuitySnapshot = snapshotTestsContinuity(fieldState);

    updateProjection();
    updateReadouts("INITIAL_BINDING");

    window.__M1_COMPASS_INTEGRATED_API__ = Object.freeze({
      getNavigationState: () => cloneTestsFieldState(fieldState),
      getEntryContext: () => entrySnapshot,
      getContinuityState: () => continuitySnapshot,
      focus: (target) => commitFocus(target, "TEST_API"),
      setDepth: (depth) => setDepth(depth, "TEST_API"),
      restoreEntryContext
    });
  } catch (error) {
    failClosed(error);
  }
}

init();
