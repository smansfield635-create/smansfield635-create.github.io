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
const entry = readJson('AI_ENTRYPOINT.json');
const agents = readText('AGENTS.md');
const gaps = readJson('.github/ai-router/system-continuity/gap-registry.v1.json');

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

const gap = gaps.records.find(record => record.gapId === 'EXACT_CANDIDATE_PHYSICAL_PREVIEW_CONTINUITY');
assert(Boolean(gap), 'GAP_REGISTRY', 'missing exact-candidate preview gap');
assert(gap.status === 'OPEN', 'GAP_REGISTRY', `unexpected status ${gap.status}`);
assert(gap.authorityCreated === false, 'GAP_REGISTRY', 'authorityCreated');
assert(gap.coordinationIssue === 3464, 'GAP_REGISTRY', 'coordination issue');

console.log('EXACT_CANDIDATE_PHYSICAL_PREVIEW_SELF_TEST_PASS');
