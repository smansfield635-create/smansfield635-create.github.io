import {
  getApprovedAdapterBindings,
  createCompassEntryAdapter,
  createCompassReturnAdapter,
  createTestsFieldStateAdapter,
  createTestsFocusAdapter,
  createNeighborProjectionAdapter,
  createDepthTransformationAdapter,
  createDirectManipulationAdapter,
  createResponsiveProjectionAdapter,
  createContinuityStateAdapter
} from "./compass-tests.adapters.mjs";

const REGISTRY_URL = new URL("../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", import.meta.url);

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
  ]),
  deepEntryStatus: "WITHHELD_DEEP_ENTRY_AUTHORITY_UNRESOLVED_FOR_SELECTED_PARENT_BINDING"
});

const els = {
  depthStatus: document.querySelector("#depth-status"),
  contextMessage: document.querySelector("#context-message"),
  openTests: document.querySelector("#open-tests"),
  restoreContext: document.querySelector("#restore-context"),
  globalFailure: document.querySelector("#global-failure"),
  projectionStage: document.querySelector("#projection-stage"),
  methodsStage: document.querySelector("#methods-stage"),
  openMethods: document.querySelector("#open-methods"),
  returnL0: document.querySelector("#return-l0"),
  viewport: document.querySelector("#spatial-viewport"),
  field: document.querySelector("#information-field"),
  relationLayer: document.querySelector("#relation-layer"),
  relationPaths: document.querySelector("#relation-paths"),
  relationLabels: document.querySelector("#relation-label-layer"),
  relationKey: document.querySelector("#relation-key-items"),
  failure: document.querySelector("#field-failure"),
  focusLabel: document.querySelector("#focus-label"),
  focusPrevious: document.querySelector("#focus-previous"),
  focusNext: document.querySelector("#focus-next"),
  liveStatus: document.querySelector("#live-status")
};

const runtime = {
  registry: null,
  registryValidated: false,
  entry: null,
  returnAdapter: null,
  fieldState: null,
  focusAdapter: null,
  neighborAdapter: null,
  depthAdapter: null,
  directAdapter: null,
  responsiveAdapter: null,
  continuityAdapter: null,
  layoutFrame: 0
};

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function sorted(values) { return [...values].sort(); }
function relationSignature(r) { return `${r.SOURCE_OBJECT}|${r.RELATION}|${r.TARGET_OBJECT}`; }
function expectedRelationSignature(r) { return `${r.source}|${r.relation}|${r.target}`; }
function humanizeRelation(value) { return value.toLowerCase().replaceAll("_", " "); }
function standingLabel(standing) {
  const authorityStanding = standing?.AUTHORITY_STANDING;
  return authorityStanding ? `Standing · ${authorityStanding.toLowerCase().replaceAll("_", " ")}` : "Standing recorded";
}
function clamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }

function validateRegistry(registry) {
  invariant(registry?.schema === "WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1", "REGISTRY_SCHEMA_MISMATCH");
  invariant(registry?.projectionSelection?.PROJECTION === EXPECTED.projection, "PROJECTION_MISMATCH");
  invariant(registry?.projectionSelection?.projectionCount === 1, "PROJECTION_COUNT_MISMATCH");
  invariant(Array.isArray(registry?.objects) && registry.objects.length === 3, "OBJECT_COUNT_MISMATCH");
  invariant(Array.isArray(registry?.relations) && registry.relations.length === 2, "RELATION_COUNT_MISMATCH");

  const expectedIds = sorted(EXPECTED.objects.map((o) => o.id));
  invariant(JSON.stringify(sorted(registry.objects.map((o) => o.OBJECT_ID))) === JSON.stringify(expectedIds), "OBJECT_ID_SET_MISMATCH");
  for (const expected of EXPECTED.objects) {
    const object = registry.objects.find((candidate) => candidate.OBJECT_ID === expected.id);
    invariant(object?.OBJECT_CLASS === expected.className, `OBJECT_CLASS_MISMATCH:${expected.id}`);
    invariant(object?.PROJECTION === EXPECTED.projection, `OBJECT_PROJECTION_MISMATCH:${expected.id}`);
    invariant(object?.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `OBJECT_AUTHORITY_SOURCE_MISMATCH:${expected.id}`);
    invariant(Boolean(object?.AUTHORITY_POINTER), `OBJECT_AUTHORITY_POINTER_MISSING:${expected.id}`);
    invariant(object?.DEEP_ENTRY_AVAILABLE === false && object?.DEEP_ENTRY_TARGET === null, `DEEP_ENTRY_PROHIBITED:${expected.id}`);
  }
  invariant(JSON.stringify(sorted(registry.relations.map((r) => r.RELATION_ID))) === JSON.stringify(sorted(EXPECTED.relations.map((r) => r.id))), "RELATION_ID_SET_MISMATCH");
  invariant(JSON.stringify(sorted(registry.relations.map(relationSignature))) === JSON.stringify(sorted(EXPECTED.relations.map(expectedRelationSignature))), "RELATION_SIGNATURE_MISMATCH");
  for (const relation of registry.relations) {
    invariant(relation.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY", `RELATION_AUTHORITY_SOURCE_MISMATCH:${relation.RELATION_ID}`);
    invariant(Boolean(relation.AUTHORITY_POINTER), `RELATION_AUTHORITY_POINTER_MISSING:${relation.RELATION_ID}`);
  }
  invariant(registry?.deepEntryBoundary?.status === EXPECTED.deepEntryStatus, "DEEP_ENTRY_STATUS_MISMATCH");
  invariant(registry?.populationBoundary?.researchContentCopied === false, "RESEARCH_COPY_PROHIBITED");
  invariant(registry?.publicMutationAuthorized === false, "PUBLIC_MUTATION_PROHIBITED");
  invariant(registry?.scientificClaimUpgrade === false, "CLAIM_UPGRADE_PROHIBITED");
}

function renderObjectCards(registry) {
  els.field.replaceChildren();
  for (const expected of EXPECTED.objects) {
    const object = registry.objects.find((candidate) => candidate.OBJECT_ID === expected.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "information-tab";
    button.dataset.objectId = object.OBJECT_ID;
    button.dataset.objectClass = object.OBJECT_CLASS;
    button.setAttribute("aria-label", `${object.DISPLAY_LABEL}, ${object.OBJECT_CLASS}. Focus object.`);
    button.innerHTML = `
      <span class="tab-edge" aria-hidden="true"></span>
      <span class="tab-kicker">${object.OBJECT_CLASS}</span>
      <strong>${object.DISPLAY_LABEL}</strong>
      <span class="tab-id">${object.OBJECT_ID}</span>
      <span class="tab-standing">${standingLabel(object.CURRENT_STANDING)}</span>
    `;
    button.addEventListener("click", () => commitFocus(object.OBJECT_ID, "POINTER_OR_ACTIVATION"));
    button.addEventListener("keydown", handleTabKeydown);
    els.field.append(button);
  }
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
    path.setAttribute("marker-end", "url(#relation-arrow)");
    els.relationPaths.append(path);

    const label = document.createElement("div");
    label.className = "relation-label";
    label.dataset.relationId = relation.RELATION_ID;
    label.textContent = humanizeRelation(relation.RELATION);
    els.relationLabels.append(label);

    const source = registry.objects.find((o) => o.OBJECT_ID === relation.SOURCE_OBJECT);
    const target = registry.objects.find((o) => o.OBJECT_ID === relation.TARGET_OBJECT);
    const item = document.createElement("p");
    item.dataset.relationId = relation.RELATION_ID;
    item.textContent = `${source.DISPLAY_LABEL} → ${humanizeRelation(relation.RELATION)} → ${target.DISPLAY_LABEL}`;
    els.relationKey.append(item);
  }
}

function handleTabKeydown(event) {
  const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!allowedKeys.includes(event.key)) return;
  event.preventDefault();
  const ids = EXPECTED.objects.map((o) => o.id);
  const currentIndex = ids.indexOf(runtime.fieldState.getState().focus);
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % ids.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + ids.length) % ids.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = ids.length - 1;
  commitFocus(ids[nextIndex], "KEYBOARD");
  els.field.querySelector(`[data-object-id="${CSS.escape(ids[nextIndex])}"]`)?.focus();
}

function focusByDelta(delta, modality) {
  const ids = EXPECTED.objects.map((o) => o.id);
  const current = ids.indexOf(runtime.fieldState.getState().focus);
  commitFocus(ids[(current + delta + ids.length) % ids.length], modality);
}

function commitFocus(objectId, modality) {
  const result = runtime.focusAdapter.focus(objectId, modality);
  runtime.continuityAdapter.save(result.state);
  updatePresentation();
  const label = runtime.registry.objects.find((o) => o.OBJECT_ID === objectId)?.DISPLAY_LABEL || objectId;
  els.focusLabel.textContent = label;
  els.liveStatus.textContent = `Focus moved to ${label}. Scientific state unchanged.`;
  window.__M1_COMPASS_LAST_FOCUS__ = Object.freeze({ operation: "FOCUS", target: objectId, modality, semanticMutation: false });
}

function setDepth(nextDepth, modality) {
  const state = runtime.depthAdapter.requestDepth(nextDepth);
  runtime.continuityAdapter.save(state);
  applyDepth(state.depth);
  els.liveStatus.textContent = `Navigation depth changed to ${displayDepth(state.depth)}. Scientific state unchanged.`;
  window.__M1_COMPASS_LAST_DEPTH__ = Object.freeze({ fromNavigationOnly: true, depth: state.depth, modality, semanticMutation: false });
}

function displayDepth(depth) {
  return depth === "L_MINUS_1" ? "L-1" : depth;
}

function applyDepth(depth) {
  els.depthStatus.textContent = displayDepth(depth);
  document.documentElement.dataset.testsDepth = depth;
  els.projectionStage.hidden = depth === "L_MINUS_1" || depth === "L1";
  els.methodsStage.hidden = depth !== "L1";
  if (depth === "L1") updatePresentation();
}

function updatePresentation() {
  if (!runtime.registryValidated || !runtime.fieldState) return;
  const state = runtime.fieldState.getState();
  const projection = runtime.responsiveAdapter.measure(els.viewport);
  els.viewport.style.setProperty("--field-perspective", `${projection.perspective}px`);
  const positions = runtime.neighborAdapter.project({ focus: state.focus, orientationOffset: state.orientationOffset, spread: projection.spread });
  for (const position of positions) {
    const node = els.field.querySelector(`[data-object-id="${CSS.escape(position.objectId)}"]`);
    if (!node) continue;
    node.dataset.active = position.active ? "true" : "false";
    node.setAttribute("aria-pressed", position.active ? "true" : "false");
    node.tabIndex = position.active ? 0 : -1;
    const tilt = position.relative * -12;
    node.style.transform = `translate3d(calc(-50% + ${position.x.toFixed(2)}px), calc(-50% + ${position.y.toFixed(2)}px), ${position.z.toFixed(2)}px) rotateY(${tilt.toFixed(2)}deg) scale(${position.prominence.toFixed(3)})`;
    node.style.opacity = String(position.active ? 1 : Math.max(0.46, position.prominence));
    node.style.zIndex = String(Math.round(1000 + position.z));
  }
  scheduleRelationLayout();
}

function rectWithinViewport(element) {
  const host = els.viewport.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return { cx: rect.left - host.left + rect.width / 2, cy: rect.top - host.top + rect.height / 2, width: rect.width, height: rect.height };
}

function clippedEndpoints(sourceNode, targetNode) {
  const source = rectWithinViewport(sourceNode);
  const target = rectWithinViewport(targetNode);
  const dx = target.cx - source.cx;
  const dy = target.cy - source.cy;
  const length = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / length;
  const uy = dy / length;
  const sourceDistance = Math.min(source.width / Math.max(0.001, 2 * Math.abs(ux)), source.height / Math.max(0.001, 2 * Math.abs(uy)));
  const targetDistance = Math.min(target.width / Math.max(0.001, 2 * Math.abs(ux)), target.height / Math.max(0.001, 2 * Math.abs(uy)));
  return {
    x1: source.cx + ux * (sourceDistance + 5), y1: source.cy + uy * (sourceDistance + 5),
    x2: target.cx - ux * (targetDistance + 12), y2: target.cy - uy * (targetDistance + 12)
  };
}

function scheduleRelationLayout() {
  cancelAnimationFrame(runtime.layoutFrame);
  runtime.layoutFrame = requestAnimationFrame(layoutRelations);
}

function layoutRelations() {
  if (els.methodsStage.hidden) return;
  const width = els.viewport.clientWidth;
  const height = els.viewport.clientHeight;
  const compact = width < 560;
  els.relationLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const relationPaths = [...els.relationPaths.querySelectorAll("path[data-relation-id]")];
  relationPaths.forEach((path, index) => {
    const sourceNode = els.field.querySelector(`[data-object-id="${CSS.escape(path.dataset.sourceObject)}"]`);
    const targetNode = els.field.querySelector(`[data-object-id="${CSS.escape(path.dataset.targetObject)}"]`);
    if (!sourceNode || !targetNode) return;
    const p = clippedEndpoints(sourceNode, targetNode);
    const dx = p.x2 - p.x1;
    const dy = p.y2 - p.y1;
    const length = Math.max(1, Math.hypot(dx, dy));
    const normalX = -dy / length;
    const normalY = dx / length;
    let controlX;
    let controlY;

    if (compact) {
      const verticalSign = index % 2 === 0 ? -1 : 1;
      const verticalDepth = 190;
      controlX = (p.x1 + p.x2) / 2;
      controlY = (p.y1 + p.y2) / 2 + verticalDepth * verticalSign;
    } else {
      const corridorSign = index % 2 === 0 ? -1 : 1;
      const corridorDepth = Math.min(190, Math.max(145, width * 0.20));
      controlX = (p.x1 + p.x2) / 2 + normalX * corridorDepth * corridorSign;
      controlY = (p.y1 + p.y2) / 2 + normalY * corridorDepth * corridorSign;
    }

    path.setAttribute("d", `M ${p.x1.toFixed(2)} ${p.y1.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${p.x2.toFixed(2)} ${p.y2.toFixed(2)}`);

    const label = els.relationLabels.querySelector(`[data-relation-id="${CSS.escape(path.dataset.relationId)}"]`);
    if (label) {
      let labelX = 0.25 * p.x1 + 0.5 * controlX + 0.25 * p.x2;
      let labelY = 0.25 * p.y1 + 0.5 * controlY + 0.25 * p.y2;
      if (compact) {
        labelX = clamp(labelX, 74, width - 74);
        labelY = clamp(labelY, 28, height - 28);
      }
      label.style.left = `${labelX.toFixed(2)}px`;
      label.style.top = `${labelY.toFixed(2)}px`;
    }
  });
}

function failClosed(error) {
  console.error("M1_COMPASS_INTEGRATED_FAIL_CLOSED", error);
  runtime.registryValidated = false;
  els.field.replaceChildren();
  els.relationPaths.replaceChildren();
  els.relationLabels.replaceChildren();
  els.relationKey.replaceChildren();
  els.projectionStage.hidden = true;
  els.methodsStage.hidden = true;
  els.failure.hidden = false;
  els.globalFailure.hidden = false;
  els.openTests.disabled = true;
  els.restoreContext.disabled = true;
  els.liveStatus.textContent = "Authority validation failed. Integrated manifestation withheld.";
  window.__M1_COMPASS_INTEGRATED__ = undefined;
}

async function boot() {
  try {
    const response = await fetch(REGISTRY_URL, { cache: "no-store" });
    invariant(response.ok, `REGISTRY_FETCH_FAILED:${response.status}`);
    const registry = await response.json();
    validateRegistry(registry);
    runtime.registry = registry;
    runtime.registryValidated = true;

    const objectIds = EXPECTED.objects.map((o) => o.id);
    const previewPriorContext = Object.freeze({ source: "NONPUBLIC_COMPASS_PREVIEW", returnMode: "RESTORE_NAVIGATION_SNAPSHOT_ONLY", semanticAuthority: false });
    runtime.entry = createCompassEntryAdapter({ destinationId: "TESTS", priorNavigationSnapshot: history.state?.compassNavigationSnapshot || previewPriorContext });
    runtime.returnAdapter = createCompassReturnAdapter(runtime.entry);
    runtime.fieldState = createTestsFieldStateAdapter({ objectIds, initialFocus: objectIds[0] });
    runtime.focusAdapter = createTestsFocusAdapter({ fieldState: runtime.fieldState, objectIds });
    runtime.neighborAdapter = createNeighborProjectionAdapter({ objectIds });
    runtime.depthAdapter = createDepthTransformationAdapter({ fieldState: runtime.fieldState });
    runtime.responsiveAdapter = createResponsiveProjectionAdapter();
    runtime.continuityAdapter = createContinuityStateAdapter({ objectIds });

    const restored = runtime.continuityAdapter.restore();
    if (restored) runtime.fieldState.replace(restored);

    renderObjectCards(registry);
    renderRelations(registry);
    runtime.directAdapter = createDirectManipulationAdapter({
      element: els.viewport,
      fieldState: runtime.fieldState,
      objectIds,
      onFocusProposal: (objectId, modality) => commitFocus(objectId, modality),
      onProposal: (state, phase) => {
        updatePresentation();
        if (phase === "SETTLE") runtime.continuityAdapter.save(state);
      }
    });

    els.openTests.addEventListener("click", () => setDepth("L0", "COMPASS_ENTRY_CONTEXT"));
    els.openMethods.addEventListener("click", () => setDepth("L1", "DEPTH_TRANSFORMATION"));
    els.returnL0.addEventListener("click", () => setDepth("L0", "DEPTH_RETURN"));
    els.restoreContext.addEventListener("click", () => {
      const current = runtime.fieldState.getState();
      if (current.depth === "L1") runtime.depthAdapter.requestDepth("L0");
      if (runtime.fieldState.getState().depth === "L0") runtime.depthAdapter.requestDepth("L_MINUS_1");
      runtime.continuityAdapter.save(runtime.fieldState.getState());
      applyDepth("L_MINUS_1");
      const restoredPrior = runtime.returnAdapter.restore();
      els.contextMessage.textContent = "Prior Compass navigation context restored in the nonpublic fixture. Scientific state unchanged.";
      window.__M1_COMPASS_RETURN_RECEIPT__ = Object.freeze({ restoredPrior, semanticMutation: false });
    });
    els.focusPrevious.addEventListener("click", () => focusByDelta(-1, "CONTROL"));
    els.focusNext.addEventListener("click", () => focusByDelta(1, "CONTROL"));
    els.viewport.addEventListener("keydown", (event) => {
      if (event.target.closest(".information-tab")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); focusByDelta(-1, "FIELD_KEYBOARD"); }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); focusByDelta(1, "FIELD_KEYBOARD"); }
    });
    window.addEventListener("resize", updatePresentation, { passive: true });

    applyDepth(runtime.fieldState.getState().depth);
    updatePresentation();
    els.failure.hidden = true;
    els.globalFailure.hidden = true;

    window.__M1_COMPASS_INTEGRATED__ = Object.freeze({
      candidateId: "M1_COMPASS_INTEGRATED",
      constructionAuthority: "9eb936918ce063cef6c6f5d800f39ae966f3d3aa",
      scientificBaseline: "9370bba7841b8a831f7f1c034d0b74fb83dab2e0",
      layerBoundary: "L_MINUS_1_L0_L1_FOCUS_ONLY",
      adapterBindings: getApprovedAdapterBindings(),
      getState: () => Object.freeze({ registryValidated: runtime.registryValidated, ...runtime.fieldState.getState(), objectIds: [...objectIds], relationIds: EXPECTED.relations.map((r) => r.id) }),
      setFocus: (objectId) => commitFocus(objectId, "PROGRAMMATIC_TEST_ROUTE"),
      requestDepth: (depth) => setDepth(depth, "PROGRAMMATIC_TEST_ROUTE"),
      restorePriorContext: () => runtime.returnAdapter.restore(),
      relayout: updatePresentation
    });
  } catch (error) {
    failClosed(error);
  }
}

boot();
