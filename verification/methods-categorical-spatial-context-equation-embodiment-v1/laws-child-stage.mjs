const UNIT = 18;
const FAMILY_OVERVIEW_REGIONS = Object.freeze([
  Object.freeze([-430, -205, -120]),
  Object.freeze([430, -190, -40]),
  Object.freeze([405, 205, 40]),
  Object.freeze([-415, 220, 120])
]);

const stage = document.querySelector("[data-spatial-stage]");
const localOriginState = document.querySelector("[data-local-origin-state]");
const inspection = document.querySelector("[data-spatial-inspection]");
const lensButtons = Array.from(document.querySelectorAll("[data-lens-select]"));
let bound = false;
let observer = null;

function app() {
  return globalThis.__METHODS_SPATIAL_APP || null;
}

function familyRecord(familyId) {
  const current = app();
  return current?.catalog?.find(family => family.id === familyId) || null;
}

function descriptorRecord(modelId) {
  const current = app();
  return current?.registry?.descriptors?.find(descriptor => (descriptor.MODEL_ID || descriptor.modelId) === modelId) || null;
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

function familyRegionTransform(familyIndex, viewportClass, active, overview, fallbackDepth) {
  if (!overview) {
    const offset = active ? 0 : familyIndex % 2 === 0 ? -92 : 92;
    return `translate3d(${offset}px, 0, ${fallbackDepth}px) translate(-50%, -50%) scale(${active ? 1 : .82})`;
  }
  const [x, y, z] = FAMILY_OVERVIEW_REGIONS[familyIndex] || [0, 0, fallbackDepth];
  const scale = viewportClass === "mobile" ? .42 : viewportClass === "tablet" ? .5 : .58;
  const viewportScale = viewportClass === "mobile" ? .64 : viewportClass === "tablet" ? .82 : 1;
  return `translate3d(${x * viewportScale}px, ${y * viewportScale}px, ${z}px) translate(-50%, -50%) scale(${scale})`;
}

function nodeTransform(position) {
  return `translate3d(${position[0] * UNIT}px, ${-position[1] * UNIT}px, ${position[2] * UNIT}px) translate(-50%, -50%)`;
}

function applyPageSpecificGeometry() {
  const current = app();
  const resolved = current?.resolvedScene;
  if (!current || !resolved || !stage) return;
  const overview = resolved.cameraMode === "overview";

  document.querySelectorAll(".spatial-family-plane").forEach(plane => {
    const family = current.registry.families.find(candidate => candidate.familyId === plane.dataset.familyId);
    const familyIndex = family?.familyIndex || 0;
    const active = plane.dataset.familyId === resolved.native.familyId;
    const fallbackDepth = (family?.planePosition?.[2] || 0) * UNIT;
    plane.dataset.regionOrder = String(familyIndex + 1);
    plane.dataset.regionSemantics = "CANONICAL_ORDER_WITHOUT_DIRECTIONAL_AUTHORITY";
    plane.style.transform = familyRegionTransform(familyIndex, resolved.viewportClass, active, overview, fallbackDepth);
  });

  if (overview) {
    document.querySelectorAll(".spatial-model-node").forEach(node => {
      const descriptor = descriptorRecord(node.dataset.modelId);
      if (!descriptor?.fieldPosition) return;
      const family = current.registry.families.find(candidate => candidate.familyId === (descriptor.FAMILY_ID || descriptor.familyId));
      const count = family?.modelIds?.length || 1;
      const midpoint = (count - 1) / 2;
      const arcDistance = Math.abs(descriptor.modelIndex - midpoint);
      node.style.transform = nodeTransform([descriptor.fieldPosition[0], arcDistance * 1.15, descriptor.fieldPosition[2]]);
      node.dataset.trajectoryProjection = "CURVED_CANONICAL_ARC";
    });
  } else {
    document.querySelectorAll(".spatial-model-node").forEach(node => {
      node.dataset.trajectoryProjection = node.dataset.active === "true" ? "ACTIVE_MODEL" : "VISIBLE_CONTEXT";
    });
  }
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

function synchronize() {
  if (!app()?.resolvedScene) return;
  updateLensInstrument();
  updateLocalOrigin();
  applyPageSpecificGeometry();
  updateInspectionOrigin();
  document.documentElement.dataset.lawsChildStageReady = "true";
}

function bind() {
  if (bound) return;
  bound = true;
  lensButtons.forEach(button => button.addEventListener("click", () => selectLens(button.dataset.lensSelect)));
  globalThis.addEventListener("METHODS_MODELS_RENDERER_TRANSITION_RECEIPT", synchronize);
  if (inspection) {
    observer = new MutationObserver(synchronize);
    observer.observe(inspection, { attributes: true, attributeFilter: ["hidden", "data-open", "data-model-id"] });
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
  console.error(error);
});

globalThis.__LAWS_CHILD_STAGE_EXTENSION = Object.freeze({
  contract: "LAWS_CHILD_SPATIAL_STAGE_SHELL_v1",
  methodsInstance: "METHODS_CATEGORICAL_CORPUS_STAGE_v1",
  globalOrigin: "LAWS_CHAMBER_AND_RESEARCH_GATEWAY",
  localOrigin: "METHODS_AND_MODELS_CORPUS",
  synchronize,
  selectLens
});
