#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(dir, '../../..');
const readText = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
const localJson = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const gitBlobSha = (text) => createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');

const registry = localJson('object-projection-registry.v1.json');
const admission = localJson('source-admission-ledger.v1.json');

const authorityPath = 'control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/authority-contract.v1.json';
const contractPath = 'control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/object-projection-registry-contract.v1.json';
const shellLedgerPath = 'control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/source-authority-ledger.v1.json';
const hierarchyPath = 'control-plane/methods-information-benchmark/imi-methods-models-universal-integration-v1/canonical-hierarchy.v1.json';
const baselinePath = 'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/baseline-identities.v1.json';

const authorityText = readText(authorityPath);
const contractText = readText(contractPath);
const shellLedgerText = readText(shellLedgerPath);
const hierarchyText = readText(hierarchyPath);
const baselineText = readText(baselinePath);
const authority = JSON.parse(authorityText);
const contract = JSON.parse(contractText);
const shellLedger = JSON.parse(shellLedgerText);
const hierarchy = JSON.parse(hierarchyText);
const baseline = JSON.parse(baselineText);

assert(gitBlobSha(authorityText) === '0bfab791c005ca71cee771a5d14d27f8dfab3177', 'authority contract blob drift');
assert(gitBlobSha(contractText) === 'ed969c87359c42444c477a752f332f07f0059a30', 'registry contract blob drift');
assert(gitBlobSha(shellLedgerText) === 'fe37b67fe3faf0d62b969ec3860c2d083e2e8185', 'promoted shell source ledger blob drift');
assert(gitBlobSha(hierarchyText) === 'c2d7383ff6377cdbe6b31710011db1d4287e49e4', 'Gate0 hierarchy blob drift');
assert(gitBlobSha(baselineText) === 'b86cc4094901989fdd2b3a3f13e65c5d50b73005', 'whole-estate baseline identity blob drift');

assert(authority.immediateNextExecutableObject === 'AUTHORITY_BACKED_OBJECT_PROJECTION_REGISTRY', 'registry not next authorized object');
assert(authority.visualCandidateAuthorizedBeforeRegistry === false, 'visual construction must remain blocked');
assert(authority.publicMutationAuthorized === false, 'public mutation must remain blocked');
assert(authority.graphicalGrammar.L0ControlsAreScientificObjects === false, 'L0 controls cannot become scientific objects');
assert(authority.nonSemanticSpatialityLaw.includes('SELECTOR_MEMBERSHIP_DOES_NOT_CREATE_ONTOLOGY'), 'projection/ontology separation missing');
assert(authority.preservationLaw.m1r2Classification === 'VALID_DEEP_PROCEDURAL_INSTRUMENT', 'M1R2 classification drift');

assert(contract.schema === 'WHOLE_ESTATE_TESTS_OBJECT_PROJECTION_REGISTRY_CONTRACT_v1', 'registry contract schema');
assert(contract.populationStatus === 'NOT_STARTED', 'governing pre-registry population status drift');
assert(contract.initialManifestation.projectionCount === 1, 'projection count authority');
assert(contract.initialManifestation.objectCountMinimum === 3 && contract.initialManifestation.objectCountMaximum === 5, 'object-count authority');
assert(contract.initialManifestation.placeholderObjectsPermitted === false, 'placeholders prohibited');
assert(contract.relationRules.declaredRelationRequiresAuthorityPointer === true, 'relation authority pointer required');
assert(contract.deepEntryRules.m1r2PermittedOnlyThroughAuthorityBackedParentMethodObject === true, 'M1R2 parent rule');

const semanticSource = shellLedger.sources.find((s) => s.id === 'METHODS_SEMANTIC_TOPOLOGY_TERMINAL_RECEIPT');
assert(semanticSource?.scope === 'PRESERVATION_AND_CONSTRAINT_ONLY_NOT_TESTS_SHELL_POPULATION_AUTHORITY', 'semantic topology population prohibition drift');
assert(shellLedger.missingAuthorityRule === 'ABSENCE_OF_CURRENT_AUTHORITY_IS_NOT_PERMISSION_TO_INHERIT', 'missing authority law');
assert(shellLedger.explicitNonSources.includes('CHAT_THREAD_MEMORY'), 'thread memory non-source');
assert(shellLedger.explicitNonSources.includes('PRIOR_PROTOTYPE_DEFAULTS'), 'prototype non-source');

assert(baseline.governingBaseline.gate0Pr === 708, 'Gate0 PR pin');
assert(baseline.governingBaseline.gate0Merge === 'fb2d34cb3c187fc5d6526c6108b383fca4ed0801', 'Gate0 merge pin');
assert(baseline.governingBaseline.gate0PostMergeWorkflowConclusion === 'SUCCESS', 'Gate0 post-merge disposition');
assert(baseline.gate0PackageBlobs['canonical-hierarchy.v1.json'] === 'c2d7383ff6377cdbe6b31710011db1d4287e49e4', 'Gate0 hierarchy baseline pin');

assert(admission.schema === 'WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_SOURCE_ADMISSION_LEDGER_v1', 'admission schema');
assert(admission.constructionBaseMain === '21e1115557ce37507b9b01f4d45d5a6173714637', 'construction base');
assert(admission.testsAuthorityPromotion.pr === 759, 'Tests authority PR pin');
assert(admission.testsAuthorityPromotion.authorizedCandidate === '8097f84b98fcf0c9784bad18ed23320d104c831c', 'Tests authority candidate pin');
assert(admission.testsAuthorityPromotion.mergeCommit === '21e1115557ce37507b9b01f4d45d5a6173714637', 'Tests authority merge pin');
assert(admission.populationSourceAdmission.disposition === 'ADMITTED_EXISTING_MERGED_AUTHORITY_FOR_BOUNDED_TESTS_POPULATION', 'Gate0 source admission disposition');
assert(admission.populationSourceAdmission.authorityExpansion === false, 'source admission cannot expand authority');
assert(admission.populationSourceAdmission.scientificClaimUpgrade === false, 'source admission cannot upgrade science');
assert(admission.populationSourceAdmission.gate0.pr === 708, 'admitted Gate0 PR');
assert(admission.populationSourceAdmission.gate0.candidate === '3e26cc4e49bf2c2291a7a5db4093e8a31f5a54f4', 'admitted Gate0 candidate');
assert(admission.populationSourceAdmission.gate0.mergeCommit === 'fb2d34cb3c187fc5d6526c6108b383fca4ed0801', 'admitted Gate0 merge');
assert(admission.populationSourceAdmission.gate0.blobAtConstructionBase === 'c2d7383ff6377cdbe6b31710011db1d4287e49e4', 'admitted Gate0 hierarchy blob');
assert(admission.sourceAdmissionLaw.presenceOnMainAloneIsAuthority === false, 'presence-on-main cannot imply authority');
assert(admission.sourceAdmissionLaw.historicalFileStatusAloneDeterminesAuthority === false, 'file status cannot determine current authority');
assert(admission.publicMutationAuthorized === false && admission.visualConstructionAuthorizedByThisLedger === false, 'admission boundary');

assert(registry.schema === 'WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1', 'registry schema');
assert(registry.status === 'BOUNDED_REGISTRY_CONSTRUCTION_CANDIDATE', 'registry status');
assert(registry.constructionBaseMain === '21e1115557ce37507b9b01f4d45d5a6173714637', 'registry construction base');
assert(registry.projectionSelection.PROJECTION === 'METHODS', 'initial projection must be METHODS');
assert(registry.projectionSelection.projectionCount === 1, 'exactly one projection');
assert(registry.projectionSelection.objectCount === 3, 'exactly three initial objects');
assert(registry.objects.length === 3, 'registry object cardinality');
assert(registry.projectionSelection.corpusCompletenessClaim === false, 'no corpus-completeness claim');
assert(registry.projectionSelection.projectionMembershipCreatesOntology === false, 'projection membership cannot create ontology');

const required = contract.requiredFields;
for (const object of registry.objects) {
  for (const field of required) assert(Object.hasOwn(object, field), `missing required field ${field} on ${object.OBJECT_ID}`);
  assert(object.PROJECTION === 'METHODS', `projection drift ${object.OBJECT_ID}`);
  assert(object.AUTHORITY_SOURCE === 'GATE0_CANONICAL_HIERARCHY', `authority source drift ${object.OBJECT_ID}`);
  assert(object.INSPECTION_AVAILABLE === true, `inspection unavailable ${object.OBJECT_ID}`);
  assert(object.DEEP_ENTRY_AVAILABLE === false && object.DEEP_ENTRY_TARGET === null, `unauthorized deep entry ${object.OBJECT_ID}`);
}

const expectedObjects = new Map([
  ['METHODS', {class:'METHOD', label:'Scientific procedure', statement:'scientific procedure'}],
  ['ROUTE_OPERATOR_PLATFORM', {class:'METHOD', label:'Protocol and execution infrastructure', statement:'protocol and execution infrastructure'}],
  ['PROSPECTIVE_FINAL_REPORT_PORTFOLIO', {class:'TEST_INSTANCE', label:'Five-domain severe-test instance', statement:'active severe-test instance'}]
]);
assert(new Set(registry.objects.map((o) => o.OBJECT_ID)).size === 3, 'duplicate object IDs');
for (const object of registry.objects) {
  const expected = expectedObjects.get(object.OBJECT_ID);
  assert(expected, `unexpected object ${object.OBJECT_ID}`);
  assert(object.OBJECT_CLASS === expected.class, `class drift ${object.OBJECT_ID}`);
  assert(object.DISPLAY_LABEL === expected.label, `display label drift ${object.OBJECT_ID}`);
  assert(object.CURRENT_STANDING.CANONICAL_STATEMENT === expected.statement, `canonical standing drift ${object.OBJECT_ID}`);
  assert(object.CURRENT_STANDING.AUTHORITY_STANDING === 'ADMITTED_EXISTING_MERGED_GATE0_AUTHORITY', `authority standing drift ${object.OBJECT_ID}`);
  assert(object.CURRENT_STANDING.SOURCE_DOCUMENT_STATUS === hierarchy.status, `source status not preserved ${object.OBJECT_ID}`);
  const sourceNode = hierarchy.nodes.find((n) => n.id === object.OBJECT_ID);
  assert(sourceNode, `source node missing ${object.OBJECT_ID}`);
  assert(sourceNode.class === object.OBJECT_CLASS, `source class mismatch ${object.OBJECT_ID}`);
  assert(sourceNode.label === object.DISPLAY_LABEL, `source label mismatch ${object.OBJECT_ID}`);
  assert(hierarchy.canonicalStatements[object.OBJECT_ID] === object.CURRENT_STANDING.CANONICAL_STATEMENT, `source statement mismatch ${object.OBJECT_ID}`);
}
assert(expectedObjects.get('PROSPECTIVE_FINAL_REPORT_PORTFOLIO').class === 'TEST_INSTANCE', 'test instance must remain test instance');

const expectedRelations = [
  ['METHODS','GOVERNS_PROCEDURE_FOR','PROSPECTIVE_FINAL_REPORT_PORTFOLIO'],
  ['ROUTE_OPERATOR_PLATFORM','EXECUTES','PROSPECTIVE_FINAL_REPORT_PORTFOLIO']
];
assert(registry.relations.length === 2, 'relation cardinality');
const selected = new Set(registry.objects.map((o) => o.OBJECT_ID));
for (const [from, relation, to] of expectedRelations) {
  const sourceEdge = hierarchy.edges.find((e) => e.from === from && e.relation === relation && e.to === to);
  assert(sourceEdge, `source relation missing ${from}:${relation}:${to}`);
  const registered = registry.relations.find((e) => e.SOURCE_OBJECT === from && e.RELATION === relation && e.TARGET_OBJECT === to);
  assert(registered, `registered relation missing ${from}:${relation}:${to}`);
  assert(selected.has(from) && selected.has(to), `relation endpoint outside bounded population ${from}:${to}`);
  assert(registered.AUTHORITY_SOURCE === 'GATE0_CANONICAL_HIERARCHY', `relation authority source drift ${registered.RELATION_ID}`);
  assert(registered.AUTHORITY_POINTER?.blobAtConstructionBase === 'c2d7383ff6377cdbe6b31710011db1d4287e49e4', `relation authority blob drift ${registered.RELATION_ID}`);
}
for (const relation of registry.relations) {
  assert(expectedRelations.some(([f,r,t]) => f === relation.SOURCE_OBJECT && r === relation.RELATION && t === relation.TARGET_OBJECT), `unexpected relation ${relation.RELATION_ID}`);
}

const relationIds = new Set(registry.relations.map((r) => r.RELATION_ID));
for (const object of registry.objects) {
  for (const id of object.DECLARED_RELATIONS) {
    assert(relationIds.has(id), `object references unknown relation ${object.OBJECT_ID}:${id}`);
    assert(object.RELATION_AUTHORITY_POINTERS[id], `missing relation pointer ${object.OBJECT_ID}:${id}`);
  }
}
const portfolio = registry.objects.find((o) => o.OBJECT_ID === 'PROSPECTIVE_FINAL_REPORT_PORTFOLIO');
assert(portfolio.OBJECT_CLASS === 'TEST_INSTANCE', 'projection illegally reclassified test instance');
assert(portfolio.PROJECTION_JUSTIFICATION.includes('DOES_NOT_RECLASSIFY_TEST_INSTANCE'), 'cross-class projection justification missing');

assert(registry.deepEntryBoundary.status === 'WITHHELD_DEEP_ENTRY_AUTHORITY_UNRESOLVED_FOR_SELECTED_PARENT_BINDING', 'deep entry must fail closed');
assert(registry.deepEntryBoundary.m1r2Classification === 'VALID_DEEP_PROCEDURAL_INSTRUMENT', 'M1R2 bounded classification');
assert(registry.deepEntryBoundary.inferenceFromLabelSimilarity === false, 'label inference prohibited');
assert(registry.deepEntryBoundary.inferenceFromPriorManifestation === false, 'manifestation inheritance prohibited');
assert(registry.populationBoundary.placeholderObjects === 0, 'placeholder object');
assert(registry.populationBoundary.inventedObjects === 0, 'invented object');
assert(registry.populationBoundary.inventedRelations === 0, 'invented relation');
assert(registry.populationBoundary.researchContentCopied === false, 'research content duplication');
assert(registry.populationBoundary.legacyResearchManifestUsed === false, 'legacy research manifest use');
assert(registry.populationBoundary.semanticTopologyPreservationSourceUsedAsPopulationAuthority === false, 'semantic preservation source used as population authority');
assert(registry.visualConstructionStatus === 'BLOCKED_PENDING_REGISTRY_AUTHORITY_REVIEW_AND_PROMOTION', 'visual construction must remain blocked');
assert(registry.publicMutationAuthorized === false, 'public mutation prohibited');
assert(registry.scientificClaimUpgrade === false, 'scientific claim upgrade prohibited');

console.log(JSON.stringify({
  schema:'WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_VERIFICATION_RECEIPT_v1',
  result:'PASS_BOUNDED_OBJECT_PROJECTION_REGISTRY_CONSTRUCTION',
  projection:'METHODS',
  objectCount:registry.objects.length,
  relationCount:registry.relations.length,
  populationSource:'GATE0_CANONICAL_HIERARCHY',
  gate0Merge:'fb2d34cb3c187fc5d6526c6108b383fca4ed0801',
  deepEntry:'WITHHELD',
  visualConstruction:'BLOCKED',
  publicMutation:false,
  scientificClaimUpgrade:false
}, null, 2));
