/** GCR2 Gen2821 v34: thin successor to unmodified v33 registry loader. */
import {loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,runHEarthC2R1MC5AutomaticRegistryPreflight} from './h-earth.repository-registry.validator-engine.loader.pre-gcr2-exact-proof-path-recognition.js';
import newestFacade,{verifyGCR2ProofPathRecognition} from './accepted-amendments/h-earth.repository-registry.gcr2-exact-proof-path-recognition.js';
import {deepFreeze} from './h-earth.repository-registry.validator-engine.identity.js';
export function loadHEarthRepositoryRegistryValidatorDependencies(){
 const base=loadBaseDependencies(),verification=verifyGCR2ProofPathRecognition();
 const registryInstance=newestFacade.getHEarthRepositoryRegistryInstance(),discovery=newestFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
 const checks=deepFreeze({
  exactPredecessorLoaderId:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v33_FD05_DIAGNOSTIC_EXACT_PATH_RECOGNITION_SUCCESSOR',
  predecessorSuccessorIntegrityUnchanged:base.successorIntegrityVerified===true,
  priorIdentityTruthPreserved:base.identityVerified===false,
  registryIdentityUnchanged:registryInstance.registryId===base.registryInstance.registryId&&registryInstance.registryVersion===base.registryInstance.registryVersion&&registryInstance.schemaId===base.registryInstance.schemaId&&discovery.candidateGitBlobSha===base.discovery.candidateGitBlobSha,
  overlayExactFourVerified:verification.eligible===true
 });
 const successorIntegrityVerified=Object.values(checks).every(Boolean);
 return deepFreeze({
  ...base,loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v34_GCR2_FOUR_PROOF_PATH_RECOGNITION_SUCCESSOR',
  registryFacade:newestFacade,registryInstance,discovery,identityVerified:base.identityVerified,
  predecessorLoaderIdentityVerified:base.successorIntegrityVerified===true,
  inheritedIdentityPreserved:base.identityVerified===false,successorIntegrityVerified,
  gcr2ProofPathRecognitionVerification:verification,gcr2ProofPathRecognitionChecks:checks,
  identityChecks:deepFreeze({...base.identityChecks,gcr2ProofPathsRecognized:verification.eligible===true,gcr2PredecessorIdentityPreserved:checks.priorIdentityTruthPreserved}),
  boundary:deepFreeze({...base.boundary,gcr2FourExactPathRecognitionOnly:true,gcr2SourceMutationAuthorityCreated:false,gcr2ProductMutationAuthorityCreated:false,gcr2PrefixWideRegistrationAuthorityCreated:false,gcr2PreflightWaiverAuthorityCreated:false,gcr2PublicationAuthorityCreated:false}),
  stoppingCondition:deepFreeze({...base.stoppingCondition,gcr2FourPathsLoaded:true,gcr2PredecessorPreserved:successorIntegrityVerified,gcr2ProductMutationAuthorized:false,gcr2ReleaseAuthorized:false})
 });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
