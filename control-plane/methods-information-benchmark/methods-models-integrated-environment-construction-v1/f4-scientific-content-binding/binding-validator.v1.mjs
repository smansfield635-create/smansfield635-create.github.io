import fs from 'node:fs';
import {
  AXIS_ORDER,
  resolveState
} from '../f3-resolution-and-validity-engine/resolver.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F4 = `${ROOT}/f4-scientific-content-binding`;
const GATE0 = 'control-plane/methods-information-benchmark/imi-methods-models-universal-integration-v1';
const CP7 = 'control-plane/whole-estate/first-safe-vertical-case-selection-v1';
const F1 = `${ROOT}/f1-construction-baseline`;

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function validateCurrentF4Content() {
  const errors = [];
  const objects = readJson(`${F4}/scientific-object-registry.v1.json`);
  const methods = readJson(`${F4}/method-content-registry.v1.json`);
  const models = readJson(`${F4}/model-content-registry.v1.json`);
  const evidence = readJson(`${F4}/evidence-and-claim-registry.v1.json`);
  const empirical = readJson(`${F4}/empirical-instance-registry.v1.json`);
  const bindings = readJson(`${F4}/state-bindings.v1.json`);
  const contract = readJson(`${F4}/content-binding-contract.v1.json`);

  const sourceObject = readJson(`${GATE0}/universal-object-model.v1.json`);
  const sourceHierarchy = readJson(`${GATE0}/canonical-hierarchy.v1.json`);
  const sourceMethods = readJson(`${GATE0}/methods-sequence.v1.json`);
  const sourceModels = readJson(`${GATE0}/model-registry.v1.json`);
  const sourceEvidence = readJson(`${GATE0}/evidence-and-execution-state.v1.json`);
  const sourceF1 = readJson(`${F1}/scientific-source-and-claim-ledger.v1.json`);
  const sourceBio = readJson(`${CP7}/selected-vertical-case-contract.v1.json`);
  const sourceCp7Ledger = readJson(`${CP7}/source-ledger.v1.json`);

  if (contract.bindingDirection !== 'UPSTREAM_ARCHITECTURE_DEFINES_ADMISSIBLE_SHAPE_F4_CONTENT_POPULATES_THAT_SHAPE') {
    errors.push('BINDING_DIRECTION_DRIFT');
  }
  if (contract.publicMutationAuthorized !== false) errors.push('PUBLIC_MUTATION_AUTHORIZED');
  if (contract.scientificClaimUpgradeAuthorized !== false) errors.push('SCIENTIFIC_CLAIM_UPGRADE_AUTHORIZED');

  const sourceClassByCanonical = new Map(sourceObject.objectClasses.map(x => [x.canonicalInstance, x]));
  const sourceStatementById = sourceHierarchy.canonicalStatements;
  const requiredObjectIds = ['IMI','UCIC','METHODS','MODEL_REGISTRY','PROSPECTIVE_FINAL_REPORT_PORTFOLIO','HUMAN_AND_3D_CONSTRUCT'];
  const f4ObjectById = new Map(objects.objects.map(x => [x.contentId, x]));
  for (const id of requiredObjectIds) {
    const bound = f4ObjectById.get(id);
    if (!bound) { errors.push(`MISSING_OBJECT:${id}`); continue; }
    let source = sourceClassByCanonical.get(id);
    if (id === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO') source = sourceClassByCanonical.get('UCIC_PROSPECTIVE_FINAL_REPORT_TARGET_PORTFOLIO_v1');
    if (id === 'HUMAN_AND_3D_CONSTRUCT') source = sourceClassByCanonical.get('HUMAN_AND_3D_STATE');
    if (!source) { errors.push(`SOURCE_OBJECT_NOT_FOUND:${id}`); continue; }
    if (bound.objectClass !== source.id) errors.push(`OBJECT_CLASS_DRIFT:${id}`);
    if (bound.definition !== source.definition) errors.push(`OBJECT_DEFINITION_DRIFT:${id}`);
  }
  if (f4ObjectById.get('IMI')?.canonicalStatement !== sourceStatementById.IMI) errors.push('IMI_CANONICAL_STATEMENT_DRIFT');
  if (f4ObjectById.get('UCIC')?.canonicalStatement !== sourceStatementById.UCIC) errors.push('UCIC_CANONICAL_STATEMENT_DRIFT');
  if (f4ObjectById.get('METHODS')?.canonicalStatement !== sourceStatementById.METHODS) errors.push('METHODS_CANONICAL_STATEMENT_DRIFT');

  if (!same(methods.sequence, sourceMethods.sequence)) errors.push('METHOD_SEQUENCE_DRIFT');
  if (!same(methods.independentRoles, sourceMethods.independentRoles)) errors.push('METHOD_ROLES_DRIFT');
  if (!same(methods.submissionFields, sourceMethods.submissionFields)) errors.push('METHOD_SUBMISSION_FIELDS_DRIFT');
  if (!same(methods.noncompensatoryGates, sourceMethods.noncompensatoryGates)) errors.push('METHOD_NONCOMPENSATORY_GATES_DRIFT');

  const f4ModelById = new Map(models.models.map(x => [x.contentId, x]));
  for (const source of sourceModels.models) {
    const bound = f4ModelById.get(source.id);
    if (!bound) { errors.push(`MISSING_MODEL:${source.id}`); continue; }
    if (bound.role !== source.role) errors.push(`MODEL_ROLE_DRIFT:${source.id}`);
    if (bound.receivesSameAdmissibleEvidence !== source.receivesSameAdmissibleEvidence) errors.push(`MODEL_EVIDENCE_PARITY_DRIFT:${source.id}`);
    if (bound.globalProduct !== source.globalProduct) errors.push(`MODEL_GLOBAL_PRODUCT_DRIFT:${source.id}`);
    if (source.expressions && !same(bound.formalExpressions, source.expressions)) errors.push(`MODEL_EXPRESSIONS_DRIFT:${source.id}`);
    if (source.claimLimits && !same(bound.claimLimits, source.claimLimits)) errors.push(`MODEL_CLAIM_LIMITS_DRIFT:${source.id}`);
  }
  if (!same(models.rejectedModels.map(x => ({id:x.contentId,reason:x.reason})), sourceModels.rejectedModels)) errors.push('REJECTED_MODELS_DRIFT');
  if (models.comparatorParityRequired !== sourceModels.comparatorParityRequired) errors.push('COMPARATOR_PARITY_DRIFT');

  const sb = sourceEvidence.scientificBindings;
  const bp = evidence.claimPosture;
  if (bp.fixedInvariantRetained !== sb.fixedInvariantRetained) errors.push('FIXED_INVARIANT_POSTURE_DRIFT');
  if (bp.globalProductRejected !== sb.globalProductRejected) errors.push('GLOBAL_PRODUCT_POSTURE_DRIFT');
  if (bp.multiplicativeSpecificity !== sb.multiplicativeSpecificity) errors.push('MULTIPLICATIVE_SPECIFICITY_POSTURE_DRIFT');
  if (bp.generalObservationalSuperiority !== sb.generalObservationalSuperiority) errors.push('OBSERVATIONAL_SUPERIORITY_POSTURE_DRIFT');
  for (const [key, value] of Object.entries(sourceEvidence.retrospectiveEvidence)) {
    if (evidence.retrospectiveEvidence[key] !== value) errors.push(`RETROSPECTIVE_EVIDENCE_DRIFT:${key}`);
  }
  for (const [key, value] of Object.entries(sourceEvidence.prospectiveExecution)) {
    if (evidence.prospectiveExecution[key] !== value) errors.push(`PROSPECTIVE_EXECUTION_DRIFT:${key}`);
  }

  const empiricalById = new Map(empirical.instances.map(x => [x.contentId, x]));
  const bio = empiricalById.get('BIO_LAB');
  if (!bio) errors.push('BIO_LAB_MISSING');
  else {
    if (bio.title !== sourceBio.selectedCase.title) errors.push('BIO_LAB_TITLE_DRIFT');
    if (bio.sourceStudy !== sourceBio.selectedCase.sourceStudy) errors.push('BIO_LAB_SOURCE_STUDY_DRIFT');
    if (bio.sourceHead !== sourceBio.selectedCase.sourceHead) errors.push('BIO_LAB_SOURCE_HEAD_DRIFT');
    if (bio.scientificClassification !== sourceBio.sourceStanding.scientificClassification) errors.push('BIO_LAB_CLASSIFICATION_DRIFT');
    if (bio.terminalDisposition !== sourceBio.sourceStanding.terminalDisposition) errors.push('BIO_LAB_DISPOSITION_DRIFT');
    if (bio.claimCeilingRef !== sourceBio.sourceStanding.evidenceCeiling) errors.push('BIO_LAB_CEILING_DRIFT');
    if (bio.systemBoundary !== sourceBio.scientificObject.systemBoundary) errors.push('BIO_LAB_SYSTEM_BOUNDARY_DRIFT');
    if (bio.identityCriterion !== sourceBio.scientificObject.identityCriterion) errors.push('BIO_LAB_IDENTITY_CRITERION_DRIFT');
    if (!same(bio.registeredRelations, sourceBio.scientificObject.predictedFailedRelations)) errors.push('BIO_LAB_RELATION_MAP_DRIFT');
    if (!same(bio.caseScore, sourceBio.caseScore)) errors.push('BIO_LAB_SCORE_DRIFT');
  }

  const hurricane = empiricalById.get('HURRICANE_RAW_TC_RADAR_QC_CORRECTED');
  const f1H = sourceF1.hurricanePerspectiveResearch;
  const cp7H = sourceCp7Ledger.hurricaneDeltaSources;
  if (!hurricane) errors.push('HURRICANE_MISSING');
  else {
    if (hurricane.operation !== f1H.operation) errors.push('HURRICANE_OPERATION_DRIFT');
    if (hurricane.evidenceStanding !== f1H.currentFrozenTest) errors.push('HURRICANE_STANDING_DRIFT');
    if (hurricane.claimCeilingRef !== f1H.mayBeUsedAtF4) errors.push('HURRICANE_USAGE_CEILING_DRIFT');
    if (hurricane.qcCorrection !== f1H.qcCorrection) errors.push('HURRICANE_QC_DRIFT');
    if (hurricane.primaryIncrementalAuc !== f1H.primaryIncrementalAuc) errors.push('HURRICANE_PRIMARY_AUC_DRIFT');
    if (!same(hurricane.primaryBootstrap95, f1H.primaryBootstrap95)) errors.push('HURRICANE_PRIMARY_CI_DRIFT');
    if (hurricane.additiveAuc !== f1H.additiveAuc) errors.push('HURRICANE_ADDITIVE_AUC_DRIFT');
    if (!same(hurricane.additiveDifferenceBootstrap95, f1H.additiveDifferenceBootstrap95)) errors.push('HURRICANE_ADDITIVE_CI_DRIFT');
    if (hurricane.artifactZipSha256 !== cp7H.artifactZipSha256) errors.push('HURRICANE_ARTIFACT_DIGEST_DRIFT');
    if (hurricane.priorSupersededExecution.currentAdmission !== cp7H.priorMetadataExecution.currentAdmission) errors.push('HURRICANE_SUPERSEDED_EXECUTION_DRIFT');
    if (hurricane.adverseEvidence !== true) errors.push('HURRICANE_ADVERSE_FLAG_MISSING');
  }

  const allowedObjectClasses = new Set(sourceObject.objectClasses.map(x => x.id));
  const allowedModelIds = new Set(sourceModels.models.map(x => x.id));
  for (const binding of bindings.bindings) {
    const state = binding.state;
    const axisNames = Object.keys(state.axes);
    if (!same(axisNames, AXIS_ORDER)) errors.push(`STATE_AXIS_ORDER_DRIFT:${binding.bindingId}`);
    const resolved = resolveState(state);
    if (resolved.resolutionClass !== binding.expectedResolutionClass) errors.push(`STATE_RESOLUTION_DRIFT:${binding.bindingId}:${resolved.resolutionClass}`);
    if (state.axes.SCIENTIFIC_OBJECT.status === 'DECLARED' && !allowedObjectClasses.has(state.axes.SCIENTIFIC_OBJECT.value.objectClass)) {
      errors.push(`UNAUTHORIZED_OBJECT_CLASS:${binding.bindingId}`);
    }
    if (state.axes.MODEL.status === 'DECLARED' && !allowedModelIds.has(state.axes.MODEL.value.modelId)) {
      errors.push(`UNAUTHORIZED_MODEL_ID:${binding.bindingId}`);
    }
  }

  const bioBinding = bindings.bindings.find(x => x.contentId === 'BIO_LAB');
  if (bioBinding?.state.axes.CLAIM_CEILING.value.ceilingId !== sourceBio.sourceStanding.evidenceCeiling) errors.push('BIO_LAB_STATE_CEILING_DRIFT');
  const hurricaneBinding = bindings.bindings.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED');
  if (hurricaneBinding?.state.axes.EVIDENCE.value.evidenceStatus !== f1H.currentFrozenTest) errors.push('HURRICANE_STATE_STANDING_DRIFT');
  if (hurricaneBinding?.state.axes.SYSTEM.status !== 'UNSET') errors.push('HURRICANE_SYSTEM_MUST_REMAIN_UNSET');
  if (hurricaneBinding?.state.axes.MODEL.status !== 'UNSET') errors.push('HURRICANE_MODEL_MUST_REMAIN_UNSET');

  return {
    valid: errors.length === 0,
    errors,
    summary: {
      universalObjects: objects.objects.length,
      methodStages: methods.sequence.length,
      models: models.models.length,
      empiricalInstances: empirical.instances.length,
      stateBindings: bindings.bindings.length
    }
  };
}
