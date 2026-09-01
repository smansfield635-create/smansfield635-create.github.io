import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('control-plane/whole-estate/methods-models-role-constitution-v1');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const must = (condition, message) => {
  if (!condition) throw new Error(message);
};

const role = readJson('methods-models-role-contract.v1.json');
const comparison = readJson('controlled-comparison-contract.v1.json');
const separation = readJson('method-model-separation-contract.v1.json');
const dependencies = readJson('estate-dependency-destination-contract.v1.json');
const standing = readJson('claim-trace-standing-contract.v1.json');
const canonical = readJson('canonical-presentation-precondition-contract.v1.json');
const sources = readJson('source-ledger.v1.json');

must(role.schema === 'WHOLE_ESTATE_METHODS_MODELS_ROLE_CONTRACT_v1', 'role schema mismatch');
must(role.identity === 'EVIDENCE_GATE_RELATION_MAP_DISCOVERY_BRIDGE', 'Methods & Models identity drift');
must(role.globalOrientationAuthority === 'COMPASS', 'Compass orientation authority lost');
for (const forbidden of ['WHOLE_ESTATE_OWNERSHIP','GLOBAL_ORIENTATION_AUTHORITY','PERSONAL_DIAGNOSIS','FULL_FRONTIER_STUDY_OWNERSHIP','SCIENTIFIC_CONFIRMATION_BY_PRESENTATION']) {
  must(role.forbiddenAuthority.includes(forbidden), `missing forbidden authority ${forbidden}`);
}
must(role.scientificClaimUpgradeAuthorized === false, 'scientific claim upgrade accidentally authorized');
must(role.publicMutationAuthorized === false, 'public mutation accidentally authorized');

must(comparison.objectClasses.METHOD, 'method class missing');
must(comparison.objectClasses.MODEL, 'model class missing');
must(comparison.objectClasses.COMPARATOR, 'comparator class missing');
must(comparison.objectClasses.INSTRUMENT, 'instrument class missing');
for (const law of ['METHOD_NOT_MODEL','MODEL_NOT_RESULT','COMPARATOR_NOT_INSTRUMENT','INSTRUMENT_NOT_MODEL','EXECUTION_NOT_EVIDENCE_STANDING']) {
  must(comparison.nonEquivalences.includes(law), `missing non-equivalence ${law}`);
}
must(comparison.prohibitedComparisonForms.includes('MODEL_AND_METHOD_COLLAPSED_INTO_ONE_UNTYPED_OBJECT'), 'method/model collapse falsifier missing');

must(separation.methodModelCollapseIsFalsifier === true, 'method/model collapse must remain falsifier');
must(separation.automaticCanonicalReclassificationAuthorized === false, 'canonical reclassification accidentally authorized');
must(separation.automaticEvidenceUpgradeAuthorized === false, 'evidence upgrade accidentally authorized');

for (const law of ['NAVIGABLE_RELATION_REQUIRES_DECLARED_SEMANTIC_RELATION','OUTWARD_TRAVERSAL_IS_CONSTRAINED_BY_GIVEN_THAT_STANDING','DESTINATION_EXISTENCE_DOES_NOT_UPGRADE_ORIGINAL_STANDING']) {
  must(dependencies.navigationLaws.includes(law), `missing navigation law ${law}`);
}
for (const absorption of ['METHODS_MODELS_AS_HOMEPAGE','METHODS_MODELS_AS_GLOBAL_COMPASS','METHODS_MODELS_ABSORBS_FRONTIER','METHODS_MODELS_ABSORBS_DIAGNOSTIC','METHODS_MODELS_ABSORBS_PROVENANCE']) {
  must(dependencies.forbiddenAbsorptions.includes(absorption), `missing forbidden absorption ${absorption}`);
}
must(dependencies.universalConnectivity === false, 'universal connectivity accidentally asserted');

for (const state of ['SUPPORTED_WITHIN_BOUNDARY','MIXED','ADVERSE_RESULT_PRESERVED','PROTOCOL_ONLY','UNRESOLVED','NO_MATCH']) {
  must(standing.standingVocabulary.includes(state), `missing standing state ${state}`);
}
must(standing.outwardTraversalRule === 'GIVEN_THAT_STANDING', 'outward traversal ceiling drift');
must(standing.trustMachineAuthorized === false, 'trust-machine authority accidentally granted');

must(canonical.currentCanonicalManifest.assignedCanonicalRecords === 10, 'canonical assigned-record count drift');
must(canonical.currentCanonicalManifest.sourceInventory === 'OPEN', 'source inventory closure silently upgraded');
must(canonical.currentCanonicalManifest.semanticCrosswalk === 'PARTIAL', 'semantic crosswalk closure silently upgraded');
must(canonical.pr541.presentationRecords === 25, 'PR541 presentation-record count drift');
must(canonical.pr541.peerCanonicalObjectClaimAuthorized === false, '25 presentation records silently promoted to canonical peers');
must(canonical.pr541.canonicalScientificHierarchyClaimAuthorized === false, 'presentation families silently promoted to canonical hierarchy');
must(canonical.constructionModel.required === 'G=f(T(X(C,P)))', 'required construction relation drift');
must(canonical.constructionModel.prohibited === 'G=f(P)', 'prohibited construction shortcut drift');
must(canonical.canonicalCrosswalkMaterializedByCheckpoint5 === false, 'Checkpoint 5 must not materialize canonical crosswalk');
must(canonical.spatialTopologyFreezeAuthorized === false, 'topology freeze accidentally authorized');
must(canonical.geometryAuthorized === false, 'geometry accidentally authorized');

must(sources.governingMain === '8983b36233e55700614435cd17cc7139cc920336', 'governing main mismatch');
must(sources.governingTree === '139086f69385f7f44c1210db6179acd52b73df45', 'governing tree mismatch');
must(sources.unmergedPresentationPrototypePromotedToGoverningAuthority === false, 'PR541 promoted to governing authority');
must(sources.canonicalCrosswalkMaterialized === false, 'source ledger claims crosswalk materialized');
must(sources.publicMutationAuthorized === false, 'source ledger authorizes public mutation');

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const token of [
  'METHODS_MODELS = EVIDENCE_GATE + RELATION_MAP + DISCOVERY_BRIDGE',
  'METHOD != MODEL',
  'EXPLORATION_MAY_FOLLOW_EVIDENCE_BUT_MAY_NEVER_OUTRUN_IT',
  'PRESENTATION_IDENTITY != SCIENTIFIC_IDENTITY',
  'SCIENTIFIC_OBJECT_REGISTRY -> IDENTITY_DELIVERY_CROSSWALK -> TYPED_SEMANTIC_RELATION_GRAPH -> SPATIAL_TOPOLOGY -> GEOMETRY',
  'PUBLIC_PAGE_MUTATION = FALSE',
  'CHECKPOINT_6_EXECUTION = NOT_STARTED'
]) {
  must(readme.includes(token), `README missing required token: ${token}`);
}

console.log('PASS_METHODS_MODELS_ROLE_CONSTITUTION_v1');
