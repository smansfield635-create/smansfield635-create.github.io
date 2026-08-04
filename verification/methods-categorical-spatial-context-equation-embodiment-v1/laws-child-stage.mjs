const stage = document.querySelector("[data-spatial-stage]");
const sceneRoot = document.querySelector("[data-spatial-scene-root]");
const field = document.querySelector("[data-spatial-field]");
const localOriginState = document.querySelector("[data-local-origin-state]");
const inspection = document.querySelector("[data-spatial-inspection]");
const lensButtons = Array.from(document.querySelectorAll("[data-lens-select]"));
const territoryIndex = document.querySelector("[data-family-territory-index]");
const inspectionTabs = Array.from(document.querySelectorAll("[data-inspection-tab]"));
let bound = false;
let inspectionObserver = null;
let territoryBuilt = false;
let familySelectionToken = 0;

function app() {
  return globalThis.__METHODS_SPATIAL_APP || null;
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

function currentFamilyIndex() {
  const nativeIndex = Number(app()?.nativeState?.z?.index);
  if (Number.isInteger(nativeIndex)) return nativeIndex;
  const renderedIndex = Number(app()?.resolvedScene?.native?.familyIndex);
  return Number.isInteger(renderedIndex) ? renderedIndex : null;
}

function advanceFamilySelection(targetIndex, direction, token) {
  if (token !== familySelectionToken) return;
  const current = app();
  const activeIndex = currentFamilyIndex();
  const count = current?.registry?.familyCount || 4;
  if (!current || !Number.isInteger(activeIndex)) {
    stage.dataset.familySelectionStatus = "invalid-native-state";
    return;
  }
  if (activeIndex === targetIndex) {
    stage.dataset.familySelectionStatus = "settling";
    current.whenStable().then(() => {
      if (token !== familySelectionToken) return;
      synchronize();
      stage.dataset.familySelectionStatus = "complete";
    }).catch(error => {
      stage.dataset.familySelectionStatus = "render-failure";
      console.error(error);
    });
    return;
  }

  const expectedIndex = (activeIndex + direction + count) % count;
  stage.dataset.familySelectionStatus = `moving-${activeIndex}-to-${expectedIndex}`;
  let timeoutId = 0;
  const onReceipt = () => {
    clearTimeout(timeoutId);
    if (token !== familySelectionToken) return;
    setTimeout(() => advanceFamilySelection(targetIndex, direction, token), 0);
  };
  globalThis.addEventListener("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", onReceipt, { once: true });
  timeoutId = setTimeout(() => {
    globalThis.removeEventListener("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", onReceipt);
    if (token === familySelectionToken) stage.dataset.familySelectionStatus = `timeout-${expectedIndex}`;
  }, 12000);
  current.moveFamily(direction);
}

function selectFamilyIndex(targetIndex) {
  const current = app();
  const from = currentFamilyIndex();
  const count = current?.registry?.familyCount || 4;
  if (!current || !Number.isInteger(from) || !Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= count) return;
  const token = ++familySelectionToken;
  if (from === targetIndex) {
    stage.dataset.familySelectionStatus = "complete";
    synchronize();
    return;
  }
  const forward = (targetIndex - from + count) % count;
  const backward = (from - targetIndex + count) % count;
  const direction = forward <= backward ? 1 : -1;
  advanceFamilySelection(targetIndex, direction, token);
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

function overviewFamilyCenters(profile) {
  if (profile.mobile) {
    const radiusX = Math.min(105, profile.rect.width * .27);
    const radiusY = Math.min(126, profile.rect.height * .20);
    return [
      [0, -radiusY, -30],
      [radiusX, 0, 10],
      [0, radiusY, 50],
      [-radiusX, 0, 90]
    ];
  }
  const x = Math.min(390, profile.rect.width * .27);
  const y = Math.min(168, profile.rect.height * .235);
  return [
    [-x, -y, -90],
    [x, -y, -30],
    [x, y, 30],
    [-x, y, 90]
  ];
}

function planeTransform(center, profile, active, overview) {
  if (overview) {
    const scale = profile.mobile ? .36 : profile.tablet ? .72 : .92;
    return `translate3d(${center[0]}px, ${center[1]}px, ${center[2]}px) translate(-50%, -50%) scale(${scale})`;
  }
  const scale = profile.mobile ? .7 : .98;
  const x = active ? 0 : center[0] * 1.7;
  const y = active ? -12 : center[1] * 1.4;
  const z = active ? -120 : -460;
  return `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) scale(${active ? scale : scale * .58})`;
}

function overviewNodePosition(familyIndex, modelIndex, count, profile) {
  const centers = overviewFamilyCenters(profile);
  const [cx, cy, cz] = centers[familyIndex] || [0, 0, 0];
  const midpoint = (count - 1) / 2;
  const normalized = midpoint ? (modelIndex - midpoint) / midpoint : 0;
  const direction = familyIndex < 2 ? 1 : -1;
  const spacing = profile.mobile ? 27 : profile.tablet ? 56 : 74;
  const localX = (modelIndex - midpoint) * spacing;
  const localY = direction * (Math.pow(Math.abs(normalized), 1.7) * (profile.mobile ? 28 : 52) - (profile.mobile ? 9 : 16));
  const scale = profile.mobile ? .37 : profile.tablet ? .62 : .74;
  return { x: cx + localX, y: cy + localY + (profile.mobile ? 7 : 24), z: cz + modelIndex * 2, scale };
}

function browseNodePosition(descriptor, activeDescriptor, profile) {
  const sameFamily = descriptor.FAMILY_ID === activeDescriptor.FAMILY_ID;
  const delta = descriptor.modelIndex - activeDescriptor.modelIndex;
  const active = descriptor.MODEL_ID === activeDescriptor.MODEL_ID;
  if (active) return { x: 0, y: profile.mobile ? -44 : -26, z: 240, scale: profile.mobile ? .91 : 1 };
  if (!sameFamily) return { x: descriptor.familyIndex % 2 ? 900 : -900, y: 170, z: -540, scale: .45 };
  const wrappedDelta = delta;
  const direction = Math.sign(wrappedDelta) || 1;
  const distance = Math.abs(wrappedDelta);
  if (distance === 1) {
    return { x: direction * (profile.mobile ? 265 : 420), y: profile.mobile ? -16 : 20, z: 70, scale: profile.mobile ? .65 : .76 };
  }
  return { x: direction * (profile.mobile ? 440 + distance * 45 : 620 + distance * 80), y: 72 + distance * 18, z: -120 - distance * 30, scale: .54 };
}

function setNodeTransform(node, layout, projection) {
  node.style.transform = `translate3d(${layout.x}px, ${layout.y}px, ${layout.z}px) translate(-50%, -50%) scale(${layout.scale})`;
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
    relation.style.width = `${geometry.length}px`;
    relation.style.transform = `translate3d(${geometry.x}px, ${geometry.y}px, ${geometry.z}px) translate(-50%, -50%) rotate(${geometry.angle}deg)`;
    relation.dataset.compositionRelation = overview ? "FAMILY_TRAJECTORY" : "ACTIVE_NEIGHBOR_LINK";
  });
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
  sceneRoot.style.transform = "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)";
  field.style.transform = "translate3d(0px, 0px, 0px)";

  document.querySelectorAll(".spatial-family-plane").forEach(plane => {
    const family = current.registry.families.find(candidate => candidate.familyId === plane.dataset.familyId);
    const familyIndex = family?.familyIndex || 0;
    const active = plane.dataset.familyId === resolved.native.familyId;
    plane.dataset.regionOrder = String(familyIndex + 1);
    plane.dataset.regionSemantics = "CANONICAL_ORDER_WITHOUT_DIRECTIONAL_AUTHORITY";
    plane.dataset.compositionRole = overview ? "DISTINCT_FAMILY_TERRITORY" : active ? "ACTIVE_FAMILY_BACKPLANE" : "DISTANT_FAMILY_CONTEXT";
    plane.style.transform = planeTransform(centers[familyIndex] || [0,0,0], profile, active, overview);
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

  requestAnimationFrame(() => {
    const activeNode = document.querySelector(".spatial-model-node[data-active='true']");
    const stageRect = stage.getBoundingClientRect();
    const activeRect = activeNode?.getBoundingClientRect();
    const fullyVisible = !activeRect || overview || (activeRect.left >= stageRect.left + 6 && activeRect.right <= stageRect.right - 6 && activeRect.top >= stageRect.top + 45 && activeRect.bottom <= stageRect.bottom - (profile.mobile ? 90 : 64));
    stage.dataset.activeModelFullyVisible = String(fullyVisible);
    const nodes = Array.from(document.querySelectorAll(".spatial-model-node:not([hidden])"));
    const centersX = nodes.map(node => {
      const rect = node.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
    const averageX = centersX.length ? centersX.reduce((sum, value) => sum + value, 0) / centersX.length : stageRect.left + stageRect.width / 2;
    stage.dataset.corpusCenterOffsetRatio = (Math.abs(averageX - (stageRect.left + stageRect.width / 2)) / Math.max(1, stageRect.width)).toFixed(4);
  });
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

function synchronize() {
  if (!app()?.resolvedScene) return;
  buildTerritoryIndex();
  updateLensInstrument();
  updateTerritoryIndex();
  updateLocalOrigin();
  applyPageSpecificGeometry();
  updateInspectionOrigin();
  document.documentElement.dataset.lawsChildStageReady = "true";
  document.documentElement.dataset.perceptualCompositionReady = "true";
}

function bind() {
  if (bound) return;
  bound = true;
  lensButtons.forEach(button => button.addEventListener("click", () => selectLens(button.dataset.lensSelect)));
  inspectionTabs.forEach(button => button.addEventListener("click", () => setInspectionPanel(button.dataset.inspectionTab)));
  globalThis.addEventListener("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", synchronize);
  addEventListener("resize", () => requestAnimationFrame(synchronize));
  if (inspection) {
    inspectionObserver = new MutationObserver(() => {
      if (inspection.dataset.open === "true") setInspectionPanel("instrument");
      synchronize();
    });
    inspectionObserver.observe(inspection, { attributes: true, attributeFilter: ["hidden", "data-open", "data-model-id", "data-form-class"] });
  }
  synchronize();
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
  methodsInstance: "METHODS_CATEGORICAL_CORPUS_STAGE_v1",
  globalOrigin: "LAWS_CHAMBER_AND_RESEARCH_GATEWAY",
  localOrigin: "METHODS_AND_MODELS_CORPUS",
  synchronize,
  selectLens,
  selectFamilyIndex,
  setInspectionPanel
});
