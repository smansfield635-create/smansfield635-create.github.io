import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('control-plane/whole-estate/invariant-contract-package-v1');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRepoJson = (file) => JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const must = (condition, message) => { if (!condition) throw new Error(message); };

const registry = readJson('invariant-registry.v1.json');
const narrative = readJson('narrative-invariant-contract.v1.json');
const canonical = readJson('canonical-state-invariant-contract.v1.json');
const routing = readJson('routing-return-context-invariant-contract.v1.json');
const evidence = readJson('evidence-standing-invariant-contract.v1.json');
const lens = readJson('lens-view-invariant-contract.v1.json');
const delta = readJson('scientific-delta-ingress-contract.v1.json');
const sources = readJson('source-ledger.v1.json');

const cp1Register = readRepoJson('control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/prospective-change-register.v1.json');
const cp3Translation = readRepoJson('control-plane/whole-estate/constitutional-room-relation-contracts-v1/translation-fidelity-and-salience-contract.v1.json');
const cp5Role = readRepoJson('control-plane/whole-estate/methods-models-role-constitution-v1/methods-models-role-contract.v1.json');
const cp5Standing = readRepoJson('control-plane/whole-estate/methods-models-role-constitution-v1/claim-trace-standing-contract.v1.json');

const cp6 = cp1Register.entries.find((entry) => entry.checkpoint === 6);
must(cp6, 'Checkpoint 6 registration missing');
must(cp6.id === 'INVARIANT_CONTRACT_PACKAGE_v1', 'Checkpoint 6 registered identity drift');
must(cp6.intendedIntervention === 'construct machine-verifiable narrative, state, routing, evidence and lens invariants', 'Checkpoint 6 intervention drift');
for (const capacity of ['CANONICAL_STATE','EVIDENCE_BOUNDARIES','AUTHORITY_BOUNDARIES','RETURN_CONTEXT']) {
  must(cp6.preservedCapacities.includes(capacity), `missing registered preserved capacity ${capacity}`);
}
for (const falsifier of ['navigation silently changes scientific meaning','interface changes evidence state','state restoration is ambiguous']) {
  must(cp6.falsifiers.includes(falsifier), `missing registered falsifier ${falsifier}`);
}
must(cp6.publicMutationAuthorized === false, 'Checkpoint 6 registration accidentally authorizes public mutation');

must(registry.schema === 'WHOLE_ESTATE_INVARIANT_REGISTRY_v1', 'registry schema mismatch');
must(registry.registeredIntervention === 'CONSTRUCT_MACHINE_VERIFIABLE_NARRATIVE_STATE_ROUTING_EVIDENCE_AND_LENS_INVARIANTS', 'registry intervention mismatch');
for (const capacity of cp6.preservedCapacities) must(registry.preservedCapacities.includes(capacity), `registry lost ${capacity}`);
for (const law of [
  'NAVIGATION_MAY_CHANGE_LOCATION_BUT_MAY_NOT_CHANGE_SCIENTIFIC_MEANING',
  'INTERFACE_STATE_MAY_CHANGE_VIEW_BUT_MAY_NOT_CHANGE_EVIDENCE_STATE',
  'RETURN_CONTEXT_MUST_BE_EXPLICIT_AND_DETERMINISTIC',
  'DELTA_D_DOES_NOT_IMPLY_DELTA_I',
  'NAVIGABLE_RELATION_REQUIRES_DECLARED_SEMANTIC_RELATION',
  'OUTWARD_TRAVERSAL_IS_CONSTRAINED_BY_GIVEN_THAT_STANDING',
  'REPRESENTATION_AUTHORITY_NOT_PERSUASION_AUTHORITY',
  'NAVIGATIONAL_IMPORTANCE_NOT_EVIDENTIARY_STRENGTH'
]) must(registry.globalInvariants.includes(law), `registry missing global invariant ${law}`);
must(registry.constructionModel.required === 'G=f(T(X(C,P)))', 'construction model required relation drift');
must(registry.constructionModel.prohibited === 'G=f(P)', 'construction shortcut prohibition drift');
must(registry.crosswalkMaterializedByCheckpoint6 === false, 'Checkpoint 6 silently materialized crosswalk');
must(registry.typedSemanticGraphMaterializedByCheckpoint6 === false, 'Checkpoint 6 silently materialized semantic graph');
must(registry.spatialTopologyFreezeAuthorized === false, 'Checkpoint 6 silently authorized topology freeze');
must(registry.geometryAuthorized === false, 'Checkpoint 6 silently authorized geometry');
must(registry.publicMutationAuthorized === false, 'Checkpoint 6 silently authorized public mutation');
must(registry.scientificClaimUpgradeAuthorized === false, 'Checkpoint 6 silently authorized scientific claim upgrade');

must(narrative.schema === 'WHOLE_ESTATE_NARRATIVE_INVARIANT_CONTRACT_v1', 'narrative schema mismatch');
for (const law of ['NARRATIVE_MAY_EXPLAIN_OBJECT_BUT_MAY_NOT_RECLASSIFY_OBJECT','NARRATIVE_MAY_USE_METAPHOR_BUT_MAY_NOT_UPGRADE_EMPIRICAL_STANDING','DIRECT_ENTRY_MUST_REMAIN_VALID_WITHOUT_PREREQUISITE_NARRATIVE_TRAVERSAL']) {
  must(narrative.invariants.includes(law), `narrative invariant missing ${law}`);
}
must(narrative.scientificClaimUpgradeAuthorized === false, 'narrative contract authorizes claim upgrade');

must(canonical.schema === 'WHOLE_ESTATE_CANONICAL_STATE_INVARIANT_CONTRACT_v1', 'canonical schema mismatch');
for (const field of ['OBJECT_CLASS','AUTHORITY','EVIDENCE_STATUS','CLAIM_CEILING','CUSTODY_STATUS','EXECUTION_STATUS']) {
  must(canonical.canonicalIdentityTuple.includes(field), `canonical identity tuple missing ${field}`);
}
for (const law of ['DELTA_D_DOES_NOT_IMPLY_DELTA_I','VIEW_CHANGE_MAY_CHANGE_REPRESENTATION_BUT_NOT_CANONICAL_STATE','STATE_RESTORATION_MUST_RETURN_EXACT_DECLARED_CANONICAL_REFERENT_OR_FAIL_CLOSED']) {
  must(canonical.laws.includes(law), `canonical state law missing ${law}`);
}
must(canonical.stateMutationAuthorities.presentationDepth === 'REPRESENTATION_AUTHORITY', 'presentation depth authority drift');
must(canonical.stateMutationAuthorities.claimCeiling === 'EVIDENCE_ADJUDICATION_ONLY', 'claim ceiling authority drift');

must(routing.schema === 'WHOLE_ESTATE_ROUTING_RETURN_CONTEXT_INVARIANT_CONTRACT_v1', 'routing schema mismatch');
for (const law of ['NAVIGABLE_RELATION_REQUIRES_DECLARED_SEMANTIC_RELATION','NAVIGATION_MAY_CHANGE_LOCATION_BUT_MAY_NOT_CHANGE_SCIENTIFIC_MEANING','OUTWARD_TRAVERSAL_IS_CONSTRAINED_BY_GIVEN_THAT_STANDING','DESTINATION_EXISTENCE_DOES_NOT_UPGRADE_ORIGINAL_STANDING']) {
  must(routing.navigationLaws.includes(law), `routing law missing ${law}`);
}
must(routing.returnContext.required === true, 'return context not required');
must(routing.returnContext.silentFallbackAuthorized === false, 'silent return fallback authorized');
must(routing.returnContext.ambiguousRestorationAuthorized === false, 'ambiguous restoration authorized');
for (const field of ['ORIGIN_ROUTE','ORIGIN_OBJECT_ID','ORIGIN_DEPTH','ORIGIN_LENS','DECLARED_RELATION_USED','DESTINATION_ROUTE','RETURN_TARGET']) {
  must(routing.returnContext.minimumFields.includes(field), `return context missing ${field}`);
}

must(evidence.schema === 'WHOLE_ESTATE_EVIDENCE_STANDING_INVARIANT_CONTRACT_v1', 'evidence schema mismatch');
for (const state of cp5Standing.standingVocabulary) must(evidence.standingVocabulary.includes(state), `Checkpoint 6 lost standing state ${state}`);
for (const law of ['INTERFACE_STATE_MAY_CHANGE_VIEW_BUT_MAY_NOT_CHANGE_EVIDENCE_STATE','STANDING_MUST_BE_ASSIGNED_FROM_EVIDENCE_AND_SOURCE_STATE_NOT_PRESENTATION','PROTOCOL_ONLY_MAY_ROUTE_TO_PREPARED_EXPERIMENT_NOT_CLAIMED_DISCOVERY','EXTERNAL_SUPPORT_MAY_NOT_BE_RELABELLED_AS_PROJECT_RESULT']) {
  must(evidence.laws.includes(law), `evidence invariant missing ${law}`);
}
must(evidence.visualOrNavigationEvidenceMutationAuthorized === false, 'visual/navigation evidence mutation authorized');
must(evidence.trustMachineAuthorized === false, 'trust-machine authority granted');
must(evidence.scientificClaimUpgradeAuthorized === false, 'evidence contract authorizes claim upgrade');

must(lens.schema === 'WHOLE_ESTATE_LENS_VIEW_INVARIANT_CONTRACT_v1', 'lens schema mismatch');
for (const law of ['LENS_MAY_SELECT_A_DECLARED_PERSPECTIVE_BUT_MAY_NOT_RECLASSIFY_THE_OBJECT','LENS_MAY_NOT_CHANGE_EVIDENCE_STATUS_OR_CLAIM_CEILING','VIEW_MODE_MAY_CHANGE_REPRESENTATION_BUT_NOT_CANONICAL_STATE']) {
  must(lens.lensLaws.includes(law), `lens law missing ${law}`);
}
for (const law of ['REPRESENTATION_AUTHORITY_NOT_PERSUASION_AUTHORITY','NAVIGATIONAL_IMPORTANCE_NOT_EVIDENTIARY_STRENGTH','CENTRALITY_NOT_VALIDATION','DEPTH_NOT_TRUTH']) {
  must(lens.visualAuthorityLaws.includes(law), `visual authority law missing ${law}`);
}
must(JSON.stringify(lens.validityChain) === JSON.stringify(['V_C','V_E','V_T','V_U']), 'validity chain drift');
must(lens.userInterpretabilityEmpiricallyEstablishedByCheckpoint6 === false, 'UX interpretability silently claimed established');
must(lens.falseConfidenceIsSevereFailureMode === true, 'false confidence failure mode lost');
must(lens.geometryAuthorized === false, 'lens contract authorizes geometry');

must(cp3Translation.requiredOrder === 'V_C_TO_V_E_TO_V_T_TO_V_U', 'upstream validity chain drift');
must(cp3Translation.laws.includes('SIMPLIFICATION_MAY_REDUCE_DETAIL_BUT_MAY_NOT_REMOVE_A_CONDITION_NECESSARY_TO_INTERPRET_THE_CLAIM'), 'upstream translation fidelity law missing');
must(cp5Role.identity === 'EVIDENCE_GATE_RELATION_MAP_DISCOVERY_BRIDGE', 'upstream Methods & Models identity drift');
must(cp5Role.movements.outwardTraversal === 'VERIFY_TO_EXPLORE', 'upstream outward traversal drift');
must(cp5Role.reservedTerminology.PROSPECTIVE === 'STRICT_SCIENTIFIC_USE_ONLY_NOT_INTERFACE_TRAVERSAL', 'reserved prospective terminology drift');
must(cp5Standing.outwardTraversalRule === 'GIVEN_THAT_STANDING', 'upstream standing ceiling drift');

must(delta.schema === 'WHOLE_ESTATE_SCIENTIFIC_DELTA_INGRESS_CONTRACT_v1', 'delta ingress schema mismatch');
must(delta.hurricaneDelta.developmentClass === 'FUTURE_EVIDENCE_DELTA', 'hurricane delta classification drift');
must(delta.hurricaneDelta.newProjectEmpiricalResult === false, 'hurricane delta invents project empirical result');
must(delta.hurricaneDelta.staticHURDAT2Proxy === 'NEGATIVE', 'negative HURDAT2 result not preserved');
must(delta.hurricaneDelta.temporalStructuralPremise === 'EXTERNALLY_SUPPORTED', 'external temporal premise status drift');
must(delta.hurricaneDelta.successorProjectTestStatus === 'NOT_YET_EXECUTED', 'successor hurricane test silently treated as executed');
must(delta.hurricaneDelta.hurricaneConfirmationOfIMI === 'NOT_ESTABLISHED', 'hurricane confirmation silently claimed');
must(delta.hurricaneDelta.checkpoint6BlockingEffect === 'NONE', 'hurricane delta incorrectly blocks Checkpoint 6');
must(delta.scientificClaimUpgradeAuthorized === false, 'delta ingress authorizes claim upgrade');

must(sources.governingMain === 'b2533139bacbf876f818892a06c691824fa216dd', 'source ledger governing main mismatch');
must(sources.governingTree === 'a7eedf5723c88d558cb3d5da9b2aa35e1175bbe4', 'source ledger governing tree mismatch');
must(sources.checkpoint5SourcePR === 732, 'Checkpoint 5 source PR mismatch');
must(sources.checkpoint5PostMergeCertificationRun === 31153754083, 'Checkpoint 5 certification run mismatch');
must(sources.unmergedPresentationPrototype.pr === 541, 'PR541 source identity drift');
must(sources.unmergedPresentationPrototype.promotedToGoverningAuthority === false, 'PR541 promoted to governing authority');
must(sources.canonicalCrosswalkMaterialized === false, 'source ledger claims crosswalk materialized');
must(sources.typedSemanticRelationGraphMaterialized === false, 'source ledger claims typed graph materialized');
must(sources.publicMutationAuthorized === false, 'source ledger authorizes public mutation');
must(sources.scientificClaimUpgradeAuthorized === false, 'source ledger authorizes scientific claim upgrade');

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const token of [
  'INVARIANT_CONTRACT_PACKAGE_v1',
  'NAVIGATION_MAY_CHANGE_LOCATION_BUT_MAY_NOT_CHANGE_SCIENTIFIC_MEANING',
  'INTERFACE_STATE_MAY_CHANGE_VIEW_BUT_MAY_NOT_CHANGE_EVIDENCE_STATE',
  'RETURN_CONTEXT_MUST_BE_EXPLICIT_AND_DETERMINISTIC',
  'V_C -> V_E -> V_T -> V_U',
  'G=f(T(X(C,P)))',
  'PUBLIC_PAGE_MUTATION = FALSE',
  'CHECKPOINT_7_EXECUTION = NOT_STARTED'
]) must(readme.includes(token), `README missing required token: ${token}`);

console.log('PASS_INVARIANT_CONTRACT_PACKAGE_v1');
