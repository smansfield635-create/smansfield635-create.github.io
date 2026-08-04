const REQUIRED_DESCRIPTOR_KEYS = Object.freeze([
  "modelId",
  "familyId",
  "familyIndex",
  "modelIndex",
  "lensIndex",
  "fieldPosition",
  "familyPlanePosition",
  "modelPosition",
  "lensRelation",
  "neighborIds",
  "relationshipClasses",
  "overviewCameraTarget",
  "browseCameraTarget",
  "inspectionCameraTarget",
  "baseVisualWeight",
  "visibilityClass",
  "detailClass",
  "mobileEligibility"
]);

function isVector(value) {
  return Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);
}

function issue(code, path, detail = null) {
  return Object.freeze({ code, path, detail });
}

export function validateSpatialRegistry(registry, options = {}) {
  const expectedFamilies = options.expectedFamilies ?? 4;
  const expectedModels = options.expectedModels ?? 25;
  const expectedLenses = options.expectedLenses ?? 3;
  const issues = [];

  if (!registry || typeof registry !== "object") return Object.freeze({ valid: false, issues: Object.freeze([issue("REGISTRY_REQUIRED", "$" )]) });
  if (registry.contract !== "METHODS_MODELS_SPATIAL_DESCRIPTOR_REGISTRY_v1") issues.push(issue("CONTRACT_INVALID", "$.contract", registry.contract));
  if (registry.familyCount !== expectedFamilies) issues.push(issue("FAMILY_COUNT_INVALID", "$.familyCount", registry.familyCount));
  if (registry.modelCount !== expectedModels) issues.push(issue("MODEL_COUNT_INVALID", "$.modelCount", registry.modelCount));
  if (registry.lensCount !== expectedLenses) issues.push(issue("LENS_COUNT_INVALID", "$.lensCount", registry.lensCount));
  if (!Array.isArray(registry.descriptors)) issues.push(issue("DESCRIPTORS_REQUIRED", "$.descriptors"));
  if (!Array.isArray(registry.families)) issues.push(issue("FAMILIES_REQUIRED", "$.families"));
  if (!Array.isArray(registry.lenses)) issues.push(issue("LENSES_REQUIRED", "$.lenses"));

  if (issues.length) return Object.freeze({ valid: false, issues: Object.freeze(issues) });

  const modelIds = new Set();
  const familyIds = new Set(registry.families.map(family => family.familyId));
  const lensIds = new Set(registry.lenses.map(lens => lens.id));
  const coordinateKeys = new Set();

  registry.descriptors.forEach((descriptor, index) => {
    const path = `$.descriptors[${index}]`;
    REQUIRED_DESCRIPTOR_KEYS.forEach(key => {
      if (!(key in descriptor)) issues.push(issue("REQUIRED_FIELD_MISSING", `${path}.${key}`));
    });
    if (modelIds.has(descriptor.modelId)) issues.push(issue("DUPLICATE_MODEL_ID", `${path}.modelId`, descriptor.modelId));
    modelIds.add(descriptor.modelId);
    if (!familyIds.has(descriptor.familyId)) issues.push(issue("UNKNOWN_FAMILY_ID", `${path}.familyId`, descriptor.familyId));
    const coordinateKey = `${descriptor.familyIndex}:${descriptor.modelIndex}`;
    if (coordinateKeys.has(coordinateKey)) issues.push(issue("DUPLICATE_MODEL_COORDINATE", path, coordinateKey));
    coordinateKeys.add(coordinateKey);
    ["fieldPosition", "familyPlanePosition", "modelPosition", "overviewCameraTarget", "browseCameraTarget", "inspectionCameraTarget"].forEach(key => {
      if (!isVector(descriptor[key])) issues.push(issue("VECTOR_INVALID", `${path}.${key}`, descriptor[key]));
    });
    if (!descriptor.lensRelation || typeof descriptor.lensRelation !== "object") issues.push(issue("LENS_RELATION_INVALID", `${path}.lensRelation`));
    else lensIds.forEach(lensId => {
      if (!isVector(descriptor.lensRelation[lensId])) issues.push(issue("LENS_RELATION_MISSING", `${path}.lensRelation.${lensId}`));
    });
    if (!Array.isArray(descriptor.neighborIds)) issues.push(issue("NEIGHBOR_IDS_INVALID", `${path}.neighborIds`));
    if (!Array.isArray(descriptor.relationshipClasses)) issues.push(issue("RELATIONSHIP_CLASSES_INVALID", `${path}.relationshipClasses`));
  });

  registry.descriptors.forEach((descriptor, index) => {
    descriptor.neighborIds.forEach((neighborId, neighborIndex) => {
      if (!modelIds.has(neighborId)) issues.push(issue("UNKNOWN_NEIGHBOR_ID", `$.descriptors[${index}].neighborIds[${neighborIndex}]`, neighborId));
      if (neighborId === descriptor.modelId) issues.push(issue("SELF_NEIGHBOR", `$.descriptors[${index}].neighborIds[${neighborIndex}]`, neighborId));
    });
  });

  registry.families.forEach((family, familyIndex) => {
    if (family.familyIndex !== familyIndex) issues.push(issue("FAMILY_INDEX_NONDETERMINISTIC", `$.families[${familyIndex}].familyIndex`, family.familyIndex));
    family.modelIds.forEach((modelId, modelIndex) => {
      const descriptor = registry.descriptors.find(candidate => candidate.modelId === modelId);
      if (!descriptor) issues.push(issue("FAMILY_MODEL_UNRESOLVED", `$.families[${familyIndex}].modelIds[${modelIndex}]`, modelId));
      else if (descriptor.familyId !== family.familyId) issues.push(issue("FAMILY_MODEL_MISMATCH", `$.families[${familyIndex}].modelIds[${modelIndex}]`, modelId));
    });
  });

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function assertSpatialRegistry(registry, options = {}) {
  const result = validateSpatialRegistry(registry, options);
  if (!result.valid) {
    const error = new Error(`METHODS_SPATIAL_REGISTRY_INVALID:${result.issues.map(entry => entry.code).join(",")}`);
    error.issues = result.issues;
    throw error;
  }
  return registry;
}
