#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const readText = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const fail = (code, detail) => { throw new Error(`${code}:${detail}`); };
const assert = (condition, code, detail) => { if (!condition) fail(code, detail); };

const contract = readJson('.github/ai-router/human-disposition/exact-candidate-physical-preview-contract.v1.json');
const applicability = readJson('.github/ai-router/human-disposition/exact-candidate-physical-preview-applicability.v1.json');
const entry = readJson('AI_ENTRYPOINT.json');
const agents = readText('AGENTS.md');
const gaps = readJson('.github/ai-router/system-continuity/gap-registry.v1.json');
const hEarth = readJson('.github/ai-router/projects/h-earth/entrypoint.v1.json');
const hEarthAgents = readText('h-earth-3d/AGENTS.md');
const showroomHEarthAgents = readText('showroom/globe/h-earth/AGENTS.md');
const audralia = readJson('.github/ai-router/human-disposition/projects/audralia/binding.v1.json');
const zionts = readJson('.github/ai-router/projects/showroom-globe-zionts/entrypoint.v1.json');
const community = readJson('.github/ai-router/publication-surfaces/consider-the-energy.json');

assert(contract.schema === 'EXACT_CANDIDATE_PHYSICAL_PREVIEW_V1', 'CONTRACT_SCHEMA', contract.schema);
assert(contract.status === 'ACTIVE_FAIL_CLOSED', 'CONTRACT_STATUS', contract.status);
assert(contract.transport.providerNeutral === true, 'TRANSPORT', 'providerNeutral');
assert(contract.transport.readOnly === true, 'TRANSPORT', 'readOnly');
assert(contract.transport.repositoryMutation === false, 'TRANSPORT', 'repositoryMutation');
assert(contract.transport.productionMutation === false, 'TRANSPORT', 'productionMutation');
assert(contract.transport.productionDeploymentAsPreviewWorkaroundAllowed === false, 'TRANSPORT', 'productionDeploymentAsPreviewWorkaroundAllowed');
assert(contract.candidateFinalization.declaredRequiredPhysicalReviewIsCandidateFinalizationStep === true, 'FINALIZATION', 'declaredRequiredPhysicalReviewIsCandidateFinalizationStep');
assert(contract.candidateFinalization.mutationClosedEvidenceContinuesBeforeDispositionAllowed === false, 'FINALIZATION', 'mutationClosedEvidenceContinuesBeforeDispositionAllowed');
assert(contract.checkpoint.checkpointType === 'CANDIDATE_PERCEPTUAL_ACCEPTANCE', 'CHECKPOINT', contract.checkpoint.checkpointType);
assert(contract.checkpoint.bindingClass === 'CANDIDATE_BOUND', 'CHECKPOINT', contract.checkpoint.bindingClass);
assert(contract.eligibility.finalPhysicalGateRequiresImmutableCandidateIdentity === true, 'IDENTITY', 'immutable candidate required');
assert(contract.eligibility.branchAliasAloneSufficientForFinalGate === false, 'IDENTITY', 'branch alias must not qualify final gate');

for (const disposition of ['KEEP', 'ONE_REPAIR', 'REJECT']) {
  assert(Object.hasOwn(contract.dispositions, disposition), 'DISPOSITION_MISSING', disposition);
}
const one = contract.dispositions.ONE_REPAIR;
assert(one.originalAdmittedScopeMustRemainActive === true, 'ONE_REPAIR', 'active scope required');
assert(one.allowedPathsMayExpand === false, 'ONE_REPAIR', 'allowed paths expansion');
assert(one.intentMayExpand === false, 'ONE_REPAIR', 'intent expansion');
assert(one.authorityMayExpand === false, 'ONE_REPAIR', 'authority expansion');
assert(one.architectureMayExpand === false, 'ONE_REPAIR', 'architecture expansion');
assert(one.newImmutableCandidateIdentityRequired === true, 'ONE_REPAIR', 'new identity required');
assert(contract.terminalClosureBoundary.oneRepairAfterTerminalClosureAllowed === false, 'TERMINAL_BOUNDARY', 'repair after closure');
assert(contract.terminalClosureBoundary.furtherMutationRequires === 'FRESH_ORDINARY_ADMISSION_OR_LAWFUL_SUCCESSOR', 'TERMINAL_BOUNDARY', 'fresh authority requirement');
assert(contract.releaseBoundary.keepCreatesMergeAuthority === false, 'RELEASE_BOUNDARY', 'merge authority');
assert(contract.releaseBoundary.keepCreatesDeploymentAuthority === false, 'RELEASE_BOUNDARY', 'deployment authority');
assert(contract.releaseBoundary.keepCreatesPublicationAuthority === false, 'RELEASE_BOUNDARY', 'publication authority');
assert(contract.releaseBoundary.finalPagesExactHeadVerificationRequired === true, 'RELEASE_BOUNDARY', 'live exact-head verification');

const binding = entry.exactCandidatePhysicalPreview;
assert(binding && binding.contract === '.github/ai-router/human-disposition/exact-candidate-physical-preview-contract.v1.json', 'ENTRYPOINT_BINDING', 'contract');
assert(binding.selfTest === '.github/ai-router/human-disposition/exact-candidate-physical-preview-self-test.v1.mjs', 'ENTRYPOINT_BINDING', 'selfTest');
assert(binding.checkpointType === 'CANDIDATE_PERCEPTUAL_ACCEPTANCE', 'ENTRYPOINT_BINDING', 'checkpointType');
assert(binding.bindingClass === 'CANDIDATE_BOUND', 'ENTRYPOINT_BINDING', 'bindingClass');
assert(binding.productionDeploymentAsPreviewWorkaroundAllowed === false, 'ENTRYPOINT_BINDING', 'production preview workaround');
assert(binding.publicationBoundary === 'PUBLICATION_RELEASE_CONTRACT_UNCHANGED', 'ENTRYPOINT_BINDING', 'publication boundary');

for (const marker of [
  '### Exact-candidate physical preview as candidate finalization',
  'CANDIDATE_PERCEPTUAL_ACCEPTANCE',
  'KEEP',
  'ONE_REPAIR',
  'REJECT',
  'MUTATION_CLOSED_EVIDENCE_CONTINUES',
  'production deployment merely as a preview workaround'
]) {
  assert(agents.includes(marker), 'AGENTS_DISCOVERY', marker);
}

assert(applicability.schema === 'EXACT_CANDIDATE_PHYSICAL_PREVIEW_APPLICABILITY_v1', 'APPLICABILITY', 'schema');
assert(applicability.status === 'ACTIVE_FAIL_CLOSED', 'APPLICABILITY', 'status');
assert(applicability.rootContract === '.github/ai-router/human-disposition/exact-candidate-physical-preview-contract.v1.json', 'APPLICABILITY', 'rootContract');
assert(applicability.productionDeploymentAsPreviewWorkaroundAllowed === false, 'APPLICABILITY', 'production preview workaround');
assert(applicability.genericHeadlessMayMasqueradeAsPhysicalDeviceAcceptance === false, 'APPLICABILITY', 'headless physical acceptance');
for (const surface of ['H_EARTH_CORE', 'AUDRALIA', 'H_EARTH_AWARDS', 'COMMUNITY_CONSIDER_THE_ENERGY', 'SHOWROOM_GLOBE_ZIONTS']) {
  assert(Boolean(applicability.surfaces[surface]), 'APPLICABILITY_SURFACE', surface);
  assert(applicability.surfaces[surface].finalLiveVerificationStillRequired === true, 'APPLICABILITY_LIVE_VERIFY', surface);
}
assert(applicability.surfaces.AUDRALIA.genericHeadlessCreatesPhysicalDeviceAcceptance === false, 'AUDRALIA_APPLICABILITY', 'generic headless');
assert(applicability.surfaces.COMMUNITY_CONSIDER_THE_ENERGY.genericHeadlessCreatesPhysicalDeviceAcceptance === false, 'COMMUNITY_APPLICABILITY', 'generic headless');
assert(applicability.oneRepairBoundary.originalAdmittedScopeMustRemainActive === true, 'APPLICABILITY_ONE_REPAIR', 'active scope');
assert(applicability.oneRepairBoundary.allowedPathIntentAuthorityOrArchitectureExpansionAllowed === false, 'APPLICABILITY_ONE_REPAIR', 'scope expansion');
assert(applicability.oneRepairBoundary.newImmutableCandidateIdentityRequired === true, 'APPLICABILITY_ONE_REPAIR', 'new identity');

assert(hEarth.exactCandidatePhysicalPreview?.status === 'ACTIVE_FAIL_CLOSED', 'H_EARTH_BINDING', 'status');
assert(hEarth.exactCandidatePhysicalPreview?.rootContract === applicability.rootContract, 'H_EARTH_BINDING', 'root contract');
assert(hEarth.exactCandidatePhysicalPreview?.candidateFinalizationBeforeTerminalClosureWhenDeclared === true, 'H_EARTH_BINDING', 'candidate finalization');
assert(hEarth.exactCandidatePhysicalPreview?.productionDeploymentAsPreviewWorkaroundAllowed === false, 'H_EARTH_BINDING', 'production preview workaround');
assert(hEarth.exactCandidatePhysicalPreview?.genericHeadlessCreatesPhysicalDeviceAcceptance === false, 'H_EARTH_BINDING', 'headless physical acceptance');
assert(hEarth.exactCandidatePhysicalPreview?.finalLiveExactHeadVerificationRequired === true, 'H_EARTH_BINDING', 'live verification');
for (const rel of [applicability.rootContract, '.github/ai-router/human-disposition/exact-candidate-physical-preview-applicability.v1.json']) {
  assert(hEarth.requiredInstructions.includes(rel), 'H_EARTH_REQUIRED_INSTRUCTION', rel);
}
for (const marker of ['exact-candidate-physical-preview-contract.v1.json', 'candidate-finalization', 'KEEP', 'ONE_REPAIR', 'REJECT', 'Do not deploy production merely to obtain preview evidence']) {
  assert(hEarthAgents.includes(marker), 'H_EARTH_AGENTS_PREVIEW', marker);
}
for (const marker of ['exact-candidate-physical-preview-contract.v1.json', 'candidate-finalization', 'KEEP', 'ONE_REPAIR', 'REJECT', 'Production deployment is not a preview workaround']) {
  assert(showroomHEarthAgents.includes(marker), 'SHOWROOM_H_EARTH_AGENTS_PREVIEW', marker);
}

assert(audralia.exactCandidatePhysicalPreview?.contract === applicability.rootContract, 'AUDRALIA_BINDING', 'contract');
assert(audralia.exactCandidatePhysicalPreview?.candidateFinalizationWhenDeclared === true, 'AUDRALIA_BINDING', 'candidate finalization');
assert(audralia.exactCandidatePhysicalPreview?.productionDeploymentAsPreviewWorkaroundAllowed === false, 'AUDRALIA_BINDING', 'production preview workaround');
assert(audralia.exactCandidatePhysicalPreview?.genericHeadlessCreatesPhysicalDeviceAcceptance === false, 'AUDRALIA_BINDING', 'headless physical acceptance');
assert(audralia.exactCandidatePhysicalPreview?.finalLiveExactHeadVerificationRequired === true, 'AUDRALIA_BINDING', 'live verification');
assert(audralia.startupLoadOrder.includes(applicability.rootContract), 'AUDRALIA_STARTUP', 'contract');
assert(audralia.startupLoadOrder.includes('.github/ai-router/human-disposition/exact-candidate-physical-preview-applicability.v1.json'), 'AUDRALIA_STARTUP', 'applicability');
assert(audralia.rules.includes('DO_NOT_DEPLOY_PRODUCTION_MERELY_TO_OBTAIN_PREVIEW_OR_PHYSICAL_REVIEW_EVIDENCE'), 'AUDRALIA_RULE', 'no production preview workaround');

assert(zionts.exactCandidatePhysicalPreview?.contract === applicability.rootContract, 'ZIONTS_BINDING', 'contract');
assert(zionts.exactCandidatePhysicalPreview?.candidateFinalizationBeforeTerminalClosureWhenDeclared === true, 'ZIONTS_BINDING', 'candidate finalization');
assert(zionts.exactCandidatePhysicalPreview?.productionDeploymentAsPreviewWorkaroundAllowed === false, 'ZIONTS_BINDING', 'production preview workaround');
const zOrder = zionts.procedures?.implementationOrder || [];
for (const stage of [
  'FREEZE_IMMUTABLE_EXACT_CANDIDATE',
  'EXACT_CANDIDATE_PHYSICAL_PREVIEW_WHEN_PHYSICAL_OR_PERCEPTUAL_REVIEW_IS_DECLARED',
  'CANDIDATE_PERCEPTUAL_ACCEPTANCE_KEEP_ONE_REPAIR_OR_REJECT',
  'ONE_REPAIR_IF_SELECTED_REQUALIFY_DELTA_FREEZE_NEW_SHA_AND_PREVIEW_AGAIN',
  'TERMINAL_MUTATION_CLOSURE_AFTER_KEEP_OR_REJECT',
  'SEPARATE_EXACT_HEAD_MERGE_AND_PUBLICATION_AUTHORITY',
  'FINAL_LIVE_EXACT_HEAD_VERIFICATION'
]) {
  assert(zOrder.includes(stage), 'ZIONTS_SEQUENCE', stage);
}
assert(zOrder.indexOf('EXACT_CANDIDATE_PHYSICAL_PREVIEW_WHEN_PHYSICAL_OR_PERCEPTUAL_REVIEW_IS_DECLARED') < zOrder.indexOf('TERMINAL_MUTATION_CLOSURE_AFTER_KEEP_OR_REJECT'), 'ZIONTS_SEQUENCE', 'preview must precede terminal closure');
assert(zOrder.indexOf('TERMINAL_MUTATION_CLOSURE_AFTER_KEEP_OR_REJECT') < zOrder.indexOf('SEPARATE_EXACT_HEAD_MERGE_AND_PUBLICATION_AUTHORITY'), 'ZIONTS_SEQUENCE', 'closure must precede release authority');

assert(!community.description.includes('Physical-device lifecycle acceptance occurs only after exact-head publication'), 'COMMUNITY_BINDING', 'historical post-publication-only rule survived');
assert(community.description.includes('EXACT_CANDIDATE_PHYSICAL_PREVIEW_V1'), 'COMMUNITY_BINDING', 'preview protocol');
assert(community.description.includes('candidate-finalization'), 'COMMUNITY_BINDING', 'candidate finalization');
assert(community.description.includes('Production deployment is not a preview workaround'), 'COMMUNITY_BINDING', 'production preview workaround');
assert(community.description.includes('generic headless evidence never becomes physical-device acceptance'), 'COMMUNITY_BINDING', 'generic headless boundary');
assert(community.description.includes('final authoritative live exact-head verification remains required'), 'COMMUNITY_BINDING', 'live verification');

const gap = gaps.records.find(record => record.gapId === 'EXACT_CANDIDATE_PHYSICAL_PREVIEW_CONTINUITY');
assert(Boolean(gap), 'GAP_REGISTRY', 'missing exact-candidate preview gap');
assert(gap.status === 'OPEN', 'GAP_REGISTRY', `unexpected status ${gap.status}`);
assert(gap.authorityCreated === false, 'GAP_REGISTRY', 'authorityCreated');
assert(gap.coordinationIssue === 3464, 'GAP_REGISTRY', 'coordination issue');

console.log('EXACT_CANDIDATE_PHYSICAL_PREVIEW_SELF_TEST_PASS');
