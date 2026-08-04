import { buildSpatialRegistry } from "../methods-models-categorical-spatial-template-v1/descriptor-registry.mjs";

export const SEMANTIC_DESCRIPTOR_CONTRACT = "METHODS_MODEL_SEMANTIC_DESCRIPTOR_v1";
export const SEMANTIC_REGISTRY_CONTRACT = "METHODS_CATEGORICAL_SPATIAL_SEMANTIC_REGISTRY_v1";
export const CANONICAL_SOURCE_PATH = "laws/research/methods-and-models/showroom.js";

export const EQUATION_FORM_CLASSES = Object.freeze([
  "ENVELOPE",
  "GATE_OR_MINIMUM",
  "MULTIPLICATIVE",
  "RATIO",
  "COMPLEMENT",
  "LEDGER",
  "THRESHOLD",
  "SEQUENCE",
  "CYCLE",
  "DIAGNOSTIC_PATH",
  "FALSIFICATION_PATH",
  "BOUNDARY_OR_NO_MATCH"
]);

export const EQUATION_FORM_MAPPING = Object.freeze({
  "envelope-451": "ENVELOPE",
  "gate-448": "GATE_OR_MINIMUM",
  "spine-minimum": "GATE_OR_MINIMUM",
  "collapse-qualified": "GATE_OR_MINIMUM",
  "membrane-61": "BOUNDARY_OR_NO_MATCH",
  "anchors-9": "BOUNDARY_OR_NO_MATCH",
  "pressure-field": "MULTIPLICATIVE",
  "capacity-field": "MULTIPLICATIVE",
  "pcr": "RATIO",
  "stability": "COMPLEMENT",
  "hazard": "COMPLEMENT",
  "complement": "COMPLEMENT",
  "zero-aware": "MULTIPLICATIVE",
  "mass-ledger": "LEDGER",
  "residual-u": "LEDGER",
  "closure-threshold": "THRESHOLD",
  "energy-loop": "CYCLE",
  "useful-output": "THRESHOLD",
  "first": "DIAGNOSTIC_PATH",
  "integral-method": "FALSIFICATION_PATH",
  "diagnostic-five": "DIAGNOSTIC_PATH",
  "abcd": "DIAGNOSTIC_PATH",
  "falsification": "FALSIFICATION_PATH",
  "no-match": "BOUNDARY_OR_NO_MATCH",
  "fixtures": "FALSIFICATION_PATH"
});

export const SEMANTIC_FIELDS = Object.freeze([
  "FAMILY_ID",
  "MODEL_ID",
  "TITLE",
  "QUESTION",
  "STATEMENT",
  "EQUATION",
  "EQUATION_LABEL",
  "PRACTICAL",
  "ENGINEERING",
  "EVIDENCE",
  "PURPOSE",
  "SYMBOLS",
  "ARCHITECTURE",
  "OPERATION",
  "FAILURE",
  "LIMITS",
  "SOURCE_STATE",
  "STATUS",
  "EQUATION_FORM_CLASS",
  "CANONICAL_SOURCE_REFERENCE"
]);

const CANONICAL_TO_DESCRIPTOR_FIELDS = Object.freeze({
  TITLE: "title",
  QUESTION: "question",
  STATEMENT: "statement",
  EQUATION: "equation",
  EQUATION_LABEL: "equationLabel",
  PRACTICAL: "practical",
  ENGINEERING: "engineering",
  EVIDENCE: "evidence",
  PURPOSE: "purpose",
  SYMBOLS: "symbols",
  ARCHITECTURE: "architecture",
  OPERATION: "operation",
  FAILURE: "failure",
  LIMITS: "limits",
  SOURCE_STATE: "sourceState",
  STATUS: "status"
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function canonicalReference(family, familyIndex, model, modelIndex) {
  return deepFreeze({
    path: CANONICAL_SOURCE_PATH,
    declaration: "families",
    familyIndex,
    modelIndex,
    familyId: family.id,
    modelId: model.id,
    selector: `families[${familyIndex}].models[${modelIndex}]`
  });
}

function semanticDescriptor(spatialDescriptor, family, familyIndex, model, modelIndex) {
  const formClass = EQUATION_FORM_MAPPING[model.id];
  if (!formClass) throw new Error(`UNDECLARED_FORM_MAPPING:${model.id}`);
  if (!EQUATION_FORM_CLASSES.includes(formClass)) throw new Error(`INADMISSIBLE_FORM_MAPPING:${model.id}:${formClass}`);

  const descriptor = {
    ...spatialDescriptor,
    semanticContract: SEMANTIC_DESCRIPTOR_CONTRACT,
    FAMILY_ID: family.id,
    MODEL_ID: model.id,
    TITLE: model.title,
    QUESTION: model.question,
    STATEMENT: model.statement,
    EQUATION: model.equation,
    EQUATION_LABEL: model.equationLabel,
    PRACTICAL: model.practical,
    ENGINEERING: model.engineering,
    EVIDENCE: model.evidence,
    PURPOSE: model.purpose,
    SYMBOLS: Array.isArray(model.symbols) ? [...model.symbols] : model.symbols,
    ARCHITECTURE: model.architecture,
    OPERATION: model.operation,
    FAILURE: model.failure,
    LIMITS: model.limits,
    SOURCE_STATE: model.sourceState,
    STATUS: model.status,
    EQUATION_FORM_CLASS: formClass,
    CANONICAL_SOURCE_REFERENCE: canonicalReference(family, familyIndex, model, modelIndex)
  };

  return deepFreeze(descriptor);
}

export function buildSemanticSpatialRegistry(catalog) {
  const spatial = buildSpatialRegistry(catalog);
  const spatialByModel = new Map(spatial.descriptors.map(descriptor => [descriptor.modelId, descriptor]));
  const descriptors = catalog.flatMap((family, familyIndex) =>
    family.models.map((model, modelIndex) => {
      const spatialDescriptor = spatialByModel.get(model.id);
      if (!spatialDescriptor) throw new Error(`SPATIAL_DESCRIPTOR_UNRESOLVED:${model.id}`);
      return semanticDescriptor(spatialDescriptor, family, familyIndex, model, modelIndex);
    })
  );

  return deepFreeze({
    ...spatial,
    contract: spatial.contract,
    semanticRegistryContract: SEMANTIC_REGISTRY_CONTRACT,
    semanticDescriptorContract: SEMANTIC_DESCRIPTOR_CONTRACT,
    canonicalSource: CANONICAL_SOURCE_PATH,
    semanticFieldNames: [...SEMANTIC_FIELDS],
    equationFormClasses: [...EQUATION_FORM_CLASSES],
    equationFormMapping: { ...EQUATION_FORM_MAPPING },
    descriptors
  });
}

function issue(code, modelId = null, field = null, detail = null) {
  return Object.freeze({ code, modelId, field, detail });
}

export function validateSemanticRegistry(registry, catalog) {
  const issues = [];
  const canonicalModels = catalog.flatMap((family, familyIndex) =>
    family.models.map((model, modelIndex) => ({ family, familyIndex, model, modelIndex }))
  );
  const descriptorByModel = new Map(registry.descriptors.map(descriptor => [descriptor.MODEL_ID, descriptor]));

  if (registry.semanticRegistryContract !== SEMANTIC_REGISTRY_CONTRACT) issues.push(issue("SEMANTIC_REGISTRY_CONTRACT_INVALID"));
  if (canonicalModels.length !== 25) issues.push(issue("CANONICAL_MODEL_COUNT_INVALID", null, null, canonicalModels.length));
  if (registry.descriptors.length !== canonicalModels.length) issues.push(issue("DESCRIPTOR_MODEL_COUNT_INVALID", null, null, registry.descriptors.length));
  if (Object.keys(EQUATION_FORM_MAPPING).length !== canonicalModels.length) issues.push(issue("FORM_MAPPING_COUNT_INVALID", null, null, Object.keys(EQUATION_FORM_MAPPING).length));

  canonicalModels.forEach(({ family, familyIndex, model, modelIndex }) => {
    const descriptor = descriptorByModel.get(model.id);
    if (!descriptor) {
      issues.push(issue("DESCRIPTOR_MISSING", model.id));
      return;
    }
    if (descriptor.FAMILY_ID !== family.id) issues.push(issue("FAMILY_ID_CHANGED", model.id, "FAMILY_ID", descriptor.FAMILY_ID));
    if (descriptor.MODEL_ID !== model.id) issues.push(issue("MODEL_ID_CHANGED", model.id, "MODEL_ID", descriptor.MODEL_ID));

    for (const [descriptorField, canonicalField] of Object.entries(CANONICAL_TO_DESCRIPTOR_FIELDS)) {
      const expected = model[canonicalField];
      const actual = descriptor[descriptorField];
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        issues.push(issue("CANONICAL_FIELD_CHANGED", model.id, descriptorField, { expected, actual }));
      }
    }

    if (!EQUATION_FORM_CLASSES.includes(descriptor.EQUATION_FORM_CLASS)) {
      issues.push(issue("FORM_CLASS_INVALID", model.id, "EQUATION_FORM_CLASS", descriptor.EQUATION_FORM_CLASS));
    }
    if (descriptor.EQUATION_FORM_CLASS !== EQUATION_FORM_MAPPING[model.id]) {
      issues.push(issue("FORM_MAPPING_CHANGED", model.id, "EQUATION_FORM_CLASS", descriptor.EQUATION_FORM_CLASS));
    }

    const reference = descriptor.CANONICAL_SOURCE_REFERENCE;
    if (
      reference?.path !== CANONICAL_SOURCE_PATH ||
      reference?.familyIndex !== familyIndex ||
      reference?.modelIndex !== modelIndex ||
      reference?.familyId !== family.id ||
      reference?.modelId !== model.id
    ) {
      issues.push(issue("CANONICAL_REFERENCE_INVALID", model.id, "CANONICAL_SOURCE_REFERENCE", reference));
    }

    SEMANTIC_FIELDS.forEach(field => {
      if (!(field in descriptor)) issues.push(issue("SEMANTIC_FIELD_MISSING", model.id, field));
    });
  });

  const canonicalIds = new Set(canonicalModels.map(entry => entry.model.id));
  Object.keys(EQUATION_FORM_MAPPING).forEach(modelId => {
    if (!canonicalIds.has(modelId)) issues.push(issue("PARALLEL_OR_UNKNOWN_MAPPING", modelId));
  });

  return deepFreeze({
    valid: issues.length === 0,
    issues,
    counts: {
      families: catalog.length,
      models: canonicalModels.length,
      descriptors: registry.descriptors.length,
      formMappings: Object.keys(EQUATION_FORM_MAPPING).length,
      semanticFieldsPerDescriptor: SEMANTIC_FIELDS.length
    }
  });
}

export function assertSemanticRegistry(registry, catalog) {
  const result = validateSemanticRegistry(registry, catalog);
  if (!result.valid) {
    const error = new Error(`METHODS_SEMANTIC_REGISTRY_INVALID:${result.issues.map(entry => entry.code).join(",")}`);
    error.issues = result.issues;
    throw error;
  }
  return registry;
}

export function canonicalDescriptorCrosswalk(registry) {
  return registry.descriptors.map(descriptor => ({
    familyId: descriptor.FAMILY_ID,
    modelId: descriptor.MODEL_ID,
    title: descriptor.TITLE,
    equation: descriptor.EQUATION,
    equationLabel: descriptor.EQUATION_LABEL,
    sourceState: descriptor.SOURCE_STATE,
    formClass: descriptor.EQUATION_FORM_CLASS,
    canonicalSourceReference: descriptor.CANONICAL_SOURCE_REFERENCE
  }));
}
