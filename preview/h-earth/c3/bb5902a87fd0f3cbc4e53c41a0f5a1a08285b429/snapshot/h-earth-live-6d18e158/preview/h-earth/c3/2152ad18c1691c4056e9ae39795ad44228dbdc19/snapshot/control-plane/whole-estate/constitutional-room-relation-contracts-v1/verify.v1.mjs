import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const fail = msg => { throw new Error(`CHECKPOINT_3_VERIFY_FAIL:${msg}`); };
const has = (arr, value) => Array.isArray(arr) && arr.includes(value);

const rooms = read('constitutional-room-contracts.v1.json');
const adjacency = read('constitutional-adjacency-contracts.v1.json');
const translation = read('translation-fidelity-and-salience-contract.v1.json');
const standing = read('uncertainty-and-standing-relation-contract.v1.json');
const representation = read('representation-authority-and-ux-validity-contract.v1.json');
const sources = read('source-ledger.v1.json');

if (rooms.schema !== 'WHOLE_ESTATE_CONSTITUTIONAL_ROOM_CONTRACTS_v1') fail('ROOM_SCHEMA');
if (rooms.governingMain !== '889197b2cbe73de171756b7545446f12a726cde7') fail('GOVERNING_MAIN');

const expected = [
  'COMPASS','REALITY','LAWS','UCIC','IMI','METHODS_MODELS','COHERENCE_DIAGNOSTIC',
  'FRONTIER','PRODUCTS','WORLDS_CHARACTERS_CAMPAIGNS','RESEARCH_PROVENANCE','INTERFACE_3D'
];
const ids = rooms.contracts.map(x => x.id);
if (ids.length !== expected.length || new Set(ids).size !== expected.length) fail('ROOM_CARDINALITY');
for (const id of expected) if (!ids.includes(id)) fail(`ROOM_MISSING:${id}`);
for (const room of rooms.contracts) {
  for (const key of ['identity','primaryRole','function','authority','forbiddenAuthority','requiredInputs','permittedOutputs','constitutionalAdjacency','nonSubstitution']) {
    if (!(key in room)) fail(`ROOM_FIELD:${room.id}:${key}`);
  }
}

const byId = id => rooms.contracts.find(x => x.id === id);
if (byId('COMPASS').identity !== 'GLOBAL_ORIENTATION_AUTHORITY') fail('COMPASS_IDENTITY');
if (!has(byId('COMPASS').forbiddenAuthority, 'SCIENTIFIC_ADJUDICATION')) fail('COMPASS_SCIENCE_BOUNDARY');
if (byId('UCIC').identity !== 'INVARIANT_CANDIDATE') fail('UCIC_IDENTITY');
if (byId('IMI').identity !== 'INSTRUMENT') fail('IMI_IDENTITY');
if (!has(byId('IMI').forbiddenAuthority, 'DECLARE_UCIC_TRUE')) fail('IMI_CONFIRMATION_BOUNDARY');
if (!has(byId('METHODS_MODELS').forbiddenAuthority, 'WHOLE_ESTATE_OWNERSHIP')) fail('METHODS_GLOBAL_BOUNDARY');
if (!has(byId('RESEARCH_PROVENANCE').forbiddenAuthority, 'SCIENTIFIC_TRUTH_BY_CI')) fail('PROVENANCE_TRUTH_BOUNDARY');
if (!has(byId('INTERFACE_3D').forbiddenAuthority, 'SCIENTIFIC_STATE_MUTATION')) fail('INTERFACE_STATE_BOUNDARY');
if (!has(byId('INTERFACE_3D').forbiddenAuthority, 'VISUAL_AUTHORITY_INFLATION')) fail('INTERFACE_VISUAL_AUTHORITY_BOUNDARY');

if (adjacency.relationLaw !== 'NAVIGABLE_RELATION_REQUIRES_DECLARED_SEMANTIC_RELATION') fail('ADJACENCY_LAW');
if (adjacency.roomAdjacencyCreatesUniversalObjectRelation !== false) fail('UNIVERSAL_RELATION');
if (adjacency.rendererMayInventRelations !== false) fail('RENDERER_RELATION');
for (const rel of adjacency.relations) {
  if (!ids.includes(rel.from) || !ids.includes(rel.to)) fail(`BAD_ENDPOINT:${rel.from}:${rel.to}`);
  if (!rel.type || !('scientificStandingEffect' in rel)) fail(`BAD_RELATION:${rel.from}:${rel.to}`);
}
for (const rule of ['ADJACENCY_DOES_NOT_IMPLY_CONTAINMENT','SPATIAL_CENTRALITY_DOES_NOT_IMPLY_SCIENTIFIC_IMPORTANCE','DEPTH_DOES_NOT_IMPLY_TRUTH']) {
  if (!has(adjacency.forbiddenImplications, rule)) fail(`FORBIDDEN_IMPLICATION:${rule}`);
}
if (adjacency.spatialTopologyFreezeAuthorized !== false) fail('TOPOLOGY_FREEZE');

const validity = translation.validityLayers.map(x => x.id).join('>');
if (validity !== 'V_C>V_E>V_T>V_U') fail('VALIDITY_ORDER');
if (!has(translation.laws, 'SIMPLIFICATION_MAY_REDUCE_DETAIL_BUT_MAY_NOT_REMOVE_A_CONDITION_NECESSARY_TO_INTERPRET_THE_CLAIM')) fail('TRANSLATION_FIDELITY');
if (!has(translation.laws, 'MATERIAL_QUALIFIERS_MUST_APPEAR_AT_OR_BEFORE_THE_DEPTH_AT_WHICH_THEIR_ABSENCE_COULD_CHANGE_THE_USER_CONCLUSION')) fail('QUALIFIER_SALIENCE');
if (translation.depthRule.depthsMayHideDecisionRelevantQualifierPastDecisionPoint !== false) fail('QUALIFIER_DEPTH');
if (translation.publicFormalism.publicBenefitMustNotRequireLearningControlPlaneNotation !== true) fail('PUBLIC_FORMALISM');
if (translation.reservedTerminology.PROSPECTIVE !== 'STRICT_SCIENTIFIC_USE_ONLY_NOT_INTERFACE_TRAVERSAL') fail('PROSPECTIVE_RESERVED');

for (const state of ['SUPPORTED_WITHIN_BOUNDARY','CONTRADICTED','MIXED','UNTESTED','UNDERPOWERED','SOURCE_INCOMPLETE','PROTOCOL_ONLY','EMPIRICAL_VALIDATION_NOT_ESTABLISHED','UNRESOLVED','NO_MATCH']) {
  if (!has(standing.standingVocabulary, state)) fail(`STANDING_STATE:${state}`);
}
if (standing.uncertaintyIsFirstClass !== true) fail('UNCERTAINTY_FIRST_CLASS');
if (standing.sourceOwnershipVisibility.required !== true) fail('SOURCE_VISIBILITY');
if (standing.sourceOwnershipVisibility.independentReplicationEqualsProjectReanalysisOfExternalData !== false) fail('INDEPENDENCE_DISTINCTION');
if (standing.selfReferentialCredibilityLoop.prohibited !== true) fail('CLOSED_CREDIBILITY_LOOP');

if (representation.representationAuthorityEqualsPersuasionAuthority !== false) fail('REPRESENTATION_PERSUASION');
if (representation.visualAuthorityInflationProhibited !== true) fail('VISUAL_AUTHORITY');
if (representation.navigationalImportanceEqualsEvidentiaryStrength !== false) fail('NAV_EVIDENCE');
if (representation.userEffectiveness.status !== 'NOT_EMPIRICALLY_ESTABLISHED') fail('USER_EFFECTIVENESS');
if (representation.userEffectiveness.siteWideDeliveryStandardStatus !== 'NOT_ESTABLISHED') fail('SITEWIDE_STANDARD');
if (!has(representation.userEffectiveness.requiredOutcomes, 'CONFIDENCE_CALIBRATION')) fail('CALIBRATION_OUTCOME');
if (!has(representation.userEffectiveness.requiredOutcomes, 'FALSE_CONFIDENCE')) fail('FALSE_CONFIDENCE_OUTCOME');
if (representation.confidenceCalibration.falseConfidenceIsSevereFailureMode !== true) fail('FALSE_CONFIDENCE_SEVERITY');

if (sources.governingMain !== rooms.governingMain) fail('SOURCE_MAIN');
if (sources.unmergedScientificBranchesPromotedToGoverningAuthority !== false) fail('UNMERGED_AUTHORITY');

for (const obj of [rooms, adjacency, translation, standing, representation, sources]) {
  if (obj.publicMutationAuthorized !== false) fail(`PUBLIC_MUTATION:${obj.schema}`);
}

console.log('PASS_CONSTITUTIONAL_ROOM_RELATION_CONTRACTS_v1');
