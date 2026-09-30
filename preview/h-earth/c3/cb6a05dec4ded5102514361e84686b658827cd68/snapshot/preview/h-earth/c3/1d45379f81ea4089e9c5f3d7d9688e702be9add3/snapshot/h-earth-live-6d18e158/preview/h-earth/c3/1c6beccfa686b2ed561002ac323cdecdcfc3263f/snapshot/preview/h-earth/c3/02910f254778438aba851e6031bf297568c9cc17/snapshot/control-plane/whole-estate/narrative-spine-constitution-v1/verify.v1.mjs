import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cp2 = path.join(root, 'control-plane/whole-estate/narrative-spine-constitution-v1');
const cp1 = path.join(root, 'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1');

function fail(message) {
  console.error(`FAIL_CHECKPOINT_2_NARRATIVE_SPINE_CONSTITUTION_v1: ${message}`);
  process.exit(1);
}

function readJson(file) {
  const p = path.join(cp2, file);
  if (!fs.existsSync(p)) fail(`missing ${file}`);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (error) { fail(`invalid JSON ${file}: ${error.message}`); }
}

function requireValue(condition, message) {
  if (!condition) fail(message);
}

const requiredCp1 = [
  'narrative-journey-map.v1.json',
  'relationship-crosswalk.v1.json',
  'authority-and-ownership-matrix.v1.json',
  'claim-boundary-matrix.v1.json',
  'prospective-change-register.v1.json'
];
for (const file of requiredCp1) {
  if (!fs.existsSync(path.join(cp1, file))) fail(`missing governing CP1 file ${file}`);
}

const narrative = readJson('narrative-spine.v1.json');
const delta = readJson('scientific-delta-reconciliation.v1.json');
const traversal = readJson('evidence-standing-traversal-contract.v1.json');
const translation = readJson('narrative-translation-boundary.v1.json');
const bridge = readJson('methods-models-bridge-obligations.v1.json');
const sources = readJson('source-ledger.v1.json');

const expectedStatus = 'CHECKPOINT_2_CONSTRUCTION_CANDIDATE';
for (const [name, obj] of Object.entries({narrative, delta, traversal, translation, bridge, sources})) {
  requireValue(obj.status === expectedStatus, `${name} status drift`);
}

requireValue(narrative.operation === 'NARRATIVE_SPINE_CONSTITUTION_v1', 'operation drift');
requireValue(narrative.governingBaseline?.main === 'c73a4f8854b8b2bf8f7b12fa860f0bc85d666544', 'governing main drift');
requireValue(narrative.governingBaseline?.tree === 'aedef3f75a3c4fd445a736bf8eeb73125bea3fb4', 'governing tree drift');
requireValue(narrative.governingBaseline?.checkpoint1 === 'PASS_CLOSED', 'CP1 not closed');
requireValue(narrative.navigation?.directEntryAllowed === true, 'direct entry lost');
requireValue(narrative.navigation?.sequenceIsExplanatoryNotAccessControl === true, 'journey became access control');
requireValue(narrative.navigation?.globalOrientationAuthority === 'COMPASS', 'Compass authority lost');
requireValue(narrative.navigation?.methodsModelsGlobalNavigationAuthority === false, 'Methods Models became competing global navigation authority');
requireValue(narrative.navigation?.returnToCompassPreserved === true, 'return to Compass lost');
requireValue(Array.isArray(narrative.journey) && narrative.journey.length === 9, 'nine-stage journey not preserved');
requireValue(narrative.journey.map(x => x.order).join(',') === '1,2,3,4,5,6,7,8,9', 'journey order invalid');
requireValue(narrative.narrativeLaws?.includes('NO_ROOM_IS_THE_WHOLE_ESTATE'), 'whole-estate noncollapse law missing');
requireValue(narrative.narrativeLaws?.includes('NARRATIVE_WORDING_MAY_NOT_CHANGE_SCIENTIFIC_STANDING'), 'scientific standing narrative boundary missing');
requireValue(narrative.narrativeLaws?.includes('EXPLORATION_MAY_FOLLOW_EVIDENCE_BUT_MAY_NEVER_OUTRUN_IT'), 'evidence traversal ceiling missing');
requireValue(narrative.publicMutationAuthorized === false, 'public mutation unexpectedly authorized');

requireValue(delta.source?.pr === 720, 'IMI/UCIC delta source PR drift');
requireValue(delta.source?.sourceStatus === 'DRAFT_UNMERGED', 'draft scientific source status drift');
requireValue(delta.source?.authoritativeResearchHead === '5664ba8e059a65f1b7ec39f2c7e944866c06278b', 'scientific source head drift');
requireValue(delta.terminalConstitutionalDisposition?.constitutionalImpact === false, 'scientific delta improperly became constitutional correction');
requireValue(delta.terminalConstitutionalDisposition?.cp1RepairRequired === false, 'CP1 repair improperly required');
requireValue(delta.terminalConstitutionalDisposition?.checkpoint1Reopen === false, 'CP1 improperly reopened');
requireValue(delta.terminalConstitutionalDisposition?.scientificClaimUpgradeAuthorized === false, 'scientific claim upgrade unexpectedly authorized');
requireValue(delta.terminalConstitutionalDisposition?.draftPr720MergeAuthorized === false, 'draft PR720 merge unexpectedly authorized');
const fdic = delta.developments?.find(x => x.deltaId === 'FDIC_LONGITUDINAL_GENERALIZATION');
requireValue(fdic?.disposition === 'FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED', 'FDIC adverse disposition lost');
requireValue(fdic?.adverseEvidence?.ucicFalsePositiveRate === 1.0, 'FDIC false-positive rate drift');
requireValue(fdic?.adverseEvidence?.ucicDiscriminationMargin === 0.0, 'FDIC discrimination margin drift');
requireValue(fdic?.adverseEvidence?.additiveFalsePositiveRate === 0.273, 'additive comparator adverse comparison drift');

requireValue(traversal.methodsModelsLocalRole?.includes('EVIDENCE_GATE'), 'evidence gate missing');
requireValue(traversal.methodsModelsLocalRole?.includes('RELATION_MAP'), 'relation map missing');
requireValue(traversal.methodsModelsLocalRole?.includes('DISCOVERY_BRIDGE'), 'discovery bridge missing');
requireValue(traversal.reservedTerminology?.PROSPECTIVE === 'STRICT_SCIENTIFIC_USE_ONLY_NOT_INTERFACE_TRAVERSAL', 'PROSPECTIVE terminology contamination');
requireValue(traversal.laws?.includes('NAVIGABLE_RELATION_REQUIRES_DECLARED_SEMANTIC_RELATION'), 'typed navigable relation law missing');
requireValue(traversal.laws?.includes('INTERFACE_MOVEMENT_MAY_NOT_ESCALATE_EVIDENCE'), 'interface evidence escalation guard missing');
requireValue(traversal.typedRelationRequirement?.universalConnectivity === false, 'universal connectivity improperly asserted');
requireValue(traversal.globalOrientationAuthority === 'COMPASS', 'Compass authority drift in traversal contract');
requireValue(traversal.methodsModelsMayBecomeGlobalCompass === false, 'Methods Models global Compass competition allowed');
requireValue(traversal.publicMutationAuthorized === false, 'traversal contract authorizes public mutation');

requireValue(translation.metaphorMaySubstituteForEvidence === false, 'metaphor allowed to substitute for evidence');
requireValue(translation.publicNarrativeMayOutrunClaimCeiling === false, 'narrative allowed to outrun claim ceiling');
requireValue(translation.hypothesisBoundary?.universalDestinyClaim === 'FORBIDDEN', 'destiny claim not forbidden');
requireValue(translation.publicMutationAuthorized === false, 'translation boundary authorizes public mutation');

requireValue(bridge.globalOrientationAuthority === 'COMPASS', 'bridge displaced Compass');
requireValue(bridge.presentationIdentityIsScientificIdentity === false, 'presentation identity collapsed into scientific identity');
requireValue(bridge.requiredLaterConstructionRelation === 'G=f(T(X(C,P)))', 'governing construction relation drift');
requireValue(bridge.prohibitedConstructionRelation === 'G=f(P)', 'prohibited construction relation drift');
requireValue(bridge.requiredBeforeSpatialTopologyFreeze?.includes('CANONICAL_IDENTITY_DELIVERY_CROSSWALK'), 'crosswalk precondition missing');
requireValue(bridge.requiredBeforeSpatialTopologyFreeze?.includes('TYPED_SEMANTIC_RELATION_GRAPH'), 'typed graph precondition missing');
requireValue(bridge.spatialTopologyFreezeAuthorized === false, 'topology freeze unexpectedly authorized');
requireValue(bridge.pr541Disposition === 'PRESERVE_AND_ADAPT', 'PR541 disposition drift');
requireValue(bridge.pr541MutationAuthorized === false, 'PR541 mutation unexpectedly authorized');
requireValue(bridge.publicMutationAuthorized === false, 'bridge obligations authorize public mutation');

const sourceById = new Map(sources.sources.map(x => [x.id, x]));
requireValue(sourceById.get('CP1_MERGED_BASELINE')?.identity === 'c73a4f8854b8b2bf8f7b12fa860f0bc85d666544', 'source ledger CP1 identity drift');
requireValue(sourceById.get('ISSUE_716_AUDIT_ACCEPTANCE')?.commentId === 5212277475, 'issue 716 acceptance source missing');
requireValue(sourceById.get('ISSUE_716_FINAL_ROLE_REFINEMENT')?.commentId === 5212699057, 'issue 716 refinement source missing');
requireValue(sourceById.get('ISSUE_705_CP2_NARRATIVE_INTAKE')?.commentId === 5212701089, 'issue 705 CP2 intake source missing');
requireValue(sourceById.get('IMI_UCIC_TEMPORAL_COLLAPSE_PAGE_READY_RECORD')?.head === '5664ba8e059a65f1b7ec39f2c7e944866c06278b', 'scientific source head missing');
requireValue(sources.unmergedScientificSourceMayBePromotedToGoverningAuthority === false, 'unmerged science allowed to become governing authority');
requireValue(sources.publicMutationAuthorized === false, 'source ledger authorizes public mutation');

console.log('PASS_NARRATIVE_SPINE_CONSTITUTION_v1');