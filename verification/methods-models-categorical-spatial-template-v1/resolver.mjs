import { indexSpatialRegistry } from "./descriptor-registry.mjs";

const CAMERA_PRESETS = Object.freeze({
  desktop: Object.freeze({
    overview: Object.freeze({ depth: 880, rotateX: -8, rotateY: 9, scale: 0.72 }),
    browse: Object.freeze({ depth: 290, rotateX: -3, rotateY: 4, scale: 1 }),
    inspection: Object.freeze({ depth: 210, rotateX: 0, rotateY: 0, scale: 1.06 })
  }),
  tablet: Object.freeze({
    overview: Object.freeze({ depth: 820, rotateX: -7, rotateY: 8, scale: 0.66 }),
    browse: Object.freeze({ depth: 300, rotateX: -3, rotateY: 3, scale: 0.94 }),
    inspection: Object.freeze({ depth: 220, rotateX: 0, rotateY: 0, scale: 1 })
  }),
  mobile: Object.freeze({
    overview: Object.freeze({ depth: 760, rotateX: -6, rotateY: 7, scale: 0.52 }),
    browse: Object.freeze({ depth: 275, rotateX: -2, rotateY: 2, scale: 0.84 }),
    inspection: Object.freeze({ depth: 205, rotateX: 0, rotateY: 0, scale: 0.92 })
  })
});

const LENS_CAMERA_PITCH = Object.freeze({ practical: -3, engineering: 0, evidence: 3 });
const LENS_TARGET_WEIGHT = 0.28;

export function classifyViewport(width, height) {
  if (width <= 760) return "mobile";
  if (width <= 1100 || height <= 850) return "tablet";
  return "desktop";
}

function vectorAdd(a, b) {
  return a.map((value, index) => value + b[index]);
}

function scaleVector(vector, scalar) {
  return vector.map(value => value * scalar);
}

function stableNativeState(detail) {
  return Object.freeze({
    familyId: detail?.z?.familyId || detail?.familyId || "",
    familyIndex: Number(detail?.z?.index ?? detail?.familyIndex ?? 0),
    modelId: detail?.x?.modelId || detail?.modelId || "",
    modelIndex: Number(detail?.x?.index ?? detail?.modelIndex ?? 0),
    lensId: detail?.y?.lens || detail?.lens || "practical",
    lensIndex: Number(detail?.y?.index ?? 0),
    displayState: detail?.display || "expanded"
  });
}

function lifecycleLensWeight(lifecycle) {
  if (lifecycle === "ACTIVE_MODEL") return 1;
  if (lifecycle === "NEAR_NEIGHBOR") return 0.5;
  if (lifecycle === "FAMILY_CONTEXT") return 0.16;
  return 0;
}

export function resolveSceneState({ registry, nativeState, cameraMode = "overview", inspectionOpen = false, viewport }) {
  const indexed = indexSpatialRegistry(registry);
  const native = stableNativeState(nativeState);
  const active = indexed.byModelId.get(native.modelId) || registry.descriptors.find(candidate => candidate.familyIndex === native.familyIndex && candidate.modelIndex === native.modelIndex);
  if (!active) throw new Error(`METHODS_ACTIVE_DESCRIPTOR_UNRESOLVED:${native.modelId || `${native.familyIndex}:${native.modelIndex}`}`);
  const family = indexed.byFamilyId.get(active.familyId);
  const viewportClass = classifyViewport(viewport.width, viewport.height);
  const mode = inspectionOpen ? "inspection" : cameraMode;
  const preset = CAMERA_PRESETS[viewportClass][mode];
  const lensVector = active.lensRelation[native.lensId] || active.lensRelation.practical;
  const targetBase = mode === "overview" ? active.overviewCameraTarget : mode === "inspection" ? active.inspectionCameraTarget : active.browseCameraTarget;
  const target = vectorAdd(targetBase, scaleVector(lensVector, LENS_TARGET_WEIGHT));
  const activeNeighborSet = new Set(active.neighborIds);

  const nodes = registry.descriptors.map(descriptor => {
    let lifecycle = "DISTANT_CORPUS";
    let detailClass = "SILHOUETTE";
    let visible = true;
    if (descriptor.modelId === active.modelId) {
      lifecycle = "ACTIVE_MODEL";
      detailClass = "FULL";
    } else if (activeNeighborSet.has(descriptor.modelId)) {
      lifecycle = "NEAR_NEIGHBOR";
      detailClass = "REDUCED";
    } else if (descriptor.familyId === active.familyId) {
      lifecycle = "FAMILY_CONTEXT";
      detailClass = "IDENTITY";
    }

    if (viewportClass === "mobile") {
      if (lifecycle === "FAMILY_CONTEXT") visible = descriptor.modelIndex % 2 === 0;
      if (lifecycle === "DISTANT_CORPUS") visible = descriptor.modelIndex === 0;
    } else if (viewportClass === "tablet" && lifecycle === "DISTANT_CORPUS") {
      visible = descriptor.modelIndex % 2 === 0;
    }

    const relation = descriptor.lensRelation[native.lensId] || [0, 0, 0];
    const position = vectorAdd(descriptor.fieldPosition, scaleVector(relation, lifecycleLensWeight(lifecycle)));

    return Object.freeze({
      modelId: descriptor.modelId,
      familyId: descriptor.familyId,
      lifecycle,
      detailClass,
      visible,
      position: Object.freeze(position),
      active: descriptor.modelId === active.modelId
    });
  });

  return Object.freeze({
    contract: "METHODS_MODELS_RESOLVED_SCENE_STATE_v1",
    native,
    activeDescriptor: active,
    activeFamily: family,
    viewportClass,
    cameraMode: mode,
    camera: Object.freeze({
      preset: `${viewportClass}:${mode}:${native.lensId}`,
      target: Object.freeze(target),
      depth: preset.depth,
      rotateX: preset.rotateX + (LENS_CAMERA_PITCH[native.lensId] || 0),
      rotateY: preset.rotateY,
      scale: preset.scale
    }),
    visibleCluster: Object.freeze(nodes.filter(node => node.visible).map(node => node.modelId)),
    nodes: Object.freeze(nodes)
  });
}

export function createReturnSnapshot({ resolvedScene, cameraMode, scrollPosition, focusTarget, inputMode, viewport }) {
  return Object.freeze({
    contract: "METHODS_MODELS_RENDERER_RETURN_SNAPSHOT_v1",
    nativeFamily: resolvedScene.native.familyId,
    nativeModel: resolvedScene.native.modelId,
    nativeLens: resolvedScene.native.lensId,
    displayState: resolvedScene.native.displayState,
    cameraPreset: resolvedScene.camera.preset,
    cameraPosition: Object.freeze([0, 0, resolvedScene.camera.depth]),
    cameraTarget: Object.freeze([...resolvedScene.camera.target]),
    cameraOffset: Object.freeze([resolvedScene.camera.rotateY, resolvedScene.camera.rotateX, 0]),
    centeredRenderTarget: resolvedScene.activeDescriptor.modelId,
    visibleCluster: Object.freeze([...resolvedScene.visibleCluster]),
    detailClasses: Object.freeze(Object.fromEntries(resolvedScene.nodes.filter(node => node.visible).map(node => [node.modelId, node.detailClass]))),
    scrollPosition,
    focusTarget,
    inputMode,
    viewportClass: resolvedScene.viewportClass,
    requestedCameraMode: cameraMode,
    viewport: Object.freeze({ width: viewport.width, height: viewport.height })
  });
}
