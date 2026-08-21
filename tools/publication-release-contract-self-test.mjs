import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const readText = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contractPath = '.github/ai-router/publication-release-contract.v1.json';
const aiPath = 'AI_ENTRYPOINT.json';
const compassPath = '.github/ai-router/projects/compass/entrypoint.v1.json';
const workflowPath = '.github/workflows/pages-direct-deploy.yml';

const contract = readJson(contractPath);
const ai = readJson(aiPath);
const compass = readJson(compassPath);
const workflow = readText(workflowPath);

assert(contract.schema === 'PUBLICATION_RELEASE_CONTRACT_v1', 'release contract schema mismatch');
assert(contract.status === 'ACTIVE', 'release contract must be ACTIVE');
assert(contract.releaseClasses?.BOUNDED_PAGE_RELEASE?.requiredSequence?.join('>') === 'APPROVED_COMMIT>EXPLICIT_DEPLOYMENT>LIVE_EXACT_HEAD_VERIFICATION', 'bounded release sequence drifted');
assert(contract.releaseClasses?.BOUNDED_PAGE_RELEASE?.canonicalOperationIntakeRequired === false, 'bounded releases must not require canonical intake');
assert(contract.releaseClasses?.RUNTIME_OR_NEW_DEVELOPMENT?.canonicalOperationIntakeRequired === true, 'runtime/new development must require canonical intake');
assert(contract.deployment?.workflow === workflowPath, 'deployment workflow binding drifted');
assert(contract.deployment?.input === 'target_sha', 'deployment input must remain target_sha');
assert(contract.verification?.successResult === 'LIVE_EXACT_HEAD_VERIFIED', 'live success result drifted');
assert(contract.verification?.failureResult === 'DEPLOYMENT_NOT_PROVEN', 'live failure result drifted');

assert(ai.publicationReleaseContract?.policy === contractPath, 'AI entry point is not bound to release contract');
assert(ai.publicationReleaseContract?.boundedPageReleaseClass === 'BOUNDED_PAGE_RELEASE', 'AI bounded release class drifted');
assert(ai.publicationReleaseContract?.runtimeOrNewDevelopmentClass === 'RUNTIME_OR_NEW_DEVELOPMENT', 'AI runtime release class drifted');

assert(compass.githubActionsExecution?.deploymentWorkflow === workflowPath, 'Compass deployment workflow drifted');
assert(compass.publicationRelease?.policy === contractPath, 'Compass entry point is not bound to release contract');
assert(compass.publicationRelease?.boundedPageReleaseSequence?.join('>') === 'APPROVED_COMMIT>EXPLICIT_DEPLOYMENT>LIVE_EXACT_HEAD_VERIFICATION', 'Compass bounded release sequence drifted');

for (const required of [
  'workflow_dispatch:',
  'target_sha:',
  'pages: write',
  'id-token: write',
  'actions/checkout@v4',
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v3',
  'actions/deploy-pages@v4',
  '.well-known/dgb-release.json',
  'LIVE_EXACT_HEAD_VERIFIED',
  'DEPLOYMENT_NOT_PROVEN',
  'build_type',
  'workflow'
]) assert(workflow.includes(required), `deployment workflow missing required token: ${required}`);

for (const forbidden of ['Manual Diagnostic Only', 'dummy release', 'public-release']) {
  assert(!workflow.includes(forbidden), `deployment workflow contains retired release behavior: ${forbidden}`);
}

console.log(JSON.stringify({
  schema: 'PUBLICATION_RELEASE_CONTRACT_SELF_TEST_RECEIPT_v1',
  result: 'PASS',
  releaseSequence: contract.releaseClasses.BOUNDED_PAGE_RELEASE.requiredSequence,
  workflow: workflowPath,
  verification: contract.verification.successResult
}, null, 2));
