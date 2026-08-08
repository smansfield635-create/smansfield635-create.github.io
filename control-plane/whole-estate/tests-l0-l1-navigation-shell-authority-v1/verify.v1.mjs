import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const authority = read('authority-contract.v1.json');
const ledger = read('source-authority-ledger.v1.json');
const registry = read('object-projection-registry-contract.v1.json');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(authority.schema === 'WHOLE_ESTATE_TESTS_L0_L1_NAVIGATION_SHELL_AUTHORITY_v1', 'authority schema');
assert(authority.authorityDiscipline.researchFirstLockedDeclaration === 'RESEARCH COMES F.I.R.S.T.', 'research-first lock');
assert(authority.authorityDiscipline.threadContextAuthority === 'PROHIBITED', 'thread context must be non-authority');
assert(authority.authorityDiscipline.speculativeContextInheritance === 'PROHIBITED', 'speculative inheritance must be prohibited');
assert(authority.authorityDiscipline.absenceOfCurrentAuthorityMeansPermissionToInherit === false, 'must fail closed on missing authority');
assert(JSON.stringify(authority.controllingArchitecture.testsProjections) === JSON.stringify(['METHODS','MODELS','EXPERIMENTS','EVIDENCE']), 'tests projections');
assert(JSON.stringify(authority.controllingArchitecture.eResearchRule) === JSON.stringify(['REFERENCE','STANDING','ROUTE']), 'research evidence projection rule');
assert(authority.controllingArchitecture.ambiguousEvidenceOwnershipPermitted === false, 'evidence authority ambiguity prohibited');
assert(authority.lawsChamberReconciliation.existingResearchMethodsModelsRouteRole === 'RESEARCH_CUSTODY_AND_REFERENCE_SURFACE', 'research route role');
assert(authority.lawsChamberReconciliation.testsMethodsSelectorRole === 'OPERATIONAL_PROJECTION_CONTROL', 'tests Methods selector role');
assert(authority.lawsChamberReconciliation.publicRouteRelocationAuthorized === false, 'public route relocation prohibited');
assert(authority.preservationLaw.m1r2Classification === 'VALID_DEEP_PROCEDURAL_INSTRUMENT', 'M1R2 classification');
assert(authority.preservationLaw.m1r2NotClassification === 'THE_METHODS_MODELS_PAGE', 'M1R2 non-classification');
assert(authority.navigationOperations.FOCUS.assertsScientificRelation === false, 'FOCUS relation law');
assert(authority.navigationOperations.FOLLOW.requiresDeclaredRelationAuthority === true, 'FOLLOW authority law');
assert(authority.navigationOperations.ENTER.equivalentToFollow === false, 'FOLLOW/ENTER separation');
assert(authority.initialPopulationRule.registryBeforeVisualManifestation === true, 'registry before visuals');
assert(authority.visualCandidateAuthorizedBeforeRegistry === false, 'visuals withheld');
assert(authority.publicMutationAuthorized === false, 'public mutation prohibited');

assert(ledger.constructionBase === '45d8a7d3b642d99a4377110f63bca15d14c8b900', 'construction base');
assert(ledger.missingAuthorityRule === 'ABSENCE_OF_CURRENT_AUTHORITY_IS_NOT_PERMISSION_TO_INHERIT', 'ledger fail-closed law');
assert(ledger.explicitNonSources.includes('CHAT_THREAD_MEMORY'), 'thread memory must be explicit non-source');
assert(ledger.explicitNonSources.includes('PRIOR_PROTOTYPE_DEFAULTS'), 'prototype defaults must be explicit non-source');
assert(ledger.sources.some((s) => s.id === 'LAWS_CP6_1_AUTHORITY_MAP' && s.blob === '2d71a35533908b34e2c8ef988de4ce1bebfa0182'), 'laws source pinned');
assert(ledger.sources.some((s) => s.id === 'WHOLE_ESTATE_AUTHORITY_AND_OWNERSHIP_MATRIX' && s.blob === 'c24c86b89d0650dd597988d4b3148bec41304b4a'), 'estate authority pinned');
assert(ledger.sources.some((s) => s.id === 'METHODS_MODELS_ROLE_CONSTITUTION' && s.mergeCommit === 'b2533139bacbf876f818892a06c691824fa216dd'), 'Methods/Models constitution pinned');
const m1r2 = ledger.sources.find((s) => s.id === 'M1R2_DEEP_PROCEDURAL_INSTRUMENT');
assert(m1r2?.head === '6840cf0b99914263628e937453497e5af3f16166', 'M1R2 head pinned');
assert(m1r2?.candidateCommit === '7ab27d421233433b691ad34a7f79a904b08c7705', 'M1R2 candidate pinned');
assert(m1r2?.runtimeEvidenceCommit === '07dbb047414fb6c554645fa2db5f262c5d33ae05', 'M1R2 runtime evidence pinned');

assert(registry.requiredFields.includes('AUTHORITY_POINTER'), 'registry authority pointer required');
assert(registry.requiredFields.includes('RELATION_AUTHORITY_POINTERS'), 'relation authority pointers required');
assert(registry.evidenceAuthorityVocabulary.length === 2 && registry.evidenceAuthorityVocabulary.includes('RESEARCH_AUTHORITY') && registry.evidenceAuthorityVocabulary.includes('TEST_AUTHORITY'), 'evidence authority vocabulary');
assert(registry.researchAuthorityEvidenceRule.researchContentDuplicationPermitted === false, 'research duplication prohibited');
assert(registry.relationRules.spatialAdjacencyCreatesRelation === false, 'spatial adjacency non-semantic');
assert(registry.deepEntryRules.m1r2PermittedOnlyThroughAuthorityBackedParentMethodObject === true, 'M1R2 parent authority requirement');
assert(registry.initialManifestation.objectCountMinimum === 3 && registry.initialManifestation.objectCountMaximum === 5, 'initial population bound');
assert(registry.visualConstructionStatus === 'BLOCKED_UNTIL_REGISTRY_SCOPE_PASSES_AUTHORITY_REVIEW', 'visual construction stop');

console.log('PASS_TESTS_L0_L1_NAVIGATION_SHELL_AUTHORITY_v1');
