#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
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
if (policy.checkoutLocality?.defaultMode !== 'BOUNDED_WORKING_SET_REQUIRED') fail('CHECKOUT_LOCALITY_DEFAULT_MODE_DRIFT');
if (policy.checkoutLocality?.unrestrictedCheckoutAllowedByDefault !== false) fail('UNRESTRICTED_CHECKOUT_NOT_FAIL_CLOSED');
if (policy.checkoutLocality?.materializeExcludedRootsThenDiscardAllowed !== false) fail('EXCLUDED_ROOT_MATERIALIZATION_NOT_FORBIDDEN');
if (policy.checkoutLocality?.exactCommitObjectReadbackForExcludedProtectedClosuresAllowed !== true) fail('PROTECTED_OBJECT_READBACK_NOT_ALLOWED');
if (!policy.forbiddenPatterns?.includes('UNRESTRICTED_CHECKOUT_WITHOUT_EXPLICIT_WHOLE_REPOSITORY_EXCEPTION')) fail('UNRESTRICTED_CHECKOUT_FORBIDDEN_PATTERN_MISSING');

const requireSparseCheckout = (workflowPath, {bridge = false, requiredPaths = [], forbidRootWide = false} = {}) => {
  const text = readText(workflowPath);
  const checkoutCount = (text.match(/uses:\s*actions\/checkout@v4/g) || []).length;
  const sparseCount = (text.match(/sparse-checkout:\s*\|/g) || []).length;
  const nonConeCount = (text.match(/sparse-checkout-cone-mode:\s*false/g) || []).length;
  if (!checkoutCount) fail(`CHECKOUT_ACTION_MISSING:${workflowPath}`);
  if (sparseCount !== checkoutCount) fail(`UNBOUNDED_CHECKOUT_BLOCK_PRESENT:${workflowPath}:checkout=${checkoutCount}:sparse=${sparseCount}`);
  if (nonConeCount !== checkoutCount) fail(`NON_CONE_SPARSE_CHECKOUT_COUNT_MISMATCH:${workflowPath}:checkout=${checkoutCount}:nonCone=${nonConeCount}`);
  if (bridge) {
    for (const required of [
      '/.github/ai-router/workflow-dispatch-capability.v1.json',
      '/tools/ai-entry-workflow-dispatch-bridge.mjs'
    ]) if (!text.includes(required)) fail(`BRIDGE_WORKING_SET_PATH_MISSING:${workflowPath}:${required}`);
  }
  for (const required of requiredPaths) if (!text.includes(required)) fail(`WORKING_SET_PATH_MISSING:${workflowPath}:${required}`);
  if (forbidRootWide && text.includes('\n            /*\n')) fail(`WORKING_SET_TOO_BROAD:${workflowPath}`);
  return text;
};

const requirePublicationSparseIndex = (workflowPath) => {
  const text = readText(workflowPath);
  if ((text.match(/uses:\s*actions\/checkout@v4/g) || []).length !== 0) fail(`PUBLICATION_ACTIONS_CHECKOUT_FORBIDDEN:${workflowPath}`);
  if (!text.includes('git -c protocol.version=2 fetch --no-tags --depth=1 --filter=blob:none origin "$TARGET_SHA"')) fail(`PUBLICATION_EXACT_PARTIAL_FETCH_MISSING:${workflowPath}`);
  if (!text.includes('git sparse-checkout init --cone --sparse-index')) fail(`PUBLICATION_SPARSE_INDEX_INIT_MISSING:${workflowPath}`);
  if (!text.includes('git config --bool index.sparse')) fail(`PUBLICATION_SPARSE_INDEX_ASSERTION_MISSING:${workflowPath}`);
  if (!text.includes('git ls-tree -d --name-only FETCH_HEAD')) fail(`PUBLICATION_ROOT_TREE_ENUMERATION_MISSING:${workflowPath}`);
  if (!text.includes('git ls-tree -d --name-only "FETCH_HEAD:inspection"')) fail(`PUBLICATION_INSPECTION_TREE_ENUMERATION_MISSING:${workflowPath}`);
  if (!text.includes('test "$child" = "audralia-24057-exact" && continue')) fail(`PUBLICATION_PROTECTED_SNAPSHOT_WORKTREE_EXCLUSION_MISSING:${workflowPath}`);
  if (!text.includes('.github/ai-router/publication-surfaces')) fail(`PUBLICATION_SURFACE_MANIFEST_WORKING_SET_MISSING:${workflowPath}`);
  if (!text.includes('test "$sparse_entries" -lt 20000')) fail(`PUBLICATION_SPARSE_INDEX_BOUND_MISSING:${workflowPath}`);
  if (!text.includes('test "$materialized_files" -lt 20000')) fail(`PUBLICATION_MATERIALIZED_FILE_BOUND_MISSING:${workflowPath}`);
  if (text.includes('sparse-checkout-cone-mode: false')) fail(`PUBLICATION_NON_CONE_CHECKOUT_FORBIDDEN:${workflowPath}`);
  if (text.includes('\n            /*\n')) fail(`PUBLICATION_ROOT_WIDE_NEGATIVE_PATTERN_FORBIDDEN:${workflowPath}`);
  for (const excluded of ['preview', 'node_modules', 'h-earth-live-6d18e158']) {
    if (!text.includes(excluded)) fail(`PUBLICATION_BULK_EXCLUSION_MISSING:${workflowPath}:${excluded}`);
  }
  return text;
};

const workflows = policy.checkoutLocality?.centralWorkflows || {};
const bridgeWorkflow = workflows.aiEntryBridge;
const canonicalIntakeWorkflow = workflows.canonicalIntake;
const successorGatewayWorkflow = workflows.successorGateway;
const preflightWorkflow = workflows.publicationPreflight;
const deployWorkflow = workflows.publicationDeploy;
if (!bridgeWorkflow || !canonicalIntakeWorkflow || !successorGatewayWorkflow || !preflightWorkflow || !deployWorkflow) fail('CENTRAL_CHECKOUT_LOCALITY_WORKFLOW_BINDINGS_MISSING');
else {
  requireSparseCheckout(bridgeWorkflow, {bridge: true, forbidRootWide: true});
  requireSparseCheckout(canonicalIntakeWorkflow, {
    requiredPaths: policy.checkoutLocality?.canonicalGatewayWorkingSets?.canonicalIntake || [],
    forbidRootWide: true
  });
  requireSparseCheckout(successorGatewayWorkflow, {
    requiredPaths: policy.checkoutLocality?.canonicalGatewayWorkingSets?.successorGateway || [],
    forbidRootWide: true
  });
  requirePublicationSparseIndex(preflightWorkflow);
  requirePublicationSparseIndex(deployWorkflow);
}

if (expectedWorkflow) {
  const workflowPath = path.join(root, expectedWorkflow);
  if (!fs.existsSync(workflowPath)) fail(`CANONICAL_PUBLICATION_WORKFLOW_MISSING:${expectedWorkflow}`);
  else {
    const workflowText = fs.readFileSync(workflowPath, 'utf8');
    if (!/^\s*workflow_dispatch\s*:/m.test(workflowText)) fail(`CANONICAL_PUBLICATION_WORKFLOW_NOT_DISPATCHABLE:${expectedWorkflow}`);
  }
}

if (!process.exitCode) {
  const centralSparseCheckoutVerified = [bridgeWorkflow, canonicalIntakeWorkflow, successorGatewayWorkflow, preflightWorkflow, deployWorkflow];
  process.stdout.write(JSON.stringify({
    schema: 'AI_PROCEDURAL_EXECUTION_EFFICIENCY_SELF_TEST_RECEIPT_v1',
    result: 'PASS',
    canonicalPublicationCapability: 'PAGES_EXACT_HEAD_DEPLOY',
    canonicalPublicationWorkflow: expectedWorkflow,
    maxEquivalentProbeAttempts: policy.evidenceProgressLaw.maxEquivalentProbeAttempts,
    noRepeatedEquivalentProbeWithoutNewEvidence: true,
    checkoutLocalityDefault: policy.checkoutLocality.defaultMode,
    unrestrictedCheckoutAllowedByDefault: false,
    publicationCheckoutMode: 'EXACT_REF_PARTIAL_FETCH_CONE_SPARSE_INDEX',
    publicationActionsCheckoutAllowed: false,
    publicationFullIndexTraversalAllowed: false,
    centralSparseCheckoutVerified
  }, null, 2) + '\n');
}
