import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { extractCatalogFromSourceText } from "../methods-models-categorical-spatial-template-v1/catalog-source.mjs";
import { assertSpatialRegistry } from "../methods-models-categorical-spatial-template-v1/descriptor-schema.mjs";
import {
  buildSemanticSpatialRegistry,
  assertSemanticRegistry,
  canonicalDescriptorCrosswalk,
  EQUATION_FORM_MAPPING,
  EQUATION_FORM_CLASSES,
  SEMANTIC_FIELDS,
  CANONICAL_SOURCE_PATH
} from "./semantic-descriptor.mjs";

const outDir = path.resolve(process.env.OUT_DIR || "methods-categorical-spatial-context-equation-embodiment-v1-evidence");
await fs.mkdir(outDir, { recursive: true });

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}

function stableJson(value) {
  return `${JSON.stringify(stable(value), null, 2)}\n`;
}

async function writeJson(name, value) {
  await fs.writeFile(path.join(outDir, name), stableJson(value));
}

function canonicalModels(catalog) {
  return catalog.flatMap((family, familyIndex) => family.models.map((model, modelIndex) => ({ family, familyIndex, model, modelIndex })));
}

function countField(registry, field) {
  return registry.descriptors.filter(descriptor => {
    const value = descriptor[field];
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }).length;
}

const sourcePath = path.resolve(CANONICAL_SOURCE_PATH);
const sourceText = await fs.readFile(sourcePath, "utf8");
const catalog = extractCatalogFromSourceText(sourceText);
const registry = assertSemanticRegistry(assertSpatialRegistry(buildSemanticSpatialRegistry(catalog)), catalog);
const models = canonicalModels(catalog);
const sourceDigest = sha256(sourceText);
const catalogText = stableJson(catalog);
const catalogDigest = sha256(catalogText);
const crosswalk = canonicalDescriptorCrosswalk(registry);

const fieldCounts = Object.fromEntries(SEMANTIC_FIELDS.map(field => [field, countField(registry, field)]));
const requiredCounts = {
  CATALOG_MODELS: registry.modelCount,
  FAMILIES: registry.familyCount,
  EQUATIONS: fieldCounts.EQUATION,
  EQUATION_LABELS: fieldCounts.EQUATION_LABEL,
  QUESTIONS: fieldCounts.QUESTION,
  STATEMENTS: fieldCounts.STATEMENT,
  PRACTICAL_LENSES: fieldCounts.PRACTICAL,
  ENGINEERING_LENSES: fieldCounts.ENGINEERING,
  EVIDENCE_LENSES: fieldCounts.EVIDENCE,
  PURPOSE_FIELDS: fieldCounts.PURPOSE,
  SYMBOL_FIELDS: fieldCounts.SYMBOLS,
  ARCHITECTURE_FIELDS: fieldCounts.ARCHITECTURE,
  OPERATION_FIELDS: fieldCounts.OPERATION,
  FAILURE_FIELDS: fieldCounts.FAILURE,
  LIMIT_FIELDS: fieldCounts.LIMITS,
  SOURCE_STATES: fieldCounts.SOURCE_STATE
};

const sourceStateCrosswalk = models.map(({ family, model }) => {
  const descriptor = registry.descriptors.find(candidate => candidate.MODEL_ID === model.id);
  return {
    familyId: family.id,
    modelId: model.id,
    canonicalSourceState: model.sourceState,
    descriptorSourceState: descriptor.SOURCE_STATE,
    preserved: descriptor.SOURCE_STATE === model.sourceState,
    rendererExpression: model.sourceState === "hold" ? "PRESERVED_ARCHITECTURE_WITH_VISIBLE_RECOVERY_BOUNDARY" : "PRESERVED_CONFIRMED_ARCHITECTURE"
  };
});

const canonicalEquations = new Map(models.map(({ model }) => [model.id, model.equation]));
const equationPreservation = registry.descriptors.map(descriptor => ({
  modelId: descriptor.MODEL_ID,
  canonical: canonicalEquations.get(descriptor.MODEL_ID),
  descriptor: descriptor.EQUATION,
  exact: descriptor.EQUATION === canonicalEquations.get(descriptor.MODEL_ID)
}));

const forbiddenPlaceholderPattern = /\b(?:lorem|ipsum|placeholder|coming soon|sample content|generic equation|tbd|todo)\b/i;
const placeholderFindings = registry.descriptors.flatMap(descriptor => SEMANTIC_FIELDS.flatMap(field => {
  const value = descriptor[field];
  const serialized = Array.isArray(value) ? value.join(" ") : typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  return forbiddenPlaceholderPattern.test(serialized) ? [{ modelId: descriptor.MODEL_ID, field, value: serialized }] : [];
}));
const genericFallbacks = registry.descriptors.filter(descriptor => !descriptor.EQUATION || descriptor.EQUATION === descriptor.MODEL_ID || /equation unavailable/i.test(descriptor.EQUATION));
const canonicalIds = models.map(({ model }) => model.id);
const descriptorIds = registry.descriptors.map(descriptor => descriptor.MODEL_ID);
const parallelCanonicalRecords = descriptorIds.filter((id, index) => id !== canonicalIds[index] || !canonicalIds.includes(id));
const undeclaredMappings = canonicalIds.filter(id => !EQUATION_FORM_MAPPING[id]);
const inadmissibleMappings = Object.entries(EQUATION_FORM_MAPPING).filter(([, form]) => !EQUATION_FORM_CLASSES.includes(form));

const semanticCompleteness = {
  contract: "METHODS_SEMANTIC_COMPLETENESS_REPORT_v1",
  canonicalSource: CANONICAL_SOURCE_PATH,
  requiredCounts,
  semanticFields: fieldCounts,
  completeInspectionFields: SEMANTIC_FIELDS.every(field => fieldCounts[field] === 25),
  familiesComplete: registry.familyCount === 4,
  modelsComplete: registry.modelCount === 25,
  lensesComplete: registry.lensCount === 3,
  allRequiredCountsComplete: requiredCounts.FAMILIES === 4 && Object.entries(requiredCounts).filter(([key]) => key !== "FAMILIES").every(([, value]) => value === 25),
  sourceCompletenessClaimed: false,
  empiricalValidationClaimed: false,
  productAcceptanceGranted: false
};

const sourceStateReport = {
  contract: "METHODS_SOURCE_STATE_PRESERVATION_REPORT_v1",
  confirmed: sourceStateCrosswalk.filter(entry => entry.canonicalSourceState === "confirmed").length,
  held: sourceStateCrosswalk.filter(entry => entry.canonicalSourceState === "hold").length,
  preserved: sourceStateCrosswalk.filter(entry => entry.preserved).length,
  entries: sourceStateCrosswalk
};

const absenceReport = {
  contract: "METHODS_PLACEHOLDER_FALLBACK_ABSENCE_REPORT_v1",
  placeholders: placeholderFindings,
  genericEquationFallbacks: genericFallbacks.map(item => item.MODEL_ID),
  parallelCanonicalRecords,
  rewrittenCanonicalEquations: equationPreservation.filter(item => !item.exact),
  undeclaredFormMappings: undeclaredMappings,
  inadmissibleFormMappings: inadmissibleMappings,
  counts: {
    PLACEHOLDERS: placeholderFindings.length,
    GENERIC_EQUATION_FALLBACKS: genericFallbacks.length,
    PARALLEL_CANONICAL_RECORDS: parallelCanonicalRecords.length,
    REWRITTEN_CANONICAL_EQUATIONS: equationPreservation.filter(item => !item.exact).length,
    UNDECLARED_FORM_MAPPINGS: undeclaredMappings.length + inadmissibleMappings.length
  }
};

const formMappingReport = {
  contract: "METHODS_EQUATION_FORM_MAPPING_REPORT_v1",
  admissibleClasses: EQUATION_FORM_CLASSES,
  mappings: crosswalk.map(item => ({ familyId: item.familyId, modelId: item.modelId, equation: item.equation, equationLabel: item.equationLabel, formClass: item.formClass })),
  classDistribution: Object.fromEntries(EQUATION_FORM_CLASSES.map(form => [form, crosswalk.filter(item => item.formClass === form).length]))
};

const gateChecks = {
  CATALOG_MODELS_25_OF_25: registry.modelCount === 25,
  FAMILIES_4_OF_4: registry.familyCount === 4,
  EQUATIONS_25_OF_25: requiredCounts.EQUATIONS === 25,
  EQUATION_LABELS_25_OF_25: requiredCounts.EQUATION_LABELS === 25,
  QUESTIONS_25_OF_25: requiredCounts.QUESTIONS === 25,
  STATEMENTS_25_OF_25: requiredCounts.STATEMENTS === 25,
  PRACTICAL_LENSES_25_OF_25: requiredCounts.PRACTICAL_LENSES === 25,
  ENGINEERING_LENSES_25_OF_25: requiredCounts.ENGINEERING_LENSES === 25,
  EVIDENCE_LENSES_25_OF_25: requiredCounts.EVIDENCE_LENSES === 25,
  PURPOSE_FIELDS_25_OF_25: requiredCounts.PURPOSE_FIELDS === 25,
  SYMBOL_FIELDS_25_OF_25: requiredCounts.SYMBOL_FIELDS === 25,
  ARCHITECTURE_FIELDS_25_OF_25: requiredCounts.ARCHITECTURE_FIELDS === 25,
  OPERATION_FIELDS_25_OF_25: requiredCounts.OPERATION_FIELDS === 25,
  FAILURE_FIELDS_25_OF_25: requiredCounts.FAILURE_FIELDS === 25,
  LIMIT_FIELDS_25_OF_25: requiredCounts.LIMIT_FIELDS === 25,
  SOURCE_STATES_PRESERVED_25_OF_25: sourceStateReport.preserved === 25,
  INSPECTION_FIELDS_COMPLETE: semanticCompleteness.completeInspectionFields,
  SUMMARY_COUNTS_COMPLETE: semanticCompleteness.allRequiredCountsComplete,
  PLACEHOLDERS_0: absenceReport.counts.PLACEHOLDERS === 0,
  GENERIC_EQUATION_FALLBACKS_0: absenceReport.counts.GENERIC_EQUATION_FALLBACKS === 0,
  PARALLEL_CANONICAL_RECORDS_0: absenceReport.counts.PARALLEL_CANONICAL_RECORDS === 0,
  REWRITTEN_CANONICAL_EQUATIONS_0: absenceReport.counts.REWRITTEN_CANONICAL_EQUATIONS === 0,
  UNDECLARED_FORM_MAPPINGS_0: absenceReport.counts.UNDECLARED_FORM_MAPPINGS === 0
};

const summary = {
  contract: "METHODS_CATEGORICAL_SPATIAL_CONTEXT_AND_EQUATION_EMBODIMENT_VALIDATION_v1",
  canonicalSource: CANONICAL_SOURCE_PATH,
  canonicalSourceSha256: sourceDigest,
  extractedCatalogSha256: catalogDigest,
  checks: gateChecks,
  result: Object.values(gateChecks).every(Boolean) ? "PASS_SEMANTIC_STATIC_GATE" : "FAIL_SEMANTIC_STATIC_GATE",
  mergeAuthorized: false,
  publicMethodsMutationAuthorized: false,
  empiricalValidationClaimed: false,
  userReviewAuthorized: false
};

await writeJson("canonical-source-digest.json", { path: CANONICAL_SOURCE_PATH, bytes: Buffer.byteLength(sourceText), sha256: sourceDigest });
await writeJson("extracted-catalog-digest.json", { familyCount: catalog.length, modelCount: models.length, bytes: Buffer.byteLength(catalogText), sha256: catalogDigest });
await writeJson("canonical-to-descriptor-crosswalk.json", { contract: "METHODS_CANONICAL_TO_DESCRIPTOR_CROSSWALK_v1", entries: crosswalk });
await writeJson("equation-form-mapping.json", formMappingReport);
await writeJson("semantic-completeness-report.json", semanticCompleteness);
await writeJson("source-state-preservation-report.json", sourceStateReport);
await writeJson("placeholder-fallback-absence-report.json", absenceReport);
await writeJson("semantic-static-gate-result.json", summary);

console.log(JSON.stringify(summary, null, 2));
if (summary.result !== "PASS_SEMANTIC_STATIC_GATE") process.exitCode = 1;
