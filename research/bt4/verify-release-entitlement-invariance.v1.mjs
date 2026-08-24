import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeEntitlement, serveRequestedState } from '../../preview/bt4/entitlement-v1/entitlement-engine.v1.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
const evaluate = (label, state, expected) => {
  const entitlement = computeEntitlement(state);
  const served = serveRequestedState('QUALIFIED', state);
  assert(entitlement.state === expected, `${label}: expected ${expected}, got ${entitlement.state}`);
  assert(served.served === expected, `${label}: served expected ${expected}, got ${served.served}`);
  return { label, entitlement: entitlement.state, served: served.served, blocked: served.blocked, reason: entitlement.reason };
};

const entry = json('AI_ENTRYPOINT.json');
const contractPath = entry.publicationRelease?.contract;
const workflowPath = entry.publicationRelease?.deploymentWorkflow;
assert(contractPath === '.github/ai-router/publication-release-contract.v1.json', 'AI Entry publication contract identity drift');
assert(workflowPath === '.github/workflows/pages-exact-head-deploy-v3.yml', 'AI Entry deployment workflow identity drift');

const contract = json(contractPath);
const workflow = read(workflowPath);
assert(contract.status === 'ACTIVE', 'Publication contract is not ACTIVE');
assert(contract.deployment?.workflow === workflowPath, 'Publication contract workflow does not match AI Entry');
assert(contract.verification?.successResult === 'LIVE_EXACT_HEAD_VERIFIED', 'Unexpected release success result');
assert(contract.verification?.failureResult === 'DEPLOYMENT_NOT_PROVEN', 'Unexpected release failure result');
assert(contract.universality?.scope === 'ALL_PUBLIC_SURFACES_IN_REPOSITORY', 'Release contract is not universal');
assert(contract.rules.includes('MERGE_IS_NOT_DEPLOYMENT'), 'Merge/deploy separation missing');
assert(contract.rules.includes('DEPLOYMENT_IS_NOT_VERIFIED_LIVE_RELEASE'), 'Deploy/verified-release separation missing');
assert(contract.rules.includes('PUBLIC_RELEASE_REQUIRES_SURFACE_SPECIFIC_BYTE_PROOF'), 'Surface byte proof requirement missing');
assert(workflow.includes('DISPATCHED_HEAD_SHA: ${{ github.sha }}'), 'Immutable workflow-dispatch head binding missing from real release workflow');
assert(workflow.includes('if [ "$requested" != "$dispatched" ]'), 'Exact dispatched-head gate missing from real release workflow');
assert(workflow.includes('node tools/publication-live-verify.mjs static'), 'Static live verification missing from real release workflow');
assert(workflow.includes('node tools/publication-live-verify.mjs runtime'), 'Runtime live verification missing from real release workflow');
assert(workflow.includes('.well-known/dgb-release.json'), 'Exact-head public release marker missing from real release workflow');

const baseline = { epoch: 31, provenance: true, reproduction: true, evidence: 'supporting', authority: true, receiptEpoch: 31 };
const results = [];
results.push(evaluate('RELEASE_BASELINE_LIVE_EXACT_HEAD_VERIFIED', baseline, 'QUALIFIED'));
results.push(evaluate('RELEASE_MERGED_BUT_NOT_DEPLOYED', { ...baseline, epoch: 32, authority: false }, 'HELD'));
results.push(evaluate('RELEASE_EXACT_HEAD_IDENTITY_FAILURE', { ...baseline, epoch: 33, provenance: false }, 'HELD'));
results.push(evaluate('RELEASE_POST_DEPLOY_LIVE_VERIFICATION_FAILURE', { ...baseline, epoch: 34, reproduction: false }, 'HELD'));
results.push(evaluate('RELEASE_REPAIRED_BUT_STALE_RECEIPT', { ...baseline, epoch: 35, receiptEpoch: 31 }, 'SUPPORTED'));
results.push(evaluate('RELEASE_FRESH_EXACT_HEAD_REQUALIFICATION', { ...baseline, epoch: 35, receiptEpoch: 35 }, 'QUALIFIED'));

const result = {
  schema: 'BT4_RELEASE_ENTITLEMENT_INVARIANCE_RESULT_v1',
  kernel: 'preview/bt4/entitlement-v1/entitlement-engine.v1.mjs',
  realReleaseBinding: {
    aiEntrypoint: 'AI_ENTRYPOINT.json',
    publicationContract: contractPath,
    deploymentWorkflow: workflowPath,
    successResult: contract.verification.successResult,
    failureResult: contract.verification.failureResult,
    scope: contract.universality.scope
  },
  results,
  invariants: {
    sameKernel: true,
    mergeAloneCannotEntitleVerifiedRelease: true,
    sourceIdentityFailureContractsRepresentation: true,
    postDeployVerificationFailureContractsRepresentation: true,
    repairWithoutFreshReceiptDoesNotFullyRestore: true,
    freshVerificationReceiptRestoresStrongState: true,
    objectSpecificEntitlementExceptionLogic: false
  },
  pass: true
};
console.log(JSON.stringify(result, null, 2));
