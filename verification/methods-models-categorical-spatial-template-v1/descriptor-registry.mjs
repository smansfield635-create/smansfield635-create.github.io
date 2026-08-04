export const SPATIAL_DESCRIPTOR_SCHEMA_VERSION = "1.0.0";
export const SPATIAL_REGISTRY_VERSION = "1.0.1";
export const PAGE_EXPRESSION_PROFILE_VERSION = "neutral-structural@1.0.0";

export const LENSES = Object.freeze([
  Object.freeze({ id: "practical", index: 0, relation: Object.freeze([0, -7, 0]) }),
  Object.freeze({ id: "engineering", index: 1, relation: Object.freeze([0, 0, 0]) }),
  Object.freeze({ id: "evidence", index: 2, relation: Object.freeze([0, 7, 0]) })
]);

const FAMILY_DEPTH = 30;
const MODEL_SPACING = 12;

function freezeVector(vector) {
  return Object.freeze(vector.map(Number));
}

function nearestNeighborIndexes(modelCount, modelIndex, limit = 2) {
  return Array.from({ length: modelCount }, (_, index) => index)
    .filter(index => index !== modelIndex)
    .sort((left, right) => Math.abs(left - modelIndex) - Math.abs(right - modelIndex) || left - right)
    .slice(0, Math.min(limit, Math.max(0, modelCount - 1)));
}

function descriptorForModel(family, familyIndex, model, modelIndex) {
  const modelCount = family.models.length;
  const centeredIndex = modelIndex - (modelCount - 1) / 2;
  const familyZ = -familyIndex * FAMILY_DEPTH;
  const modelX = centeredIndex * MODEL_SPACING;
  const neighborIndexes = nearestNeighborIndexes(modelCount, modelIndex, 2);
  const neighborIds = neighborIndexes.map(index => family.models[index].id);
  const relationshipClasses = neighborIndexes.map(index => Math.abs(index - modelIndex) === 1 ? "SAME_FAMILY_ADJACENT" : "SAME_FAMILY_NEAR");

  const fieldPosition = freezeVector([modelX, 0, familyZ]);
  return Object.freeze({
    modelId: model.id,
    familyId: family.id,
    familyIndex,
    modelIndex,
    lensIndex: 0,
    fieldPosition,
    familyPlanePosition: freezeVector([0, 0, familyZ]),
    modelPosition: freezeVector([modelX, 0, 0]),
    lensRelation: Object.freeze(Object.fromEntries(LENSES.map(lens => [lens.id, lens.relation]))),
    neighborIds: Object.freeze(neighborIds),
    relationshipClasses: Object.freeze(relationshipClasses),
    overviewCameraTarget: freezeVector([modelX, 0, -(FAMILY_DEPTH * 1.5)]),
    browseCameraTarget: fieldPosition,
    inspectionCameraTarget: freezeVector([modelX, 0, familyZ + 2]),
    baseVisualWeight: 1,
    visibilityClass: "FIELD",
    detailClass: "DISTANT",
    mobileEligibility: true,
    landmarkSlot: null,
    materialProfileSlot: "NEUTRAL_STRUCTURAL",
    atmosphereProfileSlot: "NEUTRAL_STRUCTURAL"
  });
}

export function buildSpatialRegistry(catalog) {
  if (!Array.isArray(catalog)) throw new TypeError("METHODS_CATALOG_ARRAY_REQUIRED");
  const families = catalog.map((family, familyIndex) => Object.freeze({
    familyId: family.id,
    familyIndex,
    label: family.label,
    title: family.title,
    planePosition: freezeVector([0, 0, -familyIndex * FAMILY_DEPTH]),
    modelIds: Object.freeze(family.models.map(model => model.id))
  }));

  const descriptors = catalog.flatMap((family, familyIndex) =>
    family.models.map((model, modelIndex) => descriptorForModel(family, familyIndex, model, modelIndex))
  );

  const registry = {
    contract: "METHODS_MODELS_SPATIAL_DESCRIPTOR_REGISTRY_v1",
    schemaVersion: SPATIAL_DESCRIPTOR_SCHEMA_VERSION,
    registryVersion: SPATIAL_REGISTRY_VERSION,
    expressionProfileVersion: PAGE_EXPRESSION_PROFILE_VERSION,
    sourceAuthority: "METHODS_NATIVE_CATALOG",
    rendererAuthority: "METHODS_SPATIAL_PROJECTION",
    familyCount: families.length,
    modelCount: descriptors.length,
    lensCount: LENSES.length,
    lenses: LENSES,
    families: Object.freeze(families),
    descriptors: Object.freeze(descriptors)
  };

  return Object.freeze(registry);
}

export function indexSpatialRegistry(registry) {
  return Object.freeze({
    byModelId: new Map(registry.descriptors.map(descriptor => [descriptor.modelId, descriptor])),
    byFamilyId: new Map(registry.families.map(family => [family.familyId, family])),
    lensById: new Map(registry.lenses.map(lens => [lens.id, lens]))
  });
}
