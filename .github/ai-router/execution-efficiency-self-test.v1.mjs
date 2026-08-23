#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const fail = (message) => { process.stderr.write(`${message}\n`); process.exitCode = 1; };

const entry = readJson('AI_ENTRYPOINT.json');
const shared = readJson('.github/ai-router/shared-procedures.v1.json');
const capability = readJson('.github/ai-router/workflow-dispatch-capability.v1.json');
const release = readJson('.github/ai-router/publication-release-contract.v1.json');
const policy = readJson('.github/ai-router/execution-efficiency-policy.v1.json');

const pagesCapability = capability.capabilities?.PAGES_EXACT_HEAD_DEPLOY;
const expectedWorkflow = pagesCapability?.workflow ? `.github/workflows/${pagesCapability.workflow}` : null;

if (entry.executionEfficiency?.policy !== '.github/ai-router/execution-efficiency-policy.v1.json') fail('ENTRYPOINT_EXECUTION_EFFICIENCY_POLICY_BINDING_MISSING');
if (!entry.rules?.includes('NO_REPEATED_EQUIVALENT_PROBE_WITHOUT_NEW_EVIDENCE')) fail('ENTRYPOINT_NO_REPEAT_RULE_MISSING');
if (!entry.rules?.includes('CHANGE_EVIDENCE_SURFACE_AFTER_FIRST_FAILED_RETRIEVAL')) fail('ENTRYPOINT_EVIDENCE_ESCALATION_RULE_MISSING');
if (!entry.rules?.includes('LOCALIZE_EXACT_FAILED_ASSERTION_BEFORE_REPAIR')) fail('ENTRYPOINT_FAULT_LOCALIZATION_RULE_MISSING');
if (!shared.procedures?.some((p) => p.procedureId === 'EVIDENCE_BEARING_EXECUTION')) fail('SHARED_EVIDENCE_BEARING_EXECUTION_PROCEDURE_MISSING');
if (!pagesCapability) fail('PAGES_EXACT_HEAD_DEPLOY_CAPABILITY_MISSING');
if (!expectedWorkflow) fail('PAGES_WORKFLOW_IDENTITY_UNRESOLVED');
if (entry.publicationRelease?.deploymentWorkflow !== expectedWorkflow) fail(`ENTRYPOINT_PUBLICATION_WORKFLOW_DRIFT:${entry.publicationRelease?.deploymentWorkflow}:${expectedWorkflow}`);
if (release.deployment?.workflow !== expectedWorkflow) fail(`RELEASE_CONTRACT_WORKFLOW_DRIFT:${release.deployment?.workflow}:${expectedWorkflow}`);
if (release.deployment?.capabilityId !== 'PAGES_EXACT_HEAD_DEPLOY') fail('RELEASE_CONTRACT_CAPABILITY_BINDING_MISSING');
if (policy.publicationPathConsistency?.canonicalCapabilityId !== 'PAGES_EXACT_HEAD_DEPLOY') fail('POLICY_CANONICAL_PUBLICATION_CAPABILITY_DRIFT');
if (policy.evidenceProgressLaw?.maxEquivalentProbeAttempts !== 2) fail('EQUIVALENT_PROBE_LIMIT_DRIFT');
if (policy.evidenceProgressLaw?.sameProbeWithoutNewEvidenceAllowed !== false) fail('REDUNDANT_PROBE_NOT_FAIL_CLOSED');

if (expectedWorkflow) {
  const workflowPath = path.join(root, expectedWorkflow);
  if (!fs.existsSync(workflowPath)) fail(`CANONICAL_PUBLICATION_WORKFLOW_MISSING:${expectedWorkflow}`);
  else {
    const workflowText = fs.readFileSync(workflowPath, 'utf8');
    if (!/^\s*workflow_dispatch\s*:/m.test(workflowText)) fail(`CANONICAL_PUBLICATION_WORKFLOW_NOT_DISPATCHABLE:${expectedWorkflow}`);
  }
}

if (!process.exitCode) {
  process.stdout.write(JSON.stringify({
    schema: 'AI_PROCEDURAL_EXECUTION_EFFICIENCY_SELF_TEST_RECEIPT_v1',
    result: 'PASS',
    canonicalPublicationCapability: 'PAGES_EXACT_HEAD_DEPLOY',
    canonicalPublicationWorkflow: expectedWorkflow,
    maxEquivalentProbeAttempts: policy.evidenceProgressLaw.maxEquivalentProbeAttempts,
    noRepeatedEquivalentProbeWithoutNewEvidence: true
  }, null, 2) + '\n');
}
