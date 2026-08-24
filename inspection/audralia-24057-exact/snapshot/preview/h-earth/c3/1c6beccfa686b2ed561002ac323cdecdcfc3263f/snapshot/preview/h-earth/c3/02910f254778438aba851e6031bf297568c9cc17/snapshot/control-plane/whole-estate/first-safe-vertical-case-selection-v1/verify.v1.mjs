#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const read = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));
const fail = (msg) => { throw new Error(`CP7_VERIFY_FAIL:${msg}`); };
const eq = (a,b,msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${msg}: expected=${JSON.stringify(b)} observed=${JSON.stringify(a)}`); };
const ok = (x,msg) => { if (!x) fail(msg); };
const near = (a,b,tol,msg) => { if (Math.abs(a-b) > tol) fail(`${msg}: expected=${b} observed=${a}`); };
const git = (...args) => execFileSync('git', args, { encoding:'utf8' }).trim();
const showJson = (ref,p) => JSON.parse(git('show', `${ref}:${p}`));
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const required = [
  'README.md',
  'checkpoint-7-operation-contract.v1.json',
  'hurricane-scientific-delta-adjudication.v1.json',
  'candidate-case-register.v1.json',
  'selected-vertical-case-contract.v1.json',
  'claim-and-frontier-ownership-contract.v1.json',
  'final-checkpoint-handoff-contract.v1.json',
  'source-ledger.v1.json',
  'verify.v1.mjs'
];
for (const f of required) ok(fs.existsSync(path.join(ROOT,f)), `missing_package_file:${f}`);
ok(!fs.existsSync(path.join(ROOT,'checkpoint-8-handoff-contract.v1.json')), 'retired_checkpoint8_handoff_file_must_be_absent');

const op = read('checkpoint-7-operation-contract.v1.json');
const hurricane = read('hurricane-scientific-delta-adjudication.v1.json');
const candidates = read('candidate-case-register.v1.json');
const selected = read('selected-vertical-case-contract.v1.json');
const ownership = read('claim-and-frontier-ownership-contract.v1.json');
const handoff = read('final-checkpoint-handoff-contract.v1.json');
const ledger = read('source-ledger.v1.json');

// Governing Checkpoint 7 registration and stop boundaries must remain exact.
eq(op.operation, 'FIRST_SAFE_VERTICAL_CASE_SELECTION_v1', 'operation');
eq(op.governingMain, 'aaa8d55f20198f1ef508c5eb64f76ddb8477db30', 'governing_main');
eq(op.governingTree, 'aff84c63fcd96d5c8d4b1d29f4b86a374394b8a8', 'governing_tree');
eq(op.checkpoint6.status, 'PASS_CLOSED', 'checkpoint6_status');
eq(op.checkpoint6.postMergeCertification, 'SUCCESS', 'checkpoint6_certification');
eq(op.preservedCapacities, ['NO_PROSPECTIVE_CONTAMINATION','CLAIM_CEILINGS','FRONTIER_STUDY_OWNERSHIP'], 'preserved_capacities');
eq(op.falsifiers, ['case requires hidden outcome access','case duplicates full Frontier study','case requires claim upgrade'], 'falsifiers');
ok(op.stopBoundary.publicPageMutation === false, 'public_mutation');
eq(op.stopBoundary.visualConstruction, 'NOT_STARTED', 'visual_construction');
eq(op.stopBoundary.spatialTopologyFreeze, 'BLOCKED', 'topology_freeze');
ok(op.stopBoundary.geometryAuthority === false, 'geometry_authority');
ok(op.stopBoundary.scientificClaimUpgrade === false, 'claim_upgrade');
ok(op.stopBoundary.pr541Mutation === false, 'pr541_mutation');
eq(op.successorProgram.program, 'METHODS_MODELS_INTEGRATED_ENVIRONMENT_CONSTRUCTION_v1', 'successor_program');
eq(op.successorProgram.preservedTarget, 'TEXT_FIRST_STATEFUL_METHODS_MODELS_ENVIRONMENT_v1', 'preserved_target');
eq(op.successorProgram.firstGate, 'F1_CONSTRUCTION_BASELINE', 'first_gate');
eq(op.successorProgram.formerCheckpoint8, 'RETIRED_AS_STANDALONE_ESTATE_CHECKPOINT', 'retired_checkpoint8');
eq(op.stopBoundary.finalProgramExecution, 'NOT_STARTED_PENDING_CP7_PASS_CLOSED', 'final_program_execution');
ok(op.stopBoundary.f2ConstructionAuthority === false, 'f2_authority_must_be_false');

const prospectivePath = 'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/prospective-change-register.v1.json';
const prospective = JSON.parse(fs.readFileSync(prospectivePath,'utf8'));
const cp7 = prospective.entries.find(x => x.checkpoint === 7);
ok(cp7, 'missing_cp7_registration');
eq(cp7.id, op.operation, 'registered_operation');
eq(cp7.preservedCapacities, op.preservedCapacities, 'registered_preserved_capacities');
eq(cp7.falsifiers, op.falsifiers, 'registered_falsifiers');
ok(cp7.publicMutationAuthorized === false, 'registered_public_mutation');

// Scientific-delta ingress law must remain intact.
const ingress = JSON.parse(fs.readFileSync('control-plane/whole-estate/invariant-contract-package-v1/scientific-delta-ingress-contract.v1.json','utf8'));
ok(ingress.deltaDispositionVocabulary.includes('FUTURE_EVIDENCE_DELTA'), 'missing_future_evidence_delta_vocab');
ok(ingress.laws.includes('EVIDENCE_DELTA_MAY_UPDATE_STANDING_ONLY_THROUGH_EXPLICIT_ADJUDICATION'), 'missing_adjudication_law');
ok(ingress.laws.includes('CONSTRUCTION_MAY_INGEST_STANDING_BUT_MAY_NOT_CREATE_STANDING'), 'missing_construction_standing_law');

// Corrected hurricane delta must replace the QC-compromised standing without a claim upgrade.
eq(hurricane.status, 'CHECKPOINT_7_REPAIR_CANDIDATE', 'hurricane_repair_status');
eq(hurricane.delta.DEVELOPMENT_CLASS, 'FUTURE_EVIDENCE_DELTA', 'hurricane_delta_class');
ok(hurricane.delta.CONSTITUTIONAL_IMPACT === false, 'hurricane_constitutional_impact');
ok(hurricane.delta.CP_REPAIR_REQUIRED === false, 'hurricane_cp_repair');
eq(hurricane.delta.DISPOSITION, 'ADMIT_QC_CORRECTED_ADVERSE_EMPIRICAL_RESULT_WITHOUT_CLAIM_UPGRADE', 'hurricane_delta_disposition');
eq(hurricane.qcCorrection, 'SST_SHIPS_ABS_GE_900_TREATED_AS_MISSING_NO_IMPUTATION', 'hurricane_qc_correction');
eq(hurricane.results.terminalDisposition, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'hurricane_terminal');
near(hurricane.results.BASE.rocAuc, 0.7691387559808613, 1e-12, 'hurricane_base_auc');
near(hurricane.results.COMBINED_NONCOMP.rocAuc, 0.7595693779904307, 1e-12, 'hurricane_noncomp_auc');
near(hurricane.results.primaryIncrementalAuc, -0.009569377990430672, 1e-12, 'hurricane_incremental_auc');
ok(hurricane.results.stormClusterBootstrap.COMBINED_NONCOMP_minus_BASE.ci95[0] < 0 && hurricane.results.stormClusterBootstrap.COMBINED_NONCOMP_minus_BASE.ci95[1] > 0, 'hurricane_noncomp_ci_must_cross_zero');
near(hurricane.results.COMBINED_ADDITIVE.rocAuc, 0.8133971291866029, 1e-12, 'hurricane_additive_auc');
ok(hurricane.results.stormClusterBootstrap.COMBINED_ADDITIVE_minus_BASE.ci95[0] < 0 && hurricane.results.stormClusterBootstrap.COMBINED_ADDITIVE_minus_BASE.ci95[1] > 0, 'hurricane_additive_ci_must_cross_zero');
eq(hurricane.adjudication.priorMetadataStanding, 'QUARANTINED_SUPERSEDED_BY_QC_CORRECTED_RAW_RESULT', 'prior_metadata_quarantine');
eq(hurricane.adjudication.rawRadarMechanisticStanding, 'NOT_SUPPORTED', 'raw_radar_standing');
ok(hurricane.adjudication.hurricaneEarlyWarningConfirmed === false, 'hurricane_confirmation');
ok(hurricane.adjudication.warningTimeTested === false, 'warning_time_not_tested');
ok(hurricane.adjudication.scientificClaimUpgradeAuthorized === false, 'hurricane_claim_upgrade');
ok(hurricane.checkpoint7Impact.selectedAsFirstVerticalCase === false, 'hurricane_not_first_vertical');
ok(hurricane.checkpoint7Impact.selectedCaseChangedByRepair === false, 'hurricane_repair_changed_selection');

// Candidate selection must remain non-performance-driven inside PR709.
eq(candidates.selectedCandidate, 'CSB_PR709_BIO_LAB', 'selected_candidate_id');
ok(candidates.selectionCreatesScientificCredit === false, 'selection_scientific_credit');
ok(candidates.selectionChangesSourceStanding === false, 'selection_source_standing');
ok(candidates.hurricaneRepairChangesSelectedCandidate === false, 'repair_changes_selection');
const bioCandidate = candidates.candidates.find(x => x.candidateId === 'CSB_PR709_BIO_LAB');
const hurricaneCandidate = candidates.candidates.find(x => x.candidateId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED');
ok(bioCandidate && hurricaneCandidate, 'candidate_set');
eq(bioCandidate.selectionDisposition, 'SELECTED', 'biolab_selection_disposition');
eq(bioCandidate.positionInFrozenSelectionOrder, 1, 'biolab_frozen_order');
ok(bioCandidate.falsifierAssessment.requiresHiddenOutcomeAccess === false, 'biolab_hidden_outcome');
ok(bioCandidate.falsifierAssessment.duplicatesFullFrontierStudy === false, 'biolab_frontier_duplication');
ok(bioCandidate.falsifierAssessment.requiresClaimUpgrade === false, 'biolab_claim_upgrade');
eq(hurricaneCandidate.selectionDisposition, 'ACTIVE_RESEARCH_NOT_SELECTED_FIRST', 'hurricane_candidate_disposition');
eq(hurricaneCandidate.terminalStanding, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'hurricane_candidate_terminal');
ok(hurricaneCandidate.currentFrozenTestAdverse === true, 'hurricane_candidate_adverse');
ok(hurricaneCandidate.scientificRejection === false, 'hurricane_line_not_globally_rejected');

// Selected case contract must expose limitations and preserve Frontier ownership.
eq(selected.selectedCase.caseId, 'BIO_LAB', 'selected_case');
eq(selected.selectedCase.selectionRule, 'FIRST_CASE_IN_EXISTING_FROZEN_PR709_SELECTION_ORDER', 'selection_rule');
ok(selected.selectedCase.selectionIsScientificSampling === false, 'presentation_selection_not_sampling');
eq(selected.sourceStanding.evidenceCeiling, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY', 'selected_ceiling');
eq(selected.sourceStanding.outcomeBlindness, 'NOT_ESTABLISHED', 'outcome_blindness');
eq(selected.sourceStanding.publicOutcomeContamination, 'PRESENT', 'outcome_contamination');
eq(selected.sourceStanding.prospectiveConfirmation, 'NOT_ESTABLISHED', 'prospective_confirmation');
eq(selected.sourceStanding.universalLaw, 'NOT_ESTABLISHED', 'universal_law');
eq(selected.sourceStanding.preservedCapacityStatus, 'UNEVALUABLE_FROM_SUMMARY_RECORD', 'preserved_capacity');
eq(selected.scientificObject.predictedFailedRelations.length, 4, 'predicted_relation_count');
eq(selected.decoyControls.length, 3, 'decoy_count');
near(selected.caseScore.routeHitRate, 1.0, 1e-12, 'route_hit_rate');
near(selected.caseScore.causalCoverage, 0.8, 1e-12, 'causal_coverage');
near(selected.caseScore.trueMinusDecoyAdvantage, 0.8166666666666667, 1e-12, 'true_minus_decoy');
ok(selected.methodsModelsDemonstrationBoundary.fullFiveCasePortfolioDuplication === false, 'full_portfolio_duplication');
eq(selected.methodsModelsDemonstrationBoundary.frontierStudyOwnership, 'PRESERVED', 'frontier_ownership');
ok(selected.methodsModelsDemonstrationBoundary.sourcePrMergeAuthorized === false, 'source_pr_merge_authority');

// Ownership and Final Checkpoint handoff remain bounded.
eq(ownership.sourceStudyOwner, 'FRONTIER', 'source_study_owner');
eq(ownership.sourceProvenanceOwner, 'RESEARCH_PROVENANCE', 'provenance_owner');
eq(ownership.methodsModelsRole, 'EVIDENCE_GATE_RELATION_MAP_DISCOVERY_BRIDGE', 'methods_models_role');
ok(ownership.demonstrationScope.oneCaseOnly === true, 'one_case_only');
ok(ownership.demonstrationScope.fullPortfolioReconstruction === false, 'no_full_portfolio');
eq(handoff.schema, 'WHOLE_ESTATE_FINAL_CHECKPOINT_HANDOFF_CONTRACT_v1', 'handoff_schema');
eq(handoff.successorProgram, 'METHODS_MODELS_INTEGRATED_ENVIRONMENT_CONSTRUCTION_v1', 'handoff_successor_program');
eq(handoff.preservedTarget, 'TEXT_FIRST_STATEFUL_METHODS_MODELS_ENVIRONMENT_v1', 'handoff_preserved_target');
eq(handoff.formerCheckpoint8, 'RETIRED_AS_STANDALONE_ESTATE_CHECKPOINT', 'handoff_retired_checkpoint8');
eq(handoff.firstAuthorizedGateAfterActivation, 'F1_CONSTRUCTION_BASELINE', 'handoff_first_gate');
eq(handoff.progressiveGateLaw, 'F_n_MUST_PASS_BEFORE_F_n_PLUS_1_MAY_TREAT_ITS_OUTPUTS_AS_AUTHORITY', 'progressive_gate_law');
ok(handoff.programLaws.includes('NO_DOWNSTREAM_BUILD_ON_UNVERIFIED_UPSTREAM'), 'missing_no_downstream_build_law');
ok(handoff.programLaws.includes('NO_SUB_CHECKPOINT_MAY_RAISE_THE_SCIENTIFIC_CLAIM_CEILING'), 'missing_claim_ceiling_law');
ok(handoff.programLaws.includes('VISUAL_STATE_MAY_REPRESENT_MEANING_BUT_MAY_NOT_CREATE_MEANING'), 'missing_visual_semantic_law');
ok(handoff.programLaws.includes('FINAL_PASS_REQUIRES_THE_INTEGRATED_OBJECT_NOT_THE_SUM_OF_COMPONENT_PASSES'), 'missing_integrated_object_law');
eq(handoff.hurricaneDeltaAvailability.standing, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'handoff_hurricane_standing');
ok(handoff.hurricaneDeltaAvailability.selectedFirstVertical === false, 'handoff_hurricane_not_selected');
ok(handoff.hurricaneDeltaAvailability.mayRemainDiscoverableAsPerspectiveResearchState === true, 'handoff_hurricane_perspective_research');
ok(handoff.hurricaneDeltaAvailability.mayNotReplaceSelectedVerticalWithoutNewExplicitAdjudication === true, 'handoff_hurricane_no_replacement');
ok(handoff.f1BaselineRequiredBeforeConstruction === true, 'f1_baseline_required');
ok(handoff.f2ConstructionAuthorized === false, 'f2_not_authorized');
eq(handoff.userVisualApprovalGate, 'F12_USER_VISUAL_AND_EXPERIENTIAL_REVIEW', 'f12_visual_gate');
ok(handoff.userVisualApprovalRequired === true, 'visual_approval_gate');
ok(handoff.publicMutationAuthorized === false, 'final_program_public_mutation');
ok(handoff.liveMergeAuthorized === false, 'final_program_live_merge');
eq(handoff.finalProgramExecution, 'NOT_STARTED_PENDING_CP7_PASS_CLOSED', 'final_program_not_started');

// Exact PR709 source lineage must match immutable source blobs.
const s = ledger.selectedStudySources;
eq(s.exactHead, '54e0f3cf59cffab6a195c9c2ffe4f104185b5e81', 'pr709_head');
for (const f of s.files) {
  eq(git('rev-parse', `${s.exactHead}:${f.path}`), f.blob, `source_blob:${f.path}`);
}
const pr709Selection = showJson(s.exactHead, 'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/selection-and-scoring.v1.json');
eq(pr709Selection.cases[0].id, 'BIO_LAB', 'pr709_first_frozen_case');
eq(pr709Selection.selection_rule, 'five most recent CSB completed investigations by final-report release date at cutoff; no favorable-case replacement', 'pr709_selection_rule');
const pr709Result = showJson(s.exactHead, 'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/RESULT.v1.json');
eq(pr709Result.terminal_disposition, 'UCIC_ROUTE_SPECIFICITY_SUPPORTED_EXTERNAL_CSB', 'pr709_terminal');
eq(pr709Result.evidence_ceiling, selected.sourceStanding.evidenceCeiling, 'pr709_ceiling');
near(pr709Result.case_scores.BIO_LAB.true_minus_decoy_advantage, selected.caseScore.trueMinusDecoyAdvantage, 1e-12, 'pr709_biolab_score');
ok(pr709Result.case_scores.PEMEX.true_minus_decoy_advantage > pr709Result.case_scores.BIO_LAB.true_minus_decoy_advantage, 'biolab_must_not_be_selected_as_highest_score');

// Corrected hurricane artifact must be bound to the actual Actions ZIP and its internal contents.
const h = ledger.hurricaneDeltaSources;
eq(h.workflowHead, '2fe335c165a0de004980e429b60830d76e4ce6bc', 'hurricane_workflow_head');
eq(h.workflowRun, 31195025635, 'hurricane_workflow_run');
eq(h.artifactId, 9001275013, 'hurricane_artifact_id');
eq(h.terminalDisposition, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'ledger_hurricane_terminal');
eq(h.priorMetadataExecution.currentAdmission, 'QUARANTINED_SUPERSEDED_BY_QC_CORRECTED_RAW_RESULT', 'ledger_prior_metadata_quarantine');
const artifactZip = process.env.CP7_HURRICANE_ARTIFACT_ZIP;
ok(artifactZip && fs.existsSync(artifactZip), 'missing_hurricane_artifact_zip');
eq(sha256(fs.readFileSync(artifactZip)), h.artifactZipSha256, 'hurricane_artifact_zip_sha256');
const unzip = (p) => execFileSync('unzip', ['-p', artifactZip, p]);
for (const [name, spec] of Object.entries(h.artifactFiles)) {
  const bytes = unzip(spec.path);
  eq(sha256(bytes), spec.sha256, `hurricane_artifact_internal_sha256:${name}`);
}
const artifactResult = JSON.parse(unzip(h.artifactFiles.result.path).toString('utf8'));
eq(artifactResult.protocol_sha256, h.artifactFiles.protocol.sha256, 'artifact_result_protocol_binding');
eq(artifactResult.terminal_disposition, hurricane.results.terminalDisposition, 'artifact_terminal_matches_adjudication');
eq(artifactResult.qc_correction, hurricane.qcCorrection, 'artifact_qc_matches_adjudication');
near(artifactResult.models.BASE.roc_auc, hurricane.results.BASE.rocAuc, 1e-12, 'artifact_base_auc');
near(artifactResult.models.COMBINED_NONCOMP.roc_auc, hurricane.results.COMBINED_NONCOMP.rocAuc, 1e-12, 'artifact_noncomp_auc');
near(artifactResult.models.COMBINED_ADDITIVE.roc_auc, hurricane.results.COMBINED_ADDITIVE.rocAuc, 1e-12, 'artifact_additive_auc');
near(artifactResult.primary_incremental_auc, hurricane.results.primaryIncrementalAuc, 1e-12, 'artifact_incremental_auc');
eq(artifactResult.bootstrap.COMBINED_NONCOMP_minus_BASE.ci95, hurricane.results.stormClusterBootstrap.COMBINED_NONCOMP_minus_BASE.ci95, 'artifact_noncomp_ci');
eq(artifactResult.bootstrap.COMBINED_ADDITIVE_minus_BASE.ci95, hurricane.results.stormClusterBootstrap.COMBINED_ADDITIVE_minus_BASE.ci95, 'artifact_additive_ci');

// Source ledger itself may not authorize source mutation or science merges.
ok(ledger.sourceMutationAuthorized === false, 'source_mutation_authority');
ok(ledger.sciencePrMergeAuthorized === false, 'science_pr_merge_authority');
ok(ledger.pr541MutationAuthorized === false, 'pr541_mutation_authority');

console.log(JSON.stringify({
  result: 'PASS_FIRST_SAFE_VERTICAL_CASE_SELECTION_REPAIRED_v2',
  operation: op.operation,
  selectedCase: selected.selectedCase.caseId,
  selectedSourceHead: selected.selectedCase.sourceHead,
  hurricaneDelta: hurricane.results.terminalDisposition,
  hurricanePrimaryIncrementalAuc: hurricane.results.primaryIncrementalAuc,
  hurricaneArtifactId: h.artifactId,
  hurricaneArtifactBound: true,
  successorProgram: handoff.successorProgram,
  firstAuthorizedGateAfterActivation: handoff.firstAuthorizedGateAfterActivation,
  publicMutation: op.stopBoundary.publicPageMutation
}, null, 2));
