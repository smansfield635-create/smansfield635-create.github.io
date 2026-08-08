const REGISTRY_URL = new URL(
  "../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json",
  import.meta.url
);

const EXPECTED = Object.freeze({
  projection: "METHODS",
  objects: Object.freeze([
    Object.freeze({ id: "METHODS", className: "METHOD", slot: "primary" }),
    Object.freeze({ id: "ROUTE_OPERATOR_PLATFORM", className: "METHOD", slot: "secondary-left" }),
    Object.freeze({ id: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO", className: "TEST_INSTANCE", slot: "secondary-right" })
  ]),
  relations: Object.freeze([
    Object.freeze({
      id: "METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO",
      source: "METHODS",
      relation: "GOVERNS_PROCEDURE_FOR",
      target: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"
    }),
    Object.freeze({
      id: "ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO",
      source: "ROUTE_OPERATOR_PLATFORM",
      relation: "EXECUTES",
      target: "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"
    })
  ]),
  deepEntryStatus: "WITHHELD_DEEP_ENTRY_AUTHORITY_UNRESOLVED_FOR_SELECTED_PARENT_BINDING"
});

const els = {
  field: document.querySelector("#spatial-field"),
  objectLayer: document.querySelector("#object-layer"),
  relationPaths: document.querySelector("#relation-paths"),
  relationLabels: document.querySelector("#relation-label-layer"),
  relationKey: document.querySelector("#relation-key-items"),
  failure: document.querySelector("#field-failure"),
  focusStatus: document.querySelector("#focus-status")
};

const runtimeState = {
  projection: EXPECTED.projection,
  activeObject: EXPECTED.objects[0].id,
  operation: "FOCUS",
  registryValidated: false,
  objectIds: [],
  relationIds: []
};

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function sorted(values) {
  return [...values].sort();
}

function relationSignature(relation) {
  return `${relation.SOURCE_OBJECT}|${relation.RELATION}|${relation.TARGET_OBJECT}`;
}

function expectedRelationSignature(relation) {
  return `${relation.source}|${relation.relation}|${relation.target}`;
}

function validateRegistry(registry) {
  invariant(registry?.schema === "WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1", "REGISTRY_SCHEMA_MISMATCH");
  invariant(registry?.projectionSelection?.PROJECTION === EXPECTED.projection, "PROJECTION_MISMATCH");
  invariant(registry?.projectionSelection?.projectionCount === 1, "PROJECTION_COUNT_MISMATCH");
  invariant(registry?.projectionSelection?.objectCount === 3, "OBJECT_COUNT_METADATA_MISMATCH");
  invariant(Array.isArray(registry?.objects) && registry.objects.length === 3, "OBJECT_COUNT_MISMATCH");
  invariant(Array.isArray(registry?.relations) && registry.relations.length === 2, "RELATION_COUNT_MISMATCH");

  const expectedObjectIds = sorted(EXPECTED.objects.map((object) => object.id));
  const actualObjectIds = sorted(registry.objects.map((object) => object.OBJECT_ID));
  invariant(JSON.stringify(actualObjectIds) === JSON.stringify(expectedObjectIds), "OBJECT_ID_SET_MISMATCH");

  for (const expectedObject of EXPECTED.objects) {
    const object = registry.objects.find((candidate) => candidate.OBJECT_ID === expectedObject.id);
    invariant(Boolean(object), `OBJECT_MISSING:${expectedObject.id}`);
    invariant(object.OBJECT_CLASS === expectedObject.className, `OBJECT_CLASS_MISMATCH:${expectedObject.id}`);
    invariant(object.PROJECTION === EXPECTED.projection, `OBJECT_PROJECTION_MISMATCH:${expectedObject.id}`);
    invariant(object.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `OBJECT_AUTHORITY_SOURCE_MISMATCH:${expectedObject.id}`);
    invariant(Boolean(object.AUTHORITY_POINTER), `OBJECT_AUTHORITY_POINTER_MISSING:${expectedObject.id}`);
    invariant(object.DEEP_ENTRY_AVAILABLE === false, `DEEP_ENTRY_MUST_BE_FALSE:${expectedObject.id}`);
    invariant(object.DEEP_ENTRY_TARGET === null, `DEEP_ENTRY_TARGET_MUST_BE_NULL:${expectedObject.id}`);
  }

  const expectedRelationIds = sorted(EXPECTED.relations.map((relation) => relation.id));
  const actualRelationIds = sorted(registry.relations.map((relation) => relation.RELATION_ID));
  invariant(JSON.stringify(actualRelationIds) === JSON.stringify(expectedRelationIds), "RELATION_ID_SET_MISMATCH");

  const expectedSignatures = sorted(EXPECTED.relations.map(expectedRelationSignature));
  const actualSignatures = sorted(registry.relations.map(relationSignature));
  invariant(JSON.stringify(actualSignatures) === JSON.stringify(expectedSignatures), "RELATION_DIRECTION_OR_IDENTITY_MISMATCH");

  for (const relation of registry.relations) {
    invariant(relation.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `RELATION_AUTHORITY_SOURCE_MISMATCH:${relation.RELATION_ID}`);
    invariant(Boolean(relation.AUTHORITY_POINTER), `RELATION_AUTHORITY_POINTER_MISSING:${relation.RELATION_ID}`);
  }

  invariant(registry?.deepEntryBoundary?.status === EXPECTED.deepEntryStatus, "DEEP_ENTRY_STATUS_MISMATCH");
  invariant(registry?.deepEntryBoundary?.m1r2MutationAuthorized === false, "M1R2_MUTATION_MUST_BE_FALSE");
  invariant(registry?.populationBoundary?.placeholderObjects === 0, "PLACEHOLDERS_PROHIBITED");
  invariant(registry?.populationBoundary?.inventedObjects === 0, "INVENTED_OBJECTS_PROHIBITED");
  invariant(registry?.populationBoundary?.inventedRelations === 0, "INVENTED_RELATIONS_PROHIBITED");
  invariant(registry?.populationBoundary?.researchContentCopied === false, "RESEARCH_CONTENT_COPY_PROHIBITED");
  invariant(registry?.publicMutationAuthorized === false, "PUBLIC_MUTATION_MUST_REMAIN_FALSE");
  invariant(registry?.scientificClaimUpgrade === false, "SCIENTIFIC_CLAIM_UPGRADE_MUST_REMAIN_FALSE");
}

function humanizeRelation(relation) {
  if (relation === "GOVERNS_PROCEDURE_FOR") return "governs procedure for";
  if (relation === "EXECUTES") return "executes";
  return relation.toLowerCase().replaceAll("_", " ");
}

function createObjectNode(object, slot) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "object-node";
  button.dataset.objectId = object.OBJECT_ID;
  button.dataset.objectClass = object.OBJECT_CLASS;
  button.dataset.slot = slot;
  button.dataset.active = object.OBJECT_ID === runtimeState.activeObject ? "true" : "false";
  button.setAttribute("aria-pressed", object.OBJECT_ID === runtimeState.activeObject ? "true" : "false");
  button.setAttribute("aria-label", `${object.DISPLAY_LABEL}, ${object.OBJECT_CLASS}. Focus object.`);
  button.tabIndex = object.OBJECT_ID === runtimeState.activeObject ? 0 : -1;

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
  button.addEventListener("click", () => setActiveObject(object.OBJECT_ID, "POINTER_OR_ACTIVATION"));
  button.addEventListener("keydown", handleObjectKeydown);
  return button;
}

function handleObjectKeydown(event) {
  const nodes = [...els.objectLayer.querySelectorAll(".object-node")];
  const currentIndex = nodes.findIndex((node) => node.dataset.objectId === runtimeState.activeObject);
  let nextIndex = currentIndex;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % nodes.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + nodes.length) % nodes.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = nodes.length - 1;

  if (nextIndex === currentIndex && !["Home", "End"].includes(event.key)) return;
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;

  event.preventDefault();
  const target = nodes[nextIndex];
  setActiveObject(target.dataset.objectId, "KEYBOARD");
  target.focus();
}

function setActiveObject(objectId, modality) {
  invariant(runtimeState.objectIds.includes(objectId), `FOCUS_TARGET_INVALID:${objectId}`);
  runtimeState.activeObject = objectId;
  runtimeState.operation = "FOCUS";

  for (const node of els.objectLayer.querySelectorAll(".object-node")) {
    const active = node.dataset.objectId === objectId;
    node.dataset.active = active ? "true" : "false";
    node.setAttribute("aria-pressed", active ? "true" : "false");
    node.tabIndex = active ? 0 : -1;
  }

  const label = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(objectId)}"] .object-node-label`)?.textContent ?? objectId;
  els.focusStatus.textContent = `Focus moved to ${label}. Scientific state unchanged.`;
  updateIncidentPresentation();
  scheduleRelationLayout();

  window.__TESTS_L0_L1_M1_LAST_FOCUS__ = Object.freeze({
    operation: "FOCUS",
    target: objectId,
    modality,
    semanticMutation: false
  });
}

function rectWithinField(element) {
  const fieldRect = els.field.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - fieldRect.left,
    top: rect.top - fieldRect.top,
    right: rect.right - fieldRect.left,
    bottom: rect.bottom - fieldRect.top,
    width: rect.width,
    height: rect.height,
    cx: rect.left - fieldRect.left + rect.width / 2,
    cy: rect.top - fieldRect.top + rect.height / 2
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
  const source = rectWithinField(sourceNode);
  const target = rectWithinField(targetNode);
  const dx = target.cx - source.cx;
  const dy = target.cy - source.cy;
  const length = Math.hypot(dx, dy);
  invariant(length > 0, "RELATION_ZERO_LENGTH");

  const ux = dx / length;
  const uy = dy / length;
  const sourceDistance = boundaryDistance(source, ux, uy);
  const targetDistance = boundaryDistance(target, ux, uy);
  const sourceClearance = 5;
  const targetClearance = 12;

  return {
    x1: source.cx + ux * (sourceDistance + sourceClearance),
    y1: source.cy + uy * (sourceDistance + sourceClearance),
    x2: target.cx - ux * (targetDistance + targetClearance),
    y2: target.cy - uy * (targetDistance + targetClearance),
    sourceClearance,
    targetClearance
  };
}

function renderRelations(registry) {
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

    const keyItem = document.createElement("div");
    keyItem.className = "relation-key-item";
    keyItem.dataset.relationId = relation.RELATION_ID;
    const source = registry.objects.find((object) => object.OBJECT_ID === relation.SOURCE_OBJECT);
    const target = registry.objects.find((object) => object.OBJECT_ID === relation.TARGET_OBJECT);
    keyItem.innerHTML = `<strong>${escapeHtml(source.DISPLAY_LABEL)}</strong> → ${escapeHtml(humanizeRelation(relation.RELATION))} → <strong>${escapeHtml(target.DISPLAY_LABEL)}</strong>`;
    els.relationKey.append(keyItem);
  }

  updateIncidentPresentation();
  scheduleRelationLayout();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateIncidentPresentation() {
  for (const path of els.relationPaths.querySelectorAll("[data-relation-id]")) {
    const incident = path.dataset.sourceObject === runtimeState.activeObject || path.dataset.targetObject === runtimeState.activeObject;
    path.dataset.incident = incident ? "true" : "false";
    const label = els.relationLabels.querySelector(`[data-relation-id="${CSS.escape(path.dataset.relationId)}"]`);
    if (label) label.dataset.incident = incident ? "true" : "false";
  }
}

let layoutFrame = 0;
function scheduleRelationLayout() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(layoutRelations);
}

function layoutRelations() {
  const width = els.field.clientWidth;
  const height = els.field.clientHeight;
  els.relationPaths.closest("svg").setAttribute("viewBox", `0 0 ${width} ${height}`);

  for (const path of els.relationPaths.querySelectorAll("path[data-relation-id]")) {
    const sourceNode = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(path.dataset.sourceObject)}"]`);
    const targetNode = els.objectLayer.querySelector(`[data-object-id="${CSS.escape(path.dataset.targetObject)}"]`);
    invariant(sourceNode && targetNode, `RELATION_ENDPOINT_NODE_MISSING:${path.dataset.relationId}`);

    const endpoints = clippedEndpoints(sourceNode, targetNode);
    path.setAttribute("d", `M ${endpoints.x1.toFixed(3)} ${endpoints.y1.toFixed(3)} L ${endpoints.x2.toFixed(3)} ${endpoints.y2.toFixed(3)}`);
    path.dataset.sourceClearance = String(endpoints.sourceClearance);
    path.dataset.targetClearance = String(endpoints.targetClearance);

    const label = els.relationLabels.querySelector(`[data-relation-id="${CSS.escape(path.dataset.relationId)}"]`);
    if (label) {
      label.style.left = `${((endpoints.x1 + endpoints.x2) / 2).toFixed(3)}px`;
      label.style.top = `${((endpoints.y1 + endpoints.y2) / 2).toFixed(3)}px`;
    }
  }
}

function renderObjects(registry) {
  els.objectLayer.replaceChildren();
  for (const expectedObject of EXPECTED.objects) {
    const object = registry.objects.find((candidate) => candidate.OBJECT_ID === expectedObject.id);
    els.objectLayer.append(createObjectNode(object, expectedObject.slot));
  }
}

function failClosed(error) {
  console.error("TESTS_L0_L1_M1_FAIL_CLOSED", error);
  runtimeState.registryValidated = false;
  runtimeState.objectIds = [];
  runtimeState.relationIds = [];
  els.objectLayer.replaceChildren();
  els.relationPaths.replaceChildren();
  els.relationLabels.replaceChildren();
  els.relationKey.replaceChildren();
  els.failure.hidden = false;
  els.focusStatus.textContent = "Authority validation failed. Manifestation withheld.";
}

async function boot() {
  try {
    const response = await fetch(REGISTRY_URL, { cache: "no-store" });
    invariant(response.ok, `REGISTRY_FETCH_FAILED:${response.status}`);
    const registry = await response.json();
    validateRegistry(registry);

    runtimeState.registryValidated = true;
    runtimeState.objectIds = EXPECTED.objects.map((object) => object.id);
    runtimeState.relationIds = EXPECTED.relations.map((relation) => relation.id);
    els.failure.hidden = true;

    renderObjects(registry);
    renderRelations(registry);
    setActiveObject(runtimeState.activeObject, "BOOT");

    window.__TESTS_L0_L1_M1__ = Object.freeze({
      candidateId: "M1_TESTS_METHODS_OPERATIONAL_FIELD",
      layerBoundary: "L0_L1_ONLY",
      getState: () => Object.freeze({ ...runtimeState, objectIds: [...runtimeState.objectIds], relationIds: [...runtimeState.relationIds] }),
      setFocus: (objectId) => setActiveObject(objectId, "PROGRAMMATIC_TEST_ROUTE"),
      relayout: scheduleRelationLayout
    });
  } catch (error) {
    failClosed(error);
  }
}

window.addEventListener("resize", scheduleRelationLayout, { passive: true });
boot();
