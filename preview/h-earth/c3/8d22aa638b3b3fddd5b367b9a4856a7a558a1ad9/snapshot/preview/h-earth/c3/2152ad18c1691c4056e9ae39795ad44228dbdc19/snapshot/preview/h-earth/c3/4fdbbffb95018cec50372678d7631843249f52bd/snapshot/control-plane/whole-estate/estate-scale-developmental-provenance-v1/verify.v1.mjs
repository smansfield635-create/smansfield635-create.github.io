import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CP4 = path.join(ROOT, 'control-plane/whole-estate/estate-scale-developmental-provenance-v1');
const CP1 = path.join(ROOT, 'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1');
const CP2 = path.join(ROOT, 'control-plane/whole-estate/narrative-spine-constitution-v1');
const CP3 = path.join(ROOT, 'control-plane/whole-estate/constitutional-room-relation-contracts-v1');

function fail(message) {
  console.error(`FAIL_ESTATE_SCALE_DEVELOPMENTAL_PROVENANCE_v1: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`cannot parse ${file}: ${error.message}`);
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail(`cannot read ${file}: ${error.message}`);
  }
}

function requireValue(condition, message) {
  if (!condition) fail(message);
}

const requiredFiles = [
  'README.md',
  'developmental-provenance-ledger.v1.json',
  'coherence-construction-constraint-contract.v1.json',
  'chronology-retrospection-boundary.v1.json',
  'evidence-construction-separation-contract.v1.json',
  'estate-provenance-obligations.v1.json',
  'developmental-claim-language-contract.v1.json',
  'source-ledger.v1.json'
];

for (const file of requiredFiles) {
  requireValue(fs.existsSync(path.join(CP4, file)), `missing CP4 artifact ${file}`);
}

const readme = readText(path.join(CP4, 'README.md'));
const ledger = readJson(path.join(CP4, 'developmental-provenance-ledger.v1.json'));
const construction = readJson(path.join(CP4, 'coherence-construction-constraint-contract.v1.json'));
const chronology = readJson(path.join(CP4, 'chronology-retrospection-boundary.v1.json'));
const separation = readJson(path.join(CP4, 'evidence-construction-separation-contract.v1.json'));
const obligations = readJson(path.join(CP4, 'estate-provenance-obligations.v1.json'));
const language = readJson(path.join(CP4, 'developmental-claim-language-contract.v1.json'));
const sources = readJson(path.join(CP4, 'source-ledger.v1.json'));

const cp1Register = readJson(path.join(CP1, 'prospective-change-register.v1.json'));
const cp1Provenance = readJson(path.join(CP1, 'provenance-ledger.v1.json'));
const cp2Delta = readJson(path.join(CP2, 'scientific-delta-reconciliation.v1.json'));
const cp3Rooms = readJson(path.join(CP3, 'constitutional-room-contracts.v1.json'));

requireValue(readme.includes('ESTATE_SCALE_DEVELOPMENTAL_PROVENANCE_v1'), 'README operation mismatch');
requireValue(readme.includes('DEVELOPMENTAL_CONCORDANCE != SCIENTIFIC_VALIDATION'), 'README missing developmental/scientific separation');
requireValue(readme.includes('CHECKPOINT_5_EXECUTION = NOT_STARTED'), 'README crosses Checkpoint 5 boundary');

const cp4Registration = cp1Register.entries.find((entry) => entry.checkpoint === 4);
requireValue(cp4Registration, 'CP1 does not contain Checkpoint 4 registration');
requireValue(cp4Registration.id === 'ESTATE_SCALE_DEVELOPMENTAL_PROVENANCE_v1', 'Checkpoint 4 registered identity mismatch');
requireValue(cp4Registration.intendedIntervention === 'explain bounded evidence for coherence as a construction constraint across the estate', 'Checkpoint 4 intervention drift');
for (const capacity of ['EVIDENCE_CLASSIFICATION', 'RETROSPECTIVE_LIMITS', 'ROOM_IDENTITY']) {
  requireValue(cp4Registration.preservedCapacities.includes(capacity), `missing preserved capacity ${capacity}`);
}
requireValue(cp4Registration.falsifiers.includes('retrospective interpretation presented as preregistration'), 'registered retrospective falsifier missing');
requireValue(cp4Registration.falsifiers.includes('construction presented as proof of UCIC'), 'registered UCIC-proof falsifier missing');
requireValue(cp4Registration.publicMutationAuthorized === false, 'CP1 unexpectedly authorizes public mutation');

const expectedEvidenceClasses = ['STRONG_CONTEMPORANEOUS', 'PARTIAL_CONTEMPORANEOUS', 'RETROSPECTIVE_INTERPRETATION'];
for (const evidenceClass of expectedEvidenceClasses) {
  requireValue(cp1Provenance.evidenceClasses.includes(evidenceClass), `CP1 evidence class missing ${evidenceClass}`);
  requireValue(ledger.evidenceClasses.includes(evidenceClass), `CP4 failed to preserve evidence class ${evidenceClass}`);
}

for (const prohibition of [
  'RETROSPECTIVE_INTERPRETATION_MAY_NOT_BE_PRESENTED_AS_PREREGISTERED_PREDICTION',
  'CONSTRUCTION_PROVENANCE_MAY_NOT_BE_PRESENTED_AS_UCIC_VALIDATION',
  'CI_OR_HASH_PROVENANCE_MAY_NOT_BE_PRESENTED_AS_SCIENTIFIC_TRUTH'
]) {
  requireValue(cp1Provenance.prohibitions.includes(prohibition), `CP1 provenance prohibition missing ${prohibition}`);
}

requireValue(ledger.developmentalClaimCeiling === 'ESTATE_SCALE_DEVELOPMENTAL_CONCORDANCE_AND_CONSTRUCTION_LINEAGE_ONLY', 'developmental claim ceiling drift');
requireValue(ledger.entries.some((entry) => entry.id === 'WHOLE_ESTATE_BUILT_THROUGH_COHERENCE' && entry.evidenceClass === 'PARTIAL_CONTEMPORANEOUS'), 'whole-estate coherence entry must remain partial contemporaneous');
requireValue(ledger.entries.some((entry) => entry.id === 'RETROSPECTIVE_ESTATE_COHERENCE_INTERPRETATION' && entry.evidenceClass === 'RETROSPECTIVE_INTERPRETATION'), 'retrospective coherence interpretation class drift');

requireValue(construction.scientificStandingCreated === false, 'construction contract creates scientific standing');
requireValue(construction.preregistrationCreated === false, 'construction contract creates preregistration');
requireValue(construction.prospectiveConfirmationCreated === false, 'construction contract creates prospective confirmation');
requireValue(construction.ucicValidationCreated === false, 'construction contract creates UCIC validation');
requireValue(construction.scientificClaimUpgradeAuthorized === false, 'construction contract authorizes scientific upgrade');
requireValue(construction.falsifiers.includes('RETROSPECTIVE_INTERPRETATION_PRESENTED_AS_PREREGISTRATION'), 'CP4 missing retrospective falsifier');
requireValue(construction.falsifiers.includes('CONSTRUCTION_PRESENTED_AS_PROOF_OF_UCIC'), 'CP4 missing construction-as-proof falsifier');

const chronologyOrders = chronology.chronology.map((entry) => entry.order);
requireValue(new Set(chronologyOrders).size === chronologyOrders.length, 'chronology has duplicate order');
requireValue(chronology.chronology.some((entry) => entry.id === 'CHECKPOINT_4_DEVELOPMENTAL_INTERPRETATION' && entry.temporalState === 'RETROSPECTIVE_INTERPRETATION'), 'Checkpoint 4 synthesis must be retrospective interpretation');
requireValue(chronology.rules.includes('RETROSPECTIVE_INTERPRETATION_MAY_NOT_BE_RELABELED_AS_CONTEMPORANEOUS'), 'chronology allows retrospective relabeling');
requireValue(chronology.rules.includes('ADVERSE_RESULT_MUST_REMAIN_ADVERSE_AFTER_LATER_INTERPRETATION'), 'chronology does not preserve adverse result');

requireValue(separation.currentScientificRecord.overall === 'MIXED_NONCOMPENSATING_RESULT', 'mixed scientific state not preserved');
requireValue(separation.currentScientificRecord.fdicGeneralization === 'FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED', 'FDIC adverse disposition not preserved');
requireValue(separation.currentScientificRecord.fdicUcicFalsePositiveRate === 1, 'FDIC UCIC false-positive rate drift');
requireValue(separation.currentScientificRecord.fdicUcicDiscriminationMargin === 0, 'FDIC UCIC discrimination margin drift');
requireValue(separation.currentScientificRecord.constructionMayAlterTheseDispositions === false, 'construction may alter scientific disposition');
requireValue(separation.bidirectionalBoundary.scienceMayBeValidatedByEstateConcordance === false, 'estate concordance can validate science');
requireValue(separation.bidirectionalBoundary.earlierIntentMayBeProvenByLaterScientificResults === false, 'later science can back-prove earlier intent');

const fdicDelta = cp2Delta.developments.find((entry) => entry.deltaId === 'FDIC_LONGITUDINAL_GENERALIZATION');
requireValue(fdicDelta?.disposition === 'FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED', 'CP2 FDIC source disposition drift');
requireValue(fdicDelta?.adverseEvidence?.ucicFalsePositiveRate === 1, 'CP2 FDIC source FPR drift');
requireValue(cp2Delta.terminalConstitutionalDisposition.scientificClaimUpgradeAuthorized === false, 'CP2 unexpectedly authorizes scientific upgrade');

const roomIds = new Set(cp3Rooms.contracts.map((room) => room.id));
for (const obligation of obligations.obligations) {
  requireValue(roomIds.has(obligation.room), `provenance obligation references unknown room ${obligation.room}`);
}
requireValue(obligations.roomIdentityPreserved === true, 'room identity not preserved');
requireValue(obligations.obligations.length === cp3Rooms.contracts.length, 'provenance obligations do not cover every CP3 room');

const provenanceRoom = cp3Rooms.contracts.find((room) => room.id === 'RESEARCH_PROVENANCE');
requireValue(provenanceRoom?.forbiddenAuthority?.includes('SCIENTIFIC_TRUTH_BY_HASH'), 'Research Provenance hash boundary missing');
requireValue(provenanceRoom?.nonSubstitution?.includes('PROVENANCE_CANNOT_SUBSTITUTE_FOR_TRUTH'), 'Research Provenance truth non-substitution missing');
const productRoom = cp3Rooms.contracts.find((room) => room.id === 'PRODUCTS');
requireValue(productRoom?.nonSubstitution?.includes('IMPLEMENTATION_SUCCESS_CANNOT_SUBSTITUTE_FOR_EVIDENCE'), 'Products implementation/evidence boundary missing');
const narrativeRoom = cp3Rooms.contracts.find((room) => room.id === 'WORLDS_CHARACTERS_CAMPAIGNS');
requireValue(narrativeRoom?.nonSubstitution?.includes('NARRATIVE_CANNOT_SUBSTITUTE_FOR_EVIDENCE'), 'Narrative/evidence boundary missing');

requireValue(language.estateScaleRequiredQualifier.includes('not proof'), 'estate-scale claim language lacks proof boundary');
requireValue(language.metaphorMayCarryScientificStanding === false, 'metaphor may carry scientific standing');
requireValue(language.permittedStatements.some((entry) => entry.class === 'RETROSPECTIVE_INTERPRETATION'), 'claim language does not preserve retrospective class');

requireValue(sources.governingMain === 'a0b0fb3d753637cfc66c06e73b0b5f0cd237056a', 'source ledger governing main drift');
requireValue(sources.governingTree === 'a79ddd661cf0e8329a90c98daf00bcc0ccdd2b5d', 'source ledger governing tree drift');
requireValue(sources.unmergedScientificSourceMayBePromotedToGoverningAuthority === false, 'unmerged scientific source may become governing authority');
requireValue(sources.developmentalProvenanceMayUpgradeScientificStanding === false, 'developmental provenance may upgrade science');

for (const artifact of [ledger, construction, chronology, separation, obligations, language, sources]) {
  requireValue(artifact.status === 'CHECKPOINT_4_CONSTRUCTION_CANDIDATE', `status drift in ${artifact.schema}`);
  requireValue(artifact.publicMutationAuthorized === false, `public mutation authorized in ${artifact.schema}`);
}

console.log('PASS_ESTATE_SCALE_DEVELOPMENTAL_PROVENANCE_v1');
