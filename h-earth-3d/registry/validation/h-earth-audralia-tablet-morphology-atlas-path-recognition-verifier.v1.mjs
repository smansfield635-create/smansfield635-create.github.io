import assert from 'node:assert/strict';
import registryFacade,{verifyHEarthAudraliaTabletMorphologyAtlasPathRecognition} from '../accepted-amendments/h-earth.repository-registry.audralia-tablet-morphology-atlas-path-recognition.js';
import {loadHEarthRepositoryRegistryValidatorDependencies} from '../h-earth.repository-registry.validator-engine.loader.js';

const OPERATION_ID='AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_20260913_001';
const GENERATION=2193;
const GOVERNING_MAIN='57e81ded57a4a0e9c4c3de22ca4de1d91dae52e9';
const FROZEN_CANDIDATE='adc18db3bc3da9ad1928f88b6f83e6ae3b7f7b3d';
const CANDIDATE_BLOB='a6434818b083036cee6a346395a47e6cc744229c';
const TARGET='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-weather-morphology-atlas-v1.mjs';
const PREFIX='/showroom/globe/h-earth/terrain-estate-construction-v1/';
const NODE_ID='H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_EXACT_PATH_RECOGNITION_SCOPE';

const verification=verifyHEarthAudraliaTabletMorphologyAtlasPathRecognition();
assert.equal(verification.eligible,true,'PATH_RECOGNITION_NOT_ELIGIBLE');
assert.equal(verification.governingMain,GOVERNING_MAIN,'GOVERNING_MAIN_MISMATCH');
assert.equal(verification.frozenCandidate,FROZEN_CANDIDATE,'FROZEN_CANDIDATE_MISMATCH');
assert.equal(verification.candidateBlob,CANDIDATE_BLOB,'CANDIDATE_BLOB_MISMATCH');
assert.equal(verification.targetPath,TARGET,'TARGET_PATH_MISMATCH');
assert.ok(Object.values(verification.checks).every(Boolean),'RECOGNITION_CHECK_FAILURE');

const resolution=registryFacade.resolveHEarthRepositoryRegistryPath(TARGET);
assert.equal(resolution.resolved,true,'TARGET_PATH_UNRESOLVED');
assert.ok((resolution.nodes??[]).some(node=>node.nodeId===NODE_ID),'TARGET_NODE_MISSING');
assert.ok((resolution.occurrences??[]).some(entry=>entry.path===TARGET&&entry.commitSha===GOVERNING_MAIN&&entry.existenceStatus==='ABSENT'&&entry.gitBlobSha===null),'TRUTHFUL_ABSENT_OCCURRENCE_MISSING');

const prefixResolution=registryFacade.resolveHEarthRepositoryRegistryPath(PREFIX);
assert.equal((prefixResolution.nodes??[]).some(node=>node.nodeId===NODE_ID),false,'PREFIX_WIDE_REGISTRATION_DETECTED');

const node=registryFacade.getHEarthRepositoryRegistryNode(NODE_ID);
assert.equal(node.authorityClass,'AUDIT_ONLY','AUTHORITY_CLASS_DRIFT');
assert.equal(node.authorityPosture,'EXACT_PATH_RESOLUTION_ONLY','AUTHORITY_POSTURE_DRIFT');
assert.equal(node.registrationEffect,'PATH_RESOLUTION_ONLY','REGISTRATION_EFFECT_DRIFT');
assert.deepEqual(node.repositoryPaths,[TARGET],'EXACT_PATH_SET_DRIFT');
for(const limitation of [
  'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
  'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
  'NO_PREFIX_WIDE_AUDRALIA_REGISTRATION_AUTHORITY',
  'NO_PREFLIGHT_WAIVER_AUTHORITY',
  'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
])assert.ok(node.authorityLimitations.includes(limitation),`AUTHORITY_LIMITATION_MISSING:${limitation}`);

const evidence=registryFacade.getHEarthRepositoryRegistryEvidence('EVIDENCE_H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_v1');
assert.equal(evidence.governingMain,GOVERNING_MAIN,'EVIDENCE_GOVERNING_MAIN_DRIFT');
assert.equal(evidence.frozenCandidate,FROZEN_CANDIDATE,'EVIDENCE_FROZEN_CANDIDATE_DRIFT');
assert.equal(evidence.candidateBlob,CANDIDATE_BLOB,'EVIDENCE_CANDIDATE_BLOB_DRIFT');
assert.equal(evidence.targetPath,TARGET,'EVIDENCE_TARGET_PATH_DRIFT');
assert.equal(evidence.registrationEffect,'PATH_RESOLUTION_ONLY','EVIDENCE_REGISTRATION_EFFECT_DRIFT');

const loaded=loadHEarthRepositoryRegistryValidatorDependencies();
assert.equal(loaded.loaderId,'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v32_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_EXACT_PATH_RECOGNITION_SUCCESSOR','LOADER_ID_MISMATCH');
assert.equal(loaded.successorIntegrityVerified,true,'LOADER_SUCCESSOR_INTEGRITY_FAILURE');
assert.equal(loaded.audraliaTabletMorphologyAtlasPathRecognitionVerification.eligible,true,'LOADER_ATLAS_RECOGNITION_NOT_ELIGIBLE');
assert.equal(loaded.audraliaTabletSingleContextRuntimePathRecognitionVerification.eligible,true,'PREDECESSOR_V31_RUNTIME_RECOGNITION_NOT_PRESERVED');
assert.equal(loaded.audraliaCloudGlobalizationExperienceReceiptPathRecognitionVerification.eligible,true,'PREDECESSOR_V30_RECEIPT_RECOGNITION_NOT_PRESERVED');
assert.equal(loaded.audraliaTabletCloudPassPathRecognitionVerification.eligible,true,'PREDECESSOR_CLOUD_PASS_RECOGNITION_NOT_PRESERVED');
assert.equal(loaded.boundary.audraliaTabletMorphologyAtlasExactPathRecognitionOnly,true,'ATLAS_EXACT_PATH_BOUNDARY_MISSING');
assert.equal(loaded.boundary.audraliaTabletMorphologyAtlasProductMutationAuthorityCreated,false,'PRODUCT_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletMorphologyAtlasPrefixWideRegistrationAuthorityCreated,false,'PREFIX_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletMorphologyAtlasPreflightWaiverAuthorityCreated,false,'PREFLIGHT_WAIVER_AUTHORITY_LEAK');
assert.equal(loaded.boundary.audraliaTabletMorphologyAtlasDeploymentPublicationAuthorityCreated,false,'PUBLICATION_AUTHORITY_LEAK');
assert.equal(loaded.stoppingCondition.audraliaTabletMorphologyAtlasProductMutationAuthorized,false,'PRODUCT_MUTATION_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletMorphologyAtlasPrefixWideRegistrationAuthorized,false,'PREFIX_REGISTRATION_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletMorphologyAtlasPreflightWaiverAuthorized,false,'PREFLIGHT_WAIVER_AUTHORIZED');
assert.equal(loaded.stoppingCondition.audraliaTabletMorphologyAtlasDeploymentPublicationAuthorized,false,'PUBLICATION_AUTHORIZED');

const receipt=Object.freeze({
  schema:'H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_VERIFICATION_RECEIPT_v1',
  result:'PASS',
  operationId:OPERATION_ID,
  generation:GENERATION,
  governingMain:GOVERNING_MAIN,
  frozenCandidate:FROZEN_CANDIDATE,
  candidateBlob:CANDIDATE_BLOB,
  targetPath:TARGET,
  checks:Object.freeze({
    exactPathResolved:true,
    truthfulAbsentAtGoverningMain:true,
    frozenCandidateAndBlobBound:true,
    noPrefixRegistration:true,
    inheritedRegistryPreserved:true,
    predecessorV31RecognitionPreserved:true,
    validatorLoaderIntegrated:true,
    registrationAuthorityAuditOnly:true,
    registrationEffectPathResolutionOnly:true,
    productRuntimeMutationAuthorityCreated:false,
    preflightWaiverAuthorityCreated:false,
    mergeDeploymentPublicationAuthorityCreated:false
  })
});
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
