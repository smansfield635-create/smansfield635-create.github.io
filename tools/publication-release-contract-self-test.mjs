import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const readText = (path) => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contractPath = '.github/ai-router/publication-release-contract.v1.json';
const aiPath = 'AI_ENTRYPOINT.json';
const compassPath = '.github/ai-router/projects/compass/entrypoint.v1.json';
const dispatchCapabilityPath = '.github/ai-router/workflow-dispatch-capability.v1.json';
const surfaceSchemaPath = '.github/ai-router/publication-surfaces/schema.v1.json';
const audraliaSurfacePath = '.github/ai-router/publication-surfaces/audralia.json';

const contract = readJson(contractPath);
const ai = readJson(aiPath);
const compass = readJson(compassPath);
const dispatchCapability = readJson(dispatchCapabilityPath);
const surfaceSchema = readJson(surfaceSchemaPath);
const audralia = readJson(audraliaSurfacePath);
const pagesDispatch = dispatchCapability.capabilities?.PAGES_EXACT_HEAD_DEPLOY;
const workflowPath = pagesDispatch?.workflow ? `.github/workflows/${pagesDispatch.workflow}` : null;
assert(workflowPath, 'canonical Pages deployment workflow unresolved');
const workflow = readText(workflowPath);

const boundedSequence = 'APPROVED_COMMIT>EXPLICIT_DEPLOYMENT>LIVE_EXACT_HEAD_VERIFICATION';
const runtimeSequence = 'APPLICABLE_GOVERNANCE_AND_QUALIFICATION>APPROVED_COMMIT>EXPLICIT_DEPLOYMENT>LIVE_EXACT_HEAD_VERIFICATION';

assert(contract.schema === 'PUBLICATION_RELEASE_CONTRACT_v1', 'release contract schema mismatch');
assert(contract.status === 'ACTIVE', 'release contract must be ACTIVE');
assert(contract.releaseClasses?.BOUNDED_PAGE_RELEASE?.requiredSequence?.join('>') === boundedSequence, 'bounded release sequence drifted');
assert(contract.releaseClasses?.BOUNDED_PAGE_RELEASE?.canonicalOperationIntakeRequired === false, 'bounded releases must not require canonical intake');
assert(contract.releaseClasses?.RUNTIME_OR_NEW_DEVELOPMENT?.requiredSequence?.join('>') === runtimeSequence, 'runtime release sequence drifted');
assert(contract.releaseClasses?.RUNTIME_OR_NEW_DEVELOPMENT?.canonicalOperationIntakeRequired === true, 'runtime/new development must require canonical intake');
assert(contract.deployment?.capabilityId === 'PAGES_EXACT_HEAD_DEPLOY', 'deployment capability binding drifted');
assert(contract.deployment?.workflow === workflowPath, 'deployment workflow binding drifted');
assert(contract.deployment?.inputs?.join('>') === 'target_sha>surface_id', 'deployment inputs must remain target_sha and surface_id');
assert(contract.deployment?.surfaceManifestRoot === '.github/ai-router/publication-surfaces/', 'surface manifest root drifted');
assert(contract.universality?.scope === 'ALL_PUBLIC_SURFACES_IN_REPOSITORY', 'publication scope is not universal');
assert(contract.universality?.projectSpecificDeploymentWorkflowAllowed === false, 'project-specific publication workflows must remain forbidden');
assert(contract.universality?.newSurfaceRequiresDeploymentWorkflowMutation === false, 'new public surfaces must not require workflow mutation');
assert(contract.verification?.surfaceSpecificProofRequired === true, 'surface-specific proof must remain mandatory');
assert(contract.verification?.successResult === 'LIVE_EXACT_HEAD_VERIFIED', 'live success result drifted');
assert(contract.verification?.failureResult === 'DEPLOYMENT_NOT_PROVEN', 'live failure result drifted');
assert(contract.verification?.failedAssertionLocalizationRequiredBeforeRepair === true, 'failed assertion localization must remain mandatory');
assert(contract.verification?.blindRerunAllowed === false, 'blind rerun must remain prohibited');

assert(ai.publicationRelease?.contract === contractPath, 'AI entry point is not bound to release contract');
assert(ai.publicationRelease?.deploymentCapabilityId === 'PAGES_EXACT_HEAD_DEPLOY', 'AI publication capability drifted');
assert(ai.publicationRelease?.deploymentWorkflow === workflowPath, 'AI deployment workflow drifted');
assert(ai.publicationRelease?.boundedPageReleaseSequence?.join('>') === boundedSequence, 'AI bounded release sequence drifted');
assert(ai.publicationRelease?.runtimeOrNewDevelopmentSequence?.join('>') === runtimeSequence, 'AI runtime release sequence drifted');
assert(ai.operationIntakeGate?.notRequiredForMutationClasses?.includes('BOUNDED_PAGE_RELEASE'), 'AI entry point must exempt bounded page release from canonical intake');

assert(compass.procedures?.publicationReleaseContract === contractPath, 'Compass entry point is not bound to release contract');
assert(compass.procedures?.publicationCapability === 'PAGES_EXACT_HEAD_DEPLOY', 'Compass publication capability drifted');
assert(compass.githubActionsExecution?.deploymentCapability === 'PAGES_EXACT_HEAD_DEPLOY', 'Compass deployment capability drifted');
assert(compass.githubActionsExecution?.deploymentWorkflow === workflowPath, 'Compass deployment workflow drifted');
assert(compass.githubActionsExecution?.deploymentInput === 'target_sha', 'Compass target SHA deployment input drifted');
assert(compass.githubActionsExecution?.surfaceInput === 'surface_id', 'Compass surface deployment input drifted');
assert(compass.githubActionsExecution?.deploymentSuccessResult === 'LIVE_EXACT_HEAD_VERIFIED', 'Compass deployment success result drifted');
assert(!compass.ownedExactPaths?.includes('.github/workflows/pages-direct-deploy.yml'), 'Compass must not own retired universal deployment workflow');
assert(compass.releaseClassification?.BOUNDED_PAGE_RELEASE?.requiredClosure?.join('>') === boundedSequence, 'Compass bounded release closure drifted');
assert(compass.releaseClassification?.BOUNDED_PAGE_RELEASE?.canonicalIntakeRequired === false, 'Compass bounded release must not require canonical intake');
assert(compass.releaseClassification?.RUNTIME_OR_NEW_DEVELOPMENT?.requiredClosure?.join('>') === runtimeSequence, 'Compass runtime release closure drifted');
assert(compass.releaseClassification?.RUNTIME_OR_NEW_DEVELOPMENT?.canonicalIntakeRequired === true, 'Compass runtime/new development must require canonical intake');

assert(pagesDispatch?.ref === 'main', 'AI dispatch Pages ref must remain main');
assert(pagesDispatch?.inputPolicy?.target_sha?.source === 'CURRENT_MAIN_SHA', 'AI dispatch must bind target_sha to current main');
assert(pagesDispatch?.inputPolicy?.target_sha?.userOverrideAllowed === false, 'AI dispatch target_sha must not be user-overridable');
assert(pagesDispatch?.inputPolicy?.surface_id?.source === 'REQUEST', 'AI dispatch surface_id must come from explicit request');
assert(pagesDispatch?.inputPolicy?.surface_id?.required === true, 'AI dispatch surface_id must be required');
assert(pagesDispatch?.inputPolicy?.surface_id?.userOverrideAllowed === true, 'AI dispatch surface_id must be selectable');

assert(surfaceSchema.$id === 'PUBLICATION_SURFACE_VERIFICATION_v1', 'surface verification schema mismatch');
assert(audralia.schema === 'PUBLICATION_SURFACE_VERIFICATION_v1', 'Audralia surface manifest schema mismatch');
assert(audralia.surfaceId === 'audralia', 'Audralia surface id mismatch');
assert(audralia.checks?.length >= 1, 'Audralia requires static public verification checks');

for (const required of [
  'workflow_dispatch:', 'target_sha:', 'surface_id:', 'pages: write', 'id-token: write',
  'actions/checkout@v4', 'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v3', 'actions/deploy-pages@v4',
  '.well-known/dgb-release.json', '.github/ai-router/publication-surfaces/',
  'PUBLICATION_SURFACE_VERIFICATION_v1',
  'AUDRALIA_VISIBLE_BUILD_FINGERPRINT=', 'data-audralia-build-sha=', 'BUILD $short_sha'
]) assert(workflow.includes(required), `deployment workflow missing required token: ${required}`);

for (const forbidden of [
  'Manual Diagnostic Only', 'dummy release', 'public-release',
  'build_type', 'api.github.com/repos/${GITHUB_REPOSITORY}/pages',
  'push:'
]) assert(!workflow.includes(forbidden), `deployment workflow contains retired or unauthorized release behavior: ${forbidden}`);

console.log(JSON.stringify({
  schema: 'PUBLICATION_RELEASE_CONTRACT_SELF_TEST_RECEIPT_v5',
  result: 'PASS',
  releaseSequence: contract.releaseClasses.BOUNDED_PAGE_RELEASE.requiredSequence,
  runtimeSequence: contract.releaseClasses.RUNTIME_OR_NEW_DEVELOPMENT.requiredSequence,
  capability: 'PAGES_EXACT_HEAD_DEPLOY',
  workflow: workflowPath,
  workflowDispatchOnly: true,
  pagesAdministrationMutation: false,
  universalSurfaceVerification: true,
  universalAiDispatch: true,
  dispatchInputs: ['target_sha','surface_id'],
  audraliaVisibleBuildFingerprintRequired: true,
  surfaceManifestRoot: contract.deployment.surfaceManifestRoot,
  registeredProofSample: audralia.surfaceId,
  verification: contract.verification.successResult
}, null, 2));
