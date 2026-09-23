import assert from 'node:assert/strict';
import registryFacade,{verifyHEarthAudraliaTabletCloudPassPathRecognition} from '../accepted-amendments/h-earth.repository-registry.audralia-tablet-cloud-pass-path-recognition.js';
import {loadHEarthRepositoryRegistryValidatorDependencies} from '../h-earth.repository-registry.validator-engine.loader.js';

const TARGET='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const GOVERNING_HEAD='521c4b146337e16c784b9f3f0a6bb94045b756b5';
const TARGET_GIT_BLOB='22283fa328ed0a39ea3b013232821713262a7106';

const verification=verifyHEarthAudraliaTabletCloudPassPathRecognition();
assert.equal(verification.eligible,true,'PATH_RECOGNITION_NOT_ELIGIBLE');
assert.equal(verification.governingHead,GOVERNING_HEAD,'GOVERNING_HEAD_MISMATCH');
assert.equal(verification.targetPath,TARGET,'TARGET_PATH_MISMATCH');
assert.equal(verification.targetGitBlob,TARGET_GIT_BLOB,'TARGET_BLOB_MISMATCH');
assert.ok(Object.values(verification.checks).every(Boolean),'RECOGNITION_CHECK_FAILURE');

const resolution=registryFacade.resolveHEarthRepositoryRegistryPath(TARGET);
assert.equal(resolution.resolved,true,'TARGET_PATH_UNRESOLVED');
assert.ok(resolution.nodes.some(node=>node.nodeId==='H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SCOPE'),'TARGET_NODE_MISSING');
assert.ok(resolution.occurrences.some(occurrence=>occurrence.path===TARGET&&occurrence.commitSha===GOVERNING_HEAD&&occurrence.gitBlobSha===TARGET_GIT_BLOB),'TARGET_OCCURRENCE_MISSING');
assert.equal(registryFacade.resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/terrain-estate-construction-v1/').resolved===true&&registryFacade.resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/terrain-estate-construction-v1/').nodes.some(node=>node.nodeId==='H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SCOPE'),false,'PREFIX_WIDE_REGISTRATION_DETECTED');

const loaded=loadHEarthRepositoryRegistryValidatorDependencies();
assert.equal(loaded.loaderId,'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v29_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SUCCESSOR','LOADER_ID_MISMATCH');
assert.equal(loaded.successorIntegrityVerified,true,'LOADER_SUCCESSOR_INTEGRITY_FAILURE');
assert.equal(loaded.audraliaTabletCloudPassPathRecognitionVerification.eligible,true,'LOADER_RECOGNITION_NOT_ELIGIBLE');
assert.equal(loaded.boundary.audraliaTabletCloudPassProductMutationAuthorityCreated,false,'PRODUCT_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletCloudPassGeneration2161Expanded,false,'GEN2161_EXPANSION_DETECTED');
assert.equal(loaded.stoppingCondition.audraliaTabletCloudPassProductMutationAuthorized,false,'PRODUCT_MUTATION_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletCloudPassGeneration2161ExpansionAuthorized,false,'GEN2161_EXPANSION_AUTHORIZED');

const receipt=Object.freeze({
  schema:'H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_VERIFICATION_RECEIPT_v1',
  result:'PASS',
  operationId:'H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_V1_20260912_001',
  generation:2166,
  governingHead:GOVERNING_HEAD,
  targetPath:TARGET,
  targetGitBlob:TARGET_GIT_BLOB,
  checks:Object.freeze({
    exactPathResolved:true,currentMainOccurrenceBound:true,noPrefixRegistration:true,
    inheritedRegistryPreserved:true,validatorLoaderIntegrated:true,
    productRuntimeMutationAuthorityCreated:false,generation2161Expanded:false,
    workflowMutationAuthorityCreated:false,deploymentPublicationAuthorityCreated:false
  })
});
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
