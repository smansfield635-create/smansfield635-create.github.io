#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(ROOT, '../../../..');
const BASE = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const BASE_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const PACKAGE_PREFIX = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f1-construction-baseline/';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f1-verify.yml';

const read = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));
const fail = (msg) => { throw new Error(`F1_VERIFY_FAIL:${msg}`); };
const ok = (value, msg) => { if (!value) fail(msg); };
const eq = (actual, expected, msg) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${msg}: expected=${JSON.stringify(expected)} observed=${JSON.stringify(actual)}`);
  }
};
const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim();
const blobAt = (ref, p) => git('rev-parse', `${ref}:${p}`);
const remoteHead = (branch) => {
  const out = git('ls-remote', 'origin', `refs/heads/${branch}`);
  if (!out) fail(`missing_remote_branch:${branch}`);
  return out.split(/\s+/)[0];
};

const required = [
  'README.md',
  'governing-baseline.v1.json',
  'checkpoint-authority-ledger.v1.json',
  'scientific-source-and-claim-ledger.v1.json',
  'public-and-runtime-baseline.v1.json',
  'protected-boundary-and-lineage.v1.json',
  'gate-advancement-contract.v1.json',
  'f1-terminal-receipt.v1.json',
  'verify.v1.mjs'
];
for (const f of required) ok(fs.existsSync(path.join(ROOT, f)), `missing_f1_file:${f}`);

const governing = read('governing-baseline.v1.json');
const checkpoints = read('checkpoint-authority-ledger.v1.json');
const science = read('scientific-source-and-claim-ledger.v1.json');
const runtime = read('public-and-runtime-baseline.v1.json');
const boundary = read('protected-boundary-and-lineage.v1.json');
const gates = read('gate-advancement-contract.v1.json');
const receipt = read('f1-terminal-receipt.v1.json');

// Exact Final Program identity and F1-only authority.
eq(governing.program, 'METHODS_MODELS_INTEGRATED_ENVIRONMENT_CONSTRUCTION_v1', 'program');
eq(governing.preservedTarget, 'TEXT_FIRST_STATEFUL_METHODS_MODELS_ENVIRONMENT_v1', 'preserved_target');
eq(governing.gate, 'F1_CONSTRUCTION_BASELINE', 'gate');
eq(governing.governingMain, BASE, 'governing_main');
eq(governing.governingTree, BASE_TREE, 'governing_tree');
eq(governing.branch, 'construction/methods-models-integrated-environment-v1', 'program_branch');
ok(governing.checkpoint7.status === 'PASS_CLOSED', 'cp7_not_pass_closed');
eq(governing.checkpoint7.postMergeRepositoryCertificationRun, 31203029188, 'cp7_postmerge_cert');
eq(governing.finalProgramAuthority.activationComment, 5220220972, 'f1_activation_comment');
ok(governing.finalProgramAuthority.f1MayBegin === true, 'f1_not_authorized');
ok(governing.finalProgramAuthority.f2ConstructionAuthorityAtInput === false, 'f2_premature_authority');
ok(governing.publicMutationAuthorized === false, 'public_mutation_authorized');
ok(governing.scientificClaimUpgradeAuthorized === false, 'claim_upgrade_authorized');

// Governing main and branch ancestry must remain exact during verification.
eq(remoteHead('main'), BASE, 'main_drift');
eq(git('rev-parse', `${BASE}^{tree}`), BASE_TREE, 'base_tree');
try { git('merge-base', '--is-ancestor', BASE, 'HEAD'); } catch { fail('candidate_not_descended_from_frozen_base'); }

// Only the F1 package and temporary verifier workflow may differ from frozen main.
const changed = git('diff', '--name-only', `${BASE}...HEAD`).split('\n').filter(Boolean);
ok(changed.length >= required.length, 'unexpectedly_small_f1_delta');
for (const p of changed) {
  ok(p.startsWith(PACKAGE_PREFIX) || p === TEMP_WORKFLOW, `unauthorized_changed_path:${p}`);
}
for (const p of changed) {
  ok(!p.startsWith('laws/'), `public_laws_mutation:${p}`);
  ok(!p.startsWith('verification/methods-categorical-spatial-context-equation-embodiment-v1/'), `pr541_path_mutation:${p}`);
  ok(p !== '.github/ai-router/router.v1.json', 'router_mutation');
  ok(p !== '.github/ai-router/projects/methods-information-benchmark/entrypoint.v1.json', 'methods_entrypoint_mutation');
}

// CP1-CP7 must be a complete closed authority chain.
eq(checkpoints.checkpoints.length, 7, 'checkpoint_count');
for (let i = 0; i < 7; i++) {
  eq(checkpoints.checkpoints[i].checkpoint, i + 1, `checkpoint_order_${i + 1}`);
  eq(checkpoints.checkpoints[i].disposition, 'PASS_CLOSED', `checkpoint_disposition_${i + 1}`);
}
eq(checkpoints.checkpoints[0].mergeCommit, 'c73a4f8854b8b2bf8f7b12fa860f0bc85d666544', 'cp1_merge');
eq(checkpoints.checkpoints[1].mergeCommit, '889197b2cbe73de171756b7545446f12a726cde7', 'cp2_merge');
eq(checkpoints.checkpoints[2].mergeCommit, 'a0b0fb3d753637cfc66c06e73b0b5f0cd237056a', 'cp3_merge');
eq(checkpoints.checkpoints[3].mergeCommit, '8983b36233e55700614435cd17cc7139cc920336', 'cp4_merge');
eq(checkpoints.checkpoints[4].mergeCommit, 'b2533139bacbf876f818892a06c691824fa216dd', 'cp5_merge');
eq(checkpoints.checkpoints[5].mergeCommit, 'aaa8d55f20198f1ef508c5eb64f76ddb8477db30', 'cp6_merge');
eq(checkpoints.checkpoints[6].mergeCommit, BASE, 'cp7_merge');

const authorityBlobs = {
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/baseline-identities.v1.json': 'b86cc4094901989fdd2b3a3f13e65c5d50b73005',
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/prospective-change-register.v1.json': 'e817cb14eb736de002c9be6d630951ea65c5c271',
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/provenance-ledger.v1.json': '9b7e38bb690841ebbd15783b40bf3ecf38f06178',
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/authority-and-ownership-matrix.v1.json': 'c24c86b89d0650dd597988d4b3148bec41304b4a',
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/claim-boundary-matrix.v1.json': '796facd21cb0d5472f6a4556da345538fabd74e1',
  'control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/narrative-journey-map.v1.json': '439d3f519534f782e47f81cc996f32cbba0868ad',
  'control-plane/whole-estate/narrative-spine-constitution-v1/source-ledger.v1.json': '517a3a2a600ad6c86ca8d0965e27763518629aca',
  'control-plane/whole-estate/constitutional-room-relation-contracts-v1/source-ledger.v1.json': 'c96a4d9f6c5a660d71b01dc39de260a3a2fa4cef',
  'control-plane/whole-estate/estate-scale-developmental-provenance-v1/source-ledger.v1.json': '3c9a2961c442e6677c52436960c4baaca03d34d9',
  'control-plane/whole-estate/methods-models-role-constitution-v1/source-ledger.v1.json': '720654e32e733ea7eadac0cca4330bfbd39c2496',
  'control-plane/whole-estate/invariant-contract-package-v1/source-ledger.v1.json': '9a26b1c6bb3c508e7851831064c79d4ebc588daf',
  'control-plane/whole-estate/invariant-contract-package-v1/scientific-delta-ingress-contract.v1.json': '07cf244827ad22e278f49dc415f046abe5c12cae',
  'control-plane/whole-estate/first-safe-vertical-case-selection-v1/source-ledger.v1.json': '2f8ad4e2218d075c94bf78660bb08d4b551cd45a',
  'control-plane/whole-estate/first-safe-vertical-case-selection-v1/final-checkpoint-handoff-contract.v1.json': 'fbb8f79a5bf6b2118dcb44caa9bb9c68f0d76da7'
};
for (const [p, sha] of Object.entries(authorityBlobs)) eq(blobAt(BASE, p), sha, `authority_blob:${p}`);

// Gate 0 scientific normalization remains exact and separated from interface state.
for (const [name, sha] of Object.entries(science.mergedScientificNormalization.blobs)) {
  const p = `control-plane/methods-information-benchmark/imi-methods-models-universal-integration-v1/${name}`;
  eq(blobAt(BASE, p), sha, `gate0_blob:${name}`);
}
eq(science.mergedScientificNormalization.globalMultiplicativeProduct, 'REJECTED_AS_GOVERNING_MODEL', 'global_product_boundary');
eq(science.mergedScientificNormalization.pressureCapacity, 'BOUNDED_SUPPORTING_MODEL_ONLY', 'pressure_capacity_boundary');
ok(science.scientificClaimUpgradeAuthorized === false, 'science_ledger_claim_upgrade');

// Current selected case and corrected hurricane standing must be frozen exactly.
eq(science.selectedVerticalCase.caseId, 'BIO_LAB', 'selected_case');
eq(science.selectedVerticalCase.sourceHead, '54e0f3cf59cffab6a195c9c2ffe4f104185b5e81', 'biolab_source_head');
eq(science.selectedVerticalCase.evidenceCeiling, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY', 'biolab_ceiling');
eq(science.selectedVerticalCase.preservedCapacityStatus, 'UNEVALUABLE_FROM_SUMMARY_RECORD', 'biolab_preserved_capacity');
eq(science.hurricanePerspectiveResearch.currentFrozenTest, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'hurricane_current_standing');
eq(science.hurricanePerspectiveResearch.priorMetadataStanding, 'QUARANTINED_SUPERSEDED_BY_QC_CORRECTED_RAW_RESULT', 'hurricane_prior_quarantine');
eq(science.hurricanePerspectiveResearch.additiveStanding, 'POSITIVE_POINT_ESTIMATE_INCONCLUSIVE', 'hurricane_additive_standing');
eq(science.hurricanePerspectiveResearch.warningTime, 'NOT_TESTED', 'hurricane_warning_time');

const cp7Source = JSON.parse(fs.readFileSync(path.join(REPO, 'control-plane/whole-estate/first-safe-vertical-case-selection-v1/source-ledger.v1.json'), 'utf8'));
eq(cp7Source.hurricaneDeltaSources.terminalDisposition, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'cp7_hurricane_terminal');
eq(cp7Source.hurricaneDeltaSources.priorMetadataExecution.currentAdmission, 'QUARANTINED_SUPERSEDED_BY_QC_CORRECTED_RAW_RESULT', 'cp7_hurricane_quarantine');
eq(cp7Source.hurricaneDeltaSources.artifactId, 9001275013, 'cp7_hurricane_artifact');

// Rebind immutable PR709 source commit and its exact scientific blobs.
git('fetch', '--no-tags', 'origin', 'agent/ucic-csb-five-case-external-specificity-replication-v1');
try { git('cat-file', '-e', '54e0f3cf59cffab6a195c9c2ffe4f104185b5e81^{commit}'); } catch { fail('missing_pr709_source_commit'); }
const pr709Paths = {
  'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/RESULT.v1.json': '8a0aaca5d8edcccbf6e90d352a0612de56e69b19',
  'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/selection-and-scoring.v1.json': '509ca8a97abf4a38a46f443d099e444cec118431',
  'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/route-maps.freeze.v1.json': '2ee2e6f4c8bb0380b5d0ba4e931e106938cdcc90',
  'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/outcome-ledger.v1.json': '6a5e964572721280352d519660a20249afe1c460',
  'research/route-operator-platform-v1/registered-challenges/external-official-record-specificity-replication-v1/decoy-maps.freeze.v1.json': '62a609ae0db9dcd7fe54d1b1a14657c80c8ded0f'
};
for (const [p, sha] of Object.entries(pr709Paths)) eq(blobAt('54e0f3cf59cffab6a195c9c2ffe4f104185b5e81', p), sha, `pr709_blob:${p}`);

// Public page is frozen as delivery baseline only, with exact asset identity.
for (const [p, sha] of Object.entries(runtime.publicMethodsBaseline.files)) eq(blobAt(BASE, p), sha, `public_methods_blob:${p}`);
eq(runtime.publicMethodsBaseline.deliveryTopologyAuthority, 'CURRENT_PUBLIC_PRESENTATION_BASELINE_ONLY_NOT_CANONICAL_SCIENTIFIC_HIERARCHY', 'public_topology_authority');
ok(runtime.publicMethodsBaseline.scientificValidationClaimed === false, 'public_validation_claim');
ok(runtime.publicMethodsBaseline.universalLawProven === false, 'public_universal_claim');

// Ratified text-first and spatial-adoption authorities remain exact.
eq(blobAt(BASE, runtime.textFirstInteractionAuthority.path), runtime.textFirstInteractionAuthority.blob, 'text_first_receipt_blob');
eq(runtime.textFirstInteractionAuthority.fingerprint, '7f19aab646a09187369d6c4da00135b0e3623d3bfae288050318a04fb12845ef', 'text_first_fingerprint');
eq(blobAt(BASE, runtime.spatialAdoptionArchitecture.path), runtime.spatialAdoptionArchitecture.blob, 'spatial_adoption_blob');
eq(runtime.spatialAdoptionArchitecture.fingerprint, '59da453bc620ff7992d71d6db4f075d28db9f35530c570961a6a0a14a2ef7252', 'spatial_adoption_fingerprint');

// PR541 remains an exact nonauthoritative capability source and must not drift during F1.
eq(runtime.pr541CapabilitySource.disposition, 'PRESERVE_AND_ADAPT', 'pr541_disposition');
ok(runtime.pr541CapabilitySource.mutationAuthorized === false, 'pr541_mutation_authorized');
eq(remoteHead('experiment/methods-categorical-spatial-context-equation-embodiment-v1-001'), '2a874228f42c623c7747d566d87d451d029436f4', 'pr541_head_drift');

// Protected boundary and progressive-gate law.
ok(boundary.singleConstructionLineage === true, 'single_lineage');
eq(boundary.branchBase, BASE, 'lineage_base');
ok(boundary.f2ArtifactMutationAuthorized === false, 'f2_artifact_authority');
eq(gates.hardLaw, 'F_n_MUST_PASS_BEFORE_F_n_PLUS_1_MAY_TREAT_ITS_OUTPUTS_AS_AUTHORITY', 'advancement_law');
eq(gates.activeGate, 'F1_CONSTRUCTION_BASELINE', 'active_gate');
ok(gates.authorityBeforeF1Pass.f2Construction === false, 'f2_before_f1');
ok(gates.authorityAfterVerifiedF1Pass.f2Construction === true, 'f2_after_f1');
eq(gates.authorityAfterVerifiedF1Pass.f2ExecutionState, 'NOT_STARTED_UNTIL_SEPARATE_CONTINUATION', 'f2_execution_state');

// Candidate terminal receipt may become effective only through this exact verifier.
eq(receipt.status, 'CANDIDATE_PENDING_EXACT_VERIFICATION', 'receipt_status');
eq(receipt.candidateDisposition, 'PASS_F1_CONSTRUCTION_BASELINE_v1', 'receipt_disposition');
eq(receipt.inputMain, BASE, 'receipt_main');
eq(receipt.inputTree, BASE_TREE, 'receipt_tree');
ok(receipt.scientificClaimUpgrade === false, 'receipt_claim_upgrade');
ok(receipt.publicMutation === false, 'receipt_public_mutation');
ok(receipt.f2ConstructionAuthorityBeforeVerification === false, 'receipt_f2_before');
ok(receipt.f2ConstructionAuthorityAfterEffectivePass === true, 'receipt_f2_after');
eq(receipt.f2ExecutionAfterEffectivePass, 'NOT_STARTED_UNTIL_SEPARATE_CONTINUATION', 'receipt_f2_execution');

console.log(JSON.stringify({
  result: 'PASS_F1_CONSTRUCTION_BASELINE_v1',
  program: governing.program,
  gate: governing.gate,
  governingMain: BASE,
  governingTree: BASE_TREE,
  checkpointAuthorities: checkpoints.checkpoints.length,
  selectedVerticalCase: science.selectedVerticalCase.caseId,
  hurricaneStanding: science.hurricanePerspectiveResearch.currentFrozenTest,
  publicMutation: false,
  scientificClaimUpgrade: false,
  f2ConstructionAuthorityAfterPass: true,
  f2Execution: 'NOT_STARTED_UNTIL_SEPARATE_CONTINUATION'
}, null, 2));
