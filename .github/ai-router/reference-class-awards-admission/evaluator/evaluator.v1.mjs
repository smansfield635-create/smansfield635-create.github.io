#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../../..');
const FOUNDATION = path.join(ROOT, '.github/ai-router/reference-class-awards-admission');
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const STATES = ['INITIAL_RENDERED_STATE','MEANINGFUL_INTERACTION_STATE','RESULT_OR_NAVIGATION_STATE'];
const DEVICES = ['PHONE','TABLET','DESKTOP'];
const CONTEXTUAL_CLASS = 'THREE_DIMENSIONAL_CONTEXTUAL_INFORMATION_SPACE';
const CONTEXTUAL_REFERENCE_SENTINEL = 'NO_POSITIVE_CONTEXTUAL_REFERENCE_ADMITTED';
const DIMENSIONS = [
  'RESOLVED_AUTHORSHIP',
  'VISUAL_SPATIAL_COHERENCE',
  'COMPOSITIONAL_INTEGRITY',
  'INTENTIONAL_HIERARCHY',
  'INTERACTION_INTEGRATION',
  'FINISH_AND_REFINEMENT',
  'PURPOSE_FORM_FIT',
  'RESPONSIVE_INTEGRITY',
  'CLASS_SPECIFIC_SOPHISTICATION',
  'ABSENCE_OF_PROTOTYPE_OR_DEBUG_RESIDUE'
];
const DIMENSION_RESULTS = ['PARITY_OR_ABOVE','BELOW_PARITY','UNEVALUABLE'];
const CONTEXTUAL_CATASTROPHIC = new Set([
  'PRIMARY_INFORMATION_REMAINS_CARD_PANEL_OR_FLAT_PLANE_COMPOSITION',
  'SPATIAL_DIMENSIONS_HAVE_NO_INFORMATIONAL_CONSEQUENCE',
  'CAMERA_PARALLAX_WITHOUT_INFORMATION_STRUCTURE',
  'HIERARCHY_REMAINS_FLAT_UI_HIERARCHY',
  'RELATIONSHIPS_REMAIN_DIAGRAMMATIC_NOT_TRAVERSABLE',
  'DIRECT_MANIPULATION_DOES_NOT_REVEAL_TRAVERSE_OR_INSPECT_INFORMATION',
  'SPATIAL_COHERENCE_REQUIRES_EXPLANATORY_TEXT_TO_BE_PERCEIVED',
  'CONTEXT_COLLAPSES_TO_CAROUSEL_DASHBOARD_FLOWCHART_OR_PROTOTYPE'
]);
const CATASTROPHIC = new Set([
  'NOT_COMPOSED_AS_A_WHOLE',
  'PRIMARY_EXPERIENCE_IS_PROTOTYPE_OR_DEBUG_SURFACE',
  'MEANINGFUL_PRIMARY_INTERACTION_ABSENT_OR_TRIVIAL_WHEN_REQUIRED',
  'PRIMARY_RESPONSIVE_INTEGRITY_COLLAPSE',
  'REFERENCE_CLASS_MATURITY_COLLAPSE',
  'VISUAL_HIERARCHY_OR_LEGIBILITY_COLLAPSE',
  'PURPOSE_FORM_DISINTEGRATION',
  'PRIMARY_FUNCTIONAL_PATH_NONFUNCTIONAL',
  'RENDERED_EVIDENCE_INSUFFICIENT',
  'REFERENCE_IDENTITY_UNBOUND',
  ...CONTEXTUAL_CATASTROPHIC
]);

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
export const canonical = value => JSON.stringify(stable(value));
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const hashObject = value => sha256(Buffer.from(canonical(value), 'utf8'));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function evidencePayload(bundle) {
  const copy = structuredClone(bundle);
  delete copy.evidenceDigest;
  return copy;
}
export function withEvidenceDigest(bundle) {
  const copy = structuredClone(bundle);
  copy.evidenceDigest = hashObject(evidencePayload(copy));
  return stable(copy);
}
function disposition(result, reasonCode, detail = {}, extra = {}) {
  return stable({
    schema: 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATION_RECEIPT_v1',
    result,
    reasonCode,
    decisionBasis: 'HOLISTIC_PERCEPTUAL_REFERENCE_CLASS_ADJUDICATION',
    technicalContextUsedAsPassBasis: false,
    styleSimilarityUsedAsRequirement: false,
    featureInventoryUsedAsPassBasis: false,
    awardWinnerAuthorityCreated: false,
    namedAwardReadinessAuthorityCreated: false,
    candidateMutationPerformed: false,
    evaluatorActiveAuthorityAssumed: false,
    detail,
    ...extra
  });
}
function unevaluable(code, detail = {}, extra = {}) {
  return disposition('UNEVALUABLE', code, detail, extra);
}
function below(code, detail = {}, extra = {}) {
  return disposition('BELOW_AWARDS_CONVERSATION', code, detail, extra);
}
function admissible(detail = {}, extra = {}) {
  return disposition('AWARDS_CONVERSATION_ADMISSIBLE', 'REFERENCE_CLASS_MATURITY_REACHED', detail, extra);
}
function isObject(v) { return Boolean(v) && typeof v === 'object' && !Array.isArray(v); }

function loadFoundation() {
  return {
    contract: readJson(path.join(FOUNDATION, 'substantive-contract.v1.json')),
    boundary: readJson(path.join(FOUNDATION, 'decision-boundary.v1.json')),
    corpus: readJson(path.join(FOUNDATION, 'reference-corpus.v1.json')),
    classRequirements: readJson(path.join(DIR, 'class-requirements.v1.json')),
    protocol: readJson(path.join(DIR, 'protocol.v1.json'))
  };
}
function verifyFoundation(f) {
  return f.contract?.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_SUBSTANTIVE_CONTRACT_v1'
    && f.boundary?.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_DECISION_BOUNDARY_v1'
    && f.corpus?.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_REFERENCE_CORPUS_v1'
    && f.classRequirements?.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_CLASS_REQUIREMENTS_v1'
    && f.protocol?.schema === 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_PROTOCOL_v1'
    && f.contract?.decisionLaws?.featureInventoryMayCreatePass === false
    && f.contract?.decisionLaws?.catastrophicFailuresAreNoncompensatory === true
    && f.contract?.decisionLaws?.styleSimilarityRequired === false
    && f.boundary?.noncompensation?.enabled === true
    && f.protocol?.authorityBoundary?.active === false;
}
function positiveReference(foundation, id) {
  return foundation.corpus.positiveReferences?.find(r => r.referenceId === id) ?? null;
}
function validateRenderedEvidence(bundle, classRule) {
  if (!Array.isArray(bundle.applicableDevices) || bundle.applicableDevices.length === 0) return ['APPLICABLE_DEVICE_SET_MISSING'];
  if (new Set(bundle.applicableDevices).size !== bundle.applicableDevices.length || bundle.applicableDevices.some(d => !DEVICES.includes(d))) return ['APPLICABLE_DEVICE_SET_INVALID'];
  if (!Array.isArray(bundle.renderedEvidence) || bundle.renderedEvidence.length === 0) return ['RENDERED_EVIDENCE_MISSING'];
  const invalidArtifact = bundle.renderedEvidence.find(a => !isObject(a) || typeof a.artifactId !== 'string' || !['SCREENSHOT','VIDEO'].includes(a.kind) || !STATES.includes(a.stateClass) || !bundle.applicableDevices.includes(a.deviceClass) || !HEX64.test(a.sha256 ?? ''));
  if (invalidArtifact) return ['RENDERED_EVIDENCE_ARTIFACT_INVALID'];
  for (const state of classRule.requiredStateClasses ?? STATES) {
    if (!bundle.renderedEvidence.some(a => a.stateClass === state)) return [`REQUIRED_RENDER_STATE_MISSING:${state}`];
  }
  for (const device of bundle.applicableDevices) {
    for (const state of classRule.requiredStateClasses ?? STATES) {
      if (!bundle.renderedEvidence.some(a => a.deviceClass === device && a.stateClass === state)) return [`DEVICE_RENDER_STATE_MISSING:${device}:${state}`];
    }
  }
  return [];
}
function validateAdjudicatorCore(adjudication, bundle) {
  if (!isObject(adjudication) || adjudication.schema !== 'REFERENCE_CLASS_AWARDS_ADMISSION_PERCEPTUAL_ADJUDICATION_v1') return ['PERCEPTUAL_ADJUDICATION_SCHEMA_INVALID'];
  if (adjudication.candidateCommitSha !== bundle.candidate.commitSha) return ['ADJUDICATION_CANDIDATE_BINDING_MISMATCH'];
  if (adjudication.evidenceBundleDigest !== bundle.evidenceDigest) return ['ADJUDICATION_EVIDENCE_BINDING_MISMATCH'];
  if (!isObject(adjudication.adjudicator) || !['HUMAN_REVIEWER','INDEPENDENT_MULTIMODAL_EVALUATOR'].includes(adjudication.adjudicator.kind) || adjudication.adjudicator.independentOfCandidateConstruction !== true || typeof adjudication.adjudicator.id !== 'string' || adjudication.adjudicator.id.length === 0) return ['ADJUDICATOR_INDEPENDENCE_FAILURE'];
  if (adjudication.styleSimilarityUsedAsRequirement !== false) return ['STYLE_IMITATION_REQUIREMENT_DETECTED'];
  if (adjudication.featureInventoryUsedAsPassBasis !== false) return ['FEATURE_INVENTORY_PASS_BASIS_DETECTED'];
  if (!isObject(adjudication.dimensionVerdicts)) return ['DIMENSION_VERDICTS_MISSING'];
  for (const dimension of DIMENSIONS) {
    if (!DIMENSION_RESULTS.includes(adjudication.dimensionVerdicts[dimension])) return [`DIMENSION_VERDICT_INVALID:${dimension}`];
  }
  if (!isObject(adjudication.wholeArtifactDisposition) || ![true,false,null].includes(adjudication.wholeArtifactDisposition.sameProfessionalConversation)) return ['WHOLE_ARTIFACT_DISPOSITION_INVALID'];
  if (!Array.isArray(adjudication.catastrophicFailures) || adjudication.catastrophicFailures.some(x => !CATASTROPHIC.has(x))) return ['CATASTROPHIC_FAILURE_SET_INVALID'];
  return [];
}
function validateAdjudication(adjudication, bundle, reference) {
  const core = validateAdjudicatorCore(adjudication, bundle);
  if (core.length) return core;
  if (adjudication.referenceId !== reference.referenceId || adjudication.referenceCommitSha !== reference.exactCommitSha) return ['ADJUDICATION_REFERENCE_BINDING_MISMATCH'];
  return [];
}
function validateContextualNegativeGuardAdjudication(adjudication, bundle, classRule) {
  const core = validateAdjudicatorCore(adjudication, bundle);
  if (core.length) return core;
  if (adjudication.referenceId !== CONTEXTUAL_REFERENCE_SENTINEL || adjudication.referenceCommitSha !== null) return ['CONTEXTUAL_NEGATIVE_GUARD_REFERENCE_SENTINEL_INVALID'];
  const declared = new Set(classRule.negativeGuardFailureCodes ?? []);
  if (declared.size !== CONTEXTUAL_CATASTROPHIC.size || [...CONTEXTUAL_CATASTROPHIC].some(x => !declared.has(x))) return ['CONTEXTUAL_NEGATIVE_GUARD_CLASS_CONTRACT_MISMATCH'];
  return [];
}
function contextualNegativeGuard(bundle, adjudication, classRule) {
  if (!isObject(bundle.reference) || bundle.reference.referenceId !== CONTEXTUAL_REFERENCE_SENTINEL || bundle.reference.commitSha !== null) {
    return unevaluable('CONTEXTUAL_NEGATIVE_GUARD_REFERENCE_SENTINEL_REQUIRED');
  }
  const errors = validateContextualNegativeGuardAdjudication(adjudication, bundle, classRule);
  if (errors.length) return unevaluable('PERCEPTUAL_ADJUDICATION_INVALID', { errors });
  const common = {
    candidateId: bundle.candidate.candidateId,
    candidateCommitSha: bundle.candidate.commitSha,
    manifestationClass: bundle.candidate.manifestationClass,
    referenceId: CONTEXTUAL_REFERENCE_SENTINEL,
    referenceCommitSha: null,
    evidenceBundleDigest: bundle.evidenceDigest,
    adjudicatorId: adjudication.adjudicator.id,
    adjudicatorKind: adjudication.adjudicator.kind,
    positiveContextualReferenceAdmitted: false
  };
  if (bundle.interactionTrace.meaningfulConsequenceObserved !== true) {
    return below('CATASTROPHIC_FAILURE_PRESENT', { catastrophicFailures: ['MEANINGFUL_PRIMARY_INTERACTION_ABSENT_OR_TRIVIAL_WHEN_REQUIRED'] }, common);
  }
  if (adjudication.catastrophicFailures.length > 0) {
    return below('CATASTROPHIC_FAILURE_PRESENT', { catastrophicFailures: adjudication.catastrophicFailures }, common);
  }
  return unevaluable('POSITIVE_CONTEXTUAL_REFERENCE_NOT_ADMITTED', {
    requiredAction: 'SEPARATE_REFERENCE_CORPUS_REVISION_AND_REAL_RENDERED_CALIBRATION',
    admissibleResultBlocked: true
  }, common);
}

export function evaluate(evidenceBundle, perceptualAdjudication, foundationOverride = null) {
  const foundation = foundationOverride ?? loadFoundation();
  if (!verifyFoundation(foundation)) return unevaluable('FOUNDATION_IDENTITY_MISMATCH');
  const bundle = evidenceBundle;
  if (!isObject(bundle) || bundle.schema !== 'REFERENCE_CLASS_AWARDS_ADMISSION_EVIDENCE_BUNDLE_v1') return unevaluable('EVIDENCE_SCHEMA_INVALID');
  if (!isObject(bundle.candidate) || typeof bundle.candidate.candidateId !== 'string' || !HEX40.test(bundle.candidate.commitSha ?? '') || typeof bundle.candidate.manifestationClass !== 'string') return unevaluable('EVIDENCE_IDENTITY_UNBOUND', { target: 'candidate' });
  const classRule = foundation.classRequirements.classes?.[bundle.candidate.manifestationClass];
  if (!classRule) return unevaluable('MANIFESTATION_CLASS_UNSUPPORTED', { manifestationClass: bundle.candidate.manifestationClass });
  if (!isObject(bundle.pageExcellence) || bundle.pageExcellence.result !== 'PASS' || !HEX64.test(bundle.pageExcellence.receiptDigest ?? '')) return unevaluable('PAGE_EXCELLENCE_PREREQUISITE_NOT_SATISFIED');
  if (!HEX64.test(bundle.evidenceDigest ?? '')) return unevaluable('EVIDENCE_DIGEST_MISSING');
  const observedDigest = hashObject(evidencePayload(bundle));
  if (observedDigest !== bundle.evidenceDigest) return unevaluable('EVIDENCE_DIGEST_MISMATCH', { expected: observedDigest, observed: bundle.evidenceDigest });
  const renderedErrors = validateRenderedEvidence(bundle, classRule);
  if (renderedErrors.length) return unevaluable('REQUIRED_RENDERED_EVIDENCE_INCOMPLETE', { errors: renderedErrors });
  if (!isObject(bundle.interactionTrace) || typeof bundle.interactionTrace.required !== 'boolean' || typeof bundle.interactionTrace.meaningfulConsequenceObserved !== 'boolean' || !HEX64.test(bundle.interactionTrace.traceDigest ?? '')) return unevaluable('INTERACTION_TRACE_INVALID');
  if (classRule.interactive === true && bundle.interactionTrace.required !== true) return unevaluable('INTERACTION_TRACE_REQUIRED');

  const contextualSentinelMode = bundle.candidate.manifestationClass === CONTEXTUAL_CLASS
    && bundle.reference?.referenceId === CONTEXTUAL_REFERENCE_SENTINEL;
  if (contextualSentinelMode) return contextualNegativeGuard(bundle, perceptualAdjudication, classRule);

  if (!isObject(bundle.reference) || typeof bundle.reference.referenceId !== 'string' || !HEX40.test(bundle.reference.commitSha ?? '')) return unevaluable('EVIDENCE_IDENTITY_UNBOUND', { target: 'reference' });
  const reference = positiveReference(foundation, bundle.reference.referenceId);
  if (!reference) return unevaluable('REFERENCE_IDENTITY_UNBOUND', { referenceId: bundle.reference.referenceId });
  if (reference.exactCommitSha !== bundle.reference.commitSha) return unevaluable('REFERENCE_IDENTITY_MISMATCH', { expected: reference.exactCommitSha, observed: bundle.reference.commitSha });
  if (reference.manifestationClass !== bundle.candidate.manifestationClass) return unevaluable('REFERENCE_CLASS_MISMATCH', { candidateClass: bundle.candidate.manifestationClass, referenceClass: reference.manifestationClass });
  const adjudicationErrors = validateAdjudication(perceptualAdjudication, bundle, reference);
  if (adjudicationErrors.length) return unevaluable('PERCEPTUAL_ADJUDICATION_INVALID', { errors: adjudicationErrors });
  const common = {
    candidateId: bundle.candidate.candidateId,
    candidateCommitSha: bundle.candidate.commitSha,
    manifestationClass: bundle.candidate.manifestationClass,
    referenceId: reference.referenceId,
    referenceCommitSha: reference.exactCommitSha,
    evidenceBundleDigest: bundle.evidenceDigest,
    adjudicatorId: perceptualAdjudication.adjudicator.id,
    adjudicatorKind: perceptualAdjudication.adjudicator.kind
  };
  if (classRule.interactive === true && bundle.interactionTrace.meaningfulConsequenceObserved !== true) {
    return below('CATASTROPHIC_FAILURE_PRESENT', { catastrophicFailures: ['MEANINGFUL_PRIMARY_INTERACTION_ABSENT_OR_TRIVIAL_WHEN_REQUIRED'] }, common);
  }
  if (perceptualAdjudication.catastrophicFailures.length > 0) return below('CATASTROPHIC_FAILURE_PRESENT', { catastrophicFailures: perceptualAdjudication.catastrophicFailures }, common);
  const unresolved = DIMENSIONS.filter(d => perceptualAdjudication.dimensionVerdicts[d] === 'UNEVALUABLE');
  if (unresolved.length) return unevaluable('PERCEPTUAL_ADJUDICATION_INCOMPLETE', { unresolvedDimensions: unresolved }, common);
  const belowDimensions = DIMENSIONS.filter(d => perceptualAdjudication.dimensionVerdicts[d] === 'BELOW_PARITY');
  if (belowDimensions.length) return below('BELOW_REFERENCE_PARITY', { belowDimensions }, common);
  const whole = perceptualAdjudication.wholeArtifactDisposition.sameProfessionalConversation;
  if (whole === null) return unevaluable('WHOLE_ARTIFACT_DISPOSITION_UNRESOLVED', {}, common);
  if (whole === false) return below('REFERENCE_CLASS_MATURITY_NOT_REACHED', {}, common);
  return admissible({ allRequiredDimensions: 'PARITY_OR_ABOVE', sameProfessionalConversation: true }, common);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!['--evidence','--adjudication','--output'].includes(key) || !value) throw new Error('Usage: node evaluator.v1.mjs --evidence evidence.json --adjudication adjudication.json [--output receipt.json]');
    out[key.slice(2)] = value;
  }
  if (!out.evidence || !out.adjudication) throw new Error('Evidence and adjudication files are required');
  return out;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const receipt = evaluate(readJson(args.evidence), readJson(args.adjudication));
    const text = `${JSON.stringify(receipt, null, 2)}\n`;
    if (args.output) fs.writeFileSync(path.resolve(args.output), text); else process.stdout.write(text);
  } catch (error) {
    const receipt = unevaluable('EVALUATOR_INVOCATION_ERROR', { message: error.message });
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
    process.exitCode = 2;
  }
}
