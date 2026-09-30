import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import registryFacade,{verifyHEarthAudraliaTabletSingleContextRuntimePathRecognition} from '../accepted-amendments/h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';
import {loadHEarthRepositoryRegistryValidatorDependencies} from '../h-earth.repository-registry.validator-engine.loader.js';

const OPERATION_ID='AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_PATH_RECOGNITION_20260913_001';
const GENERATION=2187;
const NODE_ID='H_EARTH_AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_EXACT_PATH_RECOGNITION_SCOPE';
const TARGET='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';
const TARGET_REPOSITORY_PATH=TARGET.slice(1);
const GOVERNING_HEAD='1fb42bf9e6e7274c6625137a7d484a0e3e565390';
const TARGET_GIT_BLOB='8d574a20c081a1bde71393f5f783d0637efe8551';
const PREFIX='/showroom/globe/h-earth/terrain-estate-construction-v1/';

const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const governingBlob=git('rev-parse',`${GOVERNING_HEAD}:${TARGET_REPOSITORY_PATH}`);
const workingTreeBlob=git('hash-object',TARGET_REPOSITORY_PATH);
assert.equal(governingBlob,TARGET_GIT_BLOB,'GOVERNING_TARGET_BLOB_MISMATCH');
assert.equal(workingTreeBlob,TARGET_GIT_BLOB,'TARGET_PRODUCT_BYTE_DRIFT');

const verification=verifyHEarthAudraliaTabletSingleContextRuntimePathRecognition();
assert.equal(verification.eligible,true,'PATH_RECOGNITION_NOT_ELIGIBLE');
assert.equal(verification.governingHead,GOVERNING_HEAD,'GOVERNING_HEAD_MISMATCH');
assert.equal(verification.targetPath,TARGET,'TARGET_PATH_MISMATCH');
assert.equal(verification.targetGitBlob,TARGET_GIT_BLOB,'TARGET_BLOB_MISMATCH');
assert.ok(Object.values(verification.checks).every(Boolean),'RECOGNITION_CHECK_FAILURE');

const resolution=registryFacade.resolveHEarthRepositoryRegistryPath(TARGET);
assert.equal(resolution.resolved,true,'TARGET_PATH_UNRESOLVED');
assert.ok((resolution.nodes??[]).some(node=>node.nodeId===NODE_ID),'TARGET_NODE_MISSING');
assert.ok((resolution.occurrences??[]).some(occurrence=>occurrence.path===TARGET&&occurrence.commitSha===GOVERNING_HEAD&&occurrence.gitBlobSha===TARGET_GIT_BLOB&&occurrence.existenceStatus==='PRESENT'),'TARGET_OCCURRENCE_MISSING');

const prefixResolution=registryFacade.resolveHEarthRepositoryRegistryPath(PREFIX);
assert.equal((prefixResolution.nodes??[]).some(node=>node.nodeId===NODE_ID),false,'PREFIX_WIDE_REGISTRATION_DETECTED');

const node=registryFacade.getHEarthRepositoryRegistryNode(NODE_ID);
assert.equal(node.authorityClass,'AUDIT_ONLY','AUTHORITY_CLASS_DRIFT');
assert.equal(node.authorityPosture,'EXACT_PATH_RESOLUTION_ONLY','AUTHORITY_POSTURE_DRIFT');
assert.equal(node.registrationEffect,'PATH_RESOLUTION_ONLY','REGISTRATION_EFFECT_DRIFT');
assert.deepEqual(node.repositoryPaths,[TARGET],'EXACT_PATH_SET_DRIFT');
for(const limitation of [
  'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
  'NO_PREFIX_WIDE_AUDRALIA_REGISTRATION_AUTHORITY',
  'NO_PREFLIGHT_WAIVER_AUTHORITY',
  'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
])assert.ok(node.authorityLimitations.includes(limitation),`AUTHORITY_LIMITATION_MISSING:${limitation}`);

const loaded=loadHEarthRepositoryRegistryValidatorDependencies();
assert.equal(loaded.loaderId,'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v31_AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_EXACT_PATH_RECOGNITION_SUCCESSOR','LOADER_ID_MISMATCH');
assert.equal(loaded.successorIntegrityVerified,true,'LOADER_SUCCESSOR_INTEGRITY_FAILURE');
assert.equal(loaded.audraliaTabletSingleContextRuntimePathRecognitionVerification.eligible,true,'LOADER_RECOGNITION_NOT_ELIGIBLE');
assert.equal(loaded.audraliaCloudGlobalizationExperienceReceiptPathRecognitionVerification.eligible,true,'PREDECESSOR_V30_RECEIPT_RECOGNITION_NOT_PRESERVED');
assert.equal(loaded.audraliaTabletCloudPassPathRecognitionVerification.eligible,true,'PREDECESSOR_CLOUD_PASS_RECOGNITION_NOT_PRESERVED');
assert.equal(loaded.boundary.audraliaTabletSingleContextRuntimeExactPathRecognitionOnly,true,'EXACT_PATH_BOUNDARY_MISSING');
assert.equal(loaded.boundary.audraliaTabletSingleContextRuntimeProductMutationAuthorityCreated,false,'PRODUCT_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletSingleContextRuntimePrefixWideRegistrationAuthorityCreated,false,'PREFIX_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletSingleContextRuntimePreflightWaiverAuthorityCreated,false,'PREFLIGHT_WAIVER_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletSingleContextRuntimeDeploymentPublicationAuthorityCreated,false,'PUBLICATION_AUTHORITY_LEAK');
assert.equal(loaded.stoppingCondition.audraliaTabletSingleContextRuntimeProductMutationAuthorized,false,'PRODUCT_MUTATION_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletSingleContextRuntimePrefixWideRegistrationAuthorized,false,'PREFIX_REGISTRATION_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletSingleContextRuntimePreflightWaiverAuthorized,false,'PREFLIGHT_WAIVER_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletSingleContextRuntimeDeploymentPublicationAuthorized,false,'PUBLICATION_AUTHORIZED');

const receipt=Object.freeze({
  schema:'H_EARTH_AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_PATH_RECOGNITION_VERIFICATION_RECEIPT_v1',
  result:'PASS',
  operationId:OPERATION_ID,
  generation:GENERATION,
  governingHead:GOVERNING_HEAD,
  targetPath:TARGET,
  targetGitBlob:TARGET_GIT_BLOB,
  checks:Object.freeze({
    exactPathResolved:true,
    currentMainOccurrenceBound:true,
    governingBlobVerified:true,
    workingTreeProductByteStable:true,
    noPrefixRegistration:true,
    inheritedRegistryPreserved:true,
    predecessorV30RecognitionPreserved:true,
    validatorLoaderIntegrated:true,
    registrationAuthorityAuditOnly:true,
    registrationEffectPathResolutionOnly:true,
    productRuntimeMutationAuthorityCreated:false,
    preflightWaiverAuthorityCreated:false,
    mergeDeploymentPublicationAuthorityCreated:false
  })
});
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
