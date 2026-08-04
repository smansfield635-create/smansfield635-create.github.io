const stage = document.querySelector("[data-spatial-stage]");
const sceneRoot = document.querySelector("[data-spatial-scene-root]");
const field = document.querySelector("[data-spatial-field]");
const localOriginState = document.querySelector("[data-local-origin-state]");
const inspection = document.querySelector("[data-spatial-inspection]");
const lensButtons = Array.from(document.querySelectorAll("[data-lens-select]"));
const territoryIndex = document.querySelector("[data-family-territory-index]");
const inspectionTabs = Array.from(document.querySelectorAll("[data-inspection-tab]"));
const COMPOSITION_STYLE_ID = "methods-page-specific-transform-authority";
let bound = false;
let inspectionObserver = null;
let territoryBuilt = false;
let familySelectionPlan = null;

function app() {
  return globalThis.__METHODS_SPATIAL_APP || null;
}

function ensureCompositionAuthorityStyle() {
  if (document.getElementById(COMPOSITION_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = COMPOSITION_STYLE_ID;
  style.dataset.contract = "METHODS_PAGE_SPECIFIC_TRANSFORM_AUTHORITY_v1";
  style.textContent = `
    .spatial-stage[data-composition-authority="PAGE_SPECIFIC"] .spatial-scene-root {
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      transform: none !important;
      transition: none !important;
    }
    .spatial-stage[data-composition-authority="PAGE_SPECIFIC"] .spatial-field {
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      transform: none !important;
      transition: none !important;
    }
    .spatial-stage[data-composition-authority="PAGE_SPECIFIC"] .spatial-family-plane,
    .spatial-stage[data-composition-authority="PAGE_SPECIFIC"] .spatial-model-node,
    .spatial-stage[data-composition-authority="PAGE_SPECIFIC"] .spatial-relationship {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  `;
  document.head.append(style);
}

function familyRecord(familyId) {
  return app()?.catalog?.find(family => family.id === familyId) || null;
}

function descriptorRecord(modelId) {
  return app()?.registry?.descriptors?.find(descriptor => (descriptor.MODEL_ID || descriptor.modelId) === modelId) || null;
}

function activeLensId() {
  return app()?.resolvedScene?.native?.lensId || app()?.nativeState?.y?.lens || "practical";
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value || "";
}

function updateLensInstrument() {
  const lensId = activeLensId();
  stage.dataset.activeLens = lensId;
  lensButtons.forEach(button => {
    const active = button.dataset.lensSelect === lensId;
    button.setAttribute("aria-pressed", String(active));
    button.dataset.active = String(active);
  });
}

function selectLens(lensId) {
  const current = app();
  if (!current) return;
  const ids = current.registry.lenses.map(lens => lens.id);
  const from = ids.indexOf(activeLensId());
  const to = ids.indexOf(lensId);
  if (to < 0) throw new Error(`METHODS_LAWS_CHILD_LENS_INVALID:${lensId}`);
  if (from < 0 || from === to) return;
  let delta = to - from;
  if (delta === 2) delta = -1;
  if (delta === -2) delta = 1;
  current.moveLens(Math.sign(delta));
}

function buildTerritoryIndex() {
  const current = app();
  if (!current || !territoryIndex || territoryBuilt) return;
  territoryBuilt = true;
  const fragment = document.createDocumentFragment();
  current.catalog.forEach((family, familyIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.familySelect = family.id;
    button.dataset.familyIndex = String(familyIndex);
    button.innerHTML = `<span>${String(familyIndex + 1).padStart(2, "0")}</span><strong>${family.title}</strong>`;
    button.addEventListener("click", () => selectFamilyIndex(familyIndex));
    fragment.append(button);
  });
  territoryIndex.replaceChildren(fragment);
}

function currentFamilyId() {
  return app()?.resolvedScene?.native?.familyId || app()?.nativeState?.z?.familyId || null;
}

function currentFamilyOrderIndex() {
  const current = app();
  const familyId = currentFamilyId();
  if (!current || !familyId) return -1;
  return current.catalog.findIndex(family => family.id === familyId);
}

function selectFamilyIndex(targetIndex) {
  const current = app();
  const count = current?.catalog?.length || current?.registry?.familyCount || 4;
  const fromIndex = currentFamilyOrderIndex();
  const targetFamily = current?.catalog?.[targetIndex];
  if (!current || !Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= count || fromIndex < 0 || !targetFamily) return;

  if (currentFamilyId() === targetFamily.id) {
    familySelectionPlan = null;
    stage.dataset.familySelectionStatus = "complete";
    synchronize("selection");
    return;
  }

  const forward = (targetIndex - fromIndex + count) % count;
  const backward = (fromIndex - targetIndex + count) % count;
  const direction = forward <= backward ? 1 : -1;
  const nextIndex = (fromIndex + direction + count) % count;
  const nextFamilyId = current.catalog[nextIndex]?.id || "unknown";
  familySelectionPlan = {
    targetIndex,
    targetFamilyId: targetFamily.id,
    direction,
    count
  };
  stage.dataset.familySelectionStatus = `moving-${currentFamilyId()}-to-${nextFamilyId}`;
  current.moveFamily(direction);
}

function continueFamilySelection(source) {
  const plan = familySelectionPlan;
  if (!plan || source !== "transition") return;
  const current = app();
  const activeFamilyId = current?.resolvedScene?.native?.familyId;
  const activeIndex = current?.catalog?.findIndex(family => family.id === activeFamilyId) ?? -1;
  if (!current || !activeFamilyId || activeIndex < 0) {
    familySelectionPlan = null;
    stage.dataset.familySelectionStatus = "invalid-rendered-family";
    return;
  }

  if (activeFamilyId === plan.targetFamilyId) {
    familySelectionPlan = null;
    stage.dataset.familySelectionStatus = "complete";
    return;
  }

  const nextIndex = (activeIndex + plan.direction + plan.count) % plan.count;
  const nextFamilyId = current.catalog[nextIndex]?.id || "unknown";
  stage.dataset.familySelectionStatus = `moving-${activeFamilyId}-to-${nextFamilyId}`;
  setTimeout(() => {
    if (familySelectionPlan !== plan) return;
    app()?.moveFamily(plan.direction);
  }, 0);
}

function updateTerritoryIndex() {
  const familyId = app()?.resolvedScene?.native?.familyId;
  document.querySelectorAll("[data-family-select]").forEach(button => {
    const active = button.dataset.familySelect === familyId;
    button.setAttribute("aria-current", String(active));
  });
}

function viewportProfile() {
  const rect = stage.getBoundingClientRect();
  const mobile = rect.width <= 720;
  const tablet = !mobile && rect.width <= 1100;
  return { rect, mobile, tablet };
}

function stageOrigin(profile) {
  return {
    x: profile.rect.width / 2,
    y: profile.rect.height * (profile.mobile ? .46 : .47)
  };
}

function overviewFamilyCenters(profile) {
  const origin = stageOrigin(profile);
  if (profile.mobile) {
    const radiusX = Math.min(92, profile.rect.width * .24);
    const radiusY = Math.min(122, profile.rect.height * .19);
    return [
      [origin.x, origin.y - radiusY, 40],
      [origin.x + radiusX, origin.y, 30],
      [origin.x, origin.y + radiusY, 20],
      [origin.x - radiusX, origin.y, 10]
    ];
  }
  const x = Math.min(350, profile.rect.width * .25);
  const y = Math.min(170, profile.rect.height * .22);
  return [
    [origin.x - x, origin.y - y, 40],
    [origin.x + x, origin.y - y, 30],
    [origin.x + x, origin.y + y, 20],
    [origin.x - x, origin.y + y, 10]
  ];
}

function planeLayout(center, profile, active, overview) {
  if (overview) {
    return {
      x: center[0],
      y: center[1],
      z: center[2],
      scale: profile.mobile ? .34 : profile.tablet ? .72 : .92
    };
  }
  const origin = stageOrigin(profile);
  const scale = profile.mobile ? .70 : .98;
  return {
    x: active ? origin.x : origin.x + (center[0] - origin.x) * 1.7,
    y: active ? origin.y - 12 : origin.y + (center[1] - origin.y) * 1.4,
    z: active ? 40 : 0,
    scale: active ? scale : scale * .58
  };
}

function overviewNodePosition(familyIndex, modelIndex, count, profile) {
  const centers = overviewFamilyCenters(profile);
  const origin = stageOrigin(profile);
  const [cx, cy, cz] = centers[familyIndex] || [origin.x, origin.y, 0];
  const midpoint = (count - 1) / 2;
  const normalized = midpoint ? (modelIndex - midpoint) / midpoint : 0;
  const direction = familyIndex < 2 ? 1 : -1;
  const spacing = profile.mobile ? 22 : profile.tablet ? 56 : 72;
  const localX = (modelIndex - midpoint) * spacing;
  const localY = direction * (Math.pow(Math.abs(normalized), 1.7) * (profile.mobile ? 22 : 48) - (profile.mobile ? 7 : 14));
  const scale = profile.mobile ? .34 : profile.tablet ? .62 : .74;
  return { x: cx + localX, y: cy + localY + (profile.mobile ? 4 : 16), z: cz + modelIndex, scale };
}

function browseNodePosition(descriptor, activeDescriptor, profile) {
  const origin = stageOrigin(profile);
  const sameFamily = descriptor.FAMILY_ID === activeDescriptor.FAMILY_ID;
  const delta = descriptor.modelIndex - activeDescriptor.modelIndex;
  const active = descriptor.MODEL_ID === activeDescriptor.MODEL_ID;
  if (active) return { x: origin.x, y: origin.y + (profile.mobile ? -38 : -22), z: 60, scale: 1 };
  if (!sameFamily) return { x: origin.x + (descriptor.familyIndex % 2 ? 900 : -900), y: origin.y + 170, z: 0, scale: .45 };
  const direction = Math.sign(delta) || 1;
  const distance = Math.abs(delta);
  if (distance === 1) {
    return { x: origin.x + direction * (profile.mobile ? 272 : 430), y: origin.y + (profile.mobile ? -12 : 18), z: 30, scale: profile.mobile ? .64 : .74 };
  }
  return { x: origin.x + direction * (profile.mobile ? 450 + distance * 45 : 630 + distance * 80), y: origin.y + 70 + distance * 18, z: 10, scale: .52 };
}

function setNodeTransform(node, layout, projection) {
  node.style.left = `${layout.x}px`;
  node.style.top = `${layout.y}px`;
  node.style.zIndex = String(Math.max(1, Math.round(layout.z + 100)));
  node.style.transform = `translate(-50%, -50%) scale(${layout.scale})`;
  node.dataset.trajectoryProjection = projection;
  node.dataset.compositionX = layout.x.toFixed(2);
  node.dataset.compositionY = layout.y.toFixed(2);
  node.dataset.compositionScale = layout.scale.toFixed(3);
}

function relationGeometry(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2, length, angle, z: Math.min(from.z, to.z) - 5 };
}

function applyRelationshipGeometry(layoutByModel, overview) {
  document.querySelectorAll(".spatial-relationship").forEach(relation => {
    const from = layoutByModel.get(relation.dataset.from);
    const to = layoutByModel.get(relation.dataset.to);
    if (!from || !to) {
      relation.hidden = true;
      return;
    }
    const geometry = relationGeometry(from, to);
    relation.hidden = !overview && !(document.querySelector(`[data-model-id="${CSS.escape(relation.dataset.from)}"]`)?.dataset.active === "true" || document.querySelector(`[data-model-id="${CSS.escape(relation.dataset.to)}"]`)?.dataset.active === "true");
    relation.style.left = `${geometry.x}px`;
    relation.style.top = `${geometry.y}px`;
    relation.style.zIndex = String(Math.max(1, Math.round(geometry.z + 90)));
    relation.style.width = `${geometry.length}px`;
    relation.style.transform = `translate(-50%, -50%) rotate(${geometry.angle}deg)`;
    relation.dataset.compositionRelation = overview ? "FAMILY_TRAJECTORY" : "ACTIVE_NEIGHBOR_LINK";
  });
}

function normalizeStageCoordinatePlane() {
  ensureCompositionAuthorityStyle();
  stage.dataset.compositionAuthority = "PAGE_SPECIFIC";
  sceneRoot.style.left = "0px";
  sceneRoot.style.top = "0px";
  sceneRoot.style.width = "100%";
  sceneRoot.style.height = "100%";
  sceneRoot.style.transform = "none";
  field.style.left = "0px";
  field.style.top = "0px";
  field.style.width = "100%";
  field.style.height = "100%";
  field.style.transform = "none";
}

function applyPageSpecificGeometry() {
  const current = app();
  const resolved = current?.resolvedScene;
  if (!current || !resolved || !stage || !sceneRoot || !field) return;
  const profile = viewportProfile();
  const overview = resolved.cameraMode === "overview";
  const centers = overviewFamilyCenters(profile);
  const activeDescriptor = descriptorRecord(resolved.native.modelId);
  const layoutByModel = new Map();

  stage.dataset.compositionMode = overview ? "FOUR_FAMILY_FIELD" : "ACTIVE_MODEL_FOREGROUND";
  stage.dataset.activeLens = resolved.native.lensId;
  stage.dataset.coordinatePlane = "FULL_STAGE_PIXELS";
  normalizeStageCoordinatePlane();

  document.querySelectorAll(".spatial-family-plane").forEach(plane => {
    const family = current.registry.families.find(candidate => candidate.familyId === plane.dataset.familyId);
    const familyIndex = family?.familyIndex || 0;
    const active = plane.dataset.familyId === resolved.native.familyId;
    const origin = stageOrigin(profile);
    const layout = planeLayout(centers[familyIndex] || [origin.x, origin.y, 0], profile, active, overview);
    plane.dataset.regionOrder = String(familyIndex + 1);
    plane.dataset.regionSemantics = "CANONICAL_ORDER_WITHOUT_DIRECTIONAL_AUTHORITY";
    plane.dataset.compositionRole = overview ? "DISTINCT_FAMILY_TERRITORY" : active ? "ACTIVE_FAMILY_BACKPLANE" : "DISTANT_FAMILY_CONTEXT";
    plane.style.left = `${layout.x}px`;
    plane.style.top = `${layout.y}px`;
    plane.style.zIndex = String(Math.max(1, Math.round(layout.z + 80)));
    plane.style.transform = `translate(-50%, -50%) scale(${layout.scale})`;
  });

  document.querySelectorAll(".spatial-model-node").forEach(node => {
    const descriptor = descriptorRecord(node.dataset.modelId);
    if (!descriptor || !activeDescriptor) return;
    const family = current.registry.families.find(candidate => candidate.familyId === descriptor.FAMILY_ID);
    const count = family?.modelIds?.length || 1;
    const layout = overview
      ? overviewNodePosition(descriptor.familyIndex, descriptor.modelIndex, count, profile)
      : browseNodePosition(descriptor, activeDescriptor, profile);
    layoutByModel.set(descriptor.MODEL_ID, layout);
    setNodeTransform(node, layout, overview ? "CURVED_CANONICAL_ARC" : node.dataset.active === "true" ? "ACTIVE_MODEL" : "VISIBLE_CONTEXT");
    node.dataset.compositionRole = overview ? "OVERVIEW_MODEL_SIGNATURE" : node.dataset.active === "true" ? "PRIMARY_FOREGROUND_MODEL" : node.dataset.lifecycle === "NEAR_NEIGHBOR" ? "SUBORDINATE_NEIGHBOR" : "DISTANT_CONTEXT";
  });

  applyRelationshipGeometry(layoutByModel, overview);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const activeNode = document.querySelector(".spatial-model-node[data-active='true']");
    const stageRect = stage.getBoundingClientRect();
    const activeRect = activeNode?.getBoundingClientRect();
    const fullyVisible = !activeRect || overview || (activeRect.left >= stageRect.left + 6 && activeRect.right <= stageRect.right - 6 && activeRect.top >= stageRect.top + 38 && activeRect.bottom <= stageRect.bottom - (profile.mobile ? 88 : 62));
    stage.dataset.activeModelFullyVisible = String(fullyVisible);
    const nodes = Array.from(document.querySelectorAll(".spatial-model-node:not([hidden])"));
    const centersX = nodes.map(node => {
      const rect = node.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
    const averageX = centersX.length ? centersX.reduce((sum, value) => sum + value, 0) / centersX.length : stageRect.left + stageRect.width / 2;
    stage.dataset.corpusCenterOffsetRatio = (Math.abs(averageX - (stageRect.left + stageRect.width / 2)) / Math.max(1, stageRect.width)).toFixed(4);
  }));
}

function updateLocalOrigin() {
  const current = app();
  const resolved = current?.resolvedScene;
  if (!current || !resolved || !localOriginState) return;
  const descriptor = descriptorRecord(resolved.native.modelId);
  const family = familyRecord(resolved.native.familyId);
  localOriginState.textContent = resolved.cameraMode === "overview"
    ? `Overview · ${current.registry.familyCount} families · ${current.registry.modelCount} models · ${current.registry.lensCount} lenses`
    : `${family?.title || resolved.native.familyId} · ${descriptor?.TITLE || resolved.native.modelId} · ${resolved.native.lensId}`;
}

function updateInspectionOrigin() {
  const current = app();
  const resolved = current?.resolvedScene;
  if (!current || !resolved) return;
  const descriptor = descriptorRecord(resolved.native.modelId);
  const family = familyRecord(resolved.native.familyId);
  setText("[data-inspection-origin-family]", family?.title || resolved.native.familyId);
  setText("[data-inspection-origin-model]", descriptor?.TITLE || resolved.native.modelId);
  setText("[data-inspection-origin-lens]", resolved.native.lensId);
}

function setInspectionPanel(panelId) {
  if (!inspection) return;
  inspection.dataset.mobilePanel = panelId;
  inspectionTabs.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.inspectionTab === panelId)));
}

function synchronize(source = "general") {
  if (!app()?.resolvedScene) return;
  buildTerritoryIndex();
  updateLensInstrument();
  updateTerritoryIndex();
  updateLocalOrigin();
  applyPageSpecificGeometry();
  updateInspectionOrigin();
  continueFamilySelection(source);
  document.documentElement.dataset.lawsChildStageReady = "true";
  document.documentElement.dataset.perceptualCompositionReady = "true";
}

function bind() {
  if (bound) return;
  bound = true;
  lensButtons.forEach(button => button.addEventListener("click", () => selectLens(button.dataset.lensSelect)));
  inspectionTabs.forEach(button => button.addEventListener("click", () => setInspectionPanel(button.dataset.inspectionTab)));
  globalThis.addEventListener("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", () => synchronize("transition"));
  addEventListener("resize", () => requestAnimationFrame(() => synchronize("resize")));
  if (inspection) {
    inspectionObserver = new MutationObserver(() => {
      if (inspection.dataset.open === "true") setInspectionPanel("instrument");
      synchronize("inspection");
    });
    inspectionObserver.observe(inspection, { attributes: true, attributeFilter: ["hidden", "data-open", "data-model-id", "data-form-class"] });
  }
  synchronize("initial");
}

async function initialize() {
  for (let attempt = 0; attempt < 240 && !app()?.resolvedScene; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!app()?.resolvedScene) throw new Error("METHODS_LAWS_CHILD_STAGE_APP_TIMEOUT");
  bind();
}

globalThis.addEventListener("METHODS_MODELS_SPATIAL_TEMPLATE_READY", () => initialize(), { once: true });
initialize().catch(error => {
  document.documentElement.dataset.lawsChildStageReady = "error";
  document.documentElement.dataset.perceptualCompositionReady = "error";
  console.error(error);
});

globalThis.__LAWS_CHILD_STAGE_EXTENSION = Object.freeze({
  contract: "LAWS_CHILD_SPATIAL_STAGE_SHELL_v1",
  compositionContract: "METHODS_CATEGORICAL_SPATIAL_STAGE_PERCEPTUAL_COMPOSITION_CORRECTION_v1",
  transformAuthorityContract: "METHODS_PAGE_SPECIFIC_TRANSFORM_AUTHORITY_v1",
  methodsInstance: "METHODS_CATEGORICAL_CORPUS_STAGE_v1",
  globalOrigin: "LAWS_CHAMBER_AND_RESEARCH_GATEWAY",
  localOrigin: "METHODS_AND_MODELS_CORPUS",
  synchronize,
  selectLens,
  selectFamilyIndex,
  setInspectionPanel
});
